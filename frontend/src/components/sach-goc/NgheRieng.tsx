'use client';

/**
 * 🎧 Bản chép riêng các track nghe CD (Lesson 4–7): lời tiếng Nhật đã hiệu chỉnh
 * + romaji + nghĩa. CHỈ tài khoản được phép (cùng cổng với 📷 Sách gốc); không có
 * âm thanh — người học tự mở CD/tệp nghe của mình rồi đối chiếu theo số track.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Inline } from '@/components/sach-hoc/Blocks';
import cs from '@/components/sach-hoc/course.module.css';
import { layNghe, layTaiLieu, taiAmThanh, useQuyenSachRieng, type TrackNghe } from './useSachRieng';

const NHAN_TIN_CAY = { cao: 'Chắc', vua: 'Khá chắc', thap: 'Cần nghe lại' } as const;
const MAU_TIN_CAY = { cao: '#16a34a', vua: '#d97706', thap: '#dc2626' } as const;

/** Phát âm thanh track CD: chỉ tải khi bấm (66 track, không nạp trước). Cần quyền như trang này. */
function NutNghe({ track }: { track: number }) {
  const [src, setSrc] = useState<string | null>(null);
  const [dang, setDang] = useState(false);
  const [loi, setLoi] = useState(false);
  useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, [src]);
  if (src) return <audio controls autoPlay src={src} style={{ height: 32, maxWidth: '100%' }} />;
  return (
    <button type="button" className={cs.btn} disabled={dang} style={{ padding: '2px 10px', fontSize: 13 }}
      onClick={async () => { setDang(true); setLoi(false); try { setSrc(await taiAmThanh(track)); } catch { setLoi(true); } finally { setDang(false); } }}>
      {dang ? 'Đang tải…' : loi ? 'Lỗi — thử lại' : '▶ Nghe'}
    </button>
  );
}

export default function NgheRieng() {
  const co = useQuyenSachRieng();
  const [ds, setDs] = useState<TrackNghe[] | null>(null);
  const [loi, setLoi] = useState(false);
  const [bai, setBai] = useState<number | 0>(0);
  const [hienRo, setHienRo] = useState(true);
  const [hienVi, setHienVi] = useState(true);
  const [tim, setTim] = useState('');
  const [coAm, setCoAm] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!co) return;
    layNghe().then(setDs).catch(() => setLoi(true));
    layTaiLieu().then((d) => setCoAm(new Set(d.track))).catch(() => {});
  }, [co]);

  const hien = useMemo(() => {
    const q = tim.trim().toLowerCase();
    return (ds ?? []).filter((t) =>
      (!bai || t.lesson === bai) &&
      (!q || t.ten.toLowerCase().includes(q) || String(t.track) === q || t.loi.some((l) => l.ja.includes(q) || (l.ro ?? '').toLowerCase().includes(q) || l.vi.toLowerCase().includes(q))));
  }, [ds, bai, tim]);

  if (co === null) return <div style={{ padding: 32 }}>Đang kiểm tra quyền…</div>;
  if (!co) {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Mục này chỉ dành cho tài khoản được phép. <Link href="/language/ja/dekiru" style={{ fontWeight: 600 }}>Về khoá</Link>
      </div>
    );
  }
  const baiCo = [...new Set((ds ?? []).map((t) => t.lesson))].sort((a, b) => a - b);

  return (
    <div className={`${cs.root} ${cs.ja}`} style={{ maxWidth: 860, margin: '0 auto', padding: '16px 16px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Link href="/language/ja/dekiru/sach-goc" className={cs.iconBtn} aria-label="Về sách gốc"><ArrowLeft size={18} /></Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>🎧 Bản chép file nghe (riêng)</h1>
      </div>
      <p style={{ fontSize: 14, opacity: 0.8, margin: '0 0 12px' }}>
        Chép tự động từ file nghe rồi hiệu chỉnh bằng bài đã học; <b>không phải bản gốc của sách</b>. Bấm ▶ Nghe để nghe track và đối chiếu. Chỗ gắn nhãn
        “Cần nghe lại” hoặc “⚠” thì nghe lại track để chắc chắn. Chỉ mình bạn xem được trang này.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        {[0, ...baiCo].map((n) => (
          <button key={n} type="button" className={cs.btn} onClick={() => setBai(n)}
            style={{ fontWeight: bai === n ? 700 : 400, outline: bai === n ? '2px solid currentColor' : undefined }}>
            {n ? `Lesson ${n}` : 'Tất cả'}
          </button>
        ))}
        <label style={{ fontSize: 13 }}><input type="checkbox" checked={hienRo} onChange={(e) => setHienRo(e.target.checked)} /> Romaji</label>
        <label style={{ fontSize: 13 }}><input type="checkbox" checked={hienVi} onChange={(e) => setHienVi(e.target.checked)} /> Nghĩa</label>
        <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm track / chữ…" aria-label="Tìm"
          style={{ flex: '1 1 160px', minWidth: 140, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(128,128,128,.4)', background: 'transparent', color: 'inherit' }} />
      </div>
      {loi && <p>Không tải được bản chép. Thử tải lại trang.</p>}
      {ds && ds.length === 0 && <p>Chưa có bản chép nào được tải lên.</p>}
      {!ds && !loi && <p>Đang tải…</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {hien.map((t) => (
          <section key={t.track} style={{ border: '1px solid rgba(128,128,128,.3)', borderRadius: 12, padding: 14 }}>
            <header style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline', marginBottom: 8 }}>
              <b>Track {t.track}</b>
              <span style={{ opacity: 0.7, fontSize: 13 }}>Lesson {t.lesson}</span>
              <span style={{ flex: 1 }}>{t.ten}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: MAU_TIN_CAY[t.tinCay] }}>{NHAN_TIN_CAY[t.tinCay]}</span>
            </header>
            {coAm.has(t.track) && <div style={{ marginBottom: 8 }}><NutNghe track={t.track} /></div>}
            {t.loi.length === 0 && <p style={{ opacity: 0.7, margin: 0 }}>Track không có lời đọc nhận dạng được.</p>}
            <div style={{ display: 'grid', gap: 8 }}>
              {t.loi.map((l, k) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: l.ai ? '28px 1fr' : '1fr', gap: 8 }}>
                  {l.ai && <b style={{ opacity: 0.6 }}>{l.ai}</b>}
                  <div>
                    <div style={{ fontSize: 18, lineHeight: 1.9 }}><Inline text={l.ja} /></div>
                    {hienRo && l.ro && <div style={{ fontSize: 13, opacity: 0.7 }}>{l.ro}</div>}
                    {hienVi && <div style={{ fontSize: 14 }}>{l.vi}</div>}
                  </div>
                </div>
              ))}
            </div>
            {!!t.ghiChu?.length && (
              <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 13 }}>
                {t.ghiChu.map((g, k) => <li key={k}><Inline text={g} /></li>)}
              </ul>
            )}
            {!!t.nghiNgo?.length && (
              <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 13, color: '#d97706' }}>
                {t.nghiNgo.map((g, k) => <li key={k}>⚠ {g}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
