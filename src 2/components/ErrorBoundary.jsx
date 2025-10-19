import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
        this.state = { hasError: true, error, errorInfo }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Something went wrong</h1>
                    <div className="card" style={{ marginTop: '1rem', textAlign: 'left' }}>
                        <h3>Error Details:</h3>
                        <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        {this.state.errorInfo && (
                            <details style={{ marginTop: '1rem' }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Stack Trace</summary>
                                <pre style={{ fontSize: '0.75rem', overflow: 'auto', marginTop: '0.5rem' }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{ marginTop: '1rem' }}
                    >
                        Go to Home
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
