/**
 * TRẠM CT LỒNG TIẾNG (máy nhà Linux) — hợp đồng: docs/long-tieng-hop-dong.md mục 2–3. Cài đặt: README.md cùng thư mục.
 *
 *   tsx tram.mts            chạy vòng nhận việc (systemd --user vbg-long-tieng.service)
 *   tsx tram.mts --mot      nhận đúng MỘT việc rồi thoát (thử tay)
 *
 * Mỗi 10 s hỏi web một việc; làm 5 bước của bản mẫu `lt.mts` (tach → nghe → dich → doc → tron). Mỗi bước ghi kết quả vào
 * ~/long-tieng/lam/<jobId>/ ⇒ trạm chết / thử lại thì làm tiếp, không làm lại bước đã xong. Xong ⇒ đẩy kết quả lên R2 (URL ký sẵn),
 * báo xong, xoá thư mục việc. GPU: LT_GPU=vast7 (ssh từ máy nhà) hoặc local (GPU nhà, chung khoá ~/video-bai-giang/.khoa-gpu).
 *
 * Chống "giọng vỡ" (lỗi lượt chạy thử 18/11 — docs/so-loi.md): đoạn Whisper > 8 s tách trước khi dịch; câu Việt > 130 ký tự tách
 * trước khi đọc; MỌI mẩu đọc xong được Whisper nghe lại + chấm điểm, < 0,85 hoặc độ dài vô lý ⇒ đọc lại bằng seed khác (tối đa 3 lần).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, statfsSync, writeFileSync, appendFileSync, copyFileSync, openSync, writeSync, closeSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  banDo, chiaDoan, datChuan, diemKhop, doDaiKhaNghi, dongSrt, gopCau, kheCau, KY_TU_MOI_GIAY, lapKeHoach, tachCauViet,
  tenKetQua, totHon, banCanDung, chiaLoDich, nguCanhTruoc, mauTuDien, dungLuongCan, type BanDoc, type Cau, type Doan,
} from './thuatToan.ts';

// ─── Cấu hình ──────────────────────────────────────────────────────────────

const HOME = os.homedir();
const DIR = import.meta.dirname;
const PHIEN_BAN = 'tram-long-tieng 1.0 (18/11/2026)';
const API = (process.env.LT_API ?? 'https://cuongthai.com/api/v1').replace(/\/$/, '');
const TOKEN = process.env.LT_TOKEN ?? process.env.INTERNAL_API_TOKEN ?? '';
const GPU = process.env.LT_GPU === 'vast7' ? 'vast7' : 'local';
const LAM_GOC = process.env.LT_LAM ?? path.join(HOME, 'long-tieng/lam');
const GIONG = process.env.LT_GIONG_DIR ?? path.join(HOME, 'vbg-dp/giong');
const YTDLP = process.env.LT_YTDLP ?? 'yt-dlp';
const CHU_KY_MS = Number(process.env.LT_CHU_KY_GIAY ?? 10) * 1000;
const SEEDS = [42, 7, 1234, 99]; // seed đầu + tối đa 3 lần đọc lại (cùng dãy với lam-giong.mts)
/** Lô dịch: ≤ 40 câu VÀ ≤ 2.400 ký tự gốc (video dài: lô đều nhau, model không bỏ sót đuôi). */
const LO_DICH = { toiDaCau: 40, toiDaKyTu: Number(process.env.LT_LO_DICH_KY_TU ?? 2400) };
/** Ổ trống tối thiểu trước khi tải video (chưa biết cỡ) — sau khi có video thì đo đúng bằng `dungLuongCan`. */
const O_TRONG_TOI_THIEU = Number(process.env.LT_O_TRONG_TOI_THIEU_GB ?? 8) * 1e9;
const SR = 24000;

const MAY = GPU === 'vast7'
  ? {
    ssh: process.env.LT_VAST_HOST ?? 'vast7', vbg: '/root/video-bai-giang', goc: '/root/long-tieng',
    // 18/11: KHÔNG dùng ./gpu.sh (4 khe của làn giọng bài giảng — 8 làn giọng giữ kín khe ⇒ việc lồng tiếng chờ 36 phút ở 12%).
    // Khoá riêng: một việc lồng tiếng một lúc, chạy song song với làn giọng (GPU 24 GB thừa chỗ).
    khoa: process.env.LT_KHOA_GPU ?? 'flock /root/video-bai-giang/.khoa-long-tieng',
    pyDemucs: process.env.LT_PY_DEMUCS ?? '/root/lt-venv/bin/python', pyWhisper: process.env.LT_PY_WHISPER ?? '/root/f5-train/.venv/bin/python',
    pyF5: process.env.LT_PY_F5 ?? '/root/f5-train/.venv/bin/python',
  }
  : {
    ssh: null as string | null, vbg: process.env.LT_VBG ?? path.join(HOME, 'video-bai-giang'), goc: LAM_GOC, khoa: 'flock .khoa-gpu',
    pyDemucs: process.env.LT_PY_DEMUCS ?? path.join(HOME, 'long-tieng/.venv/bin/python'),
    pyWhisper: process.env.LT_PY_WHISPER ?? path.join(HOME, 'long-tieng/.venv/bin/python'),
    pyF5: process.env.LT_PY_F5 ?? path.join(HOME, 'f5-train/.venv/bin/python'),
  };

const log = (s: string) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${s}`);
const ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));
const q = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

// ─── Việc đang làm (nhịp tim + huỷ) ────────────────────────────────────────

class Huy extends Error { constructor() { super('việc đã bị huỷ / xếp lại trên web'); } }
interface Ctx { id: string; trangThai: 'tai' | 'lam'; buoc: string; phanTram: number; tenVideo?: string; huy: boolean; con: Set<ChildProcess>; theoDoiTep?: { f: string; tong: number; tu: number; den: number } }
let ctx: Ctx | null = null;
const kiemHuy = () => { if (ctx?.huy) throw new Huy(); };

// ─── HTTP tới web ──────────────────────────────────────────────────────────

async function api(method: string, p: string, body?: unknown): Promise<{ status: number; data: any }> {
  const r = await fetch(`${API}/internal/long-tieng${p}`, {
    method, headers: { 'content-type': 'application/json', 'x-internal-token': TOKEN }, body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(180_000),
  });
  if (r.status === 410) throw new Huy();
  if (r.status === 204) return { status: 204, data: null };
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`web ${method} ${p}: HTTP ${r.status} ${j?.message ?? ''}`.trim());
  return { status: r.status, data: j.data };
}

async function baoTienDo(trangThai: Ctx['trangThai'], buoc: string, phanTram: number): Promise<void> {
  if (!ctx) return;
  Object.assign(ctx, { trangThai, buoc, phanTram: Math.round(phanTram) });
  log(`   ${ctx.phanTram}% ${buoc}`);
  await nhipTim();
}
async function nhipTim(): Promise<void> {
  if (!ctx || ctx.huy) return;
  const t = ctx.theoDoiTep;
  if (t && existsSync(t.f)) ctx.phanTram = Math.round(t.tu + (t.den - t.tu) * Math.min(1, statSync(t.f).size / Math.max(1, t.tong)));
  try {
    await api('POST', `/${ctx.id}/tien-do`, { trangThai: ctx.trangThai, buoc: ctx.buoc, phanTram: ctx.phanTram, ...(ctx.tenVideo ? { tenVideo: ctx.tenVideo } : {}) });
  } catch (e) {
    if (e instanceof Huy) {
      ctx.huy = true;
      log('   ⛔ web báo việc đã huỷ/xếp lại ⇒ dừng tiến trình con');
      for (const c of ctx.con) { try { process.kill(-c.pid!, 'SIGTERM'); } catch { /* đã chết */ } }
    } else log(`   (nhịp tim lỗi: ${String((e as Error).message).slice(0, 160)})`);
  }
}

// ─── Chạy lệnh (KHÔNG chặn vòng sự kiện ⇒ nhịp tim vẫn chạy khi chờ GPU) ───

async function chay(cmd: string, o: { input?: string; choPhepMa?: boolean; moiDong?: (l: string) => void } = {}): Promise<{ out: string; code: number; duoi: string }> {
  kiemHuy();
  return new Promise((ok, hong) => {
    const p = spawn('bash', ['-c', cmd], { detached: true, stdio: ['pipe', 'pipe', 'pipe'] });
    ctx?.con.add(p);
    let out = '', duoi = '';
    p.stdout.on('data', (b: Buffer) => { const s = b.toString(); out += s; if (o.moiDong) s.split(/[\r\n]+/).forEach((l) => l.trim() && o.moiDong!(l)); });
    p.stderr.on('data', (b: Buffer) => { const s = b.toString(); duoi = (duoi + s).slice(-3000); if (o.moiDong) s.split(/[\r\n]+/).forEach((l) => l.trim() && o.moiDong!(l)); });
    p.stdin.end(o.input ?? '');
    p.on('error', hong);
    p.on('close', (code) => {
      ctx?.con.delete(p);
      if (ctx?.huy) return hong(new Huy());
      const c = code ?? 1;
      if (c !== 0 && !o.choPhepMa) return hong(new Error(`lệnh hỏng (mã ${c}): ${cmd.slice(0, 140)} … ${duoi.trim().split('\n').slice(-4).join(' | ')}`));
      ok({ out, code: c, duoi });
    });
  });
}

/** Lệnh trên máy GPU: vast7 qua ssh (stderr của vast có banner ⇒ chỉ giữ để báo lỗi), local ⇒ bash thẳng. */
const mayChay = (script: string, o: { choPhepMa?: boolean } = {}) =>
  MAY.ssh ? chay(`ssh -q -o ServerAliveInterval=30 -o ConnectTimeout=30 ${MAY.ssh} bash -s`, { input: script, ...o }) : chay(script, o);

async function dayLen(local: string, remote: string) {
  if (!MAY.ssh) { if (path.resolve(local) !== path.resolve(remote)) copyFileSync(local, remote); return; }
  await chay(`scp -q -o ConnectTimeout=30 ${q(local)} ${MAY.ssh}:${q(remote)}`);
}
async function keoVe(remote: string, local: string) {
  if (!MAY.ssh) { if (path.resolve(local) !== path.resolve(remote)) copyFileSync(remote, local); return; }
  await chay(`scp -q -o ConnectTimeout=30 ${MAY.ssh}:${q(remote)} ${q(local)}`);
}

/** Lệnh dưới khoá GPU, trong thư mục video-bai-giang. Mã 3 (doc.py thiếu VRAM) / 255 (ssh rớt) ⇒ chờ 30 s thử lại. */
async function gpu(cmd: string): Promise<string> {
  for (let lan = 0; ; lan++) {
    const r = await mayChay(`cd ${q(MAY.vbg)} && ${MAY.khoa} ${cmd}`, { choPhepMa: true });
    if (r.code === 0) return r.out;
    if ((r.code === 3 || r.code === 255) && lan < 40) { log(`   … GPU bận / ssh rớt (mã ${r.code}), chờ 30 s`); await ngu(30_000); kiemHuy(); continue; }
    throw new Error(`GPU hỏng (mã ${r.code}): ${r.duoi.trim().split('\n').slice(-4).join(' | ')}`);
  }
}

const doDai = async (f: string) => Number((await chay(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${q(f)}`)).out.trim()) || 0;
async function fpsCua(f: string): Promise<number> {
  const s = (await chay(`ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of csv=p=0 ${q(f)}`, { choPhepMa: true })).out.trim();
  const [a, b] = s.split('/').map(Number);
  const v = b ? a! / b : Number(a);
  return Number.isFinite(v) && v > 5 && v < 121 ? v : 30;
}

// ─── Chữ đọc (đúng đường sản xuất video bài giảng) ─────────────────────────

let chuDocGoc: (s: string) => string;
let docSoTrongChu: ((s: string) => string) | undefined;
async function napPhienAm() {
  const f = path.join(GIONG, 'phienAmBai.ts');
  const m = await import(pathToFileURL(f).href);
  chuDocGoc = m.chuDocGoc;
  docSoTrongChu = m.docSoTrongChu;
  if (typeof chuDocGoc !== 'function') throw new Error(`${f} không có chuDocGoc`);
}

// ─── Một việc ──────────────────────────────────────────────────────────────

interface NhanViec {
  job: { id: string; url: string | null; tep: { ten: string; kichThuoc: number } | null; tenVideo: string | null; lang: string; goc: number; nhip: 'cho-giong' | 'tang-toc';
    /** Bản video xuất ra (web cũ không gửi ⇒ cả hai). */
    banRa?: 'ca-hai' | 'vi' | 'vi-goc';
    nhacNen: { loai: 'goc' | 'thu-vien' | 'tep' | 'khong'; amLuong: number; ten?: string; id?: string } };
  vao?: { url: string };
  nhac?: { url: string };
}
type CauVi = Cau & { vi?: string };

async function lamViec(n: NhanViec) {
  const { job } = n;
  const LAM = path.join(LAM_GOC, job.id);
  mkdirSync(LAM, { recursive: true });
  const R = MAY.ssh ? `${MAY.goc}/${job.id}` : LAM;
  const id8 = job.id.slice(0, 8);
  ctx = { id: job.id, trangThai: 'tai', buoc: 'Trạm đã nhận việc', phanTram: 0, huy: false, con: new Set() };
  const nhip = setInterval(() => { void nhipTim(); }, 60_000);
  log(`▶ việc ${job.id} ${job.url ?? job.tep?.ten ?? ''} · nhịp ${job.nhip} · nhạc ${job.nhacNen.loai} · xuất ${job.banRa ?? 'ca-hai'}`);
  try {
    // ── 0. lấy video + nhạc ──
    kiemO(LAM, O_TRONG_TOI_THIEU, 'trước khi tải video');
    const vao = await layVideo(n, LAM);
    const ten = (job.tenVideo || (existsSync(path.join(LAM, 'tieu-de.txt')) ? readFileSync(path.join(LAM, 'tieu-de.txt'), 'utf8').trim().split('\n')[0] : '') || 'video').trim();
    ctx.tenVideo = ten;
    const nhacTep = path.join(LAM, 'nhac.bin');
    if (n.nhac && !existsSync(nhacTep)) {
      await baoTienDo('tai', 'Tải nhạc nền', 10);
      await chay(`curl -fsSL --retry 3 -o ${q(nhacTep + '.part')} ${q(n.nhac.url)}`);
      renameSync(nhacTep + '.part', nhacTep);
    }
    const tongDai = await doDai(vao);
    if (!tongDai) throw new Error('Không đọc được độ dài video (tệp hỏng?)');
    // Video dài (1–3 giờ): đo ổ NGAY, chặn sớm với câu rõ ràng thay vì chết giữa chừng ở bước ghép.
    kiemO(LAM, dungLuongCan(tongDai, statSync(vao).size) - statSync(vao).size, `cho video ${(tongDai / 3600).toFixed(1)} giờ`);

    await mayChay(`mkdir -p ${q(R)}`);
    const remotePy = MAY.ssh ? `${R}/lt-remote.py` : path.join(DIR, 'lt-remote.py');
    if (MAY.ssh) await dayLen(path.join(DIR, 'lt-remote.py'), remotePy);

    // ── 1. tách giọng gốc / nhạc nền ──
    const giongGoc = path.join(LAM, 'vocals.flac'), nen = path.join(LAM, 'nen.flac');
    if (!existsSync(nen) || !existsSync(giongGoc)) {
      await baoTienDo('lam', 'Tách giọng gốc khỏi nhạc nền', 12);
      const amGoc = path.join(LAM, 'goc.wav');
      await chay(`ffmpeg -nostdin -loglevel error -y -i ${q(vao)} -vn -ac 2 -ar 44100 ${q(amGoc)}`);
      await dayLen(amGoc, `${R}/goc.wav`);
      await gpu(`${MAY.pyDemucs} ${q(remotePy)} tach ${q(`${R}/goc.wav`)} ${q(`${R}/tach`)} >/dev/null`);
      await mayChay(`cd ${q(`${R}/tach/htdemucs/goc`)} && ffmpeg -nostdin -loglevel error -y -i vocals.wav -c:a flac vocals.flac && ffmpeg -nostdin -loglevel error -y -i no_vocals.wav -c:a flac nen.flac`);
      await keoVe(`${R}/tach/htdemucs/goc/vocals.flac`, giongGoc + '.part');
      await keoVe(`${R}/tach/htdemucs/goc/nen.flac`, nen + '.part');
      renameSync(giongGoc + '.part', giongGoc); renameSync(nen + '.part', nen);
      rmSync(amGoc, { force: true });
      await mayChay(`rm -rf ${q(`${R}/tach`)} ${q(`${R}/goc.wav`)}`);
    }

    // ── 2. Whisper chép lời gốc (kèm mốc từng từ) ──
    const loiGoc = path.join(LAM, 'loi-goc.json');
    if (!existsSync(loiGoc)) {
      await baoTienDo('lam', 'Nghe & chép lời gốc', 25);
      const v16 = path.join(LAM, 'vocals16.wav');
      await chay(`ffmpeg -nostdin -loglevel error -y -i ${q(giongGoc)} -ac 1 -ar 16000 ${q(v16)}`);
      await dayLen(v16, `${R}/vocals16.wav`);
      await gpu(`${MAY.pyWhisper} ${q(remotePy)} nghe ${q(`${R}/vocals16.wav`)} ${q(job.lang)} ${q(`${R}/loi-goc.json`)}`);
      await keoVe(`${R}/loi-goc.json`, loiGoc + '.part');
      renameSync(loiGoc + '.part', loiGoc);
      rmSync(v16, { force: true });
    }
    const goc = JSON.parse(readFileSync(loiGoc, 'utf8')) as { lang: string; seg: Doan[] };
    const caus: CauVi[] = gopCau(goc.seg, goc.lang);
    if (!caus.length) throw new Error('Whisper không nghe ra lời nào trong video (video không có lời nói?)');
    log(`   ngôn ngữ ${goc.lang} · ${goc.seg.length} đoạn ⇒ ${caus.length} câu (đoạn > 8 s đã tách)`);

    // ── 3. dịch (qua web — trạm không giữ khoá LLM) ──
    await buocDich(job.id, LAM, caus, goc.lang, tongDai);

    // ── 4. giọng cuong8 đọc + nghe lại chấm điểm ──
    const doc = await buocDoc(LAM, R, remotePy, id8, caus);

    // ── 5. canh mốc + kéo dài hình + trộn ──
    const ra = await buocTron(LAM, job, n, vao, nen, giongGoc, caus, doc, tongDai, goc.lang, ten);

    // ── đẩy kết quả ──
    await baoTienDo('lam', 'Đẩy kết quả lên kho', 96);
    const ds = Object.entries(ra.tep).map(([loai, f]) => ({ loai, ten: path.basename(f), kichThuoc: statSync(f).size, kieu: KIEU[loai]! }));
    const len = await api('POST', `/${job.id}/len-ket-qua`, { tep: ds });
    for (const t of len.data.tep as { loai: string; url: string; kieu: string }[]) {
      kiemHuy();
      const f = ra.tep[t.loai]!;
      await chay(`curl -fsS --retry 3 -X PUT -H ${q(`Content-Type: ${t.kieu}`)} -T ${q(f)} ${q(t.url)} -o /dev/null`);
    }
    await api('POST', `/${job.id}/xong`, { thoiLuong: ra.thoiLuong, ketQua: ds, tenVideo: ten, buoc: ra.tomTat });
    log(`✓ xong ${job.id}: ${ra.tomTat}`);
    rmSync(LAM, { recursive: true, force: true });
    if (MAY.ssh) await mayChay(`rm -rf ${q(R)}`, { choPhepMa: true });
  } catch (e) {
    if (e instanceof Huy || ctx.huy) {
      log(`⛔ việc ${job.id} đã huỷ trên web ⇒ dọn`);
      rmSync(LAM, { recursive: true, force: true });
      if (MAY.ssh) await chay(`ssh -q ${MAY.ssh} 'pkill -f ${id8} ; rm -rf ${R}'`, { choPhepMa: true }).catch(() => {});
    } else {
      const loi = String((e as Error)?.message ?? e).slice(-1800);
      log(`✗ lỗi ${job.id}: ${loi}`);
      // Giữ thư mục việc ⇒ "Thử lại" trên web làm tiếp từ bước hỏng.
      await api('POST', `/${job.id}/loi`, { loi }).catch((x) => log(`   (báo lỗi lên web cũng hỏng: ${String(x?.message ?? x)})`));
    }
  } finally {
    clearInterval(nhip);
    ctx = null;
  }
}

const KIEU: Record<string, string> = { vi: 'video/mp4', 'vi-goc': 'video/mp4', 'srt-vi': 'application/x-subrip', 'srt-goc': 'application/x-subrip', 'thong-tin': 'application/json' };

// ── 0. lấy video ──
async function layVideo(n: NhanViec, LAM: string): Promise<string> {
  const co = readdirSync(LAM).find((f) => /^vao\.(mp4|mkv|webm|mov|m4v|avi|flv|ts)$/i.test(f) || f === 'vao.bin');
  if (co && existsSync(path.join(LAM, 'vao.xong'))) return path.join(LAM, co);
  if (n.vao) {
    const f = path.join(LAM, 'vao.bin');
    await baoTienDo('tai', 'Tải video lên trạm', 0);
    ctx!.theoDoiTep = { f: f + '.part', tong: n.job.tep?.kichThuoc ?? 1, tu: 0, den: 10 };
    await chay(`curl -fsSL --retry 3 -o ${q(f + '.part')} ${q(n.vao.url)}`);
    ctx!.theoDoiTep = undefined;
    renameSync(f + '.part', f);
    writeFileSync(path.join(LAM, 'vao.xong'), '');
    return f;
  }
  const url = n.job.url!;
  await baoTienDo('tai', 'Tải video từ link', 0);
  // 1080p là đủ học; ưu tiên mp4 H.264 + m4a ⇒ ghép không cần mã hoá lại (như máy chủ cục bộ của bản mẫu)
  const thamSo = `--no-playlist -f 'bv*[vcodec^=avc1][height<=1080]+ba[ext=m4a]/b[vcodec^=avc1][height<=1080]/bv*[height<=1080][ext=mp4]+ba[ext=m4a]/bv*[height<=1080]+ba/b' --merge-output-format mp4 --newline --no-part`;
  let cuoi = '';
  try {
    await chay(`${YTDLP} ${thamSo} --print-to-file '%(title)s' ${q(path.join(LAM, 'tieu-de.txt'))} -o ${q(path.join(LAM, 'vao.%(ext)s'))} ${q(url)}`, {
      moiDong: (l) => {
        const m = l.match(/\[download\]\s+([\d.]+)%/);
        if (m && ctx) ctx.phanTram = Math.round(+m[1]! * 0.1);
        if (/ERROR/.test(l)) cuoi = l;
      },
    });
  } catch (e) {
    if (!MAY.ssh) throw new Error(`Trạm không tải được link này (${(cuoi || String((e as Error).message)).slice(0, 300)}). Hãy tải video trên máy bạn rồi kéo vào app.`);
    // YouTube có thể chặn IP máy nhà ⇒ thử MỘT lần qua máy GPU thuê (không vượt chặn gì thêm).
    log('   yt-dlp ở máy nhà hỏng ⇒ thử qua máy GPU thuê');
    await baoTienDo('tai', 'Tải video từ link (qua máy GPU thuê)', 2);
    const R = `${MAY.goc}/tai-${Date.now()}`;
    const r = await mayChay(`mkdir -p ${q(R)} && cd ${q(R)} && Y=$(command -v yt-dlp || ls /root/lt-venv/bin/yt-dlp 2>/dev/null) && [ -n "$Y" ] && ` +
      `"$Y" ${thamSo} --print-to-file '%(title)s' tieu-de.txt -o 'vao.%(ext)s' ${q(url)} >/dev/null 2>&1 && ls vao.*`, { choPhepMa: true });
    const tep = r.out.trim().split('\n').find((x) => x.startsWith('vao.'));
    if (r.code !== 0 || !tep) {
      await mayChay(`rm -rf ${q(R)}`, { choPhepMa: true });
      throw new Error('Trạm không tải được link này (cả máy nhà lẫn máy GPU thuê). Hãy tải video trên máy bạn rồi kéo vào app.');
    }
    await keoVe(`${R}/${tep}`, path.join(LAM, tep));
    await keoVe(`${R}/tieu-de.txt`, path.join(LAM, 'tieu-de.txt')).catch(() => {});
    await mayChay(`rm -rf ${q(R)}`, { choPhepMa: true });
  }
  const f = readdirSync(LAM).find((x) => /^vao\.(mp4|mkv|webm|mov|m4v)$/i.test(x));
  if (!f) throw new Error('yt-dlp chạy xong nhưng không thấy tệp video');
  writeFileSync(path.join(LAM, 'vao.xong'), '');
  return path.join(LAM, f);
}

// ── 3. dịch ──
// Video dài (18/11/2026): (a) TỪ ĐIỂN riêng của việc soạn MỘT lần từ mẫu gọn của cả bản chép (`POST /tu-dien`), lưu
// `tu-dien.json` trong thư mục việc (thử lại không soạn lại), gửi kèm MỌI lô; (b) mỗi lô mang ~6 câu Việt liền trước;
// (c) lô chia theo số câu + SỐ KÝ TỰ; thiếu câu thì CHỈ gửi lại phần thiếu (`choPhepThieu`). Máy chủ cũ không có
// `/tu-dien` / `choPhepThieu` ⇒ vẫn chạy (không từ điển; 502 thiếu câu ⇒ lượt sau chỉ hỏi phần thiếu).
async function layTuDien(jobId: string, LAM: string, caus: CauVi[], lang: string): Promise<unknown[]> {
  const f = path.join(LAM, 'tu-dien.json');
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8')) as unknown[];
  await baoTienDo('lam', 'Lập từ điển thuật ngữ', 35);
  try {
    const r = await api('POST', '/tu-dien', { jobId, ngonNgu: lang, mau: mauTuDien(caus) });
    const td = Array.isArray(r?.data?.tuDien) ? (r.data.tuDien as unknown[]) : [];
    writeFileSync(f, JSON.stringify(td));
    log(`   từ điển: ${td.length} mục`);
    return td;
  } catch (e) {
    if (e instanceof Huy) throw e;
    log(`   không soạn được từ điển (${String((e as Error).message).slice(0, 160)}) — dịch không kèm từ điển`);
    return [];
  }
}

async function buocDich(jobId: string, LAM: string, caus: CauVi[], lang: string, tongDai: number) {
  const f = path.join(LAM, 'dich.json');
  const cu: Record<number, string> = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
  for (const c of caus) if (cu[c.i]) c.vi = cu[c.i];
  if (caus.every((c) => c.vi)) return;
  const tuDien = await layTuDien(jobId, LAM, caus, lang);
  const cacLo = chiaLoDich(caus, LO_DICH);
  for (const [soLo, chiSo] of cacLo.entries()) {
    const lo = chiSo.map((k) => caus[k]!);
    if (lo.every((c) => c.vi)) continue;
    await baoTienDo('lam', `Dịch ${chiSo[0]}/${caus.length} câu`, 35 + (15 * chiSo[0]!) / caus.length);
    const truoc = nguCanhTruoc(caus, chiSo[0]!, 6);
    for (let lan = 0; ; lan++) {
      const can = lo.filter((c) => !c.vi);
      if (!can.length) break;
      const cau = can.map((c) => { const kh = kheCau(caus, c.i, tongDai); return { i: c.i, giay: +kh.toFixed(1), toiDa: Math.round(kh * KY_TU_MOI_GIAY), src: c.src }; });
      try {
        const r = await api('POST', '/dich', { jobId, ngonNgu: lang, cau, truoc, tuDien, choPhepThieu: true });
        for (const d of r.data.ds as { i: number; vi: string }[]) { if (caus[d.i]) { caus[d.i]!.vi = d.vi; cu[d.i] = d.vi; } }
        writeFileSync(f, JSON.stringify(cu));
        const con = lo.filter((c) => !c.vi).length;
        if (!con) break;
        throw new Error(`còn thiếu ${con} câu`);
      } catch (e) {
        if (e instanceof Huy || lan >= 5) throw e;
        log(`   lô dịch ${soLo + 1}/${cacLo.length} lỗi (${String((e as Error).message).slice(0, 160)}) — 10 s nữa chỉ gửi lại câu còn thiếu`);
        await ngu(10_000);
      }
    }
  }
}

// ── 4. đọc + nghe lại + đọc lại câu hỏng ──
interface Mau { id: string; cau: number; t: string; doc: string; nghi: number }
type BanDocTep = BanDoc & { file: string; nghe: string };
interface KetQuaDoc { mau: Mau[]; tot: Record<string, BanDocTep>; lan: Record<string, number> }

async function buocDoc(LAM: string, R: string, remotePy: string, id8: string, caus: CauVi[]): Promise<KetQuaDoc> {
  const AM = path.join(LAM, 'am'); mkdirSync(AM, { recursive: true });
  const fTrang = path.join(LAM, 'doc.json');
  const mau: Mau[] = caus.flatMap((c) => tachCauViet(c.vi ?? '').map((m, k) => ({
    id: `c${String(c.i).padStart(4, '0')}-${k}`, cau: c.i, t: m.t, doc: chuDocGoc(m.t), nghi: m.nghi,
  })));
  const trang: { tot: Record<string, BanDocTep>; lan: Record<string, number>; daThu: Record<string, number[]> } =
    existsSync(fTrang) ? JSON.parse(readFileSync(fTrang, 'utf8')) : { tot: {}, lan: {}, daThu: {} };
  const ref = JSON.parse(readFileSync(path.join(GIONG, 'ref-el.json'), 'utf8')) as { file: string; text: string };
  const ckpt = readFileSync(path.join(GIONG, 'MO_HINH'), 'utf8').trim();
  log(`   ${caus.length} câu ⇒ ${mau.length} mẩu đọc (câu > 130 ký tự đã tách)`);

  for (let vong = 0; vong < SEEDS.length; vong++) {
    const seed = SEEDS[vong]!;
    const can = mau.filter((m) => !(trang.daThu[m.id] ?? []).includes(seed) && (vong === 0 ? !trang.tot[m.id] : !datChuan(trang.tot[m.id])));
    if (!can.length) continue;
    await baoTienDo('lam', vong === 0 ? `Giọng bạn đang đọc ${mau.length} mẩu` : `Đọc lại ${can.length} mẩu chưa đạt (lượt ${vong + 1})`, 50 + vong * 8);
    const ten = `lt-${id8}-v${vong}`;
    const viecTam = path.join(LAM, `viec-v${vong}.json`);
    writeFileSync(viecTam, JSON.stringify({ ref: ref.file, refText: ref.text, nfe: 64, toc: 0.95, ckpt, nhip: 1, cau: can.map((m) => ({ id: `${m.id}-s${seed}`, doc: m.doc, seed })) }));
    await dayLen(viecTam, `${MAY.vbg}/viec-${ten}.json`);
    await gpu(`bash -c ${q(`rm -rf lo-${ten} && ${MAY.pyF5} doc.py viec-${ten}.json lo-${ten} >/dev/null 2>&1`)}`);
    // nghe lại cả lô một lần (nạp Whisper một lần)
    await gpu(`${MAY.pyWhisper} ${q(remotePy)} nghe-vi ${q(`${MAY.vbg}/lo-${ten}`)} ${q(`${R}/nghe-v${vong}.json`)}`);
    await mayChay(`cd ${q(`${MAY.vbg}/lo-${ten}`)} && for f in *.wav; do ffmpeg -nostdin -loglevel error -y -i "$f" -c:a flac "\${f%.wav}.flac" || exit 9; done`);
    if (MAY.ssh) {
      await chay(`set -o pipefail; ssh -q ${MAY.ssh} ${q(`cd ${MAY.vbg}/lo-${ten} && tar cf - *.flac`)} | tar xf - -C ${q(AM)}`);
    } else {
      for (const f of readdirSync(`${MAY.vbg}/lo-${ten}`).filter((x) => x.endsWith('.flac'))) renameSync(`${MAY.vbg}/lo-${ten}/${f}`, path.join(AM, f));
    }
    const fNghe = path.join(LAM, `nghe-v${vong}.json`);
    await keoVe(`${R}/nghe-v${vong}.json`, fNghe);
    await mayChay(`rm -rf ${q(`${MAY.vbg}/lo-${ten}`)} ${q(`${MAY.vbg}/viec-${ten}.json`)}`, { choPhepMa: true });
    const nghe = JSON.parse(readFileSync(fNghe, 'utf8')) as Record<string, { text: string }>;
    for (const m of can) {
      (trang.daThu[m.id] ??= []).push(seed);
      trang.lan[m.id] = (trang.lan[m.id] ?? 0) + 1;
      const file = path.join(AM, `${m.id}-s${seed}.flac`);
      if (!existsSync(file)) continue;
      const giay = await doDai(file);
      const chu = nghe[`${m.id}-s${seed}`]?.text ?? '';
      const ban: BanDocTep = { seed, giay, diem: diemKhop(chu, [m.t, m.doc], docSoTrongChu), khaNghi: doDaiKhaNghi(giay, m.t), file, nghe: chu };
      if (totHon(ban, trang.tot[m.id])) trang.tot[m.id] = ban;
    }
    writeFileSync(fTrang, JSON.stringify(trang));
    const chuaDat = mau.filter((m) => !datChuan(trang.tot[m.id])).length;
    log(`   lượt ${vong + 1} (seed ${seed}): đọc ${can.length} mẩu · còn ${chuaDat} mẩu dưới ngưỡng`);
  }
  const thieu = mau.filter((m) => !trang.tot[m.id]);
  if (thieu.length) throw new Error(`F5 không đọc ra ${thieu.length} mẩu (vd ${thieu[0]!.id}: "${thieu[0]!.t.slice(0, 60)}")`);
  return { mau, tot: trang.tot, lan: trang.lan };
}

// ── 5. canh mốc + trộn ──
async function buocTron(LAM: string, job: NhanViec['job'], n: NhanViec, vao: string, nen: string, giongGoc: string, caus: CauVi[], doc: KetQuaDoc,
  tongDai: number, lang: string, ten: string) {
  await baoTienDo('lam', 'Canh giọng theo hình', 82);
  const CANH = path.join(LAM, 'canh'); rmSync(CANH, { recursive: true, force: true }); mkdirSync(CANH);
  // Ghép các mẩu của mỗi câu (cắt lặng đầu/cuối, chèn lặng nhịp C) ⇒ PCM mono 24 kHz
  const pcmCau: (Int16Array | null)[] = [];
  for (const c of caus) {
    const ms = doc.mau.filter((m) => m.cau === c.i);
    const phan: Int16Array[] = [];
    for (const m of ms) {
      const raw = path.join(CANH, `${m.id}.raw`);
      await chay(`ffmpeg -nostdin -loglevel error -y -i ${q(doc.tot[m.id]!.file)} -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" -ac 1 -ar ${SR} -f s16le ${q(raw)}`);
      const bb = readFileSync(raw);
      phan.push(new Int16Array(bb.buffer, bb.byteOffset, Math.floor(bb.length / 2)));
      if (m.nghi) phan.push(new Int16Array(Math.round(m.nghi * SR)));
    }
    const tong = phan.reduce((s, x) => s + x.length, 0);
    if (!tong) { pcmCau.push(null); continue; }
    const p = new Int16Array(tong); let o = 0; for (const x of phan) { p.set(x, o); o += x.length; }
    pcmCau.push(p);
  }
  const fps = await fpsCua(vao);
  const kh = lapKeHoach(caus, pcmCau.map((p) => (p ? p.length / SR : 0)), tongDai, job.nhip, fps);
  const T = banDo(kh.cuaSo, tongDai);
  log(`   ${kh.dat.length} câu · ${kh.soDocNhanh} câu đọc nhanh · ${kh.cuaSo.length} chỗ kéo dài hình (+${kh.giayKeoDai.toFixed(1)} s) · ${kh.soTre} câu trễ`);

  // Dải giọng Việt theo thời gian RA
  const track = new Int16Array(Math.ceil((T + 2) * SR));
  const srtVi: { a: number; b: number; t: string }[] = [];
  for (const d of kh.dat) {
    let p = pcmCau[d.i]!;
    if (d.tempo > 1.0005) {
      const raw = path.join(CANH, `cau-${d.i}.raw`), raw2 = path.join(CANH, `cau-${d.i}-t.raw`);
      writeFileSync(raw, Buffer.from(p.buffer, p.byteOffset, p.byteLength));
      await chay(`ffmpeg -nostdin -loglevel error -y -f s16le -ar ${SR} -ac 1 -i ${q(raw)} -af atempo=${d.tempo.toFixed(4)} -f s16le ${q(raw2)}`);
      const bb = readFileSync(raw2); p = new Int16Array(bb.buffer, bb.byteOffset, Math.floor(bb.length / 2));
    }
    const o = Math.round(d.batDau * SR);
    track.set(p.subarray(0, Math.max(0, track.length - o)), o);
    srtVi.push({ a: d.batDau, b: d.batDau + p.length / SR, t: caus[d.i]!.vi ?? '' });
  }
  const tho = path.join(LAM, 'giong-vi.wav');
  ghiWav(tho, track, SR); // không Buffer.concat: video 3 giờ = ~0,5 GB PCM, concat là nhân đôi RAM
  const giongVi = path.join(LAM, 'giong-vi-norm.wav');
  await chay(`ffmpeg -nostdin -loglevel error -y -i ${q(tho)} -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 2 ${q(giongVi)}`);

  // Hình: không kéo dài ⇒ giữ nguyên luồng hình; có ⇒ dựng lại từng đoạn (khớp khung) rồi nối
  let hinh = vao;
  let nenRa = nen, gocRa = giongGoc;
  const ban = banCanDung(job.banRa);
  if (kh.cuaSo.length) {
    const doan = chiaDoan(kh.cuaSo, tongDai);
    const DV = path.join(LAM, 'doan'); rmSync(DV, { recursive: true, force: true }); mkdirSync(DV);
    const ds: string[] = [];
    for (let k = 0; k < doan.length; k++) {
      kiemHuy();
      const w = doan[k]!;
      const L = w.b - w.a;
      const soKhung = Math.max(1, Math.round((L * w.f + w.g) * fps));
      const f = path.join(DV, `${String(k).padStart(4, '0')}.mp4`);
      await chay(`ffmpeg -nostdin -loglevel error -y -ss ${w.a.toFixed(4)} -t ${L.toFixed(4)} -i ${q(vao)} -an -vf "setpts=${w.f.toFixed(5)}*(PTS-STARTPTS),fps=${fps},tpad=stop_mode=clone:stop_duration=${(w.g + 0.5).toFixed(3)}" -frames:v ${soKhung} -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p ${q(f)}`);
      ds.push(`file '${f.replace(/'/g, `'\\''`)}'`);
      if (k % 10 === 0 && ctx) { ctx.buoc = `Kéo dài hình ${k + 1}/${doan.length} đoạn`; ctx.phanTram = 84 + (8 * k) / doan.length; }
    }
    writeFileSync(path.join(DV, 'ds.txt'), ds.join('\n'));
    hinh = path.join(LAM, 'hinh-ra.mp4');
    await chay(`ffmpeg -nostdin -loglevel error -y -f concat -safe 0 -i ${q(path.join(DV, 'ds.txt'))} -c copy ${q(hinh)}`);
    nenRa = await keoAm(nen, doan, path.join(LAM, 'nen-ra.flac'), fps);
    // Giọng gốc chỉ cần cho bản song ngữ ⇒ "chỉ giọng Việt" khỏi kéo dải này.
    if (ban.some(([, coGoc]) => coGoc)) gocRa = await keoAm(giongGoc, doan, path.join(LAM, 'goc-ra.flac'), fps);
    rmSync(DV, { recursive: true, force: true });
  }

  // Trộn hai bản
  await baoTienDo('lam', 'Ghép tiếng + xuất video', 92);
  const nhac = job.nhacNen;
  const nhacTep = path.join(LAM, 'nhac.bin');
  const RA = path.join(LAM, 'ra'); mkdirSync(RA, { recursive: true });
  const tenRa = tenKetQua(ten, lang, job.goc);
  const tep: Record<string, string> = {};
  // 18/11: YouTube hay trả AV1/VP9 ⇒ QuickTime/iPad không hiện hình (user: "chỉ có âm thanh"). Không phải H.264 ⇒ mã hoá lại.
  const coDecHinh = (await chay(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 ${q(hinh)}`)).out.trim();
  const maHinh = coDecHinh === 'h264' ? '-c:v copy' : '-c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p';

  for (const [loai, coGoc] of ban) {
    const vaoAm: string[] = [`-i ${q(giongVi)}`];
    const loc: string[] = [`[1:a]apad=whole_dur=${T.toFixed(3)},volume=1[v0]`];
    const tron: string[] = [];
    let soVao = 2;
    if (nhac.loai === 'goc') {
      vaoAm.push(`-i ${q(nenRa)}`); loc.push(`[${soVao++}:a]volume=${nhac.amLuong}[n]`); tron.push('[n]');
      loc.push('[v0]anull[v]');
    } else if ((nhac.loai === 'thu-vien' || nhac.loai === 'tep') && existsSync(nhacTep)) {
      // lặp/cắt cho đủ dài, vào/ra dần, tự né giọng Việt
      vaoAm.push(`-stream_loop -1 -i ${q(nhacTep)}`);
      loc.push(`[${soVao++}:a]aresample=44100,aformat=channel_layouts=stereo,atrim=0:${T.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=2,afade=t=out:st=${Math.max(0, T - 3).toFixed(3)}:d=3,volume=${nhac.amLuong}[m0]`);
      loc.push('[v0]asplit=2[v][vs]', '[m0][vs]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=500[n]');
      tron.push('[n]');
    } else {
      loc.push('[v0]anull[v]');
    }
    if (coGoc) { vaoAm.push(`-i ${q(gocRa)}`); loc.push(`[${soVao++}:a]volume=${job.goc}[g]`); tron.push('[g]'); }
    loc.push(tron.length ? `[v]${tron.join('')}amix=inputs=${1 + tron.length}:duration=first:normalize=0[a]` : '[v]anull[a]');
    const f = path.join(RA, tenRa[loai]);
    await chay(`ffmpeg -nostdin -loglevel error -y -i ${q(hinh)} ${vaoAm.join(' ')} -filter_complex ${q(loc.join(';'))} -map 0:v -map "[a]" ${maHinh} -c:a aac -b:a 192k -t ${T.toFixed(3)} -movflags +faststart ${q(f)}`);
    tep[loai] = f;
  }
  const fSrtVi = path.join(RA, tenRa['srt-vi']);
  writeFileSync(fSrtVi, dongSrt(srtVi));
  tep['srt-vi'] = fSrtVi;
  const fSrtGoc = path.join(RA, tenRa['srt-goc']);
  writeFileSync(fSrtGoc, dongSrt(caus.map((c) => ({ a: banDo(kh.cuaSo, c.a), b: banDo(kh.cuaSo, c.b), t: c.src }))));
  tep['srt-goc'] = fSrtGoc;

  // Điểm từng câu = điểm thấp nhất trong các mẩu; số lần đọc = tổng lượt của các mẩu
  const cauTT = caus.map((c) => {
    const ms = doc.mau.filter((m) => m.cau === c.i);
    const diem = Math.min(...ms.map((m) => doc.tot[m.id]?.diem ?? 0));
    const lan = ms.reduce((s, m) => s + (doc.lan[m.id] ?? 1), 0);
    const khaNghi = ms.map((m) => doc.tot[m.id]?.khaNghi).filter(Boolean);
    const d = kh.dat.find((x) => x.i === c.i);
    return {
      i: c.i, a: c.a, b: c.b, src: c.src, vi: c.vi, manh: ms.length, diem: +diem.toFixed(3), soLanDoc: lan, docLai: lan > ms.length,
      duoiNguong: ms.some((m) => !datChuan(doc.tot[m.id])), ...(khaNghi.length ? { khaNghi } : {}),
      ...(d ? { batDau: +d.batDau.toFixed(3), tempo: +d.tempo.toFixed(3) } : {}),
      ...(ms.some((m) => !datChuan(doc.tot[m.id])) ? { ngheLai: ms.map((m) => doc.tot[m.id]?.nghe ?? '') } : {}),
    };
  });
  const soDocLai = cauTT.filter((c) => c.docLai).length;
  const soDuoi = cauTT.filter((c) => c.duoiNguong).length;
  const tomTat = `${caus.length} câu · ${soDocLai} câu đọc lại · ${soDuoi} câu dưới ngưỡng` +
    (kh.cuaSo.length ? ` · kéo dài hình +${kh.giayKeoDai.toFixed(0)} s` : '') + (kh.soDocNhanh ? ` · ${kh.soDocNhanh} câu đọc nhanh` : '');
  const thongTin = {
    phienBanTram: PHIEN_BAN, ngay: new Date().toISOString(), gpu: GPU,
    nguon: job.url ? 'url' : 'tep', link: job.url, tenVideo: ten, ngonNgu: lang,
    thoiLuongGoc: +tongDai.toFixed(3), thoiLuong: +T.toFixed(3), soCau: caus.length, soMauDoc: doc.mau.length,
    nhip: job.nhip, nhacNen: { loai: nhac.loai, ...(nhac.ten ? { ten: nhac.ten } : {}), ...(nhac.id ? { id: nhac.id } : {}), amLuong: nhac.amLuong },
    giongGoc: job.goc, banRa: job.banRa ?? 'ca-hai', soCauDocNhanh: kh.soDocNhanh, soCauTre: kh.soTre, soChoKeoDai: kh.cuaSo.length, giayKeoDai: +kh.giayKeoDai.toFixed(2),
    soCauDocLai: soDocLai, soCauDuoiNguong: soDuoi, nguongDiem: 0.85, tomTat, cau: cauTT,
  };
  const fTT = path.join(RA, 'thong-tin.json');
  writeFileSync(fTT, JSON.stringify(thongTin, null, 1));
  tep['thong-tin'] = fTT;
  return { tep, thoiLuong: T, tomTat };
}

/** Kéo dải âm (nhạc nền / giọng gốc) theo đúng các đoạn của hình: đoạn chậm ⇒ atempo, phần giữ khung ⇒ lặng. */
async function keoAm(src: string, doan: ReturnType<typeof chiaDoan>, ra: string, fps: number): Promise<string> {
  const raw = ra + '.raw';
  writeFileSync(raw, Buffer.alloc(0));
  for (const w of doan) {
    kiemHuy();
    const L = w.b - w.a;
    const raL = Math.max(1, Math.round((L * w.f + w.g) * fps)) / fps;
    const can = Math.round(raL * 44100) * 4; // s16 stereo
    const tam = ra + '.doan';
    await chay(`ffmpeg -nostdin -loglevel error -y -ss ${w.a.toFixed(4)} -t ${L.toFixed(4)} -i ${q(src)} ${w.f > 1.0001 ? `-af atempo=${(1 / w.f).toFixed(5)}` : ''} -ac 2 -ar 44100 -f s16le ${q(tam)}`);
    let b = readFileSync(tam);
    b = b.length >= can ? b.subarray(0, can) : Buffer.concat([b, Buffer.alloc(can - b.length)]);
    appendFileSync(raw, b);
    rmSync(tam, { force: true });
  }
  await chay(`ffmpeg -nostdin -loglevel error -y -f s16le -ar 44100 -ac 2 -i ${q(raw)} -c:a flac ${q(ra)}`);
  rmSync(raw, { force: true });
  return ra;
}

/** Ghi WAV mono 16-bit: đầu tệp rồi THẲNG vùng nhớ của mảng (không nối thành một Buffer mới — video dài đỡ ~0,5 GB RAM). */
function ghiWav(f: string, pcm: Int16Array, sr: number) {
  const fd = openSync(f, 'w');
  try {
    writeSync(fd, wavHeader(pcm.byteLength, sr, 1));
    const b = Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength);
    for (let o = 0; o < b.length; o += 64 << 20) writeSync(fd, b, o, Math.min(64 << 20, b.length - o));
  } finally { closeSync(fd); }
}

/** Ổ chứa `dir` còn ≥ `can` byte trống không — thiếu ⇒ lỗi rõ ràng (việc giữ thư mục ⇒ dọn ổ rồi bấm Thử lại là chạy tiếp). */
function kiemO(dir: string, can: number, luc: string) {
  let trong: number;
  try { const st = statfsSync(dir); trong = Number(st.bavail) * Number(st.bsize); } catch { return; } // không đo được ⇒ không chặn
  if (trong >= can) return;
  throw new Error(`Ổ máy nhà còn ${(trong / 1e9).toFixed(1)} GB trống, cần khoảng ${(can / 1e9).toFixed(1)} GB ${luc} — dọn bớt ổ rồi bấm Thử lại.`);
}

function wavHeader(bytes: number, sr: number, ch: number): Buffer {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + bytes, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20);
  h.writeUInt16LE(ch, 22); h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 2 * ch, 28); h.writeUInt16LE(2 * ch, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(bytes, 40);
  return h;
}

// ─── Vòng chính ────────────────────────────────────────────────────────────

/** Thư mục việc bỏ dở quá 7 ngày (việc đã xoá trên web) ⇒ dọn. */
function donThuMucCu() {
  if (!existsSync(LAM_GOC)) return;
  for (const d of readdirSync(LAM_GOC)) {
    const p = path.join(LAM_GOC, d);
    try { if (Date.now() - statSync(p).mtimeMs > 7 * 86400_000) { rmSync(p, { recursive: true, force: true }); log(`dọn thư mục cũ ${d}`); } } catch { /* bỏ qua */ }
  }
}

async function main() {
  if (!TOKEN) { console.error('Thiếu LT_TOKEN (= INTERNAL_API_TOKEN của web). Xem README.md.'); process.exit(2); }
  await napPhienAm();
  mkdirSync(LAM_GOC, { recursive: true });
  log(`${PHIEN_BAN} · web ${API} · GPU ${GPU}${MAY.ssh ? ` (${MAY.ssh})` : ` (khoá ${MAY.vbg}/.khoa-gpu)`} · thư mục ${LAM_GOC}`);
  const mot = process.argv.includes('--mot');
  let lanDon = 0;
  for (;;) {
    try {
      if (Date.now() - lanDon > 6 * 3600_000) { donThuMucCu(); lanDon = Date.now(); }
      const r = await api('POST', '/nhan');
      if (r.status === 204 || !r.data) { if (mot) { log('không có việc'); return; } await ngu(CHU_KY_MS); continue; }
      await lamViec(r.data as NhanViec);
      if (mot) return;
    } catch (e) {
      log(`vòng nhận việc lỗi: ${String((e as Error)?.message ?? e).slice(0, 300)} — thử lại sau 30 s`);
      if (mot) process.exit(1);
      await ngu(30_000);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  for (const sig of ['SIGTERM', 'SIGINT'] as const) process.on(sig, () => {
    log(`nhận ${sig} — dừng (việc đang làm sẽ được web xếp lại sau 20 phút, trạm làm tiếp từ bước dở)`);
    for (const c of ctx?.con ?? []) { try { process.kill(-c.pid!, 'SIGTERM'); } catch { /* */ } }
    process.exit(0);
  });
  await main();
}

/** Cho phép thử khâu trộn ngoài vòng chính (không gọi web/GPU). */
export const _chiDeThu = { buocTron, keoAm };
