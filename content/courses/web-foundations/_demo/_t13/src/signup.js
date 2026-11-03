// A small sign-up form built with plain DOM code (no framework).
// The same ideas apply 1:1 to React components tested with @testing-library/react.
export function createSignupForm({ onSubmit }) {
  const form = document.createElement('form');
  form.innerHTML = `
    <h2>Create an account</h2>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email">
    <label for="password">Password</label>
    <input id="password" name="password" type="password">
    <p class="hint" id="pw-hint">At least 8 characters</p>
    <button type="submit" disabled>Sign up</button>
    <p class="status" role="status"></p>
  `;
  const email = form.querySelector('#email');
  const password = form.querySelector('#password');
  const button = form.querySelector('button');
  const status = form.querySelector('[role="status"]');

  const valid = () => email.value.includes('@') && password.value.length >= 8;
  form.addEventListener('input', () => { button.disabled = !valid(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;
    status.textContent = 'Creating your account…';
    try {
      await onSubmit({ email: email.value });
      status.textContent = `Welcome, ${email.value}!`;
    } catch (err) {
      status.textContent = '';
      const alert = document.createElement('p');
      alert.setAttribute('role', 'alert');
      alert.textContent = `Sign-up failed: ${err.message}`;
      form.append(alert);
      button.disabled = false;
    }
  });
  return form;
}
