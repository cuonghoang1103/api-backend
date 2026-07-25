/**
 * Exp Hub guide for MMA301 — React Native + Expo dev environment (Vietnamese).
 * Academy MMA301 bài 0.4 links its "Cài đặt" card to /exp-hub/mma301-cai-dat-moi-truong.
 * Stack: Node.js LTS + Expo + Expo Go (phone) + VS Code + (optional) Android Studio / Xcode.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mma301-cai-dat-moi-truong',
    title: 'MMA301 — Cài môi trường React Native + Expo + Expo Go',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ môi trường mobile cho MMA301: Node.js LTS, Expo, app Expo Go trên điện thoại thật (cách nhanh nhất để chạy thử), VS Code, và tuỳ chọn Android Studio / Xcode để dùng emulator — kèm lệnh tạo và chạy app đầu tiên.',
    referenceUrl: 'https://docs.expo.dev/get-started/set-up-your-environment/',
    noteContent: `
<h2>Cài môi trường cho MMA301 — React Native + Expo</h2>
<p>Cách nhanh nhất: cài Expo và chạy app trên điện thoại thật qua app Expo Go — không cần Android Studio hay Xcode để bắt đầu.</p>

<h3>1) Node.js LTS (20.x trở lên)</h3>
<p>Tải bản LTS từ nodejs.org. Kiểm tra bằng <code>node -v</code> và <code>npm -v</code>.</p>

<h3>2) Expo Go trên điện thoại</h3>
<p>Cài app <b>Expo Go</b> từ App Store (iOS) hoặc Google Play (Android). Đây là cách chạy app của bạn tức thì: chạy <code>npx expo start</code> trên máy tính rồi quét QR code bằng Expo Go (Android quét trong app; iOS quét bằng Camera).</p>

<h3>3) Visual Studio Code + extension</h3>
<p>Cài VS Code, thêm extension: <b>React Native Tools</b>, <b>ESLint</b>, <b>Prettier</b>, và <b>Expo Tools</b>.</p>

<h3>4) (Tuỳ chọn) Emulator/Simulator</h3>
<p><b>Android Studio</b> → tạo một Virtual Device (AVD) để chạy Android emulator (mọi hệ điều hành). <b>Xcode</b> (chỉ macOS) → iOS Simulator. Chỉ cần khi bạn muốn test nền tảng mà bạn không có điện thoại.</p>

<h3>5) Tạo và chạy app đầu tiên</h3>
<p>Xem code block bên dưới. Sau <code>npx expo start</code>, quét QR bằng Expo Go — app hiện ngay trên điện thoại, và mỗi lần bạn sửa code nó tự cập nhật (Fast Refresh).</p>

<h3>Checklist đã sẵn sàng</h3>
<ul>
  <li>✓ <code>node -v</code> ra 20.x trở lên</li>
  <li>✓ Đã cài Expo Go trên điện thoại</li>
  <li>✓ VS Code + các extension React Native</li>
  <li>✓ <code>npx create-expo-app</code> chạy được và quét QR hiện app trên điện thoại</li>
  <li>✓ (Tuỳ chọn) Android emulator hoặc iOS simulator chạy được</li>
</ul>
`,
    codeBlocks: [
      {
        name: 'Tạo và chạy app Expo đầu tiên',
        language: 'bash',
        code: `# Kiem tra Node
node -v

# Tao mot app Expo moi
npx create-expo-app@latest myapp
cd myapp

# Chay dev server
npx expo start
# -> quet QR code bang Expo Go tren dien thoai
# hoac nhan 'a' de mo Android emulator, 'i' de mo iOS simulator`,
      },
      {
        name: 'Cài các thư viện hay dùng trong môn',
        language: 'bash',
        code: `# Dieu huong
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# Luu tru
npx expo install @react-native-async-storage/async-storage
npx expo install expo-sqlite

# Thong bao
npx expo install expo-notifications

# State toan cuc (tuy chon)
npm install @reduxjs/toolkit react-redux`,
      },
    ],
  },
};
