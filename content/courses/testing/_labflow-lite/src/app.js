import express from 'express';
import { createBooking } from './rules/booking.js';

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.post('/bookings', (req, res) => {
    try {
      const booking = createBooking(req.body);
      res.status(201).json(booking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  return app;
}
