/**
 * ============================================================
 * KHUNG DỰ ÁN CỦA BÀI — BỘ KIỂM
 * ============================================================
 *
 * Vì sao phải kiểm: cây thư mục là thứ thầy chấm ĐẦU TIÊN, và nó được dựng bằng
 * một phép đọc chuỗi (`src/model/Doctor.java` -> gói `model`). `tsc` không nói
 * được gì về một phép đọc chuỗi, mà đọc trượt thì hậu quả im lặng — AI mất cây,
 * tự vẽ lại một cây khác, và người học học đúng thứ làm họ bị trả bài.
 *
 * Hai phép kiểm cuối canh chính cái lỗi đã xảy ra thật ngày 15-16/09/2026: prompt
 * giảng bài của Code Lab hard-code bộ gói CŨ (`entity/ bo/ ui/ utils/Validator`)
 * và câu "bài 40 dòng thì không cần controller". Nó chạy 54 lần, cache lại, và
 * không có bộ kiểm nào kêu.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

// `locCuaBai` nay định nghĩa ở đây nhưng vẫn được kiểm qua `locCuaBai.test.ts`,
// vốn import nó từ `phongLab.service.js` — đúng đường mà mọi lời gọi cũ đi.
import { cayDuAn, khungChoPrompt, laBaiLab211 } from './khungDuAn.js';

/** Bài mẫu: đúng hình dạng `solutionCodeJson` của bộ 54 bài trong DB. */
const P0055 = {
  title: 'J1.S.P0055_Doctor management program (73 LOC)',
  slug: 'lab211-j1-s-p0055-doctor-management-program',
  solutionCodeJson: [
    { name: 'src/main/Main.java', code: 'x' },
    { name: 'src/model/Doctor.java', code: 'x' },
    { name: 'src/repository/DoctorRepository.java', code: 'x' },
    { name: 'src/utils/Validation.java', code: 'x' },
    { name: 'src/view/DoctorView.java', code: 'x' },
  ],
  starterCodeJson: [
    { name: 'src/constants/Message.java', code: '' },
    { name: 'src/constants/Constants.java', code: '' },
    { name: 'src/dto/DoctorRequestDTO.java', code: '' },
    { name: 'src/controller/DoctorController.java', code: '' },
  ],
};

test('nhận ra bài LAB211 bằng MÃ BÀI, và bằng slug khi tiêu đề bị sửa', () => {
  assert.equal(laBaiLab211(P0055), true);
  assert.equal(laBaiLab211({ title: 'J1.L.P0014_Asset Management (500 LOC)' }), true);
  // Mã bài là thứ không ai sửa; slug thì admin từng viết lại, nên nó chỉ là đường lùi.
  assert.equal(laBaiLab211({ title: 'Quản lý bác sỹ', slug: 'lab211-j1-s-p0055-doctor' }), true);
  // Track khác: KHÔNG được dính luật Java của LAB211.
  assert.equal(laBaiLab211({ title: 'Two Sum', slug: 'python-two-sum' }), false);
  assert.equal(laBaiLab211({}), false);
});

test('cây thư mục xếp theo đúng thứ tự Guide.xlsx, không theo bảng chữ cái', () => {
  const cay = cayDuAn(P0055)!;
  const goi = cay.split('\n').filter((d) => /^[├└]── \w+\//.test(d)).map((d) => d.replace(/^[├└]── (\w+)\/.*/, '$1'));
  assert.deepEqual(goi, ['constants', 'model', 'dto', 'repository', 'controller', 'view', 'utils', 'main']);
  // Hợp cả lời giải lẫn khung starter: thiếu một nguồn là mất nửa cây.
  assert.match(cay, /Doctor\.java/);
  assert.match(cay, /DoctorController\.java/);
  assert.match(cay, /Message\.java/);
});

test('không có file nào thì trả null, đừng vẽ cây rỗng', () => {
  assert.equal(cayDuAn({ title: 'J1.S.P0001_Bubble sort algorithm (40 LOC)' }), null);
  assert.equal(cayDuAn({ solutionCodeJson: 'không phải mảng' }), null);
  // File không phải .java (ảnh, dữ liệu) không được thành một "gói".
  assert.equal(cayDuAn({ solutionCodeJson: [{ name: 'doctors.txt', code: '' }] }), null);
});

test('khối ngữ cảnh: rỗng với track khác, đủ thứ với bài LAB211', () => {
  assert.equal(khungChoPrompt({ title: 'Two Sum', slug: 'python-two-sum' }), '');

  const k = khungChoPrompt(P0055);
  assert.match(k, /73 LOC/);                       // LOC đọc được từ tiêu đề
  assert.match(k, /repository\//);                  // cây thật có trong khối
  assert.match(k, /THE ORDER TO TYPE IT/);          // code từ đâu
  assert.match(k, /THE ORDER TO SELF-REVIEW/);      // review từ đâu
  assert.match(k, /model\s+- the data/);            // model trước, đúng lời thầy
  // Câu chốt: kích thước KHÔNG quyết định số gói. Đây là chỗ bản cũ dạy ngược.
  assert.match(k, /never WHICH packages/);
});

test('bài nhỏ vẫn giữ nguyên khung — không được gợi ý bỏ tầng', () => {
  const k = khungChoPrompt({ title: 'J1.S.P0060_Calculate the total amount (21 LOC)', slug: 'lab211-j1-s-p0060' });
  assert.match(k, /21 LOC/);
  assert.match(k, /A 21-LOC brief still has constants, model, dto, controller, view, main/);
});

/**
 * Hai phép kiểm canh nguồn: prompt của Code Lab KHÔNG được quay lại kiến trúc cũ.
 * Đọc thẳng mã nguồn vì các hằng số này là biến cục bộ trong module, và điều cần
 * canh là chính CHỮ trong prompt chứ không phải hành vi của một hàm.
 */
const goc = (ten: string) =>
  fs.readFileSync(path.join(process.cwd(), 'src/services', ten), 'utf8');

test('prompt giảng bài không còn dạy entity/bo/ui hay Validator', () => {
  const s = goc('codeLab.explain.service.ts');
  assert.doesNotMatch(s, /entity\//);
  assert.doesNotMatch(s, /\bbo\/\s/);
  assert.doesNotMatch(s, /ui\/\n?\s*│?\s*└?── Main\.java/);
  assert.doesNotMatch(s, /Validator\.java/);
  // Và câu luật sai phải biến mất hẳn.
  assert.doesNotMatch(s, /gets no controller/);
  assert.doesNotMatch(s, /add a layer only where/);
});

test('bốn tính năng AI của Code Lab đều đi qua luật thầy', () => {
  const coach = goc('codeLab.coach.service.ts');
  const explain = goc('codeLab.explain.service.ts');
  // Nối vào bộ luật chung, chứ không chép lại luật lần thứ năm.
  assert.match(coach, /from '\.\/labRoom\/quyTacThay\.js'/);
  assert.match(explain, /from '\.\/labRoom\/quyTacThay\.js'/);
  // Cả 4 lời gọi LLM của coach dùng bộ ghép có luật.
  assert.equal((coach.match(/system: heThongCoach\(/g) || []).length, 4);
  // Và review được đưa lời giải mẫu làm thước đo (2 chỗ: dán code, nộp zip).
  assert.equal((coach.match(/\$\{mauThamChieu\(ex\)\}/g) || []).length, 2);
});

/**
 * Generic của Java trong câu văn — lỗi làm MẤT CHỮ trên màn hình.
 * Đo thật 16/09/2026: `trả về List<Asset></li>` khiến trình duyệt đọc `<Asset>`
 * là một thẻ lạ, `sanitizeHtml` vứt đi, người học đọc được mỗi chữ `List`.
 */
test('escape generic Java, nhưng không đụng dấu < đứng riêng', async () => {
  const { vaTheLa } = await import('../snippets.aiDoc.service.js');
  assert.equal(vaTheLa('<p>trả về List<Asset></p>'), '<p>trả về List&lt;Asset&gt;</p>');
  assert.equal(vaTheLa('<p>ArrayList<Doctor> giữ danh sách</p>'), '<p>ArrayList&lt;Doctor&gt; giữ danh sách</p>');
  // `i < n` có khoảng trắng: trình duyệt đã coi là chữ thường, đụng vào là làm hỏng.
  assert.equal(vaTheLa('<p>dùng i < bills.length</p>'), '<p>dùng i < bills.length</p>');
  // Thẻ thật thì giữ nguyên, kể cả có thuộc tính.
  assert.equal(vaTheLa('<ul><li><code>x</code></li></ul>'), '<ul><li><code>x</code></li></ul>');
  assert.match(vaTheLa('<p><a href="/x">đi</a></p>'), /<a href="\/x">/);
});
