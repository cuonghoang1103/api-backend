#!/usr/bin/env node
/**
 * Dựng bản macOS ĐÃ KÝ + ĐÃ CÔNG CHỨNG.
 *
 *   npm run dist:mac:ky    — thật: ký + công chứng + kiểm
 *   npm run dist:mac:thu   — THỬ: ký bằng chứng thư bất kỳ đang có, BỎ công
 *                            chứng, rồi kiểm + MỞ THỬ app.
 *
 * Chế độ thử tồn tại vì thứ hay làm hỏng bản ký KHÔNG phải bước công chứng, mà
 * là Hardened Runtime: bật nó lên là macOS chặn JIT của V8, chặn bộ nhớ thực
 * thi không ký, chặn nạp thư viện ngoài — app ký xong crash lúc mở, trong khi
 * bản CHƯA ký vẫn chạy ngon nên rất dễ đổ oan cho bản build. Chế độ thử tái
 * hiện đúng điều kiện đó bằng chứng thư `Apple Development` (loại này ký được,
 * chỉ không công chứng được), nên kiểm được entitlements từ trước khi có
 * chứng thư Developer ID.
 *
 * Ba bước, dừng ngay ở bước đầu tiên hỏng:
 *   1. Kiểm trước  — có chứng thư Developer ID chưa, có hồ sơ notarytool chưa
 *   2. Dựng        — electron-builder ký, rồi hook afterSign công chứng .app
 *   3. Kiểm sau    — codesign + spctl + stapler trên đúng file sắp phát hành
 *
 * Bước 3 là bước quan trọng nhất và cũng là bước hay bị bỏ nhất. Ký xong,
 * công chứng xong, `** BUILD SUCCEEDED **` vẫn hiện — mà app tải về vẫn hỏng.
 * Chỉ `spctl --assess` trên đúng file người dùng nhận mới nói thật.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HO_SO = process.env.KY_MAC_PROFILE || 'cuongthai-notary';
const LA_THU = process.argv.includes('--thu');

const do_ = (s) => `\x1b[31m${s}\x1b[0m`;
const xanh = (s) => `\x1b[32m${s}\x1b[0m`;
const vang = (s) => `\x1b[33m${s}\x1b[0m`;

function chay(lenh, dsThamSo, opts = {}) {
  return execFileSync(lenh, dsThamSo, { encoding: 'utf8', ...opts });
}

function thu(lenh, dsThamSo) {
  const r = spawnSync(lenh, dsThamSo, { encoding: 'utf8' });
  return { ok: r.status === 0, ra: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

// ── Bước 1: kiểm trước ────────────────────────────────────────────
function docDanhSachChungThu() {
  const ra = thu('security', ['find-identity', '-v', '-p', 'codesigning']).ra;
  // Mỗi dòng:  1) <SHA1 40 ký tự> "Tên chứng thư"
  return ra
    .split('\n')
    .map((d) => d.match(/^\s*\d+\)\s+([0-9A-F]{40})\s+"([^"]+)"/))
    .filter(Boolean)
    .map((m) => ({ ma: m[1], ten: m[2] }));
}

function timChungThu() {
  const ds = docDanhSachChungThu();
  const that = ds.find((c) => c.ten.startsWith('Developer ID Application:'));
  if (that) {
    // Mã đội (Team ID) nằm trong ngoặc CUỐI của tên chứng thư.
    const doi = that.ten.match(/\(([A-Z0-9]{10})\)\s*$/)?.[1];
    return doi ? { ...that, doi, thatSu: true } : null;
  }
  // Chế độ thử: xài tạm chứng thư phát triển. Luôn chỉ định bằng mã SHA-1 chứ
  // không bằng tên: Apple cấp chứng thư mới mà KHÔNG đổi tên, nên chỉ cần gia
  // hạn một lần là keychain có hai mục trùng tên y hệt và `codesign -s <tên>`
  // chết với "ambiguous (matches multiple identities)". Đã dính đúng vậy ngày
  // 19/08/2026; xoá bớt cái cũ là qua, nhưng chọn bằng mã thì không bao giờ
  // dính lại.
  if (LA_THU && ds.length) return { ...ds[0], doi: null, thatSu: false };
  return null;
}

function coHoSoNotary() {
  // Hỏi CHÍNH notarytool, đừng tự dò trong keychain.
  //
  // Bản đầu tìm mục generic-password dịch vụ `com.apple.gke.notary.tool` bằng
  // lệnh `security`. SAI: notarytool cất hồ sơ ở kho khoá được bảo vệ dữ liệu,
  // `security dump-keychain` KHÔNG liệt kê ra. Hậu quả 20/08/2026: hồ sơ đã
  // lưu thành công ("Credentials validated"), phép kiểm vẫn báo thiếu, và cả
  // bản dựng bị chặn ngay ở cửa — BỘ KIỂM sai, không phải thứ nó kiểm.
  //
  // `notarytool history` trả 0 khi hồ sơ dùng được, 69 khi không có (đo thật).
  // Đổi lại là một lượt gọi mạng, nhưng nó kiểm ĐÚNG thứ cần biết: hồ sơ có
  // XÀI ĐƯỢC không — chứ không phải có nằm ở cái đường dẫn ta đoán hay không.
  return thu('xcrun', ['notarytool', 'history', '--keychain-profile', HO_SO]).ok;
}

console.log(LA_THU ? '── THỬ KÝ (không công chứng) ─────────────────' : '── Kiểm trước ────────────────────────────────');

const chungThu = timChungThu();
if (!chungThu && LA_THU) {
  console.error(do_('✖ Keychain không có chứng thư ký nào cả — kể cả Apple Development.'));
  process.exit(1);
}
if (!chungThu) {
  console.error(do_('✖ Không tìm thấy chứng thư "Developer ID Application" trong Keychain.'));
  console.error(`
  Đây là chứng thư dùng để phát hành NGOÀI App Store. Chứng thư
  "Apple Development" đang có KHÔNG dùng để công chứng được.

  Cách nhanh nhất (2 phút, cần đăng nhập Apple ID của bạn — hãy tự làm,
  đừng đưa mật khẩu cho ai):

    Xcode → Settings… → Accounts → chọn Apple ID → Manage Certificates…
    → dấu + ở góc dưới trái → Developer ID Application

  Hoặc qua trang web: developer.apple.com/account/resources/certificates
  → dấu + → Developer ID Application → tải .cer về → bấm đúp để cài.

  Xong thì chạy lại lệnh này.`);
  process.exit(1);
}
console.log(`${xanh('✔')} Chứng thư: ${chungThu.ten}`);
if (chungThu.doi) console.log(`  Mã đội (Team ID): ${chungThu.doi}`);

if (!chungThu.thatSu) {
  console.log(vang('\n  ⚠️  Đây là chứng thư PHÁT TRIỂN, không phải Developer ID.'));
  console.log(vang('     Bản dựng ra CHỈ để kiểm entitlements trên máy này —'));
  console.log(vang('     KHÔNG công chứng được và KHÔNG phát hành được.'));
}

if (!LA_THU && !coHoSoNotary()) {
  console.error(do_(`\n✖ Chưa có hồ sơ notarytool tên "${HO_SO}".`));
  console.error(`
  Chạy lệnh dưới đây và tự gõ mật khẩu vào — hồ sơ được cất trong Keychain,
  từ lần sau không phải nhập lại và mật khẩu KHÔNG bao giờ nằm trong file
  cấu hình hay biến môi trường:

    xcrun notarytool store-credentials "${HO_SO}" \\
      --apple-id "cuongthaihnhe176322@gmail.com" \\
      --team-id "${chungThu.doi}"

  Nó sẽ hỏi "App-specific password". ĐÓ KHÔNG PHẢI mật khẩu Apple ID thường.
  Tạo tại appleid.apple.com → Sign-In and Security → App-Specific Passwords.`);
  process.exit(1);
}
if (!LA_THU) console.log(`${xanh('✔')} Hồ sơ notarytool: ${HO_SO}`);

// ── Bước 2: dựng ──────────────────────────────────────────────────
console.log(LA_THU ? '\n── Dựng + ký (bỏ công chứng) ─────────────────' : '\n── Dựng + ký + công chứng ────────────────────');
console.log(
  LA_THU
    ? vang('  Một thư mục .app arm64, không đóng gói. Vài phút.\n')
    : vang('  Bốn gói (dmg + zip, arm64 + x64) — mỗi kiến trúc là một lượt\n  công chứng riêng. Tính cả chờ Apple, thường 10-30 phút. Đừng ngắt.\n'),
);

const thamSo = LA_THU
  ? ['electron-builder', '--mac', '--dir', '--arm64', `-c.mac.identity=${chungThu.ma}`]
  : ['electron-builder', '--mac', '--publish', 'never', `-c.mac.identity=${chungThu.ma}`];

try {
  chay('npm', ['run', 'build'], { cwd: goc, stdio: 'inherit' });
  chay('npx', thamSo, {
    cwd: goc,
    stdio: 'inherit',
    // KY_MAC bật móc afterSign (công chứng). Chế độ thử KHÔNG bật — nên nó
    // không chạm tới mạng và không tốn một lượt gọi API nào của Apple.
    env: {
      ...process.env,
      KY_MAC: LA_THU ? '0' : '1',
      KY_MAC_PROFILE: HO_SO,
      CSC_IDENTITY_AUTO_DISCOVERY: 'true',
    },
  });
} catch {
  console.error(do_('\n✖ Dựng thất bại — xem log ở trên.'));
  process.exit(1);
}

// ── Bước 2b: công chứng CHÍNH file .dmg ───────────────────────────
//
// Móc afterSign đã công chứng + đóng dấu bản .app, nên con dấu nằm sẵn bên
// trong cả .dmg lẫn .zip — bản CÀI RỒI chạy được kể cả khi offline.
//
// Nhưng file .dmg là một vật thể RIÊNG. Người dùng tải nó về và mở ổ đĩa ảo;
// lúc đó Gatekeeper kiểm chính file .dmg, không phải app bên trong. Thiếu con
// dấu ở tầng này thì màn hình cảnh báo vẫn hiện ra ngay ở bước đầu tiên —
// đúng thứ mà cả việc ký này sinh ra để tránh.
//
// Đo thật 20/08/2026: hai bản .app đạt hết 10 phép kiểm, hai file .dmg trượt
// `stapler validate`. Lượt công chứng này nhanh vì Apple đã biết nội dung bên
// trong từ lượt trước.
if (!LA_THU) {
  const dsDmgCanDau = existsSync(path.join(goc, 'release'))
    ? readdirSync(path.join(goc, 'release')).filter((f) => f.endsWith('.dmg'))
    : [];
  for (const ten of dsDmgCanDau) {
    const duong = path.join(goc, 'release', ten);
    if (thu('xcrun', ['stapler', 'validate', duong]).ok) continue;   // đã có dấu
    console.log(`  → công chứng ${ten}…`);
    const r = thu('xcrun', ['notarytool', 'submit', duong,
                            '--keychain-profile', HO_SO, '--wait']);
    if (!r.ok) {
      console.error(do_(`  ✖ công chứng ${ten} thất bại:\n${r.ra.trim().slice(0, 400)}`));
      continue;
    }
    const dong = thu('xcrun', ['stapler', 'staple', duong]);
    console.log(dong.ok ? `  ${xanh('✔')} đã đóng dấu ${ten}`
                        : do_(`  ✖ đóng dấu ${ten} thất bại`));
  }
}

// ── Bước 3: kiểm sau ──────────────────────────────────────────────
console.log('\n── Kiểm lại trên chính file sắp phát hành ────');

const thuMucRa = path.join(goc, 'release');
const dsDmg = existsSync(thuMucRa)
  ? readdirSync(thuMucRa).filter((f) => f.endsWith('.dmg')).map((f) => path.join(thuMucRa, f))
  : [];
const dsApp = ['mac-arm64', 'mac', 'mac-x64']
  .map((d) => path.join(thuMucRa, d, 'CuongThai.app'))
  .filter((p) => existsSync(p));

let hong = 0;
const kiem = (nhan, ok, chiTiet = '') => {
  console.log(`  ${ok ? xanh('✔') : do_('✖')} ${nhan}${chiTiet ? ` — ${chiTiet}` : ''}`);
  if (!ok) hong += 1;
};

for (const app of dsApp) {
  console.log(`\n  ${path.relative(goc, app)}`);
  const cs = thu('codesign', ['--verify', '--deep', '--strict', '--verbose=2', app]);
  kiem('chữ ký hợp lệ', cs.ok, cs.ok ? '' : cs.ra.trim().split('\n')[0]);

  const runtime = thu('codesign', ['-d', '--verbose=2', app]);
  kiem('bật Hardened Runtime', /flags=.*runtime/.test(runtime.ra));

  // Entitlements là chỗ hỏng thật sự. Thiếu một khoá ở đây thì ký vẫn xanh,
  // công chứng vẫn xanh, rồi app crash lúc mở.
  const CAN_CO = [
    'com.apple.security.cs.allow-jit',
    'com.apple.security.cs.allow-unsigned-executable-memory',
    'com.apple.security.cs.disable-library-validation',
  ];
  const ent = thu('codesign', ['-d', '--entitlements', '-', '--xml', app]).ra;
  for (const khoa of CAN_CO) kiem(`entitlement ${khoa.split('.').pop()}`, ent.includes(khoa));
  kiem('entitlement micro (trợ lý Odin)', ent.includes('com.apple.security.device.audio-input'));

  // Tiến trình con phải KẾ THỪA, không dùng file entitlements của app chính.
  const helper = path.join(app, 'Contents/Frameworks/CuongThai Helper (Renderer).app');
  if (existsSync(helper)) {
    const entCon = thu('codesign', ['-d', '--entitlements', '-', '--xml', helper]).ra;
    kiem('helper có cs.inherit', entCon.includes('com.apple.security.cs.inherit'));
  }

  // Phép kiểm quyết định: MỞ THẬT. Chạy userData riêng vì app có
  // requestSingleInstanceLock() — bản đang cài mở sẵn sẽ khiến thực thể thứ
  // hai thoát ngay với log rỗng, trông y hệt "bản ký bị hỏng".
  const tamUserData = path.join(goc, 'release', '.thu-userdata');
  const chay1 = spawnSync(path.join(app, 'Contents/MacOS/CuongThai'), [`--user-data-dir=${tamUserData}`], {
    timeout: 15000,
    encoding: 'utf8',
  });
  // Hết giờ mà tiến trình vẫn sống = app mở được. Thoát sớm = crash.
  const song = chay1.error?.code === 'ETIMEDOUT';
  kiem('mở app thật, không crash', song, song ? '' : `thoát sớm: ${(chay1.stderr || chay1.stdout || '').trim().split('\n').slice(-2).join(' / ')}`);

  if (chungThu.thatSu) {
    // Chỉ có ý nghĩa với Developer ID đã công chứng. Chứng thư phát triển
    // CHẮC CHẮN trượt hai phép này — đó là hành vi đúng, không phải lỗi.
    const spctl = thu('spctl', ['--assess', '--type', 'execute', '--verbose=4', app]);
    kiem('Gatekeeper chấp nhận', spctl.ok, spctl.ok ? '' : spctl.ra.trim().split('\n').slice(0, 2).join(' / '));

    const dau = thu('xcrun', ['stapler', 'validate', app]);
    kiem('đã đóng dấu công chứng (chạy được cả khi offline)', dau.ok);
  } else {
    console.log(`  ${vang('—')} bỏ qua spctl + stapler: chứng thư phát triển không công chứng được`);
  }
}

for (const dmg of dsDmg) {
  console.log(`\n  ${path.relative(goc, dmg)}`);
  const dau = thu('xcrun', ['stapler', 'validate', dmg]);
  kiem('dmg đã đóng dấu', dau.ok, dau.ok ? '' : 'chạy: xcrun stapler staple "' + dmg + '"');
}

if (!dsApp.length && !dsDmg.length) {
  console.error(do_('\n✖ Không tìm thấy sản phẩm nào trong release/ — bước dựng có thật sự chạy không?'));
  process.exit(1);
}

console.log('');
if (hong) {
  console.error(do_(`✖ ${hong} phép kiểm KHÔNG đạt. ĐỪNG phát hành bản này.`));
  process.exit(1);
}
if (LA_THU) {
  console.log(xanh('✅ Đường ký chạy đúng: Hardened Runtime + entitlements không làm app chết.'));
  console.log('   Còn thiếu duy nhất chứng thư Developer ID Application để công chứng.');
  console.log('   Có rồi thì chạy: npm run dist:mac:ky');
} else {
  console.log(xanh('✅ Tất cả phép kiểm đạt. Bản macOS đã ký + công chứng, phát hành được.'));
  console.log('   Phát hành: gh release … (nhớ để bản nháp cho tới khi đủ file — xem electron-builder.yml)');
}
