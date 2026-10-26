/**
 * CHẾ ĐỘ IN (`-p`): chạy MỘT lượt, in câu trả lời ra stdout rồi thoát — để
 * dùng trong script/pipe (`cuongmini -p "tóm tắt diff" > tom-tat.md`).
 *
 *  • stdout chỉ có CÂU TRẢ LỜI: terminal ⇒ markdown đã tô màu; pipe/file ⇒
 *    markdown thô. Dòng tool, thông báo, lỗi ⇒ stderr (không bẩn kết quả).
 *  • Không ai bấm được thẻ duyệt ⇒ mọi xin phép bị TỪ CHỐI, kèm gợi ý dùng
 *    `--che-do tu-dong` / `bo-qua-het` nếu thật sự muốn cho sửa/chạy lệnh.
 *    Mặc định vẫn là "Lập kế hoạch" (chỉ đọc) như mọi đường khác.
 *  • Mã thoát: 0 xong · 1 lỗi · 130 bị dừng (ctrl+c).
 */
import { fstatSync, type Stats } from 'node:fs';
import { createInterface } from 'node:readline';
import type { CoDong } from './coDong';
import { PHIEN_BAN } from './coDong';
import { docAnhDataUrl, guiThangDuoc, tachAnh } from './anh';
import { L } from './i18n';
import { khoiDongPhien } from './khoiDong';
import { LOI_THONG_BAO, type MucBang } from './kho';
import { capMau, datCapMau, doCapMau, mau, mo } from './mau';
import { veMarkdown } from './markdown';
import { moLaiPhien } from './phien';
import { phuLucNhac } from './timFile';
import { veTool } from './veBang';

/**
 * stdin có DỮ LIỆU THẬT để đọc không. `echo … | cuongmini -p` / `< file` ⇒ pipe/file ⇒ đọc hết.
 * Chạy qua `ssh host cuongmini -p "…"` (không -t) thì stdin là socket của sshd, KHÔNG bao giờ
 * EOF — đọc là treo vĩnh viễn (đo thật trên Fedora). Có câu hỏi trên dòng lệnh thì bỏ qua loại đó.
 */
export function nenDocStdin(laTTY: boolean, loai: { isFIFO(): boolean; isFile(): boolean } | null, coCauHoi: boolean): boolean {
  if (laTTY) return false;
  if (loai && (loai.isFIFO() || loai.isFile())) return true;
  return !coCauHoi;
}

/**
 * Đọc hết stdin. `choDauTienMs`: đã có câu hỏi trên dòng lệnh ⇒ chỉ đợi mẩu ĐẦU TIÊN
 * ngần ấy ms — stdin là pipe nhưng không ai ghi (ssh không -t, CI) thì bỏ qua thay vì treo.
 */
function docHetStdin(choDauTienMs?: number): Promise<string> {
  return new Promise((xong) => {
    const phan: Buffer[] = [];
    let hen: NodeJS.Timeout | null = null;
    const ket = () => { if (hen) clearTimeout(hen); process.stdin.pause(); xong(Buffer.concat(phan).toString('utf8')); };
    process.stdin.on('data', (c: Buffer) => { if (hen) { clearTimeout(hen); hen = null; } phan.push(c); });
    process.stdin.once('end', ket);
    process.stdin.once('error', ket);
    if (choDauTienMs !== undefined) hen = setTimeout(() => { process.stdin.removeAllListeners('end'); ket(); }, choDauTienMs);
  });
}

/** Hỏi mật khẩu trên TTY, không vang ký tự. */
function hoiAn(cau: string): Promise<string> {
  return new Promise((xong) => {
    const rl = createInterface({ input: process.stdin, output: process.stderr, terminal: true });
    const ghiGoc = (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput;
    process.stderr.write(cau);
    (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s: string) => { if (s.includes('\n')) ghiGoc.call(rl, '\n'); };
    rl.question('', (t) => { rl.close(); xong(t); });
  });
}

export async function chayCheDoIn(co: CoDong, thuMuc: string): Promise<number> {
  const raTTY = Boolean(process.stdout.isTTY);
  const loiTTY = Boolean(process.stderr.isTTY);
  // stdout bị pipe thì không tô màu nó; stderr vẫn có thể tô (người đang nhìn terminal).
  const capLoi = doCapMau(process.env, loiTTY);
  const capRa = doCapMau(process.env, raTTY);
  const viet = (s: string) => { datCapMau(capLoi); process.stderr.write(s); };

  let cauHoi = co.cauHoi;
  let loaiStdin: Stats | null = null;
  try { loaiStdin = fstatSync(0); } catch { /* không có stdin */ }
  if (nenDocStdin(Boolean(process.stdin.isTTY), loaiStdin, Boolean(cauHoi))) {
    const vao = (await docHetStdin(cauHoi ? 800 : undefined)).trim();
    if (vao) cauHoi = cauHoi ? `${cauHoi}\n\n${vao}` : vao;
  }
  if (!cauHoi) { process.stderr.write(L('Thiếu câu hỏi. Ví dụ: cuongmini -p "giải thích dự án này"\n', 'Missing prompt. Example: cuongmini -p "explain this project"\n')); return 2; }

  const mo2 = await moLaiPhien();
  if (!mo2) { process.stderr.write(L('Chưa đăng nhập. Chạy `cuongmini login` trước.\n', 'Not signed in. Run `cuongmini login` first.\n')); return 1; }
  const { kn, kho, canhBao } = await khoiDongPhien(mo2.nguoi, { ...co, cheDo: co.cheDo ?? 'keHoach' }, thuMuc, PHIEN_BAN);
  kho.coGiaoDien = false;
  for (const c of canhBao) viet(`${mau('#fbbf24')('⚠')} ${c}\n`);
  const rong = Math.max(40, (process.stderr.columns || 100) - 1);

  const dinhDang = co.dinhDang ?? 'text';
  const batDauLuc = Date.now();
  // stream-json: mỗi sự kiện của lõi là một dòng JSON trên stdout (cho script/CI đọc dần).
  const dongJson = (o: Record<string, unknown>) => process.stdout.write(`${JSON.stringify(o)}\n`);

  return await new Promise<number>((xong) => {
    let daIn = 0;
    let tienUsd = 0;
    let loiCuoi: { ma: string; thongDiep: string } | null = null;
    const tools: Array<{ ten: string; tomTat: string; duongDan?: string; hong: boolean }> = [];
    let dangDuPhong = false;
    const ketQua: string[] = [];
    const inTool = () => {
      for (const m of kho.S.bang.slice(daIn)) {
        if (m.loai === 'tool') tools.push({ ten: m.ten, tomTat: m.tomTat, ...(m.duongDan ? { duongDan: m.duongDan } : {}), hong: m.hong });
        if (m.loai === 'tool') viet(`${veTool(m as Extract<MucBang, { loai: 'tool' }>, rong).join('\n').replace(L(' (ctrl+o để xem hết)', ' (ctrl+o to expand)'), '')}\n`);
        else if (m.loai === 'may') ketQua.push(m.text);
        else if (m.loai === 'thongBao') viet(`${mo(`ℹ ${m.text}`)}\n`);
        else if (m.loai === 'duyet') viet(`${mo(`  ${m.dongY ? '✓' : '✕'} ${m.tieuDe}`)}\n`);
      }
      daIn = kho.S.bang.length;
    };
    const ketThuc = (ma: number) => {
      inTool();
      const tra = ketQua.join('\n\n').trim();
      if (dinhDang !== 'text') {
        // JSON: một object cuối cùng (json) hoặc dòng "result" khép luồng (stream-json) — cùng hình.
        dongJson({
          type: 'result', thanhCong: ma === 0, maThoat: ma, ketQua: tra, thoiLuongMs: Date.now() - batDauLuc,
          tienUsd, soFileDaSua: Object.keys(kho.S.fileDaSua).length || kho.S.soFileDaSua, tools,
          ...(loiCuoi ? { loi: loiCuoi } : {}), phienBan: PHIEN_BAN,
        });
      } else if (tra) {
        datCapMau(capRa);
        process.stdout.write(`${raTTY && capMau() ? veMarkdown(tra, { rong: Math.max(40, (process.stdout.columns || 100) - 1) }) : tra}\n`);
      }
      // Chờ đóng trình duyệt AI rồi mới trả mã thoát — `process.exit` ngay sau đó sẽ bỏ Chrome mồ côi.
      void kn.dong().then(() => xong(ma));
    };
    kn.nghe((e) => {
      if (dinhDang === 'stream-json') dongJson({ type: 'event', ...e, cuocId: undefined });
      if (e.loai === 'xong') tienUsd = Number(e.tienUsd ?? 0);
      if (e.loai === 'loi' && !LOI_THONG_BAO.has(String(e.ma ?? ''))) loiCuoi = { ma: String(e.ma ?? ''), thongDiep: String(e.thongDiep ?? '') };
      switch (e.loai) {
        case 'xinPhep': case 'xinPhepLenh': case 'xinPhepMcp': case 'xinPhepGit': case 'xinPhepNote':
          {
            const viec = e.loai === 'xinPhepLenh' ? `${L('chạy', 'run')} ${String(e.lenh ?? '')}` : e.loai === 'xinPhep' ? `${L('sửa', 'edit')} ${String(e.duongDan ?? '')}` : e.loai;
            viet(`${mau('#fbbf24')('⚠')} ${L(`Từ chối "${viec}" — chế độ in không hỏi được. Cho phép bằng --che-do tu-sua / tu-dong / bo-qua-het.`, `Denied "${viec}" — print mode can't ask. Allow with --che-do tu-sua / tu-dong / bo-qua-het.`)}\n`);
          }
          void kn.goi('agent:traLoiXinPhep', { id: e.id, quyetDinh: 'tuChoi' });
          return;
        case 'tool': case 'toolBatDau': case 'keHoach':
          setImmediate(inTool);
          return;
        case 'xong': setImmediate(() => ketThuc(0)); return;
        case 'huy': setImmediate(() => ketThuc(130)); return;
        case 'loi': {
          const ma = String(e.ma ?? '');
          // Thông báo (đổi cổng, Free, compact…) — lượt VẪN chạy, không kết thúc chế độ in. Kho (nghe trước) đã ghi
          // dòng thông báo vào bảng ⇒ in từ đó, khỏi in hai lần.
          if (LOI_THONG_BAO.has(ma)) { inTool(); return; }
          viet(`${mau('#f87171')('✗')} ${String(e.thongDiep ?? L('Có lỗi.', 'Something went wrong.'))}\n`);
          if (ma === 'PRO_REQUIRED') viet(L('  CuongMini cần gói Pro — https://cuongthai.com/pro\n', '  CuongMini needs Pro — https://cuongthai.com/pro\n'));
          // Lỗi mở được bằng mật khẩu: bảo trì / hết trần chính hãng ⇒ modelapi; vé chính hãng chết ⇒ hỏi lại cổng chính hãng.
          const laCH = ma === 'CONG_ANTHROPIC_KHOA' && e.daBat !== false;
          const laDp = ma === 'RAMBO_BAO_TRI';
          if (ma === 'CONG_ANTHROPIC_KHOA' && e.daBat === false) viet(L('  Quản trị chưa đặt khoá cho model này — chọn model khác (--model).\n', '  The admin has not set a key for this model — pick another model (--model).\n'));
          if ((laCH || laDp) && process.stdin.isTTY && loiTTY && !dangDuPhong) {
            dangDuPhong = true;
            const cau = laCH
              ? L('Khoá CuongMini (Enter để bỏ qua): ', 'CuongMini key (Enter to skip): ')
              : ma === 'RAMBO_BAO_TRI'
                ? L('Cổng chính đang bảo trì. Mật khẩu cổng dự phòng (Enter để bỏ qua): ', 'Main gateway is under maintenance. Fallback gateway password (Enter to skip): ')
                : L('Dùng modelapi thay thế? Mật khẩu modelapi (Enter để bỏ qua): ', 'Use modelapi instead? modelapi password (Enter to skip): ');
            void hoiAn(cau).then(async (mk) => {
              if (!mk) { ketThuc(1); return; }
              try {
                const ten = laCH ? (await kn.moCongAnthropic(mk)).ten : await kn.moDuPhong(mk);
                viet(`${mau('#4ade80')('✓')} ${L(`Đã mở ${ten} — gửi lại câu hỏi…`, `Unlocked ${ten} — resending…`)}\n`);
                await gui();
              } catch (er) {
                viet(`${mau('#f87171')('✗')} ${(er as Error).message}\n`);
                ketThuc(1);
              }
            });
            return;
          }
          setImmediate(() => ketThuc(1));
          return;
        }
        default:
      }
    });
    process.once('SIGINT', () => { void kn.goi('agent:cancel'); setTimeout(() => ketThuc(130), 1500).unref(); });
    const gui = async () => {
      const { text, anh, daNhac } = tachAnh(cauHoi, thuMuc);
      const dataAnh = await Promise.all(anh.map(async (p) => { const d = docAnhDataUrl(p); return guiThangDuoc(d) ? d : kn.chuanHoaAnh(d); }));
      kho.batDauLuot(cauHoi, anh.length, cauHoi);
      daIn = kho.S.bang.length;
      await kn.goi('agent:send', { text: phuLucNhac(text, daNhac).slice(0, 8000), ...(dataAnh.length ? { anh: dataAnh.slice(0, 8) } : {}) });
    };
    gui().catch((e: Error) => { viet(`${mau('#f87171')('✗')} ${e.message}\n`); ketThuc(1); });
  });
}

export { doCapMau };
