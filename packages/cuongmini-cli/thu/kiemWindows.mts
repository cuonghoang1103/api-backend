/**
 * KIỂM THẬT TRÊN WINDOWS (đợt 8C) — chạy trên máy Windows hoặc runner `windows-latest`:
 *   npx tsx thu/kiemWindows.mts
 * Không cần đăng nhập, không gọi mạng. Đặt clipboard bằng .NET (STA) rồi gọi ĐÚNG hàm đọc clipboard
 * của CLI qua Windows PowerShell 5.1 và pwsh 7; kéo-thả đường dẫn; toast (chữ UTF-8 + logo).
 * Thoát mã 1 nếu có mục ĐỎ. `thu/anhDanCu.ts` (nếu có) = bản cũ, chạy để đối chiếu nguyên nhân.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tam = path.join(os.tmpdir(), 'cm thử 8c', 'Nguyễn Văn A');
rmSync(path.join(os.tmpdir(), 'cm thử 8c'), { recursive: true, force: true });
mkdirSync(tam, { recursive: true });
process.env.CUONGMINI_HOME = path.join(tam, '.cuongmini');
process.env.CUONGMINI_NGON_NGU = 'vi';

const { datNgonNgu } = await import('../src/i18n.ts');
datNgonNgu('vi');
const { cachDocAnh, thuMotCach, danAnhTuClipboard } = await import('../src/anhDan.ts');
const { tachAnh } = await import('../src/anh.ts');
const { lenhThongBao, soanThongBao, thuThongBaoDongBo } = await import('../src/thongBao.ts');
const { duongBieuTuong } = await import('../src/bieuTuong.ts');

let hong = 0;
const ket = (ten: string, ok: boolean, chiTiet = '') => {
  if (!ok) hong += 1;
  console.log(`${ok ? 'XANH' : 'DO  '} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`);
};
const ps = (script: string, them: Record<string, string> = {}, exe = 'powershell.exe') => spawnSync(exe, ['-NoProfile', '-NonInteractive', '-STA', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], { encoding: 'utf8', env: { ...process.env, ...them }, timeout: 60_000 });
const datAnh = (w: number, h: number) => ps(`Add-Type -AssemblyName System.Windows.Forms, System.Drawing
$b = New-Object System.Drawing.Bitmap ${w}, ${h}
$g = [System.Drawing.Graphics]::FromImage($b); $g.Clear([System.Drawing.Color]::Red); $g.FillRectangle([System.Drawing.Brushes]::Blue, 0, 0, ${Math.floor(w / 2)}, ${h}); $g.Dispose()
[System.Windows.Forms.Clipboard]::SetImage($b); 'ok'`);
const datChu = () => ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetText('chỉ có chữ, không ảnh'); 'ok'`);
const datFile = (f: string) => ps(`Add-Type -AssemblyName System.Windows.Forms; $s = New-Object System.Collections.Specialized.StringCollection; $null = $s.Add($env:CM_F); [System.Windows.Forms.Clipboard]::SetFileDropList($s); 'ok'`, { CM_F: f });
const kichThuocPng = (p: string) => { const b = readFileSync(p); return b.readUInt32BE(0) === 0x89504e47 ? `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}` : 'khong-phai-png'; };

console.log(`Node ${process.version} · ${os.release()} · tạm: ${tam}`);
for (const exe of ['powershell.exe', 'pwsh.exe']) {
  const v = spawnSync(exe, ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString() + " " + [Threading.Thread]::CurrentThread.ApartmentState'], { encoding: 'utf8' });
  console.log(`${exe}: ${(v.stdout || v.error?.message || '').trim()}`);
}

// 0) Bản CŨ (HEAD trước 8C) — để thấy nguyên nhân thật.
if (existsSync(path.join(goc, 'thu/anhDanCu.ts'))) {
  const cu = await import('./anhDanCu.ts') as { cachDocAnh: (n: string, d: string) => Array<{ file: string; args: string[] }> };
  datAnh(40, 30);
  for (const c of cu.cachDocAnh('win32', path.join(tam, 'cu.png'))) {
    const dich = path.join(tam, `cu-${c.file}.png`);
    const t0 = Date.now();
    const r = spawnSync(c.file, c.args, { env: { ...process.env, CM_DICH: dich }, encoding: 'utf8', timeout: 30_000 });
    console.log(`BAN CU ${c.file}: ma=${r.status} ${Date.now() - t0}ms file=${existsSync(dich) ? kichThuocPng(dich) : 'KHONG'} stderr=${JSON.stringify((r.stderr || '').trim().slice(0, 300))}`);
  }
}

// 1) Ảnh trong clipboard ⇒ cả PS 5.1 lẫn 7 đọc ra PNG đúng kích thước.
const a = datAnh(40, 30);
ket('đặt ảnh vào clipboard (.NET STA)', a.stdout.includes('ok'), (a.stderr || '').trim().slice(0, 200));
for (const c of cachDocAnh('win32', '')) {
  const dich = path.join(tam, `anh ${c.file}.png`);
  const t0 = Date.now();
  const k = await thuMotCach(c, dich);
  ket(`${c.file} đọc ảnh`, k.loai === 'anh' && kichThuocPng(dich) === '40x30', `${JSON.stringify(k)} · ${Date.now() - t0}ms · ${existsSync(dich) ? kichThuocPng(dich) : 'không file'}`);
}
const d1 = await danAnhTuClipboard('win32');
ket('danAnhTuClipboard (CUONGMINI_HOME có dấu cách + tiếng Việt)', 'duong' in d1 && kichThuocPng(d1.duong) === '40x30', JSON.stringify(d1));

// 2) Ảnh lớn (màn hình 4K) — không quá hạn.
datAnh(3840, 2160);
const t4k = Date.now();
const d4k = await danAnhTuClipboard('win32');
ket('ảnh 3840x2160', 'duong' in d4k && kichThuocPng(d4k.duong) === '3840x2160', `${Date.now() - t4k}ms`);

// 3) Clipboard chỉ có chữ ⇒ báo rõ "không có ảnh" (không phải "không đọc được").
datChu();
for (const c of cachDocAnh('win32', '')) {
  const k = await thuMotCach(c, path.join(tam, 'trong.png'));
  ket(`${c.file} clipboard chỉ có chữ ⇒ trong`, k.loai === 'trong', JSON.stringify(k));
}
const d2 = await danAnhTuClipboard('win32');
ket('báo "Clipboard không có ảnh … alt+v"', 'loi' in d2 && /không có ảnh/.test(d2.loi) && /alt\+v/.test(d2.loi), JSON.stringify(d2));

// 4) File ảnh đã Copy trong Explorer (đường có dấu cách + tiếng Việt + ngoặc).
const fAnh = path.join(tam, 'ảnh chụp (1).png');
copyFileSync(path.join(goc, 'tai-nguyen/cuongmini.png'), fAnh);
datFile(fAnh);
const d3 = await danAnhTuClipboard('win32');
ket('Copy file ảnh trong Explorer ⇒ gửi chính file đó', 'duong' in d3 && d3.duong === fAnh, JSON.stringify(d3));

// 5) Kéo-thả: Windows Terminal/conhost dán đường bọc ngoặc kép khi có dấu cách.
const k1 = tachAnh(`"${fAnh}" xem giúp`, tam);
ket('kéo-thả "C:\\…\\ảnh chụp (1).png"', k1.anh.length === 1 && k1.anh[0] === fAnh && /\[ảnh: ảnh chụp \(1\)\.png\]/.test(k1.text), JSON.stringify(k1.text));
mkdirSync(path.join(os.tmpdir(), 'cm8c_tran'), { recursive: true });
const fTran = path.join(os.tmpdir(), 'cm8c_tran', 'anh_tran.png');
copyFileSync(fAnh, fTran);
const k2 = tachAnh(`${fTran} và '${fAnh}'`, tam);
ket('đường trần + bọc nháy đơn', k2.anh.length === 2, JSON.stringify(k2));
const k3 = tachAnh(`& '${fAnh}'`, tam);
ket('PowerShell kéo-thả kiểu & \'…\'', k3.anh.length === 1, JSON.stringify(k3.text));

// 6) Thông báo: toast WinRT (PS 5.1), chữ Unicode đúng, XML thoát ký tự, logo.
const ico = duongBieuTuong();
ket('ghi logo PNG + ICO', Boolean(ico && existsSync(ico.png) && existsSync(ico.ico)), JSON.stringify(ico));
const iv = ps('Add-Type -AssemblyName System.Drawing; $i = New-Object System.Drawing.Icon($env:CM_ICO, 32, 32); $b = $i.ToBitmap(); "$($b.Width)x$($b.Height) " + $b.GetPixel(16,16).Name', { CM_ICO: ico?.ico ?? '' });
ket('ICO nạp được bằng System.Drawing.Icon', /32x32 ff/.test(iv.stdout.trim()), `${iv.stdout.trim()} ${iv.stderr.trim().slice(0, 200)}`);
const nd = soanThongBao('xong', 'Sửa lỗi "đăng nhập" <b>&amp; \\ C:\\tệp', 134_000);
ket('nội dung "Xong · … · 2 phút 14 giây"', nd.dayDu === 'Xong · Sửa lỗi "đăng nhập" <b>&amp; \\ C:\\tệp · 2 phút 14 giây', nd.dayDu);
const ra = path.join(tam, 'toast.txt');
const l = lenhThongBao('win32', nd, { icon: ico });
ket('lệnh toast = powershell.exe -EncodedCommand', l?.file === 'powershell.exe' && l.args.includes('-EncodedCommand'));
const r = thuThongBaoDongBo(nd, { CM_TB_RA: ra });
const ghi = existsSync(ra) ? readFileSync(ra, 'utf8') : '';
console.log(`toast: ma=${r.ma} ra=${r.ra} loi=${r.loi.trim().slice(0, 300)}\n${ghi}`);
ket('toast chạy không lỗi (TOAST/BT/BALLOON)', r.ma === 0 && /^(TOAST:|BT|BALLOON)/.test(r.ra), r.ra);
ket('XML toast giữ nguyên chữ Unicode + thoát <, &, "', ghi.includes('Xong · 2 phút 14 giây') && ghi.includes('Sửa lỗi &quot;đăng nhập&quot; &lt;b&gt;&amp;amp; \\ C:\\tệp') || ghi.includes('Sửa lỗi "đăng nhập" &lt;b&gt;&amp;amp; \\ C:\\tệp'), ghi.split('\n')[0]?.slice(0, 400));
ket('logo trong toast (appLogoOverride file:///)', /appLogoOverride/.test(ghi) && /file:\/\/\//.test(ghi));
const reg = ps("(Get-ItemProperty -Path 'HKCU:\\Software\\Classes\\AppUserModelId\\CuongMini.CLI').DisplayName");
console.log(`AUMID CuongMini.CLI DisplayName = ${reg.stdout.trim()} ${reg.stderr.trim().slice(0, 200)}`);
const balloon = thuThongBaoDongBo(nd, { CM_TB_RA: ra, CM_TB_KHONG_HIEN: '1' });
ket('chế độ không hiện (CM_TB_KHONG_HIEN) vẫn chạy', balloon.ma === 0, balloon.ra);

console.log(hong ? `\n${hong} mục ĐỎ` : '\nTẤT CẢ XANH');
process.exit(hong ? 1 : 0);
