'use client';

/**
 * ============================================================
 * GHI ÂM TIN NHẮN THOẠI
 * ============================================================
 *
 * Tách khỏi `MessageInput` vì đây là phần duy nhất trong khung soạn tin có
 * **trạng thái phần cứng**: một luồng micro đang mở, một `MediaRecorder` đang
 * chạy, và một đồng hồ. Ba thứ đó phải được dọn đúng lúc, nếu không:
 *
 *   • luồng micro không đóng ⇒ đèn camera/mic của máy sáng mãi sau khi người
 *     dùng đã rời trang. Trên macOS nó sáng ở thanh menu và người dùng tưởng
 *     app đang nghe lén;
 *   • `MediaRecorder` còn sống sau khi component rời màn hình ⇒ `setState`
 *     trên một component đã chết.
 *
 * ─── Vì sao chọn định dạng theo máy chứ không ép một kiểu ───
 * Safari KHÔNG ghi được `audio/webm` (nó chỉ có `audio/mp4`), còn Chrome/
 * Firefox thì ngược lại — `audio/mp4` không nằm trong danh sách của chúng. Ép
 * một kiểu là hỏng đúng một nửa số người dùng, và hỏng theo kiểu `MediaRecorder`
 * ném ngay lúc dựng. `MediaRecorder.isTypeSupported` là thứ duy nhất trả lời
 * đúng trên máy đang chạy.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Trần độ dài một tin nhắn thoại. */
export const GIAY_TOI_DA = 120;

/**
 * Các định dạng thử theo thứ tự ưu tiên.
 *
 * `opus` trước vì nó nhỏ hơn nhiều ở cùng chất lượng tiếng nói — một phút
 * thoại cỡ 400KB thay vì gần 1MB. Trên máy không hỗ trợ thì rơi xuống dưới.
 */
const KIEU_THU = [
  'audio/webm;codecs=opus',
  'audio/ogg;codecs=opus',
  'audio/webm',
  'audio/mp4',
];

/** Định dạng ghi âm dùng được trên máy này, hoặc `''` để trình duyệt tự chọn. */
export function kieuGhiDuoc(
  hoTro: (t: string) => boolean = (t) =>
    typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t),
): string {
  for (const k of KIEU_THU) {
    try {
      if (hoTro(k)) return k;
    } catch {
      /* `isTypeSupported` ném trên vài trình duyệt cũ — coi như không hỗ trợ. */
    }
  }
  return '';
}

/** Đuôi tệp khớp với kiểu MIME, để tệp tải lên có tên đọc được. */
export function duoiTheoKieu(mime: string): string {
  if (mime.includes('mp4')) return 'm4a';
  if (mime.includes('ogg')) return 'ogg';
  return 'webm';
}

/** "0:07" — đồng hồ đếm lên khi đang ghi. */
export function dongHo(giay: number): string {
  const g = Math.max(0, Math.floor(giay));
  return `${Math.floor(g / 60)}:${String(g % 60).padStart(2, '0')}`;
}

export type TrangThaiGhi = 'roi' | 'dang-ghi' | 'dang-xu-ly';

export interface BoGhiAm {
  trangThai: TrangThaiGhi;
  giay: number;
  loi: string | null;
  batDau: () => Promise<void>;
  /** Dừng và trả về tệp. `null` khi người dùng huỷ hoặc ghi quá ngắn. */
  ketThuc: () => Promise<File | null>;
  huy: () => void;
}

export function useGhiAm(): BoGhiAm {
  const [trangThai, datTrangThai] = useState<TrangThaiGhi>('roi');
  const [giay, datGiay] = useState(0);
  const [loi, datLoi] = useState<string | null>(null);

  const mayRef = useRef<MediaRecorder | null>(null);
  const luongRef = useRef<MediaStream | null>(null);
  const manhRef = useRef<Blob[]>([]);
  const dongHoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Người dùng bấm huỷ — `onstop` phải biết để vứt dữ liệu thay vì gửi đi. */
  const daHuyRef = useRef(false);

  /** Đóng micro và mọi thứ kèm theo. Gọi được nhiều lần. */
  const don = useCallback(() => {
    if (dongHoRef.current) { clearInterval(dongHoRef.current); dongHoRef.current = null; }
    /* Dừng TỪNG track, không chỉ bỏ tham chiếu luồng: bỏ tham chiếu thôi thì
       micro vẫn mở cho tới khi bộ thu gom rác chạy — có thể là nhiều phút, và
       đèn micro của máy vẫn sáng suốt thời gian đó. */
    luongRef.current?.getTracks().forEach((t) => t.stop());
    luongRef.current = null;
    mayRef.current = null;
    manhRef.current = [];
  }, []);

  /* Rời màn hình giữa chừng vẫn phải đóng micro. */
  useEffect(() => don, [don]);

  const batDau = useCallback(async () => {
    if (trangThai !== 'roi') return;
    datLoi(null);
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      datLoi('Trình duyệt này không ghi âm được.');
      return;
    }
    try {
      const luong = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      luongRef.current = luong;
      const kieu = kieuGhiDuoc();
      const may = new MediaRecorder(luong, kieu ? { mimeType: kieu } : undefined);
      manhRef.current = [];
      daHuyRef.current = false;
      may.ondataavailable = (e) => { if (e.data.size > 0) manhRef.current.push(e.data); };
      may.start();
      mayRef.current = may;
      datGiay(0);
      datTrangThai('dang-ghi');
      dongHoRef.current = setInterval(() => {
        datGiay((g) => {
          /* Chạm trần thì tự dừng. Không có chốt này thì một lần bấm nhầm để
             lại một tệp hàng chục MB mà người dùng không định gửi. */
          if (g + 1 >= GIAY_TOI_DA) mayRef.current?.stop();
          return g + 1;
        });
      }, 1000);
    } catch (e) {
      don();
      datTrangThai('roi');
      const ten = (e as Error)?.name;
      datLoi(
        ten === 'NotAllowedError'
          ? 'Bạn chưa cho phép dùng micro.'
          : ten === 'NotFoundError'
            ? 'Không tìm thấy micro nào trên máy này.'
            : 'Không mở được micro.',
      );
    }
  }, [trangThai, don]);

  const ketThuc = useCallback(async (): Promise<File | null> => {
    const may = mayRef.current;
    if (!may || trangThai !== 'dang-ghi') return null;
    datTrangThai('dang-xu-ly');

    const tep = await new Promise<File | null>((xong) => {
      may.onstop = () => {
        if (daHuyRef.current) { xong(null); return; }
        const kieu = may.mimeType || 'audio/webm';
        const khoi = new Blob(manhRef.current, { type: kieu });
        /* Dưới một giây gần như luôn là bấm nhầm. Gửi đi thì người nhận thấy
           một tin thoại 0 giây không phát được. */
        if (khoi.size < 1024) { xong(null); return; }
        xong(new File([khoi], `tin-thoai-${Date.now()}.${duoiTheoKieu(kieu)}`, { type: kieu }));
      };
      /* Đã dừng sẵn (chạm trần) thì `stop()` nữa sẽ ném. */
      if (may.state === 'inactive') may.onstop?.(new Event('stop'));
      else may.stop();
    });

    don();
    datTrangThai('roi');
    datGiay(0);
    return tep;
  }, [trangThai, don]);

  const huy = useCallback(() => {
    daHuyRef.current = true;
    try { mayRef.current?.stop(); } catch { /* đã dừng rồi */ }
    don();
    datTrangThai('roi');
    datGiay(0);
    datLoi(null);
  }, [don]);

  return { trangThai, giay, loi, batDau, ketThuc, huy };
}
