// perf/sse-client.mjs — client SSE tối giản bằng fetch (Node 22 chưa có EventSource mặc định).
// Đọc từng dòng: "id:", "event:", "data:", "retry:", dòng bắt đầu ":" là chú thích (ping), dòng trống = hết một sự kiện.
export async function openSSE(url, { headers = {}, onEvent, onOpen, signal } = {}) {
  const res = await fetch(url, { headers: { accept: 'text/event-stream', ...headers }, signal });
  onOpen?.(res);
  const dec = new TextDecoderStream();
  let buf = '', ev = { data: [] };
  try {
    for await (const chunk of res.body.pipeThrough(dec)) {
      buf += chunk;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 1);
        if (line === '') { if (ev.data.length || ev.event) onEvent?.({ ...ev, data: ev.data.join('\n') }); ev = { data: [] }; continue; }
        if (line.startsWith(':')) { onEvent?.({ comment: line.slice(1).trim() }); continue; }
        const [k, ...rest] = line.split(':'); const v = rest.join(':').replace(/^ /, '');
        if (k === 'data') ev.data.push(v); else ev[k] = v;
      }
    }
  } catch (e) { if (e.name !== 'AbortError') throw e; }
}
