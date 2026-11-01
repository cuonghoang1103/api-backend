// compare-validators.mjs — bài 7.3: cùng một body, kiểm bằng lược đồ trong openapi.yaml (Ajv) và bằng Zod của server
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { BookingCreateV2 } from '../src/schemas.js';

const spec = parse(readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'));
const ajv = addFormats(new Ajv2020({ allErrors: true, strict: false }));
ajv.addSchema({ $id: 'spec', components: spec.components });
const fromSpec = ajv.getSchema('spec#/components/schemas/BookingCreate');

const P = { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' };
const cases = {
  'hợp lệ': { labId: 'lab_1', period: P },
  'gõ sai labID': { labID: 'lab_1', period: P },
  'thêm status': { labId: 'lab_1', period: P, status: 'CHECKED_IN' },
  'giờ không múi giờ': { labId: 'lab_1', period: { ...P, start: '2027-03-02T08:00:00' } },
  'purpose toàn dấu cách': { labId: 'lab_1', period: P, purpose: '   ' },
  'end trước start': { labId: 'lab_1', period: { start: P.end, end: P.start } },
};
const yn = (ok) => (ok ? 'nhận' : 'TỪ CHỐI');
for (const [name, body] of Object.entries(cases)) {
  console.log(`${name.padEnd(24)} spec: ${yn(fromSpec(body)).padEnd(8)} zod: ${yn(BookingCreateV2.safeParse(body).success)}`);
}
