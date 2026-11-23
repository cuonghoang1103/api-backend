/**
 * Phòng thi mô phỏng — cấu hình theo MÔN (22/11/2026, thí điểm FER202).
 *
 * Đây là sản phẩm riêng của cuongthai.com mô phỏng QUY TRÌNH thi (giờ thi, bảng câu, nộp bài) để quen tay.
 * Không mang tên/giao diện/mã của phần mềm thi của trường, không nối gì với kỳ thi thật.
 *
 * Nguồn số liệu:
 *  - Khung FE / PE: syllabus FLM `content/academy/_syllabus-flm/FER202.json` mục "danhGia"
 *    (FE: 50 câu trắc nghiệm, 60 phút · PE: 85 phút, tự luận thực hành).
 *  - Tên CLO: cùng tệp, mục "clo".
 *  - CLO theo CHƯƠNG Academy: soạn tay từ cột "LO" của từng buổi (mục "buoi"). Đánh số chương
 *    của syllabus (15 mục) KHÁC đánh số chương Academy (12 chương) nên không suy máy được — ghép theo
 *    chủ đề chương (tiêu đề "Chapter N — …" trong `content/academy/FER202.mjs`).
 *
 * Thêm môn mới: thêm một mục vào MO_PHONG_MON (và mã môn vào `MO_PHONG_MON` phía frontend,
 * `frontend/src/lib/examMoPhong.ts`, để hiện lối vào ở Academy).
 */

export interface CauHinhMonMoPhong {
  courseCode: string;
  fe: {
    /** Số câu của đề thật. */
    soCau: number;
    /** Phút của đề thật. */
    phut: number;
    /** Thang điểm + điểm đạt (FE FPTU: ≥ 4/10 mới tính vào tổng kết). */
    thangDiem: number;
    diemDat: number;
  };
  pe: { phut: number; thangDiem: number; diemDat: number };
  /** Tên CLO "EN|||VI". */
  cloTen: Record<string, string>;
  /** Số chương Academy → các CLO chương đó phục vụ. */
  cloTheoChuong: Record<number, string[]>;
  /** Hướng dẫn chuẩn bị môi trường PE — mỗi bước "EN|||VI". Có thể chứa <code>. */
  huongDanMoiTruong: string[];
  /** Kiểu dự án PE: 'node' ⇒ zip bắt buộc package.json + cấm node_modules; 'chung' ⇒ chỉ kiểm rác build. */
  loaiPe: 'node' | 'chung';
  /** true = cấu hình soạn tay (FER202); false = cấu hình chung suy từ đề thật trong CSDL. */
  rieng: boolean;
}

const FER202: CauHinhMonMoPhong = {
  courseCode: 'FER202',
  loaiPe: 'node',
  rieng: true,
  fe: { soCau: 50, phut: 60, thangDiem: 10, diemDat: 4 },
  pe: { phut: 85, thangDiem: 10, diemDat: 5 },
  cloTen: {
    CLO1: 'Describe Front-end Web UI Frameworks overview|||Mô tả tổng quan các framework giao diện web front-end',
    CLO2: 'Install a React application and understand React components|||Cài đặt ứng dụng React và hiểu component React',
    CLO3: 'Explain JSX and ES6|||Giải thích JSX và ES6',
    CLO4: 'Explain Bootstrap and React-Bootstrap|||Giải thích Bootstrap và React-Bootstrap',
    CLO5: 'Discuss the component life cycle, forms and routes|||Trình bày vòng đời component, form và route',
    CLO6: 'Discuss hooks, event handling and reusable components|||Trình bày hook, xử lý sự kiện và component tái sử dụng',
    CLO7: 'Discuss fetch/caching in client-server communication and code splitting (lazy, Suspense)|||Trình bày fetch/cache khi giao tiếp client-server và tách code (lazy, Suspense)',
    CLO8: 'Discuss Flux architecture and Redux|||Trình bày kiến trúc Flux và Redux',
    CLO9: 'Apply AI tools in React development ethically and transparently|||Dùng công cụ AI khi phát triển React một cách có đạo đức, minh bạch',
  },
  cloTheoChuong: {
    1: ['CLO1', 'CLO2'],
    2: ['CLO3'],
    3: ['CLO3'],
    4: ['CLO4'],
    5: ['CLO2', 'CLO5'],
    6: ['CLO6'],
    7: ['CLO6'],
    8: ['CLO6'],
    9: ['CLO5'],
    10: ['CLO7'],
    11: ['CLO7'],
    12: ['CLO8'],
  },
  huongDanMoiTruong: [
    'Install Node.js LTS (node -v ≥ 18) and VS Code before the session starts.|||Cài Node.js LTS (node -v ≥ 18) và VS Code trước giờ thi.',
    'Download the Given file and extract it. Open the folder that contains <code>package.json</code> (often a sub-folder such as <code>resource</code>) — <code>cd</code> into THAT folder before installing.|||Tải file Given rồi giải nén. Mở đúng thư mục có <code>package.json</code> (thường là thư mục con kiểu <code>resource</code>) — <code>cd</code> vào ĐÚNG thư mục đó rồi mới cài.',
    'Run <code>npm install</code> once (only the packages the paper allows — do not add new libraries).|||Chạy <code>npm install</code> một lần (chỉ các gói đề cho phép — không cài thêm thư viện).',
    'Terminal 1: <code>npx json-server --watch database.json --port 9999</code> — keep it running; most papers give 0 points if the API is not on port 9999.|||Terminal 1: <code>npx json-server --watch database.json --port 9999</code> — để nó chạy suốt; đa số đề cho 0 điểm nếu API không chạy ở cổng 9999.',
    'Terminal 2: <code>npm start</code> (or <code>npm run dev</code>) — the app must open at the URL the paper names (usually <code>http://localhost:3000</code>).|||Terminal 2: <code>npm start</code> (hoặc <code>npm run dev</code>) — ứng dụng phải mở đúng URL đề yêu cầu (thường là <code>http://localhost:3000</code>).',
    'Before submitting: DELETE <code>node_modules</code> (and <code>build</code>/<code>dist</code>), then zip the project folder into ONE <code>.zip</code>.|||Trước khi nộp: XOÁ <code>node_modules</code> (và <code>build</code>/<code>dist</code>), rồi nén thư mục dự án thành MỘT file <code>.zip</code>.',
  ],
};

export const MO_PHONG_MON: Record<string, CauHinhMonMoPhong> = { FER202 };

/**
 * Môn chưa soạn cấu hình riêng (23/11/2026 — user muốn chọn MỌI môn có đề): khung FE/PE theo mặc định
 * phổ biến của FPTU (FE 50 câu / 60′, đạt ≥ 4; PE 85′, đạt ≥ 5) — `moPhong.service › layMon` ghi đè số câu/phút
 * bằng trung vị các đề FE/PE thật của môn trong CSDL. Không CLO theo chương (chưa soạn) ⇒ thống kê chỉ theo chương.
 */
export function cauHinhChung(courseCode: string): CauHinhMonMoPhong {
  return {
    courseCode: courseCode.toUpperCase(),
    fe: { soCau: 50, phut: 60, thangDiem: 10, diemDat: 4 },
    pe: { phut: 85, thangDiem: 10, diemDat: 5 },
    cloTen: {},
    cloTheoChuong: {},
    huongDanMoiTruong: [
      'Install the tools the paper needs (IDE, JDK / Node.js / .NET SDK / SQL Server…) before the session starts.|||Cài sẵn công cụ đề cần (IDE, JDK / Node.js / .NET SDK / SQL Server…) trước giờ thi.',
      'Download the Given file (if any), extract it and open the project folder in your IDE.|||Tải file Given (nếu có), giải nén và mở thư mục dự án bằng IDE.',
      'Build and run once before coding so setup problems show up early.|||Build và chạy thử một lần trước khi code để lỗi cài đặt lộ ra sớm.',
      'Before submitting: delete build output (<code>node_modules</code>, <code>target</code>, <code>bin</code>, <code>obj</code>, <code>build</code>, <code>dist</code>), then zip the project folder into ONE <code>.zip</code>.|||Trước khi nộp: xoá thư mục build (<code>node_modules</code>, <code>target</code>, <code>bin</code>, <code>obj</code>, <code>build</code>, <code>dist</code>), rồi nén thư mục dự án thành MỘT file <code>.zip</code>.',
    ],
    loaiPe: 'chung',
    rieng: false,
  };
}

/** Cấu hình môn: bản soạn riêng nếu có, không thì cấu hình chung. Mã rỗng ⇒ null. */
export function cauHinhMon(courseCode: string | null | undefined): CauHinhMonMoPhong | null {
  if (!courseCode) return null;
  const ma = String(courseCode).toUpperCase();
  return MO_PHONG_MON[ma] ?? cauHinhChung(ma);
}
