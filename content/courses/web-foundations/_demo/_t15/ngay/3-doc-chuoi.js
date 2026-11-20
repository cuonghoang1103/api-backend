// Same-looking strings, different instants.
const show = (label, d) => {
  if (d === null) return console.log(label.padEnd(36) + 'null (rejected)');
  if (isNaN(d)) return console.log(label.padEnd(36) + 'Invalid Date');
  console.log(label.padEnd(36) + d.toString().slice(0, 24) + '  | UTC ' + d.toISOString());
};
show("new Date('2026-11-20')", new Date('2026-11-20'));            // date only ⇒ read as UTC
show("new Date('2026-11-20T00:00')", new Date('2026-11-20T00:00')); // date + time ⇒ read as LOCAL
show("new Date('2026-11-20T00:00Z')", new Date('2026-11-20T00:00Z'));
show("new Date('2026-11-20T00:00+07:00')", new Date('2026-11-20T00:00+07:00'));
show("new Date('20/11/2026')", new Date('20/11/2026'));            // Vietnamese order: not a format JS knows

// dd/MM/yyyy is YOUR format — parse it yourself, and refuse what does not exist.
function parseVN(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!m) return null;
  const [, dd, mm, yyyy] = m.map(Number);
  const d = new Date(yyyy, mm - 1, dd);                            // local midnight
  return d.getMonth() === mm - 1 && d.getDate() === dd ? d : null;
}
show("parseVN('20/11/2026')", parseVN('20/11/2026'));
show("parseVN('31/02/2026')", parseVN('31/02/2026'));
