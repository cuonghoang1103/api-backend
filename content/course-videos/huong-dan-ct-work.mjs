/**
 * Video track cho khoá "Hướng dẫn CT Work" (content/courses/huong-dan-ct-work.mjs) — 12 tập, giọng tiếng Việt.
 * ─────────────────────────────────────────────────────────────────────────────
 * Mỗi dòng một slug bài, CHƯA CÓ link: tập nào còn `{ }` thì course-video-seed bỏ qua (không ghi gì, không lỗi).
 * Không có video YouTube tuyển chọn (`yt`) nào — loạt này là bản ghi của chính kênh, nên chốt credit của
 * course-video-seed không áp dụng.
 *
 * ĐIỀN LINK bằng công cụ của dự án video (đừng sửa tay):
 *   cd ~/Documents/video-bai-giang && tsx xuat/len-r2.mts …            (đẩy mp4 lên R2, ghi r2Url vào thong-tin.json)
 *   tsx xuat/gan-web.mts huong-dan-ct-work                              (ghi vi: { url } + defaultVideoTrack: 'VI')
 * gan-web.mts khớp từng dòng theo dạng `'<slug>': { … },` NẰM GỌN TRÊN MỘT DÒNG — giữ nguyên dạng đó, và giữ
 * file KẾT THÚC bằng `  },\n};` (nó chèn dòng mới ngay trước chỗ đó).
 *
 * Áp vào CSDL: tự chạy ở Step 3.12c của deploy (sau course seed 3.12b), hoặc tay:
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/huong-dan-ct-work.mjs --apply
 *
 * Cùng 12 link đó còn phải dán vào frontend/src/components/work/help/videos.ts (CTW_EPISODES) để bảng
 * Trợ giúp trong CT Work và trang /download/ct-work nhúng video.
 */
export default {
  courseSlug: 'huong-dan-ct-work',
  lessons: {
    /* ── Phần 1 — Người dùng mới & thành viên nhóm ── */
    'ctw-01-bat-dau': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-01-bat-dau-8715d6aa.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-02-board-hang-ngay': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-02-board-hang-ngay-08fb4f11.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-03-the-viec-chi-tiet': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-03-the-viec-chi-tiet-2218a669.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-04-tro-chuyen-docs-hop': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-04-tro-chuyen-docs-hop-47ada212.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Phần 2 — Nhóm trưởng & admin dự án ── */
    'ctw-05-moi-nhom-phan-quyen': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-05-moi-nhom-phan-quyen-b663e440.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-06-backlog-sprint-timeline': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-06-backlog-sprint-timeline-3fe817cb.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-07-docs-so-do-hop': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-07-docs-so-do-hop-c5ac3dca.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-08-bao-cao-dong-gop': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-08-bao-cao-dong-gop-fa796fad.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Phần 3 — Giảng viên ── */
    'ctw-09-giang-vien-lop-hoc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/03-giang-vien/03-09-giang-vien-lop-hoc-afeaf35e.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Phần 4 — Khách hàng (cổng khách) ── */
    'ctw-10-cong-khach-hang': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/04-khach-hang/04-10-cong-khach-hang-db469fcd.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Phần 5 — Nâng cao: AI, agent, tích hợp ── */
    'ctw-11-ai-agent-tich-hop': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/05-nang-cao-ai-tich-hop/05-11-ai-agent-tich-hop-b6b82e63.mp4' }, defaultVideoTrack: 'VI'},
    'ctw-12-app-may-tinh-dien-thoai': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/05-nang-cao-ai-tich-hop/05-12-app-may-tinh-dien-thoai-1d07a889.mp4' }, defaultVideoTrack: 'VI'},
  },
};
