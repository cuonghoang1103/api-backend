/**
 * E2E — Docs: chèn ảnh vào trang bằng ô chọn tệp của RichEditor (tải lên thật, tự lưu), ảnh hiện được,
 * rồi "Export as Word (.docx)" ⇒ tệp .docx mang ảnh (word/media/*).
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, describe, it } from 'node:test';
import JSZip from 'jszip';
import type { Browser } from 'playwright';
import { api, cleanup, createWorkspace, launch, shot, tinyPng, userSession } from './helpers';

describe('CT Work E2E — Docs: chèn ảnh + xuất .docx', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('chèn ảnh ⇒ lưu vào trang + hiện được; xuất Word có ảnh', async () => {
    const { ctx, page } = await userSession(browser, 'docs');
    const ws = await createWorkspace(ctx);
    const pr = await api(ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'DOC', name: 'Docs E2E', template: 'CAPSTONE', kind: 'SCHOOL' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id;
    const pg = await api(ctx, 'POST', `/work/projects/${pid}/pages`, { title: 'Architecture E2E' });
    assert.equal(pg.status, 201, JSON.stringify(pg.raw).slice(0, 300));
    const num = pg.data.number;

    await page.goto(`/work/${ws.slug}/DOC/docs/${num}`);
    // Trình soạn của TRANG là ProseMirror đầu tiên trong doc-view; nó chỉ bật contenteditable sau khi phiên đồng soạn
    // (K-3b) nối xong. Chọn `.ProseMirror[contenteditable="true"]` ngay lúc tải từng vớ nhầm ô BÌNH LUẬN bên dưới (QA 10/10)
    // ⇒ chờ đúng trình soạn của trang bật lên rồi mới gõ.
    const editor = page.locator('[data-testid="doc-view"] .ProseMirror').first();
    await editor.waitFor();
    for (let i = 0; i < 60 && (await editor.getAttribute('contenteditable')) !== 'true'; i++) await page.waitForTimeout(500);
    assert.equal(await editor.getAttribute('contenteditable'), 'true', 'trình soạn của trang bật chỉnh sửa');
    // Đợt 6: gõ TRƯỚC khi phiên đồng soạn đồng bộ xong thì trạng thái Yjs tải về đè mất chữ vừa gõ (ảnh chèn sau vẫn còn)
    // ⇒ chờ chỉ báo "live" của đồng soạn rồi mới gõ. Dự án tắt đồng soạn ⇒ không có chỉ báo, bỏ qua sau 20 s.
    await page.getByTestId('docs-collab-live').waitFor({ timeout: 20_000 }).catch(() => undefined);
    await editor.click();
    await page.keyboard.type('Context diagram below.');
    await page.locator('[data-testid="rich-editor-image-input"]').first().setInputFiles({ name: 'context.png', mimeType: 'image/png', buffer: tinyPng() });
    const img = editor.locator(`img[src^="/api/v1/work/projects/${pid}/images/"]`);
    await img.waitFor({ timeout: 30_000 });
    // Ảnh tải được qua proxy (không phải ảnh hỏng).
    await page.waitForFunction((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0, await img.elementHandle(), { timeout: 15_000 });
    await page.waitForTimeout(2500); // tự lưu
    await shot(page, 'docs-image');

    const saved = (await api(ctx, 'GET', `/work/projects/${pid}/pages/${num}`)).data;
    assert.ok(JSON.stringify(saved.contentJson).includes(`/api/v1/work/projects/${pid}/images/`), 'ảnh đã lưu trong nội dung trang');

    await page.getByRole('button', { name: 'More page actions' }).click();
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60_000 }), page.getByText('Export as Word (.docx)').click()]);
    assert.match(dl.suggestedFilename(), /\.docx$/);
    const zip = await JSZip.loadAsync(await readFile((await dl.path())!));
    const media = Object.keys(zip.files).filter((n) => n.startsWith('word/media/'));
    assert.ok(media.length >= 1, `docx có ảnh — ${Object.keys(zip.files).join(', ')}`);
    const body = await zip.file('word/document.xml')!.async('string');
    assert.ok(body.includes('Context diagram below.'), 'docx có chữ của trang');
    await ctx.close();
  });
});
