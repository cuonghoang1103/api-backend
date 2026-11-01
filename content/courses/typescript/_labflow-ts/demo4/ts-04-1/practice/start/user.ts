// A teammate's User type. One line is refused; one wrong line is not.
type User = {
  id: number;
  email: string;
  name: string;
  studentCode: string; // students have one; lecturers do not
};

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', studentCode: 'he176322' };
const binh: User = { id: 2, email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh' };
an.id = 99; // an id must never change

for (const u of [an, binh]) console.log(u.name, '-', u.studentCode.toUpperCase());
