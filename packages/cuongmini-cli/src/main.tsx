/**
 * CuongMini CLI — trợ lý lập trình trong terminal, chạy LÕI AI Code của
 * CuongThai (cùng vòng lặp, tool, skill, MCP, quyền với app desktop và
 * extension VS Code). Điểm vào: đọc cờ ⇒ lệnh phụ / chế độ in / màn tương tác.
 */
import { spawnSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';
import { render } from 'ink';
import { chayCheDoIn } from './cheDoIn';
import { PHIEN_BAN, chuTroGiup, phanTichCo } from './coDong';
import { CLI_BASE, kiemCapNhat, lenhCaiChoMay } from './capNhat';
import { docCaiDat } from './caiDat';
import { kiemMay } from './doctor';
import { canAscii, datAscii, doiKyTu } from './kyTu';
import { chuyenNhatKy } from './khoiDong';
import { THUONG_HIEU, chuyenSac, datTheme, doTheme, mau, mo } from './mau';
import { docPhien, tenHienThi, xoaPhien } from './phien';
import { UngDung } from './ui/UngDung';

const viet = (s: string) => process.stdout.write(`${doiKyTu(s)}\n`);

/**
 * `cuongmini update`: chạy lại TRÌNH CÀI (cùng lệnh một dòng) — nó tải bản mới,
 * kiểm SHA-256 rồi tráo thư mục. Không tự tráo file từ trong chính tiến trình
 * đang chạy: trình cài đã lo đúng mọi thứ (Node riêng, PATH, lệnh tắt).
 */
async function chayTrinhCai(): Promise<number> {
  const moi = await kiemCapNhat(PHIEN_BAN, true).catch(() => null);
  viet(`${chuyenSac('✻ CuongMini')} ${PHIEN_BAN}${moi ? mau('#fbbf24')(` ⇒ ${moi}`) : mo(' (kiểm bản mới…)')}`);
  const base = CLI_BASE();
  const [file, args] = process.platform === 'win32'
    ? ['powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', `irm '${base}/install.ps1' | iex`]] as const
    : ['/bin/sh', ['-c', `if command -v curl >/dev/null 2>&1; then curl -fsSL '${base}/install.sh'; else wget -qO- '${base}/install.sh'; fi | bash`]] as const;
  const r = spawnSync(file, [...args], { stdio: 'inherit', env: process.env });
  if (r.error || r.status !== 0) {
    vietLoi(`${mau('#f87171')('✗')} Trình cài không chạy xong${r.error ? ` (${r.error.message})` : ''}. Chạy tay:\n  ${lenhCaiChoMay()}`);
    return 1;
  }
  return 0;
}
const vietLoi = (s: string) => process.stderr.write(`${s}\n`);

async function main(): Promise<number> {
  // Cài đặt giao diện áp TRƯỚC mọi dòng in ra (kể cả --help, doctor).
  const cd = docCaiDat();
  datTheme(cd.theme === 'tuDong' ? doTheme(process.env) : cd.theme);
  datAscii(cd.ascii === 'bat' ? true : cd.ascii === 'tat' ? false : canAscii(process.env));
  const co = phanTichCo(process.argv.slice(2));
  if (co.loi) { vietLoi(`${mau('#f87171')('✗')} ${co.loi}`); return 2; }

  switch (co.lenh) {
    case 'version': viet(PHIEN_BAN); return 0;
    case 'help': viet(chuTroGiup()); return 0;
    case 'logout': {
      const n = docPhien();
      viet(xoaPhien() ? `${mau('#4ade80')('✓')} Đã đăng xuất${n ? ` (${tenHienThi(n)})` : ''} — đã xoá phiên trên máy này.` : 'Chưa đăng nhập.');
      return 0;
    }
    case 'capNhat': return chayTrinhCai();
    case 'doctor': {
      viet(`${chuyenSac('✻ CuongMini doctor')} ${mo(PHIEN_BAN)}\n`);
      const ds = await kiemMay(PHIEN_BAN);
      const mauDau = { ok: '#4ade80', canh: '#fbbf24', loi: '#f87171' } as const;
      const be = Math.max(...ds.map((m) => m.ten.length));
      for (const m of ds) viet(doiKyTu(`${mau(mauDau[m.muc])({ ok: '✓', canh: '⚠', loi: '✗' }[m.muc])} ${m.ten.padEnd(be)}  ${mo(m.chiTiet)}`));
      const loi = ds.filter((m) => m.muc === 'loi').length;
      viet(`\n${loi ? mau('#f87171')(`${loi} lỗi cần sửa.`) : mau('#4ade80')('Máy sẵn sàng.')}`);
      return loi ? 1 : 0;
    }
    default:
  }

  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) { vietLoi(`CuongMini cần Node 20 trở lên (đang là ${process.versions.node}). Chạy lại lệnh cài để tự tải Node: ${lenhCaiChoMay()}`); return 1; }

  const thuMuc = path.resolve(co.thuMuc ?? process.cwd());
  try {
    if (!statSync(thuMuc).isDirectory()) throw new Error();
  } catch {
    vietLoi(`${mau('#f87171')('✗')} Không mở được thư mục: ${thuMuc}`);
    return 2;
  }

  chuyenNhatKy();
  if (co.cheDoIn) return chayCheDoIn(co, thuMuc);

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    vietLoi('Phiên tương tác cần một terminal. Chạy không tương tác thì dùng: cuongmini -p "câu hỏi"');
    return 2;
  }

  let loiNhan: string | undefined;
  let daThoat = false;
  const banMoi = kiemCapNhat(PHIEN_BAN).catch(() => null);
  const ink = render(
    <UngDung
      co={co}
      thuMuc={thuMuc}
      phienBan={PHIEN_BAN}
      chiDangNhap={co.lenh === 'login'}
      banMoi={banMoi}
      onThoat={(m) => { daThoat = true; loiNhan = m; }}
    />,
    { exitOnCtrlC: false, maxFps: 30 },
  );
  try {
    await ink.waitUntilExit();
  } catch {
    return 1;
  }
  if (loiNhan) viet(loiNhan);
  else if (daThoat && co.lenh !== 'login') viet(mo(`Tạm biệt! Việc đã được lưu — mở lại: ${mau(THUONG_HIEU.timNhat)('cuongmini -c')}`));
  return 0;
}

main().then(
  (ma) => process.exit(ma),
  (e: Error) => { vietLoi(`${mau('#f87171')('✗')} ${e?.message ?? e}`); process.exit(1); },
);
