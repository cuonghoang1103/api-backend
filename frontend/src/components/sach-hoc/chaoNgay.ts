/** Màn chào mỗi ngày của CuongMini — "ngày học" bắt đầu lúc 5:00 sáng giờ máy; mỗi khoá chào một lần/ngày. */
export function ngayHoc(d = new Date()): string {
  const x = new Date(d.getTime() - 5 * 3600_000);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
const khoa = (stage: string) => `ct-chao:${stage}`;
export function daChaoHomNay(stage: string): boolean {
  try { return localStorage.getItem(khoa(stage)) === ngayHoc() || localStorage.getItem('ct-chao:tat') === '1'; } catch { return true; }
}
export function ghiDaChao(stage: string) { try { localStorage.setItem(khoa(stage), ngayHoc()); } catch { /* bỏ qua */ } }
export function tatChao() { try { localStorage.setItem('ct-chao:tat', '1'); } catch { /* bỏ qua */ } }
