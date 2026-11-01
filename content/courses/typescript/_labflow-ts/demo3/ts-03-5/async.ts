// Q9 an async function in a void callback slot
type Problem = { code: string; message: string };
function validate(onProblem: (p: Problem) => void): void {
  onProblem({ code: 'TOO_LONG', message: 'At most 4 hours' });
  console.log('validate finished');
}
async function saveToAuditLog(p: Problem): Promise<void> {
  throw new Error('audit database is down (' + p.code + ')');
}
validate(saveToAuditLog);
console.log('request handled');
