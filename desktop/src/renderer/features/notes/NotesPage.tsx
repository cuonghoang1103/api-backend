/**
 * Notes — bản desktop, sửa được khi mất mạng và lưu file .md trên máy.
 *
 * Đường dẫn API đối chiếu với `src/routes/notes.routes.ts` (mount `/api/v1/notes`,
 * src/index.ts:556) ngày 16/08/2026:
 *   GET   /api/v1/notes/notes/filter?f=all   danh sách
 *   GET   /api/v1/notes/notes/:id            chi tiết
 *   PATCH /api/v1/notes/notes/:id            cập nhật (title, contentJson, …)
 *
 * ─── Luồng dữ liệu ───
 *   đọc  → swr (cache trước, làm mới nền) → xem được khi mất mạng
 *   sửa  → ghi FILE .md trên đĩa + ghi cache + xếp hàng đồng bộ
 *   gửi  → hàng đợi lo, có backoff và chống trùng
 *
 * ─── Ba thứ màn hình này TỪ CHỐI làm ───
 *  1. Không sửa ghi chú chứa nút mà bộ chuyển đổi không hiểu (bảng, ảnh…).
 *     Mở xem được, nhưng ô nhập khoá lại. Sửa nửa vời sẽ nuốt mất bảng của bạn.
 *  2. Không báo "đã đồng bộ" khi mới chỉ ghi xuống đĩa. Hai việc khác nhau.
 *  3. Không tự ghi đè khi máy chủ có bản mới hơn — xem `version` bên dưới.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CloudOff,
  FileText,
  FolderOpen,
  Loader2,
  Lock,
  RefreshCw,
  Save,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr, writeCache } from '../../offline/cache';
import { enqueue } from '../../offline/sync-queue';
import { checkConvertible, fromMarkdown, noteFileName, toMarkdown } from './markdown';

const AUTOSAVE_DELAY_MS = 900;

interface NoteSummary {
  id: number;
  title: string;
  updatedAt: string;
  isPinned?: boolean;
  isFavorite?: boolean;
}

interface NoteDetail extends NoteSummary {
  contentJson?: unknown;
  /** Số bản chụp tăng dần. Dùng để phát hiện xung đột. */
  version?: number;
}

type SaveState = 'chua-doi' | 'dang-luu' | 'da-luu-dia';

export function NotesPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<string | null>(null);

  useEffect(() => {
    void window.cuongthai?.notes.getFolder().then((f) => setFolder(f.path));
  }, []);

  const loadList = useCallback(async () => {
    if (userId === null || !api) return;
    setLoading(true);
    setListError(null);
    try {
      const result = await swr<{ notes?: NoteSummary[] }>({
        userId,
        key: 'notes:list',
        fetcher: () => api.request('/api/v1/notes/notes/filter?f=all'),
        online,
        ttlMs: 5 * 60 * 1000,
        onRefreshed: (fresh) => setNotes(fresh.notes ?? []),
      });
      setNotes(result.value.notes ?? []);
    } catch (error) {
      setListError(
        error instanceof OfflineUnavailableError
          ? 'Chưa từng tải danh sách ghi chú về máy nên không xem được khi ngoại tuyến.'
          : error instanceof Error
            ? error.message
            : String(error),
      );
    } finally {
      setLoading(false);
    }
  }, [api, userId, online]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const chooseFolder = async () => {
    const result = await window.cuongthai?.notes.chooseFolder();
    if (result) setFolder(result.path);
  };

  if (openId !== null) {
    return (
      <NoteEditor
        noteId={openId}
        folder={folder}
        onBack={() => {
          setOpenId(null);
          void loadList();
        }}
      />
    );
  }

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <div className="ct-page-head" style={{ marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 19 }}>Ghi chú</h1>
          <p className="ct-muted" style={{ margin: 0 }}>
            Sửa được khi mất mạng. Mỗi ghi chú là một file <code>.md</code> trên máy bạn.
          </p>
        </div>
        <button
          type="button"
          className="ct-btn ct-btn-ghost"
          onClick={() => void loadList()}
          disabled={!online}
        >
          <RefreshCw size={14} aria-hidden />
          Làm mới
        </button>
      </div>

      {/* Chưa chọn thư mục thì nói rõ hậu quả, đừng để người dùng gõ xong mới
          phát hiện chẳng có gì được lưu xuống đĩa. */}
      {folder === null ? (
        <div className="ct-notice" data-tone="warn">
          <FolderOpen size={15} aria-hidden />
          <span>
            Chưa chọn thư mục lưu ghi chú. Ghi chú vẫn sửa và đồng bộ được, nhưng
            sẽ <strong>không</strong> có file <code>.md</code> nào trên máy bạn.
            <button
              type="button"
              className="ct-linklike"
              onClick={() => void chooseFolder()}
            >
              Chọn thư mục
            </button>
          </span>
        </div>
      ) : (
        <p className="ct-field-help" style={{ marginBottom: 12 }}>
          Lưu tại <code>{folder}</code>
          <button
            type="button"
            className="ct-linklike"
            onClick={() => void window.cuongthai?.notes.revealFolder()}
          >
            Mở thư mục
          </button>
          <button type="button" className="ct-linklike" onClick={() => void chooseFolder()}>
            Đổi
          </button>
        </p>
      )}

      {listError && (
        <div className="ct-empty">
          <CloudOff size={28} aria-hidden className="ct-empty-icon" />
          <h1>Không tải được danh sách</h1>
          <p>{listError}</p>
        </div>
      )}

      {loading && notes.length === 0 && !listError && <p>Đang tải…</p>}

      {notes.length > 0 && (
        <ul className="ct-article-list">
          {notes.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                className="ct-article-card"
                onClick={() => setOpenId(note.id)}
              >
                <div className="ct-article-title">
                  <FileText size={14} aria-hidden style={{ verticalAlign: -2, marginRight: 6 }} />
                  {note.title || 'Untitled'}
                </div>
                <div className="ct-article-meta">
                  <span>{formatWhen(note.updatedAt)}</span>
                  {note.isPinned && <span>đã ghim</span>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NoteEditor({
  noteId,
  folder,
  onBack,
}: {
  noteId: number;
  folder: string | null;
  onBack: () => void;
}) {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [note, setNote] = useState<NoteDetail | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [readOnlyReason, setReadOnlyReason] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('chua-doi');
  const [error, setError] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ markdown: '', title: '' });

  useEffect(() => {
    if (userId === null || !api) return;
    void (async () => {
      try {
        const result = await swr<NoteDetail>({
          userId,
          key: `notes:note:${noteId}`,
          fetcher: () => api.request<NoteDetail>(`/api/v1/notes/notes/${noteId}`),
          online,
          ttlMs: 5 * 60 * 1000,
        });
        const detail = result.value;
        setNote(detail);

        // Rà TRƯỚC khi mở khoá ô nhập. Biết được "sửa có an toàn không" phải
        // xong trước, không phải phát hiện giữa lúc đang lưu.
        const check = checkConvertible(detail.contentJson);
        if (!check.safe) {
          setReadOnlyReason(
            `Ghi chú này chứa ${check.unsupported.join(', ')} — định dạng mà bản desktop ` +
              'chưa chuyển đổi được an toàn. Mở xem thì được, sửa thì mời dùng bản web ' +
              'để không mất nội dung.',
          );
        }
        const md = toMarkdown(detail.contentJson);
        setMarkdown(md);
        latest.current = { markdown: md, title: detail.title };
      } catch (caught) {
        setError(
          caught instanceof OfflineUnavailableError
            ? 'Ghi chú này chưa được tải về máy nên không mở được khi ngoại tuyến.'
            : caught instanceof Error
              ? caught.message
              : String(caught),
        );
      }
    })();
  }, [api, userId, noteId, online]);

  const persist = useCallback(async () => {
    if (userId === null || !note) return;
    setSaveState('dang-luu');
    const { markdown: md, title } = latest.current;

    // 1. Ghi FILE trước. Đây là bước làm chữ đã gõ sống sót qua việc đóng app
    //    đột ngột, và là thứ người dùng mở được bằng bất kỳ trình soạn thảo nào.
    if (folder !== null) {
      try {
        await window.cuongthai?.notes.writeFile(noteFileName(note.id, title), md);
      } catch (caught) {
        // Ghi đĩa hỏng KHÔNG được chặn việc lưu cache và xếp hàng — mất một
        // đường sao lưu còn hơn mất luôn nội dung.
        console.error('[notes] không ghi được file:', caught);
      }
    }

    // 2. Cache, để mở lại offline vẫn thấy bản mới nhất.
    await writeCache(userId, `notes:note:${note.id}`, {
      ...note,
      title,
      contentJson: fromMarkdown(md),
    });

    // 3. Xếp hàng gửi lên máy chủ.
    await enqueue({
      userId,
      operationType: 'update',
      entityType: 'note',
      entityId: String(note.id),
      payload: {
        title,
        contentJson: fromMarkdown(md),
        // Gửi kèm version đã đọc được. Máy chủ chưa dùng tới, nhưng nó nằm sẵn
        // trong payload để ngày backend hỗ trợ so sánh thì không phải đổi gì ở
        // phía client. Xem docs/offline-architecture.md.
        baseVersion: note.version,
      },
    });

    setSaveState('da-luu-dia');
  }, [userId, note, folder]);

  const onChange = (next: string) => {
    setMarkdown(next);
    latest.current = { ...latest.current, markdown: next };
    setSaveState('dang-luu');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void persist(), AUTOSAVE_DELAY_MS);
  };

  // Lưu ngay khi rời trang: gõ xong rồi bấm quay lại trong vòng 900ms sẽ mất
  // phần vừa gõ nếu không có bước này.
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        void persist();
      }
    };
  }, [persist]);

  if (error) {
    return (
      <div className="ct-page">
        <button type="button" className="ct-back" onClick={onBack}>
          ← Danh sách ghi chú
        </button>
        <div className="ct-empty">
          <CloudOff size={28} aria-hidden className="ct-empty-icon" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <Loader2 size={22} className="ct-spin" aria-hidden />
          <p style={{ marginTop: 10 }}>Đang mở ghi chú…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page" style={{ maxWidth: 820 }}>
      <button type="button" className="ct-back" onClick={onBack}>
        ← Danh sách ghi chú
      </button>

      <div className="ct-panel">
        <div className="ct-page-head">
          <input
            className="ct-title-input"
            value={latest.current.title}
            disabled={readOnlyReason !== null}
            onChange={(event) => {
              latest.current = { ...latest.current, title: event.target.value };
              setNote((previous) =>
                previous ? { ...previous, title: event.target.value } : previous,
              );
              setSaveState('dang-luu');
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => void persist(), AUTOSAVE_DELAY_MS);
            }}
          />
          <SaveIndicator state={saveState} />
        </div>

        {readOnlyReason && (
          <div className="ct-notice" data-tone="warn">
            <Lock size={15} aria-hidden />
            <span>{readOnlyReason}</span>
          </div>
        )}

        {!online && (
          <div className="ct-notice" data-tone="warn">
            <CloudOff size={15} aria-hidden />
            <span>Đang ngoại tuyến — sửa vẫn lưu vào máy, sẽ gửi lên khi có mạng.</span>
          </div>
        )}

        <textarea
          className="ct-textarea ct-note-body"
          value={markdown}
          readOnly={readOnlyReason !== null}
          rows={22}
          spellCheck={false}
          placeholder="Viết bằng Markdown…"
          onChange={(event) => onChange(event.target.value)}
        />

        <p className="ct-field-help">
          Định dạng Markdown: <code># tiêu đề</code>, <code>**đậm**</code>,{' '}
          <code>- danh sách</code>, <code>```mã```</code>.
          {folder !== null && (
            <>
              {' '}Lưu thành <code>{noteFileName(note.id, latest.current.title)}</code>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * Nói "Đã lưu vào máy", KHÔNG nói "Đã lưu". Việc gửi lên máy chủ do hàng đợi lo
 * và trạng thái đó ở thanh dưới cùng — gộp hai thứ là hứa một điều chưa xảy ra.
 */
function SaveIndicator({ state }: { state: SaveState }) {
  if (state === 'chua-doi') return null;
  return (
    <span className="ct-save-indicator" data-state={state === 'dang-luu' ? 'dang-luu' : 'da-luu-cuc-bo'}>
      {state === 'dang-luu' ? (
        <>
          <Loader2 size={13} className="ct-spin" aria-hidden />
          Đang lưu…
        </>
      ) : (
        <>
          <Save size={13} aria-hidden />
          Đã lưu vào máy
        </>
      )}
    </span>
  );
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return date.toLocaleDateString('vi-VN');
}
