import { db } from '../../lib/db.js';
import { findPlant } from '../plants/plants.repo.js';
export const routes = { list: () => db };
