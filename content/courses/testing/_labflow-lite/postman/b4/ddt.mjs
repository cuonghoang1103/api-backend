import { req, collection, save } from '../tao.mjs';
const B = '{{baseUrl}}';
const login = function (pm) {
  const who = pm.iterationData.get('user');
  pm.sendRequest({
    url: pm.variables.replaceIn('{{baseUrl}}/api/login'), method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { mode: 'raw', raw: JSON.stringify({ username: who, password: 'labflow-demo' }) },
  }, (err, res) => pm.variables.set('token', res.json().token));
};
const check = function (pm) {
  const want = Number(pm.iterationData.get('expectStatus'));
  const code = pm.iterationData.get('expectCode');
  pm.test(pm.iterationData.get('case') + ' → ' + want + ' ' + code, () => {
    pm.response.to.have.status(want);
    const b = pm.response.json();
    pm.expect(want === 201 ? b.status : b.error.code).to.eql(code);
  });
};
const body = (seats) => '{\n  "lab": "{{lab}}",\n  "date": "2026-12-01",\n  "start": "{{start}}",\n  "end": "{{end}}",\n  "seats": ' + seats + '\n}';
const mk = (name, seats) => collection(name, [req('Book one row', 'POST', B + '/api/bookings', {
  headers: [{ key: 'Content-Type', value: 'application/json' }], body: body(seats), pre: login, test: check,
})], { auth: '{{token}}' });
save('b4/ddt.postman_collection.json', mk('Booking rules, one row per case', '{{seats}}'));
save('b4/ddt-quoted.postman_collection.json', mk('Same, but seats in quotes', '"{{seats}}"'));
