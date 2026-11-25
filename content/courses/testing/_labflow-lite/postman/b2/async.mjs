import { req, collection, save } from '../tao.mjs';
const B = '{{baseUrl}}';
save('b2/async.postman_collection.json', collection('Async', [
  req('T7 sendRequest inside pm.test', 'GET', B + '/api/health', { test: function (pm) {
    pm.test('T7a callback assertion, no done', () => {
      pm.sendRequest(pm.variables.replaceIn('{{baseUrl}}') + '/api/admin/bookings', (err, res) => {
        console.log('callback ran, code', res.code);
        pm.expect(res.code).to.eql(200);
      });
    });
    pm.test('T7b same, with done', (done) => {
      pm.sendRequest(pm.variables.replaceIn('{{baseUrl}}') + '/api/admin/bookings', (err, res) => {
        try { pm.expect(res.code).to.eql(200); done(); } catch (e) { done(e); }
      });
    });
  } }),
]));
