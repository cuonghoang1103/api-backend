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
import type { ThemeSetting } from '../../shared/ipc';

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

export function Settings() {
  const { theme, setSetting, settings } = useAppState();
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
        <h1>Cài đặt</h1>

        <section className="ct-section">
          <h2>Giao diện</h2>

          <div className="ct-field">
            <div>
              <div className="ct-field-label">Chủ đề</div>
              <div className="ct-field-help">
                &ldquo;Theo hệ thống&rdquo; sẽ đổi theo cài đặt sáng/tối của máy.
              </div>
            </div>
            <div className="ct-segmented" role="radiogroup" aria-label="Chủ đề">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={theme === option.value}
                  data-active={theme === option.value}
                  onClick={() => setSetting('theme', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ct-field">
            <div>
              <div className="ct-field-label">Trợ lý Odin</div>
              <div className="ct-field-help">
                Hiển thị bảng trợ lý ở cạnh phải. Tắt đi thì app vẫn dùng bình thường.
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

        <section className="ct-section">
          <h2>Dung lượng</h2>

          <dl className="ct-rows">
            <div className="ct-row">
              <dt>Cache HTTP (ảnh, tệp tĩnh)</dt>
              <dd>{httpCache === null ? '…' : formatBytes(httpCache)}</dd>
            </div>
            <div className="ct-row">
              <dt>Dữ liệu ứng dụng đã dùng</dt>
              <dd>{estimate?.usage === undefined ? '…' : formatBytes(estimate.usage)}</dd>
            </div>
            <div className="ct-row">
              <dt>Hạn mức trình duyệt cấp</dt>
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
              {clearing ? 'Đang xoá…' : 'Xoá cache HTTP'}
            </button>
          </div>
          <p className="ct-field-help">
            Chỉ xoá ảnh và tệp tĩnh đã tải. <strong>Không</strong> đụng tới nháp
            hay dữ liệu ngoại tuyến của bạn.
          </p>
        </section>
      </div>
    </div>
  );
}
