interface Rect { w: number; h: number }
function area(r: Rect): number { return r.w * r.h; }
// The types are gone at run time — Node strips them and runs the JavaScript.
console.log(area({ w: 4, h: 3 }));
