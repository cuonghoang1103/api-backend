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

  /* Mức micro đi thẳng vào nhân vật + vòng sóng của nút, KHÔNG qua state: trước 04/10
     mỗi lần âm lượng đổi là vẽ lại cả hộp thoại (đè lên nền kính mờ) ⇒ màn hình nhấp nháy. */
  const mucRef = useRef(0);
  const vongRef = useRef<HTMLDivElement>(null);
  const mic = useMicro({
    toiDaMs: GHI_TOI_DA,
    tuDung: { imMs: 1500 },
    onXong: (blob) => { void guiLuot(blob); },
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
      if (d.cham) phanUngNgan(d.cham.tong >= 85 ? 'vui' : d.cham.tong >= 60 ? 'kha' : 'buon', 2600);
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
      phanUngNgan('chao', 2600);
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
    mo: 'Đang gọi CuongMini…',
    giasu: 'CuongMini đang nói — chạm để ngắt lời và đọc ngay',
    nghe: 'Đang nghe — đọc to câu mẫu, nói xong máy tự chấm',
    cham: 'Đang chấm…',
    nghi: 'CuongMini đang suy nghĩ…',
    loi: 'Tạm dừng',
  };

  const THEO_PHA: Record<Pha, CamXuc> = { cho: 'cho', mo: 'nghi', giasu: 'noi', nghe: 'nghe', cham: 'nghi', nghi: 'nghi', loi: 'loi' };
  const camXuc = phanUng ?? THEO_PHA[pha];
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
        <button type="button" className={s.goiKetThuc} onClick={onClose}><PhoneOff size={16} /> Kết thúc</button>
      </header>

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
            <div className={s.goiNhanMuc}>Câu mẫu — đọc theo</div>
            {mau ? (
              <>
                <div className={s.goiMauChu}>{mau.text}</div>
                {mau.ipa && <div className={s.goiIpa}>/{mau.ipa}/</div>}
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
