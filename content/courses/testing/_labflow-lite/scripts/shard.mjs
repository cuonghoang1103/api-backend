// Prints the test files of one shard, balanced by the timings of an earlier run (lesson 9.4).
//   node scripts/shard.mjs 2/3 demo9/cham/timings.json | xargs npx vitest run
import { readFileSync } from 'node:fs';
import { pickShard, durationsFromReport } from '../src/ci/shard.js';

const [spec, reportFile] = process.argv.slice(2);
const durations = durationsFromReport(JSON.parse(readFileSync(reportFile, 'utf8')), process.cwd());
console.log(pickShard(Object.keys(durations), spec, durations).join(' '));
