'use client';

/**
 * ============================================================
 * "Bạn có muốn vào phòng học video cùng AI không?"
 * ============================================================
 *
 * Người dùng 20/09/2026: *"khi user bấm vào video để xem sẽ có 1 thông báo
 * hiện ra … Nếu user ấn có thì chuyển vào phòng đầy đủ chức năng … Còn nếu
 * user ấn không thì sẽ giữ nguyên học video ở tab academy môn học hiện tại."*
 *
 * ⚠️ CHỈ MỜI KHI BÀI CÓ PHỤ ĐỀ. Đo 20/09/2026: 963 bài có phụ đề trên ~11.800
 * bài đã xuất bản. Mời ở bài không có phụ đề là mời vào một phòng mà gia sư
 * không đọc được gì — tệ hơn hẳn việc không mời. `coPhuDe()` là một phép đếm,
 * không kéo về cả mảng câu.
 *
 * ⚠️ BẤM "KHÔNG" KHÔNG ĐƯỢC LÀM MẤT LỐI VÀO. Bỏ hẳn nút đi thì tính năng nằm
 * ở chỗ không ai tới được nữa, tức là bằng không có — đúng cái bẫy đã mắc hai
 * lần trong ngày 19/09. Nên từ chối chỉ thu hộp mời lại thành một nút nhỏ,
 * vẫn nằm ngay cạnh video.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { videoHocApi } from '@/lib/api';

/** Nhớ những bài đã từ chối, để không hỏi lại mỗi lần quay về bài đó. */
const KHOA_TU_CHOI = 'phongvideo.tuchoi';

function daTuChoi(lessonId: number): boolean {
  try {
    const ds = JSON.parse(window.localStorage.getItem(KHOA_TU_CHOI) || '[]');
    return Array.isArray(ds) && ds.includes(lessonId);
  } catch { return false; }
}

function ghiTuChoi(lessonId: number) {
  try {
    const ds = JSON.parse(window.localStorage.getItem(KHOA_TU_CHOI) || '[]');
    const moi = Array.isArray(ds) ? ds : [];
    if (!moi.includes(lessonId)) moi.push(lessonId);
    /* Giữ 300 bài gần nhất. Không cắt thì danh sách lớn dần vô hạn trong
       localStorage của mọi người học chăm chỉ. */
    window.localStorage.setItem(KHOA_TU_CHOI, JSON.stringify(moi.slice(-300)));
  } catch { /* chế độ riêng tư chặn ghi — không được làm hỏng trang vì việc này */ }
}

export default function MoiVaoPhongVideo({ lessonId, duongDanVe }: {
  lessonId: number;
  /** Đường về ĐÚNG bài này — trang học đọc `?lessonId=`, xem `requestedLessonId`. */
  duongDanVe: string;
}) {
  const router = useRouter();
  const [co, datCo] = useState(false);
  const [hien, datHien] = useState(false);

  useEffect(() => {
    let huy = false;
    /* ⚠️ Hẹn giờ phải nằm ở PHẠM VI EFFECT, không nằm trong `.then()`. Một
       `return () => clearTimeout(...)` viết bên trong `.then()` là giá trị
       trả về của promise — React không bao giờ thấy nó, nên đổi bài nhanh
       tay là hộp mời của bài CŨ bung ra trên bài MỚI. */
    let hen: number | undefined;
    datCo(false);
    datHien(false);
    videoHocApi.coPhuDe(lessonId)
      .then((r) => {
        if (huy || !r.data.data.co) return;
        datCo(true);
        /* Hoãn một nhịp: bung ra ngay lúc bài vừa mở thì nó chồng lên đúng
           giây người học đang tìm nút Play. */
        if (!daTuChoi(lessonId)) {
          hen = window.setTimeout(() => { if (!huy) datHien(true); }, 1200);
        }
      })
      .catch(() => { /* không đo được thì im lặng, đừng mời bừa */ });
    return () => {
      huy = true;
      if (hen !== undefined) window.clearTimeout(hen);
    };
  }, [lessonId]);

  if (!co) return null;

  const vao = () => {
    router.push(`/phong-video/${lessonId}?ve=${encodeURIComponent(duongDanVe)}`);
  };

  if (!hien) {
    return (
      <button
        onClick={vao}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-neon-violet/40 px-3 py-1.5 text-xs font-medium text-neon-violet transition-colors hover:bg-neon-violet/10"
      >
        <Sparkles size={13} /> Học video cùng AI
      </button>
    );
  }

  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl border border-neon-violet/30 p-4"
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.06))' }}>
      <button
        onClick={() => { datHien(false); ghiTuChoi(lessonId); }}
        aria-label="Đóng"
        className="absolute right-2 top-2 rounded-lg p-1.5 text-text-muted transition-colors hover:text-text-primary"
      >
        <X size={15} />
      </button>

      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded-xl p-2" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
          <Sparkles size={16} color="#fff" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="pr-6 font-semibold text-text-primary">
            Bạn có muốn vào phòng học video cùng AI không?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Trong phòng: phụ đề song ngữ bấm được để tua, mục lục chia theo mốc thời gian,
            và gia sư AI <strong className="text-text-primary">đã đọc phụ đề video này</strong> —
            hỏi về đúng đoạn đang xem, có sơ đồ và công thức.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={vao}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
              Có, vào phòng học <ArrowRight size={15} />
            </button>
            <button onClick={() => { datHien(false); ghiTuChoi(lessonId); }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-white/20">
              Không, học tiếp ở đây
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
