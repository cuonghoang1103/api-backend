// Bộ dữ liệu mẫu CT Shop cho khoá MongoDB — TẤT ĐỊNH (chạy lại ra đúng dữ liệu cũ, để số trong bài không đổi).
// Chạy: docker exec mgo-lab mongosh --quiet /demo/ctshop-seed.js
// Tạo database "ctshop": customers (200), products (60, mỗi loại hàng có thuộc tính KHÁC nhau), orders (2000, món hàng NHÚNG trong đơn).
const shop = db.getSiblingDB('ctshop');
shop.dropDatabase();

// Bộ sinh số giả ngẫu nhiên có hạt giống cố định (LCG 32-bit) — không dùng Math.random để kết quả lặp lại được.
let seed = 20261124;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));

const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
const dem = ['Văn', 'Thị', 'Minh', 'Thu', 'Quốc', 'Ngọc', 'Hải', 'Gia'];
const ten = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Linh', 'Nam', 'Phương', 'Quân', 'Trang', 'Vy'];
const tinh = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế'];

const customers = [];
for (let i = 1; i <= 200; i++) {
  const c = {
    _id: 'KH' + String(i).padStart(4, '0'),
    name: `${pick(ho)} ${pick(dem)} ${pick(ten)}`,
    email: `kh${i}@example.com`,
    city: pick(tinh),
    createdAt: new Date(Date.UTC(2025, int(0, 11), int(1, 28))),
  };
  if (rnd() < 0.3) c.phone = '09' + String(int(10000000, 99999999));   // không phải ai cũng có số điện thoại
  customers.push(c);
}
shop.customers.insertMany(customers);

// Sản phẩm: mỗi danh mục một "hình dạng" thuộc tính riêng — đúng chỗ mô hình tài liệu tỏ ra tự nhiên.
const products = [];
let sku = 0;
const them = (category, name, price, attrs) => products.push({ _id: 'SP' + String(++sku).padStart(3, '0'), category, name, price: NumberDecimal(String(price)), stock: int(0, 120), ...attrs });
for (const [n, ram, gb] of [['Laptop Học Tập 14', 8, 256], ['Laptop Lập Trình 15', 16, 512], ['Laptop Đồ Hoạ 16', 32, 1024], ['Laptop Mỏng Nhẹ 13', 16, 512], ['Laptop Gaming 17', 32, 1024], ['Laptop Văn Phòng 14', 8, 512], ['Laptop Sinh Viên 15', 16, 256], ['Laptop Doanh Nhân 14', 16, 1024]])
  them('laptop', n, ram * 900000 + gb * 9000, { specs: { ramGB: ram, ssdGB: gb, cpu: pick(['i5', 'i7', 'Ryzen 5', 'Ryzen 7']) } });
for (const [n, a, p] of [['Clean Code', 'Robert C. Martin', 464], ['Designing Data-Intensive Applications', 'Martin Kleppmann', 616], ['MongoDB: The Definitive Guide', 'Shannon Bradshaw', 514], ['Head First Design Patterns', 'Eric Freeman', 694], ['The Pragmatic Programmer', 'David Thomas', 352], ['Refactoring', 'Martin Fowler', 448], ['Cấu trúc dữ liệu và giải thuật', 'Nhiều tác giả', 380], ['Lập trình Node.js thực chiến', 'CuongThai', 300]])
  them('book', n, p * 600, { author: a, pages: p, tags: [pick(['backend', 'database', 'design', 'career']), pick(['beginner', 'advanced'])] });
for (const n of ['Áo thun CT', 'Áo hoodie CT', 'Áo polo CT', 'Áo khoác gió CT'])
  them('shirt', n, int(15, 45) * 10000, { variants: ['S', 'M', 'L', 'XL'].map((size) => ({ size, color: pick(['đen', 'trắng', 'xanh']), stock: int(0, 30) })) });
for (const n of ['Chuột không dây', 'Bàn phím cơ', 'Tai nghe chụp tai', 'Webcam 1080p', 'Hub USB-C 7 cổng', 'Đế tản nhiệt', 'Balo laptop', 'Màn hình 24 inch'])
  them('accessory', n, int(15, 350) * 10000, { warrantyMonths: pick([6, 12, 24]), wireless: rnd() < 0.5 });
for (let i = 1; i <= 32; i++)
  them('course', `Khoá học trực tuyến số ${i}`, int(19, 99) * 10000, { hours: int(5, 60), level: pick(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) });
shop.products.insertMany(products);

// Đơn hàng: món hàng NHÚNG thẳng trong đơn (chép tên + giá lúc mua — giá sau này đổi thì đơn cũ vẫn đúng).
const orders = [];
for (let i = 1; i <= 2000; i++) {
  const c = pick(customers);
  const n = int(1, 4);
  const items = [];
  for (let k = 0; k < n; k++) {
    const p = pick(products);
    if (items.some((x) => x.productId === p._id)) continue;
    items.push({ productId: p._id, name: p.name, price: p.price, qty: int(1, 3) });
  }
  const total = items.reduce((s, x) => s + Number(x.price.toString()) * x.qty, 0);
  orders.push({
    _id: i,
    customerId: c._id,
    status: pick(['PAID', 'PAID', 'PAID', 'SHIPPED', 'SHIPPED', 'PENDING', 'CANCELLED']),
    items,
    total: NumberDecimal(String(total)),
    shipTo: { city: c.city },
    createdAt: new Date(Date.UTC(2026, int(0, 9), int(1, 28), int(0, 23), int(0, 59))),
  });
}
shop.orders.insertMany(orders);

print(`ctshop: customers=${shop.customers.countDocuments()} products=${shop.products.countDocuments()} orders=${shop.orders.countDocuments()}`);
