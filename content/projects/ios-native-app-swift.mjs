/**
 * Extra project (mobile) — iOS Native App (Swift).
 *
 * Fills the Swift/iOS gap. Two things separate it from the Android study:
 * reference counting produces a leak class GC languages never see (and the
 * compiler stays silent), and a gatekeeper turns some technical decisions
 * into commercially risky ones.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./ios-native-app-swift.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./ios-native-app-swift.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'ios-native-app-swift',
  title: 'iOS Native App (Swift)',
  titleEn: 'iOS Native App (Swift)',
  description:
    'Ứng dụng iOS ưu tiên ngoại tuyến viết bằng Swift và SwiftUI. Hai thứ iOS có mà Android không: bộ nhớ đếm tham chiếu sinh ra một loại rò rỉ mà ngôn ngữ có thu gom rác chưa từng gặp, và một người gác cổng biến quyết định kỹ thuật thành quyết định có rủi ro thương mại.',
  descriptionEn:
    'An offline-first iOS app in Swift and SwiftUI. Two things iOS has that Android does not: reference counting produces a leak class garbage-collected languages never see, and a gatekeeper turns technical decisions into commercially risky ones.',
  techStack: [
    'Swift', 'SwiftUI', 'Swift Concurrency', 'SwiftData / Core Data',
    'URLSession background', 'Keychain', 'APNs', 'XCTest', 'Instruments',
  ],
  role: 'iOS (một người)',
  roleEn: 'iOS (solo)',
  duration: '5–6 tuần',
  durationEn: '5–6 weeks',
  status: 'PLANNING',
  category: 'Mobile',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/ios-native-app-swift.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// ── LOẠI RÒ RỈ MÀ NGÔN NGỮ CÓ THU GOM RÁC KHÔNG CÓ ──────────────────
// Swift giải phóng đối tượng khi số tham chiếu về 0 — không có khoảng dừng
// thu gom rác. Nhưng nếu A giữ MẠNH B và B giữ MẠNH A thì số đếm của cả hai
// KHÔNG BAO GIỜ về 0. Chỗ hay dính nhất không phải quan hệ đối tượng mà là
// BAO ĐÓNG: closure tự động giữ MẠNH mọi thứ nó dùng, kể cả self.

class FeedViewModel {
    var posts: [Post] = []

    func load() {
        // ❌ RÒ RỈ: closure giữ MẠNH self, self giữ closure qua tác vụ.
        api.fetchPosts { result in
            self.posts = result
        }

        // ✓ ĐÚNG: [weak self] phá chu trình. Phải xử lý self = nil vì màn
        // hình có thể đã đóng trước khi mạng trả về.
        api.fetchPosts { [weak self] result in
            guard let self else { return }
            self.posts = result
        }
    }
}

// ⚠️ Điều làm lỗi này khó chịu: ỨNG DỤNG VẪN CHẠY ĐÚNG. Không ngoại lệ,
// không màn hình lỗi — chỉ rò thêm một ít mỗi lần mở màn hình, và sau nửa
// giờ dùng thì hệ thống kết thúc app vì vượt hạn mức bộ nhớ. Người dùng báo
// "ứng dụng tự thoát" mà KHÔNG có vết ngăn xếp nào.
// Phát hiện bằng đồ thị bộ nhớ trong Xcode — chạy ĐỊNH KỲ, không phải chỉ
// khi có sự cố.

// ── ĐỒNG THỜI: TRÌNH BIÊN DỊCH BẮT LỖI THAY CHO BẠN ─────────────────
// actor: chỉ MỘT tác vụ chạm vào trạng thái bên trong tại một thời điểm.
// Không phải do bạn nhớ khoá — do trình biên dịch KHÔNG CHO viết sai.
actor SyncEngine {
    private var pendingOperations: [Operation] = []

    func enqueue(_ op: Operation) {
        pendingOperations.append(op)
    }
}

// Đánh dấu bằng KIỂU, và trình biên dịch từ chối biên dịch nếu gọi từ
// luồng nền. Giá trị thật không phải viết ngắn hơn mà là: lỗi đồng thời —
// loại khó tái hiện nhất, xuất hiện một lần trong nghìn lần chạy, chỉ trên
// máy người dùng — bị bắt ở THỜI ĐIỂM BIÊN DỊCH.
@MainActor
final class FeedViewModel2: ObservableObject {
    @Published var posts: [Post] = []
}

// ── MÃ THÔNG BÁO ĐĂNG NHẬP KHÔNG BAO GIỜ Ở KHO THÔNG THƯỜNG ─────────
// Đây là lỗi phổ biến nhất trong các ứng dụng tự học. Kho khoá bảo mật của
// hệ thống mã hoá bằng phần cứng và KHÔNG lộ ra khi máy bị sao lưu.
struct KeychainItem {
    let account: String
    let service: String
    let accessGroup: String?   // chia sẻ được giữa app và tiện ích mở rộng
    let syncsToICloud: Bool    // cân nhắc kỹ: tiện lợi đổi lấy bề mặt tấn công
}

// ── LƯU TRẠNG THÁI KHI VÀO NỀN, ĐỪNG CHỜ LÚC BỊ ĐÓNG ────────────────
// Khác biệt thực tế quan trọng nhất so với Android: bị kết thúc từ trạng
// thái đóng băng thì KHÔNG có lời gọi nào báo trước.`,

  schemaCodeEn: `// ── THE LEAK CLASS GARBAGE-COLLECTED LANGUAGES DO NOT HAVE ──────────
// Swift frees an object when its reference count reaches zero — no
// collection pauses. But if A holds B STRONGLY and B holds A STRONGLY,
// neither count EVER reaches zero. The most common site is not object
// relationships but CLOSURES: a closure automatically holds everything it
// uses STRONGLY, including self.

class FeedViewModel {
    var posts: [Post] = []

    func load() {
        // ❌ LEAK: the closure holds self STRONGLY, self holds the closure
        // through the task.
        api.fetchPosts { result in
            self.posts = result
        }

        // ✓ CORRECT: [weak self] breaks the cycle. Handle self being nil,
        // because the screen may have closed before the network responded.
        api.fetchPosts { [weak self] result in
            guard let self else { return }
            self.posts = result
        }
    }
}

// ⚠️ What makes this unpleasant: THE APP STILL WORKS CORRECTLY. No
// exception, no error screen — it merely leaks a little each time that
// screen opens, and after half an hour the system terminates the app for
// exceeding its memory limit. The user reports "the app quits by itself"
// with NO stack trace anywhere.
// Catch it with Xcode's memory graph — run it ROUTINELY, not only during
// incidents.

// ── CONCURRENCY: THE COMPILER CATCHES IT FOR YOU ────────────────────
// actor: only ONE task touches the internal state at a time.
// Not because you remembered to lock — because the compiler WILL NOT let
// you write it wrongly.
actor SyncEngine {
    private var pendingOperations: [Operation] = []

    func enqueue(_ op: Operation) {
        pendingOperations.append(op)
    }
}

// Mark it in the TYPE and the compiler refuses to build if you call it from
// a background thread. The real value is not shorter code but that
// concurrency bugs — the hardest class to reproduce, appearing once in a
// thousand runs, only on a user's device — are caught AT COMPILE TIME.
@MainActor
final class FeedViewModel2: ObservableObject {
    @Published var posts: [Post] = []
}

// ── AUTH TOKENS NEVER BELONG IN ORDINARY STORAGE ────────────────────
// The most common mistake in self-taught applications. The system keychain
// is hardware-encrypted and excluded from device backups.
struct KeychainItem {
    let account: String
    let service: String
    let accessGroup: String?   // shareable between the app and its extensions
    let syncsToICloud: Bool    // consider carefully: convenience for attack surface
}

// ── SAVE STATE ON BACKGROUNDING, NOT WHEN ABOUT TO CLOSE ────────────
// The most important practical difference from Android: termination from
// the suspended state gives you NO callback whatsoever.`,
  schemaLang: 'swift',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Hiểu đếm tham chiếu và chu trình giữ nhau',
      titleEn: 'Understand reference counting and retain cycles',
      description:
        'Swift giải phóng đối tượng khi số tham chiếu về 0, nhưng nếu hai đối tượng giữ mạnh lẫn nhau thì số đếm không bao giờ về 0. Chỗ hay dính nhất là bao đóng — closure tự động giữ mạnh mọi thứ nó dùng kể cả self. Điều làm lỗi này khó chịu là ứng dụng vẫn chạy đúng: không ngoại lệ, không màn hình lỗi, chỉ rò thêm mỗi lần mở màn hình cho tới khi hệ thống kết thúc app mà không để lại vết ngăn xếp nào.',
      descriptionEn:
        'Swift frees objects when their reference count reaches zero, but two objects holding each other strongly never get there. The most common site is closures — they automatically hold everything they use strongly, including self. What makes it unpleasant is that the app still works correctly: no exception, no error screen, just a little more leaked each time until the system terminates it leaving no stack trace.',
    },
    {
      phase: 'BACKEND',
      title: 'Đồng thời an toàn nhờ hệ thống kiểu',
      titleEn: 'Concurrency made safe by the type system',
      description:
        'Dùng actor cho trạng thái dùng chung và @MainActor cho những gì phải chạy ở luồng chính. Giá trị thật không phải viết ngắn hơn mà là lỗi đồng thời — loại khó tái hiện nhất, xuất hiện một lần trong nghìn lần chạy, chỉ trên máy người dùng — bị bắt ở thời điểm biên dịch. Đây là một trong số ít trường hợp hệ thống kiểu đổi hẳn tính chất của một nhóm lỗi.',
      descriptionEn:
        'Use actors for shared state and @MainActor for anything that must run on the main thread. The real value is not brevity but that concurrency bugs — the hardest class to reproduce, appearing once in a thousand runs, only on a user\'s device — become compile errors. This is one of the few cases where a type system changes the character of an entire bug category.',
    },
    {
      phase: 'BACKEND',
      title: 'Chạy nền: chặt hơn Android, nên đừng phụ thuộc vào nó',
      titleEn: 'Background execution: stricter than Android, so do not depend on it',
      description:
        'Làm mới nền do hệ thống lên lịch dựa trên thói quen dùng của TỪNG người — người ít mở app thì gần như không bao giờ chạy. Việc dài phải giao cho phiên tải nền do hệ thống quản lý, vì ứng dụng có thể bị đóng băng bất cứ lúc nào. Hệ quả thiết kế: đừng xây tính năng dựa trên giả định app chạy nền được. Cần biết ngay thì đó là thông báo đẩy.',
      descriptionEn:
        'Background refresh is system-scheduled from EACH person\'s usage habits — infrequent users see it almost never. Long work must go to system-managed background sessions, because the app can be suspended at any moment. The design consequence: do not build features assuming background execution. If the user needs to know now, that is a push notification.',
    },
    {
      phase: 'BACKEND',
      title: 'Lưu trạng thái khi vào nền, vì không có cảnh báo trước khi bị đóng',
      titleEn: 'Save state on backgrounding, because termination gives no warning',
      description:
        'Sau vài giây ở nền, ứng dụng bị đóng băng và không chạy dòng mã nào — mọi thứ đang dở đều dừng lại ở đó. Khi hệ thống cần bộ nhớ, nó kết thúc app từ trạng thái đóng băng và KHÔNG có lời gọi nào báo trước. Đây là khác biệt thực tế quan trọng nhất so với Android: phải lưu ngay lúc chuyển sang nền chứ không chờ sự kiện sắp-đóng.',
      descriptionEn:
        'After a few seconds in the background the app is frozen and runs no code — anything in flight simply stops. When the system needs memory it terminates from that frozen state with NO callback. This is the most important practical difference from Android: save when entering the background rather than waiting for a will-terminate event.',
    },
    {
      phase: 'BACKEND',
      title: 'Mã thông báo vào kho khoá bảo mật, không vào kho thông thường',
      titleEn: 'Tokens in the secure keychain, never in ordinary storage',
      description:
        'Đây là lỗi phổ biến nhất trong các ứng dụng tự học: lưu mã thông báo đăng nhập ở kho lưu trữ thông thường thì nó lộ ra khi máy được sao lưu. Kho khoá bảo mật của hệ thống mã hoá bằng phần cứng và loại khỏi bản sao lưu. Cân nhắc kỹ tuỳ chọn đồng bộ qua iCloud — tiện lợi đổi lấy bề mặt tấn công rộng hơn.',
      descriptionEn:
        'The most common mistake in self-taught applications: storing auth tokens in ordinary storage exposes them in device backups. The system keychain is hardware-encrypted and excluded from backups. Weigh the iCloud-sync option carefully — convenience traded for a wider attack surface.',
    },
    {
      phase: 'DESIGN',
      title: 'Người gác cổng: đọc luật chơi TRƯỚC khi thiết kế',
      titleEn: 'The gatekeeper: read the rules BEFORE designing',
      description:
        'Vài quyết định kỹ thuật nghe hoàn toàn bình thường lại là lý do bị từ chối: chuỗi mô tả quyền quá chung chung, khai báo thu thập dữ liệu không khớp với thứ thư viện bên thứ ba gửi đi, theo dõi người dùng qua các ứng dụng khác, hoặc đi vòng hệ thống thanh toán của nền tảng. Bài học rộng hơn iOS: xây trên nền tảng của người khác thì ràng buộc của họ là ràng buộc kiến trúc của bạn.',
      descriptionEn:
        'Several ordinary-sounding technical decisions are rejection reasons: purpose strings that are too generic, data declarations that do not match what a third-party library actually sends, cross-app tracking, or routing around the platform payment system. The lesson generalises beyond iOS: build on someone else\'s platform and their constraints are your architectural constraints.',
    },
    {
      phase: 'FRONTEND',
      title: 'Ưu tiên ngoại tuyến và trợ năng',
      titleEn: 'Offline-first and accessibility',
      description:
        'Cùng nguyên tắc như bài Android: DB trên máy là nguồn sự thật, mạng chỉ đồng bộ, localId sinh trên máy để tạo được khi ngoại tuyến, và khoá lặp lại cho hàng chờ. Thêm vào đó là trợ năng: bật VoiceOver và duyệt hết ứng dụng phải dùng được — trên iOS đây vừa là yêu cầu chất lượng vừa là thứ vòng duyệt có thể để ý.',
      descriptionEn:
        'The same principles as the Android study: the local database is the source of truth, the network merely synchronises, device-generated localIds enable offline creation, and the queue carries idempotency keys. Add accessibility: the whole app must be usable with VoiceOver — on iOS that is both a quality requirement and something review may notice.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bộ nhớ định kỳ, không phải chỉ khi có sự cố',
      titleEn: 'Check memory routinely, not only during incidents',
      description:
        'Mở và đóng một màn hình 50 lần rồi xem bộ nhớ có quay về mức ban đầu không. Mở đồ thị bộ nhớ trong Xcode để tìm chu trình giữ nhau. Biên dịch với kiểm tra đồng thời ở mức chặt và yêu cầu không cảnh báo nào. Và chạy trên thiết bị CŨ NHẤT còn hỗ trợ chứ không chỉ máy đời cao — đó là nơi lỗi hiệu năng lộ ra.',
      descriptionEn:
        'Open and close one screen 50 times and check whether memory returns to baseline. Open Xcode\'s memory graph to find retain cycles. Build with strict concurrency checking and require zero warnings. And run on the OLDEST supported device rather than only recent hardware — that is where performance problems surface.',
    },
  ],

  features: [
    { title: 'Ứng dụng SwiftUI ưu tiên ngoại tuyến', titleEn: 'An offline-first SwiftUI application', description: 'DB trên máy là nguồn sự thật, hàng chờ đồng bộ có khoá lặp lại.', descriptionEn: 'Local database as source of truth, with an idempotent sync queue.', status: 'PLANNED' },
    { title: 'Trạng thái dùng chung an toàn bằng actor', titleEn: 'Actor-protected shared state', description: 'Tranh chấp dữ liệu thành lỗi biên dịch chứ không phải lỗi lúc chạy.', descriptionEn: 'Data races become compile errors rather than runtime failures.', status: 'PLANNED' },
    { title: 'Phiên tải nền do hệ thống quản lý', titleEn: 'System-managed background sessions', description: 'Tải lên hoàn tất kể cả khi người dùng đã chuyển sang app khác.', descriptionEn: 'Uploads complete even after the user switches away.', status: 'PLANNED' },
    { title: 'Lưu trạng thái ngay khi vào nền', titleEn: 'State saved on entering the background', description: 'Không chờ sự kiện sắp-đóng, vì nó không tồn tại.', descriptionEn: 'Never waiting for a will-terminate event, because there is none.', status: 'PLANNED' },
    { title: 'Mã thông báo trong kho khoá bảo mật', titleEn: 'Tokens in the secure keychain', description: 'Mã hoá bằng phần cứng và loại khỏi bản sao lưu thiết bị.', descriptionEn: 'Hardware-encrypted and excluded from device backups.', status: 'PLANNED' },
    { title: 'Khai báo quyền riêng tư khớp thực tế', titleEn: 'Privacy declarations matching reality', description: 'Kiểm mọi thư viện bên thứ ba xem chúng thật sự gửi gì đi.', descriptionEn: 'Auditing every third-party library for what it actually sends.', status: 'PLANNED' },
    { title: 'Chuỗi mô tả quyền nói rõ mục đích', titleEn: 'Purpose strings that state the purpose', description: 'Cụ thể dùng để làm gì, không phải câu chung chung.', descriptionEn: 'Specific about the use, not a generic sentence.', status: 'PLANNED' },
    { title: 'Trợ năng đầy đủ', titleEn: 'Full accessibility support', description: 'Mọi điều khiển đọc được bằng VoiceOver, dùng được cỡ chữ lớn.', descriptionEn: 'Every control announced by VoiceOver, usable at large text sizes.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Swift — Automatic Reference Counting', titleEn: 'Swift — Automatic Reference Counting', url: 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/', type: 'LINK', description: 'Chương giải thích chu trình giữ nhau và cách phá bằng tham chiếu yếu — đọc kỹ phần về bao đóng.', descriptionEn: 'The chapter on retain cycles and breaking them with weak references — read the closure section closely.' },
    { title: 'Swift Concurrency — Actors and data-race safety', titleEn: 'Swift Concurrency — Actors and data-race safety', url: 'https://developer.apple.com/documentation/swift/concurrency', type: 'LINK', description: 'Cách hệ thống kiểu biến tranh chấp dữ liệu thành lỗi biên dịch.', descriptionEn: 'How the type system turns data races into compile errors.' },
    { title: 'Apple — App Review Guidelines', titleEn: 'Apple — App Review Guidelines', url: 'https://developer.apple.com/app-store/review/guidelines/', type: 'LINK', description: 'Đọc TRƯỚC khi thiết kế, không phải sau khi bị từ chối lần đầu.', descriptionEn: 'Read this BEFORE designing, not after the first rejection.' },
    { title: 'Apple — Privacy manifest files', titleEn: 'Apple — Privacy manifest files', url: 'https://developer.apple.com/documentation/bundleresources/privacy_manifest_files', type: 'LINK', description: 'Khai báo thu thập dữ liệu, kể cả những gì thư viện bên thứ ba làm thay bạn.', descriptionEn: 'Declaring data collection, including what third-party libraries do on your behalf.' },
    { title: 'Apple — Keychain services', titleEn: 'Apple — Keychain services', url: 'https://developer.apple.com/documentation/security/keychain_services', type: 'LINK', description: 'Nơi đúng để lưu mã thông báo, và các mức bảo vệ chọn được.', descriptionEn: 'The right place for tokens, and the protection levels available.' },
  ],

  coreKnowledge: [
    { vi: 'Quản lý bộ nhớ bằng đếm tham chiếu và chu trình giữ nhau', en: 'Reference-counted memory management and retain cycles' },
    { vi: 'An toàn đồng thời được đảm bảo bởi hệ thống kiểu', en: 'Concurrency safety guaranteed by a type system' },
    { vi: 'Vòng đời ứng dụng iOS và trạng thái đóng băng', en: 'The iOS app lifecycle and the suspended state' },
    { vi: 'Giới hạn thực thi nền và cách thiết kế quanh chúng', en: 'Background execution limits and designing around them' },
    { vi: 'Lưu trữ bí mật: kho khoá bảo mật và các mức bảo vệ', en: 'Secret storage: the keychain and its protection levels' },
    { vi: 'Yêu cầu về quyền riêng tư và trách nhiệm với thư viện bên thứ ba', en: 'Privacy requirements and responsibility for third-party libraries' },
    { vi: 'Ràng buộc của nền tảng như ràng buộc kiến trúc', en: 'Platform constraints as architectural constraints' },
    { vi: 'Trợ năng như một yêu cầu, không phải một tính năng thêm', en: 'Accessibility as a requirement rather than an add-on' },
  ],

  portfolioBonus: [
    { vi: 'Ảnh chụp đồ thị bộ nhớ trước và sau khi sửa một chu trình giữ nhau', en: 'Memory graph screenshots before and after fixing a retain cycle' },
    { vi: 'Số đo bộ nhớ khi mở/đóng một màn hình 50 lần', en: 'Memory measurements across 50 open/close cycles of one screen' },
    { vi: 'Video tải lên hoàn tất sau khi đã chuyển sang ứng dụng khác', en: 'A video of an upload completing after switching apps' },
    { vi: 'Bảng đối chiếu khai báo quyền riêng tư với lưu lượng mạng thật', en: 'A table reconciling the privacy declaration against real network traffic' },
    { vi: 'Video duyệt toàn bộ ứng dụng bằng VoiceOver', en: 'A video traversing the entire app with VoiceOver' },
  ],

  completionOutcomes: [
    { vi: 'Quản lý bộ nhớ thủ công ở mức khái niệm, không dựa vào bộ thu gom rác', en: 'Reason about memory without a garbage collector to fall back on' },
    { vi: 'Dùng hệ thống kiểu để loại bỏ cả một nhóm lỗi', en: 'Use a type system to eliminate an entire category of bugs' },
    { vi: 'Thiết kế trong ràng buộc của một nền tảng do người khác kiểm soát', en: 'Design within the constraints of a platform someone else controls' },
    { vi: 'Xử lý dữ liệu nhạy cảm đúng chuẩn nền tảng yêu cầu', en: 'Handle sensitive data to the standard the platform actually enforces' },
    { vi: 'Coi quyền riêng tư và trợ năng là yêu cầu sản phẩm', en: 'Treat privacy and accessibility as product requirements' },
  ],

  bodyMdx,
  bodyMdxEn,
};
