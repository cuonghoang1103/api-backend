/**
 * Bộ sơ đồ SVG của khoá học.
 *
 * Không dùng thư viện vẽ nào: mỗi sơ đồ là SVG viết tay có `viewBox`, nên nó
 * co giãn theo bề ngang màn hình mà không vỡ chữ, in ra giấy vẫn nét, và không
 * kéo thêm một byte JavaScript nào — trang này sẽ được mở lại rất nhiều lần
 * trên điện thoại nên đó là điều đáng giá.
 *
 * Màu lấy thẳng theo bảng màu tối của trang (nền #0a0a0f) thay vì biến CSS
 * theme, vì trang tự mang nền tối cố định giống các chuyên đề khác.
 */
import type { FigureName } from './data/types';

const C = {
  text: '#e2e8f0',
  dim: '#94a3b8',
  faint: '#64748b',
  line: 'rgba(255,255,255,0.14)',
  fill: 'rgba(255,255,255,0.04)',
  emerald: '#34d399',
  sky: '#38bdf8',
  violet: '#a78bfa',
  amber: '#fbbf24',
  rose: '#fb7185',
};

/** Mũi tên dùng chung cho mọi sơ đồ. */
function Defs() {
  return (
    <defs>
      <marker id="hs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={C.dim} />
      </marker>
      <marker id="hs-arrow-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={C.violet} />
      </marker>
      <marker id="hs-arrow-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={C.rose} />
      </marker>
    </defs>
  );
}

function Box({
  x, y, w, h, label, sub, accent = C.violet, r = 10,
}: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: string; r?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={C.fill} stroke={accent} strokeOpacity={0.5} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 4 : y + h / 2 + 5} textAnchor="middle" fill={C.text} fontSize="14" fontWeight="600">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={C.faint} fontSize="11">
          {sub}
        </text>
      )}
    </g>
  );
}

/* ────────────────────────── 1. Kiến trúc client–server ───────────── */
function ArchClientServer() {
  return (
    <svg viewBox="0 0 860 300" className="h-auto w-full" role="img" aria-label="Sơ đồ đường đi của câu SQL từ trình duyệt tới đĩa">
      <Defs />
      <Box x={16} y={70} w={150} h={70} label="Trình duyệt" sub="React / Next.js" accent={C.sky} />
      <Box x={246} y={70} w={170} h={70} label="Backend" sub="Node.js + Express" accent={C.emerald} />
      <Box x={496} y={70} w={190} h={70} label="PostgreSQL" sub="tiến trình, cổng 5432" accent={C.violet} />
      <Box x={766} y={70} w={78} h={70} label="Đĩa" sub="trang 8KB" accent={C.amber} />

      <line x1={170} y1={105} x2={240} y2={105} stroke={C.dim} strokeWidth="1.5" markerEnd="url(#hs-arrow)" />
      <text x={205} y={95} textAnchor="middle" fill={C.dim} fontSize="10">HTTP</text>
      <text x={205} y={124} textAnchor="middle" fill={C.faint} fontSize="10">JSON</text>

      <line x1={420} y1={105} x2={490} y2={105} stroke={C.dim} strokeWidth="1.5" markerEnd="url(#hs-arrow)" />
      <text x={455} y={95} textAnchor="middle" fill={C.dim} fontSize="10">SQL</text>
      <text x={455} y={124} textAnchor="middle" fill={C.faint} fontSize="10">:5432</text>

      <line x1={690} y1={105} x2={760} y2={105} stroke={C.dim} strokeWidth="1.5" markerEnd="url(#hs-arrow)" />
      <text x={725} y={95} textAnchor="middle" fill={C.dim} fontSize="10">đọc/ghi</text>

      {/* Nhánh công cụ nối thẳng vào DB */}
      <Box x={430} y={210} w={200} h={56} label="psql · pgAdmin · DBeaver" accent={C.faint} r={8} />
      <path d="M530 208 L560 150" stroke={C.faint} strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#hs-arrow)" />
      <text x={620} y={190} fill={C.faint} fontSize="10">bạn gõ SQL trực tiếp</text>

      <text x={16} y={30} fill={C.text} fontSize="13" fontWeight="700">Câu SQL đi qua đâu</text>
      <text x={16} y={48} fill={C.faint} fontSize="11">
        Trình duyệt KHÔNG bao giờ nối thẳng tới database — backend đứng giữa và là lớp bảo vệ
      </text>
    </svg>
  );
}

/* ────────────────────────── 2. Giải phẫu một bảng ────────────────── */
function TableAnatomy() {
  const cols = ['id', 'name', 'price', 'stock'];
  const rows = [
    ['1', 'Bàn phím cơ', '1200000', '14'],
    ['2', 'Chuột không dây', '350000', '0'],
    ['3', 'Màn hình 27"', '5900000', '3'],
  ];
  const x0 = 150, y0 = 80, cw = [70, 190, 130, 90], rh = 38;
  const colX = (i: number) => x0 + cw.slice(0, i).reduce((a, b) => a + b, 0);
  const totalW = cw.reduce((a, b) => a + b, 0);

  return (
    <svg viewBox="0 0 820 330" className="h-auto w-full" role="img" aria-label="Sơ đồ giải phẫu một bảng: cột, dòng, ô, khoá chính">
      <Defs />
      <text x={x0} y={40} fill={C.text} fontSize="14" fontWeight="700">Bảng <tspan fill={C.violet}>products</tspan></text>
      <text x={x0} y={58} fill={C.faint} fontSize="11">4 cột × 3 dòng</text>

      {/* Header */}
      {cols.map((c, i) => (
        <g key={c}>
          <rect x={colX(i)} y={y0} width={cw[i]} height={rh} fill="rgba(167,139,250,0.14)" stroke={C.line} />
          <text x={colX(i) + 12} y={y0 + 24} fill={C.violet} fontSize="12" fontWeight="700" fontFamily="ui-monospace, monospace">{c}</text>
        </g>
      ))}
      {/* Rows */}
      {rows.map((r, ri) => r.map((cell, ci) => (
        <g key={`${ri}-${ci}`}>
          <rect x={colX(ci)} y={y0 + rh * (ri + 1)} width={cw[ci]} height={rh} fill={ri === 1 ? 'rgba(56,189,248,0.10)' : C.fill} stroke={C.line} />
          <text
            x={colX(ci) + 12}
            y={y0 + rh * (ri + 1) + 24}
            fill={ci === 0 ? C.amber : C.text}
            fontSize="12"
            fontFamily={ci === 0 || ci >= 2 ? 'ui-monospace, monospace' : 'inherit'}
          >
            {cell}
          </text>
        </g>
      )))}

      {/* Chú thích: cột */}
      <line x1={colX(2) + cw[2] / 2} y1={y0 - 8} x2={colX(2) + cw[2] / 2} y2={y0 - 34} stroke={C.violet} strokeWidth="1.4" markerEnd="url(#hs-arrow-v)" />
      <text x={colX(2) + cw[2] / 2} y={y0 - 42} textAnchor="middle" fill={C.violet} fontSize="11" fontWeight="600">CỘT (column)</text>

      {/* Chú thích: dòng */}
      <line x1={x0 + totalW + 8} y1={y0 + rh * 2 + rh / 2} x2={x0 + totalW + 60} y2={y0 + rh * 2 + rh / 2} stroke={C.sky} strokeWidth="1.4" markerStart="url(#hs-arrow)" />
      <text x={x0 + totalW + 66} y={y0 + rh * 2 + rh / 2 - 4} fill={C.sky} fontSize="11" fontWeight="600">DÒNG (row)</text>
      <text x={x0 + totalW + 66} y={y0 + rh * 2 + rh / 2 + 11} fill={C.faint} fontSize="10">một sản phẩm</text>

      {/* Chú thích: khoá chính */}
      <line x1={x0 - 8} y1={y0 + rh * 2} x2={x0 - 90} y2={y0 + rh * 2} stroke={C.amber} strokeWidth="1.4" markerStart="url(#hs-arrow)" />
      <text x={x0 - 96} y={y0 + rh * 2 - 4} textAnchor="end" fill={C.amber} fontSize="11" fontWeight="600">KHOÁ CHÍNH</text>
      <text x={x0 - 96} y={y0 + rh * 2 + 11} textAnchor="end" fill={C.faint} fontSize="10">không trùng, không rỗng</text>

      {/* Chú thích: ô + kiểu dữ liệu */}
      <line x1={colX(1) + 60} y1={y0 + rh * 4 + 6} x2={colX(1) + 60} y2={y0 + rh * 4 + 40} stroke={C.emerald} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />
      <text x={colX(1) + 60} y={y0 + rh * 4 + 56} textAnchor="middle" fill={C.emerald} fontSize="11" fontWeight="600">Ô (cell)</text>
      <text x={colX(2) + 70} y={y0 + rh * 4 + 56} textAnchor="middle" fill={C.faint} fontSize="10">
        mỗi cột một KIỂU cố định: text · numeric · integer
      </text>
    </svg>
  );
}

/* ────────────────────────── 3. Heap vs Index ─────────────────────── */
function HeapVsIndex() {
  const heap = [
    { k: 'minh@x.vn', y: 0 },
    { k: 'an@x.vn', y: 1 },
    { k: 'tu@x.vn', y: 2 },
    { k: 'binh@x.vn', y: 3 },
    { k: 'cuong@x.vn', y: 4 },
  ];
  const idx = ['an@x.vn', 'binh@x.vn', 'cuong@x.vn', 'minh@x.vn', 'tu@x.vn'];
  const map: Record<string, number> = { 'minh@x.vn': 0, 'an@x.vn': 1, 'tu@x.vn': 2, 'binh@x.vn': 3, 'cuong@x.vn': 4 };
  const rh = 34, hx = 40, ix = 520, y0 = 90;

  return (
    <svg viewBox="0 0 820 340" className="h-auto w-full" role="img" aria-label="Sơ đồ bảng thật và index nằm cạnh nhau">
      <Defs />
      <text x={hx} y={40} fill={C.text} fontSize="13" fontWeight="700">BẢNG THẬT (heap)</text>
      <text x={hx} y={58} fill={C.faint} fontSize="11">thứ tự ghi vào, không sắp xếp</text>
      <text x={ix} y={40} fill={C.emerald} fontSize="13" fontWeight="700">INDEX trên cột email</text>
      <text x={ix} y={58} fill={C.faint} fontSize="11">đã sắp xếp A→Z, kèm con trỏ</text>

      {heap.map((r) => (
        <g key={r.k}>
          <rect x={hx} y={y0 + r.y * rh} width={230} height={rh - 4} rx={6} fill={C.fill} stroke={C.line} />
          <text x={hx + 12} y={y0 + r.y * rh + 21} fill={C.faint} fontSize="11" fontFamily="ui-monospace, monospace">#{r.y + 1}</text>
          <text x={hx + 52} y={y0 + r.y * rh + 21} fill={C.text} fontSize="12" fontFamily="ui-monospace, monospace">{r.k}</text>
        </g>
      ))}

      {idx.map((k, i) => (
        <g key={k}>
          <rect x={ix} y={y0 + i * rh} width={200} height={rh - 4} rx={6} fill="rgba(52,211,153,0.10)" stroke={C.emerald} strokeOpacity={0.4} />
          <text x={ix + 12} y={y0 + i * rh + 21} fill={C.text} fontSize="12" fontFamily="ui-monospace, monospace">{k}</text>
          <path
            d={`M${ix - 6} ${y0 + i * rh + 15} C ${ix - 90} ${y0 + i * rh + 15}, ${hx + 340} ${y0 + map[k] * rh + 15}, ${hx + 236} ${y0 + map[k] * rh + 15}`}
            fill="none"
            stroke={C.emerald}
            strokeOpacity={0.45}
            strokeWidth="1.2"
            markerEnd="url(#hs-arrow)"
          />
        </g>
      ))}

      <text x={hx} y={y0 + 5 * rh + 34} fill={C.faint} fontSize="11">
        Tìm không index: đọc lần lượt cả 5 dòng
      </text>
      <text x={ix} y={y0 + 5 * rh + 34} fill={C.emerald} fontSize="11">
        Tìm có index: nhảy thẳng, rồi theo con trỏ về dòng thật
      </text>
      <text x={hx} y={y0 + 5 * rh + 54} fill={C.rose} fontSize="11">
        Cái giá: index chiếm đĩa riêng, và mỗi INSERT phải cập nhật thêm nó
      </text>
    </svg>
  );
}

/* ────────────────────────── 4. ERD ───────────────────────────────── */
function ErdShop() {
  const T = ({ x, y, name, cols, accent }: { x: number; y: number; name: string; cols: string[]; accent: string }) => (
    <g>
      <rect x={x} y={y} width={190} height={30 + cols.length * 20} rx={8} fill={C.fill} stroke={accent} strokeOpacity={0.55} />
      <rect x={x} y={y} width={190} height={28} rx={8} fill={accent} fillOpacity={0.16} />
      <text x={x + 12} y={y + 19} fill={accent} fontSize="12" fontWeight="700" fontFamily="ui-monospace, monospace">{name}</text>
      {cols.map((c, i) => (
        <text key={c} x={x + 12} y={y + 46 + i * 20} fill={c.startsWith('★') ? C.amber : c.startsWith('→') ? C.sky : C.dim} fontSize="11" fontFamily="ui-monospace, monospace">
          {c}
        </text>
      ))}
    </g>
  );

  return (
    <svg viewBox="0 0 820 400" className="h-auto w-full" role="img" aria-label="Sơ đồ quan hệ bốn bảng customers, orders, order_items, products">
      <Defs />
      <T x={20} y={40} name="customers" accent={C.emerald} cols={['★ id', 'email  UNIQUE', 'name']} />
      <T x={310} y={40} name="orders" accent={C.sky} cols={['★ id', '→ customer_id', 'total', 'created_at']} />
      <T x={310} y={230} name="order_items" accent={C.violet} cols={['★ id', '→ order_id', '→ product_id', 'quantity']} />
      <T x={600} y={230} name="products" accent={C.amber} cols={['★ id', 'name', 'price', 'stock']} />

      {/* customers 1 —— N orders */}
      <line x1={210} y1={100} x2={306} y2={100} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />
      <text x={258} y={92} textAnchor="middle" fill={C.dim} fontSize="11">1 ── N</text>

      {/* orders 1 —— N order_items */}
      <line x1={405} y1={144} x2={405} y2={226} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />
      <text x={418} y={190} fill={C.dim} fontSize="11">1 ── N</text>

      {/* products 1 —— N order_items */}
      <line x1={596} y1={290} x2={504} y2={290} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />
      <text x={550} y={282} textAnchor="middle" fill={C.dim} fontSize="11">1 ── N</text>

      <text x={20} y={310} fill={C.amber} fontSize="11">★ = khoá chính (primary key)</text>
      <text x={20} y={330} fill={C.sky} fontSize="11">→ = khoá ngoại (foreign key), trỏ về khoá chính bảng kia</text>
      <text x={20} y={356} fill={C.faint} fontSize="11">
        Mũi tên đọc là: &laquo;một khách có NHIỀU đơn&raquo;, &laquo;một đơn có NHIỀU dòng chi tiết&raquo;.
      </text>
      <text x={20} y={374} fill={C.faint} fontSize="11">order_items đứng giữa vì một đơn mua nhiều sản phẩm, một sản phẩm nằm trong nhiều đơn.</text>
    </svg>
  );
}

/* ────────────────────────── 5. Giải phẫu SELECT ──────────────────── */
function SelectAnatomy() {
  const lines: { t: string; n: string; d: string; c: string }[] = [
    { t: 'SELECT   name, SUM(total) AS doanh_thu', n: '⑤', d: 'chọn cột kết quả, đặt alias', c: C.violet },
    { t: 'FROM     customers c', n: '①', d: 'lấy dữ liệu từ bảng nào', c: C.emerald },
    { t: 'JOIN     orders o ON o.customer_id = c.id', n: '①', d: 'ghép bảng khác vào', c: C.emerald },
    { t: "WHERE    o.created_at >= '2026-01-01'", n: '②', d: 'bỏ bớt DÒNG', c: C.sky },
    { t: 'GROUP BY c.name', n: '③', d: 'gom dòng thành nhóm', c: C.amber },
    { t: 'HAVING   SUM(o.total) > 1000000', n: '④', d: 'bỏ bớt NHÓM', c: C.amber },
    { t: 'ORDER BY doanh_thu DESC', n: '⑦', d: 'sắp xếp kết quả', c: C.rose },
    { t: 'LIMIT    10', n: '⑧', d: 'cắt lấy một phần', c: C.rose },
  ];
  return (
    <svg viewBox="0 0 820 330" className="h-auto w-full" role="img" aria-label="Giải phẫu câu SELECT kèm thứ tự thực thi">
      <Defs />
      <text x={20} y={28} fill={C.faint} fontSize="11">Số tròn = THỨ TỰ CHẠY (không phải thứ tự viết)</text>
      {lines.map((l, i) => {
        const y = 54 + i * 33;
        return (
          <g key={l.t}>
            <circle cx={34} cy={y - 5} r={12} fill={l.c} fillOpacity={0.18} stroke={l.c} strokeOpacity={0.5} />
            <text x={34} y={y} textAnchor="middle" fill={l.c} fontSize="12" fontWeight="700">{l.n}</text>
            <text x={62} y={y} fill={C.text} fontSize="13" fontFamily="ui-monospace, monospace">{l.t}</text>
            <text x={520} y={y} fill={C.faint} fontSize="11">{l.d}</text>
          </g>
        );
      })}
      <line x1={508} y1={38} x2={508} y2={310} stroke={C.line} strokeDasharray="3 4" />
    </svg>
  );
}

/* ────────────────────────── 6. Đường ống thực thi ────────────────── */
function ExecOrder() {
  const steps = [
    { n: 'FROM / JOIN', rows: '1.200', c: C.emerald },
    { n: 'WHERE', rows: '340', c: C.sky },
    { n: 'GROUP BY', rows: '48 nhóm', c: C.amber },
    { n: 'HAVING', rows: '31 nhóm', c: C.amber },
    { n: 'SELECT', rows: '31', c: C.violet },
    { n: 'ORDER BY', rows: '31', c: C.rose },
    { n: 'LIMIT 20', rows: '20', c: C.rose },
  ];
  const w = 104, gap = 8, x0 = 18;
  return (
    <svg viewBox="0 0 820 200" className="h-auto w-full" role="img" aria-label="Đường ống thực thi truy vấn và số dòng còn lại qua từng bước">
      <Defs />
      <text x={x0} y={28} fill={C.faint} fontSize="11">Số dòng còn lại sau mỗi chặng — mỗi chặng cắt bớt một ít</text>
      {steps.map((s, i) => {
        const x = x0 + i * (w + gap);
        const h = 62;
        return (
          <g key={s.n}>
            <rect x={x} y={54} width={w} height={h} rx={9} fill={C.fill} stroke={s.c} strokeOpacity={0.5} />
            <text x={x + w / 2} y={78} textAnchor="middle" fill={s.c} fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace">{s.n}</text>
            <text x={x + w / 2} y={100} textAnchor="middle" fill={C.text} fontSize="14" fontWeight="700">{s.rows}</text>
            {i < steps.length - 1 && (
              <line x1={x + w + 1} y1={85} x2={x + w + gap - 1} y2={85} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />
            )}
          </g>
        );
      })}
      <text x={x0} y={150} fill={C.faint} fontSize="11">
        Vì WHERE chạy TRƯỚC SELECT nên alias đặt ở SELECT chưa tồn tại lúc WHERE chạy → báo lỗi.
      </text>
      <text x={x0} y={170} fill={C.faint} fontSize="11">
        Vì ORDER BY chạy SAU SELECT nên ở đó alias dùng được bình thường.
      </text>
    </svg>
  );
}

/* ────────────────────────── 7. GROUP BY ──────────────────────────── */
function GroupByVisual() {
  const raw = [
    ['Bàn phím', 'ban-phim', '1.200k'],
    ['Chuột', 'chuot', '350k'],
    ['Bàn phím 2', 'ban-phim', '900k'],
    ['Tai nghe', 'tai-nghe', '890k'],
    ['Chuột 2', 'chuot', '250k'],
  ];
  const colorOf: Record<string, string> = { 'ban-phim': C.violet, chuot: C.sky, 'tai-nghe': C.emerald };
  const groups = [
    { k: 'ban-phim', n: 2, sum: '2.100k' },
    { k: 'chuot', n: 2, sum: '600k' },
    { k: 'tai-nghe', n: 1, sum: '890k' },
  ];
  return (
    <svg viewBox="0 0 820 300" className="h-auto w-full" role="img" aria-label="GROUP BY gom dòng thành nhóm rồi rút mỗi nhóm thành một dòng">
      <Defs />
      <text x={20} y={30} fill={C.text} fontSize="12" fontWeight="700">① Dữ liệu thô</text>
      {raw.map((r, i) => (
        <g key={r[0]}>
          <rect x={20} y={46 + i * 36} width={230} height={30} rx={7} fill={C.fill} stroke={colorOf[r[1]]} strokeOpacity={0.45} />
          <text x={32} y={66 + i * 36} fill={C.text} fontSize="11">{r[0]}</text>
          <text x={148} y={66 + i * 36} fill={colorOf[r[1]]} fontSize="10" fontFamily="ui-monospace, monospace">{r[1]}</text>
          <text x={228} y={66 + i * 36} textAnchor="end" fill={C.dim} fontSize="11">{r[2]}</text>
        </g>
      ))}

      <text x={300} y={30} fill={C.text} fontSize="12" fontWeight="700">② Gom theo category</text>
      {groups.map((g, gi) => {
        const y = 46 + gi * 72;
        return (
          <g key={g.k}>
            <rect x={300} y={y} width={200} height={62} rx={9} fill={colorOf[g.k]} fillOpacity={0.08} stroke={colorOf[g.k]} strokeOpacity={0.45} strokeDasharray="5 4" />
            <text x={312} y={y + 20} fill={colorOf[g.k]} fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace">{g.k}</text>
            <text x={312} y={y + 42} fill={C.faint} fontSize="11">{g.n} dòng trong rổ</text>
          </g>
        );
      })}

      <line x1={256} y1={150} x2={294} y2={150} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />
      <line x1={506} y1={150} x2={544} y2={150} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />

      <text x={550} y={30} fill={C.text} fontSize="12" fontWeight="700">③ Mỗi rổ → MỘT dòng</text>
      {groups.map((g, gi) => (
        <g key={g.k}>
          <rect x={550} y={46 + gi * 42} width={250} height={34} rx={7} fill={colorOf[g.k]} fillOpacity={0.12} stroke={colorOf[g.k]} strokeOpacity={0.5} />
          <text x={562} y={68 + gi * 42} fill={C.text} fontSize="11" fontFamily="ui-monospace, monospace">{g.k}</text>
          <text x={700} y={68 + gi * 42} fill={C.dim} fontSize="11">COUNT {g.n}</text>
          <text x={790} y={68 + gi * 42} textAnchor="end" fill={C.text} fontSize="11" fontWeight="600">{g.sum}</text>
        </g>
      ))}

      <text x={550} y={210} fill={C.rose} fontSize="11">Chú ý: cột `name` biến mất.</text>
      <text x={550} y={228} fill={C.faint} fontSize="11">Một rổ có 2 tên khác nhau — database</text>
      <text x={550} y={244} fill={C.faint} fontSize="11">không biết chọn tên nào, nên báo lỗi</text>
      <text x={550} y={260} fill={C.faint} fontSize="11">nếu bạn để `name` trong SELECT.</text>
    </svg>
  );
}

/* ────────────────────────── 8. Bốn kiểu JOIN ─────────────────────── */
function Join4Up() {
  const items: { t: string; left: boolean; mid: boolean; right: boolean; d: string }[] = [
    { t: 'INNER JOIN', left: false, mid: true, right: false, d: 'chỉ phần chung' },
    { t: 'LEFT JOIN', left: true, mid: true, right: false, d: 'toàn bộ bảng trái' },
    { t: 'RIGHT JOIN', left: false, mid: true, right: true, d: 'toàn bộ bảng phải' },
    { t: 'FULL JOIN', left: true, mid: true, right: true, d: 'tất cả hai bên' },
  ];
  return (
    <svg viewBox="0 0 820 220" className="h-auto w-full" role="img" aria-label="Bốn kiểu JOIN dưới dạng sơ đồ Venn">
      <Defs />
      {items.map((it, i) => {
        const cx = 110 + i * 200;
        const cy = 96;
        const r = 46;
        const on = 'rgba(167,139,250,0.55)';
        const off = 'rgba(255,255,255,0.045)';
        return (
          <g key={it.t}>
            <defs>
              <clipPath id={`hs-clipL-${i}`}><circle cx={cx - 24} cy={cy} r={r} /></clipPath>
              <clipPath id={`hs-clipR-${i}`}><circle cx={cx + 24} cy={cy} r={r} /></clipPath>
            </defs>
            <circle cx={cx - 24} cy={cy} r={r} fill={it.left ? on : off} />
            <circle cx={cx + 24} cy={cy} r={r} fill={it.right ? on : off} />
            <g clipPath={`url(#hs-clipL-${i})`}>
              <circle cx={cx + 24} cy={cy} r={r} fill={it.mid ? on : off} />
            </g>
            <circle cx={cx - 24} cy={cy} r={r} fill="none" stroke={C.line} />
            <circle cx={cx + 24} cy={cy} r={r} fill="none" stroke={C.line} />
            <text x={cx - 58} y={cy + 4} textAnchor="middle" fill={C.dim} fontSize="11" fontWeight="700">A</text>
            <text x={cx + 58} y={cy + 4} textAnchor="middle" fill={C.dim} fontSize="11" fontWeight="700">B</text>
            <text x={cx} y={38} textAnchor="middle" fill={C.text} fontSize="12" fontWeight="700" fontFamily="ui-monospace, monospace">{it.t}</text>
            <text x={cx} y={178} textAnchor="middle" fill={C.faint} fontSize="11">{it.d}</text>
          </g>
        );
      })}
      <text x={20} y={206} fill={C.faint} fontSize="11">
        A = bảng viết TRƯỚC (bên trái chữ JOIN) · B = bảng viết SAU. Phần tô đậm là phần giữ lại trong kết quả.
      </text>
    </svg>
  );
}

/* ────────────────────────── 9. Nhân bản dòng khi JOIN ────────────── */
function JoinRowMultiply() {
  return (
    <svg viewBox="0 0 820 300" className="h-auto w-full" role="img" aria-label="JOIN một nhiều làm dòng bảng cha bị nhân bản khiến SUM sai">
      <Defs />
      <text x={20} y={28} fill={C.sky} fontSize="12" fontWeight="700">orders (1 dòng)</text>
      <rect x={20} y={44} width={200} height={36} rx={7} fill="rgba(56,189,248,0.12)" stroke={C.sky} strokeOpacity={0.5} />
      <text x={32} y={67} fill={C.text} fontSize="12" fontFamily="ui-monospace, monospace">#7 · total = 500k</text>

      <text x={20} y={124} fill={C.violet} fontSize="12" fontWeight="700">order_items (3 dòng)</text>
      {['bút · 100k', 'vở · 150k', 'thước · 250k'].map((t, i) => (
        <g key={t}>
          <rect x={20} y={140 + i * 40} width={200} height={32} rx={7} fill="rgba(167,139,250,0.10)" stroke={C.violet} strokeOpacity={0.45} />
          <text x={32} y={161 + i * 40} fill={C.text} fontSize="11" fontFamily="ui-monospace, monospace">order_id 7 · {t}</text>
        </g>
      ))}

      <text x={270} y={100} fill={C.dim} fontSize="12" fontFamily="ui-monospace, monospace">JOIN</text>
      <line x1={264} y1={120} x2={340} y2={140} stroke={C.dim} strokeWidth="1.4" markerEnd="url(#hs-arrow)" />

      <text x={370} y={28} fill={C.rose} fontSize="12" fontWeight="700">Kết quả sau JOIN — 3 dòng</text>
      {['bút', 'vở', 'thước'].map((t, i) => (
        <g key={t}>
          <rect x={370} y={44 + i * 44} width={330} height={36} rx={7} fill="rgba(251,113,133,0.09)" stroke={C.rose} strokeOpacity={0.4} />
          <text x={382} y={67 + i * 44} fill={C.text} fontSize="12" fontFamily="ui-monospace, monospace">
            #7 · <tspan fill={C.rose} fontWeight="700">total = 500k</tspan> · {t}
          </text>
        </g>
      ))}
      <text x={706} y={70} fill={C.rose} fontSize="18" fontWeight="700">×3</text>

      <rect x={370} y={186} width={430} height={44} rx={9} fill="rgba(251,113,133,0.12)" stroke={C.rose} strokeOpacity={0.5} />
      <text x={384} y={213} fill={C.rose} fontSize="12" fontFamily="ui-monospace, monospace">
        SUM(o.total) = 500k + 500k + 500k = 1.500k ✗ (thật ra chỉ 500k)
      </text>
      <text x={370} y={256} fill={C.faint} fontSize="11">Cách chữa: gộp bảng con TRƯỚC rồi mới JOIN, hoặc dùng EXISTS thay cho JOIN.</text>
      <text x={370} y={274} fill={C.faint} fontSize="11">Cách kiểm tra nhanh: bỏ SUM đi, đếm số dòng — nhiều hơn số đơn thật là đã nhân bản.</text>
    </svg>
  );
}

/* ────────────────────────── 10. Dòng thời gian transaction ───────── */
function TxnTimeline() {
  const marks = [
    { x: 90, t: 'BEGIN', c: C.emerald },
    { x: 250, t: 'UPDATE A −1tr', c: C.sky },
    { x: 430, t: 'UPDATE B +1tr', c: C.sky },
    { x: 620, t: 'COMMIT', c: C.violet },
  ];
  return (
    <svg viewBox="0 0 820 280" className="h-auto w-full" role="img" aria-label="Dòng thời gian một transaction và điều phiên khác nhìn thấy">
      <Defs />
      <text x={20} y={28} fill={C.text} fontSize="12" fontWeight="700">Phiên A — người chuyển tiền</text>
      <line x1={40} y1={70} x2={790} y2={70} stroke={C.line} strokeWidth="2" markerEnd="url(#hs-arrow)" />
      {marks.map((m) => (
        <g key={m.t}>
          <circle cx={m.x} cy={70} r={6} fill={m.c} />
          <line x1={m.x} y1={64} x2={m.x} y2={46} stroke={m.c} strokeOpacity={0.5} />
          <text x={m.x} y={40} textAnchor="middle" fill={m.c} fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace">{m.t}</text>
        </g>
      ))}

      <rect x={90} y={92} width={530} height={26} rx={6} fill="rgba(167,139,250,0.10)" stroke={C.violet} strokeOpacity={0.4} strokeDasharray="5 4" />
      <text x={355} y={110} textAnchor="middle" fill={C.violet} fontSize="11">bên trong transaction — chỉ mình A nhìn thấy thay đổi</text>

      <text x={20} y={160} fill={C.text} fontSize="12" fontWeight="700">Phiên B — người khác đọc cùng lúc</text>
      <line x1={40} y1={200} x2={790} y2={200} stroke={C.line} strokeWidth="2" markerEnd="url(#hs-arrow)" />
      <rect x={40} y={212} width={580} height={26} rx={6} fill="rgba(255,255,255,0.04)" stroke={C.line} />
      <text x={330} y={230} textAnchor="middle" fill={C.dim} fontSize="11">B vẫn đọc được GIÁ TRỊ CŨ, và không hề bị chặn</text>
      <rect x={620} y={212} width={170} height={26} rx={6} fill="rgba(52,211,153,0.12)" stroke={C.emerald} strokeOpacity={0.5} />
      <text x={705} y={230} textAnchor="middle" fill={C.emerald} fontSize="11">giờ B mới thấy giá trị mới</text>

      <line x1={620} y1={76} x2={620} y2={208} stroke={C.violet} strokeOpacity={0.4} strokeDasharray="4 4" />
      <text x={40} y={266} fill={C.faint} fontSize="11">
        Nếu thay COMMIT bằng ROLLBACK: mọi thay đổi biến mất như chưa từng có, và B không bao giờ biết chuyện gì đã xảy ra.
      </text>
    </svg>
  );
}

/* ────────────────────────── 11. ACID ─────────────────────────────── */
function Acid() {
  const cells = [
    { l: 'A', n: 'Atomicity', vi: 'Nguyên tử', q: 'Mất điện giữa hai lệnh thì sao?', a: 'Cả hai cùng huỷ. Không có nửa vời.', c: C.emerald },
    { l: 'C', n: 'Consistency', vi: 'Nhất quán', q: 'Ràng buộc có bị phá không?', a: 'Không. Khoá ngoại, CHECK, UNIQUE vẫn đúng sau khi xong.', c: C.sky },
    { l: 'I', n: 'Isolation', vi: 'Cô lập', q: 'Hai người chuyển cùng lúc?', a: 'Không giẫm lên nhau. Ai cũng như đang chạy một mình.', c: C.violet },
    { l: 'D', n: 'Durability', vi: 'Bền vững', q: 'COMMIT xong rồi mất điện?', a: 'Dữ liệu còn nguyên — nhờ ghi nhật ký WAL trước.', c: C.amber },
  ];
  return (
    <svg viewBox="0 0 820 300" className="h-auto w-full" role="img" aria-label="Bốn tính chất ACID của transaction">
      <Defs />
      {cells.map((c, i) => {
        const x = 18 + (i % 2) * 400;
        const y = 20 + Math.floor(i / 2) * 140;
        return (
          <g key={c.l}>
            <rect x={x} y={y} width={384} height={122} rx={12} fill={C.fill} stroke={c.c} strokeOpacity={0.45} />
            <circle cx={x + 40} cy={y + 42} r={22} fill={c.c} fillOpacity={0.18} stroke={c.c} strokeOpacity={0.5} />
            <text x={x + 40} y={y + 50} textAnchor="middle" fill={c.c} fontSize="20" fontWeight="800">{c.l}</text>
            <text x={x + 76} y={y + 34} fill={C.text} fontSize="13" fontWeight="700">{c.n}</text>
            <text x={x + 76} y={y + 52} fill={C.faint} fontSize="11">{c.vi}</text>
            <text x={x + 18} y={y + 84} fill={c.c} fontSize="11" fontWeight="600">{c.q}</text>
            <text x={x + 18} y={y + 104} fill={C.dim} fontSize="11">{c.a}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ────────────────────────── 12. Bản đồ khoá học ──────────────────── */
function CourseMap() {
  const stages = [
    { t: 'Chặng 1 · Nền móng', r: 'Chương 0 → 3', d: 'Database là gì · bảng & kiểu · SELECT · WHERE', c: C.emerald },
    { t: 'Chặng 2 · Truy vấn thật', r: 'Chương 4 → 7', d: 'GROUP BY · JOIN · CTE · Transaction', c: C.sky },
    { t: 'Chặng 3 · Đi sâu', r: 'Chương 8 → 13', d: 'Window · Index · JSONB · Trigger · View', c: C.violet },
    { t: 'Chặng 4 · Chạy thật', r: 'Chương 14 → 20', d: 'Bảo mật · vận hành · đồng thời · sao lưu', c: C.amber },
  ];
  return (
    <svg viewBox="0 0 820 250" className="h-auto w-full" role="img" aria-label="Bản đồ bốn chặng của khoá học">
      <Defs />
      {stages.map((s, i) => {
        const y = 18 + i * 56;
        return (
          <g key={s.t}>
            <rect x={18} y={y} width={784} height={46} rx={10} fill={s.c} fillOpacity={0.07} stroke={s.c} strokeOpacity={0.4} />
            <circle cx={48} cy={y + 23} r={14} fill={s.c} fillOpacity={0.2} stroke={s.c} strokeOpacity={0.55} />
            <text x={48} y={y + 28} textAnchor="middle" fill={s.c} fontSize="13" fontWeight="800">{i + 1}</text>
            <text x={76} y={y + 20} fill={C.text} fontSize="13" fontWeight="700">{s.t}</text>
            <text x={76} y={y + 37} fill={C.faint} fontSize="11">{s.d}</text>
            <text x={786} y={y + 28} textAnchor="end" fill={s.c} fontSize="11" fontWeight="600" fontFamily="ui-monospace, monospace">{s.r}</text>
            {i < stages.length - 1 && (
              <line x1={48} y1={y + 46} x2={48} y2={y + 56} stroke={s.c} strokeOpacity={0.45} strokeWidth="2" />
            )}
          </g>
        );
      })}
      <text x={18} y={240} fill={C.faint} fontSize="11">
        Mỗi chương gắn với đúng một module bài tập bên Code Lab — học xong đọc là làm được ngay trên PostgreSQL thật.
      </text>
    </svg>
  );
}

const MAP: Record<FigureName, () => React.JSX.Element> = {
  'arch-client-server': ArchClientServer,
  'table-anatomy': TableAnatomy,
  'heap-vs-index': HeapVsIndex,
  'erd-shop': ErdShop,
  'select-anatomy': SelectAnatomy,
  'exec-order': ExecOrder,
  'groupby-visual': GroupByVisual,
  'join-4up': Join4Up,
  'join-row-multiply': JoinRowMultiply,
  'txn-timeline': TxnTimeline,
  acid: Acid,
  'course-map': CourseMap,
};

export default function Figure({
  name, title, caption,
}: { name: FigureName; title?: string; caption?: string }) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return (
    <figure className="my-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      {title && <figcaption className="mb-3 text-sm font-semibold text-slate-200">{title}</figcaption>}
      {/* Sơ đồ rộng: cho cuộn NGANG trong khung riêng thay vì để cả trang cuộn ngang. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="min-w-[620px]">
          <Cmp />
        </div>
      </div>
      {caption && <p className="mt-3 text-xs leading-relaxed text-slate-500">{caption}</p>}
    </figure>
  );
}
