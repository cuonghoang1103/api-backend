// views.js — "cửa ra" của dữ liệu. Chỉ trường có tên ở đây mới rời khỏi server (danh sách CHO PHÉP).
// Luật LabFlow: trường tuỳ chọn LUÔN có mặt, không có giá trị thì là null — hình dạng không đổi theo thời gian.
export const toLab = (l) => ({
  id: l.id, code: l.code, name: l.name, building: l.building, capacity: l.capacity,
});
export const toDevice = (d) => ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNo: d.serialNo, status: d.status,
  note: d.note ?? null,
});
// v1 ra đời trước khi có check-in (bài 4.4): giá trị trạng thái MỚI không bao giờ lộ ra cho client v1
const V1_STATUS = { PENDING: 'PENDING', CANCELLED: 'CANCELLED', CHECKED_IN: 'PENDING' };
export const v1Status = (s) => V1_STATUS[s] ?? 'PENDING';
export const toBooking = (b) => ({
  id: b.id, labId: b.labId, userId: b.userId, startAt: b.startAt, endAt: b.endAt,
  purpose: b.purpose ?? null, status: v1Status(b.status), createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
});
export const toIssue = (i) => ({
  id: i.id, deviceId: i.deviceId, reportedBy: i.reportedBy, title: i.title, severity: i.severity,
  description: i.description ?? null, status: i.status, createdAt: i.createdAt,
  resolvedAt: i.resolvedAt ?? null, resolution: i.resolution ?? null,
});
export const toMe = (u) => ({ id: u.id, name: u.name, role: u.role, email: u.email });   // KHÔNG passwordHash, failedLogins, staffNote

// v2 (bài 4.2): thời gian của lượt đặt gom thành MỘT khoảng period { start, end }.
// Bản ghi nội bộ KHÔNG đổi — chỉ cách biểu diễn ra ngoài đổi theo phiên bản.
export const toBookingV2 = (b) => ({
  id: b.id, labId: b.labId, userId: b.userId, period: { start: b.startAt, end: b.endAt },
  purpose: b.purpose ?? null, status: b.status, createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
  checkedInAt: b.checkedInAt ?? null,                                    // bài 4.4: thêm vào v2 = thay đổi THÊM
});
// Lab 4 — v2 đổi tên serialNo ⇒ serialNumber. Bản ghi nội bộ vẫn là serialNo: chỉ biểu diễn đổi.
export const toDeviceV2 = (d) => ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNumber: d.serialNo, status: d.status,
  note: d.note ?? null,
});
export const VIEWS = {
  1: { lab: toLab, device: toDevice, booking: toBooking, issue: toIssue },
  2: { lab: toLab, device: toDeviceV2, booking: toBookingV2, issue: toIssue },
};
export const viewsOf = (req) => VIEWS[req.apiVersion ?? 1];

// Danh sách: luôn bọc trong { data: [...] } — chỗ trống cho meta phân trang ở Chương 3
export const list = (items, view) => ({ data: items.map(view) });
