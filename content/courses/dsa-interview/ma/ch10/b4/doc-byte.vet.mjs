// Bảng vết của bộ đọc byte (DocNhanh.java › nextLong) — chạy ĐÚNG thuật toán đó trên một chuỗi byte nhỏ,
// ghi trạng thái sau từng byte: đang bỏ qua khoảng trắng, đang gom chữ số, hay vừa xong một số.
export function vetDocByte(text) {
  const bytes = [...Buffer.from(text, 'latin1')];
  let p = 0;
  const readByte = () => (p < bytes.length ? bytes[p++] : -1);
  const hang = [];
  const ten = (c) => (c === -1 ? 'EOF' : c === 10 ? '\\n' : c === 13 ? '\\r' : c === 32 ? '␠' : String.fromCharCode(c));
  const so = [];
  while (true) {
    let c = readByte();
    while (c !== -1 && c !== 45 && (c < 48 || c > 57)) { hang.push({ i: p - 1, b: ten(c), ma: c, viec: 'skip', x: '', so: so.join(' ') }); c = readByte(); }
    if (c === -1) { hang.push({ i: p, b: 'EOF', ma: -1, viec: 'end', x: '', so: so.join(' ') }); break; }
    const neg = c === 45;
    if (neg) { hang.push({ i: p - 1, b: '-', ma: c, viec: 'sign', x: '−', so: so.join(' ') }); c = readByte(); }
    let x = 0;
    while (c >= 48 && c <= 57) {
      x = x * 10 + (c - 48);
      hang.push({ i: p - 1, b: ten(c), ma: c, viec: `x = x*10 + ${c - 48}`, x: (neg ? '−' : '') + x, so: so.join(' ') });
      c = readByte();
    }
    so.push(neg ? -x : x);
    hang.push({ i: c === -1 ? p : p - 1, b: ten(c), ma: c, viec: 'number done', x: '', so: so.join(' ') });
    if (c === -1) break;
  }
  return hang;
}
