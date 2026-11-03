type Draft = { title: string; body?: string; tags?: string[] };

// Required<T> removes every ?, so a complete draft must have everything.
const done: Required<Draft> = { title: 'Hi', body: 'text', tags: [] }; // ok
const partial: Required<Draft> = { title: 'Hi' };                      // body, tags missing
console.log(done, partial);
