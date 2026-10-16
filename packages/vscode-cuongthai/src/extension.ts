/**
 * CuongThai AI Code cho VS Code.
 *
 * Extension là KHUNG CHAT; bộ máy là AI Code trong app desktop CuongThai (nói
 * chuyện qua cầu nối 127.0.0.1 — xem `cauNoi.ts`). Nhờ vậy chất lượng, skill,
 * MCP, bộ nhớ, chế độ quyền, cổng model… giống hệt trong app.
 *
 * Phần riêng của VS Code: thư mục đang mở = dự án của AI; file đang mở + đoạn
 * đang chọn đi kèm làm ngữ cảnh; "Nhờ AI sửa lỗi này" trên dấu lỗi; bấm vào
 * file AI vừa sửa là mở ngay trong editor.
 */
import path from 'node:path';
import * as vscode from 'vscode';
import { CauNoi, docKhamPha, fileKhamPha } from './cauNoi';

const KHOA_CUOC = 'cuongthai.cuocId';

class KhungChat implements vscode.WebviewViewProvider {
  private view: vscode.WebviewView | undefined;
  private cau: CauNoi | null = null;
  private cuocId: string | null = null;
  private huyNghe: (() => void) | null = null;
  private dangNoi = false;
  private hangCho: unknown[] = [];

  constructor(private ctx: vscode.ExtensionContext) {
    this.cuocId = ctx.workspaceState.get<string>(KHOA_CUOC) ?? null;
    // App mở (hoặc mở lại) ⇒ file khám phá đổi ⇒ tự nối lại.
    const w = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(path.dirname(fileKhamPha())), 'vscode-bridge.json'));
    w.onDidCreate(() => void this.noi());
    w.onDidChange(() => void this.noi());
    ctx.subscriptions.push(w);
    // Lưới đỡ khi bộ theo dõi file không bắn (thư mục chưa tồn tại lúc mở VS Code…).
    const h = setInterval(() => { if (!this.cau && this.view?.visible) void this.noi(); }, 5000);
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

  private gui(m: unknown): void {
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
      const tt = docKhamPha();
      if (!tt) { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'chuaMoApp' }); return; }
      const cau = new CauNoi(tt);
      let tt2: { mucNoLuc?: string } = {};
      try { tt2 = await cau.trangThai(); } catch { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'chuaMoApp' }); return; }
      this.cau = cau;
      this.huyNghe = cau.nghe((kenh, d) => {
        if (kenh !== 'agent:event') return;
        const e = d as { cuocId?: string };
        if (e.cuocId && e.cuocId === this.cuocId) this.gui({ loai: 'suKien', e: d });
      }, () => { this.cau = null; this.gui({ loai: 'ketNoi', ok: false, lyDo: 'matKetNoi' }); setTimeout(() => void this.noi(), 3000); });

      // Cuộc cũ còn sống trong app không? Không thì tạo mới.
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
      this.gui({ loai: 'ketNoi', ok: true, phienBan: tt.phienBan, mucNoLuc: tt2.mucNoLuc, ws, info, bangGhi });
      this.guiNguCanh();
    } finally {
      this.dangNoi = false;
    }
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
      }
      if (!this.cau || !this.cuocId) { this.gui({ loai: 'ketNoi', ok: false, lyDo: 'chuaMoApp' }); return; }
      const cau = this.cau;
      const cuocId = this.cuocId;
      switch (m.loai) {
        case 'gui': {
          let anh = Array.isArray(m.anh) ? (m.anh as string[]) : [];
          anh = await Promise.all(anh.map(async (a) => (/^data:image\/(png|jpeg|webp|gif);/.test(a) && a.length < 3_500_000 ? a : cau.chuanHoaAnh(a))));
          const text = this.ghepNguCanh(String(m.text ?? ''), m.kem !== false).slice(0, 8000);
          await cau.goi('agent:send', { cuocId, text, ...(anh.length ? { anh: anh.slice(0, 8) } : {}) });
          return;
        }
        case 'traLoi': await cau.goi('agent:traLoiXinPhep', { cuocId, id: m.id, quyetDinh: m.quyetDinh }); return;
        case 'dung': await cau.goi('agent:cancel', { cuocId }); return;
        case 'lamTiep': await cau.goi('agent:lamTiep', { cuocId }); return;
        case 'viecMoi': await cau.goi('agent:reset', { cuocId }); this.gui({ loai: 'daXoa' }); return;
        case 'hoanTac': this.gui({ loai: 'thongBao', chu: String(await cau.goi('agent:hoanTac', { cuocId }) ?? 'Đã hoàn tác.') }); return;
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
    const a = new vscode.CodeAction('✨ Nhờ CuongThai AI sửa lỗi này', vscode.CodeActionKind.QuickFix);
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
    vscode.commands.registerCommand('cuongthai.hoiDoanChon', () => khung.dienCauHoi('Giải thích đoạn code này và chỉ ra chỗ có thể sai: ')),
    vscode.commands.registerCommand('cuongthai.themFile', (uri?: vscode.Uri) => {
      const u = uri ?? vscode.window.activeTextEditor?.document.uri;
      if (u) khung.dienCauHoi(`Đọc file ${vscode.workspace.asRelativePath(u, false)} và `);
    }),
    vscode.commands.registerCommand('cuongthai.suaLoi', (cauHoi: string) => khung.dienCauHoi(cauHoi, true)),
    vscode.languages.registerCodeActionsProvider({ scheme: 'file' }, new SuaLoiBangAI(), { providedCodeActionKinds: SuaLoiBangAI.kieu }),
  );
}

export function deactivate(): void { /* cầu nối tự đóng theo tiến trình */ }
