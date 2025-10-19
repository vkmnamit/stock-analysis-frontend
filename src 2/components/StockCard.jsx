
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function StockCard({ symbol, price, onClick }) {
    const [livePrice, setLivePrice] = useState(price)
    const [loading, setLoading] = useState(!price)

    useEffect(() => {
        if (price) return // If price is provided, use it

        // Fetch real-time price
        axios.get(`${API_BASE_URL}/api/stock/${symbol}`)
            .then(res => {
                setLivePrice(res.data.c)
                setLoading(false)
            })
            .catch(err => {
                console.error('StockCard price error:', err)
                setLoading(false)
            })
    }, [symbol, price])

    return (
        <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div style={{ fontWeight: 700 }}>{symbol}</div>
            <div style={{ fontSize: '1.25rem' }}>
                {loading ? 'Loading...' : `$${livePrice?.toFixed(2) ?? '--'}`}
            </div>
        </div>
    )
}
