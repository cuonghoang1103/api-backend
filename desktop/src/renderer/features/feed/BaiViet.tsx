/**
 * ============================================================
 * MỘT BÀI VIẾT TRÊN BẢNG TIN
 * ============================================================
 *
 * Đối chiếu `src/routes/social.routes.ts` (mount `/api/v1/feed`):
 *   POST   /posts/:id/react     { type }        → đổi cảm xúc
 *   POST   /posts/:id/save      · DELETE
 *   POST   /posts/:id/share     { platform }
 *   DELETE /posts/:id                            → chỉ bài của mình
 *   POST   /polls/:id/vote      { optionIds }
 *   GET    /posts/:id/comments?limit=            → kèm sẵn `replies`
 *   POST   /comments            { postId, parentId?, content }
 *   POST   /comments/:id/like   · DELETE
 *
 * ─── CẢM XÚC: DỮ LIỆU ĐÃ CÓ SẴN TỪ LÂU ───
 * `serializePost` trả `myReaction` và `reactionBreakdown` từ 20/06/2026. App
 * bỏ phí cả hai và chỉ dùng `isLiked`/`likesCount` — nên bảng tin trong app
 * mất hẳn một tầng thông tin mà máy chủ vẫn gửi đều mỗi lần tải. Không phải
 * thiếu API, chỉ là không ai đọc.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bookmark, Check, Download, FileText, Link2, MapPin, MessageCircle,
  MoreHorizontal, Repeat2, Send, Trash2,
} from 'lucide-react';

import { useSession } from '../../auth/session';
import { NoiDungBai, maYouTube } from './noiDung';
import {
  CAM_XUC, MAT_CAM_XUC, coTep, chuanHoa, khiNao, ten, tongCamXuc, topCamXuc,
  type Bai, type BinhLuan, type CamXuc, type Media, type TacGia,
} from './kieu';

/** Giữ chuột bao lâu thì bung bảng chọn cảm xúc. Facebook dùng ~300ms. */
const GIU_DE_CHON_MS = 320;

export function BaiViet({
  bai, onDoi, onXoa, onXemAnh,
}: {
  bai: Bai;
  onDoi: (b: Bai) => void;
  onXoa: (id: number) => void;
  onXemAnh: (ds: Media[], i: number) => void;
}) {
  const { api, userId } = useSession();
  const [moBinhLuan, datMoBinhLuan] = useState(false);
  const [moMenu, datMoMenu] = useState(false);
  const [daChep, datDaChep] = useState(false);

  const laCuaMinh = userId != null && bai.author?.id === userId;

  /**
   * Đổi cảm xúc.
   *
   * Bấm lại đúng cảm xúc đang chọn = bỏ. Máy chủ đã xử lý việc này (`reactPost`
   * trả `reacted:false`), nhưng giao diện phải đoán đúng NGAY để không nhấp
   * nháy — chờ mạng mới đổi mặt cười thì cảm giác như app đơ.
   */
  const doiCamXuc = async (loai: CamXuc) => {
    if (!api) return;
    const cu = bai.myReaction ?? null;
    const moi: CamXuc | null = cu === loai ? null : loai;
    const bd = { ...(bai.reactionBreakdown ?? { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 }) };
    if (cu) bd[cu] = Math.max(0, (bd[cu] ?? 0) - 1);
    if (moi) bd[moi] = (bd[moi] ?? 0) + 1;
    onDoi({
      ...bai,
      myReaction: moi,
      isLiked: !!moi,
      reactionBreakdown: bd,
      likesCount: Math.max(0, bai.likesCount + (moi ? (cu ? 0 : 1) : -1)),
    });
    try {
      // Bỏ cảm xúc = gửi lại ĐÚNG loại đang chọn; máy chủ tự hiểu là gỡ.
      await api.request(`/api/v1/feed/posts/${bai.id}/react`, {
        method: 'POST', body: { type: loai },
      });
    } catch {
      onDoi(bai); // trả về đúng trạng thái trước khi bấm
    }
  };

  const luu = async () => {
    if (!api) return;
    const moi = !bai.isSaved;
    onDoi({ ...bai, isSaved: moi, savesCount: Math.max(0, bai.savesCount + (moi ? 1 : -1)) });
    try {
      await api.request(`/api/v1/feed/posts/${bai.id}/save`, { method: moi ? 'POST' : 'DELETE' });
    } catch { onDoi(bai); }
  };

  const chiaSe = async () => {
    if (!api || bai.isShared) return;
    onDoi({ ...bai, isShared: true, sharesCount: (bai.sharesCount ?? 0) + 1 });
    try {
      await api.request(`/api/v1/feed/posts/${bai.id}/share`, {
        method: 'POST', body: { platform: 'APP' },
      });
    } catch { onDoi(bai); }
  };

  const chepLink = async () => {
    await navigator.clipboard.writeText(`https://cuongthai.com/feed/${bai.id}`);
    datDaChep(true);
    datMoMenu(false);
    setTimeout(() => datDaChep(false), 1600);
  };

  const xoa = async () => {
    if (!api) return;
    datMoMenu(false);
    onXoa(bai.id);
    try {
      await api.request(`/api/v1/feed/posts/${bai.id}`, { method: 'DELETE' });
    } catch { /* danh sách sẽ đúng lại ở lần làm mới kế tiếp */ }
  };

  const ma = maYouTube(bai.youtubeUrl);
  const anh = bai.media.filter((m) => m.type === 'IMAGE' || m.type === 'VIDEO');
  const tep = bai.media.filter((m) => m.type === 'FILE');
  const tong = tongCamXuc(bai);
  const top = topCamXuc(bai);

  return (
    <article className="ct-bt-bai">
      <header className="ct-bt-dau">
        <Avatar t={bai.author} />
        <div className="ct-bt-dau-chu">
          <strong>{ten(bai.author)}</strong>
          <span>
            {khiNao(bai.createdAt)}
            {bai.locationName && <> · <MapPin size={10} aria-hidden /> {bai.locationName}</>}
            {bai.viewCount ? ` · ${bai.viewCount} lượt xem` : ''}
          </span>
        </div>

        <div className="ct-bt-menu-boc">
          <button
            type="button"
            className="ct-bt-menu-nut"
            aria-label="Tuỳ chọn bài viết"
            onClick={() => datMoMenu((v) => !v)}
          >
            <MoreHorizontal size={17} aria-hidden />
          </button>
          {moMenu && (
            <>
              {/* Lớp phủ trong suốt để bấm ra ngoài là đóng. Rẻ hơn hẳn một
                  listener trên `document` phải tự gỡ đúng lúc. */}
              <div className="ct-bt-menu-nen" onClick={() => datMoMenu(false)} />
              <div className="ct-bt-menu" role="menu">
                <button type="button" onClick={() => void chepLink()}>
                  <Link2 size={14} aria-hidden /> Sao chép liên kết
                </button>
                {laCuaMinh && (
                  <button type="button" data-nguy="true" onClick={() => void xoa()}>
                    <Trash2 size={14} aria-hidden /> Xoá bài
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {bai.content && <NoiDungBai chu={bai.content} />}

      {ma && (
        <div className="ct-bt-yt">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ma}`}
            title="YouTube"
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      {anh.length > 0 && <LuoiAnh media={anh} onXem={(i) => onXemAnh(anh, i)} />}

      {tep.map((t) => (
        <a key={t.id} className="ct-bt-tep" href={t.url} target="_blank" rel="noreferrer noopener">
          <FileText size={17} aria-hidden />
          <span>
            <strong>{t.fileName || 'Tệp đính kèm'}</strong>
            {t.fileSize ? <em>{coTep(t.fileSize)}</em> : null}
          </span>
          <Download size={15} aria-hidden />
        </a>
      ))}

      {bai.poll?.options?.length ? <Phieu bai={bai} onDoi={onDoi} /> : null}

      {/* ── Dòng tổng kết: cụm mặt cười + số bình luận, như Facebook ── */}
      {(tong > 0 || bai.commentsCount > 0 || (bai.sharesCount ?? 0) > 0) && (
        <div className="ct-bt-tong">
          {tong > 0 && (
            <span className="ct-bt-tong-cx">
              {top.map((k) => (
                <i key={k} title={MAT_CAM_XUC[k].ten}>{MAT_CAM_XUC[k].hinh}</i>
              ))}
              <em>{tong}</em>
            </span>
          )}
          <span className="ct-bt-tong-phai">
            {bai.commentsCount > 0 && (
              <button type="button" onClick={() => datMoBinhLuan((v) => !v)}>
                {bai.commentsCount} bình luận
              </button>
            )}
            {(bai.sharesCount ?? 0) > 0 && <span>{bai.sharesCount} chia sẻ</span>}
          </span>
        </div>
      )}

      <footer className="ct-bt-nut">
        <NutCamXuc bai={bai} onChon={(k) => void doiCamXuc(k)} />
        <button type="button" onClick={() => datMoBinhLuan((v) => !v)} data-bat={moBinhLuan}>
          <MessageCircle size={17} aria-hidden /> Bình luận
        </button>
        <button type="button" onClick={() => void chiaSe()} data-bat={bai.isShared}>
          <Repeat2 size={17} aria-hidden /> {bai.isShared ? 'Đã chia sẻ' : 'Chia sẻ'}
        </button>
        <button type="button" onClick={() => void luu()} data-bat={bai.isSaved} className="ct-bt-luu">
          <Bookmark size={17} aria-hidden fill={bai.isSaved ? 'currentColor' : 'none'} />
          {bai.isSaved ? 'Đã lưu' : 'Lưu'}
        </button>
      </footer>

      {daChep && <p className="ct-bt-dachep"><Check size={13} aria-hidden /> Đã sao chép liên kết</p>}

      {moBinhLuan && <KhungBinhLuan bai={bai} onDoi={onDoi} />}
    </article>
  );
}

// ════════════════════════════════════════════════════════════
// Cảm xúc
// ════════════════════════════════════════════════════════════

/**
 * Nút cảm xúc: bấm nhanh = Thích, GIỮ = bung bảng năm mặt.
 *
 * ⚠️ Dùng `pointerdown/up` chứ không `mousedown/up`. Máy có màn cảm ứng (và
 * Windows tablet) gửi sự kiện pointer; nghe mouse thì trên những máy đó nút
 * chỉ hoạt động một nửa, và không có lỗi nào để thấy.
 */
function NutCamXuc({ bai, onChon }: { bai: Bai; onChon: (k: CamXuc) => void }) {
  const [mo, datMo] = useState(false);
  const henRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dangChon = bai.myReaction ?? null;
  const mat = dangChon ? MAT_CAM_XUC[dangChon] : null;

  const huyHen = () => {
    if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
  };

  /* Dọn hẹn giờ khi component bị tháo — không thì `datMo` chạy trên một
     component đã chết mỗi lần người dùng cuộn qua một bài đang giữ chuột. */
  useEffect(() => huyHen, []);

  return (
    <div
      className="ct-bt-cx-boc"
      onPointerLeave={() => { huyHen(); datMo(false); }}
    >
      <button
        type="button"
        className="ct-bt-cx-nut"
        data-bat={!!dangChon}
        style={dangChon ? { color: mat!.mau } : undefined}
        onPointerDown={() => {
          huyHen();
          henRef.current = setTimeout(() => { datMo(true); henRef.current = null; }, GIU_DE_CHON_MS);
        }}
        onPointerUp={() => {
          // Bảng đã bung thì thả tay KHÔNG chọn gì — người dùng đang nhắm mặt.
          if (henRef.current) { huyHen(); onChon(dangChon ?? 'LIKE'); }
        }}
        onPointerCancel={huyHen}
      >
        <span className="ct-bt-cx-hinh">{mat ? mat.hinh : '👍'}</span>
        {mat ? mat.ten : 'Thích'}
      </button>

      {mo && (
        <div className="ct-bt-cx-bang" role="menu">
          {CAM_XUC.map((k, i) => (
            <button
              key={k}
              type="button"
              title={MAT_CAM_XUC[k].ten}
              aria-label={MAT_CAM_XUC[k].ten}
              style={{ animationDelay: `${i * 34}ms` }}
              onClick={() => { datMo(false); onChon(k); }}
            >
              {MAT_CAM_XUC[k].hinh}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Bình chọn
// ════════════════════════════════════════════════════════════

function Phieu({ bai, onDoi }: { bai: Bai; onDoi: (b: Bai) => void }) {
  const { api } = useSession();
  const p = bai.poll!;
  const daChon = new Set(p.userVotes ?? []);
  const tong = (p.options ?? []).reduce((s, o) => s + (o.votesCount ?? 0), 0);
  const hetHan = p.expiresAt ? new Date(p.expiresAt).getTime() < Date.now() : false;

  const bau = async (id: number) => {
    if (!api || hetHan) return;
    const nhieu = !!p.multipleChoice;
    const moi = new Set(daChon);
    if (moi.has(id)) moi.delete(id);
    else {
      if (!nhieu) moi.clear();
      moi.add(id);
    }
    const ds = [...moi];

    // Đổi số đếm ngay: chờ mạng thì thanh không nhúc nhích và người dùng bấm lại.
    onDoi({
      ...bai,
      poll: {
        ...p,
        userVotes: ds,
        options: (p.options ?? []).map((o) => {
          const truoc = daChon.has(o.id);
          const sau = moi.has(o.id);
          if (truoc === sau) return o;
          return { ...o, votesCount: Math.max(0, (o.votesCount ?? 0) + (sau ? 1 : -1)) };
        }),
      },
    });

    try {
      await api.request(`/api/v1/feed/polls/${p.id}/vote`, {
        method: 'POST', body: { optionIds: ds },
      });
    } catch { onDoi(bai); }
  };

  return (
    <div className="ct-bt-phieu">
      {p.question && <strong className="ct-bt-phieu-hoi">{p.question}</strong>}
      {(p.options ?? []).map((o) => {
        const so = o.votesCount ?? 0;
        const phanTram = tong > 0 ? Math.round((so / tong) * 100) : 0;
        const chon = daChon.has(o.id);
        return (
          <button
            key={o.id}
            type="button"
            className="ct-bt-phieu-muc"
            data-chon={chon}
            disabled={hetHan}
            onClick={() => void bau(o.id)}
          >
            <span className="ct-bt-phieu-thanh" style={{ width: `${phanTram}%` }} aria-hidden />
            <span className="ct-bt-phieu-chu">
              {chon && <Check size={13} aria-hidden />}
              {o.text}
            </span>
            <em>{phanTram}%</em>
          </button>
        );
      })}
      <span className="ct-bt-phieu-chan">
        {tong} lượt bình chọn{hetHan ? ' · đã kết thúc' : ''}
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Bình luận
// ════════════════════════════════════════════════════════════

interface BinhLuanDay extends BinhLuan {
  replies?: BinhLuan[];
  repliesCount?: number;
}

function KhungBinhLuan({ bai, onDoi }: { bai: Bai; onDoi: (b: Bai) => void }) {
  const { api } = useSession();
  const [ds, datDs] = useState<BinhLuanDay[] | null>(null);
  const [traLoiCho, datTraLoiCho] = useState<number | null>(null);

  const nap = useCallback(async () => {
    if (!api) return;
    try {
      const r = await api.request<BinhLuanDay[]>(`/api/v1/feed/posts/${bai.id}/comments?limit=20`);
      datDs(Array.isArray(r) ? r : []);
    } catch { datDs([]); }
  }, [api, bai.id]);

  useEffect(() => { void nap(); }, [nap]);

  const gui = async (chu: string, parentId: number | null) => {
    if (!api) return;
    await api.request('/api/v1/feed/comments', {
      method: 'POST',
      body: { postId: bai.id, content: chu, ...(parentId ? { parentId } : {}) },
    });
    datTraLoiCho(null);
    onDoi({ ...bai, commentsCount: bai.commentsCount + 1 });
    await nap();
  };

  const thichBl = async (c: BinhLuan) => {
    if (!api) return;
    const moi = !c.isLiked;
    /* `exactOptionalPropertyTypes` bật: gán `replies: undefined` KHÔNG giống
       với việc bỏ hẳn trường. Nên chỉ dựng lại `replies` khi nó thật sự có. */
    const doiMot = (x: BinhLuan): BinhLuan => (x.id === c.id
      ? { ...x, isLiked: moi, likesCount: Math.max(0, (x.likesCount ?? 0) + (moi ? 1 : -1)) }
      : x);
    const doi = (x: BinhLuanDay): BinhLuanDay => {
      const goc = doiMot(x) as BinhLuanDay;
      return x.replies ? { ...goc, replies: x.replies.map(doiMot) } : goc;
    };
    datDs((cu) => cu?.map(doi) ?? cu);
    try {
      await api.request(`/api/v1/feed/comments/${c.id}/like`, { method: moi ? 'POST' : 'DELETE' });
    } catch { void nap(); }
  };

  return (
    <div className="ct-bt-bl">
      <SoanBinhLuan onGui={(chu) => gui(chu, null)} tuDong={false} />

      {ds === null && <p className="ct-muted ct-bt-bl-trong">Đang tải bình luận…</p>}
      {ds?.length === 0 && <p className="ct-muted ct-bt-bl-trong">Chưa có bình luận nào.</p>}

      {ds?.map((c) => (
        <div key={c.id} className="ct-bt-bl-nhom">
          <MotBinhLuan c={c} onThich={() => void thichBl(c)} onTraLoi={() => datTraLoiCho(c.id)} />

          {c.replies?.map((r) => (
            <div key={r.id} className="ct-bt-bl-con">
              <MotBinhLuan c={r} onThich={() => void thichBl(r)} onTraLoi={() => datTraLoiCho(c.id)} />
            </div>
          ))}

          {(c.repliesCount ?? 0) > (c.replies?.length ?? 0) && (
            <span className="ct-bt-bl-con-them">
              còn {(c.repliesCount ?? 0) - (c.replies?.length ?? 0)} trả lời nữa — xem trên web
            </span>
          )}

          {traLoiCho === c.id && (
            <div className="ct-bt-bl-con">
              <SoanBinhLuan
                tuDong
                goiY={`Trả lời ${ten(c.author ?? c.user)}…`}
                onGui={(chu) => gui(chu, c.id)}
                onHuy={() => datTraLoiCho(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MotBinhLuan({
  c, onThich, onTraLoi,
}: { c: BinhLuan; onThich: () => void; onTraLoi: () => void }) {
  const t = c.author ?? c.user ?? null;
  return (
    <div className="ct-bt-bl-muc">
      <Avatar t={t} nho />
      <div className="ct-bt-bl-than">
        <div className="ct-bt-bl-bong">
          <strong>{ten(t)}</strong>
          <p>{c.content}</p>
        </div>
        <div className="ct-bt-bl-hanh">
          <button type="button" data-bat={!!c.isLiked} onClick={onThich}>
            Thích{c.likesCount ? ` · ${c.likesCount}` : ''}
          </button>
          <button type="button" onClick={onTraLoi}>Trả lời</button>
          <span>{khiNao(c.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function SoanBinhLuan({
  onGui, onHuy, goiY = 'Viết bình luận…', tuDong,
}: {
  onGui: (chu: string) => Promise<void>;
  onHuy?: () => void;
  goiY?: string;
  tuDong?: boolean;
}) {
  const [chu, datChu] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const oRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (tuDong) oRef.current?.focus(); }, [tuDong]);

  const gui = async () => {
    const t = chu.trim();
    if (!t || dangGui) return;
    datDangGui(true);
    try {
      await onGui(t);
      datChu('');
    } catch { /* giữ nguyên chữ đã gõ để người dùng thử lại */ }
    finally { datDangGui(false); }
  };

  return (
    <div className="ct-bt-bl-soan">
      <input
        ref={oRef}
        value={chu}
        placeholder={goiY}
        maxLength={2000}
        onChange={(e) => datChu(e.target.value)}
        onKeyDown={(e) => {
          // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
          if (e.nativeEvent.isComposing) return;
          if (e.key === 'Enter') { e.preventDefault(); void gui(); }
          if (e.key === 'Escape' && onHuy) onHuy();
        }}
      />
      <button type="button" className="ct-btn" onClick={() => void gui()} disabled={!chu.trim() || dangGui}>
        <Send size={13} aria-hidden />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Ảnh, video, avatar
// ════════════════════════════════════════════════════════════

export function Avatar({ t, nho }: { t?: TacGia | null; nho?: boolean }) {
  const chu = ten(t).trim().charAt(0).toUpperCase() || '?';
  if (t?.avatarUrl) {
    return <img className="ct-bt-avt" data-nho={!!nho} src={t.avatarUrl} alt="" loading="lazy" />;
  }
  return <span className="ct-bt-avt" data-nho={!!nho} data-chu="true">{chu}</span>;
}

/**
 * Lưới ảnh/video.
 *
 * ⚠️ TỈ LỆ THẬT, không ép khung. Bản web từng nhét mọi video vào một khung dọc
 * cố định `min(88vh, 880px)` kèm `object-contain`, nên video NGANG hiện ra với
 * hai vệt đen kín trên dưới (02/07/2026). Media đã mang sẵn `width`/`height` —
 * dùng đúng nó, và chỉ kẹp lại khi ảnh quá dài để một bài không chiếm cả màn.
 */
function LuoiAnh({ media, onXem }: { media: Media[]; onXem: (i: number) => void }) {
  if (media.length === 1) {
    const m = media[0]!;
    const w = m.width ?? 0;
    const h = m.height ?? 0;
    // Ảnh dọc quá khổ (truyện tranh, ảnh chụp màn hình dài) bị kẹp ở 4:5, phần
    // dư cắt bớt — thà thấy một phần đẹp còn hơn phải cuộn ba màn hình.
    const tiLe = w > 0 && h > 0 ? Math.max(w / h, 0.8) : 1.6;
    return (
      <div className="ct-bt-anh-mot" style={{ aspectRatio: String(tiLe) }}>
        <MotMedia m={m} onXem={() => onXem(0)} />
      </div>
    );
  }
  return (
    <div className="ct-bt-luoi" data-so={Math.min(media.length, 4)}>
      {media.slice(0, 4).map((m, i) => (
        <div key={m.id} className="ct-bt-luoi-o">
          <MotMedia m={m} onXem={() => onXem(i)} />
          {i === 3 && media.length > 4 && <span className="ct-bt-them-anh">+{media.length - 4}</span>}
        </div>
      ))}
    </div>
  );
}

function MotMedia({ m, onXem }: { m: Media; onXem: () => void }) {
  if (m.type === 'VIDEO') {
    return <video src={m.url} poster={m.thumbnail ?? undefined} controls preload="none" playsInline />;
  }
  return (
    <img
      src={m.url}
      alt=""
      loading="lazy"
      onClick={onXem}
      style={{ cursor: 'zoom-in' }}
    />
  );
}

export { chuanHoa };
