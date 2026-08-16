/**
 * Thanh trạng thái dưới cùng: mạng, đồng bộ, zoom.
 *
 * Ô đồng bộ lấy chữ từ `useSync`, tức là từ số liệu thật trong hàng đợi. Nó
 * KHÔNG có nhánh nào in ra "Đã đồng bộ" khi chưa nối được máy chủ — trạng thái
 * đó có tên riêng ("chưa nối máy chủ") vì nó là sự thật khác hẳn.
 */
import { useMemo } from 'react';
import { Minus, Plus, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useAppState } from '../app-state';
import { useSession } from '../auth/session';
import { useSync } from '../offline/use-sync';
import { makeTransport } from '../offline/transport';

const ZOOM_STEPS = [0.8, 0.9, 1, 1.1, 1.25, 1.5] as const;

/** Map trạng thái đồng bộ → màu, dùng chung với `.ct-badge[data-state]`. */
const TONE: Record<string, 'ok' | 'warn' | 'err' | 'muted'> = {
  'chua-dang-nhap': 'muted',
  'chua-noi-may-chu': 'muted',
  'ngoai-tuyen': 'warn',
  'dang-dong-bo': 'muted',
  'cho-mang': 'warn',
  'that-bai': 'err',
  'can-xu-ly': 'err',
  'da-dong-bo': 'ok',
};

export function StatusBar() {
  const { online, settings, setSetting } = useAppState();
  const { userId, api } = useSession();
  const bridge = window.cuongthai;

  // Transport thật được nối ở `makeTransport` (offline/transport.ts) khi đã có
  // phiên. Chưa đăng nhập thì `null` — và thanh trạng thái nói "Chưa đăng nhập",
  // không phải "Đã đồng bộ".
  const transport = useMemo(() => (api ? makeTransport(api) : null), [api]);
  const sync = useSync({ userId, transport, online });

  const zoom = typeof settings.zoomLevel === 'number' ? settings.zoomLevel : 1;

  const changeZoom = (direction: 1 | -1) => {
    const index = ZOOM_STEPS.findIndex((step) => step >= zoom - 0.001);
    const nextIndex = Math.min(
      ZOOM_STEPS.length - 1,
      Math.max(0, (index === -1 ? 2 : index) + direction),
    );
    const next = ZOOM_STEPS[nextIndex];
    if (next === undefined) return;
    void bridge?.app.setZoom(next);
    setSetting('zoomLevel', next);
  };

  const canAct = sync.state === 'that-bai' || sync.state === 'cho-mang';

  return (
    <footer className="ct-statusbar">
      <span className="ct-badge" data-state={online ? 'online' : 'offline'}>
        {online ? <Wifi size={13} aria-hidden /> : <WifiOff size={13} aria-hidden />}
        {online ? 'Trực tuyến' : 'Ngoại tuyến'}
      </span>

      <button
        type="button"
        className="ct-status-sync"
        data-tone={TONE[sync.state] ?? 'muted'}
        disabled={!canAct}
        onClick={() => void (sync.state === 'that-bai' ? sync.retry() : sync.syncNow())}
        title={canAct ? 'Đồng bộ ngay' : undefined}
      >
        <RefreshCw
          size={13}
          aria-hidden
          className={sync.state === 'dang-dong-bo' ? 'ct-spin' : undefined}
        />
        {sync.label}
      </button>

      <div className="ct-status-zoom">
        <button
          type="button"
          onClick={() => changeZoom(-1)}
          aria-label="Thu nhỏ"
          disabled={zoom <= ZOOM_STEPS[0]}
        >
          <Minus size={13} aria-hidden />
        </button>
        <span aria-live="polite">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => changeZoom(1)}
          aria-label="Phóng to"
          disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]!}
        >
          <Plus size={13} aria-hidden />
        </button>
      </div>
    </footer>
  );
}
