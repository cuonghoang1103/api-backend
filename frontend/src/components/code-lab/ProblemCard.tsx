'use client';

/**
 * Thẻ đề Code Lab kiểu LeetCode — "slide nhỏ" nền TRẮNG (đợt 1, 14/10/2026).
 *
 * Trước đây đề in thành một mạch dài trên nền trang: tiêu đề mục in hoa nhỏ,
 * ví dụ là lưới 2 ô tối, ràng buộc là một khối chữ thô, khối "AI giải thích"
 * chen giữa. Thẻ này gom tất cả vào MỘT tấm giấy sáng:
 *   đầu thẻ (số bài · tiêu đề · chip độ khó · ≈phút · điểm · ✓) → chủ đề (gập)
 *   → thân đề → Đầu vào/Đầu ra → Ví dụ N (khung mono Input/Output/Giải thích)
 *   → Ràng buộc (danh sách) → Gợi ý 1/2/3 (mở/đóng từng cái) → Hình minh hoạ (gập).
 *
 * Theme tối: thẻ VẪN sáng. Nó tự khai lại các token theme (--text-primary,
 * --bg-surface, --border-color…) ở `.cl-pcard` (code-lab.css), nên mọi thứ lồng
 * bên trong — prose của đề, callout LAB211, nút tài nguyên — tự đọc bảng màu
 * sáng mà không phải sửa từng component. KHÔNG dùng `dark:` (CLAUDE.md).
 *
 * Đề cũ không có `examplesJson`: thân đề được dò mẫu "Example/Input:/Output:"
 * bằng `extractExamples` (problemParse.ts) — chỉ bóc khi chắc chắn, còn lại để
 * nguyên. Thân đề không phải HTML ⇒ render markdown.
 */
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  CheckCircle2, Clock, Layers, Lightbulb, ListChecks, Tag, Image as ImageIcon,
  FileText, ExternalLink, Download, Youtube, ChevronRight,
} from 'lucide-react';
import type { CodeExercise } from '@/types/code-lab';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { pickLang } from '@/lib/utils';
import { DIFF_UI } from '@/lib/codelabUi';
import { CodeViewer } from '@/components/exp-hub/CodeViewer';
import { ExerciseResources } from '@/components/code-lab/ExerciseResources';
import { extractExamples, looksLikeHtml, splitConstraints, type ParsedExample } from './problemParse';

const Markdown = dynamic(() => import('@/components/markdown/Markdown'), { ssr: false, loading: () => null });

export function DifficultyChip({ difficulty, small }: { difficulty: CodeExercise['difficulty']; small?: boolean }) {
  const d = DIFF_UI[difficulty] ?? DIFF_UI.MEDIUM;
  return (
    <span
      className="cl-diff-chip"
      data-small={small ? 'true' : undefined}
      style={{ color: d.color, background: d.bg, borderColor: d.border }}
    >
      {d.label}
    </span>
  );
}

/** EN / VN — chỉ hiện khi bài có bản dịch. */
export function LangSwitch({ lang, onPick }: { lang: 'en' | 'vi'; onPick: (l: 'en' | 'vi') => void }) {
  return (
    <span className="cl-lang" role="group" aria-label="Ngôn ngữ đề">
      {(['en', 'vi'] as const).map((c) => (
        <button key={c} type="button" onClick={() => onPick(c)} aria-pressed={lang === c} data-on={lang === c ? 'true' : undefined}>
          {c === 'en' ? 'EN' : 'VN'}
        </button>
      ))}
    </span>
  );
}

/** Bài có nội dung song ngữ (bản VI riêng, hoặc chuỗi dạng `EN|||VI`). */
export function hasBilingual(ex: CodeExercise): boolean {
  if (ex.problemHtmlVi || ex.solutionExplanationHtmlVi) return true;
  const strs: Array<string | null | undefined> = [
    ex.title, ex.constraints, ex.inputSpec, ex.outputSpec, ...(ex.hintsJson || []),
    ...(ex.examplesJson || []).flatMap((e) => [e.input, e.output, e.explanation]),
  ];
  return strs.some((s) => typeof s === 'string' && s.includes('|||'));
}

interface Props {
  ex: CodeExercise;
  lang: 'en' | 'vi';
  onPickLang: (l: 'en' | 'vi') => void;
  solved: boolean;
  /** "Bài 3/5" — vị trí trong bộ/track; bỏ trống thì không hiện. */
  orderLabel?: string | null;
  isLab211: boolean;
  /** Gợi ý đã có tab riêng (trang làm bài đợt Academy) ⇒ không in lại trong thẻ đề. */
  anGoiY?: boolean;
}

export function ProblemCard({ ex, lang, onPickLang, solved, orderLabel, isLab211, anGoiY }: Props) {
  const L = (s: string | null | undefined) => pickLang(s, lang);
  const bilingual = hasBilingual(ex);

  // Thân đề: bản VI riêng nếu có, không thì tách `EN|||VI` (nếu có).
  const rawBody = (lang === 'vi' && ex.problemHtmlVi) || L(ex.problemHtml) || '';
  const isHtml = looksLikeHtml(rawBody);
  const structured = (ex.examplesJson || []).filter((e) => (e.input || '').trim() || (e.output || '').trim());

  // Đề cũ không có ví dụ có cấu trúc ⇒ thử bóc từ thân đề (chỉ khi chắc chắn).
  const { body, examples } = useMemo((): { body: string; examples: ParsedExample[] } => {
    if (structured.length) {
      return {
        body: rawBody,
        examples: structured.map((e) => ({ input: L(e.input), output: L(e.output), explanation: L(e.explanation) || undefined })),
      };
    }
    return extractExamples(rawBody, isHtml ? 'html' : 'md');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawBody, isHtml, ex.examplesJson, lang]);

  const constraints = useMemo(() => splitConstraints(L(ex.constraints)), [ex.constraints, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const hints = anGoiY ? [] : (ex.hintsJson || []).map((h) => L(h)).filter(Boolean);
  const thuatNgu = ex.glossaryJson || [];
  const topics = Array.from(new Set([...(ex.tags || []), ...(ex.concepts || [])].filter(Boolean)));
  const prereqs = ex.prerequisites || [];
  const figures = ex.imagesJson || [];
  const hasFigures = !!(ex.diagramMermaid || ex.diagramImageUrl || ex.briefPdfUrl || figures.length);
  const inSpec = L(ex.inputSpec);
  const outSpec = L(ex.outputSpec);

  return (
    <article className="cl-pcard" aria-label="Đề bài">
      {/* ── Đầu thẻ ── */}
      <header className="cl-pcard-head">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {orderLabel && <span className="font-semibold tabular-nums">{orderLabel}</span>}
          {orderLabel && ex.module?.name && <span aria-hidden>·</span>}
          {ex.module?.name && <span className="inline-flex items-center gap-1"><Layers size={12} />{L(ex.module.name)}</span>}
          {bilingual && <span className="ml-auto"><LangSwitch lang={lang} onPick={onPickLang} /></span>}
        </div>
        <h1 className="cl-pcard-title">{L(ex.title)}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyChip difficulty={ex.difficulty} />
          {solved && (
            <span className="cl-meta-chip" style={{ color: '#15803d', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <CheckCircle2 size={13} /> Đã giải
            </span>
          )}
          <span className="cl-meta-chip">{ex.language}</span>
          {ex.estimatedMinutes ? <span className="cl-meta-chip"><Clock size={12} /> ≈ {ex.estimatedMinutes} phút</span> : null}
          <span className="cl-meta-chip">{ex.points} điểm</span>
        </div>
        {(topics.length > 0 || prereqs.length > 0) && (
          <details className="cl-pcard-topics">
            <summary><Tag size={12} /> Chủ đề ({topics.length}) <ChevronRight size={13} className="cl-caret" /></summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topics.map((t) => <span key={t} className="cl-topic">{t}</span>)}
            </div>
            {prereqs.length > 0 && (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <b>Cần biết trước:</b> {prereqs.join(', ')}
              </p>
            )}
          </details>
        )}
      </header>

      <div className="cl-pcard-body">
        <ExerciseResources youtubeUrl={ex.youtubeUrl} githubUrl={ex.githubUrl} sourceUrl={ex.sourceUrl} />

        {/* ── Thân đề ── */}
        {body.trim() && (
          isHtml
            ? <div className="prose-cl cl-pcard-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }} />
            : <div className="prose-cl cl-pcard-prose"><Markdown mdx={body} /></div>
        )}

        {/* ── Đầu vào / Đầu ra ── */}
        {(inSpec || outSpec) && (
          <section className="cl-pcard-sec">
            <dl className="cl-spec">
              {inSpec && (<><dt>Đầu vào</dt><dd>{inSpec}</dd></>)}
              {outSpec && (<><dt>Đầu ra</dt><dd>{outSpec}</dd></>)}
            </dl>
          </section>
        )}

        {/* ── Ví dụ ── */}
        {examples.length > 0 && (
          <section className="cl-pcard-sec">
            {examples.map((e, i) => (
              <div key={i} className="cl-example">
                <h3 className="cl-pcard-h">Ví dụ {i + 1}</h3>
                <dl className="cl-example-box">
                  <div><dt>Input</dt><dd>{e.input || '—'}</dd></div>
                  <div><dt>Output</dt><dd>{e.output || '—'}</dd></div>
                  {e.explanation && <div><dt>Giải thích</dt><dd className="cl-example-why">{e.explanation}</dd></div>}
                </dl>
              </div>
            ))}
          </section>
        )}

        {/* ── Ràng buộc ── */}
        {constraints.length > 0 && (
          <section className="cl-pcard-sec">
            <h3 className="cl-pcard-h"><ListChecks size={14} /> Ràng buộc</h3>
            <ul className="cl-constraints">
              {constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}

        {/* ── Thuật ngữ EN → VI (đề tiếng Anh — trợ giúp, không thay bản EN) ── */}
        {thuatNgu.length > 0 && (
          <details className="cl-pcard-sec cl-gloss" open={lang === 'en'}>
            <summary className="cl-pcard-h"><Tag size={14} /> Thuật ngữ (EN → VI) · {thuatNgu.length}<ChevronRight size={14} className="cl-caret" /></summary>
            <dl className="cl-gloss-list">
              {thuatNgu.map((t) => (
                <div key={t.en}>
                  <dt>{t.en}</dt>
                  <dd>{t.vi}{t.giaiThich ? <span className="cl-gloss-why"> — {t.giaiThich}</span> : null}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}

        {/* ── Gợi ý: mở/đóng TỪNG cái ── */}
        {hints.length > 0 && (
          <section className="cl-pcard-sec">
            <h3 className="cl-pcard-h"><Lightbulb size={14} /> Gợi ý</h3>
            <div className="cl-hints">
              {hints.map((h, i) => (
                <details key={i} className="cl-hint">
                  <summary><Lightbulb size={13} /> Gợi ý {i + 1}<ChevronRight size={14} className="cl-caret ml-auto" /></summary>
                  <p>{h}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── Hình minh hoạ: sơ đồ, ảnh, PDF đề gốc. Mở sẵn với LAB211 (đề gốc là PDF của trường). ── */}
        {hasFigures && (
          <details className="cl-pcard-sec cl-figs" open={isLab211 || !!ex.briefPdfUrl}>
            <summary className="cl-pcard-h"><ImageIcon size={14} /> Hình minh hoạ{ex.briefPdfUrl ? ' & đề gốc' : ''}<ChevronRight size={14} className="cl-caret" /></summary>
            <div className="mt-2 space-y-4">
              {ex.diagramMermaid && <CodeViewer code={ex.diagramMermaid} language="mermaid" />}
              {ex.diagramImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ex.diagramImageUrl} alt="Sơ đồ" className="mx-auto max-h-[420px] rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
              )}
              {ex.briefPdfUrl && (
                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}><FileText size={13} /> Đề gốc (PDF)</div>
                  {/* <iframe>, KHÔNG <object>: CSP object-src 'none' chặn <object>/<embed>. */}
                  <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                    <iframe src={`${ex.briefPdfUrl}#view=FitH`} title="Đề gốc" loading="lazy" className="block h-[640px] w-full" style={{ border: 0, background: '#fff' }} />
                  </div>
                  <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>Trên điện thoại khung PDF có thể trắng — dùng “Mở PDF toàn màn hình”.</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs">
                    <a href={ex.briefPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline" style={{ color: '#4f46e5' }}>
                      <ExternalLink size={12} /> Mở PDF toàn màn hình
                    </a>
                    {ex.briefFileUrl && ex.briefFileUrl !== ex.briefPdfUrl && (
                      <a href={ex.briefFileUrl} download className="inline-flex items-center gap-1 underline" style={{ color: '#4f46e5' }}>
                        <Download size={12} /> Tải file Word gốc
                      </a>
                    )}
                  </div>
                </div>
              )}
              {figures.map((im, i) => (
                <figure key={i}>
                  <a href={im.url} target="_blank" rel="noopener noreferrer" title="Mở cỡ đầy đủ">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.url} alt={im.caption || `Hình ${i + 1}`} loading="lazy" className="mx-auto max-h-[520px] w-auto max-w-full rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
                  </a>
                  <figcaption className="mt-1 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    {im.caption ? `Hình ${i + 1} — ${im.caption}` : `Hình ${i + 1}`}
                  </figcaption>
                </figure>
              ))}
            </div>
          </details>
        )}

        {/* ── Tham khảo ── */}
        {(ex.youtubeUrl || ex.referenceUrl) && (
          <section className="cl-pcard-sec flex flex-wrap gap-3 text-sm">
            {ex.youtubeUrl && (
              <a href={ex.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline" style={{ color: '#dc2626' }}>
                <Youtube size={15} /> Video hướng dẫn
              </a>
            )}
            {ex.referenceUrl && (
              <a href={ex.referenceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline" style={{ color: 'var(--text-secondary)' }}>
                <ExternalLink size={14} /> Tài liệu tham khảo
              </a>
            )}
          </section>
        )}
      </div>
    </article>
  );
}
