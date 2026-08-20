import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// A component that throws on render
const BrokenComponent = ({ shouldThrow }) => {
    if (shouldThrow) {
        throw new Error('Test render error');
    }
    return <div>Rendered successfully</div>;
};

// Suppress console.error for expected errors in tests
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    console.error.mockRestore();
});

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <BrokenComponent shouldThrow={false} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Rendered successfully')).toBeInTheDocument();
    });

    it('renders the fallback UI when a child throws', () => {
        render(
            <ErrorBoundary>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('An error occurred.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go to listings' })).toBeInTheDocument();
    });

    it('displays the component name in the error message', () => {
        render(
            <ErrorBoundary name="The listings page">
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText(/The listings page/)).toBeInTheDocument();
    });

    it('renders a custom fallback when provided', () => {
        const customFallback = ({ error, onReset }) => (
            <div>
                <p>Custom error: {error.message}</p>
                <button onClick={onReset}>Custom reset</button>
            </div>
        );

        render(
            <ErrorBoundary fallback={customFallback}>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error: Test render error')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Custom reset' })).toBeInTheDocument();
    });

    it('shows error details in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        render(
            <ErrorBoundary>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Error details')).toBeInTheDocument();

        process.env.NODE_ENV = originalEnv;
    });
});