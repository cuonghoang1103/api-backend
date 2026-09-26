---
name: phat-hanh-app
description: Build/phát hành app: Android, iOS/TestFlight, Flutter, React Native/Expo, Electron/Tauri, ký số, phiên bản.
---

# KỸ NĂNG: PHÁT HÀNH APP

## 0. Luật chung
- Đọc dự án để biết loại app và công cụ build (Gradle, Xcode, `pubspec.yaml`, `app.json`/`eas.json`, `electron-builder.yml`, `tauri.conf.json`).
- **Tăng phiên bản mỗi lần phát hành** (versionCode/versionName; CFBundleVersion/ShortVersion; `version` trong package.json).
  Cửa hàng từ chối số đã dùng. Một chỗ duy nhất giữ số phiên bản, đừng sửa tay ở ba nơi.
- **Khoá ký số là tài sản không lấy lại được** (keystore Android, chứng chỉ Apple). Không commit, không in ra. Mất keystore
  Play = không cập nhật được app nữa. Nhắc người dùng backup.
- Những bước cần tài khoản cửa hàng (Play Console, App Store Connect, tạo chứng chỉ, trả phí) — người dùng làm; bạn chuẩn bị
  mọi thứ còn lại và đưa hướng dẫn từng bước.
- Kiểm bằng CÀI THẬT: build xong phải cài lên máy ảo/thiết bị và mở được, không chỉ "build succeeded".

## 1. Android (Gradle / Android Studio)
```bash
./gradlew assembleRelease     # APK để cài tay
./gradlew bundleRelease       # AAB để lên Google Play
```
Ký: tạo keystore MỘT lần `keytool -genkeypair -v -keystore release.jks -alias app -keyalg RSA -keysize 2048 -validity 10000 -storepass <...> -keypass <...> -dname "CN=..."`
(cờ đủ ⇒ không hỏi). Khai trong `signingConfigs` đọc từ biến môi trường/`keystore.properties` (gitignore).
Kiểm cài: `adb install -r app-release.apk`. Lỗi thường: `minSdk`, thiếu quyền trong Manifest, R8 xoá lớp cần giữ (proguard rules).

## 2. iOS (Xcode) — chỉ build được trên macOS
```bash
xcodebuild -scheme App -configuration Release -archivePath build/App.xcarchive archive
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build
xcrun altool --upload-app -f build/App.ipa -t ios --apiKey <KEY_ID> --apiIssuer <ISSUER_ID>   # hoặc Transporter / fastlane
```
Cần: Apple Developer account, Bundle ID, chứng chỉ phân phối + provisioning profile (Xcode "Automatically manage signing"
là đường dễ nhất). Tăng build number mỗi lần tải lên TestFlight. Máy Windows/Linux ⇒ build iOS trên CI macOS (GitHub Actions `macos-latest`) hoặc EAS.

## 3. Flutter
`flutter build apk --release` · `flutter build appbundle` · `flutter build ipa` · desktop `flutter build windows|macos|linux`.
Phiên bản ở `pubspec.yaml` dạng `1.2.3+45` (45 = build number). `flutter doctor` trước khi đổ lỗi cho mã.

## 4. React Native / Expo
Expo: `npx eas-cli build -p android --profile production --non-interactive` (cần `EXPO_TOKEN`), `eas submit`.
Cập nhật JS không qua cửa hàng: `eas update`. RN thuần: build như Android/iOS gốc trong `android/`, `ios/` (`pod install`).

## 5. App desktop
- **Electron:** `electron-builder --mac --win --linux`. Tự cập nhật bằng `electron-updater` + GitHub Releases: kho phát hành phải
  công khai (hoặc có token), phải có `latest.yml`/`latest-mac.yml` và file `.zip` cho macOS — thiếu là tự cập nhật chết im.
  macOS cần ký + notarize (Apple Developer ID) nếu không người dùng bị Gatekeeper chặn; Windows không ký sẽ bị SmartScreen cảnh báo.
  Build mọi nền tảng tốt nhất trên CI ma trận 3 hệ điều hành — build Windows/macOS chéo từ máy khác hay hỏng câm.
- **Tauri:** `npm run tauri build`; cần Rust toolchain; updater cần cặp khoá ký riêng của Tauri.
- Đường dẫn file, phím tắt, xuống dòng CRLF, `shell: true` cho `.cmd` trên Windows — nhớ Windows là nền tảng đông người dùng nhất.

## 6. CI build trên GitHub Actions
Ma trận `os: [ubuntu-latest, windows-latest, macos-latest]`, cache phụ thuộc, bí mật ký số trong Secrets (base64 keystore/.p12),
tải sản phẩm lên Releases. Chặn hai lần dựng cùng một phiên bản (`concurrency`) và kiểm lại danh sách file sau khi dựng.

## 7. Báo cáo
Phiên bản đã phát hành, đường tải/link cửa hàng, file nào đã sinh, đã cài thử trên đâu, còn bước nào người dùng phải tự làm.
