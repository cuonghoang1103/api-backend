// Milestone 7 starter: register / login / logout with a session cookie, no library.
// Passwords: scrypt with a random salt. Sessions: random id -> userId, kept on the server.
import http from 'node:http';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 3472);
const users = [];                 // { id, email, hash, salt }
const sessions = new Map();       // sid -> userId
const recipes = [{ id: 1, name: 'Pho bo', ownerId: null }];
let nextUser = 1, nextRecipe = 2;

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(body === undefined ? '' : JSON.stringify(body));
};
const readJson = (req) => new Promise((ok) => {
  let raw = ''; req.on('data', (c) => (raw += c)); req.on('end', () => { try { ok(JSON.parse(raw || '{}')); } catch { ok({}); } });
});
const hashPassword = (password, salt) => scryptSync(password, salt, 32).toString('hex');
const cookieOf = (req, name) => (req.headers.cookie || '').split('; ').find((c) => c.startsWith(name + '='))?.slice(name.length + 1);
const currentUser = (req) => users.find((u) => u.id === sessions.get(cookieOf(req, 'sid'))) || null;
const sessionCookie = (sid, maxAge) => 'sid=' + sid + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=' + maxAge;

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  const me = currentUser(req);

  if (req.method === 'POST' && pathname === '/api/register') {
    const { email = '', password = '' } = await readJson(req);
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email) || password.length < 8) return send(res, 400, { error: 'valid email and a password of 8+ characters' });
    if (users.some((u) => u.email === email.toLowerCase())) return send(res, 409, { error: 'email already registered' });
    const salt = randomBytes(16).toString('hex');
    const user = { id: nextUser++, email: email.toLowerCase(), salt, hash: hashPassword(password, salt) };
    users.push(user);
    return send(res, 201, { id: user.id, email: user.email });   // never send hash or salt back
  }
  if (req.method === 'POST' && pathname === '/api/login') {
    const { email = '', password = '' } = await readJson(req);
    const user = users.find((u) => u.email === email.toLowerCase());
    const ok = user && timingSafeEqual(Buffer.from(hashPassword(password, user.salt), 'hex'), Buffer.from(user.hash, 'hex'));
    if (!ok) return send(res, 401, { error: 'wrong email or password' });   // same message for both cases
    const sid = randomBytes(24).toString('hex');
    sessions.set(sid, user.id);
    return send(res, 200, { email: user.email }, { 'Set-Cookie': sessionCookie(sid, 3600) });
  }
  if (req.method === 'POST' && pathname === '/api/logout') {
    sessions.delete(cookieOf(req, 'sid'));                         // forget it on the SERVER, not only in the browser
    return send(res, 204, undefined, { 'Set-Cookie': sessionCookie('', 0) });
  }
  if (req.method === 'GET' && pathname === '/api/me') return me ? send(res, 200, { email: me.email }) : send(res, 401, { error: 'not logged in' });

  if (req.method === 'GET' && pathname === '/api/recipes') return send(res, 200, recipes);
  if (req.method === 'POST' && pathname === '/api/recipes') {
    if (!me) return send(res, 401, { error: 'log in first' });
    const { name = '' } = await readJson(req);
    const recipe = { id: nextRecipe++, name, ownerId: me.id };        // owner comes from the session, never from the body
    recipes.push(recipe);
    return send(res, 201, recipe);
  }
  const del = pathname.match(/^\/api\/recipes\/(\d+)$/);
  if (req.method === 'DELETE' && del) {
    if (!me) return send(res, 401, { error: 'log in first' });
    const recipe = recipes.find((r) => r.id === Number(del[1]));
    if (!recipe) return send(res, 404, { error: 'not found' });
    if (recipe.ownerId !== me.id) return send(res, 403, { error: 'not your recipe' });
    recipes.splice(recipes.indexOf(recipe), 1);
    return send(res, 204);
  }
  send(res, 404, { error: 'route not found' });
}).listen(PORT, () => console.log('auth API on http://localhost:' + PORT));
