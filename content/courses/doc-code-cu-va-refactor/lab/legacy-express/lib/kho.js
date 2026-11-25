// "Kho" doc tu file JSON — tam thoi, se thay bang MySQL (2018)
var fs = require('fs');
var path = require('path');

function doc(ten, cb) {
  fs.readFile(path.join(__dirname, '..', 'data', ten + '.json'), 'utf8', function (err, s) {
    if (err) return cb(err);
    try {
      cb(null, JSON.parse(s));
    } catch (e) {
      cb(e);
    }
  });
}

module.exports = { doc: doc };
