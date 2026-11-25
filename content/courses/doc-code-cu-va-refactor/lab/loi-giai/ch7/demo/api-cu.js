// Những dòng "rất 2018" hay gặp trong repo Node cũ — chạy thử trên từng bản Node
const crypto = require('crypto');
const util = require('util');
const url = require('url');
function thu(nhan, f) {
  try { console.log('  ' + nhan.padEnd(28) + ' -> ' + f()); }
  catch (e) { console.log('  ' + nhan.padEnd(28) + ' -> LOI ' + (e.code || e.name) + ': ' + e.message.split('\n')[0].slice(0, 90)); }
}
console.log('node ' + process.version + ' (OpenSSL ' + process.versions.openssl + ')');
thu("createHash('md4')", () => crypto.createHash('md4').update('a').digest('hex').slice(0, 8));
thu('util.isArray([])', () => util.isArray([]));
thu("url.parse('/a?b=1').query", () => url.parse('/a?b=1').query);
thu("new Buffer('ab').length", () => new Buffer('ab').length);
