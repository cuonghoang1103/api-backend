'use client';

/**
 * Tab Tra cứu — hai việc trong một chỗ.
 *
 *  1. **Tìm nhanh xuyên chặng.** Gõ một từ và thấy nó nằm ở đâu trong CẢ NĂM
 *     chặng: từ vựng, bài học, dạng câu hỏi, cụm viết, cụm nói. Đây là thứ
 *     khoá này thiếu lâu nhất — người học nhớ mang máng "có học cụm này rồi"
 *     nhưng không biết nó ở chặng nào, và không có cách nào tìm ngoài việc mở
 *     từng tab một.
 *
 *  2. **Sổ tay tra nhanh.** Mô tả band, bảng quy đổi điểm, cấu trúc đề,
 *     checklist soát bài, từ nối theo chức năng. Những thứ này KHÔNG thuộc
 *     chặng nào — người ở chặng 2 cần bảng quy đổi y hệt người ở chặng 5 — nên
 *     chúng sống ở `data/reference.ts` và hiện chung ở đây.
 *
 * Ghi chú kỹ thuật: ô tìm kiếm bỏ dấu tiếng Việt trước khi so khớp, nên gõ
 * "tu vung" vẫn ra "từ vựng". Không bỏ dấu thì người dùng phải gõ đúng dấu
 * mới tìm được, mà lúc đang học thì không ai gõ đúng dấu.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Search, ChevronDown, BookOpen, GraduationCap, ListChecks, PenLine, Mic,
  Scale, Calculator, Clock, ShieldCheck, Link2, Link as LinkIcon,
} from 'lucide-react';
import { loadAllStages, type StageBundle } from './data/bundles';
import {
  BAND_CRITERIA, SCORE_TABLES, ROUNDING_NOTES, TEST_FORMAT,
  PROOF_CHECKLIST, LINKERS, OFFICIAL_LINKS,
} from './data/reference';

/** Bỏ dấu tiếng Việt + hạ chữ thường, để so khớp không phụ thuộc dấu. */
function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

type HitKind = 'Từ vựng' | 'Bài học' | 'Dạng câu hỏi' | 'Cụm viết' | 'Cụm nói' | 'Từ nối' | 'Lỗi hay mắc';

interface Hit {
  kind: HitKind;
  stage: string;
  title: string;
  sub?: string;
  extra?: string;
  /** Chuỗi đã bỏ dấu, gộp mọi trường — so khớp trên đây. */
  hay: string;
}

const KIND_ICON: Record<HitKind, typeof BookOpen> = {
  'Từ vựng': BookOpen,
  'Bài học': GraduationCap,
  'Dạng câu hỏi': ListChecks,
  'Cụm viết': PenLine,
  'Cụm nói': Mic,
  'Từ nối': Link2,
  'Lỗi hay mắc': ShieldCheck,
};

const KIND_CLS: Record<HitKind, string> = {
  'Từ vựng': 'bg-sky-500/20 text-sky-300',
  'Bài học': 'bg-violet-500/20 text-violet-300',
  'Dạng câu hỏi': 'bg-amber-500/20 text-amber-300',
  'Cụm viết': 'bg-emerald-500/20 text-emerald-300',
  'Cụm nói': 'bg-rose-500/20 text-rose-300',
  'Từ nối': 'bg-teal-500/20 text-teal-300',
  'Lỗi hay mắc': 'bg-orange-500/20 text-orange-300',
};

/** Dựng chỉ mục MỘT lần cho cả năm chặng — mỗi mục là một dòng kết quả. */
function buildIndex(stages: StageBundle[]): Hit[] {
  const out: Hit[] = [];
  const push = (h: Omit<Hit, 'hay'>) => {
    out.push({ ...h, hay: fold([h.title, h.sub ?? '', h.extra ?? '', h.kind].join(' ')) });
  };

  for (const s of stages) {
    for (const w of s.allWords) {
      push({ kind: 'Từ vựng', stage: s.label, title: w.en, sub: w.vi, extra: `${w.ipa} · ${w.ex}` });
    }
    for (const u of s.units) {
      for (const l of u.lessons) {
        push({ kind: 'Bài học', stage: s.label, title: `Bài ${l.n}. ${l.title}`, sub: u.title, extra: l.goal });
      }
    }
    for (const q of s.questionTypes ?? []) {
      push({ kind: 'Dạng câu hỏi', stage: s.label, title: q.name, sub: `${q.skill} · ${q.nameVi}`, extra: q.looks });
    }
    for (const w of s.writings) {
      for (const p of w.phrases) {
        push({ kind: 'Cụm viết', stage: s.label, title: p.en, sub: p.vi, extra: w.task });
      }
    }
    for (const t of s.speakings) {
      for (const p of t.phrases ?? []) {
        push({ kind: 'Cụm nói', stage: s.label, title: p.en, sub: p.vi, extra: t.part });
      }
    }
  }

  for (const g of LINKERS) {
    for (const item of g.items) {
      push({ kind: 'Từ nối', stage: 'Sổ tay', title: item, sub: g.fn, extra: g.note });
    }
  }
  for (const p of PROOF_CHECKLIST) {
    for (const e of p.examples) {
      push({ kind: 'Lỗi hay mắc', stage: 'Sổ tay', title: e.right, sub: `Sai: ${e.wrong}`, extra: p.label });
    }
  }
  return out;
}

/* ─────────────────── khối gập ─────────────────── */

function Section({
  id, title, icon: Icon, note, open, onToggle, children,
}: {
  id: string;
  title: string;
  icon: typeof BookOpen;
  note?: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <Icon className="w-4 h-4 text-sky-400 shrink-0" />
        <span className="flex-1 min-w-0">
          <span className="block text-white text-sm font-semibold">{title}</span>
          {note && <span className="block text-slate-500 text-xs mt-0.5 leading-relaxed">{note}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 border-t border-white/[0.06] pt-4">{children}</div>}
    </div>
  );
}

/* ─────────────────── view ─────────────────── */

export default function LookupView() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'Tất cả' | HitKind>('Tất cả');
  const [open, setOpen] = useState<Record<string, boolean>>({ band: true });

  /**
   * Tra cứu là một trong hai tab thật sự cần nội dung MỌI chặng (tab kia là
   * Luyện mỗi ngày), nên nó tự nạp thay vì nhận qua prop. Vì đây đã là tab tải
   * theo yêu cầu, chi phí nạp năm chặng chỉ phát sinh khi có người bấm vào.
   *
   * Sổ tay bên dưới (mô tả band, quy đổi điểm, checklist) KHÔNG phụ thuộc dữ
   * liệu chặng nên vẫn hiện ngay, không phải chờ.
   */
  const [stages, setStages] = useState<StageBundle[]>([]);
  useEffect(() => {
    let alive = true;
    loadAllStages().then((all) => { if (alive) setStages(all); });
    return () => { alive = false; };
  }, []);

  const index = useMemo(() => buildIndex(stages), [stages]);

  const hits = useMemo(() => {
    const needle = fold(q.trim());
    if (needle.length < 2) return [];
    const base = index.filter((h) => h.hay.includes(needle));
    const filtered = kind === 'Tất cả' ? base : base.filter((h) => h.kind === kind);
    // Khớp ngay từ đầu tiêu đề thì xếp trước — người tìm "concede" muốn thấy
    // từ đó chứ không muốn thấy câu ví dụ có chứa nó.
    return filtered
      .sort((a, b) => {
        const av = fold(a.title).startsWith(needle) ? 0 : 1;
        const bv = fold(b.title).startsWith(needle) ? 0 : 1;
        return av - bv;
      })
      .slice(0, 60);
  }, [q, kind, index]);

  const searching = fold(q.trim()).length >= 2;
  const toggle = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));

  const KINDS: ('Tất cả' | HitKind)[] = [
    'Tất cả', 'Từ vựng', 'Bài học', 'Dạng câu hỏi', 'Cụm viết', 'Cụm nói', 'Từ nối', 'Lỗi hay mắc',
  ];

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-3">
        Tra cứu <b className="text-slate-200">xuyên cả năm chặng</b>: gõ một từ để tìm nó trong{' '}
        {stages.length === 0 ? '…' : index.length.toLocaleString('vi-VN')} mục từ vựng, bài học, dạng câu hỏi
        và cụm mẫu. Bên dưới ô tìm là <b className="text-slate-200">sổ tay tra nhanh</b> — mô tả band, bảng
        quy đổi điểm, cấu trúc đề và checklist soát bài. Gõ không dấu vẫn tìm được.
      </p>

      {/* Ô tìm */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm từ, cụm, bài học… (ví dụ: concede, mao tu, TFNG)"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-3 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50"
        />
      </div>

      {searching && (
        <>
          <div className="flex gap-2 flex-wrap mb-4">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all active:scale-95 ${
                  kind === k
                    ? 'bg-sky-500/20 border-sky-400/45 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 mb-3">
            {stages.length === 0
              ? 'Đang nạp nội dung năm chặng…'
              : hits.length === 0
                ? 'Không tìm thấy mục nào khớp.'
                : `${hits.length} kết quả${hits.length === 60 ? ' đầu tiên' : ''}.`}
          </p>

          <div className="space-y-2 mb-8">
            {hits.map((h, i) => {
              const Icon = KIND_ICON[h.kind];
              return (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-semibold break-words">{h.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${KIND_CLS[h.kind]}`}>{h.kind}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{h.stage}</span>
                      </div>
                      {h.sub && <p className="text-slate-300 text-sm mt-1 leading-relaxed break-words">{h.sub}</p>}
                      {h.extra && <p className="text-slate-500 text-xs mt-1 leading-relaxed break-words">{h.extra}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Sổ tay */}
      <div className="space-y-3">
        <Section
          id="band" title="Mô tả band — bảng tóm tắt band 6 · 7 · 8" icon={Scale}
          note="Bản tóm tắt tiếng Việt, giữ nguyên các cụm tiếng Anh then chốt vì đó mới là chữ giám khảo dùng. Bản gốc miễn phí ở ielts.org."
          open={!!open.band} onToggle={toggle}
        >
          <div className="space-y-4">
            {(['Viết', 'Nói'] as const).map((skill) => (
              <div key={skill}>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{skill}</p>
                <div className="space-y-3">
                  {BAND_CRITERIA.filter((c) => c.skill === skill).map((c) => (
                    <div key={c.criterion} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <p className="text-white text-sm font-semibold">
                        {c.criterion} <span className="text-slate-500 font-normal">· {c.criterionVi}</span>
                      </p>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{c.measures}</p>
                      <div className="mt-3 space-y-2">
                        {c.bands.map((b) => (
                          <div key={b.band} className="flex gap-3">
                            <span
                              className={`shrink-0 w-9 h-6 rounded grid place-items-center text-xs font-semibold ${
                                b.band === '8'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : b.band === '7'
                                    ? 'bg-sky-500/20 text-sky-300'
                                    : 'bg-white/5 text-slate-400'
                              }`}
                            >
                              {b.band}
                            </span>
                            <p className="text-slate-300 text-sm leading-relaxed">{b.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="score" title="Quy đổi điểm thô → band, và cách làm tròn" icon={Calculator}
          note="Bảng CHỈ BÁO — ranh giới xê dịch nhẹ theo từng bản đề. Dùng để biết mình đang ở đâu, đừng dùng để cãi điểm."
          open={!!open.score} onToggle={toggle}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {SCORE_TABLES.map((t) => (
              <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-white text-sm font-semibold leading-snug">{t.title}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{t.note}</p>
                <div className="mt-3 space-y-1">
                  {t.rows.map((r) => (
                    <div
                      key={r.band}
                      className={`flex items-center justify-between text-sm rounded px-2 py-1 ${
                        r.band === '8.0' ? 'bg-emerald-500/10 text-emerald-200' : 'text-slate-300'
                      }`}
                    >
                      <span className="font-semibold tabular-nums">{r.band}</span>
                      <span className="text-slate-400 tabular-nums">{r.raw}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3">
            <p className="text-amber-300 text-sm font-semibold mb-2">Làm tròn điểm tổng — chỗ hay mất nửa band mà không hiểu vì sao</p>
            <div className="space-y-1.5">
              {ROUNDING_NOTES.map((n) => (
                <p key={n.k} className="text-sm text-slate-300 leading-relaxed">
                  <b className="text-white">{n.k}:</b> {n.v}
                </p>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="format" title="Cấu trúc đề và thời gian từng phần" icon={Clock}
          open={!!open.format} onToggle={toggle}
        >
          <div className="space-y-2">
            {TEST_FORMAT.map((f) => (
              <div key={f.part} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-white text-sm font-semibold">{f.part}</span>
                  <span className="text-sky-300 text-xs">{f.time}</span>
                </div>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="proof" title="Checklist soát bài — quét theo LOẠI lỗi, mỗi loại một lượt" icon={ShieldCheck}
          note="Mắt chỉ tìm được một thứ mỗi lượt. Đọc trôi cả bài bỏ sót nhiều hơn hẳn quét riêng từng loại."
          open={!!open.proof} onToggle={toggle}
        >
          <div className="space-y-3">
            {PROOF_CHECKLIST.map((p, i) => (
              <div key={p.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-white text-sm font-semibold">
                  <span className="text-slate-600 mr-1.5 tabular-nums">{i + 1}.</span>{p.label}
                </p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{p.why}</p>
                <div className="mt-2.5 space-y-1.5">
                  {p.examples.map((e, j) => (
                    <div key={j} className="text-sm leading-relaxed">
                      <span className="text-rose-300">✗ {e.wrong}</span>
                      <span className="text-slate-600 mx-2">→</span>
                      <span className="text-emerald-300">✓ {e.right}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="linkers" title="Từ nối xếp theo CHỨC NĂNG" icon={Link2}
          note="Xếp theo việc cần làm chứ không theo bảng chữ cái — lúc viết bạn biết mình muốn làm gì, không biết mình cần từ nào."
          open={!!open.linkers} onToggle={toggle}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {LINKERS.map((g) => (
              <div key={g.fn} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-white text-sm font-semibold">{g.fn}</p>
                {g.note && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{g.note}</p>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span key={it} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300">{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="links" title="Nguồn chính thống — bản gốc, miễn phí" icon={LinkIcon}
          note="Mọi sách luyện thi trên thị trường đều là diễn giải lại mấy tài liệu này. Đọc bản gốc trước."
          open={!!open.links} onToggle={toggle}
        >
          <div className="space-y-2">
            {OFFICIAL_LINKS.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-sky-400/40 transition-colors"
              >
                <p className="text-sky-300 text-sm font-semibold break-words">{l.name}</p>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{l.what}</p>
              </a>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
