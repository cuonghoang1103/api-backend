'use client';

// Đề luyện CUỐI CHƯƠNG — lấy đúng câu hỏi ĐỀ THẬT (FE/PE/PT) đã gán về chương
// (ExamQuestion.sectionId) và cho làm ngay trong bài học, tự chấm. Học xong
// chương thì làm luôn câu thật của kiến thức chương đó. Dùng lại LessonQuizPlayer
// (đã có chấm điểm + giải thích + làm lại), chỉ map dữ liệu câu hỏi sang QuizData.

import { useCallback, useState } from 'react';
import { FileQuestion, Loader2, Shuffle, ListChecks, X } from 'lucide-react';
import { api } from '@/lib/api';
import LessonQuizPlayer, { type QuizData } from '@/app/courses/[slug]/learn/LessonQuizPlayer';

interface ExamQ {
  id: number;
  prompt: string;
  options: unknown; // [{text}] | string[]
  correctIndexes: number[];
  explanation?: string | null;
  points: number;
  examKind?: string | null;
}

// Câu đề thi → QuizData của LessonQuizPlayer. options có thể là [{text}] hoặc [string].
function toQuizData(qs: ExamQ[]): QuizData {
  const questions = qs.map((q) => {
    const opts = Array.isArray(q.options) ? q.options : [];
    return {
      id: String(q.id),
      type: 'MC' as const,
      question: q.prompt,
      options: opts.map((o) => (typeof o === 'string' ? o : (o?.text ?? ''))),
      correctIndexes: Array.isArray(q.correctIndexes) ? q.correctIndexes : [],
      explanation: q.explanation ?? undefined,
      points: Number(q.points) || 1,
    };
  });
  // Thời gian rộng rãi (không tạo áp lực; nộp sớm được): ~90s/câu, tối thiểu 5 phút.
  return { timeLimitSeconds: Math.max(300, questions.length * 90), questions };
}

export function ChapterQuiz({ sectionId, sectionTitle, count }: { sectionId: number; sectionTitle?: string; count: number }) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const start = useCallback(async (mode: 'random' | 'all') => {
    setLoading(true); setErr(null);
    try {
      const params = mode === 'random' ? { random: 1, limit: 10 } : {};
      const r = await api.get<{ success: boolean; data: ExamQ[] }>(`/exams/practice/by-section/${sectionId}`, { params });
      const qs = r.data?.data ?? [];
      if (!qs.length) { setErr('Chương này chưa có câu luyện.'); return; }
      setQuiz(toQuizData(qs));
    } catch {
      setErr('Không tải được đề luyện. Thử lại nhé.');
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  if (quiz) {
    return (
      <div className="ml-2 mt-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-text-secondary">
            📝 Đề luyện cuối chương{sectionTitle ? ` · ${sectionTitle}` : ''}
          </span>
          <button onClick={() => setQuiz(null)} className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary">
            <X className="w-3.5 h-3.5" /> Đóng
          </button>
        </div>
        <LessonQuizPlayer quiz={quiz} locale="vi" />
      </div>
    );
  }

  return (
    <div className="ml-2 mt-2 rounded-lg border border-neon-cyan/20 bg-darkbg/30 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
        <FileQuestion className="w-3.5 h-3.5 text-neon-cyan" /> Đề luyện cuối chương — {count} câu (từ đề thật FE/PE/PT)
      </p>
      <p className="mt-0.5 text-[11px] text-text-muted">
        Học xong chương thì làm luôn câu hỏi thật đúng kiến thức chương này để tự kiểm tra.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          disabled={loading}
          onClick={() => start('random')}
          className="inline-flex items-center gap-1.5 rounded-md bg-neon-cyan/15 px-3 py-1.5 text-xs font-medium text-neon-cyan transition-colors hover:bg-neon-cyan/25 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shuffle className="w-3.5 h-3.5" />} 10 câu ngẫu nhiên
        </button>
        <button
          disabled={loading}
          onClick={() => start('all')}
          className="inline-flex items-center gap-1.5 rounded-md border border-darkborder/60 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-darkbg/50 disabled:opacity-50"
        >
          <ListChecks className="w-3.5 h-3.5" /> Làm tất cả {count} câu
        </button>
      </div>
      {err && <p className="mt-2 text-[11px] text-red-400">{err}</p>}
    </div>
  );
}
