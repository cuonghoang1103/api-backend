/**
 * Ghi nhanh · Sổ lệnh · Sổ tay khoá học · Nhập Markdown
 * ────────────────────────────────────────────────────────────────────────────
 * Tất cả đều dựng trên model Notes CÓ SẴN — không bảng mới, không migration:
 *
 *   📥 Hộp thư        = NoteSubject, clientId 'he-thong:hop-thu'
 *   ⌨️ Sổ lệnh        = Note trong Hộp thư, clientId 'he-thong:so-lenh'
 *   📘 <tên khoá>     = NoteSubject, clientId 'khoa:<slug>'
 *     └ một trang/bài = Note, clientId 'khoa-bai:<lessonId>'
 *
 * Vì sao nhận diện bằng `clientId` chứ không bằng tên: người dùng đổi tên
 * "📥 Hộp thư" thành "Inbox" thì nó vẫn là hộp thư. Và `clientId` có sẵn
 * UNIQUE (userId, clientId) trên cả `note_subjects` lẫn `notes` (thêm cho đồng
 * bộ Vở iPad) — nên "tạo nếu chưa có" chống trùng được bằng chính CSDL: hai
 * request cùng lúc thì một cái INSERT thành công, cái kia nhận P2002 rồi đọc
 * lại hàng vừa tạo. Không cần khoá, không cần ON CONFLICT.
 *
 * Trang mỗi bài dùng `lessonId` (bất biến) chứ không tìm theo tiêu đề: đổi tên
 * bài, đổi ngôn ngữ hiển thị hay người dùng tự sửa tiêu đề trang đều không đẻ
 * ra trang thứ hai.
 *
 * Mọi hàm nhận `userId` từ `req.userId` và mọi truy vấn đều lọc theo nó.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { updateNote } from './notes.service.js';
import {
  docToHtml, htmlToDoc, markdownToDoc, markdownToHtml, titleFromMarkdown, findTemplate, NOTE_TEMPLATES,
  themDongSoLenh, sapXepSoLenh, docSoLenh, matTruocThe, doanLuuBlocks, docDoanDaLuu,
  type TiptapDoc, type DongLenh,
} from './ghiNhanhNoiDung.js';

export const HOP_THU_CLIENT_ID = 'he-thong:hop-thu';
export const HOP_THU_TEN = '📥 Hộp thư';
export const SO_LENH_CLIENT_ID = 'he-thong:so-lenh';

const MAX_TEXT = 20_000;
export const MAX_MD_BYTES = 512 * 1024;

function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';
}

function str(v: unknown, max: number, label: string, required = false): string {
  const s = typeof v === 'string' ? v.replace(/\r\n?/g, '\n') : '';
  const t = s.trim();
  if (required && !t) throw new AppError(`${label} không được để trống`, 400, 'INVALID_INPUT');
  if (s.length > max) throw new AppError(`${label} quá dài (tối đa ${max} ký tự)`, 400, 'INVALID_INPUT');
  return t;
}

/** Tiêu đề khoá/bài có thể ở dạng "EN|||VI" — lấy phần tiếng Việt. */
function tenTiengViet(text: string | null | undefined): string {
  if (!text) return '';
  const i = text.indexOf('|||');
  if (i === -1) return text.trim();
  const en = text.slice(0, i).trim();
  const vi = text.slice(i + 3).trim();
  return vi || en;
}

// ─── Khoá nội bộ theo tiến trình (đọc-sửa-ghi một trang) ─────
// Hai lần "thêm dòng vào Sổ lệnh" sát nhau mà cùng đọc bản cũ thì bản ghi sau
// đè mất dòng của bản trước. Backend chạy MỘT tiến trình (một container), nên
// xếp hàng theo noteId trong bộ nhớ là đủ; nhiều bản sao thì phải đổi sang
// pg_advisory_xact_lock.
const hangDoi = new Map<number, Promise<unknown>>();
async function tuanTu<T>(noteId: number, fn: () => Promise<T>): Promise<T> {
  const truoc = hangDoi.get(noteId) ?? Promise.resolve();
  const lan = truoc.catch(() => undefined).then(fn);
  hangDoi.set(noteId, lan);
  try {
    return await lan;
  } finally {
    if (hangDoi.get(noteId) === lan) hangDoi.delete(noteId);
  }
}

// ─── Môn (NoteSubject) theo clientId ─────────────────────────

async function damBaoMon(
  userId: number,
  clientId: string,
  taoMoi: { name: string; emoji?: string | null; description?: string | null },
) {
  const where = { uk_note_subject_client: { userId, clientId } };
  const co = await prisma.noteSubject.findUnique({ where });
  if (co) return co;
  try {
    return await prisma.noteSubject.create({
      data: {
        userId,
        clientId,
        name: taoMoi.name.slice(0, 150),
        emoji: taoMoi.emoji ?? null,
        description: taoMoi.description ?? null,
        sortOrder: -1,
      },
    });
  } catch (e) {
    // Request song song đã tạo trước — UNIQUE chặn bản thứ hai, đọc lại bản đó.
    if (!isUniqueViolation(e)) throw e;
    const lai = await prisma.noteSubject.findUnique({ where });
    if (!lai) throw e;
    return lai;
  }
}

/**
 * Hộp thư của user — tạo nếu chưa có. Idempotent và an toàn khi gọi đồng thời
 * (UNIQUE uk_note_subject_client + đọc lại khi P2002).
 */
export function ensureInboxSubject(userId: number) {
  return damBaoMon(userId, HOP_THU_CLIENT_ID, {
    name: HOP_THU_TEN,
    description: 'Ghi nhanh rơi vào đây (Alt+Shift+N ở mọi trang). Sắp xếp sang môn khác khi rảnh.',
  });
}

// ─── Trang (Note) ────────────────────────────────────────────

type NoteGon = { id: number; title: string; subjectId: number; chapterId: number | null };
const CHON_GON = { id: true, title: true, subjectId: true, chapterId: true } as const;

/**
 * Tạo trang CÓ SẴN nội dung. Cùng hình dạng với `createNote` (hàng note + bản
 * INITIAL trong một transaction), chỉ khác là bản INITIAL mang nội dung thật.
 * Có `clientId` mà trùng (request song song) thì trả về trang đã có.
 */
async function taoTrang(
  userId: number,
  p: { subjectId: number; chapterId?: number | null; title: string; doc: TiptapDoc; clientId?: string | null },
): Promise<NoteGon> {
  const contentHtml = docToHtml(p.doc);
  const contentJson = p.doc as unknown as Prisma.InputJsonValue;
  const title = (p.title.trim() || 'Ghi chú mới').slice(0, 300);
  try {
    const note = await prisma.$transaction(async (tx) => {
      const n = await tx.note.create({
        data: {
          userId, subjectId: p.subjectId, chapterId: p.chapterId ?? null, title,
          contentJson, contentHtml, clientId: p.clientId ?? null,
        },
        select: CHON_GON,
      });
      await tx.noteVersion.create({
        data: { noteId: n.id, userId, version: 1, title, contentJson, contentHtml, tags: [], origin: 'INITIAL' },
      });
      return n;
    });
    void import('./noteEmbedding.service.js')
      .then(({ capNhatNhung }) => capNhatNhung(note.id))
      .catch(() => { /* máy nhúng tắt — trợ lý tự lùi về từ khoá */ });
    return note;
  } catch (e) {
    if (p.clientId && isUniqueViolation(e)) {
      const co = await prisma.note.findUnique({
        where: { uk_note_client: { userId, clientId: p.clientId } },
        select: CHON_GON,
      });
      if (co) return co;
    }
    throw e;
  }
}

/**
 * Trang theo clientId — tạo nếu chưa có. Trang đó đã bị xoá mềm (thùng rác)
 * thì NHẢ clientId của nó ra rồi tạo trang mới: người dùng đã vứt trang đi,
 * lặng lẽ ghi tiếp vào thùng rác là mất chữ.
 */
async function damBaoTrang(
  userId: number,
  clientId: string,
  tao: () => { subjectId: number; title: string; doc: TiptapDoc },
): Promise<NoteGon & { vuaTao: boolean }> {
  const co = await prisma.note.findUnique({
    where: { uk_note_client: { userId, clientId } },
    select: { ...CHON_GON, deletedAt: true },
  });
  if (co && !co.deletedAt) return { id: co.id, title: co.title, subjectId: co.subjectId, chapterId: co.chapterId, vuaTao: false };
  if (co?.deletedAt) {
    await prisma.note.updateMany({ where: { id: co.id, userId }, data: { clientId: null } });
  }
  const n = await taoTrang(userId, { ...tao(), clientId });
  return { ...n, vuaTao: true };
}

async function docCuaTrang(userId: number, noteId: number): Promise<TiptapDoc> {
  const n = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
    select: { contentJson: true },
  });
  if (!n) throw new AppError('Ghi chú không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  const j = n.contentJson as TiptapDoc | null;
  if (j && j.type === 'doc' && Array.isArray(j.content)) return j;
  return { type: 'doc', content: [] };
}

/** Ghi nội dung mới qua `updateNote` — giữ nguyên lịch sử phiên bản + reset phòng realtime. */
async function ghiTrang(userId: number, noteId: number, doc: TiptapDoc) {
  if (doc.content.length === 0) doc.content.push({ type: 'paragraph' });
  await updateNote(userId, noteId, {
    contentJson: doc as unknown as Prisma.InputJsonValue,
    contentHtml: docToHtml(doc),
  });
}

// ─── 1. Ghi nhanh ────────────────────────────────────────────

export function listTemplates() {
  return NOTE_TEMPLATES.map((t) => ({ key: t.key, title: t.title, icon: t.icon, description: t.description, html: t.html }));
}

/**
 * Lưu một ghi nhanh vào Hộp thư. `text` là Markdown (gõ `pwd` trong dấu `
 * thành code, ``` thành khối code, "- " thành danh sách). Có `template` thì
 * phần gõ nằm trên cùng, khung mẫu nằm dưới.
 */
export async function ghiNhanh(userId: number, body: { title?: unknown; text?: unknown; template?: unknown }) {
  const text = str(body.text, MAX_TEXT, 'Nội dung');
  const template = body.template ? findTemplate(body.template) : null;
  if (body.template && !template) throw new AppError('Mẫu không tồn tại', 400, 'INVALID_TEMPLATE');
  if (!text && !template) throw new AppError('Nội dung không được để trống', 400, 'INVALID_INPUT');

  let title = str(body.title, 300, 'Tiêu đề');
  if (!title) {
    const dongDau = text.split('\n').find((l) => l.trim())?.replace(/^[#>\-*+\s]+/, '').replace(/[`*_]/g, '').trim() ?? '';
    title = dongDau.slice(0, 80) || template?.title || 'Ghi nhanh';
  }

  const inbox = await ensureInboxSubject(userId);
  const doc = htmlToDoc(
    (text ? markdownToHtml(text) : '') + (template?.html ?? ''),
  );
  const note = await taoTrang(userId, { subjectId: inbox.id, title, doc });
  return { note, subject: { id: inbox.id, name: inbox.name } };
}

/**
 * Tạo trang từ mẫu. Không có subjectId thì vào Hộp thư. Dành cho nút
 * "Trang mới từ mẫu" ở thanh bên (agent Sidebar) và ô ghi nhanh.
 */
export async function taoTuMau(
  userId: number,
  body: { template?: unknown; subjectId?: unknown; chapterId?: unknown; title?: unknown },
) {
  const template = findTemplate(body.template);
  if (!template) throw new AppError('Mẫu không tồn tại', 400, 'INVALID_TEMPLATE');
  let subjectId: number;
  if (body.subjectId != null && body.subjectId !== '') {
    subjectId = Number(body.subjectId);
    const ok = await prisma.noteSubject.findFirst({ where: { id: subjectId, userId }, select: { id: true } });
    if (!ok) throw new AppError('Môn học không tồn tại hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  } else {
    subjectId = (await ensureInboxSubject(userId)).id;
  }
  let chapterId: number | null = null;
  if (body.chapterId != null && body.chapterId !== '') {
    chapterId = Number(body.chapterId);
    const ch = await prisma.noteChapter.findFirst({ where: { id: chapterId, userId, subjectId }, select: { id: true } });
    if (!ch) throw new AppError('Chương không tồn tại hoặc không thuộc môn này', 404, 'NOT_FOUND');
  }
  const title = str(body.title, 300, 'Tiêu đề') || template.title;
  const note = await taoTrang(userId, { subjectId, chapterId, title, doc: htmlToDoc(template.html) });
  return { note };
}

// ─── 2. Sổ lệnh ──────────────────────────────────────────────

/** Sổ lệnh mặc định (trong Hộp thư) — tạo từ mẫu nếu chưa có. */
export async function damBaoSoLenh(userId: number) {
  const inbox = await ensureInboxSubject(userId);
  const tpl = findTemplate('so-lenh')!;
  return damBaoTrang(userId, SO_LENH_CLIENT_ID, () => ({
    subjectId: inbox.id,
    title: '⌨️ Sổ lệnh',
    doc: htmlToDoc(tpl.html),
  }));
}

/**
 * Mở Sổ lệnh mặc định: tạo nếu chưa có, và nếu trang còn bố cục cũ (một bảng
 * dẹt 5 cột, dòng trùng, chưa gom nhóm) thì dựng lại MỘT lần. Dựng lại là
 * idempotent nên trang đã đúng bố cục thì không ghi gì (không đẻ phiên bản rỗng).
 */
export async function moSoLenh(userId: number) {
  const n = await damBaoSoLenh(userId);
  await tuanTu(n.id, async () => {
    const doc = await docCuaTrang(userId, n.id);
    const truoc = JSON.stringify(doc);
    sapXepSoLenh(doc);
    if (docSoLenh(doc).length > 0 && JSON.stringify(doc) !== truoc) await ghiTrang(userId, n.id, doc);
  });
  return n;
}

/** Thêm một lệnh vào Sổ lệnh (mặc định hoặc `noteId` chỉ định của chính user). */
export async function themLenh(userId: number, body: Record<string, unknown>) {
  const d: DongLenh = {
    lenh: str(body.lenh, 300, 'Lệnh', true),
    nghia: str(body.nghia, 1000, 'Nghĩa', true),
    viDu: str(body.viDu, 1000, 'Ví dụ'),
    nhom: str(body.nhom, 40, 'Nhóm'),
    loi: str(body.loi, 2000, 'Lỗi từng gặp'),
  };
  let noteId: number;
  if (body.noteId != null && body.noteId !== '') {
    noteId = Number(body.noteId);
    if (!Number.isInteger(noteId) || noteId <= 0) throw new AppError('noteId không hợp lệ', 400, 'INVALID_ID');
  } else {
    noteId = (await damBaoSoLenh(userId)).id;
  }
  return tuanTu(noteId, async () => {
    const doc = await docCuaTrang(userId, noteId);
    themDongSoLenh(doc, d);
    await ghiTrang(userId, noteId, doc);
    return { noteId, soDong: docSoLenh(doc).length };
  });
}

/**
 * Sinh thẻ ôn từ bảng Sổ lệnh của một trang — dùng CHÍNH hệ flashcard của Notes
 * (`NoteVocabEntry` + `FlashcardReview`, trạng thái ôn isKnown/knownStreak).
 *
 *   mặt trước (term)    = "Lệnh nào để <nghĩa>?"
 *   mặt sau (meaning)   = lệnh
 *   ví dụ (example)     = cột Ví dụ
 *   phiên âm (reading)  = cột Nhóm (hiện nhỏ trên mặt sau)
 *
 * Khớp thẻ cũ theo LỆNH (meaning): chạy lại sau khi sửa nghĩa thì cập nhật
 * mặt trước mà GIỮ tiến độ ôn; lệnh mới thì thêm thẻ. Thẻ tay của người dùng
 * (không trùng lệnh nào) để nguyên.
 */
export async function taoTheTuSoLenh(userId: number, noteIdRaw: unknown) {
  const noteId = Number(noteIdRaw);
  if (!Number.isInteger(noteId) || noteId <= 0) throw new AppError('noteId không hợp lệ', 400, 'INVALID_ID');
  return tuanTu(noteId, async () => {
    const doc = await docCuaTrang(userId, noteId);
    const dong = docSoLenh(doc).filter((d) => d.nghia).slice(0, 500);
    if (dong.length === 0) {
      throw new AppError('Trang này chưa có bảng Sổ lệnh (cột "Lệnh" và "Nghĩa") hoặc bảng chưa có dòng nào có nghĩa', 400, 'NO_COMMAND_TABLE');
    }
    const cu = await prisma.noteVocabEntry.findMany({
      where: { userId, noteId },
      select: { id: true, term: true, meaning: true, example: true, reading: true, sortOrder: true },
    });
    const theoLenh = new Map(cu.filter((c) => c.meaning).map((c) => [c.meaning!.trim(), c]));
    let sortOrder = cu.reduce((m, c) => Math.max(m, c.sortOrder), -1);
    let taoMoi = 0;
    let capNhat = 0;
    const cat = (s: string | undefined, n: number) => (s ?? '').slice(0, n) || null;
    await prisma.$transaction(async (tx) => {
      for (const d of dong) {
        const term = matTruocThe(d.nghia).slice(0, 500);
        const lenh = d.lenh.slice(0, 5000);
        const co = theoLenh.get(lenh);
        if (co) {
          if (co.term !== term || (co.example ?? null) !== cat(d.viDu, 5000) || (co.reading ?? null) !== cat(d.nhom, 500)) {
            await tx.noteVocabEntry.updateMany({
              where: { id: co.id, userId },
              data: { term, example: cat(d.viDu, 5000), reading: cat(d.nhom, 500) },
            });
            capNhat++;
          }
        } else {
          await tx.noteVocabEntry.create({
            data: { userId, noteId, term, meaning: lenh, example: cat(d.viDu, 5000), reading: cat(d.nhom, 500), sortOrder: ++sortOrder },
          });
          theoLenh.set(lenh, { id: 0, term, meaning: lenh, example: null, reading: null, sortOrder });
          taoMoi++;
        }
      }
    });
    return { noteId, soThe: dong.length, taoMoi, capNhat };
  });
}

// ─── 4. Sổ tay khoá học ──────────────────────────────────────

function clientIdKhoa(slug: string): string {
  // clientId là VARCHAR(64). Slug khoá tới 255 ký tự: dài quá thì cắt + băm để
  // vẫn ổn định và không đụng nhau.
  const raw = `khoa:${slug}`;
  if (raw.length <= 64) return raw;
  let h = 0;
  for (const ch of slug) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0;
  return `khoa:${slug.slice(0, 48)}~${h.toString(36)}`.slice(0, 64);
}

async function khoaVaBai(slug: string, lessonId: number) {
  if (!slug || slug.length > 255) throw new AppError('Khoá học không hợp lệ', 400, 'INVALID_INPUT');
  if (!Number.isInteger(lessonId) || lessonId <= 0) throw new AppError('lessonId không hợp lệ', 400, 'INVALID_ID');
  // Tên khoá/bài lấy từ CSDL, không tin chuỗi client gửi lên.
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, section: { course: { slug } } },
    select: { id: true, title: true, section: { select: { course: { select: { id: true, slug: true, title: true } } } } },
  });
  if (!lesson) throw new AppError('Bài học không thuộc khoá này', 404, 'NOT_FOUND');
  const course = lesson.section.course;
  return {
    course: { id: course.id, slug: course.slug, ten: tenTiengViet(course.title) || course.slug },
    bai: { id: lesson.id, ten: tenTiengViet(lesson.title) || `Bài ${lesson.id}` },
  };
}

function duongDanBai(slug: string, lessonId: number) {
  return `/courses/${slug}/learn?lessonId=${lessonId}`;
}

/** Bôi đen trong bài học → lưu vào trang của bài trong "📘 <khoá>". */
export async function luuDoanBaiHoc(userId: number, body: Record<string, unknown>) {
  const slug = str(body.courseSlug, 255, 'Khoá học', true);
  const lessonId = Number(body.lessonId);
  const text = str(body.text, 5000, 'Đoạn bôi đen', true);
  const laCode = body.laCode === true;
  const { course, bai } = await khoaVaBai(slug, lessonId);

  const mon = await damBaoMon(userId, clientIdKhoa(course.slug), {
    name: `📘 ${course.ten}`,
    description: `Sổ tay của khoá "${course.ten}" — tự tạo khi bạn lưu đoạn đầu tiên từ bài học.`,
  });
  const trang = await damBaoTrang(userId, `khoa-bai:${bai.id}`, () => ({
    subjectId: mon.id,
    title: bai.ten,
    doc: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Nguồn: ', marks: [{ type: 'bold' }] },
          // Chữ thường, KHÔNG phải mark link — schema realtime không có link.
          { type: 'text', text: `${course.ten} › ${bai.ten} — cuongthai.com${duongDanBai(course.slug, bai.id)}` },
        ],
      }],
    },
  }));

  await tuanTu(trang.id, async () => {
    const doc = await docCuaTrang(userId, trang.id);
    doc.content.push(...doanLuuBlocks(text, laCode, new Date()));
    await ghiTrang(userId, trang.id, doc);
  });
  return { noteId: trang.id, subjectId: mon.id, subjectName: mon.name };
}

/** Các đoạn đã lưu của một bài (cho mục "Ghi chú của bạn cho bài này"). */
export async function doanCuaBai(userId: number, slugRaw: unknown, lessonIdRaw: unknown) {
  const lessonId = Number(lessonIdRaw);
  if (!Number.isInteger(lessonId) || lessonId <= 0) throw new AppError('lessonId không hợp lệ', 400, 'INVALID_ID');
  const note = await prisma.note.findUnique({
    where: { uk_note_client: { userId, clientId: `khoa-bai:${lessonId}` } },
    select: { id: true, title: true, deletedAt: true, contentJson: true, updatedAt: true },
  });
  if (!note || note.deletedAt) return { noteId: null, doan: [] };
  void slugRaw; // slug chỉ để URL đọc được; trang được nhận theo lessonId
  return {
    noteId: note.id,
    title: note.title,
    updatedAt: note.updatedAt,
    doan: docDoanDaLuu(note.contentJson as TiptapDoc | null).slice(-50),
  };
}

// ─── 5. Nhập Markdown ────────────────────────────────────────

export async function nhapMarkdown(userId: number, body: { filename?: unknown; markdown?: unknown }) {
  const filename = typeof body.filename === 'string' ? body.filename.trim().slice(0, 255) : '';
  if (!/\.(md|markdown|txt)$/i.test(filename)) {
    throw new AppError('Chỉ nhận file .md / .markdown / .txt', 400, 'INVALID_FILE_TYPE');
  }
  if (typeof body.markdown !== 'string') throw new AppError('Thiếu nội dung file', 400, 'INVALID_INPUT');
  const md = body.markdown.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  if (Buffer.byteLength(md, 'utf8') > MAX_MD_BYTES) {
    throw new AppError(`File quá lớn (tối đa ${MAX_MD_BYTES / 1024} KB)`, 413, 'FILE_TOO_LARGE');
  }
  if (!md.trim()) throw new AppError('File rỗng', 400, 'INVALID_INPUT');
  // File nhị phân đổi đuôi thành .md: ký tự NUL không bao giờ có trong văn bản thật.
  if (md.includes('\u0000')) throw new AppError('File không phải văn bản', 400, 'INVALID_FILE_TYPE');

  const title = titleFromMarkdown(md) || filename.replace(/\.(md|markdown|txt)$/i, '') || 'Nhập từ Markdown';
  const inbox = await ensureInboxSubject(userId);
  const doc = markdownToDoc(md);
  const note = await taoTrang(userId, { subjectId: inbox.id, title, doc });
  return { note, subject: { id: inbox.id, name: inbox.name } };
}
