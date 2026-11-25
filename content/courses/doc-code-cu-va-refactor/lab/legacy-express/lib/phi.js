// Tinh phi tre han — chep tu ben Java sang (Hung, 03/2018). "Giong het BookServlet".
var moment = require('moment');

function tinhPhi(phieu, docGia) {
  var tre = moment().diff(moment(phieu.hanTra), 'days', true);
  tre = Math.ceil(tre);
  if (tre <= 0) return 0;
  var phi = 0;
  if (docGia.loai == 'SV') {
    phi = tre * 2000;
    if (phi > 50000) phi = 50000;
  } else if (docGia.loai == 'GV') {
    phi = tre * 1000;
  } else {
    phi = tre * 5000;
  }
  return phi;
}

module.exports = { tinhPhi: tinhPhi };
