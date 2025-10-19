import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import StockCard from '../components/StockCard'
import NewsFeed from '../components/NewsFeed'
import StockSearch from '../components/StockSearch'
import { API_BASE_URL } from '../config'

export default function Home() {
    const navigate = useNavigate()
    const [marketNews, setMarketNews] = useState([])
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX']

    useEffect(() => {
        // axios.get(`${API_BASE_URL}/api/market-news`)
        //     .then(res => setMarketNews(res.data.slice(0, 8)))
        //     .catch(err => console.error('News error:', err))

        const res = async () => {
            const data = await axios.get(`${API_BASE_URL}/api/market-news`)
            setMarketNews(data.data.slice(0, 8))
            console.log("Market News Data:", data)
        }

        res()
    }, [])

    return (
        <div className="page">
            {/* Hero Section */}
            <div style={{
                background: 'white',
                padding: '3rem 2rem',
                width: '100%',
                borderRadius: '12px',
                marginBottom: '2rem',
                color: '#000000ff'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: '#000000ff'
                }}>
                    Stock Market Dashboard
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    opacity: 0.9,
                    marginBottom: '1.5rem'
                }}>
                    Track top tech stocks with real-time data • Search global markets • Build your watchlist
                </p>
                <button
                    onClick={() => navigate('/watchlist')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'
                    }}
                >
                    View My Watchlist →
                </button>
            </div>

            <StockSearch />

            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                Top Tech Stocks
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem'
            }}>
                {symbols.map(sym => (
                    <StockCard key={sym} symbol={sym} onClick={() => navigate(`/stock/${sym}`)} />
                ))}
            </div>

            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                Latest Market News
            </h2>
            <NewsFeed news={marketNews} />
        </div>
    )
}
