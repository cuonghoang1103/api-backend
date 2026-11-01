// The same mistake with type aliases.
export type User = {
  readonly id: number;
  email: string;
  name: string;
};

export type User = {
  phone: string;
};
