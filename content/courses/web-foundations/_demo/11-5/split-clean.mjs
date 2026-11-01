const raw = '  apple,  banana ,,cherry ;  mango  ';
console.log(raw.split(','));

const items = raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
console.log(items);

const spaced = 'too    many   spaces';
console.log(JSON.stringify(spaced.replace(/\s+/g, ' ')));

function slugify(text) {
  return text
    .normalize('NFD')               // "ọ" -> "o" + combining marks
    .replace(/\p{M}/gu, '')         // remove the marks (accents)
    .replace(/đ/gi, 'd')            // đ has no combining form
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')    // anything else -> one dash
    .replace(/^-|-$/g, '');         // no dash at the ends
}
console.log(slugify('Học JavaScript  Nâng Cao!'));
