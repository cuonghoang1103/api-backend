// tien.js — money is Prisma.Decimal (numeric(12,2) in PostgreSQL), NEVER a JavaScript number (a float).
import { Prisma } from '@prisma/client';

export const tongTien = (dong) =>
  dong.reduce((s, d) => s.plus(new Prisma.Decimal(d.unit_price).times(d.qty)), new Prisma.Decimal(0));
