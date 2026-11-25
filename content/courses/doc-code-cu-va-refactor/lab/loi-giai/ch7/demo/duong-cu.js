// Ba kiểu viết route "đời Express 4" hay gặp — chạy với express 4.22.3 rồi 5.3.0
const express = require('express');
const http = require('http');
console.log('express ' + require('express/package.json').version);
const app = express();
try { app.get('/tai-lieu/*', (req, res) => res.send('tai lieu: ' + req.params[0])); console.log("  route '/tai-lieu/*'       -> dang ky duoc"); }
catch (e) { console.log("  route '/tai-lieu/*'       -> LOI " + e.message.slice(0, 80)); }
try { app.get('/api/sach/:id?', (req, res) => res.send('sach ' + (req.param ? req.param('id') : 'req.param khong con'))); console.log("  route '/api/sach/:id?'    -> dang ky duoc"); }
catch (e) { console.log("  route '/api/sach/:id?'    -> LOI " + e.message.slice(0, 80)); }
const sv = app.listen(0, () => {
  const p = sv.address().port;
  http.get('http://127.0.0.1:' + p + '/api/sach/7?loai[ten]=SV', (r) => { let b = ''; r.on('data', (c) => b += c); r.on('end', () => {
    console.log('  GET /api/sach/7           -> ' + r.statusCode + ' ' + b.replace(/\s+/g, ' ').slice(0, 60));
    sv.close();
  }); });
});
