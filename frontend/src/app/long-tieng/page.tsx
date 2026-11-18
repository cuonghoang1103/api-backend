import { redirect } from 'next/navigation';

/** /long-tieng cũ (18/11/2026) ⇒ trang đã chuyển vào khung admin (sidebar → Nội dung → CT Lồng Tiếng). */
export default function Page() {
  redirect('/admin/long-tieng');
}
