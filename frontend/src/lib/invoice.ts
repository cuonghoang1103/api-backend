import { jsPDF } from 'jspdf';
import type { Order } from '@/types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function generateInvoicePDF(order: Order): void {
  const doc = new jsPDF();

  // Colors
  const primaryColor: [number, number, number] = [99, 92, 246]; // neon-violet hex
  const darkBg: [number, number, number] = [15, 15, 25];
  const cardBg: [number, number, number] = [25, 25, 40];
  const borderColor: [number, number, number] = [45, 45, 65];
  const textPrimary: [number, number, number] = [255, 255, 255];
  const textSecondary: [number, number, number] = [160, 160, 180];
  const accentColor: [number, number, number] = [139, 92, 246];

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 55, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('INVOICE', 20, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textSecondary);
  doc.text('CuongHoangDev Marketplace', 20, 35);
  doc.text('Email: cuongthaihnhe176322@gmail.com', 20, 42);
  doc.text('Website: cuonghoang.dev', 20, 49);

  // Order ID (top right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...textPrimary);
  doc.text(`#${order.id}`, 190, 25, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text(formatDate(order.createdAt), 190, 33, { align: 'right' });

  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    Completed: [34, 197, 94],
    Pending: [234, 179, 8],
    Failed: [239, 68, 68],
  };
  const statusColor = statusColors[order.status] || [160, 160, 180];
  doc.setFillColor(...statusColor);
  const statusText = order.status.toUpperCase();
  const statusWidth = doc.getTextWidth(statusText) + 8;
  doc.roundedRect(190 - statusWidth, 37, statusWidth, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, 190 - 4, 42, { align: 'right' });

  // ── Buyer Info ─────────────────────────────────────────────────────────
  let y = 68;

  doc.setFillColor(...cardBg);
  doc.roundedRect(15, y, 90, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text('THÔNG TIN KHÁCH HÀNG', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textPrimary);
  doc.text(`Họ tên: ${order.buyerInfo.fullName}`, 20, y + 15);
  doc.text(`Email:   ${order.buyerInfo.email}`, 20, y + 22);
  if (order.buyerInfo.phone) {
    doc.text(`Điện thoại: ${order.buyerInfo.phone}`, 20, y + 29);
  }

  // Payment Info
  doc.setFillColor(...cardBg);
  doc.roundedRect(110, y, 85, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text('PHƯƠNG THỨC THANH TOÁN', 115, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textPrimary);
  doc.text('Thanh toán giả lập (Demo)', 115, y + 15);
  doc.text('Trạng thái:', 115, y + 22);
  doc.setTextColor(...statusColor);
  doc.text(order.status, 135, y + 22);
  doc.setTextColor(...textSecondary);
  doc.setFontSize(8);
  doc.text('* Đây là hóa đơn demo', 115, y + 29);

  // ── Items Table ────────────────────────────────────────────────────────
  y += 42;

  // Table header
  doc.setFillColor(...primaryColor);
  doc.rect(15, y, 180, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('SẢN PHẨM / KHÓA HỌC', 18, y + 6);
  doc.text('LOẠI', 110, y + 6);
  doc.text('GIÁ', 145, y + 6, { align: 'right' });
  doc.text('SL', 165, y + 6, { align: 'center' });
  doc.text('THÀNH TIỀN', 193, y + 6, { align: 'right' });

  y += 9;

  // Table rows
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(20, 20, 32);
      doc.rect(15, y, 180, 12, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textPrimary);

    // Name (truncate if too long)
    const name = item.name.length > 42 ? item.name.substring(0, 42) + '...' : item.name;
    doc.text(name, 18, y + 5);
    doc.text(name, 18, y + 9);

    // Category / type
    const typeLabel = item.itemType === 'shop' ? 'Shop' : 'Academy';
    doc.setTextColor(...textSecondary);
    doc.text(typeLabel, 110, y + 7);

    // Price
    doc.setTextColor(...textPrimary);
    doc.text(formatPrice(item.price), 193, y + 7, { align: 'right' });

    // Qty
    doc.text(String(item.quantity), 165, y + 7, { align: 'center' });

    // Line total
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text(formatPrice(item.price * item.quantity), 193, y + 7, { align: 'right' });

    y += 12;
  });

  // Table border
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.rect(15, 68, 180, y - 68 + 2);

  y += 5;

  // ── Summary ────────────────────────────────────────────────────────────
  const summaryX = 130;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text('Tạm tính:', summaryX, y + 5);
  doc.setTextColor(...textPrimary);
  doc.text(formatPrice(order.subtotal), 193, y + 5, { align: 'right' });

  if (order.discountAmount > 0) {
    y += 7;
    doc.setTextColor(...textSecondary);
    doc.text(`Giảm giá (${order.discountCode}):`, summaryX, y + 5);
    doc.setTextColor(34, 197, 94);
    doc.text(`-${formatPrice(order.discountAmount)}`, 193, y + 5, { align: 'right' });
  }

  y += 10;
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(summaryX, y, 195, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...textPrimary);
  doc.text('TỔNG CỘNG:', summaryX, y + 5);
  doc.setTextColor(...accentColor);
  doc.text(formatPrice(order.total), 193, y + 5, { align: 'right' });

  // ── Footer ────────────────────────────────────────────────────────────
  const footerY = 275;
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.line(15, footerY, 195, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...textSecondary);
  doc.text(
    'Cảm ơn bạn đã mua sắm tại CuongHoangDev Marketplace! Đây là hóa đơn giả lập (demo).',
    105,
    footerY + 6,
    { align: 'center' }
  );
  doc.text(
    'Nếu cần hỗ trợ, vui lòng liên hệ: cuongthaihnhe176322@gmail.com',
    105,
    footerY + 12,
    { align: 'center' }
  );

  // Save
  doc.save(`invoice-${order.id}.pdf`);
}
