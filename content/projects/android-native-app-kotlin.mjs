/**
 * Extra project (mobile) — Android Native App (Kotlin).
 *
 * Fills the Kotlin/Android gap the source roadmap only mentioned in passing.
 * The organising idea: every web project assumed the process stays alive.
 * On Android it does not, and the OS prioritises battery and memory over
 * your app — correctly.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./android-native-app-kotlin.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./android-native-app-kotlin.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'android-native-app-kotlin',
  title: 'Android Native App (Kotlin)',
  titleEn: 'Android Native App (Kotlin)',
  description:
    'Ứng dụng Android ưu tiên ngoại tuyến viết bằng Kotlin. Mọi dự án web trong lộ trình đều giả định tiến trình còn sống trong lúc người dùng đang dùng — trên Android giả định đó SAI, và toàn bộ kiến trúc phải xây quanh việc hệ điều hành có thể giết tiến trình bất cứ lúc nào.',
  descriptionEn:
    'An offline-first Android app in Kotlin. Every web project in this roadmap assumed the process stays alive while the user is using it — on Android that is FALSE, and the whole architecture must be built around the OS killing your process at any moment.',
  techStack: [
    'Kotlin', 'Jetpack Compose', 'Room', 'WorkManager', 'Coroutines / Flow',
    'Hilt', 'Retrofit', 'DataStore', 'Firebase Cloud Messaging', 'Espresso',
  ],
  role: 'Android (một người)',
  roleEn: 'Android (solo)',
  duration: '5–6 tuần',
  durationEn: '5–6 weeks',
  status: 'PLANNING',
  category: 'Mobile',
  difficulty: 'INTERMEDIATE',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// KHÔNG tự hẹn giờ chạy nền. Từ Android 6 có chế độ ngủ đông: máy nằm yên
// một lúc thì hệ thống GOM mọi tác vụ nền và chỉ cho chạy trong những khoảng
// ngắn cách nhau ngày càng xa. Nghe vô lý cho tới khi nhớ ra người dùng có
// 80 ứng dụng — mỗi cái tự cho quyền thức mỗi 15 phút thì máy hết pin trước
// bữa trưa.
//
// Cách đúng: KHAI BÁO ĐIỀU KIỆN và để hệ thống chọn thời điểm, vì nó biết
// pin còn bao nhiêu, đang sạc không, mạng loại gì.

val syncWork = PeriodicWorkRequestBuilder<SyncWorker>(6, TimeUnit.HOURS)
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.UNMETERED)   // đợi Wi-Fi
            .setRequiresBatteryNotLow(true)
            .build()
    )
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
    .build()

WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "sync",
    ExistingPeriodicWorkPolicy.KEEP,   // KHÔNG tạo trùng mỗi lần mở ứng dụng
    syncWork,
)

// ── DỮ LIỆU TRÊN MÁY LÀ NGUỒN SỰ THẬT ────────────────────────────────
// Trên web, mất mạng là ngoại lệ. Trên di động nó là TRẠNG THÁI BÌNH THƯỜNG:
// tàu điện ngầm, thang máy, chuyển giữa Wi-Fi và di động. Nên giao diện đọc
// từ DB trên máy, còn mạng chỉ là thứ đồng bộ với nó.

@Entity(tableName = "local_entities")
data class LocalEntity(
    // Sinh trên MÁY — đây là điều kiện để TẠO ĐƯỢC dữ liệu khi ngoại tuyến,
    // vì không thể chờ máy chủ cấp id.
    @PrimaryKey val localId: String,
    // null cho tới khi máy chủ xác nhận. Mọi tham chiếu nội bộ vẫn dùng
    // localId để đồng bộ xong không phải sửa lại hàng loạt.
    val remoteId: String?,
    val content: String,
    val syncState: SyncState,          // LOCAL_ONLY PENDING SYNCED CONFLICT
    val updatedAt: Long,
    val serverUpdatedAt: Long?,        // để phát hiện xung đột
)

@Entity(tableName = "sync_queue")
data class SyncQueueItem(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val localId: String,
    val operation: Operation,          // CREATE UPDATE DELETE
    // Mạng chập chờn thì gửi lại là chuyện thường — máy chủ PHẢI khử được
    // trùng. Đúng bài học từ Event-Driven Microservices.
    val idempotencyKey: String,
    val attemptCount: Int = 0,
    val nextAttemptAt: Long,           // lùi theo hàm mũ
    // ⚠️ Lỗi 400 nghĩa là yêu cầu SAI — thử lại một nghìn lần vẫn sai, chỉ
    // tốn pin và làm đầy hàng chờ. CHỈ 5xx và lỗi mạng mới đáng thử lại.
    val retryable: Boolean = true,
)

// ── BA NƠI GIỮ TRẠNG THÁI, chọn sai là nguồn phần lớn lỗi ────────────
//   biến trong màn hình     : mất khi xoay  · mất khi giết tiến trình
//   state holder theo vòng đời: sống qua xoay · MẤT khi giết tiến trình
//   túi trạng thái được lưu  : sống cả hai   ← chữ người dùng đã gõ
//   DB trên máy              : sống cả hai   ← mọi thứ người dùng tạo ra
//
// Quy tắc: bất cứ thứ gì người dùng ĐÃ GÕ hoặc ĐÃ CHỌN đều phải nằm ở hai
// hàng cuối. Dữ liệu tải từ mạng thì tải lại được, nhưng mười phút gõ của
// họ thì KHÔNG.`,

  schemaCodeEn: `// Do NOT schedule your own background timer. Since Android 6 there is Doze:
// an idle device makes the system BATCH all background work into short
// windows spaced increasingly far apart. That sounds unreasonable until you
// remember the user has 80 apps — if each granted itself the right to wake
// every 15 minutes, the battery would be dead before lunch.
//
// The correct approach: DECLARE CONSTRAINTS and let the system choose the
// moment, because it knows the battery level, charging state and network type.

val syncWork = PeriodicWorkRequestBuilder<SyncWorker>(6, TimeUnit.HOURS)
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.UNMETERED)   // wait for Wi-Fi
            .setRequiresBatteryNotLow(true)
            .build()
    )
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
    .build()

WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "sync",
    ExistingPeriodicWorkPolicy.KEEP,   // do NOT duplicate on every launch
    syncWork,
)

// ── THE LOCAL DATABASE IS THE SOURCE OF TRUTH ────────────────────────
// On the web, losing connectivity is an exception. On mobile it is the
// NORMAL STATE: underground trains, lifts, Wi-Fi/cellular handoffs. So the
// UI reads from the local DB and the network merely synchronises with it.

@Entity(tableName = "local_entities")
data class LocalEntity(
    // Generated ON DEVICE — this is what makes offline creation possible,
    // because you cannot wait for the server to assign an id.
    @PrimaryKey val localId: String,
    // null until the server confirms. Internal references keep using localId
    // so a successful sync requires no mass rewriting.
    val remoteId: String?,
    val content: String,
    val syncState: SyncState,          // LOCAL_ONLY PENDING SYNCED CONFLICT
    val updatedAt: Long,
    val serverUpdatedAt: Long?,        // for conflict detection
)

@Entity(tableName = "sync_queue")
data class SyncQueueItem(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val localId: String,
    val operation: Operation,          // CREATE UPDATE DELETE
    // Flaky networks make resends routine — the server MUST deduplicate.
    // The lesson from Event-Driven Microservices.
    val idempotencyKey: String,
    val attemptCount: Int = 0,
    val nextAttemptAt: Long,           // exponential backoff
    // ⚠️ A 400 means the request is WRONG — retrying a thousand times keeps
    // it wrong, draining battery and clogging the queue. ONLY 5xx and
    // network errors deserve retries.
    val retryable: Boolean = true,
)

// ── THREE PLACES TO KEEP STATE, and the wrong one causes most bugs ───
//   a field in the screen      : lost on rotation · lost on process death
//   lifecycle-scoped holder    : survives rotation · LOST on process death
//   the saved state bundle     : survives both     ← what the user typed
//   the on-device database     : survives both     ← everything they created
//
// The rule: anything the user TYPED or CHOSE belongs in the last two rows.
// Network data can be refetched, but their ten minutes of typing CANNOT.`,
  schemaLang: 'kotlin',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chấp nhận rằng tiến trình có thể bị giết bất cứ lúc nào',
      titleEn: 'Accept that the process can be killed at any moment',
      description:
        'Người dùng chuyển sang ứng dụng khác rồi quay lại, và trong khoảng đó hệ điều hành đã giết tiến trình để lấy bộ nhớ. Android dựng lại màn hình từ đầu và giả vờ như không có gì xảy ra. Đây KHÔNG phải trường hợp hiếm — trên máy ít RAM nó xảy ra trong vòng vài phút. Bật "Không giữ hoạt động" trong tuỳ chọn nhà phát triển là mô phỏng được ngay.',
      descriptionEn:
        'A user switches away and returns, and in between the OS killed the process to reclaim memory. Android rebuilds the screen and pretends nothing happened. This is NOT a rare edge case — on low-RAM devices it happens within minutes. Enabling "Don\'t keep activities" in developer options reproduces it immediately.',
    },
    {
      phase: 'DESIGN',
      title: 'Chọn đúng nơi giữ trạng thái',
      titleEn: 'Choose the right place to keep state',
      description:
        'Ba nơi với ba đặc tính khác nhau: biến trong màn hình mất cả khi xoay, state holder theo vòng đời sống qua xoay nhưng chết theo tiến trình, còn túi trạng thái được lưu và DB trên máy thì sống qua cả hai. Quy tắc gọn: bất cứ thứ gì người dùng đã gõ hoặc đã chọn đều phải nằm ở hai loại cuối — dữ liệu mạng tải lại được, mười phút gõ của họ thì không.',
      descriptionEn:
        'Three places with three different properties: screen fields lose everything even on rotation, lifecycle-scoped holders survive rotation but die with the process, while the saved state bundle and the local database survive both. The short rule: anything the user typed or chose belongs in the last two — network data refetches, their ten minutes of typing does not.',
    },
    {
      phase: 'BACKEND',
      title: 'Đảo kiến trúc: DB trên máy là nguồn sự thật của giao diện',
      titleEn: 'Invert the architecture: the local DB is the UI\'s source of truth',
      description:
        'Trên di động, mất mạng là trạng thái bình thường chứ không phải ngoại lệ. Người dùng bấm thì ghi vào DB trên máy NGAY và giao diện cập nhật tức thì vì nó đọc từ DB; thao tác được xếp vào hàng chờ đồng bộ và đẩy lên khi có mạng. Cái giá là phải xử lý xung đột và phải quyết định hiện gì khi dữ liệu đang chờ — nhưng ứng dụng VẪN DÙNG ĐƯỢC khi mất mạng.',
      descriptionEn:
        'On mobile, no connectivity is the normal state rather than an exception. A tap writes to the local DB IMMEDIATELY and the UI updates instantly because it reads from the DB; the operation queues for sync and pushes when a network appears. The cost is handling conflicts and deciding what to show while pending — but the app STILL WORKS offline.',
    },
    {
      phase: 'BACKEND',
      title: 'Đồng bộ nền: khai báo điều kiện, không tự hẹn giờ',
      titleEn: 'Background sync: declare constraints, never schedule your own timer',
      description:
        'Chế độ ngủ đông gom mọi tác vụ nền vào những khoảng ngắn cách nhau ngày càng xa, và ứng dụng ở nền không được chạy dịch vụ tuỳ ý. Khai báo điều kiện (đợi Wi-Fi, pin không thấp) rồi để hệ thống chọn thời điểm. Với thứ THẬT SỰ cần tức thời thì đừng hỏi liên tục — dùng thông báo đẩy, vừa tiết kiệm pin nhất vừa nhanh nhất.',
      descriptionEn:
        'Doze batches background work into windows spaced increasingly far apart, and backgrounded apps may not run arbitrary services. Declare constraints (wait for Wi-Fi, battery not low) and let the system pick the moment. For things that GENUINELY need immediacy, do not poll — use push, which is simultaneously the most battery-efficient and the fastest option.',
    },
    {
      phase: 'BACKEND',
      title: 'Hàng chờ đồng bộ: khoá lặp lại và phân biệt 4xx với 5xx',
      titleEn: 'The sync queue: idempotency keys and separating 4xx from 5xx',
      description:
        'Mạng chập chờn thì gửi lại là chuyện thường nên máy chủ phải khử được trùng — khoá lặp lại sinh trên máy, đúng bài học từ Event-Driven Microservices. Và phải tách 4xx khỏi 5xx: lỗi 400 nghĩa là yêu cầu sai, thử lại một nghìn lần vẫn sai và chỉ tốn pin, làm đầy hàng chờ, chặn các mục khác phía sau.',
      descriptionEn:
        'Flaky networks make resends routine, so the server must deduplicate — device-generated idempotency keys, the lesson from Event-Driven Microservices. And separate 4xx from 5xx: a 400 means the request is wrong, retrying keeps it wrong, and it merely drains battery, clogs the queue and blocks items behind it.',
    },
    {
      phase: 'FRONTEND',
      title: 'Quyền truy cập: xin đúng lúc, và chuẩn bị cho câu trả lời "không"',
      titleEn: 'Permissions: ask in context, and prepare for "no"',
      description:
        'Xin toàn bộ quyền lúc mở app lần đầu là cách chắc chắn để bị từ chối — người dùng chưa biết ứng dụng làm gì. Xin đúng lúc tính năng cần và giải thích trước. Quan trọng hơn là chuẩn bị cho việc bị từ chối: từ chối vĩnh viễn thì hệ thống ngừng hiện hộp thoại nên phải phát hiện được và hướng dẫn vào cài đặt, và tính năng phải suy giảm êm chứ không chặn người dùng ở màn hình "hãy cấp quyền".',
      descriptionEn:
        'Requesting everything at first launch reliably produces refusals — the user does not yet know what the app does. Ask when the feature needs it, with an explanation first. More importantly, prepare for refusal: a permanent denial stops the system showing the dialog, so detect it and direct users to settings, and features must degrade gracefully rather than trapping people on a "grant permission" screen.',
    },
    {
      phase: 'FRONTEND',
      title: 'Hiện rõ trạng thái đồng bộ cho người dùng',
      titleEn: 'Show sync state explicitly',
      description:
        'Người dùng cần biết bình luận của họ đã lên máy chủ hay còn đang chờ. Giả vờ mọi thứ đã xong rồi lặng lẽ thất bại là cách nhanh nhất để mất niềm tin — và trên di động điều đó xảy ra thường xuyên vì mất mạng là bình thường. Trạng thái LOCAL_ONLY, PENDING, SYNCED, CONFLICT đều phải nhìn thấy được ở giao diện.',
      descriptionEn:
        'Users need to know whether their comment reached the server or is still queued. Pretending everything succeeded then failing silently is the fastest way to lose trust — and on mobile it happens often, because losing connectivity is normal. The LOCAL_ONLY, PENDING, SYNCED and CONFLICT states must all be visible in the interface.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách chủ động phá: chế độ máy bay và giết tiến trình',
      titleEn: 'Verify by actively breaking things: airplane mode and process death',
      description:
        'Bật "Không giữ hoạt động", điền nửa biểu mẫu, chuyển app rồi quay lại — dữ liệu phải còn nguyên. Bật chế độ máy bay — mọi tính năng đọc và tạo đều phải dùng được. Tạo 20 mục khi ngoại tuyến rồi bật mạng — cả 20 đồng bộ, không cái nào trùng. Xoay màn hình 10 lần — không rò rỉ bộ nhớ. Và đo pin sau 24 giờ nền để xác nhận đồng bộ chạy đúng số lần dự kiến.',
      descriptionEn:
        'Enable "Don\'t keep activities", half-fill a form, switch away and back — data must be intact. Enable airplane mode — every read and create feature must work. Create 20 items offline then reconnect — all 20 sync, none duplicated. Rotate ten times — no memory leaks. And measure battery over 24 background hours to confirm sync ran the expected number of times.',
    },
  ],

  features: [
    { title: 'Ứng dụng ưu tiên ngoại tuyến', titleEn: 'An offline-first application', description: 'DB trên máy là nguồn sự thật, mọi tính năng dùng được khi mất mạng.', descriptionEn: 'The local database is the source of truth; everything works offline.', status: 'PLANNED' },
    { title: 'Sống sót qua giết tiến trình và xoay màn hình', titleEn: 'Survives process death and rotation', description: 'Trạng thái người dùng gõ nằm ở túi trạng thái được lưu hoặc DB.', descriptionEn: 'User-entered state lives in the saved state bundle or the database.', status: 'PLANNED' },
    { title: 'Hàng chờ đồng bộ có khoá lặp lại', titleEn: 'A sync queue with idempotency keys', description: 'Lùi theo hàm mũ, và không thử lại các lỗi 4xx vô ích.', descriptionEn: 'Exponential backoff, and no pointless retries of 4xx responses.', status: 'PLANNED' },
    { title: 'Đồng bộ nền theo điều kiện hệ thống', titleEn: 'Constraint-based background sync', description: 'Đợi Wi-Fi và pin đủ, để hệ điều hành chọn thời điểm.', descriptionEn: 'Waits for Wi-Fi and battery, letting the OS choose the moment.', status: 'PLANNED' },
    { title: 'Thông báo đẩy cho việc cần tức thời', titleEn: 'Push notifications for immediate work', description: 'Máy chủ chủ động báo thay vì ứng dụng hỏi liên tục.', descriptionEn: 'The server announces rather than the app polling.', status: 'PLANNED' },
    { title: 'Quyền xin đúng lúc, suy giảm êm', titleEn: 'Contextual permissions with graceful degradation', description: 'Từ chối vĩnh viễn thì hướng dẫn vào cài đặt, không hỏi lại.', descriptionEn: 'Permanent denial directs to settings rather than asking again.', status: 'PLANNED' },
    { title: 'Chỉ báo trạng thái đồng bộ ở giao diện', titleEn: 'Sync state indicators in the interface', description: 'Người dùng luôn biết dữ liệu đã lên máy chủ hay còn chờ.', descriptionEn: 'Users always know whether data reached the server or is pending.', status: 'PLANNED' },
    { title: 'Kiểm thử tự động nhiều màn hình và phiên bản', titleEn: 'Automated tests across sizes and versions', description: 'Chạy trên phiên bản Android thấp nhất và cao nhất hỗ trợ.', descriptionEn: 'Running on both the lowest and highest supported Android versions.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Android — Guide to app architecture', titleEn: 'Android — Guide to app architecture', url: 'https://developer.android.com/topic/architecture', type: 'LINK', description: 'Kiến trúc chính thức, gồm cả nguyên tắc DB trên máy là nguồn sự thật của giao diện.', descriptionEn: 'The official architecture guidance, including local-database-as-source-of-truth.' },
    { title: 'Android — Processes and app lifecycle', titleEn: 'Android — Processes and app lifecycle', url: 'https://developer.android.com/guide/components/activities/process-lifecycle', type: 'LINK', description: 'Chính tài liệu giải thích khi nào và vì sao hệ điều hành giết tiến trình của bạn.', descriptionEn: 'The documentation explaining when and why the OS kills your process.' },
    { title: 'Android — Optimize for Doze and App Standby', titleEn: 'Android — Optimize for Doze and App Standby', url: 'https://developer.android.com/training/monitoring-device-state/doze-standby', type: 'LINK', description: 'Vì sao tác vụ nền bị gom lại, và cách khai báo điều kiện thay vì chống lại.', descriptionEn: 'Why background work is batched, and how to declare constraints instead of fighting it.' },
    { title: 'Android — WorkManager', titleEn: 'Android — WorkManager', url: 'https://developer.android.com/topic/libraries/architecture/workmanager', type: 'LINK', description: 'Công cụ đúng cho việc nền cần đảm bảo chạy, kể cả sau khi khởi động lại máy.', descriptionEn: 'The right tool for background work that must run, even across device reboots.' },
    { title: 'Android — Request app permissions', titleEn: 'Android — Request app permissions', url: 'https://developer.android.com/training/permissions/requesting', type: 'LINK', description: 'Xin quyền đúng lúc, và cách phát hiện trường hợp bị từ chối vĩnh viễn.', descriptionEn: 'Requesting in context, and detecting the permanently-denied case.' },
  ],

  coreKnowledge: [
    { vi: 'Vòng đời tiến trình trên di động và việc bị hệ điều hành thu hồi', en: 'Mobile process lifecycles and OS-initiated reclamation' },
    { vi: 'Ba tầng lưu trạng thái và tiêu chí chọn giữa chúng', en: 'Three layers of state storage and how to choose between them' },
    { vi: 'Kiến trúc ưu tiên ngoại tuyến và đồng bộ có hàng chờ', en: 'Offline-first architecture and queued synchronisation' },
    { vi: 'Ràng buộc thực thi nền và kinh tế học pin của một chiếc máy', en: 'Background execution limits and the battery economics of one device' },
    { vi: 'Tính lặp lại được nhìn từ phía client', en: 'Idempotency from the client side' },
    { vi: 'Mô hình quyền truy cập và thiết kế cho việc bị từ chối', en: 'Permission models and designing for refusal' },
    { vi: 'Kotlin coroutines và luồng dữ liệu phản ứng', en: 'Kotlin coroutines and reactive data flows' },
    { vi: 'Phân mảnh thiết bị: nhiều kích thước màn hình, nhiều phiên bản hệ điều hành', en: 'Device fragmentation: many screen sizes, many OS versions' },
  ],

  portfolioBonus: [
    { vi: 'Video bật "Không giữ hoạt động" và chứng minh dữ liệu vẫn còn', en: 'A video enabling "Don\'t keep activities" and proving data survives' },
    { vi: 'Video dùng trọn ứng dụng ở chế độ máy bay rồi đồng bộ khi bật mạng', en: 'A video using the whole app in airplane mode then syncing on reconnect' },
    { vi: 'Số đo pin trước và sau khi chuyển từ tự hẹn giờ sang khai báo điều kiện', en: 'Battery measurements before and after moving from timers to constraints' },
    { vi: 'Mục README về mô hình đồng bộ: xung đột được giải quyết ra sao', en: 'A README on the sync model: how conflicts are resolved' },
    { vi: 'Ảnh chụp trên nhiều kích thước màn hình, gồm cả máy tính bảng', en: 'Screenshots across screen sizes, including tablets' },
  ],

  completionOutcomes: [
    { vi: 'Viết được ứng dụng cho môi trường mà hệ điều hành kiểm soát vòng đời', en: 'Write applications for an environment where the OS controls the lifecycle' },
    { vi: 'Thiết kế đồng bộ dữ liệu chịu được mạng không ổn định', en: 'Design data synchronisation that survives unreliable networks' },
    { vi: 'Coi pin và bộ nhớ là ràng buộc thiết kế, không phải chi tiết tối ưu', en: 'Treat battery and memory as design constraints rather than optimisation details' },
    { vi: 'Xin quyền theo cách người dùng chấp nhận được', en: 'Request permissions in a way users will accept' },
    { vi: 'Kiểm thử bằng cách chủ động tạo ra điều kiện xấu', en: 'Test by deliberately creating adverse conditions' },
  ],

  bodyMdx,
  bodyMdxEn,
};
