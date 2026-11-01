// ws.js — bài 10.4: WebSocket trên CÙNG server HTTP. Nối: ws://host/v2/ws?ticket=<vé từ POST /v2/realtime/tickets>
// Tin server → client: {"type":"hello","latest":…} · {"type":"event","event":{…}}. Client → server: {"type":"resume","after":"<id>"}
import { WebSocketServer } from 'ws';
import { redeemTicket } from './tickets.js';
import { since, subscribe, latestId } from './events.js';

export function attachWs(server) {
  const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false });
  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/v2/ws') return socket.destroy();
    const userId = redeemTicket(url.searchParams.get('ticket'));
    if (!userId) {                                            // từ chối TRƯỚC khi nâng cấp: trả một câu HTTP bình thường
      socket.end('HTTP/1.1 401 Unauthorized\r\nContent-Type: application/problem+json\r\nConnection: close\r\n\r\n'
        + '{"type":"https://labflow.example/problems/ticket-invalid","status":401,"code":"TICKET_INVALID"}');
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, userId));
  });
  wss.on('connection', async (ws) => {
    const send = (m) => ws.readyState === ws.OPEN && ws.send(JSON.stringify(m));
    const off = subscribe((e) => send({ type: 'event', event: e }));
    send({ type: 'hello', latest: await latestId() });
    ws.on('message', async (raw) => {
      let m; try { m = JSON.parse(raw); } catch { return send({ type: 'error', code: 'MALFORMED_JSON' }); }
      if (m.type === 'resume') {                              // lấy bù sau khi rớt mạng
        const r = await since(String(m.after), 1000);
        if (r.gap) return send({ type: 'reset', latest: await latestId() });
        for (const e of r.data) send({ type: 'event', event: e, replay: true });
      }
    });
    let alive = true;                                         // ping/pong: phát hiện kết nối chết mà không ai đóng
    ws.on('pong', () => { alive = true; });
    const beat = setInterval(() => { if (!alive) return ws.terminate(); alive = false; ws.ping(); }, 30000);
    ws.on('close', () => { clearInterval(beat); off(); });
  });
  return wss;
}
