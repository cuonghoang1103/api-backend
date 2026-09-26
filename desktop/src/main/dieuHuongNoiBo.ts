/**
 * Điều hướng CẢ TRANG về một đường của chính app ⇒ đổi thành điều hướng TRONG app.
 *
 * Mã web dùng lại đôi chỗ gán thẳng `window.location.href = '/work/…'` (CT Work,
 * `IssueDetail` khi bấm một mã thẻ thuộc dự án khác). Trên web đó là tải lại
 * trang; ở app, renderer chạy ở `app://cuongthai` nên nó tải lại CẢ app vào
 * `app://cuongthai/work/…` — mất trạng thái, nháy trắng, rồi router của app
 * khôi phục `lastRoute` chứ không mở trang được bấm. Tức là bấm mà không đi đâu.
 *
 * Hàm này nhận ra đúng trường hợp đó để `will-navigate` chặn lại và gửi
 * `app:navigate` như một deep link. CHỈ nhận các cây đã liệt kê — một đường lạ
 * (`/login`, `/`) vẫn đi theo luồng cũ, không đoán bừa.
 *
 * Thuần tuý (không import electron) để kiểm được bằng vitest.
 */

/** Gốc các cây trang web được dựng TRONG app và từng bị gán `location.href`. */
/*
 * `/notes` thêm 26/09/2026: Ghi nhanh (⌥⇧N) mở ghi chú vừa lưu bằng
 * `window.location.href = '/notes?note=ID'`, nút "Xem Sổ lệnh ↗" dùng
 * `location.assign`, ⌘K/trang chủ Sổ tay trỏ `/notes/graph`. Không chặn thì
 * mỗi cú bấm tải lại cả app và rơi về `lastRoute`, không mở ghi chú nào.
 */
const CAY_NOI_BO: readonly string[] = ['/work', '/notes'];

export function duongNoiBoTuUrl(
  url: string,
  goc: readonly string[],
): { path: string; query: string } | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  // `new URL('app://cuongthai/x').origin` là "null" với scheme lạ — tự ghép.
  const origin = `${u.protocol}//${u.host}`;
  if (!goc.includes(origin)) return null;
  const p = u.pathname;
  if (!CAY_NOI_BO.some((c) => p === c || p.startsWith(`${c}/`))) return null;
  return { path: p, query: u.search };
}
