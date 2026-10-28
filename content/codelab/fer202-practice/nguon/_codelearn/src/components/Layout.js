//@from F1
// src/components/Layout.js — khung chung: navbar trên cùng, nội dung trang ở <Outlet />, footer dưới cùng
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <Container as="main" id="main" className="flex-grow-1 py-4">
        <Outlet />
      </Container>
      <footer id="footer" className="bg-dark text-light text-center py-3 mt-auto small">
        © 2026 CodeLearn — FER202 final assignment
      </footer>
    </div>
  );
}
