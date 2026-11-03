type Lab = { code: string; capacity: number };

// Readonly<T>, written out: copy each field and add the readonly modifier.
type Frozen<T> = { readonly [K in keyof T]: T[K] };

const lab: Frozen<Lab> = { code: 'BE-201', capacity: 40 };
console.log(lab.capacity); // reading is fine
lab.capacity = 50;         // writing is not
