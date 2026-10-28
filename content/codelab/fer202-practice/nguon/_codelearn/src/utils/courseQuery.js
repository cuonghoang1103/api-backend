//@from F3
// src/utils/courseQuery.js — lọc / tìm / sắp / phân trang danh sách khoá học: hàm THUẦN, không đụng state
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const PAGE_SIZE = 6;
export const SORTS = [
  ['newest', 'Newest first'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['title', 'Title A → Z'],
];

// Đọc bộ lọc từ URL (?category=1&level=Beginner&price=free&q=react&sort=price-asc&page=2) — URL là nguồn sự thật
export function readFilters(searchParams) {
  return {
    category: searchParams.get('category') ?? '',
    level: searchParams.get('level') ?? '',
    price: searchParams.get('price') ?? '',
    q: searchParams.get('q') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
    page: Number(searchParams.get('page')) || 1,
  };
}

const COMPARE = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  title: (a, b) => a.title.localeCompare(b.title),
};

export function applyCourseQuery(courses, { category, level, price, q, sort }) {
  const keyword = q.trim().toLowerCase();
  return courses
    // categoryId là SỐ, giá trị trên URL là CHUỖI ⇒ so bằng String()
    .filter((c) => !category || String(c.categoryId) === category)
    .filter((c) => !level || c.level === level)
    .filter((c) => !price || (price === 'free' ? c.price === 0 : c.price > 0))
    .filter((c) => !keyword || c.title.toLowerCase().includes(keyword) || c.instructor.toLowerCase().includes(keyword))
    .slice()                                  // sort() sửa mảng tại chỗ — sắp trên BẢN SAO
    .sort(COMPARE[sort] ?? COMPARE.newest);
}

// trang đã "kẹp" vào [1, totalPages] — URL ?page=99 không làm trang trắng
export function paginate(list, page, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  return { items: list.slice((current - 1) * size, current * size), page: current, totalPages };
}
