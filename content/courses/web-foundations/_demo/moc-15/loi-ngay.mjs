// cho: 1500
// Milestone 15 starter: errors with a kind and a cause, one place that turns them into
// user messages, dates stored in UTC and shown in the user's zone, listeners that clean up.
class AppError extends Error {
  constructor(message, options) { super(message, options); this.name = this.constructor.name; }
}
class HttpError extends AppError {
  constructor(status, url) { super('HTTP ' + status + ' for ' + url); this.status = status; }
}
class NetworkError extends AppError {}

async function fetchJson(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new NetworkError('Cannot reach ' + url, { cause: err });   // keep the original error
  }
  if (!res.ok) throw new HttpError(res.status, url);
  return res.json();
}

// The ONLY place that decides what the user reads.
function userMessage(err) {
  if (err instanceof HttpError && err.status === 404) return 'This recipe no longer exists.';
  if (err instanceof HttpError && err.status >= 500) return 'The server has a problem. Please try again in a minute.';
  if (err instanceof NetworkError) return 'You seem to be offline. Check your connection.';
  return 'Something went wrong.';
}

for (const url of ['/moc-5/data/recipes.json', '/moc-5/data/missing.json', 'http://127.0.0.1:9/recipes']) {
  try {
    const data = await fetchJson(url);
    console.log('OK', url, '->', data.length, 'recipes');
  } catch (err) {
    console.log(err.name + ': ' + err.message + (err.cause ? ' | cause: ' + err.cause.name + ': ' + err.cause.message : ''));
    console.log('  user sees:', userMessage(err));
  }
}

// Dates: the server stores an instant in UTC; the page shows it in the user's time zone.
const createdAt = '2026-11-21T17:30:00Z';
const show = (iso, timeZone) => new Intl.DateTimeFormat('en-GB', { timeZone, dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
console.log('stored:', createdAt);
console.log('Hanoi user sees:', show(createdAt, 'Asia/Ho_Chi_Minh'));
console.log('New York user sees:', show(createdAt, 'America/New_York'));
console.log('WRONG "date" via toISOString().slice(0, 10):', new Date(createdAt).toISOString().slice(0, 10), '(the Hanoi calendar already says 22/11)');

// Listeners: one AbortController removes them all when the screen closes.
let clicks = 0;
const controller = new AbortController();
for (let i = 0; i < 3; i++) document.addEventListener('click', () => clicks++, { signal: controller.signal });
document.body.click();
controller.abort();
document.body.click();
console.log('clicks counted:', clicks, '(3 listeners x 1 click before abort, 0 after)');

window.addEventListener('unhandledrejection', (event) => console.log('safety net caught:', event.reason.message));
fetchJson('/moc-5/data/nope.json');   // forgot await + catch: the global handler reports it instead of silence
