/** Giảng theo slide — bài 15.2 Incremental & project references (deck ts-15-2, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-15-2', 'Incremental & project references', 'Incremental & project references', [
  [1, 'Incremental & project references',
    `<p>The cheapest work is the work you do not repeat. An <em>incremental</em> build remembers what it checked last time in a <code>.tsbuildinfo</code> file, so a second build with no changes is near-instant. <em>Project references</em> split a big codebase into separate projects that build in dependency order and re-check only the ones that changed.</p>`,
    `<p>Việc rẻ nhất là việc bạn không lặp lại. Một build <em>incremental</em> nhớ thứ nó đã kiểm lần trước trong một tệp <code>.tsbuildinfo</code>, nên một build thứ hai không thay đổi gần như tức thời. <em>Project references</em> tách một codebase lớn thành các dự án riêng build theo thứ tự phụ thuộc và kiểm lại chỉ những cái đã đổi.</p>`],
  [2, 'The first build does the work',
    `<p>Run <code>tsc -b</code> on a project with references and it builds each project in order — the dependency (<code>core</code>) first, then the one that uses it (<code>app</code>). The <code>--verbose</code> flag shows the plan: each project is “out of date” (no build info yet) and gets built.</p>`,
    `<p>Chạy <code>tsc -b</code> trên một dự án có references và nó build từng dự án theo thứ tự — dependency (<code>core</code>) trước, rồi cái dùng nó (<code>app</code>). Cờ <code>--verbose</code> cho thấy kế hoạch: mỗi dự án “out of date” (chưa có build info) và được build.</p>`],
  [3, 'The second build is near-instant',
    `<p>Run the same command again with nothing changed and every project is “up to date” — tsc compares each file’s timestamp to the <code>.tsbuildinfo</code> and finds no work to do. This is the payoff on every edit-save-check cycle and in CI with a warm cache: you only pay for what you touched.</p>`,
    `<p>Chạy lại cùng lệnh mà không đổi gì và mọi dự án “up to date” — tsc so timestamp mỗi tệp với <code>.tsbuildinfo</code> và thấy không có việc. Đây là phần thưởng ở mỗi vòng sửa-lưu-kiểm và trong CI với cache ấm: bạn chỉ trả cho thứ bạn chạm.</p>`],
  [4, 'Why references, not one big project',
    `<p>Project references need <code>composite: true</code> and make each project emit its declaration files, so a consumer type-checks against the <em>built</em> types of its dependency, not its source. That is what lets tsc skip an unchanged project entirely — and lets a monorepo build its packages in the right order, in parallel where possible.</p>`,
    `<p>Project references cần <code>composite: true</code> và làm mỗi dự án phát ra các tệp khai báo của nó, nên một bên tiêu thụ kiểm kiểu với kiểu <em>đã build</em> của dependency, không phải source của nó. Đó là thứ cho tsc bỏ qua hẳn một dự án không đổi — và cho một monorepo build các package theo đúng thứ tự, song song khi được.</p>`],
  [5, 'At a glance',
    `<p><code>tsc -b</code> builds projects in dependency order and writes a <code>.tsbuildinfo</code>; a second build with no changes reports every project “up to date”. Project references (<code>composite: true</code>) let each project be checked independently against its dependencies’ built types — the basis of a fast monorepo build.</p>`,
    `<p><code>tsc -b</code> build các dự án theo thứ tự phụ thuộc và ghi một <code>.tsbuildinfo</code>; một build thứ hai không đổi báo mọi dự án “up to date”. Project references (<code>composite: true</code>) cho mỗi dự án được kiểm độc lập với kiểu đã build của dependency — nền tảng của một build monorepo nhanh.</p>`],
  [6, 'What is next',
    `<p>Incremental builds and references cut the work by not repeating it. The next lever is to not <em>do</em> some of it at all: 15.3 separates type-checking (slow, whole-program) from transpiling (fast, per-file), so your dev loop does not wait for the checker.</p>`,
    `<p>Incremental build và references cắt việc bằng cách không lặp. Đòn bẩy kế là không <em>làm</em> một phần của nó chút nào: 15.3 tách kiểm kiểu (chậm, toàn chương trình) khỏi transpile (nhanh, từng tệp), nên vòng dev của bạn không chờ bộ kiểm.</p>`],
]);
