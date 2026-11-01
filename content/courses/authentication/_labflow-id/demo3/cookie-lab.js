// demo3/cookie-lab.js — lesson 3.2: one origin (http://localhost:4802) that sets cookies with different attributes.
import http from 'node:http';
const CASES = {
  plain: 'plain=1',
  httponly: 'httponly=1; HttpOnly',
  host_ok: '__Host-ok=1; Path=/; Secure; HttpOnly; SameSite=Lax',
  host_no_secure: '__Host-nosecure=1; Path=/; HttpOnly',
  host_domain: '__Host-domain=1; Path=/; Secure; Domain=localhost',
  host_path: '__Host-path=1; Path=/admin; Secure',
  secure_prefix_no_secure: '__Secure-x=1; Path=/',
  path_me: 'scoped=1; Path=/me',
  delete_wrong_path: 'scoped=; Max-Age=0',
  delete_right_path: 'scoped=; Max-Age=0; Path=/me',
};
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/set') { res.setHeader('Set-Cookie', CASES[url.searchParams.get('c')]); return res.end('set'); }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ path: url.pathname, cookieHeader: req.headers.cookie ?? '' }));
}).listen(4802, () => console.log('demo3/cookie-lab.js on http://localhost:4802'));
export { CASES };
