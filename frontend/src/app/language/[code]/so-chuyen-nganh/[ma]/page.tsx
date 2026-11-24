'use client';

/**
 * Một bộ sổ chuyên ngành — bản web của `ChiTietSoChuyenNganhCTL` (app CT Language), 24/11/2026.
 * Từ gom theo nhóm, mỗi từ: cách đọc, nghĩa Việt, câu ví dụ (nghe được) · lưu từng từ hoặc cả bộ vào sổ
 * "Chuyên ngành · <tên bộ>" (cùng sổ, cùng nguồn `cn:<mã>` như app ⇒ điện thoại thấy ngay) · học theo bài (Học từ vựng)
 * · ôn nhanh cả bộ bằng các dạng câu hỏi.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookmarkPlus, Check, GraduationCap, ListChecks, Play } from 'lucide-react';
import { KhungCTL, NutLuu, NutNghe, css as s, useBao } from '@/components/language/ctl/chung';
import { PhienHoc } from '@/components/language/ctl/PhienHoc';
import { apiSoChuyenNganh, laBoDeThi, loiMang, nnTuCode, type ChiTietBoChuyenNganh } from '@/lib/ctlanguage/api';
import { luuTu, useSoTu } from '@/lib/ctlanguage/dongBo';
import { daGapTu, type TuHoc } from '@/lib/ctlanguage/hocTuVung';
import { khoHtv } from '@/lib/ctlanguage/khoTrinhDuyet';
import { khoaTu, nguonSoCn, soTheoNguon, theHtvTheoKhoa, theTrongSo } from '@/lib/ctlanguage/soTu';
import { usePro } from '@/hooks/usePro';

export default function BoChuyenNganhPage() {
  const p = useParams();
  const code = String(p.code);
  const ma = String(p.ma);
  const nn = nnTuCode(code);
  const so = useSoTu();
  const kho = khoHtv.useGiaTri();
  const { isPro } = usePro();
  const { hien, nut: bao } = useBao();
  const [bo, setBo] = useState<ChiTietBoChuyenNganh | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [on, setOn] = useState<TuHoc[] | null>(null);

  useEffect(() => {
    if (!nn) return;
    let song = true;
    apiSoChuyenNganh.chiTiet(nn, ma).then((d) => song && setBo(d)).catch((e) => song && setLoi(loiMang(e)));
    return () => { song = false; };
  }, [nn, ma]);

  const nhom = useMemo(() => {
    const m = new Map<string, NonNullable<ChiTietBoChuyenNganh['tu']>>();
    for (const t of bo?.tu ?? []) { const n = t.nhom ?? 'Khác'; m.set(n, [...(m.get(n) ?? []), t]); }
    return [...m.entries()];
  }, [bo]);
  const tuHoc = useMemo((): TuHoc[] => (bo?.tu ?? []).filter((t) => t.nghiaVi).map((t) => ({
    k: khoaTu(nn ?? 'en', t.chu), id: t.id, chu: t.chu, doc: t.doc, nghia: t.nghiaVi!, viDu: t.viDu, viDuDoc: t.viDuDoc, viDuNghia: t.viDuNghia,
  })), [bo, nn]);

  if (!nn) return <KhungCTL code={code} dangO="so-chuyen-nganh" tieuDe="Sổ chuyên ngành"><div className={s.trong}>Không hỗ trợ ngôn ngữ này.</div></KhungCTL>;

  const tenSo = `Chuyên ngành · ${bo?.ten ?? ''}`;
  const soBo = soTheoNguon(so.guong, nn, nguonSoCn(ma));
  const trongSo = soBo.length ? theTrongSo(so.guong, nn, soBo.map((x) => x.id)) : [];
  const theHtv = theHtvTheoKhoa(so.guong, nn);
  const daGap = tuHoc.filter((w) => daGapTu(kho, theHtv, nn, w.k)).length;

  const luuCaBo = () => {
    if (!bo) return;
    if (!so.dangNhap) { hien('Đăng nhập để lưu vào sổ — sổ đồng bộ với app CT Language trên điện thoại.'); return; }
    if (so.trang !== 'san') { hien('Sổ đang đồng bộ, thử lại sau giây lát.'); return; }
    const kq = luuTu(nn, bo.tu.map((t) => ({ id: t.id, chu: t.chu, doc: t.doc ?? null, hanViet: t.hanViet ?? null, nghiaVi: t.nghiaVi ?? null })),
      { laPro: isPro, nguonSo: nguonSoCn(ma), tenSo: tenSo.slice(0, 60) });
    hien(kq.chan ? `Đã lưu ${kq.moi} từ — sổ bản miễn phí tối đa 200 từ, nâng Pro để lưu thêm.` : `Đã lưu ${kq.moi} từ mới vào sổ “${tenSo}”.`);
  };

  return (
    <KhungCTL code={code} dangO="so-chuyen-nganh" quayVe={`/language/${code}/so-chuyen-nganh`} tieuDe={bo?.ten ?? 'Sổ chuyên ngành'} hep>
      {loi ? <div className={s.loi}>{loi}</div> : null}
      {!bo && !loi ? <div className={s.trong}>Đang tải bộ từ…</div> : null}
      {bo ? (
        <>
          <p className={s.eyebrow}>{laBoDeThi(ma) ? 'Từ theo đề thi' : 'Theo nghề'}</p>
          <h1 className={s.h1}>{bo.ten}</h1>
          {bo.moTa ? <p className={s.lede}>{bo.moTa}</p> : null}
          <p className={s.note} style={{ marginTop: 8 }}>
            {bo.tu.length} từ · {bo.tu.filter((t) => t.viDu).length} câu ví dụ · soạn tay bởi CuongThai
            {trongSo.length ? ` · trong sổ “${soBo[0]!.ten}” ${trongSo.length}/${bo.tu.length}` : ''}
            {daGap ? ` · đã học ${daGap}/${tuHoc.length}` : ''}
          </p>
          <div className={s.chips} style={{ marginTop: 16 }}>
            {nn === 'en' && laBoDeThi(ma) ? (
              <Link href={`/language/${code}/hoc-tu-vung?nhom=cn-${ma}`} className={`${s.btn}`}><GraduationCap size={16} /> Học theo bài</Link>
            ) : null}
            <button type="button" className={`${s.btn} ${nn === 'en' && laBoDeThi(ma) ? s.btnPhu : ''}`} disabled={tuHoc.length < 3} onClick={() => setOn([...tuHoc].sort(() => Math.random() - 0.5).slice(0, 20))}><ListChecks size={16} /> Ôn nhanh 20 từ</button>
            <button type="button" className={`${s.btn} ${s.btnPhu}`} onClick={luuCaBo} disabled={trongSo.length >= bo.tu.length}>
              {trongSo.length >= bo.tu.length ? <><Check size={16} /> Cả bộ đã trong sổ</> : <><BookmarkPlus size={16} /> Lưu cả bộ vào sổ</>}
            </button>
          </div>

          {nhom.map(([ten, ds]) => (
            <section key={ten} className={s.section} style={{ marginTop: 28 }}>
              <div className={s.sectionHead}><h2 className={s.h3}>{ten} · {ds.length}</h2></div>
              <div className={`${s.card}`} style={{ padding: '4px 16px' }}>
                {ds.map((t) => (
                  <div key={`${t.id}-${t.chu}`} className={s.vocabRow}>
                    <div className={s.minh}>
                      <div><span className={s.vocabChu}>{t.chu}</span>{t.doc ? <span className={s.vocabDoc}>{t.doc.replace(/[『』]/g, '')}</span> : null}{t.hanViet ? <span className={s.vocabDoc}>· {t.hanViet}</span> : null}</div>
                      {t.nghiaVi ? <div className={s.vocabNghia}>{t.nghiaVi}</div> : null}
                      {t.viDu ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginTop: 6 }}>
                          <div className={s.minh}>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{t.viDu}</div>
                            {t.viDuDoc && nn !== 'en' ? <div className={s.lineDoc}>{t.viDuDoc}</div> : null}
                            {t.viDuNghia ? <div className={s.vocabVd}>{t.viDuNghia}</div> : null}
                          </div>
                          <NutNghe chu={t.viDu} nn={nn} nhan="Nghe câu ví dụ" mau="var(--lh-ink-3)" />
                        </div>
                      ) : null}
                    </div>
                    <NutNghe chu={t.chu} nn={nn} />
                    <NutLuu nho nn={nn} muc={{ id: t.id, chu: t.chu, doc: t.doc ?? null, hanViet: t.hanViet ?? null, nghiaVi: t.nghiaVi ?? null }} />
                  </div>
                ))}
              </div>
            </section>
          ))}
          <div style={{ marginTop: 28 }}>
            <button type="button" className={`${s.btn} ${s.btnLon}`} disabled={tuHoc.length < 3} onClick={() => setOn([...tuHoc].sort(() => Math.random() - 0.5).slice(0, 20))}><Play size={16} fill="currentColor" /> Ôn nhanh bộ này</button>
          </div>
        </>
      ) : null}
      {on && bo ? (
        <PhienHoc nn={nn} tenBai={bo.ten} baiId={null} cheDo="on" daGap={(k) => daGapTu(kho, theHtv, nn, k)}
          tu={on} dong={() => setOn(null)} />
      ) : null}
      {bao}
    </KhungCTL>
  );
}
