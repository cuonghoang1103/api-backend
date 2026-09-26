import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 2: State và sự kiện (soạn 25/09/2026 từ khung).
 * GIỮ slug khung: rx-2-1-use-state · rx-2-2-su-kien · rx-2-3-object-array · rx-2-4-dat-state (type LESSON). Thêm rx-2-0-slides, rx-2-5-kiem-tra.
 * Mọi output trong bài chạy THẬT 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch02
 * (react 19.3.0 · react-dom 19.3.0 · @types/react 19.3.0 · vite 8.3.1 · vitest 5.0.1 · typescript 6.0.3 ·
 *  @testing-library/react 16.3.3 · user-event 14.6.7 · oxlint 1.85.0 · immer 11.1.18 · Chromium của Playwright).
 * Mã dài trong bài nằm ở hằng SN — sinh tự động từ chính các file đã chạy (tsc -b sạch, vitest xanh).
 * Deck: scripts/slides-src/rx-02.mjs (28 slide).
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch02 (đã tsc -b sạch + vitest xanh 25/09/2026) — đừng sửa tay ─── */
const SN = {
  bienThuong: "// ❌ Biến thường: React không biết nó đổi, và mỗi lần render nó bị tạo lại = 0.\nexport function BoDemBienThuong() {\n  let soLuot = 0;\n  function xuLyBam() {\n    soLuot = soLuot + 1;\n    console.log('soLuot =', soLuot);\n  }\n  return <button onClick={xuLyBam}>Đã đặt {soLuot} lượt</button>;\n}",
  boDemState: "// ✅ State: React nhớ giá trị giữa các lần render, và set… báo React vẽ lại.\nexport function BoDemState() {\n  const [soLuot, setSoLuot] = useState(0);\n  return <button onClick={() => setSoLuot(soLuot + 1)}>Đã đặt {soLuot} lượt</button>;\n}",
  baLanCong: "// Snapshot: trong MỘT lần render, soLuot là hằng số.\nexport function BaLanCong() {\n  const [soLuot, setSoLuot] = useState(0);\n  return (\n    <>\n      <p>Số lượt: {soLuot}</p>\n      <button\n        onClick={() => {\n          setSoLuot(soLuot + 1);\n          setSoLuot(soLuot + 1);\n          setSoLuot(soLuot + 1);\n          console.log('ngay sau ba lần set, soLuot =', soLuot);\n        }}\n      >\n        +3 (viết sai)\n      </button>\n      <button\n        onClick={() => {\n          setSoLuot((n) => n + 1);\n          setSoLuot((n) => n + 1);\n          setSoLuot((n) => n + 1);\n        }}\n      >\n        +3 (theo hàm)\n      </button>\n    </>\n  );\n}",
  khoiTao: "export function KhoiTaoMoiLan({ tao }: { tao: () => number[] }) {\n  const [ds, setDs] = useState(tao()); // gọi tao() MỖI lần render\n  return <button onClick={() => setDs([...ds, ds.length])}>{ds.length} phần tử</button>;\n}\nexport function KhoiTaoMotLan({ tao }: { tao: () => number[] }) {\n  const [ds, setDs] = useState(tao); // chỉ gọi ở lần đầu\n  return <button onClick={() => setDs([...ds, ds.length])}>{ds.length} phần tử</button>;\n}",
  haiState: "function HaiState() {\n  const [a, setA] = useState(0);\n  const [b, setB] = useState(0);\n  return (\n    <>\n      <p>a={a} b={b}</p>\n      <button onClick={() => { setA(a + 1); setB(b + 1); }}>đồng bộ</button>\n      <button onClick={() => setTimeout(() => { setA((x) => x + 1); setB((x) => x + 1); }, 10)}>trong setTimeout</button>\n      <button onClick={() => setA(a)}>set giá trị cũ</button>\n    </>\n  );\n}",
  testBatching: "test('batching: hai set trong một sự kiện ⇒ MỘT lần commit, kể cả trong setTimeout', async () => {\n  const user = userEvent.setup();\n  const commits: string[] = [];\n  render(<Profiler id=\"HaiState\" onRender={(_id, phase) => commits.push(phase)}><HaiState /></Profiler>);\n  await user.click(screen.getByRole('button', { name: 'đồng bộ' }));\n  const sauDongBo = commits.length;\n  await user.click(screen.getByRole('button', { name: 'trong setTimeout' }));\n  await act(() => new Promise((r) => setTimeout(r, 30)));\n  const sauTimeout = commits.length;\n  await user.click(screen.getByRole('button', { name: 'set giá trị cũ' }));\n  const sauGiaTriCu = commits.length;\n  await user.click(screen.getByRole('button', { name: 'set giá trị cũ' }));\n  await user.click(screen.getByRole('button', { name: 'set giá trị cũ' }));\n  const sauBaLanCu = commits.length;\n  console.info('[batching] commits:', commits.join(','), '| mount+dongbo =', sauDongBo, '| +timeout =', sauTimeout, '| +set gia tri cu (lan 1) =', sauGiaTriCu, '| +2 lan nua =', sauBaLanCu);\n  expect(screen.getByText('a=2 b=2')).toBeInTheDocument();\n  expect(sauDongBo).toBe(2);\n  expect(sauTimeout).toBe(3);\n  expect(sauGiaTriCu).toBe(4); // lần đầu React vẫn gọi lại component (caveat trong docs)\n  expect(sauBaLanCu).toBe(4); // từ lần sau: bỏ qua hẳn\n});",
  hookTrongIf: "import { useState } from 'react';\n\nexport function TheBacSi({ coChiTiet }: { coChiTiet: boolean }) {\n  const [daXem, setDaXem] = useState(false);\n  if (coChiTiet) {\n    const [moRong, setMoRong] = useState(false); // ❌ hook trong if\n    return <button onClick={() => setMoRong(!moRong)}>{moRong ? 'Thu gọn' : 'Mở rộng'}</button>;\n  }\n  return <button onClick={() => setDaXem(true)}>{daXem ? 'Đã xem' : 'Xem'}</button>;\n}",
  nutGoiNgay: "// ❌ Gọi hàm NGAY khi render, thay vì đưa hàm cho React\nexport function NutGoiNgay() {\n  const [dem, setDem] = useState(0);\n  function tang() {\n    setDem(dem + 1);\n  }\n  // @ts-expect-error — cố ý sai để dạy: onClick nhận HÀM, còn tang() trả về void\n  return <button onClick={tang()}>Đếm {dem}</button>;\n}",
  baCachDung: "// Ba cách viết ĐÚNG\nexport function BaCachDung({ onChon }: { onChon: (id: string) => void }) {\n  function xuLyBam() {\n    onChon('bs-1');\n  }\n  return (\n    <>\n      <button onClick={xuLyBam}>Cách 1: tên hàm</button>\n      <button onClick={() => onChon('bs-2')}>Cách 2: arrow function</button>\n      <button onClick={function () { onChon('bs-3'); }}>Cách 3: function</button>\n    </>\n  );\n}",
  theCoNut: "// Lan truyền: sự kiện đi từ nút lên thẻ cha\nexport function TheCoNut({ ghi, chanLan }: { ghi: (s: string) => void; chanLan: boolean }) {\n  return (\n    <div role=\"article\" onClick={() => ghi('thẻ: mở chi tiết')}>\n      <button\n        onClick={(e: MouseEvent<HTMLButtonElement>) => {\n          if (chanLan) e.stopPropagation();\n          ghi('nút: thêm yêu thích');\n        }}\n      >\n        ♡\n      </button>\n    </div>\n  );\n}",
  formTim: "// Form: submit mặc định sẽ TẢI LẠI TRANG\nexport function FormTim({ onTim, chanMacDinh }: { onTim: (tu: string) => void; chanMacDinh: boolean }) {\n  const [tu, setTu] = useState('');\n  function xuLyGui(e: SubmitEvent<HTMLFormElement>) {\n    if (chanMacDinh) e.preventDefault();\n    onTim(tu);\n  }\n  return (\n    <form onSubmit={xuLyGui}>\n      <label>\n        Từ khoá\n        <input name=\"tu\" value={tu} onChange={(e: ChangeEvent<HTMLInputElement>) => setTu(e.target.value)} />\n      </label>\n      <button type=\"submit\">Tìm</button>\n    </form>\n  );\n}",
  oTimCoPhim: "// Bàn phím: Escape để xoá ô tìm; onChange chạy MỖI phím (không phải lúc rời ô như DOM gốc)\nexport function OTimCoPhim({ ghi }: { ghi: (s: string) => void }) {\n  const [tu, setTu] = useState('');\n  return (\n    <label>\n      Tìm\n      <input\n        value={tu}\n        onChange={(e) => { setTu(e.target.value); ghi(`onChange: \"${e.target.value}\"`); }}\n        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Escape') setTu(''); }}\n      />\n    </label>\n  );\n}",
  dichVaGan: "// target vs currentTarget\nexport function DichVaGan({ ghi }: { ghi: (s: string) => void }) {\n  return (\n    <div\n      data-ten=\"the-cha\"\n      onClick={(e) => ghi(`target=${(e.target as HTMLElement).tagName} currentTarget=${e.currentTarget.tagName}`)}\n    >\n      <strong>BS. Trần Thu Hà</strong>\n    </div>\n  );\n}",
  formCoNut: "// Bẫy: <button> KHÔNG ghi type nằm trong <form> mặc định là type=\"submit\"\nexport function FormCoNutTim({ ghi }: { ghi: (s: string) => void }) {\n  return (\n    <form onSubmit={(e) => { e.preventDefault(); ghi('form: submit'); }}>\n      <button onClick={() => ghi('nút ♡ (không ghi type): click')}>♡</button>\n      <button type=\"button\" onClick={() => ghi('nút ♥ (type=\"button\"): click')}>♥</button>\n    </form>\n  );\n}",
  testLanTruyen: "test('lan truyền: không chặn thì thẻ cha cũng nhận click', async () => {\n  const user = userEvent.setup();\n  const nhatKy: string[] = [];\n  render(<TheCoNut ghi={(s) => nhatKy.push(s)} chanLan={false} />);\n  await user.click(screen.getByRole('button'));\n  console.info('[khong chan]', nhatKy);\n  expect(nhatKy).toEqual(['nút: thêm yêu thích', 'thẻ: mở chi tiết']);\n});",
  suaTrucTiep: "// ❌ Sửa thẳng object rồi đưa lại CHÍNH nó\nexport function SuaTrucTiep() {\n  const [bn, setBn] = useState(BENH_NHAN);\n  const [dem, setDem] = useState(0);\n  return (\n    <>\n      <p>Họ tên: {bn.hoTen}</p>\n      <button\n        onClick={() => {\n          bn.hoTen = 'Trần Thị B'; // đột biến (mutation)\n          setBn(bn); // cùng tham chiếu ⇒ Object.is(cũ, mới) === true ⇒ React bỏ qua\n        }}\n      >\n        Đổi tên (sai)\n      </button>\n      <button onClick={() => setDem(dem + 1)}>Việc khác ({dem})</button>\n    </>\n  );\n}",
  suaDung: "// ✅ Tạo object MỚI bằng spread\nexport function SuaDung() {\n  const [bn, setBn] = useState(BENH_NHAN);\n  return (\n    <>\n      <p>Họ tên: {bn.hoTen}</p>\n      <button onClick={() => setBn({ ...bn, hoTen: 'Trần Thị B' })}>Đổi tên (đúng)</button>\n    </>\n  );\n}",
  doiSdt: "/** Đổi số điện thoại lồng bên trong lịch hẹn — spread từng tầng. */\nexport function doiSoDienThoai(lh: LichHen, so: string): LichHen {\n  return { ...lh, benhNhan: { ...lh.benhNhan, soDienThoai: so } };\n}",
  doiSdtImmer: "/** Cùng việc đó bằng Immer: viết như sửa thẳng, nhận về bản mới. */\nexport const doiSoDienThoaiImmer = (lh: LichHen, so: string): LichHen =>\n  produce(lh, (nhap) => {\n    nhap.benhNhan.soDienThoai = so;\n  });",
  suaImmer: "// Immer trong component: produce(recipe) trả về một updater cho setLh\nexport function SuaSdtBangImmer() {\n  const [lh, setLh] = useState(LICH_HEN);\n  return (\n    <>\n      <p>SĐT: {lh.benhNhan.soDienThoai}</p>\n      <button\n        onClick={() =>\n          setLh(\n            produce((nhap) => {\n              nhap.benhNhan.soDienThoai = '0987654321';\n            }),\n          )\n        }\n      >\n        Đổi SĐT (Immer)\n      </button>\n    </>\n  );\n}",
  doiKinhNghiem: "/** Sửa MỘT object nằm trong mảng: map trả mảng mới, chỉ phần tử khớp id là object mới. */\nexport function doiKinhNghiem(ds: BacSi[], id: string, soNam: number): BacSi[] {\n  return ds.map((bs) => (bs.id === id ? { ...bs, namKinhNghiem: soNam } : bs));\n}",
  sapXep: "// ❌ sort() ngay trong render: sắp xếp luôn cả mảng của người khác\nexport function DanhSachSapXepSai({ danhSach }: { danhSach: BacSi[] }) {\n  const sapXep = danhSach.sort((a, b) => b.namKinhNghiem - a.namKinhNghiem);\n  return <ol>{sapXep.map((bs) => <li key={bs.id}>{bs.ten}</li>)}</ol>;\n}\n// ✅ toSorted() trả mảng mới\nexport function DanhSachSapXepDung({ danhSach }: { danhSach: BacSi[] }) {\n  const sapXep = danhSach.toSorted((a, b) => b.namKinhNghiem - a.namKinhNghiem);\n  return <ol>{sapXep.map((bs) => <li key={bs.id}>{bs.ten}</li>)}</ol>;\n}",
  themSai: "// ❌ push vào mảng state\nexport function ThemSai() {\n  const [ds, setDs] = useState<string[]>(['bs-1']);\n  return (\n    <>\n      <p>{ds.length} yêu thích</p>\n      <button onClick={() => { ds.push('bs-4'); setDs(ds); }}>Thêm (push)</button>\n    </>\n  );\n}",
  updaterSai: "// ❌ Updater có đột biến: StrictMode gọi updater HAI lần ở chế độ dev ⇒ thêm hai lần\nexport function ThemTrongUpdaterSai() {\n  const [ds, setDs] = useState<string[]>([]);\n  return (\n    <>\n      <p>{ds.join(',') || '(trống)'}</p>\n      <button onClick={() => setDs((cu) => { cu.push('bs-4'); return [...cu]; })}>Thêm (updater đột biến)</button>\n    </>\n  );\n}",
  testMotTang: "  test('bẫy: spread chỉ chép MỘT tầng', () => {\n    const cu = { ...LICH_HEN, benhNhan: { ...LICH_HEN.benhNhan } };\n    const saoChep = { ...cu };\n    saoChep.benhNhan.hoTen = 'Tên bị đổi nhầm';\n    console.info('[mot tang] cu.benhNhan.hoTen =', cu.benhNhan.hoTen);\n    expect(cu.benhNhan.hoTen).toBe('Tên bị đổi nhầm');\n  });\n});",
  testBonPhep: "  test('bốn phép bất biến hay dùng', () => {\n    const ds = ['bs-1', 'bs-2', 'bs-3'];\n    const them = [...ds, 'bs-4'];\n    const bo = ds.filter((id) => id !== 'bs-2');\n    const thay = ds.map((id) => (id === 'bs-3' ? 'bs-6' : id));\n    const chen = [...ds.slice(0, 1), 'bs-5', ...ds.slice(1)];\n    console.info('[mang]', { them, bo, thay, chen, 'ds van nguyen': ds });\n    expect(ds).toEqual(['bs-1', 'bs-2', 'bs-3']);\n  });\n});",
  haiStateRieng: "// ❌ 1. Hai anh em, mỗi đứa một state riêng ⇒ chip đổi, danh sách không biết\nfunction ThanhLocRieng() {\n  const [ck, setCk] = useState<BoLocChuyenKhoa>('tat-ca');\n  return <ChipChuyenKhoa giaTri={ck} onDoi={setCk} />;\n}\nfunction DanhSachRieng() {\n  const [ck] = useState<BoLocChuyenKhoa>('tat-ca');\n  return <p>Đang hiện {locBacSi(danhSachBacSi, ck, '').length} bác sĩ</p>;\n}\nexport function HaiStateRieng() {\n  return (<><ThanhLocRieng /><DanhSachRieng /></>);\n}",
  nangStateLen: "// ✅ Nâng state lên cha chung gần nhất; con nhận giá trị + hàm đổi qua props\nexport function NangStateLen() {\n  const [ck, setCk] = useState<BoLocChuyenKhoa>('tat-ca');\n  return (\n    <>\n      <ChipChuyenKhoa giaTri={ck} onDoi={setCk} />\n      <p>Đang hiện {locBacSi(danhSachBacSi, ck, '').length} bác sĩ</p>\n    </>\n  );\n}",
  luuKetQua: "// ❌ 2. Cất KẾT QUẢ LỌC vào state (state thừa) và tính lại trong handler — dính snapshot\nexport function LuuKetQuaLoc() {\n  const [tuKhoa, setTuKhoa] = useState('');\n  const [ketQua, setKetQua] = useState(danhSachBacSi);\n  function xuLyDoi(moi: string) {\n    setTuKhoa(moi);\n    setKetQua(locBacSi(danhSachBacSi, 'tat-ca', tuKhoa)); // tuKhoa ở đây là giá trị CŨ\n  }\n  return (\n    <>\n      <OTimBacSi tuKhoa={tuKhoa} onDoi={xuLyDoi} />\n      <p>Kết quả: {ketQua.map((b) => b.ten).join(', ')}</p>\n    </>\n  );\n}",
  tinhTrongRender: "// ✅ Tính trong render\nexport function TinhTrongRender() {\n  const [tuKhoa, setTuKhoa] = useState('');\n  const ketQua = locBacSi(danhSachBacSi, 'tat-ca', tuKhoa);\n  return (\n    <>\n      <OTimBacSi tuKhoa={tuKhoa} onDoi={setTuKhoa} />\n      <p>Kết quả: {ketQua.map((b) => b.ten).join(', ')}</p>\n    </>\n  );\n}",
  stateCaoThap: "// 3. State để CAO hay THẤP: đo số lần <Header /> render lại khi gõ\nexport function StateOCao({ onRender }: { onRender: ProfilerOnRenderCallback }) {\n  const [tuKhoa, setTuKhoa] = useState('');\n  return (\n    <>\n      <Profiler id=\"Header\" onRender={onRender}><Header /></Profiler>\n      <OTimBacSi tuKhoa={tuKhoa} onDoi={setTuKhoa} />\n    </>\n  );\n}\nfunction KhuTim() {\n  const [tuKhoa, setTuKhoa] = useState('');\n  return <OTimBacSi tuKhoa={tuKhoa} onDoi={setTuKhoa} />;\n}\nexport function StateOThap({ onRender }: { onRender: ProfilerOnRenderCallback }) {\n  return (\n    <>\n      <Profiler id=\"Header\" onRender={onRender}><Header /></Profiler>\n      <KhuTim />\n    </>\n  );\n}",
  ghiChu: "// ❌ 4. Chép prop vào state: state chỉ lấy giá trị ở lần render ĐẦU\nexport function GhiChuBacSi({ bacSi }: { bacSi: BacSi }) {\n  const [ghiChu, setGhiChu] = useState(bacSi.gioiThieu);\n  return (\n    <label>\n      Ghi chú cho {bacSi.ten}\n      <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />\n    </label>\n  );\n}",
  locBacSi: "import type { BacSi, ChuyenKhoa } from '../types';\n\nexport type BoLocChuyenKhoa = ChuyenKhoa | 'tat-ca';\n\n/** \"Phạm Ngọc Lan\" → \"pham ngoc lan\": bỏ dấu để gõ \"lan\" hay \"Lân\" đều tìm ra. */\nexport function boDau(chu: string): string {\n  return chu\n    .normalize('NFD')\n    .replace(/[̀-ͯ]/g, '')\n    .replace(/đ/g, 'd')\n    .replace(/Đ/g, 'D')\n    .toLowerCase();\n}\n\n/** Hàm THUẦN: cùng đầu vào ⇒ cùng kết quả, không sửa mảng gốc. Gọi ngay trong lúc render. */\nexport function locBacSi(danhSach: BacSi[], chuyenKhoa: BoLocChuyenKhoa, tuKhoa: string): BacSi[] {\n  const tu = boDau(tuKhoa.trim());\n  return danhSach.filter(\n    (bs) => (chuyenKhoa === 'tat-ca' || bs.chuyenKhoa === chuyenKhoa) && boDau(bs.ten).includes(tu),\n  );\n}",
  yeuThich: "/** Bật/tắt một id trong danh sách yêu thích — trả về MẢNG MỚI, không đụng mảng cũ. */\nexport function doiYeuThich(danhSach: string[], id: string): string[] {\n  return danhSach.includes(id) ? danhSach.filter((x) => x !== id) : [...danhSach, id];\n}",
  chip: "import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';\nimport type { BoLocChuyenKhoa } from '../logic/loc-bac-si';\nimport type { ChuyenKhoa } from '../types';\n\nconst CAC_CHIP: BoLocChuyenKhoa[] = ['tat-ca', ...(Object.keys(TEN_CHUYEN_KHOA) as ChuyenKhoa[])];\n\ninterface ChipChuyenKhoaProps {\n  giaTri: BoLocChuyenKhoa;\n  onDoi: (moi: BoLocChuyenKhoa) => void;\n}\n\nexport function ChipChuyenKhoa({ giaTri, onDoi }: ChipChuyenKhoaProps) {\n  return (\n    <div className=\"chip-hang\" role=\"group\" aria-label=\"Lọc theo chuyên khoa\">\n      {CAC_CHIP.map((ck) => (\n        <button\n          key={ck}\n          type=\"button\"\n          className=\"chip\"\n          aria-pressed={ck === giaTri}\n          onClick={() => onDoi(ck)}\n        >\n          {ck === 'tat-ca' ? 'Tất cả' : TEN_CHUYEN_KHOA[ck]}\n        </button>\n      ))}\n    </div>\n  );\n}",
  oTim: "interface OTimBacSiProps {\n  tuKhoa: string;\n  onDoi: (moi: string) => void;\n}\n\nexport function OTimBacSi({ tuKhoa, onDoi }: OTimBacSiProps) {\n  return (\n    <label className=\"o-tim\">\n      Tìm theo tên\n      <input\n        type=\"search\"\n        value={tuKhoa}\n        placeholder=\"vd: Lan, Huy…\"\n        onChange={(e) => onDoi(e.target.value)}\n      />\n    </label>\n  );\n}",
  theBacSi: "import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';\nimport type { BacSi } from '../types';\n\ninterface TheBacSiProps {\n  bacSi: BacSi;\n  noiBat?: boolean; // dấu ? = không bắt buộc\n  // Chương 2: bốn prop mới, đều KHÔNG bắt buộc ⇒ mọi chỗ dùng thẻ của Chương 1 vẫn chạy\n  dangChon?: boolean;\n  laYeuThich?: boolean;\n  onXemChiTiet?: (id: string) => void;\n  onDoiYeuThich?: (id: string) => void;\n}\n\nexport function TheBacSi({ bacSi, noiBat = false, dangChon = false, laYeuThich = false, onXemChiTiet, onDoiYeuThich }: TheBacSiProps) {\n  const lop = ['the-bac-si', noiBat && 'noi-bat', dangChon && 'dang-chon'].filter(Boolean).join(' ');\n  return (\n    <article className={lop} aria-label={bacSi.ten}>\n      <h3>{bacSi.ten}</h3>\n      <p className=\"chuyen-khoa\">{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}</p>\n      <p>{bacSi.namKinhNghiem} năm kinh nghiệm</p>\n      {noiBat && <p className=\"nhan\">Bác sĩ lâu năm</p>}\n      <div className=\"hang-nut\">\n        {onXemChiTiet && (\n          <button\n            type=\"button\"\n            className=\"nut nut-chinh\"\n            aria-label={`Xem chi tiết ${bacSi.ten}`}\n            onClick={() => onXemChiTiet(bacSi.id)}\n          >\n            Xem chi tiết\n          </button>\n        )}\n        {onDoiYeuThich && (\n          <button\n            type=\"button\"\n            className=\"nut nut-tim\"\n            aria-label={`Yêu thích ${bacSi.ten}`}\n            aria-pressed={laYeuThich}\n            onClick={() => onDoiYeuThich(bacSi.id)}\n          >\n            {laYeuThich ? '♥' : '♡'}\n          </button>\n        )}\n      </div>\n    </article>\n  );\n}",
  danhSach: "import type { BacSi } from '../types';\nimport { TheBacSi } from './TheBacSi';\n\ninterface DanhSachBacSiProps {\n  danhSach: BacSi[];\n  // Chương 2: đều KHÔNG bắt buộc — cha nào cần tương tác thì truyền\n  bacSiDangChonId?: string | null;\n  yeuThich?: string[];\n  onXemChiTiet?: (id: string) => void;\n  onDoiYeuThich?: (id: string) => void;\n  thongBaoRong?: string;\n}\n\nexport function DanhSachBacSi({\n  danhSach,\n  bacSiDangChonId = null,\n  yeuThich = [],\n  onXemChiTiet,\n  onDoiYeuThich,\n  thongBaoRong = 'Chưa có bác sĩ nào.',\n}: DanhSachBacSiProps) {\n  if (danhSach.length === 0) {\n    return <p className=\"rong\">{thongBaoRong}</p>;\n  }\n  return (\n    <section aria-labelledby=\"tieu-de-bac-si\">\n      <h2 id=\"tieu-de-bac-si\">Đội ngũ bác sĩ ({danhSach.length})</h2>\n      <div className=\"luoi-bac-si\">\n        {danhSach.map((bs) => (\n          <TheBacSi\n            key={bs.id}\n            bacSi={bs}\n            noiBat={bs.namKinhNghiem >= 15}\n            dangChon={bs.id === bacSiDangChonId}\n            laYeuThich={yeuThich.includes(bs.id)}\n            onXemChiTiet={onXemChiTiet}\n            onDoiYeuThich={onDoiYeuThich}\n          />\n        ))}\n      </div>\n    </section>\n  );\n}",
  chiTiet: "import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';\nimport type { BacSi } from '../types';\n\ninterface ChiTietBacSiProps {\n  bacSi: BacSi;\n  laYeuThich: boolean;\n  onDoiYeuThich: (id: string) => void;\n  onDong: () => void;\n}\n\nexport function ChiTietBacSi({ bacSi, laYeuThich, onDoiYeuThich, onDong }: ChiTietBacSiProps) {\n  return (\n    <section className=\"chi-tiet\" aria-label={`Chi tiết ${bacSi.ten}`}>\n      <h3>{bacSi.ten}</h3>\n      <p className=\"chuyen-khoa\">\n        {TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]} · {bacSi.namKinhNghiem} năm kinh nghiệm\n      </p>\n      <p>{bacSi.gioiThieu}</p>\n      <div className=\"hang-nut\">\n        <button type=\"button\" className=\"nut\" onClick={() => onDoiYeuThich(bacSi.id)}>\n          {laYeuThich ? '♥ Bỏ yêu thích' : '♡ Thêm vào yêu thích'}\n        </button>\n        <button type=\"button\" className=\"nut\" onClick={onDong}>\n          Đóng\n        </button>\n      </div>\n    </section>\n  );\n}",
  khuBacSi: "import { useState } from 'react';\nimport { danhSachBacSi } from '../du-lieu/bac-si';\nimport { locBacSi, type BoLocChuyenKhoa } from '../logic/loc-bac-si';\nimport { doiYeuThich } from '../logic/yeu-thich';\nimport { ChiTietBacSi } from './ChiTietBacSi';\nimport { ChipChuyenKhoa } from './ChipChuyenKhoa';\nimport { DanhSachBacSi } from './DanhSachBacSi';\nimport { OTimBacSi } from './OTimBacSi';\n\nexport function KhuBacSi() {\n  // ● Bốn mẩu state — mỗi mẩu là thứ NGƯỜI DÙNG đổi được, không suy ra được từ thứ khác.\n  const [chuyenKhoa, setChuyenKhoa] = useState<BoLocChuyenKhoa>('tat-ca');\n  const [tuKhoa, setTuKhoa] = useState('');\n  const [bacSiDangChonId, setBacSiDangChonId] = useState<string | null>(null);\n  const [yeuThich, setYeuThich] = useState<string[]>([]);\n\n  // Dẫn xuất (tính trong lúc render) — KHÔNG cất vào state.\n  const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa);\n  const bacSiDangChon = danhSachBacSi.find((bs) => bs.id === bacSiDangChonId) ?? null;\n  const dsYeuThich = danhSachBacSi.filter((bs) => yeuThich.includes(bs.id));\n\n  function xuLyDoiYeuThich(id: string) {\n    setYeuThich((cu) => doiYeuThich(cu, id)); // cập nhật theo hàm: luôn dựa trên bản mới nhất\n  }\n\n  return (\n    <>\n      <div className=\"thanh-loc\">\n        <ChipChuyenKhoa giaTri={chuyenKhoa} onDoi={setChuyenKhoa} />\n        <OTimBacSi tuKhoa={tuKhoa} onDoi={setTuKhoa} />\n      </div>\n      <div className=\"bo-cuc\">\n        <DanhSachBacSi\n          danhSach={danhSachLoc}\n          bacSiDangChonId={bacSiDangChonId}\n          yeuThich={yeuThich}\n          onXemChiTiet={setBacSiDangChonId}\n          onDoiYeuThich={xuLyDoiYeuThich}\n          thongBaoRong=\"Không tìm thấy bác sĩ phù hợp.\"\n        />\n        <aside>\n          {bacSiDangChon ? (\n            <ChiTietBacSi\n              bacSi={bacSiDangChon}\n              laYeuThich={yeuThich.includes(bacSiDangChon.id)}\n              onDoiYeuThich={xuLyDoiYeuThich}\n              onDong={() => setBacSiDangChonId(null)}\n            />\n          ) : (\n            <p className=\"goi-y\">Bấm “Xem chi tiết” trên một bác sĩ để xem giới thiệu.</p>\n          )}\n          <section className=\"yeu-thich\" aria-label=\"Danh sách yêu thích\">\n            <h3>Yêu thích ({dsYeuThich.length})</h3>\n            {dsYeuThich.length === 0 ? (\n              <p>Chưa có bác sĩ nào.</p>\n            ) : (\n              <ul>\n                {dsYeuThich.map((bs) => (\n                  <li key={bs.id}>{bs.ten}</li>\n                ))}\n              </ul>\n            )}\n          </section>\n        </aside>\n      </div>\n    </>\n  );\n}",
  app: "import './App.css';\nimport { Footer } from './components/Footer';\nimport { Header } from './components/Header';\nimport { KhuBacSi } from './components/KhuBacSi';\n\nexport default function App() {\n  return (\n    <>\n      <Header />\n      <main className=\"noi-dung\">\n        <KhuBacSi />\n      </main>\n      <Footer />\n    </>\n  );\n}",
  appTest: "import { render, screen } from '@testing-library/react';\nimport { expect, test } from 'vitest';\nimport App from './App';\n\ntest('trang chủ có tiêu đề phòng khám', () => {\n  render(<App />);\n  expect(screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' })).toBeInTheDocument();\n});\n\ntest('trang chủ hiện đủ 6 bác sĩ', () => {\n  render(<App />);\n  expect(screen.getAllByRole('article')).toHaveLength(6);\n});",
  setup: "import '@testing-library/jest-dom/vitest';\nimport { cleanup } from '@testing-library/react';\nimport { afterEach } from 'vitest';\n\n// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.\n// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.\nafterEach(() => {\n  cleanup();\n});",
  testKhu: "import { render, screen, within } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { expect, test } from 'vitest';\nimport { KhuBacSi } from './KhuBacSi';\n\ntest('bấm chip Nhi ⇒ chỉ còn 2 bác sĩ nhi, chip được đánh dấu', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  await user.click(screen.getByRole('button', { name: 'Nhi' }));\n  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (2)' })).toBeInTheDocument();\n  expect(screen.getByRole('button', { name: 'Nhi' })).toHaveAttribute('aria-pressed', 'true');\n  expect(screen.getByRole('button', { name: 'Tất cả' })).toHaveAttribute('aria-pressed', 'false');\n});\n\ntest('gõ \"lan\" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  await user.type(screen.getByLabelText('Tìm theo tên'), 'lan');\n  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();\n  expect(screen.getByRole('heading', { name: 'BS. Phạm Ngọc Lan' })).toBeInTheDocument();\n});\n\ntest('không khớp ⇒ thông báo rỗng', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  await user.click(screen.getByRole('button', { name: 'Da liễu' }));\n  await user.type(screen.getByLabelText('Tìm theo tên'), 'vy');\n  expect(screen.getByText('Không tìm thấy bác sĩ phù hợp.')).toBeInTheDocument();\n});\n\ntest('xem chi tiết rồi đóng', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  await user.click(screen.getByRole('button', { name: 'Xem chi tiết BS. Trần Thu Hà' }));\n  const chiTiet = screen.getByRole('region', { name: 'Chi tiết BS. Trần Thu Hà' });\n  expect(within(chiTiet).getByText(/dinh dưỡng/)).toBeInTheDocument();\n  await user.click(within(chiTiet).getByRole('button', { name: 'Đóng' }));\n  expect(screen.queryByRole('region', { name: /^Chi tiết/ })).not.toBeInTheDocument();\n});\n\ntest('yêu thích: bật, tắt, và chi tiết luôn khớp với thẻ', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  const tim = screen.getByRole('button', { name: 'Yêu thích BS. Phạm Ngọc Lan' });\n  await user.click(tim);\n  expect(tim).toHaveAttribute('aria-pressed', 'true');\n  const hop = screen.getByRole('region', { name: 'Danh sách yêu thích' });\n  expect(within(hop).getByText('Yêu thích (1)')).toBeInTheDocument();\n  // mở chi tiết cùng bác sĩ: nút trong chi tiết phải nói \"Bỏ yêu thích\"\n  await user.click(screen.getByRole('button', { name: 'Xem chi tiết BS. Phạm Ngọc Lan' }));\n  await user.click(screen.getByRole('button', { name: '♥ Bỏ yêu thích' }));\n  expect(tim).toHaveAttribute('aria-pressed', 'false');\n  expect(within(hop).getByText('Yêu thích (0)')).toBeInTheDocument();\n});\n\ntest('lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn', async () => {\n  const user = userEvent.setup();\n  render(<KhuBacSi />);\n  await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Nguyễn Minh An' }));\n  await user.click(screen.getByRole('button', { name: 'Nhi' }));\n  const hop = screen.getByRole('region', { name: 'Danh sách yêu thích' });\n  expect(within(hop).getByText('BS. Nguyễn Minh An')).toBeInTheDocument();\n});",
  testLoc: "import { describe, expect, test } from 'vitest';\nimport { danhSachBacSi } from '../du-lieu/bac-si';\nimport { boDau, locBacSi } from './loc-bac-si';\n\nconst ten = (ds: { ten: string }[]) => ds.map((b) => b.ten);\n\ndescribe('locBacSi', () => {\n  test('tat-ca + từ khoá rỗng ⇒ đủ 6', () => {\n    expect(locBacSi(danhSachBacSi, 'tat-ca', '')).toHaveLength(6);\n  });\n  test('lọc theo chuyên khoa nhi', () => {\n    expect(ten(locBacSi(danhSachBacSi, 'nhi', ''))).toEqual(['BS. Trần Thu Hà', 'BS. Vũ Thảo Vy']);\n  });\n  test('tìm không dấu, không phân biệt hoa thường', () => {\n    expect(ten(locBacSi(danhSachBacSi, 'tat-ca', 'LAN'))).toEqual(['BS. Phạm Ngọc Lan']);\n    expect(ten(locBacSi(danhSachBacSi, 'tat-ca', 'duc'))).toEqual(['BS. Hoàng Đức Huy']);\n  });\n  test('kết hợp hai điều kiện', () => {\n    expect(locBacSi(danhSachBacSi, 'noi', 'vy')).toEqual([]);\n  });\n  test('không sửa mảng gốc', () => {\n    const truoc = [...danhSachBacSi];\n    locBacSi(danhSachBacSi, 'nhi', 'ha');\n    expect(danhSachBacSi).toEqual(truoc);\n  });\n  test('boDau', () => {\n    expect(boDau('Hoàng Đức Huy')).toBe('hoang duc huy');\n  });\n});",
  testYeuThich: "import { expect, test } from 'vitest';\nimport { doiYeuThich } from './yeu-thich';\n\ntest('thêm id chưa có ⇒ mảng MỚI có thêm id', () => {\n  const cu = ['bs-1'];\n  const moi = doiYeuThich(cu, 'bs-4');\n  expect(moi).toEqual(['bs-1', 'bs-4']);\n  expect(moi).not.toBe(cu); // khác tham chiếu ⇒ React thấy \"đã đổi\"\n  expect(cu).toEqual(['bs-1']); // mảng cũ nguyên vẹn\n});\n\ntest('bấm lần hai ⇒ bỏ id ra', () => {\n  expect(doiYeuThich(['bs-1', 'bs-4'], 'bs-1')).toEqual(['bs-4']);\n});",
  css: "/* ── Chương 2: lọc, tìm, chi tiết, yêu thích ── */\n.thanh-loc { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin-bottom: 18px; }\n.chip-hang { display: flex; gap: 8px; flex-wrap: wrap; }\n.chip { font: inherit; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; border-radius: 999px; padding: 5px 14px; }\n.chip[aria-pressed='true'] { background: #0e7490; border-color: #0e7490; color: #fff; }\n.o-tim { display: flex; align-items: center; gap: 8px; }\n.o-tim input { font: inherit; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 10px; width: 220px; }\n.bo-cuc { display: grid; grid-template-columns: 1fr 300px; gap: 18px; align-items: start; }\n.bo-cuc .luoi-bac-si { grid-template-columns: repeat(2, 1fr); }\n.the-bac-si.dang-chon { border-color: #0e7490; box-shadow: 0 0 0 3px #cffafe; }\n.hang-nut { display: flex; gap: 8px; margin-top: 10px; }\n.nut { font: inherit; font-size: 14px; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; border-radius: 10px; padding: 5px 12px; }\n.nut-chinh { background: #0e7490; border-color: #0e7490; color: #fff; }\n.nut-tim { width: 38px; color: #e11d48; font-size: 17px; line-height: 1; }\n.nut-tim[aria-pressed='true'] { background: #ffe4e6; border-color: #e11d48; }\n.chi-tiet { background: #fff; border: 2px solid #0e7490; border-radius: 12px; padding: 14px 16px; }\n.chi-tiet h3 { margin: 0 0 4px; }\n.chi-tiet p { margin: 4px 0 8px; color: #334155; font-size: 14px; }\n.goi-y { color: #64748b; background: #fff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 14px 16px; margin: 0; }\n.yeu-thich { margin-top: 14px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 10px 16px; }\n.yeu-thich h3 { margin: 0 0 6px; font-size: 16px; }\n.yeu-thich p { margin: 0; font-size: 14px; }\n.yeu-thich ul { margin: 0; padding-left: 18px; font-size: 14px; }\n.rong { color: #64748b; padding: 24px; text-align: center; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1; }",
  testTheBacSi: "// Chương 2\ntest('có handler thì có nút; bấm gọi đúng id', async () => {\n  const user = userEvent.setup();\n  const onXemChiTiet = vi.fn();\n  const onDoiYeuThich = vi.fn();\n  render(<TheBacSi bacSi={bacSiGia} onXemChiTiet={onXemChiTiet} onDoiYeuThich={onDoiYeuThich} laYeuThich />);\n  await user.click(screen.getByRole('button', { name: 'Xem chi tiết BS. Thử Nghiệm' }));\n  await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Thử Nghiệm' }));\n  expect(onXemChiTiet).toHaveBeenCalledWith('bs-x');\n  expect(onDoiYeuThich).toHaveBeenCalledWith('bs-x');\n  expect(screen.getByRole('button', { name: 'Yêu thích BS. Thử Nghiệm' })).toHaveAttribute('aria-pressed', 'true');\n});\n\ntest('không truyền handler (như Chương 1) thì không vẽ nút nào', () => {\n  render(<TheBacSi bacSi={bacSiGia} />);\n  expect(screen.queryByRole('button')).not.toBeInTheDocument();\n});",
};

/* ─── Output THẬT (vitest --reporter=verbose, tsc, oxlint, Playwright) — chép nguyên, rút gọn bằng … ─── */
const OUT = {
  snapEn: 'setSoLuot(0 + 1); // "next render: use 1"\nsetSoLuot(0 + 1); // "next render: use 1"\nsetSoLuot(0 + 1); // "next render: use 1"\nconsole.log(0);   // this render still sees 0',
  snapVi: 'setSoLuot(0 + 1); // "lần render sau: dùng 1"\nsetSoLuot(0 + 1); // "lần render sau: dùng 1"\nsetSoLuot(0 + 1); // "lần render sau: dùng 1"\nconsole.log(0);   // lần render này vẫn thấy 0',
  tenTrung: '[ten] Unable to find an accessible element with the role "button" and name "Xem chi tiết"\n…\n[ten2] Found multiple elements with the role "button" and name `/Xem chi tiết/`\n…',
  bienThuong: "[bien thuong] man hinh: Đã đặt 0 lượt | console: [ 'soLuot = 1', 'soLuot = 2', 'soLuot = 3' ]",
  snapshot: "[snapshot] sau nut sai: Số lượt: 1 | console: [ 'ngay sau ba lần set, soLuot = 0' ]\n[snapshot] sau nut theo ham: Số lượt: 4",
  batching: '[batching] commits: mount,update,update,update | mount+dongbo = 2 | +timeout = 3 | +set gia tri cu (lan 1) = 4 | +2 lan nua = 4',
  lazy: '[lazy] useState(tao()) goi 4 lan | useState(tao) goi 1 lan',
  tsNull: "src/vi-du/loi-tsc.tsx(6,45): error TS2345: Argument of type 'BacSi' is not assignable to parameter of type 'SetStateAction<null>'.\n  Type 'BacSi' provides no match for the signature '(prevState: null): null'.",
  oxlint: '$ npx oxlint vi-du-sai/\nvi-du-sai/HookTrongIf.tsx:6:33: error react-hooks(rules-of-hooks): React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.',
  hookRuntime: "[hook trong if] Rendered more hooks than during the previous render.\n[console.error] React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks\n   Previous render            Next render\n   ------------------------------------------------------\n…",
  bai1Verbose: ' ✓ src/vi-du/bai1.test.tsx > biến thường: bấm 3 lần, màn hình vẫn 0 200ms\n ✓ src/vi-du/bai1.test.tsx > state: bấm 3 lần ⇒ 3 42ms\n ✓ src/vi-du/bai1.test.tsx > hai bộ đếm = hai state riêng 31ms\n ✓ src/vi-du/bai1.test.tsx > snapshot: ba lần set(soLuot + 1) chỉ +1; theo hàm thì +3 54ms\n ✓ src/vi-du/bai1.test.tsx > batching: hai set trong một sự kiện ⇒ MỘT lần commit, kể cả trong setTimeout 96ms\n ✓ src/vi-du/bai1.test.tsx > lazy initializer: useState(tao()) gọi tao mỗi render; useState(tao) chỉ một lần 62ms\n\n Test Files  1 passed (1)\n      Tests  6 passed (6)',
  tsVoid: "src/vi-du/loi-tsc.tsx(12,18): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.",
  tooMany: '[goi ngay] Too many re-renders. React limits the number of renders to prevent an infinite loop.',
  lanTruyen: "[khong chan] [ 'nút: thêm yêu thích', 'thẻ: mở chi tiết' ]\n[co chan] [ 'nút: thêm yêu thích' ]",
  formJsdom: "Not implemented: HTMLFormElement's requestSubmit() method",
  formReload: 'truoc khi Tim: Đếm: 3 | URL = http://localhost:5127/vi-du/?bai=form | so lan tai trang = 1\n[console] onSubmit chạy\nsau khi Tim:  h2 dau tien = ❌ Biến thường | URL = http://localhost:5127/vi-du/?tu=lan | so lan tai trang = 2',
  onChange: `[onChange] [ 'onChange: "H"', 'onChange: "Hà"' ]`,
  target: "[target] [ 'target=STRONG currentTarget=DIV' ]",
  typeNut: "[type] [\n  'nút ♡ (không ghi type): click',\n  'form: submit',\n  'nút ♥ (type=\"button\"): click'\n]",
  bai2Verbose: " ✓ src/vi-du/bai2.test.tsx > onClick={tang()} ⇒ vòng render vô hạn, React dừng lại 23ms\n ✓ src/vi-du/bai2.test.tsx > ba cách đúng đều gọi onChon đúng id 189ms\n ✓ src/vi-du/bai2.test.tsx > lan truyền: không chặn thì thẻ cha cũng nhận click 20ms\n ✓ src/vi-du/bai2.test.tsx > stopPropagation: chỉ nút xử lý 15ms\n ✓ src/vi-du/bai2.test.tsx > form có preventDefault: onTim nhận từ khoá, không điều hướng 57ms\n ✓ src/vi-du/bai2.test.tsx > form KHÔNG preventDefault: jsdom in \"Not implemented\" (trình duyệt thật thì tải lại trang) 43ms\n ✓ src/vi-du/bai2.test.tsx > onChange chạy mỗi phím; Escape xoá 38ms\n ✓ src/vi-du/bai2.test.tsx > target là chỗ bấm trúng, currentTarget là chỗ gắn handler 8ms\n ✓ src/vi-du/bai2.test.tsx > button không ghi type trong form ⇒ gửi luôn form 43ms\n\n Test Files  1 passed (1)\n      Tests  9 passed (9)",
  suaThang: '[sua truc tiep] sau khi bam Doi ten: Họ tên: Nguyễn Văn A | sau khi bam Viec khac: Họ tên: Trần Thị B\n[push] 1 yêu thích',
  spread: "[spread] {\n  'moi === cu': false,\n  'moi.benhNhan === cu.benhNhan': false,\n  'cu.benhNhan.soDienThoai': '0901234567',\n  'moi.benhNhan.soDienThoai': '0987654321'\n}",
  motTang: '[mot tang] cu.benhNhan.hoTen = Tên bị đổi nhầm',
  mapObj: "[map] {\n  'bs-5 moi': 4,\n  'bs-5 cu': 3,\n  'moi[4] === cu[4]': false,\n  'moi[0] === cu[0]': true\n}",
  objectIsCode: "const a = { hoTen: 'An' };\nconst b = a;          // b trỏ CÙNG object với a\nconst c = { ...a };   // c là object MỚI, chép field của a\nconsole.log('Object.is(3, 3)          ', Object.is(3, 3));\nconsole.log(\"Object.is('An', 'An')    \", Object.is('An', 'An'));\nconsole.log('Object.is(a, b)  // b = a', Object.is(a, b));\nb.hoTen = 'Binh';\nconsole.log('a.hoTen sau khi sua b    ', a.hoTen);\nconsole.log('Object.is(a, c)  // c = {...a}', Object.is(a, c));\nconsole.log('Object.is({}, {})        ', Object.is({}, {}));",
  objectIs: "$ node object-is.mjs   # Node v22.22.2\nObject.is(3, 3)           true\nObject.is('An', 'An')     true\nObject.is(a, b)  // b = a true\na.hoTen sau khi sua b     Binh\nObject.is(a, c)  // c = {...a} false\nObject.is({}, {})         false",
  sortRender: '[sort trong render] mang goc sau khi render ban sai: bs-6,bs-4,bs-1,bs-2,bs-3,bs-5\n[sort trong render] mang goc sau khi render ban dung: bs-1,bs-2,bs-3,bs-4,bs-5,bs-6',
  sort: "[sort] {\n  goc: '12,8,5,15,3,20',\n  'sort tra ve chinh a': true,\n  'a sau sort': '20,15,12,8,5,3',\n  'toSorted tra ve mang moi': true,\n  'b sau toSorted': '12,8,5,15,3,20'\n}",
  mang: "[mang] {\n  them: [ 'bs-1', 'bs-2', 'bs-3', 'bs-4' ],\n  bo: [ 'bs-1', 'bs-3' ],\n  thay: [ 'bs-1', 'bs-2', 'bs-6' ],\n  chen: [ 'bs-1', 'bs-5', 'bs-2', 'bs-3' ],\n  'ds van nguyen': [ 'bs-1', 'bs-2', 'bs-3' ]\n}",
  strict: '[strict] updater dot bien: 1 → 3 → 5 → 7\n[strict] updater thuan: 1 → 2 → 3 → 4\n[khong strict] updater dot bien: 1 → 2 → 3 → 4',
  rieng: '[rieng] chip Nhi aria-pressed = true | Đang hiện 6 bác sĩ',
  luuKetQua: '[luu ket qua] go "huy" ⇒ Kết quả: BS. Trần Thu Hà, BS. Hoàng Đức Huy\n[tinh trong render] go "huy" ⇒ Kết quả: BS. Hoàng Đức Huy',
  chepProp: '[chep prop] nhan = "Ghi chú cho BS. Trần Thu Hà" | o nhap = "Khám và theo dõi bệnh mạn tính: tăng huyết áp, tiểu đường, dạ dày."',
  caoThap: '[cao/thap] Header render khi go 3 phim — state o App: mount,update,update,update | state o KhuTim: mount',
  duAnNgan: " ✓ src/components/DanhSachBacSi.test.tsx > mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu 333ms\n ✓ src/components/DanhSachBacSi.test.tsx > bác sĩ từ 15 năm kinh nghiệm được đánh dấu 15ms\n ✓ src/components/DanhSachBacSi.test.tsx > danh sách rỗng thì báo, không vẽ lưới 6ms\n …\n ✓ src/components/KhuBacSi.test.tsx > bấm chip Nhi ⇒ chỉ còn 2 bác sĩ nhi, chip được đánh dấu 479ms\n ✓ src/components/KhuBacSi.test.tsx > gõ \"lan\" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan 194ms\n …\n\n Test Files  6 passed (6)\n      Tests  24 passed (24)",
  duAnVerbose: " ✓ src/components/DanhSachBacSi.test.tsx > mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu 333ms\n ✓ src/components/DanhSachBacSi.test.tsx > bác sĩ từ 15 năm kinh nghiệm được đánh dấu 15ms\n ✓ src/components/DanhSachBacSi.test.tsx > danh sách rỗng thì báo, không vẽ lưới 6ms\n ✓ src/App.test.tsx > trang chủ có tiêu đề phòng khám 327ms\n ✓ src/App.test.tsx > trang chủ hiện đủ 6 bác sĩ 38ms\n ✓ src/components/KhuBacSi.test.tsx > bấm chip Nhi ⇒ chỉ còn 2 bác sĩ nhi, chip được đánh dấu 479ms\n ✓ src/components/KhuBacSi.test.tsx > gõ \"lan\" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan 194ms\n ✓ src/components/KhuBacSi.test.tsx > không khớp ⇒ thông báo rỗng 140ms\n ✓ src/components/KhuBacSi.test.tsx > xem chi tiết rồi đóng 120ms\n ✓ src/components/KhuBacSi.test.tsx > yêu thích: bật, tắt, và chi tiết luôn khớp với thẻ 190ms\n ✓ src/components/KhuBacSi.test.tsx > lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn 120ms\n ✓ src/logic/loc-bac-si.test.ts > locBacSi > tat-ca + từ khoá rỗng ⇒ đủ 6 3ms\n ✓ src/logic/loc-bac-si.test.ts > locBacSi > lọc theo chuyên khoa nhi 1ms\n ✓ src/logic/loc-bac-si.test.ts > locBacSi > tìm không dấu, không phân biệt hoa thường 0ms\n ✓ src/logic/loc-bac-si.test.ts > locBacSi > kết hợp hai điều kiện 0ms\n ✓ src/logic/loc-bac-si.test.ts > locBacSi > không sửa mảng gốc 0ms\n ✓ src/logic/loc-bac-si.test.ts > locBacSi > boDau 0ms\n ✓ src/components/TheBacSi.test.tsx > hiện tên, chuyên khoa bằng tiếng Việt và số năm kinh nghiệm 220ms\n ✓ src/components/TheBacSi.test.tsx > không có nhãn \"Bác sĩ lâu năm\" khi noiBat không được truyền 10ms\n ✓ src/components/TheBacSi.test.tsx > có nhãn \"Bác sĩ lâu năm\" khi noiBat 4ms\n ✓ src/components/TheBacSi.test.tsx > có handler thì có nút; bấm gọi đúng id 65ms\n ✓ src/components/TheBacSi.test.tsx > không truyền handler (như Chương 1) thì không vẽ nút nào 3ms\n ✓ src/logic/yeu-thich.test.ts > thêm id chưa có ⇒ mảng MỚI có thêm id 3ms\n ✓ src/logic/yeu-thich.test.ts > bấm lần hai ⇒ bỏ id ra 0ms\n\n Test Files  6 passed (6)\n      Tests  24 passed (24)",
  cleanup: ' FAIL  src/App.test.tsx > hiện đủ 6 bác sĩ\nAssertionError: expected [ <h3></h3>, <h3></h3>, …(10) ] to have a length of 6 but got 12\n\n- Expected\n+ Received\n\n- 6\n+ 12',
  build: 'dist/index.html                   0.46 kB │ gzip:  0.29 kB\ndist/assets/index-BEITAmqT.css    2.69 kB │ gzip:  0.90 kB\ndist/assets/index-LWc-2jCn.js   225.20 kB │ gzip: 70.86 kB\n\n✓ built in 319ms',
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  vongStateEn: L(
    "flowchart TB",
    "  C[\"Click the button\"] --> S[\"setSoLuot(soLuot + 1)\"]",
    "  S --> K[\"React stores the new value in this component's slot\"]",
    "  K --> R[\"React calls BoDemState again\"]",
    "  R --> U[\"useState(0) ignores the 0 and returns the stored value\"]",
    "  U --> J[\"JSX: Đã đặt 1 lượt\"]",
    "  J --> D[\"Commit: only that text node changes\"]",
    "  D -.->|\"next click\"| C",
    "  X[\"A plain let soLuot = 0: reset on every call, and React is never told\"]",
  ),
  vongStateVi: L(
    "flowchart TB",
    "  C[\"Bấm nút\"] --> S[\"setSoLuot(soLuot + 1)\"]",
    "  S --> K[\"React cất giá trị mới vào ô nhớ của component này\"]",
    "  K --> R[\"React gọi lại BoDemState\"]",
    "  R --> U[\"useState(0) bỏ qua số 0, trả giá trị đang cất\"]",
    "  U --> J[\"JSX: Đã đặt 1 lượt\"]",
    "  J --> D[\"Commit: chỉ nút chữ đó đổi\"]",
    "  D -.->|\"lần bấm sau\"| C",
    "  X[\"Biến thường let soLuot = 0: về 0 mỗi lần gọi, và React không hề biết\"]",
  ),
  snapshotEn: L(
    "sequenceDiagram",
    "  participant H as Handler from render 1 (soLuot = 0)",
    "  participant Q as React's update queue",
    "  participant R2 as Render 2",
    "  H->>Q: setSoLuot(0 + 1)",
    "  H->>Q: setSoLuot(0 + 1)",
    "  H->>Q: setSoLuot(0 + 1)",
    "  H->>H: console.log prints 0",
    "  Q->>R2: handler finished: \"use 1\" three times",
    "  R2->>R2: soLuot = 1 on screen, not 3",
    "  Note over Q,R2: Updater form n → n + 1 three times: 0 → 1 → 2 → 3",
  ),
  snapshotVi: L(
    "sequenceDiagram",
    "  participant H as Handler của render 1 (soLuot = 0)",
    "  participant Q as Hàng đợi cập nhật của React",
    "  participant R2 as Render 2",
    "  H->>Q: setSoLuot(0 + 1)",
    "  H->>Q: setSoLuot(0 + 1)",
    "  H->>Q: setSoLuot(0 + 1)",
    "  H->>H: console.log in ra 0",
    "  Q->>R2: handler xong: ba lần \"dùng 1\"",
    "  R2->>R2: màn hình soLuot = 1, không phải 3",
    "  Note over Q,R2: Dạng hàm n → n + 1 ba lần: 0 → 1 → 2 → 3",
  ),
  batchingEn: L(
    "sequenceDiagram",
    "  participant U as User",
    "  participant H as onClick of đồng bộ",
    "  participant R as React",
    "  participant P as Profiler onRender",
    "  U->>H: click",
    "  H->>R: setA(a + 1): queued",
    "  H->>R: setB(b + 1): queued",
    "  H-->>R: handler finished",
    "  R->>R: ONE render with both updates",
    "  R->>P: ONE commit (total 2)",
    "  Note over H,R: Since React 18 the same inside setTimeout and promises",
  ),
  batchingVi: L(
    "sequenceDiagram",
    "  participant U as Người dùng",
    "  participant H as onClick của nút đồng bộ",
    "  participant R as React",
    "  participant P as Profiler onRender",
    "  U->>H: bấm",
    "  H->>R: setA(a + 1): vào hàng đợi",
    "  H->>R: setB(b + 1): vào hàng đợi",
    "  H-->>R: handler chạy xong",
    "  R->>R: MỘT lần render với cả hai cập nhật",
    "  R->>P: MỘT lần commit (tổng 2)",
    "  Note over H,R: Từ React 18, trong setTimeout và promise cũng vậy",
  ),
  goiNgayEn: L(
    "flowchart TB",
    "  R[\"Render NutGoiNgay\"] --> C[\"onClick={tang()}: tang runs NOW, during render\"]",
    "  C --> S[\"setDem(dem + 1)\"]",
    "  S --> N[\"React schedules another render\"]",
    "  N --> R",
    "  N -.->|\"React cuts the loop\"| E[\"Too many re-renders\"]",
    "  OK[\"onClick={tang}: React keeps the function and calls it only on click\"]",
  ),
  goiNgayVi: L(
    "flowchart TB",
    "  R[\"Render NutGoiNgay\"] --> C[\"onClick={tang()}: tang chạy NGAY trong lúc render\"]",
    "  C --> S[\"setDem(dem + 1)\"]",
    "  S --> N[\"React hẹn một lần render nữa\"]",
    "  N --> R",
    "  N -.->|\"React cắt vòng lặp\"| E[\"Too many re-renders\"]",
    "  OK[\"onClick={tang}: React giữ hàm, chỉ gọi khi bấm\"]",
  ),
  handlerPropEn: L(
    "flowchart TB",
    "  P[\"Parent: owns bacSiDangChonId\"] -->|\"prop onXemChiTiet = setBacSiDangChonId\"| T[\"TheBacSi\"]",
    "  T -->|\"click Xem chi tiết: onXemChiTiet(bacSi.id)\"| P",
    "  P --> R[\"State changes, the parent renders again, the panel shows that doctor\"]",
  ),
  handlerPropVi: L(
    "flowchart TB",
    "  P[\"Cha: giữ bacSiDangChonId\"] -->|\"prop onXemChiTiet = setBacSiDangChonId\"| T[\"TheBacSi\"]",
    "  T -->|\"bấm Xem chi tiết: onXemChiTiet(bacSi.id)\"| P",
    "  P --> R[\"State đổi, cha render lại, khung chi tiết hiện bác sĩ đó\"]",
  ),
  noiBotEn: L(
    "flowchart TB",
    "  C[\"Click on ♡\"] --> B[\"Button onClick: add to favourites\"]",
    "  B --> Q{{\"e.stopPropagation() called?\"}}",
    "  Q -->|\"no\"| A[\"The event bubbles to the card: its onClick opens the details too ✗\"]",
    "  Q -->|\"yes\"| S[\"The event stops at the button ✓\"]",
  ),
  noiBotVi: L(
    "flowchart TB",
    "  C[\"Bấm ♡\"] --> B[\"onClick của nút: thêm yêu thích\"]",
    "  B --> Q{{\"Có gọi e.stopPropagation()?\"}}",
    "  Q -->|\"không\"| A[\"Sự kiện nổi lên thẻ cha: onClick của thẻ mở luôn chi tiết ✗\"]",
    "  Q -->|\"có\"| S[\"Sự kiện dừng ở nút ✓\"]",
  ),
  objectIsEn: L(
    "flowchart TB",
    "  M[\"bn.hoTen = 'Trần Thị B', then setBn(bn)\"] -->|\"the same reference\"| Q{{\"Object.is(old state, new state)?\"}}",
    "  N[\"setBn({ ...bn, hoTen: 'Trần Thị B' })\"] -->|\"a new object\"| Q",
    "  Q -->|\"true\"| K[\"Nothing changed: React skips the render, the screen stays old\"]",
    "  Q -->|\"false\"| R[\"React renders the new value\"]",
  ),
  objectIsVi: L(
    "flowchart TB",
    "  M[\"bn.hoTen = 'Trần Thị B', rồi setBn(bn)\"] -->|\"cùng tham chiếu\"| Q{{\"Object.is(state cũ, state mới)?\"}}",
    "  N[\"setBn({ ...bn, hoTen: 'Trần Thị B' })\"] -->|\"object mới\"| Q",
    "  Q -->|\"true\"| K[\"Không đổi gì: React bỏ qua render, màn hình giữ bản cũ\"]",
    "  Q -->|\"false\"| R[\"React render giá trị mới\"]",
  ),
  bongMaEn: L(
    "sequenceDiagram",
    "  participant U as User",
    "  participant S as SuaTrucTiep",
    "  participant R as React",
    "  U->>S: click Đổi tên (sai)",
    "  S->>S: bn.hoTen = 'Trần Thị B' (mutation)",
    "  S->>R: setBn(bn): the same object",
    "  R-->>U: render skipped, screen still Nguyễn Văn A",
    "  U->>S: click Việc khác",
    "  S->>R: setDem(dem + 1)",
    "  R-->>U: this render reads bn.hoTen: suddenly Trần Thị B",
  ),
  bongMaVi: L(
    "sequenceDiagram",
    "  participant U as Người dùng",
    "  participant S as SuaTrucTiep",
    "  participant R as React",
    "  U->>S: bấm Đổi tên (sai)",
    "  S->>S: bn.hoTen = 'Trần Thị B' (đột biến)",
    "  S->>R: setBn(bn): vẫn object cũ",
    "  R-->>U: bỏ qua render, màn hình vẫn Nguyễn Văn A",
    "  U->>S: bấm Việc khác",
    "  S->>R: setDem(dem + 1)",
    "  R-->>U: lần render này đọc bn.hoTen: bỗng thành Trần Thị B",
  ),
  longNhauEn: L(
    "flowchart TB",
    "  F[\"doiSoDienThoai: spread lh, then spread lh.benhNhan\"] --> MOI",
    "  CU[\"cu: LichHen\"] --> BC[\"cu.benhNhan: 0901234567\"]",
    "  MOI[\"moi: a NEW LichHen\"] --> BM[\"moi.benhNhan: a NEW object, 0987654321\"]",
    "  CU -.->|\"id, lyDo copied\"| MOI",
    "  BC -.->|\"hoTen copied\"| BM",
  ),
  longNhauVi: L(
    "flowchart TB",
    "  F[\"doiSoDienThoai: spread lh, rồi spread lh.benhNhan\"] --> MOI",
    "  CU[\"cu: LichHen\"] --> BC[\"cu.benhNhan: 0901234567\"]",
    "  MOI[\"moi: LichHen MỚI\"] --> BM[\"moi.benhNhan: object MỚI, 0987654321\"]",
    "  CU -.->|\"chép id, lyDo\"| MOI",
    "  BC -.->|\"chép hoTen\"| BM",
  ),
  nangLenEn: L(
    "flowchart TB",
    "  subgraph TRUOC[\"Before: each component has its own ck\"]",
    "    direction LR",
    "    A1[\"ThanhLocRieng: ck = nhi, chip lit\"] ~~~ A2[\"DanhSachRieng: ck = tat-ca, still 6 doctors\"]",
    "  end",
    "  subgraph SAU[\"After: ck lives in the closest common parent\"]",
    "    direction TB",
    "    P[\"NangStateLen: owns ck\"] -->|\"giaTri, onDoi\"| C[\"ChipChuyenKhoa: no state of its own\"]",
    "    C -.->|\"onDoi(nhi)\"| P",
    "    P --> L[\"Đang hiện 2 bác sĩ, computed from ck\"]",
    "  end",
    "  TRUOC -->|\"lift the state up\"| SAU",
  ),
  nangLenVi: L(
    "flowchart TB",
    "  subgraph TRUOC[\"Trước: mỗi component một ck riêng\"]",
    "    direction LR",
    "    A1[\"ThanhLocRieng: ck = nhi, chip sáng\"] ~~~ A2[\"DanhSachRieng: ck = tat-ca, vẫn 6 bác sĩ\"]",
    "  end",
    "  subgraph SAU[\"Sau: ck nằm ở cha chung gần nhất\"]",
    "    direction TB",
    "    P[\"NangStateLen: giữ ck\"] -->|\"giaTri, onDoi\"| C[\"ChipChuyenKhoa: không có state riêng\"]",
    "    C -.->|\"onDoi(nhi)\"| P",
    "    P --> L[\"Đang hiện 2 bác sĩ, tính từ ck\"]",
    "  end",
    "  TRUOC -->|\"nâng state lên\"| SAU",
  ),
  khuBacSiEn: L(
    "flowchart TB",
    "  K[\"KhuBacSi: 4 states, 3 derived values\"] -->|\"giaTri, onDoi\"| C[\"ChipChuyenKhoa\"]",
    "  K -->|\"tuKhoa, onDoi\"| O[\"OTimBacSi\"]",
    "  K -->|\"danhSachLoc, yeuThich, onXemChiTiet\"| D[\"DanhSachBacSi\"]",
    "  D --> T[\"TheBacSi × N\"]",
    "  K -->|\"bacSiDangChon, onDong\"| CT[\"ChiTietBacSi\"]",
    "  C -.-> K",
    "  T -.-> K",
    "  CT -.-> K",
    "  UP[\"Dotted arrows: children never set state themselves, they call onDoi, onXemChiTiet, onDoiYeuThich, onDong\"]",
  ),
  khuBacSiVi: L(
    "flowchart TB",
    "  K[\"KhuBacSi: 4 state, 3 giá trị dẫn xuất\"] -->|\"giaTri, onDoi\"| C[\"ChipChuyenKhoa\"]",
    "  K -->|\"tuKhoa, onDoi\"| O[\"OTimBacSi\"]",
    "  K -->|\"danhSachLoc, yeuThich, onXemChiTiet\"| D[\"DanhSachBacSi\"]",
    "  D --> T[\"TheBacSi × N\"]",
    "  K -->|\"bacSiDangChon, onDong\"| CT[\"ChiTietBacSi\"]",
    "  C -.-> K",
    "  T -.-> K",
    "  CT -.-> K",
    "  UP[\"Mũi tên chấm: con không tự đổi state, chúng gọi onDoi, onXemChiTiet, onDoiYeuThich, onDong\"]",
  ),
  laStateEn: L(
    "flowchart TB",
    "  Q1{{\"Does the user or the server change it?\"}} -->|\"no\"| V[\"Not state: a constant\"]",
    "  Q1 -->|\"yes\"| Q2{{\"Can it be computed from what you already have?\"}}",
    "  Q2 -->|\"yes\"| V2[\"Compute during render: danhSachLoc, bacSiDangChon\"]",
    "  Q2 -->|\"no\"| S[\"State, with exactly ONE owner\"]",
    "  S --> W[\"Owner: the closest common parent of everyone who needs it, and no higher\"]",
  ),
  laStateVi: L(
    "flowchart TB",
    "  Q1{{\"Người dùng hay máy chủ có đổi nó không?\"}} -->|\"không\"| V[\"Không phải state: một hằng số\"]",
    "  Q1 -->|\"có\"| Q2{{\"Tính được từ thứ đã có không?\"}}",
    "  Q2 -->|\"được\"| V2[\"Tính trong lúc render: danhSachLoc, bacSiDangChon\"]",
    "  Q2 -->|\"không\"| S[\"State, đúng MỘT chủ\"]",
    "  S --> W[\"Chủ: cha chung gần nhất của mọi nơi cần nó, không cao hơn\"]",
  ),
  luongGoEn: L(
    "sequenceDiagram",
    "  participant U as User",
    "  participant O as OTimBacSi",
    "  participant K as KhuBacSi",
    "  participant D as DanhSachBacSi",
    "  U->>O: types l, a, n",
    "  O->>K: onDoi(text) = setTuKhoa, once per letter",
    "  K->>K: re-render: locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa)",
    "  K->>D: danhSach = only BS. Phạm Ngọc Lan",
    "  D-->>U: Đội ngũ bác sĩ (1)",
  ),
  luongGoVi: L(
    "sequenceDiagram",
    "  participant U as Người dùng",
    "  participant O as OTimBacSi",
    "  participant K as KhuBacSi",
    "  participant D as DanhSachBacSi",
    "  U->>O: gõ l, a, n",
    "  O->>K: onDoi(chữ) = setTuKhoa, mỗi chữ một lần",
    "  K->>K: render lại: locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa)",
    "  K->>D: danhSach = chỉ BS. Phạm Ngọc Lan",
    "  D-->>U: Đội ngũ bác sĩ (1)",
  ),
  thuTuEn: L(
    "flowchart TB",
    "  A[\"1. setup.ts calls cleanup after each test\"] --> B[\"2. Pure logic + tests: boDau, locBacSi, yeu-thich\"]",
    "  B --> C[\"3. Controlled inputs: ChipChuyenKhoa, OTimBacSi\"]",
    "  C --> D[\"4. TheBacSi: four optional props\"]",
    "  D --> E[\"5. ChiTietBacSi: the detail panel\"]",
    "  E --> F[\"6. KhuBacSi: four states, the rest computed\"]",
    "  F --> G[\"7. Test like a user: KhuBacSi.test.tsx\"]",
  ),
  thuTuVi: L(
    "flowchart TB",
    "  A[\"1. setup.ts gọi cleanup sau mỗi test\"] --> B[\"2. Logic thuần + test: boDau, locBacSi, yeu-thich\"]",
    "  B --> C[\"3. Ô kiểm soát: ChipChuyenKhoa, OTimBacSi\"]",
    "  C --> D[\"4. TheBacSi: bốn prop tuỳ chọn\"]",
    "  D --> E[\"5. ChiTietBacSi: khung chi tiết\"]",
    "  E --> F[\"6. KhuBacSi: bốn state, còn lại tính ra\"]",
    "  F --> G[\"7. Test như người dùng: KhuBacSi.test.tsx\"]",
  ),
};

export default {
  title: 'Chapter 2 — State and events|||Chương 2 — State và sự kiện',
  description: 'Dữ liệu thay đổi và React render lại: useState và ảnh chụp state, cập nhật theo hàm, batching, xử lý sự kiện, cập nhật object/mảng bất biến, và chọn chỗ đặt state — mọi hành vi đo thật bằng Vitest, Profiler và Chromium.',
  lessons: [

    /* ─────────────────────────── 2.0 ─────────────────────────── */
    {
      title: '2.0 — Chapter 2 slides: state and events in pictures|||2.0 — Slide Chương 2: state và sự kiện bằng hình',
      slug: 'rx-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 28 slide của Chương 2: biến thường vs state, ảnh chụp state, batching đo bằng Profiler, luật hook, onClick nhận hàm, sự kiện nổi bọt, form tải lại trang, Object.is và bug sửa thẳng, spread từng tầng, StrictMode gọi updater hai lần, nâng state lên và state dẫn xuất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Slides</span>
<h2>The whole chapter in 28 slides</h2>
<p class="lead">Chapter 1 drew the doctor list from a fixed array: it looks right, but nothing on it reacts to you. This chapter gives the page a memory. By the end, the list filters by specialty, searches names without accents, opens a detail panel and keeps a favourites list — and you will know exactly why each click redraws what it redraws.</p>
<p>Slides 3–8 belong to Lesson 2.1 (useState, snapshots, batching, the rules of hooks), 9–13 to 2.2 (events), 14–19 to 2.3 (objects and arrays without mutation) and 20–24 to 2.4 (where state should live). Slides 25, 26 and 28 belong to Lesson 2.5, where you build the doctor screen yourself: the finished screen, the chapter&#39;s common mistakes, and the "keep building the project" checklist; slide 27 is the cheat sheet used by the quiz. Every number on the slides is real: measured on 25 September 2026 with React 19.3.0, Vitest 5.0.1 and React&#39;s own <code>&lt;Profiler&gt;</code>, plus a real Chromium driven by Playwright for the form that reloads the page. Two results are more subtle than the usual tutorial sentence — setting the same value, and StrictMode&#39;s double call — and the slides show what actually happened.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Slide</span>
<h2>Cả chương trong 28 slide</h2>
<p class="lead">Chương 1 vẽ danh sách bác sĩ từ một mảng cố định: nhìn thì đúng, nhưng không có gì trên đó phản ứng với bạn. Chương này cho trang một bộ nhớ. Hết chương, danh sách lọc được theo chuyên khoa, tìm được tên kể cả khi gõ không dấu, mở được khung chi tiết và giữ một danh sách yêu thích — và bạn biết chính xác vì sao mỗi cú bấm vẽ lại đúng những gì nó vẽ lại.</p>
<p>Slide 3–8 thuộc Bài 2.1 (useState, ảnh chụp state, batching, luật hook), 9–13 thuộc 2.2 (sự kiện), 14–19 thuộc 2.3 (object và mảng không đột biến), 20–24 thuộc 2.4 (state nên ở đâu). Slide 25, 26 và 28 thuộc Bài 2.5, nơi bạn tự dựng màn hình bác sĩ: màn hình hoàn chỉnh, những sai lầm hay gặp của chương, và danh sách "tự gõ tiếp dự án"; slide 27 là bảng tra nhanh dùng cho bài kiểm tra. Mọi con số trên slide là THẬT: đo ngày 25/09/2026 bằng React 19.3.0, Vitest 5.0.1 và chính <code>&lt;Profiler&gt;</code> của React, cộng một Chromium thật do Playwright điều khiển cho phần form tải lại trang. Có hai kết quả tinh tế hơn câu một dòng trong các bài hướng dẫn — đặt lại cùng một giá trị, và StrictMode gọi hai lần — slide ghi đúng điều đã xảy ra.</p>
</div>
${gallery('rx-02', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Biến thường vs state — ảnh chụp thật'], [4, 'useState trả về một cặp'], [5, 'Trigger → Render → Commit → Paint'],
  [6, 'State là ảnh chụp'], [7, 'Batching đo bằng Profiler'], [8, 'Luật hook'],
  [9, 'onClick nhận một hàm'], [10, 'Truyền tham số cho handler'], [11, 'Sự kiện nổi bọt'],
  [12, 'Form tải lại trang'], [13, 'Kiểu sự kiện trong TypeScript'],
  [14, 'Sửa thẳng object — ảnh chụp thật'], [15, 'Bug ma'], [16, 'Spread từng tầng'],
  [17, 'Mảng: trả mảng mới'], [18, 'StrictMode gọi updater hai lần'], [19, 'Immer'],
  [20, 'Nâng state lên cha chung'], [21, 'Cây component của KhuBacSi'], [22, 'Đừng cất thứ tính được'],
  [23, 'State đặt càng thấp càng ít render'], [24, 'Nguyên tắc cấu trúc state'], [25, 'Kết quả chương'],
  [26, 'Sai lầm hay gặp'], [27, 'Bảng tra nhanh'], [28, 'Tự gõ tiếp dự án'],
])}
`,
    },

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — useState and re-rendering: snapshots, updater functions and batching|||2.1 — useState và render lại: ảnh chụp state, cập nhật theo hàm và batching',
      slug: 'rx-2-1-use-state',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao biến thường không làm màn hình đổi, useState trả về gì, render thật sự là gì, state là ảnh chụp, cập nhật theo hàm, batching và bỏ qua khi cùng giá trị (đo bằng Profiler), khởi tạo lười, luật hook — kèm lỗi tsc/oxlint/React thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>useState and re-rendering: snapshots, updater functions and batching</h2>
<p class="lead">A component is a function. React calls it, takes the JSX it returns, and puts that on the screen. If you want the screen to change, you have to give React a reason to call the function again — and a place to keep the value between calls. That place is <strong>state (trạng thái)</strong>, and the way you ask for it is <code>useState</code>.</p>

<p>This lesson builds that idea from the ground up with a tiny "booking counter", then measures three things most tutorials only describe: what a variable holds inside one render (the "snapshot"), how many times React really renders when you call a setter twice (batching), and what happens when you set the same value again. Everything below ran in the chapter&#39;s test project with React 19.3.0 and Vitest 5.0.1; the outputs are pasted, not paraphrased.</p>

<h3>Why a normal variable is not enough</h3>
${slide('rx-02', 3, 'A normal variable does not change the screen — state does (real screenshot)')}
<p>Start with the most natural thing a beginner writes: a variable that counts bookings, and a button that adds one.</p>
${pre('tsx', SN.bienThuong)}
<p>Click the button three times. The screen still says <strong>0</strong>. The test in the project clicks three times and records both the button text and what the console printed:</p>
${out(OUT.bienThuong)}
<p>So the variable <em>did</em> change — the console proves it went 1, 2, 3. Two separate things went wrong:</p>
<ol>
<li><strong>React was never told.</strong> Changing a local variable is invisible to React. Nothing calls your component again, so the JSX on screen is still the JSX from the first call, where <code>soLuot</code> was 0.</li>
<li><strong>Even if React did call it again, the value would be lost.</strong> Every call of <code>BoDemBienThuong</code> runs <code>let soLuot = 0</code> from the top. A local variable lives for one call of the function and then disappears.</li>
</ol>
<p>State solves both problems at once: React <strong>keeps</strong> the value for you between calls, and calling the setter <strong>tells</strong> React to call your component again.</p>
${SD.vongStateEn}
${pre('tsx', SN.boDemState)}
<p>Same clicks, and now the button reads "Đã đặt 3 lượt". The test <code>state: bấm 3 lần ⇒ 3</code> is green.</p>

<h3>What useState gives you</h3>
${slide('rx-02', 4, 'useState returns one pair: the current value and a function to set a new one')}
<p><code>useState(0)</code> does two jobs. On the <em>first</em> render it creates a slot of memory for this component and puts <code>0</code> in it. On every later render it ignores the <code>0</code> and hands you whatever is in the slot now. Either way it returns an array of exactly two things: the current value and a function that replaces it.</p>
<div class="callout"><p><strong>JS quick reminder — array destructuring.</strong> <code>const [a, b] = [10, 20]</code> means "take the array on the right, put its first item in <code>a</code> and its second in <code>b</code>". So <code>const [soLuot, setSoLuot] = useState(0)</code> is just naming the two items <code>useState</code> returns. The names are yours; the convention is <code>x</code> and <code>setX</code>. <code>const</code> is right: you never reassign <code>soLuot</code> yourself — you ask React for a new render in which <code>soLuot</code> has a new value.</p></div>
<p>A few facts that save beginners hours:</p>
<ul>
<li><strong>Each component instance has its own state.</strong> Render two <code>&lt;BoDemState /&gt;</code> side by side, click the first one twice, and only the first one says 2. The test <code>hai bộ đếm = hai state riêng</code> checks exactly that. State belongs to a <em>position in the tree</em>, not to the function.</li>
<li><strong>State is private.</strong> A parent cannot read a child&#39;s state. If two components need the same value, it has to live higher up — that is Lesson 2.4.</li>
<li><strong>The setter replaces, it does not merge.</strong> If your state is an object and you call <code>setX({ ten: 'An' })</code>, every other field is gone. (Class components merged; hooks do not. More in the FER202 box below.)</li>
</ul>
<p><strong>TypeScript and useState.</strong> TypeScript reads the type from the initial value: <code>useState(0)</code> is <code>number</code>, <code>useState('')</code> is <code>string</code>. The trap is <code>null</code>. Write <code>useState(null)</code> for "no doctor selected yet", then try to store a doctor, and <code>tsc</code> refuses:</p>
${out(OUT.tsNull)}
<p>TypeScript inferred the type as "only <code>null</code>, forever". Tell it the full type with a generic (a type in angle brackets): <code>useState&lt;BacSi | null&gt;(null)</code>. The project does exactly this with an id: <code>useState&lt;string | null&gt;(null)</code>. Why an id and not the whole doctor object is a question for Lesson 2.4.</p>

<h3>What "render" really means</h3>
${slide('rx-02', 5, 'Each set… starts one cycle: Trigger → Render → Commit → Paint')}
<p>The word "render (vẽ ra)" is used loosely, and that looseness causes real bugs. In React it means one precise thing: <strong>React calls your component function to get new JSX</strong>. Every update goes through four steps:</p>
<ol>
<li><strong>Trigger.</strong> Something asks for an update: the first mount, or a <code>setX(…)</code> call.</li>
<li><strong>Render.</strong> React calls your component (and, by default, every component inside it) to get the new JSX. <em>Nothing on the screen changes yet.</em></li>
<li><strong>Commit.</strong> React compares the new JSX with the previous one and changes only the DOM nodes that differ. If the text of one button changed, only that text node is touched.</li>
<li><strong>Paint.</strong> The browser draws the updated DOM. This part is not React at all.</li>
</ol>
<p>Two consequences follow. First, <strong>the body of a component must be pure (thuần khiết)</strong>: given the same props and state it returns the same JSX, and it does not change anything outside itself — no API calls, no editing of global variables, no <code>document.title = …</code> in the middle of the function. React may call it more often than you expect (StrictMode calls it twice in development, as you will see in 2.3). Second, <strong>"re-render" is not the same as "the DOM changed"</strong>. A component can render and produce exactly the same JSX; the commit then changes nothing. That is why "it re-renders too much" is only a problem if you measured it (Chapter 8).</p>

<h3>State is a snapshot</h3>
${slide('rx-02', 6, 'State is a snapshot: inside one render, soLuot is a constant')}
<p>Here is the behaviour that surprises almost everyone the first time. The component below has a button that calls the setter three times in a row, then logs the value:</p>
${pre('tsx', SN.baLanCong)}
<p>Guess before reading on: after one click on "+3 (viết sai)", what does the screen show, and what does the console print? The test clicks and records both, then clicks the second button:</p>
${out(OUT.snapshot)}
<p>One click on the "wrong" button gives 1, not 3, and the log right after three setter calls still prints 0. Then the updater button adds a real 3 (1 → 4).</p>
<p>The reason is in the name of this section. When React renders <code>BaLanCong</code>, it calls the function with <code>soLuot = 0</code>. The click handler created during that render "sees" <code>soLuot</code> as 0 and nothing can change that — it is a <code>const</code> in that call. So the three lines are really:</p>
${pre('ts', OUT.snapEn)}
<p>Calling the setter does not change the variable you are holding; it asks React for a <em>future</em> render in which <code>soLuot</code> has the new value. The react.dev docs describe the state value as a snapshot: fixed for the render it belongs to, including inside handlers and timeouts created by that render.</p>
${SD.snapshotEn}
<div class="callout"><p><strong>JS quick reminder — closures.</strong> A function "remembers" the variables that existed where it was created. The arrow function <code>() =&gt; { … }</code> passed to <code>onClick</code> is created during a render, so it remembers that render&#39;s <code>soLuot</code>. A click one minute later still uses that value. This is not a React rule; it is how JavaScript functions work.</p></div>

<h3>Updater functions: when the next value depends on the previous one</h3>
<p>The fix is to pass the setter a <strong>function</strong> instead of a value: <code>setSoLuot((n) =&gt; n + 1)</code>. React puts that function in a queue. During the next render it runs the queue in order, feeding each function the result of the previous one: 0 → 1 → 2 → 3. That is why the second button gave +3.</p>
<table>
<thead><tr><th>Queued during one click</th><th>n going in</th><th>returns</th></tr></thead>
<tbody>
<tr><td><code>n =&gt; n + 1</code></td><td>0</td><td>1</td></tr>
<tr><td><code>n =&gt; n + 1</code></td><td>1</td><td>2</td></tr>
<tr><td><code>n =&gt; n + 1</code></td><td>2</td><td>3</td></tr>
</tbody></table>
<p>You can mix both forms: <code>setX(5)</code> is treated like "replace with 5, ignore what came before", and later updater functions in the same queue start from 5. The rule of thumb:</p>
<ul>
<li>Next value <strong>depends on the previous</strong> one (counters, toggling a favourite, appending to a list) → updater function.</li>
<li>Next value <strong>comes from outside</strong> (what the user typed, the id of the clicked doctor) → pass the value.</li>
</ul>
<p>Naming: people usually name the updater&#39;s argument after the state (<code>n</code>, <code>cu</code> "old", or the first letter). In the project, toggling a favourite is <code>setYeuThich((cu) =&gt; doiYeuThich(cu, id))</code> — "take the old list, return the new one".</p>
<div class="pitfall co-tieu-de"><strong>Trap — reading state right after setting it.</strong> A classic form bug: <code>setTuKhoa(e.target.value); timKiem(tuKhoa);</code> — the search runs with the <em>previous</em> keyword, so results are always one keystroke behind. Nothing is broken in React; <code>tuKhoa</code> is the snapshot of the current render. If you need the new value in the same handler, put it in a local variable first: <code>const moi = e.target.value; setTuKhoa(moi); timKiem(moi);</code> — or, better, compute results from state during render so there is nothing to keep in sync (Lesson 2.4 shows this exact bug, measured).</div>

<h3>Batching: many sets, one render</h3>
${slide('rx-02', 7, 'Batching: several sets in one event = ONE render (measured with Profiler)')}
<p>If every setter call caused a render, three calls would draw three times. React instead <strong>batches (gộp)</strong> them: it waits until your event handler has finished, then renders once with all the queued updates. To see it, the test wraps a small component in React&#39;s built-in <code>&lt;Profiler&gt;</code>, whose <code>onRender</code> callback fires once per commit, and pushes the phase (<code>mount</code> or <code>update</code>) into an array. It clicks "đồng bộ", then "trong setTimeout" (and waits 30 ms), then "set giá trị cũ" three times, recording the array length after each step:</p>
${pre('tsx', SN.haiState)}
${out(OUT.batching)}
<p>Reading the numbers from left to right:</p>
<ul>
<li><strong>mount</strong> is the first render. Clicking "đồng bộ", which calls <code>setA</code> and <code>setB</code>, adds exactly <strong>one</strong> commit (total 2).</li>
<li>Two setters inside a <code>setTimeout</code> also add <strong>one</strong> (total 3). Before React 18 this case rendered twice; since React 18, batching is automatic everywhere — timeouts, promises, native events.</li>
<li>"set giá trị cũ" calls <code>setA(a)</code> with the value it already has. The react.dev reference says React skips re-rendering when <code>Object.is</code> finds the new value identical, but adds: "in some cases React may still need to call your component before skipping the children". That is what we measured: the <strong>first</strong> identical set still produced a commit (total 4); the next two produced <strong>none</strong>. The practical rule is unchanged — setting the same value is cheap and harmless — but do not write code that depends on "zero renders".</li>
</ul>
${SD.batchingEn}
<p><strong>Lazy initialisation.</strong> The same test file measures one more detail. If the initial value is expensive to build, <code>useState(taoDanhSach())</code> calls the function on <em>every</em> render and throws the result away after the first. Pass the function itself and React calls it once:</p>
${pre('tsx', SN.khoiTao)}
${out(OUT.lazy)}
<p>Three clicks = four renders, so <code>tao()</code> ran four times in the first version and once in the second. With a 1,000-item array it does not matter; with reading and parsing a large value from <code>localStorage</code> (Chapter 4) it does.</p>

<h3>The rules of hooks</h3>
${slide('rx-02', 8, 'Rules of hooks: call them at the top, in the same order every render')}
<p><code>useState</code> is a <strong>hook</strong> — a function whose name starts with <code>use</code> and that lets a component "hook into" React features. React does not know your state by variable name; it knows it by <strong>call order</strong>: "the first <code>useState</code> of this component is slot 1, the second is slot 2". That only works if the order never changes. Hence two rules: call hooks only at the top level of a component or of your own hook, and never inside <code>if</code>, loops or nested functions.</p>
${pre('tsx', SN.hookTrongIf)}
<p>The linter that ships with the Vite template (oxlint, with the React plugin enabled in <code>.oxlintrc.json</code>) catches it before you run anything:</p>
${out(OUT.oxlint)}
<p>And if you ignore the linter, React catches it at run time the moment the order changes — here, when <code>coChiTiet</code> flips from <code>false</code> to <code>true</code> between two renders:</p>
${out(OUT.hookRuntime)}
<p>The fix is always the same shape: call the hook unconditionally at the top, and put the condition in what you <em>do</em> with it.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>Several FER202 slides and older labs still show state in a <strong>class component</strong>: <code>this.state = { count: 0 }</code> in the constructor, <code>this.setState({ count: this.state.count + 1 })</code> in a method, and <code>this.handleClick = this.handleClick.bind(this)</code> so that <code>this</code> is not <code>undefined</code>. → At work, new code is <strong>function components with hooks</strong>: <code>const [count, setCount] = useState(0)</code>, no <code>this</code>, no binding. · <em>Why:</em> less code, logic can be extracted into custom hooks (Chapter 4), and every current library (TanStack Query, React Hook Form, Zustand) is hook-based. Two differences matter when you read old code: <code>this.setState</code> <strong>merged</strong> the object you passed into the old state, while a <code>useState</code> setter <strong>replaces</strong> it; and <code>this.setState(prev =&gt; …)</code> is the same idea as the updater function above. Class components are not wrong — you will meet them in older company projects and in error boundaries (Chapter 11).</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: I call <code>setCount(count + 1)</code> and then <code>console.log(count)</code>. Why does it print the old value?</strong><br>A: Because state is a snapshot of the render the handler was created in. The setter does not change the variable; it schedules a new render in which <code>count</code> has the new value. If I need the new value in the same handler I compute it into a local variable first.</p>
<p><strong>Q: When should you pass a function to the setter?</strong><br>A: When the next state depends on the previous one — counters, toggles, appending. <code>setCount(c =&gt; c + 1)</code> reads from the queue, so several updates in one event all count and it never uses a stale value from a closure.</p>
<p><strong>Q: What is batching?</strong><br>A: React groups the state updates made during one event (and, since React 18, inside timeouts and promises too) and renders once at the end. I measured it with <code>&lt;Profiler&gt;</code>: two setters in a click gave one commit.</p>
</div>

<h3>Run it step by step: your first state</h3>
<ol>
<li>In a Vite + React + TS project (Chapter 0), create <code>src/vi-du/BoDem.tsx</code> with the "normal variable" version above. Render it in <code>App.tsx</code>, open the browser console, click three times. Note: console 1, 2, 3; screen 0.</li>
<li>Replace the variable with <code>const [soLuot, setSoLuot] = useState(0)</code>. Click three times: the screen follows.</li>
<li>Add a <code>console.log('render', soLuot)</code> at the top of the component body. In development you will see each line <strong>twice</strong> per click — that is StrictMode calling your component twice to catch impurities, not a bug in your code (more in 2.3).</li>
<li>Add the "+3 (viết sai)" button. Predict, click, compare. Then change it to the updater form and predict again.</li>
<li>Write the test: <code>render(&lt;BoDem /&gt;)</code>, <code>await user.click(…)</code> three times, <code>expect(nut).toHaveTextContent('Đã đặt 3 lượt')</code>. Run <code>npx vitest run</code>. If you want to see <code>console.info</code> lines from passing tests, add <code>--reporter=verbose</code>: with Vitest 5&#39;s default reporter they did not appear on this machine.</li>
</ol>
${out(OUT.bai1Verbose)}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic wants a "number of people waiting" counter at the reception desk, with "+1", "+5" and "Reset" buttons.</p><ol>
<li>Build <code>HangCho</code> with one state. "+1" uses an updater function; "+5" calls the updater five times in a loop (<code>for (let i = 0; i &lt; 5; i++)</code>); "Reset" sets 0.</li>
<li>Add a second, deliberately wrong "+5 (sai)" button that calls <code>setSo(so + 1)</code> five times. Write down what you expect before clicking.</li>
<li>Wrap the component in <code>&lt;Profiler id="hang-cho" onRender={…}&gt;</code> in a test and count commits for one click on "+5".</li>
<li>Type the state so that it cannot become a string: try <code>setSo('5')</code> and read the <code>tsc</code> error.</li>
</ol><p><strong>Done when:</strong> a Vitest test proves "+5" adds 5 and "+5 (sai)" adds 1; the Profiler test shows exactly one commit for one click on "+5"; <code>npx tsc -b</code> is clean after you remove the <code>setSo('5')</code> line (and you can quote the error it gave).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">state (trạng thái)</span><span class="v">a value React keeps for one component instance between renders; changing it with the setter triggers a re-render</span></div>
<div class="kv"><span class="k">hook</span><span class="v">a function starting with <code>use</code> that plugs a component into a React feature; called at the top level, same order every render</span></div>
<div class="kv"><span class="k">render (vẽ ra)</span><span class="v">React calling your component to get JSX; does not touch the DOM by itself</span></div>
<div class="kv"><span class="k">commit</span><span class="v">the step where React applies the differences to the real DOM</span></div>
<div class="kv"><span class="k">snapshot (ảnh chụp)</span><span class="v">state is fixed for the render it belongs to, including in handlers created by that render</span></div>
<div class="kv"><span class="k">updater function</span><span class="v"><code>setX(prev =&gt; next)</code>; queued and run in order during the next render</span></div>
<div class="kv"><span class="k">batching (gộp cập nhật)</span><span class="v">several state updates in one event produce one render; automatic everywhere since React 18</span></div>
<div class="kv"><span class="k">lazy initializer</span><span class="v"><code>useState(fn)</code>: React calls <code>fn</code> only on the first render</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Local variables reset on every call and do not tell React anything; <code>useState</code> keeps the value and schedules a re-render.</li>
<li>"Render" means React calls your component; the DOM is only touched in the commit, and only where something differs.</li>
<li>State is a snapshot: after <code>setX</code>, the variable you hold is still the old value until the next render.</li>
<li>Next value depends on the previous one → updater function; several updaters in one event all apply.</li>
<li>Updates in one event are batched into one render (measured: 1 commit); setting the same value is skipped, possibly after one extra call.</li>
<li>Hooks are identified by call order: top level only, never inside conditions — oxlint and React both catch violations.</li>
</ul>

${LINK('https://react.dev/learn/state-a-components-memory', '📄', 'react.dev — State: A Component&#39;s Memory', 'Why local variables are not enough, how useState works, state is isolated and private.')}
${LINK('https://react.dev/learn/render-and-commit', '📄', 'react.dev — Render and Commit', 'Trigger, render, commit: what each step does and when the browser paints.')}
${LINK('https://react.dev/learn/state-as-a-snapshot', '📄', 'react.dev — State as a Snapshot', 'Why setting state does not change the variable you already have.')}
${LINK('https://react.dev/learn/queueing-a-series-of-state-updates', '📄', 'react.dev — Queueing a Series of State Updates', 'Batching, updater functions, and mixing replace/update in one queue.')}
${LINK('https://react.dev/reference/react/useState', '📄', 'react.dev — useState reference', 'Caveats: Object.is bail-out, StrictMode double calls, lazy initializer, troubleshooting.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>useState và render lại: ảnh chụp state, cập nhật theo hàm và batching</h2>
<p class="lead">Component là một hàm. React gọi hàm đó, lấy JSX nó trả về, rồi đưa lên màn hình. Muốn màn hình đổi, bạn phải cho React một lý do để gọi lại hàm — và một chỗ để giữ giá trị giữa các lần gọi. Chỗ đó là <strong>state (trạng thái)</strong>, và cách xin nó là <code>useState</code>.</p>

<p>Bài này dựng ý tưởng đó từ gốc bằng một "bộ đếm lượt đặt lịch" nhỏ, rồi ĐO ba thứ mà phần lớn bài hướng dẫn chỉ kể: một biến chứa gì bên trong một lần render ("ảnh chụp"), React thật sự render bao nhiêu lần khi bạn gọi hàm set hai lần (batching), và chuyện gì xảy ra khi bạn đặt lại đúng giá trị cũ. Mọi thứ dưới đây chạy trong dự án thử của chương với React 19.3.0 và Vitest 5.0.1; output được dán nguyên, không kể lại.</p>

<h3>Vì sao biến thường không đủ</h3>
${slide('rx-02', 3, 'Biến thường không làm màn hình đổi — state thì có (ảnh chụp thật)')}
<p>Bắt đầu bằng thứ tự nhiên nhất một người mới sẽ viết: một biến đếm lượt đặt, và một nút cộng một.</p>
${pre('tsx', SN.bienThuong)}
<p>Bấm nút ba lần. Màn hình vẫn ghi <strong>0</strong>. Test trong dự án bấm ba lần rồi ghi lại cả chữ trên nút lẫn thứ console đã in:</p>
${out(OUT.bienThuong)}
<p>Vậy biến <em>có</em> đổi — console chứng minh nó đi 1, 2, 3. Có hai chuyện hỏng, tách biệt nhau:</p>
<ol>
<li><strong>React không hề được báo.</strong> Đổi một biến cục bộ là việc React không nhìn thấy. Không ai gọi lại component của bạn, nên JSX trên màn hình vẫn là JSX của lần gọi đầu, khi <code>soLuot</code> bằng 0.</li>
<li><strong>Kể cả React có gọi lại, giá trị cũng mất.</strong> Mỗi lần gọi <code>BoDemBienThuong</code> đều chạy <code>let soLuot = 0</code> từ đầu. Biến cục bộ chỉ sống trong một lần gọi hàm rồi biến mất.</li>
</ol>
<p>State giải cả hai cùng lúc: React <strong>giữ</strong> giá trị hộ bạn giữa các lần gọi, và gọi hàm set là <strong>báo</strong> React gọi lại component.</p>
${SD.vongStateVi}
${pre('tsx', SN.boDemState)}
<p>Cùng ba cú bấm, giờ nút ghi "Đã đặt 3 lượt". Test <code>state: bấm 3 lần ⇒ 3</code> xanh.</p>

<h3>useState đưa cho bạn cái gì</h3>
${slide('rx-02', 4, 'useState trả về MỘT cặp: giá trị hiện tại và hàm để đặt giá trị mới')}
<p><code>useState(0)</code> làm hai việc. Ở lần render <em>đầu tiên</em>, nó tạo một ô nhớ cho component này và bỏ <code>0</code> vào. Ở mọi lần render sau, nó bỏ qua số <code>0</code> và đưa bạn thứ đang nằm trong ô. Lần nào nó cũng trả về một mảng đúng hai phần tử: giá trị hiện tại và một hàm để thay giá trị đó.</p>
<div class="callout"><p><strong>JS nhắc nhanh — destructuring mảng (tách mảng).</strong> <code>const [a, b] = [10, 20]</code> nghĩa là "lấy mảng bên phải, phần tử đầu bỏ vào <code>a</code>, phần tử thứ hai bỏ vào <code>b</code>". Nên <code>const [soLuot, setSoLuot] = useState(0)</code> chỉ là đặt tên cho hai thứ <code>useState</code> trả về. Tên do bạn chọn; quy ước là <code>x</code> và <code>setX</code>. Dùng <code>const</code> là đúng: bạn không bao giờ tự gán lại <code>soLuot</code> — bạn xin React một lần render mới, trong đó <code>soLuot</code> có giá trị mới.</p></div>
<p>Vài sự thật giúp người mới đỡ mất cả buổi:</p>
<ul>
<li><strong>Mỗi thể hiện (instance) của component có state riêng.</strong> Vẽ hai <code>&lt;BoDemState /&gt;</code> cạnh nhau, bấm cái đầu hai lần, chỉ cái đầu ghi 2. Test <code>hai bộ đếm = hai state riêng</code> kiểm đúng điều đó. State thuộc về một <em>vị trí trong cây</em>, không thuộc về hàm.</li>
<li><strong>State là riêng tư.</strong> Cha không đọc được state của con. Hai component cần cùng một giá trị thì giá trị đó phải nằm cao hơn — đó là Bài 2.4.</li>
<li><strong>Hàm set THAY, không GỘP.</strong> State là object mà bạn gọi <code>setX({ ten: 'An' })</code> thì mọi field khác biến mất. (Class component thì gộp; hook thì không. Xem khung FER202 bên dưới.)</li>
</ul>
<p><strong>TypeScript và useState.</strong> TypeScript đọc kiểu từ giá trị ban đầu: <code>useState(0)</code> là <code>number</code>, <code>useState('')</code> là <code>string</code>. Bẫy nằm ở <code>null</code>. Viết <code>useState(null)</code> cho "chưa chọn bác sĩ nào", rồi thử cất một bác sĩ vào, <code>tsc</code> từ chối:</p>
${out(OUT.tsNull)}
<p>TypeScript đã suy ra kiểu là "chỉ <code>null</code>, mãi mãi". Hãy nói rõ kiểu đầy đủ bằng generic (kiểu đặt trong ngoặc nhọn): <code>useState&lt;BacSi | null&gt;(null)</code>. Dự án làm đúng như vậy nhưng với id: <code>useState&lt;string | null&gt;(null)</code>. Vì sao cất id chứ không cất cả object bác sĩ là câu hỏi của Bài 2.4.</p>

<h3>"Render" thật sự là gì</h3>
${slide('rx-02', 5, 'Mỗi lần set… là một vòng: Trigger → Render → Commit → Paint')}
<p>Chữ "render (vẽ ra)" hay được dùng lỏng lẻo, và sự lỏng lẻo đó gây bug thật. Trong React nó nghĩa đúng một việc: <strong>React gọi hàm component của bạn để lấy JSX mới</strong>. Mỗi lần cập nhật đi qua bốn bước:</p>
<ol>
<li><strong>Trigger (kích hoạt).</strong> Có thứ gì đó xin cập nhật: lần gắn đầu tiên, hoặc một lời gọi <code>setX(…)</code>.</li>
<li><strong>Render.</strong> React gọi component của bạn (và, mặc định, mọi component bên trong nó) để lấy JSX mới. <em>Chưa có gì trên màn hình đổi.</em></li>
<li><strong>Commit (ghi vào DOM).</strong> React so JSX mới với lần trước và chỉ sửa những nút DOM khác đi. Chữ của một nút đổi thì chỉ nút chữ đó bị đụng.</li>
<li><strong>Paint (vẽ).</strong> Trình duyệt vẽ DOM đã cập nhật. Bước này không còn là React.</li>
</ol>
<p>Hai hệ quả. Thứ nhất, <strong>thân component phải thuần (pure)</strong>: cùng props và state thì trả cùng JSX, và không đổi thứ gì bên ngoài — không gọi API, không sửa biến toàn cục, không <code>document.title = …</code> giữa hàm. React có thể gọi nó nhiều hơn bạn nghĩ (StrictMode gọi hai lần ở chế độ dev, bạn sẽ thấy ở 2.3). Thứ hai, <strong>"render lại" không có nghĩa là "DOM đã đổi"</strong>. Một component có thể render và trả đúng JSX cũ; khi đó commit không đổi gì. Vì vậy "nó render lại nhiều quá" chỉ là vấn đề khi bạn đã đo (Chương 8).</p>

<h3>State là một ảnh chụp</h3>
${slide('rx-02', 6, 'State là ảnh chụp: trong một lần render, soLuot là hằng số')}
<p>Đây là hành vi làm gần như ai cũng bất ngờ lần đầu. Component dưới có một nút gọi hàm set ba lần liên tiếp, rồi in giá trị ra:</p>
${pre('tsx', SN.baLanCong)}
<p>Đoán trước khi đọc tiếp: bấm "+3 (viết sai)" một lần, màn hình hiện gì, console in gì? Test bấm và ghi lại cả hai, rồi bấm nút thứ hai:</p>
${out(OUT.snapshot)}
<p>Một cú bấm nút "sai" ra 1, không phải 3, và dòng log ngay sau ba lời gọi set vẫn in 0. Sau đó nút cập nhật theo hàm cộng đúng 3 (1 → 4).</p>
<p>Lý do nằm ngay trong tên mục. Khi React render <code>BaLanCong</code>, nó gọi hàm với <code>soLuot = 0</code>. Handler được tạo trong lần render đó "nhìn thấy" <code>soLuot</code> là 0 và không gì đổi được điều ấy — trong lần gọi đó nó là một <code>const</code>. Nên ba dòng kia thực chất là:</p>
${pre('ts', OUT.snapVi)}
<p>Gọi hàm set không đổi biến bạn đang cầm; nó xin React một lần render <em>trong tương lai</em>, ở đó <code>soLuot</code> mang giá trị mới. Tài liệu react.dev gọi giá trị state là một ảnh chụp (snapshot): cố định cho lần render nó thuộc về, kể cả bên trong handler và timeout do lần render đó tạo ra.</p>
${SD.snapshotVi}
<div class="callout"><p><strong>JS nhắc nhanh — closure (bao đóng).</strong> Một hàm "nhớ" các biến tồn tại ở chỗ nó được tạo ra. Arrow function <code>() =&gt; { … }</code> truyền cho <code>onClick</code> được tạo trong một lần render, nên nó nhớ <code>soLuot</code> của lần render đó. Bấm sau một phút nó vẫn dùng giá trị ấy. Đây không phải luật của React; JavaScript vốn chạy như vậy.</p></div>

<h3>Cập nhật theo hàm: khi giá trị sau phụ thuộc giá trị trước</h3>
<p>Cách sửa là đưa cho hàm set một <strong>hàm</strong> thay vì một giá trị: <code>setSoLuot((n) =&gt; n + 1)</code>. React xếp hàm đó vào một hàng đợi. Ở lần render sau, nó chạy hàng đợi theo thứ tự, đưa cho mỗi hàm kết quả của hàm trước: 0 → 1 → 2 → 3. Đó là lý do nút thứ hai cộng đủ 3.</p>
<table>
<thead><tr><th>Xếp hàng trong một cú bấm</th><th>n đưa vào</th><th>trả về</th></tr></thead>
<tbody>
<tr><td><code>n =&gt; n + 1</code></td><td>0</td><td>1</td></tr>
<tr><td><code>n =&gt; n + 1</code></td><td>1</td><td>2</td></tr>
<tr><td><code>n =&gt; n + 1</code></td><td>2</td><td>3</td></tr>
</tbody></table>
<p>Trộn hai dạng cũng được: <code>setX(5)</code> được hiểu là "thay bằng 5, bỏ qua mọi thứ trước đó", và các hàm cập nhật sau nó trong cùng hàng đợi bắt đầu từ 5. Nguyên tắc dùng hằng ngày:</p>
<ul>
<li>Giá trị sau <strong>phụ thuộc giá trị trước</strong> (bộ đếm, bật/tắt yêu thích, thêm vào danh sách) → hàm cập nhật.</li>
<li>Giá trị sau <strong>đến từ bên ngoài</strong> (thứ người dùng gõ, id bác sĩ vừa bấm) → đưa thẳng giá trị.</li>
</ul>
<p>Đặt tên: tham số của hàm cập nhật thường đặt theo tên state (<code>n</code>, <code>cu</code>, hoặc chữ cái đầu). Trong dự án, bật/tắt yêu thích là <code>setYeuThich((cu) =&gt; doiYeuThich(cu, id))</code> — "lấy danh sách cũ, trả danh sách mới".</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — đọc state ngay sau khi set.</strong> Bug kinh điển ở ô tìm kiếm: <code>setTuKhoa(e.target.value); timKiem(tuKhoa);</code> — lệnh tìm chạy với từ khoá <em>trước đó</em>, nên kết quả luôn chậm một phím. React không hỏng gì cả; <code>tuKhoa</code> là ảnh chụp của lần render hiện tại. Cần giá trị mới ngay trong handler thì bỏ nó vào biến cục bộ trước: <code>const moi = e.target.value; setTuKhoa(moi); timKiem(moi);</code> — hoặc tốt hơn, tính kết quả từ state ngay trong render để không có gì phải giữ cho khớp (Bài 2.4 đo đúng bug này).</div>

<h3>Batching: nhiều lần set, một lần render</h3>
${slide('rx-02', 7, 'Batching: nhiều set trong một sự kiện = MỘT lần render (đo bằng Profiler)')}
<p>Nếu mỗi lời gọi set gây một lần render thì ba lời gọi vẽ ba lần. React thay vào đó <strong>gộp (batch)</strong>: nó đợi handler của bạn chạy xong, rồi render một lần với mọi cập nhật đang xếp hàng. Để thấy tận mắt, test bọc một component nhỏ trong <code>&lt;Profiler&gt;</code> có sẵn của React; hàm <code>onRender</code> của nó được gọi một lần cho mỗi lần commit, và test đẩy pha (<code>mount</code> hay <code>update</code>) vào một mảng. Test bấm "đồng bộ", rồi "trong setTimeout" (đợi 30 ms), rồi "set giá trị cũ" ba lần, ghi độ dài mảng sau mỗi bước:</p>
${pre('tsx', SN.haiState)}
${out(OUT.batching)}
<p>Đọc các con số từ trái sang phải:</p>
<ul>
<li><strong>mount</strong> là lần render đầu. Bấm "đồng bộ" (gọi <code>setA</code> và <code>setB</code>) thêm đúng <strong>một</strong> commit (tổng 2).</li>
<li>Hai lời gọi set bên trong <code>setTimeout</code> cũng thêm <strong>một</strong> (tổng 3). Trước React 18 trường hợp này render hai lần; từ React 18 việc gộp là tự động ở mọi nơi — timeout, promise, sự kiện gốc của trình duyệt.</li>
<li>"set giá trị cũ" gọi <code>setA(a)</code> với đúng giá trị đang có. Tài liệu tham khảo của react.dev nói React bỏ qua render khi <code>Object.is</code> thấy giá trị mới y hệt, nhưng thêm: "trong một số trường hợp React có thể vẫn phải gọi component của bạn trước khi bỏ qua các con". Đó đúng là điều đo được: lần set trùng <strong>đầu tiên</strong> vẫn sinh một commit (tổng 4); hai lần sau <strong>không</strong> sinh commit nào. Quy tắc thực tế không đổi — đặt lại cùng giá trị là rẻ và vô hại — nhưng đừng viết mã dựa vào "không render lần nào".</li>
</ul>
${SD.batchingVi}
<p><strong>Khởi tạo lười (lazy initializer).</strong> Cùng file test đo thêm một chi tiết. Nếu giá trị ban đầu tốn công tạo, <code>useState(taoDanhSach())</code> gọi hàm ở <em>mọi</em> lần render rồi vứt kết quả đi từ lần thứ hai. Đưa chính cái hàm thì React chỉ gọi một lần:</p>
${pre('tsx', SN.khoiTao)}
${out(OUT.lazy)}
<p>Ba cú bấm = bốn lần render, nên <code>tao()</code> chạy bốn lần ở bản đầu và một lần ở bản sau. Mảng 1.000 phần tử thì chẳng đáng kể; đọc và phân tích một giá trị lớn từ <code>localStorage</code> (Chương 4) thì đáng.</p>

<h3>Luật của hook</h3>
${slide('rx-02', 8, 'Luật hook: gọi ở đầu component, cùng thứ tự mọi lần render')}
<p><code>useState</code> là một <strong>hook</strong> — hàm có tên bắt đầu bằng <code>use</code>, cho component "móc" vào một tính năng của React. React không nhận ra state của bạn theo tên biến; nó nhận ra theo <strong>thứ tự gọi</strong>: "<code>useState</code> thứ nhất của component này là ô 1, cái thứ hai là ô 2". Điều đó chỉ đúng khi thứ tự không bao giờ đổi. Vì thế có hai luật: chỉ gọi hook ở cấp cao nhất của component hoặc của hook tự viết, và không bao giờ trong <code>if</code>, vòng lặp hay hàm lồng.</p>
${pre('tsx', SN.hookTrongIf)}
<p>Linter đi kèm template Vite (oxlint, đã bật plugin React trong <code>.oxlintrc.json</code>) bắt lỗi trước khi bạn chạy bất cứ thứ gì:</p>
${out(OUT.oxlint)}
<p>Còn nếu bỏ qua linter, React bắt lỗi lúc chạy ngay khi thứ tự đổi — ở đây là khi <code>coChiTiet</code> chuyển từ <code>false</code> sang <code>true</code> giữa hai lần render:</p>
${out(OUT.hookRuntime)}
<p>Cách sửa lúc nào cũng cùng một dạng: gọi hook vô điều kiện ở đầu, và đặt điều kiện vào chỗ bạn <em>dùng</em> nó.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Nhiều slide FER202 và lab cũ vẫn viết state trong <strong>class component</strong>: <code>this.state = { count: 0 }</code> trong constructor, <code>this.setState({ count: this.state.count + 1 })</code> trong một method, và <code>this.handleClick = this.handleClick.bind(this)</code> để <code>this</code> khỏi thành <code>undefined</code>. → Đi làm, mã mới là <strong>function component + hook</strong>: <code>const [count, setCount] = useState(0)</code>, không <code>this</code>, không bind. · <em>Vì sao:</em> ít mã hơn, logic tách được thành custom hook (Chương 4), và mọi thư viện hiện hành (TanStack Query, React Hook Form, Zustand) đều dựa trên hook. Hai khác biệt quan trọng khi đọc mã cũ: <code>this.setState</code> <strong>gộp</strong> object bạn đưa vào state cũ, còn hàm set của <code>useState</code> <strong>thay</strong> hẳn; và <code>this.setState(prev =&gt; …)</code> chính là ý tưởng hàm cập nhật ở trên. Class component không sai — bạn sẽ gặp lại nó trong dự án cũ ở công ty và trong error boundary (Chương 11).</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Tôi gọi <code>setCount(count + 1)</code> rồi <code>console.log(count)</code>. Vì sao nó in giá trị cũ?</strong><br>Đáp: Vì state là ảnh chụp của lần render mà handler được tạo ra. Hàm set không đổi biến; nó lên lịch một lần render mới, trong đó <code>count</code> có giá trị mới. Cần giá trị mới trong cùng handler thì tôi tính nó vào một biến cục bộ trước.</p>
<p><strong>Hỏi: Khi nào nên đưa một hàm cho hàm set?</strong><br>Đáp: Khi state sau phụ thuộc state trước — bộ đếm, bật/tắt, thêm vào mảng. <code>setCount(c =&gt; c + 1)</code> đọc từ hàng đợi, nên nhiều cập nhật trong một sự kiện đều được tính và không bao giờ dùng giá trị cũ bị closure giữ lại.</p>
<p><strong>Hỏi: Batching là gì?</strong><br>Đáp: React gom các cập nhật state trong một sự kiện (và từ React 18, cả trong timeout và promise) rồi render một lần ở cuối. Tôi đã đo bằng <code>&lt;Profiler&gt;</code>: hai lời gọi set trong một cú click ra đúng một commit.</p>
</div>

<h3>Chạy thử từng bước: state đầu tiên của bạn</h3>
<ol>
<li>Trong dự án Vite + React + TS (Mục 0), tạo <code>src/vi-du/BoDem.tsx</code> theo bản "biến thường" ở trên. Vẽ nó trong <code>App.tsx</code>, mở console của trình duyệt, bấm ba lần. Ghi lại: console 1, 2, 3; màn hình 0.</li>
<li>Thay biến bằng <code>const [soLuot, setSoLuot] = useState(0)</code>. Bấm ba lần: màn hình chạy theo.</li>
<li>Thêm <code>console.log('render', soLuot)</code> ở đầu thân component. Ở chế độ dev bạn sẽ thấy mỗi dòng in <strong>hai lần</strong> mỗi cú bấm — đó là StrictMode gọi component hai lần để bắt chỗ không thuần, không phải bug của bạn (xem thêm ở 2.3).</li>
<li>Thêm nút "+3 (viết sai)". Đoán, bấm, so sánh. Rồi đổi sang dạng hàm cập nhật và đoán lại.</li>
<li>Viết test: <code>render(&lt;BoDem /&gt;)</code>, <code>await user.click(…)</code> ba lần, <code>expect(nut).toHaveTextContent('Đã đặt 3 lượt')</code>. Chạy <code>npx vitest run</code>. Muốn thấy dòng <code>console.info</code> của test đã qua, thêm <code>--reporter=verbose</code>: với reporter mặc định của Vitest 5, trên máy dựng bài các dòng đó không hiện ra.</li>
</ol>
${out(OUT.bai1Verbose)}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> phòng khám muốn một bộ đếm "số người đang chờ" ở quầy lễ tân, có nút "+1", "+5" và "Đặt lại".</p><ol>
<li>Dựng <code>HangCho</code> với một state. "+1" dùng hàm cập nhật; "+5" gọi hàm cập nhật năm lần trong vòng lặp (<code>for (let i = 0; i &lt; 5; i++)</code>); "Đặt lại" đặt 0.</li>
<li>Thêm một nút cố ý sai "+5 (sai)" gọi <code>setSo(so + 1)</code> năm lần. Ghi ra điều bạn đoán trước khi bấm.</li>
<li>Trong test, bọc component bằng <code>&lt;Profiler id="hang-cho" onRender={…}&gt;</code> và đếm số commit cho một cú bấm "+5".</li>
<li>Gõ kiểu cho state để nó không thể thành chuỗi: thử <code>setSo('5')</code> và đọc lỗi <code>tsc</code>.</li>
</ol><p><strong>Đạt khi:</strong> một test Vitest chứng minh "+5" cộng 5 còn "+5 (sai)" cộng 1; test Profiler cho đúng một commit với một cú bấm "+5"; <code>npx tsc -b</code> sạch sau khi bạn xoá dòng <code>setSo('5')</code> (và bạn chép lại được lỗi nó đã báo).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">state (trạng thái)</span><span class="v">giá trị React giữ cho một thể hiện component giữa các lần render; đổi bằng hàm set thì React render lại</span></div>
<div class="kv"><span class="k">hook</span><span class="v">hàm bắt đầu bằng <code>use</code>, cắm component vào một tính năng của React; gọi ở cấp cao nhất, cùng thứ tự mọi lần</span></div>
<div class="kv"><span class="k">render (vẽ ra)</span><span class="v">React gọi component của bạn để lấy JSX; tự nó không đụng DOM</span></div>
<div class="kv"><span class="k">commit</span><span class="v">bước React áp những chỗ khác biệt vào DOM thật</span></div>
<div class="kv"><span class="k">snapshot (ảnh chụp)</span><span class="v">state cố định cho lần render nó thuộc về, kể cả trong handler do lần render đó tạo</span></div>
<div class="kv"><span class="k">updater function (hàm cập nhật)</span><span class="v"><code>setX(truoc =&gt; sau)</code>; được xếp hàng và chạy theo thứ tự ở lần render sau</span></div>
<div class="kv"><span class="k">batching (gộp cập nhật)</span><span class="v">nhiều cập nhật trong một sự kiện ra một lần render; tự động ở mọi nơi từ React 18</span></div>
<div class="kv"><span class="k">lazy initializer (khởi tạo lười)</span><span class="v"><code>useState(fn)</code>: React chỉ gọi <code>fn</code> ở lần render đầu</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Biến cục bộ bị đặt lại mỗi lần gọi và không báo gì cho React; <code>useState</code> giữ giá trị và lên lịch render lại.</li>
<li>"Render" là React gọi component của bạn; DOM chỉ bị đụng ở bước commit, và chỉ ở chỗ khác đi.</li>
<li>State là ảnh chụp: sau <code>setX</code>, biến bạn đang cầm vẫn là giá trị cũ cho tới lần render sau.</li>
<li>Giá trị sau phụ thuộc giá trị trước → hàm cập nhật; nhiều hàm cập nhật trong một sự kiện đều được áp.</li>
<li>Cập nhật trong một sự kiện được gộp thành một lần render (đo được: 1 commit); đặt lại cùng giá trị thì bị bỏ qua, có thể sau một lần gọi thừa.</li>
<li>Hook được nhận ra theo thứ tự gọi: chỉ ở cấp cao nhất, không trong điều kiện — oxlint và React đều bắt được.</li>
</ul>

${LINK('https://react.dev/learn/state-a-components-memory', '📄', 'react.dev — State: A Component&#39;s Memory', 'Vì sao biến cục bộ không đủ, useState chạy thế nào, state tách biệt và riêng tư.')}
${LINK('https://react.dev/learn/render-and-commit', '📄', 'react.dev — Render and Commit', 'Trigger, render, commit: mỗi bước làm gì và khi nào trình duyệt vẽ.')}
${LINK('https://react.dev/learn/state-as-a-snapshot', '📄', 'react.dev — State as a Snapshot', 'Vì sao đặt state không đổi biến bạn đang cầm.')}
${LINK('https://react.dev/learn/queueing-a-series-of-state-updates', '📄', 'react.dev — Queueing a Series of State Updates', 'Batching, hàm cập nhật, trộn "thay" và "cập nhật" trong một hàng đợi.')}
${LINK('https://react.dev/reference/react/useState', '📄', 'react.dev — useState (tham khảo)', 'Lưu ý: bỏ qua theo Object.is, StrictMode gọi hai lần, khởi tạo lười, xử lý sự cố.')}
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Handling events: passing functions, bubbling, preventDefault and event types|||2.2 — Xử lý sự kiện: truyền hàm, nổi bọt, preventDefault và kiểu sự kiện',
      slug: 'rx-2-2-su-kien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'onClick nhận một hàm (lỗi tsc TS2322 và "Too many re-renders" thật), ba cách viết handler và truyền tham số, handler làm prop, sự kiện nổi bọt và stopPropagation, form tải lại trang (đo bằng Chromium thật), nút không ghi type, kiểu sự kiện TypeScript của React 19.3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Handling events: passing functions, bubbling, preventDefault and event types</h2>
<p class="lead">An event (sự kiện) is the user telling your app something: a click, a key, a submitted form. An <strong>event handler (hàm xử lý sự kiện)</strong> is a function you <em>give</em> React, so that React can call it later, when the event happens. Almost every beginner bug in this lesson comes from forgetting the word "later".</p>

<p>Lesson 2.1 used <code>onClick</code> without much ceremony. This lesson slows down: what exactly goes between the braces, how to pass a doctor&#39;s id to a handler, what happens when a button sits inside a clickable card, why a form without one line of code wipes your state, and which TypeScript type each handler receives in React 19.3. Every claim is backed by a test in <code>src/vi-du/bai2.test.tsx</code> or, for the page reload, by a real Chromium run.</p>

<h3>Give React a function — do not call it</h3>
${slide('rx-02', 9, 'onClick takes ONE FUNCTION — not the result of calling a function')}
<p>Look closely at the difference between <code>onClick={tang}</code> and <code>onClick={tang()}</code>. The first passes the function. The second <strong>calls</strong> the function right now, during render, and passes whatever it returns (here <code>undefined</code>) to <code>onClick</code>.</p>
${pre('tsx', SN.nutGoiNgay)}
<p>TypeScript sees it first. Without the <code>@ts-expect-error</code> line, <code>npx tsc -b</code> prints:</p>
${out(OUT.tsVoid)}
<p>"<code>void</code> is not assignable to <code>MouseEventHandler</code>" is TypeScript&#39;s way of saying "you gave me the <em>result</em> of a function that returns nothing, and I wanted a <em>function</em>". If you silence TypeScript and run it anyway, React stops the program:</p>
${out(OUT.tooMany)}
<p>The chain is: render calls <code>tang()</code> → <code>tang</code> calls <code>setDem</code> → React schedules a render → that render calls <code>tang()</code> again → … React cuts the loop and throws. If the handler does not set state (say <code>onClick={console.log('bấm')}</code>), there is no crash, just a quieter bug: the log appears once when the page loads and never when you click.</p>
${SD.goiNgayEn}
<div class="callout"><p><strong>JS quick reminder — arrow functions.</strong> <code>() =&gt; tang()</code> is a short way to write <code>function () { return tang(); }</code>. It creates a new function that, <em>when called</em>, calls <code>tang</code>. So <code>onClick={() =&gt; tang()}</code> passes a function (correct), while <code>onClick={tang()}</code> passes a result (wrong). If there is no parameter, the parentheses stay empty: <code>() =&gt; …</code>; with one parameter you may write <code>(e) =&gt; …</code> or <code>e =&gt; …</code>.</p></div>

<h3>Three ways to write a handler, and how to pass arguments</h3>
${slide('rx-02', 10, 'Passing arguments to a handler: wrap it in an arrow function')}
<p>All three forms below are correct, and the test <code>ba cách đúng đều gọi onChon đúng id</code> clicks each button and checks the ids received:</p>
${pre('tsx', SN.baCachDung)}
<p>Which to choose is a matter of reading comfort. A named function (form 1) is best when the handler has several lines or when you will pass it down as a prop. An inline arrow (form 2) is best for one line — especially when you need to pass an argument. Form 3 works, but nobody writes it in new code.</p>
<p><strong>Passing an argument</strong> is the everyday case: every card in the doctor list has a "Xem chi tiết" button, and the handler must know <em>which</em> doctor. You cannot write <code>onClick={onXemChiTiet(bacSi.id)}</code> — that is the "call it now" bug again. Wrap it: <code>onClick={() =&gt; onXemChiTiet(bacSi.id)}</code>. Each card creates its own little function that remembers its own <code>bacSi</code> (a closure, as in 2.1).</p>
<p><strong>Handlers as props.</strong> In the project the card does not decide what "view details" means; the parent does. So the card receives a function as a prop and simply calls it. Two naming conventions make this readable:</p>
<ul>
<li>A <strong>prop</strong> that receives a handler is named <code>onSomething</code>: <code>onXemChiTiet</code>, <code>onDoiYeuThich</code>, <code>onDoi</code>. It describes <em>what happened</em>, not what to do about it.</li>
<li>The <strong>function</strong> that handles it inside a component is conventionally <code>handleSomething</code>; this course writes it in Vietnamese, <code>xuLySomething</code> (<code>xuLyDoiYeuThich</code>, <code>xuLyGui</code>).</li>
</ul>
<p>And when the parent&#39;s handler is simply "set this state", you can pass the setter itself — <code>onXemChiTiet={setBacSiDangChonId}</code> — because it already has the right shape: it takes an id and stores it.</p>
${SD.handlerPropEn}
<p>One more difference from the component body: <strong>handlers do not need to be pure</strong>. They are exactly the place for side effects — setting state, sending a request, writing a log. React never calls your event handlers twice, even in StrictMode.</p>

<h3>Events bubble up</h3>
${slide('rx-02', 11, 'Events bubble from the button up to the parent card — stopPropagation stops them')}
<p>When you click a button, the click event first reaches the button, then its parent, then the parent&#39;s parent, all the way up — it <strong>bubbles (nổi bọt)</strong>. React follows the same rule. Imagine a doctor card that opens details when clicked anywhere, with a ♡ button inside it:</p>
${pre('tsx', SN.theCoNut)}
${out(OUT.lanTruyen)}
<p>Without <code>stopPropagation()</code>, one click on ♡ runs <em>both</em> handlers: the favourite is toggled and the details panel opens — almost never what the user meant. With <code>e.stopPropagation()</code> in the button&#39;s handler, the event stops there. Three details worth knowing:</p>
<ul>
<li>All React events bubble <strong>except <code>onScroll</code></strong>, which only fires on the element you attach it to.</li>
<li>If you ever need to see every click <em>before</em> the children handle it (analytics, closing a menu), React offers the capture phase: <code>onClickCapture</code> runs top-down before the normal handlers, even when a child stops propagation.</li>
<li>In the finished project the card itself is <em>not</em> clickable — it has two separate buttons. That is the simpler design: no propagation to manage, and both actions are real <code>&lt;button&gt;</code>s that keyboard users can reach. Reach for <code>stopPropagation</code> when the design really needs nested clickable areas.</li>
</ul>
${SD.noiBotEn}

<h3>Default behaviour: a form reloads the page</h3>
${slide('rx-02', 12, 'Submit reloads the page by default — preventDefault stops it')}
<p>Some events come with a built-in browser action. A click on a link navigates; submitting a form sends it to the server and <strong>loads a new page</strong>. In a React app that means your whole state is gone. To prove it rather than claim it, a Playwright script opened the demo page in a real Chromium, clicked a counter three times, typed "lan" into a search form that has <em>no</em> <code>preventDefault</code>, and pressed "Tìm":</p>
${out(OUT.formReload)}
<p>The <code>onSubmit</code> handler did run — and then the browser loaded the page again (load count 1 → 2), replaced the query string with the form&#39;s field (<code>?tu=lan</code>, because a form without <code>method</code> uses GET) and React started from zero: even the demo selected by <code>?bai=form</code> was lost. In the test environment, jsdom cannot navigate, so the same mistake only shows up as a line in the output:</p>
${out(OUT.formJsdom)}
<p>The fix is one line at the start of the handler:</p>
${pre('tsx', SN.formTim)}
<p>With <code>e.preventDefault()</code> the test <code>form có preventDefault</code> types <code>lan{Enter}</code> and checks that <code>onTim</code> received <code>"lan"</code>. Note two good habits in this form: the handler is on <code>&lt;form onSubmit&gt;</code>, not on the button&#39;s <code>onClick</code>, so pressing Enter in the input submits too; and the input has a <code>&lt;label&gt;</code>, which is what lets the test (and a screen reader) find it by the text "Từ khoá".</p>
<table>
<thead><tr><th></th><th>What it stops</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><code>e.preventDefault()</code></td><td>the browser&#39;s <strong>default action</strong> for this event</td><td>form submit, link navigation you handle yourself</td></tr>
<tr><td><code>e.stopPropagation()</code></td><td>the event <strong>travelling up</strong> to parents</td><td>a button inside a clickable card</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Trap — a button inside a form is a submit button unless you say otherwise.</strong> The HTML default for <code>&lt;button&gt;</code> without a <code>type</code> is <code>type="submit"</code>. Put a ♡ button inside a booking form and every click on it also submits the form. Measured with the component below:
${pre('tsx', SN.formCoNut)}
${out(OUT.typeNut)}
The ♡ click produced a form submit as well; the ♥ with <code>type="button"</code> did not. Every button in the project that is not meant to submit has <code>type="button"</code> — make it a habit, and you will not spend an afternoon on this in Chapter 3.</div>

<h3>Event types in TypeScript</h3>
${slide('rx-02', 13, 'Event types in TypeScript: get them right and e.target is typed')}
<p>When you write a handler inline in JSX, TypeScript already knows the type of <code>e</code> from the attribute and you do not need to write anything. You only write the type when you pull the handler out into its own function. The types come from <code>@types/react</code> (19.3.0 in this project):</p>
<table>
<thead><tr><th>Attribute</th><th>Handler receives</th></tr></thead>
<tbody>
<tr><td><code>onClick</code> on a button</td><td><code>MouseEvent&lt;HTMLButtonElement&gt;</code></td></tr>
<tr><td><code>onChange</code> on an input</td><td><code>ChangeEvent&lt;HTMLInputElement&gt;</code> — <code>e.target.value</code> is a <code>string</code></td></tr>
<tr><td><code>onKeyDown</code></td><td><code>KeyboardEvent&lt;HTMLInputElement&gt;</code> — compare <code>e.key === 'Escape'</code>, not the deprecated <code>keyCode</code></td></tr>
<tr><td><code>onSubmit</code> on a form</td><td><code>SubmitEvent&lt;HTMLFormElement&gt;</code></td></tr>
</tbody></table>
<p>A note for anyone copying older tutorials: they type form handlers as <code>FormEvent</code>. In <code>@types/react</code> 19.3 that type is marked <code>@deprecated FormEvent doesn&#39;t actually exist. You probably meant to use ChangeEvent, InputEvent, SubmitEvent, or just SyntheticEvent instead</code> — it still compiles, and your editor draws a line through it. Use <code>SubmitEvent</code> for <code>onSubmit</code> and <code>ChangeEvent</code> for <code>onChange</code>. All of these are <strong>synthetic events (sự kiện tổng hợp)</strong>: React&#39;s wrapper around the browser&#39;s native event, with the same main fields (<code>target</code>, <code>preventDefault</code>…) on every browser; the original is in <code>e.nativeEvent</code> if you ever need it.</p>
<p><strong><code>target</code> or <code>currentTarget</code>?</strong> <code>e.target</code> is the element the user actually hit; <code>e.currentTarget</code> is the element the handler is attached to. Click the bold name inside a clickable <code>div</code>:</p>
${pre('tsx', SN.dichVaGan)}
${out(OUT.target)}
<p><strong><code>onChange</code> fires on every keystroke.</strong> In plain DOM, the <code>change</code> event of a text input fires when you leave the field. React&#39;s <code>onChange</code> behaves like the DOM <code>input</code> event instead — once per change of value. Typing "Hà" in the component below logs two calls; Escape clears the field through <code>onKeyDown</code>:</p>
${pre('tsx', SN.oTimCoPhim)}
${out(OUT.onChange)}
<p>That per-keystroke behaviour is what makes the project&#39;s live search possible. It is also why typing Vietnamese with an IME (Unikey, the macOS Telex input) has its own gotchas — Chapter 3 measures them.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 class-component examples, a handler is a class method: <code>handleClick() { this.setState(…) }</code>, bound in the constructor with <code>this.handleClick = this.handleClick.bind(this)</code> and attached as <code>onClick={this.handleClick}</code>; forget the <code>bind</code> and the click throws <code>Cannot read properties of undefined (reading &#39;setState&#39;)</code> (reproduced in a test with a class component on React 19.3). Handlers in labs are often typed <code>e: any</code>, and forms are wired by hand with <code>onSubmit</code> + <code>preventDefault</code>. → At work: function components, so handlers are plain functions or inline arrows that close over state — nothing to bind; event parameters typed (<code>SubmitEvent&lt;HTMLFormElement&gt;</code>, <code>ChangeEvent&lt;HTMLInputElement&gt;</code>) or inferred inline; and real forms go through React Hook Form, which calls <code>preventDefault</code> for you (Chapter 3). · <em>Why:</em> no <code>this</code> means a whole class of bugs disappears, and typed events turn "undefined is not a function" at run time into a red line in the editor. The FER202 way still works, and you will read <code>.bind(this)</code> in older codebases.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What is the difference between <code>onClick={handle}</code> and <code>onClick={handle()}</code>?</strong><br>A: The first passes the function for React to call on click. The second calls it during render and passes its return value; if it sets state that is an infinite loop ("Too many re-renders"). To pass an argument, wrap it: <code>onClick={() =&gt; handle(id)}</code>.</p>
<p><strong>Q: <code>preventDefault</code> vs <code>stopPropagation</code>?</strong><br>A: <code>preventDefault</code> cancels the browser&#39;s default action — submitting a form, following a link. <code>stopPropagation</code> stops the event bubbling to parent handlers. They are independent; a form handler usually needs the first, a button inside a clickable card the second.</p>
<p><strong>Q: What is a synthetic event?</strong><br>A: React&#39;s cross-browser wrapper around the native event, passed to every handler. It has the usual API (<code>target</code>, <code>preventDefault</code>, <code>stopPropagation</code>) and the native event in <code>nativeEvent</code>. Under the hood React attaches its listeners at the root of the app, which is why <code>e.currentTarget</code> can differ from <code>e.nativeEvent.currentTarget</code>.</p>
</div>

<h3>Run it step by step: a card with two actions</h3>
<ol>
<li>Create a <code>TheThu</code> component: an <code>&lt;article onClick={() =&gt; ghi('the')}&gt;</code> with a doctor&#39;s name and a <code>&lt;button type="button"&gt;♡&lt;/button&gt;</code> inside.</li>
<li>Give the button <code>onClick={() =&gt; ghi('nut')}</code>, render it, click ♡, and log what happened (a <code>console.log</code> or an array in a test). You should see <code>nut</code> then <code>the</code>.</li>
<li>Change the button&#39;s handler to <code>(e) =&gt; { e.stopPropagation(); ghi('nut'); }</code>. Click again: only <code>nut</code>. Hover over <code>e</code> in your editor and read its type.</li>
<li>Wrap both in a <code>&lt;form onSubmit={…}&gt;</code> and delete <code>type="button"</code>. Click ♡ and watch the form submit. Put <code>type="button"</code> back.</li>
<li>Write a Vitest test for the final version and run it with <code>npx vitest run --reporter=verbose</code>:</li>
</ol>
${out(OUT.bai2Verbose)}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the reception desk wants a quick search box: type a name, press Enter or click "Tìm", see how many doctors match. Escape clears it.</p><ol>
<li>Build <code>TimNhanh</code> with a <code>&lt;form&gt;</code>, a labelled input ("Tên bác sĩ"), and a submit button. Keep the typed text in state (<code>onChange</code>), and a second state <code>daTim</code> set in <code>onSubmit</code>.</li>
<li>Type the submit handler as a separate function with <code>SubmitEvent&lt;HTMLFormElement&gt;</code>, call <code>preventDefault()</code> first.</li>
<li>Add <code>onKeyDown</code> on the input: Escape empties both states.</li>
<li>Show "Tìm thấy N bác sĩ" using <code>locBacSi</code> from the project on the <em>submitted</em> text.</li>
</ol><p><strong>Done when:</strong> a test types <code>lan{Enter}</code> and sees "Tìm thấy 1 bác sĩ"; a second test clicks the button instead of pressing Enter and gets the same result; a third presses <code>{Escape}</code> and the input has value <code>''</code>; <code>npx tsc -b</code> is clean and nowhere in your code is there an <code>any</code> or a <code>FormEvent</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">event handler (hàm xử lý sự kiện)</span><span class="v">a function you pass to React (<code>onClick={f}</code>) for it to call when the event happens</span></div>
<div class="kv"><span class="k">bubbling (nổi bọt)</span><span class="v">an event travels from the element that was hit up through its parents</span></div>
<div class="kv"><span class="k"><code>stopPropagation()</code></span><span class="v">stops the event from reaching parent handlers</span></div>
<div class="kv"><span class="k"><code>preventDefault()</code></span><span class="v">cancels the browser&#39;s default action (form submit, link navigation)</span></div>
<div class="kv"><span class="k">capture phase</span><span class="v"><code>onClickCapture</code>: runs top-down before normal handlers</span></div>
<div class="kv"><span class="k">synthetic event (sự kiện tổng hợp)</span><span class="v">React&#39;s cross-browser wrapper; the native one is <code>e.nativeEvent</code></span></div>
<div class="kv"><span class="k"><code>target</code> / <code>currentTarget</code></span><span class="v">the element hit / the element the handler is attached to</span></div>
<div class="kv"><span class="k"><code>onXxx</code> prop</span><span class="v">naming convention for a handler passed down from a parent</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pass a function (<code>onClick={f}</code> or <code>onClick={() =&gt; f(id)}</code>); <code>onClick={f()}</code> runs during render — tsc error TS2322, and "Too many re-renders" if it sets state.</li>
<li>Handlers may have side effects; name handler props <code>onXxx</code> and handler functions <code>handleXxx</code>/<code>xuLyXxx</code>.</li>
<li>Events bubble to parents (except <code>onScroll</code>); <code>stopPropagation</code> stops that, <code>onClickCapture</code> sees events first.</li>
<li>A form without <code>preventDefault</code> reloads the page in a real browser and wipes all state (measured: load 1 → 2).</li>
<li>A <code>&lt;button&gt;</code> inside a form defaults to <code>type="submit"</code>; write <code>type="button"</code> on every other button.</li>
<li>Types: <code>MouseEvent</code>, <code>ChangeEvent</code>, <code>KeyboardEvent</code>, <code>SubmitEvent</code> — <code>FormEvent</code> is deprecated in @types/react 19.3; <code>onChange</code> fires per keystroke.</li>
</ul>

${LINK('https://react.dev/learn/responding-to-events', '📄', 'react.dev — Responding to Events', 'Adding handlers, passing them as props, naming, propagation, capture phase, preventDefault.')}
${LINK('https://react.dev/reference/react-dom/components/common', '📄', 'react.dev — Common components (event handlers)', 'Every event prop and the fields of the React event object.')}
${LINK('https://react.dev/reference/react-dom/components/form', '📄', 'react.dev — &lt;form&gt;', 'Form submission in React 19, including the action prop you will meet in Chapter 12.')}
${LINK('https://react.dev/reference/react-dom/components/input', '📄', 'react.dev — &lt;input&gt;', 'Controlled inputs and why onChange fires on every keystroke.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Xử lý sự kiện: truyền hàm, nổi bọt, preventDefault và kiểu sự kiện</h2>
<p class="lead">Sự kiện (event) là lúc người dùng nói với ứng dụng một điều gì đó: một cú bấm, một phím, một form được gửi. <strong>Hàm xử lý sự kiện (event handler)</strong> là một hàm bạn <em>đưa</em> cho React, để React gọi nó <em>sau này</em>, khi sự kiện xảy ra. Gần như mọi bug của người mới trong bài này đến từ việc quên chữ "sau này".</p>

<p>Bài 2.1 dùng <code>onClick</code> khá qua loa. Bài này đi chậm lại: đúng ra thứ gì nằm giữa cặp ngoặc nhọn, làm sao đưa id bác sĩ cho handler, chuyện gì xảy ra khi một nút nằm trong một thẻ bấm được, vì sao một form thiếu đúng một dòng mã xoá sạch state của bạn, và mỗi handler nhận kiểu TypeScript nào trong React 19.3. Mọi khẳng định đều có test trong <code>src/vi-du/bai2.test.tsx</code>, riêng chuyện tải lại trang thì có một lần chạy Chromium thật.</p>

<h3>Đưa cho React một hàm — đừng gọi nó</h3>
${slide('rx-02', 9, 'onClick nhận MỘT HÀM — không nhận kết quả của việc gọi hàm')}
<p>Nhìn kỹ khác biệt giữa <code>onClick={tang}</code> và <code>onClick={tang()}</code>. Cái đầu đưa hàm. Cái sau <strong>gọi</strong> hàm ngay bây giờ, trong lúc render, rồi đưa thứ nó trả về (ở đây là <code>undefined</code>) cho <code>onClick</code>.</p>
${pre('tsx', SN.nutGoiNgay)}
<p>TypeScript thấy trước. Bỏ dòng <code>@ts-expect-error</code> đi, <code>npx tsc -b</code> in:</p>
${out(OUT.tsVoid)}
<p>"<code>void</code> không gán được cho <code>MouseEventHandler</code>" là cách TypeScript nói "bạn đưa tôi <em>kết quả</em> của một hàm không trả gì, trong khi tôi cần một <em>hàm</em>". Bịt miệng TypeScript rồi vẫn chạy, React dừng chương trình:</p>
${out(OUT.tooMany)}
<p>Chuỗi sự việc: render gọi <code>tang()</code> → <code>tang</code> gọi <code>setDem</code> → React lên lịch render → lần render đó lại gọi <code>tang()</code> → … React cắt vòng lặp và ném lỗi. Nếu handler không đặt state (ví dụ <code>onClick={console.log('bấm')}</code>) thì không sập, chỉ là một bug lặng lẽ hơn: dòng log hiện một lần lúc trang tải và không bao giờ hiện khi bạn bấm.</p>
${SD.goiNgayVi}
<div class="callout"><p><strong>JS nhắc nhanh — arrow function (hàm mũi tên).</strong> <code>() =&gt; tang()</code> là cách viết gọn của <code>function () { return tang(); }</code>. Nó tạo một hàm MỚI, hàm này <em>khi được gọi</em> thì mới gọi <code>tang</code>. Vậy <code>onClick={() =&gt; tang()}</code> đưa một hàm (đúng), còn <code>onClick={tang()}</code> đưa một kết quả (sai). Không có tham số thì để ngoặc trống: <code>() =&gt; …</code>; một tham số thì viết <code>(e) =&gt; …</code> hoặc <code>e =&gt; …</code>.</p></div>

<h3>Ba cách viết handler, và cách truyền tham số</h3>
${slide('rx-02', 10, 'Truyền tham số cho handler: bọc trong một arrow function')}
<p>Cả ba dạng dưới đều đúng; test <code>ba cách đúng đều gọi onChon đúng id</code> bấm từng nút và kiểm id nhận được:</p>
${pre('tsx', SN.baCachDung)}
<p>Chọn dạng nào là chuyện dễ đọc. Hàm có tên (dạng 1) hợp khi handler dài vài dòng hoặc khi bạn sẽ đưa nó xuống làm prop. Arrow viết tại chỗ (dạng 2) hợp cho một dòng — nhất là khi cần truyền tham số. Dạng 3 chạy được, nhưng mã mới không ai viết thế.</p>
<p><strong>Truyền tham số</strong> là chuyện hằng ngày: mỗi thẻ trong danh sách bác sĩ có một nút "Xem chi tiết", và handler phải biết <em>bác sĩ nào</em>. Bạn không viết được <code>onClick={onXemChiTiet(bacSi.id)}</code> — lại là bug "gọi ngay". Bọc nó lại: <code>onClick={() =&gt; onXemChiTiet(bacSi.id)}</code>. Mỗi thẻ tạo một hàm nhỏ của riêng nó, nhớ đúng <code>bacSi</code> của nó (closure, như ở 2.1).</p>
<p><strong>Handler làm prop.</strong> Trong dự án, thẻ không tự quyết "xem chi tiết" nghĩa là gì; cha quyết. Nên thẻ nhận một hàm qua prop và chỉ việc gọi. Hai quy ước đặt tên giúp dễ đọc:</p>
<ul>
<li><strong>Prop</strong> nhận handler đặt tên <code>onXxx</code>: <code>onXemChiTiet</code>, <code>onDoiYeuThich</code>, <code>onDoi</code>. Nó tả <em>chuyện gì đã xảy ra</em>, không tả phải làm gì.</li>
<li><strong>Hàm</strong> xử lý bên trong component theo quy ước là <code>handleXxx</code>; khoá này viết bằng tiếng Việt, <code>xuLyXxx</code> (<code>xuLyDoiYeuThich</code>, <code>xuLyGui</code>).</li>
</ul>
<p>Và khi handler của cha chỉ là "đặt state này", bạn đưa thẳng hàm set — <code>onXemChiTiet={setBacSiDangChonId}</code> — vì nó đã đúng hình dạng: nhận một id và cất lại.</p>
${SD.handlerPropVi}
<p>Thêm một khác biệt với thân component: <strong>handler không cần thuần</strong>. Nó chính là chỗ dành cho tác dụng phụ — đặt state, gửi request, ghi log. React không bao giờ gọi handler của bạn hai lần, kể cả trong StrictMode.</p>

<h3>Sự kiện nổi bọt</h3>
${slide('rx-02', 11, 'Sự kiện nổi bọt từ nút lên thẻ cha — stopPropagation chặn lại')}
<p>Khi bạn bấm một nút, sự kiện click tới nút trước, rồi tới cha của nó, rồi cha của cha, cứ thế đi lên — nó <strong>nổi bọt (bubble)</strong>. React theo đúng luật đó. Hình dung một thẻ bác sĩ bấm vào đâu cũng mở chi tiết, bên trong có nút ♡:</p>
${pre('tsx', SN.theCoNut)}
${out(OUT.lanTruyen)}
<p>Không có <code>stopPropagation()</code>, một cú bấm ♡ chạy <em>cả hai</em> handler: yêu thích được bật và khung chi tiết cũng mở — gần như chẳng bao giờ là ý người dùng. Có <code>e.stopPropagation()</code> trong handler của nút, sự kiện dừng ở đó. Ba chi tiết đáng biết:</p>
<ul>
<li>Mọi sự kiện React đều nổi bọt <strong>trừ <code>onScroll</code></strong> — nó chỉ chạy trên đúng phần tử bạn gắn.</li>
<li>Khi cần thấy mọi cú bấm <em>trước</em> khi con xử lý (thống kê, đóng menu), React có pha bắt (capture): <code>onClickCapture</code> chạy từ trên xuống trước các handler thường, kể cả khi con đã chặn nổi bọt.</li>
<li>Trong dự án hoàn chỉnh, bản thân thẻ <em>không</em> bấm được — nó có hai nút riêng. Thiết kế đó đơn giản hơn: không có nổi bọt nào phải quản, và cả hai hành động đều là <code>&lt;button&gt;</code> thật mà người dùng bàn phím tới được. Chỉ dùng <code>stopPropagation</code> khi thiết kế thật sự cần vùng bấm lồng nhau.</li>
</ul>
${SD.noiBotVi}

<h3>Hành vi mặc định: form tải lại trang</h3>
${slide('rx-02', 12, 'Submit mặc định tải lại trang — preventDefault chặn')}
<p>Một số sự kiện đi kèm hành động có sẵn của trình duyệt. Bấm link thì chuyển trang; gửi form thì gửi lên server và <strong>tải một trang mới</strong>. Trong ứng dụng React, điều đó nghĩa là toàn bộ state của bạn mất sạch. Để chứng minh thay vì chỉ nói, một script Playwright mở trang ví dụ trong Chromium thật, bấm bộ đếm ba lần, gõ "lan" vào một form tìm kiếm <em>không</em> có <code>preventDefault</code>, rồi bấm "Tìm":</p>
${out(OUT.formReload)}
<p>Handler <code>onSubmit</code> có chạy — rồi trình duyệt tải lại trang (số lần tải 1 → 2), thay chuỗi truy vấn bằng trường của form (<code>?tu=lan</code>, vì form không ghi <code>method</code> thì dùng GET) và React bắt đầu lại từ số không: đến cả ví dụ được chọn bằng <code>?bai=form</code> cũng mất. Trong môi trường test, jsdom không chuyển trang được, nên cùng lỗi đó chỉ hiện thành một dòng trong output:</p>
${out(OUT.formJsdom)}
<p>Cách sửa là một dòng ở đầu handler:</p>
${pre('tsx', SN.formTim)}
<p>Có <code>e.preventDefault()</code>, test <code>form có preventDefault</code> gõ <code>lan{Enter}</code> và kiểm <code>onTim</code> nhận được <code>"lan"</code>. Để ý hai thói quen tốt trong form này: handler gắn ở <code>&lt;form onSubmit&gt;</code>, không ở <code>onClick</code> của nút, nên nhấn Enter trong ô cũng gửi được; và ô nhập có <code>&lt;label&gt;</code> — nhờ vậy test (và trình đọc màn hình) tìm được nó bằng chữ "Từ khoá".</p>
<table>
<thead><tr><th></th><th>Chặn cái gì</th><th>Hay dùng khi</th></tr></thead>
<tbody>
<tr><td><code>e.preventDefault()</code></td><td><strong>hành động mặc định</strong> của trình duyệt cho sự kiện này</td><td>gửi form, chuyển link mà bạn tự xử lý</td></tr>
<tr><td><code>e.stopPropagation()</code></td><td>sự kiện <strong>đi lên</strong> tới cha</td><td>nút nằm trong một thẻ bấm được</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Bẫy — nút trong form là nút gửi, trừ khi bạn nói khác.</strong> Mặc định của HTML cho <code>&lt;button&gt;</code> không ghi <code>type</code> là <code>type="submit"</code>. Đặt một nút ♡ trong form đặt lịch, và mỗi lần bấm nó cũng gửi luôn form. Đo bằng component dưới:
${pre('tsx', SN.formCoNut)}
${out(OUT.typeNut)}
Cú bấm ♡ sinh thêm một lần gửi form; nút ♥ có <code>type="button"</code> thì không. Mọi nút trong dự án không dùng để gửi đều có <code>type="button"</code> — biến nó thành thói quen, và bạn sẽ không mất một buổi chiều vì nó ở Chương 3.</div>

<h3>Kiểu sự kiện trong TypeScript</h3>
${slide('rx-02', 13, 'Kiểu sự kiện trong TypeScript: gõ đúng thì e.target có kiểu')}
<p>Viết handler ngay trong JSX thì TypeScript đã biết kiểu của <code>e</code> từ thuộc tính, bạn không cần ghi gì. Chỉ ghi kiểu khi tách handler ra thành hàm riêng. Các kiểu đến từ <code>@types/react</code> (19.3.0 trong dự án này):</p>
<table>
<thead><tr><th>Thuộc tính</th><th>Handler nhận</th></tr></thead>
<tbody>
<tr><td><code>onClick</code> của button</td><td><code>MouseEvent&lt;HTMLButtonElement&gt;</code></td></tr>
<tr><td><code>onChange</code> của input</td><td><code>ChangeEvent&lt;HTMLInputElement&gt;</code> — <code>e.target.value</code> là <code>string</code></td></tr>
<tr><td><code>onKeyDown</code></td><td><code>KeyboardEvent&lt;HTMLInputElement&gt;</code> — so <code>e.key === 'Escape'</code>, đừng dùng <code>keyCode</code> đã lỗi thời</td></tr>
<tr><td><code>onSubmit</code> của form</td><td><code>SubmitEvent&lt;HTMLFormElement&gt;</code></td></tr>
</tbody></table>
<p>Một lưu ý cho ai chép từ bài hướng dẫn cũ: họ gõ kiểu handler của form là <code>FormEvent</code>. Trong <code>@types/react</code> 19.3, kiểu đó bị đánh dấu <code>@deprecated FormEvent doesn&#39;t actually exist. You probably meant to use ChangeEvent, InputEvent, SubmitEvent, or just SyntheticEvent instead</code> — vẫn biên dịch được, và editor gạch ngang nó. Dùng <code>SubmitEvent</code> cho <code>onSubmit</code> và <code>ChangeEvent</code> cho <code>onChange</code>. Tất cả đều là <strong>synthetic event (sự kiện tổng hợp)</strong>: lớp bọc của React quanh sự kiện gốc của trình duyệt, có cùng các trường chính (<code>target</code>, <code>preventDefault</code>…) trên mọi trình duyệt; sự kiện gốc nằm ở <code>e.nativeEvent</code> nếu bạn cần.</p>
<p><strong><code>target</code> hay <code>currentTarget</code>?</strong> <code>e.target</code> là phần tử người dùng bấm trúng; <code>e.currentTarget</code> là phần tử gắn handler. Bấm vào cái tên in đậm bên trong một <code>div</code> bấm được:</p>
${pre('tsx', SN.dichVaGan)}
${out(OUT.target)}
<p><strong><code>onChange</code> chạy mỗi lần gõ phím.</strong> Trong DOM thuần, sự kiện <code>change</code> của ô chữ chạy khi bạn rời ô. <code>onChange</code> của React thì giống sự kiện <code>input</code> của DOM — một lần cho mỗi lần giá trị đổi. Gõ "Hà" vào component dưới ghi hai lời gọi; phím Escape xoá ô qua <code>onKeyDown</code>:</p>
${pre('tsx', SN.oTimCoPhim)}
${out(OUT.onChange)}
<p>Chính hành vi mỗi-phím-một-lần này làm được ô tìm kiếm tức thì của dự án. Nó cũng là lý do gõ tiếng Việt bằng bộ gõ (Unikey, Telex của macOS) có những bẫy riêng — Chương 3 đo chúng.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong ví dụ class component của FER202, handler là một method của lớp: <code>handleClick() { this.setState(…) }</code>, bind trong constructor bằng <code>this.handleClick = this.handleClick.bind(this)</code> và gắn bằng <code>onClick={this.handleClick}</code>; quên <code>bind</code> là cú bấm ném lỗi <code>Cannot read properties of undefined (reading &#39;setState&#39;)</code> (đã tái hiện bằng test với class component trên React 19.3). Handler trong lab hay gõ <code>e: any</code>, và form được nối tay bằng <code>onSubmit</code> + <code>preventDefault</code>. → Đi làm: function component, nên handler là hàm thường hoặc arrow tại chỗ, tự nhớ state qua closure — không có gì để bind; tham số sự kiện có kiểu (<code>SubmitEvent&lt;HTMLFormElement&gt;</code>, <code>ChangeEvent&lt;HTMLInputElement&gt;</code>) hoặc được suy ra tại chỗ; và form thật đi qua React Hook Form, thư viện gọi <code>preventDefault</code> hộ bạn (Chương 3). · <em>Vì sao:</em> không có <code>this</code> là cả một nhóm bug biến mất, và sự kiện có kiểu biến lỗi "undefined is not a function" lúc chạy thành một vạch đỏ trong editor. Cách FER202 vẫn chạy, và bạn sẽ đọc thấy <code>.bind(this)</code> trong mã cũ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: <code>onClick={handle}</code> khác <code>onClick={handle()}</code> thế nào?</strong><br>Đáp: Cái đầu đưa hàm để React gọi khi click. Cái sau gọi hàm ngay lúc render và đưa giá trị trả về; nếu hàm đặt state thì thành vòng lặp vô hạn ("Too many re-renders"). Muốn truyền tham số thì bọc: <code>onClick={() =&gt; handle(id)}</code>.</p>
<p><strong>Hỏi: <code>preventDefault</code> và <code>stopPropagation</code> khác gì?</strong><br>Đáp: <code>preventDefault</code> huỷ hành động mặc định của trình duyệt — gửi form, theo link. <code>stopPropagation</code> chặn sự kiện nổi lên handler của cha. Hai việc độc lập; handler của form thường cần cái đầu, nút trong thẻ bấm được thường cần cái sau.</p>
<p><strong>Hỏi: Synthetic event là gì?</strong><br>Đáp: Lớp bọc chạy mọi trình duyệt của React quanh sự kiện gốc, được đưa cho mọi handler. Nó có API quen thuộc (<code>target</code>, <code>preventDefault</code>, <code>stopPropagation</code>) và sự kiện gốc ở <code>nativeEvent</code>. Bên dưới, React gắn listener ở gốc của ứng dụng, nên <code>e.currentTarget</code> có thể khác <code>e.nativeEvent.currentTarget</code>.</p>
</div>

<h3>Chạy thử từng bước: một thẻ có hai hành động</h3>
<ol>
<li>Tạo component <code>TheThu</code>: một <code>&lt;article onClick={() =&gt; ghi('the')}&gt;</code> chứa tên bác sĩ và một <code>&lt;button type="button"&gt;♡&lt;/button&gt;</code> bên trong.</li>
<li>Cho nút <code>onClick={() =&gt; ghi('nut')}</code>, render, bấm ♡, ghi lại chuyện xảy ra (bằng <code>console.log</code> hoặc một mảng trong test). Bạn sẽ thấy <code>nut</code> rồi <code>the</code>.</li>
<li>Đổi handler của nút thành <code>(e) =&gt; { e.stopPropagation(); ghi('nut'); }</code>. Bấm lại: chỉ còn <code>nut</code>. Rê chuột lên <code>e</code> trong editor và đọc kiểu của nó.</li>
<li>Bọc cả hai trong <code>&lt;form onSubmit={…}&gt;</code> và xoá <code>type="button"</code>. Bấm ♡ và nhìn form bị gửi. Đặt <code>type="button"</code> lại.</li>
<li>Viết test Vitest cho bản cuối và chạy <code>npx vitest run --reporter=verbose</code>:</li>
</ol>
${out(OUT.bai2Verbose)}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> quầy lễ tân muốn một ô tìm nhanh: gõ tên, nhấn Enter hoặc bấm "Tìm", thấy có bao nhiêu bác sĩ khớp. Escape thì xoá.</p><ol>
<li>Dựng <code>TimNhanh</code> gồm một <code>&lt;form&gt;</code>, một ô nhập có nhãn ("Tên bác sĩ") và một nút gửi. Giữ chữ đang gõ trong state (<code>onChange</code>), và một state thứ hai <code>daTim</code> đặt trong <code>onSubmit</code>.</li>
<li>Tách handler gửi thành hàm riêng có kiểu <code>SubmitEvent&lt;HTMLFormElement&gt;</code>, gọi <code>preventDefault()</code> đầu tiên.</li>
<li>Thêm <code>onKeyDown</code> cho ô nhập: Escape làm rỗng cả hai state.</li>
<li>Hiện "Tìm thấy N bác sĩ" bằng <code>locBacSi</code> của dự án trên chữ <em>đã gửi</em>.</li>
</ol><p><strong>Đạt khi:</strong> một test gõ <code>lan{Enter}</code> và thấy "Tìm thấy 1 bác sĩ"; test thứ hai bấm nút thay vì Enter và ra cùng kết quả; test thứ ba nhấn <code>{Escape}</code> và ô nhập có giá trị <code>''</code>; <code>npx tsc -b</code> sạch và trong mã của bạn không có chỗ nào <code>any</code> hay <code>FormEvent</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">event handler (hàm xử lý sự kiện)</span><span class="v">hàm bạn đưa cho React (<code>onClick={f}</code>) để nó gọi khi sự kiện xảy ra</span></div>
<div class="kv"><span class="k">bubbling (nổi bọt)</span><span class="v">sự kiện đi từ phần tử bị bấm lên qua các cha của nó</span></div>
<div class="kv"><span class="k"><code>stopPropagation()</code></span><span class="v">chặn sự kiện tới handler của cha</span></div>
<div class="kv"><span class="k"><code>preventDefault()</code></span><span class="v">huỷ hành động mặc định của trình duyệt (gửi form, chuyển link)</span></div>
<div class="kv"><span class="k">capture phase (pha bắt)</span><span class="v"><code>onClickCapture</code>: chạy từ trên xuống, trước các handler thường</span></div>
<div class="kv"><span class="k">synthetic event (sự kiện tổng hợp)</span><span class="v">lớp bọc chạy mọi trình duyệt của React; sự kiện gốc là <code>e.nativeEvent</code></span></div>
<div class="kv"><span class="k"><code>target</code> / <code>currentTarget</code></span><span class="v">phần tử bị bấm trúng / phần tử gắn handler</span></div>
<div class="kv"><span class="k">prop <code>onXxx</code></span><span class="v">quy ước đặt tên cho handler do cha đưa xuống</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đưa một hàm (<code>onClick={f}</code> hoặc <code>onClick={() =&gt; f(id)}</code>); <code>onClick={f()}</code> chạy lúc render — tsc báo TS2322, và "Too many re-renders" nếu nó đặt state.</li>
<li>Handler được phép có tác dụng phụ; prop nhận handler đặt tên <code>onXxx</code>, hàm xử lý đặt <code>handleXxx</code>/<code>xuLyXxx</code>.</li>
<li>Sự kiện nổi bọt lên cha (trừ <code>onScroll</code>); <code>stopPropagation</code> chặn lại, <code>onClickCapture</code> thấy sự kiện trước.</li>
<li>Form không có <code>preventDefault</code> tải lại trang trong trình duyệt thật và xoá sạch state (đo được: số lần tải 1 → 2).</li>
<li><code>&lt;button&gt;</code> trong form mặc định là <code>type="submit"</code>; mọi nút khác phải ghi <code>type="button"</code>.</li>
<li>Kiểu: <code>MouseEvent</code>, <code>ChangeEvent</code>, <code>KeyboardEvent</code>, <code>SubmitEvent</code> — <code>FormEvent</code> đã deprecated trong @types/react 19.3; <code>onChange</code> chạy mỗi phím.</li>
</ul>

${LINK('https://react.dev/learn/responding-to-events', '📄', 'react.dev — Responding to Events', 'Gắn handler, đưa handler làm prop, đặt tên, nổi bọt, pha bắt, preventDefault.')}
${LINK('https://react.dev/reference/react-dom/components/common', '📄', 'react.dev — Common components (event handler)', 'Mọi prop sự kiện và các trường của đối tượng sự kiện React.')}
${LINK('https://react.dev/reference/react-dom/components/form', '📄', 'react.dev — &lt;form&gt;', 'Gửi form trong React 19, gồm cả prop action bạn sẽ gặp ở Chương 12.')}
${LINK('https://react.dev/reference/react-dom/components/input', '📄', 'react.dev — &lt;input&gt;', 'Input được kiểm soát và vì sao onChange chạy mỗi lần gõ phím.')}
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Updating objects and arrays immutably: Object.is, spread, toSorted and Immer|||2.3 — Cập nhật object và mảng bất biến: Object.is, spread, toSorted và Immer',
      slug: 'rx-2-3-object-array',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao sửa thẳng object/mảng trong state không làm màn hình đổi (Object.is), "bug ma" hiện ra ở chỗ khác, spread từng tầng cho object lồng, bảng phương thức mảng sửa gốc/trả mới, sort() trong render, StrictMode gọi updater hai lần (đo 1→3→5→7), và Immer — tất cả chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Updating objects and arrays immutably: Object.is, spread, toSorted and Immer</h2>
<p class="lead">So far every state was a number or a string. Real screens keep objects (a patient, an appointment) and arrays (favourites, a list of doctors) in state. The rule for them fits in one sentence — <strong>treat anything in state as read-only, and replace it with a new copy</strong> — but the reasons, and the ways it goes wrong, deserve a whole lesson.</p>

<p>We start with the mistake everyone makes, measure what it does (including a "ghost" that appears only later), learn the spread syntax that fixes it, apply it to nested objects and arrays, and finish with two safety nets: React&#39;s StrictMode, which exposes one kind of mutation in development, and the Immer library, which lets you write the "mutating" version safely. All code is in <code>src/vi-du/bai3*.ts(x)</code> of the chapter project; all outputs are from its test run.</p>

<h3>Why changing an object in place does nothing</h3>
${slide('rx-02', 14, 'Mutating an object: Object.is sees "no change" (real screenshot)')}
<p>A patient record in state, and a button that changes the name the "obvious" way:</p>
${pre('tsx', SN.suaTrucTiep)}
<p>Click "Đổi tên (sai)". Nothing happens on screen. To understand why, you need one fact about JavaScript and one about React.</p>
<p><strong>JavaScript: objects are held by reference.</strong> A variable does not contain an object; it contains an arrow pointing at one. Copying the variable copies the arrow, not the object. The six lines below were run with Node 22:</p>
${pre('js', OUT.objectIsCode)}
${out(OUT.objectIs)}
<p>Numbers and strings compare by value (3 is 3). Objects compare by identity: <code>a</code> and <code>b</code> are the <em>same</em> object — changing <code>b.hoTen</code> changed <code>a.hoTen</code> too — while <code>c</code>, built with spread, is a <em>different</em> object even though its fields look identical. Two empty objects are two different objects.</p>
<p><strong>React: it compares state with <code>Object.is</code>.</strong> When you call <code>setBn(x)</code>, React checks <code>Object.is(oldState, x)</code>. In the buggy handler, <code>bn</code> was changed in place and then passed back — the old state and the "new" state are the same object, so the answer is <code>true</code>, "nothing changed", and React skips the render (the bail-out you measured in 2.1). React is not being lazy; it is doing exactly what you asked, cheaply. Comparing by identity is what lets React decide in one step whether anything changed, instead of walking through every field of every object.</p>
${SD.objectIsEn}

<h3>The ghost: a bug that shows up somewhere else</h3>
${slide('rx-02', 15, 'The ghost bug: mutate now, and a DIFFERENT state change reveals it')}
<p>It gets worse. The data in memory <em>was</em> changed. The screen is simply out of date — until anything else makes the component render. The test clicks "Đổi tên (sai)", records the name, then clicks an unrelated button ("Việc khác") that changes another piece of state:</p>
${out(OUT.suaThang)}
<p>After the first click the screen still says Nguyễn Văn A. After the unrelated click it suddenly says Trần Thị B — the old change "arrived" with somebody else&#39;s render. In a real app that "somebody else" might be a timer, a notification or a network response, minutes later, in a different component. That is why mutation bugs are so expensive to find: the symptom appears at a different place and time from the cause. The second line of the output is the same disease with an array: <code>ds.push(x); setDs(ds)</code> — two clicks, still "1 yêu thích", because it is still the same array.</p>
${pre('tsx', SN.themSai)}
${SD.bongMaEn}

<h3>Copying objects with spread</h3>
<p>The fix is to never touch the object in state and instead build a new one that has the change:</p>
${pre('tsx', SN.suaDung)}
<div class="callout"><p><strong>JS quick reminder — object spread.</strong> <code>{ ...bn }</code> creates a new object and copies every field of <code>bn</code> into it. Fields written after the spread override the copied ones: <code>{ ...bn, hoTen: 'Trần Thị B' }</code> means "everything from <code>bn</code>, but with this <code>hoTen</code>". Order matters: <code>{ hoTen: 'X', ...bn }</code> would let <code>bn.hoTen</code> overwrite your <code>'X'</code>. The same three dots work on arrays: <code>[...ds, 'bs-4']</code> is a new array with all items of <code>ds</code> and one more at the end.</p></div>
<p>Now <code>Object.is(old, new)</code> is <code>false</code>, React renders, and the screenshot on the slide shows the right card updated after a single click while the left one never moved. This way of working — never changing a value, only creating new ones — is called <strong>immutability (tính bất biến)</strong>. Besides making React notice changes, it has a bonus you will use in Chapters 8 and 12: because old objects are never altered, "did this change?" is always a cheap identity check, and an old version of the state is still around if you want to undo.</p>

<h3>Nested objects: spread every level on the way down</h3>
${slide('rx-02', 16, 'Nested objects: spread EVERY LEVEL down to what changes')}
<p>An appointment (<code>LichHen</code> from <code>src/types.ts</code>) contains a patient object. To change the patient&#39;s phone number you must create a new patient <em>and</em> a new appointment that points at it:</p>
${pre('ts', SN.doiSdt)}
${out(OUT.spread)}
<p>Both levels are new (<code>false</code>, <code>false</code>), and the old appointment still has the old number. Fields that did not change — <code>id</code>, <code>lyDo</code>, <code>hoTen</code> — are simply copied; their values are shared, which is fine because nobody will change them in place.</p>
${SD.longNhauEn}
<p>The classic trap is to think one spread copies everything. It does not: spread is a <strong>shallow copy (sao chép nông)</strong>. The outer object is new, but <code>benhNhan</code> inside it is the same object as before:</p>
${pre('ts', SN.testMotTang)}
${out(OUT.motTang)}
<p>Changing <code>saoChep.benhNhan.hoTen</code> changed <code>cu.benhNhan.hoTen</code> — they are one object. If you ever need a full independent copy, JavaScript has <code>structuredClone(x)</code>, but in React code you rarely want it: it copies <em>everything</em>, so every nested object gets a new identity and every component that receives one of them will see it as changed. Spreading just the path you change is both cheaper and more precise.</p>

<h3>Arrays: pick the methods that return a new array</h3>
${slide('rx-02', 17, 'Arrays: use methods that return a NEW array, avoid the ones that change it')}
<p>JavaScript arrays have two families of methods, and nothing in the name tells you which is which. Some <strong>change the array</strong> they are called on; others <strong>return a new array</strong> and leave the original alone. In state you may only use the second family:</p>
<table>
<thead><tr><th>You want to</th><th>Avoid (changes the array)</th><th>Use (returns a new array)</th></tr></thead>
<tbody>
<tr><td>add</td><td><code>push</code>, <code>unshift</code></td><td><code>[...ds, x]</code>, <code>[x, ...ds]</code></td></tr>
<tr><td>remove</td><td><code>splice</code>, <code>pop</code>, <code>shift</code></td><td><code>ds.filter(…)</code></td></tr>
<tr><td>change one item</td><td><code>ds[i] = x</code></td><td><code>ds.map(…)</code></td></tr>
<tr><td>insert in the middle</td><td><code>splice</code></td><td><code>[...ds.slice(0, i), x, ...ds.slice(i)]</code></td></tr>
<tr><td>sort / reverse</td><td><code>sort</code>, <code>reverse</code></td><td><code>toSorted</code>, <code>toReversed</code> (or copy first: <code>[...ds].sort(…)</code>)</td></tr>
</tbody></table>
<p>The four everyday operations, run as a test:</p>
${pre('ts', SN.testBonPhep)}
${out(OUT.mang)}
<p>And the one that fools experienced developers — <code>sort</code> returns the array, so it <em>looks</em> like it returns a new one. It does not:</p>
${out(OUT.sort)}
<p><code>sort</code> returned the very same array <code>a</code>, now reordered; <code>toSorted</code> returned a new one and left <code>b</code> alone. <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> and <code>with</code> were added to JavaScript in ES2023; the Vite template&#39;s <code>tsconfig.app.json</code> already has <code>"lib": ["ES2023", "DOM"]</code>, which is why TypeScript accepted them here.</p>
<p><strong>Changing one object inside an array</strong> combines both techniques: <code>map</code> returns a new array, and only the matching item becomes a new object:</p>
${pre('ts', SN.doiKinhNghiem)}
${out(OUT.mapObj)}
<p>Item <code>bs-5</code> is a new object with 4 years; every other item is the <em>same</em> object as before (<code>moi[0] === cu[0]</code> is <code>true</code>). That sharing is not a problem — it is the point: in Chapter 8, a <code>memo</code>-wrapped card for <code>bs-1</code> can skip rendering precisely because its object did not change.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>sort()</code> inside render reorders someone else&#39;s data.</strong> A card list that shows "most experienced first" with <code>const sapXep = danhSach.sort(…)</code> looks harmless: it is not even touching state. But <code>danhSach</code> is a prop — in the project it is the shared <code>danhSachBacSi</code> array — and <code>sort</code> reorders it in place, for every other component that uses it, and it breaks the "render must be pure" rule from 2.1. Measured with two copies of the data:
${pre('tsx', SN.sapXep)}
${out(OUT.sortRender)}
After rendering the wrong version, the array that was passed in is permanently reordered. <code>toSorted</code> leaves it as it was.</div>

<h3>StrictMode: a development-only check that catches impure updaters</h3>
${slide('rx-02', 18, 'StrictMode calls updaters twice in development — to expose mutation')}
<p>The Vite template wraps your app in <code>&lt;StrictMode&gt;</code> in <code>main.tsx</code>. In development, StrictMode deliberately calls some of your functions twice — component bodies, initializers and <strong>updater functions</strong> — and keeps one result. If those functions are pure, calling them twice changes nothing. If they mutate, the second call makes the damage visible. Here is an updater that looks reasonable but mutates the old array before returning a copy:</p>
${pre('tsx', SN.updaterSai)}
${out(OUT.strict)}
<p>Under StrictMode the mutating updater grew the list 1 → 3 → 5 → 7: every click after the first added the item twice, because both calls pushed into the same old array. The pure version (<code>(cu) =&gt; [...cu, 'bs-4']</code>) grew 1 → 2 → 3 → 4, and so did the mutating version <em>without</em> StrictMode — which is exactly why the check exists: without it, the bug is invisible until some other code path runs the updater twice.</p>
<p>Two honest notes from measuring this. First, the react.dev reference describes the todo "added twice"; in our run the <em>first</em> click added only one. That is consistent with the bail-out behaviour from 2.1: when a component has no pending updates, React can compute the first update eagerly, outside the render, and does not repeat it. Second, while exploring, clicking another component between clicks also made the doubling disappear. So StrictMode is a <em>helper</em> that often exposes impure updaters, not a guarantee. The guarantee is writing updaters that return new values and change nothing. StrictMode double-calling happens only in development; production builds call everything once.</p>

<h3>Immer: write the mutation, get a new copy</h3>
${slide('rx-02', 19, 'Immer: write it as if you were mutating, receive a new copy')}
<p>Spreading three or four levels deep gets unreadable. The <strong>Immer</strong> library (11.1.18 at the time of writing) solves it differently: you get a <em>draft</em>, you change the draft with ordinary assignments, and Immer produces a new object that contains your changes — sharing everything you did not touch, exactly like careful spreading would:</p>
${pre('ts', SN.doiSdtImmer)}
<p>The test <code>Immer cho cùng kết quả</code> checks with <code>toEqual</code> that this gives the same result as the spread version above: green. Inside a component, <code>produce</code> with only a recipe returns an updater function, which fits straight into the setter:</p>
${pre('tsx', SN.suaImmer)}
<p>When is it worth it? For two levels, like <code>LichHen → benhNhan</code>, spread reads fine and costs no dependency. For deeply nested data, or a reducer with many cases (Chapter 5), Immer makes the code shorter and harder to get wrong. You have probably already used it without knowing: Redux Toolkit&#39;s <code>createSlice</code> runs your reducers through Immer, which is why "mutating" <code>state.items.push(x)</code> is allowed there and nowhere else. The chapter&#39;s demo project installed Immer (<code>npm install immer</code>) only to run these examples; the running project "An Tâm" does not need it.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 labs it is common to see <code>this.state.items.push(newItem); this.setState({ items: this.state.items })</code>, or, in a Redux reducer, <code>state.cart.push(item); return state;</code> — and then a lecture about why the screen did not update. The syllabus fix is usually <code>[...state.items, newItem]</code> and <code>Object.assign({}, state, {…})</code>. → At work the rule is the same, with better tools: spread and the non-mutating array methods (<code>map</code>, <code>filter</code>, <code>toSorted</code>) for simple cases; Immer for deep updates, usually indirectly through Redux Toolkit or a Zustand/Immer middleware; and ESLint/oxlint plus StrictMode to catch mistakes. · <em>Why:</em> identity comparison is how React, <code>memo</code>, TanStack Query and every state library decide what changed; mutating breaks all of them at once. <code>Object.assign({}, a, b)</code> is not wrong — it is what spread does — you will still read it in older code.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: Why must state be updated immutably in React?</strong><br>A: React decides whether state changed with <code>Object.is</code> — an identity check. Mutating an object and setting the same reference looks like "no change", so React skips the render; the mutated data then appears later, at a random render. Immutable updates also make change detection cheap for <code>memo</code> and let you keep previous versions.</p>
<p><strong>Q: Shallow copy vs deep copy?</strong><br>A: Spread copies one level: nested objects are still shared. For state I spread every level along the path I change, which keeps unchanged parts shared on purpose. A deep copy (<code>structuredClone</code>) gives everything a new identity, which is usually more work and makes every consumer think it changed.</p>
<p><strong>Q: How do you update one item in an array of objects?</strong><br>A: <code>list.map(x =&gt; x.id === id ? { ...x, field: value } : x)</code> — a new array, a new object for the matching item, the same objects for the rest.</p>
</div>

<h3>Run it step by step: a favourites list, done right</h3>
<ol>
<li>Create <code>DanhSachTim</code> with <code>const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([])</code> and a button per doctor.</li>
<li>First write the wrong handler: <code>yeuThich.push(id); setYeuThich(yeuThich);</code>. Click: nothing shows. Add another state (a counter) and click it: the favourites appear. You have reproduced the ghost.</li>
<li>Replace it with an updater that toggles immutably: <code>setYeuThich((cu) =&gt; cu.includes(id) ? cu.filter((x) =&gt; x !== id) : [...cu, id])</code>.</li>
<li>Move that expression into a pure function <code>doiYeuThich(ds, id)</code> in <code>src/logic/yeu-thich.ts</code> and test it without React: the new array is <code>not.toBe</code> the old one, and the old one is unchanged.</li>
<li>Run the suite. The chapter project&#39;s own run of <code>npx vitest run bai3 --reporter=verbose</code> ended with <code>Test Files 2 passed (2)</code>, <code>Tests 14 passed (14)</code>.</li>
</ol>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the reception desk edits an appointment before confirming it: change the reason, the patient&#39;s phone, and the status.</p><ol>
<li>Keep one <code>LichHen</code> in state (use the <code>LICH_HEN</code> sample shape). Write three pure functions: <code>doiLyDo(lh, lyDo)</code>, <code>doiSoDienThoai(lh, so)</code> (nested) and <code>xacNhan(lh)</code> that sets <code>trangThai: 'da-xac-nhan'</code>.</li>
<li>For each function write a test asserting: the result has the change; the input is unchanged; the result is <code>not.toBe</code> the input; and, for <code>doiLyDo</code>, <code>ketQua.benhNhan</code> <strong>is</strong> <code>toBe</code> the old <code>benhNhan</code> (shared on purpose).</li>
<li>Wire three buttons in a component, render under <code>&lt;StrictMode&gt;</code> in a test, click each once and check the screen.</li>
<li>Bonus: rewrite <code>doiSoDienThoai</code> with Immer and prove both versions are <code>toEqual</code>.</li>
</ol><p><strong>Done when:</strong> all tests pass with <code>npx vitest run</code>, <code>npx tsc -b</code> is clean, and you can explain in one sentence why the <code>benhNhan</code> identity check in step 2 passes for <code>doiLyDo</code> but would fail for <code>doiSoDienThoai</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mutation (đột biến)</span><span class="v">changing an existing object or array in place</span></div>
<div class="kv"><span class="k">immutability (tính bất biến)</span><span class="v">never changing values; creating new ones with the change</span></div>
<div class="kv"><span class="k">reference / identity</span><span class="v">objects are held by reference; two variables can point to one object</span></div>
<div class="kv"><span class="k"><code>Object.is</code></span><span class="v">React&#39;s equality check for state: same value for primitives, same object for objects</span></div>
<div class="kv"><span class="k">spread <code>...</code></span><span class="v">copies an object&#39;s fields or an array&#39;s items into a new one</span></div>
<div class="kv"><span class="k">shallow copy (sao chép nông)</span><span class="v">a copy of one level; nested objects are still shared</span></div>
<div class="kv"><span class="k"><code>toSorted</code> / <code>toReversed</code></span><span class="v">ES2023 methods that return a sorted/reversed copy</span></div>
<div class="kv"><span class="k">Immer / draft</span><span class="v">library that turns assignments on a draft into a new immutable object</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>React compares state with <code>Object.is</code>; mutating and setting the same object means "no change" — no render.</li>
<li>Mutation bugs surface later, on an unrelated render ("ghost"), which makes them hard to trace.</li>
<li>Replace instead of mutate: <code>{ ...obj, field }</code>, and spread every level on the path of a nested change.</li>
<li>Arrays: <code>[...ds, x]</code>, <code>filter</code>, <code>map</code>, <code>toSorted</code>; never <code>push</code>/<code>splice</code>/<code>sort</code> on state or props — not even in render.</li>
<li>StrictMode double-calls updaters in development and often exposes mutation (measured 1 → 3 → 5 → 7), but only pure updaters are a guarantee.</li>
<li>Immer lets you write assignments on a draft and get a new object; worth it for deep data, used inside Redux Toolkit.</li>
</ul>

${LINK('https://react.dev/learn/updating-objects-in-state', '📄', 'react.dev — Updating Objects in State', 'Treat state as read-only, spread, nested objects, and Immer.')}
${LINK('https://react.dev/learn/updating-arrays-in-state', '📄', 'react.dev — Updating Arrays in State', 'The avoid/prefer table, objects inside arrays, and Immer for arrays.')}
${LINK('https://react.dev/reference/react/useState', '📄', 'react.dev — useState: troubleshooting', '"I&#39;ve updated the state, but the screen doesn&#39;t update" and "My updater function runs twice".')}
${LINK('https://github.com/immerjs/immer', '🧰', 'Immer on GitHub', 'produce, drafts, and the curried form used with setState.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Cập nhật object và mảng bất biến: Object.is, spread, toSorted và Immer</h2>
<p class="lead">Tới giờ mọi state đều là số hoặc chuỗi. Màn hình thật giữ object (một bệnh nhân, một lịch hẹn) và mảng (danh sách yêu thích, danh sách bác sĩ) trong state. Luật cho chúng gói trong một câu — <strong>coi mọi thứ trong state là chỉ đọc, và thay nó bằng một bản mới</strong> — nhưng lý do, và những kiểu hỏng, đáng một bài riêng.</p>

<p>Ta bắt đầu từ lỗi ai cũng mắc, đo xem nó gây ra gì (kể cả một "bóng ma" chỉ hiện ra về sau), học cú pháp spread để sửa, áp nó cho object lồng nhau và mảng, rồi kết thúc bằng hai tấm lưới: StrictMode của React, thứ làm lộ một kiểu đột biến ở chế độ dev, và thư viện Immer, cho bạn viết kiểu "sửa thẳng" mà vẫn an toàn. Toàn bộ mã nằm trong <code>src/vi-du/bai3*.ts(x)</code> của dự án chương; toàn bộ output lấy từ lần chạy test của nó.</p>

<h3>Vì sao sửa thẳng object không làm gì cả</h3>
${slide('rx-02', 14, 'Sửa thẳng object: Object.is thấy “không đổi” (ảnh chụp thật)')}
<p>Một hồ sơ bệnh nhân trong state, và một nút đổi tên theo cách "hiển nhiên":</p>
${pre('tsx', SN.suaTrucTiep)}
<p>Bấm "Đổi tên (sai)". Trên màn hình không có gì xảy ra. Để hiểu vì sao, bạn cần một sự thật về JavaScript và một về React.</p>
<p><strong>JavaScript: object được giữ bằng tham chiếu.</strong> Một biến không chứa object; nó chứa một mũi tên trỏ tới object. Chép biến là chép mũi tên, không chép object. Sáu dòng dưới chạy bằng Node 22:</p>
${pre('js', OUT.objectIsCode)}
${out(OUT.objectIs)}
<p>Số và chuỗi so theo giá trị (3 là 3). Object so theo danh tính: <code>a</code> và <code>b</code> là <em>cùng một</em> object — sửa <code>b.hoTen</code> là sửa luôn <code>a.hoTen</code> — còn <code>c</code>, tạo bằng spread, là một object <em>khác</em> dù các field trông y hệt. Hai object rỗng là hai object khác nhau.</p>
<p><strong>React: nó so state bằng <code>Object.is</code>.</strong> Khi bạn gọi <code>setBn(x)</code>, React kiểm <code>Object.is(stateCu, x)</code>. Trong handler lỗi, <code>bn</code> bị sửa tại chỗ rồi được đưa lại — state cũ và state "mới" là cùng một object, nên câu trả lời là <code>true</code>, "không có gì đổi", và React bỏ qua lần render (chính cơ chế bỏ qua bạn đã đo ở 2.1). React không lười; nó làm đúng điều bạn yêu cầu, một cách rẻ. So theo danh tính là cách React quyết định trong một bước có gì đổi hay không, thay vì đi qua từng field của từng object.</p>
${SD.objectIsVi}

<h3>Bóng ma: bug hiện ra ở chỗ khác</h3>
${slide('rx-02', 15, 'Bug ma: sửa thẳng, rồi một state KHÁC làm giá trị sai hiện ra')}
<p>Còn tệ hơn. Dữ liệu trong bộ nhớ <em>đã</em> đổi. Màn hình chỉ là đang cũ — cho tới khi bất cứ thứ gì khác làm component render. Test bấm "Đổi tên (sai)", ghi lại tên, rồi bấm một nút chẳng liên quan ("Việc khác") đổi một mẩu state khác:</p>
${out(OUT.suaThang)}
<p>Sau cú bấm đầu, màn hình vẫn ghi Nguyễn Văn A. Sau cú bấm chẳng liên quan, nó bỗng ghi Trần Thị B — thay đổi cũ "tới nơi" nhờ lần render của người khác. Trong ứng dụng thật, "người khác" đó có thể là một bộ hẹn giờ, một thông báo hay một phản hồi mạng, vài phút sau, ở một component khác. Đó là lý do bug đột biến rất đắt để tìm: triệu chứng xuất hiện ở chỗ khác và lúc khác với nguyên nhân. Dòng thứ hai của output là cùng căn bệnh với mảng: <code>ds.push(x); setDs(ds)</code> — bấm hai lần, vẫn "1 yêu thích", vì vẫn là mảng cũ.</p>
${pre('tsx', SN.themSai)}
${SD.bongMaVi}

<h3>Chép object bằng spread</h3>
<p>Cách sửa là không bao giờ đụng vào object trong state, mà dựng một object mới mang thay đổi:</p>
${pre('tsx', SN.suaDung)}
<div class="callout"><p><strong>JS nhắc nhanh — spread object (trải object).</strong> <code>{ ...bn }</code> tạo một object mới và chép mọi field của <code>bn</code> vào. Field viết sau dấu spread ghi đè field được chép: <code>{ ...bn, hoTen: 'Trần Thị B' }</code> nghĩa là "mọi thứ của <code>bn</code>, nhưng <code>hoTen</code> là cái này". Thứ tự quan trọng: <code>{ hoTen: 'X', ...bn }</code> sẽ để <code>bn.hoTen</code> đè lên <code>'X'</code> của bạn. Ba dấu chấm cũng dùng được với mảng: <code>[...ds, 'bs-4']</code> là mảng mới có mọi phần tử của <code>ds</code> và thêm một cái ở cuối.</p></div>
<p>Giờ <code>Object.is(cũ, mới)</code> là <code>false</code>, React render, và ảnh chụp trên slide cho thấy thẻ bên phải đổi sau đúng một cú bấm còn thẻ bên trái không nhúc nhích. Cách làm này — không bao giờ đổi một giá trị, chỉ tạo giá trị mới — gọi là <strong>tính bất biến (immutability)</strong>. Ngoài việc giúp React nhận ra thay đổi, nó có một phần thưởng bạn sẽ dùng ở Chương 8 và 12: vì object cũ không bao giờ bị sửa, câu hỏi "cái này đổi chưa?" luôn là một phép so danh tính rẻ, và phiên bản cũ của state vẫn còn nếu bạn muốn hoàn tác.</p>

<h3>Object lồng nhau: spread mọi tầng trên đường đi xuống</h3>
${slide('rx-02', 16, 'Object lồng nhau: spread TỪNG TẦNG tới chỗ cần đổi')}
<p>Một lịch hẹn (<code>LichHen</code> trong <code>src/types.ts</code>) chứa một object bệnh nhân. Muốn đổi số điện thoại của bệnh nhân, bạn phải tạo một bệnh nhân mới <em>và</em> một lịch hẹn mới trỏ tới nó:</p>
${pre('ts', SN.doiSdt)}
${out(OUT.spread)}
<p>Cả hai tầng đều mới (<code>false</code>, <code>false</code>), và lịch hẹn cũ vẫn giữ số cũ. Những field không đổi — <code>id</code>, <code>lyDo</code>, <code>hoTen</code> — chỉ được chép sang; giá trị của chúng được dùng chung, và điều đó ổn vì không ai sửa chúng tại chỗ.</p>
${SD.longNhauVi}
<p>Bẫy kinh điển là nghĩ một lần spread chép được mọi thứ. Không: spread là <strong>sao chép nông (shallow copy)</strong>. Object ngoài là mới, nhưng <code>benhNhan</code> bên trong vẫn là object cũ:</p>
${pre('ts', SN.testMotTang)}
${out(OUT.motTang)}
<p>Sửa <code>saoChep.benhNhan.hoTen</code> là sửa luôn <code>cu.benhNhan.hoTen</code> — chúng là một object. Khi thật sự cần một bản sao độc lập hoàn toàn, JavaScript có <code>structuredClone(x)</code>, nhưng trong mã React bạn hiếm khi muốn nó: nó chép <em>tất cả</em>, nên mọi object lồng đều có danh tính mới và mọi component nhận một trong số đó đều thấy nó "đã đổi". Chỉ spread đúng con đường bạn đổi vừa rẻ hơn vừa chính xác hơn.</p>

<h3>Mảng: chọn phương thức trả về mảng mới</h3>
${slide('rx-02', 17, 'Mảng: dùng phương thức trả mảng MỚI, tránh sửa gốc')}
<p>Mảng JavaScript có hai họ phương thức, và tên của chúng không cho bạn biết họ nào. Một số <strong>sửa chính mảng</strong> nó được gọi trên; số khác <strong>trả về mảng mới</strong> và để nguyên mảng gốc. Với state bạn chỉ được dùng họ thứ hai:</p>
<table>
<thead><tr><th>Muốn</th><th>Tránh (sửa mảng gốc)</th><th>Dùng (trả mảng mới)</th></tr></thead>
<tbody>
<tr><td>thêm</td><td><code>push</code>, <code>unshift</code></td><td><code>[...ds, x]</code>, <code>[x, ...ds]</code></td></tr>
<tr><td>bỏ</td><td><code>splice</code>, <code>pop</code>, <code>shift</code></td><td><code>ds.filter(…)</code></td></tr>
<tr><td>sửa một phần tử</td><td><code>ds[i] = x</code></td><td><code>ds.map(…)</code></td></tr>
<tr><td>chèn vào giữa</td><td><code>splice</code></td><td><code>[...ds.slice(0, i), x, ...ds.slice(i)]</code></td></tr>
<tr><td>sắp xếp / đảo</td><td><code>sort</code>, <code>reverse</code></td><td><code>toSorted</code>, <code>toReversed</code> (hoặc chép trước: <code>[...ds].sort(…)</code>)</td></tr>
</tbody></table>
<p>Bốn phép hằng ngày, chạy thành test:</p>
${pre('ts', SN.testBonPhep)}
${out(OUT.mang)}
<p>Và cái đánh lừa cả người có kinh nghiệm — <code>sort</code> trả về mảng, nên nó <em>trông như</em> trả mảng mới. Không phải:</p>
${out(OUT.sort)}
<p><code>sort</code> trả về đúng mảng <code>a</code>, giờ đã bị xếp lại; <code>toSorted</code> trả một mảng mới và để yên <code>b</code>. <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> và <code>with</code> được thêm vào JavaScript từ ES2023; <code>tsconfig.app.json</code> của template Vite đã có <code>"lib": ["ES2023", "DOM"]</code>, nên TypeScript chấp nhận chúng ở đây.</p>
<p><strong>Sửa một object bên trong mảng</strong> kết hợp cả hai kỹ thuật: <code>map</code> trả mảng mới, và chỉ phần tử khớp mới thành object mới:</p>
${pre('ts', SN.doiKinhNghiem)}
${out(OUT.mapObj)}
<p>Phần tử <code>bs-5</code> là object mới với 4 năm; mọi phần tử khác là <em>cùng</em> object như trước (<code>moi[0] === cu[0]</code> là <code>true</code>). Việc dùng chung đó không phải vấn đề — nó chính là mục đích: ở Chương 8, một thẻ bọc <code>memo</code> của <code>bs-1</code> bỏ qua được lần render chính vì object của nó không đổi.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>sort()</code> trong render xếp lại dữ liệu của người khác.</strong> Một danh sách thẻ hiện "nhiều kinh nghiệm nhất trước" bằng <code>const sapXep = danhSach.sort(…)</code> trông vô hại: nó còn chẳng đụng tới state. Nhưng <code>danhSach</code> là prop — trong dự án đó là mảng dùng chung <code>danhSachBacSi</code> — và <code>sort</code> xếp lại nó tại chỗ, cho mọi component khác đang dùng, đồng thời phá luật "render phải thuần" ở 2.1. Đo bằng hai bản chép của dữ liệu:
${pre('tsx', SN.sapXep)}
${out(OUT.sortRender)}
Sau khi render bản sai, mảng được truyền vào bị xếp lại vĩnh viễn. <code>toSorted</code> để nó nguyên như cũ.</div>

<h3>StrictMode: phép kiểm chỉ-ở-dev bắt updater không thuần</h3>
${slide('rx-02', 18, 'StrictMode gọi updater hai lần ở chế độ dev — để lộ đột biến')}
<p>Template Vite bọc ứng dụng của bạn trong <code>&lt;StrictMode&gt;</code> ở <code>main.tsx</code>. Ở chế độ dev, StrictMode cố ý gọi một số hàm của bạn hai lần — thân component, hàm khởi tạo và <strong>hàm cập nhật</strong> — rồi giữ một kết quả. Hàm thuần thì gọi hai lần chẳng đổi gì. Hàm có đột biến thì lần gọi thứ hai làm lộ thiệt hại. Đây là một hàm cập nhật trông hợp lý nhưng sửa mảng cũ trước khi trả về bản chép:</p>
${pre('tsx', SN.updaterSai)}
${out(OUT.strict)}
<p>Dưới StrictMode, updater có đột biến làm danh sách lớn lên 1 → 3 → 5 → 7: mỗi cú bấm sau cú đầu thêm hai lần, vì cả hai lời gọi cùng push vào một mảng cũ. Bản thuần (<code>(cu) =&gt; [...cu, 'bs-4']</code>) lớn lên 1 → 2 → 3 → 4, và bản đột biến <em>không</em> có StrictMode cũng thế — đó chính là lý do phép kiểm tồn tại: thiếu nó, bug vô hình cho tới khi một đường chạy khác gọi updater hai lần.</p>
<p>Hai ghi chú trung thực từ lúc đo. Một, tài liệu react.dev tả món đồ "được thêm hai lần"; trong lần chạy của ta cú bấm <em>đầu tiên</em> chỉ thêm một. Điều đó khớp với cơ chế bỏ qua ở 2.1: khi component không có cập nhật nào đang chờ, React có thể tính trước cập nhật đầu tiên ngay lúc gọi, ngoài lần render, và không lặp lại nó. Hai, trong lúc thử, bấm xen một component khác giữa các cú bấm cũng làm hiện tượng nhân đôi biến mất. Vậy StrictMode là một <em>trợ thủ</em> thường làm lộ updater không thuần, không phải một lời bảo đảm. Bảo đảm là viết updater trả giá trị mới và không đổi gì. Việc gọi hai lần của StrictMode chỉ có ở dev; bản build production gọi mọi thứ một lần.</p>

<h3>Immer: viết kiểu sửa thẳng, nhận về bản mới</h3>
${slide('rx-02', 19, 'Immer: viết như đang sửa thẳng, nhận về một bản mới')}
<p>Spread ba bốn tầng thì khó đọc. Thư viện <strong>Immer</strong> (11.1.18 lúc viết bài) giải theo cách khác: bạn nhận một <em>bản nháp (draft)</em>, sửa bản nháp bằng phép gán bình thường, và Immer tạo ra một object mới chứa đúng thay đổi của bạn — dùng chung mọi thứ bạn không đụng, y như spread cẩn thận:</p>
${pre('ts', SN.doiSdtImmer)}
<p>Test <code>Immer cho cùng kết quả</code> kiểm bằng <code>toEqual</code> rằng kết quả giống bản spread ở trên: xanh. Trong component, <code>produce</code> chỉ nhận công thức thì trả về một hàm cập nhật, cắm thẳng vào hàm set được:</p>
${pre('tsx', SN.suaImmer)}
<p>Khi nào đáng dùng? Hai tầng như <code>LichHen → benhNhan</code> thì spread vẫn dễ đọc và không tốn thêm thư viện. Dữ liệu lồng sâu, hay một reducer nhiều nhánh (Chương 5), thì Immer làm mã ngắn hơn và khó sai hơn. Có thể bạn đã dùng nó mà không biết: <code>createSlice</code> của Redux Toolkit chạy reducer của bạn qua Immer, nên ở đó — và chỉ ở đó — "sửa thẳng" <code>state.items.push(x)</code> mới được phép. Dự án thử của chương cài Immer (<code>npm install immer</code>) chỉ để chạy các ví dụ này; dự án "An Tâm" không cần nó.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong lab FER202 hay gặp <code>this.state.items.push(newItem); this.setState({ items: this.state.items })</code>, hoặc trong reducer Redux <code>state.cart.push(item); return state;</code> — rồi một buổi giải thích vì sao màn hình không cập nhật. Cách sửa trong syllabus thường là <code>[...state.items, newItem]</code> và <code>Object.assign({}, state, {…})</code>. → Đi làm luật vẫn vậy, chỉ là đồ nghề tốt hơn: spread và các phương thức mảng không đột biến (<code>map</code>, <code>filter</code>, <code>toSorted</code>) cho trường hợp đơn giản; Immer cho cập nhật sâu, thường là gián tiếp qua Redux Toolkit hoặc middleware Immer của Zustand; và ESLint/oxlint cộng StrictMode để bắt lỗi. · <em>Vì sao:</em> so danh tính là cách React, <code>memo</code>, TanStack Query và mọi thư viện state quyết định cái gì đã đổi; đột biến làm hỏng tất cả cùng lúc. <code>Object.assign({}, a, b)</code> không sai — spread làm đúng việc đó — bạn vẫn sẽ đọc thấy nó trong mã cũ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Vì sao trong React phải cập nhật state theo kiểu bất biến?</strong><br>Đáp: React quyết định state có đổi không bằng <code>Object.is</code> — một phép so danh tính. Sửa object rồi đặt lại cùng tham chiếu thì trông như "không đổi", React bỏ qua render; dữ liệu bị sửa sau đó hiện ra ở một lần render ngẫu nhiên. Cập nhật bất biến còn làm việc phát hiện thay đổi rẻ cho <code>memo</code> và cho phép giữ các phiên bản trước.</p>
<p><strong>Hỏi: Sao chép nông và sao chép sâu?</strong><br>Đáp: Spread chép một tầng: object lồng vẫn dùng chung. Với state, tôi spread từng tầng trên đường mình đổi, cố ý giữ phần không đổi được dùng chung. Sao chép sâu (<code>structuredClone</code>) cho mọi thứ danh tính mới, thường tốn công hơn và làm mọi nơi dùng nó tưởng là đã đổi.</p>
<p><strong>Hỏi: Cập nhật một phần tử trong mảng object thế nào?</strong><br>Đáp: <code>list.map(x =&gt; x.id === id ? { ...x, field: value } : x)</code> — mảng mới, object mới cho phần tử khớp, object cũ cho phần còn lại.</p>
</div>

<h3>Chạy thử từng bước: danh sách yêu thích, làm cho đúng</h3>
<ol>
<li>Tạo <code>DanhSachTim</code> với <code>const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([])</code> và mỗi bác sĩ một nút.</li>
<li>Viết handler sai trước: <code>yeuThich.push(id); setYeuThich(yeuThich);</code>. Bấm: không hiện gì. Thêm một state khác (một bộ đếm) và bấm nó: danh sách yêu thích hiện ra. Bạn vừa tái hiện bóng ma.</li>
<li>Thay bằng hàm cập nhật bật/tắt kiểu bất biến: <code>setYeuThich((cu) =&gt; cu.includes(id) ? cu.filter((x) =&gt; x !== id) : [...cu, id])</code>.</li>
<li>Chuyển biểu thức đó thành hàm thuần <code>doiYeuThich(ds, id)</code> trong <code>src/logic/yeu-thich.ts</code> và test nó không cần React: mảng mới <code>not.toBe</code> mảng cũ, và mảng cũ không đổi.</li>
<li>Chạy bộ test. Lần chạy <code>npx vitest run bai3 --reporter=verbose</code> của dự án chương kết thúc bằng <code>Test Files 2 passed (2)</code>, <code>Tests 14 passed (14)</code>.</li>
</ol>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> quầy lễ tân sửa một lịch hẹn trước khi xác nhận: đổi lý do, số điện thoại của bệnh nhân, và trạng thái.</p><ol>
<li>Giữ một <code>LichHen</code> trong state (theo mẫu <code>LICH_HEN</code>). Viết ba hàm thuần: <code>doiLyDo(lh, lyDo)</code>, <code>doiSoDienThoai(lh, so)</code> (lồng) và <code>xacNhan(lh)</code> đặt <code>trangThai: 'da-xac-nhan'</code>.</li>
<li>Mỗi hàm một test khẳng định: kết quả có thay đổi; đầu vào không đổi; kết quả <code>not.toBe</code> đầu vào; và, với <code>doiLyDo</code>, <code>ketQua.benhNhan</code> <strong>là</strong> <code>toBe</code> <code>benhNhan</code> cũ (cố ý dùng chung).</li>
<li>Nối ba nút trong một component, render dưới <code>&lt;StrictMode&gt;</code> trong test, bấm mỗi nút một lần và kiểm màn hình.</li>
<li>Thêm: viết lại <code>doiSoDienThoai</code> bằng Immer và chứng minh hai bản <code>toEqual</code> nhau.</li>
</ol><p><strong>Đạt khi:</strong> mọi test xanh với <code>npx vitest run</code>, <code>npx tsc -b</code> sạch, và bạn giải thích được trong một câu vì sao phép kiểm danh tính <code>benhNhan</code> ở bước 2 qua với <code>doiLyDo</code> nhưng sẽ trượt với <code>doiSoDienThoai</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mutation (đột biến)</span><span class="v">sửa một object hay mảng đang có, tại chỗ</span></div>
<div class="kv"><span class="k">immutability (tính bất biến)</span><span class="v">không bao giờ đổi giá trị; tạo giá trị mới mang thay đổi</span></div>
<div class="kv"><span class="k">tham chiếu / danh tính</span><span class="v">object được giữ bằng tham chiếu; hai biến có thể trỏ cùng một object</span></div>
<div class="kv"><span class="k"><code>Object.is</code></span><span class="v">phép so bằng của React cho state: cùng giá trị với kiểu nguyên thuỷ, cùng object với object</span></div>
<div class="kv"><span class="k">spread <code>...</code> (trải)</span><span class="v">chép field của object hay phần tử của mảng sang một cái mới</span></div>
<div class="kv"><span class="k">shallow copy (sao chép nông)</span><span class="v">bản chép một tầng; object lồng vẫn dùng chung</span></div>
<div class="kv"><span class="k"><code>toSorted</code> / <code>toReversed</code></span><span class="v">phương thức ES2023 trả về bản chép đã sắp xếp/đảo</span></div>
<div class="kv"><span class="k">Immer / draft (bản nháp)</span><span class="v">thư viện biến các phép gán trên bản nháp thành một object bất biến mới</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>React so state bằng <code>Object.is</code>; sửa thẳng rồi đặt lại cùng object nghĩa là "không đổi" — không render.</li>
<li>Bug đột biến lộ ra muộn, ở một lần render chẳng liên quan ("bóng ma"), nên rất khó lần.</li>
<li>Thay chứ đừng sửa: <code>{ ...obj, field }</code>, và spread mọi tầng trên đường của một thay đổi lồng.</li>
<li>Mảng: <code>[...ds, x]</code>, <code>filter</code>, <code>map</code>, <code>toSorted</code>; không bao giờ <code>push</code>/<code>splice</code>/<code>sort</code> trên state hay props — kể cả trong render.</li>
<li>StrictMode gọi updater hai lần ở dev và thường làm lộ đột biến (đo được 1 → 3 → 5 → 7), nhưng chỉ updater thuần mới là bảo đảm.</li>
<li>Immer cho bạn gán trên bản nháp và nhận object mới; đáng dùng với dữ liệu sâu, và có sẵn bên trong Redux Toolkit.</li>
</ul>

${LINK('https://react.dev/learn/updating-objects-in-state', '📄', 'react.dev — Updating Objects in State', 'Coi state là chỉ đọc, spread, object lồng nhau, và Immer.')}
${LINK('https://react.dev/learn/updating-arrays-in-state', '📄', 'react.dev — Updating Arrays in State', 'Bảng tránh/nên dùng, object trong mảng, và Immer cho mảng.')}
${LINK('https://react.dev/reference/react/useState', '📄', 'react.dev — useState: xử lý sự cố', '"Tôi đã cập nhật state mà màn hình không đổi" và "Hàm cập nhật của tôi chạy hai lần".')}
${LINK('https://github.com/immerjs/immer', '🧰', 'Immer trên GitHub', 'produce, bản nháp, và dạng curried dùng với setState.')}
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Where state should live: lifting state up, one source of truth, derived state|||2.4 — State nên ở đâu: nâng state lên, một nguồn sự thật, state dẫn xuất',
      slug: 'rx-2-4-dat-state',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai component cần cùng dữ liệu thì nâng state lên cha chung; component được điều khiển bằng props; không cất thứ tính được (bug chậm một phím, đo thật); cất id thay vì bản chép object; chép prop vào state; state đặt thấp để ít render (đo bằng Profiler); năm nguyên tắc cấu trúc state.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Where state should live: lifting state up, one source of truth, derived state</h2>
<p class="lead">You now know how to create state and change it correctly. The harder question — the one that separates code that is pleasant to change from code that fights you — is <strong>which component should own each piece of state</strong>, and which values should not be state at all.</p>

<p>This lesson answers it on the real screen of the project: filter chips, a search box, a list, a detail panel and a favourites box. Each rule is shown as a bug first (measured), then the fix. At the end, the "🛠 Keep building the project" section walks you through building that screen yourself, with a full, tested solution.</p>

<h3>Two components, one value: lift the state up</h3>
${slide('rx-02', 20, 'Siblings that need the same data ⇒ lift the state to their parent')}
<p>Chips choose a specialty; the list shows matching doctors. The most natural first attempt gives each component its own state:</p>
${pre('tsx', SN.haiStateRieng)}
${out(OUT.rieng)}
<p>The chip "Nhi" lights up (<code>aria-pressed = true</code>), and the list still shows all 6 doctors. Nothing is broken inside either component; they simply have two separate memories and no way to talk to each other — state is private (2.1). The cure is called <strong>lifting state up (nâng state lên)</strong>, and react.dev describes it in three steps:</p>
<ol>
<li><strong>Remove</strong> the state from the children.</li>
<li><strong>Pass</strong> the value down from the closest common parent as a prop, plus a function to change it.</li>
<li><strong>Add</strong> the state to that parent.</li>
</ol>
${SD.nangLenEn}
${pre('tsx', SN.nangStateLen)}
<p>Now <code>ChipChuyenKhoa</code> receives <code>giaTri</code> and <code>onDoi</code> and has no state of its own. A component like that is called <strong>controlled (được điều khiển)</strong>: what it shows is decided entirely by its props. One that keeps its own state (like <code>ThanhLocRieng</code>) is <strong>uncontrolled</strong>. Neither is better in general — an uncontrolled accordion that nobody else cares about is perfectly fine — but the moment someone else needs to know or change the value, it must become controlled. The test <code>nâng state lên: chip Nhi ⇒ 2</code> passes.</p>
<div class="callout"><p><strong>JS quick reminder — destructuring props and type annotations.</strong> <code>function ChipChuyenKhoa({ giaTri, onDoi }: ChipChuyenKhoaProps)</code> takes the single props object and pulls out two fields by name (object destructuring, the cousin of 2.1&#39;s array destructuring). <code>onDoi: (moi: BoLocChuyenKhoa) =&gt; void</code> in the props interface reads "a function that takes one specialty filter and returns nothing". Because <code>setChuyenKhoa</code> has exactly that shape, the parent can pass it directly.</p></div>

<h3>The project&#39;s screen: one owner, many readers</h3>
${slide('rx-02', 21, 'KhuBacSi owns four pieces of state; every child only receives props')}
<p>Apply the same reasoning to the whole screen. Which components need the selected specialty? The chips (to highlight) and the list (to filter). The search text? The input and the list. The selected doctor? The cards (to highlight "đang chọn") and the detail panel. The favourites? The cards, the detail panel and the favourites box. The closest common parent of all of them is one component, <code>KhuBacSi</code> — so it owns all four:</p>
${pre('tsx', SN.khuBacSi)}
<p>Read it top to bottom and notice the three layers. First, <strong>four pieces of state</strong> — each one something the user changes and that cannot be computed from anything else. Second, <strong>three derived values</strong> computed during render: the filtered list, the selected doctor object, the favourite doctors. Third, JSX that hands every child exactly what it needs. This is what react.dev calls a <strong>single source of truth (một nguồn sự thật)</strong>: each piece of state has one owner; everyone else reads it through props and asks for changes through <code>onXxx</code> callbacks. When a bug report says "the chip says Nhi but the list shows a dermatologist", there is exactly one place to look.</p>
${SD.khuBacSiEn}
<p><code>Header</code> and <code>Footer</code> sit outside <code>KhuBacSi</code>. That placement is deliberate, and measured below.</p>

<h3>Do not store what you can compute</h3>
${slide('rx-02', 22, 'Don’t store what you can compute — storing it makes the list lag by one keystroke')}
<p>A very common "optimisation" is to keep the filtered list in state too, and recompute it in the handler whenever the input changes:</p>
${pre('tsx', SN.luuKetQua)}
<p>Type "huy" and compare with the version that computes during render:</p>
${out(OUT.luuKetQua)}
<p>The stored version shows <strong>two</strong> doctors — Hà and Huy — for "huy". It is one keystroke behind: when you type the final "y", the handler filters with <code>tuKhoa</code>, which is still the snapshot "hu" (2.1!), and "hu" matches "Trần T<strong>hu</strong> Hà". The computed version is right on every keystroke:</p>
${pre('tsx', SN.tinhTrongRender)}
<p>The lesson is broader than this bug. Any value you store that could be computed from other state is <strong>redundant state (state thừa)</strong>, and redundant state is a promise you have to keep by hand: every handler that changes <code>tuKhoa</code> <em>and</em> every handler that changes <code>chuyenKhoa</code> <em>and</em> the favourites toggle must all remember to update <code>ketQua</code>, correctly, with fresh values. Forget one and the screen lies. Computing during render cannot go out of sync, because there is nothing to sync. Filtering six (or six hundred) items per render is cheap; Chapter 8 shows how to measure when it is not, and then <code>useMemo</code> caches it — still derived, never stored.</p>
<p><strong>Store ids, not copies.</strong> The same idea explains why the project keeps <code>bacSiDangChonId</code> (a string) instead of the whole selected doctor object. If you stored a copy of the object and the doctor&#39;s data changed (Chapter 6 loads it from an API, and a refetch returns fresh objects), the detail panel would keep showing the old copy. With an id, the panel always shows <code>danhSachBacSi.find(…)</code> — the current data. react.dev calls this "avoid duplication in state". The favourites list stores ids for the same reason, and the test <code>lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn</code> proves the favourites box still shows BS. Nguyễn Minh An after filtering to "Nhi" hides his card.</p>
<div class="pitfall co-tieu-de"><strong>Trap — copying a prop into state.</strong> <code>const [ghiChu, setGhiChu] = useState(bacSi.gioiThieu)</code> looks like "start the note with the doctor&#39;s intro". But the argument of <code>useState</code> is only read on the <em>first</em> render. When the parent passes a different doctor, the label updates and the text does not:
${pre('tsx', SN.ghiChu)}
${out(OUT.chepProp)}
The label says BS. Trần Thu Hà; the box still holds BS. Nguyễn Minh An&#39;s text. Either do not copy (read the prop directly), or, if it really is an editable draft that should restart for each doctor, give the component a <code>key={bacSi.id}</code> so React creates a fresh one — Chapter 11 explains why that works.</div>

<h3>Keep state as low as possible</h3>
${slide('rx-02', 23, 'The lower state lives, the fewer components re-render')}
<p>"Lift state up" does not mean "put everything at the top". When state changes, React re-renders the component that owns it <strong>and all of its children</strong> — not its parent, not its siblings. So the height at which state lives decides how much work each keystroke causes. The test below renders the same search box twice: once with the state in the top component (which also renders <code>Header</code>), once with the state moved into a small <code>KhuTim</code> next to <code>Header</code>. A <code>&lt;Profiler&gt;</code> around <code>Header</code> counts its renders while typing "huy":</p>
${pre('tsx', SN.stateCaoThap)}
${out(OUT.caoThap)}
<p>State at the top: <code>Header</code> re-rendered on every keystroke (mount + 3 updates). State one level down: <code>Header</code> rendered once, at mount, and never again. <code>Header</code> is cheap, so nobody would notice here — but the principle is what keeps large screens fast without any optimisation tricks: lift state <strong>just high enough</strong> that every component that needs it can see it, and no higher. That is why <code>KhuBacSi</code> owns the four pieces and <code>App</code> owns none.</p>
<p>What if two components far apart in the tree need the same state — say the favourites count in <code>Header</code>? Lifting to <code>App</code> would re-render everything on every keystroke, and passing props through five layers ("prop drilling") gets tedious. Chapter 5 gives the tools: Context, Zustand, and the URL as state.</p>

<h3>Principles for structuring state</h3>
${slide('rx-02', 24, 'Five principles for structuring state + one source of truth')}
<p>react.dev condenses the choices into five principles. Here they are with the clinic&#39;s examples:</p>
<table>
<thead><tr><th>Principle</th><th>Instead of</th><th>Write</th></tr></thead>
<tbody>
<tr><td>Group related state</td><td><code>x</code> and <code>y</code> of one point in two states that always change together</td><td>one object <code>{ x, y }</code></td></tr>
<tr><td>Avoid contradictions</td><td><code>dangGui</code> and <code>daGui</code> — both can be <code>true</code>, which is meaningless</td><td>one <code>trangThai: 'nhap' | 'dang-gui' | 'da-gui'</code> (the same idea as <code>TrangThaiLichHen</code>)</td></tr>
<tr><td>Avoid redundant state</td><td>storing <code>danhSachLoc</code> or <code>soYeuThich</code></td><td>compute during render</td></tr>
<tr><td>Avoid duplication</td><td>storing a copy of the selected doctor</td><td>store <code>bacSiDangChonId</code></td></tr>
<tr><td>Avoid deep nesting</td><td>a tree of objects five levels deep</td><td>flat objects that refer to each other by id</td></tr>
</tbody></table>
<p>Behind all five is the question you should ask of every <code>useState</code> you are about to write: <em>is this something the user (or the server) changes, which cannot be computed from anything I already have?</em> If yes, it is state, and it gets exactly one owner. If no, it is a value you compute.</p>
${SD.laStateEn}

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 introduces Redux early, and many student projects end up putting <em>everything</em> in the store — the text of a search box, whether a modal is open, the selected tab — with an action type, an action creator and a reducer case for each. → At work, the default is the opposite: <strong>local state first</strong>, lifted only as high as needed; values that can be computed are computed; data that comes from a server lives in TanStack Query (Chapter 6); and only genuinely global client state (the logged-in user, a cart, a theme) goes into a store — usually Zustand, sometimes Redux Toolkit (Chapter 5). · <em>Why:</em> a search box&#39;s text in a global store means every keystroke goes through the whole Redux machinery and any connected component may re-render; it also makes the component impossible to reuse or test alone. Redux is not wrong — large existing codebases use it, and you will meet it — but "where should this state live?" is answered by who needs it, not by "we have a store".</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What does "lifting state up" mean, and when do you do it?</strong><br>A: Moving state from children to their closest common parent, then passing the value and a change callback down as props. You do it when two components must stay in sync — a filter and a list, a card and a detail panel. The children become controlled components.</p>
<p><strong>Q: What is derived state, and why not store it?</strong><br>A: A value computable from props or other state — a filtered list, a count, a full name. Storing it duplicates the truth; every update path must keep it in sync, and it goes stale (I measured a list that lagged one keystroke). Compute it during render; if it is expensive, cache it with <code>useMemo</code>.</p>
<p><strong>Q: Where would you put the state for a search box that filters a list?</strong><br>A: In the closest common parent of the input and the list — not higher, because every state change re-renders the owner and its subtree. If a distant component also needs it, I would consider the URL (shareable, survives reload) or a small store.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a colleague wrote a booking-confirmation box with this state: <code>dangGui</code>, <code>daGui</code>, <code>loi</code> (booleans), <code>soLanThu</code> (number) and <code>thongBao</code> (a string that is always either "", "Đang gửi…", "Đã gửi" or "Gửi lỗi, thử lại").</p><ol>
<li>List every combination of the three booleans that is impossible in real life (for example <code>dangGui</code> and <code>daGui</code> both <code>true</code>).</li>
<li>Replace the three booleans with one <code>trangThai: 'nhap' | 'dang-gui' | 'da-gui' | 'loi'</code> (a TypeScript union, like <code>TrangThaiLichHen</code>).</li>
<li>Delete the <code>thongBao</code> state: compute the message from <code>trangThai</code> during render with a small function <code>thongBaoCua(trangThai)</code>.</li>
<li>Write three buttons ("Gửi", "Giả lập thành công", "Giả lập lỗi") and tests that click them and check the message. Keep <code>soLanThu</code> as state and increment it with an updater function.</li>
</ol><p><strong>Done when:</strong> the component has exactly two <code>useState</code> calls; <code>thongBaoCua</code> has a unit test for all four statuses; the UI tests are green; and <code>npx tsc -b</code> rejects <code>setTrangThai('xong')</code> (you can quote the error).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">lifting state up (nâng state lên)</span><span class="v">moving state to the closest common parent and passing value + callback down</span></div>
<div class="kv"><span class="k">single source of truth</span><span class="v">each piece of state has exactly one owner; others read it via props</span></div>
<div class="kv"><span class="k">controlled component</span><span class="v">shows what its props say; changes go through <code>onXxx</code> callbacks</span></div>
<div class="kv"><span class="k">uncontrolled component</span><span class="v">keeps its own state; the parent cannot see or set it</span></div>
<div class="kv"><span class="k">derived state (state dẫn xuất)</span><span class="v">a value computed from props/state during render — not stored</span></div>
<div class="kv"><span class="k">redundant state (state thừa)</span><span class="v">stored data that could be computed; must be kept in sync by hand</span></div>
<div class="kv"><span class="k">prop drilling</span><span class="v">passing a prop through many layers that do not use it (solved in Chapter 5)</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two components that must agree need one state in their closest common parent; the children become controlled.</li>
<li>Each piece of state has one owner (single source of truth); others read props and call <code>onXxx</code>.</li>
<li>Do not store what you can compute: stored filter results lagged one keystroke; computed ones cannot go stale.</li>
<li>Store ids, not copies of objects; do not copy props into state — <code>useState</code> reads its argument only once.</li>
<li>State changes re-render the owner and its subtree: keep state as low as possible (measured: <code>Header</code> 4 renders vs 1).</li>
<li>Group related state, avoid contradictions, redundancy, duplication and deep nesting.</li>
</ul>

${LINK('https://react.dev/learn/sharing-state-between-components', '📄', 'react.dev — Sharing State Between Components', 'Lifting state up in three steps, controlled vs uncontrolled, a single source of truth.')}
${LINK('https://react.dev/learn/choosing-the-state-structure', '📄', 'react.dev — Choosing the State Structure', 'The five principles with examples, including "don’t mirror props in state".')}
${LINK('https://react.dev/learn/thinking-in-react', '📄', 'react.dev — Thinking in React', 'Step 3 and 4: find the minimal state, and identify where it should live.')}
${LINK('https://react.dev/learn/preserving-and-resetting-state', '📄', 'react.dev — Preserving and Resetting State', 'Why state belongs to a position in the tree, and the key trick (Chapter 11).')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>State nên ở đâu: nâng state lên, một nguồn sự thật, state dẫn xuất</h2>
<p class="lead">Giờ bạn đã biết tạo state và đổi nó cho đúng. Câu hỏi khó hơn — câu tách mã dễ sửa khỏi mã chống lại bạn — là <strong>component nào nên sở hữu từng mẩu state</strong>, và giá trị nào hoàn toàn không nên là state.</p>

<p>Bài này trả lời ngay trên màn hình thật của dự án: chip chuyên khoa, ô tìm kiếm, danh sách, khung chi tiết và hộp yêu thích. Mỗi quy tắc được trình bày thành một bug trước (có đo), rồi mới tới cách sửa. Cuối bài, mục "🛠 Tự gõ tiếp dự án" dẫn bạn tự dựng màn hình đó, kèm lời giải đầy đủ đã chạy test.</p>

<h3>Hai component, một giá trị: nâng state lên</h3>
${slide('rx-02', 20, 'Anh em cần chung dữ liệu ⇒ nâng state lên cha')}
<p>Chip chọn chuyên khoa; danh sách hiện bác sĩ khớp. Lần thử tự nhiên nhất là cho mỗi component một state riêng:</p>
${pre('tsx', SN.haiStateRieng)}
${out(OUT.rieng)}
<p>Chip "Nhi" sáng lên (<code>aria-pressed = true</code>), còn danh sách vẫn hiện đủ 6 bác sĩ. Không component nào hỏng bên trong; chúng chỉ có hai bộ nhớ riêng và không có cách nào nói chuyện với nhau — state là riêng tư (2.1). Cách chữa gọi là <strong>nâng state lên (lifting state up)</strong>, react.dev tả nó bằng ba bước:</p>
<ol>
<li><strong>Bỏ</strong> state khỏi các con.</li>
<li><strong>Truyền</strong> giá trị xuống từ cha chung gần nhất bằng prop, kèm một hàm để đổi nó.</li>
<li><strong>Thêm</strong> state vào cha đó.</li>
</ol>
${SD.nangLenVi}
${pre('tsx', SN.nangStateLen)}
<p>Giờ <code>ChipChuyenKhoa</code> nhận <code>giaTri</code> và <code>onDoi</code>, không có state riêng. Component như vậy gọi là <strong>được điều khiển (controlled)</strong>: nó hiện gì hoàn toàn do props quyết định. Component tự giữ state (như <code>ThanhLocRieng</code>) là <strong>không được điều khiển (uncontrolled)</strong>. Không cái nào tốt hơn một cách chung chung — một accordion tự đóng mở mà chẳng ai khác quan tâm thì để uncontrolled là ổn — nhưng khi có ai khác cần biết hay đổi giá trị, nó phải thành controlled. Test <code>nâng state lên: chip Nhi ⇒ 2</code> xanh.</p>
<div class="callout"><p><strong>JS nhắc nhanh — tách props và chú thích kiểu.</strong> <code>function ChipChuyenKhoa({ giaTri, onDoi }: ChipChuyenKhoaProps)</code> nhận MỘT object props và rút ra hai field theo tên (destructuring object, anh em với destructuring mảng ở 2.1). <code>onDoi: (moi: BoLocChuyenKhoa) =&gt; void</code> trong interface props đọc là "một hàm nhận một bộ lọc chuyên khoa và không trả gì". Vì <code>setChuyenKhoa</code> có đúng hình dạng đó, cha đưa thẳng nó xuống được.</p></div>

<h3>Màn hình của dự án: một chủ, nhiều người đọc</h3>
${slide('rx-02', 21, 'KhuBacSi giữ bốn mẩu state; mọi con chỉ nhận props')}
<p>Áp cùng cách nghĩ cho cả màn hình. Component nào cần chuyên khoa đang chọn? Hàng chip (để tô sáng) và danh sách (để lọc). Chữ đang tìm? Ô nhập và danh sách. Bác sĩ đang chọn? Các thẻ (để tô "đang chọn") và khung chi tiết. Danh sách yêu thích? Các thẻ, khung chi tiết và hộp yêu thích. Cha chung gần nhất của tất cả là một component, <code>KhuBacSi</code> — nên nó sở hữu cả bốn:</p>
${pre('tsx', SN.khuBacSi)}
<p>Đọc từ trên xuống và để ý ba lớp. Thứ nhất, <strong>bốn mẩu state</strong> — mỗi mẩu là thứ người dùng đổi và không tính được từ thứ gì khác. Thứ hai, <strong>ba giá trị dẫn xuất</strong> tính trong lúc render: danh sách đã lọc, object bác sĩ đang chọn, các bác sĩ yêu thích. Thứ ba, JSX đưa cho mỗi con đúng thứ nó cần. Đó là điều react.dev gọi là <strong>một nguồn sự thật (single source of truth)</strong>: mỗi mẩu state có đúng một chủ; mọi nơi khác đọc qua props và xin thay đổi qua các callback <code>onXxx</code>. Khi có báo lỗi "chip ghi Nhi mà danh sách hiện bác sĩ da liễu", chỉ có đúng một chỗ để nhìn.</p>
${SD.khuBacSiVi}
<p><code>Header</code> và <code>Footer</code> nằm ngoài <code>KhuBacSi</code>. Vị trí đó là cố ý, và được đo ở dưới.</p>

<h3>Đừng cất thứ tính được</h3>
${slide('rx-02', 22, 'Đừng cất thứ tính được — cất vào state là bị chậm một phím')}
<p>Một kiểu "tối ưu" rất hay gặp là cất luôn danh sách đã lọc vào state, và tính lại trong handler mỗi khi ô nhập đổi:</p>
${pre('tsx', SN.luuKetQua)}
<p>Gõ "huy" rồi so với bản tính trong lúc render:</p>
${out(OUT.luuKetQua)}
<p>Bản cất vào state hiện <strong>hai</strong> bác sĩ — Hà và Huy — cho "huy". Nó chậm một phím: khi bạn gõ chữ "y" cuối, handler lọc bằng <code>tuKhoa</code>, lúc đó vẫn là ảnh chụp "hu" (2.1!), và "hu" khớp "Trần T<strong>hu</strong> Hà". Bản tính trong render đúng ở mọi phím:</p>
${pre('tsx', SN.tinhTrongRender)}
<p>Bài học rộng hơn con bug này. Mọi giá trị bạn cất mà tính được từ state khác là <strong>state thừa (redundant state)</strong>, và state thừa là một lời hứa bạn phải giữ bằng tay: mọi handler đổi <code>tuKhoa</code>, <em>và</em> mọi handler đổi <code>chuyenKhoa</code>, <em>và</em> nút bật/tắt yêu thích đều phải nhớ cập nhật <code>ketQua</code>, cho đúng, bằng giá trị mới. Quên một chỗ là màn hình nói dối. Tính trong render thì không thể lệch, vì chẳng có gì để giữ cho khớp. Lọc sáu (hay sáu trăm) phần tử mỗi lần render là rẻ; Chương 8 chỉ cách đo khi nào nó không còn rẻ, và lúc đó <code>useMemo</code> lưu đệm nó — vẫn là dẫn xuất, không bao giờ là state.</p>
<p><strong>Cất id, đừng cất bản chép.</strong> Cùng ý đó giải thích vì sao dự án giữ <code>bacSiDangChonId</code> (một chuỗi) chứ không giữ cả object bác sĩ đang chọn. Nếu bạn cất một bản chép object và dữ liệu bác sĩ đổi (Chương 6 tải nó từ API, và mỗi lần tải lại trả về object mới), khung chi tiết sẽ cứ hiện bản chép cũ. Với id, khung luôn hiện <code>danhSachBacSi.find(…)</code> — dữ liệu hiện tại. react.dev gọi điều này là "tránh trùng lặp trong state". Danh sách yêu thích cũng cất id vì cùng lý do, và test <code>lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn</code> chứng minh hộp yêu thích vẫn hiện BS. Nguyễn Minh An sau khi lọc "Nhi" giấu mất thẻ của ông.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — chép prop vào state.</strong> <code>const [ghiChu, setGhiChu] = useState(bacSi.gioiThieu)</code> trông như "bắt đầu ghi chú bằng phần giới thiệu của bác sĩ". Nhưng đối số của <code>useState</code> chỉ được đọc ở lần render <em>đầu tiên</em>. Khi cha truyền một bác sĩ khác, nhãn đổi còn chữ thì không:
${pre('tsx', SN.ghiChu)}
${out(OUT.chepProp)}
Nhãn ghi BS. Trần Thu Hà; ô vẫn chứa chữ của BS. Nguyễn Minh An. Hoặc đừng chép (đọc thẳng prop), hoặc, nếu nó thật sự là bản nháp sửa được và phải bắt đầu lại cho mỗi bác sĩ, cho component một <code>key={bacSi.id}</code> để React tạo cái mới — Chương 11 giải thích vì sao cách đó chạy.</div>

<h3>Đặt state càng thấp càng tốt</h3>
${slide('rx-02', 23, 'State đặt càng thấp, càng ít component phải render lại')}
<p>"Nâng state lên" không có nghĩa "đặt mọi thứ trên đỉnh". Khi state đổi, React render lại component sở hữu nó <strong>và mọi con của nó</strong> — không render cha, không render anh em. Nên độ cao state nằm quyết định mỗi phím gõ tốn bao nhiêu việc. Test dưới vẽ cùng một ô tìm hai lần: một lần state ở component trên cùng (component đó cũng vẽ <code>Header</code>), một lần state chuyển vào một <code>KhuTim</code> nhỏ nằm cạnh <code>Header</code>. Một <code>&lt;Profiler&gt;</code> quanh <code>Header</code> đếm số lần nó render khi gõ "huy":</p>
${pre('tsx', SN.stateCaoThap)}
${out(OUT.caoThap)}
<p>State ở trên cùng: <code>Header</code> render lại mỗi phím (mount + 3 update). State xuống một tầng: <code>Header</code> render một lần, lúc gắn, rồi không bao giờ nữa. <code>Header</code> rẻ nên ở đây chẳng ai thấy — nhưng nguyên tắc này là thứ giữ cho màn hình lớn chạy nhanh mà không cần mẹo tối ưu nào: nâng state lên <strong>vừa đủ cao</strong> để mọi component cần nó cùng thấy, không cao hơn. Đó là lý do <code>KhuBacSi</code> sở hữu bốn mẩu và <code>App</code> không sở hữu mẩu nào.</p>
<p>Nếu hai component ở xa nhau trong cây cần cùng state — ví dụ số lượng yêu thích hiện trên <code>Header</code>? Nâng lên <code>App</code> thì mọi thứ render lại mỗi phím gõ, còn truyền prop qua năm tầng ("prop drilling" — khoan prop) thì mệt. Chương 5 đưa đồ nghề: Context, Zustand, và URL làm state.</p>

<h3>Các nguyên tắc cấu trúc state</h3>
${slide('rx-02', 24, 'Năm nguyên tắc cấu trúc state + một nguồn sự thật')}
<p>react.dev gói các lựa chọn thành năm nguyên tắc. Đây là chúng, với ví dụ của phòng khám:</p>
<table>
<thead><tr><th>Nguyên tắc</th><th>Thay vì</th><th>Viết</th></tr></thead>
<tbody>
<tr><td>Gộp state liên quan</td><td><code>x</code> và <code>y</code> của một điểm nằm ở hai state luôn đổi cùng lúc</td><td>một object <code>{ x, y }</code></td></tr>
<tr><td>Tránh mâu thuẫn</td><td><code>dangGui</code> và <code>daGui</code> — cả hai có thể cùng <code>true</code>, vô nghĩa</td><td>một <code>trangThai: 'nhap' | 'dang-gui' | 'da-gui'</code> (cùng ý với <code>TrangThaiLichHen</code>)</td></tr>
<tr><td>Tránh state thừa</td><td>cất <code>danhSachLoc</code> hay <code>soYeuThich</code></td><td>tính trong render</td></tr>
<tr><td>Tránh trùng lặp</td><td>cất bản chép của bác sĩ đang chọn</td><td>cất <code>bacSiDangChonId</code></td></tr>
<tr><td>Tránh lồng sâu</td><td>một cây object sâu năm tầng</td><td>các object phẳng trỏ tới nhau bằng id</td></tr>
</tbody></table>
<p>Đằng sau cả năm là câu hỏi bạn nên hỏi trước mỗi <code>useState</code> sắp viết: <em>đây có phải thứ người dùng (hoặc server) đổi, và không tính được từ thứ tôi đã có?</em> Nếu có, nó là state, và nó có đúng một chủ. Nếu không, nó là giá trị bạn tính ra.</p>
${SD.laStateVi}

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>FER202 giới thiệu Redux khá sớm, và nhiều đồ án sinh viên cuối cùng bỏ <em>mọi thứ</em> vào store — chữ trong ô tìm kiếm, modal đang mở hay đóng, tab đang chọn — mỗi thứ một action type, một action creator và một nhánh reducer. → Đi làm, mặc định là ngược lại: <strong>state cục bộ trước</strong>, chỉ nâng lên vừa đủ cao; giá trị tính được thì tính; dữ liệu đến từ server nằm trong TanStack Query (Chương 6); và chỉ state phía client thật sự toàn cục (người dùng đăng nhập, giỏ hàng, giao diện sáng/tối) mới vào store — thường là Zustand, đôi khi Redux Toolkit (Chương 5). · <em>Vì sao:</em> chữ của ô tìm kiếm nằm trong store toàn cục nghĩa là mỗi phím gõ chạy qua cả bộ máy Redux và component nào nối vào store cũng có thể render lại; nó còn làm component không dùng lại hay test riêng được. Redux không sai — nhiều dự án lớn đang chạy dùng nó, và bạn sẽ gặp — nhưng "state này nên ở đâu?" được trả lời bằng ai cần nó, không phải bằng "mình có sẵn store".</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: "Lifting state up" là gì, khi nào làm?</strong><br>Đáp: Chuyển state từ các con lên cha chung gần nhất, rồi truyền giá trị và một callback để đổi xuống bằng props. Làm khi hai component phải luôn khớp nhau — bộ lọc và danh sách, thẻ và khung chi tiết. Các con thành controlled component.</p>
<p><strong>Hỏi: Derived state là gì, sao không cất nó?</strong><br>Đáp: Giá trị tính được từ props hoặc state khác — danh sách đã lọc, một số đếm, họ tên đầy đủ. Cất nó là nhân đôi sự thật; mọi đường cập nhật phải giữ nó khớp, và nó sẽ cũ đi (tôi đã đo một danh sách chậm một phím). Tính trong render; nếu tốn kém thì lưu đệm bằng <code>useMemo</code>.</p>
<p><strong>Hỏi: State của ô tìm kiếm lọc một danh sách nên đặt ở đâu?</strong><br>Đáp: Ở cha chung gần nhất của ô nhập và danh sách — không cao hơn, vì mỗi lần state đổi là chủ của nó và cả cây con render lại. Nếu một component ở xa cũng cần, tôi cân nhắc URL (chia sẻ được, sống qua lần tải lại) hoặc một store nhỏ.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một đồng nghiệp viết hộp xác nhận đặt lịch với các state: <code>dangGui</code>, <code>daGui</code>, <code>loi</code> (boolean), <code>soLanThu</code> (số) và <code>thongBao</code> (một chuỗi luôn là "", "Đang gửi…", "Đã gửi" hoặc "Gửi lỗi, thử lại").</p><ol>
<li>Liệt kê mọi tổ hợp của ba boolean không thể xảy ra ngoài đời (ví dụ <code>dangGui</code> và <code>daGui</code> cùng <code>true</code>).</li>
<li>Thay ba boolean bằng một <code>trangThai: 'nhap' | 'dang-gui' | 'da-gui' | 'loi'</code> (một union TypeScript, như <code>TrangThaiLichHen</code>).</li>
<li>Xoá state <code>thongBao</code>: tính câu thông báo từ <code>trangThai</code> ngay trong render bằng một hàm nhỏ <code>thongBaoCua(trangThai)</code>.</li>
<li>Viết ba nút ("Gửi", "Giả lập thành công", "Giả lập lỗi") và test bấm chúng rồi kiểm câu thông báo. Giữ <code>soLanThu</code> là state và tăng nó bằng hàm cập nhật.</li>
</ol><p><strong>Đạt khi:</strong> component có đúng hai lời gọi <code>useState</code>; <code>thongBaoCua</code> có unit test cho cả bốn trạng thái; test giao diện xanh; và <code>npx tsc -b</code> từ chối <code>setTrangThai('xong')</code> (bạn chép lại được lỗi).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">lifting state up (nâng state lên)</span><span class="v">chuyển state lên cha chung gần nhất, truyền giá trị + callback xuống</span></div>
<div class="kv"><span class="k">single source of truth (một nguồn sự thật)</span><span class="v">mỗi mẩu state có đúng một chủ; nơi khác đọc qua props</span></div>
<div class="kv"><span class="k">controlled component (được điều khiển)</span><span class="v">hiện đúng thứ props nói; thay đổi đi qua callback <code>onXxx</code></span></div>
<div class="kv"><span class="k">uncontrolled component</span><span class="v">tự giữ state; cha không thấy, không đặt được</span></div>
<div class="kv"><span class="k">derived state (state dẫn xuất)</span><span class="v">giá trị tính từ props/state ngay trong render — không cất</span></div>
<div class="kv"><span class="k">redundant state (state thừa)</span><span class="v">dữ liệu được cất mà tính được; phải giữ khớp bằng tay</span></div>
<div class="kv"><span class="k">prop drilling (khoan prop)</span><span class="v">truyền một prop qua nhiều tầng không dùng tới nó (giải ở Chương 5)</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai component phải khớp nhau thì cần một state ở cha chung gần nhất; các con thành controlled.</li>
<li>Mỗi mẩu state có một chủ (một nguồn sự thật); nơi khác đọc props và gọi <code>onXxx</code>.</li>
<li>Đừng cất thứ tính được: kết quả lọc cất vào state chậm một phím; tính trong render thì không thể cũ.</li>
<li>Cất id, đừng cất bản chép object; đừng chép prop vào state — <code>useState</code> chỉ đọc đối số một lần.</li>
<li>State đổi thì chủ và cả cây con render lại: đặt state thấp nhất có thể (đo được: <code>Header</code> 4 lần so với 1).</li>
<li>Gộp state liên quan; tránh mâu thuẫn, thừa, trùng lặp và lồng sâu.</li>
</ul>

${LINK('https://react.dev/learn/sharing-state-between-components', '📄', 'react.dev — Sharing State Between Components', 'Nâng state lên theo ba bước, controlled và uncontrolled, một nguồn sự thật.')}
${LINK('https://react.dev/learn/choosing-the-state-structure', '📄', 'react.dev — Choosing the State Structure', 'Năm nguyên tắc có ví dụ, gồm cả "đừng soi gương props vào state".')}
${LINK('https://react.dev/learn/thinking-in-react', '📄', 'react.dev — Thinking in React', 'Bước 3 và 4: tìm state tối thiểu, và xác định nó nên sống ở đâu.')}
${LINK('https://react.dev/learn/preserving-and-resetting-state', '📄', 'react.dev — Preserving and Resetting State', 'Vì sao state thuộc về một vị trí trong cây, và mẹo key (Chương 11).')}
</div>
`,
    },

    /* ─────────────────────────── 2.5 (thêm) ─────────────────────────── */
    {
      title: '2.5 — Build the doctor screen: filter, search, details and favourites|||2.5 — Dựng màn hình bác sĩ: lọc, tìm, chi tiết và yêu thích',
      slug: 'rx-2-5-man-hinh-bac-si',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài 🛠 của chương: từ dự án sau Chương 1, dựng màn hình lọc theo chuyên khoa, tìm không dấu, khung chi tiết và yêu thích với bốn state trong KhuBacSi — kế hoạch, từng bước, tiêu chí đạt (24 test xanh, ảnh chụp thật) và lời giải đầy đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Build the doctor screen: filter, search, details and favourites</h2>
<p class="lead">Four lessons, one screen. This lesson is where you stop reading and type: you take the project as Chapter 1 left it — a static list of six doctors — and turn it into a screen that listens: specialty chips, a search that ignores Vietnamese accents, a detail panel and a favourites list, all driven by four pieces of state in one component and covered by sixteen new tests.</p>
<p>Everything below was built and run in the chapter&#39;s project on top of the real Chapter 1 snapshot: <code>npx tsc -b</code> clean, the project&#39;s <code>npx vitest run</code> green, <code>npx vite build</code> successful, and the screenshots taken by Playwright from the production build. Try each step yourself before opening the solution.</p>

<h3>What you are building</h3>
${slide('rx-02', 25, 'The chapter’s result: filter, accent-free search, details, favourites (real screenshots)')}
${slide('rx-02', 25, 'The chapter’s result: filter, accent-free search, details, favourites (real screenshots)')}
<p>Put together, the four lessons of this chapter give the project its first interactive screen. The screenshots on the slide were taken by Playwright from a production build (<code>vite build</code> + <code>vite preview</code>): after "Xem chi tiết" on BS. Trần Thu Hà and ♡ on Hà and Lan; after typing "lan" without accents; and the empty state for "Da liễu" + "vy". The build itself:</p>
${out(OUT.build)}

<h3>Plan it before you type</h3>
<p>Lesson 2.4 asked two questions of every value: <em>who needs it?</em> and <em>can it be computed?</em> Answering them on paper first is most of the work:</p>
<table>
<thead><tr><th>Value</th><th>Changed by</th><th>Needed by</th><th>So it is…</th></tr></thead>
<tbody>
<tr><td>selected specialty</td><td>a chip click</td><td>chips, list</td><td>state in <code>KhuBacSi</code></td></tr>
<tr><td>search text</td><td>typing</td><td>input, list</td><td>state in <code>KhuBacSi</code></td></tr>
<tr><td>selected doctor</td><td>"Xem chi tiết", "Đóng"</td><td>cards, detail panel</td><td>state (an <strong>id</strong>) in <code>KhuBacSi</code></td></tr>
<tr><td>favourites</td><td>♡ on a card or in the panel</td><td>cards, panel, favourites box</td><td>state (an array of ids) in <code>KhuBacSi</code></td></tr>
<tr><td>filtered list</td><td>—</td><td>list</td><td>derived: <code>locBacSi(…)</code></td></tr>
<tr><td>selected doctor object, favourite doctors</td><td>—</td><td>panel, favourites box</td><td>derived: <code>find</code>, <code>filter</code></td></tr>
</tbody></table>
<p>Everything else — how a card looks, how a chip is highlighted — is props. The only new pure logic is two functions, and they get tested before any component exists.</p>
${SD.luongGoEn}

<h3>🛠 Keep building the project</h3>
<p><strong>Starting point: the project after Chapter 1</strong> — <code>src/types.ts</code> (the fixed types), <code>src/du-lieu/bac-si.ts</code> (<code>danhSachBacSi</code>, the six doctors), <code>src/du-lieu/chuyen-khoa.ts</code> (<code>TEN_CHUYEN_KHOA</code>), <code>src/components/Header.tsx</code>, <code>Footer.tsx</code>, <code>TheBacSi.tsx</code> (props <code>bacSi</code>, optional <code>noiBat</code>), <code>DanhSachBacSi.tsx</code> (a section with the heading "Đội ngũ bác sĩ (N)", <code>key={bs.id}</code>, and "Chưa có bác sĩ nào." when empty), <code>App.tsx</code>, their tests, and <code>src/test/setup.ts</code> with <code>cleanup</code>. The screenshot on slide 28 is that project, running.</p>
${slide('rx-02', 28, 'Keep building: from a static list to a list that listens')}
<p><strong>Goal:</strong> the screen on slide 25 — specialty chips, an accent-insensitive name search, a heading that counts the matches ("Đội ngũ bác sĩ (N)"), a detail panel, and favourites that survive filtering.</p>
${SD.thuTuEn}
<ol>
<li><strong>Check your test setup first.</strong> The Vite template does not enable Vitest globals, and in that case Testing Library does not clean the DOM between tests by itself. When this chapter&#39;s demo was first built on the bare template, two tests that both rendered <code>&lt;App /&gt;</code> saw each other&#39;s output:
${out(OUT.cleanup)}
Chapter 1&#39;s <code>src/test/setup.ts</code> already calls <code>cleanup()</code> in <code>afterEach</code>; make sure yours does before adding sixteen new tests.</li>
<li><strong>Pure logic first, no React:</strong> <code>src/logic/loc-bac-si.ts</code> with <code>boDau(chu)</code> (remove Vietnamese accents: <code>normalize('NFD')</code>, strip the combining marks, map đ/Đ, lowercase) and <code>locBacSi(danhSach, chuyenKhoa, tuKhoa)</code>; <code>src/logic/yeu-thich.ts</code> with <code>doiYeuThich(danhSach, id)</code> returning a new array. Write their tests before any component.</li>
<li><strong>Two controlled inputs:</strong> <code>ChipChuyenKhoa</code> (props <code>giaTri</code>, <code>onDoi</code>; buttons with <code>aria-pressed</code> and <code>type="button"</code>; labels from <code>TEN_CHUYEN_KHOA</code>, plus "Tất cả") and <code>OTimBacSi</code> (a labelled <code>type="search"</code> input "Tìm theo tên").</li>
<li><strong>Extend the card without breaking Chapter 1:</strong> <code>TheBacSi</code> gets four <em>optional</em> props — <code>dangChon</code>, <code>laYeuThich</code>, <code>onXemChiTiet</code>, <code>onDoiYeuThich</code> — and draws a button only when its handler is passed, so every Chapter 1 test still passes. The buttons&#39; accessible names include the doctor&#39;s name ("Xem chi tiết BS. …", "Yêu thích BS. …"). The intro text moves from the card to the detail panel. <code>DanhSachBacSi</code> passes the new props through and gets an optional <code>thongBaoRong</code> for the empty message.</li>
<li><strong>The detail panel:</strong> <code>ChiTietBacSi</code> shows name, specialty, years, intro, a favourite toggle and "Đóng".</li>
<li><strong>The owner:</strong> <code>KhuBacSi</code> with exactly four states — <code>chuyenKhoa</code>, <code>tuKhoa</code>, <code>bacSiDangChonId</code>, <code>yeuThich</code> — and everything else computed during render. <code>App</code> renders <code>Header</code>, <code>KhuBacSi</code>, <code>Footer</code>.</li>
<li><strong>Test like a user:</strong> in <code>KhuBacSi.test.tsx</code>, click chips, type, open details, toggle favourites, and check what is on screen by role and text; add two tests for the new card props to <code>TheBacSi.test.tsx</code>.</li>
</ol>
<p><strong>Done when:</strong></p>
<ul>
<li><code>npx tsc -b</code> prints nothing, and the project&#39;s tests are all green — the solution&#39;s run is below: <code>Test Files 6 passed (6)</code>, <code>Tests 24 passed (24)</code> (8 from Chapter 1, 16 new).</li>
<li>In the browser (<code>npm run dev</code>): "Nhi" shows 2 doctors; typing "lan" shows only BS. Phạm Ngọc Lan; ♡ on a card fills the heart and the favourites box counts it; the detail panel&#39;s button says "♥ Bỏ yêu thích" for a favourite; "Da liễu" + "vy" shows the empty message. Compare with the screenshots on slide 25.</li>
<li><code>KhuBacSi</code> contains exactly four <code>useState</code> calls, and no other component of the project contains any.</li>
</ul>
${out(OUT.duAnNgan)}
<details><summary>Solution</summary>
<p><strong><code>src/test/setup.ts</code></strong></p>
${pre('ts', SN.setup)}
<p><strong><code>src/logic/loc-bac-si.ts</code></strong></p>
${pre('ts', SN.locBacSi)}
<p><strong><code>src/logic/yeu-thich.ts</code></strong></p>
${pre('ts', SN.yeuThich)}
<p><strong><code>src/components/ChipChuyenKhoa.tsx</code></strong></p>
${pre('tsx', SN.chip)}
<p><strong><code>src/components/OTimBacSi.tsx</code></strong></p>
${pre('tsx', SN.oTim)}
<p><strong><code>src/components/TheBacSi.tsx</code></strong></p>
${pre('tsx', SN.theBacSi)}
<p><strong><code>src/components/DanhSachBacSi.tsx</code></strong></p>
${pre('tsx', SN.danhSach)}
<p><strong><code>src/components/ChiTietBacSi.tsx</code></strong></p>
${pre('tsx', SN.chiTiet)}
<p><strong><code>src/components/KhuBacSi.tsx</code></strong> — shown in full earlier in this lesson. <strong><code>src/App.tsx</code></strong>:</p>
${pre('tsx', SN.app)}
<p><strong>CSS added to <code>src/App.css</code></strong> (the look of the screenshots):</p>
${pre('css', SN.css)}
<p><strong>Tests</strong> — <code>src/logic/loc-bac-si.test.ts</code>, <code>src/logic/yeu-thich.test.ts</code>, <code>src/components/KhuBacSi.test.tsx</code>, and the two tests appended to <code>src/components/TheBacSi.test.tsx</code> (add <code>userEvent</code> and <code>vi</code> to its imports):</p>
${pre('ts', SN.testLoc)}
${pre('ts', SN.testYeuThich)}
${pre('tsx', SN.testKhu)}
${pre('tsx', SN.testTheBacSi)}
</details>

<h3>Why the buttons&#39; names include the doctor&#39;s name</h3>
<p>Six cards means six "Xem chi tiết" buttons. A screen-reader user tabbing through them hears "Xem chi tiết, button" six times with no idea which doctor each one opens — and a test has the same problem. That is why the solution gives each button an <code>aria-label</code> that <em>starts with</em> the visible text and adds the name: "Xem chi tiết BS. Trần Thu Hà". Keeping the visible words at the start of the label matters: voice-control users say what they see.</p>
<div class="pitfall co-tieu-de"><strong>Trap — a query that matches nothing, or everything.</strong> With those labels, <code>getByRole('button', { name: 'Xem chi tiết' })</code> finds nothing (a string must match the <em>whole</em> accessible name), and <code>getByRole('button', { name: /Xem chi tiết/ })</code> finds six and refuses to pick one. Both messages, from a test run against <code>KhuBacSi</code>:
${out(OUT.tenTrung)}
Query by the full name ("Xem chi tiết BS. Trần Thu Hà"), or narrow the search first with <code>within(card)</code>. If you ever need a regex that matches many elements on purpose, use <code>getAllByRole</code>.</div>

<h3>The six mistakes, one last time</h3>
${slide('rx-02', 26, 'Common mistakes in Chapter 2')}
<p>Each card on the slide is a bug you have now seen with your own tests: reading state right after setting it (2.1), <code>set(x + 1)</code> several times (2.1), <code>onClick={f()}</code> (2.2), a form without <code>preventDefault</code> (2.2), <code>push</code> or in-place edits (2.3), and storing what you can compute (2.4). When the screen you just built misbehaves, go through the six in that order — together they explain almost every state bug a beginner meets.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 an assignment is usually checked by running it and clicking around in front of the lecturer; tests, when they appear, are shallow snapshots, and some older materials still mention Enzyme (<code>shallow(&lt;App /&gt;)</code>, <code>wrapper.find('.btn').simulate('click')</code>). → At work, every change like this chapter&#39;s ships with tests written with <strong>Testing Library</strong>: render the component, find elements by <strong>role and accessible name</strong> the way a user (or a screen reader) would, click and type with <code>user-event</code>, and assert on what is on screen. · <em>Why:</em> tests that use class names or component internals break every time the markup changes, even when the app still works; tests by role only break when a user would notice. Enzyme was never updated for React 18 and later — you will only meet it in old codebases. Manual clicking is still how you <em>explore</em>; the tests are how the team knows it still works next month (Chapter 9 goes deep).</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: You need to add a feature to a component that other screens already use. How do you avoid breaking them?</strong><br>A: Add new props as optional with sensible defaults, so existing call sites keep compiling and behaving the same — here <code>TheBacSi</code> got four optional props and draws its buttons only when a handler is passed. The existing tests are the proof: all eight Chapter 1 tests stayed green.</p>
<p><strong>Q: How would you test a filter-and-search screen?</strong><br>A: Test pure logic (filtering, accent removal) with plain unit tests; test the component like a user — click the chip by its role and name, type in the input found by its label, and assert on headings and text. Avoid asserting on state or class names.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic wants a "Chỉ hiện yêu thích" (favourites only) checkbox next to the search box.</p><ol>
<li>Decide first, in writing: is "favourites only" state? Who owns it? Which values become derived?</li>
<li>Add it to <code>KhuBacSi</code> — one new boolean state — and change only the derived <code>danhSachLoc</code> (the list must combine specialty, search and favourites-only). Do <em>not</em> add a state for the filtered list.</li>
<li>Write a test: favourite BS. Phạm Ngọc Lan and BS. Vũ Thảo Vy, tick the box, expect the heading "Đội ngũ bác sĩ (2)"; then click "Nhi" and expect "Đội ngũ bác sĩ (1)".</li>
<li>Measure: wrap <code>Header</code> in a <code>&lt;Profiler&gt;</code> inside <code>App</code> in a test and confirm that ticking the box does not re-render it.</li>
</ol><p><strong>Done when:</strong> the new tests pass along with the 24 existing ones, <code>KhuBacSi</code> has five <code>useState</code> calls and still no stored list, and the Profiler test records only <code>mount</code> for <code>Header</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">accessible name</span><span class="v">the name assistive technology reads for an element: its text, its <code>&lt;label&gt;</code>, or its <code>aria-label</code></span></div>
<div class="kv"><span class="k"><code>aria-pressed</code></span><span class="v">marks a toggle button as on/off; used for the chips and the ♡ buttons</span></div>
<div class="kv"><span class="k"><code>getByRole</code></span><span class="v">Testing Library query by role and name — the way a user finds things</span></div>
<div class="kv"><span class="k"><code>within(el)</code></span><span class="v">limits queries to inside one element, e.g. one card or the detail panel</span></div>
<div class="kv"><span class="k"><code>user-event</code></span><span class="v">simulates real typing and clicking, including focus and key events</span></div>
<div class="kv"><span class="k">optional prop</span><span class="v"><code>onXemChiTiet?:</code> — callers may omit it; the component must work without it</span></div>
<div class="kv"><span class="k">accent-insensitive search</span><span class="v"><code>normalize('NFD')</code> + removing combining marks + đ→d, applied to both sides</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Plan first: list each value, who changes it, who needs it, and whether it can be computed.</li>
<li>Four pieces of state in <code>KhuBacSi</code>; the filtered list, the selected doctor and the favourite doctors are derived.</li>
<li>Pure logic (<code>boDau</code>, <code>locBacSi</code>, <code>doiYeuThich</code>) lives outside components and is tested without React.</li>
<li>Extend shared components with optional props so earlier callers and tests keep working (8 old + 16 new tests green).</li>
<li>Give repeated buttons unique accessible names that start with their visible text; query tests by role and full name.</li>
<li>The result builds (<code>vite build</code>) and matches the screenshots — the starting point for Chapter 3&#39;s booking form.</li>
</ul>

${LINK('https://react.dev/learn/thinking-in-react', '📄', 'react.dev — Thinking in React', 'The five steps from mock-up to working UI that this lesson followed.')}
${LINK('https://react.dev/learn/typescript', '📄', 'react.dev — Using TypeScript', 'Typing props, optional props, useState and event handlers.')}
${LINK('https://github.com/testing-library/react-testing-library', '🧰', 'React Testing Library on GitHub', 'The guiding principle: test the way the software is used.')}
${LINK('https://github.com/testing-library/user-event', '🧰', 'user-event on GitHub', 'Simulating typing and clicks the way a browser does.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Dựng màn hình bác sĩ: lọc, tìm, chi tiết và yêu thích</h2>
<p class="lead">Bốn bài, một màn hình. Bài này là lúc bạn thôi đọc và bắt đầu gõ: lấy dự án như Chương 1 để lại — một danh sách tĩnh sáu bác sĩ — và biến nó thành một màn hình biết nghe: chip chuyên khoa, ô tìm bỏ qua dấu tiếng Việt, khung chi tiết và danh sách yêu thích, tất cả chạy bằng bốn mẩu state trong một component và được mười sáu test mới bảo vệ.</p>
<p>Mọi thứ dưới đây đã được dựng và chạy trong dự án của chương, trên đúng ảnh chụp dự án sau Chương 1: <code>npx tsc -b</code> sạch, <code>npx vitest run</code> của dự án xanh, <code>npx vite build</code> thành công, và ảnh chụp do Playwright chụp từ bản build production. Hãy tự làm từng bước trước khi mở lời giải.</p>

<h3>Thứ bạn sẽ dựng</h3>
${slide('rx-02', 25, 'Kết quả chương: lọc, tìm không dấu, xem chi tiết, yêu thích (ảnh chụp thật)')}
${slide('rx-02', 25, 'Kết quả chương: lọc, tìm không dấu, xem chi tiết, yêu thích (ảnh chụp thật)')}
<p>Ghép lại, bốn bài của chương cho dự án màn hình tương tác đầu tiên. Ảnh trên slide do Playwright chụp từ bản build production (<code>vite build</code> + <code>vite preview</code>): sau khi bấm "Xem chi tiết" BS. Trần Thu Hà và ♡ cho Hà và Lan; sau khi gõ "lan" không dấu; và trạng thái rỗng khi chọn "Da liễu" + gõ "vy". Bản build:</p>
${out(OUT.build)}

<h3>Lên kế hoạch trước khi gõ</h3>
<p>Bài 2.4 hỏi mỗi giá trị hai câu: <em>ai cần nó?</em> và <em>có tính được không?</em> Trả lời trên giấy trước là phần lớn công việc:</p>
<table>
<thead><tr><th>Giá trị</th><th>Ai đổi</th><th>Ai cần</th><th>Vậy nó là…</th></tr></thead>
<tbody>
<tr><td>chuyên khoa đang chọn</td><td>bấm chip</td><td>hàng chip, danh sách</td><td>state trong <code>KhuBacSi</code></td></tr>
<tr><td>chữ đang tìm</td><td>gõ phím</td><td>ô nhập, danh sách</td><td>state trong <code>KhuBacSi</code></td></tr>
<tr><td>bác sĩ đang chọn</td><td>"Xem chi tiết", "Đóng"</td><td>các thẻ, khung chi tiết</td><td>state (một <strong>id</strong>) trong <code>KhuBacSi</code></td></tr>
<tr><td>danh sách yêu thích</td><td>♡ trên thẻ hoặc trong khung</td><td>thẻ, khung, hộp yêu thích</td><td>state (mảng id) trong <code>KhuBacSi</code></td></tr>
<tr><td>danh sách đã lọc</td><td>—</td><td>danh sách</td><td>dẫn xuất: <code>locBacSi(…)</code></td></tr>
<tr><td>object bác sĩ đang chọn, các bác sĩ yêu thích</td><td>—</td><td>khung, hộp yêu thích</td><td>dẫn xuất: <code>find</code>, <code>filter</code></td></tr>
</tbody></table>
<p>Mọi thứ còn lại — thẻ trông ra sao, chip tô sáng thế nào — là props. Logic thuần mới chỉ có hai hàm, và chúng được test trước khi có component nào.</p>
${SD.luongGoVi}

<h3>🛠 Tự gõ tiếp dự án</h3>
<p><strong>Điểm xuất phát: dự án sau Chương 1</strong> — <code>src/types.ts</code> (các kiểu cố định), <code>src/du-lieu/bac-si.ts</code> (<code>danhSachBacSi</code>, sáu bác sĩ), <code>src/du-lieu/chuyen-khoa.ts</code> (<code>TEN_CHUYEN_KHOA</code>), <code>src/components/Header.tsx</code>, <code>Footer.tsx</code>, <code>TheBacSi.tsx</code> (props <code>bacSi</code>, <code>noiBat</code> không bắt buộc), <code>DanhSachBacSi.tsx</code> (một section có tiêu đề "Đội ngũ bác sĩ (N)", <code>key={bs.id}</code>, và "Chưa có bác sĩ nào." khi rỗng), <code>App.tsx</code>, các test của chúng, và <code>src/test/setup.ts</code> có <code>cleanup</code>. Ảnh trên slide 28 chính là dự án đó đang chạy.</p>
${slide('rx-02', 28, 'Tự gõ tiếp dự án: từ danh sách tĩnh tới danh sách biết nghe')}
<p><strong>Mục tiêu:</strong> màn hình ở slide 25 — chip chuyên khoa, ô tìm tên không phân biệt dấu, tiêu đề đếm số bác sĩ khớp ("Đội ngũ bác sĩ (N)"), khung chi tiết, và danh sách yêu thích không mất khi lọc.</p>
${SD.thuTuVi}
<ol>
<li><strong>Kiểm phần cài đặt test trước.</strong> Template Vite không bật globals của Vitest, và khi đó Testing Library không tự dọn DOM giữa các test. Lần đầu dựng ví dụ của chương trên template trần, hai test cùng render <code>&lt;App /&gt;</code> nhìn thấy output của nhau:
${out(OUT.cleanup)}
<code>src/test/setup.ts</code> của Chương 1 đã gọi <code>cleanup()</code> trong <code>afterEach</code>; bảo đảm file của bạn cũng vậy trước khi thêm mười sáu test mới.</li>
<li><strong>Logic thuần trước, chưa cần React:</strong> <code>src/logic/loc-bac-si.ts</code> có <code>boDau(chu)</code> (bỏ dấu tiếng Việt: <code>normalize('NFD')</code>, bỏ các dấu kết hợp, đổi đ/Đ, chuyển chữ thường) và <code>locBacSi(danhSach, chuyenKhoa, tuKhoa)</code>; <code>src/logic/yeu-thich.ts</code> có <code>doiYeuThich(danhSach, id)</code> trả về mảng mới. Viết test cho chúng trước mọi component.</li>
<li><strong>Hai ô điều khiển (controlled):</strong> <code>ChipChuyenKhoa</code> (props <code>giaTri</code>, <code>onDoi</code>; các nút có <code>aria-pressed</code> và <code>type="button"</code>; nhãn lấy từ <code>TEN_CHUYEN_KHOA</code>, thêm "Tất cả") và <code>OTimBacSi</code> (một ô <code>type="search"</code> có nhãn "Tìm theo tên").</li>
<li><strong>Mở rộng thẻ mà không làm hỏng Chương 1:</strong> <code>TheBacSi</code> thêm bốn prop <em>không bắt buộc</em> — <code>dangChon</code>, <code>laYeuThich</code>, <code>onXemChiTiet</code>, <code>onDoiYeuThich</code> — và chỉ vẽ nút khi handler của nó được truyền, nên mọi test của Chương 1 vẫn xanh. Tên dễ tiếp cận (accessible name) của các nút có tên bác sĩ ("Xem chi tiết BS. …", "Yêu thích BS. …"). Phần giới thiệu chuyển từ thẻ sang khung chi tiết. <code>DanhSachBacSi</code> chuyền các prop mới xuống và có thêm <code>thongBaoRong</code> không bắt buộc cho câu báo rỗng.</li>
<li><strong>Khung chi tiết:</strong> <code>ChiTietBacSi</code> hiện tên, chuyên khoa, số năm, giới thiệu, nút bật/tắt yêu thích và "Đóng".</li>
<li><strong>Chủ sở hữu:</strong> <code>KhuBacSi</code> với đúng bốn state — <code>chuyenKhoa</code>, <code>tuKhoa</code>, <code>bacSiDangChonId</code>, <code>yeuThich</code> — mọi thứ khác tính trong render. <code>App</code> vẽ <code>Header</code>, <code>KhuBacSi</code>, <code>Footer</code>.</li>
<li><strong>Test như người dùng:</strong> trong <code>KhuBacSi.test.tsx</code>, bấm chip, gõ chữ, mở chi tiết, bật/tắt yêu thích, và kiểm thứ trên màn hình theo vai trò và chữ; thêm hai test cho prop mới của thẻ vào <code>TheBacSi.test.tsx</code>.</li>
</ol>
<p><strong>Đạt khi:</strong></p>
<ul>
<li><code>npx tsc -b</code> không in gì, và test của dự án xanh hết — lần chạy của lời giải ở dưới: <code>Test Files 6 passed (6)</code>, <code>Tests 24 passed (24)</code> (8 của Chương 1, 16 mới).</li>
<li>Trên trình duyệt (<code>npm run dev</code>): "Nhi" hiện 2 bác sĩ; gõ "lan" chỉ còn BS. Phạm Ngọc Lan; ♡ trên thẻ tô đầy trái tim và hộp yêu thích đếm nó; nút trong khung chi tiết ghi "♥ Bỏ yêu thích" với bác sĩ đã yêu thích; "Da liễu" + "vy" hiện câu báo rỗng. So với các ảnh chụp ở slide 25.</li>
<li><code>KhuBacSi</code> có đúng bốn lời gọi <code>useState</code>, và không component nào khác của dự án có.</li>
</ul>
${out(OUT.duAnNgan)}
<details><summary>Lời giải</summary>
<p><strong><code>src/test/setup.ts</code></strong></p>
${pre('ts', SN.setup)}
<p><strong><code>src/logic/loc-bac-si.ts</code></strong></p>
${pre('ts', SN.locBacSi)}
<p><strong><code>src/logic/yeu-thich.ts</code></strong></p>
${pre('ts', SN.yeuThich)}
<p><strong><code>src/components/ChipChuyenKhoa.tsx</code></strong></p>
${pre('tsx', SN.chip)}
<p><strong><code>src/components/OTimBacSi.tsx</code></strong></p>
${pre('tsx', SN.oTim)}
<p><strong><code>src/components/TheBacSi.tsx</code></strong></p>
${pre('tsx', SN.theBacSi)}
<p><strong><code>src/components/DanhSachBacSi.tsx</code></strong></p>
${pre('tsx', SN.danhSach)}
<p><strong><code>src/components/ChiTietBacSi.tsx</code></strong></p>
${pre('tsx', SN.chiTiet)}
<p><strong><code>src/components/KhuBacSi.tsx</code></strong> — đã in đầy đủ ở phần trên của bài. <strong><code>src/App.tsx</code></strong>:</p>
${pre('tsx', SN.app)}
<p><strong>CSS thêm vào <code>src/App.css</code></strong> (giao diện như ảnh chụp):</p>
${pre('css', SN.css)}
<p><strong>Test</strong> — <code>src/logic/loc-bac-si.test.ts</code>, <code>src/logic/yeu-thich.test.ts</code>, <code>src/components/KhuBacSi.test.tsx</code>, và hai test nối vào cuối <code>src/components/TheBacSi.test.tsx</code> (thêm <code>userEvent</code> và <code>vi</code> vào phần import của file đó):</p>
${pre('ts', SN.testLoc)}
${pre('ts', SN.testYeuThich)}
${pre('tsx', SN.testKhu)}
${pre('tsx', SN.testTheBacSi)}
</details>

<h3>Vì sao tên của các nút có tên bác sĩ</h3>
<p>Sáu thẻ nghĩa là sáu nút "Xem chi tiết". Người dùng trình đọc màn hình nhấn Tab qua chúng sẽ nghe "Xem chi tiết, nút" sáu lần mà không biết nút nào mở bác sĩ nào — và test cũng gặp đúng vấn đề đó. Vì vậy lời giải cho mỗi nút một <code>aria-label</code> <em>bắt đầu bằng</em> chữ đang hiện và thêm tên: "Xem chi tiết BS. Trần Thu Hà". Giữ chữ đang hiện ở đầu nhãn là quan trọng: người điều khiển bằng giọng nói sẽ đọc đúng thứ họ nhìn thấy.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — câu truy vấn không khớp gì, hoặc khớp tất cả.</strong> Với các nhãn đó, <code>getByRole('button', { name: 'Xem chi tiết' })</code> không tìm thấy gì (chuỗi phải khớp <em>toàn bộ</em> tên dễ tiếp cận), còn <code>getByRole('button', { name: /Xem chi tiết/ })</code> tìm thấy sáu và từ chối chọn một. Cả hai thông báo, từ một lần chạy test trên <code>KhuBacSi</code>:
${out(OUT.tenTrung)}
Truy vấn bằng tên đầy đủ ("Xem chi tiết BS. Trần Thu Hà"), hoặc thu hẹp trước bằng <code>within(the)</code>. Khi thật sự cần một regex khớp nhiều phần tử, dùng <code>getAllByRole</code>.</div>

<h3>Sáu sai lầm, lần cuối</h3>
${slide('rx-02', 26, 'Sai lầm hay gặp ở Chương 2')}
<p>Mỗi thẻ trên slide là một bug bạn đã tận mắt thấy bằng test của mình: đọc state ngay sau khi set (2.1), <code>set(x + 1)</code> nhiều lần (2.1), <code>onClick={f()}</code> (2.2), form thiếu <code>preventDefault</code> (2.2), <code>push</code> hay sửa tại chỗ (2.3), và cất thứ tính được (2.4). Khi màn hình vừa dựng chạy sai, đi qua sáu điều đó theo đúng thứ tự — gộp lại, chúng giải thích gần như mọi bug state mà người mới gặp.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, bài làm thường được kiểm bằng cách chạy lên rồi bấm thử trước mặt giảng viên; test, nếu có, là snapshot nông, và vài tài liệu cũ vẫn nhắc Enzyme (<code>shallow(&lt;App /&gt;)</code>, <code>wrapper.find('.btn').simulate('click')</code>). → Đi làm, mỗi thay đổi như của chương này đi kèm test viết bằng <strong>Testing Library</strong>: render component, tìm phần tử theo <strong>vai trò và tên dễ tiếp cận</strong> như người dùng (hay trình đọc màn hình) tìm, bấm và gõ bằng <code>user-event</code>, rồi khẳng định thứ đang hiện trên màn hình. · <em>Vì sao:</em> test dựa vào tên class hay nội tạng component vỡ mỗi lần markup đổi, kể cả khi ứng dụng vẫn chạy; test theo vai trò chỉ vỡ khi người dùng sẽ nhận ra. Enzyme không được cập nhật cho React 18 trở đi — bạn chỉ gặp nó trong mã cũ. Bấm tay vẫn là cách bạn <em>khám phá</em>; test là cách cả đội biết nó vẫn chạy vào tháng sau (Chương 9 đi sâu).</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Bạn cần thêm tính năng vào một component mà các màn hình khác đang dùng. Làm sao để không làm hỏng chúng?</strong><br>Đáp: Thêm prop mới dạng không bắt buộc, có mặc định hợp lý, để mọi chỗ đang gọi vẫn biên dịch và chạy như cũ — ở đây <code>TheBacSi</code> thêm bốn prop không bắt buộc và chỉ vẽ nút khi handler được truyền. Test đang có là bằng chứng: cả tám test của Chương 1 vẫn xanh.</p>
<p><strong>Hỏi: Bạn test một màn hình lọc-và-tìm thế nào?</strong><br>Đáp: Test logic thuần (lọc, bỏ dấu) bằng unit test thường; test component như người dùng — bấm chip theo vai trò và tên, gõ vào ô tìm thấy qua nhãn, rồi khẳng định tiêu đề và chữ. Tránh khẳng định state hay tên class.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> phòng khám muốn một ô đánh dấu "Chỉ hiện yêu thích" cạnh ô tìm kiếm.</p><ol>
<li>Quyết định trước, viết ra giấy: "chỉ hiện yêu thích" có phải state không? Ai sở hữu? Giá trị nào thành dẫn xuất?</li>
<li>Thêm nó vào <code>KhuBacSi</code> — một state boolean mới — và chỉ sửa giá trị dẫn xuất <code>danhSachLoc</code> (danh sách phải kết hợp chuyên khoa, tìm kiếm và chỉ-yêu-thích). <em>Không</em> thêm state cho danh sách đã lọc.</li>
<li>Viết test: yêu thích BS. Phạm Ngọc Lan và BS. Vũ Thảo Vy, đánh dấu ô, mong tiêu đề "Đội ngũ bác sĩ (2)"; rồi bấm "Nhi" và mong "Đội ngũ bác sĩ (1)".</li>
<li>Đo: trong test, bọc <code>Header</code> bằng <code>&lt;Profiler&gt;</code> bên trong <code>App</code> và khẳng định việc đánh dấu ô không làm nó render lại.</li>
</ol><p><strong>Đạt khi:</strong> test mới xanh cùng 24 test đang có, <code>KhuBacSi</code> có năm lời gọi <code>useState</code> và vẫn không cất danh sách nào, và test Profiler chỉ ghi <code>mount</code> cho <code>Header</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">accessible name (tên dễ tiếp cận)</span><span class="v">tên mà công nghệ hỗ trợ đọc cho một phần tử: chữ của nó, <code>&lt;label&gt;</code> của nó, hoặc <code>aria-label</code></span></div>
<div class="kv"><span class="k"><code>aria-pressed</code></span><span class="v">đánh dấu nút bật/tắt đang bật hay tắt; dùng cho chip và nút ♡</span></div>
<div class="kv"><span class="k"><code>getByRole</code></span><span class="v">truy vấn của Testing Library theo vai trò và tên — cách người dùng tìm thứ họ cần</span></div>
<div class="kv"><span class="k"><code>within(el)</code></span><span class="v">giới hạn truy vấn bên trong một phần tử, vd một thẻ hay khung chi tiết</span></div>
<div class="kv"><span class="k"><code>user-event</code></span><span class="v">giả lập gõ và bấm thật, gồm cả focus và sự kiện phím</span></div>
<div class="kv"><span class="k">prop không bắt buộc</span><span class="v"><code>onXemChiTiet?:</code> — nơi gọi có thể bỏ qua; component phải chạy được khi thiếu nó</span></div>
<div class="kv"><span class="k">tìm không phân biệt dấu</span><span class="v"><code>normalize('NFD')</code> + bỏ dấu kết hợp + đ→d, áp cho cả hai phía</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lên kế hoạch trước: liệt kê từng giá trị, ai đổi nó, ai cần nó, và có tính được không.</li>
<li>Bốn mẩu state trong <code>KhuBacSi</code>; danh sách đã lọc, bác sĩ đang chọn và các bác sĩ yêu thích là dẫn xuất.</li>
<li>Logic thuần (<code>boDau</code>, <code>locBacSi</code>, <code>doiYeuThich</code>) nằm ngoài component và được test không cần React.</li>
<li>Mở rộng component dùng chung bằng prop không bắt buộc để nơi gọi và test cũ vẫn chạy (8 test cũ + 16 test mới xanh).</li>
<li>Cho các nút lặp lại tên dễ tiếp cận riêng, bắt đầu bằng chữ đang hiện; test truy vấn theo vai trò và tên đầy đủ.</li>
<li>Kết quả build được (<code>vite build</code>) và khớp ảnh chụp — điểm xuất phát cho form đặt lịch ở Chương 3.</li>
</ul>

${LINK('https://react.dev/learn/thinking-in-react', '📄', 'react.dev — Thinking in React', 'Năm bước từ bản vẽ tới giao diện chạy được mà bài này đã đi theo.')}
${LINK('https://react.dev/learn/typescript', '📄', 'react.dev — Using TypeScript', 'Gõ kiểu cho props, prop không bắt buộc, useState và handler.')}
${LINK('https://github.com/testing-library/react-testing-library', '🧰', 'React Testing Library trên GitHub', 'Nguyên tắc chủ đạo: test theo cách phần mềm được dùng.')}
${LINK('https://github.com/testing-library/user-event', '🧰', 'user-event trên GitHub', 'Giả lập gõ và bấm như trình duyệt làm.')}
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'rx-2-6-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 2 đã đo: ảnh chụp state, hàng đợi cập nhật, onClick gọi ngay, batching, sửa thẳng object, phương thức mảng, spread nông, form tải lại trang, state thừa và chỗ đặt state.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>What Chapter 2 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Most of them show a few lines of code and ask what the screen (or the console) shows — and every answer is something the chapter ran, not a sentence from a summary. Two of them are traps that look right until you remember the snapshot.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a local variable does not update the screen, and what <code>useState</code> does on the first and on later renders.</li>
<li>I can predict the value after several setter calls in one event, with values and with updater functions.</li>
<li>I can write handlers that receive arguments, stop bubbling, and prevent a form from reloading the page — with the right TypeScript event types.</li>
<li>I can update nested objects and arrays without mutation, and name the array methods that change the original.</li>
<li>I can decide which component owns a piece of state, and which values should be computed instead of stored.</li>
<li>I can build the chapter&#39;s screen — filter, search, details, favourites — with its tests green.</li>
</ul>
${slide('rx-02', 27, 'Chapter 2 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Chương 2 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Phần lớn đưa vài dòng mã và hỏi màn hình (hoặc console) hiện gì — và mọi đáp án là thứ chương đã chạy, không phải một câu trong bản tóm tắt. Có hai câu là bẫy, trông đúng cho tới khi bạn nhớ ra ảnh chụp state.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao biến cục bộ không cập nhật màn hình, và <code>useState</code> làm gì ở lần render đầu và các lần sau.</li>
<li>Tôi đoán đúng giá trị sau nhiều lời gọi set trong một sự kiện, với giá trị lẫn với hàm cập nhật.</li>
<li>Tôi viết được handler nhận tham số, chặn nổi bọt, và giữ form khỏi tải lại trang — với đúng kiểu sự kiện TypeScript.</li>
<li>Tôi cập nhật được object lồng nhau và mảng mà không đột biến, và kể được các phương thức mảng sửa mảng gốc.</li>
<li>Tôi quyết định được component nào sở hữu một mẩu state, và giá trị nào nên tính thay vì cất.</li>
<li>Tôi dựng được màn hình của chương — lọc, tìm, chi tiết, yêu thích — với test xanh.</li>
</ul>
${slide('rx-02', 27, 'Bảng tra nhanh Chương 2')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'dem is 0. A button runs: setDem(dem + 1); setDem(dem + 1); console.log(dem). After one click, what does the screen show and what does the console print?|||dem đang là 0. Một nút chạy: setDem(dem + 1); setDem(dem + 1); console.log(dem). Sau một cú bấm, màn hình hiện gì và console in gì?',
            options: [
              'Screen 2, console 2|||Màn hình 2, console 2',
              'Screen 1, console 0|||Màn hình 1, console 0',
              'Screen 2, console 0|||Màn hình 2, console 0',
              'Screen 1, console 1|||Màn hình 1, console 1',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Inside this render dem is a constant 0 (a snapshot), so both calls mean “next render: use 1” and the log prints 0 — Lesson 2.1 measured exactly this: “Số lượt: 1”, console “soLuot = 0”. “Screen 2” is tempting because two calls look like two increments, but only updater functions (d => d + 1) queue on top of each other.|||VI: Trong lần render này dem là hằng số 0 (ảnh chụp), nên cả hai lời gọi đều nghĩa là “lần render sau: dùng 1” và dòng log in 0 — Bài 2.1 đo đúng điều này: “Số lượt: 1”, console “soLuot = 0”. “Màn hình 2” hấp dẫn vì hai lời gọi trông như hai lần cộng, nhưng chỉ hàm cập nhật (d => d + 1) mới xếp chồng lên nhau.',
          },
          {
            question: 'count is 0. One click handler runs: setCount(5); setCount(n => n + 1). What is count after the re-render?|||count đang là 0. Một handler chạy: setCount(5); setCount(n => n + 1). Sau lần render lại, count bằng bao nhiêu?',
            options: ['1', '5', '6', '7'],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: React processes the queue in order: “replace with 5”, then the updater receives 5 and returns 6. The answer 1 is tempting if you think the updater starts from the snapshot 0; it does not — updaters receive the result of the previous item in the queue.|||VI: React xử lý hàng đợi theo thứ tự: “thay bằng 5”, rồi hàm cập nhật nhận 5 và trả 6. Đáp án 1 hấp dẫn nếu bạn nghĩ hàm cập nhật bắt đầu từ ảnh chụp 0; không phải — hàm cập nhật nhận kết quả của phần tử đứng trước trong hàng đợi.',
          },
          {
            question: 'A card renders <button onClick={xoaYeuThich(bacSi.id)}>Bỏ</button>, and xoaYeuThich calls a state setter. What happens?|||Một thẻ vẽ <button onClick={xoaYeuThich(bacSi.id)}>Bỏ</button>, và xoaYeuThich gọi một hàm set state. Chuyện gì xảy ra?',
            options: [
              'The function runs during render, sets state, renders again… React throws “Too many re-renders”|||Hàm chạy ngay lúc render, đặt state, render lại… React ném lỗi “Too many re-renders”',
              'It works: React calls xoaYeuThich only when the button is clicked|||Chạy được: React chỉ gọi xoaYeuThich khi nút được bấm',
              'The click does nothing, but there is no error|||Bấm không có tác dụng gì, nhưng không có lỗi',
              'React calls it once on the first render and then ignores it|||React gọi nó một lần ở lần render đầu rồi bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The parentheses call the function immediately; its return value (undefined) is what onClick receives. Because it sets state, each render schedules another one, and React stops the loop — Lesson 2.2 pasted the real message, and tsc had already refused it with TS2322 (“void is not assignable to MouseEventHandler”). “Does nothing, no error” is what happens when the called function does NOT set state. Fix: onClick={() => xoaYeuThich(bacSi.id)}.|||VI: Cặp ngoặc gọi hàm ngay; giá trị trả về (undefined) mới là thứ onClick nhận. Vì hàm đặt state, mỗi lần render lại lên lịch một lần render nữa, và React dừng vòng lặp — Bài 2.2 dán thông báo thật, và tsc đã từ chối trước đó bằng TS2322 (“void is not assignable to MouseEventHandler”). “Không tác dụng, không lỗi” là chuyện xảy ra khi hàm được gọi KHÔNG đặt state. Sửa: onClick={() => xoaYeuThich(bacSi.id)}.',
          },
          {
            question: 'Without StrictMode, a click handler calls setA(a + 1) and setB(b + 1). A <Profiler> wraps the component. How many commits does that one click add?|||Không có StrictMode, một handler gọi setA(a + 1) và setB(b + 1). Một <Profiler> bọc component. Cú bấm đó thêm bao nhiêu lần commit?',
            options: ['0', '1', '2', '3'],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: React batches all updates made during one event and renders once — the chapter measured “mount+dongbo = 2”, i.e. one commit for the click. Since React 18 the same happens inside setTimeout (measured: +1). “2” is the tempting answer if you imagine each setter rendering immediately.|||VI: React gộp mọi cập nhật trong một sự kiện và render một lần — chương đo được “mount+dongbo = 2”, tức một commit cho cú bấm. Từ React 18 điều này cũng đúng bên trong setTimeout (đo được: +1). “2” là đáp án hấp dẫn nếu bạn hình dung mỗi hàm set render ngay lập tức.',
          },
          {
            question: 'State bn = { hoTen: "Nguyễn Văn A", … }. A handler does bn.hoTen = "Trần Thị B"; setBn(bn). What does the user see?|||State bn = { hoTen: "Nguyễn Văn A", … }. Một handler làm bn.hoTen = "Trần Thị B"; setBn(bn). Người dùng thấy gì?',
            options: [
              'The new name immediately|||Tên mới ngay lập tức',
              'Still the old name — until some other state change re-renders the component, then the new name appears|||Vẫn tên cũ — cho tới khi một thay đổi state khác làm component render lại, lúc đó tên mới hiện ra',
              'An error: state objects are frozen in development|||Một lỗi: object trong state bị đóng băng ở chế độ dev',
              'The new name, then the old one again on the next render|||Tên mới, rồi lại tên cũ ở lần render sau',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: setBn receives the same object, Object.is(old, new) is true, React skips the render. But the object in memory was changed, so the next render caused by anything else shows it — the test in 2.3 recorded “Nguyễn Văn A” after the click and “Trần Thị B” after an unrelated click. React does not freeze state objects, so there is no error. Fix: setBn({ ...bn, hoTen: "Trần Thị B" }).|||VI: setBn nhận đúng object cũ, Object.is(cũ, mới) là true, React bỏ qua render. Nhưng object trong bộ nhớ đã bị sửa, nên lần render kế tiếp do bất cứ thứ gì khác gây ra sẽ hiện nó — test ở 2.3 ghi “Nguyễn Văn A” sau cú bấm và “Trần Thị B” sau một cú bấm chẳng liên quan. React không đóng băng object trong state, nên không có lỗi. Sửa: setBn({ ...bn, hoTen: "Trần Thị B" }).',
          },
          {
            question: 'You need the doctors sorted by experience for display, without changing the array you received as a prop. Which call is safe?|||Bạn cần danh sách bác sĩ sắp theo kinh nghiệm để hiển thị, mà không đổi mảng nhận qua prop. Lời gọi nào an toàn?',
            options: [
              'danhSach.sort((a, b) => b.namKinhNghiem - a.namKinhNghiem)',
              'danhSach.splice(0, danhSach.length, …sorted)',
              'danhSach.toSorted((a, b) => b.namKinhNghiem - a.namKinhNghiem)',
              'danhSach.reverse()',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: toSorted (ES2023) returns a new sorted array and leaves the original alone. sort is the tempting one because it returns an array — but it returns the SAME array, reordered: the chapter measured “sort tra ve chinh a: true”, and sorting a prop inside render permanently reordered the array that was passed in (bs-6,bs-4,bs-1,…). splice and reverse also change the original.|||VI: toSorted (ES2023) trả về mảng mới đã sắp và để nguyên mảng gốc. sort là phương án hấp dẫn vì nó trả về một mảng — nhưng là CHÍNH mảng đó, đã bị xếp lại: chương đo được “sort tra ve chinh a: true”, và sort một prop trong render làm mảng được truyền vào bị xếp lại vĩnh viễn (bs-6,bs-4,bs-1,…). splice và reverse cũng sửa mảng gốc.',
          },
          {
            question: 'lh is an appointment with a nested benhNhan object. Code: const moi = { ...lh }; moi.benhNhan.soDienThoai = "0987654321". What happened to lh?|||lh là một lịch hẹn có object benhNhan lồng bên trong. Mã: const moi = { ...lh }; moi.benhNhan.soDienThoai = "0987654321". lh đã bị gì?',
            options: [
              'Nothing — moi is a full copy|||Không gì cả — moi là một bản chép đầy đủ',
              'lh itself is now the same object as moi|||Chính lh giờ là cùng object với moi',
              'TypeScript refuses to compile the assignment|||TypeScript từ chối biên dịch phép gán',
              'lh.benhNhan.soDienThoai is also "0987654321" — the nested object is shared|||lh.benhNhan.soDienThoai cũng thành "0987654321" — object lồng được dùng chung',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Spread is a shallow copy: moi is a new object, but moi.benhNhan is the same object as lh.benhNhan, so changing it changes both — the test “bẫy: spread chỉ chép MỘT tầng” printed the changed name on the original. “A full copy” is the tempting misconception. Correct: { ...lh, benhNhan: { ...lh.benhNhan, soDienThoai: so } }.|||VI: Spread là sao chép nông: moi là object mới, nhưng moi.benhNhan là cùng object với lh.benhNhan, nên sửa nó là sửa cả hai — test “bẫy: spread chỉ chép MỘT tầng” in ra tên đã bị đổi trên bản gốc. “Bản chép đầy đủ” là hiểu lầm hấp dẫn. Đúng: { ...lh, benhNhan: { ...lh.benhNhan, soDienThoai: so } }.',
          },
          {
            question: 'A search <form onSubmit={xuLyGui}> has no preventDefault in xuLyGui. In a real browser, the user types "lan" and presses Enter. What happens?|||Một <form onSubmit={xuLyGui}> tìm kiếm, trong xuLyGui không có preventDefault. Trên trình duyệt thật, người dùng gõ "lan" rồi nhấn Enter. Chuyện gì xảy ra?',
            options: [
              'Nothing: React forms never submit to the server|||Không gì cả: form của React không bao giờ gửi lên server',
              'xuLyGui does not run at all|||xuLyGui hoàn toàn không chạy',
              'Only the input is cleared|||Chỉ ô nhập bị xoá',
              'xuLyGui runs, then the browser loads the page again (?tu=lan) and all React state is lost|||xuLyGui chạy, rồi trình duyệt tải lại trang (?tu=lan) và toàn bộ state React mất sạch',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The handler runs, and then the browser performs the form’s default action — a GET navigation to the same page with the fields in the query string. Measured with Playwright in Chromium: “onSubmit chạy”, load count 1 → 2, URL …/?tu=lan, the page back at its initial screen. “React forms never submit” is the tempting belief; React does not cancel the default for you. Fix: e.preventDefault() first.|||VI: Handler chạy, rồi trình duyệt làm hành động mặc định của form — chuyển trang GET tới chính trang đó với các trường trong chuỗi truy vấn. Đo bằng Playwright trên Chromium: “onSubmit chạy”, số lần tải 1 → 2, URL …/?tu=lan, trang về màn hình ban đầu. “Form React không bao giờ gửi” là niềm tin hấp dẫn; React không huỷ hành động mặc định hộ bạn. Sửa: gọi e.preventDefault() đầu tiên.',
          },
          {
            question: 'A component keeps both tuKhoa and ketQua in state. On change it runs: setTuKhoa(moi); setKetQua(locBacSi(ds, "tat-ca", tuKhoa)). The user types "huy". Which doctors are shown?|||Một component giữ cả tuKhoa và ketQua trong state. Khi ô đổi nó chạy: setTuKhoa(moi); setKetQua(locBacSi(ds, "tat-ca", tuKhoa)). Người dùng gõ "huy". Bác sĩ nào hiện ra?',
            options: [
              'BS. Trần Thu Hà and BS. Hoàng Đức Huy — the list is one keystroke behind|||BS. Trần Thu Hà và BS. Hoàng Đức Huy — danh sách chậm một phím',
              'Only BS. Hoàng Đức Huy|||Chỉ BS. Hoàng Đức Huy',
              'All six doctors, because ketQua never updates|||Cả sáu bác sĩ, vì ketQua không bao giờ cập nhật',
              'Nobody, because the two setters conflict|||Không ai, vì hai hàm set xung đột nhau',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: In the handler, tuKhoa is the snapshot from before the last key — “hu” — and “hu” matches “Trần Thu Hà” as well as “Hoàng Đức Huy”. Lesson 2.4 measured exactly “Kết quả: BS. Trần Thu Hà, BS. Hoàng Đức Huy”. “Only Huy” is what you get when you compute the list during render instead of storing it — which is the fix.|||VI: Trong handler, tuKhoa là ảnh chụp trước phím cuối — “hu” — và “hu” khớp cả “Trần Thu Hà” lẫn “Hoàng Đức Huy”. Bài 2.4 đo đúng “Kết quả: BS. Trần Thu Hà, BS. Hoàng Đức Huy”. “Chỉ Huy” là kết quả khi bạn tính danh sách trong render thay vì cất nó — đó chính là cách sửa.',
          },
          {
            question: 'Inside KhuBacSi, ChipChuyenKhoa (the chips) and DanhSachBacSi (the list) both need the selected specialty. Header is a sibling of KhuBacSi under App and does not need it. Where should the state live?|||Bên trong KhuBacSi, ChipChuyenKhoa (hàng chip) và DanhSachBacSi (danh sách) đều cần chuyên khoa đang chọn. Header là anh em của KhuBacSi dưới App và không cần nó. State nên ở đâu?',
            options: [
              'In App, at the top, so everything can reach it|||Ở App, trên đỉnh, để mọi thứ đều với tới',
              'One copy in each of the two children|||Mỗi con giữ một bản',
              'In KhuBacSi, the closest common parent, passed down as giaTri + onDoi|||Ở KhuBacSi, cha chung gần nhất, truyền xuống bằng giaTri + onDoi',
              'In a global store, because two components use it|||Trong một store toàn cục, vì có hai component dùng nó',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lift state to the closest common parent — high enough that both children see it, no higher. Two copies go out of sync (measured: chip “Nhi” pressed, list still 6). Putting it in App works but re-renders Header on every change (measured with Profiler: 4 renders instead of 1 while typing three letters). A global store is for state that distant parts of the app share (Chapter 5), not for two siblings.|||VI: Nâng state lên cha chung gần nhất — đủ cao để cả hai con thấy, không cao hơn. Hai bản thì lệch nhau (đo được: chip “Nhi” sáng, danh sách vẫn 6). Đặt ở App thì chạy được nhưng Header render lại mỗi lần đổi (đo bằng Profiler: 4 lần thay vì 1 khi gõ ba chữ). Store toàn cục dành cho state mà các phần xa nhau của ứng dụng dùng chung (Chương 5), không phải cho hai anh em.',
          },
        ],
      },
    },
  ],
};
