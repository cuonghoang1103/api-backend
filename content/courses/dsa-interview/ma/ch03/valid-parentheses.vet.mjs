// Bảng vết Valid Parentheses: chạy thuật toán THẬT, ghi stack sau từng ký tự.
export function vetNgoac(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  const hang = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const truoc = stack.join(' ');
    let viec, ok = true;
    if ('([{'.includes(c)) { stack.push(c); viec = `push ${c}`; }
    else if (stack.length === 0) { viec = 'stack empty'; ok = false; }
    else { const o = stack.pop(); ok = o === pair[c]; viec = `pop ${o} ${ok ? '✓ matches' : '✗ expected ' + pair[c]}`; }
    hang.push({ i, c, truoc, viec, sau: stack.join(' '), ok });
    if (!ok) return { hang, kq: false };
  }
  return { hang, kq: stack.length === 0 };
}
