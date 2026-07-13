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
import { Loader2, AlertTriangle, Plus, Trash2, CheckCircle2, Eye, Check } from 'lucide-react';
import { interviewApi } from '@/lib/interview-api';
import { interviewAdminApi, type AdminQuestion, type BankHealthRow, type LlmUsage, type FlaggedTurn } from '@/lib/interview-api';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import type { TaxonomyResponse, TaxonomyTopic } from '@/types/interview';
import { LEVELS } from '@/types/interview';

type Tab = 'overview' | 'questions' | 'flagged';

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

      <div className="flex gap-2 mb-6">
        {(['overview', 'questions', 'flagged'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm border ${tab === t ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-white/5 text-slate-400 border-transparent hover:text-white'}`}>
            {t === 'overview' ? 'Tổng quan' : t === 'questions' ? 'Câu hỏi' : 'Cần rà soát'}
          </button>
        ))}
      </div>

      {tab === 'overview' ? <Overview topicName={topicName} /> : tab === 'questions' ? <Questions topics={topics} topicName={topicName} /> : <Flagged />}
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
