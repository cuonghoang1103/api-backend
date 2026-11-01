// Requirements traceability matrix (lesson 11.1): which passing tests prove which requirement, at which layer.
// The convention: a test proves a requirement when its full name (describe titles + test title) carries the requirement's id —
// "BR-04", "Lite-3", or "US-11" followed by acceptance criteria ("AC2", "AC2–AC5", "AC4, AC5").
export const LAYERS = ['Unit', 'API', 'DB', 'UI', 'E2E'];

export function layerOf(file) {
  if (/(^|\/)src\/ci\//.test(file)) return null;   // tests of the CI tooling itself — their names quote ids as DATA (lesson 11.4)
  if (/(^|\/)src\/api\//.test(file)) return 'API';
  if (/(^|\/)test\/integration\//.test(file)) return 'DB';
  if (/(^|\/)web\//.test(file)) return 'UI';
  if (/(^|\/)e2e\//.test(file)) return 'E2E';
  return 'Unit';
}

export function tagsOf(name) {
  const tags = new Set(name.match(/\b(BR-\d{2}|Lite-\d+)\b/g) ?? []);
  const story = /\bUS-11\b(.*)/.exec(name);
  if (story) {
    for (const [, from, to] of story[1].matchAll(/\bAC(\d+)(?:\s*[–-]\s*AC(\d+))?/g)) {
      for (let n = Number(from); n <= Number(to ?? from); n++) tags.add('US-11 AC' + n);
    }
  }
  return [...tags];
}

// Vitest --reporter=json → [{ file, name, passed }]; root is cut from absolute paths.
export function testsFromVitest(report, root = '') {
  return report.testResults.flatMap((f) => f.assertionResults.map((t) => ({
    file: f.name.startsWith(root) ? f.name.slice(root.length).replace(/^\//, '') : f.name,
    name: t.fullName,
    passed: t.status === 'passed',
  })));
}

// Playwright --reporter=json → the same shape (the "setup" project is not a test of the product).
export function testsFromPlaywright(report) {
  const out = [];
  const walk = (suite, titles) => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests.filter((x) => x.projectName !== 'setup')) {
        out.push({ file: spec.file, name: [...titles, spec.title].join(' '), passed: t.status === 'expected' || t.status === 'flaky' });
      }
    }
    for (const child of suite.suites ?? []) walk(child, [...titles, child.title]);
  };
  for (const fileSuite of report.suites) walk(fileSuite, []);   // the top-level suites are the files
  return out;
}

export function buildMatrix(requirements, tests) {
  return requirements.map((r) => {
    const counts = Object.fromEntries(LAYERS.map((l) => [l, 0]));
    for (const t of tests) if (t.passed && layerOf(t.file) && tagsOf(t.name).includes(r.id)) counts[layerOf(t.file)]++;
    return { ...r, counts, total: LAYERS.reduce((n, l) => n + counts[l], 0) };
  });
}

// The gate: every in-scope requirement has a passing test; a High-risk one has one above the Unit layer.
export function traceGaps(rows) {
  const gaps = [];
  for (const r of rows.filter((x) => x.inScope)) {
    if (r.total === 0) gaps.push(r.id + ': no passing test');
    else if (r.risk === 'High' && r.total === r.counts.Unit) gaps.push(r.id + ': High risk, tested only at the Unit layer');
  }
  return gaps;
}

export function rtmMarkdown(rows, gaps) {
  const head = ['| Requirement | Risk | ' + LAYERS.join(' | ') + ' | |', '|---|---|' + LAYERS.map(() => '---:|').join('') + '---|'];
  const body = rows.map((r) => '| ' + r.id + (r.inScope ? '' : ' (out of scope)') + ' | ' + r.risk + ' | ' +
    LAYERS.map((l) => (r.counts[l] || '·')).join(' | ') + ' | ' + (!r.inScope ? '—' : gaps.some((g) => g.startsWith(r.id + ':')) ? '❌' : '✅') + ' |');
  const tail = gaps.length ? ['', '**Gaps:**', ...gaps.map((g) => '- ' + g)] : ['', 'Every in-scope requirement is traced to a passing test.'];
  return [...head, ...body, ...tail].join('\n') + '\n';
}
