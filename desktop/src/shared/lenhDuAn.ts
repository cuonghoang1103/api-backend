/**
 * Ghép tham số vào thân lệnh gạch chéo tự tạo.
 *
 * Nằm ở `shared/` vì CẢ HAI phía cần nó: main đọc file lệnh, renderer đặt chữ
 * vào ô soạn. Chép tay hai bản là mầm trôi dạt — đúng bài học đã trả giá với
 * union enum chép tay trong `prisma/seed.ts`, thứ tự kiểm với chính nó và vỡ
 * trên production.
 */
/**
 * Thay `$ARGUMENTS` bằng phần người dùng gõ sau tên lệnh.
 *
 * File KHÔNG có `$ARGUMENTS` mà người dùng vẫn gõ thêm chữ thì phần đó được nối
 * vào cuối — thà thừa còn hơn nuốt mất thứ họ vừa gõ. Nuốt im lặng là cách chắc
 * chắn nhất để họ tưởng lệnh hỏng.
 */
export function ghepThamSo(than: string, thamSo: string): string {
  const t = thamSo.trim();
  if (than.includes('$ARGUMENTS')) return than.split('$ARGUMENTS').join(t);
  return t === '' ? than : `${than.trimEnd()}\n\n${t}`;
}
