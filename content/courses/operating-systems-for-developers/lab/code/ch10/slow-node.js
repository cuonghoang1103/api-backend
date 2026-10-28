// slow-node.js — máy chủ HTTP Node với headersTimeout 2 s (slowloris.py cho biết khi nào kết nối "header chậm" bị đóng).
//   CHECK=ms node slow-node.js   (CHECK = connectionsCheckingInterval; mặc định của Node là 30000)
const http = require('node:http');
const opts = { headersTimeout: 2000, requestTimeout: 5000 };
if (process.env.CHECK) opts.connectionsCheckingInterval = +process.env.CHECK;
const srv = http.createServer(opts, (req, res) => res.end('ok\n'));
srv.listen(7800, () => console.log(`node: headersTimeout ${srv.headersTimeout} ms, requestTimeout ${srv.requestTimeout} ms, keepAliveTimeout ${srv.keepAliveTimeout} ms, checking every ${opts.connectionsCheckingInterval ?? 30000} ms`));
