/**
 * Máy chủ GIẢ cho chế độ thử (`--mock` / `CTLT_MOCK=1`): một HTTP server thật trên 127.0.0.1 nói ĐÚNG hợp đồng
 * `/api/v1/long-tieng` (mục 1 của `docs/long-tieng-hop-dong.md`) — nên chế độ thử chạy QUA khách HTTP thật,
 * tải lên/tải về thật, chỉ có "trạm" là giả.
 *
 * Giả lập:
 *   • Việc đi `cho` → (`tai` nếu là link) → `lam` qua 5 bước → `xong`, mỗi bước vài giây.
 *   • Link có chữ "chan"/"blocked" ⇒ trạm báo không tải được ⇒ app hiện nút "Tải trên máy này".
 *   • Mã kết nối bắt đầu `ctlt_sai` ⇒ 401 (thử màn hình dán mã sai).
 *   • Kết quả là video 24 s dựng bằng ffmpeg (gradient + tiếng bíp), phụ đề Việt + gốc, `thong-tin.json`.
 */
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import type { AddressInfo } from 'node:net';
import type { LoaiKetQua, NgonNgu, Nhip, TrangThaiMayChu } from '../../shared/hopDong';

interface ViecGia {
  id: string;
  url: string | null;
  tep: { ten: string; kichThuoc: number; kieu: string } | null;
  tenVideo: string | null;
  lang: NgonNgu;
  goc: number;
  nhip: Nhip;
  nhacNen: { loai: string; id?: string; amLuong?: number; tep?: { ten: string } } | null;
  /** Tệp đang chờ app gửi (video, nhạc) — đủ mới cho `da-tai-len`. */
  choGui?: string[];
  trangThai: TrangThaiMayChu;
  buoc: string | null;
  phanTram: number | null;
  loi: string | null;
  thoiLuong: number | null;
  tao: string;
  xong: string | null;
  /** Mốc (ms) bắt đầu trạng thái hiện tại — để giả lập tiến độ theo thời gian. */
  moc: number;
  /** Dừng mãi ở bước này (việc mẫu cho ảnh chụp). */
  dungLai?: boolean;
  daTaiVe?: boolean;
}

const BUOC = ['Tách giọng (Demucs)', 'Nghe & chép lời (Whisper)', 'Dịch sang tiếng Việt', 'Đọc giọng Việt (cuong8)', 'Trộn tiếng & xuất video'];
const LOI_LINK = 'Trạm không tải được link này (trang nguồn chặn máy trạm). Hãy tải video trên máy bạn rồi kéo vào app.';

function chayFfmpeg(ffmpeg: string, args: string[]): Promise<void> {
  return new Promise((res, rej) => execFile(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { timeout: 120_000 }, (e) => (e ? rej(e) : res())));
}

const SRT_VI = [
  'Xin chào, hôm nay chúng ta học cách dựng một dịch vụ nhỏ.',
  'Đầu tiên, tạo thư mục dự án và khởi tạo kho mã.',
  'Tiếp theo, viết hàm xử lý yêu cầu đầu tiên.',
  'Chạy thử và quan sát kết quả trong terminal.',
  'Nếu gặp lỗi, đọc kỹ thông báo — nó thường chỉ đúng chỗ.',
  'Cuối cùng, đóng gói và chạy lại một lần nữa.',
];
const SRT_ZH = ['大家好，今天我们来搭建一个小服务。', '首先，创建项目目录并初始化仓库。', '接下来，编写第一个请求处理函数。', '运行一下，在终端里观察结果。', '如果出错，仔细阅读错误信息。', '最后，打包并再运行一次。'];
const SRT_EN = ['Hi everyone, today we build a small service.', 'First, create the project folder and init the repo.', 'Next, write the first request handler.', 'Run it and watch the output in the terminal.', 'If it fails, read the error message carefully.', 'Finally, package it and run it once more.'];

function srt(cau: string[]): string {
  const t = (s: number) => `00:00:${String(s).padStart(2, '0')},000`;
  return cau.map((c, i) => `${i + 1}\n${t(i * 4)} --> ${t(i * 4 + 3)}\n${c}\n`).join('\n');
}

async function dungMedia(thuMuc: string, ffmpeg: string | null): Promise<void> {
  await fsp.mkdir(thuMuc, { recursive: true });
  await fsp.writeFile(path.join(thuMuc, 'vi.srt'), srt(SRT_VI));
  await fsp.writeFile(path.join(thuMuc, 'zh.srt'), srt(SRT_ZH));
  await fsp.writeFile(path.join(thuMuc, 'en.srt'), srt(SRT_EN));
  const vi = path.join(thuMuc, 'vi.mp4');
  const viGoc = path.join(thuMuc, 'vi-goc.mp4');
  const nhac = [['nhac-1.m4a', 330], ['nhac-2.m4a', 392], ['nhac-3.m4a', 523]] as const;
  for (const [ten, f] of nhac) {
    const p = path.join(thuMuc, ten);
    if (fs.existsSync(p)) continue;
    if (!ffmpeg) { await fsp.writeFile(p, Buffer.alloc(512)); continue; }
    await chayFfmpeg(ffmpeg, ['-f', 'lavfi', '-i', `sine=f=${f}:d=12`, '-f', 'lavfi', '-i', `sine=f=${f * 1.5}:d=12`,
      '-filter_complex', '[0:a][1:a]amix=inputs=2,volume=0.5[a]', '-map', '[a]', '-c:a', 'aac', '-b:a', '64k', p]).catch(() => fsp.writeFile(p, Buffer.alloc(512)));
  }
  if (fs.existsSync(vi) && fs.existsSync(viGoc)) return;
  if (!ffmpeg) {
    await fsp.writeFile(vi, Buffer.alloc(1024));
    await fsp.writeFile(viGoc, Buffer.alloc(1024));
    return;
  }
  const hinh = ['-f', 'lavfi', '-i', 'gradients=s=1280x720:r=25:d=24:speed=0.015:c0=0x4f5bd5:c1=0x1b2142:c2=0x7fe6c9:n=3'];
  const xuat = ['-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart'];
  try {
    await chayFfmpeg(ffmpeg, [...hinh, '-f', 'lavfi', '-i', 'sine=f=440:d=24:beep_factor=2', ...xuat, vi]);
    await chayFfmpeg(ffmpeg, [...hinh, '-f', 'lavfi', '-i', 'sine=f=440:d=24:beep_factor=2', '-f', 'lavfi', '-i', 'sine=f=660:d=24',
      '-filter_complex', '[1:a][2:a]amix=inputs=2:weights=1 0.3[a]', '-map', '0:v', '-map', '[a]', ...xuat, viGoc]);
  } catch {
    const tst = ['-f', 'lavfi', '-i', 'testsrc2=s=1280x720:r=25:d=24'];
    await chayFfmpeg(ffmpeg, [...tst, '-f', 'lavfi', '-i', 'sine=f=440:d=24', ...xuat, vi]);
    await chayFfmpeg(ffmpeg, [...tst, '-f', 'lavfi', '-i', 'sine=f=660:d=24', ...xuat, viGoc]);
  }
}

export interface MayChuGia {
  goc: string;
  dong(): Promise<void>;
}

export async function moMayChuGia(thuMucDuLieu: string, ffmpeg: string | null): Promise<MayChuGia> {
  const media = path.join(thuMucDuLieu, 'mock-media');
  await dungMedia(media, ffmpeg);
  const tepTrangThai = path.join(thuMucDuLieu, 'mock-viec.json');
  let dem = 100;
  let ds: ViecGia[] = [];
  try { ds = JSON.parse(fs.readFileSync(tepTrangThai, 'utf8')) as ViecGia[]; dem = Math.max(dem, ...ds.map((v) => Number(v.id.replace(/\D/g, '')) || 0)); } catch { /* lần đầu */ }
  const luu = () => fsp.writeFile(tepTrangThai, JSON.stringify(ds, null, 2)).catch(() => {});

  const now = () => new Date().toISOString();
  const moi = (p: Partial<ViecGia>): ViecGia => ({
    id: `lt${++dem}`, url: null, tep: null, tenVideo: null, lang: 'auto', goc: 0.15, nhip: 'cho-giong', nhacNen: null, trangThai: 'cho',
    buoc: null, phanTram: null, loi: null, thoiLuong: null, tao: now(), xong: null, moc: Date.now(), ...p,
  });

  if (!ds.length) {
    const truoc = (phut: number) => new Date(Date.now() - phut * 60_000).toISOString();
    ds.push(
      moi({ url: 'https://www.bilibili.com/video/BV1demo', tenVideo: 'Rust cho người mới — quản lý bộ nhớ', lang: 'zh', trangThai: 'xong', tao: truoc(42), xong: truoc(30), thoiLuong: 24, phanTram: 100 }),
      moi({ url: 'https://www.youtube.com/watch?v=docker-demo', tenVideo: 'Docker Compose thực chiến', lang: 'en', goc: 0.2, trangThai: 'xong', tao: truoc(95), xong: truoc(70), thoiLuong: 24, phanTram: 100 }),
      moi({ url: 'https://www.bilibili.com/video/BV1k8s', tenVideo: 'Kubernetes cơ bản: Pod, Service, Deployment', lang: 'zh', trangThai: 'lam', buoc: BUOC[3], phanTram: 62, tao: truoc(9), dungLai: true }),
      moi({ url: 'https://www.youtube.com/watch?v=chan-demo', lang: 'en', trangThai: 'loi', loi: LOI_LINK, tao: truoc(4), xong: truoc(3) }),
      moi({ tep: { ten: 'bai-giang-go-concurrency.mp4', kichThuoc: 182_000_000, kieu: 'video/mp4' }, lang: 'en', trangThai: 'cho', tao: truoc(1), dungLai: true }),
    );
    void luu();
  }

  const giayMoiBuoc = Number(process.env.CTLT_MOCK_GIAY ?? '3');
  const tick = () => {
    const t = Date.now();
    let doi = false;
    for (const v of ds) {
      if (v.dungLai) continue;
      const qua = (t - v.moc) / 1000;
      const sang = (tt: TrangThaiMayChu, p: Partial<ViecGia> = {}) => { Object.assign(v, { trangThai: tt, moc: t }, p); doi = true; };
      if (v.trangThai === 'cho' && qua > 2) {
        if (v.url) sang('tai', { buoc: 'Trạm đang tải video', phanTram: 0 });
        else sang('lam', { buoc: BUOC[0], phanTram: 0 });
      } else if (v.trangThai === 'tai') {
        if (/chan|blocked/i.test(v.url ?? '') && qua > 2) sang('loi', { loi: LOI_LINK, xong: now(), buoc: null, phanTram: null });
        else if (qua > 4) sang('lam', { buoc: BUOC[0], phanTram: 0 });
        else { v.phanTram = Math.round((qua / 4) * 100); doi = true; }
      } else if (v.trangThai === 'lam') {
        const i = Math.floor(qua / giayMoiBuoc);
        if (i >= BUOC.length) sang('xong', { buoc: null, phanTram: 100, xong: now(), thoiLuong: 24 });
        else { v.buoc = BUOC[i]; v.phanTram = Math.round((qua / (giayMoiBuoc * BUOC.length)) * 100); doi = true; }
      }
    }
    if (doi) void luu();
  };
  const dongHo = setInterval(tick, 500);

  let goc = '';
  const tenGoc = (v: ViecGia) => (v.tenVideo ?? v.tep?.ten.replace(/\.[^.]+$/, '') ?? 'Video thử').replace(/[\\/:*?"<>|]/g, ' ');
  const ketQua = (v: ViecGia) => {
    if (v.trangThai !== 'xong' || v.daTaiVe) return [];
    const ten = tenGoc(v);
    const ma = v.lang === 'auto' ? 'zh' : v.lang;
    const ds: Array<{ loai: LoaiKetQua; ten: string; tep: string }> = [
      { loai: 'vi', ten: `${ten} [VI].mp4`, tep: 'vi.mp4' },
      { loai: 'vi-goc', ten: `${ten} [VI + giọng gốc ${Math.round(v.goc * 100)}%].mp4`, tep: 'vi-goc.mp4' },
      { loai: 'srt-vi', ten: `${ten}.vi.srt`, tep: 'vi.srt' },
      { loai: 'srt-goc', ten: `${ten}.${ma}.srt`, tep: `${ma}.srt` },
      { loai: 'thong-tin', ten: 'thong-tin.json', tep: '' },
    ];
    return ds.map((k) => ({
      loai: k.loai, ten: k.ten, url: `${goc}/__tep/${v.id}/${k.loai}`,
      kichThuoc: k.tep ? fs.statSync(path.join(media, k.tep)).size : Buffer.byteLength(thongTin(v)),
    }));
  };
  const thongTin = (v: ViecGia) => JSON.stringify({
    tenVideo: tenGoc(v), nguon: v.url ? new URL(v.url).hostname.replace(/^www\./, '') : 'tệp tải lên', link: v.url,
    ngonNgu: v.lang === 'auto' ? 'zh' : v.lang, thoiLuong: 24, soCau: 6, nhip: v.nhip, tram: 'mock-0.1', ngay: v.xong ?? now(),
  }, null, 2);
  const hien = (v: ViecGia) => {
    const { moc: _m, dungLai: _d, daTaiVe: _t, choGui: _c, ...r } = v;
    return { ...r, ketQua: ketQua(v) };
  };

  const server = http.createServer((req, res) => {
    const u = new URL(req.url ?? '/', 'http://x');
    const gui = (ma: number, du?: unknown) => {
      res.writeHead(ma, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(du === undefined ? '' : JSON.stringify(ma < 400 ? { success: true, data: du } : { success: false, message: du }));
    };

    // Tệp kết quả (không cần mã — mô phỏng URL ký sẵn).
    const mTep = /^\/__tep\/([^/]+)\/([^/]+)$/.exec(u.pathname);
    if (mTep && req.method === 'GET') {
      const v = ds.find((x) => x.id === mTep[1]);
      if (!v || v.daTaiVe) return gui(404, 'Không còn tệp');
      const loai = mTep[2] as LoaiKetQua;
      let buf: Buffer | null = null;
      let p: string | null = null;
      if (loai === 'thong-tin') buf = Buffer.from(thongTin(v));
      else if (loai === 'vi') p = path.join(media, 'vi.mp4');
      else if (loai === 'vi-goc') p = path.join(media, 'vi-goc.mp4');
      else if (loai === 'srt-vi') p = path.join(media, 'vi.srt');
      else if (loai === 'srt-goc') p = path.join(media, `${v.lang === 'en' ? 'en' : 'zh'}.srt`);
      if (!buf && !p) return gui(404, 'Không có');
      const tong = buf ? buf.length : fs.statSync(p!).size;
      const r = /^bytes=(\d+)-$/.exec(req.headers.range ?? '');
      const tu = r ? Number(r[1]) : 0;
      if (tu >= tong && r) { res.writeHead(416); return res.end(); }
      res.writeHead(r ? 206 : 200, { 'Content-Length': String(tong - tu), 'Content-Type': 'application/octet-stream', ...(r ? { 'Content-Range': `bytes ${tu}-${tong - 1}/${tong}` } : {}) });
      if (buf) return res.end(buf.subarray(tu));
      return fs.createReadStream(p!, { start: tu }).pipe(res);
    }

    // Nhạc nghe thử (mô phỏng URL công khai).
    const mNghe = /^\/__nghe\/(nhac-[123])$/.exec(u.pathname);
    if (mNghe && req.method === 'GET') {
      const p = path.join(media, `${mNghe[1]}.m4a`);
      const tong = fs.statSync(p).size;
      const r = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range ?? '');
      const tu = r ? Number(r[1]) : 0;
      const den = r && r[2] ? Math.min(Number(r[2]), tong - 1) : tong - 1;
      res.writeHead(r ? 206 : 200, { 'Content-Type': 'audio/mp4', 'Accept-Ranges': 'bytes', 'Content-Length': String(den - tu + 1), ...(r ? { 'Content-Range': `bytes ${tu}-${den}/${tong}` } : {}) });
      return fs.createReadStream(p, { start: tu, end: den }).pipe(res);
    }

    // Tải lên (PUT ký sẵn).
    const mLen = /^\/__tai-len\/([^/]+)$/.exec(u.pathname);
    if (mLen && req.method === 'PUT') {
      let n = 0;
      req.on('data', (c: Buffer) => { n += c.length; });
      req.on('end', () => { res.writeHead(200); res.end(); console.log(`[mock] nhận ${n} byte cho ${mLen[1]}`); });
      return;
    }

    if (!u.pathname.startsWith('/api/v1/long-tieng/')) return gui(404, 'Không có tuyến');
    const ma = /^Bearer (ctlt_\S+)$/.exec(req.headers.authorization ?? '')?.[1];
    if (!ma || ma.startsWith('ctlt_sai')) return gui(401, 'Mã kết nối không đúng hoặc đã bị thu hồi.');
    const duong = u.pathname.slice('/api/v1/long-tieng'.length);

    let than = '';
    req.on('data', (c: Buffer) => { than += c.toString(); });
    req.on('end', () => {
      let body: Record<string, unknown> = {};
      try { body = than ? (JSON.parse(than) as Record<string, unknown>) : {}; } catch { return gui(400, 'JSON hỏng'); }

      if (duong === '/jobs' && req.method === 'GET') return gui(200, ds.map(hien));
      if (duong === '/nhac' && req.method === 'GET') {
        return gui(200, [
          { id: 'nhac-1', ten: 'Lo-fi buổi sáng', tamTrang: 'Thư giãn', giay: 12, nghiThu: `${goc}/__nghe/nhac-1`, nguon: 'Pixabay Music', giayPhep: 'Pixabay Content License' },
          { id: 'nhac-2', ten: 'Nhịp code đêm', tamTrang: 'Tập trung', giay: 12, nghiThu: `${goc}/__nghe/nhac-2`, nguon: 'Free Music Archive', giayPhep: 'CC BY 4.0' },
          { id: 'nhac-3', ten: 'Piano nhẹ', tamTrang: 'Êm', giay: 12, nghiThu: `${goc}/__nghe/nhac-3`, nguon: 'Incompetech (Kevin MacLeod)', giayPhep: 'CC BY 4.0' },
        ]);
      }
      if (duong === '/jobs' && req.method === 'POST') {
        const tep = body.tep as ViecGia['tep'];
        const url = typeof body.url === 'string' ? body.url : null;
        if (!tep && !url) return gui(400, 'Cần url hoặc tep');
        const nhacNen = (typeof body.nhacNen === 'object' && body.nhacNen ? body.nhacNen : { loai: 'goc' }) as NonNullable<ViecGia['nhacNen']>;
        if (!['goc', 'thu-vien', 'tep', 'khong'].includes(nhacNen.loai)) return gui(400, 'nhacNen.loai sai');
        if (nhacNen.loai === 'thu-vien' && !/^nhac-[123]$/.test(nhacNen.id ?? '')) return gui(400, 'Không có bài nhạc này');
        if (nhacNen.loai === 'tep' && !nhacNen.tep?.ten) return gui(400, 'Thiếu nhacNen.tep');
        const choGui = [...(tep ? ['video'] : []), ...(nhacNen.loai === 'tep' ? ['nhac'] : [])];
        const v = moi({
          url, tep: tep ?? null, tenVideo: typeof body.tenVideo === 'string' ? body.tenVideo : null,
          lang: (['auto', 'zh', 'en'].includes(body.lang as string) ? body.lang : 'auto') as NgonNgu,
          goc: typeof body.goc === 'number' ? Math.min(0.4, Math.max(0, body.goc)) : 0.15,
          nhip: body.nhip === 'tang-toc' ? 'tang-toc' : 'cho-giong',
          nhacNen, choGui,
          trangThai: choGui.length ? 'cho_tai_len' : 'cho',
        });
        ds.unshift(v);
        void luu();
        const het = new Date(Date.now() + 3_600_000).toISOString();
        return gui(201, {
          job: hien(v),
          ...(tep ? { taiLen: { url: `${goc}/__tai-len/${v.id}`, het } } : {}),
          ...(nhacNen.loai === 'tep' ? { taiLenNhac: { url: `${goc}/__tai-len/${v.id}-nhac`, het } } : {}),
        });
      }
      const m = /^\/jobs\/([^/]+)(?:\/([a-z-]+))?$/.exec(duong);
      const v = m ? ds.find((x) => x.id === m[1]) : undefined;
      if (!m || !v) return gui(404, 'Không tìm thấy việc');
      const hanhDong = m[2];
      if (!hanhDong && req.method === 'GET') return gui(200, hien(v));
      if (!hanhDong && req.method === 'DELETE') { ds = ds.filter((x) => x !== v); void luu(); return gui(200, { ok: true }); }
      if (hanhDong === 'da-tai-len' && req.method === 'POST') { Object.assign(v, { trangThai: 'cho', moc: Date.now() }); void luu(); return gui(200, hien(v)); }
      if (hanhDong === 'thu-lai' && req.method === 'POST') {
        if (v.trangThai !== 'loi') return gui(409, 'Chỉ thử lại được việc lỗi');
        Object.assign(v, { trangThai: 'cho', loi: null, xong: null, moc: Date.now() });
        void luu();
        return gui(200, hien(v));
      }
      if (hanhDong === 'da-tai-ve' && req.method === 'POST') { v.daTaiVe = true; void luu(); return gui(200, { ok: true }); }
      return gui(404, 'Không có tuyến');
    });
  });

  await new Promise<void>((r) => server.listen(Number(process.env.CTLT_MOCK_PORT ?? 0), '127.0.0.1', () => r()));
  goc = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  console.log(`[mock] máy chủ giả ở ${goc}`);
  return {
    goc,
    dong: () => new Promise<void>((r) => { clearInterval(dongHo); server.close(() => r()); }),
  };
}
