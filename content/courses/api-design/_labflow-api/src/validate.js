// validate.js — một middleware cho mọi lược đồ: sai ⇒ 400 kèm MỌI lỗi (theo ngôn ngữ người gọi); đúng ⇒ req.valid
import { HttpError } from './http.js';
import { pickLang, zodLocale, UNKNOWN_FIELD, RULE_TEXT } from './i18n.js';

// ['profile', 'color'] ⇒ '#/profile/color'  (JSON Pointer, RFC 6901: '~' ⇒ '~0', '/' ⇒ '~1')
export const toPointer = (path) =>
  '#' + path.map((p) => '/' + String(p).replaceAll('~', '~0').replaceAll('/', '~1')).join('');

function toErrors(issues, where, lang) {
  return issues.flatMap((i) => {
    const paths = i.code === 'unrecognized_keys' ? i.keys.map((k) => [...i.path, k]) : [i.path];
    const detail = i.code === 'unrecognized_keys' ? UNKNOWN_FIELD[lang]
      : i.code === 'custom' ? (RULE_TEXT[lang][i.message] ?? i.message) : i.message;
    return paths.map((p) => (where === 'query'
      ? { parameter: String(p[0]), detail }       // lỗi ở query: tên tham số
      : { pointer: toPointer(p), detail }));      // lỗi ở body: JSON Pointer
  });
}

// schema: một lược đồ, HOẶC { 1: lượcĐồV1, 2: lượcĐồV2 } — chọn theo req.apiVersion (Chương 4)
export const validate = (where, schemas) => (req, res, next) => {
  const lang = pickLang(req);
  const schema = schemas.safeParse ? schemas : schemas[req.apiVersion ?? 1];
  const parse = () => schema.safeParse(req[where] ?? {}, { error: zodLocale(lang) });
  const r = req.timing ? req.timing.time('validate', parse) : parse();   // bài 8.1: đo cả bước kiểm
  if (!r.success) {
    const errors = toErrors(r.error.issues, where, lang);
    throw new HttpError(400, where === 'query' ? 'INVALID_QUERY' : 'VALIDATION_FAILED', { count: errors.length }, errors);
  }
  req.valid = { ...req.valid, [where]: r.data };   // Express 5: req.query chỉ đọc, không gán lại được
  next();
};
