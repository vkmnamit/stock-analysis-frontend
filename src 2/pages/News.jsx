import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsFeed from '../components/NewsFeed'

export default function News() {
    const [news, setNews] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5001/api/market-news')
            .then(res => setNews(res.data))
            .catch(err => console.error('News error:', err))
    }, [])

    return (
        <div className="page">
            <h1>Market News</h1>
            <NewsFeed news={news} />
        </div>
    )
}
