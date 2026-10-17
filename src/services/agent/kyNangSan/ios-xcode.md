---
name: ios-xcode
description: iOS/macOS bằng dòng lệnh (chỉ trên Mac): xcodebuild build/test/archive, simctl boot/install/launch/screenshot (CHỈ MỘT simulator), ký mã & provisioning, đẩy TestFlight (altool), notarize app macOS (notarytool + stapler), đọc lỗi ký.
---

# KỸ NĂNG: iOS / XCODE — dựng, chạy simulator, ký, phát hành

## 0. Luật vàng

1. **Chỉ làm được trên macOS có Xcode.** Windows/Linux ⇒ nói thẳng; gợi ý máy Mac/CI macOS (GitHub Actions `macos-latest`).
2. **CHỈ MỘT simulator mỗi lúc.** Mỗi simulator ăn 1–3 GB RAM; trước khi boot cái mới, xem cái nào đang chạy
   (`xcrun simctl list devices booted`) và DÙNG LẠI nó — đừng boot thêm. Xong việc mà chính bạn đã boot ⇒ `shutdown`.
3. **Ký mã, chứng chỉ, Apple ID, mật khẩu ứng dụng**: không tự tạo/thu hồi chứng chỉ, không đổi Team, không gõ mật
   khẩu. Thiếu thì nói người dùng làm trong Xcode → Settings → Accounts hoặc developer.apple.com.
4. `xcodebuild` dài ⇒ `chay_lenh_nen`; đọc lỗi bằng `grep -E "error:|warning: .*deprecated|BUILD (FAILED|SUCCEEDED)"`.

## 1. Khảo sát

```bash
xcodebuild -version ; xcode-select -p          # /Applications/Xcode.app/... (không phải CommandLineTools)
xcodebuild -list -project App.xcodeproj         # hoặc -workspace App.xcworkspace (dự án CocoaPods/SPM phức tạp)
xcrun simctl list devices available | grep -E "iPhone|iPad" | head
xcrun simctl list devices booted
security find-identity -v -p codesigning        # chứng chỉ ký đang có
```
`xcode-select -p` trỏ CommandLineTools ⇒ `sudo xcode-select -s /Applications/Xcode.app` (cần quyền — dùng quyen_cao/hỏi).
Lần đầu sau cập nhật Xcode: `sudo xcodebuild -license accept` và `xcodebuild -runFirstLaunch`.
XcodeGen/Tuist: sửa `project.yml` rồi `xcodegen generate` — đừng sửa tay `.pbxproj` khi dự án sinh bằng công cụ.

## 2. Dựng & chạy trên simulator

```bash
UDID=$(xcrun simctl list devices booted | grep -Eo '[0-9A-F-]{36}' | head -1)   # dùng lại cái đang chạy
[ -z "$UDID" ] && UDID=<chọn một iPhone available> && xcrun simctl boot "$UDID"
open -a Simulator                                                               # hiện cửa sổ (tuỳ chọn)
xcodebuild -scheme App -destination "id=$UDID" -configuration Debug \
  -derivedDataPath build/dd build | tail -30
APP=$(find build/dd/Build/Products/Debug-iphonesimulator -maxdepth 1 -name '*.app' | head -1)
xcrun simctl install "$UDID" "$APP"
BID=$(/usr/libexec/PlistBuddy -c 'Print CFBundleIdentifier' "$APP/Info.plist")
xcrun simctl launch "$UDID" "$BID"
sleep 3; xcrun simctl io "$UDID" screenshot build/shot.png        # rồi NHÌN ảnh
xcrun simctl terminate "$UDID" "$BID"
```
- Log app: `xcrun simctl spawn "$UDID" log stream --predicate 'process == "App"' --level debug` (chạy nền).
- Mở URL/deep link: `xcrun simctl openurl "$UDID" "myapp://path"` · quyền: `xcrun simctl privacy "$UDID" grant photos "$BID"`
  · ảnh vào thư viện: `xcrun simctl addmedia "$UDID" a.jpg` · thông báo đẩy: `xcrun simctl push "$UDID" "$BID" push.json`
  · thanh trạng thái đẹp cho ảnh App Store: `xcrun simctl status_bar "$UDID" override --time 9:41 --batteryLevel 100`.
- Quay màn hình: `xcrun simctl io "$UDID" recordVideo build/rec.mp4` (chạy nền; dừng bằng Ctrl+C/`dung_lenh_nen`).

## 3. Test

```bash
xcodebuild test -scheme App -destination "id=$UDID" -resultBundlePath build/test.xcresult | tail -40
xcodebuild test -scheme App -destination "id=$UDID" -only-testing:AppTests/LoginTests/testSai   # một ca
xcrun xcresulttool get test-results summary --path build/test.xcresult    # tóm tắt (Xcode 16+)
```

## 4. Ký mã & provisioning — đọc lỗi

| Lỗi | Nghĩa | Hướng xử lý |
|---|---|---|
| `No signing certificate "iOS Development" found` | máy chưa có chứng chỉ | người dùng đăng nhập Apple ID trong Xcode → Accounts → Manage Certificates |
| `requires a provisioning profile` / `No profiles for 'com.x' were found` | chưa có profile cho bundle id | bật Automatically manage signing + chọn Team; hoặc `-allowProvisioningUpdates` |
| `Provisioning profile … doesn't include the currently selected device` | thiết bị thật chưa đăng ký | đăng ký UDID (Xcode tự làm khi cắm máy + automatic signing) |
| `errSecInternalComponent` (CI/SSH) | keychain bị khoá | `security unlock-keychain` — mật khẩu do người dùng nhập |
| `The bundle identifier … is not available` | bundle id thuộc team khác | đổi bundle id |
Dòng lệnh: `xcodebuild … -allowProvisioningUpdates DEVELOPMENT_TEAM=ABCDE12345 CODE_SIGN_STYLE=Automatic`.
Simulator KHÔNG cần ký thật; lỗi ký chỉ khi build cho thiết bị/archive.

## 5. Archive → TestFlight

```bash
xcodebuild -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath build/App.xcarchive archive -allowProvisioningUpdates
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportPath build/export \
  -exportOptionsPlist ExportOptions.plist -allowProvisioningUpdates      # method: app-store-connect
xcrun altool --upload-app -f build/export/App.ipa -t ios \
  --apiKey <KEY_ID> --apiIssuer <ISSUER_ID>      # khoá API App Store Connect ở ~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8
```
- **Tăng `CURRENT_PROJECT_VERSION` (build number) mỗi lần tải lên** — trùng là bị từ chối.
- Khoá API: người dùng tạo ở App Store Connect → Users and Access → Integrations. Không bao giờ in nội dung `.p8`.
- Xcode mới có thể đổi `altool`; kiểm `xcrun altool --help` hoặc dùng Organizer / Transporter nếu lệnh báo đã ngừng.

## 6. Notarize app macOS (phân phối ngoài App Store)

```bash
codesign --deep --force --options runtime --timestamp -s "Developer ID Application: Ten (TEAMID)" App.app
ditto -c -k --keepParent App.app App.zip
xcrun notarytool store-credentials ct-notary --apple-id <email> --team-id <TEAMID>   # NGƯỜI DÙNG chạy (hỏi mật khẩu ứng dụng)
xcrun notarytool submit App.zip --keychain-profile ct-notary --wait
xcrun notarytool log <submission-id> --keychain-profile ct-notary     # khi Invalid: đọc lý do
xcrun stapler staple App.app && spctl -a -vv App.app                  # "accepted, source=Notarized Developer ID"
```
Lỗi notarize hay gặp: thiếu `--options runtime` (hardened runtime), binary con chưa ký, thiếu timestamp.

## 7. Bẫy thường gặp

- `xcodebuild` báo "Unable to find a destination" ⇒ tên/OS simulator sai — dùng `id=<UDID>`.
- Build thành công mà app trên simulator không đổi ⇒ cài nhầm `.app` cũ trong DerivedData khác; dùng `-derivedDataPath` riêng.
- Đĩa đầy: `~/Library/Developer/Xcode/DerivedData` và simulator cũ (`xcrun simctl delete unavailable`) — hỏi trước khi xoá.
- SwiftUI preview không chạy được từ dòng lệnh — kiểm bằng simulator + ảnh chụp.

## 8. Kiểm & báo cáo

BUILD SUCCEEDED + test xanh (số ca) + ảnh chụp simulator đã NHÌN; với phát hành: số phiên bản/build, trạng thái tải
lên/notarize. Nói rõ phần cần người dùng (đăng nhập Apple ID, mật khẩu ứng dụng, khoá API).
