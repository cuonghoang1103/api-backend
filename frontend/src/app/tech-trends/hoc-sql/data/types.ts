/**
 * Kiểu dữ liệu cho khoá "Học SQL & Database từ số 0".
 *
 * Thiết kế xoay quanh hai ràng buộc thật của người học mà khoá này nhắm tới:
 *
 *  1. Họ CHƯA biết gì về database. Nên đơn vị nhỏ nhất không phải "câu lệnh"
 *     mà là `Block` — một mạch giải thích xen kẽ chữ, code, hình động, quiz.
 *     Đọc liền một mạch là hiểu, không phải tra cứu.
 *
 *  2. Trường dạy SQL Server nhưng web chạy PostgreSQL. Nên `MssqlBlock` là
 *     một loại block hạng nhất, xuất hiện được ở BẤT KỲ đâu trong bài, chứ
 *     không dồn hết vào một chương riêng — lúc gặp cú pháp lạ mà phải cuộn
 *     ngược lên tra thì đã quá muộn.
 *
 * Mọi chương đều trỏ sang đúng một module trong track Code Lab `postgresql`
 * (`labModuleId`) để học xong là làm bài được ngay trên PostgreSQL thật.
 */

/** Tên các widget tương tác. Widget tự chứa dữ liệu demo, không nhận props. */
export type WidgetName =
  /** Full Table Scan vs Index Scan — đếm số lần đọc đĩa. */
  | 'scan-compare'
  /** Cây B+Tree bấm tìm key, tô đường đi từ root xuống lá. */
  | 'btree'
  /** Mô phỏng một câu SELECT chạy qua từng mệnh đề theo ĐÚNG thứ tự thật. */
  | 'query-sim'
  /** Bảng chân trị của NULL — vì sao `NULL = NULL` không ra true. */
  | 'null-lab'
  /** 4 kiểu JOIN: bấm đổi kiểu, xem bảng kết quả và sơ đồ Venn đổi theo. */
  | 'join-venn'
  /** Hai phiên chạy song song: COMMIT / ROLLBACK và cái người khác nhìn thấy. */
  | 'txn-sim';

/**
 * Tên các sơ đồ SVG tĩnh.
 *
 * Tách khỏi `WidgetName` vì bản chất khác hẳn: figure chỉ để NHÌN cho hiểu
 * (không bấm được, không giữ trạng thái) nên vẽ được ngay ở lần render đầu và
 * không kéo theo JavaScript nào. Widget thì ngược lại — người học phải tự bấm
 * mới rút ra được điều cần rút.
 */
export type FigureName =
  /** Trình duyệt → backend → PostgreSQL → đĩa: câu SQL đi qua những đâu. */
  | 'arch-client-server'
  /** Giải phẫu một bảng: cột, dòng, ô, khoá chính, kiểu dữ liệu. */
  | 'table-anatomy'
  /** Bảng thật (heap) nằm cạnh index: index trỏ về heap bằng con trỏ dòng. */
  | 'heap-vs-index'
  /** Sơ đồ quan hệ 4 bảng của CSDL mẫu "shop" dùng xuyên suốt khoá. */
  | 'erd-shop'
  /** Giải phẫu một câu SELECT: từng mệnh đề làm gì. */
  | 'select-anatomy'
  /** Đường ống thứ tự thực thi FROM → … → LIMIT, kèm số dòng còn lại. */
  | 'exec-order'
  /** GROUP BY: các dòng gom thành nhóm rồi mỗi nhóm rút thành một dòng. */
  | 'groupby-visual'
  /** Bốn kiểu JOIN cạnh nhau dưới dạng sơ đồ Venn để tra nhanh. */
  | 'join-4up'
  /** JOIN một–nhiều làm dòng bảng cha bị nhân bản — nguồn của SUM sai. */
  | 'join-row-multiply'
  /** Dòng thời gian một transaction: BEGIN → thao tác → COMMIT/ROLLBACK. */
  | 'txn-timeline'
  /** Bốn chữ cái ACID kèm ví dụ chuyển tiền. */
  | 'acid'
  /** Bản đồ đường đi của khoá học: 21 chương chia 4 chặng. */
  | 'course-map';

/** Sắc thái của hộp ghi chú. */
export type NoteTone = 'info' | 'warn' | 'danger' | 'ok';

/**
 * Một khối nội dung trong bài.
 *
 * `text` của `p` hỗ trợ đánh dấu rất gọn, cố ý chỉ ba thứ để render không cần
 * thư viện markdown: `**đậm**`, `` `code` `` và `[chữ](đường-dẫn)`.
 */
export type Block =
  | { kind: 'h'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'code'; code: string; lang?: 'sql' | 'text' | 'bash'; caption?: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'note'; tone: NoteTone; title?: string; text: string }
  | { kind: 'table'; head: string[]; rows: string[][]; caption?: string }
  /** Hộp đối chiếu "Trên SQL Server thì sao?" — chèn được ở bất kỳ đâu. */
  | { kind: 'mssql'; text: string; pg?: string; ms?: string }
  | { kind: 'quiz'; q: string; options: string[]; answer: number; explain: string }
  | { kind: 'widget'; name: WidgetName; title?: string; hint?: string }
  /** Sơ đồ SVG tĩnh — để nhìn cho hiểu, không tương tác. */
  | { kind: 'figure'; name: FigureName; title?: string; caption?: string }
  /** Việc tự làm ngay tại chỗ, trước khi sang phần sau. */
  | { kind: 'try'; text: string };

/** Một thẻ lật ôn cuối chương. */
export interface FlashCard {
  q: string;
  a: string;
}

/** Bài tập Code Lab tiêu biểu, dùng để mời làm ngay giữa bài. */
export interface LabPick {
  slug: string;
  title: string;
  /** Tên tiếng Việt cho dễ chọn — bài tập trong Code Lab đặt tên tiếng Anh. */
  vi: string;
}

/** Một chương của khoá. */
export interface Chapter {
  /** 0..20 — khớp thứ tự 21 module của track Code Lab `postgresql`. */
  no: number;
  slug: string;
  title: string;
  icon: string;
  /** Một dòng tóm tắt, hiện trên thẻ chương ở sơ đồ lộ trình. */
  tagline: string;
  /** Học xong chương này thì LÀM được gì (không phải "biết gì"). */
  goals: string[];
  /** Thời lượng đọc ước lượng, phút. */
  minutes: number;

  /** Module tương ứng bên Code Lab để làm bài tập. */
  labModuleId: number;
  labModuleName: string;
  labCount: number;
  labPicks?: LabPick[];

  /** Nội dung bài. Rỗng khi `status === 'outline'`. */
  blocks: Block[];
  flash?: FlashCard[];

  /**
   * `full`  — đã viết đủ nội dung, đọc là học được.
   * `outline` — mới có mục tiêu + đề mục + link bài tập; nội dung viết sau.
   * Hiện trạng thái này ra giao diện thay vì giấu đi: người học cần biết
   * chương nào đọc được ngay, chương nào tạm thời phải học bằng bài tập.
   */
  status: 'full' | 'outline';
  /** Chỉ dùng khi `status === 'outline'`: các đề mục sẽ viết. */
  todo?: string[];
}

/** Một dòng trong bảng tra cứu SQL Server ↔ PostgreSQL. */
export interface MssqlRow {
  /** Nhóm để lọc: "Kiểu dữ liệu", "Chuỗi", "Ngày giờ"… */
  group: string;
  topic: string;
  ms: string;
  pg: string;
  note?: string;
}
