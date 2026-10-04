/**
 * Chạy mã JS của người học trong một WORKER có hạn giờ (04/10/2026).
 *
 * Trước đây nút "Run (JS)" gọi `new Function(code)()` ngay trên trang:
 *  - một vòng lặp vô hạn treo CẢ TAB (không có cách dừng);
 *  - trong app desktop thì không chạy được chút nào: CSP của app cấm
 *    `new Function` (không có 'unsafe-eval') ⇒ nút chỉ in "Error: Refused to
 *    evaluate…".
 * Giờ mã chạy trong worker (không chạm DOM/biến của trang), có trần 5 giây.
 *
 * App desktop: worker dựng từ `blob:` THỪA KẾ CSP của trang nên vẫn bị cấm eval.
 * App đặt sẵn `__CT_HOP_CAT_WORKER__` — một tệp worker hộp cát có CSP riêng (được
 * eval, KHÔNG được ra mạng; xem desktop/src/main/security.ts) — ta nạp mã worker
 * vào đó bằng tin nhắn đầu tiên. Trên web biến này không có ⇒ đi đường blob.
 * Cùng cách với `components/algorithms/engine.ts`.
 */

const WORKER_SRC = `
self.onmessage = function (e) {
  var logs = [];
  var fmt = function (args) {
    return args.map(function (x) {
      if (typeof x === 'object' && x !== null) { try { return JSON.stringify(x); } catch (_) { return String(x); } }
      return String(x);
    }).join(' ');
  };
  console.log = function () { logs.push(fmt([].slice.call(arguments))); };
  console.info = console.log;
  console.debug = console.log;
  console.warn = function () { logs.push('[warn] ' + fmt([].slice.call(arguments))); };
  console.error = function () { logs.push('[error] ' + fmt([].slice.call(arguments))); };
  try {
    var ret = (new Function(e.data.code))();
    if (ret !== undefined) logs.push(String(ret));
    self.postMessage({ ok: true, logs: logs });
  } catch (err) {
    self.postMessage({ ok: false, logs: logs, error: (err && err.message) ? err.message : String(err) });
  }
};
`;

/** Trả về đúng chuỗi in ra khung kết quả (giữ định dạng cũ của trang). */
export function chayJs(code: string, timeoutMs = 5000): Promise<string> {
  return new Promise((resolve) => {
    let url: string | null = null;
    let worker: Worker | null = null;
    let xong = false;
    const ket = (s: string) => {
      if (xong) return;
      xong = true;
      if (worker) worker.terminate();
      if (url) URL.revokeObjectURL(url);
      resolve(s);
    };
    try {
      const hopCat = (globalThis as { __CT_HOP_CAT_WORKER__?: string }).__CT_HOP_CAT_WORKER__;
      if (hopCat) {
        worker = new Worker(hopCat);
        worker.postMessage({ __napMa: WORKER_SRC });
      } else {
        url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'application/javascript' }));
        worker = new Worker(url);
      }
      const hen = setTimeout(() => ket(`Error: timed out after ${timeoutMs / 1000}s — an infinite loop?`), timeoutMs);
      worker.onmessage = (ev: MessageEvent) => {
        clearTimeout(hen);
        const d = ev.data as { ok: boolean; logs?: string[]; error?: string };
        const logs = d.logs ?? [];
        if (d.ok) ket(logs.join('\n') || '(no output)');
        else ket([...logs, `Error: ${d.error ?? 'unknown error'}`].join('\n'));
      };
      worker.onerror = (ev: ErrorEvent) => { clearTimeout(hen); ket(`Error: ${ev.message || 'worker error'}`); };
      worker.postMessage({ code: code.replace(/\bexport\b/g, '') });
    } catch (e) {
      ket(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  });
}
