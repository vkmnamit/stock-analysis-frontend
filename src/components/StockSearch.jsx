import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function StockSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [filterType, setFilterType] = useState('all')
    const [filterExchange, setFilterExchange] = useState('all')
    const navigate = useNavigate()

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setSearched(true)

        try {
            const response = await axios.get(`${API_BASE_URL}/api/search`, {
                params: { q: query.trim() }
            })
            setResults(response.data.results || [])
        } catch (error) {
            console.error('Search error:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleStockClick = (symbol) => {
        navigate(`/stock/${symbol}`)
        setQuery('')
        setResults([])
        setSearched(false)
        setFilterType('all')
        setFilterExchange('all')
    }

    // Filter results based on selected filters
    const filteredResults = useMemo(() => {
        let filtered = [...results]

        // Filter by stock type
        if (filterType !== 'all') {
            filtered = filtered.filter(stock =>
                stock.type && stock.type.toLowerCase().includes(filterType.toLowerCase())
            )
        }

        // Filter by exchange
        if (filterExchange !== 'all') {
            filtered = filtered.filter(stock => {
                const symbol = stock.symbol || ''
                if (filterExchange === 'us') {
                    return !symbol.includes('.') || symbol.includes('.US')
                } else if (filterExchange === 'india') {
                    return symbol.includes('.NS') || symbol.includes('.BO')
                } else {
                    return symbol.includes(`.${filterExchange.toUpperCase()}`)
                }
            })
        }

        return filtered
    }, [results, filterType, filterExchange])

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔍 Global Stock Search
                </h2>
                <p className="muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Search stocks from around the world including US, India, Europe, Asia and more
                </p>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter company name or symbol (e.g., Apple, RELIANCE, TCS)"
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #000',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 600,
                            opacity: loading || !query.trim() ? 0.5 : 1
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {searched && (
                    <div style={{ marginTop: '1rem' }}>
                        {loading ? (
                            <p className="muted">Searching...</p>
                        ) : results.length > 0 ? (
                            <>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                }}>
                                    <p style={{ fontSize: '0.9rem', margin: 0 }}>
                                        Showing {filteredResults.length} of {results.length} results
                                    </p>

                                    {/* Filters */}
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Type:</span>
                                            <select
                                                value={filterType}
                                                onChange={(e) => setFilterType(e.target.value)}
                                                style={{
                                                    padding: '0.4rem 0.6rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    background: '#fff'
                                                }}
                                            >
                                                <option value="all">All Types</option>
                                                <option value="common stock">Common Stock</option>
                                                <option value="etf">ETF</option>
                                                <option value="adr">ADR</option>
                                                <option value="preferred">Preferred</option>
                                            </select>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Region:</span>
                                            <select
                                                value={filterExchange}
                                                onChange={(e) => setFilterExchange(e.target.value)}
                                                style={{
                                                    padding: '0.4rem 0.6rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    background: '#fff'
                                                }}
                                            >
                                                <option value="all">All Regions</option>
                                                <option value="us">🇺🇸 US Stocks</option>
                                                <option value="india">🇮🇳 India (.NS/.BO)</option>
                                                <option value="l">🇬🇧 London (.L)</option>
                                                <option value="t">🇯🇵 Tokyo (.T)</option>
                                                <option value="hk">🇭🇰 Hong Kong (.HK)</option>
                                            </select>
                                        </div>

                                        {(filterType !== 'all' || filterExchange !== 'all') && (
                                            <button
                                                onClick={() => {
                                                    setFilterType('all')
                                                    setFilterExchange('all')
                                                }}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    background: '#f3f4f6',
                                                    color: '#374151',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc' }}>
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((stock, index) => (
                                            <div
                                                key={`${stock.symbol}-${index}`}
                                                onClick={() => handleStockClick(stock.symbol)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    borderBottom: index < filteredResults.length - 1 ? '1px solid #eee' : 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s',
                                                    background: '#fff'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                                            {stock.displaySymbol || stock.symbol}
                                                        </div>
                                                        <div className="muted" style={{ fontSize: '0.85rem' }}>
                                                            {stock.description}
                                                        </div>
                                                    </div>
                                                    <div className="muted" style={{
                                                        fontSize: '0.8rem',
                                                        marginLeft: '1rem',
                                                        padding: '0.25rem 0.5rem',
                                                        background: '#f3f4f6',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {stock.type}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            No stocks match the selected filters. Try adjusting your filters.
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="muted">
                                No results found for "{query}". Try searching for company names like "Apple", "Reliance", "TCS" or symbols like "AAPL", "RELIANCE.NS"
                            </p>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff9e6', border: '1px solid #ffd700' }}>
                    <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', fontWeight: 600, color: '#d97706' }}>
                        ⚠️ Important: Supported Exchanges
                    </p>
                    <ul style={{ fontSize: '0.8rem', margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
                        <li><strong>Full Support:</strong> US stocks work best (AAPL, GOOGL, TSLA, MSFT)</li>
                        <li><strong>Limited:</strong> Indian NSE (.NS) stocks show in search but may have limited data</li>
                        <li><strong>Not Supported:</strong> Some exchanges like .BE, .BO may not have real-time data</li>
                        <li>💡 Tip: Search by company name (e.g., "Tesla", "Apple") to find all symbols</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
