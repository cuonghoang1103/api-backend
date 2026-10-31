import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingForm } from '../web/BookingForm.jsx';

// Two tests that each render the form. Run once as is, once without afterEach(cleanup) in web/test-setup.js.
it('first test renders the form', () => {
  render(<BookingForm onSubmit={async () => {}} />);
  expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
});

it('second test renders the form again', () => {
  render(<BookingForm onSubmit={async () => {}} />);
  expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
});
