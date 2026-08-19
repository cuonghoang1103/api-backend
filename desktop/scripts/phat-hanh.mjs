#!/usr/bin/env node
/**
 * ============================================================
 * MỘT CHỖ PHÁT HÀNH DUY NHẤT cho app desktop
 * ============================================================
 *
 *   npm run phat-hanh -- "mô tả ngắn"      → tăng số cuối (0.5.41 → 0.5.42)
 *   npm run phat-hanh -- 0.6.0 "mô tả"     → đặt hẳn số phiên bản
 *   npm run phat-hanh -- --tiep            → phát hành ĐÚNG số đang có trong
 *                                            package.json (dùng khi ai đó đã
 *                                            bump mà chưa từng ship)
 *   thêm --dong-y  → khỏi hỏi lại trước khi push
 *   thêm --khong-cho → bắn workflow rồi thoát, không đứng chờ ~10 phút
 *
 * ─── VÌ SAO CẦN FILE NÀY ───
 *
 * Nhiều phiên Claude cùng làm app desktop, mỗi phiên tự bump `package.json`
 * rồi tự `gh workflow run`. Đêm 19-20/08/2026 đo được: **11 lần bump trong
 * 4,5 giờ**, và hai hậu quả thật:
 *
 *   • **0.5.39 bump rồi KHÔNG BAO GIỜ được phát hành.** Người dùng ở lại
 *     0.5.38 suốt, trong khi mọi phiên đều tin là đã ship. Không ai thấy vì
 *     không có chỗ nào đối chiếu "số trong package.json" với "số đã lên
 *     GitHub Releases".
 *   • **v0.5.40 bị dựng hai lượt.** Lượt A công bố lúc 18:08:17, lượt B xong
 *     18:15:37 và tải ĐÈ lên đúng release ấy. Lần đó vô hại vì hai lượt cùng
 *     một commit — nhưng nếu khác commit thì người dùng đã tải một bản cài
 *     mang số hiệu của bản khác, và không có cách nào biết.
 *
 * Nên mọi lối phát hành gom về đây. Script KHÔNG làm gì thông minh; nó chỉ
 * chặn đúng những cửa đã từng lọt.
 *
 * ⚠️ Chốt chặn thứ hai nằm TRONG workflow (`desktop-release.yml`, bước "Chặn
 * dựng đè bản đã công bố"). Hai lớp vì lớp này chỉ giữ được người CHỊU chạy
 * script; lớp kia giữ được cả người gõ tay `gh workflow run`.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const thuMucDesktop = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gocKho = path.resolve(thuMucDesktop, '..');
const KHO_PHAT_HANH = 'cuonghoang1103/cuongthai-desktop';
const WORKFLOW = 'desktop-release.yml';

const do_ = (s) => `\x1b[31m${s}\x1b[0m`;
const xanh = (s) => `\x1b[32m${s}\x1b[0m`;
const vang = (s) => `\x1b[33m${s}\x1b[0m`;
const mo = (s) => `\x1b[2m${s}\x1b[0m`;

function chay(lenh, args, opts = {}) {
  return execFileSync(lenh, args, { encoding: 'utf8', cwd: gocKho, ...opts }).trim();
}
/** Chạy và trả `null` khi lệnh hỏng, thay vì ném. */
function thu(lenh, args, opts = {}) {
  const r = spawnSync(lenh, args, { encoding: 'utf8', cwd: gocKho, ...opts });
  return r.status === 0 ? (r.stdout ?? '').trim() : null;
}
function chet(...dong) {
  console.error(`\n${do_('✗')} ${dong[0]}`);
  for (const d of dong.slice(1)) console.error(`  ${d}`);
  console.error('');
  process.exit(1);
}
const ok = (s) => console.log(`${xanh('✓')} ${s}`);
const luu_y = (s) => console.log(`${vang('!')} ${s}`);

// ─── Đọc tham số ───────────────────────────────────────────────────
const tho = process.argv.slice(2);
const co = new Set(tho.filter((t) => t.startsWith('--')));
const conLai = tho.filter((t) => !t.startsWith('--'));
const LA_TIEP = co.has('--tiep');
const DONG_Y_SAN = co.has('--dong-y');
const KHONG_CHO = co.has('--khong-cho');

const laSo = (t) => /^\d+\.\d+\.\d+$/.test(t);
const phienBanChiDinh = conLai.find(laSo) ?? null;
const moTa = conLai.filter((t) => !laSo(t)).join(' ').trim();

// ─── 0. Công cụ ────────────────────────────────────────────────────
if (!thu('gh', ['--version'])) chet('Không có `gh` — cần GitHub CLI để bắn workflow và tra release.');
if (!thu('gh', ['auth', 'status'])) chet('`gh` chưa đăng nhập. Chạy: gh auth login');

// ─── 1. Đúng nhánh ────────────────────────────────────────────────
const nhanh = chay('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
if (nhanh !== 'main') {
  chet(`Đang ở nhánh \`${nhanh}\`, không phải \`main\`.`,
    'Workflow dựng từ `main` trên GitHub, nên phát hành từ nhánh khác là dựng ra thứ bạn không thấy.');
}
ok(`Nhánh ${nhanh}`);

/*
 * ─── 2. `desktop/` phải SẠCH ──────────────────────────────────────
 *
 * Đây là cửa dễ lọt nhất, và nó im lặng: workflow lấy mã TỪ GITHUB, nên thứ
 * đang sửa dở trên máy KHÔNG có trong bản cài — mà bản cài vẫn ra, vẫn chạy,
 * chỉ thiếu đúng phần bạn vừa làm. Không lỗi nào để thấy.
 */
const banDesktop = chay('git', ['status', '--porcelain', '--', 'desktop/'])
  .split('\n').filter((d) => d.trim() && !d.startsWith('??'));
if (banDesktop.length > 0) {
  chet('`desktop/` còn thay đổi CHƯA COMMIT — chúng sẽ KHÔNG có trong bản cài:',
    ...banDesktop.map((d) => mo(`    ${d}`)),
    '',
    'Workflow dựng từ mã trên GitHub, không phải từ máy bạn. Commit rồi chạy lại.');
}
ok('`desktop/` sạch');

// ─── 3. Đồng bộ với GitHub ────────────────────────────────────────
thu('git', ['fetch', '--quiet', 'origin', 'main']);
const truoc = Number(chay('git', ['rev-list', '--count', 'origin/main..HEAD']));
const sau = Number(chay('git', ['rev-list', '--count', 'HEAD..origin/main']));
if (sau > 0) {
  chet(`Máy bạn đang SAU origin/main ${sau} commit.`,
    'Phiên khác vừa đẩy gì đó lên. Chạy `git pull --ff-only` rồi thử lại —',
    'nếu không, bản phát hành sẽ mang mã bạn chưa từng nhìn thấy.');
}
if (truoc > 0) luu_y(`Có ${truoc} commit chưa push — script sẽ push chúng cùng lúc.`);
else ok('Đã đồng bộ với origin/main');

// ─── 4. Không có lượt dựng nào đang chạy ──────────────────────────
const dangChay = JSON.parse(thu('gh', ['run', 'list', '--workflow', WORKFLOW,
  '--status', 'in_progress', '--json', 'databaseId,createdAt']) || '[]')
  .concat(JSON.parse(thu('gh', ['run', 'list', '--workflow', WORKFLOW,
    '--status', 'queued', '--json', 'databaseId,createdAt']) || '[]'));
if (dangChay.length > 0) {
  chet('Đang có lượt dựng CHẠY DỞ — nhiều khả năng một phiên khác vừa bắn:',
    ...dangChay.map((r) => mo(`    run ${r.databaseId} · bắt đầu ${r.createdAt}`)),
    '',
    'Chờ nó xong rồi hẵng chạy lại. Hai lượt cùng lúc từng tải đè lên nhau (v0.5.40).');
}
ok('Không có lượt dựng nào đang chạy');

// ─── 5. Chọn số phiên bản ─────────────────────────────────────────
const duongDanPkg = path.join(thuMucDesktop, 'package.json');
const pkg = JSON.parse(readFileSync(duongDanPkg, 'utf8'));
const hienTai = pkg.version;

/** `false` = chưa có release · `true` = có và ĐÃ công bố · `'nhap'` = bản nháp. */
function daPhatHanh(v) {
  const r = thu('gh', ['release', 'view', `v${v}`, '--repo', KHO_PHAT_HANH, '--json', 'isDraft', '--jq', '.isDraft']);
  if (r === null) return false;
  return r === 'true' ? 'nhap' : true;
}

const trangThaiHienTai = daPhatHanh(hienTai);
let phienBanMoi;

if (LA_TIEP) {
  if (trangThaiHienTai === true) {
    chet(`v${hienTai} ĐÃ công bố rồi — \`--tiep\` không dùng được ở đây.`,
      'Muốn ra bản mới thì: npm run phat-hanh -- "mô tả ngắn"');
  }
  phienBanMoi = hienTai;
  ok(`Phát hành tiếp số đang có: ${phienBanMoi}${trangThaiHienTai === 'nhap' ? ' (đang là bản nháp)' : ''}`);
} else if (phienBanChiDinh) {
  if (daPhatHanh(phienBanChiDinh) === true) chet(`v${phienBanChiDinh} đã công bố rồi — chọn số khác.`);
  phienBanMoi = phienBanChiDinh;
} else if (trangThaiHienTai !== true) {
  /*
   * Số trong package.json CHƯA từng lên GitHub Releases. Đây đúng là cái hố
   * 0.5.39 rơi vào. Không bump thêm — ship chính nó.
   */
  luu_y(`v${hienTai} có trong package.json nhưng CHƯA từng phát hành.`);
  luu_y('Ship chính nó thay vì bump tiếp — bump nữa là bỏ luôn số này (đúng chuyện đã xảy ra với 0.5.39).');
  phienBanMoi = hienTai;
} else {
  const [a, b, c] = hienTai.split('.').map(Number);
  phienBanMoi = `${a}.${b}.${c + 1}`;
}

const canBump = phienBanMoi !== hienTai;
if (canBump && !moTa) {
  chet('Thiếu mô tả cho bản mới.', 'Ví dụ: npm run phat-hanh -- "sửa robot nổi không kéo được"');
}

// ─── 6. Xác nhận rồi mới đụng vào `main` ──────────────────────────
console.log('');
console.log(`  Phiên bản   : ${hienTai}${canBump ? ` → ${xanh(phienBanMoi)}` : mo(' (giữ nguyên)')}`);
console.log(`  Commit hiện : ${chay('git', ['rev-parse', '--short', 'HEAD'])}`);
if (canBump) console.log(`  Mô tả       : ${moTa}`);
console.log(`  Sẽ làm      : ${canBump ? 'bump + commit + ' : ''}${truoc > 0 || canBump ? 'push main + ' : ''}bắn ${WORKFLOW}`);
console.log('');

if (!DONG_Y_SAN) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const tra = await rl.question('  Làm tiếp? [y/N] ');
  rl.close();
  if (!/^y$/i.test(tra.trim())) { console.log('  Dừng theo yêu cầu.\n'); process.exit(0); }
}

// ─── 7. Bump + push ───────────────────────────────────────────────
if (canBump) {
  pkg.version = phienBanMoi;
  writeFileSync(duongDanPkg, `${JSON.stringify(pkg, null, 2)}\n`);
  chay('git', ['add', 'desktop/package.json']);
  chay('git', ['commit', '-m', `chore(desktop): ${phienBanMoi} — ${moTa}`]);
  ok(`Đã commit bump ${phienBanMoi}`);
}
if (canBump || truoc > 0) {
  // KHÔNG `--force`, không bao giờ. Bị từ chối thì để nguyên cho người xem.
  const r = spawnSync('git', ['push', 'origin', 'HEAD:main'], { cwd: gocKho, stdio: 'inherit' });
  if (r.status !== 0) chet('Push hỏng — chưa bắn workflow. Xử lý push rồi chạy lại.');
  ok('Đã push lên origin/main');
}

// ─── 8. Bắn workflow ──────────────────────────────────────────────
if (!thu('gh', ['workflow', 'run', WORKFLOW, '--ref', 'main'])) {
  chet('Bắn workflow hỏng.', `Chạy tay: gh workflow run ${WORKFLOW} --ref main`);
}
ok('Đã bắn workflow');

// Chờ một nhịp rồi mới hỏi id: `gh workflow run` không trả id, và hỏi ngay
// thì lượt vừa bắn chưa kịp xuất hiện trong danh sách.
await new Promise((r) => setTimeout(r, 6000));
const ds = JSON.parse(thu('gh', ['run', 'list', '--workflow', WORKFLOW, '--limit', '1',
  '--json', 'databaseId,url']) || '[]');
const run = ds[0];
if (!run) chet('Không tìm thấy lượt vừa bắn — kiểm tab Actions.');
console.log(`  ${mo(run.url)}`);

if (KHONG_CHO) {
  console.log(`\n${xanh('✓')} Đã bắn. Bản cài sẽ xuất hiện ở github.com/${KHO_PHAT_HANH}/releases\n`);
  process.exit(0);
}

// ─── 9. Chờ và KIỂM LẠI ───────────────────────────────────────────
process.stdout.write('  Đang dựng');
let ketQua = null;
for (let i = 0; i < 120; i += 1) {           // 120 × 15s = 30 phút
  await new Promise((r) => setTimeout(r, 15000));
  const t = JSON.parse(thu('gh', ['run', 'view', String(run.databaseId),
    '--json', 'status,conclusion']) || '{}');
  if (t.status === 'completed') { ketQua = t.conclusion; break; }
  process.stdout.write('.');
}
console.log('');
if (ketQua !== 'success') {
  chet(`Lượt dựng kết thúc: ${ketQua ?? 'quá 30 phút chưa xong'}`,
    `Xem log: gh run view ${run.databaseId} --log-failed`);
}
ok('Dựng xong cả ba nền tảng');

/*
 * Dựng xanh KHÔNG nghĩa là phát hành xong. `latest-mac.yml` thiếu, hoặc thiếu
 * một trong hai `.zip` của macOS, thì tự-cập-nhật chết CÂM — app cũ không bao
 * giờ thấy bản mới, mà release nhìn vẫn đầy đủ. Đã từng dính đúng vậy.
 */
const CAN_CO = [
  `CuongThai-${phienBanMoi}-arm64-mac.zip`,
  `CuongThai-${phienBanMoi}-mac.zip`,
  `CuongThai-${phienBanMoi}-arm64.dmg`,
  `CuongThai-Setup-${phienBanMoi}.exe`,
  `CuongThai-${phienBanMoi}.AppImage`,
  `CuongThai-${phienBanMoi}.deb`,
  'latest.yml', 'latest-mac.yml', 'latest-linux.yml',
];
const dsFile = JSON.parse(thu('gh', ['release', 'view', `v${phienBanMoi}`, '--repo', KHO_PHAT_HANH,
  '--json', 'assets', '--jq', '[.assets[].name]']) || '[]');
const thieu = CAN_CO.filter((f) => !dsFile.includes(f));
if (thieu.length > 0) {
  chet(`Release v${phienBanMoi} THIẾU ${thieu.length} file — tự cập nhật sẽ hỏng câm:`,
    ...thieu.map((f) => mo(`    ${f}`)));
}
ok(`Đủ ${CAN_CO.length} file bắt buộc`);

console.log(`\n${xanh('✓')} XONG — app desktop ${xanh(`v${phienBanMoi}`)} đã phát hành`);
console.log(`  ${mo(`https://github.com/${KHO_PHAT_HANH}/releases/tag/v${phienBanMoi}`)}\n`);
