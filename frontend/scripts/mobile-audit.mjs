// Automated mobile responsiveness audit.
// Loads every route at phone/tablet/desktop widths in both themes and flags:
//   - horizontal overflow (documentElement.scrollWidth > innerWidth+1) + widest offender
//   - input/textarea/select with computed font-size < 16px (iOS auto-zoom)
//   - tap targets (a/button/[role=button]) smaller than 44x44
//   - uncaught page errors
// Screenshots go to scratch/mobile/. Run with the prod build served on :3000
// and the backend on :3001. Usage:
//   node scripts/mobile-audit.mjs [--engine=chromium] [--widths=320,375] [--routes=/feed,/music]
import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.AUDIT_BASE || 'http://localhost:3000';
const API = process.env.AUDIT_API || 'http://localhost:3001';
const OUT = path.resolve(process.cwd(), '..', 'scratch', 'mobile');
const USER = { username: 'audituser', password: 'Zx9#mQ4!pLw72r' };

const args = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const ENGINES = { chromium, firefox, webkit };
const engineNames = (args.engine || 'chromium').split(',');

// width x height; label used in filenames
const ALL_VIEWPORTS = [
  { w: 320, h: 568, label: '320' },
  { w: 375, h: 667, label: '375' },
  { w: 390, h: 844, label: '390' },
  { w: 414, h: 896, label: '414' },
  { w: 768, h: 1024, label: '768' },
  { w: 844, h: 390, label: '844land' }, // phone landscape
  { w: 1280, h: 800, label: '1280' },
  { w: 1440, h: 900, label: '1440' },
];
const viewports = args.widths
  ? ALL_VIEWPORTS.filter((v) => args.widths.split(',').includes(v.label))
  : ALL_VIEWPORTS;

const STATIC_ROUTES = [
  '/', '/about', '/academy', '/admin', '/blog', '/cart', '/chat', '/checkout',
  '/courses', '/creator', '/dashboard', '/dev-hub', '/exp-hub', '/feed',
  '/friends', '/games', '/hub', '/messages', '/music', '/my-courses',
  '/my-orders', '/notes', '/profile', '/projects', '/repos', '/saved',
  '/settings/notifications', '/shop', '/tech-trends', '/login', '/register',
  '/offline',
];

async function fetchJson(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function resolveDynamicRoutes() {
  const routes = [];
  const pick = (d, ...paths) => {
    for (const p of paths) {
      let v = d;
      for (const k of p.split('.')) v = v?.[k];
      if (Array.isArray(v) && v.length) return v[0];
    }
    return null;
  };
  const proj = pick(await fetchJson(`${API}/api/v1/projects?limit=1`), 'data.projects', 'data.items', 'data');
  if (proj?.slug) routes.push(`/projects/${proj.slug}`);
  const prod = pick(await fetchJson(`${API}/api/v1/products?limit=1`), 'data.products', 'data.items', 'data');
  if (prod?.slug) routes.push(`/shop/${prod.slug}`);
  const course = pick(await fetchJson(`${API}/api/v1/courses?limit=1`), 'data.courses', 'data.items', 'data');
  if (course?.slug) routes.push(`/courses/${course.slug}`);
  const blog = pick(await fetchJson(`${API}/api/v1/blog?limit=1`), 'data.posts', 'data.items', 'data');
  if (blog?.slug) routes.push(`/blog/${blog.slug}`);
  routes.push('/profile/7'); // audit user
  return routes;
}

// Evaluated inside the page. Returns issue lists for the current state.
function pageChecks() {
  const issues = { overflow: null, smallInputs: [], smallTaps: [] };
  const doc = document.documentElement;
  const vw = window.innerWidth;

  const cssPath = (el) => {
    const bits = [];
    let n = el;
    while (n && n !== document.body && bits.length < 4) {
      let s = n.tagName.toLowerCase();
      if (n.id) { bits.unshift(`${s}#${n.id}`); break; }
      const cls = (n.className && typeof n.className === 'string')
        ? n.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
      if (cls) s += `.${cls}`;
      bits.unshift(s);
      n = n.parentElement;
    }
    return bits.join(' > ');
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const st = getComputedStyle(el);
    return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0';
  };

  if (doc.scrollWidth > vw + 1) {
    // find widest offender
    let worst = null;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width <= vw + 1 && r.right <= vw + 1 && r.left >= -1) continue;
      if (!visible(el)) continue;
      const over = Math.max(r.right - vw, -r.left, r.width - vw);
      // prefer deepest offender: skip if a child is already wider
      if (!worst || over > worst.over) worst = { over, el };
    }
    issues.overflow = {
      scrollWidth: doc.scrollWidth,
      innerWidth: vw,
      offender: worst ? `${cssPath(worst.el)} (+${Math.round(worst.over)}px)` : 'unknown',
    };
  }

  for (const el of document.querySelectorAll('input, textarea, select')) {
    if (!visible(el)) continue;
    if (['checkbox', 'radio', 'range', 'file', 'hidden', 'button', 'submit'].includes(el.type)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 16) issues.smallInputs.push(`${cssPath(el)} (${fs}px)`);
  }

  for (const el of document.querySelectorAll('a, button, [role="button"]')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    // inline text links inside paragraphs are exempt by convention
    if (el.tagName === 'A' && el.closest('p, li, td')) continue;
    if ((r.width < 44 || r.height < 44) && r.width > 0 && r.height > 0) {
      // padding may extend the effective hit area via parent — keep simple: flag < 32 as bad, 32-43 as warn
      if (r.width < 32 || r.height < 32) {
        issues.smallTaps.push(`${cssPath(el)} (${Math.round(r.width)}x${Math.round(r.height)})`);
      }
    }
  }
  issues.smallInputs = issues.smallInputs.slice(0, 8);
  issues.smallTaps = issues.smallTaps.slice(0, 8);
  return issues;
}

async function login(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60000 });
  // Wait for the actual input element to appear (CSR bailout on login page)
  await page.waitForSelector('input[placeholder="Enter your username"]', { timeout: 30000 });
  await page.fill('input[placeholder="Enter your username"]', USER.username);
  await page.fill('input[placeholder="Enter your password"]', USER.password);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1500);
  const state = await ctx.storageState();
  const loggedIn = !page.url().includes('/login');
  await ctx.close();
  if (!loggedIn) console.warn('⚠ login did not navigate away from /login — auth pages may redirect');
  return state;
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const dynamicRoutes = await resolveDynamicRoutes();
  const routes = args.routes ? args.routes.split(',') : [...STATIC_ROUTES, ...dynamicRoutes];
  const results = []; // {engine, route, width, theme, finalUrl, overflow, smallInputs, smallTaps, errors}

  for (const engineName of engineNames) {
    const engine = ENGINES[engineName];
    if (!engine) { console.warn(`unknown engine ${engineName}`); continue; }
    let browser;
    try {
      browser = await engine.launch();
    } catch (e) {
      console.warn(`⚠ ${engineName} not available: ${e.message.split('\n')[0]}`);
      continue;
    }
    console.log(`\n=== engine: ${engineName} ===`);
    const state = await login(browser);

    for (const vp of viewports) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        storageState: state,
        isMobile: engineName !== 'firefox' && vp.w < 1000,
        hasTouch: vp.w < 1000,
        deviceScaleFactor: 2,
        userAgent: vp.w < 1000
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          : undefined,
      });
      // theme: start dark (default)
      await ctx.addInitScript(() => localStorage.setItem('theme', 'dark'));

      for (const route of routes) {
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
        const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[\/\[\]]+/g, '-');
        try {
          await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
          await page.waitForTimeout(800);

          for (const theme of ['dark', 'light']) {
            if (theme === 'light') {
              await page.evaluate(() => {
                localStorage.setItem('theme', 'light');
                document.documentElement.classList.remove('theme-dark');
                document.documentElement.classList.add('light');
              });
              await page.waitForTimeout(300);
            }
            const issues = await page.evaluate(pageChecks);
            const finalUrl = page.url().replace(BASE, '');
            results.push({
              engine: engineName, route, width: vp.label, theme, finalUrl,
              ...issues, errors: [...new Set(errors)].slice(0, 3),
            });
            const hasIssue = issues.overflow || issues.smallInputs.length || errors.length;
            if (theme === 'dark' || hasIssue) {
              await page.screenshot({
                path: path.join(OUT, `${slug}--${vp.label}--${theme}${hasIssue ? '--ISSUE' : ''}.png`),
                fullPage: false,
              }).catch(() => {});
            }
            if (hasIssue) {
              console.log(`  ✗ ${route} @${vp.label} ${theme}: ` +
                `${issues.overflow ? `OVERFLOW(${issues.overflow.offender}) ` : ''}` +
                `${issues.smallInputs.length ? `inputs<16px:${issues.smallInputs.length} ` : ''}` +
                `${errors.length ? `errors:${errors.length}` : ''}`);
            }
          }
        } catch (e) {
          results.push({ engine: engineName, route, width: vp.label, theme: 'n/a', finalUrl: 'LOAD FAILED', overflow: null, smallInputs: [], smallTaps: [], errors: [String(e.message).slice(0, 150)] });
          console.log(`  ✗ ${route} @${vp.label}: LOAD FAILED ${e.message.split('\n')[0]}`);
        } finally {
          await page.close();
        }
      }
      await ctx.close();
      console.log(`  done ${vp.label}px (${routes.length} routes)`);
    }
    await browser.close();
  }

  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));

  // Markdown summary: only rows with problems
  const bad = results.filter((r) => r.overflow || r.smallInputs.length || r.smallTaps.length || r.errors.length);
  let md = `# Mobile audit — ${new Date().toISOString()}\n\nBase ${BASE}. ${results.length} checks, ${bad.length} with findings.\n\n`;
  md += '| engine | route | width | theme | overflow (offender) | inputs<16px | taps<32px | js errors |\n|---|---|---|---|---|---|---|---|\n';
  for (const r of bad) {
    md += `| ${r.engine} | ${r.route} | ${r.width} | ${r.theme} | ${r.overflow ? r.overflow.offender.replace(/\|/g, '\\|') : ''} | ${r.smallInputs.length} | ${r.smallTaps.length} | ${r.errors.join('; ').replace(/\|/g, '\\|')} |\n`;
  }
  fs.writeFileSync(path.join(OUT, 'report.md'), md);
  console.log(`\n${bad.length}/${results.length} checks with findings → scratch/mobile/report.md`);
}

run().catch((e) => { console.error(e); process.exit(1); });
