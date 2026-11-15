// Bảng vết LC 1249 bản ngăn xếp chỉ số: chạy THẬT, ghi ngăn xếp '(' và tập chỉ số phải xoá sau từng ký tự.
export function vetXoaNgoac(s) {
  const open = [];
  const remove = new Set();
  const hang = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    let viec = 'giữ chữ';
    if (ch === '(') { open.push(i); viec = 'push ' + i; }
    else if (ch === ')') {
      if (open.length) viec = 'pop ' + open.pop();
      else { remove.add(i); viec = 'xoá ' + i; }
    }
    hang.push({ i, ch, viec, stack: [...open], remove: [...remove] });
  }
  for (const i of open) remove.add(i);
  const out = [...s].filter((_, i) => !remove.has(i)).join('');
  return { hang, conLai: [...open], remove: [...remove].sort((a, b) => a - b), out };
}
