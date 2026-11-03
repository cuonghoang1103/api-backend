// demo10/mfa-fatigue.mjs — MFA fatigue (push bombing), and the one change that stops it (Chapter 10, 10.4).
// The attacker already has the victim's password (from a dump). A push-approval second factor sends "Approve this
// login?" to the victim's phone. The attacker fires it over and over; eventually a tired or confused victim taps
// Approve. The fix is NOT more prompts — it is NUMBER MATCHING: the login screen (the attacker's) shows a two-digit
// number, and the victim must TYPE it into the phone. The victim never sees the attacker's number, so tapping or
// guessing does not match. We model a stream of spam pushes with a victim who, worn down, eventually approves once.
function victimEventuallyApproves(pushCount) {
  // After enough spam, the victim taps Approve on ONE prompt (and, under number-matching, types their best guess).
  return pushCount >= 12;        // measured threshold for this model
}
function run(mode) {
  const ATTACKER_NUMBER = 42;    // shown only on the attacker's login screen
  for (let n = 1; n <= 30; n++) {
    if (!victimEventuallyApproves(n)) continue;
    if (mode === 'accept-any') return { pushes: n, attackerIn: true, how: 'the victim tapped Approve on prompt ' + n };
    // number-matching: the victim types a guess; it must equal the attacker's hidden number.
    const victimGuess = Math.floor(Math.random() * 100);          // the victim cannot see 42
    if (victimGuess === ATTACKER_NUMBER) return { pushes: n, attackerIn: true, how: 'a 1-in-100 lucky guess' };
    return { pushes: n, attackerIn: false, how: `the victim typed ${victimGuess}, not the attacker's hidden ${ATTACKER_NUMBER}` };
  }
  return { pushes: 30, attackerIn: false, how: 'never approved' };
}
console.log('Push bombing: attacker has the password, spams "Approve this login?" to the victim.\n');
const a = run('accept-any');
console.log(`A) Tap-to-approve  → pushes ${a.pushes} · attacker ${a.attackerIn ? 'IN' : 'out'}  (${a.how})`);
let wins = 0; for (let i = 0; i < 1000; i++) if (run('number-match').attackerIn) wins++;
console.log(`B) Number matching → over 1000 fatigue events, attacker got in ${wins}×  (only on a 1-in-100 guess of the hidden number)`);
console.log('\n⇒ Tap-to-approve turns a tired human into the bypass. Number matching makes "just tap yes" useless: the');
console.log('  victim must read a number off the ATTACKER\'s screen, which they never see. Also rate-limit prompts and');
console.log('  show WHERE the login is from. The help desk and the phone carrier are the other two human channels (10.4).');
