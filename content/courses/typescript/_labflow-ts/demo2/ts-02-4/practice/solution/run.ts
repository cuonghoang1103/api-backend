import { parseStep } from './step.ts';

for (const query of ['step=30', 'step=45', 'step=abc']) {
  const text = new URLSearchParams(query).get('step') ?? '';
  try {
    console.log('?' + query, '→ grid of', parseStep(text), 'minutes');
  } catch (e) {
    console.log('?' + query, '→', String(e));
  }
}
