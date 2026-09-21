/**
 * ============================================================
 * BỘ SOÁT MÁY — chấm các mục ĐO ĐƯỢC của tờ checklist trên mã Java thật
 * ============================================================
 *
 * AI đọc code giỏi phần "có đúng tầng không", nhưng đếm thì kém: một project
 * 700 dòng có 30 comment dính liền dòng code phía trên (mục 2.8) hay 12 biến
 * ArrayList thiếu đuôi "List" (mục 1.5) — model thấy vài cái, bỏ sót phần còn
 * lại, và mỗi lần chấm lại ra một con số khác. Người học sửa theo nhận xét
 * rồi vẫn bị thầy reject vì những chỗ AI không kể.
 *
 * Nên các mục đo được do MÁY chấm, dò từng dòng, ra đúng file và số dòng; AI
 * nhận kết quả này làm dữ kiện và chỉ phán những mục cần hiểu nghĩa. Bộ dò này
 * là bản chuyển sang TypeScript của bộ quét đã chạy trên cả 54 lời giải LAB211
 * ngày 21/09/2026 (đối chiếu tay từng loại lỗi trước khi tin).
 *
 * ─── CỐ Ý BẢO THỦ ───
 * Báo nhầm một lỗi "trượt" là dạy người học sửa cái không sai — tệ ngang bỏ
 * sót. Chỗ nào luật đọc được hai cách (tham số setter trùng tên field, Main chỉ
 * có hàm static, nối chuỗi bằng +) thì báo "rủi ro", không báo "trượt".
 */
import AdmZip from 'adm-zip';

export type KetMuc = 'dat' | 'truot' | 'ruiRo';

export interface BangChung {
  file: string;
  dong: number | null;
  ghiChu: string;
  ket: 'truot' | 'ruiRo';
}

export interface MucMay {
  ket: KetMuc;
  bangChung: BangChung[];
}

export interface KetQuaMay {
  theoMuc: Record<string, MucMay>;
  soFileJava: number;
  goi: string[];
  coRepository: boolean;
}

export interface TepJava {
  duong: string;
  noiDung: string;
}

/** Các mục máy chấm — mục khác (3.1…) để trống cho AI. */
const MUC_MAY = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6',
  '2.7', '2.8', '2.9', '2.10', '2.11', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8'];

/** Mỗi mục giữ tối đa bấy nhiêu bằng chứng — đủ để sửa, không làm ngập màn hình. */
const MAX_BANG_CHUNG = 40;

// ─── đọc .java từ zip ───────────────────────────────────────────

const MAX_TEP = 400;
const MAX_BYTE_TEP = 300 * 1024;
const MAX_TONG = 20 * 1024 * 1024;

/**
 * Lấy mọi tệp .java trong zip, đường dẫn đã bỏ thư mục gốc chung.
 *
 * Chạy SAU `buildProjectDigest` (bước đó đã chặn zip hỏng / zip bom), nhưng vẫn
 * tự giữ các chốt an toàn của mình: đọc zip từ người dùng là đọc thứ không tin.
 */
export function layTepJava(zip: Buffer): TepJava[] {
  let z: AdmZip;
  try {
    z = new AdmZip(zip);
  } catch {
    return [];
  }
  const vao = z.getEntries().filter((e) => !e.isDirectory && /\.java$/i.test(e.entryName));
  const ra: TepJava[] = [];
  let tong = 0;
  for (const e of vao.slice(0, MAX_TEP)) {
    const duong = e.entryName.replace(/\\/g, '/');
    if (duong.includes('..') || duong.startsWith('/')) continue;
    if (/(^|\/)(build|dist|nbproject|\.git|target|out)\//.test(duong)) continue;
    if (e.header.size > MAX_BYTE_TEP) continue;
    tong += e.header.size;
    if (tong > MAX_TONG) break;
    try {
      ra.push({ duong, noiDung: e.getData().toString('utf8') });
    } catch {
      // một tệp hỏng không được làm hỏng cả lượt soát
    }
  }
  return ra;
}

// ─── bộ tách dòng: code / comment / chuỗi ───────────────────────

interface Dong {
  so: number;
  raw: string;
  /** code với nội dung chuỗi và ký tự đã xoá rỗng ("" và '') */
  code: string;
  coComment: boolean;
  chuoi: string[];
  /** cả dòng nằm trong một khối /* *\/ */
  trongBlock: boolean;
}

function tachDong(text: string): Dong[] {
  const raws = text.replace(/\r\n?/g, '\n').split('\n');
  const ds: Dong[] = raws.map((raw, i) => ({ so: i + 1, raw, code: '', coComment: false, chuoi: [], trongBlock: false }));
  let state: 'code' | 'block' | 'string' | 'char' = 'code';
  let buf = '';
  let cur = '';
  let li = 0;
  let chiBlock = true;
  const t = raws.join('\n');
  let i = 0;
  let dong = ds[0]!;
  while (i < t.length) {
    const ch = t[i]!;
    const nxt = t[i + 1] ?? '';
    if (ch === '\n') {
      dong.code = buf;
      dong.trongBlock = chiBlock && state === 'block' && !dong.code.trim();
      buf = '';
      li += 1;
      dong = ds[li]!;
      chiBlock = state === 'block';
      if (state === 'string') state = 'code';
      i += 1;
      continue;
    }
    if (state === 'code') {
      if (ch === '/' && nxt === '/') {
        dong.coComment = true;
        const j = t.indexOf('\n', i);
        i = j === -1 ? t.length : j;
        continue;
      }
      if (ch === '/' && nxt === '*') {
        dong.coComment = true;
        state = 'block';
        i += 2;
        continue;
      }
      if (ch === '"') {
        state = 'string';
        cur = '';
        buf += '"';
        i += 1;
        continue;
      }
      if (ch === "'") {
        state = 'char';
        buf += "'";
        i += 1;
        continue;
      }
      buf += ch;
      if (ch.trim()) chiBlock = false;
      i += 1;
      continue;
    }
    if (state === 'block') {
      dong.coComment = true;
      if (ch === '*' && nxt === '/') {
        state = 'code';
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }
    if (state === 'string') {
      if (ch === '\\') {
        cur += t.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (ch === '"') {
        dong.chuoi.push(cur);
        buf += '"';
        state = 'code';
        i += 1;
        continue;
      }
      cur += ch;
      i += 1;
      continue;
    }
    // char
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === "'") {
      buf += "'";
      state = 'code';
    }
    i += 1;
  }
  dong.code = buf;
  return ds;
}

// ─── tiện ích biểu thức ─────────────────────────────────────────

function boGeneric(s: string): string {
  let truoc = '';
  let x = s;
  while (truoc !== x) {
    truoc = x;
    x = x.replace(/<[^<>;=()]*>/g, '');
  }
  return x;
}

/** Thay mọi thứ nằm trong () [] {} bằng dấu cách — chỉ giữ mức 0. */
function mucKhong(text: string): string {
  let sau = 0;
  let ra = '';
  for (const ch of text) {
    if ('([{'.includes(ch)) {
      sau += 1;
      ra += sau > 1 ? ' ' : ch;
      continue;
    }
    if (')]}'.includes(ch)) {
      sau -= 1;
      ra += sau > 0 ? ' ' : ch;
      continue;
    }
    ra += sau === 0 ? ch : ' ';
  }
  return ra;
}

function tachMucKhong(text: string, dauNgan: string[]): Array<[string, string | null]> {
  const ra: Array<[string, string | null]> = [];
  let sau = 0;
  let cur = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i]!;
    if ('([{'.includes(ch)) sau += 1;
    else if (')]}'.includes(ch)) sau -= 1;
    let khop: string | null = null;
    if (sau === 0) {
      for (const d of dauNgan) {
        if (text.startsWith(d, i)) {
          khop = d;
          break;
        }
      }
    }
    if (khop) {
      ra.push([cur, khop]);
      cur = '';
      i += khop.length;
      continue;
    }
    cur += ch;
    i += 1;
  }
  ra.push([cur, null]);
  return ra;
}

function boNgoacNgoai(s: string): boolean {
  const t = s.trim();
  if (!(t.startsWith('(') && t.endsWith(')'))) return false;
  let sau = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '(') sau += 1;
    else if (t[i] === ')') {
      sau -= 1;
      if (sau === 0 && i !== t.length - 1) return false;
    }
  }
  return true;
}

const SO_SANH = /(==|!=|<=|>=|(?<![<-])<(?![<=])|(?<![>-])>(?![>=]))/;

function coSoSanhMucKhong(s: string): boolean {
  const d = boGeneric(mucKhong(s)).replace(/->/g, '  ');
  return SO_SANH.test(d);
}

function coCongTruMucKhong(s: string): boolean {
  return /[\w)\]"']\s*[+-](?![+\-=])/.test(mucKhong(s).replace(/->/g, '  '));
}

function coNhanChiaMucKhong(s: string): boolean {
  return /[\w)\]"']\s*[*/%](?!=)/.test(mucKhong(s));
}

/** Mục 3.3 cho một biểu thức: trả về các [mức, ghi chú]. */
function soatNgoac(bieuThuc: string): Array<['truot' | 'ruiRo', string]> {
  const ra: Array<['truot' | 'ruiRo', string]> = [];
  const e = bieuThuc.trim();
  if (!e) return ra;
  const phan = tachMucKhong(e, ['&&', '||']);
  const toanTu = new Set(phan.map((p) => p[1]).filter(Boolean));
  if (toanTu.size) {
    if (toanTu.size > 1) ra.push(['truot', 'trộn && và || cùng mức mà không có ngoặc']);
    for (const [manh] of phan) {
      let c = manh.trim();
      while (c.startsWith('!')) c = c.slice(1).trim();
      if (coSoSanhMucKhong(c) && !boNgoacNgoai(c)) {
        ra.push(['truot', `phép so sánh "${c.slice(0, 40)}" cạnh &&/|| thiếu ngoặc riêng`]);
        break;
      }
    }
  }
  const d = mucKhong(e);
  const q = d.indexOf('?');
  if (q > 0 && d.slice(q).includes(':')) {
    let dk = e.slice(0, q).trim();
    const m = /(?:^|\s)(?:=|return)\s+(.*)$/.exec(dk);
    if (m) dk = m[1]!.trim();
    if ((coSoSanhMucKhong(dk) || coCongTruMucKhong(dk)) && !boNgoacNgoai(dk)) {
      ra.push(['truot', 'biểu thức trước "?" phải có ngoặc: (x >= 0) ? x : -x']);
    }
  }
  for (const [manh] of phan) {
    if (coCongTruMucKhong(manh) && coNhanChiaMucKhong(manh)) {
      ra.push(['ruiRo', 'trộn +/- với * / % cùng mức — thêm ngoặc cho tường minh']);
      break;
    }
  }
  return ra;
}

// ─── phân loại kiểu & tên ───────────────────────────────────────

const KIEU_LIST = new Set(['List', 'ArrayList', 'LinkedList', 'Collection', 'Vector', 'Stack', 'Queue',
  'Deque', 'ArrayDeque', 'PriorityQueue', 'Iterable', 'CopyOnWriteArrayList']);
const KIEU_SET = new Set(['Set', 'HashSet', 'TreeSet', 'LinkedHashSet', 'SortedSet', 'NavigableSet', 'EnumSet']);
const KIEU_MAP = new Set(['Map', 'HashMap', 'TreeMap', 'LinkedHashMap', 'Hashtable', 'SortedMap',
  'NavigableMap', 'EnumMap', 'ConcurrentHashMap']);

function loaiKieu(kieu: string): 'List' | 'Set' | 'Map' | 'Array' | null {
  const t = kieu.trim();
  if (t.endsWith(']') || t.endsWith('...')) return 'Array';
  const goc = t.replace(/<.*$/, '').split('.').pop()!.trim();
  if (KIEU_LIST.has(goc)) return 'List';
  if (KIEU_SET.has(goc)) return 'Set';
  if (KIEU_MAP.has(goc)) return 'Map';
  return null;
}

const TU_KHOA = new Set(('abstract assert boolean break byte case catch char class const continue default do '
  + 'double else enum extends final finally float for goto if implements import instanceof int interface long '
  + 'native new package private protected public return short static strictfp super switch synchronized this '
  + 'throw throws transient try void volatile while var yield true false null').split(' '));
const KHONG_PHAI_KIEU = new Set(['return', 'throw', 'new', 'else', 'case', 'package', 'import', 'break',
  'continue', 'yield', 'assert', 'goto', 'do', 'if', 'for', 'while', 'switch', 'try', 'catch', 'finally',
  'synchronized', 'instanceof', 'default', 'this', 'super']);

const DONG_TU = new Set(`get set is has can should add remove delete update find search check validate
calculate calc compute count create build make generate display show print render input enter read write load
save store parse convert format normalize sort swap merge split join filter apply run execute start stop init
initialize reset clear contains compare equals handle process perform fill push pop peek insert append replace
change move copy zip unzip compress decompress extract analyze encrypt decrypt encode decode login logout
register verify confirm choose select pick ask prompt request open close exist exists list edit modify sum
multiply divide subtract solve draw deal shuffle attack damage fly heal grow die kill hit play rank report
summarize group collect iterate traverse visit walk scan match test ensure require notify send receive fetch put
to main hash call use take give keep mark lookup look resolve map reduce trim capitalize lower upper wrap unwrap
increase decrease increment decrement raise go try assign refresh sell buy order pay charge book cancel borrow
return rent sign log dump emit accept reject plus minus power destroy quit exit end finish complete begin
enqueue dequeue reverse rotate transpose determine detect identify classify estimate measure evaluate score
grade rate average total compose separate tokenize fire spawn release acquire lock unlock unload import export
install uninstall describe explain translate index approve submit place deposit withdraw transfer`.split(/\s+/));

// ─── bộ đếm kết quả ─────────────────────────────────────────────

class GhiLoi {
  theoMuc: Record<string, MucMay> = {};

  constructor() {
    for (const stt of MUC_MAY) this.theoMuc[stt] = { ket: 'dat', bangChung: [] };
  }

  ghi(stt: string, ket: 'truot' | 'ruiRo', file: string, dong: number | null, ghiChu: string) {
    const m = this.theoMuc[stt];
    if (!m) return;
    if (ket === 'truot') m.ket = 'truot';
    else if (m.ket === 'dat') m.ket = 'ruiRo';
    if (m.bangChung.length < MAX_BANG_CHUNG) m.bangChung.push({ file, dong, ghiChu, ket });
  }
}

// ─── cấu trúc một tệp ───────────────────────────────────────────

interface KhaiBaoLop {
  ten: string;
  loai: 'class' | 'interface' | 'enum';
  dong: number;
  mods: string;
  duoi: string;
  sauThan: number;
  soHamStatic: number;
  soHamThuong: number;
  ctor: HamJava[];
  truong: TruongJava[];
}

interface TruongJava {
  ten: string;
  kieu: string;
  dong: number;
  mods: string;
}

interface HamJava {
  ten: string;
  ctor: boolean;
  dong: number;
  mods: string;
  kieuTra: string | null;
  thamSo: Array<[string, string]>;
  lop: string;
  truuTuong: boolean;
  ghiDe: boolean;
  than: [number, number] | null;
}

interface TepDaDoc {
  duong: string;
  goi: string;
  dong: Dong[];
  lop: KhaiBaoLop[];
  ham: HamJava[];
  truong: TruongJava[];
  imports: Array<[number, string]>;
}

const KHAI_BAO_LOP = /^\s*((?:(?:public|protected|private|static|final|abstract)\s+)*)(class|interface|enum)\s+(\w+)(.*)$/;
const DAU_HAM = /^\s*((?:(?:public|protected|private|static|final|abstract|synchronized|native|default)\s+)*)(?:<[^>]+>\s+)?(?:([\w.]+(?:\s*<[^()]*>)?(?:\s*\[\s*\])*)\s+)?(\w+)\s*\((.*)$/;
const KHAI_BAO_TRUONG = /^\s*((?:(?:public|protected|private|static|final|transient|volatile)\s+)*)([A-Za-z_][\w.]*(?:\s*<[^;=()]*>)?(?:\s*\[\s*\])*)\s+([a-zA-Z_$][\w$]*)\s*((?:\[\s*\])*)\s*(=.*|;.*|,.*)$/;
const KHAI_BAO_BIEN = /^\s*(?:final\s+)?([A-Za-z_][\w.]*(?:\s*<[^;=()]*>)?(?:\s*\[\s*\])*)\s+([a-zA-Z_$][\w$]*)\s*((?:\[\s*\])*)\s*(=.*|;.*|,.*)$/;

function goiCuaDuong(duong: string, text: string): string {
  const m = /(?:^|\/)src\/(.+)$/.exec(duong);
  if (m) {
    const phan = m[1]!.split('/');
    return phan.length >= 2 ? phan[0]! : '';
  }
  const p = /^\s*package\s+([\w.]+)\s*;/m.exec(text);
  return p ? p[1]!.split('.')[0]! : '';
}

function thamSoCua(text: string): Array<[string, string]> {
  const t = boGeneric(text.trim());
  if (!t) return [];
  const ra: Array<[string, string]> = [];
  for (const [manh] of tachMucKhong(t, [','])) {
    const c = manh.trim().replace(/^(?:final\s+|@\w+\s+)+/, '');
    const m = /^([\w.]+(?:\s*\[\s*\])*(?:\.\.\.)?)\s+(\w+)((?:\[\s*\])*)$/.exec(c);
    if (m) ra.push([m[1]! + m[3]!, m[2]!]);
  }
  return ra;
}

function dongTruocKetThuc(code: string[], i: number): boolean {
  let j = i - 1;
  while (j >= 0 && !code[j]!.trim()) j -= 1;
  if (j < 0) return true;
  const t = code[j]!.trim();
  return /[;{}]$/.test(t) || t.startsWith('@');
}

function docTep(tep: TepJava): TepDaDoc {
  const ds = tachDong(tep.noiDung);
  const code = ds.map((d) => d.code);
  const goi = goiCuaDuong(tep.duong, tep.noiDung);
  const lop: KhaiBaoLop[] = [];
  const ham: HamJava[] = [];
  const truong: TruongJava[] = [];
  const imports: Array<[number, string]> = [];
  for (const d of ds) {
    const mi = /^\s*import\s+(?:static\s+)?([\w.]+(?:\.\*)?)\s*;/.exec(d.code);
    if (mi) imports.push([d.so, mi[1]!]);
  }
  let sau = 0;
  const chong: KhaiBaoLop[] = [];
  let i = 0;
  while (i < ds.length) {
    const c = code[i]!;
    const s = c.trim();
    const kl = KHAI_BAO_LOP.exec(c);
    if (kl && !kl[4]!.split('{')[0]!.includes('(')) {
      const l: KhaiBaoLop = {
        ten: kl[3]!, loai: kl[2] as KhaiBaoLop['loai'], dong: i + 1, mods: kl[1] || '', duoi: kl[4] || '',
        sauThan: sau + 1, soHamStatic: 0, soHamThuong: 0, ctor: [], truong: [],
      };
      lop.push(l);
      chong.push(l);
    } else if (chong.length && sau === chong[chong.length - 1]!.sauThan && s && !s.startsWith('@')
      && !s.startsWith('}') && dongTruocKetThuc(code, i)) {
      const l = chong[chong.length - 1]!;
      let dau = c;
      let j = i;
      while (!/[{;]\s*$/.test(code[j]!) && j + 1 < ds.length && j - i < 6) {
        j += 1;
        dau += ' ' + code[j]!.trim();
      }
      const mh = DAU_HAM.exec(dau);
      const coBang = dau.split('(')[0]!.includes('=');
      let fd = (!mh || coBang) ? KHAI_BAO_TRUONG.exec(dau) : null;
      if (fd && dau.split('=')[0]!.includes('(')) fd = null;
      if (fd && !TU_KHOA.has(fd[3]!) && !KHONG_PHAI_KIEU.has(fd[2]!)) {
        const f: TruongJava = { ten: fd[3]!, kieu: fd[2]! + (fd[4] || ''), dong: i + 1, mods: fd[1] || '' };
        l.truong.push(f);
        truong.push(f);
      } else if (mh && !TU_KHOA.has(mh[3]!)) {
        const ten = mh[3]!;
        const laCtor = ten === l.ten && !mh[2];
        if (mh[2] || laCtor) {
          let pt = dau.slice(dau.indexOf('(') + 1);
          let dd = 1;
          let k = 0;
          while (k < pt.length && dd) {
            if (pt[k] === '(') dd += 1;
            else if (pt[k] === ')') dd -= 1;
            k += 1;
          }
          pt = pt.slice(0, Math.max(0, k - 1));
          const h: HamJava = {
            ten, ctor: laCtor, dong: i + 1, mods: mh[1] || '', kieuTra: mh[2] || null, thamSo: thamSoCua(pt),
            lop: l.ten, truuTuong: /;\s*$/.test(dau), ghiDe: false, than: null,
          };
          let b = i - 1;
          while (b >= 0 && (!code[b]!.trim() || code[b]!.trim().startsWith('@'))) {
            if (code[b]!.includes('@Override')) h.ghiDe = true;
            b -= 1;
          }
          if (laCtor) l.ctor.push(h);
          else if ((mh[1] || '').includes('static')) l.soHamStatic += 1;
          else l.soHamThuong += 1;
          if (!h.truuTuong && l.loai !== 'interface') {
            let d2 = 0;
            let k2 = i;
            let batDau = false;
            while (k2 < ds.length) {
              const mo = (code[k2]!.match(/\{/g) || []).length;
              const dong = (code[k2]!.match(/\}/g) || []).length;
              d2 += mo - dong;
              if (mo) batDau = true;
              if (batDau && d2 <= 0) break;
              k2 += 1;
            }
            h.than = [j, k2];
          }
          ham.push(h);
        }
      }
    }
    sau += (c.match(/\{/g) || []).length - (c.match(/\}/g) || []).length;
    while (chong.length && sau < chong[chong.length - 1]!.sauThan) chong.pop();
    i += 1;
  }
  return { duong: tep.duong, goi, dong: ds, lop, ham, truong, imports };
}

// ─── soát một tệp ───────────────────────────────────────────────

function soatTep(t: TepDaDoc, g: GhiLoi) {
  const f = t.duong;
  const ds = t.dong;
  const code = ds.map((d) => d.code);
  const goi = t.goi;
  const ngoaiConstants = goi !== 'constants';

  // 1.2 package chữ thường
  const pk = /^\s*package\s+([\w.]+)\s*;/m.exec(code.join('\n'));
  if (pk && pk[1] !== pk[1]!.toLowerCase()) g.ghi('1.2', 'truot', f, null, `package "${pk[1]}" phải viết thường`);

  // 3.6 import không dùng
  const thanTep = code.filter((c) => !/^\s*(import|package)\b/.test(c)).join('\n');
  for (const [so, imp] of t.imports) {
    const ten = imp.split('.').pop()!;
    if (ten === '*') continue;
    if (!new RegExp(`\\b${ten}\\b`).test(thanTep)) g.ghi('3.6', 'truot', f, so, `import ${imp} không dùng tới`);
  }

  // ---- từng dòng ----
  for (let i = 0; i < ds.length; i++) {
    const d = ds[i]!;
    const c = d.code;
    const s = c.trim();
    const daiCode = c.replace(/\s+$/, '').length;
    if (daiCode > 100) g.ghi('2.3', 'truot', f, d.so, `dòng code dài ${daiCode} ký tự (> 100)`);
    if (s === '{') g.ghi('2.1', 'truot', f, d.so, '"{" đứng riêng một dòng — phải ở cuối dòng khai báo');
    if (/[^\s{]\s*\}\s*$/.test(c) && !/\{.*\}/.test(c) && s !== '}' && !s.startsWith('}')) {
      g.ghi('2.1', 'truot', f, d.so, '"}" phải đứng đầu dòng');
    }
    // 2.7 nhiều câu lệnh một dòng
    let khongFor = c;
    const mf = /\bfor\s*\(/.exec(c);
    if (mf) {
      let dd = 1;
      let q = mf.index + mf[0].length;
      while (q < c.length && dd) {
        if (c[q] === '(') dd += 1;
        else if (c[q] === ')') dd -= 1;
        q += 1;
      }
      khongFor = c.slice(0, mf.index) + 'for()' + c.slice(q);
    }
    if ((khongFor.match(/;/g) || []).length > 1) {
      g.ghi('2.7', 'truot', f, d.so, 'nhiều hơn một câu lệnh trên một dòng');
    } else if (/\{\s*[^{}\s][^{}]*;\s*\}/.test(c) && !/=\s*\{/.test(c) && !/new\s+\w+(\[\])+\s*\{/.test(c)) {
      g.ghi('2.7', 'truot', f, d.so, 'khối { ...; } viết trên một dòng');
    }
    // 2.2 thiếu ngoặc nhọn
    if (/^\s*(\}\s*)?(if|else\s+if|for|while)\s*\(/.test(c) && !s.endsWith('{') && !s.endsWith(';')
      && (s.match(/\(/g) || []).length === (s.match(/\)/g) || []).length && !/(&&|\|\|)$/.test(s)) {
      let n = i + 1;
      while (n < ds.length && !code[n]!.trim()) n += 1;
      if (n < ds.length && !code[n]!.trim().startsWith('{')) {
        g.ghi('2.2', 'truot', f, d.so, 'if/for/while không có { } — một dòng cũng phải có');
      }
    }
    if (/^\s*(\}\s*)?else\s*$/.test(c) || /^\s*do\s*$/.test(c)) g.ghi('2.2', 'truot', f, d.so, 'else/do không có { }');
    if (/^\s*(\}\s*)?(if|else\s+if|for|while)\s*\((.*)\)\s*[^{\s].*;\s*$/.test(c)
      && (s.match(/\(/g) || []).length === (s.match(/\)/g) || []).length && !/^\}\s*while\s*\(.*\)\s*;/.test(s)) {
      g.ghi('2.2', 'truot', f, d.so, 'if/for/while một dòng không có { }');
    }
    if (/^\s*(\}\s*)?else\s+[^{i\s].*;\s*$/.test(c)) g.ghi('2.2', 'truot', f, d.so, 'else một dòng không có { }');
    // 2.3 cách ngắt dòng
    if (/^\s*(&&|\|\|)/.test(c)) g.ghi('2.3', 'truot', f, d.so, 'xuống dòng TRƯỚC &&/|| — thầy: ngắt SAU toán tử logic');
    if (/[^+\-*/]\s*[+\-*/]\s*$/.test(c) && !/(\+\+|--)\s*$/.test(c) && !s.startsWith('*') && !s.startsWith('//')) {
      g.ghi('2.3', 'truot', f, d.so, 'xuống dòng SAU + - * / — thầy: ngắt TRƯỚC toán hạng');
    }
    // 2.9 dấu cách
    if (/\b(if|for|while|switch|catch|synchronized)\(/.test(c)) g.ghi('2.9', 'truot', f, d.so, 'thiếu dấu cách trước "(" sau từ khoá');
    let cc = c.replace(/'[^']*'/g, "''");
    if (/,(?=\S)/.test(cc)) g.ghi('2.9', 'truot', f, d.so, 'thiếu dấu cách sau ","');
    cc = cc.replace(/\b\d+(\.\d+)?[eE][-+]?\d+\b/g, '0').replace(/<[\w<>, ?[\]]*>\s*\(/g, '(');
    const toanTuDinh = /(?<=[\w)\]"])(==|!=|<=|>=|&&|\|\||\+=|-=|\*=|\/=|%=)|(==|!=|<=|>=|&&|\|\||\+=|-=|\*=|\/=|%=)(?=[\w("!])/.test(cc);
    const ganDinh = /(?<=[\w)\]"])=(?=[^=\s])|(?<=[^=!<>+\-*/%&|^\s])=(?=[\w("'-])/.test(cc);
    const soHocDinh = /(?<=[\w)\]"])[+*/%](?=[\w("'])/.test(cc) && !/\+\+/.test(cc);
    const truDinh = /(?<=[\w)\]"])-(?=[\w("'])/.test(cc) && !/--|->/.test(cc);
    if ((toanTuDinh || ganDinh || soHocDinh || truDinh) && !s.startsWith('*') && !/^(import|package)\b/.test(s)) {
      g.ghi('2.9', 'truot', f, d.so, `thiếu dấu cách quanh toán tử: ${s.slice(0, 60)}`);
    }
    if (/\((int|long|short|byte|char|float|double|boolean|String|Integer|Double)\)(?=[\w(])/.test(cc)) {
      g.ghi('2.9', 'truot', f, d.so, 'ép kiểu phải có dấu cách sau: (int) x');
    }
    if (/\)\{|\belse\{|\}else\b|\btry\{/.test(c)) g.ghi('2.9', 'truot', f, d.so, 'thiếu dấu cách quanh ngoặc nhọn');
    const forHead = /\bfor\s*\((.*)\)/.exec(cc);
    if (forHead && /;(?=\S)/.test(forHead[1]!)) g.ghi('2.9', 'truot', f, d.so, 'trong for(...) phải có dấu cách sau ";"');
    // 2.5 mảng kiểu C
    if (/\b[A-Za-z_][\w<>]*\s+[a-zA-Z_]\w*\s*\[\s*\]\s*[=;,)]/.test(c) && !/\bnew\b\s+\w+\s*\[/.test(c.split('=')[0]!)) {
      g.ghi('2.5', 'truot', f, d.so, 'khai báo mảng kiểu C "int a[]" — phải "int[] a"');
    }
    // 3.5 so sánh với chuỗi bằng ==
    if (/(==|!=)\s*""|""\s*(==|!=)/.test(c)) g.ghi('3.5', 'truot', f, d.so, 'so sánh chuỗi bằng ==/!= — phải dùng equals()');
    // 2.11 chữ viết cứng ngoài constants
    if (ngoaiConstants && !s.startsWith('@')) {
      for (const lit of d.chuoi) {
        const tho = lit.replace(/%[-#+ 0,(]*\d*(\.\d+)?[a-zA-Z%]/g, '').replace(/\\[ntrbf0'"\\]/g, '');
        if (/[A-Za-z]/.test(tho)) {
          g.ghi('2.11', 'truot', f, d.so, `chuỗi "${lit.slice(0, 40)}" phải khai báo ở Message.java`);
        }
      }
    }
    // 2.10 số viết thẳng ngoài constants (-1, 0, 1, 2 được phép)
    if (ngoaiConstants && !s.startsWith('@')) {
      const khongChuoi = c.replace(/"[^"]*"/g, '""');
      for (const so of khongChuoi.match(/(?<![\w.])(\d+\.\d+[fFdD]?|\d+[lLfFdD]?)(?![\w.])/g) || []) {
        if (!/^(0|1|2)(\.0+)?[lLfFdD]?$/.test(so)) {
          g.ghi('2.10', 'truot', f, d.so, `số ${so} viết thẳng — đặt tên hằng trong Constants.java`);
        }
      }
    }
    // Scanner / print sai chỗ (1.1)
    if (/\bScanner\b/.test(c) && goi !== 'main' && !/^\s*import\b/.test(c)) {
      g.ghi('1.1', 'truot', f, d.so, 'Scanner chỉ được dùng ở main');
    }
    if (/\bSystem\s*\.\s*(out|err)\b/.test(c) && goi !== 'main' && goi !== 'view') {
      g.ghi('1.1', 'truot', f, d.so, `print trong package "${goi || '(mặc định)'}" — chỉ main và view được in`);
    }
  }

  // ---- lớp: tên, 3.4, hằng ----
  for (const l of t.lop) {
    if (!/^[A-Z]/.test(l.ten)) g.ghi('1.3', 'truot', f, l.dong, `tên class "${l.ten}" phải bắt đầu bằng chữ hoa`);
    if (l.loai === 'interface' && !/^I[A-Z]/.test(l.ten)) {
      g.ghi('1.3', 'truot', f, l.dong, `interface "${l.ten}" phải bắt đầu bằng "I" (I${l.ten})`);
    }
    if (/\bextends\s+(\w*Exception|Throwable|Error)\b/.test(l.duoi) && !l.ten.endsWith('Exception')) {
      g.ghi('1.3', 'truot', f, l.dong, `class exception "${l.ten}" phải kết thúc bằng "Exception"`);
    }
    const loi = l.ten.replace(/^I(?=[A-Z][a-z])/, '');
    if (/ID(?![a-z])/.test(loi) && l.ten !== l.ten.toUpperCase()) g.ghi('1.5', 'truot', f, l.dong, `viết "Id" chứ không "ID" (${l.ten})`);
    if (l.loai === 'class') {
      const toanStatic = l.soHamStatic > 0 && l.soHamThuong === 0 && l.truong.every((x) => x.mods.includes('static'));
      if (toanStatic) {
        const coCtorRieng = l.ctor.some((x) => x.mods.includes('private'));
        const laFinal = /\bfinal\b/.test(l.mods);
        if (l.ten === 'Main' || goi === 'main') {
          if (!laFinal || !coCtorRieng) {
            g.ghi('3.4', 'ruiRo', f, l.dong, 'Main chỉ có hàm static — đọc đúng chữ tờ giấy thì cũng phải final + private constructor');
          }
        } else {
          if (!laFinal) g.ghi('3.4', 'truot', f, l.dong, `class ${l.ten} chỉ có hàm static phải khai báo final`);
          if (!coCtorRieng) g.ghi('3.4', 'truot', f, l.dong, `class ${l.ten} chỉ có hàm static phải có private constructor`);
        }
      }
    }
  }
  for (const x of t.truong) {
    const hang = x.mods.includes('static') && x.mods.includes('final');
    if (hang) {
      if (!/^[A-Z][A-Z0-9_]*$/.test(x.ten) && x.ten !== 'serialVersionUID') {
        g.ghi('2.10', 'truot', f, x.dong, `hằng "${x.ten}" phải VIET_HOA_GACH_DUOI`);
      }
      if (ngoaiConstants && x.ten !== 'serialVersionUID') {
        g.ghi('2.10', 'ruiRo', f, x.dong, `hằng "${x.ten}" nằm ngoài Constants.java/Message.java`);
      }
    } else if (goi === 'constants' && /^(Constants|Message)\.java$/.test(f.split('/').pop() || '')) {
      g.ghi('2.10', 'truot', f, x.dong, `"${x.ten}" trong ${f.split('/').pop()} thiếu static final`);
    }
  }

  // ---- method: tên, comment, thân ----
  const tenTruong = new Map(t.truong.map((x) => [x.ten, x]));
  const truongChuoi = new Set(t.truong.filter((x) => x.kieu.trim() === 'String').map((x) => x.ten));

  const kiemTen = (ten: string, kieu: string, so: number, noi: string) => {
    if (ten === 'serialVersionUID') return;
    const loai = loaiKieu(kieu);
    if (loai && !ten.endsWith(loai)) {
      if (ten === 'args' && kieu.startsWith('String')) {
        g.ghi('1.5', 'ruiRo', f, so, '"String[] args" của main không kết thúc bằng Array (chuẩn Java)');
      } else {
        g.ghi('1.5', 'truot', f, so, `${noi} "${ten}" kiểu ${kieu.trim()} phải kết thúc bằng "${loai}"`);
      }
    }
    if (/ID(?![A-Z_])|ID[A-Z]/.test(ten) && ten !== ten.toUpperCase()) {
      g.ghi('1.5', 'truot', f, so, `viết "Id" chứ không "ID" (${ten})`);
    }
    if (!/^[a-z]/.test(ten) && ten !== ten.toUpperCase()) {
      g.ghi('1.5', 'truot', f, so, `tên biến "${ten}" phải bắt đầu bằng chữ thường`);
    }
    if (ten.length === 1 && !['i', 'j', 'k', 'e'].includes(ten)) {
      g.ghi('1.5', 'ruiRo', f, so, `tên biến một chữ "${ten}" — thầy đòi tên có nghĩa`);
    }
  };

  for (const x of t.truong) {
    if (!(x.mods.includes('static') && x.mods.includes('final'))) kiemTen(x.ten, x.kieu, x.dong, 'trường');
  }

  for (const h of t.ham) {
    if (!h.ctor) {
      if (!/^[a-z]/.test(h.ten)) g.ghi('1.4', 'truot', f, h.dong, `tên method "${h.ten}" phải bắt đầu bằng chữ thường`);
      else if (!DONG_TU.has((/^[a-z]+/.exec(h.ten) || [''])[0])) {
        g.ghi('1.4', 'ruiRo', f, h.dong, `tên method "${h.ten}" không mở đầu bằng động từ quen thuộc — xem lại`);
      }
      if (/ID(?![A-Z_])|ID[A-Z]/.test(h.ten)) g.ghi('1.5', 'truot', f, h.dong, `viết "Id" chứ không "ID" (${h.ten})`);
    }
    // 1.6 comment cho method
    let b = h.dong - 2;
    while (b >= 0 && (!ds[b]!.raw.trim() || code[b]!.trim().startsWith('@'))) {
      if (!ds[b]!.raw.trim()) break;
      b -= 1;
    }
    const coCmt = b >= 0 && (ds[b]!.coComment || ds[b]!.trongBlock || ds[b]!.raw.trim().endsWith('*/'));
    if (!coCmt) g.ghi('1.6', 'truot', f, h.dong, `${h.ctor ? 'constructor' : 'method'} "${h.ten}" thiếu comment mô tả`);
    // 2.8 dòng trống giữa các method
    let k = h.dong - 2;
    while (k >= 0 && ((ds[k]!.coComment && !code[k]!.trim()) || code[k]!.trim().startsWith('@') || ds[k]!.trongBlock)) k -= 1;
    if (k >= 0 && ds[k]!.raw.trim() && !code[k]!.replace(/\s+$/, '').endsWith('{')) {
      g.ghi('2.8', 'truot', f, h.dong, `thiếu dòng trống giữa các method (trước "${h.ten}")`);
    }
    // tham số: tên, trùng field, không dùng
    for (const [kieu, ten] of h.thamSo) {
      kiemTen(ten, kieu, h.dong, 'tham số');
      if (tenTruong.has(ten)) {
        const setter = h.ctor || (h.ten.startsWith('set') && h.thamSo.length === 1);
        if (!setter) g.ghi('3.2', 'ruiRo', f, h.dong, `tham số "${ten}" trùng tên field (không phải setter/constructor)`);
      }
    }
    if (!h.than) continue;
    const [b0, b1] = h.than;
    const chiSo: number[] = [];
    for (let q = b0 + 1; q < b1; q++) chiSo.push(q);
    const thanCode = chiSo.map((q) => code[q]!).join('\n');
    if (!h.truuTuong && !h.ghiDe && !(h.ten === 'main' && h.thamSo[0]?.[1] === 'args')) {
      for (const [, ten] of h.thamSo) {
        if (!new RegExp(`\\b${ten}\\b`).test(thanCode)) {
          g.ghi('3.6', 'truot', f, h.dong, `tham số "${ten}" của ${h.ten}() khai báo mà không dùng`);
        }
      }
    }
    // quá 2 tham số (lời thầy + mục 1.1 "param < 3")
    if (!h.ctor && h.thamSo.length > 2 && goi !== 'utils') {
      const nang = goi === 'service' || goi === 'repository';
      g.ghi('1.1', nang ? 'truot' : 'ruiRo', f, h.dong, `${h.ten}() nhận ${h.thamSo.length} tham số — từ 3 trở lên thì gói vào DTO`);
    }
    soatThan(h, chiSo, ds, tenTruong, truongChuoi, f, g, kiemTen);
  }

  // 3.6 hàm private không ai gọi, field private không dùng / chỉ gán
  const toanBo = code.join('\n');
  for (const h of t.ham) {
    if (h.mods.includes('private') && !h.ctor) {
      const soLan = (toanBo.match(new RegExp(`\\b${h.ten}\\s*\\(`, 'g')) || []).length;
      if (soLan <= 1) g.ghi('3.6', 'truot', f, h.dong, `hàm private "${h.ten}" không được gọi ở đâu`);
    }
  }
  for (const x of t.truong) {
    if (!x.mods.includes('private')) continue;
    const lan = [...toanBo.matchAll(new RegExp(`\\b${x.ten}\\b`, 'g'))];
    if (lan.length <= 1) {
      g.ghi('3.6', 'truot', f, x.dong, `field "${x.ten}" khai báo mà không dùng`);
    } else {
      const doc = lan.slice(1).filter((m) => !/^\s*=(?!=)/.test(toanBo.slice((m.index || 0) + x.ten.length)));
      if (!doc.length) g.ghi('3.6', 'truot', f, x.dong, `field "${x.ten}" chỉ được gán mà không bao giờ được đọc`);
    }
  }

  // 2.8 comment của field dính liền dòng trên (ngoài thân method)
  const trongThan = (q: number) => t.ham.some((h) => h.than && h.than[0] < q && q < h.than[1]);
  let sauCap = 0;
  for (let q = 0; q < ds.length; q++) {
    const c = code[q]!;
    if (sauCap >= 1 && !c.trim() && ds[q]!.coComment && !ds[q]!.trongBlock && ds[q]!.raw.trim().startsWith('//')) {
      const p = q - 1;
      if (p >= 0 && ds[p]!.raw.trim() && code[p]!.trim() && !code[p]!.replace(/\s+$/, '').endsWith('{') && !trongThan(q)) {
        g.ghi('2.8', 'truot', f, q + 1, 'thiếu dòng trống TRƯỚC comment');
      }
    }
    sauCap += (c.match(/\{/g) || []).length - (c.match(/\}/g) || []).length;
  }

  // 1.6 comment cho mỗi block điều khiển
  for (let q = 0; q < ds.length; q++) {
    const c = code[q]!;
    if (!/^\s*(\}\s*)?(if|else|for|while|do|switch|case|default|try|catch|finally)\b/.test(c)) continue;
    if (ds[q]!.coComment) continue;
    let p = q - 1;
    let coTren = false;
    while (p >= 0) {
      if (!ds[p]!.raw.trim()) {
        p -= 1;
        continue;
      }
      coTren = ds[p]!.coComment || ds[p]!.trongBlock;
      break;
    }
    if (!coTren && c.replace(/\s+$/, '').endsWith('{')) {
      let n = q + 1;
      while (n < ds.length && !ds[n]!.raw.trim()) n += 1;
      if (n < ds.length && ds[n]!.coComment) coTren = true;
    }
    if (!coTren) {
      const tu = (/(if|else|for|while|do|switch|case|default|try|catch|finally)/.exec(c) || ['khối'])[0];
      g.ghi('1.6', 'truot', f, q + 1, `"${tu}" thiếu comment giải thích khối`);
    }
  }
}

/** Loại của một dòng trong thân method — để biết chỗ nào thiếu dòng trống (mục 2.8). */
type LoaiDong = 'mo' | 'khai' | 'lenh' | 'comment' | 'rong' | 'dong';

function soatThan(
  h: HamJava, chiSo: number[], ds: Dong[], tenTruong: Map<string, TruongJava>, truongChuoi: Set<string>,
  f: string, g: GhiLoi, kiemTen: (ten: string, kieu: string, so: number, noi: string) => void,
) {
  const code = ds.map((d) => d.code);
  const bienChuoi = new Set(truongChuoi);
  for (const [kieu, ten] of h.thamSo) if (kieu === 'String') bienChuoi.add(ten);
  const chong: Array<{ daCoLenh: boolean }> = [{ daCoLenh: false }];
  let truocKetThuc = true;
  let loaiTruoc: LoaiDong = 'mo';
  let rongTruoc = false;
  const daKhai = new Map<string, number>();
  const cuoi = h.than ? h.than[1] : ds.length;

  for (const q of chiSo) {
    const d = ds[q]!;
    const c = d.code;
    const s = c.trim();
    if (!s) {
      if (d.coComment && !d.trongBlock && /^(\/\/|\/\*)/.test(d.raw.trim())) {
        if (!rongTruoc && (loaiTruoc === 'lenh' || loaiTruoc === 'khai' || loaiTruoc === 'dong')) {
          g.ghi('2.8', 'truot', f, d.so, loaiTruoc === 'khai'
            ? 'thiếu dòng trống giữa vùng khai báo biến và phần còn lại'
            : 'thiếu dòng trống TRƯỚC comment');
        }
        loaiTruoc = 'comment';
        rongTruoc = false;
      } else if (d.trongBlock || d.coComment) {
        loaiTruoc = 'comment';
        rongTruoc = false;
      } else {
        rongTruoc = true;
      }
      continue;
    }
    const noiTiep = !truocKetThuc;
    const mo = (c.match(/\{/g) || []).length;
    const dong = (c.match(/\}/g) || []).length;
    let loaiNay: LoaiDong = 'lenh';
    if (!noiTiep) {
      if (s.startsWith('}')) {
        const soDong = (/^(\}\s*)+/.exec(s)![0].match(/\}/g) || []).length;
        for (let z = 0; z < soDong; z++) if (chong.length > 1) chong.pop();
        const conLai = s.replace(/^[}\s]+/, '');
        if (conLai && s.endsWith('{')) chong.push({ daCoLenh: false });
        loaiNay = !conLai ? 'dong' : (s.endsWith('{') ? 'mo' : 'lenh');
      } else if (/^(case\b.*|default\s*):/.test(s)) {
        chong[chong.length - 1]!.daCoLenh = false;
        loaiNay = 'mo';
      } else {
        const kb = KHAI_BAO_BIEN.exec(c);
        const laKhai = !!kb && !KHONG_PHAI_KIEU.has(kb[1]!) && !TU_KHOA.has(kb[2]!) && !/^\s*\w+\s*\(/.test(c);
        if (laKhai) {
          const kieu = kb![1]! + (kb![3] || '');
          const ten = kb![2]!;
          const phanSau = kb![4]!;
          if (chong[chong.length - 1]!.daCoLenh) {
            g.ghi('2.6', 'truot', f, d.so, `biến "${ten}" khai báo GIỮA block — gom lên ĐẦU block`);
          }
          if (phanSau.trim().startsWith(';')) g.ghi('3.7', 'truot', f, d.so, `biến "${ten}" khai báo mà không khởi tạo`);
          const r2 = boGeneric(phanSau);
          if (!/^\s*=\s*(new\s+[\w.<>[\]]+\s*)?\{/.test(r2)
            && /^\s*(=\s*[^,({]*)?,\s*[a-zA-Z_]\w*\s*(=|;|,)/.test(r2)) {
            g.ghi('2.4', 'truot', f, d.so, 'nhiều biến khai báo trên một dòng');
          }
          kiemTen(ten, kieu, d.so, 'biến');
          if (tenTruong.has(ten)) g.ghi('3.2', 'truot', f, d.so, `biến local "${ten}" trùng tên field`);
          if (daKhai.has(ten)) g.ghi('3.2', 'ruiRo', f, d.so, `biến "${ten}" khai báo lại (đã có ở dòng ${daKhai.get(ten)})`);
          daKhai.set(ten, d.so);
          if (kieu === 'String') bienChuoi.add(ten);
          const phiaSau: string[] = [];
          for (let z = q + 1; z < cuoi; z++) phiaSau.push(code[z]!);
          const cungDong = c.replace(new RegExp(`^\\s*(final\\s+)?[\\w.<>\\[\\], ]+?\\s+${ten}\\b`), '');
          if (!new RegExp(`\\b${ten}\\b`).test(phiaSau.join('\n') + '\n' + cungDong)) {
            g.ghi('3.6', 'truot', f, d.so, `biến "${ten}" khai báo mà không dùng`);
          }
          loaiNay = 'khai';
        } else {
          chong[chong.length - 1]!.daCoLenh = true;
          if (loaiTruoc === 'khai' && !rongTruoc) {
            g.ghi('2.8', 'truot', f, d.so, 'thiếu dòng trống giữa vùng khai báo biến và phần còn lại');
          }
          if (loaiTruoc === 'dong' && !rongTruoc && !/^(else|catch|finally|while\b.*;|break;|continue;|return;)/.test(s)) {
            g.ghi('2.8', 'ruiRo', f, d.so, 'nên có dòng trống giữa hai khối xử lý logic');
          }
          if (mo > dong && s.endsWith('{')) {
            chong.push({ daCoLenh: false });
            loaiNay = 'mo';
          }
        }
        const fe = /^\s*for\s*\(\s*(?:final\s+)?([\w.<>[\], ]+?)\s+(\w+)\s*:/.exec(c);
        if (fe) {
          kiemTen(fe[2]!, fe[1]!, d.so, 'biến lặp');
          if (tenTruong.has(fe[2]!)) g.ghi('3.2', 'truot', f, d.so, `biến lặp "${fe[2]}" trùng tên field`);
        }
      }
    } else {
      // dòng nối tiếp của một khai báo vẫn thuộc vùng khai báo; còn lại là lệnh
      loaiNay = (loaiTruoc as LoaiDong) === 'khai' ? 'khai' : 'lenh';
      if (mo > dong && s.endsWith('{')) {
        chong[chong.length - 1]!.daCoLenh = true;
        chong.push({ daCoLenh: false });
        loaiNay = 'mo';
      }
      if (dong > mo && s.startsWith('}')) {
        for (let z = 0; z < dong - mo; z++) if (chong.length > 1) chong.pop();
      }
    }
    truocKetThuc = /[;{}:]\s*$/.test(s) || s.startsWith('@');
    loaiTruoc = loaiNay;
    rongTruoc = false;
  }

  // 3.3 + 3.5 trên điều kiện if/while
  const noi = chiSo.map((q) => code[q]!).join('\n');
  const dongDau = (h.than ? h.than[0] : 0) + 2;
  for (const m of noi.matchAll(/\b(if|while)\s*\(/g)) {
    const bd = (m.index || 0) + m[0].length;
    let dd = 1;
    let q = bd;
    while (q < noi.length && dd) {
      if (noi[q] === '(') dd += 1;
      else if (noi[q] === ')') dd -= 1;
      q += 1;
    }
    const dk = noi.slice(bd, q - 1).replace(/\n/g, ' ');
    const so = dongDau + noi.slice(0, m.index).split('\n').length - 1;
    for (const [muc, ghi] of soatNgoac(dk)) g.ghi('3.3', muc, f, so, ghi);
    for (const ss of dk.matchAll(/(\w+)\s*(==|!=)\s*(\w+)/g)) {
      const [, a, op, b2] = ss;
      if ((bienChuoi.has(a!) && b2 !== 'null') || (bienChuoi.has(b2!) && a !== 'null')) {
        g.ghi('3.5', 'truot', f, so, `so sánh String "${a} ${op} ${b2}" bằng ==`);
      }
    }
  }
  for (const m of noi.matchAll(/(?:\breturn\s+|[^=!<>]=\s*)([^;{]+);/g)) {
    const bt = m[1]!;
    if (bt.trim().startsWith('new ') || bt.includes('->')) continue;
    const so = dongDau + noi.slice(0, m.index).split('\n').length - 1;
    for (const [muc, ghi] of soatNgoac(bt)) g.ghi('3.3', muc, f, so, ghi);
  }
  // 3.8 cộng chuỗi
  for (const q of chiSo) {
    const c = code[q]!;
    const m1 = /\b(\w+)\s*\+=/.exec(c);
    if (m1 && (bienChuoi.has(m1[1]!) || /\+=\s*""/.test(c))) {
      g.ghi('3.8', 'truot', f, q + 1, 'cộng chuỗi bằng += — phải dùng StringBuilder');
    }
    const m2 = /\b(\w+)\s*=\s*\1\s*\+/.exec(c);
    if (m2 && bienChuoi.has(m2[1]!)) {
      g.ghi('3.8', 'truot', f, q + 1, 'cộng chuỗi "s = s + ..." — phải dùng StringBuilder');
    } else if (/""\s*\+|\+\s*""/.test(c)
      || [...bienChuoi].some((v) => new RegExp(`\\b${v}\\s*\\+(?!\\+)|\\+\\s*${v}\\b`).test(c))) {
      g.ghi('3.8', 'ruiRo', f, q + 1, 'nối chuỗi bằng + — đọc chặt mục 3.8 thì dùng StringBuilder / String.format');
    }
  }
}

// ─── soát cấp dự án (mục 1.1) ───────────────────────────────────

function soatKienTruc(tep: TepDaDoc[], g: GhiLoi) {
  const goi = new Set(tep.map((t) => t.goi));
  if (!goi.has('repository')) {
    g.ghi('1.1', 'truot', 'src/', null, 'KHÔNG có package repository — tờ checklist: "Bắt buộc phải có repository"');
  }
  for (const t of tep) {
    const f = t.duong;
    for (const [so, imp] of t.imports) {
      const dau = imp.split('.')[0]!;
      if (t.goi === 'controller' && dau === 'model') {
        g.ghi('1.1', 'truot', f, so, 'controller import model — "Controller … không làm việc với Model"');
      }
      if (t.goi === 'controller' && dau === 'utils') {
        g.ghi('1.1', 'ruiRo', f, so, 'controller import utils — Guide: controller "chỉ import DTO, View, Service"');
      }
      if (t.goi === 'main' && ['model', 'view', 'service', 'repository'].includes(dau)) {
        g.ghi('1.1', 'truot', f, so, `main import ${dau} — "Main chỉ làm việc với Controller, DTO, Utils"`);
      }
      if (t.goi === 'view' && ['model', 'service', 'repository', 'controller'].includes(dau)) {
        g.ghi('1.1', 'truot', f, so, `view import ${dau} — View chỉ nhận ResponseDTO từ controller`);
      }
    }
    const code = t.dong.map((d) => d.code);
    // đọc tệp / mã hoá ngoài main + utils
    if (!['main', 'utils'].includes(t.goi)) {
      code.forEach((c, i) => {
        if (/\b(FileUtils|MD5Utils|HashUtils)\s*\.\s*(read|load|hash|md5|encrypt|getMd5|toMd5)\w*\s*\(|new\s+(FileReader|FileInputStream)\b|\bMessageDigest\b|\bFiles\s*\.\s*(read\w*|lines|newBufferedReader)\s*\(/.test(c)) {
          g.ghi('1.1', 'truot', f, i + 1, 'đọc tệp / mã hoá ngoài Main — tờ giấy: "đọc từ file/mã hóa thực hiện ở Main"');
        }
      });
    }
    if (t.goi === 'view') {
      const coDto = t.truong.some((x) => /DTO/.test(x.kieu));
      if (!coDto) g.ghi('1.1', 'ruiRo', f, null, 'view không có thuộc tính ResponseDTO — tờ giấy: "nhận qua thuộc tính (ResponseDTO)"');
      for (const h of t.ham) {
        if (h.ctor || h.mods.includes('private')) continue;
        if (h.thamSo.length && !(h.ten.startsWith('set') && h.thamSo.length === 1)) {
          g.ghi('1.1', 'truot', f, h.dong, `view.${h.ten}(${h.thamSo.map((p) => p[0]).join(', ')}) nhận dữ liệu qua THAM SỐ — phải nhận qua thuộc tính`);
        }
      }
    }
    if (t.goi === 'controller') {
      const truongView = t.truong.filter((x) => /View$/.test(x.kieu.trim())).map((x) => x.ten);
      for (const h of t.ham) {
        if (h.ctor || !h.than) continue;
        const than = code.slice(h.than[0] + 1, h.than[1]).join('\n');
        const goiView: string[] = [];
        for (const v of truongView) {
          for (const m of than.matchAll(new RegExp(`\\b${v}\\s*\\.\\s*(\\w+)\\s*\\(`, 'g'))) {
            if (!m[1]!.startsWith('set')) goiView.push(m[1]!);
          }
        }
        if (goiView.length > 1) {
          g.ghi('1.1', 'truot', f, h.dong, `controller.${h.ten} gọi view ${goiView.length} lần (${goiView.join(', ')}) — mỗi luồng chỉ render 1 lần`);
        }
        if (h.mods.includes('public')) {
          for (const [kieu] of h.thamSo) {
            const coModel = t.imports.some(([, imp]) => imp.startsWith('model.') && imp.endsWith('.' + kieu));
            if (coModel) g.ghi('1.1', 'truot', f, h.dong, `controller.${h.ten} nhận MODEL ${kieu} — phải nhận RequestDTO`);
          }
        }
      }
    }
    if (t.goi === 'main') {
      const text = code.join('\n');
      const tenCtrl = new Set([...text.matchAll(/\b\w+Controller\s+(\w+)\s*[=;,)]/g)].map((m) => m[1]!));
      for (const h of t.ham) {
        if (!h.than) continue;
        const than = code.slice(h.than[0] + 1, h.than[1]).join('\n');
        const goiCtrl = (s: string) => {
          const ra: string[] = [];
          for (const v of tenCtrl) for (const m of s.matchAll(new RegExp(`\\b${v}\\s*\\.\\s*(\\w+)\\s*\\(`, 'g'))) ra.push(m[1]!);
          return ra;
        };
        if (/\bcase\b/.test(than)) {
          for (const doan of than.split(/\n\s*(?:case\b[^:]*|default)\s*:/).slice(1)) {
            const cs = goiCtrl(doan);
            if (cs.length > 1) {
              // Tờ giấy chỉ bắt View render 1 lần/luồng; "gọi controller 1 lần" là
              // câu của Guide.xlsx, và đề nào bắt kiểm ngay tại chỗ (mã phải tồn
              // tại trước khi hỏi tiếp) thì một lần gọi CHỈ ĐỂ KIỂM là cần — rủi ro.
              g.ghi('1.1', 'ruiRo', f, h.dong, `một case trong ${h.ten}() gọi controller ${cs.length} lần (${cs.join(', ')}) — Guide: mỗi luồng gọi controller 1 lần`);
            }
          }
        } else {
          const cs = goiCtrl(than);
          if (cs.length > 1 && h.ten !== 'main') {
            g.ghi('1.1', 'ruiRo', f, h.dong, `${h.ten}() gọi controller ${cs.length} lần (${cs.join(', ')}) — Guide: mỗi luồng gọi controller 1 lần`);
          }
          if (cs.length && /\b(while|for|do)\b/.test(than) && h.ten !== 'main') {
            g.ghi('1.1', 'ruiRo', f, h.dong, `${h.ten}() gọi controller trong vòng lặp hỏi lại`);
          }
        }
      }
    }
  }
}

// ─── cửa vào ────────────────────────────────────────────────────

export function soatDuAn(tepVao: TepJava[]): KetQuaMay {
  const g = new GhiLoi();
  const tep = tepVao.map(docTep);
  for (const t of tep) soatTep(t, g);
  soatKienTruc(tep, g);
  return {
    theoMuc: g.theoMuc,
    soFileJava: tep.length,
    goi: [...new Set(tep.map((t) => t.goi || '(mặc định)'))].sort(),
    coRepository: tep.some((t) => t.goi === 'repository'),
  };
}

/** Tóm tắt kết quả máy thành đoạn văn cho prompt chấm (gọn, có file:dòng). */
export function tomTatChoPrompt(kq: KetQuaMay, moiMuc = 8): string {
  const dong: string[] = [
    '=================================================================',
    'MACHINE CHECK of the submitted .java files (deterministic, line by line)',
    '=================================================================',
    `Files read: ${kq.soFileJava} · packages: ${kq.goi.join(', ') || '(none)'} · repository/: ${kq.coRepository ? 'present' : 'MISSING'}`,
    'Items marked "truot" here are MEASURED facts — report them as failures; do not',
    'argue them away. "ruiRo" = the sheet read strictly would flag it. Items not',
    'listed (3.1) are yours to judge. For 1.1, 1.3, 1.4, 1.6 and 3.5 you may ADD',
    'failures the machine cannot see (wrong layer, noun/verb, meaningless comment,',
    'case-sensitivity choice without a reason).',
  ];
  for (const [stt, m] of Object.entries(kq.theoMuc)) {
    if (m.ket === 'dat') {
      dong.push(`[${stt}] dat`);
      continue;
    }
    dong.push(`[${stt}] ${m.ket} — ${m.bangChung.length}${m.bangChung.length >= MAX_BANG_CHUNG ? '+' : ''} finding(s):`);
    for (const b of m.bangChung.slice(0, moiMuc)) {
      dong.push(`   - ${b.ket} ${b.file}${b.dong ? `:${b.dong}` : ''} ${b.ghiChu}`);
    }
  }
  return dong.join('\n');
}
