import { isLab } from './check.ts';

for (const lab of ['BE-201', 'AL-301', 'BE-999']) {
  console.log('?lab=' + lab, '→', isLab(lab) ? 'accepted' : 'refused');
}
