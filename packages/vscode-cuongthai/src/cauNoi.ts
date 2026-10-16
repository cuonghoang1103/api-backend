/**
 * Khách của cầu nối trong app desktop CuongThai (`desktop/src/main/cauNoiVscode.ts`).
 *
 * App ghi `~/.cuongthai/vscode-bridge.json` = { cong, khoa } mỗi lần mở. Ở đây
 * đọc file đó, gọi HTTP tới 127.0.0.1 kèm khoá, và nghe luồng sự kiện SSE.
 * Không có header `Origin` (app chặn mọi yêu cầu mang Origin — đó là cách
 * nó phân biệt extension với một trang web lạ).
 */
import { readFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

export interface ThongTinCau { cong: number; khoa: string; pid?: number; phienBan?: string }

export function fileKhamPha(): string {
  return path.join(os.homedir(), '.cuongthai', 'vscode-bridge.json');
}

export function docKhamPha(): ThongTinCau | null {
  try {
    const j = JSON.parse(readFileSync(fileKhamPha(), 'utf8')) as ThongTinCau;
    return typeof j.cong === 'number' && typeof j.khoa === 'string' ? j : null;
  } catch {
    return null;
  }
}

function yeuCau(cau: ThongTinCau, phuongThuc: 'GET' | 'POST', duong: string, than?: unknown, giay = 30): Promise<unknown> {
  return new Promise((ok, hong) => {
    const du = than === undefined ? undefined : Buffer.from(JSON.stringify(than));
    const req = http.request({
      host: '127.0.0.1', port: cau.cong, path: duong, method: phuongThuc,
      headers: {
        authorization: `Bearer ${cau.khoa}`,
        ...(du ? { 'content-type': 'application/json', 'content-length': du.length } : {}),
      },
      timeout: giay * 1000,
    }, (res) => {
      const khuc: Buffer[] = [];
      res.on('data', (c: Buffer) => khuc.push(c));
      res.on('end', () => {
        const chu = Buffer.concat(khuc).toString('utf8');
        if ((res.statusCode ?? 500) >= 400) return hong(new Error(`App trả HTTP ${res.statusCode}: ${chu.slice(0, 200)}`));
        try { ok(JSON.parse(chu)); } catch { hong(new Error('App trả về dữ liệu lạ.')); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('App không trả lời.')));
    req.on('error', hong);
    if (du) req.write(du);
    req.end();
  });
}

export class CauNoi {
  constructor(private cau: ThongTinCau) {}

  get thongTin(): ThongTinCau { return this.cau; }

  async trangThai(): Promise<{ ok: boolean; phienBan: string; mucNoLuc?: string }> {
    return await yeuCau(this.cau, 'GET', '/trang-thai', undefined, 5) as { ok: boolean; phienBan: string; mucNoLuc?: string };
  }

  /** Gọi một kênh `agent:*` của app. Lượt chạy (`agent:send`) có thể dài — không đặt hạn ngắn. */
  async goi<T = unknown>(kenh: string, duLieu?: unknown): Promise<T> {
    const r = await yeuCau(this.cau, 'POST', '/goi', { kenh, duLieu }, kenh === 'agent:send' || kenh === 'agent:lamTiep' ? 24 * 3600 : 60) as { ok: boolean; kq?: T; loi?: string };
    if (!r.ok) throw new Error(r.loi ?? 'Lỗi không rõ từ app.');
    return r.kq as T;
  }

  async datThuMuc(cuocId: string, duong: string): Promise<unknown> {
    const r = await yeuCau(this.cau, 'POST', '/dat-thu-muc', { cuocId, duong }) as { ok: boolean; kq?: unknown; loi?: string };
    if (!r.ok) throw new Error(r.loi ?? 'Không đặt được thư mục.');
    return r.kq;
  }

  /** Mở cổng dự phòng bằng mật khẩu admin (app tự gọi máy chủ, giữ vé). */
  async moDuPhong(matKhau: string): Promise<string> {
    const r = await yeuCau(this.cau, 'POST', '/mo-du-phong', { matKhau }, 30) as { ok: boolean; ten?: string; loi?: string };
    if (!r.ok) throw new Error(r.loi ?? 'Không mở khoá được.');
    return r.ten ?? 'cổng dự phòng';
  }

  async chuanHoaAnh(dataUrl: string): Promise<string> {
    const r = await yeuCau(this.cau, 'POST', '/chuan-hoa-anh', { dataUrl }, 90) as { ok: boolean; dataUrl?: string; loi?: string };
    if (!r.ok || !r.dataUrl) throw new Error(r.loi ?? 'Không đọc được ảnh.');
    return r.dataUrl;
  }

  /** Nghe luồng sự kiện. Trả hàm huỷ. `dong` được gọi khi luồng đứt (app tắt…). */
  nghe(nhan: (kenh: string, duLieu: unknown) => void, dong: () => void): () => void {
    let huy = false;
    const req = http.request({
      host: '127.0.0.1', port: this.cau.cong, path: '/su-kien', method: 'GET',
      headers: { authorization: `Bearer ${this.cau.khoa}`, accept: 'text/event-stream' },
    }, (res) => {
      if (res.statusCode !== 200) { res.resume(); if (!huy) dong(); return; }
      res.setEncoding('utf8');
      let du = '';
      res.on('data', (c: string) => {
        du += c;
        let i: number;
        while ((i = du.indexOf('\n\n')) >= 0) {
          const khoi = du.slice(0, i);
          du = du.slice(i + 2);
          const dong_ = khoi.split('\n').find((d) => d.startsWith('data: '));
          if (!dong_) continue;
          try {
            const { kenh, duLieu } = JSON.parse(dong_.slice(6)) as { kenh: string; duLieu: unknown };
            nhan(kenh, duLieu);
          } catch { /* khối hỏng — bỏ */ }
        }
      });
      res.on('end', () => { if (!huy) dong(); });
      res.on('error', () => { if (!huy) dong(); });
    });
    req.on('error', () => { if (!huy) dong(); });
    req.end();
    return () => { huy = true; req.destroy(); };
  }
}
