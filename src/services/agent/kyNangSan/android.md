---
name: android
description: Android bằng dòng lệnh trên macOS/Windows/Linux: JDK + SDK (sdkmanager hoặc `android` CLI mới), tạo/chạy emulator (avdmanager, emulator), adb (cài, log, chụp màn hình), Gradle build/test/ký APK/AAB, lỗi hay gặp.
---

# KỸ NĂNG: ANDROID — SDK, emulator, adb, Gradle

## 0. Luật vàng

1. **Khảo sát trước**: JDK, `ANDROID_HOME`, công cụ nào có. Android Studio đã cài thì SDK thường ở
   macOS `~/Library/Android/sdk` · Windows `%LOCALAPPDATA%\Android\Sdk` · Linux `~/Android/Sdk`.
2. **Chỉ MỘT emulator mỗi lúc** (mỗi cái 2–4 GB RAM). `adb devices` trước — đang có thiết bị/emulator thì dùng lại.
3. Lệnh hỏi chấp nhận giấy phép (`sdkmanager --licenses`) ⇒ chạy với `yes |` CHỈ khi người dùng đồng ý điều khoản.
4. Khoá ký release (`.jks`/keystore) và mật khẩu của nó: không tạo đè, không in, không commit.
5. Gradle build dài ⇒ `chay_lenh_nen`.

## 1. Khảo sát & cài

```bash
java -version                  # AGP 8.x cần JDK 17+ (AGP 9 cần 17/21) — sai JDK là lỗi số một
echo $ANDROID_HOME ; ls "$ANDROID_HOME" 2>/dev/null
which adb sdkmanager avdmanager emulator
```
- JDK: macOS `brew install --cask temurin@21` · Windows `winget install -e --id EclipseAdoptium.Temurin.21.JDK` ·
  Ubuntu `sudo apt-get install -y openjdk-21-jdk`. Hoặc dùng JDK đi kèm Android Studio (`JAVA_HOME=…/jbr`).
- Công cụ dòng lệnh: macOS `brew install --cask android-commandlinetools` · Windows/Linux tải "Command line tools only"
  từ developer.android.com, giải nén thành `$ANDROID_HOME/cmdline-tools/latest/`.
- Đặt biến (thêm vào profile shell của người dùng — hỏi trước khi sửa file profile):
  `export ANDROID_HOME=~/Library/Android/sdk; export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH`

## 2. SDK packages

```bash
sdkmanager --list_installed
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "emulator" \
           "system-images;android-35;google_apis;arm64-v8a"     # x86_64 trên máy Intel/AMD
yes | sdkmanager --licenses                                      # chỉ khi người dùng đồng ý
```
**`android` CLI mới** (đã đo: cmdline-tools bản mới in "sdkmanager is deprecated… 'android sdk' is the replacement"):
`android --no-metrics sdk list|install|update|remove`, `android --no-metrics emulator …`, `android --no-metrics run`,
`android --no-metrics screen`, `android --no-metrics info`. Lần đầu nó tải phần lõi về. sdkmanager vẫn chạy — dùng
cái có sẵn, ghi rõ trong báo cáo đã dùng cái nào.

## 3. Emulator

```bash
avdmanager list avd
avdmanager create avd -n pixel35 -k "system-images;android-35;google_apis;arm64-v8a" -d pixel_7 --force <<< "no"
emulator -list-avds
emulator -avd pixel35 -no-snapshot-save -no-boot-anim -netdelay none -netspeed full &     # chạy NỀN (chay_lenh_nen)
adb wait-for-device && until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do sleep 2; done; echo BOOTED
adb emu kill                                                     # tắt emulator do chính bạn mở
```
- Không có màn hình (CI/SSH): thêm `-no-window -gpu swiftshader_indirect`.
- `HVF/KVM is not available` ⇒ ảo hoá chưa bật (BIOS), Linux thiếu quyền `/dev/kvm` (`sudo usermod -aG kvm $USER`),
  hoặc ảnh x86_64 trên máy ARM.

## 4. adb hằng ngày

```bash
adb devices -l
adb install -r app/build/outputs/apk/debug/app-debug.apk         # -r cài đè giữ dữ liệu
adb shell am start -n com.vidu.app/.MainActivity
adb shell monkey -p com.vidu.app -c android.intent.category.LAUNCHER 1     # mở app khi không biết tên Activity
adb logcat -c && adb logcat '*:E' | grep -i "com.vidu.app\|AndroidRuntime"  # chạy nền; lỗi crash nằm ở AndroidRuntime
adb exec-out screencap -p > build/shot.png                        # chụp màn hình rồi NHÌN
adb shell input text "xin%schao" ; adb shell input tap 540 1200 ; adb shell input keyevent KEYCODE_BACK
adb reverse tcp:3000 tcp:3000                                     # app trong máy gọi localhost:3000 của máy tính
adb uninstall com.vidu.app                                        # xoá cả dữ liệu app — hỏi nếu là máy thật
```
Máy thật: bật Developer options + USB debugging, chấp nhận khoá RSA trên máy (người dùng bấm). Nhiều thiết bị ⇒ `adb -s <serial>`.

## 5. Gradle

```bash
./gradlew --version                     # luôn dùng wrapper của dự án, không dùng gradle toàn cục
./gradlew assembleDebug
./gradlew testDebugUnitTest             # test JVM
./gradlew connectedDebugAndroidTest     # test trên thiết bị/emulator đang chạy
./gradlew lint ; ./gradlew bundleRelease   # AAB cho Play Store
./gradlew :app:dependencies --configuration releaseRuntimeClasspath   # xung đột thư viện
```
Windows: `gradlew.bat`. `Permission denied` trên macOS/Linux ⇒ `chmod +x gradlew`.
Ký release: cấu hình `signingConfigs` đọc mật khẩu từ biến môi trường/`keystore.properties` (đã gitignore), không viết cứng.
Tạo khoá (người dùng nhập mật khẩu): `keytool -genkeypair -v -keystore release.jks -alias app -keyalg RSA -keysize 2048 -validity 10000`.
Kiểm chữ ký: `$ANDROID_HOME/build-tools/35.0.0/apksigner verify --print-certs app-release.apk`.

## 6. Lỗi hay gặp

| Lỗi | Nguyên nhân |
|---|---|
| `Unsupported class file major version 65` / `requires Java 17` | sai JDK — đặt `JAVA_HOME` đúng bản |
| `SDK location not found` | thiếu `ANDROID_HOME` hoặc `local.properties` (`sdk.dir=…`) |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | chữ ký khác bản đã cài ⇒ gỡ bản cũ (hỏi) |
| `INSTALL_FAILED_NO_MATCHING_ABIS` | thư viện native không có ABI của emulator (arm64 vs x86_64) |
| `Cleartext HTTP traffic not permitted` | gọi `http://` — dùng HTTPS hoặc `networkSecurityConfig` cho debug |
| Emulator gọi `localhost` không tới máy tính | trong emulator máy tính là `10.0.2.2`, hoặc `adb reverse` |
| Gradle hết RAM | `org.gradle.jvmargs=-Xmx4g` trong `gradle.properties` |

## 7. Kiểm & báo cáo

Build xanh (đường dẫn APK/AAB), test (số ca), app đã mở trên emulator/máy + ảnh chụp đã NHÌN, logcat không có
`FATAL EXCEPTION`. Ghi rõ đã tắt emulator mình mở chưa, và việc cần người dùng (giấy phép SDK, khoá ký, USB debugging).
