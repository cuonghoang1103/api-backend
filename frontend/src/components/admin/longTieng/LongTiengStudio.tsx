'use client';

/**
 * /admin/long-tieng — CT Lồng Tiếng trong khung admin (thiết kế lại 18/11/2026 theo góp ý chủ kênh).
 * Hợp đồng API: docs/long-tieng-hop-dong.md. Quyền ADMIN do admin/layout.tsx kiểm (và backend kiểm lại mọi tuyến).
 *
 * Bố cục: [Lồng tiếng] bước 1 dán link / kéo thả → tuỳ chọn gập → thẻ việc lớn (đang làm / vừa xong / vừa lỗi) → lịch sử.
 *         [Kết nối app] mã kết nối + tải app.
 * Tiến độ: tự làm mới 5 s khi có việc chạy (30 s khi rảnh, dừng khi tab ẩn). ETA đo từ tốc độ % thật giữa các lần làm mới
 * (lib/longTiengTienDo.ts); mẫu lưu ở localStorage để mở lại trang vẫn ước lượng được.
 */
import './longTieng.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AudioLines, Loader2, Plug } from 'lucide-react';
import { GauPixel } from '@/components/chat/claude/GauPixel';
import { longTiengApi, type Viec } from '@/lib/longTieng';
import { lamMuotEta, themMau, uocLuongConLai, type EtaMuot, type Mau } from '@/lib/longTiengTienDo';
import { DANG_CHAY, docNho, ghiNho, giamChuyenDong, loi, tenViec } from './chung';
import { TaoViec } from './TaoViec';
import { TheViec, type HanhDong } from './TheViec';
import { LichSu } from './LichSu';
import { KetNoiApp } from './KetNoiApp';

type Tab = 'lam' | 'app';
const KHOA_TAB = 'lt.tab';
const KHOA_MAU = 'lt.mauTienDo';
const KHOA_CAT = 'lt.daCat';
/** Việc xong / lỗi trong 24 giờ còn nằm ở thẻ lớn (tới khi bấm "Cất vào lịch sử"). */
const NOI_BAT_MS = 24 * 3600_000;

async function phaoGiay() {
  if (giamChuyenDong()) return;
  try {
    const confetti = (await import('canvas-confetti')).default;
    void confetti({ particleCount: 70, spread: 70, startVelocity: 38, origin: { y: 0.35 }, ticks: 160, scalar: 0.9, disableForReducedMotion: true });
  } catch { /* chỉ trang trí */ }
}

export default function LongTiengStudio() {
  const [tab, setTab] = useState<Tab>('lam');
  const [viec, setViec] = useState<Viec[] | null>(null);
  const [taiLen, setTaiLen] = useState<Record<string, number>>({});
  const [daCat, setDaCat] = useState<string[]>([]);
  const [dangLam, setDangLam] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [eta, setEta] = useState<Record<string, EtaMuot>>({});
  const mau = useRef<Record<string, Mau[]>>({});
  const daThayChay = useRef<Set<string>>(new Set());

  useEffect(() => {
    setTab(docNho<Tab>(KHOA_TAB, 'lam') === 'app' ? 'app' : 'lam');
    setDaCat(docNho<string[]>(KHOA_CAT, []));
    mau.current = docNho<Record<string, Mau[]>>(KHOA_MAU, {});
  }, []);
  const doiTab = (t: Tab) => { setTab(t); ghiNho(KHOA_TAB, t); };

  const napViec = useCallback(async () => {
    let ds: Viec[];
    try { ds = await longTiengApi.dsViec(); } catch (e) { toast.error(loi(e)); setViec((v) => v ?? []); return; }
    const t = Date.now();
    const moiEta: Record<string, number | null> = {};
    const conChay = new Set<string>();
    for (const v of ds) {
      if (v.trangThai === 'tai' || v.trangThai === 'lam') {
        conChay.add(v.id);
        let m = mau.current[v.id] ?? [];
        // Mở trang giữa chừng: neo một mẫu (lúc tạo, 0%) — tính cả lúc xếp hàng ⇒ ước lượng dè dặt (dài), rồi tự đúng dần.
        if (!m.length && v.phanTram > 0) m = [{ t: Date.parse(v.tao), p: 0 }];
        m = themMau(m, { t, p: v.phanTram });
        mau.current[v.id] = m;
        moiEta[v.id] = uocLuongConLai(m, v.phanTram, t);
      }
      if (DANG_CHAY.includes(v.trangThai)) daThayChay.current.add(v.id);
      else if (daThayChay.current.has(v.id)) {
        daThayChay.current.delete(v.id);
        if (v.trangThai === 'xong') {
          toast.success(`Xong: ${tenViec(v)}`, { description: 'Video đã lồng tiếng xong — tải về hoặc xem thử ngay.' });
          void phaoGiay();
        } else if (v.trangThai === 'loi') {
          toast.error(`Lỗi: ${tenViec(v)}`, { description: 'Xem chi tiết ở thẻ việc rồi bấm Thử lại.' });
        }
      }
    }
    for (const id of Object.keys(mau.current)) if (!conChay.has(id)) delete mau.current[id];
    ghiNho(KHOA_MAU, mau.current);
    setEta((cu) => {
      const n: Record<string, EtaMuot> = {};
      for (const id of conChay) { const e = lamMuotEta(cu[id] ?? null, moiEta[id] ?? null, t); if (e) n[id] = e; }
      return n;
    });
    setViec(ds);
  }, []);

  const dangChay = useMemo(() => (viec ?? []).some((v) => DANG_CHAY.includes(v.trangThai)) || Object.keys(taiLen).length > 0, [viec, taiLen]);
  useEffect(() => { void napViec(); }, [napViec]);
  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === 'visible') void napViec(); }, dangChay ? 5000 : 30000);
    const nhin = () => { if (document.visibilityState === 'visible') void napViec(); };
    document.addEventListener('visibilitychange', nhin);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', nhin); };
  }, [dangChay, napViec]);
  // Đồng hồ cho "đã chạy", đếm lùi ETA và xoay lời CuongMini.
  useEffect(() => {
    if (!dangChay) return;
    const id = setInterval(() => setNow(Date.now()), 4000);
    return () => clearInterval(id);
  }, [dangChay]);

  const lam = useCallback(async (id: string, f: () => Promise<unknown>, xong: string) => {
    setDangLam(id);
    try { await f(); toast.success(xong); } catch (e) { toast.error(loi(e)); } finally { setDangLam(null); await napViec(); }
  }, [napViec]);
  const catDi = useCallback((v: Viec) => setDaCat((ds) => { const n = [...ds.filter((x) => x !== v.id), v.id].slice(-200); ghiNho(KHOA_CAT, n); return n; }), []);

  const hd: HanhDong = {
    dangLam,
    thuLai: (v) => void lam(v.id, () => longTiengApi.thuLai(v.id), 'Đã xếp lại hàng — trạm làm tiếp từ bước dở.'),
    xoa: (v) => {
      const chay = DANG_CHAY.includes(v.trangThai);
      if (confirm(chay ? 'Huỷ việc này? Trạm sẽ dừng và mọi tệp bị xoá.' : 'Xoá việc này và mọi tệp của nó?')) {
        void lam(v.id, () => longTiengApi.xoa(v.id), chay ? 'Đã huỷ việc.' : 'Đã xoá việc.');
      }
    },
    daTaiVe: (v) => {
      if (confirm('Bạn đã tải đủ các tệp? Tệp trên kho sẽ bị xoá ngay.')) void lam(v.id, () => longTiengApi.daTaiVe(v.id), 'Đã xoá tệp trên kho.');
    },
    thuGon: catDi,
  };

  const { noiBat, lichSu } = useMemo(() => {
    const t = Date.now();
    const nb: Viec[] = [];
    const ls: Viec[] = [];
    for (const v of viec ?? []) {
      const chay = DANG_CHAY.includes(v.trangThai) || taiLen[v.id] != null;
      const moiXong = (v.trangThai === 'xong' && v.ketQua.some((k) => k.url)) || v.trangThai === 'loi';
      const moc = Date.parse(v.xong ?? v.tao);
      if (chay || (moiXong && t - moc < NOI_BAT_MS && !daCat.includes(v.id))) nb.push(v);
      else ls.push(v);
    }
    // Đang chạy lên trước, rồi tới việc vừa xong/lỗi; trong mỗi nhóm giữ thứ tự mới nhất trước của máy chủ.
    nb.sort((a, b) => Number(!DANG_CHAY.includes(a.trangThai)) - Number(!DANG_CHAY.includes(b.trangThai)));
    return { noiBat: nb, lichSu: ls };
  }, [viec, taiLen, daCat]);

  const soChay = (viec ?? []).filter((v) => DANG_CHAY.includes(v.trangThai)).length;
  const lan = Math.floor(now / 9000);

  return (
    <div className="lt mx-auto w-full max-w-[1120px] pb-16">
      <header className="lt-head">
        <div className="min-w-0">
          <div className="lt-eyebrow">Studio lồng tiếng · chỉ quản trị viên</div>
          <h1><AudioLines className="h-8 w-8 text-[var(--lt-accent-text)]" aria-hidden /> CT Lồng Tiếng</h1>
          <p>Lồng tiếng Việt bằng giọng của bạn cho video kỹ thuật tiếng Trung / tiếng Anh — để tự học, không đăng lại. Trạm ở máy nhà làm phần nặng.</p>
        </div>
        <div className="lt-tabs" role="tablist" aria-label="Khu vực">
          <button type="button" role="tab" className="lt-tab" aria-selected={tab === 'lam'} onClick={() => doiTab('lam')}>
            <AudioLines /> Lồng tiếng {soChay > 0 && <span className="lt-count" style={{ background: 'rgba(255,255,255,0.22)', color: 'inherit' }}>{soChay}</span>}
          </button>
          <button type="button" role="tab" className="lt-tab" aria-selected={tab === 'app'} onClick={() => doiTab('app')}>
            <Plug /> Kết nối app
          </button>
        </div>
      </header>

      {tab === 'app' ? <KetNoiApp /> : (
        <div className="lt-stack">
          <TaoViec onDaTao={napViec} setTaiLen={setTaiLen} />

          {!viec ? (
            <div className="lt-card flex items-center justify-center gap-3 py-10 lt-muted"><Loader2 className="lt-spin h-5 w-5" /> Đang tải việc của bạn…</div>
          ) : !viec.length ? (
            <section className="lt-card lt-empty">
              <GauPixel emotion="sleepy" size={110} title="CuongMini đang chờ việc" />
              <b>Chưa có video nào</b>
              <p>Dán link ở ô phía trên là mình bắt tay vào làm liền — tải video, tách giọng, dịch, đọc bằng giọng bạn rồi ghép lại.</p>
            </section>
          ) : (
            <>
              {noiBat.length > 0 && (
                <div className="lt-stack">
                  {noiBat.map((v) => (
                    <TheViec key={v.id} v={v} taiLen={taiLen[v.id]} now={now} lan={lan}
                      eta={eta[v.id] ? Math.max(60, eta[v.id]!.giay - (now - eta[v.id]!.luc) / 1000) : null} hd={hd} />
                  ))}
                </div>
              )}
              {lichSu.length > 0 && <LichSu viec={lichSu} hd={hd} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
