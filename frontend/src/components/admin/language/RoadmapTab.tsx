'use client';

// RoadmapTab — admin manager for a language's learning Roadmap.
// List nodes grouped by stage, add/edit/delete, and one-click seed the
// English (0→IELTS 7.5) / Japanese (0→N2) starter roadmaps.

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Sparkles, Pencil, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi, languageApi, type RoadmapNode } from '@/lib/language-api';
import type { VocabCategory } from '@/types/language';
import { Modal, inputCls, labelCls, btnPrimary, btnGhost, btnAdd, unwrap, errMsg, RowActions } from './shared';

const LINK_TYPES = ['', 'alphabet', 'vocab', 'grammar', 'listening', 'conversation', 'reading', 'qna', 'roleplay', 'writing', 'external'];
const ICON_NAMES = ['Route', 'Type', 'BookOpen', 'GraduationCap', 'Headphones', 'MessagesSquare', 'Newspaper', 'HelpCircle', 'PenLine', 'Bot'];

type Form = {
  id?: number;
  stage: number;
  stageLabel: string;
  order: number;
  side: string;
  kind: string;
  title: string;
  subtitle: string;
  level: string;
  icon: string;
  linkType: string;
  linkRef: string;
  description: string;
};

const EMPTY: Form = {
  stage: 0, stageLabel: '', order: 0, side: 'center', kind: 'primary',
  title: '', subtitle: '', level: '', icon: 'Route', linkType: '', linkRef: '', description: '',
};

export default function RoadmapTab({ languageId, code }: { languageId: number; code: string }) {
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [categories, setCategories] = useState<VocabCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const canSeed = code === 'en' || code === 'ja';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setNodes(unwrap(await languageAdminApi.roadmapNodes(code)));
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được lộ trình'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => { void load(); }, [load]);

  // Vocab categories — for binding a node to a Practice lesson (linkRef = categoryId).
  useEffect(() => {
    languageApi.vocabCategories(code).then((res) => setCategories(res.data.data ?? [])).catch(() => {});
  }, [code]);

  const seed = async (force: boolean) => {
    if (force && !window.confirm('Ghi đè sẽ XÓA toàn bộ chặng hiện có của ngôn ngữ này rồi tạo lại từ mẫu. Tiếp tục?')) return;
    setSeeding(true);
    try {
      unwrap(await languageAdminApi.seedRoadmap({ code, force }));
      toast.success(force ? 'Đã tạo lại lộ trình mẫu' : 'Đã seed lộ trình mẫu');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Không seed được'));
    } finally {
      setSeeding(false);
    }
  };

  const [assigning, setAssigning] = useState(false);
  const autoAssign = async (force: boolean) => {
    if (force && !window.confirm('Gán lại sẽ xoá mọi liên kết danh mục hiện có trên các chặng từ vựng rồi phân bổ lại. Tiếp tục?')) return;
    setAssigning(true);
    try {
      const r = unwrap(await languageAdminApi.autoAssignRoadmap(code, force)) as { boundNodes: number; eligibleCategories: number };
      toast.success(`Đã gán ${r.boundNodes} danh mục vào các chặng từ vựng (có ${r.eligibleCategories} danh mục đủ điều kiện). Trang Luyện tập giờ sẽ nhóm theo chặng.`);
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Không gán được danh mục'));
    } finally {
      setAssigning(false);
    }
  };

  const openNew = () => {
    const lastStage = nodes.length ? nodes[nodes.length - 1] : null;
    setForm({ ...EMPTY, stage: lastStage?.stage ?? 0, stageLabel: lastStage?.stageLabel ?? '', order: (nodes.filter((n) => n.stage === (lastStage?.stage ?? 0)).length) });
    setOpen(true);
  };
  const openEdit = (n: RoadmapNode) => {
    setForm({
      id: n.id, stage: n.stage, stageLabel: n.stageLabel, order: n.order, side: n.side, kind: n.kind,
      title: n.title, subtitle: n.subtitle ?? '', level: n.level ?? '', icon: n.icon ?? 'Route',
      linkType: n.linkType ?? '', linkRef: n.linkRef ?? '', description: n.description ?? '',
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) { toast.error('Thiếu tiêu đề chặng'); return; }
    if (!form.stageLabel.trim()) { toast.error('Thiếu tên nhóm chặng'); return; }
    setSaving(true);
    const body = { ...form, linkType: form.linkType || null };
    try {
      if (form.id) unwrap(await languageAdminApi.updateRoadmapNode(form.id, body));
      else unwrap(await languageAdminApi.createRoadmapNode(languageId, body));
      toast.success('Đã lưu');
      setOpen(false);
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được'));
    } finally {
      setSaving(false);
    }
  };

  const del = async (n: RoadmapNode) => {
    if (!window.confirm(`Xóa chặng "${n.title}"?`)) return;
    try {
      unwrap(await languageAdminApi.deleteRoadmapNode(n.id));
      setNodes((prev) => prev.filter((x) => x.id !== n.id));
    } catch (e) {
      toast.error(errMsg(e, 'Không xóa được'));
    }
  };

  // Group by stage for display.
  const stages: Array<{ stage: number; stageLabel: string; nodes: RoadmapNode[] }> = [];
  for (const n of nodes) {
    let s = stages.find((x) => x.stage === n.stage);
    if (!s) { s = { stage: n.stage, stageLabel: n.stageLabel, nodes: [] }; stages.push(s); }
    s.nodes.push(n);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className={btnAdd} onClick={openNew}><Plus className="h-4 w-4" /> Thêm chặng</button>
        {canSeed && (
          <>
            <button className={btnGhost} onClick={() => seed(false)} disabled={seeding}>
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Seed mẫu ({code.toUpperCase()})
            </button>
            {nodes.length > 0 && (
              <button className={btnGhost} onClick={() => seed(true)} disabled={seeding}>Tạo lại (ghi đè)</button>
            )}
          </>
        )}
        {nodes.length > 0 && (
          <>
            <button className={btnGhost} onClick={() => autoAssign(false)} disabled={assigning} title="Phân bổ tự động các danh mục từ vựng vào các chặng để trang Luyện tập nhóm bài theo chặng">
              {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Gán danh mục vào chặng
            </button>
            <button className={btnGhost} onClick={() => autoAssign(true)} disabled={assigning}>Gán lại (ghi đè)</button>
          </>
        )}
        <span className="ml-auto text-xs text-text-muted">{nodes.length} chặng</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>
      ) : nodes.length === 0 ? (
        <p className="rounded-xl border border-darkborder bg-white/5 p-6 text-center text-sm text-text-muted">
          Chưa có chặng nào.{canSeed ? ' Bấm “Seed mẫu” để tạo lộ trình khởi đầu, rồi tùy chỉnh.' : ' Bấm “Thêm chặng” để bắt đầu.'}
        </p>
      ) : (
        <div className="space-y-5">
          {stages.map((s) => (
            <div key={s.stage}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-300">Chặng {s.stage + 1} · {s.stageLabel}</p>
              <ul className="space-y-1.5">
                {s.nodes.map((n) => (
                  <li key={n.id} className="flex items-center gap-3 rounded-lg border border-darkborder bg-white/5 px-3 py-2">
                    <span className="w-6 text-center text-xs text-text-muted">{n.order}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm text-text-primary">{n.title}</span>
                        {n.level && <span className="rounded bg-neon-violet/15 px-1.5 py-0.5 text-[10px] text-violet-200">{n.level}</span>}
                        {n.kind === 'alternative' && <span className="rounded bg-neon-cyan/15 px-1.5 py-0.5 text-[10px] text-cyan-200">nhánh</span>}
                        {n.linkType && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-text-muted">{n.linkType}</span>}
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-text-muted">{n.side}</span>
                      </div>
                    </div>
                    <button onClick={() => openEdit(n)} className="text-text-muted hover:text-violet-300" aria-label="Sửa"><Pencil className="h-4 w-4" /></button>
                    <RowActions onDelete={() => del(n)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={form.id ? 'Sửa chặng' : 'Thêm chặng'}
        footer={
          <>
            <button className={btnGhost} onClick={() => setOpen(false)}>Hủy</button>
            <button className={btnPrimary} onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Lưu
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Chặng (số)</label>
            <input type="number" className={inputCls} value={form.stage} onChange={(e) => setForm({ ...form, stage: Number(e.target.value) || 0 })} />
          </div>
          <div>
            <label className={labelCls}>Thứ tự trong chặng</label>
            <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tên nhóm chặng (stageLabel) *</label>
          <input className={inputCls} value={form.stageLabel} onChange={(e) => setForm({ ...form, stageLabel: e.target.value })} placeholder="vd: N5 / IELTS nền (B2)" />
        </div>
        <div>
          <label className={labelCls}>Tiêu đề chặng *</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Phụ đề</label>
          <input className={inputCls} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Cấp độ</label>
            <input className={inputCls} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="N5 / A1…" />
          </div>
          <div>
            <label className={labelCls}>Icon</label>
            <select className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {ICON_NAMES.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Bên (side)</label>
            <select className={inputCls} value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })}>
              <option value="center">center</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Loại (kind)</label>
            <select className={inputCls} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="primary">primary</option>
              <option value="alternative">alternative (nhánh)</option>
              <option value="info">info</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Dẫn tới mục (linkType)</label>
            <select className={inputCls} value={form.linkType} onChange={(e) => setForm({ ...form, linkType: e.target.value })}>
              {LINK_TYPES.map((lt) => <option key={lt} value={lt}>{lt || '— không —'}</option>)}
            </select>
          </div>
          <div>
            {form.linkType === 'vocab' ? (
              <>
                <label className={labelCls}>Bài Luyện tập (danh mục)</label>
                <select className={inputCls} value={form.linkRef} onChange={(e) => setForm({ ...form, linkRef: e.target.value })}>
                  <option value="">— không gắn —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}{typeof c.wordCount === 'number' ? ` (${c.wordCount} từ)` : ''}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label className={labelCls}>Link ngoài (nếu external)</label>
                <input className={inputCls} value={form.linkRef} onChange={(e) => setForm({ ...form, linkRef: e.target.value })} placeholder="https://…" />
              </>
            )}
          </div>
        </div>
        {form.linkType === 'vocab' && (
          <p className="-mt-1 text-[11px] text-text-muted">Gắn danh mục từ vựng để chặng này xuất hiện thành bài trong tab Luyện tập (theo đúng thứ tự chặng).</p>
        )}
        <div>
          <label className={labelCls}>Giới thiệu (hiện khi bấm chặng)</label>
          <textarea className={inputCls} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
