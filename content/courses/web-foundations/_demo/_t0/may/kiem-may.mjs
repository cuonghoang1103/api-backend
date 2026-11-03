// chay: tay — check that every tool of this course is installed and on your PATH. Run: node kiem-may.mjs
import { execSync } from 'node:child_process';

const tools = [
  ['Node.js', 'node --version', 22],   // the course uses Node 22 (LTS)
  ['npm', 'npm --version', 10],
  ['Git', 'git --version', 2],
  ['VS Code (code)', 'code --version', 1],
];

let ok = 0;
for (const [name, command, minMajor] of tools) {
  try {
    const out = execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split('\n')[0];
    const major = Number(out.match(/(\d+)\./)?.[1]);
    if (major >= minMajor) { console.log(`✓ ${name.padEnd(15)} ${out}`); ok++; }
    else console.log(`✗ ${name.padEnd(15)} ${out}  ← too old, need ${minMajor} or newer`);
  } catch {
    console.log(`✗ ${name.padEnd(15)} not found  ← install it, then open a NEW terminal`);
  }
}
console.log(`${ok}/${tools.length} tools ready`);
