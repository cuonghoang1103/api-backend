var express = require('express');
var moment = require('moment');
var kho = require('../lib/kho');
var phi = require('../lib/phi');

var router = express.Router();

// GET /api/phieu/:id/phi — app mobile goi de hien "phi du kien"
router.get('/:id/phi', function (req, res) {
  kho.doc('phieu', function (err, dsPhieu) {
    if (err) return res.status(500).send('loi doc du lieu');
    var p = dsPhieu.filter(function (x) { return x.id == req.params.id; })[0];
    if (!p) return res.status(404).json({ loi: 'khong tim thay phieu' });
    kho.doc('doc-gia', function (err2, dsDocGia) {
      if (err2) return res.status(500).send('loi doc du lieu');
      var dg = dsDocGia.filter(function (x) { return x.id == p.docGia; })[0];
      if (p.ngayTra) return res.json({ phieu: p.id, phi: 0, ghiChu: 'da tra' });
      res.json({ phieu: p.id, docGia: dg.ten, hanTra: moment(p.hanTra).format('DD/MM/YYYY'), phi: phi.tinhPhi(p, dg) });
    });
  });
});

// GET /api/phieu/qua-han — danh sach qua han cho man hinh thu thu
router.get('/qua-han', function (req, res) {
  kho.doc('phieu', function (err, dsPhieu) {
    if (err) return res.status(500).send('loi doc du lieu');
    kho.doc('doc-gia', function (err2, dsDocGia) {
      if (err2) return res.status(500).send('loi doc du lieu');
      var kq = [];
      for (var i = 0; i < dsPhieu.length; i++) {
        var p = dsPhieu[i];
        if (p.ngayTra) continue;
        var dg = dsDocGia.filter(function (x) { return x.id == p.docGia; })[0];
        var f = phi.tinhPhi(p, dg);
        if (f > 0) kq.push({ phieu: p.id, docGia: dg.ten, loai: dg.loai, sach: p.sach, phi: f, capNhat: moment().format('HH:mm DD/MM/YYYY') });
      }
      res.json(kq);
    });
  });
});

module.exports = router;
