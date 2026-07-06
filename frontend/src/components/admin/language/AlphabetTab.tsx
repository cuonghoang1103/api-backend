'use client';

// AlphabetTab — manage alphabet groups (create/rename/reorder/delete)
// and, inside a selected group, its items (character / romanization /
// image / audio) with inline add-edit, DnD reorder, bulk paste.

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { AlphabetGroup, AlphabetItem } from '@/types/language';
import {
  Modal,
  ImageField,
  AudioField,
  SortableList,
  RowActions,
  inputCls,
  labelCls,
  btnAdd,
  btnPrimary,
  btnGhost,
  unwrap,
  errMsg,
} from './shared';

interface TabProps {
  languageId: number;
  code: string;
}

interface GroupEditor {
  id: number | null;
  name: string;
  description: string;
}

interface ItemEditor {
  id: number | null;
  character: string;
  romanization: string;
  imageUrl: string;
  audioUrl: string;
  note: string;
}

const EMPTY_ITEM: ItemEditor = { id: null, character: '', romanization: '', imageUrl: '', audioUrl: '', note: '' };

export default function AlphabetTab({ languageId, code }: TabProps) {
  const [groups, setGroups] = useState<AlphabetGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [groupEditor, setGroupEditor] = useState<GroupEditor | null>(null);
  const [itemEditor, setItemEditor] = useState<ItemEditor | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = unwrap(await languageAdminApi.content(code, 'alphabet')) as AlphabetGroup[];
      setGroups(rows);
      setSelectedId((prev) => prev ?? rows[0]?.id ?? null);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được bảng chữ cái'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = groups.find((g) => g.id === selectedId) ?? null;

  // ─── Groups ────────────────────────────────────────────────────
  const saveGroup = async () => {
    if (!groupEditor || saving) return;
    if (!groupEditor.name.trim()) {
      toast.error('Cần tên nhóm');
      return;
    }
    setSaving(true);
    const body = { name: groupEditor.name.trim(), description: groupEditor.description || undefined };
    try {
      if (groupEditor.id == null) {
        await languageAdminApi.createAlphabetGroup(languageId, { ...body, order: groups.length });
        toast.success('Đã tạo nhóm');
      } else {
        await languageAdminApi.updateAlphabetGroup(groupEditor.id, body);
        toast.success('Đã cập nhật nhóm');
      }
      setGroupEditor(null);
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Lưu thất bại'));
    } finally {
      setSaving(false);
    }
  };

  const removeGroup = async (g: AlphabetGroup) => {
    if (!window.confirm(`Xóa nhóm "${g.name}" và toàn bộ ký tự trong nhóm?`)) return;
    try {
      await languageAdminApi.deleteAlphabetGroup(g.id);
      toast.success('Đã xóa nhóm');
      if (selectedId === g.id) setSelectedId(null);
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorderGroups = async (ordered: AlphabetGroup[]) => {
    setGroups(ordered);
    try {
      await languageAdminApi.reorder('alphabetGroup', ordered.map((g, i) => ({ id: g.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  // ─── Items ─────────────────────────────────────────────────────
  const saveItem = async () => {
    if (!itemEditor || !selected || saving) return;
    if (!itemEditor.character.trim()) {
      toast.error('Cần ký tự');
      return;
    }
    setSaving(true);
    const body = {
      character: itemEditor.character.trim(),
      romanization: itemEditor.romanization || undefined,
      imageUrl: itemEditor.imageUrl || undefined,
      audioUrl: itemEditor.audioUrl || undefined,
      note: itemEditor.note || undefined,
    };
    try {
      if (itemEditor.id == null) {
        await languageAdminApi.createAlphabetItem(selected.id, { ...body, order: selected.items.length });
        toast.success('Đã thêm ký tự');
      } else {
        await languageAdminApi.updateAlphabetItem(itemEditor.id, body);
        toast.success('Đã cập nhật');
      }
      setItemEditor(null);
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Lưu thất bại'));
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (it: AlphabetItem) => {
    if (!window.confirm(`Xóa ký tự "${it.character}"?`)) return;
    try {
      await languageAdminApi.deleteAlphabetItem(it.id);
      toast.success('Đã xóa');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorderItems = async (ordered: AlphabetItem[]) => {
    if (!selected) return;
    setGroups((prev) => prev.map((g) => (g.id === selected.id ? { ...g, items: ordered } : g)));
    try {
      await languageAdminApi.reorder('alphabetItem', ordered.map((it, i) => ({ id: it.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await load();
    }
  };

  const runBulk = async () => {
    if (!selected || saving) return;
    if (!bulkText.trim()) {
      toast.error('Nhập nội dung');
      return;
    }
    setSaving(true);
    try {
      await languageAdminApi.bulkAlphabet(selected.id, bulkText);
      toast.success('Đã thêm hàng loạt');
      setBulkOpen(false);
      setBulkText('');
      await load();
    } catch (e) {
      toast.error(errMsg(e, 'Thêm hàng loạt thất bại'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-neon-violet" /></div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Groups column */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Nhóm</h3>
          <button onClick={() => setGroupEditor({ id: null, name: '', description: '' })} className={btnAdd}>
            <Plus className="h-4 w-4" /> Nhóm
          </button>
        </div>
        {groups.length === 0 ? (
          <p className="text-sm text-text-muted">Chưa có nhóm nào.</p>
        ) : (
          <SortableList
            items={groups}
            getId={(g) => g.id}
            onReorder={reorderGroups}
            renderItem={(g) => (
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedId(g.id)} className="flex min-w-0 flex-1 items-center gap-1 text-left">
                  <ChevronRight className={`h-4 w-4 shrink-0 ${selectedId === g.id ? 'text-neon-violet' : 'text-text-muted'}`} />
                  <span className={`truncate text-sm ${selectedId === g.id ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{g.name}</span>
                  <span className="ml-1 text-[11px] text-text-muted">({g.items.length})</span>
                </button>
                <button onClick={() => setGroupEditor({ id: g.id, name: g.name, description: g.description ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
                <RowActions onDelete={() => removeGroup(g)} />
              </div>
            )}
          />
        )}
      </div>

      {/* Items column */}
      <div className="space-y-3">
        {!selected ? (
          <p className="text-sm text-text-muted">Chọn một nhóm để quản lý ký tự.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary">Ký tự — {selected.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => setBulkOpen(true)} className={btnGhost}>Thêm hàng loạt</button>
                <button onClick={() => setItemEditor({ ...EMPTY_ITEM })} className={btnAdd}><Plus className="h-4 w-4" /> Ký tự</button>
              </div>
            </div>
            {selected.items.length === 0 ? (
              <p className="text-sm text-text-muted">Chưa có ký tự nào.</p>
            ) : (
              <SortableList
                items={selected.items}
                getId={(it) => it.id}
                onReorder={reorderItems}
                renderItem={(it) => (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-text-primary">{it.character}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-text-secondary">{it.romanization || <span className="text-text-muted">—</span>}</div>
                      {it.note && <div className="truncate text-[11px] text-text-muted">{it.note}</div>}
                    </div>
                    {it.audioUrl && <span className="text-[11px] text-emerald-400">♪</span>}
                    <button onClick={() => setItemEditor({ id: it.id, character: it.character, romanization: it.romanization ?? '', imageUrl: it.imageUrl ?? '', audioUrl: it.audioUrl ?? '', note: it.note ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
                    <RowActions onDelete={() => removeItem(it)} />
                  </div>
                )}
              />
            )}
          </>
        )}
      </div>

      {/* Group modal */}
      <Modal
        open={groupEditor != null}
        onClose={() => !saving && setGroupEditor(null)}
        title={groupEditor?.id == null ? 'Thêm nhóm' : 'Sửa nhóm'}
        footer={
          <>
            <button onClick={() => setGroupEditor(null)} disabled={saving} className={btnGhost}>Hủy</button>
            <button onClick={saveGroup} disabled={saving} className={btnPrimary}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu</button>
          </>
        }
      >
        {groupEditor && (
          <>
            <label className={labelCls}>Tên nhóm *<input value={groupEditor.name} onChange={(e) => setGroupEditor({ ...groupEditor, name: e.target.value })} placeholder="Vd: Hiragana" className={`mt-1 ${inputCls}`} autoFocus /></label>
            <label className={labelCls}>Mô tả<textarea value={groupEditor.description} onChange={(e) => setGroupEditor({ ...groupEditor, description: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
          </>
        )}
      </Modal>

      {/* Item modal */}
      <Modal
        open={itemEditor != null}
        onClose={() => !saving && setItemEditor(null)}
        title={itemEditor?.id == null ? 'Thêm ký tự' : 'Sửa ký tự'}
        footer={
          <>
            <button onClick={() => setItemEditor(null)} disabled={saving} className={btnGhost}>Hủy</button>
            <button onClick={saveItem} disabled={saving} className={btnPrimary}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu</button>
          </>
        }
      >
        {itemEditor && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>Ký tự *<input value={itemEditor.character} onChange={(e) => setItemEditor({ ...itemEditor, character: e.target.value })} className={`mt-1 ${inputCls}`} autoFocus /></label>
              <label className={labelCls}>Phiên âm<input value={itemEditor.romanization} onChange={(e) => setItemEditor({ ...itemEditor, romanization: e.target.value })} placeholder="a / ka…" className={`mt-1 ${inputCls}`} /></label>
            </div>
            <ImageField value={itemEditor.imageUrl} onChange={(url) => setItemEditor({ ...itemEditor, imageUrl: url })} label="Ảnh minh họa" />
            <AudioField value={itemEditor.audioUrl} onChange={(url) => setItemEditor({ ...itemEditor, audioUrl: url })} label="Phát âm" />
            <label className={labelCls}>Ghi chú<textarea value={itemEditor.note} onChange={(e) => setItemEditor({ ...itemEditor, note: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
          </>
        )}
      </Modal>

      {/* Bulk modal */}
      <Modal
        open={bulkOpen}
        onClose={() => !saving && setBulkOpen(false)}
        title="Thêm ký tự hàng loạt"
        footer={
          <>
            <button onClick={() => setBulkOpen(false)} disabled={saving} className={btnGhost}>Hủy</button>
            <button onClick={runBulk} disabled={saving} className={btnPrimary}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Thêm</button>
          </>
        }
      >
        <p className="text-xs text-text-muted">Mỗi dòng một ký tự theo định dạng <code className="text-teal-300">ký_tự,phiên_âm</code>. Ví dụ:</p>
        <pre className="rounded-lg bg-[var(--bg-surface)] p-2 text-xs text-text-secondary">あ,a{'\n'}か,ka{'\n'}さ,sa</pre>
        <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8} placeholder="あ,a" className={inputCls} />
      </Modal>
    </div>
  );
}
