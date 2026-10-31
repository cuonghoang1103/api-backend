import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingForm } from '../web/BookingForm.jsx';

// Nothing is ever submitted, so no status message can appear. Which test notices?
it('WRONG — findBy without await: a Promise is always truthy', () => {
  render(<BookingForm onSubmit={vi.fn()} />);
  expect(screen.findByRole('status')).toBeTruthy();
});

it('RIGHT — await it, and the missing message fails the test', async () => {
  render(<BookingForm onSubmit={vi.fn()} />);
  expect(await screen.findByRole('status')).toBeInTheDocument();
});
