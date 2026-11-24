'use client';

/**
 * Một phiên học từ vựng trên web — bám `PhienHocTuVungCTL` của app CT Language (24/11/2026).
 *  · "hoc": ≤ 8 từ mới, nhóm 4: thẻ từng từ ("Đã biết" ⇒ bỏ qua) → câu nhận biết → ghép cặp → câu nhớ lại khác dạng.
 *    Một từ được ghi "đã học" khi đúng ở ≥ 2 dạng khác nhau (ghi ngay lúc đạt — thoát giữa chừng không mất), rồi vào sổ
 *    "Học từ vựng" của tài khoản (ôn lặp, điện thoại thấy là đã học).
 *  · "on": mỗi từ một câu, ≥ 5 từ có vòng ghép cặp. · "kiemTra": 10 câu trộn dạng, không thẻ.
 *  · "kiemTraDot": kiểm tra ĐỢT 4 NGÀY (ưu tiên dạng nhớ lại, không ghép cặp): đúng ngay ⇒ đã thuộc + thẻ ôn lặp "Dễ";
 *    sai ⇒ khó + thẻ ôn lặp "Quên" (chưa có thẻ ⇒ thêm vào ôn lặp) — app `KhoHocTuVungCTL.chotDot`.
 * NGỮ PHÁP (cài đặt "Ghép ngữ pháp", chế độ học + kiểm tra nhanh): 2–3 câu quiz của điểm ngữ pháp của bài (trường `nguPhap` của
 * lộ trình) — bài không kèm ⇒ điểm chưa luyện đầu tiên cùng cấp — rải trong hàng đợi (app `NguPhapPhienHTV`). Công khai,
 * tải sau khi phiên đã chạy (mạng chậm không chặn phiên).
 * Câu sai quay lại cuối phiên ở dạng khác (≤ 2 lần/từ). 5 tim, sai mất 1, đúng liền 5 câu hồi 1; hết tim ⇒ Gấu tặng 3 tim.
 * Thẻ từ có "Nói theo" (chấm phát âm — `LuyenPhatAm.tsx`).
 * Phím: 1–4 chọn đáp án · Enter kiểm tra / tiếp tục · Esc thoát.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { BookOpenCheck, Check, Flame, Heart, Volume2, X } from 'lucide-react';
import { GIONG_MAC_DINH, NutNghe, css as s, phat } from './chung';
import { NutPhatAm } from './LuyenPhatAm';
import { usePro } from '@/hooks/usePro';
import { apiNguPhap, type NguPhapGoiY } from '@/lib/ctlanguage/api';
import { chamNhieuThe, danhDauHomNay, ghiHocXong, useSoTu } from '@/lib/ctlanguage/dongBo';
import {
  TEN_DANG, cauHoiLai, chenRai, chonDiemNguPhap, chotDot, docHien, dotDangMo, ghiDaBiet, ghiDaHocMot, ghiKetQua, goDung, hangHoc, hangOn,
  khongTrung, moiHomNay, xepDung, type CauHoi, type CauQuizNguPhap, type DangCau, type MucPhien, type TomTatNguPhap, type TuHoc,
} from '@/lib/ctlanguage/hocTuVung';
import { khoHtv } from '@/lib/ctlanguage/khoTrinhDuyet';
import { idTam, theHtvTheoKhoa, type ChamOn, type MucTuCTL, type NnCTL, type TheTuCTL } from '@/lib/ctlanguage/soTu';

export const TU_MOI_MOI_LUOT = 8;
const TIM = 5;
export type CheDoPhien = 'hoc' | 'on' | 'kiemTra' | 'kiemTraDot';

const mucCua = (w: TuHoc) => ({ id: w.id, chu: w.chu, doc: w.doc ?? null, nghiaVi: w.nghia, thongDung: true });

export function PhienHoc({ nn, tenBai, baiId, tu, cheDo, dong, baiKe, daGap, nguPhap, cap, dotId }: {
  nn: NnCTL; tenBai: string; baiId: string | null; tu: TuHoc[]; cheDo: CheDoPhien; dong: () => void;
  /** Từ đã gặp (trình duyệt + sổ "Học từ vựng" của tài khoản) — phiên học chỉ lấy từ CHƯA gặp. */
  daGap: (k: string) => boolean;
  /** Mở bài kế (nút ở tổng kết). */
  baiKe?: (() => void) | null;
  /** Điểm ngữ pháp đi cùng bài (lộ trình) + cấp của bài (chọn điểm cùng cấp khi bài không kèm). */
  nguPhap?: NguPhapGoiY | null;
  cap?: string | null;
  /** Chế độ "kiemTraDot": id đợt 4 ngày. */
  dotId?: string | null;
}) {
  const { isPro } = usePro();
  const kho = khoHtv.useGiaTri();
  const so = useSoTu();
  const [hang, setHang] = useState<MucPhien[]>([]);
  const [viTri, setViTri] = useState(0);
  const [buoc, setBuoc] = useState<'chay' | 'daHocHet' | 'tongKet'>('chay');
  const [moi, setMoi] = useState<TuHoc[]>([]);
  const [biet, setBiet] = useState<Set<string>>(new Set());
  const [daHoc, setDaHoc] = useState<TuHoc[]>([]);
  const daQua = useRef(new Map<string, Set<DangCau>>());
  const hoiLaiDem = useRef(new Map<string, number>());
  const gap = useRef(new Set<string>());
  const [dungNgay, setDungNgay] = useState<Set<string>>(new Set());
  const [sai, setSai] = useState<Set<string>>(new Set());
  // Đang trả lời
  const [chon, setChon] = useState<number | null>(null);
  const [go, setGo] = useState('');
  const [xep, setXep] = useState<number[]>([]);
  const [daCham, setDaCham] = useState(false);
  const [dungCau, setDungCau] = useState(false);
  const [vuaHoc, setVuaHoc] = useState<string | null>(null);
  // Tim · combo
  const [tim, setTim] = useState(TIM);
  const [chuoi, setChuoi] = useState(0);
  const [chuoiMax, setChuoiMax] = useState(0);
  const [hetTim, setHetTim] = useState(false);
  const [chan200, setChan200] = useState(false);
  const daBatDau = useRef(false);
  // Ngữ pháp
  const [np, setNp] = useState<TomTatNguPhap | null>(null);
  const [npKq, setNpKq] = useState({ dung: 0, tong: 0 });
  const viTriRef = useRef(0);
  const buocRef = useRef(buoc);
  useEffect(() => { viTriRef.current = viTri; buocRef.current = buoc; });

  const nhieu = useMemo(() => {
    let n = khongTrung(tu);
    if (n.length < 8) {
      const co = new Set(n.map((x) => x.k));
      const them = Object.values(kho.tu).filter((t) => t.nn === nn && !co.has(t.k)).slice(0, 10)
        .map((t) => ({ k: t.k, id: t.id0 ?? -1, chu: t.chu, doc: t.doc, nghia: t.nghia, cap: t.cap, viDu: t.viDu, viDuNghia: t.viDuNghia }));
      n = [...n, ...them];
    }
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tu, nn]);

  // Dựng hàng đợi MỘT lần lúc mở phiên.
  useEffect(() => {
    if (daBatDau.current) return;
    daBatDau.current = true;
    if (cheDo === 'hoc') {
      const m = tu.filter((w) => !daGap(w.k)).slice(0, TU_MOI_MOI_LUOT);
      setMoi(m);
      if (!m.length) { setBuoc('daHocHet'); return; }
      setHang(hangHoc(m, nn, nhieu));
    } else if (cheDo === 'on') {
      setHang(hangOn(tu, nn, nhieu, { ghep: true }));
    } else if (cheDo === 'kiemTraDot') {
      setHang(hangOn(tu, nn, nhieu, { ghep: false, uuTienNhoLai: true }));
    } else {
      setHang(hangOn(khongTrung(tu).sort(() => Math.random() - 0.5).slice(0, 10), nn, nhieu, { ghep: false }));
    }
    if (kho.caiDat.ghepNguPhap !== false && (cheDo === 'hoc' || cheDo === 'kiemTra')) void napNguPhap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheDo, tu, nn, nhieu]);

  /** Tải điểm ngữ pháp + chèn 2–3 câu quiz vào phần hàng đợi còn lại (app `napNguPhap`). Lỗi mạng ⇒ bỏ qua im lặng. */
  async function napNguPhap() {
    try {
      let ma = nguPhap?.id ?? null;
      if (!ma && cap) ma = chonDiemNguPhap((await apiNguPhap.danhMuc(nn)).cap, cap, khoHtv.lay().nguPhap)?.id ?? null;
      if (!ma) return;
      const d = await apiNguPhap.diem(ma);
      if (!d.quiz?.length || buocRef.current !== 'chay') return;
      const diem: TomTatNguPhap = { id: d.id, nn: d.nn, cap: d.cap, nhom: d.nhom, tieuDe: d.tieuDe, mau: d.mau, nghia: d.nghia };
      setNp(diem);
      const ds: MucPhien[] = d.quiz.slice(0, 3).map((c, i) => ({ loai: 'nguPhap', id: `np-${d.id}-${i}`, diem, cau: c }));
      setHang((h) => (h.length ? chenRai(h, ds, viTriRef.current) : h));
    } catch { /* ngữ pháp là phần thêm — không có thì phiên vẫn chạy */ }
  }

  const muc = hang[viTri];
  const dangCau = muc?.loai === 'cau' ? muc.cau : null;

  // Tự đọc từ ở thẻ / câu nghe / câu thấy từ.
  useEffect(() => {
    if (buoc !== 'chay' || !muc || !kho.caiDat.tuDoc) return;
    const w = muc.loai === 'the' ? muc.tu : muc.loai === 'cau' && ['ngheChonTu', 'ngheGo', 'chonNghia', 'dungSai', 'chonCachDoc'].includes(muc.cau.dang) ? muc.cau.tu : null;
    if (w) void phat({ text: w.chu, voice: GIONG_MAC_DINH[nn] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viTri, buoc, muc?.id]);

  const boQua = useCallback((m: MucPhien, bietS: Set<string>) => {
    if (m.loai === 'nguPhap') return false;
    if (m.loai === 'cau') return bietS.has(m.cau.tu.k);
    if (m.loai === 'ghep') return m.ds.length >= 3 && m.ds.filter((x) => !bietS.has(x.k)).length < 3;
    return false;
  }, []);

  const ketThuc = useCallback((daHocDs: TuHoc[], dn: Set<string>, sk: Set<string>) => {
    const ks = new Set(daHocDs.map((w) => w.k));
    if (cheDo === 'kiemTraDot' && dotId) {
      // Đóng đợt + chấm thẻ ôn lặp của tài khoản như app: đúng ngay ⇒ "Dễ", sai ⇒ "Quên" (chưa có thẻ ⇒ thêm vào ôn lặp).
      const r = chotDot(khoHtv.lay(), dotId, dn, sk);
      khoHtv.dat(() => r.kho);
      const the = theHtvTheoKhoa(so.guong, nn);
      const cham: { t: TheTuCTL; c: ChamOn }[] = [];
      const canThem: MucTuCTL[] = [];
      for (const k of r.de) { const t = the.get(k); if (t) cham.push({ t, c: 'de' }); }
      for (const k of r.quen) {
        const t = the.get(k);
        if (t) { cham.push({ t, c: 'quen' }); continue; }
        const w = r.kho.tu[`${nn}:${k}`];
        if (w) canThem.push({ id: w.id0 != null && w.id0 !== -1 ? w.id0 : idTam(k), chu: w.chu, doc: w.doc ?? null, nghiaVi: w.nghia, thongDung: true });
      }
      chamNhieuThe(cham);
      if (canThem.length) ghiHocXong(nn, canThem, { laPro: isPro });
    } else {
      khoHtv.dat((k) => (cheDo === 'hoc'
        ? ghiKetQua(k, nn, new Set([...dn].filter((x) => ks.has(x) && !sk.has(x))), new Set([...sk].filter((x) => ks.has(x))), false)
        : ghiKetQua(k, nn, new Set([...dn].filter((x) => !sk.has(x))), sk, true)));
    }
    if (np && npKq.tong > 0) khoHtv.dat((k) => ({ ...k, nguPhap: { ...k.nguPhap, [np.id]: npKq } }));
    danhDauHomNay();
    setBuoc('tongKet');
  }, [cheDo, nn, dotId, so.guong, isPro, np, npKq]);

  /** Hết hàng mà từ mới còn chưa đủ 2 dạng ⇒ thêm câu dạng mới (≤ 3 lần/từ). */
  const themConThieu = useCallback((h: MucPhien[], bietS: Set<string>, daHocDs: TuHoc[]): MucPhien[] => {
    if (cheDo !== 'hoc') return [];
    const xong = new Set(daHocDs.map((w) => w.k));
    const them: MucPhien[] = [];
    for (const w of moi) {
      if (bietS.has(w.k) || xong.has(w.k) || (hoiLaiDem.current.get(w.k) ?? 0) >= 3) continue;
      hoiLaiDem.current.set(w.k, (hoiLaiDem.current.get(w.k) ?? 0) + 1);
      const c = cauHoiLai(w, nn, nhieu, daQua.current.get(w.k) ?? new Set(), h.length + them.length + 2000);
      them.push({ loai: 'cau', id: `cau-${c.id}`, cau: c });
    }
    return them;
  }, [cheDo, moi, nn, nhieu]);

  const sangKe = useCallback((h0: MucPhien[] = hang, bietS = biet, daHocDs = daHoc) => {
    if (tim <= 0) { setHetTim(true); return; }
    setChon(null); setGo(''); setXep([]); setVuaHoc(null); setDaCham(false);
    let h = h0;
    let i = viTri + 1;
    for (;;) {
      while (i < h.length && boQua(h[i]!, bietS)) i++;
      if (i < h.length) break;
      const them = themConThieu(h, bietS, daHocDs);
      if (!them.length) break;
      h = [...h, ...them];
    }
    if (h !== h0) setHang(h);
    setViTri(i);
    if (i >= h.length) ketThuc(daHocDs, dungNgay, sai);
  }, [hang, biet, daHoc, tim, viTri, boQua, themConThieu, ketThuc, dungNgay, sai]);

  /** Thưởng / phạt nhẹ của một câu. */
  const thuong = (dung: boolean) => {
    if (dung) {
      const c = chuoi + 1;
      setChuoi(c);
      setChuoiMax((m) => Math.max(m, c));
      if (c % 5 === 0) setTim((t) => Math.min(TIM, t + 1));
    } else {
      setChuoi(0);
      setTim((t) => Math.max(0, t - 1));
    }
  };

  /** Ghi kết quả một từ ở một dạng; trả hàng đợi mới (có thể thêm câu hỏi lại). */
  const ghiTu = (w: TuHoc, dang: DangCau, dung: boolean, h: MucPhien[]): { h: MucPhien[]; daHocDs: TuHoc[] } => {
    const lanDau = !gap.current.has(w.k);
    gap.current.add(w.k);
    let daHocDs = daHoc;
    if (dung) {
      if (lanDau) setDungNgay((x) => new Set(x).add(w.k));
      const q = daQua.current.get(w.k) ?? new Set<DangCau>();
      q.add(dang);
      daQua.current.set(w.k, q);
      // LUẬT "ĐÃ HỌC": từ mới đúng ở ≥ 2 dạng khác nhau ⇒ ghi ngay.
      if (cheDo === 'hoc' && moi.some((x) => x.k === w.k) && !biet.has(w.k) && !daHoc.some((x) => x.k === w.k) && q.size >= 2) {
        khoHtv.dat((k) => ghiDaHocMot(k, w, nn, baiId).kho);
        const kq = ghiHocXong(nn, [mucCua(w)], { laPro: isPro });
        if (kq.chan) setChan200(true);
        daHocDs = [...daHoc, w];
        setDaHoc(daHocDs);
        setVuaHoc(w.chu);
      }
      return { h, daHocDs };
    }
    setSai((x) => new Set(x).add(w.k));
    const n = hoiLaiDem.current.get(w.k) ?? 0;
    if (n < 2) {
      hoiLaiDem.current.set(w.k, n + 1);
      const c = cauHoiLai(w, nn, nhieu, new Set<DangCau>([dang, 'goTu', 'ngheGo']), h.length + 1000);
      return { h: [...h, { loai: 'cau', id: `cau-${c.id}`, cau: c }], daHocDs };
    }
    return { h, daHocDs };
  };

  const chamNguPhap = (c: CauQuizNguPhap, i: number) => {
    if (daCham) return;
    const dung = i === c.da;
    setChon(i);
    thuong(dung);
    setNpKq((x) => ({ dung: x.dung + (dung ? 1 : 0), tong: x.tong + 1 }));
    setDungCau(dung);
    setDaCham(true);
  };

  const cham = (c: CauHoi, dung: boolean) => {
    if (daCham) return;
    thuong(dung);
    const r = ghiTu(c.tu, c.dang, dung, hang);
    if (r.h !== hang) setHang(r.h);
    setDungCau(dung);
    setDaCham(true);
  };

  const xongGhep = (ds: TuHoc[], saiG: Set<string>) => {
    let h = hang, daHocDs = daHoc;
    for (const w of ds) { const r = ghiTu(w, 'ghepCap', !saiG.has(w.k), h); h = r.h; daHocDs = r.daHocDs; }
    if (saiG.size) setChuoi(0); else { setChuoi((c) => c + ds.length); setChuoiMax((m) => Math.max(m, chuoi + ds.length)); }
    sangKe(h, biet, daHocDs);
  };

  const daBietTu = (w: TuHoc) => {
    khoHtv.dat((k) => ghiDaBiet(k, w, nn, baiId));
    ghiHocXong(nn, [mucCua(w)], { laPro: isPro, daBiet: true });
    const b = new Set(biet).add(w.k);
    setBiet(b);
    sangKe(hang, b, daHoc);
  };

  // Kiểm tra câu đang trả lời (nút "Kiểm tra" / Enter).
  const kiemTra = () => {
    if (!dangCau || daCham) return;
    const c = dangCau;
    if (c.dang === 'goTu' || c.dang === 'ngheGo') { if (go.trim()) cham(c, goDung(go, c.tu)); return; }
    if (c.dang === 'xepChu' || c.dang === 'xepCau') { if (xep.length) cham(c, xepDung(xep.map((i) => c.manh[i]!), c, nn)); return; }
  };

  // Phím tắt.
  const phimRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => { phimRef.current = phim; });
  const phim = (e: KeyboardEvent) => {
    if (document.querySelector('[data-ctl-phat-am]')) return; // hộp "Nói theo" đang mở — phím là của nó
    if (e.key === 'Escape') { dong(); return; }
    if (buoc !== 'chay' || hetTim || !muc) return;
    const el = e.target as HTMLElement | null;
    const oGo = el?.tagName === 'INPUT';
    if (e.key === 'Enter') {
      e.preventDefault();
      if (muc.loai === 'the') { sangKe(); return; }
      if (daCham) { sangKe(); return; }
      kiemTra();
      return;
    }
    if (!oGo && muc.loai === 'nguPhap' && !daCham && /^[1-5]$/.test(e.key)) {
      const i = Number(e.key) - 1;
      if (i < muc.cau.lc.length) chamNguPhap(muc.cau, i);
      return;
    }
    if (!oGo && dangCau && !daCham && dangCau.phuongAn.length && /^[1-4]$/.test(e.key)) {
      const i = Number(e.key) - 1;
      if (i < dangCau.phuongAn.length) { setChon(i); cham(dangCau, i === dangCau.dung); }
    }
  };
  useEffect(() => {
    const f = (e: KeyboardEvent) => phimRef.current(e);
    window.addEventListener('keydown', f);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = ''; };
  }, []);

  const tien = buoc === 'tongKet' ? 1 : hang.length ? (viTri + (daCham ? 1 : 0)) / hang.length : 0;
  const tenCheDo = cheDo === 'hoc' ? 'Học' : cheDo === 'on' ? 'Ôn lại' : cheDo === 'kiemTraDot' ? 'Kiểm tra 4 ngày' : 'Kiểm tra nhanh';
  const dotMo = cheDo === 'hoc' && buoc === 'tongKet' ? dotDangMo(kho, nn) : null;

  return (
    <div className={s.root} style={{ paddingTop: 0 }} data-ctl-root>
      <div className={s.phien} role="dialog" aria-modal="true" aria-label={`${tenCheDo} · ${tenBai}`}>
        <div className={s.phienTop}>
          <button type="button" className={s.icoBtn} style={{ '--c': 'var(--lh-ink-3)' } as CSSProperties} onClick={dong} aria-label="Thoát phiên"><X size={18} /></button>
          <div className={s.phienThanh}><i style={{ width: `${tien * 100}%` }} /></div>
          {chuoi >= 3 ? <span className={s.combo}><Flame size={15} /> {chuoi}</span> : null}
          <span className={s.tim} aria-label={`${tim} tim`}><Heart size={18} fill="currentColor" /> {tim}</span>
        </div>
        <div className={s.phienNoi}>
          <div className={s.phienNoiIn}>
            <div className={s.note} style={{ marginBottom: 8 }}>{tenCheDo} · {tenBai}</div>
            {hetTim ? (
              <div className={s.tongKet}>
                <div style={{ fontSize: 54 }}>🐻</div>
                <h2 className={s.h2}>Hết tim rồi!</h2>
                <p className={s.lede} style={{ margin: '10px auto 0' }}>Không sao — Gấu tặng bạn 3 tim để học tiếp. Sai là một phần của học.</p>
                <button type="button" className={`${s.btn} ${s.btnLon}`} style={{ marginTop: 18 }} onClick={() => { setTim(3); setHetTim(false); sangKe(); }}>Nhận 3 tim · học tiếp</button>
              </div>
            ) : buoc === 'daHocHet' ? (
              <div className={s.tongKet}>
                <div style={{ fontSize: 54 }}>✅</div>
                <h2 className={s.h2}>Bài này bạn đã học hết từ mới</h2>
                <p className={s.lede} style={{ margin: '10px auto 0' }}>Ôn lại cả bài, hoặc sang bài kế.</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
                  {baiKe ? <button type="button" className={`${s.btn} ${s.btnLon}`} onClick={baiKe}>Bài kế</button> : null}
                  <button type="button" className={`${s.btn} ${s.btnPhu} ${s.btnLon}`} onClick={dong}>Đóng</button>
                </div>
              </div>
            ) : buoc === 'tongKet' ? (
              <TongKet cheDo={cheDo} daHoc={daHoc} biet={biet.size} dungNgay={dungNgay} sai={sai} gap={gap.current.size} chuoiMax={chuoiMax}
                homNay={moiHomNay(kho, nn)} mucTieu={kho.caiDat.mucTieu} chan200={chan200} nn={nn} tu={tu} baiKe={baiKe} dong={dong}
                np={np} npKq={npKq} hanDot={dotMo && (daHoc.length || biet.size) ? dotMo.hanHoi : null} />
            ) : muc?.loai === 'the' ? (
              <TheHoc w={muc.tu} nn={nn} />
            ) : muc?.loai === 'ghep' ? (
              <GhepCap key={muc.id} ds={muc.ds} nn={nn} xong={xongGhep} />
            ) : muc?.loai === 'nguPhap' ? (
              <CauNguPhapView diem={muc.diem} c={muc.cau} chon={chon} daCham={daCham} chonPA={(i) => chamNguPhap(muc.cau, i)} />
            ) : dangCau ? (
              <CauHoiView c={dangCau} nn={nn} chon={chon} go={go} xep={xep} daCham={daCham}
                setGo={setGo} setXep={setXep}
                chonPA={(i) => { if (daCham) return; setChon(i); cham(dangCau, i === dangCau.dung); }} />
            ) : null}
          </div>
        </div>
        {!hetTim && buoc === 'chay' && muc ? (
          muc.loai === 'the' ? (
            <div className={s.ketQua}>
              <div className={s.ketQuaIn}>
                <button type="button" className={`${s.btn} ${s.btnPhu}`} onClick={() => daBietTu(muc.tu)} title="Bỏ qua từ này, coi như đã thuộc">Đã biết từ này</button>
                <span style={{ flex: 1 }} />
                <button type="button" className={`${s.btn} ${s.btnLon}`} onClick={() => sangKe()} autoFocus>Tiếp tục ↵</button>
              </div>
            </div>
          ) : muc.loai === 'nguPhap' ? (
            <div className={s.ketQua} data-kq={daCham ? (dungCau ? 'dung' : 'sai') : undefined}>
              <div className={s.ketQuaIn}>
                {daCham ? (
                  <>
                    <div className={s.kqChu}>
                      <div className={s.kqTitle}>{dungCau ? 'Chính xác!' : 'Chưa đúng'}</div>
                      <div className={s.kqSub}>{muc.cau.gt}</div>
                    </div>
                    <button type="button" className={`${s.btn} ${s.btnLon} ${dungCau ? s.btnDung : s.btnSai}`} onClick={() => sangKe()} autoFocus>Tiếp tục ↵</button>
                  </>
                ) : <span className={s.note} style={{ flex: 1 }}>Phím 1–{Math.min(5, muc.cau.lc.length)} để chọn</span>}
              </div>
            </div>
          ) : muc.loai === 'cau' ? (
            <div className={s.ketQua} data-kq={daCham ? (dungCau ? 'dung' : 'sai') : undefined}>
              <div className={s.ketQuaIn}>
                {daCham ? (
                  <>
                    <div className={s.kqChu}>
                      <div className={s.kqTitle}>{dungCau ? (vuaHoc ? `Đã học “${vuaHoc}” ✓` : 'Chính xác!') : 'Chưa đúng'}</div>
                      <div className={s.kqSub}><b>{muc.cau.tu.chu}</b>{docHien(muc.cau.tu) ? ` ${docHien(muc.cau.tu)}` : ''} — {muc.cau.tu.nghia}</div>
                    </div>
                    <button type="button" className={`${s.btn} ${s.btnLon} ${dungCau ? s.btnDung : s.btnSai}`} onClick={() => sangKe()} autoFocus>Tiếp tục ↵</button>
                  </>
                ) : (
                  <>
                    <span className={s.note} style={{ flex: 1 }}>{['goTu', 'ngheGo', 'xepChu', 'xepCau'].includes(muc.cau.dang) ? 'Enter để kiểm tra' : 'Phím 1–4 để chọn'}</span>
                    {['goTu', 'ngheGo', 'xepChu', 'xepCau'].includes(muc.cau.dang) ? (
                      <button type="button" className={`${s.btn} ${s.btnLon}`} onClick={kiemTra} disabled={muc.cau.dang.startsWith('xep') ? !xep.length : !go.trim()}>Kiểm tra</button>
                    ) : (
                      <button type="button" className={`${s.btn} ${s.btnPhu}`} onClick={() => { setChon(-1); cham(muc.cau, false); }}>Không biết</button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

// ─── Thẻ học một từ ───────────────────────────────────────────────────────────────────────────────────────────────

function TheHoc({ w, nn }: { w: TuHoc & { nhanLoai?: string | null; cumTu?: string[] | null; hoTu?: string[] | null; ghiChu?: string | null; anhUrl?: string | null; hanViet?: string | null }; nn: NnCTL }) {
  const d = docHien(w);
  return (
    <div className={s.theTu}>
      <div className={s.dangLabel}>Từ mới</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
        <div className={s.minh}>
          <div className={s.theChu}>{w.chu}</div>
          {d || w.hanViet ? <div className={s.theDoc}>{d}{w.hanViet ? ` · ${w.hanViet}` : ''}</div> : null}
        </div>
        {w.anhUrl ? <img src={w.anhUrl} alt="" className={s.anh} /> : null}
        <NutNghe chu={w.chu} nn={nn} />
        <NutNghe chu={w.chu} nn={nn} cham nhan="Nghe chậm" />
      </div>
      <div className={s.theNghia}>{w.nghia}</div>
      <div style={{ marginTop: 10 }}><NutPhatAm cau={w.chu} doc={w.doc} nghia={w.nghia} nn={nn} /></div>
      <div className={s.theMeta}>
        {w.nhanLoai ? <span className={`${s.chip} ${s.chipNho}`}>{w.nhanLoai}</span> : null}
        {w.cap ? <span className={`${s.chip} ${s.chipNho}`}>{w.cap}</span> : null}
      </div>
      {w.viDu ? (
        <div className={s.theVd}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div className={s.minh}>
              <div className={s.theVdGoc}>{w.viDu}</div>
              {w.viDuDoc && nn !== 'en' ? <div className={s.lineDoc}>{w.viDuDoc}</div> : null}
              {w.viDuNghia ? <div className={s.theVdNghia}>{w.viDuNghia}</div> : null}
            </div>
            <NutNghe chu={w.viDu} nn={nn} nhan="Nghe câu ví dụ" />
            <NutPhatAm gon cau={w.viDu} doc={nn !== 'en' ? w.viDuDoc : null} nghia={w.viDuNghia} nn={nn} />
          </div>
        </div>
      ) : null}
      {w.cumTu?.length ? <p className={s.note} style={{ marginTop: 12 }}><b>Cụm hay đi kèm:</b> {w.cumTu.join(' · ')}</p> : null}
      {w.hoTu?.length ? <p className={s.note} style={{ marginTop: 4 }}><b>Họ từ:</b> {w.hoTu.join(' · ')}</p> : null}
      {w.ghiChu ? <p className={s.note} style={{ marginTop: 4 }}>ⓘ {w.ghiChu}</p> : null}
    </div>
  );
}

// ─── Một câu hỏi ──────────────────────────────────────────────────────────────────────────────────────────────────

function CauHoiView({ c, nn, chon, go, xep, daCham, setGo, setXep, chonPA }: {
  c: CauHoi; nn: NnCTL; chon: number | null; go: string; xep: number[]; daCham: boolean;
  setGo: (v: string) => void; setXep: (v: number[]) => void; chonPA: (i: number) => void;
}) {
  const nghe = () => void phat({ text: c.tu.chu, voice: GIONG_MAC_DINH[nn] });
  const ngheCham = () => void phat({ text: c.tu.chu, voice: GIONG_MAC_DINH[nn], toc: 0.7 });
  const kq = (i: number) => (!daCham ? undefined : i === c.dung ? 'dung' : i === chon ? 'sai' : undefined);
  return (
    <div>
      <div className={s.dangLabel}>{TEN_DANG[c.dang]}</div>
      {c.dang === 'chonNghia' || c.dang === 'chonCachDoc' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className={s.deTo}>{c.de}</div>
          <button type="button" className={s.icoBtn} onClick={nghe} aria-label="Nghe"><Volume2 size={16} /></button>
        </div>
      ) : c.dang === 'ngheChonTu' || c.dang === 'ngheGo' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <button type="button" className={`${s.btn} ${s.btnLon}`} onClick={nghe}><Volume2 size={20} /> Nghe lại</button>
          <button type="button" className={`${s.btn} ${s.btnPhu}`} onClick={ngheCham}>🐢 Chậm</button>
          {c.dang === 'ngheGo' ? <span className={s.note}>Gợi ý nghĩa: {c.de}</span> : null}
        </div>
      ) : c.dang === 'dungSai' ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className={s.deTo}>{c.tu.chu}</div>
            <button type="button" className={s.icoBtn} onClick={nghe} aria-label="Nghe"><Volume2 size={16} /></button>
          </div>
          <div className={s.deVua}>nghĩa là “{c.de}”?</div>
        </div>
      ) : c.dang === 'dienCau' ? (
        <div className={s.deVua}>{c.de}</div>
      ) : c.dang === 'xepCau' ? (
        <div className={s.deVua}>Xếp thành câu: “{c.de}”</div>
      ) : (
        <div className={s.deTo} style={{ fontSize: 'clamp(22px, 3.6vw, 30px)' }}>{c.de}</div>
      )}

      {c.phuongAn.length ? (
        <div className={s.pa} data-luoi={c.dang !== 'dungSai' || undefined}>
          {c.phuongAn.map((p, i) => (
            <button key={i} type="button" className={s.paBtn} data-chon={(chon === i && !daCham) || undefined} data-kq={kq(i)} disabled={daCham} onClick={() => chonPA(i)}>
              <span className={s.phim}>{i + 1}</span>
              <span className={s.minh}>{p}</span>
              {kq(i) === 'dung' ? <Check size={18} color="var(--lh-ok)" /> : kq(i) === 'sai' ? <X size={18} color="var(--lh-bad)" /> : null}
            </button>
          ))}
        </div>
      ) : c.dang === 'goTu' || c.dang === 'ngheGo' ? (
        <input className={s.input} value={go} onChange={(e) => setGo(e.target.value)} disabled={daCham} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false}
          placeholder={c.dang === 'goTu' ? 'Gõ từ tiếng Anh…' : 'Gõ từ vừa nghe…'} aria-label="Câu trả lời" />
      ) : c.dang === 'xepChu' || c.dang === 'xepCau' ? (
        <>
          <div className={s.xepO} aria-label="Đáp án đang xếp">
            {xep.map((i, j) => (
              <button key={`${i}-${j}`} type="button" className={s.manh} disabled={daCham} onClick={() => setXep(xep.filter((_, x) => x !== j))}>{c.manh[i]}</button>
            ))}
          </div>
          <div className={s.xepKho}>
            {c.manh.map((m, i) => (
              <button key={i} type="button" className={s.manh} disabled={daCham || xep.includes(i)} onClick={() => setXep([...xep, i])}>{m}</button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

// ─── Câu ngữ pháp ─────────────────────────────────────────────────────────────────────────────────────────────────

function CauNguPhapView({ diem, c, chon, daCham, chonPA }: { diem: TomTatNguPhap; c: CauQuizNguPhap; chon: number | null; daCham: boolean; chonPA: (i: number) => void }) {
  const kq = (i: number) => (!daCham ? undefined : i === c.da ? 'dung' : i === chon ? 'sai' : undefined);
  return (
    <div>
      <div className={s.dangLabel} style={{ color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 6 }}><BookOpenCheck size={15} /> Ngữ pháp · {diem.cap}</div>
      <div className={s.note} style={{ marginTop: 6, fontWeight: 700 }}>{diem.tieuDe}{diem.mau ? <span className={s.npMau} style={{ marginLeft: 8 }}>{diem.mau}</span> : null}</div>
      <div className={s.deVua}>{c.h}</div>
      <div className={s.pa}>
        {c.lc.map((p, i) => (
          <button key={i} type="button" className={s.paBtn} data-chon={(chon === i && !daCham) || undefined} data-kq={kq(i)} disabled={daCham} onClick={() => chonPA(i)}>
            <span className={s.phim}>{i + 1}</span>
            <span className={s.minh}>{p}</span>
            {kq(i) === 'dung' ? <Check size={18} color="var(--lh-ok)" /> : kq(i) === 'sai' ? <X size={18} color="var(--lh-bad)" /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Ghép cặp ─────────────────────────────────────────────────────────────────────────────────────────────────────

function GhepCap({ ds, nn, xong }: { ds: TuHoc[]; nn: NnCTL; xong: (ds: TuHoc[], sai: Set<string>) => void }) {
  const phai = useMemo(() => [...ds].sort(() => Math.random() - 0.5), [ds]);
  const [trai, setTrai] = useState<string | null>(null);
  const [daXong, setDaXong] = useState<Set<string>>(new Set());
  const [sai, setSai] = useState<Set<string>>(new Set());
  const [lac, setLac] = useState<string | null>(null);
  const bam = (kPhai: string) => {
    if (!trai || daXong.has(kPhai)) return;
    if (kPhai === trai) {
      const n = new Set(daXong).add(trai);
      setDaXong(n);
      setTrai(null);
      if (n.size === ds.length) setTimeout(() => xong(ds, sai), 350);
    } else {
      setSai(new Set(sai).add(trai));
      setLac(kPhai);
      setTimeout(() => setLac(null), 350);
    }
  };
  return (
    <div>
      <div className={s.dangLabel}>{TEN_DANG.ghepCap}</div>
      <div className={s.deVua}>Ghép từ với nghĩa của nó</div>
      <div className={s.ghepLuoi}>
        <div className={s.ghepCot}>
          {ds.map((w) => (
            <button key={w.k} type="button" className={s.ghepBtn} data-chon={trai === w.k || undefined} data-xong={daXong.has(w.k) || undefined} disabled={daXong.has(w.k)}
              onClick={() => { setTrai(w.k); void phat({ text: w.chu, voice: GIONG_MAC_DINH[nn] }); }}>{w.chu}</button>
          ))}
        </div>
        <div className={s.ghepCot}>
          {phai.map((w) => (
            <button key={w.k} type="button" className={s.ghepBtn} data-xong={daXong.has(w.k) || undefined} data-sai={lac === w.k || undefined} disabled={daXong.has(w.k)}
              onClick={() => bam(w.k)}>{w.nghia}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tổng kết ─────────────────────────────────────────────────────────────────────────────────────────────────────

function TongKet({ cheDo, daHoc, biet, dungNgay, sai, gap, chuoiMax, homNay, mucTieu, chan200, nn, tu, baiKe, dong, np, npKq, hanDot }: {
  cheDo: CheDoPhien; daHoc: TuHoc[]; biet: number; dungNgay: Set<string>; sai: Set<string>; gap: number; chuoiMax: number;
  homNay: number; mucTieu: number; chan200: boolean; nn: NnCTL; tu: TuHoc[]; baiKe?: (() => void) | null; dong: () => void;
  np: TomTatNguPhap | null; npKq: { dung: number; tong: number }; hanDot: string | null;
}) {
  const pt = gap ? Math.round(([...dungNgay].filter((k) => !sai.has(k)).length / gap) * 100) : 100;
  const canOn = tu.filter((w) => sai.has(w.k));
  const thuocMoi = cheDo === 'kiemTraDot' ? tu.filter((w) => dungNgay.has(w.k) && !sai.has(w.k)) : [];
  const tieuDe = cheDo === 'hoc' ? (daHoc.length || biet ? 'Xong bài!' : 'Xong lượt!') : cheDo === 'on' ? 'Ôn xong!'
    : cheDo === 'kiemTraDot' ? (sai.size ? 'Đã kiểm tra xong' : 'Nhớ hết! 🏆') : 'Kiểm tra xong!';
  return (
    <div className={s.tongKet}>
      <div style={{ fontSize: 54 }}>{cheDo === 'hoc' ? (daHoc.length ? '🎉' : '👏') : cheDo === 'kiemTraDot' && !sai.size ? '🏆' : '💪'}</div>
      <h2 className={s.h2}>{tieuDe}</h2>
      {cheDo === 'hoc' ? <p className={s.lede} style={{ margin: '8px auto 0' }}>Hôm nay {homNay}/{mucTieu} từ mới{homNay >= mucTieu ? ' — đạt mục tiêu! 🎯' : ''}.</p> : null}
      <div className={s.tongSo}>
        {cheDo === 'hoc' ? <div className={s.statO}><div className={s.statSo}>{daHoc.length}</div><div className={s.statNhan}>từ đã học</div></div> : null}
        {cheDo === 'hoc' && biet ? <div className={s.statO}><div className={s.statSo}>{biet}</div><div className={s.statNhan}>đã biết, bỏ qua</div></div> : null}
        <div className={s.statO}><div className={s.statSo}>{pt}%</div><div className={s.statNhan}>đúng ngay lần đầu</div></div>
        <div className={s.statO}><div className={s.statSo}>{chuoiMax}</div><div className={s.statNhan}>chuỗi đúng dài nhất</div></div>
      </div>
      {daHoc.length ? <p className={s.note} style={{ marginTop: 16 }}>Đã học: {daHoc.map((w) => w.chu).join(' · ')} — đã vào ôn lặp (sổ “Học từ vựng”).</p> : null}
      {thuocMoi.length ? <p className={s.note} style={{ marginTop: 16 }}>Đã thuộc: {thuocMoi.map((w) => w.chu).join(' · ')} — sẽ không hiện lại trong lượt học mới.</p> : null}
      {canOn.length ? <p className={s.note} style={{ marginTop: 6 }}>Cần ôn thêm: {canOn.map((w) => w.chu).join(' · ')}{cheDo === 'kiemTraDot' ? ' — đã đưa vào ôn lặp, gặp lại ngay hôm nay.' : ''}</p> : null}
      {hanDot ? (
        <div className={s.bao} style={{ marginTop: 14, textAlign: 'left' }}>
          <b>Ôn sau 4 ngày:</b> từ vừa học vào đợt kiểm tra — {new Date(hanDot).toLocaleString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })} Gấu hỏi lại ở mục “Hôm nay”.
          Đúng ⇒ đã thuộc; sai ⇒ vào ôn lặp.
        </div>
      ) : null}
      {np ? (
        <div className={s.bao} style={{ marginTop: 10, textAlign: 'left' }}>
          <b>{npKq.tong ? `Ngữ pháp vừa luyện · đúng ${npKq.dung}/${npKq.tong}` : 'Ngữ pháp đi cùng bài'}:</b> {np.tieuDe}{np.mau ? ` — ${np.mau}` : ''}{np.nghia ? ` (${np.nghia})` : ''}
        </div>
      ) : null}
      {chan200 ? <div className={s.bao} style={{ marginTop: 14 }}>Sổ bản miễn phí đã đủ 200 từ — tiến độ vẫn lưu trên trình duyệt này, nhưng không vào ôn lặp của tài khoản. <a href="/pro">Nâng Pro</a> để học không giới hạn trên mọi máy.</div> : null}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
        {baiKe && cheDo === 'hoc' ? <button type="button" className={`${s.btn} ${s.btnLon}`} onClick={baiKe}>Học tiếp ↵</button> : null}
        <button type="button" className={`${s.btn} ${s.btnPhu} ${s.btnLon}`} onClick={dong}>Xong</button>
      </div>
      <p className={s.note} style={{ marginTop: 10 }}>{nn === 'en' ? 'Mẹo: học xong thì nghe một tập podcast cùng cấp để gặp lại từ trong ngữ cảnh.' : ''}</p>
    </div>
  );
}

