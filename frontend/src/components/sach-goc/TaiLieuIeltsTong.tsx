'use client';

/**
 * 🔒 Trang tổng tài liệu riêng IELTS (/language/en/ielts/tai-lieu-rieng) — mọi tài liệu theo nhóm / nguồn, mỗi tài liệu
 * kèm các bài nó gắn (bấm để mở bài). CHỈ tài khoản có 'ielts' trong `/sach-rieng/quyen`.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import cs from '@/components/sach-hoc/course.module.css';
import { IELTS } from '@/app/language/[code]/ielts/data';
import { IELTS_T2 } from '@/app/language/[code]/ielts/tap-2/data';
import { TheMucIelts } from './TaiLieuIelts';
import { duongBai, layDanhMucIelts, useCoIelts, type MucIelts } from './ielts';
import st from './taiLieuIelts.module.css';

const TEN_BAI = new Map<string, string>([...IELTS.allLessons, ...IELTS_T2.allLessons].map((l) => [l.id, l.title]));

export default function TaiLieuIeltsTong() {
  const co = useCoIelts();
  const [ds, setDs] = useState<MucIelts[] | null>(null);
  const [loi, setLoi] = useState(false);
  const [tim, setTim] = useState('');
  const [loai, setLoai] = useState<'' | MucIelts['loai']>('');

  useEffect(() => { if (co) layDanhMucIelts().then((d) => setDs(d.muc)).catch(() => setLoi(true)); }, [co]);

  const nhom = useMemo(() => {
    const q = tim.trim().toLowerCase();
    const loc = (ds ?? []).filter((m) => (!loai || m.loai === loai) && (!q || `${m.tieuDe} ${m.nguon} ${m.nhom ?? ''} ${m.tomTat ?? ''}`.toLowerCase().includes(q)));
    const g = new Map<string, Map<string, MucIelts[]>>();
    for (const m of loc) {
      const n = m.nhom || 'Khác';
      if (!g.has(n)) g.set(n, new Map());
      const theoNguon = g.get(n)!;
      if (!theoNguon.has(m.nguon)) theoNguon.set(m.nguon, []);
      theoNguon.get(m.nguon)!.push(m);
    }
    return [...g.entries()];
  }, [ds, tim, loai]);

  if (co === null) return <div style={{ padding: 32 }}>Đang kiểm tra quyền…</div>;
  if (!co) {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Mục này chỉ dành cho tài khoản được phép. <Link href="/language/en/ielts" style={{ fontWeight: 600 }}>Về khoá IELTS</Link>
      </div>
    );
  }

  return (
    <div className={cs.root}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '16px 16px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Link href="/language/en/ielts" className={cs.iconBtn} aria-label="Về khoá IELTS"><ArrowLeft size={18} /></Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>🔒 Tài liệu riêng IELTS</h1>
        </div>
        <p style={{ fontSize: 14, opacity: 0.8, margin: '0 0 12px' }}>
          Video, audio và sách của các khoá IELTS cũ — chỉ mình bạn xem được, không tải về. Mỗi tài liệu đã gắn vào bài học tương ứng
          (mở bài sẽ thấy khung “🔒 Tài liệu riêng” ở đầu bài).
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          {(['', 'video', 'audio', 'pdf'] as const).map((l) => (
            <button key={l || 'tat-ca'} type="button" className={`${st.nutPhu} ${loai === l ? st.dang : ''}`} onClick={() => setLoai(l)}>
              {l === '' ? 'Tất cả' : l === 'video' ? '🎬 Video' : l === 'audio' ? '🎧 Audio' : '📄 PDF'}
            </button>
          ))}
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm tài liệu…" aria-label="Tìm tài liệu"
            style={{ flex: '1 1 200px', minWidth: 160, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--lh-line)', background: 'var(--lh-surface)', color: 'inherit' }} />
        </div>
        {loi && <p>Không tải được danh mục. Thử tải lại trang.</p>}
        {!ds && !loi && <p>Đang tải…</p>}
        {ds && ds.length > 0 && nhom.length === 0 && <p>Không có tài liệu khớp.</p>}
        {nhom.map(([tenNhom, theoNguon]) => (
          <section key={tenNhom} style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{tenNhom}</h2>
            {[...theoNguon.entries()].map(([nguon, ls]) => (
              <div key={nguon} style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.75, margin: '0 0 6px' }}>{nguon} · {ls.length} mục</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {ls.map((m) => (
                    <TheMucIelts key={m.id} muc={m} chanTrang={m.baiGan.length > 0 && (
                      <div className={st.phu} style={{ marginTop: 8, lineHeight: 1.7 }}>
                        Gắn bài:{' '}
                        {m.baiGan.map((b, i) => (
                          <span key={`${b.lessonId}-${i}`}>
                            {i > 0 && ' · '}
                            <Link href={duongBai(b.lessonId)} style={{ fontWeight: 600, textDecoration: 'underline' }} title={b.trongTam || undefined}>
                              {TEN_BAI.get(b.lessonId) ?? b.lessonId}
                            </Link>
                          </span>
                        ))}
                      </div>
                    )} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
