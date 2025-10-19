import React from 'react'

export default function IndicatorTable({ symbol }) {
    // Placeholder data - replace with real API call to /api/indicator
    const indicators = [
        { name: 'RSI (14)', value: '67.8' },
        { name: 'MACD', value: '2.34' },
        { name: 'SMA (50)', value: '$152.45' },
        { name: 'SMA (200)', value: '$148.23' }
    ]

    return (
        <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Technical Indicators</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {indicators.map((ind, i) => (
                        <tr key={i} style={{ borderBottom: i < indicators.length - 1 ? '1px solid #000' : 'none' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>{ind.name}</td>
                            <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{ind.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
