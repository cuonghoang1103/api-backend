// Step 1: the same model with interfaces. Now tsc points at the cause.
interface Entity { readonly id: number; readonly createdAt: string }
interface Lab extends Entity { code: string; capacity: number }
interface Equipment extends Entity { id: string; labCode: string; name: string } // ids from the supplier: "EQ-0042"

const lab: Lab = { id: 1, createdAt: '2026-11-01', code: 'AL-301', capacity: 30 };
const gpu: Equipment = { id: 'EQ-0042', createdAt: '2026-11-01', labCode: 'AL-301', name: 'GPU server' };
export { lab, gpu };
