/**
 * Code Lab — 12 nhóm · 146 track · 12.549 bài tập (đo thật 20/08/2026).
 *
 * Đối chiếu API:
 *   GET /code-lab/stats            → số liệu tổng
 *   GET /code-lab/groups           → nhóm, kèm sẵn danh sách track
 *   GET /code-lab/tracks/:slug     → track + modules + bài của từng module
 *   GET /code-lab/exercises/:slug  → đề bài, ví dụ, gợi ý, lời giải
 *   GET /code-lab/search?q=        → tìm trong toàn bộ kho
 *
 * ─── Vì sao TÌM đi qua máy chủ, không lọc tại chỗ ───
 * 12.549 bài. Tải hết về để lọc trong app là vài chục MB mỗi lần mở trang, và
 * lọc trên mảng đó thì gõ một phím là quét 12 nghìn phần tử. Máy chủ đã có
 * endpoint tìm — dùng nó, và chờ người dùng ngừng gõ rồi mới gọi.
 *
 * ─── Lời giải PHẢI giấu sau một cú bấm ───
 * Đây là chỗ luyện tập. Hiện lời giải ngay cạnh đề bài thì mắt đọc trúng nó
 * trước khi kịp nghĩ, và bài tập mất sạch giá trị. Một cú bấm là đủ để tách
 * "tôi muốn xem" khỏi "tôi vô tình nhìn thấy".
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, Braces, CheckCircle2, ChevronDown, ChevronRight, CloudOff,
  Code2, ExternalLink, Eye, Lightbulb, RefreshCw, Search, Timer, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { bocDauKiem, chuVi, moNgoai, NHAN_BAC, WEB } from '../chu';
import '../academy/noiDungBai';

interface Track {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  language?: string | null;
  level?: string | null;
  color?: string | null;
  moduleCount?: number | null;
  exerciseCount?: number | null;
}

interface Nhom {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  color?: string | null;
  tracks?: Track[] | null;
}

interface BaiTom {
  id: number;
  slug: string;
  title: string;
  difficulty?: string | null;
  language?: string | null;
  estimatedMinutes?: number | null;
  points?: number | null;
  solveCount?: number | null;
  tags?: string[] | null;
}

interface Module {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  level?: string | null;
  exercises?: BaiTom[] | null;
}

interface TrackDay extends Track {
  modules?: Module[] | null;
  group?: { name?: string } | null;
  docsUrl?: string | null;
}

interface MaNguon { name?: string | null; language?: string | null; code: string }

interface BaiDay extends BaiTom {
  problemHtml?: string | null;
  problemHtmlVi?: string | null;
  solutionExplanationHtml?: string | null;
  solutionExplanationHtmlVi?: string | null;
  starterCodeJson?: MaNguon[] | null;
  solutionCodeJson?: MaNguon[] | null;
  hintsJson?: string[] | null;
  examplesJson?: Array<{ input?: string; output?: string; explanation?: string }> | null;
  concepts?: string[] | null;
  constraints?: string | null;
  inputSpec?: string | null;
  outputSpec?: string | null;
  youtubeUrl?: string | null;
  track?: { name?: string; slug?: string } | null;
  module?: { name?: string } | null;
}

interface SoLieu {
  groups?: number; tracks?: number; modules?: number; exercises?: number;
  byDifficulty?: Array<{ _count: number; difficulty: string }>;
}

const sach = (html: string | null | undefined): string =>
  DOMPurify.sanitize(html ?? '', { USE_PROFILES: { html: true } });

/** Ưu tiên bản tiếng Việt; chưa dịch thì dùng bản gốc chứ không để trống. */
const viTruoc = (vi?: string | null, en?: string | null): string => sach(vi || en);

export function CodeLabPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [nhom, setNhom] = useState<Nhom[]>([]);
  const [soLieu, setSoLieu] = useState<SoLieu | null>(null);
  const [bung, setBung] = useState<number[]>([]);
  const [tim, setTim] = useState('');
  const [ketQua, setKetQua] = useState<BaiTom[] | null>(null);
  const [dangTim, setDangTim] = useState(false);
  const [dangTai, setDangTai] = useState(true);
  const [cu, setCu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moTrack, setMoTrack] = useState<string | null>(null);
  const [moBai, setMoBai] = useState<string | null>(null);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    setDangTai(true);
    setLoi(null);
    try {
      const kq = await swr<Nhom[]>({
        userId,
        key: 'codelab:nhom',
        fetcher: () => api.request<Nhom[]>('/api/v1/code-lab/groups'),
        online,
        ttlMs: 60 * 60 * 1000,
        onRefreshed: (moi) => { setNhom(moi ?? []); setCu(false); },
      });
      setNhom(kq.value ?? []);
      setCu(kq.isStale);
      setBung((c) => (c.length ? c : (kq.value ?? []).slice(0, 1).map((g) => g.id)));

      /* Số liệu là phần TRANG TRÍ: hỏng thì ẩn dòng đó đi, tuyệt đối không
         được kéo cả trang xuống theo. */
      void swr<SoLieu>({
        userId, key: 'codelab:soLieu', online, ttlMs: 60 * 60 * 1000,
        fetcher: () => api.request<SoLieu>('/api/v1/code-lab/stats'),
      }).then((r) => setSoLieu(r.value)).catch(() => {});
    } catch (e) {
      setLoi(
        e instanceof OfflineUnavailableError
          ? 'Chưa từng tải Code Lab về máy nên không xem được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e),
      );
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  /* Tìm qua MÁY CHỦ, và chỉ gọi khi người dùng ngừng gõ.
     Gọi theo từng phím trên một kho 12.549 bài là mỗi chữ một lượt truy vấn. */
  const hetGio = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const q = tim.trim();
    if (hetGio.current) clearTimeout(hetGio.current);
    if (q.length < 2) { setKetQua(null); setDangTim(false); return; }
    if (!api) return;
    setDangTim(true);
    hetGio.current = setTimeout(() => {
      void api.request<unknown>(`/api/v1/code-lab/search?q=${encodeURIComponent(q)}&limit=40`)
        .then((r) => {
          const d = Array.isArray(r) ? r : ((r as { exercises?: BaiTom[] })?.exercises ?? []);
          setKetQua(d as BaiTom[]);
        })
        .catch(() => setKetQua([]))
        .finally(() => setDangTim(false));
    }, 350);
    return () => { if (hetGio.current) clearTimeout(hetGio.current); };
  }, [tim, api]);

  if (moBai) {
    return <ChiTietBai slug={moBai} onQuayLai={() => setMoBai(null)} />;
  }
  if (moTrack) {
    return <ChiTietTrack slug={moTrack} onQuayLai={() => setMoTrack(null)} onMoBai={setMoBai} />;
  }

  return (
    <div className="ct-page ct-cl">
      <header className="ct-hv-dau">
        <div>
          <h1><Braces size={20} aria-hidden /> Code Lab</h1>
          <p className="ct-muted">
            {soLieu?.exercises
              ? `${soLieu.groups} nhóm · ${soLieu.tracks} lộ trình · ${soLieu.exercises.toLocaleString('vi-VN')} bài tập`
              : 'Bài tập lập trình theo lộ trình'}
          </p>
        </div>
        <div className="ct-hv-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> bản đã lưu</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/code-lab`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      {soLieu?.byDifficulty && (
        <div className="ct-cl-do">
          {soLieu.byDifficulty.map((d) => (
            <span key={d.difficulty} data-do={d.difficulty}>
              {NHAN_BAC[d.difficulty] ?? d.difficulty} · {d._count.toLocaleString('vi-VN')}
            </span>
          ))}
        </div>
      )}

      <label className="ct-music-search ct-hv-tim">
        <Search size={14} aria-hidden />
        <input
          value={tim}
          onChange={(e) => setTim(e.target.value)}
          placeholder="Tìm bài tập trong toàn bộ kho…"
          aria-label="Tìm bài tập"
        />
        {tim && (
          <button type="button" className="ct-linklike" onClick={() => setTim('')} aria-label="Xoá tìm kiếm">
            <X size={13} aria-hidden />
          </button>
        )}
      </label>

      {loi ? (
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>Thử lại</button>
        </div>
      ) : ketQua !== null ? (
        <section>
          <p className="ct-hv-sokq">
            {dangTim ? 'Đang tìm…' : `${ketQua.length} bài khớp “${tim.trim()}”`}
          </p>
          {ketQua.length === 0 && !dangTim ? (
            <div className="ct-empty">
              <Search size={26} aria-hidden className="ct-empty-icon" />
              <p>Không bài nào khớp. Thử từ khoá ngắn hơn, ví dụ <code>join</code>.</p>
            </div>
          ) : (
            <ul className="ct-cl-bai-ds">
              {ketQua.map((b) => <DongBai key={b.id} bai={b} onMo={() => setMoBai(b.slug)} />)}
            </ul>
          )}
        </section>
      ) : dangTai && nhom.length === 0 ? (
        <p className="ct-muted">Đang tải…</p>
      ) : (
        <div className="ct-hv-ky-ds">
          {nhom.map((g) => {
            const mo = bung.includes(g.id);
            const tr = g.tracks ?? [];
            return (
              <section key={g.id} className="ct-hv-ky" data-mo={mo}>
                <button
                  type="button"
                  className="ct-hv-ky-dau"
                  aria-expanded={mo}
                  onClick={() => setBung((c) => (c.includes(g.id) ? c.filter((x) => x !== g.id) : [...c, g.id]))}
                >
                  {mo ? <ChevronDown size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />}
                  <span className="ct-mau-cham" style={{ '--mau-sac': g.color ?? 'var(--ct-accent)' } as React.CSSProperties} aria-hidden />
                  <span className="ct-hv-ky-ten">{g.name}</span>
                  <span className="ct-mau-dem">{tr.length} lộ trình</span>
                </button>
                {mo && (
                  <div className="ct-cl-track-ds">
                    {tr.map((t) => {
                      const { daKiem, chu } = bocDauKiem(t.description);
                      return (
                        <button key={t.id} type="button" className="ct-cl-track" onClick={() => setMoTrack(t.slug)}>
                          <span className="ct-cl-track-dau">
                            <span className="ct-mau-cham" style={{ '--mau-sac': t.color ?? g.color ?? 'var(--ct-accent)' } as React.CSSProperties} aria-hidden />
                            <span className="ct-cl-track-ten">{t.name}</span>
                            {daKiem && (
                              <span className="ct-cl-kiem" title="Bài học và bài tập đã được kiểm bằng cách CHẠY THẬT">
                                <CheckCircle2 size={11} aria-hidden /> Đã kiểm
                              </span>
                            )}
                          </span>
                          {chu && <span className="ct-cl-track-mo">{chu}</span>}
                          <span className="ct-cl-track-so">
                            {t.language && <span className="ct-mau-tag">{t.language}</span>}
                            {t.level && <span className="ct-muted">{NHAN_BAC[t.level] ?? t.level}</span>}
                            <span className="ct-muted">{t.moduleCount ?? 0} mục · {t.exerciseCount ?? 0} bài</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Một dòng bài tập ────────────────────────────────────────────────────── */

function DongBai({ bai, onMo }: { bai: BaiTom; onMo: () => void }) {
  return (
    <li>
      <button type="button" className="ct-cl-dong" onClick={onMo}>
        <span className="ct-cl-dong-ten">{chuVi(bai.title)}</span>
        <span className="ct-cl-dong-meta">
          {bai.difficulty && (
            <span className="ct-cl-do-nho" data-do={bai.difficulty}>
              {NHAN_BAC[bai.difficulty] ?? bai.difficulty}
            </span>
          )}
          {bai.language && <span className="ct-mau-tag">{bai.language}</span>}
          {!!bai.estimatedMinutes && <span className="ct-muted"><Timer size={11} aria-hidden /> {bai.estimatedMinutes}′</span>}
          {!!bai.solveCount && <span className="ct-muted"><CheckCircle2 size={11} aria-hidden /> {bai.solveCount}</span>}
        </span>
      </button>
    </li>
  );
}

/* ── Một lộ trình ────────────────────────────────────────────────────────── */

function ChiTietTrack({
  slug, onQuayLai, onMoBai,
}: { slug: string; onQuayLai: () => void; onMoBai: (slug: string) => void }) {
  const { online } = useAppState();
  const { api, userId } = useSession();
  const [tr, setTr] = useState<TrackDay | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [mo, setMo] = useState<number[]>([]);

  useEffect(() => {
    if (userId === null || !api) return;
    let huy = false;
    setTr(null); setLoi(null);
    void swr<TrackDay>({
      userId,
      key: `codelab:track:${slug}`,
      fetcher: () => api.request<TrackDay>(`/api/v1/code-lab/tracks/${encodeURIComponent(slug)}`),
      online,
      ttlMs: 60 * 60 * 1000,
      onRefreshed: (moi) => { if (!huy) setTr(moi); },
    })
      .then((r) => {
        if (huy) return;
        setTr(r.value);
        setMo((r.value.modules ?? []).slice(0, 1).map((m) => m.id));
      })
      .catch((e: unknown) => {
        if (huy) return;
        setLoi(e instanceof OfflineUnavailableError
          ? 'Lộ trình này chưa từng mở nên không xem được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e));
      });
    return () => { huy = true; };
  }, [api, userId, online, slug]);

  if (loi) {
    return (
      <div className="ct-page ct-cl">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Code Lab
        </button>
        <div className="ct-empty"><CloudOff size={26} aria-hidden className="ct-empty-icon" /><p>{loi}</p></div>
      </div>
    );
  }
  if (!tr) {
    return (
      <div className="ct-page ct-cl">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Code Lab
        </button>
        <p className="ct-muted">Đang tải…</p>
      </div>
    );
  }

  const { daKiem, chu } = bocDauKiem(tr.description);
  const mod = tr.modules ?? [];

  return (
    <div className="ct-page ct-cl ct-hv-ct">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> Code Lab
      </button>

      <header className="ct-cl-hero">
        <p className="ct-hv-hero-nhan">
          {tr.group?.name && <span className="ct-mau-tag">{tr.group.name}</span>}
          {tr.language && <span className="ct-mau-tag">{tr.language}</span>}
          {tr.level && <span className="ct-mau-tag">{NHAN_BAC[tr.level] ?? tr.level}</span>}
          {daKiem && <span className="ct-cl-kiem"><CheckCircle2 size={11} aria-hidden /> Đã kiểm</span>}
        </p>
        <h1>{tr.name}</h1>
        {chu && <p className="ct-hv-hero-mo">{chu}</p>}
        <p className="ct-hv-hero-so">
          <span>{mod.length} mục</span>
          <span>{tr.exerciseCount ?? 0} bài tập</span>
        </p>
        <div className="ct-hv-bai-nut">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/code-lab/${tr.slug}`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
          {tr.docsUrl && (
            <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(tr.docsUrl!)}>
              <ExternalLink size={14} aria-hidden /> Tài liệu gốc
            </button>
          )}
        </div>
      </header>

      {mod.length === 0 ? (
        <p className="ct-muted">Lộ trình này chưa có mục nào.</p>
      ) : mod.map((m) => {
        const b = mo.includes(m.id);
        const ds = m.exercises ?? [];
        return (
          <div key={m.id} className="ct-hv-muc" data-mo={b}>
            <button
              type="button"
              className="ct-hv-muc-dau"
              aria-expanded={b}
              onClick={() => setMo((c) => (c.includes(m.id) ? c.filter((x) => x !== m.id) : [...c, m.id]))}
            >
              {b ? <ChevronDown size={15} aria-hidden /> : <ChevronRight size={15} aria-hidden />}
              <span className="ct-hv-muc-ten">{chuVi(m.name)}</span>
              <span className="ct-mau-dem">{ds.length} bài</span>
            </button>
            {b && (
              <ul className="ct-cl-bai-ds">
                {ds.map((x) => <DongBai key={x.id} bai={x} onMo={() => onMoBai(x.slug)} />)}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Một bài tập ─────────────────────────────────────────────────────────── */

function ChiTietBai({ slug, onQuayLai }: { slug: string; onQuayLai: () => void }) {
  const { online } = useAppState();
  const { api, userId } = useSession();
  const [b, setB] = useState<BaiDay | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  /* Gợi ý và lời giải ĐỀU đóng lúc mở bài — xem ghi chú ở đầu file. */
  const [hienGoiY, setHienGoiY] = useState(false);
  const [hienGiai, setHienGiai] = useState(false);

  useEffect(() => {
    if (userId === null || !api) return;
    let huy = false;
    setB(null); setLoi(null); setHienGoiY(false); setHienGiai(false);
    void swr<BaiDay>({
      userId,
      key: `codelab:bai:${slug}`,
      fetcher: () => api.request<BaiDay>(`/api/v1/code-lab/exercises/${encodeURIComponent(slug)}`),
      online,
      ttlMs: 60 * 60 * 1000,
      onRefreshed: (moi) => { if (!huy) setB(moi); },
    })
      .then((r) => { if (!huy) setB(r.value); })
      .catch((e: unknown) => {
        if (huy) return;
        setLoi(e instanceof OfflineUnavailableError
          ? 'Bài này chưa từng mở nên không đọc được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e));
      });
    return () => { huy = true; };
  }, [api, userId, online, slug]);

  if (loi) {
    return (
      <div className="ct-page ct-cl">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Quay lại
        </button>
        <div className="ct-empty"><CloudOff size={26} aria-hidden className="ct-empty-icon" /><p>{loi}</p></div>
      </div>
    );
  }
  if (!b) {
    return (
      <div className="ct-page ct-cl">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Quay lại
        </button>
        <p className="ct-muted">Đang tải…</p>
      </div>
    );
  }

  const de = viTruoc(b.problemHtmlVi, b.problemHtml);
  const giai = viTruoc(b.solutionExplanationHtmlVi, b.solutionExplanationHtml);
  const goiY = b.hintsJson ?? [];
  const viDu = b.examplesJson ?? [];

  return (
    <div className="ct-page ct-cl ct-hv-bai-doc">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> {b.track?.name ?? 'Quay lại'}
      </button>

      <p className="ct-hv-hero-nhan">
        {b.difficulty && <span className="ct-cl-do-nho" data-do={b.difficulty}>{NHAN_BAC[b.difficulty] ?? b.difficulty}</span>}
        {b.language && <span className="ct-mau-tag">{b.language}</span>}
        {b.module?.name && <span className="ct-muted">{chuVi(b.module.name)}</span>}
        {!!b.estimatedMinutes && <span className="ct-muted"><Timer size={12} aria-hidden /> {b.estimatedMinutes}′</span>}
        {!!b.points && <span className="ct-muted">{b.points} điểm</span>}
      </p>
      <h1 className="ct-hv-bai-tieude">{chuVi(b.title)}</h1>

      {(b.concepts ?? []).length > 0 && (
        <div className="ct-mau-tu">{b.concepts!.map((c) => <span key={c}>{c}</span>)}</div>
      )}

      {de && <div className="ct-hv-noidung rich-content" data-ml="vi" dangerouslySetInnerHTML={{ __html: de }} />}

      {(b.inputSpec || b.outputSpec || b.constraints) && (
        <dl className="ct-mau-tin ct-cl-dac">
          {b.inputSpec && <><dt>Đầu vào</dt><dd>{b.inputSpec}</dd></>}
          {b.outputSpec && <><dt>Đầu ra</dt><dd>{b.outputSpec}</dd></>}
          {b.constraints && <><dt>Ràng buộc</dt><dd>{b.constraints}</dd></>}
        </dl>
      )}

      {viDu.length > 0 && (
        <section className="ct-cl-vidu">
          <h2>Ví dụ</h2>
          {viDu.map((v, i) => (
            <div key={i} className="ct-cl-vidu-o">
              {v.input && <><p className="ct-cl-nhan">Vào</p><pre>{v.input}</pre></>}
              {v.output && <><p className="ct-cl-nhan">Ra</p><pre>{v.output}</pre></>}
              {v.explanation && <p className="ct-muted">{v.explanation}</p>}
            </div>
          ))}
        </section>
      )}

      {(b.starterCodeJson ?? []).length > 0 && (
        <section className="ct-cl-ma">
          <h2><Code2 size={15} aria-hidden /> Mã khởi đầu</h2>
          {b.starterCodeJson!.map((m, i) => <KhoiMa key={i} ma={m} />)}
        </section>
      )}

      {goiY.length > 0 && (
        <section className="ct-cl-an">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => setHienGoiY((v) => !v)}>
            <Lightbulb size={14} aria-hidden /> {hienGoiY ? 'Ẩn gợi ý' : `Xem gợi ý (${goiY.length})`}
          </button>
          {hienGoiY && (
            <ol className="ct-cl-goiy">{goiY.map((g, i) => <li key={i}>{g}</li>)}</ol>
          )}
        </section>
      )}

      {(giai || (b.solutionCodeJson ?? []).length > 0) && (
        <section className="ct-cl-an">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => setHienGiai((v) => !v)}>
            <Eye size={14} aria-hidden /> {hienGiai ? 'Ẩn lời giải' : 'Xem lời giải'}
          </button>
          {hienGiai && (
            <>
              {(b.solutionCodeJson ?? []).map((m, i) => <KhoiMa key={i} ma={m} />)}
              {giai && <div className="ct-hv-noidung rich-content" data-ml="vi" dangerouslySetInnerHTML={{ __html: giai }} />}
            </>
          )}
        </section>
      )}

      <div className="ct-hv-bai-nut">
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/code-lab/${b.track?.slug ?? ''}/${b.slug}`)}>
          <ExternalLink size={14} aria-hidden /> Làm bài trên web
        </button>
        {b.youtubeUrl && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(b.youtubeUrl!)}>
            <ExternalLink size={14} aria-hidden /> Video
          </button>
        )}
      </div>
    </div>
  );
}

function KhoiMa({ ma }: { ma: MaNguon }) {
  const [daChep, setDaChep] = useState(false);
  return (
    <div className="ct-cl-khoi">
      <div className="ct-cl-khoi-dau">
        <span>{ma.name || ma.language || 'mã'}</span>
        <button
          type="button"
          className="ct-linklike"
          onClick={() => void navigator.clipboard.writeText(ma.code).then(() => {
            setDaChep(true);
            setTimeout(() => setDaChep(false), 1600);
          })}
        >
          {daChep ? 'Đã chép' : 'Chép'}
        </button>
      </div>
      <pre>{ma.code}</pre>
    </div>
  );
}
