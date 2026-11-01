import { formatVnd } from './format.js';

// Development-only logging: removed from the production bundle
if (import.meta.env.DEV) {
  console.log('[dev] app started in mode', import.meta.env.MODE);
}

document.querySelector('#price').textContent = 'Keyboard: ' + formatVnd(450000);

// Public configuration, baked in at BUILD time (must start with VITE_)
document.querySelector('#api').textContent = 'API: ' + import.meta.env.VITE_API_URL;

// ❌ A mistake to learn from: any VITE_* variable the code reads is COPIED into the public bundle
window.__paymentKey = import.meta.env.VITE_PAYMENT_SECRET;
// ✅ Not prefixed with VITE_ ⇒ Vite never exposes it: this is undefined in the browser
window.__dbUrl = import.meta.env.DATABASE_URL;
