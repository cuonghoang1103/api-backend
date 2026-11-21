// chay: tay — được các trang .html nạp
// Print the values the browser actually applied, so you can prove the theme works.
const css = getComputedStyle(document.documentElement);
const btn = getComputedStyle(document.querySelector('.btn'));
console.log('theme attr: ' + (document.documentElement.dataset.theme || '(none)') +
  ' | prefers dark: ' + matchMedia('(prefers-color-scheme: dark)').matches +
  ' | reduced motion: ' + matchMedia('(prefers-reduced-motion: reduce)').matches);
console.log('--color-bg = ' + css.getPropertyValue('--color-bg').trim() + ' | button background = ' + btn.backgroundColor + ' | transition = ' + btn.transitionDuration);
