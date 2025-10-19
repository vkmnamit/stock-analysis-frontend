import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Chart from '../components/Chart'
import IndicatorTable from '../components/IndicatorTable'
import NewsFeed from '../components/NewsFeed'
import PredictionChart from '../components/PredictionChart'
import { API_BASE_URL } from '../config'

export default function Stock() {
    const { symbol } = useParams()
    const [quote, setQuote] = useState(null)
    const [company, setCompany] = useState(null)
    const [chartData, setChartData] = useState([])
    const [news, setNews] = useState([])
    const [prediction, setPrediction] = useState(null)

    useEffect(() => {
        if (!symbol) return

        // Fetch quote
        axios.get(`${API_BASE_URL}/api/stock/${symbol}`)
            .then(res => setQuote(res.data))
            .catch(err => console.error('Quote error:', err))

        // Fetch company profile
        axios.get(`${API_BASE_URL}/api/company/${symbol}`)
            .then(res => setCompany(res.data))
            .catch(err => {
                console.error('Company error:', err)
                if (err.response && err.response.status === 403) {
                    setCompany({ error: err.response.data.message || 'Stock exchange not supported' })
                }
            })

        // Fetch stock-specific news
        axios.get(`${API_BASE_URL}/api/stock-news/${symbol}`)
            .then(res => setNews(res.data.slice(0, 5)))
            .catch(err => console.error('Stock news error:', err))

        // Fetch AI prediction
        axios.get(`${API_BASE_URL}/api/prediction/${symbol}`)
            .then(res => setPrediction(res.data))
            .catch(err => console.error('Prediction error:', err))

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
                        _mock: res.data._mock // Flag if this is mock data
                    }))
                    setChartData(data)
                } else {
                    console.error('No candle data available')
                }
            })
            .catch(err => {
                console.error('Candle error:', err)
                // Even on error, chart will show with just current price point
            })
    }, [symbol])

    if (!quote) return <div className="page">Loading...</div>

    // Check if we got an error response
    if (company && company.error) {
        return (
            <div className="page">
                <h1>{symbol}</h1>
                <div className="card" style={{ background: '#fff9e6', border: '2px solid #ffd700', padding: '1.5rem' }}>
                    <h3 style={{ color: '#d97706', marginTop: 0 }}>⚠️ Exchange Not Supported</h3>
                    <p style={{ color: '#92400e', marginBottom: '1rem' }}>
                        {company.error}
                    </p>
                    <div style={{ background: '#fff', padding: '1rem', borderRadius: '4px' }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>✅ Fully Supported:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li>US Stocks: AAPL, GOOGL, TSLA, MSFT, AMZN, META, NVDA, etc.</li>
                        </ul>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            The free API tier has limited support for international exchanges. Please try a US stock symbol.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const changePercent = ((quote.c - quote.pc) / quote.pc * 100).toFixed(2)
    const isPositive = changePercent >= 0

    return (
        <div className="page">
            {/* Header Section */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{symbol}</h1>
                {company && !company.error && (
                    <p className="muted" style={{ fontSize: '1rem' }}>
                        {company.name || 'Company'} • {company.country || 'N/A'} • {company.exchange || 'N/A'}
                    </p>
                )}
            </div>

            {/* Price Card - Modern & Minimal */}
            <div className="card" style={{
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem' }}>
                            ${quote.c?.toFixed(2)}
                        </div>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: isPositive ? '#16a34a' : '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                background: isPositive ? '#f0fdf4' : '#fef2f2',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                display: 'inline-block'
                            }}>
                                {isPositive ? '▲' : '▼'} ${Math.abs(quote.c - quote.pc).toFixed(2)} ({changePercent}%)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Market Stats */}
                <div style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.85rem'
                }}>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Open</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>${quote.o?.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>High</div>
                        <div style={{ fontWeight: 600, color: '#16a34a' }}>${quote.h?.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Low</div>
                        <div style={{ fontWeight: 600, color: '#dc2626' }}>${quote.l?.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Prev Close</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>${quote.pc?.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Price Chart Section */}
            <h2 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                📈 Price History (30 Days)
            </h2>

            <Chart data={chartData} symbol={symbol} />

            {/* AI Prediction Chart */}
            {prediction && (
                <>
                    <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                        🤖 AI-Powered Price Forecast
                    </h2>
                    <PredictionChart
                        data={prediction.prediction.predictions}
                        currentPrice={prediction.currentPrice}
                        sentiment={prediction.sentiment}
                    />
                </>
            )}

            {/* Technical Indicators and News in 2-column layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
            }}>
                <div>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                        📊 Technical Indicators
                    </h2>
                    <IndicatorTable symbol={symbol} />
                </div>

                <div>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                        📰 Latest News
                    </h2>
                    {news.length > 0 ? <NewsFeed news={news} /> : <p className="muted">No recent news available</p>}
                </div>
            </div>
        </div>
    )
}
