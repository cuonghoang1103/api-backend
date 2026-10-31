/**
 * Liên kết chéo Academy → Courses (01/11/2026): cuối bài OSG202 trỏ sang đúng bài học sâu hơn ở khoá Courses.
 * Cùng kiểu khối `link-card lien-ket-cheo` với chiều ngược lại (content/courses/networking-for-developers/_ui.mjs › cauNoi).
 *   sauHon({ khoa: 'networking-for-developers', tenKhoa: 'Networking for Developers', bai: 'netdev-2-3-nat', so: '2.3',
 *            ten: ['EN title', 'tên VI'], them: ['what that lesson adds (EN)', 'bài đó thêm gì (VI)'] })  ⇒ hai khối ml-en / ml-vi
 */
import { bi } from './_slides.mjs';

const the = (lang, { khoa, tenKhoa, bai, so, ten, them }) => {
  const vi = lang === 'vi';
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">${vi ? `Muốn học sâu hơn khi đi làm: ${tenKhoa} — bài ${so}: ${ten[1]}` : `Going deeper for real work: ${tenKhoa} — lesson ${so}: ${ten[0]}`}</span><span class="lc-sub">${vi
    ? `Bài này của OSG202 nhìn từ phía hệ điều hành; bài bên khoá Courses đi tiếp phần mạng, có output chạy thật trên một phòng lab Docker và mô phỏng tương tác. Bài đó thêm: ${them[1]}.`
    : `This OSG202 lesson looks from the operating-system side; the course lesson continues on the network side, with real outputs from a Docker lab and an interactive simulation. That lesson adds: ${them[0]}.`}</span></span>
  <span class="lc-cta">${vi ? 'MỞ BÀI KHOÁ →' : 'OPEN COURSE LESSON →'}</span>
</a>`;
};

export const sauHon = (x) => bi(the('en', x), the('vi', x));
