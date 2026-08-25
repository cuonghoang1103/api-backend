/**
 * Maker Lab — API client.
 * Mirrors src/routes/makerLab.routes.ts.
 */

import { api } from './api';
import type {
  MakerProjectSummary,
  MakerProjectDetail,
  MakerDevice,
  MakerDeviceCredentials,
  MakerCommand,
  MakerTelemetryRow,
  MakerDeviceLog,
  MakerMeta,
  MakerComponent,
} from '@/types/maker-lab';

const BASE = '/maker-lab';

// ─── Public ────────────────────────────────────────────────

export async function listProjects(params?: {
  platform?: string;
  status?: string;
}): Promise<MakerProjectSummary[]> {
  const res = await api.get(`${BASE}/projects`, { params });
  return res.data?.data ?? [];
}

export async function getProject(slug: string): Promise<MakerProjectDetail | null> {
  const res = await api.get(`${BASE}/projects/${encodeURIComponent(slug)}`);
  return res.data?.data ?? null;
}

export async function getMeta(): Promise<MakerMeta | null> {
  const res = await api.get(`${BASE}/meta`);
  return res.data?.data ?? null;
}

// ─── Devices ───────────────────────────────────────────────

/**
 * Xin vé cho trang mô phỏng nối vào cổng thiết bị.
 *
 * `dangOnline` = bo THẬT đang cắm. Cổng chỉ giữ một kết nối mỗi thiết
 * bị, nên nối mô phỏng vào sẽ đá bo ra — hỏi người dùng trước.
 */
export async function xinVeMoPhong(
  id: number,
): Promise<{ ticket: string; expiresInMs: number; deviceId: number; dangOnline: boolean }> {
  const res = await api.post(`${BASE}/devices/${id}/sim-ticket`);
  return res.data?.data;
}

export async function listDevices(): Promise<MakerDevice[]> {
  const res = await api.get(`${BASE}/devices`);
  return res.data?.data ?? [];
}

export async function getDevice(id: number): Promise<MakerDevice | null> {
  const res = await api.get(`${BASE}/devices/${id}`);
  return res.data?.data ?? null;
}

export async function registerDevice(payload: {
  projectId: number;
  name: string;
}): Promise<{ device: MakerDevice; credentials: MakerDeviceCredentials }> {
  const res = await api.post(`${BASE}/devices`, payload);
  return res.data?.data;
}

export async function rotateDeviceSecret(
  id: number,
): Promise<{ device: MakerDevice; credentials: MakerDeviceCredentials }> {
  const res = await api.post(`${BASE}/devices/${id}/rotate-secret`);
  return res.data?.data;
}

export async function renameDevice(id: number, name: string): Promise<MakerDevice> {
  const res = await api.patch(`${BASE}/devices/${id}`, { name });
  return res.data?.data;
}

export async function deleteDevice(id: number): Promise<void> {
  await api.delete(`${BASE}/devices/${id}`);
}

// ─── Control ───────────────────────────────────────────────

export async function sendCommand(
  deviceId: number,
  type: string,
  payload?: Record<string, unknown>,
): Promise<MakerCommand> {
  const res = await api.post(`${BASE}/devices/${deviceId}/commands`, { type, payload });
  return res.data?.data;
}

export async function listCommands(deviceId: number): Promise<MakerCommand[]> {
  const res = await api.get(`${BASE}/devices/${deviceId}/commands`);
  return res.data?.data ?? [];
}

export async function getTelemetry(
  deviceId: number,
  hours = 6,
): Promise<MakerTelemetryRow[]> {
  const res = await api.get(`${BASE}/devices/${deviceId}/telemetry`, { params: { hours } });
  return res.data?.data ?? [];
}

export async function getDeviceLogs(deviceId: number): Promise<MakerDeviceLog[]> {
  const res = await api.get(`${BASE}/devices/${deviceId}/logs`);
  return res.data?.data ?? [];
}

/** Speak a line verbatim — no LLM in the path. */
export async function sayOnDevice(
  deviceId: number,
  text: string,
): Promise<{ provider: string; bytes: number }> {
  const res = await api.post(`${BASE}/devices/${deviceId}/say`, { text });
  return res.data?.data;
}

/** Full turn: think in persona, act, then speak. */
export async function chatWithDevice(
  deviceId: number,
  text: string,
  speak = true,
): Promise<{
  heard: string;
  said: string;
  actions: Array<{ type: string; payload: Record<string, unknown> }>;
  spoken: boolean;
  ms: { stt: number; llm: number; tts: number; total: number };
}> {
  const res = await api.post(`${BASE}/devices/${deviceId}/chat`, { text, speak });
  return res.data?.data;
}

// ─── Shopping checklist ────────────────────────────────────

export async function setComponentAcquired(
  componentId: number,
  acquired: boolean,
): Promise<MakerComponent> {
  const res = await api.patch(`${BASE}/components/${componentId}/acquired`, { acquired });
  return res.data?.data;
}

// ─── Persona (admin) ───────────────────────────────────────

/** Một bộ tính cách: giọng văn + mẫu đối thoại RIÊNG của nó. */
export interface BoTinhCach {
  nhan: string;
  systemPrompt?: string;
  sampleDialogues?: Array<{ user: string; bot: string }>;
  /** Từ khoá để đổi bằng giọng nói, ví dụ `['cà khịa','láo cá']`. */
  tuKhoa?: string[];
  /** Câu robot nói ngay khi vừa đổi sang bộ này. */
  chaoDoi?: string;
}

/** Xoá trí nhớ hội thoại — robot quên sạch, bắt đầu lại từ đầu. */
export async function xoaTriNho(deviceId: number): Promise<void> {
  await api.delete(`/admin${BASE}/devices/${deviceId}/history`);
}

export interface PersonaPayload {
  name?: string;
  /** Nơi robot đứng, ví dụ "Hà Nội, Việt Nam". Dùng khi hỏi thời tiết. */
  viTri?: string | null;
  /** Ghi ĐÈ cả kho bộ tính cách — web luôn gửi trạng thái sau khi sửa. */
  boTinhCach?: Record<string, BoTinhCach>;
  /** Bộ đang bật. `null` = quay về bản gốc của persona. */
  tinhCachDangDung?: string | null;
  systemPrompt?: string;
  voiceProvider?: string;
  voiceId?: string | null;
  language?: string;
  sampleDialogues?: Array<{ user: string; bot: string }>;
  wakeWord?: string | null;
  temperature?: number;
  maxTokens?: number;
  /**
   * Tốc độ đọc 0,25–4,0 (1 = bình thường, dưới 1 là chậm lại).
   *
   * Có tác dụng với **CuongMini** (giọng nhân bản — đổi bằng bộ lọc
   * `atempo` của ffmpeg, giữ nguyên cao độ) và **Google Cloud**. Giọng
   * miễn phí `translate_tts` không có tham số này nên bỏ qua.
   *
   * Gửi riêng chứ đừng nhét vào `traits`: server ghi đè `traits`
   * nguyên khối, nên gửi kèm sẽ xoá mất phần Huấn luyện.
   */
  speechRate?: number;
  /** Chế độ tiếng: 'vi' | 'en' | 'robot'. Đổi được cả từ web lẫn bằng giọng nói. */
  cheDo?: string;
  /** Âm lượng loa 10-100. Lưu bền — bo mất điện vẫn nhớ. */
  amLuong?: number;
  /**
   * Cổng đánh thức: robot chỉ trả lời khi câu nói MỞ ĐẦU bằng `wakeWord`.
   *
   * Máy chủ tự vô hiệu cổng khi `wakeWord` rỗng — không có tên để gọi
   * thì gác cổng đồng nghĩa với câm vĩnh viễn.
   */
  congDanhThuc?: boolean;
  /** Gọi tên xong nghe tiếp bao nhiêu giây mà không cần gọi lại (5–300). */
  giayThucGiac?: number;
  /** Giọng riêng cho từng chế độ tiếng: `{ vi, en, robot }`. Hoà vào, không đè cả bảng. */
  giongTheoCheDo?: Record<string, string | null>;
  /** Não ghim: `'may-nha'` | `'cong'` | `null` = tự động theo cấu hình máy chủ. */
  nao?: string | null;
}

/**
 * Sửa tính cách + giọng nói của robot.
 *
 * Đường admin chứ không phải đường công khai: persona quyết định robot
 * nói gì ra loa trong nhà bạn, nên nó không phải thứ ai cũng sửa được.
 */
/**
 * Đổi kiểu nói tiếng Việt: `'pho-thong'` | `'mien-trung'`.
 *
 * ⚠️ ROUTE RIÊNG, KHÔNG ĐI QUA `updatePersona`. `upsertPersona` ở máy chủ
 * ghi đè CẢ cột `traits`, mà `traits` còn giữ kiến thức huấn luyện, chế
 * độ tiếng, tốc độ đọc, âm lượng và bộ tính cách. Gộp vào đó là một cú
 * bấm đổi kiểu nói làm bay hết những thứ kia — im lặng.
 *
 * `tuDien` không gửi = GIỮ NGUYÊN từ điển cũ, không phải xoá.
 */
export async function luuKieuNoi(
  projectId: number,
  kieuNoi: 'pho-thong' | 'mien-trung',
  tuDien?: Array<{ tu: string; nghia: string }>,
  mauMienTrung?: Array<{ user: string; bot: string }>,
): Promise<{ kieuNoi: string; nhan: string }> {
  const res = await api.put(`/admin${BASE}/projects/${projectId}/kieu-noi`, {
    kieuNoi,
    ...(tuDien ? { tuDien } : {}),
    ...(mauMienTrung ? { mauMienTrung } : {}),
  });
  return res.data?.data;
}

/**
 * Bộ mẫu + từ điển MẶC ĐỊNH, lấy từ máy chủ.
 *
 * ⚠️ KHÔNG chép lại ở đây. Chép là hai bản trôi dạt, và người dùng lại
 * gặp đúng lỗi đã gặp: trang hiện một bộ, robot chạy một bộ khác.
 */
export async function layMacDinhKieuNoi(): Promise<{
  mau: Array<{ user: string; bot: string }>;
  tuDien: Array<{ tu: string; nghia: string; vung?: string }>;
}> {
  const res = await api.get(`/admin${BASE}/kieu-noi/mac-dinh`);
  return res.data?.data ?? { mau: [], tuDien: [] };
}

export async function updatePersona(
  projectId: number,
  payload: PersonaPayload,
): Promise<unknown> {
  const res = await api.put(`/admin${BASE}/projects/${projectId}/persona`, payload);
  return res.data?.data;
}

/**
 * Xuất bản một bản build firmware.
 *
 * Không cần token gì cả — trình duyệt đã cầm phiên đăng nhập và tự gửi
 * kèm. Đó là toàn bộ lý do màn này tồn tại bên cạnh script dòng lệnh:
 * script phải đi copy token ra terminal, còn ở đây thì không.
 *
 * Server tự băm SHA-256 trên đúng byte nhận được rồi mới cất lên R2 —
 * không lấy theo con số client khai, vì băm chính là thứ bo dùng để
 * quyết định có nạp hay không.
 */
export async function uploadFirmware(
  projectId: number,
  input: { file: File; version: string; releaseNotes?: string },
): Promise<{ version: string; sha256?: string; url?: string }> {
  const form = new FormData();
  form.append('version', input.version);
  if (input.releaseNotes) form.append('releaseNotes', input.releaseNotes);
  form.append('file', input.file);
  // 3 phút: bản .bin gần 1 MB, và mạng lên nhà thường chậm hơn mạng về.
  const res = await api.post(`/admin${BASE}/projects/${projectId}/firmware/upload`, form, {
    timeout: 180_000,
  });
  return res.data?.data;
}

// ─── Huấn luyện ────────────────────────────────────────────

export interface TrainingQuestion {
  id: string;
  group: string;
  q: string;
  hint: string;
}

export interface TrainingState {
  questions: TrainingQuestion[];
  knowledge: Array<{ q: string; a: string }>;
  progress: { answered: number; total: number };
}

export async function getTraining(projectId: number): Promise<TrainingState | null> {
  const res = await api.get(`${BASE}/projects/${projectId}/training`);
  return res.data?.data ?? null;
}

/** Gửi câu trả lời rỗng để xoá một mục đã dạy. */
export async function saveTrainingAnswer(
  projectId: number,
  question: string,
  answer: string,
): Promise<Array<{ q: string; a: string }>> {
  const res = await api.post(`${BASE}/projects/${projectId}/training`, { question, answer });
  return res.data?.data?.knowledge ?? [];
}

// ─── Kế hoạch trong ngày ───────────────────────────────────

export type MakerPlanKind = 'ONCE' | 'DAILY' | 'WEEKDAYS' | 'WEEKLY';
export type MakerRunState = 'PENDING' | 'DONE' | 'SKIPPED' | 'MISSED';

export interface MakerPlan {
  id: number;
  title: string;
  huongDan: string | null;
  noteId: number | null;
  kind: MakerPlanKind;
  /** Số phút kể từ 00:00 giờ địa phương. */
  gio: number;
  /** "07:15" — máy chủ tính sẵn để khỏi mỗi nơi tự định dạng một kiểu. */
  gioChu?: string;
  tz: string;
  thu: number[];
  ngayMot: string | null;
  nhacTruoc: number;
  active: boolean;
}

export interface MucHomNay {
  planId: number;
  runId: number | null;
  title: string;
  huongDan: string | null;
  noteId: number | null;
  gio: number;
  gioChu: string;
  /** `CHUA_TOI` = chưa tới giờ. Khác hẳn `PENDING` = tới rồi mà chưa làm. */
  state: MakerRunState | 'CHUA_TOI';
  xongLuc: string | null;
  ghiChu: string | null;
}

export interface TomTatNgay {
  tong: number;
  xong: number;
  conLai: number;
  loQua: number;
}

export async function listPlans(): Promise<MakerPlan[]> {
  const res = await api.get(`${BASE}/plans`);
  return res.data?.data ?? [];
}

export async function planToday(): Promise<{ muc: MucHomNay[]; tomTat: TomTatNgay }> {
  const res = await api.get(`${BASE}/plans/today`);
  return res.data?.data ?? { muc: [], tomTat: { tong: 0, xong: 0, conLai: 0, loQua: 0 } };
}

/**
 * `gio` nhận cả số phút lẫn chuỗi "07:15" — máy chủ đọc được cả hai.
 *
 * Phải `Omit` trước rồi mới giao: `Partial<MakerPlan> & { gio: string }`
 * là giao của `number | undefined` với `string`, tức `never` — kiểu vẫn
 * biên dịch được ở chỗ khai báo nhưng không giá trị nào lọt qua nổi.
 */
type SuaKeHoach = Omit<Partial<MakerPlan>, 'gio'> & { gio?: number | string; projectId?: number };

export async function createPlan(body: SuaKeHoach & { title: string; gio: number | string }) {
  const res = await api.post(`${BASE}/plans`, body);
  return res.data?.data as MakerPlan;
}

export async function updatePlan(id: number, body: SuaKeHoach) {
  const res = await api.put(`${BASE}/plans/${id}`, body);
  return res.data?.data as MakerPlan;
}

export async function deletePlan(id: number): Promise<void> {
  await api.delete(`${BASE}/plans/${id}`);
}

/** Chốt lượt HÔM NAY: xong · bỏ qua · hoãn · mở lại (bấm nhầm thì gỡ ra). */
export async function chotLuot(
  planId: number,
  kieu: 'xong' | 'bo-qua' | 'hoan' | 'mo-lai',
  phut = 10,
): Promise<void> {
  await api.post(`${BASE}/plans/${planId}/xong`, { kieu, phut });
}
