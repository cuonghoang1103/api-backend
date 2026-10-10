/**
 * E2E nhẹ (đợt 6, CI) — kênh chat dự án (K-3: hai người, tin tới bên kia qua socket) + Diagram Studio (sơ đồ Mermaid tạo
 * qua API vẽ ra SVG trong trang). Đồng soạn thảo đã có spec riêng (docs-collab.spec.ts).
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright';
import { api, cleanup, createWorkspace, launch, shot, userSession } from './helpers';

describe('CT Work E2E — chat dự án + Diagram Studio (nhẹ)', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('chat: A gửi ⇒ B thấy ngay; diagram: Mermaid vẽ ra SVG', async () => {
    const A = await userSession(browser, 'chatA');
    const B = await userSession(browser, 'chatB');
    const ws = await createWorkspace(A.ctx);
    const pr = await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'CHT', name: 'Chat E2E' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id as number;
    assert.equal((await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/invites`, { emails: [B.user.email], role: 'MEMBER' })).status < 300, true);
    await api(A.ctx, 'PUT', `/work/projects/${pid}/members/${B.user.id}`, { role: 'MEMBER' });
    const base = `/work/${ws.slug}/CHT`;

    await B.page.goto(`${base}/chat`);
    await B.page.getByTestId('chat-view').waitFor();
    await A.page.goto(`${base}/chat`);
    const msg = `hello from A ${Date.now()}`;
    await A.page.getByTestId('chat-input').fill(msg);
    await A.page.getByTestId('chat-send').click();
    await B.page.getByTestId('chat-messages').getByText(msg).waitFor({ timeout: 20_000 });
    await shot(B.page, 'ci-chat-B');

    const d = await api(A.ctx, 'POST', `/work/projects/${pid}/diagrams`, { title: 'Login sequence', type: 'SEQUENCE', format: 'MERMAID', source: 'sequenceDiagram\n  User->>System: Log in\n  System-->>User: OK' });
    assert.equal(d.status, 201, JSON.stringify(d.raw).slice(0, 300));
    await A.page.goto(`${base}/diagrams?d=${d.data.number ?? d.data.id}`);
    await A.page.locator('svg').filter({ hasText: 'Log in' }).first().waitFor({ timeout: 30_000 });
    await shot(A.page, 'ci-diagram');
    await A.ctx.close();
    await B.ctx.close();
  });
});
