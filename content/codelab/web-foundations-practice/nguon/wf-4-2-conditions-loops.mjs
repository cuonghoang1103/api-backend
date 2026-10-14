/** Bộ luyện bài 4.2 — Toán tử, điều kiện và vòng lặp. Lược đồ: ./_luoc-do.mjs (loại 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const KHUNG_HAM = '<p><em>Khung hàm viết sẵn — hàm học kỹ ở Bài 4.3; bạn viết phần thân.</em></p>';

export default doiDau({
  slug: 'wf-4-2-conditions-loops',
  ten: '4.2 Toán tử, điều kiện và vòng lặp',
  baiHoc: 'Nền tảng Web — Bài 4.2 Toán tử, điều kiện và vòng lặp',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: '=== và !==, && || !, if / else if / else, toán tử ba ngôi, for / while / for...of, sáu giá trị falsy, ?? thay cho || khi đặt mặc định — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Xếp loại điểm: thứ tự các nhánh if quyết định kết quả',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['if / else if / else', 'so sánh >=', 'thứ tự nhánh', '||'],
      tienQuyet: ['biến', 'number'],
      the: ['javascript', 'if-else', 'conditions'],
      moTa: `<p>Bài 4.2 xếp loại bằng chuỗi ${c('if (score >= 80) … else if (score >= 50) … else …')}. Hàm ${c('xepLoai(diem)')} của nhóm bạn trả về ${c('"Đạt"')} cho cả bạn 95 điểm — vì nhánh ${c('>= 50')} đứng TRƯỚC nhánh ${c('>= 80')}: một khi nhánh trên đúng, các nhánh dưới không bao giờ được xét. Sửa thứ tự và thêm kiểm tra điểm không hợp lệ.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('diem >= 80')} → ${c('"Giỏi"')}; ${c('50 <= diem < 80')} → ${c('"Đạt"')}; dưới 50 → ${c('"Học lại"')}.`,
        `Điểm nhỏ hơn 0 HOẶC lớn hơn 100 → ${c('"Không hợp lệ"')} (kiểm đầu tiên, dùng ${c('||')}).`,
        'Biên đúng: 80 là "Giỏi", 50 là "Đạt", 0 và 100 hợp lệ.',
      ],
      dauVao: 'diem: number.',
      dauRa: 'Một trong bốn chuỗi: "Giỏi", "Đạt", "Học lại", "Không hợp lệ".',
      rangBuoc: ['Dùng if / else if / else.', 'Không dùng ==.'],
      viDu: [
        { input: 'xepLoai(95)', output: '"Giỏi"', explanation: '95 >= 80 — nhánh Giỏi phải được xét trước.' },
        { input: 'xepLoai(50)', output: '"Đạt"', explanation: 'Biên dưới của Đạt dùng >=.' },
        { input: 'xepLoai(120)', output: '"Không hợp lệ"', explanation: 'Điểm ngoài khoảng 0–100.' },
      ],
      goiY: [
        'Xét điều kiện CHẶT nhất trước: không hợp lệ → >= 80 → >= 50 → còn lại.',
        'if (diem < 0 || diem > 100) return "Không hợp lệ"; if (diem >= 80) return "Giỏi"; if (diem >= 50) return "Đạt"; return "Học lại";',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — Xếp loại
function xepLoai(diem) {
  if (diem >= 50) {
    return "Đạt";
  } else if (diem >= 80) {
    return "Giỏi";
  } else {
    return "Học lại";
  }
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — Xếp loại
function xepLoai(diem) {
  // Điều kiện "chặn" đứng đầu: ngoài 0–100 thì mọi nhánh sau vô nghĩa
  if (diem < 0 || diem > 100) {
    return "Không hợp lệ";
  } else if (diem >= 80) {      // ngưỡng CAO xét trước,
    return "Giỏi";
  } else if (diem >= 50) {      // rồi mới đến ngưỡng thấp hơn
    return "Đạt";
  } else {
    return "Học lại";
  }
}
`,
      },
      giaiThich: `<p>Chuỗi ${c('if / else if')} dừng ở nhánh <em>đầu tiên</em> đúng. 95 thoả cả ${c('>= 50')} lẫn ${c('>= 80')}, nên nhánh nào đứng trước thì thắng — với ngưỡng lồng nhau, luôn xét ngưỡng cao trước. Nhờ thứ tự đó, nhánh "Đạt" không cần viết ${c('diem >= 50 && diem < 80')}: tới được đó nghĩa là đã chắc chắn ${c('diem < 80')}.</p>
<p>Điều kiện không hợp lệ dùng ${c('||')}: chỉ cần MỘT trong hai vế đúng. Máy chấm thử 9 điểm, kể cả bốn điểm biên 0, 50, 80, 100 và hai điểm ngoài khoảng.</p>`,
      loiHayGap: [
        `Viết ${c('diem > 80')} — 80 rơi xuống "Đạt".`,
        `Viết ${c('diem < 0 && diem > 100')} — không số nào vừa âm vừa lớn hơn 100, điều kiện luôn sai.`,
        'Đặt kiểm "Không hợp lệ" ở cuối — 120 đã bị nhánh >= 80 bắt mất.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else',
      kiem: [
        { moTa: 'xepLoai(95) = "Giỏi"', goi: 'xepLoai(95)', mongDoi: 'Giỏi' },
        { moTa: 'Biên 80 là "Giỏi"', goi: 'xepLoai(80)', mongDoi: 'Giỏi' },
        { moTa: 'xepLoai(72) = "Đạt"', goi: 'xepLoai(72)', mongDoi: 'Đạt' },
        { moTa: 'Biên 50 là "Đạt"', goi: 'xepLoai(50)', mongDoi: 'Đạt' },
        { moTa: 'xepLoai(49) = "Học lại"', goi: 'xepLoai(49)', mongDoi: 'Học lại' },
        { moTa: 'Điểm 0 và 100 hợp lệ', goi: '[xepLoai(0), xepLoai(100)]', mongDoi: ['Học lại', 'Giỏi'] },
        { moTa: 'Ngoài khoảng → "Không hợp lệ"', goi: '[xepLoai(-1), xepLoai(120)]', mongDoi: ['Không hợp lệ', 'Không hợp lệ'] },
        { moTa: 'Không dùng ==', kiem: 'ma-nguon', tep: 'main.js', khop: '[^=!<>]==[^=]', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Giá vé vào cổng: && , || và toán tử ba ngôi',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['&&', '||', '!', 'toán tử ba ngôi'],
      tienQuyet: ['if / else'],
      the: ['javascript', 'logical-operators', 'ternary'],
      moTa: `<p>Bảo tàng tính giá vé theo luật: trẻ dưới 6 tuổi miễn phí; người từ 60 tuổi trở lên <strong>hoặc</strong> sinh viên được giảm còn 20.000đ; còn lại 40.000đ. Viết ${c('giaVe(tuoi, laSinhVien)')}, rồi viết ${c('nhanVe(tuoi, laSinhVien)')} trả về nhãn in trên vé bằng <strong>toán tử ba ngôi</strong>: ${c('"MIỄN PHÍ"')} nếu giá là 0, ngược lại ${c('"<giá>đ"')}.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('giaVe')}: tuổi < 6 → 0; tuổi >= 60 HOẶC sinh viên → 20000; còn lại 40000.`,
        'Trẻ dưới 6 tuổi là sinh viên (vô lý nhưng có thể nhập nhầm) vẫn miễn phí — luật miễn phí xét trước.',
        `${c('nhanVe')} dùng toán tử ba ngôi ${c('dieuKien ? a : b')}: ${c('"MIỄN PHÍ"')} hoặc ${c('"20000đ"')} / ${c('"40000đ"')}.`,
      ],
      dauVao: 'tuoi: number; laSinhVien: boolean.',
      dauRa: 'giaVe → number; nhanVe → string.',
      rangBuoc: ['nhanVe phải dùng toán tử ba ngôi (không if).', 'nhanVe gọi lại giaVe, không chép luật lần hai.'],
      viDu: [
        { input: 'giaVe(30, true)', output: '20000', explanation: 'Sinh viên được giảm — chỉ cần một vế của || đúng.' },
        { input: 'giaVe(65, false)', output: '20000', explanation: 'Từ 60 tuổi.' },
        { input: 'nhanVe(4, false)', output: '"MIỄN PHÍ"', explanation: 'Giá 0 ⇒ nhánh trước dấu hai chấm.' },
      ],
      goiY: [
        'Ba mức giá ⇒ if tuoi < 6 return 0; if (tuoi >= 60 || laSinhVien) return 20000; return 40000.',
        'nhanVe: const gia = giaVe(tuoi, laSinhVien); return gia === 0 ? "MIỄN PHÍ" : ´@{gia}đ´;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — Giá vé
function giaVe(tuoi, laSinhVien) {
  if (tuoi >= 60 && laSinhVien) {
    return 20000;
  }
  return 40000;
}

function nhanVe(tuoi, laSinhVien) {
  return "";
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — Giá vé
function giaVe(tuoi, laSinhVien) {
  if (tuoi < 6) {
    return 0;                           // luật miễn phí xét TRƯỚC mọi luật giảm
  }
  if (tuoi >= 60 || laSinhVien) {       // || : chỉ cần MỘT điều kiện đúng
    return 20000;
  }
  return 40000;
}

function nhanVe(tuoi, laSinhVien) {
  const gia = giaVe(tuoi, laSinhVien);  // dùng lại luật, không chép lần hai
  // toán tử ba ngôi: dieuKien ? giáTrịKhiĐúng : giáTrịKhiSai
  return gia === 0 ? "MIỄN PHÍ" : ´@{gia}đ´;
}
`,
      },
      giaiThich: `<p>Code khởi đầu dùng ${c('&&')} — đòi <em>cả hai</em>: vừa trên 60 vừa là sinh viên, gần như không ai. Câu luật nói "hoặc", nên là ${c('||')}. Thói quen tốt: đọc to điều kiện bằng tiếng Việt rồi so với câu luật.</p>
<p>Toán tử ba ngôi hợp với "chọn một trong hai giá trị" — gọn hơn ${c('if/else')} bốn dòng. Máy chấm gọi ${c('giaVe')} với 8 bộ tuổi/sinh viên (có biên 6 và 60) và ${c('nhanVe')} với ba mức.</p>`,
      loiHayGap: [
        `Viết ${c('tuoi > 60')} — người đúng 60 tuổi không được giảm.`,
        `Viết ${c('tuoi <= 6')} — bé đúng 6 tuổi được miễn phí, sai luật "dưới 6".`,
        `Ở nhanVe quên chữ ${c('đ')} hoặc thêm dấu chấm phân cách nghìn — máy chấm so đúng ${c('"20000đ"')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator',
      kiem: [
        { moTa: 'Người lớn thường 40000', goi: 'giaVe(30, false)', mongDoi: 40000 },
        { moTa: 'Sinh viên 20000', goi: 'giaVe(30, true)', mongDoi: 20000 },
        { moTa: 'Biên 60 tuổi được giảm', goi: '[giaVe(59, false), giaVe(60, false)]', mongDoi: [40000, 20000] },
        { moTa: 'Biên 6 tuổi: 5 miễn phí, 6 trả tiền', goi: '[giaVe(5, false), giaVe(6, false)]', mongDoi: [0, 40000] },
        { moTa: 'Bé 4 tuổi đánh dấu sinh viên vẫn miễn phí', goi: 'giaVe(4, true)', mongDoi: 0, an: true },
        { moTa: 'nhanVe ba mức', goi: '[nhanVe(3, false), nhanVe(70, false), nhanVe(25, false)]', mongDoi: ['MIỄN PHÍ', '20000đ', '40000đ'] },
        { moTa: 'nhanVe dùng toán tử ba ngôi', kiem: 'ma-nguon', tep: 'main.js', khop: 'function\\s+nhanVe[\\s\\S]*\\?[\\s\\S]*:' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Tổng các số chẵn bằng vòng lặp for',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['vòng lặp for', 'biến cộng dồn', '% (chia lấy dư)', 'let'],
      tienQuyet: ['let', 'if'],
      the: ['javascript', 'for-loop'],
      moTa: `<p>Bài 4.2: <em>"for: khi bạn biết lặp bao nhiêu lần."</em> Viết ${c('tongChan(n)')} trả về tổng các số chẵn từ 1 đến ${c('n')} (tính cả ${c('n')}). Code khởi đầu có hai lỗi kinh điển của vòng lặp: điều kiện dừng ${c('i < n')} bỏ sót chính ${c('n')}, và biến cộng dồn khai báo <em>trong</em> thân vòng lặp nên bị đặt lại về 0 mỗi lượt.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('tongChan(10)')} = 2 + 4 + 6 + 8 + 10 = ${c('30')}.`,
        `${c('n')} được tính nếu nó chẵn; ${c('tongChan(0)')} và ${c('tongChan(1)')} đều ra ${c('0')}.`,
        `Dùng vòng lặp ${c('for')} và ${c('%')} để kiểm số chẵn (${c('i % 2 === 0')}).`,
      ],
      dauVao: 'n: số nguyên >= 0.',
      dauRa: 'number — tổng các số chẵn trong 1..n.',
      rangBuoc: ['Không dùng công thức toán đóng (n/2)(n/2+1) — luyện vòng lặp.', 'Không dùng mảng (chưa học).'],
      viDu: [
        { input: 'tongChan(10)', output: '30', explanation: '2+4+6+8+10.' },
        { input: 'tongChan(7)', output: '12', explanation: '2+4+6; 7 lẻ nên không cộng.' },
        { input: 'tongChan(1)', output: '0', explanation: 'Không có số chẵn nào trong 1..1.' },
      ],
      goiY: [
        'Biến cộng dồn phải nằm NGOÀI vòng lặp (let tong = 0; trước for), và return sau khi vòng lặp xong.',
        'for (let i = 1; i <= n; i++) { if (i % 2 === 0) { tong = tong + i; } }',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — Tổng số chẵn
function tongChan(n) {
  for (let i = 1; i < n; i++) {
    let tong = 0;
    if (i % 2 === 0) {
      tong = tong + i;
    }
  }
  return 0;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — Tổng số chẵn
function tongChan(n) {
  let tong = 0;                    // cộng dồn: khai báo NGOÀI vòng lặp, một lần
  for (let i = 1; i <= n; i++) {   // <= để tính cả chính n
    if (i % 2 === 0) {             // chia 2 dư 0 ⇒ số chẵn
      tong = tong + i;
    }
  }
  return tong;                     // trả về SAU khi lặp xong
}
`,
      },
      giaiThich: `<p>Biến khai báo bằng ${c('let')} trong thân vòng lặp là biến <em>mới</em> cho mỗi lượt — nó sinh ra bằng 0 và mất đi cuối lượt, nên không cộng dồn được gì. Đưa nó ra ngoài để sống qua mọi lượt. Lỗi "lệch một" (${c('<')} thay vì ${c('<=')}) là lỗi vòng lặp phổ biến nhất: luôn tự hỏi "lượt cuối cùng là ${c('i')} bằng bao nhiêu?".</p>
<p>Máy chấm gọi ${c('tongChan')} với 0, 1, 7, 10, 100 và soi mã có ${c('for')} và ${c('%')}.</p>`,
      loiHayGap: [
        `${c('return tong')} đặt TRONG vòng lặp — hàm kết thúc ngay ở lượt đầu.`,
        `Viết ${c('i % 2 == 0')} — ra đúng nhưng trái luật ${c('===')} của bài.`,
        `Bắt đầu ${c('i = 0')} rồi quên rằng 0 cũng chẵn — vô hại ở đây (cộng 0), nhưng hãy biết vì sao.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for',
      kiem: [
        { moTa: 'tongChan(10) = 30', goi: 'tongChan(10)', mongDoi: 30 },
        { moTa: 'tongChan(7) = 12', goi: 'tongChan(7)', mongDoi: 12 },
        { moTa: 'tongChan(0) và tongChan(1) = 0', goi: '[tongChan(0), tongChan(1)]', mongDoi: [0, 0] },
        { moTa: 'tongChan(100) = 2550', goi: 'tongChan(100)', mongDoi: 2550, an: true },
        { moTa: 'Dùng vòng lặp for', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bfor\\s*\\(' },
        { moTa: 'Dùng % để kiểm số chẵn', kiem: 'ma-nguon', tep: 'main.js', khop: '%\\s*2\\s*===\\s*0' },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'FizzBuzz tiếng Việt: in ra console theo đúng thứ tự',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['vòng lặp for', '%', 'if / else if', 'console.log', 'thứ tự điều kiện'],
      tienQuyet: ['vòng lặp for', 'if / else if'],
      the: ['javascript', 'loops', 'console'],
      moTa: `<p>Bài kinh điển của mọi buổi phỏng vấn. Viết ${c('fizzBuzz(n)')} <strong>in ra console</strong> (mỗi số một dòng) các số từ 1 đến ${c('n')}, nhưng: chia hết cho 3 in ${c('"Phi"')}, chia hết cho 5 in ${c('"Bút"')}, chia hết cho CẢ 3 và 5 in ${c('"PhiBút"')}. Máy chấm bắt từng dòng ${c('console.log')} và so với dãy đúng.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `In đúng ${c('n')} dòng, theo thứ tự 1 → ${c('n')}.`,
        `Bội của 15 in ${c('"PhiBút"')}; bội của 3 (không phải 15) in ${c('"Phi"')}; bội của 5 in ${c('"Bút"')}; còn lại in chính số đó.`,
        'Hàm không trả về gì — kết quả là những dòng được in.',
      ],
      dauVao: 'n: số nguyên >= 0.',
      dauRa: 'n dòng console. Ví dụ fizzBuzz(5): 1, 2, Phi, 4, Bút.',
      rangBuoc: ['Mỗi số đúng một lần console.log.', 'fizzBuzz(0) không in gì.'],
      viDu: [
        { input: 'fizzBuzz(5)', output: '1\n2\nPhi\n4\nBút', explanation: '3 → Phi, 5 → Bút.' },
        { input: 'fizzBuzz(15) — dòng cuối', output: 'PhiBút', explanation: '15 chia hết cho cả 3 và 5. Nếu kiểm %3 trước, 15 sẽ thành "Phi".' },
      ],
      goiY: [
        'Giống bài xếp loại: điều kiện chặt nhất (chia hết cho 15) phải xét TRƯỚC điều kiện rộng hơn (chia hết cho 3).',
        'for (let i = 1; i <= n; i++) { if (i % 15 === 0) console.log("PhiBút"); else if (i % 3 === 0) console.log("Phi"); else if (i % 5 === 0) console.log("Bút"); else console.log(i); }',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — FizzBuzz
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0) {
      console.log("Phi");
    } else if (i % 5 === 0) {
      console.log("Bút");
    } else if (i % 15 === 0) {
      console.log("PhiBút");
    }
  }
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — FizzBuzz
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {          // chặt nhất trước: chia hết cho CẢ 3 và 5
      console.log("PhiBút");
    } else if (i % 3 === 0) {
      console.log("Phi");
    } else if (i % 5 === 0) {
      console.log("Bút");
    } else {
      console.log(i);            // không thuộc luật nào: in chính số đó
    }
  }
}
`,
      },
      giaiThich: `<p>Hai lỗi của code khởi đầu: (1) nhánh ${c('% 15')} đứng cuối nên không bao giờ tới — 15 đã bị ${c('% 3')} bắt; (2) thiếu ${c('else')} cuối nên các số thường không được in. Cách viết khác: dựng chuỗi ${c('let s = ""')}, cộng "Phi" nếu chia hết 3, cộng "Bút" nếu chia hết 5, rồi in ${c('s || i')} — cũng đúng, và tự xử lý được ca 15.</p>
<p>Máy chấm chạy ${c('fizzBuzz(15)')} và ${c('fizzBuzz(5)')}, so từng dòng; số được in qua ${c('console.log(i)')} hiện thành chữ ${c('"1"')}, ${c('"2"')}…</p>`,
      loiHayGap: [
        `Quên ${c('else')} cuối — chỉ in ra các chữ, không in số.`,
        `Gom kết quả vào chuỗi rồi in một lần — máy chấm đếm từng dòng in.`,
        `${c('return')} thay vì ${c('console.log')} — vòng lặp dừng ngay lượt đầu.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/console/log_static',
      kiem: [
        { moTa: 'fizzBuzz(5) in 1, 2, Phi, 4, Bút', so: 'console', goi: 'fizzBuzz(5)', mongDoi: ['1', '2', 'Phi', '4', 'Bút'] },
        { moTa: 'fizzBuzz(15) — đủ 15 dòng, dòng cuối PhiBút', so: 'console', goi: 'fizzBuzz(15)', mongDoi: ['1', '2', 'Phi', '4', 'Bút', 'Phi', '7', '8', 'Phi', 'Bút', '11', 'Phi', '13', '14', 'PhiBút'] },
        { moTa: 'fizzBuzz(0) không in gì', so: 'console', goi: 'fizzBuzz(0)', mongDoi: [] },
        { moTa: 'Dòng thứ 30 là PhiBút', chuanBi: 'fizzBuzz(30);', goi: '__log[29]', mongDoi: 'PhiBút', an: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Bẫy || nuốt mất số 0: đặt mặc định bằng ??',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['falsy', '|| đoản mạch', '?? (nullish)', 'null / undefined'],
      tienQuyet: ['toán tử logic'],
      the: ['javascript', 'falsy', 'nullish-coalescing'],
      moTa: `<p>Bài 4.2, mục <em>"Bẫy — dùng || để đặt giá trị mặc định là nuốt luôn số không và chuỗi rỗng hợp lệ"</em>. Hàm ${c('cauHinhTrang(soLuong, tieuDe, trang)')} gom tham số từ URL; tham số nào <strong>không được cấp</strong> (${c('undefined')} hoặc ${c('null')}) thì dùng mặc định: số lượng 1, tiêu đề ${c('"Không tên"')}, trang 1. Code khởi đầu dùng ${c('||')} nên người dùng cố ý chọn số lượng 0 hay trang 0 cũng bị đổi thành 1.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `Trả về object ${c('{ soLuong, tieuDe, trang }')}.`,
        `Chỉ dùng mặc định khi giá trị là ${c('null')} hoặc ${c('undefined')} — ${c('0')} và ${c('""')} được giữ nguyên.`,
        `Hàm ${c('laFalsy(x)')} trả về ${c('true')} khi ${c('x')} là một trong sáu giá trị falsy, ngược lại ${c('false')} — dùng ${c('!x')}, không liệt kê.`,
      ],
      dauVao: 'soLuong: number|null|undefined; tieuDe: string|null|undefined; trang: number|null|undefined.',
      dauRa: 'object ba trường; laFalsy → boolean.',
      rangBuoc: ['Không dùng || trong cauHinhTrang.', 'Không viết if riêng cho từng trường — dùng ??.'],
      viDu: [
        { input: 'cauHinhTrang(0, "", 0)', output: '{ soLuong: 0, tieuDe: "", trang: 0 }', explanation: '0 và "" là giá trị người dùng đã chọn — ?? không đụng vào.' },
        { input: 'cauHinhTrang(undefined, null, undefined)', output: '{ soLuong: 1, tieuDe: "Không tên", trang: 1 }', explanation: 'Không có gì được cấp ⇒ mặc định.' },
        { input: 'laFalsy([])', output: 'false', explanation: 'Mảng rỗng là truthy — bài học nhấn mạnh điều này.' },
      ],
      goiY: [
        'a ?? b chỉ chọn b khi a là null/undefined; a || b chọn b khi a là BẤT KỲ giá trị falsy nào (0, "", NaN, false…).',
        'return { soLuong: soLuong ?? 1, tieuDe: tieuDe ?? "Không tên", trang: trang ?? 1 };  — laFalsy: return !x;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — || hay ??
function cauHinhTrang(soLuong, tieuDe, trang) {
  return {
    soLuong: soLuong || 1,
    tieuDe: tieuDe || "Không tên",
    trang: trang || 1,
  };
}

function laFalsy(x) {
  return x === false;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — || hay ??
function cauHinhTrang(soLuong, tieuDe, trang) {
  // ?? chỉ lùi về mặc định khi giá trị là null hoặc undefined,
  // tức đúng nghĩa "không được cấp". 0 và "" là lựa chọn thật của người dùng.
  return {
    soLuong: soLuong ?? 1,
    tieuDe: tieuDe ?? "Không tên",
    trang: trang ?? 1,
  };
}

function laFalsy(x) {
  // ! đổi giá trị sang boolean rồi đảo: falsy ⇒ true
  // Sáu giá trị falsy: false, 0, "", null, undefined, NaN
  return !x;
}
`,
      },
      giaiThich: `<p>${c('a || b')} nghĩa là "nếu a falsy thì lấy b" — và 0, chuỗi rỗng, NaN đều falsy. Vì thế ${c('soLuong || 1')} biến lựa chọn "0 sản phẩm" thành 1: lỗi im lặng, không có thông báo nào. ${c('??')} hẹp hơn: chỉ ${c('null')} và ${c('undefined')}, đúng với ý "không có giá trị".</p>
<p>${c('!x')} ép x sang boolean rồi đảo — cách ngắn nhất để hỏi "x có falsy không". Máy chấm kiểm cả sáu giá trị falsy và vài giá trị truthy dễ nhầm (${c('"0"')}, ${c('[]')}, ${c('{}')}).</p>`,
      loiHayGap: [
        `Dùng ${c('soLuong !== undefined ? soLuong : 1')} — quên ${c('null')}.`,
        `Tin rằng ${c('"0"')} là falsy — nó là chuỗi không rỗng, nên truthy.`,
        `Tin rằng ${c('[]')} là falsy — mọi object, kể cả mảng rỗng, đều truthy.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing',
      kiem: [
        { moTa: '0, "" và 0 được giữ nguyên', goi: 'cauHinhTrang(0, "", 0)', mongDoi: { soLuong: 0, tieuDe: '', trang: 0 } },
        { moTa: 'undefined/null dùng mặc định', goi: 'cauHinhTrang(undefined, null, undefined)', mongDoi: { soLuong: 1, tieuDe: 'Không tên', trang: 1 } },
        { moTa: 'Giá trị thường giữ nguyên', goi: 'cauHinhTrang(5, "Áo", 2)', mongDoi: { soLuong: 5, tieuDe: 'Áo', trang: 2 } },
        { moTa: 'Sáu giá trị falsy', goi: '[false, 0, "", null, undefined, NaN].map(laFalsy)', mongDoi: [true, true, true, true, true, true] },
        { moTa: 'Truthy dễ nhầm: "0", [], {}, "false"', goi: '["0", [], {}, "false"].map(laFalsy)', mongDoi: [false, false, false, false] },
        { moTa: 'Không dùng || trong cauHinhTrang', kiem: 'ma-nguon', tep: 'main.js', khop: 'function\\s+cauHinhTrang[^}]*\\|\\|', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Đi qua danh sách bằng for...of và while',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['for...of', 'while', 'break', 'falsy', '.length'],
      tienQuyet: ['vòng lặp for', 'falsy'],
      the: ['javascript', 'for-of', 'while', 'falsy'],
      moTa: `<p>Bài 4.2: <em>"for...of là vòng lặp hằng ngày của bạn."</em> Ba hàm nhỏ trên một danh sách đơn hàng (mảng sẽ học kỹ ở 4.4 — ở đây chỉ cần ${c('for...of')} và ${c('.length')}):</p>
<ul><li>${c('demFalsy(ds)')}: đếm số phần tử falsy trong danh sách.</li>
<li>${c('coDonHang(ds)')}: ${c('true')} khi danh sách có ít nhất một phần tử. Code cũ viết ${c('if (ds)')} — nhưng ${c('[]')} là truthy!</li>
<li>${c('viTriDauTien(ds, giaTri)')}: chỉ số đầu tiên mà ${c('ds[i] === giaTri')}, dùng ${c('while')}; không có thì ${c('-1')}.</li></ul>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('demFalsy')} dùng ${c('for...of')} và đếm đúng sáu loại falsy.`,
        `${c('coDonHang([])')} là ${c('false')} — kiểm ${c('ds.length > 0')}.`,
        `${c('viTriDauTien')} dùng vòng ${c('while')}, so bằng ${c('===')}, trả về ${c('-1')} khi không thấy.`,
      ],
      dauVao: 'ds: một mảng giá trị bất kỳ; giaTri: giá trị cần tìm.',
      dauRa: 'number / boolean / number như mô tả.',
      rangBuoc: ['Không dùng indexOf / filter / findIndex (để luyện vòng lặp).'],
      viDu: [
        { input: 'demFalsy([0, "a", "", null, 5, NaN])', output: '4', explanation: '0, "", null, NaN.' },
        { input: 'coDonHang([])', output: 'false', explanation: '[] truthy nên if (ds) sai; phải hỏi độ dài.' },
        { input: 'viTriDauTien(["a", "b", "b"], "b")', output: '1', explanation: 'Dừng ở lần gặp đầu tiên.' },
      ],
      goiY: [
        'demFalsy: let dem = 0; for (const x of ds) { if (!x) dem++; } — viTriDauTien: let i = 0; while (i < ds.length) { … i++; }',
        'Trong while: if (ds[i] === giaTri) return i; — sau vòng while: return -1;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — for...of và while
function demFalsy(ds) {
  let dem = 0;
  // đếm các phần tử falsy
  return dem;
}

function coDonHang(ds) {
  if (ds) {
    return true;
  }
  return false;
}

function viTriDauTien(ds, giaTri) {
  let i = 0;
  while (i < ds.length) {
    i++;
  }
  return i;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — for...of và while
function demFalsy(ds) {
  let dem = 0;
  for (const x of ds) {        // for...of: lấy thẳng từng phần tử, không cần chỉ số
    if (!x) {                  // !x đúng với false, 0, "", null, undefined, NaN
      dem++;
    }
  }
  return dem;
}

function coDonHang(ds) {
  // [] là TRUTHY ⇒ if (ds) luôn đúng. Hỏi đúng câu: có phần tử nào không?
  return ds.length > 0;
}

function viTriDauTien(ds, giaTri) {
  let i = 0;
  while (i < ds.length) {      // while: lặp chừng nào điều kiện còn đúng
    if (ds[i] === giaTri) {
      return i;                // thấy rồi thì trả về ngay — thoát cả hàm
    }
    i++;                       // quên dòng này là vòng lặp vô hạn
  }
  return -1;                   // đi hết danh sách mà không thấy
}
`,
      },
      giaiThich: `<p>${c('for...of')} hợp khi chỉ cần từng phần tử; ${c('while')} hợp khi vòng lặp dừng theo một điều kiện có thể đến sớm (tìm thấy). ${c('return')} trong vòng lặp thoát cả hàm — tự nhiên hơn ${c('break')} cộng biến cờ.</p>
<p>${c('coDonHang')} là bẫy truthy của bài học: ${c('[]')} và ${c('{}')} là object nên luôn truthy; "có phần tử" phải hỏi bằng ${c('length')}. Máy chấm có kiểm ẩn với danh sách có ${c('NaN')} và tìm giá trị ${c('0')} (đừng nhầm với "không thấy").</p>`,
      loiHayGap: [
        `Quên ${c('i++')} trong while — vòng lặp vô hạn (máy chấm cắt sau 1 giây và báo trượt).`,
        `Viết ${c('if (ds[i] == giaTri)')} — tìm ${c('0')} sẽ khớp nhầm ${c('""')} hay ${c('"0"')}.`,
        `Đếm falsy bằng ${c('x === false || x === 0 || …')} và quên ${c('NaN')} (NaN !== NaN!).`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of',
      kiem: [
        { moTa: 'demFalsy([0, "a", "", null, 5, NaN]) = 4', goi: 'demFalsy([0, "a", "", null, 5, NaN])', mongDoi: 4 },
        { moTa: 'demFalsy([]) = 0', goi: 'demFalsy([])', mongDoi: 0 },
        { moTa: 'coDonHang([]) = false, coDonHang([1]) = true', goi: '[coDonHang([]), coDonHang([1])]', mongDoi: [false, true] },
        { moTa: 'viTriDauTien tìm lần đầu', goi: 'viTriDauTien(["a", "b", "b"], "b")', mongDoi: 1 },
        { moTa: 'Không thấy → -1', goi: 'viTriDauTien(["a"], "z")', mongDoi: -1 },
        { moTa: 'Tìm 0 không khớp nhầm "" hay "0"', goi: 'viTriDauTien(["", "0", 0], 0)', mongDoi: 2, an: true },
        { moTa: 'demFalsy dùng for...of', kiem: 'ma-nguon', tep: 'main.js', khop: 'for\\s*\\(\\s*(const|let)\\s+\\w+\\s+of\\b' },
        { moTa: 'viTriDauTien dùng while', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bwhile\\s*\\(' },
        { moTa: 'Không dùng indexOf/findIndex/filter', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.(indexOf|findIndex|filter)\\s*\\(', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Tính tiền điện bậc thang',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['vòng lặp với điều kiện dừng', 'Math.min', 'kiểm tra đầu vào', 'typeof', 'Number.isFinite'],
      tienQuyet: ['if / else', 'vòng lặp', 'falsy'],
      the: ['javascript', 'loops', 'conditions', 'real-world'],
      moTa: `<p>Giá điện sinh hoạt ở Việt Nam tính <strong>bậc thang</strong>: mỗi bậc chỉ áp cho phần kWh rơi vào bậc đó, không áp cho cả tổng. Bảng giá (đồng/kWh, chưa thuế) dùng trong bài:</p>
<pre><code>Bậc 1:   0 –  50 kWh   1806
Bậc 2:  51 – 100 kWh   1866
Bậc 3: 101 – 200 kWh   2167
Bậc 4: 201 – 300 kWh   2729
Bậc 5: 301 – 400 kWh   3050
Bậc 6: từ 401 kWh       3151</code></pre>
<p>Viết ${c('tienDien(kWh)')} trả về số tiền (đồng, làm tròn tới đồng bằng ${c('Math.round')}). Đầu vào sai (không phải số, âm, ${c('NaN')}, ${c('Infinity')}) ⇒ trả về ${c('null')}.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `150 kWh = 50×1806 + 50×1866 + 50×2167 = ${c('291950')}.`,
        `Áp đúng từng bậc cho phần rơi vào bậc đó; trên 400 kWh, phần vượt tính giá bậc 6.`,
        `${c('tienDien(0)')} = 0; số kWh lẻ (vd 10.5) được phép; kết quả làm tròn ${c('Math.round')}.`,
        `Trả về ${c('null')} khi ${c('typeof kWh !== "number"')}, âm, hoặc không hữu hạn (${c('Number.isFinite')}).`,
      ],
      dauVao: 'kWh: giá trị bất kỳ (người dùng gõ).',
      dauRa: 'number (đồng) hoặc null.',
      rangBuoc: ['Không dùng mảng phương thức (map/reduce — học ở 4.4); vòng lặp hoặc chuỗi if đều được.', 'Không viết công thức riêng cho từng khoảng 0–50, 51–100… (sẽ có 6 công thức dễ sai) — để vòng lặp đi qua các bậc.'],
      viDu: [
        { input: 'tienDien(50)', output: '90300', explanation: '50 × 1806.' },
        { input: 'tienDien(150)', output: '291950', explanation: '90300 + 93300 + 108350.' },
        { input: 'tienDien(-5)', output: 'null', explanation: 'Số kWh âm là đầu vào sai.' },
        { input: 'tienDien("100")', output: 'null', explanation: 'Chuỗi — chưa qua kiểm tra đầu vào; bài này yêu cầu số thật.' },
      ],
      goiY: [
        'Giữ biến conLai = kWh. Mỗi bậc có "độ rộng" (50, 50, 100, 100, 100, vô hạn): phần áp cho bậc = Math.min(conLai, độRộng); trừ nó khỏi conLai; dừng khi conLai bằng 0.',
        'Hai mảng nhỏ được phép làm bảng tra: const RONG = [50, 50, 100, 100, 100, Infinity]; const GIA = [1806, 1866, 2167, 2729, 3050, 3151]; rồi for (let i = 0; i < 6 && conLai > 0; i++) { const phan = Math.min(conLai, RONG[i]); tien += phan * GIA[i]; conLai -= phan; }',
      ],
      khoiDau: {
        'main.js': `// Bài 4.2 — Tiền điện bậc thang
// Bản cũ: lấy cả tổng nhân với giá của bậc cao nhất — SAI luật bậc thang
function tienDien(kWh) {
  if (kWh <= 50) {
    return kWh * 1806;
  } else if (kWh <= 100) {
    return kWh * 1866;
  } else if (kWh <= 200) {
    return kWh * 2167;
  }
  return kWh * 3151;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.2 — Tiền điện bậc thang
// Bảng tra: độ rộng mỗi bậc và đơn giá tương ứng (đồng/kWh)
const RONG_BAC = [50, 50, 100, 100, 100, Infinity];
const GIA_BAC = [1806, 1866, 2167, 2729, 3050, 3151];

function tienDien(kWh) {
  // Chốt chặn đầu vào: không phải số, NaN, Infinity, âm ⇒ null
  if (typeof kWh !== "number" || !Number.isFinite(kWh) || kWh < 0) {
    return null;
  }

  let conLai = kWh;   // số kWh chưa được tính tiền
  let tien = 0;
  // Đi qua từng bậc; dừng sớm khi đã tính hết
  for (let i = 0; i < RONG_BAC.length && conLai > 0; i++) {
    const phan = Math.min(conLai, RONG_BAC[i]);  // phần rơi vào bậc i
    tien = tien + phan * GIA_BAC[i];
    conLai = conLai - phan;
  }
  return Math.round(tien);
}
`,
      },
      giaiThich: `<p>Lỗi của bản cũ là hiểu sai luật: nó lấy <em>cả</em> 150 kWh nhân giá bậc 3 (ra 325050đ), trong khi luật bậc thang chỉ áp giá bậc 3 cho 50 kWh cuối. Cách đúng là "đổ nước qua các bậc": mỗi vòng lấy phần còn lại vừa với bậc hiện tại (${c('Math.min')}), tính tiền, trừ đi, sang bậc sau. Bậc cuối rộng ${c('Infinity')} nên mọi phần vượt 400 rơi vào đó.</p>
<p>Chốt chặn đầu vào đứng đầu hàm (mẫu "trả về sớm" của Bài 4.3): ${c('typeof')} loại chuỗi, ${c('Number.isFinite')} loại cả ${c('NaN')} lẫn ${c('Infinity')}. Máy chấm thử 10 mức (biên 50/100/200/300/400, số lẻ, rất lớn) và 5 đầu vào sai.</p>`,
      loiHayGap: [
        `Nhân cả tổng với giá một bậc (như bản cũ) — 150 kWh ra 325050 thay vì 291950.`,
        `Dùng ${c('if (!kWh) return null')} — chặn luôn 0 kWh hợp lệ (0 là falsy!).`,
        `Kiểm ${c('kWh === NaN')} — không bao giờ đúng; dùng ${c('Number.isNaN')} hoặc ${c('Number.isFinite')}.`,
        `Làm tròn từng bậc rồi cộng — với số lẻ có thể lệch 1 đồng; làm tròn MỘT lần ở cuối.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite',
      kiem: [
        { moTa: 'tienDien(0) = 0', goi: 'tienDien(0)', mongDoi: 0 },
        { moTa: 'tienDien(50) = 90300', goi: 'tienDien(50)', mongDoi: 90300 },
        { moTa: 'tienDien(150) = 291950', goi: 'tienDien(150)', mongDoi: 291950 },
        { moTa: 'Biên 100, 200, 300, 400', goi: '[tienDien(100), tienDien(200), tienDien(300), tienDien(400)]', mongDoi: [183600, 400300, 673200, 978200] },
        { moTa: 'Trên 400: tienDien(500) = 1293300', goi: 'tienDien(500)', mongDoi: 1293300 },
        { moTa: 'Số lẻ: tienDien(10.5) = 18963', goi: 'tienDien(10.5)', mongDoi: 18963 },
        { moTa: 'Đầu vào sai → null', goi: '[tienDien(-5), tienDien("100"), tienDien(NaN), tienDien(Infinity), tienDien(undefined)]', mongDoi: [null, null, null, null, null] },
        { moTa: 'Bộ ẩn: tienDien(1000)', goi: 'tienDien(1000)', mongDoi: 2868800, an: true },
      ],
    },
  ],
});
