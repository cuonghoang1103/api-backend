// demo2/population.mjs — lessons 2.1 and 2.5: 1,000 made-up LabFlow accounts plus An, Binh and Co Lan.
// Passwords follow a rough real-world shape: 30% from the top 100, 40% from the rest of the top 10,000, 30% strong.
import fs from 'node:fs';
import { randomBytes } from 'node:crypto';

export const WORDS = fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\n').filter(Boolean);

export function population() {
  const people = [
    { id: 'usr_1', email: 'an@student.labflow.example', password: 'an-lab-2026' },
    { id: 'usr_2', email: 'binh@student.labflow.example', password: '123456' },
    { id: 'usr_3', email: 'lan@labflow.example', password: 'lan-lab-2026' },
  ];
  for (let i = 4; i <= 1003; i++) {
    const k = i % 10;
    const password = k < 3 ? WORDS[i % 100]
      : k < 7 ? WORDS[100 + ((i * 37) % 9900)]
      : randomBytes(9).toString('base64url');                // 12 random characters
    people.push({ id: `usr_${i}`, email: `sv${i}@student.labflow.example`, password });
  }
  return people;
}
