'use client';
/**
 * 🐼💬 Gấu Bíp 3D + bong bóng thoại + nút loa — khối "chào" dùng ở đầu trang /language và trang lộ trình.
 *
 * Vào trang: gấu vẫy tay, bong bóng gõ câu chào (KHÔNG phát tiếng — chưa có tương tác, trình duyệt cũng
 * cấm). Bấm vào gấu: nói câu mới bằng giọng bập bẹ (giongGau.ts), miệng mấp máy đồng bộ, đổi biểu cảm
 * theo câu. Nút loa tắt/bật tiếng, nhớ ở localStorage.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import GauBip, { type CamXucGau, type VariantGau } from './GauBip';
import { MascotBubble } from './MascotBubble';
import { gauTat, datGauTat, noi, dungNoi, daTuongTac } from './giongGau';
import { getLine, type Emotion } from '@/lib/mascotData';

const CAM_2D: Record<CamXucGau, Emotion> = { happy: 'happy', cheer: 'cheer', sad: 'sad', think: 'think', surprised: 'wow', sleep: 'happy' };
/** Bấm gấu lần lượt đi qua các cảm xúc — ai cũng thấy đủ bộ mặt sau vài cú chạm. */
const VONG: CamXucGau[] = ['cheer', 'surprised', 'think', 'happy', 'sad', 'sleep', 'happy'];

export default function GauChao({
  text,
  emotion = 'happy',
  variant = 'bip',
  size = 220,
  seed,
  className = '',
  bubbleClassName = '',
  huong = 'phai',
  vayLucVao = true,
}: {
  /** Câu chào; không có thì lấy từ kho thoại theo cảm xúc. */
  text?: string;
  emotion?: CamXucGau;
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
  const [cam, setCam] = useState<CamXucGau>(emotion);
  const [cau, setCau] = useState(text ?? '');
  const [lanNoi, setLanNoi] = useState(0);
  const [vayKey, setVayKey] = useState(0);
  const [dangNoi, setDangNoi] = useState(false);
  const [tat, setTat] = useState(false);
  const vong = useRef(0);
  const hen = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setTat(gauTat()); }, []);
  useEffect(() => { setCam(emotion); }, [emotion]);
  useEffect(() => { setCau(text ?? getLine(variant, CAM_2D[emotion], seed)); setLanNoi((n) => n + 1); }, [text, emotion, variant, seed]);
  useEffect(() => { if (vayLucVao) { const t = setTimeout(() => setVayKey(1), 350); return () => clearTimeout(t); } }, [vayLucVao]);

  // "Đang nói" kéo dài bằng thời gian gõ chữ (26 ms/ký tự) hoặc thời lượng tiếng — cái nào dài hơn.
  const batDauNoi = useCallback((c: string, camMoi: CamXucGau) => {
    if (hen.current) clearTimeout(hen.current);
    const ms = noi(c, variant, { camXuc: camMoi === 'sad' ? 'buon' : camMoi === 'cheer' ? 'vui' : 'thuong' });
    const goMs = [...c].length * 26 + 250;
    setDangNoi(true);
    hen.current = setTimeout(() => setDangNoi(false), Math.max(ms, goMs));
  }, [variant]);

  useEffect(() => { if (cau) batDauNoi(cau, cam); return () => { if (hen.current) clearTimeout(hen.current); }; }, [lanNoi]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => dungNoi(), []);

  const bam = () => {
    const camMoi = VONG[vong.current++ % VONG.length];
    setCam(camMoi);
    const c = getLine(variant, CAM_2D[camMoi]);
    setCau(c);
    if (camMoi === 'cheer' || camMoi === 'happy') setVayKey((k) => k + 1);
    setLanNoi((n) => n + 1);
  };

  const doiTat = () => {
    const m = !tat;
    setTat(m);
    datGauTat(m);
    if (m) dungNoi();
    else if (daTuongTac()) { setLanNoi((n) => n + 1); }
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
          className={`${doc ? 'mb-1' : 'mb-10'} ${huong === 'trai' ? '[&>span:last-child]:left-auto [&>span:last-child]:-right-1.5' : ''} ${bubbleClassName}`}
        />
      )}
    </div>
  );
}
