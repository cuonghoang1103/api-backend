/**
 * Kiểm tool ghi ghi chú — ĐỐI ĐẦU BACKEND THẬT.
 *
 * Không giả `fetch`. Cả điểm của bài kiểm này là bắt những thứ chỉ lộ ra khi
 * nói chuyện với máy chủ thật: sai tên trường (`title` hay `tieuDe`?), ghi
 * nhầm `contentHtml` mà quên `contentJson` (lưu 200, ghi chú hiện TRỐNG), hay
 * chế độ "thêm" âm thầm nuốt mất chữ cũ.
 *
 * Tự BỎ QUA khi không có backend cục bộ — CI không có, và một bài kiểm đỏ vì
 * thiếu máy chủ thì lần sau không ai đọc nó nữa.
 *
 *   AGENT_NOTE_API=http://localhost:3001 AGENT_NOTE_TOKEN=<jwt> npx vitest run ghiNote
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';

const API = process.env.AGENT_NOTE_API ?? 'http://localhost:3001';
const TOKEN = process.env.AGENT_NOTE_TOKEN ?? '';

let song = false;
try {
  const r = await fetch(`${API}/api/v1/notes/tree`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  song = r.ok;
} catch { song = false; }

vi.mock('../config', () => ({ API_ORIGIN: process.env.AGENT_NOTE_API ?? 'http://localhost:3001' }));
vi.mock('../ipc/auth', () => ({
  readStoredSession: () => (process.env.AGENT_NOTE_TOKEN
    ? { userId: 0, sessionToken: process.env.AGENT_NOTE_TOKEN }
    : null),
}));

/** Người dùng luôn bấm ĐỒNG Ý. Nhánh từ chối kiểm riêng bên dưới. */
let quyetDinh: 'choPhep' | 'tuChoi' = 'choPhep';
vi.mock('./xinPhep', () => ({
  hoiNguoiDung: async () => quyetDinh,
}));

const { toolNotesTao, toolNotesGhi } = await import('./ghiNote');

const boiCanh = {
  so: { quyenDaCap: new Map() } as never,
  signal: new AbortController().signal,
  xinPhepNote: () => {},
};

const goi = async (duong: string, method = 'GET', than?: unknown) => {
  const r = await fetch(`${API}/api/v1/notes${duong}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    ...(than === undefined ? {} : { body: JSON.stringify(than) }),
  });
  const j = (await r.json().catch(() => null)) as { data?: Record<string, unknown> } | null;
  return j?.data ?? null;
};

let subjectId = 0;

beforeAll(async () => {
  if (!song) return;
  const s = await goi('/subjects', 'POST', { name: `Sổ kiểm agent ${Date.now()}` });
  subjectId = Number(s?.id ?? 0);
});

describe.skipIf(!song)('agent ghi ghi chú (backend thật)', () => {
  it('tạo ghi chú và ghi CẢ contentJson lẫn contentHtml', async () => {
    const kq = await toolNotesTao(
      { subject_id: subjectId, tieu_de: 'Kế hoạch tuần', noi_dung: '# Việc\n\n- Họp **thứ Ba**\n- Gửi báo cáo' },
      boiCanh,
    );
    expect(kq.noiDung).toContain('Đã tạo ghi chú');

    const id = Number(/id (\d+)/.exec(kq.noiDung)?.[1]);
    expect(id).toBeGreaterThan(0);

    const n = await goi(`/notes/${id}`);
    // ⚠️ Trình soạn nạp `contentJson`. Thiếu nó = ghi chú TRỐNG dù API trả 200.
    expect(n?.contentJson, 'thiếu contentJson ⇒ ghi chú hiện trống').toBeTruthy();
    expect((n!.contentJson as { type: string }).type).toBe('doc');
    expect(JSON.stringify(n!.contentJson)).toContain('thứ Ba');
    // `notes_search`/`notes_read` đọc HTML — thiếu thì agent tự tìm lại không thấy.
    expect(n!.contentHtml).toContain('<h1>Việc</h1>');
  });

  it('che_do="them" GIỮ NGUYÊN chữ cũ', async () => {
    const tao = await toolNotesTao(
      { subject_id: subjectId, tieu_de: 'Sổ nối', noi_dung: 'DÒNG CŨ PHẢI CÒN' },
      boiCanh,
    );
    const id = Number(/id (\d+)/.exec(tao.noiDung)?.[1]);

    const them = await toolNotesGhi({ id, che_do: 'them', noi_dung: 'DÒNG MỚI' }, boiCanh);
    expect(them.noiDung).toContain('Đã nối');

    const n = await goi(`/notes/${id}`);
    const chu = JSON.stringify(n?.contentJson);
    expect(chu, 'chế độ "thêm" đã nuốt mất chữ cũ').toContain('DÒNG CŨ PHẢI CÒN');
    expect(chu).toContain('DÒNG MỚI');
  });

  it('che_do="thay" viết đè toàn bộ', async () => {
    const tao = await toolNotesTao(
      { subject_id: subjectId, tieu_de: 'Sổ đè', noi_dung: 'BẢN CŨ' },
      boiCanh,
    );
    const id = Number(/id (\d+)/.exec(tao.noiDung)?.[1]);

    await toolNotesGhi({ id, che_do: 'thay', noi_dung: 'BẢN MỚI' }, boiCanh);
    const chu = JSON.stringify((await goi(`/notes/${id}`))?.contentJson);
    expect(chu).toContain('BẢN MỚI');
    expect(chu).not.toContain('BẢN CŨ');
  });

  it('người dùng TỪ CHỐI ⇒ không có gì được ghi', async () => {
    const tao = await toolNotesTao({ subject_id: subjectId, tieu_de: 'Sổ từ chối', noi_dung: 'GIỮ NGUYÊN' }, boiCanh);
    const id = Number(/id (\d+)/.exec(tao.noiDung)?.[1]);

    quyetDinh = 'tuChoi';
    const kq = await toolNotesGhi({ id, che_do: 'thay', noi_dung: 'KHÔNG ĐƯỢC GHI' }, boiCanh);
    quyetDinh = 'choPhep';

    expect(kq.noiDung).toContain('TỪ CHỐI');
    const chu = JSON.stringify((await goi(`/notes/${id}`))?.contentJson);
    expect(chu).toContain('GIỮ NGUYÊN');
    expect(chu).not.toContain('KHÔNG ĐƯỢC GHI');
  });

  it('subject_id không có thật ⇒ lỗi CHỈ ĐƯỜNG, không phải "lỗi không rõ"', async () => {
    // Chữ này đi thẳng vào hội thoại cho model đọc; nó phải nói được bước tiếp
    // theo, nếu không model cứ đoán số rồi thử lại mãi.
    const kq = await toolNotesTao({ subject_id: 999999, tieu_de: 'x', noi_dung: 'y' }, boiCanh);
    expect(kq.noiDung).toContain('notes_tree');
  });

  it('thiếu subject_id ⇒ bảo model gọi notes_tree, KHÔNG đoán', async () => {
    const kq = await toolNotesTao({ tieu_de: 'x', noi_dung: 'y' }, boiCanh);
    expect(kq.noiDung).toContain('ĐỪNG đoán');
  });
});
