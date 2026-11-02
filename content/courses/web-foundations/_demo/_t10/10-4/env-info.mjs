// Lesson 10.4 — the facts a good question includes: versions and platform (paste this output into your question)
import os from 'node:os';
console.log('Node   ', process.version);
console.log('V8     ', process.versions.v8);
console.log('OS     ', os.type(), os.release(), os.arch());
