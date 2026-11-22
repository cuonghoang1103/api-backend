/** Output + mã THẬT của bài 2.5 (/tmp/dbg-lab/ch2/2-5, Express 4.22.2, Node v26.8.1), đã thoát HTML — sinh bằng script, đừng sửa tay. */
export const P = {
  E1: `$ curl -s http://127.0.0.1:18231/hoa-don/7
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;title&gt;Error&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;pre&gt;TypeError: Cannot read properties of null (reading &amp;#39;tong&amp;#39;)&lt;br&gt; &amp;nbsp; &amp;nbsp;at /private/tmp/dbg-lab/ch2/2-3/express/lo.js:5:23&lt;br&gt; &amp;nbsp; &amp;nbsp;at Layer.handle [as handle_request] (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/layer.js:95:5)&lt;br&gt; &amp;nbsp; &amp;nbsp;at next (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/route.js:149:13)&lt;br&gt; &amp;nbsp; &amp;nbsp;at Route.dispatch (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/route.js:119:3)&lt;br&gt; &amp;nbsp; &amp;nbsp;at Layer.handle [as handle_request] (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/layer.js:95:5)&lt;br&gt; &amp;nbsp; &amp;nbsp;at /private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/index.js:284:15&lt;br&gt; &amp;nbsp; &amp;nbsp;at param (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/index.js:365:14)&lt;br&gt; &amp;nbsp; &amp;nbsp;at param (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/index.js:376:14)&lt;br&gt; &amp;nbsp; &amp;nbsp;at router.process_params (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/index.js:421:3)&lt;br&gt; &amp;nbsp; &amp;nbsp;at next (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/index.js:280:10)&lt;/pre&gt;
&lt;/body&gt;
&lt;/html&gt;`,
  E2: `$ NODE_ENV=production node lo.js   # restarted, then:
$ curl -s -i http://127.0.0.1:18231/hoa-don/7
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 148

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;title&gt;Error&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;pre&gt;Internal Server Error&lt;/pre&gt;
&lt;/body&gt;
&lt;/html&gt;`,
  L1: `$ cat log-loi.txt
2026-11-22T14:03:11.482Z ERROR [req 8f3a91c2] user=an@example.com GET /api/dat-lich/3?token=FAKE-TOKEN-0000 -&gt; TypeError: b.batDau.toISOString is not a function at /home/an/projects/ctw-booking/src/service/datLich.js:19:55
2026-11-22T14:07:45.019Z ERROR [req 1b77e0d4] user=binh@example.com GET /api/dat-lich/9 Authorization: Bearer FAKE.JWT.TOKEN -&gt; TypeError: b.batDau.toISOString is not a function at /home/binh/ctw/src/service/datLich.js:19:55`,
  L2: `$ ./lam-sach.sh log-loi.txt
&lt;TIME&gt; ERROR [req &lt;ID&gt;] user=&lt;EMAIL&gt; GET /api/dat-lich/3?token=&lt;TOKEN&gt; -&gt; TypeError: b.batDau.toISOString is not a function at &lt;PROJECT&gt;/src/service/datLich.js:19:55
&lt;TIME&gt; ERROR [req &lt;ID&gt;] user=&lt;EMAIL&gt; GET /api/dat-lich/9 Authorization: Bearer &lt;TOKEN&gt; -&gt; TypeError: b.batDau.toISOString is not a function at &lt;PROJECT&gt;/src/service/datLich.js:19:55`,
  SH: `#!/usr/bin/env bash
# Che bí mật + dữ liệu cá nhân, bỏ phần thay đổi theo lần chạy (giờ, id, đường dẫn) trước khi dán ra ngoài.
sed -E \\
  -e 's/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.]+Z/&lt;TIME&gt;/g' \\
  -e 's/\\[req [0-9a-f]+\\]/[req &lt;ID&gt;]/g' \\
  -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,}/&lt;EMAIL&gt;/g' \\
  -e 's/(token=)[^ &amp;]+/\\1&lt;TOKEN&gt;/g' \\
  -e 's/(Bearer )[A-Za-z0-9._-]+/\\1&lt;TOKEN&gt;/g' \\
  -e 's#/home/[^ ]*/src/#&lt;PROJECT&gt;/src/#g' \\
  "$1" | sort -u`,
  LO: `const express = require('express');
const app = express();
app.get('/hoa-don/:id', (req, res) =&gt; {
  const hd = null;                       // không tìm thấy hoá đơn
  res.json({ tong: hd.tong });           // TypeError
});
app.listen(18231, '127.0.0.1');`,
};
