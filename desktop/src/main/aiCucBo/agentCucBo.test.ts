/**
 * Động cơ AI Code ngoại tuyến — chạy trên một llama-server GIẢ.
 *
 * Server giả nói ĐÚNG hình dạng SSE đo thật trên llama-server b10976 +
 * Qwen3-1.7B ngày 03/10/2026: mẩu đầu `delta.role`, lời gọi tool chảy theo
 * từng mảnh `function.arguments`, kết thúc bằng `finish_reason:"tool_calls"`
 * rồi `data: [DONE]`. Mỗi lượt gọi lấy kịch bản kế tiếp trong hàng.
 */
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import {
  chayVongCucBo, docLoiGoi, docThamSo, nenNguCanh, SO_LAN_NHAC_TOOL,
  type DinhNghiaTool, type SuKienCucBo, type TinNhanCucBo,
} from './agentCucBo';

type KichBan =
  | { chu: string }
  | { goi: Array<{ name: string; arguments: string }>; chu?: string }
  | { treo: true };

const TOOLS: DinhNghiaTool[] = [
  { name: 'read_file', description: 'đọc', parameters: { type: 'object', properties: { path: { type: 'string' } } } },
  { name: 'edit_file', description: 'sửa', parameters: { type: 'object', properties: {} } },
];

let server: Server | null = null;
afterEach(async () => {
  if (server) await new Promise<void>((ok) => { server!.close(() => ok()); server!.closeAllConnections(); });
  server = null;
});

/** Dựng server giả. Trả gốc + sổ các thân request đã nhận. */
async function moServer(hang: KichBan[]): Promise<{ goc: string; nhan: Array<Record<string, unknown>> }> {
  const nhan: Array<Record<string, unknown>> = [];
  server = createServer((req, res) => {
    let than = '';
    req.on('data', (d) => { than += d; });
    req.on('end', () => {
      nhan.push(JSON.parse(than) as Record<string, unknown>);
      const kb = hang.shift() ?? { chu: 'hết kịch bản' };
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      const gui = (o: unknown) => res.write(`data: ${JSON.stringify(o)}\n\n`);
      gui({ choices: [{ index: 0, delta: { role: 'assistant', content: null }, finish_reason: null }] });
      if ('treo' in kb) return; // không bao giờ xong — để thử huỷ
      if ('chu' in kb && kb.chu) {
        for (const manh of kb.chu.match(/.{1,5}/gs) ?? []) gui({ choices: [{ index: 0, delta: { content: manh }, finish_reason: null }] });
      }
      if ('goi' in kb) {
        kb.goi.forEach((g, i) => {
          gui({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, id: `id${i}${Math.random()}`, type: 'function', function: { name: g.name, arguments: '' } }] } }] });
          for (const manh of g.arguments.match(/.{1,4}/gs) ?? []) {
            gui({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, function: { arguments: manh } }] } }] });
          }
        });
      }
      gui({ choices: [{ index: 0, delta: {}, finish_reason: 'goi' in kb ? 'tool_calls' : 'stop' }] });
      res.end('data: [DONE]\n\n');
    });
  });
  await new Promise<void>((ok) => server!.listen(0, '127.0.0.1', () => ok()));
  return { goc: `http://127.0.0.1:${(server!.address() as AddressInfo).port}`, nhan };
}

function chay(goc: string, o: Partial<Parameters<typeof chayVongCucBo>[0]> = {}) {
  const su: SuKienCucBo[] = [];
  const goiTool: Array<{ name: string; args: Record<string, unknown> }> = [];
  const hoiThoai: TinNhanCucBo[] = [{ role: 'user', content: 'sửa giúp file a.ts' }];
  const p = chayVongCucBo({
    goc, tenModel: 'Bản thử', nhan: 'chạy trên máy này', heThong: 'hệ thống', hoiThoai, tools: TOOLS,
    cuaSo: 8192, tranBuoc: 5, signal: new AbortController().signal,
    chayTool: async (g) => { goiTool.push({ name: g.name, args: g.args }); return `nội dung của ${String(g.args.path)}`; },
    phat: (e) => su.push(e),
    ...o,
  });
  return { p, su, goiTool, hoiThoai };
}

describe('vòng lặp cục bộ — đường đúng', () => {
  it('gọi tool → nối kết quả → trả lời → xong', async () => {
    const { goc, nhan } = await moServer([
      { goi: [{ name: 'read_file', arguments: '{"path": "a.ts"}' }] },
      { chu: 'File a.ts có 3 dòng.' },
    ]);
    const { p, su, goiTool, hoiThoai } = chay(goc);
    expect(await p).toBe('xong');
    expect(goiTool).toEqual([{ name: 'read_file', args: { path: 'a.ts' } }]);
    expect(su.filter((e) => e.loai === 'chu').map((e) => (e as { delta: string }).delta).join('')).toBe('File a.ts có 3 dòng.');
    expect(su.at(-1)?.loai).toBe('xong');
    /* `batDau` mang nhãn cục bộ — giao diện dựa vào nó để đổi màu. */
    expect(su.find((e) => e.loai === 'batDau')).toMatchObject({ cucBo: { ten: 'Bản thử' } });
    /* Hội thoại có đủ cặp tool_call ↔ tool, để có mạng lại máy chủ đọc được. */
    const tc = hoiThoai.find((t) => t.tool_calls?.length)!;
    expect(hoiThoai.find((t) => t.role === 'tool')?.tool_call_id).toBe(tc.tool_calls![0]!.id);
    /* Lượt thứ hai gửi kèm kết quả tool và tắt chế độ "nghĩ" của Qwen3. */
    expect(JSON.stringify(nhan[1]!.messages)).toContain('nội dung của a.ts');
    expect(nhan[0]!.chat_template_kwargs).toEqual({ enable_thinking: false });
    expect(nhan[0]!.stream).toBe(true);
  });

  it('bóc được khối <tool_call> model nhỏ viết lẫn vào chữ, và KHÔNG chảy nó lên màn hình', async () => {
    const { goc } = await moServer([
      { chu: 'Để mình xem.<tool_call>{"name": "read_file", "arguments": {"path": "b.ts"}}</tool_call>' },
      { chu: 'Xong.' },
    ]);
    const { p, su, goiTool } = chay(goc);
    expect(await p).toBe('xong');
    expect(goiTool).toEqual([{ name: 'read_file', args: { path: 'b.ts' } }]);
    const chu = su.filter((e) => e.loai === 'chu').map((e) => (e as { delta: string }).delta).join('');
    expect(chu).not.toContain('<tool_call');
    expect(chu).toContain('Để mình xem.');
  });
});

describe('vòng lặp cục bộ — tool call hỏng định dạng', () => {
  it('JSON hỏng ⇒ nhắc lại, model sửa được ⇒ đi tiếp', async () => {
    const { goc, nhan } = await moServer([
      { goi: [{ name: 'read_file', arguments: '{"path": "a.ts"' }] },   // thiếu }
      { goi: [{ name: 'read_file', arguments: '{"path": "a.ts"}' }] },
      { chu: 'Ổn.' },
    ]);
    const { p, su, goiTool } = chay(goc);
    expect(await p).toBe('xong');
    expect(goiTool).toHaveLength(1);
    expect(su.some((e) => e.loai === 'tool' && e.tomTat.includes('sai định dạng'))).toBe(true);
    /* Câu nhắc đi vào lượt sau, có liệt kê tool đúng tên. */
    expect(JSON.stringify(nhan[1]!.messages)).toContain('Tool đang có: read_file, edit_file');
  });

  it(`hỏng quá ${SO_LAN_NHAC_TOOL} lần liền ⇒ dừng với TOOL_HONG, không quay tới hết trần bước`, async () => {
    const { goc, nhan } = await moServer(Array.from({ length: 10 }, () => (
      { goi: [{ name: 'xoa_het', arguments: '{}' }] }   // tên bịa
    )));
    const { p, su, goiTool } = chay(goc);
    expect(await p).toBe('toolHong');
    expect(goiTool).toHaveLength(0);
    expect(nhan).toHaveLength(SO_LAN_NHAC_TOOL + 1);
    expect(su.at(-1)).toMatchObject({ loai: 'loi', ma: 'TOOL_HONG' });
  });

  it('phản hồi rỗng (không chữ, không tool) cũng tính là hỏng', async () => {
    const { goc } = await moServer([{ chu: '' }, { chu: 'Có chữ rồi.' }]);
    const { p } = chay(goc);
    expect(await p).toBe('xong');
  });
});

describe('vòng lặp cục bộ — trần bước + huỷ', () => {
  it('vượt trần bước ⇒ MAX_STEPS, đúng bằng trần lời gọi tool', async () => {
    const { goc } = await moServer(Array.from({ length: 20 }, (_, i) => (
      { goi: [{ name: 'read_file', arguments: `{"path": "f${i}.ts"}` }] }
    )));
    const { p, su, goiTool } = chay(goc, { tranBuoc: 3 });
    expect(await p).toBe('tranBuoc');
    expect(goiTool).toHaveLength(3);
    expect(su.at(-1)).toMatchObject({ loai: 'loi', ma: 'MAX_STEPS' });
  });

  it('gọi Y HỆT lời vừa gọi ⇒ kết quả mang lời nhắc đừng lặp', async () => {
    const { goc } = await moServer([
      { goi: [{ name: 'read_file', arguments: '{"path": "a.ts"}' }] },
      { goi: [{ name: 'read_file', arguments: '{"path": "a.ts"}' }] },
      { chu: 'Xong.' },
    ]);
    const { p, hoiThoai } = chay(goc);
    await p;
    const ketQua = hoiThoai.filter((t) => t.role === 'tool').map((t) => String(t.content));
    expect(ketQua[0]).not.toContain('Y HỆT');
    expect(ketQua[1]).toContain('Y HỆT');
  });

  it('huỷ giữa lúc model đang chảy chữ ⇒ cắt ngay, phát `huy`', async () => {
    const { goc } = await moServer([{ treo: true }]);
    const bo = new AbortController();
    const { p, su } = chay(goc, { signal: bo.signal });
    setTimeout(() => bo.abort(), 150);
    const t0 = Date.now();
    expect(await p).toBe('huy');
    expect(Date.now() - t0).toBeLessThan(3000);
    expect(su.at(-1)?.loai).toBe('huy');
  });

  it('huỷ trong lúc tool đang chạy ⇒ tool sau không chạy nhưng vẫn có kết quả (hội thoại không hỏng)', async () => {
    const { goc } = await moServer([
      { goi: [{ name: 'read_file', arguments: '{"path": "a.ts"}' }, { name: 'read_file', arguments: '{"path": "b.ts"}' }] },
    ]);
    const bo = new AbortController();
    const { p, goiTool, hoiThoai } = chay(goc, {
      signal: bo.signal,
      chayTool: async (g) => { goiTool.push({ name: g.name, args: g.args }); bo.abort(); return 'ok'; },
    });
    expect(await p).toBe('huy');
    expect(goiTool).toHaveLength(1);
    const tc = hoiThoai.find((t) => t.tool_calls?.length)!;
    const traLoi = hoiThoai.filter((t) => t.role === 'tool').map((t) => t.tool_call_id);
    expect(traLoi).toEqual(tc.tool_calls!.map((g) => g.id));
  });

  it('llama-server trả lỗi HTTP ⇒ một sự kiện lỗi tiếng Việt, không ném', async () => {
    server = createServer((_q, res) => { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end('{"error":{"message":"the request exceeds the available context size"}}'); });
    await new Promise<void>((ok) => server!.listen(0, '127.0.0.1', () => ok()));
    const { p, su } = chay(`http://127.0.0.1:${(server!.address() as AddressInfo).port}`);
    expect(await p).toBe('loi');
    expect(su.at(-1)).toMatchObject({ loai: 'loi', ma: 'CUC_BO_LOI' });
    expect((su.at(-1) as { thongDiep: string }).thongDiep).toContain('exceeds the available context');
  });
});

describe('đọc tham số + lời gọi', () => {
  it('cứu được JSON bọc ```json và dấu phẩy thừa', () => {
    expect(docThamSo('```json\n{"path": "a"}\n```')).toEqual({ path: 'a' });
    expect(docThamSo('{"path": "a",}')).toEqual({ path: 'a' });
    expect(docThamSo('')).toEqual({});
    expect(docThamSo('[1,2]')).toBeNull();
  });
  it('tên tool lạ ⇒ báo hỏng, không chạy', () => {
    const r = docLoiGoi('', [{ name: 'rm_rf', arguments: '{}' }], new Set(['read_file']));
    expect(r.goi).toHaveLength(0);
    expect(r.hong).toContain('rm_rf');
  });
});

describe('nén ngữ cảnh', () => {
  const lon = 'x'.repeat(30_000);
  const hoi: TinNhanCucBo[] = [
    { role: 'user', content: 'câu cũ 1' },
    { role: 'assistant', content: null, tool_calls: [{ id: 'a', type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 'a', content: lon },
    { role: 'assistant', content: 'trả lời cũ' },
    { role: 'user', content: 'câu đang hỏi' },
    { role: 'assistant', content: null, tool_calls: [{ id: 'b', type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 'b', content: lon },
  ];

  it('vừa ngân sách thì không đụng gì', () => {
    const r = nenNguCanh('hệ', hoi, 1_000_000);
    expect(r.daBo).toBe(0);
    expect(r.tin).toHaveLength(hoi.length);
  });

  it('tràn ⇒ bỏ cả LƯỢT cũ, giữ câu đang hỏi, và KHÔNG để tool_call mồ côi', () => {
    const r = nenNguCanh('hệ', hoi, 12_000);
    const chu = JSON.stringify(r.tin);
    expect(chu).toContain('câu đang hỏi');
    expect(chu).not.toContain('câu cũ 1');
    expect(r.token).toBeLessThanOrEqual(12_000);
    const idGoi = r.tin.flatMap((t) => t.tool_calls?.map((g) => g.id) ?? []);
    const idTra = r.tin.filter((t) => t.role === 'tool').map((t) => t.tool_call_id);
    expect(idTra.sort()).toEqual(idGoi.sort());
  });

  it('một kết quả tool khổng lồ trong lượt cuối ⇒ cắt giữa, vẫn vừa', () => {
    const r = nenNguCanh('hệ', [{ role: 'user', content: 'hỏi' }, hoi[5]!, { role: 'tool', tool_call_id: 'b', content: 'y'.repeat(200_000) }], 4000);
    expect(r.token).toBeLessThanOrEqual(4000);
    expect(JSON.stringify(r.tin)).toContain('đã lược');
  });

  it('nội dung dạng mảng (ảnh) ⇒ thành chữ, nói rõ model trên máy không xem ảnh', () => {
    const r = nenNguCanh('hệ', [{ role: 'user', content: [{ type: 'text', text: 'xem' }, { type: 'image_url' }] }], 10_000);
    expect(r.tin[0]!.content).toContain('không xem ảnh');
  });
});

describe('hứa suông — model nhỏ nói "đợi một chút" rồi dừng', () => {
  it('câu hứa không kèm tool ⇒ nhắc gọi tool ngay, lượt sau gọi thật', async () => {
    const { goc, nhan } = await moServer([
      { chu: 'Tôi cần đọc file `ma.txt` để biết giá trị. Hãy đợi một chút.' },   // nguyên văn Qwen3-1.7B, 03/10/2026
      { goi: [{ name: 'read_file', arguments: '{"path": "ma.txt"}' }] },
      { chu: 'MA_SO là 4242.' },
    ]);
    const { p, goiTool, su } = chay(goc);
    expect(await p).toBe('xong');
    expect(goiTool).toHaveLength(1);
    expect(su.some((e) => e.loai === 'tool' && e.tomTat.includes('chưa gọi tool'))).toBe(true);
    expect(JSON.stringify(nhan[1]!.messages)).toContain('CHƯA gọi tool');
  });
  it('câu trả lời bình thường (không hứa) ⇒ kết thúc luôn, không nhắc', async () => {
    const { goc, nhan } = await moServer([{ chu: 'File này định nghĩa hằng CONG.' }]);
    const { p } = chay(goc);
    expect(await p).toBe('xong');
    expect(nhan).toHaveLength(1);
  });
});
