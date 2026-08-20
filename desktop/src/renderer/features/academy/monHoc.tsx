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
  FileText, Layers3, Lock, PlayCircle,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { chuVi, moNgoai, NHAN_BAC, raDanhSach, WEB } from '../chu';
import './noiDungBai';
import { KhungVideo } from './KhungVideo';

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
          {mon.isFree && <span className="ct-hv-free">Miễn phí</span>}
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
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [mon, setMon] = useState<Mon | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [mucMo, setMucMo] = useState<number[]>([]);
  const [baiMo, setBaiMo] = useState<Bai | null>(null);

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
        <p className="ct-muted">Đang tải…</p>
      </div>
    );
  }

  const tongBai = muc.reduce((n, s) => n + (s.lessons ?? []).length, 0);
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
            {mon.isFree && <span className="ct-hv-free">Miễn phí</span>}
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
          <h2>Học xong bạn làm được gì</h2>
          <ul>{hoc.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      {canCo.length > 0 && (
        <section className="ct-hv-hoc">
          <h2>Cần có trước</h2>
          <ul>{canCo.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      <section className="ct-hv-muc-ds">
        <h2>Nội dung môn học</h2>
        {muc.length === 0 ? (
          <p className="ct-muted">Môn này chưa có bài học nào được đăng.</p>
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
                            : b.videoUrl ? <PlayCircle size={13} aria-hidden />
                              : <FileText size={13} aria-hidden />}
                          <span className="ct-hv-bai-ten">{chuVi(b.title)}</span>
                          {b.isFreePreview && <span className="ct-hv-free">xem thử</span>}
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
  bai, mon, onQuayLai, truoc, sau, onDoiBai,
}: {
  bai: Bai; mon: Mon; onQuayLai: () => void;
  truoc: Bai | null; sau: Bai | null; onDoiBai: (b: Bai) => void;
}) {
  /* Video HIỆN SẴN khi bài có video — người dùng yêu cầu 20/08/2026: "tôi muốn
     vào video nó hiện cố định, chứ đừng phải ấn vào nó mới hiện".
     Cái giá: mỗi lần mở một bài CÓ video là một lượt tải YouTube, kể cả khi họ
     chỉ định đọc chữ. Đổi lại còn nút X để đóng, và lúc đó nút "Xem video trong
     app" hiện lại. */
  const [xemVideo, datXemVideo] = useState(true);
  const goc = useRef<HTMLDivElement>(null);
  /* Đổi bài thì mở lại khung (nếu bài trước họ đã đóng). */
  useEffect(() => { datXemVideo(true); }, [bai.id]);

  /* Lọc HTML trước khi dựng. Nội dung do quản trị viên soạn nên nó là HTML
     thật (không phải chữ thoát), mà một trình soạn thảo giàu định dạng thì có
     thể mang theo `<script>` hoặc `onerror=` từ chỗ dán vào. DOMPurify chạy ở
     renderer, ngay trước khi vẽ. */
  const html = useMemo(() => {
    const sach = DOMPurify.sanitize(bai.content ?? '', { USE_PROFILES: { html: true } });
    /* Bản song ngữ: nội dung bọc trong `.ml-en` / `.ml-vi`. Web ẩn một bên
       bằng `[data-ml]`; ở đây đặt cùng thuộc tính lên phần bọc. */
    return sach;
  }, [bai.content]);

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
        {bai.videoUrl && !xemVideo && (
          <button type="button" className="ct-btn" onClick={() => datXemVideo(true)}>
            <PlayCircle size={15} aria-hidden /> Xem video trong app
          </button>
        )}
        {bai.videoUrl && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(bai.videoUrl!)}>
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
      {xemVideo && bai.videoUrl && (
        /* `key` ở đây là PHÒNG XA, không phải bản vá cho một lỗi đang có.
           Đo thật: gỡ nó ra thì đổi bài VẪN nạp đúng video mới, vì luồng hiện
           tại bắt quay ra danh sách trước, và cú đó tháo cả trình đọc.
           Nhưng `KhungVideo` chốt `daMoRef` để chỉ gọi `mo()` một lần mỗi lần
           gắn. Ngày nào có ai thêm nút "bài kế tiếp" ngay trong trình đọc —
           đổi bài mà KHÔNG tháo — thì thiếu `key` là khung kẹt video cũ, im
           lặng, không lỗi nào để thấy. Một chữ, mua trước cái đó. */
        <KhungVideo key={bai.id} url={bai.videoUrl} onDong={() => datXemVideo(false)} />
      )}

      {html
        ? <div className="ct-hv-noidung rich-content" data-ml="vi" dangerouslySetInnerHTML={{ __html: html }} />
        : (
          <p className="ct-muted">
            Bài này chưa có nội dung chữ.{' '}
            <button type="button" className="ct-linklike" onClick={() => moNgoai(`${WEB}/courses/${mon.slug}`)}>
              Mở trên web
            </button>
          </p>
        )}

      {/* Chuyển bài — đi xuyên mục, y như web.
          Bài kế bị khoá thì KHÔNG giấu nút: giấu đi là người dùng tưởng đã hết
          bài. Hiện ổ khoá và mở bản web, đúng cách danh sách bài đang làm. */}
      {(truoc || sau) && (
        <nav className="ct-hv-chuyen" aria-label="Chuyển bài">
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
                <span className="ct-hv-chuyen-nhan">Bài trước</span>
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
                <span className="ct-hv-chuyen-nhan">Bài tiếp theo</span>
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
