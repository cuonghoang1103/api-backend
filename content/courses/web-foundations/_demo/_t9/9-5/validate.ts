// Lesson 9.5 — check data at the boundary with zod: one schema gives the runtime check AND the type
import { z } from 'zod';

const Product = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
});
type Product = z.infer<typeof Product>;          // { id: number; name: string; price: number }

const good: unknown = JSON.parse('{"id": 7, "name": "Ruler", "price": 8000}');
const bad: unknown = JSON.parse('{"id": 7, "title": "Ruler", "price": "8000"}');

const ok = Product.safeParse(good);
if (ok.success) console.log('valid:', ok.data.name.toUpperCase());
const notOk = Product.safeParse(bad);
if (!notOk.success) for (const issue of notOk.error.issues) console.log('invalid:', issue.path.join('.'), '-', issue.message);
