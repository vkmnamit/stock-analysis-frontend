import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function Chart({ data = [], symbol = '' }) {
    if (!data || !data.length) {
        return (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', background: '#fafafa' }}>
                <p className="muted">No chart data available</p>
            </div>
        )
    }

    // Calculate min/max for better Y-axis scaling
    const prices = data.map(d => d.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    const yAxisDomain = [
        (minPrice - priceRange * 0.05).toFixed(2),
        (maxPrice + priceRange * 0.05).toFixed(2)
    ]

    // Determine if trend is up or down
    const firstPrice = data[0]?.price || 0
    const lastPrice = data[data.length - 1]?.price || 0
    const isPositive = lastPrice >= firstPrice
    const changePercent = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)

    return (
        <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem', background: '#fff', border: '1px solid #e5e7eb' }}>
            {/* Chart Header */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111' }}>
                        30-Day Price Chart
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                        {data[0]?.time} - {data[data.length - 1]?.time}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isPositive ? '#16a34a' : '#dc2626',
                        background: isPositive ? '#f0fdf4' : '#fef2f2',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        display: 'inline-block'
                    }}>
                        {isPositive ? '▲' : '▼'} {Math.abs(changePercent)}%
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={isPositive ? '#16a34a' : '#dc2626'}
                                stopOpacity={0.15}
                            />
                            <stop
                                offset="95%"
                                stopColor={isPositive ? '#16a34a' : '#dc2626'}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        domain={yAxisDomain}
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '0.75rem'
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: '0.25rem', color: '#111' }}
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? '#16a34a' : '#dc2626'}
                        strokeWidth={2.5}
                        fill="url(#colorPrice)"
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: isPositive ? '#16a34a' : '#dc2626',
                            stroke: '#fff',
                            strokeWidth: 2
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Chart Footer - Price Range */}
            <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                fontSize: '0.85rem'
            }}>
                <div>
                    <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Low</div>
                    <div style={{ fontWeight: 600, color: '#111' }}>${minPrice.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Average</div>
                    <div style={{ fontWeight: 600, color: '#111' }}>
                        ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>High</div>
                    <div style={{ fontWeight: 600, color: '#111' }}>${maxPrice.toFixed(2)}</div>
                </div>
            </div>
        </div>
    )
}
