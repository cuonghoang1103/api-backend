// Bảng vết Largest Rectangle in Histogram: chạy THẬT, ghi stack + mỗi hình chữ nhật được "chốt".
export function vetHistogram(h) {
  const st = [];
  let best = 0;
  const hang = [];
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];
    const truoc = [...st];
    const chot = [];
    while (st.length && cur < h[st[st.length - 1]]) {
      const j = st.pop();
      const left = st.length ? st[st.length - 1] : -1;
      const w = i - left - 1;
      best = Math.max(best, h[j] * w);
      chot.push({ j, cao: h[j], rong: w, dt: h[j] * w });
    }
    st.push(i);
    hang.push({ i, cur, truoc, chot, sau: [...st], best });
  }
  return hang;
}
