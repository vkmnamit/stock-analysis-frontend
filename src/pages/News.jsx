import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsFeed from '../components/NewsFeed'
import { API_BASE_URL } from '../config'

export default function News() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/market-news`)
            .then(res => {
                setNews(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error('News error:', err)
                setLoading(false)
            })
    }, [])

    return (
        <div className="page">
            <h1>📰 Market News & Analysis</h1>
            <p className="muted" style={{ marginBottom: '1.5rem' }}>
                Latest financial news from the past 7 days
            </p>
            {loading ? (
                <p>Loading news...</p>
            ) : news.length > 0 ? (
                <>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Showing {news.length} articles
                    </p>
                    <NewsFeed news={news} />
                </>
            ) : (
                <p className="muted">No news available at the moment.</p>
            )}
        </div>
    )
}
