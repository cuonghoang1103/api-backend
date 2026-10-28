'use client';

/**
 * Tab "Lời giải" (đợt 1, 14/10/2026).
 *
 * Hai lớp khoá:
 *  1. KHÁCH chưa đăng nhập: backend không còn gửi lời giải trong payload đề
 *     (cờ `solutionLocked: true` + `hasSolution`) ⇒ nút "Đăng nhập để xem lời giải"
 *     (về /login?redirect=<trang này>).
 *  2. ĐÃ đăng nhập: KHOÁ MỀM — bấm "Tôi muốn xem lời giải" rồi XÁC NHẬN một lần
 *     nữa. Không chặn cứng (chưa có máy chấm / "đã nộp" làm điều kiện — đợt 2),
 *     chỉ thêm một nhịp dừng: mở đề rồi đọc đáp án luôn là mất phần có ích nhất.
 *
 * Người đã đăng nhập vẫn nhận lời giải trong payload (tương thích app desktop đã
 * phát hành). Payload thiếu mà `hasSolution` ⇒ lấy riêng qua
 * `GET /code-lab/exercises/:id/solution` lúc mở (layLoiGiaiUi).
 *
 * 3. KHOÁ THEO KẾT QUẢ (28/10/2026, assignment CodeLearn): đề khai `testsJson.loiGiaiSauKhiDat` ⇒ backend không
 *    gửi lời giải (cờ `solutionGate: 'accepted'`) tới khi người học có một lượt Nộp đạt 100%; API lời giải trả
 *    403 `CODELAB_LOI_GIAI_CAN_DAT`. Vừa Nộp đạt trong phiên này thì bấm mở là lấy được (không cần tải lại trang).
 */
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, LogIn } from 'lucide-react';
import type { CodeBlock } from '@/types/code-lab';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { layLoiGiaiUi } from '@/lib/codelabUi';
import { CodeViewer } from '@/components/exp-hub/CodeViewer';

interface Props {
  exerciseId: number;
  lang: 'en' | 'vi';
  /** Lời giải có sẵn trong payload đề (người đã đăng nhập). */
  solution: CodeBlock[];
  explanationHtml: string | null | undefined;
  explanationHtmlVi: string | null | undefined;
  /** Cờ của backend: bài có lời giải chính thức không (khi payload không mang lời giải). */
  hasSolution: boolean;
  /** Khách chưa đăng nhập ⇒ chỉ hiện nút đăng nhập. */
  needLogin: boolean;
  /** Lời giải chỉ mở sau một lượt Nộp đạt 100% (cờ `solutionGate` của backend). */
  gate?: 'accepted';
  loginHref: string;
  revealed: boolean;
  onReveal: (v: boolean) => void;
}

export function SolutionPanel({
  exerciseId, lang, solution, explanationHtml, explanationHtmlVi, hasSolution, needLogin, gate, loginHref, revealed, onReveal,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const [active, setActive] = useState(0);
  // Lời giải lấy riêng (payload đề không mang theo).
  const [fetched, setFetched] = useState<{ code: CodeBlock[]; html: string | null; htmlVi: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loi, setLoi] = useState<'login' | 'gate' | 'other' | null>(null);

  const code = fetched?.code ?? solution;
  const html = fetched ? fetched.html : explanationHtml;
  const htmlVi = fetched ? fetched.htmlVi : explanationHtmlVi;
  const coSan = code.length > 0 || !!html;

  const moLoiGiai = async () => {
    setConfirming(false);
    if (!coSan && hasSolution) {
      setBusy(true);
      setLoi(null);
      try {
        const d = await layLoiGiaiUi(exerciseId);
        setFetched({
          code: (d.solutionCodeJson || []).map((b) => ({ name: b.name, language: b.language, code: b.code })),
          html: d.solutionExplanationHtml,
          htmlVi: d.solutionExplanationHtmlVi,
        });
      } catch (e: unknown) {
        const r = (e as { response?: { status?: number; data?: { code?: string } } })?.response;
        setLoi(r?.data?.code === 'CODELAB_LOI_GIAI_CAN_DAT' ? 'gate' : r?.status === 401 || r?.status === 403 ? 'login' : 'other');
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    onReveal(true);
  };

  if (!coSan && !hasSolution) {
    return (
      <div className="cl-pcard cl-pcard-body text-sm" style={{ color: 'var(--text-secondary)' }}>
        Bài này chưa có lời giải chính thức.
      </div>
    );
  }

  if (needLogin || loi === 'login') {
    return (
      <div className="cl-pcard cl-pcard-body">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: '#f1f5f9', color: '#475569' }}>
            <Lock size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Lời giải dành cho thành viên</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Đăng nhập (miễn phí) để xem lời giải chính thức, lưu bài làm và theo dõi tiến độ.
            </p>
            <Link href={loginHref} className="cl-btn cl-btn-run mt-3">
              <LogIn size={14} /> Đăng nhập để xem lời giải
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Khoá theo kết quả: chưa có lượt Nộp đạt 100% (payload không mang lời giải). Không hỏi xác nhận —
  // bấm là thử lấy; vừa đạt trong phiên này thì máy chủ trả lời giải ngay.
  if (gate === 'accepted' && !coSan && !revealed) {
    return (
      <div className="cl-pcard cl-pcard-body">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: '#fef3c7', color: '#92400e' }}>
            <Lock size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Lời giải mở sau khi bạn đạt</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Đây là bài làm dần (dự án / assignment): lời giải tham chiếu chỉ mở khi bạn <b>Nộp</b> và đạt <b>100% (Accepted)</b>.
              Trong lúc làm, dùng <b>Gợi ý</b> và tab <b>Lỗi hay gặp</b> ở phần Đề.
            </p>
            <button type="button" onClick={() => void moLoiGiai()} disabled={busy} className="cl-btn cl-btn-ghost mt-3">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />} Tôi đã đạt — mở lời giải
            </button>
            {loi === 'gate' && (
              <p className="mt-2 text-xs" style={{ color: '#b45309' }}>Chưa có lượt Nộp nào đạt 100% cho bài này.</p>
            )}
            {loi === 'other' && (
              <p className="mt-2 text-xs" style={{ color: '#b91c1c' }}>Không tải được lời giải — thử lại sau.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="cl-pcard cl-pcard-body">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: '#f1f5f9', color: '#475569' }}>
            <Lock size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Lời giải đang được che</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Thử tự làm trước, kể cả khi chưa xong — vật lộn với đề là lúc bạn học được nhiều nhất.
              Bí quá thì mở từng gợi ý ở tab <b>Đề</b>, hoặc hỏi <b>Giải thích AI</b>.
            </p>
            {!confirming ? (
              <button type="button" onClick={() => setConfirming(true)} disabled={busy} className="cl-btn cl-btn-ghost mt-3">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />} Tôi muốn xem lời giải
              </button>
            ) : (
              <div className="mt-3 rounded-xl border p-3" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
                <p className="text-sm" style={{ color: '#92400e' }}>Chắc chưa? Xem lời giải rồi thì nên tự gõ lại từ đầu mà không nhìn.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void moLoiGiai()} className="cl-btn cl-btn-warn">
                    <Eye size={14} /> Xem lời giải
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="cl-btn cl-btn-ghost">
                    Để tôi thử tiếp
                  </button>
                </div>
              </div>
            )}
            {loi === 'other' && (
              <p className="mt-2 text-xs" style={{ color: '#b91c1c' }}>Không tải được lời giải — thử lại sau.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const cur = code[Math.min(active, code.length - 1)];
  const giaiThich = (lang === 'vi' && htmlVi) || html;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {code.length > 1 ? (
          <div className="flex flex-wrap gap-1">
            {code.map((b, i) => (
              <button key={i} type="button" onClick={() => setActive(i)} className="cl-file-tab" data-on={i === active ? 'true' : undefined}>{b.name}</button>
            ))}
          </div>
        ) : <span />}
        <button type="button" onClick={() => onReveal(false)} className="inline-flex shrink-0 items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <EyeOff size={13} /> Che lại
        </button>
      </div>
      {cur && <CodeViewer code={cur.code} language={cur.language} filename={cur.name} maxHeight="560px" />}
      {giaiThich && (
        <div className="cl-pcard cl-pcard-body">
          <h3 className="cl-pcard-h">Giải thích lời giải</h3>
          <div className="prose-cl cl-pcard-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(giaiThich) }} />
        </div>
      )}
    </div>
  );
}
