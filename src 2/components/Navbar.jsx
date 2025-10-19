import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
    return (
        <nav className="navbar container">
            <div style={{ fontWeight: 1700, fontSize: '6.5rem' }}>Stock Analysis</div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/stock/AAPL">Stock</Link>
                <Link to="/crypto">Crypto</Link>
                <Link to="/watchlist">Watchlist</Link>
                <Link to="/news">News</Link>
            </div>
        </nav>
    )
}
