// The SAME sign-up check, done end-to-end: launch a real Chromium, render the form, type, click, wait.
// Run: node demo/e2e-timing.mjs   (Playwright installed separately; see the lesson)
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const src = readFileSync(new URL('../src/signup.js', import.meta.url), 'utf8').replace('export function', 'function');
const t0 = performance.now();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body></body></html>');
await page.addScriptTag({ type: 'module', content: src + '\ndocument.body.append(createSignupForm({ onSubmit: async () => {} }));' });
await page.getByLabel('Email').fill('lan@example.com');
await page.getByLabel('Password').fill('correct-horse');
await page.getByRole('button', { name: 'Sign up' }).click();
await page.getByText('Welcome, lan@example.com!').waitFor();
const t1 = performance.now();
await browser.close();
console.log('end-to-end sign-up check in a real browser:', Math.round(t1 - t0), 'ms (including browser start)');
