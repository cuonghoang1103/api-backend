// AL-302 opens next week: ONE line changes — the data and the type follow it.
export const LABS = ['BE-201', 'BE-202', 'AL-301', 'AL-302'] as const;
export type LabCode = (typeof LABS)[number];

const KNOWN: readonly string[] = LABS;
export function isLab(text: string): text is LabCode {
  return KNOWN.includes(text);
}

for (const lab of ['AL-301', 'AL-302', 'BE-999']) {
  console.log('?lab=' + lab, '→', isLab(lab) ? 'accepted' : 'refused');
}
