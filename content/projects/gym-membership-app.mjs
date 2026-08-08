/**
 * Case-study INT607 — Gym Membership & Classes App.
 * Semester 6 internship project #7, and the semester's first mobile build
 * (Expo React Native — the one mobile toolkit the main roadmap's Kotlin /
 * Swift / Flutter projects do not cover).
 *
 * Its place in the through-line: the contended resource stops being ONE thing
 * and becomes a COUNT. UNIQUE speaks about duplication, not quantity, so the
 * guard becomes a conditional counter decrement — plus the waitlist, whose
 * promotion must live INSIDE the cancel transaction.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./gym-membership-app.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./gym-membership-app.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'gym-membership-app',
  title: 'Gym Membership & Classes App (Đồ án thực tập #7)',
  titleEn: 'Gym Membership & Classes App (Internship Project #7)',
  description:
    'Đồ án #7 Kỳ 6: app Expo React Native + API Node/Express + PostgreSQL. Tài nguyên tranh chấp không còn là MỘT cái mà là một CON SỐ — lớp yoga 20 chỗ. SELECT COUNT(*) không thể bảo vệ nguyên tử, nên lời giải là bộ đếm giảm có điều kiện, cộng hàng chờ mà việc đôn người lên phải nằm TRONG transaction huỷ.',
  descriptionEn:
    'Semester 6 project #7: an Expo React Native app over a Node/Express + PostgreSQL API. The contended resource is no longer ONE thing but a COUNT — a 20-place yoga class. SELECT COUNT(*) cannot be guarded atomically, so the answer is a conditional counter decrement plus a waitlist whose promotion must live INSIDE the cancel transaction.',
  techStack: [
    'Expo', 'React Native', 'expo-router', 'expo-secure-store', 'TypeScript',
    'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'EAS Build', 'Docker',
  ],
  role: 'Mobile + Backend (một người)',
  roleEn: 'Mobile + backend (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Mobile',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/gym-membership-app.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- seats_left là dữ liệu SUY RA ĐƯỢC mà ta cố ý đem lưu.
-- Vi phạm "đừng lưu thứ tính được" có chủ ý, vì COUNT(*) KHÔNG THỂ
-- được bảo vệ nguyên tử cùng lệnh ghi theo sau, còn một cột số thì có.

CREATE TABLE classes (
  id          SERIAL PRIMARY KEY,
  gym_id      INT NOT NULL REFERENCES gyms(id),
  name        TEXT NOT NULL,          -- "Yoga cơ bản 6h"
  starts_at   TIMESTAMPTZ NOT NULL,
  capacity    INT NOT NULL CHECK (capacity > 0),
  -- Cột này là toàn bộ lời giải tương tranh của đồ án:
  --   UPDATE classes SET seats_left = seats_left - 1
  --    WHERE id = ? AND seats_left > 0
  -- Postgres tuần tự hoá ghi trên CÙNG một hàng, nên đúng một request
  -- thấy seats_left > 0 và 19 request còn lại sửa trúng 0 dòng.
  seats_left  INT NOT NULL CHECK (seats_left >= 0)
);

CREATE TABLE bookings (
  id         SERIAL PRIMARY KEY,
  class_id   INT NOT NULL REFERENCES classes(id),
  member_id  INT NOT NULL REFERENCES users(id),
  -- BOOKED WAITLISTED CANCELLED ATTENDED NO_SHOW
  status     VARCHAR(16) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Chặn một người đặt hai lần. Lưu ý: ràng buộc này KHÔNG hề ngăn
  -- được người thứ 21 — UNIQUE nói về TRÙNG LẶP, không nói về SỐ LƯỢNG.
  CONSTRAINT uq_active_booking UNIQUE (class_id, member_id)
);

-- Hàng chờ theo thứ tự đến trước. Truy vấn đôn người lên dùng
-- FOR UPDATE SKIP LOCKED trên chỉ mục này, để hai lượt huỷ đồng thời
-- đôn HAI NGƯỜI KHÁC NHAU thay vì cùng chọn một người.
CREATE INDEX idx_waitlist ON bookings (class_id, created_at)
  WHERE status = 'WAITLISTED';

-- Truy vấn ĐỐI SOÁT — bắt buộc phải có khi đã phi chuẩn hoá.
-- Chạy định kỳ, cảnh báo nếu ra bất kỳ dòng nào.
--   SELECT c.id, c.seats_left, c.capacity - COUNT(b.id) AS should_be
--     FROM classes c
--     LEFT JOIN bookings b ON b.class_id = c.id AND b.status = 'BOOKED'
--    GROUP BY c.id
--   HAVING c.seats_left <> c.capacity - COUNT(b.id);`,
  schemaCodeEn: `-- seats_left is DERIVABLE data that we deliberately store.
-- A knowing violation of "do not store what you can compute", because
-- COUNT(*) CANNOT be guarded atomically together with the write that
-- follows it, whereas a numeric column can.

CREATE TABLE classes (
  id          SERIAL PRIMARY KEY,
  gym_id      INT NOT NULL REFERENCES gyms(id),
  name        TEXT NOT NULL,          -- "Beginner Yoga 6am"
  starts_at   TIMESTAMPTZ NOT NULL,
  capacity    INT NOT NULL CHECK (capacity > 0),
  -- This column is the entire concurrency solution of the project:
  --   UPDATE classes SET seats_left = seats_left - 1
  --    WHERE id = ? AND seats_left > 0
  -- Postgres serialises writes to the SAME row, so exactly one request
  -- sees seats_left > 0 and the other nineteen update zero rows.
  seats_left  INT NOT NULL CHECK (seats_left >= 0)
);

CREATE TABLE bookings (
  id         SERIAL PRIMARY KEY,
  class_id   INT NOT NULL REFERENCES classes(id),
  member_id  INT NOT NULL REFERENCES users(id),
  -- BOOKED WAITLISTED CANCELLED ATTENDED NO_SHOW
  status     VARCHAR(16) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Stops one member booking twice. Note: this constraint does NOTHING
  -- about the 21st person — UNIQUE speaks about DUPLICATION, not QUANTITY.
  CONSTRAINT uq_active_booking UNIQUE (class_id, member_id)
);

-- The waitlist in arrival order. The promotion query uses
-- FOR UPDATE SKIP LOCKED over this index so two simultaneous cancellations
-- promote TWO DIFFERENT people rather than both picking the same one.
CREATE INDEX idx_waitlist ON bookings (class_id, created_at)
  WHERE status = 'WAITLISTED';

-- The RECONCILIATION query — mandatory once you denormalise.
-- Run it periodically and alert if it returns any row at all.
--   SELECT c.id, c.seats_left, c.capacity - COUNT(b.id) AS should_be
--     FROM classes c
--     LEFT JOIN bookings b ON b.class_id = c.id AND b.status = 'BOOKED'
--    GROUP BY c.id
--   HAVING c.seats_left <> c.capacity - COUNT(b.id);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Vì sao UNIQUE không cứu được bài toán sức chứa',
      titleEn: 'Why UNIQUE cannot help with capacity',
      description:
        'UNIQUE(classId, memberId) ngăn một người đặt hai lần nhưng không hề ngăn được người thứ 21. Sức chứa là bất biến về SỐ LƯỢNG, còn UNIQUE chỉ nói được về TRÙNG LẶP. Nhận ra hai loại bất biến này khác nhau là bước đầu tiên; nếu không, bạn sẽ mất một buổi thử đủ kiểu ràng buộc mà không cái nào đúng.',
      descriptionEn:
        'UNIQUE(classId, memberId) stops one member booking twice but does nothing about the 21st person. Capacity is an invariant about QUANTITY; UNIQUE can only speak about DUPLICATION. Seeing that those are different kinds of invariant is the first step — otherwise you spend an afternoon trying constraints, none of which fit.',
    },
    {
      phase: 'BACKEND',
      title: 'Bộ đếm giảm nguyên tử: mẫu hình lần thứ ba',
      titleEn: 'The atomic counter decrement: the pattern\'s third appearance',
      description:
        'UPDATE ... WHERE seats_left > 0 là cùng một ý tưởng với WHERE version = 0 (đồ án #1) và WHERE status = \'OPEN\' (đồ án #4), chỉ đổi vị từ. Postgres tuần tự hoá ghi trên cùng một hàng nên đúng một request thấy seats_left > 0. Nhận ra bốn biến thể này là MỘT mẫu hình chính là phần khó nhất của cả Kỳ 6.',
      descriptionEn:
        'UPDATE ... WHERE seats_left > 0 is the same idea as WHERE version = 0 (project #1) and WHERE status = \'OPEN\' (project #4), with only the predicate swapped. Postgres serialises writes to one row, so exactly one request sees seats_left > 0. Recognising those four variants as ONE pattern is the hardest part of the whole semester.',
      codeBlock:
        'const updated = await prisma.$executeRaw`\n'
        + '  UPDATE "Class" SET seats_left = seats_left - 1\n'
        + '  WHERE id = ${classId} AND seats_left > 0`;\n\n'
        + 'if (updated === 1) {\n'
        + "  await prisma.booking.create({ data: { classId, memberId, status: 'BOOKED' } });\n"
        + "  return { status: 'BOOKED' };\n"
        + '}\n'
        + 'return joinWaitlist(classId, memberId);   // → 202, vị trí thứ N',
      codeLang: 'javascript',
    },
    {
      phase: 'DATABASE',
      title: 'Phi chuẩn hoá có chủ ý, kèm nghĩa vụ đối soát',
      titleEn: 'Deliberate denormalisation, with a reconciliation duty',
      description:
        'seats_left là dữ liệu suy ra được mà ta đem lưu — đúng thứ đồ án #2 dặn đừng làm. Vi phạm này có lý do đủ mạnh: COUNT(*) không thể bảo vệ nguyên tử, cột số thì có. Nhưng đã phi chuẩn hoá thì phải trả nợ bằng một truy vấn đối soát chạy định kỳ; không có nó, một bug trong luồng huỷ sẽ âm thầm làm hỏng số liệu.',
      descriptionEn:
        'seats_left is derivable data that we store — exactly what project #2 warned against. The violation has a strong justification: COUNT(*) cannot be guarded atomically, a numeric column can. But denormalising incurs a debt, paid with a periodic reconciliation query; without it, one bug in the cancel path silently corrupts the numbers.',
    },
    {
      phase: 'BACKEND',
      title: 'Huỷ lớp: ba việc trong MỘT transaction',
      titleEn: 'Cancellation: three things in ONE transaction',
      description:
        'Đóng chỗ của người huỷ, đôn người đầu hàng chờ lên, và CHỈ KHI hàng chờ rỗng mới cộng seats_left. Sai lầm phổ biến là cộng ghế ngay rồi để job nền quét hàng chờ sau — giữa hai bước đó, một người mới đặt xen vào và chiếm chỗ của người đã xếp hàng ba ngày.',
      descriptionEn:
        'Close the canceller\'s booking, promote the head of the waitlist, and ONLY IF the waitlist is empty increment seats_left. The common mistake is to return the seat immediately and let a background job sweep the waitlist — between those two steps a brand-new member books and takes the place of someone who queued for days.',
      codeBlock:
        'const [next] = await tx.$queryRaw`\n'
        + '  SELECT id FROM "Booking"\n'
        + "   WHERE class_id = ${classId} AND status = 'WAITLISTED'\n"
        + '   ORDER BY created_at\n'
        + '   FOR UPDATE SKIP LOCKED\n'
        + '   LIMIT 1`;\n\n'
        + 'if (next) {\n'
        + "  await tx.booking.update({ where: { id: next.id }, data: { status: 'BOOKED' } });\n"
        + '  // ghế ĐỔI CHỦ — seats_left KHÔNG đổi\n'
        + '} else {\n'
        + '  await tx.$executeRaw`UPDATE "Class" SET seats_left = seats_left + 1 WHERE id = ${classId}`;\n'
        + '}',
      codeLang: 'javascript',
    },
    {
      phase: 'BACKEND',
      title: 'Hai lượt huỷ đồng thời phải đôn hai người khác nhau',
      titleEn: 'Two simultaneous cancellations must promote two different people',
      description:
        'SELECT ... ORDER BY created_at LIMIT 1 không khoá gì cả, nên hai lượt huỷ cùng lúc sẽ cùng chọn một người và một người bị đôn lên hai lần trong khi người thứ hai vẫn chờ. FOR UPDATE SKIP LOCKED bảo transaction thứ hai bỏ qua hàng đã bị khoá và lấy người kế tiếp.',
      descriptionEn:
        'SELECT ... ORDER BY created_at LIMIT 1 locks nothing, so two concurrent cancellations pick the same person, promoting one twice while the next still waits. FOR UPDATE SKIP LOCKED tells the second transaction to skip the locked row and take the following one.',
    },
    {
      phase: 'MOBILE',
      title: 'Token trên thiết bị: expo-secure-store, không phải AsyncStorage',
      titleEn: 'Tokens on device: expo-secure-store, never AsyncStorage',
      description:
        'Di động không có cookie httpOnly nên bạn phải tự chọn nơi cất. AsyncStorage đọc được từ ứng dụng khác trên máy đã root và đi theo mọi bản sao lưu. expo-secure-store dùng Keychain của iOS / Keystore của Android; thêm WHEN_UNLOCKED_THIS_DEVICE_ONLY để token không theo bản sao lưu iCloud sang máy khác.',
      descriptionEn:
        'Mobile has no httpOnly cookie, so the choice is yours. AsyncStorage is readable by other apps on a rooted device and rides every backup. expo-secure-store uses the iOS Keychain / Android Keystore; add WHEN_UNLOCKED_THIS_DEVICE_ONLY so the token never travels on an iCloud backup to another phone.',
      codeBlock:
        "import * as SecureStore from 'expo-secure-store';\n\n"
        + "await SecureStore.setItemAsync('refresh_token', token, {\n"
        + '  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,\n'
        + '});',
      codeLang: 'javascript',
    },
    {
      phase: 'MOBILE',
      title: 'Ngoại tuyến và cú chạm đúp: hai đặc thù của di động',
      titleEn: 'Offline and the double tap: two mobile-specific realities',
      description:
        'Lịch lớp phải đọc được từ bộ nhớ đệm khi mất mạng, nhưng nút Đặt lớp thì KHÔNG được cho bấm — đây là thao tác tranh chấp, không thể xếp hàng chờ đồng bộ như một ghi chú. Và trên điện thoại, chạm hai lần vì tưởng máy lag là chuyện thường ngày, nên nút phải khoá ngay ở cú chạm đầu và request phải mang khoá lặp lại.',
      descriptionEn:
        'The timetable must render from cache when offline, but the Book button must NOT be tappable — booking is a contended action and cannot be queued for later sync the way a note can. And on a phone, tapping twice because it felt laggy is routine, so the button must disable on the first tap and the request must carry an idempotency key.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm cả bốn nhánh, không chỉ nhánh đặt lớp',
      titleEn: 'Test all four branches, not just the booking path',
      description:
        '50 request đồng thời vào lớp còn 1 chỗ (1 BOOKED, 49 WAITLISTED); huỷ khi hàng chờ có người (đôn lên, seats_left không đổi); huỷ khi hàng chờ rỗng (seats_left + 1); hai lượt huỷ đồng thời (hai người khác nhau). Rồi chạy truy vấn đối soát sau 1.000 thao tác ngẫu nhiên — đây mới là phép kiểm bắt được lỗi ở nhánh hiếm.',
      descriptionEn:
        '50 concurrent requests on a class with 1 place (1 BOOKED, 49 WAITLISTED); cancel with a waitlist (promote, seats_left unchanged); cancel with an empty waitlist (seats_left + 1); two simultaneous cancellations (two different people). Then run the reconciliation query after 1,000 random operations — that is the check that catches bugs on the rare branch.',
    },
  ],

  features: [
    { title: 'Gói tập và hiệu lực thành viên', titleEn: 'Memberships and validity windows', description: 'Kiểm hiệu lực ở tầng service, không chỉ ẩn nút trên app.', descriptionEn: 'Validity checked in the service layer, not merely by hiding a button.', status: 'PLANNED' },
    { title: 'Lịch lớp theo tuần, đọc được khi ngoại tuyến', titleEn: 'Weekly timetable, readable offline', description: 'Bộ nhớ đệm cục bộ cho phần đọc; phần ghi tranh chấp thì chặn khi mất mạng.', descriptionEn: 'A local cache for reads; contended writes are blocked while offline.', status: 'PLANNED' },
    { title: 'Đặt lớp không bao giờ vượt sức chứa', titleEn: 'Booking that never exceeds capacity', description: 'UPDATE ... WHERE seats_left > 0; 50 người cùng bấm thì đúng số chỗ thật được nhận.', descriptionEn: 'UPDATE ... WHERE seats_left > 0; 50 simultaneous taps fill exactly the real capacity.', status: 'PLANNED' },
    { title: 'Hàng chờ có vị trí rõ ràng', titleEn: 'A waitlist with a real position', description: 'Hết chỗ thì nhận 202 kèm vị trí thứ N, không phải một lời từ chối cụt lủn.', descriptionEn: 'When full you get a 202 with position N, not a bare rejection.', status: 'PLANNED' },
    { title: 'Tự đôn lên khi có người huỷ', titleEn: 'Auto-promotion on cancellation', description: 'Nằm trong cùng transaction huỷ, nên không ai chen ngang được.', descriptionEn: 'Inside the cancel transaction, so nobody can cut in.', status: 'PLANNED' },
    { title: 'Điểm danh và thống kê vắng mặt', titleEn: 'Check-in and no-show tracking', description: 'NO_SHOW là dữ liệu có giá trị: cơ sở cho chính sách phạt và cho đăng ký vượt.', descriptionEn: 'NO_SHOW is valuable data: the basis for a policy and for overbooking decisions.', status: 'PLANNED' },
    { title: 'Token trong Keychain/Keystore', titleEn: 'Tokens in the Keychain/Keystore', description: 'expo-secure-store với WHEN_UNLOCKED_THIS_DEVICE_ONLY.', descriptionEn: 'expo-secure-store with WHEN_UNLOCKED_THIS_DEVICE_ONLY.', status: 'PLANNED' },
    { title: 'Truy vấn đối soát seats_left', titleEn: 'A seats_left reconciliation query', description: 'Chạy định kỳ, cảnh báo nếu lệch với capacity - COUNT(*).', descriptionEn: 'Runs periodically and alerts on any drift from capacity - COUNT(*).', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT607 trên Academy — bản dạy từng bước', titleEn: 'INT607 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/gym-membership-app', type: 'LINK', description: '9 mục, 22 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 22 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'Expo SecureStore', titleEn: 'Expo SecureStore', url: 'https://docs.expo.dev/versions/latest/sdk/securestore/', type: 'DOC', description: 'Các mức keychainAccessible và ý nghĩa của THIS_DEVICE_ONLY.', descriptionEn: 'The keychainAccessible levels and what THIS_DEVICE_ONLY really means.' },
    { title: 'PostgreSQL — SELECT ... FOR UPDATE SKIP LOCKED', titleEn: 'PostgreSQL — SELECT ... FOR UPDATE SKIP LOCKED', url: 'https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE', type: 'DOC', description: 'Thứ khiến hai lượt huỷ đồng thời đôn hai người khác nhau.', descriptionEn: 'What makes two simultaneous cancellations promote two different people.' },
    { title: 'Expo Router', titleEn: 'Expo Router', url: 'https://docs.expo.dev/router/introduction/', type: 'DOC', description: 'Định tuyến theo tệp cho React Native, gần với App Router của Next.', descriptionEn: 'File-based routing for React Native, close to Next.js\'s App Router.' },
    { title: 'EAS Build', titleEn: 'EAS Build', url: 'https://docs.expo.dev/build/introduction/', type: 'DOC', description: 'Build ứng dụng thật cho iOS/Android mà không cần máy Mac cho mọi bước.', descriptionEn: 'Building real iOS/Android binaries without needing a Mac at every step.' },
    { title: 'OWASP MASVS — Data Storage', titleEn: 'OWASP MASVS — Data Storage', url: 'https://mas.owasp.org/MASVS/05-MASVS-STORAGE/', type: 'LINK', description: 'Tiêu chuẩn về lưu dữ liệu nhạy cảm trên thiết bị di động.', descriptionEn: 'The standard for storing sensitive data on a mobile device.' },
  ],

  coreKnowledge: [
    { vi: 'Bất biến về số lượng khác bất biến về trùng lặp — và vì sao UNIQUE chỉ giải được loại sau', en: 'Quantity invariants versus duplication invariants — and why UNIQUE only solves the latter' },
    { vi: 'Bộ đếm giảm có điều kiện, và vì sao Postgres tuần tự hoá ghi trên cùng một hàng', en: 'Conditional counter decrements, and why Postgres serialises writes to one row' },
    { vi: 'Phi chuẩn hoá có chủ ý, và nghĩa vụ đối soát đi kèm', en: 'Deliberate denormalisation, and the reconciliation duty that comes with it' },
    { vi: 'Hàng chờ: vì sao việc đôn người lên phải nằm trong transaction huỷ', en: 'Waitlists: why promotion must live inside the cancellation transaction' },
    { vi: 'FOR UPDATE SKIP LOCKED để nhiều người xử lý cùng lấy các mục khác nhau', en: 'FOR UPDATE SKIP LOCKED so concurrent workers claim different items' },
    { vi: 'Lưu trữ an toàn trên thiết bị: Keychain/Keystore so với AsyncStorage', en: 'Secure device storage: Keychain/Keystore versus AsyncStorage' },
    { vi: 'Vì sao thao tác TRANH CHẤP không được xếp hàng chờ đồng bộ khi ngoại tuyến', en: 'Why CONTENDED actions must not be queued for offline sync' },
    { vi: 'Khoá lặp lại và việc vô hiệu hoá nút: hai lớp chống chạm đúp', en: 'Idempotency keys and disabling buttons: two layers against the double tap' },
    { vi: 'Expo Router và định tuyến theo tệp trên React Native', en: 'Expo Router and file-based routing in React Native' },
    { vi: 'NO_SHOW như dữ liệu nghiệp vụ, không phải trạng thái rác', en: 'NO_SHOW as business data rather than a junk status' },
  ],

  portfolioBonus: [
    { vi: 'Đoạn quay 20 giây: 50 request đồng thời và số chỗ cuối cùng vẫn đúng bằng sức chứa', en: 'A 20-second clip: 50 simultaneous requests and a final count exactly at capacity' },
    { vi: 'Kết quả truy vấn đối soát sau 1.000 thao tác ngẫu nhiên, đặt trong README', en: 'The reconciliation result after 1,000 random operations, in the README' },
    { vi: 'Thông báo đẩy khi được đôn từ hàng chờ lên', en: 'A push notification when you are promoted off the waitlist' },
    { vi: 'Quét mã QR để điểm danh tại quầy', en: 'QR check-in at the front desk' },
    { vi: 'Chạy trên máy thật cả iOS và Android, kèm ảnh chụp từ hai nền tảng', en: 'Running on real iOS and Android devices, with screenshots from both' },
    { vi: 'Chính sách đăng ký vượt dựa trên tỉ lệ vắng đo được, không phải đoán', en: 'An overbooking policy driven by measured no-show rates rather than guesswork' },
  ],

  completionOutcomes: [
    { vi: 'Phân biệt được bất biến về số lượng và bất biến về trùng lặp, rồi chọn công cụ đúng', en: 'Tell quantity invariants from duplication invariants and pick the right tool' },
    { vi: 'Biết khi nào phi chuẩn hoá là đúng, và trả được cái giá của nó', en: 'Know when denormalisation is right, and pay its price properly' },
    { vi: 'Thiết kế hàng chờ công bằng dưới tranh chấp thật', en: 'Design a waitlist that stays fair under real contention' },
    { vi: 'Xây app di động có xử lý token, mạng chập chờn và cú chạm đúp đúng cách', en: 'Build a mobile app that handles tokens, flaky networks and double taps correctly' },
    { vi: 'Đưa một app Expo lên máy thật của cả hai nền tảng', en: 'Ship an Expo app onto real devices on both platforms' },
  ],

  bodyMdx,
  bodyMdxEn,
};
