/**
 * Tên thương hiệu trường trong app CT Courses (16/11/2026).
 *
 * App iOS "CT Courses" (`com.cuongthai.ctcourses`) gửi header `X-CT-App: ctcourses` ở mọi yêu cầu. Người dùng chốt: trong
 * app đó CHỈ đổi TÊN thương hiệu trường ("FPT University", "Đại học FPT", "FPTU", "FPT") thành "CuongThai Courses";
 * mã môn, giáo trình, slide, đề… GIỮ NGUYÊN. Web, app CuongThai, CT Language, CT Work, desktop không gửi header ⇒ KHÔNG đổi.
 *
 * Làm ở máy chủ (bọc `res.json`) để nội dung đổi mỗi kỳ vẫn tự cập nhật trong app mà không cần bản App Store mới.
 * Cùng luật với bên app: `ios-app/CuongThaiApp/Shared/NgonNguApp/ThuongHieuCTC.swift`.
 *
 * ⚠️ Không đụng: chuỗi trông như URL / tên miền / đường dẫn (flm.fpt.edu.vn, media key…), và các khoá định danh
 * (`url`, `href`, `slug`, `key`, `path`, `src`, `*Url`, `*Id`…). "FPTU" chỉ đổi khi đứng thành TỪ (nên `FPTU_Hola3`,
 * `fpt.edu.vn` giữ nguyên); "FPT" đứng riêng chỉ đổi trong ngữ cảnh trường — tên CÔNG TY (FPT Software, FPT.AI) giữ nguyên.
 */
import type { Request, Response, NextFunction } from 'express';

export const TEN_CTC = 'CuongThai Courses';

export function laAppCTCourses(req: Request): boolean {
  return String(req.headers['x-ct-app'] || '').toLowerCase() === 'ctcourses';
}

const MAU: Array<[RegExp, string]> = [
  [/FPT\s+University/g, TEN_CTC],
  [/Trường Đại học FPT|Đại học FPT|ĐH FPT/g, TEN_CTC],
  [/(?<![\p{L}\p{N}_./-])FPTU(?![\p{L}\p{N}_./-])/gu, TEN_CTC],
  // "FPT" đứng riêng CHỈ đổi trong ngữ cảnh TRƯỜNG ("sinh viên FPT", "đề FPT"…). Ngoài ngữ cảnh đó nó thường là CÔNG TY
  // (FPT Software, "Naver/LINE, FPT") — đổi thành "CuongThai Software" là bịa sự thật, nên giữ nguyên.
  [/((?:sinh viên|SV|học viên|giảng viên|trường|giáo trình|khung chương trình|đề thi|đề|kỳ thi|môn)\s+)FPT(?![\p{L}\p{N}_./-])/giu, `$1${TEN_CTC}`],
];

const KHOA_BO_QUA = /(^|_)(url|href|link|slug|key|path|src|email|token)$|Url$|Href$|Link$|Slug$|Key$|Path$|Src$|Id$|^id$|^code$|^courseCode$/;

function laDuongDan(s: string): boolean {
  return /^(https?:)?\/\//i.test(s) || /^[\w.-]+\.(com|vn|net|org|edu)(\/|$)/i.test(s) || /^\/?[\w-]+(\/[\w.-]+)+$/.test(s);
}

export function doiThuongHieu(s: string): string {
  if (!s.includes('FPT') && !s.includes('Đại học')) return s;
  if (laDuongDan(s)) return s;
  let kq = s;
  for (const [re, thay] of MAU) kq = kq.replace(re, thay);
  return kq;
}

function duyet(v: unknown, sau: number): unknown {
  if (typeof v === 'string') return doiThuongHieu(v);
  if (sau > 40 || v === null || typeof v !== 'object') return v;
  if (v instanceof Date || Buffer.isBuffer(v)) return v;
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) v[i] = duyet(v[i], sau + 1);
    return v;
  }
  const o = v as Record<string, unknown>;
  for (const k of Object.keys(o)) {
    if (KHOA_BO_QUA.test(k)) continue;
    o[k] = duyet(o[k], sau + 1);
  }
  return o;
}

/** Đổi tên thương hiệu trong một giá trị JSON (sửa tại chỗ, trả lại chính nó). */
export function doiThuongHieuJson<T>(body: T): T {
  return duyet(body, 0) as T;
}

/** Middleware: chỉ với yêu cầu từ app CT Courses. */
export function thuongHieuChoCTCourses(req: Request, res: Response, next: NextFunction): void {
  // Nhiều tuyến GET trả `Cache-Control: public` ⇒ bộ đệm trung gian phải tách bản app CT Courses khỏi bản web.
  res.vary('X-CT-App');
  if (!laAppCTCourses(req)) return next();
  const json = res.json.bind(res);
  res.json = ((body: unknown) => {
    try {
      // Bản sao sâu: tránh sửa đối tượng đang nằm trong bộ đệm của máy chủ (cache trong RAM dùng chung với web).
      const banSao = body === undefined ? body : JSON.parse(JSON.stringify(body));
      return json(doiThuongHieuJson(banSao));
    } catch {
      return json(body);
    }
  }) as Response['json'];
  next();
}
