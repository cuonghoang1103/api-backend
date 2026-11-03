// Reads the temperature from our API. fetchFn is a parameter so tests can pass a fake.
export async function getTemperature(city, fetchFn = fetch) {
  const url = '/api/weather?city=' + encodeURIComponent(city);
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`weather service failed: ${res.status}`);
  const data = await res.json();
  return data.tempC;
}
