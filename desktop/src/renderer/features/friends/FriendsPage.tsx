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
 *   GET    /users/online               → { users: [...] } — MỌI người đang online (04/10/2026)
 *
 * ⚠️ HAI HÌNH DẠNG KHÁC NHAU, DỄ NHẦM:
 * `api.request` bóc `envelope.data`, nên `/friends/requests/*` và
 * `/users/search` trả về THẲNG MẢNG, còn `/friends` trả về một OBJECT
 * `{ users: [...] }`. Đọc `.users` trên mảng ⇒ `undefined` ⇒ danh sách bạn
 * rỗng vĩnh viễn mà không có lỗi nào. Đã dính đúng lớp lỗi này ở Bảng tin.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check, CloudOff, MessageSquare, RefreshCw, Search, Send, UserCheck, UserMinus, UserPlus, Users, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { useDich } from '../../i18n';
import { Chu } from '../../i18n/Chu';
import { datTruyVanCho } from '../../shims/next-navigation';

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

type Tab = 'ban' | 'onl' | 'den' | 'di' | 'tim';

function ten(n?: Nguoi | null): string {
  return n?.displayName || n?.username || 'Không rõ';
}

export function FriendsPage() {
  const { dich } = useDich();
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

  /* "Đang online" = MỌI người đang dùng web/app/iOS trên máy chủ (04/10/2026), không chỉ
     bạn bè. Hỏi lại mỗi 30 giây. Máy chủ cũ chưa có `/users/online` (404) ⇒ lùi về bạn
     bè đang online như trước, không để trang trống. */
  const [onlineHet, datOnlineHet] = useState<Nguoi[] | null>(null);
  useEffect(() => {
    if (!api || !online) return;
    let con = true;
    const hoi = () => api.request<{ users?: Nguoi[] }>('/api/v1/users/online')
      .then((v) => { if (con) datOnlineHet((v?.users ?? []).filter((n) => n.id !== userId)); })
      .catch(() => { if (con) datOnlineHet(null); });
    void hoi();
    const t = setInterval(() => { if (!document.hidden) void hoi(); }, 30_000);
    return () => { con = false; clearInterval(t); };
  }, [api, online, userId]);

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

  /** Mở thẳng cuộc trò chuyện với người này (messenger web đọc `?peer=`). */
  const nhanTin = (n: Nguoi) => {
    datTruyVanCho('/messages', `peer=${n.id}`);
    navigate('/messages');
  };

  const dangOnline = onlineHet ?? ban.filter((n) => n.isOnline);
  const MUC: Array<{ k: Tab; ten: string; icon: React.ReactNode; so?: number }> = [
    { k: 'ban', ten: 'Tất cả bạn bè', icon: <Users size={16} aria-hidden />, so: ban.length },
    { k: 'onl', ten: 'Đang online', icon: <span className="ct-bb2-cham" aria-hidden />, so: dangOnline.length },
    { k: 'den', ten: 'Lời mời kết bạn', icon: <UserCheck size={16} aria-hidden />, so: den.length },
    { k: 'di', ten: 'Đã gửi', icon: <Send size={16} aria-hidden />, so: di.length },
    { k: 'tim', ten: 'Tìm bạn & gợi ý', icon: <UserPlus size={16} aria-hidden /> },
  ];

  /** Lọc nhanh trong danh sách bạn (khác ô "Tìm bạn" — cái đó tìm cả web). */
  const [loc, datLoc] = useState('');
  const khopLoc = (n: Nguoi) => {
    const q = loc.trim().toLowerCase();
    return !q || ten(n).toLowerCase().includes(q) || n.username.toLowerCase().includes(q);
  };
  const banHienThi = ban.filter(khopLoc);
  const onlineHienThi = dangOnline.filter(khopLoc);

  const tieuDe = { ban: 'Tất cả bạn bè', onl: 'Đang online', den: 'Lời mời kết bạn', di: 'Lời mời đã gửi', tim: 'Tìm bạn & gợi ý' }[tab];

  return (
    <div className="ct-bb2">
      {/* ── Cột trái: điều hướng ── */}
      <aside className="ct-bb2-ray" aria-label={dich('Bạn bè')}>
        <div className="ct-bb2-ray-dau">
          <h1>{dich('Bạn bè')}</h1>
          <button type="button" className="ct-bb2-lammoi" onClick={() => void nap()} disabled={dangTai}
            title={dich('Làm mới')} aria-label={dich('Làm mới')}>
            <RefreshCw size={15} aria-hidden className={dangTai ? 'ct-spin' : undefined} />
          </button>
        </div>
        <nav className="ct-bb2-muc">
          {MUC.map((m) => (
            <button key={m.k} type="button" data-chon={tab === m.k} onClick={() => datTab(m.k)}>
              <span className="ct-bb2-muc-icon">{m.icon}</span>
              <span className="ct-bb2-muc-ten">{dich(m.ten)}</span>
              {!!m.so && <span className="ct-bb2-muc-so" data-noi={m.k === 'den'}>{m.so}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Vùng chính ── */}
      <section className="ct-bb2-chinh">
        <header className="ct-bb2-chinh-dau">
          <div>
            <h2>{dich(tieuDe)}</h2>
            <p>
              {tab === 'ban' && (ban.length ? `${banHienThi.length}/${ban.length} người` : dich('Kết nối với người khác trên cuongthai.com'))}
              {tab === 'onl' && (onlineHet
                ? `${dangOnline.length} người đang dùng CuongThai — web, app, điện thoại`
                : `${dangOnline.length} bạn bè đang online`)}
              {tab === 'den' && `${den.length} lời mời đang chờ bạn trả lời`}
              {tab === 'di' && `${di.length} lời mời chưa được trả lời`}
              {tab === 'tim' && dich('Tìm theo tên, hoặc kết bạn với người được gợi ý')}
            </p>
          </div>
          {(tab === 'ban' || tab === 'onl' || tab === 'tim') && (
            <div className="ct-bb2-tim">
              <Search size={15} aria-hidden />
              {tab !== 'tim' ? (
                <input value={loc} placeholder={dich('Lọc bạn bè…')} maxLength={80}
                  onChange={(e) => datLoc(e.target.value)} />
              ) : (
                <input value={tuKhoa} autoFocus placeholder={dich('Tìm theo tên hoặc tên đăng nhập…')} maxLength={80}
                  onChange={(e) => datTuKhoa(e.target.value)} />
              )}
            </div>
          )}
        </header>

        {loi && (
          <div className="ct-notice" data-tone="warn" style={{ marginBottom: 14 }}>
            <CloudOff size={15} aria-hidden /> <span>{loi}</span>
          </div>
        )}

        {tab === 'ban' && (
          dangTai && ban.length === 0 ? <p className="ct-muted">{dich('Đang tải…')}</p>
            : banHienThi.length === 0 ? (
              <Trong icon={<Users size={30} aria-hidden />}>
                {ban.length === 0
                  ? <Chu cau="Chưa có người bạn nào. Sang **Tìm bạn & gợi ý** để bắt đầu." />
                  : `Không ai khớp “${loc.trim()}”.`}
              </Trong>
            ) : (
              <ul className="ct-bb2-luoi">
                {banHienThi.map((n) => (
                  <The key={n.id} n={n} phu={n.since ? `Bạn từ ${new Date(n.since).toLocaleDateString('vi-VN')}` : undefined}>
                    <button type="button" className="ct-btn" onClick={() => nhanTin(n)}>
                      <MessageSquare size={14} aria-hidden /> Nhắn tin
                    </button>
                    <button type="button" className="ct-bb2-phu" onClick={() => void huyBan(n)}
                      disabled={dangChay.has(n.id)} title={dich('Huỷ kết bạn')} aria-label={dich('Huỷ kết bạn')}>
                      <UserMinus size={15} aria-hidden />
                    </button>
                  </The>
                ))}
              </ul>
            )
        )}

        {tab === 'onl' && (
          onlineHienThi.length === 0 ? (
            <Trong icon={<Users size={30} aria-hidden />}>
              {loc.trim() ? `Không ai khớp “${loc.trim()}”.` : dich('Lúc này chưa có ai khác đang online.')}
            </Trong>
          ) : (
            <ul className="ct-bb2-luoi">
              {onlineHienThi.map((n) => (
                <The key={n.id} n={{ ...n, isOnline: true }} phu={quanHe(n.id) === 'ban' ? dich('Bạn bè') : undefined}>
                  <button type="button" className="ct-btn" onClick={() => nhanTin(n)}>
                    <MessageSquare size={14} aria-hidden /> Nhắn tin
                  </button>
                  {quanHe(n.id) !== 'ban' && (
                    <NutKetBan n={n} qh={quanHe(n.id)} dang={dangChay.has(n.id)} onMoi={() => void moiKetBan(n)} />
                  )}
                </The>
              ))}
            </ul>
          )
        )}

        {tab === 'den' && (
          den.length === 0 ? (
            <Trong icon={<UserCheck size={30} aria-hidden />}>{dich('Không có lời mời nào đang chờ.')}</Trong>
          ) : (
            <ul className="ct-bb2-luoi">
              {den.map((m) => (
                <The key={m.friendshipId} n={m.user} phu={`Gửi ${new Date(m.createdAt).toLocaleDateString('vi-VN')}`}>
                  <button type="button" className="ct-btn" onClick={() => void traLoi(m, true)} disabled={dangChay.has(m.user.id)}>
                    <Check size={14} aria-hidden /> Đồng ý
                  </button>
                  <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void traLoi(m, false)} disabled={dangChay.has(m.user.id)}>
                    <X size={14} aria-hidden /> Từ chối
                  </button>
                </The>
              ))}
            </ul>
          )
        )}

        {tab === 'di' && (
          di.length === 0 ? (
            <Trong icon={<Send size={30} aria-hidden />}>{dich('Bạn chưa gửi lời mời nào.')}</Trong>
          ) : (
            <ul className="ct-bb2-luoi">
              {di.map((m) => (
                <The key={m.friendshipId} n={m.user} phu={dich('Đang chờ')}>
                  <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void rutLoiMoi(m)} disabled={dangChay.has(m.user.id)}>
                    {dich('Thu hồi')}
                  </button>
                </The>
              ))}
            </ul>
          )
        )}

        {tab === 'tim' && (
          tuKhoa.trim().length >= 2 ? (
            dangTim ? <p className="ct-muted">{dich('Đang tìm…')}</p>
              : ketQua?.length === 0 ? <Trong icon={<Search size={30} aria-hidden />}>Không tìm thấy ai khớp “{tuKhoa.trim()}”.</Trong>
                : (
                  <ul className="ct-bb2-luoi">
                    {(ketQua ?? []).filter((n) => n.id !== userId).map((n) => (
                      <The key={n.id} n={n}>
                        <NutKetBan n={n} qh={quanHe(n.id)} dang={dangChay.has(n.id)} onMoi={() => void moiKetBan(n)} />
                      </The>
                    ))}
                  </ul>
                )
          ) : (
            <>
              <p className="ct-bb2-nhan">{dich('Gợi ý cho bạn')}</p>
              {goiY.length === 0 ? <p className="ct-muted">{dich('Chưa có gợi ý nào.')}</p> : (
                <ul className="ct-bb2-luoi">
                  {goiY.filter((n) => n.id !== userId).map((n) => (
                    <The key={n.id} n={n}>
                      <NutKetBan n={n} qh={quanHe(n.id)} dang={dangChay.has(n.id)} onMoi={() => void moiKetBan(n)} />
                    </The>
                  ))}
                </ul>
              )}
            </>
          )
        )}
      </section>
    </div>
  );
}

function Trong({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ct-bb2-trong">
      <span className="ct-bb2-trong-icon">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

/** Nút đổi theo QUAN HỆ hiện tại — mời một người đã là bạn thì máy chủ từ chối, và nút đó chỉ để lừa mắt. */
function NutKetBan({ n, qh, dang, onMoi }: {
  n: Nguoi; qh: 'ban' | 'den' | 'di' | 'chua'; dang: boolean; onMoi: () => void;
}) {
  const { dich } = useDich();
  if (qh === 'ban') return <span className="ct-bb-cho" data-ok="true"><UserCheck size={12} aria-hidden /> {dich('Bạn bè')}</span>;
  if (qh === 'di') return <span className="ct-bb-cho">{dich('Đã gửi lời mời')}</span>;
  if (qh === 'den') return <span className="ct-bb-cho">{dich('Đang chờ bạn trả lời')}</span>;
  return (
    <button type="button" className="ct-btn" onClick={onMoi} disabled={dang} aria-label={`Kết bạn với ${ten(n)}`}>
      <UserPlus size={13} aria-hidden /> Kết bạn
    </button>
  );
}

function The({ n, phu, children }: { n: Nguoi; phu?: string | undefined; children: React.ReactNode }) {
  const { dich } = useDich();
  return (
    <li className="ct-bb2-the">
      <div className="ct-bb2-the-dau">
        <span className="ct-bb2-avt-boc">
          <Avatar n={n} />
          {n.isOnline && <span className="ct-bb2-online" title={dich('đang online')} />}
        </span>
        <div className="ct-bb2-the-chu">
          <strong title={ten(n)}>{ten(n)}</strong>
          <span>@{n.username}</span>
          {phu && <small>{phu}</small>}
        </div>
      </div>
      <div className="ct-bb2-the-nut">{children}</div>
    </li>
  );
}

function Avatar({ n }: { n: Nguoi }) {
  if (n.avatarUrl) return <img className="ct-bb-avt" src={n.avatarUrl} alt="" loading="lazy" />;
  return <span className="ct-bb-avt" data-chu="true">{ten(n).trim().charAt(0).toUpperCase() || '?'}</span>;
}
