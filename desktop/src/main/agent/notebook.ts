/**
 * ============================================================
 * NOTEBOOK `.ipynb` — đọc thành chữ, và sửa THEO Ô
 * ============================================================
 *
 * ─── Vì sao không để `read_file`/`edit_file` làm như file thường ───
 * `.ipynb` là JSON, nên hai tool kia "chạy được" — và đó mới là chỗ bẫy:
 *
 *   • ĐỌC: một notebook 30 ô có thể là 400KB JSON, phần lớn là `outputs` chứa
 *     ảnh base64 và metadata. Model đọc hết đống đó để tìm 5 dòng Python —
 *     tiền thật, và thường vượt luôn trần file.
 *   • SỬA: `source` là MẢNG CHUỖI, mỗi phần tử một dòng còn nguyên `\\n`.
 *     Thay chữ trong JSON đã thoát (`\\"`, `\\n`) bằng khớp chuỗi thô thì hoặc
 *     không khớp, hoặc khớp trúng rồi phá cấu trúc JSON — và notebook hỏng thì
 *     Jupyter không mở được nữa, mất cả kết quả đã chạy.
 *
 * Nên ở đây: đọc thì DỰNG LẠI thành chữ có đánh số ô; sửa thì theo CHỈ SỐ Ô,
 * và ghi lại bằng `JSON.stringify` nên cấu trúc không thể vỡ.
 *
 * ⚠️ GIỮ NGUYÊN mọi trường lạ. Notebook mang metadata của kernel, của
 * extension, của Colab — vứt đi thứ mình không hiểu là làm hỏng file của người
 * khác một cách im lặng. Chỉ đụng đúng ô được chỉ định.
 */

/** Trần chữ mỗi ô khi ĐỌC. Ô dài hơn bị cắt, có ghi rõ là đã cắt. */
const MAX_CHU_O = 4000;
/** Trần đầu ra mỗi ô. Đầu ra thường là thứ dài nhất và ít giá trị nhất. */
const MAX_CHU_RA = 800;
/** Trần số ô. Notebook to hơn thế thì đọc từng đoạn bằng `o_tu`/`so_o`. */
const MAX_O = 200;

interface ONotebook {
  cell_type?: string;
  source?: string[] | string;
  outputs?: unknown[];
  [k: string]: unknown;
}

interface Notebook {
  cells?: ONotebook[];
  [k: string]: unknown;
}

/** `source` của Jupyter là mảng dòng HOẶC một chuỗi. Cả hai đều hợp lệ. */
export function chuCuaO(o: ONotebook): string {
  const s = o.source;
  if (Array.isArray(s)) return s.join('');
  return typeof s === 'string' ? s : '';
}

function chuCuaDauRa(ra: unknown): string {
  if (!ra || typeof ra !== 'object') return '';
  const o = ra as Record<string, unknown>;
  // `stream` → text; `execute_result`/`display_data` → data['text/plain'];
  // `error` → traceback. Ảnh (`image/png`) CỐ Ý bỏ: base64 trong luồng chữ chỉ
  // là rác tốn tiền, và model không nhìn được nó ở dạng này.
  if (Array.isArray(o.text)) return o.text.join('');
  if (typeof o.text === 'string') return o.text;
  if (Array.isArray(o.traceback)) return o.traceback.join('\n');
  const d = o.data as Record<string, unknown> | undefined;
  const tp = d?.['text/plain'];
  if (Array.isArray(tp)) return tp.join('');
  if (typeof tp === 'string') return tp;
  return d && Object.keys(d).length ? `[${Object.keys(d).join(', ')}]` : '';
}

function cat(s: string, tran: number): string {
  return s.length <= tran ? s : `${s.slice(0, tran)}\n… (đã cắt, còn ${s.length - tran} ký tự)`;
}

export function docNotebook(tho: string): { ok: true; chu: string; soO: number } | { ok: false; loi: string } {
  let nb: Notebook;
  try {
    nb = JSON.parse(tho) as Notebook;
  } catch (e) {
    return { ok: false, loi: `không phải JSON hợp lệ (${(e as Error).message.slice(0, 80)})` };
  }
  if (!Array.isArray(nb.cells)) return { ok: false, loi: 'không có mảng "cells" — không phải notebook' };

  const phan: string[] = [];
  const dsO = nb.cells.slice(0, MAX_O);
  for (const [i, o] of dsO.entries()) {
    const loai = typeof o.cell_type === 'string' ? o.cell_type : '?';
    phan.push(`── ô ${i} · ${loai} ──\n${cat(chuCuaO(o), MAX_CHU_O)}`);
    // Đầu ra chỉ hiện khi CÓ, và luôn có nhãn: model phải phân biệt được đâu
    // là mã người viết, đâu là thứ máy in ra.
    const ra = (o.outputs ?? []).map(chuCuaDauRa).filter(Boolean).join('\n').trim();
    if (ra) phan.push(`   [đầu ra] ${cat(ra, MAX_CHU_RA).replace(/\n/g, '\n   ')}`);
  }
  if (nb.cells.length > MAX_O) {
    phan.push(`… còn ${nb.cells.length - MAX_O} ô nữa (trần ${MAX_O} ô mỗi lần đọc).`);
  }
  return { ok: true, soO: nb.cells.length, chu: phan.join('\n\n') };
}

export type ViecNotebook = 'thay' | 'chen' | 'xoa';

/**
 * Sửa MỘT ô rồi trả về JSON mới.
 *
 * Không ghi đĩa ở đây — bên gọi còn phải qua thẻ duyệt và sổ hoàn tác. Tách ra
 * thì hàm này kiểm được mà không cần file thật.
 */
export function suaNotebook(
  tho: string,
  viec: ViecNotebook,
  chiSo: number,
  noiDung?: string,
  loaiO?: string,
): { ok: true; json: string; moTa: string } | { ok: false; loi: string } {
  let nb: Notebook;
  try {
    nb = JSON.parse(tho) as Notebook;
  } catch {
    return { ok: false, loi: 'file không phải JSON hợp lệ — sửa tay trước đã.' };
  }
  if (!Array.isArray(nb.cells)) return { ok: false, loi: 'không có mảng "cells" — không phải notebook.' };

  const n = nb.cells.length;
  // `chen` cho phép chỉ số == n (chèn vào cuối); hai việc kia thì không.
  const tranTren = viec === 'chen' ? n : n - 1;
  if (!Number.isInteger(chiSo) || chiSo < 0 || chiSo > tranTren) {
    return { ok: false, loi: `chỉ số ô ${chiSo} nằm ngoài phạm vi (notebook có ${n} ô, 0..${tranTren}).` };
  }

  if (viec === 'xoa') {
    nb.cells.splice(chiSo, 1);
    return { ok: true, json: `${JSON.stringify(nb, null, 1)}\n`, moTa: `xoá ô ${chiSo}` };
  }

  if (typeof noiDung !== 'string') return { ok: false, loi: 'thiếu nội dung cho ô.' };
  /* Tách thành MẢNG DÒNG CÒN `\n` — đúng định dạng Jupyter ghi ra. Nhét một
     chuỗi liền cũng đọc được, nhưng `git diff` sẽ thành một dòng khổng lồ và
     mọi lần sửa sau đó không xem được nữa. */
  const dong = noiDung.split('\n').map((d, i, a) => (i === a.length - 1 ? d : `${d}\n`));
  const source = dong.length === 1 && dong[0] === '' ? [] : dong;

  if (viec === 'thay') {
    const cu = nb.cells[chiSo]!;
    // GIỮ mọi trường khác (id, metadata, execution_count). Ô thay nội dung
    // nhưng vẫn là ô đó.
    nb.cells[chiSo] = { ...cu, source, ...(loaiO ? { cell_type: loaiO } : {}) };
    // Đầu ra cũ KHÔNG còn đúng với mã mới — để lại là nói dối về thứ đã chạy.
    if ((nb.cells[chiSo] as ONotebook).cell_type === 'code') {
      (nb.cells[chiSo] as ONotebook).outputs = [];
      (nb.cells[chiSo] as ONotebook).execution_count = null;
    }
    return { ok: true, json: `${JSON.stringify(nb, null, 1)}\n`, moTa: `thay ô ${chiSo}` };
  }

  const loai = loaiO ?? 'code';
  const oMoi: ONotebook = loai === 'code'
    ? { cell_type: 'code', metadata: {}, source, outputs: [], execution_count: null }
    : { cell_type: loai, metadata: {}, source };
  nb.cells.splice(chiSo, 0, oMoi);
  return { ok: true, json: `${JSON.stringify(nb, null, 1)}\n`, moTa: `chèn ô ${loai} tại ${chiSo}` };
}
