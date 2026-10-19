/**
 * ============================================================
 * `/usage` CỦA CUONGMINI — MỘT ROUTE, MỌI CON SỐ TỪ SỔ (đợt 8A, 19/10/2026)
 * ============================================================
 *
 * Chủ app: "/usage hiện số không chính xác" — bản cũ chỉ vẽ bể TOKEN 5 giờ (`quota.ts`), trong khi thứ THẬT SỰ chặn
 * người dùng từ 18–19/10 là trần $ theo model (`tranModel.ts`), ví 5 giờ (`viTien.ts`), trần nhóm (`hanMucNhom.ts`),
 * chống spam Default (`defaultGioiHan.ts`) và mã gia hạn (`maGiaHanTien.ts`). Hàm này gom ĐÚNG các hàm mà lượt agent
 * dùng để chặn (không tự tính lại) ⇒ số trên `/usage` = số chặn thật. App (CLI · desktop · VS Code) chỉ vẽ.
 *
 * ADMIN web thấy thêm khối `admin` y như trang admin (`thongKe.ts › dsKeyAdmin` — cùng hàm): mỗi khoá Anthropic (TÊN,
 * ngân sách, đã dùng, còn %) — KHÔNG trả khoá hay đuôi khoá; chi hôm nay/tháng theo model CuongMini; modelapi $; rambo lượt.
 *
 * Tên model: CHỈ tên CuongMini (không tên thật, không tên cổng thật) — kể cả với admin (lệnh in ra terminal).
 */
import { prisma } from '../../config/database.js';
import { anTenThat, bangClassic, bangModel, laDefault, MUC_DEFAULT, timModel, type MucModel } from './bangModel.js';
import { dauNgayVn, dauThangVn, xemHanMucChinhHang } from './anthropicChinhHang/hanMuc.js';
import { xemTranModel } from './tranModel.js';
import { xemViTien } from './viTien.js';
import { demHomNay, demPhutDefault, docGioiHanDefault } from './defaultGioiHan.js';
import { quyetDinhNhom } from './hanMucNhom.js';
import { demTaiTro, quyetDinhTaiTro, TIEN_TO_TAI_TRO } from './taiTroAdmin.js';
import { MODEL_AGENT_RIENG } from './models.js';

const r4 = (x: unknown): number => Math.round(Number(x ?? 0) * 10_000) / 10_000;

export interface UsageModel {
  id: string;
  ten: string;
  /** Default: model đang chạy thật lúc này (tên CuongMini). */
  dangChay?: string;
  /** `tra_tron` = rambo (gói trọn, không trần $ — đếm lượt); `theo_tien` = trần USD. */
  loai: 'tra_tron' | 'theo_tien';
  khongGioiHan: boolean;
  daDungNgay: number;
  tranNgay: number | null;
  daDungThang: number;
  tranThang: number | null;
  giaHanNgay?: number;
  giaHanThang?: number;
  /** `tra_tron`: số bước (lời gọi) hôm nay trên model này. */
  buocHomNay?: number;
}

export interface UsageNhom {
  projectId: number;
  key: string | null;
  /** `taiTro` = admin web trả, không trần $ · `nhom` = hạn mức trưởng nhóm (đợt 6) · `rieng` = dùng Pro/key của chính bạn · `khong` = không áp dụng. */
  loai: 'taiTro' | 'nhom' | 'rieng' | 'khong';
  nhaTaiTro?: string;
  khongGioiHan: boolean;
  daDungNgay?: number;
  tranNgay?: number | null;
  daDungThang?: number;
  tranThangNhom?: number | null;
  daDungThangNhom?: number;
  lyDo?: string;
}

export interface UsageAdmin {
  keys: Array<{ ten: string; trangThai: string; nganSachUsd: number; daDungUsd: number; conPhanTram: number | null; boQua: string | null; lamMoiLuc: string }>;
  theoModel: Array<{ ten: string; homNayUsd: number; thangUsd: number; buocHomNay: number }>;
  modelapi: { homNayUsd: number; thangUsd: number };
  chinhHang: { homNayUsd: number; thangUsd: number };
  rambo: { buocHomNay: number; cauHoiHomNay: number };
}

export interface UsageCuongMini {
  phienBan: 2;
  laAdmin: boolean;
  goi: 'admin' | 'pro' | 'key_terminal' | 'nhom' | 'free';
  model: UsageModel;
  chinhHang?: { hang: 'free' | 'cao'; khongGioiHan: boolean; daDungNgay: number; tranNgay: number | null; daDungThang: number; tranThang: number | null };
  vi: { daDung: number; tran: number; phanTram: number; soGio: number; hoiLucNao: string | null; khongGioiHan: boolean; giaHan: number } | null;
  nhom?: UsageNhom;
  default: { phut: number; tranPhut: number; ngay: number; tranNgay: number | null; free: boolean };
  taiTro?: { phut: number; tranPhut: number; ngay: number; tranNgay: number };
  giaHan: { soLanKy: number; usdKy: number; dangCho: number };
  admin?: UsageAdmin;
}

/** Tên CuongMini cho một tên model thật trong sổ (mọi cổng, kể cả mã rambo cũ). */
function tenCuongMini(model: string): string {
  const t = anTenThat(model);
  return t === model ? 'CuongMini (khác)' : t;
}

const modelRambo = (): Set<string> => new Set([...bangClassic().map((m) => m.model), ...MODEL_AGENT_RIENG.map((m) => m.model)]);
const modelModelapi = (): Set<string> => new Set(bangModel().filter((m) => m.cong === 'modelapi').map((m) => m.model));
const modelChinhHang = (): Set<string> => new Set(bangModel().filter((m) => m.cong === 'anthropic').map((m) => m.model));

export async function xemUsageAdmin(luc = new Date()): Promise<UsageAdmin> {
  const { dsKeyAdmin } = await import('./anthropicChinhHang/thongKe.js');
  const [keys, homNay, thang] = await Promise.all([
    dsKeyAdmin(luc).catch(() => []),
    prisma.interviewLLMCallLog.groupBy({ by: ['model'], where: { feature: 'agent', createdAt: { gte: dauNgayVn(luc) } }, _sum: { costUsd: true }, _count: { _all: true } }),
    prisma.interviewLLMCallLog.groupBy({ by: ['model'], where: { feature: 'agent', createdAt: { gte: dauThangVn(luc) } }, _sum: { costUsd: true } }),
  ]);
  const gop = new Map<string, { homNayUsd: number; thangUsd: number; buocHomNay: number }>();
  const lay = (ten: string) => gop.get(ten) ?? { homNayUsd: 0, thangUsd: 0, buocHomNay: 0 };
  for (const r of thang) { const t = tenCuongMini(r.model); const g = lay(t); g.thangUsd += Number(r._sum.costUsd ?? 0); gop.set(t, g); }
  for (const r of homNay) { const t = tenCuongMini(r.model); const g = lay(t); g.homNayUsd += Number(r._sum.costUsd ?? 0); g.buocHomNay += r._count._all; gop.set(t, g); }
  const tong = (rows: Array<{ model: string; _sum: { costUsd: unknown } }>, tap: Set<string>) => r4(rows.filter((r) => tap.has(r.model)).reduce((a, r) => a + Number(r._sum.costUsd ?? 0), 0));
  const rb = modelRambo();
  const cauHoiHomNay = await prisma.interviewLLMCallLog.count({
    where: { feature: 'agent', model: { in: [...rb] }, createdAt: { gte: dauNgayVn(luc) }, OR: [{ step: 'default:luot' }, { step: { endsWith: ':l' } }] },
  }).catch(() => 0);
  return {
    /* Tên mặc định của khoá là "Key …<4 ký tự cuối>" — terminal không in đuôi khoá (QA 9.2) ⇒ "Key #n". */
    keys: keys.map((k, i) => ({
      ten: /^Key …/.test(k.nhan) ? `Key #${i + 1}` : k.nhan, trangThai: k.trangThai, nganSachUsd: k.nganSachThangUsd, daDungUsd: k.daDungUsd,
      conPhanTram: k.nganSachThangUsd > 0 ? Math.max(0, Math.round(((k.nganSachThangUsd - k.daDungUsd) / k.nganSachThangUsd) * 1000) / 10) : null,
      boQua: k.boQua, lamMoiLuc: k.chuKy.lamMoiLuc,
    })),
    theoModel: [...gop.entries()].map(([ten, g]) => ({ ten, homNayUsd: r4(g.homNayUsd), thangUsd: r4(g.thangUsd), buocHomNay: g.buocHomNay }))
      .sort((a, b) => b.thangUsd - a.thangUsd || b.buocHomNay - a.buocHomNay),
    modelapi: { homNayUsd: tong(homNay, modelModelapi()), thangUsd: tong(thang, modelModelapi()) },
    chinhHang: { homNayUsd: tong(homNay, modelChinhHang()), thangUsd: tong(thang, modelChinhHang()) },
    rambo: { buocHomNay: homNay.filter((r) => rb.has(r.model)).reduce((a, r) => a + r._count._all, 0), cauHoiHomNay },
  };
}

/** Số bước (lời gọi) hôm nay của người này trên một model (rambo — gói trọn ⇒ không có $). */
async function buocHomNay(userId: number, model: string, luc: Date): Promise<number> {
  return prisma.interviewLLMCallLog.count({ where: { userId, feature: 'agent', model, createdAt: { gte: dauNgayVn(luc) } } }).catch(() => 0);
}

/**
 * Hạn mức của MỘT người cho MỘT lựa chọn model (+ dự án đang gắn nếu có). `model` = mã app gửi (cm-*, bí danh, trống ⇒
 * Default). `projectId` = dự án CT Work của phiên (app lấy từ `.cuongmini/ctwork.json`).
 */
export async function xemUsageCuongMini(userId: number, o: { model?: unknown; projectId?: number | null; luc?: Date } = {}): Promise<UsageCuongMini> {
  const luc = o.luc ?? new Date();
  const { getProStatus } = await import('../pro.service.js');
  const { coKeyTerminalHieuLuc } = await import('./keyTerminal.js');
  const st = await getProStatus(userId);
  const laAdmin = st.isAdmin;
  const coKey = !st.effective && await coKeyTerminalHieuLuc(userId).catch(() => false);
  const muc: MucModel = timModel(o.model);
  const laDef = laDefault(o.model);

  // ── Dự án đang gắn: admin tài trợ ⇒ hạn mức nhóm ⇒ riêng ──
  let nhom: UsageNhom | undefined;
  let taiTroDem: UsageCuongMini['taiTro'];
  const pid = o.projectId ?? null;
  if (pid) {
    const tt = await quyetDinhTaiTro(userId, pid);
    if (tt.loai === 'taiTro' && tt.nhaTaiTro.id !== userId) {
      const tien = TIEN_TO_TAI_TRO + `p${pid}:`;
      const [ngay, thang] = await Promise.all([
        prisma.interviewLLMCallLog.aggregate({ where: { userId, feature: 'agent', step: { startsWith: tien }, createdAt: { gte: dauNgayVn(luc) } }, _sum: { costUsd: true } }),
        prisma.interviewLLMCallLog.aggregate({ where: { userId, feature: 'agent', step: { startsWith: tien }, createdAt: { gte: dauThangVn(luc) } }, _sum: { costUsd: true } }),
      ]);
      nhom = { projectId: pid, key: tt.key, loai: 'taiTro', nhaTaiTro: tt.nhaTaiTro.ten, khongGioiHan: true, daDungNgay: r4(ngay._sum.costUsd), daDungThang: r4(thang._sum.costUsd), tranNgay: null, tranThangNhom: null };
      taiTroDem = await demTaiTro(userId);
    } else if (st.effective || coKey) {
      nhom = { projectId: pid, key: null, loai: 'rieng', khongGioiHan: laAdmin };
    } else {
      const q = await quyetDinhNhom(userId, pid, { kiemTran: false, luc });
      nhom = q.loai === 'nhom'
        ? {
          projectId: pid, key: q.key, loai: 'nhom', nhaTaiTro: q.chu.ten, khongGioiHan: false,
          daDungNgay: q.daDungNgay, tranNgay: r4(q.tranNgayNguoiUsd + (q.giaHanNgay ?? 0)),
          daDungThangNhom: q.daDungThang, tranThangNhom: q.tranThangNhomUsd,
        }
        : { projectId: pid, key: null, loai: 'khong', khongGioiHan: false, lyDo: q.cau };
    }
  }
  const goi: UsageCuongMini['goi'] = laAdmin ? 'admin' : st.effective ? 'pro' : coKey ? 'key_terminal' : nhom?.loai === 'nhom' ? 'nhom' : 'free';

  // ── Model đang chọn ──
  let model: UsageModel;
  const ten = laDef ? MUC_DEFAULT.ten : muc.ten;
  const dangChay = laDef ? muc.ten : undefined;
  if (muc.cong === 'rambo') {
    model = { id: laDef ? MUC_DEFAULT.id : muc.id, ten, ...(dangChay ? { dangChay } : {}), loai: 'tra_tron', khongGioiHan: true, daDungNgay: 0, tranNgay: null, daDungThang: 0, tranThang: null, buocHomNay: await buocHomNay(userId, muc.model, luc) };
  } else if (nhom?.loai === 'taiTro') {
    model = { id: laDef ? MUC_DEFAULT.id : muc.id, ten, ...(dangChay ? { dangChay } : {}), loai: 'theo_tien', khongGioiHan: true, daDungNgay: nhom.daDungNgay ?? 0, tranNgay: null, daDungThang: nhom.daDungThang ?? 0, tranThang: null };
  } else {
    const h = await xemTranModel(userId, muc, luc);
    model = {
      id: laDef ? MUC_DEFAULT.id : muc.id, ten, ...(dangChay ? { dangChay } : {}), loai: 'theo_tien', khongGioiHan: h.khongGioiHan,
      daDungNgay: h.daDungNgay, tranNgay: h.tranNgay, daDungThang: h.daDungThang, tranThang: h.tranThang,
      ...(h.giaHanNgay ? { giaHanNgay: h.giaHanNgay } : {}), ...(h.giaHanThang ? { giaHanThang: h.giaHanThang } : {}),
    };
  }
  /* Cổng chính hãng còn trần NHÓM free/cao (`hanMuc.ts`) chồng lên trần model. */
  const chinhHang = muc.cong === 'anthropic' && nhom?.loai !== 'taiTro'
    ? await xemHanMucChinhHang(userId, muc.khoa === 'free' ? 'free' : 'cao', luc).then((h) => ({
      hang: h.hang, khongGioiHan: h.khongGioiHan, daDungNgay: r4(h.daDungNgay), tranNgay: h.tranNgay, daDungThang: r4(h.daDungThang), tranThang: h.tranThang,
    })).catch(() => undefined)
    : undefined;

  // ── Ví 5 giờ (mảng AI Code) — đúng hàm `turn.ts` dùng để chặn ──
  const v = await xemViTien(userId, 'code', { boQuaNho: true }).catch(() => null);
  const vi = v ? {
    daDung: r4(v.daTieu), tran: v.tran, phanTram: v.phanTram, soGio: v.soGio,
    hoiLucNao: v.hoiLucNao?.toISOString() ?? null, khongGioiHan: v.miemTran, giaHan: r4(v.giaHan ?? 0),
  } : null;

  // ── Chống spam Default ──
  const gh = await docGioiHanDefault();
  const laFree = goi === 'free';
  const def = {
    phut: demPhutDefault(userId), tranPhut: gh.phutNguoi,
    ngay: await demHomNay(userId).catch(() => 0), tranNgay: laFree && gh.ngayFree > 0 ? gh.ngayFree : null, free: laFree,
  };

  // ── Mã gia hạn trong kỳ (tháng giờ VN) ──
  const [daCap, cho] = await Promise.all([
    prisma.agentGiaHanTien.aggregate({ where: { userId, trangThai: 'DA_CAP', capLuc: { gte: dauThangVn(luc) } }, _sum: { soUsd: true }, _count: { _all: true } }).catch(() => null),
    prisma.agentGiaHanTien.count({ where: { userId, trangThai: 'CHO_DUYET' } }).catch(() => 0),
  ]);

  return {
    phienBan: 2,
    laAdmin,
    goi,
    model,
    ...(chinhHang ? { chinhHang } : {}),
    vi,
    ...(nhom ? { nhom } : {}),
    default: def,
    ...(taiTroDem ? { taiTro: taiTroDem } : {}),
    giaHan: { soLanKy: daCap?._count._all ?? 0, usdKy: r4(daCap?._sum.soUsd), dangCho: cho },
    ...(laAdmin ? { admin: await xemUsageAdmin(luc) } : {}),
  };
}
