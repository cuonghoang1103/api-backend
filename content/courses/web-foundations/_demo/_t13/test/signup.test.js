// @vitest-environment jsdom
import { it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { createSignupForm } from '../src/signup.js';

afterEach(() => { document.body.innerHTML = ''; });

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  document.body.append(createSignupForm({ onSubmit }));
  return { user: userEvent.setup(), onSubmit };
}

it('keeps "Sign up" disabled until the email and password are valid', async () => {
  const { user } = setup();
  const button = screen.getByRole('button', { name: 'Sign up' });
  expect(button).toBeDisabled();

  await user.type(screen.getByLabelText('Email'), 'lan@example.com');
  await user.type(screen.getByLabelText('Password'), 'short');
  expect(button).toBeDisabled();

  await user.type(screen.getByLabelText('Password'), '-but-long-now');
  expect(button).toBeEnabled();
});

it('submits the email and greets the user', async () => {
  const { user, onSubmit } = setup();
  await user.type(screen.getByLabelText('Email'), 'lan@example.com');
  await user.type(screen.getByLabelText('Password'), 'correct-horse');
  await user.click(screen.getByRole('button', { name: 'Sign up' }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'lan@example.com' });
  expect(await screen.findByText('Welcome, lan@example.com!')).toBeInTheDocument();
});

it('shows an alert and re-enables the button when the server fails', async () => {
  const { user } = setup(vi.fn().mockRejectedValue(new Error('email already used')));
  await user.type(screen.getByLabelText('Email'), 'lan@example.com');
  await user.type(screen.getByLabelText('Password'), 'correct-horse');
  await user.click(screen.getByRole('button', { name: 'Sign up' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Sign-up failed: email already used');
  expect(screen.getByRole('button', { name: 'Sign up' })).toBeEnabled();
});

it('get vs query: query returns null, get throws', () => {
  setup();
  expect(screen.queryByRole('alert')).toBeNull();       // "is it NOT there?" ⇒ query
  expect(() => screen.getByRole('alert')).toThrow();    // get insists it exists
});
