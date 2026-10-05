'use client';

/**
 * 📞 Luyện phát âm cùng gia sư bằng giọng (03/10/2026) — máy chủ:
 * src/services/ielts/goiGiaSu.service.ts (đọc đầu tệp đó để biết vì sao lượt
 * luyện không gọi AI còn lượt hỏi thì có).
 *
 * Vòng lặp: GIA SƯ NÓI → CÂU MẪU (giọng Anh của khoá) → NGHE (micro tự bật, nói
 * xong im 1,5 giây là tự dừng) → CHẤM → gia sư nói tiếp …
 *  - Chạm nút lớn lúc gia sư đang nói = cắt lời, nghe ngay.
 *  - Nghe hụt 2 lần liền (im lặng) ⇒ tạm dừng chờ chạm — vòng lặp tự quay mãi
 *    vừa tốn lượt chấm vừa làm đèn micro nhấp nháy không dứt.
 *  - Đóng cửa sổ ⇒ dừng tiếng + tắt micro (useMicro tự dọn khi unmount).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, PhoneOff, RotateCcw, SkipForward, Volume2, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import NhanVat3D, { type CamXuc } from './goi/NhanVat3D';
import { play, stopAudio, AI_TIMEOUT, type Clip } from './audio';
import { blobToWav16k } from './wav';
import { useMicro } from './useMicro';
import { tepTinh } from './moiTruong';
import { Inline } from './Blocks';
import s from './course.module.css';

export type CauMau = { text: string; ipa?: string };
type Cham = { tong: number; tu: { tu: string; diem: number; loi: string }[] };
type Luot = { ai: boolean; text: string; cham?: Cham | null };
type Pha = 'cho' | 'mo' | 'giasu' | 'nghe' | 'cham' | 'nghi' | 'loi';
type Giong = 'mac-dinh' | 'khanh-linh' | 'cuong';

const GHI_TOI_DA = 12_000;

/** "[en]x[/en]" → phần tử có tô đậm cho phần tiếng Anh. */
function LoiNoi({ text }: { text: string }) {
  const parts = text.split(/\[en\]([\s\S]*?)\[\/en\]/gi);
  return <>{parts.map((p, i) => (i % 2 ? <b key={i} className={s.goiEn}>{p}</b> : <span key={i}>{p}</span>))}</>;
}

export default function GoiGiaSu({ danhSach, chuDe, onClose, ngonNgu = 'en', stage }: { danhSach: CauMau[]; chuDe: string; onClose: () => void; ngonNgu?: 'en' | 'ja' | 'zh'; /** Khoá đang học — luyện ≥ 3 lượt thì tính một ngày học (chuỗi ngày). */ stage?: string }) {
  /** Giọng đọc câu mẫu theo thứ tiếng của khoá. */
  const giongMau = ngonNgu === 'ja' ? 'ja-nu' : ngonNgu === 'zh' ? 'zh-nu' : 'uk-nu';
  const [pha, setPha] = useState<Pha>('cho');
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

  useEffect(() => { cuon.current?.scrollTo({ top: cuon.current.scrollHeight, behavior: 'smooth' }); }, [luot]);
  // Đặt lại cờ khi gắn: StrictMode (dev) chạy gắn → dọn → gắn lại; không đặt lại
  // thì cờ "đã đóng" của lần dọn giả kẹt true và cuộc gọi đứng ở "Đang kết nối".
  const soLuotCham = useRef(0);
  useEffect(() => {
    st.current.dong = false;
    return () => {
      st.current.dong = true;
      stopAudio();
      // Luyện nói cũng là học: ≥ 3 lượt được chấm ⇒ ghi "hôm nay có học" cho chuỗi ngày (05/10/2026).
      if (stage && soLuotCham.current >= 3) void api.post('/ielts/chuoi/ghi', { stage }).catch(() => undefined);
    };
  }, [stage]);
  // Esc để kết thúc.
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const trangThai = () => {
    const x = st.current;
    return JSON.stringify({
      danhSach, viTri: x.viTri, lanThu: x.lanThu, chuDe, giong, diemTruoc: x.diemTruoc, ngonNgu,
      che: x.che, mauGoc: x.mauGoc, mauTu: x.mauTu, lanTu: x.lanTu, thongKe: x.thongKe, daNhac: x.daNhac,
    });
  };

  /* Mức micro đi thẳng vào nhân vật + vòng sóng của nút, KHÔNG qua state: trước 04/10
     mỗi lần âm lượng đổi là vẽ lại cả hộp thoại (đè lên nền kính mờ) ⇒ màn hình nhấp nháy. */
  const mucRef = useRef(0);
  const vongRef = useRef<HTMLDivElement>(null);
  const mic = useMicro({
    toiDaMs: GHI_TOI_DA,
    tuDung: { imMs: 1500 },
    // Suốt lượt không có tiếng nói (bấm nhầm, chưa kịp nói) ⇒ KHÔNG gửi đi chấm, gia sư nói "chưa nghe thấy".
    onXong: (blob, { coTieng }) => { void guiLuot(blob, !coTieng); },
    onMuc: (m) => { mucRef.current = m; vongRef.current?.style.setProperty('--muc', m.toFixed(3)); },
  });
  /** Phản ứng tức thời của CuongMini (chào, mừng điểm cao, động viên) — giữ ~2,4 giây rồi về theo pha. */
  const [phanUng, setPhanUng] = useState<CamXuc | null>(null);
  const henPU = useRef<ReturnType<typeof setTimeout>>();
  const phanUngNgan = useCallback((c: CamXuc, ms = 2400) => {
    setPhanUng(c);
    clearTimeout(henPU.current);
    henPU.current = setTimeout(() => setPhanUng(null), ms);
  }, []);
  useEffect(() => () => clearTimeout(henPU.current), []);
  const ngheTu = useRef(0);
  const batNghe = useCallback(() => {
    if (st.current.dong) return;
    ngheTu.current = Date.now();
    setPha('nghe');
    void mic.batDau();
  }, [mic]);

  /** Gia sư nói (tệp mp3) rồi tới câu mẫu (giọng Anh của khoá), xong thì tự nghe. */
  const giaSuNoi = useCallback((audio: string | string[] | null | undefined, text: string, cauMau: CauMau | null, docMau: boolean, tocMau?: number) => {
    if (st.current.dong) return;
    const clips: Clip[] = [];
    // Giọng máy nhà trả NHIỀU tệp (đoạn Việt F5 + đoạn Anh) — phát liền nhau, không ngắt.
    const tep = (Array.isArray(audio) ? audio : audio ? [audio] : []).filter(Boolean);
    if (tep.length) for (const u of tep) clips.push({ text: '', sfx: u });
    else clips.push({ text: text.replace(/\[\/?en\]/gi, ''), voice: giongMau }); // không có giọng gia sư: đọc tạm
    // Luyện riêng một từ: đọc THẬT CHẬM trước (nghe rõ đuôi, hơi), rồi tốc độ thường.
    if (docMau && cauMau && tocMau) clips.push({ text: '', pauseMs: 300 }, { text: cauMau.text, voice: giongMau, toc: tocMau }, { text: '', pauseMs: 550 }, { text: cauMau.text, voice: giongMau, toc: 0.9 });
    else if (docMau && cauMau) clips.push({ text: '', pauseMs: 280 }, { text: cauMau.text, voice: giongMau, toc: 0.9 });
    setPha('giasu');
    play(clips, () => { if (!st.current.dong) batNghe(); });
  }, [batNghe]);

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
  }, []);

  async function guiLuot(blob: Blob, imLang = false) {
    if (st.current.dong) return;
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
      if (d.cham) soLuotCham.current += 1;
      if (d.cham) {
        // Đạt 3 câu liền ⇒ mắt trái tim; từ 95 ⇒ ngạc nhiên thích thú; đạt ⇒ vui; khá ⇒ gật gù; thấp ⇒ động viên.
        const tong = d.cham.tong;
        st.current.datLien = tong >= 85 ? st.current.datLien + 1 : 0;
        phanUngNgan(st.current.datLien >= 3 && tong >= 85 ? 'tim' : tong >= 95 ? 'ngac' : tong >= 85 ? 'vui' : tong >= 60 ? 'kha' : 'buon', 2800);
      }
      if (d.loai === 'hoi') {
        // Đang hỏi: nói câu đệm ngay, gọi AI (~10 giây) song song.
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

  const batDau = async () => {
    setLoi('');
    setPha('mo');
    play({ text: '', sfx: tepTinh('/audio/im-lang.mp3') }); // mở khoá âm thanh ngay trong cú bấm (Safari)
    try {
      const r = await api.post('/ielts/ai/goi-gia-su', (() => { const fd = new FormData(); fd.append('trangThai', trangThai()); return fd; })(), { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
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

  /** Nút lớn: bắt đầu / cắt lời gia sư để đọc ngay / xong đọc. */
  const nutLon = () => {
    if (pha === 'cho' && !luot.length) { void batDau(); return; }
    // Bấm đúng lúc gia sư vừa nói xong (micro vừa tự bật) thì cú bấm đó là để CẮT LỜI,
    // không phải để dừng ghi — bỏ qua "Xong" trong 0,8 giây đầu.
    if (pha === 'nghe') { if (Date.now() - ngheTu.current > 800) mic.dung(); return; }
    if (pha === 'giasu' || pha === 'cho' || pha === 'loi') { stopAudio(); st.current.imLien = 0; setLoi(''); batNghe(); }
  };
  const ngheMau = () => { if (mau && pha !== 'nghe' && pha !== 'cham') { stopAudio(); play({ text: mau.text, voice: giongMau, toc: 0.85 }); } };
  const cauKhac = () => {
    if (!danhSach.length && !mau) return;
    stopAudio();
    const n = Math.max(1, danhSach.length || 12);
    st.current.viTri = (st.current.viTri + 1) % n;
    st.current.lanThu = 0;
    st.current.diemTruoc = null;
    st.current.che = 'cau'; st.current.mauGoc = null; st.current.mauTu = null; st.current.lanTu = 0;
    setLuyenTu(null);
    const m = danhSach.length ? danhSach[st.current.viTri] : null;
    if (m) { setMau(m); setPha('giasu'); play({ text: m.text, voice: giongMau, toc: 0.9 }, () => batNghe()); }
  };

  const NHAN: Record<Pha, string> = {
    cho: luot.length ? 'Bấm 🎙 để đọc' : 'Bấm để bắt đầu',
    mo: 'Đang gọi CuongMini…',
    giasu: 'CuongMini đang nói — chạm để ngắt lời và đọc ngay',
    nghe: 'Đang nghe — đọc to câu mẫu, nói xong máy tự chấm',
    cham: 'Đang chấm…',
    nghi: 'CuongMini đang suy nghĩ…',
    loi: 'Tạm dừng',
  };

  const THEO_PHA: Record<Pha, CamXuc> = { cho: 'cho', mo: 'nghi', giasu: 'noi', nghe: 'nghe', cham: 'nghi', nghi: 'nghi', loi: 'loi' };
  /* Để im ở trạng thái chờ ~25 giây ⇒ CuongMini ngủ gật (zzz); có gì thay đổi là tỉnh ngay. */
  const [buonNgu, setBuonNgu] = useState(false);
  useEffect(() => {
    setBuonNgu(false);
    if (pha !== 'cho') return;
    const t = setTimeout(() => setBuonNgu(true), 25_000);
    return () => clearTimeout(t);
  }, [pha, luot.length, mau]);
  const camXuc = phanUng ?? (buonNgu ? 'ngu' : THEO_PHA[pha]);
  const loiCuoi = [...luot].reverse().find((l) => l.ai)?.text ?? '';
  const iCham = luot.map((l, i) => (l.cham ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
  const chamCuoi = iCham >= 0 ? luot[iCham].cham! : null;
  const NHAN_NGAN: Record<Pha, string> = { cho: 'Sẵn sàng', mo: 'Đang kết nối', giasu: 'CuongMini đang nói', nghe: 'Đang nghe bạn', cham: 'Đang chấm', nghi: 'CuongMini đang nghĩ', loi: 'Tạm dừng' };

  return (
    <div className={s.goiSan} role="dialog" aria-modal="true" aria-label="Luyện phát âm cùng gia sư">
      <div className={s.goiTroi} aria-hidden="true"><i /><i /><i /></div>

      <header className={s.goiThanh} data-goi-thanh="">
        <div className={s.goiDanhTinh}>
          <span className={s.goiCham0} data-pha={pha} />
          <div>
            <div className={s.goiTen}>Luyện nói cùng CuongMini</div>
            <div className={s.goiPhu}>{NHAN_NGAN[pha]} · {chuDe}</div>
          </div>
        </div>
        <div className={s.goiThanhPhai}>
          <label className={s.goiChonGiong} title="Giọng CuongMini nói tiếng Việt (phần tiếng Anh luôn là giọng Anh chuẩn)">
            <Volume2 size={14} aria-hidden />
            <select value={giong} onChange={(e) => doiGiong(e.target.value as Giong)} aria-label="Giọng của CuongMini">
              <option value="mac-dinh">Giọng mặc định</option>
              <option value="khanh-linh">Khánh Linh (máy nhà)</option>
              <option value="cuong">Cường — giảng bài (máy nhà)</option>
            </select>
          </label>
          <button type="button" className={s.goiKetThuc} onClick={onClose}><PhoneOff size={16} /> Kết thúc</button>
        </div>
      </header>
      {giongLui && <div className={s.goiGiongLui}>Máy nhà đang bận — CuongMini tạm nói bằng giọng mặc định, tự đổi lại khi máy nhà sẵn sàng.</div>}

      <div className={s.goiKhung}>
        <section className={s.goiSanKhau}>
          <NhanVat3D camXuc={camXuc} mucRef={mucRef} />
          <div className={s.goiBongNoi} aria-live="polite">
            {loiCuoi ? <LoiNoi text={loiCuoi} /> : (
              <span>Chào bạn! Mình là <b>CuongMini</b>. Mình đọc mẫu, bạn đọc theo, mình chấm từng âm. Muốn hỏi gì cứ nói tiếng Việt nhé.</span>
            )}
          </div>
          {chamCuoi && (
            <div key={iCham} className={`${s.goiDiem} ${chamCuoi.tong >= 85 ? s.goiDiemTot : chamCuoi.tong >= 60 ? s.goiDiemKha : s.goiDiemYeu}`}>
              {chamCuoi.tong >= 85 && <Sparkles size={16} />}<b>{chamCuoi.tong}</b><span>điểm</span>
            </div>
          )}
        </section>

        <aside className={s.goiBen}>
          <div className={s.goiMau}>
            <div className={s.goiNhanMuc}>{luyenTu ? '🔍 Luyện riêng từ này — đạt rồi ghép lại cả câu' : 'Câu mẫu — đọc theo'}</div>
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
            ) : <div className={s.goiMauTrong}>Bấm nút micro để CuongMini bắt đầu buổi luyện.</div>}
          </div>

          <div className={s.goiLog} ref={cuon}>
            {!luot.length && (
              <div className={s.goiGoiY}>
                🎧 Đeo tai nghe sẽ rõ hơn và micro không thu lại tiếng CuongMini.<br />
                Mỗi lượt: nghe câu mẫu → đọc theo → nghe nhận xét. Nói xong im 1,5 giây là máy tự chấm.
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
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer className={s.goiDay}>
        <button type="button" className={s.goiPhuNut} onClick={ngheMau} disabled={!mau || pha === 'nghe' || pha === 'cham'}>
          <Volume2 size={18} /><span>Nghe mẫu</span>
        </button>
        <div className={s.goiGiua}>
          <div ref={vongRef} className={s.goiVong} data-pha={pha}>
            <button
              type="button"
              className={s.goiNut}
              data-pha={pha}
              onClick={nutLon}
              disabled={pha === 'mo' || pha === 'cham' || pha === 'nghi'}
              aria-label={NHAN[pha]}
            >
              {pha === 'nghe' ? <span className={s.goiSong}><i /><i /><i /><i /></span> : pha === 'loi' ? <RotateCcw size={28} /> : <Mic size={30} />}
            </button>
          </div>
          <div className={s.goiNhan}>{NHAN[pha]}</div>
        </div>
        <button type="button" className={s.goiPhuNut} onClick={cauKhac} disabled={danhSach.length < 2 || pha === 'nghe' || pha === 'cham'}>
          <SkipForward size={18} /><span>Câu khác</span>
        </button>
        {(loi || mic.loi) && <div className={s.goiLoi}>{loi || mic.loi}</div>}
      </footer>
    </div>
  );
}
