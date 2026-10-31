// The LabFlow Lite web app (Chapter 7): sign in, then book a lab — or, as an admin, see every booking.
import { useState } from 'react';
import { createClient } from '../api.js';
import { BookingForm } from '../BookingForm.jsx';
import { AdminBookings } from '../AdminBookings.jsx';
import { LoginForm } from './LoginForm.jsx';

const KEY = 'labflow.session';

function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export function App() {
  const [session, setSession] = useState(loadSession);

  function signIn(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
    setSession(next);
  }
  function signOut() {
    localStorage.removeItem(KEY);
    setSession(null);
  }

  if (!session) {
    return (<><header><h1>LabFlow Lite</h1></header><main><LoginForm onLogin={signIn} /></main></>);
  }
  const client = createClient({ token: session.token });
  return (
    <>
      <header>
        <h1>LabFlow Lite</h1>
        <span>Signed in as {session.user.id} ({session.user.role}) <button type="button" onClick={signOut}>Sign out</button></span>
      </header>
      <main>
        {session.user.role === 'ADMIN'
          ? (<><h2>All bookings</h2><AdminBookings client={client} /></>)
          : (<><h2>Book a lab</h2><BookingForm onSubmit={client.createBooking} /></>)}
      </main>
    </>
  );
}
