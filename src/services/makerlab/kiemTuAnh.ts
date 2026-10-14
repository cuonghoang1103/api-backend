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

// ══════════════════════════════════════════════════════════
//  Chấm cả câu THUẦN tiếng Anh (mục `anh` của xưởng giọng)
// ══════════════════════════════════════════════════════════
//
// Đầu vào: câu gốc trong kịch bản + chữ Whisper nghe ra khi bị ÉP `en` và
// KHÔNG được mớm câu gốc (mớm thì nó chép lại câu gốc bất kể người đọc nói
// gì — đúng lỗi đã gặp ở dây chuyền video).
//
// So từng từ: chữ thường, bỏ dấu câu và dấu nháy ("Let's" = "lets"), số
// nhỏ Whisper viết bằng chữ số được đổi về chữ ("3" = "three"). Ghép theo
// dãy con chung dài nhất (LCS) — giữ thứ tự, nên một từ đọc sót ở giữa
// không kéo lệch cả nửa câu sau như phép so theo vị trí. Từ bị Whisper tách
// đôi ("local host", "use state") vẫn tính đúng nếu 2–3 từ liền nhau ghép
// lại bằng từ gốc.
//
// ⚠️ Vẫn là PHÉP LỌC, không phải điểm phát âm: Whisper nghe giọng Việt hụt
// cả chữ đọc đúng. Điểm thấp ⇒ nghe lại, không phải chặn lưu.

export interface KetQuaCauAnh {
  /** Tỉ lệ từ của câu gốc mà Whisper nghe ra, 0..1. */
  diem: number;
  /** Từng từ của câu gốc (tách theo khoảng trắng, giữ dấu câu để hiển thị). */
  tu: KetQuaTu[];
  /** Các từ gốc nghe lệch / thiếu (đã bỏ dấu câu). */
  sai: string[];
  /** Từ Whisper nghe ra mà câu gốc không có — đọc thừa, "ờ", vấp. */
  thua: string[];
}

const SO_CHU: Record<string, string> = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six',
  '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '11': 'eleven', '12': 'twelve',
  '13': 'thirteen', '14': 'fourteen', '15': 'fifteen', '16': 'sixteen', '17': 'seventeen',
  '18': 'eighteen', '19': 'nineteen', '20': 'twenty',
};

/** Một từ tiếng Anh → dạng so sánh: chữ thường, chỉ a-z0-9, số nhỏ thành chữ. */
export function gonTuAnh(t: string): string {
  const g = t
    .toLowerCase()
    .replace(/['’‘`]/g, '')
    .replace(/[^a-z0-9]+/g, '');
  return SO_CHU[g] ?? g;
}

export function chamCauAnh(goc: string, nghe: string): KetQuaCauAnh {
  const hien = goc.split(/\s+/).filter(Boolean);
  const a = hien.map(gonTuAnh);
  const nghTho = nghe.split(/\s+/).filter(Boolean);
  const b = nghTho.map(gonTuAnh);
  const n = a.length;
  const m = b.length;

  // LCS cổ điển — câu ≤ ~30 từ nên bảng n×m rất nhỏ.
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] && a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const khopA = new Array<boolean>(n).fill(false);
  const khopB = new Array<boolean>(m).fill(false);
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (a[i] && a[i] === b[j]) {
      khopA[i] = true;
      khopB[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }

  // Từ bị tách đôi/ba: ghép 2–3 từ nghe LIỀN NHAU còn chưa khớp.
  for (let i = 0; i < n; i++) {
    if (khopA[i] || !a[i]) continue;
    for (let j = 0; j < m && !khopA[i]; j++) {
      let s = '';
      for (let k = j; k < Math.min(m, j + 3); k++) {
        if (khopB[k]) break;
        s += b[k];
        if (k > j && s === a[i]) {
          khopA[i] = true;
          for (let x = j; x <= k; x++) khopB[x] = true;
          break;
        }
      }
    }
  }

  const tu = hien.map((t, i) => ({ tu: t, dung: !a[i] || khopA[i] }));
  const dem = a.filter(Boolean).length;
  const dung = a.filter((g, i) => g && khopA[i]).length;
  return {
    diem: dem ? dung / dem : 1,
    tu,
    sai: hien.filter((_, i) => a[i] && !khopA[i]).map((t) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')),
    thua: nghTho.filter((_, j) => b[j] && !khopB[j]).map((t) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')),
  };
}
