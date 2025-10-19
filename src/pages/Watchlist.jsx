import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState([])
    const [stockData, setStockData] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [filterBy, setFilterBy] = useState('all') // all, gainers, losers
    const [sortBy, setSortBy] = useState('symbol') // symbol, price, change
    const navigate = useNavigate()

    // Load watchlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('watchlist')
        if (saved) {
            const symbols = JSON.parse(saved)
            setWatchlist(symbols)
            fetchStockData(symbols)
        }
    }, [])

    // Fetch real-time data for watchlist stocks
    const fetchStockData = async (symbols) => {
        const data = {}
        for (const symbol of symbols) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/stock/${symbol}`)
                data[symbol] = {
                    price: response.data.c,
                    change: response.data.d,
                    changePercent: response.data.dp,
                    high: response.data.h,
                    low: response.data.l,
                    open: response.data.o,
                    prevClose: response.data.pc
                }
            } catch (error) {
                console.error(`Error fetching ${symbol}:`, error)
                data[symbol] = { error: true }
            }
        }
        setStockData(data)
    }

    // Search for stocks to add
    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/api/search`, {
                params: { q: searchQuery.trim() }
            })
            setSearchResults(response.data.results || [])
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }

    // Add stock to watchlist
    const addToWatchlist = (symbol) => {
        if (watchlist.includes(symbol)) {
            alert(`${symbol} is already in your watchlist`)
            return
        }

        const updated = [...watchlist, symbol]
        setWatchlist(updated)
        localStorage.setItem('watchlist', JSON.stringify(updated))
        fetchStockData(updated)
        setSearchQuery('')
        setSearchResults([])
    }

    // Remove stock from watchlist
    const removeFromWatchlist = (symbol) => {
        const updated = watchlist.filter(s => s !== symbol)
        setWatchlist(updated)
        localStorage.setItem('watchlist', JSON.stringify(updated))

        const newData = { ...stockData }
        delete newData[symbol]
        setStockData(newData)
    }

    // Filter and sort watchlist
    const getFilteredAndSortedWatchlist = () => {
        let filtered = [...watchlist]

        // Apply filter
        if (filterBy === 'gainers') {
            filtered = filtered.filter(symbol =>
                stockData[symbol] && stockData[symbol].changePercent > 0
            )
        } else if (filterBy === 'losers') {
            filtered = filtered.filter(symbol =>
                stockData[symbol] && stockData[symbol].changePercent < 0
            )
        }

        // Apply sort
        filtered.sort((a, b) => {
            const dataA = stockData[a] || {}
            const dataB = stockData[b] || {}

            if (sortBy === 'price') {
                return (dataB.price || 0) - (dataA.price || 0)
            } else if (sortBy === 'change') {
                return (dataB.changePercent || 0) - (dataA.changePercent || 0)
            } else {
                return a.localeCompare(b) // symbol
            }
        })

        return filtered
    }

    const filteredWatchlist = getFilteredAndSortedWatchlist()

    return (
        <div className="page">
            <h1 style={{ marginBottom: '0.5rem' }}>📋 My Watchlist</h1>
            <p className="muted" style={{ marginBottom: '1.5rem' }}>
                Track your favorite stocks • {watchlist.length} stocks in watchlist
            </p>

            {/* Search and Add Stocks */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>➕ Add Stocks to Watchlist</h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search stocks (e.g., Apple, TSLA, Reliance)"
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            flex: 1,
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !searchQuery.trim()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading || !searchQuery.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 600,
                            opacity: loading || !searchQuery.trim() ? 0.5 : 1
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        marginTop: '1rem'
                    }}>
                        {searchResults.slice(0, 10).map((stock, index) => (
                            <div
                                key={`${stock.symbol}-${index}`}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderBottom: index < searchResults.length - 1 ? '1px solid #e5e7eb' : 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#fff'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                            >
                                <div>
                                    <div style={{ fontWeight: 700 }}>{stock.symbol}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{stock.description}</div>
                                </div>
                                <button
                                    onClick={() => addToWatchlist(stock.symbol)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: watchlist.includes(stock.symbol) ? '#e5e7eb' : '#16a34a',
                                        color: watchlist.includes(stock.symbol) ? '#6b7280' : '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: watchlist.includes(stock.symbol) ? 'not-allowed' : 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}
                                    disabled={watchlist.includes(stock.symbol)}
                                >
                                    {watchlist.includes(stock.symbol) ? '✓ Added' : '+ Add'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filters and Sorting */}
            {watchlist.length > 0 && (
                <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6b7280' }}>Filter:</span>
                            <button
                                onClick={() => setFilterBy('all')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: filterBy === 'all' ? '#000' : '#fff',
                                    color: filterBy === 'all' ? '#fff' : '#000',
                                    border: '1px solid #000',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}
                            >
                                All ({watchlist.length})
                            </button>
                            <button
                                onClick={() => setFilterBy('gainers')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: filterBy === 'gainers' ? '#16a34a' : '#fff',
                                    color: filterBy === 'gainers' ? '#fff' : '#16a34a',
                                    border: '1px solid #16a34a',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}
                            >
                                📈 Gainers
                            </button>
                            <button
                                onClick={() => setFilterBy('losers')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: filterBy === 'losers' ? '#dc2626' : '#fff',
                                    color: filterBy === 'losers' ? '#fff' : '#dc2626',
                                    border: '1px solid #dc2626',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}
                            >
                                📉 Losers
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6b7280' }}>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="symbol">Symbol (A-Z)</option>
                                <option value="price">Price (High-Low)</option>
                                <option value="change">Change % (High-Low)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Watchlist Display */}
            {watchlist.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Your watchlist is empty</h3>
                    <p className="muted">Search and add stocks to track them here</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {filteredWatchlist.map(symbol => {
                        const data = stockData[symbol] || {}
                        const isPositive = (data.changePercent || 0) >= 0

                        return (
                            <div
                                key={symbol}
                                className="card"
                                style={{
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    border: '1px solid #e5e7eb'
                                }}
                                onClick={() => navigate(`/stock/${symbol}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                            {symbol}
                                        </div>
                                        {data.error ? (
                                            <div style={{ fontSize: '0.85rem', color: '#dc2626' }}>Failed to load</div>
                                        ) : data.price ? (
                                            <>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                                    ${data.price.toFixed(2)}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    color: isPositive ? '#16a34a' : '#dc2626',
                                                    background: isPositive ? '#f0fdf4' : '#fef2f2',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    {isPositive ? '▲' : '▼'} {Math.abs(data.changePercent || 0).toFixed(2)}%
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Loading...</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFromWatchlist(symbol)
                                        }}
                                        style={{
                                            padding: '0.5rem',
                                            background: '#fef2f2',
                                            color: '#dc2626',
                                            border: '1px solid #fecaca',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                        }}
                                        title="Remove from watchlist"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {data.high && data.low && (
                                    <div style={{
                                        borderTop: '1px solid #e5e7eb',
                                        paddingTop: '0.75rem',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.5rem',
                                        fontSize: '0.8rem'
                                    }}>
                                        <div>
                                            <div style={{ color: '#6b7280' }}>High</div>
                                            <div style={{ fontWeight: 600 }}>${data.high.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#6b7280' }}>Low</div>
                                            <div style={{ fontWeight: 600 }}>${data.low.toFixed(2)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
