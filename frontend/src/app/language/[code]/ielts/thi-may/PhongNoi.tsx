'use client';

/**
 * 🎙️ PHÒNG THI SPEAKING với giám khảo AI (12/11/2026) — docs/ielts-lo-trinh-0-8.md mục 4.1 / 4.3.
 * ─────────────────────────────────────────────────────────────────────────
 * Giống thi nói thật 11–14′: giám khảo (giọng Anh, TTS sẵn có qua `play()` → /ielts/doc) chào, hỏi tên, Part 1
 * theo `de.part1`, Part 2 thẻ đề + 1′ chuẩn bị có ô ghi chú → nói tối đa 2′ (hết giờ thì dừng lịch sự) → câu
 * chốt, Part 3 theo `de.part3`. Mỗi câu: micro tự bật khi giám khảo hỏi xong, tự tắt khi im lặng (useMicro
 * `tuDung`), gửi NGAY lên máy chủ (Whisper ra chữ + Azure chấm phát âm) trong lúc đi tiếp câu sau. Im lặng 20″
 * ⇒ nhắc một lần rồi chuyển câu (mục 4.3). Xong cả bài ⇒ MỘT lượt model chấm FC·LR·GRA·P (chạy nền) ⇒ màn xem
 * lại: nghe lại từng câu (blob tại máy, không lên máy chủ), transcript, lỗi + câu sửa, cách nói band +1, câu mẫu.
 * Hợp đồng với trung tâm thi: `noiTypes.ts` (`onXong` gọi khi bấm "Hoàn tất" ở màn xem lại).
 *
 * Chế độ `luyen`: sau mỗi câu dừng lại — nghe lại, xem chữ, xem câu mẫu, nói lại; `thi`: chạy liền, không quay lại.
 * Trước khi vào: kiểm micro (thu 3″, phát lại, đo âm lượng). Chạy cả app desktop (getUserMedia của Electron).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DeNoi, MauNoi } from './de/types';
import type { BanGhiCau, KetQuaChamNoi, KetQuaNoi, PhongNoiProps } from './noiTypes';
import { noiCham, noiLuot } from './noiApi';
import { dinhDangGio } from './cham';
import { useMicro } from '@/components/sach-hoc/useMicro';
import { blobToWav16k } from '@/components/sach-hoc/wav';
import { play, stopAudio } from '@/components/sach-hoc/audio';
import { NutHienThi, useHienThi } from '../chung/MenuTren';
import s from '../chung/cdt.module.css';
import n from './noi.module.css';

const GIONG = 'uk-nu' as const;
/** Không có tiếng nói sau chừng này ⇒ nhắc/chuyển câu (mục 4.3). */
const IM_LANG_MS = 20_000;
const CHUAN_BI_GIAY = 60;

type Buoc =
  | { loai: 'noi'; text: string }
  | { loai: 'chuanBi'; text: string }
  | {
    loai: 'hoi'; part: 1 | 2 | 3; cau: string; dan?: string; toiDaGiay: number; imMs: number;
    /** false = câu xác nhận tên — ghi nhưng không gửi chấm. */
    cham: boolean;
    /** false = không đọc `cau` (Part 2: thẻ đề đưa tay, giám khảo chỉ đọc lời dẫn). */
    docCau?: boolean;
    nhan: string;
  };

const chuDeCua = (cueCard: string) => cueCard.split('\n')[0].replace(/^describe\s+/i, '').replace(/[.\s]+$/, '').trim() || 'this topic';

export function dungKichBan(de: DeNoi): Buoc[] {
  const b: Buoc[] = [];
  b.push({
    loai: 'hoi', part: 1, cau: 'Can you tell me your full name, please?', toiDaGiay: 12, imMs: 1800, cham: false, nhan: 'Giới thiệu',
    dan: 'Good morning. My name is Sonia, and I am your examiner today. This is the IELTS Speaking test.',
  });
  de.part1.forEach((cd, ti) => cd.cau.forEach((cau, ci) => b.push({
    loai: 'hoi', part: 1, cau, toiDaGiay: 40, imMs: 2500, cham: true, nhan: `Part 1 · ${cd.chuDe}`,
    dan: ci === 0
      ? (ti === 0 ? `Thank you. Now, in this first part, I would like to ask you some questions about yourself. Let's talk about ${cd.chuDe}.` : `Let's move on to talk about ${cd.chuDe}.`)
      : undefined,
  })));
  b.push({ loai: 'chuanBi', text: 'Now, I\'m going to give you a topic, and I\'d like you to talk about it for one to two minutes. Before you talk, you\'ll have one minute to think about what you\'re going to say. You can make some notes if you wish. Here\'s your topic.' });
  b.push({
    loai: 'hoi', part: 2, cau: de.part2.cueCard, toiDaGiay: 120, imMs: 5000, cham: true, docCau: false, nhan: 'Part 2 · Long turn',
    dan: 'All right? Remember, you have one to two minutes for this, so don\'t worry if I stop you. I\'ll tell you when the time is up. Can you start speaking now, please?',
  });
  de.part2.cauChot.slice(0, 2).forEach((cau, i) => b.push({ loai: 'hoi', part: 2, cau, toiDaGiay: 25, imMs: 2200, cham: true, nhan: 'Part 2 · Câu nối', dan: i === 0 ? 'Thank you.' : undefined }));
  de.part3.forEach((cd, ti) => cd.cau.forEach((cau, ci) => b.push({
    loai: 'hoi', part: 3, cau, toiDaGiay: 60, imMs: 3000, cham: true, nhan: `Part 3 · ${cd.chuDe}`,
    dan: ci === 0
      ? (ti === 0 ? `We've been talking about ${chuDeCua(de.part2.cueCard)}, and I'd like to discuss with you one or two more general questions related to this. Let's consider first of all ${cd.chuDe}.` : `Let's talk now about ${cd.chuDe}.`)
      : undefined,
  })));
  b.push({ loai: 'noi', text: 'Thank you very much. That is the end of the Speaking test.' });
  return b;
}

const NHAC: Record<1 | 2 | 3, string> = {
  1: 'Could you tell me a little about that?',
  2: 'Please go ahead — just talk about the topic on the card. You can start with who the person is.',
  3: 'What do you think? Take your time.',
};

/** Một câu đã ghi ở máy (kèm URL blob để nghe lại — không lên máy chủ). */
type CauDaGhi = BanGhiCau & { url: string | null; dangTai: boolean; loiTai?: string };

type Man = 'kiem' | 'thi' | 'cham' | 'kq';
type Pha = 'noi' | 'ghi' | 'chuanBi' | 'xemLai' | 'cho';

export default function PhongNoi({ de, cheDo, onXong }: PhongNoiProps) {
  const { tc, doi, thuocTinh } = useHienThi();
  const kichBan = useMemo(() => dungKichBan(de), [de]);
  const [man, setMan] = useState<Man>('kiem');
  const [i, setI] = useState(0);
  const [pha, setPha] = useState<Pha>('noi');
  const [loiNoi, setLoiNoi] = useState('');
  const [chuanBiCon, setChuanBiCon] = useState(CHUAN_BI_GIAY);
  const [ghiChu, setGhiChu] = useState('');
  const [daGhi, setDaGhi] = useState<Record<number, CauDaGhi>>({});
  const [imLangCau, setImLangCau] = useState(false);
  const [canhBao, setCanhBao] = useState<string | null>(null);
  const [batDauThi, setBatDauThi] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [mucHien, setMucHien] = useState(0);
  const [conGiay, setConGiay] = useState<number | null>(null);
  const [kq, setKq] = useState<KetQuaChamNoi | null>(null);
  const [loiCham, setLoiCham] = useState('');
  const [choGiay, setChoGiay] = useState(0);
  const [xemMau, setXemMau] = useState<Record<string, boolean>>({});
  // Kiểm micro
  const [kiem, setKiem] = useState<{ url: string | null; max: number; dang: boolean }>({ url: null, max: 0, dang: false });

  const iRef = useRef(i);
  iRef.current = i;
  const manRef = useRef(man);
  manRef.current = man;
  const daNhac = useRef(new Set<number>());
  const coTieng = useRef(false);
  const batDauGhiLuc = useRef(0);
  const mucCu = useRef(0);
  const mucMax = useRef(0);
  const taiDs = useRef(new Map<number, Promise<unknown>>());
  const daGhiRef = useRef(daGhi);
  daGhiRef.current = daGhi;
  const [thu, setThu] = useState<{ toiDaMs: number; imMs?: number }>({ toiDaMs: 3000 });
  const [canGhi, setCanGhi] = useState(false);
  const xuLyRef = useRef<(blob: Blob, coTieng: boolean) => void>(() => {});

  const mic = useMicro({
    toiDaMs: thu.toiDaMs,
    tuDung: thu.imMs ? { imMs: thu.imMs } : undefined,
    onMuc: (m) => {
      if (m > 0.12) coTieng.current = true;
      if (m > mucMax.current) mucMax.current = m;
      if (Math.abs(m - mucCu.current) > 0.04) { mucCu.current = m; setMucHien(m); }
    },
    onXong: (blob, info) => xuLyRef.current(blob, info.coTieng),
  });

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => () => { stopAudio(); }, []);
  // Dọn URL blob khi rời phòng.
  useEffect(() => () => { Object.values(daGhiRef.current).forEach((c) => { if (c.url) URL.revokeObjectURL(c.url); }); }, []);

  /* ── Bắt đầu ghi sau khi React đã nhận cấu hình mới (toiDaMs/imMs đọc lúc render) ── */
  useEffect(() => {
    if (!canGhi) return;
    setCanGhi(false);
    coTieng.current = false;
    batDauGhiLuc.current = Date.now();
    void mic.batDau();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGhi, thu]);

  const batDauGhi = useCallback((toiDaMs: number, imMs?: number) => {
    setThu({ toiDaMs, imMs });
    setPha('ghi');
    setCanGhi(true);
  }, []);

  /* ── Đồng hồ còn lại của câu đang ghi + chốt 20″ không có tiếng ── */
  useEffect(() => {
    if (mic.trangThai !== 'ghi') { setConGiay(null); return; }
    const t = setInterval(() => setConGiay(Math.max(0, Math.round((batDauGhiLuc.current + thu.toiDaMs - Date.now()) / 1000))), 250);
    const h = man === 'thi' ? setTimeout(() => { if (!coTieng.current) { mic.huy(); xuLyImLang(); } }, IM_LANG_MS) : undefined;
    return () => { clearInterval(t); if (h) clearTimeout(h); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mic.trangThai]);

  const tiep = useCallback(() => { setImLangCau(false); setI((x) => x + 1); }, []);

  /** Không có tiếng nói trong cả lượt (hoặc 20″ đầu). */
  const xuLyImLang = useCallback(() => {
    const idx = iRef.current;
    const b = kichBan[idx];
    if (!b || b.loai !== 'hoi') return;
    if (cheDo === 'thi') {
      if (!daNhac.current.has(idx)) {
        daNhac.current.add(idx);
        setPha('noi');
        setLoiNoi(NHAC[b.part]);
        void play({ text: NHAC[b.part], voice: GIONG }, () => { if (manRef.current === 'thi') batDauGhi(b.toiDaGiay * 1000, b.imMs); });
        return;
      }
      setDaGhi((d) => ({ ...d, [idx]: { part: b.part, cau: b.cau, transcript: '', giay: 0, phatAm: null, imLang: true, url: null, dangTai: false } }));
      tiep();
      return;
    }
    setImLangCau(true);
    setPha('xemLai');
  }, [kichBan, cheDo, batDauGhi, tiep]);

  xuLyRef.current = (blob, coTiengLuot) => {
    if (manRef.current === 'kiem') {
      const url = URL.createObjectURL(blob);
      setKiem((k) => ({ url, max: Math.max(k.max, mucMax.current), dang: false }));
      const a = new Audio(url);
      void a.play().catch(() => undefined);
      return;
    }
    if (!coTiengLuot && !coTieng.current) { xuLyImLang(); return; }
    const idx = iRef.current;
    const b = kichBan[idx];
    if (!b || b.loai !== 'hoi') return;
    const giay = Math.max(1, Math.round((Date.now() - batDauGhiLuc.current) / 1000));
    const cu = daGhiRef.current[idx];
    if (cu?.url) URL.revokeObjectURL(cu.url);
    const url = URL.createObjectURL(blob);
    setDaGhi((d) => ({ ...d, [idx]: { part: b.part, cau: b.cau, transcript: '', giay, phatAm: null, imLang: false, url, dangTai: b.cham } }));
    if (b.cham) {
      const p = blobToWav16k(blob)
        .then((wav) => noiLuot(wav, b.part, b.cau))
        .then((r) => {
          setDaGhi((d) => (d[idx] && d[idx].url === url
            ? { ...d, [idx]: { ...d[idx], transcript: r.transcript, phatAm: r.phatAm, imLang: r.imLang, giay: Math.round(r.giay) || giay, dangTai: false, loiTai: r.lyDo } }
            : d));
        })
        .catch((e: unknown) => {
          const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || (e as Error)?.message || 'lỗi mạng';
          setDaGhi((d) => (d[idx] ? { ...d, [idx]: { ...d[idx], dangTai: false, loiTai: msg } } : d));
        });
      taiDs.current.set(idx, p);
    }
    if (cheDo === 'thi') { setPha('cho'); setTimeout(tiep, 600); } else setPha('xemLai');
  };

  /* ── Chạy kịch bản ── */
  useEffect(() => {
    if (man !== 'thi') return;
    const b = kichBan[i];
    if (!b) { setKetThucLuc(Date.now()); setMan('cham'); return; }
    let huyBo = false;
    setImLangCau(false);
    if (b.loai === 'noi') {
      setPha('noi'); setLoiNoi(b.text);
      void play({ text: b.text, voice: GIONG }, () => { if (!huyBo) setI((x) => x + 1); });
    } else if (b.loai === 'chuanBi') {
      setPha('noi'); setLoiNoi(b.text); setGhiChu('');
      void play({ text: b.text, voice: GIONG }, () => { if (!huyBo) { setChuanBiCon(CHUAN_BI_GIAY); setPha('chuanBi'); } });
    } else {
      const loi = [b.dan, b.docCau === false ? undefined : b.cau].filter((x): x is string => !!x);
      setPha('noi'); setLoiNoi(loi.join(' '));
      void play(loi.map((text) => ({ text, voice: GIONG })), () => { if (!huyBo) batDauGhi(b.toiDaGiay * 1000, b.imMs); });
    }
    return () => { huyBo = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [man, i]);

  // Đếm ngược 1′ chuẩn bị Part 2.
  useEffect(() => {
    if (pha !== 'chuanBi') return;
    if (chuanBiCon <= 0) { setI((x) => x + 1); return; }
    const t = setTimeout(() => setChuanBiCon((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [pha, chuanBiCon]);

  // Cảnh báo giờ Part 2 (còn 30″).
  useEffect(() => {
    const b = kichBan[i];
    if (b?.loai === 'hoi' && b.part === 2 && b.toiDaGiay >= 100 && conGiay === 30) { setCanhBao('Còn 30 giây'); const t = setTimeout(() => setCanhBao(null), 4000); return () => clearTimeout(t); }
  }, [conGiay, i, kichBan]);

  /* ── Chấm cả bài ── */
  const banGhiChoCham = useCallback((): BanGhiCau[] => kichBan
    .map((b, idx) => ({ b, c: daGhiRef.current[idx] }))
    .filter(({ b, c }) => b.loai === 'hoi' && b.cham && c)
    .map(({ c }) => ({ part: c!.part, cau: c!.cau, transcript: c!.transcript, giay: c!.giay, phatAm: c!.phatAm, imLang: c!.imLang })), [kichBan]);

  const cham = useCallback(async () => {
    setLoiCham(''); setChoGiay(0);
    try {
      await Promise.allSettled([...taiDs.current.values()]);
      const banGhi = banGhiChoCham();
      if (!banGhi.length) { setLoiCham('Chưa có câu trả lời nào để chấm.'); return; }
      const r = await noiCham({ deId: de.id, cheDo, banGhi, giay: Math.round((Date.now() - batDauThi) / 1000) }, setChoGiay);
      if (!r.ketQua) {
        setLoiCham(r.lyDo === 'ai_unavailable' ? 'AI chấm đang tạm nghỉ — bản ghi và chữ vẫn ở đây, bạn bấm "Chấm lại" sau ít phút.'
          : r.lyDo === 'parse_failed' ? 'Máy chấm trả về không đọc được — bấm "Chấm lại".'
            : r.thongBao || 'Chấm không thành công — bấm "Chấm lại".');
        return;
      }
      setKq(r.ketQua);
      setMan('kq');
    } catch (e) {
      const r = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      setLoiCham(r?.data?.message || (r?.status === 429 ? 'Bạn đã hết lượt chấm Speaking hôm nay.' : 'Lỗi mạng khi chấm — bấm "Chấm lại".'));
    }
  }, [banGhiChoCham, de.id, cheDo, batDauThi]);

  useEffect(() => { if (man === 'cham') void cham(); }, [man, cham]);

  const hoanTat = () => {
    if (!kq) return;
    const ra: KetQuaNoi = { band: kq.band, tieuChi: kq.tieuChi, nhanXet: kq.nhanXet, banGhi: kq.banGhi.map((b) => ({ part: b.part, cau: b.cau, transcript: b.transcript })) };
    onXong(ra);
  };

  const mauCho = (part: 1 | 2 | 3, cau: string): MauNoi | undefined => de.mau.find((m) => m.part === part && m.cau === cau) ?? de.mau.find((m) => m.part === part);

  /* ── Thanh trên ── */
  const [ketThucLuc, setKetThucLuc] = useState(0);
  const daQua = batDauThi ? Math.round(((ketThucLuc || now) - batDauThi) / 1000) : 0;
  const soHoi = kichBan.filter((b) => b.loai === 'hoi' && b.cham).length;
  const daXong = Object.values(daGhi).length - (daGhi[0] ? 1 : 0);
  const b = kichBan[i];
  const partDang = b?.loai === 'hoi' ? b.part : b?.loai === 'chuanBi' ? 2 : null;
  const hienThe = partDang === 2 || b?.loai === 'chuanBi';

  const Tren = (
    <header className={s.thiTren}>
      <div>
        <div className={s.dongHo} role="timer">{man === 'kiem' ? '00:00:00' : dinhDangGio(daQua)} <span className={s.mo}>· {de.phut}′ ước tính</span></div>
        <div className={s.tenThi}>IELTS Speaking Test - {de.boDe} · {de.ten.replace(/^.*—\s*/, '')}</div>
        <div className={s.cheDoThi}>{cheDo === 'thi' ? 'Full Test · giám khảo AI' : 'Practice · nghe lại, nói lại từng câu'}</div>
      </div>
      <div className={s.thiDieuKhien}>
        <NutHienThi tc={tc} doi={doi} />
        {man === 'thi' && cheDo === 'luyen' && daXong > 0 && (
          <button type="button" className={s.nop} onClick={() => { stopAudio(); mic.huy(); setKetThucLuc(Date.now()); setMan('cham'); }}>Kết thúc & chấm</button>
        )}
      </div>
    </header>
  );

  /* ── Màn 1: kiểm micro + hướng dẫn ── */
  if (man === 'kiem') {
    const micOk = kiem.url && kiem.max >= 0.08;
    return (
      <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
        {Tren}
        <div className={n.sanKhau}>
          <div className={n.cotGiua}>
            <h2 className={s.tieuDeDoc} style={{ fontSize: 20 }}>Trước khi vào phòng thi Speaking</h2>
            <ol className={n.huongDan}>
              <li><b>Part 1 (4–5′)</b> — giám khảo hỏi về bạn: {de.part1.map((c) => c.chuDe).join(', ')}. Mỗi câu trả lời 20–40 giây.</li>
              <li><b>Part 2 (3–4′)</b> — nhận thẻ đề, <b>1 phút chuẩn bị</b> (có ô ghi chú), rồi nói <b>1–2 phút</b>; hết 2 phút giám khảo sẽ dừng bạn, sau đó hỏi 1 câu nối.</li>
              <li><b>Part 3 (4–5′)</b> — thảo luận sâu hơn, câu hỏi khó dần. Trả lời có lý do, ví dụ, so sánh.</li>
              <li>Micro <b>tự bật</b> khi giám khảo hỏi xong và <b>tự tắt</b> khi bạn im lặng vài giây — hoặc bấm nút micro để kết thúc câu trả lời. Im lặng 20 giây ⇒ giám khảo nhắc rồi chuyển câu.</li>
              <li>Chấm: AI chấm FC · LR · GRA · P theo band descriptors (P kết hợp điểm phát âm Azure). Kết quả là <b>ước tính</b>.</li>
            </ol>
            <div className={n.khuMic}>
              <button
                type="button" className={`${n.mic} ${mic.trangThai === 'ghi' ? n.micGhi : mic.trangThai === 'mo' ? n.micMo : ''}`}
                style={{ ['--muc' as string]: mucHien } as React.CSSProperties} aria-label="Thu thử 3 giây"
                disabled={mic.trangThai !== 'nghi'}
                onClick={() => { setKiem({ url: null, max: 0, dang: true }); mucMax.current = 0; setThu({ toiDaMs: 3000 }); setCanGhi(true); }}
              >🎙</button>
              <div className={n.thanhMuc}><i style={{ width: `${Math.round(mucHien * 100)}%` }} /></div>
              <div className={n.trangThaiMic}>
                {mic.loi ? <span className={s.loi}>{mic.loi}</span>
                  : mic.trangThai === 'ghi' ? 'Đang thu 3 giây — hãy nói “My name is …”'
                    : kiem.url ? (micOk ? `Micro tốt (âm lượng ${Math.round(kiem.max * 100)}%). Đang phát lại…` : `Âm lượng thấp (${Math.round(kiem.max * 100)}%) — lại gần micro hơn hoặc thu lại.`)
                      : 'Bấm micro để thu thử 3 giây rồi nghe lại'}
              </div>
              {kiem.url && <audio controls src={kiem.url} style={{ height: 36 }} />}
            </div>
            <div className={n.hangNut}>
              <button type="button" className={s.batDau} disabled={!kiem.url || mic.trangThai !== 'nghi'} onClick={() => { setBatDauThi(Date.now()); setI(0); setMan('thi'); }}>
                {micOk ? 'Vào phòng thi' : kiem.url ? 'Vào phòng thi dù âm lượng thấp' : 'Thu thử trước khi vào'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Màn 3: đang chấm ── */
  if (man === 'cham') {
    return (
      <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
        {Tren}
        <div className={n.sanKhau}>
          <div className={n.cham}>
            {!loiCham && <div className={n.xoay} aria-hidden />}
            <div style={{ fontSize: 17, fontWeight: 600 }}>{loiCham ? 'Chưa chấm được' : 'Giám khảo đang chấm bài của bạn…'}</div>
            <div className={s.mo}>
              {loiCham || `${banGhiChoCham().length} câu trả lời · FC · LR · GRA · P theo band descriptors${choGiay ? ` · đã chờ ${choGiay}s` : ''}. Thường 20–60 giây.`}
            </div>
            {loiCham && <button type="button" className={s.batDau} onClick={() => void cham()}>Chấm lại</button>}
          </div>
        </div>
      </div>
    );
  }

  /* ── Màn 4: xem lại ── */
  if (man === 'kq' && kq) {
    const TEN = { fc: 'Fluency & Coherence', lr: 'Lexical Resource', gra: 'Grammatical Range & Accuracy', p: 'Pronunciation' } as const;
    const cauXem = kichBan.map((bb, idx) => ({ bb, c: daGhi[idx], idx })).filter(({ bb, c }) => bb.loai === 'hoi' && bb.cham && c);
    return (
      <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
        {Tren}
        <div className={n.sanKhau}>
          <div className={n.cotGiua}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div><span className={s.mo}>Band Speaking (ước tính)</span><div className={n.bandLon}>{kq.band.toFixed(1)}</div></div>
              <div className={s.tieuChi} style={{ flex: 1, margin: 0 }}>
                {(['fc', 'lr', 'gra', 'p'] as const).map((k) => (
                  <div key={k}><span className={s.mo}>{TEN[k]}</span><br /><b>{kq.tieuChi[k].toFixed(1)}</b><div style={{ marginTop: 4 }}>{kq.nhanXetTieuChi[k]}</div></div>
                ))}
              </div>
            </div>
            <p className={s.ghiChuNho}>
              ⚠️ Band do AI ước lượng từ bản phiên âm{kq.pNguon === 'azure+ai' ? ' + điểm phát âm Azure' : kq.pNguon === 'ai' ? ' (không có điểm Azure — P chỉ ước lượng từ chữ)' : ''}; không phải điểm thi thật. Band tổng = trung bình 4 tiêu chí, làm tròn xuống .5.
            </p>
            <div className={s.vanBan} style={{ fontFamily: 'inherit' }}>{kq.nhanXet}</div>
            {kq.loi.length > 0 && (
              <section>
                <h3 className={s.tieuDeDoc}>Lỗi cần sửa ({kq.loi.length})</h3>
                <ul className={s.loiViet} style={{ paddingLeft: 18 }}>
                  {kq.loi.map((l, k) => <li key={k}><span className={s.mo}>P{l.part}</span> <span className={s.gach}>{l.goc}</span> → <span className={s.sua}>{l.sua}</span><br /><span className={s.mo}>{l.vi}</span></li>)}
                </ul>
              </section>
            )}
            {kq.noiLai.length > 0 && (
              <section>
                <h3 className={s.tieuDeDoc}>Nói tự nhiên hơn (band +1)</h3>
                {kq.noiLai.map((l, k) => (
                  <div key={k} className={n.cauXemLai}>
                    <div className={s.mo}>Part {l.part} · {l.cau}</div>
                    {l.goc && <div style={{ marginTop: 4 }}><span className={s.mo}>Bạn nói:</span> <i>{l.goc}</i></div>}
                    <div style={{ marginTop: 4 }}><span className={s.sua}>Nói thế này:</span> {l.tot}</div>
                  </div>
                ))}
              </section>
            )}
            <section>
              <h3 className={s.tieuDeDoc}>Nghe lại từng câu ({cauXem.length})</h3>
              {cauXem.map(({ bb, c, idx }) => {
                const h = bb as Extract<Buoc, { loai: 'hoi' }>;
                const m = mauCho(h.part, h.cau);
                const key = `${idx}`;
                return (
                  <div key={idx} className={n.cauXemLai}>
                    <div><span className={n.nhanPart}>Part {h.part}</span> <b>{h.cau.split('\n')[0]}</b></div>
                    {c!.url ? <audio controls src={c!.url} preload="metadata" /> : <div className={s.mo} style={{ margin: '6px 0' }}>(không có bản ghi — im lặng)</div>}
                    <div><span className={s.mo}>Bạn nói ({c!.giay}s{c!.phatAm ? ` · phát âm Azure ${c!.phatAm.tong}/100` : ''}):</span> {c!.transcript || <i className={s.mo}>(im lặng / không nghe rõ)</i>}</div>
                    {m && (
                      <>
                        <button type="button" className={s.nutNho} onClick={() => setXemMau((x) => ({ ...x, [key]: !x[key] }))}>{xemMau[key] ? 'Ẩn câu mẫu' : `Xem câu mẫu band ${m.band}`}</button>
                        {xemMau[key] && (
                          <div className={n.mau}>
                            <div>{m.s}</div>
                            <ul>{m.phanTich.map((p, k) => <li key={k}>{p}</li>)}</ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </section>
            <div className={n.hangNut} style={{ justifyContent: 'flex-end' }}>
              <button type="button" className={s.batDau} onClick={hoanTat}>Hoàn tất</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Màn 2: đang thi ── */
  const cauDang = b?.loai === 'hoi' ? daGhi[i] : undefined;
  const mauDang = b?.loai === 'hoi' ? mauCho(b.part, b.cau) : undefined;
  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      {Tren}
      {canhBao && <div className={s.canhBao} role="alert">⏰ {canhBao}</div>}
      <div className={n.sanKhau}>
        <div className={n.cotGiua}>
          {b?.loai === 'hoi' && <span className={n.nhanPart}>{b.nhan}</span>}
          {b?.loai === 'chuanBi' && <span className={n.nhanPart}>Part 2 · Chuẩn bị</span>}
          <div className={n.hangGiamKhao}>
            <div className={`${n.giamKhao} ${pha === 'noi' ? n.giamKhaoNoi : ''}`} aria-label="Giám khảo">AI</div>
            <div className={n.loiGiamKhao}>
              {loiNoi}
              {pha === 'noi' && <small>Giám khảo đang nói…</small>}
              {pha === 'ghi' && <small>Đang nghe bạn — nói xong cứ im lặng vài giây, micro sẽ tự tắt.</small>}
            </div>
          </div>

          {hienThe && (
            <div className={n.theDe}>
              <h3>{de.part2.cueCard.split('\n')[0]}</h3>
              <div>You should say:</div>
              <ul>{de.part2.goiY.map((g, k) => <li key={k}>{g}</li>)}</ul>
            </div>
          )}

          {pha === 'chuanBi' && (
            <>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className={n.demNguoc}>{chuanBiCon}s</div>
                <div className={s.mo}>Một phút chuẩn bị — ghi vài từ khoá vào ô bên dưới (chỉ bạn thấy, không chấm).</div>
              </div>
              <textarea className={n.ghiChu} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="who · how I know · what they did · why I admire…" aria-label="Ghi chú chuẩn bị" />
              <div className={n.hangNut}><button type="button" className={s.nutPhu} onClick={() => setChuanBiCon(0)}>Tôi sẵn sàng, nói luôn</button></div>
            </>
          )}

          {hienThe && pha !== 'chuanBi' && ghiChu && <div className={s.vanBan} style={{ fontFamily: 'inherit', fontSize: 14 }}><span className={s.mo}>Ghi chú của bạn:</span> {ghiChu}</div>}

          {(pha === 'ghi' || pha === 'noi' || pha === 'cho') && b?.loai === 'hoi' && (
            <div className={n.khuMic}>
              <button
                type="button" className={`${n.mic} ${mic.trangThai === 'ghi' ? n.micGhi : mic.trangThai === 'mo' ? n.micMo : ''}`}
                style={{ ['--muc' as string]: mucHien } as React.CSSProperties} aria-label={mic.trangThai === 'ghi' ? 'Kết thúc câu trả lời' : 'Micro'}
                disabled={mic.trangThai !== 'ghi'} onClick={() => mic.dung()}
              >🎙</button>
              <div className={n.thanhMuc}><i style={{ width: `${Math.round(mucHien * 100)}%` }} /></div>
              <div className={n.trangThaiMic}>
                {mic.loi ? <span className={s.loi}>{mic.loi}</span>
                  : mic.trangThai === 'ghi' ? `Đang ghi · còn ${conGiay ?? '…'}s · bấm micro khi nói xong`
                    : mic.trangThai === 'mo' ? 'Đang mở micro…' : pha === 'cho' ? 'Đã ghi — câu tiếp theo…' : 'Micro sẽ tự bật khi giám khảo hỏi xong'}
              </div>
            </div>
          )}

          {pha === 'xemLai' && b?.loai === 'hoi' && (
            <>
              {imLangCau ? (
                <div className={n.bongNoi}><i>Chưa nghe thấy bạn nói gì.</i><small>Lại gần micro, nói to rõ rồi thử lại — hoặc bỏ qua câu này.</small></div>
              ) : (
                <div className={n.bongNoi}>
                  {cauDang?.dangTai ? <i>Đang nghe lại và chấm phát âm…</i> : cauDang?.transcript ? cauDang.transcript : <i>(không nghe rõ)</i>}
                  <small>
                    {cauDang?.giay ? `${cauDang.giay}s` : ''}{cauDang?.phatAm ? ` · phát âm Azure ${cauDang.phatAm.tong}/100 (chính xác ${cauDang.phatAm.chinhXac}, trôi chảy ${cauDang.phatAm.troiChay})` : ''}{cauDang?.loiTai ? ` · ${cauDang.loiTai}` : ''}
                  </small>
                  {cauDang?.url && <audio controls src={cauDang.url} preload="metadata" style={{ width: '100%', height: 36, marginTop: 8 }} />}
                </div>
              )}
              {mauDang && b.cham && (
                <div>
                  <button type="button" className={s.nutNho} onClick={() => setXemMau((x) => ({ ...x, [`l${i}`]: !x[`l${i}`] }))}>{xemMau[`l${i}`] ? 'Ẩn câu mẫu' : `Xem câu mẫu band ${mauDang.band}`}</button>
                  {xemMau[`l${i}`] && <div className={n.mau}><div>{mauDang.s}</div><ul>{mauDang.phanTich.map((p, k) => <li key={k}>{p}</li>)}</ul></div>}
                </div>
              )}
              <div className={n.hangNut}>
                <button type="button" className={s.nutPhu} onClick={() => { setImLangCau(false); batDauGhi(b.toiDaGiay * 1000, b.imMs); }}>🎙 Nói lại</button>
                <button type="button" className={s.nutPhu} onClick={() => { const loi = [b.dan, b.docCau === false ? undefined : b.cau].filter((x): x is string => !!x); void play(loi.map((text) => ({ text, voice: GIONG }))); }}>🔊 Nghe lại câu hỏi</button>
                <button type="button" className={s.batDau} style={{ minWidth: 140 }} onClick={() => {
                  if (imLangCau && !daGhi[i]) setDaGhi((d) => ({ ...d, [i]: { part: b.part, cau: b.cau, transcript: '', giay: 0, phatAm: null, imLang: true, url: null, dangTai: false } }));
                  tiep();
                }}>{imLangCau ? 'Bỏ qua câu này' : 'Câu tiếp theo'}</button>
              </div>
            </>
          )}
        </div>
      </div>
      <footer className={s.thiDuoi}>
        <span className={s.phanNav}><span className={s.phanTen}>{partDang ? `Part ${partDang}` : 'Speaking'}</span><span className={s.mo}>{daXong}/{soHoi} câu đã trả lời</span></span>
        <div className={n.buocDs} aria-hidden>
          {kichBan.map((bb, idx) => bb.loai === 'hoi' && bb.cham ? <span key={idx} className={`${n.buoc} ${daGhi[idx] ? n.buocXong : ''} ${idx === i ? n.buocDang : ''}`} /> : null)}
        </div>
        <div className={s.duoiPhai}><span className={s.mo}>{cheDo === 'thi' ? 'Không quay lại câu trước' : 'Chế độ luyện'}</span></div>
      </footer>
    </div>
  );
}
