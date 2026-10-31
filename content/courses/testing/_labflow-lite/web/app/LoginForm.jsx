// Sign in with a demo account. The API answers { token, user } or 401.
import { useState } from 'react';

export function LoginForm({ onLogin, send = (...args) => fetch(...args) }) {
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await send('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.get('username'), password: form.get('password') }),
      });
      if (res.status === 200) onLogin(await res.json());
      else setError('Wrong username or password.');
    } catch {
      setError('Cannot reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form aria-label="Sign in" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p><label htmlFor="login-username">Username</label><input id="login-username" name="username" autoComplete="username" /></p>
      <p><label htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" /></p>
      <button type="submit" disabled={busy}>Sign in</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
