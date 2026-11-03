// Lesson 9.2 — any switches checking off; unknown makes you check first
const fromServerAny: any = JSON.parse('{"title": "Ruler"}');
console.log(fromServerAny.name.toUpperCase());       // no error from tsc … and a crash when it runs

const fromServer: unknown = JSON.parse('{"title": "Ruler"}');
console.log(fromServer.title);                       // error: you must check what it is first

if (typeof fromServer === 'object' && fromServer !== null && 'title' in fromServer && typeof fromServer.title === 'string') {
  console.log(fromServer.title.toUpperCase());        // fine: every step was checked
}
