// POST /api/muon — app mobile dat muon sach (Lan, 05/2019). Luat lay tu BookServlet + y kien thu thu.
var express = require('express');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var kho = require('../lib/kho');

var router = express.Router();
router.use(express.json());

function taoPhieu(dsPhieu, docGiaId, tenSach, loai, ngayMuon, soNgay, nguoiTao, ghiChu) {
  var id = 0;
  for (var i = 0; i < dsPhieu.length; i++) if (dsPhieu[i].id > id) id = dsPhieu[i].id;
  return {
    id: id + 1, sach: tenSach, docGia: docGiaId,
    hanTra: moment(ngayMuon).add(soNgay, 'days').format(), ngayTra: null,
    nguoiTao: nguoiTao, ghiChu: ghiChu
  };
}

router.post('/', function (req, res) {
  var docGiaId = req.body.docGia;
  var tenSach = req.body.sach;
  if (!docGiaId || !tenSach) return res.status(400).json({ loi: 'thieu docGia hoac sach' });
  kho.doc('doc-gia', function (err, dsDocGia) {
    if (err) return res.status(500).send('loi doc du lieu');
    var dg = dsDocGia.filter(function (x) { return x.id == docGiaId; })[0];
    if (!dg) return res.status(404).json({ loi: 'khong tim thay doc gia' });
    kho.doc('phieu', function (err2, dsPhieu) {
      if (err2) return res.status(500).send('loi doc du lieu');
      var dangMuon = 0;
      for (var i = 0; i < dsPhieu.length; i++) {
        if (dsPhieu[i].docGia == dg.id && !dsPhieu[i].ngayTra) dangMuon++;
      }
      var toiDa;
      var soNgay;
      if (dg.loai == 'SV') {
        toiDa = 3; soNgay = 14;
      } else if (dg.loai == 'GV') {
        toiDa = 10; soNgay = 30;
      } else {
        toiDa = 1; soNgay = 7;
      }
      if (dangMuon >= toiDa) {
        return res.status(409).json({ loi: 'vuot qua so sach duoc muon', dangMuon: dangMuon, toiDa: toiDa });
      }
      // thu thu yeu cau 2019: dang co sach qua han thi khong cho muon them (tru GV)
      for (var j = 0; j < dsPhieu.length; j++) {
        if (dsPhieu[j].docGia == dg.id && !dsPhieu[j].ngayTra) {
          if (moment().diff(moment(dsPhieu[j].hanTra), 'days', true) > 0) {
            if (dg.loai != 'GV') {
              return res.status(409).json({ loi: 'dang co sach qua han', phieu: dsPhieu[j].id });
            }
          }
        }
      }
      var p = taoPhieu(dsPhieu, dg.id, tenSach, dg.loai, new Date(), soNgay, 'mobile', req.body.ghiChu || '');
      dsPhieu.push(p);
      fs.writeFile(path.join(__dirname, '..', 'data', 'phieu.json'), JSON.stringify(dsPhieu, null, 2), function (err3) {
        if (err3) return res.status(500).send('loi ghi du lieu');
        res.status(201).json({ phieu: p.id, hanTra: moment(p.hanTra).format('DD/MM/YYYY'), phi: 0 });
      });
    });
  });
});

module.exports = router;
