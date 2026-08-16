/**
 * CV Builder — màn hình native đầu tiên.
 *
 * Chọn module này để port trước vì nó là thứ HỢP OFFLINE NHẤT trong cả web:
 * dữ liệu thuộc về riêng một người, không ai sửa song song, và `PUT /cv/profile`
 * ghi đè toàn bộ nên gửi lại hai lần vẫn ra một kết quả — an toàn để xếp hàng
 * khi backend chưa có idempotency.
 *
 * Luồng dữ liệu:
 *   đọc  → `swr` (cache trước, làm mới nền) → xem được khi mất mạng
 *   sửa  → ghi cache NGAY + xếp hàng đồng bộ → không mất chữ đã gõ
 *   gửi  → hàng đợi lo, có backoff và chống trùng
 *
 * Điều màn hình này KHÔNG làm: báo "Đã lưu" khi mới chỉ lưu cục bộ. Nó phân
 * biệt rạch ròi "đã lưu trên máy" với "đã đồng bộ" — hai chuyện khác nhau, và
 * gộp lại là cách nhanh nhất để người dùng mất dữ liệu mà vẫn yên tâm.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CloudOff, Loader2, RefreshCw, Save } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr, writeCache } from '../../offline/cache';
import { enqueue } from '../../offline/sync-queue';
import {
  EMPTY_DRAFT,
  fetchProfile,
  profileCacheKey,
  toDraft,
  toPayload,
  type CvProfile,
  type CvProfileDraft,
} from './api';

/** Chờ ngừng gõ bao lâu thì lưu. Đủ ngắn để không mất chữ, đủ dài để không
 *  xếp hàng sau mỗi phím. Hàng đợi có gộp trùng nên kể cả gõ liên tục cũng chỉ
 *  ra một việc. */
const AUTOSAVE_DELAY_MS = 800;

type LocalState = 'chua-doi' | 'dang-luu' | 'da-luu-cuc-bo';

export function CvPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [draft, setDraft] = useState<CvProfileDraft>(EMPTY_DRAFT);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [localState, setLocalState] = useState<LocalState>('chua-doi');

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Chặn autosave chạy ngay sau khi nạp xong — lúc đó chưa ai gõ gì. */
  const loaded = useRef(false);

  const load = useCallback(async () => {
    if (userId === null || !api) return;
    setLoading(true);
    setLoadError(null);
    try {
      const result = await swr<CvProfile>({
        userId,
        key: profileCacheKey(),
        fetcher: () => fetchProfile(api),
        online,
        ttlMs: 5 * 60 * 1000,
        onRefreshed: (fresh) => {
          // Bản mới về ở nền. CHỈ ghi đè ô nhập khi người dùng chưa sửa gì —
          // nếu không, chữ họ đang gõ sẽ bị nuốt giữa chừng.
          setCachedAt(Date.now());
          setIsStale(false);
          if (loaded.current && localStateRef.current === 'chua-doi') {
            setDraft(toDraft(fresh));
          }
        },
      });
      setDraft(toDraft(result.value));
      setCachedAt(result.cachedAt);
      setIsStale(result.isStale);
      loaded.current = true;
    } catch (error) {
      if (error instanceof OfflineUnavailableError) {
        setLoadError(
          'Chưa từng tải hồ sơ CV về máy nên không xem được khi ngoại tuyến. ' +
            'Hãy mở lại trang này khi có mạng.',
        );
      } else {
        setLoadError(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setLoading(false);
    }
  }, [api, userId, online]);

  // `localState` đọc trong callback của swr — dùng ref để không phải đưa nó vào
  // dependency của `load` (làm vậy sẽ nạp lại mỗi lần gõ một phím).
  const localStateRef = useRef<LocalState>('chua-doi');
  useEffect(() => {
    localStateRef.current = localState;
  }, [localState]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Lưu cục bộ + xếp hàng. KHÔNG gọi mạng trực tiếp — hàng đợi lo việc đó. */
  const persist = useCallback(
    async (next: CvProfileDraft) => {
      if (userId === null) return;
      setLocalState('dang-luu');

      // 1. Ghi cache trước. Đây là bước làm cho chữ đã gõ sống sót qua việc
      //    đóng app đột ngột — phải xong trước khi nghĩ tới chuyện gửi đi.
      await writeCache(userId, profileCacheKey(), { ...next, __local: true }, 5 * 60 * 1000);

      // 2. Xếp hàng. `entityId` cố định vì mỗi người chỉ có MỘT hồ sơ; nhờ vậy
      //    gộp trùng của hàng đợi tự động nén mọi lần gõ thành một việc.
      await enqueue({
        userId,
        operationType: 'update',
        entityType: 'cv-profile',
        entityId: 'me',
        payload: toPayload(next),
      });

      setLocalState('da-luu-cuc-bo');
    },
    [userId],
  );

  const onChange = useCallback(
    (patch: Partial<CvProfileDraft>) => {
      setDraft((previous) => {
        const next = { ...previous, ...patch };
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => void persist(next), AUTOSAVE_DELAY_MS);
        return next;
      });
      setLocalState('dang-luu');
    },
    [persist],
  );

  // Lưu ngay khi rời trang. Không có bước này thì gõ xong rồi bấm sang trang
  // khác trong vòng 800ms sẽ mất phần vừa gõ.
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        void persist(draftRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  if (loading) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <Loader2 size={22} className="ct-spin" aria-hidden />
          <p style={{ marginTop: 10 }}>Đang tải hồ sơ CV…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <CloudOff size={28} aria-hidden className="ct-empty-icon" />
          <h1>Không mở được hồ sơ</h1>
          <p>{loadError}</p>
          <div className="ct-actions">
            <button type="button" className="ct-btn" onClick={() => void load()}>
              <RefreshCw size={14} aria-hidden />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page">
      <div className="ct-panel">
        <div className="ct-page-head">
          <div>
            <h1>Hồ sơ CV</h1>
            <p className="ct-muted" style={{ margin: 0 }}>
              Hồ sơ gốc dùng để sinh các bản CV. Sửa được cả khi ngoại tuyến.
            </p>
          </div>
          <SaveIndicator state={localState} />
        </div>

        {isStale && (
          <div className="ct-notice" data-tone="warn">
            <CloudOff size={15} aria-hidden />
            <span>
              Đang xem bản đã lưu{cachedAt ? ` (${formatAge(cachedAt)})` : ''}.
              {online ? ' Đang làm mới…' : ' Sẽ cập nhật khi có mạng.'}
            </span>
          </div>
        )}

        <section className="ct-section">
          <h2>Thông tin liên hệ</h2>
          <Field
            label="Họ và tên"
            value={draft.fullName}
            onChange={(fullName) => onChange({ fullName })}
            maxLength={150}
          />
          <Field
            label="Chức danh"
            hint="Ví dụ: Backend Engineer"
            value={draft.headline}
            onChange={(headline) => onChange({ headline })}
            maxLength={200}
          />
          <Field
            label="Email"
            type="email"
            value={draft.email}
            onChange={(email) => onChange({ email })}
            maxLength={150}
          />
          <Field
            label="Điện thoại"
            value={draft.phone}
            onChange={(phone) => onChange({ phone })}
            maxLength={40}
          />
          <Field
            label="Nơi ở"
            value={draft.location}
            onChange={(location) => onChange({ location })}
            maxLength={150}
          />
        </section>

        <section className="ct-section">
          <h2>Liên kết</h2>
          {(['github', 'linkedin', 'portfolio', 'website'] as const).map((key) => (
            <Field
              key={key}
              label={key[0]!.toUpperCase() + key.slice(1)}
              value={draft.links[key] ?? ''}
              onChange={(value) => onChange({ links: { ...draft.links, [key]: value } })}
              maxLength={300}
            />
          ))}
        </section>

        <section className="ct-section">
          <h2>Giới thiệu</h2>
          <textarea
            className="ct-textarea"
            rows={6}
            value={draft.summary}
            maxLength={8000}
            placeholder="Vài dòng tóm tắt kinh nghiệm và thế mạnh của bạn…"
            onChange={(event) => onChange({ summary: event.target.value })}
          />
          <div className="ct-field-help" style={{ textAlign: 'right' }}>
            {draft.summary.length} / 8000
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Chỉ báo trạng thái lưu.
 *
 * Nói "Đã lưu trên máy", KHÔNG nói "Đã lưu". Việc gửi lên máy chủ do hàng đợi
 * lo và trạng thái đó nằm ở thanh dưới cùng. Gộp hai thứ vào một chữ "Đã lưu"
 * là hứa một điều chưa xảy ra.
 */
function SaveIndicator({ state }: { state: LocalState }) {
  if (state === 'chua-doi') return null;
  return (
    <span className="ct-save-indicator" data-state={state}>
      {state === 'dang-luu' ? (
        <>
          <Loader2 size={13} className="ct-spin" aria-hidden />
          Đang lưu…
        </>
      ) : (
        <>
          <Save size={13} aria-hidden />
          Đã lưu trên máy
        </>
      )}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  type = 'text',
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="ct-input-group">
      <span>
        {label}
        {hint && <em className="ct-field-hint"> — {hint}</em>}
      </span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function formatAge(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}
