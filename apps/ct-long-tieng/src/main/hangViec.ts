/**
 * Hàng việc — chạy ở MAIN để vẫn hỏi máy chủ, tự tải kết quả và báo xong khi cửa sổ đã đóng (app nằm ở khay).
 *
 * Ba nguồn trạng thái:
 *   • `viec`  — bản mới nhất từ máy chủ (GET /jobs).
 *   • `luu`   — điều app nhớ về từng việc qua các lần mở app (`hang-viec.json`): thư mục kết quả, tên từng tệp đã
 *               chọn (để tải TIẾP đúng tệp `.part`), tệp đang chờ tải lên, đã báo chưa…
 *   • `dong`  — tiến độ đang diễn ra ở máy này (tải lên / tải về / yt-dlp), không lưu.
 */
import { app, Notification } from 'electron';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import type { CaiDat } from '../shared/caiDat';
import { TEN_THU_MUC_APP } from '../shared/caiDat';
import type { LoaiKetQua, NhacNen, PhieuTaiLen, TaoViecRa, TepKetQua, Viec } from '../shared/hopDong';
import type { TuyChonViec, ViecHienThi } from '../shared/ipc';
import { tinhNhip } from '../shared/hoiDinhKy';
import { kieuMime, lamSachTen, laTepNhac, laTepVideo, tenKhongTrung, tenThuMucViec, tenTuTep } from '../shared/tenTep';
import { laLoiTaiLink, tinhHienThi, type CucBo } from '../shared/trangThai';
import type { BanDoTep } from '../shared/thuVien';
import { LoiApi, type ApiLongTieng } from './api';
import { docJson, ghiJson } from './kho';
import { TEP_GHI_CHU, type GhiChuApp } from './thuVien';
import { LoiTruyen, taiLen, taiVe } from './truyenTep';
import { taiBangYtDlp } from './ytdlp';

interface Luu {
  /** Đã từng thấy việc này còn chạy ⇒ khi nó kết thúc thì báo (việc đã xong từ trước khi kết nối thì không báo). */
  theoDoi?: boolean;
  daBao?: boolean;
  thuMuc?: string;
  banDo?: BanDoTep;
  daTaiVe?: boolean;
  chuaBaoTaiVe?: boolean;
  tepTam?: string;
  /** Tệp tạm do app tạo (yt-dlp) ⇒ xoá sau khi tải lên xong. */
  tepTamCuaApp?: boolean;
  kieu?: string;
  phieu?: PhieuTaiLen | null;
  /** Tệp "Nhạc của tôi" còn chờ gửi (của người dùng — không bao giờ xoá). */
  nhacTam?: string;
  kieuNhac?: string;
  phieuNhac?: PhieuTaiLen | null;
  tieuDe?: string;
}

const TEP_LUU = 'hang-viec.json';

export interface MoiTruongHang {
  api: ApiLongTieng;
  caiDat: () => CaiDat;
  cuaSoHien: () => boolean;
  thayDoi: () => void;
  moTrinhPhat: (mucId: string) => void;
}

export class HangViec {
  private viec = new Map<string, Viec>();
  private luu: Record<string, Luu> = docJson<Record<string, Luu>>(TEP_LUU) ?? {};
  private dong = new Map<string, CucBo>();
  private dieuKhien = new Map<string, AbortController>();
  private hangTaiVe: string[] = [];
  private dangTaiVe = false;
  private hen: NodeJS.Timeout | null = null;
  private dangHoi = false;
  private loiLienTiep = 0;
  loiMang: string | null = null;
  private daHoiLanDau = false;

  constructor(private readonly mt: MoiTruongHang) {}

  get thuMucKetQua(): string {
    return path.join(this.mt.caiDat().thuMucTai, TEN_THU_MUC_APP);
  }

  // ── Vòng hỏi ──────────────────────────────────────────────────────────────

  batDau(): void { void this.hoi(); }

  dung(): void {
    if (this.hen) clearTimeout(this.hen);
    this.hen = null;
    for (const dk of this.dieuKhien.values()) dk.abort();
  }

  /** Cửa sổ vừa hiện / người dùng bấm làm mới ⇒ hỏi ngay. */
  hoiNgay(): void { void this.hoi(); }

  private henLai(): void {
    if (this.hen) clearTimeout(this.hen);
    this.hen = null;
    const ms = tinhNhip({ dangChay: this.coViecChay(), cuaSoHien: this.mt.cuaSoHien(), loiLienTiep: this.loiLienTiep });
    if (ms !== null) this.hen = setTimeout(() => void this.hoi(), ms);
  }

  private coViecChay(): boolean {
    for (const v of this.viec.values()) if (tinhHienThi(v, this.cucBo(v.id)).dangChay) return true;
    return this.dieuKhien.size > 0 || this.hangTaiVe.length > 0;
  }

  private async hoi(): Promise<void> {
    if (this.dangHoi) return;
    if (!this.mt.api.coMa) { this.henLai(); return; }
    this.dangHoi = true;
    try {
      const ds = await this.mt.api.danhSach();
      this.loiLienTiep = 0;
      this.loiMang = null;
      this.apDung(ds);
    } catch (e) {
      this.loiLienTiep += 1;
      this.loiMang = e instanceof Error ? e.message : String(e);
    } finally {
      this.dangHoi = false;
      this.daHoiLanDau = true;
      this.mt.thayDoi();
      this.henLai();
    }
  }

  private apDung(ds: Viec[]): void {
    const moi = new Map(ds.map((v) => [v.id, v]));
    // Việc app vừa tạo nhưng danh sách chưa kịp có ⇒ giữ lại một nhịp.
    for (const [id, v] of this.viec) if (!moi.has(id) && this.dieuKhien.has(id)) moi.set(id, v);
    this.viec = moi;
    let doi = false;
    for (const v of moi.values()) {
      const l = (this.luu[v.id] ??= {});
      const ketThuc = v.trangThai === 'xong' || v.trangThai === 'loi' || v.trangThai === 'huy';
      if (!ketThuc && !l.theoDoi) { l.theoDoi = true; doi = true; }
      if (ketThuc && !l.theoDoi && !l.daBao) { l.daBao = true; doi = true; }

      if (v.trangThai === 'xong' && !l.daTaiVe && v.ketQua.length && this.mt.caiDat().tuTaiVe) this.xepTaiVe(v.id);
      if (v.trangThai === 'xong' && l.daTaiVe && l.chuaBaoTaiVe) void this.baoDaTaiVe(v.id);
      if (v.trangThai === 'xong' && !this.mt.caiDat().tuTaiVe && l.theoDoi && !l.daBao) {
        l.daBao = true; doi = true;
        this.thongBao('Lồng tiếng xong', `${this.tieuDe(v)} — mở app để tải về.`);
      }
      if ((v.trangThai === 'loi' || v.trangThai === 'huy') && l.theoDoi && !l.daBao) {
        l.daBao = true; doi = true;
        if (v.trangThai === 'loi') this.thongBao('Lồng tiếng lỗi', `${this.tieuDe(v)}: ${v.loi ?? 'trạm báo lỗi'}`);
      }
      // Mở lại app khi một tệp còn đang chờ tải lên ⇒ gửi lại (nếu phiếu tải lên còn hạn).
      if (v.trangThai === 'cho_tai_len' && (l.tepTam || l.nhacTam) && !this.dieuKhien.has(v.id) && !this.dong.get(v.id)?.loiCucBo) {
        void this.taiLenViec(v.id);
      }
    }
    // Quên những việc máy chủ không còn (đã xoá ở web, hết hạn…).
    for (const id of Object.keys(this.luu)) {
      if (!moi.has(id) && !this.dieuKhien.has(id)) {
        const l = this.luu[id];
        if (l.tepTamCuaApp && l.tepTam) void fsp.rm(l.tepTam, { force: true });
        delete this.luu[id];
        this.dong.delete(id);
        doi = true;
      }
    }
    if (doi) void ghiJson(TEP_LUU, this.luu);
  }

  private cucBo(id: string): CucBo {
    const l = this.luu[id] ?? {};
    return { ...(this.dong.get(id) ?? {}), daTaiVe: !!l.daTaiVe, thuMuc: l.thuMuc ?? null };
  }

  private datDong(id: string, p: Partial<CucBo>): void {
    this.dong.set(id, { ...(this.dong.get(id) ?? {}), ...p });
    this.mt.thayDoi();
  }

  private luuLai(): void { void ghiJson(TEP_LUU, this.luu); }

  // ── Ảnh chụp cho renderer / khay ───────────────────────────────────────────

  tieuDe(v: Viec): string {
    if (v.tenVideo) return v.tenVideo;
    const l = this.luu[v.id];
    if (l?.tieuDe) return l.tieuDe;
    if (v.tenTep) return tenTuTep(v.tenTep);
    if (v.url) {
      try { const u = new URL(v.url); return `${u.hostname.replace(/^www\./, '')}${u.pathname === '/' ? '' : u.pathname}`; } catch { return v.url; }
    }
    return 'Video';
  }

  anhChup(): ViecHienThi[] {
    return [...this.viec.values()]
      .sort((a, b) => (a.tao < b.tao ? 1 : a.tao > b.tao ? -1 : 0))
      .map((v) => {
        const c = this.cucBo(v.id);
        const hienThi = tinhHienThi(v, c);
        const l = this.luu[v.id] ?? {};
        const dangLamCucBo = this.dieuKhien.has(v.id);
        return {
          id: v.id,
          tieuDe: this.tieuDe(v),
          nguon: v.url ? 'link' : 'tep',
          link: v.url,
          lang: v.lang,
          goc: v.goc,
          nhip: v.nhip,
          trangThai: v.trangThai,
          hienThi,
          chip: hienThi.chip,
          tao: v.tao,
          xong: v.xong,
          thoiLuong: v.thoiLuong,
          coTheThuLai: !dangLamCucBo && (v.trangThai === 'loi' || !!c.loiCucBo),
          coTheTaiTrenMay: !dangLamCucBo && laLoiTaiLink(v),
          coTheTaiVe: !dangLamCucBo && v.trangThai === 'xong' && !l.daTaiVe && v.ketQua.length > 0 && !this.hangTaiVe.includes(v.id) && !c.loiCucBo,
          coTheHuy: hienThi.dangChay,
          daTaiVe: !!l.daTaiVe,
          mucThuVien: l.daTaiVe && l.thuMuc ? path.basename(l.thuMuc) : null,
        } satisfies ViecHienThi;
      });
  }

  soViecDangChay(): number {
    return this.anhChup().filter((v) => v.hienThi.dangChay).length;
  }

  daSanSang(): boolean { return this.daHoiLanDau; }

  xoaHet(): void {
    this.dung();
    this.viec.clear();
    this.dong.clear();
    this.dieuKhien.clear();
    this.hangTaiVe = [];
    this.luu = {};
    this.luuLai();
  }

  // ── Tạo việc ──────────────────────────────────────────────────────────────

  /** Nhạc nền cho thân `POST /jobs` + tệp nhạc cần tải lên (khi chọn "Nhạc của tôi"). */
  private async nhacNenGui(tc: TuyChonViec): Promise<{ than: NhacNen; tep: { duongDan: string; kieu: string } | null }> {
    const n = tc.nhacNen;
    if (n.loai === 'thu-vien') return { than: { loai: 'thu-vien', id: n.id ?? undefined, amLuong: n.amLuong }, tep: null };
    if (n.loai !== 'tep') return { than: { loai: n.loai, amLuong: n.amLuong }, tep: null };
    const p = this.mt.caiDat().nhacNenTep;
    if (!p || !laTepNhac(p)) throw new Error('Chưa chọn tệp "Nhạc của tôi".');
    const st = await fsp.stat(p).catch(() => null);
    if (!st?.isFile() || st.size <= 0) throw new Error('Không còn thấy tệp nhạc đã chọn — hãy chọn lại.');
    const ten = path.basename(p);
    const kieu = kieuMime(ten);
    return { than: { loai: 'tep', amLuong: n.amLuong, tep: { ten, kichThuoc: st.size, kieu } }, tep: { duongDan: p, kieu } };
  }

  private ghiNhanViecMoi(r: TaoViecRa, them: Partial<Luu>, nhac: { duongDan: string; kieu: string } | null): string {
    const { viec } = r;
    this.viec.set(viec.id, viec);
    const l: Luu = { theoDoi: true, ...them };
    if (nhac) {
      if (!r.taiLenNhac) throw new LoiApi('Máy chủ không trả link tải lên cho tệp nhạc.', 500);
      l.nhacTam = nhac.duongDan;
      l.kieuNhac = nhac.kieu;
      l.phieuNhac = r.taiLenNhac;
    }
    this.luu[viec.id] = l;
    this.luuLai();
    if (l.tepTam || l.nhacTam) void this.taiLenViec(viec.id);
    return viec.id;
  }

  async taoTuLink(url: string, tc: TuyChonViec): Promise<void> {
    const nhac = await this.nhacNenGui(tc);
    const r = await this.mt.api.tao({
      url, lang: tc.lang, goc: tc.goc, nhip: tc.nhip, nhacNen: nhac.than, ...(tc.tenVideo ? { tenVideo: tc.tenVideo } : {}),
    });
    this.ghiNhanViecMoi(r, {}, nhac.tep);
    this.mt.thayDoi();
    this.hoiNgay();
  }

  /** Nhiều tệp ⇒ nhiều việc; tên tuỳ chọn chỉ áp khi có ĐÚNG MỘT tệp. Trả các tệp bị bỏ (không phải video…). */
  async taoTuTep(dsDuongDan: string[], tc: TuyChonViec, tepCuaApp = false): Promise<{ boQua: string[]; ids: string[] }> {
    const boQua: string[] = [];
    const ids: string[] = [];
    const nhac = await this.nhacNenGui(tc);
    for (const p of dsDuongDan) {
      const ten = path.basename(p);
      let kich = 0;
      try {
        const st = await fsp.stat(p);
        if (!st.isFile() || st.size <= 0) { boQua.push(ten); continue; }
        kich = st.size;
      } catch { boQua.push(ten); continue; }
      if (!laTepVideo(ten)) { boQua.push(ten); continue; }
      const kieu = kieuMime(ten);
      const tenVideo = dsDuongDan.length === 1 && tc.tenVideo ? tc.tenVideo : undefined;
      const r = await this.mt.api.tao({
        tep: { ten, kichThuoc: kich, kieu }, lang: tc.lang, goc: tc.goc, nhip: tc.nhip, nhacNen: nhac.than,
        ...(tenVideo ? { tenVideo } : {}),
      });
      if (!r.taiLen) throw new LoiApi('Máy chủ không trả link tải lên.', 500);
      r.viec = { ...r.viec, tenTep: r.viec.tenTep ?? ten };
      ids.push(this.ghiNhanViecMoi(r, { tepTam: p, tepTamCuaApp: tepCuaApp, kieu, phieu: r.taiLen, tieuDe: tenVideo ?? tenTuTep(ten) }, nhac.tep));
    }
    this.mt.thayDoi();
    return { boQua, ids };
  }

  /** Gửi lần lượt video rồi tệp nhạc (nếu có), tiến độ cộng dồn; xong cả hai mới báo `da-tai-len`. */
  private async taiLenViec(id: string): Promise<void> {
    const l = this.luu[id];
    if (!l || (!l.tepTam && !l.nhacTam) || this.dieuKhien.has(id)) return;
    const hetHan = (ph?: PhieuTaiLen | null) => !ph || (!!ph.het && Date.parse(ph.het) < Date.now() + 60_000);
    const viecCan: Array<{ duongDan: string; kieu: string; phieu: PhieuTaiLen; loai: 'video' | 'nhac' }> = [];
    if (l.tepTam) {
      if (hetHan(l.phieu)) return this.loiTaiLen(id, 'Link tải lên đã hết hạn — hãy xoá việc này và thêm lại tệp.');
      viecCan.push({ duongDan: l.tepTam, kieu: l.kieu ?? 'application/octet-stream', phieu: l.phieu!, loai: 'video' });
    }
    if (l.nhacTam) {
      if (hetHan(l.phieuNhac)) return this.loiTaiLen(id, 'Link tải lên tệp nhạc đã hết hạn — hãy xoá việc này và tạo lại.');
      viecCan.push({ duongDan: l.nhacTam, kieu: l.kieuNhac ?? 'application/octet-stream', phieu: l.phieuNhac!, loai: 'nhac' });
    }
    let tong = 0;
    for (const v of viecCan) {
      const st = await fsp.stat(v.duongDan).catch(() => null);
      if (!st) return this.loiTaiLen(id, `Không còn thấy ${v.loai === 'nhac' ? 'tệp nhạc' : 'tệp video'} trên máy — hãy xoá việc này và thêm lại.`);
      tong += st.size;
    }
    const dk = new AbortController();
    this.dieuKhien.set(id, dk);
    this.datDong(id, { loiCucBo: null, taiLen: { daGui: 0, tong } });
    try {
      let truoc = 0;
      for (const v of viecCan) {
        await taiLen(v.phieu.url, v.duongDan, v.kieu, (da) => this.datDong(id, { taiLen: { daGui: truoc + da, tong } }), dk.signal);
        truoc += (await fsp.stat(v.duongDan)).size;
        if (v.loai === 'video') {
          if (l.tepTamCuaApp) await fsp.rm(v.duongDan, { force: true });
          delete l.tepTam;
          delete l.phieu;
        } else {
          delete l.nhacTam;
          delete l.phieuNhac;
        }
        this.luuLai();
      }
      await this.mt.api.daTaiLen(id);
      const v = this.viec.get(id);
      if (v) this.viec.set(id, { ...v, trangThai: 'cho' });
      this.datDong(id, { taiLen: null });
    } catch (e) {
      if (!dk.signal.aborted) this.datDong(id, { taiLen: null, loiCucBo: { loai: 'tai-len', thongDiep: (e as Error).message } });
    } finally {
      this.dieuKhien.delete(id);
      this.mt.thayDoi();
      this.hoiNgay();
    }
  }

  private loiTaiLen(id: string, thongDiep: string): void {
    this.datDong(id, { loiCucBo: { loai: 'tai-len', thongDiep } });
  }

  // ── Huỷ / thử lại / tải trên máy ──────────────────────────────────────────

  async huy(id: string): Promise<void> {
    this.dieuKhien.get(id)?.abort();
    this.dieuKhien.delete(id);
    this.hangTaiVe = this.hangTaiVe.filter((x) => x !== id);
    await this.mt.api.xoa(id).catch((e: unknown) => {
      if (!(e instanceof LoiApi && e.maHttp === 404)) throw e;
    });
    const l = this.luu[id];
    if (l?.tepTamCuaApp && l.tepTam) await fsp.rm(l.tepTam, { force: true });
    this.viec.delete(id);
    this.dong.delete(id);
    delete this.luu[id];
    this.luuLai();
    this.mt.thayDoi();
  }

  async thuLai(id: string): Promise<void> {
    const loi = this.dong.get(id)?.loiCucBo;
    if (loi?.loai === 'tai-len') { this.datDong(id, { loiCucBo: null }); return this.taiLenViec(id); }
    if (loi?.loai === 'tai-ve') { this.datDong(id, { loiCucBo: null }); this.xepTaiVe(id); return; }
    if (loi?.loai === 'ytdlp') { this.datDong(id, { loiCucBo: null }); return this.taiTrenMay(id); }
    await this.mt.api.thuLai(id);
    const v = this.viec.get(id);
    if (v) this.viec.set(id, { ...v, trangThai: 'cho', loi: null, buoc: null, phanTram: null });
    const l = this.luu[id];
    if (l) { l.daBao = false; l.theoDoi = true; this.luuLai(); }
    this.mt.thayDoi();
    this.hoiNgay();
  }

  /** Trạm không tải được link ⇒ yt-dlp tải trên máy này ⇒ tạo việc tệp mới cùng tuỳ chọn ⇒ xoá việc link cũ. */
  async taiTrenMay(id: string): Promise<void> {
    const v = this.viec.get(id);
    if (!v?.url || this.dieuKhien.has(id)) return;
    const dk = new AbortController();
    this.dieuKhien.set(id, dk);
    this.datDong(id, { loiCucBo: null, ytdlp: { phanTram: null, buoc: 'Chuẩn bị' } });
    const tam = path.join(app.getPath('userData'), 'tam', id);
    try {
      const kq = await taiBangYtDlp(v.url, tam, (pt, buoc) => this.datDong(id, { ytdlp: { phanTram: pt, buoc } }), dk.signal);
      this.datDong(id, { ytdlp: { phanTram: null, buoc: 'Tạo việc mới từ tệp vừa tải' } });
      const tenVideo = v.tenVideo ?? kq.tieuDe ?? undefined;
      // Nhạc nền của việc cũ máy chủ không trả lại ⇒ dùng lựa chọn nhạc nền hiện tại.
      await this.taoTuTep([kq.duongDan], { lang: v.lang, goc: v.goc, nhip: v.nhip, nhacNen: this.mt.caiDat().nhacNen, ...(tenVideo ? { tenVideo } : {}) }, true);
      this.dieuKhien.delete(id);
      await this.huy(id).catch(() => { /* việc cũ không xoá được thì để người dùng tự xoá */ });
      if (kq.thieuFfmpeg) this.thongBao('Đã tải trên máy này', 'Không tìm thấy ffmpeg nên chỉ tải được bản ghép sẵn (có thể dưới 1080p).');
    } catch (e) {
      if (!dk.signal.aborted) this.datDong(id, { ytdlp: null, loiCucBo: { loai: 'ytdlp', thongDiep: (e as Error).message } });
      await fsp.rm(tam, { recursive: true, force: true }).catch(() => {});
    } finally {
      this.dieuKhien.delete(id);
      if (this.viec.has(id)) this.datDong(id, { ytdlp: null });
    }
  }

  // ── Tải kết quả về ────────────────────────────────────────────────────────

  xepTaiVe(id: string): void {
    if (this.hangTaiVe.includes(id) || this.dieuKhien.has(id)) return;
    this.hangTaiVe.push(id);
    void this.chayHangTaiVe();
  }

  private async chayHangTaiVe(): Promise<void> {
    if (this.dangTaiVe) return;
    this.dangTaiVe = true;
    try {
      while (this.hangTaiVe.length) {
        const id = this.hangTaiVe.shift()!;
        await this.taiVeViec(id);
      }
    } finally {
      this.dangTaiVe = false;
    }
  }

  private async taiVeViec(id: string): Promise<void> {
    const l = (this.luu[id] ??= {});
    if (l.daTaiVe) return;
    const dk = new AbortController();
    this.dieuKhien.set(id, dk);
    try {
      // Luôn lấy URL MỚI: link ký sẵn sống 1 giờ, việc xong lúc app tắt thì link trong danh sách cũ đã chết.
      const v = (await this.mt.api.chiTiet(id).catch(() => null)) ?? this.viec.get(id);
      if (!v || !v.ketQua.length) throw new LoiTruyen('Máy chủ không còn kết quả của việc này.');
      this.viec.set(id, v);
      const tieuDe = this.tieuDe(v);
      if (!l.thuMuc) {
        await fsp.mkdir(this.thuMucKetQua, { recursive: true });
        const ten = tenKhongTrung(tenThuMucViec(new Date(), tieuDe), (t) => fs.existsSync(path.join(this.thuMucKetQua, t)));
        l.thuMuc = path.join(this.thuMucKetQua, ten);
        this.luuLai();
      }
      await fsp.mkdir(l.thuMuc, { recursive: true });
      const banDo: BanDoTep = (l.banDo ??= {});
      // thong-tin.json tải CUỐI: thư viện chỉ nhận thư mục khi đã đủ tệp.
      const thuTu = [...v.ketQua].sort((a, b) => Number(a.loai === 'thong-tin') - Number(b.loai === 'thong-tin'));
      const daChon = new Set(Object.values(banDo));
      for (const t of thuTu) {
        if (banDo[t.loai] && fs.existsSync(path.join(l.thuMuc, banDo[t.loai]!))) continue;
        if (!banDo[t.loai]) {
          const thuMuc = l.thuMuc;
          banDo[t.loai] = tenKhongTrung(lamSachTen(path.basename(t.ten.replace(/\\/g, '/')), `${t.loai}`), (n) =>
            daChon.has(n) || fs.existsSync(path.join(thuMuc, n)) || fs.existsSync(path.join(thuMuc, `${n}.part`)) || n === TEP_GHI_CHU);
          daChon.add(banDo[t.loai]!);
          this.luuLai();
        }
        await this.taiMotTep(id, t, path.join(l.thuMuc, banDo[t.loai]!), dk.signal);
      }
      const ghiChu: GhiChuApp = { jobId: id, tieuDe, tep: banDo, taiLuc: new Date().toISOString() };
      await fsp.writeFile(path.join(l.thuMuc, TEP_GHI_CHU), JSON.stringify(ghiChu, null, 2), 'utf8');
      l.daTaiVe = true;
      l.chuaBaoTaiVe = true;
      l.daBao = true;
      this.luuLai();
      this.datDong(id, { taiVe: null });
      await this.baoDaTaiVe(id);
      const mucId = path.basename(l.thuMuc);
      this.thongBao('Lồng tiếng xong — đã tải về', tieuDe, () => this.mt.moTrinhPhat(mucId));
    } catch (e) {
      if (!dk.signal.aborted) this.datDong(id, { taiVe: null, loiCucBo: { loai: 'tai-ve', thongDiep: (e as Error).message } });
    } finally {
      this.dieuKhien.delete(id);
      this.mt.thayDoi();
    }
  }

  private async taiMotTep(id: string, t: TepKetQua, dich: string, signal: AbortSignal): Promise<void> {
    const tenHien = path.basename(dich);
    const cb = (da: number, tong: number) => this.datDong(id, { taiVe: { daNhan: da, tong, tep: `Tải ${tenHien}` } });
    try {
      await taiVe(t.url, dich, t.kichThuoc, cb, signal);
    } catch (e) {
      if (!(e instanceof LoiTruyen) || (e.maHttp !== 403 && e.maHttp !== 404) || signal.aborted) throw e;
      // Link hết hạn giữa chừng ⇒ xin link mới, thử đúng một lần nữa.
      const moi = await this.mt.api.chiTiet(id);
      const t2 = moi?.ketQua.find((k) => k.loai === t.loai);
      if (!t2) throw e;
      await taiVe(t2.url, dich, t2.kichThuoc, cb, signal);
    }
  }

  private async baoDaTaiVe(id: string): Promise<void> {
    const l = this.luu[id];
    if (!l?.chuaBaoTaiVe) return;
    try {
      await this.mt.api.daTaiVe(id);
      l.chuaBaoTaiVe = false;
      this.luuLai();
    } catch { /* lần hỏi sau thử lại */ }
  }

  /** Bật "tự tải về" sau khi đã có việc xong ⇒ tải luôn. Cũng dùng cho nút "Tải về" thủ công. */
  taiVeThuCong(id: string): void {
    this.datDong(id, { loiCucBo: null });
    this.xepTaiVe(id);
  }

  thuMucCuaViec(id: string): string | null {
    return this.luu[id]?.thuMuc ?? null;
  }

  // ── Thông báo ─────────────────────────────────────────────────────────────

  private thongBao(tieuDe: string, noiDung: string, khiBam?: () => void): void {
    if (!Notification.isSupported()) return;
    const n = new Notification({ title: tieuDe, body: noiDung.slice(0, 240), silent: false });
    if (khiBam) n.on('click', khiBam);
    n.show();
  }
}

export type { LoaiKetQua };
