// Step 1: the type now says what is true. Nothing else changed yet.
type User = {
  readonly id: number;
  email: string;
  name: string;
  studentCode?: string; // only students have one
};

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', studentCode: 'he176322' };
const binh: User = { id: 2, email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh' };
an.id = 99; // an id must never change

for (const u of [an, binh]) console.log(u.name, '-', u.studentCode.toUpperCase());
