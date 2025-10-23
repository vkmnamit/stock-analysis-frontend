import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function Crypto() {
    const [cryptos, setCryptos] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(null)

    // Fetch all crypto data from the new endpoint
    const fetchCryptos = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_BASE_URL}/api/crypto-list`)
            setCryptos(res.data.cryptos || [])
            setLastUpdated(res.data.lastUpdated)
        } catch (err) {
            console.error('Error fetching crypto list:', err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCryptos()
    }, [])

    useEffect(() => {
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchCryptos, 30000)
        return () => clearInterval(interval)
    }, [])
    return (
        <div className="page">
            <h1>Cryptocurrency Market</h1>
            <p className="muted" style={{ marginBottom: '1.5rem' }}>
                Live prices • Auto-refreshes every 30 seconds
                {lastUpdated && <span> • Last updated: {new Date(lastUpdated).toLocaleTimeString()}</span>}
            </p>

            {loading && <p>Loading cryptocurrency prices...</p>}

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {cryptos.map((c) => {
                    const changePercent = c.changePercent?.toFixed(2)
                    const isPositive = c.changePercent >= 0

                    return (
                        <div
                            key={c.symbol}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: '1px solid #e0e0e0'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{c.symbol}</div>
                                            <div className="muted" style={{ fontSize: '0.85rem' }}>{c.name}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                        {c.price ? `$${c.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: c.price < 1 ? 4 : 2 })}` : '--'}
                                    </div>
                                    {changePercent && (
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: isPositive ? '#16a34a' : '#dc2626',
                                            background: isPositive ? '#f0fdf4' : '#fef2f2',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            marginTop: '0.25rem'
                                        }}>
                                            {isPositive ? '▲' : '▼'} {Math.abs(changePercent)}%
                                        </div>
                                    )}
                                </div>
                            </div>

                            {c.high && c.low && (
                                <div style={{
                                    borderTop: '1px solid #e0e0e0',
                                    paddingTop: '0.75rem',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.5rem',
                                    fontSize: '0.85rem'
                                }}>
                                    <div>
                                        <div className="muted">24h High</div>
                                        <div style={{ fontWeight: 600 }}>${c.high.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="muted">24h Low</div>
                                        <div style={{ fontWeight: 600 }}>${c.low.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}

                            {c.change && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                    24h Change: <span style={{ fontWeight: 600, color: c.change >= 0 ? '#16a34a' : '#dc2626' }}>
                                        ${Math.abs(c.change).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {!loading && cryptos.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <h3>No cryptocurrency data available</h3>
                    <p className="muted">Unable to fetch crypto prices. Please try again later.</p>
                </div>
            )}
        </div>
    )
}

