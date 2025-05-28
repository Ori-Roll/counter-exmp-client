import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import CountExample from './components/CountExample';
import './App.css';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error, errorInfo);
    this.setState({
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={() =>
              this.setState({ hasError: false, error: null, errorInfo: null })
            }
          >
            Try again
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

// Main App Component
function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Counter</h1>
        <p>A TypeScript React + Express + Prisma Application</p>
      </header>

      <main className="app-content">
        <ErrorBoundary>
          <CountExample />
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} - Count Manager App</p>
      </footer>
    </div>
  );
}

export default App;
