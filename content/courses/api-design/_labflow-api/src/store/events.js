// store/events.js — hình dạng sự kiện lượt đặt (bài 10.3): KHÔNG có userId/tên/email; version để xếp đúng thứ tự (10.6)
export const bookingEvent = (b) => ({ id: b.id, labId: b.labId, period: { start: b.startAt, end: b.endAt }, status: b.status, version: b.version ?? 1 });
export const bookingEventType = (kind) => `labflow.booking.${kind}.v1`;
