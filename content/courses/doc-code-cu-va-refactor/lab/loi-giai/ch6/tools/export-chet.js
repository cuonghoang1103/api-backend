#!/usr/bin/env node
// export-chet.js — bài 6.1: liệt kê tệp JS không ai require và tên export không ai dùng (CommonJS, repo nhỏ).
// Cố ý đơn giản (regex, ~40 dòng) để bạn đọc hiểu được; công cụ thật cho dự án lớn: knip, ts-prune (xem bài).
// Dùng: node export-chet.js <thư mục repo>
var fs = require('fs'), path = require('path');
var goc = path.resolve(process.argv[2] || '.');
function quet(d) {
  return fs.readdirSync(d).flatMap(function (t) {
    if (t === 'node_modules' || t.charAt(0) === '.') return [];
    var p = path.join(d, t);
    return fs.statSync(p).isDirectory() ? quet(p) : (/\.js$/.test(t) ? [p] : []);
  });
}
var tep = quet(goc), noiDung = {};
tep.forEach(function (p) { noiDung[p] = fs.readFileSync(p, 'utf8'); });
var pkg = JSON.parse(fs.readFileSync(path.join(goc, 'package.json'), 'utf8'));
var diemVao = [path.join(goc, pkg.main || 'index.js')];
var ten = function (p) { return path.relative(goc, p); };
var laTest = function (p) { return /__tests__|\.test\.js$/.test(p); };
// 1. Tệp không ai require (trừ điểm vào và test)
var duocRequire = {};
tep.forEach(function (p) {
  var re = /require\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g, m;
  while ((m = re.exec(noiDung[p]))) {
    var dich = path.resolve(path.dirname(p), m[1]);
    [dich, dich + '.js', path.join(dich, 'index.js')].forEach(function (x) { (duocRequire[x] = duocRequire[x] || []).push(ten(p)); });
  }
});
console.log('# Tệp không ai require (trừ điểm vào "' + pkg.main + '" và test):');
var tepChet = tep.filter(function (p) { return !laTest(p) && diemVao.indexOf(p) < 0 && !duocRequire[p]; });
console.log(tepChet.length ? tepChet.map(ten).join('\n') : '(không có)');
// 2. Tên trong module.exports = { a: a, b: b } mà không tệp nào khác nhắc tới ".a" / "{ a"
console.log('# Export không tệp nào khác dùng (chỉ test dùng thì ghi "chỉ test"):');
var dem = 0;
tep.filter(function (p) { return !laTest(p); }).forEach(function (p) {
  var m = /module\.exports\s*=\s*\{([^}]*)\}/.exec(noiDung[p]);
  if (!m) return;
  m[1].split(',').map(function (x) { return x.split(':')[0].trim(); }).filter(Boolean).forEach(function (t) {
    var re = new RegExp('(\\.|\\{\\s*|,\\s*)' + t + '\\b');
    var dung = tep.filter(function (q) { return q !== p && re.test(noiDung[q]); });
    if (dung.length === 0 || dung.every(laTest)) { dem++; console.log(ten(p) + ': ' + t + (dung.length ? '   (chỉ test: ' + dung.map(ten).join(', ') + ')' : '')); }
  });
});
if (!dem) console.log('(không có)');
