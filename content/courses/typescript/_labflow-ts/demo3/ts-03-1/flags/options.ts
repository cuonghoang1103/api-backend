// One options object: every call names what it switches on, and both keys are optional with defaults.
type BookOptions = { notifyLecturer?: boolean; allowWaitlist?: boolean };

function book(lab: string, { notifyLecturer = false, allowWaitlist = false }: BookOptions = {}): string {
  return lab + (notifyLecturer ? ' · e-mail the lecturer' : '') + (allowWaitlist ? ' · waitlist if full' : '');
}

console.log(book('BE-201', { notifyLecturer: true }));
console.log(book('BE-201'));
book('BE-201', true);
book('BE-201', { notifyLecturr: true });
