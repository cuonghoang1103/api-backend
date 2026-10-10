/**
 * CT Work đợt 7b — luật thuần: forms (formRules), bộ đọc import (importParsers), chữ ký + payload kênh ngoài (intakeRules),
 * chấm điểm knowledge base (kbRules).   npx tsx --test src/services/work/ctw7b.test.ts
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { describe, it } from 'node:test';
import {
  describeAnswers, formClosedReason, looksLikeBot, normalizeFields, normalizeMapping, renderTitle, summarize, validateAnswers, visibleFields,
} from './formRules.js';
import { crossCheck, parseAsana, parseJiraComment, parseJiraCsv, parseTable, parseTrello, statusCategoryOf, suggestMapping, tableFromSheet } from './importParsers.js';
import { parseCsv } from './exchange.service.js';
import {
  discordSign, maskSecret, openSecret, parseAddress, proposalFromDiscord, proposalFromEmail, proposalFromZalo, rawPublicKeyHex, sealSecret, stripQuoted,
  svixSign, verifyDiscord, verifySvix, verifyZalo, zaloMac,
} from './intakeRules.js';
import { excerpt, rankArticles, tokens } from './kbRules.js';
import { asanaCsvSample, asanaJsonSample, genericCsvSample, genericXlsxSample, jiraCsvSample, trelloSample } from './ctw7b.samples.js';
import { readXlsx } from './xlsxStyled.js';

// ═══ Forms ═══════════════════════════════════════════════════════

describe('formRules', () => {
  const fields = normalizeFields([
    { kind: 'text', label: 'Summary', required: true },
    { kind: 'select', label: 'Kind', options: ['Bug', 'Idea'], required: true },
    { kind: 'longtext', label: 'Steps to reproduce', required: true, showIf: { field: 'kind', equals: 'Bug' } },
    { kind: 'number', label: 'Severity', min: 1, max: 5 },
    { kind: 'date', label: 'Needed by' },
    { kind: 'multiselect', label: 'Areas', options: ['Web', 'App'] },
    { kind: 'file', label: 'Screenshot' },
    { kind: 'user', label: 'Owner' },
  ]);

  it('chuẩn hoá: id từ nhãn (bỏ dấu, không trùng), showIf phải trỏ lên trên + đúng lựa chọn', () => {
    assert.deepEqual(fields.map((f) => f.id), ['summary', 'kind', 'steps_to_reproduce', 'severity', 'needed_by', 'areas', 'screenshot', 'owner']);
    assert.throws(() => normalizeFields([{ kind: 'text', label: 'A', showIf: { field: 'b', equals: 'x' } }, { kind: 'select', id: 'b', label: 'B', options: ['x'] }]), /ABOVE/);
    assert.throws(() => normalizeFields([{ kind: 'select', label: 'B', options: ['x'] }, { kind: 'text', label: 'C', showIf: { field: 'b', equals: 'nope' } }]), /not an option/);
    assert.throws(() => normalizeFields([{ kind: 'select', label: 'Empty', options: [] }]), /at least one option/);
    assert.throws(() => normalizeFields([{ kind: 'html', label: 'X' }]), /Unknown field type/);
    const ids = normalizeFields([{ kind: 'text', label: 'Đồ án' }, { kind: 'text', label: 'Đồ án' }]).map((f) => f.id);
    assert.equal(new Set(ids).size, 2);
  });

  it('ẩn/hiện: trường ẩn không bắt buộc và câu trả lời bị bỏ', () => {
    assert.equal(visibleFields(fields, { kind: 'Idea' }).some((f) => f.id === 'steps_to_reproduce'), false);
    const idea = validateAnswers(fields, { summary: 'Dark mode', kind: 'Idea', steps_to_reproduce: 'ignored' });
    assert.deepEqual(idea.errors, []);
    assert.equal(idea.values.steps_to_reproduce, undefined);
    const bug = validateAnswers(fields, { summary: 'Crash', kind: 'Bug' });
    assert.deepEqual(bug.errors, [{ id: 'steps_to_reproduce', code: 'REQUIRED' }]);
  });

  it('kiểm từng kiểu: lựa chọn lạ, số ngoài khoảng, ngày sai, người ngoài dự án, tệp sai kiểu/quá lớn', () => {
    const r = validateAnswers(fields, {
      summary: 'x', kind: 'Other', severity: 9, needed_by: '2026-13-45', areas: ['Web', 'TV'], owner: 99,
      screenshot: [{ name: 'a.exe', type: 'application/x-msdownload', size: 10 }],
    }, new Set([1, 2]));
    const codes = Object.fromEntries(r.errors.map((e) => [e.id, e.code]));
    assert.deepEqual(codes, { kind: 'INVALID', severity: 'INVALID', needed_by: 'INVALID', areas: 'INVALID', screenshot: 'FILE_TYPE', owner: 'INVALID' });
    const big = validateAnswers(fields, { summary: 'x', kind: 'Idea', screenshot: [{ name: 'a.png', type: 'image/png', size: 6 * 1024 * 1024 }] });
    assert.deepEqual(big.errors, [{ id: 'screenshot', code: 'FILE_TOO_BIG' }]);
    const ok = validateAnswers(fields, { summary: '  Ok ', kind: 'Idea', severity: '3', needed_by: '2026-10-20', areas: ['Web', 'Web'], owner: 2 }, new Set([2]));
    assert.deepEqual(ok.errors, []);
    assert.deepEqual(ok.values, { summary: 'Ok', kind: 'Idea', severity: 3, needed_by: '2026-10-20', areas: ['Web'], owner: 2 });
  });

  it('tiêu đề theo mẫu, mô tả, tổng hợp', () => {
    const people = new Map([[2, 'Lan']]);
    const v = { summary: 'Crash on save', kind: 'Bug', owner: 2, areas: ['Web'] };
    assert.equal(renderTitle('[{kind}] {summary} — {owner}', fields, v, 'Feedback', 'anon', people), '[Bug] Crash on save — Lan');
    assert.equal(renderTitle('{missing}', fields, v, 'Feedback', 'anon'), 'Crash on save');
    assert.equal(renderTitle(null, fields, {}, 'Feedback', 'anon'), 'Feedback — anon');
    assert.deepEqual(describeAnswers(fields, v, people), ['Summary: Crash on save', 'Kind: Bug', 'Areas: Web', 'Owner: Lan']);
    const s = summarize(fields, [{ answers: { kind: 'Bug', severity: 4, areas: ['Web', 'App'] } }, { answers: { kind: 'Idea', severity: 2, areas: ['Web'] } }, { answers: { kind: 'Bug' } }]);
    assert.deepEqual(s.find((x) => x.id === 'kind')?.counts, [{ option: 'Bug', n: 2 }, { option: 'Idea', n: 1 }]);
    assert.equal(s.find((x) => x.id === 'severity')?.average, 3);
    assert.deepEqual(s.find((x) => x.id === 'areas')?.counts, [{ option: 'Web', n: 2 }, { option: 'App', n: 1 }]);
  });

  it('ánh xạ, đóng form, honeypot', () => {
    assert.deepEqual(normalizeMapping({ typeKey: 'bug', labelIds: [1, 1, -3, 'x'], priority: 9, customFields: { '7': 'summary', x: 'kind', '8': 'BAD ID' } }), { typeKey: null, titleTemplate: null, labelIds: [1], assigneeId: null, priority: null, customFields: { 7: 'summary' } });
    assert.equal(formClosedReason({ status: 'DRAFT', closesAt: null, maxResponses: null }, 0), 'CLOSED');
    assert.equal(formClosedReason({ status: 'OPEN', closesAt: new Date(Date.now() - 1000), maxResponses: null }, 0), 'EXPIRED');
    assert.equal(formClosedReason({ status: 'OPEN', closesAt: null, maxResponses: 2 }, 2), 'FULL');
    assert.equal(formClosedReason({ status: 'OPEN', closesAt: null, maxResponses: 2 }, 1), null);
    assert.equal(looksLikeBot({ website: 'http://spam' }), true);
    assert.equal(looksLikeBot({ elapsedMs: 300 }), true);
    assert.equal(looksLikeBot({ website: '', elapsedMs: 9000 }), false);
    assert.equal(looksLikeBot({}), false);
  });
});

// ═══ Import ══════════════════════════════════════════════════════

describe('importParsers', () => {
  it('Trello: bỏ thẻ lưu trữ, cột ⇒ trạng thái, nhãn (tên hoặc màu), người không email, bình luận, checklist, ngày tạo từ id', () => {
    const p = parseTrello(trelloSample());
    assert.equal(p.items.length, 3);
    assert.match(p.notes[0], /1 archived/);
    const login = p.items[0];
    assert.equal(login.statusName, 'Doing');
    assert.equal(login.statusCategory, 'IN_PROGRESS');
    assert.deepEqual(login.labels, ['frontend', 'red']);
    assert.equal(login.assignee?.name, 'Lan Pham');
    assert.equal(login.assignee?.email, null);
    assert.equal(login.due, '2026-10-20');
    assert.equal(login.comments.length, 1);
    assert.deepEqual(login.checklist, [{ title: 'Email field', done: true }, { title: 'Password field', done: false }]);
    assert.equal(login.created, new Date(parseInt('650a1b2c', 16) * 1000).toISOString().slice(0, 10));
    assert.equal(p.items[1].statusCategory, 'DONE');
    assert.throws(() => parseTrello('{"foo":1}'), /not a Trello board/);
    assert.throws(() => parseTrello('nope'), /not valid JSON/);
  });

  it('Asana CSV: hoàn thành ⇒ Done, email người làm, tag, task con theo TÊN cha', () => {
    const p = parseAsana(asanaCsvSample());
    assert.equal(p.items.length, 3);
    assert.equal(p.items[0].assignee?.email, 'lan@example.com');
    assert.deepEqual(p.items[0].labels, ['payments', 'web']);
    assert.equal(p.items[1].statusCategory, 'DONE');
    assert.equal(p.items[2].parentExternalId, '1201');
    assert.equal(p.items[2].typeName, 'Sub-task');
  });

  it('Asana JSON: subtask lồng, bình luận từ stories, ưu tiên từ custom field', () => {
    const p = parseAsana(asanaJsonSample());
    assert.deepEqual(p.items.map((i) => i.externalId), ['9001', '9002']);
    assert.equal(p.items[0].priority, 2);
    assert.equal(p.items[0].comments.length, 1);
    assert.equal(p.items[1].parentExternalId, '9001');
    assert.equal(p.items[1].statusCategory, 'DONE');
  });

  it('Jira CSV: cột lặp gộp, bình luận "ngày;id;chữ", việc con trỏ Parent id, tiêu đề rỗng là lỗi dòng', () => {
    const p = parseJiraCsv(jiraCsvSample());
    crossCheck(p.items);
    assert.equal(p.items.length, 3);
    const a = p.items[0];
    assert.deepEqual(a.labels, ['web', 'ux']);
    assert.equal(a.comments.length, 2);
    assert.equal(a.comments[0].at, '2026-09-23');
    assert.equal(a.comments[0].text, 'Start with titles only');
    assert.equal(a.storyPoints, 5);
    assert.equal(a.priority, 2);
    assert.equal(p.items[1].parentExternalId, '10001');
    assert.deepEqual(p.items[2].errors, ['Title is empty']);
    assert.deepEqual(parseJiraComment('just text'), { at: null, author: null, text: 'just text' });
  });

  it('CSV chung: gợi ý ghép cột tiếng Việt, ngày dd/mm/yyyy, cảnh báo ngày/điểm sai, mã băm ổn định khi nhập lại', () => {
    const table = parseCsv(genericCsvSample());
    const m = suggestMapping(table[0]);
    assert.equal(m.title, 0);
    assert.equal(m.description, 1);
    assert.equal(m.assignee, 2);
    assert.equal(m.due, 3);
    assert.equal(m.status, 5);
    const p = parseTable(table);
    assert.equal(p.items.length, 3, 'dòng trống bị bỏ');
    assert.equal(p.items[0].assignee?.email, 'lan@example.com');
    assert.equal(p.items[0].statusCategory, 'IN_PROGRESS');
    assert.equal(p.items[0].priority, 2);
    assert.equal(p.items[1].due, '2026-10-25');
    assert.equal(p.items[1].statusCategory, 'DONE');
    assert.ok(p.items[1].warnings.some((w) => /not a number/.test(w)));
    assert.ok(p.items[2].warnings.some((w) => /due date/.test(w)));
    assert.equal(parseTable(table).items[0].externalId, p.items[0].externalId);
    // ghép tay đè gợi ý
    assert.equal(parseTable(table, { title: 1 }).items[0].title, 'Bảng user + order');
  });

  it('Excel: đọc sheet đầu, ngày ⇒ YYYY-MM-DD', () => {
    const sheet = readXlsx(genericXlsxSample())[0];
    const p = parseTable(tableFromSheet(sheet));
    assert.equal(p.items.length, 2);
    assert.equal(p.items[0].title, 'Prepare demo');
    assert.equal(p.items[0].assignee?.email, 'lan@example.com');
    assert.equal(p.items[1].statusCategory, 'DONE');
  });

  it('trạng thái theo tên', () => {
    assert.equal(statusCategoryOf('Đang làm'), 'IN_PROGRESS');
    assert.equal(statusCategoryOf('Hoàn thành'), 'DONE');
    assert.equal(statusCategoryOf('Backlog'), 'TODO');
    assert.equal(statusCategoryOf(''), null);
  });
});

// ═══ Kênh ngoài ═════════════════════════════════════════════════

describe('intakeRules', () => {
  const secret = `whsec_${Buffer.from('k'.repeat(32)).toString('base64')}`;
  const body = Buffer.from(JSON.stringify({ type: 'email.received', data: { email_id: 'em_1', from: 'Lan <lan@example.com>', to: ['req@in.example.com'], subject: 'Re: Export broken', text: 'The CSV export fails.\n\nOn Mon, Bob wrote:\n> old text' } }));
  const now = Date.now();
  const ts = String(Math.floor(now / 1000));

  it('Svix (Resend): đúng chữ ký ⇒ ok + nonce; sai ⇒ BAD_SIGNATURE; quá 5 phút ⇒ STALE; thiếu header ⇒ MISSING', () => {
    const sig = svixSign(secret, 'msg_1', ts, body);
    assert.deepEqual(verifySvix(secret, { id: 'msg_1', timestamp: ts, signature: `v1,bogus ${sig}` }, body, now), { ok: true, nonce: 'svix:msg_1' });
    assert.deepEqual(verifySvix(secret, { id: 'msg_1', timestamp: ts, signature: sig }, Buffer.from(`${body} `), now), { ok: false, reason: 'BAD_SIGNATURE' });
    const old = String(Math.floor(now / 1000) - 600);
    assert.deepEqual(verifySvix(secret, { id: 'msg_1', timestamp: old, signature: svixSign(secret, 'msg_1', old, body) }, body, now), { ok: false, reason: 'STALE' });
    assert.deepEqual(verifySvix(secret, { id: 'msg_1', timestamp: ts }, body, now), { ok: false, reason: 'MISSING' });
  });

  it('Discord Ed25519: ký bằng khoá riêng ⇒ public key kiểm đúng; đổi 1 byte ⇒ sai', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const hex = rawPublicKeyHex(publicKey);
    assert.match(hex, /^[0-9a-f]{64}$/);
    const b = Buffer.from('{"type":1}');
    const sig = discordSign(privateKey, ts, b);
    assert.deepEqual(verifyDiscord(hex, { signature: sig, timestamp: ts }, b, now), { ok: true });
    assert.deepEqual(verifyDiscord(hex, { signature: sig, timestamp: ts }, Buffer.from('{"type":2}'), now), { ok: false, reason: 'BAD_SIGNATURE' });
    assert.deepEqual(verifyDiscord(hex, { signature: 'zz', timestamp: ts }, b, now), { ok: false, reason: 'BAD_SIGNATURE' });
  });

  it('Zalo: mac = sha256(appId + body + timestamp + secret)', () => {
    const ev = Buffer.from(JSON.stringify({ event_name: 'user_send_text', timestamp: String(now), sender: { id: 'u9' }, message: { msg_id: 'mid1', text: '#task Fix the menu\nIt overlaps on iPhone' } }));
    const mac = zaloMac('123456', ev, String(now), 'oa-secret');
    assert.deepEqual(verifyZalo({ appId: '123456', oaSecret: 'oa-secret' }, `mac=${mac}`, ev, now), { ok: true, nonce: 'zalo:mid1' });
    assert.equal(verifyZalo({ appId: '123456', oaSecret: 'other' }, `mac=${mac}`, ev, now).ok, false);
    const d = proposalFromZalo(JSON.parse(ev.toString()), '#task');
    assert.ok(d && d !== 'IGNORED');
    assert.equal((d as { title: string }).title, 'Fix the menu');
    assert.equal(proposalFromZalo({ event_name: 'user_send_text', message: { text: 'hello' } }, '#task'), 'IGNORED');
    assert.equal(proposalFromZalo({ event_name: 'follow' }, ''), 'IGNORED');
  });

  it('payload email: lọc theo địa chỉ kênh, bỏ trích thư cũ + "Re:"', () => {
    const d = proposalFromEmail(JSON.parse(body.toString()), 'req@in.example.com');
    assert.ok(d && d !== 'IGNORED');
    const x = d as Exclude<typeof d, 'IGNORED' | null>;
    assert.equal(x.title, 'Export broken');
    assert.equal(x.body, 'The CSV export fails.');
    assert.equal(x.senderHandle, 'lan@example.com');
    assert.equal(x.senderName, 'Lan');
    assert.equal(proposalFromEmail(JSON.parse(body.toString()), 'other@in.example.com'), 'IGNORED');
    assert.deepEqual(parseAddress('"A B" <A@B.co>'), { name: 'A B', email: 'a@b.co' });
    assert.equal(stripQuoted('hi\n-- \nsig'), 'hi');
  });

  it('payload Discord: /ctwork new (lệnh con) và lệnh phẳng; lệnh khác ⇒ null', () => {
    const sub = proposalFromDiscord({ type: 2, id: '111', data: { name: 'ctwork', options: [{ type: 1, name: 'new', options: [{ name: 'title', value: 'Add dark mode' }, { name: 'details', value: 'Settings page' }] }] }, member: { user: { id: '42', username: 'lan' } } });
    assert.equal(sub?.title, 'Add dark mode');
    assert.equal(sub?.senderHandle, 'discord:42');
    assert.equal(proposalFromDiscord({ type: 2, id: '1', data: { name: 'ctwork', options: [{ name: 'title', value: 'Flat' }] } })?.title, 'Flat');
    assert.equal(proposalFromDiscord({ type: 2, id: '1', data: { name: 'ctwork', options: [{ type: 1, name: 'list', options: [] }] } }), null);
    assert.equal(proposalFromDiscord({ type: 2, id: '1', data: { name: 'other' } }), null);
  });

  it('bí mật: mã hoá ⇒ mở lại đúng; sai AAD (kênh khác) ⇒ null; che khi hiện', () => {
    const t = sealSecret('whsec_abc123456', 'ctw-intake:tok1', 'jwt');
    assert.ok(t.startsWith('i1.') && !t.includes('whsec'));
    assert.equal(openSecret(t, 'ctw-intake:tok1', 'jwt'), 'whsec_abc123456');
    assert.equal(openSecret(t, 'ctw-intake:tok2', 'jwt'), null);
    assert.equal(openSecret(t, 'ctw-intake:tok1', 'other-jwt'), null);
    assert.equal(maskSecret('whsec_abc123456'), 'whsec_…3456');
  });
});

// ═══ Knowledge base ═════════════════════════════════════════════

describe('kbRules', () => {
  const list = [
    { id: 1, title: 'Đặt lại mật khẩu', content: 'Vào trang đăng nhập, bấm Quên mật khẩu, nhập email để nhận link.', keywords: 'password reset', helpful: 5, notHelpful: 0 },
    { id: 2, title: 'Xuất báo cáo CSV', content: 'Mở Reports, chọn Export CSV.', keywords: null, helpful: 0, notHelpful: 3 },
    { id: 3, title: 'Login with Google', content: 'Use the Google button on the sign-in page.', keywords: null, helpful: 0, notHelpful: 0 },
  ];
  it('không dấu + từ dừng', () => {
    assert.deepEqual(tokens('Tôi không đặt lại được mật khẩu'), ['dat', 'lai', 'mat', 'khau']);
  });
  it('tìm kiếm xếp theo điểm; deflection cần ≥ 2 từ khớp', () => {
    assert.equal(rankArticles(list, 'quen mat khau')[0].id, 1);
    assert.deepEqual(rankArticles(list, 'password reset not working', { deflect: true }).map((a) => a.id), [1]);
    assert.deepEqual(rankArticles(list, 'google', { deflect: true }).map((a) => a.id), [3], 'một từ trong câu một từ vẫn được gợi ý');
    assert.deepEqual(rankArticles(list, 'invoice payment failed', { deflect: true }), []);
  });
  it('đoạn trích quanh từ khớp', () => {
    const long = `${'x '.repeat(200)}mật khẩu mới ${'y '.repeat(200)}`;
    assert.match(excerpt(long, 'mat khau'), /^….*mật khẩu mới/);
  });
});
