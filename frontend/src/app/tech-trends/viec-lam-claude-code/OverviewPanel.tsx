'use client';

/**
 * Tab Tổng quan — trả lời ba câu theo đúng thứ tự người đọc sẽ hỏi:
 * tin có thật không, trang kia thực chất là gì, và tôi nộp được cái nào.
 *
 * Phần "bốn chỗ dữ liệu không đáng tin" cố ý đặt TRƯỚC danh sách việc làm.
 * Người đọc cần biết nhãn công nghệ ở nguồn là không đáng tin trước khi họ
 * dùng nhãn đó để lọc việc.
 */
import { AlertTriangle, CheckCircle2, ExternalLink, Info, Layers } from 'lucide-react';
import { BY_SOURCE, SOURCE_UPDATED, STATS, TIERS, VERIFIED_ON } from './data';
import type { TabId } from './ViecLamClient';

const TONE: Record<string, { ring: string; text: string; bar: string }> = {
  ok: { ring: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  warn: { ring: 'border-amber-500/30', text: 'text-amber-400', bar: 'bg-amber-500' },
  bad: { ring: 'border-rose-500/30', text: 'text-rose-400', bar: 'bg-rose-500' },
  far: { ring: 'border-slate-500/30', text: 'text-slate-400', bar: 'bg-slate-500' },
};

/** Kết quả kiểm chứng theo từng nguồn. */
const CHECKS: { src: string; verdict: string; ok: boolean; how: string }[] = [
  {
    src: 'Anthropic',
    verdict: `${BY_SOURCE.Anthropic ?? 0}/${BY_SOURCE.Anthropic ?? 0} sống`,
    ok: true,
    how: 'Mọi link trỏ tới trang Greenhouse thật của Anthropic, trả về HTTP 200 và tiêu đề trang khớp đúng tên vị trí.',
  },
  {
    src: 'HackerNews',
    verdict: `${BY_SOURCE.HackerNews ?? 0}/${BY_SOURCE.HackerNews ?? 0} khớp nguyên văn`,
    ok: true,
    how: 'Kiểm qua API Algolia của HN: mọi bình luận gốc đều tồn tại, không tin nào bị [dead] hay [flagged], và chữ trên trang khớp đúng chữ trong bình luận.',
  },
  {
    src: 'RemoteOK',
    verdict: `${BY_SOURCE.RemoteOK ?? 0}/${BY_SOURCE.RemoteOK ?? 0} sống`,
    ok: true,
    how: 'Trang tin còn mở bình thường.',
  },
  {
    src: 'WeWorkRemotely',
    verdict: `1/${BY_SOURCE.WeWorkRemotely ?? 0} sống`,
    ok: false,
    how: 'Một tin bị Cloudflare chặn nên không đọc được — không có dấu hiệu nào cho thấy nó chết.',
  },
];

/** Bốn chỗ dữ liệu nguồn không đáng tin, kèm con số đo được. */
const WARNINGS: { n: string; title: string; body: string }[] = [
  {
    n: '14/20',
    title: 'Nhãn công nghệ phần lớn là bịa',
    body: 'Lấy 6 tin Anthropic rồi đối chiếu từng nhãn với mô tả công việc gốc: 14 trên 20 nhãn không hề xuất hiện trong JD. "Rust" và "AWS" bị dán vào gần như mọi tin Anthropic, kể cả vị trí Product Manager và Technical Enablement Lead. Đừng lọc việc theo nhãn của trang đó.',
  },
  {
    n: String(STATS.stale90),
    title: 'Tin quá 90 ngày vẫn nằm nguyên',
    body: 'Tin HackerNews lấy từ chủ đề "Who is hiring?" hằng tháng — bản chất là ảnh chụp của tháng đó. Trang không gỡ tin cũ, nên vẫn còn tin từ tháng 5, và có một tin Anthropic đăng cách đây 18 tháng. "Cập nhật hằng ngày" chỉ đúng ở chỗ thêm tin mới, không phải dọn tin cũ.',
  },
  {
    n: String(STATS.jobs - STATS.unique),
    title: 'Tin trùng đội số lên',
    body: `Cùng một vị trí đăng lại nhiều tháng liên tiếp bị đếm thành nhiều việc: Railway 3 lần, còn ALBERT, Kepler, vvd, Cora AI, Obsidian Security, Deep Core, FeedbackPulse, We The Flywheel… mỗi bên 2 lần. Con số thật là ${STATS.unique}, không phải ${STATS.jobs}.`,
  },
  {
    n: '5+',
    title: 'Tên công ty bóc sai',
    body: 'Bot cắt chuỗi văn bản HN khá ẩu: có "công ty" tên "We are hiring full", một công ty tên "Santa Clara, CA" (thật ra là Jefit — cột công ty và địa điểm bị đảo), rồi "*Scribd", "Flywheel Motion ( )", "airCFO ( )". Tin RemoteOK "Jasper" của Hot9ja thì phần mô tả chỉ là văn quảng cáo hứng nhầm.',
  },
];

export default function OverviewPanel({ onGoTo }: { onGoTo: (t: TabId) => void }) {
  return (
    <div className="space-y-10">
      {/* ── Phán quyết ─────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-5 sm:p-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Phán quyết
          </div>
          <p className="text-lg sm:text-xl font-semibold leading-snug text-white">
            Việc làm là <span className="text-emerald-400">thật</span> — {STATS.jobs - 2}/{STATS.jobs}{' '}
            tin xác minh còn sống, không có tin bịa. Nhưng danh sách{' '}
            <span className="text-rose-400">bị thổi phồng</span>: {STATS.jobs - STATS.unique} tin
            trùng, {STATS.stale90} tin quá 90 ngày, và nhãn công nghệ thì sai quá nửa.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Hai tin còn lại không kết luận được vì WeWorkRemotely và HackerNews chặn tốc độ truy cập
            lúc kiểm, không phải vì link chết. Kiểm ngày {VERIFIED_ON}; dữ liệu nguồn cập nhật{' '}
            {SOURCE_UPDATED}.
          </p>
        </div>
      </section>

      {/* ── Đã kiểm thế nào ────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-white">Đã kiểm thế nào</h2>
        <p className="mb-4 text-sm text-slate-400">
          Không tin bảng thống kê của chính trang đó. Tải tệp dữ liệu gốc{' '}
          <code className="rounded bg-white/[0.07] px-1.5 py-0.5 text-xs text-slate-300">
            claude-jobs.json
          </code>{' '}
          rồi kiểm từng nguồn theo cách riêng của nó.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHECKS.map((c) => (
            <div key={c.src} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">{c.src}</span>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                    c.ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                  }`}
                >
                  {c.verdict}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-400">{c.how}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trang kia là gì ────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-white">Trang app.aitmpl.com thực chất là gì</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-slate-300">
            Nó <strong className="text-white">không phải nhà tuyển dụng</strong>, cũng không phải sàn
            việc làm. Đây là một trang con của aitmpl.com (kho component cho Claude Code) — một con
            bot gom tin tuyển dụng có nhắc Claude Code từ 4 nơi công khai rồi bày lại. Bạn{' '}
            <strong className="text-white">không nộp hồ sơ qua trang đó</strong>: mọi nút &quot;apply&quot;
            đều bắn thẳng về HackerNews, Greenhouse, RemoteOK hoặc WeWorkRemotely. Nó bắt đăng nhập
            chỉ để xem chi tiết, nhưng dữ liệu thì nằm công khai ở{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 text-xs text-slate-300">
              /claude-jobs.json
            </code>
            , không cần tài khoản.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { n: STATS.jobs, l: 'tin trong dữ liệu' },
            { n: STATS.companies, l: 'công ty khác nhau' },
            { n: STATS.unique, l: 'tin sau khi bỏ trùng' },
            { n: STATS.fresh45, l: 'tin trong 45 ngày' },
            { n: STATS.fresh7, l: 'tin trong 7 ngày' },
            { n: STATS.withSalary, l: 'tin có ghi lương' },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-2xl font-bold tabular-nums text-white">{s.n}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cảnh báo ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          Bốn chỗ dữ liệu nguồn không đáng tin
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          Việc thì thật, nhưng đừng đọc trang đó như đọc một sàn tuyển dụng nghiêm túc.
        </p>
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {WARNINGS.map((w) => (
            <div key={w.title} className="flex gap-4 p-4">
              <span className="w-14 shrink-0 text-xl font-bold tabular-nums text-rose-400">
                {w.n}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">{w.title}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bốn nhóm ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
          <Layers className="h-5 w-5 text-sky-400" />
          Bạn nộp được cái nào
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          Xếp cả {STATS.jobs} tin theo góc nhìn: một dev ở Việt Nam, chưa có visa lao động Mỹ/EU,
          kinh nghiệm đi làm chính thức còn ít.
        </p>
        <div className="space-y-3">
          {TIERS.map((t) => {
            const tone = TONE[t.tone];
            const n = STATS.byTier[t.id];
            return (
              <div
                key={t.id}
                className={`rounded-2xl border bg-white/[0.03] p-4 sm:p-5 ${tone.ring}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 shrink-0">
                    <div className={`text-3xl font-bold tabular-nums leading-none ${tone.text}`}>
                      {n}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                      {t.short}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{t.label}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{t.desc}</p>
                    {t.id === 'A' && (
                      <p className="mt-2 text-[13px] leading-relaxed text-emerald-300/90">
                        {STATS.byTier.A} tin này chỉ đến từ {STATS.tierAUnique} công ty, và chỉ{' '}
                        {STATS.tierAFresh} tin còn tươi dưới 60 ngày. Riêng We The Flywheel có hai
                        vai trò khác nhau cùng mang tên &quot;Software Engineer&quot; — một ở Sài Gòn
                        (hybrid) và một remote toàn cầu — nên nộp được cả hai.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onGoTo('viec-lam')}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-sm text-slate-300 transition-colors hover:border-white/30 hover:text-white"
        >
          Xem đủ {STATS.jobs} việc
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </section>

      {/* ── Bắt đầu từ đâu ─────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.07] p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Info className="h-4 w-4" />
            Bắt đầu từ đâu
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Có một việc ở <strong className="text-white">TP.HCM</strong> khớp với bạn nhất trong cả{' '}
            {STATS.jobs} tin — hợp đồng bán thời gian, dùng đúng Claude Code, và JD ghi thẳng
            &quot;không cần nền lập trình chính quy&quot;. Nó nằm ở chặng 0 của lộ trình, nghĩa là
            nộp trước rồi học sau: cơ hội có hạn sử dụng, kỹ năng thì không.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onGoTo('lo-trinh')}
              className="rounded-xl bg-sky-500 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-400"
            >
              Mở lộ trình {STATS.phases} chặng
            </button>
            <button
              type="button"
              onClick={() => onGoTo('du-an')}
              className="rounded-xl border border-white/15 px-3.5 py-2 text-sm text-slate-300 transition-colors hover:border-white/30 hover:text-white"
            >
              Xem {STATS.projects} dự án thật
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
