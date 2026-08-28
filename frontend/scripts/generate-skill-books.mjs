import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SKILL_BOOKS } from './skill-books-plan.mjs';
import { renderFrameworkDiagram, svgCompare } from './skill-diagrams.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const booksDir = path.resolve(here, '../public/books');
const guidesDir = path.resolve(here, 'skill-books-guides');

const CSS = `
:root{--paper:#f4f5f7;--leaf:#fff;--leaf2:#eceff3;--rule:#d3d9e2;--firm:#aeb8c7;--ink:#151a21;--soft:#55606f;--faint:#788397;--accent:#6b3a6e;--deep:#4d2850;--wash:#eee2ef;--go:#1b6446;--gow:#dceee5;--warn:#875200;--warnw:#f7ead2;--stop:#9e2a20;--stopw:#f8e1de;--lift:0 1px 2px #13181f0f,0 12px 30px -22px #13181f59}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#0e1116;--leaf:#151a21;--leaf2:#1b212a;--rule:#28313d;--firm:#3c4857;--ink:#e7ecf3;--soft:#a4afbd;--faint:#7d899b;--accent:#d49bd6;--deep:#e7b9e8;--wash:#301b32;--go:#70cda0;--gow:#123022;--warn:#e0a94f;--warnw:#2b2110;--stop:#ee8279;--stopw:#2f1613;--lift:0 1px 2px #0008,0 12px 30px -22px #000e}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:17.5px/1.7 "Source Serif 4",Georgia,serif;-webkit-font-smoothing:antialiased}.page{max-width:1080px;margin:auto;padding:0 28px 120px}.col{max-width:70ch}p{margin:0 0 1.05em}a{color:var(--accent);text-underline-offset:2px}strong{font-weight:650}code,.mono{font-family:"JetBrains Mono",monospace;font-size:.86em}code{background:var(--leaf2);padding:2px 5px;border-radius:3px}h1,h2,h3{line-height:1.18;text-wrap:balance}h1.book{font-size:clamp(2.7rem,7vw,4.8rem);letter-spacing:-.035em;margin:0 0 20px}h2{font-size:clamp(2rem,4.4vw,2.8rem);letter-spacing:-.02em;margin:0 0 .5em}h3{font-size:1.35rem;margin:2.25em 0 .6em}h3 .n{font:600 .75em "JetBrains Mono",monospace;color:var(--accent);margin-right:.55em}h4{font:700 .78rem "Source Sans 3",sans-serif;letter-spacing:.13em;text-transform:uppercase;color:var(--soft);margin:2em 0 .65em}.titlepage{padding:76px 0 52px;border-bottom:3px double var(--firm);margin-bottom:52px}.series{font:700 11px "Source Sans 3",sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);display:flex;gap:12px;align-items:center;margin-bottom:26px}.series:after{content:"";height:1px;background:var(--firm);flex:1}.sub{font-size:1.24rem;color:var(--soft);max-width:58ch}.byline{font-family:"Source Sans 3",sans-serif;color:var(--soft)}.imprint,.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);margin-top:32px}.imprint div,.stats div{background:var(--leaf);padding:13px 15px}.imprint dt,.stats dt{font:700 9.5px "Source Sans 3",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}.imprint dd,.stats dd{margin:4px 0 0;font:600 .86rem "JetBrains Mono",monospace}.fm{border-top:1px solid var(--rule);padding-top:44px}.fm h2{font-size:1.55rem}.toc{border:1px solid var(--rule);background:var(--leaf);box-shadow:var(--lift)}.toc-row{display:grid;grid-template-columns:2.3rem 1fr auto;gap:16px;padding:11px 20px;border-bottom:1px solid var(--rule);align-items:baseline}.toc-row:last-child{border:0}.toc-n{font:600 .78rem "JetBrains Mono",monospace;color:var(--accent)}.toc-t{font-size:1rem}.toc-t small{display:block;font:400 .8rem "Source Sans 3",sans-serif;color:var(--faint)}.toc-x{font:400 .73rem "Source Sans 3",sans-serif;color:var(--faint);white-space:nowrap}.chap-open{border-top:3px double var(--firm);padding-top:40px;margin-top:64px}.eyebrow{font:700 11px "Source Sans 3",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}.chap-deck{font-size:1.1rem;color:var(--soft);border-left:3px solid var(--accent);padding-left:18px;max-width:64ch}.objectives,.note{border:1px solid var(--rule);border-left:3px solid var(--accent);background:var(--leaf);padding:16px 20px;margin:1.6em 0;box-shadow:var(--lift)}.objectives .lab,.note .t{font:700 .73rem "Source Sans 3",sans-serif;letter-spacing:.11em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}.objectives ul,.note ul{margin:0;padding-left:1.2em}.note.warn{border-left-color:var(--warn);background:var(--warnw)}.note.warn .t{color:var(--warn)}.note.stop{border-left-color:var(--stop);background:var(--stopw)}.note.stop .t{color:var(--stop)}.note.go{border-left-color:var(--go);background:var(--gow)}.note.go .t{color:var(--go)}.tw{overflow:auto;border:1px solid var(--rule);box-shadow:var(--lift);margin:1.6em 0}table{border-collapse:collapse;width:100%;background:var(--leaf);font-size:.9rem}th,td{text-align:left;vertical-align:top;padding:10px 14px;border-bottom:1px solid var(--rule)}th{font:700 .73rem "Source Sans 3",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);background:var(--leaf2)}tr:last-child td{border:0}.steps{counter-reset:step;display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule);box-shadow:var(--lift);margin:1.6em 0}.step{counter-increment:step;display:grid;grid-template-columns:42px 1fr;gap:12px;background:var(--leaf);padding:15px}.step:before{content:counter(step);width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--wash);color:var(--accent);font:700 .8rem "JetBrains Mono",monospace}.step b{display:block}.step span{color:var(--soft);font-size:.94rem}.ex{border:1px solid var(--rule);background:var(--leaf);box-shadow:var(--lift)}.ex-row{display:grid;grid-template-columns:2.5rem 1fr auto;gap:12px;padding:11px 18px;border-bottom:1px solid var(--rule);align-items:baseline}.ex-row:last-child{border:0}.ex-n{font:600 .75rem "JetBrains Mono",monospace;color:var(--faint)}.pill{font:700 9px "Source Sans 3",sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:3px 7px}.pill.e{color:var(--go);background:var(--gow)}.pill.m{color:var(--warn);background:var(--warnw)}.pill.h{color:var(--stop);background:var(--stopw)}details.check{border:1px solid var(--rule);background:var(--leaf);margin:10px 0}details.check summary{cursor:pointer;padding:13px 18px;font-weight:650}details.check .ans{padding:0 18px 14px;color:var(--soft)}.worksheet{border:1px dashed var(--firm);background:var(--leaf2);padding:18px 20px;margin:1.6em 0}.worksheet ol{margin-bottom:0}.cap{font:400 .8rem/1.5 "Source Sans 3",sans-serif;color:var(--faint)}.end{margin-top:70px;padding-top:40px;border-top:3px double var(--firm)}
.diagram{margin:1.6em 0;border:1px solid var(--rule);background:var(--leaf);box-shadow:var(--lift);padding:16px 10px}.diagram svg{width:100%;height:auto;display:block;color:var(--accent)}.diagram figcaption{margin-top:8px}
.refs{border:1px solid var(--rule);background:var(--leaf);box-shadow:var(--lift);margin:1.6em 0;padding:14px 20px}.refs .t{font:700 .73rem "Source Sans 3",sans-serif;letter-spacing:.11em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}.refs ul{margin:0;padding-left:1.2em}.refs li{margin-bottom:.35em}.refs .kind{font:600 .68rem "Source Sans 3",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);margin-right:6px}
@media(max-width:600px){body{font-size:16.5px}.page{padding:0 18px 80px}.toc-row{grid-template-columns:2rem 1fr}.toc-x{display:none}.ex-row{grid-template-columns:2rem 1fr}.pill{display:none}}
`;

function chapterHtml(book, chapter, index, g) {
  const n = index + 1;
  const frameworkDiagram = renderFrameworkDiagram(g);
  const compareDiagram = svgCompare(g.comparison);

  const whyRows = [
    ['Công việc', g.why.work],
    ['Phỏng vấn', g.why.interview],
    ['Học tập', g.why.study],
    ['Đời sống', g.why.life],
  ];

  return `<section class="chap-open" id="ch${n}">
  <div class="eyebrow">Chương ${n} · Quyển ${book.vol}</div>
  <h2>${chapter}</h2>
  <p class="chap-deck">${g.thesis}</p>
  <div class="objectives"><div class="lab">Sau chương này, bạn có thể</div><ul>
    <li>Giải thích kỹ năng bằng hành vi quan sát được, không dùng khẩu hiệu.</li>
    <li>Áp dụng đúng quy trình vào một tình huống thật trong công việc.</li>
    <li>Nhận diện lỗi phổ biến và tạo bằng chứng năng lực dùng được khi phỏng vấn.</li>
  </ul></div>
</section>
<section class="col">
  <h3><span class="n">${n}.1</span>Bản chất của kỹ năng</h3>
  <p>${g.thesis}</p>

  <h3><span class="n">${n}.2</span>Vì sao kỹ năng này đáng học?</h3>
  <div class="tw"><table><thead><tr><th>Bối cảnh</th><th>Giá trị thực tế</th></tr></thead><tbody>${whyRows.map(([a, b]) => `<tr><td><strong>${a}</strong></td><td>${b}</td></tr>`).join('')}</tbody></table></div>

  <h3><span class="n">${n}.3</span>Quy trình ${g.framework.length} bước</h3>
  <div class="steps">${g.framework.map((s) => `<div class="step"><div><b>${s.name}</b><span>${s.detail}</span></div></div>`).join('')}</div>
  <figure class="diagram">${frameworkDiagram}<figcaption class="cap">Sơ đồ minh hoạ quy trình ${g.framework.length} bước.</figcaption></figure>
  <p>Đây là một vòng lặp áp dụng, không phải đường thẳng dùng một lần. Nếu hành động không tạo kết quả, quay lại <strong>${g.framework[0].name}</strong> để kiểm tra dữ liệu trước khi làm mạnh hơn điều cũ; với tình huống rủi ro cao, mời một người khác kiểm tra trước khi tới bước <strong>${g.framework.at(-1).name}</strong>.</p>

  <h3><span class="n">${n}.4</span>Tình huống thực tế</h3>
  <div class="note go"><div class="t">Case: từ phản ứng sang phương pháp</div><p>${g.scenario}</p></div>

  <h3><span class="n">${n}.5</span>Cách yếu và cách trưởng thành</h3>
  <div class="tw"><table><thead><tr><th>Cách yếu</th><th>Cách trưởng thành</th></tr></thead><tbody>${g.comparison.map((c) => `<tr><td>${c.weak}</td><td>${c.mature}</td></tr>`).join('')}</tbody></table></div>
  <figure class="diagram">${compareDiagram}<figcaption class="cap">So sánh trực quan giữa hai cách phản ứng.</figcaption></figure>

  <h3><span class="n">${n}.6</span>Sai lầm thường gặp</h3>
  <div class="note stop"><div class="t">Cạm bẫy cần tránh</div><ul>${g.mistakes.map((m) => `<li>${m}</li>`).join('')}</ul></div>

  <h3><span class="n">${n}.7</span>Worksheet áp dụng ngay</h3>
  <div class="worksheet"><strong>Điền cho một tình huống thật trong 10 phút</strong><ol>${g.worksheet.map((q) => `<li>${q}</li>`).join('')}</ol></div>

  <h3><span class="n">${n}.8</span>Bài tập luyện tập</h3>
  <div class="ex">${g.exercises.map((e, i) => `<div class="ex-row"><span class="ex-n">${String(i + 1).padStart(2, '0')}</span><span><strong>${e.label}.</strong> ${e.text}</span><span class="pill ${e.level}">${e.level === 'e' ? 'Cơ bản' : e.level === 'm' ? 'Ứng dụng' : 'Thực chiến'}</span></div>`).join('')}</div>

  <h3><span class="n">${n}.9</span>Biến kỹ năng thành bằng chứng</h3>
  <div class="note"><div class="t">Dùng cho CV, phỏng vấn, portfolio</div><p>${g.evidence}</p></div>

  <h3>Checkpoint</h3>
  ${g.checkpoints.map((c) => `<details class="check"><summary>${c.q}</summary><div class="ans">${c.a}</div></details>`).join('')}

  <h3>Kế hoạch 7 ngày</h3>
  <div class="note warn"><div class="t">Một kỹ năng, một hành vi, một bằng chứng</div><p>${g.plan7}</p></div>

  <div class="refs"><div class="t">Đọc / xem thêm</div><ul>${g.references.map((r) => `<li><span class="kind">${r.type === 'video' ? 'Video' : 'Bài viết'}</span><a href="${r.url}">${r.label}</a></li>`).join('')}</ul></div>
</section>`;
}

function bookHtml(book, guides) {
  const tasks = book.chapters.length * 8;
  const toc = book.chapters.map((title, i) => `<div class="toc-row"><span class="toc-n">${i + 1}</span><span class="toc-t">${title}<small>${guides[i].thesis}</small></span><span class="toc-x">8 bài tập</span></div>`).join('\n');
  const chapters = book.chapters.map((title, i) => chapterHtml(book, title, i, guides[i])).join('\n');
  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${book.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap">
<style>${CSS.replaceAll('#6b3a6e', book.color.toLowerCase())}</style></head><body><main class="page">
<section class="titlepage col"><div class="series">Bộ kỹ năng toàn diện · Quyển ${book.vol}</div><h1 class="book">${book.title}</h1><p class="sub">${book.subtitle}</p><p class="byline">Viết cho công việc, phỏng vấn, học tập, lãnh đạo và đời sống · <strong>CuongThai Books</strong></p>
<dl class="imprint"><div><dt>Ngôn ngữ</dt><dd>Tiếng Việt</dd></div><div><dt>Chương</dt><dd>${book.chapters.length}</dd></div><div><dt>Bài tập</dt><dd>${tasks}</dd></div><div><dt>Phiên bản</dt><dd>1.0 · 2026</dd></div></dl></section>
<section class="fm col"><h2>Cách dùng cuốn sách</h2><p>Đây là sách thực hành, không phải danh sách lời khuyên. Mỗi chương đi từ bản chất, giá trị, quy trình, tình huống, sai lầm đến worksheet, bài tập, checkpoint và bằng chứng năng lực. Chỉ đọc một chương mỗi tuần cũng được — miễn là bạn mang một hành vi vào tình huống thật và lưu lại bằng chứng.</p><div class="note"><div class="t">Quy tắc đầu ra</div><p>Mỗi chương phải để lại ít nhất một sản phẩm: nhật ký quan sát, quyết định, bản ghi phản hồi, câu chuyện STAR, checklist hoặc số liệu trước–sau. Không có đầu ra thì chưa tính là học xong.</p></div></section>
<section class="fm col"><h2>Mục lục</h2><div class="toc">${toc}</div></section>
${chapters}
<section class="col end"><h2>Tổng kết quyển ${book.vol}</h2><p>Bạn không cần hoàn hảo ở mọi chương. Hãy chọn ba kỹ năng đang tạo nút thắt lớn nhất, luyện trong 30 ngày và thu bằng chứng. Sau đó quay lại đánh giá theo năm mức: chưa biết, biết khái niệm, làm được khi có hướng dẫn, tự làm được, và có thể hướng dẫn người khác.</p><div class="stats"><div><dt>Chương</dt><dd>${book.chapters.length}</dd></div><div><dt>Bài tập</dt><dd>${tasks}</dd></div><div><dt>Chu kỳ gợi ý</dt><dd>14 tuần</dd></div><div><dt>Đầu ra tối thiểu</dt><dd>14 bằng chứng</dd></div></div>
<p class="cap">Nguồn tham khảo được gắn ngay tại từng chương thay vì gộp cuối sách. Với sức khỏe tinh thần hoặc thể chất, sách không thay thế chẩn đoán và điều trị của chuyên gia phù hợp.</p></section>
</main></body></html>`;
}

export { bookHtml, chapterHtml };

// Chỉ thực sự sinh sách khi file này được CHẠY TRỰC TIẾP (node
// generate-skill-books.mjs), không phải khi bị import — cho phép test
// bookHtml()/chapterHtml() độc lập với 1 quyển giả mà không cần đủ
// skill-books-guides/ thật (xem scripts/skill-books-staging/README hoặc
// _test-generator.mjs khi cần).
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const book of SKILL_BOOKS.filter((item) => item.published)) {
    const modPath = path.join(guidesDir, `${book.vol}.mjs`);
    const mod = await import(`${modPath}?t=${Date.now()}`); // bust cache khi chạy generator nhiều lần liên tiếp
    const guides = mod.default;
    if (!guides || guides.length !== book.chapters.length) {
      throw new Error(`Quyển ${book.vol}: cần ${book.chapters.length} guide, đang có ${guides?.length ?? 0} (${modPath})`);
    }
    const target = path.join(booksDir, `${book.slug}.html`);
    writeFileSync(target, bookHtml(book, guides));
    console.log(`generated ${path.relative(process.cwd(), target)}`);
  }
}
