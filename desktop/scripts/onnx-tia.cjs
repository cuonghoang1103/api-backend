/**
 * afterPack — tỉa nhị phân ONNX của những nền KHÔNG phải nền đang dựng, rồi
 * ĐÒI thấy nhị phân của nền đang dựng.
 *
 * ─── Vì sao gói này cần được tỉa ───
 * `onnxruntime-node` gói nhị phân cho MỌI nền trong cùng một gói npm: 284 MB
 * cho năm cặp nền × kiến trúc, mà một bản cài chỉ dùng đúng một cặp. Không tỉa
 * thì bản cài macOS cõng theo cả nhị phân Windows lẫn Linux.
 *
 *   darwin/arm64  84 MB      win32/x64  64 MB      linux/x64   44 MB
 *   win32/arm64   69 MB      linux/arm64 24 MB
 *
 * ─── Vì sao tỉa ở đây chứ không bằng mẫu lọc trong `files` ───
 * Viết được, nhưng nó dựa vào cách electron-builder khai triển macro
 * `${platform}`/`${arch}` bên trong mẫu loại trừ, và vào thứ tự áp mẫu. Đặt
 * sai một dấu là loại nhầm nhị phân CẦN GIỮ — mà hậu quả không hiện ra lúc
 * dựng: bản cài vẫn xanh, vẫn cài được, và Xưởng Remix báo "chưa cài được
 * onnxruntime-node" trên máy người dùng. Ở đây thì việc tỉa là mã đọc được,
 * in ra thứ nó xoá, và chốt lại bằng một phép kiểm ngay sau đó.
 *
 * Cùng bài học đã ghi trong CLAUDE.md: *build xanh không có nghĩa là ảnh chạy
 * được* (18/08/2026, ảnh musl mang engine Prisma glibc — xanh cả ba bước rồi
 * chết 502 bảy phút). Chốt kiểm phải nằm TRƯỚC lúc phát hành.
 */
const fs = require('node:fs');
const path = require('node:path');

/** Bảng `Arch` của electron-builder — nó truyền số, không truyền chữ. */
const TEN_ARCH = { 0: 'ia32', 1: 'x64', 2: 'armv7l', 3: 'arm64', 4: 'universal' };

/** Dung lượng một cây thư mục, byte. */
function coCay(duong) {
  let tong = 0;
  for (const m of fs.readdirSync(duong, { withFileTypes: true })) {
    const d = path.join(duong, m.name);
    tong += m.isDirectory() ? coCay(d) : fs.statSync(d).size;
  }
  return tong;
}

const MB = (b) => `${(b / 1024 / 1024).toFixed(0)} MB`;

exports.default = async function onnxTia(context) {
  const nen = context.electronPlatformName;                 // darwin | win32 | linux
  const arch = TEN_ARCH[context.arch] ?? String(context.arch);

  /* macOS gói app thành một thư mục .app; hai nền kia để thẳng trong
     `resources`. Sai đường ở đây thì script không thấy gì và im lặng cho qua —
     nên bên dưới, "không thấy gì" là một LỖI, không phải một trường hợp bỏ qua. */
  const goc = nen === 'darwin'
    ? path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`,
                'Contents', 'Resources', 'app.asar.unpacked')
    : path.join(context.appOutDir, 'resources', 'app.asar.unpacked');

  const binOnnx = path.join(goc, 'node_modules', 'onnxruntime-node', 'bin');

  if (!fs.existsSync(binOnnx)) {
    throw new Error(
      `Không thấy nhị phân onnxruntime-node ở ${binOnnx}.\n`
      + 'Nghĩa là `asarUnpack` trong electron-builder.yml không còn khớp, hoặc gói '
      + 'đã bị loại khỏi `dependencies`. Bản cài dựng ra sẽ KHÔNG tách stem được, '
      + 'và nó sẽ không báo lỗi cho tới khi người dùng bấm nút.',
    );
  }

  /* Giữ đúng một cặp nền × kiến trúc. Bản `universal` của macOS chứa cả hai
     kiến trúc trong một tệp nên phải giữ cả hai — dự án này không dựng bản đó,
     nhưng nếu có ai bật lên thì thà giữ thừa còn hơn tỉa nhầm. */
  const archGiu = arch === 'universal' ? ['x64', 'arm64'] : [arch];
  let daXoa = 0;
  const giuLai = [];

  for (const napi of fs.readdirSync(binOnnx)) {              // napi-v6, …
    const dNapi = path.join(binOnnx, napi);
    if (!fs.statSync(dNapi).isDirectory()) continue;

    for (const tenNen of fs.readdirSync(dNapi)) {
      const dNen = path.join(dNapi, tenNen);
      if (!fs.statSync(dNen).isDirectory()) continue;

      if (tenNen !== nen) {
        daXoa += coCay(dNen);
        fs.rmSync(dNen, { recursive: true, force: true });
        continue;
      }

      for (const tenArch of fs.readdirSync(dNen)) {
        const dArch = path.join(dNen, tenArch);
        if (!fs.statSync(dArch).isDirectory()) continue;
        if (archGiu.includes(tenArch)) { giuLai.push(`${napi}/${tenNen}/${tenArch}`); continue; }
        daXoa += coCay(dArch);
        fs.rmSync(dArch, { recursive: true, force: true });
      }
    }
  }

  const conLai = fs.existsSync(binOnnx) ? coCay(binOnnx) : 0;
  console.log(`\n  → ONNX: tỉa ${MB(daXoa)} nhị phân của nền khác, giữ ${MB(conLai)}.`);

  if (giuLai.length === 0) {
    /* KHÔNG ném lỗi. `onnxruntime-node` 1.29 không còn nhị phân cho macOS
       Intel (`darwin/x64`) — đó là chuyện của thượng nguồn, không phải cấu
       hình sai, và chặn cả bản dựng vì nó thì tệ hơn: app đã lùi êm (nạp lười,
       báo một câu đọc được, mọi tính năng khác chạy bình thường).
       Nhưng nó phải NÓI RA, to, mỗi lần dựng. */
    console.log(
      `  ⚠️  KHÔNG có nhị phân ONNX cho ${nen}/${arch} trong gói này.\n`
      + '      Bản cài đó sẽ chạy đủ mọi thứ TRỪ tách stem, và Xưởng Remix sẽ\n'
      + '      báo "chưa cài được onnxruntime-node" khi người dùng bấm Tách.\n',
    );
    return;
  }

  /* Có thư mục chưa đủ — phải có tệp `.node` thật trong đó. */
  for (const nhanh of giuLai) {
    const d = path.join(binOnnx, nhanh);
    const co = fs.readdirSync(d).some((t) => t.endsWith('.node'));
    if (!co) {
      throw new Error(
        `Thư mục ${nhanh} có mặt nhưng KHÔNG chứa tệp .node nào. `
        + 'Nhị phân đã bị mẫu lọc nào đó gạt ra — bản cài sẽ không tách stem được.',
      );
    }
  }
  console.log(`  ✅ ONNX: ${giuLai.join(', ')} — có nhị phân.\n`);
};
