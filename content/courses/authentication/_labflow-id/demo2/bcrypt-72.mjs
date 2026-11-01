// demo2/bcrypt-72.mjs — lesson 2.2: bcrypt reads only the first 72 BYTES. Vietnamese letters take 2–3 bytes each in UTF-8.
import bcrypt from 'bcrypt';
const base = 'Mật khẩu của tôi là câu thơ dài: Trăm năm trong cõi người ta, chữ tài';   // 69 characters
console.log(`${[...base].length} characters = ${Buffer.byteLength(base)} bytes`);
const stored = await bcrypt.hash(base + ' chữ mệnh khéo là ghét nhau', 10);
console.log('verify with a different ending:', await bcrypt.compare(base + ' — anything at all', stored));
