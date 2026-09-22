/**
 * yt-desc.mjs — đọc trang xem YouTube: mô tả, thời lượng, và "playableInEmbed".
 *   node scripts/yt-desc.mjs <id> [<id> …]
 * ⚠️ oEmbed trả 200 KHÔNG chứng minh video nhúng được (chủ kênh có thể tắt nhúng) —
 * playableInEmbed:true mới là bằng chứng. Dùng cùng scripts/yt-check.mjs.
 */
for (const id of process.argv.slice(2)) {
  const h = await fetch('https://www.youtube.com/watch?v=' + id + '&hl=en', { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/126 Safari/537.36', 'accept-language': 'en-US' } }).then(r => r.text());
  const m = h.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
  const len = h.match(/"lengthSeconds":"(\d+)"/);
  const emb = h.match(/"playableInEmbed":(true|false)/);
  const d = m ? JSON.parse('"' + m[1] + '"') : '(không đọc được)';
  console.log(`\n■ ${id} · ${len ? Math.round(len[1] / 60) + ' phút' : '?'} · embed=${emb ? emb[1] : '?'}\n${d.slice(0, 420).replace(/\n+/g, ' ⏎ ')}`);
}
