/**
 * HỢP ĐỒNG với phiên làm Speaking + xếp lớp (12/11/2026) — nạp ĐỘNG có kiểm tồn tại.
 * ─────────────────────────────────────────────────────────────────────────
 * Tệp của họ: `thi-may/PhongNoi.tsx` (default `PhongNoi({ de, cheDo, onXong })`), `thi-may/noiTypes.ts` (kiểu),
 * `thi-may/xepLop.ts` (`xepLop(kq)` luật mục 4.3) + `noiApi.ts › xepLopLuu` (API lưu kết quả xếp lớp).
 * `PhongNoi.tsx` lúc viết CHƯA có ⇒ không import tĩnh được (vỡ build). Dùng `import()` theo chuỗi ghép + `webpackInclude`
 * để webpack dựng một "context" chỉ gồm tệp khớp tên: tệp có ⇒ nạp được; chưa có ⇒ reject ⇒ trả null ⇒ giao diện hiện
 * "Speaking (sắp có)" và vẫn tính band 3 kỹ năng. Khi họ xong, KHÔNG cần sửa gì ở đây — chỉ cần tệp xuất hiện.
 */
import type { ComponentType } from 'react';
import type { KetQuaNoi, PhongNoiProps } from './noiTypes';
import { xepLop as xepLopThat, type DauVaoXepLop, type KetQuaXepLop } from './xepLop';

// `noiTypes.ts` + `xepLop.ts` của phiên Speaking đã có (12/11 02:00) ⇒ dùng thẳng kiểu + hàm của họ.
// ⚠️ `xepLop()` nhận `nghe`/`doc` là SỐ CÂU ĐÚNG (0–40), `viet`/`noi` là BAND — xem đầu xepLop.ts.
export type { KetQuaNoi, PhongNoiProps };
export type XepLopVao = DauVaoXepLop;
export type XepLopKq = KetQuaXepLop;

let phongNoiCache: Promise<ComponentType<PhongNoiProps> | null> | null = null;
/** Component phòng Speaking của phiên kia — null nếu tệp chưa có. */
export function taiPhongNoi(): Promise<ComponentType<PhongNoiProps> | null> {
  if (!phongNoiCache) {
    const ten = ['Phong', 'Noi'].join('');
    phongNoiCache = import(/* webpackInclude: /PhongNoi\.tsx$/ */ `./${ten}.tsx`)
      .then((m: { default?: ComponentType<PhongNoiProps> }) => m.default ?? null)
      .catch(() => null);
  }
  return phongNoiCache;
}

/** Hàm xếp lớp (luật mục 4.3) — giữ chữ ký async như lúc còn nạp động để chỗ gọi không đổi. */
export function taiXepLop(): Promise<((kq: XepLopVao) => XepLopKq) | null> {
  return Promise.resolve(xepLopThat);
}
