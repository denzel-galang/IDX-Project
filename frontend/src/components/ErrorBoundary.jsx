import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { fallback, children, name = 'This section' } = this.props;

        if (hasError) {
            if (fallback) {
                return fallback({ error, errorInfo, onReset: this.handleReset });
            }

            return (
                <div className="error-boundary">
                    <h2 className="error-boundary__title">An error occurred.</h2>
                    <p className="error-boundary__message">
                        {name} could not load due to an error.
                    </p>
                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="error-boundary__details">
                            <summary>Error details</summary>
                            <pre className="error-boundary__stack">
                                {error.toString()}
                                {errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                    <div className="error-boundary__actions">
                        <button
                            className="error-boundary__btn error_boundary__btn--secondary"
                            onClick={() => window.location.href = '/'}
                        >
                            Go to listings
                        </button>
                    </div>
                </div>
            );
        }

        return children;
    }
}

export default ErrorBoundary;