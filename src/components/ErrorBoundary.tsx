import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  public static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    let message = 'An unexpected error occurred';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return { hasError: true, errorMessage: message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error?.message || error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#141416] text-[#F3F2EE] flex items-center justify-center p-6 font-mono-tech">
          <div className="max-w-md w-full bg-[#1C1C20] border border-[#333] p-6 rounded-lg shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F27D26]/20 border border-[#F27D26] text-[#F27D26] flex items-center justify-center mx-auto text-lg font-bold">
              !
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">DEBRIQ ENGINE SYSTEM NOTICE</h2>
              <p className="text-xs text-[#888] mt-1 font-sans">
                Đã xảy ra lỗi tạm thời khi tải thành phần. Vui lòng tải lại hoặc quay về trang chủ.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="bg-[#F27D26] hover:bg-[#D86616] text-white px-5 py-2 text-xs uppercase font-bold rounded cursor-pointer transition-colors"
              >
                VỀ TRANG CHỦ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
