// What does true, false mean at the call site? Nobody can tell — and swapping them compiles.
function book(lab: string, notifyLecturer: boolean, allowWaitlist: boolean): string {
  return lab + (notifyLecturer ? ' · e-mail the lecturer' : '') + (allowWaitlist ? ' · waitlist if full' : '');
}

console.log(book('BE-201', true, false));   // what the author meant
console.log(book('BE-201', false, true));   // a teammate's call, arguments swapped by mistake
