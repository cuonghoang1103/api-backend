// Lesson 9.4 — what generics still refuse
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}
const tags = ['sql', 'beginner'];
findById(tags, 1);                                   // 1. strings have no id

const pen = findById([{ id: 3, name: 'Pen', price: 5000 }], 3);
console.log(pen.price);                              // 2. it may be undefined (not found)
console.log(pen?.colour);                            // 3. T kept the real shape: there is no colour
