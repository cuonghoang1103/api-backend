export type Id = string | number;

let id: Id = loadFromUrl(); // id: string | number
console.log(typeof id);

id = 42;                    // from here tsc knows id is number
console.log(id.toFixed(0)); // .toFixed is a number method — allowed, no narrowing needed

function loadFromUrl(): Id {
  return '42';
}
