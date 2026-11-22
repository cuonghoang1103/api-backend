import express from 'express';
import { isThirsty, createPlant } from '../plant.mjs';
export function buildApp(store = []) {                     // the app is built by a function: tests get a fresh one
  const app = express();
  app.use(express.json());
  app.post('/plants', (req, res) => {
    try { const p = createPlant(req.body); store.push(p); res.status(201).json(p); }
    catch (e) { res.status(400).json({ error: { code: 'VALIDATION', message: e.message } }); }
  });
  app.get('/plants', (req, res) => res.json(store));
  return app;
}
export { isThirsty };
