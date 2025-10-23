import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function PredictionChart({ data, currentPrice, sentiment }) {
    if (!data || data.length === 0) return null

    // Transform data to add day numbers for better X-axis
    const chartData = data.slice(0, 7).map((item, index) => ({
        ...item,
        day: `Day ${index + 1}`,
        displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))

    // Determine trend and colors
    const isPositive = sentiment > 0
    const trendColor = sentiment > 0.1 ? '#16a34a' : sentiment < -0.1 ? '#dc2626' : '#6b7280'
    const directionIcon = sentiment > 0.1 ? '' : sentiment < -0.1 ? '' : ''
    const trendText = sentiment > 0.1 ? 'Bullish' : sentiment < -0.1 ? 'Bearish' : 'Neutral'

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            {/* Header Card */}
            <div style={{
                marginBottom: '1rem',
                padding: '1.25rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#111' }}>
                            {directionIcon} AI-Powered 7-Day Forecast
                        </h3>
                        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                            Based on sentiment analysis of recent news articles
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: trendColor,
                            background: sentiment > 0.1 ? '#f0fdf4' : sentiment < -0.1 ? '#fef2f2' : '#f3f4f6',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            display: 'inline-block'
                        }}>
                            {trendText} Sentiment
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e5e7eb' }}>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={trendColor} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="displayDate"
                            stroke="#9ca3af"
                            style={{ fontSize: '0.75rem' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '0.75rem' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '0.75rem'
                            }}
                            formatter={(value, name) => {
                                if (name === 'price') return [`$${value.toFixed(2)}`, 'Predicted Price']
                                if (name === 'confidence') return [`${value.toFixed(0)}%`, 'Confidence']
                                if (name === 'changePercent') return [`${value > 0 ? '+' : ''}${value.toFixed(2)}%`, 'Change']
                                return [value, name]
                            }}
                            labelFormatter={(label) => `Forecast: ${label}`}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '1rem' }}
                            iconType="line"
                        />
                        <ReferenceLine
                            y={currentPrice}
                            stroke="#6b7280"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                                value: `Current: $${currentPrice.toFixed(2)}`,
                                fill: '#6b7280',
                                fontSize: 12,
                                position: 'right'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={trendColor}
                            strokeWidth={2.5}
                            fill="url(#colorPrediction)"
                            dot={{ fill: trendColor, r: 4, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, fill: trendColor, stroke: '#fff', strokeWidth: 2 }}
                            name="Predicted Price"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Prediction Summary */}
                <div style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.85rem'
                }}>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Day 1 Prediction</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>
                            ${chartData[0]?.price.toFixed(2)}
                            <span style={{
                                marginLeft: '0.5rem',
                                color: chartData[0]?.changePercent >= 0 ? '#16a34a' : '#dc2626',
                                fontSize: '0.8rem'
                            }}>
                                ({chartData[0]?.changePercent >= 0 ? '+' : ''}{chartData[0]?.changePercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Day 7 Prediction</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>
                            ${chartData[6]?.price.toFixed(2)}
                            <span style={{
                                marginLeft: '0.5rem',
                                color: chartData[6]?.changePercent >= 0 ? '#16a34a' : '#dc2626',
                                fontSize: '0.8rem'
                            }}>
                                ({chartData[6]?.changePercent >= 0 ? '+' : ''}{chartData[6]?.changePercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Avg Confidence</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>
                            {(chartData.reduce((sum, d) => sum + d.confidence, 0) / chartData.length).toFixed(0)}%
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#fffbeb',
                    border: '1px solid #fbbf24',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#92400e'
                }}>
                    <strong>Disclaimer:</strong> This is an AI-generated prediction based on sentiment analysis.
                    Not financial advice. Always do your own research before making investment decisions.
                </div>
            </div>
        </div>
    )
}
