// timing.js — bài 8.1: đo từng chặng của MỘT request rồi báo trong header Server-Timing (chuẩn W3C)
// DevTools (tab Network → Timing) đọc được header này; curl -i thấy ngay.
export function serverTiming(req, res, next) {
  const start = performance.now();
  const marks = [];
  req.timing = {
    time(name, fn) {                                   // đo một đoạn code đồng bộ
      const a = performance.now();
      try { return fn(); } finally { marks.push([name, performance.now() - a]); }
    },
    add(name, ms) { marks.push([name, ms]); },          // đoạn bất đồng bộ: tự đo rồi ghi lại
    async timeAsync(name, fn) {                        // bài 9.2: đo một đoạn await
      const a = performance.now();
      try { return await fn(); } finally { marks.push([name, performance.now() - a]); }
    },
  };
  const writeHead = res.writeHead;                   // header phải gắn TRƯỚC khi gửi: chặn ngay lúc ghi dòng trạng thái
  res.writeHead = function (...args) {
    const parts = marks.map(([n, ms]) => `${n};dur=${ms.toFixed(2)}`);
    parts.push(`total;dur=${(performance.now() - start).toFixed(2)}`);
    if (!res.headersSent) res.setHeader('Server-Timing', parts.join(', '));
    return writeHead.apply(this, args);
  };
  next();
}
