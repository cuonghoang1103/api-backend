/**
 * _ma.mjs (Chương 7) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  viteConfig: `import { defineConfig } from 'vite';

// Builds the LabFlow Lite web app into dist-web/ (Chapter 7). Tests of the components still run in jsdom (Chapter 6).
export default defineConfig({
  root: 'web/app',
  build: {
    outDir: '../../dist-web',
    emptyOutDir: true,
    rollupOptions: {
      // 'use client' marks Next.js client components (lesson 6.4); a plain bundle has no use for it.
      onwarn(warning, warn) { if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning); },
    },
  },
});`,
  pwConfig: `import { defineConfig, devices } from '@playwright/test';

// End-to-end tests (Chapter 7). Run: npm run test:e2e
export default defineConfig({
  testDir: '.',
  testMatch: ['e2e/**/*.spec.js', 'demo7/**/*.spec.js'],   // npm run test:e2e runs e2e/ only
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build:web && node e2e/server.js',
    url: 'http://localhost:4173/api/health',
    reuseExistingServer: false,   // always build and start fresh: the mutation script (Lab 7) depends on it
  },
  projects: [
    { name: 'setup', testMatch: /auth\\.setup\\.js/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] }, dependencies: ['setup'] },
  ],
});`,
  server: `// The whole LabFlow Lite app for end-to-end tests (Chapter 7): the Chapter 5 API, a demo login, and the built web app.
// Run: npm run build:web && node e2e/server.js   (Playwright starts it for you — see playwright.config.js)
import path from 'node:path';
import express from 'express';
import { createApp } from '../src/api/server.js';
import { createAuth } from '../src/api/auth.js';
import { createMemoryRepo } from '../src/booking/service.js';

const auth = createAuth({ secret: process.env.JWT_SECRET ?? 'e2e-secret-not-for-production' });
const app = createApp({ repo: createMemoryRepo(), auth });

// Demo accounts — this server only ever runs on a developer machine or in CI.
const USERS = { an: 'STUDENT', binh: 'STUDENT', thay: 'LECTURER', boss: 'ADMIN' };
const PASSWORD = 'labflow-demo';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  const role = USERS[username];
  if (!role || password !== PASSWORD) return res.status(401).json({ error: { code: 'BAD_LOGIN' } });
  res.json({ token: await auth.sign({ id: username, role }), user: { id: username, role } });
});

const dist = path.resolve(import.meta.dirname, '../dist-web');
app.use(express.static(dist));
app.get('/{*page}', (req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT ?? 4173);
app.listen(port, () => console.log('LabFlow Lite (e2e) on http://localhost:' + port));`,
  app: `// The LabFlow Lite web app (Chapter 7): sign in, then book a lab — or, as an admin, see every booking.
import { useState } from 'react';
import { createClient } from '../api.js';
import { BookingForm } from '../BookingForm.jsx';
import { AdminBookings } from '../AdminBookings.jsx';
import { LoginForm } from './LoginForm.jsx';

const KEY = 'labflow.session';

function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export function App() {
  const [session, setSession] = useState(loadSession);

  function signIn(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
    setSession(next);
  }
  function signOut() {
    localStorage.removeItem(KEY);
    setSession(null);
  }

  if (!session) {
    return (<><header><h1>LabFlow Lite</h1></header><main><LoginForm onLogin={signIn} /></main></>);
  }
  const client = createClient({ token: session.token });
  return (
    <>
      <header>
        <h1>LabFlow Lite</h1>
        <span>Signed in as {session.user.id} ({session.user.role}) <button type="button" onClick={signOut}>Sign out</button></span>
      </header>
      <main>
        {session.user.role === 'ADMIN'
          ? (<><h2>All bookings</h2><AdminBookings client={client} /></>)
          : (<><h2>Book a lab</h2><BookingForm onSubmit={client.createBooking} /></>)}
      </main>
    </>
  );
}`,
  loginForm: `// Sign in with a demo account. The API answers { token, user } or 401.
import { useState } from 'react';

export function LoginForm({ onLogin, send = (...args) => fetch(...args) }) {
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await send('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.get('username'), password: form.get('password') }),
      });
      if (res.status === 200) onLogin(await res.json());
      else setError('Wrong username or password.');
    } catch {
      setError('Cannot reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form aria-label="Sign in" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p><label htmlFor="login-username">Username</label><input id="login-username" name="username" autoComplete="username" /></p>
      <p><label htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" /></p>
      <button type="submit" disabled={busy}>Sign in</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}`,
  pkg: `{
  "name": "labflow-lite",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run src/",
    "test:watch": "vitest",
    "test:int": "vitest run --config vitest.integration.config.js",
    "test:web": "vitest run --config vitest.web.config.js web/",
    "build:web": "vite build",
    "test:e2e": "playwright test e2e/ --project=chromium",
    "test:e2e:all": "playwright test e2e/"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@playwright/test": "1.64.1",
    "@testcontainers/postgresql": "^12.2.1",
    "@testing-library/dom": "10.4.2",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.8",
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "fast-check": "^4.10.2",
    "happy-dom": "21.0.3",
    "jsdom": "30.1.3",
    "msw": "^3.0.3",
    "supertest": "^7.3.1",
    "testcontainers": "^12.2.1",
    "vite": "8.3.5",
    "vitest": "^5.0.5"
  },
  "dependencies": {
    "express": "^5.3.0",
    "jose": "6.2.12",
    "pg": "^8.23.1",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "zod": "4.6.7"
  }
}`,
  gitignore: `node_modules/
dist-web/
test-results/
playwright-report/
blob-report/
playwright/.auth/`,
  helpers: `// Helpers shared by the end-to-end tests (Chapter 7).
import { createHash } from 'node:crypto';

export const PASSWORD = 'labflow-demo';

export async function signIn(page, username) {
  await page.goto('/');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

export async function book(page, { lab = 'BE-201', date = '2026-11-16', start = '08:00', end = '10:00', seats = '20' } = {}) {
  await page.getByLabel('Lab', { exact: true }).fill(lab);
  await page.getByLabel('Date', { exact: true }).fill(date);
  await page.getByLabel('Start', { exact: true }).fill(start);
  await page.getByLabel('End', { exact: true }).fill(end);
  await page.getByLabel('Seats', { exact: true }).fill(seats);
  await page.getByRole('button', { name: 'Book' }).click();
}

// A lab code of its own for every test, every repeat and every retry: tests running in parallel never share a slot (lesson 7.3).
export function freshLab(testInfo) {
  const key = [testInfo.testId, testInfo.repeatEachIndex, testInfo.retry].join('/');
  const n = parseInt(createHash('sha256').update(key).digest('hex').slice(0, 8), 16) % 900;
  return 'QA-' + String(100 + n);
}`,
  authSetup: `// Runs once before the browser tests: sign in through the real page and keep the session (lesson 7.2).
import { test as setup, expect } from '@playwright/test';
import { signIn } from './helpers.js';

for (const user of ['an', 'boss']) {
  setup('sign in as ' + user, async ({ page }) => {
    await signIn(page, user);
    await expect(page.getByText('Signed in as ' + user)).toBeVisible();
    await page.context().storageState({ path: 'playwright/.auth/' + user + '.json' });
  });
}`,
  datPhong: `// Booking journeys, end to end (lesson 7.2 and Lab 7). Signed in once by auth.setup.js.
import { test, expect } from '@playwright/test';
import { book, freshLab } from './helpers.js';

test.describe('as student an', () => {
  test.use({ storageState: 'playwright/.auth/an.json' });

  test('books a lab and sees it confirmed', async ({ page }, testInfo) => {
    const lab = freshLab(testInfo);
    await page.goto('/');
    await book(page, { lab });
    await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
  });

  test('31 seats waits for approval', async ({ page }, testInfo) => {
    await page.goto('/');
    await book(page, { lab: freshLab(testInfo), seats: '31' });
    await expect(page.getByRole('status')).toHaveText('Sent. A lecturer must approve this booking.');
  });

  test('the same slot twice is refused', async ({ page }, testInfo) => {
    const lab = freshLab(testInfo);
    await page.goto('/');
    await book(page, { lab });
    await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: 'Book' }).click();
    await expect(page.getByRole('alert')).toHaveText('This slot is already taken. Choose another time.');
  });
});

test('a booking by an shows up in the admin list', async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const student = await browser.newContext({ storageState: 'playwright/.auth/an.json' });
  const admin = await browser.newContext({ storageState: 'playwright/.auth/boss.json' });
  const studentPage = await student.newPage();
  await studentPage.goto('/');
  await book(studentPage, { lab, date: '2026-11-20', start: '13:00', end: '15:00' });
  await expect(studentPage.getByRole('status')).toBeVisible();

  const adminPage = await admin.newPage();
  await adminPage.goto('/');
  const row = adminPage.getByRole('row', { name: new RegExp(lab) });
  await expect(row).toContainText('2026-11-20');
  await expect(row).toContainText('13:00–15:00');
  await student.close();
  await admin.close();
});`,
  dangNhap: `// Signing in and out (Lab 7). These tests start signed out on purpose.
import { test, expect } from '@playwright/test';
import { signIn, PASSWORD } from './helpers.js';

test('a wrong password is refused with an alert', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username', { exact: true }).fill('an');
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD + '!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Wrong username or password.');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('a session survives a reload; signing out ends it', async ({ page }) => {
  await signIn(page, 'an');
  await expect(page.getByText('Signed in as an (STUDENT)')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Book a lab' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('an admin sees the list, not the form', async ({ page }) => {
  await signIn(page, 'boss');
  await expect(page.getByRole('heading', { name: 'All bookings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Book' })).toHaveCount(0);
});`,
  dauTien: `import { test, expect } from '@playwright/test';

test('the sign-in page shows its form', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByLabel('Username')).toBeEditable();
});

test('a student signs in and books a lab', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('an');
  await page.getByLabel('Password').fill('labflow-demo');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Signed in as an (STUDENT)')).toBeVisible();

  await page.getByLabel('Date').fill('2026-11-16');
  await page.getByLabel('Start').fill('08:00');
  await page.getByLabel('End').fill('10:00');
  await page.getByLabel('Seats').fill('20');
  await page.getByRole('button', { name: 'Book' }).click();
  await expect(page.getByRole('status')).toHaveText('Booked. See you in BE-201.');
});

test('a wrong password is refused', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('an');
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Wrong username or password.');
});`,
  strict: `import { test, expect } from '@playwright/test';
import { signIn } from '../e2e/helpers.js';

test('RED ON PURPOSE — getByLabel matches part of a name by default', async ({ page }) => {
  await signIn(page, 'an');
  await page.getByLabel('Lab').fill('BE-305');
});

test('exact: true matches the whole label', async ({ page }) => {
  await signIn(page, 'an');
  await page.getByLabel('Lab', { exact: true }).fill('BE-305');
  await expect(page.getByRole('textbox', { name: 'Lab', exact: true })).toHaveValue('BE-305');
});`,
  cho: `import { test, expect } from '@playwright/test';
import { signIn, book } from '../e2e/helpers.js';

// The API answers 1.5 seconds late — like a slow network. Which assertion copes?
test.beforeEach(async ({ page }) => {
  await page.route('**/api/bookings', async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });
});

test('web-first assertion: retries until the text appears', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'DM-701' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in DM-701.');
});

test('RED ON PURPOSE — isVisible() answers at once and never waits', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'DM-702' });
  expect(await page.getByRole('status').isVisible()).toBe(true);
});

test('RED ON PURPOSE — a fixed sleep shorter than the delay', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'DM-703' });
  await page.waitForTimeout(1000);
  expect(await page.getByRole('status').isVisible()).toBe(true);
});`,
  moiLan: `import { test, expect } from '@playwright/test';
import { signIn, book, freshLab } from '../e2e/helpers.js';

// Six bookings, each test signs in through the form first.
for (let i = 1; i <= 6; i++) {
  test('sign in, then booking ' + i, async ({ page }, testInfo) => {
    await signIn(page, 'an');
    await book(page, { lab: freshLab(testInfo) });
    await expect(page.getByRole('status')).toContainText('Booked');
  });
}`,
  dungLai: `import { test, expect } from '@playwright/test';
import { book, freshLab } from '../e2e/helpers.js';

// The same six bookings, reusing the session saved by e2e/auth.setup.js.
test.use({ storageState: 'playwright/.auth/an.json' });

for (let i = 1; i <= 6; i++) {
  test('signed in already, booking ' + i, async ({ page }, testInfo) => {
    await page.goto('/');
    await book(page, { lab: freshLab(testInfo) });
    await expect(page.getByRole('status')).toContainText('Booked');
  });
}`,
  chung: `import { test, expect } from '@playwright/test';
import { book } from '../e2e/helpers.js';

// Two tests, written months apart by two people, both use the "obvious" test data: SH-301, 16 Nov, 08:00–10:00.
test.use({ storageState: 'playwright/.auth/an.json' });

test('booking from the home page', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'SH-301' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in SH-301.');
});

test('booking shows the confirmation', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'SH-301' });
  await expect(page.getByRole('status')).toContainText('SH-301');
});`,
  trace: `import { test, expect } from '@playwright/test';
import { book } from '../e2e/helpers.js';

test.use({ storageState: 'playwright/.auth/an.json', trace: 'on' });

test('RED ON PURPOSE — expects the wrong message, leaves a trace behind', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'TR-701', seats: '31' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in TR-701.', { timeout: 2000 });
});`,
  thuLai: `import { test, expect } from '@playwright/test';
import { book } from '../e2e/helpers.js';

test.use({ storageState: 'playwright/.auth/an.json' });

// Simulated flakiness: on the first attempt the API answers after 6 s, longer than expect's 5 s.
test('a slow first attempt, then a normal retry', async ({ page }, testInfo) => {
  if (testInfo.retry === 0) {
    await page.route('**/api/bookings', async (route) => {
      await new Promise((r) => setTimeout(r, 6000));
      await route.continue();
    });
  }
  await page.goto('/');
  await book(page, { lab: 'RT-70' + testInfo.retry });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in RT-70' + testInfo.retry + '.');
});`,
  hinhAnh: `import { test, expect } from '@playwright/test';

// Compares the sign-in page with a stored picture. The first run has no picture yet and writes one.
test('the sign-in page looks as before', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page).toHaveScreenshot('sign-in.png');
});`,
  th71: `import { test, expect } from '@playwright/test';
import { signIn } from '../e2e/helpers.js';

test('the page title, and the password field hides what you type', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('LabFlow Lite');
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
});

test('a lecturer signs in and gets the booking form', async ({ page }) => {
  await signIn(page, 'thay');
  await expect(page.getByText('Signed in as thay (LECTURER)')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Book a lab' })).toBeVisible();
});`,
  th72: `import { test, expect } from '@playwright/test';
import { signIn, book, freshLab } from '../e2e/helpers.js';

test('a lecturer books 40 seats: confirmed at once, and the admin sees CONFIRMED', async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const lecturer = await (await browser.newContext()).newPage();
  await signIn(lecturer, 'thay');
  await book(lecturer, { lab, seats: '40' });
  await expect(lecturer.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');

  const admin = await (await browser.newContext({ storageState: 'playwright/.auth/boss.json' })).newPage();
  await admin.goto('/');
  await expect(admin.getByRole('row', { name: new RegExp(lab) })).toContainText('CONFIRMED');
});`,
  th73: `import { test, expect } from '@playwright/test';
import { book, freshLab } from '../e2e/helpers.js';

// The two tests of du-lieu-chung.spec.js, each with a lab of its own.
test.use({ storageState: 'playwright/.auth/an.json' });

test('booking from the home page', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
});

test('booking shows the confirmation', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab });
  await expect(page.getByRole('status')).toContainText(lab);
});`,
  th74: `import { test, expect } from '@playwright/test';

// The header title shrinks on small screens (style.css: @media (max-width: 600px)).
test('the header title size follows the screen width', async ({ page }, testInfo) => {
  await page.goto('/');
  const mobile = testInfo.project.name.startsWith('mobile');
  await expect(page.getByRole('heading', { name: 'LabFlow Lite' })).toHaveCSS('font-size', mobile ? '17px' : '20px');
});`,
  weak7: `import { test, expect } from '@playwright/test';
import { signIn, book } from './helpers.js';

test('the app loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('LabFlow Lite');
});

test('a student can book', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'WK-701' });
  await page.waitForTimeout(500);
  expect(await page.textContent('body')).toContain('Booked');
});

test('the admin can sign in', async ({ page }) => {
  await signIn(page, 'boss');
  await page.waitForTimeout(500);
  expect(page.url()).toContain('localhost');
});`,
  dotBien7: `// Lab 7 mutants (Chapter 7: end-to-end). Plant one bug at a time in the web app or the server, run the browser tests, restore.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['web/app/App.jsx', "session.user.role === 'ADMIN'", "session.user.role === 'LECTURER'", 'admins get the booking form, not the list'],
  ['web/app/App.jsx', 'localStorage.removeItem(KEY);', '', 'Sign out does not end the session'],
  ['web/app/App.jsx', 'try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }', 'return null;', 'a reload signs the user out'],
  ['e2e/server.js', 'password !== PASSWORD', 'password === undefined', 'any password is accepted'],
  ['web/app/App.jsx', 'createClient({ token: session.token })', 'createClient({ token: session.user.id })', 'requests carry the wrong token'],
  ['web/app/LoginForm.jsx', '{error && <p role="alert">{error}</p>}', '{error && <p>{error}</p>}', 'a failed sign-in is not announced'],
  ['web/app/LoginForm.jsx', "password: form.get('password')", "password: form.get('username')", 'the username is sent as the password'],
  ['e2e/server.js', "boss: 'ADMIN'", "boss: 'LECTURER'", 'the admin account lost its role'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['playwright', 'test', 'e2e/', '--project=chromium'], { encoding: 'utf8', shell: process.platform === 'win32' });
    const dead = run.status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(file, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
  thuLoiPw: `// Like thu-loi.mjs, for Playwright: plant ONE change, run the given Playwright args, always restore the file.
// node scripts/thu-loi-pw.mjs <file> "<exact text>" "<replacement>" <playwright args…>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [file, from, to, ...args] = process.argv.slice(2);
const original = readFileSync(file, 'utf8');
if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
writeFileSync(file, original.replace(from, to));
console.log('planted in ' + file + ':  ' + from + '  →  ' + to + '\\n');
try {
  const run = spawnSync('npx', ['playwright', 'test', ...args], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exitCode = run.status;
} finally {
  writeFileSync(file, original);
}`,
  quaApi: `import { test, expect } from '@playwright/test';
import { freshLab, PASSWORD } from '../e2e/helpers.js';

// Arrange through the API (fast, exact), then check through the page what a user sees.
test('a booking made through the API shows up in the admin list', async ({ request, browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const login = await request.post('/api/login', { data: { username: 'an', password: PASSWORD } });
  const { token } = await login.json();
  const created = await request.post('/api/bookings', {
    headers: { Authorization: 'Bearer ' + token },
    data: { lab, date: '2026-11-20', start: '13:00', end: '15:00', seats: 20 },
  });
  expect(created.status()).toBe(201);

  const admin = await browser.newContext({ storageState: 'playwright/.auth/boss.json' });
  const page = await admin.newPage();
  await page.goto('/');
  await expect(page.getByRole('row', { name: new RegExp(lab) })).toContainText('13:00–15:00');
  await admin.close();
});`,
  cungLuc: `import { test, expect } from '@playwright/test';
import { PASSWORD } from '../e2e/helpers.js';

// RED ON PURPOSE: the e2e server keeps bookings in memory, and that repository still has the
// check-then-insert race of Chapter 2. Two students send the same slot at the same moment.
test('RED ON PURPOSE — two students, one slot, the same moment', async ({ request }) => {
  const tokenOf = async (username) => (await (await request.post('/api/login', { data: { username, password: PASSWORD } })).json()).token;
  const [an, binh] = [await tokenOf('an'), await tokenOf('binh')];
  const slot = { lab: 'RC-701', date: '2026-11-18', start: '08:00', end: '10:00', seats: 20 };
  const send = (token) => request.post('/api/bookings', { headers: { Authorization: 'Bearer ' + token }, data: slot });
  const answers = await Promise.all([send(an), send(binh)]);
  expect(answers.map((r) => r.status()).sort()).toEqual([201, 409]);
});`,
  style: `/* Just enough style for a real page: the screenshots in lesson 7.4 compare it pixel by pixel. */
body { font-family: system-ui, sans-serif; margin: 0; background: #f6f7f9; color: #1f2933; }
header { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: #e06a1b; color: #fff; }
header h1 { font-size: 20px; margin: 0; }
main { max-width: 640px; margin: 24px auto; padding: 20px; background: #fff; border-radius: 8px; }
form p { display: flex; flex-direction: column; gap: 4px; margin: 0 0 12px; }
input { font-size: 16px; padding: 6px 8px; border: 1px solid #9aa5b1; border-radius: 4px; }
input[aria-invalid="true"] { border-color: #c0392b; }
button { font-size: 16px; padding: 8px 16px; border: 0; border-radius: 4px; background: #e06a1b; color: #fff; cursor: pointer; }
button:disabled { opacity: 0.6; }
[role="alert"] { color: #c0392b; }
[role="status"] { color: #2f7d4f; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 6px; border-bottom: 1px solid #e4e7eb; }
@media (max-width: 600px) { main { margin: 0; border-radius: 0; } header h1 { font-size: 17px; } }`,
};
export const OUT = {
  '71-build': `$ npm run build:web

> labflow-lite@1.0.0 build:web
> vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 20 modules transformed.
rendering chunks...
computing gzip size...
dist-web/index.html                   0.39 kB │ gzip:  0.26 kB
dist-web/assets/index-CiS8iuJk.css    0.88 kB │ gzip:  0.47 kB
dist-web/assets/index-BKXk9vw9.js   225.58 kB │ gzip: 70.78 kB

✓ built in 84ms`,
  '71-cho': `$ npx playwright test demo7/cho-tu-dong.spec.js --project=chromium

Running 5 tests using 3 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (256ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (255ms)
  ✘  5 [chromium] › demo7/cho-tu-dong.spec.js:18:1 › RED ON PURPOSE — isVisible() answers at once and never waits (375ms)
  ✘  3 [chromium] › demo7/cho-tu-dong.spec.js:24:1 › RED ON PURPOSE — a fixed sleep shorter than the delay (1.4s)
  ✓  4 [chromium] › demo7/cho-tu-dong.spec.js:12:1 › web-first assertion: retries until the text appears (2.2s)


  1) [chromium] › demo7/cho-tu-dong.spec.js:18:1 › RED ON PURPOSE — isVisible() answers at once and never waits 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      19 |   await signIn(page, 'an');
      20 |   await book(page, { lab: 'DM-702' });
    > 21 |   expect(await page.getByRole('status').isVisible()).toBe(true);
         |                                                      ^
      22 | });
      23 |
      24 | test('RED ON PURPOSE — a fixed sleep shorter than the delay', async ({ page }) => {
        at …/labflow-lite/demo7/cho-tu-dong.spec.js:21:54

    Error Context: test-results/demo7-cho-tu-dong-RED-ON-P-2f54f-ers-at-once-and-never-waits-chromium/error-context.md

  2) [chromium] › demo7/cho-tu-dong.spec.js:24:1 › RED ON PURPOSE — a fixed sleep shorter than the delay 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      26 |   await book(page, { lab: 'DM-703' });
      27 |   await page.waitForTimeout(1000);
    > 28 |   expect(await page.getByRole('status').isVisible()).toBe(true);
         |                                                      ^
      29 | });
      30 |
        at …/labflow-lite/demo7/cho-tu-dong.spec.js:28:54

    Error Context: test-results/demo7-cho-tu-dong-RED-ON-P-543d6-leep-shorter-than-the-delay-chromium/error-context.md

  2 failed
    [chromium] › demo7/cho-tu-dong.spec.js:18:1 › RED ON PURPOSE — isVisible() answers at once and never waits 
    [chromium] › demo7/cho-tu-dong.spec.js:24:1 › RED ON PURPOSE — a fixed sleep shorter than the delay 
  3 passed (4.3s)`,
  '71-dau-tien': `$ npx playwright test demo7/dau-tien.spec.js --project=chromium

Running 5 tests using 3 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (281ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (281ms)
  ✓  3 [chromium] › demo7/dau-tien.spec.js:3:1 › the sign-in page shows its form (142ms)
  ✓  5 [chromium] › demo7/dau-tien.spec.js:24:1 › a wrong password is refused (261ms)
  ✓  4 [chromium] › demo7/dau-tien.spec.js:9:1 › a student signs in and books a lab (353ms)

  5 passed (2.5s)`,
  '71-strict': `$ npx playwright test demo7/strict.spec.js --project=chromium

Running 4 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (257ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (258ms)
  ✓  4 [chromium] › demo7/strict.spec.js:9:1 › exact: true matches the whole label (264ms)
  ✘  3 [chromium] › demo7/strict.spec.js:4:1 › RED ON PURPOSE — getByLabel matches part of a name by default (274ms)


  1) [chromium] › demo7/strict.spec.js:4:1 › RED ON PURPOSE — getByLabel matches part of a name by default 

    Error: locator.fill: Error: strict mode violation: getByLabel('Lab') resolved to 2 elements:
        1) <form novalidate="" aria-label="Book a lab">…</form> aka getByRole('form', { name: 'Book a lab' })
        2) <input name="lab" value="BE-201" id="booking-lab"/> aka getByRole('textbox', { name: 'Lab' })

    Call log:
      - waiting for getByLabel('Lab')


      4 | test('RED ON PURPOSE — getByLabel matches part of a name by default', async ({ page }) => {
      5 |   await signIn(page, 'an');
    > 6 |   await page.getByLabel('Lab').fill('BE-305');
        |                                ^
      7 | });
      8 |
      9 | test('exact: true matches the whole label', async ({ page }) => {
        at …/labflow-lite/demo7/strict.spec.js:6:32

    Error Context: test-results/demo7-strict-RED-ON-PURPOS-70bb1-s-part-of-a-name-by-default-chromium/error-context.md

  1 failed
    [chromium] › demo7/strict.spec.js:4:1 › RED ON PURPOSE — getByLabel matches part of a name by default 
  3 passed (2.3s)`,
  '71-th': `$ npx playwright test demo7/th71.spec.js --project=chromium

Running 4 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (266ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (266ms)
  ✓  4 [chromium] › demo7/th71.spec.js:4:1 › the page title, and the password field hides what you type (110ms)
  ✓  3 [chromium] › demo7/th71.spec.js:10:1 › a lecturer signs in and gets the booking form (234ms)

  4 passed (2.3s)`,
  '72-auth-file': `$ node -e "const s = JSON.parse(require('fs').readFileSync('playwright/.auth/an.json', 'utf8')); console.log(JSON.stringify(s, null, 2))"
{
  "cookies": [],
  "origins": [
    {
      "origin": "http://localhost:4173",
      "localStorage": [
        {
          "name": "labflow.session",
          "value": "{\\"token\\":\\"eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInN1YiI6ImFuIiwiaWF0IjoxNzkzNDg1NjIyLCJleHAiOjE3OTM0ODkyMjJ9.8Eeg18_RhbfSqh6i34iC3l_2SPMdQO-47sdh9XXftc0\\",\\"user\\":{\\"id\\":\\"an\\",\\"role\\":\\"STUDENT\\"}}"
        }
      ]
    }
  ]
}`,
  '72-dung-lai': `$ npx playwright test demo7/dung-lai.spec.js --project=chromium --workers=1

Running 8 tests using 1 worker

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (226ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (187ms)
  ✓  3 [chromium] › demo7/dung-lai.spec.js:8:3 › signed in already, booking 1 (324ms)
  ✓  4 [chromium] › demo7/dung-lai.spec.js:8:3 › signed in already, booking 2 (294ms)
  ✓  5 [chromium] › demo7/dung-lai.spec.js:8:3 › signed in already, booking 3 (289ms)
  ✓  6 [chromium] › demo7/dung-lai.spec.js:8:3 › signed in already, booking 4 (308ms)
  ✓  7 [chromium] › demo7/dung-lai.spec.js:8:3 › signed in already, booking 5 (290ms)
  ✓  8 [chromium] › demo7/dung-lai.spec.js:8:3 › signed in already, booking 6 (289ms)

  8 passed (4.0s)`,
  '72-e2e': `$ npm run test:e2e

> labflow-lite@1.0.0 test:e2e
> playwright test e2e/ --project=chromium


Running 9 tests using 5 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (250ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (251ms)
  ✓  6 [chromium] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (408ms)
  ✓  3 [chromium] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (359ms)
  ✓  5 [chromium] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (446ms)
  ✓  4 [chromium] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (523ms)
  ✓  7 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (478ms)
  ✓  8 [chromium] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (406ms)
  ✓  9 [chromium] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (475ms)

  9 passed (3.1s)`,
  '72-moi-lan': `$ npx playwright test demo7/moi-lan.spec.js --project=chromium --workers=1

Running 8 tests using 1 worker

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (227ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (191ms)
  ✓  3 [chromium] › demo7/moi-lan.spec.js:6:3 › sign in, then booking 1 (314ms)
  ✓  4 [chromium] › demo7/moi-lan.spec.js:6:3 › sign in, then booking 2 (248ms)
  ✓  5 [chromium] › demo7/moi-lan.spec.js:6:3 › sign in, then booking 3 (250ms)
  ✓  6 [chromium] › demo7/moi-lan.spec.js:6:3 › sign in, then booking 4 (247ms)
  ✓  7 [chromium] › demo7/moi-lan.spec.js:6:3 › sign in, then booking 5 (265ms)
  ✓  8 [chromium] › demo7/moi-lan.spec.js:6:3 › sign in, then booking 6 (261ms)

  8 passed (3.7s)`,
  '72-qua-api': `$ npx playwright test demo7/qua-api.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (493ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (495ms)
  ✓  3 [chromium] › demo7/qua-api.spec.js:5:1 › a booking made through the API shows up in the admin list (252ms)

  3 passed (2.8s)`,
  '72-setup-hong': `$ node scripts/thu-loi-pw.mjs e2e/server.js "if (!role || password !== PASSWORD)" "if (true)" e2e/ --project=chromium
planted in e2e/server.js:  if (!role || password !== PASSWORD)  →  if (true)


Running 9 tests using 5 workers

  ✘  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (5.3s)
  ✘  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (5.3s)


  1) [setup] › e2e/auth.setup.js:6:3 › sign in as an ───────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: getByText('Signed in as an')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" getByText('Signed in as an') with timeout 5000ms
      - waiting for getByText('Signed in as an')


       6 |   setup('sign in as ' + user, async ({ page }) => {
       7 |     await signIn(page, user);
    >  8 |     await expect(page.getByText('Signed in as ' + user)).toBeVisible();
         |                                                          ^
       9 |     await page.context().storageState({ path: 'playwright/.auth/' + user + '.json' });
      10 |   });
      11 | }
        at …/labflow-lite/e2e/auth.setup.js:8:58

    Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup/error-context.md

  2) [setup] › e2e/auth.setup.js:6:3 › sign in as boss ─────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator: getByText('Signed in as boss')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" getByText('Signed in as boss') with timeout 5000ms
      - waiting for getByText('Signed in as boss')


       6 |   setup('sign in as ' + user, async ({ page }) => {
       7 |     await signIn(page, user);
    >  8 |     await expect(page.getByText('Signed in as ' + user)).toBeVisible();
         |                                                          ^
       9 |     await page.context().storageState({ path: 'playwright/.auth/' + user + '.json' });
      10 |   });
      11 | }
        at …/labflow-lite/e2e/auth.setup.js:8:58

    Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup/error-context.md

  2 failed
    [setup] › e2e/auth.setup.js:6:3 › sign in as an ────────────────────────────────────────────────
    [setup] › e2e/auth.setup.js:6:3 › sign in as boss ──────────────────────────────────────────────
  7 did not run`,
  '72-th': `$ npx playwright test demo7/th72.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (332ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (343ms)
  ✓  3 [chromium] › demo7/th72.spec.js:4:1 › a lecturer books 40 seats: confirmed at once, and the admin sees CONFIRMED (411ms)

  3 passed (2.9s)`,
  '73-chung-lap': `$ npx playwright test demo7/du-lieu-chung.spec.js --project=chromium --workers=2 --repeat-each=3

Running 8 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (255ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (272ms)
  ✓  4 [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation (368ms)
  ✓  3 [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page (371ms)
  ✘  6 [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page (5.2s)
  ✘  5 [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation (5.3s)
  ✘  7 [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page (5.3s)
  ✘  8 [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation (5.4s)


  1) [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page ─────────────────────

    Error: expect(locator).toHaveText(expected) failed

    Locator: getByRole('status')
    Expected: "Booked. See you in SH-301."
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


       8 |   await page.goto('/');
       9 |   await book(page, { lab: 'SH-301' });
    > 10 |   await expect(page.getByRole('status')).toHaveText('Booked. See you in SH-301.');
         |                                          ^
      11 | });
      12 |
      13 | test('booking shows the confirmation', async ({ page }) => {
        at …/labflow-lite/demo7/du-lieu-chung.spec.js:10:42

    Error Context: test-results/demo7-du-lieu-chung-booking-from-the-home-page-chromium-repeat1/error-context.md

  2) [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation ────────────────

    Error: expect(locator).toContainText(expected) failed

    Locator: getByRole('status')
    Expected substring: "SH-301"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toContainText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      14 |   await page.goto('/');
      15 |   await book(page, { lab: 'SH-301' });
    > 16 |   await expect(page.getByRole('status')).toContainText('SH-301');
         |                                          ^
      17 | });
      18 |
        at …/labflow-lite/demo7/du-lieu-chung.spec.js:16:42

    Error Context: test-results/demo7-du-lieu-chung-booking-shows-the-confirmation-chromium-repeat1/error-context.md

  3) [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page ─────────────────────

    Error: expect(locator).toHaveText(expected) failed

    Locator: getByRole('status')
    Expected: "Booked. See you in SH-301."
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


       8 |   await page.goto('/');
       9 |   await book(page, { lab: 'SH-301' });
    > 10 |   await expect(page.getByRole('status')).toHaveText('Booked. See you in SH-301.');
         |                                          ^
      11 | });
      12 |
      13 | test('booking shows the confirmation', async ({ page }) => {
        at …/labflow-lite/demo7/du-lieu-chung.spec.js:10:42

    Error Context: test-results/demo7-du-lieu-chung-booking-from-the-home-page-chromium-repeat2/error-context.md

  4) [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation ────────────────

    Error: expect(locator).toContainText(expected) failed

    Locator: getByRole('status')
    Expected substring: "SH-301"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toContainText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      14 |   await page.goto('/');
      15 |   await book(page, { lab: 'SH-301' });
    > 16 |   await expect(page.getByRole('status')).toContainText('SH-301');
         |                                          ^
      17 | });
      18 |
        at …/labflow-lite/demo7/du-lieu-chung.spec.js:16:42

    Error Context: test-results/demo7-du-lieu-chung-booking-shows-the-confirmation-chromium-repeat2/error-context.md

  4 failed
    [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page ──────────────────────
    [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation ─────────────────
    [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page ──────────────────────
    [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation ─────────────────
  4 passed (14.0s)`,
  '73-chung-noi-tiep': `$ npx playwright test demo7/du-lieu-chung.spec.js --project=chromium --workers=1

Running 4 tests using 1 worker

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (241ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (183ms)
  ✓  3 [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page (303ms)
  ✘  4 [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation (5.2s)


  1) [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation ────────────────

    Error: expect(locator).toContainText(expected) failed

    Locator: getByRole('status')
    Expected substring: "SH-301"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toContainText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      14 |   await page.goto('/');
      15 |   await book(page, { lab: 'SH-301' });
    > 16 |   await expect(page.getByRole('status')).toContainText('SH-301');
         |                                          ^
      17 | });
      18 |
        at …/labflow-lite/demo7/du-lieu-chung.spec.js:16:42

    Error Context: test-results/demo7-du-lieu-chung-booking-shows-the-confirmation-chromium/error-context.md

  1 failed
    [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation ─────────────────
  3 passed (7.6s)`,
  '73-chung-song-song': `$ npx playwright test demo7/du-lieu-chung.spec.js --project=chromium --workers=2

Running 4 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (252ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (253ms)
  ✓  3 [chromium] › demo7/du-lieu-chung.spec.js:13:1 › booking shows the confirmation (355ms)
  ✓  4 [chromium] › demo7/du-lieu-chung.spec.js:7:1 › booking from the home page (357ms)

  4 passed (2.4s)`,
  '73-cung-luc': `$ npx playwright test demo7/cung-luc.spec.js --project=chromium

Running 3 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (279ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (280ms)
  ✘  3 [chromium] › demo7/cung-luc.spec.js:6:1 › RED ON PURPOSE — two students, one slot, the same moment (49ms)


  1) [chromium] › demo7/cung-luc.spec.js:6:1 › RED ON PURPOSE — two students, one slot, the same moment 

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
        201,
    -   409,
    +   201,
      ]

      10 |   const send = (token) => request.post('/api/bookings', { headers: { Authorization: 'Bearer ' + token }, data: slot });
      11 |   const answers = await Promise.all([send(an), send(binh)]);
    > 12 |   expect(answers.map((r) => r.status()).sort()).toEqual([201, 409]);
         |                                                 ^
      13 | });
      14 |
        at …/labflow-lite/demo7/cung-luc.spec.js:12:49

    Error Context: test-results/demo7-cung-luc-RED-ON-PURP-5cbeb-ts-one-slot-the-same-moment-chromium/error-context.md

  1 failed
    [chromium] › demo7/cung-luc.spec.js:6:1 › RED ON PURPOSE — two students, one slot, the same moment 
  2 passed (2.0s)`,
  '73-error-context': `$ cat test-results/*/error-context.md
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo7/trace.spec.js >> RED ON PURPOSE — expects the wrong message, leaves a trace behind
- Location: demo7/trace.spec.js:6:1

# Error details

\`\`\`
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('status')
Expected: "Booked. See you in TR-701."
Received: "Sent. A lecturer must approve this booking."
Timeout:  2000ms

Call log:
  - Expect "toHaveText" getByRole('status') with timeout 2000ms
  - waiting for getByRole('status')
    19 × locator resolved to <p role="status">Sent. A lecturer must approve this booking.</p>
       - unexpected value "Sent. A lecturer must approve this booking."

\`\`\`

\`\`\`yaml
- status: Sent. A lecturer must approve this booking.
\`\`\`

# Test source

\`\`\`ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { book } from '../e2e/helpers.js';
  3  | 
  4  | test.use({ storageState: 'playwright/.auth/an.json', trace: 'on' });
  5  | 
  6  | test('RED ON PURPOSE — expects the wrong message, leaves a trace behind', async ({ page }) => {
  7  |   await page.goto('/');
  8  |   await book(page, { lab: 'TR-701', seats: '31' });
> 9  |   await expect(page.getByRole('status')).toHaveText('Booked. See you in TR-701.', { timeout: 2000 });
     |                                          ^ Error: expect(locator).toHaveText(expected) failed
  10 | });
  11 | 
\`\`\``,
  '73-th': `$ npx playwright test demo7/th73.spec.js --project=chromium --workers=4 --repeat-each=5

Running 12 tests using 4 workers

  ✓   2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (235ms)
  ✓   1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (242ms)
  ✓   6 [chromium] › demo7/th73.spec.js:7:1 › booking from the home page (451ms)
  ✓   5 [chromium] › demo7/th73.spec.js:14:1 › booking shows the confirmation (463ms)
  ✓   3 [chromium] › demo7/th73.spec.js:7:1 › booking from the home page (475ms)
  ✓   4 [chromium] › demo7/th73.spec.js:14:1 › booking shows the confirmation (501ms)
  ✓   7 [chromium] › demo7/th73.spec.js:7:1 › booking from the home page (470ms)
  ✓  10 [chromium] › demo7/th73.spec.js:14:1 › booking shows the confirmation (469ms)
  ✓   8 [chromium] › demo7/th73.spec.js:14:1 › booking shows the confirmation (469ms)
  ✓   9 [chromium] › demo7/th73.spec.js:7:1 › booking from the home page (465ms)
  ✓  11 [chromium] › demo7/th73.spec.js:7:1 › booking from the home page (343ms)
  ✓  12 [chromium] › demo7/th73.spec.js:14:1 › booking shows the confirmation (344ms)

  12 passed (4.3s)`,
  '73-thu-lai': `$ npx playwright test demo7/thu-lai.spec.js --project=chromium --retries=2

Running 3 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (250ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (249ms)
  ✘  3 [chromium] › demo7/thu-lai.spec.js:7:1 › a slow first attempt, then a normal retry (5.2s)
  ✓  4 [chromium] › demo7/thu-lai.spec.js:7:1 › a slow first attempt, then a normal retry (retry #1) (372ms)


  1) [chromium] › demo7/thu-lai.spec.js:7:1 › a slow first attempt, then a normal retry ────────────

    Error: expect(locator).toHaveText(expected) failed

    Locator: getByRole('status')
    Expected: "Booked. See you in RT-700."
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      14 |   await page.goto('/');
      15 |   await book(page, { lab: 'RT-70' + testInfo.retry });
    > 16 |   await expect(page.getByRole('status')).toHaveText('Booked. See you in RT-70' + testInfo.retry + '.');
         |                                          ^
      17 | });
      18 |
        at …/labflow-lite/demo7/thu-lai.spec.js:16:42

    Error Context: test-results/demo7-thu-lai-a-slow-first-attempt-then-a-normal-retry-chromium/error-context.md

  1 flaky
    [chromium] › demo7/thu-lai.spec.js:7:1 › a slow first attempt, then a normal retry ─────────────
  2 passed (8.0s)`,
  '73-trace': `$ npx playwright test demo7/trace.spec.js --project=chromium; find test-results -type f | sort

Running 3 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (258ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (258ms)
  ✘  3 [chromium] › demo7/trace.spec.js:6:1 › RED ON PURPOSE — expects the wrong message, leaves a trace behind (2.3s)


  1) [chromium] › demo7/trace.spec.js:6:1 › RED ON PURPOSE — expects the wrong message, leaves a trace behind 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  getByRole('status')
    Expected: "Booked. See you in TR-701."
    Received: "Sent. A lecturer must approve this booking."
    Timeout:  2000ms

    Call log:
      - Expect "toHaveText" getByRole('status') with timeout 2000ms
      - waiting for getByRole('status')
        19 × locator resolved to <p role="status">Sent. A lecturer must approve this booking.</p>
           - unexpected value "Sent. A lecturer must approve this booking."


       7 |   await page.goto('/');
       8 |   await book(page, { lab: 'TR-701', seats: '31' });
    >  9 |   await expect(page.getByRole('status')).toHaveText('Booked. See you in TR-701.', { timeout: 2000 });
         |                                          ^
      10 | });
      11 |
        at …/labflow-lite/demo7/trace.spec.js:9:42

    Error Context: test-results/demo7-trace-RED-ON-PURPOSE-ff4e4-ssage-leaves-a-trace-behind-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/demo7-trace-RED-ON-PURPOSE-ff4e4-ssage-leaves-a-trace-behind-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/demo7-trace-RED-ON-PURPOSE-ff4e4-ssage-leaves-a-trace-behind-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  1 failed
    [chromium] › demo7/trace.spec.js:6:1 › RED ON PURPOSE — expects the wrong message, leaves a trace behind 
  2 passed (4.3s)
test-results/.last-run.json
test-results/demo7-trace-RED-ON-PURPOSE-ff4e4-ssage-leaves-a-trace-behind-chromium/error-context.md
test-results/demo7-trace-RED-ON-PURPOSE-ff4e4-ssage-leaves-a-trace-behind-chromium/trace.zip`,
  '74-all': `$ npm run test:e2e:all

> labflow-lite@1.0.0 test:e2e:all
> playwright test e2e/


Running 37 tests using 5 workers

  ✓   2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (254ms)
  ✓   1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (254ms)
  ✓   3 [chromium] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (356ms)
  ✓   4 [chromium] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (401ms)
  ✓   5 [chromium] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (466ms)
  ✓   7 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (520ms)
  ✓   6 [chromium] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (530ms)
  ✓   8 [chromium] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (414ms)
  ✓   9 [chromium] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (540ms)
  ✓  10 [firefox] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (1.2s)
  ✓  15 [firefox] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (855ms)
  ✓  14 [firefox] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (1.8s)
  ✓  13 [firefox] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (2.1s)
  ✓  12 [firefox] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (2.0s)
  ✓  11 [firefox] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (1.6s)
  ✓  16 [firefox] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (1.7s)
  ✓  17 [webkit] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (1.5s)
  ✓  18 [webkit] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (1.4s)
  ✓  19 [webkit] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (1.2s)
  ✓  21 [webkit] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (1.0s)
  ✓  20 [webkit] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (1.5s)
  ✓  23 [webkit] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (1.4s)
  ✓  24 [mobile-chrome] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (431ms)
  ✓  22 [webkit] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (1.4s)
  ✓  26 [mobile-chrome] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (391ms)
  ✓  25 [mobile-chrome] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (554ms)
  ✓  27 [mobile-chrome] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (412ms)
  ✓  28 [mobile-chrome] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (572ms)
  ✓  29 [mobile-chrome] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (412ms)
  ✓  30 [mobile-chrome] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (444ms)
  ✓  31 [mobile-safari] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (1.3s)
  ✓  33 [mobile-safari] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (1.1s)
  ✓  35 [mobile-safari] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (948ms)
  ✓  32 [mobile-safari] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (2.1s)
  ✓  34 [mobile-safari] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (1.4s)
  ✓  36 [mobile-safari] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (1.4s)
  ✓  37 [mobile-safari] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (1.1s)

  37 passed (16.9s)`,
  '74-devices': `$ node -e "import('@playwright/test').then(({ devices }) => console.log({ 'Pixel 7': devices['Pixel 7'], 'iPhone 15': devices['iPhone 15'] }))"
{
  'Pixel 7': {
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.8078.4 Mobile Safari/537.36',
    viewport: { width: 412, height: 839 },
    screen: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'chromium'
  },
  'iPhone 15': {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.2 Mobile/15E148 Safari/604.1',
    viewport: { width: 393, height: 659 },
    screen: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'webkit'
  }
}`,
  '74-ff-wk': `$ npx playwright test demo7/dau-tien.spec.js --project=firefox --project=webkit; grep -h 'alert:' test-results/*/error-context.md

Running 8 tests using 5 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (429ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (434ms)
  ✓  6 [webkit] › demo7/dau-tien.spec.js:3:1 › the sign-in page shows its form (1.1s)
  ✓  8 [webkit] › demo7/dau-tien.spec.js:24:1 › a wrong password is refused (645ms)
  ✓  7 [webkit] › demo7/dau-tien.spec.js:9:1 › a student signs in and books a lab (1.8s)
  ✓  4 [firefox] › demo7/dau-tien.spec.js:24:1 › a wrong password is refused (2.2s)
  ✓  3 [firefox] › demo7/dau-tien.spec.js:3:1 › the sign-in page shows its form (1.2s)
  ✘  5 [firefox] › demo7/dau-tien.spec.js:9:1 › a student signs in and books a lab (6.9s)


  1) [firefox] › demo7/dau-tien.spec.js:9:1 › a student signs in and books a lab ───────────────────

    Error: expect(locator).toHaveText(expected) failed

    Locator: getByRole('status')
    Expected: "Booked. See you in BE-201."
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveText" getByRole('status') with timeout 5000ms
      - waiting for getByRole('status')


      19 |   await page.getByLabel('Seats').fill('20');
      20 |   await page.getByRole('button', { name: 'Book' }).click();
    > 21 |   await expect(page.getByRole('status')).toHaveText('Booked. See you in BE-201.');
         |                                          ^
      22 | });
      23 |
      24 | test('a wrong password is refused', async ({ page }) => {
        at …/labflow-lite/demo7/dau-tien.spec.js:21:42

    Error Context: test-results/demo7-dau-tien-a-student-signs-in-and-books-a-lab-firefox/error-context.md

  1 failed
    [firefox] › demo7/dau-tien.spec.js:9:1 › a student signs in and books a lab ────────────────────
  7 passed (11.3s)
    - alert: This slot is already taken. Choose another time.`,
  '74-hinh-1': `$ rm -rf demo7/hinh-anh.spec.js-snapshots; npx playwright test demo7/hinh-anh.spec.js --project=chromium --project=mobile-safari

Running 4 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (253ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (254ms)
  ✘  4 [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before (324ms)
  ✘  3 [mobile-safari] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before (1.0s)


  1) [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before ────────────────────

    Error: A snapshot doesn't exist at …/labflow-lite/demo7/hinh-anh.spec.js-snapshots/sign-in-chromium-darwin.png, writing actual.

      5 |   await page.goto('/');
      6 |   await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    > 7 |   await expect(page).toHaveScreenshot('sign-in.png');
        |   ^
      8 | });
      9 |
        at …/labflow-lite/demo7/hinh-anh.spec.js:7:3

    attachment #1: sign-in (image/png) ─────────────────────────────────────────────────────────────
    Expected: demo7/hinh-anh.spec.js-snapshots/sign-in-chromium-darwin.png
    Received: test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-chromium/sign-in-actual.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-chromium/error-context.md

  2) [mobile-safari] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before ───────────────

    Error: A snapshot doesn't exist at …/labflow-lite/demo7/hinh-anh.spec.js-snapshots/sign-in-mobile-safari-darwin.png, writing actual.

      5 |   await page.goto('/');
      6 |   await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    > 7 |   await expect(page).toHaveScreenshot('sign-in.png');
        |   ^
      8 | });
      9 |
        at …/labflow-lite/demo7/hinh-anh.spec.js:7:3

    attachment #1: sign-in (image/png) ─────────────────────────────────────────────────────────────
    Expected: demo7/hinh-anh.spec.js-snapshots/sign-in-mobile-safari-darwin.png
    Received: test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-mobile-safari/sign-in-actual.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-mobile-safari/error-context.md

  2 failed
    [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before ─────────────────────
    [mobile-safari] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before ────────────────
  2 passed (3.1s)`,
  '74-hinh-2': `$ npx playwright test demo7/hinh-anh.spec.js --project=chromium --project=mobile-safari; ls demo7/hinh-anh.spec.js-snapshots

Running 4 tests using 2 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (257ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (260ms)
  ✓  3 [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before (186ms)
  ✓  4 [mobile-safari] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before (947ms)

  4 passed (3.1s)
sign-in-chromium-darwin.png
sign-in-mobile-safari-darwin.png`,
  '74-hinh-dam': `$ node scripts/thu-loi-pw.mjs web/app/style.css "background: #e06a1b; color: #fff; cursor: pointer;" "background: #1f6feb; color: #fff; cursor: pointer;" demo7/hinh-anh.spec.js --project=chromium; ls test-results/*/
planted in web/app/style.css:  background: #e06a1b; color: #fff; cursor: pointer;  →  background: #1f6feb; color: #fff; cursor: pointer;


Running 3 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (250ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (273ms)
  ✘  3 [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before (474ms)


  1) [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before ────────────────────

    Error: expect(page).toHaveScreenshot(expected) failed

      2423 pixels (ratio 0.01 of all image pixels) are different.

      Snapshot: sign-in.png

    Call log:
      - Expect "toHaveScreenshot(sign-in.png)" with timeout 5000ms
        - verifying given screenshot expectation
      - taking page screenshot
        - disabled all CSS animations
      - waiting for fonts to load...
      - fonts loaded
      - 2423 pixels (ratio 0.01 of all image pixels) are different.
      - waiting 100ms before taking screenshot
      - taking page screenshot
        - disabled all CSS animations
      - waiting for fonts to load...
      - fonts loaded
      - captured a stable screenshot
      - 2423 pixels (ratio 0.01 of all image pixels) are different.


      5 |   await page.goto('/');
      6 |   await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    > 7 |   await expect(page).toHaveScreenshot('sign-in.png');
        |                      ^
      8 | });
      9 |
        at …/labflow-lite/demo7/hinh-anh.spec.js:7:22

    attachment #1: sign-in (image/png) ─────────────────────────────────────────────────────────────
    Expected: demo7/hinh-anh.spec.js-snapshots/sign-in-chromium-darwin.png
    Received: test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-chromium/sign-in-actual.png
    Diff:     test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-chromium/sign-in-diff.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/demo7-hinh-anh-the-sign-in-page-looks-as-before-chromium/error-context.md

  1 failed
    [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before ─────────────────────
  2 passed (2.5s)
error-context.md
sign-in-actual.png
sign-in-diff.png
sign-in-expected.png`,
  '74-hinh-nhe': `$ node scripts/thu-loi-pw.mjs web/app/style.css "background: #e06a1b; color: #fff; cursor: pointer;" "background: #d35400; color: #fff; cursor: pointer;" demo7/hinh-anh.spec.js --project=chromium
planted in web/app/style.css:  background: #e06a1b; color: #fff; cursor: pointer;  →  background: #d35400; color: #fff; cursor: pointer;


Running 3 tests using 2 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (257ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (268ms)
  ✓  3 [chromium] › demo7/hinh-anh.spec.js:4:1 › the sign-in page looks as before (176ms)

  3 passed (2.2s)`,
  '74-th': `$ npx playwright test demo7/th74.spec.js

Running 7 tests using 5 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (262ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (259ms)
  ✓  4 [chromium] › demo7/th74.spec.js:4:1 › the header title size follows the screen width (187ms)
  ✓  3 [mobile-chrome] › demo7/th74.spec.js:4:1 › the header title size follows the screen width (184ms)
  ✓  5 [mobile-safari] › demo7/th74.spec.js:4:1 › the header title size follows the screen width (377ms)
  ✓  6 [webkit] › demo7/th74.spec.js:4:1 › the header title size follows the screen width (866ms)
  ✓  7 [firefox] › demo7/th74.spec.js:4:1 › the header title size follows the screen width (1.1s)

  7 passed (4.1s)`,
  'lab7-lap': `$ npm run test:e2e -- --repeat-each=3

> labflow-lite@1.0.0 test:e2e
> playwright test e2e/ --project=chromium --repeat-each=3


Running 23 tests using 5 workers

  ✓   2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (548ms)
  ✓   1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (548ms)
  ✓   6 [chromium] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (431ms)
  ✓   7 [chromium] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (542ms)
  ✓   5 [chromium] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (635ms)
  ✓   3 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (659ms)
  ✓   4 [chromium] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (598ms)
  ✓   8 [chromium] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (501ms)
  ✓   9 [chromium] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (683ms)
  ✓  10 [chromium] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (460ms)
  ✓  12 [chromium] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (436ms)
  ✓  11 [chromium] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (519ms)
  ✓  13 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (569ms)
  ✓  15 [chromium] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (507ms)
  ✓  14 [chromium] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (511ms)
  ✓  16 [chromium] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (686ms)
  ✓  17 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (386ms)
  ✓  18 [chromium] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (386ms)
  ✓  19 [chromium] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (242ms)
  ✓  20 [chromium] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (391ms)
  ✓  21 [chromium] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (498ms)
  ✓  22 [chromium] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (359ms)
  ✓  23 [chromium] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (285ms)

  23 passed (9.8s)`,
  'lab7-mut-strong': `$ node scripts/dot-bien-7.mjs
✔ killed    #1 admins get the booking form, not the list
✔ killed    #2 Sign out does not end the session
✔ killed    #3 a reload signs the user out
✔ killed    #4 any password is accepted
✔ killed    #5 requests carry the wrong token
✔ killed    #6 a failed sign-in is not announced
✔ killed    #7 the username is sent as the password
✔ killed    #8 the admin account lost its role

8/8 mutants killed`,
  'lab7-mut-weak': `$ node scripts/dot-bien-7.mjs
✘ SURVIVED  #1 admins get the booking form, not the list
✘ SURVIVED  #2 Sign out does not end the session
✘ SURVIVED  #3 a reload signs the user out
✘ SURVIVED  #4 any password is accepted
✔ killed    #5 requests carry the wrong token
✘ SURVIVED  #6 a failed sign-in is not announced
✔ killed    #7 the username is sent as the password
✘ SURVIVED  #8 the admin account lost its role

2/8 mutants killed`,
  'lab7-ref': `$ npm run test:e2e

> labflow-lite@1.0.0 test:e2e
> playwright test e2e/ --project=chromium


Running 9 tests using 5 workers

  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (297ms)
  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as an (299ms)
  ✓  7 [chromium] › e2e/dang-nhap.spec.js:24:1 › an admin sees the list, not the form (330ms)
  ✓  4 [chromium] › e2e/dang-nhap.spec.js:5:1 › a wrong password is refused with an alert (341ms)
  ✓  3 [chromium] › e2e/dang-nhap.spec.js:14:1 › a session survives a reload; signing out ends it (443ms)
  ✓  5 [chromium] › e2e/dat-phong.spec.js:15:3 › as student an › 31 seats waits for approval (535ms)
  ✓  6 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (478ms)
  ✓  8 [chromium] › e2e/dat-phong.spec.js:21:3 › as student an › the same slot twice is refused (436ms)
  ✓  9 [chromium] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (564ms)

  9 passed (3.9s)`,
  'lab7-thoi-gian': `$ time node scripts/dot-bien-7.mjs
✔ killed    #1 admins get the booking form, not the list
✔ killed    #2 Sign out does not end the session
✔ killed    #3 a reload signs the user out
✔ killed    #4 any password is accepted
✔ killed    #5 requests carry the wrong token
✔ killed    #6 a failed sign-in is not announced
✔ killed    #7 the username is sent as the password
✔ killed    #8 the admin account lost its role

8/8 mutants killed

real	1m32.403s
user	0m48.553s
sys	0m15.180s`,
  'lab7-unit': `$ npm run test:unit && npm run test:web

> labflow-lite@1.0.0 test:unit
> vitest run src/


 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/days.test.js (4 tests) 3ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/lib/retry.test.js (3 tests) 8ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 2ms
 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 0ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/time.test.js (12 tests) 8ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 1ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 4ms
 ✓ src/booking/service.test.js (6 tests) 60ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 15ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 19ms
     ✓ accepts the slot that starts when the previous one ends 24ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/notify/notify.test.js (7 tests) 55ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 12ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/rules/cancel.test.js (4 tests) 2ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/lib/mailer.test.js (4 tests) 46ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 28ms
     ✓ 429 → RATE_LIMITED 5ms
     ✓ 400 → MAIL_FAILED with the status as the cause 5ms
     ✓ 503 → MAIL_FAILED with the status as the cause 3ms
 ✓ src/api/server.test.js (12 tests) 171ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 34ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 5ms
     ✓ 422 for a rule, 409 for a taken slot 25ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 24ms
     ✓ another student reading booking 1 → 404 23ms
     ✓ a lecturer reading booking 1 → 404 22ms
     ✓ an admin reading booking 1 → 200 21ms
     ✓ STUDENT on the admin list → 403 2ms
     ✓ LECTURER on the admin list → 403 1ms
     ✓ ADMIN on the admin list → 200 8ms
     ✓ an expired token → 401 (clock fixed in 2030) 2ms

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  05:14:50
   Duration  430ms (tests 39%, transform 29%, import 29%, worker 3%)


> labflow-lite@1.0.0 test:web
> vitest run --config vitest.web.config.js web/


 RUN  v5.0.5 …/labflow-lite

 ✓ web/AdminBookings.test.jsx (4 tests) 194ms
   ✓ AdminBookings (4)
     ✓ a table with one row per booking 149ms
     ✓ an empty list says so 7ms
     ✓ 403 → only admins 6ms
     ✓ a failure offers Try again, and it works 32ms
 ✓ web/BookingForm.test.jsx (12 tests) 1157ms
   ✓ BookingForm (12)
     ✓ every field is reachable by its label 31ms
     ✓ sends what the user typed, once, and says it is booked 203ms
     ✓ a PENDING booking says it waits for approval 97ms
     ✓ seats 0 → refused in the browser: true 92ms
     ✓ seats 1 → refused in the browser: false 118ms
     ✓ seats 200 → refused in the browser: false 80ms
     ✓ seats 201 → refused in the browser: true 89ms
     ✓ while waiting, the button is disabled and a second click sends nothing 104ms
     ✓ a 400 from the server is shown on its field 99ms
     ✓ 409 OVERLAP → an alert users hear 83ms
     ✓ 422 TOO_LONG → an alert users hear 79ms
     ✓ 500 INTERNAL → an alert users hear 81ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  05:14:51
   Duration  2.26s (environment 45%, tests 40%, setup 8%, transform 4%, import 3%)`,
  'lab7-weak-run': `$ npm run test:e2e

> labflow-lite@1.0.0 test:e2e
> playwright test e2e/ --project=chromium


Running 5 tests using 3 workers

  ✓  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (352ms)
  ✓  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (380ms)
  ✓  4 [chromium] › e2e/weak7.spec.js:4:1 › the app loads (208ms)
  ✓  3 [chromium] › e2e/weak7.spec.js:16:1 › the admin can sign in (836ms)
  ✓  5 [chromium] › e2e/weak7.spec.js:9:1 › a student can book (937ms)

  5 passed (3.9s)`,
};
