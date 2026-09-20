#!/usr/bin/env node
/**
 * Sinh danh mục BỘ PHẬN 3D cho Xưởng 3D.
 *
 * Mỗi bộ phận là một CÔNG THỨC GHÉP KHỐI (vài KB), không phải tệp lưới.
 * Ba cái lợi so với tải tệp mô hình:
 *   · gần như không tốn dung lượng iPad (cả thư viện < 100 KB)
 *   · tải tức thì, không phải chờ vài MB
 *   · kéo ra rồi VẪN SỬA ĐƯỢC từng khối — đổi tỉ lệ, đổi màu, khoét thêm.
 *     Tải tệp lưới về thì nó là một cục chết, sửa gì cũng phải ra máy tính.
 *
 *   node scripts/sinh-bo-phan-3d.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const K = (loai, ten, o = {}) => ({ loai, ten, ...o });
const bp = [];
const them = (id, ten, nhom, icon, moTa, khoi) =>
  bp.push({ id, ten, nhom, icon, moTa, khoi });

// ── màu dùng lại ──
const THEP = '#8A93A6', THEP_TOI = '#4A5263', VANG = '#F2B33D';
const DO = '#E1493B', LAM = '#2E7BD9', DEN = '#22242C', TRANG = '#E8EAF0';
const DA = '#F2C9A0', VAI = '#7A45E8', GO = '#8B5E34', BETONG = '#9AA0A8';
const KINH = '#5FC9E8', CO = '#4C9A4A', DUONG = '#3A3D45';

const kimLoai = { kimLoai: 0.75, nham: 0.3 };
const nhua = { kimLoai: 0.05, nham: 0.6 };

// ════════════════ ROBOT ════════════════
them('robot-dau', 'Đầu robot', 'robot', 'cube', 'Đầu vuông có hai mắt đèn và ăng-ten', [
  K('hop', 'Hộp đầu', { coX: 0.9, coY: 0.75, coZ: 0.8, mau: THEP, ...kimLoai }),
  K('hop', 'Mắt trái', { x: -0.22, y: 0.08, z: 0.42, coX: 0.26, coY: 0.14, coZ: 0.06, mau: KINH, kimLoai: 0.2, nham: 0.1 }),
  K('hop', 'Mắt phải', { x: 0.22, y: 0.08, z: 0.42, coX: 0.26, coY: 0.14, coZ: 0.06, mau: KINH, kimLoai: 0.2, nham: 0.1 }),
  K('tru', 'Ăng-ten', { y: 0.62, coX: 0.05, coY: 0.5, coZ: 0.05, mau: THEP_TOI, ...kimLoai }),
  K('cau', 'Đầu ăng-ten', { y: 0.9, coX: 0.12, coY: 0.12, coZ: 0.12, mau: DO, ...nhua }),
]);
them('robot-than', 'Thân robot', 'robot', 'cube.fill', 'Thân có tấm ngực và lõi sáng', [
  K('hop', 'Thân', { coX: 1.25, coY: 1.5, coZ: 0.8, mau: THEP, ...kimLoai }),
  K('hop', 'Tấm ngực', { z: 0.43, y: 0.25, coX: 0.9, coY: 0.7, coZ: 0.08, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Lõi sáng', { z: 0.5, y: 0.25, xoayX: 90, coX: 0.3, coY: 0.1, coZ: 0.3, mau: KINH, kimLoai: 0.1, nham: 0.1 }),
  K('hop', 'Hông', { y: -0.85, coX: 1.0, coY: 0.3, coZ: 0.75, mau: THEP_TOI, ...kimLoai }),
]);
them('robot-tay', 'Cánh tay robot', 'robot', 'figure.arms.open', 'Vai, cánh tay trên/dưới và bàn tay kẹp', [
  K('cau', 'Khớp vai', { coX: 0.42, coY: 0.42, coZ: 0.42, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Tay trên', { y: -0.45, coX: 0.3, coY: 0.8, coZ: 0.3, mau: THEP, ...kimLoai }),
  K('cau', 'Khuỷu', { y: -0.9, coX: 0.3, coY: 0.3, coZ: 0.3, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Tay dưới', { y: -1.3, coX: 0.26, coY: 0.75, coZ: 0.26, mau: THEP, ...kimLoai }),
  K('hop', 'Kẹp trái', { x: -0.11, y: -1.8, coX: 0.09, coY: 0.32, coZ: 0.2, mau: VANG, ...kimLoai }),
  K('hop', 'Kẹp phải', { x: 0.11, y: -1.8, coX: 0.09, coY: 0.32, coZ: 0.2, mau: VANG, ...kimLoai }),
]);
them('robot-chan', 'Chân robot', 'robot', 'figure.walk', 'Đùi, cẳng chân và bàn chân bè', [
  K('cau', 'Khớp hông', { coX: 0.4, coY: 0.4, coZ: 0.4, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Đùi', { y: -0.55, coX: 0.36, coY: 1.0, coZ: 0.36, mau: THEP, ...kimLoai }),
  K('cau', 'Đầu gối', { y: -1.1, coX: 0.34, coY: 0.34, coZ: 0.34, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Cẳng chân', { y: -1.65, coX: 0.3, coY: 1.0, coZ: 0.3, mau: THEP, ...kimLoai }),
  K('hop', 'Bàn chân', { y: -2.2, z: 0.12, coX: 0.45, coY: 0.18, coZ: 0.8, mau: THEP_TOI, ...kimLoai }),
]);
them('robot-vai-sung', 'Vai gắn súng', 'robot', 'shield.lefthalf.filled', 'Giáp vai và nòng súng đôi', [
  K('hop', 'Giáp vai', { coX: 0.7, coY: 0.5, coZ: 0.7, mau: DO, ...kimLoai }),
  K('tru', 'Nòng trên', { y: 0.12, z: 0.55, xoayX: 90, coX: 0.12, coY: 0.9, coZ: 0.12, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Nòng dưới', { y: -0.12, z: 0.55, xoayX: 90, coX: 0.12, coY: 0.9, coZ: 0.12, mau: THEP_TOI, ...kimLoai }),
]);
them('robot-phan-luc', 'Ống phản lực', 'robot', 'flame', 'Ống xả có vành và lửa', [
  K('tru', 'Ống', { coX: 0.4, coY: 0.8, coZ: 0.4, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Vành', { y: -0.45, coX: 0.5, coY: 0.12, coZ: 0.5, mau: VANG, ...kimLoai }),
  K('non', 'Lửa', { y: -0.75, xoayZ: 180, coX: 0.36, coY: 0.5, coZ: 0.36, mau: '#FF7A1A', kimLoai: 0, nham: 1 }),
]);
them('robot-banh-xich', 'Bánh xích', 'robot', 'circle.hexagongrid', 'Cặp bánh xích cho robot di chuyển', [
  K('tru', 'Bánh trái', { x: -0.6, xoayZ: 90, coX: 0.7, coY: 0.25, coZ: 0.7, mau: DEN, ...nhua }),
  K('tru', 'Bánh phải', { x: 0.6, xoayZ: 90, coX: 0.7, coY: 0.25, coZ: 0.7, mau: DEN, ...nhua }),
  K('hop', 'Cầu nối', { coX: 1.0, coY: 0.3, coZ: 0.4, mau: THEP, ...kimLoai }),
]);

// ════════════════ NHÂN VẬT ════════════════
them('nv-dau', 'Đầu nhân vật', 'nhanvat', 'person.circle', 'Đầu tròn kiểu hoạt hình, có tóc', [
  K('cau', 'Đầu', { coX: 0.8, coY: 0.85, coZ: 0.8, mau: DA, ...nhua }),
  K('cau', 'Tóc', { y: 0.12, coX: 0.85, coY: 0.6, coZ: 0.85, mau: '#3A2A1F', ...nhua }),
  K('cau', 'Mắt trái', { x: -0.17, y: 0.02, z: 0.34, coX: 0.11, coY: 0.13, coZ: 0.06, mau: DEN, ...nhua }),
  K('cau', 'Mắt phải', { x: 0.17, y: 0.02, z: 0.34, coX: 0.11, coY: 0.13, coZ: 0.06, mau: DEN, ...nhua }),
]);
them('nv-than', 'Thân nhân vật', 'nhanvat', 'person.fill', 'Thân áo có cổ', [
  K('hop', 'Thân', { coX: 0.85, coY: 1.2, coZ: 0.5, mau: VAI, ...nhua }),
  K('tru', 'Cổ', { y: 0.68, coX: 0.22, coY: 0.2, coZ: 0.22, mau: DA, ...nhua }),
  K('hop', 'Thắt lưng', { y: -0.66, coX: 0.88, coY: 0.14, coZ: 0.54, mau: '#3A2A1F', ...nhua }),
]);
them('nv-tay', 'Tay nhân vật', 'nhanvat', 'hand.raised', 'Cánh tay và bàn tay', [
  K('tru', 'Tay trên', { y: -0.4, coX: 0.22, coY: 0.75, coZ: 0.22, mau: VAI, ...nhua }),
  K('tru', 'Tay dưới', { y: -1.08, coX: 0.19, coY: 0.66, coZ: 0.19, mau: DA, ...nhua }),
  K('cau', 'Bàn tay', { y: -1.5, coX: 0.24, coY: 0.24, coZ: 0.2, mau: DA, ...nhua }),
]);
them('nv-chan', 'Chân nhân vật', 'nhanvat', 'shoeprints.fill', 'Chân và giày', [
  K('tru', 'Đùi', { y: -0.48, coX: 0.27, coY: 0.9, coZ: 0.27, mau: '#2E4A7A', ...nhua }),
  K('tru', 'Cẳng chân', { y: -1.3, coX: 0.23, coY: 0.8, coZ: 0.23, mau: '#2E4A7A', ...nhua }),
  K('hop', 'Giày', { y: -1.78, z: 0.1, coX: 0.3, coY: 0.18, coZ: 0.6, mau: DEN, ...nhua }),
]);
them('nv-mu-giap', 'Mũ giáp', 'nhanvat', 'shield', 'Mũ chiến binh có chỏm', [
  K('cau', 'Chỏm mũ', { coX: 0.9, coY: 0.7, coZ: 0.9, mau: THEP, ...kimLoai }),
  K('tru', 'Vành', { y: -0.28, coX: 0.95, coY: 0.12, coZ: 0.95, mau: VANG, ...kimLoai }),
  K('hop', 'Sống mũ', { y: 0.3, coX: 0.1, coY: 0.35, coZ: 0.95, mau: DO, ...nhua }),
]);
them('nv-kiem', 'Kiếm', 'nhanvat', 'sparkles', 'Kiếm có chuôi và chắn tay', [
  K('hop', 'Lưỡi', { y: 0.9, coX: 0.12, coY: 1.6, coZ: 0.035, mau: TRANG, kimLoai: 0.9, nham: 0.15 }),
  K('non', 'Mũi', { y: 1.78, coX: 0.12, coY: 0.24, coZ: 0.035, mau: TRANG, kimLoai: 0.9, nham: 0.15 }),
  K('hop', 'Chắn tay', { coX: 0.55, coY: 0.1, coZ: 0.1, mau: VANG, ...kimLoai }),
  K('tru', 'Chuôi', { y: -0.28, coX: 0.09, coY: 0.5, coZ: 0.09, mau: '#5A3A22', ...nhua }),
]);

// ════════════════ THÀNH PHỐ / MAP ════════════════
them('tp-nha-cao', 'Toà nhà cao tầng', 'thanhpho', 'building.2', 'Nhà 10 tầng có dải kính', [
  K('hop', 'Thân nhà', { y: 5, coX: 3, coY: 10, coZ: 3, mau: BETONG, kimLoai: 0.1, nham: 0.75 }),
  ...Array.from({ length: 5 }, (_, i) =>
    K('hop', `Dải kính ${i + 1}`, { y: 1.4 + i * 2, z: 1.53, coX: 2.6, coY: 0.9, coZ: 0.08, mau: KINH, kimLoai: 0.3, nham: 0.1 })),
  K('hop', 'Mái', { y: 10.2, coX: 3.2, coY: 0.4, coZ: 3.2, mau: THEP_TOI, kimLoai: 0.4, nham: 0.5 }),
]);
them('tp-nha-thap', 'Nhà phố', 'thanhpho', 'house', 'Nhà 2 tầng có cửa và mái', [
  K('hop', 'Thân', { y: 1.5, coX: 2.6, coY: 3, coZ: 2.2, mau: '#D9C3A5', kimLoai: 0, nham: 0.8 }),
  K('hop', 'Cửa', { y: 0.6, z: 1.12, coX: 0.7, coY: 1.2, coZ: 0.08, mau: GO, ...nhua }),
  K('hop', 'Cửa sổ trái', { x: -0.75, y: 2.1, z: 1.12, coX: 0.6, coY: 0.6, coZ: 0.08, mau: KINH, kimLoai: 0.3, nham: 0.1 }),
  K('hop', 'Cửa sổ phải', { x: 0.75, y: 2.1, z: 1.12, coX: 0.6, coY: 0.6, coZ: 0.08, mau: KINH, kimLoai: 0.3, nham: 0.1 }),
  K('non', 'Mái', { y: 3.6, xoayY: 45, coX: 2.6, coY: 1.2, coZ: 2.6, mau: DO, kimLoai: 0, nham: 0.85 }),
]);
them('tp-duong', 'Đoạn đường', 'thanhpho', 'road.lanes', 'Mặt đường, vỉa hè hai bên và vạch kẻ', [
  K('hop', 'Mặt đường', { y: -0.45, coX: 8, coY: 0.1, coZ: 20, mau: DUONG, kimLoai: 0, nham: 0.9 }),
  K('hop', 'Vỉa hè trái', { x: -4.4, y: -0.35, coX: 1, coY: 0.3, coZ: 20, mau: BETONG, kimLoai: 0, nham: 0.85 }),
  K('hop', 'Vỉa hè phải', { x: 4.4, y: -0.35, coX: 1, coY: 0.3, coZ: 20, mau: BETONG, kimLoai: 0, nham: 0.85 }),
  ...Array.from({ length: 5 }, (_, i) =>
    K('hop', `Vạch ${i + 1}`, { y: -0.39, z: -8 + i * 4, coX: 0.2, coY: 0.02, coZ: 2, mau: '#E8E4D0', kimLoai: 0, nham: 0.9 })),
]);
them('tp-den-duong', 'Cột đèn đường', 'thanhpho', 'lightbulb', 'Cột đèn cong có bóng sáng', [
  K('tru', 'Cột', { y: 2, coX: 0.14, coY: 4, coZ: 0.14, mau: THEP_TOI, ...kimLoai }),
  K('hop', 'Cần', { x: 0.5, y: 3.95, coX: 1.1, coY: 0.12, coZ: 0.12, mau: THEP_TOI, ...kimLoai }),
  K('hop', 'Bóng đèn', { x: 1, y: 3.82, coX: 0.4, coY: 0.16, coZ: 0.25, mau: '#FFF1B8', kimLoai: 0, nham: 0.2 }),
  K('tru', 'Đế', { y: 0.08, coX: 0.36, coY: 0.16, coZ: 0.36, mau: DEN, ...nhua }),
]);
them('tp-cay', 'Cây', 'thanhpho', 'tree', 'Cây có thân và ba tán lá', [
  K('tru', 'Thân', { y: 0.8, coX: 0.3, coY: 2, coZ: 0.3, mau: '#6B4A2A', kimLoai: 0, nham: 0.9 }),
  K('cau', 'Tán dưới', { y: 2.1, coX: 1.8, coY: 1.4, coZ: 1.8, mau: CO, kimLoai: 0, nham: 0.9 }),
  K('cau', 'Tán giữa', { x: 0.35, y: 2.7, coX: 1.3, coY: 1.1, coZ: 1.3, mau: '#5FAE58', kimLoai: 0, nham: 0.9 }),
  K('cau', 'Tán trên', { x: -0.3, y: 2.9, coX: 1.1, coY: 1, coZ: 1.1, mau: CO, kimLoai: 0, nham: 0.9 }),
]);
them('tp-oto', 'Ô tô', 'thanhpho', 'car', 'Xe con bốn bánh có kính', [
  K('hop', 'Thân xe', { y: 0.55, coX: 1.8, coY: 0.6, coZ: 4, mau: LAM, kimLoai: 0.5, nham: 0.3 }),
  K('hop', 'Ca-bin', { y: 1.1, z: -0.2, coX: 1.6, coY: 0.55, coZ: 2, mau: LAM, kimLoai: 0.5, nham: 0.3 }),
  K('hop', 'Kính trước', { y: 1.1, z: 0.82, coX: 1.45, coY: 0.45, coZ: 0.06, mau: KINH, kimLoai: 0.2, nham: 0.05 }),
  ...[[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]].map(([x, z], i) =>
    K('tru', `Bánh ${i + 1}`, { x, y: 0.32, z, xoayZ: 90, coX: 0.62, coY: 0.24, coZ: 0.62, mau: DEN, ...nhua })),
]);
them('tp-hang-rao', 'Hàng rào', 'thanhpho', 'square.grid.3x1.below.line.grid.1x2', 'Hàng rào 8 cọc và hai thanh ngang', [
  ...Array.from({ length: 8 }, (_, i) =>
    K('hop', `Cọc ${i + 1}`, { x: -3.5 + i, y: 0.5, coX: 0.12, coY: 1.4, coZ: 0.12, mau: GO, kimLoai: 0, nham: 0.9 })),
  K('hop', 'Thanh trên', { y: 0.95, coX: 8, coY: 0.1, coZ: 0.08, mau: GO, kimLoai: 0, nham: 0.9 }),
  K('hop', 'Thanh dưới', { y: 0.35, coX: 8, coY: 0.1, coZ: 0.08, mau: GO, kimLoai: 0, nham: 0.9 }),
]);
them('tp-cau-thang', 'Cầu thang', 'thanhpho', 'stairs', 'Tám bậc đều nhau', [
  ...Array.from({ length: 8 }, (_, i) =>
    K('hop', `Bậc ${i + 1}`, { y: 0.15 + i * 0.3, z: i * 0.5, coX: 2, coY: 0.3, coZ: 0.5, mau: BETONG, kimLoai: 0, nham: 0.85 })),
]);

// ════════════════ ĐẠO CỤ ════════════════
them('dc-thung', 'Thùng gỗ', 'daocu', 'shippingbox', 'Thùng có nẹp sắt', [
  K('hop', 'Thùng', { y: 0.5, coX: 1, coY: 1, coZ: 1, mau: GO, kimLoai: 0, nham: 0.9 }),
  K('hop', 'Nẹp ngang', { y: 0.5, coX: 1.04, coY: 0.1, coZ: 1.04, mau: THEP_TOI, ...kimLoai }),
]);
them('dc-thung-phuy', 'Thùng phuy', 'daocu', 'cylinder', 'Thùng dầu có hai vành', [
  K('tru', 'Thân', { y: 0.6, coX: 0.8, coY: 1.2, coZ: 0.8, mau: DO, kimLoai: 0.4, nham: 0.5 }),
  K('tru', 'Vành trên', { y: 0.95, coX: 0.86, coY: 0.08, coZ: 0.86, mau: THEP_TOI, ...kimLoai }),
  K('tru', 'Vành dưới', { y: 0.25, coX: 0.86, coY: 0.08, coZ: 0.86, mau: THEP_TOI, ...kimLoai }),
]);
them('dc-bao-cat', 'Ụ bao cát', 'daocu', 'shield.fill', 'Ụ phòng thủ xếp hai lớp', [
  ...Array.from({ length: 4 }, (_, i) =>
    K('hop', `Bao dưới ${i + 1}`, { x: -1.2 + i * 0.8, y: 0.2, coX: 0.78, coY: 0.4, coZ: 0.5, mau: '#B8A278', kimLoai: 0, nham: 0.95 })),
  ...Array.from({ length: 3 }, (_, i) =>
    K('hop', `Bao trên ${i + 1}`, { x: -0.8 + i * 0.8, y: 0.6, coX: 0.78, coY: 0.4, coZ: 0.5, mau: '#A89268', kimLoai: 0, nham: 0.95 })),
]);
them('dc-cong', 'Cổng vòm', 'daocu', 'door.left.hand.open', 'Cổng hai trụ và xà ngang', [
  K('hop', 'Trụ trái', { x: -1.5, y: 1.5, coX: 0.5, coY: 3, coZ: 0.5, mau: BETONG, kimLoai: 0, nham: 0.85 }),
  K('hop', 'Trụ phải', { x: 1.5, y: 1.5, coX: 0.5, coY: 3, coZ: 0.5, mau: BETONG, kimLoai: 0, nham: 0.85 }),
  K('hop', 'Xà ngang', { y: 3.2, coX: 3.8, coY: 0.5, coZ: 0.6, mau: BETONG, kimLoai: 0, nham: 0.85 }),
  K('xuyen', 'Vòng trang trí', { y: 3.2, xoayX: 90, coX: 0.8, coY: 0.8, coZ: 0.8, mau: VANG, ...kimLoai }),
]);
them('dc-ban-ghe', 'Bàn và ghế', 'daocu', 'table.furniture', 'Bàn bốn chân kèm hai ghế đẩu', [
  K('hop', 'Mặt bàn', { y: 0.75, coX: 2, coY: 0.1, coZ: 1.1, mau: GO, kimLoai: 0, nham: 0.85 }),
  ...[[-0.9, -0.45], [0.9, -0.45], [-0.9, 0.45], [0.9, 0.45]].map(([x, z], i) =>
    K('hop', `Chân bàn ${i + 1}`, { x, y: 0.35, z, coX: 0.1, coY: 0.7, coZ: 0.1, mau: GO, kimLoai: 0, nham: 0.85 })),
  K('tru', 'Ghế trái', { x: -1.4, y: 0.25, coX: 0.5, coY: 0.5, coZ: 0.5, mau: '#6B4A2A', kimLoai: 0, nham: 0.9 }),
  K('tru', 'Ghế phải', { x: 1.4, y: 0.25, coX: 0.5, coY: 0.5, coZ: 0.5, mau: '#6B4A2A', kimLoai: 0, nham: 0.9 }),
]);

const nhomTen = {
  robot: 'Robot & máy móc',
  nhanvat: 'Nhân vật',
  thanhpho: 'Thành phố & map',
  daocu: 'Đạo cụ',
};

mkdirSync('content/xuong-3d', { recursive: true });
const ra = {
  phienBan: 1,
  capNhat: new Date().toISOString().slice(0, 10),
  nhom: Object.entries(nhomTen).map(([ma, ten]) => ({ ma, ten })),
  boPhan: bp.map((b) => ({ ...b, soKhoi: b.khoi.length })),
};
const chu = JSON.stringify(ra);
writeFileSync('content/xuong-3d/bo-phan.json', chu);

const theoNhom = {};
for (const b of bp) theoNhom[b.nhom] = (theoNhom[b.nhom] || 0) + 1;
console.log(`  ${bp.length} bộ phận · ${bp.reduce((t, b) => t + b.khoi.length, 0)} khối · ${(chu.length / 1024).toFixed(1)} KB`);
for (const [k, v] of Object.entries(theoNhom)) console.log(`    ${nhomTen[k].padEnd(20)} ${v}`);
