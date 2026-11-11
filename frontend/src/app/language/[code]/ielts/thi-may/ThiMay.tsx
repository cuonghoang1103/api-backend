'use client';

/**
 * 🖥️ TRUNG TÂM LUYỆN THI — phòng thi máy tính (computer-delivered) — /language/en/ielts/thi-may · app: /ielts/thi-may
 * ─────────────────────────────────────────────────────────────────────────
 * Nâng cấp 12/11/2026 (đợt 2): trang trung tâm (Test đầu vào · Đề đủ 4 kỹ năng · thư viện lọc · Practice theo Part ·
 * lịch sử & tiến độ) → màn trước thi (xác nhận + hướng dẫn + kiểm tai nghe) → phòng làm bài toàn màn hình
 * (PhongLam / PhongViet / PhongNoi của phiên Speaking) → phiếu điểm kiểu Test Report Form (PhieuDiem.tsx).
 *
 * Thi đủ đề: Listening → Reading → Writing → (nghỉ) → Speaking; band tổng theo luật mục 1.5 (cham.ts › bandTong).
 * Test đầu vào (Đề 0): sàng lọc 10′ trước; < 10/30 ⇒ dừng sớm + xếp lớp (hopDong.ts › taiXepLop).
 *
 * Đề là tệp tĩnh (`de/*.ts`). Lượt làm lưu máy chủ (`/ielts/thi-may/luot`). Bài đang làm TỰ LƯU localStorage
 * (luuBai.ts) ⇒ tải lại trang hỏi "Tiếp tục bài đang làm?".
 */
import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { MUC_LUC, BO_DE, taiDe, coDe, deCuaBo, boCuaDe, TEN_KY_NANG } from './de/index';
import type { De, DeDoc, DeNghe, DeNoi, DeSangLoc, DeViet, KyNang, MucDe, PhanDoc, PhanNghe, DangCau } from './de/types';
import { TEN_DANG } from './de/types';
import { bandTuDiem, bandTong, dinhDangGio, type KetQuaCau } from './cham';
import { PhongLam, chamLuot, type TrangThaiLam } from './PhongLam';
import { PhongViet, type TrangThaiViet } from './PhongViet';
import { ManTruocThi } from './ManTruocThi';
import { PhieuDiemDocNghe, PhieuDiemViet, PhieuDiemBo, bandLuot, type KetLuot, type KetQuaBo } from './PhieuDiem';
import { HopThoai } from './ThanhThi';
import { dongSoLoi } from './soLoiTuDe';
import { MenuTren, useHienThi } from '../chung/MenuTren';
import { thiDsLuot, thiLuuLuot, thiMotLuot, loiGhi, loiDs, loiMang, type LuotThi, type KetQuaViet, type GhiLoi } from '../chung/api';
import { docTruyVan, ghiTruyVan } from '@/components/sach-hoc/moiTruong';
import { useLangUser } from '@/components/language/primitives';
import { taiPhongNoi, taiXepLop, type KetQuaNoi, type PhongNoiProps } from './hopDong';
import { xepLopLuu } from './noiApi';
import { ghiBai, xoaBai, dsBaiDangLam, donKhoaCu, type BaiDangLam, type TienTrinhBoLuu } from './luuBai';
import s from '../chung/cdt.module.css';

type Tab = 'practice' | 'full' | 'result';
/** Tiến trình THI ĐỦ ĐỀ: bộ + các bước còn lại + kết quả gom dần. */
type TienTrinhBo = { bo: (typeof BO_DE)[number]; buoc: { kyNang: KyNang; id: string }[]; viTri: number; kq: KetQuaBo };
type Dang =
  | { o: 'ds' }
  | { o: 'de'; id: string; tab: Tab }
  | { o: 'truoc'; de: De; cheDo: 'practice' | 'full'; phanChon: number[]; phut: number | null; bo?: TienTrinhBo }
  | { o: 'lam'; de: De; cheDo: 'practice' | 'full'; phanChon: number[]; bo?: TienTrinhBo }
  | { o: 'nghi'; bo: TienTrinhBo }
  | { o: 'noi'; de: DeNoi; bo?: TienTrinhBo }
  | { o: 'kq'; de: De; luot: KetLuot; bo?: TienTrinhBo }
  | { o: 'kqBo'; kq: KetQuaBo }
  | { o: 'xemLai'; de: DeDoc | DeNghe; luot: KetLuot; cauMo?: number; ve: Dang };

const phanCua = (de: De): { so: number; nhan: string; mo: string }[] => {
  if (de.kyNang === 'viet') return de.task.map((t) => ({ so: t.so, nhan: `Task ${t.so}`, mo: `${t.phut} phút · ít nhất ${t.minTu} từ` }));
  if (de.kyNang === 'noi') return [1, 2, 3].map((n) => ({ so: n, nhan: `Part ${n}`, mo: '' }));
  return (de.phan as (PhanDoc | PhanNghe)[]).map((p) => {
    const ns = p.nhom.reduce((n, g) => n + g.den - g.tu + 1, 0);
    const dang = [...new Set(p.nhom.map((g) => TEN_DANG[g.dang]))].join(', ');
    return { so: p.so, nhan: `${de.kyNang === 'doc' ? 'Passage' : 'Part'} ${p.so} — ${p.tieuDe}`, mo: `${ns} câu · ${dang}` };
  });
};
const tenBuoc = (bo: TienTrinhBo) => `Phần ${bo.viTri + 1}/${bo.buoc.length} · ${TEN_KY_NANG[bo.buoc[bo.viTri].kyNang]}`;
const TAP_CUA_BAND = (b: number | null) => (b == null ? '' : b < 4 ? 'Tập 1' : b < 5 ? 'Tập 2' : b < 6 ? 'Tập 3' : b < 7 ? 'Tập 4' : 'Tập 5');

export default function ThiMay() {
  const { isAuthenticated } = useLangUser();
  const { thuocTinh } = useHienThi();
  const [dang, setDang] = useState<Dang>({ o: 'ds' });
  const [tim, setTim] = useState('');
  const [deTai, setDeTai] = useState<De | null>(null);
  const [lam, setLam] = useState<TrangThaiLam | null>(null);
  const [viet, setViet] = useState<TrangThaiViet | null>(null);
  const [loi, setLoi] = useState('');
  const [hoiTiep, setHoiTiep] = useState<BaiDangLam[] | null>(null);
  const [luotAll, setLuotAll] = useState<LuotThi[] | null>(null);
  const [PhongNoi, setPhongNoi] = useState<ComponentType<PhongNoiProps> | null | undefined>(undefined);
  const [dangDo, setDangDo] = useState<string[]>([]);

  /* ── Khởi động: dọn khoá cũ, hỏi tiếp tục bài đang dở, đọc ?de= ── */
  useEffect(() => {
    donKhoaCu();
    const ds = dsBaiDangLam();
    setDangDo(ds.map((b) => b.deId));
    if (ds.length) setHoiTiep(ds);
    const q = docTruyVan();
    const id = q.get('de');
    if (id && MUC_LUC.some((m) => m.id === id)) setDang({ o: 'de', id, tab: (q.get('tab') as Tab) || 'full' });
    void taiPhongNoi().then((c) => setPhongNoi(() => c)); // bọc: setState nhận component (hàm) sẽ gọi nhầm như updater
  }, []);

  // Lượt đã làm (mọi đề) cho thẻ trạng thái + lịch sử.
  const taiLuot = useCallback(() => {
    if (!isAuthenticated) { setLuotAll([]); return; }
    thiDsLuot().then((r) => setLuotAll(r.items)).catch(() => setLuotAll([]));
  }, [isAuthenticated]);
  useEffect(() => { if (dang.o === 'ds' || dang.o === 'de') taiLuot(); }, [dang.o, taiLuot]);

  // Đồng bộ ?de=&tab= (web: URL thật; app desktop: kho truy vấn của shim).
  useEffect(() => {
    if (dang.o !== 'ds' && dang.o !== 'de') return;
    ghiTruyVan((q) => {
      if (dang.o === 'de') { q.set('de', dang.id); q.set('tab', dang.tab); } else { q.delete('de'); q.delete('tab'); }
    });
  }, [dang]);

  const deIdDang = dang.o === 'de' ? dang.id : null;
  useEffect(() => {
    if (!deIdDang) return;
    setDeTai(null);
    void taiDe(deIdDang)?.then(setDeTai);
  }, [deIdDang]);

  /* ── Tự lưu bài đang làm ── */
  useEffect(() => {
    if (dang.o !== 'lam') return;
    const boLuu: TienTrinhBoLuu | undefined = dang.bo ? { id: dang.bo.bo.id, bands: dang.bo.kq.bands, luotIds: luotIdsCua(dang.bo.kq), sangLoc: dang.bo.kq.sangLoc, tho: dang.bo.kq.tho } : undefined;
    ghiBai({ deId: dang.de.id, kyNang: dang.de.kyNang, cheDo: dang.cheDo, phanChon: dang.phanChon, bo: boLuu, lam: lam ?? undefined, viet: viet ?? undefined, luc: Date.now() });
  }, [dang, lam, viet]);
  useEffect(() => {
    if (dang.o !== 'lam' && dang.o !== 'noi') return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dang.o]);

  /* ── Bắt đầu một đề (qua màn trước thi) ── */
  const vaoTruoc = (de: De, cheDo: 'practice' | 'full', phanChon: number[], phut: number | null, bo?: TienTrinhBo) => {
    if (de.kyNang === 'noi') { setDang({ o: 'noi', de, bo }); return; }
    setDang({ o: 'truoc', de, cheDo, phanChon, phut, bo });
  };
  const batDau = (de: De, cheDo: 'practice' | 'full', phanChon: number[], phut: number | null, bo?: TienTrinhBo) => {
    const now = Date.now();
    if (de.kyNang === 'viet') {
      setViet({ bai: {}, batDau: now, hetLuc: phut ? now + phut * 60_000 : null });
      setLam(null);
    } else {
      // Listening thi thật: đồng hồ 2′ kiểm tra chỉ bắt đầu khi băng hết (PhongLam đặt).
      setLam({ ans: {}, co: [], hl: {}, batDau: now, hetLuc: de.kyNang === 'nghe' && cheDo === 'full' ? null : phut ? now + phut * 60_000 : null });
      setViet(null);
    }
    setDang({ o: 'lam', de, cheDo, phanChon, bo });
  };

  /* ── Thi đủ đề ── */
  const batDauBo = async (bo: (typeof BO_DE)[number]) => {
    const buoc = deCuaBo(bo).filter((d) => coDe(d.id));
    if (!buoc.length) return;
    const tt: TienTrinhBo = { bo, buoc, viTri: 0, kq: { boId: bo.id, bands: {}, chiTiet: {} } };
    await moBuoc(tt);
  };
  const moBuoc = async (tt: TienTrinhBo) => {
    const b = tt.buoc[tt.viTri];
    if (!b) { await xongBo(tt); return; }
    if (b.kyNang === 'noi') {
      const C = PhongNoi === undefined ? await taiPhongNoi() : PhongNoi;
      if (!C) { await xongBo(tt); return; }
      setDang({ o: 'nghi', bo: tt });
      return;
    }
    const de = await taiDe(b.id);
    if (!de) { await moBuoc({ ...tt, viTri: tt.viTri + 1 }); return; }
    const muc = MUC_LUC.find((m) => m.id === b.id);
    const phan = phanCua(de).map((p) => p.so);
    vaoTruoc(de, 'full', phan, muc?.phut ?? null, tt);
  };
  const tiepBo = async (tt: TienTrinhBo) => moBuoc({ ...tt, viTri: tt.viTri + 1 });
  const xongBo = async (tt: TienTrinhBo) => {
    const kq = { ...tt.kq };
    if (tt.bo.sangLoc && kq.sangLoc) {
      // xepLop() nhận L/R là SỐ CÂU ĐÚNG, W/S là band (xepLop.ts).
      const vao = { sangLoc: kq.sangLoc.dung, nghe: kq.tho?.nghe, doc: kq.tho?.doc, viet: kq.bands.viet ?? undefined, noi: kq.bands.noi ?? undefined };
      const xl = await taiXepLop();
      if (xl) { try { kq.xepLop = xl(vao); } catch { kq.xepLop = null; } }
      if (isAuthenticated) {
        try { const r = await xepLopLuu({ ...vao, deId: tt.bo.id }); kq.xepLopLuu = { tap: r.hieuLuc.tap, ngay: r.hieuLuc.ngay, giuCu: r.hieuLuc.giuCu, ghiChu: r.ghiChu }; } catch { kq.xepLopLuu = null; }
      }
    }
    // Lưu lượt "tổng" của bộ đề (band tổng do máy chủ tính lại từ bands).
    if (isAuthenticated) {
      try {
        const r = await thiLuuLuot({ deId: tt.bo.id, kyNang: 'tong', cheDo: 'full', giay: 0, chiTiet: { bands: kq.bands, luotIds: luotIdsCua(kq), sangLoc: kq.sangLoc, xepLop: kq.xepLop, noi: kq.noi ?? undefined } });
        kq.luotId = r.id;
      } catch { /* vẫn xem tại chỗ */ }
    }
    setDang({ o: 'kqBo', kq });
  };

  /* ── Nộp ── */
  const nop = useCallback(async () => {
    if (dang.o !== 'lam') return;
    const { de, cheDo, phanChon, bo } = dang;
    xoaBai(de.id);
    setDangDo((d) => d.filter((x) => x !== de.id));
    if (de.kyNang === 'viet') {
      const v = viet ?? { bai: {}, batDau: Date.now(), hetLuc: null };
      const giay = Math.round((Date.now() - v.batDau) / 1000);
      const luot: KetLuot = { cheDo, phanChon, giay, bai: v.bai, ai: {} };
      setDang({ o: 'kq', de, luot, bo });
      if (isAuthenticated) {
        try {
          const r = await thiLuuLuot({ deId: de.id, kyNang: 'viet', cheDo, giay, chiTiet: { bai: v.bai, phanChon } });
          setDang((d) => (d.o === 'kq' ? { ...d, luot: { ...d.luot, id: r.id } } : d));
        } catch { /* vẫn xem được kết quả tại chỗ */ }
      }
      return;
    }
    if (de.kyNang === 'noi') return;
    const deDN = de as DeDoc | DeNghe | DeSangLoc;
    const t = lam ?? { ans: {}, co: [], hl: {}, batDau: Date.now(), hetLuc: null };
    const { kq, theoSo } = chamLuot(deDN as DeDoc, phanChon, t.ans);
    const giay = Math.round((Date.now() - t.batDau) / 1000);
    const dung = kq.filter((k) => k.dung).length;
    const luot: KetLuot = { cheDo, phanChon, giay, ans: t.ans, co: t.co, kq };
    setDang({ o: 'kq', de, luot, bo });
    window.scrollTo({ top: 0 });
    if (!isAuthenticated) { setDang((d) => (d.o === 'kq' ? { ...d, luot: { ...d.luot, soLoi: 'khach' } } : d)); return; }
    const band = (de.kyNang === 'doc' || de.kyNang === 'nghe') && cheDo === 'full' && kq.length === 40 ? bandTuDiem(dung, de.kyNang) : null;
    const [r, sl] = await Promise.allSettled([
      thiLuuLuot({ deId: de.id, kyNang: de.kyNang, cheDo, dung, tong: kq.length, band, giay, chiTiet: { ans: t.ans, co: t.co, phanChon } }),
      (async () => {
        if (de.kyNang === 'sangloc') return { moi: 0, congDon: 0 };
        const muc: GhiLoi[] = dongSoLoi(de as DeDoc | DeNghe, kq, theoSo);
        return muc.length ? loiGhi(muc) : { moi: 0, congDon: 0 };
      })(),
    ]);
    setDang((d) => (d.o === 'kq' ? {
      ...d,
      luot: { ...d.luot, id: r.status === 'fulfilled' ? r.value.id : undefined, soLoi: sl.status === 'fulfilled' ? sl.value : 'loi' },
    } : d));
  }, [dang, lam, viet, isAuthenticated]);

  /** Từ phiếu điểm một kỹ năng trong bộ đề ⇒ ghi band rồi sang phần kế (sàng lọc < 10/30 ⇒ dừng sớm). */
  const tiepSauKq = async () => {
    if (dang.o !== 'kq' || !dang.bo) return;
    const { de, luot } = dang;
    const tt: TienTrinhBo = { ...dang.bo, kq: { ...dang.bo.kq, bands: { ...dang.bo.kq.bands }, chiTiet: { ...dang.bo.kq.chiTiet, [de.kyNang]: { de, luot } } } };
    if (de.kyNang === 'sangloc') {
      const dung = (luot.kq ?? []).filter((k) => k.dung).length;
      tt.kq.sangLoc = { dung, tong: luot.kq?.length ?? 30 };
      if (dung < 10) { await xongBo(tt); return; }
    } else {
      tt.kq.bands[de.kyNang] = bandLuot(de, luot);
      if (de.kyNang === 'nghe' || de.kyNang === 'doc') tt.kq.tho = { ...tt.kq.tho, [de.kyNang]: (luot.kq ?? []).filter((k) => k.dung).length };
    }
    await tiepBo(tt);
  };

  const thoatLam = () => {
    // Thoát giữa chừng: bài vẫn trong localStorage; trung tâm hỏi tiếp tục.
    if (dang.o === 'lam') { setDangDo((d) => (d.includes(dang.de.id) ? d : [...d, dang.de.id])); setDang(dang.bo ? { o: 'ds' } : { o: 'de', id: dang.de.id, tab: dang.cheDo }); }
  };

  const tiepTucBai = async (b: BaiDangLam) => {
    setHoiTiep(null);
    const de = await taiDe(b.deId);
    if (!de) { xoaBai(b.deId); return; }
    let bo: TienTrinhBo | undefined;
    if (b.bo) {
      const boDe = BO_DE.find((x) => x.id === b.bo!.id);
      if (boDe) {
        const buoc = deCuaBo(boDe).filter((d) => coDe(d.id));
        const viTri = Math.max(0, buoc.findIndex((d) => d.id === b.deId));
        bo = { bo: boDe, buoc, viTri, kq: { boId: boDe.id, bands: b.bo.bands, chiTiet: {}, sangLoc: b.bo.sangLoc, tho: b.bo.tho } };
      }
    }
    if (b.lam) setLam(b.lam);
    if (b.viet) setViet(b.viet);
    setDang({ o: 'lam', de, cheDo: b.cheDo, phanChon: b.phanChon, bo });
  };
  const boBai = (b: BaiDangLam) => { xoaBai(b.deId); setDangDo((d) => d.filter((x) => x !== b.deId)); setHoiTiep((ds) => { const r = (ds ?? []).filter((x) => x.deId !== b.deId); return r.length ? r : null; }); };

  const moLuotCu = async (id: number) => {
    setLoi('');
    try {
      const l = await thiMotLuot(id);
      const de = await taiDe(l.deId);
      if (!de) return;
      const ct = (l.chiTiet ?? {}) as { ans?: Record<number, string>; co?: number[]; phanChon?: number[]; bai?: Record<number, string>; ai?: Record<number, KetQuaViet> };
      const phanChon = ct.phanChon ?? phanCua(de).map((p) => p.so);
      if (de.kyNang === 'viet') {
        setDang({ o: 'kq', de, luot: { id: l.id, cheDo: l.cheDo, phanChon, giay: l.giay, bai: ct.bai ?? {}, ai: ct.ai ?? {} } });
      } else if (de.kyNang === 'doc' || de.kyNang === 'nghe' || de.kyNang === 'sangloc') {
        const { kq } = chamLuot(de as DeDoc, phanChon, ct.ans ?? {});
        setDang({ o: 'kq', de, luot: { id: l.id, cheDo: l.cheDo, phanChon, giay: l.giay, ans: ct.ans ?? {}, co: ct.co ?? [], kq } });
      }
    } catch (e) { setLoi(loiMang(e).message ?? 'Không mở được lượt này.'); }
  };

  /* ═════════ Màn trước thi / làm bài / nghỉ / Speaking / xem lại (toàn màn hình) ═════════ */
  if (dang.o === 'truoc') {
    return <ManTruocThi de={dang.de} cheDo={dang.cheDo} phanChon={dang.phanChon} phut={dang.phut} buocBo={dang.bo ? tenBuoc(dang.bo) : undefined}
      onBatDau={() => batDau(dang.de, dang.cheDo, dang.phanChon, dang.phut, dang.bo)} onHuy={() => setDang(dang.bo ? { o: 'ds' } : { o: 'de', id: dang.de.id, tab: dang.cheDo })} />;
  }
  if (dang.o === 'lam') {
    const buocBo = dang.bo ? tenBuoc(dang.bo) : undefined;
    if (dang.de.kyNang === 'viet') {
      return viet && <PhongViet de={dang.de} cheDo={dang.cheDo} taskChon={dang.phanChon} tt={viet} setTt={(f) => setViet((c) => (c ? f(c) : c))} buocBo={buocBo} onNop={nop} onThoat={thoatLam} />;
    }
    if (dang.de.kyNang === 'doc' || dang.de.kyNang === 'nghe' || dang.de.kyNang === 'sangloc') {
      return lam && <PhongLam de={dang.de as DeDoc} cheDo={dang.cheDo} phanChon={dang.phanChon} tt={lam} setTt={(f) => setLam((c) => (c ? f(c) : c))} buocBo={buocBo} onNop={nop} onThoat={thoatLam} />;
    }
    return null;
  }
  if (dang.o === 'xemLai') {
    const tt: TrangThaiLam = { ans: dang.luot.ans ?? {}, co: dang.luot.co ?? [], hl: {}, batDau: Date.now() - dang.luot.giay * 1000, hetLuc: null };
    return <PhongLam de={dang.de} cheDo={dang.luot.cheDo} phanChon={dang.luot.phanChon} tt={tt} setTt={() => {}} kq={dang.luot.kq ?? []} cauMo={dang.cauMo} onThoat={() => setDang(dang.ve)} />;
  }
  if (dang.o === 'nghi') {
    return <ManNghi bo={dang.bo} onTiep={async () => { const de = await taiDe(dang.bo.buoc[dang.bo.viTri].id); if (de && de.kyNang === 'noi') setDang({ o: 'noi', de, bo: dang.bo }); else await xongBo(dang.bo); }} onBo={() => xongBo(dang.bo)} />;
  }
  if (dang.o === 'noi') {
    if (PhongNoi === undefined) return <div className={s.goc} {...thuocTinh}><p className={s.mo} style={{ padding: 40 }}>Đang mở phòng Speaking…</p></div>;
    if (!PhongNoi) {
      return (
        <div className={s.goc} {...thuocTinh}><MenuTren dang="thi-may" /><div className={s.khung}><p>Speaking (sắp có) — phòng Speaking với giám khảo AI đang được hoàn thiện.</p><button type="button" className={s.nutPhu} onClick={() => (dang.bo ? xongBo(dang.bo) : setDang({ o: 'ds' }))}>Tiếp tục</button></div></div>
      );
    }
    const bo = dang.bo;
    return (
      <PhongNoi de={dang.de} cheDo={bo ? 'thi' : 'luyen'} onXong={(k: KetQuaNoi) => {
        if (bo) { void xongBo({ ...bo, kq: { ...bo.kq, bands: { ...bo.kq.bands, noi: k.band }, noi: k } }); } else setDang({ o: 'ds' });
      }} />
    );
  }

  /* ═════════ Trang thường (có menu) ═════════ */
  return (
    <div className={s.goc} {...thuocTinh}>
      <MenuTren dang="thi-may" />
      {hoiTiep && (
        <HopThoai tieuDe="Tiếp tục bài đang làm?" dong={() => setHoiTiep(null)}>
          <p className={s.mo} style={{ margin: '0 0 10px' }}>Có bài đang làm dở được lưu trên máy này (đồng hồ vẫn tính như thi thật).</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
            {hoiTiep.map((b) => {
              const m = MUC_LUC.find((x) => x.id === b.deId);
              return (
                <li key={b.deId} className={s.theLoi} style={{ margin: 0, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ flex: 1 }}><b>{m?.ten ?? b.deId}</b><br /><span className={s.mo}>{b.cheDo === 'full' ? 'Full test' : 'Practice'}{b.bo ? ` · trong ${BO_DE.find((x) => x.id === b.bo!.id)?.ten ?? 'bộ đề'}` : ''} · lưu {new Date(b.luc).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span></span>
                  <button type="button" className={s.batDau} style={{ minWidth: 0 }} onClick={() => tiepTucBai(b)}>Tiếp tục</button>
                  <button type="button" className={s.nutPhu} onClick={() => boBai(b)}>Bỏ</button>
                </li>
              );
            })}
          </ul>
        </HopThoai>
      )}
      {dang.o === 'ds' && (
        <TrungTam tim={tim} setTim={setTim} luot={luotAll} dangDo={dangDo} dangNhap={isAuthenticated} coNoi={!!PhongNoi}
          mo={(id, tab) => setDang({ o: 'de', id, tab })} thiBo={batDauBo} moLuot={moLuotCu} />
      )}
      {dang.o === 'de' && (
        <TrangDe
          muc={MUC_LUC.find((m) => m.id === dang.id)!} de={deTai} tab={dang.tab} setTab={(tab) => setDang({ ...dang, tab })}
          tim={tim} setTim={setTim} veDs={() => setDang({ o: 'ds' })} batDau={(de, cheDo, phanChon, phut) => vaoTruoc(de, cheDo, phanChon, phut)} moLuot={moLuotCu} dangNhap={isAuthenticated} loi={loi}
        />
      )}
      {dang.o === 'kq' && (
        <>
          {dang.bo && (
            <div className={s.thanhBo}>
              <span>{tenBuoc(dang.bo)} đã xong{dang.bo.viTri + 1 < dang.bo.buoc.length ? ` · tiếp theo: ${TEN_KY_NANG[dang.bo.buoc[dang.bo.viTri + 1].kyNang]}` : ' · đây là phần cuối'}</span>
              <button type="button" className={s.batDau} style={{ minWidth: 0 }} onClick={tiepSauKq}>{dang.bo.viTri + 1 < dang.bo.buoc.length ? 'Tiếp tục phần sau →' : 'Xem kết quả đủ đề →'}</button>
            </div>
          )}
          {dang.de.kyNang === 'viet' ? (
            <PhieuDiemViet de={dang.de as DeViet} luot={dang.luot} setLuot={(f) => setDang((d) => (d.o === 'kq' ? { ...d, luot: f(d.luot) } : d))} veTrungTam={() => setDang({ o: 'ds' })} lamLai={() => setDang({ o: 'de', id: dang.de.id, tab: dang.luot.cheDo })} buocBo={!!dang.bo} />
          ) : (
            <PhieuDiemDocNghe de={dang.de as DeDoc} luot={dang.luot} veTrungTam={() => setDang({ o: 'ds' })} lamLai={() => setDang({ o: 'de', id: dang.de.id, tab: dang.luot.cheDo })}
              cacLuot={() => setDang({ o: 'de', id: dang.de.id, tab: 'result' })} moXemLai={(n) => setDang({ o: 'xemLai', de: dang.de as DeDoc, luot: dang.luot, cauMo: n, ve: dang })} />
          )}
        </>
      )}
      {dang.o === 'kqBo' && (
        <PhieuDiemBo kq={dang.kq} tenBo={BO_DE.find((b) => b.id === dang.kq.boId)?.ten ?? 'Bộ đề'} veTrungTam={() => setDang({ o: 'ds' })} coNoi={!!PhongNoi}
          moChiTiet={(k) => { const c = dang.kq.chiTiet[k]; if (c) setDang({ o: 'kq', de: c.de, luot: c.luot }); }} />
      )}
    </div>
  );
}

const luotIdsCua = (kq: KetQuaBo): Partial<Record<KyNang, number>> => {
  const r: Partial<Record<KyNang, number>> = {};
  for (const [k, v] of Object.entries(kq.chiTiet)) if (v?.luot.id) r[k as KyNang] = v.luot.id;
  return r;
};

/* ═════════ Màn nghỉ trước Speaking ═════════ */
function ManNghi({ bo, onTiep, onBo }: { bo: TienTrinhBo; onTiep: () => void; onBo: () => void }) {
  const { thuocTinh } = useHienThi();
  const [con, setCon] = useState(10 * 60);
  useEffect(() => { const t = setInterval(() => setCon((c) => Math.max(0, c - 1)), 1000); return () => clearInterval(t); }, []);
  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      <div className={s.truocThi}>
        <section className={s.truocKhung} style={{ textAlign: 'center' }}>
          <h1 className={s.truocTieuDe}>Break · Nghỉ trước Speaking</h1>
          <p className={s.mo}>Thi thật nghỉ khoảng 10 phút giữa phần viết và phần nói. Uống nước, thả lỏng — Speaking kéo dài 11–14 phút với giám khảo AI.</p>
          <div className={s.dongHoNghi}>{dinhDangGio(con)}</div>
          <p className={s.mo}>Đã xong: {bo.buoc.slice(0, bo.viTri).map((b) => TEN_KY_NANG[b.kyNang]).join(' · ')}</p>
          <div className={s.hangNut} style={{ justifyContent: 'center' }}>
            <button type="button" className={s.batDau} onClick={onTiep}>Vào Speaking ngay</button>
            <button type="button" className={s.nutPhu} onClick={onBo}>Bỏ qua Speaking, xem kết quả 3 kỹ năng</button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═════════ Trung tâm luyện thi ═════════ */
type TrangThaiDe = { nhan: string; lop: string; band: number | null; luot: number };

function TrungTam({ tim, setTim, luot, dangDo, dangNhap, coNoi, mo, thiBo, moLuot }: {
  tim: string; setTim: (v: string) => void; luot: LuotThi[] | null; dangDo: string[]; dangNhap: boolean; coNoi: boolean;
  mo: (id: string, tab: Tab) => void; thiBo: (bo: (typeof BO_DE)[number]) => void; moLuot: (id: number) => void;
}) {
  const [locKy, setLocKy] = useState<KyNang | 'tat'>('tat');
  const [locBand, setLocBand] = useState<'tat' | 'duoi5' | '5-6' | '6-7' | 'tren7'>('tat');
  const [locBo, setLocBo] = useState<string>('tat');
  const [theoDang, setTheoDang] = useState<{ dang: string; so: number }[] | null>(null);
  useEffect(() => {
    if (!dangNhap) { setTheoDang([]); return; }
    loiDs({}).then((r) => setTheoDang([...r.thongKe.theoDang].sort((a, b) => b.so - a.so).slice(0, 5))).catch(() => setTheoDang([]));
  }, [dangNhap]);

  const trangThai = useCallback((id: string): TrangThaiDe => {
    if (dangDo.includes(id)) return { nhan: 'Đang dở', lop: s.ttDo, band: null, luot: 0 };
    const ds = (luot ?? []).filter((l) => l.deId === id);
    if (!ds.length) return { nhan: 'Chưa làm', lop: s.ttChua, band: null, luot: 0 };
    const gan = ds[0];
    return { nhan: gan.band != null ? `Band ${gan.band}` : gan.tong != null ? `${gan.dung}/${gan.tong} (practice)` : 'Đã làm', lop: s.ttXong, band: gan.band, luot: ds.length };
  }, [luot, dangDo]);

  const bandKhop = (m: MucDe) => {
    if (locBand === 'tat') return true;
    const so = Number(/(\d(?:\.\d)?)/.exec(m.capDo)?.[1] ?? 6);
    return locBand === 'duoi5' ? so < 5 : locBand === '5-6' ? so >= 5 && so < 6 : locBand === '6-7' ? so >= 6 && so < 7 : so >= 7;
  };
  const ds = MUC_LUC.filter((m) => (locKy === 'tat' || m.kyNang === locKy) && bandKhop(m) && (locBo === 'tat' || boCuaDe(m.id)?.id === locBo)
    && `${m.ten} ${m.moTa} ${m.boDe} ${(m.dang ?? []).map((d) => TEN_DANG[d]).join(' ')}`.toLowerCase().includes(tim.trim().toLowerCase()));
  const bo0 = BO_DE.find((b) => b.so === 0);
  const bo0San = bo0 ? deCuaBo(bo0).filter((d) => d.kyNang !== 'noi').every((d) => coDe(d.id)) : false;
  const boKhac = BO_DE.filter((b) => b.so !== 0);

  // Lịch sử: band theo thời gian từng kỹ năng (chỉ lượt có band).
  const lichSu = useMemo(() => {
    const theoKy: Record<string, { t: number; band: number }[]> = {};
    for (const l of [...(luot ?? [])].reverse()) if (l.band != null) (theoKy[l.kyNang] ??= []).push({ t: new Date(l.createdAt).getTime(), band: l.band });
    return theoKy;
  }, [luot]);
  const moiNhat = useMemo(() => Object.fromEntries(Object.entries(lichSu).map(([k, v]) => [k, v[v.length - 1]?.band ?? null])), [lichSu]);
  const tongUoc = bandTong({ nghe: moiNhat.nghe, doc: moiNhat.doc, viet: moiNhat.viet, noi: moiNhat.noi });

  return (
    <div className={s.khung}>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}>IELTS Online Test · Trung tâm luyện thi</h1>
        <label className={s.tim}><span aria-hidden>🔍</span><input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm đề, dạng câu…" aria-label="Tìm đề" /></label>
      </div>
      <p className={s.mo} style={{ margin: '0 0 18px', maxWidth: 820 }}>
        Phòng thi giống thi trên máy tính thật: toàn màn hình, đồng hồ “minutes left”, Settings cỡ chữ/bảng màu, Highlight/Note bằng chuột phải, cờ Review,
        Listening phát một lần + 2 phút kiểm tra, Writing đếm từ, phiếu điểm kiểu Test Report Form. Đề tự soạn theo đúng dạng câu hỏi thật; band là <b>ước tính</b>.
        Lộ trình 5 tập, đích <b>8.0</b>.
      </p>

      {/* ── Test đầu vào ── */}
      {bo0 && (
        <section className={s.hero}>
          <div>
            <span className={s.nhanKy}>Đề 0 · Test đầu vào · 2 giờ 45 phút</span>
            <h2 className={s.heroTieuDe}>{bo0.ten}</h2>
            <p className={s.mo} style={{ margin: '4px 0 10px', maxWidth: 640 }}>
              Sàng lọc 10′ (25 câu ngữ pháp/từ vựng A1→B2 + đoạn đọc TFNG) → Listening → Reading → Writing → Speaking. Độ khó trải band 4.0–8.0 để xếp bạn vào đúng <b>tập + ngày</b> của lộ trình.
              Dưới 10/30 ở sàng lọc ⇒ dừng sớm, xếp Tập 1 Ngày 1.
            </p>
            <div className={s.chipHang}>{deCuaBo(bo0).map((d) => <span key={d.id} className={`${s.chip} ${coDe(d.id) ? s.chipOn : ''}`}>{TEN_KY_NANG[d.kyNang]}{coDe(d.id) ? '' : ' · đang soạn'}</span>)}</div>
          </div>
          <div className={s.heroNut}>
            <button type="button" className={s.batDau} disabled={!bo0San} onClick={() => thiBo(bo0)}>{bo0San ? 'Bắt đầu test đầu vào' : 'Đề đang được soạn — sắp có'}</button>
            {tongUoc && <span className={s.mo}>Ước tính hiện tại từ các lượt gần nhất: <b>Overall {tongUoc.band}</b> ({tongUoc.soKy} kỹ năng) · {TAP_CUA_BAND(tongUoc.band)}</span>}
          </div>
        </section>
      )}

      {/* ── Đề đủ 4 kỹ năng ── */}
      <h2 className={s.h2Phieu}>Đề thi đủ 4 kỹ năng</h2>
      <div className={s.luoiBo}>
        {boKhac.map((b) => {
          const ds = deCuaBo(b);
          const san = ds.filter((d) => coDe(d.id));
          return (
            <div key={b.id} className={s.theBo}>
              <div className={s.theBoDau}>
                <div><b style={{ fontSize: 17 }}>{b.ten}</b><div className={s.mo}>{b.capDo} · {b.viTri}</div></div>
                <button type="button" className={s.batDau} style={{ minWidth: 0 }} disabled={san.length === 0} onClick={() => thiBo(b)}>Thi đủ đề</button>
              </div>
              <div className={s.theBoKy}>
                {(['nghe', 'doc', 'viet', 'noi'] as KyNang[]).map((k) => {
                  const d = ds.find((x) => x.kyNang === k);
                  const co = !!d && coDe(d.id);
                  const tt = co ? trangThai(d!.id) : null;
                  return (
                    <button key={k} type="button" className={`${s.theKy} ${co ? '' : s.theKyMo}`} disabled={!co} onClick={() => co && mo(d!.id, 'full')}>
                      <span>{TEN_KY_NANG[k]}</span>
                      <b>{co ? tt!.nhan : k === 'noi' ? (coNoi ? 'chưa có đề' : 'sắp có') : 'sắp có'}</b>
                    </button>
                  );
                })}
              </div>
              <div className={s.mo}>Thi đủ đề: {san.map((d) => TEN_KY_NANG[d.kyNang]).join(' → ')}{!ds.some((d) => d.kyNang === 'noi' && coDe(d.id)) ? ' · Speaking (sắp có) — band tổng tính 3 kỹ năng' : ''}.</div>
            </div>
          );
        })}
      </div>

      {/* ── Thư viện ── */}
      <h2 className={s.h2Phieu} style={{ marginTop: 26 }}>Thư viện đề · Practice theo Part / Passage</h2>
      <div className={s.locHang}>
        <div className={s.locKy} role="tablist" aria-label="Kỹ năng" style={{ marginBottom: 0 }}>
          {(['tat', 'nghe', 'doc', 'viet', 'noi'] as const).map((k) => (
            <button key={k} type="button" className={`${s.tab} ${locKy === k ? s.tabOn : ''}`} onClick={() => setLocKy(k)}>{k === 'tat' ? 'Tất cả' : TEN_KY_NANG[k]}</button>
          ))}
        </div>
        <label className={s.mo}>Mức band{' '}
          <select value={locBand} onChange={(e) => setLocBand(e.target.value as typeof locBand)} style={{ height: 30 }}>
            <option value="tat">Mọi mức</option><option value="duoi5">Dưới 5.0</option><option value="5-6">5.0 – 6.0</option><option value="6-7">6.0 – 7.0</option><option value="tren7">7.0 trở lên</option>
          </select>
        </label>
        <label className={s.mo}>Bộ đề{' '}
          <select value={locBo} onChange={(e) => setLocBo(e.target.value)} style={{ height: 30 }}>
            <option value="tat">Mọi bộ</option>{BO_DE.map((b) => <option key={b.id} value={b.id}>{b.ten}</option>)}
          </select>
        </label>
      </div>
      <div className={s.luoiDe}>
        {ds.map((m) => {
          const tt = trangThai(m.id);
          return (
            <div key={m.id} className={s.theDe}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <span className={s.nhanKy}>{TEN_KY_NANG[m.kyNang]} · {m.phut} phút · {m.kyNang === 'viet' ? '2 task' : m.kyNang === 'noi' ? '3 part' : `${m.soCau} câu`}</span>
                <span className={`${s.ttNhan} ${tt.lop}`}>{tt.nhan}{tt.luot > 1 ? ` · ${tt.luot} lượt` : ''}</span>
              </div>
              <b style={{ fontSize: 16 }}>{m.ten}</b>
              <span className={s.mo}>{m.boDe} · {m.capDo}</span>
              <span style={{ fontSize: 13.5, color: 'var(--c-ink-2)' }}>{m.moTa}</span>
              {m.dang && <div className={s.chipHang}>{m.dang.map((d) => <span key={d} className={s.chip}>{TEN_DANG[d]}</span>)}</div>}
              <div className={s.hangNut} style={{ justifyContent: 'flex-start', marginTop: 4 }}>
                <button type="button" className={s.batDau} style={{ minWidth: 0, height: 34 }} onClick={() => mo(m.id, 'full')}>Thi</button>
                {m.kyNang !== 'noi' && m.kyNang !== 'sangloc' && <button type="button" className={s.nutPhu} onClick={() => mo(m.id, 'practice')}>Practice từng {m.kyNang === 'doc' ? 'Passage' : m.kyNang === 'viet' ? 'Task' : 'Part'}</button>}
                {tt.luot > 0 && <button type="button" className={s.nutPhu} onClick={() => mo(m.id, 'result')}>Kết quả</button>}
              </div>
            </div>
          );
        })}
        {ds.length === 0 && <p className={s.mo}>Không có đề nào khớp bộ lọc.</p>}
      </div>

      {/* ── Lịch sử & tiến độ ── */}
      <h2 className={s.h2Phieu} style={{ marginTop: 26 }}>Lịch sử &amp; tiến độ</h2>
      {!dangNhap && <p className={s.mo}>Đăng nhập để lưu lượt làm, xem band theo thời gian và dạng câu sai nhiều nhất.</p>}
      {dangNhap && luot && (
        <div className={s.haiCot}>
          <section>
            <h3 className={s.h3Phieu}>Band theo thời gian</h3>
            {Object.keys(lichSu).length === 0 && <p className={s.mo}>Chưa có lượt thi đủ đề nào có band. Thi đủ 40 câu (hoặc Writing được AI chấm) để có điểm.</p>}
            {(['nghe', 'doc', 'viet', 'noi'] as KyNang[]).filter((k) => lichSu[k]?.length).map((k) => <Duong key={k} ten={TEN_KY_NANG[k]} ds={lichSu[k]} />)}
            {tongUoc && <p className={s.mo} style={{ marginTop: 8 }}>Overall ước tính (lượt gần nhất mỗi kỹ năng): <b>{tongUoc.band}</b> · {TAP_CUA_BAND(tongUoc.band)} trong lộ trình.</p>}
          </section>
          <section>
            <h3 className={s.h3Phieu}>Dạng câu sai nhiều nhất (Sổ lỗi)</h3>
            {theoDang && theoDang.length === 0 && <p className={s.mo}>Sổ lỗi chưa có mục nào.</p>}
            {theoDang && theoDang.length > 0 && (
              <ul className={s.dsOn}>
                {theoDang.map((d) => {
                  const dangId = (Object.keys(TEN_DANG) as DangCau[]).find((k) => TEN_DANG[k] === d.dang);
                  return <li key={d.dang}><span style={{ flex: 1 }}>{d.dang}</span><b>{d.so}</b>{dangId && <Link href={`/language/en/ielts/so-loi?dang=${encodeURIComponent(d.dang)}`} className={s.nutNho}>ôn</Link>}</li>;
                })}
              </ul>
            )}
            <h3 className={s.h3Phieu} style={{ marginTop: 14 }}>Lượt gần đây</h3>
            {luot.length === 0 && <p className={s.mo}>Chưa có lượt nào.</p>}
            {luot.length > 0 && (
              <table className={s.bangKq}>
                <tbody>
                  {luot.slice(0, 8).map((l) => (
                    <tr key={l.id}>
                      <td className={s.ghiChuNho}>{new Date(l.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>{MUC_LUC.find((m) => m.id === l.deId)?.ten ?? (BO_DE.find((b) => b.id === l.deId)?.ten ?? l.deId)}</td>
                      <td>{l.band != null ? <b>{l.band}</b> : l.tong != null ? `${l.dung}/${l.tong}` : '—'}</td>
                      <td>{l.kyNang !== 'tong' && <button type="button" className={s.nutNho} onClick={() => moLuot(l.id)}>xem</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}

      <p className={s.mo} style={{ marginTop: 26 }}>
        Khu cũ vẫn dùng được: <Link href="/language/en/ielts/phong-thi" style={{ textDecoration: 'underline' }}>Phòng thi thử dựng tự động</Link> (đề máy chủ dựng từ kho 4 chặng) và{' '}
        <Link href="/language/en/ielts/luyen-them" style={{ textDecoration: 'underline' }}>Kho luyện thêm</Link>.
      </p>
    </div>
  );
}

/** Đường band theo thời gian (SVG nhỏ, 0–9). */
function Duong({ ten, ds }: { ten: string; ds: { t: number; band: number }[] }) {
  const W = 260, H = 54;
  const xs = ds.map((_, i) => (ds.length === 1 ? W / 2 : 8 + (i / (ds.length - 1)) * (W - 16)));
  const y = (b: number) => H - 6 - (b / 9) * (H - 12);
  const d = ds.map((p, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${y(p.band).toFixed(1)}`).join(' ');
  return (
    <div className={s.duongBand}>
      <div><b>{ten}</b><div className={s.ghiChuNho}>{ds[0].band} → <b>{ds[ds.length - 1].band}</b> · {ds.length} lượt</div></div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-label={`${ten}: ${ds.map((p) => p.band).join(', ')}`}>
        {[5, 7].map((b) => <line key={b} x1={0} x2={W} y1={y(b)} y2={y(b)} stroke="var(--c-line)" strokeDasharray="3 3" />)}
        <path d={d} fill="none" stroke="var(--c-brand)" strokeWidth={2} />
        {ds.map((p, i) => <circle key={i} cx={xs[i]} cy={y(p.band)} r={3.5} fill="var(--c-brand)" />)}
      </svg>
    </div>
  );
}

/* ═════════ Trang một đề: Practice | Full test | Result ═════════ */
function TrangDe({ muc, de, tab, setTab, tim, setTim, veDs, batDau, moLuot, dangNhap, loi }: {
  muc: MucDe; de: De | null; tab: Tab; setTab: (t: Tab) => void; tim: string; setTim: (v: string) => void; veDs: () => void;
  batDau: (de: De, cheDo: 'practice' | 'full', phanChon: number[], phut: number | null) => void;
  moLuot: (id: number) => void; dangNhap: boolean; loi: string;
}) {
  const [chon, setChon] = useState<number[]>([]);
  const [gioiHan, setGioiHan] = useState<number | 0>(0);
  const [luot, setLuot] = useState<LuotThi[] | null>(null);
  const [loiDs, setLoiDs] = useState('');
  const phan = useMemo(() => (de ? phanCua(de) : []), [de]);
  useEffect(() => { setChon(phan.slice(0, 1).map((p) => p.so)); }, [phan]);
  useEffect(() => {
    if (tab !== 'result') return;
    if (!dangNhap) { setLuot([]); return; }
    setLoiDs('');
    thiDsLuot(muc.id).then((r) => setLuot(r.items)).catch((e) => { setLuot([]); setLoiDs(loiMang(e).message ?? 'Không tải được kết quả.'); });
  }, [tab, muc.id, dangNhap]);

  const phutMacDinh = muc.kyNang === 'doc' ? 20 : muc.kyNang === 'viet' ? (chon.includes(2) ? 40 : 20) : 0;
  const bo = boCuaDe(muc.id);

  return (
    <div className={s.khung}>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}>
          <button type="button" onClick={veDs}>Luyện thi</button> / {TEN_KY_NANG[muc.kyNang]} / <span style={{ color: 'var(--c-ink)' }}>{muc.boDe}</span>
        </h1>
        <label className={s.tim}><span aria-hidden>🔍</span><input value={tim} onChange={(e) => setTim(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') veDs(); }} placeholder="Tìm đề" aria-label="Tìm đề" /></label>
      </div>
      <div className={s.tenDe}>{muc.ten} <span className={s.mo} style={{ fontWeight: 400 }}>· {muc.capDo}{bo ? ` · ${bo.viTri}` : ''}</span></div>
      {muc.dang && <div className={s.chipHang} style={{ marginBottom: 14 }}>{muc.dang.map((d) => <span key={d} className={s.chip}>{TEN_DANG[d]}</span>)}</div>}
      <div className={s.tabs} role="tablist">
        {([['full', 'Do Full Test'], ['practice', 'Practice'], ['result', 'Result']] as const).map(([k, t]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={`${s.tab} ${tab === k ? s.tabOn : ''}`} onClick={() => setTab(k)}>{t}</button>
        ))}
      </div>

      {!de && tab !== 'result' && <p className={s.mo}>Đang tải đề…</p>}

      {de && tab === 'full' && (
        <>
          <p className={s.nghieng}>To achieve the best results, you need to spend {muc.phut} minutes on this test. Màn hình kế tiếp: xác nhận thông tin + hướng dẫn{muc.kyNang === 'nghe' ? ' + kiểm tai nghe' : ''}, rồi Start.</p>
          {muc.kyNang === 'nghe' && <p className={s.mo} style={{ margin: '0 0 14px' }}>🎧 Băng phát <b>một lần</b>, liền 4 part, có thời gian đọc câu hỏi trước mỗi part; hết băng có 2 phút kiểm tra.</p>}
          <button type="button" className={s.batDau} onClick={() => batDau(de, 'full', phan.map((p) => p.so), muc.phut)}>Start</button>
          {!dangNhap && <p className={s.mo} style={{ marginTop: 10 }}>Chưa đăng nhập: vẫn làm được, nhưng kết quả và Sổ lỗi không được lưu{muc.kyNang === 'nghe' ? ', giọng đọc dùng giọng của trình duyệt' : ''}.</p>}
        </>
      )}

      {de && tab === 'practice' && (
        <>
          <p className={s.nghieng}>Luyện từng phần / từng dạng: chọn phần muốn làm và giới hạn thời gian (tuỳ chọn).{muc.kyNang === 'nghe' ? ' Ở chế độ này được nghe lại, tua từng câu thoại và chỉnh tốc độ.' : ''}</p>
          <div className={s.chonPhan}>
            {phan.map((p) => (
              <label key={p.so}>
                <input type="checkbox" checked={chon.includes(p.so)} onChange={(e) => setChon((c) => (e.target.checked ? [...c, p.so].sort() : c.filter((x) => x !== p.so)))} />
                <span><b>{p.nhan}</b><br /><span className={s.mo}>{p.mo}</span></span>
              </label>
            ))}
          </div>
          {muc.kyNang !== 'nghe' && (
            <label className={s.mo} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              Thời gian:
              <select value={gioiHan} onChange={(e) => setGioiHan(Number(e.target.value))} style={{ height: 30 }}>
                <option value={0}>Không giới hạn (đếm giờ đã làm)</option>
                <option value={-1}>Theo đề ({phutMacDinh * Math.max(1, muc.kyNang === 'doc' ? chon.length : 1)} phút)</option>
                {[10, 15, 30, 45].map((m) => <option key={m} value={m}>{m} phút</option>)}
              </select>
            </label>
          )}
          <button type="button" className={s.batDau} disabled={chon.length === 0}
            onClick={() => batDau(de, 'practice', chon, gioiHan === 0 ? null : gioiHan === -1 ? phutMacDinh * Math.max(1, muc.kyNang === 'doc' ? chon.length : 1) : gioiHan)}>Start</button>
        </>
      )}

      {tab === 'result' && (
        <>
          {!dangNhap && <p className={s.mo}>Đăng nhập để lưu và xem lại kết quả các lượt làm.</p>}
          {luot == null && dangNhap && <p className={s.mo}>Đang tải…</p>}
          {luot && luot.length === 0 && dangNhap && !loiDs && <p className={s.mo}>Chưa có lượt làm nào cho đề này.</p>}
          {luot && luot.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className={s.bangKq}>
                <thead><tr><th>Ngày</th><th>Chế độ</th><th>Điểm</th><th>Band (ước tính)</th><th>Thời gian</th><th /></tr></thead>
                <tbody>
                  {luot.map((l) => (
                    <tr key={l.id}>
                      <td>{new Date(l.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td>{l.cheDo === 'full' ? 'Full Test' : 'Practice'}</td>
                      <td>{l.tong != null ? `${l.dung}/${l.tong}` : '—'}</td>
                      <td><b>{l.band != null ? l.band : '—'}</b></td>
                      <td>{dinhDangGio(l.giay)}</td>
                      <td><button type="button" className={s.nutPhu} onClick={() => moLuot(l.id)}>Phiếu điểm</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {(loiDs || loi) && <p className={s.loi}>{loiDs || loi}</p>}
        </>
      )}
    </div>
  );
}

export type { KetQuaCau };
