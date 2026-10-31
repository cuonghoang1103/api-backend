import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingForm } from '../web/BookingForm.jsx';

describe('find elements the way a user does', () => {
  it('by role and accessible name', () => {
    render(<BookingForm onSubmit={async () => {}} />);
    expect(screen.getByRole('form', { name: 'Book a lab' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Lab' })).toHaveValue('BE-201');
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toHaveValue(null);
    expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
  });

  it('by label, for inputs without a simple role', () => {
    render(<BookingForm onSubmit={async () => {}} />);
    expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Start')).toHaveAttribute('type', 'time');
  });

  it('getBy throws, queryBy returns null', () => {
    render(<BookingForm onSubmit={async () => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(() => screen.getByRole('alert')).toThrow(/Unable to find an accessible element with the role "alert"/);
  });
});
