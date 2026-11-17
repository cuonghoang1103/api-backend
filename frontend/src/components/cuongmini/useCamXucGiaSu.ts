'use client';

/**
 * Cảm xúc của CuongMini theo trạng thái gia sư — một chỗ, để khung robot và mục cuối bài cùng "diễn" như nhau.
 *
 *   mới mở khung        → vẫy tay (2 s)
 *   đang chờ chữ đầu    → nghĩ (lắc đầu, bong bóng "…")
 *   chữ đang chảy về    → nói (miệng mấp máy)
 *   vừa trả lời xong    → vui (nhảy tưng, lấp lánh — 1,6 s)
 *   hỏi hỏng            → bối rối (nghiêng đầu, dấu hỏi — 4 s)
 *   3 phút không ai hỏi → ngủ gà
 *
 * Hẹn giờ nằm Ở ĐÂY, cảm xúc tạm (vui/bối rối/vẫy) tự hết hạn — cha không phải nhớ dọn.
 */
import { useEffect, useRef, useState } from 'react';
import type { CamXucCuongMini } from './CuongMiniRobot';

const NGU_SAU_MS = 3 * 60_000;

export function useCamXucGiaSu({ dangHoi, coChu, soLoi, chao = true }: {
  /** Đang chờ / đang nhận câu trả lời. */
  dangHoi: boolean;
  /** Câu trả lời đã có chữ (đang chảy về). */
  coChu: boolean;
  /** Bộ đếm lỗi — tăng là bối rối. */
  soLoi: number;
  /** Vẫy tay lúc vừa mở. */
  chao?: boolean;
}): CamXucCuongMini {
  const [tam, datTam] = useState<CamXucCuongMini | null>(chao ? 'vay' : null);
  const [ngu, datNgu] = useState(false);
  const henTam = useRef<number | undefined>(undefined);

  const choTam = (m: CamXucCuongMini, ms: number) => {
    window.clearTimeout(henTam.current);
    datTam(m);
    henTam.current = window.setTimeout(() => datTam(null), ms);
  };

  // Lần mở đầu: vẫy tay rồi về bình thường.
  useEffect(() => {
    if (chao) henTam.current = window.setTimeout(() => datTam(null), 2000);
    return () => window.clearTimeout(henTam.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vừa xong một lượt (dangHoi true → false) ⇒ vui.
  const truoc = useRef(dangHoi);
  const loiTruoc = useRef(soLoi);
  useEffect(() => {
    if (soLoi !== loiTruoc.current) { loiTruoc.current = soLoi; choTam('boiRoi', 4000); }
    else if (truoc.current && !dangHoi) choTam('vui', 1600);
    truoc.current = dangHoi;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dangHoi, soLoi]);

  // Ngủ gà sau 3 phút yên lặng; hỏi lại là tỉnh.
  useEffect(() => {
    datNgu(false);
    if (dangHoi) return undefined;
    const h = window.setTimeout(() => datNgu(true), NGU_SAU_MS);
    return () => window.clearTimeout(h);
  }, [dangHoi, soLoi]);

  if (dangHoi) return coChu ? 'noi' : 'nghi';
  if (tam) return tam;
  return ngu ? 'ngu' : 'thuong';
}
