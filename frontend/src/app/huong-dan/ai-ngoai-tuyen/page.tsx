/**
 * /huong-dan/ai-ngoai-tuyen — trang hướng dẫn cho NGƯỜI DÙNG.
 *
 * ⚠️ Trang này nói về một tính năng chỉ có trong APP DESKTOP, và nó phải nói
 * thẳng điều đó ngay từ đầu. Lý do kỹ thuật: trang web muốn chạy thì phải tải
 * về từ máy chủ — mất mạng là không vào được cuongthai.com, nói gì tới AI.
 * Viết mập mờ ở đây sẽ tạo ra một nhóm người dùng đi tìm nút "bật AI ngoại
 * tuyến" trên web và không bao giờ tìm thấy.
 *
 * ⚠️ Mọi con số trên trang là ĐO THẬT 15/09/2026 trên M1 Max 32GB với
 * llama.cpp b10964 — không phải ước lượng, không phải chép từ tài liệu của
 * model. Sửa số ở đây thì phải đo lại, đừng đoán.
 *
 * ⛔ Màu theo BIẾN CHỦ ĐỀ (`var(--text-primary)`…) chứ không dùng biến thể
 * `dark:` của Tailwind — lớp chủ đề tối toàn cục là `theme-dark`, còn `dark:`
 * đã dành riêng cho Notes. Xem bảng lỗi trong CLAUDE.md, mục 2026-07-02.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI ngoại tuyến — dùng AI khi không có mạng',
  description:
    'Tải AI về chạy thẳng trên máy bạn trong app CuongThai: máy nào chạy được, '
    + 'làm được việc gì, nhanh chậm ra sao. Số liệu đo thật, không phải ước lượng.',
  alternates: { canonical: 'https://cuongthai.com/huong-dan/ai-ngoai-tuyen' },
};

/** Một mục hỏi–đáp. Gom lại thành mảng để thứ tự và cách bày luôn nhất quán. */
const CAU_HOI: { hoi: string; dap: React.ReactNode }[] = [
  {
    hoi: 'AI ngoại tuyến là gì?',
    dap: (
      <>
        Là một bộ AI <b>tải về nằm trên máy bạn</b>. Khi mất mạng, app vẫn hỏi được
        vì không cần gọi đi đâu cả. Câu hỏi của bạn cũng không rời khỏi máy.
      </>
    ),
  },
  {
    hoi: 'Có dùng được trên web không?',
    dap: (
      <>
        <b>Không.</b> Trang web phải tải về từ máy chủ mới chạy được — mất mạng thì
        bạn không vào được cuongthai.com, nên cũng không có AI nào để bật. Tính năng
        này chỉ có trong <b>app desktop</b>.
      </>
    ),
  },
  {
    hoi: 'Nó có thông minh bằng bản trên mạng không?',
    dap: (
      <>
        <b>Không, và bạn nên biết rõ điều đó.</b> Nó giải thích khái niệm tốt, giải
        được toán, viết được mã đơn giản. Nhưng nó ngắn hơn, sót nhiều hơn, và
        thỉnh thoảng đọc sai dấu tiếng Việt — trong phép đo của chúng tôi nó đọc
        “biên giá trị” thành “biến giá trị”. Vì thế mọi câu trả lời từ máy bạn đều
        được <b>gắn nhãn rõ ràng</b>, và khi có mạng app tự quay lại dùng bản trên
        mạng.
      </>
    ),
  },
  {
    hoi: 'Tốn bao nhiêu dung lượng?',
    dap: (
      <>
        Bản gọn <b>1,1 GB</b>, bản đầy đủ <b>2,5 GB</b>, bản xem ảnh <b>3,3 GB</b>.
        Cộng thêm khoảng 30 MB cho bộ chạy. Tải một lần, dùng mãi — và bản cập nhật
        app <b>không xoá</b> nó đi.
      </>
    ),
  },
  {
    hoi: 'Đang tải mà mất mạng thì sao?',
    dap: (
      <>
        Phần đã tải được giữ lại. Bấm tải lại là nó <b>chạy tiếp từ chỗ dở</b>, không
        tải lại từ đầu.
      </>
    ),
  },
  {
    hoi: 'Muốn lấy lại dung lượng thì làm sao?',
    dap: (
      <>
        Vào <b>Cài đặt → AI ngoại tuyến</b>, bấm biểu tượng thùng rác ở bản muốn xoá.
        Xoá xong app vẫn chạy bình thường, chỉ là không còn dùng được khi mất mạng.
      </>
    ),
  },
];

/** Bảng việc nào dùng được. Đo thật, nên cột thời gian là số chứ không phải chữ. */
const VIEC = [
  { ten: 'Chat với trợ lý', gpu: '6 giây', cpu: '~20 giây', duoc: true },
  { ten: 'Hỏi bằng ảnh chụp màn hình', gpu: '8 giây', cpu: '18 giây', duoc: true },
  { ten: 'Gia sư theo bài học', gpu: '6 giây', cpu: '90 giây', duoc: false },
];

export default function Page() {
  return (
    <main
      className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14"
      style={{ color: 'var(--text-primary)' }}
    >
      <p
        className="mb-3 text-xs font-medium uppercase tracking-[0.14em]"
        style={{ color: 'var(--text-secondary)' }}
      >
        Hướng dẫn · App desktop
      </p>
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl" style={{ textWrap: 'balance' }}>
        Dùng AI khi không có mạng
      </h1>
      <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        App CuongThai cho bạn tải một bộ AI về chạy thẳng trên máy mình. Mất mạng vẫn
        hỏi được, và câu hỏi không đi đâu cả. Trang này nói thật nó làm được gì, không
        làm được gì, và máy bạn có chạy nổi không.
      </p>

      {/* ── Máy nào chạy được ───────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold">Máy bạn có chạy được không?</h2>
      <p className="mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        App tự xem giúp bạn — vào <b>Cài đặt → AI ngoại tuyến</b>, nó đọc bộ nhớ, đĩa
        trống và card màn hình rồi nói thẳng máy bạn hợp bản nào. Còn đây là mức chung:
      </p>
      <div
        className="mt-4 overflow-x-auto rounded-lg border"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <table className="w-full min-w-[440px] text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-secondary, rgba(128,128,128,.08))' }}>
              <th className="px-4 py-2.5 text-left font-medium">Máy của bạn</th>
              <th className="px-4 py-2.5 text-left font-medium">Nên dùng</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
              <td className="px-4 py-2.5">Từ 16 GB bộ nhớ, có card đồ hoạ</td>
              <td className="px-4 py-2.5"><b>Bản đầy đủ</b> — mượt, đủ dùng cho bài học</td>
            </tr>
            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
              <td className="px-4 py-2.5">8–12 GB, hoặc không có card rời</td>
              <td className="px-4 py-2.5"><b>Bản gọn</b> — hỏi đáp ngắn thì tốt</td>
            </tr>
            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
              <td className="px-4 py-2.5">Dưới 8 GB bộ nhớ</td>
              <td className="px-4 py-2.5">Chưa nên dùng — máy sẽ chậm hẳn đi</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Card đồ hoạ quan trọng hơn bộ nhớ. Máy 32 GB mà không có card vẫn phải chờ
        hơn một phút cho một câu hỏi kèm bài học — đây là số đo, không phải phỏng đoán.
      </p>

      {/* ── Làm được việc gì ────────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold">Làm được việc gì?</h2>
      <div
        className="mt-4 overflow-x-auto rounded-lg border"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <table className="w-full min-w-[440px] text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-secondary, rgba(128,128,128,.08))' }}>
              <th className="px-4 py-2.5 text-left font-medium">Việc</th>
              <th className="px-4 py-2.5 text-left font-medium">Máy có card</th>
              <th className="px-4 py-2.5 text-left font-medium">Máy không card</th>
            </tr>
          </thead>
          <tbody>
            {VIEC.map((v) => (
              <tr key={v.ten} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td className="px-4 py-2.5">{v.ten}</td>
                <td className="px-4 py-2.5 tabular-nums">{v.gpu}</td>
                <td className="px-4 py-2.5 tabular-nums">
                  {v.cpu}
                  {!v.duoc && (
                    <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      (quá lâu)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Hỏi bằng ảnh chụp màn hình chạy tốt bất ngờ, kể cả trên máy không có card.
        Riêng gia sư theo bài học, khi mất mạng nó <b>không có nội dung bài</b> — bài
        nằm trên máy chủ — nên nó chỉ trả lời theo kiến thức chung và sẽ nói rõ chỗ
        nào chưa chắc.
      </p>

      {/* ── Bật lên thế nào ─────────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold">Bật lên thế nào?</h2>
      <ol className="mt-4 space-y-3">
        {[
          <>Mở app desktop, vào <b>Cài đặt → AI ngoại tuyến</b>.</>,
          <>Xem dòng gợi ý — app đã đọc cấu hình máy bạn và nói sẵn nên dùng bản nào.</>,
          <>Bấm <b>Tải</b>. Lần đầu mất vài phút; tắt giữa chừng cũng không mất phần đã tải.</>,
          <>Xong là nó tự bật. Từ đó, mỗi khi mất mạng, trợ lý vẫn trả lời — kèm một
            dòng nói rõ đây là câu từ máy bạn.</>,
        ].map((buoc, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-xs font-semibold"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              {i + 1}
            </span>
            <span className="leading-relaxed">{buoc}</span>
          </li>
        ))}
      </ol>

      {/* ── Hỏi đáp ─────────────────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold">Câu hỏi thường gặp</h2>
      <div className="mt-4 space-y-4">
        {CAU_HOI.map((c) => (
          <div
            key={c.hoi}
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <h3 className="font-semibold">{c.hoi}</h3>
            <p className="mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {c.dap}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-10 rounded-lg border p-5"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <p className="font-semibold">Chưa có app desktop?</p>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          AI ngoại tuyến chỉ chạy trong app. Bản cho Windows, macOS và Linux đều miễn phí.
        </p>
        <Link
          href="/download"
          className="mt-3 inline-block rounded-md px-4 py-2 text-sm font-medium"
          style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
        >
          Tải app desktop
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Số liệu trên trang này đo ngày 15/09/2026 trên một máy Apple M1 Max 32 GB.
        Máy khác sẽ ra số khác — app tự đo lại trên máy bạn khi bạn mở mục Cài đặt.
      </p>
    </main>
  );
}
