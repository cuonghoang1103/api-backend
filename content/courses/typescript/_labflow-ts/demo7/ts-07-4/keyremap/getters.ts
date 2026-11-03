type Lab = { code: string; capacity: number };

// Remap each key K to "get<Key>" with `as`, and the value to a function returning the field.
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

const lab: Getters<Lab> = {
  getCode: () => 'BE-201',
  getCapacity: () => 40,
};
console.log(lab.getCode(), lab.getCapacity());
