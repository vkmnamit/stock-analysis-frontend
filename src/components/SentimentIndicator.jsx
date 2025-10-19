import React from 'react'

export default function SentimentIndicator({ prediction }) {
    if (!prediction) return null

    const { direction, changePercent, targetPrice, confidence, newsCount } = prediction

    const getDirectionStyle = () => {
        if (direction === 'bullish') return { color: '#000', icon: '📈', label: 'Bullish' }
        if (direction === 'bearish') return { color: '#666', icon: '📉', label: 'Bearish' }
        return { color: '#999', icon: '➡️', label: 'Neutral' }
    }

    const style = getDirectionStyle()
    const isPositive = parseFloat(changePercent) >= 0

    return (
        <div className="card" style={{ marginBottom: '1rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {style.icon} Market Sentiment
                    </h3>
                    <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                        Based on {newsCount || 0} news articles
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: style.color }}>
                        {style.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: style.color }}>
                        {confidence?.toFixed(0) || 0}% Confidence
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                <div>
                    <div className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        Predicted Change
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: isPositive ? '#000' : '#666' }}>
                        {isPositive ? '+' : ''}{changePercent}%
                    </div>
                </div>
                <div>
                    <div className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        Target Price (7d)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        ${targetPrice}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>💡</span>
                    <span>
                        {direction === 'bullish'
                            ? 'Positive news sentiment suggests potential upward movement'
                            : direction === 'bearish'
                                ? 'Negative news sentiment suggests potential downward pressure'
                                : 'Mixed news sentiment suggests sideways movement'
                        }
                    </span>
                </div>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
                ⚠️ This is AI-generated prediction based on news sentiment. Not financial advice.
            </div>
        </div>
    )
}
