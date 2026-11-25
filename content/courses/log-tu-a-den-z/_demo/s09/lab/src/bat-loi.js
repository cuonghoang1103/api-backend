// bat-loi.js — gửi lỗi phía giao diện về máy chủ (bài 9.5). Gọn, an toàn, có giới hạn.
const DA_GUI = new Map();          // chữ ký lỗi → số lần, để không gửi trùng
let conLai = 10;                   // tối đa 10 báo cáo mỗi lần tải trang

function chuKy(loai, tin, tep, dong) { return `${loai}|${tin}|${tep}:${dong}`; }

function che(s) {                  // xoá thứ trông như bí mật trước khi gửi
  return String(s)
    .replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, '[JWT]')
    .replace(/([?&](token|code|password|key)=)[^&\s]+/gi, '$1[CHE]')
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[EMAIL]');
}

export function guiLoi(loai, loi, tep, dong, cot) {
  if (!loi) return;
  if (loi.target && loi.target !== window && loi.target.src !== undefined) {
    loi = { name: 'ResourceError', message: 'không tải được ' + (loi.target.src || loi.target.href) };
  }
  const tin = loi instanceof Error ? `${loi.name}: ${loi.message}` : String(loi.message || loi);
  const k = chuKy(loai, tin, tep, dong);
  DA_GUI.set(k, (DA_GUI.get(k) || 0) + 1);
  if (DA_GUI.get(k) > 1 || conLai-- <= 0) return;
  const bao = {
    loai, tin: che(tin), stack: che(loi.stack || ''), tep, dong, cot,
    trang: che(location.href), phienBan: '1.4.2', ua: navigator.userAgent.slice(0, 120), luc: new Date().toISOString(),
  };
  navigator.sendBeacon('/rum', new Blob([JSON.stringify(bao)], { type: 'application/json' }));
}
