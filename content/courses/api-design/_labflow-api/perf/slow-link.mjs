// perf/slow-link.mjs — bài 8.3: giả lập đường truyền chậm giữa app và LabFlow (Wi-Fi đông người / 4G yếu)
//   node perf/slow-link.mjs <cổng nghe> <cổng LabFlow> <kbit/s> <ms trễ mỗi chiều>
// Mọi request đi qua nguyên vẹn (kể cả Accept-Encoding); response bị "nhỏ giọt" đúng băng thông đã đặt.
import http from 'node:http';
const [listen = 8090, upstream = 4000, kbps = 1000, delay = 40] = process.argv.slice(2).map(Number);
const bytesPerMs = (kbps * 1000) / 8 / 1000;
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
http.createServer(async (req, res) => {
  await sleep(delay);                                            // request đi tới server
  const up = http.request({ port: upstream, path: req.url, method: req.method, headers: req.headers }, async (r) => {
    await sleep(delay);                                          // byte đầu của response đi về
    res.writeHead(r.statusCode, r.headers);
    for await (const chunk of r) {
      for (let i = 0; i < chunk.length; i += 1024) {             // nhỏ giọt từng 1 KB theo băng thông
        const piece = chunk.subarray(i, i + 1024);
        res.write(piece);
        await sleep(piece.length / bytesPerMs);
      }
    }
    res.end();
  });
  req.pipe(up);
}).listen(listen, () => console.log(`đường chậm :${listen} → :${upstream}, ${kbps} kbit/s, trễ ${delay} ms mỗi chiều`));
