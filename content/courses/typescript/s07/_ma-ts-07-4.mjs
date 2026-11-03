/**
 * _ma (bài 7.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "namesNames": `type BookingAction = 'created' | 'confirmed' | 'cancelled';

// A template literal type builds strings from other types. Each action becomes "booking:<action>".
type BookingEvent = \`booking:\${BookingAction}\`; // 'booking:created' | 'booking:confirmed' | 'booking:cancelled'

const e1: BookingEvent = 'booking:created';
const e2: BookingEvent = 'booking:cancelled';
console.log(e1, e2);`,
  "combosGrid": `type Section = 'hero' | 'footer';
type Lang = 'en' | 'vi';

// Two unions in one template → every combination: 2 x 2 = 4 keys.
type MessageKey = \`\${Section}.\${Lang}\`; // 'hero.en' | 'hero.vi' | 'footer.en' | 'footer.vi'

const messages: Record<MessageKey, string> = {
  'hero.en': 'Welcome', 'hero.vi': 'Chào mừng',
  'footer.en': 'Bye', 'footer.vi': 'Tạm biệt',
};
console.log(messages['hero.vi']);`,
  "intrinsicLoud": `// Built-in template helpers transform the string type itself.
type Upper = Uppercase<'be-201'>;      // 'BE-201'
type Cap = Capitalize<'created'>;      // 'Created'
type Getter = \`get\${Capitalize<'code'>}\`; // 'getCode'

const u: Upper = 'BE-201';
const c: Cap = 'Created';
const g: Getter = 'getCode';
console.log(u, c, g);`,
  "keyremapGetters": `type Lab = { code: string; capacity: number };

// Remap each key K to "get<Key>" with \`as\`, and the value to a function returning the field.
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K];
};

const lab: Getters<Lab> = {
  getCode: () => 'BE-201',
  getCapacity: () => 40,
};
console.log(lab.getCode(), lab.getCapacity());`,
  "typoName": `type BookingAction = 'created' | 'confirmed' | 'cancelled';
type BookingEvent = \`booking:\${BookingAction}\`;

const bad: BookingEvent = 'booking:creatd'; // a typo in the action
export { bad };`,
  "prStart": `type Resource = 'lab' | 'booking' | 'user';
type Method = 'get' | 'create' | 'delete';

// permissionKey should be "<resource>:<method>", but it is typed string, so any string slips.
export type PermissionKey = string;

const ok: PermissionKey = 'lab:get';
const bad: PermissionKey = 'labget';   // no separator — should be a type error, but string accepts it
export { ok, bad };`,
  "prSol": `type Resource = 'lab' | 'booking' | 'user';
type Method = 'get' | 'create' | 'delete';

export type PermissionKey = \`\${Resource}:\${Method}\`;

const ok: PermissionKey = 'lab:get';
const another: PermissionKey = 'booking:delete';
console.log(ok, another);`,
};
export const OUT = {
  '11-names': `$ npx tsc -p demo7/ts-07-4/names && node demo7/ts-07-4/names/names.ts
booking:created booking:cancelled`,
  '12-combos': `$ npx tsc -p demo7/ts-07-4/combos && node demo7/ts-07-4/combos/grid.ts
Chào mừng`,
  '13-intrinsic': `$ npx tsc -p demo7/ts-07-4/intrinsic && node demo7/ts-07-4/intrinsic/loud.ts
BE-201 Created getCode`,
  '14-keyremap': `$ npx tsc -p demo7/ts-07-4/keyremap && node demo7/ts-07-4/keyremap/getters.ts
BE-201 40`,
  '15-typo': `$ npx tsc -p demo7/ts-07-4/typo
demo7/ts-07-4/typo/name.ts(4,7): error TS2820: Type '"booking:creatd"' is not assignable to type '"booking:cancelled" | "booking:confirmed" | "booking:created"'. Did you mean '"booking:created"'?`,
  '16-pr-start': `$ npx tsc -p demo7/ts-07-4/practice/start`,
  '17-pr-step1': `$ npx tsc -p demo7/ts-07-4/practice/step1
demo7/ts-07-4/practice/step1/key.ts(7,7): error TS2820: Type '"labget"' is not assignable to type '"booking:create" | "booking:delete" | "booking:get" | "lab:create" | "lab:delete" | "lab:get" | "user:create" | "user:delete" | "user:get"'. Did you mean '"lab:get"'?`,
  '18-pr-sol': `$ npx tsc -p demo7/ts-07-4/practice/solution && node demo7/ts-07-4/practice/solution/key.ts
lab:get booking:delete`,
};
