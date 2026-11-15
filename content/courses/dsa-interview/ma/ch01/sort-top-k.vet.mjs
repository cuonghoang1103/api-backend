// Bảng vết LC 347 bằng xô theo tần suất: đếm → bỏ vào xô bucket[tần suất] → quét xô từ cao xuống.
export function vetTopKBucket(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  const bucket = Array.from({ length: nums.length + 1 }, () => []);
  const fmtB = () => bucket.map((b, f) => (b.length ? `${f}:[${b.join(',')}]` : null)).filter(Boolean).join('  ');
  const hang = [];
  for (const [v, c] of count) {
    bucket[c].push(v);
    hang.push({ buoc: `put ${v} (count ${c}) into bucket[${c}]`, xo: fmtB(), out: '[]' });
  }
  const out = [];
  for (let f = nums.length; f >= 1 && out.length < k; f--) {
    if (!bucket[f].length) continue;
    for (const v of bucket[f]) { out.push(v); if (out.length === k) break; }
    hang.push({ buoc: `scan bucket[${f}] → take ${bucket[f].slice(0, k).join(', ')}`, xo: fmtB(), out: JSON.stringify(out) });
  }
  return { count: [...count], hang };
}
