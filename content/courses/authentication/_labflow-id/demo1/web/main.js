// demo1/web/main.js — lesson 1.5: what a front-end build does with environment variables.
// Vite replaces import.meta.env.VITE_* with the VALUE at build time; other variables are not exposed.
const payKey = import.meta.env.VITE_PAYMENT_SECRET_KEY; // ← a server secret, given a VITE_ name "to make it work"
const signing = import.meta.env.LFID_SIGNING_KEY; // ← not VITE_*: undefined in the browser

async function payLabFee(amount) {
  return fetch('https://pay.example/v1/charges', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + payKey, 'content-type': 'application/json' },
    body: JSON.stringify({ amount, signedBy: signing ?? null }),
  });
}
document.querySelector('#pay').addEventListener('click', () => payLabFee(50000));
