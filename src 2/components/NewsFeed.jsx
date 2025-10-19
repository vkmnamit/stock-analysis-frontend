import React from 'react'

export default function NewsFeed({ news = [] }) {
    if (!news || !news.length) return <div className="card">No news available</div>

    return (
        <div className="list">
            {news.map((item, i) => (
                <div key={i} className="card">
                    <a href={item.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                        {item.headline}
                    </a>
                    <p className="muted" style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                        {item.source} • {new Date(item.datetime * 1000).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    )
}
