/**
 * CTW K-3b — đo tải NHẸ đồng soạn thảo Docs: N client (mặc định 5) cùng một trang, mỗi client gõ M lần xen kẽ.
 * Đo: thời gian bắt tay + đồng bộ đầu, độ trễ lan truyền (client A gõ ⇒ mọi client khác thấy), hội tụ cuối, nội dung
 * xuống DB. Tự tạo người dùng/không gian/dự án tạm và XOÁ theo đúng id đã tạo.
 *
 *   npx tsx scripts/ctw-k3b-tai.mts --api http://localhost:3171 [--clients 5] [--edits 40]
 *
 * Cần backend đang chạy (có gateway /notes-collaboration/work-docs) trên CSDL cục bộ. KHÔNG trỏ vào production.
 */
import jwt from 'jsonwebtoken';
import * as Y from 'yjs';
import { config } from '../src/config/env.js';
import { prisma } from '../src/config/database.js';
import { connectCollab, type CollabTestClient } from '../src/services/work/collabWsClient.js';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const API = arg('api', 'http://localhost:3171');
const N = Number(arg('clients', '5'));
const M = Number(arg('edits', '40'));
if (!/localhost|127\.0\.0\.1/.test(API)) throw new Error('Chỉ đo trên máy cục bộ');
const tag = `k3bload${Date.now().toString(36)}`;
const ids: number[] = [];

async function user(i: number) {
  const u = await prisma.user.create({ data: { username: `${tag}_${i}`, email: `${tag}_${i}@test.local` } });
  ids.push(u.id);
  return { id: u.id, email: u.email!, token: jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret) };
}
async function call(token: string, method: string, path: string, body?: unknown) {
  const r = await fetch(`${API}/api/v1/work${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
  const j = (await r.json().catch(() => ({}))) as { data?: any };
  if (!r.ok) throw new Error(`${method} ${path} ⇒ ${r.status} ${JSON.stringify(j)}`);
  return j.data;
}
const pct = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))] ?? 0; };
const textOf = (d: Y.Doc) => d.getXmlFragment('default').toString();

const clients: CollabTestClient[] = [];
try {
  const users = await Promise.all(Array.from({ length: N }, (_, i) => user(i)));
  const owner = users[0];
  const ws = await call(owner.token, 'POST', '/workspaces', { name: `Load ${tag}` });
  await call(owner.token, 'POST', `/workspaces/${ws.id}/invites`, { emails: users.slice(1).map((u) => u.email), role: 'MEMBER' });
  const p = await call(owner.token, 'POST', `/workspaces/${ws.id}/projects`, { key: 'LD', name: 'Load', template: 'COMPANY', kind: 'CLIENT' });
  const page = await call(owner.token, 'POST', `/projects/${p.id}/pages`, { templateKey: 'fpt-report2-project-management-plan' });

  const t0 = Date.now();
  const joinMs: number[] = [];
  for (const u of users) {
    const s = await call(u.token, 'GET', `/projects/${p.id}/pages/${page.number}/collab`);
    const start = Date.now();
    const c = connectCollab(`${API.replace(/^http/, 'ws')}${s.websocketPath}`, s.documentName, s.token);
    clients.push(c);
    await c.scope;
    await c.synced;
    joinMs.push(Date.now() - start);
  }
  console.log(`${N} client vào phòng trong ${Date.now() - t0} ms · bắt tay+đồng bộ: p50 ${pct(joinMs, 50)} ms, max ${Math.max(...joinMs)} ms`);

  // Mỗi vòng: một client (xoay vòng) chèn một dấu riêng vào khối ngẫu nhiên; đo tới khi MỌI client khác thấy dấu đó.
  const lat: number[] = [];
  const findText = (d: Y.Doc, idx: number): Y.XmlText | null => {
    const walk = (n: Y.XmlElement | Y.XmlText): Y.XmlText | null => {
      if (n instanceof Y.XmlText) return n;
      for (const k of n.toArray()) { const t = walk(k as Y.XmlElement); if (t) return t; }
      return null;
    };
    const frag = d.getXmlFragment('default');
    return walk(frag.get(idx % frag.length) as Y.XmlElement);
  };
  const tEdits = Date.now();
  for (let k = 0; k < M * N; k++) {
    const who = clients[k % N];
    const mark = `⟨${k}⟩`;
    const t = findText(who.doc, Math.floor(Math.random() * 30)) ?? findText(who.doc, 0)!;
    const sent = Date.now();
    // Chèn ở ĐẦU/CUỐI đoạn (chèn ngẫu nhiên giữa chừng có thể cắt đôi dấu của lượt trước ⇒ đếm "mất" giả).
    t.insert(k % 2 ? t.length : 0, mark);
    await Promise.all(clients.filter((c) => c !== who).map((c) => c.until(() => textOf(c.doc).includes(mark), 10_000)));
    lat.push(Date.now() - sent);
  }
  const editMs = Date.now() - tEdits;
  console.log(`${M * N} lần sửa trong ${editMs} ms (${((M * N) / (editMs / 1000)).toFixed(1)} lần/s) · lan truyền tới mọi client: p50 ${pct(lat, 50)} ms · p95 ${pct(lat, 95)} ms · max ${Math.max(...lat)} ms`);

  // Gõ ĐỒNG THỜI (không chờ nhau) rồi kiểm hội tụ.
  const burst = Date.now();
  await Promise.all(clients.map(async (c, i) => {
    for (let k = 0; k < 20; k++) { findText(c.doc, i + k)?.insert(0, `[${i}.${k}]`); await new Promise((r) => setTimeout(r, 5)); }
  }));
  const ref = () => textOf(clients[0].doc);
  await clients[0].until(() => clients.every((c) => textOf(c.doc) === ref()), 15_000);
  console.log(`gõ đồng thời ${N}×20 rồi hội tụ sau ${Date.now() - burst} ms — ${clients.every((c) => textOf(c.doc) === ref()) ? 'MỌI client giống hệt nhau' : 'LỆCH'}`);

  const finalClient = textOf(clients[0].doc);
  const lostOnClient = Array.from({ length: M * N }, (_, k) => `⟨${k}⟩`).filter((m) => !finalClient.includes(m)).length;
  for (const c of clients) c.close();
  await new Promise((r) => setTimeout(r, 2500));
  if (process.env.K3B_DEBUG) {
    const { docJson } = await import('../src/services/work/collabDoc.js');
    const { tiptapToText } = await import('../src/services/work/tiptapText.js');
    const st0 = await prisma.workPageCollab.findUniqueOrThrow({ where: { pageId: page.id }, select: { state: true } });
    const d = new Y.Doc(); Y.applyUpdate(d, new Uint8Array(st0.state!));
    const t = tiptapToText(docJson(d));
    const miss = (x: string) => Array.from({ length: M * N }, (_, k) => `⟨${k}⟩`).filter((m) => !x.includes(m));
    console.log('debug: client', lostOnClient, '· Yjs xml', miss(textOf(d)).length, '· json text', miss(t).length);
    const m0 = miss(t)[0];
    if (m0) { const x = textOf(d); const i = x.indexOf(m0); console.log(m0, '…', x.slice(Math.max(0, i - 160), i + 40)); }
  }
  const row = await prisma.workPage.findFirstOrThrow({ where: { projectId: p.id, number: page.number }, select: { contentText: true } });
  const missing = Array.from({ length: M * N }, (_, k) => `⟨${k}⟩`).filter((m) => !row.contentText?.includes(m));
  const st = await prisma.workPageCollab.findUnique({ where: { pageId: page.id }, select: { byteSize: true, updateCount: true } });
  const versions = await prisma.workPageVersion.count({ where: { pageId: page.id } });
  console.log(`DB: thiếu ${missing.length}/${M * N} dấu · trạng thái Yjs ${(st?.byteSize ?? 0) / 1024 | 0} KB · ${st?.updateCount} bản cập nhật · ${versions} phiên bản trang`);
} finally {
  for (const c of clients) c.close();
  if (ids.length) await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
}
