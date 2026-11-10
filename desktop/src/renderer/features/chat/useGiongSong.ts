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
/**
 * Im liên tục ngần này thì chốt là hết câu.
 *
 * ⚠️ CON SỐ NÀY LÀ ĐỘ TRỄ THUẦN — nó nằm TRƯỚC mọi việc khác, nên mỗi mili
 * giây ở đây cộng thẳng vào thời gian người dùng chờ.
 *
 * 1200 → 800 (19/08/2026). Đo trên câu nói tiếng Việt bình thường: quãng
 * ngập ngừng giữa hai vế câu thường 300–600ms, nên 800ms vẫn còn biên. Ngắn
 * hơn nữa thì bắt đầu cắt ngang lúc người ta đang nghĩ giữa câu — và bị cắt
 * lời khó chịu hơn nhiều so với chờ thêm hai phần mười giây.
 *
 * Người nói chậm hoặc hay ngập ngừng thì chỉnh bằng `CT_IM_CHOT_MS`.
 */
const IM_DE_CHOT_MS = Number(
  (globalThis as { CT_IM_CHOT_MS?: number }).CT_IM_CHOT_MS,
) || 800;
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

/**
 * ============================================================
 * NGẮT LỜI BẰNG GIỌNG
 * ============================================================
 *
 * Giữ micro mở TRONG LÚC máy đang đọc, và khi nghe thấy người dùng bắt đầu
 * nói thì báo ra để bên gọi dừng phát.
 *
 * ⚠️ CHỖ KHÓ DUY NHẤT: MICRO NGHE THẤY CHÍNH CÁI LOA. Không xử lý thì máy
 * tự ngắt lời chính nó ngay câu đầu tiên. Hai lớp chống:
 *
 *  1. `echoCancellation` của trình duyệt — lớp chính, và nó làm tốt khi
 *     người dùng đeo tai nghe.
 *  2. Ngưỡng THÍCH NGHI theo nền vọng của chính lúc đang phát (xem `taoBoNhanChen` ngay dưới — thay ngưỡng cố định
 *     0,05/250ms cũ, thứ làm máy tự cắt lời sau một từ).
 *
 * Vẫn có thể ngắt nhầm với loa ngoài mở rất to — nên bên gọi phải cho người
 * dùng TẮT được tính năng này. Một trợ lý tự ngắt lời mình liên tục còn khó
 * dùng hơn một trợ lý không ngắt lời được.
 */

/*
 * 10/11/2026 — bản cũ (RMS thô ⩾ 0,05 giữ 250ms) tự cắt lời chính mình: micro được mở NGAY lúc bắt đầu phát, và ~0,3 s
 * đầu khử vọng/lọc ồn chưa hội tụ nên tiếng loa lọt vào to (đo bằng micro giả: 0,045 ⇒ 0,015 sau khi hội tụ). Cùng lỗi
 * với màn gọi của web (/chat, VoiceCallOverlay — người dùng báo "chỉ nói một chữ rồi im"). Nay quyết định nằm trong
 * `taoBoNhanChen` (hàm thuần, có test): bỏ đợt vọt đầu, đo NỀN vọng của chính lúc đang phát, chỉ cắt khi tiếng vượt hẳn
 * nền đó đủ lâu — với bộ tích luỹ RÒ vì giọng thật có quãng nghỉ giữa âm tiết.
 */
export const NHAN_CHEN = {
  /** Bỏ qua: micro vừa mở, khử vọng chưa hội tụ. */
  boQuaMs: 300,
  /** Từ boQuaMs tới đây: đo nền vọng (trung bình). */
  doNenMs: 900,
  nguongToiThieu: 0.06,
  heSoNen: 2.5,
  /** Tổng thời gian (có rò) phải vượt ngưỡng trước khi coi là chen lời. */
  duMs: 350,
  /** Trần của nền: người dùng nói NGAY khi máy vừa cất tiếng thì giọng họ lọt vào khoảng đo nền — không chặn trần thì
   *  ngưỡng vọt lên và không bao giờ cắt được. 0,05 ⇒ ngưỡng tối đa ~0,145, vẫn trên tiếng loa đã khử vọng. */
  nenToiDa: 0.05,
} as const;

/**
 * Bộ nhận "người dùng nói chen" — THUẦN, không đụng micro: đưa vào từng mẫu RMS kèm thời điểm (ms), trả `true` ở mẫu
 * đầu tiên đủ điều kiện. Mức tiếng được làm mượt (lên nhanh, xuống chậm) như vòng sáng của màn gọi.
 */
export function taoBoNhanChen(batDau: number, cfg = NHAN_CHEN): (rms: number, luc: number) => boolean {
  let muot = 0;
  let tong = 0;
  let so = 0;
  let nen = 0;
  let tich = 0;
  let truoc = batDau;
  return (rms, luc) => {
    // Làm mượt GẦN ĐỐI XỨNG (khác vòng sáng "lên nhanh, xuống chậm"): xuống chậm thì một tiếng ho 150ms cũng kéo dài
    // đủ 350ms trên ngưỡng.
    muot = rms > muot ? muot + (rms - muot) * 0.5 : muot + (rms - muot) * 0.35;
    const tuLuc = luc - batDau;
    const dt = Math.min(100, Math.max(0, luc - truoc));
    truoc = luc;
    if (tuLuc < cfg.boQuaMs) return false;
    if (tuLuc < cfg.doNenMs) { tong += muot; so += 1; nen = Math.min(cfg.nenToiDa, tong / so); return false; }
    const nguong = Math.max(cfg.nguongToiThieu, nen * cfg.heSoNen + 0.02);
    if (muot > nguong) {
      tich += dt;
      return tich >= cfg.duMs;
    }
    tich = Math.max(0, tich - dt / 2);
    nen = Math.min(cfg.nenToiDa, nen * 0.97 + muot * 0.03);   // nền chỉ trôi theo mẫu DƯỚI ngưỡng — giọng người chen vào không bị nuốt vào nền
    return false;
  };
}

export interface BoCanh {
  thoi: () => void;
}

/**
 * Canh xem người dùng có nói chen vào không. Gọi `khiNoi()` MỘT LẦN rồi tự
 * dừng — bên gọi quyết định làm gì tiếp.
 *
 * Trả `null` nếu không mở được micro; khi đó bên gọi cứ phát tiếp như cũ,
 * chỉ là không ngắt lời bằng giọng được.
 */
export async function canhNguoiNoiChen(
  khiNoi: () => void,
  doBienDo?: (v: number) => void,
): Promise<BoCanh | null> {
  let luong: MediaStream;
  try {
    luong = await navigator.mediaDevices.getUserMedia({
      // ⚠️ `echoCancellation` là lớp chống rò CHÍNH. Thiếu nó thì micro nghe
      // thấy loa và máy tự ngắt lời chính nó ngay câu đầu.
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
    });
  } catch {
    return null;
  }

  const ctx = new AudioContext();
  const phanTich = ctx.createAnalyser();
  phanTich.fftSize = 1024;
  ctx.createMediaStreamSource(luong).connect(phanTich);
  const dem = new Float32Array(phanTich.fftSize);

  let khung = 0;
  let xong = false;
  const nhanChen = taoBoNhanChen(performance.now());

  const thoi = (): void => {
    if (xong) return;
    xong = true;
    cancelAnimationFrame(khung);
    for (const t of luong.getTracks()) t.stop();
    void ctx.close().catch(() => {});
    doBienDo?.(0);
  };

  const vong = (): void => {
    if (xong) return;
    phanTich.getFloatTimeDomainData(dem);
    let tong = 0;
    for (let i = 0; i < dem.length; i += 1) tong += dem[i]! * dem[i]!;
    const rms = Math.sqrt(tong / dem.length);
    doBienDo?.(rms);

    if (nhanChen(rms, performance.now())) { thoi(); khiNoi(); return; }
    khung = requestAnimationFrame(vong);
  };
  khung = requestAnimationFrame(vong);

  return { thoi };
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
