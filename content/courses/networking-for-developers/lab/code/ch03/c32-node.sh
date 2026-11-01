# Ch3 · 3.2 — code của bạn đọc bản ghi thế nào: module dns của Node (dns.promises). mongodb+srv:// = tra SRV + TXT y như dưới
cat > /tmp/ghi.mjs <<'JS'
import dns from 'node:dns/promises';
console.log('MX  ', await dns.resolveMx('labflow.test'));
console.log('TXT ', await dns.resolveTxt('labflow.test'));
console.log('CAA ', await dns.resolveCaa('labflow.test'));
console.log('SRV ', await dns.resolveSrv('_mongodb._tcp.db.labflow.test'));
console.log('TXT ', await dns.resolveTxt('db.labflow.test'));
JS
node /tmp/ghi.mjs
