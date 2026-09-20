/**
 * ============================================================
 * ⭐ KHUNG TERMINAL PHẢI GỬI `history` — NẾU KHÔNG NÓ KHÔNG NHỚ GÌ
 * ============================================================
 *
 * `CyberTerminal` (khung terminal xanh ở `/dashboard/cyber-tasks`) gọi
 * `POST /api/v1/ai/chat` với thân chỉ có `{ message, topK: 5 }`. Máy chủ KHÔNG
 * nhớ hộ — `streamChat` chỉ dùng `sessionId` để GHI, còn ngữ cảnh model thấy
 * đến duy nhất từ `history` mà client gửi. Nên hỏi câu thứ hai là model không
 * biết câu đầu. Cùng một lỗi với ba đường bên app desktop, vá ở `326d04c3`.
 *
 * ⚠️ Phép kiểm soi THÂN YÊU CẦU THẬT (stub `fetch`, đọc `JSON.parse(opt.body)`),
 * không soi hàm dựng chuỗi. Đó là tầng DUY NHẤT mà lỗi này lộ ra: `tsc` xanh,
 * giao diện xanh, chữ vẫn chảy ra đẹp đẽ — chỉ có người dùng nhận ra sau vài
 * lượt hỏi. Theo mẫu `desktop/src/main/ipc/robotNguCanh.test.ts`.
 *
 * Chạy: `npx tsx --test frontend/src/lib/nguCanhChat.test.ts` (đã nằm trong
 * `npm test` ở gốc kho, tức là chạy trong bộ kiểm bắt buộc của `deploy-nha.sh`).
 */
import { beforeEach, afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SO_LUOT_NGU_CANH, taoMachChat } from './nguCanhChat';

type Than = Record<string, unknown>;
type Luot = { role: string; content: string };

/** Thân của MỌI lời gọi tới `/ai/chat`, theo thứ tự. */
const than: Than[] = [];
/** Header của mọi lời gọi, theo thứ tự. */
const mu: Array<Record<string, string>> = [];
/** Đường dẫn của mọi lời gọi, theo thứ tự. */
const duong: string[] = [];

const fetchThat = globalThis.fetch;

/** Luồng SSE giả trả về một câu, cắt làm hai mẩu để giống hàng thật. */
function luongSSE(chu: string): ReadableStream<Uint8Array> {
  const ma = new TextEncoder();
  const giua = Math.ceil(chu.length / 2);
  return new ReadableStream({
    start(dk) {
      dk.enqueue(ma.encode(`data: ${JSON.stringify({ type: 'chunk', text: chu.slice(0, giua) })}\n\n`));
      dk.enqueue(ma.encode(`data: ${JSON.stringify({ type: 'chunk', text: chu.slice(giua) })}\n\n`));
      dk.close();
    },
  });
}

/** Cắm `fetch` giả; `traLoi` quyết định máy chủ đáp gì cho lượt thứ mấy. */
function camFetch(traLoi: (lan: number) => { ok: boolean; chu?: string }): void {
  let lan = 0;
  globalThis.fetch = (async (url: unknown, opt?: { body?: string; headers?: Record<string, string> }) => {
    duong.push(String(url));
    than.push(JSON.parse(opt?.body ?? '{}') as Than);
    mu.push(opt?.headers ?? {});
    const dap = traLoi(lan);
    lan += 1;
    return dap.ok
      ? { ok: true, body: luongSSE(dap.chu ?? 'xong rồi nhé') }
      : { ok: false, status: 500, body: null };
  }) as unknown as typeof globalThis.fetch;
}

beforeEach(() => {
  than.length = 0;
  mu.length = 0;
  duong.length = 0;
  camFetch(() => ({ ok: true }));
});

afterEach(() => {
  globalThis.fetch = fetchThat;
});

describe('⭐ ngữ cảnh của khung terminal cyber', () => {
  it('⛔ lượt THỨ HAI phải mang theo lượt thứ nhất', async () => {
    const mach = taoMachChat({ layToken: () => '' });
    await mach.hoi('Thủ đô Pháp là gì?');
    await mach.hoi('Dân số bao nhiêu?');

    assert.equal(than.length, 2);
    assert.deepEqual(than[1]!.history as Luot[], [
      { role: 'user', content: 'Thủ đô Pháp là gì?' },
      { role: 'assistant', content: 'xong rồi nhé' },
    ]);
  });

  it('⛔ lượt ĐẦU gửi history RỖNG, không phải THIẾU trường', async () => {
    // Thiếu hẳn trường và gửi mảng rỗng đi hai đường khác nhau ở máy chủ:
    // `Array.isArray(req.body.history)` (ai.routes.ts) chỉ nhận đường thứ hai.
    const mach = taoMachChat({ layToken: () => '' });
    await mach.hoi('Chào bạn');

    assert.ok(Object.hasOwn(than[0]!, 'history'), 'thân phải CÓ trường history');
    assert.deepEqual(than[0]!.history as Luot[], []);
  });

  it('⛔ câu ĐANG hỏi KHÔNG được lọt vào history — model sẽ đọc nó hai lần', async () => {
    const mach = taoMachChat({ layToken: () => '' });
    await mach.hoi('Câu một');

    assert.deepEqual(than[0]!.history as Luot[], []);
    assert.equal(than[0]!.message, 'Câu một');
  });

  it('⛔ chỉ gửi 10 lượt GẦN NHẤT, và cắt ở đúng mép', async () => {
    const mach = taoMachChat({ layToken: () => '' });
    // 6 lượt hỏi ⇒ 12 lượt trong vòng nhớ trước câu thứ 7.
    for (let i = 1; i <= 6; i += 1) await mach.hoi(`Câu ${i}`);
    await mach.hoi('Câu bảy');

    const ls = than[6]!.history as Luot[];
    assert.equal(ls.length, SO_LUOT_NGU_CANH);
    // Cắt phần ĐẦU, giữ phần ĐUÔI: lượt cũ nhất còn lại là câu 2, không phải câu 1.
    assert.deepEqual(ls[0], { role: 'user', content: 'Câu 2' });
    assert.deepEqual(ls[ls.length - 1], { role: 'assistant', content: 'xong rồi nhé' });
    assert.ok(!ls.some((l) => l.content === 'Câu 1'), 'câu 1 phải đã trôi ra khỏi cửa sổ');
    assert.ok(!ls.some((l) => l.content === 'Câu bảy'), 'câu đang hỏi không được nằm trong history');
  });

  it('gửi sessionId để máy chủ GHI LẠI được lượt chat', async () => {
    const mach = taoMachChat({ layToken: () => '', phien: 'phien-thu' });
    await mach.hoi('Câu một');
    await mach.hoi('Câu hai');

    assert.equal(than[0]!.sessionId, 'phien-thu');
    assert.equal(than[1]!.sessionId, 'phien-thu', 'cả cuộc phải dùng CHUNG một phiên');
  });

  it('lời chào tự phát cũng nằm trong ngữ cảnh', async () => {
    const mach = taoMachChat({ layToken: () => '' });
    mach.ghiLuot('assistant', 'Tôi là CuongMini.');
    await mach.hoi('Bạn là ai?');

    assert.deepEqual(than[0]!.history as Luot[], [
      { role: 'assistant', content: 'Tôi là CuongMini.' },
    ]);
  });

  it('⛔ lượt HỎNG không để lại câu hỏi MỒ CÔI trong ngữ cảnh', async () => {
    camFetch((lan) => ({ ok: lan !== 0 })); // lượt đầu chết, lượt sau sống
    const mach = taoMachChat({ layToken: () => '' });

    await assert.rejects(() => mach.hoi('Câu hỏng'));
    await mach.hoi('Câu sau');

    assert.equal(than.length, 2);
    assert.deepEqual(than[1]!.history as Luot[], [], 'câu hỏng phải bị gỡ khỏi vòng nhớ');
  });

  it('gọi ĐÚNG endpoint, và kèm token khi có', async () => {
    const mach = taoMachChat({ layToken: () => 'tk-123' });
    await mach.hoi('Câu một');

    assert.equal(duong[0], '/api/v1/ai/chat');
    assert.equal(mu[0]!.Authorization, 'Bearer tk-123');
    assert.equal(than[0]!.topK, 5);
  });

  it('KHÔNG kèm header Authorization khi chưa đăng nhập', async () => {
    const mach = taoMachChat({ layToken: () => '' });
    await mach.hoi('Câu một');

    assert.ok(!('Authorization' in mu[0]!), 'khách vãng lai không được gửi header rỗng');
  });

  it('câu trả lời ghép đủ từ NHIỀU mẩu SSE rồi mới vào ngữ cảnh', async () => {
    camFetch(() => ({ ok: true, chu: 'Paris là thủ đô nước Pháp' }));
    const mach = taoMachChat({ layToken: () => '' });

    const dap = await mach.hoi('Thủ đô Pháp?');
    assert.equal(dap, 'Paris là thủ đô nước Pháp');

    await mach.hoi('Dân số?');
    const ls = than[1]!.history as Luot[];
    assert.equal(ls[1]!.content, 'Paris là thủ đô nước Pháp');
  });
});
