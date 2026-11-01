// Formats a number of đồng: 450000 → "450.000 ₫"
export function formatVnd(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Never imported anywhere — a production build should drop it ("tree shaking")
export function unusedReportGenerator(rows) {
  return rows.map((r) => `${r.name}: ${r.total}`).join('\n') + '\nGENERATED_REPORT_MARKER';
}
