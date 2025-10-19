import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation()

    const navButtonStyle = (path) => ({
        padding: '0.625rem 1.25rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        background: location.pathname === path || location.pathname.startsWith(path + '/')
            ? '#000000ff'
            : 'transparent',
        color: location.pathname === path || location.pathname.startsWith(path + '/')
            ? '#fff'
            : '#374151',
        display: 'inline-block'
    })

    const handleMouseEnter = (e) => {
        if (e.target.style.background === 'transparent') {
            e.target.style.background = '#f3f4f6'
            e.target.style.color = '#000'
        }
    }

    const handleMouseLeave = (e, path) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + '/')
        if (!isActive) {
            e.target.style.background = 'transparent'
            e.target.style.color = '#374151'
        }
    }

    return (
        <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <Link
                to="/"
                style={{
                    fontWeight: 700,
                    fontSize: '2.6rem',
                    textDecoration: 'none',
                    color: '#000000ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                Stock Analysis
            </Link>
            <div className="nav-links">
                <Link
                    to="/"
                    style={navButtonStyle('/')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/')}
                >
                    Home
                </Link>
                <Link
                    to="/stock/AAPL"
                    style={navButtonStyle('/stock')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/stock')}
                >
                    Stocks
                </Link>
                <Link
                    to="/crypto"
                    style={navButtonStyle('/crypto')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/crypto')}
                >
                    Crypto
                </Link>
                <Link
                    to="/watchlist"
                    style={navButtonStyle('/watchlist')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/watchlist')}
                >
                    Watchlist
                </Link>
                <Link
                    to="/news"
                    style={navButtonStyle('/news')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/news')}
                >
                    News
                </Link>
            </div>
        </nav>
    )
}
