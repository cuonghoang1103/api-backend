// chay: tay — được index.html nạp; dán vào Console của trang bất kỳ cũng chạy
// Milestone 2 self-check: paste into the Console of ANY page of your project.
(function checkSkeleton() {
  const count = (sel) => document.querySelectorAll(sel).length;
  const problems = [];
  for (const tag of ['header', 'nav', 'main', 'footer']) if (count(tag) === 0) problems.push('no <' + tag + '>');
  if (count('main') > 1) problems.push('more than one <main>');
  if (count('h1') !== 1) problems.push(count('h1') + ' <h1> (want exactly 1)');
  document.querySelectorAll('img:not([alt])').forEach((img) => problems.push('img without alt: ' + img.getAttribute('src')));
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'hidden' || el.type === 'submit') return;
    const labelled = (el.id && document.querySelector('label[for="' + el.id + '"]')) || el.closest('label') || el.getAttribute('aria-label');
    if (!labelled) problems.push('field without a label: ' + (el.name || el.outerHTML.slice(0, 40)));
  });
  document.querySelectorAll('a').forEach((a) => { if (!a.getAttribute('href')) problems.push('link without href: ' + a.textContent.trim()); });
  const levels = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]));
  levels.forEach((lv, i) => { if (i && lv > levels[i - 1] + 1) problems.push('heading jumps from h' + levels[i - 1] + ' to h' + lv); });
  console.log('landmarks:', ['header', 'nav', 'main', 'footer'].map((t) => t + '=' + count(t)).join(' '));
  console.log('headings:', levels.map((l) => 'h' + l).join(' > '));
  console.log(problems.length ? 'PROBLEMS (' + problems.length + '):\n- ' + problems.join('\n- ') : 'skeleton OK');
})();
