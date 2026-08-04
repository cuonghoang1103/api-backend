'use client';

/**
 * Ô tra cứu toàn khoá.
 *
 * Tra được bằng CẢ tiếng Anh lẫn tiếng Việt, vì người học thường nhớ nghĩa
 * trước rồi mới cần câu: gõ "xin lỗi" phải ra "Sorry to bother you…", gõ
 * "deadline" phải ra cả từ vựng lẫn câu chứa nó.
 *
 * Bỏ dấu tiếng Việt khi so khớp — gõ "xin loi" không dấu vẫn phải ra kết quả,
 * vì gõ nhanh thì gần như không ai bỏ dấu.
 */
import { useMemo } from 'react';
import { Search, Volume2 } from 'lucide-react';
import { ALL_DAYS, TECH_VOCAB } from './data';

type Hit = {
  kind: 'Câu' | 'Từ vựng' | 'Ngữ pháp' | 'Hội thoại';
  en: string;
  vi: string;
  extra?: string;
  day: number | null;
};

/** Bỏ dấu + hạ chữ thường để so khớp "gõ sao cũng ra". */
function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    // Dải dấu thanh/dấu phụ Unicode. Viết bằng mã \u thay vì dán ký tự thật
    // để tệp không phụ thuộc vào việc trình soạn thảo giữ đúng byte.
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export default function SearchView({
  query, onQuery, speak, current, supported, onGoDay,
}: {
  query: string;
  onQuery: (q: string) => void;
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
  onGoDay: (d: number) => void;
}) {
  /** Dựng chỉ mục MỘT lần — 700+ mục nên đừng dựng lại mỗi lần gõ. */
  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    for (const d of ALL_DAYS) {
      for (const p of d.qa) {
        out.push({ kind: 'Câu', en: p.q.en, vi: p.q.vi, extra: p.q.ipa, day: d.day });
        for (const a of p.answers) {
          out.push({ kind: 'Câu', en: a.en, vi: a.vi, extra: a.ipa, day: d.day });
        }
      }
      for (const v of d.vocab) {
        out.push({ kind: 'Từ vựng', en: v.en, vi: v.vi, extra: v.ipa, day: d.day });
      }
      for (const g of d.grammar) {
        out.push({ kind: 'Ngữ pháp', en: g.title, vi: g.explain, extra: g.formula, day: d.day });
      }
      for (const dl of d.dialogues) {
        for (const l of dl.lines) {
          out.push({ kind: 'Hội thoại', en: l.en, vi: l.vi, extra: dl.titleVi, day: d.day });
        }
      }
    }
    for (const g of TECH_VOCAB) {
      for (const w of g.words) {
        out.push({ kind: 'Từ vựng', en: w.en, vi: w.vi, extra: `${w.ipa} · ${g.name}`, day: null });
      }
    }
    return out;
  }, []);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (q.length < 2) return [];
    return index
      .filter((h) => norm(h.en).includes(q) || norm(h.vi).includes(q))
      // Khớp ngay đầu chuỗi thì xếp trước — sát ý người gõ hơn.
      .sort((a, b) => {
        const aStart = norm(a.en).startsWith(q) || norm(a.vi).startsWith(q) ? 0 : 1;
        const bStart = norm(b.en).startsWith(q) || norm(b.vi).startsWith(q) ? 0 : 1;
        return aStart - bStart;
      })
      .slice(0, 80);
  }, [query, index]);

  const KIND_COLOR: Record<Hit['kind'], string> = {
    'Câu': 'bg-violet-500/15 text-violet-300',
    'Từ vựng': 'bg-emerald-500/15 text-emerald-300',
    'Ngữ pháp': 'bg-amber-500/15 text-amber-300',
    'Hội thoại': 'bg-sky-500/15 text-sky-300',
  };

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Tra bằng tiếng Anh hoặc tiếng Việt — ví dụ: deadline, xin lỗi, hôm nay…"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400/50 transition-colors"
        />
      </div>

      {query.trim().length < 2 ? (
        <p className="text-slate-500 text-sm text-center py-10">
          Gõ ít nhất 2 ký tự. Tra được cả câu mẫu, từ vựng, ngữ pháp và hội thoại
          — không cần bỏ dấu tiếng Việt.
        </p>
      ) : results.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-10">
          Không tìm thấy “{query}”. Thử từ khoá ngắn hơn.
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-3">
            {results.length} kết quả{results.length === 80 && ' đầu tiên'}
          </p>
          <div className="space-y-2">
            {results.map((h, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-start gap-2">
                  <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${KIND_COLOR[h.kind]}`}>
                    {h.kind}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-100 text-sm leading-snug">{h.en}</p>
                    <p className="text-slate-400 text-sm mt-0.5 leading-snug">{h.vi}</p>
                    {h.extra && (
                      <p className="text-violet-300/60 text-[11px] font-mono mt-1 break-words">{h.extra}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(h.en)}
                        aria-label={`Nghe: ${h.en}`}
                        className={`p-1.5 rounded-lg transition-all active:scale-90 ${
                          current === h.en
                            ? 'bg-violet-500/30 text-violet-300'
                            : 'text-slate-500 hover:text-violet-300 hover:bg-violet-500/10'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                    {h.day !== null && (
                      <button
                        type="button"
                        onClick={() => onGoDay(h.day as number)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                      >
                        Ngày {h.day}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
