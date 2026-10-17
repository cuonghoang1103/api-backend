// ĐÓNG GÓI CuongMini CLI để cài bằng MỘT lệnh:
//   1. dựng dist/ (build.mjs)
//   2. tạo cuongmini-<ver>.tgz (thư mục `cuongmini/` gồm dist + package.json + README) + bản sao cuongmini-latest.tgz
//   3. ghi latest.json (version, sha256, kích thước, ngày)
//   4. CHÉP cả 3 + cai/install.sh + cai/install.ps1 vào frontend/public/cli/ — web phục vụ ở https://cuongthai.com/cli/…
// KHÔNG deploy: lên production là việc của deploy-nha.sh.
//   node dong-goi.mjs [--khong-build]
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dungLatest, sha256File } from './phatHanh.mjs';

const goc = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(goc, 'package.json'), 'utf8'));
const ver = pkg.version;
const ra = path.join(goc, 'ban-phat-hanh');
const web = path.resolve(goc, '../../frontend/public/cli');

if (!process.argv.includes('--khong-build')) execFileSync(process.execPath, [path.join(goc, 'build.mjs')], { stdio: 'inherit' });
for (const f of ['dist/cuongmini.mjs', 'dist/loi.cjs']) if (!existsSync(path.join(goc, f))) throw new Error(`Thiếu ${f} — build hỏng?`);

// Thư mục tạm: cuongmini/{dist,package.json,README.md}. package.json tối giản — không phụ thuộc gì lúc chạy.
const tam = path.join(tmpdir(), `cuongmini-goi-${process.pid}`);
rmSync(tam, { recursive: true, force: true });
const trong = path.join(tam, 'cuongmini');
mkdirSync(path.join(trong, 'dist'), { recursive: true });
cpSync(path.join(goc, 'dist/cuongmini.mjs'), path.join(trong, 'dist/cuongmini.mjs'));
cpSync(path.join(goc, 'dist/loi.cjs'), path.join(trong, 'dist/loi.cjs'));
copyFileSync(path.join(goc, 'README.md'), path.join(trong, 'README.md'));
writeFileSync(path.join(trong, 'package.json'), `${JSON.stringify({
  name: 'cuongmini', version: ver, private: true, type: 'module', bin: { cuongmini: 'dist/cuongmini.mjs' }, engines: pkg.engines,
}, null, 2)}\n`);

mkdirSync(ra, { recursive: true });
const tgz = path.join(ra, `cuongmini-${ver}.tgz`);
// `tar` có sẵn trên macOS/Linux; COPYFILE_DISABLE để macOS không nhét file `._*` vào gói.
// bsdtar của macOS còn ghi xattr (`com.apple.provenance`…) ⇒ GNU tar trên Linux in cảnh báo mỗi file
// (đo thật trên Fedora). `--no-xattrs --no-mac-metadata` chỉ bsdtar hiểu — GNU tar thì không cần.
const laBsdtar = process.platform === 'darwin' && /bsdtar/.test(execFileSync('tar', ['--version'], { encoding: 'utf8' }));
// Windows: gọi đúng tar.exe của hệ thống — GNU tar của Git Bash hiểu `D:\…` là máy từ xa "D".
const TAR = process.platform === 'win32' ? path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
execFileSync(TAR, [...(laBsdtar ? ['--no-xattrs', '--no-mac-metadata'] : []), '-czf', tgz, '-C', tam, 'cuongmini'], { env: { ...process.env, COPYFILE_DISABLE: '1' } });
rmSync(tam, { recursive: true, force: true });
copyFileSync(tgz, path.join(ra, 'cuongmini-latest.tgz'));

const latest = dungLatest({ phienBan: ver, sha256: sha256File(tgz), kichThuoc: statSync(tgz).size, tenFile: 'cuongmini-latest.tgz' });
writeFileSync(path.join(ra, 'latest.json'), `${JSON.stringify(latest, null, 2)}\n`);

// Chép sang web. Bản .tgz đánh số CŨ bị dọn — mỗi bản ~1MB, để dồn là phình repo.
mkdirSync(web, { recursive: true });
// Chỉ giữ bản "latest" trên web (bản đánh số nằm ở ban-phat-hanh/) — mỗi bản ~1,7MB, để dồn là phình repo.
for (const f of readdirSync(web)) if (/^cuongmini-\d.*\.tgz$/.test(f) || /^install\.(sh|ps1)$/.test(f)) rmSync(path.join(web, f));
for (const f of ['cuongmini-latest.tgz', 'latest.json']) copyFileSync(path.join(ra, f), path.join(web, f));
// Script cài KHÔNG nằm trong public/: Next phục vụ `.ps1` dạng nhị phân, `irm … | iex` của PowerShell 5.1
// cần chữ ⇒ phục vụ qua route `frontend/src/app/cli/install.{sh,ps1}/route.ts` (text/plain), đọc từ đây.
const cai = path.resolve(goc, '../../frontend/cli-cai');
mkdirSync(cai, { recursive: true });
copyFileSync(path.join(goc, 'cai/install.sh'), path.join(cai, 'install.sh'));
copyFileSync(path.join(goc, 'cai/install.ps1'), path.join(cai, 'install.ps1'));

console.log(`\n✓ Đóng gói CuongMini ${ver}: ${(latest.size / 1024).toFixed(0)} KB · sha256 ${latest.sha256.slice(0, 16)}…`);
console.log(`  ${path.relative(process.cwd(), web)}/{latest.json,cuongmini-latest.tgz} + frontend/cli-cai/{install.sh,install.ps1}`);
console.log('  Chưa deploy — lên web bằng deploy-nha.sh như mọi thay đổi frontend.');
