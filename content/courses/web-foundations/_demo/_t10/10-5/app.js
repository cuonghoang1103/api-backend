// Lesson 10.5 — the browser side: events → fetch → JSON → DOM (Chapters 3–6). Each step logs one line.
const $ = (s) => document.querySelector(s);

async function api(method, path, body) {
  const t0 = performance.now();
  const shown = body && JSON.stringify({ ...body, ...(body.password && { password: '***' }) });   // never log a password
  console.log('fetch   ' + method + ' ' + path + (shown ? ' ' + shown : ''));
  const res = await fetch(path, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body && JSON.stringify(body) });
  const data = await res.json();
  console.log('reply   ' + res.status + ' ' + JSON.stringify(data) + ' (' + Math.round(performance.now() - t0) + ' ms)');
  return { res, data };
}
function render(items) {
  $('#notes').replaceChildren(...items.map((n) => Object.assign(document.createElement('li'), { textContent: n.title })));  // textContent, never innerHTML
  console.log('dom     ' + items.length + ' <li> in #notes');
}

$('#login').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('event   submit #login');
  const f = new FormData(e.target);
  const { res } = await api('POST', '/login', { email: f.get('email'), password: f.get('password') });
  if (!res.ok) { $('#status').textContent = 'Wrong email or password'; return; }
  $('#login').hidden = true; $('#add').hidden = false;
  render((await api('GET', '/api/notes')).data.items);
});

$('#add').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('event   submit #add');
  const input = e.target.elements.title;
  const { res, data } = await api('POST', '/api/notes', { title: input.value });
  if (res.status === 422) { $('#status').textContent = data.errors.join(', '); return; }
  input.value = '';
  render((await api('GET', '/api/notes')).data.items);
});
