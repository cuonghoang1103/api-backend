// Helpers shared by the end-to-end tests (Chapter 7).
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
// Lesson 11.3: "QA-100…999" was only 900 codes — 25 tests had a 28% chance that two of them share one (the birthday problem),
// and renaming a test changed its testId, its code, and made an old test flaky. Two letters × 900 numbers = 608,400 codes.
const SPACE = 26 * 26 * 900;
export function freshLab(testInfo) {
  const key = [testInfo.testId, testInfo.repeatEachIndex, testInfo.retry].join('/');
  const n = parseInt(createHash('sha256').update(key).digest('hex').slice(0, 12), 16) % SPACE;
  const letters = String.fromCharCode(65 + Math.floor(n / 900 / 26), 65 + (Math.floor(n / 900) % 26));
  const lab = letters + '-' + String(100 + (n % 900));
  testInfo.annotations.push({ type: 'lab', description: lab });   // lesson 11.3: the report says which lab each test used
  return lab;
}
