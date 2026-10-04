/**
 * Bảng xếp hạng: Top 100 Việt Nam · Thịnh hành trên YouTube · Gợi ý cho bạn.
 *
 * Dữ liệu từ `GET /api/v1/music/charts` (máy chủ cập nhật mỗi sáng 06:05, xem
 * `src/services/music-charts.service.ts`). Phát bằng TRÌNH NHÚNG CHÍNH THỨC của
 * YouTube qua lớp phủ `KhungVideo` (giống video bài học) — không tải, không
 * rút âm thanh. Bài trong Top 100 chưa có video thì bấm phát mới hỏi máy chủ
 * ghép (một lần, rồi máy chủ nhớ mãi), để không đốt quota tìm kiếm cho 100 bài.
 */
import { useEffect, useState } from 'react';
import { Loader2, Play, RefreshCw, Sparkles, TrendingUp, Trophy, Youtube } from 'lucide-react';
import { useAppState } from '../../app-state';
import { ApiError } from '../../api/client';
import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';
import { KhungVideo } from '../academy/KhungVideo';
import { AnhBia } from './dungChung';
import { clock, useMusicPlayer } from './player';

interface BaiTop { hang: number; id: string; ten: string; ngheSi: string; anh: string; theLoai: string[]; videoId: string | null; daGhep: boolean }
interface VideoTH { hang: number; videoId: string; ten: string; kenh: string; anh: string; thoiLuong: number | null }
interface Bang { layLuc: string; appleCapNhat: string | null; top100: BaiTop[]; thinhHanh: VideoTH[] }
interface GoiY { ngheSiGu: string[]; ds: { loai: 'top' | 'yt'; id: string; ten: string; ngheSi: string; anh: string; videoId: string | null; lyDo: string }[] }
type The = 'top' | 'yt' | 'goi-y';

export function BangXepHang() {
  const { dich, dichP } = useDich();
  const { api } = useSession();
  const { online } = useAppState();
  const { playing, toggle } = useMusicPlayer();
  const [the, setThe] = useState<The>('top');
  const [bang, setBang] = useState<Bang | null>(null);
  const [goiY, setGoiY] = useState<GoiY | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [dangGhep, setDangGhep] = useState<string | null>(null);
  const [dangXem, setDangXem] = useState<{ videoId: string; ten: string; ngheSi: string } | null>(null);

  const nap = async () => {
    if (!api || !online) return;
    setDangTai(true);
    setLoi(null);
    try { setBang(await api.request<Bang>('/api/v1/music/charts')); }
    catch (e) {
      /* 404 = máy chủ đang chạy bản CŨ hơn app (chưa có tuyến này) — nói thẳng
         điều đó, đừng phơi tên route ra màn hình (cùng cách với `MucDung.tsx`). */
      const cu = e instanceof ApiError && e.failure.kind === 'rejected' && e.failure.status === 404;
      setLoi(cu ? dich('Máy chủ chưa có bảng xếp hạng — mục này tự hiện sau lần cập nhật máy chủ kế tiếp.') : e instanceof Error ? e.message : String(e));
    }
    finally { setDangTai(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void nap(); }, [api, online]);
  useEffect(() => {
    if (the !== 'goi-y' || !api || goiY) return;
    void api.request<GoiY>('/api/v1/music/charts/goi-y').then(setGoiY).catch((e: unknown) => setLoi(e instanceof Error ? e.message : String(e)));
  }, [the, api, goiY]);

  const xem = (videoId: string, ten: string, ngheSi: string) => {
    // Hai nguồn tiếng cùng lúc là tra tấn — dừng trình phát nhạc của app trước.
    if (playing) toggle();
    setDangXem({ videoId, ten, ngheSi });
  };

  const phatTop = async (b: { id: string; ten: string; ngheSi: string; videoId: string | null }) => {
    if (b.videoId) { xem(b.videoId, b.ten, b.ngheSi); return; }
    if (!api) return;
    setDangGhep(b.id);
    setLoi(null);
    try {
      const r = await api.request<{ videoId: string | null }>(`/api/v1/music/charts/${b.id}/video`, { method: 'POST' });
      if (!r.videoId) { setLoi(dichP('Không tìm thấy video YouTube cho “{ten}”.', { ten: b.ten })); return; }
      setBang((cu) => cu && { ...cu, top100: cu.top100.map((x) => (x.id === b.id ? { ...x, videoId: r.videoId, daGhep: true } : x)) });
      xem(r.videoId, b.ten, b.ngheSi);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangGhep(null);
    }
  };

  const capNhat = bang?.layLuc ? new Date(bang.layLuc).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '';

  return (
    <section className="mz-bxh">
      <header className="mz-dau mz-bxh-dau">
        <div className="mz-dau-bia"><span className="mz-bia-mau" data-mau="vang"><Trophy size={52} aria-hidden /></span></div>
        <div className="mz-dau-chu">
          <p className="mz-eyebrow">{dich('Cập nhật mỗi sáng')}</p>
          <h1>{dich('Bảng xếp hạng')}</h1>
          <p className="mz-dau-phu">
            {dich('Top 100 Việt Nam theo Apple Music, thịnh hành trên YouTube — nghe bằng trình phát chính thức của YouTube ngay trong app.')}
            {capNhat && ` · ${dichP('Lấy lúc {t}', { t: capNhat })}`}
          </p>
          <div className="mz-dau-nut">
            <div className="mz-ben-the mz-bxh-the" role="tablist">
              <button type="button" role="tab" data-on={the === 'top'} aria-selected={the === 'top'} onClick={() => setThe('top')}><Trophy size={13} aria-hidden /> Top 100</button>
              <button type="button" role="tab" data-on={the === 'yt'} aria-selected={the === 'yt'} onClick={() => setThe('yt')}><TrendingUp size={13} aria-hidden /> {dich('Thịnh hành YouTube')}</button>
              <button type="button" role="tab" data-on={the === 'goi-y'} aria-selected={the === 'goi-y'} onClick={() => setThe('goi-y')}><Sparkles size={13} aria-hidden /> {dich('Gợi ý cho bạn')}</button>
            </div>
            <button type="button" className="mz-nut mz-nut-trong" onClick={() => void nap()} disabled={dangTai || !online} aria-label={dich('Làm mới')} title={dich('Làm mới')}>
              {dangTai ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <RefreshCw size={14} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {!online && <p className="mz-trong-nho">{dich('Bảng xếp hạng cần mạng.')}</p>}
      {loi && (
        <div className="ct-notice" data-tone="err" role="alert">
          <span>{loi}</span>
          <button type="button" className="ct-linklike" onClick={() => setLoi(null)}>{dich('Đóng')}</button>
        </div>
      )}

      {dangXem && (
        <div className="mz-bxh-video">
          <p className="mz-bxh-video-ten"><Youtube size={14} aria-hidden /> <strong>{dangXem.ten}</strong> · {dangXem.ngheSi}</p>
          {/* `key` theo video: đổi bài là dựng lại khung — KhungVideo chỉ nạp URL lúc mở. */}
          <KhungVideo key={dangXem.videoId} url={`https://www.youtube.com/watch?v=${dangXem.videoId}`} onDong={() => setDangXem(null)} />
        </div>
      )}

      {the === 'top' && bang && (
        <ol className="mz-bxh-ds">
          {bang.top100.map((b) => (
            <li key={b.id} className="mz-bxh-dong" data-dang={dangXem?.videoId != null && dangXem.videoId === b.videoId}>
              <span className="mz-bxh-hang" data-top={b.hang <= 3}>{b.hang}</span>
              <button type="button" className="mz-dong-bia" onClick={() => void phatTop(b)} disabled={dangGhep !== null} aria-label={dichP('Phát {ten}', { ten: b.ten })}>
                <AnhBia src={b.anh} co={44} />
                <span className="mz-dong-bia-phu">{dangGhep === b.id ? <Loader2 size={16} className="ct-spin" aria-hidden /> : <Play size={16} aria-hidden />}</span>
              </button>
              <span className="mz-dong-chu">
                <span className="mz-dong-ten" title={b.ten}>{b.ten}</span>
                <span className="mz-dong-nghesi">{b.ngheSi}{b.theLoai[0] ? ` · ${b.theLoai[0]}` : ''}</span>
              </span>
              <span className="mz-bxh-tt" title={b.videoId ? dich('Đã có video') : dich('Bấm phát để tìm video trên YouTube')}>
                {b.videoId ? <Youtube size={14} aria-hidden /> : null}
              </span>
            </li>
          ))}
        </ol>
      )}

      {the === 'yt' && bang && (
        bang.thinhHanh.length === 0
          ? <p className="mz-trong-nho">{dich('Chưa lấy được danh sách thịnh hành từ YouTube (máy chủ chưa có khoá YouTube hoặc đã hết quota hôm nay).')}</p>
          : (
            <div className="mz-luoi mz-bxh-luoi">
              {bang.thinhHanh.map((v) => (
                <button key={v.videoId} type="button" className="mz-the" data-dang={dangXem?.videoId === v.videoId} onClick={() => xem(v.videoId, v.ten, v.kenh)} title={v.ten}>
                  <span className="mz-the-bia mz-the-bia-rong">
                    <img src={v.anh} alt="" loading="lazy" className="mz-art" />
                    <span className="mz-bxh-so">#{v.hang}</span>
                    {v.thoiLuong ? <span className="mz-bxh-tg">{clock(v.thoiLuong)}</span> : null}
                    <span className="mz-the-phat"><Play size={18} fill="currentColor" aria-hidden /></span>
                  </span>
                  <strong>{v.ten}</strong>
                  <small>{v.kenh}</small>
                </button>
              ))}
            </div>
          )
      )}

      {the === 'goi-y' && (
        !goiY ? <p className="mz-trong-nho">{dich('Đang tải…')}</p> : (
          <>
            <p className="mz-kg-giai">
              {goiY.ngheSiGu.length > 0
                ? dichP('Dựa trên nghệ sĩ bạn hay nghe và đã thích: {ds}.', { ds: goiY.ngheSiGu.slice(0, 6).join(', ') })
                : dich('Chưa đủ lịch sử nghe để đoán gu — tạm gợi ý những bài đứng đầu bảng hôm nay.')}
            </p>
            <ol className="mz-bxh-ds">
              {goiY.ds.map((g) => (
                <li key={`${g.loai}-${g.id}`} className="mz-bxh-dong">
                  <span className="mz-bxh-hang"><Sparkles size={14} aria-hidden /></span>
                  <button
                    type="button"
                    className="mz-dong-bia"
                    disabled={dangGhep !== null}
                    onClick={() => (g.loai === 'yt' ? xem(g.id, g.ten, g.ngheSi) : void phatTop({ id: g.id, ten: g.ten, ngheSi: g.ngheSi, videoId: g.videoId }))}
                    aria-label={dichP('Phát {ten}', { ten: g.ten })}
                  >
                    <AnhBia src={g.anh} co={44} />
                    <span className="mz-dong-bia-phu">{dangGhep === g.id ? <Loader2 size={16} className="ct-spin" aria-hidden /> : <Play size={16} aria-hidden />}</span>
                  </button>
                  <span className="mz-dong-chu">
                    <span className="mz-dong-ten" title={g.ten}>{g.ten}</span>
                    <span className="mz-dong-nghesi">{g.ngheSi} · {g.lyDo}</span>
                  </span>
                  <span />
                </li>
              ))}
            </ol>
          </>
        )
      )}
    </section>
  );
}
