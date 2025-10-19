import React, { useState, useEffect } from 'react'
import axios from 'axios'
import StockCard from '../components/StockCard'

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState([])
    const [newSymbol, setNewSymbol] = useState('')

    useEffect(() => {
        fetchWatchlist()
    }, [])

    const fetchWatchlist = () => {
        axios.get('http://localhost:5001/api/watchlist')
            .then(res => setWatchlist(res.data))
            .catch(err => console.error('Watchlist error:', err))
    }

    const addSymbol = () => {
        if (!newSymbol.trim()) return
        axios.post('http://localhost:5001/api/watchlist', { symbol: newSymbol.toUpperCase() })
            .then(() => {
                fetchWatchlist()
                setNewSymbol('')
            })
            .catch(err => console.error('Add error:', err))
    }

    const removeSymbol = (symbol) => {
        axios.delete(`http://localhost:5001/api/watchlist/${symbol}`)
            .then(() => fetchWatchlist())
            .catch(err => console.error('Remove error:', err))
    }

    return (
        <div className="page">
            <h1>My Watchlist</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="Enter symbol (e.g., AAPL)"
                    style={{ padding: '0.5rem', border: '1px solid #000', flex: 1 }}
                />
                <button onClick={addSymbol}>Add</button>
            </div>
            <div className="list">
                {watchlist.length === 0 && <p className="muted">Your watchlist is empty</p>}
                {watchlist.map(symbol => (
                    <div key={symbol} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700 }}>{symbol}</div>
                        <button onClick={() => removeSymbol(symbol)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
