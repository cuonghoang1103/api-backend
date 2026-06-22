import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'https://cuongthai.com';
const DIR  = '/tmp/verify_screenshots';
mkdirSync(DIR, { recursive: true });

const ss = async (page, name) => {
  const p = `${DIR}/${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  console.log(`📸  ${name}`);
};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

const jsErrors = [];
page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });
page.on('pageerror', e => jsErrors.push('PAGE ERR: ' + e.message));

try {
  // ── 1. Login ──────────────────────────────────────────────────
  console.log('\n── 1. Login ──');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[placeholder*="username" i], input[placeholder*="tên" i]', 'Cuong03dx');
  await page.fill('input[type="password"]', 'TestPass123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  console.log('URL after login:', page.url());
  await ss(page, '01_after_login');

  if (page.url().includes('/login')) {
    const errMsg = await page.locator('.text-red-400, [class*="error"], [class*="alert"]').first().textContent().catch(() => 'unknown');
    console.log('❌ Login failed. Error:', errMsg);
    process.exit(1);
  }
  console.log('✅ Logged in successfully');

  // ── 2. Navigate to /admin/users ───────────────────────────────
  console.log('\n── 2. Admin Users page ──');
  await page.goto(`${BASE}/admin/users`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);
  console.log('URL:', page.url());
  await ss(page, '02_admin_users_loaded');

  const rows = await page.locator('tbody tr').count();
  console.log(`Table rows: ${rows}`);

  // ── 3. EmailVerified badges in status column ──────────────────
  console.log('\n── 3. EmailVerified badges ──');
  const verified   = await page.locator('text=Verified').count();
  const unverified = await page.locator('text=Unverified').count();
  console.log(`Verified badges:   ${verified}`);
  console.log(`Unverified badges: ${unverified}`);
  console.log((verified + unverified) > 0 ? '✅ Email verification badges rendered' : '❌ No badges found');
  await ss(page, '03_status_column');

  // ── 4. Gear (Settings) icon → EditUserModal ───────────────────
  console.log('\n── 4. EditUserModal via gear icon ──');
  const gearBtn = page.locator('button[title="Chỉnh sửa người dùng"]').first();
  const gearCount = await gearBtn.count();
  console.log(`Gear/Settings buttons: ${gearCount}`);

  if (gearCount > 0) {
    await gearBtn.click();
    await page.waitForTimeout(800);
    await ss(page, '04_edit_modal_open');

    const checks = {
      'Modal title':        await page.locator('text=Chỉnh sửa người dùng').count(),
      'DisplayName input':  await page.locator('input[placeholder*="hiển thị"]').count(),
      'Email toggle':       await page.locator('button:has-text("Email")').count(),
      'ADMIN chip':         await page.locator('button:has-text("ADMIN")').count(),
      'USER chip':          await page.locator('button:has-text("USER")').count(),
      'Save button':        await page.locator('button:has-text("Lưu thay đổi")').count(),
    };
    for (const [k, v] of Object.entries(checks)) {
      console.log(`  ${v > 0 ? '✅' : '❌'} ${k}: ${v}`);
    }

    // Fill display name to see it working
    if (checks['DisplayName input'] > 0) {
      await page.fill('input[placeholder*="hiển thị"]', 'Playwright Test');
      await page.waitForTimeout(200);
      await ss(page, '04b_modal_filled');
      await page.fill('input[placeholder*="hiển thị"]', '');
    }

    await page.locator('button:has-text("Hủy")').first().click();
    await page.waitForTimeout(300);
    console.log('  Modal closed ✅');
  } else {
    console.log('❌ No gear button — not detected as super-admin');
    await ss(page, '04_no_gear');
  }

  // ── 5. Delete dialog ─────────────────────────────────────────
  console.log('\n── 5. Delete confirmation dialog ──');
  const trashActive = page.locator('button[title="Xóa tài khoản"]');
  const trashVerif  = page.locator('button[title*="Email đã xác minh"]');
  const activeCount = await trashActive.count();
  const verifCount  = await trashVerif.count();
  console.log(`Active trash (unverified email): ${activeCount}`);
  console.log(`Dimmed trash (verified email):   ${verifCount}`);

  const anyTrash = activeCount > 0 ? trashActive : trashVerif;
  if (await anyTrash.count() > 0) {
    await anyTrash.first().click();
    await page.waitForTimeout(700);
    await ss(page, '05_delete_dialog');

    const dlgChecks = {
      'Dialog title':           await page.locator('text=Xóa tài khoản').count(),
      '"Email verified:" label': await page.locator('text=Email verified').count(),
      'Confirm button':         await page.locator('button:has-text("Xóa vĩnh viễn")').count(),
    };
    const isDisabled = await page.locator('button:has-text("Xóa vĩnh viễn")[disabled]').count();
    for (const [k, v] of Object.entries(dlgChecks)) {
      console.log(`  ${v > 0 ? '✅' : '❌'} ${k}`);
    }
    console.log(`  ${isDisabled > 0 ? '✅' : 'ℹ️'} Confirm disabled (verified): ${isDisabled > 0}`);

    await page.locator('button:has-text("Hủy")').click();
    await page.waitForTimeout(300);
    console.log('  Dialog closed ✅');
  } else {
    console.log('⚠️  No trash buttons found at all');
  }

  // ── 6. Lock/Unlock icons ──────────────────────────────────────
  console.log('\n── 6. Lock/Unlock icons ──');
  const lockCount   = await page.locator('button[title="Khóa tài khoản"]').count();
  const unlockCount = await page.locator('button[title="Mở khóa"]').count();
  console.log(`Lock icons:   ${lockCount}  ${lockCount > 0 ? '✅' : '❌'}`);
  console.log(`Unlock icons: ${unlockCount} ${unlockCount > 0 ? '✅' : '—'}`);

  // ── 7. Full table final screenshot ───────────────────────────
  await ss(page, '06_full_table');

  // ── 8. Console errors ────────────────────────────────────────
  console.log('\n── 7. Console errors ──');
  const relevant = jsErrors.filter(e =>
    !e.includes('favicon') && !e.includes('hot-update') && !e.includes('__nextjs')
  );
  console.log(relevant.length === 0 ? '✅ Zero console errors' : `⚠️  ${relevant.length} error(s):`);
  relevant.forEach(e => console.log('   ', e));

  // ── 9. API probe: new fields returned ────────────────────────
  console.log('\n── 8. API probe: emailVerified + displayName ──');
  const apiData = await page.evaluate(async () => {
    const r = await fetch('/api/v1/admin/users?page=0&size=3', { credentials: 'include' });
    return r.json();
  });
  const u = apiData?.data?.[0];
  if (u) {
    console.log(`  emailVerified: ${'emailVerified' in u ? '✅ present' : '❌ MISSING'} → ${u.emailVerified}`);
    console.log(`  displayName:   ${'displayName' in u ? '✅ present' : '❌ MISSING'} → ${u.displayName ?? 'null'}`);
    console.log(`  keys: ${Object.keys(u).join(', ')}`);
  } else {
    console.log('  ❌ No user data in response');
    console.log('  raw:', JSON.stringify(apiData).slice(0, 300));
  }

} catch (err) {
  console.error('\n❌ SCRIPT ERROR:', err.message);
  await ss(page, 'zz_error').catch(() => {});
} finally {
  await browser.close();
}
console.log('\n=== Done ===');
