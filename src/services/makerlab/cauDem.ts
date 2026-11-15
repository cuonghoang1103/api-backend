/**
 * ============================================================
 * Maker Lab — CÂU ĐỆM làm sẵn cho robot Odin (15/11/2026)
 * ============================================================
 *
 * Người dùng: "câu khó cần suy nghĩ thì nó bảo đợi một xíu, như tìm thông tin —
 * giao tiếp tự nhiên như con người".
 *
 * Câu khó / cần tra cứu ⇒ robot nói NGAY một câu đệm bằng chính giọng của nó
 * ("Để mình tra thông tin xíu nhé…") trong lúc não + máy đọc chạy phía sau.
 * Câu thường ⇒ không đệm, đáp thẳng.
 *
 * ⚠️ TIẾNG LÀM SẴN, KHÔNG SINH LÚC CHẠY. Tiếng "Ừmmm" gỡ hôm 12/08/2026 hỏng
 * vì nó được sinh ngầm trên CÙNG hàng đợi mô hình với câu trả lời thật ⇒ có
 * lượt robot im 42 giây. Ở đây file PCM nằm sẵn trong `data/makerlab/cau-dem/`
 * (dựng một lần: `node scripts/makerlab-dung-cau-dem.mjs`), lúc chạy chỉ đọc đĩa.
 *
 * Tắt: `MAKERLAB_CAU_DEM=0`. Giọng persona chưa có bộ câu đệm ⇒ tự bỏ qua.
 */
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../../utils/logger.js';
import { gainDbChoGiong } from './tts.js';

export type LoaiDem = 'nghi' | 'tra' | 'heThong';

/** Câu này cần đệm loại nào. THUẦN — test đọc. Thứ tự: hệ thống > tra web > câu khó. */
export function chonLoaiDem(o: { heThong: boolean; tra: boolean; kho: boolean }): LoaiDem | null {
  if (o.heThong) return 'heThong';
  if (o.tra) return 'tra';
  if (o.kho) return 'nghi';
  return null;
}

export function cauDemBat(): boolean {
  return process.env.MAKERLAB_CAU_DEM?.trim() !== '0';
}

interface MauDem { id: string; chu: string; pcm: Buffer }
type KhoGiong = Map<LoaiDem, MauDem[]>;

const THU_MUC = () => path.join(process.cwd(), 'data', 'makerlab', 'cau-dem');
const _kho = new Map<string, KhoGiong | null>();

/**
 * Nhân gain + kẹp ở 0,95 (cùng trần với `alimiter=limit=0.95` của đường sống) — để câu
 * đệm to bằng câu trả lời ngay sau nó. THUẦN — test đọc.
 */
export function apGain(pcm: Buffer, db: number): Buffer {
  if (!db) return pcm;
  const k = Math.pow(10, db / 20);
  const tran = Math.round(0.95 * 32767);
  const ra = Buffer.alloc(pcm.length - (pcm.length % 2));
  for (let i = 0; i < ra.length; i += 2) {
    const v = Math.round(pcm.readInt16LE(i) * k);
    ra.writeInt16LE(v > tran ? tran : v < -tran ? -tran : v, i);
  }
  return ra;
}

function napGiong(giong: string): KhoGiong | null {
  if (_kho.has(giong)) return _kho.get(giong) ?? null;
  let kho: KhoGiong | null = null;
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(THU_MUC(), 'cau.json'), 'utf8')) as {
      cau: Array<{ id: string; loai: LoaiDem; chu: string }>;
    };
    const db = gainDbChoGiong('cuongmini', giong);
    const m: KhoGiong = new Map();
    for (const c of cfg.cau) {
      const f = path.join(THU_MUC(), giong, `${c.id}.pcm`);
      if (!fs.existsSync(f)) continue;
      const pcm = apGain(fs.readFileSync(f), db);
      if (pcm.length < 8_000) continue;
      const ds = m.get(c.loai) ?? [];
      ds.push({ id: c.id, chu: c.chu, pcm });
      m.set(c.loai, ds);
    }
    kho = m.size ? m : null;
    logger.info('MakerLab nạp câu đệm', { giong, soCau: [...m.values()].reduce((n, d) => n + d.length, 0) });
  } catch (err) {
    logger.warn('MakerLab không nạp được câu đệm', { giong, error: (err as Error).message });
  }
  _kho.set(giong, kho);
  return kho;
}

const _lanTruoc = new Map<string, string>();

/** Lấy một câu đệm, không lặp lại đúng câu vừa nói. Không có ⇒ null. */
export function layCauDem(giong: string | null | undefined, loai: LoaiDem): { id: string; chu: string; pcm: Buffer } | null {
  if (!cauDemBat() || !giong) return null;
  const ds = napGiong(giong)?.get(loai);
  if (!ds?.length) return null;
  const khoa = `${giong}:${loai}`;
  const truoc = _lanTruoc.get(khoa);
  const conLai = ds.length > 1 ? ds.filter((d) => d.id !== truoc) : ds;
  const chon = conLai[Math.floor(Math.random() * conLai.length)];
  _lanTruoc.set(khoa, chon.id);
  return chon;
}
