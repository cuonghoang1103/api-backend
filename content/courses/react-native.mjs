/**
 * React Native & Expo — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm của
 * 11 khoá khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Nối tiếp khoá React. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'frontend', name: 'Frontend', icon: 'Layout', sortOrder: 2 },
  course: {
    slug: 'react-native',
    title: 'React Native & Expo',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/react-native.png?v=1',
    shortDescription: 'Take your React skills to mobile with Expo: native components, Expo Router navigation, styling, calling APIs, local storage, push notifications, camera and permissions, and shipping to the App Store/Play Store with EAS.|||Đưa kỹ năng React sang di động với Expo: component native, điều hướng Expo Router, style, gọi API, lưu trữ cục bộ, push notification, camera và quyền, phát hành lên App Store/Play Store bằng EAS.',
    description: 'Khoá React Native cho người đã biết React web, học tiếp để làm app di động thật — cài lên điện thoại, dùng camera, nhận push notification, và phát hành thật lên store. Đi từ khác biệt giữa React web và React Native (không có DOM, component native thay vì thẻ HTML), Expo (managed workflow, Expo Go để chạy thử ngay trên điện thoại), điều hướng với Expo Router (định tuyến kiểu file-based giống Next.js), style bằng StyleSheet và Flexbox, gọi API và quản lý state, lưu trữ cục bộ (AsyncStorage, SecureStore cho dữ liệu nhạy cảm), push notification, camera và xin quyền người dùng, một chút về module native/khác biệt iOS-Android, tới build và phát hành bằng EAS Build/Submit. Kết thúc bằng một app di động nhỏ hoàn chỉnh.',
    whatYouLearn: 'Chuyển tư duy từ component HTML sang component native (View, Text, ScrollView…); dựng điều hướng nhiều màn hình bằng Expo Router; style ứng dụng bằng Flexbox và xử lý khác biệt giữa các nền tảng; gọi API và quản lý state trên di động giống cách đã học ở React; lưu dữ liệu cục bộ đúng chỗ (AsyncStorage cho dữ liệu thường, SecureStore cho token); xin quyền và dùng camera/thư viện ảnh đúng cách; gửi push notification; và build + nộp app lên App Store/Play Store bằng EAS mà không cần máy Mac cho phần Android.',
    requirements: 'Đã học khoá React của CuongThai (component, props, state, effect, hook tự viết) — bắt buộc, khoá này KHÔNG dạy lại React từ đầu. Biết TypeScript cơ bản. Có một điện thoại (iOS hoặc Android) cài được ứng dụng Expo Go để chạy thử trực tiếp; không bắt buộc có máy Mac hay Android Studio nhờ Expo managed workflow.',
    documentsNote: 'Tài liệu chính: reactnative.dev • docs.expo.dev • docs.expo.dev/router (Expo Router) • docs.expo.dev/eas (EAS Build/Submit) • docs.expo.dev/versions/latest cho từng API (Notifications, Camera, SecureStore…).',
  },
  sections: khung('rn', [
    ['Section 0 — From React to React Native', 'Mục 0 — Từ React sang React Native', 'Cùng React, khác nền tảng — và Expo giải quyết phần khó nhất thế nào.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What React Native is, its history, and why Expo changed everything', 'Bắt đầu tại đây (1/2) — React Native là gì, lịch sử ra đời, và vì sao Expo thay đổi cuộc chơi', 'Facebook 2015: một codebase React cho cả iOS và Android · New Architecture (Fabric + TurboModules) thay JS bridge cũ · Expo: từ "thư viện phụ trợ" thành cách làm React Native mặc định · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Native mobile without Expo, and how to study this course', 'Bắt đầu tại đây (2/2) — Làm mobile native mà không có Expo, và cách học khoá này', 'Tình huống trước Expo: cần Xcode + Android Studio chỉ để chạy thử một thay đổi nhỏ · Expo Go xoá bỏ rào cản đó cho phần lớn nhu cầu học và làm sản phẩm · Lộ trình: component → Expo → điều hướng → style → API → lưu trữ → thông báo → camera → build & phát hành'],
      ['cai-dat-expo', 'Setting up Expo and running on your phone', 'Cài đặt Expo và chạy thử trên điện thoại', 'npx create-expo-app · Cài Expo Go từ App Store/Play Store · npx expo start và quét QR code'],
      ['cau-truc-du-an-expo', 'Project structure of an Expo app', 'Cấu trúc dự án Expo', 'app/ cho Expo Router (file-based) · app.json/app.config.ts cấu hình app · assets/ cho icon, splash screen'],
    ]],
    ['Chapter 1 — Core components and styling', 'Chương 1 — Component lõi và style', 'Không còn div/span — làm quen với View, Text, và Flexbox mặc định.', [
      ['view-text', 'View, Text, and why there is no div', 'View, Text, và vì sao không có div', 'View thay div, Text thay span/p — mọi chữ PHẢI nằm trong Text · Không có CSS file, style là object JavaScript · ScrollView và ScrollView vs FlatList cho danh sách dài'],
      ['flexbox-rn', 'Flexbox as the default layout model', 'Flexbox là mô hình layout mặc định', 'React Native mặc định flexDirection: column (khác web mặc định row) · flex, justifyContent, alignItems · Không có float, không có grid như CSS web'],
      ['stylesheet', 'StyleSheet.create and style composition', 'StyleSheet.create và ghép style', 'Vì sao dùng StyleSheet.create thay vì object trần (tối ưu hiệu năng) · Ghép nhiều style bằng mảng · Style có điều kiện theo state'],
      ['platform-khac-biet', 'Handling iOS vs Android differences', 'Xử lý khác biệt giữa iOS và Android', 'Platform.OS và Platform.select · Khác biệt shadow (iOS) vs elevation (Android) · SafeAreaView cho notch/status bar'],
    ]],
    ['Chapter 2 — Expo fundamentals', 'Chương 2 — Nền tảng Expo', 'Managed workflow, config, và bộ SDK Expo cung cấp sẵn.', [
      ['managed-workflow', 'Managed workflow vs bare workflow', 'Managed workflow vs bare workflow', 'Managed: Expo lo phần native, bạn chỉ viết JS/TS · Bare: khi cần native module không có sẵn · Expo Modules API cho phép thêm code native khi thực sự cần'],
      ['expo-sdk', 'The Expo SDK: what comes built in', 'Bộ SDK Expo: những gì đã có sẵn', 'Camera, Notifications, SecureStore, Location… đều là package Expo chính thức · Cài qua npx expo install để khớp đúng phiên bản SDK · Expo Go hỗ trợ phần lớn SDK, một số cần development build'],
      ['expo-config', 'App configuration with app.config.ts', 'Cấu hình app với app.config.ts', 'Tên app, icon, splash screen, scheme · Biến môi trường qua expo-constants · Cấu hình khác nhau cho dev/preview/production'],
      ['dev-build', 'Development builds vs Expo Go', 'Development build vs Expo Go', 'Khi nào Expo Go không đủ (cần native module ngoài SDK) · npx expo run:ios / run:android tạo development build · EAS Build cho development build không cần máy Mac (đào sâu ở Chương 10)'],
    ]],
    ['Chapter 3 — Navigation with Expo Router', 'Chương 3 — Điều hướng với Expo Router', 'Định tuyến kiểu file-based, giống Next.js nhưng cho mobile.', [
      ['file-based-routing', 'File-based routing basics', 'Định tuyến kiểu file-based căn bản', 'app/index.tsx là màn hình gốc · Tên file = đường dẫn route · Link và router.push để điều hướng'],
      ['tab-stack', 'Tabs and stack navigators', 'Điều hướng dạng tab và dạng stack', '(tabs)/ cho thanh tab dưới cùng · Stack cho luồng đẩy màn hình chồng lên nhau · Kết hợp tab và stack lồng nhau'],
      ['dynamic-route', 'Dynamic routes and params', 'Route động và tham số', '[id].tsx cho route có tham số · useLocalSearchParams để đọc tham số · Điều hướng có mang dữ liệu giữa các màn hình'],
      ['auth-flow-nav', 'Auth flow: protecting screens', 'Luồng xác thực: bảo vệ màn hình', 'Nhóm route (auth)/ và (app)/ tách biệt · Redirect khi chưa đăng nhập · Giữ trạng thái đăng nhập khi mở lại app'],
    ]],
    ['Chapter 4 — Calling APIs and managing state', 'Chương 4 — Gọi API và quản lý state', 'Giống React web, với vài khác biệt về mạng và vòng đời màn hình.', [
      ['fetch-mobile', 'Fetching data on mobile', 'Gọi dữ liệu trên di động', 'fetch hoạt động giống web · Xử lý mất kết nối mạng (khác máy tính có mạng ổn định) · Base URL API cho môi trường dev (địa chỉ IP máy, không phải localhost)'],
      ['tanstack-query-rn', 'TanStack Query on React Native', 'TanStack Query trên React Native', 'Cùng thư viện đã học ở khoá React · refetchOnAppStateChange thay refetchOnWindowFocus (không có "cửa sổ" trên mobile) · Cache khi mất mạng tạm thời'],
      ['loading-error-mobile', 'Loading, error and empty states on small screens', 'Trạng thái tải, lỗi và rỗng trên màn hình nhỏ', 'ActivityIndicator cho loading · Thiết kế thông báo lỗi ngắn gọn, phù hợp màn hình nhỏ · Pull-to-refresh với RefreshControl'],
      ['form-mobile', 'Forms and the keyboard', 'Form và bàn phím', 'KeyboardAvoidingView để tránh bàn phím che input · TextInput props (keyboardType, autoCapitalize) · React Hook Form hoạt động y hệt trên React Native'],
    ]],
    ['Chapter 5 — Local storage', 'Chương 5 — Lưu trữ cục bộ', 'AsyncStorage cho dữ liệu thường, SecureStore cho dữ liệu nhạy cảm.', [
      ['asyncstorage', 'AsyncStorage basics', 'AsyncStorage căn bản', 'Lưu trữ key-value bất đồng bộ, không mã hoá · getItem/setItem/removeItem · Lưu object bằng JSON.stringify/parse'],
      ['securestore', 'SecureStore for tokens and secrets', 'SecureStore cho token và dữ liệu nhạy cảm', 'Mã hoá bằng Keychain (iOS) / Keystore (Android) · Không bao giờ lưu access token bằng AsyncStorage thường · Giới hạn dung lượng của SecureStore'],
      ['zustand-persist-rn', 'Persisting app state with Zustand', 'Lưu trạng thái app bền vững với Zustand', 'Cùng thư viện đã học ở khoá React · Middleware persist với AsyncStorage làm nơi lưu · Khôi phục state khi mở lại app'],
      ['offline-tinh-huong', 'Designing for offline moments', 'Thiết kế cho những lúc mất mạng', 'App di động mất mạng thường xuyên hơn web · Lưu tạm hành động để đồng bộ lại khi có mạng (khái niệm, không cần đầy đủ offline-first) · Thông báo rõ cho người dùng khi đang ngoại tuyến'],
    ]],
    ['Chapter 6 — Push notifications', 'Chương 6 — Push notification', 'Đăng ký thiết bị, gửi, và xử lý khi người dùng bấm vào thông báo.', [
      ['dang-ky-token', 'Requesting permission and getting a push token', 'Xin quyền và lấy push token', 'expo-notifications xin quyền người dùng · Lấy Expo push token của thiết bị · Lưu token vào backend gắn với user'],
      ['gui-thong-bao', 'Sending notifications from the backend', 'Gửi thông báo từ backend', 'Gọi Expo Push API từ server · Gửi theo lô nhiều token cùng lúc · Xử lý token đã hết hạn/gỡ app'],
      ['xu-ly-nhan', 'Handling notifications: foreground, background, tapped', 'Xử lý thông báo: khi app đang mở, nền, hoặc bị bấm vào', 'Listener cho thông báo đến khi app đang mở · Điều hướng tới đúng màn hình khi người dùng bấm vào thông báo · Badge count trên icon app'],
      ['dev-build-push', 'Why push notifications need a development build', 'Vì sao push notification cần development build', 'Expo Go có giới hạn với push notification ở SDK gần đây · Khi nào cần development build (nối lại Chương 2) · Kiểm thử push trên thiết bị thật, không phải simulator'],
    ]],
    ['Chapter 7 — Camera and permissions', 'Chương 7 — Camera và quyền', 'Chụp ảnh, chọn ảnh, và xin quyền đúng cách.', [
      ['xin-quyen', 'Requesting permissions the right way', 'Xin quyền đúng cách', 'usePermissions hook của Expo · Giải thích lý do cần quyền trước khi hệ thống hỏi · Xử lý khi người dùng từ chối quyền'],
      ['expo-camera', 'Using the camera with expo-camera', 'Dùng camera với expo-camera', 'CameraView component · Chụp ảnh và lấy URI file tạm · Chuyển đổi camera trước/sau'],
      ['image-picker', 'Picking images with expo-image-picker', 'Chọn ảnh với expo-image-picker', 'Chọn từ thư viện ảnh thiết bị · Cắt/resize ảnh trước khi upload · Giới hạn kích thước file trước khi gửi lên server'],
      ['upload-anh-rn', 'Uploading a picked image to the backend', 'Upload ảnh đã chọn lên backend', 'FormData với URI ảnh trên React Native (khác web) · Presigned URL nếu backend dùng object storage (nối lại khoá Fullstack Project) · Trạng thái đang upload và xử lý lỗi mạng'],
    ]],
    ['Chapter 8 — Native modules and platform code', 'Chương 8 — Native module và code theo nền tảng', 'Biết giới hạn của managed workflow và cách vượt qua khi cần.', [
      ['khi-nao-can-native', 'When you need code Expo does not provide', 'Khi nào cần code mà Expo chưa có sẵn', 'Thư viện native bên thứ ba yêu cầu config plugin · Kiểm một package có hỗ trợ Expo trước khi cài · Đọc changelog SDK Expo khi nâng cấp'],
      ['config-plugin', 'Config plugins', 'Config plugin', 'Config plugin sửa native project lúc build, không cần eject · Cài và cấu hình một plugin phổ biến · Giới hạn: không phải mọi thư viện native đều có config plugin'],
      ['expo-modules-api', 'A glimpse of the Expo Modules API', 'Nhìn nhanh qua Expo Modules API', 'Viết một module native tối giản (khái niệm, không bắt buộc thực hành sâu) · Khi nào việc này đáng công sức so với tìm giải pháp JS thuần'],
      ['platform-file', 'Platform-specific files (.ios.tsx / .android.tsx)', 'File riêng theo nền tảng (.ios.tsx / .android.tsx)', 'Metro tự chọn đúng file theo nền tảng đang build · Khi nào tách file thay vì dùng Platform.select · Giữ phần logic dùng chung, chỉ tách phần UI khác biệt'],
    ]],
    ['Chapter 9 — Performance and polish', 'Chương 9 — Hiệu năng và hoàn thiện', 'App mượt trên thiết bị thật, không chỉ trên simulator mạnh.', [
      ['flatlist-hieu-nang', 'Rendering long lists efficiently', 'Hiển thị danh sách dài hiệu quả', 'FlatList thay ScrollView cho danh sách dài · keyExtractor và getItemLayout · Tránh tạo hàm mới mỗi lần render trong renderItem'],
      ['anh-hieu-nang', 'Image loading and caching', 'Tải và cache ảnh', 'expo-image thay Image mặc định cho cache tốt hơn · Kích thước ảnh phù hợp màn hình, không tải ảnh gốc quá lớn · Placeholder trong lúc ảnh đang tải'],
      ['animation-rn', 'Basic animations with Reanimated', 'Animation cơ bản với Reanimated', 'useSharedValue và withTiming · Animation chạy trên UI thread, không giật khi JS thread bận · Khi nào animation đơn giản đủ, không cần Reanimated'],
      ['splash-icon', 'App icon, splash screen and branding', 'Icon app, splash screen và nhận diện thương hiệu', 'Kích thước icon theo yêu cầu store · expo-splash-screen kiểm soát thời điểm ẩn splash · Test icon/splash trên cả iOS và Android'],
    ]],
    ['Chapter 10 — Building and releasing with EAS', 'Chương 10 — Build và phát hành với EAS', 'Từ code trên máy tới app thật trên App Store và Play Store.', [
      ['eas-build', 'EAS Build: cloud builds without Xcode/Android Studio', 'EAS Build: dựng app trên cloud không cần Xcode/Android Studio', 'eas build --platform ios/android · Build profile (development/preview/production) trong eas.json · Credential (certificate, keystore) EAS quản lý giúp'],
      ['test-noi-bo', 'Internal testing: TestFlight and Play internal testing', 'Kiểm thử nội bộ: TestFlight và Play internal testing', 'eas submit đưa build lên TestFlight/Play Console · Mời người thử qua email/link · Vòng phản hồi trước khi phát hành công khai'],
      ['ota-update', 'Over-the-air updates with EAS Update', 'Cập nhật qua mạng (OTA) với EAS Update', 'Cập nhật JS bundle không cần submit lại store cho thay đổi không đụng native code · Giới hạn: thay đổi native (thêm SDK mới) vẫn cần build và submit lại · Kênh update (production/preview) tách biệt'],
      ['phat-hanh-store', 'Submitting to the App Store and Play Store', 'Nộp lên App Store và Play Store', 'Yêu cầu tài khoản Apple Developer và Google Play Console (có phí) · Metadata, ảnh chụp màn hình, chính sách quyền riêng tư bắt buộc · Thời gian review khác nhau giữa hai store'],
    ]],
    ['Chapter 11 — Capstone: a small end-to-end app', 'Chương 11 — Dự án cuối khoá: một app nhỏ hoàn chỉnh', 'Ráp điều hướng, API, lưu trữ, camera và build thành một app thật.', [
      ['thiet-ke-app', 'Planning the app and its screens', 'Lên kế hoạch app và các màn hình', 'Chọn một ý tưởng nhỏ, vừa sức (ví dụ: nhật ký ảnh có ghi chú) · Vẽ luồng màn hình trước khi dựng điều hướng · Danh sách API cần gọi từ backend đã học ở các khoá kia'],
      ['xay-man-hinh', 'Building the screens and navigation', 'Xây các màn hình và điều hướng', 'Expo Router cho toàn bộ luồng · Kết nối API thật, có trạng thái loading/lỗi · Lưu trạng thái đăng nhập bằng SecureStore'],
      ['them-tinh-nang-native', 'Adding a native feature: camera or notifications', 'Thêm một tính năng native: camera hoặc notification', 'Chọn một tính năng native để hoàn thiện app (chụp ảnh, hoặc nhắc nhở) · Xin quyền đúng cách, xử lý khi bị từ chối'],
      ['build-va-tong-ket', 'Building it with EAS and the final checklist', 'Build bằng EAS và checklist cuối khoá', 'Tạo một development/preview build chạy được trên thiết bị thật · Checklist năng lực cả khoá · Bước tiếp theo nếu muốn phát hành thật lên store'],
    ]],
  ]),
};
