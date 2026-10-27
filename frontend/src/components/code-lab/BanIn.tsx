'use client';

/**
 * ĐỀ LỚN = "BẢN IN" (đợt Academy 28/10/2026, KE-HOACH-CODELAB §8.6) — lab chương, deep lab, PE luyện,
 * dự án: trình bày như tờ đề cô phát (tiêu đề + mô tả, cây thư mục, wireframe, mô hình dữ liệu, chức
 * năng đánh số kèm Requirements + hook bắt buộc, thang điểm), kèm ba nút:
 *   ▶ Live demo   — app MẪU chạy trong iframe sandbox (HTML tự chứa `demoHtml`, không hiện mã nguồn);
 *   ⬇ Tải đề PDF  — in đúng bản này ra A4 (trình duyệt → "Lưu thành PDF"), từ CÙNG nguồn HTML;
 *   ⬇ Starter     — .zip dự án khởi đầu (đúng cây thư mục, dữ liệu mẫu) để làm trên máy.
 * HTML đề do bộ xuất nội dung dựng (content/codelab/README.md mục "Đề lớn") với các lớp `.bi-*`.
 */
import { useEffect, useRef, useState } from 'react';
import { Download, FileDown, Loader2, MonitorPlay, Printer, X, Clock, Trophy } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeExercise } from '@/types/code-lab';
import { taoZip, taiVe } from './zipNho';
import { KhungAnToan } from './KhungAnToan';
import { LangSwitch } from './ProblemCard';

const TEN_DANG: Record<string, string> = { lab: 'LAB', 'deep-lab': 'DEEP LAB', pe: 'PE LUYỆN', project: 'DỰ ÁN' };

/** Đề lớn: dạng bài khác "practice". */
export function laDeLon(ex: Pick<CodeExercise, 'kind'>): boolean {
  return !!ex.kind && ex.kind !== 'practice';
}

/** CSS của tờ in — dùng chung cho khung xem trên trang (`.cl-banin`) và tài liệu in (A4). */
const CSS_IN = `
@page { size: A4; margin: 16mm 15mm 18mm; }
html,body{margin:0;background:#fff;color:#111827;font:12pt/1.5 "Times New Roman",Georgia,serif}
.bi-giay{max-width:none}
.bi-giay h1,.bi-giay h2,.bi-giay h3{font-family:Arial,Helvetica,sans-serif;color:#111827;break-after:avoid}
.bi-giay h1{font-size:18pt;text-align:center;margin:0 0 4pt;text-transform:uppercase;letter-spacing:.02em}
.bi-giay .bi-phu{text-align:center;margin:0 0 12pt;color:#374151;font-size:10.5pt}
.bi-giay h2{font-size:13pt;margin:14pt 0 6pt;border-bottom:1.2pt solid #111827;padding-bottom:2pt}
.bi-giay h3{font-size:11.5pt;margin:10pt 0 4pt}
.bi-giay pre,.bi-giay code{font-family:"Courier New",Consolas,monospace;font-size:10pt}
.bi-giay pre{border:0.8pt solid #9ca3af;padding:6pt 8pt;white-space:pre-wrap;word-break:break-word;background:#f9fafb;break-inside:avoid}
.bi-giay pre.bi-wire{white-space:pre;overflow:hidden}
.bi-giay table{border-collapse:collapse;width:100%;margin:6pt 0;font-size:10.5pt;break-inside:avoid}
.bi-giay th,.bi-giay td{border:0.8pt solid #6b7280;padding:3pt 6pt;text-align:left;vertical-align:top}
.bi-giay th{background:#f3f4f6}
.bi-giay .bi-cn{break-inside:avoid;margin:0 0 8pt}
.bi-giay .bi-yc{margin:2pt 0 2pt 0}
.bi-giay .bi-hook{display:inline-block;border:0.8pt solid #111827;border-radius:3pt;padding:0 4pt;font-size:9.5pt;font-family:Arial,sans-serif;margin-right:3pt}
.bi-giay .bi-diem{float:right;font-family:Arial,sans-serif;font-weight:700}
.bi-giay .bi-wire{font-family:"Courier New",monospace;font-size:9.5pt;line-height:1.25}
.bi-giay .bi-chu-y{border-left:3pt solid #111827;padding:2pt 8pt;margin:6pt 0;background:#f9fafb}
`;

export function BanIn({ ex, lang, onPickLang }: { ex: CodeExercise; lang: 'en' | 'vi'; onPickLang?: (l: 'en' | 'vi') => void }) {
  const [demo, setDemo] = useState<'dong' | 'tai' | 'mo' | 'loi'>('dong');
  const [demoHtml, setDemoHtml] = useState<string | null>(null);
  const body = (lang === 'vi' && ex.problemHtmlVi) || ex.problemHtml || '';
  const giayRef = useRef<HTMLDivElement>(null);
  const tj = ex.testsJson;
  const thang = tj?.thangDiem ?? [];
  const tongDiem = thang.reduce((s, t) => s + (Number(t.diem) || 0), 0);

  const moDemo = async () => {
    if (demoHtml) { setDemo('mo'); return; }
    setDemo('tai');
    try {
      const r = await codeLabApi.getDemo(ex.id);
      setDemoHtml(r.data.data.html);
      setDemo('mo');
    } catch { setDemo('loi'); }
  };

  const inPdf = () => {
    // In từ một iframe CÙNG GỐC chỉ chứa tờ đề + CSS A4 — không kéo theo thanh điều hướng/editor của trang.
    const f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(f);
    const d = f.contentDocument;
    if (!d) { f.remove(); return; }
    const tieuDe = ex.title.replace(/[<>]/g, '');
    d.open();
    d.write(`<!doctype html><html><head><meta charset="utf-8"><title>${tieuDe} — CuongThai Code Lab</title><style>${CSS_IN}</style></head><body><div class="bi-giay">${sanitizeHtml(body)}</div></body></html>`);
    d.close();
    setTimeout(() => {
      try { f.contentWindow?.focus(); f.contentWindow?.print(); } finally { setTimeout(() => f.remove(), 1500); }
    }, 250);
  };

  const taiStarter = () => {
    const tep = (ex.starterCodeJson ?? []).map((b) => ({ name: b.name, code: b.code }));
    if (!tep.length) return;
    taiVe(taoZip(tep), `${ex.slug}-starter.zip`);
  };

  useEffect(() => {
    if (demo !== 'mo') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDemo('dong'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [demo]);

  return (
    <article className="cl-banin" aria-label="Đề bài (bản in)">
      <div className="cl-banin-bar">
        <span className="cl-banin-kind">{TEN_DANG[ex.kind ?? ''] ?? 'ĐỀ LỚN'}</span>
        {ex.estimatedMinutes ? <span className="cl-banin-meta"><Clock size={12} /> {ex.estimatedMinutes} phút</span> : null}
        {tongDiem > 0 && <span className="cl-banin-meta"><Trophy size={12} /> {tongDiem} điểm · {thang.length} chức năng</span>}
        {ex.problemHtmlVi && onPickLang && <LangSwitch lang={lang} onPick={onPickLang} />}
        <span className="ml-auto flex flex-wrap gap-1.5">
          {ex.hasDemo && (
            <button type="button" className="cl-banin-btn is-main" onClick={moDemo} disabled={demo === 'tai'}>
              {demo === 'tai' ? <Loader2 size={14} className="animate-spin" /> : <MonitorPlay size={14} />} Live demo
            </button>
          )}
          <button type="button" className="cl-banin-btn" onClick={inPdf} title="In ra A4 hoặc chọn “Lưu thành PDF”">
            <Printer size={14} /> Tải đề PDF
          </button>
          {(ex.starterCodeJson ?? []).length > 0 && (
            <button type="button" className="cl-banin-btn" onClick={taiStarter} title="Dự án khởi đầu đúng cây thư mục — làm trên máy rồi dán/nhập lại">
              <FileDown size={14} /> Starter (.zip)
            </button>
          )}
          {ex.briefPdfUrl && (
            <a className="cl-banin-btn" href={ex.briefPdfUrl} target="_blank" rel="noopener noreferrer"><Download size={14} /> PDF gốc</a>
          )}
        </span>
      </div>
      {demo === 'loi' && <p className="cl-banin-loi">Không tải được demo — thử lại sau.</p>}
      <div ref={giayRef} className="cl-banin-giay bi-giay" dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }} />

      {demo === 'mo' && demoHtml && (
        <div className="cl-demo" role="dialog" aria-modal="true" aria-label="Live demo" onClick={(e) => { if (e.target === e.currentTarget) setDemo('dong'); }}>
          <div className="cl-demo-khung">
            <div className="cl-demo-head">
              <MonitorPlay size={15} /> <b>Live demo</b>
              <span className="cl-demo-ghi">App mẫu đúng yêu cầu đề — bấm thử từng chức năng. Mã nguồn không hiển thị.</span>
              <button type="button" onClick={() => setDemo('dong')} aria-label="Đóng demo" className="ml-auto"><X size={16} /></button>
            </div>
            <KhungAnToan html={demoHtml} title="Live demo" className="cl-demo-if" />
          </div>
        </div>
      )}
    </article>
  );
}
