/**
 * THẺ DUYỆT — chỗ duy nhất người dùng chặn được agent trước khi nó ghi đĩa.
 *
 * ─── VÌ SAO CÁI THẺ NÀY PHẢI KHÓ BẤM BỪA ───
 * Cách hỏng của mọi tầng xin phép không phải là bị vượt qua — mà là hỏi nhiều
 * tới mức người dùng bấm "cho phép" theo phản xạ, không đọc. Lúc đó lớp bảo vệ
 * vẫn còn nguyên trên màn hình và đã hết tác dụng hoàn toàn.
 *
 * Ba thứ ở đây chống lại điều đó:
 *  1. Diff hiện SẴN, không phải bấm "xem chi tiết" mới thấy. Thứ phải bấm mới
 *     thấy thì không ai bấm.
 *  2. Diff đã RÚT GỌN quanh chỗ sửa (±3 dòng). Đổi 2 dòng mà hiện 800 dòng thì
 *     người dùng cũng không đọc.
 *  3. "Cho phép cả file này" thay cho "cho phép tất". Sửa mười chỗ trong một
 *     file thì chỉ bấm một lần — nhưng agent chạm sang file khác là hỏi lại.
 *     Đây là chỗ đổi chác giữa phiền và an toàn, và nó nghiêng theo cách người
 *     ta thật sự làm việc: sửa sâu vài file, không rải khắp dự án.
 */
import { AlertTriangle, Check, CheckCheck, FilePlus2, FilePen, GitCommitHorizontal, GitPullRequest, NotebookPen, Plug, Terminal, X } from 'lucide-react';
import hljs from 'highlight.js/lib/common';
import type { AgentDiff, AgentPhanLoaiLenh, AgentQuyetDinh } from '../../../shared/ipc';

/**
 * Ngôn ngữ cho `highlight.js`, suy từ đuôi file.
 *
 * Trả `null` khi không nhận ra: thà để chữ trắng còn hơn để `highlightAuto`
 * đoán — đoán trên MỘT DÒNG thì gần như luôn sai, và một dòng bị tô sai ngôn
 * ngữ trông rối hơn là không tô.
 */
function ngonNguTuDuong(duong: string): string | null {
  const duoi = duong.slice(duong.lastIndexOf('.') + 1).toLowerCase();
  const bang: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript', mjs: 'javascript',
    java: 'java', py: 'python', rb: 'ruby', go: 'go', rs: 'rust', php: 'php',
    c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', hpp: 'cpp', cs: 'csharp', swift: 'swift', kt: 'kotlin',
    sql: 'sql', sh: 'bash', bash: 'bash', zsh: 'bash',
    json: 'json', yml: 'yaml', yaml: 'yaml', xml: 'xml', html: 'xml', css: 'css', scss: 'scss',
    md: 'markdown', ini: 'ini', toml: 'ini',
  };
  return (bang[duoi] && hljs.getLanguage(bang[duoi]) ? bang[duoi] : null) ?? null;
}

/**
 * Một dòng mã đã tô màu.
 *
 * ⚠️ CÓ dùng `dangerouslySetInnerHTML`, và đây là đảo lại một quyết định cũ —
 * nên phải nói rõ vì sao an toàn. Chú thích cũ đúng ở chỗ: nội dung này là mã
 * nguồn CỦA NGƯỜI DÙNG, dựng thẳng bằng innerHTML thì một file HTML bất kỳ
 * trong dự án sẽ CHẠY ngay trong renderer.
 *
 * Khác biệt: chữ ở đây KHÔNG đi thẳng vào innerHTML — nó đi qua
 * `hljs.highlight()`, và hàm đó THOÁT đầu vào. Đo thật 24/08/2026 với
 * `<img src=x onerror=alert(1)> & "q" </script>`:
 *   `<img`      → `&lt;<span ...>img</span>`   (không còn thẻ thô)
 *   `</script>` → `&lt;/script&gt;`
 * Không byte HTML thô nào sống sót. Đây cũng đúng lập luận `markdown.tsx` đã
 * dùng cho khối mã, chỉ là áp cho từng dòng.
 *
 * ⚠️ Tô THEO TỪNG DÒNG nên mất ngữ cảnh nhiều dòng (chuỗi hay chú thích kéo
 * dài có thể tô sai đoạn giữa). Đổi lại là diff giữ được thứ tự dòng thêm/bỏ
 * xen kẽ — tô cả khối thì không ghép lại được. Terminal của Claude Code cũng
 * tô theo dòng.
 */
function MaDong({ text, ngonNgu }: { text: string; ngonNgu: string | null }) {
  if (!ngonNgu) return <span className="ct-diff-text">{text || ' '}</span>;
  let html: string;
  try {
    html = hljs.highlight(text, { language: ngonNgu, ignoreIllegals: true }).value;
  } catch {
    // Tô hỏng thì trả về chữ thô qua đường React — an toàn tuyệt đối.
    return <span className="ct-diff-text">{text || ' '}</span>;
  }
  return <span className="ct-diff-text" dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
}

export interface TheXinPhep {
  id: string;
  ten: string;
  duongDan: string;
  taoMoi: boolean;
  diff: AgentDiff;
}

export function XinPhep({
  the,
  traLoi,
}: {
  the: TheXinPhep;
  traLoi: (id: string, q: AgentQuyetDinh) => void;
}) {
  // Tính MỘT lần cho cả thẻ, không phải mỗi dòng.
  const ngonNgu = ngonNguTuDuong(the.duongDan);

  return (
    <div className="ct-xinphep">
      <div className="ct-xinphep-dau">
        {the.taoMoi ? <FilePlus2 size={14} aria-hidden /> : <FilePen size={14} aria-hidden />}
        <code className="ct-xinphep-duongdan">{the.duongDan}</code>
        <span className="ct-xinphep-dem">
          {the.taoMoi ? 'tạo mới' : <>
            <span className="ct-xinphep-them">+{the.diff.soThem}</span>
            {' '}
            <span className="ct-xinphep-bo">−{the.diff.soBo}</span>
          </>}
        </span>
      </div>

      {the.diff.quaLon && (
        <div className="ct-notice" data-tone="warn" style={{ margin: '0 0 8px' }}>
          <span>Thay đổi quá lớn để so từng dòng — bảng dưới hiện nguyên cả hai bản.</span>
        </div>
      )}

      <div className="ct-diff" data-ngonngu={ngonNgu ?? 'tho'}>
        {the.diff.dong.map((d, i) => {
          // Dòng "…" ngăn cách hai cụm thay đổi: cùng kiểu dữ liệu, cả hai số
          // dòng đều null. Xem `rutGonNguCanh` trong main/agent/diff.ts.
          if (d.loai === 'giu' && d.soCu === null && d.soMoi === null) {
            return <div key={i} className="ct-diff-ngat">⋯</div>;
          }
          return (
            <div key={i} className="ct-diff-dong" data-loai={d.loai}>
              <span className="ct-diff-so">{d.soCu ?? ''}</span>
              <span className="ct-diff-so">{d.soMoi ?? ''}</span>
              <span className="ct-diff-dau">{d.loai === 'them' ? '+' : d.loai === 'bo' ? '−' : ' '}</span>
              <MaDong text={d.text} ngonNgu={ngonNgu} />
            </div>
          );
        })}
      </div>

      <div className="ct-xinphep-nut">
        <button type="button" className="ct-btn" onClick={() => traLoi(the.id, 'choPhep')}>
          <Check size={14} aria-hidden />
          Cho phép
        </button>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => traLoi(the.id, 'choPhepCaFile')}>
          <CheckCheck size={14} aria-hidden />
          Cho phép cả file này
        </button>
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => traLoi(the.id, 'tuChoi')}>
          <X size={14} aria-hidden />
          Từ chối
        </button>
      </div>
    </div>
  );
}

/**
 * Thẻ duyệt CHẠY LỆNH.
 *
 * ─── KHÁC THẺ SỬA FILE Ở BA CHỖ, VÀ KHÁC CÓ LÝ DO ───
 *
 *  1. Chuỗi lệnh hiện TO và ĐẦY ĐỦ, không cắt, không xuống dòng lén. Người dùng
 *     duyệt đúng cái họ đọc; một chuỗi bị cắt ở giữa là một chuỗi họ chưa đọc.
 *
 *  2. Lệnh nguy hiểm hiện lý do CỤ THỂ ("xoá file — không hoàn tác được"), chứ
 *     không phải một chữ "cảnh báo" chung chung. Cảnh báo chung thì người ta
 *     học cách bỏ qua sau lần thứ ba.
 *
 *  3. Nút "cho phép lệnh này" BIẾN MẤT với lệnh nguy hiểm — không phải mờ đi,
 *     mà không có. `rm -rf` không được phép trở thành thói quen một cú bấm.
 *     (Main cũng chặn lần nữa, xem `choNho` trong xinPhep.ts.)
 */
export function XinPhepLenh({
  id,
  lenh,
  phanLoai,
  traLoi,
}: {
  id: string;
  lenh: string;
  phanLoai: AgentPhanLoaiLenh;
  traLoi: (id: string, q: AgentQuyetDinh) => void;
}) {
  const nguyHiem = phanLoai.muc === 'nguyhiem';
  return (
    <div className="ct-xinphep" data-muc={phanLoai.muc}>
      <div className="ct-xinphep-dau">
        <Terminal size={14} aria-hidden />
        <span>Agent muốn chạy lệnh</span>
      </div>

      <div className="ct-lenh-hop">
        <span className="ct-lenh-dau">$</span>
        <code className="ct-lenh-chu">{lenh}</code>
      </div>

      {phanLoai.lyDo.length > 0 && (
        <div className="ct-notice" data-tone={nguyHiem ? 'err' : 'warn'} style={{ margin: '8px 0 0' }}>
          <AlertTriangle size={15} aria-hidden />
          <span>
            {nguyHiem ? <strong>Nguy hiểm: </strong> : null}
            {phanLoai.lyDo.join(' · ')}
          </span>
        </div>
      )}

      <div className="ct-xinphep-nut">
        <button
          type="button"
          className={nguyHiem ? 'ct-btn ct-xinphep-lieu' : 'ct-btn'}
          onClick={() => traLoi(id, 'choPhep')}
        >
          <Check size={14} aria-hidden />
          {nguyHiem ? 'Vẫn chạy' : 'Chạy lệnh'}
        </button>
        {phanLoai.choNho && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => traLoi(id, 'choPhepCaFile')}>
            <CheckCheck size={14} aria-hidden />
            Chạy, và đừng hỏi lại lệnh này
          </button>
        )}
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => traLoi(id, 'tuChoi')}>
          <X size={14} aria-hidden />
          Từ chối
        </button>
      </div>
    </div>
  );
}

/**
 * Thẻ duyệt GỌI TOOL MCP.
 *
 * ─── KHÔNG CÓ NÚT "ĐỪNG HỎI LẠI" — VÀ ĐÓ LÀ ĐIỂM CHÍNH ───
 * Thẻ sửa file và thẻ chạy lệnh đều có đường tắt để khỏi bấm mười lần. Thẻ này
 * cố ý không có. Duyệt `npm test` cả phiên là duyệt một lệnh người dùng đọc
 * được. Duyệt một tool MCP cả phiên là cấp quyền cho mã của NGƯỜI LẠ chạy bao
 * nhiêu lần tuỳ ý, với tham số do model chọn — và chính server đó lại là bên
 * viết phần mô tả mà model đọc để quyết định gọi gì.
 *
 * ─── THAM SỐ HIỆN ĐẦY ĐỦ, KHÔNG CHỈ TÊN TOOL ───
 * `mcp__db__query` nghe vô hại cho tới khi nhìn thấy câu lệnh nó định chạy. Tên
 * tool là thứ server tự đặt; tham số mới là việc sắp xảy ra thật.
 */
export function XinPhepMcp({
  id,
  server,
  tool,
  args,
  traLoi,
}: {
  id: string;
  server: string;
  tool: string;
  args: string;
  traLoi: (id: string, q: AgentQuyetDinh) => void;
}) {
  return (
    <div className="ct-xinphep" data-muc="cankiem">
      <div className="ct-xinphep-dau">
        <Plug size={14} aria-hidden />
        <span>Agent muốn gọi tool của server ngoài</span>
        <span className="ct-xinphep-dem">
          <span className="ct-mcp-ten">{server}</span>
        </span>
      </div>

      <div className="ct-lenh-hop">
        <span className="ct-lenh-dau">›</span>
        <code className="ct-lenh-chu">{tool}</code>
      </div>

      {/* Text thô trong `<pre>`: tham số đến từ model và từ server ngoài — hai
          nguồn đều không được phép dựng thành HTML trong renderer. */}
      <pre className="ct-mcp-args">{args}</pre>

      <div className="ct-notice" data-tone="warn" style={{ margin: '8px 0 0' }}>
        <AlertTriangle size={15} aria-hidden />
        <span>
          Tool này do <strong>{server}</strong> cung cấp, không phải của ứng dụng.
          Nó chạy trên máy bạn và có thể làm bất cứ điều gì server đó lập trình sẵn.
        </span>
      </div>

      <div className="ct-xinphep-nut">
        <button type="button" className="ct-btn" onClick={() => traLoi(id, 'choPhep')}>
          <Check size={14} aria-hidden />
          Cho phép lần này
        </button>
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => traLoi(id, 'tuChoi')}>
          <X size={14} aria-hidden />
          Từ chối
        </button>
      </div>
    </div>
  );
}

/**
 * Thẻ duyệt COMMIT / MỞ PR.
 *
 * ─── HAI VIỆC, HAI MỨC HẬU QUẢ KHÁC HẲN NHAU ───
 * Commit là thay đổi CỤC BỘ — sai thì `git reset` là xong. Mở PR thì ĐẨY nhánh
 * lên origin và tạo một thứ người khác nhìn thấy, nhận thông báo, và có thể đã
 * đọc trước khi bạn kịp rút lại. Nên PR hiện cảnh báo riêng, và nút của nó nói
 * rõ là "đẩy lên" chứ không phải một chữ "OK" chung chung.
 *
 * Cả hai đều KHÔNG có nút "đừng hỏi lại": ghi vào lịch sử git và đẩy ra ngoài
 * không được phép trở thành thói quen một cú bấm.
 */
export function XinPhepGit({
  id,
  viec,
  chiTiet,
  traLoi,
}: {
  id: string;
  viec: 'commit' | 'pr';
  chiTiet: string;
  traLoi: (id: string, q: AgentQuyetDinh) => void;
}) {
  const laPr = viec === 'pr';
  return (
    <div className="ct-xinphep" data-muc={laPr ? 'nguyhiem' : 'cankiem'}>
      <div className="ct-xinphep-dau">
        {laPr ? <GitPullRequest size={14} aria-hidden /> : <GitCommitHorizontal size={14} aria-hidden />}
        <span>{laPr ? 'Agent muốn ĐẨY nhánh và mở Pull Request' : 'Agent muốn commit'}</span>
      </div>

      {/* Text thô trong `<pre>`: đây là tên file và lời nhắn do model soạn —
          không được dựng thành HTML trong renderer. */}
      <pre className="ct-mcp-args">{chiTiet}</pre>

      {laPr && (
        <div className="ct-notice" data-tone="err" style={{ margin: '8px 0 0' }}>
          <AlertTriangle size={15} aria-hidden />
          <span>
            <strong>Việc này đi RA NGOÀI.</strong> Nhánh sẽ nằm trên origin và PR sẽ hiện
            cho người khác cùng repo — họ nhận thông báo ngay. Không có nút hoàn tác.
          </span>
        </div>
      )}

      <div className="ct-xinphep-nut">
        <button
          type="button"
          className={laPr ? 'ct-btn ct-xinphep-lieu' : 'ct-btn'}
          onClick={() => traLoi(id, 'choPhep')}
        >
          <Check size={14} aria-hidden />
          {laPr ? 'Đẩy và mở PR' : 'Commit'}
        </button>
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => traLoi(id, 'tuChoi')}>
          <X size={14} aria-hidden />
          Từ chối
        </button>
      </div>
    </div>
  );
}

/**
 * Thẻ duyệt GHI VÀO SỔ GHI CHÚ.
 *
 * ─── HAI CHẾ ĐỘ, HAI MỨC HẬU QUẢ ───
 * "Thêm" nối vào cuối, chữ cũ không bị đụng — hỏng thì xoá đoạn thừa là xong.
 * "Thay" viết đè TOÀN BỘ bài, và đây là ghi chú THẬT của người dùng chứ không
 * phải file trong dự án: không có `git checkout` nào lấy lại được, chỉ còn
 * lịch sử phiên bản của Notes. Nên chế độ thay hiện cảnh báo riêng.
 *
 * Không có nút "đừng hỏi lại": mỗi lần ghi là một nội dung khác, nên một lần
 * đồng ý không nói gì về lần sau.
 */
export function XinPhepNote({
  id,
  viec,
  chiTiet,
  traLoi,
}: {
  id: string;
  viec: 'tao' | 'ghi';
  chiTiet: string;
  traLoi: (id: string, q: AgentQuyetDinh) => void;
}) {
  // `chiTiet` do main dựng và luôn nói rõ chế độ ở dòng đầu.
  const laThay = chiTiet.includes('THAY TOÀN BỘ');
  return (
    <div className="ct-xinphep" data-muc={laThay ? 'nguyhiem' : 'cankiem'}>
      <div className="ct-xinphep-dau">
        <NotebookPen size={14} aria-hidden />
        <span>
          {viec === 'tao'
            ? 'Agent muốn TẠO một ghi chú mới'
            : laThay ? 'Agent muốn VIẾT ĐÈ một ghi chú' : 'Agent muốn thêm vào một ghi chú'}
        </span>
      </div>

      {/* Chữ do model soạn — hiện nguyên văn trong `<pre>`, KHÔNG dựng HTML. */}
      <pre className="ct-mcp-args">{chiTiet}</pre>

      {laThay && (
        <div className="ct-notice" data-tone="err" style={{ margin: '8px 0 0' }}>
          <AlertTriangle size={15} aria-hidden />
          <span>
            <strong>Toàn bộ nội dung cũ sẽ bị thay.</strong> Đây là ghi chú thật của bạn,
            không phải file trong dự án — lấy lại được ở lịch sử phiên bản của Ghi chú,
            nhưng không có nút hoàn tác ở đây.
          </span>
        </div>
      )}

      <div className="ct-xinphep-nut">
        <button
          type="button"
          className={laThay ? 'ct-btn ct-xinphep-lieu' : 'ct-btn'}
          onClick={() => traLoi(id, 'choPhep')}
        >
          <Check size={14} aria-hidden />
          {viec === 'tao' ? 'Tạo ghi chú' : laThay ? 'Viết đè' : 'Thêm vào'}
        </button>
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => traLoi(id, 'tuChoi')}>
          <X size={14} aria-hidden />
          Từ chối
        </button>
      </div>
    </div>
  );
}
