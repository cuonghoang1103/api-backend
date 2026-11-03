// A generic that does not connect its type parameter to the result is just noise.
function countGeneric<T>(items: T[]): number {
  return items.length;
}

// Exactly the same behaviour, honest about what it uses:
function count(items: readonly unknown[]): number {
  return items.length;
}

console.log(countGeneric([1, 2, 3]), count(['a', 'b']));
