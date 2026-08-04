'use client';

/**
 * Khoá IELTS 0 → 7.5 — lộ trình 4 chặng + nội dung học của chặng 1 (0 → 4.0).
 *
 * Ghi chú giao diện (giống /tech-trends/tieng-anh-giao-tiep):
 *  - Trang tự mang nền tối cố định, KHÔNG dùng biến thể `dark:` của Tailwind.
 *    Ở dự án này `dark:` được giữ riêng cho khối Notes; đặt class `dark` ra
 *    ngoài phạm vi đó từng làm hỏng bộ đổi theme của Notes.
 *  - Mọi thứ đọc localStorage SAU khi mount, nếu không sẽ lệch HTML giữa
 *    server và client (hydration mismatch).
 *
 * Chặng 3–4 hiện mới có phần lộ trình. Soạn tiếp thì thêm `data/stage3/` theo
 * đúng khuôn `data/stage2/`, rồi thêm một bundle vào `data/bundles.ts` — mọi
 * view đã nhận dữ liệu qua prop nên không phải sửa component nào.
 */
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Target, GraduationCap, BookOpen, Headphones, FileText, PenLine, Mic,
  Flame, Briefcase, ClipboardList, ListChecks,
} from 'lucide-react';
import { IELTS_STATS } from './data/roadmap';
import { STAGES, TOTAL_STATS, type StageBundle } from './data/bundles';
// Hook dùng chung với khoá Tiếng Anh Giao Tiếp — chỉ đọc to một câu bằng
// giọng en-US của trình duyệt, không kéo theo phần nào của luồng phỏng vấn.
import { useSpeak } from '../tieng-anh-giao-tiep/useSpeak';
import RoadmapTab from './RoadmapTab';
import LessonsView from './LessonsView';
import VocabView from './VocabView';
import ListeningView from './ListeningView';
import ReadingView from './ReadingView';
import WritingView from './WritingView';
import SpeakingView from './SpeakingView';
import DailyView from './DailyView';
import LifeView from './LifeView';
import ExamView from './ExamView';
import QuestionTypesView from './QuestionTypesView';

type TabId =
  | 'roadmap' | 'daily' | 'qtypes' | 'lessons' | 'vocab' | 'listening'
  | 'reading' | 'writing' | 'speaking' | 'life' | 'exam';

/**
 * Con số trên tab tính TỪ DỮ LIỆU của chặng đang xem, không gõ tay. Gõ tay thì
 * thêm nội dung xong quên sửa số — đã dính đúng lỗi đó một lần: badge ghi 10
 * trong khi có 11 tình huống.
 *
 * Tab "Dạng câu hỏi" chỉ hiện khi chặng đó có dữ liệu (từ chặng 2 trở đi).
 */
function tabsFor(d: StageBundle): { id: TabId; label: string; icon: typeof Target; badge?: string }[] {
  return [
    { id: 'roadmap', label: 'Lộ trình', icon: Target },
    { id: 'daily', label: 'Luyện mỗi ngày', icon: Flame, badge: '15' },
    ...(d.questionTypes
      ? [{ id: 'qtypes' as TabId, label: 'Dạng câu hỏi', icon: ListChecks, badge: String(d.questionTypes.length) }]
      : []),
    { id: 'lessons', label: 'Bài học', icon: GraduationCap, badge: String(d.stats.lessons) },
    { id: 'vocab', label: 'Từ vựng', icon: BookOpen, badge: String(d.stats.words) },
    { id: 'listening', label: 'Nghe', icon: Headphones, badge: String(d.stats.listenings) },
    { id: 'reading', label: 'Đọc', icon: FileText, badge: String(d.stats.readings) },
    { id: 'writing', label: 'Viết', icon: PenLine, badge: String(d.stats.writings) },
    { id: 'speaking', label: 'Nói', icon: Mic, badge: String(d.stats.speakingTopics) },
    { id: 'life', label: 'Đời sống & Việc làm', icon: Briefcase, badge: '11' },
    { id: 'exam', label: 'Cẩm nang thi', icon: ClipboardList },
  ];
}

export default function IeltsClient() {
  const [tab, setTab] = useState<TabId>('roadmap');
  const [stageIdx, setStageIdx] = useState(0);
  const { speak, current, supported } = useSpeak();

  const d = STAGES[stageIdx];
  const TABS = tabsFor(d);
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
            Luyện thi · 4 chặng band · chặng 1 và 2 đã có nội dung học
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Lộ trình IELTS 0 → 7.5
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl leading-relaxed">
            Lộ trình chia bốn chặng band: mỗi chặng ghi rõ bạn đang ở đâu, mỗi ngày làm gì cho từng kỹ
            năng, và khi nào đủ điều kiện lên chặng sau. <b className="text-slate-200">Chặng 1 (0 → 4.0)</b>{' '}
            xây nền từ con số không; <b className="text-slate-200">chặng 2 (4.0 → 5.5)</b> bắt đầu vào đề
            thi thật với cẩm nang {TOTAL_STATS.questionTypes} dạng câu hỏi.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-slate-300"><b className="text-white">{IELTS_STATS.stages}</b> chặng</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.lessons}</b> bài học</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.words}</b> từ vựng</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.questionTypes}</b> dạng câu hỏi</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.readings + TOTAL_STATS.listenings}</b> bài đọc &amp; nghe</span>
            <span className="text-slate-300"><b className="text-white">{TOTAL_STATS.writings}</b> đề viết có bài mẫu</span>
          </div>
        </header>

        {/* Bộ chuyển chặng — quyết định toàn bộ dữ liệu hiện bên dưới */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Đang học chặng</span>
            {STAGES.map((s, i) => (
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
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{d.focus}</p>
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

        {activeTab !== 'roadmap' && activeTab !== 'life' && activeTab !== 'exam' && (
          <p className="mb-5 text-xs text-slate-500 leading-relaxed rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            Nội dung dưới đây thuộc <b className="text-slate-300">{d.label} — {d.band}</b>. Bài đọc, bài
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
        {activeTab === 'qtypes' && d.questionTypes && (
          <QuestionTypesView types={d.questionTypes} notes={d.strategyNotes ?? []} />
        )}
        {activeTab === 'lessons' && <LessonsView d={d} speak={speak} current={current} supported={supported} />}
        {activeTab === 'vocab' && <VocabView d={d} speak={speak} current={current} supported={supported} />}
        {activeTab === 'listening' && <ListeningView d={d} supported={supported} />}
        {activeTab === 'reading' && <ReadingView d={d} />}
        {activeTab === 'writing' && <WritingView d={d} />}
        {activeTab === 'speaking' && <SpeakingView d={d} speak={speak} current={current} supported={supported} />}
        {activeTab === 'life' && <LifeView speak={speak} current={current} supported={supported} />}
        {activeTab === 'exam' && <ExamView />}

        {/* Chặng tiếp theo */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            <b className="text-white">Đang soạn tiếp:</b> nội dung học cho chặng 2 (band 4.0 → 5.5) — bắt đầu
            vào dạng đề IELTS thật, đủ các dạng câu hỏi Listening và Reading, Task 1 và Task 2 hoàn chỉnh.
            Trong lúc chờ, phần giao tiếp hằng ngày và luyện phát âm có ở{' '}
            <Link href="/tech-trends/tieng-anh-giao-tiep" className="text-emerald-400 hover:underline">
              khoá Tiếng Anh Giao Tiếp
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
