/**
 * MÔN HỌC — kiểu, thẻ, trang chi tiết, trình đọc bài. DÙNG CHUNG.
 *
 * Tách khỏi `HocVienPage` khi làm trang "Khoá học": hai trang khác nhau ở chỗ
 * LẤY danh sách môn từ đâu (Học viện theo kỳ FPTU, Khoá học lấy các khoá
 * GENERAL), còn từ lúc bấm vào một môn trở đi thì giống hệt — cùng endpoint
 * `/courses/:slug`, cùng hình dạng dữ liệu, cùng trình đọc bài.
 *
 * Chép sang một bản thứ hai thì mọi bản vá sau này phải làm hai lần, và lần
 * quên thứ nhất sẽ không ai thấy — hai trang vẫn chạy, chỉ khác nhau.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronRight, CloudOff, ExternalLink,
  CheckCircle2, FileText, Layers3, Lock, PlayCircle,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { chuVi, moNgoai, NHAN_BAC, raDanhSach, WEB } from '../chu';
import './noiDungBai';
import { KhungVideo } from './KhungVideo';
/*
 * GIA SƯ AI — DÙNG LẠI thẳng component của web, không viết lại.
 *
 * Người dùng: app "chưa có AI giải thích và giảng dạy + hỏi như trên web".
 * Đúng — bản app chỉ có video và chữ. `CourseTutor` chỉ dính Next đúng một chỗ
 * (`next/link`), mà app đã có shim đó sẵn từ khi dùng lại trang Ghi chú; nên
 * chép lại 336 dòng ở đây là tự tạo ra hai bản phải nuôi song song mãi.
 */
import { CourseTutor } from '@/components/academy/CourseTutor';
import { ChapterQuiz } from '@/components/academy/ChapterQuiz';
/*
 * ⚠️ HAI COMPONENT NÀY CŨNG DÙNG LẠI THẲNG CỦA WEB, không viết lại.
 * Đã kiểm: cả hai KHÔNG import gì từ `next/*`, và Tailwind của app quét cả cây
 * nguồn web + lấy chung bảng màu (xem `tailwind.config.ts`), nên lớp riêng của
 * web như `bg-darkcard` vẫn sinh ra CSS ở đây.
 */
import LessonQuizPlayer, { type QuizData } from '@/app/courses/[slug]/learn/LessonQuizPlayer';
import LessonPdfViewer from '@/app/courses/[slug]/learn/LessonPdfViewer';
import { duongTaiLieu, laBaiQuiz, locPdf, useChiTietBai, useTienDo, type TuyChonGoi } from './chiTietBai';
import { useDich } from '../../i18n';

export interface Mon {
  id: number;
  slug: string;
  title: string;
  courseCode?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  level?: string | null;
  language?: string | null;
  totalLessons?: number | null;
  enrollmentCount?: number | null;
  avgRating?: number | null;
  reviewCount?: number | null;
  isFree?: boolean;
  accessType?: string | null;
  instructorName?: string | null;
  /* ⚠️ ĐO THẬT: hai trường này là CHUỖI, không phải mảng — dù tên số nhiều và
     dù kiểu của web khai là mảng. Gọi `.map` lên chúng làm cả trang chi tiết
     nổ và React tháo sạch cây, để lại màn hình TRẮNG không lỗi nào nhìn thấy.
     Bắt được vì chạy bản đo với dữ liệu THẬT của production; dữ liệu giả của
     tôi khai mảng nên nó xanh. Nhận cả hai kiểu, xem `raDanhSach()`. */
  whatYouLearn?: string[] | string | null;
  requirements?: string[] | string | null;
  semesterId?: number | null;
  sections?: Muc[] | null;
  isEnrolled?: boolean;
  enrollmentProgress?: number | null;
}

export interface Muc {
  id: number;
  title: string;
  description?: string | null;
  sortOrder?: number;
  lessonCount?: number | null;
  lessons?: Bai[] | null;
}

/** Nhãn ba luồng video. Mã luồng do máy chủ đặt (`VI` / `EN` / `YT`). */
const NHAN_LUONG: Record<string, string> = {
  VI: 'Giảng tiếng Việt',
  EN: 'Giảng tiếng Anh',
  YT: 'YouTube',
};

export interface Bai {
  id: number;
  slug?: string | null;
  title: string;
  description?: string | null;
  lessonType?: string | null;
  isFreePreview?: boolean | null;
  content?: string | null;
  videoUrl?: string | null;
  videoDurationSeconds?: number | null;
  sourceCodeUrl?: string | null;
  documents?: Array<{ id: number; title?: string | null; fileUrl?: string | null; url?: string | null }> | null;
  assignments?: Array<{ id: number; title?: string | null }> | null;
}

/* ── Thẻ một môn ─────────────────────────────────────────────────────────── */

export function TheMon({ mon, onMo }: { mon: Mon; onMo: () => void }) {
  const { dich } = useDich();
  const soBai = mon.totalLessons
    ?? (mon.sections ?? []).reduce((n, s) => n + (s.lessonCount ?? (s.lessons ?? []).length), 0);

  return (
    <button type="button" className="ct-hv-the" onClick={onMo}>
      <span className="ct-hv-the-anh">
        {mon.thumbnailUrl
          ? <img src={mon.thumbnailUrl} alt="" loading="lazy" />
          : <span className="ct-gn-anh-trong"><BookOpen size={20} aria-hidden /></span>}
        {mon.courseCode && <span className="ct-hv-ma">{mon.courseCode}</span>}
      </span>
      <span className="ct-hv-the-than">
        <span className="ct-hv-the-ten">{chuVi(mon.title)}</span>
        {mon.shortDescription && <span className="ct-hv-the-mo">{chuVi(mon.shortDescription)}</span>}
        <span className="ct-hv-the-so">
          {soBai > 0 && <span><PlayCircle size={12} aria-hidden /> {soBai} bài</span>}
          {mon.level && <span className="ct-mau-tag">{NHAN_BAC[mon.level] ?? mon.level}</span>}
          {mon.isFree && <span className="ct-hv-free">{dich('Miễn phí')}</span>}
        </span>
      </span>
    </button>
  );
}

/* ── Chi tiết một môn ────────────────────────────────────────────────────── */

export function ChiTietMon({
  slug, onQuayLai, nhanQuayLai = 'Học viện',
}: {
  slug: string;
  onQuayLai: () => void;
  /* Nhãn nút quay lại. Cứng "Học viện" thì trang Khoá học có một nút nói sai
     nơi nó sắp quay về — chuyện nhỏ, nhưng người dùng đọc nút để biết mình
     đang ở đâu trong cây. */
  nhanQuayLai?: string;
}) {
  const { dich } = useDich();
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [mon, setMon] = useState<Mon | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [mucMo, setMucMo] = useState<number[]>([]);
  const [baiMo, setBaiMo] = useState<Bai | null>(null);

  /* Tiến độ học — DÙNG CHUNG dữ liệu với web (cùng bảng `lessonProgress`).
     Trước bản này app không ghi gì: học xong trên app rồi mở web vẫn thấy 0%,
     như thể buổi học vừa rồi không tồn tại. */
  const goiApi = useMemo(
    () => (api ? <T,>(d: string, o?: TuyChonGoi) => api.request<T>(d, o) : null),
    [api],
  );
  const tienDo = useTienDo(goiApi, mon?.id ?? null);

  useEffect(() => {
    if (userId === null || !api) return;
    let huy = false;
    setMon(null);
    setLoi(null);
    void swr<Mon>({
      userId,
      key: `academy:mon-slug:${slug}`,
      fetcher: () => api.request<Mon>(`/api/v1/courses/${encodeURIComponent(slug)}`),
      online,
      ttlMs: 30 * 60 * 1000,
      onRefreshed: (moi) => { if (!huy) setMon(moi); },
    })
      .then((kq) => {
        if (huy) return;
        setMon(kq.value);
        // Bung sẵn mục đầu: mở một môn ra mà thấy 10 dòng đóng kín thì không
        // biết bên trong có gì.
        setMucMo((kq.value.sections ?? []).slice(0, 1).map((s) => s.id));
      })
      .catch((e: unknown) => {
        if (huy) return;
        setLoi(
          e instanceof OfflineUnavailableError
            ? 'Môn này chưa từng mở nên không đọc được khi ngoại tuyến.'
            : e instanceof Error ? e.message : String(e),
        );
      });
    return () => { huy = true; };
  }, [api, userId, online, slug]);

  const muc = mon?.sections ?? [];
  const tongBai = muc.reduce((n, x) => n + (x.lessons ?? []).length, 0);
  const soXong = muc.reduce(
    (n, x) => n + (x.lessons ?? []).filter((b) => tienDo.xong.has(b.id)).length, 0);

  if (baiMo && mon) {
    /* Danh sách PHẲNG theo đúng thứ tự hiển thị: nối bài của từng mục lại.
       Điều hướng phải đi XUYÊN mục — hết mục 1 là sang bài đầu mục 2, y như
       web. Chặn trong một mục thì tới bài cuối mục là cụt đường. */
    const phang = muc.flatMap((s) => s.lessons ?? []);
    const i = phang.findIndex((b) => b.id === baiMo.id);
    return (
      /* `key` để đổi bài là GẮN LẠI hẳn: đặt lại trạng thái mở video, gắn lại
         `KhungVideo`, và effect cuộn-lên-đầu chạy. Giữ nguyên component thì
         bài mới hiện ra ở giữa trang, đúng chỗ người dùng đang cuộn dở. */
      <DocBai
        key={baiMo.id}
        bai={baiMo}
        mon={mon}
        onQuayLai={() => setBaiMo(null)}
        truoc={i > 0 ? phang[i - 1] ?? null : null}
        sau={i >= 0 && i + 1 < phang.length ? phang[i + 1] ?? null : null}
        onDoiBai={setBaiMo}
        daXong={tienDo.xong.has(baiMo.id)}
        onDanhDau={(r: boolean) => void tienDo.danhDau(baiMo.id, r)}
      />
    );
  }

  if (loi) {
    return (
      <div className="ct-page ct-hv">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> {nhanQuayLai}
        </button>
        <div className="ct-empty"><CloudOff size={26} aria-hidden className="ct-empty-icon" /><p>{loi}</p></div>
      </div>
    );
  }

  if (!mon) {
    return (
      <div className="ct-page ct-hv">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> {nhanQuayLai}
        </button>
        <p className="ct-muted">{dich('Đang tải…')}</p>
      </div>
    );
  }

  const hoc = raDanhSach(mon.whatYouLearn);
  const canCo = raDanhSach(mon.requirements);

  return (
    <div className="ct-page ct-hv ct-hv-ct">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> {nhanQuayLai}
      </button>

      <header className="ct-hv-hero">
        {mon.thumbnailUrl && <img className="ct-hv-hero-anh" src={mon.thumbnailUrl} alt="" />}
        <div className="ct-hv-hero-chu">
          <p className="ct-hv-hero-nhan">
            {mon.courseCode && <span className="ct-hv-ma">{mon.courseCode}</span>}
            {mon.level && <span className="ct-mau-tag">{NHAN_BAC[mon.level] ?? mon.level}</span>}
            {mon.isFree && <span className="ct-hv-free">{dich('Miễn phí')}</span>}
          </p>
          <h1>{chuVi(mon.title)}</h1>
          {mon.shortDescription && <p className="ct-hv-hero-mo">{chuVi(mon.shortDescription)}</p>}
          <p className="ct-hv-hero-so">
            <span><Layers3 size={13} aria-hidden /> {muc.length} mục</span>
            <span><PlayCircle size={13} aria-hidden /> {tongBai} bài</span>
            {mon.instructorName && <span className="ct-muted">{mon.instructorName}</span>}
          </p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/courses/${mon.slug}`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      {hoc.length > 0 && (
        <section className="ct-hv-hoc">
          <h2>{dich('Học xong bạn làm được gì')}</h2>
          <ul>{hoc.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      {canCo.length > 0 && (
        <section className="ct-hv-hoc">
          <h2>{dich('Cần có trước')}</h2>
          <ul>{canCo.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      <section className="ct-hv-muc-ds">
        <h2>{dich('Nội dung môn học')}</h2>
        {/* Thanh tiến độ — web có, app thì chưa bao giờ. Chỉ hiện khi môn có
            bài: chia cho 0 ra NaN và thanh sẽ nhảy lung tung. */}
        {tongBai > 0 && (
          <div className="ct-hv-tiendo">
            <div className="ct-hv-tiendo-thanh">
              <span style={{ width: `${Math.round((soXong / tongBai) * 100)}%` }} />
            </div>
            <span className="ct-hv-tiendo-chu">
              {soXong}/{tongBai} {dich('bài')} · {Math.round((soXong / tongBai) * 100)}%
            </span>
          </div>
        )}
        {muc.length === 0 ? (
          <p className="ct-muted">{dich('Môn này chưa có bài học nào được đăng.')}</p>
        ) : muc.map((s) => {
          const mo = mucMo.includes(s.id);
          const bai = s.lessons ?? [];
          return (
            <div key={s.id} className="ct-hv-muc" data-mo={mo}>
              <button
                type="button"
                className="ct-hv-muc-dau"
                aria-expanded={mo}
                onClick={() => setMucMo((c) => (c.includes(s.id) ? c.filter((x) => x !== s.id) : [...c, s.id]))}
              >
                {mo ? <ChevronDown size={15} aria-hidden /> : <ChevronRight size={15} aria-hidden />}
                <span className="ct-hv-muc-ten">{chuVi(s.title)}</span>
                <span className="ct-mau-dem">{s.lessonCount ?? bai.length} bài</span>
              </button>
              {mo && (
                <ul className="ct-hv-bai-ds">
                  {bai.map((b) => {
                    /* Máy chủ chỉ trả `content` cho bài xem thử khi chưa ghi
                       danh. Không có nội dung LẪN không có video ⇒ bài khoá. */
                    const khoa = !b.content && !b.videoUrl;
                    return (
                      <li key={b.id}>
                        <button
                          type="button"
                          className="ct-hv-bai"
                          data-khoa={khoa}
                          onClick={() => (khoa ? moNgoai(`${WEB}/courses/${mon.slug}`) : setBaiMo(b))}
                          title={khoa ? 'Bài này cần ghi danh — mở trên web' : chuVi(b.title)}
                        >
                          {khoa ? <Lock size={13} aria-hidden />
                            : tienDo.xong.has(b.id) ? <CheckCircle2 size={13} aria-hidden className="ct-hv-bai-xong" />
                              : b.videoUrl ? <PlayCircle size={13} aria-hidden />
                                : <FileText size={13} aria-hidden />}
                          <span className="ct-hv-bai-ten">{chuVi(b.title)}</span>
                          {b.isFreePreview && <span className="ct-hv-free">{dich('xem thử')}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ── Đọc một bài ─────────────────────────────────────────────────────────── */

/** Bài chưa mở khoá: máy chủ không trả nội dung LẪN video khi chưa ghi danh. */
function baiKhoa(b: Bai): boolean { return !b.content && !b.videoUrl; }

function DocBai({
  bai, mon, onQuayLai, truoc, sau, onDoiBai, daXong, onDanhDau,
}: {
  bai: Bai; mon: Mon; onQuayLai: () => void;
  truoc: Bai | null; sau: Bai | null; onDoiBai: (b: Bai) => void;
  /** Bài này đã được đánh dấu học xong chưa. */
  daXong: boolean;
  onDanhDau: (roi: boolean) => void;
}) {
  const { dich } = useDich();
  const { api } = useSession();

  /*
   * CHI TIẾT BÀI — thứ làm app hết "sơ sài".
   *
   * Dữ liệu đi kèm `/courses/:slug` chỉ có `content`. Phần GIẢNG SÂU
   * (`teachingNotes`), đề của bài QUIZ, ba luồng video và tài liệu PDF đều
   * nằm ở `/courses/:id/lessons/:baiId` — mà app chưa từng gọi. Xem
   * `chiTietBai.ts`.
   */
  const goi = useMemo(
    () => (api ? <T,>(d: string, o?: TuyChonGoi) => api.request<T>(d, o) : null),
    [api],
  );
  const ct = useChiTietBai(goi, mon.id ?? null, bai.id);

  /*
   * ĐỀ LUYỆN CUỐI CHƯƠNG.
   *
   * Web hiện nó trong lộ trình môn, cho MỌI chương có câu hỏi. Ở đây chỉ hiện
   * cho chương chứa BÀI ĐANG MỞ — người đang đọc bài 4.1 không cần thấy đề của
   * chín chương khác, và một trang bài học dài thêm chín khối quiz thì phần
   * chuyển bài bị đẩy xuống tận đáy.
   *
   * `section-counts` trả `{ [sectionId]: số câu }`. Chương chưa gán câu nào thì
   * KHÔNG hiện khối — một nút "Làm đề" mở ra rồi báo "không có câu hỏi" tệ hơn
   * hẳn là không có nút.
   */
  const [soCau, datSoCau] = useState<Record<number, number>>({});
  useEffect(() => {
    if (!api || !mon.id) return;
    let con = true;
    void api.request<Record<number, number>>(`/api/v1/exams/practice/section-counts/${mon.id}`)
      .then((r) => { if (con && r && typeof r === 'object') datSoCau(r); })
      .catch(() => { /* không có đề thì thôi, đừng làm hỏng cả trang bài học */ });
    return () => { con = false; };
  }, [api, mon.id]);

  /** Chương chứa bài đang mở. `null` nếu môn chưa tải xong danh sách chương. */
  const chuong = (mon.sections ?? []).find((m) => (m.lessons ?? []).some((b) => b.id === bai.id)) ?? null;

  /* Video HIỆN SẴN khi bài có video — người dùng yêu cầu 20/08/2026: "tôi muốn
     vào video nó hiện cố định, chứ đừng phải ấn vào nó mới hiện".
     Cái giá: mỗi lần mở một bài CÓ video là một lượt tải YouTube, kể cả khi họ
     chỉ định đọc chữ. Đổi lại còn nút X để đóng, và lúc đó nút "Xem video trong
     app" hiện lại. */
  const [xemVideo, datXemVideo] = useState(true);

  /*
   * ── BA LUỒNG VIDEO: giảng tiếng Việt / tiếng Anh / YouTube ──
   *
   * Web cho đổi qua lại; app trước bản này chỉ chơi được `bai.videoUrl`, tức
   * đúng MỘT luồng — và với những môn có bản giảng tiếng Việt riêng thì người
   * học app không có đường nào tới nó.
   *
   * Không có `videoTracks` (bài cũ, hoặc chưa nạp xong chi tiết) thì dựng một
   * luồng duy nhất từ `videoUrl` — y như web làm, để không có bài nào mất video.
   */
  const luong = useMemo(() => {
    const ds = (ct?.videoTracks ?? []).filter((t) => t && t.url);
    if (ds.length) return ds;
    const url = ct?.videoUrl || bai.videoUrl || '';
    return url ? [{ key: 'VI', url, platform: ct?.videoPlatform ?? null }] : [];
  }, [ct?.videoTracks, ct?.videoUrl, ct?.videoPlatform, bai.videoUrl]);

  const [luongChon, datLuongChon] = useState<string | null>(null);
  /* Đổi bài ⇒ quay về luồng mặc định của bài MỚI. Giữ lựa chọn cũ thì người
     đang xem bản tiếng Anh sang bài không có bản tiếng Anh sẽ thấy khung trống. */
  useEffect(() => { datLuongChon(null); }, [bai.id]);
  const luongDang = luong.find((t) => t.key === (luongChon ?? ct?.defaultVideoTrack))
    ?? luong[0]
    ?? null;
  const goc = useRef<HTMLDivElement>(null);
  /* Đổi bài thì mở lại khung (nếu bài trước họ đã đóng). */
  useEffect(() => { datXemVideo(true); }, [bai.id]);

  /* Lọc HTML trước khi dựng. Nội dung do quản trị viên soạn nên nó là HTML
     thật (không phải chữ thoát), mà một trình soạn thảo giàu định dạng thì có
     thể mang theo `<script>` hoặc `onerror=` từ chỗ dán vào. DOMPurify chạy ở
     renderer, ngay trước khi vẽ. */
  const html = useMemo(() => {
    const sach = DOMPurify.sanitize(ct?.content ?? bai.content ?? '', { USE_PROFILES: { html: true } });
    /* Bản song ngữ: nội dung bọc trong `.ml-en` / `.ml-vi`. Web ẩn một bên
       bằng `[data-ml]`; ở đây đặt cùng thuộc tính lên phần bọc. */
    return sach;
  }, [ct?.content, bai.content]);

  /* Phần giảng sâu — lọc cùng cách với nội dung chính. Nó cũng là HTML do quản
     trị viên soạn, nên cũng phải đi qua DOMPurify. */
  const ghiChuGiang = useMemo(
    () => (ct?.teachingNotes
      ? DOMPurify.sanitize(ct.teachingNotes, { USE_PROFILES: { html: true } })
      : ''),
    [ct?.teachingNotes],
  );

  /* Đề của bài QUIZ. Máy chủ trả `quizData` dạng object; bản cũ có thể là
     CHUỖI JSON — nhận cả hai, vì một `JSON.parse` thiếu ở đây là trang trắng. */
  const deQuiz = useMemo<QuizData | null>(() => {
    const raw = ct?.quizData;
    if (!raw) return null;
    try {
      const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return (o && Array.isArray((o as QuizData).questions) && (o as QuizData).questions.length)
        ? (o as QuizData) : null;
    } catch { return null; }
  }, [ct?.quizData]);

  const dsPdf = useMemo(() => locPdf(ct?.documents ?? bai.documents), [ct?.documents, bai.documents]);

  /* Đổi bài phải về ĐẦU trang. Component được gắn lại (`key` ở chỗ gọi), nên
     effect này chạy đúng một lần mỗi bài. Tìm lớp cuộn bằng cách đi ngược tổ
     tiên thay vì gọi tên `.ct-content`: đổi tên lớp ở vỏ app thì chỗ này hỏng
     câm, không lỗi nào để thấy. */
  useEffect(() => {
    for (let n = goc.current?.parentElement; n; n = n.parentElement) {
      const k = getComputedStyle(n).overflowY;
      if (k === 'auto' || k === 'scroll') { n.scrollTop = 0; return; }
    }
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="ct-page ct-hv ct-hv-bai-doc" ref={goc}>
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> {chuVi(mon.title)}
      </button>

      <h1 className="ct-hv-bai-tieude">{chuVi(bai.title)}</h1>
      {bai.description && <p className="ct-hv-hero-mo">{chuVi(bai.description)}</p>}

      <div className="ct-hv-bai-nut">
        {luongDang && !xemVideo && (
          <button type="button" className="ct-btn" onClick={() => datXemVideo(true)}>
            <PlayCircle size={15} aria-hidden /> Xem video trong app
          </button>
        )}
        {luongDang && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(luongDang.url)}>
            <ExternalLink size={14} aria-hidden /> Mở trên YouTube
          </button>
        )}
        {bai.sourceCodeUrl && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(bai.sourceCodeUrl!)}>
            <ExternalLink size={14} aria-hidden /> Mã nguồn
          </button>
        )}
        {(bai.documents ?? []).map((d) => {
          const url = d.fileUrl ?? d.url;
          if (!url) return null;
          return (
            <button key={d.id} type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(url)}>
              <FileText size={14} aria-hidden /> {chuVi(d.title) || 'Tài liệu'}
            </button>
          );
        })}
      </div>

      {/* Khung video nằm NGOÀI vùng cuộn của bài — xem chú thích đầu KhungVideo:
          trang web do main vẽ đè, cuộn theo chữ là nó trùm lên chữ. */}
      {/* Thanh chọn luồng — chỉ hiện khi có TỪ HAI luồng trở lên. Một nút đơn
          độc không cho chọn gì là nhiễu thuần tuý. */}
      {xemVideo && luong.length > 1 && (
        <div className="ct-hv-luong" role="group" aria-label={dich('Chọn bản video')}>
          {luong.map((t) => (
            <button
              key={t.key}
              type="button"
              className="ct-hv-luong-nut"
              data-chon={t.key === luongDang?.key}
              onClick={() => datLuongChon(t.key)}
            >
              {NHAN_LUONG[t.key] ?? t.label ?? t.key}
            </button>
          ))}
        </div>
      )}

      {xemVideo && luongDang && (
        /* `key` ở đây là PHÒNG XA, không phải bản vá cho một lỗi đang có.
           Đo thật: gỡ nó ra thì đổi bài VẪN nạp đúng video mới, vì luồng hiện
           tại bắt quay ra danh sách trước, và cú đó tháo cả trình đọc.
           Nhưng `KhungVideo` chốt `daMoRef` để chỉ gọi `mo()` một lần mỗi lần
           gắn. Ngày nào có ai thêm nút "bài kế tiếp" ngay trong trình đọc —
           đổi bài mà KHÔNG tháo — thì thiếu `key` là khung kẹt video cũ, im
           lặng, không lỗi nào để thấy. Một chữ, mua trước cái đó. */
        /* `key` gồm cả luồng: đổi bản tiếng Việt ↔ tiếng Anh phải nạp lại
           khung, mà `KhungVideo` chốt `daMoRef` để chỉ gọi `mo()` một lần mỗi
           lần gắn — thiếu luồng trong `key` là bấm đổi mà video không đổi. */
        <KhungVideo key={`${bai.id}:${luongDang.key}`} url={luongDang.url} onDong={() => datXemVideo(false)} />
      )}

      {html
        ? <div className="ct-hv-noidung rich-content" data-ml="vi" dangerouslySetInnerHTML={{ __html: html }} />
        : (
          <p className="ct-muted">
            Bài này chưa có nội dung chữ.{' '}
            <button type="button" className="ct-linklike" onClick={() => moNgoai(`${WEB}/courses/${mon.slug}`)}>
              {dich('Mở trên web')}
            </button>
          </p>
        )}

      {/* ── PHẦN GIẢNG SÂU ──
          `teachingNotes` thường DÀI HƠN `content` và là chỗ chứa lời giảng
          thật của bài — web hiện nó, app thì chưa bao giờ. Đây là phần lớn
          nhất của lời than "trên app desktop đăng sơ sài". */}
      {ghiChuGiang && (
        <div
          className="ct-hv-noidung rich-content"
          data-ml="vi"
          dangerouslySetInnerHTML={{ __html: ghiChuGiang }}
        />
      )}

      {/* ── BÀI DẠNG QUIZ ──
          Trước bản này bài QUIZ không có `content` nên app hiện đúng một dòng
          "Bài này chưa có nội dung chữ" — người học tưởng bài hỏng. */}
      {laBaiQuiz(ct?.lessonType ?? bai.lessonType) && deQuiz && (
        <div className="ct-hv-quiz">
          <LessonQuizPlayer key={bai.id} quiz={deQuiz} locale="vi" />
        </div>
      )}

      {/* ── PDF KÈM BÀI ──
          Bài tập / lời giải dạng PDF: web nhúng đọc ngay tại chỗ, app trước
          đây chỉ có nút mở ra trình duyệt ngoài. */}
      {dsPdf.map((d) => (
        <div key={d.id} className="ct-hv-pdf">
          <LessonPdfViewer
            url={duongTaiLieu(api?.baseUrlForForms() ?? WEB, d.id)}
            {...(d.title ? { title: chuVi(d.title) } : {})}
          />
        </div>
      ))}

      {/* Gia sư AI cho ĐÚNG bài đang mở. Đặt SAU nội dung: người ta đọc xong
          rồi mới có câu hỏi, và một khung chat chen giữa bài thì nó cắt mạch
          đọc ngay chỗ đang cần liền mạch nhất. */}
      <CourseTutor
        lessonId={bai.id}
        {...(mon.courseCode ? { courseCode: mon.courseCode } : {})}
        courseTitle={mon.title}
        lessonTitle={bai.title}
      />

      {chuong && (soCau[chuong.id] ?? 0) > 0 && (
        <ChapterQuiz
          sectionId={chuong.id}
          sectionTitle={chuong.title}
          count={soCau[chuong.id] ?? 0}
          lessonId={bai.id}
        />
      )}

      {/* ── ĐÁNH DẤU HỌC XONG ──
          Đặt TRƯỚC phần chuyển bài: đọc xong thì việc tiếp theo tự nhiên là
          đánh dấu rồi sang bài sau, theo đúng thứ tự đó trên màn hình.
          Tiến độ ghi vào cùng bảng với web, nên học trên app xong mở web vẫn
          thấy đúng % — trước bản này app không ghi gì cả. */}
      <div className="ct-hv-xong">
        <button
          type="button"
          className={daXong ? 'ct-btn ct-btn-ghost' : 'ct-btn'}
          onClick={() => onDanhDau(!daXong)}
          data-xong={daXong}
        >
          <CheckCircle2 size={15} aria-hidden />
          {daXong ? dich('Đã học xong — bỏ đánh dấu') : dich('Đánh dấu đã học xong')}
        </button>
      </div>

      {/* Chuyển bài — đi xuyên mục, y như web.
          Bài kế bị khoá thì KHÔNG giấu nút: giấu đi là người dùng tưởng đã hết
          bài. Hiện ổ khoá và mở bản web, đúng cách danh sách bài đang làm. */}
      {(truoc || sau) && (
        <nav className="ct-hv-chuyen" aria-label={dich('Chuyển bài')}>
          {truoc ? (
            <button
              type="button"
              className="ct-hv-chuyen-nut"
              data-ben="truoc"
              onClick={() => (baiKhoa(truoc) ? moNgoai(`${WEB}/courses/${mon.slug}`) : onDoiBai(truoc))}
              title={chuVi(truoc.title)}
            >
              <ArrowLeft size={15} aria-hidden />
              <span className="ct-hv-chuyen-chu">
                <span className="ct-hv-chuyen-nhan">{dich('Bài trước')}</span>
                <span className="ct-hv-chuyen-ten">
                  {baiKhoa(truoc) && <Lock size={11} aria-hidden />} {chuVi(truoc.title)}
                </span>
              </span>
            </button>
          ) : <span />}

          {sau && (
            <button
              type="button"
              className="ct-hv-chuyen-nut"
              data-ben="sau"
              onClick={() => (baiKhoa(sau) ? moNgoai(`${WEB}/courses/${mon.slug}`) : onDoiBai(sau))}
              title={chuVi(sau.title)}
            >
              <span className="ct-hv-chuyen-chu">
                <span className="ct-hv-chuyen-nhan">{dich('Bài tiếp theo')}</span>
                <span className="ct-hv-chuyen-ten">
                  {baiKhoa(sau) && <Lock size={11} aria-hidden />} {chuVi(sau.title)}
                </span>
              </span>
              <ArrowRight size={15} aria-hidden />
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
