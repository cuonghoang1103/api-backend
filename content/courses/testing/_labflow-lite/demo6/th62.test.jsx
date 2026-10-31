import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '../web/BookingForm.jsx';
import { fillBooking, deferred } from '../web/support.jsx';

describe('practice 6.2', () => {
  it('while waiting: "Booking…", disabled, and a second click sends nothing', async () => {
    const user = userEvent.setup();
    const answer = deferred();
    const onSubmit = vi.fn(() => answer.promise);
    render(<BookingForm onSubmit={onSubmit} />);
    await fillBooking(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    const button = screen.getByRole('button', { name: 'Booking…' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    answer.resolve({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
    expect(await screen.findByRole('button', { name: 'Book' })).toBeEnabled();
  });

  it('a 400 from the server is shown next to its field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({
      status: 400, data: { error: { code: 'VALIDATION', details: [{ path: 'date', message: 'Invalid ISO date' }] } },
    });
    render(<BookingForm onSubmit={onSubmit} />);
    await fillBooking(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(await screen.findByText('Invalid ISO date')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toHaveAccessibleDescription('Invalid ISO date');
  });
});
