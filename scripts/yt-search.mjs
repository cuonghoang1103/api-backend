/**
 * yt-search.mjs — tìm video YouTube, in ID THẬT (bóc từ ytInitialData, không đoán).
 *   node scripts/yt-search.mjs "davinci resolve beginner tutorial" [--n 12]
 * ID trong đoạn văn kết quả WebSearch hay sai một ký tự — script này bóc videoId máy đọc
 * được từ ytInitialData, rồi vẫn phải qua scripts/yt-check.mjs + scripts/yt-desc.mjs.
 * In: id · thời lượng · lượt xem · kênh · tiêu đề · năm đăng tương đối
 */
const args = process.argv.slice(2);
const q = args.filter((a) => !a.startsWith('--') && !/^\d+$/.test(a)).join(' ');
const nI = args.indexOf('--n');
const N = nI >= 0 ? Number(args[nI + 1]) : 12;
const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&hl=en&gl=US';
const html = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36', 'accept-language': 'en-US,en;q=0.9' } }).then((r) => r.text());
const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
if (!m) { console.error('không bóc được ytInitialData'); process.exit(1); }
const data = JSON.parse(m[1]);
const out = [];
const walk = (o) => {
  if (!o || typeof o !== 'object') return;
  if (o.videoRenderer) {
    const v = o.videoRenderer;
    out.push({
      id: v.videoId,
      title: v.title?.runs?.map((r) => r.text).join('') || '',
      ch: v.ownerText?.runs?.[0]?.text || '',
      dur: v.lengthText?.simpleText || '',
      views: v.viewCountText?.simpleText || v.viewCountText?.runs?.map((r) => r.text).join('') || '',
      ago: v.publishedTimeText?.simpleText || '',
    });
    return;
  }
  for (const k of Object.keys(o)) walk(o[k]);
};
walk(data);
for (const v of out.slice(0, N)) console.log(`${v.id} · ${v.dur.padStart(8)} · ${v.views.padEnd(18)} · ${v.ago.padEnd(14)} · ${v.ch} — ${v.title}`);
