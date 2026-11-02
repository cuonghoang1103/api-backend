// Lesson 9.3 — describing the shape of data with interface and type
interface Product {
  readonly id: number;          // set once, never changed
  name: string;
  price: number;
  category?: string;            // optional: may be missing
}

const lamp: Product = { id: 2, name: 'Desk lamp', price: 320000 };
lamp.price = 299000;            // fine
lamp.id = 99;                   // 1. readonly

const pen: Product = { id: 3, name: 'Pen' };                                   // 2. a required field is missing
const mug: Product = { id: 4, name: 'Mug', price: 60000, colour: 'blue' };     // 3. a field that does not exist (typo?)

function categoryLabel(p: Product) {
  return p.category.toUpperCase();                                             // 4. optional means maybe undefined
}

interface DigitalProduct extends Product {       // extends: everything in Product, plus more
  downloadUrl: string;
}
const ebook: DigitalProduct = { id: 9, name: 'SQL ebook', price: 99000, downloadUrl: '/files/sql.pdf' };

type Status = 'draft' | 'published' | 'archived';        // type can name unions; interface cannot
type ProductWithStatus = Product & { status: Status };   // & combines two shapes
const p2: ProductWithStatus = { id: 5, name: 'Stapler', price: 45000, status: 'sold' };   // 5. not a valid status
