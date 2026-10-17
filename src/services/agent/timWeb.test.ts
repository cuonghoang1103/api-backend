/**
 * `tim_web` — ba nguồn (SearXNG → Tavily → Claude chính hãng), KHÔNG gọi mạng
 * hay CSDL thật: mọi phụ thuộc được thay bằng `_datPhuThuocTimWeb`, Tavily
 * bằng `fetch` giả.
 *
 * Cách hỏng nguy hiểm nhất của một tool tìm kiếm KHÔNG phải là ném lỗi, mà là
 * trả về RỖNG: model đọc "không có kết quả" rồi nói với người dùng "tôi không
 * tìm thấy gì" — trong khi sự thật là chưa cấu hình / bị chặn / hết hạn mức.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  _datPhuThuocTimWeb, docKetQuaAnthropic, thanTimAnthropic, thuTuNguon, timWeb, timWebSanSang,
  type PhuThuocTimWeb,
} from './timWeb.js';
import { kieuWebSearch } from './anthropicChinhHang/caiDat.js';

function xoaKhoa(): void {
  delete process.env.TAVILY_API_KEY;
  delete process.env.SEARCH_API_KEY;
}

/** Bộ phụ thuộc giả. Mặc định: SearXNG rỗng, cổng chính hãng KHÔNG có key. */
function gia(o: {
  searxng?: PhuThuocTimWeb['searxng'];
  coKey?: boolean;
  quyen?: { khongGioiHan: boolean; chan: string | null };
  daDung?: number;
  json?: unknown;
  goi?: Array<Record<string, unknown>>;
  ghi?: Array<Record<string, unknown>>;
} = {}): PhuThuocTimWeb {
  return {
    searxng: o.searxng ?? (async () => []),
    anthropic: {
      coKey: async () => o.coKey ?? false,
      quyen: async () => o.quyen ?? { khongGioiHan: false, chan: null },
      demHomNay: async () => o.daDung ?? 0,
      gui: async (x) => { o.goi?.push(x.body); return { json: o.json ?? {}, keyId: 7, batDau: Date.now(), ttfbMs: 5 }; },
      ghi: async (d) => { o.ghi?.push(d as never); return 0.0123; },
    },
  };
}

const JSON_ANTHROPIC = {
  content: [
    { type: 'server_tool_use', id: 's1', name: 'web_search', input: { query: 'vite 7 release' } },
    {
      type: 'web_search_tool_result', tool_use_id: 's1', content: [
        { type: 'web_search_result', url: 'https://a.dev/x', title: 'Trang A', page_age: '2 days ago', encrypted_content: 'zz' },
        { type: 'web_search_result', url: 'https://b.dev/y', title: 'Trang B', encrypted_content: 'zz' },
      ],
    },
    {
      type: 'text', text: 'Vite 7 ra ngày X.',
      citations: [{ type: 'web_search_result_location', url: 'https://b.dev/y', title: 'Trang B', cited_text: 'Vite 7.0 released', encrypted_index: 'q' }],
    },
  ],
  usage: { input_tokens: 9000, output_tokens: 200, server_tool_use: { web_search_requests: 1 } },
};

test.afterEach(() => { _datPhuThuocTimWeb(null); xoaKhoa(); delete process.env.AGENT_TIM_WEB_NGUON; delete process.env.AGENT_TIM_WEB_LUOT_NGAY; });

test('không nguồn nào chạy được: nói RÕ chưa cấu hình, KHÔNG trả rỗng', async () => {
  xoaKhoa();
  _datPhuThuocTimWeb(gia());
  /* SearXNG tắt (bản thật ném NguonTat khi SEARXNG_ENABLED=false) — ở đây bỏ khỏi thứ tự. */
  process.env.AGENT_TIM_WEB_NGUON = 'tavily,anthropic';
  const r = await timWeb({ q: 'thư viện abc bản mới nhất' }, 1);
  assert.equal(timWebSanSang(), false);
  assert.ok(r.content.includes('CHƯA ĐƯỢC CẤU HÌNH'), r.content);
  assert.ok(r.content.includes('TAVILY_API_KEY'), 'phải nêu đúng tên biến cần cắm');
  assert.ok(/KHÔNG phải/.test(r.content), 'phải phân biệt với "không tìm thấy gì"');
  assert.equal(r.summary, 'chưa cấu hình');
});

test('đọc được cả hai tên biến khoá Tavily', () => {
  xoaKhoa();
  assert.equal(timWebSanSang(), false);
  process.env.SEARCH_API_KEY = 'x';
  assert.equal(timWebSanSang(), true, '`SEARCH_API_KEY` là tên thứ hai, phải nhận');
});

test('thiếu "q" thì báo lỗi, KHÔNG đi gọi nguồn nào', async () => {
  let goi = 0;
  _datPhuThuocTimWeb(gia({ searxng: async () => { goi++; return []; } }));
  const r = await timWeb({});
  assert.equal(r.summary, 'thiếu câu hỏi');
  assert.equal(goi, 0);
});

test('SearXNG có kết quả ⇒ dùng nó, KHÔNG tốn tiền cổng chính hãng', async () => {
  const goi: Array<Record<string, unknown>> = [];
  _datPhuThuocTimWeb(gia({
    coKey: true, goi,
    searxng: async () => [{ tieuDe: 'Docs', url: 'https://x.dev/docs', trich: 'đoạn', ngay: '2026-10-01' }],
  }));
  const r = await timWeb({ q: 'x' }, 1);
  assert.match(r.content, /SearXNG/);
  assert.match(r.content, /Ngày: 2026-10-01/);
  assert.match(r.content, /ghi nguồn/, 'phải dặn trích nguồn');
  assert.equal(goi.length, 0);
});

test('SearXNG rỗng ⇒ lùi sang Tavily (fetch giả, không mạng)', async (t) => {
  process.env.TAVILY_API_KEY = 'k';
  _datPhuThuocTimWeb(gia());
  const goc = globalThis.fetch;
  t.after(() => { globalThis.fetch = goc; });
  globalThis.fetch = (async () => new Response(JSON.stringify({
    results: [{ title: 'T', url: 'https://t.dev', content: 'nội dung', published_date: '2026-09-30T10:00:00Z' }],
  }), { status: 200 })) as typeof fetch;
  const r = await timWeb({ q: 'x' }, 1);
  assert.match(r.content, /Tavily/);
  assert.match(r.content, /Ngày: 2026-09-30/);
});

test('lùi tới cổng chính hãng: dùng Haiku + web_search bản CƠ BẢN, ghi sổ viec tim_web', async () => {
  const goi: Array<Record<string, unknown>> = [];
  const ghi: Array<Record<string, unknown>> = [];
  _datPhuThuocTimWeb(gia({ coKey: true, json: JSON_ANTHROPIC, goi, ghi }));
  const r = await timWeb({ q: 'vite 7 release', so: 3 }, 42);
  assert.equal(goi.length, 1);
  const than = goi[0]! as any;
  assert.equal(than.model, 'claude-haiku-5-5');
  assert.equal(than.tools[0].type, 'web_search_20250305', 'Haiku không nhận bản lọc động _20260209');
  assert.equal(ghi.length, 1);
  assert.equal((ghi[0] as any).userId, 42);
  assert.equal((ghi[0] as any).dung.timWeb, 1, 'số lần tìm phải vào sổ để tính $0,01/lần');
  assert.match(r.content, /Claude web search/);
  assert.match(r.content, /Vite 7\.0 released/);
  assert.match(r.summary, /0\.012 \$/);
  // Nguồn được trích lên đầu.
  assert.ok(r.content.indexOf('Trang B') < r.content.indexOf('Trang A'));
});

test('cổng chính hãng: hết lượt/ngày hoặc bị chặn ⇒ LỖI nói rõ, KHÔNG gọi Anthropic', async () => {
  const goi: Array<Record<string, unknown>> = [];
  process.env.AGENT_TIM_WEB_LUOT_NGAY = '3';
  _datPhuThuocTimWeb(gia({ coKey: true, daDung: 3, goi, json: JSON_ANTHROPIC }));
  const r = await timWeb({ q: 'x' }, 5);
  assert.equal(goi.length, 0);
  assert.match(r.content, /^LỖI/);
  assert.match(r.content, /3\/3 lần hôm nay/);
  assert.match(r.content, /KHÔNG phải "không có kết quả"/);

  _datPhuThuocTimWeb(gia({ coKey: true, goi, quyen: { khongGioiHan: false, chan: 'Bạn đã dùng hết hạn mức CuongMini Free hôm nay' } }));
  const r2 = await timWeb({ q: 'x' }, 5);
  assert.equal(goi.length, 0);
  assert.match(r2.content, /hết hạn mức/);
});

test('admin không giới hạn: bỏ qua trần lượt/ngày', async () => {
  const goi: Array<Record<string, unknown>> = [];
  process.env.AGENT_TIM_WEB_LUOT_NGAY = '0';
  _datPhuThuocTimWeb(gia({ coKey: true, daDung: 999, goi, json: JSON_ANTHROPIC, quyen: { khongGioiHan: true, chan: null } }));
  const r = await timWeb({ q: 'x' }, 1);
  assert.equal(goi.length, 1);
  assert.match(r.content, /Trang A/);
});

test('không có userId (gọi lạ) ⇒ KHÔNG bao giờ tiêu tiền cổng chính hãng', async () => {
  const goi: Array<Record<string, unknown>> = [];
  _datPhuThuocTimWeb(gia({ coKey: true, goi, json: JSON_ANTHROPIC }));
  await timWeb({ q: 'x' });
  assert.equal(goi.length, 0);
});

test('chuẩn hoá phản hồi: lỗi server tool (HTTP 200, content là object) không thành "0 kết quả"', () => {
  const d = docKetQuaAnthropic({ content: [{ type: 'web_search_tool_result', content: { type: 'web_search_tool_result_error', error_code: 'too_many_requests' } }] });
  assert.equal(d.loi, 'too_many_requests');
  assert.equal(d.ds.length, 0);
  const d2 = docKetQuaAnthropic(JSON_ANTHROPIC);
  assert.deepEqual(d2.ds.map((m) => m.url), ['https://b.dev/y', 'https://a.dev/x']);
  assert.equal(d2.ds[1]!.ngay, '2 days ago');
  assert.equal(d2.dung.input, 9000);
});

test('bản web_search theo model + thứ tự nguồn đổi bằng env', () => {
  assert.equal(kieuWebSearch('claude-haiku-5-5'), 'web_search_20250305');
  assert.equal(kieuWebSearch('claude-fable-5-1'), 'web_search_20250305');
  assert.equal(kieuWebSearch('claude-sonnet-5-5'), 'web_search_20260209');
  assert.equal(kieuWebSearch('claude-opus-5-5'), 'web_search_20260209');
  assert.equal((thanTimAnthropic('q', 3, 'claude-sonnet-5-5').tools as any)[0].type, 'web_search_20260209');
  process.env.AGENT_TIM_WEB_NGUON = 'anthropic, searxng, rác';
  assert.deepEqual(thuTuNguon(), ['anthropic', 'searxng']);
  process.env.AGENT_TIM_WEB_NGUON = 'rác';
  assert.deepEqual(thuTuNguon(), ['searxng', 'tavily', 'anthropic']);
});

test("là vòng MÁY CHỦ — khoá không bao giờ xuống app; serverTools truyền userId", () => {
  const t = readFileSync(new URL('./tools.ts', import.meta.url), 'utf8');
  const i = t.indexOf("name: 'tim_web'");
  assert.ok(i > -1, 'không thấy khai báo tim_web');
  assert.ok(t.slice(i, i + 500).includes("ring: 'server'"), "phải là ring:'server'");
  const s = readFileSync(new URL('./serverTools.ts', import.meta.url), 'utf8');
  assert.match(s, /timWeb\(args, userId\)/, 'thiếu userId ⇒ nhánh cổng chính hãng không bao giờ chạy / không tính được hạn mức');
});

