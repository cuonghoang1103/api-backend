/** Web Foundations · Deck wf-ts — Chương 9: TypeScript cơ bản. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-ts', code: 'WF · CH9', title: 'TypeScript cơ bản', sub: 'Nền tảng Lập trình Web · Chương 9' };

export const slides = [
  { kind: 'cover', t: 'Chương 9 — TypeScript cơ bản', sub: 'Kiểu · interface · hàm có kiểu · generic nhập môn',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Vì sao dùng TypeScript</li>
      <li>Kiểu cơ bản &amp; annotation</li>
      <li>Kiểu đối tượng &amp; <b>interface</b> ⭐</li>
      <li>Gắn kiểu cho hàm · generic nhẹ</li>
      <li>TypeScript trong thực tế</li>
    </ol>` },

  { t: 'Vì sao thêm một bước biên dịch', body: `
    ${code(`// JavaScript — lỗi chỉ lộ ra LÚC CHẠY, có khi ở production
function tinhTong(gio) {
  return gio.reduce((s, m) => s + m.gia, 0);
}
tinhTong(null);   // 💥 Cannot read properties of null

// TypeScript — lỗi lộ ra NGAY TRONG EDITOR, gạch đỏ khi vừa gõ
function tinhTong(gio: Mon[]): number {
  return gio.reduce((s, m) => s + m.gia, 0);
}
tinhTong(null);   // ❌ Argument of type 'null' is not assignable`, 'typescript', 'sm')}
    <div class="box ok">Đổi lấy: gõ thêm vài ký tự, được lại chỗ gợi ý tự động chính xác và hàng loạt lỗi bị chặn trước khi chạy. Càng nhiều người cùng làm một dự án thì càng đáng.</div>` },

  { t: 'Kiểu cơ bản', body: `
    ${code(`let ten: string = 'Lan';
let tuoi: number = 20;
let moCua: boolean = true;

let diem: number[] = [8, 9, 10];
let ds: Array<string> = ['a', 'b'];

let cap: [string, number] = ['Lan', 20];     // tuple — cố định thứ tự

let batKy: any = 'gì cũng được';   // ⚠️ tắt hết kiểm tra — tránh dùng
let chuaBiet: unknown = layDL();   // ✅ an toàn hơn: phải kiểm trước khi dùng`, 'typescript')}
    <div class="box warn"><code>any</code> là cửa thoát hiểm, không phải giải pháp. Rắc <code>any</code> khắp nơi thì bạn đang viết JavaScript mà phải gõ nhiều hơn.</div>` },

  { t: 'Suy luận kiểu — đừng gõ thừa', body: `
    ${code(`// Không cần ghi kiểu — TypeScript TỰ suy ra
let ten = 'Lan';          // tự hiểu là string
const diem = [8, 9, 10];  // tự hiểu là number[]

ten = 5;                  // ❌ vẫn báo lỗi, dù bạn không ghi kiểu

// Chỗ NÊN ghi kiểu rõ ràng:
function tinh(a: number, b: number): number { ... }   // tham số hàm
let kq: string | null = null;                          // biến sẽ đổi kiểu`, 'typescript')}
    <div class="box">Quy tắc thực dụng: <b>ghi kiểu ở biên</b> (tham số hàm, giá trị trả về, dữ liệu từ API) và để TypeScript tự suy ở bên trong.</div>` },

  { t: `interface — mô tả hình dáng object ${F()}`, body: `
    ${code(`interface Pizza {
  id: number;
  ten: string;
  gia: number;
  moTa?: string;          // dấu ? = KHÔNG bắt buộc
  readonly slug: string;  // chỉ đọc, gán lại là lỗi
}

const p: Pizza = { id: 1, ten: 'Margherita', gia: 149000, slug: 'marg' };

interface PizzaCoGiam extends Pizza {   // kế thừa, thêm trường
  giaGiam: number;
}`, 'typescript', 'sm')}
    <div class="box ok">${F()} Trong React bạn sẽ viết <code>interface Props { title: string; onClose: () =&gt; void }</code> — đây chính là chỗ TypeScript giúp nhiều nhất: gọi component thiếu prop là gạch đỏ ngay.</div>` },

  { t: 'type vs interface', body: `
    ${code(`type ID = number | string;                 // hợp kiểu — interface KHÔNG làm được
type Loai = 'chay' | 'thit' | 'hai-san';   // hợp các giá trị cụ thể
type Diem = { x: number; y: number };

interface User { ten: string }             // mở rộng được bằng extends`, 'typescript')}
    <div class="two">
      <div class="card"><b>Dùng interface</b><p>Cho hình dáng object và props của component — mở rộng được</p></div>
      <div class="card"><b>Dùng type</b><p>Cho union, cho bí danh kiểu nguyên thuỷ</p></div>
    </div>
    <div class="box">Union kiểu <code>'chay' | 'thit'</code> rất đáng dùng: gõ sai một chữ là báo lỗi ngay, thay vì lặng lẽ không khớp lúc chạy.</div>` },

  { t: 'Hàm có kiểu', body: `
    ${code(`function cong(a: number, b: number): number {
  return a + b;
}

const nhan = (a: number, b: number): number => a * b;

function chao(ten: string, loi = 'Xin chào'): string {   // mặc định tự suy kiểu
  return \`\${loi}, \${ten}\`;
}

function ghiLog(msg: string): void {   // void = không trả gì
  console.log(msg);
}

async function layDL(): Promise<Pizza[]> {   // hàm async trả Promise<T>
  const res = await fetch('/api/pizzas');
  return res.json();
}`, 'typescript', 'sm')}` },

  { t: 'Generic — nhập môn nhẹ nhàng', body: `
    ${code(`// Không generic: mất kiểu, trả về any
function dauTien(arr: any[]): any { return arr[0]; }

// Có generic: GIỮ nguyên kiểu đi vào
function dauTien<T>(arr: T[]): T | undefined { return arr[0]; }

dauTien([1, 2, 3]);          // TypeScript biết là number
dauTien(['a', 'b']);         // biết là string

// Generic bạn dùng hằng ngày mà không để ý:
Array<string>   Promise<Pizza[]>   useState<number>(0)`, 'typescript', 'sm')}
    <div class="box">Đọc <code>&lt;T&gt;</code> là "một kiểu nào đó, do nơi gọi quyết định". Không cần viết generic của riêng mình ngay — chỉ cần <b>đọc hiểu</b> khi gặp.</div>` },

  { t: 'TypeScript trong thực tế', body: `
    ${code(`npx tsc --init          # tạo tsconfig.json
npx tsc --noEmit        # CHỈ kiểm kiểu, không sinh file — dùng trong CI`, 'bash')}
    ${code(`{
  "compilerOptions": {
    "strict": true,        // BẬT — không bật thì mất hơn nửa lợi ích
    "target": "ES2020",
    "module": "ESNext"
  }
}`, 'json', 'sm')}
    <div class="box warn">Dự án React dùng TypeScript thì tạo bằng <code>npx create-react-app app --template typescript</code>, và file component đặt đuôi <code>.tsx</code> chứ không phải <code>.ts</code>.</div>` },

  { t: 'Ba lỗi TypeScript hay gặp nhất', body: `
    <table class="t big2">
      <tr><th>Thông báo</th><th>Nghĩa là</th></tr>
      <tr><td><code>Object is possibly 'null'</code></td><td>Thứ này có thể null → kiểm trước, hoặc dùng <code>?.</code></td></tr>
      <tr><td><code>Property 'x' does not exist on type 'Y'</code></td><td>Gõ sai tên thuộc tính, hoặc interface thiếu trường đó</td></tr>
      <tr><td><code>Type 'string' is not assignable to type 'number'</code></td><td>Đưa nhầm kiểu — hay gặp với <code>input.value</code> (luôn là chuỗi)</td></tr>
    </table>
    <div class="box ok">Đọc thông báo của TypeScript từ <b>dòng cuối lên</b> — dòng cuối thường nói đúng chỗ sai, mấy dòng trên chỉ là đường dẫn tới đó.</div>` },

  { t: 'Tự luyện', body: `
    ${code(`// Làm ở typescriptlang.org/play — chạy ngay trên trình duyệt

// 1. Khai interface SinhVien { id, ten, diem, lop? }
// 2. Viết hàm xepLoai(sv: SinhVien): string trả 'Giỏi' | 'Đạt' | 'Chưa đạt'
// 3. Viết type Lop = 'SE2059' | 'SE2060' rồi thử gán sai một chữ, xem lỗi
// 4. Viết hàm generic lay<T>(arr: T[], i: number): T | undefined
// 5. Cố ý truyền null vào hàm ở bài 2 và đọc kỹ thông báo lỗi`, 'typescript', 'sm')}` },
];
