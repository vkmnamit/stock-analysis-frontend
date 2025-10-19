import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navButtonStyle = (path) => ({
        padding: '0.625rem 1.25rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        background: location.pathname === path || location.pathname.startsWith(path + '/')
            ? '#000'
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

    const handleLinkClick = () => {
        setMobileMenuOpen(false)
    }

    return (
        <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <Link
                to="/"
                style={{
                    fontWeight: 700,
                    fontSize: 'clamp(1.2rem, 3vw, 1.3rem)',
                    textDecoration: 'none',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                📈 Stock Analysis
            </Link>

            {/* Mobile Menu Button */}
            <button
                className="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                    display: 'none',
                    background: 'transparent',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                }}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-nav">
                <Link
                    to="/"
                    style={navButtonStyle('/')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/')}
                >
                    🏠 Home
                </Link>
                <Link
                    to="/stock/AAPL"
                    style={navButtonStyle('/stock')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/stock')}
                >
                    📊 Stocks
                </Link>
                <Link
                    to="/crypto"
                    style={navButtonStyle('/crypto')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/crypto')}
                >
                    💰 Crypto
                </Link>
                <Link
                    to="/watchlist"
                    style={navButtonStyle('/watchlist')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/watchlist')}
                >
                    ⭐ Watchlist
                </Link>
                <Link
                    to="/news"
                    style={navButtonStyle('/news')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={(e) => handleMouseLeave(e, '/news')}
                >
                    📰 News
                </Link>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="mobile-nav" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#fff',
                    borderTop: '2px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <Link
                        to="/"
                        onClick={handleLinkClick}
                        style={{ ...navButtonStyle('/'), width: '100%', textAlign: 'center' }}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/stock/AAPL"
                        onClick={handleLinkClick}
                        style={{ ...navButtonStyle('/stock'), width: '100%', textAlign: 'center' }}
                    >
                        📊 Stocks
                    </Link>
                    <Link
                        to="/crypto"
                        onClick={handleLinkClick}
                        style={{ ...navButtonStyle('/crypto'), width: '100%', textAlign: 'center' }}
                    >
                        💰 Crypto
                    </Link>
                    <Link
                        to="/watchlist"
                        onClick={handleLinkClick}
                        style={{ ...navButtonStyle('/watchlist'), width: '100%', textAlign: 'center' }}
                    >
                        ⭐ Watchlist
                    </Link>
                    <Link
                        to="/news"
                        onClick={handleLinkClick}
                        style={{ ...navButtonStyle('/news'), width: '100%', textAlign: 'center' }}
                    >
                        📰 News
                    </Link>
                </div>
            )}
        </nav>
    )
}
