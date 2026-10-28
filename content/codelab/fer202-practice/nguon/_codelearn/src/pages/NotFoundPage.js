//@from F1
// src/pages/NotFoundPage.js — trang 404 cho mọi đường dẫn không khớp route nào (path="*")
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div id="not-found" className="text-center py-5">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="lead">Page not found</p>
      <p className="text-muted">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" id="back-home" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
