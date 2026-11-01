// problems.js — RFC 9457 Problem Details: MỘT chỗ quyết định một lỗi trông thế nào
import { pickLang, texts } from './i18n.js';

export const PROBLEM_BASE = 'https://labflow.example/problems/';

// 'BOOKING_CONFLICT' ⇒ 'https://labflow.example/problems/booking-conflict'
export const typeOf = (code) => PROBLEM_BASE + code.toLowerCase().replaceAll('_', '-');

export function sendProblem(req, res, { status, code, params, ...extra }) {
  const lang = pickLang(req);
  const { title, detail } = texts(lang, code, params);    // câu chữ dựng Ở ĐÂY, theo ngôn ngữ người gọi
  res.status(status)
    .set('Content-Language', lang)                        // body này viết bằng ngôn ngữ nào
    .vary('Accept-Language')                              // cache: cùng URL, khác ngôn ngữ ⇒ khác body
    .type('application/problem+json')
    .json({ type: typeOf(code), title, status, detail, instance: req.originalUrl, code, ...extra });
}
