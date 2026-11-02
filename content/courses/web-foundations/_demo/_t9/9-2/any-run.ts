// Lesson 9.2 — the any version, run: tsc said nothing, the program still crashes
const fromServerAny: any = JSON.parse('{"title": "Ruler"}');
console.log(fromServerAny.name.toUpperCase());
