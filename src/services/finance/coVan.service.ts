/**
 * CỐ VẤN TIỀN NONG — AI đọc số liệu THẬT của người dùng rồi khuyên.
 * ─────────────────────────────────────────────────────────────────────
 * Hai đường vào:
 *
 *  · `tomTatCoVan()` — không cần câu hỏi. Thẻ "AI quản lí" ở đầu màn Tiền nong.
 *  · `hoiCoVan(cauHoi)` — người dùng hỏi thẳng ("nên trả khoản nào trước?",
 *    "mỗi tháng trả thêm 2 triệu thì bao lâu hết nợ?").
 *
 * ⚠️ MỌI CON SỐ DO MÃ TÍNH, KHÔNG ĐỂ MODEL TỰ CỘNG. Nâng cấp 28/09/2026:
 *   1. Bảng số lấy từ `phanTichTaiChinh()` — đủ nợ (gốc/lãi còn lại từng
 *      khoản, lãi suất THỰC, lịch theo tháng, quá hạn, tất toán hôm nay tiết
 *      kiệm bao nhiêu, chiến lược trả), dòng tiền 6 tháng, chi theo nhóm so
 *      cùng kỳ, tỷ lệ nợ/thu nhập, quỹ khẩn cấp, đầu tư. Trước đây model chỉ
 *      thấy vài tổng và 12 kỳ sắp tới ⇒ không trả lời nổi "tổng lãi bao nhiêu".
 *   2. Mọi số đã VIẾT SẴN kiểu Việt ("4.707.347₫", "3,02%/tháng") để model
 *      chép, không phải tự định dạng (định dạng lại = cơ hội làm tròn sai).
 *   3. Số tiền trong câu hỏi ("trả thêm 2 triệu") được MÃ tính thành kịch
 *      bản trước khi hỏi model.
 *   4. Câu trả lời đi qua `kiemSo()` — số nào không có trong bảng thì bắt
 *      model viết lại một lần; vẫn sai thì gắn cảnh báo, không giấu.
 *
 * ⚠️ Thiếu khoá AI thì vẫn TRẢ SỐ LIỆU — phần đắt giá nhất là mấy con số.
 */
import { Prisma } from '@prisma/client';
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { round2, type Dec } from './money.js';
import { phanTichTaiChinh, type GoiPhanTich } from './phanTich.service.js';
import { soSanhChienLuoc, xepHangTraMotLan } from './phanTichNo.js';
import { kiemSo, tienTrongCauHoi, thayPhepTinh } from './kiemSoAI.js';
import { layMucTieu } from './nhacNhiem.service.js';

// ─── Định dạng kiểu Việt ─────────────────────────────────────────────────

const d0 = (v: Dec) => round2(v).toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP).toNumber();
const tien = (v: Dec | null | undefined, te = 'VND') =>
  v == null ? null : te === 'USD' ? `$${round2(v).toNumber().toLocaleString('vi-VN', { maximumFractionDigits: 2 })}` : `${d0(v).toLocaleString('vi-VN')}₫`;
const phanTram = (v: number | Dec | null | undefined, sauPhay = 2) =>
  v == null ? null : `${Number(v).toLocaleString('vi-VN', { maximumFractionDigits: sauPhay })}%`;
const ngay = (s: string | null | undefined) => (s ? s.slice(0, 10).split('-').reverse().join('/') : null);
const thangVN = (s: string | null | undefined) => (s ? `${s.slice(5, 7)}/${s.slice(0, 4)}` : null);

export const TEN_KIEU_LAI: Record<string, string> = {
  FLAT_MONTHLY: 'lãi phẳng (tính trên gốc ban đầu)',
  REDUCING_BALANCE: 'trả góp đều, lãi trên dư nợ giảm dần',
  EQUAL_PRINCIPAL: 'gốc đều, lãi trên dư nợ giảm dần',
  INTEREST_ONLY: 'trả lãi hằng tháng, gốc cuối kỳ',
  DAILY_PERCENT: 'lãi theo ngày',
  NO_INTEREST: 'không lãi',
};

type SoSanh = NonNullable<ReturnType<typeof soSanhChienLuoc>>;

function chienLuocGon(ss: SoSanh) {
  const g = (k: SoSanh['avalanche'] | SoSanh['theoLich'], coTK: boolean) => ({
    thuTuUuTien: k.thuTu.map((t) => t.ten),
    soThangTra: k.soThang,
    thangHetNo: thangVN(k.thangHetNo),
    tongLaiPhaiTra: tien(k.tongLai),
    tongPhiTraTruoc: k.tongPhi.isZero() ? undefined : tien(k.tongPhi),
    ...(coTK ? { tietKiemSoVoiTraTheoLich: tien((k as SoSanh['avalanche']).tietKiemSoVoiLich), hetNoSomHon: `${(k as SoSanh['avalanche']).somHonThang} tháng` } : {}),
    thangTatToanTungKhoan: k.tungKhoan.map((t) => `${t.ten}: ${thangVN(t.thangTatToan) ?? 'chưa hết trong mô phỏng'}`),
  });
  return {
    traThemMoiThang: tien(ss.traThemMoiThang),
    neuChiTraTheoLich: g(ss.theoLich, false),
    toiUu_reNhat: g(ss.toiUu, true),
    avalanche_laiThucCaoTruoc: g(ss.avalanche, true),
    snowball_duNoNhoTruoc: g(ss.snowball, true),
    giaDinh: ss.giaDinh,
  };
}

/**
 * Bảng số liệu gửi model — CHỈ chứa số đã tính và đã định dạng.
 * `kichBan`: kịch bản riêng theo câu hỏi (trả thêm X mỗi tháng / một lần).
 */
export function bangChoModel(g: GoiPhanTich, kichBan?: { soTien: number; moiThang: boolean } | null) {
  const n = g.no;
  // Trả thêm mặc định = dòng tiền ròng bình quân (nếu dương) — số người dùng
  // THẬT SỰ còn dư mỗi tháng, không phải một con số bịa.
  const rongBQ = g.chiSo.thuBinhQuan3Thang && g.chiSo.chiBinhQuan3Thang && g.chiSo.traNoBinhQuan3Thang
    ? g.chiSo.thuBinhQuan3Thang.minus(g.chiSo.chiBinhQuan3Thang).minus(g.chiSo.traNoBinhQuan3Thang)
    : null;
  const themMacDinh = rongBQ && rongBQ.greaterThan(100_000) ? rongBQ.dividedBy(100_000).floor().times(100_000) : null;

  const chienLuoc: Record<string, unknown> = {};
  if (g._moPhong.length > 0) {
    if (themMacDinh) chienLuoc.neuTraThemBangSoDuBinhQuan = chienLuocGon(soSanhChienLuoc(g._moPhong, g.thang, themMacDinh)!);
    if (kichBan?.moiThang) chienLuoc.theoCauHoi_traThemMoiThang = chienLuocGon(soSanhChienLuoc(g._moPhong, g.thang, kichBan.soTien)!);
    if (kichBan && !kichBan.moiThang) {
      chienLuoc.theoCauHoi_traThemMotLan = {
        soTien: tien(new Prisma.Decimal(kichBan.soTien)),
        xepHangNenDonVaoKhoan: xepHangTraMotLan(g._moPhong, g.thang, kichBan.soTien).map((x) => ({
          khoan: x.ten, dungDuoc: tien(x.tienDungDuoc), tietKiemLaiVaPhi: tien(x.tietKiem),
          dongLuonKhoan: x.dongKhoanLuon, thangTatToanMoi: thangVN(x.thangTatToanMoi), thangTatToanCu: thangVN(x.thangTatToanCu),
        })),
        giaDinh: 'Tiền trả một lần dồn vào đúng khoản đó ngay tháng này; các tháng sau vẫn trả đúng số tiền kỳ như lịch.',
      };
    }
  }

  return {
    homNay: ngay(g.homNay),
    tyGia: g.tyGia ? `1$ = ${tien(new Prisma.Decimal(g.tyGia.vndPerUsd))}` : null,
    luuY: g.coUsdChuaQuyDoi ? 'Có khoản bằng $ nhưng CHƯA đặt tỷ giá — các tổng chưa gồm phần $.' : undefined,
    no: {
      tong: {
        soKhoanDangNo: n.tong.soKhoanDangNo,
        gocConLai: tien(n.tong.gocConLai),
        laiConPhaiTra: tien(n.tong.laiConPhaiTra),
        tongConPhaiTra_gocCongLai: tien(n.tong.tongConPhaiTra),
        laiDaTraTuTruocToiNay: tien(n.tong.laiDaTra),
        tongLaiCaCacKhoanDangNo: tien(n.tong.tongLaiCaKhoan),
        ngayHetNoTheoLich: ngay(n.tong.ngayHetNo),
      },
      thangNay: {
        tongPhaiTraTheoLich: tien(n.thangNay.tongNghiaVu),
        daTra: tien(n.thangNay.daTra),
        conPhaiTra: tien(n.thangNay.conPhaiTra),
        trongDoLai: tien(n.thangNay.laiTrongDo),
        noQuaHanTuThangTruoc: n.thangNay.quaHanThangTruoc.soKy ? { soKy: n.thangNay.quaHanThangTruoc.soKy, tong: tien(n.thangNay.quaHanThangTruoc.tong) } : undefined,
      },
      lichTraTheoThang: n.lichTheoThang.slice(0, 12).map((t) => ({ thang: thangVN(t.thang), goc: tien(t.goc), lai: tien(t.lai), tong: tien(t.tong), soKy: t.soKy })),
      quaHan: n.quaHan.map((q) => ({ khoan: q.ten, ky: q.ky, denHan: ngay(q.ngay), soTien: tien(q.soTien, q.tienTe), soNgayQuaHan: q.soNgayQuaHan })),
      sapDenHan7Ngay: n.sapDenHan.map((s) => ({ khoan: s.ten, ky: s.ky, denHan: ngay(s.ngay), soTien: tien(s.soTien, s.tienTe), conNgay: s.conNgay })),
      cacKhoan: n.cacKhoan.filter((k) => !k.daTatToan).map((k) => ({
        ten: k.ten,
        tienTe: k.tienTe,
        kieuLai: TEN_KIEU_LAI[k.kieuLai] ?? k.kieuLai,
        laiSuatDanhNghia: k.kieuLai === 'NO_INTEREST' ? '0%' : `${phanTram(k.laiSuat.danhNghiaThang, 4)}/tháng (${phanTram(k.laiSuat.danhNghiaNam, 2)}/năm)`,
        laiSuatThuc: k.laiSuat.thucThang ? `${phanTram(k.laiSuat.thucThang, 2)}/tháng (${phanTram(k.laiSuat.thucNam, 2)}/năm)` : null,
        gocBanDau: tien(k.gocBanDau, k.tienTe),
        gocConLai: tien(k.gocConLai, k.tienTe),
        laiDaTra: tien(k.laiDaTra, k.tienTe),
        laiConPhaiTra: tien(k.laiConPhaiTra, k.tienTe),
        tongConPhaiTra: tien(k.tongConPhaiTra, k.tienTe),
        tongLaiCaKhoan: tien(k.tongLaiCaKhoan, k.tienTe),
        soKyDaTra: `${k.soKyDaTra}/${k.soKy}`,
        soKyConLai: k.soKyConLai,
        kyToi: k.kyToi ? { ngay: ngay(k.kyToi.ngay), soTien: tien(k.kyToi.tong, k.tienTe), goc: tien(k.kyToi.goc, k.tienTe), lai: tien(k.kyToi.lai, k.tienTe) } : null,
        ngayTatToanTheoLich: ngay(k.ngayTatToanDuKien),
        laiMoiNgay: k.laiMoiNgay ? tien(k.laiMoiNgay, k.tienTe) : undefined,
        laiDonTuNgayVay: k.laiDonTuNgayVay ? tien(k.laiDonTuNgayVay, k.tienTe) : undefined,
        phiTraTruocHan: k.phiTraTruocPct == null ? 'chưa khai' : phanTram(k.phiTraTruocPct),
        daTraNhieuHonLich: k.chenhLechThucTra.greaterThan(0) ? tien(k.chenhLechThucTra, k.tienTe) : undefined,
      })),
      tatToanNgayHomNay: n.tatToanHomNay.map((t) => ({
        khoan: t.ten,
        tienDongKhoan_KHONG_gomKyQuaHan: tien(t.chiPhiTatToan, t.tienTe),
        kyQuaHanPhaiTraRieng: t.kyDenHanPhaiTra.isZero() ? undefined : tien(t.kyDenHanPhaiTra, t.tienTe),
        tongPhaiChiHomNay_gomCaKyQuaHan: t.kyDenHanPhaiTra.isZero() ? undefined : tien(t.kyDenHanPhaiTra.plus(t.chiPhiTatToan), t.tienTe),
        tietKiemSoVoiTraTheoLich: tien(t.tietKiem, t.tienTe),
        chuaKhaiPhiTraTruoc: t.chuaKhaiPhi || undefined, boQuaSoKy: t.soKyBoQua,
      })),
      chienLuoc,
      khongMoPhongDuoc: n.loaiKhoiMoPhong.length ? n.loaiKhoiMoPhong : undefined,
    },
    dongTien6Thang: g.dongTien.xuHuong.map((x) => ({ thang: thangVN(x.thang), thu: tien(x.thu), chi: tien(x.chi), traNo: tien(x.traNo), rong_thuTruChiTruTraNo: tien(x.rong) })),
    chiTieuThangNay: {
      daChi: tien(g.chiTieu.thangNay),
      denNgay: g.chiTieu.ngayTrongThang,
      cungKyThangTruoc: tien(g.chiTieu.cungKyThangTruoc),
      soVoiCungKy: phanTram(g.chiTieu.soVoiCungKyPct, 1),
      caThangTruoc: tien(g.chiTieu.thangTruoc),
      duBaoCaThangTheoNhipChi: tien(g.chiTieu.duBaoCuoiThang),
      theoNhom: g.chiTieu.nhom.slice(0, 10).map((x) => ({
        nhom: x.ten, thangNay: tien(x.thangNay), thangTruoc: tien(x.thangTruoc), soVoiCungKy: phanTram(x.chenhCungKyPct, 1),
        nganSach: tien(x.nganSach), daDungNganSach: phanTram(x.tiLeNganSach, 1), tiTrong: phanTram(x.tiTrong, 1),
      })),
    },
    chiSo: {
      thuBinhQuanThang: tien(g.chiSo.thuBinhQuan3Thang),
      chiBinhQuanThang: tien(g.chiSo.chiBinhQuan3Thang),
      traNoBinhQuanThang: tien(g.chiSo.traNoBinhQuan3Thang),
      soThangLamBinhQuan: g.chiSo.soThangLamBinhQuan,
      soDuBinhQuanMoiThang: tien(rongBQ),
      tyLeTraNoTrenThuNhap: phanTram(g.chiSo.tyLeNoTrenThu, 1),
      tyLeTietKiemThangTruoc: phanTram(g.chiSo.tyLeTietKiemThangTruoc, 1),
    },
    quyKhanCap: {
      tienTrongCacVi: tien(g.quyKhanCap.tienMat),
      soTietKiemCoKyHan: tien(g.quyKhanCap.tietKiemGui),
      chiCanMoiThang: tien(g.quyKhanCap.chiMoiThang),
      duSoThang: g.quyKhanCap.soThang,
      duSoThangKeCaSoTietKiem: g.quyKhanCap.soThangKeCaTietKiem,
      coSo: g.quyKhanCap.coSo,
    },
    dauTu: {
      vonDangGiu: tien(g.dauTu.tong.vonDangGiu),
      giaTriHienTai: tien(g.dauTu.tong.giaTriDangGiu),
      laiLoTamTinh: tien(g.dauTu.tong.laiLoTamTinh),
      tySuat: phanTram(g.dauTu.tong.tySuatTamTinh, 1),
      laiLoDaChot: tien(g.dauTu.tong.laiLoDaChot),
      dauTuBanThan: tien(g.dauTu.tong.dauTuBanThan),
      cacKhoan: g.dauTu.cacKhoan.slice(0, 12).map((i) => ({ ten: i.ten, loai: i.loai === 'SELF' ? 'bản thân' : 'tài sản', von: tien(i.von), giaTri: tien(i.giaTri), laiLo: tien(i.laiLo), tySuat: phanTram(i.tySuat, 1), daBan: i.daChot || undefined, chuaCapNhatGia: i.chuaCapNhatGia || undefined })),
    },
    soTietKiem: g.soTietKiem.map((s) => ({ nganHang: s.nganHang, soTien: tien(s.soTien, s.tienTe), laiSuatNam: phanTram(s.laiSuatNam), daoHan: ngay(s.ngayDaoHan), laiKhiDaoHan: tien(s.laiKhiDaoHan, s.tienTe) })),
    thuTheoNguon3Thang: g.thuTheoNguon.map((x) => ({ nguon: x.ten, tong: tien(x.tong) })),
    canhBao: g.canhBao.map((c) => `[${c.muc === 'nguy' ? 'NGUY' : c.muc === 'canh' ? 'CẢNH BÁO' : 'LƯU Ý'}] ${c.tieuDe}${c.chiTiet ? ` — ${c.chiTiet}` : ''}`),
    thieuDuLieu: g.thieuDuLieu.length ? g.thieuDuLieu : undefined,
  };
}

/** `so` gọn kiểu cũ — app iOS đang giải mã đúng hình dạng này. */
function soGon(g: GoiPhanTich) {
  const giaTriRong = g.quyKhanCap.tienMat.plus(g.quyKhanCap.tietKiemGui).plus(g.dauTu.tong.giaTriDangGiu).minus(g.no.tong.gocConLai);
  return {
    thang: g.thang,
    homNay: g.homNay,
    tongSoDu: Number(g.quyKhanCap.tienMat),
    giaTriRong: Number(round2(giaTriRong)),
    tongNoConLai: Number(g.no.tong.gocConLai),
    tongLaiConPhaiTra: Number(g.no.tong.laiConPhaiTra),
    thuThangNay: Number(g.dongTien.thangNay.thu),
    chiThangNay: Number(g.dongTien.thangNay.chi),
    traNoThangNay: Number(g.dongTien.thangNay.traNo),
    // = thu − chi − trả nợ (trước 28/09/2026 là thu − chi, quên trả nợ).
    deDanhThangNay: Number(g.dongTien.thangNay.rong),
    tiLeChiTrenThu: g.chiSo.tyLeChiTrenThuThangNay,
  };
}

export const GOI_Y_CAU_HOI = [
  'Tổng nợ và tổng tiền lãi tôi còn phải trả là bao nhiêu?',
  'Tháng này tôi phải trả nợ bao nhiêu, trong đó bao nhiêu là lãi?',
  'Nên ưu tiên trả khoản nợ nào trước?',
  'Tất toán sớm khoản nào thì tiết kiệm nhiều nhất?',
  'Nếu mỗi tháng trả thêm 2 triệu thì bao lâu hết nợ?',
  'Tháng này tôi tiêu quá tay chỗ nào?',
  'Dòng tiền của tôi đang dương hay âm?',
  'Quỹ khẩn cấp của tôi đủ mấy tháng?',
  'Đầu tư của tôi đang lãi hay lỗ?',
];

const LUAT = [
  'Bạn là cố vấn tài chính cá nhân, nói TIẾNG VIỆT, thẳng, cụ thể, dựa HOÀN TOÀN vào bảng số liệu đã tính sẵn của CHÍNH người dùng.',
  'LUẬT SỐ (bắt buộc): mọi con số bạn viết phải CHÉP NGUYÊN từ bảng (giữ cách viết "1.234.567₫", "3,02%"). TUYỆT ĐỐI không tự cộng, trừ, nhân, chia, không ước lượng, không đổi đơn vị. Cần một con số mà bảng không có thì nói thẳng "ứng dụng chưa tính con số này" — không suy ra.',
  'CẦN CỘNG/TRỪ/NHÂN/CHIA các số trong bảng (vd. tổng hai khoản người dùng hỏi) thì KHÔNG tự tính: viết đúng mẫu [[tinh: 19.674.433₫ + 28.315.400₫]] với số chép từ bảng — hệ thống sẽ thay bằng kết quả chính xác. Mỗi phép tính một cặp [[ ]], đặt ĐÚNG MỘT LẦN ngay chỗ cần con số (không viết "= kết quả" phía sau).',
  'Được làm tròn gọn KIỂU "4,7 triệu" chỉ khi đã chép số đầy đủ ở ngay trước đó.',
  'Ngày viết dd/mm/yyyy, tháng viết mm/yyyy — đúng như trong bảng.',
  'Dùng **đậm** cho tên khoản nợ và số tiền quan trọng. Không dùng bảng markdown.',
  'Ưu tiên: nợ QUÁ HẠN → tới hạn trong 7 ngày → trả nợ chiếm quá nhiều thu nhập / dòng tiền âm → vượt ngân sách, chi tăng → chiến lược trả nợ → quỹ khẩn cấp → đầu tư.',
  'Khi khuyên trả nợ trước: dựa vào "laiSuatThuc" và kết quả mô phỏng trong "chienLuoc"/"tatToanNgayHomNay". Giải thích lãi phẳng: lãi tính trên gốc BAN ĐẦU nên trả bớt gốc không giảm lãi cho tới khi đóng HẲN khoản. Nếu phí trả trước "chưa khai" thì nhắc người dùng khai để con số tiết kiệm chính xác.',
  'Không khen xã giao, không mở bài, không chúc. Không khuyên chung chung kiểu "hãy tiết kiệm hơn" — mọi lời khuyên phải gắn với một khoản/nhóm/con số cụ thể trong bảng.',
  'Không khuyên mua/bán mã chứng khoán, coin cụ thể.',
].join('\n');

async function goiModel(userId: number, system: string, noiDung: string, maxTokens: number, nguonSo: string[]) {
  const lan1 = await llmComplete({
    step: 'generation', purpose: 'finance_advisor', feature: 'chat', userId, maxTokens, system,
    messages: [{ role: 'user', content: noiDung }],
  });
  // Thay [[tinh: …]] bằng kết quả MÃ tính; kết quả đó thành số hợp lệ để kiểm.
  const xuLy = (t: string) => {
    const r = thayPhepTinh(t, ...nguonSo);
    // Model đôi khi viết "[[tinh: a+b]] = **[[tinh: a+b]]**" ⇒ "X = **X**": gộp lại.
    r.chu = r.chu.replace(/([\d.]+₫?) = \*\*\1\*\*/g, '**$1**');
    return { chu: r.chu, kiem: kiemSo(r.chu, ...nguonSo, r.ketQua.join(' ')) };
  };
  const dau = lan1?.text?.trim();
  if (!dau) return { chu: null, kiem: null };
  let { chu, kiem } = xuLy(dau);
  if (!kiem.hopLe) {
    const lan2 = await llmComplete({
      step: 'generation', purpose: 'finance_advisor', feature: 'chat', userId, maxTokens, system,
      messages: [
        { role: 'user', content: noiDung },
        { role: 'assistant', content: dau },
        { role: 'user', content: `Các con số sau KHÔNG có trong bảng số liệu: ${kiem.soKhongKhop.join(', ')}. Viết lại câu trả lời, chỉ dùng số chép nguyên từ bảng; con số nào bảng không có thì bỏ đi hoặc nói "ứng dụng chưa tính".` },
      ],
    }).catch(() => null);
    const t2 = lan2?.text?.trim();
    if (t2) {
      const r2 = xuLy(t2);
      if (r2.kiem.soKhongKhop.length <= kiem.soKhongKhop.length) { chu = r2.chu; kiem = r2.kiem; }
    }
  }
  if (!kiem.hopLe) {
    chu += `\n\n⚠️ _Các số sau không khớp bảng số liệu ứng dụng đã tính, đừng dựa vào chúng: ${kiem.soKhongKhop.join(', ')}._`;
  }
  return { chu, kiem };
}

/** Tóm tắt không cần câu hỏi — cho thẻ "AI quản lí". */
export async function tomTatCoVan(userId: number) {
  const g = await phanTichTaiChinh(userId);
  const so = soGon(g);
  const bang = JSON.stringify(bangChoModel(g));
  if (!isAiAvailable('chat')) return { nhanXet: null, so, canhBao: g.canhBao, goiY: GOI_Y_CAU_HOI, lyDo: 'ai_unavailable' };
  const kq = await goiModel(
    userId,
    `${LUAT}\nViết TỐI ĐA 5 gạch đầu dòng (mỗi dòng bắt đầu bằng "- "), mỗi dòng dưới 35 từ, việc gấp nhất lên đầu. Nếu mọi thứ đang ổn thì nói đúng một dòng là ổn và vì sao.`,
    `Bảng số liệu tiền nong của tôi (đã tính sẵn):\n${bang}`,
    600,
    [bang],
  );
  return { nhanXet: kq.chu, so, canhBao: g.canhBao, goiY: GOI_Y_CAU_HOI, kiemSo: kq.kiem };
}

/** Người dùng hỏi thẳng một câu. */
export async function hoiCoVan(userId: number, cauHoi: string) {
  const g = await phanTichTaiChinh(userId);
  const so = soGon(g);
  const kichBan = tienTrongCauHoi(cauHoi);
  const mt = await layMucTieu(userId).catch(() => null);
  const bangObj = { ...bangChoModel(g, kichBan), mucTieuChiTieu: mt?.mucTieu.map((m) => ({ ky: m.ky, mucTieu: `${Math.round(m.mucTieu).toLocaleString('vi-VN')}₫`, daTieu: `${Math.round(m.daTieu).toLocaleString('vi-VN')}₫`, conLai: `${Math.round(m.conLai).toLocaleString('vi-VN')}₫`, tiLe: `${m.tiLe}%` })) };
  const bang = JSON.stringify(bangObj);
  if (!isAiAvailable('chat')) return { traLoi: null, so, goiY: GOI_Y_CAU_HOI, lyDo: 'ai_unavailable' };
  const kq = await goiModel(
    userId,
    `${LUAT}\nTrả lời ĐÚNG câu được hỏi, tối đa ~10 câu hoặc gạch đầu dòng, kết bằng MỘT việc nên làm ngay.\n`
      + 'Nếu bảng số liệu KHÔNG đủ để trả lời thì nói thẳng là chưa có dữ liệu và người dùng cần nhập gì thêm, đừng đoán.',
    `Bảng số liệu tiền nong của tôi (đã tính sẵn):\n${bang}\n\nCâu hỏi: ${cauHoi}`,
    1000,
    [bang, cauHoi],
  );
  return { traLoi: kq.chu, so, goiY: GOI_Y_CAU_HOI, kiemSo: kq.kiem };
}

/** Bảng số gửi model — lộ ra cho admin/kiểm thử xem model thấy gì. */
export async function xemBangCoVan(userId: number, cauHoi?: string) {
  const g = await phanTichTaiChinh(userId);
  return bangChoModel(g, cauHoi ? tienTrongCauHoi(cauHoi) : null);
}
