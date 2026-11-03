// Lesson 10.2 — an error inside an async function that nobody awaits or catches
async function loadProfile(id) {
  const res = { ok: false, status: 404 };              // pretend fetch('/api/users/' + id) returned 404
  if (!res.ok) throw new Error('HTTP ' + res.status + ' for user ' + id, { cause: { id } });
  return res;
}
loadProfile(42);                                         // missing await / .catch
console.log('this line still runs first — the rejection arrives later');
