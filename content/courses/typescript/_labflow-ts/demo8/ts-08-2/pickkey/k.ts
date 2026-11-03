type User = { id: number; name: string; email: string };

// Pick only accepts real keys of User — a misspelt key is refused up front.
type Bad = Pick<User, 'id' | 'emial'>;
const x: Bad = { id: 1, emial: 'a@x.vn' };
console.log(x);
