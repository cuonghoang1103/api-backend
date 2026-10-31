// Call fn up to `attempts` times; wait delayMs, then 2 × delayMs, … between attempts.
export async function retry(fn, { attempts = 3, delayMs = 1000 } = {}) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn(i);
    } catch (err) {
      lastError = err;
      if (i < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs * i));
    }
  }
  throw lastError;
}
