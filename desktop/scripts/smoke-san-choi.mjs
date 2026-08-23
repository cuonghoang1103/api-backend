/**
 * SMOKE TEST cho sân chơi 3D trong app.
 *
 * Kiểm những thứ CHỈ lộ ra khi chạy thật, không đọc mã mà thấy được:
 * protocol `app://playground` có phục vụ đúng thư mục không, `<base href>` đã
 * thành `./` chưa, CSP nới cho sân chơi mà KHÔNG nới cho renderer chính, và
 * chốt chặn đi ra ngoài thư mục có sống không.
 *
 * Chạy:  npm run smoke:san-choi     (tự `npm run build` trước)
 *
 * ⚠️ KHÔNG kiểm được ở đây: game có VẼ RA không. Cái đó cần GPU thật —
 * `npm run do:webgpu` đo phần WebGPU, còn nhìn thấy thế giới thì phải mở máy
 * lên mà xem. Bộ này chỉ chứng minh mọi thứ QUANH game đã đúng chỗ.
 *
 * ⚠️ `CT_RENDERER=bundle` là bắt buộc, cùng lý do với `smoke.mjs`: thiếu nó thì
 * `app.isPackaged` là false và ta đo đường dev trong khi báo cáo là đã kiểm bản
 * phát hành.
 */
import { _electron as electron } from 'playwright';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

let hong = 0;
function check(nhan, dat, chiTiet = '') {
  if (!dat) hong += 1;
  const dau = dat ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  console.log(`  ${dau} ${nhan}${chiTiet ? ` — ${chiTiet}` : ''}`);
}

console.log('\nSmoke sân chơi 3D (bản đã build)…\n');

/**
 * Máy chủ tĩnh cục bộ đóng vai cuongthai.com cho bộ tải.
 *
 * Trỏ `CT_PLAYGROUND_ASSETS` vào đây thay vì gọi ra Internet: bộ kiểm phải chạy
 * được cả khi máy không có mạng, và nó phải đo BỘ TẢI chứ không đo đường truyền
 * tới VPS. 78 MB qua localhost mất vài giây.
 */
const goc = path.join(root, '..', 'frontend', 'public', 'playground');
const mayChu = createServer((req, res) => {
  const duong = path.join(goc, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!duong.startsWith(goc)) {
    res.writeHead(403).end();
    return;
  }
  createReadStream(duong)
    .on('error', () => res.writeHead(404).end())
    .pipe(res);
});
await new Promise((r) => mayChu.listen(0, '127.0.0.1', r));
const cong = mayChu.address().port;

const app = await electron.launch({
  args: [path.join(root, 'dist/main/index.cjs'), '--no-sandbox'],
  env: {
    ...process.env,
    CT_RENDERER: 'bundle',
    CT_PLAYGROUND_ASSETS: `http://127.0.0.1:${cong}`,
  },
});

/**
 * Mọi phép lấy đều chạy trong MAIN.
 *
 * Đây là chỗ duy nhất thấy được cả `protocol.handle` lẫn header do
 * `onHeadersReceived` gắn vào, mà không phải mở một cửa sổ game thật — mở cửa
 * sổ thật trên máy không có GPU thì gói JS ném lỗi khởi tạo renderer và bộ kiểm
 * chết vì một lý do chẳng liên quan gì tới thứ nó đang kiểm.
 */
const kq = await app.evaluate(async ({ net }) => {
  const lay = async (url) => {
    try {
      const res = await net.fetch(url);
      return {
        status: res.status,
        csp: res.headers.get('content-security-policy') ?? '',
        body: res.status === 200 ? (await res.text()).slice(0, 4000) : '',
      };
    } catch (e) {
      return { status: 0, csp: '', body: '', loi: String(e) };
    }
  };

  return {
    index: await lay('app://playground/index.html'),
    manifest: await lay('app://playground/manifest-media.json'),
    khongCo: await lay('app://playground/khong-he-ton-tai-9f3.png'),
    appChinh: await lay('app://cuongthai/index.html'),
  };
});

// ── 1. Protocol phục vụ đúng ────────────────────────────────
console.log('Protocol app://playground:');
check('index.html trả 200', kq.index.status === 200, `status=${kq.index.status}${kq.index.loi ?? ''}`);
check(
  '<base href="./"> — đã đổi khỏi /playground/ của bản web',
  kq.index.body.includes('<base href="./">'),
);
check('manifest-media.json trả 200', kq.manifest.status === 200);

let soFile = 0;
let tongByte = 0;
try {
  const m = JSON.parse(kq.manifest.body.length < 4000 ? kq.manifest.body : '{}');
  soFile = m.count ?? 0;
  tongByte = m.totalBytes ?? 0;
} catch {
  /* body bị cắt ở 4000 ký tự với manifest thật — đọc lại đủ ở bước dưới */
}

/**
 * Manifest thật dài ~200 KB nên `body` ở trên bị cắt — đọc thẳng từ đĩa.
 *
 * ⚠️ Đọc bằng `fs` của CHÍNH bộ kiểm, KHÔNG `require()` trong `app.evaluate`:
 * ngữ cảnh của `evaluate` không có `require`, và lỗi báo ra là
 * "require is not defined" ở một dòng chẳng liên quan gì tới thứ đang kiểm.
 */
const thongTin = await (async () => {
  const goc = path.join(root, 'resources', 'playground');
  try {
    const m = JSON.parse(await fs.readFile(path.join(goc, 'manifest-media.json'), 'utf8'));
    return { goc, count: m.count, totalBytes: m.totalBytes, version: m.version };
  } catch (e) {
    return { goc, loi: String(e) };
  }
})();

soFile = thongTin.count ?? soFile;
tongByte = thongTin.totalBytes ?? tongByte;
check('manifest có danh sách tệp', soFile > 0, `${soFile} tệp`);
check(
  'tổng dung lượng thế giới hợp lý (50–150 MB)',
  tongByte > 50 * 1048576 && tongByte < 150 * 1048576,
  `${(tongByte / 1048576).toFixed(1)} MB`,
);
check('tệp không tồn tại trả 404', kq.khongCo.status === 404, `status=${kq.khongCo.status}`);

// ── 2. Chốt chặn đi ra ngoài thư mục ────────────────────────
/**
 * Dùng đường MÃ HOÁ (`%2e%2e%2f` = `../`).
 *
 * Viết `..` trần thì `net.fetch` tự chuẩn hoá sạch TRƯỚC khi tới handler, nên
 * phép kiểm sẽ xanh mà chẳng chứng minh được gì — đúng loại bộ kiểm tự báo
 * oan ngược. Dạng mã hoá đi nguyên vẹn qua tầng URL và chỉ bị mở ra ở
 * `decodeURIComponent` trong chính handler, tức là nó thử đúng cái chốt.
 *
 * Phải có ĐUÔI TỆP: đường không đuôi được coi là "xin trang chủ" và trả
 * index.html, nên nó không chạm tới chốt chặn.
 */
const thoat = await app.evaluate(async ({ net }) => {
  const thu = async (url) => {
    try {
      return (await net.fetch(url)).status;
    } catch {
      // Chromium chặn ngay ở tầng URL cũng là chặn — coi như đạt.
      return 403;
    }
  };
  return {
    len: await thu('app://playground/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd.png'),
    lenNua: await thu('app://playground/assets/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd.css'),
    binhThuong: await thu('app://playground/index.html'),
  };
});

console.log('\nChốt chặn đường dẫn:');
check('..%2f ra ngoài gốc bị chặn', thoat.len === 403 || thoat.len === 404, `status=${thoat.len}`);
check('..%2f từ trong assets/ bị chặn', thoat.lenNua === 403 || thoat.lenNua === 404, `status=${thoat.lenNua}`);
check('đường hợp lệ vẫn qua', thoat.binhThuong === 200, `status=${thoat.binhThuong}`);

// ── 3. CSP: nới cho sân chơi, KHÔNG nới cho app ─────────────
/**
 * Kiểm HIỆU LỰC, không kiểm chuỗi header.
 *
 * Lượt đầu bộ này đọc `content-security-policy` bằng `net.fetch` trong main và
 * nhận về RỖNG — `net.fetch` ở main KHÔNG đi qua `session.webRequest`, nên nó
 * không bao giờ thấy header mà `onHeadersReceived` gắn vào. Bốn phép kiểm đỏ
 * mà mã thì đúng. (Chính dòng "sửa bộ kiểm trước" đã cứu: nó nói thẳng rằng
 * phép kiểm vô nghĩa thay vì kết tội mã.)
 *
 * `eval()` là phép thử thật: CSP thiếu `'unsafe-eval'` thì Chromium ném
 * `EvalError` ngay trong trang. Không đọc chuỗi nào cả, đo đúng thứ quan tâm.
 */
async function thuEval(trang) {
  return trang.evaluate(() => {
    try {
      // eslint-disable-next-line no-eval
      return String(eval('1+1'));
    } catch (e) {
      return `CHAN:${e.name}`;
    }
  });
}

console.log('\nCSP tách theo origin (đo bằng eval, không đọc header):');

/**
 * Mở trang sân chơi để đo. Gói game 5 MB sẽ chạy và — trên máy không có GPU —
 * ném lỗi khởi tạo renderer; điều đó KHÔNG sao, `eval` vẫn đo được. Bắt lỗi
 * trang để một `unhandledrejection` của game không làm hỏng bộ kiểm.
 */
const trangGame = await app.firstWindow().then(() => null).catch(() => null);
void trangGame;

const cuaSoGame = await app.evaluate(async ({ BrowserWindow }) => {
  const w = new BrowserWindow({
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  await w.loadURL('app://playground/index.html');
  return w.webContents.id;
});

const trangSanChoi = app.windows().find((t) => t.url().startsWith('app://playground/'));
void cuaSoGame;

if (!trangSanChoi) {
  check('mở được trang sân chơi để đo CSP', false, 'không thấy cửa sổ app://playground');
} else {
  const evalSanChoi = await thuEval(trangSanChoi);
  check(
    "sân chơi CHẠY được eval (Rapier biên dịch wasm cần 'unsafe-eval')",
    evalSanChoi === '2',
    `eval → ${evalSanChoi}`,
  );
}

/**
 * Với renderer chính, KHÔNG đo bằng `eval`.
 *
 * Lượt trước đo thế và nó đỏ oan: bộ kiểm chạy `dist/main/index.cjs` từ
 * `node_modules`, nên `app.isPackaged` là FALSE ⇒ `IS_DEV` true ⇒ app dùng
 * nhánh CSP DEV, mà nhánh đó CÓ `'unsafe-eval'` (Vite cần). `CT_RENDERER=bundle`
 * chỉ đổi nguồn renderer, KHÔNG đổi `isPackaged` — đúng điều `config.ts` đã ghi.
 *
 * Thứ phân biệt được ở CẢ dev lẫn bản đóng gói là `blob:` trong `script-src`:
 * sân chơi có (three nạp shader/worker qua blob), app KHÔNG có ở cả hai nhánh.
 * Nạp một script từ blob URL vì thế là phép thử đúng: chạy được ⇒ đang áp luật
 * sân chơi; bị chặn ⇒ đang áp luật app.
 */
async function thuBlobScript(trang) {
  return trang.evaluate(
    () =>
      new Promise((res) => {
        const url = URL.createObjectURL(
          new Blob(['window.__ctBlob = true'], { type: 'text/javascript' }),
        );
        const el = document.createElement('script');
        el.src = url;
        el.onload = () => res(window.__ctBlob === true ? 'chay' : 'khong-chay');
        el.onerror = () => res('chan');
        document.head.appendChild(el);
        setTimeout(() => res('het-gio'), 3000);
      }),
  );
}

const trangApp = app.windows().find((t) => t.url().startsWith('app://cuongthai/'));
if (!trangApp) {
  check('có cửa sổ renderer chính để đối chiếu', false);
} else {
  const blobApp = await thuBlobScript(trangApp);
  check(
    'renderer chính CHẶN script từ blob: — luật sân chơi KHÔNG lan sang app',
    blobApp === 'chan',
    `blob script → ${blobApp}`,
  );
}

if (trangSanChoi) {
  const blobSanChoi = await thuBlobScript(trangSanChoi);
  check(
    'sân chơi CHO script từ blob: (three nạp qua blob URL)',
    blobSanChoi === 'chay',
    `blob script → ${blobSanChoi}`,
  );
}

console.log(
  '\n  \x1b[33mi\x1b[0m Một điều bộ này KHÔNG chứng minh được: bản ĐÓNG GÓI THẬT bỏ' +
    "\n    'unsafe-eval' khỏi CSP của app. Ở đây `isPackaged` luôn false nên app" +
    '\n    chạy nhánh CSP dev. Muốn chắc thì đo trên bản .dmg/.exe đã cài.',
);

// ── 4. Bộ tải chạy THẬT, đầu tới cuối ───────────────────────
/**
 * Đây là phần duy nhất chứng minh tính năng CHẠY, không chỉ "được nối đúng".
 *
 * Đi qua đúng đường của người dùng: renderer gọi `window.cuongthai.sanChoi.tai()`
 * → IPC → `taiVe()` ở main → `net.fetch` → ghi đĩa → đối chiếu sha256 → ghi dấu
 * mốc. Kiểm bằng cách gọi thẳng hàm trong main thì sẽ bỏ qua đúng những chỗ hay
 * hỏng nhất: hợp đồng kênh IPC, và chốt `isTrustedSender`.
 */
console.log('\nBộ tải (qua IPC thật, máy chủ cục bộ):');

if (!trangApp) {
  check('có renderer chính để gọi IPC tải', false);
} else {
  await trangApp.evaluate(() => window.cuongthai.sanChoi.xoa());

  const ketQuaTai = await trangApp.evaluate(
    () =>
      new Promise((res) => {
        const het = setTimeout(() => res({ loi: 'HET_GIO sau 240 giây' }), 240000);
        const thoi = window.cuongthai.on('sanChoi:tienDo', (t) => {
          if (!t.xong) return;
          clearTimeout(het);
          thoi();
          res(t);
        });
        void window.cuongthai.sanChoi.tai();
      }),
  );

  check('tải xong không lỗi', !ketQuaTai.loi, ketQuaTai.loi ?? '');
  check(
    'đủ 891 tệp',
    ketQuaTai.soFileXong === thongTin.count,
    `${ketQuaTai.soFileXong}/${thongTin.count}`,
  );

  const sau = await trangApp.evaluate(() => window.cuongthai.sanChoi.trangThai());
  check('trạng thái chuyển sang sẵn sàng', sau.sanSang === true);
  check('không còn tệp thiếu', sau.soFileThieu === 0, `thiếu ${sau.soFileThieu}`);

  // Một tệp thế giới giờ phải phục vụ được qua protocol — trước khi tải thì nó 404.
  const sauKhiTai = await app.evaluate(async ({ net }) => {
    const r = await net.fetch('app://playground/ui/close.svg').catch(() => null);
    return r ? r.status : 0;
  });
  check(
    'tệp thế giới vừa tải phục vụ được qua app://playground',
    sauKhiTai === 200,
    `status=${sauKhiTai}`,
  );

  await trangApp.evaluate(() => window.cuongthai.sanChoi.xoa());
}

mayChu.close();
await app.close();

console.log(
  hong === 0
    ? '\n\x1b[32mTất cả đều đạt.\x1b[0m\n'
    : `\n\x1b[31m${hong} phép kiểm HỎNG.\x1b[0m\n`,
);
process.exit(hong === 0 ? 0 : 1);
