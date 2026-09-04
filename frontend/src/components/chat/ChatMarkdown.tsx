'use client';

/**
 * ChatMarkdown — the ONE renderer for CuongMini assistant replies, shared by
 * the /chat page and the floating ChatModal.
 *
 * Fixes the "chưa xuống dòng / ký tự lạ / code không đẹp" complaints:
 *  - remark-breaks: single newlines from the model become real line breaks
 *    (standard markdown collapses them — the main "no line break" cause).
 *  - remark-gfm + STYLED tables/hr/task-lists (previously unstyled → looked
 *    like garbled text).
 *  - Code blocks get a header (language + copy button) and Prism syntax
 *    highlighting, lazy-loaded so it stays out of initial JS (same pattern as
 *    social/CodeBlock).
 */
import { memo, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Check, Copy, Download, Play, Square } from 'lucide-react';
import { usePythonSandbox, type KetQuaChay } from '@/hooks/usePythonSandbox';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sanitizeSvg } from '@/lib/safeSvg';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

/**
 * Hình vẽ do AI xuất ra dưới dạng khối ```svg.
 *
 * Vì sao là SVG chứ không phải ảnh sinh bằng AI: hình học cần ĐÚNG — đúng điểm
 * thẳng hàng, đúng góc vuông, đúng nhãn A/B/C nằm cạnh đúng đỉnh. Model sinh
 * ảnh vẽ ra thứ "trông giống hình học" nhưng nhãn sai chỗ và đường không đi qua
 * điểm cần đi qua. SVG là toạ độ, model tính được, và sai thì nhìn ra ngay.
 *
 * Chuỗi luôn đi qua `sanitizeSvg` — câu trả lời của model là dữ liệu không tin
 * được, mà SVG thì chạy được script. Lọc hỏng thì hiện mã gốc chứ không im lặng.
 */
function SvgFigure({ source }: { source: string }) {
  const [state, setState] = useState<{ svg: string | null; reason?: string }>({ svg: null, reason: 'ssr' });

  // Câu trả lời chảy về từng mẩu: giữa chừng chuỗi mới là NỬA cái SVG
  // (`<circle cx="220" cy="240" stro`) — đưa vào DOMParser thì tất nhiên
  // "sai cú pháp", và người dùng thấy báo lỗi đỏ nhấp nháy giữa lúc máy còn
  // đang vẽ. Chỉ dựng khi đã thấy thẻ đóng `</svg>`.
  const done = /<\/svg\s*>\s*$/i.test(source.trim());

  useEffect(() => {
    if (!done) { setState({ svg: null, reason: 'drawing' }); return; }
    setState(sanitizeSvg(source));
  }, [source, done]);

  if (!state.svg) {
    if (state.reason === 'ssr') return null; // sẽ dựng ngay sau khi hydrate
    if (state.reason === 'drawing') {
      return (
        <div className="chat-figure my-3 flex h-32 items-center justify-center rounded-xl border text-xs opacity-60">
          Đang vẽ hình…
        </div>
      );
    }
    return (
      <div className="my-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-500">
        Không dựng được hình ({state.reason}).
      </div>
    );
  }
  return (
    <figure className="chat-figure my-3 overflow-x-auto rounded-xl border p-3">
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: state.svg }} />
    </figure>
  );
}

/**
 * Bọc byte của WASM thành Blob.
 *
 * `new Blob([uint8])` không qua được TypeScript vì `Uint8Array` từ Pyodide có
 * kiểu `Uint8Array<ArrayBufferLike>`, mà `BlobPart` đòi `ArrayBuffer` thật
 * (`SharedArrayBuffer` không có `resizable`/`transfer`). Sao chép sang một
 * `ArrayBuffer` mới là cách vừa qua kiểu vừa đúng về ngữ nghĩa.
 */
function blobCua(dulieu: Uint8Array): Blob {
  const sao = new Uint8Array(dulieu.length);
  sao.set(dulieu);
  return new Blob([sao.buffer]);
}

/** Ngôn ngữ chạy được trong hộp cát. Chỉ Python — xem `lib/pythonWorker.ts`. */
const CHAY_DUOC = new Set(['python', 'py', 'python3']);

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const { chay, giet, dangChay, tienTrinh } = usePythonSandbox();
  const [kq, setKq] = useState<KetQuaChay | null>(null);
  const chayDuoc = CHAY_DUOC.has((language || '').toLowerCase());

  const bamChay = async () => {
    setKq(null);
    setKq(await chay(code));
  };

  /**
   * Tải file script vừa tạo.
   *
   * Dựng blob rồi bấm một thẻ `<a download>` — file nằm trong hệ thống file ẢO
   * của WASM, trình duyệt không thấy nó, nên không có cách nào khác.
   */
  const taiVe = (ten: string, dulieu: Uint8Array) => {
    const url = URL.createObjectURL(blobCua(dulieu));
    const a = document.createElement('a');
    a.href = url; a.download = ten;
    a.click();
    // Thu hồi NGAY sau khi bấm thì Safari huỷ luôn lần tải; lùi một nhịp.
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — ignore */ }
  };
  return (
    <div className="my-2 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0f]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">{language || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[#94a3b8] transition-colors hover:text-[#22d3ee]"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} className="text-[#4ade80]" /> : <Copy size={12} />}
          {copied ? 'Đã chép' : 'Copy'}
        </button>

        {chayDuoc && (
          <button
            type="button"
            onClick={() => (dangChay ? giet() : void bamChay())}
            className="ml-auto mr-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[#94a3b8] transition-colors hover:text-[#4ade80]"
            title={dangChay ? 'Dừng' : 'Chạy mã này ngay trong trình duyệt — không gửi lên máy chủ'}
          >
            {dangChay ? <Square size={12} /> : <Play size={12} />}
            {dangChay ? 'Dừng' : 'Chạy'}
          </button>
        )}
      </div>
      <div className="overflow-x-auto text-xs leading-relaxed">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{ margin: 0, background: 'transparent', padding: '0.75rem', fontSize: '0.75rem' }}
          codeTagProps={{ style: { fontFamily: 'var(--font-mono, ui-monospace, monospace)' } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {(tienTrinh || kq) && (
        <div className="border-t border-white/[0.06] bg-black/40 px-3 py-2 text-xs">
          {tienTrinh && <p className="font-mono text-[11px] text-[#94a3b8]">{tienTrinh}</p>}

          {/* Chữ do MÃ NGƯỜI DÙNG in ra — hiện nguyên văn trong `<pre>`, tuyệt
              đối không dựng thành HTML. */}
          {kq?.ra ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#cbd5e1]">
              {kq.ra}
            </pre>
          ) : null}

          {kq?.loi ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#f87171]">
              {kq.loi}
            </pre>
          ) : null}

          {kq && !kq.ra && !kq.loi && !kq.file.length && (
            <p className="font-mono text-[11px] text-[#64748b]">
              Chạy xong, không in ra gì. Dùng <code>print(...)</code> để xem kết quả.
            </p>
          )}

          {kq?.file.map((f) => (
            <div key={f.ten} className="mt-2">
              {/* Ảnh thì XEM ĐƯỢC NGAY. Biểu đồ mà bắt tải về rồi mở bằng app
                  khác thì gần như không ai xem. */}
              {/\.(png|jpe?g|gif|webp|svg)$/i.test(f.ten) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(blobCua(f.dulieu))}
                  alt={f.ten}
                  className="max-h-96 w-auto rounded-lg border border-white/10 bg-white"
                />
              )}
              <button
                type="button"
                onClick={() => taiVe(f.ten, f.dulieu)}
                className="mt-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-[#22d3ee] hover:underline"
              >
                <Download size={11} /> {f.ten} ({(f.dulieu.length / 1024).toFixed(0)} KB)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Công thức toán (KaTeX qua remark-math + rehype-katex) ─────────
//
// Trước đây chỗ này tự gọi `renderMathInElement` lên DOM đã mount. Cách đó
// hỏng hai lần liên tiếp trên production, và cả hai đều CÙNG một gốc: công
// thức bị MARKDOWN xử lý trước khi KaTeX kịp nhìn thấy.
//
//  1. `$$` xuống dòng → `remark-breaks` chèn `<br>` vào giữa, cặp dấu nằm ở
//     ba nút văn bản khác nhau, KaTeX không ghép được.
//  2. `\\` trong `\begin{align*}` → markdown coi `\\` là dấu thoát và trả
//     về MỘT gạch chéo, thế là dấu xuống hàng của align biến mất.
//
// Vá bằng regex là chạy theo từng triệu chứng: sau `\\` sẽ tới `\{`, `\_`,
// `\%`… mỗi cái một lần vỡ. `remark-math` bóc công thức ra thành nút riêng
// NGAY TỪ LÚC PHÂN TÍCH, trước mọi phép thoát và trước `remark-breaks`, rồi
// `rehype-katex` dựng nó — nội dung công thức không còn đi qua markdown nữa.
//
// (Thứ tự plugin có ý nghĩa: `remarkMath` phải đứng TRƯỚC `remarkBreaks`.)

/** Môi trường LaTeX model hay viết TRẦN, không bọc `$$`. */
const BARE_ENVS = ['align\\*', 'align', 'aligned', 'gather\\*', 'gather', 'equation\\*', 'equation', 'cases', 'array', 'bmatrix', 'pmatrix', 'vmatrix'];

/**
 * Đưa mọi kiểu viết công thức về đúng hai dạng `remark-math` hiểu (`$…$`,
 * `$$…$$`), chỉ đụng phần NGOÀI khối ```code```.
 *
 * - `\begin{align*} … \end{align*}` viết trần → bọc `$$…$$`. Model xuất kiểu
 *   này rất thường xuyên và nếu không bọc thì nó hiện ra nguyên chữ LaTeX.
 * - `\[ … \]` → `$$ … $$`, `\( … \)` → `$ … $` (remark-math không nhận
 *   hai cặp dấu này).
 */
/**
 * Đưa hàng rào `$$` của công thức KHỐI về đúng dạng `remark-math` hiểu: dấu
 * mở và dấu đóng mỗi cái nằm MỘT MÌNH trên dòng của nó.
 *
 * ⚠️ ĐÂY LÀ CÁI BẪY LÀM VỠ CẢ CÂU TRẢ LỜI, không chỉ một công thức. Model
 * thường viết:
 *
 *     $$\overrightarrow{ME}
 *     =\left(u(1-\lambda),
 *     \frac{uv(1-\lambda)}{1-u}\right),$$
 *
 * `remark-math` thấy `$$` ở ĐẦU DÒNG thì coi phần còn lại của dòng đó là
 * METADATA (giống tên ngôn ngữ sau ```) và VỨT ĐI, rồi đi tìm một dòng CHỈ CÓ
 * `$$` để đóng. Dòng đó thường mãi sau mới xuất hiện, nên khối này nuốt trọn
 * mấy đoạn văn ở giữa; hàng rào đóng bị dùng nhầm lại MỞ một khối mới, nuốt
 * tiếp đoạn sau. Hệ quả trên màn hình: mấy mảng chữ đỏ "undefined" xen giữa
 * những khối `\begin{aligned}` hiện ra nguyên chữ LaTeX. Gặp thật 14/08 trên
 * production, 4 khối hỏng trong một lời giải.
 *
 * Chỉ đụng `$$` ĐẦU DÒNG. `$$…$$` nằm giữa câu là công thức TRONG DÒNG,
 * remark-math xử lý đúng — tách nó ra là làm hỏng thứ đang chạy tốt.
 */
function chuanHoaHangRao(text: string): string {
  const ra: string[] = [];
  let trongKhoi = false;
  for (const dong of text.split('\n')) {
    const cat = dong.trim();
    if (!trongKhoi) {
      // Mở khối: `$$` ở đầu dòng mà còn chữ phía sau ⇒ tách chữ xuống dòng.
      const mo = /^\$\$(?!\$)(.+)$/.exec(cat);
      if (mo) {
        const than = mo[1].trim();
        // `$$x=1$$` gọn trên một dòng: tách thành ba dòng cho chắc. Đóng
        // KHÔNG PHẢI lúc nào cũng nằm ở cuối dòng — model hay viết
        // `$$x=1$$ ✓` hay `$$x=1$$.` — dùng regex KHÔNG neo cuối dòng
        // (`$` anchor) và giữ lại phần chữ sau dấu đóng thành dòng riêng.
        // Bản cũ neo `$$` phải là ký tự CUỐI dòng nên rơi vào nhánh
        // "mở khối chưa đóng", nuốt luôn phần đuôi + mọi dòng còn lại của
        // câu trả lời làm "công thức", KaTeX không dựng nổi, hiện chữ thô.
        const donDong = /^(.*?)\$\$(.*)$/.exec(than);
        if (donDong) {
          ra.push('$$', donDong[1].trim(), '$$');
          const duoi = donDong[2].trim();
          if (duoi) ra.push(duoi);
          continue;
        }
        ra.push('$$', than);
        trongKhoi = true;
        continue;
      }
      if (cat === '$$') { ra.push('$$'); trongKhoi = true; continue; }
      ra.push(dong);
      continue;
    }
    // Đang trong khối: đóng khi gặp dòng chỉ có `$$`, hoặc dòng CÓ `$$`
    // (không nhất thiết ở cuối — cùng lý do trên).
    if (cat === '$$') { ra.push('$$'); trongKhoi = false; continue; }
    const dong2 = /^(.*\S)\$\$(.*)$/.exec(cat);
    if (dong2) {
      ra.push(dong2[1], '$$');
      trongKhoi = false;
      const duoi = dong2[2].trim();
      if (duoi) ra.push(duoi);
      continue;
    }
    ra.push(dong);
  }
  // Model quên đóng ⇒ tự đóng, còn hơn để nó nuốt hết phần còn lại.
  if (trongKhoi) ra.push('$$');
  return ra.join('\n');
}

function normalizeMath(src: string): string {
  const parts = (src || '').split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g);
  const envRe = new RegExp(`\\\\begin\\{(${BARE_ENVS.join('|')})\\}([\\s\\S]*?)\\\\end\\{\\1\\}`, 'g');

  for (let i = 0; i < parts.length; i += 2) {
    // ── Bước 1: hai cặp dấu remark-math không nhận → đưa về `$`/`$$` ──
    const doi = chuanHoaHangRao(parts[i]
      .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => `\n\n$$\n${inner.trim()}\n$$\n\n`)
      // Dấu cách ngay sau `$` làm nó KHÔNG mở được công thức trong dòng (luật
      // của remark-math), rồi `$` đó đi ghép với một `$` khác ở xa và nuốt cả
      // đoạn văn vào giữa. Cắt trắng hai đầu là hết.
      .replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner: string) => `$${inner.trim()}$`));

    // ── Bước 2: bọc môi trường viết TRẦN — CHỈ ở phần ngoài công thức ──
    //
    // ⚠️ Phải tách phần đã là công thức ra trước. Bản đầu chỉ kiểm ký tự ĐỨNG
    // NGAY TRƯỚC `\begin` có phải `$` không — nhưng model viết đúng chuẩn là
    // `$$` xuống dòng rồi mới `\begin{cases}`, nên ký tự ngay trước là `\n` và
    // bộ lọc tưởng nó viết trần, bọc thêm một lớp `$$` nữa. Kết quả: `$$` mở
    // ngoài, `$$` mở trong, hai cái đóng lạc nhau — cả HỆ PHƯƠNG TRÌNH hiện ra
    // nguyên chữ `\begin{cases}`. Gặp thật khi soi bản xuất PDF ngày 13/08.
    const manh = doi.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);
    for (let k = 0; k < manh.length; k += 2) {
      // ⚠️ `$$` PHẢI đứng một mình trên dòng của nó. Viết `$$\begin{align*}`
      //    thì `remark-math` hiểu phần sau `$$` là METADATA của khối (giống
      //    tên ngôn ngữ sau ```) và VỨT ĐI — KaTeX nhận được thân align mà
      //    không có `\begin{align*}`, báo "Expected 'EOF', got '&'".
      manh[k] = manh[k].replace(envRe, (_m, env: string, body: string) =>
        `\n\n$$\n\\begin{${env}}${body}\\end{${env}}\n$$\n\n`);
    }
    parts[i] = manh.join('');
  }
  return parts.join('');
}

/**
 * `renderMath = false` khi câu trả lời ĐANG chảy về: công thức mới về một nửa
 * (`$$\\frac{a}{`) thì KaTeX báo lỗi đỏ nhấp nháy giữa lúc máy còn đang gõ.
 * Tắt plugin trong lúc stream, bật lại khi xong — chữ LaTeX thô hiện thoáng
 * qua vài giây rồi thành công thức, dễ chịu hơn hẳn màn hình nháy đỏ.
 */
function ChatMarkdown({ content, renderMath = true }: { content: string; renderMath?: boolean }) {
  const source = useMemo(() => normalizeMath(content), [content]);
  const remarkPlugins = useMemo(
    () => (renderMath ? [remarkGfm, remarkMath, remarkBreaks] : [remarkGfm, remarkBreaks]),
    [renderMath],
  );
  const rehypePlugins = useMemo(
    () => (renderMath ? [[rehypeKatex, { throwOnError: false, strict: false, trust: false }]] : []),
    [renderMath],
  );

  return (
    <div className="chat-markdown break-words">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={rehypePlugins as any}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const text = String(children ?? '').replace(/\n$/, '');
            // Inline code (no language class AND single-line) → chip.
            if (!className && !text.includes('\n')) {
              return (
                <code className="rounded border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-1.5 py-0.5 font-mono text-xs text-[#22d3ee]" {...props}>
                  {children}
                </code>
              );
            }
            // ```svg → dựng thành HÌNH, không phải khối mã.
            if ((match?.[1] ?? '').toLowerCase() === 'svg' || /^<svg[\s>]/i.test(text)) {
              return <SvgFigure source={text} />;
            }
            return <CodeBlock language={match?.[1] ?? ''} code={text} />;
          },
          // Block code wrapper — CodeBlock already renders its own container.
          pre({ children }) {
            return <>{children}</>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] underline underline-offset-2 transition-colors hover:text-[#8b5cf6]">
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="mb-2 mt-3 text-base font-bold text-[#f1f5f9] first:mt-0">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-1.5 mt-3 text-[0.95rem] font-bold text-[#f1f5f9] first:mt-0">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-1 mt-2.5 text-sm font-semibold text-[#f1f5f9] first:mt-0">{children}</h3>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-[#f1f5f9]">{children}</strong>;
          },
          blockquote({ children }) {
            return <blockquote className="my-2 border-l-2 border-[#22d3ee]/40 pl-3 text-[#94a3b8]">{children}</blockquote>;
          },
          hr() {
            return <hr className="my-3 border-white/10" />;
          },
          // GFM tables — previously completely unstyled ("ký tự lạ khó nhìn").
          table({ children }) {
            return (
              <div className="my-2 overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full border-collapse text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-white/[0.04]">{children}</thead>;
          },
          th({ children }) {
            return <th className="border-b border-white/10 px-3 py-1.5 text-left font-semibold text-[#f1f5f9]">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-white/[0.05] px-3 py-1.5 align-top">{children}</td>;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

export default memo(ChatMarkdown);
