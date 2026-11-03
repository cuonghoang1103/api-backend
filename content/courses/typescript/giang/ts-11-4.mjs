/** Giảng theo slide — bài 11.4 Services & config (deck ts-11-4, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-11-4', 'Services &amp; config', 'Service &amp; config', [
  [1, 'Services &amp; config',
    `<p>Below the handlers sit two typed layers: configuration, read once from the environment, and services, where the real work happens. Typing both keeps a handler honest — it reads a config it cannot mutate and calls a service whose result it must handle. This is where the envelope and the typed boundary pay off across a codebase.</p>`,
    `<p>Dưới các handler là hai tầng có kiểu: cấu hình, đọc một lần từ môi trường, và service, nơi việc thật xảy ra. Gõ kiểu cả hai giữ một handler trung thực — nó đọc một config không sửa được và gọi một service mà kết quả nó phải xử lý. Đây là nơi envelope và biên giới có kiểu đáng giá trên cả một mã nguồn.</p>`],
  [2, 'A read-only config, built once',
    `<p>loadConfig reads the environment once and returns a Config whose fields are readonly — a port number, a database URL. Building it in one place means every other module reads a typed, immutable value instead of poking at process.env. The env is messy and stringly-typed; the Config is clean and final.</p>`,
    `<p>loadConfig đọc môi trường một lần và trả một Config mà các trường là readonly — một số port, một URL cơ sở dữ liệu. Dựng nó ở một chỗ nghĩa là mọi module khác đọc một giá trị có kiểu, bất biến thay vì chọc vào process.env. env thì bừa và kiểu-chuỗi; Config thì sạch và chốt.</p>`],
  [3, 'Read-only means it cannot drift at run time',
    `<p>Reassign cfg.port and it is TS2540 — the config is frozen at the type level, so no module can quietly change it after startup. A config that cannot be mutated is a config you can trust everywhere it is read. This is Readonly from Chapter 8, doing one specific, important job.</p>`,
    `<p>Gán lại cfg.port và nó là TS2540 — config bị đóng băng ở tầng kiểu, nên không module nào đổi nó âm thầm sau khởi động. Một config không sửa được là một config bạn tin ở mọi nơi nó được đọc. Đây là Readonly của Chương 8, làm một việc cụ thể, quan trọng.</p>`],
  [4, 'A service returns, it does not lie',
    `<p>A service that looks a booking up may not find one — so its return type must say so. A bookingById that promises a Booking but can return undefined is a lie the compiler catches (TS2322); the honest type is Booking | undefined, and the caller handles the miss. A typed service is one whose signature matches what it really does.</p>`,
    `<p>Một service tra một booking có thể không thấy — nên kiểu trả về của nó phải nói vậy. Một bookingById hứa một Booking mà có thể trả undefined là một lời nói dối trình biên dịch bắt (TS2322); kiểu trung thực là Booking | undefined, và người gọi xử lý trường hợp trượt. Một service có kiểu là service mà chữ ký khớp việc nó thật sự làm.</p>`],
  [5, 'The layers, at a glance',
    `<p>Config: read-only, built once, trusted everywhere. Service: an honest return type — an envelope or a T | undefined — so the caller must handle every outcome. Handler: reads the config, calls the service, sends a typed response. Each layer’s type is a contract the next layer relies on, and the compiler enforces all three.</p>`,
    `<p>Config: chỉ-đọc, dựng một lần, tin ở mọi nơi. Service: một kiểu trả về trung thực — một envelope hay một T | undefined — để người gọi phải xử lý mọi kết cục. Handler: đọc config, gọi service, gửi một response có kiểu. Kiểu của mỗi tầng là một hợp đồng tầng sau dựa vào, và trình biên dịch ép cả ba.</p>`],
  [6, 'Practice &amp; Lab 11',
    `<p>Practice: a service returns store.find(...) as a Booking, but find can return undefined — TS2322; make the return type Booking | undefined and the caller guards it. Next is Lab 11: a typed POST /bookings handler — a validated CreateBooking body, an ApiResult&lt;Booking&gt; response, and a typed error — graded by tsc and a node:test. The any stub scores 4.5, the reference 10.</p>`,
    `<p>Luyện tập: một service trả store.find(...) như một Booking, nhưng find có thể trả undefined — TS2322; làm kiểu trả về Booking | undefined và người gọi chặn nó. Tiếp là Lab 11: một handler POST /bookings có kiểu — một body CreateBooking đã kiểm, một response ApiResult&lt;Booking&gt;, và một lỗi có kiểu — chấm bằng tsc và một node:test. Bản stub any được 4.5, tham khảo 10.</p>`],
]);
