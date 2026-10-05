import { permanentRedirect } from 'next/navigation';

/** cuongthai.com/ch — địa chỉ ngắn cho khoá CH (05/10/2026), trùng đường dẫn mục CH của app desktop. */
export default function ChShort() {
  permanentRedirect('/language/zh/ch');
}
