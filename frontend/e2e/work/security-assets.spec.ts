/**
 * E2E — CT Work đợt 7c: ép 2FA (Settings → Security, thành viên bị chặn ⇒ /work/security, băng nhắc), sổ tài sản & giấy phép,
 * Tests → Automation (CI) sau một lần nhập JUnit, thư viện mẫu luật cho đồ án, widget mới trên dashboard.
 * axe (wcag2a/aa) không có vi phạm serious/critical ở sáng + tối; ảnh vi + en vào E2E_SHOTS_DIR.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { api, cleanup, createWorkspace, launch, prisma, shot, userSession } from './helpers';

const AXE = path.resolve(process.cwd(), 'frontend/node_modules/axe-core/axe.min.js');
async function axeSerious(page: Page, scope = 'main, [role="main"], #work-main'): Promise<Array<{ id: string; impact: string; nodes: number; at: string[] }>> {
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
  await page.waitForTimeout(600);
}
async function setLocale(page: Page, userId: number, locale: 'vi' | 'en') {
  await prisma().user.update({ where: { id: userId }, data: { preferences: { work: { locale } } } });
  await page.evaluate((l) => { try { localStorage.setItem('ctwork:locale', l); } catch { /* */ } }, locale);
}
const dark = (page: Page, on: boolean) => page.evaluate((d) => { document.documentElement.classList.toggle('theme-dark', d); }, on);

const JUNIT = `<?xml version="1.0"?><testsuites><testsuite name="com.labflow.AuthTest">
<testcase classname="com.labflow.AuthTest" name="loginOk" time="0.1"/>
<testcase classname="com.labflow.AuthTest" name="lockAfterFiveFailures" time="0.2"><failure message="expected LOCKED but was ACTIVE">at AuthTest.java:42</failure></testcase>
<testcase classname="com.labflow.AuthTest" name="resetEmail"><skipped/></testcase></testsuite></testsuites>`;

describe('CT Work E2E — đợt 7c: ép 2FA, sổ tài sản, test tự động, automation, widget', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('luồng 7c qua giao diện + axe sáng/tối + ảnh vi/en', async () => {
    const A = await userSession(browser, 'c7lead');
    const B = await userSession(browser, 'c7mem');
    const ws = await createWorkspace(A.ctx);
    await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/invites`, { emails: [B.user.email], role: 'MEMBER' });
    const pr = await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'LAB', name: 'LabFlow 7c' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id as number;
    assert.equal((await api(A.ctx, 'POST', `/work/projects/${pid}/tests/enable`)).status, 200);
    const base = `/work/${ws.slug}/LAB`;
    const violations: Array<{ where: string; v: unknown }> = [];
    const check = async (page: Page, where: string) => { const v = await axeSerious(page); if (v.length) violations.push({ where, v }); };

    // ── Settings → Security (chủ không gian, đã bật 2FA trong CSDL) ──
    await prisma().user.update({ where: { id: A.user.id }, data: { mfaEnabled: true, mfaEnabledAt: new Date(Date.now() - 60_000) } });
    const on = await api(A.ctx, 'PUT', `/work/workspaces/${ws.id}/security`, { require2fa: true, graceDays: 7 });
    assert.equal(on.status, 200, JSON.stringify(on.raw).slice(0, 300));
    await A.page.goto(`/work/${ws.slug}/settings?tab=security`);
    await A.page.getByTestId('c7c-ws-security').waitFor();
    await settled(A.page);
    await A.page.getByTestId('c7c-2fa-banner').waitFor();
    await check(A.page, 'ws-security light');
    await shot(A.page, 'c7c-en-ws-security');
    await dark(A.page, true);
    await check(A.page, 'ws-security dark');
    await shot(A.page, 'c7c-en-ws-security-dark');
    await dark(A.page, false);

    // ── Thành viên bị chặn (hết ân hạn) ⇒ /work/security ──
    await prisma().workSecurityPolicy.update({ where: { workspaceId: ws.id }, data: { graceUntil: new Date(Date.now() - 60_000) } });
    await B.page.goto(`${base}/board`);
    await B.page.waitForURL((u) => u.pathname.startsWith('/work/security'), { timeout: 45_000 });
    await B.page.getByTestId('c7c-2fa-status').waitFor();
    await settled(B.page);
    await check(B.page, 'security page');
    await shot(B.page, 'c7c-en-security-blocked');
    await B.page.getByRole('button', { name: /Set up two-factor/ }).click();
    await B.page.getByLabel('6-digit code').waitFor();
    await shot(B.page, 'c7c-en-security-setup-qr');
    await setLocale(B.page, B.user.id, 'vi');
    await B.page.reload();
    await B.page.getByTestId('c7c-2fa-status').waitFor();
    await settled(B.page);
    await shot(B.page, 'c7c-vi-security-blocked');
    // Chủ không gian cũng bị cổng hỏi mã (phiên chưa xác minh) — đúng luật. Gỡ chính sách bằng CSDL cho phần còn lại.
    const ownerBlocked = await api(A.ctx, 'GET', `/work/projects/${pid}/issues`);
    assert.equal(ownerBlocked.raw?.code, 'MFA_REQUIRED');
    await prisma().workSecurityPolicy.update({ where: { workspaceId: ws.id }, data: { require2fa: false } });

    // ── Sổ tài sản ──
    for (const body of [
      { name: 'Inter', category: 'FONT', licenseType: 'OFL', source: 'Rasmus Andersson', attribution: 'Inter by Rasmus Andersson (OFL 1.1)' },
      { name: 'Figma Professional', category: 'SERVICE', licenseType: 'SUBSCRIPTION', cost: 15, currency: 'USD', billing: 'MONTHLY', expiresAt: new Date(Date.now() + 9 * 86_400_000).toISOString().slice(0, 10), notes: 'Login in Bitwarden "Studio" vault' },
      { name: 'Kenney UI pack', category: 'IMAGE', licenseType: 'CC0', source: 'kenney.nl' },
      { name: 'Mystery sound', category: 'AUDIO', licenseType: 'UNKNOWN' },
    ]) assert.equal((await api(A.ctx, 'POST', `/work/projects/${pid}/assets`, body)).status, 201);
    await A.page.goto(`${base}/assets?asset=2`);
    await A.page.getByTestId('c7c-assets').waitFor();
    await settled(A.page);
    await check(A.page, 'assets light');
    await shot(A.page, 'c7c-en-assets');
    await A.page.getByTestId('c7c-asset-new').click();
    await A.page.getByRole('dialog').waitFor();
    await shot(A.page, 'c7c-en-asset-dialog');
    await A.page.keyboard.press('Escape');
    await dark(A.page, true);
    await check(A.page, 'assets dark');
    await shot(A.page, 'c7c-en-assets-dark');
    await dark(A.page, false);

    // ── Tests → Automation (CI) ──
    const imp = await api(A.ctx, 'POST', `/work/projects/${pid}/tests/automation/import`, { report: JUNIT, build: '42', branch: 'main', coverage: { report: 'SF:a.ts\nLF:10\nLH:8\nend_of_record\n' } });
    assert.equal(imp.status, 201, JSON.stringify(imp.raw).slice(0, 300));
    await A.page.goto(`${base}/tests?tab=automation`);
    await A.page.getByTestId('c7c-automation-tab').waitFor();
    await settled(A.page);
    await check(A.page, 'automation tab');
    await shot(A.page, 'c7c-en-tests-automation');

    // ── Settings → Automation: thư viện mẫu cho đồ án ──
    await A.page.goto(`${base}/settings?tab=automation`);
    await A.page.getByTestId('c7c-student-templates').waitFor();
    await A.page.getByTestId('c7c-student-templates').scrollIntoViewIfNeeded();
    await settled(A.page);
    await check(A.page, 'automation settings');
    await shot(A.page, 'c7c-en-automation-templates');

    // ── Dashboard có widget mới ──
    const mk = (kind: string, size: 'half' | 'full' = 'half') => ({ id: Math.random().toString(36).slice(2, 10), kind, title: '', size });
    const dash = await api(A.ctx, 'POST', `/work/projects/${pid}/dashboards`, { name: 'Đợt 7c', shared: true, widgets: [mk('test_pass_rate'), mk('defects_by_severity'), mk('license_expiring'), mk('my_timer'), mk('okr', 'full')] });
    assert.equal(dash.status, 201, JSON.stringify(dash.raw).slice(0, 300));
    await A.page.goto(`${base}/dashboards?d=${dash.data.id}`);
    await A.page.getByTestId('widget-license-expiring').waitFor({ timeout: 45_000 }).catch(() => undefined);
    await settled(A.page);
    await check(A.page, 'dashboard');
    await shot(A.page, 'c7c-en-dashboard-widgets');
    await setLocale(A.page, A.user.id, 'vi');
    await A.page.reload();
    await settled(A.page);
    await shot(A.page, 'c7c-vi-dashboard-widgets');
    await A.page.goto(`${base}/assets`);
    await A.page.getByTestId('c7c-assets').waitFor();
    await settled(A.page);
    await shot(A.page, 'c7c-vi-assets');

    console.log('axe serious/critical:', JSON.stringify(violations));
    assert.deepEqual(violations, [], 'không có vi phạm axe serious/critical');
  });
});
