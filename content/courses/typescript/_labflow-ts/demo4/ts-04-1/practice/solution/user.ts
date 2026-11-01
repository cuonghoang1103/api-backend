// Solution: the type says what is true, and the code handles the missing student code.
type User = {
  readonly id: number;
  email: string;
  name: string;
  studentCode?: string; // only students have one
};

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', studentCode: 'he176322' };
const binh: User = { id: 2, email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh' };

for (const u of [an, binh]) console.log(u.name, '-', u.studentCode?.toUpperCase() ?? '(lecturer)');
