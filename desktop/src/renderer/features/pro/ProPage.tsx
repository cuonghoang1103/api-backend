/**
 * Trang Pro — trạng thái quyền lợi thật từ máy chủ.
 *
 * Đối chiếu `GET /api/v1/pro/status` (src/routes/pro.routes.ts:21) →
 * `getProStatus` (src/services/pro.service.ts:53), trả về:
 *   { isAdmin, isPro, effective, lifetime, expiresAt, source }
 *
 * Hai luật của mục 7.9 trong đề bài, và cả hai đều nằm ở đây:
 *
 *  1. KHÔNG bao giờ vượt quyền phía máy chủ. Trang này chỉ HIỂN THỊ. Không có
 *     cờ cục bộ nào mở khoá được tính năng — mọi cổng Pro do backend giữ, và
 *     một app desktop bị sửa cũng không đổi được điều đó.
 *  2. Khi ngoại tuyến thì hiện trạng thái BIẾT LẦN CUỐI, kèm mốc thời gian, và
 *     nói rõ là chưa xác minh lại được. Hiện trạng thái cũ mà không ghi thời
 *     điểm là để người dùng tin vào một điều có thể đã hết hạn từ lâu.
 *
 * KHÔNG có ô nhập mã kích hoạt ở đây: `POST /pro/redeem` đổi quyền lợi thật,
 * gửi khi mất mạng rồi thử lại là rủi ro tiêu mã hai lần. Mã kích hoạt nhập
 * trên web, nơi luôn có mạng.
 */
import { useCallback, useEffect, useState } from 'react';
import { CloudOff, RefreshCw, ShieldCheck, ShieldX, Sparkles } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface ProStatus {
  isAdmin: boolean;
  isPro: boolean;
  /** Quyền lợi CÓ HIỆU LỰC (admin hoặc Pro còn hạn). Đây là cờ đáng tin. */
  effective: boolean;
  lifetime: boolean;
  expiresAt: string | null;
  source: string | null;
}

export function ProPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [status, setStatus] = useState<ProStatus | null>(null);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (userId === null || !api) return;
    setLoading(true);
    setError(null);
    try {
      const result = await swr<ProStatus>({
        userId,
        key: 'pro:status',
        fetcher: () => api.request<ProStatus>('/api/v1/pro/status'),
        online,
        // TTL ngắn: quyền lợi đổi được bất cứ lúc nào (mua gói, hết hạn), và
        // hiện sai ở đây gây hiểu nhầm trực tiếp về tiền.
        ttlMs: 60 * 1000,
        onRefreshed: (fresh) => {
          setStatus(fresh);
          setCachedAt(Date.now());
          setIsStale(false);
        },
      });
      setStatus(result.value);
      setCachedAt(result.cachedAt);
      setIsStale(result.isStale);
    } catch (caught) {
      setError(
        caught instanceof OfflineUnavailableError
          ? 'Chưa từng tải trạng thái Pro về máy nên không xem được khi ngoại tuyến.'
          : caught instanceof Error
            ? caught.message
            : String(caught),
      );
    } finally {
      setLoading(false);
    }
  }, [api, userId, online]);

  useEffect(() => {
    void load();
  }, [load]);

  const openWeb = (path: string) => {
    void window.cuongthai?.app
      .getInfo()
      .then((info) => window.cuongthai?.app.openExternal(`${info.webOrigin}${path}`));
  };

  if (loading && !status) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <p>Đang tải trạng thái Pro…</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <CloudOff size={28} aria-hidden className="ct-empty-icon" />
          <h1>Không xem được trạng thái Pro</h1>
          <p>{error}</p>
          <div className="ct-actions">
            <button type="button" className="ct-btn" onClick={() => void load()}>
              <RefreshCw size={14} aria-hidden />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const active = status.effective;

  return (
    <div className="ct-page">
      <div className="ct-panel">
        <div className="ct-page-head">
          <div>
            <h1>Tài khoản Pro</h1>
            <p className="ct-muted" style={{ margin: 0 }}>
              Quyền lợi do máy chủ quyết định.
            </p>
          </div>
        </div>

        {/* Trạng thái cũ + ngoại tuyến = phải nói rõ. Đây là chỗ dễ gây hiểu
            nhầm nhất trong app vì nó liên quan tới tiền. */}
        {(isStale || !online) && cachedAt !== null && (
          <div className="ct-notice" data-tone="warn">
            <CloudOff size={15} aria-hidden />
            <span>
              Đây là trạng thái biết lần cuối lúc <strong>{formatTime(cachedAt)}</strong>.
              {online
                ? ' Đang xác minh lại với máy chủ…'
                : ' Cần kết nối mạng để xác minh lại.'}
            </span>
          </div>
        )}

        <div className="ct-pro-hero" data-active={active}>
          {active ? <ShieldCheck size={26} aria-hidden /> : <ShieldX size={26} aria-hidden />}
          <div>
            <div className="ct-pro-hero-title">
              {status.isAdmin
                ? 'Quản trị viên'
                : active
                  ? status.lifetime
                    ? 'Pro vĩnh viễn'
                    : 'Pro đang hoạt động'
                  : 'Chưa có Pro'}
            </div>
            <div className="ct-pro-hero-sub">
              {status.isAdmin
                ? 'Tài khoản quản trị có đầy đủ quyền lợi Pro.'
                : active
                  ? status.lifetime
                    ? 'Không có ngày hết hạn.'
                    : `Hiệu lực đến ${formatDate(status.expiresAt)}.`
                  : 'Các tính năng AI cần tài khoản Pro.'}
            </div>
          </div>
        </div>

        <section className="ct-section">
          <h2>Chi tiết</h2>
          <dl className="ct-rows">
            <div className="ct-row">
              <dt>Quyền lợi có hiệu lực</dt>
              <dd>{status.effective ? 'Có' : 'Không'}</dd>
            </div>
            <div className="ct-row">
              <dt>Cờ Pro trên tài khoản</dt>
              <dd>{status.isPro ? 'Có' : 'Không'}</dd>
            </div>
            <div className="ct-row">
              <dt>Ngày hết hạn</dt>
              <dd>{status.expiresAt ? formatDate(status.expiresAt) : '—'}</dd>
            </div>
            <div className="ct-row">
              <dt>Nguồn</dt>
              <dd>{status.source ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <div className="ct-actions">
          <button type="button" className="ct-btn" onClick={() => openWeb('/pro')}>
            <Sparkles size={14} aria-hidden />
            {active ? 'Quản lý gói trên web' : 'Nâng cấp trên web'}
          </button>
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            onClick={() => void load()}
            disabled={!online}
          >
            <RefreshCw size={14} aria-hidden />
            Kiểm tra lại
          </button>
        </div>
        <p className="ct-field-help">
          Nhập mã kích hoạt và thanh toán thực hiện trên web — cả hai đều đổi
          quyền lợi thật nên cần kết nối ổn định.
        </p>
      </div>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
}
