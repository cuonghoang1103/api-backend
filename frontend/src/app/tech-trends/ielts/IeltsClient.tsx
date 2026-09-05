'use client';

/**
 * Khoá IELTS 0 → 8.0 — lộ trình 5 chặng, mỗi chặng có trọn nội dung học.
 *
 * Ghi chú giao diện (giống /tech-trends/tieng-anh-giao-tiep):
 *  - Trang tự mang nền tối cố định, KHÔNG dùng biến thể `dark:` của Tailwind.
 *    Ở dự án này `dark:` được giữ riêng cho khối Notes; đặt class `dark` ra
 *    ngoài phạm vi đó từng làm hỏng bộ đổi theme của Notes.
 *  - Mọi thứ đọc localStorage SAU khi mount, nếu không sẽ lệch HTML giữa
 *    server và client (hydration mismatch).
 *
 * Thêm chặng mới: dựng `data/stageN/` theo đúng khuôn `data/stage5/`, rồi thêm
 * một bundle vào `data/bundles.ts` — mọi view đã nhận dữ liệu qua prop nên
 * không phải sửa component nào.
 *
 * Hai tab KHÔNG gắn với chặng nào: **Tra cứu** (tìm xuyên cả năm chặng + sổ tay
 * band descriptors, quy đổi điểm, checklist soát bài) và **Luyện mỗi ngày**
 * (bốc bài xuyên chặng). Cả hai tự nạp lấy dữ liệu qua `loadAllStages()` bên
 * trong chunk của chính nó, và cả hai được loại khỏi dòng chú thích "nội dung
 * thuộc chặng…" ngay dưới thanh tab.
 */
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft, Target, GraduationCap, BookOpen, Headphones, FileText, PenLine, Mic,
  Flame, Briefcase, ClipboardList, ListChecks, Keyboard, Search, Sparkles,
} from 'lucide-react';
import { IELTS_STATS } from './data/roadmap';
import { loadStage, type StageBundle } from './data/bundles';
import { STAGE_META, type StageMeta } from './data/stage-meta';
import { STAGE_STATS, STAGE_QUESTION_TYPES, TYPING_COUNTS, TOTAL_STATS } from './data/stats.generated';
// Hook dùng chung với khoá Tiếng Anh Giao Tiếp — chỉ đọc to một câu bằng
// giọng en-US của trình duyệt, không kéo theo phần nào của luồng phỏng vấn.
import { useSpeak } from '../tieng-anh-giao-tiep/useSpeak';
import RoadmapTab from './RoadmapTab';

/**
 * MƯỜI BA tab còn lại tải theo yêu cầu (`next/dynamic`), không nằm trong gói
 * đầu tiên. Chỉ `RoadmapTab` là tĩnh vì nó là tab MẶC ĐỊNH — dựng động nó thì
 * người mở trang phải nhìn khung xám trước khi thấy nội dung đầu tiên, tức là
 * đánh đổi đúng cái thứ mà việc tách gói định cải thiện.
 *
 * `ssr: false` cho cả mười ba: lúc dựng tĩnh, tab đang mở LUÔN là 'roadmap',
 * nên không tab nào trong số này từng được render phía máy chủ. Khai `ssr: false`
 * chỉ nói thẳng ra sự thật đó và cắt luôn phần HTML rỗng tương ứng.
 *
 * Chỗ ăn nhiều nhất là `AiCoachView`: nó kéo theo `react-markdown` + `remark-gfm`
 * + cả họ `micromark`, mà chỉ một tab dùng. Trước khi tách, mọi người mở trang
 * đều tải chỗ đó dù không bao giờ bấm vào tab AI.
 *
 * Dữ liệu bài học cũng đã tách: `bundles.ts` nạp TỪNG chặng bằng `import()` động
 * (`loadStage`), nên gói đầu không còn 1,23 MB nội dung năm chặng. Khung trang
 * đọc từ hai file nhẹ — `stage-meta.ts` (chuỗi) và `stats.generated.ts` (số do
 * máy sinh) — nên badge và con số ở đầu trang KHÔNG hiện trễ; chỉ nội dung bên
 * trong tab mới phải chờ chunk của chặng về.
 */
const dyn = <P,>(load: () => Promise<{ default: React.ComponentType<P> }>) =>
  dynamic(load, { ssr: false, loading: () => <TabSkeleton /> });

const LessonsView = dyn(() => import('./LessonsView'));
const VocabView = dyn(() => import('./VocabView'));
const ListeningView = dyn(() => import('./ListeningView'));
const ReadingView = dyn(() => import('./ReadingView'));
const WritingView = dyn(() => import('./WritingView'));
const SpeakingView = dyn(() => import('./SpeakingView'));
const DailyView = dyn(() => import('./DailyView'));
const LifeView = dyn(() => import('./LifeView'));
const ExamView = dyn(() => import('./ExamView'));
const QuestionTypesView = dyn(() => import('./QuestionTypesView'));
const TypingPanel = dyn(() => import('./TypingPanel'));
const LookupView = dyn(() => import('./LookupView'));
const AiCoachView = dyn(() => import('./AiCoachView'));

/** Khung chờ trong lúc chunk của tab đang tải. Giữ chiều cao để trang không giật. */
function TabSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-hidden="true">
      <div className="h-16 rounded-xl bg-white/[0.04]" />
      <div className="h-40 rounded-2xl bg-white/[0.03]" />
      <div className="h-40 rounded-2xl bg-white/[0.03]" />
    </div>
  );
}

type TabId =
  | 'roadmap' | 'daily' | 'ai' | 'qtypes' | 'lessons' | 'vocab' | 'listening'
  | 'reading' | 'writing' | 'speaking' | 'typing' | 'lookup' | 'life' | 'exam';

/**
 * Con số trên tab tính TỪ DỮ LIỆU của chặng đang xem, không gõ tay. Gõ tay thì
 * thêm nội dung xong quên sửa số — đã dính đúng lỗi đó một lần: badge ghi 10
 * trong khi có 11 tình huống.
 *
 * Tab "Dạng câu hỏi" chỉ hiện khi chặng đó có dữ liệu (từ chặng 2 trở đi).
 */
/**
 * Thanh tab dựng từ `STAGE_META` + `stats.generated` — hai file NHẸ, nạp sẵn.
 *
 * Đây là chỗ quyết định việc tách gói có làm hỏng trải nghiệm hay không. Nếu
 * badge đọc từ `d.stats` (dữ liệu nạp động) thì mọi con số sẽ hiện trễ một
 * nhịp sau mỗi lần đổi chặng — nhìn như trang bị lỗi. Đọc từ số đã sinh sẵn
 * thì badge có NGAY, chỉ nội dung bên trong tab mới phải chờ chunk của chặng.
 */
function tabsFor(meta: StageMeta): { id: TabId; label: string; icon: typeof Target; badge?: string }[] {
  const st = STAGE_STATS[meta.id];
  const qtypes = STAGE_QUESTION_TYPES[meta.id];
  return [
    { id: 'roadmap', label: 'Lộ trình', icon: Target },
    { id: 'daily', label: 'Luyện mỗi ngày', icon: Flame, badge: '15' },
    { id: 'ai', label: 'Học cùng AI', icon: Sparkles },
    ...(qtypes > 0
      ? [{ id: 'qtypes' as TabId, label: 'Dạng câu hỏi', icon: ListChecks, badge: String(qtypes) }]
      : []),
    { id: 'lessons', label: 'Bài học', icon: GraduationCap, badge: String(st.lessons) },
    { id: 'vocab', label: 'Từ vựng', icon: BookOpen, badge: String(st.words) },
    { id: 'listening', label: 'Nghe', icon: Headphones, badge: String(st.listenings) },
    { id: 'reading', label: 'Đọc', icon: FileText, badge: String(st.readings) },
    { id: 'writing', label: 'Viết', icon: PenLine, badge: String(st.writings) },
    { id: 'speaking', label: 'Nói', icon: Mic, badge: String(st.speakingTopics) },
    { id: 'typing', label: 'Gõ đoạn văn', icon: Keyboard, badge: String(TYPING_COUNTS[meta.id]) },
    { id: 'lookup', label: 'Tra cứu', icon: Search },
    { id: 'life', label: 'Đời sống & Việc làm', icon: Briefcase, badge: '11' },
    { id: 'exam', label: 'Cẩm nang thi', icon: ClipboardList },
  ];
}

/** Tab nào cần nội dung chặng. Mấy tab còn lại chạy được mà không cần nạp gì. */
const NEEDS_STAGE = new Set<TabId>([
  'qtypes', 'lessons', 'vocab', 'listening', 'reading', 'writing', 'speaking', 'ai',
]);

export default function IeltsClient() {
  const [tab, setTab] = useState<TabId>('roadmap');
  const [stageIdx, setStageIdx] = useState(0);
  const { speak, current, supported } = useSpeak();

  const meta = STAGE_META[stageIdx];
  const [loaded, setLoaded] = useState<StageBundle | null>(null);

  /**
   * `d` chỉ hợp lệ khi bundle đã nạp ĐÚNG là của chặng đang chọn. So `id` thay
   * vì xoá state lúc đổi chặng: nếu không so, có đúng một nhịp render mà header
   * ghi "Chặng 2" trong khi bên dưới còn là nội dung chặng 1.
   */
  const d = loaded && loaded.id === meta.id ? loaded : null;

  /**
   * Nạp chặng ngay khi mount, nhưng hoãn tới lúc trình duyệt rảnh. Người mở
   * trang thấy khung + lộ trình gần như tức thì, còn chunk nội dung tải song
   * song trong lúc họ đọc — nên bấm sang tab Bài học thường là đã sẵn sàng.
   *
   * Hoãn bằng `requestIdleCallback` chứ không gọi thẳng: gọi thẳng thì nó tranh
   * băng thông với chính những chunk cần cho lần vẽ đầu tiên.
   */
  useEffect(() => {
    let alive = true;
    const go = () => { loadStage(meta.id).then((b) => { if (alive) setLoaded(b); }); };
    const ric = typeof window !== 'undefined'
      ? (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
      : undefined;
    const handle = ric ? ric(go) : window.setTimeout(go, 200);
    return () => {
      alive = false;
      if (!ric) window.clearTimeout(handle as number);
    };
  }, [meta.id]);

  const TABS = tabsFor(meta);
  // Đổi sang chặng không có tab đang mở (ví dụ Dạng câu hỏi) thì lùi về Lộ trình.
  const activeTab: TabId = TABS.some((t) => t.id === tab) ? tab : 'roadmap';

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: '#0a0a0f' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/tech-trends"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tech Trends
        </Link>

        <header className="mb-6">
          <p className="text-sky-400 text-sm font-medium tracking-wide uppercase mb-2">
            Luyện thi · 5 chặng band · trọn giáo trình 0 → 8.0
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Lộ trình IELTS 0 → 8.0
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl leading-relaxed">
            Lộ trình chia năm chặng band: mỗi chặng ghi rõ bạn đang ở đâu, mỗi ngày làm gì cho từng kỹ
            năng, và khi nào đủ điều kiện lên chặng sau. <b className="text-slate-200">Chặng 1 (0 → 4.0)</b>{' '}
            xây nền từ con số không · <b className="text-slate-200">chặng 2</b> vào đề thi thật với cẩm nang
            {' '}{TOTAL_STATS.questionTypes} dạng câu hỏi · <b className="text-slate-200">chặng 3</b> phá vòng lặp
            &quot;viết nhiều mà không lên điểm&quot; · <b className="text-slate-200">chặng 4</b> giảm lỗi để chạm 7.5
            · <b className="text-slate-200">chặng 5</b> chặng không có sách, chỉ còn bỏ lỗi và tìm người chấm bài.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-slate-300"><b className="text-white">{IELTS_STATS.stages}</b> chặng</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.lessons}</b> bài học</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.words}</b> từ vựng</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.readings + TOTAL_STATS.listenings}</b> bài đọc &amp; nghe</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.graded}</b> câu chấm điểm</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.writings}</b> đề viết có bài mẫu</span>
          </div>
        </header>

        {/* Bộ chuyển chặng — quyết định toàn bộ dữ liệu hiện bên dưới */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Đang học chặng</span>
            {STAGE_META.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStageIdx(i)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
                  i === stageIdx
                    ? 'bg-sky-500/20 border-sky-400/45 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <b>{s.label}</b>
                <span className={`text-[11px] ${i === stageIdx ? 'text-sky-200' : 'text-slate-600'}`}>
                  {s.band}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{meta.focus}</p>
        </div>

        {/* Tab */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 border-b border-white/10">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-sm transition-all active:scale-95 border-b-2 ${
                  active
                    ? 'border-sky-400 text-white bg-white/[0.04]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {t.badge && (
                  <span className={`text-[10px] px-1.5 rounded ${active ? 'bg-sky-500/25 text-sky-200' : 'bg-white/5 text-slate-500'}`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab !== 'roadmap' && activeTab !== 'life' && activeTab !== 'exam'
          && activeTab !== 'lookup' && activeTab !== 'ai' && (
          <p className="mb-5 text-xs text-slate-500 leading-relaxed rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            Nội dung dưới đây thuộc <b className="text-slate-300">{meta.label} — {meta.band}</b>. Bài đọc, bài
            nghe và đề viết đều do khoá này tự soạn theo đúng dạng đề thật (không chép đề có bản quyền), nên
            mỗi câu đều có lời giải thích vì sao đúng và vì sao sai.
          </p>
        )}

        {activeTab === 'roadmap' && (
          <RoadmapTab
            onGoToStage={(i) => { setStageIdx(i); setTab('lessons'); }}
          />
        )}
        {activeTab === 'daily' && <DailyView />}
        {activeTab === 'typing' && <TypingPanel stageId={meta.id} />}
        {activeTab === 'lookup' && <LookupView />}

        {/* Tám tab dưới đây cần nội dung chặng — chờ chunk của chặng về mới vẽ. */}
        {NEEDS_STAGE.has(activeTab) && !d && <TabSkeleton />}
        {d && (
          <>
            {activeTab === 'ai' && <AiCoachView d={d} />}
            {activeTab === 'qtypes' && d.questionTypes && (
              <QuestionTypesView types={d.questionTypes} notes={d.strategyNotes ?? []} />
            )}
            {activeTab === 'lessons' && <LessonsView d={d} speak={speak} current={current} supported={supported} />}
            {activeTab === 'vocab' && <VocabView d={d} speak={speak} current={current} supported={supported} />}
            {activeTab === 'listening' && <ListeningView d={d} supported={supported} />}
            {activeTab === 'reading' && <ReadingView d={d} />}
            {activeTab === 'writing' && <WritingView d={d} />}
            {activeTab === 'speaking' && <SpeakingView d={d} speak={speak} current={current} supported={supported} />}
          </>
        )}
        {activeTab === 'life' && <LifeView speak={speak} current={current} supported={supported} />}
        {activeTab === 'exam' && <ExamView />}

        {/* Ghi chú cuối trang */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            <b className="text-white">Trọn năm chặng đã có nội dung.</b> Bài đọc, transcript bài nghe và đề viết
            đều do khoá này tự soạn theo đúng dạng đề thật — không chép đề có bản quyền — nên mỗi câu đều có
            lời giải thích vì sao đúng và vì sao sai. Biểu đồ Task 1 và bản đồ Listening vẽ bằng SVG ngay
            trong trang. Phần giao tiếp hằng ngày và luyện phát âm có thêm ở{' '}
            <Link href="/tech-trends/tieng-anh-giao-tiep" className="text-emerald-400 hover:underline">
              khoá Tiếng Anh Giao Tiếp
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
