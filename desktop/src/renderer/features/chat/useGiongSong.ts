/**
 * ============================================================
 * NGHE LIÊN TỤC + ĐO BIÊN ĐỘ GIỌNG THẬT
 * ============================================================
 *
 * Khác `NutGoiThoai` (giữ-để-nói) ở hai điểm, và cả hai đều là điểm chính
 * của chế độ nói chuyện:
 *
 *  • TỰ DỪNG KHI NGƯỜI DÙNG IM. Không phải thả tay. Rảnh tay là toàn bộ lý
 *    do người ta mở chế độ này thay vì gõ.
 *  • ĐO BIÊN ĐỘ THẬT qua `AnalyserNode` để vẽ hiệu ứng. Hoạt hình chạy theo
 *    đồng hồ trông giống nhau dù người dùng nói hay im — và người dùng NHẬN
 *    RA điều đó ngay, nó thành đồ trang trí thay vì phản hồi.
 *
 * ⚠️ ĐO NĂNG LƯỢNG, KHÔNG ĐO ĐỈNH. Đỉnh nhảy loạn theo từng phụ âm bật hơi
 * nên hình vẽ giật; căn bậc hai trung bình bình phương (RMS) cho một đường
 * mượt mà vẫn bám sát tiếng nói.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Dưới ngưỡng này coi như im. Đo thật trên micro laptop trong phòng yên. */
const NGUONG_IM = 0.012;
/** Im liên tục ngần này thì chốt là hết câu. Ngắn hơn thì cắt giữa lúc người ta ngập ngừng. */
const IM_DE_CHOT_MS = 1200;
/** Phải NÓI được ít nhất ngần này mới tính là một câu — chặn tiếng động lạ. */
const NOI_TOI_THIEU_MS = 400;
/** Trần một lượt nghe. Quá ngần này là micro bắt tiếng ồn liên tục. */
const TRAN_NGHE_MS = 30_000;

export interface BoNghe {
  /** Dừng ngay, KHÔNG gửi đi. */
  huy: () => void;
}

/**
 * Bắt đầu nghe. Gọi `xong(base64)` khi người dùng nói xong và im đủ lâu.
 * Trả `null` nếu không mở được micro.
 */
export async function ngheMotCau(
  xong: (tiengBase64: string) => void,
  doBienDo: (v: number) => void,
): Promise<BoNghe | null> {
  let luong: MediaStream;
  try {
    luong = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
  } catch {
    return null;
  }

  const ctx = new AudioContext();
  const nguon = ctx.createMediaStreamSource(luong);
  const phanTich = ctx.createAnalyser();
  phanTich.fftSize = 1024;
  nguon.connect(phanTich);
  const dem = new Float32Array(phanTich.fftSize);

  const mau: BlobPart[] = [];
  const may = new MediaRecorder(luong);
  may.ondataavailable = (e) => { if (e.data.size > 0) mau.push(e.data); };

  let daNoi = false;
  let noiTu = 0;
  let imTu = 0;
  let dungRoi = false;
  let khung = 0;
  const batDau = Date.now();

  const dungHet = (): void => {
    dungRoi = true;
    cancelAnimationFrame(khung);
    for (const t of luong.getTracks()) t.stop();
    void ctx.close().catch(() => {});
    doBienDo(0);
  };

  may.onstop = () => {
    dungHet();
    const blob = new Blob(mau, { type: 'audio/webm' });
    // Chưa nói gì ra hồn thì đừng phiền máy chủ, và đừng bắt người dùng chờ
    // một vòng nhận dạng cho vài trăm mili-giây tiếng ồn.
    if (!daNoi || blob.size < 2000) { xong(''); return; }
    const doc = new FileReader();
    doc.onloadend = () => {
      const s = String(doc.result ?? '');
      const i = s.indexOf(',');
      xong(i > 0 ? s.slice(i + 1) : '');
    };
    doc.readAsDataURL(blob);
  };

  const vong = (): void => {
    if (dungRoi) return;
    phanTich.getFloatTimeDomainData(dem);
    let tong = 0;
    for (let i = 0; i < dem.length; i += 1) tong += dem[i]! * dem[i]!;
    const rms = Math.sqrt(tong / dem.length);
    doBienDo(rms);

    const gio = Date.now();
    if (rms > NGUONG_IM) {
      if (!noiTu) noiTu = gio;
      if (gio - noiTu >= NOI_TOI_THIEU_MS) daNoi = true;
      imTu = 0;
    } else if (daNoi) {
      if (!imTu) imTu = gio;
      else if (gio - imTu >= IM_DE_CHOT_MS && may.state === 'recording') { may.stop(); return; }
    }
    if (gio - batDau > TRAN_NGHE_MS && may.state === 'recording') { may.stop(); return; }
    khung = requestAnimationFrame(vong);
  };

  may.start();
  khung = requestAnimationFrame(vong);

  return {
    huy: () => {
      if (may.state === 'recording') { may.onstop = () => dungHet(); may.stop(); }
      else dungHet();
    },
  };
}

/** Giữ biên độ hiện tại để vẽ, có làm mượt để hình không giật. */
export function useBienDo(): [number, (v: number) => void] {
  const [v, datV] = useState(0);
  const muot = useRef(0);
  const dat = useCallback((moi: number) => {
    // Lên NHANH, xuống CHẬM: giọng bật lên phải thấy ngay, còn tắt dần thì
    // mắt chịu được. Ngược lại thì hình nhấp nháy theo từng âm tiết.
    muot.current = moi > muot.current
      ? muot.current + (moi - muot.current) * 0.6
      : muot.current + (moi - muot.current) * 0.12;
    datV(muot.current);
  }, []);
  useEffect(() => () => { muot.current = 0; }, []);
  return [v, dat];
}
