/**
 * Hoạ tiết pixel (sao, tim, mây, tia) — SVG lưới ô vuông, `crispEdges` cho nét sắc. Thuần trang trí (aria-hidden).
 * Mỗi hình là một mảng chuỗi: '#' = ô màu chính, 'o' = ô màu phụ, '.' = trống.
 */
const HINH: Record<string, string[]> = {
  sao: ['..#..', '..#..', '#####', '.###.', '##.##'],
  tim: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  may: ['...####....', '..######...', '.#########.', '###########', '.#########.'],
  tia: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  la: ['..##', '.###', '###.', '#o..'],
  chu: ['#####', '#...#', '#.#.#', '#...#', '#####'],
  sach: ['######.', '#oooo##', '#oooo##', '#oooo##', '######.'],
};

export type TenHinh = keyof typeof HINH;

export default function PixelDeco({
  hinh,
  mau = 'currentColor',
  mau2,
  o = 4,
  className,
  style,
}: {
  hinh: TenHinh;
  mau?: string;
  mau2?: string;
  /** cạnh một ô (px) */
  o?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const g = HINH[hinh]!;
  const w = Math.max(...g.map((r) => r.length));
  const h = g.length;
  const o2 = mau2 ?? mau;
  return (
    <svg
      aria-hidden
      className={className}
      style={style}
      width={w * o}
      height={h * o}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
    >
      {g.flatMap((r, y) =>
        [...r].map((c, x) =>
          c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c === 'o' ? o2 : mau} />,
        ),
      )}
    </svg>
  );
}
