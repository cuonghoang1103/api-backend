/**
 * Học viện — 9 kỳ · 50 môn của chương trình FPTU.
 *
 * Đối chiếu API (đo thật 20/08/2026):
 *   GET /api/v1/academy/semesters        → 9 kỳ
 *   GET /api/v1/courses/semester/:id     → môn của kỳ, kèm sẵn `sections`
 *   GET /api/v1/courses/:slug            → chi tiết + bài học + nội dung
 *
 * ─── Chữ SONG NGỮ ngăn bằng `|||` ───
 * Tiêu đề trong cơ sở dữ liệu là `"About LAB211|||Giới thiệu LAB211"`. Quên
 * tách là người dùng nhìn thấy nguyên cả dấu ngăn lẫn bản tiếng Anh — trông
 * như dữ liệu hỏng. Web tách bằng `pickLang`; ở đây là `chuVi()`, cùng luật:
 * ưu tiên tiếng Việt, không có thì lùi về tiếng Anh chứ KHÔNG để trống.
 *
 * ─── Vì sao KHÔNG nhúng video ───
 * `videoPlatform: 'EMBED'` với link YouTube, mà CSP của app đặt
 * `frame-src 'none'` — nhúng vào chỉ được khung trắng, không lỗi nào hiện ra.
 * Nên mở ra trình duyệt ngoài và nói rõ trên nút. Cùng cách trang Giọng nói.
 *
 * ─── Bài KHOÁ thì nói ra ───
 * Máy chủ chỉ trả `content` cho bài `isFreePreview` khi chưa ghi danh. Bài
 * khác về rỗng. Hiện một trang trắng cho chúng là để người dùng tưởng nội dung
 * chưa có; hiện ổ khoá + đường ghi danh thì họ biết phải làm gì.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown, ChevronRight, CloudOff, Compass, ExternalLink, GraduationCap,
  Layers3, Network, RefreshCw, Search, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { chuVi, fold, moNgoai, WEB } from '../chu';
import { ChiTietMon, TheMon, type Mon } from './monHoc';
import { useDich } from '../../i18n';
/*
 * CHỌN NGÀNH + LỌC THEO NGÀNH HẸP — DÙNG LẠI của web, không viết lại.
 *
 * Người dùng 15/09/2026: *"chưa có chọn ngành, tư vấn ngành hẹp, sơ đồ, lọc
 * ngành đúng với ngành hẹp"*.
 *
 * `AcademyOnboarding` là con robot hỏi khoa → ngành → combo; `useAcademyProfile`
 * nhớ câu trả lời (localStorage + đồng bộ lên máy chủ) nên chọn trên web thì
 * app cũng biết, và ngược lại. Phần LỌC nằm ở `locTheoNganh.ts` — nó là kiến
 * thức về chương trình đào tạo (mã cũ ↔ mã mới, project theo combo), chép sang
 * đây là hai bản sẽ lệch ở lần cập nhật khung kế tiếp.
 */
import AcademyOnboarding from '@/components/academy/AcademyOnboarding';
import { useAcademyProfile } from '@/hooks/useAcademyProfile';
import { getCatCombo, getCatMajor, getFaculty } from '@/data/academyCatalog';
import { daChonNganhHep, locMonMotKy, maCuaKhung } from '@/components/academy/locTheoNganh';
import { Chu } from '../../i18n/Chu';

interface Ky {
  id: number;
  name: string;
  code: string;
  ordinal: number;
  description?: string | null;
}

export function HocVienPage() {
  const { dich, dichP } = useDich();
  const { online, navigate } = useAppState();
  const { api, userId } = useSession();

  const [ky, setKy] = useState<Ky[]>([]);
  const [monTheoKy, setMonTheoKy] = useState<Record<number, Mon[]>>({});
  const [bung, setBung] = useState<number[]>([]);
  const [tim, setTim] = useState('');
  const [dangTai, setDangTai] = useState(true);
  const [cu, setCu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moSlug, setMoSlug] = useState<string | null>(null);

  /* Hồ sơ ngành. `needsOnboarding` = chưa từng trả lời ⇒ mở robot hỏi. Người
     đã nói "không phải sinh viên FPTU" cũng là một câu trả lời, không hỏi lại. */
  const { profile, needsOnboarding } = useAcademyProfile();
  const [daBoQua, datDaBoQua] = useState(false);
  const [moChonLai, datMoChonLai] = useState(false);
  const moOnboarding = moChonLai || (needsOnboarding && !daBoQua);

  const khoa = getFaculty(profile.faculty);
  const major = getCatMajor(profile.faculty, profile.major);
  const combo = getCatCombo(profile.faculty, profile.major, profile.combo);
  const coLoc = daChonNganhHep(profile, !!major, !!combo);
  const khungMa = useMemo(() => maCuaKhung(profile, coLoc), [profile, coLoc]);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    setDangTai(true);
    setLoi(null);
    try {
      const dsKy = await swr<Ky[]>({
        userId,
        key: 'academy:ky',
        fetcher: () => api.request<Ky[]>('/api/v1/academy/semesters'),
        online,
        ttlMs: 30 * 60 * 1000,
      });
      const sap = [...(dsKy.value ?? [])].sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0));
      setKy(sap);
      setCu(dsKy.isStale);

      /* Tải môn của MỌI kỳ song song, ngay từ đầu.
         Chờ người dùng bung từng kỳ rồi mới tải thì ô tìm kiếm chỉ tìm được
         trong những kỳ họ đã mở — một bộ tìm kiếm nói dối. 9 lời gọi nhẹ,
         và sau lần đầu là đọc từ cache. */
      const cap = await Promise.all(sap.map(async (s) => {
        try {
          const r = await swr<Mon[]>({
            userId,
            key: `academy:mon:${s.id}`,
            fetcher: () => api.request<Mon[]>(`/api/v1/courses/semester/${s.id}`),
            online,
            ttlMs: 30 * 60 * 1000,
          });
          return [s.id, r.value ?? []] as const;
        } catch {
          return [s.id, [] as Mon[]] as const;   // một kỳ hỏng không được làm hỏng cả trang
        }
      }));
      setMonTheoKy(Object.fromEntries(cap));
      setBung((cu2) => (cu2.length ? cu2 : sap.slice(0, 2).map((s) => s.id)));
    } catch (e) {
      setLoi(
        e instanceof OfflineUnavailableError
          ? 'Chưa từng tải Học viện về máy nên không xem được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e),
      );
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  const tatCaMon = useMemo(() => {
    const thay = new Set<number>();
    const ra: Mon[] = [];
    for (const s of ky) {
      for (const m of monTheoKy[s.id] ?? []) {
        if (!thay.has(m.id)) { thay.add(m.id); ra.push(m); }
      }
    }
    return ra;
  }, [ky, monTheoKy]);

  /* Xếp hạng: MÃ MÔN khớp chính xác lên đầu.
     Gõ "LAB211" phải ra đúng nó ở dòng đầu, chứ không phải lẫn giữa mười môn
     khác cùng chứa chuỗi "lab". Web xếp đúng như vậy; giữ cho khớp. */
  const ketQua = useMemo(() => {
    const q = fold(tim.trim());
    if (!q) return [];
    return tatCaMon
      .filter((m) => fold(`${m.courseCode ?? ''} ${chuVi(m.title)} ${chuVi(m.shortDescription)}`).includes(q))
      .sort((a, b) => {
        const am = fold(a.courseCode ?? '') === q ? 0 : 1;
        const bm = fold(b.courseCode ?? '') === q ? 0 : 1;
        return am - bm || (a.courseCode ?? '').localeCompare(b.courseCode ?? '');
      });
  }, [tim, tatCaMon]);

  if (moSlug) {
    return <ChiTietMon slug={moSlug} onQuayLai={() => setMoSlug(null)} />;
  }

  const tongMon = tatCaMon.length;
  /* Số môn CÒN LẠI sau khi lọc theo ngành hẹp. Web hiện con số này trong một
     con chip ("Đang lọc N môn của ngành") vì nếu không, danh sách ngắn đi mà
     không nói vì sao thì trông như mất môn. */
  const monNganh = coLoc
    ? ky.reduce((t, s) => t + locMonMotKy(monTheoKy[s.id] ?? [], khungMa, profile).length, 0)
    : tongMon;

  return (
    <div className="ct-page ct-hv">
      <header className="ct-hv-dau">
        <div>
          <h1><GraduationCap size={20} aria-hidden /> {dich('Học viện')}</h1>
          <p className="ct-muted">
            {ky.length > 0
              ? `${ky.length} kỳ · ${tongMon} môn — chương trình FPTU`
              : 'Chương trình FPTU theo từng kỳ'}
          </p>
        </div>
        <div className="ct-hv-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> {dich('bản đã lưu')}</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
          {/* CHƯA chọn ngành thì đây là lối vào duy nhất. Đã chọn rồi thì mọi
              thứ chuyển xuống khối "Ngành của bạn" bên dưới — giống hệt web,
              và vì một thanh nút bốn cái ở đầu trang không nói được cái nào
              quan trọng. */}
          {!major && (
            <button type="button" className="ct-btn ct-btn-ghost" onClick={() => datMoChonLai(true)}>
              <GraduationCap size={14} aria-hidden /> {dich('Chọn ngành')}
            </button>
          )}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/academy`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      {/*
        ============================================================
        NGÀNH CỦA BẠN — khối sau khi đã chọn xong
        ============================================================

        Bám theo web (`frontend/src/app/academy/page.tsx`): đây là chỗ DUY NHẤT
        để đổi ngành và mở sơ đồ môn học, và nó chỉ hiện SAU khi người dùng đã
        đi qua các bước. Trước đó không có gì ở đây cả — người mới thấy hộp
        thoại hỏi khoa → ngành → ngành hẹp, đúng trình tự.

        ⚠️ Chỉ hiện khi người dùng nói mình LÀ sinh viên FPTU. Ai đã trả lời
        "không phải" thì Học viện với họ là một thư viện môn học bình thường,
        và một khối "Ngành của bạn" trống rỗng chỉ tổ khó hiểu.
      */}
      {profile.isStudent === true && major && (
        <section className="ct-hv-nganh">
          <span className="ct-hv-nganh-icon" aria-hidden>{combo?.icon ?? major.icon}</span>
          <div className="ct-hv-nganh-chu">
            <p className="ct-hv-nganh-nhan">
              {dich('Ngành của bạn')}{khoa ? ` · ${khoa.nameVi}` : ''}
            </p>
            <p className="ct-hv-nganh-ten">{combo ? combo.nameVi : major.nameVi}</p>
            <p className="ct-muted ct-hv-nganh-phu">
              {combo ? `${major.nameVi} · ${combo.name}` : major.name}
            </p>
          </div>
          {coLoc && (
            <span className="ct-hv-nganh-chip">
              {dichP('Đang lọc {n} môn của ngành', { n: monNganh })}
            </span>
          )}
          <div className="ct-hv-nganh-nut">
            <button type="button" className="ct-btn ct-btn-ghost"
              onClick={() => navigate('/academy/so-do-mon-hoc')}>
              <Network size={14} aria-hidden /> {dich('Sơ đồ môn học')}
            </button>
            <button type="button" className="ct-btn ct-btn-ghost"
              onClick={() => navigate('/academy/tu-van-nganh')}>
              <Compass size={14} aria-hidden /> {dich('Tư vấn ngành')}
            </button>
            {/* `datMoChonLai` mở lại hộp thoại — cùng hộp thoại của lần đầu,
                nên "đổi ngành" đi qua đúng các bước như lúc chọn. */}
            <button type="button" className="ct-btn ct-btn-ghost"
              onClick={() => datMoChonLai(true)}>
              <RefreshCw size={14} aria-hidden /> {dich('Đổi ngành')}
            </button>
          </div>
          {major.curriculumCode && (
            <p className="ct-muted ct-hv-nganh-khung">
              {dich('Khung')} {major.curriculumCode}
              {major.credits ? ` · ${major.credits} ${dich('tín chỉ')}` : ''} · {dich('nguồn')}: FLM
            </p>
          )}
        </section>
      )}

      <label className="ct-music-search ct-hv-tim">
        <Search size={14} aria-hidden />
        <input
          value={tim}
          onChange={(e) => setTim(e.target.value)}
          placeholder={dich('Tìm theo mã môn (LAB211) hoặc tên môn…')}
          aria-label={dich('Tìm môn học')}
        />
        {tim && (
          <button type="button" className="ct-linklike" onClick={() => setTim('')} aria-label={dich('Xoá tìm kiếm')}>
            <X size={13} aria-hidden />
          </button>
        )}
      </label>

      {loi ? (
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>{dich('Thử lại')}</button>
        </div>
      ) : dangTai && ky.length === 0 ? (
        <p className="ct-muted">{dich('Đang tải…')}</p>
      ) : tim.trim() ? (
        <section className="ct-hv-kq">
          <p className="ct-hv-sokq">{ketQua.length} môn khớp “{tim.trim()}”</p>
          {ketQua.length === 0 ? (
            <div className="ct-empty">
              <Search size={26} aria-hidden className="ct-empty-icon" />
              <p><Chu cau="Không môn nào khớp. Thử mã môn, ví dụ `PRF192`." /></p>
            </div>
          ) : (
            <div className="ct-hv-luoi">
              {ketQua.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
            </div>
          )}
        </section>
      ) : (
        <div className="ct-hv-ky-ds">
          {ky.map((s) => {
            /* Lọc theo ngành hẹp — CÙNG mã với web, xem `locTheoNganh.ts`.
               Chưa chọn ngành thì `khungMa` là null và danh sách giữ nguyên. */
            const ds = locMonMotKy(monTheoKy[s.id] ?? [], khungMa, profile).map((x) => x.course);
            const mo = bung.includes(s.id);
            return (
              <section key={s.id} className="ct-hv-ky" data-mo={mo}>
                <button
                  type="button"
                  className="ct-hv-ky-dau"
                  aria-expanded={mo}
                  onClick={() => setBung((c) => (c.includes(s.id) ? c.filter((x) => x !== s.id) : [...c, s.id]))}
                >
                  {mo ? <ChevronDown size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />}
                  <Layers3 size={15} aria-hidden />
                  <span className="ct-hv-ky-ten">{s.name}</span>
                  <span className="ct-mau-dem">{ds.length} môn</span>
                </button>
                {mo && (
                  ds.length === 0 ? (
                    <p className="ct-muted ct-hv-ky-trong">{dich('Kỳ này chưa có môn nào được đăng.')}</p>
                  ) : (
                    <div className="ct-hv-luoi">
                      {ds.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
                    </div>
                  )
                )}
              </section>
            );
          })}
        </div>
      )}
      {/* Robot hỏi khoa → ngành → combo. Trả lời xong là danh sách môn tự lọc
          theo khung ngành đó. Câu trả lời lưu chung với web (localStorage +
          hồ sơ trên máy chủ) nên chọn ở đâu cũng có tác dụng ở cả hai. */}
      <AcademyOnboarding
        open={moOnboarding}
        onClose={() => { datMoChonLai(false); datDaBoQua(true); }}
        {...(moChonLai ? { startAtMajor: true } : {})}
      />

    </div>
  );
}
