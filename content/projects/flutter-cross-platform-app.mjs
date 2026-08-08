/**
 * Extra project (mobile) — Flutter Cross-platform App.
 *
 * The honest accounting of cross-platform: what you save is the easy part,
 * what remains is the hard part. Everything follows from one architectural
 * decision — Flutter draws its own pixels rather than using native widgets,
 * so it is consistent everywhere and native nowhere.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./flutter-cross-platform-app.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./flutter-cross-platform-app.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'flutter-cross-platform-app',
  title: 'Flutter Cross-platform App',
  titleEn: 'Flutter Cross-platform App',
  description:
    'Một mã nguồn chạy trên Android, iOS và web. Bài này về việc hiểu CHÍNH XÁC bạn tiết kiệm được gì — vì câu trả lời không phải "mọi thứ", và mọi ưu nhược điểm đều chảy ra từ một quyết định bất thường: Flutter không dùng thành phần giao diện của hệ điều hành mà tự vẽ từng điểm ảnh.',
  descriptionEn:
    'One codebase across Android, iOS and web. This study is about understanding EXACTLY what you save — because the answer is not "everything", and every advantage and drawback flows from one unusual decision: Flutter draws its own pixels rather than using native widgets.',
  techStack: [
    'Dart', 'Flutter', 'Riverpod', 'Drift', 'Dio', 'Platform channels',
    'Kotlin', 'Swift', 'Melos', 'Fastlane',
  ],
  role: 'Mobile đa nền tảng (một người)',
  roleEn: 'Cross-platform mobile (solo)',
  duration: '5–6 tuần',
  durationEn: '5–6 weeks',
  status: 'PLANNING',
  category: 'Mobile',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/flutter-cross-platform-app.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// ── BẠN TIẾT KIỆM ĐƯỢC GÌ: CON SỐ TRUNG THỰC ────────────────────────
//   mô hình dữ liệu, quy tắc nghiệp vụ  ~100%  ← giá trị thật nằm ở đây
//   mạng, phân tích dữ liệu, đồng bộ     ~95%
//   quản lý trạng thái, điều hướng       ~90%
//   bố cục và thành phần giao diện       ~70%
//   tích hợp nền tảng                    ~20%  ← camera, sinh trắc, thông báo
//   dựng, ký, phát hành                    0%  ← tách biệt hoàn toàn
//
// ⚠️ PHẦN BẠN TIẾT KIỆM ĐƯỢC LÀ PHẦN DỄ, PHẦN CÒN LẠI LÀ PHẦN KHÓ.
// Viết lại một danh sách bằng hai ngôn ngữ là buồn tẻ nhưng đơn giản. Tích
// hợp sinh trắc học đúng cách trên cả hai nền tảng thì vẫn cần hiểu cả hai —
// Flutter không xoá được yêu cầu đó, nó chỉ DỜI CHỖ.
//
// Nói cách khác: Flutter không cho phép bạn khỏi phải HỌC nền tảng, nó cho
// phép bạn không phải VIẾT mọi thứ hai lần. Hai điều đó rất khác nhau.

// ── KÊNH NỀN TẢNG: NƠI KHOẢN TIẾT KIỆM DỪNG LẠI ─────────────────────
class BiometricAuth {
  static const _channel = MethodChannel('app/biometric');

  static Future<bool> authenticate(String reason) async {
    try {
      return await _channel
              .invokeMethod<bool>('authenticate', {'reason': reason})
              // Kênh có thể KHÔNG BAO GIỜ trả lời — không có gì đảm bảo
              // phía gốc phản hồi. LUÔN đặt thời hạn chờ.
              .timeout(const Duration(seconds: 30)) ??
          false;
    } on PlatformException catch (e) {
      // BẮT BUỘC xử lý: mỗi nền tảng ném mã lỗi KHÁC NHAU, và chúng
      // KHÔNG được chuẩn hoá giúp bạn. Ánh xạ ở tầng bộ chuyển đổi,
      // đừng để lỗi riêng của nền tảng lọt lên giao diện.
      if (e.code == 'NOT_ENROLLED') return false;
      rethrow;
    }
  }
}
// Sau đó vẫn phải viết MỘT bản Kotlin và MỘT bản Swift — chính là công
// việc bạn tưởng đã tránh được.

// ── BỘ CHUYỂN ĐỔI NỀN TẢNG ──────────────────────────────────────────
class PlatformAdapter {
  final String capability;    // biometric camera notifications secureStorage
  final String androidImpl;   // Kotlin
  final String iosImpl;       // Swift
  // ⚠️ Rất nhiều khả năng gốc KHÔNG CÓ trên web. Nhắm cả ba đích thì mỗi
  // khả năng cần một ĐƯỜNG LUI. Phát hiện lúc thiết kế rẻ hơn nhiều so với
  // phát hiện lúc bản web trắng màn hình.
  final bool webSupported;

  const PlatformAdapter({
    required this.capability,
    required this.androidImpl,
    required this.iosImpl,
    required this.webSupported,
  });
}

// ── QUYẾT ĐỊNH SẢN PHẨM PHẢI ĐƯA RA TƯỜNG MINH ─────────────────────
// Người dùng iOS mong vuốt mép trái để lùi; người dùng Android mong nút
// quay lại hệ thống hoạt động. Hộp thoại, chọn ngày, độ nảy khi cuộn quá —
// tất cả đều khác. Cách trung dung phần lớn đội chọn:
//   · bố cục và luồng          : dùng chung
//   · ĐIỀU HƯỚNG và CỬ CHỈ     : theo nền tảng
//   · hộp thoại, chọn ngày     : theo nền tảng
//   · thành phần thương hiệu   : dùng chung
// Mặc định không suy nghĩ là ra một ứng dụng trông lạ ở CẢ HAI nơi.`,

  schemaCodeEn: `// ── WHAT YOU ACTUALLY SAVE: THE HONEST NUMBERS ──────────────────────
//   data models, business rules   ~100%  ← the real value sits here
//   networking, parsing, sync      ~95%
//   state management, navigation   ~90%
//   layout and UI components       ~70%
//   platform integration           ~20%  ← camera, biometrics, notifications
//   build, signing, release          0%  ← entirely separate
//
// ⚠️ WHAT YOU SAVE IS THE EASY PART; WHAT REMAINS IS THE HARD PART.
// Writing a list screen twice is tedious but simple. Integrating biometrics
// correctly on both platforms still requires understanding both — Flutter
// does not remove that requirement, it RELOCATES it.
//
// Put differently: Flutter does not let you avoid LEARNING the platforms,
// it lets you avoid WRITING everything twice. Very different things.

// ── PLATFORM CHANNELS: WHERE THE SAVINGS STOP ───────────────────────
class BiometricAuth {
  static const _channel = MethodChannel('app/biometric');

  static Future<bool> authenticate(String reason) async {
    try {
      return await _channel
              .invokeMethod<bool>('authenticate', {'reason': reason})
              // A channel may NEVER respond — nothing guarantees the native
              // side answers. ALWAYS set a timeout.
              .timeout(const Duration(seconds: 30)) ??
          false;
    } on PlatformException catch (e) {
      // MANDATORY handling: each platform throws DIFFERENT error codes, and
      // they are NOT normalised for you. Map them in the adapter layer and
      // never let platform-specific errors reach the UI.
      if (e.code == 'NOT_ENROLLED') return false;
      rethrow;
    }
  }
}
// You still write ONE Kotlin implementation and ONE Swift implementation —
// precisely the work you thought you had avoided.

// ── THE PLATFORM ADAPTER ────────────────────────────────────────────
class PlatformAdapter {
  final String capability;    // biometric camera notifications secureStorage
  final String androidImpl;   // Kotlin
  final String iosImpl;       // Swift
  // ⚠️ Many native capabilities simply DO NOT EXIST on the web. Targeting all
  // three means every capability needs a FALLBACK. Discovering that at design
  // time is far cheaper than discovering it when the web build goes blank.
  final bool webSupported;

  const PlatformAdapter({
    required this.capability,
    required this.androidImpl,
    required this.iosImpl,
    required this.webSupported,
  });
}

// ── A PRODUCT DECISION THAT MUST BE MADE EXPLICITLY ────────────────
// iOS users expect a left-edge swipe back; Android users expect the system
// back gesture to work. Dialogs, date pickers, overscroll behaviour — all
// differ. The middle ground most teams choose:
//   · layout and flows        : shared
//   · NAVIGATION and GESTURES : per platform
//   · dialogs, date pickers   : per platform
//   · brand components        : shared
// Defaulting without thinking produces an app that feels foreign on BOTH.`,
  schemaLang: 'dart',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Hiểu hệ quả của việc Flutter tự vẽ điểm ảnh',
      titleEn: 'Understand the consequences of Flutter drawing its own pixels',
      description:
        'Flutter không dùng thành phần giao diện của hệ điều hành mà vẽ lên khung vẽ trống. Được: giống hệt nhau trên mọi nền tảng, không có cầu nối cho phần vẽ nên mượt, kiểm soát hoàn toàn hoạt ảnh. Mất: trợ năng và nhập liệu phải tự cài đặt lại, hệ điều hành đổi phong cách thì phải đuổi theo, gói ứng dụng nặng hơn vì mang theo bộ máy vẽ. Trợ năng là hệ quả gặp sớm nhất mà ít người lường trước.',
      descriptionEn:
        'Flutter paints onto a blank canvas rather than using OS components. You gain identical rendering everywhere, smoothness with no rendering bridge, and complete animation control. You lose free accessibility and text input, must chase OS restyling, and ship a larger bundle carrying the engine. Accessibility is the earliest consequence and the least anticipated.',
    },
    {
      phase: 'DESIGN',
      title: 'Kế toán trung thực: tiết kiệm phần dễ, giữ nguyên phần khó',
      titleEn: 'Honest accounting: the easy part is saved, the hard part remains',
      description:
        'Nghiệp vụ và đồng bộ dùng chung gần như hoàn toàn; giao diện khoảng 70%; tích hợp nền tảng chỉ 20%; dựng và phát hành thì 0%. Điều quan trọng là phần tiết kiệm được lại là phần dễ — viết một danh sách hai lần thì buồn tẻ nhưng đơn giản, còn tích hợp sinh trắc học đúng cách vẫn cần hiểu cả hai nền tảng. Flutter dời chỗ yêu cầu đó chứ không xoá nó.',
      descriptionEn:
        'Business logic and sync share almost completely; UI about 70%; platform integration only 20%; build and release 0%. What matters is that the saved part is the easy part — writing a list twice is tedious but simple, while integrating biometrics correctly still requires understanding both platforms. Flutter relocates that requirement rather than removing it.',
    },
    {
      phase: 'BACKEND',
      title: 'Kênh nền tảng: luôn có thời hạn và chuẩn hoá mã lỗi',
      titleEn: 'Platform channels: always time out, always normalise error codes',
      description:
        'Kênh là bất đồng bộ và có thể thất bại — không có gì đảm bảo phía gốc trả lời, nên luôn phải đặt thời hạn chờ, nếu không lời gọi treo vĩnh viễn. Và mỗi nền tảng ném mã lỗi khác nhau mà chúng KHÔNG được chuẩn hoá giúp bạn: ánh xạ ở tầng bộ chuyển đổi, đừng để lỗi riêng của nền tảng lọt lên giao diện.',
      descriptionEn:
        'Channels are asynchronous and can fail — nothing guarantees the native side answers, so always set a timeout or the call hangs forever. And each platform throws different error codes which are NOT normalised for you: map them in the adapter layer rather than letting platform-specific errors reach the UI.',
    },
    {
      phase: 'BACKEND',
      title: 'Bọc mọi gói bên thứ ba sau giao diện của riêng mình',
      titleEn: 'Wrap every third-party package behind your own interface',
      description:
        'Hệ sinh thái gói của Flutter rất rộng và chất lượng rất chênh. Trước khi phụ thuộc phải xem lần cập nhật gần nhất, số vấn đề đang mở, và có hỗ trợ đủ nền tảng bạn cần không. Gói bị bỏ rơi là chuyện thường — đổi gói khi nó nằm rải rác 40 chỗ trong mã là một tuần công, còn khi nó nằm sau một giao diện thì là một buổi chiều.',
      descriptionEn:
        'Flutter\'s package ecosystem is broad and wildly variable in quality. Before depending on one, check its last update, open issue count, and whether it supports every platform you target. Abandoned packages are routine — swapping one scattered across 40 files is a week, while swapping one behind an interface is an afternoon.',
    },
    {
      phase: 'FRONTEND',
      title: 'Quyết định tường minh: giống hệt nhau hay đúng chất từng nền tảng',
      titleEn: 'Decide explicitly: identical everywhere or native on each',
      description:
        'Đây là quyết định sản phẩm mà nhiều đội né tránh cho tới khi người dùng phàn nàn. Ứng dụng có bản sắc thương hiệu mạnh thì một giao diện cho mọi nơi là hợp lý; công cụ dùng hằng ngày đứng cạnh ứng dụng hệ thống thì lệch quy ước gây khó chịu tích luỹ. Cách trung dung: bố cục dùng chung, còn điều hướng, cử chỉ, hộp thoại và chọn ngày thì theo nền tảng.',
      descriptionEn:
        'A product decision many teams avoid until users complain. An app with strong brand identity can justify one interface everywhere; a daily tool sitting beside system apps accumulates irritation from convention mismatches. The middle ground: share layout, but take navigation, gestures, dialogs and date pickers from each platform.',
    },
    {
      phase: 'FRONTEND',
      title: 'Trợ năng phải chủ động, vì nó không còn miễn phí',
      titleEn: 'Accessibility must be deliberate, because it is no longer free',
      description:
        'Trình đọc màn hình của hệ điều hành biết đọc nút bấm gốc nhưng không biết gì về các điểm ảnh Flutter vẽ ra — Flutter phải xây một cây ngữ nghĩa song song để mô tả cho hệ điều hành. Nó hoạt động, nhưng nghĩa là bạn phải khai báo ngữ nghĩa cho từng thành phần thay vì được tặng kèm.',
      descriptionEn:
        'The OS screen reader can read native buttons but knows nothing about pixels Flutter painted — Flutter builds a parallel semantics tree to describe them. It works, but it means declaring semantics for each component rather than receiving them for free.',
    },
    {
      phase: 'FRONTEND',
      title: 'Đường lui cho web, vì nhiều khả năng gốc không tồn tại ở đó',
      titleEn: 'Web fallbacks, because many native capabilities do not exist there',
      description:
        'Rất nhiều khả năng gốc không có trên web: sinh trắc học, một số API tệp, thông báo nền. Nhắm cả ba đích thì mỗi khả năng cần một đường lui, và phát hiện điều này lúc thiết kế rẻ hơn nhiều so với phát hiện lúc bản web trắng màn hình vì một gói chỉ hỗ trợ di động.',
      descriptionEn:
        'Many native capabilities are absent on the web: biometrics, some file APIs, background notifications. Targeting all three means every capability needs a fallback, and discovering that at design time is far cheaper than discovering it when the web build goes blank because a package supports mobile only.',
    },
    {
      phase: 'TESTING',
      title: 'Đo hiệu năng ở bản dựng PHÁT HÀNH, không phải bản gỡ lỗi',
      titleEn: 'Measure performance in RELEASE builds, not debug',
      description:
        'Bản gỡ lỗi biên dịch lúc chạy nên chậm hơn nhiều và cho ra kết luận sai — đo ở bản phát hành. Kèm theo các phép kiểm riêng của đa nền tảng: vuốt mép trái để lùi phải hoạt động trên iOS, nút quay lại hệ thống phải hoạt động trên Android, trình đọc màn hình phải đọc được mọi điều khiển ở CẢ HAI, và bản web không được trắng màn hình ở bất kỳ khả năng nào.',
      descriptionEn:
        'Debug builds compile at runtime, are considerably slower, and produce misleading conclusions — measure in release. Alongside, the cross-platform-specific checks: left-edge swipe back must work on iOS, the system back gesture must work on Android, the screen reader must announce every control on BOTH, and the web build must never go blank for any capability.',
    },
  ],

  features: [
    { title: 'Một mã nguồn cho ba nền tảng', titleEn: 'One codebase, three platforms', description: 'Android, iOS và web từ cùng một cây mã nguồn.', descriptionEn: 'Android, iOS and web from a single source tree.', status: 'PLANNED' },
    { title: 'Tầng nghiệp vụ và đồng bộ dùng chung', titleEn: 'A shared business and sync layer', description: 'Không có nhánh rẽ theo nền tảng trong phần nghiệp vụ.', descriptionEn: 'No platform branching anywhere in the business layer.', status: 'PLANNED' },
    { title: 'Kênh nền tảng có thời hạn và chuẩn hoá lỗi', titleEn: 'Platform channels with timeouts and normalised errors', description: 'Mã lỗi riêng của từng nền tảng được ánh xạ ở tầng bộ chuyển đổi.', descriptionEn: 'Platform-specific error codes mapped in the adapter layer.', status: 'PLANNED' },
    { title: 'Điều hướng và cử chỉ theo từng nền tảng', titleEn: 'Per-platform navigation and gestures', description: 'Vuốt mép trên iOS, nút quay lại hệ thống trên Android.', descriptionEn: 'Edge swipe on iOS, the system back gesture on Android.', status: 'PLANNED' },
    { title: 'Gói bên thứ ba nằm sau giao diện riêng', titleEn: 'Third-party packages behind your own interfaces', description: 'Gói bị bỏ rơi thì đổi trong một buổi chiều, không phải một tuần.', descriptionEn: 'An abandoned package becomes an afternoon of work, not a week.', status: 'PLANNED' },
    { title: 'Trợ năng khai báo tường minh', titleEn: 'Explicitly declared accessibility', description: 'Cây ngữ nghĩa cho từng thành phần, vì hệ điều hành không tự hiểu.', descriptionEn: 'A semantics tree per component, because the OS cannot infer it.', status: 'PLANNED' },
    { title: 'Đường lui cho mọi khả năng web thiếu', titleEn: 'Fallbacks for every capability the web lacks', description: 'Không màn hình trắng khi một gói chỉ hỗ trợ di động.', descriptionEn: 'No blank screens when a package supports mobile only.', status: 'PLANNED' },
    { title: 'Đường ống dựng và phát hành cho ba đích', titleEn: 'Build and release pipelines for three targets', description: 'Ký và phát hành hoàn toàn tách biệt cho từng nền tảng.', descriptionEn: 'Signing and release remain entirely separate per platform.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Flutter — Architectural overview', titleEn: 'Flutter — Architectural overview', url: 'https://docs.flutter.dev/resources/architectural-overview', type: 'LINK', description: 'Giải thích vì sao Flutter tự vẽ điểm ảnh và điều đó kéo theo những gì.', descriptionEn: 'Why Flutter renders its own pixels and everything that follows from it.' },
    { title: 'Flutter — Writing platform-specific code', titleEn: 'Flutter — Writing platform-specific code', url: 'https://docs.flutter.dev/platform-integration/platform-channels', type: 'LINK', description: 'Kênh nền tảng: nơi khoản tiết kiệm của đa nền tảng dừng lại.', descriptionEn: 'Platform channels: where cross-platform savings stop.' },
    { title: 'Flutter — Accessibility', titleEn: 'Flutter — Accessibility', url: 'https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility', type: 'LINK', description: 'Cây ngữ nghĩa và vì sao trợ năng ở đây phải chủ động chứ không miễn phí.', descriptionEn: 'The semantics tree, and why accessibility here is deliberate rather than free.' },
    { title: 'Flutter — Performance best practices', titleEn: 'Flutter — Performance best practices', url: 'https://docs.flutter.dev/perf/best-practices', type: 'LINK', description: 'Gồm cả nhắc nhở quan trọng: chỉ đo hiệu năng ở bản dựng phát hành.', descriptionEn: 'Including the crucial reminder to measure performance only in release builds.' },
    { title: 'Kotlin Multiplatform', titleEn: 'Kotlin Multiplatform', url: 'https://kotlinlang.org/docs/multiplatform.html', type: 'LINK', description: 'Đánh đổi NGƯỢC LẠI: dùng chung tầng nghiệp vụ nhưng giữ giao diện gốc hoàn toàn.', descriptionEn: 'The OPPOSITE trade: share the business layer while keeping fully native interfaces.' },
  ],

  coreKnowledge: [
    { vi: 'Hai mô hình đa nền tảng: dùng thành phần gốc và tự vẽ', en: 'Two cross-platform models: native components versus self-rendering' },
    { vi: 'Đánh giá trung thực phần nào dùng chung được và phần nào không', en: 'Honestly assessing what can be shared and what cannot' },
    { vi: 'Cầu nối sang mã gốc và chuẩn hoá lỗi giữa các nền tảng', en: 'Bridging to native code and normalising errors across platforms' },
    { vi: 'Quy ước nền tảng và cái giá của việc phớt lờ chúng', en: 'Platform conventions and the cost of ignoring them' },
    { vi: 'Trợ năng khi hệ điều hành không hiểu giao diện của bạn', en: 'Accessibility when the OS cannot interpret your interface' },
    { vi: 'Đánh giá và cô lập phụ thuộc bên thứ ba', en: 'Evaluating and isolating third-party dependencies' },
    { vi: 'Sự khác biệt giữa bản dựng gỡ lỗi và bản phát hành khi đo hiệu năng', en: 'Debug versus release builds when measuring performance' },
    { vi: 'Đường ống phát hành cho nhiều đích đến', en: 'Release pipelines for multiple targets' },
  ],

  portfolioBonus: [
    { vi: 'Bảng kế toán trung thực: phần trăm mã dùng chung theo từng tầng, đo thật', en: 'An honest accounting table: measured percentage of shared code per layer' },
    { vi: 'Video cùng một ứng dụng trên Android và iOS, chỉ rõ chỗ giao diện theo nền tảng', en: 'A video of the same app on Android and iOS highlighting per-platform UI' },
    { vi: 'So hiệu năng bản gỡ lỗi và bản phát hành trên cùng thiết bị', en: 'Debug versus release performance on the same device' },
    { vi: 'Mục README so sánh Flutter với cách chia sẻ tầng nghiệp vụ', en: 'A README comparing Flutter against business-layer sharing approaches' },
    { vi: 'Video duyệt ứng dụng bằng trình đọc màn hình trên cả hai nền tảng', en: 'A video traversing the app with screen readers on both platforms' },
  ],

  completionOutcomes: [
    { vi: 'Đánh giá được đánh đổi của đa nền tảng bằng số liệu, không bằng niềm tin', en: 'Evaluate cross-platform trade-offs with measurements rather than belief' },
    { vi: 'Biết khi nào nên dùng chung mã và khi nào nên viết riêng', en: 'Know when to share code and when to write separately' },
    { vi: 'Tôn trọng quy ước nền tảng ngay cả khi dùng khung đa nền tảng', en: 'Respect platform conventions even inside a cross-platform framework' },
    { vi: 'Cô lập phụ thuộc để hệ sinh thái thay đổi không phá vỡ dự án', en: 'Isolate dependencies so ecosystem churn does not break the project' },
    { vi: 'Nhận ra khi một lời hứa công nghệ được phát biểu quá rộng', en: 'Recognise when a technology promise is stated more broadly than it holds' },
  ],

  bodyMdx,
  bodyMdxEn,
};
