// The one required check (lesson 9.3): decides from the results of the jobs it needs whether a pull request may merge.
// needs = the toJSON(needs) context of the gate job: { unit: { result: 'success', outputs: {} }, … }
// required = the jobs that must have passed. Anything but 'success' blocks: failure, cancelled — and skipped,
// because on GitHub a skipped required check counts as passed.
export function decideMerge(needs, required) {
  const problems = [];
  for (const job of required) {
    const result = needs[job]?.result;
    if (result === undefined) problems.push(job + ': not in needs');
    else if (result !== 'success') problems.push(job + ': ' + result);
  }
  return { ok: problems.length === 0, problems };
}
