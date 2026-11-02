/**
 * Menu-tree guard — `npm run nav:test`.
 *
 * The ☰ dock was removed 02/11/2026; the mega menus are now the ONLY chrome
 * entry point for most pages. This test fails if a destination the old dock /
 * icon bar reached is dropped, or if the bar's lightweight path→menu map
 * (`navLabels.MENU_PREFIXES`) drifts from the tree.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — Node runs the .ts file directly (strip-types), so the extension is required.
import { NAV_TREE, ACCOUNT_LINKS } from './navTree.ts';
// @ts-expect-error — see above.
import { menuForPath } from './navLabels.ts';

/** Every href the old NavigationDock + Navbar linked to (02/11/2026 snapshot). */
const OLD_DESTINATIONS = [
  '/', '/about', '/dashboard', '/feed', '/tech-trends', '/forum', '/friends', '/messages',
  '/code-lab', '/exp-hub', '/hub', '/ai-templates', '/ai-code', '/cli', '/roadmap', '/algorithms',
  '/simulation', '/maker-lab', '/voice-mini', '/projects', '/repos', '/hoc-tap', '/academy',
  '/courses', '/my-courses', '/exam', '/language', '/interview', '/cv', '/notes', '/work', '/chat',
  '/music', '/finance', '/games', '/toc-do-mang', '/shop', '/my-orders', '/wallet', '/pro',
  '/llm-key', '/kiem-tra-key', '/admin', '/profile', '/settings', '/books', '/download',
  '/my-codes', '/certificates/my',
];

type Item = { href: string };
const treeItems: { href: string; menu: string }[] = NAV_TREE.flatMap((m: { id: string; sections: { items: Item[] }[] }) =>
  m.sections.flatMap((s) => s.items.map((it) => ({ href: it.href, menu: m.id }))));

test('every old destination is still reachable from the menus or the avatar menu', () => {
  const reachable = new Set<string>(['/', ...treeItems.map((i) => i.href), ...ACCOUNT_LINKS.map((i: Item) => i.href)]);
  const missing = OLD_DESTINATIONS.filter((h) => !reachable.has(h));
  assert.deepEqual(missing, []);
});

test('no href appears twice in the mega menus', () => {
  const seen = new Map<string, number>();
  for (const i of treeItems) seen.set(i.href, (seen.get(i.href) ?? 0) + 1);
  assert.deepEqual([...seen].filter(([, n]) => n > 1).map(([h]) => h), []);
});

test('the bar underline map agrees with the tree', () => {
  const wrong = treeItems
    .filter((i) => !i.href.includes('#'))
    .filter((i) => menuForPath(i.href) !== i.menu)
    .map((i) => `${i.href} → ${menuForPath(i.href)} (tree: ${i.menu})`);
  assert.deepEqual(wrong, []);
});

test('the only Academy entry is /academy itself (desktop routes.test.ts reads this too)', () => {
  assert.deepEqual(treeItems.filter((i) => i.href.startsWith('/academy')).map((i) => i.href), ['/academy']);
});

test('every entry has EN + VI title and description', () => {
  const bad = NAV_TREE.flatMap((m: { sections: { items: { href: string; title: Record<string, string>; desc: Record<string, string> }[] }[] }) =>
    m.sections.flatMap((s) => s.items))
    .filter((it: { title: Record<string, string>; desc: Record<string, string> }) => !it.title.en || !it.title.vi || !it.desc.en || !it.desc.vi)
    .map((it: Item) => it.href);
  assert.deepEqual(bad, []);
});
