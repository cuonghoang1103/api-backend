type Lab = { code: string; capacity: number };

// A mapped type can change the VALUE type too: here every field becomes a function returning it.
type Getters<T> = { [K in keyof T]: () => T[K] };

const lab: Getters<Lab> = {
  code: () => 'BE-201',
  capacity: () => 40,
};
console.log(lab.code(), lab.capacity());
