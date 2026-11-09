/**
 * Đính kèm của ô soạn kiểu Claude — chép luật từ `ChatInput.tsx` (giới hạn khớp backend `ai.routes.ts`):
 * 4 ảnh (nén cạnh dài ≤1568px, JPEG 0.85) + 3 tài liệu ≤6MB (PDF/Word/Excel/PowerPoint/txt/md/csv).
 */
export const MAX_IMAGES = 4;
export const MAX_DOCS = 3;
export const MAX_DOC_BYTES = 6 * 1024 * 1024;
const MAX_DIM = 1568;

const DOC_TYPE_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  md: 'text/markdown',
  markdown: 'text/markdown',
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};
export const FILE_ACCEPT =
  'image/png,image/jpeg,image/webp,image/gif,.pdf,.docx,.xlsx,.pptx,.txt,.md,.csv';

/** Media type chuẩn của một tài liệu (theo ĐUÔI trước — `file.type` của .md là chuỗi rỗng). */
export function docMediaType(file: File): string | null {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (DOC_TYPE_BY_EXT[ext]) return DOC_TYPE_BY_EXT[ext];
  const t = (file.type || '').toLowerCase();
  return Object.values(DOC_TYPE_BY_EXT).includes(t) ? t : null;
}

export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('read failed'));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode failed'));
    img.src = src;
  });
}

/** Thu nhỏ + nén JPEG; lỗi gì cũng trả lại bản gốc. */
export async function compressImage(file: File): Promise<string> {
  const original = await readAsDataURL(file);
  try {
    const img = await loadImage(original);
    let { width, height } = img;
    if (Math.max(width, height) > MAX_DIM) {
      const k = MAX_DIM / Math.max(width, height);
      width = Math.round(width * k);
      height = Math.round(height * k);
    }
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return original;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return c.toDataURL('image/jpeg', 0.85);
  } catch {
    return original;
  }
}
