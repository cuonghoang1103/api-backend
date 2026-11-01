import { isLab } from './check.ts';
import type { LabCode } from '../derive/labs.ts';

// What a request might send: /schedule?lab=...
for (const query of ['lab=BE-201', 'lab=AL-301', 'lab=be-201', 'lab=BE-999', '']) {
  const text = new URLSearchParams(query).get('lab') ?? '';
  if (isLab(text)) {
    const lab: LabCode = text;                 // allowed: the guard proved it
    console.log('?' + query, '→ schedule of', lab);
  } else {
    console.log('?' + query, '→ 400 unknown lab "' + text + '"');
  }
}
