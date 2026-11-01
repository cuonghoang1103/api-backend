// practical check: something@something.something, no spaces
const simple = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputs = [
  'lan@example.com',
  'lan.nguyen+shop@mail.co',
  'lan@localhost',
  'lan @example.com',
  'lan@@example.com',
  'a@b.c',
];
for (const s of inputs) console.log(s.padEnd(26), simple.test(s));
