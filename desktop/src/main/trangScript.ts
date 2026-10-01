/**
 * Đoạn JavaScript chạy BÊN TRONG trang của trình duyệt nhúng (`browser.ts`).
 *
 * Tách riêng, không import `electron`, để kiểm được trên Chromium thật
 * (`trangScript.test.ts`): đây là mã chạy trên DOM của trang người khác — đọc
 * thì cái nào cũng "trông đúng", chỉ chạy trên một trang thật mới biết khung
 * cuộn bên trong có được tìm ra hay không.
 */

/** Cuộn trang (hoặc khung cuộn lớn nhất nếu trang không cuộn) rồi trả vị trí. */
export function maCuonTrang(huong: 'xuong' | 'len' | 'dau' | 'cuoi' | null, den?: string): string {
  return `(() => {
    const den = ${den ? JSON.stringify(den) : 'null'};
    if (den) {
      const e = document.querySelector(den);
      if (!e) return { ok: false, loi: 'không thấy phần tử "' + den + '"' };
      e.scrollIntoView({ block: 'start' });
    }
    const goc = document.scrollingElement || document.documentElement;
    let k = goc;
    if (goc.scrollHeight <= goc.clientHeight + 4) {
      let tot = null, dt = 0;
      for (const e of document.querySelectorAll('*')) {
        if (e.scrollHeight <= e.clientHeight + 4) continue;
        const st = getComputedStyle(e);
        if (!/(auto|scroll|overlay)/.test(st.overflowY)) continue;
        const r = e.getBoundingClientRect();
        const d = r.width * r.height;
        if (r.width > 0 && r.height > 0 && d > dt) { dt = d; tot = e; }
      }
      if (tot) k = tot;
    }
    const huong = ${JSON.stringify(huong)};
    const buoc = k.clientHeight * 0.9;
    if (huong === 'xuong') k.scrollTop += buoc;
    else if (huong === 'len') k.scrollTop -= buoc;
    else if (huong === 'dau') k.scrollTop = 0;
    else if (huong === 'cuoi') k.scrollTop = k.scrollHeight;
    return { ok: true, y: Math.round(k.scrollTop), cao: Math.round(k.clientHeight), tong: Math.round(k.scrollHeight), trongKhung: k !== goc };
  })()`;
}

/** Ảnh trên trang: <img> + ảnh nền CSS của khối đủ lớn. */
export const MA_LIET_KE_ANH = `(() => {
    const ra = [], thay = new Set(), cao = innerHeight;
    const them = (src, alt, w, h, r) => {
      if (!src || thay.has(src) || !/^https?:/.test(src) || w * h < 64 * 64) return;
      thay.add(src);
      ra.push({ src, alt: (alt || '').trim().slice(0, 160), rong: Math.round(w), cao: Math.round(h),
        dangHien: r.bottom > 0 && r.top < cao });
    };
    for (const i of document.images) {
      const r = i.getBoundingClientRect();
      // Lọc theo cỡ ĐANG HIỂN THỊ (icon 512px vẽ ở 16px vẫn là icon); ảnh chưa
      // vẽ (lười tải, ẩn) thì mới dùng cỡ gốc của file.
      const ve = r.width > 0 && r.height > 0;
      them(i.currentSrc || i.src, i.alt || i.title, ve ? r.width : i.naturalWidth, ve ? r.height : i.naturalHeight, r);
    }
    for (const e of document.querySelectorAll('div,section,figure,a,span')) {
      const bg = getComputedStyle(e).backgroundImage;
      // Ngoặc viết bằng lớp ký tự [(] [)], KHÔNG dùng dấu gạch chéo ngược: đây là
      // template literal, dấu đó bị nuốt và regex thành một nhóm (trangScript.test.ts).
      const m = /url[(]["']?([^"')]+)["']?[)]/.exec(bg || '');
      if (!m) continue;
      const r = e.getBoundingClientRect();
      if (r.width * r.height < 120 * 120) continue;
      try { them(new URL(m[1], location.href).href, e.getAttribute('aria-label') || '', r.width, r.height, r); } catch (_) { /* url lạ */ }
    }
    return ra;
  })()`;
