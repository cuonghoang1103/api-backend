/**
 * Exp Hub guide for SWD392 — UML modeling & design tools (Vietnamese).
 * Academy SWD392 bài 0.4 links its "Công cụ" card to /exp-hub/swd392-cong-cu-uml.
 * Tools: Visual Paradigm / draw.io / PlantUML + AI (ChatGPT/Copilot) for CLO7.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'swd392-cong-cu-uml',
    title: 'SWD392 — Bộ công cụ mô hình UML (Visual Paradigm, PlantUML, draw.io)',
    kind: 'NOTE',
    language: 'markdown',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ công cụ mô hình cho môn kiến trúc & thiết kế: Visual Paradigm (UML CASE đầy đủ), draw.io (nhanh, miễn phí), PlantUML (viết UML bằng text, hợp Git & AI), và cách dùng AI (ChatGPT/Copilot) sinh use case + sơ đồ theo CLO7.',
    referenceUrl: 'https://plantuml.com/',
    noteContent: `
<h2>Bộ công cụ cho SWD392 — Mô hình UML & thiết kế</h2>
<p>Môn này là về tạo ra sơ đồ và tài liệu thiết kế. Chọn một công cụ chính bạn dùng nhanh, và học thêm PlantUML (biến text thành sơ đồ, cực hợp version control và AI).</p>

<h3>1) Visual Paradigm (hoặc MagicDraw) — UML CASE đầy đủ</h3>
<p>Tải bản Community/Student của <b>Visual Paradigm</b> (miễn phí cho sinh viên). Dùng để vẽ chính thức cho Course Project: use case, class, sequence, statechart, và cả sinh code khung. Đây là công cụ cho sản phẩm nộp.</p>

<h3>2) draw.io (diagrams.net) — nhanh & miễn phí</h3>
<p>Chạy thẳng trên trình duyệt tại <b>app.diagrams.net</b>, không cần cài. Tốt nhất cho ý tưởng nhanh và các sơ đồ đơn giản. Có sẵn shape UML.</p>

<h3>3) PlantUML — viết UML bằng text</h3>
<p>Cài extension <b>PlantUML</b> trong VS Code (cần Java + Graphviz, hoặc dùng server online). Viết sơ đồ bằng text nên nó nằm trong Git, diff sạch, và một AI có thể sinh ra nó. Xem code block bên dưới cho cú pháp class/sequence/state.</p>

<h3>4) AI cho thiết kế (CLO7) — ChatGPT + Copilot</h3>
<p><b>ChatGPT</b>: nhờ phác mô tả use case từ yêu cầu, hoặc sinh PlantUML cho một class diagram — rồi bạn KIỂM multiplicity và loại quan hệ (AI hay sai association vs composition). <b>GitHub Copilot</b>: sinh boilerplate (lớp entity, DAO) từ thiết kế của bạn. Luôn nhớ: bạn sở hữu và phải bảo vệ được mọi quyết định.</p>

<h3>Checklist đã sẵn sàng</h3>
<ul>
  <li>✓ Cài Visual Paradigm (hoặc chọn draw.io) và vẽ thử một class diagram</li>
  <li>✓ Cài extension PlantUML trong VS Code, render được một sơ đồ mẫu</li>
  <li>✓ Có tài khoản ChatGPT/Gemini; thử sinh một PlantUML rồi tự sửa</li>
  <li>✓ Bookmark app.diagrams.net và plantuml.com</li>
</ul>
`,
    codeBlocks: [
      {
        name: 'PlantUML — class diagram (quan hệ & multiplicity)',
        language: 'text',
        code: `@startuml
class Student {
  +id: int
  +name: string
}
class Course {
  +id: int
  +title: string
}
class Enrollment {
  +enrolledAt: date
}
Student "1" -- "*" Enrollment
Course  "1" -- "*" Enrollment
@enduml`,
      },
      {
        name: 'PlantUML — statechart (vòng đời một Order)',
        language: 'text',
        code: `@startuml
[*] --> Pending
Pending --> Paid : payment ok
Pending --> Cancelled : timeout
Paid --> Shipped : dispatch
Shipped --> Delivered
Delivered --> [*]
@enduml`,
      },
      {
        name: 'Link tải & công cụ',
        language: 'markdown',
        code: `Visual Paradigm:  https://www.visual-paradigm.com/download/
draw.io:          https://app.diagrams.net/
PlantUML:         https://plantuml.com/  (VS Code extension: "PlantUML")
Graphviz (cho PlantUML local): https://graphviz.org/download/`,
      },
    ],
  },
};
