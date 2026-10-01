# Đề giao nâng cấp giao diện /courses (01/10/2026)

User: *"Lộ trình học trong course … làm cho trang đó đẹp và chuyên nghiệp chi tiết + đầy đủ hơn. Khi ấn vào từng bậc thang
hay ở sơ đồ sẽ hiện danh sách từng môn học ở đó và các môn học sẽ hiện bao nhiêu % đã học rồi, ấn vào chuyển đến môn học đó
và học tiếp. Giao diện và khung đẹp 3D hay animation gì đó đẹp hơn tý để dễ quan sát và tổng quan. Ấn vào từng môn trong tháp
sẽ hiện học xong môn này sẽ được những gì + đóng góp những gì trong dự án … làm chuyên nghiệp chuyên sâu trang này. Và giao
diện cũng như danh mục … trong courses đang xấu và khó nhìn quá, nâng cấp luôn."*

## Luật chung (cả hai gói)
- Next.js 14 App Router + Tailwind, **giữ hệ màu/class sẵn có**: `bg-darkbg`, `bg-darkcard`, `border-darkborder`,
  `text-text-primary/secondary/muted`, `neon-indigo`, `neon-violet` (đã theo theme sáng/tối). Theme tối toàn cục là class
  **`theme-dark`** trên `<html>`, **KHÔNG BAO GIỜ dùng biến thể `dark:` của Tailwind** (dành riêng cho Notes). Kiểm cả sáng lẫn tối.
- Animation: **framer-motion có sẵn** (v11). 3D bằng **CSS 3D** (`perspective`, `transform-style: preserve-3d`, `rotateX/Y`,
  `translateZ`, đổ bóng nhiều lớp) — KHÔNG thêm thư viện mới (không three.js). Tôn trọng `prefers-reduced-motion`
  (`useReducedMotion` của framer-motion).
- Responsive từ **360px**: mọi flex item nội dung `min-w-0`, hàng nút `flex-wrap`, dải chip dài `overflow-x-auto`; không cuộn
  ngang cả trang. Trên mobile hiệu ứng 3D được phép giảm/tắt.
- Chữ giao diện **tiếng Việt** (trang hiện lẫn tiếng Anh — đổi sang tiếng Việt), thuật ngữ nghề giữ tiếng Anh.
- Giữ nguyên logic/handler/API đang chạy. Không sửa backend. Không thêm dependency. Không commit.
- Kiểm: `cd frontend && npx tsc --noEmit` sạch. **KHÔNG chạy `npm run build`/`next dev`** (gói kia chạy song song, hai lần build
  cùng `.next` giẫm nhau) — người điều phối build và chụp màn hình.
- ⚠️ Không dùng hook sau `return` sớm (build không chạy lint ⇒ lỗi rules-of-hooks lọt prod). Không để component có
  `AnimatePresence` treo lớp phủ khi đóng.

## Gói R — trang Lộ trình (`src/components/courses/CourseRoadmap.tsx`, `roadmapData.ts`, được tạo thêm file trong `src/components/courses/lo-trinh/`)
Dữ liệu hiện có: `roadmapData.ts` (tháp 6 tầng THAP + SONG_SONG + NGOAI_LE; đọc chú thích đầu file — slug PHẢI là slug thật).
Tiến độ: `coursesApi.getAllMyCourses()` → `Enrollment.courseSlug/progressPercent/lastLessonTitle` (đã có trong component cũ).
1. **Hai chế độ xem** ở đầu: "🏛 Tháp nền tảng (fullstack)" (THAP hiện có) và **"🎯 Lộ trình theo nghề"** gồm 6 nghề:
   AI Engineer, Data Scientist, Data Engineer, Cloud Architect, Software Architect, Blockchain Engineer. Thứ tự khoá mỗi nghề lấy
   ĐÚNG như `src/services/roadmap.seed.khoa-web.ts` (backend, file `../src/services/…` từ thư mục frontend) — HOC_TREN_WEB +
   chặng đầu của DATA_ENGINEER/CLOUD_ARCHITECT; slug khoá mới: math-for-ml, statistics-data-science, mlops-llmops,
   spark-lakehouse, cloud-architecture, software-architecture, blockchain-fundamentals, smart-contracts-solidity (đều là khung
   "Đang soạn"). SWD392 là Academy: slug `software-architecture-and-design`, mã `SWD392`. Nêu rõ **tầng nền dùng chung** giữa các
   nghề và chuỗi dự án LabFlow (`content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md`).
2. **Tháp/bậc thang 3D có animation**: các tầng là khối 3D xếp chồng (đáy rộng), hiện dần khi vào trang, hover nổi lên, tầng
   đang chọn sáng; nhãn "Bạn đang ở đây"; mỗi tầng có thanh/vòng tiến độ (số khoá xong / tổng, % trung bình). Ở chế độ nghề:
   bậc thang 3D đi lên (mỗi bậc một khoá, nhánh tuỳ chọn tách bên cạnh), cùng hành vi.
3. **Bấm một tầng/bậc** → bảng chi tiết (trượt ra, framer-motion) liệt kê các môn của tầng: tên, nhãn Academy/Đang soạn, **% đã
   học** (thanh + số), bài học gần nhất nếu có, nút **"Học tiếp"** (đã ghi danh → `/courses/<slug>/learn`; Academy →
   `/academy/courses/<slug>` — kiểm route Academy có trang learn không, theo đúng đường hiện có) hoặc **"Bắt đầu"**.
4. **Bấm một môn** → hộp chi tiết môn: **"Học xong bạn làm được gì"** (3–5 ý cụ thể) + **"Đóng góp gì cho dự án"** (dự án của
   tầng/nghề: cuongthai mini, LabFlow AI…) + vì sao học ở vị trí này + môn trước/sau + nút học. Viết nội dung này cho MỌI khoá
   trong THAP, SONG_SONG và 6 nghề (thêm trường vào `BuocHoc`, dữ liệu cụ thể, đúng nội dung khoá — đọc tiêu đề chương của khoá ở
   `../content/courses/<slug>.mjs` hoặc `../content/academy/*.mjs` để không viết sai).
5. **Tổng quan** đầu trang: vòng tiến độ tổng, số khoá đã xong/đang học/chưa học, ước lượng thời gian còn lại, "học tiếp ngay"
   (khoá đang học gần nhất). Chưa đăng nhập ⇒ hiện hướng dẫn và nút đăng nhập để theo dõi tiến độ, KHÔNG vỡ.
6. Giữ hai hộp hỏi đáp cũ (Figma, khoá ngoài tháp) và mục "Học xen kẽ", trình bày lại cho đẹp.

## Gói C — trang danh mục (`src/app/courses/page.tsx`, `src/components/course/CourseCard.tsx`, được tạo file trong `src/components/courses/danh-muc/`)
KHÔNG đụng `CourseRoadmap.tsx`/`roadmapData.ts`/thư mục `lo-trinh/` (gói R). Giữ ba tab (Lộ trình · Tất cả · FPTU Academy),
`?tab=lo-trinh`, `?q=`, phân trang, tham số `gon: 1` (đọc chú thích trong code — đừng bỏ).
1. **Hero** mới tiếng Việt: tiêu đề, mô tả, ô tìm kiếm lớn, vài con số thật (tổng khoá — từ API, số danh mục), nền có chiều sâu
   (gradient/lưới/ánh sáng động nhẹ). Đẹp ở cả sáng và tối.
2. **Danh mục**: thay hàng nút chữ bằng **thẻ danh mục có icon** (trường `icon` của CourseCategory là tên icon lucide, vd
   `Server`, `Shield`, `Sparkles`, `Database`, `Cpu`, `Layout`, `Briefcase` — map sang component lucide, có icon dự phòng) +
   số khoá (`courseCount`), cuộn ngang được trên mobile, trạng thái đang chọn rõ ràng. Bộ lọc cấp độ thành chip (Tất cả · Cơ bản ·
   Trung cấp · Nâng cao), có ô sắp xếp nếu API hỗ trợ (đọc `coursesApi.getAll` trong `src/lib/api.ts` — không hỗ trợ thì thôi).
   Đồng bộ bộ lọc lên URL (`?category=&level=`) nếu làm gọn được.
3. **CourseCard** chuyên nghiệp hơn: ảnh bìa 16:9 giữ đúng tỉ lệ, nhãn cấp độ có màu, danh mục, số bài/thời lượng nếu có trường,
   nhãn "Đang soạn" khi khoá là khung nếu có cách biết từ dữ liệu card (không có thì bỏ), thanh tiến độ nếu card có dữ liệu ghi
   danh, hover nâng thẻ + đổ bóng; skeleton loading thay spinner. ĐỌC hết CourseCard hiện tại trước — giữ mọi trường/nhãn nó đang
   hiện (giá, Pro, Academy…) và mọi nơi khác đang dùng nó (`grep -rn "CourseCard" src`) không được vỡ.
4. Trạng thái rỗng / lỗi đẹp, phân trang gọn (hiện số trang + trước/sau).
