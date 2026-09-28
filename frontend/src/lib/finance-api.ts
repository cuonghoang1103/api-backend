/**
 * MoneyFlow — API client.
 * Axios thunks over /api/v1/finance (all authed, per-user). Callers unwrap
 * `res.data.data`. Decimal money fields arrive as STRINGS (precision-safe) —
 * render them with `formatVnd` and parse with Number() only for math/charts.
 */
import { api } from './api';

// ─── Shared types ────────────────────────────────────────────
export type Money = string; // Decimal serialized as string

export interface Wallet {
  id: number; userId: number; name: string; type: string; icon: string | null; color: string | null;
  balance: Money; currency: string; isArchived: boolean; order: number; createdAt: string; updatedAt: string;
}
export interface ExpenseCategory {
  id: number; name: string; icon: string | null; color: string | null; order: number; monthlyBudget: Money | null;
}
export interface Expense {
  id: number; categoryId: number; walletId: number; amount: Money; date: string; description: string | null;
  receiptUrl: string | null; isRecurring: boolean; category?: Pick<ExpenseCategory, 'id' | 'name' | 'icon' | 'color'>;
}
export interface IncomeSource {
  id: number; name: string; type: string; payType: string; currency: string; baseSalary: Money | null; hourlyRate: Money | null;
  otMultiplierNormal: Money; otMultiplierHoliday: Money; isActive: boolean; note: string | null;
}
export interface WorkLog { id: number; sourceId: number; date: string; hoursNormal: Money; hoursOT: Money; hoursOTHoliday: Money; note: string | null; }
export interface IncomeEntry { id: number; sourceId: number | null; walletId: number; amount: Money; currency: string; date: string; type: string; note: string | null; }
export interface ScheduleItem {
  id: number; debtId: number; installmentNo: number; dueDate: string; amountDue: Money; principalPart: Money;
  interestPart: Money; isPaid: boolean; paidAt: string | null; paymentId: number | null;
}
export interface DebtPayment { id: number; debtId: number; walletId: number | null; amount: Money; date: string; note: string | null; }
export interface Debt {
  id: number; lenderName: string; lenderType: string; principal: Money; interestType: string; interestRate: Money;
  currency?: string; rateUnit?: string | null; prepayFeePct?: Money | null;
  startDate: string; termMonths: number | null; paymentDay: number | null; status: string; note: string | null;
  attachmentUrl: string | null; schedule?: ScheduleItem[]; payments?: DebtPayment[];
  computed?: {
    remaining: Money; paidPrincipal: Money; interestPaid: Money; projectedInterest: Money; progressPct: number;
    nextDueDate: string | null; nextDueAmount: Money | null; interestPerDay: Money | null;
  };
  phanTich?: PhanTichKhoan;
}

// ─── Phân tích (28/09/2026) — mọi số do máy chủ tính ─────────
export type TrangThaiKy = 'DA_TRA' | 'QUA_HAN' | 'HOM_NAY' | 'CHUA_DEN';
export interface DongLich {
  id?: number; ky: number; ngay: string; goc: Money; lai: Money; tong: Money; duNoTruoc: Money; duNoSau: Money;
  trangThai: TrangThaiKy; soNgayQuaHan: number;
}
export interface PhanTichKhoan {
  id: number; ten: string; loaiChoVay?: string; kieuLai: string; tienTe: string; trangThai: string; daTatToan: boolean;
  gocBanDau: Money; gocDaTra: Money; gocConLai: Money; laiDaTra: Money; laiConPhaiTra: Money; tongConPhaiTra: Money;
  tongLaiCaKhoan: Money; tongPhaiTraCaKhoan: Money; daTraThucTe: Money; chenhLechThucTra: Money;
  soKy: number; soKyDaTra: number; soKyConLai: number; kyToi: DongLich | null; ngayTatToanDuKien: string | null;
  quaHan: { soKy: number; soTien: Money; goc: Money; lai: Money; lauNhatNgay: number };
  sapDenHan: DongLich[];
  laiSuat: { danhNghiaThang: Money; danhNghiaNam: Money; thucThang: Money | null; thucNam: Money | null; donVi: string };
  laiMoiNgay: Money | null; laiDonTuNgayVay: Money | null; phiTraTruocPct: Money | null;
  lich?: DongLich[]; thieuDuLieu: string[];
}
export interface CanhBao { muc: 'nguy' | 'canh' | 'tin'; ma: string; tieuDe: string; chiTiet?: string; lienKet?: string }
export interface KyCanhBao { debtId: number; ten: string; tienTe: string; ky: number; ngay: string; soTien: Money; soTienVnd: Money; kyId?: number; soNgayQuaHan?: number; conNgay?: number }
export interface GoiPhanTich {
  homNay: string; thang: string; tyGia: { vndPerUsd: Money; capNhat: string } | null; coUsdChuaQuyDoi: boolean;
  no: {
    tong: { gocBanDau: Money; gocConLai: Money; laiConPhaiTra: Money; tongConPhaiTra: Money; laiDaTra: Money; tongLaiCaKhoan: Money; soKhoanDangNo: number; ngayHetNo: string | null };
    thangNay: { conPhaiTra: Money; laiTrongDo: Money; daTra: Money; tongNghiaVu: Money; quaHanThangTruoc: { soKy: number; tong: Money; goc: Money; lai: Money } };
    lichTheoThang: Array<{ thang: string; goc: Money; lai: Money; tong: Money; soKy: number; daTraTrongThang: Money }>;
    quaHan: KyCanhBao[]; sapDenHan: KyCanhBao[];
    tatToanHomNay: Array<{ debtId: number; ten: string; tienTe: string; chiPhiTatToan: Money; tietKiem: Money; kyDenHanPhaiTra: Money; chiPhiTatToanVnd: Money; tietKiemVnd: Money; chuaKhaiPhi: boolean; soKyBoQua: number }>;
    cacKhoan: PhanTichKhoan[]; moPhongDuoc: number; loaiKhoiMoPhong: string[]; khoanChuaKhaiPhi: string[];
  };
  dongTien: {
    thangNay: DongTienThang; thangTruoc: DongTienThang; xuHuong: DongTienThang[];
  };
  chiTieu: {
    thangNay: Money; thangTruoc: Money; cungKyThangTruoc: Money; soVoiCungKyPct: number | null; ngayTrongThang: number; soNgayThang: number;
    duBaoCuoiThang: Money | null;
    nhom: Array<{ nhomId: number; ten: string; icon: string | null; mau: string | null; thangNay: Money; thangTruoc: Money; cungKyThangTruoc: Money; chenh: Money; chenhCungKyPct: number | null; nganSach: Money | null; tiLeNganSach: number | null; tiTrong: number | null }>;
    mucTieu: Array<{ ky: string; soTien: Money }>;
  };
  chiSo: { thuBinhQuan3Thang: Money | null; chiBinhQuan3Thang: Money | null; traNoBinhQuan3Thang: Money | null; soThangLamBinhQuan: number; nghiaVuNoThangNay: Money; tyLeNoTrenThu: number | null; tyLeTietKiemThangTruoc: number | null; tyLeChiTrenThuThangNay: number | null };
  quyKhanCap: { tienMat: Money; tietKiemGui: Money; chiMoiThang: Money | null; soThang: number | null; soThangKeCaTietKiem: number | null; coSo: string };
  dauTu: {
    tong: { vonDangGiu: Money; giaTriDangGiu: Money; laiLoTamTinh: Money; tySuatTamTinh: number | null; laiLoDaChot: Money; dauTuBanThan: Money };
    cacKhoan: Array<{ id: number; ten: string; loai: string; trangThai: string; tienTe: string; ngay: string; von: Money; giaTri: Money | null; laiLo: Money | null; tySuat: number | null; daChot: boolean; chuaCapNhatGia: boolean }>;
  };
  soTietKiem: Array<{ id: number; nganHang: string; tienTe: string; soTien: Money; laiSuatNam: Money; kyHanThang: number; ngayDaoHan: string; conNgay: number; laiKhiDaoHan: Money }>;
  thuTheoNguon: Array<{ ten: string; loai: string; tong: Money }>;
  canhBao: CanhBao[];
  thieuDuLieu: string[];
}
export interface DongTienThang { thang: string; thu: Money; chi: Money; traNo: Money; rong: Money; coDuLieu: boolean }
export interface KetQuaMoPhong {
  chienLuoc: string; thuTu: Array<{ id: number; ten: string }>; soThang: number; thangHetNo: string | null;
  tongLai: Money; tongPhi: Money; tongTra: Money; tietKiemSoVoiLich?: Money; somHonThang?: number;
  tungKhoan: Array<{ id: number; ten: string; thangTatToan: string | null; lai: Money; phi: Money }>;
  theoThang: Array<{ thang: string; tra: Money; lai: Money; duNo: Money }>;
}
export interface ChienLuocTraNo {
  thang: string;
  soSanh: null | {
    traThemMoiThang: Money; theoLich: KetQuaMoPhong; avalanche: KetQuaMoPhong; snowball: KetQuaMoPhong; toiUu: KetQuaMoPhong;
    deXuat: string | null; avalancheHonSnowball: Money; giaDinh: string[];
  };
  traMotLan: null | { soTien: Money; xepHang: Array<{ id: number; ten: string; tienDungDuoc: Money; tietKiem: Money; dongKhoanLuon: boolean; thangTatToanMoi: string | null; thangTatToanCu: string | null }> };
  loaiKhoiMoPhong: string[]; khoanChuaKhaiPhi: string[]; thieuDuLieu: string[];
}
export interface KetQuaTatToan {
  debtId: number; tienTe: string; ngay: string; kyDenHanPhaiTra: { soKy: number; soTien: Money };
  gocTatToan: Money; laiDonKyDangChay: Money; soNgayDaQuaTrongKy: number; soNgayCuaKy: number; phiTraTruoc: Money; chuaKhaiPhi: boolean;
  chiPhiTatToan: Money; tongCanChi: Money; neuTraTheoLich: Money; laiTranhDuoc: Money; tietKiem: Money; soKyBoQua: number; giaDinh: string[];
}
export interface TraLoiCoVan {
  nhanXet?: string | null; traLoi?: string | null; lyDo?: string; goiY?: string[]; canhBao?: CanhBao[];
  kiemSo?: { hopLe: boolean; soKhongKhop: string[]; soDaKiem: number } | null;
}
export interface RecurringTxn {
  id: number; kind: string; amount: Money; categoryId: number | null; walletId: number; description: string;
  frequency: string; dayOfMonth: number | null; nextRunAt: string; isActive: boolean;
}
export interface DebtComputation {
  interestType: string;
  schedule: Array<{ installmentNo: number; dueDate: string; amountDue: Money; principalPart: Money; interestPart: Money }>;
  totalPrincipal: Money; totalInterest: Money; totalPayable: Money; interestPerDay?: Money;
}
export interface FxRate { id: number; userId: number; vndPerUsd: Money; note: string | null; createdAt: string; }
export interface DashboardData {
  month: string; totalBalance: Money; netWorth: Money; totalRemainingDebt: Money; incomeThisMonth: Money;
  expenseThisMonth: Money; savingsThisMonth: Money; debtPaidThisMonth?: Money; spendingVsIncomePct: number | null; wallets: Wallet[];
  fx: { rate: Money; updatedAt: string } | null;
  hasUnconvertedUsd: boolean;
  budgets: Array<{ category: { id: number; name: string; icon: string | null; color: string | null }; budget: Money; used: Money; ratio: number; status: string }>;
  cashflow: Array<{ date: string; income: Money; expense: Money }>;
  expenseByCategory: Array<{ category: { id: number; name: string; icon: string | null; color: string | null } | null; total: Money }>;
  upcomingPayments: Array<{ id: number; debtId: number; lenderName: string; lenderType: string; currency: string; dueDate: string; amountDue: Money; isOverdue: boolean }>;
}

// ── Phase 2 types ──
export interface Investment {
  id: number; type: string; name: string; amount: Money; date: string; walletId: number | null;
  expectedOutcome: string | null; currentValue: Money | null; status: string; outcomeNote: string | null; note: string | null;
}
export interface SavingsAccount {
  id: number; bankName: string; amount: Money; interestRatePerYear: Money; termMonths: number;
  startDate: string; maturityDate: string; autoRenew: boolean; status: string; note: string | null;
  computed?: { projectedInterest: Money; maturityValue: Money; daysToMaturity: number; isMatured: boolean };
}
export interface SavingsGoal {
  id: number; name: string; targetAmount: Money; currentAmount: Money; deadline: string | null; icon: string | null; status: string;
  computed?: { pct: number; remaining: Money; perMonthHint: Money | null };
}
export interface MonthlyReport {
  month: string; income: Money; expense: Money; net: Money; savingsRate: number | null;
  vsPrev: { income: Money; expense: Money };
  categoryBreakdown: Array<{ category: { id: number; name: string; icon: string | null; color: string | null } | null; total: Money }>;
  topExpenses: Array<{ id: number; amount: Money; date: string; description: string | null; category: { name: string; icon: string | null } | null }>;
  debtPaid: { principal: Money; interest: Money; total: Money };
}
export interface YearlyReport {
  year: number; months: Array<{ month: number; income: Money; expense: Money; net: Money; cumulative: Money }>;
  totalIncome: Money; totalExpense: Money; totalInterestPaid: Money; selfInvested: Money;
}
export interface PayoffComparison {
  monthlyBudget: Money; minimumsSum: Money; extraMonthly: Money; avalancheInterestSaved: Money; recommendationNote: string;
  snowball: { strategy: string; order: Array<{ id: number; name: string }>; months: number; totalInterest: Money; totalPaid: Money };
  avalanche: { strategy: string; order: Array<{ id: number; name: string }>; months: number; totalInterest: Money; totalPaid: Money };
}

type Res<T> = Promise<{ data: { success: boolean; data: T; message?: string; pagination?: { page: number; limit: number; total: number; totalPages: number } } }>;
const unwrap = <T,>(p: Res<T>): Promise<T> => p.then((r) => r.data.data);

export const financeApi = {
  // Dashboard
  dashboard: (month?: string) => unwrap<DashboardData>(api.get('/finance/dashboard', { params: { month } })),
  phanTich: () => unwrap<GoiPhanTich>(api.get('/finance/phan-tich')),
  chienLuoc: (traThem: number, motLan: number) => unwrap<ChienLuocTraNo>(api.get('/finance/debts/chien-luoc', { params: { traThem, motLan } })),
  xemTatToan: (id: number, ngay?: string) => unwrap<KetQuaTatToan>(api.get(`/finance/debts/${id}/tat-toan`, { params: { ngay } })),
  ghiTatToan: (id: number, body: { ngay?: string; walletId?: number | null; actualAmount?: number; note?: string }) => unwrap<Debt>(api.post(`/finance/debts/${id}/tat-toan`, body)),
  aiTomTat: () => unwrap<TraLoiCoVan>(api.get('/finance/ai/tom-tat', { timeout: 120_000 })),
  aiHoi: (cauHoi: string) => unwrap<TraLoiCoVan>(api.post('/finance/ai/hoi', { cauHoi }, { timeout: 120_000 })),

  // Exchange rate (VND↔USD, user-entered)
  fxCurrent: () => unwrap<FxRate | null>(api.get('/finance/fx/current')),
  fxHistory: (page = 1, limit = 20) => unwrap<{ items: FxRate[]; total: number; page: number; limit: number }>(api.get('/finance/fx/history', { params: { page, limit } })),
  fxSet: (body: { vndPerUsd: number; note?: string }) => unwrap<FxRate>(api.post('/finance/fx', body)),
  fxDelete: (id: number) => unwrap<{ deleted: boolean }>(api.delete(`/finance/fx/${id}`)),

  // Wallets
  listWallets: (includeArchived = false) => unwrap<Wallet[]>(api.get('/finance/wallets', { params: { includeArchived } })),
  getWallet: (id: number) => unwrap<Wallet>(api.get(`/finance/wallets/${id}`)),
  walletHistory: (id: number, page = 1, limit = 30) => unwrap<{ wallet: Wallet; rows: Array<{ kind: string; refId: number; date: string; amount: Money; label: string; balanceAfter: Money }>; pagination: { page: number; limit: number; total: number; totalPages: number } }>(api.get(`/finance/wallets/${id}/history`, { params: { page, limit } })),
  createWallet: (body: Partial<Wallet>) => unwrap<Wallet>(api.post('/finance/wallets', body)),
  updateWallet: (id: number, body: Partial<Wallet>) => unwrap<Wallet>(api.put(`/finance/wallets/${id}`, body)),
  deleteWallet: (id: number) => unwrap<{ id: number }>(api.delete(`/finance/wallets/${id}`)),
  reorderWallets: (orderedIds: number[]) => unwrap<Wallet[]>(api.post('/finance/wallets/reorder', { orderedIds })),
  transfer: (body: { fromWalletId: number; toWalletId: number; amount: number; note?: string }) => unwrap(api.post('/finance/wallets/transfer', body)),
  adjustWallet: (id: number, body: { targetBalance: number; reason?: string }) => unwrap<Wallet>(api.post(`/finance/wallets/${id}/adjust`, body)),

  // Expense categories
  listCategories: () => unwrap<ExpenseCategory[]>(api.get('/finance/expense-categories')),
  createCategory: (body: Partial<ExpenseCategory>) => unwrap<ExpenseCategory>(api.post('/finance/expense-categories', body)),
  updateCategory: (id: number, body: Partial<ExpenseCategory>) => unwrap<ExpenseCategory>(api.put(`/finance/expense-categories/${id}`, body)),
  deleteCategory: (id: number, reassignToId?: number) => unwrap(api.delete(`/finance/expense-categories/${id}`, { data: { reassignToId } })),
  reorderCategories: (orderedIds: number[]) => unwrap<ExpenseCategory[]>(api.post('/finance/expense-categories/reorder', { orderedIds })),

  // Expenses
  listExpenses: (params: Record<string, unknown>) => api.get('/finance/expenses', { params }).then((r) => r.data as { success: boolean; data: { items: Expense[]; days: Array<{ date: string; total: Money; items: Expense[] }>; pagination: { page: number; limit: number; total: number; totalPages: number } } }),
  createExpense: (body: Record<string, unknown>) => unwrap<Expense>(api.post('/finance/expenses', body)),
  updateExpense: (id: number, body: Record<string, unknown>) => unwrap<Expense>(api.put(`/finance/expenses/${id}`, body)),
  deleteExpense: (id: number) => unwrap<{ id: number }>(api.delete(`/finance/expenses/${id}`)),
  expenseSummary: (params: { from?: string; to?: string; groupBy?: string }) => unwrap<{ groupBy: string; rows: unknown[] }>(api.get('/finance/expenses/summary', { params })),
  expenseOverview: (month?: string) => unwrap<{ spent: Money; prevMonthSpent: Money; changePct: number | null; budgets: unknown[] }>(api.get('/finance/expenses/overview', { params: { month } })),
  exportCsvUrl: (params: Record<string, string>) => `/api/v1/finance/export?${new URLSearchParams({ type: 'expenses', format: 'csv', ...params }).toString()}`,

  // Recurring
  listRecurring: () => unwrap<RecurringTxn[]>(api.get('/finance/recurring')),
  createRecurring: (body: Record<string, unknown>) => unwrap<RecurringTxn>(api.post('/finance/recurring', body)),
  updateRecurring: (id: number, body: Record<string, unknown>) => unwrap<RecurringTxn>(api.put(`/finance/recurring/${id}`, body)),
  deleteRecurring: (id: number) => unwrap(api.delete(`/finance/recurring/${id}`)),
  runRecurring: () => unwrap<{ created: number }>(api.post('/finance/recurring/run')),

  // Income
  listSources: () => unwrap<IncomeSource[]>(api.get('/finance/income/sources')),
  createSource: (body: Record<string, unknown>) => unwrap<IncomeSource>(api.post('/finance/income/sources', body)),
  updateSource: (id: number, body: Record<string, unknown>) => unwrap<IncomeSource>(api.put(`/finance/income/sources/${id}`, body)),
  deleteSource: (id: number) => unwrap(api.delete(`/finance/income/sources/${id}`)),
  listWorkLogs: (sourceId: number, month?: string) => unwrap<{ logs: WorkLog[]; totals: { hoursNormal: Money; hoursOT: Money; hoursOTHoliday: Money; expectedPay: Money } }>(api.get('/finance/income/worklogs', { params: { sourceId, month } })),
  upsertWorkLog: (body: Record<string, unknown>) => unwrap<WorkLog>(api.post('/finance/income/worklogs', body)),
  deleteWorkLog: (id: number) => unwrap(api.delete(`/finance/income/worklogs/${id}`)),
  listIncomeEntries: (params: Record<string, unknown>) => unwrap<IncomeEntry[]>(api.get('/finance/income/entries', { params })),
  createIncomeEntry: (body: Record<string, unknown>) => unwrap<IncomeEntry>(api.post('/finance/income/entries', body)),
  updateIncomeEntry: (id: number, body: Record<string, unknown>) => unwrap<IncomeEntry>(api.put(`/finance/income/entries/${id}`, body)),
  deleteIncomeEntry: (id: number) => unwrap(api.delete(`/finance/income/entries/${id}`)),
  expectedVsActual: (month?: string) => unwrap<{ rows: Array<{ source: { id: number; name: string; type: string; payType: string }; expected: Money; actual: Money; difference: Money }>; totalExpected: Money; totalActual: Money; difference: Money }>(api.get('/finance/income/expected-vs-actual', { params: { month } })),
  incomeByMonth: (year?: string) => unwrap<{ year: number; sources: Array<{ id: number; name: string }>; months: Array<{ month: number; total: Money; bySource: Record<string, Money> }> }>(api.get('/finance/income/by-month', { params: { year } })),

  // Debts
  listDebts: (status?: string) => unwrap<Debt[]>(api.get('/finance/debts', { params: { status } })),
  getDebt: (id: number) => unwrap<Debt>(api.get(`/finance/debts/${id}`)),
  createDebt: (body: Record<string, unknown>) => unwrap<Debt>(api.post('/finance/debts', body)),
  updateDebt: (id: number, body: Record<string, unknown>) => unwrap<Debt>(api.put(`/finance/debts/${id}`, body)),
  deleteDebt: (id: number) => unwrap(api.delete(`/finance/debts/${id}`)),
  previewDebt: (body: Record<string, unknown>) => unwrap<DebtComputation>(api.post('/finance/debts/preview', body)),
  debtSummary: (month?: string) => unwrap<{ totalRemaining: Money; dueThisMonth: Money; activeLenders: number; totalInterestPaid: Money; projectedTotalInterest: Money; dueThisMonthItems: Array<ScheduleItem & { debt: { id: number; lenderName: string; lenderType: string } }>; perLender: Array<{ id: number; lenderName: string; lenderType: string; interestType: string; status: string; remaining: Money; nextDueDate: string | null; nextDueAmount: Money | null }> }>(api.get('/finance/debts/summary', { params: { month } })),
  debtCalendar: (month?: string) => unwrap<{ month: number; year: number; days: Array<{ date: string; total: Money; items: Array<ScheduleItem & { debt: { id: number; lenderName: string; lenderType: string } }> }> }>(api.get('/finance/debts/calendar', { params: { month } })),
  payScheduleItem: (debtId: number, itemId: number, body: { walletId?: number | null; actualAmount?: number; date?: string; note?: string }) => unwrap<Debt>(api.post(`/finance/debts/${debtId}/schedule/${itemId}/pay`, body)),
  unpayScheduleItem: (debtId: number, itemId: number) => unwrap<Debt>(api.post(`/finance/debts/${debtId}/schedule/${itemId}/unpay`)),
  payoffStrategy: (extraMonthly?: number) => unwrap<PayoffComparison | null>(api.get('/finance/debts/payoff-strategy', { params: { extraMonthly } })),

  // ── Phase 2: Investments ──
  investmentSummary: () => unwrap<{ totalInvested: Money; selfInvested: Money; selfInvestedThisYear: Money; assetCost: Money; currentAssetValue: Money; unrealizedGain: Money; unrealizedGainPct: number; counts: { self: number; asset: number } }>(api.get('/finance/investments/summary')),
  listInvestments: (type?: string) => unwrap<Investment[]>(api.get('/finance/investments', { params: { type } })),
  createInvestment: (body: Record<string, unknown>) => unwrap<Investment>(api.post('/finance/investments', body)),
  updateInvestment: (id: number, body: Record<string, unknown>) => unwrap<Investment>(api.put(`/finance/investments/${id}`, body)),
  completeInvestment: (id: number, outcomeNote?: string) => unwrap<Investment>(api.post(`/finance/investments/${id}/complete`, { outcomeNote })),
  sellInvestment: (id: number, body: { saleAmount?: number; walletId?: number | null }) => unwrap<Investment>(api.post(`/finance/investments/${id}/sell`, body)),
  deleteInvestment: (id: number) => unwrap(api.delete(`/finance/investments/${id}`)),

  // ── Phase 2: Savings ──
  savingsSummary: () => unwrap<{ totalSaved: Money; projectedInterest: Money; accountsCount: number; goalsSaved: Money; goalsCount: number }>(api.get('/finance/savings/summary')),
  listSavingsAccounts: () => unwrap<SavingsAccount[]>(api.get('/finance/savings/accounts')),
  createSavingsAccount: (body: Record<string, unknown>) => unwrap<SavingsAccount>(api.post('/finance/savings/accounts', body)),
  updateSavingsAccount: (id: number, body: Record<string, unknown>) => unwrap<SavingsAccount>(api.put(`/finance/savings/accounts/${id}`, body)),
  withdrawSavingsAccount: (id: number, body: { walletId?: number | null; includeInterest?: boolean }) => unwrap<SavingsAccount>(api.post(`/finance/savings/accounts/${id}/withdraw`, body)),
  deleteSavingsAccount: (id: number) => unwrap(api.delete(`/finance/savings/accounts/${id}`)),
  listSavingsGoals: () => unwrap<SavingsGoal[]>(api.get('/finance/savings/goals')),
  createSavingsGoal: (body: Record<string, unknown>) => unwrap<SavingsGoal>(api.post('/finance/savings/goals', body)),
  updateSavingsGoal: (id: number, body: Record<string, unknown>) => unwrap<SavingsGoal>(api.put(`/finance/savings/goals/${id}`, body)),
  contributeToGoal: (id: number, body: { amount: number; walletId?: number | null }) => unwrap<SavingsGoal>(api.post(`/finance/savings/goals/${id}/contribute`, body)),
  deleteSavingsGoal: (id: number) => unwrap(api.delete(`/finance/savings/goals/${id}`)),

  // ── Phase 2: Reports ──
  monthlyReport: (month?: string) => unwrap<MonthlyReport>(api.get('/finance/reports/monthly', { params: { month } })),
  yearlyReport: (year?: string) => unwrap<YearlyReport>(api.get('/finance/reports/yearly', { params: { year } })),
  reportCsvUrl: (month: string) => `/api/v1/finance/reports/monthly/export?month=${month}`,
};

// ─── UI label helpers ────────────────────────────────────────
export const LENDER_TYPE_LABELS: Record<string, string> = {
  LOAN_APP: 'App vay', BANK: 'Ngân hàng', PERSON: 'Cá nhân', CREDIT_CARD: 'Thẻ tín dụng', OTHER: 'Khác',
};
export const INTEREST_TYPE_LABELS: Record<string, string> = {
  REDUCING_BALANCE: 'Trả góp đều (lãi trên dư nợ giảm dần)',
  EQUAL_PRINCIPAL: 'Gốc đều, lãi trên dư nợ giảm dần',
  FLAT_MONTHLY: 'Lãi phẳng (trên gốc ban đầu)',
  INTEREST_ONLY: 'Trả lãi hằng tháng, gốc cuối kỳ',
  DAILY_PERCENT: 'Lãi theo ngày',
  NO_INTEREST: 'Không lãi',
};
/** Giải thích ngắn cho từng kiểu lãi — hiện dưới ô chọn để người dùng chọn đúng như hợp đồng. */
export const INTEREST_TYPE_HINTS: Record<string, string> = {
  REDUCING_BALANCE: 'Mỗi kỳ trả CÙNG một số tiền; lãi tính trên dư nợ còn lại (vay mua nhà/xe, thẻ trả góp).',
  EQUAL_PRINCIPAL: 'Gốc chia đều mỗi kỳ, lãi tính trên dư nợ còn lại ⇒ tiền trả giảm dần (vay ngân hàng phổ biến ở VN).',
  FLAT_MONTHLY: 'Lãi mỗi kỳ = gốc BAN ĐẦU × lãi suất, không giảm dù đã trả bớt (app vay, công ty tài chính). Đắt hơn nhiều so với cùng mức %.',
  INTEREST_ONLY: 'Hằng tháng chỉ trả lãi; toàn bộ gốc trả ở kỳ cuối.',
  DAILY_PERCENT: 'Lãi tính theo ngày trên dư nợ (app vay nhanh).',
  NO_INTEREST: 'Vay người quen, không lãi — gốc chia đều.',
};
export const WALLET_TYPE_LABELS: Record<string, string> = { CASH: 'Tiền mặt', BANK: 'Ngân hàng', EWALLET: 'Ví điện tử', OTHER: 'Khác' };

/** Human-worded interest line, e.g. "0,05%/ngày ≈ 15.000 ₫/ngày". */
export function interestLabel(debt: Pick<Debt, 'interestType' | 'interestRate'> & { computed?: { interestPerDay: Money | null } }): string {
  const rate = Number(debt.interestRate);
  switch (debt.interestType) {
    case 'NO_INTEREST': return 'Không lãi';
    case 'DAILY_PERCENT': {
      const perDay = debt.computed?.interestPerDay;
      const rateStr = `${rate.toString().replace('.', ',')}%/ngày`;
      return perDay ? `${rateStr} ≈ ${Math.round(Number(perDay)).toLocaleString('vi-VN')} ₫/ngày` : rateStr;
    }
    default: {
      const donVi = (debt as { rateUnit?: string | null }).rateUnit === 'YEAR' ? 'năm' : 'tháng';
      const ten = { FLAT_MONTHLY: 'lãi phẳng', REDUCING_BALANCE: 'trả góp đều', EQUAL_PRINCIPAL: 'gốc đều', INTEREST_ONLY: 'chỉ trả lãi' }[debt.interestType] ?? '';
      return `${rate.toString().replace('.', ',')}%/${donVi}${ten ? ` (${ten})` : ''}`;
    }
  }
}
