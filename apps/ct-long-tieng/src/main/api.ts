/**
 * Khách HTTP cho `/api/v1/long-tieng` (hợp đồng mục 1). Chạy ở MAIN — renderer không bao giờ cầm mã kết nối.
 */
import { DUONG_API, type BaiNhac, type TaoViecRa, type TaoViecVao, type Viec } from '../shared/hopDong';
import { chuanHoaDanhSach, chuanHoaNhac, chuanHoaTaoViec, chuanHoaViec, boc, thongDiepLoi } from '../shared/chuanHoa';

export class LoiApi extends Error {
  constructor(message: string, public readonly maHttp: number) {
    super(message);
  }
  /** 0 = không tới được máy chủ (mất mạng, DNS, hết giờ). */
  get matMang(): boolean {
    return this.maHttp === 0;
  }
}

const HET_GIO_MS = 20_000;

export class ApiLongTieng {
  constructor(private mayChu: string, private ma: string | null, private readonly tacNhan: string) {}

  datMayChu(v: string): void { this.mayChu = v; }
  datMa(v: string | null): void { this.ma = v; }
  get coMa(): boolean { return !!this.ma; }

  private async goi(phuongThuc: string, duong: string, than?: unknown, maThu?: string): Promise<unknown> {
    const ma = maThu ?? this.ma;
    if (!ma) throw new LoiApi('Chưa kết nối — hãy dán mã kết nối.', 401);
    const dk = new AbortController();
    const hen = setTimeout(() => dk.abort(), HET_GIO_MS);
    let res: Response;
    try {
      res = await fetch(`${this.mayChu}${DUONG_API}${duong}`, {
        method: phuongThuc,
        headers: {
          Authorization: `Bearer ${ma}`,
          Accept: 'application/json',
          'User-Agent': this.tacNhan,
          ...(than !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: than !== undefined ? JSON.stringify(than) : undefined,
        signal: dk.signal,
        redirect: 'error',
      });
    } catch (e) {
      throw new LoiApi(
        dk.signal.aborted ? 'Máy chủ không trả lời (hết giờ).' : 'Không kết nối được máy chủ — kiểm tra mạng.',
        0,
      );
    } finally {
      clearTimeout(hen);
    }
    const chu = await res.text();
    let json: unknown = null;
    try { json = chu ? JSON.parse(chu) : null; } catch { /* phản hồi không phải JSON */ }
    if (!res.ok) throw new LoiApi(thongDiepLoi(json, res.status), res.status);
    return json;
  }

  /** Kiểm mã trước khi lưu: gọi thử `GET /jobs` bằng mã MỚI. */
  async kiemMa(ma: string): Promise<void> {
    await this.goi('GET', '/jobs', undefined, ma);
  }

  async danhSach(): Promise<Viec[]> {
    return chuanHoaDanhSach(await this.goi('GET', '/jobs'));
  }

  async chiTiet(id: string): Promise<Viec | null> {
    const d = boc(await this.goi('GET', `/jobs/${encodeURIComponent(id)}`));
    const o = d && typeof d === 'object' && 'job' in (d as object) ? (d as { job: unknown }).job : d;
    return chuanHoaViec(o);
  }

  async tao(vao: TaoViecVao): Promise<TaoViecRa> {
    const r = chuanHoaTaoViec(await this.goi('POST', '/jobs', vao));
    if (!r) throw new LoiApi('Máy chủ trả dữ liệu lạ khi tạo việc.', 500);
    return r;
  }

  /** Thư viện nhạc nền miễn phí bản quyền (bổ sung hợp đồng 18/11). */
  async dsNhac(): Promise<BaiNhac[]> {
    return chuanHoaNhac(await this.goi('GET', '/nhac'));
  }

  /** Tải hộ một URL nghe thử (để renderer — vốn bị chặn ra mạng — phát qua `ctlt-media://nghe-thu/<id>`). */
  async layNgheThu(url: string, range: string | null): Promise<Response> {
    const u = new URL(url, this.mayChu);
    const cungGoc = u.origin === new URL(this.mayChu).origin;
    if (u.protocol !== 'https:' && !(u.protocol === 'http:' && cungGoc)) return new Response('Forbidden', { status: 403 });
    return fetch(u, {
      headers: { ...(range ? { Range: range } : {}), ...(cungGoc && this.ma ? { Authorization: `Bearer ${this.ma}` } : {}) },
      redirect: 'follow',
    });
  }

  async daTaiLen(id: string): Promise<void> { await this.goi('POST', `/jobs/${encodeURIComponent(id)}/da-tai-len`, {}); }
  async thuLai(id: string): Promise<void> { await this.goi('POST', `/jobs/${encodeURIComponent(id)}/thu-lai`, {}); }
  async xoa(id: string): Promise<void> { await this.goi('DELETE', `/jobs/${encodeURIComponent(id)}`); }
  async daTaiVe(id: string): Promise<void> { await this.goi('POST', `/jobs/${encodeURIComponent(id)}/da-tai-ve`, {}); }
}
