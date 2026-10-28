/**
 * SWT301 · 8.6 — Test pyramid, continuous integration & Selenium WebDriver (mở rộng ngoài slide SWT6).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const TANG = ['Unit / component', 'Integration / API', 'UI / end-to-end'];
const E1 = tinhDe({
  tieuDe: 'CI 1 — Which layer of the test pyramid?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>The test pyramid says: many fast unit tests at the bottom, some integration/API tests in the middle, few slow UI end-to-end tests at the top. Place each automated LabBook test.</p>', vi: '<p>Kim tự tháp test: nhiều unit test nhanh ở đáy, vừa phải test tích hợp/API ở giữa, ít test UI đầu-cuối chậm ở đỉnh. Đặt từng test tự động của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Test → layer', 'Test → tầng'),
    cot: [{ ma: 't', ten: 'Automated test' }, { ma: 'l', ten: 'Layer', luaChon: TANG }],
    hang: [
      'JUnit + Mockito: calcRefund returns 50% at exactly 2 hours (runs in 3 ms)',
      'REST Assured: POST /api/bookings with a full lab answers 201 PENDING',
      'Selenium WebDriver: a student logs in, books LAB01 in Chrome and sees the confirmation page',
      'Spring test with Testcontainers: BookingRepository saves and reads a booking from a real PostgreSQL',
      'Jest: the WaitList class promotes first come, first served',
      'Playwright: the manager closes a lab and the student’s booking list shows CANCELLED',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.l': TANG[0], 'r1.l': TANG[1], 'r2.l': TANG[2], 'r3.l': TANG[1], 'r4.l': TANG[0], 'r5.l': TANG[2] },
    giaiThich: giai('One class or function in isolation = unit; an API or a real database between components = integration; a browser driving the whole system = UI end-to-end.', 'Một lớp/hàm cô lập = unit; API hay CSDL thật giữa các thành phần = tích hợp; trình duyệt điều khiển cả hệ thống = UI đầu-cuối.'),
  }],
  goiY: ['Có trình duyệt (Selenium, Playwright) ⇒ đỉnh.', 'Có HTTP/API hay CSDL thật ⇒ giữa.'],
  loiHayGap: ['Xếp test repository với CSDL thật vào unit.', 'Cho rằng nhiều test UI là tốt — chúng chậm và dễ gãy.'],
  giaiThich: '<p>Unit · Integration · UI · Integration · Unit · UI.</p>',
  thuatNgu: [{ en: 'test pyramid', vi: 'kim tự tháp test' }, { en: 'end-to-end test', vi: 'test đầu-cuối' }, { en: 'Testcontainers', vi: 'thư viện chạy CSDL thật trong container khi test' }],
  khaiNiem: ['test pyramid'],
});

const E2 = jsDe({
  tieuDe: 'CI 2 — Check the shape of the pyramid and the pipeline time',
  doKho: 'MEDIUM', phut: 16,
  moTa: { en: `<p>Write <code>pipelineReport(tests, workers)</code>. <code>tests</code> = <code>[{ id, layer: 'unit' | 'integration' | 'ui', seconds, fails }]</code>; <code>workers</code> = <code>{ unit, integration, ui }</code> — how many tests of that layer run in parallel.</p>
<ul><li><code>counts</code> = <code>{ unit, integration, ui }</code>; <code>shape</code> = <code>'PYRAMID'</code> if unit &gt; integration &gt; ui, <code>'ICE_CREAM_CONE'</code> if ui &gt; integration &gt; unit, otherwise <code>'OTHER'</code>.</li>
<li>Stages run in order unit → integration → ui. A stage lasts <code>ceil(Σ seconds of its tests ÷ workers)</code> seconds (0 if the layer has no test). <b>Fail fast</b>: if any test of a stage <code>fails</code>, the following stages do not run.</li>
<li><code>stagesRun</code> = the layers that ran; <code>pipelineMinutes</code> = total seconds of the stages that ran ÷ 60, rounded to 1 decimal; <code>firstFailure</code> = the id of the first failing test in the order of <code>tests</code> within the first failing stage, or null.</li></ul>`, vi: `<p>Viết <code>pipelineReport(tests, workers)</code> như bản tiếng Anh: đếm theo tầng và nhận dạng hình dạng (PYRAMID / ICE_CREAM_CONE / OTHER); các stage chạy theo thứ tự unit → integration → ui, mỗi stage kéo dài ceil(tổng giây ÷ số worker); hỏng sớm: stage nào có test trượt thì các stage sau không chạy; trả các stage đã chạy, số phút của pipeline (1 chữ số) và id test trượt đầu tiên.</p>` },
  yeuCau: [{ en: 'Do not modify the input.', vi: 'Không sửa đầu vào.' }],
  viDu: [{ input: "pipelineReport([{id:'u1',layer:'unit',seconds:2,fails:false},{id:'u2',layer:'unit',seconds:3,fails:false},{id:'a1',layer:'integration',seconds:30,fails:true},{id:'e1',layer:'ui',seconds:120,fails:false}], {unit:2,integration:1,ui:1})", output: "{ counts: {unit:2,integration:1,ui:1}, shape: 'OTHER', stagesRun: ['unit','integration'], pipelineMinutes: 0.6, firstFailure: 'a1' }", explanation: 'unit ceil(5/2)=3 s, integration 30 s, ui skipped (fail fast): 33 s = 0.55 min → 0.6.|||unit ceil(5/2)=3 giây, integration 30 giây, ui bị bỏ (hỏng sớm): 33 giây = 0,55 phút → 0,6.' }],
  goiY: ['Duyệt ba tầng theo thứ tự cố định; cộng thời gian; gặp stage có test trượt thì dừng.', 'shape: so sánh chặt (>), bằng nhau thì OTHER.'],
  loiHayGap: ['Vẫn chạy stage UI sau khi stage API trượt.', 'Quên chia cho số worker.'],
  giaiThich: '<p>Fail-fast ordering and a pyramid-shaped suite keep feedback fast: cheap unit tests run on every push and stop the pipeline before the slow UI tests start.</p>',
  thuatNgu: [{ en: 'ice-cream cone', vi: 'kem ốc quế ngược — nhiều UI test, ít unit test (phản mẫu)' }, { en: 'stage', vi: 'giai đoạn của pipeline' }, { en: 'fail fast', vi: 'hỏng sớm' }],
  khaiNiem: ['test pyramid', 'continuous integration'],
  tep: {
    'pipeline.js': [
      "function pipelineReport(tests, workers) {\n  return { counts: { unit: 0, integration: 0, ui: 0 }, shape: 'OTHER', stagesRun: [], pipelineMinutes: 0, firstFailure: null };\n}\n",
      `function pipelineReport(tests, workers) {
  const LAYERS = ['unit', 'integration', 'ui'];
  const counts = { unit: 0, integration: 0, ui: 0 };
  for (const t of tests) counts[t.layer]++;
  const shape = counts.unit > counts.integration && counts.integration > counts.ui ? 'PYRAMID'
    : counts.ui > counts.integration && counts.integration > counts.unit ? 'ICE_CREAM_CONE' : 'OTHER';
  const stagesRun = [];
  let seconds = 0;
  let firstFailure = null;
  for (const layer of LAYERS) {
    const mine = tests.filter((t) => t.layer === layer);
    stagesRun.push(layer);
    const sum = mine.reduce((s, t) => s + t.seconds, 0);
    seconds += mine.length ? Math.ceil(sum / workers[layer]) : 0;
    const bad = mine.find((t) => t.fails);
    if (bad) { firstFailure = bad.id; break; }
  }
  return { counts, shape, stagesRun, pipelineMinutes: Math.round((seconds / 60) * 10) / 10, firstFailure };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = pipelineReport([{ id: 'u1', layer: 'unit', seconds: 2, fails: false }, { id: 'u2', layer: 'unit', seconds: 3, fails: false }, { id: 'a1', layer: 'integration', seconds: 30, fails: true }, { id: 'e1', layer: 'ui', seconds: 120, fails: false }], { unit: 2, integration: 1, ui: 1 }); return JSON.stringify(r) === JSON.stringify({ counts: { unit: 2, integration: 1, ui: 1 }, shape: 'OTHER', stagesRun: ['unit', 'integration'], pipelineMinutes: 0.6, firstFailure: 'a1' }) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'a healthy pyramid, all green', vi: 'kim tự tháp khoẻ, tất cả xanh' }, () => { const T = []; for (let i = 0; i < 6; i++) T.push({ id: 'u' + i, layer: 'unit', seconds: 1, fails: false }); for (let i = 0; i < 3; i++) T.push({ id: 'a' + i, layer: 'integration', seconds: 20, fails: false }); T.push({ id: 'e0', layer: 'ui', seconds: 90, fails: false }); const r = pipelineReport(T, { unit: 3, integration: 3, ui: 1 }); return r.shape === 'PYRAMID' && r.stagesRun.join(',') === 'unit,integration,ui' && r.pipelineMinutes === 1.9 && r.firstFailure === null ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'an ice-cream cone', vi: 'kem ốc quế ngược' }, () => { const T = [{ id: 'u', layer: 'unit', seconds: 1, fails: false }, { id: 'a', layer: 'integration', seconds: 1, fails: false }, { id: 'b', layer: 'integration', seconds: 1, fails: false }, ...[1, 2, 3].map((i) => ({ id: 'e' + i, layer: 'ui', seconds: 60, fails: false }))]; const r = pipelineReport(T, { unit: 1, integration: 1, ui: 1 }); return r.shape === 'ICE_CREAM_CONE' && r.pipelineMinutes === 3.1 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'a unit failure stops the pipeline at once', vi: 'unit trượt thì dừng pipeline ngay' }, () => { const r = pipelineReport([{ id: 'u1', layer: 'unit', seconds: 4, fails: false }, { id: 'u2', layer: 'unit', seconds: 4, fails: true }, { id: 'u3', layer: 'unit', seconds: 4, fails: true }, { id: 'e1', layer: 'ui', seconds: 600, fails: false }], { unit: 4, integration: 1, ui: 1 }); return r.stagesRun.join(',') === 'unit' && r.firstFailure === 'u2' && r.pipelineMinutes === 0.1 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'a layer without tests takes 0 s and still counts as run', vi: 'tầng không có test mất 0 giây và vẫn tính là đã chạy' }, () => { const r = pipelineReport([{ id: 'e1', layer: 'ui', seconds: 59, fails: false }], { unit: 2, integration: 2, ui: 1 }); return r.stagesRun.join(',') === 'unit,integration,ui' && r.pipelineMinutes === 1 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E3 = jsDe({
  tieuDe: 'CI 3 — Find the flaky tests',
  doKho: 'MEDIUM', phut: 14,
  moTa: { en: `<p>A <b>flaky</b> test passes and fails on the <i>same</i> code — usually because of timing, shared state or the environment (a UI test that clicks before the page is ready). Flaky tests destroy trust in CI (risk: “testers stop trusting the results”).</p>
<p>Write <code>flaky(runs, threshold)</code>: <code>runs</code> = <code>[{ test, commit, result: 'PASS' | 'FAIL' }]</code>. A test is flaky if on at least one commit it has both a PASS and a FAIL. Return <code>{ flaky: [tests sorted A→Z], rate: { test: % of its runs that failed (1 decimal) for each flaky test }, quarantine: [flaky tests whose fail rate ≥ threshold, sorted] }</code>.</p>`, vi: `<p>Test <b>chập chờn</b> đạt rồi trượt trên CÙNG một mã — thường do thời điểm, trạng thái dùng chung hay môi trường (test UI bấm trước khi trang tải xong). Chúng phá niềm tin vào CI. Viết <code>flaky(runs, threshold)</code> như bản tiếng Anh: test chập chờn là test có cả PASS và FAIL trên ít nhất một commit; trả danh sách, tỉ lệ trượt từng test (1 chữ số) và danh sách cách ly (tỉ lệ trượt ≥ ngưỡng).</p>` },
  yeuCau: [{ en: 'A test that always fails on a commit is NOT flaky — it is a real failure.', vi: 'Test luôn trượt trên một commit KHÔNG phải chập chờn — đó là lỗi thật.' }],
  viDu: [{ input: "flaky([{test:'ui-book',commit:'c1',result:'PASS'},{test:'ui-book',commit:'c1',result:'FAIL'},{test:'api-cancel',commit:'c1',result:'FAIL'},{test:'api-cancel',commit:'c2',result:'PASS'}], 40)", output: "{ flaky: ['ui-book'], rate: { 'ui-book': 50 }, quarantine: ['ui-book'] }", explanation: 'api-cancel failed on c1 and passed on c2 — different code, so it is not flaky.|||api-cancel trượt ở c1 và đạt ở c2 — khác mã nên không chập chờn.' }],
  goiY: ['Gom theo test + commit thành tập kết quả; có đủ PASS và FAIL ⇒ chập chờn.', 'Tỉ lệ trượt tính trên MỌI lần chạy của test đó (mọi commit).'],
  loiHayGap: ['Gọi test trượt ở commit này, đạt ở commit sau là chập chờn.', 'Tính tỉ lệ chỉ trên commit bị chập chờn.'],
  giaiThich: '<p>Quarantining flaky tests (and fixing waits, isolating data) keeps the pipeline trustworthy; real failures stay visible.</p>',
  thuatNgu: [{ en: 'flaky test', vi: 'test chập chờn' }, { en: 'quarantine', vi: 'cách ly — tạm tách khỏi cổng chặn' }],
  khaiNiem: ['continuous integration', 'flaky tests'],
  tep: {
    'flaky.js': [
      'function flaky(runs, threshold) {\n  return { flaky: [], rate: {}, quarantine: [] };\n}\n',
      `function flaky(runs, threshold) {
  const byKey = {};
  const total = {};
  const fails = {};
  for (const r of runs) {
    const k = r.test + '@' + r.commit;
    (byKey[k] = byKey[k] || new Set()).add(r.result);
    total[r.test] = (total[r.test] || 0) + 1;
    if (r.result === 'FAIL') fails[r.test] = (fails[r.test] || 0) + 1;
  }
  const set = new Set();
  for (const [k, s] of Object.entries(byKey)) if (s.has('PASS') && s.has('FAIL')) set.add(k.slice(0, k.lastIndexOf('@')));
  const list = [...set].sort();
  const rate = {};
  for (const t of list) rate[t] = Math.round(((fails[t] || 0) / total[t]) * 1000) / 10;
  return { flaky: list, rate, quarantine: list.filter((t) => rate[t] >= threshold) };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = flaky([{ test: 'ui-book', commit: 'c1', result: 'PASS' }, { test: 'ui-book', commit: 'c1', result: 'FAIL' }, { test: 'api-cancel', commit: 'c1', result: 'FAIL' }, { test: 'api-cancel', commit: 'c2', result: 'PASS' }], 40); return JSON.stringify(r) === JSON.stringify({ flaky: ['ui-book'], rate: { 'ui-book': 50 }, quarantine: ['ui-book'] }) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'rate over all runs, threshold applied', vi: 'tỉ lệ trên mọi lần chạy, áp ngưỡng' }, () => { const R = []; const add = (t, c, r) => R.push({ test: t, commit: c, result: r }); add('b', 'c1', 'PASS'); add('b', 'c1', 'FAIL'); add('b', 'c2', 'PASS'); add('b', 'c2', 'PASS'); add('a', 'c1', 'FAIL'); add('a', 'c1', 'PASS'); add('a', 'c1', 'FAIL'); const r = flaky(R, 30); return JSON.stringify(r) === JSON.stringify({ flaky: ['a', 'b'], rate: { a: 66.7, b: 25 }, quarantine: ['a'] }) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'always failing on a commit is a real failure', vi: 'luôn trượt trên một commit là lỗi thật' }, () => { const r = flaky([{ test: 'x', commit: 'c1', result: 'FAIL' }, { test: 'x', commit: 'c1', result: 'FAIL' }], 0); return r.flaky.length === 0 && r.quarantine.length === 0 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'test names containing @ are handled', vi: 'tên test có @ vẫn xử lý đúng' }, () => { const r = flaky([{ test: 'ui@login', commit: 'c9', result: 'PASS' }, { test: 'ui@login', commit: 'c9', result: 'FAIL' }], 100); return JSON.stringify(r.flaky) === '["ui@login"]' && r.quarantine.length === 0 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E4 = tinhDe({
  tieuDe: 'CI 4 — Pyramid, CI and Selenium (exam-style)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five questions linking the pyramid, CI and test execution tools such as Selenium WebDriver to the syllabus ideas of chapters 2, 6 and 8.</p>', vi: '<p>Năm câu nối kim tự tháp, CI và công cụ thực thi như Selenium WebDriver với các ý của chương 2, 6 và 8.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Why should most automated tests be unit tests?', 'Vì sao phần lớn test tự động nên là unit test?'), luaChon: lc(['a', 'They test the UI'], ['b', 'They are fast, stable and pinpoint the failing line, so they can run on every push'], ['c', 'Users like them'], ['d', 'They need no maintenance']), dapAn: ['b'], giaiThich: giai('Fast feedback is the point of CI.', 'Phản hồi nhanh là mục đích của CI.') },
    { ma: 'q2', de: hai('A Selenium test sometimes fails because it clicks before the page has loaded. The best fix is…', 'Test Selenium đôi khi trượt vì bấm trước khi trang tải xong. Cách sửa tốt nhất là…'), luaChon: lc(['a', 'Thread.sleep(10000) everywhere'], ['b', 'an explicit wait for the element to be clickable'], ['c', 'deleting the test'], ['d', 'running it twice and accepting any pass']), dapAn: ['b'], giaiThich: giai('Fixed sleeps make suites slow and still flaky.', 'Ngủ cố định làm bộ test chậm mà vẫn chập chờn.') },
    { ma: 'q3', de: hai('Which test type does a CI server mostly run on every change?', 'CI server chủ yếu chạy loại test nào mỗi khi có thay đổi?'), luaChon: lc(['a', 'Exploratory sessions'], ['b', 'Automated regression tests (change-related testing)'], ['c', 'Acceptance by users'], ['d', 'Reviews']), dapAn: ['b'], giaiThich: giai('Regression suites are the prime candidates for automation (lesson 2.4).', 'Bộ hồi quy là ứng viên số một cho tự động hoá (bài 2.4).') },
    { ma: 'q4', de: hai('Which pattern keeps Selenium tests maintainable when the UI changes?', 'Mẫu nào giúp test Selenium dễ bảo trì khi UI đổi?'), luaChon: lc(['a', 'Copying locators into every test'], ['b', 'The Page Object pattern: one class per page owns its locators and actions'], ['c', 'Capture/replay only'], ['d', 'XPath with absolute paths everywhere']), dapAn: ['b'], giaiThich: giai('A UI change is fixed in one place — the risk “underestimated maintenance” is reduced.', 'Đổi UI chỉ sửa một chỗ — giảm rủi ro “đánh giá thấp công bảo trì”.') },
    { ma: 'q5', de: hai('Which statement about automation and exploratory testing is TRUE?', 'Phát biểu nào về tự động hoá và exploratory testing là ĐÚNG?'), luaChon: lc(['a', 'Automation makes exploratory testing unnecessary'], ['b', 'Automation checks known expectations; exploratory testing still finds the unexpected — teams need both'], ['c', 'Exploratory tests should all be automated'], ['d', 'Neither is needed with CI']), dapAn: ['b'], giaiThich: giai('Automated checks vs human exploration.', 'Kiểm tự động và khám phá của con người bổ sung nhau.') },
  ],
  goiY: ['CI = phản hồi nhanh cho mỗi thay đổi.', 'Page Object gom locator một chỗ.'],
  loiHayGap: ['Dùng sleep cố định để chữa test chập chờn.', 'Cho rằng tự động hoá thay thế khám phá.'],
  giaiThich: '<p>Answers: b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'explicit wait', vi: 'chờ tường minh tới khi điều kiện đúng' }, { en: 'Page Object pattern', vi: 'mẫu đối tượng trang' }],
  khaiNiem: ['continuous integration', 'Selenium'],
});

export default doiDau({
  slug: 'swt301-ci-automation',
  ten: '8.6 Test pyramid, continuous integration and Selenium',
  moTaModule: 'Đặt test LabBook vào tầng kim tự tháp, viết code kiểm hình dạng bộ test và thời gian pipeline hỏng sớm, phát hiện test chập chờn và cách ly, câu hỏi về CI, Selenium, Page Object.',
  khoa: KHOA,
  baiHoc: 'swt301-ci-automation',
  de: [E1, E2, E3, E4],
});
