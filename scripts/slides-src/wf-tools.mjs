/** Web Foundations · Deck wf-tools — Chương 1: Terminal, VS Code, Git, npm. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-tools', code: 'WF · CH1', title: 'Bộ công cụ', sub: 'Nền tảng Lập trình Web · Chương 1' };

export const slides = [
  { kind: 'cover', t: 'Chương 1 — Bộ công cụ', sub: 'Terminal · VS Code · Git · GitHub · Node & npm',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Terminal — nói chuyện với máy bằng chữ</li>
      <li>VS Code — xưởng làm việc</li>
      <li>Git — cỗ máy thời gian cho mã</li>
      <li>GitHub — mã của bạn trên đám mây</li>
      <li>Node &amp; npm — chạy JS và cài thư viện ⭐</li>
    </ol>` },

  { t: 'Terminal — mười lệnh đủ dùng', body: `
    ${code(`pwd             # đang đứng ở thư mục nào
ls              # liệt kê file (Windows: dir)
cd ten-thu-muc  # đi vào
cd ..           # lùi ra một cấp
mkdir du-an     # tạo thư mục
touch a.txt     # tạo file rỗng (Windows: type nul > a.txt)
cat a.txt       # xem nội dung file
rm a.txt        # xoá file — KHÔNG có thùng rác
clear           # dọn màn hình
code .          # mở thư mục hiện tại bằng VS Code`, 'bash')}
    <div class="box warn"><code>rm</code> xoá thẳng, không qua thùng rác. Gõ chậm lại khi có <code>rm</code>, nhất là khi kèm <code>-r</code>.</div>` },

  { t: 'Hai mẹo tiết kiệm nửa thời gian gõ', body: `
    <div class="two">
      <div class="card"><b>Tab để tự điền</b><p>Gõ vài chữ đầu của tên thư mục rồi nhấn <b>Tab</b>. Vừa nhanh vừa không gõ sai tên.</p></div>
      <div class="card"><b>Mũi tên ↑ để lặp lại</b><p>Gọi lại lệnh vừa chạy. Sửa một chữ rồi Enter, thay vì gõ lại cả dòng.</p></div>
    </div>
    <div class="box ok">Đường dẫn có dấu cách thì phải bọc nháy: <code>cd "piza shop"</code> — không thì máy hiểu thành hai tham số.</div>` },

  { t: 'VS Code — cài bốn tiện ích này trước', body: `
    <table class="t">
      <tr><th>Tiện ích</th><th>Nó làm gì</th></tr>
      <tr><td><b>Prettier</b></td><td>Tự canh lề, xuống dòng khi lưu — hết cãi nhau về khoảng trắng</td></tr>
      <tr><td><b>ESLint</b></td><td>Gạch đỏ lỗi ngay khi gõ, trước cả khi chạy</td></tr>
      <tr><td><b>ES7+ React snippets</b></td><td>Gõ <code>rafce</code> ra sẵn khung component ⭐</td></tr>
      <tr><td><b>Auto Rename Tag</b></td><td>Sửa thẻ mở thì thẻ đóng tự đổi theo</td></tr>
    </table>
    <div class="box">Bật <b>Format On Save</b> trong Settings. Mã tự đẹp mà không phải nghĩ.</div>` },

  { t: 'Phím tắt VS Code đáng thuộc', body: `
    <div class="grid2">
      <div class="f"><b>Ctrl/Cmd + P</b><br/>Mở nhanh file theo tên</div>
      <div class="f"><b>Ctrl/Cmd + Shift + F</b><br/>Tìm chữ trong CẢ dự án</div>
      <div class="f"><b>Ctrl/Cmd + /</b><br/>Chú thích dòng đang đứng</div>
      <div class="f"><b>Ctrl/Cmd + D</b><br/>Chọn thêm chỗ giống hệt → sửa nhiều chỗ một lúc</div>
      <div class="f"><b>Alt/Option + ↑↓</b><br/>Đẩy dòng lên/xuống</div>
      <div class="f"><b>Ctrl + \`</b><br/>Bật/tắt terminal ngay trong VS Code</div>
    </div>` },

  { t: 'Git — ba vùng phải hiểu', body: `
    <div class="dg">
      <div class="bx">Thư mục làm việc<br/><small>bạn đang sửa</small></div>
      <div class="ar">→<small>git add</small></div>
      <div class="bx st">Staging<br/><small>chọn để ghi</small></div>
      <div class="ar">→<small>git commit</small></div>
      <div class="bx">Lịch sử<br/><small>đã ghi mốc</small></div>
    </div>
    ${code(`git status                # đang đổi gì, cái nào đã add
git add .                 # đưa MỌI thay đổi vào staging
git commit -m "them form" # ghi một mốc kèm mô tả
git log --oneline         # xem lịch sử, mỗi commit một dòng`, 'bash', 'sm')}
    <div class="box">Vì sao có staging? Để bạn chọn <b>ghi cái gì</b> — sửa ba việc nhưng chỉ commit một việc, lịch sử sẽ đọc được.</div>` },

  { t: 'Git — bốn lệnh gỡ khi lỡ tay', body: `
    ${code(`git restore ten-file          # bỏ thay đổi CHƯA add của file đó
git restore --staged ten-file # bỏ ra khỏi staging, giữ nội dung
git commit --amend            # sửa lời nhắn của commit vừa tạo
git diff                      # xem chính xác mình đã đổi những dòng nào`, 'bash')}
    <div class="box warn">Đừng học thuộc <code>git reset --hard</code> khi chưa vững — nó <b>xoá</b> thay đổi và không lấy lại được. Bí thì <code>git status</code> trước, nó thường gợi ý đúng lệnh cần dùng.</div>` },

  { t: '.gitignore — làm TRƯỚC lần add đầu tiên', body: `
    ${code(`node_modules/     # hàng chục nghìn file, cài lại được bằng npm install
.env              # KHOÁ BÍ MẬT — lộ là mất tài khoản
build/            # sinh ra từ mã, không cần lưu
.DS_Store         # rác của macOS`, 'bash')}
    <div class="box warn">Lỡ commit <code>node_modules</code> rồi thì repo phình lên hàng trăm MB và xoá đi cũng không làm lịch sử nhẹ lại. Create React App sinh sẵn <code>.gitignore</code> — đừng xoá nó.</div>` },

  { t: 'GitHub — đẩy mã lên lần đầu', body: `
    ${code(`git init
git add --all
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ten>/<repo>
git push -u origin main

# những lần sau chỉ còn ba dòng
git add .
git commit -m "mo ta"
git push`, 'bash')}
    <div class="box">Slide cũ hay ghi <code>origin master</code>, nhưng repo GitHub mới mặc định nhánh <b>main</b>. Phải khớp với nhánh mặc định của remote.</div>` },

  { t: `Node & npm ${F()}`, body: `
    ${code(`npm install              # cài đúng những gì package.json khai
npm install bootstrap    # thêm một thư viện
npm install -D eslint    # thêm vào devDependencies (chỉ dùng khi code)
npm uninstall bootstrap  # gỡ ra

npm start                # chạy script "start"
npm run build            # script khác tên thì phải có "run"
npm run                  # liệt kê mọi script có sẵn

npx create-react-app app # CHẠY công cụ một lần rồi bỏ, không cài vào máy`, 'bash', 'sm')}
    <div class="box ok"><b>npm install</b> = <i>cài</i> thư viện để mã <code>import</code>. <b>npx</b> = <i>chạy</i> một công cụ một lần. Đó là lý do đề bài viết <code>npx create-react-app</code> chứ không phải <code>npm i -g</code>.</div>` },

  { t: 'Ba file quyết định mọi thứ', body: `
    <table class="t big2">
      <tr><th>Tên</th><th>Là gì</th><th>Commit?</th></tr>
      <tr><td><code>package.json</code></td><td>Bản khai: thư viện cần, các script</td><td><b>CÓ</b></td></tr>
      <tr><td><code>package-lock.json</code></td><td>Khoá phiên bản CHÍNH XÁC của từng thư viện con</td><td><b>CÓ</b></td></tr>
      <tr><td><code>node_modules/</code></td><td>Mã thật của thư viện, hàng chục nghìn file</td><td><b>KHÔNG</b></td></tr>
    </table>
    <div class="box">Không commit <code>node_modules</code> vì nó dựng lại được từ hai file kia bằng <code>npm install</code>.</div>` },

  { t: 'Tự luyện', body: `
    <div class="steps">
      <div><span class="n">1</span><span>Dùng terminal tạo thư mục <code>thu-nghiem</code>, vào trong, tạo file <code>ghi-chu.txt</code>, ghi một dòng rồi <code>cat</code> ra xem.</span></div>
      <div><span class="n">2</span><span><code>git init</code>, commit file đó, rồi <code>git log --oneline</code> xem mốc vừa ghi.</span></div>
      <div><span class="n">3</span><span>Sửa file, chạy <code>git diff</code> — đọc xem nó chỉ ra đúng dòng bạn vừa đổi không.</span></div>
      <div><span class="n">4</span><span>Tạo repo trên GitHub và đẩy lên. Mở trang repo kiểm: có file, và <b>không</b> có <code>node_modules</code>.</span></div>
    </div>` },
];
