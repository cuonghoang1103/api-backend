import { req, collection, folder, save } from './tao.mjs';
const named = (r, v) => { for (const e of r.event) e.script.exec = e.script.exec.map((l) => l.replace("'VAR'", "'" + v + "'")); return r; };
const B = '{{baseUrl}}';
const login = (who, varName) => named(req('Login as ' + who, 'POST', B + '/api/login', {
  auth: 'none',
  body: { username: who, password: '{{password}}' },
  headers: [{ key: 'Content-Type', value: 'application/json' }],
  test: function (pm) {
    pm.test('200 and a token', () => {
      pm.response.to.have.status(200);
      pm.expect(pm.response.json().token).to.be.a('string');
    });
    pm.collectionVariables.set('VAR', pm.response.json().token);
  },
}), varName);
const json = [{ key: 'Content-Type', value: 'application/json' }];
const booking = { lab: 'BE-201', date: '2026-12-01', start: '09:00', end: '11:00', seats: 20 };

export const items = [
  folder('0 Setup', [req('Reset store', 'POST', B + '/api/test/reset', { auth: 'none', test: function (pm) {
    pm.test('204', () => pm.response.to.have.status(204));
  } })]),
  folder('1 Auth', [
    login('an', 'tokenAn'), login('binh', 'tokenBinh'), login('boss', 'tokenBoss'),
    req('Wrong password', 'POST', B + '/api/login', { auth: 'none', headers: json, body: { username: 'an', password: 'nope' }, test: function (pm) {
      pm.test('401 BAD_LOGIN', () => {
        pm.response.to.have.status(401);
        pm.expect(pm.response.json().error.code).to.eql('BAD_LOGIN');
      });
    } }),
  ]),
  folder('2 Bookings', [
    req('Create booking', 'POST', B + '/api/bookings', { headers: json, body: booking, test: function (pm) {
      const b = pm.response.json();
      pm.test('201 + Location', () => {
        pm.response.to.have.status(201);
        pm.response.to.have.header('Location', '/api/bookings/' + b.id);
      });
      pm.test('body is the booking we sent', () => {
        pm.expect(b).to.include({ lab: 'BE-201', date: '2026-12-01', start: '09:00', end: '11:00', seats: 20 });
        pm.expect(b.status).to.eql('CONFIRMED');
        pm.expect(b.minutes).to.eql(120);
      });
      pm.collectionVariables.set('bookingId', b.id);
    } }),
    req('Read it back', 'GET', B + '/api/bookings/{{bookingId}}', { test: function (pm) {
      pm.test('200, same booking', () => {
        pm.response.to.have.status(200);
        pm.expect(pm.response.json().id).to.eql(pm.collectionVariables.get('bookingId'));
      });
    } }),
    req('Another student cannot read it', 'GET', B + '/api/bookings/{{bookingId}}', { auth: '{{tokenBinh}}', test: function (pm) {
      pm.test('404 NOT_FOUND (not 403: do not confirm it exists)', () => {
        pm.response.to.have.status(404);
        pm.expect(pm.response.json().error.code).to.eql('NOT_FOUND');
      });
    } }),
    req('Same slot again', 'POST', B + '/api/bookings', { headers: json, body: { ...booking, start: '10:00', end: '12:00' }, test: function (pm) {
      pm.test('409 OVERLAP', () => {
        pm.response.to.have.status(409);
        pm.expect(pm.response.json().error.code).to.eql('OVERLAP');
      });
    } }),
    req('No token', 'POST', B + '/api/bookings', { auth: 'none', headers: json, body: booking, test: function (pm) {
      pm.test('401 UNAUTHENTICATED', () => {
        pm.response.to.have.status(401);
        pm.expect(pm.response.json().error.code).to.eql('UNAUTHENTICATED');
      });
    } }),
    req('Role in the body is refused', 'POST', B + '/api/bookings', { headers: json, body: { ...booking, lab: 'BE-202', role: 'ADMIN' }, test: function (pm) {
      pm.test('400 VALIDATION on "role"', () => {
        pm.response.to.have.status(400);
        const e = pm.response.json().error;
        pm.expect(e.code).to.eql('VALIDATION');
        pm.expect(JSON.stringify(e.details)).to.include('role');
      });
    } }),
    req('Off the 30-minute grid', 'POST', B + '/api/bookings', { headers: json, body: { ...booking, lab: 'BE-203', start: '09:15' }, test: function (pm) {
      pm.test('422 OFF_GRID', () => {
        pm.response.to.have.status(422);
        pm.expect(pm.response.json().error.code).to.eql('OFF_GRID');
      });
    } }),
  ]),
  folder('3 Admin', [
    req('Student cannot list all', 'GET', B + '/api/admin/bookings', { test: function (pm) {
      pm.test('403 FORBIDDEN', () => pm.response.to.have.status(403));
    } }),
    req('Admin lists all', 'GET', B + '/api/admin/bookings', { auth: '{{tokenBoss}}', test: function (pm) {
      pm.test('200, contains our booking', () => {
        pm.response.to.have.status(200);
        const ids = pm.response.json().map((b) => b.id);
        pm.expect(ids).to.include(pm.collectionVariables.get('bookingId'));
      });
    } }),
  ]),
];
export const common = function (pm) {
  pm.test('answers in under 500 ms', () => pm.expect(pm.response.responseTime).to.be.below(500));
  if (pm.response.code !== 204) pm.test('JSON body', () => pm.response.to.be.json);
};
if (import.meta.url === 'file://' + process.argv[1]) {
  save('labflow.postman_collection.json', collection('LabFlow Lite API', items, {
    auth: '{{tokenAn}}', test: common,
    vars: [['password', 'labflow-demo'], ['tokenAn', ''], ['tokenBinh', ''], ['tokenBoss', ''], ['bookingId', '']],
  }));
  console.log('wrote labflow.postman_collection.json');
}
