// vuln.js — CHỈ ĐỂ HỌC (Lab 6): LABFLOW_VULN=1 bật lại những lỗ hổng mà Chương 6 vừa vá, để bộ kiểm audit.mjs thấy ĐỎ.
// Production không bao giờ đặt biến này.
export const VULN = process.env.LABFLOW_VULN === '1';
