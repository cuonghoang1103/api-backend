// Splits test files into shards that take about the same time (lesson 9.4).
// Vitest's own --shard=i/n splits by file, not by time; with timings from an earlier run we can do better:
// longest file first, each into the shard that has the least work so far.
export const UNKNOWN_MS = 1000; // a file with no timing yet (a new test) counts as one second

export function splitIntoShards(files, total, durations = {}) {
  if (!Number.isInteger(total) || total < 1) throw new RangeError('total must be a whole number ≥ 1, got ' + total);
  const shards = Array.from({ length: total }, () => ({ files: [], ms: 0 }));
  const cost = (f) => durations[f] ?? UNKNOWN_MS;
  const order = [...files].sort((a, b) => cost(b) - cost(a) || a.localeCompare(b));
  for (const file of order) {
    const lightest = shards.reduce((min, s) => (s.ms < min.ms ? s : min));
    lightest.files.push(file);
    lightest.ms += cost(file);
  }
  return shards;
}

// spec = "2/3" like --shard: the second of three shards (1-based).
export function pickShard(files, spec, durations) {
  const m = /^(\d+)\/(\d+)$/.exec(spec);
  if (!m) throw new SyntaxError('shard must look like 2/3, got ' + spec);
  const [index, total] = [Number(m[1]), Number(m[2])];
  if (index < 1 || index > total) throw new RangeError('shard ' + spec + ' does not exist');
  return splitIntoShards(files, total, durations)[index - 1].files;
}

// Timings per file (ms) from a Vitest JSON report: { '<relative file>': ms }.
export function durationsFromReport(report, root = '') {
  const out = {};
  for (const r of report.testResults) {
    const file = r.name.startsWith(root) ? r.name.slice(root.length).replace(/^\//, '') : r.name;
    out[file] = Math.round(r.endTime - r.startTime);
  }
  return out;
}
