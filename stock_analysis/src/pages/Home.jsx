import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import StockCard from '../components/StockCard'
import NewsFeed from '../components/NewsFeed'
import { API_BASE_URL } from '../config'

export default function Home() {
    const navigate = useNavigate()
    const [marketNews, setMarketNews] = useState([])
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/market-news`)
            .then(res => setMarketNews(res.data.slice(0, 5)))
            .catch(err => console.error('News error:', err))
    }, [])

    return (
        <div className="page">
            <h1>Stock Market Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {symbols.map(sym => (
                    <StockCard key={sym} symbol={sym} onClick={() => navigate(`/stock/${sym}`)} />
                ))}
            </div>
            <h2>Latest News</h2>
            <NewsFeed news={marketNews} />
        </div>
    )
}
