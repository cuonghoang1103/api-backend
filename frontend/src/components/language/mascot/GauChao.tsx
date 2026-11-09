'use client';
/**
 * 🐼💬 Gấu Bíp + bong bóng thoại + nút loa — khối "chào" ở đầu trang /language (và nơi khác cần gấu nói).
 *
 * Hai cách dùng:
 *  - `tinhHinh` (trạng thái học: ngày vắng, thẻ đến hạn, chuỗi ngày) ⇒ tự chọn cảm xúc + câu (trangThaiBip.ts):
 *    vắng ≥7 ngày ⇒ miss, 3–6 ⇒ lonely/sad, có thẻ đến hạn ⇒ inspect, streak ≥3 ⇒ streak, quay lại ⇒ comeback…
 *  - `emotion` + `text` chỉ định tay (như bản cũ).
 * Vào trang: gấu vẫy tay (nếu cảm xúc vui), bong bóng gõ câu (KHÔNG phát tiếng — chưa có tương tác). Bấm gấu: đi
 * qua một vòng biểu cảm demo, nói câu mới bằng giọng robot cute (giongGau.ts), miệng đồng bộ. Nút loa nhớ lựa chọn.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import GauBip, { type CamXucGau, type VariantGau } from './GauBip';
import { MascotBubble } from './MascotBubble';
import { gauTat, datGauTat, noi, dungNoi, daTuongTac } from './giongGau';
import { getLine, type Emotion } from '@/lib/mascotData';
import { loiTheoTinhHinh, type TinhHinh } from './trangThaiBip';

/** Ánh xạ sang 5 cảm xúc của kho thoại cũ (mascotData) để lấy câu khi không có câu riêng. */
const CAM_2D: Record<CamXucGau, Emotion> = {
  happy: 'happy', cheer: 'cheer', sad: 'sad', think: 'think', surprised: 'wow', sleep: 'happy',
  inspect: 'think', grade: 'think', correct: 'cheer', wrong: 'sad', encourage: 'sad', love: 'cheer', streak: 'cheer',
  celebrate: 'cheer', sleepy: 'happy', miss: 'sad', lonely: 'sad', comeback: 'cheer',
};
/** Bấm gấu lần lượt đi qua bộ biểu cảm — ai cũng thấy đủ bộ mặt (và đạo cụ) sau vài cú chạm. */
const VONG: { cam: CamXucGau; cau: string }[] = [
  { cam: 'cheer', cau: 'Tuyệt vời! 🎉' },
  { cam: 'inspect', cau: 'Để mình soi bài của bạn xem nào…' },
  { cam: 'correct', cau: 'Đúng rồi! Chuẩn không cần chỉnh!' },
  { cam: 'wrong', cau: 'Chưa đúng rồi, thử lại nào — không sao đâu!' },
  { cam: 'grade', cau: 'Để mình chấm bài nhé.' },
  { cam: 'love', cau: 'Bạn chăm quá, mình thương ghê!' },
  { cam: 'streak', cau: 'Giữ lửa nha, đừng để tắt!' },
  { cam: 'celebrate', cau: 'Qua chặng rồi! Pháo giấy nào! 🎊' },
  { cam: 'think', cau: 'Để mình nghĩ chút…' },
  { cam: 'surprised', cau: 'Ối, đúng ngay lần đầu!' },
  { cam: 'miss', cau: 'Mình nhớ bạn lắm đó…' },
  { cam: 'lonely', cau: 'Mấy hôm nay bạn đi đâu vậy?' },
  { cam: 'comeback', cau: 'A, bạn quay lại rồi!' },
  { cam: 'sleepy', cau: 'Hoáp… buồn ngủ quá.' },
  { cam: 'sleep', cau: 'Zzz…' },
  { cam: 'happy', cau: 'Học tiếp nào! 🐼' },
];
const VUI: CamXucGau[] = ['happy', 'cheer', 'comeback', 'celebrate', 'correct', 'streak'];

export default function GauChao({
  text,
  emotion,
  tinhHinh,
  variant = 'bip',
  size = 220,
  seed,
  className = '',
  bubbleClassName = '',
  huong = 'phai',
  vayLucVao = true,
}: {
  /** Câu chỉ định; không có thì theo `tinhHinh`, không có nữa thì kho thoại theo cảm xúc. */
  text?: string;
  emotion?: CamXucGau;
  /** Trạng thái học ⇒ tự chọn cảm xúc + câu. */
  tinhHinh?: TinhHinh;
  variant?: VariantGau;
  size?: number;
  /** Đổi để gấu nói câu mới (vd. tiến độ đổi). */
  seed?: number | string;
  className?: string;
  bubbleClassName?: string;
  /** Bong bóng nằm bên nào của gấu. */
  huong?: 'trai' | 'phai' | 'tren';
  vayLucVao?: boolean;
}) {
  const macDinh = useMemo(() => {
    if (text || emotion) return { emotion: emotion ?? 'happy', text: text ?? getLine(variant, CAM_2D[emotion ?? 'happy'], seed) };
    if (tinhHinh) return loiTheoTinhHinh(tinhHinh, seed);
    return { emotion: 'happy' as CamXucGau, text: getLine(variant, 'happy', seed) };
  }, [text, emotion, tinhHinh, variant, seed]);

  const [cam, setCam] = useState<CamXucGau>(macDinh.emotion);
  const [cau, setCau] = useState(macDinh.text);
  const [lanNoi, setLanNoi] = useState(0);
  const [vayKey, setVayKey] = useState(0);
  const [dangNoi, setDangNoi] = useState(false);
  const [tat, setTat] = useState(false);
  const vong = useRef(0);
  const hen = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setTat(gauTat()); }, []);
  useEffect(() => { setCam(macDinh.emotion); setCau(macDinh.text); setLanNoi((n) => n + 1); }, [macDinh]);
  useEffect(() => {
    if (vayLucVao && VUI.includes(macDinh.emotion)) { const t = setTimeout(() => setVayKey((k) => k + 1), 350); return () => clearTimeout(t); }
  }, [vayLucVao, macDinh.emotion]);

  // "Đang nói" kéo dài bằng thời gian gõ chữ (26 ms/ký tự) hoặc thời lượng tiếng — cái nào dài hơn.
  const batDauNoi = useCallback((c: string, camMoi: CamXucGau) => {
    if (hen.current) clearTimeout(hen.current);
    const buon = camMoi === 'sad' || camMoi === 'miss' || camMoi === 'lonely' || camMoi === 'wrong';
    const ms = noi(c, variant, { camXuc: buon ? 'buon' : VUI.includes(camMoi) ? 'vui' : 'thuong' });
    const goMs = [...c].length * 26 + 250;
    setDangNoi(true);
    hen.current = setTimeout(() => setDangNoi(false), Math.max(ms, goMs));
  }, [variant]);

  useEffect(() => { if (cau) batDauNoi(cau, cam); return () => { if (hen.current) clearTimeout(hen.current); }; }, [lanNoi]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => dungNoi(), []);

  const bam = () => {
    const b = VONG[vong.current++ % VONG.length];
    setCam(b.cam);
    setCau(b.cau);
    if (VUI.includes(b.cam)) setVayKey((k) => k + 1);
    setLanNoi((n) => n + 1);
  };

  const doiTat = () => {
    const m = !tat;
    setTat(m);
    datGauTat(m);
    if (m) dungNoi();
    else if (daTuongTac()) setLanNoi((n) => n + 1);
  };

  const doc = huong === 'tren';
  return (
    <div className={`relative flex ${doc ? 'flex-col-reverse items-center' : huong === 'trai' ? 'flex-row-reverse items-end' : 'flex-row items-end'} gap-2 sm:gap-3 ${className}`}>
      <div className="relative">
        <GauBip emotion={cam} talking={dangNoi} size={size} variant={variant} vayKey={vayKey} onClick={bam} ariaLabel="Bấm để Bíp nói chuyện" />
        <button
          type="button"
          onClick={doiTat}
          aria-label={tat ? 'Bật tiếng Bíp' : 'Tắt tiếng Bíp'}
          aria-pressed={tat}
          title={tat ? 'Bật tiếng' : 'Tắt tiếng'}
          className="absolute bottom-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-text-secondary shadow-sm transition hover:text-text-primary"
        >
          {tat ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>
      {cau && (
        <MascotBubble
          character={variant}
          emotion={CAM_2D[cam]}
          text={cau}
          seed={lanNoi}
          className={`${doc ? 'mb-1' : 'mb-10'} ${bubbleClassName}`}
        />
      )}
    </div>
  );
}
