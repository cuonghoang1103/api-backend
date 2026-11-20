// cho: 1200
let requests = 0;
async function* allProducts(firstUrl, maxPages = 50) {
  let url = firstUrl;
  let pages = 0;
  while (url) {
    if (++pages > maxPages) throw new Error('Stopped after ' + maxPages + ' pages — is the "next" link looping?');
    requests++;
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
    const body = await res.json();
    yield* body.items;                     // hand out the items one by one
    url = body.next;
  }
}

(async () => {
  const all = [];
  for await (const id of allProducts('/15-3/page-1.json')) all.push(id);
  console.log('all products →', all, '| requests: ' + requests);

  requests = 0;
  for await (const id of allProducts('/15-3/page-1.json')) {
    if (id === 5) { console.log('found product 5 — stop'); break; }   // break ⇒ the generator stops too
  }
  console.log('requests made before stopping: ' + requests + ' (page 3 was never downloaded)');

  requests = 0;
  try {
    for await (const id of allProducts('/15-3/loop-a.json', 10)) { /* a server bug or a hostile API */ }
  } catch (err) {
    console.log(err.message + ' | requests: ' + requests);
  }
})();
