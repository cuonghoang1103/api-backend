// Literal types written by hand: a type that is exactly one value, or a short list of values.
type Step = 15 | 30 | 60;                  // the grid sizes LabFlow supports

let step: Step = 30;
step = 45;                                 // 45 is a number, but not one of these three

type SlotOk = { ok: true; minutes: number };
const good: SlotOk = { ok: true, minutes: 120 };
const bad: SlotOk = { ok: false, minutes: 0 };   // false is not the literal true

export { step, good, bad };
