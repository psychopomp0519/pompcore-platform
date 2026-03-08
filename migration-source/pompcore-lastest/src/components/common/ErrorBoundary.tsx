/**
 * 에러 바운더리 컴포넌트
 * - 런타임 에러 발생 시 앱 전체 크래시 방지
 * - 사용자 친화적 에러 화면 표시 + 복구 버튼
 */
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PompCore] 예기치 않은 오류:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark-1 px-6">
          <div className="text-center max-w-md">
            <p className="text-4xl mb-4">⚠</p>
            <h1 className="font-display text-xl font-bold text-[#1A1A2E] dark:text-white mb-3">
              문제가 발생했습니다
            </h1>
            <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490] mb-6 leading-relaxed">
              예기치 않은 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도하거나, 문제가 지속되면 페이지를 새로고침해주세요.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm rounded-xl min-h-[44px] font-medium transition-all duration-300 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white cursor-pointer"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm rounded-xl min-h-[44px] font-medium border border-slate-200 dark:border-white/10 text-[#1A1A2E] dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                새로고침
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
