/**
 * Việc RIÊNG của VS Code mà khung chat nhờ (kênh `vsc:*`): tìm file/thư mục/hàm
 * cho `@`, kéo thả từ Explorer, đính kèm, xuất Markdown, chèn code vào editor.
 *
 * Đường dẫn trong dự án ⇒ chèn `@đường/tương/đối` (agent tự đọc bằng
 * read_file); ngoài dự án ⇒ nhờ AI Code chép/cấp quyền đọc (`agent:themDuong`,
 * như kéo thả trong app) rồi chèn đường nó trả về.
 */
import os from 'node:os';
import path from 'node:path';
import * as vscode from 'vscode';
import type { KetNoi } from './ketNoi';

const LOAI_ANH = /\.(png|jpe?g|gif|webp|heic|heif|avif|bmp|tiff?)$/i;
const BO_QUA = '**/{node_modules,.git,dist,build,out,.next,.turbo,.venv,venv,__pycache__,target,coverage,.gradle,.idea}/**';

export interface MucNhac { loai: 'dangMo' | 'chon' | 'file' | 'thuMuc' | 'kyHieu'; nhan: string; chen: string; mo?: string }

/** Danh sách file của workspace — nạp một lần, làm mới khi có file tạo/xoá. */
class ChiMucFile {
  private ds: string[] | null = null;
  private dangNap: Promise<string[]> | null = null;

  constructor(ctx: vscode.ExtensionContext) {
    const w = vscode.workspace.createFileSystemWatcher('**/*', false, true, false);
    w.onDidCreate(() => { this.ds = null; });
    w.onDidDelete(() => { this.ds = null; });
    ctx.subscriptions.push(w, vscode.workspace.onDidChangeWorkspaceFolders(() => { this.ds = null; }));
  }

  async lay(): Promise<string[]> {
    if (this.ds) return this.ds;
    this.dangNap ??= (async () => {
      const uris = await vscode.workspace.findFiles('**/*', BO_QUA, 30_000);
      const ds = uris.map((u) => vscode.workspace.asRelativePath(u, false).replace(/\\/g, '/')).sort();
      this.ds = ds;
      this.dangNap = null;
      return ds;
    })();
    return this.dangNap;
  }
}

/** Điểm khớp mờ: chứa nguyên chuỗi > khớp tên file > khớp theo thứ tự ký tự. Thấp = tốt. */
function diem(duong: string, q: string): number {
  if (!q) return duong.split('/').length * 10 + duong.length / 100;
  const d = duong.toLowerCase();
  const ten = d.slice(d.lastIndexOf('/') + 1);
  if (ten === q) return 0;
  if (ten.startsWith(q)) return 1 + ten.length / 100;
  if (ten.includes(q)) return 2 + ten.length / 100;
  if (d.includes(q)) return 3 + d.length / 200;
  let i = 0;
  for (const c of d) if (c === q[i]) i += 1;
  return i === q.length ? 5 + d.length / 100 : Infinity;
}

export class ViecVsc {
  private chiMuc: ChiMucFile;

  constructor(ctx: vscode.ExtensionContext, private lay: () => { cau: KetNoi | null; cuocId: string | null }) {
    this.chiMuc = new ChiMucFile(ctx);
  }

  private goc(): string | null {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
  }

  /** Đường tuyệt đối ⇒ thứ chèn vào câu hỏi. */
  private async chenCho(fsPath: string): Promise<string> {
    const goc = this.goc();
    if (goc) {
      const rel = path.relative(goc, fsPath);
      if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) return `@${rel.split(path.sep).join('/')}`;
      if (!rel) return '@.';
    }
    const { cau, cuocId } = this.lay();
    if (!cau || !cuocId) return `@${fsPath}`;
    const r = await cau.goi<{ ok: boolean; tuongDoi?: string; loi?: string }>('agent:themDuong', { cuocId, duong: fsPath });
    if (!r.ok) throw new Error(r.loi ?? 'Không thêm được đường dẫn này.');
    return `@${r.tuongDoi}`;
  }

  private async anhTuFile(fsPath: string): Promise<string> {
    const b = Buffer.from(await vscode.workspace.fs.readFile(vscode.Uri.file(fsPath)));
    const ext = path.extname(fsPath).slice(1).toLowerCase();
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    const du = `data:image/${mime};base64,${b.toString('base64')}`;
    const { cau } = this.lay();
    // HEIC/AVIF/TIFF/ảnh to ⇒ chuẩn hoá như app (đổi JPEG, xoay theo EXIF, thu nhỏ).
    return /^(png|jpeg|webp|gif)$/.test(mime) && b.length < 2_500_000 ? du : (cau ? cau.chuanHoaAnh(du) : du);
  }

  private async tuDuong(dsPath: string[]): Promise<{ chen: string[]; anh: string[] }> {
    const chen: string[] = [];
    const anh: string[] = [];
    for (const p of dsPath.slice(0, 20)) {
      let laThuMuc = false;
      try { laThuMuc = ((await vscode.workspace.fs.stat(vscode.Uri.file(p))).type & vscode.FileType.Directory) !== 0; } catch { /* để themDuong báo lỗi */ }
      if (!laThuMuc && LOAI_ANH.test(p) && anh.length < 8) { anh.push(await this.anhTuFile(p)); continue; }
      chen.push(await this.chenCho(p));
    }
    return { chen, anh };
  }

  /**
   * 28/10/2026 — THƯ MỤC kéo từ Finder/Explorer của hệ điều hành. Webview của VS Code chỉ thấy một `File` 0 byte mang
   * TÊN thư mục (Chromium không lộ đường dẫn thật cho trang web) ⇒ trước đây "đính kèm" nó và hỏng. Nay: dò thư mục cùng
   * tên ở các chỗ hay để (thư mục cha của workspace, Documents, Desktop, Downloads, nhà — sâu 2 tầng); thấy ĐÚNG MỘT thì
   * hỏi xác nhận, không thì mở hộp chọn thư mục. Cấp qua `agent:themDuong` — đúng đường kéo-thả / `/add-dir` /
   * `xin_quyen_thu_muc`: CHỈ ĐỌC, chặn .env/khoá/.ssh, không cấp thư mục nhà/ổ đĩa, chỉ trong phiên.
   */
  private async timThuMucTheoTen(ten: string): Promise<string[]> {
    const sach = ten.replace(/[\\/]/g, '').trim();
    if (!sach || sach === '.' || sach === '..') return [];
    const nha = os.homedir();
    const goc = this.goc();
    const re = [goc ? path.dirname(goc) : '', path.join(nha, 'Documents'), path.join(nha, 'Desktop'), path.join(nha, 'Downloads'), nha].filter(Boolean);
    const thay = new Set<string>();
    const laThuMuc = async (p: string) => { try { return ((await vscode.workspace.fs.stat(vscode.Uri.file(p))).type & vscode.FileType.Directory) !== 0; } catch { return false; } };
    for (const r of re) {
      if (await laThuMuc(path.join(r, sach))) thay.add(path.join(r, sach));
      if (r === nha) continue;
      let con: [string, vscode.FileType][] = [];
      try { con = await vscode.workspace.fs.readDirectory(vscode.Uri.file(r)); } catch { /* không đọc được */ }
      for (const [c, loai] of con.slice(0, 200)) {
        if (!(loai & vscode.FileType.Directory) || c.startsWith('.')) continue;
        if (await laThuMuc(path.join(r, c, sach))) thay.add(path.join(r, c, sach));
        if (thay.size > 3) break;
      }
    }
    return [...thay];
  }

  private async capThuMucNgoai(ten: string | null): Promise<{ chen: string[]; anh: string[] }> {
    const rut = (p: string) => (p.startsWith(os.homedir()) ? `~${p.slice(os.homedir().length)}` : p);
    let chon: string | null = null;
    const ung = ten ? await this.timThuMucTheoTen(ten) : [];
    if (ung.length === 1) {
      const c = await vscode.window.showInformationMessage(
        `CuongMini: cho ĐỌC thư mục ${rut(ung[0]!)}?`,
        { modal: true, detail: 'Chỉ đọc (xem, tìm, đọc file) — file bí mật (.env, khoá, .ssh) vẫn bị chặn, quyền chỉ sống trong phiên này. Cần sửa ở đó thì CuongMini sẽ xin thêm.' },
        'Cho phép đọc', 'Chọn thư mục khác…',
      );
      if (c === 'Cho phép đọc') chon = ung[0]!;
      else if (!c) return { chen: [], anh: [] };
    }
    if (!chon) {
      const r = await vscode.window.showOpenDialog({
        canSelectFiles: false, canSelectFolders: true, canSelectMany: false, openLabel: 'Cho phép đọc',
        title: ten ? `Chọn thư mục "${ten}" bạn vừa thả (VS Code không cho biết đường dẫn thật của thư mục kéo từ Finder)` : 'Chọn thư mục ngoài dự án cho CuongMini ĐỌC',
        defaultUri: vscode.Uri.file(ung[0] ? path.dirname(ung[0]) : path.join(os.homedir(), 'Documents')),
      });
      if (!r?.[0]) return { chen: [], anh: [] };
      chon = r[0].fsPath;
    }
    return { chen: [await this.chenCho(chon)], anh: [] };
  }

  async xuLy(kenh: string, d: Record<string, unknown>): Promise<unknown> {
    switch (kenh) {
      case 'vsc:thaThuMuc': return this.capThuMucNgoai(typeof d.ten === 'string' ? d.ten.slice(0, 255) : null);
      case 'vsc:chonThuMucNgoai': return this.capThuMucNgoai(null);
      case 'vsc:timNhac': return this.timNhac(String(d.q ?? ''));
      case 'vsc:thaUri': {
        const ds = (Array.isArray(d.uris) ? d.uris : []).map(String).map((u) => {
          try { return vscode.Uri.parse(u); } catch { return null; }
        }).filter((u): u is vscode.Uri => u !== null && u.scheme === 'file').map((u) => u.fsPath);
        if (!ds.length) throw new Error('Chỉ thả được file/thư mục trên máy.');
        return this.tuDuong(ds);
      }
      case 'vsc:thaFile': {
        const { cau, cuocId } = this.lay();
        if (!cau || !cuocId) throw new Error('Chưa kết nối.');
        const r = await cau.goi<{ ok: boolean; tuongDoi?: string; loi?: string }>('agent:themDinhKem', { cuocId, ten: String(d.ten ?? 'tep'), duLieuBase64: String(d.base64 ?? '') });
        if (!r.ok) throw new Error(r.loi ?? 'Không đính kèm được.');
        return { chen: `@${r.tuongDoi}` };
      }
      case 'vsc:dinhKem': {
        const r = await vscode.window.showOpenDialog({
          canSelectFiles: true, canSelectFolders: true, canSelectMany: true, openLabel: 'Đính kèm',
          defaultUri: this.goc() ? vscode.Uri.file(this.goc()!) : undefined,
        });
        if (!r?.length) return { chen: [], anh: [] };
        return this.tuDuong(r.map((u) => u.fsPath));
      }
      case 'vsc:luuMarkdown': {
        const goc = this.goc();
        const ten = String(d.ten ?? 'cuongmini-code.md');
        const dich = await vscode.window.showSaveDialog({
          defaultUri: vscode.Uri.file(path.join(goc ?? os.homedir(), ten)),
          filters: { Markdown: ['md'] },
        });
        if (!dich) return { ok: false, huy: true };
        await vscode.workspace.fs.writeFile(dich, Buffer.from(String(d.noiDung ?? ''), 'utf8'));
        void vscode.window.showTextDocument(dich, { preview: true });
        return { ok: true, duong: vscode.workspace.asRelativePath(dich, false) };
      }
      case 'vsc:chenCode': {
        const ed = vscode.window.activeTextEditor ?? vscode.window.visibleTextEditors[0];
        if (!ed) throw new Error('Mở một file trong editor rồi đặt con trỏ vào chỗ cần chèn.');
        await ed.edit((e) => e.replace(ed.selection, String(d.code ?? '')));
        await vscode.window.showTextDocument(ed.document, ed.viewColumn);
        return true;
      }
      default:
        throw new Error(`Không có việc ${kenh}.`);
    }
  }

  private async timNhac(qTho: string): Promise<MucNhac[]> {
    const q = qTho.toLowerCase().replace(/\\/g, '/');
    const ra: MucNhac[] = [];
    const ed = vscode.window.activeTextEditor ?? vscode.window.visibleTextEditors[0];
    if (ed && ed.document.uri.scheme === 'file') {
      const rel = vscode.workspace.asRelativePath(ed.document.uri, false).replace(/\\/g, '/');
      if (!q || rel.toLowerCase().includes(q)) {
        ra.push({ loai: 'dangMo', nhan: rel, chen: `@${rel}`, mo: 'file đang mở' });
        if (!ed.selection.isEmpty) {
          const tu = ed.selection.start.line + 1;
          const den = ed.selection.end.line + 1;
          ra.push({ loai: 'chon', nhan: `${rel}:${tu}-${den}`, chen: `@${rel}:${tu}-${den}`, mo: 'đoạn đang chọn' });
        }
      }
    }
    const files = await this.chiMuc.lay();
    const thuMuc = new Set<string>();
    for (const f of files) {
      const parts = f.split('/');
      for (let i = 1; i < parts.length; i += 1) thuMuc.add(`${parts.slice(0, i).join('/')}/`);
    }
    const xepFile = files.map((f) => ({ f, s: diem(f, q) })).filter((x) => x.s < Infinity).sort((a, b) => a.s - b.s).slice(0, 18);
    const xepThuMuc = [...thuMuc].map((f) => ({ f, s: diem(f.replace(/\/$/, ''), q) })).filter((x) => x.s < (q ? 4 : 1e9)).sort((a, b) => a.s - b.s).slice(0, q ? 6 : 4);
    for (const x of xepFile) if (!ra.some((r) => r.nhan === x.f)) ra.push({ loai: 'file', nhan: x.f, chen: `@${x.f}` });
    for (const x of xepThuMuc) ra.push({ loai: 'thuMuc', nhan: x.f, chen: `@${x.f}` });
    // Hàm / lớp / biến — qua bộ ký hiệu của chính VS Code (hiểu mọi ngôn ngữ có extension).
    if (q.length >= 2) {
      const kh = await Promise.race([
        vscode.commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', qTho),
        new Promise<vscode.SymbolInformation[]>((ok) => setTimeout(() => ok([]), 1200)),
      ]).catch(() => [] as vscode.SymbolInformation[]);
      const KIEU: Partial<Record<vscode.SymbolKind, string>> = {
        [vscode.SymbolKind.Function]: 'hàm', [vscode.SymbolKind.Method]: 'phương thức', [vscode.SymbolKind.Class]: 'lớp',
        [vscode.SymbolKind.Interface]: 'interface', [vscode.SymbolKind.Variable]: 'biến', [vscode.SymbolKind.Constant]: 'hằng',
        [vscode.SymbolKind.Enum]: 'enum', [vscode.SymbolKind.Struct]: 'struct', [vscode.SymbolKind.Module]: 'module',
      };
      for (const s of (kh ?? []).filter((x) => x.location.uri.scheme === 'file' && !/node_modules/.test(x.location.uri.fsPath)).slice(0, 10)) {
        const rel = vscode.workspace.asRelativePath(s.location.uri, false).replace(/\\/g, '/');
        const tu = s.location.range.start.line + 1;
        const den = s.location.range.end.line + 1;
        ra.push({ loai: 'kyHieu', nhan: `${s.name}`, chen: `@${rel}:${tu}-${den}`, mo: `${KIEU[s.kind] ?? 'ký hiệu'} · ${rel}:${tu}` });
      }
    }
    return ra.slice(0, 40);
  }
}
