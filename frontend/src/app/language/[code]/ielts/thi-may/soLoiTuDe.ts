/**
 * Đổi câu SAI của phòng thi máy tính thành dòng Sổ lỗi (07/10/2026) — đủ chữ để đọc lại
 * mà không cần mở đề, kèm `duLieu: { deId, n }` để "Ôn sổ lỗi" dựng lại đúng câu đó từ đề.
 */
import type { DeDoc, DeNghe, Nhom } from './de/types';
import { TEN_DANG } from './de/types';
import { doanLyDo, type KetQuaCau } from './cham';
import type { GhiLoi } from '../chung/api';

export function moTaCau(g: Nhom, n: number): string {
  const dauHD = g.huongDan.split('\n').slice(0, 2).join(' ').replace(/\*\*/g, '');
  const thay = (t: string) => t.replace(/\[\[(\d+)\]\]/g, (_m, k: string) => (Number(k) === n ? '____' : '…')).replace(/\*\*/g, '');
  if (g.dong) {
    const d = g.dong.find((x) => x.includes(`[[${n}]]`));
    if (d) {
      const box = g.dang === 'summary-box' && g.hop ? `\nLựa chọn: ${g.hop.ds.map((o) => `${o.k} ${o.t}`).join(' · ')}` : '';
      return `${dauHD}\n${g.tieuDe ? `${g.tieuDe}: ` : ''}${thay(d.replace(/^(## |• |→ )/, ''))}${box}`;
    }
  }
  if (g.bang) {
    const h = g.bang.hang.find((r) => r.some((c) => c.includes(`[[${n}]]`)));
    if (h) return `${dauHD}\n${g.bang.dau.join(' | ')}\n${h.map(thay).join(' | ')}`;
  }
  if (g.dang === 'diagram') return `${dauHD}\n${g.tieuDe ?? 'Diagram'} — nhãn số ${n}`;
  if (g.nhieu) return `${dauHD}\n${g.nhieu.s}\n${g.nhieu.chon.map((o) => `${o.k}. ${o.t}`).join('\n')}`;
  const c = g.cau?.find((x) => x.n === n);
  if (c) {
    const chon = c.chon ? `\n${c.chon.map((o) => `${o.k}. ${o.t}`).join('\n')}` : '';
    const hop = g.hop && g.dang !== 'map' ? `\n${g.hop.tieuDe ?? 'Lựa chọn'}: ${g.hop.ds.map((o) => `${o.k}. ${o.t}`).join(' · ')}` : '';
    return `${dauHD}\n${g.dang === 'map' ? `${g.tieuDe ?? 'Map'} — ` : ''}${c.s}${chon}${hop}`;
  }
  return dauHD;
}

/** Hiện câu trả lời kèm chữ của lựa chọn (B → "B. encourage us to…"). */
export function nhanTraLoi(g: Nhom, n: number, v: string): string {
  if (!v) return '(bỏ trống)';
  const o = g.cau?.find((x) => x.n === n)?.chon?.find((x) => x.k === v) ?? g.nhieu?.chon.find((x) => x.k === v) ?? (g.dang !== 'map' ? g.hop?.ds.find((x) => x.k === v) : undefined);
  return o && o.t !== o.k ? `${o.k}. ${o.t}` : v;
}

export function dongSoLoi(de: DeDoc | DeNghe, kq: KetQuaCau[], theoSo: Map<number, Nhom>): GhiLoi[] {
  const ra: GhiLoi[] = [];
  for (const k of kq) {
    if (k.dung) continue;
    const g = theoSo.get(k.n);
    const da = de.dapAn[k.n];
    if (!g || !da) continue;
    ra.push({
      nguon: `cdt:${de.id}:${k.n}`,
      kyNang: de.kyNang,
      dang: TEN_DANG[g.dang],
      cauHoi: `[${de.ten} · câu ${k.n}] ${moTaCau(g, k.n)}`.slice(0, 1990),
      daChon: nhanTraLoi(g, k.n, k.traLoi),
      dapAn: g.dang === 'mcq2' ? da.a.map((x) => nhanTraLoi(g, k.n, x)).join(' + ') : da.a.map((x) => nhanTraLoi(g, k.n, x)).join(' / '),
      giaiThich: da.vi.replace(/\*\*/g, ''),
      lyDo: doanLyDo(k, da, g.gioiHan, de.kyNang),
      duLieu: { deId: de.id, n: k.n },
    });
  }
  return ra;
}
