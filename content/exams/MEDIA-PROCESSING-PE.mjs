/**
 * Media Processing — Practical Exam (PE): 5 câu thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/media-processing/s00…s10`. Khác đề FE
 * (50 câu trắc nghiệm, đọc số đo), đề này bắt VIẾT HIỆN VẬT: một hàm tối ưu ảnh
 * chịu được ảnh xoay EXIF, ảnh động và một quả bom giải nén; một đường ống chảy
 * dòng không gom file nào vào RAM; một bộ dựng argv cho ffmpeg; một chốt chặn
 * nhận-hay-từ-chối đầu vào thù địch; và một bộ chẩn đoán đọc thuộc tính của
 * HIỆN VẬT thay vì đọc mã.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * sharp 0.35.4 / libvips 8.18.6 (aom 3.15.0, webp 1.6.0, mozjpeg 0826579) /
 * ffmpeg 8.1.2 + ffprobe 8.1.2 (Homebrew, libx264 + libopus + libmp3lame) /
 * Node v22.21.0 / darwin-arm64 (macOS 26.6.2, 10 nhân, sharp.concurrency() = 8):
 *
 *   • Q1: chạy trên tám file mẫu TỰ SINH — bốn bản của một ảnh 4032×3024
 *     (mandelbrot + noise của lavfi) mang EXIF Orientation 1/3/6/8, một GIF động
 *     48 frame 480×270 từ `testsrc`, một PNG một màu 16000×16000 (776.180 B),
 *     một avatar PNG 400×400 và một JPEG 5.871 byte vốn đã tối ưu. Mọi dòng
 *     trong "kết quả mong đợi" là nguyên văn máy in ra, chạy lại ba lượt cho
 *     cùng kết quả. **Chính lời giải mẫu đã bị phép chạy này bắt lỗi một lần**:
 *     bản đầu nhân `meta.height` với `pages`, mà khi nạp `animated: true` thì
 *     `meta.height` ĐÃ LÀ chiều cao cả dải (12.960 với GIF trên), nên nó đếm
 *     thừa 48 lần và từ chối một GIF hợp lệ với "299MP". Chiều cao mỗi frame
 *     nằm ở `pageHeight` — đọc mã không ra, chạy mới ra.
 *   • Q2: chạy ba lượt, stdout giống nhau từng byte. Bốn dòng output lần lượt
 *     chứng minh: nguồn ảnh đi qua 73 mẩu (chảy dòng thật, không gom cả file),
 *     PCM ra đúng 256.662 byte (8,0 s × 16000 × 2 × 1 = 256.000 cộng đệm rìa
 *     của bộ giải mã), `stderr` được rút cạn nên đếm được 0 byte, và cái hạn
 *     giờ nổ thật bằng SIGKILL.
 *   • Q3: bốn mảng argv mà lời giải in ra đã được ĐEM CHẠY THẬT bằng
 *     `execFileSync`/`spawnSync` trên một MP4 720p 10 giây: THUMB đọc từ
 *     `pipe:0` trả 62.806 byte JPEG với stderr rỗng, RUNG 360p ra 427.808 byte
 *     mà `ffprobe` xác nhận `640,360,yuv420p`, HLS sinh đúng 5 segment, COPY ra
 *     3.645.995 byte.
 *   • Q4: chạy hai lượt, `md5` của stdout giống hệt nhau.
 *   • Q5: chạy ba lượt, `md5` của stdout giống hệt nhau.
 *
 * ⚠️ VÌ SAO Q1 VÀ Q2 CÓ `khongChayDuoc`, CÒN Q3–Q5 THÌ KHÔNG.
 * `scripts/exam-check.mjs` chạy lời giải trong một thư mục tạm KHÔNG có
 * `node_modules` và không có file mẫu nào. Đo thật: `require('sharp')` ở đó trả
 * `MODULE_NOT_FOUND: Cannot find module 'sharp'`. Q1 và Q2 vì thế không tự chứa
 * — Q2 còn cần cả nhị phân `ffmpeg` lẫn hai file mẫu — nên chúng khai lý do
 * bằng chữ, bộ kiểm in một dòng `ℹ` và vẫn kiểm trọn phần cấu trúc. Q3, Q4 và
 * Q5 được viết CỐ Ý để không phụ thuộc gì ngoài Node: chúng đọc stdin, chỉ dùng
 * `node:fs`, và **bộ kiểm CHẠY THẬT chúng rồi so từng dòng với
 * `expectedOutput`** — đó là lý do ba câu ấy không khai và không được khai
 * `khongChayDuoc`.
 *
 * ⚠️ HAI CHỖ GIÁO TRÌNH KHÁC MÁY, đề theo MÁY (chi tiết trong
 * MEDIA-PROCESSING-FE.mjs):
 *   • Bài 1.4 nói thứ tự `.resize()` ↔ `.rotate()` đổi kết quả. Trên sharp
 *     0.35.4 cả hai thứ tự đều ra 1200×1600 — `.rotate()` không tham số là cờ
 *     LÚC NẠP. Rubric Q1 vì thế chấm việc GỌI nó, không chấm vị trí.
 *   • Bài 2.2 nói `height` lệch tỉ lệ "ép dẹp" các frame. Đo thật nó CẮT dải và
 *     làm MẤT frame (`resize({width:240,height:60})` → `pages=2`). Kết luận
 *     "resize chỉ theo width" giữ nguyên; lời giải mẫu ghi cơ chế đo được.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MEDIA-PROCESSING-PE.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/media-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const FIXTURES =
  '# Sinh TOAN BO file mau — khong dung anh/video that cua du an.\n' +
  'mkdir -p fixtures && cd fixtures\n' +
  '\n' +
  '# 1) Anh "chup" 4032x3024 (mandelbrot + nhieu, nen giong anh that).\n' +
  'ffmpeg -y -f lavfi -i "mandelbrot=size=4032x3024:maxiter=2000:start_scale=0.0005" \\\n' +
  '  -frames:v 1 -vf "noise=alls=24:allf=t+u" -q:v 6 photo-4032x3024.jpg\n' +
  '\n' +
  '# 2) Bon ban sao mang EXIF Orientation 1 / 3 / 6 / 8.\n' +
  'node -e "const s=require(\'sharp\'),f=require(\'fs\');(async()=>{const b=f.readFileSync(\'photo-4032x3024.jpg\');\n' +
  'for(const o of [1,3,6,8]) f.writeFileSync(\'photo-orient-\'+o+\'.jpg\',\n' +
  '  await s(b).withMetadata({orientation:o}).jpeg({quality:88}).toBuffer());})()"\n' +
  '\n' +
  '# 3) Avatar 400x400, "qua bom" mot mau 16000x16000, va mot file rong.\n' +
  'node -e "const s=require(\'sharp\'),f=require(\'fs\');(async()=>{\n' +
  'f.writeFileSync(\'avatar-400.png\', await s({create:{width:400,height:400,channels:3,background:\'#3a6ea5\'}})\n' +
  '  .composite([{input:Buffer.from(\'<svg width=\\"400\\" height=\\"400\\"><circle cx=\\"200\\" cy=\\"170\\" r=\\"90\\" fill=\\"#ffd7a8\\"/></svg>\')}]).png().toBuffer());\n' +
  'f.writeFileSync(\'bomb-16000.png\', await s({create:{width:16000,height:16000,channels:3,background:\'#ffffff\'}})\n' +
  '  .png({compressionLevel:9}).toBuffer());\n' +
  'f.writeFileSync(\'rong.png\', Buffer.alloc(0));})()"\n' +
  '\n' +
  '# 4) JPEG nho von DA toi uu — de bat truong hop re-encode ra TO HON.\n' +
  'ffmpeg -y -f lavfi -i "mandelbrot=size=320x240" -frames:v 1 -q:v 20 already-small.jpg\n' +
  '\n' +
  '# 5) GIF dong 48 frame 480x270.\n' +
  'ffmpeg -y -f lavfi -i "testsrc=size=480x270:rate=24:duration=2" \\\n' +
  '  -vf "split[a][b];[a]palettegen[p];[b][p]paletteuse" anim-48f.gif\n' +
  '\n' +
  '# 6) Clip 10 s 720p (H.264 + AAC, yuv420p) va mot MP3 nho tieng 8 s.\n' +
  'ffmpeg -y -f lavfi -i "testsrc2=size=1280x720:rate=30:duration=10" \\\n' +
  '  -f lavfi -i "sine=frequency=440:sample_rate=48000:duration=10" \\\n' +
  '  -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 128k clip-10s-720p.mp4\n' +
  'ffmpeg -y -f lavfi -i "sine=frequency=300:sample_rate=44100:duration=8" \\\n' +
  '  -af volume=-20dB -c:a libmp3lame -b:a 192k quiet.mp3';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Make a scratch Node project — <code>npm init -y &amp;&amp; npm i sharp</code> — and have <code>ffmpeg</code> and <code>ffprobe</code> on your <code>PATH</code>. Every reference answer was produced on <b>sharp 0.35.4 / libvips 8.18.6</b> and <b>ffmpeg 8.1.2</b> under <b>Node 22</b>; a different sharp major will change what <code>metadata()</code> returns.</li>' +
  '<li><b>Generate your own fixtures. Do not use real project media.</b> The commands are in the fixtures block below and they need nothing but ffmpeg and sharp. Q1 and Q2 are graded against those exact files, so generate them verbatim.</li>' +
  '<li>Create five folders named <code>Q1 … Q5</code>. Each question names the exact file it wants inside its folder and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. Q3, Q4 and Q5 read their input on <b>stdin</b> and print to stdout; run them as <code>node Q3/lenh-ffmpeg.js &lt; input.txt</code> and diff against the expected block line by line.</li>' +
  '<li><b>Run everything before you submit.</b> Every question is checkable with the commands printed in its "expected output" block. A pipeline that has never been pointed at a sideways photo and a function whose output has never been re-probed are not answers — this whole course is about failures that return success.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first, and behaviour here means a property measured on the <em>artifact you produced</em>, not the fact that your function returned. But this is a media exam, so the <b>shape</b> of the work is graded too: a guard order that decodes before it checks, a pixel budget that ignores frame count, a <code>height</code> passed to an animated resize, a shell string where an argv array belongs, an un-drained <code>stderr</code>, a temp file that survives the error path, or a variant generated larger than its source all cost marks <em>even when the output looks right</em>.</p>' +
  '<p><b>The fixtures.</b></p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Dựng một dự án Node nháp — <code>npm init -y &amp;&amp; npm i sharp</code> — và có sẵn <code>ffmpeg</code> cùng <code>ffprobe</code> trong <code>PATH</code>. Mọi đáp án mẫu được tạo trên <b>sharp 0.35.4 / libvips 8.18.6</b> và <b>ffmpeg 8.1.2</b> dưới <b>Node 22</b>; một bản sharp khác phiên bản lớn sẽ đổi cả những gì <code>metadata()</code> trả về.</li>' +
  '<li><b>Tự sinh file mẫu của bạn. ĐỪNG dùng media thật của dự án.</b> Các câu lệnh nằm ở khối file mẫu bên dưới và chúng không cần gì ngoài ffmpeg với sharp. Q1 và Q2 được chấm trên đúng những file đó, nên hãy sinh chúng nguyên văn.</li>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code>. Mỗi câu ghi rõ file nào phải nằm trong thư mục của nó và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Q3, Q4 và Q5 đọc đầu vào từ <b>stdin</b> rồi in ra stdout; hãy chạy chúng kiểu <code>node Q3/lenh-ffmpeg.js &lt; input.txt</code> rồi đối chiếu với khối kết quả mong đợi theo từng dòng.</li>' +
  '<li><b>Chạy thử mọi thứ trước khi nộp.</b> Mọi câu đều kiểm được bằng đúng những câu lệnh in trong khối "kết quả mong đợi" của nó. Một pipeline chưa từng được chĩa vào một tấm ảnh nằm nghiêng và một hàm mà output chưa từng được probe lại thì chưa phải lời giải — cả khoá này nói về những kiểu hỏng TRẢ VỀ THÀNH CÔNG.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước, và hành vi ở đây nghĩa là một thuộc tính ĐO ĐƯỢC TRÊN HIỆN VẬT bạn sinh ra, không phải việc hàm của bạn đã trả về. Nhưng đây là bài thi media, nên <b>hình dạng</b> của công việc cũng bị chấm: một thứ tự chốt chặn giải mã trước khi kiểm, một ngân sách pixel bỏ quên số frame, một <code>height</code> truyền vào lượt resize ảnh động, một chuỗi shell ở chỗ đáng lẽ là mảng argv, một <code>stderr</code> không được rút cạn, một file tạm sống sót qua nhánh lỗi, hay một variant sinh ra to hơn nguồn của nó — tất cả đều bị trừ điểm <em>ngay cả khi output nhìn thì đúng</em>.</p>' +
  '<p><b>File mẫu.</b></p>' +
  '</div>' +
  code(FIXTURES);
const Q1_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q1/toi-uu-anh.js\n' +
  'const sharp = require(\'sharp\');\n' +
  'const { readFileSync } = require(\'node:fs\');\n' +
  '\n' +
  'const MAX_INPUT_PIXELS = 100_000_000;\n' +
  'const MAX_WIDTH = 1200;\n' +
  'const WEBP_QUALITY = 80;\n' +
  '\n' +
  'class LoiToiUuAnh extends Error {\n' +
  '  constructor(message, code) { super(message); this.name = \'LoiToiUuAnh\'; this.code = code; }\n' +
  '}\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const FILES = process.argv.slice(2);\n' +
  '(async () => {\n' +
  '  for (const f of FILES) {\n' +
  '    try {\n' +
  '      const r = await toiUuAnh(readFileSync(f));\n' +
  '      console.log(\n' +
  '        `${f.replace(/^.*\\//, \'\')} OK ${r.dinhDang} ${r.rong}x${r.cao} trang=${r.trang} ` +\n' +
  '        `${r.byteVao}->${r.byteRa} tiLe=${(r.byteRa / r.byteVao).toFixed(3)} giuGoc=${r.giuGoc}`,\n' +
  '      );\n' +
  '    } catch (e) {\n' +
  '      console.log(`${f.replace(/^.*\\//, \'\')} LOI ${e.code} ${e.message}`);\n' +
  '    }\n' +
  '  }\n' +
  '})();';

const Q1_SOLUTION =
  'async function toiUuAnh(vao) {\n' +
  '  if (!vao || vao.length === 0) throw new LoiToiUuAnh(\'File rong\', \'EMPTY_FILE\');\n' +
  '\n' +
  '  // Lượt đọc header ĐẦU TIÊN chỉ để biết có bao nhiêu trang. Nó tốn ~0,4 ms\n' +
  '  // trên ảnh 12 MP và ~0,8 ms trên quả bom 256 MP — rẻ hơn một lượt giải mã\n' +
  '  // khoảng 250 lần — nên trả nó hai lần vẫn rẻ hơn đoán sai một lần.\n' +
  '  let soTrang = 1;\n' +
  '  try {\n' +
  '    const m0 = await sharp(vao, { limitInputPixels: MAX_INPUT_PIXELS }).metadata();\n' +
  '    soTrang = m0.pages ?? 1;\n' +
  '  } catch (err) {\n' +
  '    if (/pixel limit/i.test(err?.message ?? \'\')) {\n' +
  '      throw new LoiToiUuAnh(`Anh qua lon (toi da ${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)`, \'TOO_MANY_PIXELS\');\n' +
  '    }\n' +
  '    throw new LoiToiUuAnh(`Sharp khong doc duoc: ${err?.message ?? \'khong ro\'}`, \'DECODE_FAILED\');\n' +
  '  }\n' +
  '\n' +
  '  // `animated` là tuỳ chọn LÚC NẠP, phải nằm trên constructor. Đặt nó lên\n' +
  '  // `.webp()` thì tới lúc đó trong pipeline chỉ còn một frame để encode.\n' +
  '  const dong = soTrang > 1;\n' +
  '  const pipeline = sharp(vao, {\n' +
  '    limitInputPixels: MAX_INPUT_PIXELS,\n' +
  '    failOn: \'none\',\n' +
  '    animated: dong,\n' +
  '  });\n' +
  '\n' +
  '  let meta;\n' +
  '  try {\n' +
  '    meta = await pipeline.metadata();\n' +
  '  } catch (err) {\n' +
  '    if (/pixel limit/i.test(err?.message ?? \'\')) {\n' +
  '      throw new LoiToiUuAnh(`Anh qua lon (toi da ${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)`, \'TOO_MANY_PIXELS\');\n' +
  '    }\n' +
  '    throw new LoiToiUuAnh(`Sharp khong doc duoc: ${err?.message ?? \'khong ro\'}`, \'DECODE_FAILED\');\n' +
  '  }\n' +
  '\n' +
  '  if (!meta.width || !meta.height) {\n' +
  '    throw new LoiToiUuAnh(\'Anh khong co kich thuoc — co the hong hoac cat cut\', \'NO_DIMENSIONS\');\n' +
  '  }\n' +
  '\n' +
  '  // Ngân sách pixel phải tính CẢ SỐ TRANG, nhưng cẩn thận với chiều cao:\n' +
  '  // khi nạp `animated: true` thì `meta.height` ĐÃ LÀ chiều cao cả dải\n' +
  '  // (đo thật: GIF 480×270 48 frame báo height=12960, pageHeight=270), nên\n' +
  '  // nhân thêm `pages` một lần nữa là đếm thừa đúng 48 lần. Chiều cao MỖI\n' +
  '  // FRAME nằm ở `pageHeight`.\n' +
  '  const caoMoiTrang = meta.pageHeight ?? meta.height;\n' +
  '  const pixel = meta.width * caoMoiTrang * soTrang;\n' +
  '  if (pixel > MAX_INPUT_PIXELS) {\n' +
  '    throw new LoiToiUuAnh(\n' +
  '      `Anh qua lon: ${meta.width}x${meta.height} x ${soTrang} trang = ${Math.round(pixel / 1e6)}MP`,\n' +
  '      \'TOO_MANY_PIXELS\',\n' +
  '    );\n' +
  '  }\n' +
  '\n' +
  '  let p = pipeline;\n' +
  '  // Ảnh động: CHỈ resize theo width. Truyền thêm `height` lệch tỉ lệ thì\n' +
  '  // `fit:\'cover\'` mặc định CẮT cái dải cao và frame biến mất — đo thật:\n' +
  '  // resize({width:240,height:60}) trên GIF 48 frame trả về pages=2.\n' +
  '  if (meta.width > MAX_WIDTH) {\n' +
  '    p = p.resize({ width: MAX_WIDTH, withoutEnlargement: true });\n' +
  '  }\n' +
  '  // `.rotate()` KHÔNG tham số: đọc thẻ EXIF của chính file và áp vào pixel.\n' +
  '  // `.rotate(90)` là xoay mọi file 90°, tức làm hỏng ~55% vốn đã đúng.\n' +
  '  p = p.rotate();\n' +
  '\n' +
  '  const tuyChonWebp = { quality: WEBP_QUALITY, effort: 4 };\n' +
  '  if (dong) {\n' +
  '    // Giữ nhịp và số vòng lặp của nguồn, không thì một GIF soạn để phát hai\n' +
  '    // lần trở thành vòng lặp vô hạn ở nhịp mặc định.\n' +
  '    tuyChonWebp.loop = meta.loop ?? 0;\n' +
  '    if (meta.delay) tuyChonWebp.delay = meta.delay;\n' +
  '  }\n' +
  '\n' +
  '  let ra;\n' +
  '  try {\n' +
  '    ra = await p.webp(tuyChonWebp).toBuffer({ resolveWithObject: true });\n' +
  '  } catch (err) {\n' +
  '    throw new LoiToiUuAnh(`Encode that bai: ${err?.message ?? \'khong ro\'}`, \'ENCODE_FAILED\');\n' +
  '  }\n' +
  '\n' +
  '  // Encode lại một nguồn nhỏ vốn đã nén thì vừa TO HƠN vừa TỆ HƠN — đo thật\n' +
  '  // trên một JPEG 5.871 byte: WebP ra 7.288 byte, tỉ lệ 1,241. Giữ bản gốc.\n' +
  '  if (ra.data.length >= vao.length) {\n' +
  '    return {\n' +
  '      dinhDang: meta.format, giuGoc: true,\n' +
  '      rong: meta.autoOrient?.width ?? meta.width,\n' +
  '      cao: meta.autoOrient?.height ?? caoMoiTrang,\n' +
  '      trang: soTrang, byteVao: vao.length, byteRa: vao.length,\n' +
  '    };\n' +
  '  }\n' +
  '\n' +
  '  return {\n' +
  '    dinhDang: \'webp\', giuGoc: false,\n' +
  '    // Kích thước LẤY TỪ OUTPUT: `info` là sau-xoay và sau-resize, còn\n' +
  '    // `metadata().width` là kích thước pixel đã lưu, trước khi xoay.\n' +
  '    rong: ra.info.width,\n' +
  '    cao: dong ? ra.info.pageHeight ?? ra.info.height : ra.info.height,\n' +
  '    trang: ra.info.pages ?? 1,\n' +
  '    byteVao: vao.length, byteRa: ra.data.length,\n' +
  '  };\n' +
  '}';

const Q2_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q2/chay-dong.js\n' +
  'const sharp = require(\'sharp\');\n' +
  'const { spawn } = require(\'node:child_process\');\n' +
  'const { createReadStream, createWriteStream, statSync } = require(\'node:fs\');\n' +
  'const { pipeline } = require(\'node:stream/promises\');\n' +
  'const { Transform } = require(\'node:stream\');\n' +
  '\n' +
  'const FFMPEG = process.env.FFMPEG_PATH || \'ffmpeg\';\n' +
  'const PCM_SAMPLE_RATE = 16_000;\n' +
  '\n' +
  '/** Đếm byte đi qua mà KHÔNG giữ lại — dùng để chứng minh không có ai gom cả file. */\n' +
  'function demByte(thu) {\n' +
  '  return new Transform({\n' +
  '    transform(c, _e, cb) { thu.byte += c.length; thu.mau++; cb(null, c); },\n' +
  '  });\n' +
  '}\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '(async () => {\n' +
  '  const a = await anhChayDong(process.argv[2], \'/tmp/q2-out.webp\');\n' +
  '  console.log(`ANH vao=${a.vaoByte}B/${a.vaoMau}mau ra=${a.raByte}B/${a.raMau}mau tren-dia=${statSync(\'/tmp/q2-out.webp\').size}`);\n' +
  '  const b = await giaiMaAmThanh(process.argv[3]);\n' +
  '  console.log(`AMTHANH pcm=${b.pcmByte} stderr=${b.stderrByte}`);\n' +
  '  try {\n' +
  '    await giaiMaAmThanh(process.argv[3], { hanMs: 1 });\n' +
  '    console.log(\'QUAHAN khong nem loi\');\n' +
  '  } catch (e) { console.log(`QUAHAN ${e.message}`); }\n' +
  '  try {\n' +
  '    const cu = process.env.FFMPEG_PATH; process.env.FFMPEG_PATH = \'ffmpeg-khong-ton-tai\';\n' +
  '    delete require.cache[require.resolve(\'./q2.cjs\')];\n' +
  '    await new Promise((res) => {\n' +
  '      const p = spawn(\'ffmpeg-khong-ton-tai\', []);\n' +
  '      p.on(\'error\', (e) => { console.log(`THIEUCONGCU code=${e.code}`); res(); });\n' +
  '    });\n' +
  '    process.env.FFMPEG_PATH = cu;\n' +
  '  } catch { /* noop */ }\n' +
  '})();';

const Q2_SOLUTION =
  '/**\n' +
  ' * Ảnh: đĩa → sharp → đĩa, KHÔNG có `toBuffer()` nào. `sharp()` không tham số\n' +
  ' * vừa là Writable vừa là Readable, nên nó nối thẳng vào giữa hai stream và\n' +
  ' * libvips chảy theo dải ngang; đỉnh bộ nhớ là vài trăm hàng chứ không phải\n' +
  ' * `rong × cao × kenh` của cả ảnh.\n' +
  ' */\n' +
  'async function anhChayDong(duongVao, duongRa, maxWidth = 1200) {\n' +
  '  const vao = { byte: 0, mau: 0 };\n' +
  '  const ra = { byte: 0, mau: 0 };\n' +
  '  const bien = sharp()\n' +
  '    .resize({ width: maxWidth, withoutEnlargement: true })\n' +
  '    .rotate()\n' +
  '    .webp({ quality: 80, effort: 4 });\n' +
  '\n' +
  '  await pipeline(\n' +
  '    createReadStream(duongVao),\n' +
  '    demByte(vao),\n' +
  '    bien,\n' +
  '    demByte(ra),\n' +
  '    createWriteStream(duongRa),\n' +
  '  );\n' +
  '  return { vaoByte: vao.byte, vaoMau: vao.mau, raByte: ra.byte, raMau: ra.mau };\n' +
  '}\n' +
  '\n' +
  '/**\n' +
  ' * Âm thanh: file → ffmpeg(pipe:0) → PCM(pipe:1) → hàm gọi, không file tạm.\n' +
  ' * Bốn chi tiết bắt buộc, mỗi cái vá một kiểu hỏng riêng.\n' +
  ' */\n' +
  'function giaiMaAmThanh(duongVao, { sampleRate = PCM_SAMPLE_RATE, hanMs = 15_000 } = {}) {\n' +
  '  return new Promise((resolve, reject) => {\n' +
  '    const ff = spawn(FFMPEG, [\n' +
  '      \'-hide_banner\', \'-loglevel\', \'error\',\n' +
  '      \'-i\', \'pipe:0\',\n' +
  '      \'-f\', \'s16le\', \'-acodec\', \'pcm_s16le\',\n' +
  '      \'-ac\', \'1\', \'-ar\', String(sampleRate),\n' +
  '      \'pipe:1\',\n' +
  '    ]);\n' +
  '\n' +
  '    let pcm = 0;\n' +
  '    let loi = 0;\n' +
  '    let xong = false;\n' +
  '    let bịGiết = null;\n' +
  '\n' +
  '    // (1) CHỐT MỘT LẦN. Một lượt spawn hỏng phát `error` rồi có thể phát cả\n' +
  '    //     `close`; `resolve` sau `reject` thì im lặng, nhưng vòng retry bọc\n' +
  '    //     ngoài vẫn chạy hai lần.\n' +
  '    const chot = (e, v) => {\n' +
  '      if (xong) return;\n' +
  '      xong = true;\n' +
  '      clearTimeout(dongHo);\n' +
  '      if (e) reject(e); else resolve(v);\n' +
  '    };\n' +
  '\n' +
  '    ff.stdout.on(\'data\', (c) => { pcm += c.length; });\n' +
  '    // (2) RÚT CẠN stderr. Bộ đệm pipe của hệ điều hành ~64 KB; tiến trình con\n' +
  '    //     ghi quá mức đó sẽ CHẶN NGAY TRONG LỆNH GHI và không bao giờ thoát.\n' +
  '    ff.stderr.on(\'data\', (c) => { loi += c.length; });\n' +
  '\n' +
  '    ff.on(\'error\', (e) => {\n' +
  '      // (3) Phân biệt "thiếu nhị phân" với "file hỏng": chỉ cái đầu mới đáng\n' +
  '      //     thử tiếp bằng một bộ giải mã khác.\n' +
  '      const err = new Error(`${FFMPEG} khong chay duoc: ${e.message}`);\n' +
  '      err.thieuCongCu = e.code === \'ENOENT\';\n' +
  '      chot(err);\n' +
  '    });\n' +
  '    ff.on(\'close\', (ma, tinHieu) => {\n' +
  '      if (bịGiết) return chot(new Error(`qua han ${hanMs}ms, da giet bang ${bịGiết}`));\n' +
  '      if (ma !== 0) return chot(new Error(`${FFMPEG} thoat ${ma}${tinHieu ? \'/\' + tinHieu : \'\'}`));\n' +
  '      chot(null, { pcmByte: pcm, stderrByte: loi });\n' +
  '    });\n' +
  '\n' +
  '    // (4) SIGKILL chứ không SIGTERM: một vòng lặp native đang kẹt có thể phớt\n' +
  '    //     lờ SIGTERM, mà cả điểm của cái hạn giờ là nó PHẢI nổ.\n' +
  '    const dongHo = setTimeout(() => { bịGiết = \'SIGKILL\'; ff.kill(\'SIGKILL\'); }, hanMs);\n' +
  '\n' +
  '    // Nguồn cũng chảy dòng: KHÔNG readFileSync cả file rồi mới đẩy vào stdin.\n' +
  '    createReadStream(duongVao).pipe(ff.stdin);\n' +
  '    ff.stdin.on(\'error\', () => { /* EPIPE khi con chết trước — \'close\' lo phần còn lại */ });\n' +
  '  });\n' +
  '}';

const Q3_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q3/lenh-ffmpeg.js\n' +
  'const raw = require(\'node:fs\').readFileSync(0, \'utf8\').split(\'\\n\').filter((l) => l.trim().length);\n' +
  'const BAC = [\n' +
  '  { ten: \'360p\', cao: 360, crf: 26, aBitrate: \'96k\' },\n' +
  '  { ten: \'720p\', cao: 720, crf: 23, aBitrate: \'128k\' },\n' +
  '  { ten: \'1080p\', cao: 1080, crf: 22, aBitrate: \'192k\' },\n' +
  '];\n' +
  'const HLS_GIAY = 2;\n' +
  'const nguon = raw.map((l) => {\n' +
  '  const [wh, fps, thoiLuong, cv, ca, pix, faststart] = l.trim().split(/\\s+/);\n' +
  '  const [rong, cao] = wh.split(\'x\').map(Number);\n' +
  '  return { rong, cao, fps: Number(fps), thoiLuong: Number(thoiLuong), cv, ca, pix, faststart: faststart === \'yes\' };\n' +
  '});\n' +
  'const inArgv = (nhan, argv) => console.log(nhan + \' \' + JSON.stringify(argv));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';

const Q3_SOLUTION =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q3/lenh-ffmpeg.js\n' +
  'const raw = require(\'node:fs\').readFileSync(0, \'utf8\').split(\'\\n\').filter((l) => l.trim().length);\n' +
  'const BAC = [\n' +
  '  { ten: \'360p\', cao: 360, crf: 26, aBitrate: \'96k\' },\n' +
  '  { ten: \'720p\', cao: 720, crf: 23, aBitrate: \'128k\' },\n' +
  '  { ten: \'1080p\', cao: 1080, crf: 22, aBitrate: \'192k\' },\n' +
  '];\n' +
  'const HLS_GIAY = 2;\n' +
  'const nguon = raw.map((l) => {\n' +
  '  const [wh, fps, thoiLuong, cv, ca, pix, faststart] = l.trim().split(/\\s+/);\n' +
  '  const [rong, cao] = wh.split(\'x\').map(Number);\n' +
  '  return { rong, cao, fps: Number(fps), thoiLuong: Number(thoiLuong), cv, ca, pix, faststart: faststart === \'yes\' };\n' +
  '});\n' +
  'const inArgv = (nhan, argv) => console.log(nhan + \' \' + JSON.stringify(argv));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  'const chan = (n) => (n % 2 === 0 ? n : n - 1);\n' +
  '\n' +
  'for (const s of nguon) {\n' +
  '  // 1) Thumbnail: -ss NẰM TRƯỚC -i (tua theo chỉ mục container, chi phí phẳng\n' +
  '  //    theo độ lệch). Mốc 1 s, hoặc giữa clip nếu clip ngắn hơn 2 s.\n' +
  '  const moc = s.thoiLuong >= 2 ? \'00:00:01\' : \'00:00:00\';\n' +
  '  inArgv(\'THUMB\', [\n' +
  '    \'-y\', \'-hide_banner\', \'-loglevel\', \'error\',\n' +
  '    \'-ss\', moc,\n' +
  '    \'-i\', \'pipe:0\',\n' +
  '    \'-frames:v\', \'1\',\n' +
  '    \'-q:v\', \'2\',\n' +
  '    \'-f\', \'image2\',\n' +
  '    \'pipe:1\',\n' +
  '  ]);\n' +
  '\n' +
  '  // 2) Kế hoạch: nguồn đã h264 + aac + yuv420p thì chỉ thiếu faststart ⇒ REMUX.\n' +
  '  const remuxDuoc = s.cv === \'h264\' && s.ca === \'aac\' && s.pix === \'yuv420p\';\n' +
  '  if (remuxDuoc && !s.faststart) {\n' +
  '    console.log(\'PLAN copy chi-thieu-faststart\');\n' +
  '    inArgv(\'COPY\', [\n' +
  '      \'-y\', \'-hide_banner\', \'-loglevel\', \'error\',\n' +
  '      \'-i\', \'in.mp4\',\n' +
  '      \'-c\', \'copy\',\n' +
  '      \'-movflags\', \'+faststart\',\n' +
  '      \'out.mp4\',\n' +
  '    ]);\n' +
  '  } else if (remuxDuoc && s.faststart) {\n' +
  '    console.log(\'PLAN none khong-can-dung-toi\');\n' +
  '  } else {\n' +
  '    console.log(\'PLAN reencode \' + [\n' +
  '      s.cv !== \'h264\' ? \'codec-video=\' + s.cv : null,\n' +
  '      s.ca !== \'aac\' ? \'codec-audio=\' + s.ca : null,\n' +
  '      s.pix !== \'yuv420p\' ? \'pix_fmt=\' + s.pix : null,\n' +
  '    ].filter(Boolean).join(\',\'));\n' +
  '\n' +
  '    // 3) Bậc thang: BỎ mọi bậc cao hơn nguồn — không bao giờ sinh variant to\n' +
  '    //    hơn bản gốc. Chiều cao ghi tay phải CHẴN, và -2 lo chiều còn lại.\n' +
  '    for (const b of BAC) {\n' +
  '      if (b.cao > s.cao) continue;\n' +
  '      inArgv(\'RUNG \' + b.ten, [\n' +
  '        \'-y\', \'-hide_banner\', \'-loglevel\', \'error\',\n' +
  '        \'-i\', \'in.mp4\',\n' +
  '        \'-vf\', \'scale=-2:\' + chan(b.cao),\n' +
  '        \'-c:v\', \'libx264\',\n' +
  '        \'-crf\', String(b.crf),\n' +
  '        \'-preset\', \'veryfast\',\n' +
  '        \'-pix_fmt\', \'yuv420p\',\n' +
  '        \'-c:a\', \'aac\',\n' +
  '        \'-b:a\', b.aBitrate,\n' +
  '        \'-movflags\', \'+faststart\',\n' +
  '        \'out-\' + b.ten + \'.mp4\',\n' +
  '      ]);\n' +
  '    }\n' +
  '  }\n' +
  '\n' +
  '  // 4) HLS: keyframe GHIM đúng một cái mỗi segment, nếu không các bậc trôi\n' +
  '  //    lệch nhau và một lần chuyển bản rơi vào giữa GOP.\n' +
  '  const gop = Math.round(s.fps * HLS_GIAY);\n' +
  '  inArgv(\'HLS\', [\n' +
  '    \'-y\', \'-hide_banner\', \'-loglevel\', \'error\',\n' +
  '    \'-i\', \'in.mp4\',\n' +
  '    \'-c:v\', \'libx264\', \'-crf\', \'23\', \'-preset\', \'veryfast\', \'-pix_fmt\', \'yuv420p\',\n' +
  '    \'-g\', String(gop), \'-keyint_min\', String(gop), \'-sc_threshold\', \'0\',\n' +
  '    \'-c:a\', \'aac\', \'-b:a\', \'128k\',\n' +
  '    \'-f\', \'hls\',\n' +
  '    \'-hls_time\', String(HLS_GIAY),\n' +
  '    \'-hls_playlist_type\', \'vod\',\n' +
  '    \'-hls_flags\', \'independent_segments\',\n' +
  '    \'-hls_segment_filename\', \'out/seg-%05d.ts\',\n' +
  '    \'out/index.m3u8\',\n' +
  '  ]);\n' +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';

const Q3_OUTPUT =
  'INPUT:\n' +
  '1280x720 30 120.0 h264 aac yuv420p no\n' +
  '640x360 25 8.0 h264 aac yuv444p no\n' +
  '1920x1080 30 45.0 h264 aac yuv420p yes\n' +
  'OUTPUT:\n' +
  'THUMB ["-y","-hide_banner","-loglevel","error","-ss","00:00:01","-i","pipe:0","-frames:v","1","-q:v","2","-f","image2","pipe:1"]\n' +
  'PLAN copy chi-thieu-faststart\n' +
  'COPY ["-y","-hide_banner","-loglevel","error","-i","in.mp4","-c","copy","-movflags","+faststart","out.mp4"]\n' +
  'HLS ["-y","-hide_banner","-loglevel","error","-i","in.mp4","-c:v","libx264","-crf","23","-preset","veryfast","-pix_fmt","yuv420p","-g","60","-keyint_min","60","-sc_threshold","0","-c:a","aac","-b:a","128k","-f","hls","-hls_time","2","-hls_playlist_type","vod","-hls_flags","independent_segments","-hls_segment_filename","out/seg-%05d.ts","out/index.m3u8"]\n' +
  'THUMB ["-y","-hide_banner","-loglevel","error","-ss","00:00:01","-i","pipe:0","-frames:v","1","-q:v","2","-f","image2","pipe:1"]\n' +
  'PLAN reencode pix_fmt=yuv444p\n' +
  'RUNG 360p ["-y","-hide_banner","-loglevel","error","-i","in.mp4","-vf","scale=-2:360","-c:v","libx264","-crf","26","-preset","veryfast","-pix_fmt","yuv420p","-c:a","aac","-b:a","96k","-movflags","+faststart","out-360p.mp4"]\n' +
  'HLS ["-y","-hide_banner","-loglevel","error","-i","in.mp4","-c:v","libx264","-crf","23","-preset","veryfast","-pix_fmt","yuv420p","-g","50","-keyint_min","50","-sc_threshold","0","-c:a","aac","-b:a","128k","-f","hls","-hls_time","2","-hls_playlist_type","vod","-hls_flags","independent_segments","-hls_segment_filename","out/seg-%05d.ts","out/index.m3u8"]\n' +
  'THUMB ["-y","-hide_banner","-loglevel","error","-ss","00:00:01","-i","pipe:0","-frames:v","1","-q:v","2","-f","image2","pipe:1"]\n' +
  'PLAN none khong-can-dung-toi\n' +
  'HLS ["-y","-hide_banner","-loglevel","error","-i","in.mp4","-c:v","libx264","-crf","23","-preset","veryfast","-pix_fmt","yuv420p","-g","60","-keyint_min","60","-sc_threshold","0","-c:a","aac","-b:a","128k","-f","hls","-hls_time","2","-hls_playlist_type","vod","-hls_flags","independent_segments","-hls_segment_filename","out/seg-%05d.ts","out/index.m3u8"]';

const Q4_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q4/chot-chan.js\n' +
  'const raw = require(\'node:fs\').readFileSync(0, \'utf8\').split(\'\\n\').filter((l) => l.trim().length);\n' +
  'const [MAX_PIXEL, MAX_GIAY, MAX_BYTE] = raw[0].trim().split(/\\s+/).map(Number);\n' +
  'const donHang = raw.slice(1).map((l) => {\n' +
  '  const [loai, ten, byte, rong, cao, trang, giay] = l.trim().split(/\\s+/);\n' +
  '  return { loai, ten, byte: Number(byte), rong: Number(rong), cao: Number(cao), trang: Number(trang), giay: Number(giay) };\n' +
  '});\n' +
  'const ra = (ten, quyetDinh, ma, chiTiet) => console.log([ten, quyetDinh, ma, chiTiet].join(\' \'));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';

const Q4_SOLUTION =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q4/chot-chan.js\n' +
  'const raw = require(\'node:fs\').readFileSync(0, \'utf8\').split(\'\\n\').filter((l) => l.trim().length);\n' +
  'const [MAX_PIXEL, MAX_GIAY, MAX_BYTE] = raw[0].trim().split(/\\s+/).map(Number);\n' +
  'const donHang = raw.slice(1).map((l) => {\n' +
  '  const [loai, ten, byte, rong, cao, trang, giay] = l.trim().split(/\\s+/);\n' +
  '  return { loai, ten, byte: Number(byte), rong: Number(rong), cao: Number(cao), trang: Number(trang), giay: Number(giay) };\n' +
  '});\n' +
  'const ra = (ten, quyetDinh, ma, chiTiet) => console.log([ten, quyetDinh, ma, chiTiet].join(\' \'));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '// Chi phí đo trên máy soạn đề, dùng làm hệ số ước lượng:\n' +
  '//   ảnh  12 MP → WebP q80 rộng 1200 ≈ 188 ms  ⇒ ~16 ms mỗi megapixel\n' +
  '//   video 10 s 720p, preset veryfast ≈ 437 ms ⇒ ~44 ms mỗi giây nguồn\n' +
  '//   âm thanh loudnorm hai lượt                 ⇒ ~30 ms mỗi giây nguồn\n' +
  'const MS_MOI_MP = 16;\n' +
  'const MS_MOI_GIAY_VIDEO = 44;\n' +
  'const MS_MOI_GIAY_AUDIO = 30;\n' +
  'const HANG_DOI = { image: \'anh\', video: \'video\', audio: \'am-thanh\' };\n' +
  '\n' +
  'let tongMs = 0;\n' +
  'let nhan = 0;\n' +
  'let loai = 0;\n' +
  '\n' +
  'for (const d of donHang) {\n' +
  '  const trang = Math.max(d.trang || 0, 1);\n' +
  '  // Xếp chốt chặn RẺ TRƯỚC: đọc thuộc tính → so byte → so kích thước →\n' +
  '  // ngân sách pixel → thời lượng. Một đợt yêu cầu rác vì thế gần như không\n' +
  '  // tốn gì, thay vì phải trả tiền giải mã rồi mới bị từ chối.\n' +
  '  let ma = null;\n' +
  '  let chiTiet = \'-\';\n' +
  '\n' +
  '  if (d.byte === 0) {\n' +
  '    ma = \'EMPTY_FILE\';\n' +
  '  } else if (d.byte > MAX_BYTE) {\n' +
  '    ma = \'FILE_TOO_LARGE\';\n' +
  '    chiTiet = d.byte + \'>\' + MAX_BYTE;\n' +
  '  } else if (d.loai !== \'audio\' && (d.rong === 0 || d.cao === 0)) {\n' +
  '    // Header đọc được một phần vẫn trả kích thước rỗng — file cắt cụt hoặc hỏng.\n' +
  '    ma = \'NO_DIMENSIONS\';\n' +
  '  } else if (d.loai !== \'audio\' && d.rong * d.cao * trang > MAX_PIXEL) {\n' +
  '    // ⚠️ NHÂN VỚI SỐ TRANG. Một GIF 1000×1000 là 1 MP mỗi frame và 2.000 MP\n' +
  '    // với 2.000 frame; byte thì vẫn nhỏ. Chỉ pixel mới thấy được điều đó.\n' +
  '    ma = \'TOO_MANY_PIXELS\';\n' +
  '    chiTiet = Math.round((d.rong * d.cao * trang) / 1e6) + \'MP>\' + Math.round(MAX_PIXEL / 1e6) + \'MP\';\n' +
  '  } else if (d.giay > MAX_GIAY) {\n' +
  '    ma = \'TOO_LONG\';\n' +
  '    chiTiet = d.giay + \'s>\' + MAX_GIAY + \'s\';\n' +
  '  }\n' +
  '\n' +
  '  if (ma) {\n' +
  '    loai++;\n' +
  '    ra(d.ten, \'REJECT\', ma, chiTiet);\n' +
  '    continue;\n' +
  '  }\n' +
  '\n' +
  '  const ms = d.loai === \'image\'\n' +
  '    ? Math.ceil(((d.rong * d.cao * trang) / 1e6) * MS_MOI_MP)\n' +
  '    : d.loai === \'video\'\n' +
  '      ? Math.ceil(d.giay * MS_MOI_GIAY_VIDEO)\n' +
  '      : Math.ceil(d.giay * MS_MOI_GIAY_AUDIO);\n' +
  '  tongMs += ms;\n' +
  '  nhan++;\n' +
  '  // Ảnh và video KHÔNG dùng chung hàng đợi: một video chiếm một worker lâu\n' +
  '  // bằng hàng chục tấm ảnh, nên chung hàng đợi là để một đợt video làm nghẽn\n' +
  '  // mọi lần đổi avatar.\n' +
  '  ra(d.ten, \'ACCEPT\', HANG_DOI[d.loai], ms + \'ms\');\n' +
  '}\n' +
  '\n' +
  'console.log(\'TONG nhan=\' + nhan + \' loai=\' + loai + \' cpu=\' + tongMs + \'ms\');\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';

const Q4_OUTPUT =
  'INPUT:\n' +
  '100000000 600 10485760\n' +
  'image anh-that.jpg 7857079 4032 3024 1 0\n' +
  'image bom-mot-mau.png 776180 16000 16000 1 0\n' +
  'image gif-2000-frame.gif 412000 1000 1000 2000 0\n' +
  'image cat-cut.jpg 91234 0 0 1 0\n' +
  'image avatar.png 220468 400 400 1 0\n' +
  'image rong.png 0 800 600 1 0\n' +
  'video clip-hop-le.mp4 3645995 1280 720 1 10\n' +
  'video phim-qua-dai.mp4 9000000 1920 1080 1 1800\n' +
  'video qua-nang.mp4 20971520 1920 1080 1 30\n' +
  'audio tin-nhan-thoai.opus 22542 0 0 0 8\n' +
  'audio podcast-dai.mp3 9000000 0 0 0 3600\n' +
  'OUTPUT:\n' +
  'anh-that.jpg ACCEPT anh 196ms\n' +
  'bom-mot-mau.png REJECT TOO_MANY_PIXELS 256MP>100MP\n' +
  'gif-2000-frame.gif REJECT TOO_MANY_PIXELS 2000MP>100MP\n' +
  'cat-cut.jpg REJECT NO_DIMENSIONS -\n' +
  'avatar.png ACCEPT anh 3ms\n' +
  'rong.png REJECT EMPTY_FILE -\n' +
  'clip-hop-le.mp4 ACCEPT video 440ms\n' +
  'phim-qua-dai.mp4 REJECT TOO_LONG 1800s>600s\n' +
  'qua-nang.mp4 REJECT FILE_TOO_LARGE 20971520>10485760\n' +
  'tin-nhan-thoai.opus ACCEPT am-thanh 240ms\n' +
  'podcast-dai.mp3 REJECT TOO_LONG 3600s>600s\n' +
  'TONG nhan=4 loai=7 cpu=879ms';

const Q5_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q5/chan-doan.js\n' +
  'const raw = require(\'node:fs\').readFileSync(0, \'utf8\').split(\'\\n\').filter((l) => l.trim().length);\n' +
  'const hoSo = raw.map((l) => JSON.parse(l));\n' +
  'const ra = (ten, ma, cach) => console.log([ten, ma, cach].join(\' | \'));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';

const Q5_SOLUTION =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q5/chan-doan.js\n' +
  'const raw = require(\'node:fs\').readFileSync(0, \'utf8\').split(\'\\n\').filter((l) => l.trim().length);\n' +
  'const hoSo = raw.map((l) => JSON.parse(l));\n' +
  'const ra = (ten, ma, cach) => console.log([ten, ma, cach].join(\' | \'));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '// Mỗi luật: một thuộc tính ĐO ĐƯỢC TRÊN HIỆN VẬT, không phải một suy đoán\n' +
  '// từ mã. Thứ tự là thứ tự rẻ-trước của Chương 9: hỏi file trước, rồi mới\n' +
  '// tới header và tầng phát.\n' +
  'const LUAT = [\n' +
  '  {\n' +
  '    ma: \'BOM_GIAI_NEN\',\n' +
  '    khop: (h) => h.loai === \'anh\' && h.rong * h.cao * (h.trang || 1) > 100e6,\n' +
  '    cach: \'sharp(buf, { limitInputPixels: 100e6 }) + kiem rong*cao*trang tu header truoc khi decode\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'THIEU_ROTATE\',\n' +
  '    // Pixel đã lưu là ngang, mà thẻ EXIF nói phải xoay 90° ⇒ output phải cao\n' +
  '    // hơn rộng. Không phải thì lượt encode đã làm rơi hướng xoay.\n' +
  '    khop: (h) => h.loai === \'anh\' && [5, 6, 7, 8].includes(h.orientation) && h.ra_cao <= h.ra_rong,\n' +
  '    cach: \'goi .rotate() KHONG tham so truoc khi encode, roi luu info.width/info.height cua output\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'MAT_FRAME\',\n' +
  '    khop: (h) => h.loai === \'anh\' && (h.trang || 1) > 1 && (h.ra_trang || 1) === 1,\n' +
  '    cach: \'truyen { animated: true } vao CONSTRUCTOR sharp(input, {...}), va resize chi theo width\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'RE_ENCODE_TO_HON\',\n' +
  '    khop: (h) => h.loai === \'anh\' && h.ra_byte > h.byte,\n' +
  '    cach: \'giu ban goc khi output khong nho hon, va DEM nhanh nay de biet no phat tac bao nhieu phan tram\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'PIX_FMT_KHONG_420\',\n' +
  '    khop: (h) => h.loai === \'video\' && h.pix_fmt !== \'yuv420p\',\n' +
  '    cach: \'them -pix_fmt yuv420p vao cong thuc nen; Safari/QuickTime chi giai ma duoc 4:2:0 trong H.264\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'MOOV_O_CUOI\',\n' +
  '    khop: (h) => h.loai === \'video\' && h.moov === \'cuoi\',\n' +
  '    cach: \'ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4 — remux, khong encode lai\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'LOUDNORM_KHONG_AP\',\n' +
  '    khop: (h) => h.loai === \'am-thanh\' && Math.abs(h.do_lai_lufs - h.muc_tieu_lufs) > 1,\n' +
  '    cach: \'chuoi -af phai la MOT tham so argv duy nhat; do lai OUTPUT chu dung tin ma thoat\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'THIEU_206\',\n' +
  '    khop: (h) => h.loai === \'http\' && h.co_range === true && h.status === 200,\n' +
  '    cach: \'tra 206 Partial Content kem Content-Range va Accept-Ranges: bytes, than chi chua dung lat cat\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'CACHE_LIVE_SAI\',\n' +
  '    khop: (h) => h.loai === \'hls\' && h.live === true && /immutable|max-age=(\\d{4,})/.test(h.cache_control || \'\'),\n' +
  '    cach: \'manifest live dat max-age bang mot segment; curl hai lan cach 10 s roi diff de kiem\',\n' +
  '  },\n' +
  '];\n' +
  '\n' +
  'for (const h of hoSo) {\n' +
  '  const trung = LUAT.find((l) => l.khop(h));\n' +
  '  if (trung) ra(h.ten, trung.ma, trung.cach);\n' +
  '  else ra(h.ten, \'OK\', \'khong co trieu chung nao khop\');\n' +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';

const Q5_OUTPUT =
  'INPUT:\n' +
  '{"ten":"bom.png","loai":"anh","byte":776180,"rong":16000,"cao":16000,"trang":1,"ra_byte":605}\n' +
  '{"ten":"chan-dung.jpg","loai":"anh","byte":4038620,"rong":4032,"cao":3024,"trang":1,"orientation":6,"ra_rong":1200,"ra_cao":900,"ra_byte":264000}\n' +
  '{"ten":"phan-ung.gif","loai":"anh","byte":293569,"rong":480,"cao":270,"trang":48,"orientation":1,"ra_rong":480,"ra_cao":270,"ra_trang":1,"ra_byte":3786}\n' +
  '{"ten":"da-nho-san.jpg","loai":"anh","byte":5871,"rong":320,"cao":240,"trang":1,"orientation":1,"ra_rong":320,"ra_cao":240,"ra_trang":1,"ra_byte":7288}\n' +
  '{"ten":"anh-tot.jpg","loai":"anh","byte":4038620,"rong":4032,"cao":3024,"trang":1,"orientation":6,"ra_rong":1200,"ra_cao":1600,"ra_trang":1,"ra_byte":264000}\n' +
  '{"ten":"man-hinh.mp4","loai":"video","pix_fmt":"yuv444p","moov":"dau"}\n' +
  '{"ten":"cham-khoi-dong.mp4","loai":"video","pix_fmt":"yuv420p","moov":"cuoi"}\n' +
  '{"ten":"clip-tot.mp4","loai":"video","pix_fmt":"yuv420p","moov":"dau"}\n' +
  '{"ten":"bai-hat.mp3","loai":"am-thanh","muc_tieu_lufs":-14,"do_lai_lufs":-42.1}\n' +
  '{"ten":"bai-hat-da-va.mp3","loai":"am-thanh","muc_tieu_lufs":-14,"do_lai_lufs":-14.2}\n' +
  '{"ten":"GET /media/x.mp4","loai":"http","co_range":true,"status":200}\n' +
  '{"ten":"live/index.m3u8","loai":"hls","live":true,"cache_control":"public, max-age=31536000, immutable"}\n' +
  '{"ten":"vod/index.m3u8","loai":"hls","live":false,"cache_control":"public, max-age=31536000, immutable"}\n' +
  'OUTPUT:\n' +
  'bom.png | BOM_GIAI_NEN | sharp(buf, { limitInputPixels: 100e6 }) + kiem rong*cao*trang tu header truoc khi decode\n' +
  'chan-dung.jpg | THIEU_ROTATE | goi .rotate() KHONG tham so truoc khi encode, roi luu info.width/info.height cua output\n' +
  'phan-ung.gif | MAT_FRAME | truyen { animated: true } vao CONSTRUCTOR sharp(input, {...}), va resize chi theo width\n' +
  'da-nho-san.jpg | RE_ENCODE_TO_HON | giu ban goc khi output khong nho hon, va DEM nhanh nay de biet no phat tac bao nhieu phan tram\n' +
  'anh-tot.jpg | OK | khong co trieu chung nao khop\n' +
  'man-hinh.mp4 | PIX_FMT_KHONG_420 | them -pix_fmt yuv420p vao cong thuc nen; Safari/QuickTime chi giai ma duoc 4:2:0 trong H.264\n' +
  'cham-khoi-dong.mp4 | MOOV_O_CUOI | ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4 — remux, khong encode lai\n' +
  'clip-tot.mp4 | OK | khong co trieu chung nao khop\n' +
  'bai-hat.mp3 | LOUDNORM_KHONG_AP | chuoi -af phai la MOT tham so argv duy nhat; do lai OUTPUT chu dung tin ma thoat\n' +
  'bai-hat-da-va.mp3 | OK | khong co trieu chung nao khop\n' +
  'GET /media/x.mp4 | THIEU_206 | tra 206 Partial Content kem Content-Range va Accept-Ranges: bytes, than chi chua dung lat cat\n' +
  'live/index.m3u8 | CACHE_LIVE_SAI | manifest live dat max-age bang mot segment; curl hai lan cach 10 s roi diff de kiem\n' +
  'vod/index.m3u8 | OK | khong co trieu chung nao khop';

const Q1_OUTPUT =
  '$ node q1-chay-thu.js fixtures/*.{jpg,png,gif}\n' +
  'photo-orient-1.jpg OK webp 1200x900 trang=1 4763761->268636 tiLe=0.056 giuGoc=false\n' +
  'photo-orient-6.jpg OK webp 1200x1600 trang=1 4763761->473912 tiLe=0.099 giuGoc=false\n' +
  'photo-orient-8.jpg OK webp 1200x1600 trang=1 4763761->474806 tiLe=0.100 giuGoc=false\n' +
  'anim-48f.gif OK webp 480x270 trang=48 293569->68364 tiLe=0.233 giuGoc=false\n' +
  'bomb-16000.png LOI TOO_MANY_PIXELS Anh qua lon (toi da 100MP)\n' +
  'avatar-400.png OK webp 400x400 trang=1 220468->29548 tiLe=0.134 giuGoc=false\n' +
  'already-small.jpg OK jpeg 320x240 trang=1 5871->5871 tiLe=1.000 giuGoc=true\n' +
  'rong.png LOI EMPTY_FILE File rong';

const Q2_OUTPUT =
  '$ node q2-chay-thu.js fixtures/photo-orient-6.jpg fixtures/quiet.mp3\n' +
  'ANH vao=4763761B/73mau ra=473912B/1mau tren-dia=473912\n' +
  'AMTHANH pcm=256662 stderr=0\n' +
  'QUAHAN qua han 1ms, da giet bang SIGKILL\n' +
  'THIEUCONGCU code=ENOENT';

export default {
  course: { slug: 'media-processing' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the pipeline, then prove it from the output file',
        'Thi thực hành — viết đường ống, rồi chứng minh bằng chính file xuất ra',
      ),
      description: B(
        'Five practical questions, submitted as a .zip. An image optimiser that survives EXIF rotation, animation and a decompression bomb; a streaming pipeline that never buffers a whole file; an ffmpeg argv builder covering thumbnails, a bitrate ladder and HLS; an admission gate that prices work and refuses hostile input; and a diagnostic that reads a measured property of the artifact rather than the code — chapters 1, 2, 3, 4, 5, 6, 7, 8 and 9.',
        'Năm câu thực hành, nộp dưới dạng .zip. Một bộ tối ưu ảnh sống sót qua xoay EXIF, ảnh động và một quả bom giải nén; một đường ống chảy dòng không bao giờ gom cả file vào bộ nhớ; một bộ dựng argv cho ffmpeg phủ thumbnail, bậc thang bitrate và HLS; một cổng nhận việc biết định giá và từ chối đầu vào thù địch; và một bộ chẩn đoán đọc một thuộc tính ĐO ĐƯỢC của hiện vật thay vì đọc mã — các chương 1, 2, 3, 4, 5, 6, 7, 8 và 9.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ─────────────────────────── Câu 1 ─────────────────────────── */

        codeQ({
          points: 2,
          language: 'javascript',
          khongChayDuoc: "lời giải require('sharp'), mà scripts/exam-check.mjs chạy nó trong một thư mục tạm KHÔNG có node_modules và không có file mẫu nào (đo thật: MODULE_NOT_FOUND: Cannot find module 'sharp'); đã chạy thật ngoài bộ kiểm trên tám file mẫu tự sinh, ba lượt cho stdout giống hệt nhau và khớp expectedOutput từng dòng",
          prompt: B(
            '<p><b>Q1 — One optimiser that survives everything Chapters 1 and 2 threw at it.</b> Write <code>Q1/toi-uu-anh.js</code> implementing <code>async function toiUuAnh(vao)</code>, where <code>vao</code> is a <code>Buffer</code>. It returns <code>{ dinhDang, giuGoc, rong, cao, trang, byteVao, byteRa }</code> or throws <code>LoiToiUuAnh</code> with a <code>code</code>. The starter gives you the constants, the error class and the driver that prints the expected block; write only the function.</p>' +
            '<ul>' +
            '<li><b>Guards, cheapest first.</b> Empty buffer → <code>EMPTY_FILE</code>. Then a header read: no width or height → <code>NO_DIMENSIONS</code> ("possibly corrupt or truncated" is a clearer 400 than a cryptic decode failure). Then the pixel budget → <code>TOO_MANY_PIXELS</code>. Only after all three may pixels be decoded. Reading a header costs 0.4 ms on a 12 MP photo and 0.8 ms on the 256 MP bomb; a full decode of that bomb costs 200 ms and 114 MB of RSS, so the ordering is a 250× difference in what a hostile upload costs you.</li>' +
            '<li><b>Two layers on the pixel budget, not one.</b> Pass <code>limitInputPixels</code> on the constructor <em>and</em> check the header explicitly. The option is the backstop for a header that lies and it produces a generic message; the explicit check is the fast, well-messaged path. And the budget must account for frames — but read the fixture note in the starter before you multiply, because <code>meta.height</code> does not mean what you expect once <code>animated</code> is on.</li>' +
            '<li><b>Animation must survive.</b> <code>{ animated: true }</code> goes on the <em>constructor</em>, and only when the source actually has more than one page. Preserve <code>loop</code> and <code>delay</code>. Resize animated input by width only.</li>' +
            '<li><b>Orientation must be applied, not preserved.</b> Call <code>.rotate()</code> with no arguments, and return the dimensions from the encoded output rather than from <code>metadata()</code>.</li>' +
            '<li><b>Never make a file worse.</b> Cap the width at <code>MAX_WIDTH</code> with <code>withoutEnlargement</code>, and if the WebP comes out no smaller than the source, keep the original and say so with <code>giuGoc: true</code>.</li>' +
            '</ul>' +
            '<p>Four things are graded that a function which merely runs will still get wrong: whether the guards are ordered so a bomb is refused before it is decoded, whether the pixel budget counts frames <em>correctly</em>, whether <code>animated</code> sits on the constructor, and whether the returned dimensions come from the output.</p>',

            '<p><b>Câu 1 — Một bộ tối ưu sống sót qua mọi thứ Chương 1 và 2 ném vào nó.</b> Hãy viết <code>Q1/toi-uu-anh.js</code> cài đặt <code>async function toiUuAnh(vao)</code>, với <code>vao</code> là một <code>Buffer</code>. Nó trả về <code>{ dinhDang, giuGoc, rong, cao, trang, byteVao, byteRa }</code> hoặc ném <code>LoiToiUuAnh</code> kèm một <code>code</code>. Phần khung cho sẵn các hằng số, lớp lỗi và đoạn driver in ra khối kết quả mong đợi; bạn chỉ viết cái hàm.</p>' +
            '<ul>' +
            '<li><b>Chốt chặn, rẻ trước.</b> Buffer rỗng → <code>EMPTY_FILE</code>. Rồi một lượt đọc header: không có width hay height → <code>NO_DIMENSIONS</code> ("có thể hỏng hoặc cắt cụt" là một mã 400 rõ hơn một lỗi giải mã bí ẩn). Rồi ngân sách pixel → <code>TOO_MANY_PIXELS</code>. Chỉ sau cả ba mới được giải mã pixel. Đọc một header tốn 0,4 ms trên ảnh 12 MP và 0,8 ms trên quả bom 256 MP; giải mã đầy đủ quả bom đó tốn 200 ms và 114 MB RSS, nên thứ tự này là khác biệt 250 lần trong cái giá mà một bản upload thù địch bắt bạn trả.</li>' +
            '<li><b>Ngân sách pixel HAI LỚP, không phải một.</b> Truyền <code>limitInputPixels</code> vào constructor VÀ kiểm header tường minh. Tuỳ chọn kia là lưới đỡ cho một header nói dối và nó cho thông báo chung chung; phép kiểm tường minh là đường nhanh, thông điệp rõ. Và ngân sách phải tính tới số frame — nhưng hãy đọc ghi chú về file mẫu trong phần khung TRƯỚC khi bạn nhân, vì <code>meta.height</code> không mang nghĩa bạn tưởng một khi <code>animated</code> đã bật.</li>' +
            '<li><b>Ảnh động phải sống sót.</b> <code>{ animated: true }</code> nằm trên <em>constructor</em>, và chỉ khi nguồn thật sự có hơn một trang. Giữ lại <code>loop</code> và <code>delay</code>. Resize đầu vào động chỉ theo width.</li>' +
            '<li><b>Hướng xoay phải được ÁP, không phải được GIỮ.</b> Gọi <code>.rotate()</code> không tham số, và trả kích thước lấy từ output đã encode chứ không từ <code>metadata()</code>.</li>' +
            '<li><b>Đừng bao giờ làm một file tệ đi.</b> Chặn chiều rộng ở <code>MAX_WIDTH</code> kèm <code>withoutEnlargement</code>, và nếu bản WebP ra không nhỏ hơn nguồn thì giữ bản gốc và nói ra điều đó bằng <code>giuGoc: true</code>.</li>' +
            '</ul>' +
            '<p>Có bốn thứ bị chấm mà một hàm chỉ cần chạy được vẫn sẽ làm sai: các chốt chặn có được xếp để một quả bom bị từ chối TRƯỚC khi bị giải mã không, ngân sách pixel có đếm frame ĐÚNG không, <code>animated</code> có nằm trên constructor không, và kích thước trả về có lấy từ output không.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['chotchan',
              'The guards run in cheapest-first order and produce the exact codes: <code>EMPTY_FILE</code> on a zero-byte buffer, <code>NO_DIMENSIONS</code> when the header has no size, and <code>TOO_MANY_PIXELS</code> for the 16000×16000 fixture — the last of which must be refused from the header (or by <code>limitInputPixels</code>) rather than after a full decode.',
              'Các chốt chặn chạy theo thứ tự rẻ-trước và sinh đúng những mã sau: <code>EMPTY_FILE</code> với buffer rỗng, <code>NO_DIMENSIONS</code> khi header không có kích thước, và <code>TOO_MANY_PIXELS</code> với file mẫu 16000×16000 — mà cái cuối phải bị từ chối TỪ HEADER (hoặc bởi <code>limitInputPixels</code>) chứ không phải sau một lượt giải mã đầy đủ.',
              0.5],
            ['pixel',
              'The pixel budget is enforced in both layers — <code>limitInputPixels</code> on the constructor and an explicit header check — and it accounts for frame count without double-counting the strip height, so the 48-frame GIF is accepted rather than reported as hundreds of megapixels.',
              'Ngân sách pixel được thi hành ở cả hai lớp — <code>limitInputPixels</code> trên constructor và một phép kiểm header tường minh — và nó tính tới số frame mà KHÔNG đếm trùng chiều cao của dải, nên GIF 48 frame được NHẬN chứ không bị báo thành hàng trăm megapixel.',
              0.5],
            ['xoayvadong',
              '<code>.rotate()</code> is called with no arguments so orientation 6 and 8 come back portrait (1200×1600) while orientation 1 stays landscape (1200×900); <code>{ animated: true }</code> is on the constructor so the GIF comes back with <code>trang=48</code>; and animated input is resized by width only.',
              '<code>.rotate()</code> được gọi KHÔNG tham số nên orientation 6 và 8 trở về dạng dọc (1200×1600) còn orientation 1 giữ nguyên dạng ngang (1200×900); <code>{ animated: true }</code> nằm trên constructor nên GIF trở về với <code>trang=48</code>; và đầu vào động chỉ được resize theo width.',
              0.6],
            ['khonglamte',
              '<code>withoutEnlargement</code> leaves the 400×400 avatar untouched, the returned <code>rong</code>/<code>cao</code> come from the encoded output rather than pre-rotation metadata, and the already-optimised 5,871-byte JPEG is returned with <code>giuGoc=true</code> and its own bytes instead of a larger WebP.',
              '<code>withoutEnlargement</code> để nguyên avatar 400×400, <code>rong</code>/<code>cao</code> trả về lấy từ output đã encode chứ không từ metadata trước-xoay, và file JPEG 5.871 byte vốn đã tối ưu được trả về với <code>giuGoc=true</code> cùng chính số byte của nó thay vì một bản WebP to hơn.',
              0.4],
          ]),
        }),

        /* ─────────────────────────── Câu 2 ─────────────────────────── */

        codeQ({
          points: 2,
          language: 'javascript',
          khongChayDuoc: "lời giải require('sharp') và spawn nhị phân ffmpeg trên hai file mẫu, mà scripts/exam-check.mjs chạy nó trong một thư mục tạm KHÔNG có node_modules lẫn file mẫu (đo thật: MODULE_NOT_FOUND: Cannot find module 'sharp'); đã chạy thật ngoài bộ kiểm ba lượt, stdout giống nhau từng byte và khớp expectedOutput",
          prompt: B(
            '<p><b>Q2 — Move the bytes without ever holding them (chapters 1 and 4).</b> Write <code>Q2/chay-dong.js</code> exporting two functions. Neither may call <code>toBuffer()</code> on a whole file, and neither may write a temp file.</p>' +
            '<p><b>2a — ' + c('anhChayDong(duongVao, duongRa, maxWidth = 1200)') + '.</b> Read the source from disk, transform it, and write the result to disk as one stream. <code>sharp()</code> with no argument is both a Writable and a Readable, so it drops straight into the middle of a pipe and libvips streams the work in horizontal strips — the peak memory is a few hundred rows rather than <code>width × height × channels</code> for the whole image. Apply the same width cap, <code>withoutEnlargement</code> and argument-less <code>.rotate()</code> as Q1. The starter gives you a counting <code>Transform</code>; use it on both ends so the output can prove the source really arrived in pieces.</p>' +
            '<p><b>2b — ' + c('giaiMaAmThanh(duongVao, { sampleRate, hanMs })') + '.</b> Decode an MP3 to raw 16-bit mono PCM through ffmpeg with <code>pipe:0</code> in and <code>pipe:1</code> out. Four details are each worth a mark and each fixes a different failure:</p>' +
            '<ul>' +
            '<li><b>Drain <code>stderr</code>.</b> The OS pipe buffer is about 64 KB; a child that writes past it blocks <em>inside the write call</em> waiting for a reader, never exits, and your <code>close</code> handler never fires. It presents as "ffmpeg is slow on some files" and is really "ffmpeg is chatty on some files".</li>' +
            '<li><b>Settle exactly once.</b> A failed spawn emits <code>error</code> and may emit <code>close</code> too. Resolving after rejecting is a silent no-op in a Promise, but a retry loop wrapped around it still runs twice.</li>' +
            '<li><b>Distinguish a missing binary from a bad file.</b> Only <code>ENOENT</code> is worth retrying against another decoder; a corrupt MP3 will be exactly as corrupt on the third tool.</li>' +
            '<li><b>Kill with <code>SIGKILL</code>, not <code>SIGTERM</code>.</b> A decoder wedged in a native loop can ignore <code>SIGTERM</code>, and the entire point of the deadline is that it fires.</li>' +
            '</ul>' +
            '<p>Stream the input into <code>stdin</code> as well — reading the whole file into a Buffer first defeats half the exercise.</p>',

            '<p><b>Câu 2 — Chuyển byte đi mà không bao giờ giữ chúng (chương 1 và 4).</b> Hãy viết <code>Q2/chay-dong.js</code> xuất ra hai hàm. Không hàm nào được gọi <code>toBuffer()</code> trên cả một file, và không hàm nào được ghi file tạm.</p>' +
            '<p><b>2a — ' + c('anhChayDong(duongVao, duongRa, maxWidth = 1200)') + '.</b> Đọc nguồn từ đĩa, biến đổi, rồi ghi kết quả xuống đĩa như MỘT luồng. <code>sharp()</code> không tham số vừa là Writable vừa là Readable, nên nó rơi thẳng vào giữa một đường ống và libvips chảy việc theo các dải ngang — đỉnh bộ nhớ là vài trăm hàng chứ không phải <code>rong × cao × kenh</code> của cả tấm ảnh. Áp đúng cái trần chiều rộng, <code>withoutEnlargement</code> và <code>.rotate()</code> không tham số như Q1. Phần khung cho sẵn một <code>Transform</code> biết đếm; hãy dùng nó ở cả hai đầu để output chứng minh được rằng nguồn thật sự tới theo từng mẩu.</p>' +
            '<p><b>2b — ' + c('giaiMaAmThanh(duongVao, { sampleRate, hanMs })') + '.</b> Giải mã một MP3 sang PCM 16-bit mono thô qua ffmpeg với <code>pipe:0</code> vào và <code>pipe:1</code> ra. Bốn chi tiết, mỗi cái đáng một phần điểm và mỗi cái vá một kiểu hỏng riêng:</p>' +
            '<ul>' +
            '<li><b>Rút cạn <code>stderr</code>.</b> Bộ đệm pipe của hệ điều hành khoảng 64 KB; một tiến trình con ghi quá mức đó sẽ chặn NGAY TRONG LỆNH GHI để chờ một người đọc, không bao giờ thoát, và handler <code>close</code> của bạn không bao giờ chạy. Nó hiện ra như "ffmpeg chậm với một số file" mà thật ra là "ffmpeg nói nhiều với một số file".</li>' +
            '<li><b>Chốt đúng MỘT lần.</b> Một lượt spawn hỏng phát <code>error</code> và có thể phát cả <code>close</code>. Resolve sau khi đã reject là một thao tác rỗng im lặng trong một Promise, nhưng một vòng retry bọc quanh nó thì vẫn chạy hai lần.</li>' +
            '<li><b>Phân biệt thiếu nhị phân với file hỏng.</b> Chỉ <code>ENOENT</code> mới đáng thử lại bằng một bộ giải mã khác; một file MP3 hỏng sẽ hỏng y như vậy ở công cụ thứ ba.</li>' +
            '<li><b>Giết bằng <code>SIGKILL</code>, không phải <code>SIGTERM</code>.</b> Một bộ giải mã kẹt trong vòng lặp native có thể phớt lờ <code>SIGTERM</code>, mà toàn bộ ý nghĩa của cái hạn giờ là nó PHẢI nổ.</li>' +
            '</ul>' +
            '<p>Hãy chảy dòng cả phần đầu vào vào <code>stdin</code> nữa — đọc cả file vào một Buffer trước là đã hỏng mất một nửa bài tập.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['chaydong',
              'The image path is a single stream from disk to disk with no <code>toBuffer()</code> and no temp file, and the counted input arrives in many chunks rather than one, which is what shows the source was never held whole.',
              'Đường ảnh là một luồng duy nhất từ đĩa tới đĩa, không <code>toBuffer()</code> nào và không file tạm nào, và phần đầu vào được đếm tới theo NHIỀU mẩu chứ không phải một, đó chính là thứ cho thấy nguồn chưa bao giờ bị giữ nguyên khối.',
              0.5],
            ['pipe',
              'The audio path uses <code>pipe:0</code>/<code>pipe:1</code> with the source streamed into <code>stdin</code>, and the decoded PCM byte count matches <code>duration × sampleRate × 2 × channels</code> to within decoder edge padding.',
              'Đường âm thanh dùng <code>pipe:0</code>/<code>pipe:1</code> với nguồn được chảy dòng vào <code>stdin</code>, và số byte PCM giải mã ra khớp <code>thời lượng × sampleRate × 2 × số kênh</code> trong phạm vi phần đệm rìa của bộ giải mã.',
              0.5],
            ['bonchitiet',
              'All four spawn details are present and observable: <code>stderr</code> has a listener (so its byte count can be reported at all), a boolean guard makes the promise settle once, <code>ENOENT</code> is distinguished from a decode failure, and the timeout path kills with <code>SIGKILL</code> and reports it.',
              'Cả bốn chi tiết của lượt spawn đều có mặt và quan sát được: <code>stderr</code> có listener (nên số byte của nó mới báo được), một biến boolean khiến promise chốt đúng một lần, <code>ENOENT</code> được phân biệt với một lỗi giải mã, và nhánh quá hạn giết bằng <code>SIGKILL</code> rồi báo lại điều đó.',
              0.7],
            ['sachse',
              'The timer is cleared on every settle path so a resolved call leaves no pending handle, <code>stdin</code> errors are handled so an <code>EPIPE</code> from a child that died first does not crash the process, and no path leaves a file behind.',
              'Bộ đếm giờ được xoá trên MỌI nhánh chốt nên một lời gọi đã resolve không để lại handle treo, lỗi trên <code>stdin</code> được xử lý nên một <code>EPIPE</code> từ tiến trình con chết trước không làm sập tiến trình, và không nhánh nào để lại file nào.',
              0.3],
          ]),
        }),

        /* ─────────────────────────── Câu 3 ─────────────────────────── */

        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q3 — Build the commands as argv, and let the flags be the answer (chapters 3 and 7).</b> Write <code>Q3/lenh-ffmpeg.js</code>. It reads one line per source on stdin — ' + c('WIDTHxHEIGHT FPS DURATION VCODEC ACODEC PIXFMT FASTSTART') + ' — and prints, for each, the argv arrays a worker would hand to <code>execFile</code>. The starter parses stdin, defines the ladder and gives you <code>inArgv(nhan, argv)</code>; you decide what goes in each array. <b>Never build a shell string</b> — the point of the exercise is that every element is exactly one <code>argv</code> entry.</p>' +
            '<ul>' +
            '<li><b><code>THUMB</code></b> — one frame, read from <code>pipe:0</code> and written to <code>pipe:1</code> as an image, at the 1-second mark (or 0 for a clip shorter than two seconds). Where <code>-ss</code> sits relative to <code>-i</code> is graded: measured on a 3-minute clip, before <code>-i</code> took 59 ms at a 2:50 offset and after it took 548 ms, while at a 0:01 offset the two are indistinguishable — which is exactly why the wrong order survives testing.</li>' +
            '<li><b><code>PLAN</code></b> — decide before you spend CPU. A source already H.264 + AAC + yuv420p that merely lacks faststart needs a container remux, so print ' + c('PLAN copy chi-thieu-faststart') + ' and a <code>COPY</code> argv (measured: 63 ms against 922 ms for a full re-encode of the same clip, and lossless). If it is already faststart too, print ' + c('PLAN none khong-can-dung-toi') + ' and emit nothing. Otherwise print <code>PLAN reencode</code> followed by the comma-joined reasons, in the order <code>codec-video</code>, <code>codec-audio</code>, <code>pix_fmt</code>.</li>' +
            '<li><b><code>RUNG</code></b> — only on the re-encode path, one argv per ladder rung, and <b>skip every rung taller than the source</b>: never produce a variant larger than what it came from. Scale with <code>-2</code> on the computed side, and make sure the side you write is even. <code>-pix_fmt yuv420p</code> and <code>-movflags +faststart</code> are not optional.</li>' +
            '<li><b><code>HLS</code></b> — always emitted. Pin the keyframes so every rendition can be switched into cleanly: one key frame per segment, scene-change insertion disabled. With <code>-hls_time 2</code> at 30 fps that is <code>-g 60 -keyint_min 60 -sc_threshold 0</code> — measured, pinning gives key frames at 0, 2, 4, 6 and 8 s while letting the encoder choose gave two in the whole clip, at 0 and 8.33 s.</li>' +
            '</ul>' +
            '<p>The reference argv arrays were not merely written; all four were executed with <code>execFileSync</code>/<code>spawnSync</code> against a real 10-second 720p MP4, and the results probed.</p>',

            '<p><b>Câu 3 — Dựng câu lệnh dưới dạng argv, và để chính các cờ là đáp án (chương 3 và 7).</b> Hãy viết <code>Q3/lenh-ffmpeg.js</code>. Nó đọc mỗi nguồn một dòng từ stdin — ' + c('RONGxCAO FPS THOILUONG CODECVIDEO CODECAUDIO PIXFMT FASTSTART') + ' — rồi in ra, với mỗi nguồn, những mảng argv mà một worker sẽ đưa cho <code>execFile</code>. Phần khung phân giải stdin, khai bậc thang và cho bạn <code>inArgv(nhan, argv)</code>; bạn quyết định cái gì nằm trong mỗi mảng. <b>Đừng bao giờ dựng một chuỗi shell</b> — ý nghĩa của bài tập chính là mỗi phần tử là đúng một mục <code>argv</code>.</p>' +
            '<ul>' +
            '<li><b><code>THUMB</code></b> — một frame, đọc từ <code>pipe:0</code> và ghi ra <code>pipe:1</code> dạng ảnh, ở mốc 1 giây (hoặc mốc 0 với clip ngắn hơn hai giây). Vị trí của <code>-ss</code> so với <code>-i</code> BỊ CHẤM: đo trên một clip 3 phút, đặt trước <code>-i</code> mất 59 ms ở độ lệch 2:50 còn đặt sau mất 548 ms, trong khi ở độ lệch 0:01 thì hai cách không phân biệt được — và đó đúng là lý do thứ tự sai sống sót qua khâu kiểm thử.</li>' +
            '<li><b><code>PLAN</code></b> — quyết định TRƯỚC khi tiêu CPU. Một nguồn vốn đã H.264 + AAC + yuv420p mà chỉ thiếu faststart thì chỉ cần một lượt remux container, nên hãy in ' + c('PLAN copy chi-thieu-faststart') + ' cùng một mảng argv <code>COPY</code> (đo được: 63 ms so với 922 ms cho một lượt encode lại đầy đủ cùng clip đó, và không mất chất lượng). Nếu nó cũng đã faststart rồi thì in ' + c('PLAN none khong-can-dung-toi') + ' và không phát ra gì. Ngược lại thì in <code>PLAN reencode</code> theo sau là các lý do nối bằng dấu phẩy, theo thứ tự <code>codec-video</code>, <code>codec-audio</code>, <code>pix_fmt</code>.</li>' +
            '<li><b><code>RUNG</code></b> — chỉ trên nhánh encode lại, mỗi bậc thang một mảng argv, và <b>BỎ mọi bậc cao hơn nguồn</b>: đừng bao giờ sinh ra một variant lớn hơn thứ nó đến từ. Scale bằng <code>-2</code> ở chiều được tính, và bảo đảm chiều bạn tự viết là số chẵn. <code>-pix_fmt yuv420p</code> và <code>-movflags +faststart</code> không phải tuỳ chọn.</li>' +
            '<li><b><code>HLS</code></b> — luôn phát ra. Hãy GHIM các keyframe để mọi bản chuyển vào được sạch sẽ: mỗi segment đúng một frame khoá, tắt việc chèn theo đổi cảnh. Với <code>-hls_time 2</code> ở 30 fps thì đó là <code>-g 60 -keyint_min 60 -sc_threshold 0</code> — đo thật, ghim thì cho frame khoá ở giây 0, 2, 4, 6 và 8 còn để encoder tự chọn thì cả clip chỉ có hai cái, ở 0 và 8,33 giây.</li>' +
            '</ul>' +
            '<p>Các mảng argv trong đáp án mẫu không chỉ được viết ra; cả bốn đã được ĐEM CHẠY bằng <code>execFileSync</code>/<code>spawnSync</code> trên một MP4 720p 10 giây thật, và kết quả đã được probe lại.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['ss',
              'Every command is an argv array with one flag or value per element and no shell string anywhere, and <code>-ss</code> is placed before <code>-i</code> in the thumbnail command so the seek uses the container index rather than decoding forward from zero.',
              'Mọi câu lệnh đều là một mảng argv với mỗi phần tử là một cờ hoặc một giá trị, không có chuỗi shell nào ở đâu cả, và <code>-ss</code> được đặt TRƯỚC <code>-i</code> trong lệnh thumbnail để lượt tua dùng chỉ mục container chứ không giải mã tiến từ số không.',
              0.5],
            ['plan',
              'The plan line distinguishes the three cases exactly — a lossless remux when only faststart is missing, no work at all when the source is already correct, and a re-encode listing its reasons in the required order — so no CPU is spent on a file that was already fine.',
              'Dòng kế hoạch phân biệt chính xác ba trường hợp — một lượt remux không mất chất lượng khi chỉ thiếu faststart, không làm gì cả khi nguồn vốn đã đúng, và một lượt encode lại có liệt kê lý do theo đúng thứ tự yêu cầu — nên không CPU nào bị tiêu cho một file vốn đã ổn.',
              0.5],
            ['bacthang',
              'Ladder rungs taller than the source are skipped, the scale filter uses <code>-2</code> for the computed dimension with an even value on the side that is written, and both <code>-pix_fmt yuv420p</code> and <code>-movflags +faststart</code> appear on every rendition.',
              'Những bậc cao hơn nguồn bị bỏ qua, bộ lọc scale dùng <code>-2</code> cho chiều được tính với một giá trị chẵn ở chiều tự viết, và cả <code>-pix_fmt yuv420p</code> lẫn <code>-movflags +faststart</code> đều có mặt ở mọi bản.',
              0.5],
            ['keyframe',
              'The HLS command pins keyframes to exactly one per segment with <code>-g</code> and <code>-keyint_min</code> computed from the source frame rate, disables scene-change insertion with <code>-sc_threshold 0</code>, and marks the playlist as VOD.',
              'Lệnh HLS ghim keyframe đúng một cái mỗi segment bằng <code>-g</code> và <code>-keyint_min</code> tính từ tốc độ khung hình của nguồn, tắt việc chèn theo đổi cảnh bằng <code>-sc_threshold 0</code>, và đánh dấu playlist là VOD.',
              0.5],
          ]),
        }),

        /* ─────────────────────────── Câu 4 ─────────────────────────── */

        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q4 — The gate that prices the work and refuses the rest (chapters 1, 2, 5 and 6).</b> Write <code>Q4/chot-chan.js</code>. The first stdin line is a budget — ' + c('MAXPIXELS MAXSECONDS MAXBYTES') + ' — and every line after it is one queued upload: ' + c('KIND NAME BYTES WIDTH HEIGHT PAGES SECONDS') + ', where <code>KIND</code> is <code>image</code>, <code>video</code> or <code>audio</code>. Print one line per upload with <code>ACCEPT</code> or <code>REJECT</code>, then a totals line.</p>' +
            '<ul>' +
            '<li><b>Order the checks cheapest first</b> and stop at the first failure: zero bytes → <code>EMPTY_FILE</code>; over the byte cap → <code>FILE_TOO_LARGE</code> with ' + c('actual>limit') + '; a visual upload with no dimensions → <code>NO_DIMENSIONS</code>; over the pixel budget → <code>TOO_MANY_PIXELS</code> with ' + c('NMP>MMP') + '; over the duration cap → <code>TOO_LONG</code> with ' + c('Ns>Ms') + '.</li>' +
            '<li><b>The pixel budget must multiply by frame count.</b> The corpus contains a 776,180-byte PNG that is 16000×16000 and a 412,000-byte GIF that is 1000×1000 with 2,000 frames. Both are ordinary-sized files and both are enormous decodes; only <code>width × height × pages</code> sees either of them, and every byte-shaped limit in a stack waves them through.</li>' +
            '<li><b>Route to separate queues</b> — <code>anh</code>, <code>video</code>, <code>am-thanh</code> — because an image is milliseconds and a video is seconds, and sharing one pool means a burst of video stalls every avatar change on the site.</li>' +
            '<li><b>Price the accepted work</b> using the constants measured on the authoring machine: 16 ms per megapixel for images, 44 ms per source second for video, 30 ms per source second for audio. Print the estimate as ' + c('Nms') + ' and sum it in the totals line.</li>' +
            '</ul>' +
            '<p>Print exactly ' + c('TONG nhan=<n> loai=<n> cpu=<n>ms') + ' as the last line. That single line is a capacity model: it answers "how much CPU did this batch just commit us to" without any further instrumentation.</p>',

            '<p><b>Câu 4 — Cái cổng biết định giá việc và từ chối phần còn lại (chương 1, 2, 5 và 6).</b> Hãy viết <code>Q4/chot-chan.js</code>. Dòng stdin đầu tiên là một ngân sách — ' + c('MAXPIXEL MAXGIAY MAXBYTE') + ' — và mọi dòng sau đó là một lượt upload đang xếp hàng: ' + c('LOAI TEN BYTE RONG CAO TRANG GIAY') + ', với <code>LOAI</code> là <code>image</code>, <code>video</code> hoặc <code>audio</code>. Hãy in mỗi lượt upload một dòng kèm <code>ACCEPT</code> hoặc <code>REJECT</code>, rồi một dòng tổng kết.</p>' +
            '<ul>' +
            '<li><b>Xếp các phép kiểm rẻ trước</b> và dừng ở lỗi đầu tiên: không byte nào → <code>EMPTY_FILE</code>; vượt trần byte → <code>FILE_TOO_LARGE</code> kèm ' + c('thucte>trần') + '; một lượt upload hình ảnh không có kích thước → <code>NO_DIMENSIONS</code>; vượt ngân sách pixel → <code>TOO_MANY_PIXELS</code> kèm ' + c('NMP>MMP') + '; vượt trần thời lượng → <code>TOO_LONG</code> kèm ' + c('Ns>Ms') + '.</li>' +
            '<li><b>Ngân sách pixel phải NHÂN với số frame.</b> Tập mẫu có một PNG 776.180 byte kích thước 16000×16000 và một GIF 412.000 byte kích thước 1000×1000 với 2.000 frame. Cả hai đều là file cỡ bình thường và cả hai đều là những lượt giải mã khổng lồ; chỉ <code>rong × cao × trang</code> mới thấy được một trong hai, còn mọi giới hạn hình dạng byte trong cả stack đều cho chúng đi qua.</li>' +
            '<li><b>Định tuyến sang các hàng đợi riêng</b> — <code>anh</code>, <code>video</code>, <code>am-thanh</code> — vì một tấm ảnh là hàng mili giây còn một video là hàng giây, và dùng chung một pool nghĩa là một đợt video làm nghẽn mọi lần đổi avatar trên site.</li>' +
            '<li><b>Định giá phần việc được nhận</b> bằng các hệ số đo trên máy soạn đề: 16 ms mỗi megapixel với ảnh, 44 ms mỗi giây nguồn với video, 30 ms mỗi giây nguồn với âm thanh. Hãy in ước lượng dạng ' + c('Nms') + ' và cộng nó vào dòng tổng kết.</li>' +
            '</ul>' +
            '<p>Hãy in đúng ' + c('TONG nhan=<n> loai=<n> cpu=<n>ms') + ' làm dòng cuối. Riêng một dòng đó đã là một mô hình dung lượng: nó trả lời "đợt này vừa cam kết bao nhiêu CPU" mà không cần thêm phép đo nào.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['thutu',
              'The checks run cheapest-first and short-circuit at the first failure, so an empty file is never measured for pixels and an oversized file is never measured for duration; each rejection carries the exact code and detail the expected block shows.',
              'Các phép kiểm chạy theo thứ tự rẻ-trước và đoản mạch ở lỗi đầu tiên, nên một file rỗng không bao giờ bị đo pixel và một file quá cỡ không bao giờ bị đo thời lượng; mỗi lượt từ chối mang đúng mã và phần chi tiết mà khối kết quả mong đợi hiển thị.',
              0.5],
            ['pixel',
              'The pixel budget is <code>width × height × pages</code> with <code>pages</code> defaulting to 1, so both the 16000×16000 single-frame PNG and the 1000×1000 two-thousand-frame GIF are refused with the megapixel totals shown, while ordinary photos and avatars pass.',
              'Ngân sách pixel là <code>rong × cao × trang</code> với <code>trang</code> mặc định là 1, nên cả file PNG 16000×16000 một frame lẫn file GIF 1000×1000 hai nghìn frame đều bị từ chối kèm tổng megapixel như đã hiện, trong khi ảnh thường và avatar thì qua.',
              0.6],
            ['hangdoi',
              'Accepted uploads are routed to three separate queue names by kind rather than to one shared pool, so a burst of video cannot occupy the workers that images need.',
              'Các lượt upload được nhận thì được định tuyến sang ba tên hàng đợi riêng theo loại chứ không vào một pool dùng chung, để một đợt video không chiếm mất những worker mà ảnh đang cần.',
              0.4],
            ['giatien',
              'The cost estimate uses the per-kind constants, is printed per accepted upload, and the totals line reports the accepted count, the rejected count and the summed CPU estimate in the exact format required.',
              'Ước lượng chi phí dùng các hệ số theo từng loại, được in cho mỗi lượt upload được nhận, và dòng tổng kết báo số nhận, số loại và tổng ước lượng CPU đúng theo định dạng yêu cầu.',
              0.5],
          ]),
        }),

        /* ─────────────────────────── Câu 5 ─────────────────────────── */

        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q5 — Diagnose from the artifact, not from the code (chapter 9).</b> Write <code>Q5/chan-doan.js</code>. Each stdin line is one JSON record describing something already measured — a <code>metadata()</code> read, an <code>ffprobe</code> output, a re-measured loudness, a response header. Print ' + c('<ten> | <MA> | <cach vá>') + ' for each, using the exact codes below, or ' + c('OK | khong co trieu chung nao khop') + ' when nothing matches.</p>' +
            '<p>Every rule must be a test on a <b>measured property of the output</b>. That is the whole lesson of the chapter: both real bugs in this course returned HTTP 200 and wrote a structurally valid file, so "the function returned" proves nothing and only a property that is <em>false while the bug is present</em> is worth asserting.</p>' +
            '<ul>' +
            '<li><code>BOM_GIAI_NEN</code> — an image whose <code>rong × cao × trang</code> exceeds 100 MP.</li>' +
            '<li><code>THIEU_ROTATE</code> — an image whose EXIF orientation is one of the four 90° values (5, 6, 7, 8) yet whose output is not taller than it is wide. Note that orientation 3 is a 180° turn and keeps the axes, so it must <em>not</em> match.</li>' +
            '<li><code>MAT_FRAME</code> — a source with more than one page whose output has one.</li>' +
            '<li><code>RE_ENCODE_TO_HON</code> — an image whose output is larger than its input.</li>' +
            '<li><code>PIX_FMT_KHONG_420</code> — a video whose pixel format is not <code>yuv420p</code>.</li>' +
            '<li><code>MOOV_O_CUOI</code> — a video whose index is at the tail.</li>' +
            '<li><code>LOUDNORM_KHONG_AP</code> — audio whose re-measured loudness is more than 1 LU from the target.</li>' +
            '<li><code>THIEU_206</code> — an HTTP response that answered a <code>Range</code> request with <code>200</code>.</li>' +
            '<li><code>CACHE_LIVE_SAI</code> — a live HLS manifest served with an immutable or year-long <code>Cache-Control</code>.</li>' +
            '</ul>' +
            '<p>Order matters where records could match twice, and the fix text is graded too — it must name the change, not the symptom. Three records in the corpus are healthy and must come back <code>OK</code>, including a VOD manifest with exactly the cache header that is wrong on a live one.</p>',

            '<p><b>Câu 5 — Chẩn đoán từ HIỆN VẬT, không phải từ mã (chương 9).</b> Hãy viết <code>Q5/chan-doan.js</code>. Mỗi dòng stdin là một bản ghi JSON mô tả một thứ ĐÃ ĐO ĐƯỢC — một lượt đọc <code>metadata()</code>, một output của <code>ffprobe</code>, một lần đo lại độ to, một header phản hồi. Hãy in ' + c('<ten> | <MA> | <cach vá>') + ' cho mỗi bản ghi, dùng đúng những mã bên dưới, hoặc ' + c('OK | khong co trieu chung nao khop') + ' khi không có gì khớp.</p>' +
            '<p>Mọi luật phải là một phép kiểm trên một <b>thuộc tính ĐO ĐƯỢC của output</b>. Đó là toàn bộ bài học của chương này: cả hai bug thật của khoá đều trả HTTP 200 và ghi ra một file hợp lệ về cấu trúc, nên "hàm đã trả về" chẳng chứng minh được gì, và chỉ một thuộc tính SAI TRONG LÚC BUG CÓ MẶT mới đáng đem ra khẳng định.</p>' +
            '<ul>' +
            '<li><code>BOM_GIAI_NEN</code> — một ảnh có <code>rong × cao × trang</code> vượt 100 MP.</li>' +
            '<li><code>THIEU_ROTATE</code> — một ảnh có EXIF orientation thuộc bốn giá trị xoay 90° (5, 6, 7, 8) mà output lại không cao hơn rộng. Lưu ý orientation 3 là xoay 180° và giữ nguyên hai trục, nên nó KHÔNG được khớp.</li>' +
            '<li><code>MAT_FRAME</code> — một nguồn có hơn một trang mà output chỉ có một.</li>' +
            '<li><code>RE_ENCODE_TO_HON</code> — một ảnh có output lớn hơn input của nó.</li>' +
            '<li><code>PIX_FMT_KHONG_420</code> — một video có pixel format khác <code>yuv420p</code>.</li>' +
            '<li><code>MOOV_O_CUOI</code> — một video có chỉ mục nằm ở đuôi.</li>' +
            '<li><code>LOUDNORM_KHONG_AP</code> — âm thanh có độ to đo lại lệch mục tiêu quá 1 LU.</li>' +
            '<li><code>THIEU_206</code> — một phản hồi HTTP đã trả lời một yêu cầu <code>Range</code> bằng mã <code>200</code>.</li>' +
            '<li><code>CACHE_LIVE_SAI</code> — một manifest HLS trực tiếp được phục vụ với <code>Cache-Control</code> immutable hoặc dài cả năm.</li>' +
            '</ul>' +
            '<p>Thứ tự quan trọng ở những chỗ một bản ghi khớp được hai luật, và phần chữ ghi cách vá cũng bị chấm — nó phải nêu THAY ĐỔI, không nêu triệu chứng. Ba bản ghi trong tập mẫu là lành mạnh và phải trở về <code>OK</code>, trong đó có một manifest VOD mang đúng cái header cache vốn là SAI trên một manifest trực tiếp.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['thuoctinh',
              'Every rule tests a measured property of the artifact rather than a guess about the code, and the three healthy records — including the correctly-rotated portrait and the VOD manifest carrying the same cache header that is wrong on a live one — come back <code>OK</code>.',
              'Mọi luật đều kiểm một thuộc tính ĐO ĐƯỢC của hiện vật chứ không phải một phỏng đoán về mã, và ba bản ghi lành mạnh — trong đó có tấm ảnh dọc đã xoay đúng và cái manifest VOD mang đúng header cache vốn là sai trên một manifest trực tiếp — đều trở về <code>OK</code>.',
              0.5],
            ['anh',
              'The four image rules fire on exactly the right records: the pixel budget counts frames, the rotation rule matches only the four orientations that swap axes (so a 180° turn does not), the frame-loss rule compares source pages against output pages, and the size rule catches an output larger than its input.',
              'Bốn luật về ảnh nổ đúng trên đúng những bản ghi cần: ngân sách pixel có đếm frame, luật xoay chỉ khớp bốn orientation có đảo trục (nên một cú xoay 180° thì không), luật mất frame so số trang nguồn với số trang output, và luật kích thước bắt được một output lớn hơn input của nó.',
              0.6],
            ['videoaudio',
              'The video, audio and delivery rules each name a check that only the artifact can answer — the probed pixel format, the index position, a re-measurement of the encoded audio against the target, a <code>200</code> answering a <code>Range</code>, and a live manifest pinned by an immutable cache header.',
              'Các luật về video, âm thanh và khâu phát mỗi cái đều nêu một phép kiểm mà chỉ hiện vật mới trả lời được — pixel format đã probe, vị trí chỉ mục, một lần ĐO LẠI âm thanh đã encode so với mục tiêu, một mã <code>200</code> trả lời một <code>Range</code>, và một manifest trực tiếp bị ghim bởi một header cache immutable.',
              0.5],
            ['cachva',
              'Each fix text names the change rather than restating the symptom — the constructor option, the argument-less call, the argv shape, the flag, the status code, the header value — so the output reads as an action list rather than as a list of complaints.',
              'Mỗi đoạn chữ ghi cách vá đều nêu THAY ĐỔI chứ không lặp lại triệu chứng — tuỳ chọn ở constructor, lời gọi không tham số, hình dạng argv, cái cờ, mã trạng thái, giá trị header — để output đọc ra như một danh sách hành động chứ không phải một danh sách than phiền.',
              0.4],
          ]),
        }),
      ],
    },
  ],
};
