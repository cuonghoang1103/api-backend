/** PRO192 · Lab 7 — CT Library: danh sách đối tượng (tìm nhiều tiêu chí, sắp 4 khoá, mảng đối tượng, xoá khi đang duyệt). Nguồn: gen/lab/lab7. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab7', {
  tieuDe: { en: 'Lab 7 — CT Library: a list of objects', vi: 'Lab 7 — CT Library: danh sách đối tượng' },
  phut: 180,
  khaiNiem: ['multi-criteria search', 'sorting by several keys', 'statistics with an array of objects', 'removing while iterating'],
  moTa: {
    en: `<p><b>Ticket CTL-7.</b> The catalogue is full. Librarians need an advanced search (type + year range + keyword, every criterion optional), a sort on several keys (type, newest year first, title), statistics per type computed into an array of objects, and a clean-up that removes every item matching a rule <b>while walking the list</b> — without skipping neighbours and without <code>ConcurrentModificationException</code>.</p>
<p>Your TODOs are listed below; the walkthrough (including four measured traps) is lesson <b>Lab 7</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-7.</b> Kho đã đầy. Thủ thư cần tìm nâng cao (loại + khoảng năm + từ khoá, tiêu chí nào cũng tuỳ chọn), sắp theo nhiều khoá (loại, năm mới trước, tên), thống kê theo loại tính vào một mảng đối tượng, và dọn kho xoá mọi tài liệu khớp luật <b>trong lúc duyệt danh sách</b> — không bỏ sót phần tử liền kề và không <code>ConcurrentModificationException</code>.</p>
<p>Các TODO liệt kê bên dưới; hướng dẫn (kèm bốn cái bẫy đo thật) là bài <b>Lab 7</b> của khoá.</p>`,
  },
  thay: [['\njava magazine\n', '\nkotlin weekly\n'], ['\njava\n', '\nthe\n']],
  menuRac: '2',
  goiY: [
    { en: 'Optional criteria: treat an empty keyword / an empty year as "any" and test each criterion only when it is given.', vi: 'Tiêu chí tuỳ chọn: coi từ khoá trống / năm trống là "bất kỳ" và chỉ kiểm tiêu chí khi nó được nhập.' },
    { en: 'A multi-key Comparator: compare the first key; only when it is 0 compare the next one.', vi: 'Comparator nhiều khoá: so khoá đầu; chỉ khi bằng 0 mới so khoá tiếp.' },
    { en: 'Removing while iterating: use an Iterator and iterator.remove(), or walk the indexes backwards.', vi: 'Xoá khi đang duyệt: dùng Iterator và iterator.remove(), hoặc duyệt chỉ số từ cuối về.' },
  ],
  loiHayGap: [
    { en: 'list.remove(item) inside a for-each loop — ConcurrentModificationException.', vi: 'list.remove(item) trong vòng for-each — ConcurrentModificationException.' },
    { en: 'for (int i = 0; i < size; i++) with remove(i) — the element after each removed one is skipped.', vi: 'for (int i = 0; i < size; i++) kèm remove(i) — phần tử ngay sau phần tử bị xoá bị bỏ qua.' },
    { en: 'Comparing titles with == in the search — the keyword typed by the user never matches.', vi: 'So tên bằng == khi tìm — từ khoá người dùng gõ không bao giờ khớp.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 7 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map per the 29/10 LAB211 rule).</p>', vi: '<p>Lời giải là đáp án Lab 7 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map theo luật LAB211 29/10).</p>' },
});

export default moDun({ slug: 'pro192-lab-7-danh-sach-doi-tuong', ten: '7.3 Lab 7 — CT Library: a list of objects', de: [de] });
