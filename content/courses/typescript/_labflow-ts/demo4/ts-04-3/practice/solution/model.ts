// Solution: the supplier's code is a different fact, so it gets a different name. Equipment keeps a numeric id.
interface Entity { readonly id: number; readonly createdAt: string }
interface Lab extends Entity { code: string; capacity: number }
interface Equipment extends Entity { supplierCode: string; labCode: string; name: string }

const lab: Lab = { id: 1, createdAt: '2026-11-01', code: 'AL-301', capacity: 30 };
const gpu: Equipment = { id: 42, supplierCode: 'EQ-0042', createdAt: '2026-11-01', labCode: 'AL-301', name: 'GPU server' };
console.log(lab.code, gpu.supplierCode, gpu.id);
