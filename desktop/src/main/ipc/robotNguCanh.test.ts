/**
 * ============================================================
 * ⭐ KHUNG CHAT NHANH PHẢI GỬI `history` — NẾU KHÔNG NÓ KHÔNG NHỚ GÌ
 * ============================================================
 *
 * Người dùng 19/09/2026, kèm ảnh khung chat của robot: *"sao con AI này không
 * nhớ được tin nhắn cũ vậy… cả 3 model mini, pro và max"*. Trong ảnh, họ gửi
 * ảnh đề rồi hỏi lại, và trợ lý đáp *"mình không có đề bài hay nội dung nào
 * cả"*.
 *
 * Nguyên nhân KHÔNG liên quan tới model: `POST /ai/chat` chỉ dùng `sessionId`
 * để GHI (`ai.service.ts`), còn ngữ cảnh model thấy đến duy nhất từ `history`
 * mà client gửi — và chỗ này chưa từng gửi nó.
 *
 * ⚠️ Phép kiểm soi THÂN YÊU CẦU THẬT, không soi hàm dựng chuỗi. Đó là tầng
 * duy nhất mà lỗi này lộ ra: `tsc` xanh, giao diện xanh, chỉ có người dùng
 * nhận ra sau vài lượt hỏi.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({ Menu: {}, BrowserWindow: {}, app: { getPath: () => '/tmp' } }));
vi.mock('./index', () => ({ handle: () => {} }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia' }));
vi.mock('./auth', () => ({ readStoredSession: () => ({ sessionToken: 'tk' }) }));
vi.mock('../store', () => ({ getSettings: () => ({ odinNgonNgu: 'vi' }), setSetting: () => {} }));
vi.mock('../phimRobot', () => ({ phimDeDoc: () => '', phimRobotHienTai: () => '' }));
vi.mock('../robotMenu', () => ({ bangMenuRobot: () => [] }));
vi.mock('../robotTin', () => ({ baoNhac: () => {} }));
vi.mock('../aiCucBo/hoi', () => ({ ganNhan: (c: string) => c, hoiMay: async () => null, sanChoLuoiDo: () => false }));

import { hoiTroLy, xoaNguCanhRobot } from './robot';

/** Thân của MỌI lời gọi tới `/ai/chat`, theo thứ tự. */
const than: Array<Record<string, unknown>> = [];

/** Dòng SSE giả trả về một câu. */
function luongSSE(chu: string): ReadableStream<Uint8Array> {
  const ma = new TextEncoder();
  return new ReadableStream({
    start(dk) {
      dk.enqueue(ma.encode(`data: ${JSON.stringify({ type: 'chunk', text: chu })}\n\n`));
      dk.close();
    },
  });
}

beforeEach(() => {
  than.length = 0;
  xoaNguCanhRobot();
  vi.stubGlobal('fetch', vi.fn(async (url: string, opt?: { body?: string }) => {
    if (String(url).endsWith('/ai/chat/sessions')) {
      return { ok: true, json: async () => ({ data: { sessionId: 'phien-1' } }) } as unknown as Response;
    }
    than.push(JSON.parse(opt?.body ?? '{}') as Record<string, unknown>);
    return { ok: true, body: luongSSE('xong rồi nhé') } as unknown as Response;
  }));
});

describe('⭐ ngữ cảnh của khung chat nhanh', () => {
  it('⛔ lượt THỨ HAI phải mang theo lượt thứ nhất', async () => {
    await hoiTroLy('tk', 'Thủ đô Pháp là gì?', false);
    await hoiTroLy('tk', 'Dân số bao nhiêu?', false);

    expect(than).toHaveLength(2);
    const ls = than[1]!.history as Array<{ role: string; content: string }>;
    expect(ls).toEqual([
      { role: 'user', content: 'Thủ đô Pháp là gì?' },
      { role: 'assistant', content: 'xong rồi nhé' },
    ]);
  });

  it('⛔ lượt ĐẦU gửi history RỖNG, không phải thiếu trường', async () => {
    // Thiếu hẳn trường và gửi mảng rỗng đi hai đường khác nhau ở máy chủ.
    await hoiTroLy('tk', 'Chào bạn', false);
    expect(than[0]).toHaveProperty('history');
    expect(than[0]!.history).toEqual([]);
  });

  it('⛔ câu ĐANG hỏi KHÔNG được lọt vào history — model sẽ đọc nó hai lần', async () => {
    await hoiTroLy('tk', 'Câu một', false);
    const ls = than[0]!.history as unknown[];
    expect(ls).toHaveLength(0);
    expect(than[0]!.message).toBe('Câu một');
  });

  it('bắt đầu cuộc MỚI thì quên sạch ngữ cảnh', async () => {
    await hoiTroLy('tk', 'Câu cũ', false);
    xoaNguCanhRobot();
    await hoiTroLy('tk', 'Câu mới', false);
    expect(than[1]!.history).toEqual([]);
  });

  it('lượt HỎNG không để lại câu hỏi mồ côi trong ngữ cảnh', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => (
      String(url).endsWith('/ai/chat/sessions')
        ? { ok: true, json: async () => ({ data: { sessionId: 'p' } }) } as unknown as Response
        : { ok: false, status: 500 } as unknown as Response
    )));
    await hoiTroLy('tk', 'Câu hỏng', false);

    than.length = 0;
    vi.stubGlobal('fetch', vi.fn(async (url: string, opt?: { body?: string }) => {
      if (String(url).endsWith('/ai/chat/sessions')) {
        return { ok: true, json: async () => ({ data: { sessionId: 'p' } }) } as unknown as Response;
      }
      than.push(JSON.parse(opt?.body ?? '{}') as Record<string, unknown>);
      return { ok: true, body: luongSSE('ok') } as unknown as Response;
    }));
    await hoiTroLy('tk', 'Câu sau', false);
    expect(than[0]!.history).toEqual([]);
  });
});

describe('⭐ ảnh phải theo người dùng qua các lượt', () => {
  it('⛔ gửi ảnh đề rồi hỏi tiếp ⇒ ảnh được KÈM LẠI', async () => {
    // Đây đúng là ảnh người dùng gửi: đoạn chat A có ảnh, đoạn chat B chỉ gõ
    // lại yêu cầu — và trợ lý đáp "mình không có đề bài nào cả".
    await hoiTroLy('tk', 'Giải giúp mình', false, { anh: ['data:image/png;base64,DE'] });
    await hoiTroLy('tk', 'Chỉ cần đáp án A,B,C,D thôi', false);

    expect(than[0]!.images).toEqual(['data:image/png;base64,DE']);
    expect(than[1]!.images).toEqual(['data:image/png;base64,DE']);
  });

  it('đính ảnh MỚI thì dùng ảnh mới, không kéo ảnh cũ theo', async () => {
    await hoiTroLy('tk', 'đề 1', false, { anh: ['data:A'] });
    await hoiTroLy('tk', 'đề 2', false, { anh: ['data:B'] });
    expect(than[1]!.images).toEqual(['data:B']);
  });

  it('chưa từng có ảnh ⇒ KHÔNG gửi trường images', async () => {
    await hoiTroLy('tk', 'chào', false);
    expect(than[0]).not.toHaveProperty('images');
  });
});
