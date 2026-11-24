/**
 * Gom số liệu TIẾN ĐỘ & ĐÁNH GIÁ của CHÍNH người hỏi (24/11/2026) — chỉ ĐỌC dữ liệu sẵn có, không thêm bảng theo dõi nào:
 *   - CT Work: việc được giao cho người này CÓ HẠN (lá — không đếm việc cha), gom theo không gian (JPD113+123, FER202,
 *     Lộ trình…): xong / tới hạn / quá hạn / xong tuần này / 7 ngày tới.
 *   - /hoc-tap: việc học theo môn (NhiemVuHoc) + điểm AI chấm + nguy cơ trượt mới nhất (RuiRoHocNgay).
 *   - Khoá học: bài đã học xong (LessonProgress) của các khoá đang học gần đây.
 *   - Code Lab: lượt nộp 14 ngày theo track. Exam Room: lượt thi đã nộp 30 ngày (% điểm).
 *   - Giờ học: worklog CT Work + thời lượng việc học đã nộp + việc cá nhân đã xong (theo tuần, giờ VN).
 * Chấm điểm/khuyên ở `tienDo.ts` (thuần, có test). Mọi truy vấn lọc `userId` = người hỏi — không bao giờ đọc người khác.
 */
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { dauTuanVN, ngayVN, danhGiaMon, chuoiNgay, veBaoCao, deXuat, type MonTienDo, type TongHop, type Diem, type CodeLabTongHop } from './tienDo.js';

const WEB = () => (config.frontendUrl || 'https://cuongthai.com').replace(/\/+$/, '');
const NGAY = 86_400_000;


export async function tinhTienDo(userId: number, bayGio = new Date()): Promise<TongHop & { baoCao: string; deXuat: string[] }> {
  const homNay = ngayVN(bayGio);
  const tuanNay = dauTuanVN(bayGio);
  const tuanTruoc = dauTuanVN(bayGio.getTime() - 7 * NGAY);
  const cuoiNgay = new Date(Date.parse(`${homNay}T23:59:59.999Z`) - 7 * 3_600_000);
  const tu60 = new Date(bayGio.getTime() - 60 * NGAY);
  const tuan = (d: Date | null | undefined) => (d ? dauTuanVN(d) : null);
  const ngayHoc = new Set<string>();
  const gio: Record<string, number> = {};
  const congGio = (d: Date | null | undefined, phut: number) => { const w = tuan(d); if (w) gio[w] = (gio[w] ?? 0) + phut / 60; };

  const [issues, nhiemVu, ruiRo, caNhan, tienDoBai, nop, thi, worklog] = await Promise.all([
    prisma.workIssue.findMany({
      where: { assigneeId: userId, deletedAt: null, dueDate: { not: null, gte: new Date(bayGio.getTime() - 150 * NGAY), lte: new Date(bayGio.getTime() + 45 * NGAY) }, children: { none: {} }, project: { archivedAt: null, deletedAt: null } },
      select: { title: true, number: true, dueDate: true, resolvedAt: true, status: { select: { category: true } }, project: { select: { key: true, workspace: { select: { slug: true, name: true } } } } },
      take: 3000,
    }),
    prisma.nhiemVuHoc.findMany({
      where: { userId, hanChot: { gte: new Date(bayGio.getTime() - 150 * NGAY) } },
      select: { monId: true, tieuDe: true, hanChot: true, trangThai: true, diem: true, nopLuc: true, chamLuc: true, thoiLuongPhut: true, mon: { select: { maMon: true, ten: true } } },
      take: 3000,
    }),
    prisma.ruiRoHocNgay.findMany({ where: { userId }, orderBy: { ngay: 'desc' }, take: 50, select: { monId: true, tyLe: true } }),
    prisma.viecCaNhan.findMany({ where: { userId, xongLuc: { gte: tu60 } }, select: { xongLuc: true, thoiLuongPhut: true } }),
    prisma.lessonProgress.findMany({
      where: { enrollment: { userId }, isCompleted: true, completedAt: { gte: tu60 } },
      select: { completedAt: true, enrollment: { select: { course: { select: { id: true, slug: true, title: true } } } } },
      take: 5000,
    }),
    prisma.codeSubmission.findMany({
      where: { userId, createdAt: { gte: new Date(bayGio.getTime() - 14 * NGAY) } },
      select: { accepted: true, createdAt: true, mode: true, exercise: { select: { track: { select: { slug: true, name: true } } } } },
      take: 3000,
    }),
    prisma.examAttempt.findMany({
      where: { userId, submittedAt: { gte: new Date(bayGio.getTime() - 30 * NGAY) } },
      select: { id: true, score: true, maxScore: true, submittedAt: true, exam: { select: { title: true } } },
      take: 300,
    }),
    prisma.workWorklog.findMany({ where: { userId, startedAt: { gte: tu60 } }, select: { minutes: true, startedAt: true } }),
  ]);

  // ── CT Work theo không gian ──
  const theoKG = new Map<string, MonTienDo>();
  for (const i of issues) {
    const ws = i.project.workspace;
    const m = theoKG.get(ws.slug) ?? { ma: `ctwork:${ws.slug}`, ten: ws.name, nguon: 'ctwork' as const, tong: 0, xong: 0, toiHan: 0, xongTrongHan: 0, quaHan: 0, xongTuanNay: 0, xongTuanTruoc: 0, sapToi7Ngay: 0, link: `${WEB()}/work/${ws.slug}`, viecQuaHan: [] };
    const xong = i.status.category === 'DONE';
    const han = i.dueDate!;
    m.tong++; if (xong) m.xong++;
    if (han <= cuoiNgay) { m.toiHan++; if (xong) m.xongTrongHan++; else { m.quaHan++; if (m.viecQuaHan!.length < 5) m.viecQuaHan!.push({ ten: `${i.project.key}-${i.number} ${i.title}`, han: ngayVN(han), link: `${WEB()}/work/${ws.slug}/${i.project.key}/issue/${i.number}` }); } }
    else if (han.getTime() - cuoiNgay.getTime() <= 7 * NGAY && !xong) m.sapToi7Ngay++;
    if (xong && i.resolvedAt) {
      const w = tuan(i.resolvedAt);
      if (w === tuanNay) m.xongTuanNay++; else if (w === tuanTruoc) m.xongTuanTruoc++;
      if (i.resolvedAt >= tu60) ngayHoc.add(ngayVN(i.resolvedAt));
    }
    theoKG.set(ws.slug, m);
  }

  // ── /hoc-tap theo môn ──
  const rr = new Map<number, number>();
  for (const r of ruiRo) if (r.monId != null && r.tyLe != null && !rr.has(r.monId)) rr.set(r.monId, Math.round(Number(r.tyLe)));
  const theoMon = new Map<number, MonTienDo & { _dNay: number[]; _dTruoc: number[] }>();
  for (const v of nhiemVu) {
    const m = theoMon.get(v.monId) ?? { ma: `hoc_tap:${v.mon.maMon}`, ten: `${v.mon.maMon} · ${v.mon.ten}`, nguon: 'hoc_tap' as const, tong: 0, xong: 0, toiHan: 0, xongTrongHan: 0, quaHan: 0, xongTuanNay: 0, xongTuanTruoc: 0, sapToi7Ngay: 0, ruiRoTruot: rr.get(v.monId) ?? null, link: `${WEB()}/work/hoc-tap`, viecQuaHan: [], _dNay: [], _dTruoc: [] };
    const xong = v.trangThai === 'DAT';
    m.tong++; if (xong) m.xong++;
    if (v.hanChot <= cuoiNgay) { m.toiHan++; if (xong) m.xongTrongHan++; else if (v.trangThai !== 'CHO_CHAM' && v.trangThai !== 'VAN_DAP') { m.quaHan++; if (m.viecQuaHan!.length < 5) m.viecQuaHan!.push({ ten: v.tieuDe, han: ngayVN(v.hanChot) }); } }
    else if (v.hanChot.getTime() - cuoiNgay.getTime() <= 7 * NGAY && !xong) m.sapToi7Ngay++;
    const wCham = tuan(v.chamLuc);
    if (xong && wCham === tuanNay) m.xongTuanNay++; else if (xong && wCham === tuanTruoc) m.xongTuanTruoc++;
    if (v.diem != null && wCham === tuanNay) m._dNay.push(v.diem); else if (v.diem != null && wCham === tuanTruoc) m._dTruoc.push(v.diem);
    if (v.nopLuc) { ngayHoc.add(ngayVN(v.nopLuc)); congGio(v.nopLuc, v.thoiLuongPhut); }
    theoMon.set(v.monId, m);
  }
  const tb = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);

  // ── Khoá học: bài học xong theo khoá (khoá có hoạt động 60 ngày) ──
  const theoKhoa = new Map<number, { slug: string; ten: string; nay: number; truoc: number; tong60: number }>();
  for (const p of tienDoBai) {
    const c = p.enrollment.course;
    const k = theoKhoa.get(c.id) ?? { slug: c.slug, ten: c.title.split('|||').pop()!.trim(), nay: 0, truoc: 0, tong60: 0 };
    k.tong60++;
    const w = tuan(p.completedAt); if (w === tuanNay) k.nay++; else if (w === tuanTruoc) k.truoc++;
    if (p.completedAt) ngayHoc.add(ngayVN(p.completedAt));
    theoKhoa.set(c.id, k);
  }
  const khoaIds = [...theoKhoa.keys()];
  const [tongBai, daXong] = await Promise.all([
    khoaIds.length ? prisma.lesson.groupBy({ by: ['sectionId'], where: { section: { courseId: { in: khoaIds } } }, _count: { _all: true } }) : Promise.resolve([]),
    khoaIds.length ? prisma.lessonProgress.findMany({ where: { enrollment: { userId, courseId: { in: khoaIds } }, isCompleted: true }, select: { enrollment: { select: { courseId: true } } } }) : Promise.resolve([]),
  ]);
  const secKhoa = khoaIds.length ? await prisma.courseSection.findMany({ where: { courseId: { in: khoaIds } }, select: { id: true, courseId: true } }) : [];
  const khoaCuaSec = new Map(secKhoa.map((s) => [s.id, s.courseId]));
  const tongTheoKhoa = new Map<number, number>();
  for (const g of tongBai as Array<{ sectionId: number; _count: { _all: number } }>) { const c = khoaCuaSec.get(g.sectionId); if (c) tongTheoKhoa.set(c, (tongTheoKhoa.get(c) ?? 0) + g._count._all); }
  const xongTheoKhoa = new Map<number, number>();
  for (const d of daXong) xongTheoKhoa.set(d.enrollment.courseId, (xongTheoKhoa.get(d.enrollment.courseId) ?? 0) + 1);

  const mon: MonTienDo[] = [
    ...theoKG.values(),
    ...[...theoMon.values()].map(({ _dNay, _dTruoc, ...m }) => ({ ...m, diemTBTuanNay: tb(_dNay), diemTBTuanTruoc: tb(_dTruoc) })),
    ...[...theoKhoa.entries()].map(([id, k]) => ({
      ma: `khoa:${k.slug}`, ten: k.ten, nguon: 'khoa_hoc' as const, tong: tongTheoKhoa.get(id) ?? 0, xong: xongTheoKhoa.get(id) ?? 0,
      toiHan: 0, xongTrongHan: 0, quaHan: 0, xongTuanNay: k.nay, xongTuanTruoc: k.truoc, sapToi7Ngay: 0, link: `${WEB()}/courses/${k.slug}/learn`,
    })),
  ];

  // ── Code Lab ──
  const theoTrack = new Map<string, CodeLabTongHop>();
  for (const s of nop) {
    const tr = s.exercise.track;
    if (!tr) continue;
    const c = theoTrack.get(tr.slug) ?? { track: tr.name || tr.slug, nop: 0, dat: 0, link: `${WEB()}/code-lab/${tr.slug}` };
    c.nop++; if (s.accepted) c.dat++;
    theoTrack.set(tr.slug, c);
    ngayHoc.add(ngayVN(s.createdAt));
  }

  // ── Exam Room ──
  const diemThi: Diem[] = [];
  const thiTuan: Record<string, number[]> = {};
  for (const a of thi) {
    const d = Number(a.score ?? 0), t = Number(a.maxScore ?? 0);
    if (!a.submittedAt || t <= 0) continue;
    diemThi.push({ ten: a.exam.title, diem: d, toiDa: t, link: `${WEB()}/exam/attempts/${a.id}` });
    const w = tuan(a.submittedAt)!; (thiTuan[w] ??= []).push((d / t) * 100);
    ngayHoc.add(ngayVN(a.submittedAt));
  }
  const tbThi = (w: string) => { const a = thiTuan[w]; return a?.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : null; };

  for (const w of worklog) { congGio(w.startedAt, w.minutes); ngayHoc.add(ngayVN(w.startedAt)); }
  for (const c of caNhan) { congGio(c.xongLuc, c.thoiLuongPhut); if (c.xongLuc) ngayHoc.add(ngayVN(c.xongLuc)); }

  const ngayTuanNay = [...ngayHoc].filter((d) => d >= tuanNay && d <= homNay).length;
  const t: TongHop = {
    homNay,
    mon: mon.filter((m) => m.tong > 0).map(danhGiaMon).sort((a, b) => b.quaHan - a.quaHan || b.sapToi7Ngay - a.sapToi7Ngay),
    codeLab: [...theoTrack.values()].sort((a, b) => b.nop - a.nop),
    thi: diemThi, thiTuanNay: tbThi(tuanNay), thiTuanTruoc: tbThi(tuanTruoc),
    gioTuanNay: gio[tuanNay] ?? 0, gioTuanTruoc: gio[tuanTruoc] ?? 0,
    chuoi: chuoiNgay(ngayHoc, homNay), ngayHocTuanNay: ngayTuanNay,
  };

  return { ...t, baoCao: veBaoCao(t), deXuat: deXuat(t) };
}
