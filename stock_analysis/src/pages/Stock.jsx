import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Chart from '../components/Chart'
import IndicatorTable from '../components/IndicatorTable'
import { API_BASE_URL } from '../config'

export default function Stock() {
    const { symbol } = useParams()
    const [quote, setQuote] = useState(null)
    const [company, setCompany] = useState(null)
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        if (!symbol) return

        // Fetch quote
        axios.get(`${API_BASE_URL}/api/stock/${symbol}`)
            .then(res => setQuote(res.data))
            .catch(err => console.error('Quote error:', err))

        // Fetch company profile
        axios.get(`${API_BASE_URL}/api/company/${symbol}`)
            .then(res => setCompany(res.data))
            .catch(err => console.error('Company error:', err))

        // Fetch real candle data (last 30 days, daily resolution)
        const to = Math.floor(Date.now() / 1000)
        const from = to - (30 * 24 * 60 * 60) // 30 days ago

        axios.get(`${API_BASE_URL}/api/candles/${symbol}`, {
            params: { resolution: 'D', from, to }
        })
            .then(res => {
                if (res.data.s === 'ok') {
                    // Transform candle data for chart
                    const data = res.data.t.map((timestamp, i) => ({
                        time: new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        price: res.data.c[i], // closing price
                        open: res.data.o[i],
                        high: res.data.h[i],
                        low: res.data.l[i],
                    }))
                    setChartData(data)
                } else {
                    console.error('No candle data available')
                }
            })
            .catch(err => console.error('Candle error:', err))
    }, [symbol])

    if (!quote) return <div className="page">Loading...</div>

    return (
        <div className="page">
            <h1>{symbol}</h1>
            {company && <p className="muted">{company.name || 'Company'}</p>}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>${quote.c}</div>
                <div className="muted">
                    Open: ${quote.o} | High: ${quote.h} | Low: ${quote.l} | Prev Close: ${quote.pc}
                </div>
            </div>
            <Chart data={chartData} />
            <IndicatorTable symbol={symbol} />
        </div>
    )
}
