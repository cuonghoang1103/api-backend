//@from F1
//#<F3
// src/pages/CoursesPage.js — (F1) trang giữ chỗ; F3 thay bằng danh sách khoá học thật
export default function CoursesPage() {
  return (
    <>
      <h2 id="courses-title">Courses</h2>
      <p className="text-muted">The course list arrives in F3.</p>
    </>
  );
}
//#end
//#F3
// src/pages/CoursesPage.js — danh sách khoá học: tải từ Redux, lọc/tìm/sắp/phân trang theo tham số URL
import { useEffect, useMemo } from 'react';
import { Alert, Button, Col, Pagination, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import CourseFilters from '../components/CourseFilters';
import { fetchCatalog } from '../features/courses/coursesSlice';
import { applyCourseQuery, paginate, readFilters } from '../utils/courseQuery';

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { items, categories, status, error } = useSelector((state) => state.courses);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();

  // tải MỘT lần (status 'idle'); quay lại trang không gọi API lần nữa — admin sửa khoá thì slice đặt lại 'idle'
  useEffect(() => {
    if (status === 'idle') dispatch(fetchCatalog());
  }, [status, dispatch]);

  // danh sách hiển thị là giá trị SUY RA (derived) từ items + URL — không lưu vào state riêng
  const filters = useMemo(() => readFilters(new URLSearchParams(query)), [query]);
  const filtered = useMemo(() => applyCourseQuery(items, filters), [items, filters]);
  const { items: pageItems, page, totalPages } = paginate(filtered, filters.page);
  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? 'Uncategorized';

  // đổi một (vài) tham số trên URL; đổi BỘ LỌC thì quay về trang 1. replace: gõ tìm kiếm không đầy lịch sử Back
  const update = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === '' || value == null || (key === 'sort' && value === 'newest') || (key === 'page' && value === 1)) next.delete(key);
      else next.set(key, String(value));
    });
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <h2 id="courses-title">Courses</h2>
      <CourseFilters filters={filters} categories={categories} onChange={update} onClear={() => setSearchParams({}, { replace: true })} />

      {status === 'loading' && (
        <div id="courses-loading" className="text-center py-5"><Spinner animation="border" role="status" /></div>
      )}

      {status === 'failed' && (
        <Alert variant="danger" id="courses-error" className="d-flex justify-content-between align-items-center">
          <span>Could not load courses ({error}).</span>
          <Button id="retry" variant="outline-danger" size="sm" onClick={() => dispatch(fetchCatalog())}>Try again</Button>
        </Alert>
      )}

      {status === 'succeeded' && (
        <>
          <p id="result-count" className="text-muted">{filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found</p>
          {filtered.length === 0 ? (
            <Alert variant="secondary" id="no-results">No courses match your filters.</Alert>
          ) : (
            <Row xs={1} sm={2} lg={3} className="g-3">
              {pageItems.map((course) => (
                <Col key={course.id}>
                  <CourseCard course={course} categoryName={categoryName(course.categoryId)} />
                </Col>
              ))}
            </Row>
          )}
          {totalPages > 1 && (
            <Pagination id="pagination" className="mt-4 justify-content-center">
              <Pagination.Prev id="page-prev" disabled={page === 1} onClick={() => update({ page: page - 1 })} />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Pagination.Item key={n} id={`page-${n}`} active={n === page} onClick={() => update({ page: n })}>{n}</Pagination.Item>
              ))}
              <Pagination.Next id="page-next" disabled={page === totalPages} onClick={() => update({ page: page + 1 })} />
            </Pagination>
          )}
        </>
      )}
    </>
  );
}
//#end
