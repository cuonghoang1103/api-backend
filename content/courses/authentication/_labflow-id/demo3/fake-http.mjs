// demo3/fake-http.mjs — just enough of req/res to drive the session layer without a server (timeouts, tests).
export function fakeReq(cookie, method = 'GET', headers = {}) {
  return { method, ip: '127.0.0.1', headers: { ...(cookie ? { cookie } : {}), 'user-agent': 'demo', ...headers } };
}
export function fakeRes() {
  const res = { setCookies: [], status: 200, body: null };
  res.append = (name, value) => { if (name.toLowerCase() === 'set-cookie') res.setCookies.push(value); return res; };
  res.status = (code) => { res.code = code; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
}
/** The cookie value the response set, or null; '' when it was cleared. */
export const setValue = (res, name = '__Host-lfid_ses') => {
  const c = res.setCookies.find((x) => x.startsWith(name + '='));
  return c ? c.slice(name.length + 1).split(';')[0] : null;
};
