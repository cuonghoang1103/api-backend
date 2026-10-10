/**
 * E2E — CT Work đợt 8a: "My connections" (Microsoft 365 / Google), tệp đám mây trên thẻ, nút Teams/Meet, xuất Sheets.
 * KHÔNG gọi Microsoft/Google thật: kết nối được gieo thẳng vào CSDL; tuyến nào phải hỏi nhà cung cấp (danh sách lịch) bị
 * chặn bằng page.route trả dữ liệu mẫu. Backend cần CTW_MS_* / CTW_GOOGLE_* (giá trị giả) để thẻ hiện nút Connect.
 * axe (wcag2a/aa) không có vi phạm serious/critical ở sáng + tối; ảnh vi + en vào E2E_SHOTS_DIR.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { api, cleanup, createWorkspace, launch, prisma, shot, userSession } from './helpers';

const AXE = path.resolve(process.cwd(), 'frontend/node_modules/axe-core/axe.min.js');
async function axeSerious(page: Page, scope = 'main, [role="main"], #work-main') {
  await page.addScriptTag({ content: await readFile(AXE, 'utf8') });
  const out = await page.evaluate(async (sel) => {
    const r = await (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<{ violations: Array<{ id: string; impact: string; nodes: Array<{ target: string[]; failureSummary?: string }> }> }> } }).axe.run(
      document.querySelector(sel) ?? document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
    );
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, at: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} — ${(n.failureSummary ?? '').slice(0, 160)}`) }));
  }, scope);
  return out.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}
async function settled(page: Page) {
  await page.waitForFunction(() => { const el = document.getElementById('app-splash'); return !el || getComputedStyle(el).display === 'none' || getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden'; }, null, { timeout: 30_000 }).catch(() => undefined);
  await page.waitForTimeout(700);
}
async function setLocale(page: Page, userId: number, locale: 'vi' | 'en') {
  await prisma().user.update({ where: { id: userId }, data: { preferences: { work: { locale } } } });
  await page.evaluate((l) => { try { localStorage.setItem('ctwork:locale', l); } catch { /* */ } }, locale);
}
/** Đổi theme rồi chờ hết transition màu (axe đo giữa lúc chuyển ⇒ báo tương phản giả). */
const dark = async (page: Page, on: boolean) => { await page.evaluate((d) => { document.documentElement.classList.toggle('theme-dark', d); }, on); await page.waitForTimeout(900); };

describe('CT Work E2E — đợt 8a: kết nối Microsoft 365 / Google', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('My connections + tệp trên thẻ + Teams/Meet + xuất Sheets — axe sáng/tối, ảnh vi/en', async () => {
    const A = await userSession(browser, 'c8alead');
    const ws = await createWorkspace(A.ctx);
    const pr = await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'CLD', name: 'Cloud 8a' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id as number;
    const base = `/work/${ws.slug}/CLD`;
    const violations: Array<{ where: string; v: unknown }> = [];
    const check = async (page: Page, where: string) => { const v = await axeSerious(page); if (v.length) violations.push({ where, v }); };

    // ── Chưa kết nối: thẻ có nút Connect (backend có env giả) ──
    await A.page.goto('/work/connections');
    await A.page.getByTestId('c8a-provider-google').waitFor();
    await settled(A.page);
    await check(A.page, 'connections empty');
    await shot(A.page, 'c8a-en-connections-empty');

    // ── Gieo kết nối (không qua nhà cung cấp thật) + nhật ký ──
    const now = new Date();
    for (const p of ['google', 'microsoft']) {
      await prisma().workOAuthConnection.create({
        data: {
          userId: A.user.id, provider: p, status: p === 'google' ? 'ACTIVE' : 'ERROR', accountEmail: p === 'google' ? 'lead@gmail.com' : 'lead@fpt.edu.vn',
          accountName: 'Lead', scopes: 'openid email', accessTokenEnc: 'o1.placeholder', refreshTokenEnc: 'o1.placeholder', expiresAt: new Date(now.getTime() + 3600_000),
          // enabled:false trong CSDL — nếu bật, tạo họp bên dưới sẽ đẩy lên lịch ⇒ backend gọi Google thật. Giao diện đọc cài đặt
          // từ tuyến /calendars (đã chặn bằng route mẫu, trả enabled:true để chụp đúng trạng thái đang đồng bộ).
          settings: {},
          lastSyncAt: p === 'google' ? now : null,
          lastError: p === 'microsoft' ? 'Sign-in expired or access was removed — reconnect this account' : null, lastErrorAt: p === 'microsoft' ? now : null,
        },
      });
    }
    await prisma().workOAuthLog.createMany({
      data: [
        { userId: A.user.id, provider: 'google', kind: 'connect', summary: 'Connected Google Workspace as lead@gmail.com' },
        { userId: A.user.id, provider: 'google', kind: 'push', summary: 'Added CLD-1 to Google Calendar' },
        { userId: A.user.id, provider: 'google', kind: 'pull', summary: 'Due date of CLD-1 moved in Google Calendar: 2026-11-20 → 2026-11-24' },
        { userId: A.user.id, provider: 'google', kind: 'conflict', summary: 'CLD-1 was changed in both CT Work and Google Calendar — the calendar edit is newer and was applied' },
        { userId: A.user.id, provider: 'microsoft', kind: 'error', summary: 'Sign-in expired or access was removed — reconnect this account' },
      ],
    });
    // Danh sách lịch hỏi Google thật ⇒ chặn ở trình duyệt.
    await A.ctx.route('**/api/v1/work/integrations/*/calendars', (route) => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { items: [{ id: 'primary', name: 'Primary calendar', primary: true, canEdit: true }], settings: { enabled: true, calendarId: 'primary', calendarName: 'Primary calendar', syncIssues: true, syncMeetings: true } } }),
    }));
    await A.page.goto('/work/connections');
    await A.page.getByTestId('c8a-calendar-google').waitFor();
    await A.page.getByTestId('c8a-activity').waitFor();
    await settled(A.page);
    await dark(A.page, false);
    await check(A.page, 'connections light');
    await shot(A.page, 'c8a-en-connections');
    await dark(A.page, true);
    await check(A.page, 'connections dark');
    await shot(A.page, 'c8a-en-connections-dark');
    await dark(A.page, false);

    // ── Tệp trên thẻ (gieo một liên kết Drive) ──
    const iss = await api(A.ctx, 'POST', `/work/projects/${pid}/issues`, { title: 'Write SRS chapter 3', typeKey: 'TASK', dueDate: '2026-11-20' });
    assert.equal(iss.status, 201, JSON.stringify(iss.raw).slice(0, 300));
    await prisma().workIssueCloudFile.create({
      data: { projectId: pid, issueId: iss.data.id, provider: 'google', fileId: 'f1', name: 'SRS v1.2.docx', mimeType: 'application/vnd.google-apps.document', webUrl: 'https://docs.google.com/document/d/f1/edit', lastModifiedBy: 'An Nguyen', lastModifiedAt: now, attachedById: A.user.id },
    });
    await prisma().workIssueCloudFile.create({
      data: { projectId: pid, issueId: iss.data.id, provider: 'microsoft', fileId: 'm1', name: 'Test plan.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', webUrl: 'https://onedrive.live.com/edit?id=m1', lastModifiedBy: 'Binh Tran', lastModifiedAt: now, attachedById: A.user.id },
    });
    await A.page.goto(`${base}/issue/${iss.data.number}`);
    await A.page.getByTestId('issue-tab-links').click();
    await A.page.getByTestId('issue-cloud-files').waitFor();
    await A.page.getByTestId('issue-cloud-files').scrollIntoViewIfNeeded();
    await settled(A.page);
    await check(A.page, 'issue files');
    await shot(A.page, 'c8a-en-issue-files');

    // ── Cuộc họp: nút Google Meet (Microsoft đang ERROR ⇒ ẩn) ──
    const p = await api(A.ctx, 'GET', `/work/projects/${pid}`);
    if (!p.data?.modules?.meetings) await api(A.ctx, 'PUT', `/work/projects/${pid}/studio`, { modules: { ...(p.data?.modules ?? {}), meetings: true } });
    const start = new Date(Date.now() + 86_400_000);
    const m = await api(A.ctx, 'POST', `/work/projects/${pid}/meetings`, { title: 'Sprint review', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3600_000).toISOString(), attendeeIds: [A.user.id], sendInvites: false });
    assert.equal(m.status, 201, JSON.stringify(m.raw).slice(0, 300));
    await A.page.goto(`${base}/meetings/${m.data.number}`);
    await A.page.getByTestId('meeting-actions-bar').waitFor();
    await A.page.getByTestId('meeting-online-google').waitFor({ timeout: 20_000 }).catch(async (e) => { await shot(A.page, 'debug-meeting'); throw e; });
    assert.equal(await A.page.getByTestId('meeting-online-microsoft').count(), 0, 'kết nối lỗi ⇒ không hiện nút Teams');
    await settled(A.page);
    await check(A.page, 'meeting');
    await shot(A.page, 'c8a-en-meeting-buttons');

    // ── Cài đặt dự án → Microsoft 365 & Google (một chiều) ──
    await prisma().workCloudSheet.create({ data: { projectId: pid, userId: A.user.id, provider: 'google', kind: 'issues', title: 'CLD — issues', fileId: 's1', fileUrl: 'https://docs.google.com/spreadsheets/d/s1/edit', rowCount: 42, lastSyncedAt: now } });
    await A.page.goto(`${base}/settings?tab=cloud`);
    await A.page.getByTestId('c8a-one-way').waitFor();
    await A.page.getByTestId('c8a-sheets').waitFor();
    await settled(A.page);
    await check(A.page, 'project cloud');
    await shot(A.page, 'c8a-en-project-sheets');
    await dark(A.page, true);
    await check(A.page, 'project cloud dark');
    await shot(A.page, 'c8a-en-project-sheets-dark');
    await dark(A.page, false);

    // ── Tiếng Việt ──
    await setLocale(A.page, A.user.id, 'vi');
    await A.page.goto('/work/connections');
    await A.page.getByTestId('c8a-calendar-google').waitFor();
    await settled(A.page);
    await check(A.page, 'connections vi');
    await shot(A.page, 'c8a-vi-connections');
    await dark(A.page, true);
    await shot(A.page, 'c8a-vi-connections-dark');
    await dark(A.page, false);
    await A.page.goto(`${base}/issue/${iss.data.number}`);
    await A.page.getByTestId('issue-tab-links').click();
    await A.page.getByTestId('issue-cloud-files').waitFor();
    await A.page.getByTestId('issue-cloud-files').scrollIntoViewIfNeeded();
    await settled(A.page);
    await shot(A.page, 'c8a-vi-issue-files');
    await A.page.goto(`${base}/settings?tab=cloud`);
    await A.page.getByTestId('c8a-one-way').waitFor();
    await settled(A.page);
    await shot(A.page, 'c8a-vi-project-sheets');

    // Dọn bảng không FK (theo id dự án/người đã ghi lại).
    await prisma().workIssueCloudFile.deleteMany({ where: { projectId: pid } });
    await prisma().workCloudSheet.deleteMany({ where: { projectId: pid } });
    await prisma().workOAuthLog.deleteMany({ where: { userId: A.user.id } });

    assert.deepEqual(violations, [], JSON.stringify(violations, null, 1).slice(0, 3000));
  });
});
