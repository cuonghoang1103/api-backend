// demo12/shapes.mjs — eight shapes of failure, and what each one means (Chapter 12, 12.2). The PATTERN of who is
// affected and when points at the cause faster than any single error message.
const SHAPES = [
  ['Everyone logged out at once', 'the signing key or session secret changed with no overlap — a bad rotation (11.2)'],
  ['Only NEW logins fail, old sessions work', 'the signing key is broken/misconfigured; verification of old tokens still works'],
  ['Works, then 401 after ~15 minutes', 'the access token expired and refresh is broken — the /auth/refresh gap (Chapter 5)'],
  ['Works in Postman, fails in the browser', 'a cookie problem — SameSite, Secure on http, or CORS credentials (Chapter 3)'],
  ['One specific user cannot log in', 'that account: a locked/needs-rehash hash, unverified email, or a wrong password (Chapters 2/6)'],
  ['Intermittent 401 on the same token', 'instances disagree — different keys per node, or an unshared session/rate store (Chapter 11)'],
  ['Login succeeds but every API call is 401', 'the token is not forwarded, or its audience is wrong — client wiring, not the login (Chapter 8)'],
  ['5xx on login under load', 'a dependency is down or saturated — the database, Redis, or a missing secret (Chapter 11)'],
];
console.log('Eight shapes of failure — match the pattern to the cause:\n');
for (const [shape, cause] of SHAPES) console.log(`  • ${shape}\n      ⇒ ${cause}\n`);
console.log('⇒ Read the SHAPE first: who is affected (everyone / new logins / one user) and when (immediately / after 15');
console.log('  minutes / only in the browser). The shape names the chapter to open before you read a single stack trace.');
