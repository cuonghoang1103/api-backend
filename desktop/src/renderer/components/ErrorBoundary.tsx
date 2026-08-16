/**
 * Error boundary toàn cục.
 *
 * Không có nó, một lỗi render bất kỳ sẽ tháo trắng toàn bộ cây React — người
 * dùng nhận một cửa sổ trống, không thông báo, không đường thoát. Có nó thì
 * mất một màn hình chứ không mất cả app.
 *
 * KHÔNG hiện stack trace cho người dùng cuối: nó vô nghĩa với họ, và có thể
 * lộ đường dẫn nội bộ. Stack vẫn được ghi ra console để gỡ lỗi lúc phát triển.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[renderer] lỗi không bắt được:', error, info.componentStack);
  }

  private readonly reset = () => {
    this.setState({ error: null });
  };

  private readonly reload = () => {
    void window.cuongthai?.app.reload();
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="ct-boot">
        <section className="ct-card" role="alert">
          <h1>Đã xảy ra lỗi</h1>
          <p>
            Một phần của ứng dụng gặp sự cố và đã dừng lại. Dữ liệu bạn đã lưu
            không bị ảnh hưởng.
          </p>
          <p className="ct-error" style={{ fontSize: 13 }}>
            {error.message}
          </p>
          <div className="ct-actions">
            <button type="button" className="ct-btn" onClick={this.reset}>
              <RotateCcw size={14} aria-hidden />
              Thử lại
            </button>
            <button type="button" className="ct-btn ct-btn-ghost" onClick={this.reload}>
              Tải lại ứng dụng
            </button>
          </div>
        </section>
      </div>
    );
  }
}
