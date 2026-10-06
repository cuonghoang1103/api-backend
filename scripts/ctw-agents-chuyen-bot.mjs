#!/usr/bin/env node
/**
 * CT Work (CTW-28 §2.3) — chuyển 5 bot `fp_*` của không gian Flying Pencil thành AI AGENT thật, GIỮ NGUYÊN users.id
 * (assignee / bình luận / lịch sử / worklog / người duyệt… không mất dòng nào). Gọi endpoint
 * `POST /workspaces/:wsId/agents/convert` — không đụng DB trực tiếp, nên mọi kiểm tra + audit của server đều áp.
 *
 * Người chịu trách nhiệm (owner) của mỗi agent = CHỦ không gian hiện tại (workspace.ownerId).
 *
 *   # Xem trước (mặc định — không đổi gì):
 *   CTWORK_ADMIN_TOKEN=ctw_… node scripts/ctw-agents-chuyen-bot.mjs
 *   # Làm thật:
 *   CTWORK_ADMIN_TOKEN=ctw_… node scripts/ctw-agents-chuyen-bot.mjs --apply
 *
 * Tuỳ chọn:
 *   --url <base>        mặc định $CTWORK_URL hoặc https://cuongthai.com/api/v1/work
 *   --ws <slug>         mặc định flying-pencil-studio
 *   --ids 151,152,…     mặc định 151–155
 *   --model <m>         model mặc định cho mọi bot (mặc định claude-sonnet-5)
 *   --model-of fp_x=m   model riêng một bot (lặp lại được)
 *   --out <file>        nơi ghi token agent mới (quyền 600). Mặc định ./.ctwork-agent-tokens.json
 *   --apply             thực hiện (không có ⇒ chỉ in kế hoạch)
 *
 * Token admin: API token CÁ NHÂN (ctw_, scope read+write) của chủ/quản trị không gian — tạo ở /work/developer.
 * Token agent mới CHỈ được ghi vào file --out (chmod 600), không bao giờ in ra màn hình.
 *
 * An toàn:
 *   - Chỉ chuyển user có username bắt đầu bằng `fp_`, là thành viên đúng không gian, chưa là agent.
 *   - Đã là agent ⇒ bỏ qua (chạy lại an toàn).
 *   - Server từ chối 409 nếu bot còn ở không gian khác (agent thuộc đúng một không gian) — script in ra rồi dừng bot đó.
 *   - Sau khi chuyển: JWT cũ của bot chết ngay, token cá nhân cũ bị thu hồi ⇒ cập nhật `.ctwork` / nhip.mjs sang token mới.
 */

import { writeFileSync, chmodSync, existsSync, readFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, d) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const opts = (name) => argv.flatMap((a, i) => (a === `--${name}` && argv[i + 1] ? [argv[i + 1]] : []));

const BASE = (opt('url', process.env.CTWORK_URL) || 'https://cuongthai.com/api/v1/work').replace(/\/+$/, '');
const WS_SLUG = opt('ws', 'flying-pencil-studio');
const IDS = opt('ids', '151,152,153,154,155').split(',').map((x) => Number(x.trim())).filter((n) => Number.isInteger(n) && n > 0);
const MODEL = opt('model', 'claude-sonnet-5');
const MODEL_OF = Object.fromEntries(opts('model-of').map((kv) => kv.split('=')).filter((p) => p.length === 2));
const OUT = opt('out', './.ctwork-agent-tokens.json');
const APPLY = flag('apply');
const TOKEN = process.env.CTWORK_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('Thiếu CTWORK_ADMIN_TOKEN (API token cá nhân của chủ/quản trị không gian).');
  process.exit(2);
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`${method} ${path} ⇒ HTTP ${res.status} ${json.code ?? ''}: ${json.message ?? ''}`);
    err.status = res.status;
    err.code = json.code;
    err.data = json.data;
    throw err;
  }
  return json.data;
}

const main = async () => {
  console.log(`CT Work: ${BASE}`);
  console.log(`Không gian: ${WS_SLUG} · bot: ${IDS.join(', ')} · ${APPLY ? 'LÀM THẬT' : 'XEM TRƯỚC (thêm --apply để làm)'}\n`);

  const ws = await api('GET', `/workspaces/by-slug/${encodeURIComponent(WS_SLUG)}`);
  if (ws.role !== 'OWNER' && ws.role !== 'ADMIN') throw new Error(`Token này là ${ws.role} của không gian — cần OWNER/ADMIN.`);
  const ownerId = ws.ownerId;
  const members = await api('GET', `/workspaces/${ws.id}/members`);
  const owner = members.find((m) => m.id === ownerId);
  const agents = await api('GET', `/workspaces/${ws.id}/agents?includeRetired=1`);
  const already = new Set(agents.map((a) => a.userId));
  console.log(`Không gian #${ws.id} "${ws.name}" — owner @${owner?.username ?? ownerId} sẽ chịu trách nhiệm cho mọi agent.\n`);

  const plan = [];
  for (const id of IDS) {
    const m = members.find((x) => x.id === id);
    if (!m) { console.log(`  ✗ #${id}: không phải thành viên không gian — bỏ qua`); continue; }
    if (!/^fp_/.test(m.username)) { console.log(`  ✗ #${id} @${m.username}: không phải bot fp_* — bỏ qua (an toàn)`); continue; }
    if (already.has(id) || m.kind === 'AGENT') { console.log(`  = #${id} @${m.username}: đã là agent — bỏ qua`); continue; }
    if (m.role === 'OWNER' || m.role === 'ADMIN') { console.log(`  ✗ #${id} @${m.username}: đang là ${m.role} không gian — hạ vai trước rồi chạy lại`); continue; }
    const model = MODEL_OF[m.username] ?? MODEL;
    plan.push({ id, username: m.username, model, roleText: `Agent · ${m.displayName || m.fullName || m.username}` });
    console.log(`  → #${id} @${m.username} (${m.role}) ⇒ agent, model ${model}`);
  }
  if (!plan.length) { console.log('\nKhông có bot nào cần chuyển.'); return; }
  if (!APPLY) { console.log(`\n${plan.length} bot sẽ được chuyển. Chạy lại với --apply để làm thật.`); return; }

  const saved = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
  let ok = 0;
  for (const p of plan) {
    try {
      const r = await api('POST', `/workspaces/${ws.id}/agents/convert`, { userId: p.id, ownerId, model: p.model, roleText: p.roleText, token: { name: 'converted (ctw-agents-chuyen-bot)', scopes: ['read', 'write'] } });
      saved[p.username] = { userId: p.id, agentId: r.agent.id, token: r.token?.token ?? null, tokenPrefix: r.token?.prefix ?? null, at: new Date().toISOString() };
      writeFileSync(OUT, JSON.stringify(saved, null, 2), { mode: 0o600 });
      chmodSync(OUT, 0o600);
      ok += 1;
      console.log(`  ✓ @${p.username} ⇒ agent #${r.agent.id} · hạ ${r.demotedProjectRoles} vai dự án · thu hồi ${r.revokedTokens} token cũ` +
        (r.pendingApprovalSteps ? ` · ⚠️ ${r.pendingApprovalSteps} bước duyệt đang chờ đứng tên bot này — đổi người duyệt` : ''));
    } catch (e) {
      console.log(`  ✗ @${p.username}: ${e.message}`);
      if (e.code === 'WORK_AGENT_CONVERT_OTHER_WS') console.log(`      còn ở: ${(e.data?.workspaces ?? []).map((w) => `#${w.id} ${w.name}`).join(', ')}`);
    }
  }
  console.log(`\nXong ${ok}/${plan.length}. Token agent mới ghi ở ${OUT} (chmod 600) — chép sang .ctwork của FP rồi XOÁ file này.`);
};

main().catch((e) => { console.error(e.message); process.exit(1); });
