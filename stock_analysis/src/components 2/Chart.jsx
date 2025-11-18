import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Chart({ data = [] }) {
    if (!data || !data.length) return <div className="card">No chart data</div>

    return (
        <div className="card" style={{ marginBottom: '1rem' }}>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="time" stroke="#000" />
                    <YAxis stroke="#000" />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #000' }} />
                    <Line type="monotone" dataKey="price" stroke="#000" dot={false} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
