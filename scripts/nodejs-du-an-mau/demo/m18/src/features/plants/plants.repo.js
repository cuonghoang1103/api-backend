import { db } from '../../lib/db.js';
export const findPlant = (id) => db.plant?.findUnique({ where: { id } });
