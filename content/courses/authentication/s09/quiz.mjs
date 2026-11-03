/**
 * Authentication · Chương 9 · Quiz (10 câu tình huống trên LabFlow ID v0.9). Slug giữ: auth-9-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 6, 10) · B ×2 (câu 3, 8) · C ×3 (câu 2, 5, 9) · D ×2 (câu 4, 7).
 */
export default {
  title: 'Quiz: authorization models|||Quiz: mô hình phân quyền',
  slug: 'auth-9-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống trên LabFlow ID v0.9 về Chương 9: xác thực vs phân quyền, IDOR, RBAC một bảng, ADMIN trong tenant, ABAC sở hữu, ReBAC trưởng khoa, ranh giới tenant 404-không-403, một cổng và nơi đặt phép kiểm — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Chapter 9 check</h2>
<p class="lead">Ten scenarios on LabFlow ID v0.9, guarding rooms and bookings across two tenants. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say where authentication ends and authorization begins, and name OWASP #1.</li>
<li>I can keep RBAC in one table and explain why scattered role checks rot.</li>
<li>I can place ownership as ABAC and the head-relationship as ReBAC.</li>
<li>I can explain why a cross-tenant request returns 404, not 403.</li>
<li>I can say where the one gate lives and why it loads the resource itself.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm tra Chương 9</h2>
<p class="lead">Mười tình huống trên LabFlow ID v0.9, canh phòng và lượt đặt qua hai tenant. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được chỗ xác thực dừng và phân quyền bắt đầu, và gọi tên OWASP #1.</li>
<li>Tôi giữ được RBAC trong một bảng và giải thích vì sao phép kiểm vai rải rác mục ruỗng.</li>
<li>Tôi đặt được quyền sở hữu thành ABAC và quan hệ trưởng khoa thành ReBAC.</li>
<li>Tôi giải thích được vì sao một yêu cầu khác tenant trả 404, không 403.</li>
<li>Tôi nói được một cổng nằm ở đâu và vì sao nó tự nạp tài nguyên.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A route authenticates the caller correctly, loads a booking by its id, and returns it — with no other check. What is wrong?|||Một tuyến xác thực người gọi đúng, nạp một lượt đặt theo id của nó, và trả về — không phép kiểm nào khác. Sai ở đâu?',
        options: [
          'It is an IDOR: authentication is fine, but authorization is missing — anyone reads anyone\'s booking by changing the id', 'Nothing — a valid session is enough', 'It should encrypt the id in the URL', 'It is too slow without caching'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Knowing WHO is calling (authentication) is not knowing they MAY see this object (authorization). Missing the ownership/access check is an IDOR — OWASP A01, #1 (9.1). VI: Biết AI đang gọi (xác thực) không phải biết họ ĐƯỢC xem đối tượng này (phân quyền). Thiếu phép kiểm sở hữu/truy cập là một IDOR — OWASP A01, #1 (9.1).',
      },
      {
        question: 'Why is "deny by default" the safe way to build the gate?|||Vì sao "từ chối mặc định" là cách an toàn để dựng cổng?',
        options: [
          'Because it is faster to compute', 'Because it logs more', 'Because a forgotten grant then fails CLOSED: an action nobody granted is denied to everyone, including roles you forgot to update', 'Because it lets admins do everything'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The decision starts at "no"; only a rule flips it to yes. A new or forgotten action is forbidden rather than silently allowed (9.1, 9.2). VI: Quyết định bắt đầu ở "không"; chỉ một luật lật nó thành có. Một hành động mới hay bị quên thì bị cấm chứ không âm thầm cho phép (9.1, 9.2).',
      },
      {
        question: 'A teammate adds if (user.role === \'Admin\') in one controller to grant access. Name the two separate problems.|||Một đồng đội thêm if (user.role === \'Admin\') trong một controller để cấp quyền. Gọi tên hai vấn đề riêng biệt.',
        options: [
          'It is too verbose, and it needs a comment', 'It scatters the policy outside the one gate, AND \'Admin\' never matches the stored \'ADMIN\' — a case-drift bug', 'It is fine; roles are strings', 'It should use == instead of ==='],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: One is structural (policy belongs in one table/gate, not controllers); one is a concrete bug (case mismatch). Scattered role strings rot exactly this way (9.2). VI: Một cái là cấu trúc (chính sách thuộc về một bảng/cổng, không phải controller); một cái là lỗi cụ thể (lệch chữ hoa/thường). Chuỗi vai rải rác mục ruỗng đúng kiểu này (9.2).',
      },
      {
        question: 'You need "a user may cancel their OWN booking". Can you model this as a role, and if not, what is it?|||Bạn cần "một người dùng được huỷ lượt đặt CỦA MÌNH". Mô hình nó thành một vai được không, và nếu không thì nó là gì?',
        options: [
          'Yes — add an OWNER role', 'Yes — make everyone an admin of their own data', 'No — use a database trigger', 'No — "owner" is not a fixed set of users; it is an attribute of the (user, booking) pair — ABAC'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Everyone owns different things, so "owner" cannot be a role. Ownership is a per-pair fact compared at decision time — ABAC (9.3). VI: Ai cũng sở hữu thứ khác nhau, nên "chủ" không thể là một vai. Quyền sở hữu là một sự thật theo-cặp so lúc ra quyết định — ABAC (9.3).',
      },
      {
        question: 'The head of the SE department tries to cancel a booking for a BA-department room, same tenant. What does can() return, and via which model?|||Trưởng khoa SE thử huỷ một lượt đặt cho một phòng của khoa BA, cùng tenant. can() trả gì, và qua mô hình nào?',
        options: [
          'Allowed — a dept head may manage any room', 'Allowed — ADMIN blanket applies', 'Denied — ReBAC scopes the head to THEIR department, and no other model grants it; so deny by default', 'Denied — the tenant boundary blocks it'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Same tenant (not the tenant check); DEPT_HEAD has no booking:cancel grant (RBAC); not the owner (ABAC); ReBAC needs matching departmentId (SE≠BA) — so denied (9.3). VI: Cùng tenant (không phải phép kiểm tenant); DEPT_HEAD không có quyền booking:cancel (RBAC); không phải chủ (ABAC); ReBAC cần departmentId khớp (SE≠BA) — nên từ chối (9.3).',
      },
      {
        question: 'An ABAC rule reads ownerId from req.body to decide if the caller owns the resource. What is the attack?|||Một luật ABAC đọc ownerId từ req.body để quyết định người gọi có sở hữu tài nguyên không. Cú tấn công là gì?',
        options: [
          'The caller sends ownerId equal to their own id and "owns" any resource — read ownerId from the server-loaded record instead', 'The body is too large and causes a DoS', 'JSON parsing is slow', 'Nothing — the body is from an authenticated user'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Any attribute used in a decision must come from the server\'s record, never request-controlled input, or the check is trivially bypassed (9.3). VI: Mọi thuộc tính dùng trong một quyết định phải đến từ bản ghi của máy chủ, không bao giờ đầu vào do yêu cầu điều khiển, nếu không phép kiểm bị vượt dễ như bỡn (9.3).',
      },
      {
        question: 'A user from FPT HN requests a booking that exists only in FPT HCM. What status must the gate return, and why?|||Một người dùng từ FPT HN yêu cầu một lượt đặt chỉ tồn tại ở FPT HCM. Cổng phải trả mã nào, và vì sao?',
        options: [
          '403 Forbidden — they are not allowed', '200 but with the data hidden', '401 — they must re-authenticate', '404 Not Found — identical to a non-existent id, so the boundary does not reveal the resource exists'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A 403 confirms existence and enables cross-tenant enumeration; answering the same 404 as "not found" leaks nothing (9.4, the 6.4 rule). VI: Một 403 xác nhận sự tồn tại và mở đường dò xuyên tenant; trả cùng cái 404 như "không tìm thấy" không lộ gì (9.4, luật 6.4).',
      },
      {
        question: 'When is 403 (not 404) the correct answer from the gate?|||Khi nào 403 (không phải 404) là câu trả lời đúng từ cổng?',
        options: [
          'Whenever the user lacks a role', 'When the resource IS in the user\'s own tenant but no model grants the action — an honest "you cannot" that leaks nothing', 'Never — always use 404', 'Only for admins'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Within your own tenant, existence is not a secret, so an honest 403 is right; 404 is reserved for cross-tenant/missing to block enumeration (9.4). VI: Trong tenant của chính bạn, sự tồn tại không phải bí mật, nên một 403 trung thực là đúng; 404 dành cho khác-tenant/thiếu để chặn dò (9.4).',
      },
      {
        question: 'Your list query filters by tenant, but a new GET /bookings/:id loads by id alone. Why is moving the check into one gate the real fix?|||Truy vấn liệt kê của bạn lọc theo tenant, nhưng một GET /bookings/:id mới nạp chỉ theo id. Vì sao chuyển phép kiểm vào một cổng mới là cách sửa thật?',
        options: [
          'It makes queries faster', 'It removes the need for a database', 'The gate loads the resource and checks the tenant for EVERY route, so no single route can forget the boundary', 'It hides the id from the URL'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Per-query filters are per-route vigilance; one route without the WHERE breaks the wall. The gate centralises the check so forgetting is structurally hard (9.4, 9.5). VI: Bộ lọc theo-từng-truy-vấn là cảnh giác theo-từng-tuyến; một tuyến thiếu WHERE làm sập tường. Cổng tập trung hoá phép kiểm nên việc quên khó về cấu trúc (9.4, 9.5).',
      },
      {
        question: 'Why does the gate middleware load the resource itself, rather than letting the handler pass one in?|||Vì sao middleware cổng tự nạp tài nguyên, thay vì để handler truyền một cái vào?',
        options: [
          'So a handler cannot hand it attacker-controlled attributes (ownerId, tenantId) and bypass ABAC and the tenant check', 'To save a database query', 'Because middleware cannot read req.params', 'So the handler runs faster'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: If the handler supplied the resource it could supply forged attributes, defeating the very checks the gate exists for. The gate fetches the server\'s record itself (9.3, 9.5). VI: Nếu handler cung cấp tài nguyên, nó có thể cung cấp thuộc tính giả, đánh bại đúng các phép kiểm mà cổng tồn tại để làm. Cổng tự lấy bản ghi của máy chủ (9.3, 9.5).',
      },
    ],
  },
};
