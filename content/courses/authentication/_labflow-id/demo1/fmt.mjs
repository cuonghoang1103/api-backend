// demo1/fmt.mjs — print a duration in seconds the way a person would say it.
const YEAR = 365.25 * 24 * 3600;
export const fmt = (s) => (s < 1e-3 ? `${(s * 1e6).toFixed(1)} µs` : s < 1 ? `${(s * 1e3).toFixed(1)} ms` : s < 60 ? `${s.toFixed(1)} s`
  : s < 3600 ? `${(s / 60).toFixed(1)} minutes` : s < 86400 ? `${(s / 3600).toFixed(1)} hours`
  : s < YEAR ? `${(s / 86400).toFixed(1)} days` : `${(s / YEAR).toExponential(1)} years`);
