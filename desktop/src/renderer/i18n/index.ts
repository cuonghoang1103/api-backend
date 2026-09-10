/**
 * ============================================================
 * ĐỔI NGÔN NGỮ — Tiếng Việt ⇄ English
 * ============================================================
 *
 * ─── VÌ SAO KHOÁ LÀ CHÍNH CÂU TIẾNG VIỆT, KHÔNG PHẢI `nav.dashboard` ───
 * Kiểu khoá-định-danh (`t('nav.dashboard')`) là chuẩn công nghiệp, nhưng ở kho
 * này nó trả giá đắt hơn phần nó được:
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
 * ─── VÌ SAO KHÔNG DÙNG CONTEXT CỦA REACT ───
 * `t()` cũng cần gọi được từ mã KHÔNG phải component (`viecDangLam.ts`,
 * `routes.ts`, các hàm dựng chuỗi). Một biến ở tầm mô-đun + danh sách người
 * nghe làm được cả hai: hàm thuần đọc thẳng, còn component dùng `useT()` để
 * dựng lại khi người dùng đổi ngôn ngữ.
 *
 * ⚠️ ĐỔI NGÔN NGỮ KHÔNG NẠP LẠI APP. Nạp lại là mất trạng thái đang làm dở —
 * cuộc trò chuyện agent đang chạy, ghi chú đang gõ. Nên mọi chỗ hiện chữ phải
 * đi qua `useT()`, không được đọc `TU_DIEN` một lần rồi nhớ vào biến.
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
 * Dịch một câu.
 *
 * Không có trong từ điển ⇒ trả nguyên câu tiếng Việt. Đó là lựa chọn có chủ
 * đích: một câu tiếng Việt lọt giữa giao diện tiếng Anh thì lạ mắt nhưng vẫn
 * dùng được, còn một chuỗi rỗng hay một mã khoá thì không.
 */
export function t(cau: string): string {
  if (hienTai === 'vi') return cau;
  return TU_DIEN[cau] ?? cau;
}

/**
 * Dịch có chỗ thay.
 *
 * `tp('Còn {n} việc', { n: 3 })`. Chỗ thay giữ nguyên tên ở cả hai ngôn ngữ,
 * nên bản dịch được phép ĐẢO thứ tự — điều bắt buộc phải làm được, vì trật tự
 * từ tiếng Anh và tiếng Việt khác nhau ở đúng những câu hay ghép chuỗi nhất.
 */
export function tp(cau: string, thay: Record<string, string | number>): string {
  return t(cau).replace(/\{(\w+)\}/g, (nguyen, ten: string) =>
    (ten in thay ? String(thay[ten]) : nguyen));
}

/**
 * Hook cho component — dựng lại khi ngôn ngữ đổi.
 *
 * Trả về `t`/`tp` bọc trong `useCallback` phụ thuộc `nn`, nên component nào
 * gọi nó cũng nhận hàm MỚI sau khi đổi ngôn ngữ ⇒ mọi `useMemo` dựa vào `t`
 * cũng tính lại. Trả hàm cố định thì nhãn nằm trong `useMemo` sẽ kẹt ở ngôn
 * ngữ cũ cho tới lần dựng sau — đúng kiểu lỗi "đổi rồi mà một nửa app chưa đổi".
 */
export function useT(): { t: typeof t; tp: typeof tp; nn: NgonNgu } {
  const [nn, datNn] = useState<NgonNgu>(hienTai);
  useEffect(() => {
    const f = (): void => datNn(ngonNguHienTai());
    nguoiNghe.add(f);
    // Ngôn ngữ có thể đã đổi giữa lúc dựng và lúc effect chạy.
    f();
    return () => { nguoiNghe.delete(f); };
  }, []);

  const tt = useCallback((cau: string) => (nn === 'vi' ? cau : TU_DIEN[cau] ?? cau), [nn]);
  const ttp = useCallback(
    (cau: string, thay: Record<string, string | number>) =>
      tt(cau).replace(/\{(\w+)\}/g, (nguyen, ten: string) =>
        (ten in thay ? String(thay[ten]) : nguyen)),
    [tt],
  );
  return { t: tt, tp: ttp, nn };
}
