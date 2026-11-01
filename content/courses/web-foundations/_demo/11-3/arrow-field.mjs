class Counter {
  count = 0;
  inc() { this.count++; return this.count; }          // method: on the prototype, shared
  incArrow = () => { this.count++; return this.count; }; // field: a NEW function per instance
}
const a = new Counter();
const b = new Counter();
console.log('a.inc === b.inc          ', a.inc === b.inc);
console.log('a.incArrow === b.incArrow', a.incArrow === b.incArrow);

const { inc, incArrow } = a;        // detach both
console.log('detached arrow works:', incArrow());
try { inc(); } catch (e) { console.log('detached method:', e.name + ': ' + e.message); }
