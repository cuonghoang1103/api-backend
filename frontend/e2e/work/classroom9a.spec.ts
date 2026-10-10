/**
 * E2E — CT Work đợt 9a: trang lớp có tab (Stream · Classwork · People · Grades · Calendar) chạy THẬT với hai tài khoản
 * (GV + SV) trên stack cục bộ. Backend chạy với STORAGE_SANDBOX=1 (tệp vào kho giả, không chạm R2 thật); email ngoài
 * production vào hộp thư giả.
 *
 *   GV đăng thông báo (UI) + một bài hẹn giờ ⇒ SV thấy bài đã đăng, KHÔNG thấy bài hẹn giờ ⇒ SV bình luận ⇒ GV ẩn ⇒ SV
 *   không còn thấy ⇒ GV thêm tài liệu (UI) ⇒ SV đánh dấu đã xem ⇒ GV tạo lịch định kỳ (UI) + mở điểm danh ⇒ SV nhập mã
 *   từ link QR ⇒ bảng điểm danh của GV cập nhật ⇒ thống kê.
 *   axe (wcag2a/aa) không có vi phạm serious/critical; ảnh vi/en × sáng/tối × 1440/390 vào E2E_SHOTS_DIR.
 *
 *   E2E_BASE_URL=http://localhost:3093 E2E_SHOTS_DIR=scratchpad/9a npx tsx --test frontend/e2e/work/classroom9a.spec.ts
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright';
import { api, cleanup, launch, prisma, SHOTS, userSession } from './helpers';

const AXE = path.resolve(process.cwd(), 'frontend/node_modules/axe-core/axe.min.js');
async function axeSerious(page: Page, scope = '#work-main, main, [role="main"]') {
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
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);
  await page.waitForTimeout(600);
}
async function setLocale(page: Page, userId: number, locale: 'vi' | 'en') {
  await prisma().user.update({ where: { id: userId }, data: { preferences: { work: { locale } } } });
  await page.evaluate((l) => { try { localStorage.setItem('ctwork:locale', l); } catch { /* */ } }, locale);
}
const dark = async (page: Page, on: boolean) => { await page.evaluate((d) => { document.documentElement.classList.toggle('theme-dark', d); }, on); await page.waitForTimeout(900); };
async function snap(page: Page, name: string) {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true }).catch(() => undefined);
}

describe('CT Work E2E — đợt 9a: Stream, tài liệu, lịch lớp + điểm danh (GV + SV)', () => {
  let browser: Browser;
  const pageErrors: string[] = [];
  before(async () => { browser = await launch(); });
  after(async () => {
    await browser?.close();
    await cleanup();
  });

  it('hai tài khoản chạy trọn luồng — axe sáng/tối, ảnh vi/en 1440 + 390', async () => {
    const T = await userSession(browser, 'c9ateacher');
    const S = await userSession(browser, 'c9astudent');
    for (const p of [T.page, S.page]) p.on('pageerror', (e) => pageErrors.push(e.message));
    const violations: Array<{ where: string; v: unknown }> = [];
    const check = async (page: Page, where: string) => { const v = await axeSerious(page); if (v.length) violations.push({ where, v }); };

    // ── Lớp + SV vào lớp + một nhóm ──
    const c = await api(T.ctx, 'POST', '/work/classes', { subject: 'SWP391', classCode: 'SE1909', term: 'FA26', name: 'SWP391 · SE1909 · FA26' });
    assert.equal(c.status, 201, JSON.stringify(c.raw).slice(0, 300));
    const classId = c.data.id as number;
    const j = await api(S.ctx, 'POST', `/work/classes/join/${c.data.joinCode}`, { action: 'JOIN', studentCode: 'HE190001' });
    assert.equal(j.status, 200, JSON.stringify(j.raw).slice(0, 300));
    const g = await prisma().workClassGroup.create({ data: { classId, number: 1, name: 'Group 1' } });
    await prisma().workClassStudent.updateMany({ where: { classId, userId: S.user.id }, data: { groupId: g.id, fullName: 'Nguyễn Văn An' } });
    const url = (tab: string, extra = '') => `/work/classes?id=${classId}&tab=${tab}${extra}`;

    try {
      // ── GV đăng thông báo bằng UI ──
      await T.page.goto(url('stream'));
      await T.page.getByTestId('c9a-composer-open').click();
      await T.page.locator('.ProseMirror').first().click();
      await T.page.keyboard.type('Welcome to SWP391! Read the syllabus before Monday and form groups of 5.');
      await T.page.getByRole('button', { name: 'Add link' }).click();
      await T.page.getByLabel('Add link').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      await T.page.getByRole('button', { name: 'Add', exact: true }).click();
      await T.page.getByLabel('Pin to top').check();
      await T.page.getByTestId('c9a-post').click();
      await T.page.getByText('Welcome to SWP391!').first().waitFor();

      // Bài hẹn giờ (API) — GV thấy "Scheduled", SV không thấy.
      const later = await api(T.ctx, 'POST', `/work/classes/${classId}/stream`, {
        bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Quiz 1 opens next week — scheduled post.' }] }] },
        publishAt: new Date(Date.now() + 2 * 86_400_000).toISOString(),
      });
      assert.equal(later.status, 201);
      await api(T.ctx, 'POST', `/work/classes/${classId}/stream`, {
        bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Group 1: your mentor meeting is moved to room BE-305.' }] }] }, audienceGroupIds: [g.id],
      });

      // ── SV: thấy bài đã đăng, không thấy bài hẹn giờ; bình luận ──
      await S.page.goto(url('stream'));
      await S.page.getByText('Welcome to SWP391!').first().waitFor();
      assert.equal(await S.page.getByText('scheduled post').count(), 0, 'SV không thấy bài hẹn giờ');
      await S.page.getByLabel('Add a class comment…').first().fill('Thank you! Is the syllabus on Drive?');
      await S.page.getByRole('button', { name: 'Send' }).first().click();
      await S.page.getByText('Is the syllabus on Drive?').waitFor();

      // ── GV ẩn bình luận ⇒ SV không còn thấy ──
      await T.page.reload();
      await T.page.getByText('Is the syllabus on Drive?').waitFor();
      await T.page.getByText('Quiz 1 opens next week').waitFor();
      await T.page.getByRole('button', { name: 'Hide from students' }).first().click();
      await T.page.getByText('Hidden from students').waitFor();
      await S.page.reload();
      await S.page.getByText('Welcome to SWP391!').first().waitFor();
      await settled(S.page);
      assert.equal(await S.page.getByText('Is the syllabus on Drive?').count(), 0, 'bình luận đã ẩn biến khỏi màn SV');
      // Bình luận khác để ảnh có nội dung.
      await api(S.ctx, 'POST', `/work/classes/${classId}/stream/${(await prisma().workClassPost.findFirstOrThrow({ where: { classId, pinnedAt: { not: null } } })).id}/comments`, { body: 'Got it, thanks!' });

      // ── Tài liệu: chủ đề qua API, một mục qua UI; SV đánh dấu đã xem ──
      const t1 = await api(T.ctx, 'POST', `/work/classes/${classId}/topics`, { week: 1, title: 'Week 1 — Kick-off' });
      await api(T.ctx, 'POST', `/work/classes/${classId}/topics`, { week: 2, title: 'Week 2 — Requirements' });
      await api(T.ctx, 'POST', `/work/classes/${classId}/materials`, { topicId: t1.data.id, kind: 'SYLLABUS', title: 'SWP391 syllabus (FA26)', links: [{ url: 'https://drive.google.com/file/d/1abc/view', title: 'Syllabus on Drive' }] });
      await T.page.goto(url('classwork'));
      await T.page.getByTestId('c9a-add-material').click();
      const md = T.page.getByRole('dialog');
      await md.getByLabel('Title', { exact: true }).fill('Lecture 1 — Course overview');
      await md.getByLabel('Type', { exact: true }).selectOption('VIDEO');
      await md.getByLabel('Topic', { exact: true }).selectOption(String(t1.data.id));
      await md.getByRole('button', { name: 'Add link' }).click();
      await md.getByLabel('Add link').fill('https://youtu.be/abc123');
      await md.getByRole('button', { name: 'Add', exact: true }).click();
      await T.page.getByTestId('c9a-material-save').click();
      await T.page.getByText('Lecture 1 — Course overview').waitFor();
      await S.page.goto(url('classwork'));
      await S.page.getByText('SWP391 syllabus (FA26)').waitFor();
      await S.page.getByRole('button', { name: 'Mark as viewed' }).first().click();
      await S.page.getByText('Viewed', { exact: true }).first().waitFor();

      // ── Lịch: GV tạo lịch định kỳ bằng UI (có hôm nay) ──
      await T.page.goto(url('calendar'));
      await T.page.getByTestId('c9a-add-series').click();
      const dlg = T.page.getByRole('dialog');
      const today = new Date();
      const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      await dlg.getByRole('button', { name: 'Mon', exact: true }).click(); // bỏ thứ Hai mặc định
      await dlg.getByRole('button', { name: names[today.getDay()], exact: true }).click();
      if (today.getDay() !== 3) await dlg.getByRole('button', { name: 'Wed', exact: true }).click();
      await dlg.getByLabel('Title', { exact: true }).fill('SWP391 lecture');
      await dlg.getByLabel('Starts at', { exact: true }).fill('00:15');
      await dlg.getByLabel('Room', { exact: true }).fill('BE-301');
      await T.page.getByTestId('c9a-series-save').click();
      await T.page.getByText('SWP391 lecture').first().waitFor();
      // Hạn bài (điểm cắm addCalendarItem của 9b) để lịch có mục "Due".
      const firstSession = await prisma().workClassSession.findFirstOrThrow({ where: { classId }, orderBy: { startsAt: 'asc' } });
      await prisma().workClassCalendarItem.create({ data: { classId, refType: 'ASSIGNMENT', refId: 9901, title: 'Lab 1 — Project charter', startsAt: new Date(Date.now() + 3 * 86_400_000), url: url('classwork') } });

      // ── Điểm danh: GV mở mã ⇒ SV vào link QR ⇒ bảng GV cập nhật ──
      await T.page.reload();
      await T.page.getByTestId(`c9a-sheet-${firstSession.id}`).click();
      await T.page.getByTestId('c9a-open-checkin').click();
      const code = (await T.page.getByTestId('c9a-checkin-code').textContent())?.trim() ?? '';
      assert.match(code, /^\d{6}$/);
      await settled(T.page);
      await check(T.page, 'teacher check-in dialog');
      await snap(T.page, 'c9a-en-light-1440-teacher-checkin');
      await S.page.goto(url('calendar', `&checkin=${code}`));
      await S.page.getByTestId('c9a-checkin-input').waitFor();
      assert.equal(await S.page.getByTestId('c9a-checkin-input').inputValue(), code, 'mã từ link QR được điền sẵn');
      await S.page.getByTestId('c9a-checkin-submit').click();
      await S.page.getByText(/Checked in to/).waitFor();
      await T.page.getByText(/1 of 1 checked in/).waitFor({ timeout: 15_000 });
      await T.page.keyboard.press('Escape');

      // ── Ảnh + axe: hai vai × ba tab chính × vi/en × sáng/tối × 1440/390 ──
      const shotsFor = async (who: 'teacher' | 'student', page: Page, userId: number) => {
        for (const locale of ['en', 'vi'] as const) {
          await setLocale(page, userId, locale);
          for (const width of [1440, 390]) {
            await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
            for (const tab of ['stream', 'classwork', 'calendar'] as const) {
              await page.goto(url(tab));
              await page.getByTestId(`cls-tab-${tab}`).waitFor(); // trang lớp vẽ được (không rơi vào màn "Đã xảy ra lỗi")
              await settled(page);
              for (const theme of ['light', 'dark'] as const) {
                await dark(page, theme === 'dark');
                if (width === 1440 && locale === 'en') await check(page, `${who} ${tab} ${theme}`);
                await snap(page, `c9a-${locale}-${theme}-${width}-${who}-${tab}`);
              }
              await dark(page, false);
            }
          }
          // Thống kê điểm danh (GV) / điểm danh của tôi (SV).
          await page.setViewportSize({ width: 1440, height: 900 });
          await page.goto(url('calendar'));
          await settled(page);
          await page.getByRole('tab', { name: locale === 'vi' ? (who === 'teacher' ? 'Điểm danh' : 'Điểm danh của tôi') : (who === 'teacher' ? 'Attendance' : 'My attendance') }).click();
          await settled(page);
          if (locale === 'en') await check(page, `${who} attendance`);
          await snap(page, `c9a-${locale}-light-1440-${who}-attendance`);
          await dark(page, true);
          await snap(page, `c9a-${locale}-dark-1440-${who}-attendance`);
          await dark(page, false);
        }
        await setLocale(page, userId, 'en');
      };
      await shotsFor('teacher', T.page, T.user.id);
      await shotsFor('student', S.page, S.user.id);

      assert.deepEqual(violations, [], JSON.stringify(violations, null, 2));
      assert.deepEqual(pageErrors, [], 'không có lỗi JS trên trang');
    } finally {
      await prisma().workClass.deleteMany({ where: { id: classId } });
    }
  });
});
