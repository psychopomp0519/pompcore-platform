/**
 * @file ErrorBoundary.tsx
 * @description 런타임 에러를 포착하여 사용자 친화적 폴백 UI를 표시하는 컴포넌트
 * @module components/common/ErrorBoundary
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

// ============================================================
// 타입 정의
// ============================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================
// ErrorBoundary 컴포넌트
// ============================================================

/** App 최상위에서 런타임 에러를 포착하는 ErrorBoundary */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Vault] ErrorBoundary caught:', error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
