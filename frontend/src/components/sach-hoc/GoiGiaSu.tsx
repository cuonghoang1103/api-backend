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
import { Mic, Square, PhoneOff, RotateCcw, SkipForward, Volume2 } from 'lucide-react';
import api from '@/lib/api';
import RobotAI from '@/components/academy/RobotAI';
import { play, stopAudio, AI_TIMEOUT, type Clip } from './audio';
import { blobToWav16k } from './wav';
import { useMicro } from './useMicro';
import { tepTinh } from './moiTruong';
import s from './course.module.css';

export type CauMau = { text: string; ipa?: string };
type Cham = { tong: number; tu: { tu: string; diem: number; loi: string }[] };
type Luot = { ai: boolean; text: string; cham?: Cham | null };
type Pha = 'cho' | 'mo' | 'giasu' | 'nghe' | 'cham' | 'nghi' | 'loi';

const GHI_TOI_DA = 12_000;

/** "[en]x[/en]" → phần tử có tô đậm cho phần tiếng Anh. */
function LoiNoi({ text }: { text: string }) {
  const parts = text.split(/\[en\]([\s\S]*?)\[\/en\]/gi);
  return <>{parts.map((p, i) => (i % 2 ? <b key={i} className={s.goiEn}>{p}</b> : <span key={i}>{p}</span>))}</>;
}

export default function GoiGiaSu({ danhSach, chuDe, onClose }: { danhSach: CauMau[]; chuDe: string; onClose: () => void }) {
  const [pha, setPha] = useState<Pha>('cho');
  const [mau, setMau] = useState<CauMau | null>(null);
  const [luot, setLuot] = useState<Luot[]>([]);
  const [loi, setLoi] = useState('');
  const st = useRef({ viTri: 0, lanThu: 0, imLien: 0, dong: false });
  const cuon = useRef<HTMLDivElement>(null);

  useEffect(() => { cuon.current?.scrollTo({ top: cuon.current.scrollHeight, behavior: 'smooth' }); }, [luot]);
  // Đặt lại cờ khi gắn: StrictMode (dev) chạy gắn → dọn → gắn lại; không đặt lại
  // thì cờ "đã đóng" của lần dọn giả kẹt true và cuộc gọi đứng ở "Đang kết nối".
  useEffect(() => { st.current.dong = false; return () => { st.current.dong = true; stopAudio(); }; }, []);
  // Esc để kết thúc.
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const trangThai = () => JSON.stringify({ danhSach, viTri: st.current.viTri, lanThu: st.current.lanThu, chuDe });

  const mic = useMicro({
    toiDaMs: GHI_TOI_DA,
    tuDung: { imMs: 1500 },
    onXong: (blob) => { void guiLuot(blob); },
  });
  const ngheTu = useRef(0);
  const batNghe = useCallback(() => {
    if (st.current.dong) return;
    ngheTu.current = Date.now();
    setPha('nghe');
    void mic.batDau();
  }, [mic]);

  /** Gia sư nói (tệp mp3) rồi tới câu mẫu (giọng Anh của khoá), xong thì tự nghe. */
  const giaSuNoi = useCallback((audioUrl: string | null | undefined, text: string, cauMau: CauMau | null, docMau: boolean) => {
    if (st.current.dong) return;
    const clips: Clip[] = [];
    if (audioUrl) clips.push({ text: '', sfx: audioUrl });
    else clips.push({ text: text.replace(/\[\/?en\]/gi, ''), voice: 'uk-nu' }); // không có giọng gia sư: đọc tạm
    if (docMau && cauMau) clips.push({ text: cauMau.text, voice: 'uk-nu', toc: 0.9 });
    setPha('giasu');
    play(clips, () => { if (!st.current.dong) batNghe(); }, { gapMs: 250 });
  }, [batNghe]);

  const nhan = useCallback((d: { lyDo?: string; noi?: string; audioUrl?: string | null; mau?: CauMau; viTri?: number; lanThu?: number; cham?: Cham | null; nghe?: string; doiCau?: boolean; loai?: string }) => {
    if (d.lyDo === 'het_luot_ngay') { setLoi('Hôm nay bạn đã luyện hết số lượt — mai luyện tiếp nhé.'); setPha('loi'); return; }
    if (typeof d.viTri === 'number') st.current.viTri = d.viTri;
    if (typeof d.lanThu === 'number') st.current.lanThu = d.lanThu;
    if (d.mau) setMau(d.mau);
    return d;
  }, []);

  async function guiLuot(blob: Blob) {
    if (st.current.dong) return;
    const mauDaDoc = mau; // câu vừa đọc — máy chủ có thể trả câu mẫu MỚI
    setPha('cham');
    try {
      const fd = new FormData();
      fd.append('audio', await blobToWav16k(blob), 'luot.wav');
      fd.append('trangThai', trangThai());
      const r = await api.post('/ielts/ai/goi-gia-su', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
      const d = nhan(r.data?.data ?? {});
      if (!d || st.current.dong) return;
      const ngheDuoc = (d.nghe ?? '').trim();
      if (ngheDuoc || d.cham) setLuot((x) => [...x, { ai: false, text: ngheDuoc || mauDaDoc?.text || '…', cham: d.cham ?? null }]);
      if (d.loai === 'hoi') {
        // Đang hỏi: nói câu đệm ngay, gọi AI (~10 giây) song song.
        st.current.imLien = 0;
        setLuot((x) => [...x, { ai: true, text: d.noi ?? '' }]);
        setPha('nghi');
        const traLoi = api.post('/ielts/ai/goi-gia-su/hoi', { cauHoi: ngheDuoc, mau: d.mau?.text, chuDe }, AI_TIMEOUT);
        if (d.audioUrl) play({ text: '', sfx: d.audioUrl }, () => { /* chờ câu trả lời */ });
        const t = (await traLoi).data?.data as { noi?: string; audioUrl?: string | null; lyDo?: string };
        if (st.current.dong) return;
        if (!t?.noi) { setLoi('Gia sư chưa trả lời được, bạn đọc tiếp câu mẫu nhé.'); giaSuNoi(null, '', d.mau ?? null, true); return; }
        setLuot((x) => [...x, { ai: true, text: t.noi! }]);
        giaSuNoi(t.audioUrl, t.noi, d.mau ?? null, true);
        return;
      }
      if (!d.cham) {
        st.current.imLien += 1;
        if (st.current.imLien >= 2) { setPha('cho'); setLoi('Mình chưa nghe thấy bạn. Bấm 🎙 khi sẵn sàng đọc nhé.'); return; }
      } else st.current.imLien = 0;
      setLoi('');
      setLuot((x) => [...x, { ai: true, text: d.noi ?? '' }]);
      // Đổi câu hay đọc lại: lượt nào cũng phát lại câu mẫu để người học nghe trước khi đọc.
      giaSuNoi(d.audioUrl, d.noi ?? '', d.mau ?? null, true);
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
      giaSuNoi(d.audioUrl, d.noi ?? '', d.mau ?? null, true);
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
  const ngheMau = () => { if (mau && pha !== 'nghe' && pha !== 'cham') { stopAudio(); play({ text: mau.text, voice: 'uk-nu', toc: 0.85 }); } };
  const cauKhac = () => {
    if (!danhSach.length && !mau) return;
    stopAudio();
    const n = Math.max(1, danhSach.length || 12);
    st.current.viTri = (st.current.viTri + 1) % n;
    st.current.lanThu = 0;
    const m = danhSach.length ? danhSach[st.current.viTri] : null;
    if (m) { setMau(m); setPha('giasu'); play({ text: m.text, voice: 'uk-nu', toc: 0.9 }, () => batNghe()); }
  };

  const NHAN: Record<Pha, string> = {
    cho: luot.length ? 'Bấm 🎙 để đọc' : 'Bấm để bắt đầu',
    mo: 'Đang kết nối gia sư…',
    giasu: 'Gia sư đang nói — chạm để ngắt và đọc ngay',
    nghe: 'Đang nghe — đọc to câu mẫu, nói xong máy tự chấm',
    cham: 'Đang chấm…',
    nghi: 'Gia sư đang suy nghĩ…',
    loi: 'Tạm dừng',
  };

  return (
    <div className={s.goiNen} role="dialog" aria-modal="true" aria-label="Luyện phát âm cùng gia sư">
      <div className={s.goiHop}>
        <div className={s.goiDau}>
          <div>
            <div className={s.goiTen}>📞 Luyện phát âm cùng gia sư</div>
            <div className={s.quizSub}>Gia sư nói tiếng Việt, chấm từng âm bạn đọc. Muốn hỏi thì cứ nói bằng tiếng Việt.</div>
          </div>
          <button type="button" className={s.goiKetThuc} onClick={onClose}><PhoneOff size={16} /> Kết thúc</button>
        </div>

        <div className={s.goiLog} ref={cuon}>
          {!luot.length && (
            <div className={s.quizSub} style={{ textAlign: 'center', padding: '24px 8px' }}>
              Đeo tai nghe sẽ rõ hơn và micro không thu lại tiếng gia sư. Mỗi lượt: nghe câu mẫu → đọc theo → nghe nhận xét.
              <br />Máy chấm khá dễ với lỗi nhỏ — đọc sai rõ thì bắt được, sai tinh tế có thể vẫn được điểm cao.
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

        {mau && (
          <div className={s.goiMau}>
            <div className={s.quizSub}>Câu mẫu — đọc theo:</div>
            <div className={s.goiMauChu}>{mau.text}</div>
            {mau.ipa && <div className={s.quizSub}>/{mau.ipa}/</div>}
            <div className={s.paBtns} style={{ marginTop: 8, justifyContent: 'center' }}>
              <button type="button" className={s.btnGhost} onClick={ngheMau}><Volume2 size={14} /> Nghe mẫu</button>
              {danhSach.length > 1 && <button type="button" className={s.btnGhost} onClick={cauKhac}><SkipForward size={14} /> Câu khác</button>}
            </div>
          </div>
        )}

        <div className={s.goiDieuKhien}>
          <button
            type="button"
            className={`${s.goiNut} ${pha === 'nghe' ? s.goiNutNghe : pha === 'giasu' ? s.goiNutNoi : ''}`}
            onClick={nutLon}
            disabled={pha === 'mo' || pha === 'cham' || pha === 'nghi'}
            aria-label={NHAN[pha]}
            style={pha === 'nghe' ? { boxShadow: `0 0 0 ${4 + Math.round(mic.muc * 18)}px rgba(225, 29, 72, 0.25)` } : undefined}
          >
            {pha === 'nghe' ? <Square size={26} /> : pha === 'giasu' ? <RobotAI size={44} /> : pha === 'cho' && luot.length ? <Mic size={30} /> : pha === 'loi' ? <RotateCcw size={26} /> : <RobotAI size={44} />}
          </button>
          <div className={s.goiNhan}>{NHAN[pha]}</div>
          {(loi || mic.loi) && <div className={`${s.feedback} ${s.bad}`}>{loi || mic.loi}</div>}
        </div>
      </div>
    </div>
  );
}
