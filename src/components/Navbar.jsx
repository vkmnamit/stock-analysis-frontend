import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navButtonStyle = (path, isMobile = false) => ({
        padding: isMobile ? '0.75rem 1rem' : '0.625rem 1.25rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: isMobile ? '1rem' : '0.95rem',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        background: location.pathname === path || location.pathname.startsWith(path + '/')
            ? '#000'
            : 'transparent',
        color: location.pathname === path || location.pathname.startsWith(path + '/')
            ? '#fff'
            : '#000000ff',
        display: 'block',
        width: isMobile ? '100%' : 'auto',
        textAlign: isMobile ? 'left' : 'center'
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
            {/* Logo */}
            <Link
                to="/"
                onClick={handleLinkClick}
                style={{
                    fontWeight: 700,
                    fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                    textDecoration: 'none',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                }}
            >
                Stock Analysis
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links" style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
            }}>
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

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button"
                style={{
                    display: 'none',
                    background: 'transparent',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    lineHeight: 1
                }}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div
                    className="mobile-menu"
                    style={{
                        display: 'none',
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#dedbdbff',
                        borderBottom: '2px solid #e0dedeff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '1rem',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}
                >
                    <Link
                        to="/"
                        onClick={handleLinkClick}
                        style={navButtonStyle('/', true)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/stock/AAPL"
                        onClick={handleLinkClick}
                        style={navButtonStyle('/stock', true)}
                    >
                        Stocks
                    </Link>
                    <Link
                        to="/crypto"
                        onClick={handleLinkClick}
                        style={navButtonStyle('/crypto', true)}
                    >
                        Crypto
                    </Link>
                    <Link
                        to="/watchlist"
                        onClick={handleLinkClick}
                        style={navButtonStyle('/watchlist', true)}
                    >
                        Watchlist
                    </Link>
                    <Link
                        to="/news"
                        onClick={handleLinkClick}
                        style={navButtonStyle('/news', true)}
                    >
                        News
                    </Link>
                </div>
            )}
        </nav>
    )
}
