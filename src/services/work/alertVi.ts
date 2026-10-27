/**
 * Câu cảnh báo CT Work (WORK_ALERT) ⇒ TIẾNG VIỆT cho thư (28/10/2026).
 *
 * ~45 chỗ trong `src/services/work/*` gửi WORK_ALERT với `payload.message` tiếng Anh (SLA, RAID, phê duyệt, lớp học,
 * timesheet, bàn giao, họp…). Chuông trong web vẫn giữ nguyên câu gốc (giao diện CT Work có cả EN); riêng THƯ thì
 * dịch ở đây — MỘT chỗ, không phải sửa 45 nơi gọi, và mẫu câu mới chưa có trong bảng vẫn ra (giữ tiếng Anh, khung
 * thư vẫn tiếng Việt). Câu do NGƯỜI viết (luật automation, lý do trả bài…) chỉ được chèn vào chỗ trống, không dịch.
 *
 * Thêm mẫu mới: thêm một dòng vào `LUAT` + một ca vào `alertVi.test.ts`.
 */

type Luat = [RegExp, (m: RegExpMatchArray) => string];

const SLA_VIEC: Record<string, string> = { 'first response': 'phản hồi đầu tiên', resolution: 'giải quyết' };
const RSVP: Record<string, string> = { Yes: 'Có', No: 'Không', Maybe: 'Có thể' };
const LOAI_BAI: Record<string, string> = { announcement: 'thông báo', assignment: 'bài tập', quiz: 'bài kiểm tra', material: 'tài liệu', post: 'bài đăng' };
const sau = (s: string | undefined, truoc = ': ') => (s ? `${truoc}${s}` : '');

const LUAT: Luat[] = [
  // Service desk — SLA
  [/^SLA breached: (first response|resolution) \((\w+), goal ([^)]+)\)$/, (m) => `Đã quá hạn SLA ${SLA_VIEC[m[1]!]} (ưu tiên ${m[2]}, mục tiêu ${m[3]})`],
  [/^SLA at risk: (first response|resolution) due in (\S+) \((\w+)\)$/, (m) => `Sắp quá hạn SLA ${SLA_VIEC[m[1]!]}: còn ${m[2]} (ưu tiên ${m[3]})`],
  [/^Your request was resolved\. How did we do\? Rate it from 1 to 5 in the client portal\.$/, () => 'Yêu cầu của bạn đã được giải quyết. Hãy chấm 1–5 sao trong cổng khách hàng.'],
  // RAID
  [/^Review due: (\S+) (.+)$/s, (m) => `Đến hạn xem lại ${m[1]}: ${m[2]}`],
  // Họp
  [/^Meeting starts in (\d+) min: (.+)$/s, (m) => `Cuộc họp bắt đầu sau ${m[1]} phút: ${m[2]}`],
  [/^Meeting notes were shared with you: (.+)$/s, (m) => `Biên bản họp đã được chia sẻ với bạn: ${m[1]}`],
  [/^You are invited to a meeting: (.+)$/s, (m) => `Bạn được mời họp: ${m[1]}`],
  [/^(.+) \(client\) replied (Yes|No|Maybe)(?:: (.+))?$/s, (m) => `${m[1] === 'A client' ? 'Một khách hàng' : `${m[1]} (khách hàng)`} trả lời ${RSVP[m[2]!]}${sau(m[3])}`],
  [/^(.+) replied (Yes|No|Maybe)(?:: (.+))?$/s, (m) => `${m[1] === 'Someone' ? 'Một người' : m[1]} trả lời ${RSVP[m[2]!]}${sau(m[3])}`],
  // Phê duyệt / baseline
  [/^Your approval is requested: (.+)$/s, (m) => `Cần bạn duyệt: ${m[1]}`],
  [/^Approval request approved$/, () => 'Yêu cầu phê duyệt đã được chấp thuận'],
  [/^Approval request rejected$/, () => 'Yêu cầu phê duyệt bị từ chối'],
  [/^Please review and sign this requirements baseline$/, () => 'Vui lòng xem và ký baseline yêu cầu này'],
  // Xoá cần duyệt
  [/^(AI deletion|Deletion) waiting for your approval: (.+)$/s, (m) => `${m[1] === 'AI deletion' ? 'Yêu cầu xoá do AI đề xuất' : 'Yêu cầu xoá'} đang chờ bạn duyệt: ${m[2]}`],
  [/^Your deletion request was approved: (.+)$/s, (m) => `Yêu cầu xoá của bạn đã được duyệt: ${m[1]}`],
  [/^Your deletion request was rejected: (.+)$/s, (m) => `Yêu cầu xoá của bạn bị từ chối: ${m[1]}`],
  [/^Your approved deletion failed: (.+)$/s, (m) => `Lệnh xoá đã duyệt bị lỗi: ${m[1]}`],
  // Bàn giao
  [/^Handoff waiting for you to accept: (.+)$/s, (m) => `Có bàn giao đang chờ bạn nhận: ${m[1]}`],
  [/^Handoff accepted: (.+)$/s, (m) => `Bàn giao đã được nhận: ${m[1]}`],
  [/^Handoff returned: (.+)$/s, (m) => `Bàn giao bị trả lại: ${m[1]}`],
  // Timesheet
  [/^(.+) submitted the timesheet for week (\S+)$/, (m) => `${m[1]} đã nộp timesheet tuần ${m[2]}`],
  [/^Timesheet for week (\S+) approved$/, (m) => `Timesheet tuần ${m[1]} đã được duyệt`],
  [/^Timesheet for week (\S+) returned: (.+)$/s, (m) => `Timesheet tuần ${m[1]} bị trả lại: ${m[2]}`],
  [/^Timesheet for week (\S+) reopened for changes: (.+)$/s, (m) => `Timesheet tuần ${m[1]} được mở lại để sửa: ${m[2]}`],
  [/^⏱ Your timer on (\S+) has been running for over ([\d.]+)h — stop it if you are done$/, (m) => `⏱ Bộ đếm giờ của bạn ở ${m[1]} đã chạy hơn ${m[2].replace('.', ',')} giờ — xong việc thì bấm dừng nhé`],
  // Agent
  [/^🤖 (.+) stopped responding on (\S+) \(lease expired\) — flagged as blocked$/, (m) => `🤖 ${m[1]} ngừng phản hồi ở ${m[2]} (hết hạn giữ thẻ) — đã gắn cờ Bị chặn`],
  [/^🤖 (.+) finished (\S+) — needs your review$/, (m) => `🤖 ${m[1]} đã làm xong ${m[2]} — cần bạn review`],
  [/^🤖 (.+) stopped on (\S+): (.+)$/s, (m) => `🤖 ${m[1]} dừng ở ${m[2]}: ${m[3]}`],
  [/^webhook to (.+) was turned off after (\d+) failed deliveries$/, (m) => `Webhook tới ${m[1]} đã bị tắt sau ${m[2]} lần gửi lỗi`],
  // Lớp học
  [/^You were invited to (.+)\. Class code (.+)$/s, (m) => `Bạn được mời vào lớp ${m[1]}. Mã lớp: ${m[2]}`],
  [/^New class comment from (.+)$/s, (m) => `Bình luận mới trong lớp từ ${m[1]}`],
  [/^New assignment: (.+?)(?: — due (.+) UTC)?$/s, (m) => `Bài tập mới: ${m[1]}${m[2] ? ` — hạn ${m[2]} UTC` : ''}`],
  [/^Due in less than 24 hours: (.+)$/s, (m) => `Còn dưới 24 giờ là tới hạn: ${m[1]}`],
  [/^New private comment$/, () => 'Có bình luận riêng mới'],
  [/^Your work was returned: (.+)$/s, (m) => `Bài làm của bạn đã được trả: ${m[1]}`],
  [/^Grades published: (.+)$/s, (m) => `Đã công bố điểm: ${m[1]}`],
  [/^New (announcement|assignment|quiz|material|post) in (\S+): (.+)$/s, (m) => `${LOAI_BAI[m[1]!]![0]!.toUpperCase()}${LOAI_BAI[m[1]!]!.slice(1)} mới trong lớp ${m[2]}: ${m[3]}`],
  [/^(.+) created (.+) in (\S+)$/s, (m) => `${m[1]} đã tạo ${m[2]} trong lớp ${m[3]}`],
  // Báo cáo nội dung
  [/^Content was reported \((.+)\)\. Review and remove it if needed\.$/s, (m) => `Có nội dung bị báo cáo (${m[1]}). Hãy xem và gỡ nếu cần.`],
  [/^A comment was reported \((.+)\)\. Review and remove it if needed\.$/s, (m) => `Một bình luận bị báo cáo (${m[1]}). Hãy xem và gỡ nếu cần.`],
  [/^A (comment|post) was reported \((.+)\)\. Review it in Feed → Reports\.$/s, (m) => `Một ${m[1] === 'post' ? 'bài đăng' : 'bình luận'} bị báo cáo (${m[2]}). Xem ở Bảng tin → Báo cáo.`],
  // Tài nguyên / tài sản
  [/^Broken link: (.+) \(([^)]+)\)$/s, (m) => `Liên kết hỏng: ${m[1]} (${m[2]})`],
  [/^License\/asset "(.+)" expired on (\S+)$/, (m) => `Giấy phép/tài sản "${m[1]}" đã hết hạn ngày ${m[2]}`],
  [/^License\/asset "(.+)" expires in (\d+) days? \((\S+)\)$/, (m) => `Giấy phép/tài sản "${m[1]}" còn ${m[2]} ngày nữa hết hạn (${m[3]})`],
  // Bảo mật
  [/^Please turn on two-factor authentication for (.+)\.$/, (m) => `Vui lòng bật xác thực hai lớp cho ${m[1]}.`],
  [/^(.+) requires two-factor authentication(?: from (\S+))?\. Turn it on in a minute\.$/, (m) => `${m[1]} yêu cầu xác thực hai lớp${m[2] ? ` từ ${m[2]}` : ''}. Bật chỉ mất một phút.`],
  // Cổng khách
  [/^You can follow the next stages in the client portal\.$/, () => 'Bạn theo dõi các giai đoạn tiếp theo trong cổng khách hàng.'],
  [/^The acceptance certificate is available in the client portal\.$/, () => 'Biên bản nghiệm thu đã có trong cổng khách hàng.'],
  // Git (thư Git riêng đã tiếng Việt — đây là dòng tiêu đề/dự phòng)
  [/^Test: (GitHub|GitLab) activity notifications for (.+) are working$/, (m) => `Thử: thông báo hoạt động ${m[1]} cho ${m[2]} đã chạy`],
  [/^(.+) pushed (\d+) commits? to (\S+?)(?:: “(.+)”)?$/s, (m) => `${m[1]} đẩy ${m[2]} commit lên ${m[3] === 'a branch' ? 'một nhánh' : m[3]}${m[4] ? `: “${m[4]}”` : ''}`],
  [/^(.+) created branch (\S+)$/, (m) => `${m[1]} tạo nhánh ${m[2]}`],
  [/^(.+) deleted branch (\S+)$/, (m) => `${m[1]} xoá nhánh ${m[2]}`],
  [/^(.+) (opened|reopened|merged|closed) pull request (#\d+)?(?:: (.+))?$/s, (m) => `${m[1]} ${{ opened: 'mở', reopened: 'mở lại', merged: 'merge', closed: 'đóng' }[m[2]!]} pull request ${m[3] ?? ''}${sau(m[4])}`.replace(/ {2,}/g, ' ').trim()],
  [/^(.+) requested your review on pull request (#\d+)?(?:: (.+))?$/s, (m) => `${m[1]} nhờ bạn review pull request ${m[2] ?? ''}${sau(m[3])}`.replace(/ {2,}/g, ' ').trim()],
];

/** Dịch câu cảnh báo sang tiếng Việt; không khớp mẫu nào ⇒ null (giữ câu gốc). */
export function alertVi(message: string | null | undefined): string | null {
  const s = (message ?? '').trim();
  // KHÔNG bỏ qua câu có dấu: phần do người dùng đặt (tên thẻ, tên lớp…) thường là tiếng Việt trong khuôn câu tiếng Anh.
  // Câu đã viết sẵn tiếng Việt không khớp mẫu nào (mẫu neo vào chữ tiếng Anh) ⇒ null ⇒ giữ nguyên.
  if (!s) return null;
  for (const [re, f] of LUAT) {
    const m = s.match(re);
    if (m) return f(m);
  }
  return null;
}
