import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function IndicatorTable({ symbol }) {
    const [indicators, setIndicators] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!symbol) return

        setLoading(true)
        setError(null)

        axios.get(`${API_BASE_URL}/api/indicators/${symbol}`)
            .then(res => {
                setIndicators(res.data.indicators)
                setLoading(false)
            })
            .catch(err => {
                console.error('Indicators error:', err)
                setError(err.response?.data?.message || 'Failed to load indicators')
                setLoading(false)
            })
    }, [symbol])

    if (loading) {
        return (
            <div className="card" style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#6b7280' }}>Loading financial data...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card" style={{ marginTop: '1rem', background: '#fef2f2', border: '1px solid #fecaca' }}>
                <div style={{ color: '#dc2626', padding: '1rem' }}>
                    {error}
                </div>
            </div>
        )
    }

    if (!indicators || Object.keys(indicators).length === 0) {
        return (
            <div className="card" style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#6b7280' }}>No financial data available</div>
            </div>
        )
    }

    // Group indicators by category
    const valuationMetrics = {
        'P/E Ratio': indicators.peRatio,
        'P/B Ratio': indicators.pbRatio,
        'P/S Ratio': indicators.psRatio,
        'P/CF Ratio': indicators.pcRatio,
        'EV/EBITDA': indicators.evToEbitda
    }

    const profitabilityMetrics = {
        'ROE (Return on Equity)': indicators.roe,
        'ROA (Return on Assets)': indicators.roa,
        'ROIC': indicators.roic,
        'Gross Margin': indicators.grossMargin,
        'Operating Margin': indicators.operatingMargin,
        'Net Margin': indicators.netMargin
    }

    const financialHealthMetrics = {
        'Debt-to-Equity': indicators.debtToEquity,
        'Current Ratio': indicators.currentRatio,
        'Quick Ratio': indicators.quickRatio,
        'Total Debt/Capital': indicators.totalDebtToTotalCapital
    }

    const growthMetrics = {
        'Revenue Growth': indicators.revenueGrowth,
        'Earnings Growth': indicators.earningsGrowth,
        'Book Value/Share': indicators.bookValuePerShare
    }

    const balanceSheetMetrics = {
        'Total Equity': indicators.totalEquity,
        'Total Assets': indicators.totalAssets,
        'Total Liabilities': indicators.totalLiabilities,
        'Cash & Equivalents': indicators.cashAndEquivalents
    }

    const incomeMetrics = {
        'EPS (Earnings Per Share)': indicators.eps,
        'Revenue Per Share': indicators.revenuePerShare,
        'EBITDA': indicators.ebitda
    }

    const marketMetrics = {
        'Market Cap': indicators.marketCap,
        'Shares Outstanding': indicators.sharesOutstanding,
        'Beta': indicators.beta,
        '52W High': indicators.week52High,
        '52W Low': indicators.week52Low,
        '52W Change': indicators.week52Change
    }

    const technicalMetrics = {
        'RSI (14)': indicators.rsi,
        'MACD': indicators.macd,
        'SMA (50)': indicators.sma50,
        'SMA (200)': indicators.sma200,
        'Volume': indicators.volume,
        'Avg Volume': indicators.avgVolume
    }

    const renderMetricGroup = (title, metrics, icon) => {
        const availableMetrics = Object.entries(metrics).filter(([_, value]) => value !== undefined && value !== null)

        if (availableMetrics.length === 0) return null

        return (
            <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {icon} {title}
                </h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '0.75rem'
                }}>
                    {availableMetrics.map(([name, value]) => (
                        <div key={name} style={{
                            background: '#f9fafb',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                marginBottom: '0.25rem',
                                fontWeight: 500
                            }}>
                                {name}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#111827'
                            }}>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="card" style={{ marginTop: '1rem' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
            }}>
                <h3 style={{ margin: 0 }}>Financial Overview</h3>
                <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                }}>
                    Real-time data
                </span>
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {renderMetricGroup('Valuation Metrics', valuationMetrics, '')}
                {renderMetricGroup('Profitability', profitabilityMetrics, '')}
                {renderMetricGroup('Financial Health', financialHealthMetrics, '')}
                {renderMetricGroup('Growth Metrics', growthMetrics, '')}
                {renderMetricGroup('Balance Sheet', balanceSheetMetrics, '')}
                {renderMetricGroup('Income Statement', incomeMetrics, '')}
                {renderMetricGroup('Market Data', marketMetrics, '')}
                {renderMetricGroup('Technical Indicators', technicalMetrics, '')}
            </div>

            {indicators.lastUpdated && (
                <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textAlign: 'center'
                }}>
                    Last updated: {new Date(indicators.lastUpdated).toLocaleString()}
                </div>
            )}
        </div>
    )
}
