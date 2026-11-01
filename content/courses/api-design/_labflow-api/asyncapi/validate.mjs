// asyncapi/validate.mjs — kiểm tài liệu AsyncAPI bằng parser chính thức: node asyncapi/validate.mjs [tệp]
import { Parser, fromFile } from '@asyncapi/parser';

const file = process.argv[2] ?? new URL('./asyncapi.yaml', import.meta.url).pathname;
const { document, diagnostics } = await fromFile(new Parser(), file).parse();
const SEV = ['error', 'warning', 'info', 'hint'];
for (const d of diagnostics) console.log(`${SEV[d.severity].padEnd(7)} ${d.code}: ${d.message} @ ${d.path.join('.') || '/'}`);
if (!document) { console.log('⇒ KHÔNG hợp lệ'); process.exit(1); }
const msgs = document.allMessages().all().map((m) => m.name());
console.log(`⇒ hợp lệ: AsyncAPI ${document.version()}, ${document.channels().length} kênh, ${msgs.length} thông điệp: ${msgs.join(', ')}`);
