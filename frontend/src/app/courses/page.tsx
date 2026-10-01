'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { Compass, LayoutGrid, GraduationCap, X } from 'lucide-react';
import CourseCard from '@/components/course/CourseCard';
import CourseRoadmap from '@/components/courses/CourseRoadmap';
import HeroDanhMuc from '@/components/courses/danh-muc/HeroDanhMuc';
import { ThanhDanhMuc, ChipCapDo, CAP_DO } from '@/components/courses/danh-muc/BoLocDanhMuc';
import { LuoiKhung, KhongCoKetQua, LoiTai, PhanTrang } from '@/components/courses/danh-muc/TrangThaiDanhMuc';
import { coursesApi, courseCategoryApi } from '@/lib/api';
import type { Course, CourseCategory } from '@/types';

const CAP_DO_HOP_LE = new Set<string>(CAP_DO.map((l) => l.value));

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Ô nhập (gõ dở) tách khỏi từ khoá ĐÃ áp dụng — gõ không làm đổi trang/bộ lọc.
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [tuKhoa, setTuKhoa] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(() => {
    const l = searchParams.get('level') || '';
    return CAP_DO_HOP_LE.has(l) ? l : '';
  });
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [lanTai, setLanTai] = useState(0); // bấm "Thử lại" = tăng số này
  // Top-level tab: general Courses vs the FPTU Academy sub-catalog.
  // Academy courses live in the same table (academyType != 'GENERAL')
  // but are surfaced ONLY here, never in the general "All" list.
  const [academyMode, setAcademyMode] = useState(searchParams.get('tab') === 'academy');
  // Tab "Lộ trình": tháp thứ tự học, thay cho lưới khoá. Mở thẳng bằng ?tab=lo-trinh.
  const [roadmapMode, setRoadmapMode] = useState(searchParams.get('tab') === 'lo-trinh');

  // Con số thật cho hero (đếm một lần, mỗi lượt chỉ xin 1 khoá).
  const [tongKhoa, setTongKhoa] = useState<number | null>(null);
  const [tongMonAcademy, setTongMonAcademy] = useState<number | null>(null);

  const luoiRef = useRef<HTMLDivElement>(null);
  const maYeuCau = useRef(0);

  useEffect(() => {
    courseCategoryApi.getAll().then(r => setCategories(r.data.data || [])).catch(() => {});
    coursesApi.getAll({ page: 1, size: 1, gon: 1 })
      .then(r => setTongKhoa(r.data?.pagination?.total ?? null)).catch(() => {});
    coursesApi.getAll({ page: 1, size: 1, academy: 'fpt', gon: 1 })
      .then(r => setTongMonAcademy(r.data?.pagination?.total ?? null)).catch(() => {});
  }, []);

  // Đồng bộ bộ lọc lên URL (replace, không cuộn) — giữ nguyên các tham số khác.
  useEffect(() => {
    const p = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const dat = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k));
    dat('tab', roadmapMode ? 'lo-trinh' : academyMode ? 'academy' : '');
    dat('q', roadmapMode ? '' : tuKhoa);
    dat('category', roadmapMode || academyMode ? '' : category);
    dat('level', roadmapMode ? '' : level);
    const qs = p.toString();
    const moi = qs ? `${pathname}?${qs}` : pathname;
    if (typeof window !== 'undefined' && moi !== `${window.location.pathname}${window.location.search}`) {
      router.replace(moi, { scroll: false });
    }
  }, [roadmapMode, academyMode, tuKhoa, category, level, pathname, router]);

  const fetchCourses = useCallback(async () => {
    const ma = ++maYeuCau.current;
    setLoading(true);
    setLoi(false);
    try {
      const res = await coursesApi.getAll({
        page: page + 1,
        size,
        keyword: tuKhoa || undefined,
        // Categories don't apply to the Academy sub-catalog.
        category: academyMode ? undefined : (category || undefined),
        level: level || undefined,
        academy: academyMode ? 'fpt' : undefined,
        // Bản gọn: trang này chỉ vẽ CourseCard (18 trường vô hướng) và không
        // đọc `sections`. Không có tham số này thì máy chủ trả cả cây chương →
        // bài cho TỪNG khoá — đo thật 19/09/2026: 2,86 MB cho 12 khoá, trong
        // đó `sections` chiếm 2,5 MB, cộng 12 lượt truy vấn nặng song song.
        gon: 1,
      });
      if (ma !== maYeuCau.current) return; // bộ lọc đã đổi trong lúc chờ
      const coursesData = res.data?.data;
      const pagination = res.data?.pagination;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setTotalPages(pagination?.totalPages || 0);
      setTotalElements(pagination?.total || 0);
    } catch {
      if (ma !== maYeuCau.current) return;
      setCourses([]);
      setLoi(true);
    } finally {
      if (ma === maYeuCau.current) setLoading(false);
    }
  }, [page, size, tuKhoa, category, level, academyMode]);

  useEffect(() => {
    if (roadmapMode) return;
    fetchCourses();
  }, [fetchCourses, roadmapMode, lanTai]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setRoadmapMode(false);
    setTuKhoa(keyword.trim());
    // Cùng từ khoá đã áp dụng thì deps không đổi ⇒ ép tải lại.
    setLanTai(n => n + 1);
  };

  const xoaTuKhoa = () => {
    setKeyword('');
    if (tuKhoa) { setTuKhoa(''); setPage(0); }
  };

  const xoaBoLoc = () => {
    setKeyword(''); setTuKhoa(''); setCategory(''); setLevel(''); setPage(0);
  };

  const doiTrang = (p: number) => {
    setPage(p);
    luoiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const coBoLoc = !!(tuKhoa || level || (!academyMode && category));
  const tenDanhMuc = categories.find(c => c.slug === category)?.name;
  const nhanCapDo = CAP_DO.find(l => l.value === level)?.label;

  const tabs = [
    { key: 'lo-trinh', nhan: 'Lộ trình học', Icon: Compass, active: roadmapMode,
      onClick: () => setRoadmapMode(true) },
    { key: 'tat-ca', nhan: 'Tất cả khoá học', Icon: LayoutGrid, active: !roadmapMode && !academyMode,
      onClick: () => { setRoadmapMode(false); setAcademyMode(false); setPage(0); } },
    { key: 'academy', nhan: 'FPTU Academy', Icon: GraduationCap, active: !roadmapMode && academyMode,
      onClick: () => { setRoadmapMode(false); setAcademyMode(true); setCategory(''); setPage(0); } },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden [--text-muted:#65686d] [.theme-dark_&]:[--text-muted:#8a8d91]">
      <HeroDanhMuc
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSubmit={handleSearch}
        onClear={xoaTuKhoa}
        tongKhoa={tongKhoa}
        tongMonAcademy={tongMonAcademy}
        soDanhMuc={categories.length}
      />

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Top-level tabs: Lộ trình · Tất cả · FPTU Academy. Academy
            courses only appear under their own tab. */}
        <div className="mb-8 pt-6">
          <div
            role="tablist"
            aria-label="Chế độ xem khoá học"
            className="flex w-full gap-1 overflow-x-auto whitespace-nowrap rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 sm:w-fit"
          >
            {tabs.map(({ key, nhan, Icon, active, onClick }) => (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={onClick}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:flex-none ${
                  active
                    ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-[0_6px_20px_-8px_rgba(139,92,246,0.8)]'
                    : 'text-text-muted hover:bg-[var(--bg-surface-hover)] hover:text-text-primary'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {nhan}
              </button>
            ))}
          </div>
        </div>

        {roadmapMode ? (
          <CourseRoadmap />
        ) : (
        <>
        {/* Bộ lọc */}
        <div className="mb-8 space-y-5">
          {categories.length > 0 && !academyMode && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-text-secondary">Khám phá theo danh mục</h2>
              <ThanhDanhMuc
                categories={categories}
                dangChon={category}
                onChon={(slug) => { setCategory(slug); setPage(0); }}
                tongKhoa={tongKhoa}
              />
            </div>
          )}
          {academyMode && (
            <div className="rounded-2xl border border-neon-violet/25 bg-gradient-to-r from-neon-indigo/10 via-neon-violet/5 to-transparent p-4 text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">FPTU Academy</span> — các môn bám sát giáo trình FPT University
              (slide, bài tập, đề luyện thi). Tìm nhanh bằng mã môn, ví dụ <span className="font-mono text-violet-700 [.theme-dark_&]:text-violet-300">PRF192</span>.
            </div>
          )}
          <ChipCapDo dangChon={level} onChon={(v) => { setLevel(v); setPage(0); }} />
        </div>

        {/* Kết quả + bộ lọc đang áp dụng */}
        <div ref={luoiRef} className="mb-6 flex scroll-mt-24 flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-muted" aria-live="polite">
            {loading ? 'Đang tải…' : loi ? '' : (
              <>Tìm thấy <span className="font-semibold text-text-primary">{totalElements.toLocaleString('vi-VN')}</span> {academyMode ? 'môn học' : 'khoá học'}</>
            )}
          </p>
          {coBoLoc && (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {tuKhoa && (
                <button onClick={xoaTuKhoa} className="inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary">
                  <span className="truncate">“{tuKhoa}”</span> <X className="h-3 w-3 shrink-0" />
                </button>
              )}
              {!academyMode && category && (
                <button onClick={() => { setCategory(''); setPage(0); }} className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary">
                  {tenDanhMuc || category} <X className="h-3 w-3" />
                </button>
              )}
              {level && (
                <button onClick={() => { setLevel(''); setPage(0); }} className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary">
                  {nhanCapDo} <X className="h-3 w-3" />
                </button>
              )}
              <button onClick={xoaBoLoc} className="text-xs font-medium text-violet-700 [.theme-dark_&]:text-violet-300 hover:underline">
                Xoá tất cả
              </button>
            </div>
          )}
        </div>

        {/* Lưới */}
        {loading ? (
          <LuoiKhung soThe={6} />
        ) : loi ? (
          <LoiTai onThuLai={() => setLanTai(n => n + 1)} />
        ) : courses.length === 0 ? (
          <KhongCoKetQua coBoLoc={coBoLoc} onXoaBoLoc={xoaBoLoc} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <PhanTrang page={page} totalPages={totalPages} onChange={doiTrang} />
          </>
        )}
        </>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-primary)] [--text-muted:#65686d] [.theme-dark_&]:[--text-muted:#8a8d91]">
        <div className="max-w-6xl mx-auto px-4 pt-40">
          <LuoiKhung soThe={6} />
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
