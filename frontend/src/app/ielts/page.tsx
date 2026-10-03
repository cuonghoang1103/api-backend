import { permanentRedirect } from 'next/navigation';

/**
 * cuongthai.com/ielts — địa chỉ ngắn cho khoá IELTS (03/10/2026). App desktop có
 * mục IELTS riêng ở đúng đường dẫn này (`desktop/src/renderer/routes.ts`), và bộ
 * kiểm của app đòi mỗi mục thanh bên có trang web thật cùng đường dẫn.
 */
export default function IeltsShort() {
  permanentRedirect('/language/en/ielts');
}
