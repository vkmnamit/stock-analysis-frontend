import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Stock from './pages/Stock'
import Crypto from './pages/Crypto'
import Watchlist from './pages/Watchlist'
import News from './pages/News'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:symbol" element={<Stock />} />
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
