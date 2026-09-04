/**
 * ============================================================
 * KỸ NĂNG — `.claude/skills/<tên>/SKILL.md` trong dự án
 * ============================================================
 *
 * Một thư mục = một kỹ năng: hướng dẫn dài về cách làm MỘT loại việc trong dự
 * án này ("cách soạn một chương Code Lab", "quy trình phát hành app").
 *
 * ─── Khác lệnh gạch chéo ở chỗ nào ───
 * Lệnh gạch chéo là NGƯỜI dùng chọn: gõ `/rade` thì nội dung file vào ô soạn.
 * Kỹ năng là MODEL chọn: nó thấy danh sách tên + mô tả, và tự gọi `dung_ky_nang`
 * khi gặp đúng loại việc đó. Nên kỹ năng hợp với hướng dẫn dài mà người dùng
 * không nên phải nhớ là mình có.
 *
 * ─── Vì sao chỉ gửi MÔ TẢ, không gửi cả thân ───
 * Mười kỹ năng mỗi cái 3000 chữ là 30k token nhét vào MỌI lượt, kể cả lượt chỉ
 * hỏi "file này làm gì". Gửi danh sách một dòng, để model tự lấy cái nó cần —
 * đúng cách Claude Code làm, và lý do là tiền.
 *
 * ⚠️ Nội dung kỹ năng đến từ REPO, tức có thể từ `git clone` một dự án lạ. Nó
 * đi vào hội thoại dưới dạng KẾT QUẢ TOOL (không phải prompt hệ thống), và
 * `prompt.ts` phía máy chủ đã rào sẵn: kết quả tool không gỡ được luật nào.
 * Cùng lý do `AGENTS.md` được bọc trong khối có mốc rõ ràng.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const THU_MUC = ['.claude/skills', '.agent/skills'] as const;
/** Trần số kỹ năng. Danh sách dài hơn thế thì model chọn bừa. */
const MAX_KY_NANG = 40;
/** Trần một file kỹ năng. Dài hơn nữa thì một lần gọi ăn hết ngữ cảnh. */
const MAX_BYTE = 128 * 1024;
/**
 * Trần số file PHỤ liệt kê kèm một kỹ năng.
 *
 * Chỉ liệt kê TÊN, không đọc nội dung — model tự gọi `read_file` cái nó cần.
 * Nhồi sẵn nội dung thì một kỹ năng có 5 file mẫu sẽ ăn hết ngữ cảnh ngay lần
 * gọi đầu, và 4 trong 5 file đó thường không liên quan tới việc đang làm.
 */
const MAX_FILE_PHU = 30;

export interface TomTatKyNang { ten: string; moTa: string }

/** Tách phần đầu YAML, lấy `name`/`description`. Cùng lý do không dùng thư viện YAML như `lenhTuTao.ts`. */
export function docDauKyNang(noiDung: string): { ten: string | null; moTa: string | null; than: string } {
  if (!noiDung.startsWith('---')) return { ten: null, moTa: null, than: noiDung };
  const het = noiDung.indexOf('\n---', 3);
  if (het < 0) return { ten: null, moTa: null, than: noiDung };
  const dau = noiDung.slice(3, het);
  const than = noiDung.slice(noiDung.indexOf('\n', het + 1) + 1);
  const lay = (k: string): string | null => {
    const m = new RegExp(`^\\s*${k}\\s*:\\s*(.+)$`, 'm').exec(dau);
    return m ? m[1]!.trim().replace(/^["']|["']$/g, '') : null;
  };
  return { ten: lay('name'), moTa: lay('description'), than };
}

/** Tên phải gõ được và khớp lại được. Thư mục `Kỹ năng (mới)` sẽ không bao giờ gọi trúng. */
function tenHopLe(t: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(t);
}

async function duyet(goc: string): Promise<Array<{ ten: string; moTa: string; duong: string }>> {
  const ra: Array<{ ten: string; moTa: string; duong: string }> = [];
  const daCo = new Set<string>();
  for (const tuongDoi of THU_MUC) {
    const thuMuc = path.join(goc, ...tuongDoi.split('/'));
    let muc: string[];
    try {
      muc = await fs.readdir(thuMuc);
    } catch {
      continue;
    }
    for (const ten of muc.sort()) {
      if (ra.length >= MAX_KY_NANG) return ra;
      const goi = ten.toLowerCase();
      if (!tenHopLe(goi) || daCo.has(goi)) continue;
      const duong = path.join(thuMuc, ten, 'SKILL.md');
      const st = await fs.stat(duong).catch(() => null);
      if (!st?.isFile() || st.size > MAX_BYTE) continue;
      const noiDung = await fs.readFile(duong, 'utf8').catch(() => null);
      if (noiDung === null) continue;
      const { ten: tenKhai, moTa, than } = docDauKyNang(noiDung);
      if (than.trim() === '') continue;
      /*
       * KHÔNG có `description` ⇒ BỎ. Model chọn kỹ năng CHỈ dựa vào mô tả; một
       * kỹ năng không mô tả là một dòng vô nghĩa trong danh sách, nó vừa không
       * bao giờ được chọn đúng lúc vừa tốn token ở mọi lượt.
       */
      if (moTa === null || moTa.trim() === '') continue;
      daCo.add(goi);
      ra.push({
        ten: tenKhai && tenHopLe(tenKhai.toLowerCase()) ? tenKhai.toLowerCase() : goi,
        moTa: moTa.trim().slice(0, 300),
        duong,
      });
    }
  }
  return ra;
}

/** Danh sách gửi lên máy chủ — CHỈ tên + mô tả. */
export async function dsKyNang(goc: string): Promise<TomTatKyNang[]> {
  return (await duyet(goc)).map(({ ten, moTa }) => ({ ten, moTa }));
}

/**
 * Liệt kê file PHỤ đi kèm một kỹ năng (script, mẫu, dữ liệu).
 *
 * Trả đường dẫn TƯƠNG ĐỐI so với gốc dự án, đúng dạng `read_file` nhận — đưa
 * đường tuyệt đối thì model phải đoán cách rút gọn, và nó đoán sai.
 */
async function fileKemTheo(goc: string, thuMucKyNang: string): Promise<string[]> {
  const ra: string[] = [];
  const di = async (thuMuc: string, sau = 0): Promise<void> => {
    if (ra.length >= MAX_FILE_PHU || sau > 2) return;
    const muc = await fs.readdir(thuMuc, { withFileTypes: true }).catch(() => []);
    for (const m of muc) {
      if (ra.length >= MAX_FILE_PHU) return;
      const p = path.join(thuMuc, m.name);
      if (m.isDirectory()) { await di(p, sau + 1); continue; }
      if (m.name === 'SKILL.md') continue; // chính nó, đã nằm ngay trên
      ra.push(path.relative(goc, p).split(path.sep).join('/'));
    }
  };
  await di(thuMucKyNang);
  return ra.sort();
}

/** Thân một kỹ năng, để trả về làm kết quả tool `dung_ky_nang`. */
export async function docThanKyNang(goc: string, ten: string): Promise<string | null> {
  const t = ten.trim().toLowerCase();
  const co = (await duyet(goc)).find((k) => k.ten === t);
  if (!co) return null;
  const noiDung = await fs.readFile(co.duong, 'utf8').catch(() => null);
  if (noiDung === null) return null;
  const than = docDauKyNang(noiDung).than.trim();

  /* File đi kèm: chỉ NÓI RA là có, kèm đường dẫn. Kỹ năng thật hay mang theo
     script và file mẫu, mà trước đây model không có cách nào biết chúng tồn
     tại — nó chỉ thấy đúng chữ trong SKILL.md. */
  const kem = await fileKemTheo(goc, path.dirname(co.duong));
  if (kem.length === 0) return than;
  return `${than}\n\n---\nFILE ĐI KÈM KỸ NĂNG NÀY (dùng \`read_file\` để đọc khi cần):\n`
    + kem.map((f) => `• ${f}`).join('\n');
}
