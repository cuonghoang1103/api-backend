type SlotResult = { ok: true; minutes: number } | { ok: false; reason: string };
function checkSlot(start: string, end: string): SlotResult {
  return { ok: true, minutes: 120 };
}

// ReturnType reads the result type out of the function — no second declaration to keep in sync.
type Checked = ReturnType<typeof checkSlot>;
const r: Checked = { ok: true, minutes: 120 };
if (r.ok) console.log(r.minutes);
