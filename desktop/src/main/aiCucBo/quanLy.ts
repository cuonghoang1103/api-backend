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
import { mkdir, rm } from 'node:fs/promises';
import { arch, platform } from 'node:os';
import { join } from 'node:path';
import {
  bat, daCoTron, giaiNen, tat, tenLlamaServer, timTep, trangThai, xoaModel,
} from './chay';
import {
  type MaModel, type Model, duongBoChay, duongModel, goiBoChay, loiKhuyen, MODEL, timModel, tongGb,
} from './kho';
import { hoiThietBiThat, quetMay, type KetQuaQuet } from './quetMay';
import { LoiTai, taiFile, type TienDo } from './taiVe';

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
const thuMucModel = (): string => join(goc(), 'model');
const duongTrenDia = (m: Model, file = m.file): string => join(thuMucModel(), file);

/** Byte mong đợi của một file model — dùng để biết nó đã tải trọn chưa. */
const byteMong = (gb: number): number => Math.round(gb * 1e9);

/** Tệp chạy llama-server sau khi đã giải nén, hoặc `null` nếu chưa cài. */
export async function timBoChay(): Promise<string | null> {
  return timTep(thuMucBoChay(), tenLlamaServer(platform()));
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
    const that = await hoiThietBiThat(boChay);
    /* Phép đo không chạy tới nơi thì GIỮ NGUYÊN phỏng đoán cũ và vẫn để
       `chacChan: false` — thà nói "chưa chắc" còn hơn nói một điều sai. */
    if (that.chayDuoc) {
      mayThat = { ...may, coGpu: that.coGpu, chacChan: true, tenGpu: that.ten || may.tenGpu };
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
async function caiBoChay(bao: (b: BuocTai) => void, signal?: AbortSignal): Promise<string> {
  const goiList = goiBoChay(platform(), arch());
  if (!goiList.length) {
    throw new LoiCucBo('AI ngoại tuyến chưa hỗ trợ loại máy này.');
  }

  let loiCuoi = '';
  for (const g of goiList) {
    const tepGoi = join(thuMucBoChay(), g.ten);
    try {
      await taiFile({
        url: duongBoChay(g),
        dich: tepGoi,
        coMong: g.mb * 1e6,
        signal,
        onTienDo: (t: TienDo) => bao({
          viec: 'Đang tải bộ chạy…',
          phanTram: t.tong ? Math.round((t.daCo / t.tong) * 8) : 0,
          bps: t.bps,
        }),
      });
      bao({ viec: 'Đang giải nén bộ chạy…', phanTram: 9, bps: 0 });
      await giaiNen(tepGoi, thuMucBoChay(), platform());

      const tep = await timBoChay();
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
        await rm(thuMucBoChay(), { recursive: true, force: true });
        continue;
      }

      /* Chạy không nổi VÀ KHÔNG PHẢI quá hạn ⇒ gói hỏng thật (thiếu thư viện,
         sai kiến trúc). Lùi sang gói sau nếu còn. */
      if (!that.chayDuoc && !that.quaHan && goiList.length > 1 && g !== goiList[goiList.length - 1]) {
        loiCuoi = `Gói ${g.tangToc} không chạy được trên máy này.`;
        await rm(thuMucBoChay(), { recursive: true, force: true });
        continue;
      }
      await rm(tepGoi, { force: true });
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
    onTin: (chu) => yc.bao({ viec: chu, phanTram: 98, bps: 0 }),
  });
  yc.bao({ viec: 'Xong.', phanTram: 100, bps: 0 });
}

/** Bật một model đã tải sẵn. */
export async function batModel(ma: MaModel): Promise<string> {
  const m = timModel(ma);
  if (!m) throw new LoiCucBo('Không có bản này.');
  if (!(await daCoModel(m))) throw new LoiCucBo(`Chưa tải ${m.ten}.`);
  const boChay = await timBoChay();
  if (!boChay) throw new LoiCucBo('Chưa cài bộ chạy.');

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
