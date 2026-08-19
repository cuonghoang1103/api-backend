/**
 * afterSign — công chứng (notarize) bản .app NGAY SAU khi electron-builder ký,
 * và TRƯỚC khi nó đóng .dmg/.zip.
 *
 * Thứ tự đó là cả vấn đề. `xcrun stapler` chỉ đóng dấu được vào .app, .dmg hoặc
 * .pkg — KHÔNG đóng được vào .zip. Mà electron-updater trên macOS lại cập nhật
 * bằng .zip (Squirrel.Mac). Nếu công chứng sau khi đã đóng gói thì:
 *   • .dmg đóng dấu được  → người cài lần đầu không thấy cảnh báo
 *   • .zip KHÔNG đóng dấu → bản tự cập nhật phải hỏi máy chủ Apple mỗi lần mở,
 *     và máy đang offline sẽ thấy cảnh báo "chưa xác minh được nhà phát triển"
 * Công chứng ở đây, lúc còn là .app, thì con dấu nằm SẴN BÊN TRONG cả hai gói.
 *
 * Mật khẩu KHÔNG đi qua biến môi trường: dùng hồ sơ đã cất trong Keychain
 * (`xcrun notarytool store-credentials`). Biến môi trường lọt vào log build,
 * lọt vào `ps`, và lọt vào ảnh chụp màn hình khi gỡ lỗi.
 *
 * Hook TỰ TẮT trừ khi KY_MAC=1 — nên `npm run dist:mac` (bản chưa ký) chạy y
 * như trước, không đụng tới mạng.
 */
const path = require('path');

exports.default = async function notarizeHook(context) {
  if (process.env.KY_MAC !== '1') return;
  if (context.electronPlatformName !== 'darwin') return;

  const profile = process.env.KY_MAC_PROFILE || 'cuongthai-notary';
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);

  console.log(`\n  → Đang công chứng ${appName}.app (${context.arch === 1 ? 'x64' : 'arm64'})…`);
  console.log('    Apple thường trả lời trong 2-15 phút. ĐỪNG giết tiến trình giữa chừng.');

  const started = Date.now();
  const { notarize } = require('@electron/notarize');
  // notarize() tự chạy `xcrun stapler staple` khi Apple duyệt xong.
  await notarize({ tool: 'notarytool', appPath, keychainProfile: profile });

  const phut = ((Date.now() - started) / 60000).toFixed(1);
  console.log(`  ✅ Công chứng + đóng dấu xong sau ${phut} phút: ${appPath}\n`);
};
