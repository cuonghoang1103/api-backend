import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 3: Form (soạn 25/09/2026 từ khung).
 * GIỮ slug khung: rx-3-1-controlled · rx-3-2-react-hook-form · rx-3-3-loi · rx-3-4-tieng-viet (type LESSON). Thêm rx-3-0-slides, rx-3-5-kiem-tra.
 * Mọi output trong bài chạy THẬT 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch03
 * (react 19.3.0 · react-hook-form 7.88.0 · zod 4.6.5 · @hookform/resolvers 5.9.1 · vite 8.3.1 · vitest 5.0.1 ·
 *  typescript 6.0.3 · @testing-library/react 16.3.3 · user-event 14.6.7 · jsdom 30.1.1 · Chromium 141 qua Playwright).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy (tsc -b sạch, vitest xanh).
 * Deck: scripts/slides-src/rx-03.mjs (30 slide). Bộ gõ tiếng Việt trong Bài 3.4 là MÔ PHỎNG (CDP + jsdom) — phần cần bộ gõ
 * thật ghi ⏳ + CHAY-O-MAY.
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch03 (tsc -b sạch + vitest xanh 25/09/2026) — đừng sửa tay ─── */
const SN = {
  khongKiemSoat: "// ── 1. KHÔNG kiểm soát: DOM giữ giá trị, React chỉ đọc khi cần (qua ref) ──\nexport function OTenKhongKiemSoat({ onGui }: { onGui: (ten: string) => void }) {\n  const oTen = useRef<HTMLInputElement>(null);\n  function xuLyGui(e: SubmitEvent<HTMLFormElement>) {\n    e.preventDefault();\n    onGui(oTen.current?.value ?? ''); // ?. : ô chưa gắn thì không đọc; ?? '' : thiếu thì lấy chuỗi rỗng\n  }\n  return (\n    <form onSubmit={xuLyGui}>\n      <label>\n        Họ tên\n        <input ref={oTen} defaultValue=\"Nguyễn Văn A\" />\n      </label>\n      <button type=\"submit\">Gửi</button>\n    </form>\n  );\n}",
  kiemSoat: "// ── 2. KIỂM SOÁT: state của React là nguồn sự thật, ô chỉ hiển thị nó ──\nexport function OTenKiemSoat() {\n  const [ten, setTen] = useState('Nguyễn Văn A');\n  return (\n    <>\n      <label>\n        Họ tên\n        <input value={ten} onChange={(e) => setTen(e.target.value)} />\n      </label>\n      <p>Xin chào, {ten || '(chưa nhập)'}</p>\n    </>\n  );\n}",
  dinhDangSdt: "// ── 3. Chỉ ô kiểm soát mới làm được: sửa giá trị NGAY khi gõ ──\n/** \"0901234567\" → \"0901 234 567\": bỏ mọi thứ không phải số, tối đa 10 số, chèn dấu cách. */\nexport function dinhDangSdt(tho: string): string {\n  const so = tho.replace(/\\D/g, '').slice(0, 10);\n  return [so.slice(0, 4), so.slice(4, 7), so.slice(7)].filter(Boolean).join(' ');\n}\nexport function OSoDienThoai() {\n  const [sdt, setSdt] = useState('');\n  return (\n    <label>\n      Số điện thoại\n      <input value={sdt} onChange={(e) => setSdt(dinhDangSdt(e.target.value))} inputMode=\"numeric\" />\n    </label>\n  );\n}",
  valueKhongOnChange: "// ── 4. Bẫy: value mà không có onChange ⇒ ô chỉ đọc ──\nexport function ValueKhongOnChange() {\n  const [ten] = useState('Nguyễn Văn A');\n  return (\n    <label>\n      Họ tên\n      <input value={ten} />\n    </label>\n  );\n}",
  tuKhongSangCo: "// ── 5. Bẫy: từ không kiểm soát (undefined) chuyển sang kiểm soát ──\nexport function TuKhongSangCo() {\n  const [ten, setTen] = useState<string>(); // ⚠️ không có giá trị đầu ⇒ undefined\n  return (\n    <label>\n      Họ tên\n      <input value={ten} onChange={(e) => setTen(e.target.value)} />\n    </label>\n  );\n}",
  nhieuO: "export function FormNhieuO({ onGui }: { onGui: (bn: BenhNhanNhap) => void }) {\n  const [bn, setBn] = useState(RONG);\n  function xuLyDoi(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {\n    const { name, value } = e.target; // destructuring: lấy hai thuộc tính ra hai biến\n    const giaTri = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value;\n    setBn((cu) => ({ ...cu, [name]: giaTri })); // [name]: tên thuộc tính lấy từ biến\n  }\n  return (\n    <form\n      onSubmit={(e) => {\n        e.preventDefault();\n        onGui(bn);\n      }}\n    >\n      <label>Họ tên <input name=\"hoTen\" value={bn.hoTen} onChange={xuLyDoi} /></label>\n      <label>Số điện thoại <input name=\"soDienThoai\" value={bn.soDienThoai} onChange={xuLyDoi} /></label>\n      <label>\n        Giới tính\n        <select name=\"gioiTinh\" value={bn.gioiTinh} onChange={xuLyDoi}>\n          <option value=\"\">— chọn —</option>\n          <option value=\"nam\">Nam</option>\n          <option value=\"nu\">Nữ</option>\n        </select>\n      </label>\n      <label>\n        <input type=\"checkbox\" name=\"daKhamTruocDay\" checked={bn.daKhamTruocDay} onChange={xuLyDoi} /> Đã từng khám ở đây\n      </label>\n      <label>Lý do <textarea name=\"lyDo\" value={bn.lyDo} onChange={xuLyDoi} /></label>\n      <button type=\"submit\">Gửi</button>\n    </form>\n  );\n}",
  nhieuOHandler: "  function xuLyDoi(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {\n    const { name, value } = e.target; // destructuring: lấy hai thuộc tính ra hai biến\n    const giaTri = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value;\n    setBn((cu) => ({ ...cu, [name]: giaTri })); // [name]: tên thuộc tính lấy từ biến\n  }",
  focusRef: "// ── 7. useRef để ĐƯA FOCUS (việc ref làm tốt nhất) ──\nexport function OTimCoNutXoa() {\n  const [tu, setTu] = useState('');\n  const oTim = useRef<HTMLInputElement>(null);\n  return (\n    <>\n      <label>\n        Tìm bác sĩ\n        <input ref={oTim} value={tu} onChange={(e) => setTu(e.target.value)} />\n      </label>\n      <button\n        type=\"button\"\n        onClick={() => {\n          setTu('');\n          oTim.current?.focus(); // xoá xong đưa con trỏ về ô để gõ tiếp\n        }}\n      >\n        Xoá\n      </button>\n    </>\n  );\n}",
  formData: "// ── 8. Không cần ref cũng không cần state: đọc FormData lúc gửi ──\nexport function FormDocFormData({ onGui }: { onGui: (du: Record<string, FormDataEntryValue>) => void }) {\n  return (\n    <form\n      onSubmit={(e) => {\n        e.preventDefault();\n        const du = Object.fromEntries(new FormData(e.currentTarget)); // mọi ô có name ⇒ một object\n        onGui(du);\n      }}\n    >\n      <label>Họ tên <input name=\"hoTen\" defaultValue=\"\" /></label>\n      <label>Số điện thoại <input name=\"soDienThoai\" defaultValue=\"\" /></label>\n      <button type=\"submit\">Gửi</button>\n    </form>\n  );\n}",
  testDoCommit: "  test('đo: gõ 12 ký tự ⇒ bao nhiêu lần commit?', async () => {\n    const user = userEvent.setup();\n    const dem: Record<string, number> = { kiemSoat: 0, formData: 0 };\n    const onRender: ProfilerOnRenderCallback = (id, phase) => { if (phase === 'update') dem[id]++; };\n    render(\n      <>\n        <Profiler id=\"kiemSoat\" onRender={onRender}><FormNhieuO onGui={() => {}} /></Profiler>\n        <Profiler id=\"formData\" onRender={onRender}><FormDocFormData onGui={() => {}} /></Profiler>\n      </>,\n    );\n    const [o1, o2] = screen.getAllByLabelText('Họ tên');\n    await user.type(o1, 'Nguyễn Văn A');\n    await user.type(o2, 'Nguyễn Văn A');\n    console.info('[commit khi go 12 ky tu]', dem);\n    expect(dem).toEqual({ kiemSoat: 12, formData: 0 });\n  });",
  tuViet: "// ── 1. Kiểu FER202: mỗi ô một state, tự viết hàm kiểm tra ──\nexport function FormTuViet({ onGui }: { onGui: (du: { hoTen: string; soDienThoai: string }) => void }) {\n  const [hoTen, setHoTen] = useState('');\n  const [soDienThoai, setSoDienThoai] = useState('');\n  const [loi, setLoi] = useState<{ hoTen?: string; soDienThoai?: string }>({});\n  function xuLyGui(e: SubmitEvent<HTMLFormElement>) {\n    e.preventDefault();\n    const loiMoi: typeof loi = {};\n    if (hoTen.trim().length < 2) loiMoi.hoTen = 'Họ tên cần ít nhất 2 ký tự';\n    if (!/^0(3|5|7|8|9)\\d{8}$/.test(soDienThoai)) loiMoi.soDienThoai = 'Số điện thoại không hợp lệ';\n    setLoi(loiMoi);\n    if (Object.keys(loiMoi).length === 0) onGui({ hoTen: hoTen.trim(), soDienThoai });\n  }\n  return (\n    <form onSubmit={xuLyGui} noValidate>\n      <label>Họ tên <input value={hoTen} onChange={(e) => setHoTen(e.target.value)} /></label>\n      {loi.hoTen && <p className=\"loi\">{loi.hoTen}</p>}\n      <label>Số điện thoại <input value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} /></label>\n      {loi.soDienThoai && <p className=\"loi\">{loi.soDienThoai}</p>}\n      <button type=\"submit\">Gửi</button>\n    </form>\n  );\n}",
  rhfCoBan: "export function FormRHFCoBan({ onGui }: { onGui: (du: HaiO) => void }) {\n  const { register, handleSubmit, formState: { errors } } = useForm<HaiO>({ defaultValues: { hoTen: '', soDienThoai: '' } });\n  return (\n    <form onSubmit={handleSubmit(onGui)} noValidate>\n      <label>Họ tên <input {...register('hoTen', { required: 'Nhập họ tên', minLength: { value: 2, message: 'Họ tên cần ít nhất 2 ký tự' } })} /></label>\n      {errors.hoTen && <p className=\"loi\">{errors.hoTen.message}</p>}\n      <label>\n        Số điện thoại\n        <input {...register('soDienThoai', { pattern: { value: /^0(3|5|7|8|9)\\d{8}$/, message: 'Số điện thoại không hợp lệ' } })} />\n      </label>\n      {errors.soDienThoai && <p className=\"loi\">{errors.soDienThoai.message}</p>}\n      <button type=\"submit\">Gửi</button>\n    </form>\n  );\n}",
  haiOSchema: "// ── 3. React Hook Form + Zod: luật nằm ở MỘT schema, kiểu suy ra từ schema ──\nexport const haiOSchema = z.object({\n  hoTen: z.string().trim().min(2, 'Họ tên cần ít nhất 2 ký tự'),\n  soDienThoai: z.string().regex(/^0(3|5|7|8|9)\\d{8}$/, 'Số điện thoại không hợp lệ'),\n});\nexport type HaiOZod = z.infer<typeof haiOSchema>;",
  rhfZod: "export function FormRHFZod({ onGui, mode = 'onSubmit', onRender }: { onGui: (du: HaiOZod) => void; mode?: Mode; onRender?: () => void }) {\n  onRender?.();\n  const { register, handleSubmit, formState: { errors } } = useForm({\n    resolver: zodResolver(haiOSchema),\n    defaultValues: { hoTen: '', soDienThoai: '' },\n    mode,\n  });\n  return (\n    <form onSubmit={handleSubmit(onGui)} noValidate>\n      <label>Họ tên <input {...register('hoTen')} /></label>\n      {errors.hoTen && <p className=\"loi\">{errors.hoTen.message}</p>}\n      <label>Số điện thoại <input {...register('soDienThoai')} /></label>\n      {errors.soDienThoai && <p className=\"loi\">{errors.soDienThoai.message}</p>}\n      <button type=\"submit\">Gửi</button>\n    </form>\n  );\n}",
  watchGoc: "// ── 4. watch() ở gốc form vs useWatch() trong một component con ──\nexport function FormCoWatch({ onRender }: { onRender: () => void }) {\n  onRender();\n  const { register, watch } = useForm({ defaultValues: { hoTen: '', lyDo: '' } });\n  const lyDo = watch('lyDo'); // đăng ký theo dõi ⇒ CẢ FORM render lại khi lyDo đổi\n  return (\n    <form>\n      <label>Họ tên <input {...register('hoTen')} /></label>\n      <label>Lý do <textarea {...register('lyDo')} /></label>\n      <p>{lyDo.length}/500</p>\n    </form>\n  );\n}",
  useWatchCon: "function DemKyTu({ control, onRender }: { control: Control<{ hoTen: string; lyDo: string }>; onRender: () => void }) {\n  onRender();\n  const lyDo = useWatch({ control, name: 'lyDo' }); // chỉ component NÀY render lại\n  return <p>{lyDo.length}/500</p>;\n}\nexport function FormCoUseWatch({ onRenderForm, onRenderDem }: { onRenderForm: () => void; onRenderDem: () => void }) {\n  onRenderForm();\n  const { register, control } = useForm({ defaultValues: { hoTen: '', lyDo: '' } });\n  return (\n    <form>\n      <label>Họ tên <input {...register('hoTen')} /></label>\n      <label>Lý do <textarea {...register('lyDo')} /></label>\n      <DemKyTu control={control} onRender={onRenderDem} />\n    </form>\n  );\n}",
  schema: "import { z } from 'zod';\n\n/** Di động Việt Nam: 10 số, đầu 03/05/07/08/09 (chấp nhận +84 ở đầu, dấu cách, dấu chấm, gạch ngang). */\nexport const SDT_VIET_NAM = /^0(3|5|7|8|9)\\d{8}$/;\n\n/** Chữ cái của MỌI ngôn ngữ (\\p{L}) + dấu kết hợp (\\p{M}) + khoảng trắng, nháy, chấm, gạch. */\nconst CHU_TEN = /^[\\p{L}\\p{M}\\s'.-]+$/u;\n\nexport const LY_DO_TOI_DA = 500;\n\nfunction tuoiTai(ngaySinh: string, homNay: Date): number {\n  const [nam, thang, ngay] = ngaySinh.split('-').map(Number);\n  let tuoi = homNay.getFullYear() - nam;\n  const chuaToiSinhNhat = homNay.getMonth() + 1 < thang || (homNay.getMonth() + 1 === thang && homNay.getDate() < ngay);\n  if (chuaToiSinhNhat) tuoi -= 1;\n  return tuoi;\n}\n\nexport const benhNhanSchema = z.object({\n  hoTen: z\n    .string()\n    .trim()\n    .normalize('NFC')\n    .min(2, 'Họ tên cần ít nhất 2 ký tự')\n    .max(80, 'Họ tên tối đa 80 ký tự')\n    .regex(CHU_TEN, 'Họ tên chỉ gồm chữ cái và khoảng trắng'),\n  soDienThoai: z\n    .string()\n    .trim()\n    .transform((s) => s.replace(/[\\s.-]/g, '').replace(/^\\+84/, '0'))\n    .pipe(z.string().regex(SDT_VIET_NAM, 'Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09')),\n  ngaySinh: z\n    .iso.date({ error: 'Chọn ngày sinh', abort: true })\n    .refine((d) => tuoiTai(d, new Date()) >= 0, 'Ngày sinh không được ở tương lai')\n    .refine((d) => tuoiTai(d, new Date()) <= 120, 'Ngày sinh không hợp lệ'),\n});\n\nexport const datLichSchema = z.object({\n  benhNhan: benhNhanSchema,\n  lyDo: z\n    .string()\n    .trim()\n    .normalize('NFC')\n    .min(1, 'Hãy ghi ngắn gọn lý do khám')\n    .max(LY_DO_TOI_DA, `Lý do tối đa ${LY_DO_TOI_DA} ký tự`),\n});\n\n/** Thứ NGƯỜI DÙNG gõ vào form (trước khi Zod làm sạch). */\nexport type DatLichForm = z.input<typeof datLichSchema>;\n/** Thứ form GỬI ĐI (đã trim, NFC, SĐT đã chuẩn hoá). */\nexport type DatLich = z.output<typeof datLichSchema>;",
  schemaTest: "import { describe, expect, test } from 'vitest';\nimport { datLichSchema } from './dat-lich';\n\nconst hopLe = {\n  benhNhan: { hoTen: '  Nguyễn Thị Ánh  ', soDienThoai: '+84 901.234.567', ngaySinh: '1995-03-14' },\n  lyDo: 'Ho khan 3 ngày',\n};\n\ndescribe('datLichSchema', () => {\n  test('dữ liệu hợp lệ ⇒ được làm sạch', () => {\n    const kq = datLichSchema.parse(hopLe);\n    console.info('[lam sach]', JSON.stringify(kq));\n    expect(kq.benhNhan.hoTen).toBe('Nguyễn Thị Ánh');\n    expect(kq.benhNhan.soDienThoai).toBe('0901234567');\n  });\n\n  test('SĐT sai, tên có số, ngày sinh tương lai ⇒ bốn lỗi, mỗi lỗi đúng đường dẫn', () => {\n    const kq = datLichSchema.safeParse({\n      benhNhan: { hoTen: 'An 2', soDienThoai: '0123456789', ngaySinh: '2099-01-01' },\n      lyDo: '',\n    });\n    expect(kq.success).toBe(false);\n    if (!kq.success) {\n      const loi = kq.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);\n      console.info('[loi]', loi);\n      expect(loi).toEqual([\n        'benhNhan.hoTen: Họ tên chỉ gồm chữ cái và khoảng trắng',\n        'benhNhan.soDienThoai: Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09',\n        'benhNhan.ngaySinh: Ngày sinh không được ở tương lai',\n        'lyDo: Hãy ghi ngắn gọn lý do khám',\n      ]);\n    }\n  });\n\n  test('ngày sinh trống ⇒ đúng MỘT lỗi (abort: true chặn refine phía sau)', () => {\n    const kq = datLichSchema.safeParse({ ...hopLe, benhNhan: { ...hopLe.benhNhan, ngaySinh: '' } });\n    expect(kq.error?.issues.map((i) => i.message)).toEqual(['Chọn ngày sinh']);\n  });\n\n  test('lý do 501 ký tự ⇒ lỗi; 500 ⇒ qua', () => {\n    const r = (n: number) => datLichSchema.safeParse({ ...hopLe, lyDo: 'a'.repeat(n) }).success;\n    expect(r(500)).toBe(true);\n    expect(r(501)).toBe(false);\n  });\n});",
  mayChu: "/** Mô phỏng một route POST /api/lich-hen: nhận JSON, kiểm bằng CHÍNH datLichSchema. */\nfunction xuLyPostLichHen(than: unknown) {\n  const kq = datLichSchema.safeParse(than);\n  if (!kq.success) {\n    // Mỗi lỗi một dòng: đường dẫn trường + câu báo lỗi (client dùng path để gắn lỗi vào đúng ô)\n    return { status: 400, body: kq.error.issues.map((i) => ({ truong: i.path.join('.'), loi: i.message })) };\n  }\n  return { status: 201, body: kq.data };\n}",
  loiTsc: "import { zodResolver } from '@hookform/resolvers/zod';\nimport { useForm } from 'react-hook-form';\nimport { datLichSchema } from '../schema/dat-lich';\n\nexport function GoNhamTen() {\n  const { register } = useForm({ resolver: zodResolver(datLichSchema) });\n  return <input {...register('benhNhan.hoTn')} />;\n}\n\nexport function QuenGuiDuLieu() {\n  const { handleSubmit } = useForm({ resolver: zodResolver(datLichSchema) });\n  return <form onSubmit={handleSubmit((du) => console.log(du.benhNhan.soDienThoai.toUpperCase(), du.lyDo.length, du.ghiChu))} />;\n}",
  khongChan: "// ── 1. ❌ Tự viết, không chặn: mỗi cú bấm là một lần gửi ──\nexport function FormKhongChan({ onGui }: { onGui: Gui }) {\n  const [hoTen, setHoTen] = useState('Nguyễn Văn A');\n  const [dangGui, setDangGui] = useState(false);\n  async function xuLyGui(e: SubmitEvent<HTMLFormElement>) {\n    e.preventDefault();\n    setDangGui(true);\n    await onGui({ hoTen, soDienThoai: '0901234567' });\n    setDangGui(false);\n  }\n  return (\n    <form onSubmit={xuLyGui}>\n      <label>Họ tên <input value={hoTen} onChange={(e) => setHoTen(e.target.value)} /></label>\n      <button type=\"submit\">{dangGui ? 'Đang gửi…' : 'Gửi'}</button>\n    </form>\n  );\n}",
  chanState: "// ── 2. ⚠️ Có disabled theo state — nhưng state chỉ đổi SAU lần render kế tiếp ──\nexport function FormChanBangState({ onGui }: { onGui: Gui }) {\n  const [dangGui, setDangGui] = useState(false);\n  async function xuLyGui(e: SubmitEvent<HTMLFormElement>) {\n    e.preventDefault();\n    if (dangGui) return; // đọc ảnh chụp state của lần render này\n    setDangGui(true);\n    try {\n      await onGui({ hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567' });\n    } finally {\n      setDangGui(false); // finally: chạy dù thành công hay lỗi\n    }\n  }\n  return (\n    <form onSubmit={xuLyGui}>\n      <button type=\"submit\" disabled={dangGui}>{dangGui ? 'Đang gửi…' : 'Gửi'}</button>\n    </form>\n  );\n}",
  chanRef: "// ── 3. ✅ Chặn bằng ref: đổi NGAY, không đợi render ──\nexport function FormChanBangRef({ onGui, onBamGui }: { onGui: Gui; onBamGui?: () => void }) {\n  const [dangGui, setDangGui] = useState(false);\n  const dangGuiRef = useRef(false);\n  async function xuLyGui(e: SubmitEvent<HTMLFormElement>) {\n    e.preventDefault();\n    onBamGui?.();\n    if (dangGuiRef.current) return;\n    dangGuiRef.current = true;\n    setDangGui(true);\n    try {\n      await onGui({ hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567' });\n    } finally {\n      dangGuiRef.current = false;\n      setDangGui(false);\n    }\n  }\n  return (\n    <form onSubmit={xuLyGui}>\n      <button type=\"submit\" disabled={dangGui}>{dangGui ? 'Đang gửi…' : 'Gửi'}</button>\n    </form>\n  );\n}",
  quenAwait: "// ── 4. ❌ RHF nhưng QUÊN await/return: handleSubmit tưởng đã xong ngay ──\nexport function FormRHFQuenAwait({ onGui }: { onGui: Gui }) {\n  const { register, handleSubmit, formState: { isSubmitting } } = useForm({\n    resolver: zodResolver(haiOSchema),\n    defaultValues: { hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567' },\n  });\n  return (\n    <form\n      onSubmit={handleSubmit((du) => {\n        onGui(du); // ❌ không await, không return ⇒ isSubmitting tắt ngay\n      })}\n    >\n      <input aria-label=\"Họ tên\" {...register('hoTen')} />\n      <button type=\"submit\" disabled={isSubmitting}>{isSubmitting ? 'Đang gửi…' : 'Gửi'}</button>\n    </form>\n  );\n}",
  coAwait: "// ── 5. ✅ RHF có await: isSubmitting giữ đúng suốt lúc chờ ──\nexport function FormRHFCoAwait({ onGui }: { onGui: Gui }) {\n  const { register, handleSubmit, formState: { isSubmitting } } = useForm({\n    resolver: zodResolver(haiOSchema),\n    defaultValues: { hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567' },\n  });\n  return (\n    <form onSubmit={handleSubmit(async (du) => { await onGui(du); })}>\n      <input aria-label=\"Họ tên\" {...register('hoTen')} />\n      <button type=\"submit\" disabled={isSubmitting}>{isSubmitting ? 'Đang gửi…' : 'Gửi'}</button>\n    </form>\n  );\n}",
  loiMayChu: "/** Lỗi 400 từ máy chủ, mang theo danh sách lỗi từng trường (dạng ở Bài 3.2). */\nexport class LoiKiemTra extends Error {\n  loiTruong: LoiTruong[];\n  constructor(loiTruong: LoiTruong[]) {\n    super('Dữ liệu không hợp lệ');\n    this.loiTruong = loiTruong;\n  }\n}\n\nexport function FormLoiMayChu({ onGui }: { onGui: Gui }) {\n  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({\n    resolver: zodResolver(haiOSchema),\n    defaultValues: { hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567' },\n  });\n  async function guiDi(du: HaiOZod) {\n    try {\n      await onGui(du);\n    } catch (loi) {\n      if (loi instanceof LoiKiemTra) {\n        loi.loiTruong.forEach(({ truong, loi: thongBao }, i) => {\n          if (truong === 'hoTen' || truong === 'soDienThoai') {\n            setError(truong, { type: 'server', message: thongBao }, { shouldFocus: i === 0 });\n          }\n        });\n      } else {\n        setError('root.server', { message: 'Không gửi được. Kiểm tra mạng rồi thử lại.' });\n      }\n    }\n  }\n  return (\n    <form onSubmit={handleSubmit(guiDi)} noValidate>\n      {errors.root?.server && <p role=\"alert\">{errors.root.server.message}</p>}\n      <label>Họ tên <input {...register('hoTen')} /></label>\n      {errors.hoTen && <p className=\"loi\">{errors.hoTen.message}</p>}\n      <label>Số điện thoại <input {...register('soDienThoai')} /></label>\n      {errors.soDienThoai && <p className=\"loi\">{errors.soDienThoai.message}</p>}\n      <button type=\"submit\" disabled={isSubmitting}>Gửi</button>\n    </form>\n  );\n}",
  testCungNhip: "  test('hai lần submit trong CÙNG một nhịp (hai lệnh submit liền nhau, không có render ở giữa)', async () => {\n    const ketQua: Record<string, number> = {};\n    for (const [ten, Form] of CAC_FORM) {\n      const onGui = mayChuCham();\n      const { unmount, container } = render(<Form onGui={onGui} />);\n      const form = container.querySelector('form')!; // ! : \"chắc chắn không null\"\n      act(() => {\n        fireEvent.submit(form);\n        fireEvent.submit(form);\n      });\n      await act(() => new Promise((r) => setTimeout(r, 120)));\n      ketQua[ten] = onGui.mock.calls.length;\n      unmount();\n    }\n    console.info('[2 submit cung nhip]', ketQua);\n    expect(ketQua).toEqual({\n      '1 không chặn': 2, '2 chặn bằng state': 2, '3 chặn bằng ref': 1, '4 RHF quên await': 2, '5 RHF có await': 2,\n    });\n  });",
  xuLySubmit: "  async function guiDi(duLieu: DatLich) {\n    try {\n      await onGui(duLieu); // PHẢI await: handleSubmit chờ hàm này xong mới tắt isSubmitting\n    } catch (loi) {\n      setError('root.server', { message: loi instanceof Error ? loi.message : 'Gửi không thành công, thử lại sau' });\n    }\n  }\n\n  // Chốt thứ hai, đặt TRƯỚC handleSubmit: isSubmitting chỉ khoá nút sau một lần render,\n  // còn ref đổi NGAY — hai lần submit trong cùng một nhịp vẫn chỉ gửi một (đo ở Bài 3.3).\n  const dangGui = useRef(false);\n  const guiForm = handleSubmit(guiDi);\n  function xuLySubmit(ev: SubmitEvent<HTMLFormElement>) {\n    ev.preventDefault();\n    if (dangGui.current) return;\n    dangGui.current = true;\n    guiForm(ev).finally(() => {\n      dangGui.current = false;\n    });\n  }",
  formDatLich: "import { zodResolver } from '@hookform/resolvers/zod';\nimport { useRef, type SubmitEvent } from 'react';\nimport { useForm, useWatch, type Control } from 'react-hook-form';\nimport { datLichSchema, LY_DO_TOI_DA, type DatLich, type DatLichForm } from '../schema/dat-lich';\nimport type { BacSi } from '../types';\n\ninterface FormDatLichProps {\n  bacSi: BacSi;\n  /** Trả về Promise: form chờ nó xong mới mở khoá nút Gửi. Lỗi ném ra ⇒ hiện ở đầu form. */\n  onGui: (duLieu: DatLich) => Promise<void>;\n}\n\n/** Bộ đếm ký tự tách riêng: useWatch chỉ làm component NÀY render lại mỗi phím (đo ở Bài 3.2). */\nfunction DemKyTuLyDo({ control }: { control: Control<DatLichForm, unknown, DatLich> }) {\n  const soKyTu = (useWatch({ control, name: 'lyDo' }) ?? '').normalize('NFC').length;\n  return (\n    <p id=\"lyDo-dem\" className={soKyTu > LY_DO_TOI_DA ? 'dem-ky-tu vuot' : 'dem-ky-tu'}>\n      {soKyTu}/{LY_DO_TOI_DA}\n    </p>\n  );\n}\n\nconst RONG: DatLichForm = { benhNhan: { hoTen: '', soDienThoai: '', ngaySinh: '' }, lyDo: '' };\n\nexport function FormDatLich({ bacSi, onGui }: FormDatLichProps) {\n  const {\n    register,\n    handleSubmit,\n    setError,\n    control,\n    formState: { errors, isSubmitting, isSubmitSuccessful },\n  } = useForm({\n    resolver: zodResolver(datLichSchema),\n    defaultValues: RONG,\n    mode: 'onTouched', // lỗi hiện khi rời ô lần đầu, rồi cập nhật theo từng phím\n  });\n\n  async function guiDi(duLieu: DatLich) {\n    try {\n      await onGui(duLieu); // PHẢI await: handleSubmit chờ hàm này xong mới tắt isSubmitting\n    } catch (loi) {\n      setError('root.server', { message: loi instanceof Error ? loi.message : 'Gửi không thành công, thử lại sau' });\n    }\n  }\n\n  // Chốt thứ hai, đặt TRƯỚC handleSubmit: isSubmitting chỉ khoá nút sau một lần render,\n  // còn ref đổi NGAY — hai lần submit trong cùng một nhịp vẫn chỉ gửi một (đo ở Bài 3.3).\n  const dangGui = useRef(false);\n  const guiForm = handleSubmit(guiDi);\n  function xuLySubmit(ev: SubmitEvent<HTMLFormElement>) {\n    ev.preventDefault();\n    if (dangGui.current) return;\n    dangGui.current = true;\n    guiForm(ev).finally(() => {\n      dangGui.current = false;\n    });\n  }\n\n  const e = errors.benhNhan;\n\n  if (isSubmitSuccessful && !errors.root) {\n    return (\n      <p className=\"gui-xong\" role=\"status\">\n        Đã gửi yêu cầu đặt lịch với {bacSi.ten}. Phòng khám sẽ gọi lại để xác nhận.\n      </p>\n    );\n  }\n\n  return (\n    <form className=\"form-dat-lich\" onSubmit={xuLySubmit} noValidate aria-label={`Đặt lịch với ${bacSi.ten}`}>\n      <h3>Đặt lịch với {bacSi.ten}</h3>\n      {errors.root?.server && (\n        <p className=\"loi-chung\" role=\"alert\">\n          {errors.root.server.message}\n        </p>\n      )}\n\n      <label htmlFor=\"hoTen\">Họ và tên</label>\n      <input\n        id=\"hoTen\"\n        autoComplete=\"name\"\n        aria-invalid={e?.hoTen ? true : undefined}\n        aria-describedby={e?.hoTen ? 'hoTen-loi' : undefined}\n        {...register('benhNhan.hoTen')}\n      />\n      {e?.hoTen && <p id=\"hoTen-loi\" className=\"loi\">{e.hoTen.message}</p>}\n\n      <label htmlFor=\"soDienThoai\">Số điện thoại</label>\n      <input\n        id=\"soDienThoai\"\n        type=\"tel\"\n        inputMode=\"tel\"\n        autoComplete=\"tel\"\n        aria-invalid={e?.soDienThoai ? true : undefined}\n        aria-describedby={e?.soDienThoai ? 'soDienThoai-loi' : undefined}\n        {...register('benhNhan.soDienThoai')}\n      />\n      {e?.soDienThoai && <p id=\"soDienThoai-loi\" className=\"loi\">{e.soDienThoai.message}</p>}\n\n      <label htmlFor=\"ngaySinh\">Ngày sinh</label>\n      <input\n        id=\"ngaySinh\"\n        type=\"date\"\n        aria-invalid={e?.ngaySinh ? true : undefined}\n        aria-describedby={e?.ngaySinh ? 'ngaySinh-loi' : undefined}\n        {...register('benhNhan.ngaySinh')}\n      />\n      {e?.ngaySinh && <p id=\"ngaySinh-loi\" className=\"loi\">{e.ngaySinh.message}</p>}\n\n      <label htmlFor=\"lyDo\">Lý do khám</label>\n      <textarea\n        id=\"lyDo\"\n        rows={3}\n        aria-invalid={errors.lyDo ? true : undefined}\n        aria-describedby={errors.lyDo ? 'lyDo-loi lyDo-dem' : 'lyDo-dem'}\n        {...register('lyDo')}\n      />\n      <DemKyTuLyDo control={control} />\n      {errors.lyDo && <p id=\"lyDo-loi\" className=\"loi\">{errors.lyDo.message}</p>}\n\n      <button type=\"submit\" className=\"nut nut-chinh\" disabled={isSubmitting}>\n        {isSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu'}\n      </button>\n    </form>\n  );\n}",
  oHoTen: "<label htmlFor=\"hoTen\">Họ và tên</label>\n<input\n  id=\"hoTen\"\n  autoComplete=\"name\"\n  aria-invalid={e?.hoTen ? true : undefined}\n  aria-describedby={e?.hoTen ? 'hoTen-loi' : undefined}\n  {...register('benhNhan.hoTen')}\n/>\n{e?.hoTen && <p id=\"hoTen-loi\" className=\"loi\">{e.hoTen.message}</p>}",
  trangThaiGui: "if (isSubmitSuccessful && !errors.root) {\n  return (\n    <p className=\"gui-xong\" role=\"status\">\n      Đã gửi yêu cầu đặt lịch với {bacSi.ten}. Phòng khám sẽ gọi lại để xác nhận.\n    </p>\n  );\n}\n\n<button type=\"submit\" className=\"nut nut-chinh\" disabled={isSubmitting}>\n  {isSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu'}\n</button>",
  formDatLichTest: "import { act, fireEvent, render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { expect, test, vi } from 'vitest';\nimport { danhSachBacSi } from '../du-lieu/bac-si';\nimport type { DatLich } from '../schema/dat-lich';\nimport { FormDatLich } from './FormDatLich';\n\nconst bacSi = danhSachBacSi[1]; // BS. Trần Thu Hà\n\n/** Một lời hứa mình tự quyết lúc nào xong — để \"đóng băng\" form ở trạng thái đang gửi. */\nfunction hua() {\n  let xong!: () => void;\n  let hong!: (e: Error) => void;\n  const p = new Promise<void>((ok, fail) => { xong = ok; hong = fail; });\n  return { p, xong, hong };\n}\n\nasync function dienHopLe(user: ReturnType<typeof userEvent.setup>) {\n  await user.type(screen.getByLabelText('Họ và tên'), '  Nguyễn Thị Ánh ');\n  await user.type(screen.getByLabelText('Số điện thoại'), '0901 234 567');\n  await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');\n  await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');\n}\n\ntest('gửi form trống ⇒ lỗi dưới từng ô, focus ô đầu tiên, KHÔNG gọi onGui', async () => {\n  const user = userEvent.setup();\n  const onGui = vi.fn(async (_: DatLich) => {});\n  render(<FormDatLich bacSi={bacSi} onGui={onGui} />);\n  await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));\n  const loi = screen.getAllByText(/./, { selector: 'p.loi' }).map((p) => p.textContent);\n  console.info('[loi]', loi);\n  expect(loi).toHaveLength(4);\n  expect(screen.getByLabelText('Họ và tên')).toHaveFocus();\n  expect(screen.getByLabelText('Họ và tên')).toHaveAttribute('aria-invalid', 'true');\n  expect(screen.getByLabelText('Họ và tên')).toHaveAccessibleDescription('Họ tên cần ít nhất 2 ký tự');\n  expect(onGui).not.toHaveBeenCalled();\n});\n\ntest('hợp lệ ⇒ onGui nhận dữ liệu ĐÃ LÀM SẠCH; nút khoá khi đang gửi; xong thì báo', async () => {\n  const user = userEvent.setup();\n  const h = hua();\n  const onGui = vi.fn((_: DatLich) => h.p);\n  render(<FormDatLich bacSi={bacSi} onGui={onGui} />);\n  await dienHopLe(user);\n  await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));\n  const nut = screen.getByRole('button', { name: 'Đang gửi…' });\n  expect(nut).toBeDisabled();\n  console.info('[du lieu gui]', JSON.stringify(onGui.mock.calls[0][0]));\n  expect(onGui).toHaveBeenCalledWith({\n    benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },\n    lyDo: 'Bé ho khan 3 ngày',\n  });\n  h.xong();\n  expect(await screen.findByRole('status')).toHaveTextContent('Đã gửi yêu cầu đặt lịch với BS. Trần Thu Hà');\n});\n\ntest('bấm đúp nút Gửi ⇒ onGui chỉ chạy MỘT lần', async () => {\n  const user = userEvent.setup();\n  const h = hua();\n  const onGui = vi.fn((_: DatLich) => h.p);\n  render(<FormDatLich bacSi={bacSi} onGui={onGui} />);\n  await dienHopLe(user);\n  await user.dblClick(screen.getByRole('button', { name: 'Gửi yêu cầu' }));\n  await user.click(screen.getByRole('button', { name: 'Đang gửi…' }));\n  console.info('[so lan goi onGui]', onGui.mock.calls.length);\n  expect(onGui).toHaveBeenCalledTimes(1);\n  h.xong();\n  await screen.findByRole('status');\n});\n\ntest('máy chủ báo lỗi ⇒ hiện ở đầu form, nút mở khoá để thử lại, dữ liệu còn nguyên', async () => {\n  const user = userEvent.setup();\n  const onGui = vi.fn(async (_: DatLich) => {\n    throw new Error('Khung giờ này vừa có người đặt, hãy chọn giờ khác');\n  });\n  render(<FormDatLich bacSi={bacSi} onGui={onGui} />);\n  await dienHopLe(user);\n  await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));\n  expect(await screen.findByRole('alert')).toHaveTextContent('Khung giờ này vừa có người đặt');\n  expect(screen.getByRole('button', { name: 'Gửi yêu cầu' })).toBeEnabled();\n  expect(screen.getByLabelText('Họ và tên')).toHaveValue('  Nguyễn Thị Ánh ');\n});\n\ntest('đếm ký tự lý do theo NFC; vượt 500 ⇒ lỗi', async () => {\n  const user = userEvent.setup();\n  render(<FormDatLich bacSi={bacSi} onGui={async () => {}} />);\n  const o = screen.getByLabelText('Lý do khám');\n  await user.click(o);\n  await user.paste('a'.repeat(501));\n  await user.tab();\n  expect(screen.getByText('501/500')).toHaveClass('vuot');\n  expect(screen.getByText('Lý do tối đa 500 ký tự')).toBeInTheDocument();\n});\n\ntest('hai lần submit trong CÙNG một nhịp (requestSubmit ×2) ⇒ vẫn chỉ MỘT lần', async () => {\n  const user = userEvent.setup();\n  const h = hua();\n  const onGui = vi.fn((_: DatLich) => h.p);\n  render(<FormDatLich bacSi={bacSi} onGui={onGui} />);\n  await dienHopLe(user);\n  const form = screen.getByRole('form');\n  act(() => {\n    fireEvent.submit(form);\n    fireEvent.submit(form);\n  });\n  await act(() => new Promise((r) => setTimeout(r, 50)));\n  console.info('[cung nhip] so lan goi onGui:', onGui.mock.calls.length, '| nut:', screen.getByRole('button').textContent, screen.getByRole('button').hasAttribute('disabled') ? '(khoa)' : '(mo)');\n  expect(onGui).toHaveBeenCalledTimes(1);\n  h.xong();\n  await screen.findByRole('status');\n});",
  guiDatLich: "import type { DatLich } from '../schema/dat-lich';\nimport type { LichHen } from '../types';\n\n/** Chờ ms mili-giây. `new Promise(r => setTimeout(r, ms))` = một lời hứa tự xong sau ms. */\nconst cho = (ms: number) => new Promise((r) => setTimeout(r, ms));\n\n/**\n * GIẢ LẬP máy chủ cho tới Chương 6 (khi đó thay bằng POST /api/lich-hen qua MSW + TanStack Query).\n * Chậm 800 ms như mạng thật; số 0999 999 999 giả làm \"đã có lịch chờ\" để thử nhánh lỗi.\n */\nexport async function guiYeuCauDatLich(bacSiId: string, duLieu: DatLich): Promise<LichHen> {\n  await cho(800);\n  if (duLieu.benhNhan.soDienThoai === '0999999999') {\n    throw new Error('Số điện thoại này đang có một lịch chờ xác nhận');\n  }\n  return {\n    id: `lh-${Date.now()}`,\n    bacSiId,\n    khungGioId: 'chua-chon', // Chương 5–6: chọn khung giờ thật\n    benhNhan: duLieu.benhNhan,\n    lyDo: duLieu.lyDo,\n    trangThai: 'cho-xac-nhan',\n  };\n}",
  khuBacSiDoan: "{bacSiDangChon ? (\n  <>\n    <ChiTietBacSi\n      bacSi={bacSiDangChon}\n      laYeuThich={yeuThich.includes(bacSiDangChon.id)}\n      onDoiYeuThich={xuLyDoiYeuThich}\n      onDong={() => setBacSiDangChonId(null)}\n    />\n    {/* key đổi theo bác sĩ ⇒ đổi bác sĩ là một form MỚI tinh (Chương 11 giải thích key sâu hơn) */}\n    <FormDatLich\n      key={bacSiDangChon.id}\n      bacSi={bacSiDangChon}\n      onGui={async (duLieu) => {\n        await guiYeuCauDatLich(bacSiDangChon.id, duLieu);\n      }}\n    />\n  </>\n) : (",
  khuBacSiTest: "test('chọn bác sĩ ⇒ có form đặt lịch; gửi hợp lệ ⇒ báo đã gửi (máy chủ giả chậm 800 ms)', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  await user.click(screen.getByRole('button', { name: 'Xem chi tiết BS. Vũ Thảo Vy' }));\n  const form = screen.getByRole('form', { name: 'Đặt lịch với BS. Vũ Thảo Vy' });\n  await user.type(within(form).getByLabelText('Họ và tên'), 'Đỗ Minh Khôi');\n  await user.type(within(form).getByLabelText('Số điện thoại'), '0987654321');\n  await user.type(within(form).getByLabelText('Ngày sinh'), '2019-06-02');\n  await user.type(within(form).getByLabelText('Lý do khám'), 'Khám sức khoẻ định kỳ');\n  await user.click(within(form).getByRole('button', { name: 'Gửi yêu cầu' }));\n  expect(within(form).getByRole('button', { name: 'Đang gửi…' })).toBeDisabled();\n  expect(await screen.findByRole('status', {}, { timeout: 2000 })).toHaveTextContent('Đã gửi yêu cầu đặt lịch với BS. Vũ Thảo Vy');\n});",
  css: ".form-dat-lich { margin-top: 14px; background: var(--the); border: 1px solid var(--vien); border-radius: 14px; padding: 14px 16px; display: grid; gap: 4px; }\n.form-dat-lich h3 { margin: 0 0 6px; font-size: 17px; }\n.form-dat-lich label { font-weight: 600; font-size: 14px; margin-top: 6px; }\n.form-dat-lich input, .form-dat-lich textarea { font: inherit; padding: 7px 10px; border: 1px solid var(--vien); border-radius: 10px; }\n.form-dat-lich [aria-invalid='true'] { border-color: var(--do); background: #fff5f5; }\n.form-dat-lich .loi { margin: 2px 0 0; color: var(--do); font-size: 13px; }\n.form-dat-lich .loi-chung { margin: 0 0 6px; padding: 8px 10px; border-radius: 10px; background: #ffe4e6; color: #9f1239; font-size: 14px; }\n.form-dat-lich .dem-ky-tu { margin: 2px 0 0; font-size: 12px; color: var(--nhat); text-align: right; }\n.form-dat-lich .dem-ky-tu.vuot { color: var(--do); font-weight: 700; }\n.form-dat-lich button { margin-top: 10px; }\n.form-dat-lich button:disabled { opacity: .6; cursor: progress; }\n.gui-xong { margin-top: 14px; padding: 12px 14px; border-radius: 14px; background: #dcfce7; border: 1px solid #86efac; color: #14532d; }",
  dangGoDau: "/** Đang gõ dấu (IME đang \"soạn\")? isComposing chuẩn; keyCode 229 cho trình duyệt cũ (Safari gửi keydown Enter SAU compositionend). */\nexport function dangGoDau(e: KeyboardEvent<HTMLElement>): boolean {\n  return e.nativeEvent.isComposing || e.keyCode === 229;\n}",
  nhanTinSai: "// ── 1. ❌ Enter = gửi, không để ý bộ gõ ──\nexport function ONhanTinSai({ onGui }: { onGui: (s: string) => void }) {\n  const [noiDung, setNoiDung] = useState('');\n  return (\n    <label>\n      Nhắn lễ tân (sai)\n      <input\n        value={noiDung}\n        onChange={(e) => setNoiDung(e.target.value)}\n        onKeyDown={(e) => {\n          if (e.key === 'Enter') {\n            onGui(noiDung);\n            setNoiDung('');\n          }\n        }}\n      />\n    </label>\n  );\n}",
  nhanTinDung: "// ── 2. ✅ Enter khi đang gõ dấu là của bộ gõ, không phải của bạn ──\nexport function ONhanTinDung({ onGui }: { onGui: (s: string) => void }) {\n  const [noiDung, setNoiDung] = useState('');\n  return (\n    <label>\n      Nhắn lễ tân (đúng)\n      <input\n        value={noiDung}\n        onChange={(e) => setNoiDung(e.target.value)}\n        onKeyDown={(e) => {\n          if (e.key !== 'Enter' || dangGoDau(e)) return;\n          e.preventDefault();\n          if (noiDung.trim()) onGui(noiDung.trim().normalize('NFC'));\n          setNoiDung('');\n        }}\n      />\n    </label>\n  );\n}",
  vietHoaSai: "// ── 3. ❌ Sửa value NGAY trong lúc bộ gõ đang soạn (ở đây: viết hoa chữ đầu mỗi từ) ──\nexport const vietHoaDauTu = (s: string) => s.replace(/(^|\\s)(\\p{L})/gu, (_m, dau: string, chu: string) => dau + chu.toUpperCase());\nexport function OHoTenVietHoaSai() {\n  const [ten, setTen] = useState('');\n  return (\n    <label>\n      Họ tên (viết hoa ngay)\n      <input value={ten} onChange={(e) => setTen(vietHoaDauTu(e.target.value))} />\n    </label>\n  );\n}",
  vietHoaDung: "// ── 4. ✅ Để bộ gõ soạn xong (compositionend) hoặc rời ô (blur) rồi mới sửa ──\nexport function OHoTenVietHoaDung() {\n  const [ten, setTen] = useState('');\n  const dangSoan = useRef(false);\n  return (\n    <label>\n      Họ tên (viết hoa khi xong)\n      <input\n        value={ten}\n        onCompositionStart={() => { dangSoan.current = true; }}\n        onCompositionEnd={(e) => {\n          dangSoan.current = false;\n          setTen(vietHoaDauTu(e.currentTarget.value));\n        }}\n        onChange={(e) => setTen(dangSoan.current ? e.target.value : vietHoaDauTu(e.target.value))}\n        onBlur={(e) => setTen(vietHoaDauTu(e.target.value.normalize('NFC')))}\n      />\n    </label>\n  );\n}",
  regexTen: "// ── 5. Regex tên: ba phiên bản ──\nexport const TEN_ASCII = /^[a-zA-Z\\s]+$/; // ❌ \"Nguyễn\" trượt\nexport const TEN_KHOANG_DAU = /^[a-zA-ZÀ-ỹ\\s]+$/; // ⚠️ dải À-ỹ (U+00C0–U+1EF9) rộng hơn bạn nghĩ\nexport const TEN_UNICODE = /^[\\p{L}\\p{M}\\s'.-]+$/u; // ✅ mọi chữ cái + dấu kết hợp",
  testIme: "  test.each([\n    ['sai', 1, ONhanTinSai],\n    ['đúng', 0, ONhanTinDung],\n  ] as const)('%s: keydown Enter với isComposing=true ⇒ gửi %i lần', (_t, soLan, O) => {\n    const onGui = vi.fn();\n    render(<O onGui={onGui} />);\n    const o = screen.getByRole('textbox');\n    fireEvent.compositionStart(o);\n    fireEvent.change(o, { target: { value: 'cảm' } });\n    fireEvent.keyDown(o, { key: 'Enter', isComposing: true });\n    fireEvent.compositionEnd(o, { data: 'cảm' });\n    expect(onGui).toHaveBeenCalledTimes(soLan);\n  });",
  demKyTu: "// node dem-ky-tu.mjs — đếm \"ký tự\" ba cách\nconst seg = new Intl.Segmenter('vi', { granularity: 'grapheme' });\nconst dem = (s) => ({ length: s.length, codePoints: [...s].length, graphemes: [...seg.segment(s)].length });\nconsole.log('NFC  \"Nguyễn\"   ', dem('Nguyễn'.normalize('NFC')));\nconsole.log('NFD  \"Nguyễn\"   ', dem('Nguyễn'.normalize('NFD')));\nconsole.log('     \"Khám 👍🏽\"', dem('Khám 👍🏽'));",
  cdp: "async function goDau(label, buoc) {\n  await p.getByLabel(label).click();\n  for (const t of buoc) await cdp.send('Input.imeSetComposition', { text: t, selectionStart: t.length, selectionEnd: t.length });\n}",
  cdpDung: "await goDau(label, ['c', 'ca', 'cam', 'cam3', 'cảm']);\n// Enter lúc bộ gõ còn đang soạn: Chromium gửi keydown với isComposing=true\nawait p.keyboard.press('Enter');\nawait cdp.send('Input.insertText', { text: 'cảm' }); // bộ gõ chốt chữ",
};

/* ─── Output THẬT (vitest --reporter=verbose, tsc, vite build, npm, Playwright + Chromium 141) ─── */
const OUT = {
  canhBaoValue: "[canh bao] [\n  'You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'\n]",
  canhBaoUndef: "[canh bao] [\n  'A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components'\n]",
  sdt: "[sdt] go \"09a01.23456789\" ⇒ o hien: \"0901 234 567\"",
  nhieuO: "[gui] {\"hoTen\":\"Vũ Thảo Vy\",\"soDienThoai\":\"\",\"gioiTinh\":\"nu\",\"daKhamTruocDay\":true,\"lyDo\":\"Tái khám\"}",
  formData: "[formdata] {\"hoTen\":\"Lê Quốc Bảo\",\"soDienThoai\":\"0912345678\"}",
  commit: "[commit khi go 12 ky tu] { kiemSoat: 12, formData: 0 }",
  bai1Tong: " ✓ không kiểm soát: đọc giá trị qua ref lúc gửi\n ✓ kiểm soát: màn hình chạy theo từng phím\n ✓ kiểm soát: định dạng số điện thoại ngay khi gõ\n ✓ bẫy: value không có onChange ⇒ cảnh báo + gõ không ăn\n ✓ bẫy: undefined → chuỗi ⇒ cảnh báo đổi từ không kiểm soát sang kiểm soát\n ✓ nhiều ô, một object state: select, checkbox, textarea\n ✓ useRef đưa focus về ô sau khi xoá\n ✓ FormData: không state, không ref\n ✓ đo: gõ 12 ký tự ⇒ bao nhiêu lần commit?\n Test Files  1 passed (1)\n      Tests  9 passed (9)",
  mode: "[mode] {\n  onSubmit: { sauKhiGo: 0, sauKhiRoiO: 0 },\n  onBlur: { sauKhiGo: 0, sauKhiRoiO: 1 },\n  onTouched: { sauKhiGo: 0, sauKhiRoiO: 1 },\n  onChange: { sauKhiGo: 1, sauKhiRoiO: 1 }\n}",
  rhfRender: "[rhf] render them khi go 12 ky tu: 0",
  watch: "[go 15 ky tu vao Ly do] render them: { watchForm: 15, useWatchForm: 0, useWatchCon: 15 }",
  mayChu: "[may chu] 400 [\n {\n  \"truong\": \"benhNhan.hoTen\",\n  \"loi\": \"Họ tên chỉ gồm chữ cái và khoảng trắng\"\n },\n {\n  \"truong\": \"benhNhan.soDienThoai\",\n  \"loi\": \"Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09\"\n },\n {\n  \"truong\": \"benhNhan.ngaySinh\",\n  \"loi\": \"Chọn ngày sinh\"\n }\n]",
  flatten: "[flattenError] {\"benhNhan\":[\"Họ tên cần ít nhất 2 ký tự\",\"Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09\",\"Chọn ngày sinh\"],\"lyDo\":[\"Hãy ghi ngắn gọn lý do khám\"]}",
  bai2Tong: " ✓ 3.2 — ba cách viết cùng một form > tự viết (useState): tên 1 chữ + SĐT sai ⇒ hai lỗi, không gửi\n ✓ 3.2 — ba cách viết cùng một form > RHF + luật trong register: tên 1 chữ + SĐT sai ⇒ hai lỗi, không gửi\n ✓ 3.2 — ba cách viết cùng một form > RHF + Zod: tên 1 chữ + SĐT sai ⇒ hai lỗi, không gửi\n ✓ 3.2 — mode: lỗi hiện lúc nào? > gõ \"A\" vào Họ tên, rồi Tab sang ô sau\n ✓ 3.2 — đo số lần render khi gõ 12 ký tự > RHF + Zod (mode onSubmit): component form không render lại\n ✓ 3.2 — đo số lần render khi gõ 12 ký tự > watch() ở gốc vs useWatch() trong con\n ✓ 3.2 — cùng schema, phía máy chủ > client bị lách (gọi thẳng API) ⇒ máy chủ vẫn chặn\n ✓ 3.2 — cùng schema, phía máy chủ > bẫy: z.flattenError chỉ làm phẳng MỘT tầng\n Test Files  1 passed (1)\n      Tests  8 passed (8)",
  tscLoi: "src/vi-du/loi-tsc.tsx(7,30): error TS2345: Argument of type '\"benhNhan.hoTn\"' is not assignable to parameter of type '\"benhNhan\" | \"lyDo\" | \"benhNhan.hoTen\" | \"benhNhan.soDienThoai\" | \"benhNhan.ngaySinh\"'.\nsrc/vi-du/loi-tsc.tsx(12,117): error TS2339: Property 'ghiChu' does not exist on type '{ benhNhan: { hoTen: string; soDienThoai: string; ngaySinh: string; }; lyDo: string; }'.",
  npmInstall: "$ npm install react-hook-form zod @hookform/resolvers\nadded 4 packages, and audited 173 packages in 2s\n\n35 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities",
  npmLs: "$ npm ls react-hook-form zod @hookform/resolvers\nphong-kham@0.0.0\n+-- @hookform/resolvers@5.9.1\n| +-- react-hook-form@7.88.0 deduped\n| `-- zod@4.6.5 deduped\n+-- react-hook-form@7.88.0\n`-- zod@4.6.5",
  refineTruoc: "# chạy thật 25/09/2026 — schema CHƯA có abort: true, ngaySinh: ''\n[\"Chọn ngày sinh\",\"Ngày sinh không hợp lệ\"]\n# sau khi thêm { error: 'Chọn ngày sinh', abort: true }\n[\"Chọn ngày sinh\"]",
  refOnValid: "# chạy thật 25/09/2026 — chốt ref đặt BÊN TRONG hàm onValid (guiDi), hai lần submit cùng nhịp\n× hai lần submit trong CÙNG một nhịp (requestSubmit ×2) ⇒ vẫn chỉ MỘT lần\n  → Unable to find an accessible element with the role \"button\"\n  (DOM lúc đó: <p class=\"gui-xong\" role=\"status\">Đã gửi yêu cầu đặt lịch với BS. Trần Thu Hà. …</p>\n   — trong khi lời gọi onGui ĐẦU TIÊN vẫn còn đang treo)",
  dblclick: "[dblClick] {\n  '1 không chặn': 2,\n  '2 chặn bằng state': 1,\n  '3 chặn bằng ref': 1,\n  '4 RHF quên await': 2,\n  '5 RHF có await': 1\n}",
  cungNhip: "[2 submit cung nhip] {\n  '1 không chặn': 2,\n  '2 chặn bằng state': 2,\n  '3 chặn bằng ref': 1,\n  '4 RHF quên await': 2,\n  '5 RHF có await': 2\n}",
  chromium: "[3.3] dblclick (chuột thật): {\n  'khong-chan': 2,\n  'chan-state': 1,\n  'chan-ref': 1,\n  'rhf-quen-await': 2,\n  'rhf-co-await': 1\n}\n[3.3] requestSubmit x2 cùng tác vụ: {\n  'khong-chan': 2,\n  'chan-state': 2,\n  'chan-ref': 1,\n  'rhf-quen-await': 2,\n  'rhf-co-await': 2\n}",
  formCungNhip: "[cung nhip] so lan goi onGui: 1 | nut: Đang gửi… (khoa)",
  appCungNhip: "[app] requestSubmit x2 vào FormDatLich: {\n  soLan: 1,\n  cuoi: 'Đã gửi yêu cầu đặt lịch với BS. Lê Quốc Bảo. Phòng khám sẽ gọi lại để xác nhận.'\n}",
  focus: "[app] focus sau khi gửi trống: hoTen",
  imeSai: "[3.4] sai: nhật ký = \"gửi: \\\"cảm\\\"\" | ô còn: \"cảm\"\n       sự kiện: compositionstart data=\"\" · compositionupdate data=\"c\" · input data=\"c\" · compositionupdate data=\"ca\" · input data=\"ca\" · compositionupdate data=\"cam\" · input data=\"cam\" · compositionupdate data=\"cam3\" · input data=\"cam3\" · compositionupdate data=\"cảm\" · input data=\"cảm\" · keydown key=Enter isComposing=true keyCode=13 · input data=\"cảm\"",
  imeDung: "[3.4] dung: nhật ký = \"(chưa gửi gì)\" | ô còn: \"cảm\"\n       sự kiện: compositionstart data=\"\" · compositionupdate data=\"c\" · input data=\"c\" · compositionupdate data=\"ca\" · input data=\"ca\" · compositionupdate data=\"cam\" · input data=\"cam\" · compositionupdate data=\"cam3\" · input data=\"cam3\" · compositionupdate data=\"cảm\" · input data=\"cảm\" · keydown key=Enter isComposing=true keyCode=13 · compositionupdate data=\"cảm\" · input data=\"cảm\" · compositionend data=\"cảm\"",
  vietHoa: "[3.4] Họ tên (viết hoa ngay): \"Nnguyễn\"\n[3.4] Họ tên (viết hoa khi xong): \"Nguyễn\"",
  nfc: "[nfc/nfd] {\n  'nfc.length': 6,\n  'nfd.length': 8,\n  'nfc === nfd': false,\n  \"'Nguyễn Minh An'.includes(nfd)\": false,\n  'nfc === nfd.normalize(NFC)': true,\n  'ma diem (NFD)': 'U+004E U+0067 U+0075 U+0079 U+0065 U+0302 U+0303 U+006E'\n}",
  regex: "[regex ten] {\n  TEN_ASCII: { nfc: false, nfd: false },\n  TEN_KHOANG_DAU: { nfc: true, nfd: true },\n  TEN_UNICODE: { nfc: true, nfd: true }\n}\n[TEN_KHOANG_DAU nhan ca] { 'Ωμέγα': true, 'Жуков': true, '2×3÷6': false }",
  demKyTu: "$ node dem-ky-tu.mjs\nNFC  \"Nguyễn\"    { length: 6, codePoints: 6, graphemes: 6 }\nNFD  \"Nguyễn\"    { length: 8, codePoints: 8, graphemes: 6 }\n     \"Khám 👍🏽\" { length: 9, codePoints: 7, graphemes: 6 }",
  schemaNfd: "[schema] hoTen dai 14 | lyDo NFD dai 1500 → sau parse 500",
  bai3Tong: " ✓ 3.3 — bấm đúp nút Gửi: onGui chạy mấy lần? > người dùng thật bấm đúp (user-event dblClick)\n ✓ 3.3 — bấm đúp nút Gửi: onGui chạy mấy lần? > hai lần submit trong CÙNG một nhịp (hai lệnh submit liền nhau, không có render ở giữa)\n ✓ 3.3 — lỗi từ máy chủ > 400 kèm lỗi từng trường ⇒ gắn vào đúng ô, focus ô đầu tiên có lỗi\n ✓ 3.3 — lỗi từ máy chủ > lỗi mạng ⇒ thông báo chung ở đầu form (role=alert)\n Test Files  1 passed (1)\n      Tests  4 passed (4)",
  bai4Tong: " ✓ 3.4 — Enter khi bộ gõ đang soạn (mô phỏng bằng sự kiện, jsdom) > sai: keydown Enter với isComposing=true ⇒ gửi 1 lần\n ✓ 3.4 — Enter khi bộ gõ đang soạn (mô phỏng bằng sự kiện, jsdom) > đúng: keydown Enter với isComposing=true ⇒ gửi 0 lần\n ✓ 3.4 — Enter khi bộ gõ đang soạn (mô phỏng bằng sự kiện, jsdom) > đúng: Enter SAU khi soạn xong ⇒ gửi, đã chuẩn hoá NFC\n ✓ 3.4 — NFC và NFD: cùng một chữ, hai chuỗi khác nhau > độ dài, so sánh, tìm kiếm\n ✓ 3.4 — NFC và NFD: cùng một chữ, hai chuỗi khác nhau > ba regex tên với NFC và NFD\n ✓ 3.4 — NFC và NFD: cùng một chữ, hai chuỗi khác nhau > schema dự án: NFD vào ⇒ NFC ra; 500 ký tự NFD vẫn qua\n ✓ 3.4 — NFC và NFD: cùng một chữ, hai chuỗi khác nhau > ô tìm bác sĩ: gõ NFD vẫn ra kết quả nhờ boDau (Chương 2)\n Test Files  1 passed (1)\n      Tests  7 passed (7)",
  lamSach: "[lam sach] {\"benhNhan\":{\"hoTen\":\"Nguyễn Thị Ánh\",\"soDienThoai\":\"0901234567\",\"ngaySinh\":\"1995-03-14\"},\"lyDo\":\"Ho khan 3 ngày\"}",
  loiSchema: "[loi] [\n  'benhNhan.hoTen: Họ tên chỉ gồm chữ cái và khoảng trắng',\n  'benhNhan.soDienThoai: Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09',\n  'benhNhan.ngaySinh: Ngày sinh không được ở tương lai',\n  'lyDo: Hãy ghi ngắn gọn lý do khám'\n]",
  loiForm: "[loi] [\n  'Họ tên cần ít nhất 2 ký tự',\n  'Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09',\n  'Chọn ngày sinh',\n  'Hãy ghi ngắn gọn lý do khám'\n]",
  duLieuGui: "[du lieu gui] {\"benhNhan\":{\"hoTen\":\"Nguyễn Thị Ánh\",\"soDienThoai\":\"0901234567\",\"ngaySinh\":\"1995-03-14\"},\"lyDo\":\"Bé ho khan 3 ngày\"}",
  buildTruoc: "dist/assets/index-D9FdfdDC.css    2.65 kB │ gzip:  0.92 kB\ndist/assets/index-DX3YJIhK.js   224.94 kB │ gzip: 70.75 kB\n✓ built in 273ms",
  build: "vite v8.3.1 building client environment for production...\ntransforming...\n✓ 130 modules transformed.\nrendering chunks...\ncomputing gzip size...\ndist/index.html                   0.46 kB │ gzip:   0.30 kB\ndist/assets/index-BauIzSJZ.css    3.67 kB │ gzip:   1.14 kB\ndist/assets/index-DbMQtyWC.js   342.25 kB │ gzip: 106.88 kB\n\n✓ built in 493ms",
  buildSoSanh: "# trước Chương 3 (sau Chương 2)\ndist/assets/index-D9FdfdDC.css    2.65 kB │ gzip:  0.92 kB\ndist/assets/index-DX3YJIhK.js   224.94 kB │ gzip: 70.75 kB\n✓ built in 273ms\n\n# sau Chương 3\nvite v8.3.1 building client environment for production...\ntransforming...\n✓ 130 modules transformed.\nrendering chunks...\ncomputing gzip size...\ndist/index.html                   0.46 kB │ gzip:   0.30 kB\ndist/assets/index-BauIzSJZ.css    3.67 kB │ gzip:   1.14 kB\ndist/assets/index-DbMQtyWC.js   342.25 kB │ gzip: 106.88 kB\n\n✓ built in 493ms",
  imeSuKien: "compositionstart data=\"\"\ncompositionupdate data=\"c\"\ninput data=\"c\"\ncompositionupdate data=\"ca\"\ninput data=\"ca\"\ncompositionupdate data=\"cam\"\ninput data=\"cam\"\ncompositionupdate data=\"cam3\"\ninput data=\"cam3\"\ncompositionupdate data=\"cảm\"\ninput data=\"cảm\"\nkeydown key=Enter isComposing=true keyCode=13\ncompositionupdate data=\"cảm\"\ninput data=\"cảm\"\ncompositionend data=\"cảm\"",
  imeDungKq: "[3.4] dung: nhật ký = \"(chưa gửi gì)\" | ô còn: \"cảm\"",
  tongDuAn: "$ npx tsc -b && npx vitest run\n Test Files  6 passed (6)\n      Tests  27 passed (27)",
};


export default {
  title: 'Chapter 3 — Forms|||Chương 3 — Form',
  description: 'Form theo cách công ty làm: ô kiểm soát và không kiểm soát, useRef, React Hook Form + Zod dùng chung schema với máy chủ, lỗi đúng chỗ, trạng thái đang gửi, chặn gửi hai lần, và gõ tiếng Việt với bộ gõ (IME) — mọi hành vi đo thật bằng Vitest và Chromium.',
  lessons: [

    /* ─────────────────────────── 3.0 ─────────────────────────── */
    {
      title: '3.0 — Chapter 3 slides: forms in pictures|||3.0 — Slide Chương 3: form bằng hình',
      slug: 'rx-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Chương 3: ô kiểm soát và không kiểm soát (đo số lần commit), cảnh báo thật của React, React Hook Form + Zod, z.input/z.output, mode, watch vs useWatch, lỗi đúng chỗ, bốn trạng thái gửi, bấm đúp đo trong Chromium, lỗi máy chủ, bộ gõ tiếng Việt, NFC/NFD và regex tên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Slides</span>
<h2>The whole chapter in 30 slides</h2>
<p class="lead">Chapter 2 gave the doctor list a memory. This chapter lets the patient type something back: a booking form with name, Vietnamese phone number, date of birth and reason for the visit. By the end the form checks every field against one Zod schema, shows each error under the right input, locks itself while sending, cannot be submitted twice, and survives Vietnamese input methods.</p>
<p>Slides 3–8 belong to Lesson 3.1 (controlled and uncontrolled inputs, React&#39;s two warnings, <code>useRef</code>), 9–14 to 3.2 (React Hook Form, Zod, <code>z.input</code> vs <code>z.output</code>, validation modes, <code>watch</code> vs <code>useWatch</code>), 15–20 to 3.3 (errors, the four states of a submit, double submission, server errors) and 21–26 to 3.4 (IME composition, Enter while composing, NFC/NFD, name regexes, and what still needs a real keyboard). Slide 27 shows the finished form, then come the common mistakes, a cheat sheet and the "keep building the project" checklist. Every number and screenshot is real: measured on 25 September 2026 with React 19.3.0, React Hook Form 7.88.0, Zod 4.6.5, Vitest 5.0.1, and a real Chromium 141 driven by Playwright. The Vietnamese input method in 3.4 is <em>simulated</em> through Chromium&#39;s own IME API; the slides say so, and the lesson lists what must be tried by hand.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Slide</span>
<h2>Cả chương trong 30 slide</h2>
<p class="lead">Chương 2 cho danh sách bác sĩ một bộ nhớ. Chương này để bệnh nhân gõ ngược lại: một form đặt lịch gồm họ tên, số điện thoại Việt Nam, ngày sinh và lý do khám. Hết chương, form kiểm mọi ô bằng MỘT schema Zod, hiện lỗi ngay dưới đúng ô, tự khoá khi đang gửi, không gửi được hai lần, và không vỡ khi bạn gõ bằng bộ gõ tiếng Việt.</p>
<p>Slide 3–8 thuộc Bài 3.1 (ô kiểm soát và không kiểm soát, hai cảnh báo của React, <code>useRef</code>), 9–14 thuộc 3.2 (React Hook Form, Zod, <code>z.input</code> và <code>z.output</code>, các mode kiểm, <code>watch</code> và <code>useWatch</code>), 15–20 thuộc 3.3 (lỗi, bốn trạng thái của một lần gửi, gửi hai lần, lỗi từ máy chủ), 21–26 thuộc 3.4 (bộ gõ "soạn" chữ, Enter khi đang gõ dấu, NFC/NFD, regex tên, và những gì còn phải thử bằng bàn phím thật). Slide 27 là form hoàn chỉnh, rồi tới sai lầm hay gặp, bảng tra nhanh và danh sách "tự gõ tiếp dự án". Mọi con số và ảnh chụp là THẬT: đo ngày 25/09/2026 bằng React 19.3.0, React Hook Form 7.88.0, Zod 4.6.5, Vitest 5.0.1 và một Chromium 141 thật do Playwright điều khiển. Bộ gõ tiếng Việt ở 3.4 là <em>mô phỏng</em> qua API bộ gõ của chính Chromium; slide ghi rõ điều đó, và bài liệt kê những gì phải thử bằng tay.</p>
</div>
${gallery('rx-03', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Ô input tự có bộ nhớ — ai là nguồn sự thật'], [4, 'Ô kiểm soát: một vòng render mỗi phím'], [5, 'Đo thật: 12 commit và 0 commit'],
  [6, 'Hai cảnh báo kinh điển'], [7, 'Mỗi loại ô đọc giá trị ở một chỗ'], [8, 'useRef: hộp nhớ không gây render'],
  [9, 'React Hook Form: register'], [10, 'Zod: một schema cho luật, kiểu và lỗi'], [11, 'z.input và z.output'],
  [12, 'TypeScript bắt tên trường gõ sai'], [13, 'mode: lỗi hiện lúc nào'], [14, 'watch và useWatch'],
  [15, 'Lỗi dưới ô, aria, focus'], [16, 'Bốn trạng thái của một lần gửi'], [17, 'Bấm đúp đo trong Chromium'],
  [18, 'isSubmitting khoá sau, ref khoá ngay'], [19, 'Chốt ref đặt sai chỗ'], [20, 'Máy chủ vẫn phải kiểm'],
  [21, 'Ba sự kiện composition'], [22, 'Enter khi đang soạn'], [23, 'Sửa value giữa lúc soạn'],
  [24, 'NFC và NFD'], [25, 'Regex tên'], [26, 'Mô phỏng và thử tay'],
  [27, 'Kết quả chương'], [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh'], [30, 'Tự gõ tiếp dự án'],
])}
`,
    },

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Controlled and uncontrolled inputs: value/onChange, defaultValue, useRef|||3.1 — Input kiểm soát và không kiểm soát: value/onChange, defaultValue, useRef',
      slug: 'rx-3-1-controlled',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ô input tự có bộ nhớ: để DOM giữ (defaultValue + useRef, FormData) hay để state giữ (value + onChange); đo số lần commit mỗi phím, hai cảnh báo thật của React, nhiều ô một handler, checkbox/select/number, useRef để focus.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Controlled and uncontrolled inputs: value/onChange, defaultValue, useRef and FormData</h2>
<p class="lead">Every <code>&lt;input&gt;</code> in the browser already remembers what you typed into it. Before React can help with a form, you have to decide one thing: does the <strong>DOM</strong> keep that value, or does <strong>React state</strong> keep it? That single decision is what "controlled (được kiểm soát)" and "uncontrolled (không được kiểm soát)" mean, and it explains most form bugs you will meet in your first job.</p>

<p>This lesson builds both kinds side by side, then measures what each one costs: how many times React re-renders while you type, what React prints when you mix the two, and what each kind can do that the other cannot. Everything below ran in the chapter&#39;s test project (React 19.3.0, Vitest 5.0.1, a real Chromium 141 through Playwright). Outputs are pasted, not paraphrased.</p>

<h3>An input already has a memory</h3>
${slide('rx-03', 3, 'Ô input tự có bộ nhớ — bạn chọn ai là nguồn sự thật')}
<p>Open any plain HTML page with an <code>&lt;input&gt;</code>, type "Trần Thu Hà", and the text stays there. No JavaScript was involved: the browser stores the current text on the DOM element itself, in its <code>value</code> property. When you use that input inside React, two owners are possible for the same piece of text:</p>
<ul>
<li><strong>Uncontrolled.</strong> The DOM keeps the value. React renders the input once (optionally with a starting value via <code>defaultValue</code>) and then stays out of the way. When you need the text — usually at submit time — you go and read it from the element.</li>
<li><strong>Controlled.</strong> A piece of React state keeps the value. You pass it in with <code>value={ten}</code>, and every keystroke goes through your <code>onChange</code>, which calls <code>setTen</code>. The input only ever <em>shows</em> what the state says.</li>
</ul>
<p>The phrase you will hear in reviews and interviews is <strong>source of truth (nguồn sự thật)</strong>: in a controlled input, state is the source of truth; in an uncontrolled one, the DOM is. Neither is "the right one". They are tools with different costs, and serious form libraries pick one deliberately — React Hook Form, which you meet in 3.2, is built on uncontrolled inputs.</p>

<h3>Uncontrolled: let the DOM keep it, read it with a ref</h3>
<p>Here is the smallest useful uncontrolled form. It shows a starting name, lets you edit it freely, and reads the final text only when you press "Gửi":</p>
${pre('tsx', SN.khongKiemSoat)}
<p>Three new things appear in those lines:</p>
<ul>
<li><code>defaultValue="Nguyễn Văn A"</code> sets the text the input starts with. After that React never touches it again. (Writing <code>value</code> here instead would make it controlled — and read-only, as you will see below.)</li>
<li><code>useRef&lt;HTMLInputElement&gt;(null)</code> creates a small box <code>{ current: null }</code> that survives re-renders. Passing it as <code>ref={oTen}</code> asks React to put the real DOM element into <code>oTen.current</code> after the input is created.</li>
<li>In the submit handler, <code>oTen.current?.value ?? &#39;&#39;</code> reads the text straight from the element.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — <code>?.</code> and <code>??</code>.</strong> <code>a?.b</code> is "optional chaining": if <code>a</code> is <code>null</code> or <code>undefined</code>, the whole expression becomes <code>undefined</code> instead of throwing "Cannot read properties of null". <code>x ?? y</code> is "nullish coalescing": use <code>x</code>, unless it is <code>null</code>/<code>undefined</code>, then use <code>y</code>. Together: "read the value if the element exists, otherwise use an empty string". TypeScript insists on it because <code>oTen.current</code> really is <code>null</code> before the first render.</p></div>
<p>The test in the project clears the box, types "Trần Thu Hà", presses "Gửi" and checks that <code>onGui</code> received exactly that text. It passes — the DOM held the value the whole time and React never re-rendered while you typed. That last part is the important one; hold on to it.</p>

<h3>Controlled: state is the source of truth</h3>
${slide('rx-03', 4, 'Ô kiểm soát: value + onChange, mỗi phím đi hết một vòng render')}
<p>The controlled version keeps the text in state and hands it to the input on every render:</p>
${pre('tsx', SN.kiemSoat)}
<p>Follow one keystroke through it, because every controlled input in every React app works this way:</p>
<ol>
<li>You press "L". The browser is about to change the text in the box.</li>
<li>React calls your <code>onChange</code>. Note: React&#39;s <code>onChange</code> fires on <strong>every keystroke</strong> — it behaves like the browser&#39;s <code>input</code> event, not like the DOM&#39;s <code>change</code> event that waits until you leave the field. <code>e.target.value</code> is the text <em>including</em> the new letter.</li>
<li><code>setTen(e.target.value)</code> asks React for a new render (Chapter 2: trigger).</li>
<li>React calls <code>OTenKiemSoat</code> again; this time <code>ten</code> holds the new text, and the JSX says <code>value={ten}</code>.</li>
<li>Commit: React makes sure the DOM input shows exactly that string.</li>
</ol>
<p>The payoff is that the text now lives in your component. The greeting line <code>Xin chào, {ten}</code> updates as you type, without reading anything from the DOM. Anything else in the component — a character counter, a disabled button, a preview — can use <code>ten</code> directly.</p>

<h3>What only a controlled input can do — and what it costs</h3>
${slide('rx-03', 5, 'Đo thật: ô kiểm soát commit 12 lần, ô không kiểm soát 0 lần')}
<p>Because every keystroke passes through your code before it reaches the screen, a controlled input can <em>change</em> what the user typed on the way in. The classic example is formatting a phone number while typing:</p>
${pre('tsx', SN.dinhDangSdt)}
<p>The test types a deliberately messy string, including a letter and a dot:</p>
${out(OUT.sdt)}
<p>The letter and the dot never appear; the spaces appear by themselves. An uncontrolled input cannot do this, because React is not in the loop between the keystroke and the screen.</p>
<p>Now the cost. React ships a component called <code>&lt;Profiler&gt;</code> whose <code>onRender</code> callback runs once per commit of the tree inside it. The test wraps a controlled form and an uncontrolled form in two profilers and types the same 12 characters into each:</p>
${pre('tsx', SN.testDoCommit)}
${out(OUT.commit)}
<p>Twelve commits against zero. The same thing measured in a real Chromium (the chapter&#39;s demo page clears the box and types "Trần Thu Hà", 11 characters, into both inputs) gives <strong>12</strong> and <strong>0</strong> — the screenshot on the slide is that page. For one input in a small component, twelve renders are nothing; do not "optimise" it. It matters when a form has thirty fields, sits inside a large tree, and every keystroke re-renders all of it. That is the exact problem React Hook Form was designed around, and why 3.2 switches to it for the booking form.</p>
<p>A small honest note about the phone formatter: it has limits. <code>dinhDangSdt(&#39;+84 901 234 567&#39;)</code> returns <code>&#39;8490 123 456&#39;</code> — it does not understand the country code and silently drops the last digit. The test pins that result on purpose. Formatting while typing is a UX nicety; <em>validation</em> belongs in a schema, which handles <code>+84</code> properly in 3.2.</p>

<h3>The two warnings React will throw at you</h3>
${slide('rx-03', 6, 'Hai cảnh báo kinh điển của React về ô kiểm soát')}
<p>Mixing the two models produces two warnings that every React developer has seen. The test file captures <code>console.error</code> so you can read React&#39;s real text.</p>
<p><strong>1. A value with no way to change it.</strong></p>
${pre('tsx', SN.valueKhongOnChange)}
${out(OUT.canhBaoValue)}
<p>You told React "this input shows exactly <code>ten</code>", but gave it no way to update <code>ten</code>. So the user types, React re-renders with the old value, and the letters vanish. The test types "xyz" and the input still says "Nguyễn Văn A". The warning even lists the three fixes: add <code>onChange</code>, switch to <code>defaultValue</code>, or mark it <code>readOnly</code> if read-only is what you meant.</p>
<p><strong>2. Switching from uncontrolled to controlled.</strong></p>
${pre('tsx', SN.tuKhongSangCo)}
${out(OUT.canhBaoUndef)}
<p><code>useState&lt;string&gt;()</code> with no argument starts as <code>undefined</code>. React treats <code>value={undefined}</code> as "no value prop", i.e. uncontrolled. The first keystroke sets a string, and now the same input is controlled. React cannot decide which one you meant, so it warns. The fix is one character pair: <code>useState(&#39;&#39;)</code>. A controlled input should always receive a string, never <code>undefined</code> or <code>null</code>.</p>
<div class="pitfall co-tieu-de"><strong>Trap — data from an API with <code>null</code> fields.</strong> The most common way to hit warning 2 at work is not <code>useState()</code>. It is loading a patient record where <code>ghiChu</code> is <code>null</code> in the database and writing <code>value={benhNhan.ghiChu}</code>. The first render gets <code>null</code> (uncontrolled), the user types, and React warns — or worse, after a refetch the field silently snaps back to empty. Normalise at the edge: <code>value={benhNhan.ghiChu ?? &#39;&#39;}</code>, or better, give the form proper default values (React Hook Form&#39;s <code>defaultValues</code>, 3.2) so no field ever starts as <code>null</code>.</div>

<h3>Many inputs, one object, one handler</h3>
${slide('rx-03', 7, 'Mỗi loại ô đọc và ghi giá trị ở một chỗ khác nhau')}
<p>A real form has several fields. Writing one <code>useState</code> and one handler per field works, but gets long. The usual hand-written pattern keeps the whole form in one object and uses the input&#39;s <code>name</code> to decide which field to update:</p>
${pre('tsx', SN.nhieuO)}
<div class="callout"><p><strong>JS quick reminder — three pieces of syntax in one line.</strong> <code>const { name, value } = e.target</code> is <em>object destructuring</em>: it creates two variables from two properties of <code>e.target</code>. <code>{ ...cu, [name]: giaTri }</code> is an <em>object spread</em> (copy every field of <code>cu</code>) followed by a <em>computed property name</em>: the square brackets mean "use the value of the variable <code>name</code> as the key", so when <code>name</code> is <code>"hoTen"</code> it writes <code>hoTen: giaTri</code>. And <code>setBn((cu) =&gt; …)</code> is the updater form from Chapter 2, so fast typing never uses a stale copy.</p></div>
<p>The test fills every field type and submits:</p>
${out(OUT.nhieuO)}
<p>Each kind of input keeps its value in a slightly different place, and this is where hand-written forms usually break:</p>
<table>
<thead><tr><th>Input</th><th>Controlled with</th><th>Read in onChange</th><th>Gotcha</th></tr></thead>
<tbody>
<tr><td><code>&lt;input&gt;</code> (text, tel, email)</td><td><code>value</code></td><td><code>e.target.value</code></td><td>Always a string.</td></tr>
<tr><td><code>type="number"</code></td><td><code>value</code></td><td><code>e.target.value</code></td><td>Still a <strong>string</strong> (<code>"12"</code>). Use <code>e.target.valueAsNumber</code> or convert in your schema.</td></tr>
<tr><td><code>type="checkbox"</code></td><td><code>checked</code></td><td><code>e.target.checked</code></td><td><code>value</code> on a checkbox is the text sent with the form, not whether it is ticked.</td></tr>
<tr><td><code>type="radio"</code></td><td><code>checked</code> on each option</td><td><code>e.target.value</code> of the chosen one</td><td>Same <code>name</code> for the whole group.</td></tr>
<tr><td><code>&lt;select&gt;</code></td><td><code>value</code> on the <code>select</code></td><td><code>e.target.value</code></td><td>Not <code>selected</code> on an <code>&lt;option&gt;</code> like plain HTML.</td></tr>
<tr><td><code>&lt;textarea&gt;</code></td><td><code>value</code></td><td><code>e.target.value</code></td><td>Not children text like plain HTML.</td></tr>
<tr><td><code>type="file"</code></td><td>— (always uncontrolled)</td><td><code>e.target.files</code></td><td>The browser forbids setting its value from code.</td></tr>
</tbody></table>

<h3>useRef: a box that does not re-render</h3>
${slide('rx-03', 8, 'useRef: hộp nhớ không gây render, hợp để đưa focus')}
<p>You have now used <code>useRef</code> once, to read an input. Its real job is broader: it gives a component a mutable box, <code>{ current }</code>, that lives as long as the component and that React <strong>never</strong> watches. Changing <code>ref.current</code> does not cause a render. That makes it perfect for two things in forms: reaching the DOM element (focus, scroll, measuring) and keeping flags that the screen does not need to show (you will use one to block double submissions in 3.3).</p>
<p>A very common use is putting the cursor back after clearing a field:</p>
${pre('tsx', SN.focusRef)}
<p>Notice this input is <em>controlled</em> and <em>also</em> has a ref. The two are independent: state decides what the input shows, the ref gives you the element so you can call <code>.focus()</code> on it. The test types "Huy", presses "Xoá", and checks both that the box is empty and that it has focus.</p>
<table>
<thead><tr><th>Tool</th><th>Does changing it re-render?</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><code>useState</code></td><td>Yes</td><td>Anything that appears on screen</td></tr>
<tr><td><code>useRef</code></td><td>No</td><td>DOM elements (focus, measure), timers, "is sending" flags</td></tr>
<tr><td>A plain <code>let</code> in the component</td><td>No — and it resets every render</td><td>Temporary values inside one render only</td></tr>
</tbody></table>
<p>Rule of thumb from react.dev: do not read or write <code>ref.current</code> during rendering (in the component body); do it in event handlers and effects. Reading it while rendering makes the output depend on something React cannot see.</p>

<h3>No state, no ref: read FormData at submit</h3>
<p>There is a third option that people forget: let every input be uncontrolled, give each one a <code>name</code>, and read them all at once when the form submits. The browser has a built-in object for exactly this, <code>FormData</code>:</p>
${pre('tsx', SN.formData)}
${out(OUT.formData)}
<p><code>new FormData(form)</code> collects every field that has a <code>name</code>; <code>Object.fromEntries</code> turns its list of <code>[name, value]</code> pairs into a plain object. No state, no refs, no re-renders while typing. This is how HTML forms have always worked, and React 19 builds on it: you can pass a function to <code>&lt;form action={fn}&gt;</code>, React calls it with the <code>FormData</code>, and after it succeeds React resets the uncontrolled fields for you. That is Chapter 12 material (Actions); for now it is enough to know that "uncontrolled" is not old-fashioned — it is where the platform and React are heading.</p>

<h3>When to use which</h3>
<table>
<thead><tr><th>Situation</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>A search box that filters a list as you type</td><td>Controlled</td><td>Other parts of the screen need the text on every keystroke.</td></tr>
<tr><td>Formatting or restricting input while typing</td><td>Controlled</td><td>Only a controlled input can rewrite the value on the way in.</td></tr>
<tr><td>A form that is only read when submitted</td><td>Uncontrolled (FormData or a form library)</td><td>No re-render per keystroke, less code.</td></tr>
<tr><td>A real business form with validation, errors, async submit</td><td>React Hook Form + Zod (uncontrolled underneath)</td><td>Lesson 3.2 — validation, types and error state for free.</td></tr>
<tr><td>File upload</td><td>Uncontrolled</td><td>The only option the browser allows.</td></tr>
</tbody></table>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 labs usually write every form by hand: one <code>useState</code> per field (or <code>this.state</code> plus a <code>handleChange</code> with <code>[e.target.name]</code> in older class-component slides), React-Bootstrap&#39;s <code>&lt;Form.Control value={…} onChange={…} /&gt;</code>, and a <code>handleSubmit</code> full of <code>if</code> statements that fill an <code>errors</code> object. → At a company, a small interactive input (a search box, a toggle) is still a controlled input exactly like above, but any form that is <em>submitted</em> — sign-up, checkout, booking — is built with <strong>React Hook Form + Zod</strong>. · <em>Why:</em> the hand-written version re-renders the whole form on every keystroke (measured: 12 commits for 12 characters), duplicates validation rules between client and server, and has no types tying the fields to the data you send. Your FER202 way is not wrong — it is exactly how you learn what a form library does for you, and you will meet it again in older codebases and in quick internal tools.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What is the difference between a controlled and an uncontrolled input?</strong><br>A: In a controlled input React state is the source of truth: I pass <code>value</code> and update state in <code>onChange</code>, so every keystroke re-renders. In an uncontrolled input the DOM keeps the value; I set a starting value with <code>defaultValue</code> and read the value with a ref or <code>FormData</code> when I need it. Controlled lets me react to every change (format, validate live, enable buttons); uncontrolled is cheaper and is what React Hook Form builds on.</p>
<p><strong>Q: Why does my input not let me type?</strong><br>A: It has a <code>value</code> but no <code>onChange</code> (or the handler does not update the state behind <code>value</code>). React warns "You provided a <code>value</code> prop to a form field without an <code>onChange</code> handler" and re-renders the old value on every keystroke.</p>
<p><strong>Q: When do you reach for <code>useRef</code> in a form?</strong><br>A: To reach the DOM element — focus the first invalid field, focus back after clearing — and to hold values that must not trigger a render, such as an "is submitting" flag.</p>
</div>

<h3>Run it step by step</h3>
<ol>
<li>In your Vite project, create <code>src/vi-du/OTen.tsx</code> with the uncontrolled version. Render it in <code>App.tsx</code>, type, press "Gửi", and <code>console.log</code> the value.</li>
<li>Change <code>defaultValue</code> to <code>value</code> and try to type. Open the console: you will see warning 1 above.</li>
<li>Write the controlled version with <code>useState(&#39;&#39;)</code> and a greeting line. Then change it to <code>useState&lt;string&gt;()</code>, type one letter, and read warning 2.</li>
<li>Add the phone formatter. Type <code>09a01.23456789</code> and watch the letter disappear.</li>
<li>Wrap each version in <code>&lt;Profiler id="…" onRender={(id, phase) =&gt; console.log(id, phase)}&gt;</code> and count the <code>update</code> lines while typing.</li>
<li>Run the tests. All nine tests of the lesson file pass on the build machine:</li>
</ol>
${out(OUT.bai1Tong)}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic&#39;s reception wants a "note to the doctor" box: at most 200 characters, with a live "còn N ký tự" counter and a "Xoá" button that empties the box and puts the cursor back in it.</p><ol>
<li>Build <code>OGhiChu</code> as a <strong>controlled</strong> <code>&lt;textarea&gt;</code> (why controlled? the counter needs the text on every keystroke).</li>
<li>Show <code>còn {200 - noiDung.length} ký tự</code> under it, and stop accepting input after 200 characters by cutting in <code>onChange</code> (<code>e.target.value.slice(0, 200)</code>).</li>
<li>Add a "Xoá" button that sets the text to <code>&#39;&#39;</code> and calls <code>ref.current?.focus()</code>.</li>
<li>Write three tests with Testing Library: typing "Tái khám" shows "còn 192 ký tự"; pasting 250 characters leaves exactly 200; "Xoá" empties the box and the box has focus.</li>
</ol><p><strong>Done when:</strong> <code>npx vitest run</code> shows your three tests green, <code>npx tsc -b</code> is clean, and the browser console shows no React warning while you type.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">controlled input (ô kiểm soát)</span><span class="v">React state holds the value; the input gets <code>value</code> and changes go through <code>onChange</code></span></div>
<div class="kv"><span class="k">uncontrolled input (ô không kiểm soát)</span><span class="v">the DOM holds the value; React sets only <code>defaultValue</code> and reads the value when needed</span></div>
<div class="kv"><span class="k">source of truth (nguồn sự thật)</span><span class="v">the one place a value really lives; every other place just displays it</span></div>
<div class="kv"><span class="k">defaultValue / defaultChecked</span><span class="v">starting value of an uncontrolled field; React ignores later changes to it</span></div>
<div class="kv"><span class="k">ref / useRef</span><span class="v">a <code>{ current }</code> box that survives renders and does not cause them; <code>ref={r}</code> puts a DOM element in it</span></div>
<div class="kv"><span class="k">FormData</span><span class="v">browser object that collects every named field of a form at once</span></div>
<div class="kv"><span class="k">computed property name</span><span class="v"><code>{ [name]: v }</code> — the key comes from a variable</span></div>
<div class="kv"><span class="k">Profiler</span><span class="v">React component whose <code>onRender</code> runs once per commit; used here to count re-renders</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An input always has a value; you choose whether the DOM (uncontrolled) or React state (controlled) owns it.</li>
<li>Controlled: <code>value</code> + <code>onChange</code>; one render per keystroke (measured 12 for 12); can rewrite input as it arrives.</li>
<li>Uncontrolled: <code>defaultValue</code> + a ref or <code>FormData</code>; zero renders while typing; read the value when you need it.</li>
<li>Warnings: <code>value</code> without <code>onChange</code> is read-only; <code>undefined</code> → string switches models — start from <code>&#39;&#39;</code>.</li>
<li>Checkbox uses <code>checked</code>; number inputs still give strings; select and textarea use <code>value</code>; file inputs are always uncontrolled.</li>
<li><code>useRef</code> holds DOM elements and flags without re-rendering — focus, measure, "is sending".</li>
</ul>

${LINK('https://react.dev/reference/react-dom/components/input', '📄', 'react.dev — &lt;input&gt;', 'Controlled vs uncontrolled, every prop, and the troubleshooting section for both warnings.')}
${LINK('https://react.dev/reference/react-dom/components/select', '📄', 'react.dev — &lt;select&gt;', 'Why value goes on the select, and multiple selection.')}
${LINK('https://react.dev/reference/react/useRef', '📄', 'react.dev — useRef', 'Refs that survive renders; do not read or write ref.current during rendering.')}
${LINK('https://react.dev/learn/manipulating-the-dom-with-refs', '📄', 'react.dev — Manipulating the DOM with Refs', 'Focus, scroll and measure: the jobs refs are for.')}
${LINK('https://react.dev/reference/react-dom/components/form', '📄', 'react.dev — &lt;form&gt;', 'The action prop, FormData, and automatic reset of uncontrolled fields in React 19.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Input kiểm soát và không kiểm soát: value/onChange, defaultValue, useRef và FormData</h2>
<p class="lead">Mỗi <code>&lt;input&gt;</code> trong trình duyệt vốn đã tự nhớ thứ bạn gõ vào. Trước khi React giúp được gì cho một form, bạn phải quyết một việc: <strong>DOM</strong> giữ giá trị đó, hay <strong>state của React</strong> giữ nó? Chỉ một quyết định ấy là toàn bộ ý nghĩa của "controlled (được kiểm soát)" và "uncontrolled (không được kiểm soát)" — và nó giải thích phần lớn bug form bạn sẽ gặp ở công việc đầu tiên.</p>

<p>Bài này dựng cả hai loại cạnh nhau, rồi ĐO cái giá của từng loại: React render lại bao nhiêu lần khi bạn gõ, React in ra gì khi bạn trộn hai loại, và mỗi loại làm được điều gì mà loại kia không làm được. Mọi thứ dưới đây chạy trong dự án thử của chương (React 19.3.0, Vitest 5.0.1, một Chromium 141 thật qua Playwright). Output dán nguyên, không kể lại.</p>

<h3>Ô input vốn đã có bộ nhớ</h3>
${slide('rx-03', 3, 'Ô input tự có bộ nhớ — bạn chọn ai là nguồn sự thật')}
<p>Mở một trang HTML thường có một <code>&lt;input&gt;</code>, gõ "Trần Thu Hà", chữ nằm yên đó. Không có dòng JavaScript nào: trình duyệt cất chữ hiện tại ngay trên phần tử DOM, trong thuộc tính <code>value</code> của nó. Khi dùng ô đó trong React, cùng một mẩu chữ có thể có hai chủ:</p>
<ul>
<li><strong>Không kiểm soát (uncontrolled).</strong> DOM giữ giá trị. React vẽ ô một lần (có thể kèm giá trị ban đầu qua <code>defaultValue</code>) rồi đứng ngoài. Khi cần chữ — thường là lúc gửi — bạn tự đi đọc nó từ phần tử.</li>
<li><strong>Kiểm soát (controlled).</strong> Một mẩu state của React giữ giá trị. Bạn đưa nó vào bằng <code>value={ten}</code>, và mỗi phím đều đi qua <code>onChange</code> của bạn, nơi gọi <code>setTen</code>. Ô chỉ luôn <em>hiện</em> đúng thứ state nói.</li>
</ul>
<p>Cụm từ bạn sẽ nghe trong review mã và phỏng vấn là <strong>source of truth (nguồn sự thật)</strong>: ở ô kiểm soát, state là nguồn sự thật; ở ô không kiểm soát, DOM là nguồn sự thật. Không cái nào là "cái đúng". Chúng là hai công cụ với cái giá khác nhau, và các thư viện form nghiêm túc chọn một cách có chủ ý — React Hook Form mà bạn gặp ở 3.2 được xây trên ô KHÔNG kiểm soát.</p>

<h3>Không kiểm soát: để DOM giữ, đọc bằng ref</h3>
<p>Đây là form không kiểm soát nhỏ nhất mà vẫn có ích. Nó hiện sẵn một tên, cho bạn sửa thoải mái, và chỉ đọc chữ cuối cùng khi bạn bấm "Gửi":</p>
${pre('tsx', SN.khongKiemSoat)}
<p>Ba thứ mới xuất hiện trong mấy dòng đó:</p>
<ul>
<li><code>defaultValue="Nguyễn Văn A"</code> đặt chữ ban đầu của ô. Sau đó React không bao giờ đụng lại. (Viết <code>value</code> ở đây thay vì <code>defaultValue</code> sẽ biến nó thành ô kiểm soát — và chỉ đọc, như bạn sẽ thấy bên dưới.)</li>
<li><code>useRef&lt;HTMLInputElement&gt;(null)</code> tạo một chiếc hộp nhỏ <code>{ current: null }</code> sống qua các lần render. Đưa nó vào <code>ref={oTen}</code> là nhờ React bỏ phần tử DOM thật vào <code>oTen.current</code> sau khi tạo ô.</li>
<li>Trong hàm gửi, <code>oTen.current?.value ?? &#39;&#39;</code> đọc chữ thẳng từ phần tử.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — <code>?.</code> và <code>??</code>.</strong> <code>a?.b</code> là "optional chaining (truy cập tuỳ chọn)": nếu <code>a</code> là <code>null</code> hoặc <code>undefined</code>, cả biểu thức thành <code>undefined</code> thay vì ném lỗi "Cannot read properties of null". <code>x ?? y</code> là "nullish coalescing (lấy giá trị thay thế khi rỗng)": dùng <code>x</code>, trừ khi nó là <code>null</code>/<code>undefined</code> thì dùng <code>y</code>. Ghép lại: "đọc value nếu phần tử đã có, không thì lấy chuỗi rỗng". TypeScript bắt bạn viết vậy vì trước lần render đầu <code>oTen.current</code> đúng là <code>null</code>.</p></div>
<p>Test trong dự án xoá ô, gõ "Trần Thu Hà", bấm "Gửi" và kiểm <code>onGui</code> nhận đúng chữ đó. Test xanh — DOM giữ giá trị suốt, và React không render lại lần nào khi bạn gõ. Ý cuối là ý quan trọng; nhớ nó.</p>

<h3>Kiểm soát: state là nguồn sự thật</h3>
${slide('rx-03', 4, 'Ô kiểm soát: value + onChange, mỗi phím đi hết một vòng render')}
<p>Bản kiểm soát giữ chữ trong state và đưa nó cho ô ở mỗi lần render:</p>
${pre('tsx', SN.kiemSoat)}
<p>Theo chân MỘT phím đi qua nó, vì mọi ô kiểm soát trong mọi ứng dụng React đều chạy đúng như vậy:</p>
<ol>
<li>Bạn nhấn "L". Trình duyệt chuẩn bị đổi chữ trong ô.</li>
<li>React gọi <code>onChange</code> của bạn. Lưu ý: <code>onChange</code> của React chạy <strong>theo từng phím</strong> — nó giống sự kiện <code>input</code> của trình duyệt, không giống sự kiện <code>change</code> của DOM (thứ đợi tới lúc bạn rời ô). <code>e.target.value</code> là chữ <em>đã có</em> ký tự mới.</li>
<li><code>setTen(e.target.value)</code> xin React một lần render mới (Chương 2: trigger).</li>
<li>React gọi lại <code>OTenKiemSoat</code>; lần này <code>ten</code> mang chữ mới, và JSX ghi <code>value={ten}</code>.</li>
<li>Commit: React bảo đảm ô trong DOM hiện đúng chuỗi đó.</li>
</ol>
<p>Cái lợi là chữ giờ sống trong component của bạn. Dòng chào <code>Xin chào, {ten}</code> cập nhật theo từng phím mà không phải đọc gì từ DOM. Mọi thứ khác trong component — bộ đếm ký tự, nút bị khoá, phần xem trước — đều dùng thẳng được <code>ten</code>.</p>

<h3>Thứ chỉ ô kiểm soát làm được — và cái giá của nó</h3>
${slide('rx-03', 5, 'Đo thật: ô kiểm soát commit 12 lần, ô không kiểm soát 0 lần')}
<p>Vì mỗi phím đi qua mã của bạn trước khi lên màn hình, ô kiểm soát có thể <em>sửa</em> thứ người dùng gõ ngay trên đường vào. Ví dụ kinh điển: định dạng số điện thoại trong lúc gõ:</p>
${pre('tsx', SN.dinhDangSdt)}
<p>Test gõ một chuỗi cố tình lộn xộn, có cả chữ cái lẫn dấu chấm:</p>
${out(OUT.sdt)}
<p>Chữ cái và dấu chấm không bao giờ hiện ra; dấu cách tự xuất hiện. Ô không kiểm soát không làm được điều này, vì React không đứng giữa phím bấm và màn hình.</p>
<p>Giờ tới cái giá. React có sẵn một component tên <code>&lt;Profiler&gt;</code>, hàm <code>onRender</code> của nó chạy một lần cho mỗi lần commit của cây bên trong. Test bọc một form kiểm soát và một form không kiểm soát trong hai profiler, rồi gõ cùng 12 ký tự vào mỗi form:</p>
${pre('tsx', SN.testDoCommit)}
${out(OUT.commit)}
<p>Mười hai lần commit so với không lần nào. Đo lại trong Chromium thật (trang ví dụ của chương xoá ô rồi gõ "Trần Thu Hà", 11 ký tự, vào cả hai ô) cho <strong>12</strong> và <strong>0</strong> — ảnh chụp trên slide chính là trang đó. Với một ô trong một component nhỏ, 12 lần render chẳng là gì; đừng "tối ưu" nó. Nó chỉ thành chuyện khi form có ba mươi ô, nằm trong một cây lớn, và mỗi phím làm render lại tất cả. Đó chính xác là bài toán React Hook Form được thiết kế để giải, và là lý do 3.2 chuyển form đặt lịch sang nó.</p>
<p>Một lưu ý thật thà về hàm định dạng số: nó có giới hạn. <code>dinhDangSdt(&#39;+84 901 234 567&#39;)</code> trả về <code>&#39;8490 123 456&#39;</code> — nó không hiểu mã quốc gia và âm thầm bỏ mất số cuối. Test cố ý ghim đúng kết quả đó. Định dạng khi gõ là chuyện trải nghiệm; <em>kiểm tra hợp lệ</em> thuộc về schema, thứ xử lý <code>+84</code> đàng hoàng ở 3.2.</p>

<h3>Hai cảnh báo React sẽ ném vào bạn</h3>
${slide('rx-03', 6, 'Hai cảnh báo kinh điển của React về ô kiểm soát')}
<p>Trộn hai mô hình sinh ra hai cảnh báo mà lập trình viên React nào cũng từng thấy. File test bắt <code>console.error</code> lại để bạn đọc đúng chữ thật của React.</p>
<p><strong>1. Có value mà không có cách đổi nó.</strong></p>
${pre('tsx', SN.valueKhongOnChange)}
${out(OUT.canhBaoValue)}
<p>Bạn bảo React "ô này hiện đúng <code>ten</code>", nhưng không cho nó cách nào cập nhật <code>ten</code>. Người dùng gõ, React render lại với giá trị cũ, chữ biến mất. Test gõ "xyz" và ô vẫn ghi "Nguyễn Văn A". Chính câu cảnh báo liệt kê ba cách sửa: thêm <code>onChange</code>, chuyển sang <code>defaultValue</code>, hoặc ghi <code>readOnly</code> nếu bạn thật sự muốn chỉ đọc.</p>
<p><strong>2. Chuyển từ không kiểm soát sang kiểm soát.</strong></p>
${pre('tsx', SN.tuKhongSangCo)}
${out(OUT.canhBaoUndef)}
<p><code>useState&lt;string&gt;()</code> không có đối số thì bắt đầu bằng <code>undefined</code>. React hiểu <code>value={undefined}</code> là "không có prop value", tức là ô không kiểm soát. Phím đầu tiên đặt một chuỗi, và giờ cùng ô đó thành kiểm soát. React không biết bạn muốn loại nào, nên nó cảnh báo. Cách sửa chỉ là hai dấu nháy: <code>useState(&#39;&#39;)</code>. Ô kiểm soát lúc nào cũng phải nhận một chuỗi, không bao giờ <code>undefined</code> hay <code>null</code>.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — dữ liệu từ API có trường <code>null</code>.</strong> Cách hay gặp nhất để dính cảnh báo 2 ở công ty không phải <code>useState()</code>. Đó là tải một hồ sơ bệnh nhân mà <code>ghiChu</code> trong CSDL là <code>null</code>, rồi viết <code>value={benhNhan.ghiChu}</code>. Lần render đầu nhận <code>null</code> (không kiểm soát), người dùng gõ, React cảnh báo — tệ hơn, sau một lần tải lại dữ liệu ô âm thầm bật về rỗng. Chuẩn hoá ngay ở mép: <code>value={benhNhan.ghiChu ?? &#39;&#39;}</code>, hoặc tốt hơn, cho form giá trị mặc định đàng hoàng (<code>defaultValues</code> của React Hook Form, 3.2) để không ô nào khởi đầu bằng <code>null</code>.</div>

<h3>Nhiều ô, một object, một handler</h3>
${slide('rx-03', 7, 'Mỗi loại ô đọc và ghi giá trị ở một chỗ khác nhau')}
<p>Form thật có nhiều ô. Viết mỗi ô một <code>useState</code> và một handler vẫn chạy, nhưng dài. Cách tự viết phổ biến là giữ cả form trong một object và dùng <code>name</code> của ô để biết cần sửa field nào:</p>
${pre('tsx', SN.nhieuO)}
<div class="callout"><p><strong>JS nhắc nhanh — ba cú pháp trong một dòng.</strong> <code>const { name, value } = e.target</code> là <em>destructuring object (tách object)</em>: tạo hai biến từ hai thuộc tính của <code>e.target</code>. <code>{ ...cu, [name]: giaTri }</code> là <em>spread object</em> (chép mọi field của <code>cu</code>) rồi tới <em>tên thuộc tính tính toán (computed property)</em>: cặp ngoặc vuông nghĩa là "lấy GIÁ TRỊ của biến <code>name</code> làm tên khoá", nên khi <code>name</code> là <code>"hoTen"</code> nó ghi <code>hoTen: giaTri</code>. Còn <code>setBn((cu) =&gt; …)</code> là dạng cập nhật theo hàm của Chương 2, nên gõ nhanh cũng không bao giờ dùng bản cũ.</p></div>
<p>Test điền đủ mọi loại ô rồi gửi:</p>
${out(OUT.nhieuO)}
<p>Mỗi loại ô giữ giá trị ở một chỗ hơi khác nhau, và đây là chỗ form tự viết hay gãy:</p>
<table>
<thead><tr><th>Ô</th><th>Kiểm soát bằng</th><th>Đọc trong onChange</th><th>Bẫy</th></tr></thead>
<tbody>
<tr><td><code>&lt;input&gt;</code> (text, tel, email)</td><td><code>value</code></td><td><code>e.target.value</code></td><td>Luôn là chuỗi.</td></tr>
<tr><td><code>type="number"</code></td><td><code>value</code></td><td><code>e.target.value</code></td><td>Vẫn là <strong>chuỗi</strong> (<code>"12"</code>). Dùng <code>e.target.valueAsNumber</code> hoặc đổi kiểu trong schema.</td></tr>
<tr><td><code>type="checkbox"</code></td><td><code>checked</code></td><td><code>e.target.checked</code></td><td><code>value</code> của checkbox là chữ gửi kèm form, không phải "có được tích không".</td></tr>
<tr><td><code>type="radio"</code></td><td><code>checked</code> trên từng lựa chọn</td><td><code>e.target.value</code> của cái được chọn</td><td>Cả nhóm dùng chung một <code>name</code>.</td></tr>
<tr><td><code>&lt;select&gt;</code></td><td><code>value</code> trên <code>select</code></td><td><code>e.target.value</code></td><td>Không dùng <code>selected</code> trên <code>&lt;option&gt;</code> như HTML thường.</td></tr>
<tr><td><code>&lt;textarea&gt;</code></td><td><code>value</code></td><td><code>e.target.value</code></td><td>Không đặt chữ làm con (children) như HTML thường.</td></tr>
<tr><td><code>type="file"</code></td><td>— (luôn không kiểm soát)</td><td><code>e.target.files</code></td><td>Trình duyệt cấm đặt giá trị của nó bằng mã.</td></tr>
</tbody></table>

<h3>useRef: chiếc hộp không gây render</h3>
${slide('rx-03', 8, 'useRef: hộp nhớ không gây render, hợp để đưa focus')}
<p>Bạn đã dùng <code>useRef</code> một lần để đọc ô. Việc thật của nó rộng hơn: nó cho component một chiếc hộp sửa được, <code>{ current }</code>, sống bằng tuổi component và React <strong>không bao giờ</strong> theo dõi. Đổi <code>ref.current</code> không gây render. Vì vậy nó hợp với hai việc trong form: chạm tới phần tử DOM (focus, cuộn, đo kích thước) và giữ những cờ mà màn hình không cần hiện (ở 3.3 bạn sẽ dùng một cờ như vậy để chặn gửi hai lần).</p>
<p>Một cách dùng rất phổ biến: đưa con trỏ về lại ô sau khi xoá:</p>
${pre('tsx', SN.focusRef)}
<p>Để ý ô này <em>là ô kiểm soát</em> và <em>cũng</em> có ref. Hai thứ độc lập nhau: state quyết định ô hiện gì, ref đưa bạn phần tử để gọi <code>.focus()</code>. Test gõ "Huy", bấm "Xoá", rồi kiểm cả hai: ô rỗng, và ô đang có focus.</p>
<table>
<thead><tr><th>Công cụ</th><th>Đổi nó có render lại?</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>useState</code></td><td>Có</td><td>Mọi thứ hiện lên màn hình</td></tr>
<tr><td><code>useRef</code></td><td>Không</td><td>Phần tử DOM (focus, đo), bộ hẹn giờ, cờ "đang gửi"</td></tr>
<tr><td><code>let</code> thường trong component</td><td>Không — và bị đặt lại mỗi lần render</td><td>Giá trị tạm trong đúng một lần render</td></tr>
</tbody></table>
<p>Quy tắc từ react.dev: đừng đọc hay ghi <code>ref.current</code> trong lúc render (trong thân component); làm việc đó trong handler sự kiện và effect. Đọc nó lúc render làm kết quả phụ thuộc vào thứ React không nhìn thấy.</p>

<h3>Không state, không ref: đọc FormData lúc gửi</h3>
<p>Còn lựa chọn thứ ba người ta hay quên: để mọi ô không kiểm soát, cho mỗi ô một <code>name</code>, rồi đọc tất cả một lượt khi form được gửi. Trình duyệt có sẵn một object cho đúng việc này, <code>FormData</code>:</p>
${pre('tsx', SN.formData)}
${out(OUT.formData)}
<p><code>new FormData(form)</code> gom mọi ô có <code>name</code>; <code>Object.fromEntries</code> biến danh sách cặp <code>[tên, giá trị]</code> của nó thành một object thường. Không state, không ref, không render lại khi gõ. HTML form vẫn luôn chạy như vậy, và React 19 xây tiếp trên nó: bạn đưa một hàm vào <code>&lt;form action={fn}&gt;</code>, React gọi hàm đó với <code>FormData</code>, và khi hàm chạy xong React tự đặt lại các ô không kiểm soát. Đó là nội dung Chương 12 (Actions); lúc này chỉ cần biết "không kiểm soát" không hề cổ lỗ — nó là hướng cả nền tảng web lẫn React đang đi.</p>

<h3>Khi nào dùng cái nào</h3>
<table>
<thead><tr><th>Tình huống</th><th>Chọn</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Ô tìm kiếm lọc danh sách theo từng phím</td><td>Kiểm soát</td><td>Phần khác của màn hình cần chữ ở mỗi phím.</td></tr>
<tr><td>Định dạng hoặc giới hạn chữ khi đang gõ</td><td>Kiểm soát</td><td>Chỉ ô kiểm soát sửa được giá trị trên đường vào.</td></tr>
<tr><td>Form chỉ cần đọc lúc gửi</td><td>Không kiểm soát (FormData hoặc thư viện form)</td><td>Không render mỗi phím, ít mã hơn.</td></tr>
<tr><td>Form nghiệp vụ thật: kiểm dữ liệu, báo lỗi, gửi bất đồng bộ</td><td>React Hook Form + Zod (bên dưới là không kiểm soát)</td><td>Bài 3.2 — kiểm dữ liệu, kiểu và trạng thái lỗi có sẵn.</td></tr>
<tr><td>Tải file lên</td><td>Không kiểm soát</td><td>Lựa chọn duy nhất trình duyệt cho phép.</td></tr>
</tbody></table>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Lab FER202 thường viết mọi form bằng tay: mỗi ô một <code>useState</code> (hoặc <code>this.state</code> cộng một <code>handleChange</code> dùng <code>[e.target.name]</code> ở các slide class component cũ), <code>&lt;Form.Control value={…} onChange={…} /&gt;</code> của React-Bootstrap, và một <code>handleSubmit</code> đầy <code>if</code> để nhồi lỗi vào object <code>errors</code>. → Ở công ty, một ô tương tác nhỏ (ô tìm kiếm, công tắc) vẫn là ô kiểm soát y như trên, nhưng mọi form được <em>gửi đi</em> — đăng ký, thanh toán, đặt lịch — đều dựng bằng <strong>React Hook Form + Zod</strong>. · <em>Vì sao:</em> bản tự viết render lại cả form ở mỗi phím (đo được: 12 lần commit cho 12 ký tự), chép luật kiểm tra hai lần ở client và server, và không có kiểu nào ràng các ô với dữ liệu bạn gửi đi. Cách FER202 không sai — đó chính là cách bạn hiểu thư viện form làm gì cho mình, và bạn sẽ gặp lại nó ở dự án cũ cũng như các công cụ nội bộ làm nhanh.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Input kiểm soát và không kiểm soát khác nhau thế nào?</strong><br>Đáp: Ở ô kiểm soát, state của React là nguồn sự thật: tôi truyền <code>value</code> và cập nhật state trong <code>onChange</code>, nên mỗi phím là một lần render. Ở ô không kiểm soát, DOM giữ giá trị; tôi đặt giá trị ban đầu bằng <code>defaultValue</code> và đọc giá trị bằng ref hoặc <code>FormData</code> khi cần. Kiểm soát cho phép phản ứng với từng thay đổi (định dạng, kiểm ngay, bật/tắt nút); không kiểm soát rẻ hơn và là nền của React Hook Form.</p>
<p><strong>Hỏi: Vì sao ô input của tôi không gõ được?</strong><br>Đáp: Nó có <code>value</code> mà không có <code>onChange</code> (hoặc handler không cập nhật state đứng sau <code>value</code>). React cảnh báo "You provided a <code>value</code> prop to a form field without an <code>onChange</code> handler" và render lại giá trị cũ ở mỗi phím.</p>
<p><strong>Hỏi: Khi nào bạn dùng <code>useRef</code> trong form?</strong><br>Đáp: Để chạm tới phần tử DOM — focus vào ô lỗi đầu tiên, focus lại sau khi xoá — và để giữ những giá trị không được gây render, như cờ "đang gửi".</p>
</div>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Trong dự án Vite của bạn, tạo <code>src/vi-du/OTen.tsx</code> theo bản không kiểm soát. Vẽ nó trong <code>App.tsx</code>, gõ, bấm "Gửi", <code>console.log</code> giá trị.</li>
<li>Đổi <code>defaultValue</code> thành <code>value</code> rồi thử gõ. Mở console: bạn sẽ thấy cảnh báo 1 ở trên.</li>
<li>Viết bản kiểm soát với <code>useState(&#39;&#39;)</code> và một dòng chào. Rồi đổi thành <code>useState&lt;string&gt;()</code>, gõ một chữ, đọc cảnh báo 2.</li>
<li>Thêm hàm định dạng số điện thoại. Gõ <code>09a01.23456789</code> và nhìn chữ cái biến mất.</li>
<li>Bọc từng bản trong <code>&lt;Profiler id="…" onRender={(id, phase) =&gt; console.log(id, phase)}&gt;</code> và đếm số dòng <code>update</code> khi gõ.</li>
<li>Chạy test. Cả chín test của file bài này xanh trên máy dựng bài:</li>
</ol>
${out(OUT.bai1Tong)}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lễ tân phòng khám muốn một ô "ghi chú cho bác sĩ": tối đa 200 ký tự, có bộ đếm "còn N ký tự" chạy theo từng phím, và nút "Xoá" làm rỗng ô rồi đưa con trỏ về lại ô.</p><ol>
<li>Dựng <code>OGhiChu</code> là một <code>&lt;textarea&gt;</code> <strong>kiểm soát</strong> (vì sao kiểm soát? bộ đếm cần chữ ở mỗi phím).</li>
<li>Hiện <code>còn {200 - noiDung.length} ký tự</code> bên dưới, và không nhận thêm sau 200 ký tự bằng cách cắt trong <code>onChange</code> (<code>e.target.value.slice(0, 200)</code>).</li>
<li>Thêm nút "Xoá" đặt chữ về <code>&#39;&#39;</code> rồi gọi <code>ref.current?.focus()</code>.</li>
<li>Viết ba test bằng Testing Library: gõ "Tái khám" thì hiện "còn 192 ký tự"; dán 250 ký tự thì còn đúng 200; "Xoá" làm rỗng ô và ô có focus.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx vitest run</code> cho ba test của bạn xanh, <code>npx tsc -b</code> sạch, và console trình duyệt không có cảnh báo React nào khi bạn gõ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">controlled input (ô kiểm soát)</span><span class="v">state của React giữ giá trị; ô nhận <code>value</code>, mọi thay đổi đi qua <code>onChange</code></span></div>
<div class="kv"><span class="k">uncontrolled input (ô không kiểm soát)</span><span class="v">DOM giữ giá trị; React chỉ đặt <code>defaultValue</code> và đọc giá trị khi cần</span></div>
<div class="kv"><span class="k">source of truth (nguồn sự thật)</span><span class="v">nơi duy nhất một giá trị thật sự sống; mọi chỗ khác chỉ hiển thị nó</span></div>
<div class="kv"><span class="k">defaultValue / defaultChecked</span><span class="v">giá trị ban đầu của ô không kiểm soát; React bỏ qua các lần đổi sau</span></div>
<div class="kv"><span class="k">ref / useRef</span><span class="v">hộp <code>{ current }</code> sống qua các lần render và không gây render; <code>ref={r}</code> bỏ phần tử DOM vào đó</span></div>
<div class="kv"><span class="k">FormData</span><span class="v">object của trình duyệt gom mọi ô có tên trong form một lượt</span></div>
<div class="kv"><span class="k">computed property (tên thuộc tính tính toán)</span><span class="v"><code>{ [name]: v }</code> — tên khoá lấy từ một biến</span></div>
<div class="kv"><span class="k">Profiler</span><span class="v">component của React, <code>onRender</code> chạy một lần mỗi commit; ở đây dùng để đếm số lần render lại</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ô input luôn có giá trị; bạn chọn DOM (không kiểm soát) hay state của React (kiểm soát) làm chủ nó.</li>
<li>Kiểm soát: <code>value</code> + <code>onChange</code>; mỗi phím một lần render (đo được 12 cho 12); sửa được chữ ngay khi nó vào.</li>
<li>Không kiểm soát: <code>defaultValue</code> + ref hoặc <code>FormData</code>; không render lần nào khi gõ; đọc giá trị lúc cần.</li>
<li>Cảnh báo: <code>value</code> thiếu <code>onChange</code> là ô chỉ đọc; <code>undefined</code> → chuỗi là đổi mô hình — bắt đầu từ <code>&#39;&#39;</code>.</li>
<li>Checkbox dùng <code>checked</code>; ô number vẫn trả chuỗi; select và textarea dùng <code>value</code>; ô file luôn không kiểm soát.</li>
<li><code>useRef</code> giữ phần tử DOM và cờ mà không render lại — focus, đo, "đang gửi".</li>
</ul>

${LINK('https://react.dev/reference/react-dom/components/input', '📄', 'react.dev — &lt;input&gt;', 'Kiểm soát và không kiểm soát, mọi prop, và mục xử lý sự cố cho cả hai cảnh báo.')}
${LINK('https://react.dev/reference/react-dom/components/select', '📄', 'react.dev — &lt;select&gt;', 'Vì sao value đặt trên select, và chọn nhiều.')}
${LINK('https://react.dev/reference/react/useRef', '📄', 'react.dev — useRef', 'Ref sống qua các lần render; không đọc/ghi ref.current trong lúc render.')}
${LINK('https://react.dev/learn/manipulating-the-dom-with-refs', '📄', 'react.dev — Manipulating the DOM with Refs', 'Focus, cuộn, đo: những việc ref sinh ra để làm.')}
${LINK('https://react.dev/reference/react-dom/components/form', '📄', 'react.dev — &lt;form&gt;', 'Prop action, FormData, và tự đặt lại ô không kiểm soát trong React 19.')}
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — React Hook Form + Zod: register, one schema for rules and types, and validation modes|||3.2 — React Hook Form + Zod: register, một schema cho luật và kiểu, và các mode kiểm',
      slug: 'rx-3-2-react-hook-form',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng một form viết ba cách; useForm, register, handleSubmit; schema Zod của phòng khám (trim, NFC, transform, pipe, iso.date, refine), z.input và z.output, TypeScript bắt tên trường sai, mode kiểm đo thật, watch vs useWatch, schema dùng chung với máy chủ, cái giá về kích thước bundle.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>React Hook Form + Zod: register, one schema for rules and types, and validation modes</h2>
<p class="lead">Lesson 3.1 ended with a problem: hand-written forms re-render on every keystroke, scatter validation across <code>if</code> statements, and have no types linking the inputs to the data you send. Almost every React team in 2026 solves this the same way: <strong>React Hook Form</strong> (RHF) to manage the form, and <strong>Zod</strong> to describe what valid data looks like. This lesson builds the clinic&#39;s booking schema with them and measures what you get.</p>

<p>Versions used (checked in <code>node_modules</code>, September 2026): react-hook-form 7.88.0, zod 4.6.5, @hookform/resolvers 5.9.1. Zod 4 changed several APIs compared with Zod 3 (error messages, date formats, error formatting); everything below is Zod 4 and was run, not copied from an old tutorial.</p>

<h3>The same form, written three ways</h3>
<p>Start from something you already know. Here is a two-field form written the FER202 way — one state per field, rules in the submit handler:</p>
${pre('tsx', SN.tuViet)}
<p>It works. Now the same form in React Hook Form with the rules written inline, and then with the rules moved into a Zod schema:</p>
${pre('tsx', SN.rhfCoBan)}
${pre('tsx', SN.haiOSchema)}
${pre('tsx', SN.rhfZod)}
<p>The test runs one scenario against all three with <code>test.each</code>: type "A" as the name and "12345" as the phone, press "Gửi". All three show the same two messages and none calls <code>onGui</code>. So the difference is not <em>what</em> they do. It is how much code you write, where the rules live, how many renders it costs, and what TypeScript can check. The rest of the lesson is about those four things.</p>

<h3>Install, then connect: useForm, register, handleSubmit</h3>
${slide('rx-03', 9, 'React Hook Form: register nối ô vào form bằng ref')}
<p>Three packages: the form library, the schema library, and the small bridge between them. On the build machine, starting from the Chapter 2 project:</p>
${out(OUT.npmInstall)}
${out(OUT.npmLs)}
<p>(Four packages were added because the resolvers package brings one small dependency of its own.) Now read <code>FormRHFCoBan</code> above slowly:</p>
<ul>
<li><code>useForm&lt;HaiO&gt;({ defaultValues })</code> creates the form. <code>defaultValues</code> gives every field a starting value — which also means no field ever starts as <code>undefined</code>, so the warning from 3.1 cannot happen.</li>
<li><code>register(&#39;hoTen&#39;, rules)</code> returns an object with four things: <code>name</code>, <code>onChange</code>, <code>onBlur</code> and <code>ref</code>. <code>{...register(&#39;hoTen&#39;)}</code> spreads them onto the input as props. The <code>ref</code> is the key: RHF keeps a reference to the real DOM element and reads its value when it needs to. The input is <strong>uncontrolled</strong>.</li>
<li><code>handleSubmit(onGui)</code> returns the actual submit handler. When the form is submitted it calls <code>preventDefault</code>, validates every field, and only if everything is valid calls <code>onGui</code> with the data. If something is invalid it fills <code>formState.errors</code> and focuses the first invalid field.</li>
<li><code>formState: { errors }</code> is destructured from what <code>useForm</code> returns. <code>errors.hoTen?.message</code> is the message for that field, or <code>undefined</code>.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — spread in JSX.</strong> <code>&lt;input {...obj} /&gt;</code> means "use every property of <code>obj</code> as a prop". So <code>&lt;input {...register(&#39;hoTen&#39;)} /&gt;</code> is the same as <code>&lt;input name="hoTen" onChange={…} onBlur={…} ref={…} /&gt;</code>, written once instead of four times per field.</p></div>
<p>Because the inputs are uncontrolled, typing does not re-render the form. Measured with a render counter on the Zod version (mode <code>onSubmit</code>):</p>
${out(OUT.rhfRender)}
<p>Zero, against twelve for the <code>useState</code> version in 3.1. RHF re-renders only when something you <em>read</em> from <code>formState</code> changes — for example when a new error appears or <code>isSubmitting</code> flips. That subscription model is the main idea of the library.</p>

<h3>Zod: write the rules once</h3>
${slide('rx-03', 10, 'Zod: MỘT schema viết luật, sinh kiểu TypeScript, sinh câu báo lỗi')}
<p>Rules written inside <code>register(&#39;hoTen&#39;, { minLength: … })</code> work, but they live inside a component, only the browser uses them, and TypeScript does not know them. Zod moves them into a plain object that describes the data:</p>
<ul>
<li><code>z.object({ … })</code> — "an object with these fields".</li>
<li><code>z.string().trim().min(2, &#39;…&#39;)</code> — "a string; trim it; then it must have at least 2 characters, otherwise this message".</li>
<li><code>z.infer&lt;typeof haiOSchema&gt;</code> — a TypeScript type computed <em>from</em> the schema. Change a rule, the type follows.</li>
</ul>
<div class="callout"><p><strong>JS/TS quick reminder — chaining and <code>typeof</code> in a type.</strong> <code>z.string().trim().min(2)</code> is method chaining: each call returns a new schema, and you call the next method on it. In <code>z.infer&lt;typeof haiOSchema&gt;</code>, <code>typeof</code> is TypeScript&#39;s type-level operator: "the type of this variable". It does not run anything; it only exists for the type checker.</p></div>
<p><code>zodResolver(schema)</code> from <code>@hookform/resolvers</code> connects the two libraries: RHF hands the raw form values to Zod, Zod returns either clean data or a list of errors with the path of each field, and RHF puts those errors into <code>formState.errors</code> under the same path.</p>

<h3>The clinic&#39;s real schema</h3>
${slide('rx-03', 11, 'z.input khác z.output: người dùng gõ bẩn, form gửi đi sạch')}
<p>This is the schema the booking form uses. It lives in its own file, <code>src/schema/dat-lich.ts</code>, because later chapters (and the server) import it:</p>
${pre('ts', SN.schema)}
<p>Walk through it field by field; every line is there for a reason you can test.</p>
<ul>
<li><strong><code>hoTen</code></strong>: <code>.trim()</code> and <code>.normalize(&#39;NFC&#39;)</code> <em>clean</em> the value before the checks run (in Zod 4 they are "overwrite" steps that run in order). Then length limits and a letter-only regex. <code>&#92;p{L}</code> means "any letter in any language" and <code>&#92;p{M}</code> "any combining mark" — why that matters for Vietnamese is Lesson 3.4.</li>
<li><strong><code>soDienThoai</code></strong>: <code>.transform()</code> <em>changes</em> the value: remove spaces, dots and dashes, turn <code>+84</code> into <code>0</code>. <code>.pipe()</code> then runs a second schema on the <em>transformed</em> value, so the regex sees <code>0901234567</code>, not <code>+84 901.234.567</code>. The regex itself: a <code>0</code>, then 3, 5, 7, 8 or 9, then exactly 8 digits — Vietnamese mobile numbers (tính đến 09/2026).</li>
<li><strong><code>ngaySinh</code></strong>: <code>z.iso.date()</code> accepts <code>YYYY-MM-DD</code> — exactly what <code>&lt;input type="date"&gt;</code> produces. Two <code>.refine()</code> calls add rules Zod does not have built in: not in the future, not older than 120.</li>
<li><strong><code>lyDo</code></strong>: required and at most 500 characters, counted <em>after</em> NFC normalisation.</li>
<li>The last two lines export two types. <code>z.input</code> is what the user types (before cleaning); <code>z.output</code> is what comes out (after <code>trim</code>, <code>normalize</code> and <code>transform</code>). For this schema they happen to have the same shape but mean different things, and with a transform that changes a type (string → number) they would differ.</li>
</ul>
<p>The schema&#39;s own tests show the cleaning and the error paths:</p>
${out(OUT.lamSach)}
${out(OUT.loiSchema)}
<p>Notice the paths: <code>benhNhan.hoTen</code>, <code>lyDo</code>. RHF uses exactly these strings as field names in <code>register(&#39;benhNhan.hoTen&#39;)</code>, and puts each error at <code>errors.benhNhan.hoTen</code>. Nested objects in the form mirror nested objects in the schema, which mirror the <code>BenhNhan</code> type fixed in <code>src/types.ts</code>.</p>
<div class="pitfall co-tieu-de"><strong>Trap — a refine that runs on garbage.</strong> The first version of this schema had <code>z.iso.date(&#39;Chọn ngày sinh&#39;)</code> followed by the two refines, without <code>abort: true</code>. An empty date then produced <em>two</em> errors, because the refines still ran on <code>&#39;&#39;</code> and the age calculation turned into nonsense. Real output from the build machine:
${out(OUT.refineTruoc)}
In Zod 4 a failed format check does not stop later checks unless it "aborts". Adding <code>{ error: &#39;…&#39;, abort: true }</code> fixed it, and the schema test <code>ngày sinh trống ⇒ đúng MỘT lỗi</code> now guards it. The general lesson: a refine should only ever see data that already has the right shape.</div>
<p>In the component you do not write any of these types by hand. <code>useForm({ resolver: zodResolver(datLichSchema) })</code> infers both: <code>defaultValues</code> and <code>register</code> use <code>z.input</code>, and the function you pass to <code>handleSubmit</code> receives <code>z.output</code>. You can see the result in the form test in 3.3: the user types <code>&#39;  Nguyễn Thị Ánh &#39;</code> and <code>&#39;0901 234 567&#39;</code>, and <code>onGui</code> receives <code>&#39;Nguyễn Thị Ánh&#39;</code> and <code>&#39;0901234567&#39;</code>.</p>

<h3>TypeScript guards the field names</h3>
${slide('rx-03', 12, 'Gõ sai tên trường: TypeScript bắt trước khi bạn chạy thử')}
<p>In a hand-written form, field names are strings (<code>e.target.name</code>), so a typo compiles fine and the data simply never arrives. With RHF + Zod, the list of valid names is computed from the schema. Two deliberate mistakes:</p>
${pre('tsx', SN.loiTsc)}
${out(OUT.tscLoi)}
<p>The first error lists every legal path, including the nested ones. The second one catches a field that does not exist in the schema at all. Your editor underlines both while you type; nobody has to click through the form to find out.</p>

<h3>mode: when do errors appear?</h3>
${slide('rx-03', 13, 'mode quyết định LÚC NÀO lỗi hiện ra — đo thật')}
<p><code>useForm({ mode })</code> decides when validation runs <em>before</em> the first submit. The RHF docs list five values; the test measures four of them with one scenario — type "A" in the name, then Tab to the next field — and counts the error messages on screen after each step:</p>
${out(OUT.mode)}
<table>
<thead><tr><th>mode</th><th>First validation</th><th>Feels like</th></tr></thead>
<tbody>
<tr><td><code>onSubmit</code> (default)</td><td>When you press submit</td><td>Quiet while typing; a wall of red at the end.</td></tr>
<tr><td><code>onBlur</code></td><td>When you leave a field</td><td>Polite, but errors do not disappear while you fix them until you leave again.</td></tr>
<tr><td><code>onTouched</code></td><td>First blur, then every change</td><td>Does not nag while you type the first time; once shown, an error clears as soon as the value is fixed.</td></tr>
<tr><td><code>onChange</code></td><td>Every keystroke</td><td>Shouts at the first letter ("at least 2 characters!"). The docs warn it costs more re-renders.</td></tr>
<tr><td><code>all</code></td><td>Blur and change</td><td>Rarely needed.</td></tr>
</tbody></table>
<p>After the first submit, <code>reValidateMode</code> (default <code>onChange</code>) takes over, which is why fixing a field after pressing submit clears its error immediately. The booking form uses <code>onTouched</code>; many teams do the same.</p>

<h3>watch() versus useWatch()</h3>
${slide('rx-03', 14, 'watch() ở gốc vẽ lại cả form; useWatch() chỉ vẽ lại con cần nó')}
<p>Sometimes the screen does need a value while the user types — the booking form shows "33/500" under the reason box. RHF offers two ways to read a live value, and they cost very differently:</p>
${pre('tsx', SN.watchGoc)}
${pre('tsx', SN.useWatchCon)}
${out(OUT.watch)}
<p>With <code>watch(&#39;lyDo&#39;)</code> at the top of the form, every keystroke in "Lý do" re-renders the <em>whole form</em> (15 renders for 15 characters). With <code>useWatch</code> inside a tiny child component, only that child re-renders; the form itself stays at zero. The booking form follows the second pattern: the counter is a separate <code>DemKyTuLyDo</code> component. This is the same idea as Chapter 2&#39;s "keep state low", applied to a subscription.</p>

<h3>One schema, also on the server</h3>
<p>Client-side validation is for the user; it can always be bypassed by calling the API directly. The server must validate again — and with Zod it can use the <em>same</em> file. The test simulates the handler of <code>POST /api/lich-hen</code> with nothing but <code>datLichSchema.safeParse</code>:</p>
${pre('ts', SN.mayChu)}
${out(OUT.mayChu)}
<p><code>safeParse</code> never throws; it returns <code>{ success: true, data }</code> or <code>{ success: false, error }</code>. Each issue has a <code>path</code> — the same <code>benhNhan.soDienThoai</code> strings RHF uses — so in 3.3 the form can put server errors under the right input. In a real project the schema sits in a shared package (for example <code>packages/schema</code> in a monorepo), or in the backend with the frontend importing it. One warning, measured: <code>z.flattenError</code>, which many tutorials use, only flattens <strong>one</strong> level. With a nested object all three patient errors end up under the single key <code>benhNhan</code>:</p>
${out(OUT.flatten)}
<p>That is why the handler above maps <code>issues</code> to <code>{ truong, loi }</code> itself. (Zod 4 also has <code>z.treeifyError</code> for nested error trees.)</p>

<h3>What it costs: bundle size</h3>
<p>Libraries are not free. The same project built before and after this chapter:</p>
${out(OUT.buildSoSanh)}
<p>About 36 kB more after gzip for RHF, Zod, the resolver and the form code. For a booking app that is a fair trade; on a landing page with one email box it would not be — there, a plain uncontrolled form with <code>FormData</code> is the better tool. Zod also ships a smaller <code>zod/mini</code> build; it was not measured here, so no number is claimed.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 a registration form is usually a class or function component with a <code>useState</code> per field, an <code>errors</code> object, and <code>validate()</code> full of <code>if (!email.includes(&#39;@&#39;))</code>; some slides add PropTypes to describe the props. → At work: <strong>React Hook Form</strong> for the form state, <strong>Zod</strong> for the rules, <code>z.infer</code>/<code>z.output</code> for the types, and the same schema on the server. · <em>Why:</em> one source for rules and types (no drift between client, server and TypeScript), no re-render per keystroke (measured: 0 against 12), errors and focus handled for you, and the compiler catches wrong field names. The FER202 way still teaches you exactly what the library automates; you will meet it again in legacy code, and Formik (an older library built on controlled inputs) is also still common in older projects.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: Why React Hook Form instead of useState for forms?</strong><br>A: RHF registers inputs as uncontrolled and reads them through refs, so typing does not re-render the form; it only re-renders when a piece of <code>formState</code> I actually read changes. It also gives me validation, error state, focus on the first error and submit state. I measured it: typing 12 characters re-rendered a <code>useState</code> form 12 times and the RHF form 0 times.</p>
<p><strong>Q: Why Zod and not validation rules inside the component?</strong><br>A: The schema is plain data, so the server can import the same file; TypeScript types are inferred from it, so rules and types never drift; and it can clean data (trim, normalise, transform) before checking it.</p>
<p><strong>Q: What is the difference between <code>watch</code> and <code>useWatch</code>?</strong><br>A: <code>watch</code> subscribes at the root of the form, so the whole form re-renders on each change of the watched field. <code>useWatch</code> subscribes in the component that calls it, so I put it in a small child and only that child re-renders.</p>
</div>

<h3>Run it step by step</h3>
<ol>
<li>Install the three packages (<code>npm install react-hook-form zod @hookform/resolvers</code>) and check the versions with <code>npm ls</code>.</li>
<li>Rewrite a two-field form with <code>useForm</code> + <code>register</code> and inline rules. Submit it empty; notice the first invalid field gets focus.</li>
<li>Move the rules into a <code>z.object</code> schema, add <code>resolver: zodResolver(schema)</code>, delete the inline rules. Hover over the parameter of your submit function in the editor: its type came from the schema.</li>
<li>Misspell a field in <code>register</code> and run <code>npx tsc -b</code>. Read the list of allowed names in the error.</li>
<li>Try each <code>mode</code> and describe to yourself when errors appear. Keep <code>onTouched</code>.</li>
<li>Run the lesson&#39;s tests. On the build machine:</li>
</ol>
${out(OUT.bai2Tong)}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic wants a "nhận nhắc lịch qua email" form: email, the number of days before the appointment to send the reminder (1–7), and a required "Tôi đồng ý nhận email" checkbox.</p><ol>
<li>Write <code>nhacLichSchema</code> with <code>z.email(&#39;…&#39;)</code>, a number field and a checkbox field. Hint: an <code>&lt;input type="number"&gt;</code> gives a string — use <code>register(&#39;soNgay&#39;, { valueAsNumber: true })</code> or <code>z.coerce.number()</code>; for the checkbox, <code>z.literal(true, &#39;…&#39;)</code> forces it to be ticked.</li>
<li>Build the form with <code>useForm({ resolver: zodResolver(nhacLichSchema), mode: &#39;onTouched&#39; })</code> and show each error under its input.</li>
<li>Test: submitting empty shows three errors; <code>abc</code> as email shows the email error only after leaving the field; valid data calls <code>onGui</code> with <code>soNgay</code> as a <strong>number</strong> (<code>expect(typeof du.soNgay).toBe(&#39;number&#39;)</code>).</li>
</ol><p><strong>Done when:</strong> the three tests are green, <code>npx tsc -b</code> is clean, and hovering over the submit function shows a type you never wrote by hand.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">React Hook Form (RHF)</span><span class="v">form library built on uncontrolled inputs and refs; re-renders only for state you read</span></div>
<div class="kv"><span class="k">register</span><span class="v">returns <code>{ name, onChange, onBlur, ref }</code> to spread onto an input</span></div>
<div class="kv"><span class="k">handleSubmit</span><span class="v">wraps your submit function: validate first, call it only with valid data</span></div>
<div class="kv"><span class="k">schema (lược đồ)</span><span class="v">a description of valid data — rules, cleaning and error messages in one object</span></div>
<div class="kv"><span class="k">resolver</span><span class="v">adapter that lets RHF validate with a schema library (<code>zodResolver</code>)</span></div>
<div class="kv"><span class="k">z.input / z.output</span><span class="v">type of data before and after the schema cleans/transforms it</span></div>
<div class="kv"><span class="k">refine / transform / pipe</span><span class="v">custom rule · change the value · validate the changed value with another schema</span></div>
<div class="kv"><span class="k">mode</span><span class="v">when RHF validates before the first submit: onSubmit, onBlur, onTouched, onChange, all</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>RHF registers uncontrolled inputs: <code>{...register(&#39;path&#39;)}</code>; typing re-renders nothing (measured 0 vs 12).</li>
<li>Zod describes valid data once; <code>zodResolver</code> plugs it into RHF; types come from the schema.</li>
<li>Clean before you check: <code>trim</code>, <code>normalize(&#39;NFC&#39;)</code>, <code>transform</code> + <code>pipe</code>; use <code>abort: true</code> so refines never see garbage.</li>
<li>TypeScript knows every field path: a typo in <code>register</code> is a compile error.</li>
<li><code>mode: &#39;onTouched&#39;</code> is a good default; read live values with <code>useWatch</code> in a small child, not <code>watch</code> at the root.</li>
<li>The same schema validates on the server; map <code>issues</code> by <code>path</code> (<code>flattenError</code> only flattens one level).</li>
</ul>

${LINK('https://react-hook-form.com/docs/useform', '📄', 'React Hook Form — useForm', 'Every option: mode, reValidateMode, defaultValues, resolver, shouldFocusError.')}
${LINK('https://react-hook-form.com/docs/useform/register', '📄', 'React Hook Form — register', 'What register returns, nested names, valueAsNumber.')}
${LINK('https://react-hook-form.com/docs/usewatch', '📄', 'React Hook Form — useWatch', 'Isolated re-renders for live values.')}
${LINK('https://zod.dev/api', '📄', 'Zod — Defining schemas', 'Strings, formats (z.iso.date, z.email), transforms, pipes, refinements in Zod 4.')}
${LINK('https://zod.dev/error-formatting', '📄', 'Zod — Formatting errors', 'z.treeifyError, z.flattenError, z.prettifyError.')}
${LINK('https://github.com/react-hook-form/resolvers', '📄', 'GitHub — react-hook-form/resolvers', 'zodResolver and resolvers for other schema libraries.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>React Hook Form + Zod: register, một schema cho luật và kiểu, và các mode kiểm</h2>
<p class="lead">Bài 3.1 dừng ở một vấn đề: form tự viết render lại ở mỗi phím, rải luật kiểm tra khắp các câu <code>if</code>, và không có kiểu nào nối các ô với dữ liệu bạn gửi đi. Gần như mọi đội React năm 2026 giải nó theo cùng một cách: <strong>React Hook Form</strong> (RHF) để quản lý form, và <strong>Zod</strong> để mô tả dữ liệu hợp lệ trông thế nào. Bài này dựng schema đặt lịch của phòng khám bằng hai thư viện đó và đo xem bạn được gì.</p>

<p>Phiên bản dùng trong bài (kiểm trong <code>node_modules</code>, tính đến 09/2026): react-hook-form 7.88.0, zod 4.6.5, @hookform/resolvers 5.9.1. Zod 4 đổi khá nhiều API so với Zod 3 (cách ghi thông báo lỗi, định dạng ngày, cách gom lỗi); mọi thứ dưới đây là Zod 4 và đã chạy thật, không chép từ bài hướng dẫn cũ.</p>

<h3>Cùng một form, viết ba cách</h3>
<p>Bắt đầu từ thứ bạn đã biết. Đây là form hai ô viết theo kiểu FER202 — mỗi ô một state, luật nằm trong hàm gửi:</p>
${pre('tsx', SN.tuViet)}
<p>Nó chạy. Giờ cùng form đó bằng React Hook Form với luật viết thẳng trong <code>register</code>, rồi với luật dời sang một schema Zod:</p>
${pre('tsx', SN.rhfCoBan)}
${pre('tsx', SN.haiOSchema)}
${pre('tsx', SN.rhfZod)}
<p>Test chạy MỘT kịch bản trên cả ba bằng <code>test.each</code>: gõ "A" vào họ tên và "12345" vào số điện thoại, bấm "Gửi". Cả ba hiện đúng hai câu báo lỗi và không cái nào gọi <code>onGui</code>. Vậy khác biệt không nằm ở chỗ chúng <em>làm gì</em>. Nó nằm ở lượng mã bạn phải viết, chỗ luật sống, số lần render phải trả, và thứ TypeScript kiểm được. Phần còn lại của bài nói về bốn chuyện đó.</p>

<h3>Cài, rồi nối: useForm, register, handleSubmit</h3>
${slide('rx-03', 9, 'React Hook Form: register nối ô vào form bằng ref')}
<p>Ba gói: thư viện form, thư viện schema, và chiếc cầu nhỏ giữa chúng. Trên máy dựng bài, xuất phát từ dự án sau Chương 2:</p>
${out(OUT.npmInstall)}
${out(OUT.npmLs)}
<p>(Thêm 4 gói vì gói resolvers kéo theo một phụ thuộc nhỏ của riêng nó.) Giờ đọc chậm <code>FormRHFCoBan</code> ở trên:</p>
<ul>
<li><code>useForm&lt;HaiO&gt;({ defaultValues })</code> tạo form. <code>defaultValues</code> cho mọi ô một giá trị ban đầu — cũng có nghĩa là không ô nào khởi đầu bằng <code>undefined</code>, nên cảnh báo ở 3.1 không thể xảy ra.</li>
<li><code>register(&#39;hoTen&#39;, luật)</code> trả về một object có bốn thứ: <code>name</code>, <code>onChange</code>, <code>onBlur</code> và <code>ref</code>. <code>{...register(&#39;hoTen&#39;)}</code> trải chúng lên ô làm props. <code>ref</code> là mấu chốt: RHF giữ tham chiếu tới phần tử DOM thật và đọc giá trị khi cần. Ô là ô <strong>không kiểm soát</strong>.</li>
<li><code>handleSubmit(onGui)</code> trả về hàm xử lý gửi thật sự. Khi form được gửi, nó gọi <code>preventDefault</code>, kiểm mọi ô, và chỉ khi tất cả hợp lệ mới gọi <code>onGui</code> với dữ liệu. Có ô sai thì nó điền <code>formState.errors</code> và focus vào ô sai đầu tiên.</li>
<li><code>formState: { errors }</code> được tách ra từ thứ <code>useForm</code> trả về. <code>errors.hoTen?.message</code> là câu báo lỗi của ô đó, hoặc <code>undefined</code>.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — spread trong JSX.</strong> <code>&lt;input {...obj} /&gt;</code> nghĩa là "dùng mọi thuộc tính của <code>obj</code> làm prop". Nên <code>&lt;input {...register(&#39;hoTen&#39;)} /&gt;</code> giống hệt <code>&lt;input name="hoTen" onChange={…} onBlur={…} ref={…} /&gt;</code>, viết một lần thay vì bốn lần cho mỗi ô.</p></div>
<p>Vì ô là không kiểm soát, gõ phím không làm form render lại. Đo bằng bộ đếm render trên bản dùng Zod (mode <code>onSubmit</code>):</p>
${out(OUT.rhfRender)}
<p>Không lần nào, so với 12 lần của bản <code>useState</code> ở 3.1. RHF chỉ render lại khi thứ bạn <em>đọc</em> từ <code>formState</code> đổi — ví dụ khi có lỗi mới hoặc <code>isSubmitting</code> bật/tắt. Mô hình "chỉ đăng ký thứ mình đọc" đó là ý tưởng chính của thư viện.</p>

<h3>Zod: viết luật một lần</h3>
${slide('rx-03', 10, 'Zod: MỘT schema viết luật, sinh kiểu TypeScript, sinh câu báo lỗi')}
<p>Luật viết trong <code>register(&#39;hoTen&#39;, { minLength: … })</code> vẫn chạy, nhưng chúng sống bên trong một component, chỉ trình duyệt dùng được, và TypeScript không biết chúng. Zod dời chúng vào một object thường mô tả dữ liệu:</p>
<ul>
<li><code>z.object({ … })</code> — "một object có những field này".</li>
<li><code>z.string().trim().min(2, &#39;…&#39;)</code> — "một chuỗi; cắt khoảng trắng hai đầu; sau đó phải có ít nhất 2 ký tự, không thì báo câu này".</li>
<li><code>z.infer&lt;typeof haiOSchema&gt;</code> — một kiểu TypeScript tính <em>từ</em> schema. Đổi luật, kiểu đổi theo.</li>
</ul>
<div class="callout"><p><strong>JS/TS nhắc nhanh — gọi nối và <code>typeof</code> trong kiểu.</strong> <code>z.string().trim().min(2)</code> là gọi nối (method chaining): mỗi lần gọi trả về một schema mới, và bạn gọi hàm tiếp theo trên nó. Trong <code>z.infer&lt;typeof haiOSchema&gt;</code>, <code>typeof</code> là toán tử ở tầng kiểu của TypeScript: "kiểu của biến này". Nó không chạy gì cả; nó chỉ tồn tại cho bộ kiểm kiểu.</p></div>
<p><code>zodResolver(schema)</code> của gói <code>@hookform/resolvers</code> nối hai thư viện: RHF đưa giá trị thô của form cho Zod, Zod trả về hoặc dữ liệu sạch, hoặc danh sách lỗi kèm đường dẫn của từng field, và RHF đặt các lỗi đó vào <code>formState.errors</code> theo đúng đường dẫn.</p>

<h3>Schema thật của phòng khám</h3>
${slide('rx-03', 11, 'z.input khác z.output: người dùng gõ bẩn, form gửi đi sạch')}
<p>Đây là schema form đặt lịch dùng. Nó nằm ở file riêng, <code>src/schema/dat-lich.ts</code>, vì các chương sau (và máy chủ) sẽ import nó:</p>
${pre('ts', SN.schema)}
<p>Đi qua từng field; dòng nào cũng có lý do mà bạn test được.</p>
<ul>
<li><strong><code>hoTen</code></strong>: <code>.trim()</code> và <code>.normalize(&#39;NFC&#39;)</code> <em>làm sạch</em> giá trị trước khi các phép kiểm chạy (trong Zod 4 chúng là bước "ghi đè" chạy theo thứ tự). Rồi giới hạn độ dài và một regex chỉ nhận chữ cái. <code>&#92;p{L}</code> nghĩa là "mọi chữ cái của mọi ngôn ngữ", <code>&#92;p{M}</code> là "mọi dấu kết hợp" — vì sao điều đó quan trọng với tiếng Việt là chuyện của Bài 3.4.</li>
<li><strong><code>soDienThoai</code></strong>: <code>.transform()</code> <em>đổi</em> giá trị: bỏ dấu cách, dấu chấm, gạch ngang, đổi <code>+84</code> thành <code>0</code>. <code>.pipe()</code> rồi chạy một schema thứ hai trên giá trị <em>đã đổi</em>, nên regex thấy <code>0901234567</code> chứ không phải <code>+84 901.234.567</code>. Bản thân regex: một số <code>0</code>, rồi 3, 5, 7, 8 hoặc 9, rồi đúng 8 chữ số — số di động Việt Nam (tính đến 09/2026).</li>
<li><strong><code>ngaySinh</code></strong>: <code>z.iso.date()</code> nhận <code>YYYY-MM-DD</code> — đúng thứ <code>&lt;input type="date"&gt;</code> trả ra. Hai lần <code>.refine()</code> thêm luật mà Zod không có sẵn: không ở tương lai, không quá 120 tuổi.</li>
<li><strong><code>lyDo</code></strong>: bắt buộc và tối đa 500 ký tự, đếm <em>sau</em> khi chuẩn hoá NFC.</li>
<li>Hai dòng cuối xuất hai kiểu. <code>z.input</code> là thứ người dùng gõ (trước khi làm sạch); <code>z.output</code> là thứ đi ra (sau <code>trim</code>, <code>normalize</code>, <code>transform</code>). Với schema này chúng tình cờ cùng hình dạng nhưng mang nghĩa khác nhau; nếu có transform đổi kiểu (chuỗi → số) thì chúng khác hẳn.</li>
</ul>
<p>Chính test của schema cho thấy việc làm sạch và đường dẫn lỗi:</p>
${out(OUT.lamSach)}
${out(OUT.loiSchema)}
<p>Để ý các đường dẫn: <code>benhNhan.hoTen</code>, <code>lyDo</code>. RHF dùng đúng những chuỗi này làm tên ô trong <code>register(&#39;benhNhan.hoTen&#39;)</code>, và đặt mỗi lỗi ở <code>errors.benhNhan.hoTen</code>. Object lồng trong form phản chiếu object lồng trong schema, và schema phản chiếu kiểu <code>BenhNhan</code> đã chốt ở <code>src/types.ts</code>.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — refine chạy trên dữ liệu rác.</strong> Bản đầu của schema này viết <code>z.iso.date(&#39;Chọn ngày sinh&#39;)</code> rồi hai refine, KHÔNG có <code>abort: true</code>. Ngày sinh để trống thế là ra <em>hai</em> lỗi, vì refine vẫn chạy trên <code>&#39;&#39;</code> và phép tính tuổi thành vô nghĩa. Output thật trên máy dựng bài:
${out(OUT.refineTruoc)}
Trong Zod 4, phép kiểm định dạng thất bại không chặn các phép kiểm sau, trừ khi nó "abort". Thêm <code>{ error: &#39;…&#39;, abort: true }</code> là hết, và test <code>ngày sinh trống ⇒ đúng MỘT lỗi</code> giờ canh chỗ đó. Bài học chung: refine chỉ nên thấy dữ liệu đã đúng hình dạng.</div>
<p>Trong component bạn không phải tự viết kiểu nào. <code>useForm({ resolver: zodResolver(datLichSchema) })</code> tự suy ra cả hai: <code>defaultValues</code> và <code>register</code> dùng <code>z.input</code>, còn hàm bạn đưa cho <code>handleSubmit</code> nhận <code>z.output</code>. Kết quả thấy rõ ở test form trong 3.3: người dùng gõ <code>&#39;  Nguyễn Thị Ánh &#39;</code> và <code>&#39;0901 234 567&#39;</code>, <code>onGui</code> nhận <code>&#39;Nguyễn Thị Ánh&#39;</code> và <code>&#39;0901234567&#39;</code>.</p>

<h3>TypeScript canh tên trường</h3>
${slide('rx-03', 12, 'Gõ sai tên trường: TypeScript bắt trước khi bạn chạy thử')}
<p>Ở form tự viết, tên field là chuỗi (<code>e.target.name</code>), nên gõ sai vẫn biên dịch ngon lành và dữ liệu cứ thế không bao giờ tới. Với RHF + Zod, danh sách tên hợp lệ được tính từ schema. Hai lỗi cố ý:</p>
${pre('tsx', SN.loiTsc)}
${out(OUT.tscLoi)}
<p>Lỗi thứ nhất liệt kê mọi đường dẫn hợp lệ, cả những cái lồng bên trong. Lỗi thứ hai bắt một field không hề có trong schema. Trình soạn thảo gạch đỏ cả hai ngay khi bạn gõ; không ai phải bấm thử form mới phát hiện.</p>

<h3>mode: lỗi hiện ra lúc nào?</h3>
${slide('rx-03', 13, 'mode quyết định LÚC NÀO lỗi hiện ra — đo thật')}
<p><code>useForm({ mode })</code> quyết định việc kiểm chạy lúc nào <em>trước</em> lần gửi đầu tiên. Tài liệu RHF liệt kê năm giá trị; test đo bốn giá trị bằng một kịch bản — gõ "A" vào họ tên, rồi Tab sang ô sau — và đếm số câu báo lỗi trên màn hình sau mỗi bước:</p>
${out(OUT.mode)}
<table>
<thead><tr><th>mode</th><th>Kiểm lần đầu</th><th>Cảm giác</th></tr></thead>
<tbody>
<tr><td><code>onSubmit</code> (mặc định)</td><td>Khi bấm gửi</td><td>Im lặng khi gõ; cuối cùng một mảng đỏ.</td></tr>
<tr><td><code>onBlur</code></td><td>Khi rời ô</td><td>Lịch sự, nhưng lỗi không biến mất khi bạn sửa cho tới khi rời ô lần nữa.</td></tr>
<tr><td><code>onTouched</code></td><td>Lần rời ô đầu tiên, sau đó mỗi thay đổi</td><td>Không mắng khi bạn gõ lần đầu; lỗi đã hiện thì biến mất ngay khi giá trị đúng.</td></tr>
<tr><td><code>onChange</code></td><td>Mỗi phím</td><td>Hét lên ngay chữ đầu tiên ("ít nhất 2 ký tự!"). Tài liệu cảnh báo nó tốn thêm nhiều lần render.</td></tr>
<tr><td><code>all</code></td><td>Cả blur lẫn change</td><td>Hiếm khi cần.</td></tr>
</tbody></table>
<p>Sau lần gửi đầu, <code>reValidateMode</code> (mặc định <code>onChange</code>) nắm quyền, nên sửa một ô sau khi đã bấm gửi thì lỗi của nó biến mất ngay. Form đặt lịch dùng <code>onTouched</code>; nhiều đội cũng chọn như vậy.</p>

<h3>watch() và useWatch()</h3>
${slide('rx-03', 14, 'watch() ở gốc vẽ lại cả form; useWatch() chỉ vẽ lại con cần nó')}
<p>Đôi khi màn hình thật sự cần một giá trị khi người dùng đang gõ — form đặt lịch hiện "33/500" dưới ô lý do. RHF có hai cách đọc giá trị sống, và giá của chúng khác hẳn nhau:</p>
${pre('tsx', SN.watchGoc)}
${pre('tsx', SN.useWatchCon)}
${out(OUT.watch)}
<p>Với <code>watch(&#39;lyDo&#39;)</code> ở đầu form, mỗi phím trong ô "Lý do" làm render lại <em>cả form</em> (15 lần cho 15 ký tự). Với <code>useWatch</code> trong một component con bé xíu, chỉ component con đó render lại; bản thân form vẫn ở con số 0. Form đặt lịch làm theo cách thứ hai: bộ đếm là một component riêng <code>DemKyTuLyDo</code>. Đây vẫn là ý "đặt state càng thấp càng tốt" của Chương 2, chỉ là áp cho một lượt đăng ký theo dõi.</p>

<h3>Một schema, dùng cả ở máy chủ</h3>
<p>Kiểm ở client là để phục vụ người dùng; nó luôn bị lách được bằng cách gọi thẳng API. Máy chủ phải kiểm lại — và với Zod nó dùng được <em>đúng</em> file đó. Test mô phỏng hàm xử lý của <code>POST /api/lich-hen</code> chỉ bằng <code>datLichSchema.safeParse</code>:</p>
${pre('ts', SN.mayChu)}
${out(OUT.mayChu)}
<p><code>safeParse</code> không bao giờ ném lỗi; nó trả <code>{ success: true, data }</code> hoặc <code>{ success: false, error }</code>. Mỗi issue có <code>path</code> — đúng những chuỗi <code>benhNhan.soDienThoai</code> mà RHF dùng — nên ở 3.3 form đặt được lỗi của máy chủ vào dưới đúng ô. Ở dự án thật, schema nằm trong một gói dùng chung (ví dụ <code>packages/schema</code> trong monorepo), hoặc nằm ở backend và frontend import nó. Một cảnh báo, đã đo: <code>z.flattenError</code> mà nhiều bài hướng dẫn dùng chỉ làm phẳng <strong>một</strong> tầng. Với object lồng, cả ba lỗi của bệnh nhân dồn vào một khoá <code>benhNhan</code>:</p>
${out(OUT.flatten)}
<p>Đó là lý do hàm xử lý ở trên tự đổi <code>issues</code> thành <code>{ truong, loi }</code>. (Zod 4 cũng có <code>z.treeifyError</code> cho cây lỗi lồng nhau.)</p>

<h3>Cái giá: kích thước bundle</h3>
<p>Thư viện không miễn phí. Cùng dự án, build trước và sau chương này:</p>
${out(OUT.buildSoSanh)}
<p>Nặng thêm chừng 36 kB sau gzip cho RHF, Zod, resolver và mã form. Với một ứng dụng đặt lịch đó là cái giá hợp lý; với một trang giới thiệu chỉ có một ô email thì không — ở đó form không kiểm soát với <code>FormData</code> là công cụ tốt hơn. Zod còn có bản nhẹ hơn <code>zod/mini</code>; bài này không đo nó nên không đưa con số nào.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 một form đăng ký thường là component (class hoặc hàm) với mỗi ô một <code>useState</code>, một object <code>errors</code>, và hàm <code>validate()</code> đầy <code>if (!email.includes(&#39;@&#39;))</code>; vài slide còn thêm PropTypes để mô tả props. → Đi làm: <strong>React Hook Form</strong> giữ trạng thái form, <strong>Zod</strong> giữ luật, <code>z.infer</code>/<code>z.output</code> cho kiểu, và cùng schema đó chạy ở máy chủ. · <em>Vì sao:</em> một nguồn duy nhất cho luật và kiểu (client, server, TypeScript không lệch nhau), không render lại ở mỗi phím (đo được: 0 so với 12), lỗi và focus có sẵn, và trình biên dịch bắt tên field sai. Cách FER202 vẫn dạy bạn chính xác những gì thư viện tự động hoá; bạn sẽ gặp lại nó ở mã cũ, và Formik (thư viện cũ hơn, xây trên ô kiểm soát) cũng còn nhiều trong các dự án cũ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Vì sao dùng React Hook Form thay vì useState cho form?</strong><br>Đáp: RHF đăng ký ô ở dạng không kiểm soát và đọc qua ref, nên gõ phím không làm form render lại; nó chỉ render khi một phần <code>formState</code> tôi thật sự đọc thay đổi. Nó còn cho sẵn kiểm dữ liệu, trạng thái lỗi, focus vào lỗi đầu tiên và trạng thái gửi. Tôi đã đo: gõ 12 ký tự làm form <code>useState</code> render 12 lần, form RHF 0 lần.</p>
<p><strong>Hỏi: Vì sao Zod mà không viết luật trong component?</strong><br>Đáp: Schema là dữ liệu thường, nên máy chủ import được cùng file; kiểu TypeScript suy ra từ nó nên luật và kiểu không bao giờ lệch; và nó làm sạch được dữ liệu (trim, chuẩn hoá, transform) trước khi kiểm.</p>
<p><strong>Hỏi: <code>watch</code> và <code>useWatch</code> khác nhau thế nào?</strong><br>Đáp: <code>watch</code> đăng ký ở gốc form, nên cả form render lại mỗi khi field được theo dõi đổi. <code>useWatch</code> đăng ký ở component gọi nó, nên tôi đặt nó trong một component con nhỏ và chỉ con đó render lại.</p>
</div>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Cài ba gói (<code>npm install react-hook-form zod @hookform/resolvers</code>) và kiểm phiên bản bằng <code>npm ls</code>.</li>
<li>Viết lại một form hai ô bằng <code>useForm</code> + <code>register</code> với luật viết thẳng. Gửi form trống; để ý ô sai đầu tiên được focus.</li>
<li>Dời luật sang một schema <code>z.object</code>, thêm <code>resolver: zodResolver(schema)</code>, xoá luật viết thẳng. Rê chuột lên tham số của hàm gửi trong trình soạn thảo: kiểu của nó đến từ schema.</li>
<li>Gõ sai một tên field trong <code>register</code> rồi chạy <code>npx tsc -b</code>. Đọc danh sách tên được phép trong câu lỗi.</li>
<li>Thử từng <code>mode</code> và tự mô tả lỗi hiện ra lúc nào. Giữ <code>onTouched</code>.</li>
<li>Chạy test của bài. Trên máy dựng bài:</li>
</ol>
${out(OUT.bai2Tong)}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> phòng khám muốn form "nhận nhắc lịch qua email": email, số ngày nhắc trước lịch hẹn (1–7), và một ô "Tôi đồng ý nhận email" bắt buộc tích.</p><ol>
<li>Viết <code>nhacLichSchema</code> với <code>z.email(&#39;…&#39;)</code>, một field số và một field checkbox. Gợi ý: <code>&lt;input type="number"&gt;</code> trả chuỗi — dùng <code>register(&#39;soNgay&#39;, { valueAsNumber: true })</code> hoặc <code>z.coerce.number()</code>; với checkbox, <code>z.literal(true, &#39;…&#39;)</code> bắt buộc phải tích.</li>
<li>Dựng form bằng <code>useForm({ resolver: zodResolver(nhacLichSchema), mode: &#39;onTouched&#39; })</code> và hiện mỗi lỗi dưới ô của nó.</li>
<li>Test: gửi trống thì hiện ba lỗi; email <code>abc</code> chỉ báo lỗi sau khi rời ô; dữ liệu hợp lệ thì <code>onGui</code> nhận <code>soNgay</code> là <strong>số</strong> (<code>expect(typeof du.soNgay).toBe(&#39;number&#39;)</code>).</li>
</ol><p><strong>Đạt khi:</strong> ba test xanh, <code>npx tsc -b</code> sạch, và rê chuột lên hàm gửi thấy một kiểu bạn chưa từng tự viết.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">React Hook Form (RHF)</span><span class="v">thư viện form xây trên ô không kiểm soát và ref; chỉ render lại cho state bạn đọc</span></div>
<div class="kv"><span class="k">register</span><span class="v">trả về <code>{ name, onChange, onBlur, ref }</code> để trải lên ô</span></div>
<div class="kv"><span class="k">handleSubmit</span><span class="v">bọc hàm gửi của bạn: kiểm trước, chỉ gọi nó với dữ liệu hợp lệ</span></div>
<div class="kv"><span class="k">schema (lược đồ)</span><span class="v">mô tả dữ liệu hợp lệ — luật, làm sạch và câu báo lỗi trong một object</span></div>
<div class="kv"><span class="k">resolver</span><span class="v">bộ chuyển cho RHF kiểm bằng một thư viện schema (<code>zodResolver</code>)</span></div>
<div class="kv"><span class="k">z.input / z.output</span><span class="v">kiểu dữ liệu trước và sau khi schema làm sạch/biến đổi</span></div>
<div class="kv"><span class="k">refine / transform / pipe</span><span class="v">luật tự viết · đổi giá trị · kiểm giá trị đã đổi bằng schema khác</span></div>
<div class="kv"><span class="k">mode</span><span class="v">lúc RHF kiểm trước lần gửi đầu: onSubmit, onBlur, onTouched, onChange, all</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>RHF đăng ký ô không kiểm soát: <code>{...register(&#39;duong.dan&#39;)}</code>; gõ phím không làm gì render lại (đo 0 so với 12).</li>
<li>Zod mô tả dữ liệu hợp lệ một lần; <code>zodResolver</code> cắm nó vào RHF; kiểu sinh từ schema.</li>
<li>Làm sạch rồi mới kiểm: <code>trim</code>, <code>normalize(&#39;NFC&#39;)</code>, <code>transform</code> + <code>pipe</code>; dùng <code>abort: true</code> để refine không bao giờ thấy dữ liệu rác.</li>
<li>TypeScript biết mọi đường dẫn field: gõ sai trong <code>register</code> là lỗi biên dịch.</li>
<li><code>mode: &#39;onTouched&#39;</code> là mặc định tốt; đọc giá trị sống bằng <code>useWatch</code> trong một con nhỏ, không bằng <code>watch</code> ở gốc.</li>
<li>Cùng schema kiểm ở máy chủ; đổi <code>issues</code> theo <code>path</code> (<code>flattenError</code> chỉ làm phẳng một tầng).</li>
</ul>

${LINK('https://react-hook-form.com/docs/useform', '📄', 'React Hook Form — useForm', 'Mọi tuỳ chọn: mode, reValidateMode, defaultValues, resolver, shouldFocusError.')}
${LINK('https://react-hook-form.com/docs/useform/register', '📄', 'React Hook Form — register', 'register trả về gì, tên lồng nhau, valueAsNumber.')}
${LINK('https://react-hook-form.com/docs/usewatch', '📄', 'React Hook Form — useWatch', 'Render lại cô lập cho giá trị sống.')}
${LINK('https://zod.dev/api', '📄', 'Zod — Defining schemas', 'Chuỗi, định dạng (z.iso.date, z.email), transform, pipe, refine trong Zod 4.')}
${LINK('https://zod.dev/error-formatting', '📄', 'Zod — Formatting errors', 'z.treeifyError, z.flattenError, z.prettifyError.')}
${LINK('https://github.com/react-hook-form/resolvers', '📄', 'GitHub — react-hook-form/resolvers', 'zodResolver và resolver cho các thư viện schema khác.')}
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Errors, loading and submit states: right place, never twice|||3.3 — Lỗi, đang gửi và trạng thái submit: lỗi đúng chỗ, không gửi hai lần',
      slug: 'rx-3-3-loi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lỗi dưới đúng ô với aria-invalid/aria-describedby và focus; bốn trạng thái của một lần gửi; bấm đúp đo trong Chromium với năm cách viết; vì sao isSubmitting chưa đủ và chốt ref đặt đúng chỗ; lỗi từ máy chủ gắn vào đúng ô bằng setError.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Errors, sending and submit states: errors in the right place, and never submitting twice</h2>
<p class="lead">A form that validates correctly can still be a bad form. The error can appear somewhere the user is not looking, a screen reader can stay silent, the button can stay clickable while the request is on its way, and an impatient double-click can book the same slot twice. This lesson fixes all of that in the booking form — and measures, in a real Chromium, which "fixes" you see in tutorials actually work.</p>

<p>The booking form (<code>FormDatLich</code>) is the one you finish in the chapter&#39;s project section. It uses the schema from 3.2, talks to a <em>fake</em> server that waits 800 ms (Chapter 6 replaces it with a real API mocked by MSW), and every behaviour below is covered by a test in the project.</p>

<h3>Errors belong under their input — and in the accessibility tree</h3>
${slide('rx-03', 15, 'Lỗi nằm dưới ô, đọc được bằng trình đọc màn hình')}
<p>Here is one field of the booking form, exactly as it is in the project:</p>
${pre('tsx', SN.oHoTen)}
<p>Five small details do most of the work:</p>
<ul>
<li><strong><code>&lt;label htmlFor="hoTen"&gt;</code> + <code>id="hoTen"</code></strong> connect the text "Họ và tên" to the input. Clicking the label focuses the input, a screen reader announces the label, and the tests can find the input with <code>getByLabelText(&#39;Họ và tên&#39;)</code> — the same way a user finds it.</li>
<li><strong>The error paragraph sits right under the input</strong>, not in a list at the top of the page. Users fix what they can see next to the field.</li>
<li><strong><code>aria-invalid</code></strong> tells assistive technology "this field is currently wrong"; the CSS uses the same attribute to paint a red border (<code>[aria-invalid=&#39;true&#39;]</code>), so the visual and the accessible state cannot disagree. It is <code>undefined</code> when there is no error, which removes the attribute entirely.</li>
<li><strong><code>aria-describedby="hoTen-loi"</code></strong> links the input to the error paragraph by <code>id</code>. When focus lands on the input, a screen reader reads the label <em>and</em> the error. The test checks this with <code>toHaveAccessibleDescription(&#39;Họ tên cần ít nhất 2 ký tự&#39;)</code>.</li>
<li><strong><code>noValidate</code> on the form</strong> turns off the browser&#39;s own tooltip bubbles (from attributes like <code>required</code> or <code>type="email"</code>), so every error looks and behaves the same — yours.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — <code>e?.hoTen</code> again.</strong> In the component, <code>const e = errors.benhNhan</code>. When nothing in the patient group is wrong, <code>errors.benhNhan</code> is <code>undefined</code>, so <code>e.hoTen</code> would throw. <code>e?.hoTen</code> returns <code>undefined</code> instead, and <code>{e?.hoTen &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> renders nothing. <code>&amp;&amp;</code> in JSX means "if the left side is truthy, render the right side".</p></div>
<p>Focus is the last piece. When you press "Gửi yêu cầu" on an empty form, React Hook Form moves focus to the first invalid field (its <code>shouldFocusError</code> option defaults to <code>true</code>). Measured in Chromium on the running app:</p>
${out(OUT.focus)}
<p>And in the test suite, submitting the empty form shows all four messages, focuses "Họ và tên" and never calls <code>onGui</code>:</p>
${out(OUT.loiForm)}

<h3>The four states of a submit</h3>
${slide('rx-03', 16, 'Bốn trạng thái của một lần gửi — ảnh chụp thật')}
<p>From the user&#39;s point of view, a form goes through four states. React Hook Form tracks each of them in <code>formState</code>, and you read only the ones you need:</p>
<table>
<thead><tr><th>State</th><th>RHF gives you</th><th>What the screen does</th></tr></thead>
<tbody>
<tr><td>① Entering</td><td><code>errors</code> (per field)</td><td>Errors under fields as they are touched (<code>mode: &#39;onTouched&#39;</code>).</td></tr>
<tr><td>② Sending</td><td><code>isSubmitting</code></td><td>Button disabled, label "Đang gửi…".</td></tr>
<tr><td>③ Server said no</td><td><code>errors.root.server</code> (you set it)</td><td>A message at the top of the form, <code>role="alert"</code>; data stays so the user can retry.</td></tr>
<tr><td>④ Done</td><td><code>isSubmitSuccessful</code></td><td>Replace the form with a confirmation, <code>role="status"</code>.</td></tr>
</tbody></table>
<p>The code for ② and ④:</p>
${pre('tsx', SN.trangThaiGui)}
<p>The key fact about <code>isSubmitting</code>: <code>handleSubmit</code> sets it to <code>true</code>, then <strong>awaits</strong> your submit function, and sets it back to <code>false</code> when that function&#39;s promise settles. So it is only correct if your function returns a promise that lasts as long as the request. The test "hợp lệ ⇒ …" freezes the fake server with a promise it controls, and checks the button in the middle:</p>
${out(OUT.duLieuGui)}
<p>While frozen, the button reads "Đang gửi…" and is disabled. After the promise resolves, the confirmation appears. For ③, the form catches the error from <code>onGui</code> and calls <code>setError(&#39;root.server&#39;, { message })</code>. The RHF docs note that a <code>root</code> error does not persist between submissions, and that calling <code>setError</code> in the catch block keeps <code>isSubmitSuccessful</code> <code>false</code>. The test checks that the alert appears, the button is enabled again, and what the user typed is still there — retrying must not mean retyping.</p>

<h3>Double submission, measured five ways</h3>
${slide('rx-03', 17, 'Bấm đúp thật trong Chromium: hai cách viết gửi hai lần')}
<p>"Disable the button while sending" is the standard advice. Whether it works depends on <em>how</em> you disable it. The lesson file has five versions of the same tiny form. The first sends every time; the second adds a state flag; the third uses a ref:</p>
${pre('tsx', SN.khongChan)}
${pre('tsx', SN.chanState)}
${pre('tsx', SN.chanRef)}
<p>The fourth and fifth use React Hook Form&#39;s <code>isSubmitting</code>. They differ by one word:</p>
${pre('tsx', SN.quenAwait)}
<p>(The fifth is identical except its submit function is <code>async (du) =&gt; { await onGui(du); }</code>.) The fake server counts requests and takes 50 ms. First, a real user&#39;s double-click, simulated with Testing Library&#39;s <code>user.dblClick</code>:</p>
${out(OUT.dblclick)}
<p>Then the same on the demo page in a real Chromium 141, with Playwright&#39;s mouse <code>dblclick()</code> and a server that takes 800 ms:</p>
${out(OUT.chromium)}
<p>Read the first block (real double-click). The unguarded form and the "forgot <code>await</code>" form both send twice. Everything else sends once, because between the two clicks the browser has time to run React&#39;s re-render, and the second click lands on a <code>disabled</code> button — which does not fire <code>click</code> at all. So for a real mouse, <code>disabled={isSubmitting}</code> with a correct <code>await</code> is enough.</p>
<div class="pitfall co-tieu-de"><strong>Trap — forgetting <code>await</code> (or <code>return</code>) in the submit function.</strong> <code>handleSubmit((du) =&gt; { onGui(du); })</code> starts the request and returns immediately with <code>undefined</code>. <code>handleSubmit</code> has nothing to wait for, so <code>isSubmitting</code> goes <code>true</code> and back to <code>false</code> in the same moment; the button never stays disabled, and the measured double-click sends twice. The screenshot on the slide shows it: form 4 still says "Gửi" 0.3 seconds after the double-click, while the server is still working. Always <code>await</code> the request inside the submit function (or <code>return</code> its promise).</div>

<h3>Why isSubmitting is not the whole answer</h3>
${slide('rx-03', 18, 'isSubmitting khoá nút SAU một lần render — ref khoá NGAY')}
<p>The second block of the Chromium output is different: the page runs <code>form.requestSubmit(); form.requestSubmit();</code> — two submits in one piece of JavaScript, with no chance for React to render in between. Now the state flag and even the correct RHF version send twice. Only the ref holds. The same thing in the test suite:</p>
${pre('tsx', SN.testCungNhip)}
${out(OUT.cungNhip)}
<p>This is Chapter 2&#39;s snapshot rule again. <code>if (dangGui) return</code> reads the state of the <em>current</em> render; <code>setDangGui(true)</code> only schedules the next one. Two submits that arrive before that render both see <code>false</code>. <code>isSubmitting</code> is state too, so it has the same blind spot, and a disabled attribute only exists after the commit. A ref is a plain object: <code>dangGuiRef.current = true</code> is visible to the very next line of code, render or not.</p>
<p>How often does "two submits in one task" happen? With a mouse, rarely — the measurements above show a double-click is already handled. It happens with scripts, some browser extensions, automated tests, keyboard shortcuts wired to <code>requestSubmit</code>, and slow devices where events queue up. For a form that books a limited slot or takes money, "rarely" is not good enough, so the booking form adds the ref as a second lock. The final lock always lives on the server (an idempotency key, "khoá chống lặp", so the same request twice creates one booking) — that is Chapter 14 territory.</p>

<h3>Put the ref lock in the right place</h3>
${slide('rx-03', 19, 'Chốt ref đặt sai chỗ: form báo “đã gửi” khi lần đầu còn treo')}
<p>The obvious place for the ref is at the top of the submit function you pass to <code>handleSubmit</code>. The first version of <code>FormDatLich</code> did exactly that, and its "same task" test failed. Real output:</p>
${out(OUT.refOnValid)}
<p>What happened: two <code>handleSubmit</code> calls both validated the data and both called the submit function. The second call hit the ref and <code>return</code>ed immediately — successfully, from RHF&#39;s point of view. So RHF set <code>isSubmitSuccessful</code> and the form replaced itself with "Đã gửi…" while the first request was still in flight. A lock inside the handler that RHF waits on changes what RHF believes. The fix is to lock <em>before</em> <code>handleSubmit</code> ever runs:</p>
${pre('tsx', SN.xuLySubmit)}
<p><code>handleSubmit(guiDi)</code> returns a function; <code>guiForm(ev)</code> calls it and returns a promise that settles after validation and the request. <code>.finally(…)</code> runs whether that promise succeeded, failed validation, or hit a server error, so the flag is always lowered. With this version the same-task test passes, and so does the check in Chromium on the running app:</p>
${out(OUT.formCungNhip)}
${out(OUT.appCungNhip)}
<div class="callout"><p><strong>JS quick reminder — <code>try / catch / finally</code> and <code>.finally()</code>.</strong> In an <code>async</code> function, <code>await</code> pauses until a promise settles; if it rejects, the <code>catch</code> block runs with the error. <code>finally</code> runs last in every case. On a promise, <code>.finally(fn)</code> is the same idea without <code>async/await</code>: "when this promise settles, one way or the other, run <code>fn</code>".</p></div>

<h3>Errors from the server, under the right field</h3>
${slide('rx-03', 20, 'Máy chủ vẫn phải kiểm — lỗi nó trả về gắn vào đúng ô')}
<p>Some errors only the server can know: "this phone number already has a pending booking", "this slot was just taken". In 3.2 the server handler answered with <code>400</code> and a list of <code>{ truong, loi }</code>. The form can put each one exactly where a client-side error would go:</p>
${pre('tsx', SN.loiMayChu)}
<p><code>setError(truong, { type: &#39;server&#39;, message }, { shouldFocus })</code> puts the message into <code>errors</code> under that field, so the same <code>&lt;p className="loi"&gt;</code> shows it, and <code>shouldFocus</code> moves the cursor there. Anything the form cannot attach to a field — the network is down, the server crashed — goes to <code>root.server</code> and appears at the top with <code>role="alert"</code>. Both tests in the lesson file pass: the phone field shows "Số này đã có lịch chờ xác nhận" and has focus; a network error shows the general message.</p>
<p>In the project, the fake server throws a plain <code>Error</code> for the number <code>0999 999 999</code>, and <code>FormDatLich</code> shows it at the top (the screenshot "③ lỗi máy chủ" on slide 16). When Chapter 6 brings a real API, the same <code>setError</code> calls will map its field errors.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>A typical FER202 submit handler validates, shows <code>alert(&#39;Đăng ký thành công!&#39;)</code> or a block of red text above the form, and leaves the button clickable the whole time; a React-Bootstrap <code>&lt;Form.Control.Feedback type="invalid"&gt;</code> is often the only error UI. → At work: each error under its own field, linked with <code>aria-describedby</code>, focus moved to the first error, a visible "sending" state with the button disabled, a ref lock against duplicate submits, server errors mapped back onto fields with <code>setError</code>, and the data kept when something fails. · <em>Why:</em> a duplicate booking or payment is a real support ticket (and sometimes a refund), <code>alert()</code> blocks the page and cannot be styled or tested nicely, and accessibility is a legal requirement in many markets. FER202&#39;s version is fine for learning submit handlers; it is exactly the version that produces the bugs measured above.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: How do you prevent a form from being submitted twice?</strong><br>A: Three layers. Disable the submit button while the request is pending — with React Hook Form that is <code>isSubmitting</code>, which only works if my submit function awaits the request. Add a ref flag checked before submitting, because state and <code>disabled</code> only update after a render and two submits in the same task can slip through; I measured that. And make the server idempotent, because the client can never fully guarantee it.</p>
<p><strong>Q: How do you show validation errors that come from the API?</strong><br>A: Map each field error in the response to <code>setError(&#39;field.path&#39;, { type: &#39;server&#39;, message })</code> so it appears under the right input, focus the first one, and put anything that is not about a field in a root error shown at the top with <code>role="alert"</code>. Keep the user&#39;s input.</p>
<p><strong>Q: What makes a form error accessible?</strong><br>A: A real <code>&lt;label&gt;</code>, <code>aria-invalid</code> on the input, the message linked with <code>aria-describedby</code>, and focus moved to the first invalid field — so a screen reader user hears the problem where it is.</p>
</div>

<h3>Run it step by step</h3>
<ol>
<li>Build the five tiny forms of this lesson on one demo page, each with a counter of "requests received" and a fake server that waits 800 ms.</li>
<li>Double-click each "Gửi" button. Which counters show 2? Compare with the table on the slide.</li>
<li>In the browser console, run <code>document.querySelectorAll(&#39;form&#39;).forEach(f =&gt; { f.requestSubmit(); f.requestSubmit(); })</code>. Which counters show 2 now?</li>
<li>In your booking form, add <code>aria-invalid</code> and <code>aria-describedby</code> to every input. Open Chrome DevTools → Elements → Accessibility pane on an invalid input and read its "Description".</li>
<li>Make the fake server throw, and check that the message appears at the top, the button comes back, and the typed data is still there.</li>
<li>Run the lesson&#39;s tests:</li>
</ol>
${out(OUT.bai3Tong)}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a patient changes the phone number on an existing booking. The API answers either OK, or a 400 with <code>[{ truong: &#39;soDienThoai&#39;, loi: &#39;Số này đã dùng cho một lịch khác&#39; }]</code>, and it takes 1 second.</p><ol>
<li>Build <code>FormDoiSdt</code> with React Hook Form + a one-field Zod schema (reuse the phone rule from <code>dat-lich.ts</code>: <code>benhNhanSchema.pick({ soDienThoai: true })</code>).</li>
<li>Show "Đang lưu…" and disable the button while saving; lock with a ref before <code>handleSubmit</code>.</li>
<li>Map the 400 to <code>setError(&#39;soDienThoai&#39;, …, { shouldFocus: true })</code>; map any other error to <code>root.server</code>.</li>
<li>Tests: (a) the server error appears under the field and the field has focus; (b) during the request the button is disabled and reads "Đang lưu…"; (c) two <code>fireEvent.submit</code> in one <code>act</code> call the API once.</li>
</ol><p><strong>Done when:</strong> the three tests are green, <code>npx tsc -b</code> is clean, and in the browser a double-click or two <code>requestSubmit()</code> calls produce exactly one request (count them in the Network tab or with a counter).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">isSubmitting</span><span class="v">RHF flag, true while <code>handleSubmit</code> awaits your submit function</span></div>
<div class="kv"><span class="k">isSubmitSuccessful</span><span class="v">true after a submit whose function finished without an error being set</span></div>
<div class="kv"><span class="k">setError</span><span class="v">put an error on a field path or on <code>root.*</code> from your own code (e.g. from the server)</span></div>
<div class="kv"><span class="k">aria-invalid</span><span class="v">marks an input as currently invalid for assistive technology</span></div>
<div class="kv"><span class="k">aria-describedby</span><span class="v">links an input to the id of the text that describes it (its error)</span></div>
<div class="kv"><span class="k">role="alert" / role="status"</span><span class="v">live regions: announced immediately / announced politely</span></div>
<div class="kv"><span class="k">double submission (gửi hai lần)</span><span class="v">the same form sent twice before the first request finished</span></div>
<div class="kv"><span class="k">idempotent (luỹ đẳng)</span><span class="v">doing the same request twice has the same effect as once — the server-side guarantee</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Error under its field, <code>aria-invalid</code> + <code>aria-describedby</code>, real labels, focus on the first error, <code>noValidate</code> for consistent UI.</li>
<li>Four states: entering (<code>errors</code>), sending (<code>isSubmitting</code>), server refused (<code>root.server</code>), done (<code>isSubmitSuccessful</code>).</li>
<li><code>isSubmitting</code> is only right if the submit function <code>await</code>s the request — forgetting it sent twice on a real double-click.</li>
<li>State and <code>disabled</code> change after a render; two submits in one task slip through. A ref checked <em>before</em> <code>handleSubmit</code> stops them.</li>
<li>A ref lock inside the submit function fools RHF into "success"; release the lock in <code>finally</code>.</li>
<li>Server field errors go to <code>setError(path, …, { shouldFocus })</code>; everything else to <code>root.server</code>; never clear what the user typed.</li>
</ul>

${LINK('https://react-hook-form.com/docs/useform/formstate', '📄', 'React Hook Form — formState', 'isSubmitting, isSubmitSuccessful, submitCount, errors and how subscriptions work.')}
${LINK('https://react-hook-form.com/docs/useform/handlesubmit', '📄', 'React Hook Form — handleSubmit', 'Async submit functions, and why you should catch errors and call setError.')}
${LINK('https://react-hook-form.com/docs/useform/seterror', '📄', 'React Hook Form — setError', 'Field errors, root errors, and shouldFocus.')}
${LINK('https://react.dev/reference/react/useRef', '📄', 'react.dev — useRef', 'Why a ref changes immediately while state waits for the next render.')}
${LINK('https://react.dev/learn/state-as-a-snapshot', '📄', 'react.dev — State as a Snapshot', 'The rule behind "the state flag did not stop the second submit".')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Lỗi, đang gửi và trạng thái submit: lỗi đúng chỗ, và không bao giờ gửi hai lần</h2>
<p class="lead">Một form kiểm dữ liệu đúng vẫn có thể là một form tồi. Lỗi có thể hiện ở chỗ người dùng không nhìn, trình đọc màn hình có thể im lặng, nút vẫn bấm được khi yêu cầu đang trên đường đi, và một cú bấm đúp sốt ruột có thể đặt cùng một khung giờ hai lần. Bài này sửa tất cả những điều đó trong form đặt lịch — và ĐO, trong một Chromium thật, xem "cách sửa" nào trong các bài hướng dẫn thật sự có tác dụng.</p>

<p>Form đặt lịch (<code>FormDatLich</code>) chính là form bạn hoàn thành ở phần dự án của chương. Nó dùng schema của 3.2, nói chuyện với một máy chủ <em>giả</em> đợi 800 ms (Chương 6 thay bằng API thật được giả lập bằng MSW), và mọi hành vi dưới đây đều có test trong dự án.</p>

<h3>Lỗi thuộc về chỗ dưới ô của nó — và thuộc về cây trợ năng</h3>
${slide('rx-03', 15, 'Lỗi nằm dưới ô, đọc được bằng trình đọc màn hình')}
<p>Đây là một ô của form đặt lịch, đúng như trong dự án:</p>
${pre('tsx', SN.oHoTen)}
<p>Năm chi tiết nhỏ làm phần lớn công việc:</p>
<ul>
<li><strong><code>&lt;label htmlFor="hoTen"&gt;</code> + <code>id="hoTen"</code></strong> nối chữ "Họ và tên" với ô. Bấm vào nhãn là focus vào ô, trình đọc màn hình đọc nhãn, và test tìm ô bằng <code>getByLabelText(&#39;Họ và tên&#39;)</code> — đúng cách người dùng tìm nó.</li>
<li><strong>Đoạn báo lỗi nằm ngay dưới ô</strong>, không phải một danh sách trên đầu trang. Người dùng sửa thứ họ thấy ngay cạnh ô.</li>
<li><strong><code>aria-invalid</code></strong> báo cho công nghệ hỗ trợ "ô này đang sai"; CSS dùng chính thuộc tính đó để tô viền đỏ (<code>[aria-invalid=&#39;true&#39;]</code>), nên phần nhìn và phần trợ năng không thể nói ngược nhau. Khi không có lỗi nó là <code>undefined</code>, và thuộc tính biến mất hẳn.</li>
<li><strong><code>aria-describedby="hoTen-loi"</code></strong> nối ô với đoạn báo lỗi qua <code>id</code>. Khi focus vào ô, trình đọc màn hình đọc nhãn <em>và</em> lỗi. Test kiểm điều này bằng <code>toHaveAccessibleDescription(&#39;Họ tên cần ít nhất 2 ký tự&#39;)</code>.</li>
<li><strong><code>noValidate</code> trên form</strong> tắt các bong bóng báo lỗi riêng của trình duyệt (sinh ra từ <code>required</code> hay <code>type="email"</code>), để mọi lỗi trông và hành xử giống nhau — theo cách của bạn.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — lại là <code>e?.hoTen</code>.</strong> Trong component, <code>const e = errors.benhNhan</code>. Khi nhóm bệnh nhân không có lỗi nào, <code>errors.benhNhan</code> là <code>undefined</code>, nên <code>e.hoTen</code> sẽ ném lỗi. <code>e?.hoTen</code> trả về <code>undefined</code> thay vào đó, và <code>{e?.hoTen &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> không vẽ gì. <code>&amp;&amp;</code> trong JSX nghĩa là "vế trái đúng thì vẽ vế phải".</p></div>
<p>Focus là mảnh cuối. Bấm "Gửi yêu cầu" khi form trống, React Hook Form đưa focus tới ô sai đầu tiên (tuỳ chọn <code>shouldFocusError</code> mặc định là <code>true</code>). Đo trong Chromium trên ứng dụng đang chạy:</p>
${out(OUT.focus)}
<p>Còn trong bộ test, gửi form trống hiện đủ bốn câu báo lỗi, focus vào "Họ và tên" và không bao giờ gọi <code>onGui</code>:</p>
${out(OUT.loiForm)}

<h3>Bốn trạng thái của một lần gửi</h3>
${slide('rx-03', 16, 'Bốn trạng thái của một lần gửi — ảnh chụp thật')}
<p>Nhìn từ phía người dùng, một form đi qua bốn trạng thái. React Hook Form theo dõi từng trạng thái trong <code>formState</code>, và bạn chỉ đọc những cái mình cần:</p>
<table>
<thead><tr><th>Trạng thái</th><th>RHF đưa bạn</th><th>Màn hình làm gì</th></tr></thead>
<tbody>
<tr><td>① Đang nhập</td><td><code>errors</code> (theo từng ô)</td><td>Lỗi hiện dưới ô khi ô được chạm (<code>mode: &#39;onTouched&#39;</code>).</td></tr>
<tr><td>② Đang gửi</td><td><code>isSubmitting</code></td><td>Nút bị khoá, chữ "Đang gửi…".</td></tr>
<tr><td>③ Máy chủ từ chối</td><td><code>errors.root.server</code> (bạn tự đặt)</td><td>Thông báo ở đầu form, <code>role="alert"</code>; dữ liệu còn nguyên để thử lại.</td></tr>
<tr><td>④ Xong</td><td><code>isSubmitSuccessful</code></td><td>Thay form bằng lời xác nhận, <code>role="status"</code>.</td></tr>
</tbody></table>
<p>Mã cho ② và ④:</p>
${pre('tsx', SN.trangThaiGui)}
<p>Sự thật then chốt về <code>isSubmitting</code>: <code>handleSubmit</code> bật nó thành <code>true</code>, rồi <strong>await</strong> hàm gửi của bạn, và tắt về <code>false</code> khi promise của hàm đó xong. Vậy nó chỉ đúng nếu hàm của bạn trả về một promise kéo dài bằng yêu cầu gửi đi. Test "hợp lệ ⇒ …" đóng băng máy chủ giả bằng một promise do test nắm, rồi kiểm nút ở giữa chừng:</p>
${out(OUT.duLieuGui)}
<p>Trong lúc đóng băng, nút ghi "Đang gửi…" và bị khoá. Promise xong thì lời xác nhận hiện ra. Với ③, form bắt lỗi từ <code>onGui</code> và gọi <code>setError(&#39;root.server&#39;, { message })</code>. Tài liệu RHF ghi rõ lỗi <code>root</code> không tồn tại qua các lần gửi, và gọi <code>setError</code> trong khối catch giữ <code>isSubmitSuccessful</code> là <code>false</code>. Test kiểm thông báo hiện ra, nút mở khoá lại, và thứ người dùng đã gõ vẫn còn — thử lại không được có nghĩa là gõ lại.</p>

<h3>Gửi hai lần, đo năm cách</h3>
${slide('rx-03', 17, 'Bấm đúp thật trong Chromium: hai cách viết gửi hai lần')}
<p>"Khoá nút khi đang gửi" là lời khuyên chuẩn. Nó có tác dụng hay không tuỳ vào <em>cách</em> bạn khoá. File bài có năm phiên bản của cùng một form bé xíu. Bản thứ nhất lần nào cũng gửi; bản thứ hai thêm cờ bằng state; bản thứ ba dùng ref:</p>
${pre('tsx', SN.khongChan)}
${pre('tsx', SN.chanState)}
${pre('tsx', SN.chanRef)}
<p>Bản thứ tư và thứ năm dùng <code>isSubmitting</code> của React Hook Form. Chúng chỉ khác nhau đúng một chữ:</p>
${pre('tsx', SN.quenAwait)}
<p>(Bản thứ năm y hệt, chỉ khác hàm gửi là <code>async (du) =&gt; { await onGui(du); }</code>.) Máy chủ giả đếm số yêu cầu và mất 50 ms. Trước hết, cú bấm đúp của người dùng thật, giả lập bằng <code>user.dblClick</code> của Testing Library:</p>
${out(OUT.dblclick)}
<p>Rồi cũng việc đó trên trang ví dụ trong Chromium 141 thật, bằng <code>dblclick()</code> chuột của Playwright và máy chủ mất 800 ms:</p>
${out(OUT.chromium)}
<p>Đọc khối đầu (bấm đúp thật). Form không chặn và form "quên <code>await</code>" đều gửi hai lần. Mọi bản còn lại gửi một lần, vì giữa hai cú bấm trình duyệt có đủ thời gian chạy lần render của React, và cú bấm thứ hai rơi vào một nút <code>disabled</code> — nút bị khoá không phát sự kiện <code>click</code> nào. Vậy với chuột thật, <code>disabled={isSubmitting}</code> cộng <code>await</code> đúng chỗ là đủ.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — quên <code>await</code> (hoặc <code>return</code>) trong hàm gửi.</strong> <code>handleSubmit((du) =&gt; { onGui(du); })</code> khởi động yêu cầu rồi trả về ngay với <code>undefined</code>. <code>handleSubmit</code> chẳng có gì để đợi, nên <code>isSubmitting</code> bật <code>true</code> rồi tắt <code>false</code> trong cùng một khoảnh khắc; nút không bao giờ bị khoá lâu, và cú bấm đúp đo được gửi hai lần. Ảnh chụp trên slide cho thấy rõ: form 4 vẫn ghi "Gửi" 0,3 giây sau cú bấm đúp, trong khi máy chủ còn đang làm việc. Luôn <code>await</code> yêu cầu bên trong hàm gửi (hoặc <code>return</code> promise của nó).</div>

<h3>Vì sao isSubmitting chưa phải câu trả lời trọn vẹn</h3>
${slide('rx-03', 18, 'isSubmitting khoá nút SAU một lần render — ref khoá NGAY')}
<p>Khối thứ hai của output Chromium khác hẳn: trang chạy <code>form.requestSubmit(); form.requestSubmit();</code> — hai lần gửi trong cùng một đoạn JavaScript, React không có cơ hội render ở giữa. Giờ cả cờ bằng state lẫn bản RHF viết đúng đều gửi hai lần. Chỉ ref giữ được. Cùng chuyện đó trong bộ test:</p>
${pre('tsx', SN.testCungNhip)}
${out(OUT.cungNhip)}
<p>Đây lại là luật ảnh chụp (snapshot) của Chương 2. <code>if (dangGui) return</code> đọc state của lần render <em>hiện tại</em>; <code>setDangGui(true)</code> chỉ hẹn lần render sau. Hai lần gửi tới trước lần render đó đều thấy <code>false</code>. <code>isSubmitting</code> cũng là state nên có cùng điểm mù, còn thuộc tính <code>disabled</code> chỉ tồn tại sau commit. Ref là một object thường: <code>dangGuiRef.current = true</code> thấy được ngay ở dòng mã tiếp theo, có render hay không cũng vậy.</p>
<p>"Hai lần gửi trong cùng một tác vụ" hay xảy ra tới đâu? Với chuột thì hiếm — số đo ở trên cho thấy bấm đúp đã được chặn. Nó xảy ra với script, vài tiện ích mở rộng của trình duyệt, test tự động, phím tắt gắn vào <code>requestSubmit</code>, và máy yếu nơi sự kiện bị dồn hàng. Với một form đặt khung giờ có hạn hay trừ tiền, "hiếm" là chưa đủ, nên form đặt lịch thêm ref làm chốt thứ hai. Chốt cuối cùng luôn nằm ở máy chủ (khoá chống lặp — idempotency key — để cùng một yêu cầu gửi hai lần chỉ tạo một lịch) — đó là chuyện của Chương 14.</p>

<h3>Đặt chốt ref đúng chỗ</h3>
${slide('rx-03', 19, 'Chốt ref đặt sai chỗ: form báo “đã gửi” khi lần đầu còn treo')}
<p>Chỗ hiển nhiên để đặt ref là đầu hàm gửi mà bạn đưa cho <code>handleSubmit</code>. Bản đầu của <code>FormDatLich</code> làm đúng như vậy, và test "cùng một nhịp" của nó đỏ. Output thật:</p>
${out(OUT.refOnValid)}
<p>Chuyện đã xảy ra: hai lần gọi <code>handleSubmit</code> đều kiểm dữ liệu xong và đều gọi hàm gửi. Lần thứ hai đụng ref và <code>return</code> ngay — tức là "thành công", theo cách RHF nhìn. Thế là RHF bật <code>isSubmitSuccessful</code> và form tự thay bằng "Đã gửi…" trong khi yêu cầu đầu tiên vẫn đang bay. Một cái chốt nằm trong hàm mà RHF đang đợi sẽ làm thay đổi điều RHF tin. Cách sửa là chốt <em>trước khi</em> <code>handleSubmit</code> kịp chạy:</p>
${pre('tsx', SN.xuLySubmit)}
<p><code>handleSubmit(guiDi)</code> trả về một hàm; <code>guiForm(ev)</code> gọi hàm đó và nhận về một promise xong sau khi kiểm dữ liệu và gửi. <code>.finally(…)</code> chạy dù promise thành công, dữ liệu không hợp lệ, hay máy chủ báo lỗi, nên cờ lúc nào cũng được hạ. Với bản này, test cùng một nhịp xanh, và phép kiểm trong Chromium trên ứng dụng đang chạy cũng vậy:</p>
${out(OUT.formCungNhip)}
${out(OUT.appCungNhip)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>try / catch / finally</code> và <code>.finally()</code>.</strong> Trong hàm <code>async</code>, <code>await</code> dừng lại tới khi promise xong; nếu promise bị từ chối (reject), khối <code>catch</code> chạy với lỗi đó. <code>finally</code> chạy cuối cùng trong mọi trường hợp. Trên một promise, <code>.finally(fn)</code> là cùng ý tưởng nhưng không cần <code>async/await</code>: "khi promise này xong, dù theo cách nào, chạy <code>fn</code>".</p></div>

<h3>Lỗi từ máy chủ, dưới đúng ô</h3>
${slide('rx-03', 20, 'Máy chủ vẫn phải kiểm — lỗi nó trả về gắn vào đúng ô')}
<p>Có những lỗi chỉ máy chủ biết: "số điện thoại này đang có một lịch chờ xác nhận", "khung giờ này vừa có người đặt". Ở 3.2, hàm xử lý phía máy chủ trả <code>400</code> kèm danh sách <code>{ truong, loi }</code>. Form đặt được từng lỗi vào đúng chỗ mà lỗi phía client sẽ nằm:</p>
${pre('tsx', SN.loiMayChu)}
<p><code>setError(truong, { type: &#39;server&#39;, message }, { shouldFocus })</code> đặt câu báo vào <code>errors</code> dưới field đó, nên cùng thẻ <code>&lt;p className="loi"&gt;</code> hiện nó ra, và <code>shouldFocus</code> đưa con trỏ tới đó. Những gì form không gắn được vào một ô nào — mất mạng, máy chủ sập — đi vào <code>root.server</code> và hiện ở đầu form với <code>role="alert"</code>. Cả hai test trong file bài đều xanh: ô số điện thoại hiện "Số này đã có lịch chờ xác nhận" và có focus; lỗi mạng hiện thông báo chung.</p>
<p>Trong dự án, máy chủ giả ném một <code>Error</code> thường với số <code>0999 999 999</code>, và <code>FormDatLich</code> hiện nó ở đầu form (ảnh "③ lỗi máy chủ" trên slide 16). Khi Chương 6 mang API thật tới, cũng chính các lời gọi <code>setError</code> này sẽ gắn lỗi theo từng field của nó.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Hàm submit FER202 điển hình kiểm dữ liệu, bật <code>alert(&#39;Đăng ký thành công!&#39;)</code> hoặc một khối chữ đỏ phía trên form, và để nút bấm được suốt; <code>&lt;Form.Control.Feedback type="invalid"&gt;</code> của React-Bootstrap thường là giao diện báo lỗi duy nhất. → Đi làm: mỗi lỗi dưới đúng ô của nó, nối bằng <code>aria-describedby</code>, focus tới lỗi đầu tiên, có trạng thái "đang gửi" rõ ràng với nút bị khoá, chốt ref chống gửi lặp, lỗi máy chủ gắn lại vào từng ô bằng <code>setError</code>, và giữ nguyên dữ liệu khi có trục trặc. · <em>Vì sao:</em> một lịch hẹn hay khoản thanh toán bị trùng là một phiếu hỗ trợ thật (có khi phải hoàn tiền), <code>alert()</code> chặn cả trang và khó làm đẹp, khó test, còn trợ năng là yêu cầu pháp lý ở nhiều thị trường. Bản FER202 ổn để học cách viết hàm submit; nó cũng chính là bản sinh ra những bug đã đo ở trên.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Làm sao chặn một form bị gửi hai lần?</strong><br>Đáp: Ba lớp. Khoá nút gửi khi yêu cầu đang chờ — với React Hook Form là <code>isSubmitting</code>, và nó chỉ đúng nếu hàm gửi của tôi await yêu cầu. Thêm một cờ bằng ref kiểm trước khi gửi, vì state và <code>disabled</code> chỉ đổi sau một lần render nên hai lần gửi trong cùng một tác vụ vẫn lọt; tôi đã đo điều đó. Và làm máy chủ luỹ đẳng, vì client không bao giờ bảo đảm trọn vẹn được.</p>
<p><strong>Hỏi: Hiện lỗi kiểm tra dữ liệu do API trả về thế nào?</strong><br>Đáp: Đổi từng lỗi field trong phản hồi thành <code>setError(&#39;duong.dan&#39;, { type: &#39;server&#39;, message })</code> để nó hiện dưới đúng ô, focus vào cái đầu tiên, và thứ gì không thuộc field nào thì đặt vào lỗi root hiện ở đầu form với <code>role="alert"</code>. Giữ nguyên dữ liệu người dùng đã gõ.</p>
<p><strong>Hỏi: Điều gì làm một thông báo lỗi form dễ tiếp cận?</strong><br>Đáp: Có <code>&lt;label&gt;</code> thật, <code>aria-invalid</code> trên ô, câu báo nối bằng <code>aria-describedby</code>, và focus chuyển tới ô sai đầu tiên — để người dùng trình đọc màn hình nghe được vấn đề ngay tại chỗ.</p>
</div>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Dựng năm form bé xíu của bài trên một trang ví dụ, mỗi form có bộ đếm "máy chủ nhận bao nhiêu yêu cầu" và một máy chủ giả đợi 800 ms.</li>
<li>Bấm đúp từng nút "Gửi". Bộ đếm nào hiện 2? So với bảng trên slide.</li>
<li>Trong console trình duyệt, chạy <code>document.querySelectorAll(&#39;form&#39;).forEach(f =&gt; { f.requestSubmit(); f.requestSubmit(); })</code>. Giờ bộ đếm nào hiện 2?</li>
<li>Trong form đặt lịch của bạn, thêm <code>aria-invalid</code> và <code>aria-describedby</code> cho mọi ô. Mở Chrome DevTools → Elements → khung Accessibility trên một ô đang sai và đọc mục "Description".</li>
<li>Cho máy chủ giả ném lỗi, kiểm thông báo hiện ở đầu form, nút mở lại, và dữ liệu đã gõ vẫn còn.</li>
<li>Chạy test của bài:</li>
</ol>
${out(OUT.bai3Tong)}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bệnh nhân đổi số điện thoại trên một lịch hẹn đã có. API trả về hoặc OK, hoặc 400 kèm <code>[{ truong: &#39;soDienThoai&#39;, loi: &#39;Số này đã dùng cho một lịch khác&#39; }]</code>, và mất 1 giây.</p><ol>
<li>Dựng <code>FormDoiSdt</code> bằng React Hook Form + một schema Zod một field (dùng lại luật số điện thoại trong <code>dat-lich.ts</code>: <code>benhNhanSchema.pick({ soDienThoai: true })</code>).</li>
<li>Hiện "Đang lưu…" và khoá nút khi đang lưu; chốt bằng ref trước <code>handleSubmit</code>.</li>
<li>Đổi lỗi 400 thành <code>setError(&#39;soDienThoai&#39;, …, { shouldFocus: true })</code>; mọi lỗi khác vào <code>root.server</code>.</li>
<li>Test: (a) lỗi máy chủ hiện dưới ô và ô có focus; (b) trong lúc gửi nút bị khoá và ghi "Đang lưu…"; (c) hai <code>fireEvent.submit</code> trong một <code>act</code> chỉ gọi API một lần.</li>
</ol><p><strong>Đạt khi:</strong> ba test xanh, <code>npx tsc -b</code> sạch, và trên trình duyệt một cú bấm đúp hay hai lệnh <code>requestSubmit()</code> chỉ sinh đúng một yêu cầu (đếm ở tab Network hoặc bằng một bộ đếm).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">isSubmitting</span><span class="v">cờ của RHF, <code>true</code> suốt lúc <code>handleSubmit</code> await hàm gửi của bạn</span></div>
<div class="kv"><span class="k">isSubmitSuccessful</span><span class="v"><code>true</code> sau một lần gửi mà hàm gửi chạy xong và không có lỗi nào được đặt</span></div>
<div class="kv"><span class="k">setError</span><span class="v">tự đặt lỗi lên một đường dẫn field hoặc lên <code>root.*</code> (ví dụ lỗi từ máy chủ)</span></div>
<div class="kv"><span class="k">aria-invalid</span><span class="v">đánh dấu ô đang sai cho công nghệ hỗ trợ</span></div>
<div class="kv"><span class="k">aria-describedby</span><span class="v">nối ô với id của đoạn chữ mô tả nó (câu báo lỗi)</span></div>
<div class="kv"><span class="k">role="alert" / role="status"</span><span class="v">vùng thông báo sống: đọc ngay lập tức / đọc lịch sự khi rảnh</span></div>
<div class="kv"><span class="k">double submission (gửi hai lần)</span><span class="v">cùng một form bị gửi hai lần trước khi yêu cầu đầu tiên xong</span></div>
<div class="kv"><span class="k">idempotent (luỹ đẳng)</span><span class="v">làm cùng một yêu cầu hai lần có tác dụng như một lần — bảo đảm phía máy chủ</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lỗi dưới đúng ô, <code>aria-invalid</code> + <code>aria-describedby</code>, nhãn thật, focus vào lỗi đầu tiên, <code>noValidate</code> để giao diện nhất quán.</li>
<li>Bốn trạng thái: đang nhập (<code>errors</code>), đang gửi (<code>isSubmitting</code>), máy chủ từ chối (<code>root.server</code>), xong (<code>isSubmitSuccessful</code>).</li>
<li><code>isSubmitting</code> chỉ đúng khi hàm gửi <code>await</code> yêu cầu — quên nó là bấm đúp thật gửi hai lần.</li>
<li>State và <code>disabled</code> đổi sau một lần render; hai lần gửi trong một tác vụ vẫn lọt. Ref kiểm <em>trước</em> <code>handleSubmit</code> chặn được.</li>
<li>Chốt ref đặt trong hàm gửi làm RHF tưởng "thành công"; hạ chốt trong <code>finally</code>.</li>
<li>Lỗi field từ máy chủ → <code>setError(duongDan, …, { shouldFocus })</code>; còn lại → <code>root.server</code>; không bao giờ xoá thứ người dùng đã gõ.</li>
</ul>

${LINK('https://react-hook-form.com/docs/useform/formstate', '📄', 'React Hook Form — formState', 'isSubmitting, isSubmitSuccessful, submitCount, errors và cách đăng ký theo dõi.')}
${LINK('https://react-hook-form.com/docs/useform/handlesubmit', '📄', 'React Hook Form — handleSubmit', 'Hàm gửi bất đồng bộ, và vì sao nên bắt lỗi rồi gọi setError.')}
${LINK('https://react-hook-form.com/docs/useform/seterror', '📄', 'React Hook Form — setError', 'Lỗi theo field, lỗi root, và shouldFocus.')}
${LINK('https://react.dev/reference/react/useRef', '📄', 'react.dev — useRef', 'Vì sao ref đổi ngay còn state đợi lần render sau.')}
${LINK('https://react.dev/learn/state-as-a-snapshot', '📄', 'react.dev — State as a Snapshot', 'Luật đứng sau chuyện "cờ bằng state không chặn được lần gửi thứ hai".')}
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Vietnamese input and IME gotchas: composition, Enter, NFC/NFD|||3.4 — Gõ tiếng Việt và bẫy bộ gõ (IME): composition, Enter, NFC/NFD',
      slug: 'rx-3-4-tieng-viet',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bộ gõ soạn chữ trước khi chốt (compositionstart/update/end, đo trong Chromium bằng bộ gõ mô phỏng), Enter khi đang gõ dấu và isComposing, sửa value giữa lúc soạn làm lặp chữ, NFC và NFD, đếm ký tự, regex tên cho người Việt — và mục tự gõ tiếp dự án FormDatLich.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Vietnamese input and IME gotchas: composition, Enter while typing accents, NFC/NFD and name rules</h2>
<p class="lead">Most form tutorials are tested by people typing English. Your users type "Nguyễn Thị Ánh" with Telex or VNI, through Unikey or EVKey on Windows, the built-in Vietnamese keyboard on macOS and iOS, or Gboard and Laban Key on Android. Those tools are <strong>input method editors (IME, bộ gõ)</strong>, and they create bugs that never show up in an English-only test: messages sent half-typed, letters doubled, names that "look the same" but do not match. This lesson reproduces each one, fixes it, and is honest about which parts could only be simulated on the build machine.</p>

<h3>An IME composes text before committing it</h3>
${slide('rx-03', 21, 'Bộ gõ “soạn” chữ trước khi chốt — ba sự kiện composition')}
<p>With many IMEs, typing an accented word is a two-phase process. While you type, the IME shows a provisional, often underlined, piece of text — the <strong>composition</strong>. When you finish the word (space, Enter, or a key that cannot continue it), the IME <strong>commits</strong> the final text. The browser reports this with three events: <code>compositionstart</code>, <code>compositionupdate</code> (for every change), and <code>compositionend</code>. Normal <code>input</code> events still fire in between, which means React&#39;s <code>onChange</code> runs <em>during</em> composition with text that is not final yet.</p>
<p>Here is the real sequence recorded in Chromium 141 on the chapter&#39;s demo page, typing "cảm" the VNI way (c, a, m, 3):</p>
${out(OUT.imeSuKien)}
<p>How was that typed on a machine with no keyboard and no Vietnamese IME? Through Chromium&#39;s own DevTools protocol. <code>Input.imeSetComposition</code> tells the browser "the IME is now showing this text", and Chromium fires the composition and input events itself, exactly as it would for a real IME; <code>Input.insertText</code> commits. The helper used by the measurement script:</p>
${pre('js', SN.cdp)}
<p>⏳ <strong>Not run for real:</strong> the build machine has no physical keyboard and no Vietnamese IME, so every IME result in this lesson comes from this simulation (and from jsdom events in unit tests). Real IMEs differ: Unikey on Windows is commonly described as fixing up a word by sending backspaces and new characters instead of using composition at all (not verified here), and Safari orders <code>keydown</code> and <code>compositionend</code> differently from Chrome. The table at the end of the lesson lists exactly what to try by hand.</p>
<!-- CHAY-O-MAY: trên máy thật, mở trang vi-du/?bai=4 của dự án ch03 và gõ bằng (1) Unikey Telex + VNI trên Windows/Chrome, (2) bộ gõ Tiếng Việt của macOS trên Safari và Chrome, (3) Gboard/Laban Key trên Android Chrome: ghi lại thứ tự sự kiện (compositionstart/update/end, keydown Enter isComposing/keyCode) và kết quả của 4 ô ví dụ -->

<h3>Enter while composing belongs to the IME</h3>
${slide('rx-03', 22, 'Enter lúc đang soạn là của bộ gõ — kiểm isComposing')}
<p>A chat box or a quick note that sends on Enter is the classic victim. The naive version:</p>
${pre('tsx', SN.nhanTinSai)}
<p>In the recorded sequence, while "cảm" is still being composed, the user presses Enter to finish the word. Chromium delivers a <code>keydown</code> with <code>key === &#39;Enter&#39;</code> <em>and</em> <code>isComposing === true</code>. The naive handler sends. Real result in Chromium:</p>
${out(OUT.imeSai)}
<p>Two bugs in one. The message was sent while the word was not committed, and after the handler cleared the input, the IME committed "cảm" again — so the box still contains the text that was "already sent". The user presses Enter again and sends a duplicate. The fix is one check at the top of the handler:</p>
${pre('tsx', SN.dangGoDau)}
${pre('tsx', SN.nhanTinDung)}
${out(OUT.imeDungKq)}
<p>With the check, the Enter that finishes the word is left to the IME; nothing is sent, the composition ends normally, and the next Enter sends "cảm". <code>e.nativeEvent</code> is the browser&#39;s original <code>KeyboardEvent</code> underneath React&#39;s wrapper, and <code>isComposing</code> is a standard property of it. The extra <code>e.keyCode === 229</code> is a widely used fallback: browsers report key code 229 for keys that the IME is processing, and some older engines do not set <code>isComposing</code> reliably. (<code>keyCode</code> is deprecated and TypeScript&#39;s types mark it so; here it is used on purpose, only as a fallback.)</p>
<p>You can unit-test this without any browser by firing the events yourself with Testing Library. jsdom accepts <code>isComposing</code> in the event options:</p>
${pre('tsx', SN.testIme)}
<p>The "sai" version sends once, the "đúng" version zero times. This proves your handler reads the flag; it cannot prove that a given real IME sets it — that part stays on the manual list.</p>
<p>What about a normal <code>&lt;form&gt;</code> where Enter inside an input submits the form ("implicit submission")? Whether a browser submits the form while an IME is still composing was not measured here. ⏳ <strong>Not run for real:</strong> needs a real IME.</p>
<!-- CHAY-O-MAY: với form đặt lịch (FormDatLich), gõ họ tên bằng bộ gõ thật rồi nhấn Enter khi chữ cuối còn gạch chân: form có bị gửi không (Chrome, Safari, Firefox)? -->

<h3>Do not rewrite the value while the IME is composing</h3>
${slide('rx-03', 23, 'Sửa value giữa lúc soạn: “nguyễn” thành “Nnguyễn”')}
<p>Lesson 3.1 praised controlled inputs because they can rewrite text on the way in. With an IME that power becomes a bug. A "capitalise each word as you type" field:</p>
${pre('tsx', SN.vietHoaSai)}
<p>The simulation composes "n, ng, ngu, nguy, nguye, nguyê, nguyên, nguyễn" and then commits. Result:</p>
${out(OUT.vietHoa)}
<p>At the first composition step, <code>onChange</code> receives "n" and the component sets the value to "N". Changing the input&#39;s value from code in the middle of a composition pulls the text out from under the IME; when the IME later commits "nguyễn", it lands next to the "N" that is already there. The fix is to leave the value alone until the IME is done, and do the cosmetic work at <code>compositionend</code> or on blur:</p>
${pre('tsx', SN.vietHoaDung)}
<p>Good news for the booking form: React Hook Form registers <strong>uncontrolled</strong> inputs, so it never writes to <code>value</code> while you type, and this whole class of bug cannot happen. Cleaning (trim, normalise, formatting the phone number) happens in the Zod schema at submit time instead. That is one more reason, beyond render counts, to let the form library own the inputs.</p>

<h3>NFC and NFD: the same letters, different strings</h3>
${slide('rx-03', 24, 'Cùng chữ “Nguyễn”, hai chuỗi: NFC 6 đơn vị, NFD 8 đơn vị')}
<p>Unicode can write "ễ" two ways. <strong>NFC</strong> (composed, "dựng sẵn") uses one code point, U+1EC5. <strong>NFD</strong> (decomposed, "tổ hợp") uses three: a plain "e", a combining circumflex U+0302 and a combining tilde U+0303. On screen they look identical. To JavaScript they are different strings:</p>
${out(OUT.nfc)}
<p>Where does NFD come from? Unikey has a "Unicode tổ hợp" character set option; macOS stores file names in a decomposed form, so text copied from a file name can arrive decomposed; and documents pasted from other systems can carry either form. You do not control which one a user sends you. The consequences are practical: a search for "Nguyễn" does not find the NFD "Nguyễn" (<code>includes</code> is <code>false</code> above), two records for the "same" patient do not match, a 500-character limit counts wrong, and a unique index in the database lets both through.</p>
<p>The cure is to normalise at one boundary. The booking schema does it with <code>.normalize(&#39;NFC&#39;)</code> on the name and the reason, and the project test proves both the conversion and the length rule:</p>
${out(OUT.schemaNfd)}
<p>A 500-character reason written in NFD is 1,500 code units long; after the schema it is 500, and it passes the limit as it should. The doctor search from Chapter 2 was already safe, because <code>boDau()</code> converts to NFD and strips the marks before comparing — two tests in the lesson file check it.</p>
<p>One more measurement, because "character" is slippery even after normalising:</p>
${pre('js', SN.demKyTu)}
${out(OUT.demKyTu)}
<p><code>length</code> counts UTF-16 code units, <code>[...s]</code> counts code points, and <code>Intl.Segmenter</code> counts what a human calls characters (grapheme clusters). An emoji with a skin tone is 4 code units and 1 visible character. For a limit shown to users ("33/500") on text that is NFC-normalised, <code>length</code> is a reasonable, predictable choice, and it matches what the server will count; that is what the project uses.</p>

<h3>Name rules that do not reject your own users</h3>
${slide('rx-03', 25, 'Regex tên: [a-zA-Z] loại người Việt, À-ỹ nhận cả chữ Hy Lạp')}
<p>Three regexes you will find in real codebases for "a name contains only letters":</p>
${pre('ts', SN.regexTen)}
${out(OUT.regex)}
<ul>
<li><code>[a-zA-Z]</code> rejects "Nguyễn". It has rejected Vietnamese customers in production systems more often than anyone admits.</li>
<li><code>[a-zA-ZÀ-ỹ]</code> is the common "fix". The range U+00C0–U+1EF9 happens to include the combining marks (U+0300–U+036F), so NFD passes too — and it also includes Greek, Cyrillic and thousands of other characters. It "works" by accident.</li>
<li><code>[&#92;p{L}&#92;p{M}&#92;s&#39;.-]</code> with the <code>u</code> flag says what you mean: letters of any script, combining marks, spaces, apostrophes, dots and hyphens.</li>
</ul>
<p>The booking schema uses the third. It still rejects digits and symbols ("An 2" fails, as the schema test shows) while accepting a foreign patient called "O&#39;Connor" or "Jean-Luc". Be strict about what is clearly wrong and generous about names; the person filling the form knows their name better than your regex.</p>

<h3>What was simulated, and what needs a real keyboard</h3>
${slide('rx-03', 26, 'Mô phỏng được gì — và phải thử bằng bộ gõ THẬT cái gì')}
<table>
<thead><tr><th>Behaviour</th><th>Build machine (simulated)</th><th>Still to try by hand</th></tr></thead>
<tbody>
<tr><td>Composition events and their order</td><td>Chromium 141 + <code>Input.imeSetComposition</code></td><td>⏳ Unikey Telex/VNI (Windows), macOS Vietnamese (Safari + Chrome), Gboard/Laban (Android)</td></tr>
<tr><td>Enter while composing</td><td>Chromium: <code>isComposing=true</code>, <code>keyCode=13</code>; jsdom unit tests</td><td>⏳ real <code>keyCode</code> (229?) and whether <code>keydown</code> comes before or after <code>compositionend</code> in Safari</td></tr>
<tr><td>Rewriting value mid-composition</td><td>Chromium: "Nnguyễn"</td><td>⏳ same field with real IMEs, including mobile autocorrect</td></tr>
<tr><td>NFC/NFD, lengths, regexes</td><td>Fully tested (pure JavaScript)</td><td>— (does not depend on the keyboard)</td></tr>
</tbody></table>
<!-- CHAY-O-MAY: bảng trên — chạy trang vi-du/?bai=4 với từng bộ gõ thật, chụp ảnh 4 ô sau khi gõ "cảm" + Enter và "nguyễn", ghi keyCode/isComposing thật vào bài -->

<h3>The chapter&#39;s common mistakes</h3>
${slide('rx-03', 28, 'Sai lầm hay gặp ở Chương 3')}
<p>Before the project section, the six mistakes this chapter measured, in one place: <code>value</code> without <code>onChange</code> (read-only input); <code>useState()</code> without an initial string (uncontrolled → controlled warning); a submit function that forgets <code>await</code> (double submission on a real double-click); trusting <code>disabled</code> alone (two submits in one task slip through); Enter handlers that ignore the IME (half-typed messages, duplicates); and never normalising Unicode (search misses, wrong lengths).</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 exercises are typically tested with English sample data ("John", "test@gmail.com"), name checks like <code>/^[a-zA-Z ]+$/</code> copied from the internet, and <code>onKeyPress</code>/<code>onKeyDown</code> handlers that submit on <code>e.key === &#39;Enter&#39;</code>. → A company shipping to Vietnamese users tests with Vietnamese data and a real IME, normalises text to NFC at the boundary (schema and server), uses Unicode-aware rules (<code>&#92;p{L}</code>), checks <code>isComposing</code> before acting on Enter, and never rewrites an input&#39;s value mid-composition. · <em>Why:</em> these bugs only appear with the input methods your users actually use, they are hard to reproduce once reported ("it sends my message twice sometimes"), and a name rule that rejects "Nguyễn" rejects almost every Vietnamese customer at the very first field. The FER202 version is fine for a lab graded on English data; it is the version that breaks first in production.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: Our chat box sometimes sends half-typed Vietnamese words, or sends twice. Why?</strong><br>A: The Enter handler runs while the IME is still composing. The first Enter should only commit the word; I ignore keydown when <code>e.nativeEvent.isComposing</code> is true (with <code>keyCode === 229</code> as a fallback). Clearing the input mid-composition also lets the IME re-insert the word, which is where the duplicate comes from.</p>
<p><strong>Q: Two strings print the same "Nguyễn" but <code>===</code> is false. What is going on?</strong><br>A: One is NFC and the other NFD — composed and decomposed Unicode. I normalise with <code>.normalize(&#39;NFC&#39;)</code> at the boundary (form schema and server) before comparing, storing or counting length.</p>
</div>

<h3>Run it step by step</h3>
<ol>
<li>Add the four example inputs of this lesson to a demo page. If you have a Vietnamese IME, type "cảm" + Enter into the two chat boxes and "nguyễn" into the two name boxes, and compare with the results above.</li>
<li>Add <code>console.log(e.type, e.nativeEvent.isComposing, e.keyCode)</code> to <code>onKeyDown</code>, <code>onCompositionStart</code> and <code>onCompositionEnd</code>, and write down the order you see with your own IME.</li>
<li>In the browser console, compare <code>&#39;Nguyễn&#39;.normalize(&#39;NFC&#39;).length</code> with <code>&#39;Nguyễn&#39;.normalize(&#39;NFD&#39;).length</code>.</li>
<li>Run the lesson&#39;s tests:</li>
</ol>
${out(OUT.bai4Tong)}

<h3>🛠 Keep building the project</h3>
${slide('rx-03', 27, 'Kết quả chương: FormDatLich chạy thật trong ứng dụng')}
<p><strong>Starting point:</strong> the project after Chapter 2 — <code>src/types.ts</code>, <code>src/du-lieu/bac-si.ts</code> (<code>danhSachBacSi</code>), <code>src/du-lieu/chuyen-khoa.ts</code> (<code>TEN_CHUYEN_KHOA</code>), <code>src/logic/loc-bac-si.ts</code>, <code>src/logic/yeu-thich.ts</code>, and the components <code>Header</code>, <code>Footer</code>, <code>TheBacSi</code>, <code>DanhSachBacSi</code>, <code>ChipChuyenKhoa</code>, <code>OTimBacSi</code>, <code>ChiTietBacSi</code>, <code>KhuBacSi</code>. On the build machine that project has 16 green tests.</p>
<p><strong>Goal:</strong> when the user opens a doctor&#39;s details, a booking form appears under them: name, Vietnamese mobile number, date of birth, reason (≤ 500). Errors under the right field, a sending state, no double submission, a server error at the top, a confirmation at the end.</p>
${slide('rx-03', 30, 'Tự gõ tiếp dự án: FormDatLich bằng React Hook Form + Zod')}
<ol>
<li><strong>Install</strong> <code>react-hook-form zod @hookform/resolvers</code> if your project does not have them yet.</li>
<li><strong>Copy the acceptance tests first</strong> (below) into <code>src/schema/dat-lich.test.ts</code> and <code>src/components/FormDatLich.test.tsx</code>, and add the new test to <code>src/components/KhuBacSi.test.tsx</code>. Run <code>npx vitest run</code> and watch them fail — they are the specification.</li>
<li><strong><code>src/schema/dat-lich.ts</code></strong>: export <code>datLichSchema</code> (fields <code>benhNhan.hoTen</code>, <code>benhNhan.soDienThoai</code>, <code>benhNhan.ngaySinh</code>, <code>lyDo</code>), <code>benhNhanSchema</code>, <code>LY_DO_TOI_DA = 500</code>, and the types <code>DatLichForm</code> (input) and <code>DatLich</code> (output). Use exactly the error messages the tests expect. Trim and NFC-normalise text; turn <code>+84</code> and separators into a plain 10-digit number before checking; one error only for an empty date.</li>
<li><strong><code>src/logic/gui-dat-lich.ts</code></strong>: a fake server <code>guiYeuCauDatLich(bacSiId, duLieu)</code> that waits 800 ms, throws <code>new Error(&#39;Số điện thoại này đang có một lịch chờ xác nhận&#39;)</code> for <code>0999999999</code>, and otherwise returns a <code>LichHen</code> with <code>trangThai: &#39;cho-xac-nhan&#39;</code>.</li>
<li><strong><code>src/components/FormDatLich.tsx</code></strong>: props <code>bacSi</code> and <code>onGui: (duLieu: DatLich) =&gt; Promise&lt;void&gt;</code>. A form with <code>aria-label</code> "Đặt lịch với {bacSi.ten}", labels "Họ và tên", "Số điện thoại", "Ngày sinh", "Lý do khám"; each error in a <code>&lt;p className="loi"&gt;</code> under its input with <code>aria-invalid</code>/<code>aria-describedby</code>; a counter "N/500" (class <code>vuot</code> over the limit) in a child component using <code>useWatch</code>; button "Gửi yêu cầu" / "Đang gửi…" disabled while sending; server errors in <code>root.server</code> with <code>role="alert"</code>; after success a <code>role="status"</code> paragraph "Đã gửi yêu cầu đặt lịch với {bacSi.ten}…"; a ref lock before <code>handleSubmit</code>.</li>
<li><strong><code>KhuBacSi</code></strong>: under <code>ChiTietBacSi</code>, render <code>&lt;FormDatLich key={bacSiDangChon.id} … /&gt;</code> whose <code>onGui</code> awaits <code>guiYeuCauDatLich</code>. The <code>key</code> makes switching doctors start a fresh form (Chapter 11 explains keys and state in depth).</li>
<li>Style it (optional) and try it in <code>npm run dev</code>: submit empty, fill in <code>0999 999 999</code> to see the server error, then a real number.</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> is clean and <code>npx vitest run</code> shows 6 test files and 27 tests passing (16 from before + 4 schema + 6 form + 1 in <code>KhuBacSi</code>), and your screen matches the screenshot on slide 27 after pressing "Gửi yêu cầu" on an empty form. On the build machine:</p>
${out(OUT.tongDuAn)}
<p><strong>Acceptance test 1</strong> — <code>src/schema/dat-lich.test.ts</code>:</p>
${pre('ts', SN.schemaTest)}
<p><strong>Acceptance test 2</strong> — <code>src/components/FormDatLich.test.tsx</code>:</p>
${pre('tsx', SN.formDatLichTest)}
<p><strong>Acceptance test 3</strong> — append to <code>src/components/KhuBacSi.test.tsx</code>:</p>
${pre('tsx', SN.khuBacSiTest)}
<details><summary>Solution</summary>
<p><code>src/schema/dat-lich.ts</code>:</p>
${pre('ts', SN.schema)}
<p><code>src/logic/gui-dat-lich.ts</code>:</p>
${pre('ts', SN.guiDatLich)}
<p><code>src/components/FormDatLich.tsx</code>:</p>
${pre('tsx', SN.formDatLich)}
<p><code>src/components/KhuBacSi.tsx</code> — add <code>import { FormDatLich } from &#39;./FormDatLich&#39;;</code> and <code>import { guiYeuCauDatLich } from &#39;../logic/gui-dat-lich&#39;;</code>, then replace the detail branch in the <code>&lt;aside&gt;</code>:</p>
${pre('tsx', SN.khuBacSiDoan)}
<p>Styles appended to <code>src/App.css</code>:</p>
${pre('css', SN.css)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic adds a support chat. Enter sends, Shift+Enter makes a new line, and Vietnamese users must never send a half-typed word.</p><ol>
<li>Build <code>OChatHoTro</code>: a controlled <code>&lt;textarea&gt;</code> with <code>onKeyDown</code> that ignores the key when <code>dangGoDau(e)</code>, lets Shift+Enter through, and on plain Enter calls <code>onGui(noiDung.trim().normalize(&#39;NFC&#39;))</code> (if not empty) and clears the box.</li>
<li>Test with Testing Library: (a) <code>fireEvent.keyDown(o, { key: &#39;Enter&#39;, isComposing: true })</code> sends nothing; (b) Shift+Enter sends nothing and adds a line break (<code>user.type(o, &#39;a{Shift&gt;}{Enter}{/Shift}b&#39;)</code>); (c) typing "Cho em hỏi" then Enter sends exactly "Cho em hỏi"; (d) sending an NFD string delivers its NFC form.</li>
</ol><p><strong>Done when:</strong> the four tests are green and <code>npx tsc -b</code> is clean. If you have a Vietnamese IME, also type "cảm ơn" + Enter in the browser and check that one message is sent and the box ends up empty.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">IME (bộ gõ)</span><span class="v">input method editor: software that turns keystrokes into characters the keyboard cannot type directly</span></div>
<div class="kv"><span class="k">composition (soạn chữ)</span><span class="v">the provisional text an IME shows before committing it</span></div>
<div class="kv"><span class="k">compositionstart / update / end</span><span class="v">events for the start, each change and the end (commit or cancel) of a composition</span></div>
<div class="kv"><span class="k">isComposing</span><span class="v"><code>KeyboardEvent</code> property: true while a composition is in progress</span></div>
<div class="kv"><span class="k">NFC (dựng sẵn)</span><span class="v">Unicode form with precomposed characters — "ễ" is one code point</span></div>
<div class="kv"><span class="k">NFD (tổ hợp)</span><span class="v">Unicode form with base letter + combining marks — "ễ" is three code points</span></div>
<div class="kv"><span class="k">grapheme cluster</span><span class="v">what a human sees as one character; count with <code>Intl.Segmenter</code></span></div>
<div class="kv"><span class="k"><code>&#92;p{L}</code> / <code>&#92;p{M}</code></span><span class="v">regex classes (with the <code>u</code> flag) for any letter / any combining mark</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>IMEs compose before they commit; <code>onChange</code> fires with provisional text in between.</li>
<li>Ignore Enter while <code>e.nativeEvent.isComposing</code> (fallback <code>keyCode === 229</code>) — otherwise half-typed words are sent and can be sent twice.</li>
<li>Never rewrite a controlled value mid-composition ("Nnguyễn"); clean at <code>compositionend</code>, on blur, or in the schema — or use uncontrolled inputs (RHF).</li>
<li>NFC and NFD look identical but differ in JavaScript; normalise to NFC at one boundary (schema and server).</li>
<li><code>length</code> counts code units, not what users see; after NFC it is a predictable limit.</li>
<li>Name rules: <code>&#92;p{L}&#92;p{M}</code> with <code>u</code>, strict on digits and symbols, generous on names. Anything that depends on a real IME is on the manual test list.</li>
</ul>

${LINK('https://react.dev/reference/react-dom/components/common', '📄', 'react.dev — Common components (events)', 'onCompositionStart, onCompositionUpdate, onCompositionEnd, onKeyDown and the event objects React passes.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing', '📄', 'MDN — KeyboardEvent.isComposing', 'The standard flag for "an IME composition is in progress".')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize', '📄', 'MDN — String.prototype.normalize()', 'NFC, NFD, NFKC, NFKD with examples.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter', '📄', 'MDN — Intl.Segmenter', 'Counting grapheme clusters, words and sentences.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Gõ tiếng Việt và bẫy bộ gõ (IME): composition, Enter khi đang gõ dấu, NFC/NFD và luật tên</h2>
<p class="lead">Phần lớn bài hướng dẫn form được thử bởi người gõ tiếng Anh. Người dùng của bạn gõ "Nguyễn Thị Ánh" bằng Telex hay VNI, qua Unikey hay EVKey trên Windows, bàn phím tiếng Việt có sẵn của macOS và iOS, hoặc Gboard, Laban Key trên Android. Những công cụ đó là <strong>bộ gõ (IME — input method editor)</strong>, và chúng sinh ra những bug không bao giờ lộ ra trong một bài test chỉ có tiếng Anh: tin nhắn gửi đi khi chữ còn dở, chữ bị lặp, những cái tên "nhìn giống hệt" mà không khớp. Bài này tái hiện từng bug, sửa nó, và nói thật phần nào chỉ mô phỏng được trên máy dựng bài.</p>

<h3>Bộ gõ soạn chữ trước khi chốt</h3>
${slide('rx-03', 21, 'Bộ gõ “soạn” chữ trước khi chốt — ba sự kiện composition')}
<p>Với nhiều bộ gõ, gõ một chữ có dấu là quá trình hai pha. Trong lúc gõ, bộ gõ hiện một đoạn chữ tạm, thường có gạch chân — đó là <strong>composition (đoạn đang soạn)</strong>. Khi bạn xong chữ (dấu cách, Enter, hoặc một phím không thể nối tiếp chữ đó), bộ gõ <strong>chốt (commit)</strong> chữ cuối cùng. Trình duyệt báo quá trình này bằng ba sự kiện: <code>compositionstart</code>, <code>compositionupdate</code> (mỗi lần thay đổi), và <code>compositionend</code>. Sự kiện <code>input</code> bình thường vẫn chạy xen giữa, nghĩa là <code>onChange</code> của React chạy <em>trong lúc</em> đang soạn với chữ chưa phải chữ cuối.</p>
<p>Đây là chuỗi sự kiện thật ghi được trong Chromium 141 trên trang ví dụ của chương, gõ "cảm" kiểu VNI (c, a, m, 3):</p>
${out(OUT.imeSuKien)}
<p>Làm sao gõ được như thế trên một máy không có bàn phím và không có bộ gõ tiếng Việt? Qua giao thức DevTools của chính Chromium. <code>Input.imeSetComposition</code> báo cho trình duyệt "bộ gõ đang hiện đoạn chữ này", và Chromium tự phát các sự kiện composition và input, y như với bộ gõ thật; <code>Input.insertText</code> thì chốt chữ. Hàm trợ giúp mà script đo dùng:</p>
${pre('js', SN.cdp)}
<p>⏳ <strong>Chưa chạy thật:</strong> máy dựng bài không có bàn phím vật lý và không có bộ gõ tiếng Việt, nên mọi kết quả về bộ gõ trong bài đến từ phép mô phỏng này (và từ sự kiện jsdom trong unit test). Bộ gõ thật có thể khác: Unikey trên Windows thường được mô tả là sửa chữ bằng cách gửi phím xoá rồi gõ ký tự mới thay vì dùng composition (bài này chưa kiểm), và Safari xếp thứ tự <code>keydown</code> với <code>compositionend</code> khác Chrome. Bảng ở cuối bài liệt kê chính xác những gì cần thử tay.</p>
<!-- CHAY-O-MAY: trên máy thật, mở trang vi-du/?bai=4 của dự án ch03 và gõ bằng (1) Unikey Telex + VNI trên Windows/Chrome, (2) bộ gõ Tiếng Việt của macOS trên Safari và Chrome, (3) Gboard/Laban Key trên Android Chrome: ghi lại thứ tự sự kiện (compositionstart/update/end, keydown Enter isComposing/keyCode) và kết quả của 4 ô ví dụ -->

<h3>Enter lúc đang soạn là của bộ gõ</h3>
${slide('rx-03', 22, 'Enter lúc đang soạn là của bộ gõ — kiểm isComposing')}
<p>Một ô chat hay ô ghi chú nhanh gửi khi nhấn Enter là nạn nhân kinh điển. Bản ngây thơ:</p>
${pre('tsx', SN.nhanTinSai)}
<p>Trong chuỗi sự kiện đã ghi, khi "cảm" còn đang soạn, người dùng nhấn Enter để chốt chữ. Chromium đưa một <code>keydown</code> có <code>key === &#39;Enter&#39;</code> <em>và</em> <code>isComposing === true</code>. Handler ngây thơ gửi luôn. Kết quả thật trong Chromium:</p>
${out(OUT.imeSai)}
<p>Hai bug trong một. Tin nhắn bị gửi khi chữ chưa chốt, và sau khi handler xoá ô, bộ gõ chốt "cảm" thêm lần nữa — nên ô vẫn còn đúng đoạn chữ "đã gửi". Người dùng nhấn Enter lần nữa và gửi trùng. Cách sửa là một phép kiểm ở đầu handler:</p>
${pre('tsx', SN.dangGoDau)}
${pre('tsx', SN.nhanTinDung)}
${out(OUT.imeDungKq)}
<p>Có phép kiểm, cú Enter dùng để chốt chữ được để lại cho bộ gõ; không gì bị gửi, đoạn soạn kết thúc bình thường, và cú Enter tiếp theo gửi "cảm". <code>e.nativeEvent</code> là <code>KeyboardEvent</code> gốc của trình duyệt nằm dưới lớp bọc của React, và <code>isComposing</code> là thuộc tính chuẩn của nó. Phần <code>e.keyCode === 229</code> thêm vào là cách dự phòng phổ biến: trình duyệt báo mã phím 229 cho những phím bộ gõ đang xử lý, và vài engine cũ không đặt <code>isComposing</code> đáng tin cậy. (<code>keyCode</code> đã bị khai tử, kiểu của TypeScript đánh dấu nó như vậy; ở đây nó được dùng có chủ ý, chỉ làm dự phòng.)</p>
<p>Bạn unit test được chuyện này mà không cần trình duyệt, bằng cách tự phát sự kiện với Testing Library. jsdom nhận <code>isComposing</code> trong tuỳ chọn sự kiện:</p>
${pre('tsx', SN.testIme)}
<p>Bản "sai" gửi một lần, bản "đúng" không lần nào. Điều này chứng minh handler của bạn đọc đúng cờ; nó không chứng minh được một bộ gõ thật cụ thể có đặt cờ đó hay không — phần ấy vẫn nằm trong danh sách thử tay.</p>
<p>Còn một <code>&lt;form&gt;</code> bình thường, nơi Enter trong ô input tự gửi form ("implicit submission") thì sao? Trình duyệt có gửi form khi bộ gõ còn đang soạn hay không — bài này chưa đo. ⏳ <strong>Chưa chạy thật:</strong> cần bộ gõ thật.</p>
<!-- CHAY-O-MAY: với form đặt lịch (FormDatLich), gõ họ tên bằng bộ gõ thật rồi nhấn Enter khi chữ cuối còn gạch chân: form có bị gửi không (Chrome, Safari, Firefox)? -->

<h3>Đừng sửa value khi bộ gõ đang soạn</h3>
${slide('rx-03', 23, 'Sửa value giữa lúc soạn: “nguyễn” thành “Nnguyễn”')}
<p>Bài 3.1 khen ô kiểm soát vì nó sửa được chữ ngay trên đường vào. Gặp bộ gõ, sức mạnh đó thành bug. Một ô "tự viết hoa chữ đầu mỗi từ khi gõ":</p>
${pre('tsx', SN.vietHoaSai)}
<p>Phép mô phỏng soạn "n, ng, ngu, nguy, nguye, nguyê, nguyên, nguyễn" rồi chốt. Kết quả:</p>
${out(OUT.vietHoa)}
<p>Ở bước soạn đầu tiên, <code>onChange</code> nhận "n" và component đặt giá trị thành "N". Đổi value của ô bằng mã khi đang soạn là giật đoạn chữ ra khỏi tay bộ gõ; khi bộ gõ chốt "nguyễn" về sau, nó rơi xuống cạnh chữ "N" đã nằm sẵn đó. Cách sửa là để yên value cho tới khi bộ gõ xong, và làm việc "làm đẹp" ở <code>compositionend</code> hoặc khi rời ô:</p>
${pre('tsx', SN.vietHoaDung)}
<p>Tin vui cho form đặt lịch: React Hook Form đăng ký ô <strong>không kiểm soát</strong>, nên nó không bao giờ ghi vào <code>value</code> khi bạn gõ, và cả họ bug này không thể xảy ra. Việc làm sạch (trim, chuẩn hoá, định dạng số điện thoại) diễn ra trong schema Zod lúc gửi. Thêm một lý do nữa, ngoài số lần render, để giao ô input cho thư viện form.</p>

<h3>NFC và NFD: cùng chữ, khác chuỗi</h3>
${slide('rx-03', 24, 'Cùng chữ “Nguyễn”, hai chuỗi: NFC 6 đơn vị, NFD 8 đơn vị')}
<p>Unicode viết được chữ "ễ" theo hai cách. <strong>NFC</strong> (dựng sẵn) dùng một mã, U+1EC5. <strong>NFD</strong> (tổ hợp) dùng ba mã: chữ "e" trơn, dấu mũ kết hợp U+0302 và dấu ngã kết hợp U+0303. Trên màn hình chúng giống hệt nhau. Với JavaScript chúng là hai chuỗi khác nhau:</p>
${out(OUT.nfc)}
<p>NFD từ đâu ra? Unikey có tuỳ chọn bảng mã "Unicode tổ hợp"; macOS lưu tên file ở dạng tách rời, nên chữ chép từ tên file có thể tới ở dạng tổ hợp; và tài liệu dán từ hệ thống khác có thể mang dạng nào cũng được. Bạn không kiểm soát được người dùng gửi dạng nào. Hậu quả rất thực tế: tìm "Nguyễn" không ra "Nguyễn" dạng NFD (<code>includes</code> ra <code>false</code> ở trên), hai hồ sơ của "cùng" một bệnh nhân không khớp, giới hạn 500 ký tự đếm sai, và chỉ mục unique trong CSDL cho cả hai lọt qua.</p>
<p>Cách chữa là chuẩn hoá ở MỘT biên giới. Schema đặt lịch làm việc đó bằng <code>.normalize(&#39;NFC&#39;)</code> trên họ tên và lý do, và test của dự án chứng minh cả phép chuyển lẫn luật độ dài:</p>
${out(OUT.schemaNfd)}
<p>Một lý do dài 500 ký tự viết ở dạng NFD dài 1.500 đơn vị mã; qua schema nó còn 500, và vượt qua giới hạn như đúng ra phải thế. Ô tìm bác sĩ của Chương 2 vốn đã an toàn, vì <code>boDau()</code> chuyển sang NFD rồi bỏ dấu trước khi so — hai test trong file bài kiểm điều đó.</p>
<p>Thêm một phép đo, vì "ký tự" vẫn trơn trượt kể cả sau khi chuẩn hoá:</p>
${pre('js', SN.demKyTu)}
${out(OUT.demKyTu)}
<p><code>length</code> đếm đơn vị mã UTF-16, <code>[...s]</code> đếm code point, còn <code>Intl.Segmenter</code> đếm thứ con người gọi là ký tự (grapheme cluster — cụm tự vị). Một emoji có màu da dài 4 đơn vị mã và là 1 ký tự nhìn thấy. Với giới hạn hiện cho người dùng ("33/500") trên chữ đã chuẩn hoá NFC, <code>length</code> là lựa chọn hợp lý, dễ đoán, và khớp với thứ máy chủ sẽ đếm; dự án dùng đúng cách đó.</p>

<h3>Luật tên không loại chính người dùng của bạn</h3>
${slide('rx-03', 25, 'Regex tên: [a-zA-Z] loại người Việt, À-ỹ nhận cả chữ Hy Lạp')}
<p>Ba regex bạn sẽ gặp trong mã thật cho luật "tên chỉ gồm chữ cái":</p>
${pre('ts', SN.regexTen)}
${out(OUT.regex)}
<ul>
<li><code>[a-zA-Z]</code> loại "Nguyễn". Nó đã loại khách hàng Việt ở các hệ thống production nhiều hơn người ta chịu thừa nhận.</li>
<li><code>[a-zA-ZÀ-ỹ]</code> là "cách sửa" phổ biến. Dải U+00C0–U+1EF9 tình cờ chứa luôn các dấu kết hợp (U+0300–U+036F), nên NFD cũng qua — và nó cũng chứa chữ Hy Lạp, chữ Kirin cùng hàng nghìn ký tự khác. Nó "chạy được" nhờ may mắn.</li>
<li><code>[&#92;p{L}&#92;p{M}&#92;s&#39;.-]</code> với cờ <code>u</code> nói đúng điều bạn muốn: chữ cái của mọi hệ chữ, dấu kết hợp, khoảng trắng, nháy đơn, dấu chấm và gạch nối.</li>
</ul>
<p>Schema đặt lịch dùng cái thứ ba. Nó vẫn chặn số và ký hiệu ("An 2" bị từ chối, như test của schema cho thấy) mà vẫn nhận bệnh nhân nước ngoài tên "O&#39;Connor" hay "Jean-Luc". Chặt với thứ rõ ràng sai, rộng với tên người; người điền form biết tên mình rõ hơn regex của bạn.</p>

<h3>Phần nào mô phỏng, phần nào cần bàn phím thật</h3>
${slide('rx-03', 26, 'Mô phỏng được gì — và phải thử bằng bộ gõ THẬT cái gì')}
<table>
<thead><tr><th>Hành vi</th><th>Máy dựng bài (mô phỏng)</th><th>Còn phải thử tay</th></tr></thead>
<tbody>
<tr><td>Sự kiện composition và thứ tự của chúng</td><td>Chromium 141 + <code>Input.imeSetComposition</code></td><td>⏳ Unikey Telex/VNI (Windows), bộ gõ tiếng Việt macOS (Safari + Chrome), Gboard/Laban (Android)</td></tr>
<tr><td>Enter khi đang soạn</td><td>Chromium: <code>isComposing=true</code>, <code>keyCode=13</code>; unit test jsdom</td><td>⏳ <code>keyCode</code> thật (229?) và <code>keydown</code> tới trước hay sau <code>compositionend</code> trên Safari</td></tr>
<tr><td>Sửa value giữa lúc soạn</td><td>Chromium: "Nnguyễn"</td><td>⏳ cùng ô đó với bộ gõ thật, kể cả tự sửa chính tả trên điện thoại</td></tr>
<tr><td>NFC/NFD, độ dài, regex</td><td>Đã test đủ (JavaScript thuần)</td><td>— (không phụ thuộc bàn phím)</td></tr>
</tbody></table>
<!-- CHAY-O-MAY: bảng trên — chạy trang vi-du/?bai=4 với từng bộ gõ thật, chụp ảnh 4 ô sau khi gõ "cảm" + Enter và "nguyễn", ghi keyCode/isComposing thật vào bài -->

<h3>Những sai lầm hay gặp của cả chương</h3>
${slide('rx-03', 28, 'Sai lầm hay gặp ở Chương 3')}
<p>Trước phần dự án, sáu sai lầm chương này đã đo, gom một chỗ: <code>value</code> thiếu <code>onChange</code> (ô chỉ đọc); <code>useState()</code> không có chuỗi ban đầu (cảnh báo không kiểm soát → kiểm soát); hàm gửi quên <code>await</code> (bấm đúp thật gửi hai lần); tin vào <code>disabled</code> một mình (hai lần gửi trong một tác vụ vẫn lọt); handler Enter bỏ qua bộ gõ (gửi chữ dở, gửi trùng); và không chuẩn hoá Unicode (tìm không ra, đếm sai độ dài).</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Bài tập FER202 thường được thử bằng dữ liệu mẫu tiếng Anh ("John", "test@gmail.com"), luật tên kiểu <code>/^[a-zA-Z ]+$/</code> chép trên mạng, và handler <code>onKeyPress</code>/<code>onKeyDown</code> gửi luôn khi <code>e.key === &#39;Enter&#39;</code>. → Một công ty làm sản phẩm cho người Việt test bằng dữ liệu tiếng Việt và bộ gõ thật, chuẩn hoá chữ về NFC ở biên giới (schema và máy chủ), dùng luật hiểu Unicode (<code>&#92;p{L}</code>), kiểm <code>isComposing</code> trước khi xử lý Enter, và không bao giờ sửa value của ô giữa lúc đang soạn. · <em>Vì sao:</em> những bug này chỉ lộ ra với đúng bộ gõ người dùng đang dùng, rất khó tái hiện sau khi bị báo ("thỉnh thoảng nó gửi tin của tôi hai lần"), và một luật tên loại "Nguyễn" là loại gần như mọi khách hàng Việt ngay ở ô đầu tiên. Bản FER202 ổn cho bài lab chấm bằng dữ liệu tiếng Anh; nó cũng là bản vỡ đầu tiên khi lên production.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Ô chat của chúng tôi thỉnh thoảng gửi chữ tiếng Việt gõ dở, hoặc gửi hai lần. Vì sao?</strong><br>Đáp: Handler Enter chạy khi bộ gõ vẫn đang soạn. Cú Enter đầu chỉ nên chốt chữ; tôi bỏ qua keydown khi <code>e.nativeEvent.isComposing</code> là true (dự phòng bằng <code>keyCode === 229</code>). Xoá ô giữa lúc đang soạn còn khiến bộ gõ chèn lại chữ, và bản gửi trùng đến từ đó.</p>
<p><strong>Hỏi: Hai chuỗi in ra cùng là "Nguyễn" nhưng <code>===</code> lại false. Chuyện gì vậy?</strong><br>Đáp: Một chuỗi là NFC, chuỗi kia là NFD — Unicode dựng sẵn và tổ hợp. Tôi chuẩn hoá bằng <code>.normalize(&#39;NFC&#39;)</code> ở biên giới (schema của form và máy chủ) trước khi so sánh, lưu hay đếm độ dài.</p>
</div>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Thêm bốn ô ví dụ của bài vào một trang thử. Nếu có bộ gõ tiếng Việt, gõ "cảm" + Enter vào hai ô chat và "nguyễn" vào hai ô họ tên, rồi so với kết quả ở trên.</li>
<li>Thêm <code>console.log(e.type, e.nativeEvent.isComposing, e.keyCode)</code> vào <code>onKeyDown</code>, <code>onCompositionStart</code> và <code>onCompositionEnd</code>, rồi ghi lại thứ tự bạn thấy với bộ gõ của chính mình.</li>
<li>Trong console trình duyệt, so <code>&#39;Nguyễn&#39;.normalize(&#39;NFC&#39;).length</code> với <code>&#39;Nguyễn&#39;.normalize(&#39;NFD&#39;).length</code>.</li>
<li>Chạy test của bài:</li>
</ol>
${out(OUT.bai4Tong)}

<h3>🛠 Tự gõ tiếp dự án</h3>
${slide('rx-03', 27, 'Kết quả chương: FormDatLich chạy thật trong ứng dụng')}
<p><strong>Điểm xuất phát:</strong> dự án sau Chương 2 — <code>src/types.ts</code>, <code>src/du-lieu/bac-si.ts</code> (<code>danhSachBacSi</code>), <code>src/du-lieu/chuyen-khoa.ts</code> (<code>TEN_CHUYEN_KHOA</code>), <code>src/logic/loc-bac-si.ts</code>, <code>src/logic/yeu-thich.ts</code>, và các component <code>Header</code>, <code>Footer</code>, <code>TheBacSi</code>, <code>DanhSachBacSi</code>, <code>ChipChuyenKhoa</code>, <code>OTimBacSi</code>, <code>ChiTietBacSi</code>, <code>KhuBacSi</code>. Trên máy dựng bài dự án đó có 16 test xanh.</p>
<p><strong>Mục tiêu:</strong> khi người dùng mở chi tiết một bác sĩ, một form đặt lịch hiện ngay bên dưới: họ tên, số di động Việt Nam, ngày sinh, lý do (≤ 500). Lỗi dưới đúng ô, có trạng thái đang gửi, không gửi được hai lần, lỗi máy chủ ở đầu form, lời xác nhận ở cuối.</p>
${slide('rx-03', 30, 'Tự gõ tiếp dự án: FormDatLich bằng React Hook Form + Zod')}
<ol>
<li><strong>Cài</strong> <code>react-hook-form zod @hookform/resolvers</code> nếu dự án của bạn chưa có.</li>
<li><strong>Chép test nghiệm thu trước</strong> (bên dưới) vào <code>src/schema/dat-lich.test.ts</code> và <code>src/components/FormDatLich.test.tsx</code>, và thêm test mới vào <code>src/components/KhuBacSi.test.tsx</code>. Chạy <code>npx vitest run</code> và nhìn chúng đỏ — chúng chính là đề bài.</li>
<li><strong><code>src/schema/dat-lich.ts</code></strong>: xuất <code>datLichSchema</code> (các field <code>benhNhan.hoTen</code>, <code>benhNhan.soDienThoai</code>, <code>benhNhan.ngaySinh</code>, <code>lyDo</code>), <code>benhNhanSchema</code>, <code>LY_DO_TOI_DA = 500</code>, và hai kiểu <code>DatLichForm</code> (đầu vào) và <code>DatLich</code> (đầu ra). Dùng đúng câu báo lỗi mà test đợi. Trim và chuẩn hoá NFC phần chữ; đổi <code>+84</code> và các dấu ngăn thành một số 10 chữ số trước khi kiểm; ngày sinh trống chỉ được ra một lỗi.</li>
<li><strong><code>src/logic/gui-dat-lich.ts</code></strong>: máy chủ giả <code>guiYeuCauDatLich(bacSiId, duLieu)</code> đợi 800 ms, ném <code>new Error(&#39;Số điện thoại này đang có một lịch chờ xác nhận&#39;)</code> với số <code>0999999999</code>, còn lại trả về một <code>LichHen</code> có <code>trangThai: &#39;cho-xac-nhan&#39;</code>.</li>
<li><strong><code>src/components/FormDatLich.tsx</code></strong>: props <code>bacSi</code> và <code>onGui: (duLieu: DatLich) =&gt; Promise&lt;void&gt;</code>. Một form có <code>aria-label</code> "Đặt lịch với {bacSi.ten}", các nhãn "Họ và tên", "Số điện thoại", "Ngày sinh", "Lý do khám"; mỗi lỗi trong một <code>&lt;p className="loi"&gt;</code> dưới ô của nó, kèm <code>aria-invalid</code>/<code>aria-describedby</code>; bộ đếm "N/500" (class <code>vuot</code> khi quá giới hạn) nằm trong một component con dùng <code>useWatch</code>; nút "Gửi yêu cầu" / "Đang gửi…" bị khoá khi đang gửi; lỗi máy chủ ở <code>root.server</code> với <code>role="alert"</code>; gửi xong thì một đoạn <code>role="status"</code> "Đã gửi yêu cầu đặt lịch với {bacSi.ten}…"; chốt ref trước <code>handleSubmit</code>.</li>
<li><strong><code>KhuBacSi</code></strong>: dưới <code>ChiTietBacSi</code>, vẽ <code>&lt;FormDatLich key={bacSiDangChon.id} … /&gt;</code> với <code>onGui</code> await <code>guiYeuCauDatLich</code>. <code>key</code> làm cho đổi bác sĩ là bắt đầu một form mới tinh (Chương 11 giải thích key và state sâu hơn).</li>
<li>Thêm style (tuỳ chọn) và thử trong <code>npm run dev</code>: gửi trống, điền <code>0999 999 999</code> để thấy lỗi máy chủ, rồi một số thật.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> sạch và <code>npx vitest run</code> cho 6 file test, 27 test xanh (16 cũ + 4 schema + 6 form + 1 trong <code>KhuBacSi</code>), và màn hình của bạn giống ảnh chụp ở slide 27 sau khi bấm "Gửi yêu cầu" với form trống. Trên máy dựng bài:</p>
${out(OUT.tongDuAn)}
<p><strong>Test nghiệm thu 1</strong> — <code>src/schema/dat-lich.test.ts</code>:</p>
${pre('ts', SN.schemaTest)}
<p><strong>Test nghiệm thu 2</strong> — <code>src/components/FormDatLich.test.tsx</code>:</p>
${pre('tsx', SN.formDatLichTest)}
<p><strong>Test nghiệm thu 3</strong> — thêm vào cuối <code>src/components/KhuBacSi.test.tsx</code>:</p>
${pre('tsx', SN.khuBacSiTest)}
<details><summary>Lời giải</summary>
<p><code>src/schema/dat-lich.ts</code>:</p>
${pre('ts', SN.schema)}
<p><code>src/logic/gui-dat-lich.ts</code>:</p>
${pre('ts', SN.guiDatLich)}
<p><code>src/components/FormDatLich.tsx</code>:</p>
${pre('tsx', SN.formDatLich)}
<p><code>src/components/KhuBacSi.tsx</code> — thêm <code>import { FormDatLich } from &#39;./FormDatLich&#39;;</code> và <code>import { guiYeuCauDatLich } from &#39;../logic/gui-dat-lich&#39;;</code>, rồi thay nhánh chi tiết trong <code>&lt;aside&gt;</code>:</p>
${pre('tsx', SN.khuBacSiDoan)}
<p>Style thêm vào cuối <code>src/App.css</code>:</p>
${pre('css', SN.css)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> phòng khám thêm ô chat hỗ trợ. Enter là gửi, Shift+Enter là xuống dòng, và người dùng Việt không bao giờ được gửi đi một chữ đang gõ dở.</p><ol>
<li>Dựng <code>OChatHoTro</code>: một <code>&lt;textarea&gt;</code> kiểm soát với <code>onKeyDown</code> bỏ qua phím khi <code>dangGoDau(e)</code>, cho Shift+Enter đi qua, còn Enter trơn thì gọi <code>onGui(noiDung.trim().normalize(&#39;NFC&#39;))</code> (nếu không rỗng) rồi xoá ô.</li>
<li>Test bằng Testing Library: (a) <code>fireEvent.keyDown(o, { key: &#39;Enter&#39;, isComposing: true })</code> không gửi gì; (b) Shift+Enter không gửi và thêm một dòng mới (<code>user.type(o, &#39;a{Shift&gt;}{Enter}{/Shift}b&#39;)</code>); (c) gõ "Cho em hỏi" rồi Enter gửi đúng "Cho em hỏi"; (d) gửi một chuỗi NFD thì nhận về dạng NFC.</li>
</ol><p><strong>Đạt khi:</strong> bốn test xanh và <code>npx tsc -b</code> sạch. Nếu có bộ gõ tiếng Việt, gõ thêm "cảm ơn" + Enter trên trình duyệt và kiểm chỉ một tin được gửi, ô cuối cùng rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">IME (bộ gõ)</span><span class="v">input method editor: phần mềm biến phím bấm thành ký tự mà bàn phím không gõ thẳng được</span></div>
<div class="kv"><span class="k">composition (đoạn đang soạn)</span><span class="v">đoạn chữ tạm bộ gõ hiện ra trước khi chốt</span></div>
<div class="kv"><span class="k">compositionstart / update / end</span><span class="v">sự kiện lúc bắt đầu, mỗi lần đổi, và lúc kết thúc (chốt hoặc huỷ) một đoạn soạn</span></div>
<div class="kv"><span class="k">isComposing</span><span class="v">thuộc tính của <code>KeyboardEvent</code>: true khi đang có đoạn soạn dở</span></div>
<div class="kv"><span class="k">NFC (dựng sẵn)</span><span class="v">dạng Unicode dùng ký tự dựng sẵn — "ễ" là một code point</span></div>
<div class="kv"><span class="k">NFD (tổ hợp)</span><span class="v">dạng Unicode gồm chữ gốc + dấu kết hợp — "ễ" là ba code point</span></div>
<div class="kv"><span class="k">grapheme cluster (cụm tự vị)</span><span class="v">thứ con người thấy là một ký tự; đếm bằng <code>Intl.Segmenter</code></span></div>
<div class="kv"><span class="k"><code>&#92;p{L}</code> / <code>&#92;p{M}</code></span><span class="v">lớp regex (cần cờ <code>u</code>) cho mọi chữ cái / mọi dấu kết hợp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bộ gõ soạn rồi mới chốt; <code>onChange</code> chạy với chữ tạm ở giữa.</li>
<li>Bỏ qua Enter khi <code>e.nativeEvent.isComposing</code> (dự phòng <code>keyCode === 229</code>) — không thì chữ dở bị gửi và có thể bị gửi hai lần.</li>
<li>Đừng sửa value của ô kiểm soát giữa lúc soạn ("Nnguyễn"); làm sạch ở <code>compositionend</code>, khi rời ô, hoặc trong schema — hoặc dùng ô không kiểm soát (RHF).</li>
<li>NFC và NFD trông giống hệt nhưng khác nhau với JavaScript; chuẩn hoá về NFC ở một biên giới (schema và máy chủ).</li>
<li><code>length</code> đếm đơn vị mã, không phải thứ người dùng thấy; sau NFC nó là một giới hạn dễ đoán.</li>
<li>Luật tên: <code>&#92;p{L}&#92;p{M}</code> với cờ <code>u</code>, chặt với số và ký hiệu, rộng với tên người. Mọi thứ phụ thuộc bộ gõ thật nằm trong danh sách thử tay.</li>
</ul>

${LINK('https://react.dev/reference/react-dom/components/common', '📄', 'react.dev — Common components (sự kiện)', 'onCompositionStart, onCompositionUpdate, onCompositionEnd, onKeyDown và object sự kiện React truyền vào.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing', '📄', 'MDN — KeyboardEvent.isComposing', 'Cờ chuẩn cho "đang có đoạn soạn của bộ gõ".')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize', '📄', 'MDN — String.prototype.normalize()', 'NFC, NFD, NFKC, NFKD kèm ví dụ.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter', '📄', 'MDN — Intl.Segmenter', 'Đếm cụm tự vị, từ và câu.')}
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Chapter 3 quiz: forms|||3.5 — Kiểm tra Chương 3: form',
      slug: 'rx-3-5-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về ô kiểm soát/không kiểm soát, React Hook Form + Zod, lỗi và gửi hai lần, bộ gõ tiếng Việt và NFC/NFD — mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Chapter 3 quiz: forms</h2>
<p class="lead">Ten situations taken from the chapter&#39;s measurements: what the screen shows, what React prints, how many requests reach the server. Every correct answer was observed on the build machine, and every explanation says why the most tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain controlled vs uncontrolled inputs and name the cost of each (renders per keystroke).</li>
<li>I can fix both React warnings: value without onChange, and uncontrolled → controlled.</li>
<li>I can build a form with React Hook Form + a Zod schema, and say what <code>z.input</code> and <code>z.output</code> mean.</li>
<li>I can show errors under the right field with <code>aria-invalid</code>/<code>aria-describedby</code> and map server errors with <code>setError</code>.</li>
<li>I can prevent double submission and explain why <code>isSubmitting</code> alone is not enough.</li>
<li>I can handle Enter during IME composition and normalise Vietnamese text to NFC.</li>
</ul>
${slide('rx-03', 29, 'Bảng tra nhanh Chương 3')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3: form</h2>
<p class="lead">Mười tình huống lấy từ chính các phép đo của chương: màn hình hiện gì, React in gì, máy chủ nhận bao nhiêu yêu cầu. Mọi đáp án đúng đều đã quan sát được trên máy dựng bài, và mọi lời giải thích nói rõ vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được ô kiểm soát và không kiểm soát, và nói được cái giá của mỗi loại (số lần render mỗi phím).</li>
<li>Tôi sửa được cả hai cảnh báo của React: value thiếu onChange, và không kiểm soát → kiểm soát.</li>
<li>Tôi dựng được form bằng React Hook Form + schema Zod, và nói được <code>z.input</code>, <code>z.output</code> nghĩa là gì.</li>
<li>Tôi hiện được lỗi dưới đúng ô với <code>aria-invalid</code>/<code>aria-describedby</code> và gắn lỗi máy chủ bằng <code>setError</code>.</li>
<li>Tôi chặn được gửi hai lần và giải thích được vì sao chỉ <code>isSubmitting</code> là chưa đủ.</li>
<li>Tôi xử lý được Enter khi bộ gõ đang soạn và chuẩn hoá chữ tiếng Việt về NFC.</li>
</ul>
${slide('rx-03', 29, 'Bảng tra nhanh Chương 3')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A component has const [ten] = useState("Nguyễn Văn A") and renders <input value={ten} />. The user clicks the input and types "xyz". What happens?|||Một component có const [ten] = useState("Nguyễn Văn A") và vẽ <input value={ten} />. Người dùng bấm vào ô và gõ "xyz". Chuyện gì xảy ra?',
            options: [
              'The input shows "Nguyễn Văn Axyz" and React stays silent|||Ô hiện "Nguyễn Văn Axyz" và React im lặng',
              'The input keeps showing "Nguyễn Văn A" and React warns that a value prop was provided without an onChange handler|||Ô vẫn hiện "Nguyễn Văn A" và React cảnh báo có prop value mà không có handler onChange',
              'React throws an error and the page goes blank|||React ném lỗi và trang trắng xoá',
              'The input becomes uncontrolled and keeps what the user typed|||Ô tự thành không kiểm soát và giữ thứ người dùng gõ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: value={ten} makes the input controlled: it must always show ten. Nothing updates ten, so every keystroke is thrown away by the next render; the test typed "xyz" and the input still read "Nguyễn Văn A", and console.error printed "You provided a `value` prop to a form field without an `onChange` handler…". The tempting answer "it becomes uncontrolled" is wrong: React does not switch models for you — it warns and renders a read-only field. Fix: add onChange, use defaultValue, or add readOnly on purpose.|||VI: value={ten} biến ô thành ô kiểm soát: nó phải luôn hiện đúng ten. Không có gì cập nhật ten, nên mỗi phím bị lần render sau vứt đi; test gõ "xyz" mà ô vẫn ghi "Nguyễn Văn A", và console.error in "You provided a `value` prop to a form field without an `onChange` handler…". Phương án hấp dẫn "tự thành không kiểm soát" sai: React không tự đổi mô hình giúp bạn — nó cảnh báo và vẽ một ô chỉ đọc. Sửa: thêm onChange, dùng defaultValue, hoặc cố ý ghi readOnly.',
          },
          {
            question: 'const [ten, setTen] = useState<string>(); … <input value={ten} onChange={(e) => setTen(e.target.value)} />. The user types one letter. What does React print?|||const [ten, setTen] = useState<string>(); … <input value={ten} onChange={(e) => setTen(e.target.value)} />. Người dùng gõ một chữ. React in ra gì?',
            options: [
              'Nothing — the code is correct|||Không gì cả — mã đúng',
              'A TypeScript error at build time: string | undefined is not allowed for value|||Lỗi TypeScript lúc build: string | undefined không được dùng cho value',
              'A warning that the component is changing an uncontrolled input to be controlled|||Cảnh báo component đang đổi một ô không kiểm soát thành ô kiểm soát',
              'A warning that the input has no name attribute|||Cảnh báo ô input không có thuộc tính name',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: useState<string>() starts as undefined, and React treats value={undefined} as "no value" — an uncontrolled input. The first keystroke sets a string, so the same input becomes controlled, and React warns "A component is changing an uncontrolled input to be controlled…" (captured in the lesson’s test). "Nothing — the code is correct" is the tempting answer because the input seems to work, but the model switch is exactly the bug. Fix: useState("").|||VI: useState<string>() bắt đầu bằng undefined, và React hiểu value={undefined} là "không có value" — một ô không kiểm soát. Phím đầu đặt một chuỗi, nên cùng ô đó thành kiểm soát, và React cảnh báo "A component is changing an uncontrolled input to be controlled…" (test của bài đã bắt được). "Không gì cả — mã đúng" hấp dẫn vì ô có vẻ vẫn chạy, nhưng chính việc đổi mô hình là bug. Sửa: useState("").',
          },
          {
            question: 'Two forms with the same fields, each wrapped in a <Profiler>. Form 1 keeps every field in useState; form 2 uses React Hook Form with {...register(…)}. You type 12 characters into the name field of each. How many update commits were measured?|||Hai form cùng các ô, mỗi form bọc trong một <Profiler>. Form 1 giữ mọi ô bằng useState; form 2 dùng React Hook Form với {...register(…)}. Bạn gõ 12 ký tự vào ô họ tên của mỗi form. Đo được bao nhiêu lần commit update?',
            options: [
              'Form 1: 12 — form 2: 0|||Form 1: 12 — form 2: 0',
              'Form 1: 12 — form 2: 12|||Form 1: 12 — form 2: 12',
              'Form 1: 1 — form 2: 0, because React batches keystrokes|||Form 1: 1 — form 2: 0, vì React gộp các phím',
              'Form 1: 0 — form 2: 12, because RHF validates every keystroke|||Form 1: 0 — form 2: 12, vì RHF kiểm ở mỗi phím',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A controlled field calls setState on every keystroke, and each keystroke is its own event, so batching cannot merge them: 12 commits (and 12 in Chromium for the demo page). RHF registers uncontrolled inputs and reads them through refs; with the default onSubmit mode nothing it exposes changes while typing, so the form rendered 0 extra times. "React batches keystrokes" is wrong: batching merges updates inside ONE event, not across separate key presses.|||VI: Ô kiểm soát gọi setState ở mỗi phím, và mỗi phím là một sự kiện riêng, nên batching không gộp được: 12 lần commit (Chromium đo trang ví dụ cũng ra 12). RHF đăng ký ô không kiểm soát và đọc qua ref; với mode mặc định onSubmit, không thứ gì nó đưa ra thay đổi khi gõ, nên form render thêm 0 lần. "React gộp các phím" sai: batching gộp các cập nhật trong MỘT sự kiện, không gộp qua các lần nhấn phím riêng rẽ.',
          },
          {
            question: 'soDienThoai: z.string().trim().transform((s) => s.replace(/[ .-]/g, "").replace(/^[+]84/, "0")).pipe(z.string().regex(/^0(3|5|7|8|9)[0-9]{8}$/)). The user types "+84 901.234.567". What does the function passed to handleSubmit receive?|||soDienThoai: z.string().trim().transform((s) => s.replace(/[ .-]/g, "").replace(/^[+]84/, "0")).pipe(z.string().regex(/^0(3|5|7|8|9)[0-9]{8}$/)). Người dùng gõ "+84 901.234.567". Hàm đưa cho handleSubmit nhận được gì?',
            options: [
              'Nothing — the regex rejects "+84 901.234.567", so an error is shown|||Không gì — regex từ chối "+84 901.234.567", nên hiện lỗi',
              '"+84 901.234.567", because transforms only run on the server|||"+84 901.234.567", vì transform chỉ chạy ở máy chủ',
              '"84901234567", because transform removes the plus sign only|||"84901234567", vì transform chỉ bỏ dấu cộng',
              '"0901234567" — transform cleans the value first, then pipe checks the cleaned value|||"0901234567" — transform làm sạch giá trị trước, rồi pipe kiểm giá trị đã sạch',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: transform changes the value; pipe then runs the second schema on the transformed value, so the regex sees "0901234567" and passes. handleSubmit receives z.output — the schema test printed "soDienThoai":"0901234567". The tempting answer "the regex rejects it" would be true if the regex ran on the raw input (that is what pipe avoids). Zod runs wherever you call it; with zodResolver that is in the browser.|||VI: transform đổi giá trị; pipe rồi chạy schema thứ hai trên giá trị ĐÃ đổi, nên regex thấy "0901234567" và cho qua. handleSubmit nhận z.output — test của schema in ra "soDienThoai":"0901234567". Phương án hấp dẫn "regex từ chối" sẽ đúng nếu regex chạy trên chữ thô (đó chính là thứ pipe tránh). Zod chạy ở nơi bạn gọi nó; với zodResolver là ở trình duyệt.',
          },
          {
            question: 'useForm({ resolver: zodResolver(schema), mode: "onTouched" }). The name field needs at least 2 characters. The user types "A" and then presses Tab to the next field. When does "Họ tên cần ít nhất 2 ký tự" appear?|||useForm({ resolver: zodResolver(schema), mode: "onTouched" }). Ô họ tên cần ít nhất 2 ký tự. Người dùng gõ "A" rồi nhấn Tab sang ô sau. Khi nào "Họ tên cần ít nhất 2 ký tự" hiện ra?',
            options: [
              'Immediately after typing "A"|||Ngay sau khi gõ "A"',
              'After pressing Tab (leaving the field); from then on it updates on every change|||Sau khi nhấn Tab (rời ô); từ đó trở đi nó cập nhật theo từng thay đổi',
              'Only when the user presses the submit button|||Chỉ khi người dùng bấm nút gửi',
              'Never, because onTouched only validates fields that were clicked|||Không bao giờ, vì onTouched chỉ kiểm các ô được bấm chuột',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: onTouched validates on the first blur, then on every change. The measurement: after typing "A" 0 errors, after Tab 1 error. "Immediately after typing" is mode onChange (1 error after the first key); "only on submit" is the default onSubmit (0 and 0). Tab counts as leaving the field — no mouse click is needed.|||VI: onTouched kiểm ở lần rời ô đầu tiên, sau đó ở mỗi thay đổi. Số đo: gõ "A" xong 0 lỗi, sau Tab 1 lỗi. "Ngay sau khi gõ" là mode onChange (1 lỗi ngay phím đầu); "chỉ khi gửi" là mặc định onSubmit (0 và 0). Tab được tính là rời ô — không cần bấm chuột.',
          },
          {
            question: 'You need a live "N/500" counter under the reason textarea of an RHF form. Version A calls watch("lyDo") at the top of the form component. Version B puts useWatch({ control, name: "lyDo" }) in a small child component. You type 15 characters. What was measured?|||Bạn cần bộ đếm "N/500" sống dưới ô lý do của một form RHF. Bản A gọi watch("lyDo") ở đầu component form. Bản B đặt useWatch({ control, name: "lyDo" }) trong một component con nhỏ. Bạn gõ 15 ký tự. Đo được gì?',
            options: [
              'Both forms render 0 times, because RHF never re-renders|||Cả hai form render 0 lần, vì RHF không bao giờ render lại',
              'A renders 1 time (batched), B renders 15 times|||A render 1 lần (được gộp), B render 15 lần',
              'A: the whole form renders 15 times; B: the form renders 0 times and only the child renders 15 times|||A: cả form render 15 lần; B: form render 0 lần, chỉ component con render 15 lần',
              'Both render the whole form 15 times; useWatch is just another name for watch|||Cả hai render cả form 15 lần; useWatch chỉ là tên khác của watch',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: watch subscribes at the root of the form, so every change of lyDo re-renders the component that called it — the whole form (measured 15). useWatch subscribes in the component that calls it; in a child, only that child re-renders (form 0, child 15). "RHF never re-renders" is the tempting half-truth: it does not re-render for typing unless you subscribe to a value, which both versions do — the question is where.|||VI: watch đăng ký ở gốc form, nên mỗi lần lyDo đổi, component gọi nó — cả form — render lại (đo được 15). useWatch đăng ký ở component gọi nó; đặt trong con thì chỉ con render lại (form 0, con 15). "RHF không bao giờ render lại" là nửa sự thật hấp dẫn: nó không render khi gõ TRỪ KHI bạn đăng ký theo dõi một giá trị, và cả hai bản đều đăng ký — câu hỏi là đăng ký ở đâu.',
          },
          {
            question: 'An RHF form has <button disabled={isSubmitting}> and onSubmit={handleSubmit((du) => { onGui(du); })}, where onGui returns a promise that takes 800 ms. A real user double-clicks the button in Chromium. How many requests reach the server?|||Một form RHF có <button disabled={isSubmitting}> và onSubmit={handleSubmit((du) => { onGui(du); })}, trong đó onGui trả về một promise mất 800 ms. Người dùng thật bấm đúp nút trong Chromium. Máy chủ nhận bao nhiêu yêu cầu?',
            options: [
              '2 — the submit function returns before the request ends, so isSubmitting never stays true|||2 — hàm gửi trả về trước khi yêu cầu xong, nên isSubmitting không bao giờ giữ được true',
              '1 — disabled={isSubmitting} always blocks the second click|||1 — disabled={isSubmitting} luôn chặn cú bấm thứ hai',
              '0 — handleSubmit cancels both clicks as a double-click|||0 — handleSubmit huỷ cả hai cú bấm vì là bấm đúp',
              '1 — React batches the two submits into one|||1 — React gộp hai lần gửi làm một',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: handleSubmit awaits the function you give it. This one calls onGui without await or return, so it finishes at once; isSubmitting flips true and back to false immediately, the button is never disabled when the second click lands, and the measurement (jsdom and Chromium) showed 2 requests. "disabled always blocks it" is true only when the submit function awaits the request — the version with await sent 1.|||VI: handleSubmit await hàm bạn đưa cho nó. Hàm này gọi onGui mà không await cũng không return, nên nó xong ngay; isSubmitting bật true rồi về false tức thì, nút không bị khoá khi cú bấm thứ hai tới, và số đo (jsdom lẫn Chromium) ra 2 yêu cầu. "disabled luôn chặn" chỉ đúng khi hàm gửi await yêu cầu — bản có await gửi 1.',
          },
          {
            question: 'The RHF form is written correctly (await inside, disabled={isSubmitting}). A script runs form.requestSubmit(); form.requestSubmit(); in the same task. How many requests were measured, and what fixes it?|||Form RHF viết đúng (có await, disabled={isSubmitting}). Một script chạy form.requestSubmit(); form.requestSubmit(); trong cùng một tác vụ. Đo được bao nhiêu yêu cầu, và sửa thế nào?',
            options: [
              '1 — isSubmitting is updated synchronously, so the second call is ignored|||1 — isSubmitting cập nhật đồng bộ, nên lần gọi thứ hai bị bỏ qua',
              '2 — isSubmitting and disabled only change after a render; a ref checked before handleSubmit fixes it|||2 — isSubmitting và disabled chỉ đổi sau một lần render; một ref kiểm trước handleSubmit sửa được',
              '2 — the only fix is to remove the submit button and submit on blur|||2 — cách sửa duy nhất là bỏ nút gửi và gửi khi rời ô',
              '0 — requestSubmit does not trigger React onSubmit handlers|||0 — requestSubmit không kích hoạt handler onSubmit của React',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: isSubmitting is state and disabled is a DOM attribute written at commit; both need a render, and two submits in one task arrive before it. Measured: 2 in jsdom and in Chromium, while the ref version sent 1. The booking form locks with a ref BEFORE handleSubmit (a ref inside the submit function made RHF report success too early). "requestSubmit does not trigger onSubmit" is wrong: it fires a real submit event, which is exactly why the counters went up.|||VI: isSubmitting là state còn disabled là thuộc tính DOM được ghi lúc commit; cả hai cần một lần render, và hai lần gửi trong một tác vụ tới trước lần render đó. Đo được: 2 ở cả jsdom lẫn Chromium, còn bản dùng ref gửi 1. Form đặt lịch chốt bằng ref TRƯỚC handleSubmit (ref đặt trong hàm gửi làm RHF báo thành công quá sớm). "requestSubmit không kích hoạt onSubmit" sai: nó phát một sự kiện submit thật, nên bộ đếm mới tăng.',
          },
          {
            question: 'A chat input sends on onKeyDown when e.key === "Enter", then clears itself. A Vietnamese user is composing "cảm" (still underlined) and presses Enter to finish the word. In the simulated Chromium test, what happened?|||Một ô chat gửi trong onKeyDown khi e.key === "Enter", rồi tự xoá. Một người dùng Việt đang soạn "cảm" (còn gạch chân) và nhấn Enter để chốt chữ. Trong phép thử Chromium mô phỏng, chuyện gì đã xảy ra?',
            options: [
              'Nothing is sent, because browsers never fire keydown during composition|||Không gì được gửi, vì trình duyệt không bao giờ phát keydown khi đang soạn',
              'The committed word "cảm" is sent once and the box is empty — the correct behaviour|||Chữ "cảm" đã chốt được gửi một lần và ô rỗng — hành vi đúng',
              'The browser shows an error because the IME and React conflict|||Trình duyệt báo lỗi vì bộ gõ và React xung đột',
              '"cảm" is sent while still composing, and after the IME commits the box contains "cảm" again — fix: ignore Enter when e.nativeEvent.isComposing|||"cảm" bị gửi khi còn đang soạn, và sau khi bộ gõ chốt thì ô lại chứa "cảm" — sửa: bỏ qua Enter khi e.nativeEvent.isComposing',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Chromium delivered keydown Enter with isComposing=true. The naive handler sent "cảm", cleared the box, and the IME then committed "cảm" again, so the box still held the text — the next Enter would send a duplicate. The fixed handler returns early when isComposing (or keyCode 229). "Browsers never fire keydown during composition" is the tempting myth; they do, with the flag set. This was simulated through CDP; real IMEs are on the manual test list.|||VI: Chromium đưa keydown Enter với isComposing=true. Handler ngây thơ gửi "cảm", xoá ô, rồi bộ gõ chốt "cảm" lần nữa, nên ô vẫn còn chữ — cú Enter sau sẽ gửi trùng. Handler đã sửa return sớm khi isComposing (hoặc keyCode 229). "Trình duyệt không bao giờ phát keydown khi đang soạn" là ngộ nhận hấp dẫn; nó có phát, kèm cờ bật. Đây là mô phỏng qua CDP; bộ gõ thật nằm trong danh sách thử tay.',
          },
          {
            question: 'const nfc = "Nguyễn".normalize("NFC"); const nfd = "Nguyễn".normalize("NFD"); What do nfc === nfd, nfc.length and nfd.length give?|||const nfc = "Nguyễn".normalize("NFC"); const nfd = "Nguyễn".normalize("NFD"); nfc === nfd, nfc.length và nfd.length cho ra gì?',
            options: [
              'true, 6, 6 — they are the same text|||true, 6, 6 — chúng là cùng một chữ',
              'false, 6, 7 — NFD adds one combining mark|||false, 6, 7 — NFD thêm một dấu kết hợp',
              'false, 6, 8 — NFD splits "ễ" into "e" + U+0302 + U+0303; normalise to NFC before comparing, storing or counting|||false, 6, 8 — NFD tách "ễ" thành "e" + U+0302 + U+0303; chuẩn hoá về NFC trước khi so sánh, lưu hay đếm',
              'true, 6, 8 — === compares what is displayed|||true, 6, 8 — === so sánh thứ được hiển thị',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: nfc.length 6, nfd.length 8, nfc === nfd false, and the NFD code points were U+004E U+0067 U+0075 U+0079 U+0065 U+0302 U+0303 U+006E — "ễ" carries TWO combining marks (circumflex and tilde), which is why "7" is wrong. === compares code units, not pixels. The booking schema applies .normalize("NFC") so search, comparison and the 500-character limit behave.|||VI: Đo được: nfc.length 6, nfd.length 8, nfc === nfd là false, và các code point NFD là U+004E U+0067 U+0075 U+0079 U+0065 U+0302 U+0303 U+006E — "ễ" mang HAI dấu kết hợp (mũ và ngã), đó là lý do "7" sai. === so đơn vị mã, không so điểm ảnh. Schema đặt lịch áp .normalize("NFC") để tìm kiếm, so sánh và giới hạn 500 ký tự chạy đúng.',
          },
        ],
      },
    },

  ],
};
