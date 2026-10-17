/**
 * CHẾ ĐỘ ĐỘC LẬP: AI Code chạy ngay trong VS Code, không cần app desktop.
 *
 * Nạp `dist/loi.js` (mã AI Code của app, dựng riêng — xem `doclap/loi.ts`) khi
 * cần, cắm "vỏ" VS Code vào chỗ Electron (thư mục dữ liệu, mở link, clipboard,
 * hộp chọn thư mục), và giữ phiên đăng nhập trong `SecretStorage`.
 *
 * Cùng mặt giao tiếp với `CauNoi` (chế độ qua app) — `extension.ts` không phải
 * biết đang chạy đường nào.
 */
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';
import type { KetNoi } from './ketNoi';
import type { LoiApi } from '../../cuongmini-core/src/kieuLoi';
import { lamMoi, LoiDangNhap, type NguoiDung } from '../../cuongmini-core/src/dangNhap';

const KHOA_PHIEN = 'cuongthai.phien';
/** Token sống 24h phía máy chủ; đổi mới mỗi 6h là dư sức. */
const CHU_KY_LAM_MOI = 6 * 3600 * 1000;

let loiDaNap: LoiApi | null = null;

function napLoi(ctx: vscode.ExtensionContext): LoiApi {
  if (loiDaNap) return loiDaNap;
  // Đường tuyệt đối, nạp lúc chạy: esbuild không gói `loi.js` vào extension.js.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  loiDaNap = require(path.join(ctx.extensionPath, 'dist', 'loi.js')) as LoiApi;
  return loiDaNap;
}

export class LoiDocLap implements KetNoi {
  readonly cheDo = 'docLap' as const;
  readonly phienBan: string;
  private nguoiNghe = new Set<(kenh: string, duLieu: unknown) => void>();
  private loi: LoiApi;
  private hen: NodeJS.Timeout | null = null;

  private constructor(private ctx: vscode.ExtensionContext, private nguoi: NguoiDung) {
    this.phienBan = String((ctx.extension.packageJSON as { version?: string }).version ?? '0.0.0');
    const thuMucDuLieu = ctx.globalStorageUri.fsPath;
    mkdirSync(thuMucDuLieu, { recursive: true });
    this.loi = napLoi(ctx);
    this.loi.khoiDong({
      thuMucDuLieu,
      phienBan: this.phienBan,
      phatSuKien: (kenh, duLieu) => { for (const f of this.nguoiNghe) f(kenh, duLieu); },
      moNgoai: (url) => Promise.resolve(vscode.env.openExternal(vscode.Uri.parse(url))),
      chepChu: (chu) => { void vscode.env.clipboard.writeText(chu); },
      moDuong: async (duong) => {
        try {
          const uri = vscode.Uri.file(duong);
          const st = await vscode.workspace.fs.stat(uri);
          if (st.type & vscode.FileType.Directory) await vscode.commands.executeCommand('revealFileInOS', uri);
          else await vscode.window.showTextDocument(uri, { preview: true });
          return '';
        } catch (e) {
          return (e as Error).message;
        }
      },
      chonThuMuc: async (o) => {
        const chonFile = o.properties?.includes('openFile') ?? false;
        const r = await vscode.window.showOpenDialog({
          title: o.title,
          defaultUri: o.defaultPath ? vscode.Uri.file(o.defaultPath) : undefined,
          canSelectFiles: chonFile,
          canSelectFolders: !chonFile,
          canSelectMany: o.properties?.includes('multiSelections') ?? false,
        });
        return r?.length ? { canceled: false, filePaths: r.map((u) => u.fsPath) } : { canceled: true, filePaths: [] };
      },
    });
    this.loi.datPhien({ userId: nguoi.userId, sessionToken: nguoi.token });
    this.hen = setInterval(() => void this.lamMoiPhien().catch(() => undefined), CHU_KY_LAM_MOI);
  }

  get nguoiDung(): NguoiDung { return this.nguoi; }

  /** Phiên đã cất ⇒ xác minh + đổi token mới ⇒ khởi động lõi. Không có phiên ⇒ null. */
  static async moLai(ctx: vscode.ExtensionContext): Promise<LoiDocLap | null> {
    const tho = await ctx.secrets.get(KHOA_PHIEN);
    if (!tho) return null;
    let cu: NguoiDung;
    try { cu = JSON.parse(tho) as NguoiDung; } catch { await ctx.secrets.delete(KHOA_PHIEN); return null; }
    let moi: NguoiDung;
    try {
      moi = await lamMoi(cu.token);
    } catch (e) {
      if (e instanceof LoiDangNhap && e.ma === 'hetHan') { await ctx.secrets.delete(KHOA_PHIEN); return null; }
      moi = cu; // mất mạng lúc mở VS Code: dùng tạm token cũ, lượt sau tự đổi
    }
    await ctx.secrets.store(KHOA_PHIEN, JSON.stringify(moi));
    return new LoiDocLap(ctx, moi);
  }

  static async tuDangNhap(ctx: vscode.ExtensionContext, nguoi: NguoiDung): Promise<LoiDocLap> {
    await ctx.secrets.store(KHOA_PHIEN, JSON.stringify(nguoi));
    return new LoiDocLap(ctx, nguoi);
  }

  static async dangXuat(ctx: vscode.ExtensionContext): Promise<void> {
    await ctx.secrets.delete(KHOA_PHIEN);
    loiDaNap?.datPhien(null);
  }

  /** Đổi token mới. `false` = phiên chết hẳn (phải đăng nhập lại). */
  async lamMoiPhien(): Promise<boolean> {
    try {
      this.nguoi = await lamMoi(this.nguoi.token);
    } catch (e) {
      if (e instanceof LoiDangNhap && e.ma === 'hetHan') return false;
      return true;
    }
    await this.ctx.secrets.store(KHOA_PHIEN, JSON.stringify(this.nguoi));
    this.loi.datPhien({ userId: this.nguoi.userId, sessionToken: this.nguoi.token });
    return true;
  }

  dong(): void {
    if (this.hen) clearInterval(this.hen);
    this.hen = null;
    this.nguoiNghe.clear();
  }

  /** Tắt VS Code/extension ⇒ đóng cửa sổ trình duyệt AI đã mở (không để Chrome mồ côi). */
  static async dongTrinhDuyet(): Promise<void> {
    await loiDaNap?.dongTrinhDuyet?.().catch(() => undefined);
  }

  async trangThai(): Promise<{ ok: boolean; phienBan: string; mucNoLuc?: string }> {
    const info = await this.loi.goi('agent:getInfo').catch(() => null) as { mucNoLuc?: string } | null;
    return { ok: true, phienBan: this.phienBan, mucNoLuc: info?.mucNoLuc };
  }

  async goi<T = unknown>(kenh: string, duLieu?: unknown): Promise<T> {
    return await this.loi.goi(kenh, duLieu) as T;
  }

  datThuMuc(cuocId: string, duong: string): Promise<unknown> { return this.loi.datThuMuc(cuocId, duong); }

  moDuPhong(matKhau: string): Promise<string> { return this.loi.moDuPhong(matKhau, this.nguoi.token); }

  async moCongAnthropic(matKhau: string): Promise<string> {
    const kq = this.loi.moCongAnthropic
      ? await this.loi.moCongAnthropic(matKhau)
      : await this.loi.goi('agent:moCongAnthropic', { matKhau }) as { ten?: string };
    return kq?.ten ?? 'Claude chính hãng';
  }

  chuanHoaAnh(dataUrl: string): Promise<string> { return this.loi.chuanHoaAnh(dataUrl); }

  nghe(nhan: (kenh: string, duLieu: unknown) => void, _dong: () => void): () => void {
    this.nguoiNghe.add(nhan);
    return () => { this.nguoiNghe.delete(nhan); };
  }
}
