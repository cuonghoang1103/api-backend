/**
 * ============================================================
 * BẠN BÈ
 * ============================================================
 *
 * Đối chiếu `src/routes/friend.routes.ts` (mount `/api/v1/friends`) và
 * `src/routes/user.routes.ts` (`/api/v1/users`):
 *   GET    /friends                    → { users: [{ id, username, displayName, avatarUrl, isOnline, since }] }
 *   GET    /friends/requests/incoming  → [{ friendshipId, user, createdAt }]
 *   GET    /friends/requests/outgoing  → [{ friendshipId, user, createdAt }]
 *   POST   /friends/request            → { targetId }
 *   POST   /friends/respond            → { requesterId, accept }
 *   POST   /friends/cancel             → { targetId }
 *   DELETE /friends/:id                → huỷ kết bạn
 *   GET    /users/search?q=            → [{ id, username, displayName, avatarUrl }]
 *   GET    /users/suggestions          → [{ id, username, displayName, avatarUrl, isOnline }]
 *
 * ⚠️ HAI HÌNH DẠNG KHÁC NHAU, DỄ NHẦM:
 * `api.request` bóc `envelope.data`, nên `/friends/requests/*` và
 * `/users/search` trả về THẲNG MẢNG, còn `/friends` trả về một OBJECT
 * `{ users: [...] }`. Đọc `.users` trên mảng ⇒ `undefined` ⇒ danh sách bạn
 * rỗng vĩnh viễn mà không có lỗi nào. Đã dính đúng lớp lỗi này ở Bảng tin.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check, CloudOff, MessageSquare, RefreshCw, Search, UserCheck, UserMinus, UserPlus, Users, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface Nguoi {
  id: number;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean;
  since?: string | null;
}

interface LoiMoi {
  friendshipId: number;
  user: Nguoi;
  createdAt: string;
}

type Tab = 'ban' | 'den' | 'di' | 'tim';

function ten(n?: Nguoi | null): string {
  return n?.displayName || n?.username || 'Không rõ';
}

export function FriendsPage() {
  const { online, navigate } = useAppState();
  const { api, userId } = useSession();

  const [tab, datTab] = useState<Tab>('ban');
  const [ban, datBan] = useState<Nguoi[]>([]);
  const [den, datDen] = useState<LoiMoi[]>([]);
  const [di, datDi] = useState<LoiMoi[]>([]);
  const [goiY, datGoiY] = useState<Nguoi[]>([]);
  const [tuKhoa, datTuKhoa] = useState('');
  const [ketQua, datKetQua] = useState<Nguoi[] | null>(null);
  const [dangTim, datDangTim] = useState(false);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState<string | null>(null);
  /** Id đang có thao tác chạy dở — khoá đúng nút đó, không khoá cả trang. */
  const [dangChay, datDangChay] = useState<Set<number>>(new Set());

  const khoa = (id: number, bat: boolean) => datDangChay((c) => {
    const m = new Set(c);
    if (bat) m.add(id); else m.delete(id);
    return m;
  });

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    datLoi(null);
    try {
      const kq = await swr<{ users?: Nguoi[] }>({
        userId,
        key: 'friends:list',
        fetcher: () => api.request('/api/v1/friends'),
        online,
        ttlMs: 60_000,
        // ⚠️ `/friends` trả OBJECT `{ users }`, không phải mảng — xem đầu file.
        onRefreshed: (v) => datBan(v?.users ?? []),
      });
      datBan(kq.value?.users ?? []);
    } catch (e) {
      datLoi(e instanceof OfflineUnavailableError
        ? 'Chưa từng tải danh sách bạn nên không xem được khi ngoại tuyến.'
        : e instanceof Error ? e.message : String(e));
    } finally {
      datDangTai(false);
    }
    // Lời mời và gợi ý KHÔNG cache: chúng đổi liên tục và một danh sách lời mời
    // cũ dẫn tới bấm "Đồng ý" cho một lời mời đã bị rút.
    if (!online) return;
    void api.request<LoiMoi[]>('/api/v1/friends/requests/incoming').then((v) => datDen(v ?? [])).catch(() => {});
    void api.request<LoiMoi[]>('/api/v1/friends/requests/outgoing').then((v) => datDi(v ?? [])).catch(() => {});
    void api.request<Nguoi[]>('/api/v1/users/suggestions?limit=12').then((v) => datGoiY(v ?? [])).catch(() => {});
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  // ── Tìm người: hoãn một nhịp, đừng gọi mỗi ký tự ──
  const henTim = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const q = tuKhoa.trim();
    if (henTim.current) clearTimeout(henTim.current);
    if (q.length < 2) { datKetQua(null); datDangTim(false); return; }
    datDangTim(true);
    henTim.current = setTimeout(() => {
      void api?.request<Nguoi[]>(`/api/v1/users/search?q=${encodeURIComponent(q)}`)
        .then((v) => datKetQua(v ?? []))
        .catch(() => datKetQua([]))
        .finally(() => datDangTim(false));
    }, 350);
    return () => { if (henTim.current) clearTimeout(henTim.current); };
  }, [tuKhoa, api]);

  const moiKetBan = async (n: Nguoi) => {
    if (!api) return;
    khoa(n.id, true);
    try {
      await api.request('/api/v1/friends/request', { method: 'POST', body: { targetId: n.id } });
      // Chuyển ngay sang "đã gửi" thay vì chờ tải lại — người dùng vừa bấm thì
      // phải thấy kết quả của cú bấm đó.
      datDi((c) => [{ friendshipId: -n.id, user: n, createdAt: new Date().toISOString() }, ...c]);
      datGoiY((c) => c.filter((x) => x.id !== n.id));
    } catch (e) { datLoi(e instanceof Error ? e.message : String(e)); }
    finally { khoa(n.id, false); }
  };

  const traLoi = async (m: LoiMoi, dongY: boolean) => {
    if (!api) return;
    khoa(m.user.id, true);
    try {
      await api.request('/api/v1/friends/respond', { method: 'POST', body: { requesterId: m.user.id, accept: dongY } });
      datDen((c) => c.filter((x) => x.user.id !== m.user.id));
      if (dongY) datBan((c) => [{ ...m.user, since: new Date().toISOString() }, ...c]);
    } catch (e) { datLoi(e instanceof Error ? e.message : String(e)); }
    finally { khoa(m.user.id, false); }
  };

  const rutLoiMoi = async (m: LoiMoi) => {
    if (!api) return;
    khoa(m.user.id, true);
    try {
      await api.request('/api/v1/friends/cancel', { method: 'POST', body: { targetId: m.user.id } });
      datDi((c) => c.filter((x) => x.user.id !== m.user.id));
    } catch (e) { datLoi(e instanceof Error ? e.message : String(e)); }
    finally { khoa(m.user.id, false); }
  };

  const huyBan = async (n: Nguoi) => {
    if (!api) return;
    khoa(n.id, true);
    try {
      await api.request(`/api/v1/friends/${n.id}`, { method: 'DELETE' });
      datBan((c) => c.filter((x) => x.id !== n.id));
    } catch (e) { datLoi(e instanceof Error ? e.message : String(e)); }
    finally { khoa(n.id, false); }
  };

  /** Người này đang ở trạng thái nào với mình — để nút hiện đúng việc. */
  const quanHe = (id: number): 'ban' | 'den' | 'di' | 'chua' => {
    if (ban.some((x) => x.id === id)) return 'ban';
    if (den.some((x) => x.user.id === id)) return 'den';
    if (di.some((x) => x.user.id === id)) return 'di';
    return 'chua';
  };

  const TABS: Array<{ k: Tab; ten: string; so?: number }> = [
    { k: 'ban', ten: 'Bạn bè', so: ban.length },
    { k: 'den', ten: 'Lời mời', so: den.length },
    { k: 'di', ten: 'Đã gửi', so: di.length },
    { k: 'tim', ten: 'Tìm bạn' },
  ];

  return (
    <div className="ct-page ct-bb" style={{ maxWidth: 780 }}>
      <div className="ct-page-head" style={{ marginBottom: 12 }}>
        <div>
          <h1>Bạn bè</h1>
          <p className="ct-muted" style={{ margin: 0 }}>
            {ban.length ? `${ban.length} người bạn` : 'Kết nối với người khác trên cuongthai.com'}
          </p>
        </div>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()} disabled={dangTai}>
          <RefreshCw size={14} aria-hidden className={dangTai ? 'ct-spin' : undefined} /> Làm mới
        </button>
      </div>

      <div className="ct-bb-tabs">
        {TABS.map((t) => (
          <button key={t.k} type="button" data-chon={tab === t.k} onClick={() => datTab(t.k)}>
            {t.ten}
            {/* Chỉ hiện số khi CÓ — một con số 0 cạnh mỗi tab là nhiễu. */}
            {!!t.so && <span>{t.so}</span>}
          </button>
        ))}
      </div>

      {loi && (
        <div className="ct-notice" data-tone="warn" style={{ marginBottom: 12 }}>
          <CloudOff size={15} aria-hidden /> <span>{loi}</span>
        </div>
      )}

      {/* ── Bạn bè ── */}
      {tab === 'ban' && (
        dangTai && ban.length === 0 ? <p className="ct-muted">Đang tải…</p>
          : ban.length === 0 ? (
            <div className="ct-empty">
              <Users size={28} aria-hidden className="ct-empty-icon" />
              <p>Chưa có người bạn nào. Sang tab <strong>Tìm bạn</strong> để bắt đầu.</p>
            </div>
          ) : (
            <ul className="ct-bb-ds">
              {ban.map((n) => (
                <Dong key={n.id} n={n}>
                  <button type="button" className="ct-btn ct-btn-ghost" onClick={() => navigate('/messages')}>
                    <MessageSquare size={13} aria-hidden /> Nhắn tin
                  </button>
                  <button type="button" className="ct-bb-huy" onClick={() => void huyBan(n)}
                    disabled={dangChay.has(n.id)} title="Huỷ kết bạn">
                    <UserMinus size={14} aria-hidden />
                  </button>
                </Dong>
              ))}
            </ul>
          )
      )}

      {/* ── Lời mời đến ── */}
      {tab === 'den' && (
        den.length === 0 ? (
          <div className="ct-empty">
            <UserCheck size={28} aria-hidden className="ct-empty-icon" />
            <p>Không có lời mời nào đang chờ.</p>
          </div>
        ) : (
          <ul className="ct-bb-ds">
            {den.map((m) => (
              <Dong key={m.friendshipId} n={m.user}>
                <button type="button" className="ct-btn" onClick={() => void traLoi(m, true)} disabled={dangChay.has(m.user.id)}>
                  <Check size={13} aria-hidden /> Đồng ý
                </button>
                <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void traLoi(m, false)} disabled={dangChay.has(m.user.id)}>
                  <X size={13} aria-hidden /> Từ chối
                </button>
              </Dong>
            ))}
          </ul>
        )
      )}

      {/* ── Đã gửi ── */}
      {tab === 'di' && (
        di.length === 0 ? (
          <div className="ct-empty">
            <UserPlus size={28} aria-hidden className="ct-empty-icon" />
            <p>Bạn chưa gửi lời mời nào.</p>
          </div>
        ) : (
          <ul className="ct-bb-ds">
            {di.map((m) => (
              <Dong key={m.friendshipId} n={m.user}>
                <span className="ct-bb-cho">Đang chờ</span>
                <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void rutLoiMoi(m)} disabled={dangChay.has(m.user.id)}>
                  Thu hồi
                </button>
              </Dong>
            ))}
          </ul>
        )
      )}

      {/* ── Tìm bạn ── */}
      {tab === 'tim' && (
        <>
          <div className="ct-bb-tim">
            <Search size={15} aria-hidden />
            <input
              value={tuKhoa}
              placeholder="Tìm theo tên hoặc tên đăng nhập…"
              maxLength={80}
              onChange={(e) => datTuKhoa(e.target.value)}
            />
          </div>

          {tuKhoa.trim().length >= 2 ? (
            dangTim ? <p className="ct-muted">Đang tìm…</p>
              : ketQua?.length === 0 ? <p className="ct-muted">Không tìm thấy ai khớp “{tuKhoa.trim()}”.</p>
                : (
                  <ul className="ct-bb-ds">
                    {(ketQua ?? []).filter((n) => n.id !== userId).map((n) => (
                      <Dong key={n.id} n={n}>
                        <NutKetBan n={n} qh={quanHe(n.id)} dang={dangChay.has(n.id)} onMoi={() => void moiKetBan(n)} />
                      </Dong>
                    ))}
                  </ul>
                )
          ) : (
            <>
              <p className="ct-bb-nhan">Gợi ý cho bạn</p>
              {goiY.length === 0 ? <p className="ct-muted">Chưa có gợi ý nào.</p> : (
                <ul className="ct-bb-ds">
                  {goiY.filter((n) => n.id !== userId).map((n) => (
                    <Dong key={n.id} n={n}>
                      <NutKetBan n={n} qh={quanHe(n.id)} dang={dangChay.has(n.id)} onMoi={() => void moiKetBan(n)} />
                    </Dong>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

/** Nút đổi theo QUAN HỆ hiện tại — mời một người đã là bạn thì máy chủ từ chối, và nút đó chỉ để lừa mắt. */
function NutKetBan({ n, qh, dang, onMoi }: {
  n: Nguoi; qh: 'ban' | 'den' | 'di' | 'chua'; dang: boolean; onMoi: () => void;
}) {
  if (qh === 'ban') return <span className="ct-bb-cho" data-ok="true"><UserCheck size={12} aria-hidden /> Bạn bè</span>;
  if (qh === 'di') return <span className="ct-bb-cho">Đã gửi lời mời</span>;
  if (qh === 'den') return <span className="ct-bb-cho">Đang chờ bạn trả lời</span>;
  return (
    <button type="button" className="ct-btn" onClick={onMoi} disabled={dang} aria-label={`Kết bạn với ${ten(n)}`}>
      <UserPlus size={13} aria-hidden /> Kết bạn
    </button>
  );
}

function Dong({ n, children }: { n: Nguoi; children: React.ReactNode }) {
  return (
    <li className="ct-bb-dong">
      <Avatar n={n} />
      <div className="ct-bb-dong-chu">
        <strong>{ten(n)}</strong>
        <span>@{n.username}{n.isOnline && <em className="ct-bb-online"> · đang online</em>}</span>
      </div>
      <div className="ct-bb-nut">{children}</div>
    </li>
  );
}

function Avatar({ n }: { n: Nguoi }) {
  if (n.avatarUrl) return <img className="ct-bb-avt" src={n.avatarUrl} alt="" loading="lazy" />;
  return <span className="ct-bb-avt" data-chu="true">{ten(n).trim().charAt(0).toUpperCase() || '?'}</span>;
}
