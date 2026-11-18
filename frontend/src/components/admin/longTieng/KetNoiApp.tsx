'use client';

/** Thẻ phụ "Kết nối app": mã kết nối cho app CT Lồng Tiếng (hiện MỘT lần) + chỗ tải app (điền link khi phát hành). */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Apple, Copy, Download, KeyRound, Laptop, Loader2, Monitor, Trash2, X } from 'lucide-react';
import { longTiengApi, type MaKetNoi } from '@/lib/longTieng';
import { loi, ngay } from './chung';

/**
 * Link tải app — ĐIỀN khi chủ kênh duyệt phát hành (hợp đồng mục 4: bản dựng đang là artifact của GitHub Actions).
 * `href: null` ⇒ hiện "sắp có", không bấm được.
 */
export const LINK_TAI_APP: Array<{ hdh: string; chiTiet: string; href: string | null; icon: typeof Laptop }> = [
  { hdh: 'macOS', chiTiet: 'Apple Silicon + Intel · .dmg', href: null, icon: Apple },
  { hdh: 'Windows', chiTiet: 'Windows 10 / 11 · .exe', href: null, icon: Monitor },
  { hdh: 'Linux', chiTiet: 'AppImage', href: null, icon: Laptop },
];

export function KetNoiApp() {
  const [ds, setDs] = useState<MaKetNoi[] | null>(null);
  const [ten, setTen] = useState('');
  const [maMoi, setMaMoi] = useState<string | null>(null);
  const [dangTao, setDangTao] = useState(false);
  const nap = useCallback(async () => { try { setDs(await longTiengApi.dsMa()); } catch (e) { toast.error(loi(e)); setDs([]); } }, []);
  useEffect(() => { void nap(); }, [nap]);

  const tao = async () => {
    setDangTao(true);
    try { const r = await longTiengApi.taoMa(ten.trim()); setMaMoi(r.ma); setTen(''); await nap(); } catch (e) { toast.error(loi(e)); } finally { setDangTao(false); }
  };
  const chep = async () => {
    if (!maMoi) return;
    try { await navigator.clipboard.writeText(maMoi); toast.success('Đã chép mã.'); } catch { toast.error('Không chép được — hãy bôi đen và chép tay.'); }
  };
  const thuHoi = async (m: MaKetNoi) => {
    if (!confirm(`Thu hồi mã "${m.ten ?? m.dau}"? App đang dùng mã này sẽ bị đăng xuất.`)) return;
    try { await longTiengApi.thuHoiMa(m.id); toast.success('Đã thu hồi.'); await nap(); } catch (e) { toast.error(loi(e)); }
  };
  const conHieuLuc = (ds ?? []).filter((m) => !m.thuHoi);
  const daThuHoi = (ds ?? []).filter((m) => m.thuHoi);

  return (
    <div className="lt-stack">
      <section className="lt-card">
        <h2 className="lt-h2"><Download /> Tải app CT Lồng Tiếng</h2>
        <p className="lt-sub mt-2">
          App cho Mac, Windows và Linux: kéo thả nhiều video, <b>tự tải kết quả về thư mục của bạn</b>, trình phát đổi bản giọng Việt ↔ song ngữ
          giữ nguyên vị trí, thông báo khi xong.
        </p>
        <div className="lt-os">
          {LINK_TAI_APP.map((a) => a.href ? (
            <a key={a.hdh} href={a.href} className="lt-os-item"><a.icon aria-hidden /><span><b>{a.hdh}</b><small>{a.chiTiet}</small></span></a>
          ) : (
            <span key={a.hdh} className="lt-os-item" aria-disabled="true"><a.icon aria-hidden /><span><b>{a.hdh} · sắp có</b><small>{a.chiTiet}</small></span></span>
          ))}
        </div>
        <p className="lt-muted mt-3">Bản dựng đang chờ chủ kênh duyệt phát hành.</p>
        <ol className="lt-howto">
          <li>Tạo một mã kết nối ở dưới (đặt tên theo máy để dễ nhận ra).</li>
          <li>Mở app, dán mã vào ô đăng nhập — mã chỉ hiện MỘT lần nên chép ngay.</li>
          <li>Mất máy hay lộ mã thì thu hồi ở đây — app dùng mã đó bị đăng xuất ngay.</li>
        </ol>
      </section>

      <section className="lt-card">
        <h2 className="lt-h2"><KeyRound /> Mã kết nối app</h2>
        <p className="lt-sub mt-2">App đăng nhập bằng mã này thay cho mật khẩu. Tối đa 20 mã còn hiệu lực.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input className="lt-input" value={ten} onChange={(e) => setTen(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !dangTao) void tao(); }}
            placeholder="Tên máy, vd MacBook ở nhà" maxLength={100} aria-label="Tên mã kết nối" />
          <button type="button" className="lt-btn lt-btn-primary shrink-0" style={{ minHeight: 46 }} onClick={tao} disabled={dangTao}>
            {dangTao ? <Loader2 className="lt-spin" /> : <KeyRound />} Tạo mã
          </button>
        </div>
        {maMoi && (
          <div className="lt-new-code">
            <p style={{ margin: '0 0 10px', fontWeight: 700, color: 'var(--lt-ok)' }}>Mã mới — chép ngay, sẽ không hiện lại:</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="lt-code">{maMoi}</code>
              <button type="button" className="lt-btn lt-btn-primary" onClick={chep}><Copy /> Chép</button>
              <button type="button" className="lt-btn lt-btn-icon" aria-label="Ẩn mã" onClick={() => setMaMoi(null)}><X /></button>
            </div>
          </div>
        )}
        {!ds ? (
          <p className="lt-muted mt-4 flex items-center gap-2"><Loader2 className="lt-spin h-4 w-4" /> Đang tải…</p>
        ) : (
          <ul className="lt-list">
            {conHieuLuc.map((m) => (
              <li key={m.id}>
                <div className="min-w-0">
                  <b style={{ fontSize: 15.5 }}>{m.ten || 'Không tên'}</b> <code className="lt-muted">{m.dau}…</code>
                  <p className="lt-muted" style={{ margin: 0 }}>Tạo {ngay(m.tao)}{m.dungLanCuoi ? ` · dùng lần cuối ${ngay(m.dungLanCuoi)}` : ' · chưa dùng'}</p>
                </div>
                <button type="button" className="lt-btn lt-btn-sm lt-btn-danger" onClick={() => thuHoi(m)}><Trash2 /> Thu hồi</button>
              </li>
            ))}
            {!conHieuLuc.length && <li className="lt-muted">Chưa có mã nào còn hiệu lực.</li>}
            {daThuHoi.length > 0 && (
              <li className="lt-muted" style={{ display: 'block' }}>
                Đã thu hồi: {daThuHoi.map((m) => `${m.ten || m.dau} (${ngay(m.thuHoi!)})`).join(' · ')}
              </li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
