// @vitest-environment jsdom
// Deliberately failing: what Testing Library prints when a query finds nothing
import { it, expect } from 'vitest';
import { screen } from '@testing-library/dom';
import { createSignupForm } from '../src/signup.js';

it('finds the button by a name that does not exist', () => {
  document.body.append(createSignupForm({ onSubmit: async () => {} }));
  expect(screen.getByRole('button', { name: 'Register' })).toBeTruthy();
});
