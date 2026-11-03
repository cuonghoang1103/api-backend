type MaybeName = string | null | undefined;

// NonNullable drops null and undefined from a union.
type Name = NonNullable<MaybeName>;
const n: Name = null;
console.log(n);
