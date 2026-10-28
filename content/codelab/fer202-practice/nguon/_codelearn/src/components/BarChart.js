//@from F11
// src/components/BarChart.js — biểu đồ cột bằng SVG thuần (không cần thư viện biểu đồ)
// data = [{ label, value }] · chiều cao cột TỈ LỆ với value, cột cao nhất = PLOT_HEIGHT
const PLOT_HEIGHT = 150;
const BAR_WIDTH = 48;
const GAP = 28;

export default function BarChart({ id, data, title }) {
  const max = Math.max(1, ...data.map((d) => d.value));   // ít nhất 1 ⇒ toàn số 0 không chia cho 0
  const width = data.length * (BAR_WIDTH + GAP) + GAP;
  const height = PLOT_HEIGHT + 50;
  return (
    <svg id={id} viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: Math.max(width, 240) }} role="img" aria-label={title}>
      <title>{title}</title>
      <line x1="0" y1={PLOT_HEIGHT + 20} x2={width} y2={PLOT_HEIGHT + 20} stroke="#cbd5e1" />
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * PLOT_HEIGHT);
        const x = GAP + i * (BAR_WIDTH + GAP);
        const y = PLOT_HEIGHT + 20 - h;
        return (
          <g key={d.label}>
            <rect className="bar" x={x} y={y} width={BAR_WIDTH} height={h} rx="4" data-value={d.value} />
            <text className="bar-value" x={x + BAR_WIDTH / 2} y={y - 4} textAnchor="middle">{d.value}</text>
            <text className="bar-label" x={x + BAR_WIDTH / 2} y={PLOT_HEIGHT + 36} textAnchor="middle">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
