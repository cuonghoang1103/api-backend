//@from F2
// src/utils/validators.js — luật kiểm dữ liệu form, viết THUẦN (nhận dữ liệu ⇒ trả { tênÔ: 'thông điệp' })
// Component chỉ việc gọi và hiện lỗi; một luật sửa ở một chỗ. Object rỗng = hợp lệ.
//#F9
import { toEmbedUrl } from './learning';
//#end

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkEmail(email) {
  const v = email.trim();
  if (!v) return 'Email is required';
  if (!EMAIL_RE.test(v)) return 'Email is not valid';
  return null;
}

function checkPassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

// bỏ các ô không lỗi (null) ⇒ object chỉ còn lỗi thật
const clean = (errors) => Object.fromEntries(Object.entries(errors).filter(([, v]) => v));

export function validateLogin({ email, password }) {
  return clean({ email: checkEmail(email), password: checkPassword(password) });
}

export function validateRegister({ fullName, email, password, confirmPassword }) {
  return clean({
    fullName: fullName.trim().length < 3 ? 'Full name must be at least 3 characters' : null,
    email: checkEmail(email),
    password: checkPassword(password),
    confirmPassword: confirmPassword !== password ? 'Passwords do not match' : null,
  });
}
//#F9

// Khoá học (thêm / sửa). allCourses để kiểm trùng tên; editingId = id đang sửa (được trùng với chính nó)
export function validateCourse(form, allCourses = [], editingId = null) {
  const title = form.title.trim();
  const price = String(form.price).trim();
  let titleError = null;
  if (title.length < 5 || title.length > 100) titleError = 'Title must be between 5 and 100 characters';
  else if (allCourses.some((c) => c.id !== editingId && c.title.trim().toLowerCase() === title.toLowerCase())) {
    titleError = 'A course with this title already exists';
  }
  let priceError = null;
  if (price === '') priceError = 'Price is required';
  else if (!/^\d+$/.test(price) || Number(price) > 10000000) priceError = 'Price must be a whole number between 0 and 10,000,000';
  return clean({
    title: titleError,
    categoryId: form.categoryId === '' ? 'Please choose a category' : null,
    level: form.level === '' ? 'Please choose a level' : null,
    price: priceError,
    instructor: form.instructor.trim() === '' ? 'Instructor is required' : null,
    description: form.description.trim().length < 20 ? 'Description must be at least 20 characters' : null,
    thumbnail: form.thumbnail.trim() && !/^https?:\/\/\S+$/.test(form.thumbnail.trim()) ? 'Thumbnail must be a valid http(s) URL' : null,
  });
}

export function validateChapter(title, chapters = []) {
  const t = title.trim();
  if (t.length < 3) return 'Chapter title must be at least 3 characters';
  if (chapters.some((c) => c.title.trim().toLowerCase() === t.toLowerCase())) return 'This chapter already exists';
  return null;
}

export function validateLesson(form) {
  const duration = String(form.duration).trim();
  return clean({
    chapterId: form.chapterId === '' ? 'Please choose a chapter' : null,
    title: form.title.trim().length < 3 ? 'Lesson title must be at least 3 characters' : null,
    videoUrl: toEmbedUrl(form.videoUrl.trim()) === '' ? 'Video must be a YouTube link (youtube.com/watch?v=… or youtu.be/…)' : null,
    duration: !/^\d+$/.test(duration) || Number(duration) < 1 || Number(duration) > 300 ? 'Duration must be a whole number of minutes (1-300)' : null,
    content: form.content.trim().length < 10 ? 'Content must be at least 10 characters' : null,
  });
}
//#end
//#F10

export function validateQuestion(form) {
  const options = form.options.map((o) => o.trim());
  let optionsError = null;
  if (options.some((o) => o === '')) optionsError = 'All 4 options are required';
  else if (new Set(options.map((o) => o.toLowerCase())).size < options.length) optionsError = 'Options must be different';
  return clean({
    content: form.content.trim().length < 10 ? 'Question must be at least 10 characters' : null,
    options: optionsError,
    answer: form.answer === '' ? 'Please choose the correct answer' : null,
  });
}
//#end
