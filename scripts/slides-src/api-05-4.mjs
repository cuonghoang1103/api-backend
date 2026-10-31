/**
 * api-05-4 — API Design · Chapter 5 · Lesson 5.4 "Concurrency: optimistic locking and ETags" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s05-tin-cay.mjs › api-5-4-dong-thoi. Output = chạy thật LabFlow Ch5.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 5 — Reliability: idempotency, retries, rate limits', bai: '5.4' };

export const deck = { key: 'api-05-4', code: 'API 5.4', title: 'Concurrency: ETags and If-Match', sub: 'Optimistic locking — 412 instead of a lost update' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Concurrency: optimistic<br>locking and ETags', sub: 'Laptop and phone edit the same device.<br>The second save wipes the first.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>lost update</b>, reproduced on LabFlow</li>
<li>Optimistic vs pessimistic locking</li>
<li>Strong <code class="i">ETag</code> from a version · <code class="i">If-Match</code> ⇒ <b>412</b></li>
<li>A bonus from the same tag: <code class="i">If-None-Match</code> ⇒ <b>304</b></li>
<li>Why LabFlow does not require If-Match (yet): 428 vs breaking changes</li>
</ul>` },

  { t: 'The experiment: two windows, no protection', to: true, body: http(`$ curl -si http://localhost:4000/v2/devices/dev_3 | grep -E '^(HTTP|ETag)'
HTTP/1.1 200 OK
ETag: "dev_3-v1"

# laptop
$ curl -s -X PATCH …/v2/devices/dev_3 -H 'Authorization: Bearer tok_lan' -H 'Content-Type: application/merge-patch+json' -d '{"note":"Đã thay thẻ nhớ 32 GB"}' | jq -c '{note, status}'
{"note":"Đã thay thẻ nhớ 32 GB","status":"AVAILABLE"}

# phone, still showing the old page
$ curl -s -X PATCH …/v2/devices/dev_3 -H 'Authorization: Bearer tok_lan' -H 'Content-Type: application/merge-patch+json' -d '{"status":"MAINTENANCE","note":"Thiếu thẻ nhớ, chờ mua"}' | jq -c '{note, status}'
{"note":"Thiếu thẻ nhớ, chờ mua","status":"MAINTENANCE"}`, { wrap: true, sm: true }) + two(box('Lost update', 'Both 200. “Memory card replaced” is gone, and nobody was told.', 'do2'), box('Every shared resource', 'Any API where two people can edit the same thing has this bug until it is designed away.', 'lam')) },

  { t: 'Optimistic locking with ETags', body: two(sql(`// concurrency.js
export const etagOf = (r) => \`"\${r.id}-v\${r.version ?? 1}"\`;

export function checkIfMatch(req, record) {
  const im = req.get('If-Match');
  if (im === undefined) return;    // optional (v1/v2)
  const ok = im.trim() === '*' || im.split(',')
    .map((s) => s.trim()).includes(etagOf(record));
  if (!ok) throw new HttpError(412,
    'PRECONDITION_FAILED', { current: etagOf(record) },
    { currentETag: etagOf(record) });
}

export function bump(res, record) {
  record.version = (record.version ?? 1) + 1;
  res.set('ETag', etagOf(record));
}`, { lang: 'javascript', sm: true, hl: [2, 9, 14] }), sql(`// routes/devices.js
  .get((req, res) => {
    const d = findDevice(req.params.id);
    res.set('ETag', etagOf(d));
    res.json(viewsOf(req).device(d));
  })
  .patch(...manager, validate('body', PATCH),
    (req, res) => {
    const d = findDevice(req.params.id);
    checkIfMatch(req, d);     // old copy ⇒ 412
    // … merge patch (lesson 1.2) …
    bump(res, d);             // version + 1
    res.json(viewsOf(req).device(d));
  })`, { lang: 'javascript', sm: true, hl: [10, 12] }) + box('Optimistic', 'Everyone may edit; the check happens at <b>save</b> time. Pessimistic locking would block the record while someone edits.', 'xanh'), 'r46') },

  { t: 'Try it: with If-Match', body: two(http(`$ curl -si …/v2/devices/dev_3 | grep -E '^(HTTP|ETag)'
HTTP/1.1 200 OK
ETag: "dev_3-v1"

# laptop
$ curl -si -X PATCH …/v2/devices/dev_3 … -H 'If-Match: "dev_3-v1"' -d '{"note":"Đã thay thẻ nhớ 32 GB"}' | grep -E '^(HTTP|ETag)'
HTTP/1.1 200 OK
ETag: "dev_3-v2"

# phone, still holding v1
$ curl -si -X PATCH …/v2/devices/dev_3 … -H 'If-Match: "dev_3-v1"' -H 'Accept-Language: en' -d '{"status":"MAINTENANCE",…}'
HTTP/1.1 412 Precondition Failed
{ "title": "The record was changed by someone else", "status": 412,
  "detail": "You are editing an old copy; the current one is \\"dev_3-v2\\" — reload and try again",
  "code": "PRECONDITION_FAILED", "currentETag": "\\"dev_3-v2\\"", … }`, { sm: true, wrap: true, title: 'terminal (problem body re-indented)' }), http(`$ curl -s …/v2/devices/dev_3 | jq -c '{note, status}'
{"note":"Đã thay thẻ nhớ 32 GB","status":"AVAILABLE"}

# phone reloads, merges, saves with v2
$ curl -si -X PATCH …/v2/devices/dev_3 … -H 'If-Match: "dev_3-v2"' -d '{"status":"MAINTENANCE"}' | grep -E '^(HTTP|ETag)'
HTTP/1.1 200 OK
ETag: "dev_3-v3"`, { sm: true, wrap: true }) + box('Nothing lost', 'The conflict became <b>visible</b>: the phone learns it is behind and merges.', 'xanh'), 'r46') },

  { t: 'Bonus: 304, and should If-Match be required?', to: true, body: two(http(`$ curl -si …/v2/devices/dev_3 -H 'If-None-Match: "dev_3-v3"' | grep -E '^(HTTP|ETag|Content-Length)'
HTTP/1.1 304 Not Modified
ETag: "dev_3-v3"

$ curl -si …/v2/devices/dev_3 -H 'If-None-Match: "dev_3-v1"' | grep -E '^(HTTP|ETag)'
HTTP/1.1 200 OK
ETag: "dev_3-v3"`, { sm: true, wrap: true }) + box('Free with the tag', 'Express answers 304 with no body once the ETag header is set.', 'xanh') + box('One tag, two jobs', '<code class="i">If-Match</code> guards writes (412) · <code class="i">If-None-Match</code> saves reads (304).', 'lam'), box('428 Precondition Required', 'RFC 6585 lets a server <b>require</b> conditional writes.', 'lam') +
  box('LabFlow keeps it optional', 'Requiring If-Match now breaks every v1/v2 client that never sent it — a breaking change (4.1). New endpoints or a v3 can require it from day one.', 'do2') +
  box('In the client', 'Keep the ETag next to the data you show; send it back with every save.', 'xanh'), 'r46') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ Weak ETags for writes', 'Express’s automatic ETags are weak (<code class="i">W/"…"</code>); If-Match compares strongly (RFC 9110). ✓ Your own strong tag from the version.'],
    ['✗ Check and update in two queries', 'Another write can slip in between. ✓ One statement: <code class="i">UPDATE … SET version = version + 1 WHERE id = $1 AND version = $2</code>; 0 rows ⇒ 412.'],
    ['✗ Last write wins “because it is simpler”', 'Simpler until a lab manager loses an hour of notes. ✓ A version column costs one integer.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Two users edit the same record?”', 'Without protection the last write wins silently. Optimistic locking: version per record, ETag, If-Match, 412, update guarded by <code class="i">WHERE version = …</code>.'],
    ['“Optimistic or pessimistic?”', 'Optimistic when conflicts are rare and edits are long (forms); pessimistic locks for short, hot critical sections inside one transaction.'],
    ['“What else does the ETag give you?”', 'Cheap re-reads: If-None-Match ⇒ 304 with no body; caches and CDNs use the same tag.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Measured: two unprotected PATCHes, both 200, the first change <b>vanished</b></li>
<li>Version ⇒ strong <b>ETag</b>; save with <b>If-Match</b>; old copy ⇒ <b>412</b>, nothing changed</li>
<li>The same tag gives <b>304 Not Modified</b></li>
<li>Optional on existing endpoints — requiring it (428) would break clients</li>
<li>In SQL: check and update in one guarded statement</li>
</ul>
${box('Next', 'Lab 5 — issue reporting that survives the basement.', 'xanh')}` },
]);
