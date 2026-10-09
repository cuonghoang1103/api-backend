/**
 * E2E — CTW K-3b: ĐỒNG SOẠN THẢO Docs với 2 tài khoản / 2 trình duyệt riêng (2 context, cookie riêng):
 * cùng gõ ⇒ hai bên thấy chữ của nhau + con trỏ có tên; dải hiện diện; NGẮT MẠNG một bên ⇒ vẫn gõ được ("Offline · saved
 * on this device"), bên kia chưa thấy ⇒ NỐI LẠI ⇒ tự đồng bộ; bình luận gắn đoạn văn (tô sáng + luồng); tự điền khi
 * người kia đang mở; axe (sáng + tối) không có vi phạm nghiêm trọng mới. Ảnh vào E2E_SHOTS_DIR nếu đặt.
 *
 *   E2E_BASE_URL=http://localhost:3172 E2E_SHOTS_DIR=scratchpad/k3b npx tsx --test frontend/e2e/work/docs-collab.spec.ts
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { api, cleanup, createWorkspace, launch, shot, userSession } from './helpers';

const AXE = path.resolve(process.cwd(), 'frontend/node_modules/axe-core/axe.min.js');

async function axeSerious(page: Page): Promise<Array<{ id: string; impact: string; nodes: number }>> {
  await page.addScriptTag({ content: await readFile(AXE, 'utf8') });
  const out = await page.evaluate(async () => {
    const r = await (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<{ violations: Array<{ id: string; impact: string; nodes: unknown[] }> }> } }).axe.run(
      document.querySelector('[data-testid="doc-view"]') ?? document,
      { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
    );
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
  });
  return out.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

/** Lần đầu vào CT Work hỏi ngôn ngữ — A chọn English, B chọn Tiếng Việt (thấy luôn i18n miền `collab`). */
async function pickLang(p: Page, l: 'en' | 'vi') {
  const b = p.locator(`[role="dialog"] button[lang="${l}"]`);
  await b.waitFor({ timeout: 15_000 }).then(() => b.click()).catch(() => undefined);
}

const editorOf = (p: Page) => p.locator('[data-testid="doc-view"] .ProseMirror[contenteditable="true"]').first();

describe('CT Work E2E — Docs đồng soạn thảo (K-3b)', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('hai người cùng gõ, thấy con trỏ, offline rồi nối lại, bình luận gắn đoạn văn', async () => {
    const A = await userSession(browser, 'collabA');
    const B = await userSession(browser, 'collabB');
    const ws = await createWorkspace(A.ctx);
    const inv = await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/invites`, { emails: [B.user.email], role: 'MEMBER' });
    assert.ok(inv.status < 300, JSON.stringify(inv.raw).slice(0, 300));
    const pr = await api(A.ctx, 'POST', `/work/workspaces/${ws.id}/projects`, { key: 'COL', name: 'Collab E2E', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw).slice(0, 300));
    const pid = pr.data.id;
    const content = {
      type: 'doc', content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '1. Introduction' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'LabFlow manages lab rooms for the faculty.' }] },
        { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: 'flowchart LR\n  Student --> Booking --> Lab' }] },
        { type: 'table', content: [
          { type: 'tableRow', content: [{ type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Actor' }] }] }, { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Goal' }] }] }] },
          { type: 'tableRow', content: [{ type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Student' }] }] }, { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Book a lab' }] }] }] },
        ] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '2. Scope' }] },
        { type: 'paragraph' },
      ],
    };
    const pg = await api(A.ctx, 'POST', `/work/projects/${pid}/pages`, { title: 'Report 1 — Introduction', contentJson: content });
    assert.equal(pg.status, 201, JSON.stringify(pg.raw).slice(0, 300));
    const num = pg.data.number;
    const url = `/work/${ws.slug}/COL/docs/${num}`;

    await Promise.all([A.page.goto(url), B.page.goto(url)]);
    await Promise.all([pickLang(A.page, 'en'), pickLang(B.page, 'vi')]);
    await Promise.all([A.page.getByTestId('docs-collab-live').waitFor({ timeout: 60_000 }), B.page.getByTestId('docs-collab-live').waitFor({ timeout: 60_000 })]);
    // Trang cũ nạp vào Yjs giữ nguyên bảng + Mermaid.
    await A.page.locator('[data-testid="doc-view"] [data-testid="mermaid-diagram"]').first().waitFor({ timeout: 30_000 });
    assert.equal(await A.page.locator('[data-testid="doc-view"] .ProseMirror table').count(), 1);

    // A gõ cuối đoạn 1, B gõ vào đoạn trống dưới "2. Scope" — cùng lúc.
    await editorOf(A.page).locator('p', { hasText: 'LabFlow manages' }).click();
    await A.page.keyboard.press('End');
    await editorOf(B.page).locator('p').last().click();
    await Promise.all([
      A.page.keyboard.type(' Written by A in real time.', { delay: 25 }),
      B.page.keyboard.type('Scope drafted by B at the same time.', { delay: 25 }),
    ]);
    await A.page.getByText('Scope drafted by B at the same time.').waitFor({ timeout: 15_000 });
    await B.page.getByText('Written by A in real time.').waitFor({ timeout: 15_000 });
    // Con trỏ người kia có NHÃN TÊN.
    await A.page.locator('.collaboration-cursor__label', { hasText: 'E2E collabB' }).waitFor({ timeout: 15_000 });
    await B.page.locator('.collaboration-cursor__label', { hasText: 'E2E collabA' }).waitFor({ timeout: 15_000 });
    await A.page.getByTestId('issue-presence').waitFor({ timeout: 15_000 });
    await shot(A.page, 'k3b-01-A-sees-B-cursor');
    await shot(B.page, 'k3b-02-B-sees-A-cursor');

    // B mất mạng: vẫn gõ được, A chưa thấy; nối lại ⇒ A thấy.
    await B.ctx.setOffline(true);
    await B.page.getByTestId('docs-collab-offline').waitFor({ timeout: 30_000 });
    await B.page.keyboard.type(' Typed while OFFLINE.', { delay: 20 });
    await B.page.waitForTimeout(1500);
    assert.equal(await A.page.getByText('Typed while OFFLINE.').count(), 0, 'A chưa thấy chữ gõ lúc B offline');
    await shot(B.page, 'k3b-03-B-offline-still-typing');
    await B.ctx.setOffline(false);
    await A.page.getByText('Typed while OFFLINE.', { exact: false }).waitFor({ timeout: 45_000 });
    await B.page.getByTestId('docs-collab-live').waitFor({ timeout: 45_000 });
    await shot(A.page, 'k3b-04-A-after-B-reconnect');

    // Bình luận gắn đoạn văn: A bôi đen "lab rooms" ⇒ Comment ⇒ đăng; chữ được tô, B thấy luồng.
    const para = editorOf(A.page).locator('p', { hasText: 'LabFlow manages' });
    await para.evaluate((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const i = (n.textContent ?? '').indexOf('lab rooms');
        if (i >= 0) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 'lab rooms'.length); const s = window.getSelection()!; s.removeAllRanges(); s.addRange(r); break; }
      }
      document.dispatchEvent(new Event('selectionchange'));
    });
    await A.page.keyboard.press('Shift+ArrowRight');
    await A.page.keyboard.press('Shift+ArrowLeft');
    await A.page.getByTestId('docs-inline-comment').click();
    await A.page.getByRole('dialog').locator('.ProseMirror').click();
    await A.page.keyboard.type('Which faculty? Name it explicitly.');
    await A.page.getByTestId('docs-inline-post').click();
    await A.page.locator('[data-testid="doc-view"] .ProseMirror [data-comment-anchor]').first().waitFor({ timeout: 15_000 });
    await B.page.locator('[data-testid="doc-view"] .ProseMirror [data-comment-anchor]').first().waitFor({ timeout: 15_000 });
    await B.page.reload();
    await B.page.getByText('Which faculty? Name it explicitly.').waitFor({ timeout: 30_000 });
    await B.page.locator('[data-testid="doc-view"] [data-testid="mermaid-diagram"]').first().waitFor({ timeout: 15_000 });
    await B.page.locator('[data-testid="doc-view"] [data-comment-anchor]').first().click();
    await B.page.waitForTimeout(800);
    await shot(B.page, 'k3b-05-B-inline-comment-thread');
    await B.page.getByTestId('docs-inline-resolve').first().click();

    // Tự điền trên trang Report 2 khi B đang mở: đi qua Yjs (B thấy ngay), chữ B đang gõ không mất.
    const r2 = await api(A.ctx, 'POST', `/work/projects/${pid}/pages`, { templateKey: 'fpt-report2-project-management-plan' });
    const url2 = `/work/${ws.slug}/COL/docs/${r2.data.number}`;
    await B.page.goto(url2);
    await B.page.getByTestId('docs-collab-live').waitFor({ timeout: 60_000 });
    const tablesBefore = await editorOf(B.page).locator('table').count();
    await editorOf(B.page).locator('p').first().click();
    await B.page.keyboard.press('Home');
    await B.page.keyboard.type('B-NOTE ');
    const fill = await api(A.ctx, 'POST', `/work/projects/${pid}/pages/${r2.data.number}/autofill`, {});
    assert.equal(fill.status, 200, JSON.stringify(fill.raw).slice(0, 300));
    await B.page.waitForTimeout(2500);
    const txt = await editorOf(B.page).innerText();
    assert.ok(txt.includes('B-NOTE'), 'chữ B đang gõ còn nguyên');
    assert.ok(/Record of Changes/i.test(txt));
    assert.equal(await editorOf(B.page).locator('table').count(), tablesBefore, 'bảng tự điền thay bảng mẫu, không nhân đôi');
    await shot(B.page, 'k3b-06-B-after-fill');

    // axe: sáng + tối, chỉ đếm serious/critical trong vùng tài liệu.
    await A.page.goto(url);
    await A.page.getByTestId('docs-collab-live').waitFor({ timeout: 60_000 });
    const light = await axeSerious(A.page);
    await A.page.evaluate(() => document.documentElement.classList.add('theme-dark'));
    await A.page.waitForTimeout(300);
    await shot(A.page, 'k3b-07-A-dark');
    const dark = await axeSerious(A.page);
    console.log('axe serious/critical — light:', JSON.stringify(light), 'dark:', JSON.stringify(dark));
    await A.ctx.close();
    await B.ctx.close();
  });
});
