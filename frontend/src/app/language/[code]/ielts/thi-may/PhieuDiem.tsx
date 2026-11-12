'use client';

/**
 * PHIẾU ĐIỂM kiểu Test Report Form (12/11/2026).
 * ─────────────────────────────────────────────────────────────────────────
 *  - Một kỹ năng (Reading/Listening): band + điểm thô + thời gian · tỉ lệ đúng theo DẠNG câu (TEN_DANG) + gợi ý "ôn lại bài
 *    nào trong khoá" (BAI_ON → ngay/manifest) · bảng từng câu: đáp án mình / đáp án đúng / giải thích VI / nút Locate
 *    (mở lại phòng thi ở chế độ xem, nhảy tới câu + tô sáng bằng chứng `ev`; Listening nghe lại từng đoạn) · trạng thái Sổ lỗi.
 *  - Writing: band 4 tiêu chí + sửa lỗi + bản viết lại (AI chấm) trình bày lại kiểu thẻ.
 *  - Bộ đề (Thi đủ đề): bảng 4 kỹ năng + Overall (luật làm tròn mục 1.5), Speaking "sắp có" vẫn tính 3 kỹ năng; kèm xếp lớp (Đề 0).
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { De, DeDoc, DeNghe, DeViet, KyNang, Nhom, PhanDoc, PhanNghe } from './de/types';
import { TEN_DANG } from './de/types';
import { TEN_KY_NANG } from './de/index';
import { bandTuDiem, bandTong, dinhDangGio, BAI_ON, linkBai, ngayCuaBai, tapCuaBai, lamTronBand, type KetQuaCau } from './cham';
import { MANIFEST } from '../ngay/manifest';
import { MANIFEST as MANIFEST_T2 } from '../tap-2/ngay/manifest';
import { demTuViet } from './PhongViet';
import { ChuDam } from './Nhom';
import { nhanTraLoi } from './soLoiTuDe';
import { thiChamViet, thiCapNhatLuot, loiGhi, loiMang, type KetQuaViet, type GhiLoi } from '../chung/api';
import type { KetQuaNoi, XepLopKq } from './hopDong';
import s from '../chung/cdt.module.css';

/** id bài → tên bài (mục lục Tập 1, hoặc Tập 2 với id `t2dN-…`); không thấy thì trả lại id. */
const tenBai = (id: string): string => {
  const n = ngayCuaBai(id);
  const mf = tapCuaBai(id) === 2 ? MANIFEST_T2 : MANIFEST;
  return (n != null && mf[n]?.lessons.find((l) => l.id === id)?.title) || id;
};
/** Thứ tự học: Tập 1 trước Tập 2, trong mỗi tập theo ngày. */
const thuTuBai = (id: string): number => (tapCuaBai(id) - 1) * 1000 + (ngayCuaBai(id) ?? 0);

export type KetLuot = {
  id?: number; cheDo: 'practice' | 'full'; phanChon: number[]; giay: number;
  ans?: Record<number, string>; co?: number[]; kq?: KetQuaCau[];
  bai?: Record<number, string>; ai?: Record<number, KetQuaViet>;
  soLoi?: { moi: number; congDon: number } | 'loi' | 'khach';
};

/** Band của một lượt Reading/Listening (chỉ khi đủ 40 câu, chế độ thi). */
export function bandLuot(de: De, l: KetLuot): number | null {
  if (de.kyNang === 'viet') { const a = l.ai ?? {}; const b1 = a[1]?.band ?? null, b2 = a[2]?.band ?? null; return b1 != null && b2 != null ? lamTronBand((b1 + 2 * b2) / 3) : b2 ?? b1; }
  if (de.kyNang !== 'doc' && de.kyNang !== 'nghe') return null;
  const kq = l.kq ?? [];
  if (l.cheDo !== 'full' || kq.length !== 40) return null;
  return bandTuDiem(kq.filter((k) => k.dung).length, de.kyNang);
}

const TEN_TIEU_CHI: Record<string, string> = { TA: 'Task Achievement', TR: 'Task Response', CC: 'Coherence & Cohesion', LR: 'Lexical Resource', GRA: 'Grammatical Range & Accuracy' };

/* ═════════ Đầu phiếu ═════════ */
function DauPhieu({ duongDan, ten, phu }: { duongDan: { ten: string; onClick?: () => void }[]; ten: string; phu?: string }) {
  return (
    <>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}>
          {duongDan.map((d, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && ' / '}
              {d.onClick ? <button type="button" onClick={d.onClick}>{d.ten}</button> : <span style={{ color: 'var(--c-ink)' }}>{d.ten}</span>}
            </span>
          ))}
        </h1>
        <span className={s.nhanTrf}>Test Report Form · ước tính</span>
      </div>
      <div className={s.tenDe}>{ten}{phu ? <span className={s.mo} style={{ fontWeight: 400 }}> · {phu}</span> : null}</div>
    </>
  );
}

function OBand({ nhan, band, phu, to }: { nhan: string; band: number | string | null; phu?: string; to?: boolean }) {
  return (
    <div className={`${s.oBand} ${to ? s.oBandTo : ''}`}>
      <span>{nhan}</span>
      <b>{band ?? '—'}</b>
      {phu && <span className={s.ghiChuNho}>{phu}</span>}
    </div>
  );
}

/* ═════════ Reading / Listening ═════════ */
export function PhieuDiemDocNghe({ de, luot, veTrungTam, lamLai, cacLuot, moXemLai }: {
  de: DeDoc | DeNghe; luot: KetLuot; veTrungTam: () => void; lamLai: () => void; cacLuot: () => void; moXemLai: (n?: number) => void;
}) {
  const kq = luot.kq ?? [];
  const dung = kq.filter((k) => k.dung).length;
  const du40 = luot.cheDo === 'full' && kq.length === 40;
  const band = du40 ? bandTuDiem(dung, de.kyNang) : null;
  const [loc, setLoc] = useState<'tat' | 'sai'>('sai');
  const nhomTheoSo = useMemo(() => {
    const m = new Map<number, Nhom>();
    for (const p of de.phan as (PhanDoc | PhanNghe)[]) for (const g of p.nhom as Nhom[]) for (let n = g.tu; n <= g.den; n++) m.set(n, g);
    return m;
  }, [de]);
  const phanCuaCau = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of de.phan as (PhanDoc | PhanNghe)[]) for (const g of p.nhom as Nhom[]) for (let n = g.tu; n <= g.den; n++) m.set(n, p.so);
    return m;
  }, [de]);
  const theoDang = useMemo(() => {
    const m = new Map<string, { d: number; t: number; dang: KetQuaCau['dang'] }>();
    for (const k of kq) { const x = m.get(k.dang) ?? { d: 0, t: 0, dang: k.dang }; x.t++; if (k.dung) x.d++; m.set(k.dang, x); }
    return [...m.values()].sort((a, b) => a.d / a.t - b.d / b.t);
  }, [kq]);
  const yeu = theoDang.filter((x) => x.d / x.t < 0.7);
  const baiOn = useMemo(() => {
    const ds = new Map<string, string[]>();
    for (const x of yeu) for (const id of BAI_ON[x.dang]) ds.set(id, [...(ds.get(id) ?? []), TEN_DANG[x.dang]]);
    return [...ds.entries()].sort((a, b) => thuTuBai(a[0]) - thuTuBai(b[0]));
  }, [yeu]);
  const dsCau = loc === 'sai' ? kq.filter((k) => !k.dung) : kq;
  const tenPhan = de.kyNang === 'doc' ? 'Passage' : 'Part';

  return (
    <div className={s.khung}>
      <DauPhieu duongDan={[{ ten: 'Luyện thi', onClick: veTrungTam }, { ten: TEN_KY_NANG[de.kyNang] }, { ten: 'Result' }]} ten={de.ten} phu={luot.cheDo === 'full' ? 'Full test' : `Practice (${tenPhan} ${luot.phanChon.join(', ')})`} />
      <div className={s.hangBand}>
        <OBand nhan={`${TEN_KY_NANG[de.kyNang]} band`} band={band} to phu={du40 ? 'bảng quy đổi 40 câu (±0.5)' : 'chỉ quy đổi khi thi đủ 40 câu'} />
        <OBand nhan="Raw score" band={`${dung}/${kq.length}`} phu={`${Math.round((dung / Math.max(1, kq.length)) * 100)}% đúng`} />
        <OBand nhan="Time" band={dinhDangGio(luot.giay)} />
        <OBand nhan="Sổ lỗi" band={kq.length - dung} phu={luot.soLoi === 'khach' ? 'đăng nhập để tự ghi câu sai' : luot.soLoi === 'loi' ? 'chưa ghi được — thử lại sau' : luot.soLoi ? `${luot.soLoi.moi} mới · ${luot.soLoi.congDon} sai lại` : 'đang ghi…'} />
      </div>
      <p className={s.ghiChuNho} style={{ margin: '0 0 18px' }}>⚠️ Band là ƯỚC TÍNH từ đề tự soạn theo bảng quy đổi phổ biến — không phải điểm thi thật; dùng để theo dõi tiến bộ giữa các lượt.</p>

      <div className={s.haiCot}>
        <section>
          <h2 className={s.h2Phieu}>Theo dạng câu hỏi</h2>
          <table className={s.bangKq}>
            <thead><tr><th>Dạng</th><th>Đúng</th><th style={{ width: 150 }} /></tr></thead>
            <tbody>
              {theoDang.map((x) => (
                <tr key={x.dang}><td>{TEN_DANG[x.dang]}</td><td>{x.d}/{x.t}</td><td><div className={s.thanhTien} style={{ margin: 0 }}><i style={{ width: `${(x.d / x.t) * 100}%`, background: x.d / x.t < 0.6 ? 'var(--c-red)' : x.d / x.t < 0.8 ? 'var(--c-flag)' : undefined }} /></div></td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h2 className={s.h2Phieu}>Ôn lại bài nào trong khoá</h2>
          {baiOn.length === 0 && <p className={s.mo}>{yeu.length ? 'Dạng yếu của lượt này chưa có bài riêng trong khoá — luyện bằng Sổ lỗi + đề tiếp theo.' : 'Không có dạng nào dưới 70% — làm đề kế tiếp để giữ nhịp.'}</p>}
          <ul className={s.dsOn}>
            {baiOn.map(([id, dangs]) => (
              <li key={id}>
                <Link href={linkBai(id)} className={s.nutPhu}>📖 {tapCuaBai(id) === 2 ? 'Tập 2 · ' : ''}Ngày {ngayCuaBai(id)} · {tenBai(id)}</Link>
                <span className={s.mo}>vì {[...new Set(dangs)].join(', ')}</span>
              </li>
            ))}
          </ul>
          <div className={s.hangNut} style={{ justifyContent: 'flex-start', marginTop: 10 }}>
            <button type="button" className={s.batDau} onClick={() => moXemLai()}>Xem lại trong phòng thi</button>
            <Link href="/language/en/ielts/so-loi" className={s.nutPhu}>Mở Sổ lỗi</Link>
            <button type="button" className={s.nutPhu} onClick={lamLai}>Làm lại</button>
            <button type="button" className={s.nutPhu} onClick={cacLuot}>Các lượt đã làm</button>
          </div>
        </section>
      </div>

      <h2 className={s.h2Phieu} style={{ marginTop: 22 }}>
        Từng câu
        <span className={s.locKy} style={{ display: 'inline-flex', marginLeft: 12, marginBottom: 0 }}>
          <button type="button" className={`${s.tab} ${loc === 'sai' ? s.tabOn : ''}`} onClick={() => setLoc('sai')}>Câu sai ({kq.length - dung})</button>
          <button type="button" className={`${s.tab} ${loc === 'tat' ? s.tabOn : ''}`} onClick={() => setLoc('tat')}>Tất cả ({kq.length})</button>
        </span>
      </h2>
      {dsCau.length === 0 && <p className={s.mo}>Không có câu sai nào. 🎉</p>}
      <div className={s.cuonNgang}>
        <table className={s.bangKq}>
          <thead><tr><th>#</th><th>Dạng</th><th>Bạn trả lời</th><th>Đáp án</th><th>Giải thích</th><th /></tr></thead>
          <tbody>
            {dsCau.map((k) => {
              const g = nhomTheoSo.get(k.n);
              const da = de.dapAn[k.n];
              return (
                <tr key={k.n} className={k.dung ? s.hangDung : s.hangSai}>
                  <td><b>{k.n}</b><div className={s.ghiChuNho}>{tenPhan} {phanCuaCau.get(k.n)}</div></td>
                  <td className={s.ghiChuNho}>{TEN_DANG[k.dang]}</td>
                  <td>{k.dung ? '✓ ' : '✗ '}{g ? nhanTraLoi(g, k.n, k.traLoi) : k.traLoi || '(bỏ trống)'}</td>
                  <td><b>{g && da ? (k.dang === 'mcq2' ? da.a.map((x) => nhanTraLoi(g, k.n, x)).join(' + ') : da.a.map((x) => nhanTraLoi(g, k.n, x)).join(' / ')) : k.dapAn}</b></td>
                  <td style={{ minWidth: 220, maxWidth: 460 }}>{da?.vi ? <ChuDam t={da.vi} /> : ''}</td>
                  <td>{da?.ev && <button type="button" className={s.nutPhu} onClick={() => moXemLai(k.n)} title="Mở phòng thi, nhảy tới câu này và tô sáng đoạn bằng chứng">📍 Locate</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={s.mo} style={{ marginTop: 14 }}>Mẹo: đừng làm lại đề ngay — sẽ nhớ đáp án. Sổ lỗi cho ôn lại từng câu sai sau ≥ 2 ngày, rồi 7 ngày.</p>
    </div>
  );
}

/* ═════════ Writing ═════════ */
export function PhieuDiemViet({ de, luot, setLuot, veTrungTam, lamLai, buocBo }: { de: DeViet; luot: KetLuot; setLuot: (f: (l: KetLuot) => KetLuot) => void; veTrungTam: () => void; lamLai: () => void; buocBo?: boolean }) {
  const [dangCham, setDangCham] = useState<number | null>(null);
  const [choGiay, setChoGiay] = useState(0);
  const [loi, setLoi] = useState('');
  const [daGhi, setDaGhi] = useState<Record<number, string>>({});
  const tasks = de.task.filter((t) => luot.phanChon.includes(t.so));
  const ai = luot.ai ?? {};
  const tong = bandLuot(de, luot);

  const cham = async (so: number) => {
    const t = de.task.find((x) => x.so === so)!;
    setDangCham(so); setLoi(''); setChoGiay(0);
    try {
      const r = await thiChamViet({ bai: luot.bai?.[so] ?? '', de: t.de, task: so as 1 | 2, moTaHinh: t.moTaSo }, setChoGiay);
      if (!r.ketQua) {
        setLoi(r.lyDo === 'ai_unavailable' ? 'AI chấm bài đang tạm tắt.'
          : r.lyDo === 'khong_thay' ? 'Máy chủ vừa khởi động lại giữa lúc chấm — bấm chấm lại nhé.'
            : r.lyDo === 'qua_lau' ? 'AI chấm quá lâu — thử lại sau ít phút.'
              : r.lyDo === 'loi_ai' ? `Cổng AI báo lỗi: ${r.thongBao ?? ''}` : 'AI trả kết quả không đọc được — thử lại nhé.');
        return;
      }
      const moi = { ...ai, [so]: r.ketQua };
      setLuot((l) => ({ ...l, ai: moi }));
      if (luot.id) {
        const b1 = moi[1]?.band ?? null, b2 = moi[2]?.band ?? null;
        const band = b1 != null && b2 != null ? lamTronBand((b1 + 2 * b2) / 3) : b2 ?? b1;
        void thiCapNhatLuot(luot.id, { band, chiTiet: { bai: luot.bai, phanChon: luot.phanChon, ai: moi } }).catch(() => {});
      }
    } catch (e) {
      const m = loiMang(e);
      setLoi(m.status === 401 ? 'Đăng nhập để AI chấm bài.' : m.status === 429 ? (m.message ?? 'Hết hạn mức AI hôm nay.') : m.message ?? 'Không kết nối được máy chấm.');
    } finally { setDangCham(null); }
  };

  const ghiLoiViet = async (so: number) => {
    const k = ai[so];
    if (!k?.loi.length) return;
    try {
      const muc: GhiLoi[] = k.loi.map((l) => ({
        nguon: `viet:${de.id}:t${so}:${l.goc.toLowerCase().replace(/\s+/g, ' ').slice(0, 100)}`,
        kyNang: 'viet', dang: `Writing Task ${so}`, cauHoi: `Viết lại cho đúng: "${l.goc}"`, daChon: l.goc, dapAn: l.sua, giaiThich: l.vi, lyDo: 'ngu-phap',
        duLieu: { loai: 'viet', goc: l.goc },
      }));
      const r = await loiGhi(muc);
      setDaGhi((d) => ({ ...d, [so]: `Đã thêm ${r.moi} lỗi mới${r.congDon ? `, ${r.congDon} lỗi lặp lại` : ''} vào Sổ lỗi.` }));
    } catch (e) { setDaGhi((d) => ({ ...d, [so]: loiMang(e).message ?? 'Chưa ghi được.' })); }
  };

  return (
    <div className={s.khung}>
      <DauPhieu duongDan={[{ ten: 'Luyện thi', onClick: veTrungTam }, { ten: 'Writing' }, { ten: 'Result' }]} ten={de.ten} />
      <div className={s.hangBand}>
        <OBand nhan="Writing band" band={tong} to phu="Task 2 tính gấp đôi Task 1 · AI ước tính (±0.5–1)" />
        {tasks.map((t) => <OBand key={t.so} nhan={`Task ${t.so}`} band={ai[t.so]?.band ?? null} phu={`${demTuViet(luot.bai?.[t.so] ?? '')} từ${demTuViet(luot.bai?.[t.so] ?? '') < t.minTu ? ` · thiếu (min ${t.minTu})` : ''}`} />)}
        <OBand nhan="Time" band={dinhDangGio(luot.giay)} />
      </div>
      <p className={s.ghiChuNho}>⚠️ Band do AI ước lượng theo band descriptors công khai — không phải điểm thi thật.</p>
      {loi && <p className={s.loi}>{loi}</p>}
      {tasks.map((t) => {
        const k = ai[t.so];
        const bai = luot.bai?.[t.so] ?? '';
        return (
          <section key={t.so} className={s.theTask}>
            <div className={s.theTaskDau}>
              <h2 style={{ fontSize: 18, margin: 0 }}>Task {t.so}</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" className={s.batDau} disabled={dangCham != null || demTuViet(bai) < 40} onClick={() => cham(t.so)}>
                  {dangCham === t.so ? `AI đang chấm… ${choGiay}s (thường 1–2 phút)` : k ? 'Chấm lại' : `Nhờ AI chấm Task ${t.so} (4 tiêu chí)`}
                </button>
                {demTuViet(bai) < 40 && <span className={s.mo}>Bài dưới 40 từ, chưa chấm được.</span>}
              </div>
            </div>
            <details open={!k}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Bài của bạn ({demTuViet(bai)} từ)</summary>
              <div className={s.vanBan} style={{ marginTop: 8 }}>{bai || <span className={s.mo}>(bỏ trống)</span>}</div>
            </details>
            {k && (
              <>
                <div className={s.tieuChi}>
                  {k.tieuChi.map((c) => (
                    <div key={c.ma} className={s.theTieuChi}>
                      <div className={s.theTieuChiDau}><span>{TEN_TIEU_CHI[c.ma] ?? c.ten}</span><b>{c.band}</b></div>
                      <div className={s.thanhTien} style={{ margin: '6px 0 8px' }}><i style={{ width: `${(c.band / 9) * 100}%`, background: c.band < 6 ? 'var(--c-red)' : c.band < 7 ? 'var(--c-flag)' : undefined }} /></div>
                      {c.manh && <p style={{ margin: '0 0 6px' }}>👍 {c.manh}</p>}
                      {c.sua && <p style={{ margin: 0 }}>🔧 {c.sua}</p>}
                    </div>
                  ))}
                </div>
                {k.nhanXet && <p className={s.uuTien}><b>Ưu tiên sửa:</b> {k.nhanXet}</p>}
                {k.loi.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 15, margin: '14px 0 6px' }}>Sửa lỗi cụ thể ({k.loi.length})</h3>
                    <ol className={s.loiViet}>
                      {k.loi.map((l, i) => <li key={i}><span className={s.gach}>{l.goc}</span> → <span className={s.sua}>{l.sua}</span><br /><span className={s.mo}>{l.vi}</span></li>)}
                    </ol>
                    <button type="button" className={s.nutPhu} onClick={() => ghiLoiViet(t.so)}>➕ Thêm các lỗi này vào Sổ lỗi</button>
                    {daGhi[t.so] && <span className={s.mo} style={{ marginLeft: 8 }}>{daGhi[t.so]}</span>}
                  </>
                )}
                {k.banVietLai && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Bản viết lại band +1 (giữ ý của bạn)</summary>
                    <div className={s.vanBan} style={{ marginTop: 8 }}>{k.banVietLai}</div>
                  </details>
                )}
              </>
            )}
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Bài mẫu {t.mau.band} + phân tích</summary>
              <div className={s.vanBan} style={{ marginTop: 8 }}>{t.mau.s}</div>
              <ul style={{ fontSize: 14.5, lineHeight: 1.6 }}>{t.mau.phanTich.map((x, i) => <li key={i}><ChuDam t={x} /></li>)}</ul>
            </details>
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Gợi ý cách làm Task {t.so}</summary>
              <ul style={{ fontSize: 14.5, lineHeight: 1.6 }}>{t.goiY.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </details>
          </section>
        );
      })}
      {!buocBo && (
        <div className={s.hangNut} style={{ justifyContent: 'flex-start' }}>
          <button type="button" className={s.nutPhu} onClick={lamLai}>Viết lại đề này</button>
          <Link href="/language/en/ielts/so-loi" className={s.nutPhu}>Mở Sổ lỗi</Link>
          <button type="button" className={s.nutPhu} onClick={veTrungTam}>Về trung tâm luyện thi</button>
        </div>
      )}
    </div>
  );
}

/* ═════════ Bộ đề đủ 4 kỹ năng ═════════ */
export type KetQuaBo = {
  boId: string;
  bands: Partial<Record<KyNang, number | null>>;
  sangLoc?: { dung: number; tong: number };
  /** Số câu đúng L/R — `xepLop()` nhận số thô. */
  tho?: Partial<Record<'nghe' | 'doc', number>>;
  noi?: KetQuaNoi | null;
  /** Máy chủ đã lưu xếp lớp (luật "chỉ đẩy lên"): vị trí hiệu lực sau lần này. */
  xepLopLuu?: { tap: number; ngay: number; giuCu: boolean; ghiChu?: string } | null;
  /** Kết quả từng kỹ năng để mở chi tiết. */
  chiTiet: Partial<Record<KyNang, { de: De; luot: KetLuot }>>;
  xepLop?: XepLopKq | null;
  luotId?: number;
};

export function PhieuDiemBo({ kq, tenBo, veTrungTam, moChiTiet, coNoi }: { kq: KetQuaBo; tenBo: string; veTrungTam: () => void; moChiTiet: (k: KyNang) => void; coNoi: boolean }) {
  const tong = bandTong({ nghe: kq.bands.nghe, doc: kq.bands.doc, viet: kq.bands.viet, noi: kq.bands.noi });
  const thu: KyNang[] = ['nghe', 'doc', 'viet', 'noi'];
  return (
    <div className={s.khung}>
      <DauPhieu duongDan={[{ ten: 'Luyện thi', onClick: veTrungTam }, { ten: tenBo }, { ten: 'Test Report Form' }]} ten={`${tenBo} — kết quả đủ đề`} />
      <div className={s.trf}>
        {thu.map((k) => {
          const b = kq.bands[k];
          const coChiTiet = !!kq.chiTiet[k];
          return (
            <button key={k} type="button" className={`${s.trfO} ${coChiTiet ? '' : s.trfOMo}`} onClick={() => coChiTiet && moChiTiet(k)} disabled={!coChiTiet}>
              <span>{TEN_KY_NANG[k]}</span>
              <b>{b ?? (k === 'noi' && !coNoi ? 'sắp có' : '—')}</b>
              <span className={s.ghiChuNho}>{coChiTiet ? 'xem chi tiết →' : k === 'noi' && !coNoi ? 'Speaking sẽ bổ sung' : 'chưa làm'}</span>
            </button>
          );
        })}
        <div className={`${s.trfO} ${s.trfTong}`}>
          <span>Overall</span>
          <b>{tong?.band ?? '—'}</b>
          <span className={s.ghiChuNho}>{tong ? `trung bình ${tong.soKy} kỹ năng, làm tròn .0/.5` : 'chưa có kỹ năng nào'}</span>
        </div>
      </div>
      {kq.sangLoc && <p className={s.mo}>Sàng lọc 10′: <b>{kq.sangLoc.dung}/{kq.sangLoc.tong}</b>.</p>}
      {kq.noi?.nhanXet && <p style={{ fontSize: 14.5 }}><b>Speaking:</b> {kq.noi.nhanXet}</p>}
      {kq.xepLop && (
        <section className={s.xepLop}>
          <h2 className={s.h2Phieu}>Xếp lớp — bắt đầu từ đâu</h2>
          <p style={{ fontSize: 17, margin: '0 0 6px' }}>👉 <b>Tập {kq.xepLop.tap} · Ngày {kq.xepLop.ngay}</b></p>
          <ul style={{ margin: '0 0 8px', paddingLeft: 18, fontSize: 14.5 }}>{kq.xepLop.lyDo.map((x, i) => <li key={i}>{x}</li>)}</ul>
          {kq.xepLop.duongOnKem.length > 0 && <p className={s.mo}>Đường ôn kèm: {kq.xepLop.duongOnKem.join(' · ')}</p>}
          {kq.xepLopLuu?.giuCu && <p className={s.mo}>Đã lưu. Lần này thấp hơn vị trí đang học ⇒ giữ <b>Tập {kq.xepLopLuu.tap} · Ngày {kq.xepLopLuu.ngay}</b> (kết quả mới chỉ đẩy lên, không kéo xuống).</p>}
          {kq.xepLopLuu && !kq.xepLopLuu.giuCu && <p className={s.mo}>Đã lưu vị trí vào lộ trình của bạn.{kq.xepLopLuu.ghiChu ? ` ${kq.xepLopLuu.ghiChu}` : ''}</p>}
          <Link href={`/language/en/ielts?buoi=${kq.xepLopLuu?.ngay ?? kq.xepLop.ngay}`} className={s.batDau}>Mở Ngày {kq.xepLopLuu?.ngay ?? kq.xepLop.ngay}</Link>
        </section>
      )}
      <p className={s.ghiChuNho} style={{ marginTop: 14 }}>L/R theo bảng quy đổi 40 câu (±0.5); W/S do AI chấm là ƯỚC TÍNH (±0.5–1). Overall làm tròn: .25 → .5, .75 → lên nguyên (docs mục 1.5).</p>
      <div className={s.hangNut} style={{ justifyContent: 'flex-start', marginTop: 16 }}>
        <button type="button" className={s.nutPhu} onClick={veTrungTam}>Về trung tâm luyện thi</button>
        <Link href="/language/en/ielts/so-loi" className={s.nutPhu}>Mở Sổ lỗi</Link>
      </div>
    </div>
  );
}
