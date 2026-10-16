/**
 * ============================================================
 * ẢNH "LẠ" → ẢNH MODEL ĐỌC ĐƯỢC (16/10/2026)
 * ============================================================
 *
 * Người dùng 16/10/2026: chụp bằng iPhone (HEIC), kéo vào AI Code thì model
 * "không nhìn thấy" — phải nhờ chuyển tay sang JPG. Cổng chỉ nhận đúng bốn
 * loại: PNG, JPEG, GIF, WebP. Mọi thứ khác (HEIC/HEIF của iPhone, AVIF, TIFF
 * của máy scan, BMP, ICO, PSD) trước đây rơi xuống đường "file nhị phân".
 *
 * Đo thật 16/10 trên Electron của app (`nativeImage.createFromBuffer` lẫn
 * `createFromPath`): HEIC, AVIF, TIFF đều ra ảnh RỖNG 0×0. Nên phải nhờ hệ
 * điều hành giải mã:
 *   • macOS — `sips` (có sẵn trên mọi máy Mac; đọc HEIC/AVIF/TIFF/PSD/DNG).
 *   • Windows — WIC qua PowerShell (HEIC cần "HEIF Image Extensions" của
 *     Microsoft Store; Windows 11 thường có sẵn).
 *   • Linux — `heif-convert` hoặc ImageMagick nếu máy có.
 *
 * ⚠️ HƯỚNG XOAY. Ảnh dọc của điện thoại lưu điểm ảnh NẰM NGANG + một thẻ EXIF
 * "xoay 90°". `sips` giữ nguyên thẻ đó khi đổi sang JPEG (đo 16/10: HEIC thẻ
 * 6 → JPEG 800×600 thẻ 6), còn `nativeImage` thì BỎ QUA thẻ (đo: JPEG thẻ 6
 * vẫn ra 800×600). Để nguyên là model nhìn thấy ảnh nằm nghiêng — đọc chữ
 * trong ảnh chụp tài liệu sai hẳn. Nên ở đây tự XOAY ĐIỂM ẢNH theo thẻ rồi
 * mã hoá lại (JPEG ra không còn EXIF, nên không thể bị xoay lần hai).
 * Và `sips -r` KHÔNG dùng được cho việc này: đo 16/10, nó xoay điểm ảnh mà
 * vẫn giữ thẻ 6 ⇒ trình xem nào tôn trọng EXIF sẽ xoay thêm lần nữa.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { nativeImage, type NativeImage } from 'electron';
import { docHuongExif, LOAI_CONG_NHAN, nhanDangAnh, xoayTheoExif, type LoaiAnh } from '../../shared/dinhDangAnh';

const chay = promisify(execFile);

export { DUOI_ANH_LA, docHuongExif, LOAI_CONG_NHAN, nhanDangAnh, xoayTheoExif, type LoaiAnh } from '../../shared/dinhDangAnh';

/** Cạnh dài Anthropic co ảnh về trước khi đọc — to hơn chỉ tốn token, không nét thêm. */
export const CANH_DAI = 1568;

/** Trần byte ảnh ĐÃ chuẩn hoá. Ảnh 1568px JPEG thường 200–600KB, nên trần này hiếm khi chạm. */
const TRAN_BYTE_RA = 1_400_000;

/** Trần byte ảnh ĐẦU VÀO. RAW/TIFF máy scan có thể vài chục MB; quá mức này là bất thường. */
export const TRAN_BYTE_VAO = 80 * 1024 * 1024;

const MIME: Record<'png' | 'jpeg' | 'gif' | 'webp', string> = {
  png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
};

/** Kịch bản WIC cho Windows: đọc mọi định dạng có codec, xoay theo EXIF, ghi JPEG không metadata. */
const PS_WIC = [
  '$ErrorActionPreference=\'Stop\'',
  'Add-Type -AssemblyName PresentationCore',
  '$s=[IO.File]::OpenRead($env:CT_ANH_VAO)',
  'try { $d=[Windows.Media.Imaging.BitmapDecoder]::Create($s,\'IgnoreColorProfile\',\'OnLoad\') } finally { $s.Dispose() }',
  '$f=$d.Frames[0]; $o=1',
  'try { $q=$f.Metadata.GetQuery(\'System.Photo.Orientation\'); if ($q) { $o=[int]$q } } catch {}',
  '$g=0; if ($o -eq 3) { $g=180 } elseif ($o -eq 6) { $g=90 } elseif ($o -eq 8) { $g=270 }',
  '$src=$f; if ($g -ne 0) { $src=New-Object Windows.Media.Imaging.TransformedBitmap($f,(New-Object Windows.Media.RotateTransform($g))) }',
  '$e=New-Object Windows.Media.Imaging.JpegBitmapEncoder; $e.QualityLevel=92',
  '$e.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($src))',
  '$o2=[IO.File]::Create($env:CT_ANH_RA); try { $e.Save($o2) } finally { $o2.Dispose() }',
].join('; ');

/**
 * Nhờ hệ điều hành giải mã một ảnh mà Chromium/Electron không đọc được, ra JPEG.
 * Đường dẫn đi qua BIẾN MÔI TRƯỜNG chứ không ghép vào lệnh — tên file có dấu
 * nháy hay ký tự lạ không thể biến thành lệnh.
 */
async function giaiMaBangHeDieuHanh(b: Buffer, loai: LoaiAnh): Promise<Buffer> {
  const thuMuc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-anh-'));
  const vao = path.join(thuMuc, `vao.${loai === 'jpeg' ? 'jpg' : loai}`);
  const ra = path.join(thuMuc, 'ra.jpg');
  const hen = { timeout: 45_000, windowsHide: true, maxBuffer: 1024 * 1024 };
  try {
    await fs.writeFile(vao, b);
    if (process.platform === 'darwin') {
      await chay('/usr/bin/sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', vao, '--out', ra], hen);
    } else if (process.platform === 'win32') {
      await chay('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', PS_WIC], {
        ...hen, env: { ...process.env, CT_ANH_VAO: vao, CT_ANH_RA: ra },
      });
    } else {
      const thu: [string, string[]][] = [
        ...(loai === 'heic' || loai === 'avif' ? [['heif-convert', ['-q', '92', vao, ra]] as [string, string[]]] : []),
        ['magick', [vao + '[0]', '-auto-orient', '-quality', '92', ra]],
        ['convert', [vao + '[0]', '-auto-orient', '-quality', '92', ra]],
      ];
      let xong = false;
      for (const [lenh, thamSo] of thu) {
        try { await chay(lenh, thamSo, hen); xong = true; break; } catch { /* thử công cụ kế */ }
      }
      if (!xong) throw new Error('máy chưa có công cụ đọc định dạng này (cài libheif-examples hoặc imagemagick)');
    }
    const kq = await fs.readFile(ra);
    if (kq.length === 0) throw new Error('bộ chuyển đổi trả về file rỗng');
    return kq;
  } catch (e) {
    const goiY = process.platform === 'win32' && (loai === 'heic' || loai === 'avif')
      ? ` Windows cần cài "${loai === 'heic' ? 'HEIF Image Extensions + HEVC Video Extensions' : 'AV1 Video Extension'}" từ Microsoft Store.`
      : '';
    throw new Error(`Không chuyển được ảnh ${loai.toUpperCase()}: ${(e as Error).message.split('\n')[0]}.${goiY}`);
  } finally {
    await fs.rm(thuMuc, { recursive: true, force: true }).catch(() => undefined);
  }
}

export interface AnhChuan {
  data: Buffer;
  media: string;
  rong: number;
  cao: number;
  /** Định dạng gốc. */
  goc: LoaiAnh;
  /** `true` ⇒ đã đổi định dạng / thu nhỏ / xoay — tức `data` KHÔNG phải byte gốc. */
  daDoi: boolean;
}

/**
 * Đưa MỌI ảnh về dạng cổng nhận, đứng thẳng, cạnh dài ≤ `canhDai`.
 *
 * Ảnh đã chuẩn sẵn (PNG/JPEG/GIF/WebP, đứng thẳng, đủ nhỏ) đi NGUYÊN BYTE —
 * GIF/WebP động không bị đông cứng thành một khung hình.
 */
export async function chuanHoaAnh(
  b: Buffer,
  { canhDai = CANH_DAI, tranByte = TRAN_BYTE_RA }: { canhDai?: number; tranByte?: number } = {},
): Promise<AnhChuan> {
  const goc = nhanDangAnh(b);
  if (!goc) throw new Error('File không phải ảnh hoặc định dạng ảnh chưa hỗ trợ.');
  if (b.length > TRAN_BYTE_VAO) {
    throw new Error(`Ảnh nặng ${(b.length / 1048576).toFixed(0)}MB — quá trần ${TRAN_BYTE_VAO / 1048576}MB.`);
  }

  let anh: NativeImage = nativeImage.createFromBuffer(b);
  let huong = goc === 'jpeg' ? docHuongExif(b) : 1;

  if (anh.isEmpty()) {
    // Electron không giải mã được (HEIC/AVIF/TIFF/PSD…) ⇒ nhờ hệ điều hành.
    const jpg = await giaiMaBangHeDieuHanh(b, goc);
    huong = docHuongExif(jpg);
    anh = nativeImage.createFromBuffer(jpg);
    if (anh.isEmpty()) throw new Error(`Không đọc được ảnh ${goc.toUpperCase()} sau khi chuyển đổi.`);
  }

  const { width: w0, height: h0 } = anh.getSize();
  if (LOAI_CONG_NHAN.has(goc) && huong === 1 && Math.max(w0, h0) <= canhDai && b.length <= tranByte) {
    return { data: b, media: MIME[goc as keyof typeof MIME], rong: w0, cao: h0, goc, daDoi: false };
  }

  for (let canh = canhDai, lan = 0; lan < 5; lan += 1, canh = Math.round(canh * 0.75)) {
    let x = anh;
    const ti = Math.min(1, canh / Math.max(w0, h0));
    if (ti < 1) x = anh.resize({ width: Math.max(1, Math.round(w0 * ti)), height: Math.max(1, Math.round(h0 * ti)), quality: 'best' });
    if (huong !== 1) {
      const { width, height } = x.getSize();
      const r = xoayTheoExif(x.toBitmap(), width, height, huong);
      x = nativeImage.createFromBitmap(Buffer.from(r.diem.buffer, r.diem.byteOffset, r.diem.byteLength), { width: r.w, height: r.h });
    }
    // PNG gốc (ảnh chụp màn hình, sơ đồ) giữ PNG nếu vừa trần: JPEG làm nhoè chữ nhỏ.
    const png = goc === 'png' ? x.toPNG() : null;
    const data = png && png.length <= tranByte ? png : x.toJPEG(lan === 0 ? 88 : 80);
    if (data.length <= tranByte) {
      const s = x.getSize();
      return { data, media: data === png ? 'image/png' : 'image/jpeg', rong: s.width, cao: s.height, goc, daDoi: true };
    }
  }
  throw new Error('Ảnh quá lớn kể cả sau khi thu nhỏ.');
}
