/**
 * Liên kết chéo Academy → Courses (31/10/2026): ở cuối bài NWC204 có phần học sâu hơn trong khoá Networking for Developers.
 * Cùng kiểu khối `link-card lien-ket-cheo` với chiều ngược lại (content/courses/networking-for-developers/_ui.mjs › cauNoi).
 *   sauHon({ bai: 'netdev-1-3-ethernet-arp', so: '1.4', ten: ['Ethernet, MAC addresses and ARP', 'Ethernet, địa chỉ MAC và ARP'],
 *            them: ['what you add there (EN)', 'bài đó thêm gì (VI)'] })  ⇒ chuỗi HTML hai khối ml-en / ml-vi
 */
import { bi } from './_slides.mjs';

const the = (lang, { bai, so, ten, them }) => {
  const vi = lang === 'vi';
  return `<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=${bai}" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">${vi ? `Muốn học sâu hơn khi đi làm: Networking for Developers — bài ${so}: ${ten[1]}` : `Going deeper for real work: Networking for Developers — lesson ${so}: ${ten[0]}`}</span><span class="lc-sub">${vi
    ? `Phần này của NWC204 được dạy lại từ đầu theo góc nhìn lập trình viên, có output chạy thật trên một phòng lab Docker và mô phỏng tương tác. Bài đó thêm: ${them[1]}.`
    : `This NWC204 topic is taught again from the start from a developer’s angle, with real outputs from a Docker lab and an interactive simulation. That lesson adds: ${them[0]}.`}</span></span>
  <span class="lc-cta">${vi ? 'MỞ BÀI KHOÁ →' : 'OPEN COURSE LESSON →'}</span>
</a>`;
};

export const sauHon = (x) => bi(the('en', x), the('vi', x));
