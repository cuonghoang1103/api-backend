/**
 * Xưởng Remix — trang giới thiệu trên web.
 *
 * ─── Vì sao trang này TỒN TẠI dù tính năng chỉ chạy ở app desktop ───
 * Hai lý do, cả hai đều bắt buộc:
 *
 *  1. Người dùng cần biết nó có và cách dùng trước khi tải app về.
 *  2. `desktop/src/renderer/routes.ts` quy định MỌI mục sidebar của app phải
 *     trỏ tới một route CÓ THẬT trên cuongthai.com, và `routes.test.ts` kiểm
 *     điều đó bằng cách tìm `frontend/src/app/<route>/page.tsx`. Xoá tệp này
 *     là làm đỏ phép kiểm đó và biến mục sidebar thành đường cụt.
 *
 * ⚠️ KHÔNG dùng biến thể `dark:` của Tailwind ở đây. Lớp chủ đề tối toàn cục
 * là `theme-dark`, không phải `dark` — `dark:` được giữ riêng cho cây Notes
 * (xem CLAUDE.md, sự cố 02/07/2026). Màu ở trang này lấy từ biến CSS chủ đề
 * nên tự đúng ở cả hai chế độ.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Xưởng Remix — tách giọng, đo nhịp và tông, chấm bài',
  description:
    'Công cụ làm nhạc remix trong app desktop CuongThai: tách giọng hát khỏi bản gốc bằng AI chạy ngay trên máy, đo BPM và tông giọng, trộn lại có duck theo kick, master theo một bản mẫu, rồi xuất stem kéo thẳng vào FL Studio.',
  alternates: { canonical: 'https://cuongthai.com/xuong-remix' },
};

const BUOC = [
  {
    so: '1',
    ten: 'Tải model về, một lần duy nhất',
    chi: 'Lần đầu mở Xưởng Remix, chọn model tách stem rồi bấm Tải về. Bản đầy đủ 4 stem nặng khoảng 1,26 GB; bản chỉ tách giọng nhẹ hơn 7,6 lần và đủ cho phần lớn bản remix. Model nằm trên máy bạn, không phải trên máy chủ — nên từ lần sau không cần mạng nữa.',
  },
  {
    so: '2',
    ten: 'Kéo một bài nhạc vào',
    chi: 'mp3, m4a, wav, flac, ogg đều được. App tự giải mã và đưa về 44,1 kHz, rồi đo ngay nhịp (BPM), tông giọng kèm mã Camelot, độ to LUFS, đỉnh thật và phổ tần mười dải.',
  },
  {
    so: '3',
    ten: 'Tách bốn stem',
    chi: 'Giọng hát, trống, bass và nhạc nền tách thành bốn tệp WAV riêng. Chạy bằng CPU ngay trên máy bạn — một bài 5 phút mất vài phút, và không có gì được gửi đi đâu cả.',
  },
  {
    so: '4',
    ten: 'Trộn lại bốn stem',
    chi: 'Bộ tách để lọt một ít tiếng trầm sang giọng hát và nhạc nền; cộng bốn đường lại thì chúng chồng lên nhau thành một khối đục. App chắn trầm từng stem, cân lại mức, rồi ghì cả bài xuống mỗi cú trống cái — nhịp thở đặc trưng của nhạc sàn. Cú ghì bám vào những cú trống DÒ ĐƯỢC trong stem trống, nên đoạn break không có trống thì nó cũng không thở.',
  },
  {
    so: '5',
    ten: 'Kéo nhịp, đổi tông, xuất bộ tệp',
    chi: 'Đặt BPM đích và số nửa cung cần dịch, app kéo giãn từng stem mà không đổi cao độ (và ngược lại). Xuất ra một thư mục gồm các stem đã chỉnh, một tệp MIDI mẫu vinahouse và một ghi chú nêu đúng những gì đã làm.',
  },
  {
    so: '6',
    ten: 'Master theo một bản mẫu',
    chi: 'Chọn một bài bạn muốn bản của mình nghe giống. App đo bản mẫu rồi ép bài của bạn về đúng độ to, phổ tần và độ rộng stereo của nó, và chấm bài trước — sau để bạn thấy đã đổi những gì.',
  },
  {
    so: '7',
    ten: 'Hỏi AI về chính bảng số đo',
    chi: 'AI đọc ĐÚNG bảng số đo ở trên — nó không nghe được bài của bạn — rồi giải thích các con số và chỉ việc cần làm tiếp. Con số nào nó nêu ra mà bảng đo không có sẽ bị đánh dấu ngay dưới câu trả lời, để bạn biết chỗ cần đối chiếu. Phần này cần đăng nhập vì nó chạy qua máy chủ.',
  },
  {
    so: '8',
    ten: 'Nghe thử, rồi đẩy thẳng lên bàn DJ',
    chi: 'Bản trộn và bản master nghe được ngay trong app, không phải mở thư mục tìm tệp. Ưng rồi thì bấm một nút để đẩy nó lên kho Remix — bài xuất hiện luôn trong danh sách của bàn DJ hai mâm ở trang Nhạc, kèm nhịp và tông ngay trong tên để lúc đứng đánh còn biết ghép với bài nào.',
  },
  {
    so: '9',
    ten: 'Kéo sang FL Studio',
    chi: 'Bấm Mở thư mục là ra ngay bốn tệp WAV 32-bit float, đặt tên sẵn. Kéo vào FL Studio, LMMS hay bất cứ phần mềm nào bạn dùng rồi bắt đầu dựng beat.',
  },
];

const DO = [
  { ten: 'BPM', y: 'Nhịp của bài, kèm mức tin cậy. Có sửa lỗi nhầm bội số — bản vinahouse 140 hay bị máy đọc thành 70.' },
  { ten: 'Tông + Camelot', y: 'Tông giọng và mã Camelot để phối hoà âm, kèm danh sách tông ghép được.' },
  { ten: 'LUFS', y: 'Độ to theo chuẩn ITU-R BS.1770-4 — cùng đơn vị Spotify và YouTube dùng để cân âm lượng.' },
  { ten: 'Đỉnh thật (dBTP)', y: 'Đỉnh nằm giữa hai điểm lấy mẫu, thứ làm vỡ tiếng khi nén sang MP3 mà đồng hồ thường không thấy.' },
  { ten: 'Dải động', y: 'Chênh giữa đoạn to nhất và mức trung bình. Bản bị ép quá tay thì con số này tụt.' },
  { ten: 'Phổ mười dải', y: 'Mức từng dải quãng tám, để so bài của bạn với một bản mẫu và thấy đang thiếu thừa ở đâu.' },
];

export default function Page() {
  return (
    <main
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '56px 20px 80px' }}>
        <p
          style={{
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-color)',
            margin: '0 0 10px',
            fontWeight: 600,
          }}
        >
          Có trong app desktop
        </p>

        <h1 style={{ fontSize: 'clamp(30px, 6vw, 44px)', lineHeight: 1.1, margin: '0 0 16px', textWrap: 'balance' }}>
          Xưởng Remix
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-secondary)', margin: '0 0 12px', maxWidth: '60ch' }}>
          Tách giọng hát khỏi bản gốc, đo nhịp và tông, chấm bài của bạn theo một
          bản mẫu — rồi xuất stem kéo thẳng vào FL Studio.
        </p>

        <p style={{ color: 'var(--text-muted)', margin: '0 0 28px', maxWidth: '60ch' }}>
          Mọi thứ chạy <b>ngay trên máy bạn</b>. Nhạc không rời khỏi ổ cứng, không
          có hạn mức, không cần mạng sau lần tải model đầu tiên.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44 }}>
          <Link
            href="/download"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '11px 22px',
              borderRadius: 'var(--radius-control)',
              background: 'var(--accent-color)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Tải app desktop
          </Link>
          <Link
            href="/music"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '11px 22px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Nghe nhạc trên web
          </Link>
        </div>

        <section aria-labelledby="cach-dung" style={{ marginBottom: 44 }}>
          <h2 id="cach-dung" style={{ fontSize: 22, margin: '0 0 18px' }}>
            Dùng thế nào
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {BUOC.map((b) => (
              <li
                key={b.so}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flex: '0 0 auto',
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--accent-color)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {b.so}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 5px', fontSize: 16.5 }}>{b.ten}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15 }}>{b.chi}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="do-duoc" style={{ marginBottom: 44 }}>
          <h2 id="do-duoc" style={{ fontSize: 22, margin: '0 0 6px' }}>
            App đo được những gì
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 18px', maxWidth: '60ch' }}>
            Sáu phép đo này là thứ biến &quot;nghe chưa đủ dày&quot; từ một cảm giác
            thành một việc sửa được.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
              gap: 12,
            }}
          >
            {DO.map((d) => (
              <div
                key={d.ten}
                style={{
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  minWidth: 0,
                }}
              >
                <h3 style={{ margin: '0 0 5px', fontSize: 15 }}>{d.ten}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>{d.y}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="noi-that"
          style={{
            padding: '20px 22px',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
          }}
        >
          <h2 id="noi-that" style={{ fontSize: 17, margin: '0 0 10px' }}>
            Nói thật về giới hạn
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: 15, display: 'grid', gap: 8 }}>
            <li>
              <b>Đây không phải FL Studio.</b> Xưởng Remix làm những việc FL Studio
              không làm — tách stem, đo hàng loạt, chấm bài. Phần sáng tác beat và
              bassline vẫn là việc bạn làm trong một DAW thật.
            </li>
            <li>
              <b>Dò tông chỉ đúng khoảng một nửa số lần.</b> Đó là giới hạn của
              phương pháp, không phải của app. Vì thế app luôn hiện mức tin cậy và
              cho bạn sửa tay thay vì bày một con số ra như chắc chắn.
            </li>
            <li>
              <b>Tách stem chạy bằng CPU và mất vài phút mỗi bài.</b> Đổi lại là
              nhạc của bạn không phải gửi lên máy chủ nào.
            </li>
            <li>
              <b>Remix nhạc có bản quyền rồi đăng lên mạng</b> gần như chắc chắn bị
              hệ thống nhận diện của nền tảng phát hiện. Làm cho vui hoặc đánh bar
              thì không sao; tính kiếm tiền thì phải xin phép chủ bài gốc.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
