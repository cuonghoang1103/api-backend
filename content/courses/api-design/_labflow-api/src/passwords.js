// passwords.js — bài 6.1: băm mật khẩu bằng scrypt (có sẵn trong node:crypto, chậm có chủ đích, có salt)
// Bài 8.2: kiểm mật khẩu bằng scrypt BẤT ĐỒNG BỘ — chạy trên threadpool của libuv, không chặn event loop
import { scrypt, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export function hashPassword(password) {          // chỉ dùng lúc khởi động (dữ liệu mẫu) ⇒ bản đồng bộ là được
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = await scryptAsync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));       // so trong thời gian không đổi
}
