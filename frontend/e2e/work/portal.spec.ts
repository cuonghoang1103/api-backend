/**
 * E2E — cổng khách: khách đăng nhập chỉ thấy phần ĐÃ chia sẻ (thẻ, trang, ảnh); thẻ/trang/ảnh nội bộ không lộ
 * — kể cả gõ thẳng URL; link công khai hiện ảnh trong mô tả qua đường ảnh riêng của link (đợt 6a).
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser, BrowserContext } from 'playwright';
import { BASE, api, cleanup, createWorkspace, launch, newContext, registerUser, loginUi, shot, tinyPng, userSession } from './helpers';

async function upload(ctx: BrowserContext, pid: number, name: string, rgb: [number, number, number]) {
  const r = await ctx.request.post(`${BASE}/api/v1/work/projects/${pid}/images?name=${name}`, { headers: { 'Content-Type': 'image/png' }, data: tinyPng(rgb), failOnStatusCode: false });
  assert.equal(r.status(), 201, await r.text());
  return (await r.json()).data as { id: number; url: string };
}
const docWith = (text: string, src: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }, { type: 'image', attrs: { src, alt: null } }] });

describe('CT Work E2E — cổng khách chỉ thấy phần được chia sẻ', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('khách: thẻ + trang + ảnh đã chia sẻ hiện; nội bộ không lộ (giao diện, URL thẳng, API); link công khai có ảnh', async () => {
    const staff = await userSession(browser, 'pstaff');
    const ws = await createWorkspace(staff.ctx);
    const pr = await api(staff.ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'ACME', name: 'Acme portal E2E', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id;
    const cfg = (await api(staff.ctx, 'GET', `/work/projects/${pid}`)).data;
    const task = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;

    // Khách: tài khoản thật, mời qua cổng.
    const cctx = await newContext(browser);
    const client = await registerUser(cctx, 'pclient');
    const inv = await api(staff.ctx, 'POST', `/work/projects/${pid}/portal/invite`, { emails: [client.email] });
    assert.equal(inv.status, 201, JSON.stringify(inv.raw).slice(0, 300));

    const imgShared = await upload(staff.ctx, pid, 'shared.png', [20, 160, 90]);
    const imgInternal = await upload(staff.ctx, pid, 'internal.png', [200, 40, 40]);
    assert.notEqual(imgShared.id, imgInternal.id, 'hai ảnh khác nhau');
    const shared = (await api(staff.ctx, 'POST', `/work/projects/${pid}/issues`, { typeId: task, title: 'Shared login page E2E', descriptionJson: docWith('See mockup', imgShared.url) })).data;
    const secret = (await api(staff.ctx, 'POST', `/work/projects/${pid}/issues`, { typeId: task, title: 'SECRET internal margin E2E' })).data;
    assert.equal((await api(staff.ctx, 'PUT', `/work/projects/${pid}/issues/${shared.number}/client-visible`, { visible: true })).status, 200);
    const pc = (await api(staff.ctx, 'POST', `/work/projects/${pid}/pages`, { title: 'Client charter E2E', visibility: 'CLIENT', contentJson: docWith('Charter for the client', imgShared.url) })).data;
    const pi = (await api(staff.ctx, 'POST', `/work/projects/${pid}/pages`, { title: 'SECRET pricing page E2E', visibility: 'INTERNAL', contentJson: docWith('pricing', imgInternal.url) })).data;
    const link = await api(staff.ctx, 'POST', `/work/projects/${pid}/share-links`, { label: 'e2e', options: { descriptions: true } });
    assert.equal(link.status, 201, JSON.stringify(link.raw).slice(0, 300));
    const token = String(link.data.url).split('/').pop();

    // ── Khách đăng nhập bằng form ──
    const page = await cctx.newPage();
    await loginUi(page, client, `/work/${ws.slug}/ACME/portal`);
    await page.goto(`/work/${ws.slug}/ACME/portal?tab=requests`);
    await page.getByText('Shared login page E2E').first().waitFor();
    await shot(page, 'portal-requests');
    assert.equal(await page.getByText('SECRET internal margin E2E').count(), 0, 'thẻ nội bộ không hiện trong cổng');

    // Trang CLIENT trong cổng: ảnh tải được (không còn ảnh hỏng).
    await page.goto(`/work/${ws.slug}/ACME/portal?tab=documents&doc=${pc.number}`);
    const img = page.locator(`img[src="${imgShared.url}"]`).first();
    await img.waitFor();
    await page.waitForFunction((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0, await img.elementHandle(), { timeout: 15_000 });
    await shot(page, 'portal-document-image');
    const html = await page.content();
    assert.ok(!html.includes('SECRET pricing page E2E'), 'trang nội bộ không hiện trong danh sách tài liệu');

    // URL thẳng + API bằng cookie của khách.
    const get = async (p: string) => (await page.request.get(`${BASE}/api/v1/work${p}`)).status();
    assert.equal(await get(`/projects/${pid}/issues/${secret.number}`), 404);
    assert.equal(await get(`/projects/${pid}/pages/${pi.number}`), 404);
    assert.equal(await get(`/projects/${pid}/images/${imgShared.id}`), 200);
    assert.equal(await get(`/projects/${pid}/images/${imgInternal.id}`), 404, 'ảnh chỉ nằm trong trang nội bộ ⇒ 404');
    assert.equal(await get(`/projects/${pid}/backlog`), 403);
    const issues = await page.request.get(`${BASE}/api/v1/work/projects/${pid}/issues`);
    assert.ok(!(await issues.text()).includes('SECRET internal'), 'danh sách thẻ của khách không có thẻ nội bộ');

    // ── Link công khai (không đăng nhập): ảnh trong mô tả hiện qua đường ảnh riêng của link ──
    const anon = await newContext(browser);
    const ap = await anon.newPage();
    await ap.goto(`/work/share/${token}`);
    await ap.getByText('Shared login page E2E').first().click();
    const pubImg = ap.locator(`img[src="/api/v1/work/share/${token}/images/${imgShared.id}"]`).first();
    await pubImg.waitFor();
    await ap.waitForFunction((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0, await pubImg.elementHandle(), { timeout: 15_000 });
    await shot(ap, 'share-link-image');
    assert.equal(await ap.getByText('SECRET internal margin E2E').count(), 0);
    assert.equal((await ap.request.get(`${BASE}/api/v1/work/share/${token}/images/${imgInternal.id}`)).status(), 404);

    await Promise.all([anon.close(), cctx.close(), staff.ctx.close()]);
  });
});
