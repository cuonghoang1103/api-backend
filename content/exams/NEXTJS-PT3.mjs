/**
 * Next.js & React — Progress Test 3 (chương 13–20: từ giao diện tới production).
 *
 * Đề tự soạn, bám sát `content/courses/nextjs/s13…s20`. 30 câu trắc nghiệm + 2
 * câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ Hai lời giải mẫu là Node.js thuần, đã CHẠY THẬT khớp expectedOutput. Nhiều
 * câu lồng sự cố thật cuongthai.com (theme .dark vs theme-dark, chữ đen nền đen,
 * JWT 24h/cookie 7d, getMediaUrl ghép CDN vào blob:, NEXT_PUBLIC bake, deploy
 * đẩy code không đẩy data, đo bundle bằng next build).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-PT3.mjs --apply
 */
import { B, EX, code, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nextjs-exam-kit.mjs';

export default {
  course: { slug: 'nextjs' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 13–20 (styling, state, auth, forms, rendering, performance, testing, deploy)',
        'Kiểm tra tiến độ 3 — Chương 13–20 (giao diện, state, xác thực, form, render, hiệu năng, kiểm thử, deploy)',
      ),
      description: B(
        'From the UI to production: Tailwind and theming, client and server state, auth with middleware and cookies, forms and uploads, rendering strategies and SEO, performance, testing, and shipping with Docker. 30 multiple-choice questions plus 2 coding questions, several drawn from real cuongthai.com incidents.',
        'Từ giao diện tới production: Tailwind và theme, state phía client và server, xác thực với middleware và cookie, form và upload, chiến lược render và SEO, hiệu năng, kiểm thử, và đưa lên bằng Docker. 30 câu trắc nghiệm và 2 câu lập trình, nhiều câu lấy từ sự cố thật của cuongthai.com.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '13–20'),
      questions: [
        // ── Chương 13 — Styling / Tailwind / theme ──────────────────────
        mcq({
          prompt: B(
            'Tailwind is a utility-first CSS framework. What does that mean in practice?',
            'Tailwind là framework CSS "utility-first". Trên thực tế nghĩa là gì?',
          ),
          options: [
            B('You compose styles from many small single-purpose classes right in the markup', 'Bạn ghép kiểu từ nhiều class nhỏ mỗi class một việc, ngay trong markup'),
            B('You write large hand-authored CSS files per component', 'Bạn viết các file CSS lớn tự soạn cho từng component'),
            B('It ships one big pre-made theme you cannot change', 'Nó gửi kèm một theme đúc sẵn khổng lồ không sửa được'),
            B('It replaces HTML with a custom template language', 'Nó thay HTML bằng một ngôn ngữ mẫu riêng'),
          ],
          correct: 0,
          explanation: EX(
            'Utility-first means tiny classes each do one thing (<code>flex</code>, <code>p-4</code>, <code>text-sm</code>) and you combine them in the JSX. The build step scans your files and emits only the classes you actually used, keeping the CSS small.',
            'Utility-first nghĩa là những class tí hon mỗi cái làm một việc (<code>flex</code>, <code>p-4</code>, <code>text-sm</code>) và bạn kết hợp chúng ngay trong JSX. Bước build quét file của bạn và chỉ phát ra những class thật sự dùng, giữ CSS nhỏ gọn.',
          ),
        }),
        mcq({
          prompt: B(
            'The global dark theme on cuongthai.com uses the class <code>theme-dark</code>, NOT <code>dark</code>. Why does putting <code>dark</code> on <code>&lt;html&gt;</code> cause trouble?',
            'Theme tối toàn cục của cuongthai.com dùng class <code>theme-dark</code>, KHÔNG phải <code>dark</code>. Vì sao đặt <code>dark</code> lên <code>&lt;html&gt;</code> lại gây rắc rối?',
          ),
          options: [
            B('It force-activates every Tailwind dark: utility site-wide, breaking components with their own theme switcher', 'Nó kích hoạt cưỡng bức mọi tiện ích dark: của Tailwind toàn site, phá các component có switcher theme riêng'),
            B('The class name dark is a reserved JavaScript keyword that browsers reject', 'Tên class dark là một từ khoá dành riêng của JavaScript và trình duyệt từ chối'),
            B('Tailwind silently ignores any class whose name happens to be dark', 'Tailwind âm thầm bỏ qua mọi class tình cờ có tên là dark'),
            B('It only affects the print stylesheet and nothing on the screen', 'Nó chỉ ảnh hưởng stylesheet lúc in và không gì trên màn hình'),
          ],
          correct: 0,
          explanation: EX(
            'Tailwind&#x27;s <code>dark:</code> variant keys off a <code>.dark</code> ancestor. Putting <code>dark</code> on <code>&lt;html&gt;</code> turned on every <code>dark:</code> utility globally and broke the Notes module&#x27;s own light/dark/brown switcher. The rule: the global class is <code>theme-dark</code>; <code>dark:</code> and the <code>.dark</code> class are reserved for the Notes wrapper only.',
            'Biến thể <code>dark:</code> của Tailwind bật theo tổ tiên có class <code>.dark</code>. Đặt <code>dark</code> lên <code>&lt;html&gt;</code> đã bật mọi tiện ích <code>dark:</code> toàn cục và phá switcher sáng/tối/nâu riêng của module Notes. Luật là: class toàn cục là <code>theme-dark</code>; còn <code>dark:</code> và class <code>.dark</code> chỉ dành riêng cho vỏ Notes.',
          ),
        }),
        mcq({
          prompt: B(
            'A dark-mode surface with a fixed dark background shows black text on black. The CSS variables were already set. What was still missing?',
            'Một bề mặt chế độ tối có nền tối cố định lại hiện chữ đen trên nền đen. Các biến CSS đã được đặt sẵn. Vẫn còn thiếu gì?',
          ),
          options: [
            B('An explicit color on the text — pinning variables is not enough, set color too', 'Một color rõ ràng cho chữ — ghim biến chưa đủ, phải đặt cả color'),
            B('A larger font-size so the text becomes readable on the dark surface', 'Một cỡ chữ lớn hơn để chữ đọc được trên bề mặt tối'),
            B('A higher z-index on the container so the text paints on top', 'Một z-index cao hơn cho container để chữ vẽ đè lên trên'),
            B('An extra print media query that overrides the dark colors', 'Một media query cho việc in để ghi đè các màu tối'),
          ],
          correct: 0,
          explanation: EX(
            'A surface with a hardcoded dark background must also set an explicit text <code>color</code> (or use the theme variable for it). Merely defining CSS variables does not apply them — this "black on black" bug touched 142 files. Test by flipping light↔dark and reading, not by trusting the variables are wired.',
            'Một bề mặt có nền tối gán cứng phải đặt luôn <code>color</code> chữ rõ ràng (hoặc dùng biến theme cho nó). Chỉ định nghĩa biến CSS không tự áp dụng chúng — lỗi "đen trên đen" này đụng tới 142 file. Hãy kiểm bằng cách lật sáng↔tối rồi đọc, đừng tin là biến đã được nối.',
          ),
        }),
        mcq({
          prompt: B(
            'How do you conditionally apply Tailwind classes cleanly in JSX?',
            'Cách áp dụng class Tailwind theo điều kiện một cách gọn gàng trong JSX là gì?',
          ),
          options: [
            B('Build the class string with a helper (clsx/cn) or a template literal', 'Dựng chuỗi class bằng một helper (clsx/cn) hoặc template literal'),
            B('Mutate element.className inside the render body', 'Sửa element.className ngay trong thân render'),
            B('Only ever use inline style objects, never classes', 'Chỉ dùng object style inline, không bao giờ dùng class'),
            B('Put an if statement inside the className attribute', 'Đặt một câu lệnh if bên trong thuộc tính className'),
          ],
          correct: 0,
          explanation: EX(
            'Compose the string with a small helper (<code>clsx</code>/<code>cn</code>) or a template literal: <code>className={cn("btn", isActive &amp;&amp; "btn-active")}</code>. You cannot put statements in JSX, and reaching into the DOM to mutate <code>className</code> fights React&#x27;s rendering.',
            'Hãy ghép chuỗi bằng một helper nhỏ (<code>clsx</code>/<code>cn</code>) hoặc template literal: <code>className={cn("btn", isActive &amp;&amp; "btn-active")}</code>. Bạn không thể đặt câu lệnh trong JSX, và thò tay vào DOM để sửa <code>className</code> là chống lại cơ chế render của React.',
          ),
        }),

        // ── Chương 14 — Quản lý state ───────────────────────────────────
        mcq({
          prompt: B(
            'When should you reach for a client store like Zustand instead of plain useState?',
            'Khi nào nên dùng một client store như Zustand thay cho useState thường?',
          ),
          options: [
            B('When many distant components need the same state without prop-drilling', 'Khi nhiều component ở xa nhau cần cùng một state mà không muốn khoan prop qua nhiều tầng'),
            B('For every single piece of state, always', 'Cho từng mẩu state một, luôn luôn'),
            B('Only for data fetched from a server', 'Chỉ cho dữ liệu tải từ server'),
            B('Only inside Server Components', 'Chỉ bên trong Server Component'),
          ],
          correct: 0,
          explanation: EX(
            'Local, single-component state belongs in <code>useState</code>. A store (Zustand) earns its place when the same state is read/written by many components spread across the tree — it avoids threading props through intermediate layers. Server data is a different concern (see TanStack Query below).',
            'State cục bộ của một component thì để trong <code>useState</code>. Một store (Zustand) chỉ xứng đáng khi cùng một state được nhiều component rải khắp cây đọc/ghi — nó tránh việc luồn prop qua các tầng trung gian. Dữ liệu server là chuyện khác (xem TanStack Query bên dưới).',
          ),
        }),
        mcq({
          prompt: B(
            'What kind of state is TanStack Query (React Query) designed to manage?',
            'TanStack Query (React Query) được thiết kế để quản lý loại state nào?',
          ),
          options: [
            B('Server state — cached async data with fetching, caching, and revalidation built in', 'Server state — dữ liệu bất đồng bộ có cache, kèm sẵn tải, cache và làm mới'),
            B('Only the values of the fields inside a single form', 'Chỉ các giá trị của những trường bên trong một form'),
            B('Only the current theme and locale of the application', 'Chỉ theme và ngôn ngữ hiện tại của ứng dụng'),
            B('Only DOM measurements such as scroll position and size', 'Chỉ các số đo DOM như vị trí cuộn và kích thước'),
          ],
          correct: 0,
          explanation: EX(
            'Server state (data that lives on a server and can go stale) has different needs from UI state: caching, background refetch, dedup, retries, invalidation. TanStack Query handles all that so you stop hand-rolling loading/error flags in <code>useEffect</code>. Zustand/useState handle client UI state.',
            'Server state (dữ liệu sống trên server và có thể cũ đi) có nhu cầu khác state giao diện: cache, tải lại nền, gộp trùng, thử lại, vô hiệu. TanStack Query lo hết những thứ đó để bạn thôi tự tay dựng cờ loading/error trong <code>useEffect</code>. Còn Zustand/useState lo state giao diện phía client.',
          ),
        }),
        mcq({
          prompt: B(
            'You persist a Zustand store to localStorage. On first paint after reload, the UI briefly shows the default, not the saved value. What is happening?',
            'Bạn lưu một store Zustand vào localStorage. Ở lần vẽ đầu sau khi tải lại, UI thoáng hiện giá trị mặc định chứ không phải giá trị đã lưu. Chuyện gì xảy ra?',
          ),
          options: [
            B('Hydration mismatch — the store rehydrates from storage after the first render', 'Lệch hydration — store nạp lại từ storage sau lần render đầu tiên'),
            B('localStorage was cleared by the browser', 'localStorage bị trình duyệt xoá'),
            B('The store is broken and must be replaced', 'Store bị hỏng, phải thay cái khác'),
            B('Server Components cannot read localStorage', 'Server Component không đọc được localStorage'),
          ],
          correct: 0,
          explanation: EX(
            'The server renders (and the first client render matches) with the store&#x27;s default, because <code>localStorage</code> is read only on the client, slightly after mount. That momentary flash is a hydration/persist timing issue — guard UI that depends on persisted state until rehydration completes (a <code>mounted</code> flag or the store&#x27;s <code>onRehydrateStorage</code>).',
            'Server render (và lần render client đầu khớp theo) bằng giá trị mặc định của store, vì <code>localStorage</code> chỉ đọc được ở client, hơi sau lúc mount. Cái nháy chớp đó là vấn đề thời điểm hydration/persist — hãy chặn phần UI phụ thuộc state đã lưu cho tới khi nạp lại xong (một cờ <code>mounted</code> hoặc <code>onRehydrateStorage</code> của store).',
          ),
        }),
        mcq({
          prompt: B(
            'React Context is a good fit for which of these?',
            'React Context hợp với thứ nào trong số này?',
          ),
          options: [
            B('Low-frequency global values like theme, locale, or the current user', 'Các giá trị toàn cục ít đổi như theme, ngôn ngữ, hoặc người dùng hiện tại'),
            B('High-frequency updates such as mouse position every frame', 'Cập nhật tần suất cao như vị trí chuột mỗi khung hình'),
            B('Server-side database queries', 'Truy vấn cơ sở dữ liệu phía server'),
            B('Replacing all props everywhere', 'Thay thế mọi prop ở khắp nơi'),
          ],
          correct: 0,
          explanation: EX(
            'Context broadcasts a value to a subtree — perfect for things that rarely change (theme, auth, locale). It is a poor fit for values that change many times a second, because every consumer re-renders on each change; a store with selectors handles that better.',
            'Context phát một giá trị xuống một cây con — hoàn hảo cho những thứ hiếm khi đổi (theme, auth, ngôn ngữ). Nó không hợp với giá trị đổi nhiều lần mỗi giây, vì mọi consumer sẽ render lại ở mỗi lần đổi; một store kèm selector xử lý việc đó tốt hơn.',
          ),
        }),

        // ── Chương 15 — Auth / middleware / cookie ──────────────────────
        mcq({
          prompt: B(
            'For a session token in the browser, which cookie setting best protects it from theft via JavaScript (XSS)?',
            'Với một token phiên trong trình duyệt, thiết lập cookie nào bảo vệ nó tốt nhất khỏi bị đánh cắp qua JavaScript (XSS)?',
          ),
          options: [
            B('HttpOnly, so client-side JavaScript cannot read it', 'HttpOnly, để JavaScript phía client không đọc được'),
            B('Storing it in localStorage instead of a cookie entirely', 'Lưu vào localStorage thay cho cookie hoàn toàn'),
            B('Giving the cookie a very long Max-Age of many days', 'Cho cookie một Max-Age rất dài, nhiều ngày liền'),
            B('Prefixing the token value with a random string first', 'Thêm một chuỗi ngẫu nhiên vào đầu giá trị token trước'),
          ],
          correct: 0,
          explanation: EX(
            'An <code>HttpOnly</code> cookie is invisible to <code>document.cookie</code>, so an injected script cannot exfiltrate the token. Pair it with <code>Secure</code> (HTTPS only) and <code>SameSite</code>. localStorage is readable by any script, which is exactly what XSS abuses.',
            'Cookie <code>HttpOnly</code> vô hình với <code>document.cookie</code>, nên một script bị chèn không thể tuồn token ra. Hãy ghép nó với <code>Secure</code> (chỉ HTTPS) và <code>SameSite</code>. localStorage thì bất kỳ script nào cũng đọc được, đúng thứ mà XSS lợi dụng.',
          ),
        }),
        mcq({
          prompt: B(
            'On cuongthai.com sessions died silently after 24h even though the cookie lived 7 days. What was the root cause?',
            'Trên cuongthai.com, phiên chết âm thầm sau 24 giờ dù cookie sống 7 ngày. Nguyên nhân gốc là gì?',
          ),
          options: [
            B('The JWT expired in 24h and there was no working refresh, so every authed call 401&#x27;d', 'JWT hết hạn sau 24 giờ và không có refresh hoạt động, nên mọi lời gọi cần auth đều 401'),
            B('The browser deleted the cookie earlier than its stated lifetime', 'Trình duyệt xoá cookie sớm hơn tuổi thọ đã khai báo'),
            B('The server clock was wrong and rejected the valid token', 'Đồng hồ server bị sai và từ chối token còn hợp lệ'),
            B('The cookie was not marked HttpOnly so a script cleared it', 'Cookie không được đánh dấu HttpOnly nên một script đã xoá nó'),
          ],
          correct: 0,
          explanation: EX(
            'The token TTL (<code>JWT_EXPIRES_IN=24h</code>) was shorter than the cookie&#x27;s 7-day life, and there was no working <code>/auth/refresh</code>. The cookie was still present but the JWT inside was stale, so calls 401&#x27;d. Fix: a refresh endpoint (verify with <code>ignoreExpiration</code> + re-check the account) plus a 401 interceptor that refreshes once and retries.',
            'Thời hạn token (<code>JWT_EXPIRES_IN=24h</code>) ngắn hơn tuổi thọ 7 ngày của cookie, và không có <code>/auth/refresh</code> hoạt động. Cookie vẫn còn nhưng JWT bên trong đã cũ, nên các lời gọi bị 401. Cách sửa: một endpoint refresh (verify với <code>ignoreExpiration</code> + kiểm lại tài khoản) cộng một interceptor 401 tự refresh một lần rồi thử lại.',
          ),
        }),
        mcq({
          prompt: B(
            'Where is the right place to redirect an unauthenticated user away from every <code>/dashboard/*</code> route at once?',
            'Chỗ đúng để chuyển hướng một người dùng chưa xác thực khỏi mọi route <code>/dashboard/*</code> cùng lúc là ở đâu?',
          ),
          options: [
            B('In middleware.ts, matching the protected paths', 'Trong middleware.ts, khớp với các đường dẫn cần bảo vệ'),
            B('In a useEffect inside every page', 'Trong một useEffect ở từng trang'),
            B('In next.config.js redirects only', 'Chỉ trong phần redirects của next.config.js'),
            B('In the root error.tsx', 'Trong error.tsx ở gốc'),
          ],
          correct: 0,
          explanation: EX(
            'Middleware runs before the request reaches any matched route, so one <code>middleware.ts</code> with a matcher on <code>/dashboard/:path*</code> can check the session cookie and redirect to <code>/login</code> for the whole section — no per-page code, and it runs before any protected content renders.',
            'Middleware chạy trước khi request tới bất kỳ route khớp nào, nên một <code>middleware.ts</code> với matcher trên <code>/dashboard/:path*</code> có thể kiểm cookie phiên và chuyển tới <code>/login</code> cho cả mảng — không cần code từng trang, và nó chạy trước khi bất kỳ nội dung được bảo vệ nào render.',
          ),
        }),
        mcq({
          prompt: B(
            'Reading and setting cookies from a Server Component or Server Action is done with…',
            'Đọc và đặt cookie từ một Server Component hay Server Action được thực hiện bằng…',
          ),
          options: [
            B('The cookies() helper from next/headers', 'Helper cookies() từ next/headers'),
            B('document.cookie, the same API you use in the browser', 'document.cookie, đúng API bạn dùng trong trình duyệt'),
            B('localStorage.getItem, reading it from persistent storage', 'localStorage.getItem, đọc nó từ kho lưu trữ bền'),
            B('A useCookie hook imported from next/navigation', 'Một hook useCookie import từ next/navigation'),
          ],
          correct: 0,
          explanation: EX(
            'On the server there is no <code>document</code>. Next exposes <code>cookies()</code> from <code>next/headers</code> to read (and, inside Server Actions/Route Handlers, set) cookies. Using it makes the route dynamic, since the output now depends on the request.',
            'Trên server không có <code>document</code>. Next cung cấp <code>cookies()</code> từ <code>next/headers</code> để đọc (và, trong Server Action/Route Handler, để đặt) cookie. Dùng nó khiến route trở nên động, vì kết quả giờ phụ thuộc vào request.',
          ),
        }),

        // ── Chương 16 — Form / validation / upload ──────────────────────
        mcq({
          prompt: B(
            'With React Hook Form + Zod, what does <code>z.infer&lt;typeof schema&gt;</code> give you?',
            'Với React Hook Form + Zod, <code>z.infer&lt;typeof schema&gt;</code> cho bạn thứ gì?',
          ),
          options: [
            B('A TypeScript type derived from the schema, so types and validation stay in sync', 'Một kiểu TypeScript suy ra từ schema, để kiểu và validation luôn đồng bộ'),
            B('A runtime function that submits the form to the server', 'Một hàm lúc chạy để submit form lên server'),
            B('The list of the form&#x27;s current validation errors', 'Danh sách các lỗi validation hiện tại của form'),
            B('A ready-made React component that renders the form', 'Một component React dựng sẵn để render form'),
          ],
          correct: 0,
          explanation: EX(
            '<code>z.infer</code> extracts a static TypeScript type from a Zod schema, so you define the shape once and get both compile-time types and runtime validation from a single source. Wire it in with <code>@hookform/resolvers/zod</code> and validate on submit with <code>safeParse</code>.',
            '<code>z.infer</code> rút ra một kiểu TypeScript tĩnh từ một schema Zod, nên bạn định nghĩa hình dạng một lần và có cả kiểu lúc biên dịch lẫn validation lúc chạy từ một nguồn duy nhất. Nối nó bằng <code>@hookform/resolvers/zod</code> và kiểm khi submit bằng <code>safeParse</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A file upload should validate the file type and size…',
            'Một lần upload file nên kiểm loại và kích thước file…',
          ),
          options: [
            B('On the server, even if the client also checks — the client can be bypassed', 'Trên server, dù client cũng đã kiểm — client có thể bị đi vòng'),
            B('Only on the client, for speed and a snappier experience', 'Chỉ trên client, cho nhanh và trải nghiệm mượt hơn'),
            B('Never — the storage service handles all validation for you', 'Không bao giờ — dịch vụ lưu trữ tự lo mọi việc kiểm tra'),
            B('Only by checking the file extension in the file name', 'Chỉ bằng cách kiểm phần mở rộng trong tên file'),
          ],
          correct: 0,
          explanation: EX(
            'Client checks improve UX but are trivially bypassed (curl, devtools). The server must re-validate MIME/type and size before storing — a real cuongthai.com hardening. Never trust the extension alone; check the actual content type and enforce a max size.',
            'Kiểm phía client cải thiện trải nghiệm nhưng bị đi vòng dễ dàng (curl, devtools). Server phải kiểm lại loại MIME/kiểu và kích thước trước khi lưu — một lần gia cố thật của cuongthai.com. Đừng bao giờ tin mỗi phần mở rộng; hãy kiểm loại nội dung thật và áp một kích thước tối đa.',
          ),
        }),
        mcq({
          prompt: B(
            '<code>getMediaUrl</code> prefixed the R2 CDN base onto <code>blob:</code> / <code>data:</code> preview URLs, producing broken links. What is the correct rule?',
            '<code>getMediaUrl</code> đã ghép base CDN R2 vào các URL xem trước <code>blob:</code> / <code>data:</code>, tạo ra link hỏng. Quy tắc đúng là gì?',
          ),
          options: [
            B('Return object/data URLs as-is; only prepend the CDN base to bare storage keys', 'Trả về URL object/data y nguyên; chỉ ghép base CDN vào các key kho lưu trữ trần'),
            B('Always prepend the CDN base to every value', 'Luôn ghép base CDN vào mọi giá trị'),
            B('Strip the blob: prefix and re-upload', 'Bỏ tiền tố blob: rồi upload lại'),
            B('Convert every URL to base64 first', 'Đổi mọi URL sang base64 trước'),
          ],
          correct: 0,
          explanation: EX(
            'A <code>blob:</code> or <code>data:</code> URL (an optimistic upload preview) is already renderable — prefixing the CDN base makes <code>https://cdn/blob:...</code>, which 400s. Only bare R2 keys need the CDN base. Detect the scheme and return already-absolute/inline URLs untouched.',
            'Một URL <code>blob:</code> hay <code>data:</code> (bản xem trước upload lạc quan) đã render được sẵn — ghép base CDN vào tạo ra <code>https://cdn/blob:...</code>, gây lỗi 400. Chỉ những key R2 trần mới cần base CDN. Hãy dò lược đồ (scheme) và trả về nguyên vẹn những URL vốn đã tuyệt đối/nội tuyến.',
          ),
        }),
        mcq({
          prompt: B(
            'Why is a native <code>&lt;form&gt;</code> with a Server Action preferable to a button that just calls fetch on click?',
            'Vì sao một <code>&lt;form&gt;</code> gốc với Server Action đáng dùng hơn một nút chỉ gọi fetch khi click?',
          ),
          options: [
            B('It works without JS, gives proper submit semantics, and pairs with pending/optimistic hooks', 'Nó chạy được cả khi không JS, có ngữ nghĩa submit đúng, và ghép được với hook pending/optimistic'),
            B('It is the only possible way to send any data to a server', 'Đó là cách duy nhất có thể gửi bất kỳ dữ liệu nào tới server'),
            B('The fetch API cannot send form data to a server at all', 'API fetch hoàn toàn không thể gửi dữ liệu form tới server'),
            B('A button element is not allowed to have an onClick handler', 'Một phần tử nút không được phép có handler onClick'),
          ],
          correct: 0,
          explanation: EX(
            'A real <code>&lt;form action={serverAction}&gt;</code> submits even before JS hydrates (progressive enhancement), carries native validation and Enter-to-submit, and integrates with <code>useFormStatus</code>/<code>useActionState</code>/<code>useOptimistic</code>. A raw onClick fetch throws all of that away.',
            'Một <code>&lt;form action={serverAction}&gt;</code> thật submit được ngay cả trước khi JS hydrate (nâng cấp tiệm tiến), mang theo validation gốc và Enter-để-submit, và tích hợp với <code>useFormStatus</code>/<code>useActionState</code>/<code>useOptimistic</code>. Một fetch onClick thô vứt bỏ hết những thứ đó.',
          ),
        }),

        // ── Chương 17 — Render strategies & SEO ─────────────────────────
        mcq({
          prompt: B(
            'Match the term to its meaning: a page rendered fresh on the server for each request is…',
            'Ghép thuật ngữ với ý nghĩa: một trang được render mới trên server cho từng request là…',
          ),
          options: [
            B('SSR (Server-Side Rendering)', 'SSR (Render phía server)'),
            B('SSG (Static Site Generation)', 'SSG (Sinh trang tĩnh)'),
            B('CSR (Client-Side Rendering)', 'CSR (Render phía client)'),
            B('ISR only, never anything else', 'Chỉ ISR, không gì khác'),
          ],
          correct: 0,
          explanation: EX(
            'SSR renders HTML on the server per request (fresh, personalized, slower). SSG pre-renders at build (fast, cached, may be stale). ISR is SSG plus periodic background revalidation. CSR renders in the browser after JS loads. App Router mixes these per segment.',
            'SSR render HTML trên server theo từng request (tươi, cá nhân hoá, chậm hơn). SSG dựng sẵn lúc build (nhanh, được cache, có thể cũ). ISR là SSG cộng làm mới nền định kỳ. CSR render trong trình duyệt sau khi JS tải. App Router trộn các kiểu này theo từng đoạn.',
          ),
        }),
        mcq({
          prompt: B(
            'How do you set the page title and description for SEO in the App Router?',
            'Làm sao đặt tiêu đề và mô tả trang cho SEO trong App Router?',
          ),
          options: [
            B('Export a metadata object or generateMetadata from the page/layout', 'Export một object metadata hoặc generateMetadata từ page/layout'),
            B('Render a &lt;title&gt; tag inside the component body', 'Render một thẻ &lt;title&gt; trong thân component'),
            B('Set document.title in useEffect only', 'Chỉ đặt document.title trong useEffect'),
            B('Add it to next.config.js', 'Thêm vào next.config.js'),
          ],
          correct: 0,
          explanation: EX(
            'The App Router uses the Metadata API: <code>export const metadata = {...}</code> for static values, or <code>export async function generateMetadata({ params })</code> when the title depends on data. Next renders the correct <code>&lt;head&gt;</code> tags on the server, which is what crawlers and social previews read.',
            'App Router dùng Metadata API: <code>export const metadata = {...}</code> cho giá trị tĩnh, hoặc <code>export async function generateMetadata({ params })</code> khi tiêu đề phụ thuộc dữ liệu. Next render đúng các thẻ <code>&lt;head&gt;</code> trên server, đó là thứ trình thu thập và bản xem trước mạng xã hội đọc.',
          ),
        }),
        mcq({
          prompt: B(
            'Why does an Open Graph share preview need server-rendered metadata rather than client-set tags?',
            'Vì sao bản xem trước chia sẻ Open Graph cần metadata render trên server chứ không phải thẻ đặt ở client?',
          ),
          options: [
            B('Social crawlers read the initial HTML and usually do not run your JavaScript', 'Trình thu thập mạng xã hội đọc HTML ban đầu và thường không chạy JavaScript của bạn'),
            B('Client tags are illegal in HTML', 'Thẻ đặt ở client là bất hợp lệ trong HTML'),
            B('Open Graph only works over WebSocket', 'Open Graph chỉ hoạt động qua WebSocket'),
            B('The browser strips client-set meta tags', 'Trình duyệt gỡ các thẻ meta đặt ở client'),
          ],
          correct: 0,
          explanation: EX(
            'Crawlers (Facebook, Zalo, X) fetch the URL and parse the returned HTML&#x27;s <code>&lt;head&gt;</code> — most do not execute JS. So OG tags must be present in the server response. This ties back to the Messenger share bug: the canonical URL and its metadata must be right on the server.',
            'Trình thu thập (Facebook, Zalo, X) tải URL và phân tích <code>&lt;head&gt;</code> của HTML trả về — phần lớn không chạy JS. Nên thẻ OG phải có sẵn trong phản hồi từ server. Điều này nối lại với lỗi chia sẻ Messenger: URL chuẩn và metadata của nó phải đúng ngay trên server.',
          ),
        }),

        // ── Chương 18 — Hiệu năng ───────────────────────────────────────
        mcq({
          prompt: B(
            'Why use <code>next/image</code> instead of a plain <code>&lt;img&gt;</code>?',
            'Vì sao dùng <code>next/image</code> thay cho thẻ <code>&lt;img&gt;</code> thường?',
          ),
          options: [
            B('It lazy-loads, resizes/serves modern formats, and reserves space to avoid layout shift', 'Nó tải lười, đổi kích thước/phục vụ định dạng hiện đại, và giữ chỗ để tránh xô lệch bố cục'),
            B('It makes every image load synchronously and block rendering', 'Nó làm mọi ảnh tải đồng bộ và chặn việc render'),
            B('It converts each image into a block of descriptive text', 'Nó đổi từng ảnh thành một khối văn bản mô tả'),
            B('It disables browser and CDN caching for all images', 'Nó tắt cache của trình duyệt và CDN cho mọi ảnh'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next/image</code> optimizes automatically: lazy loading, responsive <code>srcset</code>, modern formats (WebP/AVIF), and required <code>width</code>/<code>height</code> (or <code>fill</code>) that reserve space to stop Cumulative Layout Shift. That is a big win for Core Web Vitals versus a raw <code>&lt;img&gt;</code>.',
            '<code>next/image</code> tối ưu tự động: tải lười, <code>srcset</code> đáp ứng, định dạng hiện đại (WebP/AVIF), và <code>width</code>/<code>height</code> bắt buộc (hoặc <code>fill</code>) để giữ chỗ, chặn Cumulative Layout Shift. Đó là lợi ích lớn cho Core Web Vitals so với một thẻ <code>&lt;img&gt;</code> thô.',
          ),
        }),
        mcq({
          prompt: B(
            'What does <code>next/dynamic</code> (dynamic import) buy you?',
            '<code>next/dynamic</code> (dynamic import) mang lại gì?',
          ),
          options: [
            B('Code-splitting — a heavy component is loaded only when it is actually needed', 'Chia nhỏ mã — một component nặng chỉ được tải khi thật sự cần'),
            B('It makes all of the app&#x27;s imports load synchronously', 'Nó làm mọi import của ứng dụng tải một cách đồng bộ'),
            B('It converts a Client Component into a Server Component', 'Nó biến một Client Component thành một Server Component'),
            B('It disables tree-shaking for the whole application', 'Nó tắt tree-shaking cho toàn bộ ứng dụng'),
          ],
          correct: 0,
          explanation: EX(
            'Dynamic import splits a component into its own chunk that loads on demand (e.g. a chart or editor only when it renders), shrinking the initial JS. You can also disable SSR for a client-only widget with <code>{ ssr: false }</code>.',
            'Dynamic import tách một component thành một chunk riêng tải theo nhu cầu (ví dụ một biểu đồ hay trình soạn chỉ khi nó render), làm nhỏ JS ban đầu. Bạn cũng có thể tắt SSR cho một widget chỉ chạy client bằng <code>{ ssr: false }</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'You want to know how heavy a route&#x27;s JavaScript really is. The reliable measure is…',
            'Bạn muốn biết JavaScript của một route thật sự nặng bao nhiêu. Cách đo đáng tin là…',
          ),
          options: [
            B('The First Load JS reported by next build, not counting script tags in the HTML', 'Chỉ số First Load JS mà next build báo, không phải đếm thẻ script trong HTML'),
            B('Counting the number of &lt;script&gt; tags on the page', 'Đếm số thẻ &lt;script&gt; trên trang'),
            B('The size of the HTML document alone', 'Chỉ mỗi kích thước tài liệu HTML'),
            B('The number of components in the file', 'Số component trong file'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next build</code> prints per-route "First Load JS" — the real bundle size including shared chunks. Counting <code>&lt;script&gt;</code> tags in the rendered HTML misleads (chunks, preloads, inline runtime). Measure with the build output, a lesson learned measuring page weight on cuongthai.com.',
            '<code>next build</code> in ra "First Load JS" theo từng route — kích thước bundle thật, gồm cả chunk dùng chung. Đếm thẻ <code>&lt;script&gt;</code> trong HTML đã render dễ gây hiểu nhầm (chunk, preload, runtime nội tuyến). Hãy đo bằng kết quả build, một bài học rút ra khi đo độ nặng trang trên cuongthai.com.',
          ),
        }),

        // ── Chương 19 — Kiểm thử ────────────────────────────────────────
        mcq({
          prompt: B(
            'React Testing Library encourages you to query the DOM by…',
            'React Testing Library khuyến khích bạn truy vấn DOM theo…',
          ),
          options: [
            B('What the user sees — roles, labels, and text — not implementation details', 'Thứ người dùng thấy — vai trò, nhãn, và văn bản — không phải chi tiết cài đặt'),
            B('The component&#x27;s internal state values and its prop names', 'Các giá trị state nội bộ và tên prop của component'),
            B('CSS class names and DOM ids on the elements only', 'Chỉ tên class CSS và id DOM trên các phần tử'),
            B('The order in which the hooks appear in the file', 'Thứ tự các hook xuất hiện trong file'),
          ],
          correct: 0,
          explanation: EX(
            'RTL&#x27;s philosophy: test behaviour the way a user experiences it. Prefer <code>getByRole</code>, <code>getByLabelText</code>, <code>getByText</code> over brittle class/id selectors or reaching into internal state. Tests then survive refactors that keep behaviour but change internals.',
            'Triết lý của RTL: kiểm hành vi theo cách người dùng trải nghiệm. Hãy ưu tiên <code>getByRole</code>, <code>getByLabelText</code>, <code>getByText</code> hơn là selector class/id dễ vỡ hay thò vào state nội bộ. Nhờ vậy test sống sót qua các lần refactor giữ nguyên hành vi nhưng đổi bên trong.',
          ),
        }),
        mcq({
          prompt: B(
            'A schema enum value was renamed and it passed <code>tsc --noEmit</code> yet still broke the seed on production. What does this teach about testing/checks?',
            'Một giá trị enum của schema bị đổi tên và nó qua được <code>tsc --noEmit</code> nhưng vẫn vỡ seed trên production. Điều này dạy gì về kiểm thử/kiểm tra?',
          ),
          options: [
            B('Type-checking is not enough — run the code (the seed) to catch runtime-only breakage', 'Kiểm kiểu là chưa đủ — phải chạy mã (seed) mới bắt được hỏng chỉ lộ lúc chạy'),
            B('Enum values should never be renamed once they exist', 'Không bao giờ được đổi tên một giá trị enum khi nó đã tồn tại'),
            B('Production databases can never be seeded with content', 'Cơ sở dữ liệu production không bao giờ seed được nội dung'),
            B('TypeScript is unreliable and should be removed from the project', 'TypeScript không đáng tin và nên bị gỡ khỏi dự án'),
          ],
          correct: 0,
          explanation: EX(
            'The seed file carried a hand-copied union type, so it type-checked against itself, and <code>tsconfig</code> excluded <code>prisma/**</code>. Everything passed, yet the seed broke at runtime. Lesson: some breakage is only visible by running — add a real run (and a dedicated <code>typecheck:seed</code>) to your checks, not just <code>tsc</code>.',
            'File seed mang một kiểu union chép tay, nên nó tự kiểm với chính nó, và <code>tsconfig</code> lại loại trừ <code>prisma/**</code>. Mọi thứ đều qua, nhưng seed vỡ lúc chạy. Bài học: có những hỏng hóc chỉ lộ khi chạy — hãy thêm một lần chạy thật (và một <code>typecheck:seed</code> riêng) vào bộ kiểm, không chỉ mỗi <code>tsc</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'What is the difference between a unit test and an end-to-end (E2E) test?',
            'Khác biệt giữa một unit test và một end-to-end (E2E) test là gì?',
          ),
          options: [
            B('Unit tests one piece in isolation; E2E drives the whole app like a real user', 'Unit kiểm một mảnh cô lập; E2E lái cả ứng dụng như một người dùng thật'),
            B('They are the same thing, just run at different times of day', 'Chúng là cùng một thứ, chỉ chạy vào thời điểm khác nhau trong ngày'),
            B('Unit tests need a real browser while E2E tests do not', 'Unit test cần một trình duyệt thật còn E2E thì không'),
            B('E2E tests only check the project&#x27;s type definitions', 'E2E chỉ kiểm các định nghĩa kiểu của dự án'),
          ],
          correct: 0,
          explanation: EX(
            'A unit test checks one function/component in isolation (fast, many). An E2E test (Playwright/Cypress) launches the app in a browser and simulates real user flows across pages and the backend (slower, fewer). A healthy suite has many unit tests and a few high-value E2E flows.',
            'Unit test kiểm một hàm/component cô lập (nhanh, nhiều). E2E test (Playwright/Cypress) khởi động ứng dụng trong trình duyệt và mô phỏng luồng người dùng thật qua nhiều trang và cả backend (chậm hơn, ít hơn). Một bộ test khoẻ mạnh có nhiều unit test và một vài luồng E2E giá trị cao.',
          ),
        }),

        // ── Chương 20 — Build & deploy ──────────────────────────────────
        mcq({
          prompt: B(
            'A <code>NEXT_PUBLIC_*</code> environment variable is…',
            'Một biến môi trường <code>NEXT_PUBLIC_*</code> là…',
          ),
          options: [
            B('Baked into the client bundle at build time — changing it needs a rebuild, not a restart', 'Được nướng vào bundle client lúc build — đổi nó cần build lại, không phải restart'),
            B('Read fresh from the environment on every single request', 'Được đọc mới từ môi trường ở mỗi một request'),
            B('Only ever available on the server, never in the browser', 'Chỉ có ở phía server, không bao giờ có trong trình duyệt'),
            B('Automatically encrypted before being shipped to the browser', 'Được tự động mã hoá trước khi gửi xuống trình duyệt'),
          ],
          correct: 0,
          explanation: EX(
            '<code>NEXT_PUBLIC_*</code> vars are inlined into the client bundle when you run <code>next build</code>. Changing one at runtime does nothing until you rebuild. And because they ship to the browser, <b>never</b> put secrets/API keys there — proxy those through a backend route instead.',
            'Biến <code>NEXT_PUBLIC_*</code> được nội tuyến vào bundle client khi bạn chạy <code>next build</code>. Đổi một biến lúc chạy chẳng có tác dụng gì cho tới khi build lại. Và vì chúng đi xuống trình duyệt, <b>đừng bao giờ</b> đặt bí mật/API key ở đó — hãy proxy chúng qua một route backend.',
          ),
        }),
        mcq({
          prompt: B(
            'The GIF picker broke because the client called GIPHY directly with a <code>NEXT_PUBLIC_GIPHY_API_KEY</code>. What is the correct architecture?',
            'Bộ chọn GIF hỏng vì client gọi thẳng GIPHY bằng một <code>NEXT_PUBLIC_GIPHY_API_KEY</code>. Kiến trúc đúng là gì?',
          ),
          options: [
            B('A backend proxy route holds the key server-side; the client calls your route', 'Một route proxy backend giữ key ở phía server; client gọi route của bạn'),
            B('Rotate the public key much more often to limit abuse', 'Xoay key công khai thường xuyên hơn nhiều để hạn chế lạm dụng'),
            B('Move the key from env into the browser&#x27;s localStorage', 'Chuyển key từ env vào localStorage của trình duyệt'),
            B('Hardcode the key directly inside the client component', 'Gán cứng key ngay bên trong component phía client'),
          ],
          correct: 0,
          explanation: EX(
            'A browser-facing third-party key must never be <code>NEXT_PUBLIC_*</code> — it ships in the bundle for anyone to grab. The fix on cuongthai.com was <code>/api/v1/gifs</code>: a backend proxy that reads the key from runtime env, caches responses, and lets you rotate the key with a restart. The client never sees it.',
            'Một key bên thứ ba hướng trình duyệt không bao giờ được là <code>NEXT_PUBLIC_*</code> — nó đi kèm bundle cho ai cũng lấy được. Cách sửa trên cuongthai.com là <code>/api/v1/gifs</code>: một proxy backend đọc key từ env lúc chạy, cache phản hồi, và cho phép xoay key bằng một lần restart. Client không bao giờ thấy nó.',
          ),
        }),
        mcq({
          prompt: B(
            'Deploying new code to production but the data (courses, posts) is still missing. What is the likely cause?',
            'Đã deploy mã mới lên production nhưng dữ liệu (khoá học, bài viết) vẫn thiếu. Nguyên nhân có khả năng là gì?',
          ),
          options: [
            B('Deploy ships code, not data — content must be seeded on prod, not only locally', 'Deploy đẩy mã, không đẩy dữ liệu — nội dung phải được seed trên prod, không chỉ ở máy local'),
            B('The production build must have failed silently during deploy', 'Bản build production hẳn đã thất bại âm thầm khi deploy'),
            B('The production database was wiped by the deploy process', 'Cơ sở dữ liệu production bị quá trình deploy xoá sạch'),
            B('Production content always lags exactly one deploy behind', 'Nội dung production luôn trễ đúng một lần deploy'),
          ],
          correct: 0,
          explanation: EX(
            'A deploy rsyncs/builds the working tree — it does not copy your local database rows. If content only lives in your local DB, prod stays empty. Content that must reach prod needs a seeding step inside the deploy (e.g. <code>deploy.sh</code> globbing <code>content/**</code> and seeding it).',
            'Một lần deploy rsync/build cây làm việc — nó không sao chép các bản ghi cơ sở dữ liệu local của bạn. Nếu nội dung chỉ nằm trong DB local, prod sẽ rỗng. Nội dung cần lên prod phải có một bước seed nằm trong deploy (ví dụ <code>deploy.sh</code> glob <code>content/**</code> rồi seed).',
          ),
        }),
        mcq({
          prompt: B(
            'A migration reached production and turned out to be bad. What is safe to do about the schema change?',
            'Một migration đã lên tới production và hoá ra là sai. Điều gì là an toàn để làm với thay đổi schema?',
          ),
          options: [
            B('Discuss before reverting — reverting the code does NOT revert the database', 'Bàn bạc trước khi revert — revert mã KHÔNG revert cơ sở dữ liệu'),
            B('Just git revert the code and everything is fixed', 'Cứ git revert mã là mọi thứ được sửa'),
            B('Force-push an older commit to main', 'Force-push một commit cũ hơn lên main'),
            B('Delete the migration file from history', 'Xoá file migration khỏi lịch sử'),
          ],
          correct: 0,
          explanation: EX(
            'Reverting code rolls back the app, but the database already has the applied schema/data change — the two can then disagree. Discuss a forward-fix or a compensating migration with a human first. Never force-push to roll back, and never edit or delete an already-deployed migration.',
            'Revert mã đưa ứng dụng về trạng thái cũ, nhưng cơ sở dữ liệu đã có thay đổi schema/dữ liệu được áp — rồi hai bên có thể lệch nhau. Hãy bàn với con người về một bản vá tiến tới hoặc một migration bù trước. Đừng bao giờ force-push để lùi, và đừng sửa hay xoá một migration đã deploy.',
          ),
        }),
        mcq({
          prompt: B(
            'Why does a bad <code>NEXT_PUBLIC_*</code> value on the VPS survive a container restart but need a full rebuild to fix?',
            'Vì sao một giá trị <code>NEXT_PUBLIC_*</code> sai trên VPS vẫn tồn tại qua một lần restart container nhưng cần build lại toàn bộ mới sửa được?',
          ),
          options: [
            B('It was compiled into the JS bundle at build time; a restart reuses the same image', 'Nó đã bị biên dịch vào bundle JS lúc build; restart chỉ dùng lại đúng image cũ'),
            B('Restarting the container clears out all environment variables', 'Restart container xoá sạch mọi biến môi trường'),
            B('The value is stored inside the production database', 'Giá trị được lưu bên trong cơ sở dữ liệu production'),
            B('Docker encrypts every public environment variable at rest', 'Docker mã hoá mọi biến môi trường công khai khi lưu'),
          ],
          correct: 0,
          explanation: EX(
            'The value is inlined into the compiled bundle during <code>next build</code>, which happens when the image is built. Restarting the container just runs the same image, so the old baked value persists. Only rebuilding the image (a full deploy) recompiles with the new value.',
            'Giá trị được nội tuyến vào bundle đã biên dịch trong <code>next build</code>, việc này xảy ra khi image được dựng. Restart container chỉ chạy lại đúng image đó, nên giá trị nướng sẵn cũ vẫn còn. Chỉ dựng lại image (một lần deploy đầy đủ) mới biên dịch lại với giá trị mới.',
          ),
        }),

        // ── Câu lập trình 1 ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — getMediaUrl (chapter 16).</b> Implement <code>getMediaUrl(value, cdnBase)</code>, the helper that turns a stored value into a renderable URL. This is a real cuongthai.com bug: prefixing the CDN base onto preview URLs broke them.</p>' +
            '<ul>' +
            '<li>A falsy <code>value</code> (empty string, null, undefined) → return <code>""</code>.</li>' +
            '<li>A value starting with <code>blob:</code>, <code>data:</code>, <code>http://</code> or <code>https://</code> is already renderable → return it unchanged.</li>' +
            '<li>Anything else is a bare storage key → return <code>cdnBase + "/" + key</code>, with any leading slashes on the key removed (no double slash).</li>' +
            '</ul>' +
            '<p>Keep the given printing loop exactly as it is; do not install anything.</p>',

            '<p><b>Câu 31 — getMediaUrl (chương 16).</b> Cài đặt <code>getMediaUrl(value, cdnBase)</code>, hàm biến một giá trị đã lưu thành một URL render được. Đây là lỗi thật của cuongthai.com: ghép base CDN vào các URL xem trước làm chúng hỏng.</p>' +
            '<ul>' +
            '<li><code>value</code> falsy (chuỗi rỗng, null, undefined) → trả về <code>""</code>.</li>' +
            '<li>Giá trị bắt đầu bằng <code>blob:</code>, <code>data:</code>, <code>http://</code> hoặc <code>https://</code> vốn đã render được → trả về nguyên vẹn.</li>' +
            '<li>Còn lại là một key kho lưu trữ trần → trả về <code>cdnBase + "/" + key</code>, sau khi bỏ mọi dấu gạch chéo ở đầu key (không để hai gạch chéo).</li>' +
            '</ul>' +
            '<p>Giữ nguyên vòng lặp in cho sẵn; không cài thêm gì.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function getMediaUrl(value, cdnBase) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const CDN = 'https://media.cuongthai.com';\n" +
            "for (const v of ['posts/a.webp', '/posts/b.webp', 'blob:abc-123', 'data:image/png;base64,xx', 'https://x.com/y.png', ''])\n" +
            "  console.log(JSON.stringify(v), '=>', JSON.stringify(getMediaUrl(v, CDN)));\n",
          expectedOutput:
            '"posts/a.webp" => "https://media.cuongthai.com/posts/a.webp"\n' +
            '"/posts/b.webp" => "https://media.cuongthai.com/posts/b.webp"\n' +
            '"blob:abc-123" => "blob:abc-123"\n' +
            '"data:image/png;base64,xx" => "data:image/png;base64,xx"\n' +
            '"https://x.com/y.png" => "https://x.com/y.png"\n' +
            '"" => ""',
          sampleSolution:
            'function getMediaUrl(value, cdnBase) {\n' +
            "  if (!value) return '';\n" +
            '  if (/^(blob:|data:|https?:\\/\\/)/.test(value)) return value;\n' +
            "  return cdnBase + '/' + value.replace(/^\\/+/, '');\n" +
            '}\n',
          rubric: RUBRIC_CODE,
        }),

        // ── Câu lập trình 2 ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Session state with a refresh window (chapter 15).</b> On cuongthai.com a 24h JWT under a 7-day cookie died silently with no refresh. Implement the pure decision function a 401 interceptor would use.</p>' +
            '<p><code>sessionState(nowMs, tokenExpMs, refreshWindowMs)</code> returns:</p>' +
            '<ul>' +
            '<li><code>"expired"</code> when <code>nowMs &gt;= tokenExpMs</code> (already past expiry).</li>' +
            '<li><code>"refresh"</code> when it is still valid but expires within <code>refreshWindowMs</code> from now (i.e. <code>tokenExpMs - nowMs &lt;= refreshWindowMs</code>).</li>' +
            '<li><code>"valid"</code> otherwise.</li>' +
            '</ul>' +
            '<p>Keep the given printing block exactly as it is; do not install anything.</p>',

            '<p><b>Câu 32 — Trạng thái phiên với cửa sổ làm mới (chương 15).</b> Trên cuongthai.com, một JWT 24h dưới cookie 7 ngày chết âm thầm vì không có refresh. Hãy cài đặt hàm quyết định thuần mà một interceptor 401 sẽ dùng.</p>' +
            '<p><code>sessionState(nowMs, tokenExpMs, refreshWindowMs)</code> trả về:</p>' +
            '<ul>' +
            '<li><code>"expired"</code> khi <code>nowMs &gt;= tokenExpMs</code> (đã quá hạn).</li>' +
            '<li><code>"refresh"</code> khi vẫn còn hạn nhưng sẽ hết trong vòng <code>refreshWindowMs</code> tính từ bây giờ (tức <code>tokenExpMs - nowMs &lt;= refreshWindowMs</code>).</li>' +
            '<li><code>"valid"</code> trong các trường hợp còn lại.</li>' +
            '</ul>' +
            '<p>Giữ nguyên khối in cho sẵn; không cài thêm gì.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function sessionState(nowMs, tokenExpMs, refreshWindowMs) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const HOUR = 3600000;\n' +
            'const now = 100 * HOUR;\n' +
            'console.log(sessionState(now, now + 5 * HOUR, HOUR));\n' +
            'console.log(sessionState(now, now + HOUR, HOUR));\n' +
            'console.log(sessionState(now, now + 0.5 * HOUR, HOUR));\n' +
            'console.log(sessionState(now, now - HOUR, HOUR));\n' +
            'console.log(sessionState(now, now, HOUR));\n',
          expectedOutput:
            'valid\n' +
            'refresh\n' +
            'refresh\n' +
            'expired\n' +
            'expired',
          sampleSolution:
            'function sessionState(nowMs, tokenExpMs, refreshWindowMs) {\n' +
            "  if (nowMs >= tokenExpMs) return 'expired';\n" +
            "  if (tokenExpMs - nowMs <= refreshWindowMs) return 'refresh';\n" +
            "  return 'valid';\n" +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
