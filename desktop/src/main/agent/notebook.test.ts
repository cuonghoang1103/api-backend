/**
 * Kiểm NOTEBOOK `.ipynb`.
 *
 * Hai rủi ro khác hẳn nhau:
 *   • ĐỌC sai ⇒ model đọc rác, tốn tiền, trả lời sai. Khó chịu.
 *   • SỬA sai ⇒ file JSON vỡ, Jupyter không mở được nữa, MẤT cả kết quả đã
 *     chạy. Không cứu lại được bằng cách đọc lại.
 * Nên bộ này nặng về phía sửa.
 */
import { describe, it, expect } from 'vitest';
import { docNotebook, suaNotebook, chuCuaO } from './notebook';

const NB = JSON.stringify({
  nbformat: 4,
  nbformat_minor: 5,
  metadata: { kernelspec: { name: 'python3' }, colab: { provenance: [] } },
  cells: [
    { cell_type: 'markdown', metadata: {}, source: ['# Tiêu đề\n', 'Mô tả.'] },
    {
      cell_type: 'code', metadata: { id: 'abc' }, execution_count: 3,
      source: ['import os\n', 'print(os.getcwd())'],
      outputs: [{ output_type: 'stream', name: 'stdout', text: ['/nha\n'] }],
    },
  ],
});

describe('đọc', () => {
  it('dựng lại thành chữ có đánh số ô, kèm đầu ra', () => {
    const r = docNotebook(NB);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.soO).toBe(2);
    expect(r.chu).toContain('ô 0 · markdown');
    expect(r.chu).toContain('# Tiêu đề');
    expect(r.chu).toContain('ô 1 · code');
    expect(r.chu).toContain('print(os.getcwd())');
    expect(r.chu).toContain('[đầu ra] /nha');
    // KHÔNG được đổ nguyên JSON ra: đó là cả lý do hàm này tồn tại.
    expect(r.chu).not.toContain('"cell_type"');
    expect(r.chu).not.toContain('nbformat');
  });

  it('ảnh trong đầu ra KHÔNG đổ base64 vào luồng chữ', () => {
    // Một ô vẽ biểu đồ có thể mang 2MB base64. Model không nhìn được nó ở dạng
    // này, nên đó là tiền trả cho rác.
    const nb = JSON.stringify({
      cells: [{
        cell_type: 'code', source: ['plot()'],
        outputs: [{ output_type: 'display_data', data: { 'image/png': 'iVBORw0KG'.repeat(9999) } }],
      }],
    });
    const r = docNotebook(nb);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.chu).not.toContain('iVBORw0KG');
    expect(r.chu).toContain('[image/png]');      // vẫn NÓI là có ảnh
  });

  it('`source` dạng chuỗi liền cũng đọc được (cả hai đều hợp lệ)', () => {
    expect(chuCuaO({ source: 'a\nb' })).toBe('a\nb');
    expect(chuCuaO({ source: ['a\n', 'b'] })).toBe('a\nb');
    expect(chuCuaO({})).toBe('');
  });

  it('JSON hỏng / không phải notebook ⇒ báo lý do, KHÔNG ném', () => {
    expect(docNotebook('{ hong')).toEqual({ ok: false, loi: expect.stringContaining('JSON') });
    expect(docNotebook('{"a":1}')).toEqual({ ok: false, loi: expect.stringContaining('cells') });
  });
});

describe('sửa theo ô', () => {
  const lai = (s: string): { cells: Array<Record<string, unknown>>; [k: string]: unknown } =>
    JSON.parse(s) as { cells: Array<Record<string, unknown>>; [k: string]: unknown };

  it('thay ô: giữ metadata, XOÁ đầu ra cũ', () => {
    const r = suaNotebook(NB, 'thay', 1, 'print(1)');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const nb = lai(r.json);
    expect(nb.cells[1]!.source).toEqual(['print(1)']);
    expect(nb.cells[1]!.metadata).toEqual({ id: 'abc' });   // GIỮ trường của ô
    // Đầu ra cũ không còn đúng với mã mới — để lại là nói dối về thứ đã chạy.
    expect(nb.cells[1]!.outputs).toEqual([]);
    expect(nb.cells[1]!.execution_count).toBeNull();
  });

  it('⛔ GIỮ NGUYÊN mọi trường lạ ở cấp notebook', () => {
    // Notebook mang metadata của kernel, Colab, extension. Vứt thứ mình không
    // hiểu là làm hỏng file của người khác một cách im lặng.
    const r = suaNotebook(NB, 'thay', 0, '# Mới');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const nb = lai(r.json) as { nbformat?: number; metadata?: { colab?: unknown } };
    expect(nb.nbformat).toBe(4);
    expect(nb.metadata?.colab).toEqual({ provenance: [] });
  });

  it('chèn và xoá đúng vị trí', () => {
    const r1 = suaNotebook(NB, 'chen', 1, 'x = 1');
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    const nb1 = lai(r1.json);
    expect(nb1.cells).toHaveLength(3);
    expect(nb1.cells[1]!.source).toEqual(['x = 1']);
    expect(nb1.cells[2]!.source).toEqual(['import os\n', 'print(os.getcwd())']);

    const r2 = suaNotebook(NB, 'xoa', 0);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(lai(r2.json).cells).toHaveLength(1);
  });

  it('chèn vào CUỐI được (chỉ số == số ô), thay/xoá thì KHÔNG', () => {
    expect(suaNotebook(NB, 'chen', 2, 'cuoi').ok).toBe(true);
    expect(suaNotebook(NB, 'thay', 2, 'x')).toEqual({ ok: false, loi: expect.stringContaining('ngoài phạm vi') });
    expect(suaNotebook(NB, 'xoa', 2)).toEqual({ ok: false, loi: expect.stringContaining('ngoài phạm vi') });
    expect(suaNotebook(NB, 'thay', -1, 'x').ok).toBe(false);
    expect(suaNotebook(NB, 'thay', 1.5, 'x').ok).toBe(false);
  });

  it('nội dung nhiều dòng ghi thành MẢNG DÒNG, giữ `\\n` cuối mỗi dòng', () => {
    // Nhét một chuỗi liền vẫn đọc được, nhưng `git diff` thành một dòng khổng
    // lồ và mọi lần sửa sau đó không xem được nữa.
    const r = suaNotebook(NB, 'thay', 1, 'a = 1\nb = 2\nprint(a+b)');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(lai(r.json).cells[1]!.source).toEqual(['a = 1\n', 'b = 2\n', 'print(a+b)']);
  });

  it('file JSON vỡ ⇒ TỪ CHỐI sửa, không ghi đè bừa', () => {
    // Ghi đè một notebook đã hỏng bằng nội dung mới sẽ xoá sạch phần còn cứu
    // được của nó.
    expect(suaNotebook('{ hong', 'thay', 0, 'x').ok).toBe(false);
    expect(suaNotebook('{"a":1}', 'thay', 0, 'x').ok).toBe(false);
  });
});
