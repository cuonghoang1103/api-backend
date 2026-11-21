// Milestone 9 starter: the types of your domain, written once and imported everywhere.
export type Category = 'breakfast' | 'main' | 'dessert';

export interface Recipe {
  id: number;
  name: string;
  minutes: number;
  category: Category;
  note?: string;                 // optional: may be missing
}

// What the API returns: success OR failure, never "maybe both".
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

// Data from the network is unknown until checked. Types vanish at runtime; this check does not.
export function isRecipe(x: unknown): x is Recipe {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === 'number'
    && typeof r.name === 'string'
    && Number.isInteger(r.minutes) && (r.minutes as number) > 0
    && (r.category === 'breakfast' || r.category === 'main' || r.category === 'dessert');
}
