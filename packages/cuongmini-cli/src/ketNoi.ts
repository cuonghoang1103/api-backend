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
import { chepChu, moFileSua, moNgoai } from './heThong';
import { L } from './i18n';
import { luuPhien, thuMucDuLieu, type NguoiDung } from './phien';

/** Token sống 24h phía máy chủ; đổi mới mỗi 6h là dư sức (như extension VS Code). */
export const CHU_KY_LAM_MOI = 6 * 3600 * 1000;

export interface SuKienAgent { cuocId?: string; loai: string; [k: string]: unknown }

let daNap: LoiApi | null = null;
/** Kết nối đang mở — để `main` đóng trình duyệt AI (có chờ) trước khi tắt tiến trình. */
let dangMo: KetNoiLoi | null = null;

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
  /** Muốn cho AI dùng trình duyệt ở phiên này không (cài đặt + máy có Chrome/Edge, `/browser` đổi được). */
  trinhDuyet = false;
  /** Lần mở file/đường dẫn gần nhất qua lõi (`/mcp mo`, `/hooks`) — để báo đúng khi KHÔNG mở được. */
  moCuoi: { duong: string; ok: boolean } | null = null;
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
      // File (đường dẫn tuyệt đối có đuôi) ⇒ mở để SỬA (`open -t`/notepad); còn lại ⇒ chương trình mặc định.
      moDuong: async (duong) => {
        const laFile = path.isAbsolute(duong) && /\.[a-z0-9]{1,8}$/i.test(duong);
        const ok = laFile ? await moFileSua(duong) : await moNgoai(duong);
        this.moCuoi = { duong, ok };
        return ok ? '' : L('Không mở được bằng chương trình mặc định.', 'Could not open with the default app.');
      },
      // Terminal không có hộp chọn thư mục — thư mục dự án luôn là thư mục đang đứng.
      chonThuMuc: async () => ({ canceled: true, filePaths: [] }),
      noi: 'cli',
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
    dangMo = k;
    return k;
  }

  /**
   * Gửi quyền trình duyệt xuống lõi (`agent:datCheDoTrinhDuyet`). Gọi sau khi tạo cuộc,
   * sau khi mở việc cũ và sau `/clear` — mỗi lần lõi có thể dựng lại trạng thái cuộc.
   * Trả workspace mới (có `choTrinhDuyet`) để giao diện hiện 🌐.
   */
  async apTrinhDuyet(bat: boolean = this.trinhDuyet): Promise<unknown> {
    this.trinhDuyet = bat;
    return this.goi('agent:datCheDoTrinhDuyet', { bat });
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

  /**
   * Cổng Claude chính hãng: mật khẩu ⇒ vé (lõi lưu, gửi kèm mọi lượt). Lõi cũ không có hàm
   * riêng thì đi kênh `agent:moCongAnthropic`; lõi cũ hơn nữa không có kênh ⇒ ném lỗi rõ.
   */
  async moCongAnthropic(matKhau: string): Promise<{ ten: string; hetHan: number | null }> {
    if (this.loi.moCongAnthropic) return this.loi.moCongAnthropic(matKhau);
    return await this.loi.goi('agent:moCongAnthropic', { matKhau }) as { ten: string; hetHan: number | null };
  }

  /** Chọn cổng phụ cho cuộc này: `modelapi` (kèm model gpt-*) hoặc `null` (về cổng chính / Free / chính hãng theo model). */
  datCongPhu(cong: 'modelapi' | null, model?: string): Promise<unknown> {
    return this.goi('agent:datCongPhu', { cong, ...(model ? { model } : {}) });
  }

  chuanHoaAnh(dataUrl: string): Promise<string> { return this.loi.chuanHoaAnh(dataUrl); }

  /** Đóng: dừng hẹn làm mới + ĐÓNG trình duyệt AI (Chrome/Edge lõi bật cho tool web) — chờ tối đa 4s. */
  async dong(): Promise<void> {
    if (this.hen) clearInterval(this.hen);
    this.hen = null;
    this.nguoiNghe.clear();
    if (dangMo === this) dangMo = null;
    const dongTd = this.loi.dongTrinhDuyet?.().catch(() => undefined);
    if (dongTd) await Promise.race([dongTd, new Promise((x) => setTimeout(x, 4000).unref())]);
  }
}

/** Gọi trước `process.exit` — không để cửa sổ Chrome mồ côi sau khi CLI thoát. */
export async function dongKetNoiDangMo(): Promise<void> {
  await dangMo?.dong();
}
