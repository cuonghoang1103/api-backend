/**
 * Vở viết tay (iPad · PencilKit) — đồng bộ cây + nét vẽ.
 * ─────────────────────────────────────────────────────────────────────
 * MỘT TRANG GIẤY = MỘT `Note`. Lý do dùng lại `Note` thay vì dựng bảng
 * riêng: nó đã mang sẵn `sortOrder`, lịch sử `NoteVersion`, thùng rác 30
 * ngày, chia sẻ và đính kèm — dựng bảng mới là bỏ hết rồi viết lại.
 *
 * Nét vẽ KHÔNG đi qua máy chủ này. App PUT thẳng lên R2 bằng URL ký sẵn,
 * rồi gọi `xacNhanNet` để máy chủ HEAD kiểm object đã lên thật chưa. Vì
 * thế một trang 2MB không ăn RAM của API và không đụng trần 100MB của
 * proxy Cloudflare.
 */
import { prisma } from '../config/database.js';
import {
  getSignedUploadUrl,
  headObject,
  deleteObjects,
  buildPublicUrl,
} from '../config/r2.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// ─── Giới hạn ────────────────────────────────────────────────────────────

/** Một trang viết dày đo thật ~100-150KB; 8MB là trần rộng rãi cho trang
 *  có chèn ảnh, đủ chặn một client hỏng đẩy lên cả gigabyte. */
const TRAN_NET_BYTE = 8 * 1024 * 1024;
const TRAN_ANH_BYTE = 2 * 1024 * 1024;

/** Trần một lượt đồng bộ cây. Người dùng nhiều nhất cũng chỉ vài nghìn
 *  trang; con số này chặn payload rác chứ không chặn người dùng thật. */
const TRAN_MON = 200;
const TRAN_CUON = 500;
const TRAN_TRANG = 2000;

const GIAY_HOP_LE = new Set([
  'trang', 'keNgang', 'oLy', 'cham', 'cornell', 'genkou', 'nhacLy',
]);
const HUONG_HOP_LE = new Set(['doc', 'ngang']);

// UUID do máy sinh. Ràng đúng hình dạng vì nó đi thẳng vào khoá R2.
const UUID_RE = /^[0-9a-fA-F-]{16,64}$/;

// ─── Kiểu dữ liệu đi qua dây ─────────────────────────────────────────────

export interface MonVao {
  clientId: string;
  ten: string;
  emoji?: string | null;
  mauHex?: number | null;
  thuTu?: number;
  ghim?: boolean;
  cuons: CuonVao[];
}
export interface CuonVao {
  clientId: string;
  ten: string;
  mauBiaHex?: number | null;
  giayMacDinh?: string | null;
  thuTu?: number;
  ghim?: boolean;
  trangs: TrangVao[];
}
export interface TrangVao {
  clientId: string;
  thuTu: number;
  tenChuong?: string | null;
  giay?: string | null;
  huong?: string | null;
  /** Phiên bản nét vẽ mà MÁY đang dựa trên. Máy chủ so với `inkVersion`
   *  của nó để biết có ai ghi chen vào giữa không. */
  phienBanNet?: number;
  /** Nền tài liệu: khoá R2 (đánh theo sha256 nội dung), loại, và trang thứ
   *  mấy trong PDF. Máy đẩy tệp lên trước qua `xinDuongNen`, rồi lượt đồng
   *  bộ cây này chỉ mang con trỏ. */
  nenKhoa?: string | null;
  nenLoai?: string | null;
  nenTrang?: number | null;
}

export interface TrangRa {
  clientId: string;
  id: number;
  inkVersion: number;
  inkStrokeCount: number;
  /** URL công khai của tệp nét vẽ, `null` khi trang chưa từng được đẩy. */
  inkUrl: string | null;
  previewUrl: string | null;
  inkUpdatedAt: string | null;
  /** `true` khi máy chủ đang giữ bản MỚI HƠN bản máy dựa trên ⇒ máy phải
   *  tải về và hợp nhất TRƯỚC khi đẩy, không được ghi đè. */
  xungDot: boolean;
  /** Nền tài liệu để máy khác tải về. `null` = trang không có nền. */
  nenUrl: string | null;
  nenLoai: string | null;
  nenTrang: number;
}

// ─── Tiện ích ────────────────────────────────────────────────────────────

function chuoiSach(v: unknown, max: number, ten: string): string {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) throw new AppError(`${ten} không được để trống`, 400, 'INVALID_INPUT');
  return s.slice(0, max);
}

function uuidSach(v: unknown, ten: string): string {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!UUID_RE.test(s)) {
    throw new AppError(`${ten} không hợp lệ`, 400, 'INVALID_CLIENT_ID');
  }
  return s;
}

function mauSangHex(mau: unknown): string | null {
  const n = Number(mau);
  if (!Number.isInteger(n) || n < 0 || n > 0xffffff) return null;
  return '#' + n.toString(16).padStart(6, '0');
}

/**
 * Khoá R2 của một trang. MANG SỐ PHIÊN BẢN trong tên.
 *
 * ⚠️ Không ghi đè cùng một khoá: ảnh xem trước đi qua CDN, mà ghi đè thì
 * người xem trên web còn thấy bản cũ cho tới khi cache hết hạn — đúng cái
 * bẫy `proxy_hide_header Cache-Control` đã dạy một lần. Tên có phiên bản
 * thì mỗi lần lưu là một URL mới, không đường nào trả về bản cũ.
 */
function khoaNet(userId: number, noteId: number, phienBan: number, duoi: 'drawing' | 'png'): string {
  return `notes/u${userId}/ink/${noteId}/v${phienBan}.${duoi}`;
}

/** Khoá nền đánh theo NỘI DUNG, không theo trang.
 *
 * Một PDF nhập thành 8 trang vở thì 8 `Note` cùng trỏ vào MỘT object; nhập
 * lại đúng tệp đó lần nữa cũng không tốn thêm byte nào. Đây là lý do khoá
 * mang sha256 chứ không mang `noteId`. */
function khoaNen(userId: number, sha: string, duoi: string): string {
  return `notes/u${userId}/bg/${sha}.${duoi}`;
}

function khoaNenCuaNguoiNay(key: string, userId: number): boolean {
  return key.startsWith(`notes/u${userId}/bg/`) && !key.includes('..');
}

/** Khoá có thuộc về đúng người gọi không — chặn một người ký URL đè lên vở
 *  của người khác bằng cách gửi `key` tự chế. */
function khoaCuaNguoiNay(key: string, userId: number, noteId: number): boolean {
  return key.startsWith(`notes/u${userId}/ink/${noteId}/`) && !key.includes('..');
}

// ─── 1. Đồng bộ CÂY (môn → cuốn → trang) ─────────────────────────────────

/**
 * Nhận cây từ máy, trả về cây đã có id máy chủ.
 *
 * Idempotent theo `clientId`: gọi lại đúng payload đó lần thứ hai không
 * tạo thêm gì. Đây là điều khiến một lượt đẩy bị mạng cắt giữa chừng thử
 * lại được mà vở không tự nhân đôi.
 *
 * ⚠️ KHÔNG xoá gì ở đây. Máy gửi lên những thứ nó có; thứ máy chủ có mà
 * máy không gửi có thể là trang một máy KHÁC vừa thêm, chứ không phải
 * trang người dùng vừa xoá. Xoá là lệnh riêng, tường minh.
 */
export async function dongBoCay(
  userId: number,
  mons: MonVao[],
): Promise<{ mons: Array<{ clientId: string; id: number; cuons: Array<{ clientId: string; id: number; trangs: TrangRa[] }> }> }> {
  if (!Array.isArray(mons)) throw new AppError('Thiếu danh sách môn', 400, 'INVALID_INPUT');
  if (mons.length > TRAN_MON) throw new AppError(`Quá ${TRAN_MON} môn trong một lượt`, 400, 'TOO_MANY');

  const tongCuon = mons.reduce((n, m) => n + (m.cuons?.length ?? 0), 0);
  const tongTrang = mons.reduce(
    (n, m) => n + (m.cuons ?? []).reduce((k, c) => k + (c.trangs?.length ?? 0), 0), 0);
  if (tongCuon > TRAN_CUON) throw new AppError(`Quá ${TRAN_CUON} cuốn vở trong một lượt`, 400, 'TOO_MANY');
  if (tongTrang > TRAN_TRANG) throw new AppError(`Quá ${TRAN_TRANG} trang trong một lượt`, 400, 'TOO_MANY');

  const ketQua: Array<{ clientId: string; id: number; cuons: Array<{ clientId: string; id: number; trangs: TrangRa[] }> }> = [];

  for (const mon of mons) {
    const monClient = uuidSach(mon.clientId, 'clientId của môn');
    const monRow = await prisma.noteSubject.upsert({
      where: { uk_note_subject_client: { userId, clientId: monClient } },
      create: {
        userId, clientId: monClient,
        name: chuoiSach(mon.ten, 150, 'Tên môn'),
        emoji: typeof mon.emoji === 'string' ? mon.emoji.slice(0, 20) : null,
        color: mauSangHex(mon.mauHex),
        sortOrder: Number.isInteger(mon.thuTu) ? mon.thuTu! : 0,
        isPinned: mon.ghim === true,
      },
      update: {
        name: chuoiSach(mon.ten, 150, 'Tên môn'),
        emoji: typeof mon.emoji === 'string' ? mon.emoji.slice(0, 20) : null,
        color: mauSangHex(mon.mauHex),
        sortOrder: Number.isInteger(mon.thuTu) ? mon.thuTu! : 0,
        isPinned: mon.ghim === true,
      },
    });

    const cuonsRa: Array<{ clientId: string; id: number; trangs: TrangRa[] }> = [];

    for (const cuon of mon.cuons ?? []) {
      const cuonClient = uuidSach(cuon.clientId, 'clientId của cuốn vở');
      const giayCuon = typeof cuon.giayMacDinh === 'string' && GIAY_HOP_LE.has(cuon.giayMacDinh)
        ? cuon.giayMacDinh : null;
      const cuonRow = await prisma.noteChapter.upsert({
        where: { uk_note_chapter_client: { userId, clientId: cuonClient } },
        create: {
          userId, subjectId: monRow.id, clientId: cuonClient,
          title: chuoiSach(cuon.ten, 200, 'Tên cuốn vở'),
          coverColor: mauSangHex(cuon.mauBiaHex),
          paperKind: giayCuon,
          sortOrder: Number.isInteger(cuon.thuTu) ? cuon.thuTu! : 0,
          isPinned: cuon.ghim === true,
        },
        update: {
          // `subjectId` CÓ trong update: người dùng kéo cuốn vở sang môn
          // khác thì lượt đồng bộ sau phải mang nó theo.
          subjectId: monRow.id,
          title: chuoiSach(cuon.ten, 200, 'Tên cuốn vở'),
          coverColor: mauSangHex(cuon.mauBiaHex),
          paperKind: giayCuon,
          sortOrder: Number.isInteger(cuon.thuTu) ? cuon.thuTu! : 0,
          isPinned: cuon.ghim === true,
        },
      });

      const trangsRa: TrangRa[] = [];
      for (const trang of cuon.trangs ?? []) {
        const trangClient = uuidSach(trang.clientId, 'clientId của trang');
        const giay = typeof trang.giay === 'string' && GIAY_HOP_LE.has(trang.giay) ? trang.giay : null;
        const huong = typeof trang.huong === 'string' && HUONG_HOP_LE.has(trang.huong) ? trang.huong : null;
        const tieuDe = typeof trang.tenChuong === 'string' && trang.tenChuong.trim()
          ? trang.tenChuong.trim().slice(0, 300)
          : `Trang ${(Number(trang.thuTu) || 0) + 1}`;

        const trangRow = await prisma.note.upsert({
          where: { uk_note_client: { userId, clientId: trangClient } },
          create: {
            userId, subjectId: monRow.id, chapterId: cuonRow.id, clientId: trangClient,
            title: tieuDe,
            sortOrder: Number.isInteger(trang.thuTu) ? trang.thuTu! : 0,
            paperKind: giay, paperOrient: huong,
            ...nenGhi(trang, userId),
          },
          update: {
            subjectId: monRow.id, chapterId: cuonRow.id,
            title: tieuDe,
            sortOrder: Number.isInteger(trang.thuTu) ? trang.thuTu! : 0,
            paperKind: giay, paperOrient: huong,
            ...nenGhi(trang, userId),
            // ⚠️ KHÔNG đụng vào `inkKey`/`inkVersion` ở đây. Đồng bộ cây chỉ
            // nói về THỨ TỰ và TÊN; nét vẽ đi đường riêng qua `xacNhanNet`.
            // Gộp hai việc là một lượt đồng bộ tên trang sẽ xoá mất nét.
          },
          select: {
            id: true, clientId: true, inkKey: true, inkPreviewKey: true,
            inkVersion: true, inkStrokeCount: true, inkUpdatedAt: true,
            bgKey: true, bgKind: true, bgPage: true,
          },
        });

        trangsRa.push({
          clientId: trangClient,
          id: trangRow.id,
          inkVersion: trangRow.inkVersion,
          inkStrokeCount: trangRow.inkStrokeCount,
          inkUrl: trangRow.inkKey ? buildPublicUrl(trangRow.inkKey) : null,
          previewUrl: trangRow.inkPreviewKey ? buildPublicUrl(trangRow.inkPreviewKey) : null,
          inkUpdatedAt: trangRow.inkUpdatedAt?.toISOString() ?? null,
          xungDot: (trang.phienBanNet ?? 0) < trangRow.inkVersion,
          nenUrl: trangRow.bgKey ? buildPublicUrl(trangRow.bgKey) : null,
          nenLoai: trangRow.bgKind,
          nenTrang: trangRow.bgPage,
        });
      }

      cuonsRa.push({ clientId: cuonClient, id: cuonRow.id, trangs: trangsRa });
    }

    ketQua.push({ clientId: monClient, id: monRow.id, cuons: cuonsRa });
  }

  return { mons: ketQua };
}

/**
 * Phần nền để ghi vào `Note`.
 *
 * ⚠️ Trang KHÔNG gửi nền thì trả về `{}` — KHÔNG ghi `null` đè lên. Máy cũ
 * chưa biết trường này vẫn đồng bộ tên/thứ tự bình thường, và một lượt đồng
 * bộ từ máy đó sẽ không xoá mất nền máy khác vừa đặt.
 *
 * Gửi chuỗi rỗng mới là lệnh GỠ nền — phân biệt rõ "không nói gì" với
 * "bảo bỏ đi".
 */
function nenGhi(trang: TrangVao, userId: number):
  { bgKey?: string | null; bgKind?: string | null; bgPage?: number } {
  if (trang.nenKhoa === undefined || trang.nenKhoa === null) return {};
  const khoa = String(trang.nenKhoa);
  if (!khoa) return { bgKey: null, bgKind: null, bgPage: 0 };
  if (!khoaNenCuaNguoiNay(khoa, userId)) {
    throw new AppError('Khoá nền không hợp lệ', 400, 'INVALID_KEY');
  }
  const loai = trang.nenLoai === 'pdf' || trang.nenLoai === 'img' ? trang.nenLoai : null;
  if (!loai) throw new AppError('Loại nền không hợp lệ', 400, 'INVALID_INPUT');
  const so = Number(trang.nenTrang);
  return { bgKey: khoa, bgKind: loai, bgPage: Number.isInteger(so) && so >= 0 ? so : 0 };
}

// ─── 1b. Xin URL đẩy NỀN tài liệu ────────────────────────────────────────

/** Trần một tệp nền. PDF giáo trình một chương thường 0,5-2MB; 25MB đủ rộng
 *  cho bản quét ảnh, và chặn một client hỏng đẩy cả cuốn sách lên. */
const TRAN_NEN_BYTE = 25 * 1024 * 1024;

const DUOI_NEN_HOP_LE: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  png: 'image/png',
};

/**
 * Xin đường đẩy một tệp nền, đánh khoá theo sha256 nội dung.
 *
 * Trả `daCo: true` khi object đã nằm sẵn trên R2 — máy khỏi đẩy lại. Đây là
 * chỗ khiến nhập một PDF thành 20 trang chỉ tốn MỘT lượt tải lên, và nhập
 * lại đúng tệp đó lần sau tốn KHÔNG lượt nào.
 */
export async function xinDuongNen(
  userId: number,
  sha256: string,
  duoi: string,
  soByte: number,
): Promise<{ khoa: string; url: string | null; daCo: boolean; expiresIn: number }> {
  if (!config.r2.enabled) {
    throw new AppError('Máy chủ chưa cấu hình kho tệp', 503, 'STORAGE_UNAVAILABLE');
  }
  const sha = String(sha256 || '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(sha)) {
    throw new AppError('sha256 không hợp lệ', 400, 'INVALID_INPUT');
  }
  const d = String(duoi || '').toLowerCase();
  const mime = DUOI_NEN_HOP_LE[d];
  if (!mime) throw new AppError('Chỉ nhận pdf, jpg, png', 400, 'INVALID_INPUT');

  // Chặn TRƯỚC khi ký URL. Chặn sau thì tệp đã nằm trên R2 rồi mới bị từ
  // chối — tốn băng thông và để lại rác phải đi dọn. Máy có thể khai dối
  // kích thước, nhưng đây là chốt chặn nhầm lẫn, không phải chốt chống
  // tấn công; trần dung lượng thật do chính sách bucket giữ.
  const n = Number(soByte);
  if (!Number.isFinite(n) || n <= 0) {
    throw new AppError('Thiếu kích thước tệp', 400, 'INVALID_INPUT');
  }
  if (n > TRAN_NEN_BYTE) {
    throw new AppError(
      `Tệp nền quá ${Math.round(TRAN_NEN_BYTE / 1024 / 1024)}MB`, 413, 'FILE_TOO_LARGE');
  }

  const khoa = khoaNen(userId, sha, d);
  const co = await headObject(khoa);
  if (co) return { khoa, url: null, daCo: true, expiresIn: 0 };

  const url = await getSignedUploadUrl(khoa, mime, 900);
  return { khoa, url, daCo: false, expiresIn: 900 };
}

// ─── 2. Xin URL đẩy nét vẽ ───────────────────────────────────────────────

export async function xinDuongDayNet(
  userId: number,
  noteId: number,
  coAnhXemTruoc: boolean,
): Promise<{ inkKey: string; inkUrl: string; previewKey: string | null; previewUrl: string | null; phienBanMoi: number; expiresIn: number }> {
  if (!config.r2.enabled) {
    throw new AppError('Máy chủ chưa cấu hình kho tệp', 503, 'STORAGE_UNAVAILABLE');
  }
  const trang = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
    select: { id: true, inkVersion: true },
  });
  if (!trang) throw new AppError('Không tìm thấy trang', 404, 'NOTE_NOT_FOUND');

  const phienBanMoi = trang.inkVersion + 1;
  const inkKey = khoaNet(userId, noteId, phienBanMoi, 'drawing');
  const previewKey = coAnhXemTruoc ? khoaNet(userId, noteId, phienBanMoi, 'png') : null;

  // ⚠️ `contentType` được KÝ (xem `getSignedUploadUrl`), nên app PHẢI gửi
  // đúng chuỗi này ở header `Content-Type` — lệch một ký tự là R2 trả 403.
  const [inkUrl, previewUrl] = await Promise.all([
    getSignedUploadUrl(inkKey, 'application/octet-stream', 900),
    previewKey ? getSignedUploadUrl(previewKey, 'image/png', 900) : Promise.resolve(null),
  ]);

  return { inkKey, inkUrl, previewKey, previewUrl, phienBanMoi, expiresIn: 900 };
}

// ─── 3. Xác nhận đã đẩy xong ─────────────────────────────────────────────

/**
 * Chốt một lượt đẩy: kiểm object đã lên R2 thật, rồi mới ghi con trỏ.
 *
 * ⚠️ Phải HEAD chứ không tin lời client. Client báo "đã lên" mà thật ra
 * PUT hỏng thì bản ghi trỏ vào một khoá rỗng, và trang vở mở ra trắng
 * trơn — mất bài mà không có lỗi nào để thấy.
 *
 * Xung đột (`phienBanDuaTren` khác `inkVersion` hiện tại) thì TỪ CHỐI và
 * trả về bản máy chủ đang giữ. Máy hợp nhất rồi đẩy lại.
 */
export async function xacNhanNet(
  userId: number,
  noteId: number,
  data: { inkKey: string; previewKey?: string | null; phienBanDuaTren: number; soNet: number },
): Promise<{ inkVersion: number; inkUrl: string; previewUrl: string | null }> {
  const { inkKey } = data;
  if (typeof inkKey !== 'string' || !khoaCuaNguoiNay(inkKey, userId, noteId)) {
    throw new AppError('Khoá tệp không hợp lệ', 400, 'INVALID_KEY');
  }
  const previewKey = typeof data.previewKey === 'string' && data.previewKey ? data.previewKey : null;
  if (previewKey && !khoaCuaNguoiNay(previewKey, userId, noteId)) {
    throw new AppError('Khoá ảnh xem trước không hợp lệ', 400, 'INVALID_KEY');
  }

  const trang = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
    select: { id: true, inkVersion: true, inkKey: true, inkPreviewKey: true, inkStrokeCount: true },
  });
  if (!trang) throw new AppError('Không tìm thấy trang', 404, 'NOTE_NOT_FOUND');

  const duaTren = Number(data.phienBanDuaTren);
  if (!Number.isInteger(duaTren) || duaTren < 0) {
    throw new AppError('Thiếu phiên bản gốc', 400, 'INVALID_BASE_VERSION');
  }
  if (duaTren !== trang.inkVersion) {
    throw new AppError(
      'Máy khác đã ghi trang này trong lúc bạn viết — tải về và hợp nhất trước',
      409,
      'INK_CONFLICT',
      {
        inkVersion: trang.inkVersion,
        inkStrokeCount: trang.inkStrokeCount,
        inkUrl: trang.inkKey ? buildPublicUrl(trang.inkKey) : null,
      },
    );
  }

  const head = await headObject(inkKey);
  if (!head) throw new AppError('Chưa thấy tệp nét vẽ trên kho — lượt đẩy hỏng?', 404, 'OBJECT_NOT_FOUND');
  if (head.size > TRAN_NET_BYTE) {
    throw new AppError('Trang vượt giới hạn 8MB', 400, 'FILE_TOO_LARGE');
  }
  if (previewKey) {
    const headAnh = await headObject(previewKey);
    // Ảnh xem trước KHÔNG bắt buộc: thiếu nó thì web mất hình, còn nét vẽ
    // vẫn nguyên. Chặn cả lượt đẩy vì một tấm PNG là đánh đổi sai.
    if (!headAnh) {
      logger.warn(`[vo] thiếu ảnh xem trước cho trang ${noteId}, vẫn nhận nét vẽ`);
    } else if (headAnh.size > TRAN_ANH_BYTE) {
      throw new AppError('Ảnh xem trước quá lớn', 400, 'FILE_TOO_LARGE');
    }
  }

  const soNet = Number.isInteger(data.soNet) && data.soNet >= 0 ? data.soNet : 0;
  const phienBanMoi = trang.inkVersion + 1;

  const capNhat = await prisma.note.update({
    where: { id: noteId },
    data: {
      inkKey,
      inkPreviewKey: previewKey ?? trang.inkPreviewKey,
      inkVersion: phienBanMoi,
      inkStrokeCount: soNet,
      inkUpdatedAt: new Date(),
    },
    select: { inkVersion: true, inkKey: true, inkPreviewKey: true },
  });

  // Dọn bản CŨ HƠN MỘT BẬC. Giữ lại đúng bản liền trước làm lưới an toàn:
  // nếu lượt đẩy này hoá ra hỏng, bản trước vẫn còn để cứu.
  if (trang.inkVersion >= 1) {
    const cu = trang.inkVersion - 1;
    if (cu >= 1) {
      void deleteObjects([
        khoaNet(userId, noteId, cu, 'drawing'),
        khoaNet(userId, noteId, cu, 'png'),
      ]).catch((e) => logger.warn(`[vo] dọn bản cũ v${cu} của trang ${noteId} hỏng: ${String(e)}`));
    }
  }

  return {
    inkVersion: capNhat.inkVersion,
    inkUrl: buildPublicUrl(capNhat.inkKey!),
    previewUrl: capNhat.inkPreviewKey ? buildPublicUrl(capNhat.inkPreviewKey) : null,
  };
}

// ─── 3b. Dọn tệp R2 của những trang sắp bị xoá hẳn ───────────────────────

/**
 * Trả về danh sách khoá R2 cần xoá cho một mẻ trang sắp bị purge.
 *
 * ⚠️ Phải gọi TRƯỚC khi xoá hàng trong DB. Xoá hàng xong thì `inkKey` và
 * `bgKey` biến mất cùng nó, và object trên R2 thành mồ côi VĨNH VIỄN — không
 * còn gì trỏ tới để mà tìm ra. Trước 18/09/2026 job dọn thùng rác làm đúng
 * theo thứ tự sai đó: nó chỉ nhả `noteAttachment`, còn nét vẽ + ảnh xem
 * trước + nền PDF nằm lại R2 mãi mãi.
 *
 * ⚠️ NỀN dùng CHUNG: khoá đánh theo sha256 nội dung nên một PDF nhập 20
 * trang là 20 hàng cùng trỏ một object. Chỉ được xoá khi KHÔNG CÒN trang nào
 * sống trỏ vào nó — xoá theo trang là 19 trang còn lại mất nền.
 */
export async function khoaCanDonChoTrang(
  noteIds: number[],
): Promise<string[]> {
  if (noteIds.length === 0) return [];

  const trangs = await prisma.note.findMany({
    where: { id: { in: noteIds } },
    select: { id: true, userId: true, inkKey: true, inkPreviewKey: true,
              inkVersion: true, bgKey: true },
  });

  const khoa = new Set<string>();
  const nenUngVien = new Set<string>();

  for (const t of trangs) {
    if (t.inkKey) khoa.add(t.inkKey);
    if (t.inkPreviewKey) khoa.add(t.inkPreviewKey);
    // Bản liền trước vẫn còn trên R2 (xem lưới an toàn ở `xacNhanNet`).
    const cu = t.inkVersion - 1;
    if (cu >= 1) {
      khoa.add(khoaNet(t.userId, t.id, cu, 'drawing'));
      khoa.add(khoaNet(t.userId, t.id, cu, 'png'));
    }
    if (t.bgKey) nenUngVien.add(t.bgKey);
  }

  if (nenUngVien.size > 0) {
    // Trang nào KHÁC mẻ này còn trỏ vào cùng khoá nền thì giữ lại object.
    const conDung = await prisma.note.findMany({
      where: { bgKey: { in: [...nenUngVien] }, id: { notIn: noteIds } },
      select: { bgKey: true },
      distinct: ['bgKey'],
    });
    const giuLai = new Set(conDung.map((r) => r.bgKey!).filter(Boolean));
    for (const k of nenUngVien) if (!giuLai.has(k)) khoa.add(k);
  }

  return [...khoa];
}

// ─── 4. Kéo cây về (máy thứ hai, hoặc cài lại app) ───────────────────────

export async function layCayVo(userId: number) {
  const mons = await prisma.noteSubject.findMany({
    where: { userId, clientId: { not: null } },
    orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }],
    select: {
      id: true, clientId: true, name: true, emoji: true, color: true,
      sortOrder: true, isPinned: true, updatedAt: true,
      chapters: {
        where: { clientId: { not: null } },
        orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }],
        select: {
          id: true, clientId: true, title: true, coverColor: true,
          paperKind: true, sortOrder: true, isPinned: true, updatedAt: true,
        },
      },
    },
  });

  // Lấy trang theo MỘT truy vấn phẳng rồi gom trong bộ nhớ, thay vì lồng
  // `notes` vào từng chương: người dùng có 50 cuốn là 50 truy vấn con, và
  // Prisma dựng chúng thành 50 lượt đi lại với Postgres.
  const trangs = await prisma.note.findMany({
    where: { userId, clientId: { not: null }, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true, clientId: true, chapterId: true, title: true, sortOrder: true,
      paperKind: true, paperOrient: true, inkKey: true, inkPreviewKey: true,
      inkVersion: true, inkStrokeCount: true, inkUpdatedAt: true,
      bgKey: true, bgKind: true, bgPage: true,
    },
  });

  const theoChuong = new Map<number, typeof trangs>();
  for (const t of trangs) {
    if (t.chapterId == null) continue;
    const ds = theoChuong.get(t.chapterId);
    if (ds) ds.push(t); else theoChuong.set(t.chapterId, [t]);
  }

  return {
    mons: mons.map((m) => ({
      clientId: m.clientId!,
      id: m.id,
      ten: m.name,
      emoji: m.emoji,
      mauHex: m.color,
      thuTu: m.sortOrder,
      ghim: m.isPinned,
      suaLuc: m.updatedAt.toISOString(),
      cuons: m.chapters.map((c) => ({
        clientId: c.clientId!,
        id: c.id,
        ten: c.title,
        mauBiaHex: c.coverColor,
        giayMacDinh: c.paperKind,
        thuTu: c.sortOrder,
        ghim: c.isPinned,
        suaLuc: c.updatedAt.toISOString(),
        trangs: (theoChuong.get(c.id) ?? []).map((t) => ({
          clientId: t.clientId!,
          id: t.id,
          thuTu: t.sortOrder,
          tenChuong: t.title,
          giay: t.paperKind,
          huong: t.paperOrient,
          inkVersion: t.inkVersion,
          inkStrokeCount: t.inkStrokeCount,
          inkUrl: t.inkKey ? buildPublicUrl(t.inkKey) : null,
          previewUrl: t.inkPreviewKey ? buildPublicUrl(t.inkPreviewKey) : null,
          inkUpdatedAt: t.inkUpdatedAt?.toISOString() ?? null,
          nenUrl: t.bgKey ? buildPublicUrl(t.bgKey) : null,
          nenLoai: t.bgKind,
          nenTrang: t.bgPage,
        })),
      })),
    })),
  };
}

// ─── 5. Xoá (tường minh, không suy ra từ việc thiếu trong payload) ───────

export async function xoaTrangVo(userId: number, clientIds: string[]): Promise<{ daXoa: number }> {
  if (!Array.isArray(clientIds) || clientIds.length === 0) return { daXoa: 0 };
  const ids = clientIds.slice(0, 500).map((v) => uuidSach(v, 'clientId'));
  // Xoá MỀM: `Note` đã có thùng rác 30 ngày sẵn, dùng lại nó thay vì xoá
  // thật — một cú chạm nhầm trên iPad không được phép làm mất buổi học.
  const r = await prisma.note.updateMany({
    where: { userId, clientId: { in: ids }, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  return { daXoa: r.count };
}

export async function xoaCuonVo(userId: number, clientId: string): Promise<{ daXoa: number }> {
  const id = uuidSach(clientId, 'clientId');
  const cuon = await prisma.noteChapter.findFirst({
    where: { userId, clientId: id }, select: { id: true },
  });
  if (!cuon) return { daXoa: 0 };
  const r = await prisma.note.updateMany({
    where: { userId, chapterId: cuon.id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  await prisma.noteChapter.delete({ where: { id: cuon.id } }).catch(() => {
    // Chương còn ghi chú CŨ (không thuộc Vở) thì để nguyên — xoá cuốn vở
    // không được phép kéo theo ghi chú người dùng gõ trên web.
  });
  return { daXoa: r.count };
}

export const _chiDeKiemThu = { khoaNet, khoaCuaNguoiNay, mauSangHex };
