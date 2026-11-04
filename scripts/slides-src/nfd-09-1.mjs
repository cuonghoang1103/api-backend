/**
 * nfd-09-1 — Networking for Developers, bài 9.1 "Polling, long polling và Server-Sent Events" (slug netdev-9-1-polling-sse). Bài MỞ CHƯƠNG 9.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c91-*.out.txt) — một máy chủ thời gian thực tí hon: /poll, /longpoll, /sse.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-09-1', code: 'NFD 9.1', title: 'Polling, long polling and SSE', sub: 'Networking for Developers · Chapter 9' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 9 — Real-time connections', bai: '9.1' }, [
  { cover: true, t: 'Polling, long polling and Server-Sent Events', sub: 'Three ways to push an update<br>over a protocol built for request/response', nhan: 'Chapter 9 · Lesson 9.1' },

  { t: 'What you will be able to do after Chapter 9', to: true, giua: true, body: `
<ul>
<li><b>Choose</b> between polling, long-polling, SSE and WebSocket — by cost, not by habit</li>
<li><b>Read a WebSocket</b>: the 101 upgrade, the <code class="i">Sec-WebSocket-Accept</code> handshake, frames and heartbeats</li>
<li><b>Scale</b> long-lived connections: file-descriptor limits, sticky sessions, reconnect with backoff</li>
<li><b>Explain WebRTC</b> at a glance: STUN for your public mapping, TURN when peer-to-peer fails</li>
<li>Keep a connection alive <b>through proxies</b> — idle timeouts, buffering, and how they cut you off</li>
</ul>` },

  { t: 'HTTP pushes nothing by itself', giua: true, body: `
${box('The problem', 'HTTP is <b>request/response</b>: the client asks, the server answers, done. But a chat, a notification, a live price, a build log all need the <b>server</b> to tell the <b>client</b> something it did not ask for. Three techniques bridge that gap on top of plain HTTP, before we reach WebSocket.', 'lam')}
${steps([
    '<b>Polling</b> — ask again and again on a timer',
    '<b>Long-polling</b> — ask, and the server holds the answer until there is news',
    '<b>SSE</b> — one open connection the server streams events down',
  ])}` },

  { t: 'Polling: ask again and again', body: `
${term(ra('c91-poll', 'for i', 1), { sm: true, title: 'poll every second — most answers repeat the last one' })}
${box('', 'Simplest possible: a timer re-requests the state. But most responses are <b>duplicates</b> (here <code class="i">n</code> barely changes), each is a full HTTP round trip, and news arrives late — up to one interval behind. Fine for slow data; wasteful for anything lively.', 'do2')}` },

  { t: 'Long-polling: hold the request', giua: true, body: `
${term(ra('c91-poll', 'curl', 1), { sm: true, title: 'one request HELD until the counter changes (see time_total)' })}
${box('', 'The client asks, and the server <b>does not answer</b> until it has something new (or a timeout). The <code class="i">time_total</code> shows the request waited instead of spinning. News is delivered <b>immediately</b>, with far fewer requests — but each client still ties up a connection, and after each answer it must re-ask.', 'xanh')}
${steps([
    '<b>+</b> instant delivery, a fraction of the requests of polling',
    '<b>+</b> still plain HTTP — works through ancient proxies',
    '<b>−</b> each waiter holds a connection; must re-ask after every answer',
  ])}` },

  { t: 'SSE: one connection, many events', body: `
${term(ra('c91-sse', 'curl -N', 1, { max: 11 }), { sm: true, title: 'the server streams data: events down one open connection' })}
${box('', 'Server-Sent Events: the client opens <b>one</b> connection and the server pushes <code class="i">data:</code> events as they happen. Built into browsers as <code class="i">EventSource</code>; it auto-reconnects (the <code class="i">retry:</code> line) and is perfect for <b>one-way</b> server→client streams — notifications, logs, progress.', 'xanh')}` },

  { t: 'SSE needs the proxy to stop buffering', giua: true, body: `
${term(ra('c91-sse', 'curl -s -D', 1), { sm: true, title: 'text/event-stream, no-cache, and X-Accel-Buffering: no' })}
${box('Key idea', 'An SSE response is <code class="i">Content-Type: text/event-stream</code> that never ends. A proxy that <b>buffers</b> (nginx by default) will hold the events and the stream appears frozen. Send <code class="i">X-Accel-Buffering: no</code> (and disable <code class="i">proxy_buffering</code>) so events flow through immediately — the #1 reason "SSE works locally but not in production."', 'do2')}` },

  { t: 'Choosing the technique', giua: true, body: `
${bang(['Technique', 'Direction', 'Use when'], [
    ['Polling', 'client pulls', 'data changes slowly; simplicity matters most'],
    ['Long-polling', 'client pulls, held', 'need near-instant push but want plain HTTP / old proxies'],
    ['SSE', 'server → client', 'one-way streams: notifications, logs, progress (auto-reconnect)'],
    ['WebSocket', 'both ways', 'true two-way, low latency: chat, games, collaboration (next lesson)'],
  ], { fs: 18 })}
${box('', 'Reach for the <b>simplest</b> that fits. Most "we need WebSockets" is really SSE or long-polling — one-way, and far less to operate.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>HTTP is request/response; <b>polling</b>, <b>long-polling</b> and <b>SSE</b> push updates on top of it</li>
<li><b>Polling</b> wastes round trips on duplicate answers and is one interval late; fine only for slow data</li>
<li><b>Long-polling</b> holds the request until there is news — instant delivery, far fewer requests</li>
<li><b>SSE</b> streams <code class="i">data:</code> events down one connection (browser <code class="i">EventSource</code>, auto-reconnect) — one-way</li>
<li>SSE through a proxy needs <b>buffering off</b> (<code class="i">X-Accel-Buffering: no</code>) or it freezes; pick the simplest technique that fits</li>
</ul>
<p style="margin:0">${kw('polling', 'hỏi lặp lại')} ${kw('long-polling', 'giữ yêu cầu')} ${kw('SSE', 'máy chủ đẩy sự kiện')} ${kw('EventSource', 'API SSE của trình duyệt')} ${kw('buffering', 'đệm proxy')}</p>` },
]);
