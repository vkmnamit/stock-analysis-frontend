import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Crypto() {
    const [cryptos, setCryptos] = useState([
        { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin', displaySymbol: 'BTC', price: null },
        { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum', displaySymbol: 'ETH', price: null },
        { symbol: 'BINANCE:BNBUSDT', name: 'Binance Coin', displaySymbol: 'BNB', price: null },
        { symbol: 'BINANCE:SOLUSDT', name: 'Solana', displaySymbol: 'SOL', price: null }
    ])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch prices for all cryptos
        const fetchPrices = async () => {
            const promises = cryptos.map(crypto =>
                axios.get(`http://localhost:5001/api/crypto/${crypto.symbol}`)
                    .then(res => ({ ...crypto, price: res.data.c }))
                    .catch(err => {
                        console.error(`Error fetching ${crypto.name}:`, err)
                        return { ...crypto, price: null }
                    })
            )

            const results = await Promise.all(promises)
            setCryptos(results)
            setLoading(false)
        }

        fetchPrices()
    }, [])

    return (
        <div className="page">
            <h1>Cryptocurrency Prices</h1>
            {loading && <p>Loading prices...</p>}
            <div className="list">
                {cryptos.map(c => (
                    <div key={c.symbol} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>{c.displaySymbol}</div>
                            <div className="muted">{c.name}</div>
                        </div>
                        <div style={{ fontSize: '1.25rem' }}>
                            {c.price ? `$${c.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
