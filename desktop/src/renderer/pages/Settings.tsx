/**
 * Màn hình Cài đặt.
 *
 * Ô dung lượng lấy số từ HAI nguồn khác nhau và nói rõ nguồn nào là nguồn nào:
 * cache HTTP do main đo (`session.getCacheSize()`), còn hạn mức và mức dùng của
 * IndexedDB/localStorage chỉ renderer hỏi được (`navigator.storage.estimate()`).
 * Gộp hai con số thành một "tổng dung lượng" sẽ ra một số không tương ứng với
 * bất cứ thứ gì có thật.
 */
import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAppState } from '../app-state';
import { SyncPanel } from '../components/SyncPanel';
import { UpdatePanel } from '../components/UpdatePanel';
import { OdinPanel } from '../features/odin/OdinPanel';
import type { ThemeSetting } from '../../shared/ipc';
import { useDich, type NgonNgu } from '../i18n';

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

const THEME_OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
  { value: 'system', label: 'Theo hệ thống' },
];

/* ⚠️ Tiếng Việt trong hằng, dịch tại chỗ dựng — hằng tầm mô-đun tính một lần
   lúc nạp tệp. Xem `i18n/dichTamMoDun.test.ts`. */
const NGON_NGU: { value: NgonNgu; label: string }[] = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'Tiếng Anh' },
];

export function Settings() {
  const { theme, setSetting, settings } = useAppState();
  const { dich } = useDich();
  const ngonNgu: NgonNgu = settings.ngonNgu === 'en' ? 'en' : 'vi';
  const [httpCache, setHttpCache] = useState<number | null>(null);
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null);
  const [clearing, setClearing] = useState(false);

  const refreshStorage = useCallback(async () => {
    const [cache, quota] = await Promise.all([
      window.cuongthai?.storage.usage() ?? Promise.resolve(null),
      navigator.storage?.estimate?.() ?? Promise.resolve(null),
    ]);
    if (cache) setHttpCache(cache.usage);
    if (quota) setEstimate(quota);
  }, []);

  useEffect(() => {
    void refreshStorage();
  }, [refreshStorage]);

  const clearCache = async () => {
    setClearing(true);
    try {
      await window.cuongthai?.storage.clearCache();
      await refreshStorage();
    } finally {
      setClearing(false);
    }
  };

  const robotEnabled = settings.robotEnabled !== false;

  return (
    <div className="ct-page">
      <div className="ct-panel">
        <h1>{dich('Cài đặt')}</h1>

        <section className="ct-section">
          <h2>{dich('Giao diện')}</h2>

          <div className="ct-field">
            <div>
              <div className="ct-field-label">{dich('Chủ đề')}</div>
              <div className="ct-field-help">
                {dich('“Theo hệ thống” sẽ đổi theo cài đặt sáng/tối của máy.')}
              </div>
            </div>
            <div className="ct-segmented" role="radiogroup" aria-label={dich('Chủ đề')}>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={theme === option.value}
                  data-active={theme === option.value}
                  onClick={() => setSetting('theme', option.value)}
                >
                  {dich(option.label)}
                </button>
              ))}
            </div>
          </div>

          {/* ĐỔI NGÔN NGỮ. Đặt ngay dưới Chủ đề vì nó cùng nhóm "vẻ ngoài của
              app", và đó là chỗ người ta tìm đầu tiên. */}
          <div className="ct-field">
            <div>
              <div className="ct-field-label">{dich('Ngôn ngữ')}</div>
              <div className="ct-field-help">
                {dich('Chữ trong app đổi ngay, không cần khởi động lại. Nội dung tải từ web (bài học, bài viết, tin nhắn) giữ nguyên ngôn ngữ gốc.')}
              </div>
            </div>
            <div className="ct-segmented" role="radiogroup" aria-label={dich('Ngôn ngữ')}>
              {NGON_NGU.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={ngonNgu === o.value}
                  data-active={ngonNgu === o.value}
                  onClick={() => setSetting('ngonNgu', o.value)}
                >
                  {dich(o.label)}
                </button>
              ))}
            </div>
          </div>

          <div className="ct-field">
            <div>
              <div className="ct-field-label">{dich('Trợ lý Odin')}</div>
              <div className="ct-field-help">
                {dich('Hiển thị bảng trợ lý ở cạnh phải. Tắt đi thì app vẫn dùng bình thường.')}
              </div>
            </div>
            <label className="ct-switch">
              <input
                type="checkbox"
                checked={robotEnabled}
                onChange={(event) => setSetting('robotEnabled', event.target.checked)}
              />
              <span />
            </label>
          </div>
        </section>

        <SyncPanel />

        <UpdatePanel />

        <OdinPanel />

        <section className="ct-section">
          <h2>{dich('Dung lượng')}</h2>

          <dl className="ct-rows">
            <div className="ct-row">
              <dt>{dich('Cache HTTP (ảnh, tệp tĩnh)')}</dt>
              <dd>{httpCache === null ? '…' : formatBytes(httpCache)}</dd>
            </div>
            <div className="ct-row">
              <dt>{dich('Dữ liệu ứng dụng đã dùng')}</dt>
              <dd>{estimate?.usage === undefined ? '…' : formatBytes(estimate.usage)}</dd>
            </div>
            <div className="ct-row">
              <dt>{dich('Hạn mức trình duyệt cấp')}</dt>
              <dd>{estimate?.quota === undefined ? '…' : formatBytes(estimate.quota)}</dd>
            </div>
          </dl>

          <div className="ct-actions">
            <button
              type="button"
              className="ct-btn ct-btn-ghost"
              onClick={() => void clearCache()}
              disabled={clearing}
            >
              <Trash2 size={14} aria-hidden />
              {clearing ? dich('Đang xoá…') : dich('Xoá cache HTTP')}
            </button>
          </div>
          {/* Câu này có <strong> ở GIỮA. Cắt thành ba mẩu để dịch là hỏng:
              tiếng Anh đảo trật tự từ, và ghép lại theo thứ tự tiếng Việt sẽ ra
              câu vô nghĩa. Nên dịch TRỌN câu, rồi tô đậm bằng cách tách theo
              dấu ** — cùng một cách ở cả hai thứ tiếng. */}
          <p className="ct-field-help">
            {dich('Chỉ xoá ảnh và tệp tĩnh đã tải. **Không** đụng tới nháp hay dữ liệu ngoại tuyến của bạn.')
              .split('**')
              .map((m, i) => (i % 2 ? <strong key={i}>{m}</strong> : <span key={i}>{m}</span>))}
          </p>
        </section>
      </div>
    </div>
  );
}
