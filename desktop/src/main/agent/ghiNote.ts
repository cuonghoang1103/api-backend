/**
 * ============================================================
 * AGENT GHI VÀO SỔ GHI CHÚ
 * ============================================================
 *
 * ─── VÌ SAO Ở PHÍA APP, KHÔNG PHẢI PHÍA MÁY CHỦ ───
 * `notes_search` / `notes_read` chạy ở máy chủ (ring 'server') vì chúng chỉ
 * ĐỌC. Ghi thì khác: máy chủ chạy tool xong mới trả kết quả về, không có chỗ
 * nào dừng lại hỏi người dùng — cơ chế duyệt sống hoàn toàn ở app. Đặt tool ghi
 * ở ring 'server' nghĩa là model sửa ghi chú thật của người dùng mà không ai
 * kịp nhìn thấy. Nên nó phải là tool 'client': app gọi API Notes bằng token của
 * chính người dùng, sau khi họ ĐỌC nội dung và bấm đồng ý.
 *
 * ─── HAI TRƯỜNG NỘI DUNG, GHI SAI MỘT CÁI LÀ TRỐNG TRƠN ───
 * Trình soạn nạp `contentJson`; `notes_search`/`notes_read` và bản xem chia sẻ
 * đọc `contentHtml`. Phải ghi CẢ HAI. Xem `markdownTiptap.ts`.
 */
import { API_ORIGIN } from '../config';
import { readStoredSession } from '../ipc/auth';
import { hoiNguoiDung, type YeuCauXinPhep } from './xinPhep';
import type { SoCuoc } from './so';
import {
  markdownSangTiptap, tiptapSangHtml, tiptapSangChu, MAX_CHU,
  type TaiLieuTiptap,
} from './markdownTiptap';

export interface BoiCanhNote {
  so: SoCuoc;
  signal: AbortSignal;
  /** Thẻ duyệt cho việc ghi ghi chú — `chiTiet` là thứ người dùng phải ĐỌC. */
  xinPhepNote: (y: YeuCauXinPhep & { viec: 'tao' | 'ghi'; chiTiet: string }) => void;
}

export interface KetQuaTool { noiDung: string; tomTat: string }

/** Bản xem trước trên thẻ duyệt. Dài hơn thế thì người dùng không đọc, chỉ bấm. */
const XEM_TRUOC = 1_200;

async function goiNotes(
  duong: string,
  opt: { method: string; than?: unknown },
): Promise<{ ok: boolean; ma: number; du: Record<string, unknown> | null }> {
  const phien = readStoredSession();
  if (!phien) return { ok: false, ma: 401, du: null };
  const res = await fetch(`${API_ORIGIN}/api/v1/notes${duong}`, {
    method: opt.method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${phien.sessionToken}` },
    ...(opt.than === undefined ? {} : { body: JSON.stringify(opt.than) }),
  });
  const j = (await res.json().catch(() => null)) as { data?: unknown } | null;
  return { ok: res.ok, ma: res.status, du: (j?.data ?? null) as Record<string, unknown> | null };
}

function catXem(chu: string): string {
  return chu.length > XEM_TRUOC ? `${chu.slice(0, XEM_TRUOC)}\n… (còn ${chu.length - XEM_TRUOC} ký tự)` : chu;
}

function soNguyen(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Ghi nội dung vào một ghi chú đã có id. Dùng chung cho cả tạo mới lẫn sửa. */
async function datNoiDung(
  id: number, doc: TaiLieuTiptap, tieuDe?: string,
): Promise<{ ok: boolean; ma: number }> {
  const r = await goiNotes(`/notes/${id}`, {
    method: 'PATCH',
    than: {
      contentJson: doc,
      contentHtml: tiptapSangHtml(doc),
      ...(tieuDe ? { title: tieuDe } : {}),
    },
  });
  return { ok: r.ok, ma: r.ma };
}

export async function toolNotesTao(
  args: Record<string, unknown>, b: BoiCanhNote,
): Promise<KetQuaTool> {
  const subjectId = soNguyen(args.subject_id);
  if (!subjectId) {
    return {
      noiDung: 'LỖI: thiếu "subject_id" hợp lệ. Gọi notes_tree để lấy id môn/sổ — ĐỪNG đoán số.',
      tomTat: 'thiếu subject_id',
    };
  }
  const tieuDe = typeof args.tieu_de === 'string' ? args.tieu_de.trim().slice(0, 300) : '';
  const noiDung = typeof args.noi_dung === 'string' ? args.noi_dung : '';
  if (!tieuDe) return { noiDung: 'LỖI: thiếu "tieu_de".', tomTat: 'thiếu tiêu đề' };
  if (!noiDung.trim()) return { noiDung: 'LỖI: "noi_dung" rỗng. Viết bản hoàn chỉnh rồi hãy gọi.', tomTat: 'nội dung rỗng' };
  if (noiDung.length > MAX_CHU) {
    return { noiDung: `LỖI: nội dung ${noiDung.length} ký tự, quá trần ${MAX_CHU}. Chia thành nhiều ghi chú.`, tomTat: 'quá dài' };
  }

  const doc = markdownSangTiptap(noiDung);
  const chiTiet = `Sổ id ${subjectId}${args.chapter_id ? ` · chương ${String(args.chapter_id)}` : ''}\n\n`
    + `─── ${tieuDe} ───\n${catXem(tiptapSangChu(doc))}`;

  const quyet = await hoiNguoiDung(
    { ten: 'notes_tao', duongDan: `tạo ghi chú "${tieuDe}"`, khoa: `note:tao:${subjectId}:${tieuDe}`, choNho: false },
    (y) => b.xinPhepNote({ ...y, viec: 'tao', chiTiet }),
    b.signal,
    b.so.quyenDaCap,
  );
  if (quyet === 'tuChoi') return { noiDung: 'NGƯỜI DÙNG TỪ CHỐI tạo ghi chú.', tomTat: 'bị từ chối' };

  const tao = await goiNotes('/notes', {
    method: 'POST',
    than: { subjectId, ...(soNguyen(args.chapter_id) ? { chapterId: soNguyen(args.chapter_id) } : {}), title: tieuDe },
  });
  if (!tao.ok || !tao.du) {
    return {
      noiDung: `LỖI: máy chủ trả ${tao.ma} khi tạo ghi chú. ${tao.ma === 404 ? 'subject_id/chapter_id không tồn tại hoặc không phải của bạn — gọi notes_tree để lấy id đúng.' : ''}`,
      tomTat: `lỗi ${tao.ma}`,
    };
  }
  const id = soNguyen(tao.du.id);
  if (!id) return { noiDung: 'LỖI: máy chủ không trả id ghi chú vừa tạo.', tomTat: 'thiếu id' };

  const ghi = await datNoiDung(id, doc);
  if (!ghi.ok) {
    // Ghi chú đã tạo nhưng nội dung chưa vào ⇒ NÓI RÕ, đừng báo thành công.
    // Model đọc câu này để thử `notes_ghi` lại, thay vì tưởng đã xong.
    return { noiDung: `Đã tạo ghi chú id ${id} nhưng GHI NỘI DUNG HỎNG (máy chủ trả ${ghi.ma}). Hãy gọi notes_ghi với id ${id}.`, tomTat: 'nội dung chưa vào' };
  }
  return { noiDung: `Đã tạo ghi chú "${tieuDe}" (id ${id}) trong sổ ${subjectId}.`, tomTat: `tạo "${tieuDe}"` };
}

export async function toolNotesGhi(
  args: Record<string, unknown>, b: BoiCanhNote,
): Promise<KetQuaTool> {
  const id = soNguyen(args.id);
  if (!id) return { noiDung: 'LỖI: thiếu "id" hợp lệ. Lấy id từ notes_search hoặc notes_tree.', tomTat: 'thiếu id' };
  const cheDo = args.che_do === 'thay' ? 'thay' : args.che_do === 'them' ? 'them' : null;
  if (!cheDo) return { noiDung: 'LỖI: "che_do" phải là "them" hoặc "thay".', tomTat: 'sai chế độ' };
  const noiDung = typeof args.noi_dung === 'string' ? args.noi_dung : '';
  if (!noiDung.trim()) return { noiDung: 'LỖI: "noi_dung" rỗng.', tomTat: 'nội dung rỗng' };
  if (noiDung.length > MAX_CHU) {
    return { noiDung: `LỖI: nội dung ${noiDung.length} ký tự, quá trần ${MAX_CHU}.`, tomTat: 'quá dài' };
  }
  const tieuDe = typeof args.tieu_de === 'string' ? args.tieu_de.trim().slice(0, 300) : undefined;

  const cu = await goiNotes(`/notes/${id}`, { method: 'GET' });
  if (!cu.ok || !cu.du) {
    return { noiDung: `LỖI: không đọc được ghi chú id ${id} (máy chủ trả ${cu.ma}). Lấy id đúng từ notes_search.`, tomTat: `lỗi ${cu.ma}` };
  }
  const tenCu = String(cu.du.title ?? '(không tên)');

  const docMoi = markdownSangTiptap(noiDung);
  let docCuoi: TaiLieuTiptap;
  if (cheDo === 'them') {
    /**
     * NỐI trên tài liệu ProseMirror, KHÔNG nối chuỗi Markdown.
     *
     * Nối chuỗi đòi phải đổi ngược tài liệu cũ về Markdown — mà phép đổi ngược
     * ấy có mất mát, nên mỗi lần "thêm một dòng" sẽ âm thầm viết lại và làm
     * hỏng dần phần chữ cũ. Nối ở tầng tài liệu thì phần cũ KHÔNG bị đụng tới.
     */
    const goc = (cu.du.contentJson ?? null) as TaiLieuTiptap | null;
    const khoiCu = goc && goc.type === 'doc' && Array.isArray(goc.content) ? goc.content : [];
    docCuoi = { type: 'doc', content: [...khoiCu, ...docMoi.content] };
  } else {
    docCuoi = docMoi;
  }

  const chiTiet = cheDo === 'them'
    ? `Ghi chú "${tenCu}" (id ${id}) — NỐI vào cuối, chữ cũ giữ nguyên\n\n─── phần thêm ───\n${catXem(tiptapSangChu(docMoi))}`
    : `Ghi chú "${tenCu}" (id ${id}) — ⚠️ THAY TOÀN BỘ nội dung cũ\n\n─── nội dung mới ───\n${catXem(tiptapSangChu(docMoi))}`;

  const quyet = await hoiNguoiDung(
    {
      ten: cheDo === 'them' ? 'notes_ghi (thêm)' : 'notes_ghi (THAY)',
      duongDan: `${cheDo === 'them' ? 'thêm vào' : 'viết đè'} "${tenCu}"`,
      khoa: `note:ghi:${id}:${cheDo}`,
      // KHÔNG cho "nhớ cả phiên": mỗi lần ghi là một nội dung KHÁC nhau, nên
      // một lần đồng ý không nói gì về lần sau. Cùng lý do với tool MCP.
      choNho: false,
    },
    (y) => b.xinPhepNote({ ...y, viec: 'ghi', chiTiet }),
    b.signal,
    b.so.quyenDaCap,
  );
  if (quyet === 'tuChoi') return { noiDung: 'NGƯỜI DÙNG TỪ CHỐI ghi vào ghi chú.', tomTat: 'bị từ chối' };

  const ghi = await datNoiDung(id, docCuoi, tieuDe);
  if (!ghi.ok) return { noiDung: `LỖI: máy chủ trả ${ghi.ma} khi ghi ghi chú id ${id}.`, tomTat: `lỗi ${ghi.ma}` };

  return {
    noiDung: cheDo === 'them'
      ? `Đã nối ${noiDung.length} ký tự vào cuối ghi chú "${tenCu}" (id ${id}).`
      : `Đã THAY toàn bộ nội dung ghi chú "${tenCu}" (id ${id}). Bản cũ vẫn nằm trong lịch sử phiên bản của Notes.`,
    tomTat: cheDo === 'them' ? `thêm vào "${tenCu}"` : `viết đè "${tenCu}"`,
  };
}
