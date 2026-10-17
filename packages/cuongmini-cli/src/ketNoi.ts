/**
 * NỐI VỚI LÕI AI Code (`dist/loi.cjs`, dựng từ `packages/cuongmini-core`).
 *
 * Lõi là CommonJS và có móc `Module._load` so `__filename` của chính nó để
 * đổi `require('electron')` động — nên nó PHẢI là một file CJS riêng nạp bằng
 * `createRequire`, không gói chung vào bản ESM của CLI (gói chung thì
 * `__filename` thành file ESM, móc không khớp, `boNho.ts` nạp nhầm Electron thật).
 *
 * `CUONGMINI_LOI` trỏ sang lõi khác — dùng cho lõi GIẢ khi chụp màn hình/thử.
 */
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LoiApi } from '../../cuongmini-core/src/kieuLoi';
import { lamMoi, LoiDangNhap } from '../../cuongmini-core/src/dangNhap';
import { chepChu, moNgoai } from './heThong';
import { luuPhien, thuMucDuLieu, type NguoiDung } from './phien';

/** Token sống 24h phía máy chủ; đổi mới mỗi 6h là dư sức (như extension VS Code). */
export const CHU_KY_LAM_MOI = 6 * 3600 * 1000;

export interface SuKienAgent { cuocId?: string; loai: string; [k: string]: unknown }

let daNap: LoiApi | null = null;

export function napLoi(): LoiApi {
  if (daNap) return daNap;
  const tuDay = path.dirname(fileURLToPath(import.meta.url));
  const duong = process.env.CUONGMINI_LOI ? path.resolve(process.env.CUONGMINI_LOI) : path.join(tuDay, 'loi.cjs');
  const yeuCau = createRequire(import.meta.url);
  daNap = yeuCau(duong) as LoiApi;
  return daNap;
}

export class KetNoiLoi {
  readonly loi: LoiApi;
  cuocId = '';
  private nguoiNghe = new Set<(e: SuKienAgent) => void>();
  private hen: NodeJS.Timeout | null = null;

  private constructor(public nguoi: NguoiDung, readonly phienBan: string) {
    const thuMuc = thuMucDuLieu();
    mkdirSync(thuMuc, { recursive: true, mode: 0o700 });
    this.loi = napLoi();
    this.loi.khoiDong({
      thuMucDuLieu: thuMuc,
      phienBan,
      phatSuKien: (kenh, duLieu) => {
        if (kenh !== 'agent:event') return;
        const e = duLieu as SuKienAgent;
        if (e?.cuocId && e.cuocId !== this.cuocId) return;
        for (const f of this.nguoiNghe) f(e);
      },
      moNgoai,
      chepChu: (chu) => { void chepChu(chu); },
      moDuong: async (duong) => ((await moNgoai(duong)) ? '' : 'Không mở được bằng chương trình mặc định.'),
      // Terminal không có hộp chọn thư mục — thư mục dự án luôn là thư mục đang đứng.
      chonThuMuc: async () => ({ canceled: true, filePaths: [] }),
    });
    this.loi.datPhien({ userId: nguoi.userId, sessionToken: nguoi.token });
    this.hen = setInterval(() => void this.lamMoiPhien(), CHU_KY_LAM_MOI);
    this.hen.unref();
  }

  /** Khởi động lõi + tạo cuộc + gắn thư mục dự án. */
  static async tao(nguoi: NguoiDung, o: { thuMuc: string; phienBan: string }): Promise<KetNoiLoi> {
    const k = new KetNoiLoi(nguoi, o.phienBan);
    k.cuocId = String(await k.loi.goi('agent:taoCuoc'));
    await k.loi.datThuMuc(k.cuocId, o.thuMuc);
    return k;
  }

  /** Gọi kênh `agent:*` — luôn kèm `cuocId` (zod bỏ khoá thừa ở kênh không cần). */
  async goi<T = unknown>(kenh: string, duLieu: Record<string, unknown> = {}): Promise<T> {
    return await this.loi.goi(kenh, { cuocId: this.cuocId, ...duLieu }) as T;
  }

  /** Kênh không nhận tham số (schema `null`). */
  async goiTrong<T = unknown>(kenh: string): Promise<T> {
    return await this.loi.goi(kenh) as T;
  }

  nghe(f: (e: SuKienAgent) => void): () => void {
    this.nguoiNghe.add(f);
    return () => { this.nguoiNghe.delete(f); };
  }

  /** Đổi token mới. `false` = phiên chết hẳn (phải đăng nhập lại). */
  async lamMoiPhien(): Promise<boolean> {
    try {
      this.datNguoi(await lamMoi(this.nguoi.token));
      return true;
    } catch (e) {
      return !(e instanceof LoiDangNhap && e.ma === 'hetHan');
    }
  }

  /** Sau khi đăng nhập lại giữa chừng: đổi người cho lõi, giữ nguyên cuộc. */
  datNguoi(n: NguoiDung): void {
    this.nguoi = n;
    luuPhien(n);
    this.loi.datPhien({ userId: n.userId, sessionToken: n.token });
  }

  moDuPhong(matKhau: string): Promise<string> { return this.loi.moDuPhong(matKhau, this.nguoi.token); }

  chuanHoaAnh(dataUrl: string): Promise<string> { return this.loi.chuanHoaAnh(dataUrl); }

  dong(): void {
    // Trình duyệt AI (Chrome/Edge do lõi bật cho tool web) phải đóng theo — không để cửa sổ mồ côi.
    void this.loi.dongTrinhDuyet?.().catch(() => undefined);
    if (this.hen) clearInterval(this.hen);
    this.hen = null;
    this.nguoiNghe.clear();
  }
}
