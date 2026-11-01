// i18n.js — chọn ngôn ngữ theo header Accept-Language (RFC 9110 §12.5.4)
import { z } from 'zod';
import { MESSAGES } from './messages.js';

export const SUPPORTED = ['vi', 'en'];
export const DEFAULT_LANG = 'vi';

// 'en-US,en;q=0.9,vi;q=0.8' ⇒ 'en'; không gửi header ⇒ 'vi' (cái đầu danh sách); 'fr' ⇒ false ⇒ mặc định 'vi'
export const pickLang = (req) => req.acceptsLanguages(...SUPPORTED) || DEFAULT_LANG;

export function texts(lang, code, params = {}) {
  const [title, detail] = MESSAGES[lang][code] ?? MESSAGES[lang].INTERNAL;
  return { title, detail: detail(params) };
}

// Thông báo lỗi của Zod theo đúng ngôn ngữ của request (Zod 4 có sẵn bộ tiếng Việt)
export const zodLocale = (lang) => z.locales[lang]().localeError;
export const UNKNOWN_FIELD = { vi: 'trường không được hỗ trợ', en: 'unknown field' };
// Luật tự viết (refine) mang MÃ, không mang câu ⇒ dịch được như mọi lỗi khác (bài 2.4)
export const RULE_TEXT = {
  vi: { TO_AFTER_FROM: 'to phải sau from' },
  en: { TO_AFTER_FROM: 'to must be after from' },
};
