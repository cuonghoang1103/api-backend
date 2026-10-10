/**
 * CT Work đợt 6 — D3: ĐO HIỆU NĂNG DỰ ÁN LỚN (10.000 thẻ + lịch sử).
 *
 *   npx tsx scripts/perf-10k.ts seed     # tạo không gian "perf10k" + dự án PERF: 10k thẻ, ~40k lịch sử, 3k bình luận,
 *                                        # 3k worklog, 12 sprint, 8 người, 20 nhãn — ~30 giây
 *   npx tsx scripts/perf-10k.ts bench    # đo p50/p95/max của các API chính (mỗi tuyến 3 lượt khởi động + 20 lượt đo)
 *   npx tsx scripts/perf-10k.ts bench --json scratchpad/q6/perf-after.json
 *   npx tsx scripts/perf-10k.ts drop     # xoá sạch không gian + người dùng thử
 *
 * Chạy trong tiến trình: dựng express với work.routes (như test DB) trên cổng ngẫu nhiên — KHÔNG đụng backend đang chạy.
 * Chỉ Postgres cục bộ (chặn host khác); storage sandbox bật (không chạm R2 thật).
 */
process.env.STORAGE_SANDBOX ??= 'memory';

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

const TAG = 'perf10k';
const N_ISSUES = Number(process.env.PERF_ISSUES || 10_000);
const RUNS = Number(process.env.PERF_RUNS || 20);
/** Số request song song mỗi lượt (đo dưới tải: 8 người cùng mở). */
const CONC = Number(process.env.PERF_CONC || 1);

async function main() {
  const url = new URL(process.env.DATABASE_URL ?? (await import('dotenv')).config().parsed?.DATABASE_URL ?? '');
  if (!['localhost', '127.0.0.1', '::1', 'postgres'].includes(url.hostname)) throw new Error(`Refusing: DATABASE_URL host ${url.hostname} is not local`);
  const { prisma } = await import('../src/config/database.js');
  const cmd = process.argv[2];
  try {
    if (cmd === 'seed') await seed(prisma);
    else if (cmd === 'bench') await bench(prisma);
    else if (cmd === 'drop') await drop(prisma);
    else console.log('usage: perf-10k.ts seed | bench [--json file] | drop');
  } finally {
    await prisma.$disconnect();
  }
}

type P = Awaited<typeof import('../src/config/database.js')>['prisma'];

async function drop(prisma: P) {
  const ws = await prisma.workSpace.findMany({ where: { name: 'Perf 10k', members: { some: { user: { username: `${TAG}_u0` } } } }, select: { id: true } });
  if (ws.length) await prisma.workSpace.deleteMany({ where: { id: { in: ws.map((w) => w.id) } } });
  const users = await prisma.user.findMany({ where: { username: { startsWith: `${TAG}_` } }, select: { id: true } });
  if (users.length) {
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: users.map((u) => u.id) } }, { senderId: { in: users.map((u) => u.id) } }] } });
    await prisma.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
  }
  console.log(`dropped ${ws.length} workspace(s), ${users.length} user(s)`);
}

async function app() {
  const express = (await import('express')).default;
  const { errorHandler } = await import('../src/middleware/errorHandler.js');
  const { default: workRoutes } = await import('../src/routes/work.routes.js');
  const a = express();
  a.use(express.json({ limit: '10mb' }));
  a.use('/api/v1/work', workRoutes);
  a.use(errorHandler);
  const server = a.listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  return { server, base: `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1/work` };
}

async function tokenFor(prisma: P, userId: number) {
  const jwt = (await import('jsonwebtoken')).default;
  const { config } = await import('../src/config/env.js');
  const u = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
}

async function seed(prisma: P) {
  await drop(prisma);
  const t0 = Date.now();
  const users = [];
  for (let i = 0; i < 8; i++) users.push(await prisma.user.create({ data: { username: `${TAG}_u${i}`, email: `${TAG}_u${i}@test.local`, displayName: `Perf ${i}` } }));
  const owner = users[0];
  const { server, base } = await app();
  const tok = await tokenFor(prisma, owner.id);
  const call = async (method: string, p: string, body?: unknown) => {
    const r = await fetch(base + p, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }, body: body ? JSON.stringify(body) : undefined });
    const j = (await r.json()) as { data: any };
    if (r.status >= 300) throw new Error(`${method} ${p} ${r.status} ${JSON.stringify(j).slice(0, 300)}`);
    return j.data;
  };
  try {
    const ws = await call('POST', '/workspaces', { name: 'Perf 10k' });
    for (const u of users.slice(1)) await prisma.workMember.create({ data: { workspaceId: ws.id, userId: u.id, role: 'MEMBER' } });
    const proj = await call('POST', `/workspaces/${ws.id}/projects`, { key: 'PERF', name: 'Perf 10k' });
    const pid = proj.id as number;
    for (const u of users.slice(1)) await prisma.workProjectMember.create({ data: { projectId: pid, userId: u.id, role: 'MEMBER' } });
    const statuses = await prisma.workStatus.findMany({ where: { workflow: { projectId: pid } }, orderBy: { position: 'asc' } });
    const types = await prisma.workIssueType.findMany({ where: { projectId: pid } });
    const typeIds = types.filter((t) => ['STORY', 'TASK', 'BUG'].includes(t.key)).map((t) => t.id);
    const labels = await Promise.all(Array.from({ length: 20 }, (_, i) => prisma.workLabel.create({ data: { projectId: pid, name: `label-${i}` } })));
    const sprints = [];
    for (let s = 0; s < 12; s++) {
      sprints.push(await prisma.workSprint.create({
        data: { projectId: pid, name: `Sprint ${s + 1}`, state: s < 10 ? 'CLOSED' : s === 10 ? 'ACTIVE' : 'PLANNED', position: s, startAt: new Date(Date.now() - (12 - s) * 14 * 86400_000), endAt: new Date(Date.now() - (11 - s) * 14 * 86400_000), completedAt: s < 10 ? new Date(Date.now() - (11 - s) * 14 * 86400_000) : null },
      }));
    }
    const done = statuses.filter((s) => s.category === 'DONE');
    const words = ['login', 'payment', 'report', 'export', 'search', 'profile', 'dashboard', 'notification', 'upload', 'invoice', 'đăng nhập', 'thanh toán', 'báo cáo'];
    const rank = (i: number) => i.toString(36).padStart(8, '0');
    const BATCH = 1000;
    for (let b = 0; b < N_ISSUES; b += BATCH) {
      await prisma.workIssue.createMany({
        data: Array.from({ length: Math.min(BATCH, N_ISSUES - b) }, (_, k) => {
          const i = b + k;
          const st = statuses[i % statuses.length];
          const created = new Date(Date.now() - ((i * 7919) % (180 * 86400)) * 1000);
          return {
            projectId: pid, number: i + 1, typeId: typeIds[i % typeIds.length], statusId: st.id, title: `${words[i % words.length]} ${words[(i * 3) % words.length]} task ${i + 1}`,
            descriptionText: `Perf issue ${i + 1} about ${words[(i * 5) % words.length]}`, priority: 1 + (i % 5), assigneeId: users[i % users.length].id, reporterId: users[(i + 3) % users.length].id,
            storyPoints: [1, 2, 3, 5, 8][i % 5], sprintId: i % 4 === 0 ? null : sprints[i % sprints.length].id, rank: rank(i), createdAt: created,
            resolvedAt: st.category === 'DONE' ? new Date(+created + 3 * 86400_000) : null, resolution: st.category === 'DONE' ? 'DONE' : null,
          };
        }),
      });
      process.stdout.write(`\rissues ${Math.min(b + BATCH, N_ISSUES)}/${N_ISSUES}`);
    }
    await prisma.workProject.update({ where: { id: pid }, data: { issueCounter: N_ISSUES } });
    const issues = await prisma.workIssue.findMany({ where: { projectId: pid }, select: { id: true, statusId: true, createdAt: true }, orderBy: { id: 'asc' } });
    // Nhãn: 1/3 thẻ.
    await prisma.workIssueLabel.createMany({ data: issues.filter((_, i) => i % 3 === 0).map((x, i) => ({ issueId: x.id, labelId: labels[i % labels.length].id })), skipDuplicates: true });
    // Lịch sử: mỗi thẻ đi qua các trạng thái tới trạng thái hiện tại (statusId) + đổi người giao.
    const hist: Array<{ issueId: number; actorId: number; field: string; fromValue: string | null; toValue: string | null; createdAt: Date }> = [];
    issues.forEach((x, i) => {
      const target = statuses.findIndex((s) => s.id === x.statusId);
      for (let s = 1; s <= target; s++) hist.push({ issueId: x.id, actorId: users[i % users.length].id, field: 'statusId', fromValue: String(statuses[s - 1].id), toValue: String(statuses[s].id), createdAt: new Date(+x.createdAt + s * 86400_000) });
      hist.push({ issueId: x.id, actorId: users[i % users.length].id, field: 'assigneeId', fromValue: null, toValue: String(users[i % users.length].id), createdAt: new Date(+x.createdAt + 3600_000) });
      if (i % 3 === 0) hist.push({ issueId: x.id, actorId: users[(i + 1) % users.length].id, field: 'priority', fromValue: '3', toValue: String(1 + (i % 5)), createdAt: new Date(+x.createdAt + 7200_000) });
    });
    for (let b = 0; b < hist.length; b += 5000) await prisma.workHistory.createMany({ data: hist.slice(b, b + 5000) });
    process.stdout.write(`\nhistory ${hist.length}\n`);
    const doc = (t: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] });
    await prisma.workComment.createMany({ data: issues.filter((_, i) => i % 3 === 1).map((x, i) => ({ issueId: x.id, authorId: users[i % users.length].id, bodyJson: doc(`Comment ${i}`), bodyText: `Comment ${i} on ${words[i % words.length]}`, createdAt: new Date(+x.createdAt + 5 * 3600_000) })) });
    await prisma.workWorklog.createMany({ data: issues.filter((_, i) => i % 3 === 2).map((x, i) => ({ issueId: x.id, userId: users[i % users.length].id, minutes: 30 + (i % 8) * 15, startedAt: new Date(+x.createdAt + 86400_000) })) });
    console.log(`seeded project ${pid} (PERF) in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${issues.length} issues, ${hist.length} history, done=${done.map((d) => d.name).join('/')}`);
  } finally {
    server.close();
  }
}

const pct = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)]; };

async function bench(prisma: P) {
  const proj = await prisma.workProject.findFirst({ where: { key: 'PERF', deletedAt: null, workspace: { name: 'Perf 10k', members: { some: { user: { username: `${TAG}_u0` } } } } }, select: { id: true } });
  if (!proj) throw new Error('Run "seed" first');
  const owner = await prisma.user.findFirstOrThrow({ where: { username: `${TAG}_u0` } });
  const pid = proj.id;
  const sprint = await prisma.workSprint.findFirst({ where: { projectId: pid, state: 'ACTIVE' }, select: { id: true } });
  const { server, base } = await app();
  const tok = await tokenFor(prisma, owner.id);
  // MCP chỉ nhận token ctw_ ⇒ tạo token đọc cho chủ dự án (xoá cùng người dùng khi drop).
  const mk = await fetch(`${base}/me/api-tokens`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ name: `perf-${Date.now()}`, scopes: ['read'] }) });
  const ctw = ((await mk.json()) as { data: { token: string } }).data.token;
  const enc = encodeURIComponent;
  const cases: Array<[string, string, 'GET' | 'POST', unknown?]> = [
    ['board (active sprint)', `/projects/${pid}/board`, 'GET'],
    ['board (all, kanban)', `/projects/${pid}/board?scope=all`, 'GET'],
    ['list /issues page 1', `/projects/${pid}/issues?limit=50`, 'GET'],
    ['list /issues page 100', `/projects/${pid}/issues?limit=50&offset=5000`, 'GET'],
    ['JQL assignee + status', `/projects/${pid}/search?jql=${enc('assignee = currentUser() AND statusCategory != Done ORDER BY priority')}&limit=50`, 'GET'],
    ['JQL text ~', `/projects/${pid}/search?jql=${enc('text ~ "thanh toan"')}&limit=50`, 'GET'],
    ['JQL stats groupBy status', `/projects/${pid}/stats?jql=&groupBy=status`, 'GET'],
    ['report burndown', `/projects/${pid}/reports/burndown${sprint ? `?sprintId=${sprint.id}` : ''}`, 'GET'],
    ['report velocity', `/projects/${pid}/reports/velocity`, 'GET'],
    ['report contributions', `/projects/${pid}/reports/contributions`, 'GET'],
    ['report CFD 30d', `/projects/${pid}/reports/cfd?days=30`, 'GET'],
    ['report cycle time', `/projects/${pid}/reports/cycle-time`, 'GET'],
    ['report KPIs', `/projects/${pid}/reports/kpis`, 'GET'],
    ['contrib summary', `/projects/${pid}/contrib/summary`, 'GET'],
    ['global search', `/search?q=${enc('payment')}`, 'GET'],
    ['MCP search_issues', `/mcp`, 'POST', { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'search_issues', arguments: { project: 'PERF', jql: 'statusCategory != Done ORDER BY updated DESC', text: 'login', limit: 50 } } }],
  ];
  const rows: Array<{ name: string; status: number; p50: number; p95: number; max: number; bytes: number }> = [];
  try {
    for (const [name, p, method, body] of cases) {
      const times: number[] = [];
      let status = 0, bytes = 0;
      for (let i = 0; i < RUNS + 3; i++) {
        const one = async () => {
          const t = performance.now();
          const r = await fetch(base + p, { method, headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: `Bearer ${p === '/mcp' ? ctw : tok}` }, body: body ? JSON.stringify(body) : undefined });
          const buf = await r.arrayBuffer();
          status = r.status; bytes = buf.byteLength;
          return performance.now() - t;
        };
        const ms = await Promise.all(Array.from({ length: CONC }, one));
        if (i >= 3) times.push(...ms);
      }
      const row = { name, status, p50: Math.round(pct(times, 50)), p95: Math.round(pct(times, 95)), max: Math.round(Math.max(...times)), bytes };
      rows.push(row);
      console.log(`${name.padEnd(28)} ${String(status).padEnd(4)} p50 ${String(row.p50).padStart(5)} ms  p95 ${String(row.p95).padStart(5)} ms  max ${String(row.max).padStart(5)} ms  ${(bytes / 1024).toFixed(0)} KB`);
    }
  } finally {
    server.close();
  }
  const out = process.argv.indexOf('--json');
  if (out > 0 && process.argv[out + 1]) {
    mkdirSync(path.dirname(process.argv[out + 1]), { recursive: true });
    writeFileSync(process.argv[out + 1], JSON.stringify({ at: new Date().toISOString(), issues: await prisma.workIssue.count({ where: { projectId: pid } }), runs: RUNS, concurrency: CONC, rows }, null, 2));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
