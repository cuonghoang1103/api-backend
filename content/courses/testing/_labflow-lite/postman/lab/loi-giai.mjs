import { req, collection, folder, save } from '../tao.mjs';
import { items, common } from '../labflow.mjs';
const B = '{{baseUrl}}';
const json = [{ key: 'Content-Type', value: 'application/json' }];
const book = (name, body, test, auth) => req(name, 'POST', B + '/api/bookings', { headers: json, body, test, auth });
const loginThay = req('Login as thay', 'POST', B + '/api/login', { auth: 'none', headers: json,
  body: { username: 'thay', password: '{{password}}' }, test: function (pm) {
  pm.test('200 and a token', () => pm.response.to.have.status(200));
  pm.collectionVariables.set('tokenThay', pm.response.json().token);
} });
const lab = folder('4 Lab — the rules nobody tested', [
  loginThay,
  req('A lecturer is not an admin', 'GET', B + '/api/admin/bookings', { auth: '{{tokenThay}}', test: function (pm) {
    pm.test('403 for LECTURER', () => pm.response.to.have.status(403));
  } }),
  book('Right after mine (11:00–12:00) is free', { lab: 'BE-201', date: '2026-12-01', start: '11:00', end: '12:00', seats: 20 }, function (pm) {
    pm.test('back-to-back is 201, not 409', () => pm.response.to.have.status(201));
  }),
  book('30 seats: no approval', { lab: 'BE-401', date: '2026-12-01', start: '09:00', end: '10:00', seats: 30 }, function (pm) {
    pm.test('30 seats → CONFIRMED', () => pm.expect(pm.response.json().status).to.eql('CONFIRMED'));
  }),
  book('31 seats: approval', { lab: 'BE-402', date: '2026-12-01', start: '09:00', end: '10:00', seats: 31 }, function (pm) {
    pm.test('31 seats → PENDING', () => pm.expect(pm.response.json().status).to.eql('PENDING'));
  }),
  req("Binh's list has none of An's", 'GET', B + '/api/bookings', { auth: '{{tokenBinh}}', test: function (pm) {
    pm.test('my bookings are only mine', () => {
      pm.response.to.have.status(200);
      const ids = pm.response.json().map((b) => b.id);
      pm.expect(ids).to.not.include(pm.collectionVariables.get('bookingId'));
    });
  } }),
  req("An's list has An's booking", 'GET', B + '/api/bookings', { test: function (pm) {
    pm.test('and mine are there', () => {
      const ids = pm.response.json().map((b) => b.id);
      pm.expect(ids).to.include(pm.collectionVariables.get('bookingId'));
    });
  } }),
]);
save('lab/loi-giai.postman_collection.json', collection('LabFlow Lite API — Lab 10B reference', [...items, lab], {
  auth: '{{tokenAn}}', test: common,
  vars: [['password', 'labflow-demo'], ['tokenAn', ''], ['tokenBinh', ''], ['tokenBoss', ''], ['tokenThay', ''], ['bookingId', '']],
}));
console.log('wrote lab/loi-giai.postman_collection.json');
