'use client';

/**
 * 🖼️ Tài liệu gốc JPD123 — slide của cô, bài tập, đề ôn, hướng dẫn thi nói, Irodori, từ mới (ảnh từng trang).
 * CHỈ tài khoản được phép (cùng cổng với 📷 Sách gốc); người khác không thấy, API trả 403.
 * URL: `?doc=<id>` mở thẳng một tài liệu · `&trang=N` cuộn tới trang N.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import cs from '@/components/sach-hoc/course.module.css';
import { NHOM_TAI_LIEU, layTaiLieu, urlTaiLieu, useAnhDuong, useQuyenSachRieng, type DanhMucTaiLieu, type TaiLieuGoc } from './useSachRieng';

function Trang({ id, p, tong }: { id: string; p: number; tong: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [gan, setGan] = useState(p <= 2);
  useEffect(() => {
    const el = ref.current;
    if (!el || gan) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setGan(true); io.disconnect(); } }, { rootMargin: '1200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [gan]);
  const src = useAnhDuong(urlTaiLieu(id, p), gan);
  return (
    <div ref={ref} id={`trang-${p}`} style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, opacity: 0.6, margin: '0 0 4px' }}>Trang {p} / {tong}</div>
      <div style={{ minHeight: gan ? undefined : 360, background: 'rgba(128,128,128,.08)', borderRadius: 8, overflow: 'hidden' }}>
        {gan && src && src !== 'loi' && (
          // eslint-disable-next-line @next/next/no-img-element -- ảnh riêng tư qua API, không tối ưu được
          <img src={src} alt={`Trang ${p}`} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
        )}
        {src === 'loi' && <p style={{ padding: 16 }}>Không tải được trang này.</p>}
      </div>
    </div>
  );
}

export default function TaiLieuRieng() {
  const co = useQuyenSachRieng();
  const [dm, setDm] = useState<DanhMucTaiLieu | null>(null);
  const [loi, setLoi] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [tim, setTim] = useState('');

  useEffect(() => { if (co) layTaiLieu().then(setDm).catch(() => setLoi(true)); }, [co]);
  useEffect(() => {
    if (!dm) return;
    const q = new URLSearchParams(window.location.search);
    const d = q.get('doc');
    if (d && dm.taiLieu.some((x) => x.id === d)) setDocId(d);
  }, [dm]);
  useEffect(() => {
    if (!docId) return;
    const t = Number(new URLSearchParams(window.location.search).get('trang'));
    if (t > 0) setTimeout(() => document.getElementById(`trang-${t}`)?.scrollIntoView(), 300);
  }, [docId]);

  const doc: TaiLieuGoc | undefined = dm?.taiLieu.find((x) => x.id === docId);
  const ds = useMemo(() => (dm?.taiLieu ?? []).filter((d) => !tim.trim() || d.ten.toLowerCase().includes(tim.trim().toLowerCase())), [dm, tim]);

  if (co === null) return <div style={{ padding: 32 }}>Đang kiểm tra quyền…</div>;
  if (!co) {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Mục này chỉ dành cho tài khoản được phép. <Link href="/language/ja/dekiru" style={{ fontWeight: 600 }}>Về khoá</Link>
      </div>
    );
  }

  return (
    <div className={`${cs.root} ${cs.ja}`} style={{ maxWidth: 980, margin: '0 auto', padding: '16px 16px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {doc
          ? <button type="button" className={cs.iconBtn} onClick={() => setDocId(null)} aria-label="Về danh sách"><ArrowLeft size={18} /></button>
          : <Link href="/language/ja/dekiru/sach-goc" className={cs.iconBtn} aria-label="Về sách gốc"><ArrowLeft size={18} /></Link>}
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>🖼️ {doc ? doc.ten : 'Tài liệu gốc JPD123 (riêng)'}</h1>
      </div>

      {!doc && (
        <>
          <p style={{ fontSize: 14, opacity: 0.8, margin: '0 0 12px' }}>
            Slide của cô, bài tập, đề ôn, hướng dẫn thi nói, Irodori và danh sách từ mới — đúng bản gốc, từng trang. Chỉ mình bạn xem được.
            File nghe CD có nút phát ngay ở <Link href="/language/ja/dekiru/sach-goc/nghe" style={{ fontWeight: 600 }}>🎧 Bản chép nghe</Link>.
          </p>
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm tài liệu (vd: Slot 12, BT ngữ pháp…)" aria-label="Tìm"
            style={{ width: '100%', maxWidth: 420, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(128,128,128,.4)', background: 'transparent', color: 'inherit', marginBottom: 12 }} />
          {loi && <p>Không tải được danh mục. Thử tải lại trang.</p>}
          {dm && dm.taiLieu.length === 0 && <p>Chưa có tài liệu nào được tải lên.</p>}
          {!dm && !loi && <p>Đang tải…</p>}
          {NHOM_TAI_LIEU.map((g) => {
            const ls = ds.filter((d) => d.nhom === g.id);
            if (!ls.length) return null;
            return (
              <section key={g.id} style={{ marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{g.ten}</h2>
                <p style={{ fontSize: 12, opacity: 0.65, margin: '0 0 6px' }}>{g.mota}</p>
                <div style={{ display: 'grid', gap: 6 }}>
                  {ls.map((d) => (
                    <button key={d.id} type="button" onClick={() => { setDocId(d.id); window.scrollTo(0, 0); }} className={cs.btn}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: 8, textAlign: 'left' }}>
                      <span>{d.ten}</span><small style={{ opacity: 0.6 }}>{d.soTrang} trang</small>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
          {!!dm?.lienNgoai.length && (
            <section>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>Link làm thử của cô</h2>
              {dm.lienNgoai.map((l) => <p key={l.url} style={{ margin: '0 0 4px' }}><a href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>{l.ten} ↗</a></p>)}
            </section>
          )}
        </>
      )}

      {doc && (
        <div>
          {Array.from({ length: doc.soTrang }, (_, k) => <Trang key={`${doc.id}-${k + 1}`} id={doc.id} p={k + 1} tong={doc.soTrang} />)}
        </div>
      )}
    </div>
  );
}
