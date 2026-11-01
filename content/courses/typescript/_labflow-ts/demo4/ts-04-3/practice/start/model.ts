// A teammate composed the model with &. It compiles. Then the seed fails — on a line that looks correct.
type Entity = { readonly id: number; readonly createdAt: string };
type Lab = Entity & { code: string; capacity: number };
type Equipment = Entity & { id: string; labCode: string; name: string }; // ids from the supplier: "EQ-0042"

const lab: Lab = { id: 1, createdAt: '2026-11-01', code: 'AL-301', capacity: 30 };
const gpu: Equipment = { id: 'EQ-0042', createdAt: '2026-11-01', labCode: 'AL-301', name: 'GPU server' };
export { lab, gpu };
