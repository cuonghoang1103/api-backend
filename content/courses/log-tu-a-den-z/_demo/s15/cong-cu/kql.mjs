// kql.mjs — gõ câu KQL vào Kibana Discover THẬT (Chrome headless) và in số kết quả + vài dòng đầu, như người dùng nhìn thấy.
//   node kql.mjs '<KQL>' [cột,cột] [từ ISO] [tới ISO]     — Kibana ở http://localhost:45601 (cầu socket tới netns lab)
import { chromium } from 'playwright-core';
const [kql, cot = '', tu = '2026-11-19T17:00:00.000Z', toi = '2026-11-20T17:00:00.000Z'] = process.argv.slice(2);
const K = 'http://localhost:45601';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, locale: 'en-US', timezoneId: 'Asia/Ho_Chi_Minh' });
await p.goto(`${K}/login`); await p.fill('[data-test-subj=loginUsername]', 'elastic');
await p.fill('[data-test-subj=loginPassword]', 'lab15-elastic-chi-o-may-minh'); await p.click('[data-test-subj=loginSubmit]');
await p.waitForURL(/\/app\//, { timeout: 60000 });
const q = kql.replace(/'/g, "!'");
const cols = cot ? `,columns:!(${cot.split(',').join(',')})` : '';
await p.goto(`${K}/app/discover#/?_g=(time:(from:'${tu}',to:'${toi}'))&_a=(dataSource:(dataViewId:filebeat,type:dataView),query:(language:kuery,query:'${encodeURIComponent(q)}')${cols})`);
const hits = p.locator('[data-test-subj=discoverQueryHits]');
const loi = p.locator('[data-test-subj=discoverErrorCalloutTitle], .euiCallOut--danger');
const rong = p.locator('[data-test-subj=discoverNoResults]');
await Promise.race([hits.waitFor({ timeout: 60000 }), loi.first().waitFor({ timeout: 60000 }), rong.waitFor({ timeout: 60000 })]).catch(() => {});
if (await rong.count()) { console.log(`KQL: ${kql}\nSố kết quả (Discover): 0 — "${(await rong.innerText()).split('\n')[0]}"`); }
else if (await loi.count()) { console.log('Kibana báo lỗi:', (await loi.first().innerText()).replace(/\s+/g, ' ').slice(0, 300)); }
else {
  await p.waitForTimeout(1500);
  console.log(`KQL: ${kql}\nSố kết quả (Discover): ${await hits.innerText()}`);
  if (cot) {
    const rows = await p.locator('.euiDataGridRow').allInnerTexts();
    for (const r of rows.slice(0, 3)) console.log('  ' + r.split('\n').map((x) => x.trim()).filter((x) => x && !/^[↦↵]+$/.test(x)).join(' | '));
  }
}
await b.close();
