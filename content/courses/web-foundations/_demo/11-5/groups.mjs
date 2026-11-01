const date = '2026-11-01';
const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
console.log('groups by number:', m[1], m[2], m[3]);

const n = date.match(/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/);
console.log('named groups    :', n.groups.day + '/' + n.groups.month + '/' + n.groups.year);

// replace with $1, $2 ... or with a function
console.log('2026-11-01'.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1'));
console.log('price: 1200000'.replace(/\d+/, (digits) => Number(digits).toLocaleString('vi-VN') + 'đ'));

// matchAll: every match WITH its groups
const text = 'Lan: 9, Minh: 7, Chi: 10';
for (const r of text.matchAll(/(\w+): (\d+)/g)) console.log(r[1], '->', Number(r[2]));
