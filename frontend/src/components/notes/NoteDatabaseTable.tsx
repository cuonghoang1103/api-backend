'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CalendarDays, Check, Columns3, GanttChartSquare, LayoutGrid, Loader2, Plus, Rows3, Table2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  noteDatabaseApi,
  type NoteDatabaseFull,
  type NoteDatabaseProperty,
  type NoteDatabasePropertyType,
  type NoteDatabaseRow,
  type NoteDatabaseViewType,
  type NoteDatabaseSummary,
  fileApi,
} from '@/lib/api';
import { BoardView, CalendarView, GalleryView, ListView } from '@/components/notes/NoteDatabaseViews';
import TimelineView from '@/components/notes/NoteDatabaseTimeline';
import NoteDatabaseToolbar from '@/components/notes/NoteDatabaseToolbar';
import {
  applyViewConfig, parseViewConfig, EMPTY_VIEW_CONFIG, type ViewConfig,
} from '@/lib/noteDatabaseQuery';
import NoteDatabaseRowModal from '@/components/notes/NoteDatabaseRowModal';
import {
  asFiles, asPersonIds, asRelationIds, displayValue, editableValue, isReadOnlyType, needsCustomEditor,
  optionNames, outboundValue, personLabel, statusGroupOf, DEFAULT_STATUS_OPTIONS,
  ROLLUP_FUNCTION_LABEL,
  type CellContext, type DatabasePerson,
} from '@/lib/noteDatabaseValues';

interface Props {
  databaseId: number;
  canEdit: boolean;
  onDeleted?: (databaseId: number) => void;
}

const TYPE_LABEL: Record<NoteDatabasePropertyType, string> = {
  TITLE: 'Tiêu đề',
  TEXT: 'Văn bản',
  NUMBER: 'Số',
  SELECT: 'Một lựa chọn',
  MULTI_SELECT: 'Nhiều lựa chọn',
  DATE: 'Ngày',
  CHECKBOX: 'Ô đánh dấu',
  URL: 'Liên kết',
  STATUS: 'Trạng thái',
  PERSON: 'Người',
  EMAIL: 'Email',
  FILE: 'Tệp',
  CREATED_TIME: 'Ngày tạo',
  LAST_EDITED_TIME: 'Sửa lần cuối',
  RELATION: 'Quan hệ',
  ROLLUP: 'Tổng hợp',
  FORMULA: 'Công thức',
};

/* Màu chip trạng thái theo NHÓM, không theo tên tuỳ chọn: tên do người dùng
 * đặt ("Ship rồi", "Đã bàn giao") nên tra theo tên là không bao giờ đủ. */
const STATUS_CHIP: Record<'todo' | 'doing' | 'done', string> = {
  todo:  'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300',
  doing: 'bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
  done:  'bg-emerald-200 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200',
};

const NEW_COLUMN_TYPES: NoteDatabasePropertyType[] = [
  'TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'STATUS', 'DATE', 'CHECKBOX',
  'PERSON', 'URL', 'EMAIL', 'FILE', 'CREATED_TIME', 'LAST_EDITED_TIME',
  'RELATION', 'ROLLUP', 'FORMULA',
];

export default function NoteDatabaseTable({ databaseId, canEdit, onDeleted }: Props) {
  const [database, setDatabase] = useState<NoteDatabaseFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ rowId: number; propertyId: number } | null>(null);
  const [draft, setDraft] = useState('');
  const [viewType, setViewType] = useState<NoteDatabaseViewType>('TABLE');
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState<NoteDatabasePropertyType>('TEXT');
  // Cấu hình cho hai kiểu cột cần khai báo thêm lúc tạo.
  const [relationTarget, setRelationTarget] = useState<number | null>(null);
  const [rollupRelationId, setRollupRelationId] = useState<number | null>(null);
  const [rollupTargetId, setRollupTargetId] = useState<number | null>(null);
  const [rollupFn, setRollupFn] = useState<string>('count');
  const [formulaExpr, setFormulaExpr] = useState('');
  /** Các bảng khác trong cùng môn — nguồn để chọn bảng đích cho cột quan hệ. */
  const [siblingDatabases, setSiblingDatabases] = useState<NoteDatabaseSummary[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const res = await noteDatabaseApi.get(databaseId);
    setDatabase(res.data.data);
    return res.data.data;
  }, [databaseId]);

  /** The row the persisted view choice lives on. */
  const defaultView = useMemo(() => {
    const views = database?.views ?? [];
    return views.find((view) => view.isDefault) ?? views[0] ?? null;
  }, [database]);

  /**
   * Persist the view choice on the database's default view row.
   *
   * Without this the switcher was local state only: every reload dropped the
   * user back to the table, which reads as the setting not working at all.
   * The UI switches immediately and the write is fire-and-forget — a failed
   * save costs a preference, and blocking the switch on a round-trip would
   * make the tabs feel broken.
   */
  const chooseView = useCallback((type: NoteDatabaseViewType) => {
    setViewType(type);
    if (!canEdit || !defaultView || defaultView.type === type) return;
    setDatabase((current) => current && ({
      ...current,
      views: current.views.map((view) => (view.id === defaultView.id ? { ...view, type } : view)),
    }));
    void noteDatabaseApi.updateView(defaultView.id, { type }).catch(() => { /* preference only */ });
  }, [canEdit, defaultView]);

  useEffect(() => {
    setLoading(true);
    load()
      .then((loaded) => {
        // Restore the saved view instead of always landing on the table.
        const saved = loaded.views.find((view) => view.isDefault) ?? loaded.views[0];
        if (saved) setViewType(saved.type);
      })
      .catch(() => toast.error('Không tải được cơ sở dữ liệu'))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const properties = useMemo(
    () => (database?.properties ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [database],
  );

  /**
   * Danh sách người gán được — nạp LƯỜI, chỉ khi bảng thật sự có cột PERSON.
   *
   * Nạp vô điều kiện sẽ thêm một lượt gọi mạng cho mọi bảng, kể cả phần lớn
   * bảng không có cột nào cần tới nó.
   */
  const [people, setPeople] = useState<DatabasePerson[]>([]);
  const hasPersonColumn = properties.some((property) => property.type === 'PERSON');
  useEffect(() => {
    if (!hasPersonColumn) return;
    let alive = true;
    noteDatabaseApi.listPeople(databaseId)
      .then((res) => { if (alive) setPeople(res.data.data); })
      .catch(() => { /* ô người sẽ hiện "#id" — xem displayValue */ });
    return () => { alive = false; };
  }, [hasPersonColumn, databaseId]);
  const cellCtx: CellContext = useMemo(
    () => ({ people, relationLabels: database?.relationLabels ?? {} }),
    [people, database],
  );

  // Bảng khác trong cùng môn, để chọn đích cho cột quan hệ. Nạp khi người dùng
  // mở form thêm cột chứ không nạp lúc mở bảng.
  useEffect(() => {
    if (!addingColumn || !database || siblingDatabases.length > 0) return;
    noteDatabaseApi.listBySubject(database.subjectId)
      .then((res) => setSiblingDatabases(res.data.data))
      .catch(() => { /* ô chọn sẽ rỗng; người dùng đổi kiểu cột khác được */ });
  }, [addingColumn, database, siblingDatabases.length]);

  /**
   * Cấu hình lọc / sắp xếp / nhóm của khung nhìn mặc định.
   *
   * Giữ ở state riêng chứ không đọc thẳng `view.config` mỗi lần render: người
   * dùng gõ vào ô giá trị là mỗi ký tự một lần đổi, mà `database` chỉ được
   * thay sau một vòng gọi mạng — đọc thẳng thì ô nhập mất chữ giữa chừng mỗi
   * lần máy chủ trả lời chậm.
   */
  const [viewConfig, setViewConfig] = useState<ViewConfig>(EMPTY_VIEW_CONFIG);
  const configLoadedFor = useRef<number | null>(null);
  useEffect(() => {
    const current = database?.views?.find((v) => v.isDefault) ?? database?.views?.[0];
    // Nạp MỘT lần cho mỗi khung nhìn. Nạp lại sau mỗi `load()` sẽ ghi đè thứ
    // người dùng vừa gõ bằng bản đã lưu trước đó — và `load()` chạy sau mọi
    // lần sửa ô, tức là gần như liên tục.
    if (!current || configLoadedFor.current === current.id) return;
    configLoadedFor.current = current.id;
    setViewConfig(parseViewConfig(current.config));
  }, [database]);

  const configSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changeViewConfig = (next: ViewConfig) => {
    setViewConfig(next);
    const current = database?.views?.find((v) => v.isDefault) ?? database?.views?.[0];
    if (!current || !canEdit) return;
    if (configSaveTimer.current) clearTimeout(configSaveTimer.current);
    // Ghi trễ: kết quả lọc đã hiện tức thì vì lọc chạy ngay trong trình duyệt,
    // nên không có lý do gì bắn một PATCH cho mỗi phím gõ.
    configSaveTimer.current = setTimeout(() => {
      void noteDatabaseApi
        .updateView(current.id, { config: next as unknown as Record<string, unknown> })
        .catch(() => toast.error('Không lưu được bộ lọc'));
    }, 600);
  };

  const view = useMemo(
    () => applyViewConfig(database?.rows ?? [], properties, viewConfig, cellCtx),
    [database, properties, viewConfig, cellCtx],
  );

  /**
   * Cột ngày mà Dòng thời gian đang dùng.
   *
   * Lưu trong `config` của khung nhìn cùng chỗ với bộ lọc, nên mở lại vẫn đúng
   * cột. Đọc qua `viewConfig` chứ không giữ state riêng: hai nguồn sự thật cho
   * cùng một lựa chọn sẽ lệch nhau ngay lần nạp lại đầu tiên.
   *
   * Không chọn thì tự đoán cột ngày ĐẦU TIÊN. Bắt người dùng chọn trước khi
   * thấy được gì sẽ khiến khung nhìn này trông như hỏng ở lần mở đầu.
   */
  const firstDateProperty = properties.find((p) => p.type === 'DATE')?.id ?? null;
  const timelineStartId = viewConfig.timeline?.startPropertyId ?? firstDateProperty;
  const timelineEndId = viewConfig.timeline?.endPropertyId ?? null;

  const saveTimelineProperties = (next: { startPropertyId: number | null; endPropertyId: number | null }) => {
    changeViewConfig({ ...viewConfig, timeline: next });
  };

  /**
   * Ghi lại toàn bộ danh sách liên kết của một ô quan hệ.
   *
   * Cập nhật tại chỗ trước rồi mới `load()`: chip phải hiện/biến ngay khi bấm.
   * Phải `load()` lại chứ không dừng ở cập nhật tại chỗ, vì mọi cột ROLLUP
   * trỏ vào quan hệ này đều phải tính lại — và chỉ máy chủ tính được chúng.
   */
  const saveRelations = async (row: NoteDatabaseRow, property: NoteDatabaseProperty, next: number[]) => {
    setDatabase((current) => current && ({
      ...current,
      rows: current.rows.map((r) => (r.id === row.id ? { ...r, values: { ...r.values, [property.id]: next } } : r)),
    }));
    try {
      await noteDatabaseApi.setRowRelations(row.id, property.id, next);
      await load();
    } catch {
      toast.error('Không lưu được liên kết');
      await load();
    }
  };

  /** Ghi ngày mới sau khi kéo một thanh trên Dòng thời gian. */
  const moveTimelineRow = async (rowId: number, next: { start: string; end: string | null }) => {
    if (timelineStartId === null) return;
    const values: Record<number, unknown> = { [timelineStartId]: next.start };
    if (timelineEndId !== null && next.end !== null) values[timelineEndId] = next.end;

    // Cập nhật ngay tại chỗ TRƯỚC khi gọi mạng: thanh vừa được thả phải nằm
    // yên ở chỗ mới. Đợi máy chủ trả lời thì nó bật ngược về vị trí cũ một
    // nhịp rồi mới nhảy tới — trông như thao tác đã hỏng.
    setDatabase((current) => current && ({
      ...current,
      rows: current.rows.map((row) => (row.id === rowId ? { ...row, values: { ...row.values, ...values } } : row)),
    }));

    try {
      await noteDatabaseApi.updateRow(rowId, values as never);
    } catch {
      toast.error('Không lưu được ngày mới');
      await load();   // trả về đúng trạng thái máy chủ, không để lại thay đổi ảo
    }
  };

  const commitCell = async (row: NoteDatabaseRow, property: NoteDatabaseProperty, raw: string) => {
    setEditing(null);
    // Cột tính ra thì máy chủ bỏ qua mọi lượt ghi — chặn ngay ở đây để không
    // bắn một lượt gọi mạng chỉ để nhận lại đúng giá trị cũ.
    if (isReadOnlyType(property.type)) return;
    const next = outboundValue(property, raw, cellCtx);
    const previous = row.values[property.id] ?? null;
    if (JSON.stringify(next) === JSON.stringify(previous)) return;

    // Optimistic: the grid should not flicker on every keystroke commit.
    setDatabase((current) => current && ({
      ...current,
      rows: current.rows.map((item) => (
        item.id === row.id
          ? { ...item, values: { ...item.values, [property.id]: next } }
          : item
      )),
    }));
    try {
      const res = await noteDatabaseApi.updateRow(row.id, { [property.id]: next });
      const saved = res.data.data;
      setDatabase((current) => current && ({
        ...current,
        rows: current.rows.map((item) => (item.id === row.id ? { ...item, values: saved.values } : item)),
      }));
    } catch (error) {
      // The server rejects bad numbers, unknown options and non-http URLs.
      // Roll the cell back so the grid never shows a value that was refused.
      setDatabase((current) => current && ({
        ...current,
        rows: current.rows.map((item) => (
          item.id === row.id
            ? { ...item, values: { ...item.values, [property.id]: previous } }
            : item
        )),
      }));
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || 'Giá trị không hợp lệ');
    }
  };

  const addRow = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await noteDatabaseApi.createRow(databaseId);
      setDatabase((current) => current && ({ ...current, rows: [...current.rows, res.data.data] }));
    } catch { toast.error('Không thêm được dòng'); }
    finally { setBusy(false); }
  };

  const removeRow = async (rowId: number) => {
    if (!window.confirm('Xoá dòng này?')) return;
    try {
      await noteDatabaseApi.deleteRow(rowId);
      setDatabase((current) => current && ({ ...current, rows: current.rows.filter((r) => r.id !== rowId) }));
    } catch { toast.error('Không xoá được dòng'); }
  };

  const addColumn = async () => {
    const name = columnName.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      // Cột STATUS sinh ra kèm ba tuỳ chọn mặc định. Cột trạng thái RỖNG là
      // vô dụng: người dùng phải tự nghĩ ra tên nhóm và tự gán `group`, mà
      // `group` mới là thứ khiến STATUS khác SELECT.
      // Cột quan hệ chưa chọn bảng đích là cột chết: máy chủ sẽ từ chối mọi
      // lượt ghi liên kết vào nó. Chặn ngay để người dùng không tạo ra rồi
      // mới phát hiện.
      if (columnType === 'RELATION' && relationTarget === null) {
        toast.error('Chọn bảng đích cho cột quan hệ');
        setBusy(false);
        return;
      }
      if (columnType === 'FORMULA' && !formulaExpr.trim()) {
        toast.error('Nhập biểu thức cho cột công thức');
        setBusy(false);
        return;
      }
      if (columnType === 'ROLLUP' && rollupRelationId === null) {
        toast.error('Chọn cột quan hệ để tổng hợp qua đó');
        setBusy(false);
        return;
      }
      await noteDatabaseApi.createProperty(databaseId, {
        name,
        type: columnType,
        ...(columnType === 'STATUS' ? { config: { options: DEFAULT_STATUS_OPTIONS } } : {}),
        ...(columnType === 'RELATION' ? { config: { targetDatabaseId: relationTarget } } : {}),
        ...(columnType === 'ROLLUP' ? {
          config: { relationPropertyId: rollupRelationId, targetPropertyId: rollupTargetId, fn: rollupFn },
        } : {}),
        ...(columnType === 'FORMULA' ? { config: { expression: formulaExpr } } : {}),
      });
      setColumnName('');
      setAddingColumn(false);
      await load();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Không thêm được cột');
    } finally { setBusy(false); }
  };

  const removeColumn = async (property: NoteDatabaseProperty) => {
    if (!window.confirm(`Xoá cột "${property.name}"? Mọi giá trị trong cột sẽ mất.`)) return;
    try {
      await noteDatabaseApi.deleteProperty(property.id);
      await load();
    } catch { toast.error('Không xoá được cột'); }
  };

  const removeDatabase = async () => {
    if (!database) return;
    if (!window.confirm(`Xoá bảng "${database.title}"? Không thể hoàn tác.`)) return;
    try {
      await noteDatabaseApi.remove(database.id);
      onDeleted?.(database.id);
      toast.success('Đã xoá bảng');
    } catch { toast.error('Không xoá được bảng'); }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }
  if (!database) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-white/[0.02]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/[0.07]">
        <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Table2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{database.icon ? `${database.icon} ` : ''}{database.title}</span>
          <span className="shrink-0 text-[11px] font-normal text-slate-500">{database.rows.length} dòng</span>
          {/* Máy chủ chạm trần quét: số ở trên là số đếm trên phần ĐÃ ĐỌC.
              Im lặng ở đây nghĩa là bảng hiện đúng 5.000 dòng và người dùng
              tin đó là tất cả — lọc trên tập đã cắt cho kết quả sai mà trông
              hợp lý. */}
          {database.truncated && (
            <span
              role="status"
              title="Bảng vượt 5.000 dòng. Số liệu và bộ lọc chỉ tính trên 5.000 dòng đầu."
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-200"
            >
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Mới đọc 5.000 dòng đầu
            </span>
          )}
        </h3>
        <div className="flex items-center gap-1">
          {/* Cả sáu khung nhìn đọc số dòng đã có sẵn trong state — đổi khung
              nhìn không tốn một lượt gọi nào và không thể hiện ra một bản sao
              cũ của dữ liệu. */}
          <div role="tablist" aria-label="Kiểu hiển thị" className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-white/[0.05]">
            {([
              ['TABLE', 'Bảng', Table2],
              ['BOARD', 'Kanban', Columns3],
              ['GALLERY', 'Thẻ', LayoutGrid],
              ['CALENDAR', 'Lịch', CalendarDays],
              ['TIMELINE', 'Dòng thời gian', GanttChartSquare],
              ['LIST', 'Danh sách', Rows3],
            ] as const).map(([type, label, Icon]) => (
              <button
                key={type}
                role="tab"
                aria-selected={viewType === type}
                onClick={() => chooseView(type)}
                title={label}
                className={`flex h-8 w-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  viewType === type
                    ? 'bg-white text-teal-600 shadow-sm dark:bg-white/[0.12] dark:text-teal-300'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </button>
            ))}
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={removeDatabase}
              className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-[11px] text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Xoá bảng
            </button>
          )}
        </div>
      </header>

      <NoteDatabaseToolbar
        properties={properties}
        config={viewConfig}
        onChange={changeViewConfig}
        shown={view.rows.length}
        total={database.rows.length}
        canEdit={canEdit}
      />

      {/* Mọi khung nhìn đọc `view.rows` — bản ĐÃ lọc và ĐÃ sắp xếp — chứ không
          đọc `database.rows` thô. Để mỗi khung nhìn tự lọc lấy sẽ là bốn bản
          sao của cùng một luật, và chỗ nào quên thì bộ lọc lặng lẽ không có
          tác dụng ở đúng khung nhìn đó.

          `visibleProperties` cũng vậy: ẩn cột phải ăn ở cả Board và Gallery,
          nếu không thì cột đã ẩn vẫn hiện trên thẻ. */}
      {viewType !== 'TABLE' && (
        viewType === 'BOARD'
          ? (
            <BoardView
              properties={view.visibleProperties}
              rows={view.rows}
              onOpenRow={setOpenRowId}
              // Nhóm đã chọn ở thanh công cụ điều khiển luôn cột của Board:
              // hai chỗ cùng nói "nhóm theo" mà cho ra hai kết quả khác nhau
              // là thứ không ai đoán nổi.
              {...(viewConfig.groupPropertyId !== null ? { groupPropertyId: viewConfig.groupPropertyId } : {})}
            />
          )
          : viewType === 'GALLERY' ? <GalleryView properties={view.visibleProperties} rows={view.rows} onOpenRow={setOpenRowId} />
            : viewType === 'LIST' ? <ListView properties={view.visibleProperties} rows={view.rows} onOpenRow={setOpenRowId} />
              : viewType === 'TIMELINE' ? (
                <TimelineView
                  properties={view.visibleProperties}
                  rows={view.rows}
                  onOpenRow={setOpenRowId}
                  startPropertyId={timelineStartId}
                  endPropertyId={timelineEndId}
                  onPickProperties={saveTimelineProperties}
                  // Chỉ trao khả năng kéo khi người dùng có quyền sửa. Thiếu
                  // điều kiện này thì người chỉ-xem kéo được thanh, thấy nó
                  // dịch đi, rồi mất thay đổi lúc tải lại — tệ hơn hẳn so với
                  // không kéo được ngay từ đầu.
                  {...(canEdit ? { onMoveRow: moveTimelineRow } : {})}
                />
              )
                : <CalendarView properties={view.visibleProperties} rows={view.rows} onOpenRow={setOpenRowId} />
      )}

      {/* A card in Kanban/Gallery/Calendar has nowhere to put a row of
          inputs, so opening one leads here. */}
      {openRowId !== null && (() => {
        const target = database.rows.find((row) => row.id === openRowId);
        if (!target) return null;
        return (
          <NoteDatabaseRowModal
            properties={properties}
            row={target}
            canEdit={canEdit}
            onSaved={(saved) => setDatabase((current) => current && ({
              ...current,
              rows: current.rows.map((row) => (row.id === saved.id ? { ...row, values: saved.values } : row)),
            }))}
            onDeleted={(rowId) => setDatabase((current) => current && ({
              ...current,
              rows: current.rows.filter((row) => row.id !== rowId),
            }))}
            onClose={() => setOpenRowId(null)}
          />
        );
      })()}

      {/* Wide tables scroll inside their own box; the page never scrolls sideways. */}
      {viewType === 'TABLE' && (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/[0.07]">
              {view.visibleProperties.map((property) => (
                <th
                  key={property.id}
                  scope="col"
                  className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  <span className="flex items-center gap-1">
                    <span className="truncate">{property.name}</span>
                    <span className="font-normal normal-case text-slate-400">· {TYPE_LABEL[property.type]}</span>
                    {canEdit && !property.isTitle && (
                      <button
                        type="button"
                        onClick={() => removeColumn(property)}
                        aria-label={`Xoá cột ${property.name}`}
                        className="ml-0.5 text-slate-400 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    )}
                  </span>
                </th>
              ))}
              {canEdit && <th scope="col" className="w-10 px-2 py-2"><span className="sr-only">Hành động</span></th>}
            </tr>
          </thead>
          <tbody>
            {/* Khi có nhóm, chèn một hàng tiêu đề trước mỗi cụm. Dựng danh
                sách phẳng kèm mốc nhóm thay vì lồng nhiều <tbody>: nhiều
                <tbody> làm chiều rộng cột được tính LẠI cho từng khối, nên
                các cụm không thẳng hàng với nhau. */}
            {(view.groups
              ? view.groups.flatMap((group) => [
                  { kind: 'group' as const, key: `g-${group.key}`, label: group.label, count: group.rows.length },
                  ...group.rows.map((row) => ({ kind: 'row' as const, key: `r-${row.id}`, row })),
                ])
              : view.rows.map((row) => ({ kind: 'row' as const, key: `r-${row.id}`, row }))
            ).map((entry) => entry.kind === 'group' ? (
              <tr key={entry.key} className="bg-slate-50 dark:bg-white/[0.03]">
                <td
                  colSpan={view.visibleProperties.length + (canEdit ? 1 : 0)}
                  className="px-3 py-1.5 text-[11.5px] font-semibold text-slate-600 dark:text-slate-300"
                >
                  {entry.label}
                  <span className="ml-1.5 font-normal text-slate-400">{entry.count}</span>
                </td>
              </tr>
            ) : (() => {
              const row = entry.row;
              return (
              <tr key={entry.key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-white/[0.04] dark:hover:bg-white/[0.02]">
                {view.visibleProperties.map((property) => {
                  const isEditing = editing?.rowId === row.id && editing.propertyId === property.id;
                  const value = row.values[property.id] ?? null;

                  if (property.type === 'CHECKBOX') {
                    return (
                      <td key={property.id} className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          disabled={!canEdit}
                          onChange={(event) => commitCell(row, property, event.target.checked ? 'true' : '')}
                          aria-label={property.name}
                          className="h-4 w-4 accent-teal-600"
                        />
                      </td>
                    );
                  }

                  /* Cột TÍNH RA: chữ thường, không bấm được. Để nguyên nút
                     bấm sẽ mời người dùng sửa một thứ máy chủ luôn ghi đè —
                     họ gõ, thấy giá trị cũ quay lại, và tưởng lưu bị hỏng. */
                  if (isReadOnlyType(property.type)) {
                    return (
                      <td key={property.id} className="px-3 py-2 align-top">
                        <span className="block min-h-7 px-1 py-0.5 text-slate-500 dark:text-slate-400">
                          {displayValue(property, value, cellCtx) || '—'}
                        </span>
                      </td>
                    );
                  }

                  /* QUAN HỆ: chip cho các dòng đã nối, cộng một ô chọn thêm.
                     Không dùng ô nhập chữ như PERSON được: bảng đích có thể
                     hàng trăm dòng và tên trùng nhau, nên phải chọn theo id
                     chứ không đối chiếu theo tên. */
                  if (property.type === 'RELATION') {
                    const linked = asRelationIds(value);
                    const labels = database.relationLabels ?? {};
                    return (
                      <td key={property.id} className="px-3 py-2 align-top">
                        <div className="flex flex-wrap items-center gap-1">
                          {linked.map((id) => (
                            <span key={id} className="inline-flex items-center gap-1 rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200">
                              <span className="max-w-[9rem] truncate">{labels[String(id)] ?? `#${id}`}</span>
                              {canEdit && (
                                <button
                                  type="button"
                                  aria-label="Bỏ liên kết"
                                  onClick={() => void saveRelations(row, property, linked.filter((x) => x !== id))}
                                  className="text-indigo-500 hover:text-rose-500"
                                >
                                  <X className="h-2.5 w-2.5" aria-hidden="true" />
                                </button>
                              )}
                            </span>
                          ))}
                          {canEdit && (
                            <RelationPicker
                              propertyId={property.id}
                              exclude={linked}
                              onPick={(id) => void saveRelations(row, property, [...linked, id])}
                            />
                          )}
                          {linked.length === 0 && !canEdit && <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </div>
                      </td>
                    );
                  }

                  /* FILE: không sửa được bằng ô nhập chữ, nên nó có nhánh
                     riêng — chip cho tệp đã có, cộng một nút tải lên. */
                  if (property.type === 'FILE') {
                    const files = asFiles(value);
                    return (
                      <td key={property.id} className="px-3 py-2 align-top">
                        <div className="flex flex-wrap items-center gap-1">
                          {files.map((file) => (
                            <a
                              key={file.url}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="max-w-[10rem] truncate rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
                            >
                              {file.name || file.url}
                            </a>
                          ))}
                          {canEdit && (
                            <label className="cursor-pointer rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
                              + Tệp
                              <input
                                type="file"
                                hidden
                                onChange={async (event) => {
                                  // `Array.from` NGAY tại đây: `files` là danh
                                  // sách SỐNG và dòng reset value bên dưới xoá
                                  // sạch nó.
                                  const picked = Array.from(event.target.files ?? []);
                                  event.target.value = '';
                                  const file = picked[0];
                                  if (!file) return;
                                  try {
                                    const res = await fileApi.upload(file, 'documents');
                                    const url = (res.data as { data?: { url?: string } })?.data?.url;
                                    if (!url) throw new Error('khong co url');
                                    await noteDatabaseApi.updateRow(row.id, {
                                      [property.id]: [
                                        ...files,
                                        { url, name: file.name, size: file.size, mime: file.type },
                                      ],
                                    } as never);
                                    await load();
                                  } catch {
                                    toast.error('Không tải được tệp lên');
                                  }
                                }}
                              />
                            </label>
                          )}
                          {files.length === 0 && !canEdit && <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={property.id} className="px-3 py-2 align-top">
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type={property.type === 'DATE' ? 'date' : property.type === 'NUMBER' ? 'text' : 'text'}
                          inputMode={property.type === 'NUMBER' ? 'decimal' : undefined}
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onBlur={() => commitCell(row, property, draft)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') { event.preventDefault(); commitCell(row, property, draft); }
                            if (event.key === 'Escape') setEditing(null);
                          }}
                          list={property.config?.options ? `opts-${property.id}` : undefined}
                          className="w-full min-w-[7rem] rounded border border-teal-500 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none dark:bg-black/30 dark:text-slate-100"
                        />
                      ) : (
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => { setEditing({ rowId: row.id, propertyId: property.id }); setDraft(editableValue(property, value, cellCtx)); }}
                          className="min-h-7 w-full truncate rounded px-1 py-0.5 text-left text-slate-800 hover:bg-slate-100 disabled:cursor-default disabled:hover:bg-transparent dark:text-slate-200 dark:hover:bg-white/[0.05]"
                        >
                          {property.type === 'URL' && value ? (
                            <span className="text-teal-600 underline dark:text-teal-300">{displayValue(property, value, cellCtx)}</span>
                          ) : (
                            property.type === 'STATUS' && value ? (
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CHIP[statusGroupOf(property, value) ?? 'todo']}`}>
                                {String(value)}
                              </span>
                            ) : (
                              displayValue(property, value, cellCtx) || <span className="text-slate-300 dark:text-slate-600">—</span>
                            )
                          )}
                        </button>
                      )}
                      {optionNames(property).length > 0 && (
                        <datalist id={`opts-${property.id}`}>
                          {optionNames(property).map((option) => <option key={option} value={option} />)}
                        </datalist>
                      )}
                    </td>
                  );
                })}
                {canEdit && (
                  <td className="px-2 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label="Xoá dòng"
                      className="text-slate-400 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </td>
                )}
              </tr>
              );
            })())}
            {view.rows.length === 0 && (
              <tr>
                <td colSpan={view.visibleProperties.length + (canEdit ? 1 : 0)} className="px-3 py-6 text-center text-sm text-slate-500">
                  {/* Phân biệt "bảng rỗng" với "bộ lọc giấu hết": hai chuyện
                      trông giống hệt nhau trên màn hình nhưng cách xử lý ngược
                      nhau — một bên là thêm dòng, một bên là bỏ lọc. */}
                  {database.rows.length === 0 ? 'Chưa có dòng nào.' : 'Không dòng nào khớp bộ lọc.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {viewType === 'TABLE' && canEdit && (
        <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-white/[0.07]">
          <button
            type="button"
            onClick={addRow}
            disabled={busy}
            className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-white/[0.05]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Thêm dòng
          </button>

          {addingColumn ? (
            <span className="flex flex-wrap items-center gap-1">
              <label htmlFor="new-col-name" className="sr-only">Tên cột mới</label>
              <input
                id="new-col-name"
                value={columnName}
                onChange={(event) => setColumnName(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addColumn(); } if (event.key === 'Escape') setAddingColumn(false); }}
                placeholder="Tên cột"
                className="min-h-9 w-32 rounded border border-slate-300 px-2 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
              />
              <label htmlFor="new-col-type" className="sr-only">Kiểu cột</label>
              <select
                id="new-col-type"
                value={columnType}
                onChange={(event) => setColumnType(event.target.value as NoteDatabasePropertyType)}
                className="min-h-9 rounded border border-slate-300 px-1 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
              >
                {NEW_COLUMN_TYPES.map((type) => <option key={type} value={type}>{TYPE_LABEL[type]}</option>)}
              </select>

              {/* Hai kiểu cột dưới đây VÔ DỤNG nếu thiếu cấu hình, nên hỏi
                  ngay tại đây thay vì tạo cột rỗng rồi bắt người dùng đi tìm
                  chỗ cấu hình sau. */}
              {columnType === 'RELATION' && (
                <select
                  aria-label="Bảng đích"
                  value={relationTarget ?? ''}
                  onChange={(e) => setRelationTarget(e.target.value === '' ? null : Number(e.target.value))}
                  className="min-h-9 rounded border border-slate-300 px-1 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                >
                  <option value="">— bảng đích —</option>
                  {siblingDatabases.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              )}

              {columnType === 'FORMULA' && (
                <input
                  aria-label="Biểu thức"
                  value={formulaExpr}
                  onChange={(e) => setFormulaExpr(e.target.value)}
                  placeholder='if(prop("Trạng thái") == "Xong", "✅", "⏳")'
                  className="min-h-9 w-72 rounded border border-slate-300 px-2 font-mono text-[11px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                />
              )}

              {columnType === 'ROLLUP' && (
                <>
                  <select
                    aria-label="Qua cột quan hệ"
                    value={rollupRelationId ?? ''}
                    onChange={(e) => setRollupRelationId(e.target.value === '' ? null : Number(e.target.value))}
                    className="min-h-9 rounded border border-slate-300 px-1 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                  >
                    <option value="">— qua quan hệ —</option>
                    {properties.filter((p) => p.type === 'RELATION').map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select
                    aria-label="Phép tổng hợp"
                    value={rollupFn}
                    onChange={(e) => setRollupFn(e.target.value)}
                    className="min-h-9 rounded border border-slate-300 px-1 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                  >
                    {Object.entries(ROLLUP_FUNCTION_LABEL).map(([fn, label]) => <option key={fn} value={fn}>{label}</option>)}
                  </select>
                  {/* Cột bên bảng đích. `count` không cần, nên ô này chỉ hiện
                      khi phép tổng hợp thật sự đọc dữ liệu. */}
                  {rollupFn !== 'count' && (
                    <input
                      aria-label="Id cột bên bảng đích"
                      value={rollupTargetId ?? ''}
                      onChange={(e) => setRollupTargetId(e.target.value === '' ? null : Number(e.target.value))}
                      placeholder="id cột đích"
                      inputMode="numeric"
                      className="min-h-9 w-24 rounded border border-slate-300 px-2 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                    />
                  )}
                </>
              )}
              <button type="button" onClick={addColumn} disabled={busy || !columnName.trim()} aria-label="Lưu cột mới" className="flex h-9 w-9 items-center justify-center rounded-md text-teal-600 hover:bg-teal-50 disabled:opacity-40 dark:hover:bg-teal-500/10">
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setAddingColumn(false)} aria-label="Huỷ" className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.05]">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAddingColumn(true)}
              className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-white/[0.05]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Thêm cột
            </button>
          )}
        </footer>
      )}
    </section>
  );
}

/**
 * Ô chọn một dòng bên bảng đích để nối vào.
 *
 * Nạp danh sách LƯỜI — chỉ khi người dùng bấm mở. Một bảng có 200 dòng, mỗi
 * dòng một cột quan hệ, sẽ là 200 lượt gọi ngay lúc mở bảng nếu nạp sẵn.
 *
 * `exclude` bỏ những dòng đã nối: hiện lại chúng chỉ tạo cơ hội bấm nhầm rồi
 * chẳng có gì xảy ra (máy chủ khử trùng lặp), và người dùng không hiểu vì sao.
 */
function RelationPicker({
  propertyId, exclude, onPick,
}: {
  propertyId: number;
  exclude: number[];
  onPick: (rowId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ id: number; label: string }[] | null>(null);

  const openPicker = () => {
    setOpen(true);
    if (options !== null) return;
    noteDatabaseApi.listRelationOptions(propertyId)
      .then((res) => setOptions(res.data.data))
      .catch(() => setOptions([]));
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPicker}
        aria-label="Nối tới một dòng"
        className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
      >
        + Nối
      </button>
    );
  }

  const available = (options ?? []).filter((o) => !exclude.includes(o.id));
  return (
    <select
      autoFocus
      aria-label="Chọn dòng để nối"
      defaultValue=""
      onBlur={() => setOpen(false)}
      onChange={(event) => {
        const id = Number(event.target.value);
        setOpen(false);
        if (Number.isInteger(id) && id > 0) onPick(id);
      }}
      className="min-h-6 rounded border border-slate-300 bg-white px-1 text-[11px] dark:border-white/[0.12] dark:bg-black/30 dark:text-slate-100"
    >
      <option value="">
        {options === null ? 'Đang tải…' : available.length === 0 ? 'Không còn dòng nào' : '— chọn —'}
      </option>
      {available.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}
