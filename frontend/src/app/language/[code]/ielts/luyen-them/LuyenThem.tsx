'use client';

/**
 * 📚 KHO LUYỆN THÊM 4 CHẶNG — /language/en/ielts/luyen-them
 * ─────────────────────────────────────────────────────────────────────────
 * Kho bài của lộ trình IELTS 0 → 7.5 cũ (/tech-trends/ielts): 4 chặng band,
 * mỗi chặng có bài học, từ vựng, nghe, đọc, viết, nói, bài tập. Từ 26/09/2026
 * trang cũ chỉ còn redirect sang khoá 15 ngày nên cả kho mồ côi trên web
 * (app iOS vẫn dùng qua API). Trang này đưa nó trở lại, dùng LẠI các view cũ
 * trong app/tech-trends/ielts — thư mục đó vì vậy phải giữ.
 *
 * Tải theo nhu cầu: chặng nạp qua `loadStage` (mỗi chặng một chunk), mỗi tab
 * là một `dynamic()`. Trang cũ import tĩnh cả 4 chặng (~1,2 MB mã nguồn) dù
 * người học chỉ xem một. Hai tab "Lộ trình" và "Luyện mỗi ngày" vẫn cần cả 4
 * chặng (trộn từ/bài của mọi chặng) — chỉ tải khi bấm vào.
 *
 * Màu: các view viết cứng cho nền tối; `sang.module.css` ánh xạ sang giao diện
 * sáng của khoá khi web không ở theme-dark (KHÔNG dùng `dark:` — xem đầu IeltsClient.tsx).
 */
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft, Target, GraduationCap, BookOpen, Headphones, FileText, PenLine, Mic,
  Flame, Briefcase, ClipboardList, ListChecks, Keyboard,
} from 'lucide-react';
import { STAGE_INFO, loadStage } from '@/app/tech-trends/ielts/data/loadStage';
import type { StageBundle } from '@/app/tech-trends/ielts/data/bundleTypes';
import { useDoc } from './useDoc';
import sang from './sang.module.css';
import cs from '@/components/sach-hoc/course.module.css';

const Dang = () => <div className="py-16 text-center text-sm text-slate-500">Đang tải…</div>;
const LessonsView = dynamic(() => import('@/app/tech-trends/ielts/LessonsView'), { loading: Dang });
const VocabView = dynamic(() => import('@/app/tech-trends/ielts/VocabView'), { loading: Dang });
const ListeningView = dynamic(() => import('@/app/tech-trends/ielts/ListeningView'), { loading: Dang });
const ReadingView = dynamic(() => import('@/app/tech-trends/ielts/ReadingView'), { loading: Dang });
const WritingView = dynamic(() => import('@/app/tech-trends/ielts/WritingView'), { loading: Dang });
const SpeakingView = dynamic(() => import('@/app/tech-trends/ielts/SpeakingView'), { loading: Dang });
const QuestionTypesView = dynamic(() => import('@/app/tech-trends/ielts/QuestionTypesView'), { loading: Dang });
const TypingPanel = dynamic(() => import('@/app/tech-trends/ielts/TypingPanel'), { loading: Dang });
const RoadmapTab = dynamic(() => import('@/app/tech-trends/ielts/RoadmapTab'), { loading: Dang });
const DailyView = dynamic(() => import('@/app/tech-trends/ielts/DailyView'), { loading: Dang });
const LifeView = dynamic(() => import('@/app/tech-trends/ielts/LifeView'), { loading: Dang });
const ExamView = dynamic(() => import('@/app/tech-trends/ielts/ExamView'), { loading: Dang });

type TabId =
  | 'lessons' | 'vocab' | 'listening' | 'reading' | 'writing' | 'speaking' | 'qtypes'
  | 'typing' | 'daily' | 'roadmap' | 'life' | 'exam';

/** Tab nào cần dữ liệu của chặng đang chọn (còn lại dùng chung cả khoá). */
const THEO_CHANG: TabId[] = ['lessons', 'vocab', 'listening', 'reading', 'writing', 'speaking', 'qtypes', 'typing'];

function tabsFor(d: StageBundle | null): { id: TabId; label: string; icon: typeof Target; badge?: string }[] {
  const n = (x?: number) => (d && x != null ? String(x) : undefined);
  return [
    { id: 'lessons', label: 'Bài học', icon: GraduationCap, badge: n(d?.stats.lessons) },
    { id: 'vocab', label: 'Từ vựng', icon: BookOpen, badge: n(d?.stats.words) },
    { id: 'listening', label: 'Nghe', icon: Headphones, badge: n(d?.stats.listenings) },
    { id: 'reading', label: 'Đọc', icon: FileText, badge: n(d?.stats.readings) },
    { id: 'writing', label: 'Viết', icon: PenLine, badge: n(d?.stats.writings) },
    { id: 'speaking', label: 'Nói', icon: Mic, badge: n(d?.stats.speakingTopics) },
    ...(d?.questionTypes ? [{ id: 'qtypes' as TabId, label: 'Dạng câu hỏi', icon: ListChecks, badge: String(d.questionTypes.length) }] : []),
    { id: 'typing', label: 'Gõ đoạn văn', icon: Keyboard },
    { id: 'daily', label: 'Luyện mỗi ngày', icon: Flame },
    { id: 'roadmap', label: 'Lộ trình 4 chặng', icon: Target },
    { id: 'life', label: 'Đời sống & Việc làm', icon: Briefcase },
    { id: 'exam', label: 'Cẩm nang thi', icon: ClipboardList },
  ];
}

export default function LuyenThem() {
  const [stageIdx, setStageIdx] = useState(0);
  const [tab, setTab] = useState<TabId>('lessons');
  const [bundles, setBundles] = useState<(StageBundle | null)[]>([null, null, null, null]);
  const [loadErr, setLoadErr] = useState(false);
  const { speak, current, supported } = useDoc();
  // Chỉ GHI URL sau khi đã ĐỌC nó: StrictMode chạy effect hai lần, ghi trước là
  // lượt đọc thứ hai thấy `tab=lessons` vừa ghi và link ?tab=… mất tác dụng.
  const [urlRead, setUrlRead] = useState(false);

  // ?chang=2&tab=vocab — mở thẳng đúng chỗ (link từ khoá 15 ngày, hay gửi cho bạn).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = Number(q.get('chang'));
    if (c >= 1 && c <= 4) setStageIdx(c - 1);
    const t = q.get('tab') as TabId | null;
    if (t) setTab(t);
    setUrlRead(true);
  }, []);
  useEffect(() => {
    if (!urlRead) return;
    const u = new URL(window.location.href);
    u.searchParams.set('chang', String(stageIdx + 1));
    u.searchParams.set('tab', tab);
    window.history.replaceState(null, '', u);
  }, [stageIdx, tab, urlRead]);

  useEffect(() => {
    if (bundles[stageIdx]) return;
    let huy = false;
    setLoadErr(false);
    loadStage(stageIdx)
      .then((b) => { if (!huy) setBundles((x) => x.map((v, i) => (i === stageIdx ? b : v))); })
      .catch(() => { if (!huy) setLoadErr(true); });
    return () => { huy = true; };
  }, [stageIdx, bundles]);

  const d = bundles[stageIdx];
  const TABS = tabsFor(d);
  const activeTab: TabId = d && !TABS.some((t) => t.id === tab) ? 'lessons' : tab;
  const info = STAGE_INFO[stageIdx];
  const canChang = THEO_CHANG.includes(activeTab);

  return (
    // cs.root: khai các biến màu --lh-* (sáng/tối) mà sang.module.css dùng.
    <div className={cs.root}>
    <div className={`min-h-screen pt-8 pb-24 ${sang.sang}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link href="/language/en/ielts" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Khoá IELTS 15 ngày
        </Link>

        <header className="mb-6">
          <p className="text-sky-400 text-sm font-medium tracking-wide uppercase mb-2">Kho luyện thêm · 4 chặng band · 0 → 7.5</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Luyện thêm theo chặng</h1>
          <p className="text-slate-400 mt-3 max-w-3xl leading-relaxed">
            Học xong mỗi buổi của khoá 15 ngày, vào đây luyện thêm đúng chặng của mình: bài học ngữ pháp có bài tập chấm điểm,
            từ vựng theo chủ đề, bài nghe và bài đọc theo dạng đề thật (mỗi câu có lời giải vì sao đúng, vì sao sai), đề viết có
            bài mẫu, chủ đề nói. Mới bắt đầu thì ở <b className="text-slate-200">Chặng 1</b>.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/language/en/ielts/phong-thi" className="text-sky-400 hover:underline">🎯 Muốn thử sức cả đề có đồng hồ? Vào Phòng thi thử →</Link>
          </p>
        </header>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Đang luyện</span>
            {STAGE_INFO.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStageIdx(i)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
                  i === stageIdx ? 'bg-sky-500/20 border-sky-400/45 text-white' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <b>{s.label}</b>
                <span className={`text-[11px] ${i === stageIdx ? 'text-sky-200' : 'text-slate-600'}`}>{s.band}</span>
              </button>
            ))}
          </div>
          {d && <p className="text-xs text-slate-400 mt-2 leading-relaxed">{d.focus}</p>}
        </div>

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
                  active ? 'border-sky-400 text-white bg-white/[0.04]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {t.badge && (
                  <span className={`text-[10px] px-1.5 rounded ${active ? 'bg-sky-500/25 text-sky-200' : 'bg-white/5 text-slate-500'}`}>{t.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {canChang && (
          <p className="mb-5 text-xs text-slate-500 leading-relaxed rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            Nội dung dưới đây thuộc <b className="text-slate-300">{info.label} — {info.band}</b>. Bài đọc, bài nghe và đề viết đều do
            khoá tự soạn theo đúng dạng đề thật (không chép đề có bản quyền).
          </p>
        )}

        {canChang && !d && (
          loadErr ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Không tải được {info.label}.{' '}
              <button type="button" className="text-sky-400 hover:underline" onClick={() => setBundles((x) => [...x])}>Thử lại</button>
            </div>
          ) : <Dang />
        )}

        {d && activeTab === 'lessons' && <LessonsView d={d} speak={speak} current={current} supported={supported} />}
        {d && activeTab === 'vocab' && <VocabView d={d} speak={speak} current={current} supported={supported} />}
        {d && activeTab === 'listening' && <ListeningView d={d} supported={supported} />}
        {d && activeTab === 'reading' && <ReadingView d={d} />}
        {d && activeTab === 'writing' && <WritingView d={d} />}
        {d && activeTab === 'speaking' && <SpeakingView d={d} speak={speak} current={current} supported={supported} />}
        {d && activeTab === 'qtypes' && d.questionTypes && <QuestionTypesView types={d.questionTypes} notes={d.strategyNotes ?? []} />}
        {d && activeTab === 'typing' && <TypingPanel stageId={d.id} />}
        {activeTab === 'daily' && <DailyView />}
        {activeTab === 'roadmap' && <RoadmapTab onGoToStage={(i) => { setStageIdx(i); setTab('lessons'); }} />}
        {activeTab === 'life' && <LifeView speak={speak} current={current} supported={supported} />}
        {activeTab === 'exam' && <ExamView />}
      </div>
    </div>
    </div>
  );
}
