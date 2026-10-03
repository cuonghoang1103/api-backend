/**
 * `/offline` — đường đi của MỘT lượt khi người dùng có thể đã ÉP chạy AI trên
 * máy (03/10/2026). Tách khỏi `ipc/agent.ts` để kiểm được.
 *
 * Ranh giới của gói ngoại tuyến GIỮ NGUYÊN: không ép và có mạng ⇒ máy chủ,
 * không bao giờ tự rơi xuống máy. Ép tay thì đi đường máy y như mất mạng, chỉ
 * bỏ qua công tắc "Tự dùng khi mất mạng" (người dùng vừa tự chọn) — công tắc
 * "Cho phép" thì vẫn phải tôn trọng.
 */
import { duongChoLuot, type DuongLuot } from '../../shared/cheDoAi';

export function duongCuaLuot(d: {
  ep: boolean;
  matMang: boolean;
  choPhepChay: boolean;
  tuDungKhiMatMang: boolean;
  coModel: boolean;
}): DuongLuot {
  if (!d.ep && !d.matMang) return 'mayChu';
  return duongChoLuot({
    matMang: true,
    choPhepChay: d.choPhepChay,
    tuDungKhiMatMang: d.ep || d.tuDungKhiMatMang,
    coModel: d.coModel,
  });
}
