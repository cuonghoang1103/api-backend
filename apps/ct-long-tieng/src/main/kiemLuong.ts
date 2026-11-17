/**
 * Kiểm LUỒNG đầu-cuối ở chế độ thử (`npm run kiem-luong`, chỉ bản chưa đóng gói): đi qua đúng cầu `window.ctlt`
 * như người dùng bấm, với máy chủ giả. In ✓/✗ từng bước, thoát mã 1 nếu có bước hỏng.
 */
import type { BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import type { TrangThaiApp } from '../shared/ipc';

const cho = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface MoiTruongKiem {
  cuaSo: BrowserWindow;
  thuMucDuLieu: string;
  datNhacTep: (p: string) => Promise<void>;
  taoTuTep: (p: string) => Promise<void>;
}

export async function kiemLuong(mt: MoiTruongKiem): Promise<boolean> {
  const w = mt.cuaSo;
  await new Promise<void>((r) => (w.webContents.isLoading() ? w.webContents.once('did-finish-load', () => r()) : r()));
  const js = <T>(s: string) => w.webContents.executeJavaScript(s, true) as Promise<T>;
  const tt = () => js<TrangThaiApp>('window.ctlt.layTrangThai()');
  let hong = 0;
  const buoc = (ten: string, ok: boolean, chiTiet = '') => {
    console.log(`${ok ? '✓' : '✗'} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`);
    if (!ok) hong += 1;
  };
  const doi = async (dk: (s: TrangThaiApp) => boolean, giay: number) => {
    for (let i = 0; i < giay * 2; i += 1) { const s = await tt(); if (dk(s)) return s; await cho(500); }
    return null;
  };
  // Renderer chỉ phát media qua thẻ <audio>/<video> (CSP `media-src ctlt-media:`; `connect-src` KHÔNG mở) ⇒ kiểm
  // bằng đúng đường đó: nạp metadata, trả thời lượng (giây) hoặc -1 khi lỗi.
  const napMedia = (url: string, the = 'audio') => js<number>(`new Promise((r) => { const m = document.createElement('${the}'); m.preload = 'metadata';
    m.onloadedmetadata = () => r(m.duration); m.onerror = () => r(-1); setTimeout(() => r(-2), 15000); m.src = ${JSON.stringify(url)}; })`);
  const tc = (them = '') => `{ lang: 'zh', goc: 0.2, nhip: 'tang-toc', nhacNen: { loai: 'goc', id: null, amLuong: 0.5 }${them} }`;

  const sai = await js<{ ok: boolean; loi?: string }>(`window.ctlt.ketNoi('ctlt_sai12345678')`);
  buoc('Mã sai bị từ chối', !sai.ok, sai.loi);
  const dung = await js<{ ok: boolean; loi?: string }>(`window.ctlt.ketNoi('ctlt_dung1234567')`);
  buoc('Mã đúng kết nối được', dung.ok, dung.loi);

  const nhac = await js<{ ok: boolean; ds: Array<{ id: string; nghiThu: string | null; giayPhep: string | null }> }>('window.ctlt.dsNhac()');
  buoc('Thư viện nhạc nền có 3 bài + giấy phép', nhac.ok && nhac.ds.length === 3 && nhac.ds.every((b) => b.giayPhep), JSON.stringify(nhac.ds.map((b) => b.id)));
  const nghe = await napMedia(nhac.ds[0]?.nghiThu ?? '');
  buoc('Nghe thử nhạc qua ctlt-media://nghe-thu (main tải hộ)', nghe > 5, `${nghe.toFixed(1)} s`);
  const ngoai = await js<string>(`fetch('https://example.com').then(() => 'lọt').catch(() => 'chặn')`);
  buoc('Renderer KHÔNG tự ra mạng được', ngoai === 'chặn');

  // Việc từ link, chọn nhạc thư viện, nhịp tăng tốc ⇒ chạy hết 5 bước ⇒ tự tải về.
  const r1 = await js<{ ok: boolean; loi?: string }>(`window.ctlt.taoViecLink('https://www.bilibili.com/video/BVkiem1', { lang: 'zh', goc: 0.2, nhip: 'tang-toc', nhacNen: { loai: 'thu-vien', id: 'nhac-2', amLuong: 0.4 }, tenVideo: 'Kiểm luồng: link' })`);
  buoc('Tạo việc từ link', r1.ok, r1.loi);
  const s1 = await doi((s) => s.viec.some((v) => v.tieuDe === 'Kiểm luồng: link' && v.daTaiVe), 60);
  buoc('Việc link chạy xong và TỰ TẢI về', !!s1);
  const v1 = s1?.viec.find((v) => v.tieuDe === 'Kiểm luồng: link');
  buoc('Giữ đúng tuỳ chọn (nhịp tăng tốc, 20%)', v1?.nhip === 'tang-toc' && v1?.goc === 0.2);
  const thuVien = await js<Array<{ id: string; tieuDe: string; vi: string | null; coPhuDeVi: boolean }>>('window.ctlt.thuVien()');
  const muc = thuVien.find((m) => m.tieuDe === 'Kiểm luồng: link');
  buoc('Thư viện có mục mới (+ phụ đề Việt)', !!muc?.vi && !!muc?.coPhuDeVi, muc?.id);
  if (muc) {
    const dai = await napMedia(muc.vi!, 'video');
    buoc('Video thư viện phát được qua ctlt-media', dai > 20, `${dai.toFixed(1)} s`);
    const pd = await js<string | null>(`window.ctlt.docPhuDe(${JSON.stringify(muc.id)}, 'goc')`);
    buoc('Đọc phụ đề gốc', !!pd && pd.includes('-->'));
    const thoat = await napMedia('ctlt-media://thu-vien/..%2F..%2F..%2F/x.mp4', 'video');
    buoc('Chặn đường dẫn thoát khỏi thư viện', thoat < 0, String(thoat));
  }

  // Việc từ TỆP + "Nhạc của tôi" ⇒ tải lên 2 tệp ⇒ da-tai-len ⇒ chạy ⇒ tải về.
  await mt.datNhacTep(path.join(mt.thuMucDuLieu, 'mock-media', 'nhac-1.m4a'));
  await mt.taoTuTep(path.join(mt.thuMucDuLieu, 'mock-media', 'vi.mp4'));
  const s2 = await doi((s) => s.viec.some((v) => v.tieuDe === 'vi' && v.daTaiVe), 60);
  buoc('Việc từ tệp + nhạc của tôi: tải lên → xong → tải về', !!s2);

  // Link bị chặn ⇒ nút "Tải trên máy này" ⇒ yt-dlp thật được tải + kiểm SHA-256 + chạy (link giả nên yt-dlp báo lỗi).
  const r3 = await js<{ ok: boolean }>(`window.ctlt.taoViecLink('https://www.youtube.com/watch?v=chan-kiem', ${tc(", tenVideo: 'Kiểm luồng: bị chặn'")})`);
  const s3 = await doi((s) => s.viec.some((v) => v.tieuDe === 'Kiểm luồng: bị chặn' && v.coTheTaiTrenMay), 30);
  buoc('Link bị chặn ⇒ hiện "Tải trên máy này"', r3.ok && !!s3);
  const id3 = s3?.viec.find((v) => v.tieuDe === 'Kiểm luồng: bị chặn')?.id;
  if (id3 && process.env.CTLT_KIEM_YTDLP !== '0') {
    await js(`window.ctlt.taiTrenMay(${JSON.stringify(id3)})`);
    const s4 = await doi((s) => { const v = s.viec.find((x) => x.id === id3); return !!v && v.hienThi.nhan === 'Tải trên máy lỗi'; }, 240);
    const coYt = fs.existsSync(path.join(mt.thuMucDuLieu, 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'));
    buoc('yt-dlp chính thức tải + kiểm SHA-256 + chạy được', coYt, coYt ? '' : 'không thấy bin/yt-dlp');
    buoc('Link không tải được ⇒ báo lỗi rõ ràng, có Thử lại', !!s4?.viec.find((x) => x.id === id3)?.coTheThuLai,
      s4?.viec.find((x) => x.id === id3)?.hienThi.buoc.slice(0, 120));
  }
  if (id3) {
    const x = await js<{ ok: boolean }>(`window.ctlt.huyViec(${JSON.stringify(id3)})`);
    const s5 = await tt();
    buoc('Xoá việc', x.ok && !s5.viec.some((v) => v.id === id3));
  }

  console.log(hong ? `\n${hong} bước HỎNG` : '\nMọi bước đạt');
  return hong === 0;
}
