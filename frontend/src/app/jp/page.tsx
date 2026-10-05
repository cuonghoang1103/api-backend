import { permanentRedirect } from 'next/navigation';

/** cuongthai.com/jp — địa chỉ ngắn cho khoá JP (05/10/2026), trùng đường dẫn mục JP của app desktop. */
export default function JpShort() {
  permanentRedirect('/language/ja/jp');
}
