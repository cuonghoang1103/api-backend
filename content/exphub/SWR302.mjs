/**
 * Exp Hub guide for SWR302 — draw.io + StarUML + Jira + SRS template (Vietnamese).
 * Academy SWR302 links its "Cài đặt" card to /exp-hub/swr302-cong-cu-yeu-cau.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'swr302-cong-cu-yeu-cau',
    title: 'SWR302 — Công cụ vẽ mô hình & viết SRS',
    kind: 'NOTE',
    language: 'markdown',
    status: 'PUBLISHED',
    description: 'Bộ công cụ cho SWR302: draw.io/diagrams.net và StarUML để vẽ use-case/UML, Jira/Trello để quản lý yêu cầu, và một khung SRS (IEEE 830) để bắt đầu viết đặc tả.',
    referenceUrl: 'https://www.drawio.com/',
    codeBlocks: [
      {
        name: 'Khung SRS tối giản (IEEE 830) — srs.md',
        language: 'markdown',
        code: `# Software Requirements Specification — <Ten du an>

## 1. Gioi thieu
- Muc dich, pham vi, tu viet tat, tai lieu tham chieu

## 2. Mo ta tong quan
- Boi canh san pham, chuc nang chinh, dac diem nguoi dung, rang buoc

## 3. Yeu cau chuc nang (Functional)
- FR-01: He thong PHAI cho phep nguoi dung dang nhap bang email/mat khau.
- FR-02: He thong PHAI ...  (moi yeu cau co ID + tieu chi kiem thu)

## 4. Yeu cau phi chuc nang (Non-functional)
- NFR-01 (Hieu nang): trang tai < 2s voi 100 nguoi dung dong thoi.
- NFR-02 (Bao mat): mat khau luu duoi dang bam (hash).

## 5. Phu luc
- Mo hinh use-case, so do luong, tu dien du lieu`,
      },
      {
        name: 'Mẫu User Story + tiêu chí chấp nhận',
        language: 'text',
        code: `Story: La MOT <vai tro>, toi MUON <muc tieu> DE <ly do>.

Vi du:
  La mot khach hang, toi muon loc san pham theo gia
  de tim nhanh mon hang trong ngan sach.

Tieu chi chap nhan (Acceptance Criteria):
  - Cho: dang o trang danh sach san pham
  - Khi: chon khoang gia 100k - 300k
  - Thi: chi hien san pham co gia trong khoang do`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn công cụ · SWR302</span>
<h2>Vẽ mô hình & viết đặc tả yêu cầu</h2>
<p class="lead">SWR302 là môn <strong>lấy và viết yêu cầu</strong> — ít code, nhiều mô hình và tài liệu. Bạn cần công cụ để <strong>vẽ</strong> (use-case, sơ đồ luồng, UML), để <strong>quản lý</strong> danh sách yêu cầu (backlog), và một <strong>khung SRS</strong> để viết đặc tả cho chuẩn.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">draw.io</div><div class="lz-d">vẽ use-case/UML</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">StarUML</div><div class="lz-d">UML chuyên sâu</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Jira / Trello</div><div class="lz-d">quản lý backlog</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Khung SRS</div><div class="lz-d">viết đặc tả</div></div>
</div>

<h3>🅐 draw.io / diagrams.net — vẽ nhanh, miễn phí</h3>
<p>Công cụ vẽ sơ đồ tốt nhất cho sinh viên: dùng thẳng trên web (không cài), hoặc tải bản desktop. Vẽ được use-case, activity, sequence, ERD.</p>
<a class="link-card dl" href="https://app.diagrams.net/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">draw.io (diagrams.net) — dùng ngay trên web</span><span class="lc-sub">app.diagrams.net · miễn phí · lưu vào Google Drive/máy</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://www.drawio.com/blog/diagrams-offline" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">draw.io Desktop (bản cài offline)</span><span class="lc-sub">drawio.com · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 StarUML — khi cần UML chuẩn chỉnh</h3>
<p>Nếu giảng viên yêu cầu mô hình UML đầy đủ (class diagram, state machine), StarUML mạnh hơn draw.io. Có bản dùng thử không giới hạn thời gian.</p>
<a class="link-card dl" href="https://staruml.io/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">StarUML</span><span class="lc-sub">staruml.io · Windows/macOS/Linux · bản dùng thử đầy đủ tính năng</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Jira hoặc Trello — quản lý yêu cầu</h3>
<p>Yêu cầu cần được ghi thành <strong>backlog</strong> (danh sách có ưu tiên). Trello đơn giản (bảng Kanban), Jira mạnh hơn (đúng chuẩn Agile công nghiệp). Cả hai đều miễn phí cho nhóm nhỏ.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Trello</b> — bảng thẻ trực quan, học 5 phút là dùng được. Hợp bài tập nhóm.</div>
  <div class="lz-layer"><b>Jira</b> — quản lý epic/story/sprint đúng chuẩn Scrum, liên kết với SWP391.</div>
</div>
<a class="link-card dl" href="https://www.atlassian.com/software/jira/free" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Jira / Trello (Atlassian) — gói Free</span><span class="lc-sub">atlassian.com · miễn phí cho nhóm nhỏ · đăng ký bằng email</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🅓 Bắt đầu viết SRS</h3>
<p>Đừng viết từ trang trắng — copy khung SRS trong khối "Khung SRS tối giản (IEEE 830)" bên trên vào một file <code>.md</code> hoặc Word rồi điền dần. Nhớ: mỗi yêu cầu phải có <strong>ID</strong> và <strong>kiểm thử được</strong> (đo/quan sát được).</p>
<div class="note-ct">Mẹo: yêu cầu tốt phải rõ, không mơ hồ, không mâu thuẫn, và <b>truy vết được</b> (mỗi FR nối tới use-case + test case). Tránh chữ mơ hồ như "nhanh", "thân thiện" — thay bằng số đo cụ thể (NFR).</div>
`,
  },
};
