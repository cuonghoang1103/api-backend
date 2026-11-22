// plant.mjs — the domain model, plain JavaScript, no framework
const DAY = 24 * 60 * 60 * 1000;

export function createPlant({ name, species, everyDays }) {
  if (typeof name !== 'string' || name.trim().length < 2) throw new Error('name must have at least 2 characters');
  if (!Number.isInteger(everyDays) || everyDays < 1) throw new Error('everyDays must be an integer >= 1');
  return Object.freeze({ id: crypto.randomUUID(), name: name.trim(), species: species ?? null, everyDays });
}

export function nextWatering(plant, lastWateredAt) {
  return new Date(lastWateredAt.getTime() + plant.everyDays * DAY);
}

export function isThirsty(plant, lastWateredAt, now = new Date()) {
  return nextWatering(plant, lastWateredAt) <= now;
}
