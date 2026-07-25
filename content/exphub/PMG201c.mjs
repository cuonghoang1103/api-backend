/**
 * Exp Hub guide for PMG201c — Project Management tools (Vietnamese).
 * Academy PMG201c bài 0.4 links its "Công cụ" card to /exp-hub/pmg201c-cong-cu-du-an.
 * Tools: Coursera + GanttProject/ProjectLibre + Excel EVM + Trello + Miro/draw.io.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'pmg201c-cong-cu-du-an',
    title: 'PMG201c — Bộ công cụ quản trị dự án (GanttProject, Excel EVM, Trello)',
    kind: 'NOTE',
    language: 'markdown',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ công cụ cho môn quản trị dự án: đăng ký Coursera, cài GanttProject/ProjectLibre để dựng WBS + Gantt + đường găng, dùng Excel/Google Sheets cho ước lượng PERT và Earned Value, Trello để mô phỏng thực hiện, và draw.io/Miro để vẽ sơ đồ mạng & stakeholder map.',
    referenceUrl: 'https://www.ganttproject.biz/',
    noteContent: `
<h2>Bộ công cụ cho PMG201c — Quản trị dự án</h2>
<p>Phần thi PE yêu cầu bạn dựng lịch, tính đường găng và Earned Value. Chuẩn bị sẵn các công cụ dưới đây để luyện <em>kỹ thuật</em> thay vì vật lộn phần mềm.</p>

<h3>1) Coursera — nơi học 4 khoá (bắt buộc)</h3>
<p>Bốn khoá "Introduction to Project Management Principles and Practices" (UC Irvine) là cánh cổng vào phòng thi và +1 điểm thưởng. Ghi danh qua lời mời của admin lớp, hoàn thành cả bốn để lấy chứng chỉ.</p>

<h3>2) GanttProject / ProjectLibre — WBS, Gantt & đường găng</h3>
<p>Cài <b>GanttProject</b> (miễn phí, nhẹ, đa nền tảng) hoặc <b>ProjectLibre</b> (thay MS Project miễn phí). Dùng để nhập công việc, đặt phụ thuộc, và phần mềm tự tô đường găng + vẽ biểu đồ Gantt. Luyện dựng sơ đồ mạng bằng tay trước, rồi kiểm lại bằng phần mềm.</p>

<h3>3) Excel / Google Sheets — PERT & Earned Value</h3>
<p>Dùng bảng tính cho: ước lượng PERT <code>=(O+4*M+P)/6</code>, bảng đường găng (forward/backward pass), và bảng EVM (PV/EV/AC → CPI=EV/AC, SPI=EV/PV, EAC=BAC/CPI). Tự dựng một mẫu EVM một lần, bạn sẽ nhớ công thức khi thi.</p>

<h3>4) Trello / Jira — theo dõi công việc</h3>
<p>Tạo một bảng Trello với cột To do / Doing / Done để mô phỏng giai đoạn Thực hiện & Giám sát. Đây là cách trực quan hiểu monitoring và change control trên một dự án thật nhỏ.</p>

<h3>5) draw.io / Miro / Lucidchart — sơ đồ</h3>
<p>Dùng <b>draw.io</b> (miễn phí, chạy web) để vẽ sơ đồ mạng (network diagram), stakeholder power/interest grid, và WBS dạng cây gọn gàng cho báo cáo capstone.</p>

<h3>Checklist đã sẵn sàng</h3>
<ul>
  <li>✓ Đã ghi danh cả 4 khoá Coursera</li>
  <li>✓ Cài GanttProject hoặc ProjectLibre, thử tạo 1 lịch có phụ thuộc</li>
  <li>✓ Có một mẫu Excel/Sheets tính PERT + EVM</li>
  <li>✓ Tạo một bảng Trello mẫu; bookmark draw.io</li>
</ul>
`,
    codeBlocks: [
      {
        name: 'Công thức bảng tính hay dùng (Excel / Google Sheets)',
        language: 'text',
        code: `PERT estimate:   =(O + 4*M + P)/6
PERT std dev:    =(P - O)/6
Earned Value:    EV = %complete * BAC_task
Cost index:      CPI = EV / AC        (>1 tot, <1 vuot ngan sach)
Schedule index:  SPI = EV / PV        (>1 som, <1 cham tien do)
Cost variance:   CV  = EV - AC
Schedule var.:   SV  = EV - PV
Est at complete: EAC = BAC / CPI`,
      },
      {
        name: 'Link tải & đăng ký chính chủ',
        language: 'markdown',
        code: `Coursera (4 khoa):  https://www.coursera.org/specializations/project-management
GanttProject:       https://www.ganttproject.biz/download
ProjectLibre:       https://www.projectlibre.com/product/projectlibre-open-source
Trello:             https://trello.com/
draw.io:            https://app.diagrams.net/`,
      },
    ],
  },
};
