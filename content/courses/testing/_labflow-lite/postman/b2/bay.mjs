import { req, collection, folder, save } from '../tao.mjs';
const B = '{{baseUrl}}';
const items = [
  req('Login as thay (no bookings yet)', 'POST', B + '/api/login', { auth: 'none', headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: { username: 'thay', password: 'labflow-demo' }, test: function (pm) {
    pm.collectionVariables.set('token', pm.response.json().token);
  } }),
  req('T1 every booking is confirmed', 'GET', B + '/api/bookings', { test: function (pm) {
    pm.test('T1 every booking is CONFIRMED', () => {
      pm.response.json().forEach((b) => pm.expect(b.status).to.eql('CONFIRMED'));
    });
    pm.test('T1 fixed: there is at least one, and all are CONFIRMED', () => {
      const list = pm.response.json();
      pm.expect(list).to.have.length.above(0);
      list.forEach((b) => pm.expect(b.status).to.eql('CONFIRMED'));
    });
  } }),
  req('T2 a test without an assertion', 'GET', B + '/api/health', { test: function (pm) {
    pm.test('T2 status is down', () => {
      pm.response.json().status === 'down';
    });
  } }),
  req('T3 typo in a variable name', 'GET', B + '/api/bookings/{{bookingID}}', { test: function (pm) {
    console.log('sent to', pm.request.url.getPath());
    pm.test('T3 another user gets 404', () => pm.response.to.have.status(404));
  } }),
  req('T4 eql or equal', 'GET', B + '/api/health', { test: function (pm) {
    pm.test('T4a to.eql (deep)', () => pm.expect(pm.response.json()).to.eql({ status: 'ok' }));
    pm.test('T4b to.equal (same object?)', () => pm.expect(pm.response.json()).to.equal({ status: 'ok' }));
  } }),
  req('T5 assertion outside pm.test', 'GET', B + '/api/health', { test: function (pm) {
    pm.expect(pm.response.code).to.eql(500);
    pm.test('T5 this line runs?', () => pm.expect(1).to.eql(1));
  } }),
  req('T6 schema', 'GET', B + '/api/health', { test: function (pm) {
    pm.test('T6 health matches its schema', () => {
      pm.response.to.have.jsonSchema({
        type: 'object', required: ['status', 'version'],
        properties: { status: { enum: ['ok'] }, version: { type: 'string' } },
      });
    });
  } }),
];
save('b2/bay.postman_collection.json', collection('Traps', items, { auth: '{{token}}', vars: [['token', '']] }));
