/**
 * CEA201 · Quiz Nâng cao 3 — Khi tốc độ thành lỗ hổng bảo mật (N3.1: Spectre, Meltdown, kênh phụ thời gian của cache).
 * 6 câu, nối lại Chương 1 (kiến trúc vs tổ chức), Chương 4 (cache hit/miss), Chương 12/14 + Nâng cao 2 (suy đoán).
 * Câu về bản vá chỉ nêu điều bài học nói (microcode, hệ điều hành, tắt bớt tối ưu, trả giá bằng hiệu năng).
 * Đáp án rải: A (q2) · B ×2 (q3, q6) · C (q4) · D ×2 (q1, q5).
 */
export default {
  title: 'Quiz — Advanced 3: when speed becomes a security hole|||Quiz — Nâng cao 3: khi tốc độ thành lỗ hổng bảo mật',
  slug: 'cea201-quiz-nang-cao-3',
  type: 'QUIZ',
  description: 'Tự kiểm phần Nâng cao 3: Spectre và Meltdown lợi dụng suy đoán và thời gian truy cập cache ra sao, vì sao "kết quả đã bị huỷ" vẫn lộ bí mật, và bài học kiến trúc/tổ chức của cả môn.',
  quiz: {
    timeLimitSeconds: 420,
    questions: [
      { id: 'q1', points: 1,
        question: 'Spectre and Meltdown (2018) combine two features from this course. Which two?|||Spectre và Meltdown (2018) kết hợp hai tính năng của môn này. Đó là hai tính năng nào?',
        options: ['Virtual memory and RAID|||Bộ nhớ ảo và RAID', 'DMA and interrupts|||DMA và ngắt', 'Microprogrammed control and ECC|||Điều khiển vi chương trình và ECC', 'Speculative execution and cache timing|||Thực thi suy đoán và thời gian truy cập cache'],
        correctIndex: 3,
        explanation: 'The CPU speculatively runs ahead (Chapter 14, Advanced 2) and touches data it should not; that access changes which lines are in the cache (Chapter 4), and the attacker reads the change by timing memory accesses.|||CPU chạy trước theo suy đoán (Chương 14, Nâng cao 2) và chạm vào dữ liệu không được phép; lần truy cập đó làm đổi những dòng đang nằm trong cache (Chương 4), và kẻ tấn công đọc ra sự thay đổi bằng cách đo thời gian truy cập bộ nhớ.' },
      { id: 'q2', points: 1,
        question: 'The speculative instructions are discarded and the program\'s results stay correct. How can a secret still leak?|||Các lệnh suy đoán đã bị huỷ và kết quả của chương trình vẫn đúng. Sao bí mật vẫn lộ được?',
        options: ['The discarded work already changed the cache state, which timing can reveal|||Phần việc bị huỷ đã kịp làm đổi trạng thái cache, mà đo thời gian thì thấy được', 'The CPU writes the secret into a register the attacker owns|||CPU ghi bí mật vào thanh ghi mà kẻ tấn công sở hữu', 'The operating system logs speculative reads|||Hệ điều hành ghi nhật ký các lần đọc suy đoán', 'The secret is printed to the screen|||Bí mật được in ra màn hình'],
        correctIndex: 0,
        explanation: 'Rolling back restores the architectural state (registers, memory) but not the microarchitectural state: a line brought into the cache stays there. A later access to it is a hit — measurably faster than a miss — and that timing difference encodes the secret.|||Quay lui khôi phục trạng thái kiến trúc (thanh ghi, bộ nhớ) nhưng không khôi phục trạng thái vi kiến trúc: dòng đã được nạp vào cache vẫn nằm đó. Lần truy cập sau tới nó là hit — nhanh hơn miss một cách đo được — và chênh lệch thời gian đó mã hoá bí mật.' },
      { id: 'q3', points: 1,
        question: 'Why does the attacker measure TIME rather than read the data directly?|||Vì sao kẻ tấn công đo THỜI GIAN thay vì đọc thẳng dữ liệu?',
        options: ['Because timing is more accurate than reading memory|||Vì đo thời gian chính xác hơn đọc bộ nhớ', 'The data was never architecturally visible; only its side effect on the cache was|||Dữ liệu chưa từng hiện ra ở mức kiến trúc; chỉ có tác dụng phụ của nó lên cache là hiện ra', 'Reading memory requires administrator rights on every CPU|||Đọc bộ nhớ cần quyền quản trị trên mọi CPU', 'Timing attacks need no code to run|||Tấn công thời gian không cần chạy chút mã nào'],
        correctIndex: 1,
        explanation: 'The protection checks work: the illegal read never produces a usable result. What escapes is a side channel — the cache hit/miss timing of Chapter 4 — which nobody designed as an output. That is why it is called a side-channel attack.|||Các phép kiểm bảo vệ vẫn hoạt động: lần đọc trái phép không bao giờ cho ra kết quả dùng được. Thứ thoát ra là một kênh phụ — thời gian hit/miss của cache ở Chương 4 — thứ không ai thiết kế để làm đầu ra. Vì thế mới gọi là tấn công kênh phụ.' },
      { id: 'q4', points: 1,
        question: 'In terms of Chapter 1, what does N3.1 call the deepest lesson of these attacks?|||Theo ngôn ngữ của Chương 1, N3.1 gọi bài học sâu nhất của các tấn công này là gì?',
        options: ['Architecture is irrelevant to security|||Kiến trúc không liên quan gì tới bảo mật', 'Organization should be visible to programmers|||Tổ chức nên được lập trình viên nhìn thấy', 'The architecture stayed correct, but the organization leaked — abstractions leak|||Kiến trúc vẫn đúng, nhưng tổ chức bị rò — trừu tượng hoá có thể rò rỉ', 'RISC designs are immune|||Thiết kế RISC miễn nhiễm'],
        correctIndex: 2,
        explanation: 'Chapter 1 separates architecture (what the programmer sees) from organization (how it is built). Speculation and caches were meant to be invisible "how"; timing made them observable, and therefore exploitable. The attacks affected nearly every modern high-performance CPU, not one instruction-set family.|||Chương 1 tách kiến trúc (thứ lập trình viên thấy) khỏi tổ chức (cách nó được dựng). Suy đoán và cache vốn được coi là phần "cách làm" vô hình; thời gian đã khiến chúng quan sát được, nên khai thác được. Các tấn công ảnh hưởng gần như mọi CPU hiệu năng cao hiện đại, không riêng một họ tập lệnh nào.' },
      { id: 'q5', points: 1,
        question: 'According to N3.1, what did fixing these vulnerabilities involve?|||Theo N3.1, việc vá các lỗ hổng này gồm những gì?',
        options: ['Replacing all RAM modules|||Thay mọi thanh RAM', 'Only a browser update|||Chỉ cập nhật trình duyệt', 'Rewriting every application in a safe language|||Viết lại mọi ứng dụng bằng ngôn ngữ an toàn', 'Microcode updates, OS changes and sometimes disabling optimizations — at a performance cost|||Cập nhật microcode, sửa hệ điều hành và đôi khi tắt bớt tối ưu — trả giá bằng hiệu năng'],
        correctIndex: 3,
        explanation: 'The flaw sits in the processor\'s organization, so the fixes came from every layer that can influence it: microcode, the operating system and, where needed, switching off or fencing speculation. Each costs some of the speed the optimization was built to provide — and the episode reshaped how CPUs are designed and reviewed.|||Lỗi nằm ở tổ chức của bộ xử lý, nên bản vá đến từ mọi tầng tác động được vào nó: microcode, hệ điều hành và, khi cần, tắt hoặc rào bớt suy đoán. Mỗi cách đều lấy lại một phần tốc độ mà tối ưu đó sinh ra để cung cấp — và sự kiện này định hình lại cách CPU được thiết kế và rà soát.' },
      { id: 'q6', points: 1,
        question: 'Why is a cache hit useful to an attacker as a 1-bit signal?|||Vì sao một lần cache hit hữu ích với kẻ tấn công như một tín hiệu 1 bit?',
        options: ['A hit returns the data encrypted|||Hit trả về dữ liệu đã mã hoá', 'A hit is measurably faster than a miss, so "fast" or "slow" reveals whether a line was recently touched|||Hit nhanh hơn miss một cách đo được, nên "nhanh" hay "chậm" cho biết một dòng vừa bị chạm tới hay chưa', 'A hit raises an interrupt|||Hit gây ra một ngắt', 'A hit changes the program counter|||Hit làm đổi bộ đếm chương trình'],
        correctIndex: 1,
        explanation: 'Chapter 4: the whole point of a cache is that a hit costs a few cycles while a miss goes to main memory. If speculation loaded the line chosen by a secret value, timing each candidate line tells which one is cached — and therefore the secret.|||Chương 4: toàn bộ ý nghĩa của cache là hit chỉ tốn vài chu kỳ còn miss phải xuống bộ nhớ chính. Nếu suy đoán đã nạp đúng dòng được chọn bởi giá trị bí mật, đo thời gian từng dòng ứng viên sẽ cho biết dòng nào đang trong cache — tức là bí mật.' },
    ],
  },
};
