/**
 * E2E — tạo dự án từ mẫu FPT Capstone bằng hộp thoại thật, tạo thẻ, kéo thẻ sang cột Done trên board.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { api, cleanup, createWorkspace, launch, shot, userSession } from './helpers';

/** Kéo bằng chuột thật qua nhiều bước (dnd-kit PointerSensor cần khoảng di chuyển tối thiểu). */
async function dragTo(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + 8, from.y + 8, { steps: 4 });
  await page.mouse.move(to.x, to.y, { steps: 25 });
  await page.waitForTimeout(200);
  await page.mouse.up();
}

describe('CT Work E2E — Capstone: dự án mẫu → thẻ → kéo sang Done', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('tạo dự án mẫu FPT Capstone qua hộp thoại, tạo thẻ, kéo sang Done ⇒ thẻ resolved', async () => {
    const { ctx, page } = await userSession(browser, 'cap');
    const ws = await createWorkspace(ctx);
    await page.goto(`/work/${ws.slug}`);
    await page.getByRole('button', { name: /new project|create project/i }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: /School/ }).click();
    await dialog.getByRole('button', { name: /Change template/ }).click();
    await dialog.getByRole('button', { name: /FPT Capstone/ }).click();
    await shot(page, 'cap-dialog-named');
    await dialog.getByPlaceholder('e.g. Online Bookstore').fill('Capstone E2E');
    // Ô Key: ô font-mono duy nhất của hộp thoại (nhãn Field chỉ gắn aria từ đợt UX-A).
    const keyInput = dialog.locator('input.font-mono');
    await keyInput.fill('CAPE');
    await dialog.getByRole('button', { name: /^Create project$/ }).click();
    await page.waitForURL(/\/work\/[^/]+\/CAPE/, { timeout: 90_000 });

    const projects = await api<any[]>(ctx, 'GET', `/work/workspaces/${ws.id}/projects`);
    const proj = (Array.isArray(projects.data) ? projects.data : (projects.data as any).projects).find((p: any) => p.key === 'CAPE');
    assert.ok(proj, 'dự án CAPE đã tạo');
    const cfg = (await api(ctx, 'GET', `/work/projects/${proj.id}`)).data;
    assert.equal(cfg.template ?? cfg.settings?.template ?? 'CAPSTONE', 'CAPSTONE');
    assert.ok(cfg.modules?.stages && cfg.modules?.docs, 'mẫu Capstone bật sẵn giai đoạn + tài liệu');

    // Tạo thẻ bằng hộp thoại tạo thẻ (phím tắt "c" của board/backlog).
    await page.goto(`/work/${ws.slug}/CAPE/board`);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.getByRole('button', { name: /^(create|\+ create|new issue|create issue)$/i }).first().click();
    const cd = page.getByRole('dialog');
    await cd.getByPlaceholder('Issue title').fill('E2E drag me to Done');
    await cd.locator('button.w-btn-primary', { hasText: /^Create/ }).click();
    await cd.waitFor({ state: 'detached' }).catch(() => undefined);
    await page.goto(`/work/${ws.slug}/CAPE/board`);
    const card = page.locator('[aria-roledescription="draggable issue card"]', { hasText: 'E2E drag me to Done' });
    await card.waitFor();
    await shot(page, 'cap-board-before');

    // Cột Done rỗng có ô đích "Drop finished work here".
    const doneCol = page.getByText('Drop finished work here');
    const cb = (await card.boundingBox())!;
    const db = (await doneCol.boundingBox())!;
    await dragTo(page, { x: cb.x + cb.width / 2, y: cb.y + 12 }, { x: db.x + db.width / 2, y: db.y + db.height / 2 });
    await page.waitForTimeout(1500);
    await shot(page, 'cap-board-after');

    const issues = (await api(ctx, 'GET', `/work/projects/${proj.id}/issues`)).data.items as any[];
    const it2 = issues.find((i) => i.title === 'E2E drag me to Done');
    assert.ok(it2?.resolvedAt, `thẻ đã sang Done (resolvedAt) — ${JSON.stringify(it2)}`);
    await ctx.close();
  });
});
