// chay: tay — a tiny JSON API for Lesson 5.4 (Node 22, no libraries). Started by chay.mjs on a free port.
import http from 'node:http';

const todos = [{ id: 1, title: 'Learn fetch', done: false }];

export function createApi() {
  return http.createServer((req, res) => {
    const send = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    };
    if (req.method === 'GET' && req.url === '/api/todos') return send(200, todos);
    if (req.method === 'POST' && req.url === '/api/todos') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        console.log('server received:', req.headers['content-type'], body);
        let data;
        try { data = JSON.parse(body); } catch { return send(400, { error: 'Body must be JSON' }); }
        if (!data.title) return send(400, { error: 'title is required' });
        const todo = { id: todos.length + 1, title: data.title, done: false };
        todos.push(todo);
        send(201, todo);
      });
      return;
    }
    if (req.url === '/api/slow') return setTimeout(() => send(200, { ok: true }), 2000);
    send(404, { error: 'Not found' });
  });
}
