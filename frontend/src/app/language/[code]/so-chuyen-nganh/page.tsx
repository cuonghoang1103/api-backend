'use client';

/**
 * Sổ tay chuyên ngành — bản web của `SoChuyenNganhCTL` (app CT Language), 24/11/2026.
 * Hai phần: TỪ THEO ĐỀ THI (bộ theo môn FPT, chia phần — cũng là các nhóm "Chuyên ngành · môn" trong Học từ vựng › Theo chủ
 * đề) và THEO NGHỀ (đi làm, thực tập, du học). Bấm một bộ ⇒ xem từ, nghe, lưu vào sổ (đồng bộ với app), học / ôn.
 */
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Briefcase, Check, ChevronRight, GraduationCap, Search } from 'lucide-react';
import { KhungCTL, TEN_NN, css as s } from '@/components/language/ctl/chung';
import { apiSoChuyenNganh, laBoDeThi, loiMang, nnTuCode, type BoChuyenNganh } from '@/lib/ctlanguage/api';
import { useSoTu } from '@/lib/ctlanguage/dongBo';
import { nguonSoCn, soTheoNguon, theTrongSo } from '@/lib/ctlanguage/soTu';

const monCua = (b: BoChuyenNganh) => (b.ma.startsWith('doc-de-thi') ? 'Đọc hiểu đề thi' : b.ten.split(' · ')[0] ?? b.ten);

export default function SoChuyenNganhPage() {
  const code = String(useParams().code);
  const nn = nnTuCode(code);
  const so = useSoTu();
  const [bo, setBo] = useState<BoChuyenNganh[] | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [tim, setTim] = useState('');

  useEffect(() => {
    if (!nn) return;
    let song = true;
    apiSoChuyenNganh.danhSach(nn).then((d) => song && setBo(d.bo)).catch((e) => song && setLoi(loiMang(e)));
    return () => { song = false; };
  }, [nn]);

  const q = tim.trim().toLowerCase();
  const loc = useMemo(() => (bo ?? []).filter((b) => !q || b.ten.toLowerCase().includes(q) || (b.moTa ?? '').toLowerCase().includes(q) || (b.mau ?? []).some((m) => m.toLowerCase().includes(q))), [bo, q]);
  const deThi = loc.filter((b) => laBoDeThi(b.ma));
  const nghe = loc.filter((b) => !laBoDeThi(b.ma));
  const theoMon = useMemo(() => {
    const m = new Map<string, BoChuyenNganh[]>();
    for (const b of deThi) m.set(monCua(b), [...(m.get(monCua(b)) ?? []), b]);
    return [...m.entries()];
  }, [deThi]);
  const soMon = new Set((bo ?? []).filter((b) => laBoDeThi(b.ma) && !b.ma.startsWith('doc-de-thi')).map(monCua)).size;

  const daLuu = (b: BoChuyenNganh) => {
    if (!nn || !so.dangNhap) return null;
    const ids = soTheoNguon(so.guong, nn, nguonSoCn(b.ma)).map((x) => x.id);
    return ids.length ? theTrongSo(so.guong, nn, ids).length : null;
  };

  if (!nn) return <KhungCTL code={code} dangO="so-chuyen-nganh" tieuDe="Sổ chuyên ngành"><div className={s.trong}>Sổ chuyên ngành có cho tiếng Anh, tiếng Nhật và tiếng Trung.</div></KhungCTL>;

  const the = (b: BoChuyenNganh) => {
    const n = daLuu(b);
    return (
      <Link key={b.ma} href={`/language/${code}/so-chuyen-nganh/${b.ma}`} className={s.epCard} style={{ '--c1': 'var(--lh-accent)' } as CSSProperties}>
        <span className={s.loIco}>{laBoDeThi(b.ma) ? <GraduationCap size={20} /> : <Briefcase size={20} />}</span>
        <span className={s.minh}>
          <span className={s.epTitle} style={{ display: 'block' }}>{b.ten}</span>
          <span className={s.baiMau} style={{ display: 'block' }}>{b.soTu ?? 0} từ · {(b.mau ?? []).slice(0, 3).join(' · ')}</span>
          {b.moTa ? <span className={`${s.note} ${s.ten2}`}>{b.moTa}</span> : null}
          {n != null ? <span className={s.xong} style={{ fontSize: 12.5 }}><Check size={12} style={{ display: 'inline' }} /> Đã lưu {n}/{b.soTu ?? 0} từ vào sổ</span> : null}
        </span>
        <ChevronRight size={16} style={{ color: 'var(--lh-ink-3)', flex: 'none', alignSelf: 'center' }} />
      </Link>
    );
  };

  return (
    <KhungCTL code={code} dangO="so-chuyen-nganh" tieuDe={`Sổ chuyên ngành · ${TEN_NN[nn]}`}>
      <p className={s.eyebrow}>{TEN_NN[nn]} · Sổ tay</p>
      <h1 className={s.h1}>Sổ chuyên ngành</h1>
      <p className={s.lede}>
        Từ vựng theo môn học và theo nghề — có cách đọc, nghĩa Việt và câu ví dụ trong tình huống thật.
        {nn === 'en' && soMon ? ' Phần “Từ theo đề thi” gom từ hay gặp trong đề các môn FPT, chia theo môn.' : ''} Lưu cả bộ vào sổ là ôn lặp được trên web lẫn app.
      </p>
      <label className={s.chip} style={{ marginTop: 18, width: '100%', maxWidth: 420 }}>
        <Search size={14} />
        <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm môn, chủ đề, từ… (vd. SWT301, cache)"
          style={{ background: 'transparent', outline: 'none', border: 0, flex: 1, minWidth: 0, color: 'var(--lh-ink)' }} aria-label="Tìm bộ từ" />
      </label>
      {loi ? <div className={s.loi} style={{ marginTop: 20 }}>{loi}</div> : null}
      {!bo && !loi ? <div className={s.trong}>Đang tải các bộ…</div> : null}

      {theoMon.length ? (
        <section className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.h2}>Từ theo đề thi</h2>
            <span className={s.note}>{deThi.length} bộ · {theoMon.length} nhóm{nn === 'en' ? ' · học theo bài ở Học từ vựng › Theo chủ đề' : ''}</span>
          </div>
          {theoMon.map(([mon, ds]) => (
            <div key={mon} style={{ marginTop: 14 }}>
              <div className={s.h3} style={{ marginBottom: 8 }}>{mon}</div>
              <div className={s.grid}>{ds.map(the)}</div>
            </div>
          ))}
        </section>
      ) : null}

      {nghe.length ? (
        <section className={s.section}>
          <div className={s.sectionHead}><h2 className={s.h2}>Theo nghề</h2><span className={s.note}>{nghe.length} bộ</span></div>
          <div className={s.grid}>{nghe.map(the)}</div>
        </section>
      ) : null}
      {bo && !loc.length ? <div className={s.trong}>Không có bộ nào khớp “{tim}”.</div> : null}
    </KhungCTL>
  );
}
