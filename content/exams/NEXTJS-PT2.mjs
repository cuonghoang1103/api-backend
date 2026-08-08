/**
 * Next.js & React — Progress Test 2 (chương 8–12: Next.js App Router).
 *
 * Đề tự soạn, bám sát `content/courses/nextjs/s08…s12`. 30 câu trắc nghiệm + 2
 * câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ Hai lời giải mẫu là Node.js thuần, đã CHẠY THẬT khớp expectedOutput. Câu
 * khái niệm App Router/RSC bám quy ước chính thức nextjs.org (không có output
 * console để chạy) và lồng sự cố thật cuongthai.com.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-PT2.mjs --apply
 */
import { B, EX, code, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nextjs-exam-kit.mjs';

export default {
  course: { slug: 'nextjs' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 8–12 (App Router, Server & Client Components, data fetching, routing, Server Actions)',
        'Kiểm tra tiến độ 2 — Chương 8–12 (App Router, Server & Client Component, tải dữ liệu, định tuyến, Server Actions)',
      ),
      description: B(
        'The Next.js core: the App Router file conventions, the Server/Client Component split and its serialization boundary, fetch caching and revalidation, advanced routing (loading, error, route handlers, middleware, parallel/intercepting), and Server Actions. 30 multiple-choice questions plus 2 coding questions.',
        'Phần lõi của Next.js: quy ước file của App Router, ranh giới Server/Client Component và giới hạn tuần tự hoá, cache và làm mới của fetch, định tuyến nâng cao (loading, error, route handler, middleware, parallel/intercepting), và Server Actions. 30 câu trắc nghiệm và 2 câu lập trình.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '8–12'),
      questions: [
        // ── Chương 8 — App Router ───────────────────────────────────────
        mcq({
          prompt: B(
            'In the App Router, which file makes a route segment publicly reachable as a page?',
            'Trong App Router, file nào làm một đoạn route (route segment) truy cập được như một trang?',
          ),
          options: [
            B('page.tsx', 'page.tsx'),
            B('layout.tsx', 'layout.tsx'),
            B('route.tsx', 'route.tsx'),
            B('index.tsx', 'index.tsx'),
          ],
          correct: 0,
          explanation: EX(
            'A folder under <code>app/</code> is only a routable page when it contains a <code>page.tsx</code>. <code>layout.tsx</code> wraps segments but is not itself a page; <code>route.ts</code> defines an API endpoint (a Route Handler); <code>index.tsx</code> is the Pages-Router convention, not App Router.',
            'Một thư mục trong <code>app/</code> chỉ thành trang truy cập được khi có <code>page.tsx</code>. <code>layout.tsx</code> bọc các đoạn nhưng bản thân không phải trang; <code>route.ts</code> định nghĩa một endpoint API (Route Handler); còn <code>index.tsx</code> là quy ước của Pages Router, không phải App Router.',
          ),
        }),
        mcq({
          prompt: B(
            'What is true about a <code>layout.tsx</code> when you navigate between two pages that share it?',
            'Điều gì đúng về một <code>layout.tsx</code> khi bạn điều hướng giữa hai trang cùng dùng nó?',
          ),
          options: [
            B('It stays mounted and preserves its state across the navigation', 'Nó vẫn được gắn (mounted) và giữ nguyên state qua lần điều hướng'),
            B('It unmounts and remounts on every navigation', 'Nó bị gỡ rồi gắn lại ở mỗi lần điều hướng'),
            B('It only renders on the very first page load', 'Nó chỉ render ở lần tải trang đầu tiên'),
            B('It runs entirely in the browser', 'Nó chạy hoàn toàn trong trình duyệt'),
          ],
          correct: 0,
          explanation: EX(
            'Layouts are preserved across navigations within their subtree — they do not re-render or lose state when you move between child pages. That is what keeps a shared sidebar/nav in place and its scroll/expanded state intact. Only the changing page segment re-renders.',
            'Layout được giữ nguyên qua các lần điều hướng trong cây con của nó — không render lại và không mất state khi bạn di chuyển giữa các trang con. Đó là điều giữ cho thanh bên/nav dùng chung đứng yên và giữ nguyên trạng thái cuộn/mở rộng. Chỉ đoạn trang đang đổi mới render lại.',
          ),
        }),
        mcq({
          prompt: B(
            'A folder named <code>(marketing)</code> with parentheses in <code>app/</code> is a…',
            'Một thư mục tên <code>(marketing)</code> có ngoặc đơn trong <code>app/</code> là…',
          ),
          options: [
            B('Route group — organizes files without adding a URL segment', 'Route group — gom file lại mà không thêm đoạn vào URL'),
            B('Dynamic route that captures a "marketing" param', 'Route động bắt tham số "marketing"'),
            B('Private folder that is never bundled', 'Thư mục riêng không bao giờ được đóng gói'),
            B('Parallel route slot', 'Khe của parallel route'),
          ],
          correct: 0,
          explanation: EX(
            'Parentheses make a <b>route group</b>: <code>app/(marketing)/about/page.tsx</code> serves at <code>/about</code>, not <code>/marketing/about</code>. Groups let you share a layout or organize a section without affecting the URL. (An underscore folder like <code>_components</code> is the "private, not routable" one.)',
            'Ngoặc đơn tạo một <b>route group</b>: <code>app/(marketing)/about/page.tsx</code> phục vụ tại <code>/about</code>, không phải <code>/marketing/about</code>. Group cho phép chia sẻ layout hoặc sắp xếp một mảng mà không ảnh hưởng URL. (Thư mục có gạch dưới như <code>_components</code> mới là loại "riêng tư, không định tuyến".)',
          ),
        }),
        mcq({
          prompt: B(
            'A dynamic segment folder <code>app/blog/[slug]/page.tsx</code> receives the slug where?',
            'Thư mục đoạn động <code>app/blog/[slug]/page.tsx</code> nhận slug ở đâu?',
          ),
          options: [
            B('In the page&#x27;s params prop, e.g. params.slug', 'Trong prop params của trang, ví dụ params.slug'),
            B('From a useParams call only', 'Chỉ từ một lời gọi useParams'),
            B('As a global variable named slug', 'Dưới dạng một biến toàn cục tên slug'),
            B('Injected into process.env.slug', 'Được đưa vào process.env.slug'),
          ],
          correct: 0,
          explanation: EX(
            'A server page component receives <code>{ params }</code> as a prop — <code>params.slug</code> holds "react-19" for <code>/blog/react-19</code>. (In recent Next, <code>params</code> is a Promise you await.) <code>useParams</code> is the Client-Component hook alternative; it is not the only way.',
            'Một trang Server Component nhận <code>{ params }</code> làm prop — <code>params.slug</code> chứa "react-19" cho <code>/blog/react-19</code>. (Ở các bản Next gần đây, <code>params</code> là một Promise cần await.) <code>useParams</code> là lựa chọn thay thế dành cho Client Component; nó không phải cách duy nhất.',
          ),
        }),
        mcq({
          prompt: B(
            'Which special file renders when a nested route throws during rendering?',
            'File đặc biệt nào render khi một route lồng ném lỗi lúc render?',
          ),
          options: [
            B('error.tsx — a Client Component error boundary for that segment', 'error.tsx — một error boundary phía Client cho đoạn đó'),
            B('not-found.tsx, which handles a missing resource', 'not-found.tsx, thứ xử lý một tài nguyên không tồn tại'),
            B('loading.tsx, which shows the Suspense fallback', 'loading.tsx, thứ hiện màn dự phòng của Suspense'),
            B('fallback.tsx, a file created on every crash', 'fallback.tsx, một file được tạo ở mỗi lần sập'),
          ],
          correct: 0,
          explanation: EX(
            '<code>error.tsx</code> is an error boundary that catches render/runtime errors in its segment and below, showing a fallback with a <code>reset()</code> to retry. It must be a Client Component (<code>"use client"</code>). <code>not-found.tsx</code> handles the <code>notFound()</code> case; <code>loading.tsx</code> is the Suspense fallback.',
            '<code>error.tsx</code> là một error boundary bắt lỗi render/runtime trong đoạn của nó và bên dưới, hiện màn dự phòng kèm <code>reset()</code> để thử lại. Nó phải là Client Component (<code>"use client"</code>). <code>not-found.tsx</code> xử lý trường hợp <code>notFound()</code>; <code>loading.tsx</code> là màn dự phòng của Suspense.',
          ),
        }),
        mcq({
          prompt: B(
            'A share link built with Messenger once pointed everyone back to "/" instead of the post. In App Router terms, the safe fix is to build the URL from…',
            'Một link chia sẻ dựng bằng Messenger từng đưa mọi người về "/" thay vì bài viết. Theo App Router, cách sửa an toàn là dựng URL từ…',
          ),
          options: [
            B('The canonical route with its real params, not a relative or empty href', 'Route chuẩn kèm tham số thật của nó, không phải href tương đối hay rỗng'),
            B('window.location on the server', 'window.location ngay trên server'),
            B('A hardcoded "/" that the client rewrites later', 'Một chuỗi "/" gán cứng để client viết lại sau'),
            B('The referrer header only', 'Chỉ dựa vào header referrer'),
          ],
          correct: 0,
          explanation: EX(
            'The Messenger OG-share bug (cuongthai.com) came from an href that resolved to the app root. Always compose the absolute, canonical URL from the route and its params (<code>/blog/${slug}</code> under a known origin) so the link, its Open Graph preview, and the shared destination all agree.',
            'Lỗi chia sẻ OG qua Messenger (cuongthai.com) đến từ một href phân giải về gốc ứng dụng. Hãy luôn dựng URL tuyệt đối, chuẩn từ route và tham số của nó (<code>/blog/${slug}</code> dưới một origin đã biết) để link, bản xem trước Open Graph, và đích chia sẻ đều khớp nhau.',
          ),
        }),

        // ── Chương 9 — Server vs Client Component ───────────────────────
        mcq({
          prompt: B(
            'In the App Router, a component with no directive at the top is by default a…',
            'Trong App Router, một component không có chỉ thị ở đầu file, mặc định là…',
          ),
          options: [
            B('Server Component', 'Server Component'),
            B('Client Component', 'Client Component'),
            B('Static HTML file', 'File HTML tĩnh'),
            B('Edge function', 'Hàm Edge'),
          ],
          correct: 0,
          explanation: EX(
            'App Router components are Server Components unless the file (or one it is imported into) starts with <code>"use client"</code>. Server Components render on the server, can be async, and their code is not shipped to the browser — great for data fetching and keeping secrets server-side.',
            'Component trong App Router là Server Component trừ khi file đó (hoặc file import nó) bắt đầu bằng <code>"use client"</code>. Server Component render trên server, có thể async, và mã của chúng không gửi xuống trình duyệt — rất hợp để tải dữ liệu và giữ bí mật ở phía server.',
          ),
        }),
        mcq({
          prompt: B(
            'Which of these forces a component to be a Client Component?',
            'Thứ nào buộc một component phải là Client Component?',
          ),
          options: [
            B('Using useState, useEffect, or an onClick handler', 'Dùng useState, useEffect, hoặc một handler onClick'),
            B('Fetching data with await fetch(...)', 'Tải dữ liệu bằng await fetch(...)'),
            B('Reading params or searchParams', 'Đọc params hoặc searchParams'),
            B('Importing a server-only database client', 'Import một client cơ sở dữ liệu chỉ chạy server'),
          ],
          correct: 0,
          explanation: EX(
            'Interactivity and browser-only hooks (<code>useState</code>, <code>useEffect</code>, event handlers, <code>useContext</code> of a client context) require a Client Component. Data fetching and reading route params are the natural home of Server Components — no <code>"use client"</code> needed there.',
            'Tính tương tác và các hook chỉ chạy trên trình duyệt (<code>useState</code>, <code>useEffect</code>, handler sự kiện, <code>useContext</code> của một context phía client) đòi hỏi Client Component. Còn tải dữ liệu và đọc tham số route là nhà của Server Component — chỗ đó không cần <code>"use client"</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A Server Component renders a Client Component and passes it a prop. What kind of value CANNOT be passed across that boundary?',
            'Một Server Component render một Client Component và truyền cho nó một prop. Loại giá trị nào KHÔNG thể truyền qua ranh giới đó?',
          ),
          options: [
            B('A function that is not a Server Action, or a class instance', 'Một hàm không phải Server Action, hoặc một thể hiện của class'),
            B('A string or a number', 'Một chuỗi hoặc một số'),
            B('A plain object or an array', 'Một object thuần hoặc một mảng'),
            B('Another Server Component passed as children', 'Một Server Component khác truyền dưới dạng children'),
          ],
          correct: 0,
          explanation: EX(
            'Props crossing from Server to Client must be <b>serializable</b> (they travel as JSON-like data): strings, numbers, booleans, plain objects/arrays, and JSX/Server Components as children are fine. Arbitrary functions, class instances, Dates-with-methods, etc. are not — except Server Actions, which Next handles specially.',
            'Prop đi từ Server sang Client phải <b>tuần tự hoá được</b> (chúng đi như dữ liệu kiểu JSON): chuỗi, số, boolean, object/mảng thuần, và JSX/Server Component truyền làm children đều được. Hàm bất kỳ, thể hiện class, Date-kèm-phương-thức... thì không — trừ Server Action, thứ được Next xử lý riêng.',
          ),
        }),
        mcq({
          prompt: B(
            'A good pattern to keep most of the tree on the server while adding a little interactivity is to…',
            'Một mẫu tốt để giữ phần lớn cây trên server mà vẫn thêm chút tương tác là…',
          ),
          options: [
            B('Keep the page a Server Component and drop small Client Components at the leaves', 'Giữ trang là Server Component và đặt các Client Component nhỏ ở phần lá'),
            B('Put "use client" at the very top of the root layout', 'Đặt "use client" ngay đầu root layout'),
            B('Make every component a Client Component for consistency', 'Biến mọi component thành Client Component cho đồng nhất'),
            B('Fetch all data inside useEffect on the client', 'Tải toàn bộ dữ liệu trong useEffect phía client'),
          ],
          correct: 0,
          explanation: EX(
            'Push the <code>"use client"</code> boundary down to the smallest interactive leaves (a like button, a menu). The data-heavy shell stays a Server Component: less JS shipped, secrets stay server-side, and fetching happens close to the data. Marking the root client would drag the whole tree into the bundle.',
            'Hãy đẩy ranh giới <code>"use client"</code> xuống những chiếc lá tương tác nhỏ nhất (một nút thích, một menu). Phần vỏ nhiều dữ liệu vẫn là Server Component: gửi ít JS hơn, bí mật ở lại server, và việc tải diễn ra gần dữ liệu. Đánh dấu client ở gốc sẽ kéo cả cây vào bundle.',
          ),
        }),
        mcq({
          prompt: B(
            'Where does the code of a Server Component end up?',
            'Mã của một Server Component rốt cuộc nằm ở đâu?',
          ),
          options: [
            B('It runs on the server and is never sent to the browser bundle', 'Nó chạy trên server và không bao giờ được gửi vào bundle của trình duyệt'),
            B('It is minified and shipped like any other component', 'Nó được nén và gửi đi như mọi component khác'),
            B('It runs in a Web Worker', 'Nó chạy trong một Web Worker'),
            B('It is inlined into a script tag on the page', 'Nó được nhúng vào một thẻ script trên trang'),
          ],
          correct: 0,
          explanation: EX(
            'Server Component code executes on the server; the browser receives the rendered result (an RSC payload / HTML), not the component&#x27;s source. That is why you can import a DB client or use an API key inside one safely, and why they add zero JavaScript to the client bundle.',
            'Mã Server Component chạy trên server; trình duyệt nhận kết quả đã render (RSC payload / HTML), không nhận mã nguồn của component. Vì thế bạn có thể import một client DB hay dùng API key bên trong một cách an toàn, và vì thế chúng thêm 0 byte JavaScript vào bundle của client.',
          ),
        }),
        mcq({
          prompt: B(
            'A page shows "Đang tải…" forever. The cause was a client store&#x27;s <code>isHydrated</code> flag that never flipped true. What is the lesson for gating a Client Component on hydration?',
            'Một trang hiện "Đang tải…" mãi mãi. Nguyên nhân là cờ <code>isHydrated</code> của một client store không bao giờ lật thành true. Bài học khi dùng hydration để chặn một Client Component là gì?',
          ),
          options: [
            B('Do not gate on an unreliable store flag; use a local mounted state or read storage directly', 'Đừng chặn bằng một cờ store không đáng tin; dùng state mounted cục bộ hoặc đọc storage trực tiếp'),
            B('Always render on the server so hydration never runs', 'Luôn render trên server để hydration không bao giờ chạy'),
            B('Move the flag into a Server Component', 'Chuyển cờ đó vào một Server Component'),
            B('Disable "use client" on that component', 'Tắt "use client" trên component đó'),
          ],
          correct: 0,
          explanation: EX(
            'On cuongthai.com, <code>useAuthStore().isHydrated</code> could stay false, so any page gated on it hung on "Đang tải…". Prefer a plain <code>const [mounted, setMounted] = useState(false)</code> set in an effect, or read <code>auth-storage</code> directly — do not block the whole page on a store flag that may never resolve.',
            'Trên cuongthai.com, <code>useAuthStore().isHydrated</code> có thể mãi false, nên bất kỳ trang nào chặn bằng nó đều treo ở "Đang tải…". Hãy ưu tiên một <code>const [mounted, setMounted] = useState(false)</code> đặt trong effect, hoặc đọc <code>auth-storage</code> trực tiếp — đừng khoá cả trang vào một cờ store có thể không bao giờ lật.',
          ),
        }),

        // ── Chương 10 — fetch / cache / revalidate ──────────────────────
        mcq({
          prompt: B(
            'You want a Server Component fetch to always hit the origin and never be cached. Which option does that?',
            'Bạn muốn một lời fetch trong Server Component luôn gọi tới origin và không bao giờ bị cache. Tuỳ chọn nào làm điều đó?',
          ),
          options: [
            B('fetch(url, { cache: "no-store" })', 'fetch(url, { cache: "no-store" })'),
            B('fetch(url, { cache: "force-cache" })', 'fetch(url, { cache: "force-cache" })'),
            B('fetch(url, { keepalive: true })', 'fetch(url, { keepalive: true })'),
            B('fetch(url, { priority: "high" })', 'fetch(url, { priority: "high" })'),
          ],
          correct: 0,
          explanation: EX(
            '<code>cache: "no-store"</code> opts a fetch out of caching entirely and marks the route dynamic — every request re-fetches. <code>force-cache</code> is the opposite (cache indefinitely). For periodic freshness use <code>next: { revalidate: N }</code> (ISR-style).',
            '<code>cache: "no-store"</code> đưa một fetch ra khỏi cache hoàn toàn và đánh dấu route là động — mỗi request đều tải lại. <code>force-cache</code> thì ngược lại (cache vô thời hạn). Muốn tươi định kỳ thì dùng <code>next: { revalidate: N }</code> (kiểu ISR).',
          ),
        }),
        mcq({
          prompt: B(
            'The default caching behaviour of <code>fetch()</code> in a Server Component…',
            'Hành vi cache mặc định của <code>fetch()</code> trong một Server Component…',
          ),
          options: [
            B('Changed between Next.js versions — 14 cached by default, 15 does not', 'Đã đổi giữa các bản Next.js — bản 14 mặc định cache, bản 15 thì không'),
            B('Is always uncached in every single version of Next.js', 'Luôn không cache ở mọi phiên bản Next.js không trừ bản nào'),
            B('Is always cached forever in every single version of Next.js', 'Luôn cache vĩnh viễn ở mọi phiên bản Next.js không trừ bản nào'),
            B('Depends only on the HTTP method of the request', 'Chỉ phụ thuộc vào phương thức HTTP của request'),
          ],
          correct: 0,
          explanation: EX(
            'This is a version-sensitive point. Next 14 cached <code>fetch</code> by default (opt out with <code>no-store</code>); Next 15 flipped the default to uncached (opt in with <code>force-cache</code> or <code>revalidate</code>). Never assert one default blindly — check the version and be explicit with the cache option.',
            'Đây là điểm nhạy phiên bản. Next 14 mặc định cache <code>fetch</code> (thoát bằng <code>no-store</code>); Next 15 lật mặc định thành không cache (bật lại bằng <code>force-cache</code> hoặc <code>revalidate</code>). Đừng khẳng định một mặc định một cách mù quáng — hãy kiểm phiên bản và ghi rõ tuỳ chọn cache.',
          ),
        }),
        mcq({
          prompt: B(
            'What does <code>export const revalidate = 60</code> in a page do?',
            '<code>export const revalidate = 60</code> trong một trang làm gì?',
          ),
          options: [
            B('Serves a cached render and regenerates it in the background at most every 60 seconds', 'Phục vụ bản render đã cache và tái tạo nền tối đa mỗi 60 giây'),
            B('Forces a full reload of the page every 60 seconds in the browser', 'Ép trình duyệt tải lại toàn trang mỗi 60 giây'),
            B('Times out any fetch after 60 seconds', 'Bắt mọi fetch hết giờ sau 60 giây'),
            B('Caches the page for exactly 60 requests', 'Cache trang cho đúng 60 request'),
          ],
          correct: 0,
          explanation: EX(
            'That is time-based revalidation (ISR): the page is cached and, after 60s, the next request triggers a background regeneration while still serving the stale copy (stale-while-revalidate). It is why a list endpoint can look ~60s behind the database — the DB is the source of truth, the cache is a snapshot.',
            'Đó là làm mới theo thời gian (ISR): trang được cache và sau 60 giây, request kế tiếp kích hoạt tái tạo nền trong khi vẫn phục vụ bản cũ (stale-while-revalidate). Đó là lý do một endpoint danh sách có thể trông trễ ~60 giây so với cơ sở dữ liệu — DB là nguồn sự thật, cache chỉ là ảnh chụp.',
          ),
        }),
        mcq({
          prompt: B(
            'What is <code>generateStaticParams</code> used for?',
            '<code>generateStaticParams</code> dùng để làm gì?',
          ),
          options: [
            B('Pre-rendering dynamic routes at build time by listing their param values', 'Dựng sẵn các route động lúc build bằng cách liệt kê các giá trị tham số của chúng'),
            B('Reading query-string parameters on the client', 'Đọc tham số chuỗi truy vấn phía client'),
            B('Generating random ids for React keys', 'Sinh id ngẫu nhiên cho key của React'),
            B('Validating form parameters on submit', 'Kiểm tra tham số form khi submit'),
          ],
          correct: 0,
          explanation: EX(
            'In a dynamic segment like <code>[slug]</code>, <code>generateStaticParams</code> returns the list of slugs to statically pre-render at build (e.g. all blog posts). It is the App-Router replacement for <code>getStaticPaths</code> and makes those pages static + fast, with <code>revalidate</code> keeping them fresh.',
            'Trong một đoạn động như <code>[slug]</code>, <code>generateStaticParams</code> trả về danh sách slug để dựng tĩnh sẵn lúc build (ví dụ mọi bài blog). Nó là bản thay thế của <code>getStaticPaths</code> trong App Router, giúp các trang đó tĩnh + nhanh, và <code>revalidate</code> giữ chúng tươi.',
          ),
        }),
        mcq({
          prompt: B(
            'After a curl to a not-yet-uploaded media URL, that URL kept returning 404 for hours even after the file existed. What behaviour does this reveal?',
            'Sau khi curl vào một URL media chưa upload, URL đó vẫn trả 404 hàng giờ dù file đã tồn tại. Điều này lộ ra hành vi gì?',
          ),
          options: [
            B('The CDN caches 404 responses too, so verify with a cache-busting query', 'CDN cache cả phản hồi 404, nên hãy kiểm bằng một query phá cache'),
            B('A 404 response is never cached by any CDN under any circumstance', 'Phản hồi 404 không bao giờ được bất kỳ CDN nào cache trong mọi hoàn cảnh'),
            B('A HEAD request always bypasses the cache and hits the origin', 'Một request HEAD luôn đi vòng qua cache và gọi thẳng tới origin'),
            B('The origin server must have been permanently down', 'Máy chủ gốc hẳn đã hỏng vĩnh viễn'),
          ],
          correct: 0,
          explanation: EX(
            'Cloudflare (and CDNs generally) cache negative responses. Probing a URL before the file is there locks in a 404 for the TTL — a real cuongthai.com trap. Verify freshly-uploaded assets with a cache-busting param (<code>?cb=...</code>) and, if a URL is already poisoned, change the URL (bump a revision) rather than waiting it out.',
            'Cloudflare (và CDN nói chung) cache cả phản hồi phủ định. Thăm dò một URL trước khi có file sẽ khoá cứng 404 trong suốt TTL — một cái bẫy thật của cuongthai.com. Hãy kiểm tài nguyên vừa upload bằng tham số phá cache (<code>?cb=...</code>) và nếu một URL đã "nhiễm độc" thì đổi URL (tăng số bản) chứ đừng ngồi chờ.',
          ),
        }),
        mcq({
          prompt: B(
            'A route that uses <code>cookies()</code> or <code>headers()</code>, or reads <code>searchParams</code>, becomes…',
            'Một route dùng <code>cookies()</code> hoặc <code>headers()</code>, hoặc đọc <code>searchParams</code>, sẽ trở thành…',
          ),
          options: [
            B('Dynamically rendered on each request (it opts out of static caching)', 'Render động ở mỗi request (nó thoát khỏi cache tĩnh)'),
            B('Statically generated once at build time', 'Dựng tĩnh một lần lúc build'),
            B('A Client Component automatically', 'Tự động thành Client Component'),
            B('Cached forever regardless of input', 'Cache vĩnh viễn bất kể dữ liệu vào'),
          ],
          correct: 0,
          explanation: EX(
            'Reading request-specific data (cookies, headers, searchParams) makes a route dynamic — Next cannot pre-render it at build because the output depends on the request. If you want static + fast, avoid those APIs on that segment or push them into a small dynamic child.',
            'Đọc dữ liệu riêng của request (cookies, headers, searchParams) làm route trở nên động — Next không thể dựng sẵn lúc build vì kết quả phụ thuộc vào request. Muốn tĩnh + nhanh thì tránh các API đó ở đoạn ấy, hoặc đẩy chúng vào một component con động nhỏ.',
          ),
        }),

        // ── Chương 11 — Định tuyến nâng cao ─────────────────────────────
        mcq({
          prompt: B(
            'What does a <code>loading.tsx</code> in a segment give you for free?',
            'Một <code>loading.tsx</code> trong một đoạn cho bạn thứ gì miễn phí?',
          ),
          options: [
            B('An instant Suspense fallback shown while that segment&#x27;s data loads', 'Một màn dự phòng Suspense hiện tức thì trong khi dữ liệu đoạn đó đang tải'),
            B('A global spinner for the entire application', 'Một vòng xoay toàn cục cho cả ứng dụng'),
            B('Client-side caching of API responses', 'Cache phản hồi API phía client'),
            B('Automatic retries of failed requests', 'Tự động thử lại các request thất bại'),
          ],
          correct: 0,
          explanation: EX(
            '<code>loading.tsx</code> wraps the segment in a Suspense boundary: while the async Server Component awaits its data, Next streams the fallback immediately, then swaps in the real content. It scopes the loading state to that segment, so the surrounding layout stays interactive.',
            '<code>loading.tsx</code> bọc đoạn đó trong một ranh giới Suspense: trong khi Server Component bất đồng bộ chờ dữ liệu, Next stream màn dự phòng ngay, rồi thay bằng nội dung thật. Nó khoanh trạng thái tải vào đúng đoạn ấy, nên layout xung quanh vẫn tương tác được.',
          ),
        }),
        mcq({
          prompt: B(
            'To build an API endpoint at <code>/api/gifs</code> in the App Router, you create…',
            'Để dựng một endpoint API tại <code>/api/gifs</code> trong App Router, bạn tạo…',
          ),
          options: [
            B('app/api/gifs/route.ts exporting GET/POST handlers', 'app/api/gifs/route.ts export các handler GET/POST'),
            B('app/api/gifs/page.tsx returning JSON', 'app/api/gifs/page.tsx trả về JSON'),
            B('pages/api/gifs.ts', 'pages/api/gifs.ts'),
            B('A Server Action in the layout', 'Một Server Action trong layout'),
          ],
          correct: 0,
          explanation: EX(
            'A Route Handler lives in <code>route.ts</code> and exports functions named after HTTP methods (<code>export async function GET(req) {...}</code>). This is exactly the pattern behind cuongthai.com&#x27;s <code>/api/v1/gifs</code> proxy — the key stays server-side and the browser never sees it.',
            'Route Handler nằm trong <code>route.ts</code> và export các hàm đặt tên theo phương thức HTTP (<code>export async function GET(req) {...}</code>). Đây đúng là mẫu đằng sau proxy <code>/api/v1/gifs</code> của cuongthai.com — key ở lại server và trình duyệt không bao giờ thấy nó.',
          ),
        }),
        mcq({
          prompt: B(
            'Inside a Server Component, how do you send the user to <code>/login</code> when they are not authenticated?',
            'Bên trong một Server Component, làm sao đưa người dùng tới <code>/login</code> khi họ chưa đăng nhập?',
          ),
          options: [
            B('Call redirect("/login") from next/navigation', 'Gọi redirect("/login") từ next/navigation'),
            B('Set window.location = "/login"', 'Gán window.location = "/login"'),
            B('Return <Redirect to="/login" />', 'Trả về <Redirect to="/login" />'),
            B('Throw a new Response(302)', 'Ném new Response(302)'),
          ],
          correct: 0,
          explanation: EX(
            '<code>redirect()</code> from <code>next/navigation</code> works in Server Components, Route Handlers and Server Actions — it interrupts rendering and navigates. <code>window</code> does not exist on the server, and there is no <code>&lt;Redirect&gt;</code> component in the App Router. <code>notFound()</code> is the sibling for 404s.',
            '<code>redirect()</code> từ <code>next/navigation</code> chạy được trong Server Component, Route Handler và Server Action — nó ngắt việc render và điều hướng. <code>window</code> không tồn tại trên server, và App Router không có component <code>&lt;Redirect&gt;</code>. <code>notFound()</code> là anh em cho lỗi 404.',
          ),
        }),
        mcq({
          prompt: B(
            'Where does Next.js middleware run, and what is a typical job for it?',
            'Middleware của Next.js chạy ở đâu, và việc điển hình của nó là gì?',
          ),
          options: [
            B('Before the request reaches a route — e.g. auth checks, redirects, rewrites', 'Trước khi request tới một route — ví dụ kiểm auth, chuyển hướng, viết lại URL'),
            B('After rendering, to post-process HTML in the browser', 'Sau khi render, để hậu xử lý HTML trong trình duyệt'),
            B('Only inside Client Components', 'Chỉ bên trong Client Component'),
            B('As a replacement for every Route Handler', 'Thay thế cho mọi Route Handler'),
          ],
          correct: 0,
          explanation: EX(
            '<code>middleware.ts</code> runs on the edge before a request is handled, so it is ideal for gatekeeping: checking a session cookie and redirecting to <code>/login</code>, rewriting paths, setting headers, A/B routing. It should be fast and must not do heavy work — the route handles that.',
            '<code>middleware.ts</code> chạy ở biên (edge) trước khi request được xử lý, nên rất hợp để gác cổng: kiểm cookie phiên rồi chuyển tới <code>/login</code>, viết lại đường dẫn, đặt header, định tuyến A/B. Nó phải nhanh và không nên làm việc nặng — việc đó để route lo.',
          ),
        }),
        mcq({
          prompt: B(
            'Parallel routes (slots like <code>@modal</code>) and intercepting routes are typically combined to…',
            'Parallel route (các slot như <code>@modal</code>) và intercepting route thường được kết hợp để…',
          ),
          options: [
            B('Show a photo/detail in a modal over the current page, with a shareable URL', 'Hiện ảnh/chi tiết trong một modal đè lên trang hiện tại, kèm URL chia sẻ được'),
            B('Cache two entirely separate pages inside the very same slot', 'Cache hai trang hoàn toàn tách biệt bên trong cùng một slot'),
            B('Replace Server Actions with a lighter routing mechanism', 'Thay thế Server Actions bằng một cơ chế định tuyến nhẹ hơn'),
            B('Disable client-side navigation across the whole application', 'Tắt điều hướng phía client trên toàn bộ ứng dụng'),
          ],
          correct: 0,
          explanation: EX(
            'The classic use is the "modal on navigation" pattern: an intercepting route catches a link click to <code>/photo/123</code> and renders it inside a parallel <code>@modal</code> slot over the feed, while a hard load of that same URL shows the full page. One URL, two presentations.',
            'Cách dùng kinh điển là mẫu "modal khi điều hướng": một intercepting route bắt cú click link tới <code>/photo/123</code> và render nó trong một slot song song <code>@modal</code> đè lên feed, còn khi tải thẳng chính URL đó thì hiện trang đầy đủ. Một URL, hai cách trình bày.',
          ),
        }),
        mcq({
          prompt: B(
            'The <code>&lt;Link&gt;</code> component from <code>next/link</code> improves navigation mainly by…',
            'Component <code>&lt;Link&gt;</code> từ <code>next/link</code> cải thiện điều hướng chủ yếu bằng cách…',
          ),
          options: [
            B('Client-side transitions plus prefetching the target route in the background', 'Chuyển trang phía client cộng với việc prefetch route đích ở nền'),
            B('Forcing a full server round-trip for each click', 'Ép một vòng gọi server đầy đủ cho mỗi lần click'),
            B('Rendering the target page inside an iframe', 'Render trang đích bên trong một iframe'),
            B('Disabling the browser back button', 'Vô hiệu hoá nút back của trình duyệt'),
          ],
          correct: 0,
          explanation: EX(
            '<code>&lt;Link&gt;</code> does a soft, client-side navigation (no full reload) and prefetches the linked route when it enters the viewport, so the transition feels instant. A plain <code>&lt;a&gt;</code> would trigger a full document load and lose that.',
            '<code>&lt;Link&gt;</code> thực hiện điều hướng mềm phía client (không tải lại toàn trang) và prefetch route được liên kết khi nó lọt vào khung nhìn, nên chuyển trang có cảm giác tức thì. Một thẻ <code>&lt;a&gt;</code> thường sẽ kích hoạt tải lại toàn bộ tài liệu và mất đi lợi thế đó.',
          ),
        }),

        // ── Chương 12 — Server Actions ──────────────────────────────────
        mcq({
          prompt: B(
            'What does the <code>"use server"</code> directive mark?',
            'Chỉ thị <code>"use server"</code> đánh dấu điều gì?',
          ),
          options: [
            B('A function that runs on the server and can be called from the client', 'Một hàm chạy trên server và có thể được gọi từ phía client'),
            B('A component that is forced to always render on the server', 'Một component bị buộc luôn luôn render ở phía server'),
            B('A file that should never be included in any bundle', 'Một file không bao giờ được đưa vào bất kỳ bundle nào'),
            B('The mirror opposite of "use client" but only for styling', 'Bản đối xứng của "use client" nhưng chỉ dành cho việc tạo kiểu'),
          ],
          correct: 0,
          explanation: EX(
            '<code>"use server"</code> marks Server Actions — server-side functions you can invoke from a form&#x27;s <code>action</code> or a client event. Next creates a secure RPC endpoint for them, so the client "calls" the function but the body only ever runs on the server. (<code>"use client"</code> marks components, not the mirror of this.)',
            '<code>"use server"</code> đánh dấu Server Action — hàm phía server bạn có thể gọi từ <code>action</code> của form hoặc một sự kiện client. Next tạo một endpoint RPC an toàn cho chúng, nên client "gọi" hàm nhưng thân hàm chỉ chạy trên server. (<code>"use client"</code> đánh dấu component, không phải bản đối xứng của cái này.)',
          ),
        }),
        mcq({
          prompt: B(
            'After a Server Action mutates data, how do you make the current route show the fresh data?',
            'Sau khi một Server Action thay đổi dữ liệu, làm sao để route hiện tại hiện dữ liệu mới?',
          ),
          options: [
            B('Call revalidatePath("/...") or revalidateTag(...) inside the action', 'Gọi revalidatePath("/...") hoặc revalidateTag(...) trong action'),
            B('Do a window.location.reload()', 'Gọi window.location.reload()'),
            B('Nothing — Server Actions always refresh everything', 'Không cần gì — Server Action luôn tự làm mới tất cả'),
            B('Manually clear localStorage', 'Xoá localStorage bằng tay'),
          ],
          correct: 0,
          explanation: EX(
            'A Server Action can invalidate the cache for a path or a tag with <code>revalidatePath</code>/<code>revalidateTag</code>; Next then re-renders the affected Server Components with fresh data without a full reload. This is the server-first alternative to manually refetching in the client.',
            'Một Server Action có thể vô hiệu cache cho một đường dẫn hoặc một tag bằng <code>revalidatePath</code>/<code>revalidateTag</code>; sau đó Next render lại các Server Component bị ảnh hưởng với dữ liệu mới mà không tải lại toàn trang. Đây là lựa chọn server-first thay cho việc tải lại thủ công ở client.',
          ),
        }),
        mcq({
          prompt: B(
            'React renamed a form hook. Which pairing is correct for Next 15 / React 19?',
            'React đã đổi tên một hook cho form. Cặp nào đúng cho Next 15 / React 19?',
          ),
          options: [
            B('useActionState (from react) for state; useFormStatus (from react-dom) for pending', 'useActionState (từ react) cho state; useFormStatus (từ react-dom) cho trạng thái đang chờ'),
            B('useFormState (from react-dom) is still the current name', 'useFormState (từ react-dom) vẫn là tên hiện hành'),
            B('useForm (from react) replaces both hooks', 'useForm (từ react) thay thế cả hai hook'),
            B('useState is the official form-action hook', 'useState là hook chính thức cho form-action'),
          ],
          correct: 0,
          explanation: EX(
            'In React 19 (Next 15), <code>useFormState</code> was renamed to <code>useActionState</code> and now imports from <code>react</code>. <code>useFormStatus</code> keeps its name and still imports from <code>react-dom</code>. Getting the import source wrong is a common upgrade break.',
            'Ở React 19 (Next 15), <code>useFormState</code> được đổi tên thành <code>useActionState</code> và giờ import từ <code>react</code>. <code>useFormStatus</code> giữ nguyên tên và vẫn import từ <code>react-dom</code>. Nhầm chỗ import là một lỗi nâng cấp thường gặp.',
          ),
        }),
        mcq({
          prompt: B(
            'Why are Server Actions bound to a <code>&lt;form action={...}&gt;</code> considered "progressively enhanced"?',
            'Vì sao Server Action gắn vào <code>&lt;form action={...}&gt;</code> được coi là "nâng cấp tiệm tiến" (progressive enhancement)?',
          ),
          options: [
            B('The form still submits and works even before/without client-side JavaScript', 'Form vẫn submit và hoạt động ngay cả trước/khi không có JavaScript phía client'),
            B('They automatically add animations to the form', 'Chúng tự thêm hiệu ứng cho form'),
            B('They upgrade the CSS to the latest version', 'Chúng nâng CSS lên phiên bản mới nhất'),
            B('They require WebSocket to function', 'Chúng cần WebSocket mới hoạt động'),
          ],
          correct: 0,
          explanation: EX(
            'Because the action is wired to the native <code>&lt;form&gt;</code>, a submit posts to the server and works even if JS has not loaded yet or is disabled. When JS is present, Next enhances it into a smooth client transition. The baseline experience never fully breaks.',
            'Vì action được nối vào <code>&lt;form&gt;</code> gốc, một lần submit sẽ POST lên server và hoạt động ngay cả khi JS chưa tải xong hoặc bị tắt. Khi có JS, Next nâng nó thành một chuyển tiếp mượt phía client. Trải nghiệm nền tảng không bao giờ hỏng hoàn toàn.',
          ),
        }),
        mcq({
          prompt: B(
            'Inside a Server Action, you read a field with <code>formData.get("email")</code>. What is a must-do before trusting it?',
            'Bên trong một Server Action, bạn đọc một trường bằng <code>formData.get("email")</code>. Việc bắt buộc trước khi tin nó là gì?',
          ),
          options: [
            B('Validate/parse it on the server (e.g. with a schema) — never trust client input', 'Kiểm tra/parse nó trên server (ví dụ bằng schema) — không bao giờ tin dữ liệu từ client'),
            B('Nothing — form data from your own UI is already safe', 'Không cần gì — dữ liệu form từ UI của mình đã an toàn'),
            B('Only check it again in the browser', 'Chỉ kiểm lại nó trong trình duyệt'),
            B('Store it directly, validation is the database&#x27;s job', 'Lưu thẳng, kiểm tra là việc của cơ sở dữ liệu'),
          ],
          correct: 0,
          explanation: EX(
            'A Server Action is a public server endpoint — anyone can post to it, not just your form. Always validate on the server (Zod/manual) before using or storing the data. Client-side checks are for UX only; the server check is the real gate.',
            'Một Server Action là một endpoint server công khai — ai cũng có thể POST tới nó, không chỉ form của bạn. Hãy luôn kiểm tra trên server (Zod/thủ công) trước khi dùng hoặc lưu dữ liệu. Kiểm phía client chỉ để trải nghiệm; kiểm phía server mới là cổng thật.',
          ),
        }),
        mcq({
          prompt: B(
            'A "like" button calls a Server Action but the UI should feel instant. Which React 19 API shows a temporary state before the server responds?',
            'Một nút "thích" gọi Server Action nhưng UI cần cảm giác tức thì. API nào của React 19 hiện trạng thái tạm trước khi server phản hồi?',
          ),
          options: [
            B('useOptimistic', 'useOptimistic'),
            B('useDeferredValue', 'useDeferredValue'),
            B('useSyncExternalStore', 'useSyncExternalStore'),
            B('useImperativeHandle', 'useImperativeHandle'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useOptimistic</code> lets you render an expected result immediately (the like count +1) while the Server Action is in flight, then reconciles with the real result when it returns — reverting automatically if it fails. It is purpose-built for this optimistic-UI-over-actions pattern.',
            '<code>useOptimistic</code> cho phép bạn render kết quả kỳ vọng ngay lập tức (số lượt thích +1) trong khi Server Action đang chạy, rồi hoà hợp với kết quả thật khi nó trở về — tự hoàn tác nếu thất bại. Nó sinh ra đúng cho mẫu UI lạc quan chồng trên action này.',
          ),
        }),

        // ── Câu lập trình 1 ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — App Router matcher (chapters 8 + 11).</b> Implement <code>matchRoute(pathname, routes)</code> that mimics how the App Router picks a segment. Split on "/". Match against each route in order and return the FIRST match as <code>{ route, params }</code>, or <code>null</code>.</p>' +
            '<ul>' +
            '<li>A plain segment (<code>blog</code>) must equal the path segment.</li>' +
            '<li>A dynamic segment <code>[name]</code> captures one segment into <code>params.name</code>.</li>' +
            '<li>A catch-all <code>[...name]</code> captures the rest of the path as an <b>array</b> into <code>params.name</code> and matches whatever remains.</li>' +
            '<li>A non catch-all route matches only when the segment counts are equal.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are; do not install anything.</p>',

            '<p><b>Câu 31 — Bộ so khớp của App Router (chương 8 + 11).</b> Cài đặt <code>matchRoute(pathname, routes)</code> mô phỏng cách App Router chọn một đoạn. Tách theo "/". So khớp lần lượt từng route và trả về khớp ĐẦU TIÊN dưới dạng <code>{ route, params }</code>, hoặc <code>null</code>.</p>' +
            '<ul>' +
            '<li>Đoạn thường (<code>blog</code>) phải bằng đúng đoạn trong đường dẫn.</li>' +
            '<li>Đoạn động <code>[name]</code> bắt một đoạn vào <code>params.name</code>.</li>' +
            '<li>Đoạn catch-all <code>[...name]</code> bắt phần còn lại của đường dẫn thành một <b>mảng</b> vào <code>params.name</code> và khớp với mọi thứ còn lại.</li>' +
            '<li>Route không phải catch-all chỉ khớp khi số đoạn bằng nhau.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in; không cài thêm gì.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function matchRoute(pathname, routes) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const ROUTES = ['/', '/blog', '/blog/[slug]', '/shop/[category]/[id]', '/docs/[...path]'];\n" +
            "for (const pn of ['/', '/blog', '/blog/react-19', '/shop/shoes/42', '/docs/a/b/c', '/nope'])\n" +
            "  console.log(pn, '=>', JSON.stringify(matchRoute(pn, ROUTES)));\n",
          expectedOutput:
            '/ => {"route":"/","params":{}}\n' +
            '/blog => {"route":"/blog","params":{}}\n' +
            '/blog/react-19 => {"route":"/blog/[slug]","params":{"slug":"react-19"}}\n' +
            '/shop/shoes/42 => {"route":"/shop/[category]/[id]","params":{"category":"shoes","id":"42"}}\n' +
            '/docs/a/b/c => {"route":"/docs/[...path]","params":{"path":["a","b","c"]}}\n' +
            '/nope => null',
          sampleSolution:
            'function matchRoute(pathname, routes) {\n' +
            "  const segs = pathname.split('/').filter(Boolean);\n" +
            '  for (const route of routes) {\n' +
            "    const parts = route.split('/').filter(Boolean);\n" +
            '    const params = {};\n' +
            '    let ok = true;\n' +
            '    for (let i = 0; i < parts.length; i++) {\n' +
            '      const p = parts[i];\n' +
            "      if (p.startsWith('[...') && p.endsWith(']')) {\n" +
            '        params[p.slice(4, -1)] = segs.slice(i);\n' +
            '        return { route, params };\n' +
            "      } else if (p.startsWith('[') && p.endsWith(']')) {\n" +
            '        if (segs[i] === undefined) { ok = false; break; }\n' +
            '        params[p.slice(1, -1)] = segs[i];\n' +
            '      } else if (p !== segs[i]) {\n' +
            '        ok = false; break;\n' +
            '      }\n' +
            '    }\n' +
            '    if (ok && parts.length === segs.length) return { route, params };\n' +
            '  }\n' +
            '  return null;\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),

        // ── Câu lập trình 2 ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — A deterministic cache key (chapter 10).</b> A cached fetch needs a stable key so the same query always hits the same cache entry, regardless of how the params were ordered. Implement <code>buildCacheKey(base, params)</code>:</p>' +
            '<ul>' +
            '<li>Drop any param whose value is <code>""</code>, <code>null</code>, or <code>undefined</code>.</li>' +
            '<li>Convert every remaining value to a string and sort the pairs by key (ascending).</li>' +
            '<li>Join as <code>key=value</code> with <code>&amp;</code>, URL-encoding each value, and append as <code>?...</code> to <code>base</code>.</li>' +
            '<li>If nothing remains, return <code>base</code> alone (no <code>?</code>).</li>' +
            '</ul>' +
            '<p>Keep the given printing block exactly as it is; do not install anything.</p>',

            '<p><b>Câu 32 — Một cache key tất định (chương 10).</b> Một fetch có cache cần một key ổn định để cùng một truy vấn luôn trúng cùng một mục cache, bất kể thứ tự tham số. Cài đặt <code>buildCacheKey(base, params)</code>:</p>' +
            '<ul>' +
            '<li>Bỏ mọi tham số có giá trị <code>""</code>, <code>null</code>, hoặc <code>undefined</code>.</li>' +
            '<li>Đổi mọi giá trị còn lại thành chuỗi và sắp các cặp theo key (tăng dần).</li>' +
            '<li>Nối thành <code>key=value</code> bằng <code>&amp;</code>, URL-encode từng giá trị, và ghép vào <code>base</code> dưới dạng <code>?...</code>.</li>' +
            '<li>Nếu không còn gì, trả về mỗi <code>base</code> (không có <code>?</code>).</li>' +
            '</ul>' +
            '<p>Giữ nguyên khối in cho sẵn; không cài thêm gì.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function buildCacheKey(base, params) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "console.log(buildCacheKey('/api/posts', { page: 2, q: '', tag: 'react', sort: 'new' }));\n" +
            "console.log(buildCacheKey('/api/posts', { sort: 'new', q: 'a b', page: 1 }));\n" +
            "console.log(buildCacheKey('/api/posts', {}));\n" +
            "console.log(buildCacheKey('/api/posts', { q: '', tag: null }));\n",
          expectedOutput:
            '/api/posts?page=2&sort=new&tag=react\n' +
            '/api/posts?page=1&q=a%20b&sort=new\n' +
            '/api/posts\n' +
            '/api/posts',
          sampleSolution:
            'function buildCacheKey(base, params) {\n' +
            '  const clean = Object.entries(params)\n' +
            "    .filter(([, v]) => v !== '' && v !== null && v !== undefined)\n" +
            '    .map(([k, v]) => [k, String(v)])\n' +
            '    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));\n' +
            "  const qs = clean.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');\n" +
            '  return qs ? `${base}?${qs}` : base;\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
