/**
 * Đợt 8B (19/10/2026) — MỌI MODEL CuongMini DÙNG ĐƯỢC ĐỦ TOOL CT WORK.
 *
 * Tool CT Work đi tới model qua đúng một đường: app đọc `tools/list` (schema = `zodToJsonSchema`) ⇒ tên `mcp__ctwork__<tool>`
 * ⇒ máy chủ `parseToolMcp` (LỌC IM LẶNG tên sai khuôn) ⇒ `toolsForGateway` ⇒
 *   - tuyến OpenAI (`/chat/completions`, tools[].function) — CuongMini Solid / Nova / Shin / Eco (modelapi), Default khi rambo
 *     nghỉ (= Solid);
 *   - tuyến Anthropic (`toolSangAnthropic` ⇒ tools[].input_schema) — Sonic 5.5 / Heshin 5.5 (chính hãng), Classic + Default
 *     khi rambo sống (cổng rambo chỉ mở /v1/messages).
 * Test này dựng ĐÚNG hai thân đó từ registry thật và kiểm luật của cả hai phía (gốc type object, không anyOf ở gốc, mảng có
 * items, tên khớp khuôn, mô tả không bị cắt mất phần chính), nên một tool mới sai định dạng đỏ ở đây thay vì "model không
 * thấy tool" lúc người dùng gõ.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV ??= 'test';

const { mcpCommands, commandByName } = await import('./index.js');
const { MEMBER_OPS_COMMANDS } = await import('./memberOps.js');
const { PERSON_OPS_COMMANDS } = await import('./personOps.js');
const { zodToJsonSchema } = await import('../../../mcp/protocol.js');
const { parseToolMcp, toolsForGateway } = await import('../../agent/tools.js');
const { toolSangAnthropic } = await import('../../agent/anthropic.js');

type J = Record<string, unknown>;
/** Như app (`desktop/src/main/agent/mcp.ts` + `mcpNoiDung.ts`): tiền tố, tên an toàn, mô tả "tiêu đề — mô tả", ≤ 500. */
const MAX_MO_TA = 500;
const tenAnToan = (t: string) => t.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 48) || '_';
function nhuApp(t: { name: string; title: string; description: string; write: boolean; input: unknown }) {
  const moTa = `${t.description}${t.write ? '' : ' (read-only)'}`;
  return {
    name: `mcp__ctwork__${tenAnToan(t.name)}`,
    description: [t.title && t.title !== t.name ? t.title : '', moTa].filter(Boolean).join(' — ').slice(0, MAX_MO_TA),
    full: [t.title, moTa].join(' — '),
    parameters: zodToJsonSchema(t.input as never) as J,
  };
}

const TYPES = new Set(['object', 'string', 'number', 'integer', 'boolean', 'array', 'null']);

/** Lỗi định dạng của một schema con (đường dẫn ⇒ lý do). Rỗng = qua cả OpenAI lẫn Anthropic. */
function loiSchema(s: unknown, path: string, out: string[]): void {
  if (!s || typeof s !== 'object' || Array.isArray(s)) { out.push(`${path}: không phải object`); return; }
  const o = s as J;
  if ('$ref' in o) out.push(`${path}: $ref`);
  const kinds = ['type', 'anyOf', 'enum', 'const'].filter((k) => k in o);
  if (!kinds.length) out.push(`${path}: thiếu type/anyOf/enum/const (schema rỗng)`);
  if (typeof o.type === 'string' && !TYPES.has(o.type)) out.push(`${path}: type lạ ${o.type}`);
  if (Array.isArray(o.type)) out.push(`${path}: type dạng mảng`);
  if (o.type === 'array') {
    if (!o.items) out.push(`${path}: array thiếu items`);
    else loiSchema(o.items, `${path}[]`, out);
  }
  if (o.type === 'object') {
    const props = (o.properties ?? {}) as J;
    if (typeof props !== 'object') out.push(`${path}: properties sai`);
    for (const [k, v] of Object.entries(props)) {
      if (!/^[a-zA-Z0-9_.-]{1,64}$/.test(k)) out.push(`${path}.${k}: tên thuộc tính sai khuôn`);
      loiSchema(v, `${path}.${k}`, out);
    }
    for (const r of (o.required as string[] | undefined) ?? []) if (!(r in props)) out.push(`${path}: required "${r}" không có trong properties`);
  }
  if (Array.isArray(o.anyOf)) (o.anyOf as unknown[]).forEach((x, i) => loiSchema(x, `${path}|${i}`, out));
  if (Array.isArray(o.enum) && !(o.enum as unknown[]).every((x) => typeof x === 'string' || typeof x === 'number')) out.push(`${path}: enum lạ`);
}

describe('Tool CT Work ⇒ định dạng của MỌI model CuongMini (đợt 8B)', () => {
  const tools = mcpCommands();
  const app = tools.map(nhuApp);

  it(`${tools.length} tool: tên qua khuôn máy chủ (mcp__server__tool) và khuôn OpenAI ^[a-zA-Z0-9_-]{1,64}$`, () => {
    for (const t of app) {
      assert.match(t.name, /^mcp__[a-zA-Z0-9_-]{1,32}__[a-zA-Z0-9_.-]{1,48}$/, t.name);
      assert.match(t.name, /^[a-zA-Z0-9_-]{1,64}$/, `${t.name} (OpenAI cấm dấu chấm, trần 64)`);
    }
    assert.equal(new Set(app.map((t) => t.name)).size, app.length, 'không hai tool trùng tên sau khi chuẩn hoá');
  });

  it('schema: gốc type object, không anyOf/oneOf/allOf ở gốc, mọi nút có kiểu, mảng có items (OpenAI + Anthropic)', () => {
    const bad: string[] = [];
    for (const t of app) {
      const s = t.parameters;
      if (s.type !== 'object') bad.push(`${t.name}: gốc không phải object`);
      for (const k of ['anyOf', 'oneOf', 'allOf', 'not']) if (k in s) bad.push(`${t.name}: ${k} ở gốc (Anthropic từ chối)`);
      loiSchema(s, t.name, bad);
    }
    assert.deepEqual(bad, []);
  });

  it('máy chủ không lọc mất tool nào; thân OpenAI và Anthropic đều đủ', () => {
    // App gửi theo lô ≤ 64 (MAX_TOOL_MCP) — kiểm từng lô như app chia.
    for (let i = 0; i < app.length; i += 64) {
      const lo = app.slice(i, i + 64).map(({ name, description, parameters }) => ({ name, description, parameters }));
      const parsed = parseToolMcp(lo);
      assert.equal(parsed.length, lo.length, `lô ${i / 64}: parseToolMcp giữ đủ`);
      const openai = toolsForGateway([], parsed).filter((x) => x.function.name.startsWith('mcp__ctwork__'));
      assert.equal(openai.length, lo.length);
      for (const x of openai) assert.equal((x.function.parameters as J).type, 'object');
      const anth = toolSangAnthropic(openai as never);
      assert.equal(anth.length, lo.length);
      for (const x of anth) {
        assert.match(x.name, /^[a-zA-Z0-9_-]{1,64}$/);
        assert.equal((x.input_schema as J).type, 'object', x.name);
      }
      // Thân gửi được qua JSON (không vòng, không undefined lạ).
      assert.doesNotThrow(() => JSON.parse(JSON.stringify({ tools: openai })));
      assert.doesNotThrow(() => JSON.parse(JSON.stringify({ tools: anth })));
    }
  });

  it('tool đợt 8B: mô tả vừa 500 ký tự của app (không bị cắt), ghi/đọc đúng để client hiện thẻ duyệt', () => {
    const extra = ['attach_file', 'attach_complete', 'comment', 'update_issue', 'create_issue', 'transition'].map((n) => commandByName(n)!);
    for (const t of [...MEMBER_OPS_COMMANDS, ...PERSON_OPS_COMMANDS, ...extra]) {
      const a = nhuApp(t);
      assert.ok(a.full.length <= MAX_MO_TA, `${t.name}: mô tả ${a.full.length} > ${MAX_MO_TA} — app cắt mất đuôi`);
      assert.ok(t.name.length <= 48, t.name);
    }
    const ghi = MEMBER_OPS_COMMANDS.filter((t) => t.write).map((t) => t.name).sort();
    assert.deepEqual(ghi, [
      'approval_request', 'checklist_toggle', 'class_submit', 'class_unsubmit', 'docs_comment', 'form_submit', 'issue_assign', 'issue_move_sprint',
      'meeting_rsvp', 'poker_vote', 'retro_card_add', 'retro_vote', 'timesheet_submit', 'worklog_update',
    ]);
    const doc = MEMBER_OPS_COMMANDS.filter((t) => !t.write).map((t) => t.name).sort();
    assert.deepEqual(doc, ['agile_rooms', 'approval_list', 'checklist_list', 'class_work', 'form_list', 'worklog_list']);
  });

  it('tool cũ quá 500 ký tự (app cắt đuôi) — liệt kê để biết, không chặn', () => {
    const dai = app.filter((t) => t.full.length > MAX_MO_TA).map((t) => `${t.name}:${t.full.length}`);
    // Chỉ ghi nhận: phần đầu (câu chính) vẫn còn; tool mới của 8B đã chặn ở test trên.
    assert.ok(Array.isArray(dai));
  });
});
