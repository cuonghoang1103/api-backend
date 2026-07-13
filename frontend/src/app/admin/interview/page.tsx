'use client';

/**
 * /admin/interview — Interview Simulator admin.
 * Tabs: Overview (bank health + UNREVIEWED-RUBRIC queue prominent), Questions
 * (list/filter/create/publish/delete). Dark-only palette like /admin/exp-hub.
 * The unreviewed-rubric flag is surfaced loudly — seeded rubrics are a first
 * draft a human must rewrite before they count.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, AlertTriangle, Plus, Trash2, CheckCircle2, Eye, Check, Search, Pencil, BookOpen, Boxes, ChevronDown, ChevronRight, Sparkles, ScrollText, RotateCcw, History, Save } from 'lucide-react';
import { interviewApi } from '@/lib/interview-api';
import { interviewAdminApi, type AdminQuestion, type BankHealthRow, type LlmUsage, type FlaggedTurn, type KnowledgeDocListItem, type KnowledgeDocDetail, type KnowledgeChunk, type KnowledgeCoverageRow, type PromptSummary, type PromptVersion, type GeneratedQuestion } from '@/lib/interview-api';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import type { TaxonomyResponse, TaxonomyTopic } from '@/types/interview';
import { LEVELS } from '@/types/interview';

type Tab = 'overview' | 'questions' | 'generate' | 'flagged' | 'knowledge' | 'prompts';

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Tổng quan',
  questions: 'Câu hỏi',
  generate: 'AI tạo câu hỏi',
  flagged: 'Cần rà soát',
  knowledge: 'Kho tri thức',
  prompts: 'Prompt AI',
};

interface FlatTopic { id: number; name: string; track: string; domain: string }

export default function AdminInterviewPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [tax, setTax] = useState<TaxonomyResponse | null>(null);

  useEffect(() => { interviewApi.tracks().then((r) => setTax(r.data.data)).catch(() => {}); }, []);

  const topics = useMemo<FlatTopic[]>(() => {
    if (!tax) return [];
    const out: FlatTopic[] = [];
    for (const d of tax.domains) for (const t of d.tracks) for (const tp of t.topics) out.push({ id: tp.id, name: tp.name, track: t.name, domain: d.name });
    return out;
  }, [tax]);
  const topicName = useCallback((id: number) => topics.find((t) => t.id === id)?.name ?? `#${id}`, [topics]);

  return (
    <div className="p-4 md:p-6 text-white">
      <h1 className="text-2xl font-bold mb-1">Interview Simulator</h1>
      <p className="text-slate-400 text-sm mb-5">Ngân hàng câu hỏi STATIC — tự chấm, không cần AI.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['overview', 'questions', 'generate', 'flagged', 'knowledge', 'prompts'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm border ${tab === t ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-white/5 text-slate-400 border-transparent hover:text-white'}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === 'overview' ? <Overview topicName={topicName} />
        : tab === 'questions' ? <Questions topics={topics} topicName={topicName} />
        : tab === 'generate' ? <Generate topics={topics} />
        : tab === 'flagged' ? <Flagged />
        : tab === 'knowledge' ? <Knowledge tax={tax} topics={topics} topicName={topicName} />
        : <Prompts />}
    </div>
  );
}

function Overview({ topicName }: { topicName: (id: number) => string }) {
  const [health, setHealth] = useState<BankHealthRow[]>([]);
  const [unreviewed, setUnreviewed] = useState<number | null>(null);
  const [usage, setUsage] = useState<LlmUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      interviewAdminApi.bankHealth().then((r) => setHealth(r.data.data)).catch(() => {}),
      interviewAdminApi.listQuestions({ rubricReviewed: false, pageSize: 1 }).then((r) => setUnreviewed(r.data.data.total)).catch(() => {}),
      interviewAdminApi.llmUsage().then((r) => setUsage(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const published = health.filter((h) => h.status === 'PUBLISHED').reduce((s, h) => s + h.count, 0);
  const draft = health.filter((h) => h.status === 'DRAFT').reduce((s, h) => s + h.count, 0);

  // Aggregate published counts by topic for the health grid.
  const byTopic = new Map<number, number>();
  for (const h of health) if (h.status === 'PUBLISHED') byTopic.set(h.topicId, (byTopic.get(h.topicId) ?? 0) + h.count);

  if (loading) return <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>;

  return (
    <div className="space-y-6">
      {unreviewed != null && unreviewed > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-amber-300">{unreviewed} câu có rubric CHƯA được người duyệt</div>
            <p className="text-sm text-amber-200/80 mt-1">Rubric &amp; đáp án mẫu là "sản phẩm" — rubric seed chỉ là bản nháp. Hãy vào tab Câu hỏi (lọc "Chưa duyệt"), viết lại rubric cho đúng chuẩn rồi bật "Đã duyệt". Câu chưa duyệt vẫn dùng được nhưng bị coi là độ tin cậy thấp.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Stat label="Câu đã xuất bản" value={published} />
        <Stat label="Câu nháp (DRAFT)" value={draft} />
        <Stat label="Rubric chưa duyệt" value={unreviewed ?? 0} tone={unreviewed ? 'warn' : undefined} />
      </div>

      {usage && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Chi phí AI (LLM)</div>
            <span className={`text-xs px-2 py-0.5 rounded ${usage.aiAvailable ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-300'}`}>
              {usage.forceStatic ? 'KILL SWITCH BẬT (STATIC)' : usage.aiAvailable ? 'AI SẴN SÀNG' : usage.hasKey ? 'AI tạm ngắt (circuit)' : 'CHƯA có API key → STATIC'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Tổng chi phí (USD)" value={usage.totalCostUsd} />
            <Stat label="Lượt gọi" value={usage.totalCalls} />
            <Stat label="Input tokens" value={usage.totalInputTokens} />
            <Stat label="Output tokens" value={usage.totalOutputTokens} />
          </div>
          {usage.byModel.length > 0 && (
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              {usage.byModel.map((m, i) => (
                <div key={i} className="flex justify-between">
                  <span>{m.model} {m.success ? '' : '(lỗi)'}</span>
                  <span className="font-mono">{m.calls} lượt · ${m.costUsd.toFixed(4)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-3">Thêm ANTHROPIC_API_KEY vào VPS + đặt DEFAULT_ENGINE_MODE=HYBRID để bật AI chấm. FORCE_STATIC_MODE=true là kill switch tắt toàn bộ LLM.</p>
        </div>
      )}

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/10 text-sm font-semibold">Độ phủ ngân hàng (câu đã xuất bản / chủ đề)</div>
        {[...byTopic.entries()].length ? [...byTopic.entries()].map(([tid, count]) => (
          <div key={tid} className="flex items-center justify-between px-4 py-2 border-b border-white/5 last:border-0">
            <span className="text-sm text-slate-300">{topicName(tid)}</span>
            <span className={`text-sm font-mono ${count < 3 ? 'text-amber-400' : 'text-slate-400'}`}>{count}{count < 3 ? ' · mỏng' : ''}</span>
          </div>
        )) : <div className="px-4 py-3 text-sm text-slate-500">Chưa có câu hỏi.</div>}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'warn' }) {
  return (
    <div className={`rounded-xl border p-4 ${tone === 'warn' ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/10 bg-white/5'}`}>
      <div className={`text-2xl font-bold ${tone === 'warn' ? 'text-amber-300' : 'text-white'}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function Questions({ topics, topicName }: { topics: FlatTopic[]; topicName: (id: number) => string }) {
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnreviewed, setOnlyUnreviewed] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    interviewAdminApi
      .listQuestions({ rubricReviewed: onlyUnreviewed ? false : undefined, status: statusFilter || undefined, pageSize: 100 })
      .then((r) => setItems(r.data.data.items))
      .catch(() => toast.error('Không tải được danh sách'))
      .finally(() => setLoading(false));
  }, [onlyUnreviewed, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const toggleReviewed = async (q: AdminQuestion) => {
    await interviewAdminApi.updateQuestion(q.id, { rubricReviewed: !q.rubricReviewed }).catch(() => toast.error('Lỗi'));
    load();
  };
  const toggleStatus = async (q: AdminQuestion) => {
    const next = q.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await interviewAdminApi.updateQuestion(q.id, { status: next }).catch(() => toast.error('Lỗi'));
    load();
  };
  const del = async (q: AdminQuestion) => {
    if (!confirm('Xoá câu hỏi này?')) return;
    await interviewAdminApi.deleteQuestion(q.id).catch(() => toast.error('Lỗi'));
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={onlyUnreviewed} onChange={(e) => setOnlyUnreviewed(e.target.checked)} className="accent-amber-500" /> Chỉ rubric chưa duyệt
        </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm">
          <option value="">Mọi trạng thái</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="DRAFT">DRAFT</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <button onClick={() => setShowCreate((s) => !s)} className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-sm">
          <Plus className="w-4 h-4" /> Câu hỏi mới
        </button>
      </div>

      {showCreate && <CreateForm topics={topics} onDone={() => { setShowCreate(false); load(); }} />}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {items.map((q) => (
            <div key={q.id} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white line-clamp-2">{q.body}</div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                  <span className="text-slate-400">{topicName(q.topicId)}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">{q.level}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">{q.type}</span>
                  <span className={`px-1.5 py-0.5 rounded ${q.status === 'PUBLISHED' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-300'}`}>{q.status}</span>
                  {!q.rubricReviewed && <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> rubric chưa duyệt</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleReviewed(q)} title="Bật/tắt đã duyệt rubric" className={`p-1.5 rounded ${q.rubricReviewed ? 'text-emerald-400' : 'text-amber-400'} hover:bg-white/10`}><CheckCircle2 className="w-4 h-4" /></button>
                <button onClick={() => toggleStatus(q)} title="Publish/Unpublish" className="p-1.5 rounded text-slate-300 hover:bg-white/10"><Eye className="w-4 h-4" /></button>
                <button onClick={() => del(q)} title="Xoá" className="p-1.5 rounded text-red-400 hover:bg-white/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {!items.length && <div className="px-4 py-4 text-sm text-slate-500">Không có câu hỏi.</div>}
        </div>
      )}
    </div>
  );
}

function Flagged() {
  const [items, setItems] = useState<FlaggedTurn[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    interviewAdminApi.flagged().then((r) => setItems(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const resolve = async (id: number) => {
    await interviewAdminApi.resolveFlag(id).catch(() => {});
    load();
  };

  if (loading) return <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>;
  if (!items.length) return <div className="rounded-xl border border-white/10 p-6 text-slate-400">Không có câu nào cần rà soát. 🎉</div>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">Câu bị người dùng gắn cờ "điểm sai" HOẶC bị hệ thống đánh dấu (AI lệch máy chấm nhiều / phát hiện gian lận). Rà xong bấm "Đã xử lý".</p>
      {items.map((t) => {
        const final = t.turnScore?.final ?? t.deterministicScore?.score ?? null;
        return (
          <div key={t.id} className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="text-sm text-white">{t.questionText}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-xs">
                  {t.topic && <span className="text-slate-400">{t.topic}</span>}
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">{t.level} · {t.engineMode}</span>
                  {final != null && <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">điểm {final}/100</span>}
                  {t.injectionAttempted && <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-300 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> injection</span>}
                  {t.userFlag && <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">người dùng gắn cờ</span>}
                </div>
              </div>
              <button onClick={() => resolve(t.id)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs"><Check className="w-4 h-4" /> Đã xử lý</button>
            </div>
            {t.userFlag?.reason && <p className="text-xs text-amber-200/80 mb-2">Lý do: "{t.userFlag.reason}"</p>}
            {t.userAnswer && <div className="text-xs text-slate-300 bg-white/5 rounded p-2 mb-1"><span className="text-slate-500">Trả lời: </span>{t.userAnswer.slice(0, 300)}</div>}
            {t.referenceAnswer && <div className="text-xs text-slate-400 line-clamp-2"><span className="text-slate-500">Đáp án mẫu: </span>{t.referenceAnswer.slice(0, 200)}</div>}
          </div>
        );
      })}
    </div>
  );
}

function CreateForm({ topics, onDone }: { topics: FlatTopic[]; onDone: () => void }) {
  const [topicId, setTopicId] = useState<number>(topics[0]?.id ?? 0);
  const [level, setLevel] = useState('MID');
  const [type, setType] = useState('CONCEPTUAL');
  const [body, setBody] = useState('');
  const [referenceAnswer, setReferenceAnswer] = useState('');
  const [rubric, setRubric] = useState('[\n  { "id": "c1", "criterion": "…", "weight": 0.5 },\n  { "id": "c2", "criterion": "…", "weight": 0.5 }\n]');
  const [mustMention, setMustMention] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!topicId && topics[0]) setTopicId(topics[0].id); }, [topics, topicId]);

  const save = async () => {
    if (!topicId || !body.trim()) { toast.warning('Chọn chủ đề và nhập nội dung'); return; }
    let parsedRubric: unknown = [];
    try { parsedRubric = JSON.parse(rubric); } catch { toast.error('Rubric không phải JSON hợp lệ'); return; }
    setSaving(true);
    try {
      await interviewAdminApi.createQuestion({
        topicId, level: level as never, type, body, bodyVi: body, referenceAnswer,
        rubric: parsedRubric as never,
        mustMention: mustMention.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'DRAFT', rubricReviewed: false,
      });
      toast.success('Đã tạo (DRAFT). Nhớ duyệt rubric trước khi publish.');
      onDone();
    } catch {
      toast.error('Không tạo được');
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-4 space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <select value={topicId} onChange={(e) => setTopicId(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
          {topics.map((t) => <option key={t.id} value={t.id}>{t.domain} · {t.track} · {t.name}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
          {['CONCEPTUAL', 'BEHAVIORAL', 'SCENARIO', 'SYSTEM_DESIGN', 'MCQ'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Nội dung câu hỏi (markdown — dán ảnh trực tiếp, ```lang cho code tô màu)</label>
        <MarkdownEditor value={body} onChange={setBody} placeholder="Nội dung câu hỏi. Dán ảnh để upload; dùng ```js ... ``` cho khối code." />
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Đáp án mẫu (mức mong đợi)</label>
        <MarkdownEditor value={referenceAnswer} onChange={setReferenceAnswer} placeholder="Đáp án mẫu — markdown + code + ảnh." />
      </div>
      <textarea value={rubric} onChange={(e) => setRubric(e.target.value)} rows={4} placeholder="Rubric JSON" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono" />
      <input value={mustMention} onChange={(e) => setMustMention(e.target.value)} placeholder="Khái niệm bắt buộc (phẩy ngăn cách): event loop, microtask, …" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-white/10">Huỷ</button>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-sm disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Tạo
        </button>
      </div>
    </div>
  );
}

// ── Phase 6: Knowledge base (RAG) ────────────────────────────
const KB_SOURCE_TYPES = ['ADMIN_WRITTEN', 'UPLOADED_MD', 'SCRAPED_DOC', 'REFERENCE_ANSWER'] as const;
const KB_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

interface FlatTrack { id: number; name: string; domain: string }

function chunkTone(n: number): string {
  if (n === 0) return 'bg-red-500/15 text-red-300 border-red-500/30';
  if (n <= 2) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
}

function Knowledge({ tax, topics, topicName }: { tax: TaxonomyResponse | null; topics: FlatTopic[]; topicName: (id: number) => string }) {
  const tracks = useMemo<FlatTrack[]>(() => {
    if (!tax) return [];
    const out: FlatTrack[] = [];
    for (const d of tax.domains) for (const t of d.tracks) out.push({ id: t.id, name: t.name, domain: d.name });
    return out;
  }, [tax]);

  const [coverage, setCoverage] = useState<KnowledgeCoverageRow[]>([]);
  const [items, setItems] = useState<KnowledgeDocListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState<KnowledgeDocListItem | 'new' | null>(null);

  const loadCoverage = useCallback(() => {
    interviewAdminApi.knowledgeCoverage().then((r) => setCoverage(r.data.data)).catch(() => {});
  }, []);
  const loadList = useCallback(() => {
    setLoading(true);
    interviewAdminApi
      .listKnowledge({ q: q.trim() || undefined, status: statusFilter || undefined })
      .then((r) => setItems(r.data.data))
      .catch(() => toast.error('Không tải được danh sách tài liệu'))
      .finally(() => setLoading(false));
  }, [q, statusFilter]);

  useEffect(() => { loadCoverage(); }, [loadCoverage]);
  useEffect(() => { loadList(); }, [loadList]);

  const del = async (doc: KnowledgeDocListItem) => {
    if (!confirm(`Xoá tài liệu "${doc.title}"? Mọi khối (chunk) đã tạo cũng bị xoá.`)) return;
    await interviewAdminApi.deleteKnowledge(doc.id).then(() => toast.success('Đã xoá')).catch(() => toast.error('Lỗi'));
    loadList(); loadCoverage();
  };

  const afterSave = () => { setEditing(null); loadList(); loadCoverage(); };

  if (editing) {
    return <KnowledgeEditor doc={editing === 'new' ? null : editing} tracks={tracks} topics={topics} onCancel={() => setEditing(null)} onSaved={afterSave} />;
  }

  return (
    <div className="space-y-6">
      {/* Coverage heatmap — the most important screen */}
      <CoverageHeatmap coverage={coverage} tracks={tracks} />

      {/* Document list controls */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tài liệu…"
              className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm w-56"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option value="">Mọi trạng thái</option>
            {KB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setEditing('new')} className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-sm">
            <Plus className="w-4 h-4" /> Tài liệu mới
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            {items.map((doc) => (
              <div key={doc.id} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white line-clamp-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-500 shrink-0" /> {doc.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${doc.status === 'PUBLISHED' ? 'bg-emerald-500/15 text-emerald-300' : doc.status === 'ARCHIVED' ? 'bg-slate-500/15 text-slate-400' : 'bg-amber-500/15 text-amber-300'}`}>{doc.status}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">{doc.language}</span>
                    {doc.level && <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">{doc.level}</span>}
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{doc.sourceType}</span>
                    <span className={`px-1.5 py-0.5 rounded border ${chunkTone(doc.chunkCount)}`}>{doc.chunkCount} chunk{doc.chunkCount === 0 ? ' · AI mù' : ''}</span>
                    {doc.topicIds.map((tid) => <span key={tid} className="text-slate-500">#{topicName(tid)}</span>)}
                    <span className="text-slate-600">· cập nhật {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(doc)} title="Sửa" className="p-1.5 rounded text-slate-300 hover:bg-white/10"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(doc)} title="Xoá" className="p-1.5 rounded text-red-400 hover:bg-white/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {!items.length && <div className="px-4 py-4 text-sm text-slate-500">Chưa có tài liệu nào. Bấm "Tài liệu mới" để AI có gì mà truy hồi.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function CoverageHeatmap({ coverage, tracks }: { coverage: KnowledgeCoverageRow[]; tracks: FlatTrack[] }) {
  // Group coverage rows by track, preserving taxonomy order where possible.
  const byTrack = useMemo(() => {
    const m = new Map<number, { track: string; rows: KnowledgeCoverageRow[] }>();
    for (const row of coverage) {
      if (!m.has(row.trackId)) m.set(row.trackId, { track: row.track, rows: [] });
      m.get(row.trackId)!.rows.push(row);
    }
    return m;
  }, [coverage]);

  const gapCount = coverage.filter((r) => r.chunkCount === 0).length;
  const orderedTrackIds = tracks.length
    ? tracks.filter((t) => byTrack.has(t.id)).map((t) => t.id)
    : [...byTrack.keys()];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-white"><Boxes className="w-4 h-4 text-teal-300" /> Bản đồ độ phủ tri thức</div>
        {gapCount > 0 && <span className="text-xs px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30">{gapCount} vùng AI đang mù</span>}
      </div>
      <p className="text-xs text-slate-500 mb-4">Mỗi ô là một chủ đề, con số là số khối tri thức (chunk) AI có thể truy hồi. <span className="text-red-300">Đỏ = 0 (AI đang mù vùng này)</span>, <span className="text-amber-300">vàng = mỏng</span>, <span className="text-emerald-300">xanh = đủ dày</span>.</p>

      {orderedTrackIds.length === 0 ? (
        <div className="text-sm text-slate-500">Chưa có dữ liệu độ phủ.</div>
      ) : (
        <div className="space-y-4">
          {orderedTrackIds.map((tid) => {
            const grp = byTrack.get(tid)!;
            return (
              <div key={tid}>
                <div className="text-xs font-medium text-slate-400 mb-1.5">{grp.track}</div>
                <div className="flex flex-wrap gap-2">
                  {grp.rows.map((row) => (
                    <div
                      key={row.topicId}
                      title={`${row.topic}: ${row.chunkCount} chunk`}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-2 ${chunkTone(row.chunkCount)}`}
                    >
                      <span className="max-w-[12rem] truncate">{row.topic}</span>
                      <span className="font-mono font-semibold">{row.chunkCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KnowledgeEditor({ doc, tracks, topics, onCancel, onSaved }: {
  doc: KnowledgeDocListItem | null;
  tracks: FlatTrack[];
  topics: FlatTopic[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!doc;
  const [title, setTitle] = useState(doc?.title ?? '');
  const [sourceType, setSourceType] = useState<string>(doc?.sourceType ?? 'ADMIN_WRITTEN');
  const [language, setLanguage] = useState<'VI' | 'EN'>(doc?.language ?? 'VI');
  const [level, setLevel] = useState<string>(doc?.level ?? '');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(doc?.status ?? 'DRAFT');
  const [topicIds, setTopicIds] = useState<number[]>(doc?.topicIds ?? []);
  const [trackIds, setTrackIds] = useState<number[]>(doc?.trackIds ?? []);
  const [sourceUrl, setSourceUrl] = useState(doc?.sourceUrl ?? '');
  const [content, setContent] = useState('');
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // On edit, fetch full detail (content + chunks).
  useEffect(() => {
    if (!doc) return;
    setLoadingDetail(true);
    interviewAdminApi.getKnowledge(doc.id)
      .then((r) => {
        const d: KnowledgeDocDetail = r.data.data;
        setContent(d.content ?? '');
        setChunks(d.chunks ?? []);
        setTitle(d.title);
        setSourceType(d.sourceType);
        setLanguage(d.language);
        setLevel(d.level ?? '');
        setStatus(d.status);
        setTopicIds(d.topicIds ?? []);
        setTrackIds(d.trackIds ?? []);
        setSourceUrl(d.sourceUrl ?? '');
      })
      .catch(() => toast.error('Không tải được nội dung tài liệu'))
      .finally(() => setLoadingDetail(false));
  }, [doc]);

  const toggle = (arr: number[], setArr: (v: number[]) => void, id: number) => {
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  const save = async () => {
    if (!title.trim()) { toast.warning('Nhập tiêu đề'); return; }
    if (!content.trim()) { toast.warning('Nhập nội dung tài liệu'); return; }
    const body = {
      title: title.trim(),
      content,
      sourceType,
      language,
      level: level || null,
      status,
      topicIds,
      trackIds,
      sourceUrl: sourceUrl.trim() || null,
    };
    setSaving(true);
    try {
      if (isEdit && doc) {
        await interviewAdminApi.updateKnowledge(doc.id, body);
        toast.success('Đã lưu. Tài liệu được chia lại khối (re-chunk).');
      } else {
        await interviewAdminApi.createKnowledge(body);
        toast.success('Đã tạo tài liệu và chia khối cho AI.');
      }
      onSaved();
    } catch {
      toast.error('Không lưu được');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" /> Danh sách</button>
        <h2 className="text-lg font-semibold text-white">{isEdit ? 'Sửa tài liệu' : 'Tài liệu mới'}</h2>
      </div>

      {loadingDetail ? (
        <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải nội dung…</div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề tài liệu" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nguồn</label>
              <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                {KB_SOURCE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ngôn ngữ</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as 'VI' | 'EN')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                <option value="VI">VI</option>
                <option value="EN">EN</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cấp độ</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                <option value="">Tất cả</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                {KB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Chủ đề liên quan (topic) — chọn nhiều</label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded-lg border border-white/10 bg-white/[0.02]">
              {topics.length === 0 && <span className="text-xs text-slate-500">Chưa có taxonomy.</span>}
              {topics.map((t) => {
                const on = topicIds.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => toggle(topicIds, setTopicIds, t.id)} title={`${t.domain} · ${t.track}`}
                    className={`px-2 py-1 rounded text-xs border ${on ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Track liên quan — chọn nhiều</label>
            <div className="flex flex-wrap gap-1.5">
              {tracks.length === 0 && <span className="text-xs text-slate-500">Chưa có taxonomy.</span>}
              {tracks.map((t) => {
                const on = trackIds.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => toggle(trackIds, setTrackIds, t.id)} title={t.domain}
                    className={`px-2 py-1 rounded text-xs border ${on ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="URL nguồn (tuỳ chọn)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nội dung (markdown — dán ảnh trực tiếp, ```lang cho code; heading ## dùng để chia khối)</label>
            <MarkdownEditor value={content} onChange={setContent} placeholder="Viết tài liệu tri thức. Dùng heading (##, ###) để AI chia khối gọn gàng." />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-white/10">Huỷ</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-sm disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {isEdit ? 'Lưu' : 'Tạo'}
            </button>
          </div>
        </div>
      )}

      {isEdit && !loadingDetail && <ChunkPreview chunks={chunks} />}
    </div>
  );
}

// ── Phase 8: AI question generation (preview → commit) ───────
const GEN_TYPES = ['ANY', 'CONCEPTUAL', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'SCENARIO', 'MCQ'] as const;

interface GenRow {
  include: boolean;
  body: string;
  referenceAnswer: string;
  mustText: string;
  rubricText: string;
  difficulty: number;
  type: string;
  shouldMention: string[];
  redFlags: string[];
  tags: string[];
}

function toRow(q: GeneratedQuestion): GenRow {
  return {
    include: true,
    body: q.body,
    referenceAnswer: q.referenceAnswer ?? '',
    mustText: (q.mustMention ?? []).join(', '),
    rubricText: JSON.stringify(q.rubric ?? [], null, 2),
    difficulty: q.difficulty ?? 3,
    type: q.type ?? 'CONCEPTUAL',
    shouldMention: q.shouldMention ?? [],
    redFlags: q.redFlags ?? [],
    tags: q.tags ?? [],
  };
}

function Generate({ topics }: { topics: FlatTopic[] }) {
  const [topicId, setTopicId] = useState<number>(topics[0]?.id ?? 0);
  const [level, setLevel] = useState('MID');
  const [count, setCount] = useState(5);
  const [type, setType] = useState<string>('ANY');
  const [language, setLanguage] = useState<'VI' | 'EN'>('VI');
  const [useKnowledge, setUseKnowledge] = useState(true);
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [rows, setRows] = useState<GenRow[]>([]);
  const [meta, setMeta] = useState<{ grounded: boolean; chunksUsed: number; model: string; warning?: string; sources: { title: string }[] } | null>(null);

  useEffect(() => { if (!topicId && topics[0]) setTopicId(topics[0].id); }, [topics, topicId]);

  const generate = async () => {
    if (!topicId) { toast.warning('Chọn chủ đề'); return; }
    setLoading(true);
    setRows([]);
    setMeta(null);
    try {
      const r = await interviewAdminApi.generateQuestions({ topicId, level, count, type, language, useKnowledge });
      const d = r.data.data;
      setRows(d.questions.map(toRow));
      setMeta({ grounded: d.grounded, chunksUsed: d.chunksUsed, model: d.model, warning: d.warning, sources: d.sources });
      if (!d.questions.length) toast.warning('AI không trả về câu hỏi nào. Thử lại.');
      else toast.success(`AI đề xuất ${d.questions.length} câu — rà soát rồi lưu.`);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không sinh được câu hỏi (AI có thể đang tắt).');
    } finally {
      setLoading(false);
    }
  };

  const patch = (i: number, p: Partial<GenRow>) => setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...p } : r)));

  const commit = async () => {
    const chosen = rows.filter((r) => r.include && r.body.trim());
    if (!chosen.length) { toast.warning('Chọn ít nhất một câu để lưu'); return; }
    // Reconstruct GeneratedQuestion payloads; rubric parsed leniently.
    const questions: GeneratedQuestion[] = chosen.map((r) => {
      let rubric: GeneratedQuestion['rubric'] = [];
      try { const p = JSON.parse(r.rubricText); if (Array.isArray(p)) rubric = p; } catch { /* keep [] — admin can fix later */ }
      return {
        body: r.body,
        referenceAnswer: r.referenceAnswer,
        rubric,
        mustMention: r.mustText.split(',').map((s) => s.trim()).filter(Boolean),
        shouldMention: r.shouldMention,
        redFlags: r.redFlags,
        difficulty: r.difficulty,
        type: r.type,
        tags: r.tags,
      };
    });
    setCommitting(true);
    try {
      const r = await interviewAdminApi.commitQuestions({ topicId, level, questions });
      toast.success(`Đã lưu ${r.data.data.created} câu vào ngân hàng (DRAFT, chưa duyệt). Vào tab "Câu hỏi" để duyệt & publish.`);
      setRows([]);
      setMeta(null);
    } catch {
      toast.error('Không lưu được');
    } finally {
      setCommitting(false);
    }
  };

  const chosenCount = rows.filter((r) => r.include).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1"><Sparkles className="w-4 h-4 text-teal-300" /> AI sinh câu hỏi từ kho tri thức</div>
        <p className="text-xs text-slate-500 mb-4">AI đề xuất câu hỏi + rubric + đáp án mẫu, bám theo kho tri thức (RAG) của chủ đề. Câu tạo ra là <b className="text-slate-300">bản nháp (DRAFT), chưa duyệt</b> — không lọt vào buổi phỏng vấn thật cho tới khi bạn duyệt & publish.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <select value={topicId} onChange={(e) => setTopicId(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {topics.map((t) => <option key={t.id} value={t.id}>{t.domain} · {t.track} · {t.name}</option>)}
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {GEN_TYPES.map((t) => <option key={t} value={t}>{t === 'ANY' ? 'Mọi loại' : t}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 shrink-0">Số câu</label>
            <input type="number" min={1} max={10} value={count} onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value as 'VI' | 'EN')} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            <option value="VI">Tiếng Việt</option>
            <option value="EN">English</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={useKnowledge} onChange={(e) => setUseKnowledge(e.target.checked)} className="accent-teal-500" /> Dùng kho tri thức (RAG)
          </label>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={generate} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-sm disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} {loading ? 'Đang sinh…' : 'Sinh câu hỏi'}
          </button>
        </div>
      </div>

      {meta && (
        <div className={`rounded-xl border p-3 text-xs ${meta.grounded ? 'border-emerald-500/30 bg-emerald-500/[0.05] text-emerald-200/90' : 'border-amber-500/30 bg-amber-500/[0.05] text-amber-200/90'}`}>
          {meta.grounded
            ? <>Grounded trên <b>{meta.chunksUsed}</b> khối tri thức · model <span className="font-mono">{meta.model}</span>{meta.sources.length ? <> · nguồn: {meta.sources.slice(0, 4).map((s) => s.title).join(', ')}{meta.sources.length > 4 ? '…' : ''}</> : null}</>
            : <>{meta.warning || 'Không có kho tri thức cho chủ đề này — câu hỏi dựa trên kiến thức chung.'} · model <span className="font-mono">{meta.model}</span></>}
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">{chosenCount}/{rows.length} câu được chọn</div>
            <button onClick={commit} disabled={committing || chosenCount === 0} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm disabled:opacity-50">
              {committing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu {chosenCount} câu (DRAFT)
            </button>
          </div>
          {rows.map((r, i) => (
            <div key={i} className={`rounded-xl border p-4 space-y-3 ${r.include ? 'border-teal-500/30 bg-white/[0.03]' : 'border-white/10 bg-white/[0.01] opacity-60'}`}>
              <div className="flex items-start gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-400 shrink-0 pt-1">
                  <input type="checkbox" checked={r.include} onChange={(e) => patch(i, { include: e.target.checked })} className="accent-teal-500" /> Lưu câu này
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <select value={r.type} onChange={(e) => patch(i, { type: e.target.value })} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs">
                    {['CONCEPTUAL', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'SCENARIO', 'MCQ'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={r.difficulty} onChange={(e) => patch(i, { difficulty: Number(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs">
                    {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>độ khó {d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Câu hỏi</label>
                <textarea value={r.body} onChange={(e) => patch(i, { body: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Đáp án mẫu</label>
                <textarea value={r.referenceAnswer} onChange={(e) => patch(i, { referenceAnswer: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Rubric (JSON)</label>
                  <textarea value={r.rubricText} onChange={(e) => patch(i, { rubricText: e.target.value })} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono" />
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">Khái niệm bắt buộc (phẩy ngăn cách)</label>
                    <input value={r.mustText} onChange={(e) => patch(i, { mustText: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  {r.redFlags.length > 0 && (
                    <div className="text-[11px] text-slate-500">Red flags: <span className="text-rose-300/80">{r.redFlags.join(' · ')}</span></div>
                  )}
                  {r.tags.length > 0 && (
                    <div className="text-[11px] text-slate-500">Tags: {r.tags.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Phase 7: Prompt template editor (versioned) ──────────────
function Prompts() {
  const [items, setItems] = useState<PromptSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    interviewAdminApi.listPrompts().then((r) => setItems(r.data.data)).catch(() => toast.error('Không tải được prompt')).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1"><ScrollText className="w-4 h-4 text-teal-300" /> Prompt hệ thống của AI</div>
        <p className="text-xs text-slate-500">Chỉnh giọng điệu & quy tắc của AI (chấm bài, viết báo cáo, sinh câu hỏi) mà KHÔNG cần deploy. Mỗi lần lưu tạo một <b className="text-slate-300">phiên bản mới</b> và kích hoạt nó; có thể quay lại phiên bản cũ hoặc <b className="text-slate-300">reset về mặc định</b> bất cứ lúc nào. Giữ nguyên các biến <span className="font-mono text-slate-400">{'{{...}}'}</span> — hệ thống tự điền.</p>
      </div>
      {items.map((p) => (
        <PromptCard key={p.key} p={p} open={openKey === p.key} onToggle={() => setOpenKey(openKey === p.key ? null : p.key)} onChanged={load} />
      ))}
    </div>
  );
}

function PromptCard({ p, open, onToggle, onChanged }: { p: PromptSummary; open: boolean; onToggle: () => void; onChanged: () => void }) {
  const [content, setContent] = useState(p.activeContent);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<PromptVersion[] | null>(null);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => { setContent(p.activeContent); }, [p.activeContent]);

  const dirty = content !== p.activeContent;

  const save = async () => {
    if (!content.trim()) { toast.warning('Nội dung trống'); return; }
    setSaving(true);
    try {
      await interviewAdminApi.savePrompt(p.key, content);
      toast.success('Đã lưu phiên bản mới & kích hoạt.');
      onChanged();
    } catch {
      toast.error('Không lưu được');
    } finally {
      setSaving(false);
    }
  };
  const reset = async () => {
    if (!confirm('Reset về prompt mặc định (gốc code)? Các phiên bản đã lưu vẫn giữ trong lịch sử.')) return;
    await interviewAdminApi.resetPrompt(p.key).then(() => { toast.success('Đã quay về mặc định.'); onChanged(); }).catch(() => toast.error('Lỗi'));
  };
  const loadVersions = async () => {
    if (versions) { setShowVersions((s) => !s); return; }
    try { const r = await interviewAdminApi.promptVersions(p.key); setVersions(r.data.data.versions); setShowVersions(true); } catch { toast.error('Không tải được lịch sử'); }
  };
  const activate = async (version: number) => {
    await interviewAdminApi.activatePrompt(p.key, version).then(() => { toast.success(`Đã kích hoạt v${version}`); onChanged(); setVersions(null); setShowVersions(false); }).catch(() => toast.error('Lỗi'));
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02]">
        {open ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white">{p.name}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{p.description}</div>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded shrink-0 ${p.usingDefault ? 'bg-slate-500/15 text-slate-400' : 'bg-emerald-500/15 text-emerald-300'}`}>
          {p.usingDefault ? 'Mặc định' : `Tuỳ chỉnh · v${p.activeVersion}`}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          {p.variables.length > 0 && (
            <div className="text-[11px] text-slate-500">
              Biến khả dụng: {p.variables.map((v) => (
                <span key={v.name} className="inline-block mr-2"><span className="font-mono text-teal-300/80">{`{{${v.name}}}`}</span> <span className="text-slate-600">— {v.desc}</span></span>
              ))}
            </div>
          )}
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono leading-relaxed" spellCheck={false} />
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-sm disabled:opacity-40">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu phiên bản mới
            </button>
            {dirty && <button onClick={() => setContent(p.activeContent)} className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:bg-white/10">Hoàn tác</button>}
            <button onClick={() => setContent(p.defaultContent)} className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:bg-white/10 inline-flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Nạp bản mặc định vào ô</button>
            {!p.usingDefault && <button onClick={reset} className="px-3 py-1.5 rounded-lg text-sm text-amber-300/90 hover:bg-amber-500/10 border border-amber-500/30">Về mặc định</button>}
            {p.versionCount > 0 && (
              <button onClick={loadVersions} className="ml-auto px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:bg-white/10 inline-flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Lịch sử ({p.versionCount})</button>
            )}
          </div>
          {showVersions && versions && (
            <div className="rounded-lg border border-white/10 divide-y divide-white/5">
              {versions.map((v) => (
                <div key={v.id} className="flex items-center gap-3 px-3 py-2 text-xs">
                  <span className="font-mono text-slate-400">v{v.version}</span>
                  {v.isActive && <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">đang dùng</span>}
                  <span className="text-slate-600">{new Date(v.updatedAt).toLocaleString('vi-VN')}</span>
                  <span className="text-slate-500 truncate flex-1">{v.content.slice(0, 80)}…</span>
                  {!v.isActive && <button onClick={() => activate(v.version)} className="shrink-0 px-2 py-1 rounded bg-white/5 text-slate-300 hover:bg-white/10">Kích hoạt</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChunkPreview({ chunks }: { chunks: KnowledgeChunk[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (id: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-sm font-semibold text-white mb-1">Xem trước {chunks.length} khối (chunk) — cách AI sẽ truy hồi tài liệu này</div>
      <p className="text-xs text-slate-500 mb-3">Mỗi khối là một đoạn tài liệu được AI lấy ra khi trả lời. Kiểm tra chia khối hợp lý trước khi dựa vào nó.</p>
      {chunks.length === 0 ? (
        <div className="text-sm text-slate-500">Chưa có khối nào — lưu tài liệu để hệ thống chia khối.</div>
      ) : (
        <div className="space-y-2">
          {chunks.map((c) => {
            const isOpen = open.has(c.id);
            const preview = c.content.length > 240 ? c.content.slice(0, 240) + '…' : c.content;
            return (
              <div key={c.id} className="rounded-lg border border-white/10 bg-white/[0.02]">
                <button onClick={() => toggle(c.id)} className="w-full flex items-center gap-2 px-3 py-2 text-left">
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
                  <span className="text-xs font-mono text-slate-500 shrink-0">#{c.chunkIndex}</span>
                  <span className="text-xs text-slate-400 truncate flex-1">{c.headingPath || '(không có heading)'}</span>
                  <span className="text-[11px] text-slate-500 shrink-0">{c.tokenCount} tokens</span>
                </button>
                <div className="px-3 pb-3 text-xs text-slate-300 whitespace-pre-wrap">{isOpen ? c.content : preview}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
