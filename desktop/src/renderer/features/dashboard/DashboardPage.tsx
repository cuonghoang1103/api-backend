/**
 * ============================================================
 * TỔNG QUAN — màn hình mở đầu của app
 * ============================================================
 *
 * Đây là trang người dùng nhìn thấy ĐẦU TIÊN mỗi lần mở app, nên nó phải trả
 * lời đúng ba câu hỏi trong đầu họ lúc đó, theo thứ tự:
 *
 *   1. "Hôm nay tôi phải làm gì?"      → việc hôm nay, tick được ngay tại chỗ
 *   2. "Có gì mới khi tôi đi vắng?"    → tin nhắn / thông báo chưa đọc
 *   3. "Tôi đang đi tới đâu?"          → cấp, EXP, chuỗi ngày
 *
 * Mọi thứ khác là trang trí. Một màn hình mở đầu đẹp mà không trả lời được câu
 * nào trong ba câu đó thì người dùng bấm qua nó trong nửa giây và không bao giờ
 * quay lại.
 *
 * ─── DỮ LIỆU THẬT, KHÔNG PHẢI SỐ TRANG TRÍ ───
 * Đối chiếu `src/routes/dashboard.routes.ts` (mount `/api/v1/dashboard`):
 *   GET    /                → { level, exp, totalExp, timeline[24], tasks[], … }
 *   POST   /tasks           → tạo việc
 *   PATCH  /tasks/:id       → tick / bỏ tick
 *   DELETE /tasks/:id       → xoá
 * Cộng hai bộ đếm chưa đọc đã có sẵn (cùng nguồn robot nổi dùng):
 *   GET /api/v1/messages/unread-count            → { count }
 *   GET /api/v1/social/notifications/unread-count → { unreadCount }
 *
 * ⚠️ Hai endpoint đếm dùng HAI TÊN TRƯỜNG khác nhau (`count` vs `unreadCount`).
 * Đọc nhầm thì `undefined` → hiện 0 vĩnh viễn, và không có lỗi nào để lần ra.
 *
 * ─── VÌ SAO ĐỌC QUA `swr` ───
 * Mở app lúc mất mạng vẫn phải thấy việc hôm nay. `swr` trả bản cache trước rồi
 * cập nhật khi bản mới về, nên màn hình không bao giờ trắng vì đang chờ mạng.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell, BookOpen, Briefcase, Check, ChevronRight, Coffee, Dumbbell, Flame,
  Gamepad2, MessageSquare, Moon, Plus, RefreshCw, Trash2, UtensilsCrossed, Users, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

/**
 * ⚠️ `api.request` TỰ tuần tự hoá `body` — ĐỪNG `JSON.stringify` trước.
 *
 * `RequestOptions.body` khai kiểu `unknown` và `client.ts` gọi
 * `JSON.stringify(options.body)` ở tầng dưới. Đưa vào một chuỗi đã stringify
 * là mã hoá HAI LẦN: máy chủ nhận `"{\"timeline\":[…]}"` — một chuỗi, không
 * phải object — nên mọi trường đều `undefined` và nó trả 400.
 *
 * Hỏng kiểu này KHÔNG thấy được trên màn hình: giao diện đã đổi lạc quan từ
 * trước, `.catch()` im lặng nạp lại, và người dùng chỉ thấy thay đổi của mình
 * lặng lẽ quay về như cũ vài giây sau. Đo bằng cách hỏi thẳng máy chủ mới ra.
 */

type Scope = 'today' | 'week' | 'month';

interface Task {
  id: number | string;
  scope: Scope;
  date: string;
  title: string;
  done: boolean;
  exp: number;
}

interface TimelineSlot {
  hour: number;
  activity?: { type: string; label: string };
}

interface DashboardData {
  level: number;
  exp: number;
  totalExp: number;
  timeline: TimelineSlot[];
  tasks: Task[];
  celebratedToday: boolean;
}

/**
 * Bộ hoạt động — GIỮ ĐÚNG khoá và nhãn của bản web (`Timeline.tsx`).
 *
 * Cùng một `timeline` được cả hai bên đọc/ghi. Đặt thêm một khoá chỉ desktop
 * biết thì mở bên web sẽ thấy một ô có màu mà không có tên; đổi nhãn thì cùng
 * một giờ hiện hai chữ khác nhau ở hai nơi.
 */
const HOAT_DONG = [
  { khoa: 'study',    ten: 'Học tập',    mau: '#7c3aed', Icon: BookOpen },
  { khoa: 'work',     ten: 'Làm việc',   mau: '#0891b2', Icon: Briefcase },
  { khoa: 'exercise', ten: 'Thể dục',    mau: '#059669', Icon: Dumbbell },
  { khoa: 'cook',     ten: 'Nấu ăn',     mau: '#ea580c', Icon: UtensilsCrossed },
  { khoa: 'sleep',    ten: 'Đi ngủ',     mau: '#4f46e5', Icon: Moon },
  { khoa: 'rest',     ten: 'Nghỉ ngơi',  mau: '#db2777', Icon: Coffee },
  { khoa: 'leisure',  ten: 'Giải trí',   mau: '#d97706', Icon: Gamepad2 },
  { khoa: 'social',   ten: 'Bạn bè',     mau: '#0d9488', Icon: Users },
] as const;

const THEO_KHOA = new Map(HOAT_DONG.map((h) => [h.khoa, h]));

/** EXP cần cho một cấp. Khớp `src/utils/dashboard.ts` phía máy chủ. */
const EXP_MOI_CAP = 100;

/** `yyyy-mm-dd` theo giờ ĐỊA PHƯƠNG. `toISOString()` là UTC — lệch múi giờ +07 thì "hôm nay" của người dùng sai một ngày trong 7 tiếng mỗi đêm. */
function homNay(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function loiChao(gio: number): string {
  if (gio < 5) return 'Khuya rồi';
  if (gio < 11) return 'Chào buổi sáng';
  if (gio < 14) return 'Chào buổi trưa';
  if (gio < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

const THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function DashboardPage() {
  const { online, navigate } = useAppState();
  const { api, userId, user } = useSession();

  const [du, setDu] = useState<DashboardData | null>(null);
  const [chuaDoc, setChuaDoc] = useState({ tinNhan: 0, thongBao: 0 });
  const [loi, setLoi] = useState<string | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [nhap, setNhap] = useState('');
  const [dangThem, setDangThem] = useState(false);
  const oNhap = useRef<HTMLInputElement>(null);

  // Đồng hồ: chỉ để chọn lời chào và làm nổi ô giờ hiện tại. Cập nhật mỗi phút
  // là quá đủ — mỗi giây thì cả trang vẽ lại 60 lần/phút cho một con số không đổi.
  const [bayGio, datBayGio] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => datBayGio(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    setLoi(null);
    try {
      const kq = await swr<DashboardData>({
        userId,
        key: 'dashboard',
        fetcher: () => api.request('/api/v1/dashboard') as Promise<DashboardData>,
        online,
        ttlMs: 60_000,
        onRefreshed: setDu,
      });
      setDu(kq.value);
    } catch (e) {
      setLoi(e instanceof OfflineUnavailableError
        ? 'Chưa từng tải Tổng quan nên không xem được khi ngoại tuyến.'
        : e instanceof Error ? e.message : String(e));
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  // Hai bộ đếm chưa đọc. Hỏng thì để 0 và im lặng — chúng là thông tin phụ,
  // không đáng làm cả màn hình mở đầu báo lỗi.
  useEffect(() => {
    if (!api || !online) return;
    let huy = false;
    void (async () => {
      const doc = async (duong: string, khoa: string): Promise<number> => {
        try {
          const j = await api.request(duong) as Record<string, unknown>;
          const v = j?.[khoa];
          return typeof v === 'number' ? v : 0;
        } catch { return 0; }
      };
      const [tinNhan, thongBao] = await Promise.all([
        doc('/api/v1/messages/unread-count', 'count'),
        doc('/api/v1/social/notifications/unread-count', 'unreadCount'),
      ]);
      if (!huy) setChuaDoc({ tinNhan, thongBao });
    })();
    return () => { huy = true; };
  }, [api, online]);

  const ngay = homNay();
  const viecHomNay = useMemo(
    () => (du?.tasks ?? []).filter((t) => t.scope === 'today' && t.date === ngay),
    [du, ngay],
  );
  const xong = viecHomNay.filter((t) => t.done).length;

  /** Việc còn lại ở phạm vi rộng hơn. Dữ liệu đã nằm sẵn trong cùng lời gọi. */
  const conLai = useMemo(() => {
    const t = du?.tasks ?? [];
    const dem = (s: Scope) => t.filter((x) => x.scope === s && !x.done).length;
    return { tuan: dem('week'), thang: dem('month') };
  }, [du]);

  /**
   * Giờ nào trong ngày ĐÃ QUA.
   *
   * Không có nó thì dải 24 giờ là 24 ô xám hệt nhau — một hàng ô chết không nói
   * được gì. Tô nhạt phần đã qua thì nó thành "ngày của bạn đã đi tới đâu",
   * đọc được ngay cả khi chưa đặt hoạt động nào.
   */
  const coHoatDong = (du?.timeline ?? []).some((s) => !!s.activity);

  // ── Đặt hoạt động cho từng khung giờ ────────────────────
  /** Giờ đang mở bảng chọn. `null` = không mở. */
  const [dangChon, datDangChon] = useState<number | null>(null);
  /** Hoạt động dùng gần nhất — trở thành "cọ" để KÉO tô nhiều giờ. */
  const [co, datCo] = useState<string | null>(null);
  const dangKeo = useRef(false);
  /**
   * Giờ nơi cú kéo BẮT ĐẦU.
   *
   * `mousedown` chưa tô gì cả (nó mở bảng chọn — bấm một ô là để ĐỔI hoạt động
   * của ô đó). Nên nếu chỉ tô ở `mouseenter` thì kéo từ 3 đến 7 ra 4→7, mất
   * đúng ô xuất phát. Giữ lại để tô bù ngay khi biết đây là một cú KÉO chứ
   * không phải một cú bấm.
   */
  const gioBatDau = useRef<number | null>(null);
  const henLuu = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Ghi cả 24 ô xuống máy chủ, HOÃN LẠI một nhịp.
   *
   * Kéo qua 8 tiếng ngủ là 8 lần đổi trạng thái. Gửi ngay mỗi lần là 8 lời gọi
   * PUT chở cùng một mảng, và lần về sau có thể chen trước lần trước rồi ghi đè
   * bằng dữ liệu cũ hơn. Gộp lại thành một lời gọi sau khi tay đã rời.
   */
  const luuDongThoiGian = useCallback((moi: TimelineSlot[]) => {
    if (henLuu.current) clearTimeout(henLuu.current);
    henLuu.current = setTimeout(() => {
      void api?.request('/api/v1/dashboard/state', {
        method: 'PUT', body: { timeline: moi },
      }).catch(() => {
        // Ghi hỏng ⇒ lấy lại bản của máy chủ, đừng để màn hình nói dối.
        void nap();
      });
    }, 600);
  }, [api, nap]);

  const datGio = useCallback((gioSo: number, khoa: string | null, cungVoi?: number) => {
    datDangChon(null);
    setDu((c) => {
      if (!c) return c;
      const h = khoa ? THEO_KHOA.get(khoa as never) : null;
      const dat = new Set([gioSo, ...(cungVoi === undefined ? [] : [cungVoi])]);
      const moi = c.timeline.map((s) => (
        dat.has(s.hour)
          ? { hour: s.hour, ...(h ? { activity: { type: h.khoa, label: h.ten } } : {}) }
          : s
      ));
      luuDongThoiGian(moi);
      return { ...c, timeline: moi };
    });
    if (khoa) datCo(khoa);
  }, [luuDongThoiGian]);

  // Thả chuột ở BẤT KỲ đâu cũng phải kết thúc lượt kéo — thả ngoài dải mà vẫn
  // coi là đang kéo thì mọi lần rê chuột sau đó đều tô bậy.
  useEffect(() => {
    const thoi = () => { dangKeo.current = false; };
    window.addEventListener('mouseup', thoi);
    return () => window.removeEventListener('mouseup', thoi);
  }, []);

  /**
   * Đóng bảng chọn: Esc, hoặc bấm ra ngoài.
   *
   * ⚠️ KHÔNG dùng tấm phủ `position: fixed` để bắt cú bấm ngoài. Đã thử và
   * hỏng: tấm phủ nằm ở ngữ cảnh xếp lớp khác nên `z-index` của bảng chọn
   * không thắng được nó, và mọi cú bấm vào chính bảng đều bị tấm phủ nuốt —
   * playwright báo thẳng "ct-tq-chon-nen intercepts pointer events". Lắng nghe
   * ở `document` thì không có gì nằm đè lên ai.
   */
  useEffect(() => {
    if (dangChon === null) return;
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') datDangChon(null); };
    const bam = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('.ct-tq-chon') || t?.closest('.ct-tq-gio')) return;
      datDangChon(null);
    };
    window.addEventListener('keydown', phim);
    // `mousedown` chứ không `click`: bấm-rồi-kéo để tô cũng phải đóng bảng ngay.
    document.addEventListener('mousedown', bam);
    return () => {
      window.removeEventListener('keydown', phim);
      document.removeEventListener('mousedown', bam);
    };
  }, [dangChon]);

  /** Tick một việc. Đổi giao diện TRƯỚC rồi mới gọi máy chủ — tick mà phải chờ mạng thì cảm giác như app đơ. */
  const tick = async (t: Task) => {
    if (!api) return;
    const truoc = du;
    setDu((c) => c && ({ ...c, tasks: c.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) }));
    try {
      await api.request(`/api/v1/dashboard/tasks/${t.id}`, {
        method: 'PATCH', body: { done: !t.done },
      });
      void nap(); // EXP/cấp do máy chủ tính — lấy lại con số thật
    } catch {
      setDu(truoc); // máy chủ từ chối ⇒ trả giao diện về đúng sự thật
    }
  };

  const them = async () => {
    const ten = nhap.trim();
    if (!ten || !api || dangThem) return;
    setDangThem(true);
    try {
      await api.request('/api/v1/dashboard/tasks', {
        method: 'POST', body: { title: ten, scope: 'today', date: ngay },
      });
      setNhap('');
      await nap();
      oNhap.current?.focus();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangThem(false);
    }
  };

  const xoa = async (t: Task) => {
    if (!api) return;
    setDu((c) => c && ({ ...c, tasks: c.tasks.filter((x) => x.id !== t.id) }));
    try { await api.request(`/api/v1/dashboard/tasks/${t.id}`, { method: 'DELETE' }); }
    catch { void nap(); }
  };

  const gio = bayGio.getHours();
  const phanTramExp = du ? Math.min(100, Math.round(((du.exp % EXP_MOI_CAP) / EXP_MOI_CAP) * 100)) : 0;

  return (
    <div className="ct-page ct-tq">
      {/* ── Lời chào ───────────────────────────────────────── */}
      <header className="ct-tq-chao">
        <div>
          <h1 className="ct-tq-chao-chu">
            {loiChao(gio)}{user?.username ? `, ${user.username}` : ''}
          </h1>
          <p className="ct-tq-chao-ngay">
            {THU[bayGio.getDay()]}, {bayGio.getDate()}/{bayGio.getMonth() + 1}/{bayGio.getFullYear()}
            <span className="ct-tq-cham" />
            {String(gio).padStart(2, '0')}:{String(bayGio.getMinutes()).padStart(2, '0')}
          </p>
        </div>

        {du && (
          /* Vòng + chữ là MỘT khối. Tách rời thì vòng lơ lửng giữa tiêu đề và
             con số, mắt không biết đọc cái nào trước. */
          <div className="ct-tq-tiendo">
            <div className="ct-tq-cap" title={`${du.exp % EXP_MOI_CAP}/${EXP_MOI_CAP} EXP tới cấp ${du.level + 1}`}>
              <svg viewBox="0 0 44 44" className="ct-tq-vong" aria-hidden>
                <circle cx="22" cy="22" r="19" className="ct-tq-vong-nen" />
                <circle
                  cx="22" cy="22" r="19" className="ct-tq-vong-chay"
                  strokeDasharray={`${(phanTramExp / 100) * 119.4} 119.4`}
                />
              </svg>
              <div className="ct-tq-cap-so">
                <strong>{du.level}</strong>
                <span>cấp</span>
              </div>
            </div>
            {/* Vòng ở cấp 1 với 0 EXP gần như rỗng — nhìn như hỏng. Con số viết
                ra mới trả lời được "còn bao xa nữa". */}
            <p className="ct-tq-exp-chu">
              {du.exp % EXP_MOI_CAP}<i>/{EXP_MOI_CAP} EXP</i>
              <span>tới cấp {du.level + 1}</span>
            </p>
          </div>
        )}
      </header>

      {loi && (
        <div className="ct-notice" data-tone="warn" style={{ marginBottom: 14 }}>
          <span>{loi}</span>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={13} aria-hidden /> Thử lại
          </button>
        </div>
      )}

      {/* ── Ba ô nhịp ──────────────────────────────────────── */}
      <div className="ct-tq-nhip">
        <div className="ct-tq-o" data-nhan="viec">
          <span className="ct-tq-o-so">{xong}<i>/{viecHomNay.length}</i></span>
          <span className="ct-tq-o-nhan">việc hôm nay</span>
          {viecHomNay.length > 0 && (
            <div className="ct-tq-o-thanh">
              <div style={{ width: `${(xong / viecHomNay.length) * 100}%` }} />
            </div>
          )}
        </div>

        <button type="button" className="ct-tq-o ct-tq-o-bam" data-nhan="tin"
          onClick={() => navigate('/messages')} disabled={!chuaDoc.tinNhan}>
          <MessageSquare size={15} aria-hidden className="ct-tq-o-icon" />
          <span className="ct-tq-o-so">{chuaDoc.tinNhan}</span>
          <span className="ct-tq-o-nhan">tin nhắn chưa đọc</span>
        </button>

        <button type="button" className="ct-tq-o ct-tq-o-bam" data-nhan="bao"
          onClick={() => navigate('/notifications')} disabled={!chuaDoc.thongBao}>
          <Bell size={15} aria-hidden className="ct-tq-o-icon" />
          <span className="ct-tq-o-so">{chuaDoc.thongBao}</span>
          <span className="ct-tq-o-nhan">thông báo mới</span>
        </button>

        <div className="ct-tq-o" data-nhan="exp">
          <Flame size={15} aria-hidden className="ct-tq-o-icon" />
          <span className="ct-tq-o-so">{du?.totalExp ?? 0}</span>
          <span className="ct-tq-o-nhan">tổng EXP</span>
        </div>
      </div>

      {/* ── Việc hôm nay ───────────────────────────────────── */}
      <section className="ct-tq-khoi">
        <div className="ct-tq-khoi-dau">
          <h2>Việc hôm nay</h2>
          {viecHomNay.length > 0 && xong === viecHomNay.length && (
            <span className="ct-tq-xong-het"><Check size={12} aria-hidden /> xong hết</span>
          )}
          <span className="ct-tq-khoi-phu">
            {conLai.tuan > 0 && <>còn {conLai.tuan} việc tuần này</>}
            {conLai.tuan > 0 && conLai.thang > 0 && ' · '}
            {conLai.thang > 0 && <>{conLai.thang} việc tháng này</>}
          </span>
        </div>

        <div className="ct-tq-them">
          <input
            ref={oNhap}
            value={nhap}
            placeholder="Thêm một việc cho hôm nay…"
            maxLength={200}
            onChange={(e) => setNhap(e.target.value)}
            onKeyDown={(e) => {
              // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') { e.preventDefault(); void them(); }
            }}
          />
          <button type="button" className="ct-btn" onClick={() => void them()}
            disabled={!nhap.trim() || dangThem}>
            <Plus size={14} aria-hidden /> Thêm
          </button>
        </div>

        {dangTai && !du ? (
          <p className="ct-muted" style={{ padding: '10px 2px' }}>Đang tải…</p>
        ) : viecHomNay.length === 0 ? (
          <p className="ct-tq-trong">Chưa có việc nào cho hôm nay. Gõ vào ô trên để thêm.</p>
        ) : (
          <ul className="ct-tq-ds">
            {viecHomNay.map((t) => (
              <li key={t.id} className="ct-tq-viec" data-xong={t.done}>
                <button type="button" className="ct-tq-tick" onClick={() => void tick(t)}
                  aria-label={t.done ? 'Bỏ đánh dấu xong' : 'Đánh dấu xong'}>
                  {t.done && <Check size={12} aria-hidden />}
                </button>
                <span className="ct-tq-viec-ten">{t.title}</span>
                <span className="ct-tq-viec-exp">+{t.exp}</span>
                <button type="button" className="ct-tq-xoa" onClick={() => void xoa(t)} aria-label="Xoá việc">
                  <Trash2 size={13} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Dòng thời gian 24 giờ ──────────────────────────── */}
      {du && (
        <section className="ct-tq-khoi">
          <div className="ct-tq-khoi-dau"><h2>Một ngày của bạn</h2></div>
          <div className="ct-tq-dong">
            {du.timeline.map((s) => {
              const h = s.activity ? THEO_KHOA.get(s.activity.type as never) : null;
              return (
                <button
                  key={s.hour}
                  type="button"
                  className="ct-tq-gio"
                  data-co={!!s.activity}
                  data-qua={s.hour < gio}
                  data-nay={s.hour === gio}
                  data-mo={dangChon === s.hour}
                  style={h ? { background: h.mau } : undefined}
                  onMouseDown={() => { dangKeo.current = true; gioBatDau.current = s.hour; datDangChon(s.hour); }}
                  /* Kéo qua để tô hàng loạt bằng cọ vừa chọn. Không có nó thì
                     đặt 8 tiếng ngủ là tám lần bấm + tám lần chọn. */
                  onMouseEnter={() => {
                    if (!dangKeo.current || !co) return;
                    datDangChon(null);
                    // Tô bù ô xuất phát ở lần rê đầu tiên.
                    const bd = gioBatDau.current;
                    gioBatDau.current = null;
                    datGio(s.hour, co, bd === null ? undefined : bd);
                  }}
                  title={`${String(s.hour).padStart(2, '0')}:00${s.activity ? ` — ${s.activity.label}` : ''}`}
                  aria-label={`Đặt hoạt động cho ${s.hour} giờ`}
                >
                  {s.hour % 3 === 0 && <span className="ct-tq-gio-nhan">{s.hour}</span>}
                </button>
              );
            })}

            {dangChon !== null && (
              <div
                  className="ct-tq-chon"
                  /* Neo theo cột giờ, và kẹp lại để bảng không tràn khỏi mép
                     phải khi bấm vào những giờ cuối ngày. */
                  style={{ left: `${Math.min(Math.max(dangChon / 24, 0.02), 0.62) * 100}%` }}
                >
                  <div className="ct-tq-chon-dau">
                    <strong>{String(dangChon).padStart(2, '0')}:00</strong>
                    <button type="button" onClick={() => datDangChon(null)} aria-label="Đóng">
                      <X size={13} aria-hidden />
                    </button>
                  </div>
                  <div className="ct-tq-chon-luoi">
                    {HOAT_DONG.map(({ khoa, ten, mau, Icon }) => (
                      <button
                        key={khoa}
                        type="button"
                        className="ct-tq-chon-muc"
                        data-chon={du.timeline[dangChon]?.activity?.type === khoa}
                        onMouseDown={(e) => { e.stopPropagation(); datGio(dangChon, khoa); }}
                      >
                        <span className="ct-tq-chon-cham" style={{ background: mau }} />
                        <Icon size={13} aria-hidden />
                        {ten}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ct-tq-chon-bo"
                    onMouseDown={(e) => { e.stopPropagation(); datGio(dangChon, null); }}
                  >
                    Bỏ trống giờ này
                  </button>
              </div>
            )}
          </div>
          <p className="ct-tq-goi">
            {coHoatDong
              ? 'Bấm một ô để đổi hoạt động. Chọn xong thì KÉO ngang để tô nhanh nhiều giờ liền nhau.'
              : 'Phần đậm là số giờ đã trôi qua hôm nay. Bấm một ô để đặt hoạt động — chọn xong thì kéo ngang để tô cả một khoảng.'}
          </p>
        </section>
      )}

      {/* ── Đi nhanh ───────────────────────────────────────── */}
      <section className="ct-tq-khoi">
        <div className="ct-tq-khoi-dau"><h2>Đi nhanh</h2></div>
        <div className="ct-tq-nhanh">
          {([
            { p: '/chat', t: 'AI Chat', m: 'Hỏi đáp, lập trình, chạy code' },
            { p: '/notes', t: 'Ghi chú', m: 'Sổ tay học tập' },
            { p: '/music', t: 'Nhạc', m: 'Nghe online hoặc đã tải' },
            { p: '/cv', t: 'CV', m: 'Dựng và mổ CV' },
          ] as const).map((x) => (
            <button key={x.p} type="button" className="ct-tq-link" onClick={() => navigate(x.p)}>
              <span>
                <strong>{x.t}</strong>
                <em>{x.m}</em>
              </span>
              <ChevronRight size={15} aria-hidden />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
