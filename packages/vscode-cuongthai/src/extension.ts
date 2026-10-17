/**
 * CuongMini Code — AI lập trình của CuongThai cho VS Code.
 *
 * Extension là KHUNG CHAT; bộ máy là AI Code của app desktop CuongThai, chạy
 * theo một trong hai đường (cùng mã, cùng chất lượng, skill, MCP, quyền…):
 *  • có app đang mở ⇒ nói chuyện qua cầu nối 127.0.0.1 (`cauNoi.ts`);
 *  • không có app ⇒ chạy NGAY TRONG extension (`docLap.ts`), đăng nhập bằng
 *    tài khoản cuongthai.com. Người dùng chỉ cần cài extension.
 *
 * Phần riêng của VS Code: thư mục đang mở = dự án của AI; file đang mở + đoạn
 * đang chọn đi kèm làm ngữ cảnh; "Nhờ AI sửa lỗi này" trên dấu lỗi; bấm vào
 * file AI vừa sửa là mở ngay trong editor.
 */
import path from 'node:path';
import * as vscode from 'vscode';
import { CauNoi, docKhamPha, fileKhamPha } from './cauNoi';
import { dangNhapMatKhau, dangNhapTrinhDuyet, huyDangNhapTrinhDuyet } from '../../cuongmini-core/src/dangNhap';
import { LoiDocLap } from './docLap';
import type { KetNoi } from './ketNoi';
import { API_ORIGIN } from '../../cuongmini-core/src/dangNhap';
import { batDauGhiAm, nhanDang, type PhienGhiAm } from '../../cuongmini-core/src/ghiAm';
import { ViecVsc } from './viecVsc';

const KHOA_CUOC = 'cuongthai.cuocId';

type CheDoChon = 'tuDong' | 'app' | 'docLap';
const cheDoChon = (): CheDoChon => vscode.workspace.getConfiguration('cuongthai').get<CheDoChon>('cheDo', 'tuDong');

class KhungChat implements vscode.WebviewViewProvider {
  private view: vscode.WebviewView | undefined;
  private cau: KetNoi | null = null;
  private docLap: LoiDocLap | null = null;
  private cuocId: string | null = null;
  private huyNghe: (() => void) | null = null;
  private dangNoi = false;
  private hangCho: unknown[] = [];

  private viec: ViecVsc;
  private ghi: PhienGhiAm | null = null;

  constructor(private ctx: vscode.ExtensionContext) {
    this.cuocId = ctx.workspaceState.get<string>(KHOA_CUOC) ?? null;
    this.viec = new ViecVsc(ctx, () => ({ cau: this.cau, cuocId: this.cuocId }));
    // App mở (hoặc mở lại) ⇒ file khám phá đổi ⇒ tự nối lại.
    const w = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(path.dirname(fileKhamPha())), 'vscode-bridge.json'));
    // Đang chạy độc lập thì KHÔNG tự đổi sang app giữa chừng (mất việc đang làm).
    w.onDidCreate(() => { if (this.cau?.cheDo !== 'docLap') void this.noi(); });
    w.onDidChange(() => { if (this.cau?.cheDo !== 'docLap') void this.noi(); });
    ctx.subscriptions.push(w);
    // Lưới đỡ khi bộ theo dõi file không bắn (thư mục chưa tồn tại lúc mở VS Code…).
    const h = setInterval(() => { if (!this.cau && this.choApp && this.view?.visible) void this.noi(); }, 5000);
    ctx.subscriptions.push({ dispose: () => clearInterval(h) });
    ctx.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => this.guiNguCanh()));
    ctx.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => this.guiNguCanh()));
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    const media = vscode.Uri.joinPath(this.ctx.extensionUri, 'media');
    const dist = vscode.Uri.joinPath(this.ctx.extensionUri, 'dist');
    view.webview.options = { enableScripts: true, localResourceRoots: [media, dist] };
    view.webview.html = this.html(view.webview);
    view.webview.onDidReceiveMessage((m) => void this.nhan(m));
    view.onDidChangeVisibility(() => { if (view.visible) this.guiNguCanh(); });
  }

  /** Đang chờ app mở (mới cần dò định kỳ); màn đăng nhập thì không dò — vẽ lại sẽ xoá chữ đang gõ. */
  private get choApp(): boolean { return this.lyDoCuoi === 'chuaMoApp' || this.lyDoCuoi === 'matKetNoi'; }
  private lyDoCuoi = '';

  private gui(m: unknown): void {
    const k = m as { loai?: string; ok?: boolean; lyDo?: string };
    if (k.loai === 'ketNoi') this.lyDoCuoi = k.ok ? '' : String(k.lyDo ?? '');
    if (this.view) void this.view.webview.postMessage(m);
    else this.hangCho.push(m);
  }

  private html(w: vscode.Webview): string {
    const js = w.asWebviewUri(vscode.Uri.joinPath(this.ctx.extensionUri, 'dist', 'webview.js'));
    const css = w.asWebviewUri(vscode.Uri.joinPath(this.ctx.extensionUri, 'media', 'webview.css'));
    const logo = w.asWebviewUri(vscode.Uri.joinPath(this.ctx.extensionUri, 'media', 'icon.png'));
    const nonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    return `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${w.cspSource} data: https:; style-src ${w.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${w.cspSource};">
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${css}"></head>
<body data-logo="${logo}"><div id="goc"></div><script nonce="${nonce}" src="${js}"></script></body></html>`;
  }

  /** Thư mục dự án = thư mục đầu tiên của workspace. */
  private thuMuc(): string | null {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
  }

  async noi(): Promise<void> {
    if (this.dangNoi) return;
    this.dangNoi = true;
    try {
      this.huyNghe?.();
      this.huyNghe = null;
      const cau = await this.chonDuong();
      if (!cau) return;
      let tt2: { mucNoLuc?: string } = {};
      try { tt2 = await cau.trangThai(); } catch { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'chuaMoApp' }); return; }
      this.cau = cau;
      this.huyNghe = cau.nghe((kenh, d) => {
        if (kenh !== 'agent:event') return;
        const e = d as { cuocId?: string };
        if (e.cuocId && e.cuocId === this.cuocId) this.gui({ loai: 'suKien', e: d });
      }, () => { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'matKetNoi' }); setTimeout(() => void this.noi(), 3000); });

      // Cuộc cũ còn sống không? Không thì tạo mới.
      let ws: unknown = null;
      if (this.cuocId) { try { ws = await cau.goi('agent:getWorkspace', { cuocId: this.cuocId }); } catch { this.cuocId = null; } }
      if (!this.cuocId) {
        this.cuocId = await cau.goi<string>('agent:taoCuoc');
        await this.ctx.workspaceState.update(KHOA_CUOC, this.cuocId);
      }
      const tm = this.thuMuc();
      if (tm) ws = await cau.datThuMuc(this.cuocId, tm);
      else ws = await cau.goi('agent:getWorkspace', { cuocId: this.cuocId });
      const info = await cau.goi('agent:getInfo').catch(() => null);
      // Bảng ghi (khi webview mở lại giữa chừng một việc).
      const bangGhi = await cau.goi('agent:bangGhi', { cuocId: this.cuocId }).catch(() => null);
      const nguoi = cau instanceof LoiDocLap ? cau.nguoiDung.fullName || cau.nguoiDung.username : undefined;
      this.gui({ loai: 'ketNoi', ok: true, cheDo: cau.cheDo, nguoi, phienBan: cau.phienBan, mucNoLuc: tt2.mucNoLuc, ws, info, bangGhi });
      this.guiNguCanh();
    } finally {
      this.dangNoi = false;
    }
  }

  /**
   * Chọn đường chạy. Tự động: app đang mở ⇒ qua app (giữ chung việc, quyền, vé
   * dự phòng với app); không có app ⇒ độc lập. Trả null = đã báo màn phù hợp.
   */
  private async chonDuong(): Promise<KetNoi | null> {
    const chon = cheDoChon();
    if (chon !== 'docLap') {
      const tt = docKhamPha();
      if (tt) {
        const cau = new CauNoi(tt);
        try { await cau.trangThai(); this.docLap?.dong(); this.docLap = null; return cau; } catch { /* app tắt mà file còn */ }
      }
      if (chon === 'app') { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'chuaMoApp' }); return null; }
    }
    if (this.docLap) return this.docLap;
    try {
      this.docLap = await LoiDocLap.moLai(this.ctx);
    } catch (e) {
      this.cau = null;
      this.gui({ loai: 'ketNoi', ok: false, lyDo: 'loiKhoiDong', chu: (e as Error).message });
      return null;
    }
    if (!this.docLap) { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'chuaDangNhap' }); return null; }
    return this.docLap;
  }

  /** Đăng nhập xong (trình duyệt hoặc mật khẩu) ⇒ khởi động lõi độc lập rồi nối. */
  private async sauDangNhap(laiDangNhap: () => Promise<import('../../cuongmini-core/src/dangNhap').NguoiDung>): Promise<void> {
    try {
      const nguoi = await laiDangNhap();
      this.docLap?.dong();
      this.docLap = await LoiDocLap.tuDangNhap(this.ctx, nguoi);
      this.gui({ loai: 'dangNhapKq', ok: true });
      await this.noi();
    } catch (e) {
      this.gui({ loai: 'dangNhapKq', ok: false, loi: (e as Error).message });
    }
  }

  async dangXuat(): Promise<void> {
    huyDangNhapTrinhDuyet();
    this.docLap?.dong();
    this.docLap = null;
    await LoiDocLap.dangXuat(this.ctx);
    if (this.cau?.cheDo === 'docLap') { this.huyNghe?.(); this.huyNghe = null; this.cau = null; }
    await this.ctx.workspaceState.update(KHOA_CUOC, undefined);
    this.cuocId = null;
    await this.noi();
  }

  private guiNguCanh(): void {
    const ed = vscode.window.activeTextEditor;
    if (!ed || ed.document.uri.scheme !== 'file') { this.gui({ loai: 'nguCanh', file: null }); return; }
    const sel = ed.selection;
    this.gui({
      loai: 'nguCanh',
      file: vscode.workspace.asRelativePath(ed.document.uri, false),
      chon: sel.isEmpty ? null : { tu: sel.start.line + 1, den: sel.end.line + 1 },
      bat: vscode.workspace.getConfiguration('cuongthai').get<boolean>('kemFileDangMo', true),
    });
  }

  /** Ghép ngữ cảnh VS Code vào trước câu hỏi (file đang mở + đoạn đang chọn). */
  private ghepNguCanh(text: string, kem: boolean): string {
    if (!kem) return text;
    const ed = vscode.window.activeTextEditor;
    if (!ed || ed.document.uri.scheme !== 'file') return text;
    const ten = vscode.workspace.asRelativePath(ed.document.uri, false);
    const sel = ed.selection;
    if (sel.isEmpty) return `[Đang mở trong VS Code: ${ten}]\n${text}`;
    const tran = Math.max(500, 7600 - text.length - 200);
    let doan = ed.document.getText(sel);
    if (doan.length > tran) doan = `${doan.slice(0, tran)}\n… (đã cắt bớt)`;
    return `[Đang chọn trong VS Code: ${ten}, dòng ${sel.start.line + 1}–${sel.end.line + 1}]\n\`\`\`${ed.document.languageId}\n${doan}\n\`\`\`\n\n${text}`;
  }

  private async nhan(m: { loai: string; [k: string]: unknown }): Promise<void> {
    try {
      switch (m.loai) {
        case 'sanSang': {
          for (const x of this.hangCho.splice(0)) this.gui(x);
          await this.noi();
          return;
        }
        case 'moApp': { await moApp(); return; }
        case 'thuLai': { await this.noi(); return; }
        case 'moFile': {
          const duong = String(m.duong ?? '');
          const goc = this.thuMuc();
          const uri = /^([a-zA-Z]:)?[\\/]/.test(duong) || !goc ? vscode.Uri.file(duong) : vscode.Uri.joinPath(vscode.Uri.file(goc), duong);
          await vscode.window.showTextDocument(uri, { preview: true, viewColumn: vscode.ViewColumn.One });
          return;
        }
        case 'moLink': { await vscode.env.openExternal(vscode.Uri.parse(String(m.url))); return; }
        case 'rpc': { void this.rpc(m); return; }
        case 'dangXuat': { await this.dangXuat(); return; }
        case 'moCaiDat': { await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:cuongthai.cuongthai-ai-code'); return; }
        case 'dangNhapNha': {
          const nha = String(m.nha);
          if (nha !== 'google' && nha !== 'github' && nha !== 'apple') return;
          await this.sauDangNhap(() => dangNhapTrinhDuyet(nha, async (url) => vscode.env.openExternal(vscode.Uri.parse(url))));
          return;
        }
        case 'dangNhapMatKhau': {
          await this.sauDangNhap(() => dangNhapMatKhau(String(m.ten ?? ''), String(m.matKhau ?? '')));
          return;
        }
        case 'hetPhien': {
          // Máy chủ báo 401 giữa chừng ⇒ thử đổi token; hỏng hẳn thì về màn đăng nhập.
          if (this.docLap && !(await this.docLap.lamMoiPhien())) {
            await LoiDocLap.dangXuat(this.ctx);
            this.docLap.dong();
            this.docLap = null;
            this.cau = null;
            this.gui({ loai: 'ketNoi', ok: false, lyDo: 'hetPhien' });
          }
          return;
        }
      }
      if (!this.cau || !this.cuocId) { await this.noi(); return; }
      const cau = this.cau;
      const cuocId = this.cuocId;
      switch (m.loai) {
        case 'gui': {
          let anh = Array.isArray(m.anh) ? (m.anh as string[]) : [];
          anh = await Promise.all(anh.map(async (a) => (/^data:image\/(png|jpeg|webp|gif);/.test(a) && a.length < 3_500_000 ? a : cau.chuanHoaAnh(a))));
          const text = this.ghepNguCanh(String(m.text ?? ''), m.kem !== false).slice(0, 8000);
          await cau.goi('agent:send', { cuocId, text, ...(anh.length ? { anh: anh.slice(0, 8) } : {}), ...(m.chiDoc === true ? { chiDoc: true } : {}) });
          return;
        }
        case 'traLoi': await cau.goi('agent:traLoiXinPhep', { cuocId, id: m.id, quyetDinh: m.quyetDinh }); return;
        case 'moDuPhong': {
          try {
            const ten = await cau.moDuPhong(String(m.matKhau ?? ''));
            this.gui({ loai: 'duPhongMo', ok: true, ten });
          } catch (e) {
            this.gui({ loai: 'duPhongMo', ok: false, loi: (e as Error).message });
          }
          return;
        }
        case 'moCongAnthropic': {
          try {
            const ten = await cau.moCongAnthropic(String(m.matKhau ?? ''));
            this.gui({ loai: 'congAnthropicMo', ok: true, ten, info: await cau.goi('agent:getInfo').catch(() => null) });
          } catch (e) {
            this.gui({ loai: 'congAnthropicMo', ok: false, loi: (e as Error).message });
          }
          return;
        }
        case 'dung': await cau.goi('agent:cancel', { cuocId }); return;
        case 'lamTiep': await cau.goi('agent:lamTiep', { cuocId }); return;
        case 'viecMoi': await cau.goi('agent:reset', { cuocId }); this.gui({ loai: 'daXoa' }); return;
        case 'hoanTac': {
          const r = await cau.goi<{ soFile: number }>('agent:hoanTac', { cuocId });
          this.gui({ loai: 'thongBao', chu: `Đã hoàn tác ${r?.soFile ?? 0} file.` });
          return;
        }
        case 'datCheDo': {
          const ws = await cau.goi('agent:datCheDoQuyen', { cuocId, cheDo: m.cheDo });
          this.gui({ loai: 'ws', ws });
          return;
        }
        case 'datModel': await cau.goi('agent:datModel', { model: m.model }); this.gui({ loai: 'info', info: await cau.goi('agent:getInfo') }); return;
        case 'datMuc': await cau.goi('agent:datMucNoLuc', { muc: m.muc }); return;
        case 'datTrinhDuyet': this.gui({ loai: 'ws', ws: await cau.goi('agent:datCheDoTrinhDuyet', { cuocId, bat: m.bat === true }) }); return;
      }
    } catch (e) {
      this.gui({ loai: 'loiCuc', chu: (e as Error).message });
    }
  }

  /**
   * Khung chat hỏi và CHỜ trả lời: `agent:*` ⇒ AI Code (qua app hoặc lõi độc
   * lập, luôn kèm cuộc của khung này); `vsc:*` ⇒ việc riêng của VS Code.
   */
  private async rpc(m: { [k: string]: unknown }): Promise<void> {
    const id = m.id;
    const kenh = String(m.kenh ?? '');
    const d = (m.duLieu && typeof m.duLieu === 'object' ? m.duLieu : {}) as Record<string, unknown>;
    try {
      let kq: unknown;
      if (kenh.startsWith('agent:')) {
        if (!this.cau || !this.cuocId) throw new Error('Chưa kết nối — đợi một chút rồi thử lại.');
        try {
          kq = await this.cau.goi(kenh, { cuocId: this.cuocId, ...d });
        } catch (e) {
          // App bản cũ chưa mở kênh này cho VS Code ⇒ nói cách làm, đừng đưa nguyên lỗi HTTP.
          if (/không mở cho VS Code/.test((e as Error).message)) {
            throw new Error('Tính năng này cần app CuongThai bản mới hơn — cập nhật app, hoặc đặt cài đặt cuongthai.cheDo = "docLap" để chạy ngay trong VS Code.');
          }
          throw e;
        }
      } else if (kenh === 'vsc:usage') {
        kq = await this.hanMuc();
      } else if (kenh === 'vsc:ghiAm') {
        kq = await this.ghiAm(d.bat === true);
      } else {
        kq = await this.viec.xuLy(kenh, d);
      }
      this.gui({ loai: 'rpcKq', id, ok: true, kq: kq ?? null });
    } catch (e) {
      this.gui({ loai: 'rpcKq', id, ok: false, loi: (e as Error).message });
    }
  }

  /** `/usage`: hỏi máy chủ bằng phiên của chính extension (chế độ độc lập). */
  private async hanMuc(): Promise<unknown> {
    if (!(this.cau instanceof LoiDocLap)) throw new Error('Đang chạy qua app — xem hạn mức trong app CuongThai (gõ /usage ở đó).');
    const r = await fetch(`${API_ORIGIN}/api/v1/agent/usage`, {
      headers: { authorization: `Bearer ${this.cau.nguoiDung.token}` },
      signal: AbortSignal.timeout(15_000),
    });
    const j = await r.json().catch(() => ({})) as { data?: unknown; message?: string };
    if (!r.ok) throw new Error(j.message ?? `Máy chủ trả HTTP ${r.status}.`);
    return j.data ?? j;
  }

  /** Mic: VS Code không cho webview dùng micro ⇒ extension ghi âm bằng công cụ của hệ điều hành rồi nhờ máy chủ nghe. */
  private async ghiAm(bat: boolean): Promise<string | boolean> {
    if (bat) {
      this.ghi?.huy();
      this.ghi = await batDauGhiAm({ tranGiay: 120 });
      return true;
    }
    const g = this.ghi;
    this.ghi = null;
    if (!g) return '';
    const file = await g.dung();
    const token = this.cau instanceof LoiDocLap ? this.cau.nguoiDung.token : null;
    return nhanDang(file, { apiOrigin: API_ORIGIN, token, ngonNgu: 'vi' });
  }

  /** Chèn `@đường` vào ô chat (chuột phải › Thêm vào CuongMini Code). */
  async themVaoChat(uris: vscode.Uri[]): Promise<void> {
    await vscode.commands.executeCommand('cuongthai.chat.focus');
    try {
      const kq = await this.viec.xuLy('vsc:thaUri', { uris: uris.map((u) => u.toString()) }) as { chen: string[]; anh: string[] };
      if (kq.chen.length) this.gui({ loai: 'chenNhac', chen: kq.chen.join(' ') });
      if (kq.anh.length) this.gui({ loai: 'thongBao', chu: 'Ảnh: dán (Cmd/Ctrl+V) hoặc kéo thẳng vào ô chat để gửi kèm.' });
    } catch (e) {
      void vscode.window.showWarningMessage((e as Error).message);
    }
  }

  moLichSu(): void {
    void vscode.commands.executeCommand('cuongthai.chat.focus');
    this.gui({ loai: 'lichSu' });
  }

  /** Đưa một câu hỏi soạn sẵn vào ô nhập (từ lệnh chuột phải / sửa lỗi). */
  dienCauHoi(text: string, guiLuon = false): void {
    void vscode.commands.executeCommand('cuongthai.chat.focus');
    this.gui({ loai: 'dien', text, guiLuon });
  }

  viecMoi(): void { void this.nhan({ loai: 'viecMoi' }); }
}

async function moApp(): Promise<void> {
  // Scheme deep-link của app (`cuongthai://`) — cài app là hệ điều hành biết mở nó.
  const ok = await vscode.env.openExternal(vscode.Uri.parse('cuongthai://ai-code'));
  if (!ok) void vscode.window.showWarningMessage('Chưa mở được app CuongThai. Tải app ở cuongthai.com/download rồi mở lên nhé.');
}

/** "Nhờ AI sửa lỗi này" ngay trên dấu lỗi (bóng đèn vàng). */
class SuaLoiBangAI implements vscode.CodeActionProvider {
  static readonly kieu = [vscode.CodeActionKind.QuickFix];
  provideCodeActions(doc: vscode.TextDocument, _r: vscode.Range, ctx: vscode.CodeActionContext): vscode.CodeAction[] {
    const loi = ctx.diagnostics.filter((d) => d.severity <= vscode.DiagnosticSeverity.Warning).slice(0, 3);
    if (!loi.length) return [];
    const a = new vscode.CodeAction('✨ Nhờ CuongMini sửa lỗi này', vscode.CodeActionKind.QuickFix);
    const ten = vscode.workspace.asRelativePath(doc.uri, false);
    const moTa = loi.map((d) => `- dòng ${d.range.start.line + 1}: ${d.message}${d.source ? ` (${d.source})` : ''}`).join('\n');
    a.command = { command: 'cuongthai.suaLoi', title: 'Nhờ AI sửa', arguments: [`Sửa lỗi trong ${ten}:\n${moTa}\nĐọc file, tìm nguyên nhân gốc rồi sửa.`] };
    return [a];
  }
}

export function activate(ctx: vscode.ExtensionContext): void {
  const khung = new KhungChat(ctx);
  ctx.subscriptions.push(
    vscode.window.registerWebviewViewProvider('cuongthai.chat', khung, { webviewOptions: { retainContextWhenHidden: true } }),
    vscode.commands.registerCommand('cuongthai.moChat', () => vscode.commands.executeCommand('cuongthai.chat.focus')),
    vscode.commands.registerCommand('cuongthai.viecMoi', () => khung.viecMoi()),
    vscode.commands.registerCommand('cuongthai.moApp', () => moApp()),
    vscode.commands.registerCommand('cuongthai.dangXuat', () => khung.dangXuat()),
    vscode.workspace.onDidChangeConfiguration((e) => { if (e.affectsConfiguration('cuongthai.cheDo')) void khung.noi(); }),
    vscode.commands.registerCommand('cuongthai.hoiDoanChon', () => khung.dienCauHoi('Giải thích đoạn code này và chỉ ra chỗ có thể sai: ')),
    vscode.commands.registerCommand('cuongthai.themFile', (uri?: vscode.Uri, ds?: vscode.Uri[]) => {
      const tat = ds?.length ? ds : [uri ?? vscode.window.activeTextEditor?.document.uri].filter((x): x is vscode.Uri => Boolean(x));
      if (tat.length) void khung.themVaoChat(tat);
    }),
    vscode.commands.registerCommand('cuongthai.lichSu', () => khung.moLichSu()),
    vscode.commands.registerCommand('cuongthai.suaLoi', (cauHoi: string) => khung.dienCauHoi(cauHoi, true)),
    vscode.languages.registerCodeActionsProvider({ scheme: 'file' }, new SuaLoiBangAI(), { providedCodeActionKinds: SuaLoiBangAI.kieu }),
  );
}

export async function deactivate(): Promise<void> {
  huyDangNhapTrinhDuyet();
  await LoiDocLap.dongTrinhDuyet();
}
