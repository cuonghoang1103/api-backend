// server.js — điểm khởi động. Chương 12 thêm: kiểm cấu hình TRƯỚC khi mở cổng, tắt ÊM khi nhận SIGTERM, /metrics ở cổng riêng.
import http from 'node:http';
import { config, checkConfig } from './config.js';
checkConfig();                                                // thiếu biến bắt buộc ⇒ dừng NGAY, liệt kê đủ (bài 12.7)
const { app } = await import('./app.js');
const { attachWs, closeAllWs } = await import('./ws.js');
const { lifecycle } = await import('./lifecycle.js');
const { store } = await import('./store/index.js');
const { renderMetrics } = await import('./metrics.js');
const { log } = await import('./log.js');

const PORT = process.env.PORT ?? 4000;
const server = app.listen(PORT, () => console.log(`LabFlow API chạy ở http://localhost:${PORT} (store: ${config.store}${config.instance ? `, instance ${config.instance}` : ''})`));
const wss = attachWs(server);                                 // bài 10.4: WebSocket dùng chung cổng với HTTP

// /metrics ở cổng RIÊNG (chỉ mạng nội bộ / Prometheus thấy) — đừng để số đo nội bộ ra Internet
let metricsServer = null;
if (process.env.METRICS_PORT) {
  metricsServer = http.createServer(async (req, res) => {
    if (req.url !== '/metrics') { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': 'text/plain; version=0.0.4' }).end(await renderMetrics());
  }).listen(Number(process.env.METRICS_PORT), process.env.METRICS_HOST ?? '127.0.0.1');
}

// Tắt ÊM (bài 12.7). Thứ tự quan trọng:
//   1) draining ⇒ /ready trả 503: load balancer ngừng gửi request MỚI tới instance này
//   2) chờ SHUTDOWN_DRAIN_MS để load balancer kịp thấy (k8s/nginx kiểm vài giây một lần) — trong lúc đó VẪN phục vụ bình thường
//   3) server.close(): không nhận kết nối mới, request đang dở chạy nốt; SSE/WebSocket được báo "nối lại nơi khác"
//   4) quá SHUTDOWN_GRACE_MS mà còn dở ⇒ cắt; xong ⇒ đóng pool CSDL, thoát 0
const DRAIN_MS = Number(process.env.SHUTDOWN_DRAIN_MS ?? 0);
const ABRUPT = process.env.LABFLOW_SHUTDOWN === 'abrupt';     // CHỈ để so: thoát ngay như chưa có code tắt êm
async function shutdown(signal) {
  if (lifecycle.draining) return;
  if (ABRUPT) process.exit(0);
  lifecycle.draining = true;
  const t0 = Date.now();
  log('info', 'shutdown', { signal, drainMs: DRAIN_MS });
  await new Promise((r) => setTimeout(r, DRAIN_MS));
  lifecycle.emit('shutdown');                                  // SSE: kết thúc luồng (client nối lại bằng Last-Event-ID)
  closeAllWs(wss);
  const force = setTimeout(() => { log('warn', 'shutdown: hết thời gian chờ, cắt kết nối còn lại'); server.closeAllConnections(); }, config.shutdownGraceMs);
  force.unref();
  await new Promise((r) => { server.close(r); server.closeIdleConnections(); });
  metricsServer?.close();
  await store.close().catch(() => {});
  log('info', 'shutdown complete', { ms: Date.now() - t0 });
  process.exit(0);
}
for (const s of ['SIGTERM', 'SIGINT']) process.on(s, () => shutdown(s));
