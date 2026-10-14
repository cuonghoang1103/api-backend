/**
 * Chấm từng thuật ngữ tiếng Anh trong một câu đã thu (xưởng giọng, mục `giang-*`).
 *
 * Đầu vào là chữ Whisper nghe ra KHÔNG mớm từ vựng. Một thuật ngữ được coi là
 * đọc đúng khi chính tả tiếng Anh của nó hiện ra trong chữ nghe được — vì
 * Whisper chỉ viết "useState" / "use state" khi âm nghe ra giống tiếng Anh;
 * đọc kiểu phiên âm thì nó viết thành âm tiết Việt ("diu xtết").
 *
 * ⚠️ Đây là PHÉP LỌC, không phải điểm phát âm. Whisper có thể nghe hụt một từ
 * đọc đúng (từ ngắn như `id`, `key` hay bị viết thành âm Việt). Màn hình thu
 * nói rõ điều này và vẫn cho lưu.
 *
 * So khớp:
 *  · chữ thường, bỏ mọi ký tự không phải chữ/số → "Node.js" = "nodejs";
 *  · cho phép thuật ngữ bị Whisper tách thành 1–6 từ liền nhau
 *    ("use state", "N P M", "get element by ID");
 *  · chấp nhận số nhiều lệch một chữ "s" ("prop" ↔ "props");
 *  · `nhan` = cách viết khác mà chính âm đúng sinh ra ("Jason" cho JSON).
 *  KHÔNG bỏ dấu tiếng Việt: "vít" ≠ "vit", để bản đọc phiên âm không lọt.
 */

export interface TuCanCham {
  tu: string;
  nhan?: string[];
}

export interface KetQuaTu {
  tu: string;
  dung: boolean;
}

const gon = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

function tachTu(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** Mọi chuỗi ghép từ 1..6 từ liền nhau trong câu nghe được. */
function cacCum(nghe: string): Set<string> {
  const tu = tachTu(nghe);
  const ra = new Set<string>();
  for (let i = 0; i < tu.length; i++) {
    let s = '';
    for (let j = i; j < Math.min(tu.length, i + 6); j++) {
      s += tu[j];
      ra.add(s);
    }
  }
  return ra;
}

function bienThe(tu: string): string[] {
  const g = gon(tu);
  if (!g) return [];
  const ra = [g];
  if (g.length >= 4) {
    if (g.endsWith('s')) ra.push(g.slice(0, -1));
    else ra.push(`${g}s`);
  }
  return ra;
}

export function kiemTuAnh(nghe: string, ds: TuCanCham[]): KetQuaTu[] {
  const cum = cacCum(nghe);
  return ds.map(({ tu, nhan }) => {
    const ung = [...bienThe(tu), ...(nhan ?? []).flatMap(bienThe)];
    return { tu, dung: ung.some((u) => cum.has(u)) };
  });
}

/**
 * Đọc danh sách thuật ngữ client gửi lên (JSON string hoặc mảng).
 * Trần 12 từ × 60 ký tự: một câu giảng bài có 1–3 thuật ngữ, và chuỗi này
 * đi thẳng từ trình duyệt vào — không để nó phình tuỳ ý.
 */
export function docDanhSachTu(tho: unknown): TuCanCham[] {
  let v: unknown = tho;
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(v)) return [];
  const ra: TuCanCham[] = [];
  for (const x of v.slice(0, 12)) {
    const tu = typeof x === 'string' ? x : (x as { tu?: unknown })?.tu;
    if (typeof tu !== 'string' || !tu.trim()) continue;
    const nhanTho = typeof x === 'object' && x ? (x as { nhan?: unknown }).nhan : undefined;
    const nhan = Array.isArray(nhanTho)
      ? nhanTho.filter((n): n is string => typeof n === 'string').slice(0, 6).map((n) => n.slice(0, 60))
      : undefined;
    ra.push(nhan?.length ? { tu: tu.slice(0, 60), nhan } : { tu: tu.slice(0, 60) });
  }
  return ra;
}
