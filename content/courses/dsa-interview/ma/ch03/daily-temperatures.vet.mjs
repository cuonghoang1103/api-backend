// Bảng vết Daily Temperatures (monotonic stack): chạy thuật toán THẬT, ghi stack trước/sau mỗi ngày.
export function vetDaily(t) {
  const ans = new Array(t.length).fill(0);
  const st = [];
  const hang = [];
  for (let i = 0; i < t.length; i++) {
    const truoc = [...st];
    const bop = [];
    while (st.length && t[i] > t[st[st.length - 1]]) {
      const j = st.pop();
      ans[j] = i - j;
      bop.push(j);
    }
    st.push(i);
    hang.push({ i, ti: t[i], truoc, bop, sau: [...st], ans: [...ans] });
  }
  return hang;
}
