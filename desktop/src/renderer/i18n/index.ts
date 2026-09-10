/**
 * ============================================================
 * ĐỔI NGÔN NGỮ — Tiếng Việt ⇄ English
 * ============================================================
 *
 * ─── VÌ SAO KHOÁ LÀ CHÍNH CÂU TIẾNG VIỆT, KHÔNG PHẢI `nav.dashboard` ───
 * Kiểu khoá-định-danh là chuẩn công nghiệp, nhưng ở kho này nó trả giá đắt hơn
 * phần nó được:
 *
 *  • App có ~1.400 chuỗi trong 104 tệp. Đặt khoá cho từng chuỗi nghĩa là bịa ra
 *    1.400 cái tên, và mỗi cái tên là một cơ hội gõ sai mà `tsc` không bắt được
 *    (khoá sai chỉ hiện ra lúc chạy, dưới dạng một dòng chữ lạ trên màn hình).
 *  • Cả kho này viết bằng tiếng Việt — tên biến, chú thích, thông điệp commit.
 *    Đổi `'Tổng quan'` thành `'nav.dashboard'` là lấy đi ngữ nghĩa khỏi chỗ
 *    người đọc mã cần nó nhất, đổi lấy một lần tra bảng.
 *  • Thiếu bản dịch thì kiểu khoá cho ra `nav.dashboard` giữa giao diện; kiểu
 *    này cho ra **tiếng Việt** — vẫn đọc được, vẫn đúng nghĩa.
 *
 * ─── ⚠️ VÌ SAO TÊN LÀ `dich`, KHÔNG PHẢI `t` ───
 * `t` là tên chuẩn của giới i18n, và nó SAI ở kho này: `t` cũng là tên biến
 * vòng lặp quen tay. Đo thật 10/09/2026 — **21 tệp** trong `features/` có
 * `(t) => …`, và ở mỗi tệp đó `const { t } = useDich()` bị biến vòng lặp che
 * mất, cho ra `Type 'Task' has no call signatures` ở những dòng chẳng liên quan
 * gì tới ngôn ngữ. Đổi tên lúc mới 361 chỗ dùng rẻ hơn nhiều so với lúc 1.400.
 *
 * ─── VÌ SAO KHÔNG DÙNG CONTEXT CỦA REACT ───
 * `dich()` cũng cần gọi được từ mã KHÔNG phải component (các hàm dựng chuỗi,
 * bảng hằng). Một biến ở tầm mô-đun + danh sách người nghe làm được cả hai:
 * hàm thuần đọc thẳng, còn component dùng `useDich()` để dựng lại khi người
 * dùng đổi ngôn ngữ.
 *
 * ⚠️ ĐỔI NGÔN NGỮ KHÔNG NẠP LẠI APP. Nạp lại là mất trạng thái đang làm dở —
 * cuộc trò chuyện agent đang chạy, ghi chú đang gõ. Nên mọi chỗ hiện chữ phải
 * đi qua `useDich()`, không được đọc `TU_DIEN` một lần rồi nhớ vào biến.
 */
import { useCallback, useEffect, useState } from 'react';

import { TU_DIEN } from './tuDien';

export type NgonNgu = 'vi' | 'en';

let hienTai: NgonNgu = 'vi';
const nguoiNghe = new Set<() => void>();

/** Ngôn ngữ đang dùng. Cho mã không phải component. */
export function ngonNguHienTai(): NgonNgu {
  return hienTai;
}

/**
 * Đổi ngôn ngữ. Gọi từ `AppStateProvider` mỗi khi thiết đặt đổi.
 *
 * Không làm gì nếu không đổi thật — gọi `setState` cho 35 component chỉ vì
 * thiết đặt được nạp lại cùng giá trị là dựng lại cả app không lý do.
 */
export function datNgonNgu(n: NgonNgu): void {
  if (n === hienTai) return;
  hienTai = n;
  for (const f of nguoiNghe) f();
}

/**
 * Gỡ tiền tố NGỮ CẢNH khỏi khoá: `'hoatdong|Học tập'` → `'Học tập'`.
 *
 * ⚠️ VÌ SAO CẦN NGỮ CẢNH — giới hạn cốt lõi của kiểu lấy câu làm khoá.
 * Một câu tiếng Việt có thể mang hai nghĩa khác nhau ở hai chỗ, và tiếng Anh
 * phân biệt chúng. Ca thật gặp 11/09/2026: `'Học tập'` vừa là NHÓM trong thanh
 * bên (gom Học viện, Khoá học, Code Lab, Phòng thi… ⇒ *Learning*), vừa là một
 * HOẠT ĐỘNG trong ngày trên trang Tổng quan (⇒ *Study*). Cùng một khoá thì
 * TypeScript báo trùng, và chọn bừa một nghĩa thì một trong hai chỗ sai.
 *
 * Chỉ tách ở dấu `|` ĐẦU TIÊN, và tiền tố phải là chữ thường/gạch dưới. Nhờ
 * thế một câu tiếng Việt có dấu `|` thật (hiếm, nhưng có) không bị cắt nhầm.
 */
const NGU_CANH = /^[a-z_]{2,20}\|/;
export function boNguCanh(cau: string): string {
  return NGU_CANH.test(cau) ? cau.slice(cau.indexOf('|') + 1) : cau;
}

/**
 * Dịch một câu.
 *
 * Không có trong từ điển ⇒ trả nguyên câu tiếng Việt (đã gỡ tiền tố ngữ cảnh).
 * Đó là lựa chọn có chủ đích: một câu tiếng Việt lọt giữa giao diện tiếng Anh
 * thì lạ mắt nhưng vẫn dùng được, còn một chuỗi rỗng hay một mã khoá thì không.
 */
export function dich(cau: string): string {
  if (hienTai === 'vi') return boNguCanh(cau);
  return TU_DIEN[cau] ?? boNguCanh(cau);
}

/**
 * Dịch có chỗ thay.
 *
 * `dichP('Còn {n} việc', { n: 3 })`. Chỗ thay giữ nguyên tên ở cả hai ngôn ngữ,
 * nên bản dịch được phép ĐẢO thứ tự — điều bắt buộc phải làm được, vì trật tự
 * từ tiếng Anh và tiếng Việt khác nhau ở đúng những câu hay ghép chuỗi nhất.
 */
export function dichP(cau: string, thay: Record<string, string | number>): string {
  return dich(cau).replace(/\{(\w+)\}/g, (nguyen, ten: string) =>
    (ten in thay ? String(thay[ten]) : nguyen));
}

/**
 * Hook cho component — dựng lại khi ngôn ngữ đổi.
 *
 * Trả về `dich`/`dichP` bọc trong `useCallback` phụ thuộc `nn`, nên component
 * nào gọi nó cũng nhận hàm MỚI sau khi đổi ngôn ngữ ⇒ mọi `useMemo` dựa vào
 * `dich` cũng tính lại. Trả hàm cố định thì nhãn nằm trong `useMemo` sẽ kẹt ở
 * ngôn ngữ cũ cho tới lần dựng sau — đúng kiểu lỗi "đổi rồi mà một nửa app
 * chưa đổi".
 */
export function useDich(): { dich: typeof dich; dichP: typeof dichP; nn: NgonNgu } {
  const [nn, datNn] = useState<NgonNgu>(hienTai);
  useEffect(() => {
    const f = (): void => datNn(ngonNguHienTai());
    nguoiNghe.add(f);
    // Ngôn ngữ có thể đã đổi giữa lúc dựng và lúc effect chạy.
    f();
    return () => { nguoiNghe.delete(f); };
  }, []);

  const d = useCallback(
    (cau: string) => (nn === 'vi' ? boNguCanh(cau) : TU_DIEN[cau] ?? boNguCanh(cau)),
    [nn],
  );
  const dP = useCallback(
    (cau: string, thay: Record<string, string | number>) =>
      d(cau).replace(/\{(\w+)\}/g, (nguyen, ten: string) =>
        (ten in thay ? String(thay[ten]) : nguyen)),
    [d],
  );
  return { dich: d, dichP: dP, nn };
}
