/**
 * Phòng thi — 190 đề của chương trình FPTU (đo thật 20/08/2026).
 *
 * Đối chiếu API: `GET /api/v1/exams` trả trọn danh sách kèm môn và kỳ.
 * Phân bố đo được: **135 đề FE** (trắc nghiệm) · **55 đề PE** (thực hành),
 * trải trên 8 mã môn + 38 đề chưa gắn môn.
 *
 * ─── VÌ SAO KHÔNG LÀM BÀI NGAY TRONG APP ───
 * Đây là ranh giới CÓ CHỦ Ý, không phải phần bỏ dở.
 *
 * Một lượt thi thật gồm: tạo `attempt` (đốt một lượt của người dùng), đồng hồ
 * đếm ngược, rồi nộp theo BỐN đường khác nhau — trắc nghiệm, nộp file zip mã,
 * bài viết, và bài nói kèm tải lên tối đa 12 file âm thanh. Làm ẩu bất kỳ mắt
 * nào trong chuỗi đó thì cái mất không phải một màn hình vẽ sai — mà là công
 * sức 60 phút của người đang thi, cộng một lượt đã bị đốt.
 *
 * Nên app làm thật tốt phần TRA CỨU (lọc, tìm, xem đề nào bao nhiêu câu, bao
 * lâu, qua bao nhiêu điểm) và đưa người dùng sang web đúng lúc bấm "Vào thi".
 * Khi nào làm phần thi trong app, nó phải được làm trọn cả bốn đường nộp một
 * lượt — không phải ghép dần từng mảnh.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClipboardList, CloudOff, ExternalLink, FileCode2, ListChecks,
  RefreshCw, Search, Timer, Trophy, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { chuVi, fold, moNgoai, WEB } from '../chu';

interface De {
  id: number;
  code?: string | null;
  title: string;
  description?: string | null;
  kind?: string | null;          // FE = trắc nghiệm · PE = thực hành
  peType?: string | null;
  durationMinutes?: number | null;
  totalPoints?: number | null;
  passMark?: number | null;
  questionCount?: number | null;
  courseId?: number | null;
  course?: { title?: string; slug?: string; courseCode?: string | null } | null;
  semester?: { name?: string; ordinal?: number; code?: string } | null;
}

const NHAN_DANG: Record<string, string> = { FE: 'Trắc nghiệm', PE: 'Thực hành' };

function docDs(p: unknown): De[] {
  if (Array.isArray(p)) return p as De[];
  const w = p as { exams?: unknown; items?: unknown; data?: unknown };
  for (const x of [w?.exams, w?.items, w?.data]) if (Array.isArray(x)) return x as De[];
  return [];
}

export function PhongThiPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [ds, setDs] = useState<De[]>([]);
  const [tim, setTim] = useState('');
  const [dang, setDang] = useState<string | null>(null);
  const [mon, setMon] = useState<string | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [cu, setCu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moId, setMoId] = useState<number | null>(null);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    setDangTai(true);
    setLoi(null);
    try {
      const kq = await swr<unknown>({
        userId,
        key: 'phongthi:ds',
        fetcher: () => api.request('/api/v1/exams'),
        online,
        ttlMs: 30 * 60 * 1000,
        onRefreshed: (moi) => { setDs(docDs(moi)); setCu(false); },
      });
      setDs(docDs(kq.value));
      setCu(kq.isStale);
    } catch (e) {
      setLoi(
        e instanceof OfflineUnavailableError
          ? 'Chưa từng tải danh sách đề về máy nên không xem được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e),
      );
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  /* Mã môn để lọc — lấy TỪ DỮ LIỆU, không gõ cứng.
     Gõ cứng thì thêm một môn trên web là bộ lọc ở đây thiếu một mục, im lặng. */
  const dsMon = useMemo(() => {
    const dem = new Map<string, number>();
    for (const d of ds) {
      const m = d.course?.courseCode;
      if (m) dem.set(m, (dem.get(m) ?? 0) + 1);
    }
    return [...dem.entries()].sort((a, b) => b[1] - a[1]);
  }, [ds]);

  const ketQua = useMemo(() => {
    const q = fold(tim.trim());
    return ds.filter((d) => {
      if (dang && d.kind !== dang) return false;
      if (mon && d.course?.courseCode !== mon) return false;
      if (!q) return true;
      return fold(
        `${chuVi(d.title)} ${d.code ?? ''} ${d.course?.courseCode ?? ''} ${d.course?.title ?? ''} ${d.semester?.name ?? ''}`,
      ).includes(q);
    });
  }, [ds, tim, dang, mon]);

  const deMo = moId != null ? ds.find((d) => d.id === moId) ?? null : null;
  if (deMo) return <ChiTietDe de={deMo} onQuayLai={() => setMoId(null)} />;

  const soFE = ds.filter((d) => d.kind === 'FE').length;
  const soPE = ds.filter((d) => d.kind === 'PE').length;

  return (
    <div className="ct-page ct-pt">
      <header className="ct-hv-dau">
        <div>
          <h1><ClipboardList size={20} aria-hidden /> Phòng thi</h1>
          <p className="ct-muted">
            {ds.length > 0
              ? `${ds.length} đề · ${soFE} trắc nghiệm · ${soPE} thực hành`
              : 'Đề thi FE và PE theo môn'}
          </p>
        </div>
        <div className="ct-hv-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> bản đã lưu</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/exam`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      <div className="ct-gn-loc">
        <label className="ct-music-search ct-hv-tim">
          <Search size={14} aria-hidden />
          <input
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            placeholder="Tìm theo mã môn (PRO192), tên đề hoặc kỳ…"
            aria-label="Tìm đề thi"
          />
          {tim && (
            <button type="button" className="ct-linklike" onClick={() => setTim('')} aria-label="Xoá tìm kiếm">
              <X size={13} aria-hidden />
            </button>
          )}
        </label>

        <div className="ct-gn-chip" role="group" aria-label="Lọc theo dạng đề">
          <button type="button" data-active={dang === null} onClick={() => setDang(null)}>Tất cả</button>
          {(['FE', 'PE'] as const).map((k) => (
            <button key={k} type="button" data-active={dang === k} onClick={() => setDang(dang === k ? null : k)}>
              {NHAN_DANG[k]}
              <span className="ct-mau-dem">{k === 'FE' ? soFE : soPE}</span>
            </button>
          ))}
        </div>

        {dsMon.length > 0 && (
          <div className="ct-gn-chip" role="group" aria-label="Lọc theo môn">
            {dsMon.map(([ma, so]) => (
              <button key={ma} type="button" data-active={mon === ma} onClick={() => setMon(mon === ma ? null : ma)}>
                {ma}
                <span className="ct-mau-dem">{so}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loi ? (
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>Thử lại</button>
        </div>
      ) : dangTai && ds.length === 0 ? (
        <p className="ct-muted">Đang tải…</p>
      ) : ketQua.length === 0 ? (
        <div className="ct-empty">
          <Search size={26} aria-hidden className="ct-empty-icon" />
          <p>Không đề nào khớp bộ lọc đang chọn.</p>
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            onClick={() => { setTim(''); setDang(null); setMon(null); }}
          >
            Bỏ hết bộ lọc
          </button>
        </div>
      ) : (
        <>
          <p className="ct-hv-sokq">{ketQua.length} đề</p>
          <div className="ct-pt-luoi">
            {ketQua.map((d) => <TheDe key={d.id} de={d} onMo={() => setMoId(d.id)} />)}
          </div>
        </>
      )}
    </div>
  );
}

function TheDe({ de, onMo }: { de: De; onMo: () => void }) {
  return (
    <button type="button" className="ct-pt-the" onClick={onMo} data-dang={de.kind ?? 'FE'}>
      <span className="ct-pt-the-dau">
        {de.kind === 'PE' ? <FileCode2 size={13} aria-hidden /> : <ListChecks size={13} aria-hidden />}
        <span className="ct-mau-tag">{NHAN_DANG[de.kind ?? ''] ?? de.kind}</span>
        {de.course?.courseCode && <span className="ct-hv-ma">{de.course.courseCode}</span>}
        {de.code && <span className="ct-muted">{de.code}</span>}
      </span>
      <span className="ct-pt-the-ten">{chuVi(de.title)}</span>
      <span className="ct-pt-the-so">
        {!!de.questionCount && <span>{de.questionCount} câu</span>}
        {!!de.durationMinutes && <span><Timer size={11} aria-hidden /> {de.durationMinutes}′</span>}
        {de.passMark != null && de.totalPoints != null && (
          <span><Trophy size={11} aria-hidden /> qua {de.passMark}/{de.totalPoints}</span>
        )}
        {de.semester?.name && <span className="ct-muted">{de.semester.name}</span>}
      </span>
    </button>
  );
}

function ChiTietDe({ de, onQuayLai }: { de: De; onQuayLai: () => void }) {
  return (
    <div className="ct-page ct-pt ct-hv-ct">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ClipboardList size={14} aria-hidden /> Phòng thi
      </button>

      <p className="ct-hv-hero-nhan">
        <span className="ct-mau-tag">{NHAN_DANG[de.kind ?? ''] ?? de.kind}</span>
        {de.peType && <span className="ct-mau-tag">{de.peType}</span>}
        {de.course?.courseCode && <span className="ct-hv-ma">{de.course.courseCode}</span>}
        {de.semester?.name && <span className="ct-muted">{de.semester.name}</span>}
      </p>
      <h1 className="ct-hv-bai-tieude">{chuVi(de.title)}</h1>
      {de.course?.title && <p className="ct-hv-hero-mo">{chuVi(de.course.title)}</p>}
      {de.description && <p className="ct-hv-hero-mo">{chuVi(de.description)}</p>}

      <dl className="ct-mau-tin ct-pt-tin">
        {!!de.questionCount && <><dt>Số câu</dt><dd>{de.questionCount}</dd></>}
        {!!de.durationMinutes && <><dt>Thời gian</dt><dd>{de.durationMinutes} phút</dd></>}
        {de.totalPoints != null && <><dt>Thang điểm</dt><dd>{de.totalPoints}</dd></>}
        {de.passMark != null && <><dt>Điểm qua</dt><dd>{de.passMark}</dd></>}
        {de.code && <><dt>Mã đề</dt><dd>{de.code}</dd></>}
      </dl>

      <div className="ct-hv-bai-nut">
        <button type="button" className="ct-btn" onClick={() => moNgoai(`${WEB}/exam/${de.id}`)}>
          <ExternalLink size={15} aria-hidden /> Vào thi trên web
        </button>
        {de.course?.slug && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/courses/${de.course!.slug}`)}>
            <ExternalLink size={14} aria-hidden /> Xem môn
          </button>
        )}
      </div>

      {/* Nói THẲNG vì sao phải sang web, thay vì để người dùng đoán là app hỏng. */}
      <p className="ct-muted ct-pt-luuy">
        Bài thi làm trên web. Một lượt thi đốt một lần làm, có đồng hồ đếm ngược và
        {de.kind === 'PE' ? ' nộp bằng file mã nguồn' : ' nộp bài trắc nghiệm'} —
        app chưa làm phần đó, và làm dở dang thì mất công của cả một lượt thi.
      </p>
    </div>
  );
}
