/**
 * LOGO chữ "CuongMini" — hai cỡ: "ANSI Shadow" 6 dòng (72 cột) cho terminal
 * rộng, "Calvin S" 3 dòng (23 cột) cho terminal hẹp. Dựng từ bảng nét từng
 * chữ để bề ngang mỗi dòng luôn bằng nhau (gõ tay cả khối là sẽ lệch).
 */
import { laAscii } from './kyTu';
import { THUONG_HIEU, capMau, chuyenSac, doRong } from './mau';

const LON: Record<string, string[]> = {
  C: [' ██████╗', '██╔════╝', '██║     ', '██║     ', '╚██████╗', ' ╚═════╝'],
  u: ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  o: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  n: ['███╗   ██╗', '████╗  ██║', '██╔██╗ ██║', '██║╚██╗██║', '██║ ╚████║', '╚═╝  ╚═══╝'],
  g: [' ██████╗ ', '██╔════╝ ', '██║  ███╗', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  M: ['███╗   ███╗', '████╗ ████║', '██╔████╔██║', '██║╚██╔╝██║', '██║ ╚═╝ ██║', '╚═╝     ╚═╝'],
  i: ['██╗', '██║', '██║', '██║', '██║', '╚═╝'],
};

const NHO: Record<string, string[]> = {
  C: ['╔═╗', '║  ', '╚═╝'],
  u: ['┬ ┬', '│ │', '└─┘'],
  o: ['┌─┐', '│ │', '└─┘'],
  n: ['┌┐┌', '│││', '┘└┘'],
  g: ['┌─┐', '│ ┬', '└─┘'],
  M: ['╔╦╗', '║║║', '╩ ╩'],
  i: ['┬', '│', '┴'],
};

function dung(bang: Record<string, string[]>, chu: string): string[] {
  const so = bang.C!.length;
  const ra = Array.from({ length: so }, () => '');
  for (const c of chu) {
    const g = bang[c]!;
    const be = Math.max(...g.map((d) => doRong(d)));
    for (let i = 0; i < so; i += 1) ra[i] += (g[i] ?? '').padEnd(be);
  }
  return ra;
}

export const LOGO_LON = dung(LON, 'CuongMini');
export const LOGO_NHO = dung(NHO, 'CuongMini');

/** Logo vừa `rong` cột, tô chuyển sắc tím → xanh theo cột. */
export function veLogo(rong: number): string[] {
  // Console không vẽ được khối █/╗: dùng chữ thường, vẫn chuyển sắc.
  if (laAscii()) return [chuyenSac('C u o n g M i n i'), chuyenSac('=================', THUONG_HIEU.tim, THUONG_HIEU.xanh)];
  const logo = rong >= doRong(LOGO_LON[0]!) + 2 ? LOGO_LON : rong >= doRong(LOGO_NHO[0]!) ? LOGO_NHO : null;
  if (!logo) return [chuyenSac('✻ CuongMini')];
  const be = Math.max(...logo.map((d) => doRong(d)));
  if (capMau() === 0) return logo;
  return logo.map((d) => chuyenSac(d, THUONG_HIEU.tim, THUONG_HIEU.xanh, be));
}
