/**
 * Đợt 8A — gợi ý bước tiếp cho khung AI CT Work trên web (chỉ HIỂN THỊ). Máy chủ (CuongMini, `src/services/agent/
 * goiYBuocTiep.ts`) gửi `goiY: string[]`; câu trả lời cũ/khác có thể còn khối `<goi-y>…</goi-y>` ở cuối ⇒ tách ra để
 * không hiện chữ thô. Cùng luật với bản máy chủ (1–3 dòng, bỏ gạch đầu dòng/số/ngoặc).
 */
export function tachGoiYHienThi(text: string | null | undefined, coSan?: unknown): { chu: string; goiY: string[] } {
  const chuGoc = String(text ?? '');
  const tuTruong = Array.isArray(coSan) ? coSan.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : [];
  const i = chuGoc.lastIndexOf('<goi-y>');
  if (i < 0) return { chu: chuGoc, goiY: tuTruong.slice(0, 3) };
  const sau = chuGoc.slice(i + 7);
  const j = sau.indexOf('</goi-y>');
  const than = j >= 0 ? sau.slice(0, j) : sau;
  const tuKhoi = than.split('\n')
    .map((s) => s.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["“'`]+|["”'`]+$/g, '').replace(/\s+/g, ' ').trim().slice(0, 120))
    .filter((x) => x.length >= 2);
  return { chu: chuGoc.slice(0, i).replace(/\s+$/, ''), goiY: [...new Set([...tuTruong, ...tuKhoi])].slice(0, 3) };
}
