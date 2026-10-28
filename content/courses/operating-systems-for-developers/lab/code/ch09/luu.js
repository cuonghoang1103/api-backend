// luu.js — ba cách lưu một file cấu hình mà code Node hay viết. node luu.js <cách> <file> <nội dung>
//   inplace : writeFileSync thẳng lên file cũ (mở O_TRUNC rồi ghi)          — cách hay gặp nhất
//   rename  : ghi file tạm rồi renameSync đè lên (không fsync)             — nguyên tử, nhưng chưa bền
//   safe    : ghi file tạm → fsync file → rename → fsync thư mục           — nguyên tử VÀ bền
const fs = require('fs');
const path = require('path');
const [cach, file, noiDung] = process.argv.slice(2);

if (cach === 'inplace') {
  fs.writeFileSync(file, noiDung);
} else if (cach === 'rename' || cach === 'safe') {
  const tmp = `${file}.tmp-${process.pid}`;
  const fd = fs.openSync(tmp, 'w', 0o644);
  fs.writeSync(fd, noiDung);
  if (cach === 'safe') fs.fsyncSync(fd);           // dữ liệu của file tạm đã nằm trên đĩa
  fs.closeSync(fd);
  fs.renameSync(tmp, file);                         // đổi tên: người đọc thấy bản cũ HOẶC bản mới, không có giữa chừng
  if (cach === 'safe') {                            // tên mới nằm trong thư mục ⇒ fsync cả thư mục
    const dfd = fs.openSync(path.dirname(file), 'r');
    fs.fsyncSync(dfd);
    fs.closeSync(dfd);
  }
} else {
  console.error('cách: inplace | rename | safe');
  process.exit(2);
}
console.log(`saved (${cach}) ${noiDung.length} bytes`);
