/** PRO192 · L.5 🎓 LAB211 J1.S.P0071 Task Management (150 LOC) — không service, kiểm ID ở repository, ngày thật, giờ bước 0.5. Nguồn: gen/lab/l211-p0071. */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('l211-p0071', {
  tieuDe: { en: 'L.5 — LAB211 J1.S.P0071: Task Management', vi: 'L.5 — LAB211 J1.S.P0071: Quản lý task' },
  phut: 150,
  khaiNiem: ['enum with constants only: TaskType.values()[i - 1]', 'a real date dd-MM-yyyy (setLenient(false) / ResolverStyle.STRICT)', 'times 8.0–17.5 by half hours, From < To', 'ID = last ID + 1', 'no service when there is no business rule'],
  moTa: {
    en: `<p><b>J1.S.P0071 (150 LOC).</b> Menu 1 Add Task · 2 Delete task · 3 Display Task · 4 exit. <b>Add</b>: Requirement Name (not blank), Task Type 1–4 (1 Code, 2 Test, 3 Design, 4 Review — the list is printed before the prompt), Date ${c('dd-MM-yyyy')} that really exists (${c('31-02-2015')} and ${c('1-2-2015')} are refused), From 8.0–17.0 and To up to 17.5, both in steps of 0.5 with To after From, Assignee and Reviewer (letters without accents, digits, spaces). The new task gets ID = last ID + 1 (the first gets 1) and the program prints it. <b>Delete</b>: a whole number ≥ 1 that is an existing ID. <b>Display</b>: the table by ascending ID, with ${c('Time = To − From')}. An empty list says so and points to option 1.</p>
<p>The brief names ${c('addTask')} (returns the id), ${c('deleteTask')} and ${c('getDataTasks')}. There is <b>no service</b> in this project — the lecturer’s remark on 24/10: a layer without business work is not added; whether an ID exists is checked in ${c('TaskRepository')}. Rule of 29/10: the enum ${c('TaskType')} holds only its constants (no id, no name field, no lookup method) — number i is ${c('TaskType.values()[i - 1]')}.</p>`,
    vi: `<p><b>J1.S.P0071 (150 LOC).</b> Menu 1 Add Task · 2 Delete task · 3 Display Task · 4 exit. <b>Add</b>: Requirement Name (không trống), Task Type 1–4 (1 Code, 2 Test, 3 Design, 4 Review — in danh sách trước lời nhắc), Date ${c('dd-MM-yyyy')} là ngày có thật (${c('31-02-2015')} và ${c('1-2-2015')} bị từ chối), From 8.0–17.0 và To tới 17.5, cả hai theo bước 0.5 và To sau From, Assignee và Reviewer (chữ không dấu, số, dấu cách). Task mới có ID = ID cuối + 1 (cái đầu được 1) và chương trình in ID đó. <b>Delete</b>: số nguyên ≥ 1 là một ID đang có. <b>Display</b>: bảng tăng dần theo ID, ${c('Time = To − From')}. Danh sách trống thì báo trống và chỉ sang chức năng 1.</p>
<p>Đề nêu tên ${c('addTask')} (trả về id), ${c('deleteTask')} và ${c('getDataTasks')}. Dự án này <b>không có service</b> — nhận xét của thầy ngày 24/10: tầng không có nghiệp vụ thì không thêm; ID có hay không được kiểm ở ${c('TaskRepository')}. Luật ngày 29/10: enum ${c('TaskType')} chỉ chứa hằng (không trường id, name, không hàm tra cứu) — số i là ${c('TaskType.values()[i - 1]')}.</p>`,
  },
  thay: [['Nguyen Van Thanh Hai Program', 'Report Module'], ['Dev Program', 'Login Screen'], ['Nguyen Van Thanh Hai', 'Tran Thi B'], ['26-06-2015', '29-02-2016'], ['28-08-2015', '31-12-2015']],
  menuRac: '3', menuThoat: '4',
  ca: [
    { ten: { en: '29-02-2015 refused, 29-02-2016 accepted, 17.0 → 17.5, To before From asked again, delete the middle task, the next ID is last + 1', vi: '29-02-2015 bị từ chối, 29-02-2016 nhận, 17.0 → 17.5, To trước From hỏi lại, xoá task giữa, ID kế tiếp là ID cuối + 1' }, vao: '1\nA\n4\n29-02-2015\n29-02-2016\n17\n17.5\nX\nY\n1\nB\n1\n01-01-2020\n8\n8.5\nX\nY\n1\nC\n2\n02-01-2020\n12.5\n12\n13\nX\nY\n2\n2\n1\nD\n3\n03-01-2020\n9\n10\nX\nY\n3\n2\n4\n3\n4\n', an: true },
  ],
  goiY: [
    { en: 'Date: SimpleDateFormat with setLenient(false) plus a regex \\d{2}-\\d{2}-\\d{4} (so 1-2-2015 is refused), or DateTimeFormatter "dd-MM-uuuu" with ResolverStyle.STRICT.', vi: 'Ngày: SimpleDateFormat với setLenient(false) kèm regex \\d{2}-\\d{2}-\\d{4} (để 1-2-2015 bị từ chối), hoặc DateTimeFormatter "dd-MM-uuuu" với ResolverStyle.STRICT.' },
    { en: 'Half hours: value * 2 must be a whole number — (value * 2) % 1 == 0.', vi: 'Nửa tiếng: giá trị × 2 phải là số nguyên — (value * 2) % 1 == 0.' },
    { en: 'ID: the list is in ascending ID order, so the last element holds the largest ID even after deletes.', vi: 'ID: danh sách theo thứ tự ID tăng dần, nên phần tử cuối giữ ID lớn nhất kể cả sau khi xoá.' },
  ],
  loiHayGap: [
    { en: 'if (list.add(task)) … else return -1 — ArrayList.add always returns true, the else branch is dead code (the lecturer caught it on 29/10).', vi: 'if (list.add(task)) … else return -1 — ArrayList.add luôn trả true, nhánh else là code chết (thầy bắt ngày 29/10).' },
    { en: 'An enum with id, name, a constructor and getTaskTypeById() — the 29/10 rule: constants only.', vi: 'Enum có id, name, constructor và getTaskTypeById() — luật 29/10: chỉ để hằng.' },
    { en: 'ID = size() + 1 — after deleting task 2 of [1, 2, 3] the next task would get 3 again.', vi: 'ID = size() + 1 — xoá task 2 trong [1, 2, 3] thì task kế tiếp lại được 3.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s P0071 after the 24/10 and 29/10 reviews (no service, ID checked in the repository, enum of constants, List declarations, every error in Vietnamese saying what to retype). It passed lint.py and runs the same on JDK 8.</p>', vi: '<p>Lời giải là P0071 của khoá sau hai buổi review 24/10 và 29/10 (không service, kiểm ID ở repository, enum chỉ hằng, khai báo List, mọi câu lỗi tiếng Việt nói rõ nhập lại thế nào). Sạch lint.py và chạy y hệt trên JDK 8.</p>' },
});

export default moDun({ slug: 'pro192-lab211-p0071-task-management', ten: '10.5 🎓 L.5 LAB211 J1.S.P0071 — Task Management', de: [de] });
