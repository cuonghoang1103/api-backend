/**
 * KHỞI ĐỘNG một phiên làm việc (dùng chung cho màn tương tác và chế độ in):
 * nạp lõi ⇒ tạo cuộc ⇒ gắn thư mục ⇒ áp cờ `--che-do`/`--model`/`-c`.
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { format } from 'node:util';
import { timTheoChu, type PhienCu } from 'ct-lenh';
import type { CoDong } from './coDong';
import { KetNoiLoi } from './ketNoi';
import { KhoChat, type InfoLoi, type WsLoi } from './kho';
import { MODEL_DU_PHONG, doiTenModel, moPhien } from './lenh';
import { docCaiDat } from './caiDat';
import { thuMucGoc, type NguoiDung } from './phien';

export interface PhienLamViec { kn: KetNoiLoi; kho: KhoChat; canhBao: string[] }

export async function khoiDongPhien(nguoi: NguoiDung, co: CoDong, thuMuc: string, phienBan: string): Promise<PhienLamViec> {
  const kn = await KetNoiLoi.tao(nguoi, { thuMuc, phienBan });
  const kho = new KhoChat();
  kn.nghe((e) => kho.xuLy(e));
  const canhBao: string[] = [];
  const S = kho.S;
  const cd = docCaiDat();
  if (co.chiTiet) S.chiTiet = true;
  // `datThuMuc` của lõi đặt lại "Lập kế hoạch" (mở thư mục mới không bao giờ tự mở quyền) — cờ/cài đặt áp SAU nó.
  // Cờ thắng cài đặt; "Bỏ qua hết" không bao giờ đến từ file cài đặt (xem `chuanHoaCaiDat`).
  const cheDo = co.cheDo ?? cd.cheDoMacDinh;
  if (cheDo !== 'keHoach') {
    await kn.goi('agent:datCheDoQuyen', { cheDo }).catch((e: Error) => canhBao.push(`Không đặt được chế độ: ${e.message}`));
  }
  for (const d of co.themThuMuc ?? []) {
    const td = path.resolve(thuMuc, d);
    await kn.goi('agent:themDuong', { duong: td }).then(
      () => undefined,
      (e: Error) => canhBao.push(`Không thêm được thư mục ${td}: ${e.message}`),
    );
  }
  S.info = await kn.goi<InfoLoi>('agent:getInfo').catch(() => null);
  const model = co.model ?? cd.modelMacDinh ?? undefined;
  if (model) {
    const ds = (S.info?.models?.length ? S.info.models : MODEL_DU_PHONG).map((m) => ({ ...m, ten: doiTenModel(m.ten) }));
    const m = timTheoChu(model, ds);
    if (!m) canhBao.push(`Không rõ model "${model}" — có: ${ds.map((x) => x.id).join(', ')}. Giữ model đang chọn.`);
    else if (!m.dungDuoc) canhBao.push(`${m.ten} chưa mở trên máy chủ — giữ model đang chọn.`);
    else {
      await kn.goi('agent:datModel', { model: m.id }).catch((e: Error) => canhBao.push(`Không đổi được model: ${e.message}`));
      S.info = await kn.goi<InfoLoi>('agent:getInfo').catch(() => S.info);
    }
  }
  S.ws = await kn.goi<WsLoi>('agent:getWorkspace').catch(() => null);
  if (co.tiepTuc) {
    const tenDuAn = path.basename(thuMuc);
    const ds = await kn.goi<PhienCu[]>('agent:dsPhien').catch(() => [] as PhienCu[]);
    const p = ds.filter((x) => !x.luuTru && x.duAn === tenDuAn).sort((a, b) => b.luucLuc - a.luucLuc)[0];
    if (!p) canhBao.push(`Chưa có việc nào đã lưu của thư mục "${tenDuAn}" — bắt đầu việc mới.`);
    else await moPhien(p.id, p.tieuDe, { kho, kn, xoaManHinh: () => undefined }).catch((e: Error) => canhBao.push(e.message));
  }
  return { kn, kho, canhBao };
}

/**
 * Lõi (mã app desktop) có chỗ `console.log/warn` — để lọt ra terminal là vỡ
 * khung Ink. Gom vào `~/.cuongmini/logs/`; `CUONGMINI_DEBUG=1` thì để nguyên.
 */
export function chuyenNhatKy(): string | null {
  if (process.env.CUONGMINI_DEBUG === '1') return null;
  const thuMuc = path.join(thuMucGoc(), 'logs');
  const ngay = new Date().toISOString().slice(0, 10);
  const file = path.join(thuMuc, `cli-${ngay}.log`);
  let daTao = false;
  // Tạo thư mục khi có dòng đầu tiên — chạy `--help` hay pipe sai không được để lại thư mục rỗng.
  const ghi = (muc: string) => (...a: unknown[]) => {
    try {
      if (!daTao) { mkdirSync(thuMuc, { recursive: true, mode: 0o700 }); daTao = true; }
      appendFileSync(file, `${new Date().toISOString()} ${muc} ${format(...a)}\n`);
    } catch { /* bỏ qua */ }
  };
  console.log = ghi('LOG');
  console.info = ghi('INFO');
  console.warn = ghi('WARN');
  console.error = ghi('ERROR');
  console.debug = ghi('DEBUG');
  return file;
}
