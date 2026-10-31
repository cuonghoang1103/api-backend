import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '../web/BookingForm.jsx';

async function fill(user, { lab, date = '2026-11-16', start = '08:00', end = '10:00', seats = '20' } = {}) {
  if (lab !== undefined) { await user.clear(screen.getByRole('textbox', { name: 'Lab' })); await user.type(screen.getByRole('textbox', { name: 'Lab' }), lab); }
  await user.type(screen.getByLabelText('Date'), date);
  await user.type(screen.getByLabelText('Start'), start);
  await user.type(screen.getByLabelText('End'), end);
  await user.type(screen.getByRole('spinbutton', { name: 'Seats' }), seats);
}

describe('typing, clicking, waiting', () => {
  it('sends exactly what the user typed', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
    render(<BookingForm onSubmit={onSubmit} />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(onSubmit).toHaveBeenCalledWith({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20 });
    expect(await screen.findByRole('status')).toHaveTextContent('Booked. See you in BE-201.');
  });

  it('shows its own errors and does not call the API', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} />);
    await fill(user, { lab: 'be201', seats: '0' });
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(screen.getByRole('textbox', { name: 'Lab' })).toHaveAccessibleDescription('A lab code looks like BE-201.');
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toBeInvalid();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('pressing Enter submits too', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ status: 201, data: { lab: 'BE-201', status: 'PENDING' } });
    render(<BookingForm onSubmit={onSubmit} />);
    await fill(user, { seats: '31{Enter}' });
    expect(await screen.findByRole('status')).toHaveTextContent('Sent. A lecturer must approve this booking.');
  });
});
