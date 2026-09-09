/**
 * TypeScript — Progress Test 3 (chương 12–16).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/typescript/s12…s16`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ ĐO THẬT, KHÔNG ĐOÁN. Mọi thông báo lỗi, mọi kiểu suy luận và mọi dòng
 * "in ra gì" trong file này đều lấy từ việc chạy thật trên máy soạn đề:
 *
 *   • TypeScript  5.9.3   (`node_modules/.bin/tsc -v`)
 *   • Node        v22.21.0
 *   • Cờ đo nền   tsc --noEmit --strict --target ES2022 <file>.ts
 *     – câu có import: thêm  --module NodeNext --moduleResolution NodeNext --skipLibCheck
 *     – câu React (.tsx): tsconfig riêng với
 *       module ESNext · moduleResolution Bundler · jsx react-jsx ·
 *       lib ES2022,DOM,DOM.Iterable · strict · skipLibCheck
 *   • React       react 18.3.1 · @types/react 18.3.31 (bản `frontend/` đang cài)
 *   • Zod         3.25.76
 *   • Prisma      client sinh sẵn trong `node_modules/.prisma/client` của repo
 *   • Chạy        node <file>.ts / node <file>.mjs
 *
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 — theo MÁY, không theo sách):
 *
 *  1. **`get`/`set` kiểu KHÔNG liên quan nhau vẫn biên dịch được (bài 14.3).**
 *     Giáo trình viết: "TypeScript đòi kiểu tham số của setter phải nhận được
 *     từ kiểu trả về của getter; viết `get value(): number` cạnh
 *     `set value(v: string)` là **TS2380**". Đo trên 5.9.3:
 *         class A { get v(): number {…} set v(x: string) {…} }   → mã thoát 0
 *     TypeScript 5.1 đã cho phép getter/setter mang kiểu hoàn toàn rời nhau
 *     **miễn là CẢ HAI đều được chú thích tường minh**. Còn thiếu một bên thì
 *     bên đó suy từ bên kia:
 *         class C { get v() { return 1; } set v(x: string) {…} }
 *         → getter thành `string`, và `return 1` là TS2322.
 *     Câu 17 ra theo bản máy.
 *
 *  2. **`React.FC` KHÔNG còn âm thầm nhận `children` (bài 12.1).** Giáo trình
 *     cảnh báo `const Card: React.FC<CardProps> = …` ngầm thêm
 *     `children?: ReactNode`, "trong bộ kiểu React 17 và cũ hơn; React 18 đã
 *     bỏ". Repo này dùng **@types/react 18.3.31**, nên đo thật:
 *         <Card title="Hi">oops</Card>
 *         → TS2322 … Property 'children' does not exist on type
 *           'IntrinsicAttributes & CardProps'.
 *     Tức cái bẫy ấy KHÔNG tái hiện trên máy này — nó đã đảo chiều thành lỗi.
 *     Câu 3 hỏi đúng trạng thái thật.
 *
 *  3. **`z.input` của `z.coerce.number()` là `number`, không phải `string`
 *     (bài 13.3).** Giáo trình bảo dùng `z.input<typeof s>` để lấy "thứ đi
 *     VÀO", ngụ ý nó là chuỗi. Đo trên Zod 3.25.76 với
 *     `z.object({ port: z.coerce.number().default(3000), name: z.string() })`:
 *         z.infer  → { port: number;  name: string }
 *         z.input  → { name: string;  port?: number | undefined }
 *     `z.input` chỉ phản ánh `.default()` (biến `port` thành tuỳ chọn), KHÔNG
 *     phản ánh `.coerce` — lúc CHẠY thì `S.parse({ port: '8080', … })` vẫn ra
 *     `{"port":8080,…}` bình thường. Câu 10 ra theo bản máy.
 *
 * ℹ️ Ghi chú kỹ thuật: hai câu lập trình cố ý KHÔNG dùng `enum`, KHÔNG dùng
 *    parameter property, và KHÔNG import gói ngoài (không Zod, không Prisma,
 *    không React). `scripts/exam-check.mjs` chạy đáp án mẫu bằng
 *    `node answer.ts` trong một thư mục tạm — cú pháp không-xoá-được sẽ bị từ
 *    chối thẳng, còn `import` thì không có gì để phân giải.
 *
 * 📊 Phân bố vị trí đáp án (chỉ tính 30 câu trắc nghiệm):
 *        { '0': 8, '1': 8, '2': 8, '3': 7 }   ← 31 vì câu 24 chọn HAI đáp án
 *   node -e "import('./content/exams/TYPESCRIPT-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/TYPESCRIPT-PT3.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TYPESCRIPT-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/typescript-exam-kit.mjs';

export default {
  course: { slug: 'typescript' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 12–16 (React, Zod & Prisma, classes, build performance, architecture)',
        'Kiểm tra tiến độ 3 — Chương 12–16 (React, Zod & Prisma, class, hiệu năng build, kiến trúc)',
      ),
      description: B(
        'The final third of the TypeScript course: typing React props, hooks, events and context; validating the boundary with Zod and deriving types from Prisma; classes, access modifiers and decorators; keeping a growing build fast; and designing so illegal states cannot be written. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá TypeScript: gõ kiểu cho props, hook, sự kiện và context của React; kiểm dữ liệu ở ranh giới bằng Zod và suy kiểu từ Prisma; class, bổ ngữ truy cập và decorator; giữ cho một build đang lớn dần vẫn nhanh; và thiết kế sao cho trạng thái sai không viết ra được. 30 câu trắc nghiệm cùng 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '12–16'),
      questions: [
        // ── Chương 12 — TypeScript trong React ──────────────────────────
        mcq({
          prompt: B(
            'Three uses of one typed component. How many errors, and what are they?' + code(
              'interface ButtonProps { label: string; onClick: () => void; disabled?: boolean }\n' +
              'function Button({ label, onClick, disabled }: ButtonProps) { /* … */ }\n' +
              '\n' +
              'const a = <Button label={42} onClick={() =&gt; {}} />;              // A\n' +
              'const b = <Button onClick={() =&gt; {}} />;                         // B\n' +
              'const c = <Button label="ok" onClick={() =&gt; {}} size="lg" />;    // C',
            ),
            'Ba cách dùng một component đã gõ kiểu. Bao nhiêu lỗi, và là những lỗi gì?' + code(
              'interface ButtonProps { label: string; onClick: () => void; disabled?: boolean }\n' +
              'function Button({ label, onClick, disabled }: ButtonProps) { /* … */ }\n' +
              '\n' +
              'const a = <Button label={42} onClick={() =&gt; {}} />;              // A\n' +
              'const b = <Button onClick={() =&gt; {}} />;                         // B\n' +
              'const c = <Button label="ok" onClick={() =&gt; {}} size="lg" />;    // C',
            ),
          ),
          options: [
            B(
              'One, on A only. JSX checks attribute types but not which attributes exist, so B falls back to <code>undefined</code> and C is simply ignored',
              'Một lỗi, chỉ ở A. JSX kiểm kiểu của thuộc tính chứ không kiểm thuộc tính nào tồn tại, nên B rơi về <code>undefined</code> còn C bị bỏ qua',
            ),
            B(
              'Two, on A and B. An unknown attribute like <code>size</code> is passed through to the DOM, which is why C is allowed',
              'Hai lỗi, ở A và B. Một thuộc tính lạ như <code>size</code> được chuyển thẳng xuống DOM, nên C được phép',
            ),
            B(
              'Three: TS2322 on A (number for a string), TS2741 on B (<code>label</code> missing), and TS2322 on C naming <code>IntrinsicAttributes &amp; ButtonProps</code> because <code>size</code> is not a prop',
              'Ba lỗi: TS2322 ở A (số cho một chuỗi), TS2741 ở B (thiếu <code>label</code>), và TS2322 ở C nêu <code>IntrinsicAttributes &amp; ButtonProps</code> vì <code>size</code> không phải một prop',
            ),
            B(
              'Three, but all of them are TS2559 — JSX compares the whole attribute object against the props type in one go and reports the same code each time',
              'Ba lỗi, nhưng đều là TS2559 — JSX so cả object thuộc tính với kiểu props một lượt và báo cùng một mã lỗi mỗi lần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured with @types/react 18.3.31: three errors, exactly as listed — <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;</code>, <code>TS2741: Property &#39;label&#39; is missing in type &#39;{ onClick: () =&gt; void; }&#39; but required in type &#39;ButtonProps&#39;</code>, and <code>TS2322 … Property &#39;size&#39; does not exist on type &#39;IntrinsicAttributes &amp; ButtonProps&#39;</code>. A component is a function of one argument, so JSX attributes are just an object literal checked against the props type — which means all three of chapter 4\'s rules apply here: wrong value type, missing required key, and the excess-property check on a fresh literal. The <code>IntrinsicAttributes</code> in the third message is React\'s own contribution (<code>key</code>, <code>ref</code>), intersected with your props.',
            'Đo với @types/react 18.3.31: đúng ba lỗi như liệt kê — <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;</code>, <code>TS2741: Property &#39;label&#39; is missing in type &#39;{ onClick: () =&gt; void; }&#39; but required in type &#39;ButtonProps&#39;</code>, và <code>TS2322 … Property &#39;size&#39; does not exist on type &#39;IntrinsicAttributes &amp; ButtonProps&#39;</code>. Một component là hàm của đúng một tham số, nên các thuộc tính JSX chỉ là một object literal được đối chiếu với kiểu props — nghĩa là cả ba quy tắc của chương 4 đều áp dụng ở đây: sai kiểu giá trị, thiếu khoá bắt buộc, và phép kiểm thuộc tính thừa trên một literal tươi. Cụm <code>IntrinsicAttributes</code> trong thông báo thứ ba là phần React tự thêm (<code>key</code>, <code>ref</code>), giao với props của bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the last line produce?' + code(
              "import { ReactNode } from 'react';\n" +
              'interface CardProps { title: string; children: ReactNode }\n' +
              'function Card({ title, children }: CardProps) { /* … */ }\n' +
              '\n' +
              'const c = <Card title="Hi" />;',
            ),
            'Dòng cuối cho ra gì?' + code(
              "import { ReactNode } from 'react';\n" +
              'interface CardProps { title: string; children: ReactNode }\n' +
              'function Card({ title, children }: CardProps) { /* … */ }\n' +
              '\n' +
              'const c = <Card title="Hi" />;',
            ),
          ),
          options: [
            B(
              'Nothing — <code>children</code> is supplied by React itself, so it never has to appear in the JSX',
              'Không lỗi — <code>children</code> do chính React cung cấp nên nó không bao giờ cần xuất hiện trong JSX',
            ),
            B(
              'TS2322, because <code>ReactNode</code> cannot describe "nothing" and an empty element has no renderable value',
              'TS2322, vì <code>ReactNode</code> không mô tả được "không có gì" và một phần tử rỗng thì không có giá trị nào để render',
            ),
            B(
              'A runtime warning only — React logs "Card expected children" and renders an empty section',
              'Chỉ là cảnh báo lúc chạy — React ghi log "Card expected children" rồi render một section rỗng',
            ),
            B(
              'TS2741 "Property &#39;children&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;CardProps&#39;" — <code>children</code> is an ordinary required prop',
              'TS2741 "Property &#39;children&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;CardProps&#39;" — <code>children</code> là một prop bắt buộc bình thường',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>error TS2741: Property &#39;children&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;CardProps&#39;.</code>. Anything nested between a component\'s tags arrives as the <code>children</code> prop, and it is nothing special — declare it required and an empty <code>&lt;Card /&gt;</code> is an error; declare it <code>children?: ReactNode</code> and empty is allowed. <code>ReactNode</code> is the widest renderable type: elements, strings, numbers, arrays, <code>null</code>. Reach for <code>ReactElement</code> only when you genuinely need exactly one element, and do not annotate the component\'s return type with <code>JSX.Element</code> — that would forbid returning <code>null</code>, which components legitimately do.',
            'Đo được: <code>error TS2741: Property &#39;children&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;CardProps&#39;.</code>. Mọi thứ lồng giữa hai thẻ của component đều đến dưới dạng prop <code>children</code>, và nó chẳng có gì đặc biệt — khai bắt buộc thì một <code>&lt;Card /&gt;</code> rỗng là lỗi; khai <code>children?: ReactNode</code> thì để rỗng được phép. <code>ReactNode</code> là kiểu render-được rộng nhất: phần tử, chuỗi, số, mảng, <code>null</code>. Chỉ dùng <code>ReactElement</code> khi thật sự cần đúng một phần tử, và đừng chú thích kiểu trả về của component là <code>JSX.Element</code> — làm thế là cấm trả <code>null</code>, thứ mà component hoàn toàn có quyền trả.',
          ),
        }),

        mcq({
          prompt: B(
            'The course warns that <code>React.FC</code> silently accepts <code>children</code> even when the component ignores them. Compiled here against <b>@types/react 18.3.31</b>, what actually happens?' + code(
              "import { FC } from 'react';\n" +
              'interface CardProps { title: string }\n' +
              'const Card: FC<CardProps> = ({ title }) =&gt; <h2>{title}</h2>;\n' +
              '\n' +
              'const a = <Card title="Hi">oops</Card>;',
            ),
            'Giáo trình cảnh báo <code>React.FC</code> âm thầm nhận <code>children</code> kể cả khi component bỏ qua chúng. Biên dịch ở đây với <b>@types/react 18.3.31</b> thì thực tế ra sao?' + code(
              "import { FC } from 'react';\n" +
              'interface CardProps { title: string }\n' +
              'const Card: FC<CardProps> = ({ title }) =&gt; <h2>{title}</h2>;\n' +
              '\n' +
              'const a = <Card title="Hi">oops</Card>;',
            ),
          ),
          options: [
            B(
              'It is an error: TS2322 … "Property &#39;children&#39; does not exist on type &#39;IntrinsicAttributes &amp; CardProps&#39;" — React 18\'s types dropped the implicit <code>children</code>, so the trap no longer reproduces here',
              'Đó là lỗi: TS2322 … "Property &#39;children&#39; does not exist on type &#39;IntrinsicAttributes &amp; CardProps&#39;" — bộ kiểu React 18 đã bỏ <code>children</code> ngầm, nên cái bẫy ấy không còn tái hiện trên máy này',
            ),
            B(
              'It compiles and the text renders anyway, because <code>FC</code> forwards unknown props straight to the returned element',
              'Nó biên dịch được và đoạn chữ vẫn hiện ra, vì <code>FC</code> chuyển mọi prop lạ thẳng xuống phần tử được trả về',
            ),
            B(
              'It compiles silently and the text never appears — exactly the trap the course describes, unchanged in React 18',
              'Nó biên dịch im lặng và đoạn chữ không bao giờ hiện — đúng cái bẫy giáo trình mô tả, không đổi ở React 18',
            ),
            B(
              'It is an error, but a different one: TS2559, because <code>FC</code> requires the props type to declare <code>children</code> explicitly in every version',
              'Đó là lỗi, nhưng lỗi khác: TS2559, vì <code>FC</code> đòi kiểu props phải khai <code>children</code> tường minh ở mọi phiên bản',
            ),
          ],
          correct: 0,
          explanation: EX(
            '⚠️ Measured on this repo\'s <b>@types/react 18.3.31</b>: <code>error TS2322: Type &#39;{ children: string; title: string; }&#39; is not assignable to type &#39;IntrinsicAttributes &amp; CardProps&#39;. Property &#39;children&#39; does not exist on type &#39;IntrinsicAttributes &amp; CardProps&#39;.</code> The course describes the React 17 behaviour, where <code>React.FC</code> implicitly added <code>children?: ReactNode</code> — that is what made the silent-blank-content bug possible. React 18\'s types removed it, which broke the opposite way for everyone who had been relying on the implicit prop. The advice that survives both versions: annotate the parameter directly (<code>function Card(props: CardProps)</code>) and put <code>children: ReactNode</code> in the props type only when the component actually renders it.',
            '⚠️ Đo trên <b>@types/react 18.3.31</b> của chính repo này: <code>error TS2322: Type &#39;{ children: string; title: string; }&#39; is not assignable to type &#39;IntrinsicAttributes &amp; CardProps&#39;. Property &#39;children&#39; does not exist on type &#39;IntrinsicAttributes &amp; CardProps&#39;.</code> Giáo trình đang mô tả hành vi của React 17, nơi <code>React.FC</code> ngầm thêm <code>children?: ReactNode</code> — chính điều đó mới tạo ra con bug "nội dung biến mất trong im lặng". Bộ kiểu React 18 đã bỏ nó đi, và cú bỏ ấy lại làm vỡ theo chiều ngược lại với những ai đang dựa vào cái prop ngầm. Lời khuyên sống sót qua cả hai phiên bản: chú thích thẳng tham số (<code>function Card(props: CardProps)</code>) và chỉ đưa <code>children: ReactNode</code> vào kiểu props khi component thật sự render nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Two of these three lines are errors. Which two, and what is the type of <code>inputRef.current</code>?' + code(
              "import { useRef } from 'react';\n" +
              'const inputRef = useRef<HTMLInputElement>(null);\n' +
              '\n' +
              'const a = () =&gt; inputRef.current?.focus();          // A\n' +
              'const b = () =&gt; inputRef.current.focus();           // B\n' +
              'const el: HTMLInputElement = inputRef.current;      // C',
            ),
            'Hai trong ba dòng sau là lỗi. Hai dòng nào, và kiểu của <code>inputRef.current</code> là gì?' + code(
              "import { useRef } from 'react';\n" +
              'const inputRef = useRef<HTMLInputElement>(null);\n' +
              '\n' +
              'const a = () =&gt; inputRef.current?.focus();          // A\n' +
              'const b = () =&gt; inputRef.current.focus();           // B\n' +
              'const el: HTMLInputElement = inputRef.current;      // C',
            ),
          ),
          options: [
            B(
              'A and B — the type argument already promises an <code>HTMLInputElement</code>, so the optional chain in A is a redundant-check error',
              'A và B — tham số kiểu đã hứa là một <code>HTMLInputElement</code>, nên phép optional chain ở A là lỗi kiểm thừa',
            ),
            B(
              'B and C — <code>current</code> is <code>HTMLInputElement | null</code>, because the DOM node does not exist until React attaches it after the first render',
              'B và C — <code>current</code> là <code>HTMLInputElement | null</code>, vì nút DOM chưa tồn tại cho tới khi React gắn nó vào sau lần render đầu tiên',
            ),
            B(
              'A and C — <code>current</code> is <code>HTMLInputElement | undefined</code>, so only the non-optional call in B is safe',
              'A và C — <code>current</code> là <code>HTMLInputElement | undefined</code>, nên chỉ lời gọi không optional ở B mới an toàn',
            ),
            B(
              'None of them — <code>useRef</code> returns a mutable box typed exactly as its type argument, and the <code>null</code> initialiser is ignored',
              'Không dòng nào — <code>useRef</code> trả về một hộp có thể ghi mang đúng kiểu của tham số kiểu, còn giá trị khởi tạo <code>null</code> bị bỏ qua',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>TS18047: &#39;inputRef.current&#39; is possibly &#39;null&#39;.</code> on B and <code>TS2322: Type &#39;HTMLInputElement | null&#39; is not assignable to type &#39;HTMLInputElement&#39;.</code> on C. The <code>| null</code> is not pedantry — it is the type describing a real timing fact: a ref\'s <code>.current</code> is <code>null</code> until React attaches the node after the first render, which is exactly why the idiom is <code>ref.current?.focus()</code>. The sibling rule for <code>useState</code> is the same shape: <code>useState(0)</code> infers <code>number</code> and types the setter to match, but <code>useState(null)</code> would lock the state to <code>null</code> forever — write <code>useState&lt;User | null&gt;(null)</code> so the "not loaded yet" state lives in the type.',
            'Đo được: <code>TS18047: &#39;inputRef.current&#39; is possibly &#39;null&#39;.</code> ở B và <code>TS2322: Type &#39;HTMLInputElement | null&#39; is not assignable to type &#39;HTMLInputElement&#39;.</code> ở C. Cái <code>| null</code> không phải chuyện vặn vẹo — nó là kiểu đang mô tả một sự thật về thời điểm: <code>.current</code> của một ref là <code>null</code> cho tới khi React gắn nút DOM vào sau lần render đầu, và đó chính là lý do cách viết chuẩn là <code>ref.current?.focus()</code>. Quy tắc anh em cho <code>useState</code> cũng cùng hình dạng: <code>useState(0)</code> suy ra <code>number</code> và gõ kiểu cho hàm set khớp theo, còn <code>useState(null)</code> thì khoá trạng thái ở <code>null</code> vĩnh viễn — hãy viết <code>useState&lt;User | null&gt;(null)</code> để trạng thái "chưa tải xong" sống trong kiểu.',
          ),
        }),

        mcq({
          prompt: B(
            'Why does the compiler reject <code>theme.color</code>, and what is the standard fix?' + code(
              "import { createContext, useContext } from 'react';\n" +
              'interface Theme { color: string }\n' +
              'const ThemeContext = createContext<Theme | null>(null);\n' +
              '\n' +
              'function useThemeColor(): string {\n' +
              '  const theme = useContext(ThemeContext);\n' +
              '  return theme.color;\n' +
              '}',
            ),
            'Vì sao trình biên dịch từ chối <code>theme.color</code>, và cách sửa chuẩn là gì?' + code(
              "import { createContext, useContext } from 'react';\n" +
              'interface Theme { color: string }\n' +
              'const ThemeContext = createContext<Theme | null>(null);\n' +
              '\n' +
              'function useThemeColor(): string {\n' +
              '  const theme = useContext(ThemeContext);\n' +
              '  return theme.color;\n' +
              '}',
            ),
          ),
          options: [
            B(
              'TS2532 — <code>useContext</code> always returns <code>T | undefined</code> regardless of the context type, so you must use <code>theme?.color</code>',
              'TS2532 — <code>useContext</code> luôn trả về <code>T | undefined</code> bất kể kiểu của context, nên phải viết <code>theme?.color</code>',
            ),
            B(
              'TS18047 "&#39;theme&#39; is possibly &#39;null&#39;". Fix it by giving <code>createContext</code> a plausible default object instead of <code>null</code>, which removes the union',
              'TS18047 "&#39;theme&#39; is possibly &#39;null&#39;". Sửa bằng cách cho <code>createContext</code> một object mặc định hợp lý thay vì <code>null</code>, làm biến mất cái union',
            ),
            B(
              'TS18047 "&#39;theme&#39; is possibly &#39;null&#39;" — the <code>null</code> default is the "no provider above me" state. Wrap <code>useContext</code> in a hook that throws when it is <code>null</code>; the throw narrows the type for every caller',
              'TS18047 "&#39;theme&#39; is possibly &#39;null&#39;" — giá trị mặc định <code>null</code> chính là trạng thái "phía trên tôi không có provider nào". Hãy bọc <code>useContext</code> trong một hook ném lỗi khi nó là <code>null</code>; lệnh throw thu hẹp kiểu cho mọi người gọi',
            ),
            B(
              'TS2339 — a context created with a <code>null</code> default has no members at all until a provider mounts and supplies the shape',
              'TS2339 — một context tạo với mặc định <code>null</code> không có thành viên nào cho tới khi một provider được gắn và cung cấp hình dạng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>error TS18047: &#39;theme&#39; is possibly &#39;null&#39;.</code>. The union is the design, not an inconvenience: a component rendered outside its provider really does get the default, and that really is a bug worth catching. The fix is one small hook — <code>const t = useContext(ThemeContext); if (!t) throw new Error(&#39;useTheme must be used inside &lt;ThemeProvider&gt;&#39;); return t;</code> — where control-flow analysis after the <code>throw</code> hands every caller a plain <code>Theme</code>, so no consumer ever writes a check. Export the hook and not the context, and the guard cannot be bypassed. The tempting alternative in option B is the actual trap: a plausible default means a component outside the provider gets a working object whose <code>login</code> does nothing — no throw, no error, just a dead button.',
            'Đo được: <code>error TS18047: &#39;theme&#39; is possibly &#39;null&#39;.</code>. Cái union ấy là THIẾT KẾ chứ không phải phiền toái: một component render ngoài provider của nó thật sự nhận giá trị mặc định, và đó thật sự là một con bug đáng bắt. Cách sửa là một hook nhỏ — <code>const t = useContext(ThemeContext); if (!t) throw new Error(&#39;useTheme phải dùng bên trong &lt;ThemeProvider&gt;&#39;); return t;</code> — nơi phân tích luồng điều khiển sau lệnh <code>throw</code> trao cho mọi người gọi một <code>Theme</code> trơn, nên không ai phải viết phép kiểm nữa. Hãy export cái hook chứ đừng export context, thế là không ai lách được cửa. Lựa chọn B nghe hấp dẫn lại chính là cái bẫy thật: một giá trị mặc định "hợp lý" nghĩa là component ngoài provider nhận được một object chạy được mà <code>login</code> của nó chẳng làm gì — không throw, không lỗi, chỉ có một cái nút chết.',
          ),
        }),

        mcq({
          prompt: B(
            'Exactly one of these four reads is an error. Which, and why?' + code(
              "import { ChangeEvent, MouseEvent } from 'react';\n" +
              '\n' +
              'function onChange(e: ChangeEvent<HTMLInputElement>) {\n' +
              '  const a: string = e.target.value;           // A\n' +
              '  const b: string = e.currentTarget.value;    // B\n' +
              '}\n' +
              '\n' +
              'function onDivClick(e: MouseEvent<HTMLDivElement>) {\n' +
              '  const c = e.currentTarget.className;        // C\n' +
              '  const d = e.target.className;               // D\n' +
              '}',
            ),
            'Đúng một trong bốn phép đọc sau là lỗi. Cái nào, và vì sao?' + code(
              "import { ChangeEvent, MouseEvent } from 'react';\n" +
              '\n' +
              'function onChange(e: ChangeEvent<HTMLInputElement>) {\n' +
              '  const a: string = e.target.value;           // A\n' +
              '  const b: string = e.currentTarget.value;    // B\n' +
              '}\n' +
              '\n' +
              'function onDivClick(e: MouseEvent<HTMLDivElement>) {\n' +
              '  const c = e.currentTarget.className;        // C\n' +
              '  const d = e.target.className;               // D\n' +
              '}',
            ),
          ),
          options: [
            B(
              'A — <code>e.target.value</code> is <code>string | null</code> on a controlled input, so it needs a guard',
              'A — <code>e.target.value</code> là <code>string | null</code> trên một controlled input nên cần một chốt kiểm',
            ),
            B(
              'B — <code>currentTarget</code> is the broad <code>EventTarget</code>, and only <code>target</code> is typed by the generic argument',
              'B — <code>currentTarget</code> là <code>EventTarget</code> rộng, chỉ có <code>target</code> mới được gõ kiểu bởi tham số generic',
            ),
            B(
              'C — a <code>MouseEvent</code> on a <code>div</code> has no <code>currentTarget</code>; that member only exists on form events',
              'C — một <code>MouseEvent</code> trên <code>div</code> không có <code>currentTarget</code>; thành viên đó chỉ tồn tại ở sự kiện form',
            ),
            B(
              'D — TS2339 "Property &#39;className&#39; does not exist on type &#39;EventTarget&#39;": <code>target</code> is whatever was actually clicked, which may be any child, so React types it broadly',
              'D — TS2339 "Property &#39;className&#39; does not exist on type &#39;EventTarget&#39;": <code>target</code> là thứ THẬT SỰ bị bấm, có thể là một phần tử con bất kỳ, nên React gõ kiểu nó rất rộng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: one error, <code>TS2339: Property &#39;className&#39; does not exist on type &#39;EventTarget&#39;.</code> on D. <code>currentTarget</code> is the element the handler is ATTACHED to — statically known, so React types it as your generic argument — while <code>target</code> is whatever the event originated on, which on a wrapper element may be any descendant. On an input\'s <code>onChange</code> the two happen to coincide, which is why <code>e.target.value</code> works there and teaches the wrong lesson. Read <code>currentTarget</code> when you mean "the element I bound to", and narrow <code>target</code> with <code>instanceof HTMLInputElement</code> when you genuinely need the origin. And remember the value itself: <code>e.target.value</code> is a <code>string</code> even for <code>&lt;input type=&quot;number&quot;&gt;</code> — the same "it is text, parse it" lesson as Express route params.',
            'Đo được: một lỗi, <code>TS2339: Property &#39;className&#39; does not exist on type &#39;EventTarget&#39;.</code> ở D. <code>currentTarget</code> là phần tử mà handler được GẮN vào — biết trước một cách tĩnh, nên React gõ kiểu nó bằng chính tham số generic của bạn — còn <code>target</code> là nơi sự kiện thật sự bắt nguồn, mà trên một phần tử bao ngoài thì đó có thể là bất kỳ con cháu nào. Ở <code>onChange</code> của một input thì hai thứ tình cờ trùng nhau, và đó là lý do <code>e.target.value</code> chạy được ở đó rồi dạy người ta bài học sai. Hãy đọc <code>currentTarget</code> khi bạn muốn nói "phần tử tôi gắn vào", và thu hẹp <code>target</code> bằng <code>instanceof HTMLInputElement</code> khi thật sự cần nơi phát sinh. Và nhớ luôn giá trị: <code>e.target.value</code> là <code>string</code> kể cả với <code>&lt;input type=&quot;number&quot;&gt;</code> — đúng bài học "nó là chữ, phải parse" như tham số route của Express.',
          ),
        }),

        mcq({
          prompt: B(
            'One of these two elements fails. Which, and what does that show about a generic component?' + code(
              'interface ListProps<T> { items: T[]; render: (item: T) =&gt; ReactNode }\n' +
              'function List<T>({ items, render }: ListProps<T>) { /* … */ }\n' +
              '\n' +
              'const a = <List items={[1, 2, 3]} render={(n) =&gt; n.toFixed(0)} />;      // A\n' +
              'const b = <List items={[1, 2, 3]} render={(n) =&gt; n.toUpperCase()} />;  // B',
            ),
            'Một trong hai phần tử sau hỏng. Cái nào, và điều đó cho thấy gì về một component generic?' + code(
              'interface ListProps<T> { items: T[]; render: (item: T) =&gt; ReactNode }\n' +
              'function List<T>({ items, render }: ListProps<T>) { /* … */ }\n' +
              '\n' +
              'const a = <List items={[1, 2, 3]} render={(n) =&gt; n.toFixed(0)} />;      // A\n' +
              'const b = <List items={[1, 2, 3]} render={(n) =&gt; n.toUpperCase()} />;  // B',
            ),
          ),
          options: [
            B(
              'B — TS2339 "Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;". <code>T</code> was inferred as <code>number</code> from <code>items</code>, and that inference flows into the <code>render</code> callback',
              'B — TS2339 "Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;". <code>T</code> được suy ra là <code>number</code> từ <code>items</code>, và phép suy luận ấy chảy vào callback <code>render</code>',
            ),
            B(
              'A — a generic component cannot infer <code>T</code> from JSX attributes, so <code>T</code> falls back to <code>unknown</code> and no method call is allowed on it',
              'A — component generic không suy ra được <code>T</code> từ thuộc tính JSX nên <code>T</code> rơi về <code>unknown</code> và không phương thức nào gọi được trên nó',
            ),
            B(
              'Both — a component may not declare a type parameter; only plain functions can, which is why <code>ListProps&lt;T&gt;</code> has to be used with an explicit argument',
              'Cả hai — component không được khai tham số kiểu; chỉ hàm thường mới được, nên <code>ListProps&lt;T&gt;</code> buộc phải dùng với đối số tường minh',
            ),
            B(
              'Neither — <code>render</code> returns <code>ReactNode</code>, and every value is assignable to <code>ReactNode</code>, so the callback body is never checked',
              'Không cái nào — <code>render</code> trả về <code>ReactNode</code>, mà mọi giá trị đều gán được cho <code>ReactNode</code>, nên thân callback không bao giờ bị kiểm',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: one error, <code>TS2339: Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;.</code> on B. Components take type parameters exactly like the generic functions of chapter 6, and inference works exactly the same way: from <code>items={[1, 2, 3]}</code> the compiler solves <code>T = number</code> for that element, so inside <code>render</code> the parameter <code>n</code> is a <code>number</code> — <code>toFixed</code> is fine, <code>toUpperCase</code> is not. Pass a <code>User[]</code> instead and the same component hands <code>render</code> a <code>User</code>. One component, correctly typed for every element type, and a typo in a row renderer is caught against the real row type.',
            'Đo được: một lỗi, <code>TS2339: Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;.</code> ở B. Component nhận tham số kiểu y hệt các hàm generic của chương 6, và suy luận cũng chạy y hệt: từ <code>items={[1, 2, 3]}</code> trình biên dịch giải ra <code>T = number</code> cho phần tử đó, nên bên trong <code>render</code> tham số <code>n</code> là một <code>number</code> — <code>toFixed</code> thì được, <code>toUpperCase</code> thì không. Truyền vào một <code>User[]</code> thì cũng component ấy trao cho <code>render</code> một <code>User</code>. Một component, gõ kiểu đúng cho mọi kiểu phần tử, và một lỗi gõ nhầm trong hàm vẽ dòng bị bắt ngay bằng chính kiểu dòng thật.',
          ),
        }),

        // ── Chương 13 — Zod & Prisma ────────────────────────────────────
        mcq({
          prompt: B(
            'A schema offers two ways to run it. Which pairing of tool to job is right?' + code(
              'const S = z.object({ id: z.number(), name: z.string() });\n' +
              '\n' +
              'S.parse(raw);       // A\n' +
              'S.safeParse(raw);   // B',
            ),
            'Một schema cho hai cách chạy nó. Cách ghép công cụ với công việc nào là ĐÚNG?' + code(
              'const S = z.object({ id: z.number(), name: z.string() });\n' +
              '\n' +
              'S.parse(raw);       // A\n' +
              'S.safeParse(raw);   // B',
            ),
          ),
          options: [
            B(
              'They are interchangeable: <code>safeParse</code> is just <code>parse</code> wrapped in a try/catch, so use whichever reads better at the call site',
              'Hai cái thay thế nhau được: <code>safeParse</code> chỉ là <code>parse</code> bọc trong try/catch, nên dùng cái nào đọc thuận hơn ở chỗ gọi',
            ),
            B(
              'A returns <code>T</code> or throws a <code>ZodError</code> — right for startup config, where bad input should kill the process loudly. B returns a discriminated union you narrow on <code>success</code> — right for a request body, where a 400 is an expected outcome, not an exception',
              'A trả về <code>T</code> hoặc ném <code>ZodError</code> — hợp cho cấu hình lúc khởi động, nơi dữ liệu sai nên giết tiến trình một cách ồn ào. B trả về một union có trường phân biệt để bạn thu hẹp theo <code>success</code> — hợp cho thân request, nơi một mã 400 là kết quả dự kiến chứ không phải ngoại lệ',
            ),
            B(
              'A is for objects and B is for primitives; a <code>z.object</code> schema only supports <code>parse</code>',
              'A dành cho object còn B dành cho primitive; một schema <code>z.object</code> chỉ hỗ trợ <code>parse</code>',
            ),
            B(
              'B is always preferable: <code>parse</code> is deprecated because throwing on invalid input loses the field-level detail that <code>error.issues</code> carries',
              'B luôn tốt hơn: <code>parse</code> đã bị khai tử vì ném lỗi trên dữ liệu sai làm mất phần chi tiết theo từng trường mà <code>error.issues</code> mang theo',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both are current and both are right — for different jobs. <code>safeParse</code> returns <code>{ success: true; data: T } | { success: false; error: ZodError }</code>, which is chapter 5\'s discriminated union guarding real input: you cannot read <code>data</code> until you have checked <code>success</code>, so "handle the invalid case" is mandatory rather than polite. That is what you want in a route — bad client input is an expected outcome, and returning it as a value keeps it out of your error middleware and your error logs. <code>parse</code> throwing is what you want at boot, where an invalid config should stop the process with a clear message instead of surfacing three requests later. And the failure branch is structured: <code>error.issues</code> carries a <code>path</code> and a <code>message</code> per field, which is enough to build a field-level 400 the frontend can attach to an input.',
            'Cả hai đều còn dùng và đều đúng — cho hai việc khác nhau. <code>safeParse</code> trả về <code>{ success: true; data: T } | { success: false; error: ZodError }</code>, tức union có trường phân biệt của chương 5 đang canh dữ liệu thật: bạn không đọc được <code>data</code> cho tới khi đã kiểm <code>success</code>, nên "xử lý ca dữ liệu sai" là bắt buộc chứ không phải phép lịch sự. Đó đúng là thứ bạn muốn trong một route — dữ liệu sai từ client là kết quả dự kiến, và trả nó về dưới dạng GIÁ TRỊ giữ nó nằm ngoài middleware lỗi và ngoài log lỗi của bạn. Còn <code>parse</code> ném lỗi mới là thứ bạn muốn lúc khởi động, nơi một cấu hình sai nên chặn tiến trình lại kèm thông báo rõ ràng thay vì lộ ra sau ba request nữa. Và nhánh thất bại có cấu trúc: <code>error.issues</code> mang theo <code>path</code> và <code>message</code> cho từng trường, đủ để dựng một phản hồi 400 theo từng ô mà frontend gắn thẳng vào input được.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Zod 3.25.76. What does each line print?' + code(
              "const S = z.object({ title: z.string() });\n" +
              "console.log(JSON.stringify(S.parse({ title: 'Hi', tags: ['a'], extra: 1 })));\n" +
              '\n' +
              "const Strict = z.object({ title: z.string() }).strict();\n" +
              "const r = Strict.safeParse({ title: 'Hi', tags: [] });\n" +
              'console.log(r.success);',
            ),
            'Chạy thật trên Zod 3.25.76. Mỗi dòng in ra gì?' + code(
              "const S = z.object({ title: z.string() });\n" +
              "console.log(JSON.stringify(S.parse({ title: 'Hi', tags: ['a'], extra: 1 })));\n" +
              '\n' +
              "const Strict = z.object({ title: z.string() }).strict();\n" +
              "const r = Strict.safeParse({ title: 'Hi', tags: [] });\n" +
              'console.log(r.success);',
            ),
          ),
          options: [
            B(
              '<code>{&quot;title&quot;:&quot;Hi&quot;,&quot;tags&quot;:[&quot;a&quot;],&quot;extra&quot;:1}</code> then <code>true</code> — Zod keeps every key it was given and <code>.strict()</code> only affects value types',
              '<code>{&quot;title&quot;:&quot;Hi&quot;,&quot;tags&quot;:[&quot;a&quot;],&quot;extra&quot;:1}</code> rồi <code>true</code> — Zod giữ mọi khoá nó nhận và <code>.strict()</code> chỉ ảnh hưởng tới kiểu của GIÁ TRỊ',
            ),
            B(
              'It throws on the first line: an unknown key is a validation failure by default, which is what <code>.strict()</code> would relax',
              'Nó ném lỗi ngay dòng đầu: khoá lạ mặc định là một lỗi kiểm dữ liệu, và <code>.strict()</code> mới là thứ nới lỏng điều đó',
            ),
            B(
              '<code>{&quot;title&quot;:&quot;Hi&quot;}</code> then <code>false</code> — a plain <code>z.object</code> STRIPS unknown keys, and <code>.strict()</code> makes them an <code>unrecognized_keys</code> issue instead',
              '<code>{&quot;title&quot;:&quot;Hi&quot;}</code> rồi <code>false</code> — một <code>z.object</code> thường CẮT BỎ các khoá lạ, còn <code>.strict()</code> biến chúng thành một issue <code>unrecognized_keys</code>',
            ),
            B(
              '<code>{&quot;title&quot;:&quot;Hi&quot;}</code> then <code>true</code> — both forms strip unknown keys; <code>.strict()</code> only changes the inferred TypeScript type',
              '<code>{&quot;title&quot;:&quot;Hi&quot;}</code> rồi <code>true</code> — cả hai dạng đều cắt khoá lạ; <code>.strict()</code> chỉ đổi kiểu TypeScript được suy ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Run for real: <code>{&quot;title&quot;:&quot;Hi&quot;}</code>, then <code>false</code> with <code>r.error.issues[0].code === &#39;unrecognized_keys&#39;</code>. Stripping is the default and it is the mechanism behind the chapter\'s worst trap: declare <code>interface CreateNote { title: string; tags: string[] }</code> by hand next to a schema that forgot <code>tags</code>, and the schema silently removes <code>tags</code> while the type still promises it — <code>note.tags.length</code> then throws on a request that validated <b>successfully</b>. Two sources of truth that agree today. Derive one from the other (<code>type CreateNote = z.infer&lt;typeof createNote&gt;</code>) so adding a field to the schema updates the type in the same edit.',
            'Chạy thật: <code>{&quot;title&quot;:&quot;Hi&quot;}</code>, rồi <code>false</code> với <code>r.error.issues[0].code === &#39;unrecognized_keys&#39;</code>. Cắt khoá lạ là hành vi mặc định, và đó chính là cơ chế đằng sau cái bẫy tệ nhất của chương này: khai tay <code>interface CreateNote { title: string; tags: string[] }</code> cạnh một schema quên mất <code>tags</code>, thế là schema lặng lẽ gỡ <code>tags</code> đi trong khi kiểu vẫn hứa là có — rồi <code>note.tags.length</code> ném lỗi trên một request đã kiểm dữ liệu <b>THÀNH CÔNG</b>. Hai nguồn sự thật hôm nay còn đồng ý với nhau. Hãy suy cái này ra từ cái kia (<code>type CreateNote = z.infer&lt;typeof createNote&gt;</code>) để thêm một trường vào schema là kiểu cập nhật ngay trong cùng một lần sửa.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Zod 3.25.76. What are <code>Out</code> and <code>In</code>?' + code(
              'const S = z.object({\n' +
              '  port: z.coerce.number().default(3000),\n' +
              '  name: z.string(),\n' +
              '});\n' +
              'type Out = z.infer<typeof S>;\n' +
              'type In  = z.input<typeof S>;',
            ),
            'Đo trên Zod 3.25.76. <code>Out</code> và <code>In</code> là gì?' + code(
              'const S = z.object({\n' +
              '  port: z.coerce.number().default(3000),\n' +
              '  name: z.string(),\n' +
              '});\n' +
              'type Out = z.infer<typeof S>;\n' +
              'type In  = z.input<typeof S>;',
            ),
          ),
          options: [
            B(
              'Both are <code>{ port: number; name: string }</code> — <code>z.input</code> and <code>z.infer</code> are two names for the same type',
              'Cả hai đều là <code>{ port: number; name: string }</code> — <code>z.input</code> và <code>z.infer</code> là hai tên của cùng một kiểu',
            ),
            B(
              '<code>Out</code> is <code>{ port: number; name: string }</code> and <code>In</code> is <code>{ port: string; name: string }</code> — <code>z.input</code> reflects the coercion, so the input side is text',
              '<code>Out</code> là <code>{ port: number; name: string }</code> còn <code>In</code> là <code>{ port: string; name: string }</code> — <code>z.input</code> phản ánh phép ép kiểu nên phía đầu vào là chữ',
            ),
            B(
              '<code>Out</code> is <code>{ port?: number; name: string }</code> — a field with a default is optional on the output too, since the default may not have been applied',
              '<code>Out</code> là <code>{ port?: number; name: string }</code> — một trường có giá trị mặc định thì ở đầu ra cũng là tuỳ chọn, vì có thể mặc định chưa được áp',
            ),
            B(
              '<code>Out</code> is <code>{ port: number; name: string }</code> and <code>In</code> is <code>{ name: string; port?: number | undefined }</code> — <code>z.input</code> reflects the <code>.default()</code> but NOT the <code>.coerce</code>',
              '<code>Out</code> là <code>{ port: number; name: string }</code> còn <code>In</code> là <code>{ name: string; port?: number | undefined }</code> — <code>z.input</code> phản ánh <code>.default()</code> nhưng KHÔNG phản ánh <code>.coerce</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            '⚠️ Measured, by forcing the compiler to print both: <code>Out</code> is <code>{ port: number; name: string }</code> and <code>In</code> is <code>{ name: string; port?: number | undefined }</code>. So <code>z.input</code> does capture the optionality that <code>.default()</code> creates — the useful half — but it does NOT say the input may be a string, even though at runtime <code>S.parse({ port: &#39;8080&#39;, name: &#39;x&#39; })</code> really does return <code>{&quot;port&quot;:8080,&quot;name&quot;:&quot;x&quot;}</code>. Read the course\'s "use <code>z.input</code> for what goes in" as being about defaults and optionality, not about coercion. The rule that survives: the type belongs to the PARSED result, not to the raw request — use <code>z.infer</code> on what comes out of <code>parse</code>, and keep the raw side as <code>unknown</code>.',
            '⚠️ Đo bằng cách ép trình biên dịch in cả hai ra: <code>Out</code> là <code>{ port: number; name: string }</code> còn <code>In</code> là <code>{ name: string; port?: number | undefined }</code>. Tức <code>z.input</code> CÓ bắt được tính tuỳ chọn do <code>.default()</code> sinh ra — nửa hữu ích — nhưng nó KHÔNG nói rằng đầu vào có thể là chuỗi, dù lúc chạy thì <code>S.parse({ port: &#39;8080&#39;, name: &#39;x&#39; })</code> thật sự trả về <code>{&quot;port&quot;:8080,&quot;name&quot;:&quot;x&quot;}</code>. Hãy đọc câu "dùng <code>z.input</code> cho thứ đi vào" của giáo trình theo nghĩa giá trị mặc định và tính tuỳ chọn, chứ không phải theo nghĩa ép kiểu. Quy tắc sống sót: kiểu thuộc về KẾT QUẢ ĐÃ PARSE chứ không thuộc về request thô — hãy dùng <code>z.infer</code> cho thứ đi ra từ <code>parse</code>, và giữ phía thô ở <code>unknown</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'The Prisma schema declares <code>fullName String?</code>. What does the compiler say, and why?' + code(
              "import { User } from '@prisma/client';\n" +
              '\n' +
              'function greet(user: User): string {\n' +
              '  const name: string = user.fullName;\n' +
              "  return 'Hi ' + name;\n" +
              '}',
            ),
            'Schema Prisma khai <code>fullName String?</code>. Trình biên dịch nói gì, và vì sao?' + code(
              "import { User } from '@prisma/client';\n" +
              '\n' +
              'function greet(user: User): string {\n' +
              '  const name: string = user.fullName;\n' +
              "  return 'Hi ' + name;\n" +
              '}',
            ),
          ),
          options: [
            B(
              'TS2322 "Type &#39;string | null&#39; is not assignable to type &#39;string&#39;" — an optional column becomes <code>T | null</code> in the generated client, so the strict-null discipline reaches the database boundary',
              'TS2322 "Type &#39;string | null&#39; is not assignable to type &#39;string&#39;" — một cột tuỳ chọn thành <code>T | null</code> trong client sinh ra, nên kỷ luật strict-null vươn tới tận ranh giới cơ sở dữ liệu',
            ),
            B(
              'TS18048 "&#39;user.fullName&#39; is possibly &#39;undefined&#39;" — <code>String?</code> maps to an optional property, not to a nullable one',
              'TS18048 "&#39;user.fullName&#39; is possibly &#39;undefined&#39;" — <code>String?</code> ánh xạ thành một thuộc tính tuỳ chọn chứ không phải một thuộc tính nullable',
            ),
            B(
              'Nothing — Prisma types every column as its base type and leaves nullability to your own runtime checks',
              'Không lỗi — Prisma gõ kiểu mọi cột bằng kiểu cơ sở của nó và để chuyện null lại cho phép kiểm lúc chạy của bạn',
            ),
            B(
              'TS2339 — <code>User</code> is only a value namespace in the generated client; the row type is <code>Prisma.UserRow</code>',
              'TS2339 — <code>User</code> chỉ là một không gian tên GIÁ TRỊ trong client sinh ra; kiểu của một dòng là <code>Prisma.UserRow</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured against this repo\'s generated client, both lines: <code>TS2322: Type &#39;string | null&#39; is not assignable to type &#39;string&#39;.</code> then <code>Type &#39;null&#39; is not assignable to type &#39;string&#39;.</code>. <code>schema.prisma</code> is the single source: change a column to nullable, run <code>prisma generate</code>, and every place that assumed it was non-null lights up. That is the whole reason nothing in a Prisma codebase should hand-write a row interface — a hand-written copy is a second declaration that happens to agree until the next migration. Import the model type (<code>import type { User } from &#39;@prisma/client&#39;</code>) and let the generator be the only author.',
            'Đo trên client sinh sẵn của chính repo này, đủ cả hai dòng: <code>TS2322: Type &#39;string | null&#39; is not assignable to type &#39;string&#39;.</code> rồi <code>Type &#39;null&#39; is not assignable to type &#39;string&#39;.</code>. <code>schema.prisma</code> là nguồn duy nhất: đổi một cột thành nullable, chạy <code>prisma generate</code>, và mọi chỗ từng cho rằng nó không null đều đỏ lên. Đó chính là lý do trong một kho mã dùng Prisma thì không ai nên viết tay một interface cho dòng dữ liệu — bản chép tay là một khai báo thứ hai, tình cờ đồng ý với bản gốc cho tới lần migration kế tiếp. Hãy import kiểu model (<code>import type { User } from &#39;@prisma/client&#39;</code>) và để bộ sinh mã là tác giả duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'A query selects two columns. What is the error, and what does the message quote?' + code(
              "import { Prisma } from '@prisma/client';\n" +
              '\n' +
              'type UserPreview = Prisma.UserGetPayload<{ select: { id: true; username: true } }>;\n' +
              'declare const p: UserPreview;\n' +
              'console.log(p.email);',
            ),
            'Một truy vấn chọn hai cột. Lỗi là gì, và thông báo trích ra cái gì?' + code(
              "import { Prisma } from '@prisma/client';\n" +
              '\n' +
              'type UserPreview = Prisma.UserGetPayload<{ select: { id: true; username: true } }>;\n' +
              'declare const p: UserPreview;\n' +
              'console.log(p.email);',
            ),
          ),
          options: [
            B(
              'TS2551 "Property &#39;email&#39; does not exist… Did you mean &#39;emailVerified&#39;?" — <code>GetPayload</code> keeps every model column and only marks the unselected ones optional',
              'TS2551 "Property &#39;email&#39; does not exist… Did you mean &#39;emailVerified&#39;?" — <code>GetPayload</code> giữ mọi cột của model và chỉ đánh dấu những cột không chọn là tuỳ chọn',
            ),
            B(
              'TS2339 "Property &#39;email&#39; does not exist on type &#39;{ id: number; username: string; }&#39;" — the message quotes the exact shape the query returns, not the whole table',
              'TS2339 "Property &#39;email&#39; does not exist on type &#39;{ id: number; username: string; }&#39;" — thông báo trích đúng hình dạng mà truy vấn trả về, không phải cả bảng',
            ),
            B(
              'No error — <code>GetPayload</code> types the query options, not the result, so <code>p</code> is the full <code>User</code> model',
              'Không lỗi — <code>GetPayload</code> gõ kiểu cho các tuỳ chọn truy vấn chứ không phải kết quả, nên <code>p</code> là model <code>User</code> đầy đủ',
            ),
            B(
              'TS2344 — <code>select</code> requires every column of the model to be listed, so the type argument itself is rejected before <code>p.email</code> is reached',
              'TS2344 — <code>select</code> đòi liệt kê mọi cột của model, nên chính tham số kiểu bị từ chối trước khi tới được <code>p.email</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>error TS2339: Property &#39;email&#39; does not exist on type &#39;{ id: number; username: string; }&#39;.</code> — read the quoted type, because that is the point of the whole helper: the type of a query result matches what THAT query actually returns, not the whole table. So a route that selects a few columns cannot accidentally reference one it never fetched, and annotating that narrow result as the full <code>User</code> would be a widening lie the compiler would then believe. One operational reminder from the same lesson: <code>prisma generate</code> is what writes those <code>.d.ts</code> files — skip it after editing the schema and your types are describing the previous database.',
            'Đo được: <code>error TS2339: Property &#39;email&#39; does not exist on type &#39;{ id: number; username: string; }&#39;.</code> — hãy đọc cái kiểu trong dấu nháy, vì đó là toàn bộ ý nghĩa của helper này: kiểu của kết quả truy vấn khớp với thứ mà CHÍNH truy vấn ấy trả về, không phải cả bảng. Nhờ vậy một route chỉ chọn vài cột thì không thể lỡ tay tham chiếu một cột chưa bao giờ lấy về, và chú thích kết quả hẹp ấy là <code>User</code> đầy đủ sẽ là một lời nói dối nới rộng mà trình biên dịch sẽ tin theo. Một nhắc nhở vận hành từ cùng bài học: chính <code>prisma generate</code> mới là thứ ghi ra những file <code>.d.ts</code> đó — bỏ qua bước này sau khi sửa schema là kiểu của bạn đang mô tả cơ sở dữ liệu cũ.',
          ),
        }),

        mcq({
          prompt: B(
            'This repo renamed the Prisma enum value <code>ContentType.CODE</code> to <code>CODE_REVIEW</code>. <code>tsc --noEmit</code> passed, the whole pre-push checklist passed, and the database seed still broke on production. What were the two failures that had to line up?',
            'Repo này từng đổi tên giá trị enum Prisma <code>ContentType.CODE</code> thành <code>CODE_REVIEW</code>. <code>tsc --noEmit</code> qua, cả bộ kiểm trước khi push qua, mà seed cơ sở dữ liệu vẫn vỡ trên production. Hai chỗ hỏng phải trùng nhau là gì?',
          ),
          options: [
            B(
              'A migration was applied out of order, so the enum value existed in the database under its old name while the generated client already used the new one — and the seed inserted rows the client could no longer represent',
              'Một migration được áp sai thứ tự, nên giá trị enum tồn tại trong cơ sở dữ liệu dưới tên cũ trong khi client sinh ra đã dùng tên mới — và seed chèn vào những dòng mà client không còn biểu diễn nổi',
            ),
            B(
              'The rename was applied to <code>schema.prisma</code> and <code>prisma generate</code> was never run, so <code>@prisma/client</code> kept exporting the old member and every file in the project — the seed included — went on compiling happily against the stale generated types',
              'Việc đổi tên được áp vào <code>schema.prisma</code> mà không ai chạy <code>prisma generate</code>, nên <code>@prisma/client</code> vẫn export thành viên cũ và mọi file trong dự án — kể cả seed — cứ thế biên dịch vui vẻ với bộ kiểu sinh ra đã cũ',
            ),
            B(
              'The seed script carried a HAND-WRITTEN copy of the union instead of importing it from <code>@prisma/client</code> — so it type-checked against its own stale definition — and the file was outside the tsconfig that ran, sitting in <code>exclude</code> because <code>rootDir</code> is <code>./src</code>',
              'Script seed mang một bản CHÉP TAY của union thay vì import từ <code>@prisma/client</code> — nên nó tự kiểm với chính định nghĩa cũ của mình — và file ấy lại nằm ngoài tsconfig đang chạy, ngồi trong <code>exclude</code> vì <code>rootDir</code> là <code>./src</code>',
            ),
            B(
              'The seed ran inside a stale Docker image built before the rename, so the container still held the previous seed script and the previous generated client — the enum rename needed a rebuild and a redeploy rather than any change to the code',
              'Seed chạy bên trong một ảnh Docker cũ dựng từ trước khi đổi tên, nên container vẫn giữ script seed cũ và client sinh ra cũ — việc đổi tên enum cần dựng lại ảnh và deploy lại chứ không cần sửa dòng mã nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both halves were needed, and either alone would have been caught. The seed file declared its own union — <code>&#39;VLOG&#39; | … | &#39;CODE&#39; | …</code> — so it was checking itself against itself and could not notice the rename. And the main <code>tsconfig.json</code> sets <code>rootDir: &quot;./src&quot;</code>, which is precisely why <code>prisma/**</code> could not be in its <code>include</code> and ended up in <code>exclude</code> instead — so <code>tsc --noEmit</code> never opened the file at all. The two fixes are the two lessons: import generated types instead of copying them (a hand-written duplicate is not a type check, it is a second declaration that agrees until it does not), and make sure the file you care about is actually inside a tsconfig that runs — this repo added a second config and a <code>typecheck:seed</code> script for exactly that.',
            'Cần cả hai nửa, và riêng một nửa thì đã bị bắt. File seed tự khai union của nó — <code>&#39;VLOG&#39; | … | &#39;CODE&#39; | …</code> — nên nó tự kiểm với chính mình và không thể nhận ra việc đổi tên. Còn <code>tsconfig.json</code> chính đặt <code>rootDir: &quot;./src&quot;</code>, và đó đúng là lý do <code>prisma/**</code> không thể nằm trong <code>include</code> của nó mà rơi vào <code>exclude</code> — nên <code>tsc --noEmit</code> chưa từng mở file đó ra. Hai cách sửa chính là hai bài học: import kiểu do bộ sinh mã tạo ra thay vì chép nó (một bản chép tay không phải một phép kiểm kiểu, nó là một khai báo thứ hai đồng ý với bản gốc cho tới khi hết đồng ý), và phải chắc chắn file bạn quan tâm thật sự nằm trong một tsconfig ĐANG CHẠY — repo này đã thêm hẳn một config thứ hai và một script <code>typecheck:seed</code> cho đúng chuyện đó.',
          ),
        }),

        // ── Chương 14 — Class & decorator ───────────────────────────────
        mcq({
          prompt: B(
            'How many errors, and what are their codes?' + code(
              'class BankAccount {\n' +
              '  private balance = 0;\n' +
              '  constructor(public readonly owner: string) {}\n' +
              '  deposit(n: number) { this.balance += n; }\n' +
              '}\n' +
              "const acc = new BankAccount('Ada');\n" +
              'acc.deposit(100);\n' +
              'console.log(acc.balance);   // A\n' +
              "acc.owner = 'Bob';          // B",
            ),
            'Bao nhiêu lỗi, và mã lỗi là gì?' + code(
              'class BankAccount {\n' +
              '  private balance = 0;\n' +
              '  constructor(public readonly owner: string) {}\n' +
              '  deposit(n: number) { this.balance += n; }\n' +
              '}\n' +
              "const acc = new BankAccount('Ada');\n" +
              'acc.deposit(100);\n' +
              'console.log(acc.balance);   // A\n' +
              "acc.owner = 'Bob';          // B",
            ),
          ),
          options: [
            B(
              'One, on A only. <code>readonly</code> on a parameter property applies to the constructor argument, not to the resulting field, so B is a normal assignment',
              'Một lỗi, chỉ ở A. <code>readonly</code> trên một parameter property áp cho ĐỐI SỐ của hàm khởi tạo chứ không cho trường sinh ra, nên B là phép gán bình thường',
            ),
            B(
              'One, on B only. <code>private</code> is erased before the code runs, so reading <code>acc.balance</code> is allowed and simply prints 100',
              'Một lỗi, chỉ ở B. <code>private</code> bị xoá trước khi mã chạy, nên đọc <code>acc.balance</code> được phép và chỉ đơn giản in ra 100',
            ),
            B(
              'Three — <code>deposit</code> is also an error, because a method may not write to a <code>private</code> field declared with an initialiser',
              'Ba lỗi — <code>deposit</code> cũng lỗi, vì một phương thức không được ghi vào một trường <code>private</code> đã khai kèm giá trị khởi tạo',
            ),
            B(
              'Two: TS2341 on A ("Property &#39;balance&#39; is private and only accessible within class &#39;BankAccount&#39;") and TS2540 on B ("Cannot assign to &#39;owner&#39; because it is a read-only property")',
              'Hai lỗi: TS2341 ở A ("Property &#39;balance&#39; is private and only accessible within class &#39;BankAccount&#39;") và TS2540 ở B ("Cannot assign to &#39;owner&#39; because it is a read-only property")',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, exactly two: <code>TS2341</code> on A and <code>TS2540</code> on B. Two things are happening in one small class. <code>private</code> is a compile-time rule about who may reach a member — <code>deposit</code> is inside the class so it writes <code>balance</code> freely, and the outside world cannot read it. <code>public readonly owner</code> is a parameter property: the modifier turns the constructor argument into a class field, declared and assigned in one stroke, and <code>readonly</code> makes that field settable at construction and never again. Both are erased from the emitted JavaScript — which is the next question\'s subject.',
            'Đo được, đúng hai lỗi: <code>TS2341</code> ở A và <code>TS2540</code> ở B. Có hai chuyện đang diễn ra trong một class bé xíu. <code>private</code> là một quy tắc lúc biên dịch về việc AI được chạm tới một thành viên — <code>deposit</code> nằm trong class nên nó ghi <code>balance</code> thoải mái, còn bên ngoài thì không đọc được. <code>public readonly owner</code> là một parameter property: bổ ngữ biến đối số của hàm khởi tạo thành một trường của class, vừa khai vừa gán trong một nhát, và <code>readonly</code> làm trường ấy đặt được lúc khởi tạo rồi thôi vĩnh viễn. Cả hai đều bị xoá khỏi JavaScript sinh ra — và đó là đề tài của câu tiếp theo.',
          ),
        }),

        mcq({
          prompt: B(
            'Both classes hide a field. Which statement about the difference is right?' + code(
              "class TsPrivate  { private secret = 'S1'; }\n" +
              "class HashPrivate { #secret = 'S2'; }\n" +
              '\n' +
              'const a = new TsPrivate();\n' +
              'const b = new HashPrivate();\n' +
              '\n' +
              'console.log(b.#secret);                                        // A (compile)\n' +
              'console.log((a as unknown as Record<string, string>).secret);   // B (run)\n' +
              'console.log((b as unknown as Record<string, string>).secret);   // C (run)',
            ),
            'Cả hai class đều giấu một trường. Phát biểu nào về khác biệt là ĐÚNG?' + code(
              "class TsPrivate  { private secret = 'S1'; }\n" +
              "class HashPrivate { #secret = 'S2'; }\n" +
              '\n' +
              'const a = new TsPrivate();\n' +
              'const b = new HashPrivate();\n' +
              '\n' +
              'console.log(b.#secret);                                        // A (biên dịch)\n' +
              'console.log((a as unknown as Record<string, string>).secret);   // B (chạy)\n' +
              'console.log((b as unknown as Record<string, string>).secret);   // C (chạy)',
            ),
          ),
          options: [
            B(
              'A is TS18013 ("not accessible outside class … because it has a private identifier"), B prints <code>S1</code>, and C prints <code>undefined</code> — only <code>#</code> survives a cast',
              'A là TS18013 ("not accessible outside class … because it has a private identifier"), B in ra <code>S1</code>, còn C in ra <code>undefined</code> — chỉ <code>#</code> mới sống sót qua một phép ép kiểu',
            ),
            B(
              'A is TS2341, the same code as a TypeScript <code>private</code>, and both B and C print <code>undefined</code>',
              'A là TS2341, cùng mã lỗi với <code>private</code> của TypeScript, và cả B lẫn C đều in <code>undefined</code>',
            ),
            B(
              'A compiles — <code>#</code> is only a naming convention — and both B and C print their values',
              'A biên dịch được — <code>#</code> chỉ là quy ước đặt tên — và cả B lẫn C đều in ra giá trị của mình',
            ),
            B(
              'A is TS18013, and both B and C print <code>undefined</code>, because a cast cannot resurrect a field the compiler removed',
              'A là TS18013, và cả B lẫn C đều in <code>undefined</code>, vì một phép ép kiểu không thể làm sống lại một trường mà trình biên dịch đã gỡ bỏ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'All three measured. A: <code>error TS18013: Property &#39;#secret&#39; is not accessible outside class &#39;HashPrivate&#39; because it has a private identifier.</code> B prints <code>S1</code> and C prints <code>undefined</code>. That is the whole distinction: <code>private</code> is a promise to your team and to the compiler, erased before the code runs, so the field is an ordinary property at runtime — it shows in <code>Object.keys</code>, in <code>JSON.stringify</code>, in your logs, and any cast reaches it. <code>#secret</code> is a real JavaScript feature the engine enforces; it appears in neither <code>Object.keys</code> nor <code>JSON.stringify</code>. Use <code>#</code> when the secret must not leave the process, and do not rely on the class shape at all for what you serialise: build the response from an explicit <code>Pick</code>-based DTO.',
            'Cả ba đều đã đo. A: <code>error TS18013: Property &#39;#secret&#39; is not accessible outside class &#39;HashPrivate&#39; because it has a private identifier.</code> B in <code>S1</code>, C in <code>undefined</code>. Đó là toàn bộ khác biệt: <code>private</code> là một lời hứa với đồng đội và với trình biên dịch, bị xoá trước khi mã chạy, nên lúc chạy nó chỉ là một thuộc tính bình thường — nó hiện ra trong <code>Object.keys</code>, trong <code>JSON.stringify</code>, trong log của bạn, và một phép ép kiểu bất kỳ cũng với tới. <code>#secret</code> là một tính năng JavaScript thật do chính engine cưỡng chế; nó không hiện ra trong <code>Object.keys</code> lẫn <code>JSON.stringify</code>. Hãy dùng <code>#</code> khi bí mật không được rời khỏi tiến trình, và tuyệt đối đừng dựa vào hình dạng của class cho thứ bạn tuần tự hoá: hãy dựng phản hồi từ một DTO tường minh làm bằng <code>Pick</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Under <code>--strict</code>, what does this produce, and why does the fix in the comment work?' + code(
              'interface Store { put(key: string, body: string): Promise<void> }\n' +
              '\n' +
              'class R2Storage implements Store {\n' +
              '  async put(key, body) { console.log(key, body); }\n' +
              '}\n' +
              '\n' +
              '// no error at all:\n' +
              'const good: Store = {\n' +
              '  async put(key, body) { console.log(key, body); },\n' +
              '};',
            ),
            'Dưới <code>--strict</code>, đoạn này cho ra gì, và vì sao cách sửa trong phần chú thích lại chạy?' + code(
              'interface Store { put(key: string, body: string): Promise<void> }\n' +
              '\n' +
              'class R2Storage implements Store {\n' +
              '  async put(key, body) { console.log(key, body); }\n' +
              '}\n' +
              '\n' +
              '// không lỗi gì:\n' +
              'const good: Store = {\n' +
              '  async put(key, body) { console.log(key, body); },\n' +
              '};',
            ),
          ),
          options: [
            B(
              'TS2420 on the class — <code>implements</code> requires the method signatures to match textually, and the object literal escapes that rule',
              'TS2420 ở class — <code>implements</code> đòi chữ ký phương thức phải khớp về mặt văn bản, còn object literal thì thoát khỏi luật đó',
            ),
            B(
              'Two TS7006 errors on the class ("Parameter &#39;key&#39;/&#39;body&#39; implicitly has an &#39;any&#39; type") — <code>implements</code> VERIFIES the class against the interface but does not infer from it, while a contextual annotation on a variable does flow inward',
              'Hai lỗi TS7006 ở class ("Parameter &#39;key&#39;/&#39;body&#39; implicitly has an &#39;any&#39; type") — <code>implements</code> KIỂM class với interface chứ không suy kiểu từ nó, còn một chú thích ngữ cảnh trên biến thì chảy vào bên trong',
            ),
            B(
              'Nothing in either case — <code>implements</code> supplies the parameter types exactly like a contextual annotation does',
              'Không lỗi ở cả hai — <code>implements</code> cung cấp kiểu tham số y hệt như một chú thích ngữ cảnh',
            ),
            B(
              'One TS2416 on the class, because an <code>async</code> method returns <code>Promise&lt;void&gt;</code> while the interface asks for <code>void</code>',
              'Một lỗi TS2416 ở class, vì phương thức <code>async</code> trả về <code>Promise&lt;void&gt;</code> trong khi interface đòi <code>void</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: two errors on the class, <code>TS7006: Parameter &#39;key&#39; implicitly has an &#39;any&#39; type.</code> and the same for <code>body</code>; the object-literal version compiles with exit code 0. The difference is worth internalising because it looks like a contradiction: <code>implements Store</code> is a CHECK — the compiler verifies afterwards that the class has the members the interface declares — whereas <code>const good: Store = …</code> is a contextual annotation, and contextual types flow INWARD into the function expressions inside. So the class version needs its parameters annotated. Without <code>noImplicitAny</code> it is worse than an error: the parameters are silently <code>any</code>, so the method both satisfies the interface and accepts anything at all.',
            'Đo được: hai lỗi ở class, <code>TS7006: Parameter &#39;key&#39; implicitly has an &#39;any&#39; type.</code> và y hệt cho <code>body</code>; còn bản object literal biên dịch với mã thoát 0. Khác biệt này đáng khắc vào đầu vì nhìn như một mâu thuẫn: <code>implements Store</code> là một phép KIỂM — trình biên dịch xác nhận về sau rằng class có đủ các thành viên interface khai — còn <code>const good: Store = …</code> là một chú thích ngữ cảnh, và kiểu ngữ cảnh thì CHẢY VÀO trong các biểu thức hàm bên trong. Nên bản class buộc phải chú thích kiểu cho tham số. Không có <code>noImplicitAny</code> thì còn tệ hơn một lỗi: các tham số âm thầm thành <code>any</code>, nên phương thức vừa thoả interface vừa nhận bất cứ thứ gì.',
          ),
        }),

        mcq({
          prompt: B(
            'The course says a getter and setter with unrelated types is TS2380. Measured on tsc 5.9.3, what happens to these three classes?' + code(
              'class A { get v(): number { return 1; }        set v(x: string) {} }\n' +
              'class B { #r = 0; get v(): number { return this.#r; } set v(x) { this.#r = Number(x); } }\n' +
              'class C { get v() { return 1; }                set v(x: string) {} }',
            ),
            'Giáo trình bảo getter và setter mang kiểu không liên quan nhau là TS2380. Đo trên tsc 5.9.3 thì ba class này ra sao?' + code(
              'class A { get v(): number { return 1; }        set v(x: string) {} }\n' +
              'class B { #r = 0; get v(): number { return this.#r; } set v(x) { this.#r = Number(x); } }\n' +
              'class C { get v() { return 1; }                set v(x: string) {} }',
            ),
          ),
          options: [
            B(
              'All three are TS2380 — the compatibility rule between a getter and its setter is unchanged in TypeScript 5, and whether either side carries an explicit annotation makes no difference to it',
              'Cả ba đều là TS2380 — quy tắc tương thích giữa getter và setter không hề đổi ở TypeScript 5, và chuyện bên nào có chú thích kiểu tường minh cũng chẳng ảnh hưởng gì tới nó',
            ),
            B(
              'A and C are TS2380; only B compiles, because a setter with no annotation of its own is exempt from the compatibility rule and simply takes whatever type the getter returns',
              'A và C là TS2380; chỉ B biên dịch được, vì một setter không có chú thích riêng thì được miễn khỏi quy tắc tương thích và đơn giản là lấy luôn kiểu mà getter trả về',
            ),
            B(
              'A compiles (TypeScript 5.1 allows unrelated get/set types when BOTH are annotated) · B compiles, with the setter inferring <code>number</code> from the getter · C is TS2322, because the unannotated getter takes <code>string</code> from the setter and then returns <code>1</code>',
              'A biên dịch được (TypeScript 5.1 cho phép get/set mang kiểu rời nhau khi CẢ HAI đều được chú thích) · B biên dịch được, setter suy ra <code>number</code> từ getter · C là TS2322, vì getter không chú thích lấy kiểu <code>string</code> từ setter rồi lại trả về <code>1</code>',
            ),
            B(
              'All three compile — since TypeScript 5.1 the getter and setter of one property are checked completely independently, so an unannotated member no longer borrows its type from its partner and each side is inferred from its own body alone',
              'Cả ba đều biên dịch được — từ TypeScript 5.1, getter và setter của cùng một thuộc tính được kiểm hoàn toàn độc lập, nên một bên không chú thích sẽ không còn mượn kiểu của bên kia mà mỗi bên tự suy ra từ chính thân của mình',
            ),
          ],
          correct: 2,
          explanation: EX(
            '⚠️ Measured on 5.9.3: exactly one error in the whole file — <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code>, on class C\'s <code>return 1</code>. A dumped declaration confirms the rest: <code>class A { get v(): number; set v(x: string); }</code>, <code>class B { get v(): number; set v(x: number); }</code>, <code>class C { get v(): string; set v(x: string); }</code>. TypeScript 5.1 introduced "unrelated types for getters and setters", so the course\'s TS2380 claim describes an older compiler. What still holds is the design advice: a property whose read and write shapes genuinely differ (read a <code>Date</code>, write an ISO string) is two operations wearing one name — give them explicit names so the difference is visible at the call site.',
            '⚠️ Đo trên 5.9.3: cả file đúng một lỗi — <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code>, ở <code>return 1</code> của class C. Dump khai báo xác nhận phần còn lại: <code>class A { get v(): number; set v(x: string); }</code>, <code>class B { get v(): number; set v(x: number); }</code>, <code>class C { get v(): string; set v(x: string); }</code>. TypeScript 5.1 đã đưa vào tính năng "kiểu rời nhau cho getter và setter", nên lời khẳng định TS2380 của giáo trình đang mô tả một trình biên dịch cũ hơn. Thứ còn nguyên giá trị là lời khuyên thiết kế: một thuộc tính mà hình dạng đọc và ghi thật sự khác nhau (đọc ra một <code>Date</code>, ghi vào một chuỗi ISO) là HAI thao tác đội chung một cái tên — hãy đặt cho chúng tên riêng để khác biệt hiện ra ngay ở chỗ gọi.',
          ),
        }),

        mcq({
          prompt: B(
            'Two errors here. Which pair, and where does each land?' + code(
              'interface Shape { area(): number }\n' +
              '\n' +
              'abstract class Base implements Shape {\n' +
              '  abstract area(): number;\n' +
              "  describe(): string { return 'area=' + this.area(); }\n" +
              '}\n' +
              '\n' +
              'class Square extends Base {\n' +
              '  constructor(private side: number) { super(); }   // A — no area()\n' +
              '}\n' +
              '\n' +
              'const b = new Base();                               // B',
            ),
            'Ở đây có hai lỗi. Cặp nào, và mỗi lỗi rơi vào đâu?' + code(
              'interface Shape { area(): number }\n' +
              '\n' +
              'abstract class Base implements Shape {\n' +
              '  abstract area(): number;\n' +
              "  describe(): string { return 'area=' + this.area(); }\n" +
              '}\n' +
              '\n' +
              'class Square extends Base {\n' +
              '  constructor(private side: number) { super(); }   // A — thiếu area()\n' +
              '}\n' +
              '\n' +
              'const b = new Base();                               // B',
            ),
          ),
          options: [
            B(
              'A: TS2420 "Class &#39;Square&#39; incorrectly implements interface &#39;Shape&#39;" · B: no error, since <code>Base</code> supplies <code>describe()</code>',
              'A: TS2420 "Class &#39;Square&#39; incorrectly implements interface &#39;Shape&#39;" · B: không lỗi, vì <code>Base</code> đã có <code>describe()</code>',
            ),
            B(
              'A: no error — an abstract member is optional for a subclass · B: TS2511',
              'A: không lỗi — một thành viên abstract là tuỳ chọn với lớp con · B: TS2511',
            ),
            B(
              'A: TS2515 · B: TS2420, because <code>new Base()</code> is checked against the interface rather than the class',
              'A: TS2515 · B: TS2420, vì <code>new Base()</code> bị đối chiếu với interface chứ không phải với class',
            ),
            B(
              'A: TS2515 "Non-abstract class &#39;Square&#39; does not implement inherited abstract member area from class &#39;Base&#39;" · B: TS2511 "Cannot create an instance of an abstract class"',
              'A: TS2515 "Non-abstract class &#39;Square&#39; does not implement inherited abstract member area from class &#39;Base&#39;" · B: TS2511 "Cannot create an instance of an abstract class"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, verbatim: <code>TS2515: Non-abstract class &#39;Square&#39; does not implement inherited abstract member area from class &#39;Base&#39;.</code> on line 8 and <code>TS2511: Cannot create an instance of an abstract class.</code> on the last line. Note where each check lives. <code>extends</code> inherits code, so the missing member is reported on the SUBCLASS — <code>Square</code> promised to be concrete and left a hole. <code>abstract</code> makes the base a template with holes that cannot be instantiated on its own. And <code>implements</code> (which <code>Base</code> also uses) inherits nothing at all — it is purely a compile-time verification that the class has the interface\'s members, and it leaves no trace in the emitted JavaScript.',
            'Đo được, nguyên văn: <code>TS2515: Non-abstract class &#39;Square&#39; does not implement inherited abstract member area from class &#39;Base&#39;.</code> ở dòng 8 và <code>TS2511: Cannot create an instance of an abstract class.</code> ở dòng cuối. Hãy để ý mỗi phép kiểm nằm ở đâu. <code>extends</code> kế thừa mã, nên thành viên còn thiếu bị báo ở LỚP CON — <code>Square</code> hứa mình là lớp cụ thể mà lại để hở một lỗ. <code>abstract</code> biến lớp cơ sở thành một khuôn có lỗ, không tự đứng một mình được. Còn <code>implements</code> (thứ <code>Base</code> cũng đang dùng) thì chẳng kế thừa gì cả — nó thuần tuý là một phép xác nhận lúc biên dịch rằng class có đủ thành viên của interface, và nó không để lại dấu vết nào trong JavaScript sinh ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A decorator "that compiled last week" suddenly fails with "Unable to resolve signature of method decorator" after someone edited <code>tsconfig.json</code>. What happened, and when does a decorator actually run?',
            'Một decorator "tuần trước còn biên dịch được" bỗng hỏng với "Unable to resolve signature of method decorator" sau khi có người sửa <code>tsconfig.json</code>. Chuyện gì đã xảy ra, và một decorator thật ra chạy vào lúc nào?',
          ),
          options: [
            B(
              'Someone turned on <code>experimentalDecorators</code> (for a NestJS or TypeORM dependency), which compiles every decorator in the project under the legacy rules — the two systems have incompatible signatures and the flag is per-project, not per-file. Decorators run once, at class-definition time, not per call',
              'Có người bật <code>experimentalDecorators</code> (vì một dependency NestJS hay TypeORM), và thế là MỌI decorator trong dự án bị biên dịch theo luật cũ — hai hệ thống có chữ ký không tương thích, và cái cờ ấy áp cho cả dự án chứ không theo từng file. Decorator chạy một lần, lúc class được định nghĩa, chứ không phải mỗi lời gọi',
            ),
            B(
              'Someone removed <code>emitDecoratorMetadata</code>, which every decorator needs in order to receive its context object. Decorators run once per instance, in the constructor',
              'Có người gỡ <code>emitDecoratorMetadata</code>, thứ mà mọi decorator đều cần để nhận được object ngữ cảnh. Decorator chạy một lần cho mỗi thực thể, trong hàm khởi tạo',
            ),
            B(
              'Someone raised <code>target</code> above ES2022, which removes decorator support entirely. Decorators run on every call to the decorated method',
              'Có người nâng <code>target</code> lên trên ES2022, và thế là hỗ trợ decorator biến mất hoàn toàn. Decorator chạy ở mỗi lời gọi tới phương thức được trang trí',
            ),
            B(
              'Nothing in the config could cause this — the message means the decorator function returns a value, and a method decorator must return <code>void</code>. Decorators are erased and never run at all',
              'Không thứ gì trong config gây ra được chuyện này — thông báo ấy nghĩa là hàm decorator có trả về giá trị, mà một method decorator bắt buộc phải trả <code>void</code>. Decorator bị xoá và không bao giờ chạy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'There are two decorator implementations with different signatures, and the flag choosing between them is per-project. The standard stage-3 form is on by default in TypeScript 5 with no configuration; the legacy form needs <code>&quot;experimentalDecorators&quot;: true</code> (plus <code>emitDecoratorMetadata</code> for dependency injection) and is what NestJS, TypeORM and Angular were built on. Flip the flag for one dependency and every standard-style decorator you wrote is now compiled under the other rules — an error pointing at code that did not change. Decide once, based on what the framework requires, and leave a comment in the config saying which library forced the choice. And note the timing: decorators run once, when the class is evaluated at module load, not per call and not per instance — they are one of the very few TypeScript-adjacent features that produce real runtime behaviour instead of being erased.',
            'Có hai bản cài đặt decorator với hai chữ ký khác nhau, và cái cờ chọn giữa chúng áp cho cả dự án. Dạng chuẩn stage-3 bật sẵn trong TypeScript 5, không cần cấu hình gì; dạng cũ cần <code>&quot;experimentalDecorators&quot;: true</code> (kèm <code>emitDecoratorMetadata</code> cho tiêm phụ thuộc) và là nền của NestJS, TypeORM, Angular. Lật cái cờ vì một dependency là mọi decorator viết theo dạng chuẩn của bạn bị biên dịch theo luật kia — một lỗi chỉ vào đoạn mã chẳng ai đụng tới. Hãy quyết một lần, dựa trên thứ framework đòi hỏi, và để lại một dòng chú thích trong config nói rõ thư viện nào ép lựa chọn ấy. Và để ý thời điểm: decorator chạy MỘT LẦN, lúc class được đánh giá khi module nạp, chứ không phải mỗi lời gọi và cũng không phải mỗi thực thể — chúng là một trong rất ít tính năng thuộc họ TypeScript sinh ra hành vi thật lúc chạy thay vì bị xoá.',
          ),
        }),

        // ── Chương 15 — Hiệu năng build ─────────────────────────────────
        mcq({
          prompt: B(
            'A real <code>tsc --noEmit --extendedDiagnostics</code> run on a tiny file printed the block below. Which reading is right?' + code(
              'Files:                         64\n' +
              'Lines of Library:           51126\n' +
              'Parse time:                 0.10s\n' +
              'Check time:                 0.32s\n' +
              'Total time:                 0.49s',
            ),
            'Một lượt chạy thật <code>tsc --noEmit --extendedDiagnostics</code> trên một file bé xíu in ra khối dưới đây. Cách đọc nào là ĐÚNG?' + code(
              'Files:                         64\n' +
              'Lines of Library:           51126\n' +
              'Parse time:                 0.10s\n' +
              'Check time:                 0.32s\n' +
              'Total time:                 0.49s',
            ),
          ),
          options: [
            B(
              'Emitting JavaScript is the expensive half of a build, so the fix for a slow project is always to reduce what gets written to <code>outDir</code>',
              'Xuất JavaScript mới là nửa tốn kém của một build, nên cách sửa cho một dự án chậm luôn là giảm thứ được ghi vào <code>outDir</code>',
            ),
            B(
              'Type-checking, not emit, is the expensive part — and 64 files and 51k lines of library for one small source file shows how much of a build is dependency declarations rather than your own code',
              'Kiểm kiểu, chứ không phải xuất mã, mới là phần tốn kém — và 64 file cùng 51 nghìn dòng thư viện cho MỘT file nguồn bé cho thấy phần lớn một build là khai báo của dependency chứ không phải mã của bạn',
            ),
            B(
              '"Lines of Library" counts the lines of your own project, so 51126 means the file pulled in an unusually large local module graph',
              '"Lines of Library" đếm số dòng của chính dự án bạn, nên 51126 nghĩa là file này kéo theo một đồ thị module cục bộ lớn bất thường',
            ),
            B(
              'The numbers are reproducible to the millisecond, so any change that does not move "Total time" by an exact amount has had no effect',
              'Các con số này lặp lại chính xác tới mili-giây, nên bất kỳ thay đổi nào không làm "Total time" nhúc nhích đúng một lượng nào đó đều là vô tác dụng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'That block is a real run, and the shape is the lesson: one tiny source file still loaded 64 files and 51,126 lines of library declarations, and <code>Check time</code> is three times <code>Parse time</code>. Type-checking — comparing structures, resolving generics, walking every <code>.d.ts</code> you depend on — is what makes <code>tsc</code> slow; emitting JavaScript barely registers. Read the SHAPE rather than the absolute numbers, because they vary run to run: <code>Check time</code> dominating with a huge library figure points at dependency declarations (<code>skipLibCheck</code>, a tight <code>types</code> array); <code>Check time</code> dominating on your own code points at your types — deep conditional types, large unions, recursive mapped types, the clever type that costs the whole team on every build. For the hard cases, <code>tsc --generateTrace</code> emits a trace you can open in a profiler and see which instantiation is expensive, by name.',
            'Khối đó là một lượt chạy thật, và HÌNH DẠNG của nó mới là bài học: một file nguồn bé tí vẫn nạp 64 file và 51.126 dòng khai báo thư viện, và <code>Check time</code> gấp ba <code>Parse time</code>. Kiểm kiểu — so sánh cấu trúc, phân giải generic, đi khắp mọi <code>.d.ts</code> bạn phụ thuộc — mới là thứ làm <code>tsc</code> chậm; xuất JavaScript gần như không đáng kể. Hãy đọc HÌNH DẠNG chứ đừng đọc con số tuyệt đối, vì chúng đổi qua từng lượt chạy: <code>Check time</code> áp đảo kèm con số thư viện khổng lồ là chỉ vào khai báo của dependency (<code>skipLibCheck</code>, một mảng <code>types</code> gọn); <code>Check time</code> áp đảo trên chính mã của bạn là chỉ vào KIỂU của bạn — conditional type sâu, union to, mapped type đệ quy, cái kiểu thông minh bắt cả đội trả giá ở mọi lần build. Với ca khó, <code>tsc --generateTrace</code> xuất ra một trace mở được bằng profiler để thấy đích danh phép khởi tạo kiểu nào đắt.',
          ),
        }),

        mcq({
          prompt: B(
            'A CI build goes green on code you know is broken. <code>incremental: true</code> is on. What is the most likely cause, and what are the two rules that prevent it?',
            'Một build CI ra xanh trên đoạn mã mà bạn BIẾT là hỏng. <code>incremental: true</code> đang bật. Nguyên nhân khả dĩ nhất là gì, và hai quy tắc nào ngăn được nó?',
          ),
          options: [
            B(
              '<code>incremental</code> disables type-checking after the first run by design; the rules are to pass <code>--force</code> in CI and never enable it outside watch mode',
              '<code>incremental</code> vốn được thiết kế để TẮT kiểm kiểu sau lượt chạy đầu; hai quy tắc là truyền <code>--force</code> trong CI và không bao giờ bật nó ngoài chế độ watch',
            ),
            B(
              'The <code>.tsbuildinfo</code> stores the previous run\'s exit code, so a green build is replayed verbatim; the rules are to set <code>noEmitOnError</code> and to run <code>tsc</code> twice',
              'File <code>.tsbuildinfo</code> lưu mã thoát của lượt chạy trước nên một build xanh được phát lại nguyên văn; hai quy tắc là đặt <code>noEmitOnError</code> và chạy <code>tsc</code> hai lượt',
            ),
            B(
              'A stale <code>.tsbuildinfo</code>: the cache keys on file timestamps and sizes, so a checkout restoring an older version byte-for-byte, or a Docker layer copying files with a fixed mtime, leaves the build convinced nothing changed. Keep <code>*.tsbuildinfo</code> out of git, never copy it into an image, and delete it before debugging an inexplicable result',
              'Một <code>.tsbuildinfo</code> cũ: bộ nhớ đệm khoá theo dấu thời gian và kích thước file, nên một lần checkout khôi phục bản cũ y hệt từng byte, hay một lớp Docker chép file với mtime cố định, để lại một build tin chắc là chẳng có gì đổi. Hãy giữ <code>*.tsbuildinfo</code> ngoài git, đừng bao giờ chép nó vào ảnh, và xoá nó trước khi đi gỡ một kết quả khó hiểu',
            ),
            B(
              'Nothing to do with the cache — <code>incremental</code> only affects emit, so the type errors were genuinely absent and the code is fine',
              'Không liên quan gì tới bộ nhớ đệm — <code>incremental</code> chỉ ảnh hưởng tới việc xuất mã, nên các lỗi kiểu thật sự không có và đoạn mã ổn cả',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>incremental: true</code> writes a <code>.tsbuildinfo</code> recording what it already checked, and the next run skips the unchanged parts — the cheapest speedup available, and why <code>tsc --watch</code> feels instant after the first pass. The catch is how it decides "unchanged": timestamps and sizes. Anything that changes a file\'s MEANING without changing those defeats it, and you get a green build of the previous code, which is worse than a red one. Commit one to git and you poison every clone. Copy one into a Docker image and every build inherits it. The habit worth forming: when a build result is inexplicable, delete the <code>.tsbuildinfo</code> and re-run before you debug anything else.',
            '<code>incremental: true</code> ghi ra một file <code>.tsbuildinfo</code> lưu lại những gì nó đã kiểm, và lượt chạy sau bỏ qua phần không đổi — cách tăng tốc rẻ nhất hiện có, và cũng là lý do <code>tsc --watch</code> cảm giác tức thì sau lượt đầu. Cái bẫy nằm ở cách nó quyết định thế nào là "không đổi": dấu thời gian và kích thước. Bất cứ thứ gì đổi Ý NGHĨA của một file mà không đổi hai thứ đó đều qua mặt được nó, và bạn nhận một build xanh của đoạn mã cũ — còn tệ hơn một build đỏ. Commit nó vào git là đầu độc mọi bản clone. Chép nó vào ảnh Docker là mọi lần build đều thừa kế. Thói quen đáng tập: khi một kết quả build khó hiểu, hãy xoá <code>.tsbuildinfo</code> rồi chạy lại TRƯỚC khi đi gỡ bất cứ thứ gì khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A monorepo has a shared package and a backend. What does <code>composite: true</code> plus <code>references</code> buy, and which command actually uses them?' + code(
              '// backend/tsconfig.json\n' +
              '{\n' +
              '  "compilerOptions": { "composite": true },\n' +
              '  "references": [{ "path": "../shared" }]\n' +
              '}',
            ),
            'Một monorepo có một gói dùng chung và một backend. <code>composite: true</code> cộng với <code>references</code> mang lại gì, và lệnh nào thật sự dùng tới chúng?' + code(
              '// backend/tsconfig.json\n' +
              '{\n' +
              '  "compilerOptions": { "composite": true },\n' +
              '  "references": [{ "path": "../shared" }]\n' +
              '}',
            ),
          ),
          options: [
            B(
              'They make plain <code>tsc</code> type-check the referenced projects too, which is the whole point — <code>tsc -b</code> is only an alias kept for older versions',
              'Chúng làm <code>tsc</code> trơn kiểm kiểu luôn các dự án được tham chiếu, và đó là toàn bộ ý nghĩa — <code>tsc -b</code> chỉ là tên gọi khác giữ lại cho các bản cũ',
            ),
            B(
              'They merge the two projects into one program so a single <code>tsc --noEmit</code> checks both from source, which is what makes it fast',
              'Chúng gộp hai dự án thành một chương trình để một lệnh <code>tsc --noEmit</code> kiểm cả hai từ mã nguồn, và đó là thứ làm nó nhanh',
            ),
            B(
              'They only affect the emitted output directory layout; type-checking is unchanged, so the speedup comes entirely from <code>incremental</code>',
              'Chúng chỉ ảnh hưởng tới cách bố trí thư mục đầu ra; việc kiểm kiểu không đổi, nên phần tăng tốc hoàn toàn đến từ <code>incremental</code>',
            ),
            B(
              'Each referenced project emits its own <code>.d.ts</code> and dependents check against THAT instead of re-checking its source. <code>tsc -b</code> (build mode) walks the reference graph in dependency order and rebuilds only stale projects; plain <code>tsc</code> ignores <code>references</code> entirely',
              'Mỗi dự án được tham chiếu tự xuất ra <code>.d.ts</code> của nó, và các dự án phụ thuộc kiểm với CHÍNH file đó thay vì kiểm lại mã nguồn. <code>tsc -b</code> (chế độ build) đi qua đồ thị tham chiếu theo thứ tự phụ thuộc và chỉ dựng lại những dự án đã cũ; còn <code>tsc</code> trơn bỏ qua <code>references</code> hoàn toàn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified by building a two-project sample for real: <code>tsc -b backend</code> built <code>shared</code> first, then <code>backend</code>, leaving <code>shared/dist/index.d.ts</code>, <code>backend/dist/main.d.ts</code> and a <code>tsconfig.tsbuildinfo</code> beside each. A second run reported both projects "up to date because newest input … is older than output" — dependency order plus staleness, in one command. <code>composite: true</code> is what makes a project consumable that way: it forces declaration emit and a <code>rootDir</code>, so a dependent can check against the emitted <code>.d.ts</code> rather than re-reading the sources. It also implies <code>incremental</code>, which is why the <code>.tsbuildinfo</code> appears without asking. This repo applies the same idea at a coarser grain: the backend and frontend are separate TypeScript projects, and the pre-push checklist runs <code>tsc --noEmit</code> in each, so a backend-only change never pays to re-check the frontend.',
            'Đã kiểm bằng cách dựng thật một mẫu hai dự án: <code>tsc -b backend</code> dựng <code>shared</code> trước, rồi tới <code>backend</code>, để lại <code>shared/dist/index.d.ts</code>, <code>backend/dist/main.d.ts</code> và một <code>tsconfig.tsbuildinfo</code> cạnh mỗi cái. Lượt chạy thứ hai báo cả hai dự án "up to date because newest input … is older than output" — thứ tự phụ thuộc cộng với việc phát hiện đã cũ, gói trong một lệnh. <code>composite: true</code> chính là thứ làm một dự án dùng lại được theo cách đó: nó ép xuất khai báo và ép có <code>rootDir</code>, nhờ vậy một dự án phụ thuộc kiểm với file <code>.d.ts</code> đã xuất thay vì đọc lại mã nguồn. Nó cũng kéo theo <code>incremental</code>, và đó là lý do file <code>.tsbuildinfo</code> tự hiện ra. Repo này áp dụng đúng ý tưởng ấy ở mức thô hơn: backend và frontend là hai dự án TypeScript riêng, và bộ kiểm trước khi push chạy <code>tsc --noEmit</code> ở từng cái, nên một thay đổi chỉ ở backend không bao giờ phải trả giá cho việc kiểm lại frontend.',
          ),
        }),

        mcq({
          prompt: B(
            'A team runs <code>esbuild</code> in the Dockerfile and nothing else. The image builds and ships. Why is that dangerous, and what is the standard fix?',
            'Một nhóm chạy <code>esbuild</code> trong Dockerfile và không chạy gì khác. Ảnh build xong và phát hành. Vì sao nguy hiểm, và cách sửa chuẩn là gì?',
          ),
          options: [
            B(
              'A fast transpiler erases types WITHOUT checking a single one — that is why it is fast — so type errors ship silently and nothing in the output says so. Put the check in the same script as the build (<code>tsc --noEmit &amp;&amp; vite build</code>) so it cannot be skipped, and run it in CI on every push',
              'Một bộ transpile nhanh XOÁ kiểu mà KHÔNG kiểm lấy một cái — chính vì thế nó mới nhanh — nên lỗi kiểu lên production trong im lặng và không gì trong đầu ra nói ra điều đó. Hãy đặt phép kiểm vào CÙNG một script với lệnh build (<code>tsc --noEmit &amp;&amp; vite build</code>) để không bỏ sót được, và chạy nó trong CI ở mọi lần push',
            ),
            B(
              'esbuild type-checks but only the files it happens to reach from the entry point, so the fix is to list every file explicitly in its config',
              'esbuild có kiểm kiểu nhưng chỉ với những file nó tình cờ đi tới từ điểm vào, nên cách sửa là liệt kê tường minh mọi file trong config của nó',
            ),
            B(
              'esbuild checks types only when <code>isolatedModules</code> is on; turning that flag on in <code>tsconfig.json</code> is the whole fix',
              'esbuild chỉ kiểm kiểu khi bật <code>isolatedModules</code>; bật cờ đó trong <code>tsconfig.json</code> là xong',
            ),
            B(
              'The danger is only about output size — a bundler cannot tree-shake without type information, so the fix is to emit declarations alongside the bundle',
              'Nguy hiểm chỉ nằm ở kích thước đầu ra — một bộ đóng gói không tree-shake được nếu không có thông tin kiểu, nên cách sửa là xuất kèm file khai báo bên cạnh bundle',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the modern two-tool setup and its one rule. A fast transpiler (esbuild, SWC, Vite, Next) reads one file at a time and deletes the annotations without ever consulting them — that is precisely where the speed comes from. So a dev server keeps serving a broken build, and a Docker image built with only the bundler ships type errors to production with nothing in the output to say so: the whole guarantee is gone. <code>tsc --noEmit</code> is not optional overhead, it is where the checking happens. Chain it with the build in one script, and run it in CI. The companion flag is <code>isolatedModules: true</code>, which bans the constructs a per-file transpiler cannot compile correctly (re-exporting a type without <code>export type</code> is the classic) — it makes your code SAFE for the fast half, but it never makes the fast half check anything.',
            'Đây là bộ đôi công cụ hiện đại và quy tắc duy nhất của nó. Một bộ transpile nhanh (esbuild, SWC, Vite, Next) đọc từng file một và xoá chú thích kiểu mà không hề ngó tới chúng — tốc độ đến chính từ chỗ đó. Thế nên một dev server cứ phục vụ một bản build đã hỏng, còn một ảnh Docker chỉ dựng bằng bộ đóng gói thì đưa lỗi kiểu thẳng lên production mà không có gì trong đầu ra nói ra: toàn bộ bảo đảm biến mất. <code>tsc --noEmit</code> không phải chi phí phụ tuỳ chọn, nó CHÍNH LÀ chỗ việc kiểm diễn ra. Hãy nối nó với lệnh build trong một script, và chạy nó trong CI. Cờ đi kèm là <code>isolatedModules: true</code>, thứ cấm những cấu trúc mà một bộ transpile theo từng file không biên dịch đúng được (kinh điển là re-export một kiểu mà không có <code>export type</code>) — nó làm mã của bạn AN TOÀN với nửa nhanh, chứ không bao giờ làm nửa nhanh kiểm được thứ gì.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO import forms whose runtime behaviour is guaranteed and never depends on how the names happen to be used elsewhere in the file.',
            'Chọn HAI dạng import mà hành vi lúc chạy là CHẮC CHẮN, không phụ thuộc vào chuyện các tên đó tình cờ được dùng thế nào ở chỗ khác trong file.',
          ),
          options: [
            B(
              '<code>import type { User } from &#39;./types.js&#39;;</code> — always erased',
              '<code>import type { User } from &#39;./types.js&#39;;</code> — luôn bị xoá',
            ),
            B(
              '<code>import { User } from &#39;./types.js&#39;;</code> where <code>User</code> is an interface — the compiler decides',
              '<code>import { User } from &#39;./types.js&#39;;</code> với <code>User</code> là một interface — trình biên dịch tự quyết',
            ),
            B(
              '<code>import &#39;./register-hooks.js&#39;;</code> — the bare side-effect form, never elided under any setting',
              '<code>import &#39;./register-hooks.js&#39;;</code> — dạng trơ để lấy tác dụng phụ, không bao giờ bị lược bỏ dưới bất kỳ cấu hình nào',
            ),
            B(
              '<code>import { Handler, connect } from &#39;./db.js&#39;;</code> where <code>Handler</code> is a type and <code>connect</code> is a function',
              '<code>import { Handler, connect } from &#39;./db.js&#39;;</code> với <code>Handler</code> là một kiểu còn <code>connect</code> là một hàm',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            '<code>import type</code> is guaranteed erased — that is the point of writing it, and using the binding as a value is an immediate TS1361. The bare side-effect form <code>import &#39;./x.js&#39;</code> is never elided under any setting, which is why it is the correct way to depend on a module\'s load-time behaviour. The other two are decided by import elision, and elision is a WHOLE-FILE decision: the compiler drops the statement only when nothing in it is used as a value. So option B disappears today and reappears the moment someone adds a value use; option D keeps the whole statement alive because of <code>connect</code>. That is how a module whose only job is to run something on load — registering a Prisma middleware, patching a global, installing a polyfill — gets silently dropped when a file imports only types from it, and the failure reads as "the feature just does not happen", far from the import that caused it. <code>verbatimModuleSyntax: true</code> removes the guessing entirely: imports are emitted exactly as written.',
            '<code>import type</code> chắc chắn bị xoá — đó là lý do người ta viết nó, và dùng cái tên ấy như một giá trị là TS1361 ngay lập tức. Dạng trơ lấy tác dụng phụ <code>import &#39;./x.js&#39;</code> thì không bao giờ bị lược bỏ dưới bất kỳ cấu hình nào, và vì thế nó là cách đúng để phụ thuộc vào hành vi lúc-nạp của một module. Hai lựa chọn còn lại do phép lược import quyết định, mà phép lược ấy là quyết định theo TOÀN FILE: trình biên dịch chỉ bỏ câu lệnh khi không có gì trong đó được dùng như một giá trị. Nên lựa chọn B hôm nay biến mất rồi ngày mai hiện lại ngay khi có người thêm một chỗ dùng giá trị; lựa chọn D giữ nguyên cả câu lệnh vì có <code>connect</code>. Đó chính là cách một module chỉ có mỗi việc chạy một thứ gì đó lúc nạp — đăng ký một middleware Prisma, vá một biến toàn cục, cài một polyfill — bị âm thầm gỡ đi khi một file chỉ import kiểu từ nó, và cú hỏng đọc lên thành "tính năng đó tự nhiên không xảy ra", cách xa cái import đã gây ra. <code>verbatimModuleSyntax: true</code> xoá sạch chuyện đoán mò: import được xuất ra đúng như đã viết.',
          ),
        }),

        // ── Chương 16 — Kiến trúc & thiết kế theo kiểu ──────────────────
        mcq({
          prompt: B(
            'Compiled under <code>--strict</code>. Which line is the error, and what does the OTHER line prove?' + code(
              'type Flat = { loading: boolean; data?: string; error?: string };\n' +
              '\n' +
              "const nonsense: Flat = { loading: true, data: 'x', error: 'boom' };   // A\n" +
              '\n' +
              'function render(s: Flat): string {\n' +
              '  return s.data;                                                    // B\n' +
              '}',
            ),
            'Biên dịch dưới <code>--strict</code>. Dòng nào là lỗi, và dòng CÒN LẠI chứng minh điều gì?' + code(
              'type Flat = { loading: boolean; data?: string; error?: string };\n' +
              '\n' +
              "const nonsense: Flat = { loading: true, data: 'x', error: 'boom' };   // A\n" +
              '\n' +
              'function render(s: Flat): string {\n' +
              '  return s.data;                                                    // B\n' +
              '}',
            ),
          ),
          options: [
            B(
              'A is the error: a value that sets both <code>data</code> and <code>error</code> contradicts <code>loading: true</code>, and the compiler rejects the combination',
              'A là lỗi: một giá trị đặt cả <code>data</code> lẫn <code>error</code> mâu thuẫn với <code>loading: true</code>, và trình biên dịch từ chối tổ hợp ấy',
            ),
            B(
              'B is the error (TS2322, <code>string | undefined</code> not assignable to <code>string</code>) — and A compiling is the point: "loading with both data and an error" is a state the type happily allows you to construct',
              'B là lỗi (TS2322, <code>string | undefined</code> không gán được cho <code>string</code>) — và việc A biên dịch được mới là điểm mấu chốt: "đang tải mà có cả data lẫn lỗi" là một trạng thái kiểu này vui vẻ cho bạn dựng ra',
            ),
            B(
              'Both are errors — optional properties may not be set at all in an object literal, only assigned later',
              'Cả hai đều lỗi — thuộc tính tuỳ chọn không được đặt trong object literal, chỉ được gán về sau',
            ),
            B(
              'Neither — <code>s.data</code> is <code>string</code> because the excess-property check already guaranteed the key is present',
              'Không dòng nào — <code>s.data</code> là <code>string</code> vì phép kiểm thuộc tính thừa đã bảo đảm khoá đó có mặt',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: one error, <code>TS2322: Type &#39;string | undefined&#39; is not assignable to type &#39;string&#39;.</code> on B. Line A compiling with zero complaints is the whole lesson: <code>{ loading: boolean; data?: string; error?: string }</code> has eight representable combinations and only three of them are real states. "Loading, with data, and an error" is one you can write down today, so eventually someone will produce it — and every consumer pays, each writing its own guard, and the guards disagree. That is where "it shows the spinner and the error at once" comes from. Name the states instead: <code>{ status: &#39;loading&#39; } | { status: &#39;ok&#39;; data: T } | { status: &#39;error&#39;; message: string }</code>. Three variants, each field existing only where it means something, and reading <code>data</code> outside the <code>ok</code> branch becomes an error rather than a convention.',
            'Đo được: một lỗi, <code>TS2322: Type &#39;string | undefined&#39; is not assignable to type &#39;string&#39;.</code> ở B. Việc dòng A biên dịch không một lời phàn nàn mới là toàn bộ bài học: <code>{ loading: boolean; data?: string; error?: string }</code> biểu diễn được tám tổ hợp mà chỉ ba trong số đó là trạng thái thật. "Đang tải, có data, và có lỗi" là một tổ hợp hôm nay bạn viết ra được, nên rồi sẽ có người tạo ra nó — và mọi bên tiêu thụ đều phải trả giá, ai cũng tự viết chốt kiểm của mình, rồi các chốt ấy mâu thuẫn nhau. Chuyện "vừa quay spinner vừa hiện lỗi" ra đời từ đó. Hãy ĐẶT TÊN cho các trạng thái: <code>{ status: &#39;loading&#39; } | { status: &#39;ok&#39;; data: T } | { status: &#39;error&#39;; message: string }</code>. Ba biến thể, mỗi trường chỉ tồn tại ở nơi nó có nghĩa, và đọc <code>data</code> ngoài nhánh <code>ok</code> trở thành một LỖI chứ không còn là một quy ước.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this produce, and what is <code>never</code> actually for?' + code(
              'const n: never = 5;',
            ),
            'Đoạn này cho ra gì, và <code>never</code> thật ra để làm gì?' + code(
              'const n: never = 5;',
            ),
          ),
          options: [
            B(
              'Nothing — <code>never</code> is the top type, so every value is assignable to it; it is the safe place to put a value whose type you do not yet know',
              'Không lỗi — <code>never</code> là kiểu đỉnh nên mọi giá trị đều gán được vào nó; đó là chỗ an toàn để đặt một giá trị bạn chưa biết kiểu',
            ),
            B(
              'TS2322 "Type &#39;5&#39; is not assignable to type &#39;never&#39;", and it is only useful as the return type of a function that always throws',
              'TS2322 "Type &#39;5&#39; is not assignable to type &#39;never&#39;", và nó chỉ hữu ích làm kiểu trả về của một hàm luôn ném lỗi',
            ),
            B(
              'TS2322 "Type &#39;5&#39; is not assignable to type &#39;never&#39;" — <code>never</code> is the EMPTY type, and that emptiness is exactly what makes the exhaustiveness check work: a slot that only accepts a value the compiler has proved cannot exist',
              'TS2322 "Type &#39;5&#39; is not assignable to type &#39;never&#39;" — <code>never</code> là kiểu RỖNG, và chính sự rỗng ấy làm phép kiểm tính đầy đủ chạy được: một ô chỉ nhận giá trị mà trình biên dịch đã chứng minh là không thể tồn tại',
            ),
            B(
              'TS2322, but the fix is <code>const n: never = 5 as never</code>, which is the intended way to build a <code>never</code> value',
              'TS2322, nhưng cách sửa là <code>const n: never = 5 as never</code>, và đó là cách được thiết kế để tạo ra một giá trị <code>never</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>error TS2322: Type &#39;5&#39; is not assignable to type &#39;never&#39;.</code> — and nothing else is either, because <code>never</code> is the type with no values at all. On its own that looks useless; it becomes the sharpest tool in the language the moment you use it as a slot. In a <code>switch</code> over a discriminated union, once every variant has its own <code>case</code>, the value in <code>default</code> has narrowed to <code>never</code> — so <code>const _exhaustive: never = s;</code> compiles today and breaks the day someone adds a variant, in the switch you forgot rather than three modules away at runtime. The three edge types divide cleanly: <code>unknown</code> at the edges (every value in, no operation allowed until you prove what it is), <code>never</code> at the ends (no value in at all), and <code>any</code> for a migration you intend to finish.',
            'Đo được: <code>error TS2322: Type &#39;5&#39; is not assignable to type &#39;never&#39;.</code> — và cũng chẳng thứ gì khác gán được, vì <code>never</code> là kiểu không có giá trị nào cả. Đứng một mình thì nghe vô dụng; nó thành công cụ sắc nhất của cả ngôn ngữ ngay khi bạn dùng nó làm một CÁI Ô. Trong một <code>switch</code> trên union có trường phân biệt, khi mọi biến thể đã có <code>case</code> riêng thì giá trị ở nhánh <code>default</code> thu hẹp về <code>never</code> — nên <code>const _exhaustive: never = s;</code> hôm nay biên dịch được và sẽ vỡ đúng vào ngày có người thêm một biến thể, vỡ ngay tại cái switch bạn quên chứ không phải ở ba module xa lắc lúc chạy. Ba kiểu ở rìa chia rất gọn: <code>unknown</code> ở ranh giới (mọi giá trị vào được, không thao tác nào được phép cho tới khi bạn chứng minh nó là gì), <code>never</code> ở điểm cuối (không giá trị nào vào được), và <code>any</code> cho một cuộc di trú mà bạn có ý định làm cho xong.',
          ),
        }),

        mcq({
          prompt: B(
            'Three edge types, three jobs. Which assignment of type to situation is right?',
            'Ba kiểu ở rìa, ba công việc. Cách gán kiểu cho tình huống nào là ĐÚNG?',
          ),
          options: [
            B(
              '<code>any</code> for a parsed JSON body (it holds anything), <code>unknown</code> for a function that always throws, <code>never</code> for a value you will cast later',
              '<code>any</code> cho một thân JSON đã parse (nó chứa được mọi thứ), <code>unknown</code> cho một hàm luôn ném lỗi, <code>never</code> cho một giá trị bạn sẽ ép kiểu sau',
            ),
            B(
              '<code>unknown</code> for a caught <code>error</code> and a parsed JSON body, <code>never</code> for the <code>default</code> branch of an exhausted switch, <code>any</code> only as a deliberate, temporary escape hatch during a migration',
              '<code>unknown</code> cho một <code>error</code> bắt được và một thân JSON đã parse, <code>never</code> cho nhánh <code>default</code> của một switch đã đủ nhánh, <code>any</code> chỉ dùng như một lối thoát cố ý và tạm thời trong lúc di trú',
            ),
            B(
              '<code>never</code> at the boundary because it rejects malformed input, <code>unknown</code> inside the application, <code>any</code> for third-party callbacks',
              '<code>never</code> ở ranh giới vì nó từ chối dữ liệu sai dạng, <code>unknown</code> ở bên trong ứng dụng, <code>any</code> cho callback của bên thứ ba',
            ),
            B(
              '<code>unknown</code> and <code>any</code> are interchangeable in practice; the only real choice is whether to use <code>never</code>, which is a stylistic preference',
              '<code>unknown</code> và <code>any</code> trên thực tế thay thế nhau được; lựa chọn thật sự duy nhất là có dùng <code>never</code> hay không, và đó là chuyện thẩm mỹ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The three look similar in a signature and behave oppositely. <code>unknown</code> takes every value in and allows no operation until you narrow — so the check is DEFERRED to where the evidence exists, not removed. That makes it the right type for everything crossing the boundary: <code>JSON.parse</code>, a request body, <code>process.env</code>, and the caught <code>error</code> (which <code>useUnknownInCatchVariables</code> already gives you under <code>strict</code>). <code>never</code> takes no value at all, which is what makes it the exhaustiveness slot. <code>any</code> takes every value in AND allows every operation, in both directions, and it spreads: anything derived from an <code>any</code> is also unchecked, across module boundaries, through return types. The hole is not the one line you wrote, it is every expression that touched it — which is why <code>unknown</code> is the right default at a boundary: it propagates the need to check instead of propagating permission.',
            'Ba kiểu này nhìn trong chữ ký thì giống nhau mà hành xử ngược nhau. <code>unknown</code> nhận mọi giá trị vào và không cho thao tác nào cho tới khi bạn thu hẹp — nên phép kiểm được DỜI tới nơi có bằng chứng, chứ không bị xoá đi. Nhờ vậy nó là kiểu đúng cho mọi thứ đi qua ranh giới: <code>JSON.parse</code>, thân request, <code>process.env</code>, và cái <code>error</code> bắt được (thứ mà <code>useUnknownInCatchVariables</code> đã tự trao cho bạn dưới <code>strict</code>). <code>never</code> không nhận giá trị nào, và chính điều đó làm nó thành cái ô cho phép kiểm tính đầy đủ. <code>any</code> thì nhận mọi giá trị vào VÀ cho mọi thao tác, ở cả hai chiều, và nó lan: thứ gì suy ra từ một <code>any</code> cũng không được kiểm, xuyên qua ranh giới module, qua cả kiểu trả về. Lỗ hổng không phải một dòng bạn viết, nó là mọi biểu thức đã chạm vào dòng ấy — và vì thế <code>unknown</code> mới là mặc định đúng ở ranh giới: nó lan truyền NHU CẦU PHẢI KIỂM thay vì lan truyền sự cho phép.',
          ),
        }),

        mcq({
          prompt: B(
            'A service models its result as a discriminated union, then the route flattens it to keep an old client working. What is lost?' + code(
              '// inside the service\n' +
              "type Result = { ok: true; data: Note } | { ok: false; message: string };\n" +
              '\n' +
              '// at the route\n' +
              'res.json({ loading: false, data: result.data, error: result.message });',
            ),
            'Một service mô hình hoá kết quả bằng union có trường phân biệt, rồi route lại làm phẳng nó ra để giữ cho một client cũ chạy được. Mất gì?' + code(
              '// bên trong service\n' +
              "type Result = { ok: true; data: Note } | { ok: false; message: string };\n" +
              '\n' +
              '// ở route\n' +
              'res.json({ loading: false, data: result.data, error: result.message });',
            ),
          ),
          options: [
            B(
              'Everything the union bought, at the narrowest point it passes through: the client is back to guessing which combination of flags it received, with no compiler on that side to help. Keep the discriminated shape across the wire — the <code>ok: true</code> / <code>ok: false</code> envelope IS this pattern',
              'Mất tất cả những gì union mang lại, ngay tại chỗ hẹp nhất nó đi qua: phía client quay về đoán xem mình vừa nhận tổ hợp cờ nào, mà bên ấy không có trình biên dịch nào giúp. Hãy giữ hình dạng có trường phân biệt xuyên qua đường truyền — cái phong bì <code>ok: true</code> / <code>ok: false</code> CHÍNH LÀ mẫu này',
            ),
            B(
              'Nothing meaningful — the union already did its job inside the service, and what crosses the wire is JSON, which carries no types at all, so no compile-time guarantee could have survived that hop whichever shape you had chosen',
              'Chẳng mất gì đáng kể — union đã làm xong việc của nó bên trong service, còn thứ đi qua đường truyền là JSON, thứ không mang theo kiểu nào cả, nên không bảo đảm lúc-biên-dịch nào sống sót nổi qua bước nhảy ấy dù bạn chọn hình dạng gì',
            ),
            B(
              'Only performance: the flattened object carries three keys where the union carried two, so the response takes measurably longer to serialise and parse, and on a list endpoint that per-item overhead is what shows up in the latency numbers',
              'Chỉ mất hiệu năng: object làm phẳng mang ba khoá trong khi union chỉ mang hai, nên phản hồi tốn thêm thời gian tuần tự hoá và phân tích một cách đo được, và ở một endpoint danh sách thì phần phụ trội trên mỗi phần tử ấy chính là thứ hiện ra trong số đo độ trễ',
            ),
            B(
              'Only the exhaustiveness check — narrowing still works on the client because <code>loading: false</code> is a literal discriminant, so a client that declares the payload type keeps a working <code>if</code> and merely loses the compile error for an unhandled variant',
              'Chỉ mất phép kiểm tính đầy đủ — phía client vẫn thu hẹp kiểu được vì <code>loading: false</code> là một trường phân biệt kiểu literal, nên một client có khai kiểu cho payload vẫn giữ được một câu <code>if</code> chạy đúng và chỉ mất đi lỗi biên dịch cho biến thể chưa xử lý',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A guarantee is only as strong as the narrowest point it passes through. The union survives beautifully inside the service and then dies at the wire: what the client receives is the eight-combination flag object again, and it has to infer the state instead of narrowing to it. Note the two options that sound reasonable and are not. It is not a performance question. And <code>loading: false</code> does not save you: the field on the OUTGOING literal happens to be a literal, but the client\'s declared type for that payload will be <code>boolean</code> — narrowing needs a literal-typed discriminant in the type the consumer holds. Keep the shape: <code>{ ok: true, data }</code> / <code>{ ok: false, error }</code> is the same pattern the chapter-11 envelope uses, precisely so the client can narrow rather than guess.',
            'Một bảo đảm chỉ mạnh bằng chỗ hẹp nhất mà nó đi qua. Union sống rất đẹp bên trong service rồi chết ngay ở đường truyền: thứ client nhận được lại là cái object tám tổ hợp cờ, và nó phải SUY ĐOÁN trạng thái thay vì thu hẹp về trạng thái. Chú ý hai lựa chọn nghe có lý mà sai. Đây không phải chuyện hiệu năng. Và <code>loading: false</code> không cứu được bạn: cái trường ấy trong object literal ĐANG GỬI ĐI tình cờ là literal, nhưng kiểu mà client khai cho payload đó sẽ là <code>boolean</code> — muốn thu hẹp thì trường phân biệt phải mang kiểu literal trong chính cái kiểu bên tiêu thụ đang cầm. Hãy giữ nguyên hình dạng: <code>{ ok: true, data }</code> / <code>{ ok: false, error }</code> chính là mẫu mà cái phong bì của chương 11 dùng, đúng để client thu hẹp được thay vì phải đoán.',
          ),
        }),

        mcq({
          prompt: B(
            'A team adds <code>src/types/index.ts</code> that re-exports every type in the project, so files can write <code>import { User, Note, Tag } from &#39;@/types&#39;</code>. What does that cost?',
            'Một nhóm thêm <code>src/types/index.ts</code> re-export mọi kiểu trong dự án, để các file viết được <code>import { User, Note, Tag } from &#39;@/types&#39;</code>. Cái giá của việc đó là gì?',
          ),
          options: [
            B(
              'Nothing — a barrel that only re-exports types is erased along with the types themselves, so it adds no files to the program at compile time and emits no module at all at run time, which is exactly why the pattern is recommended for shared shapes',
              'Không gì cả — một barrel chỉ re-export kiểu thì bị xoá cùng với chính các kiểu ấy, nên nó không thêm file nào vào chương trình lúc biên dịch và không sinh ra module nào lúc chạy, và đó đúng là lý do mẫu này được khuyến nghị cho các hình dạng dùng chung',
            ),
            B(
              'Every file that touches one type pulls the whole graph into the program — slower <code>tsc</code>, defeated tree-shaking, and import cycles that surface as <code>undefined</code> at runtime depending on which module happened to load first. Import from the specific module; if a barrel must exist, at least make its re-exports <code>export type</code>',
              'Mọi file chạm vào MỘT kiểu đều kéo cả đồ thị vào chương trình — <code>tsc</code> chậm đi, tree-shaking mất tác dụng, và sinh ra vòng import lộ ra thành <code>undefined</code> lúc chạy, tuỳ module nào tình cờ nạp trước. Hãy import từ đúng module cụ thể; nếu buộc phải có barrel thì ít nhất cho các re-export của nó là <code>export type</code>',
            ),
            B(
              'Only a stylistic cost — the compiler resolves a barrel lazily and loads just the names actually referenced, and the bundler follows the same path, so a file importing three names never pulls in the several hundred it did not ask for',
              'Chỉ tốn về mặt phong cách — trình biên dịch phân giải barrel một cách lười và chỉ nạp đúng những tên thật sự được tham chiếu, còn bộ đóng gói cũng đi theo đường đó, nên một file import ba cái tên không bao giờ kéo theo mấy trăm cái nó không hề xin',
            ),
            B(
              'It breaks <code>isolatedModules</code> outright — a per-file transpiler cannot follow a re-export chain to decide whether a name is a type or a value, so every barrel import becomes ambiguous and the fix is to turn that flag off for the project',
              'Nó phá vỡ hẳn <code>isolatedModules</code> — một bộ transpile theo từng file không lần được chuỗi re-export để quyết định một cái tên là kiểu hay là giá trị, nên mọi lệnh import qua barrel đều thành nhập nhằng và cách sửa là tắt cờ đó cho cả dự án',
            ),
          ],
          correct: 1,
          explanation: EX(
            'It reads beautifully, which is why it spreads. The cost is that one import becomes hundreds of loaded modules: <code>tsc</code> has more program to build, the bundler can no longer prove what is unused, and — the worst part — the cycles depend on load order, so they appear on the server and not locally. There is a second, slower failure too: a folder every module imports from couples everything to everything, and nothing can be deleted because nobody knows who uses it. The organising rule the chapter actually gives is the opposite one: keep a type as close as possible to what uses it — a component\'s props next to the component, a route\'s DTO next to the route — and promote it to a shared module only when two places genuinely need it, sharing it with <code>import type</code> so it never drags runtime code across a boundary.',
            'Nó đọc lên rất đẹp, và vì thế nó lan ra. Cái giá là một lệnh import biến thành hàng trăm module được nạp: <code>tsc</code> phải dựng một chương trình to hơn, bộ đóng gói không còn chứng minh được thứ gì không dùng, và — phần tệ nhất — các vòng import phụ thuộc THỨ TỰ NẠP, nên chúng hiện ra trên máy chủ mà không hiện ở máy bạn. Còn một cú hỏng thứ hai, chậm hơn: một thư mục mà mọi module đều import từ đó khiến mọi thứ dính chặt vào mọi thứ, và không gì xoá được vì chẳng ai biết ai đang dùng. Quy tắc tổ chức mà chương này thật sự đưa ra thì ngược lại: giữ một kiểu càng gần thứ dùng nó càng tốt — props của component nằm cạnh component, DTO của route nằm cạnh route — và chỉ đưa nó lên một module dùng chung khi thật sự có hai nơi cần, chia sẻ bằng <code>import type</code> để nó không bao giờ kéo mã chạy được qua một ranh giới.',
          ),
        }),

        mcq({
          prompt: B(
            'The course\'s closing warning. <code>tsc --noEmit</code> is green on your project. Which statement about what that does and does not prove is right?',
            'Lời cảnh báo khép lại của khoá học. <code>tsc --noEmit</code> xanh trên dự án của bạn. Phát biểu nào về điều đó chứng minh được và KHÔNG chứng minh được là ĐÚNG?',
          ),
          options: [
            B(
              'It proves the program is correct: under <code>strict</code>, a compiling program is a program whose behaviour matches its specification',
              'Nó chứng minh chương trình đúng: dưới <code>strict</code>, một chương trình biên dịch được là chương trình có hành vi khớp với đặc tả',
            ),
            B(
              'It proves nothing at all, which is why type-checking is optional overhead compared with a good test suite',
              'Nó chẳng chứng minh gì cả, và vì thế kiểm kiểu chỉ là chi phí phụ tuỳ chọn so với một bộ test tử tế',
            ),
            B(
              'It proves the runtime data matches your annotations, since <code>strict</code> makes every annotation an enforced contract at both compile time and run time',
              'Nó chứng minh dữ liệu lúc chạy khớp với chú thích kiểu của bạn, vì <code>strict</code> biến mọi chú thích thành một hợp đồng được cưỡng chế ở cả lúc biên dịch lẫn lúc chạy',
            ),
            B(
              'It proves your files are consistent WITH EACH OTHER, and nothing about the bytes arriving at runtime, the database\'s actual contents, the version of a library installed, or whether the deployed image is the one you built',
              'Nó chứng minh các file của bạn nhất quán VỚI NHAU, và không chứng minh gì về những byte đến lúc chạy, nội dung thật của cơ sở dữ liệu, phiên bản thư viện đang cài, hay chuyện ảnh đã deploy có đúng là ảnh bạn dựng ra không',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Everything the compiler does is a check of the code you wrote against itself. That is a real guarantee — under <code>strict</code>, if it compiles, a specific class of mistakes is impossible — and it is bounded exactly where the boundary of your own program is. <code>function add(a: number, b: number) { return a - b }</code> compiles perfectly and is wrong. This repo\'s own history is a list of the gaps: a seed that type-checked against its own hand-copied union and broke production; a build that was green because <code>tsc</code> never looked at <code>prisma/**</code>; an image that built and pushed cleanly with a Prisma engine for the wrong libc. Types remove a category of bugs completely — treat the remaining categories as still yours. Validate at the boundary, run the thing, and check what actually shipped.',
            'Mọi thứ trình biên dịch làm đều là phép kiểm đoạn mã bạn viết với chính nó. Đó là một bảo đảm THẬT — dưới <code>strict</code>, hễ biên dịch được thì một lớp sai lầm cụ thể là không thể xảy ra — và nó bị chặn đúng ở nơi ranh giới chương trình của bạn kết thúc. <code>function add(a: number, b: number) { return a - b }</code> biên dịch hoàn hảo và sai bét. Lịch sử của chính repo này là một danh sách các khe hở: một file seed tự kiểm với bản union chép tay của mình rồi làm vỡ production; một build xanh vì <code>tsc</code> chưa từng ngó tới <code>prisma/**</code>; một ảnh dựng sạch, đẩy sạch, mà mang engine Prisma của sai libc. Kiểu xoá sạch được một LOẠI bug — hãy coi những loại còn lại vẫn là của bạn. Kiểm dữ liệu ở ranh giới, chạy thử cái thứ đó, và kiểm xem cái gì thật sự đã lên production.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — A reducer where illegal states cannot be written (chapters 16 + 12).</b> <code>State</code> and <code>Action</code> are both discriminated unions. Implement two functions that <b>never</b> use a cast, a non-null assertion, or <code>any</code>.</p>' +
            '<p><code>reduce(state, action): State</code> — <code>switch</code> on <code>action.type</code>:</p>' +
            '<ul>' +
            '<li><code>FETCH</code> — if the state is already <code>loading</code>, return it unchanged (a double fetch is ignored). Otherwise go to <code>loading</code> with <code>startedAt: action.at</code> and <code>attempt</code> = the previous <code>error</code> state\'s <code>attempt</code> + 1, or <b>1</b> from any other state.</li>' +
            '<li><code>RESOLVE</code> — only from <code>loading</code>: go to <code>success</code> with the action\'s data. From any other state, return the state unchanged (a late response must not overwrite anything).</li>' +
            '<li><code>REJECT</code> — only from <code>loading</code>: go to <code>error</code> with the message, carrying the loading state\'s <code>attempt</code> across. Otherwise unchanged.</li>' +
            '<li><code>RESET</code> — always go to <code>{ status: &quot;idle&quot; }</code>.</li>' +
            '</ul>' +
            '<p><code>describe(state): string</code> — <code>switch</code> on <code>state.status</code>, returning exactly: <code>&quot;idle&quot;</code> · <code>&quot;loading since &lt;startedAt&gt; (attempt &lt;attempt&gt;)&quot;</code> · <code>&quot;success: &lt;n&gt; item(s)&quot;</code> · <code>&quot;error: &lt;message&gt; (attempt &lt;attempt&gt;)&quot;</code>.</p>' +
            '<p><b>Both switches must end in a real exhaustiveness check</b> — a <code>default</code> branch that assigns the value to a <code>const _exhaustive: never</code> and returns it, so adding a fifth action or a fifth state breaks the build here rather than at runtime. Keep the given types and the script exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Một reducer mà trạng thái sai không viết ra được (chương 16 + 12).</b> <code>State</code> và <code>Action</code> đều là union có trường phân biệt. Hãy cài đặt hai hàm mà <b>tuyệt đối không</b> dùng ép kiểu, không dùng dấu chấm than, không dùng <code>any</code>.</p>' +
            '<p><code>reduce(state, action): State</code> — <code>switch</code> trên <code>action.type</code>:</p>' +
            '<ul>' +
            '<li><code>FETCH</code> — nếu trạng thái đã là <code>loading</code> thì trả về nguyên vẹn (bấm tải hai lần thì bỏ qua). Ngược lại chuyển sang <code>loading</code> với <code>startedAt: action.at</code> và <code>attempt</code> = <code>attempt</code> của trạng thái <code>error</code> trước đó cộng 1, hoặc bằng <b>1</b> nếu đến từ trạng thái khác.</li>' +
            '<li><code>RESOLVE</code> — chỉ từ <code>loading</code>: chuyển sang <code>success</code> với dữ liệu của action. Từ trạng thái khác thì trả về nguyên vẹn (một phản hồi về muộn không được ghi đè lên cái gì cả).</li>' +
            '<li><code>REJECT</code> — chỉ từ <code>loading</code>: chuyển sang <code>error</code> với thông điệp, mang theo <code>attempt</code> của trạng thái loading. Ngược lại giữ nguyên.</li>' +
            '<li><code>RESET</code> — luôn về <code>{ status: &quot;idle&quot; }</code>.</li>' +
            '</ul>' +
            '<p><code>describe(state): string</code> — <code>switch</code> trên <code>state.status</code>, trả về đúng: <code>&quot;idle&quot;</code> · <code>&quot;loading since &lt;startedAt&gt; (attempt &lt;attempt&gt;)&quot;</code> · <code>&quot;success: &lt;n&gt; item(s)&quot;</code> · <code>&quot;error: &lt;message&gt; (attempt &lt;attempt&gt;)&quot;</code>.</p>' +
            '<p><b>Cả hai switch đều phải kết thúc bằng một phép kiểm tính đầy đủ THẬT</b> — một nhánh <code>default</code> gán giá trị cho <code>const _exhaustive: never</code> rồi trả về nó, để thêm action thứ năm hay trạng thái thứ năm là build vỡ ngay tại đây chứ không phải lúc chạy. Giữ nguyên phần kiểu và kịch bản cho sẵn, và không cài thêm thư viện nào.</p>',
          ),
          language: 'typescript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'type State =\n' +
            "  | { status: 'idle' }\n" +
            "  | { status: 'loading'; startedAt: number; attempt: number }\n" +
            "  | { status: 'success'; data: readonly string[] }\n" +
            "  | { status: 'error'; message: string; attempt: number };\n" +
            '\n' +
            'type Action =\n' +
            "  | { type: 'FETCH'; at: number }\n" +
            "  | { type: 'RESOLVE'; data: readonly string[] }\n" +
            "  | { type: 'REJECT'; message: string }\n" +
            "  | { type: 'RESET' };\n" +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function reduce(state: State, action: Action): State {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function describe(state: State): string {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SCRIPT: Action[] = [\n' +
            "  { type: 'RESOLVE', data: ['a'] },\n" +
            "  { type: 'FETCH', at: 100 },\n" +
            "  { type: 'FETCH', at: 200 },\n" +
            "  { type: 'REJECT', message: 'network' },\n" +
            "  { type: 'RESOLVE', data: ['a', 'b'] },\n" +
            "  { type: 'FETCH', at: 300 },\n" +
            "  { type: 'RESOLVE', data: ['a', 'b', 'c'] },\n" +
            "  { type: 'REJECT', message: 'too late' },\n" +
            "  { type: 'RESET' },\n" +
            '];\n' +
            "let state: State = { status: 'idle' };\n" +
            'console.log(describe(state));\n' +
            'for (const action of SCRIPT) {\n' +
            '  state = reduce(state, action);\n' +
            "  console.log(action.type + ' -> ' + describe(state));\n" +
            '}\n',
          expectedOutput:
            'idle\n' +
            'RESOLVE -> idle\n' +
            'FETCH -> loading since 100 (attempt 1)\n' +
            'FETCH -> loading since 100 (attempt 1)\n' +
            'REJECT -> error: network (attempt 1)\n' +
            'RESOLVE -> error: network (attempt 1)\n' +
            'FETCH -> loading since 300 (attempt 2)\n' +
            'RESOLVE -> success: 3 item(s)\n' +
            'REJECT -> success: 3 item(s)\n' +
            'RESET -> idle',
          sampleSolution:
            'function reduce(state: State, action: Action): State {\n' +
            '  switch (action.type) {\n' +
            "    case 'FETCH': {\n" +
            "      if (state.status === 'loading') return state;\n" +
            '      // `attempt` chỉ tồn tại trên biến thể error — đọc được vì đã thu hẹp.\n' +
            "      const attempt = state.status === 'error' ? state.attempt + 1 : 1;\n" +
            "      return { status: 'loading', startedAt: action.at, attempt };\n" +
            '    }\n' +
            "    case 'RESOLVE':\n" +
            "      return state.status === 'loading' ? { status: 'success', data: action.data } : state;\n" +
            "    case 'REJECT':\n" +
            "      return state.status === 'loading'\n" +
            "        ? { status: 'error', message: action.message, attempt: state.attempt }\n" +
            '        : state;\n' +
            "    case 'RESET':\n" +
            "      return { status: 'idle' };\n" +
            '    default: {\n' +
            '      const _exhaustive: never = action;\n' +
            '      return _exhaustive;\n' +
            '    }\n' +
            '  }\n' +
            '}\n' +
            '\n' +
            'function describe(state: State): string {\n' +
            '  switch (state.status) {\n' +
            "    case 'idle': return 'idle';\n" +
            "    case 'loading': return 'loading since ' + state.startedAt + ' (attempt ' + state.attempt + ')';\n" +
            "    case 'success': return 'success: ' + state.data.length + ' item(s)';\n" +
            "    case 'error': return 'error: ' + state.message + ' (attempt ' + state.attempt + ')';\n" +
            '    default: {\n' +
            '      const _exhaustive: never = state;\n' +
            '      return _exhaustive;\n' +
            '    }\n' +
            '  }\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Validate at the edge, trust inside (chapters 13 + 16).</b> This is the whole course in one function, written by hand so it needs no library. Data arrives as <code>unknown</code>; turn it into a trustworthy <code>Note</code>, or into a list of everything wrong with it — then decide explicitly what leaves the process.</p>' +
            '<p><code>isRecord(raw): raw is Record&lt;string, unknown&gt;</code> — a type guard: true for a non-null, non-array object.</p>' +
            '<p><code>parseNote(raw: unknown): Parsed&lt;Note&gt;</code> — if <code>raw</code> is not a record, fail immediately with the single issue <code>{ path: &quot;&quot;, message: &quot;expected an object&quot; }</code>. Otherwise collect <b>every</b> problem, in this field order:</p>' +
            '<ul>' +
            '<li><code>id</code> — an integer, or a string that <code>Number()</code> turns into one (so <code>&quot;2&quot;</code> is accepted and coerced). Otherwise <code>{ path: &quot;id&quot;, message: &quot;expected an integer&quot; }</code>.</li>' +
            '<li><code>title</code> — a string; <code>&quot;expected a string&quot;</code> if it is not, <code>&quot;must not be blank&quot;</code> if it trims to empty. Store it <b>trimmed</b>.</li>' +
            '<li><code>tags</code> — optional, defaults to <code>[]</code>. If present it must be an array of strings, else <code>&quot;expected an array of strings&quot;</code>.</li>' +
            '<li><code>authorEmail</code> — a string containing <code>&quot;@&quot;</code>, else <code>&quot;expected an email address&quot;</code>.</li>' +
            '<li><code>passwordHash</code> — a string, else <code>&quot;expected a string&quot;</code>.</li>' +
            '</ul>' +
            '<p><code>toPublic(note: Note): PublicNote</code> — build the outgoing shape <b>explicitly</b>, listing the three fields that may leave. Do not spread the note and delete keys: what leaves the process should be a decision, not a side effect of the model.</p>' +
            '<p>Keep the given types, data and printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Kiểm ở ranh giới, tin ở bên trong (chương 13 + 16).</b> Đây là cả khoá học gói trong một hàm, viết tay nên không cần thư viện nào. Dữ liệu đến dưới dạng <code>unknown</code>; hãy biến nó thành một <code>Note</code> đáng tin, hoặc thành danh sách mọi thứ đang sai — rồi quyết định một cách tường minh thứ gì được rời khỏi tiến trình.</p>' +
            '<p><code>isRecord(raw): raw is Record&lt;string, unknown&gt;</code> — một type guard: đúng khi là object khác null và không phải mảng.</p>' +
            '<p><code>parseNote(raw: unknown): Parsed&lt;Note&gt;</code> — nếu <code>raw</code> không phải một bản ghi thì hỏng ngay với đúng một issue <code>{ path: &quot;&quot;, message: &quot;expected an object&quot; }</code>. Ngược lại thì gom <b>mọi</b> lỗi, theo đúng thứ tự trường sau:</p>' +
            '<ul>' +
            '<li><code>id</code> — một số nguyên, hoặc một chuỗi mà <code>Number()</code> biến thành số nguyên (nên <code>&quot;2&quot;</code> được nhận và ép về số). Ngược lại <code>{ path: &quot;id&quot;, message: &quot;expected an integer&quot; }</code>.</li>' +
            '<li><code>title</code> — một chuỗi; <code>&quot;expected a string&quot;</code> nếu không phải, <code>&quot;must not be blank&quot;</code> nếu cắt khoảng trắng xong thì rỗng. Lưu bản <b>đã cắt khoảng trắng</b>.</li>' +
            '<li><code>tags</code> — tuỳ chọn, mặc định <code>[]</code>. Nếu có thì phải là mảng chuỗi, không thì <code>&quot;expected an array of strings&quot;</code>.</li>' +
            '<li><code>authorEmail</code> — một chuỗi có chứa <code>&quot;@&quot;</code>, không thì <code>&quot;expected an email address&quot;</code>.</li>' +
            '<li><code>passwordHash</code> — một chuỗi, không thì <code>&quot;expected a string&quot;</code>.</li>' +
            '</ul>' +
            '<p><code>toPublic(note: Note): PublicNote</code> — dựng hình dạng đi ra một cách <b>tường minh</b>, liệt kê đúng ba trường được phép rời đi. Đừng spread cả ghi chú rồi xoá bớt khoá: thứ rời khỏi tiến trình phải là một QUYẾT ĐỊNH, không phải hệ quả phụ của mô hình dữ liệu.</p>' +
            '<p>Giữ nguyên phần kiểu, dữ liệu và vòng lặp in kết quả cho sẵn, và không cài thêm thư viện nào.</p>',
          ),
          language: 'typescript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'interface Note {\n' +
            '  id: number;\n' +
            '  title: string;\n' +
            '  tags: readonly string[];\n' +
            '  authorEmail: string;\n' +
            '  passwordHash: string;\n' +
            '}\n' +
            "type PublicNote = Omit<Note, 'passwordHash' | 'authorEmail'>;\n" +
            '\n' +
            'type Issue = { path: string; message: string };\n' +
            'type Parsed<T> =\n' +
            '  | { success: true; data: T }\n' +
            '  | { success: false; issues: readonly Issue[] };\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function isRecord(raw: unknown): raw is Record<string, unknown> {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function parseNote(raw: unknown): Parsed<Note> {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function toPublic(note: Note): PublicNote {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CASES: unknown[] = [\n' +
            "  { id: 1, title: '  Types  ', authorEmail: 'a@b.c', passwordHash: 'h1', tags: ['ts', 'zod'] },\n" +
            "  { id: '2', title: 'Coerced', authorEmail: 'a@b.c', passwordHash: 'h2' },\n" +
            "  { id: 3, title: '   ', authorEmail: 'nope', passwordHash: 'h3' },\n" +
            "  { id: 1.5, title: 'Bad id', authorEmail: 'a@b.c', passwordHash: 'h4', tags: ['ok', 7] },\n" +
            '  {},\n' +
            "  'not an object',\n" +
            '];\n' +
            'for (const raw of CASES) {\n' +
            '  const r = parseNote(raw);\n' +
            "  if (!r.success) console.log('FAIL ' + JSON.stringify(r.issues));\n" +
            "  else console.log('OK   ' + JSON.stringify(toPublic(r.data)));\n" +
            '}\n',
          expectedOutput:
            'OK   {"id":1,"title":"Types","tags":["ts","zod"]}\n' +
            'OK   {"id":2,"title":"Coerced","tags":[]}\n' +
            'FAIL [{"path":"title","message":"must not be blank"},{"path":"authorEmail","message":"expected an email address"}]\n' +
            'FAIL [{"path":"id","message":"expected an integer"},{"path":"tags","message":"expected an array of strings"}]\n' +
            'FAIL [{"path":"id","message":"expected an integer"},{"path":"title","message":"expected a string"},{"path":"authorEmail","message":"expected an email address"},{"path":"passwordHash","message":"expected a string"}]\n' +
            'FAIL [{"path":"","message":"expected an object"}]',
          sampleSolution:
            'function isRecord(raw: unknown): raw is Record<string, unknown> {\n' +
            "  return typeof raw === 'object' && raw !== null && !Array.isArray(raw);\n" +
            '}\n' +
            '\n' +
            'function parseNote(raw: unknown): Parsed<Note> {\n' +
            "  if (!isRecord(raw)) return { success: false, issues: [{ path: '', message: 'expected an object' }] };\n" +
            '\n' +
            '  const issues: Issue[] = [];\n' +
            '\n' +
            '  const rawId = raw.id;\n' +
            '  let id = 0;\n' +
            "  if (typeof rawId === 'number' && Number.isInteger(rawId)) id = rawId;\n" +
            "  else if (typeof rawId === 'string' && Number.isInteger(Number(rawId))) id = Number(rawId);\n" +
            "  else issues.push({ path: 'id', message: 'expected an integer' });\n" +
            '\n' +
            '  const rawTitle = raw.title;\n' +
            "  let title = '';\n" +
            "  if (typeof rawTitle !== 'string') issues.push({ path: 'title', message: 'expected a string' });\n" +
            "  else if (rawTitle.trim() === '') issues.push({ path: 'title', message: 'must not be blank' });\n" +
            '  else title = rawTitle.trim();\n' +
            '\n' +
            '  const rawTags = raw.tags;\n' +
            '  let tags: readonly string[] = [];\n' +
            '  if (rawTags !== undefined) {\n' +
            "    if (!Array.isArray(rawTags) || !rawTags.every((t) => typeof t === 'string')) {\n" +
            "      issues.push({ path: 'tags', message: 'expected an array of strings' });\n" +
            '    } else {\n' +
            '      // Đã chứng minh từng phần tử là chuỗi ở dòng trên — map để lấy string[]\n' +
            '      // thật, thay vì ép kiểu.\n' +
            '      tags = rawTags.map((t) => String(t));\n' +
            '    }\n' +
            '  }\n' +
            '\n' +
            '  const rawEmail = raw.authorEmail;\n' +
            "  let authorEmail = '';\n" +
            "  if (typeof rawEmail !== 'string' || !rawEmail.includes('@')) {\n" +
            "    issues.push({ path: 'authorEmail', message: 'expected an email address' });\n" +
            '  } else {\n' +
            '    authorEmail = rawEmail;\n' +
            '  }\n' +
            '\n' +
            '  const rawHash = raw.passwordHash;\n' +
            "  let passwordHash = '';\n" +
            "  if (typeof rawHash !== 'string') issues.push({ path: 'passwordHash', message: 'expected a string' });\n" +
            '  else passwordHash = rawHash;\n' +
            '\n' +
            '  if (issues.length > 0) return { success: false, issues };\n' +
            '  return { success: true, data: { id, title, tags, authorEmail, passwordHash } };\n' +
            '}\n' +
            '\n' +
            'function toPublic(note: Note): PublicNote {\n' +
            '  return { id: note.id, title: note.title, tags: note.tags };\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
