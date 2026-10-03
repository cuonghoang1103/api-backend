/**
 * ============================================================
 * ĐIỀU PHỐI AI NGOẠI TUYẾN — nối sổ, quét máy, tải, và chạy
 * ============================================================
 *
 * Các tệp bên cạnh mỗi tệp làm một việc và không biết tới nhau. Tệp này là
 * chỗ duy nhất biết cả bốn, và là chỗ duy nhất biết thư mục trên đĩa.
 *
 * ⚠️ `goc` được TRUYỀN VÀO chứ không gọi `app.getPath('userData')` ở đây. Có
 * hai lý do, cả hai đều đã cắn ở chỗ khác trong dự án này: nạp `electron` vào
 * một tệp logic làm mọi phép kiểm phải dựng cả Electron lên; và một hằng số
 * đường dẫn chôn trong tệp là thứ không ai thay được khi cần.
 */
import { mkdir, readFile, rm } from 'node:fs/promises';
import { arch, platform } from 'node:os';
import { join } from 'node:path';
import {
  bat, daCoTron, giaiNen, tat, tenLlamaServer, timTep, trangThai, xoaModel,
} from './chay';
import {
  type GoiBoChay, type LoiKhuyenCode, type MaModel, type Model,
  duongBoChay, duongModel, goiBoChay, loiKhuyen, loiKhuyenCode, MODEL, shaCua, timModel, tongGb,
} from './kho';
import { hoiThietBiThat, quetMay, type KetQuaQuet, type ThietBiThat } from './quetMay';
import { kiemSha256, LoiTai, taiFile, type TienDo } from './taiVe';

export interface BuocTai {
  /** Việc đang làm, viết cho người dùng đọc. */
  viec: string;
  /** 0-100 cho TOÀN BỘ việc cài, không phải cho từng file. */
  phanTram: number;
  bps: number;
}

export interface TinhTrang {
  may: KetQuaQuet;
  khuyen: ReturnType<typeof loiKhuyen>;
  /** Bộ chạy đã cài chưa. */
  coBoChay: boolean;
  /** Model nào đã có sẵn trên đĩa. */
  daCo: MaModel[];
  /** Model nào đang chạy. `null` = chưa bật. */
  dangChay: MaModel | null;
  /** Chỗ gọi khi đã bật. `null` = chưa bật. */
  goc: string | null;
  /** Máy này chạy AI Code ngoại tuyến bằng bản nào, và vì sao. */
  khuyenCode: LoiKhuyenCode;
  /** Bộ chạy đang cài là gói CUDA (chỉ Windows + NVIDIA + bản 30B). */
  boChayCuda: boolean;
}

export class LoiCucBo extends Error {}

let thuMucGoc = '';

/** Đặt thư mục gốc. Gọi một lần lúc app khởi động. */
export function datGoc(g: string): void {
  thuMucGoc = g;
}

function goc(): string {
  if (!thuMucGoc) throw new LoiCucBo('Chưa đặt thư mục cho AI ngoại tuyến.');
  return thuMucGoc;
}

const thuMucBoChay = (): string => join(goc(), 'bo-chay');
/**
 * Gói CUDA ở thư mục RIÊNG. Người đã cài bản Vulkan cho chat rồi mới cài bản
 * 30B thì gói CUDA nằm cạnh, không đè lên — CUDA hỏng (driver cũ) thì bộ chạy
 * cũ vẫn nguyên, không phải tải lại.
 */
const thuMucBoChayCuda = (): string => join(goc(), 'bo-chay-cuda');
const thuMucModel = (): string => join(goc(), 'model');
const duongTrenDia = (m: Model, file = m.file): string => join(thuMucModel(), file);

/** Byte mong đợi của một file model — dùng để biết nó đã tải trọn chưa. */
const byteMong = (gb: number): number => Math.round(gb * 1e9);

/** Tệp chạy llama-server sau khi đã giải nén, hoặc `null` nếu chưa cài. Ưu tiên gói CUDA nếu có. */
export async function timBoChay(): Promise<string | null> {
  const ten = tenLlamaServer(platform());
  return (await timTep(thuMucBoChayCuda(), ten)) ?? timTep(thuMucBoChay(), ten);
}

/**
 * Đệm kết quả `--list-devices` theo đường dẫn bộ chạy.
 *
 * ⚠️ Lần chạy ĐẦU trên macOS mất 22 giây (quét mã độc). `tinhTrang()` được gọi
 * mỗi lần mở Cài đặt, mỗi lần mạng đổi, mỗi lần AI Code quyết định chạy đâu —
 * đo lại mỗi lần là bắt người dùng chờ vô ích cho một con số không đổi.
 */
let demThietBi: { duong: string; kq: ThietBiThat } | null = null;
async function thietBiCua(duong: string): Promise<ThietBiThat> {
  if (demThietBi?.duong === duong) return demThietBi.kq;
  const kq = await hoiThietBiThat(duong);
  if (kq.chayDuoc) demThietBi = { duong, kq };
  return kq;
}

/** Model này đã tải trọn chưa (kể cả mmproj nếu có). */
async function daCoModel(m: Model): Promise<boolean> {
  if (!(await daCoTron(duongTrenDia(m), byteMong(m.gb)))) return false;
  if (m.mmproj && !(await daCoTron(duongTrenDia(m, m.mmproj.file), byteMong(m.mmproj.gb)))) {
    return false;
  }
  return true;
}

/**
 * Toàn cảnh cho giao diện vẽ.
 *
 * Gọi được bất cứ lúc nào và không bao giờ ném — màn hình cài đặt phải luôn
 * hiện ra được, kể cả trên máy mà mọi thứ đều hỏng.
 */
export async function tinhTrang(): Promise<TinhTrang> {
  const may = await quetMay(thuMucModel());

  /* Đã cài bộ chạy thì HỎI CHÍNH NÓ thay vì tin phép đoán từ tên thiết bị.
     Đây là chỗ `chacChan: false` thành `true` — xem `quetMay.ts`. */
  const boChay = await timBoChay();
  let mayThat = may;
  if (boChay) {
    const that = await thietBiCua(boChay);
    /* Phép đo không chạy tới nơi thì GIỮ NGUYÊN phỏng đoán cũ và vẫn để
       `chacChan: false` — thà nói "chưa chắc" còn hơn nói một điều sai. */
    if (that.chayDuoc) {
      mayThat = {
        ...may, coGpu: that.coGpu, chacChan: true, tenGpu: that.ten || may.tenGpu,
        /* Apple Silicon báo "VRAM" là phần bộ nhớ hợp nhất GPU được dùng —
           không phải card rời; luật Apple đã đi bằng RAM nên giữ nguyên. */
        vramGb: Math.max(may.vramGb ?? -1, that.vramGb ?? -1),
      };
    }
  }

  const daCo: MaModel[] = [];
  for (const m of MODEL) {
    if (await daCoModel(m)) daCo.push(m.ma);
  }

  const chay = trangThai();
  return {
    may: mayThat,
    khuyen: loiKhuyen({ ramGb: mayThat.ramGb, diaGb: mayThat.diaGb, coGpu: mayThat.coGpu }),
    coBoChay: !!boChay,
    daCo,
    dangChay: (chay?.maModel as MaModel) ?? null,
    goc: chay?.goc ?? null,
    khuyenCode: loiKhuyenCode({
      ramGb: mayThat.ramGb, diaGb: mayThat.diaGb, coGpu: mayThat.coGpu,
      nenTang: mayThat.nenTang, kienTruc: mayThat.kienTruc,
      ...(mayThat.vramGb !== undefined ? { vramGb: mayThat.vramGb } : {}),
    }),
    boChayCuda: !!boChay && boChay.startsWith(thuMucBoChayCuda()),
  };
}

/**
 * Cài bộ chạy: thử gói nhanh trước, hỏng thì lùi sang gói chậm hơn.
 *
 * ⚠️ "Hỏng" ở đây KHÔNG phải lỗi tải — mà là gói tải về rồi nhưng không chạy
 * nổi trên máy này. Bản Vulkan thiếu loader của driver là đúng trường hợp đó,
 * và nó chỉ lộ ra khi CHẠY THẬT. Nên sau khi giải nén phải hỏi nó một câu
 * (`--list-devices`) rồi mới coi là cài xong.
 */
async function caiBoChay(
  bao: (b: BuocTai) => void,
  signal?: AbortSignal,
  goiList: GoiBoChay[] = goiBoChay(platform(), arch()),
  thuMuc: string = thuMucBoChay(),
): Promise<string> {
  if (!goiList.length) {
    throw new LoiCucBo('AI ngoại tuyến chưa hỗ trợ loại máy này.');
  }

  let loiCuoi = '';
  for (const g of goiList) {
    const tepGoi = join(thuMuc, g.ten);
    try {
      /* Gói kèm (cudart) tải TRƯỚC và giải nén CÙNG thư mục: dll của nó phải
         nằm cạnh `llama-server.exe` — xem `GoiBoChay.kem`. */
      const canTai = [...(g.kem ? [g.kem] : []), { ten: g.ten, mb: g.mb }];
      const tongMb = canTai.reduce((a, x) => a + x.mb, 0);
      let daMb = 0;
      for (const f of canTai) {
        const tep = join(thuMuc, f.ten);
        await taiFile({
          url: duongBoChay(f),
          dich: tep,
          coMong: f.mb * 1e6,
          signal,
          onTienDo: (t: TienDo) => bao({
            viec: g.tangToc === 'cuda' ? 'Đang tải bộ chạy CUDA…' : 'Đang tải bộ chạy…',
            phanTram: Math.round(((daMb * 1e6 + t.daCo) / (tongMb * 1e6)) * 8),
            bps: t.bps,
          }),
        });
        daMb += f.mb;
        bao({ viec: 'Đang giải nén bộ chạy…', phanTram: 9, bps: 0 });
        await giaiNen(tep, thuMuc, platform());
        if (f !== canTai[canTai.length - 1]) await rm(tep, { force: true });
      }

      const tep = await timTep(thuMuc, tenLlamaServer(platform()));
      if (!tep) { loiCuoi = 'Giải nén xong nhưng không thấy tệp chạy.'; continue; }

      /* CHẠY THẬT rồi mới tin. Gói Vulkan trên máy thiếu loader sẽ chết ở đúng
         đây, và đó chính là tín hiệu để lùi sang gói CPU.

         ⚠️ Lần chạy ĐẦU của tệp vừa giải nén rất lâu trên macOS (đo thật 22,09
         giây — hệ quét mã độc tệp ký kiểu adhoc). Nói cho người dùng biết,
         không thì họ nhìn một thanh tiến độ đứng im nửa phút. */
      bao({ viec: 'Đang kiểm tra bộ chạy (lần đầu có thể lâu)…', phanTram: 9, bps: 0 });
      const that = await hoiThietBiThat(tep);

      /* ⚠️⚠️ CHỈ lùi khi phép đo CHẠY TỚI NƠI mà không thấy GPU. Quá hạn nghĩa
         là CHƯA BIẾT GÌ CẢ — coi nó là "không có GPU" sẽ xoá mất một gói hoàn
         toàn tốt, và trên macOS (chỉ có MỘT gói, không có gói lùi) thì cài
         hỏng hẳn. Đây là lỗi thật, đo được 15/09/2026. */
      if (g.tangToc !== 'cpu' && that.chayDuoc && !that.coGpu) {
        loiCuoi = `Gói ${g.tangToc} không dùng được GPU trên máy này.`;
        /* Dọn sạch trước khi thử gói sau — trộn hai bộ thư viện vào cùng một
           thư mục là cách chắc chắn để cả hai cùng hỏng. */
        await rm(thuMuc, { recursive: true, force: true });
        continue;
      }

      /* Chạy không nổi VÀ KHÔNG PHẢI quá hạn ⇒ gói hỏng thật (thiếu thư viện,
         sai kiến trúc). Lùi sang gói sau nếu còn. */
      if (!that.chayDuoc && !that.quaHan && goiList.length > 1 && g !== goiList[goiList.length - 1]) {
        loiCuoi = `Gói ${g.tangToc} không chạy được trên máy này.`;
        await rm(thuMuc, { recursive: true, force: true });
        continue;
      }
      await rm(tepGoi, { force: true });
      demThietBi = that.chayDuoc ? { duong: tep, kq: that } : demThietBi;
      return tep;
    } catch (e) {
      if (e instanceof LoiTai && e.maLoi === 'huy') throw e;
      loiCuoi = (e as Error)?.message ?? 'lỗi không rõ';
    }
  }
  throw new LoiCucBo(`Không cài được bộ chạy. ${loiCuoi}`);
}

export interface YeuCauCai {
  ma: MaModel;
  bao: (b: BuocTai) => void;
  signal?: AbortSignal;
}

/**
 * Tải và bật một model. Đây là thứ nút "Tải AI ngoại tuyến" gọi.
 *
 * Thang tiến độ chia theo phần trăm CỦA CẢ VIỆC, không phải của từng file:
 * bộ chạy 0-10%, model 10-95%, bật máy 95-100%. Người dùng nhìn một thanh
 * chạy từ 0 tới 100 một lần, thay vì ba thanh mỗi cái tự nhảy về 0.
 */
export async function cai(yc: YeuCauCai): Promise<void> {
  const m = timModel(yc.ma);
  if (!m) throw new LoiCucBo('Không có bản này.');

  await mkdir(thuMucModel(), { recursive: true });
  await mkdir(thuMucBoChay(), { recursive: true });

  let boChay = await timBoChay();
  /* Bản 30B trên Windows + NVIDIA ⇒ thêm gói CUDA vào thư mục riêng (xem
     `GOI_CUDA_WIN` ở kho.ts). Hỏng thì KHÔNG chặn cài — bộ chạy thường vẫn
     chạy được bản 30B, chỉ chậm hơn. */
  if (m.ma === 'code' && platform() === 'win32' && arch() === 'x64'
    && !(boChay ?? '').startsWith(thuMucBoChayCuda())) {
    const may = await quetMay(thuMucModel());
    if (may.nvidia) {
      const cuda = goiBoChay('win32', 'x64', { cuda: true }).filter((g) => g.tangToc === 'cuda');
      await mkdir(thuMucBoChayCuda(), { recursive: true });
      try {
        boChay = await caiBoChay(yc.bao, yc.signal, cuda, thuMucBoChayCuda());
      } catch (e) {
        if (e instanceof LoiTai && e.maLoi === 'huy') throw e;
        await rm(thuMucBoChayCuda(), { recursive: true, force: true });
        yc.bao({ viec: 'Gói CUDA không chạy được trên máy này — dùng bộ chạy thường.', phanTram: 9, bps: 0 });
      }
    }
  }
  if (!boChay) boChay = await caiBoChay(yc.bao, yc.signal);

  /* mmproj tải TRƯỚC file model lớn. Nó nhỏ hơn nhiều, nên hỏng thì hỏng sớm —
     thay vì để người dùng chờ hết 2,5 GB rồi mới gãy ở file 840 MB. */
  const canTai: Array<{ file: string; gb: number }> = [];
  if (m.mmproj) canTai.push({ file: m.mmproj.file, gb: m.mmproj.gb });
  canTai.push({ file: m.file, gb: m.gb });

  const tongByte = byteMong(tongGb(m));
  let daXong = 0;
  for (const f of canTai) {
    await taiFile({
      url: duongModel(m, f.file),
      dich: duongTrenDia(m, f.file),
      coMong: byteMong(f.gb),
      sha256: shaCua(m, f.file),
      signal: yc.signal,
      onTienDo: (t) => yc.bao({
        viec: `Đang tải ${m.ten}…`,
        phanTram: 10 + Math.round(((daXong + t.daCo) / tongByte) * 85),
        bps: t.bps,
      }),
    });
    daXong += byteMong(f.gb);
  }

  yc.bao({ viec: 'Đang khởi động AI trên máy…', phanTram: 96, bps: 0 });
  const tt = await tinhTrang();
  await bat({
    duongLlamaServer: boChay,
    duongModel: duongTrenDia(m),
    ...(m.mmproj ? { duongMmproj: duongTrenDia(m, m.mmproj.file) } : {}),
    maModel: m.ma,
    coGpu: tt.may.coGpu,
    ...(m.code && m.ma === 'code' ? { cuaSo: m.code.cuaSo } : {}),
    onTin: (chu) => yc.bao({ viec: chu, phanTram: 98, bps: 0 }),
  });
  yc.bao({ viec: 'Xong.', phanTram: 100, bps: 0 });
}

/**
 * Kiểm SHA-256 MỘT LẦN cho file đã có trên đĩa trước khi bật (nhớ bằng tệp
 * `.sha256`). Bắt những file đã hỏng từ trước bản ghim revision — xem
 * `kiemSha256` ở taiVe.ts. Hỏng ⇒ XOÁ (giữ nó là để model nhả rác mãi) và
 * nói người dùng tải lại.
 */
async function damBaoNguyenVen(m: Model, onTin?: (chu: string) => void): Promise<void> {
  const files = [m.file, ...(m.mmproj ? [m.mmproj.file] : [])];
  for (const f of files) {
    const duong = duongTrenDia(m, f);
    /* Chỉ báo khi thật sự phải băm — đã có dấu `.sha256` thì kiểm tức thì. */
    const daNho = await readFile(`${duong}.sha256`, 'utf8').catch(() => '');
    if (daNho.trim() !== shaCua(m, f)) onTin?.('Đang kiểm tra file model (chỉ lần đầu)…');
    if (!(await kiemSha256(duong, shaCua(m, f)))) {
      await xoaModel(duong);
      throw new LoiCucBo(
        `File của ${m.ten} trên máy bị HỎNG (sai mã kiểm tra) nên đã xoá. `
        + 'Vào Cài đặt → AI ngoại tuyến và tải lại bản này.',
      );
    }
  }
}

/** Bật một model đã tải sẵn. */
export async function batModel(ma: MaModel): Promise<string> {
  const m = timModel(ma);
  if (!m) throw new LoiCucBo('Không có bản này.');
  if (!(await daCoModel(m))) throw new LoiCucBo(`Chưa tải ${m.ten}.`);
  const boChay = await timBoChay();
  if (!boChay) throw new LoiCucBo('Chưa cài bộ chạy.');

  if (trangThai()?.maModel !== ma) await damBaoNguyenVen(m);
  const tt = await tinhTrang();
  const r = await bat({
    duongLlamaServer: boChay,
    duongModel: duongTrenDia(m),
    ...(m.mmproj ? { duongMmproj: duongTrenDia(m, m.mmproj.file) } : {}),
    maModel: ma,
    coGpu: tt.may.coGpu,
  });
  return r.goc;
}

export async function tatModel(): Promise<void> {
  await tat();
}

/** Xoá một model khỏi đĩa. Tắt máy chủ trước — Windows không xoá được tệp đang mở. */
export async function xoa(ma: MaModel): Promise<void> {
  const m = timModel(ma);
  if (!m) return;
  await xoaModel(duongTrenDia(m));
  if (m.mmproj) await xoaModel(duongTrenDia(m, m.mmproj.file));
}

/** Gỡ sạch: cả model lẫn bộ chạy. Dùng khi người dùng muốn lấy lại đĩa. */
export async function goSach(): Promise<void> {
  await tat();
  await rm(goc(), { recursive: true, force: true });
}


// ─── Chọn và bật model cho TỪNG việc (03/10/2026) ──────────────────

/** Model AI Code ngoại tuyến sẽ dùng trên máy này — để giao diện vẽ trước khi mất mạng. */
export interface ModelChoCode {
  /** `null` = chưa có bản nào dùng được (chưa tải, hoặc máy không đủ sức). */
  ma: MaModel | null;
  ten: string;
  nhan: string;
  /** Lý do / lời khuyên — tiếng Việt cho người dùng. */
  vi: string;
  /** Máy đủ sức chạy bản này nhưng CHƯA tải ⇒ giao diện mời mở trang cài. */
  nenTai: MaModel | null;
}

/** Thứ tự ưu tiên khi chọn trong số bản ĐÃ TẢI. */
const UU_TIEN_CODE: MaModel[] = ['code', 'vua'];
const UU_TIEN_CHAT: MaModel[] = ['vua', 'code', 'anh', 'nho'];

export function chonModelCode(tt: Pick<TinhTrang, 'daCo' | 'khuyenCode'>): ModelChoCode {
  const k = tt.khuyenCode;
  const ma = UU_TIEN_CODE.find((x) => k.choPhep.includes(x) && tt.daCo.includes(x)) ?? null;
  if (ma) {
    const m = timModel(ma)!;
    return { ma, ten: m.ten, nhan: m.code?.nhan ?? '', vi: k.vi, nenTai: null };
  }
  return {
    ma: null,
    ten: '',
    nhan: '',
    vi: k.nen ? `Chưa tải bản cho AI Code ngoại tuyến. ${k.vi}` : k.vi,
    nenTai: k.nen,
  };
}

/** Model chat sẽ dùng khi mất mạng: bản đang chạy, rồi tới bản đã tải mà máy chịu được. */
export function chonModelChat(tt: Pick<TinhTrang, 'daCo' | 'khuyen' | 'khuyenCode' | 'dangChay'>): MaModel | null {
  if (tt.dangChay) return tt.dangChay;
  const duoc = new Set<MaModel>([...tt.khuyen.choPhep, ...tt.khuyenCode.choPhep]);
  if (tt.khuyen.nen && tt.daCo.includes(tt.khuyen.nen)) return tt.khuyen.nen;
  return UU_TIEN_CHAT.find((x) => duoc.has(x) && tt.daCo.includes(x)) ?? null;
}

export async function modelChoCode(): Promise<ModelChoCode> {
  return chonModelCode(await tinhTrang());
}

/**
 * Bật model cho AI Code với đúng cửa sổ ngữ cảnh của nó. Đang chạy cùng bản mà
 * cửa sổ nhỏ hơn (chat 8k) ⇒ `bat()` tự bật lại.
 *
 * Lượt bật này là do LƯỚI ĐỠ ⇒ tự tắt sau 15 phút để không (`danhDauNguoiDungBat`
 * không được gọi ở đây).
 */
export async function batChoCode(onTin?: (chu: string) => void, epMa?: MaModel): Promise<{
  goc: string; ma: MaModel; ten: string; nhan: string; cuaSo: number; tranBuoc: number;
}> {
  const tt = await tinhTrang();
  /* `epMa` CHỈ cho phép kiểm thật / CI (đo bản 1,7B trên máy không GPU) — bỏ
     qua lời khuyên theo sức máy, nhưng vẫn đòi file đã tải trọn. Giao diện
     không bao giờ truyền nó. */
  const chon = epMa
    ? { ma: tt.daCo.includes(epMa) ? epMa : null, vi: `Chưa tải bản ${epMa}.` }
    : chonModelCode(tt);
  if (!chon.ma) throw new LoiCucBo(chon.vi);
  const m = timModel(chon.ma)!;
  const boChay = await timBoChay();
  if (!boChay) throw new LoiCucBo('Chưa cài bộ chạy AI ngoại tuyến.');
  if (trangThai()?.maModel !== m.ma) await damBaoNguyenVen(m, onTin);
  const r = await bat({
    duongLlamaServer: boChay,
    duongModel: duongTrenDia(m),
    maModel: m.ma,
    coGpu: tt.may.coGpu,
    cuaSo: m.code?.cuaSo ?? 8192,
    ...(onTin ? { onTin } : {}),
  });
  return {
    goc: r.goc, ma: m.ma, ten: m.ten, nhan: m.code?.nhan ?? 'chỉ việc nhỏ', cuaSo: r.cuaSo, tranBuoc: m.code?.tranBuoc ?? 8,
  };
}

/** Bật model cho chat khi mất mạng (nếu chưa chạy). `null` = chưa có bản nào để bật. */
export async function batChoChat(): Promise<string | null> {
  const dang = trangThai();
  if (dang) return dang.goc;
  const tt = await tinhTrang();
  const ma = chonModelChat(tt);
  if (!ma) return null;
  return batModel(ma);
}
