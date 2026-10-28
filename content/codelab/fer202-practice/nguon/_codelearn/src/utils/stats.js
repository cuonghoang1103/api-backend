//@from F11
// src/utils/stats.js — tính số liệu thống kê từ dữ liệu thô: hàm THUẦN (cùng dữ liệu vào ⇒ cùng kết quả)

const countBy = (list, key) => list.reduce((acc, x) => ({ ...acc, [x[key]]: (acc[x[key]] ?? 0) + 1 }), {});

export function computeStats({ users, courses, enrollments, results, categories }) {
  const priceOf = new Map(courses.map((c) => [c.id, c.price]));
  const courseOf = new Map(courses.map((c) => [c.id, c]));
  const perCourse = countBy(enrollments, 'courseId');

  // khoá phổ biến: nhiều lượt đăng ký nhất; hoà ⇒ theo tên A → Z; tối đa 5; bỏ khoá chưa ai học
  const popular = courses
    .map((c) => ({ id: c.id, title: c.title, count: perCourse[c.id] ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))
    .slice(0, 5);

  // lượt đăng ký theo tháng: "2026-09-12" ⇒ "2026-09", sắp tăng dần, nhãn "09/2026"
  const perMonth = countBy(enrollments.map((e) => ({ month: e.enrolledAt.slice(0, 7) })), 'month');
  const byMonth = Object.keys(perMonth).sort().map((m) => ({ label: `${m.slice(5, 7)}/${m.slice(0, 4)}`, value: perMonth[m] }));

  const byCategory = categories.map((cat) => ({
    label: cat.name,
    value: enrollments.filter((e) => courseOf.get(e.courseId)?.categoryId === cat.id).length,
  }));

  const passed = results.filter((r) => r.passed).length;
  return {
    totalCourses: courses.length,
    published: courses.filter((c) => c.published).length,
    students: users.filter((u) => u.role === 'student').length,
    enrollments: enrollments.length,
    // doanh thu ước tính = tổng giá các khoá đã được đăng ký (khoá miễn phí = 0)
    revenue: enrollments.reduce((sum, e) => sum + (priceOf.get(e.courseId) ?? 0), 0),
    passRate: results.length ? Math.round((passed / results.length) * 100) : 0,
    popular,
    byMonth,
    byCategory,
  };
}
