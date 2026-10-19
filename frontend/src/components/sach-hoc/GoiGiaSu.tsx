'use client';

/**
 * 📞 Luyện phát âm / Trò chuyện cùng CuongMini (03/10/2026, bản 3 — 19/10/2026).
 * Máy chủ: luyện phát âm `src/services/ielts/goiGiaSu.service.ts`; trò chuyện CHẢY DẦN
 * `src/services/ielts/troChuyen/` (Claude Heshin 5.5 chính hãng → câu nào xong là đọc ngay).
 *
 * Vòng lặp: GIA SƯ NÓI → (câu mẫu) → NGHE (micro tự bật, nói xong im là tự gửi) → CHẤM/ĐÁP …
 *  - Chạm nút lớn lúc gia sư đang nói = cắt lời, nghe ngay.
 *  - ⏸ Tạm dừng: dừng tiếng đang nói (tại chỗ) / tắt micro đang nghe (bỏ lượt dở) / giữ lời đáp
 *    đang về — ▶ Tiếp tục phát tiếp đúng chỗ. Ngữ cảnh (lịch sử, câu đang luyện) giữ nguyên.
 *  - Chọn nội dung: chủ đề theo trình độ (IELTS Part 1/2/3 · JLPT · HSK · nhập vai) hoặc bộ câu;
 *    buổi trước lưu ở máy chủ ⇒ "Tiếp tục buổi trước" / "Bắt đầu lại". Người mới: vào thẳng.
 *  - Nghe hụt 2 lần liền (im lặng) ⇒ tạm dừng chờ chạm.
 *  - Kết thúc ⇒ tổng kết buổi (thời lượng, lượt, lỗi, từ mới, chuỗi ngày, ước lượng band).
 *
 * ⚠️ Chống nháy: mọi thứ hiện/ẩn ở đây KHÔNG được đổi chiều cao vùng sân khấu (dòng lỗi, dòng
 * "máy nhà bận" là lớp phủ tuyệt đối) — canvas 3D đổi cỡ là mất một khung hình (xem sanKhau3D.ts).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, PhoneOff, RotateCcw, SkipForward, Volume2, Sparkles, Pause, Play, Shuffle, Subtitles } from 'lucide-react';
import api from '@/lib/api';
import NhanVat3D, { type CamXuc } from './goi/NhanVat3D';
import { play, stopAudio, tamDungAudio, tiepAudio, getRate, setRate, onRate, AI_TIMEOUT, type Clip } from './audio';
import { blobToWav16k } from './wav';
import { useMicro } from './useMicro';
import { tepTinh } from './moiTruong';
import { Inline } from './Blocks';
import { taoHangPhat, type HangPhat } from './goi/hangPhatAudio';
import {
  dsPhien, layChuDe, layPhien, luongTroChuyen, luuPhien, xoaPhien,
  type ChuDeWeb, type MetaLuot, type MocLuot, type PhienTomTat,
} from './goi/apiCuongMini';
import { ChonBoCau, ChonChuDe } from './goi/ChonNoiDung';
import TheSuaLoi from './goi/TheSuaLoi';
import TongKetBuoi, { type ThongKeBuoi } from './goi/TongKetBuoi';
import { c, loiKhen, ngonNguUI } from './goi/chu';
import s from './course.module.css';

export type CauMau = { text: string; ipa?: string };
type Cham = { tong: number; tu: { tu: string; diem: number; loi: string }[] };
type Luot = { ai: boolean; text: string; cham?: Cham | null; meta?: MetaLuot; phanHoiMs?: number; moc?: MocLuot };
type Pha = 'cho' | 'mo' | 'giasu' | 'nghe' | 'cham' | 'nghi' | 'loi';
type Giong = 'mac-dinh' | 'khanh-linh' | 'cuong';
type NN = 'en' | 'ja' | 'zh';

/** Câu mẫu đọc theo (luyện phát âm) — 12 giây; trò chuyện cho tới 45 giây; IELTS Part 2 nói dài 2 phút. */
const GHI_PHAT_AM = 12_000;
const GHI_TRO_CHUYEN = 45_000;
const GHI_NOI_DAI = 120_000;
const NGAN_HANG_CO_SO: Record<NN, number> = { en: 12, ja: 10, zh: 10 };
const MA_BAI = 'bai-hien-tai';

/** "[en]x[/en]" → phần tử có tô đậm cho phần tiếng nước ngoài. */
function LoiNoi({ text }: { text: string }) {
  const parts = text.split(/\[en\]([\s\S]*?)\[\/en\]/gi);
  return <>{parts.map((p, i) => (i % 2 ? <b key={i} className={s.goiEn}>{p}</b> : <span key={i}>{p}</span>))}</>;
}
const giay = (ms?: number) => (ms === undefined ? '—' : `${(ms / 1000).toFixed(1).replace('.', ',')} s`);
const sachMuc = (x: string) => x.replace(/[^\w.:-]/g, '-').slice(0, 90);

export default function GoiGiaSu({ danhSach, chuDe, onClose, ngonNgu = 'en', stage, cheDoDau = 'phat-am', maBai }: {
  danhSach: CauMau[]; chuDe: string; onClose: () => void; ngonNgu?: NN;
  /** Khoá đang học — tiến độ buổi + chuỗi ngày (luyện ≥ 3 lượt thì tính một ngày học). */
  stage?: string;
  /** Mở thẳng chế độ nào. */
  cheDoDau?: 'phat-am' | 'tro-chuyen';
  /** Mã bài đang mở — khoá lưu vị trí câu của bộ câu bài này. */
  maBai?: string;
}) {
  const ui = ngonNguUI();
  /** 🎯 đọc theo câu mẫu + chấm từng âm  ·  💬 nói tự do bằng ngôn ngữ đang học (05/10/2026). */
  const [cheDo, setCheDo] = useState<'phat-am' | 'tro-chuyen'>(cheDoDau);
  const cheDoRef = useRef(cheDo);
  cheDoRef.current = cheDo;
  /** Giọng đọc câu mẫu theo thứ tiếng của khoá. */
  const giongMau = ngonNgu === 'ja' ? 'ja-nu' : ngonNgu === 'zh' ? 'zh-nu' : 'uk-nu';
  const [pha, setPha] = useState<Pha>('cho');
  const phaRef = useRef(pha);
  phaRef.current = pha;
  const [mau, setMau] = useState<CauMau | null>(null);
  const [luot, setLuot] = useState<Luot[]>([]);
  const [loi, setLoi] = useState('');
  const st = useRef({
    viTri: 0, lanThu: 0, imLien: 0, dong: false, diemTruoc: null as number | null, datLien: 0,
    /* Luyện sâu (05/10/2026): 'tu' = đang tách một từ ra luyện riêng, đạt rồi mới ghép lại câu gốc. */
    che: 'cau' as 'cau' | 'tu', mauGoc: null as CauMau | null, mauTu: null as CauMau | null, lanTu: 0,
    /** Âm người học sai trong buổi — máy chủ giảng riêng khi một âm lặp lại ≥ 3 lần. */
    thongKe: {} as Record<string, number>, daNhac: [] as string[],
  });
  /** Hai thứ hiện lên màn hình: đang luyện riêng từ nào (+ câu gốc), và các âm hay vấp. */
  const [luyenTu, setLuyenTu] = useState<{ tu: string; goc: string } | null>(null);
  const [amHayVap, setAmHayVap] = useState<[string, number][]>([]);
  /** Giọng CuongMini (04/10/2026): mặc định = giọng Azure hiện tại; hai giọng máy nhà F5. Nhớ trên máy. */
  const [giong, setGiong] = useState<Giong>(() => { try { const g = localStorage.getItem('goi:giong'); return g === 'khanh-linh' || g === 'cuong' ? g : 'mac-dinh'; } catch { return 'mac-dinh'; } });
  const doiGiong = (g: Giong) => { setGiong(g); setGiongLui(false); try { localStorage.setItem('goi:giong', g); } catch { /* bỏ qua */ } };
  /** Máy nhà không trả lời ⇒ máy chủ đã đọc bằng giọng mặc định — báo nhẹ một dòng. */
  const [giongLui, setGiongLui] = useState(false);
  const cuon = useRef<HTMLDivElement>(null);

  /* ── Nội dung: chủ đề (trò chuyện) · bộ câu (phát âm) · buổi đã lưu ─────────── */
  const [chuDeDs, setChuDeDs] = useState<ChuDeWeb[]>([]);
  const [chuDeId, setChuDeId] = useState(MA_BAI);
  const chuDeIdRef = useRef(chuDeId);
  chuDeIdRef.current = chuDeId;
  const [phienDs, setPhienDs] = useState<PhienTomTat[] | null>(null);
  const [nguonPa, setNguonPa] = useState<'bai' | 'chung'>(danhSach.length ? 'bai' : 'chung');
  const [hienChon, setHienChon] = useState(false);
  const daChonTay = useRef(false);
  const dsCau = nguonPa === 'bai' ? danhSach : [];
  const tongCau = dsCau.length || NGAN_HANG_CO_SO[ngonNgu];
  const mucPa = `pa:${sachMuc(nguonPa === 'bai' ? `bai-${maBai || chuDe}` : `chung-${ngonNgu}`)}`;
  const mucTc = `tc:${sachMuc(chuDeId)}`;
  const chuDeHienTai = chuDeDs.find((x) => x.id === chuDeId) ?? null;
  const tenChuDe = chuDeId === MA_BAI ? chuDe : (ui === 'en' ? chuDeHienTai?.tenEn : chuDeHienTai?.ten) ?? chuDe;

  useEffect(() => {
    let song = true;
    layChuDe(ngonNgu).then((r) => { if (song) setChuDeDs(r?.items ?? []); }).catch(() => {});
    if (stage) {
      dsPhien(stage).then((r) => {
        if (!song) return;
        const ds = r?.items ?? [];
        setPhienDs(ds);
        // Đã có buổi trò chuyện lưu ⇒ chọn sẵn chủ đề gần nhất (người dùng chưa tự chọn gì).
        const tc = ds.find((p) => p.cheDo === 'tro-chuyen');
        if (tc && !daChonTay.current) setChuDeId(tc.muc.slice(3));
      }).catch(() => { if (song) setPhienDs([]); });
    } else setPhienDs([]);
    return () => { song = false; };
  }, [ngonNgu, stage]);
  const phienTc = (phienDs ?? []).filter((p) => p.cheDo === 'tro-chuyen');
  const phienPa = (phienDs ?? []).find((p) => p.muc === mucPa) ?? null;
  const phienTcHienTai = phienTc.find((p) => p.muc === mucTc) ?? null;

  /* ── Thống kê buổi (tổng kết) ─────────────────────────────────────────── */
  const tk = useRef<ThongKeBuoi>({ batDau: Date.now(), giayNoi: 0, soLuot: 0, soLoi: 0, diem: [], tuMoi: [] });
  const [tongKet, setTongKet] = useState(false);
  const daGhiChuoi = useRef(false);

  /* ── Lưu tiến độ (hoãn 1,5 s sau mỗi lượt; lưu ngay khi tạm dừng / đóng) ─── */
  const lichSuTC = useRef<{ ai: boolean; text: string }[]>([]);
  const henLuu = useRef<ReturnType<typeof setTimeout>>();
  const luuNgay = useCallback(() => {
    clearTimeout(henLuu.current);
    if (!stage || !tk.current.soLuot) return;
    const tro = cheDoRef.current === 'tro-chuyen';
    const muc = tro ? `tc:${sachMuc(chuDeIdRef.current)}` : mucPaRef.current;
    void luuPhien(stage, muc, tro
      ? { cheDo: 'tro-chuyen', ten: tenChuDeRef.current, lichSu: lichSuTC.current.slice(-24), soLuot: tk.current.soLuot, soLoi: tk.current.soLoi, giayNoi: Math.round(tk.current.giayNoi) }
      : { cheDo: 'phat-am', ten: tenChuDeRef.current, viTri: st.current.viTri, tongCau: tongCauRef.current, soLuot: tk.current.soLuot,
        diemTb: tk.current.diem.length ? Math.round(tk.current.diem.reduce((a, b) => a + b, 0) / tk.current.diem.length) : null }).catch(() => {});
  }, [stage]);
  const mucPaRef = useRef(mucPa);
  mucPaRef.current = mucPa;
  const tenChuDeRef = useRef(tenChuDe);
  tenChuDeRef.current = cheDo === 'tro-chuyen' ? tenChuDe : nguonPa === 'bai' ? chuDe : c('boCauCoBan', ui);
  const tongCauRef = useRef(tongCau);
  tongCauRef.current = tongCau;
  const henLuuSau = useCallback(() => { clearTimeout(henLuu.current); henLuu.current = setTimeout(luuNgay, 1500); }, [luuNgay]);

  useEffect(() => { cuon.current?.scrollTo({ top: cuon.current.scrollHeight, behavior: 'smooth' }); }, [luot]);
  // Đặt lại cờ khi gắn: StrictMode (dev) chạy gắn → dọn → gắn lại; không đặt lại
  // thì cờ "đã đóng" của lần dọn giả kẹt true và cuộc gọi đứng ở "Đang kết nối".
  const hang = useRef<HangPhat | null>(null);
  const luongCtl = useRef<AbortController | null>(null);
  useEffect(() => {
    st.current.dong = false;
    return () => {
      st.current.dong = true;
      hang.current?.huy();
      luongCtl.current?.abort();
      stopAudio();
      luuNgay();
      // Luyện nói cũng là học: ≥ 3 lượt ⇒ ghi "hôm nay có học" cho chuỗi ngày (05/10/2026).
      if (stage && tk.current.soLuot >= 3 && !daGhiChuoi.current) void api.post('/ielts/chuoi/ghi', { stage }).catch(() => undefined);
    };
  }, [stage, luuNgay]);

  const trangThai = () => {
    const x = st.current;
    return JSON.stringify({
      danhSach: dsCau, viTri: x.viTri, lanThu: x.lanThu, chuDe, giong, diemTruoc: x.diemTruoc, ngonNgu,
      che: x.che, mauGoc: x.mauGoc, mauTu: x.mauTu, lanTu: x.lanTu, thongKe: x.thongKe, daNhac: x.daNhac,
    });
  };

  /* ── ⏸ Tạm dừng / ▶ Tiếp tục ─────────────────────────────────────────── */
  const [tamDung, setTamDung] = useState(false);
  const tamDungRef = useRef(false);
  /** Việc bị giữ lại vì đang tạm dừng (gia sư định nói / định nghe) — chạy khi bấm Tiếp tục. */
  const choTiep = useRef<(() => void) | null>(null);
  const phaKhiDung = useRef<Pha>('cho');
  const dangDoAudio = useRef(false);

  /* Mức micro đi thẳng vào nhân vật + vòng sóng của nút, KHÔNG qua state: trước 04/10
     mỗi lần âm lượng đổi là vẽ lại cả hộp thoại (đè lên nền kính mờ) ⇒ màn hình nhấp nháy. */
  const mucRef = useRef(0);
  const vongRef = useRef<HTMLDivElement>(null);
  /** IELTS Part 2: một lượt nói dài (2 phút, im 4 giây mới tự gửi). */
  const [noiDai, setNoiDai] = useState(false);
  const ngheTu = useRef(0);
  const mic = useMicro({
    toiDaMs: noiDai ? GHI_NOI_DAI : cheDo === 'tro-chuyen' ? GHI_TRO_CHUYEN : GHI_PHAT_AM,
    tuDung: { imMs: noiDai ? 4000 : 1500 },
    // Suốt lượt không có tiếng nói (bấm nhầm, chưa kịp nói) ⇒ KHÔNG gửi đi chấm, gia sư nói "chưa nghe thấy".
    onXong: (blob, { coTieng }) => {
      // Thời gian ghi trừ đuôi im lặng tự dừng (~1,5 s; bấm tay thì đuôi ngắn hơn ⇒ trừ tối đa một nửa).
      if (coTieng) { const g = (Date.now() - ngheTu.current) / 1000; tk.current.giayNoi += Math.max(g / 2, g - 1.5); }
      setNoiDai(false);
      void guiLuot(blob, !coTieng);
    },
    onMuc: (m) => { mucRef.current = m; vongRef.current?.style.setProperty('--muc', m.toFixed(3)); },
  });
  /** Phản ứng tức thời của CuongMini (chào, mừng điểm cao, động viên) — giữ ~2,4 giây rồi về theo pha. */
  const [phanUng, setPhanUng] = useState<CamXuc | null>(null);
  const [khen, setKhen] = useState<string | null>(null);
  const henPU = useRef<ReturnType<typeof setTimeout>>();
  const phanUngNgan = useCallback((cx: CamXuc, ms = 2400) => {
    setPhanUng(cx);
    clearTimeout(henPU.current);
    henPU.current = setTimeout(() => { setPhanUng(null); setKhen(null); }, ms);
  }, []);
  useEffect(() => () => clearTimeout(henPU.current), []);
  const batNghe = useCallback(() => {
    if (st.current.dong) return;
    if (tamDungRef.current) { choTiep.current = () => batNghe(); return; }
    ngheTu.current = Date.now();
    setPha('nghe');
    void mic.batDau();
  }, [mic]);

  /* ── IELTS Part 2: 1 phút chuẩn bị theo thẻ đề rồi nói dài ─────────────── */
  const [chuanBi, setChuanBi] = useState<number | null>(null);
  const [demNoi, setDemNoi] = useState<number | null>(null);
  useEffect(() => {
    if (chuanBi === null || tamDung) return;
    if (chuanBi <= 0) { setChuanBi(null); setNoiDai(true); setDemNoi(120); batNghe(); return; }
    const t = setTimeout(() => setChuanBi((x) => (x === null ? null : x - 1)), 1000);
    return () => clearTimeout(t);
  }, [chuanBi, tamDung, batNghe]);
  useEffect(() => {
    if (demNoi === null) return;
    if (pha !== 'nghe' || demNoi <= 0) { if (pha !== 'nghe') setDemNoi(null); return; }
    const t = setTimeout(() => setDemNoi((x) => (x === null ? null : x - 1)), 1000);
    return () => clearTimeout(t);
  }, [demNoi, pha]);

  /** Gia sư nói (tệp mp3) rồi tới câu mẫu (giọng của khoá), xong thì tự nghe. */
  const giaSuNoi = useCallback((audio: string | string[] | null | undefined, text: string, cauMau: CauMau | null, docMau: boolean, tocMau?: number) => {
    if (st.current.dong) return;
    if (tamDungRef.current) { choTiep.current = () => giaSuNoi(audio, text, cauMau, docMau, tocMau); setPha('cho'); return; }
    const clips: Clip[] = [];
    // Giọng máy nhà trả NHIỀU tệp (đoạn Việt F5 + đoạn ngoại ngữ) — phát liền nhau, không ngắt.
    const tep = (Array.isArray(audio) ? audio : audio ? [audio] : []).filter(Boolean);
    if (tep.length) for (const u of tep) clips.push({ text: '', sfx: u });
    // Không có tệp giọng gia sư (máy chủ đọc hỏng): đọc tạm TỪNG ĐOẠN — phần ngoại ngữ giọng chuẩn của khoá,
    // phần Việt giọng Việt của máy. Trước 19/10/2026 cả câu Việt–Anh đi giọng Anh ⇒ đọc tiếng Việt bồi.
    else for (const [i, d] of text.split(/\[en\]([\s\S]*?)\[\/en\]/gi).entries()) if (d.trim()) clips.push(i % 2 ? { text: d.trim(), voice: giongMau } : { text: d.trim(), viet: true });
    // Luyện riêng một từ: đọc THẬT CHẬM trước (nghe rõ đuôi, hơi), rồi tốc độ thường.
    if (docMau && cauMau && tocMau) clips.push({ text: '', pauseMs: 300 }, { text: cauMau.text, voice: giongMau, toc: tocMau }, { text: '', pauseMs: 550 }, { text: cauMau.text, voice: giongMau, toc: 0.9 });
    else if (docMau && cauMau) clips.push({ text: '', pauseMs: 280 }, { text: cauMau.text, voice: giongMau, toc: 0.9 });
    setPha('giasu');
    play(clips, () => { if (!st.current.dong) batNghe(); });
  }, [batNghe, giongMau]);

  const nhan = useCallback((d: {
    lyDo?: string; noi?: string; audioUrl?: string | null; audioUrls?: string[]; giongThat?: Giong; mau?: CauMau; viTri?: number; lanThu?: number;
    cham?: Cham | null; nghe?: string; doiCau?: boolean; loai?: string;
    che?: 'cau' | 'tu'; mauGoc?: CauMau | null; mauTu?: CauMau | null; lanTu?: number; amSai?: string | null; nhacAm?: string | null; tocMau?: number; ghepLai?: boolean; tachTu?: boolean;
  }) => {
    if (d.lyDo === 'het_luot_ngay') { setLoi('Hôm nay bạn đã luyện hết số lượt — mai luyện tiếp nhé.'); setPha('loi'); return; }
    if (d.giongThat) setGiongLui(d.giongThat === 'mac-dinh' && giong !== 'mac-dinh');
    // Điểm lần trước CỦA CÙNG CÂU — máy chủ khen tiến bộ; sang câu mới thì xoá.
    if (d.doiCau) st.current.diemTruoc = null;
    else if (d.cham) st.current.diemTruoc = d.cham.tong;
    if (typeof d.viTri === 'number') st.current.viTri = d.viTri;
    if (typeof d.lanThu === 'number') st.current.lanThu = d.lanThu;
    // Luyện sâu: máy chủ trả trạng thái tách/ghép ở mọi lượt — giữ y nguyên để gửi lại lượt sau.
    if (d.che) {
      st.current.che = d.che;
      st.current.mauGoc = d.mauGoc ?? null;
      st.current.mauTu = d.mauTu ?? null;
      st.current.lanTu = d.lanTu ?? 0;
      setLuyenTu(d.che === 'tu' && d.mauTu && d.mauGoc ? { tu: d.mauTu.text, goc: d.mauGoc.text } : null);
    }
    if (d.amSai) {
      st.current.thongKe[d.amSai] = (st.current.thongKe[d.amSai] ?? 0) + 1;
      setAmHayVap(Object.entries(st.current.thongKe).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 3));
    }
    if (d.nhacAm && !st.current.daNhac.includes(d.nhacAm)) st.current.daNhac.push(d.nhacAm);
    if (d.mau) setMau(d.mau);
    return d;
  }, [giong]);

  async function guiLuot(blob: Blob, imLang = false) {
    if (st.current.dong) return;
    if (cheDoRef.current === 'tro-chuyen') { void guiTroChuyen(blob, imLang); return; }
    const mauDaDoc = mau; // câu vừa đọc — máy chủ có thể trả câu mẫu MỚI
    setPha('cham');
    try {
      const fd = new FormData();
      if (!imLang) fd.append('audio', await blobToWav16k(blob), 'luot.wav');
      fd.append('trangThai', imLang ? JSON.stringify({ ...JSON.parse(trangThai()), imLang: true }) : trangThai());
      const r = await api.post('/ielts/ai/goi-gia-su', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
      const d = nhan(r.data?.data ?? {});
      if (!d || st.current.dong) return;
      const ngheDuoc = (d.nghe ?? '').trim();
      if (ngheDuoc || d.cham) setLuot((x) => [...x, { ai: false, text: ngheDuoc || mauDaDoc?.text || '…', cham: d.cham ?? null }]);
      if (d.cham) {
        tk.current.soLuot += 1;
        tk.current.diem.push(d.cham.tong);
        // Đạt 3 câu liền ⇒ mắt trái tim; từ 95 ⇒ ngạc nhiên thích thú; đạt ⇒ vui; khá ⇒ gật gù; thấp ⇒ động viên.
        const tong = d.cham.tong;
        st.current.datLien = tong >= 85 ? st.current.datLien + 1 : 0;
        phanUngNgan(st.current.datLien >= 3 && tong >= 85 ? 'tim' : tong >= 95 ? 'ngac' : tong >= 85 ? 'vui' : tong >= 60 ? 'kha' : 'buon', 2800);
        if (tong >= 85) setKhen(loiKhen(ui));
        henLuuSau();
      }
      if (d.loai === 'hoi') {
        // Đang hỏi: nói câu đệm ngay, gọi AI song song.
        st.current.imLien = 0;
        setLuot((x) => [...x, { ai: true, text: d.noi ?? '' }]);
        setPha('nghi');
        const traLoi = api.post('/ielts/ai/goi-gia-su/hoi', { cauHoi: ngheDuoc, mau: d.mau?.text, chuDe, giong, ngonNgu }, AI_TIMEOUT);
        const dem = d.audioUrls?.length ? d.audioUrls : d.audioUrl ? [d.audioUrl] : [];
        if (dem.length) play(dem.map((u) => ({ text: '', sfx: u })), () => { /* chờ câu trả lời */ });
        const t = (await traLoi).data?.data as { noi?: string; audioUrl?: string | null; audioUrls?: string[]; lyDo?: string };
        if (st.current.dong) return;
        if (!t?.noi) { setLoi('Gia sư chưa trả lời được, bạn đọc tiếp câu mẫu nhé.'); giaSuNoi(null, '', d.mau ?? null, true); return; }
        setLuot((x) => [...x, { ai: true, text: t.noi! }]);
        giaSuNoi(t.audioUrls ?? t.audioUrl, t.noi, d.mau ?? null, true);
        return;
      }
      if (!d.cham) {
        st.current.imLien += 1;
        if (st.current.imLien >= 2) { setPha('cho'); setLoi('Mình chưa nghe thấy bạn. Bấm 🎙 khi sẵn sàng đọc nhé.'); return; }
      } else st.current.imLien = 0;
      setLoi('');
      setLuot((x) => [...x, { ai: true, text: d.noi ?? '' }]);
      // Đổi câu hay đọc lại: lượt nào cũng phát lại câu mẫu để người học nghe trước khi đọc.
      if (d.ghepLai && d.cham && d.cham.tong >= 80) phanUngNgan('vui', 2600);
      giaSuNoi(d.audioUrls ?? d.audioUrl, d.noi ?? '', d.mau ?? null, true, d.tocMau);
    } catch (e) {
      if (st.current.dong) return;
      const m = (e as { response?: { status?: number } })?.response;
      setLoi(m?.status === 401 ? 'Đăng nhập để luyện cùng gia sư.' : 'Mạng chập chờn, chưa gửi được. Bấm 🎙 để đọc lại nhé.');
      setPha('cho');
    }
  }

  /* ── 💬 Trò chuyện CHẢY DẦN: nghe → từng câu (phát ngay) → thẻ sửa lỗi ─────── */
  const [phuDe, setPhuDe] = useState(() => { try { return localStorage.getItem('goi:phu-de') === '1'; } catch { return false; } });
  const doiPhuDe = () => setPhuDe((x) => { try { localStorage.setItem('goi:phu-de', x ? '0' : '1'); } catch { /* bỏ qua */ } return !x; });
  const [tocDo, setTocDo] = useState(1);
  useEffect(() => { setTocDo(getRate()); return onRate(setTocDo); }, []);

  async function guiTroChuyen(blob: Blob | null, imLang = false, opt?: { tiepTuc?: boolean }) {
    if (st.current.dong) return;
    if (imLang) { setLoi('Mình chưa nghe thấy bạn nói gì — bấm 🎙 rồi nói nhé.'); setPha('cho'); return; }
    setPha(blob ? 'nghi' : 'mo');
    setLoi('');
    hang.current?.huy();
    luongCtl.current?.abort();
    const ctl = new AbortController();
    luongCtl.current = ctl;
    const t0 = performance.now();
    const moDau = !blob;
    const laPart2 = !!chuDeDs.find((x) => x.id === chuDeIdRef.current)?.cueCard;
    let idxAi = -1;
    let xongLuong = false;
    const h = taoHangPhat({
      onBatDau: () => {
        const ms = Math.round(performance.now() - t0);
        if (!st.current.dong) setPha('giasu');
        setLuot((x) => x.map((l, i) => (i === idxAi ? { ...l, phanHoiMs: ms } : l)));
      },
      onHet: () => {
        if (st.current.dong || ctl.signal.aborted) return;
        // Part 2: mở đầu đọc xong thẻ đề ⇒ 1 phút chuẩn bị rồi mới nghe.
        if (moDau && laPart2 && !opt?.tiepTuc) { setPha('cho'); setChuanBi(60); return; }
        batNghe();
      },
    });
    hang.current = h;
    if (tamDungRef.current) h.dung();
    const themAi = (text: string) => setLuot((x) => {
      if (idxAi >= 0 && idxAi < x.length) return x.map((l, i) => (i === idxAi ? { ...l, text: `${l.text} ${text}`.trim() } : l));
      idxAi = x.length;
      return [...x, { ai: true, text }];
    });
    try {
      const fd = new FormData();
      if (blob) fd.append('audio', blob, `noi.${/mp4|aac|m4a/.test(blob.type) ? 'mp4' : /ogg/.test(blob.type) ? 'ogg' : 'webm'}`);
      fd.append('trangThai', JSON.stringify({ ngonNgu, chuDeId: chuDeIdRef.current, tenBai: chuDe, giong, lichSu: lichSuTC.current.slice(-10), ...(opt?.tiepTuc ? { tiepTuc: true } : {}) }));
      await luongTroChuyen(fd, (e) => {
        if (st.current.dong || ctl.signal.aborted) return;
        if (e.type === 'nghe') {
          if (e.text) {
            setLuot((x) => [...x, { ai: false, text: e.text }]);
            lichSuTC.current.push({ ai: false, text: e.text });
            tk.current.soLuot += 1;
          }
        } else if (e.type === 'cau') {
          if (e.giongThat) setGiongLui(e.giongThat === 'mac-dinh' && giong !== 'mac-dinh');
          themAi(e.text);
          if (e.audioUrls.length) h.them(e.audioUrls);
        } else if (e.type === 'xong') {
          xongLuong = true;
          if (idxAi < 0) themAi(e.noi);
          setLuot((x) => x.map((l, i) => (i === idxAi ? { ...l, text: e.noi, meta: e.meta, moc: e.moc } : l)));
          lichSuTC.current.push({ ai: true, text: e.noi });
          if (e.meta.sua) tk.current.soLoi += 1;
          for (const t of e.meta.tu) if (!tk.current.tuMoi.some((x) => x.tu === t.tu)) tk.current.tuMoi.push(t);
          const cam: Partial<Record<MetaLuot['cam'], CamXuc>> = { khen: 'vui', sua: 'kha', vui: 'tim' };
          if (!moDau && cam[e.meta.cam]) { phanUngNgan(cam[e.meta.cam]!, 2600); if (e.meta.cam === 'khen') setKhen(loiKhen(ui)); }
          if (moDau) phanUngNgan('chao', 2200);
          h.xong();
          henLuuSau();
        } else if (e.type === 'loi') {
          xongLuong = true;
          h.huy();
          setLoi(e.message);
          setPha(e.lyDo === 'het_luot_ngay' ? 'loi' : 'cho');
        }
      }, ctl.signal);
      if (!xongLuong && !ctl.signal.aborted && !st.current.dong) { h.huy(); setLoi('Mạng chập chờn, lượt này bị đứt. Bấm 🎙 để nói lại nhé.'); setPha('cho'); }
    } catch (e) {
      if (st.current.dong || ctl.signal.aborted) return;
      h.huy();
      const status = (e as { status?: number })?.status;
      setLoi(status === 401 ? 'Đăng nhập để trò chuyện cùng CuongMini.' : 'Mạng chập chờn, chưa gửi được. Bấm 🎙 để nói lại nhé.');
      setPha('cho');
    }
  }

  const datLaiBuoi = () => {
    hang.current?.huy();
    luongCtl.current?.abort();
    stopAudio();
    setLuot([]);
    setLoi('');
    lichSuTC.current = [];
    st.current.viTri = 0; st.current.lanThu = 0; st.current.diemTruoc = null; st.current.imLien = 0;
    st.current.che = 'cau'; st.current.mauGoc = null; st.current.mauTu = null; st.current.lanTu = 0;
    setLuyenTu(null); setMau(null); setChuanBi(null); setNoiDai(false);
    setPha('cho');
  };
  const doiCheDo = (cd: 'phat-am' | 'tro-chuyen') => {
    if (cd === cheDo || pha === 'nghe' || pha === 'cham' || pha === 'nghi' || pha === 'mo') return;
    luuNgay();
    datLaiBuoi();
    setCheDo(cd);
    setHienChon(false);
  };

  /* ── Bắt đầu: mới · tiếp tục buổi trước · bắt đầu lại ───────────────────── */
  const batDau = async (kieu: 'moi' | 'tiep' | 'lai' = 'moi') => {
    const mucTcNay = `tc:${sachMuc(chuDeIdRef.current)}`;
    setLoi('');
    setHienChon(false);
    setPha('mo');
    play({ text: '', sfx: tepTinh('/audio/im-lang.mp3') }); // mở khoá âm thanh ngay trong cú bấm (Safari)
    tk.current.batDau = tk.current.soLuot ? tk.current.batDau : Date.now();
    if (cheDoRef.current === 'tro-chuyen') {
      if (kieu === 'tiep' && stage) {
        try {
          const r = await layPhien(stage, mucTcNay);
          lichSuTC.current = r?.duLieu?.lichSu ?? [];
          setLuot(lichSuTC.current.slice(-6).map((t) => ({ ai: t.ai, text: t.text })));
        } catch { lichSuTC.current = []; }
      }
      if (kieu === 'lai' && stage) void xoaPhien(stage, mucTcNay).catch(() => {});
      void guiTroChuyen(null, false, { tiepTuc: kieu === 'tiep' && lichSuTC.current.length > 0 });
      return;
    }
    const daTungLuyen = (phienDs ?? []).length > 0;
    const moDau = kieu === 'tiep' ? 'tiep' : kieu === 'lai' ? 'lai' : daTungLuyen ? 'quen' : 'moi';
    if (kieu === 'tiep' && phienPa) st.current.viTri = Math.min(phienPa.viTri, Math.max(0, tongCau - 1));
    if (kieu === 'lai') { st.current.viTri = 0; if (stage) void xoaPhien(stage, mucPa).catch(() => {}); }
    try {
      const fd = new FormData();
      fd.append('trangThai', JSON.stringify({ ...JSON.parse(trangThai()), moDau }));
      const r = await api.post('/ielts/ai/goi-gia-su', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
      const d = nhan(r.data?.data ?? {});
      if (!d || st.current.dong) return;
      setLuot([{ ai: true, text: d.noi ?? '' }]);
      phanUngNgan('chao', 2600);
      giaSuNoi(d.audioUrls ?? d.audioUrl, d.noi ?? '', d.mau ?? null, true);
    } catch (e) {
      const m = (e as { response?: { status?: number } })?.response;
      setLoi(m?.status === 401 ? 'Đăng nhập để luyện cùng gia sư.' : 'Chưa kết nối được gia sư, thử lại nhé.');
      setPha('cho');
    }
  };
  /** Có buổi đã lưu khớp lựa chọn hiện tại ⇒ nút lớn = "tiếp tục buổi trước". */
  const coBuoiTruoc = cheDo === 'tro-chuyen' ? !!phienTcHienTai : !!(phienPa && phienPa.viTri > 0);

  /* ── ⏸ / ▶ ───────────────────────────────────────────────────────────── */
  const dungLai = () => {
    if (tamDungRef.current || tongKet) return;
    tamDungRef.current = true;
    setTamDung(true);
    phaKhiDung.current = phaRef.current;
    if (phaRef.current === 'nghe') { mic.huy(); setNoiDai(false); setDemNoi(null); choTiep.current = () => batNghe(); setPha('cho'); }
    if (hang.current?.conPhat() || (phaRef.current === 'nghi' || phaRef.current === 'mo')) hang.current?.dung();
    else if (phaRef.current === 'giasu') dangDoAudio.current = tamDungAudio();
    luuNgay();
  };
  const tiepTucLai = () => {
    if (!tamDungRef.current) return;
    tamDungRef.current = false;
    setTamDung(false);
    if (hang.current?.dangDung()) { hang.current.chay(); return; }
    if (dangDoAudio.current) { dangDoAudio.current = false; tiepAudio(); return; }
    const f = choTiep.current;
    choTiep.current = null;
    if (f) f();
  };

  /** Nút lớn: bắt đầu / cắt lời gia sư để nói ngay / xong nói. */
  const nutLon = () => {
    if (tamDung) { tiepTucLai(); return; }
    if (chuanBi !== null) { setChuanBi(0); return; }
    if (pha === 'cho' && !luot.length) { void batDau(coBuoiTruoc ? 'tiep' : 'moi'); return; }
    // Bấm đúng lúc gia sư vừa nói xong (micro vừa tự bật) thì cú bấm đó là để CẮT LỜI,
    // không phải để dừng ghi — bỏ qua "Xong" trong 0,8 giây đầu.
    if (pha === 'nghe') { if (Date.now() - ngheTu.current > 800) mic.dung(); return; }
    if (pha === 'giasu' || pha === 'cho' || pha === 'loi') { hang.current?.huy(); stopAudio(); st.current.imLien = 0; setLoi(''); batNghe(); }
  };
  const ngheMau = () => { if (mau && pha !== 'nghe' && pha !== 'cham') { stopAudio(); play({ text: mau.text, voice: giongMau, toc: 0.85 }); } };
  const cauKhac = () => {
    if (!dsCau.length && !mau) return;
    stopAudio();
    const n = Math.max(1, dsCau.length || NGAN_HANG_CO_SO[ngonNgu]);
    st.current.viTri = (st.current.viTri + 1) % n;
    st.current.lanThu = 0;
    st.current.diemTruoc = null;
    st.current.che = 'cau'; st.current.mauGoc = null; st.current.mauTu = null; st.current.lanTu = 0;
    setLuyenTu(null);
    const m = dsCau.length ? dsCau[st.current.viTri] : null;
    if (m) { setMau(m); setPha('giasu'); play({ text: m.text, voice: giongMau, toc: 0.9 }, () => batNghe()); }
  };
  /** Chọn buổi đã lưu ⇒ đặt chủ đề NGAY vào ref (batDau gọi liền trong cùng cú bấm — Safari mở khoá âm thanh). */
  const chonBuoi = (id: string) => { daChonTay.current = true; chuDeIdRef.current = id; setChuDeId(id); };
  const chonChuDe = (id: string) => {
    if (pha === 'nghe' || pha === 'nghi' || pha === 'mo') return;
    daChonTay.current = true;
    luuNgay();
    datLaiBuoi();
    setChuDeId(id);
    setHienChon(false);
  };

  /* ── Kết thúc ⇒ tổng kết (nếu đã luyện) ─────────────────────────────── */
  const ketThuc = useCallback(() => {
    if (tongKet) { onClose(); return; }
    luuNgay();
    if (!tk.current.soLuot) { onClose(); return; }
    hang.current?.huy();
    luongCtl.current?.abort();
    stopAudio();
    mic.huy();
    setChuanBi(null);
    setPha('cho');
    setTongKet(true);
  }, [tongKet, onClose, luuNgay, mic]);
  const ketThucRef = useRef(ketThuc);
  ketThucRef.current = ketThuc;
  // Esc để kết thúc (lần hai = đóng hẳn). Phím cách = tạm dừng / tiếp tục.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ketThucRef.current();
      if (e.key === ' ' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        if (tamDungRef.current) tiepTucLaiRef.current(); else dungLaiRef.current();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const tiepTucLaiRef = useRef(tiepTucLai);
  tiepTucLaiRef.current = tiepTucLai;
  const dungLaiRef = useRef(dungLai);
  dungLaiRef.current = dungLai;

  const NHAN: Record<Pha, string> = {
    cho: luot.length ? (cheDo === 'tro-chuyen' ? 'Bấm 🎙 để nói' : 'Bấm 🎙 để đọc') : coBuoiTruoc ? (ui === 'en' ? 'Tap to continue last session' : 'Bấm để tiếp tục buổi trước') : 'Bấm để bắt đầu',
    mo: 'Đang gọi CuongMini…',
    giasu: 'CuongMini đang nói — chạm để ngắt lời và nói ngay',
    nghe: noiDai ? c('dangNoiDai', ui) : cheDo === 'tro-chuyen' ? 'Đang nghe — nói xong im một chút là máy tự gửi' : 'Đang nghe — đọc to câu mẫu, nói xong máy tự chấm',
    cham: 'Đang chấm…',
    nghi: 'CuongMini đang suy nghĩ…',
    loi: 'Tạm dừng',
  };

  const THEO_PHA: Record<Pha, CamXuc> = { cho: 'cho', mo: 'nghi', giasu: 'noi', nghe: 'nghe', cham: 'nghi', nghi: 'nghi', loi: 'loi' };
  /* Để im ở trạng thái chờ ~25 giây ⇒ CuongMini ngủ gật (zzz); có gì thay đổi là tỉnh ngay. */
  const [buonNgu, setBuonNgu] = useState(false);
  useEffect(() => {
    setBuonNgu(false);
    if (pha !== 'cho' || chuanBi !== null) return;
    const t = setTimeout(() => setBuonNgu(true), 25_000);
    return () => clearTimeout(t);
  }, [pha, luot.length, mau, chuanBi]);
  const camXuc = tamDung ? 'cho' : phanUng ?? (buonNgu ? 'ngu' : chuanBi !== null ? 'nghi' : THEO_PHA[pha]);
  const aiCuoi = [...luot].reverse().find((l) => l.ai);
  const loiCuoi = aiCuoi?.text ?? '';
  const iCham = luot.map((l, i) => (l.cham ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
  const chamCuoi = iCham >= 0 ? luot[iCham].cham! : null;
  const NHAN_NGAN: Record<Pha, string> = { cho: 'Sẵn sàng', mo: 'Đang kết nối', giasu: 'CuongMini đang nói', nghe: 'Đang nghe bạn', cham: 'Đang chấm', nghi: 'CuongMini đang nghĩ', loi: 'Tạm dừng' };
  const ranh = pha === 'cho' || pha === 'loi';
  const hienBangChon = cheDo === 'tro-chuyen' && (hienChon || (!luot.length && ranh && phienDs !== null && chuDeDs.length > 0 && (phienTc.length > 0 || hienChon)));
  const cue = chuDeHienTai?.cueCard;

  return (
    <div className={s.goiSan} role="dialog" aria-modal="true" aria-label="Luyện nói cùng CuongMini">
      <div className={s.goiTroi} aria-hidden="true"><i /><i /><i /></div>

      <header className={s.goiThanh} data-goi-thanh="">
        <div className={s.goiDanhTinh}>
          <span className={s.goiCham0} data-pha={tamDung ? 'loi' : pha} />
          <div>
            <div className={s.goiTen}>{cheDo === 'tro-chuyen' ? 'Trò chuyện cùng CuongMini' : 'Luyện nói cùng CuongMini'}</div>
            <div className={s.goiPhu}>{tamDung ? c('tamDung', ui) : NHAN_NGAN[pha]} · {cheDo === 'tro-chuyen' ? tenChuDe : chuDe}</div>
          </div>
        </div>
        <div className={s.goiCheDo} role="tablist" aria-label="Chế độ">
          <button type="button" role="tab" aria-selected={cheDo === 'phat-am'} data-chon={cheDo === 'phat-am' || undefined} onClick={() => doiCheDo('phat-am')}>🎯 Luyện phát âm</button>
          <button type="button" role="tab" aria-selected={cheDo === 'tro-chuyen'} data-chon={cheDo === 'tro-chuyen' || undefined} onClick={() => doiCheDo('tro-chuyen')}>💬 Trò chuyện</button>
        </div>
        <div className={s.goiThanhPhai}>
          <div className={s.goiTocDo} role="group" aria-label={c('tocDo', ui)} title={c('tocDo', ui)}>
            {([[0.8, 'cham'], [1, 'vua'], [1.2, 'nhanh']] as const).map(([r, k]) => (
              <button key={k} type="button" data-chon={Math.abs(tocDo - r) < 0.05 || undefined} onClick={() => setRate(r)}>{c(k, ui)}</button>
            ))}
          </div>
          <label className={s.goiChonGiong} title="Giọng CuongMini nói tiếng Việt (phần ngoại ngữ luôn là giọng bản ngữ)">
            <Volume2 size={14} aria-hidden />
            <select value={giong} onChange={(e) => doiGiong(e.target.value as Giong)} aria-label="Giọng của CuongMini">
              <option value="mac-dinh">Giọng mặc định</option>
              <option value="khanh-linh">Khánh Linh (máy nhà)</option>
              <option value="cuong">Cường — giảng bài (máy nhà)</option>
            </select>
          </label>
          <button type="button" className={s.goiKetThuc} onClick={ketThuc}><PhoneOff size={16} /> Kết thúc</button>
        </div>
      </header>

      <div className={s.goiKhung}>
        <section className={s.goiSanKhau}>
          {giongLui && <div className={s.goiGiongLui}>Máy nhà đang bận — CuongMini tạm nói bằng giọng mặc định, tự đổi lại khi máy nhà sẵn sàng.</div>}
          <NhanVat3D camXuc={camXuc} mucRef={mucRef} />
          <div className={s.goiBongNoi} aria-live="polite">
            {loiCuoi ? (
              <>
                <LoiNoi text={loiCuoi} />
                {phuDe && aiCuoi?.meta?.dich && <div className={s.goiBongDich}>{aiCuoi.meta.dich}</div>}
              </>
            ) : (
              cheDo === 'tro-chuyen'
                ? <span>Chào bạn! Mình là <b>CuongMini</b>. Bấm micro rồi mình cùng trò chuyện nhé — bí thì cứ nói tiếng Việt.</span>
                : <span>Chào bạn! Mình là <b>CuongMini</b>. Mình đọc mẫu, bạn đọc theo, mình chấm từng âm. Muốn hỏi gì cứ nói tiếng Việt nhé.</span>
            )}
          </div>
          {chamCuoi && (
            <div key={iCham} className={`${s.goiDiem} ${chamCuoi.tong >= 85 ? s.goiDiemTot : chamCuoi.tong >= 60 ? s.goiDiemKha : s.goiDiemYeu}`}>
              {chamCuoi.tong >= 85 && <Sparkles size={16} />}<b>{chamCuoi.tong}</b><span>điểm</span>
            </div>
          )}
          {khen && <div key={khen + luot.length} className={s.goiKhen}>{khen}</div>}
          {tamDung && <div className={s.goiTamDungPhu}>⏸ {c('dangTamDung', ui)}</div>}
          {chuanBi !== null && (
            <div className={s.goiDongHo} role="timer" aria-live="polite">
              <span>{c('chuanBi', ui)}</span><b>0:{String(chuanBi).padStart(2, '0')}</b>
              <button type="button" onClick={() => setChuanBi(0)}>{c('boQuaChuanBi', ui)} →</button>
            </div>
          )}
          {demNoi !== null && pha === 'nghe' && (
            <div className={s.goiDongHo} role="timer"><span>🎙️</span><b>{Math.floor(demNoi / 60)}:{String(demNoi % 60).padStart(2, '0')}</b></div>
          )}
        </section>

        <aside className={s.goiBen}>
          {cheDo === 'tro-chuyen' ? (
            <div className={s.goiMau}>
              <div className={s.goiNhanMucHang}>
                <span className={s.goiNhanMuc}>💬 {tenChuDe || 'Trò chuyện tự do'}</span>
                <button type="button" className={s.goiNutNho} onClick={() => setHienChon((x) => !x)} disabled={!ranh} aria-expanded={hienBangChon}>
                  <Shuffle size={13} /> {c('doiChuDe', ui)}
                </button>
              </div>
              {cue && !hienBangChon ? (
                <div className={s.goiCue}>
                  <div className={s.goiSuaNhan}>🗂️ {c('theDe', ui)}</div>
                  <b>{cue.de}</b>
                  <div className={s.goiSuaNhan}>{c('banNenNoi', ui)}</div>
                  <ul>{cue.goiY.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
              ) : !hienBangChon && (
                <div className={s.goiGoiY} style={{ margin: 0 }}>
                  Nói bằng <b>{ngonNgu === 'ja' ? 'tiếng Nhật' : ngonNgu === 'zh' ? 'tiếng Trung' : 'tiếng Anh'}</b> — câu ngắn cũng được. CuongMini trả lời, sửa lỗi nhẹ và hỏi lại bạn.
                  <br />Bí từ hay không hiểu? Cứ <b>nói tiếng Việt</b>.
                </div>
              )}
            </div>
          ) : (
          <div className={s.goiMau}>
            <div className={s.goiNhanMucHang}>
              <span className={s.goiNhanMuc}>{luyenTu ? '🔍 Luyện riêng từ này — đạt rồi ghép lại cả câu' : 'Câu mẫu — đọc theo'}</span>
              {mau && <span className={s.goiDemCau}>{c('cauSo', ui)} {st.current.viTri + 1}/{tongCau}</span>}
            </div>
            {mau ? (
              <>
                <div className={s.goiMauChu} lang={ngonNgu === 'en' ? undefined : ngonNgu}><Inline text={mau.text} /></div>
                {mau.ipa && <div className={s.goiIpa}>/{mau.ipa}/</div>}
                {luyenTu && <div className={s.goiGoc}>Câu gốc: <Inline text={luyenTu.goc} /></div>}
                {amHayVap.length > 0 && (
                  <div className={s.goiHayVap} title="Âm bạn đọc chưa chuẩn nhiều lần trong buổi này — CuongMini sẽ giảng riêng khi một âm lặp lại 3 lần">
                    Âm hay vấp: {amHayVap.map(([a, n]) => <span key={a}>/{a}/ ×{n}</span>)}
                  </div>
                )}
              </>
            ) : !luot.length && ranh ? (
              <ChonBoCau
                coBai={danhSach.length > 0} soCauBai={danhSach.length} nguon={nguonPa}
                onNguon={(n) => { setNguonPa(n); st.current.viTri = 0; }}
                phien={phienPa} onTiep={() => void batDau('tiep')} onLai={() => void batDau('lai')}
              />
            ) : <div className={s.goiMauTrong}>Bấm nút micro để CuongMini bắt đầu buổi luyện.</div>}
          </div>
          )}
          <div className={s.goiLog} ref={cuon}>
            {hienBangChon ? (
              <ChonChuDe
                chuDeDs={chuDeDs} phien={phienTc} chuDeId={chuDeId} tenBai={chuDe}
                onChon={chonChuDe}
                onTiep={(p) => { chonBuoi(p.muc.slice(3)); void batDau('tiep'); }}
                onLai={(p) => { chonBuoi(p.muc.slice(3)); void batDau('lai'); }}
              />
            ) : (
              <>
                {!luot.length && (
                  <div className={s.goiGoiY}>
                    🎧 Đeo tai nghe sẽ rõ hơn và micro không thu lại tiếng CuongMini.<br />
                    {cheDo === 'tro-chuyen' ? 'Mỗi lượt: bạn nói → CuongMini trả lời ngay từng câu và hỏi lại. Nói xong im một chút là máy tự gửi.' : 'Mỗi lượt: nghe câu mẫu → đọc theo → nghe nhận xét. Nói xong im 1,5 giây là máy tự chấm.'}
                    <br />⌨️ Phím cách: {c('tamDung', ui)} / {c('tiepTuc', ui)} · Esc: kết thúc
                  </div>
                )}
                {luot.map((l, i) => (
                  <div key={i} className={l.ai ? s.goiAi : s.goiBan}>
                    {l.ai ? <LoiNoi text={l.text} /> : <>“{l.text}”</>}
                    {l.cham && (
                      <div className={s.goiCham}>
                        <b className={l.cham.tong >= 85 ? s.paGood : l.cham.tong >= 60 ? s.paWarn : s.paBad}>{l.cham.tong} điểm</b>
                        {l.cham.tu.map((w, j) => (
                          <span key={j} className={w.loi === 'Omission' ? s.paOmit : w.diem >= 85 ? s.paGood : w.diem >= 60 ? s.paWarn : s.paBad}>{w.tu}</span>
                        ))}
                      </div>
                    )}
                    {l.meta && <TheSuaLoi meta={l.meta} nn={ngonNgu} phuDe={phuDe} />}
                    {l.phanHoiMs !== undefined && (
                      <div className={s.goiMoc} title={l.moc ? `STT ${giay(l.moc.stt)} · chữ đầu ${giay(l.moc.chuDau)} · câu đầu ${giay(l.moc.cauDau)} · tiếng đầu sẵn ${giay(l.moc.ttsDau)} · hết ${giay(l.moc.xong)}` : undefined}>
                        ⚡ {c('phanHoiSau', ui)} {giay(l.phanHoiMs)}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>
      </div>

      <footer className={s.goiDay}>
        <div className={s.goiDayTrai}>
          <button type="button" className={s.goiPhuNut} onClick={tamDung ? tiepTucLai : dungLai} disabled={!luot.length && pha === 'cho' && chuanBi === null} aria-pressed={tamDung}>
            {tamDung ? <Play size={18} /> : <Pause size={18} />}<span>{tamDung ? c('tiepTuc', ui) : c('tamDung', ui)}</span>
          </button>
          {cheDo === 'phat-am' && (
            <button type="button" className={s.goiPhuNut} onClick={ngheMau} disabled={!mau || pha === 'nghe' || pha === 'cham' || tamDung}>
              <Volume2 size={18} /><span>Nghe mẫu</span>
            </button>
          )}
        </div>
        <div className={s.goiGiua}>
          <div ref={vongRef} className={s.goiVong} data-pha={tamDung ? 'cho' : pha}>
            <button
              type="button"
              className={s.goiNut}
              data-pha={pha}
              onClick={nutLon}
              disabled={!tamDung && (pha === 'mo' || pha === 'cham' || pha === 'nghi')}
              aria-label={tamDung ? c('tiepTuc', ui) : NHAN[pha]}
            >
              {tamDung ? <Play size={30} /> : pha === 'nghe' ? <span className={s.goiSong}><i /><i /><i /><i /></span> : pha === 'loi' ? <RotateCcw size={28} /> : <Mic size={30} />}
            </button>
          </div>
          <div className={s.goiNhan}>{tamDung ? c('tiepTuc', ui) : NHAN[pha]}</div>
        </div>
        <div className={s.goiDayPhai}>
          {cheDo === 'phat-am' ? (
            <button type="button" className={s.goiPhuNut} onClick={cauKhac} disabled={dsCau.length < 2 || pha === 'nghe' || pha === 'cham' || tamDung}>
              <SkipForward size={18} /><span>Câu khác</span>
            </button>
          ) : (
            <button type="button" className={s.goiPhuNut} onClick={doiPhuDe} aria-pressed={phuDe} data-chon={phuDe || undefined}>
              <Subtitles size={18} /><span>{c('phuDe', ui)}</span>
            </button>
          )}
        </div>
        {(loi || mic.loi) && <div className={s.goiLoi}>{loi || mic.loi}</div>}
      </footer>

      {tongKet && (
        <TongKetBuoi
          tk={tk.current} cheDo={cheDo} nn={ngonNgu} stage={stage} chuDeId={chuDeId} tenBai={chuDe}
          luot={lichSuTC.current}
          onDong={onClose}
          onOLai={() => setTongKet(false)}
          daGhiChuoi={() => { daGhiChuoi.current = true; }}
        />
      )}
    </div>
  );
}
