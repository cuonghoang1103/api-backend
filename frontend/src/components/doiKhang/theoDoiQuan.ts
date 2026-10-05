/**
 * Giữ "danh tính" quân cờ qua các thế cờ — để React giữ nguyên phần tử và CSS transition trượt
 * quân từ ô cũ sang ô mới (FLIP), kể cả nhập thành (xe cũng trượt) và phong cấp (tốt hoá hậu tại chỗ).
 *
 * Luật ghép: (1) quân cùng loại đứng yên giữ id; (2) ô mới có quân ⇒ lấy quân CÙNG LOẠI vừa biến mất,
 * ưu tiên ô xuất phát của nước cuối, rồi gần nhất; (3) không có ⇒ quân cùng màu vừa biến mất (phong
 * cấp); (4) còn lại ⇒ id mới (ván mới).
 */
export interface QuanCoId {
  id: number;
  o: number;
  quan: string;
}

const cungMau = (a: string, b: string) => (a === a.toUpperCase()) === (b === b.toUpperCase());

export function ghepQuan(
  cu: QuanCoId[],
  ban: (string | null)[],
  tuO: number | null,
  khoang: (a: number, b: number) => number,
  dem: { v: number },
): QuanCoId[] {
  const moi: QuanCoId[] = [];
  const conLai = new Map<number, QuanCoId>();
  for (const q of cu) conLai.set(q.id, q);
  const canGhep: number[] = [];
  for (let o = 0; o < ban.length; o++) {
    const quan = ban[o];
    if (!quan) continue;
    const giu = cu.find((q) => q.o === o && q.quan === quan && conLai.has(q.id));
    if (giu) {
      conLai.delete(giu.id);
      moi.push(giu);
    } else canGhep.push(o);
  }
  const chon = (o: number, dk: (q: QuanCoId) => boolean) => {
    let tot: QuanCoId | null = null;
    let d = Infinity;
    conLai.forEach((q) => {
      if (!dk(q)) return;
      const k = q.o === tuO ? -1 : khoang(q.o, o);
      if (k < d) { d = k; tot = q; }
    });
    return tot as QuanCoId | null;
  };
  for (const o of canGhep) {
    const quan = ban[o] as string;
    const q = chon(o, (x) => x.quan === quan) ?? chon(o, (x) => cungMau(x.quan, quan));
    if (q) {
      conLai.delete(q.id);
      moi.push({ id: q.id, o, quan });
    } else moi.push({ id: ++dem.v, o, quan });
  }
  return moi;
}
