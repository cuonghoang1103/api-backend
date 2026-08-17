/**
 * Smoke test cho chế độ Lập trình — CHẠY THẬT TRONG ELECTRON.
 *
 * `npm run agent:check` ở backend kiểm động cơ; `npm run smoke` kiểm nền tảng
 * app. Ở GIỮA hai cái đó còn một khoảng chưa ai kiểm, và nó là khoảng dễ hỏng
 * nhất: sự kiện `agent:event` có thật sự đi từ main qua preload lên React và
 * vẽ ra màn hình không. Typecheck không nói được điều đó — nó chỉ nói hai đầu
 * dây cùng kiểu, không nói dây có nối không.
 *
 * Chạy:
 *   node scripts/smoke-agent.mjs                 (cần backend cục bộ ở :3001)
 *   AGENT_SMOKE_PORT=3001 AGENT_SMOKE_USER=6 node scripts/smoke-agent.mjs
 *
 * ⚠️ CHẠY TRONG THƯ MỤC userData RIÊNG (`--user-data-dir`), nên nó KHÔNG đụng
 * tới cấu hình, phiên đăng nhập hay thư mục ghi chú thật của bạn. Đây không
 * phải chuyện gọn gàng: script cần ghim sẵn `agentWorkspace`, mà khoá đó CỐ Ý
 * bị chặn ở IPC (chỉ hộp thoại hệ thống mới đổi được) — cách duy nhất còn lại
 * là dựng sẵn file cấu hình, và làm thế trên thư mục thật thì một lần script
 * chết giữa chừng là mất cấu hình của người dùng.
 *
 * (Đây cũng là lý do lần chạy đầu thất bại: `electron.launch()` của playwright
 * dùng userData RIÊNG của nó, nên file ghi vào thư mục thật bị bỏ qua hoàn
 * toàn — app đọc một file khác và mở đúng trang cũ.)
 *
 * Thứ DUY NHẤT còn động vào trạng thái thật là cờ Pro của tài khoản thử trong
 * CSDL cục bộ; khôi phục nằm trong `finally`.
 */
import { _electron as electron } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const repo = path.resolve(root, '..');
const PORT = process.env.AGENT_SMOKE_PORT ?? '3001';
const USER_ID = Number(process.env.AGENT_SMOKE_USER ?? '6');
const API = `http://localhost:${PORT}`;

const results = [];
function check(label, pass, detail = '') {
  results.push(pass);
  console.log(`  ${pass ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${label}${detail ? ` — ${detail}` : ''}`);
}

// ─── Dựng dự án giả nhỏ (rẻ + kết quả không đổi theo máy) ──────────
const duAn = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-smoke-'));
fs.mkdirSync(path.join(duAn, 'src'));
fs.writeFileSync(path.join(duAn, 'src', 'boot.ts'), 'export const CONG = 7331;\n');
fs.writeFileSync(path.join(duAn, 'README.md'), '# du-an-smoke\n');
// File này PHẢI bị nhà tù chặn — đây là phép kiểm bảo mật, không phải trang trí.
fs.writeFileSync(path.join(duAn, '.env'), 'SECRET=sk-khong-duoc-lo-ra\n');

// ─── userData riêng: app thử KHÔNG dùng chung gì với app thật ───────
const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-smoke-ud-'));
const storeFile = path.join(userData, 'cuongthai-desktop.json');

const psql = (sql) =>
  execFileSync('docker', ['exec', 'cuong_pg_new', 'psql', '-U', 'postgres', '-d', 'cuonghoangdev_db', '-t', '-A', '-c', sql])
    .toString().trim();
const proGoc = psql(`select is_pro from users where id=${USER_ID};`);

let app;
try {
  // ── Bật Pro tạm ──
  psql(`update users set is_pro=true where id=${USER_ID};`);

  // ── Ghim thư mục dự án + mở thẳng /chat ──
  // Mô phỏng đúng trạng thái còn lại sau khi người dùng đã tự chọn thư mục ở
  // lần chạy trước: file cấu hình có sẵn `agentWorkspace`.
  fs.writeFileSync(storeFile, JSON.stringify({
    settings: { agentWorkspace: duAn, lastRoute: '/chat', theme: 'dark', sidebarMode: 'full' },
    windowState: { width: 1280, height: 860, maximized: false },
  }, null, 2));

  // ── Token thử, ký bằng khoá của backend cục bộ ──
  // KHÔNG dùng mật khẩu của ai: đây là token ký tay cho một tài khoản thử trên
  // CSDL cục bộ, đúng cách mà `scripts/agent-http-check.ts` đang làm.
  const env = fs.readFileSync(path.join(repo, '.env'), 'utf8');
  const secret = env.match(/^JWT_SECRET="?([^"\n]+)"?/m)?.[1];
  if (!secret) throw new Error('Không đọc được JWT_SECRET trong .env');
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = b64({ alg: 'HS256', typ: 'JWT' });
  const body = b64({ userId: USER_ID, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 1800 });
  const { createHmac } = await import('node:crypto');
  const sig = createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  const token = `${head}.${body}.${sig}`;

  console.log(`\nKhởi động app (API → ${API}, dự án giả ${path.basename(duAn)})…\n`);
  app = await electron.launch({
    // `--user-data-dir` là mấu chốt. Không có nó, playwright tự chọn một
    // userData khác và file cấu hình vừa ghi ở trên bị bỏ qua HOÀN TOÀN — app
    // vẫn chạy, vẫn xanh, chỉ là mở đúng trang cũ và không có thư mục dự án
    // nào. Lỗi đó không báo gì; nó chỉ hiện ra ở phép kiểm thất bại xa tít
    // phía dưới.
    args: [`--user-data-dir=${userData}`, path.join(root, 'dist/main/index.cjs')],
    env: { ...process.env, CT_RENDERER: 'bundle', CUONGTHAI_API_ORIGIN: API },
  });
  const w = await app.firstWindow();
  await w.waitForLoadState('domcontentloaded');

  // ── Cấy phiên rồi nạp lại để app tự khôi phục ──
  await w.evaluate(
    ([uid, tk]) => globalThis.cuongthai.auth.storeSession({ userId: uid, sessionToken: tk }),
    [USER_ID, token],
  );
  await w.reload();
  await w.waitForLoadState('domcontentloaded');
  await w.waitForSelector('.ct-shell', { timeout: 20000 });

  console.log('Vào màn hình:');
  check('khôi phục phiên → vào được shell', true);

  const coTrangChat = await w.locator('.ct-segment-nut', { hasText: 'Lập trình' }).count();
  check('/chat là màn native, có nút chuyển chế độ', coTrangChat === 1);

  await w.locator('.ct-segment-nut', { hasText: 'Lập trình' }).click();
  await w.waitForSelector('.ct-agent-bar', { timeout: 20000 });

  // ⚠️ PHẢI thu hẹp vào chế độ ĐANG HIỆN. Cả hai chế độ cùng nằm trong DOM (giữ
  // sống bằng CSS `display` để không mất hội thoại đang dở), nên `.ct-agent-o`
  // trần khớp HAI ô nhập — của Trò chuyện và của Lập trình. Chọn nhầm ô thì
  // phép kiểm gõ chữ vào một màn hình vô hình rồi chờ mãi.
  const man = w.locator('.ct-chedo[data-hien="true"]');

  console.log('\nIPC agent (thật, qua preload):');
  const tenThuMuc = (await man.locator('.ct-agent-ws-name').innerText()).trim();
  check('agent:getWorkspace trả về thư mục đã ghim', tenThuMuc === path.basename(duAn), tenThuMuc);

  const hanMuc = await man.locator('.ct-agent-hanmuc-chu').count();
  check('agent:getInfo trả về hạn mức → thanh đo hiện ra', hanMuc === 1,
    hanMuc ? await man.locator('.ct-agent-hanmuc-chu').innerText() : 'không có');

  const oNhap = man.locator('.ct-agent-o');
  check('ô nhập bật (đã Pro nên không thấy màn mời nâng cấp)', await oNhap.isEnabled());

  // ── Chạy MỘT lượt thật ──
  console.log('\nMột lượt agent thật (đọc file trên đĩa):');
  await oNhap.fill('Cổng (CONG) trong dự án này là số mấy? Tự tìm trong mã.');
  await man.locator('.ct-agent-soan .ct-btn').click();

  // Con quay phải hiện NGAY — đây là chốt UX quan trọng nhất, vì có tới ~10
  // giây im lặng trước dòng chữ đầu tiên.
  const quayHien = await man.locator('.ct-agent-nghi').isVisible({ timeout: 5000 }).catch(() => false);
  check('con quay bật ngay, không chờ chữ đầu tiên', quayHien);

  // Chờ lượt KẾT THÚC.
  //
  // ⚠️ Điều kiện "có chữ + không thấy con quay" là SAI, và sai một cách rất
  // khó thấy: agent hay mở đầu bằng "Tôi sẽ dò cấu trúc dự án…" rồi mới gọi
  // tool. Câu mở đầu đó đã dài hơn 20 ký tự và con quay đã tắt (khung `chu`
  // tắt nó), nên phép chờ trả về NGAY GIỮA LƯỢT — rồi mọi phép kiểm sau đó đo
  // một màn hình còn đang chạy dở. Chỉ những lần model im lặng gọi tool luôn
  // mới tình cờ đúng.
  //
  // Tín hiệu ĐÚNG là nút quay lại chữ "Gửi": nó chỉ đổi khi `chayLuot()` đã
  // trả về.
  await w.waitForFunction(
    () => {
      const man = document.querySelector('.ct-chedo[data-hien="true"]');
      if (!man) return false;
      if (man.querySelector('.ct-agent-scroll .ct-notice[data-tone="err"]')) return true;
      const nut = man.querySelector('.ct-agent-soan .ct-btn');
      return !!nut && nut.textContent.includes('Gửi');
    },
    // ⚠️ Tham số THỨ BA mới là options. Playwright là `(fn, arg, options)`, nên
    // đặt `{timeout}` ở vị trí thứ hai thì nó bị hiểu là ĐỐI SỐ truyền vào hàm
    // và timeout rơi về mặc định 30 giây — quá ngắn cho một lượt agent (đo
    // được 15–60s), và lỗi hiện ra dưới dạng "hết giờ" chứ không nói gì về
    // nguyên nhân thật.
    null,
    { timeout: 180000 },
  );

  const loi = await man.locator('.ct-agent-scroll .ct-notice[data-tone="err"]').count();
  if (loi > 0) {
    check('lượt chạy không lỗi', false, await man.locator('.ct-agent-scroll .ct-notice[data-tone="err"]').first().innerText());
  } else {
    const soTool = await man.locator('.ct-agent-tool').count();
    check('sự kiện tool đi tới được giao diện', soTool > 0, `${soTool} dòng công cụ`);

    const tenTool = soTool > 0 ? await man.locator('.ct-agent-tool code').first().innerText() : '';
    check('dòng công cụ mang tên tool thật', /list_dir|read_file|grep|glob|git_/.test(tenTool), tenTool);

    const traLoi = await man.locator('.ct-agent-may').last().innerText();
    check('agent ĐỌC ĐƯỢC file và trả lời đúng', traLoi.includes('7331'), traLoi.slice(0, 90).replace(/\n/g, ' '));
    check('KHÔNG lộ nội dung .env', !traLoi.includes('sk-khong-duoc-lo-ra'));

    const hanMucSau = await man.locator('.ct-agent-hanmuc-chu').innerText();
    check('hạn mức cập nhật sau lượt chạy', hanMucSau.length > 0, hanMucSau);
  }

  // ══ P2: sửa file có duyệt diff ══
  //
  // Đây là phép kiểm quan trọng nhất của cả file. Nó chứng minh ba điều mà
  // không phép kiểm nào khác chạm tới: agent KHÔNG ghi được gì trước khi người
  // dùng bấm, nó GHI THẬT sau khi bấm, và hoàn tác trả file về NGUYÊN VĂN.
  console.log('\nP2 — sửa file có duyệt:');
  const fileThu = path.join(duAn, 'src', 'boot.ts');
  const noiDungGoc = fs.readFileSync(fileThu, 'utf8');

  check('mặc định quyền sửa TẮT', (await man.locator('.ct-agent-suanut').getAttribute('data-bat')) === 'false');
  await man.locator('.ct-agent-suanut').click();
  // ĐỢI React vẽ lại, đừng đọc thuộc tính ngay sau `click()`. Bấm là đồng bộ,
  // còn `datCheDoSua` là một vòng IPC rồi mới setState — đọc ngay thì luôn thấy
  // giá trị CŨ, và phép kiểm báo hỏng cho một thứ hoàn toàn đúng.
  const batDuoc = await man
    .locator('.ct-agent-suanut[data-bat="true"]')
    .waitFor({ timeout: 10000 })
    .then(() => true)
    .catch(() => false);
  check('bật được quyền sửa', batDuoc);

  await oNhap.fill('Trong src/boot.ts, đổi giá trị CONG từ 7331 thành 9999. Chỉ đổi đúng con số đó.');
  await man.locator('.ct-agent-soan .ct-btn').first().click();

  // Thẻ duyệt phải hiện ra — và file trên đĩa phải CHƯA đổi.
  await w.waitForSelector('.ct-chedo[data-hien="true"] .ct-xinphep', { timeout: 180000 });
  check('thẻ duyệt hiện ra trước khi ghi', true);
  check(
    'file trên đĩa CHƯA đổi khi thẻ còn đang chờ',
    fs.readFileSync(fileThu, 'utf8') === noiDungGoc,
  );

  const soDongThem = await man.locator('.ct-xinphep .ct-diff-dong[data-loai="them"]').count();
  const soDongBo = await man.locator('.ct-xinphep .ct-diff-dong[data-loai="bo"]').count();
  check('thẻ có bảng diff', soDongThem > 0 && soDongBo > 0, `+${soDongThem} −${soDongBo}`);
  const chuThem = await man.locator('.ct-xinphep .ct-diff-dong[data-loai="them"] .ct-diff-text').first().innerText();
  check('diff hiện đúng giá trị mới', chuThem.includes('9999'), chuThem.trim());

  await man.locator('.ct-xinphep .ct-btn', { hasText: 'Cho phép' }).first().click();
  await w.waitForFunction(
    () => !document.querySelector('.ct-chedo[data-hien="true"] .ct-xinphep'),
    null,
    { timeout: 30000 },
  );

  const sauKhiDuyet = fs.readFileSync(fileThu, 'utf8');
  check('file trên đĩa ĐÃ đổi sau khi duyệt', sauKhiDuyet.includes('9999') && !sauKhiDuyet.includes('7331'));

  // Chờ lượt kết thúc THẬT rồi mới hoàn tác.
  //
  // ⚠️ KHÔNG chờ `.ct-agent-nghi` biến mất: con quay tắt ở mỗi khung chữ và mỗi
  // dòng công cụ, nên "không thấy con quay" chỉ nghĩa là agent vừa nói gì đó,
  // không nghĩa là nó xong. Tín hiệu ĐÚNG là nút quay về chữ "Gửi" — nó chỉ đổi
  // khi `chayLuot()` đã trả về, tức là khung `xong` đã tới và `soFileDaSua` đã
  // được cập nhật.
  await w.waitForFunction(
    () => {
      const nut = document.querySelector('.ct-chedo[data-hien="true"] .ct-agent-soan .ct-btn');
      return !!nut && nut.textContent.includes('Gửi');
    },
    null,
    { timeout: 180000 },
  );

  const coNutHoanTac = await man.locator('.ct-agent-hoantac').count();
  check('nút Hoàn tác hiện ra sau khi có file bị sửa', coNutHoanTac === 1);
  if (coNutHoanTac === 1) {
    await man.locator('.ct-agent-hoantac').click();
    await w.waitForTimeout(1500);
    check(
      'hoàn tác trả file về NGUYÊN VĂN bản gốc',
      fs.readFileSync(fileThu, 'utf8') === noiDungGoc,
    );
  }
} finally {
  await app?.close().catch(() => {});

  // Cấu hình + phiên nằm trong userData tạm nên xoá là sạch — không có gì của
  // người dùng để khôi phục. Chỉ cờ Pro là chạm vào trạng thái thật.
  try { psql(`update users set is_pro=${proGoc === 't' ? 'true' : 'false'} where id=${USER_ID};`); } catch { /* CSDL tắt */ }
  fs.rmSync(duAn, { recursive: true, force: true });
  fs.rmSync(userData, { recursive: true, force: true });
  console.log('\n(đã trả cờ Pro về như cũ, xoá dự án giả và userData tạm)');
}

const hong = results.filter((r) => !r).length;
console.log(hong === 0 ? `\n\x1b[32m${results.length}/${results.length} phép kiểm đạt\x1b[0m\n` : `\n\x1b[31m${hong} phép kiểm HỎNG\x1b[0m\n`);
process.exit(hong === 0 ? 0 : 1);
