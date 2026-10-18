/**
 * LSP của TRÌNH SOẠN (đợt 4, 18/10/2026) — nguồn cho tool `lsp_hoi` của AI Code
 * khi lõi chạy NGAY TRONG VS Code (chế độ độc lập).
 *
 * Dùng chính API của VS Code: mọi ngôn ngữ người dùng đã cài extension (TS, Python,
 * Go, Rust, Java, C#…) đều có, không phải tự chạy server nào. Lõi trình bày kết
 * quả cho model (`desktop/src/main/agent/lsp.ts`) — file này chỉ đổi kiểu VS Code
 * ⇄ kiểu chung (dòng/cột 1-based).
 *
 * Chế độ chạy QUA APP desktop: tool chạy trong app ⇒ app dùng server stdio của nó
 * (nguồn này không qua được cầu nối HTTP) — ghi trong tài liệu đối chiếu.
 */
import * as vscode from 'vscode';
import type { NguonLspNgoai } from '../../cuongmini-core/src/kieuLoi';

type ChanDoanNgoai = Awaited<ReturnType<NguonLspNgoai['chanDoan']>>[number];

const MUC: Record<number, ChanDoanNgoai['muc']> = {
  [vscode.DiagnosticSeverity.Error]: 'loi',
  [vscode.DiagnosticSeverity.Warning]: 'canhBao',
  [vscode.DiagnosticSeverity.Information]: 'thongTin',
  [vscode.DiagnosticSeverity.Hint]: 'goiY',
};

function doiChanDoan(d: vscode.Diagnostic): ChanDoanNgoai {
  const ma = typeof d.code === 'object' && d.code !== null ? String((d.code as { value: unknown }).value) : d.code === undefined ? undefined : String(d.code);
  return {
    dong: d.range.start.line + 1, cot: d.range.start.character + 1, muc: MUC[d.severity] ?? 'loi',
    thongDiep: d.message.slice(0, 500), ...(ma ? { ma } : {}), ...(d.source ? { nguon: d.source } : {}),
  };
}

function viTri(x: vscode.Location | vscode.LocationLink): { file: string; dong: number; cot: number; dongCuoi: number } {
  const uri = 'targetUri' in x ? x.targetUri : x.uri;
  const r = 'targetUri' in x ? (x.targetSelectionRange ?? x.targetRange) : x.range;
  return { file: uri.fsPath, dong: r.start.line + 1, cot: r.start.character + 1, dongCuoi: r.end.line + 1 };
}

const TEN_LOAI = Object.fromEntries(Object.entries(vscode.SymbolKind).filter(([, v]) => typeof v === 'number').map(([k, v]) => [v as number, k.toLowerCase()]));

function doiKyHieu(ds: Array<vscode.DocumentSymbol | vscode.SymbolInformation>): Array<{ ten: string; loai: string; dong: number; con?: unknown[] }> {
  return ds.slice(0, 400).map((s) => ({
    ten: s.name, loai: TEN_LOAI[s.kind] ?? 'symbol',
    dong: ('selectionRange' in s ? s.selectionRange : s.location.range).start.line + 1,
    ...('children' in s && s.children?.length ? { con: doiKyHieu(s.children) } : {}),
  }));
}

/** Mở tài liệu (để server ngôn ngữ của VS Code phân tích) — không hiện lên editor. */
async function moTaiLieu(file: string): Promise<vscode.TextDocument> {
  return vscode.workspace.openTextDocument(vscode.Uri.file(file));
}

/** Chờ chẩn đoán của file ĐỔI (sau khi sửa) — tối đa `ms`, rồi đợi một nhịp yên. */
function choChanDoanDoi(uri: vscode.Uri, ms: number): Promise<void> {
  return new Promise((ok) => {
    let yen: NodeJS.Timeout | null = null;
    const xong = (): void => { clearTimeout(tran); if (yen) clearTimeout(yen); nghe.dispose(); ok(); };
    const tran = setTimeout(xong, ms);
    const nghe = vscode.languages.onDidChangeDiagnostics((e) => {
      if (!e.uris.some((u) => u.toString() === uri.toString())) return;
      if (yen) clearTimeout(yen);
      yen = setTimeout(xong, 400);
    });
  });
}

export function taoNguonLspVsc(): NguonLspNgoai {
  return {
    ten: 'vscode',
    async coChoGoc() { return true; },
    async coChoFile(file) {
      try { const d = await moTaiLieu(file); return d.languageId !== 'plaintext'; } catch { return false; }
    },
    async dinhNghia(file, dong, cot) {
      const d = await moTaiLieu(file);
      const r = await vscode.commands.executeCommand<Array<vscode.Location | vscode.LocationLink>>('vscode.executeDefinitionProvider', d.uri, new vscode.Position(dong - 1, cot - 1));
      return (r ?? []).map(viTri);
    },
    async thamChieu(file, dong, cot) {
      const d = await moTaiLieu(file);
      const r = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', d.uri, new vscode.Position(dong - 1, cot - 1));
      return (r ?? []).map(viTri);
    },
    async hover(file, dong, cot) {
      const d = await moTaiLieu(file);
      const r = await vscode.commands.executeCommand<vscode.Hover[]>('vscode.executeHoverProvider', d.uri, new vscode.Position(dong - 1, cot - 1));
      return (r ?? []).flatMap((h) => h.contents.map((c) => (typeof c === 'string' ? c : 'value' in c ? c.value : ''))).filter(Boolean).join('\n\n');
    },
    async kyHieu(file) {
      const d = await moTaiLieu(file);
      const r = await vscode.commands.executeCommand<Array<vscode.DocumentSymbol | vscode.SymbolInformation>>('vscode.executeDocumentSymbolProvider', d.uri);
      return doiKyHieu(r ?? []);
    },
    async chanDoan(file, choMs = 6000) {
      const uri = vscode.Uri.file(file);
      const doc = await moTaiLieu(file);
      // File vừa được AGENT ghi trên đĩa: tài liệu đang mở có thể còn bản cũ ⇒ chờ VS Code nạp lại + server phân tích.
      const chu = await vscode.workspace.fs.readFile(uri).then((b) => Buffer.from(b).toString('utf8'), () => null);
      if (chu !== null && chu !== doc.getText()) await choChanDoanDoi(uri, choMs);
      else if (!vscode.languages.getDiagnostics(uri).length) await choChanDoanDoi(uri, Math.min(choMs, 2500));
      return vscode.languages.getDiagnostics(uri).map(doiChanDoan);
    },
    chanDoanDaBiet(file) {
      const ds = vscode.languages.getDiagnostics(vscode.Uri.file(file));
      return ds.map(doiChanDoan);
    },
  };
}
