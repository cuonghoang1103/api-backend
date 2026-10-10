/**
 * E2E — CT Work đợt 6 (chất lượng): phiên inspection tài liệu qua GIAO DIỆN (tạo → chấm checklist NG → ghi lỗi → số đo →
 * quyết định), thiết kế test EP/BVA xem trước + đổ vào thư viện test, tab Giám sát (KPI + biểu đồ + TSR), baseline (chụp + ký),
 * kiểm thử thăm dò ghi chú ⇒ Bug. axe sáng + tối không có vi phạm serious/critical; ảnh vi + en vào E2E_SHOTS_DIR.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { api, cleanup, createWorkspace, launch, prisma, shot, userSession } from './helpers';

const AXE = path.resolve(process.cwd(), 'frontend/node_modules/axe-core/axe.min.js');
async function axeSerious(page: Page, scope = 'main'): Promise<Array<{ id: string; impact: string; nodes: number }>> {
  await page.addScriptTag({ content: await readFile(AXE, 'utf8') });
  const out = await page.evaluate(async (sel) => {
    const r = await (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<{ violations: Array<{ id: string; impact: string; nodes: unknown[] }> }> } }).axe.run(
      document.querySelector(sel) ?? document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
    );
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
  }, scope);
  return out.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}
/** Ngôn ngữ CT Work: nguồn sự thật users.preferences.work.locale + bản đệm localStorage `ctwork:locale` (i18n/store.ts). */
async function setLocale(page: Page, userId: number, locale: 'vi' | 'en') {
  await prisma().user.update({ where: { id: userId }, data: { preferences: { work: { locale } } } });
  await page.evaluate((l) => { try { localStorage.setItem('ctwork:locale', l); } catch { /* */ } }, locale);
}

/** Màn chờ toàn trang (#app-splash) phủ lên nội dung lúc tải — chờ nó biến mất trước khi chụp. */
async function settled(page: Page) {
  await page.waitForFunction(() => { const el = document.getElementById('app-splash'); return !el || getComputedStyle(el).display === 'none' || getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden'; }, null, { timeout: 30_000 }).catch(() => undefined);
  await page.waitForTimeout(500);
}

describe('CT Work E2E — đợt 6: review/inspection, thiết kế test, giám sát, baseline, thăm dò', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('luồng chất lượng qua giao diện + axe sáng/tối + ảnh vi/en', async () => {
    const A = await userSession(browser, 'q6lead');
    const ws = await createWorkspace(A.ctx);
    const pr = await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'QLT', name: 'Quality E2E', template: 'SWR302' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id as number;
    assert.equal((await api(A.ctx, 'POST', `/work/projects/${pid}/tests/enable`)).status, 200);
    if (!(await prisma().workIssueType.findFirst({ where: { projectId: pid, key: 'BUG' } }))) {
      await prisma().workIssueType.create({ data: { projectId: pid, key: 'BUG', name: 'Bug', icon: 'bug', color: '#e5484d', position: 9 } });
    }
    const req = await api(A.ctx, 'POST', `/work/projects/${pid}/issues`, { title: 'The system shall reject ages outside 18–60', typeKey: 'REQUIREMENT' });
    assert.equal(req.status, 201, JSON.stringify(req.raw).slice(0, 300));
    const base = `/work/${ws.slug}/QLT`;
    const page = A.page;

    // ── Review / inspection ──
    await page.goto(`${base}/reviews`);
    await page.getByTestId('q6-new-review').click();
    await page.getByTestId('q6-review-title').fill('SRS v1.0 inspection E2E');
    await page.getByTestId('q6-create-review').click();
    await page.getByTestId('q6-review-detail').waitFor();
    const first = page.getByTestId('q6-item-0');
    await first.getByRole('radio', { name: 'NG' }).click();
    await page.getByTestId('q6-log-defect-0').click();
    await first.getByRole('button', { name: /QLT-\d+/ }).waitFor();
    await page.getByTestId('q6-decision').getByRole('radio', { name: 'Accept with minor changes' }).click();
    await shot(page, 'q6-en-review');
    const rev = await api(A.ctx, 'GET', `/work/projects/${pid}/reviews/1`);
    assert.equal(rev.data.metrics.defects, 1);
    assert.equal(rev.data.decision, 'ACCEPT_WITH_CHANGES');
    const dl = page.waitForEvent('download');
    await page.getByTestId('q6-export-docx').click();
    assert.match((await dl).suggestedFilename(), /REV-1_Review_Record\.docx$/);
    const lightReview = await axeSerious(page);

    // ── Baseline: chụp + ký ──
    await page.goto(`${base}/reviews?tab=baselines`);
    await page.getByTestId('q6-new-baseline').click();
    await page.getByTestId('q6-baseline-name').fill('Requirements Baseline v1.0');
    await page.getByRole('dialog').getByRole('checkbox', { name: /E2E q6lead/ }).check();
    await page.getByTestId('q6-create-baseline').click();
    await page.getByTestId('q6-baseline-detail').waitFor();
    await page.getByTestId('q6-sign').click();
    await page.getByText('Approved · frozen').first().waitFor();
    await shot(page, 'q6-en-baseline');
    const locked = await api(A.ctx, 'PATCH', `/work/projects/${pid}/issues/${req.data.number}`, { title: 'Edited after baseline' });
    assert.equal(locked.status, 409, 'yêu cầu đã baseline ⇒ sửa bị chặn');

    // ── Thiết kế test: EP/BVA mặc định ⇒ xem trước ⇒ lưu ⇒ đổ vào thư viện test ──
    await page.goto(`${base}/tests?tab=design`);
    await page.getByTestId('q6-design-name').fill('Register age E2E');
    await page.getByTestId('q6-design-preview').getByText('TC-08').waitFor();
    await page.getByTestId('q6-save-design').click();
    await page.getByTestId('q6-export-design').click();
    await page.getByTestId('q6-export-go').click();
    await page.getByText(/test cases created/).first().waitFor();
    await shot(page, 'q6-en-design');
    const attrs = await api(A.ctx, 'GET', `/work/projects/${pid}/tests-attributes`);
    assert.ok(attrs.data.length >= 8 && attrs.data.every((a: any) => a.technique === 'EP/BVA'));

    // ── Giám sát: KPI + biểu đồ + TSR ──
    const cyc = await api(A.ctx, 'POST', `/work/projects/${pid}/test-cycles`, { name: 'Round 1', numbers: attrs.data.slice(0, 4).map((a: any) => a.number) });
    const cycle = await api(A.ctx, 'GET', `/work/projects/${pid}/test-cycles/${cyc.data.id}`);
    const runs = cycle.data.runs ?? cycle.data.cycle?.runs;
    await api(A.ctx, 'PATCH', `/work/projects/${pid}/test-runs/${runs[0].id}`, { status: 'PASS' });
    await api(A.ctx, 'PATCH', `/work/projects/${pid}/test-runs/${runs[1].id}`, { status: 'FAIL' });
    await page.goto(`${base}/tests?tab=quality`);
    await page.getByTestId('q6-kpi-pass').getByText('50%').waitFor();
    await page.getByTestId('q6-chart-passrate').waitFor();
    await page.getByTestId('q6-tsr-preview').click();
    await page.getByText('Test Summary Report').first().waitFor();
    await shot(page, 'q6-en-quality');
    const lightQuality = await axeSerious(page);

    // ── Thăm dò: ghi chú lỗi ⇒ Bug ──
    await page.goto(`${base}/tests?tab=exploratory`);
    await page.getByTestId('q6-new-session').click();
    await page.getByTestId('q6-charter').fill('Explore registration with boundary ages to discover validation gaps');
    await page.getByTestId('q6-create-session').click();
    await page.getByTestId('q6-start').click();
    await page.getByTestId('q6-note-kind').getByRole('radio', { name: 'Bug' }).click();
    await page.getByTestId('q6-note-text').fill('Age field accepts 999');
    await page.getByTestId('q6-add-note').click();
    await page.getByText(/Bug QLT-\d+ logged/).first().waitFor();
    await shot(page, 'q6-en-exploratory');

    // ── Tối + tiếng Việt ──
    await page.goto(`${base}/tests?tab=quality`);
    await page.getByTestId('q6-kpi-pass').waitFor({ state: 'visible', timeout: 60_000 });
    await page.evaluate(() => document.documentElement.classList.add('theme-dark'));
    await page.waitForTimeout(300);
    const dark = await axeSerious(page);
    await settled(page);
    await shot(page, 'q6-en-quality-dark');
    await setLocale(page, A.user.id, 'vi');
    await page.goto(`${base}/reviews?review=1`);
    await page.getByText('Số đo rà soát').or(page.getByText('Thông tin', { exact: true })).first().waitFor({ state: 'visible', timeout: 60_000 });
    await page.getByRole('tab', { name: 'Phiên rà soát' }).waitFor({ state: 'visible' });
    await page.waitForTimeout(400);
    await settled(page);
    await shot(page, 'q6-vi-review');
    await page.goto(`${base}/tests?tab=quality`);
    await page.getByText('Tỷ lệ đạt (vòng gần nhất)').first().waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForTimeout(600);
    await settled(page);
    await shot(page, 'q6-vi-quality');
    await page.goto(`${base}/tests?tab=design`);
    await page.getByText('Test case sinh ra').first().waitFor({ state: 'visible', timeout: 60_000 });
    await settled(page);
    await shot(page, 'q6-vi-design');
    await page.goto(`${base}/reviews?tab=baselines&baseline=1`);
    await page.getByText('Đã duyệt · đóng băng').first().waitFor({ state: 'visible', timeout: 60_000 });
    await settled(page);
    await shot(page, 'q6-vi-baseline');
    await page.goto(`${base}/tests?tab=risks`);
    await page.getByText('Kiểm thử theo rủi ro').first().waitFor({ state: 'visible', timeout: 60_000 });
    await settled(page);
    await shot(page, 'q6-vi-risks');

    console.log('axe serious/critical — review:', JSON.stringify(lightReview), 'quality:', JSON.stringify(lightQuality), 'dark:', JSON.stringify(dark));
    assert.deepEqual([...lightReview, ...lightQuality, ...dark], [], 'không có vi phạm axe serious/critical');
    await A.ctx.close();
  });
});
