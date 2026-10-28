//@from F3
// src/components/CourseFilters.js — thanh lọc: ô tìm + 3 ô chọn + sắp xếp. Component "điều khiển":
// giá trị đến từ props (đọc từ URL), mọi thay đổi báo ngược lên bằng onChange({ khoá: giá trị })
import { Button, Col, Form, Row } from 'react-bootstrap';
import { LEVELS, SORTS } from '../utils/courseQuery';

export default function CourseFilters({ filters, categories, onChange, onClear }) {
  return (
    <Form className="bg-white rounded-3 shadow-sm p-3 mb-3" onSubmit={(e) => e.preventDefault()} id="filters">
      <Row className="g-2 align-items-end">
        <Col md={4}>
          <Form.Label htmlFor="search" className="small text-muted mb-1">Search</Form.Label>
          <Form.Control id="search" type="search" placeholder="Course title or instructor" value={filters.q} onChange={(e) => onChange({ q: e.target.value })} />
        </Col>
        <Col sm={6} md={2}>
          <Form.Label htmlFor="filter-category" className="small text-muted mb-1">Category</Form.Label>
          <Form.Select id="filter-category" value={filters.category} onChange={(e) => onChange({ category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Form.Select>
        </Col>
        <Col sm={6} md={2}>
          <Form.Label htmlFor="filter-level" className="small text-muted mb-1">Level</Form.Label>
          <Form.Select id="filter-level" value={filters.level} onChange={(e) => onChange({ level: e.target.value })}>
            <option value="">All levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Form.Select>
        </Col>
        <Col sm={6} md={2}>
          <Form.Label htmlFor="filter-price" className="small text-muted mb-1">Price</Form.Label>
          <Form.Select id="filter-price" value={filters.price} onChange={(e) => onChange({ price: e.target.value })}>
            <option value="">All prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </Form.Select>
        </Col>
        <Col sm={6} md={2}>
          <Form.Label htmlFor="sort" className="small text-muted mb-1">Sort by</Form.Label>
          <Form.Select id="sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
            {SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Form.Select>
        </Col>
      </Row>
      <div className="text-end mt-2">
        <Button variant="link" size="sm" id="clear-filters" onClick={onClear}>Clear filters</Button>
      </div>
    </Form>
  );
}
