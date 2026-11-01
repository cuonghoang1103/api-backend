/** PRO192 · Lab 8 — CT Library: dùng Collections thật sự (HashSet + equals/hashCode, Map của các List, HashMap theo mã, TreeMap, top 5). Nguồn: gen/lab/lab8. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab8', {
  tieuDe: { en: 'Lab 8 — CT Library: Collections for real', vi: 'Lab 8 — CT Library: dùng Collections thật sự' },
  phut: 180,
  khaiNiem: ['HashSet<Loan> + equals/hashCode', 'Map<String, List<Loan>> history', 'HashMap by id', 'TreeMap / top 5 report'],
  moTa: {
    en: `<p><b>Ticket CTL-8.</b> Replace hand-made searches by the right collections: open loans live in a <code>HashSet&lt;Loan&gt;</code> (so <code>Loan</code> must override <code>equals</code> and <code>hashCode</code> — a duplicate borrow is refused, and a return built from a <i>new</i> Loan object still finds the open one); the loan history is a <code>Map</code> from member id to a <code>List</code> of loans; members are looked up in a <code>HashMap</code> by id; authors are listed from a <code>TreeMap</code>; and a report shows the top 5 most borrowed items.</p>
<p>Your TODOs are listed below; the walkthrough (with the "equals without hashCode" trap measured for real) is lesson <b>Lab 8</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-8.</b> Thay các phép tìm tự viết bằng đúng collection: lượt mượn đang mở nằm trong <code>HashSet&lt;Loan&gt;</code> (nên <code>Loan</code> phải ghi đè <code>equals</code> và <code>hashCode</code> — mượn trùng bị từ chối, và lần trả dựng từ một đối tượng Loan <i>mới</i> vẫn tìm ra lượt đang mở); lịch sử mượn là <code>Map</code> từ mã thành viên tới <code>List</code> các lượt; thành viên tra trong <code>HashMap</code> theo mã; tác giả liệt kê từ <code>TreeMap</code>; và báo cáo top 5 tài liệu mượn nhiều nhất.</p>
<p>Các TODO liệt kê bên dưới; hướng dẫn (kèm bẫy "equals mà thiếu hashCode" đo thật) là bài <b>Lab 8</b> của khoá.</p>`,
  },
  thay: [['\njava puzzlers\n', '\njava concurrency\n'], ['\njoshua bloch\n', '\nbrian goetz\n'], ['\nle van chi\n', '\npham thi lan\n'], ['\nchi.le@ctlib.vn\n', '\nlan.pham@ctlib.vn\n']],
  menuRac: '2',
  goiY: [
    { en: 'Loan.equals: same member id AND same item id; hashCode built from the same two fields (Objects.hash(memberId, itemId)).', vi: 'Loan.equals: cùng mã thành viên VÀ cùng mã tài liệu; hashCode dựng từ đúng hai trường đó (Objects.hash(memberId, itemId)).' },
    { en: 'History: List<Loan> list = history.get(memberId); if null create it and put it; then list.add(loan).', vi: 'Lịch sử: List<Loan> list = history.get(memberId); null thì tạo và put; rồi list.add(loan).' },
    { en: 'Top 5: count per item in a Map, copy the entries to a List, sort by count desc then id, take the first five.', vi: 'Top 5: đếm theo tài liệu trong Map, chép entry ra List, sắp theo số lần giảm rồi theo mã, lấy năm cái đầu.' },
  ],
  loiHayGap: [
    { en: 'equals without hashCode — the HashSet keeps duplicate loans and a return never finds the open loan.', vi: 'equals mà thiếu hashCode — HashSet giữ lượt mượn trùng và lần trả không bao giờ tìm thấy lượt đang mở.' },
    { en: 'map.get(key) used without a null check — NullPointerException for a member with no history.', vi: 'Dùng map.get(key) mà không kiểm null — NullPointerException với thành viên chưa có lịch sử.' },
    { en: 'Changing a field used by hashCode while the object is inside a HashSet — the object becomes unreachable.', vi: 'Đổi trường mà hashCode dùng trong lúc đối tượng đang nằm trong HashSet — đối tượng thành không với tới được.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 8 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map/Set per the 29/10 LAB211 rule).</p>', vi: '<p>Lời giải là đáp án Lab 8 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map/Set theo luật LAB211 29/10).</p>' },
});

export default moDun({ slug: 'pro192-lab-8-collections', ten: '8.3 Lab 8 — CT Library: Collections for real', de: [de] });
