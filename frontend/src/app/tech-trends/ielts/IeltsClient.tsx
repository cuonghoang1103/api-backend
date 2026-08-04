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
 * Chặng 2–4 hiện mới có phần lộ trình. Soạn tiếp thì thêm thư mục
 * `data/stage2/` theo đúng khuôn `data/stage1/` rồi nối thêm tab — kiểu dữ
 * liệu ở `data/types.ts` đã viết cho dùng chung mọi chặng.
 */
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Target, GraduationCap, BookOpen, Headphones, FileText, PenLine, Mic,
  Flame, Briefcase, ClipboardList,
} from 'lucide-react';
import { IELTS_STATS } from './data/roadmap';
import { STAGE1_STATS } from './data/stage1';
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

type TabId =
  | 'roadmap' | 'daily' | 'lessons' | 'vocab' | 'listening'
  | 'reading' | 'writing' | 'speaking' | 'life' | 'exam';

/**
 * Con số trên tab tính TỪ DỮ LIỆU, không gõ tay. Gõ tay thì thêm nội dung xong
 * quên sửa số — đã dính đúng lỗi đó một lần: badge ghi 10 trong khi có 11 tình
 * huống.
 */
const TABS: { id: TabId; label: string; icon: typeof Target; badge?: string }[] = [
  { id: 'roadmap', label: 'Lộ trình', icon: Target },
  { id: 'daily', label: 'Luyện mỗi ngày', icon: Flame, badge: '15' },
  { id: 'lessons', label: 'Bài học', icon: GraduationCap, badge: String(STAGE1_STATS.lessons) },
  { id: 'vocab', label: 'Từ vựng', icon: BookOpen, badge: String(STAGE1_STATS.words) },
  { id: 'listening', label: 'Nghe', icon: Headphones, badge: String(STAGE1_STATS.listenings) },
  { id: 'reading', label: 'Đọc', icon: FileText, badge: String(STAGE1_STATS.readings) },
  { id: 'writing', label: 'Viết', icon: PenLine, badge: String(STAGE1_STATS.writings) },
  { id: 'speaking', label: 'Nói', icon: Mic, badge: String(STAGE1_STATS.speakingTopics) },
  { id: 'life', label: 'Đời sống & Việc làm', icon: Briefcase, badge: String(STAGE1_STATS.situations) },
  { id: 'exam', label: 'Cẩm nang thi', icon: ClipboardList },
];

export default function IeltsClient() {
  const [tab, setTab] = useState<TabId>('roadmap');
  const { speak, current, supported } = useSpeak();

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
            Luyện thi · 4 chặng band · chặng 1 đã có nội dung học
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Lộ trình IELTS 0 → 7.5
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl leading-relaxed">
            Lộ trình chia bốn chặng band: mỗi chặng ghi rõ bạn đang ở đâu, mỗi ngày làm gì cho từng kỹ
            năng, và khi nào đủ điều kiện lên chặng sau. <b className="text-slate-200">Chặng 1 (0 → 4.0)</b>{' '}
            nay đã có đầy đủ: bài giảng, từ vựng, bài luyện chấm điểm cho cả bốn kỹ năng, tiếng Anh dùng
            thật ngoài đời, và một buổi luyện 15 câu mỗi ngày để giữ nhịp.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-slate-300"><b className="text-white">{IELTS_STATS.stages}</b> chặng</span>
            <span className="text-slate-300"><b className="text-white">{STAGE1_STATS.lessons}</b> bài học</span>
            <span className="text-slate-300"><b className="text-white">{STAGE1_STATS.words}</b> từ vựng</span>
            <span className="text-slate-300">
              <b className="text-white">{STAGE1_STATS.gradedTotal}</b> câu chấm điểm có giải thích
            </span>
            <span className="text-slate-300"><b className="text-white">{STAGE1_STATS.situations}</b> tình huống đời sống &amp; việc làm</span>
            <span className="text-slate-300"><b className="text-white">{STAGE1_STATS.writings}</b> đề viết có bài mẫu</span>
          </div>
        </header>

        {/* Tab */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 border-b border-white/10">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
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

        {tab !== 'roadmap' && (
          <p className="mb-5 text-xs text-slate-500 leading-relaxed rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            Nội dung dưới đây thuộc <b className="text-slate-300">chặng 1 — band 0 → 4.0</b>. Bài đọc, bài
            nghe và đề viết đều do khoá này tự soạn theo đúng dạng đề thật (không chép đề có bản quyền), nên
            mỗi câu đều có lời giải thích vì sao đúng và vì sao sai.
          </p>
        )}

        {tab === 'roadmap' && <RoadmapTab onGoToLessons={() => setTab('lessons')} />}
        {tab === 'daily' && <DailyView />}
        {tab === 'lessons' && <LessonsView speak={speak} current={current} supported={supported} />}
        {tab === 'vocab' && <VocabView speak={speak} current={current} supported={supported} />}
        {tab === 'listening' && <ListeningView supported={supported} />}
        {tab === 'reading' && <ReadingView />}
        {tab === 'writing' && <WritingView />}
        {tab === 'speaking' && <SpeakingView speak={speak} current={current} supported={supported} />}
        {tab === 'life' && <LifeView speak={speak} current={current} supported={supported} />}
        {tab === 'exam' && <ExamView />}

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
