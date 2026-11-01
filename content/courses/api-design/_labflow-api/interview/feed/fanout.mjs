// fanout.mjs — bài 11.3: fan-out khi GHI hay khi ĐỌC? Đo trên Redis 8.2 (DB 3, chỉ dùng cho bài này)
// node interview/feed/fanout.mjs write | read | hybrid | page        (LABFLOW_REDIS mặc định redis://localhost:6390)
import { createClient } from 'redis';

const redis = createClient({ url: (process.env.LABFLOW_REDIS ?? 'redis://localhost:6390') + '/3' });
await redis.connect();
const KEEP = 500;                                                   // mỗi timeline giữ 500 bài mới nhất
const ms = (t0) => Number(process.hrtime.bigint() - t0) / 1e6;
const fmt = (x, d = 1) => x.toLocaleString('en-US', { maximumFractionDigits: d });
let postId = 1_000_000;                                             // id tăng dần = điểm (score) để sắp theo thời gian
const mb = async () => Number((await redis.info('memory')).match(/used_memory:(\d+)/)[1]) / 1e6;

// GHI kiểu "đẩy" (push): một bài ⇒ chép id vào timeline của TỪNG người theo dõi
async function pushPost(followers) {
  const id = ++postId;
  await Promise.all(followers.flatMap((f) => [                     // node-redis tự gom các lệnh cùng nhịp thành pipeline
    redis.zAdd(`tl:${f}`, { score: id, value: String(id) }),
    redis.zRemRangeByRank(`tl:${f}`, 0, -KEEP - 1),
  ]));
  return { id, commands: followers.length * 2 };
}
// ĐỌC kiểu "kéo" (pull): đọc bài mới nhất của TỪNG người mình theo dõi rồi trộn
async function pullFeed(following, limit = 20) {
  const lists = await Promise.all(following.map((a) => redis.zRangeWithScores(`posts:${a}`, '+inf', '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: limit } })));
  return lists.flat().sort((x, y) => y.score - x.score).slice(0, limit);
}
const range = (a, n) => Array.from({ length: n }, (_, i) => a + i);

const mode = process.argv[2] ?? 'write';
await redis.flushDb();

if (mode === 'write') {
  console.log('fan-out khi GHI: một bài đăng ⇒ ghi vào timeline của mọi người theo dõi');
  console.log('người đăng                 theo dõi   lệnh Redis   thời gian   bộ nhớ Redis');
  for (const [name, n] of [['bạn sinh viên', 150], ['CLB lớn', 10_000], ['trang FPTU chính thức', 100_000]]) {
    const before = await mb();
    const t0 = process.hrtime.bigint();
    const r = await pushPost(range(1, n));
    console.log(`${name.padEnd(25)} ${fmt(n).padStart(8)}   ${fmt(r.commands).padStart(10)}   ${fmt(ms(t0)).padStart(7)} ms   +${fmt(await mb() - before)} MB`);
  }
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < 1000; i++) await redis.zRange(`tl:${1 + (i % 150)}`, 0, 19, { REV: true });
  console.log(`đọc feed (1 ZRANGE, 20 bài): ${fmt(ms(t0) / 1000, 3)} ms/lần (trung bình 1.000 lần)`);
}

if (mode === 'read') {
  console.log('fan-out khi ĐỌC: bài chỉ ghi MỘT lần; người đọc trộn bài của những người mình theo dõi');
  for (const a of range(1, 1000)) {                                 // 1.000 tác giả, mỗi người 50 bài
    await Promise.all(range(0, 50).map(() => { const id = ++postId; return redis.zAdd(`posts:${a}`, { score: id, value: String(id) }); }));
  }
  console.log('ghi một bài: 1 lệnh ZADD, bất kể bao nhiêu người theo dõi');
  console.log('người đọc theo dõi   lệnh Redis/lần đọc   thời gian/lần đọc');
  for (const f of [10, 150, 1000]) {
    const following = range(1, f);
    const t0 = process.hrtime.bigint();
    for (let i = 0; i < 200; i++) await pullFeed(following);
    console.log(`${fmt(f).padStart(18)}   ${fmt(f).padStart(18)}   ${fmt(ms(t0) / 200, 2).padStart(12)} ms`);
  }
}

if (mode === 'hybrid') {
  console.log('lai: người thường ĐẨY lúc ghi; tài khoản > 10.000 người theo dõi được KÉO lúc đọc');
  for (const a of range(1, 150)) await pushPost([7]);               // 150 bài của bạn bè đã nằm sẵn trong timeline của người đọc số 7
  const celebs = ['fptu', 'fcode', 'gdsc'];
  for (const c of celebs) for (let i = 0; i < 50; i++) { const id = ++postId; await redis.zAdd(`posts:${c}`, { score: id, value: String(id) }); }
  const t0 = process.hrtime.bigint();
  let page;
  for (let i = 0; i < 1000; i++) {
    const [own, ...pulled] = await Promise.all([redis.zRangeWithScores('tl:7', '+inf', '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: 20 } }),
      ...celebs.map((c) => redis.zRangeWithScores(`posts:${c}`, '+inf', '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: 20 } }))]);
    page = [own, ...pulled].flat().sort((x, y) => y.score - x.score).slice(0, 20);
  }
  console.log(`đọc feed = 1 timeline + ${celebs.length} tài khoản lớn = ${1 + celebs.length} lệnh, ${fmt(ms(t0) / 1000, 3)} ms/lần; trang đầu có ${page.length} bài`);
  const t1 = process.hrtime.bigint();
  await redis.zAdd('posts:fptu', { score: ++postId, value: String(postId) });
  console.log(`trang FPTU (100.000 người theo dõi) đăng bài: 1 lệnh, ${fmt(ms(t1), 2)} ms`);
}

if (mode === 'page') {
  console.log('phân trang feed khi có bài mới chen vào giữa hai lần tải');
  for (let i = 0; i < 30; i++) await pushPost([1]);
  const p1 = await redis.zRange('tl:1', 0, 9, { REV: true });
  await pushPost([1]);                                              // bài mới tới trong lúc người dùng đọc trang 1
  const offset = await redis.zRange('tl:1', 10, 19, { REV: true });
  const cursor = await redis.zRange('tl:1', `(${p1.at(-1)}`, '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: 10 } });
  const dup = (xs) => xs.filter((x) => p1.includes(x));
  console.log(`trang 1:            ${p1.join(' ')}`);
  console.log(`trang 2 theo offset: ${offset.join(' ')}   ⇒ lặp lại ${dup(offset).length} bài: ${dup(offset).join(' ') || '—'}`);
  console.log(`trang 2 theo cursor: ${cursor.join(' ')}   ⇒ lặp lại ${dup(cursor).length} bài (cursor = ${p1.at(-1)})`);
}
await redis.flushDb();
await redis.quit();
