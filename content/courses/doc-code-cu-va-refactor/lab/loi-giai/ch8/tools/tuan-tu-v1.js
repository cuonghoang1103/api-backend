// bản v1 của tuanTu (y như trong routes/muon.js) để thử câu hỏi của người review
var hang = Promise.resolve();
module.exports = function tuanTu(xuLy) {
  return function (req, res) {
    hang = hang.then(function () {
      return new Promise(function (xong) { res.on('finish', xong); res.on('close', xong); xuLy(req, res); });
    });
  };
};
