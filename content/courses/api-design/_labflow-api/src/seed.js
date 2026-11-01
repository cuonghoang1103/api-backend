// seed.js — dữ liệu mẫu CỐ ĐỊNH để học phân trang: SEED_BOOKINGS=200 npm run dev
// Cùng một số n ⇒ cùng id, cùng giờ, cùng thứ tự ⇒ output trong bài tái lập được.
const PURPOSES = ['SWT301 Lab 3', 'PRJ301 Assignment', 'NWC204 Lab 2', 'SDN302 Project', 'CLB IoT'];

// Lab 3 — báo hỏng mẫu: SEED_ISSUES=60
const TITLES = ['Cổng console không lên đèn', 'Quạt kêu to', 'Mất nguồn ngẫu nhiên', 'Cổng 24 chập chờn', 'Thiếu thẻ nhớ'];
const SEV = ['LOW', 'MEDIUM', 'HIGH'];
export function seedIssues(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const created = Date.UTC(2026, 9, 5) + i * 3600000;           // mỗi báo hỏng cách nhau 1 giờ
    const resolved = i % 4 === 0;
    out.push({
      id: `iss_${i}`, deviceId: `dev_${((i - 1) % 3) + 1}`, reportedBy: i % 2 ? 'usr_1' : 'usr_2',
      title: `${TITLES[i % TITLES.length]} #${i}`, severity: SEV[(i + Math.floor(i / 3)) % 3],
      status: resolved ? 'RESOLVED' : 'OPEN', createdAt: new Date(created).toISOString(),
      ...(resolved && { resolvedAt: new Date(created + 1800000).toISOString(), resolution: 'Đã xử lý' }),
    });
  }
  return out;
}

export function seedBookings(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const slotIndex = Math.floor((i - 1) / 3);              // 3 phòng chạy song song
    const day = Math.floor(slotIndex / 5), slot = slotIndex % 5;   // 5 ca 2 giờ mỗi ngày (07:00–17:00 giờ VN)
    const start = Date.UTC(2026, 10, 2) + day * 86400000 + slot * 7200000;
    const created = Date.UTC(2026, 9, 1) + i * 60000;        // mỗi lượt tạo cách nhau 1 phút
    const cancelled = i % 7 === 0;
    out.push({
      id: `bk_${i}`, labId: `lab_${((i - 1) % 3) + 1}`, userId: i % 2 ? 'usr_1' : 'usr_2',
      startAt: new Date(start).toISOString(), endAt: new Date(start + 7200000).toISOString(),
      purpose: PURPOSES[i % PURPOSES.length], status: cancelled ? 'CANCELLED' : 'PENDING',
      createdAt: new Date(created).toISOString(),
      ...(cancelled && { cancelledAt: new Date(created + 3600000).toISOString() }),
    });
  }
  return out;
}
