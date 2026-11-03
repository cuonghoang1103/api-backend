type Draft = { title: string; body?: string; tags?: string[] };

// Remove the optional modifier from every field: now all are required.
type Complete<T> = { [K in keyof T]-?: T[K] };

const draft: Draft = { title: 'Hi' };                 // ok — body and tags are optional
const done: Complete<Draft> = { title: 'Hi' };        // not ok — body and tags are now required
export { draft, done };
