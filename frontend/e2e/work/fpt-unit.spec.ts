/**
 * E2E — ma trận Unit Test 5.1 (chuẩn FPT): thêm hàm, thêm test case, đánh dấu O, rồi xuất Excel đúng mẫu.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import JSZip from 'jszip';
import type { Browser } from 'playwright';
import { api, cleanup, createWorkspace, launch, shot, userSession } from './helpers';

describe('CT Work E2E — Unit Test 5.1: ma trận + xuất Excel', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('thêm hàm AuthService.Login, thêm test case, đánh dấu ô O (tự lưu), xuất .xlsx có sheet của hàm', async () => {
    const { ctx, page } = await userSession(browser, 'fpt');
    const ws = await createWorkspace(ctx);
    const pr = await api(ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'UT', name: 'Unit test E2E', template: 'SWT301', kind: 'SCHOOL' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id;

    await page.goto(`/work/${ws.slug}/UT/tests?tab=unit`);
    await page.getByRole('button', { name: 'Add function' }).first().click();
    const d = page.getByRole('dialog');
    await d.locator('input[list="fpt-modules"]').fill('AuthService');
    await d.getByPlaceholder('Login').fill('Login');
    await d.getByPlaceholder('45').fill('45');
    await d.getByRole('button', { name: /^Add$/ }).click();
    await d.waitFor({ state: 'detached' });

    // Ma trận mở sẵn một test case Normal; thêm UTCID02.
    await page.getByRole('button', { name: 'Add test case' }).click();
    const marks = page.locator('button.fpt-mark');
    await marks.first().waitFor();
    const before = await page.locator('button.fpt-mark[aria-pressed="true"]').count();
    await marks.first().click();
    await page.waitForTimeout(1500); // tự lưu sau 700 ms
    await shot(page, 'fpt-matrix');

    const fns = (await api(ctx, 'GET', `/work/projects/${pid}/fpt-tests/unit`)).data;
    const list = Array.isArray(fns) ? fns : fns.functions ?? fns.items;
    const fn = list.find((f: any) => f.methodName === 'Login');
    assert.ok(fn, 'hàm đã lưu');
    const detail = (await api(ctx, 'GET', `/work/projects/${pid}/fpt-tests/unit/${fn.id}`)).data;
    const cases = detail.cases ?? detail.matrix?.cases ?? [];
    assert.ok(cases.length >= 2, `có ≥ 2 test case (UTCID01, UTCID02) — ${cases.length}`);
    assert.ok(JSON.stringify(detail).includes('AuthService'));
    assert.notEqual(await page.locator('button.fpt-mark[aria-pressed="true"]').count(), before, 'ô vừa bấm đổi trạng thái');

    // Xuất Excel bằng nút thật ⇒ tải tệp .xlsx; kiểm cấu trúc gói (sheet Cover / Functions / sheet của hàm).
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Export 5\.1/ }).click()]);
    assert.match(dl.suggestedFilename(), /\.xlsx$/);
    const path = await dl.path();
    const { readFile } = await import('node:fs/promises');
    const zip = await JSZip.loadAsync(await readFile(path!));
    const wb = await zip.file('xl/workbook.xml')!.async('string');
    const sheets = [...wb.matchAll(/<sheet [^>]*name="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(sheets.some((s) => /cover/i.test(s)), `có sheet Cover — ${sheets.join(', ')}`);
    assert.ok(sheets.some((s) => /function/i.test(s)), `có sheet Functions — ${sheets.join(', ')}`);
    assert.ok(sheets.some((s) => /login/i.test(s)), `có sheet của hàm Login — ${sheets.join(', ')}`);
    // Chữ có thể nằm ở sharedStrings hoặc inline trong sheet — gộp mọi XML lại để soát.
    const xml = (await Promise.all(Object.values(zip.files).filter((f) => f.name.endsWith('.xml')).map((f) => f.async('string')))).join('');
    assert.match(xml, /UTCID\d/, 'ma trận có cột UTCID');
    assert.ok(xml.includes('AuthService'), 'tên lớp có trong tệp');
    await ctx.close();
  });
});
