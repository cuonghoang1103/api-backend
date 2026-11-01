// demo0/th08.mjs — practice (Start here 1/2): a card for Binh, and what happens when the server's key changes.
import { createHmac, timingSafeEqual } from 'node:crypto';

const maker = (key) => {
  const stamp = (value) => createHmac('sha256', key).update(value).digest('base64url');
  return {
    issue: (value) => `${value}.${stamp(value)}`,
    check(card) {
      const i = card.lastIndexOf('.');
      const value = card.slice(0, i);
      const a = Buffer.from(stamp(value)); const b = Buffer.from(card.slice(i + 1));
      return a.length === b.length && timingSafeEqual(a, b) ? value : null;
    },
  };
};
const monday = maker('demo-key-monday');
const card = monday.issue('user=Binh;role=STUDENT');
console.log('Binh, same key       :', monday.check(card));
console.log('Binh renamed to An   :', monday.check(card.replace('user=Binh', 'user=An')));
const tuesday = maker('demo-key-tuesday'); // the server was restarted with a NEW key
console.log('old card, new key    :', tuesday.check(card));
