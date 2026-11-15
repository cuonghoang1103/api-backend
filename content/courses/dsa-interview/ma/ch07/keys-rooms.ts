// @java: KeysRooms.java
// LC 841 · Keys and Rooms — the input IS an adjacency list: rooms[i] = keys found in room i = arcs i → key.

// #region giai
function canVisitAllRooms(rooms: number[][]): boolean {
  const seen = new Array<boolean>(rooms.length).fill(false);
  const stack = [0];
  seen[0] = true;
  let count = 1;
  while (stack.length > 0) {
    const r = stack.pop()!;
    for (const key of rooms[r]) {
      if (!seen[key]) { seen[key] = true; count++; stack.push(key); }
    }
  }
  return count === rooms.length;
}
// #endregion

console.log(canVisitAllRooms([[1], [2], [3], []]));
console.log(canVisitAllRooms([[1, 3], [3, 0, 1], [2], [0]]));
console.log(canVisitAllRooms([[]]));
