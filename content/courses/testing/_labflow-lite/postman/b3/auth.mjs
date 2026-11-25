import { req, collection, folder, save } from '../tao.mjs';
const B = '{{baseUrl}}';
const json = [{ key: 'Content-Type', value: 'application/json' }];
const reads = ['Read 1', 'Read 2', 'Read 3'].map((n) => req(n, 'GET', B + '/api/bookings', { test: function (pm) {
  pm.test('200', () => pm.response.to.have.status(200));
} }));
const loginOnce = req('Login once', 'POST', B + '/api/login', { auth: 'none', headers: json, body: { username: 'an', password: '{{password}}' },
  test: function (pm) { pm.collectionVariables.set('token', pm.response.json().token); } });
// A: log in once, then hope the token lives long enough
save('b3/a-login-once.postman_collection.json', collection('A login once', [loginOnce, ...reads], { auth: '{{token}}', vars: [['password', 'labflow-demo'], ['token', '']] }));
// B: the collection pre-request script gets a token when there is none or it is about to expire
const refresh = function (pm) {
  const exp = Number(pm.collectionVariables.get('tokenExp') || 0);
  if (Date.now() < exp - 1000) return;            // still valid for more than 1 s
  pm.sendRequest({
    url: pm.variables.replaceIn('{{baseUrl}}/api/login'),
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { mode: 'raw', raw: JSON.stringify({ username: 'an', password: pm.variables.get('password') }) },
  }, (err, res) => {
    if (err) throw err;
    const body = res.json();
    pm.collectionVariables.set('token', body.token);
    pm.collectionVariables.set('tokenExp', String(Date.now() + body.expiresIn * 1000));
    console.log('new token, valid', body.expiresIn, 's');
  });
};
save('b3/b-refresh.postman_collection.json', collection('B refresh in pre-request', reads, { auth: '{{token}}', pre: refresh, vars: [['password', 'labflow-demo'], ['token', ''], ['tokenExp', '']] }));
// C: OAuth 2.0 client credentials, the same idea for a machine client
const oauth = function (pm) {
  if (pm.collectionVariables.get('token')) return;
  pm.sendRequest({
    url: pm.variables.replaceIn('{{baseUrl}}/oauth/token'),
    method: 'POST',
    header: { Authorization: 'Basic ' + btoa(pm.variables.get('clientId') + ':' + pm.variables.get('clientSecret')) },
    body: { mode: 'urlencoded', urlencoded: [{ key: 'grant_type', value: 'client_credentials' }] },
  }, (err, res) => {
    console.log(res.code, 'scope', res.json().scope, 'type', res.json().token_type);
    pm.collectionVariables.set('token', res.json().access_token);
  });
};
save('b3/c-oauth.postman_collection.json', collection('C OAuth client credentials', [
  req('Report: all bookings', 'GET', B + '/api/admin/bookings', { test: function (pm) {
    pm.test('200 for the bot', () => pm.response.to.have.status(200));
  } }),
], { auth: '{{token}}', pre: oauth, vars: [['clientId', 'report-bot'], ['clientSecret', ''], ['token', '']] }));
// D: negative security tests — tokens the API must refuse
const neg = (name, make) => req(name, 'GET', B + '/api/bookings', { pre: make, auth: '{{bad}}', test: function (pm) {
  pm.test('refused with 401', () => pm.response.to.have.status(401));
} });
save('b3/d-bad-tokens.postman_collection.json', collection('D tokens that must be refused', [
  loginOnce,
  neg('alg none', function (pm) {
    const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    pm.variables.set('bad', b64({ alg: 'none' }) + '.' + b64({ sub: 'boss', role: 'ADMIN', exp: 9999999999 }) + '.');
  }),
  neg('role changed, old signature', function (pm) {
    const [h, p, s] = pm.collectionVariables.get('token').split('.');
    const claims = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
    claims.role = 'ADMIN';
    pm.variables.set('bad', h + '.' + btoa(JSON.stringify(claims)).replace(/=+$/, '') + '.' + s);
  }),
  neg('garbage', function (pm) { pm.variables.set('bad', 'not-a-jwt'); }),
], { vars: [['password', 'labflow-demo'], ['token', '']] }));
