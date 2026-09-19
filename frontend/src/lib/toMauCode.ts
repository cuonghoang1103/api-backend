'use client';

/**
 * Tô màu cú pháp + gắn nút COPY cho mọi khối code trong nội dung bài học.
 *
 * ⚠️ Vì sao cần: nội dung bài (Academy/course/exp-hub/đề thi) được đổ thẳng
 * vào DOM bằng `dangerouslySetInnerHTML`, và **không có gì chạy bộ tô màu**.
 * `globals.css` đã có sẵn bảng màu `.rich-content pre .hljs-*` từ lâu — chú
 * thích trong file còn ghi "future server-side syntax highlighting" — nhưng
 * chưa bao giờ có thẻ `hljs-*` nào được sinh ra, nên toàn bộ code hiện ra
 * **trắng trơn**. Người học phản ánh 19/09/2026: "chỉ có mỗi chữ màu trắng
 * rất khó nhìn".
 *
 * Dùng highlight.js (đã có trong dependencies) chứ không dùng Shiki: các lớp
 * token `hljs-*` khớp sẵn với CSS đang có, và một bài có thể chứa hàng chục
 * khối code — Shiki nặng hơn nhiều cho số lượng đó.
 */

import { useEffect } from 'react';

/** Ngôn ngữ cho phép đoán khi khối code KHÔNG khai báo `language-…`. */
const DOAN_TRONG = ['c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'sql', 'bash', 'json', 'xml', 'css'];

let hljsPromise: Promise<typeof import('highlight.js/lib/common').default> | null = null;
function layHljs() {
  // Nạp động để gói highlight.js không nằm trong bundle trang đầu.
  if (!hljsPromise) hljsPromise = import('highlight.js/lib/common').then((m) => m.default);
  return hljsPromise;
}

const NHAN_NGON_NGU: Record<string, string> = {
  cpp: 'C++', c: 'C', csharp: 'C#', java: 'Java', python: 'Python', js: 'JavaScript',
  javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', jsx: 'JSX', tsx: 'TSX',
  sql: 'SQL', bash: 'Bash', sh: 'Shell', shell: 'Shell', json: 'JSON', xml: 'XML',
  html: 'HTML', css: 'CSS', yaml: 'YAML', go: 'Go', rust: 'Rust', php: 'PHP', kotlin: 'Kotlin',
};

function themNutChep(pre: HTMLPreElement, code: HTMLElement, nhan: string) {
  if (pre.querySelector('.khoi-code-thanh')) return;
  pre.classList.add('khoi-code');

  const thanh = document.createElement('div');
  thanh.className = 'khoi-code-thanh';

  if (nhan) {
    const ten = document.createElement('span');
    ten.className = 'khoi-code-ngonngu';
    ten.textContent = nhan;
    thanh.appendChild(ten);
  }

  const nut = document.createElement('button');
  nut.type = 'button';
  nut.className = 'khoi-code-chep';
  nut.textContent = 'Sao chép';
  nut.setAttribute('aria-label', 'Sao chép đoạn code');
  nut.addEventListener('click', async () => {
    // textContent lấy đúng code gốc — các thẻ <span> tô màu không ảnh hưởng.
    const chu = code.textContent || '';
    try {
      await navigator.clipboard.writeText(chu);
    } catch {
      // Trình duyệt chặn clipboard (http, quyền, iframe) → lùi về execCommand.
      const ta = document.createElement('textarea');
      ta.value = chu;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* đành chịu */ }
      ta.remove();
    }
    nut.textContent = 'Đã chép ✓';
    nut.classList.add('da-chep');
    setTimeout(() => { nut.textContent = 'Sao chép'; nut.classList.remove('da-chep'); }, 1600);
  });
  thanh.appendChild(nut);
  pre.appendChild(thanh);
}

/** Tô màu + gắn nút chép cho mọi `<pre><code>` bên trong `goc`. */
export async function toMauTrong(goc: HTMLElement | null) {
  if (!goc) return;
  const khoi = [...goc.querySelectorAll<HTMLElement>('pre > code')].filter((c) => {
    if (c.dataset.daToMau) return false;
    // ⚠️ Chừa sơ đồ mermaid: nó cũng là <pre><code> nhưng sẽ được mermaid
    // thay bằng SVG. Tô màu vào đó vừa vô ích vừa dễ làm hỏng nguồn sơ đồ.
    if (c.classList.contains('language-mermaid') || c.closest('pre')?.classList.contains('mermaid')) return false;
    return true;
  });
  if (!khoi.length) return;

  const hljs = await layHljs();
  for (const code of khoi) {
    code.dataset.daToMau = '1';
    const pre = code.parentElement as HTMLPreElement | null;
    if (!pre) continue;

    const lop = [...code.classList].find((c) => c.startsWith('language-'));
    const ma = lop ? lop.slice('language-'.length).toLowerCase() : '';
    const chu = code.textContent || '';

    try {
      if (ma && hljs.getLanguage(ma)) {
        code.innerHTML = hljs.highlight(chu, { language: ma, ignoreIllegals: true }).value;
      } else if (chu.trim().length > 20) {
        const kq = hljs.highlightAuto(chu, DOAN_TRONG);
        // Đoán yếu thì để nguyên còn hơn tô sai màu.
        if (kq.relevance >= 5) code.innerHTML = kq.value;
      }
      code.classList.add('hljs');
    } catch {
      /* khối nào tô hỏng thì để nguyên, KHÔNG làm vỡ cả trang */
    }

    themNutChep(pre, code, NHAN_NGON_NGU[ma] || (ma ? ma.toUpperCase() : ''));
  }
}

/**
 * Chạy lại mỗi khi nội dung đổi (đổi bài, đổi ngôn ngữ hiển thị…).
 * `phuThuoc` là danh sách phụ thuộc giống useEffect.
 */
export function useToMauCode(
  lay: () => HTMLElement | null,
  phuThuoc: unknown[],
) {
  useEffect(() => {
    let huy = false;
    // Đợi một nhịp để `dangerouslySetInnerHTML` gắn xong nội dung.
    const t = setTimeout(() => { if (!huy) void toMauTrong(lay()); }, 0);
    return () => { huy = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, phuThuoc);
}
