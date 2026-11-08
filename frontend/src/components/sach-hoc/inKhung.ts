/**
 * In MỘT phần trang (bản sách, bộ slide) cho sạch: chép phần tử vào một iframe ẩn cùng toàn bộ CSS của
 * trang rồi in iframe đó (09/11/2026). Cách "ẩn mọi thứ khác bằng @media print" đã thử và hỏng: nền tối
 * của chủ đề vẫn in ra, phần sách bị kẹt trong cột giữa (chỉ rộng nửa trang A4), 151 trang. Iframe thì
 * khổ giấy là của riêng nó — web và app desktop (Electron) như nhau.
 *
 * `lop` = lớp gắn lên thẻ bọc bản chép (vd. lớp `.root` của khoá + `noFuri`) để CSS furigana/romaji vẫn ăn.
 * `trangNgang` = in khổ ngang (slide 16:9).
 */
export function inKhung(el: HTMLElement, { lop = '', trangNgang = false, tieuDe = '' }: { lop?: string; trangNgang?: boolean; tieuDe?: string } = {}) {
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true');
  Object.assign(f.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0', visibility: 'hidden' });
  document.body.appendChild(f);
  const d = f.contentDocument!;
  const css = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((n) => n.outerHTML).join('\n');
  d.open();
  d.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${tieuDe.replace(/</g, '')}</title>${css}
<style>
  @page { size: A4 ${trangNgang ? 'landscape' : 'portrait'}; margin: ${trangNgang ? '8mm' : '14mm 13mm'}; }
  html, body { background: #fff !important; color: #111 !important; margin: 0; padding: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .ct-in-goc { min-height: 0 !important; padding: 0 !important; background: #fff !important; }
</style></head><body><div class="ct-in-goc ${lop}"></div></body></html>`);
  d.close();
  const goc = d.querySelector('.ct-in-goc')!;
  const ban = d.importNode(el, true) as HTMLElement;
  ban.style.display = 'block'; // phần bản in của bộ slide vốn display:none trên màn hình
  goc.appendChild(ban);
  const don = () => window.setTimeout(() => f.remove(), 1000);
  const anh = [...d.images].filter((i) => !i.complete);
  const chay = () => {
    f.contentWindow!.focus();
    f.contentWindow!.addEventListener('afterprint', don);
    f.contentWindow!.print();
    // Một số trình duyệt không bắn afterprint trong iframe — dọn muộn để khỏi rò khung.
    window.setTimeout(() => f.isConnected && f.remove(), 120000);
  };
  // Chờ ảnh + phông trong iframe (tối đa 4 giây) rồi mới in, không thì trang in thiếu hình.
  Promise.race([
    Promise.all([d.fonts?.ready, ...anh.map((i) => new Promise((r) => { i.onload = r; i.onerror = r; }))]),
    new Promise((r) => window.setTimeout(r, 4000)),
  ]).then(chay);
  return f;
}
