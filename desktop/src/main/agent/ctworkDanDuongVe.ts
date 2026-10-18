/**
 * ============================================================
 * CT WORK DẪN ĐƯỜNG — PHẦN THUẦN (đợt 6, 18/10/2026)
 * ============================================================
 *
 * Không I/O, không Electron (test bằng vitest/tsx thuần), dùng chung cho app desktop, CLI và VS Code qua lõi:
 *   • phụ thuộc thẻ (dòng máy sinh "Blocked by (not done): …" của get_issue/issue_guide) ⇒ câu "cần @x làm xong KEY trước";
 *   • hướng dẫn một thẻ: đọc gì (link), các bước, tiêu chí xong, hỏi ai;
 *   • "hôm nay làm gì": xếp việc của tôi + khuyên làm cái nào trước;
 *   • gợi ý SAU KHI XONG việc theo đúng luật workflow dự án (chuyển trạng thái được phép + Done rules, bình luận bằng chứng,
 *     ghi giờ, xin review, báo nhóm…) — mỗi gợi ý ghi đều qua thẻ xem trước của giao diện;
 *   • AGENTS.md của nhóm (trang Docs) gộp với AGENTS.md cục bộ — cục bộ THẮNG khi trùng mục;
 *   • tin theo dõi ("@longbui vừa bình luận NT-12", "NT-12 (chặn thẻ của bạn) đã Done — pull về làm được rồi");
 *   • tổng quan nhóm cho trưởng nhóm, mẫu FPT theo giai đoạn.
 * Chuỗi cho người đọc đi qua `T(vi, en)` (ngôn ngữ giao diện báo lên).
 */
import { T, cauConNgay, docThe, ngayNgan, rutJson, sapViecToi, soNgayToi, tachKhoi, type TheChiTiet, type ViecToi } from './ctworkVe';

const motDong = (s: string): string => s.replace(/\s+/g, ' ').trim();
const cat = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

// ─── Phụ thuộc ───────────────────────────────────────────────────

export interface TheLienQuan { key: string; trangThai: string; xong: boolean; nguoi: string | null }
export interface PhuThuoc {
  /** Thẻ đang CHẶN thẻ này mà chưa xong. */
  chan: TheLienQuan[];
  /** Có liên kết "is blocked by" và tất cả đã xong. */
  chanXongHet: boolean;
  /** Thẻ này đang chặn ai. */
  dangChan: TheLienQuan[];
  cha: TheLienQuan | null;
  /** Thẻ con chưa xong / tổng thẻ con. */
  conChuaXong: TheLienQuan[];
  soCon: number;
  nguoiTao: string | null;
}

/** "LF-5 [In Progress] @longbui" · "LF-5 [Done ✓] nobody" ⇒ thẻ liên quan. */
function docMot(s: string): TheLienQuan | null {
  const m = /([A-Z][A-Z0-9_]*-\d+) \[([^\]]+)\] (@\S+(?: \(AI agent\))?|nobody)/.exec(s.trim());
  if (!m) return null;
  const xong = /✓$/.test(m[2]!);
  return { key: m[1]!, trangThai: m[2]!.replace(/\s*✓$/, ''), xong, nguoi: m[3] === 'nobody' ? null : m[3]!.replace(/ \(AI agent\)$/, '') };
}
const docDs = (s: string | undefined): TheLienQuan[] => (s ? s.split(';').map(docMot).filter((x): x is TheLienQuan => !!x) : []);

/** Dòng máy sinh (ngoài khối untrusted) của get_issue / issue_guide ⇒ phụ thuộc. Máy chủ cũ (chưa có dòng) ⇒ rỗng. */
export function docPhuThuoc(text: string): PhuThuoc {
  const { dau } = tachKhoi(text);
  const dong = (re: RegExp) => re.exec(dau)?.[1];
  const conMoi = /^Subtasks not done \((\d+)\/(\d+)\): (.+)$/m.exec(dau);
  const conXong = /^Subtasks: all (\d+) done$/m.exec(dau);
  return {
    chan: docDs(dong(/^Blocked by \(not done\): (.+)$/m)),
    chanXongHet: /^Blocked by: all done/m.test(dau),
    dangChan: docDs(dong(/^Blocks: (.+)$/m)),
    cha: docDs(dong(/^Parent status: (.+)$/m))[0] ?? null,
    conChuaXong: conMoi ? docDs(conMoi[3]) : [],
    soCon: conMoi ? Number(conMoi[2]) : conXong ? Number(conXong[1]) : 0,
    nguoiTao: /Reporter: (@[^\s·]+)/.exec(dau)?.[1] ?? null,
  };
}

/** Nhánh remote của một thẻ (từ `git branch -r` đã lọc) — lấy cái trùng key đầu tiên. */
export function nhanhCuaThe(dsNhanh: string[], key: string): string | null {
  const re = new RegExp(`(?:^|/)${key}(?:-|$)`, 'i');
  return dsNhanh.map((x) => x.trim().replace(/^\* /, '')).find((x) => x && !x.includes('->') && re.test(x)) ?? null;
}

/**
 * Câu dẫn đường cho phụ thuộc: "cần @user2 làm xong X trước; nộp ở đâu / nhánh nào; pull về rồi mới làm".
 * `nhanh`: map key ⇒ nhánh remote đã thấy (vd `origin/LF-5-erd`).
 */
export function cauPhuThuoc(key: string, p: PhuThuoc, nhanh: Record<string, string | null> = {}): string[] {
  const ra: string[] = [];
  for (const c of p.chan) {
    const ai = c.nguoi ? `${c.nguoi}` : T('(chưa giao ai)', '(unassigned)');
    const nh = nhanh[c.key];
    ra.push(T(
      `⛔ ${key} đang CHỜ ${c.key} [${c.trangThai}] — cần ${ai} làm xong ${c.key} trước. ${nh ? `Phần đó ở nhánh \`${nh}\`: khi họ push xong, chạy \`git fetch origin\` rồi \`git merge ${nh}\` (hoặc pull) về nhánh của bạn rồi mới làm tiếp.` : `Họ làm trên nhánh \`${c.key}-…\` (chưa thấy trên remote): khi họ push + chuyển ${c.key} sang Done, bạn \`git fetch\` rồi merge/pull nhánh đó về mới làm.`}`,
      `⛔ ${key} is WAITING on ${c.key} [${c.trangThai}] — ${ai} must finish ${c.key} first. ${nh ? `Their work is on \`${nh}\`: once they push, run \`git fetch origin\` then \`git merge ${nh}\` (or pull) into your branch before you continue.` : `They work on a \`${c.key}-…\` branch (not on the remote yet): once they push and move ${c.key} to Done, \`git fetch\` and merge/pull it before you start.`}`,
    ));
  }
  if (p.cha && !p.cha.xong && !p.chan.length) {
    ra.push(T(`ℹ Thẻ cha ${p.cha.key} [${p.cha.trangThai}]${p.cha.nguoi ? ` do ${p.cha.nguoi} phụ trách` : ''} — hỏi người đó nếu phạm vi chưa rõ.`,
      `ℹ Parent ${p.cha.key} [${p.cha.trangThai}]${p.cha.nguoi ? ` owned by ${p.cha.nguoi}` : ''} — ask them if the scope is unclear.`));
  }
  if (p.conChuaXong.length) {
    ra.push(T(`⏳ Còn ${p.conChuaXong.length}/${p.soCon} thẻ con chưa xong (${p.conChuaXong.slice(0, 5).map((c) => `${c.key}${c.nguoi ? ` ${c.nguoi}` : ''}`).join(', ')}) — ${key} chỉ Done khi các thẻ con xong.`,
      `⏳ ${p.conChuaXong.length}/${p.soCon} subtasks are not done (${p.conChuaXong.slice(0, 5).map((c) => `${c.key}${c.nguoi ? ` ${c.nguoi}` : ''}`).join(', ')}) — ${key} can only be Done when they are.`));
  }
  if (p.dangChan.some((c) => !c.xong)) {
    const cho = p.dangChan.filter((c) => !c.xong);
    ra.push(T(`👥 ${cho.map((c) => `${c.key}${c.nguoi ? ` (${c.nguoi})` : ''}`).join(', ')} đang CHỜ thẻ này — xong thì push + chuyển trạng thái sớm để họ làm tiếp.`,
      `👥 ${cho.map((c) => `${c.key}${c.nguoi ? ` (${c.nguoi})` : ''}`).join(', ')} ${cho.length === 1 ? 'is' : 'are'} WAITING on this issue — push and move it as soon as you are done so they can continue.`));
  }
  return ra;
}

// ─── Hướng dẫn một thẻ ───────────────────────────────────────────

/** Link đọc trong kết quả `issue_guide`: trang Docs gắn thẻ + web links + link trong app. */
export function docLinkThe(text: string): { trongApp: string | null; docs: Array<{ so: number; ten: string; link: string }>; web: Array<{ ten: string; url: string }> } {
  const trongApp = /— in-app link (\/work\/\S+)/.exec(text)?.[1] ?? null;
  const docs: Array<{ so: number; ten: string; link: string }> = [];
  const d = /Docs pages linked to this issue: ([^\n]+)/.exec(text)?.[1];
  if (d) for (const m of d.matchAll(/#(\d+) "([^"]*)" \([A-Z_]+\) (\/work\/\S+?)(?:;|$)/g)) docs.push({ so: Number(m[1]), ten: m[2]!, link: m[3]! });
  const web: Array<{ ten: string; url: string }> = [];
  const khoiWeb = /Web links on this issue:\n<ctwork-content[^>]*>\n?([\s\S]*?)\n?<\/ctwork-content>/.exec(text)?.[1];
  if (khoiWeb) for (const m of khoiWeb.matchAll(/^- (.+?) <(https?:\/\/[^>\s]+)>/gm)) web.push({ ten: m[1]!, url: m[2]! });
  return { trongApp, docs: docs.slice(0, 8), web: web.slice(0, 8) };
}

/** Definition of Done của dự án (khối sau "Definition of Done of project …:"). */
export function docDod(text: string): string[] {
  const m = /Definition of Done of project [^\n:]+:\n<ctwork-content[^>]*>\n?([\s\S]*?)\n?<\/ctwork-content>/.exec(text);
  return m ? m[1]!.split('\n').map((x) => x.replace(/^\s*[-*]\s*/, '').trim()).filter(Boolean).slice(0, 12) : [];
}

/** Các bước làm: danh sách đánh số trong mô tả (mục "Các bước"/"Steps"/"Hướng dẫn"…), không có thì checklist chưa xong. */
export function rutBuoc(moTa: string, t: TheChiTiet): string[] {
  const dong = moTa.split('\n');
  const ra: string[] = [];
  let trong = false;
  for (const d of dong) {
    const td = /^\s*(#{1,6}\s+|\*\*)(.+?)(\*\*)?\s*:?\s*$/.exec(d);
    if (td) { trong = /bước|buoc|steps?|cách làm|cach lam|hướng dẫn|huong dan|how to|việc cần làm|todo|to do|nhiệm vụ|tasks?/i.test(td[2]!); continue; }
    if (!trong) continue;
    const m = /^\s*(?:\d+[.)]|[-*+])\s+(?:\[[ xX]\]\s*)?(.+)$/.exec(d);
    if (m) ra.push(motDong(m[1]!));
  }
  if (ra.length) return ra.slice(0, 10);
  return t.tuKiem.filter((x) => !x.xong).map((x) => x.chu).slice(0, 10);
}

/** Markdown hướng dẫn MỘT thẻ (đọc gì · các bước · xong khi · hỏi ai · phụ thuộc). `goc` = web gốc cho link tương đối. */
export function veHuongDanThe(text: string, o: { webGoc?: string; nhanh?: Record<string, string | null> } = {}): string | null {
  const t = docThe(text);
  if (!t) return null;
  const p = docPhuThuoc(text);
  const lk = docLinkThe(text);
  const dod = docDod(text);
  const tuyetDoi = (u: string) => (u.startsWith('/') && o.webGoc ? `${o.webGoc.replace(/\/$/, '')}${u}` : u);
  const dong: string[] = [`### ${T('Hướng dẫn', 'Guide')} · ${t.key} — ${motDong(t.tieuDe) || '—'}`];
  dong.push([t.trangThai ? `**${t.trangThai}**` : '', t.nguoiLam ? `👤 ${t.nguoiLam}` : `👤 ${T('chưa giao', 'unassigned')}`, t.han ? `${T('hạn', 'due')} ${ngayNgan(t.han)} (${cauConNgay(soNgayToi(t.han))})` : '', lk.trongApp ? `[${T('mở trên web', 'open on the web')}](${tuyetDoi(lk.trongApp)})` : ''].filter(Boolean).join(' · '));
  const pt = cauPhuThuoc(t.key, p, o.nhanh);
  if (pt.length) dong.push('', `**${T('Phụ thuộc', 'Dependencies')}**`, ...pt.map((x) => `- ${x}`));
  const doc = [...lk.docs.map((d) => `[${cat(d.ten, 70)}](${tuyetDoi(d.link)})`), ...lk.web.map((w) => `[${cat(w.ten, 70)}](${w.url})`)];
  dong.push('', `**1. ${T('Đọc trước', 'Read first')}**`);
  dong.push(doc.length ? doc.map((x) => `- ${x}`).join('\n') : `- ${T('Mô tả thẻ (không có tài liệu gắn kèm) — gõ `/ctwork tai-nguyen` để xem Resources của nhóm.', 'The issue description (no linked docs) — type `/ctwork resources` for the team Resources.')}`);
  const buoc = rutBuoc(t.moTa, t);
  dong.push('', `**2. ${T('Các bước', 'Steps')}**`);
  dong.push(buoc.length ? buoc.map((b, i) => `${i + 1}. ${cat(b, 160)}`).join('\n')
    : `1. ${T(`Bắt đầu: \`/ctwork bat-dau ${t.key}\` (nhánh \`${t.key}-…\` + In Progress)`, `Start: \`/ctwork start ${t.key}\` (branch \`${t.key}-…\` + In Progress)`)}\n2. ${T('Làm theo mô tả, commit có key', 'Do the work, commit with the key')} (\`${t.key}: …\`)\n3. ${T('Xong: `/ctwork xong` — CuongMini gợi ý bình luận bằng chứng + chuyển trạng thái', 'Done: `/ctwork done` — CuongMini suggests the evidence comment + status move')}`);
  dong.push('', `**3. ${T('Xong khi', 'Done when')}**`);
  const xong: string[] = [];
  if (t.tuKiem.length) xong.push(...t.tuKiem.slice(0, 10).map((x) => `[${x.xong ? 'x' : ' '}] ${cat(motDong(x.chu), 140)}`));
  else if (t.tieuChi) xong.push(cat(motDong(t.tieuChi), 300));
  if (dod.length) xong.push(...dod.map((x) => `DoD: ${cat(x, 140)}`));
  if (p.conChuaXong.length) xong.push(T(`${p.conChuaXong.length} thẻ con còn mở phải xong`, `${p.conChuaXong.length} open subtasks must be done`));
  dong.push(xong.length ? xong.map((x) => `- ${x}`).join('\n') : `- ${T('Thẻ chưa có tiêu chí — hỏi người tạo thẻ trước khi làm.', 'No criteria yet — ask the reporter before starting.')}`);
  dong.push('', `**4. ${T('Hỏi ai', 'Who to ask')}**`);
  const hoi = [
    p.nguoiTao ? T(`${p.nguoiTao} (người tạo thẻ) — phạm vi, tiêu chí`, `${p.nguoiTao} (reporter) — scope, criteria`) : '',
    ...p.chan.filter((c) => c.nguoi).map((c) => T(`${c.nguoi} — tiến độ ${c.key} (đang chặn bạn)`, `${c.nguoi} — progress of ${c.key} (blocking you)`)),
    p.cha?.nguoi ? T(`${p.cha.nguoi} — thẻ cha ${p.cha.key}`, `${p.cha.nguoi} — parent ${p.cha.key}`) : '',
    T('Trưởng nhóm / giảng viên — qua Q&A (`/ctwork hoi`) hoặc chat nhóm', 'Team lead / lecturer — via the Q&A log or team chat'),
  ].filter(Boolean);
  dong.push(...hoi.map((x) => `- ${x}`));
  if (t.chuyenDuoc.length) dong.push('', `${T('Chuyển được sang', 'Can move to')}: ${t.chuyenDuoc.join(' · ')}`);
  return dong.join('\n');
}

// ─── Hôm nay làm gì ──────────────────────────────────────────────

export interface ViecHomNay { ds: ViecToi[]; truoc: ViecToi | null; lyDo: string }

/**
 * Xếp việc của tôi + chọn thẻ nên làm TRƯỚC: đang làm dở (không bị chặn) ⇒ quá hạn ⇒ hạn gần ⇒ ưu tiên cao. Thẻ bị chặn
 * xuống cuối (làm chưa được).
 */
export function xepViecHomNay(ds0: ViecToi[]): ViecHomNay {
  const ds = sapViecToi(ds0);
  const lam = ds.filter((v) => !v.blocked);
  const dangDo = lam.find((v) => v.statusCategory === 'IN_PROGRESS');
  const qua = lam.find((v) => v.overdue);
  const truoc = qua ?? dangDo ?? lam[0] ?? null;
  const lyDo = !truoc ? (ds.length ? T('mọi thẻ đều đang bị chặn — hỏi người làm thẻ chặn', 'every issue is blocked — ask the blockers\' owners') : '')
    : truoc === qua ? T('đã quá hạn', 'it is overdue')
      : truoc === dangDo ? T('đang làm dở — làm xong trước khi mở thẻ mới', 'already in progress — finish it before opening a new one')
        : truoc.dueDate ? T(`hạn gần nhất (${ngayNgan(truoc.dueDate)})`, `nearest due date (${ngayNgan(truoc.dueDate)})`) : T('ưu tiên cao nhất', 'highest priority');
  return { ds: [...lam, ...ds.filter((v) => v.blocked)], truoc, lyDo };
}

export function veHomNay(h: ViecHomNay, duAn: string, sprint?: { ten: string; conNgay: number | null } | null): string {
  if (!h.ds.length) return T(`☀ Hôm nay ở ${duAn}: không có thẻ nào giao cho bạn${sprint ? ` (sprint ${sprint.ten})` : ''}. Hỏi trưởng nhóm việc tiếp theo, hoặc xem backlog.`, `☀ Today in ${duAn}: nothing is assigned to you${sprint ? ` (sprint ${sprint.ten})` : ''}. Ask your lead for the next task, or check the backlog.`);
  const dong = [`☀ **${T('Hôm nay', 'Today')}** · ${duAn}${sprint ? ` · ${sprint.ten}${sprint.conNgay !== null ? ` (${cauConNgay(sprint.conNgay)})` : ''}` : ''} · ${h.ds.length} ${T('thẻ của bạn', h.ds.length === 1 ? 'issue of yours' : 'issues of yours')}`];
  if (h.truoc) dong.push(`👉 ${T('Nên làm trước', 'Do first')}: \`${h.truoc.key}\` ${cat(motDong(h.truoc.title), 70)} — ${h.lyDo}.`);
  dong.push('');
  for (const v of h.ds.slice(0, 8)) {
    const han = v.dueDate ? `${T('hạn', 'due')} ${ngayNgan(v.dueDate)}${v.overdue ? ` ⚠ ${T('quá hạn', 'overdue')}` : ''}` : '';
    dong.push(`- \`${v.key}\` ${cat(motDong(v.title), 60)} · **${v.status ?? '?'}**${han ? ` · ${han}` : ''}${v.blocked ? ` · ⛔ ${T('bị chặn', 'blocked')}` : ''}`);
  }
  if (h.ds.length > 8) dong.push(`- … +${h.ds.length - 8}`);
  return dong.join('\n');
}

// ─── Gợi ý sau khi xong việc ─────────────────────────────────────

export interface TinhTrangGit {
  nhanh: string | null;
  /** Commit trên nhánh so với nhánh gốc. */
  soCommit: number;
  /** Commit chưa push (null = chưa có upstream). */
  chuaPush: number | null;
  soFileChuaCommit: number;
  prUrl: string | null;
}

export type LoaiGoiY = 'binhLuan' | 'gio' | 'chuyen' | 'review' | 'chat' | 'qna' | 'raid' | 'push' | 'commit';
export interface GoiYViec { id: string; loai: LoaiGoiY; nhan: string; mo: string; /** Đích chuyển trạng thái (loai 'chuyen'). */ den?: string; /** Ghi lên CT Work (cần xem trước + duyệt). */ ghi: boolean; tool?: string }

const RE_REVIEW = /review|qa|verify|kiểm|duyệt|test/i;
const RE_DONE = /^done$|xong|closed|resolved|hoàn thành/i;

/**
 * Gợi ý thao tác ĐÚNG LUẬT dự án sau khi người dùng (hoặc CuongMini) làm xong một thẻ. Chuyển trạng thái chỉ đưa
 * những trạng thái có trong "Allowed transitions"; Done chỉ khi Tự kiểm đủ và không còn thẻ chặn/thẻ con mở (không
 * thì đưa Review). `coTool` = tên tool server đang có (token chỉ đọc ⇒ không đưa thao tác ghi).
 */
export function goiYSauViec(t: TheChiTiet, p: PhuThuoc, g: TinhTrangGit, coTool: (ten: string) => boolean): GoiYViec[] {
  const ra: GoiYViec[] = [];
  if (g.soFileChuaCommit > 0) ra.push({ id: 'commit', loai: 'commit', ghi: false, nhan: T(`Commit ${g.soFileChuaCommit} file còn dở`, `Commit ${g.soFileChuaCommit} pending file(s)`), mo: `git commit -m "${t.key}: …"` });
  if (g.soCommit > 0 && g.chuaPush !== 0) ra.push({ id: 'push', loai: 'push', ghi: false, nhan: T('Push nhánh lên remote', 'Push the branch'), mo: g.nhanh ? `git push -u origin ${g.nhanh}` : 'git push' });
  if (coTool('comment') && (g.soCommit > 0 || g.prUrl)) ra.push({ id: 'binhLuan', loai: 'binhLuan', ghi: true, tool: 'comment', nhan: T('Bình luận bằng chứng vào thẻ', 'Post an evidence comment'), mo: g.prUrl ? T('kèm link PR + commit', 'with the PR link + commits') : T('soạn từ commit/diff', 'drafted from commits/diff') });
  const tuKiemDu = t.tuKiem.every((x) => x.xong);
  const conChan = p.chan.length > 0 || p.conChuaXong.length > 0;
  if (coTool('transition')) {
    const review = t.chuyenDuoc.find((x) => RE_REVIEW.test(x));
    const done = t.chuyenDuoc.find((x) => RE_DONE.test(x));
    if (review) ra.push({ id: `chuyen:${review}`, loai: 'chuyen', ghi: true, tool: 'transition', den: review, nhan: T(`Chuyển ${t.key} → ${review}`, `Move ${t.key} → ${review}`), mo: T('đúng luồng workflow', 'allowed by the workflow') });
    if (done) {
      const chua = [!tuKiemDu ? T(`Tự kiểm ${t.tuKiem.filter((x) => x.xong).length}/${t.tuKiem.length}`, `self-check ${t.tuKiem.filter((x) => x.xong).length}/${t.tuKiem.length}`) : '', conChan ? T('còn thẻ chặn/thẻ con mở', 'blockers/subtasks still open') : ''].filter(Boolean);
      if (!chua.length || !review) ra.push({ id: `chuyen:${done}`, loai: 'chuyen', ghi: true, tool: 'transition', den: done, nhan: T(`Chuyển ${t.key} → ${done}`, `Move ${t.key} → ${done}`), mo: chua.length ? `⚠ ${T('chưa đạt', 'not met')}: ${chua.join(', ')}` : T('đạt Tự kiểm / Done rules', 'self-check / Done rules met') });
    }
  }
  if (coTool('log_work')) ra.push({ id: 'gio', loai: 'gio', ghi: true, tool: 'log_work', nhan: T('Ghi giờ đã làm', 'Log the time spent'), mo: 'log_work' });
  if (coTool('request_review')) ra.push({ id: 'review', loai: 'review', ghi: true, tool: 'request_review', nhan: T('Xin review (báo người duyệt)', 'Request a review'), mo: 'request_review' });
  if (coTool('chat_post')) ra.push({ id: 'chat', loai: 'chat', ghi: true, tool: 'chat_post', nhan: T('Báo nhóm trên kênh chat', 'Tell the team in chat'), mo: p.dangChan.some((c) => !c.xong) ? T('người đang chờ thẻ này sẽ biết', 'people waiting on this issue get notified') : 'chat_post' });
  if (conChan && coTool('raid_create')) ra.push({ id: 'raid', loai: 'raid', ghi: true, tool: 'raid_create', nhan: T('Ghi rủi ro/phụ thuộc vào RAID', 'Log the risk/dependency in RAID'), mo: 'raid_create' });
  if (coTool('qna_ask')) ra.push({ id: 'qna', loai: 'qna', ghi: true, tool: 'qna_ask', nhan: T('Hỏi giảng viên/trưởng nhóm (Q&A)', 'Ask the lecturer/lead (Q&A)'), mo: 'qna_ask' });
  return ra;
}

/** Tin nhắn chat nhóm soạn sẵn khi xong thẻ (người dùng sửa được trước khi gửi). */
export function soanTinXong(t: TheChiTiet, p: PhuThuoc, g: TinhTrangGit): string {
  const cho = p.dangChan.filter((c) => !c.xong && c.nguoi).map((c) => c.nguoi);
  return T(
    `✅ Mình xong ${t.key} — ${motDong(t.tieuDe)}.${g.nhanh ? ` Nhánh \`${g.nhanh}\`${g.chuaPush === 0 ? ' đã push' : ''}.` : ''}${g.prUrl ? ` PR: ${g.prUrl}` : ''}${cho.length ? ` ${cho.join(' ')} pull về làm tiếp được rồi nhé.` : ''}`,
    `✅ Finished ${t.key} — ${motDong(t.tieuDe)}.${g.nhanh ? ` Branch \`${g.nhanh}\`${g.chuaPush === 0 ? ' is pushed' : ''}.` : ''}${g.prUrl ? ` PR: ${g.prUrl}` : ''}${cho.length ? ` ${cho.join(' ')} you can pull and continue now.` : ''}`,
  );
}

// ─── AGENTS.md của nhóm (trang Docs) ─────────────────────────────

export interface TrangDocs { page: number; title: string; status?: string | null; updatedAt?: string | null }

/** Trang có tiêu đề bắt đầu "AGENTS.md" (không phân biệt hoa thường) — ưu tiên trang không lưu trữ. */
export function timTrangAgents(ds: TrangDocs[]): TrangDocs | null {
  const hop = ds.filter((p) => /^\s*agents\.md\b/i.test(p.title));
  return hop.find((p) => !/archiv/i.test(String(p.status ?? ''))) ?? hop[0] ?? null;
}

/** Trang tổng quan (khi nhóm chưa có trang AGENTS.md). */
export function timTrangTongQuan(ds: TrangDocs[]): TrangDocs | null {
  return ds.find((p) => /tổng quan|tong quan|overview|giới thiệu|gioi thieu|readme|project charter|vision|mô tả dự án|about/i.test(p.title) && !/archiv/i.test(String(p.status ?? ''))) ?? null;
}

export function docDsTrang(text: string): TrangDocs[] {
  const j = rutJson(text);
  if (!Array.isArray(j)) return [];
  return j.map((x) => {
    const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    return { page: Number(o.page), title: String(o.title ?? ''), status: typeof o.status === 'string' ? o.status : null, updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : null };
  }).filter((p) => Number.isInteger(p.page) && p.page > 0);
}

/** Nội dung trang (`get_page`): khối ```markdown ĐẦU TIÊN nếu có, không thì cả trang (bỏ dòng "Page X-DOC-n:"). */
export function rutNoiDungAgents(text: string): string {
  const { khoi, dau } = tachKhoi(text);
  const than = (khoi[0] ?? text.replace(/^Page [^\n]*:\n?/, '')).trim() || dau;
  return (khoiMarkdownDau(than) ?? than).trim();
}

/**
 * Khối ```markdown ĐẦU TIÊN — tính cả khối code LỒNG bên trong (QA đợt 6: AGENTS.md thật hay có ```bash … ``` ở giữa; trang
 * Docs xuất ra markdown giữ nguyên các rào đó (`docMarkdown.ts › blockMd`), regex không tham lam dừng ở rào ``` đầu tiên
 * ⇒ mất mọi mục sau khối lệnh). Rào mở có ngôn ngữ (```bash) ⇒ sâu thêm một tầng; rào trơn ``` ⇒ đóng tầng trong cùng.
 */
function khoiMarkdownDau(than: string): string | null {
  const dong = than.split('\n');
  const dau = dong.findIndex((d) => /^\s*```(?:markdown|md)\b/i.test(d));
  if (dau < 0) return null;
  let sau = 0;
  for (let i = dau + 1; i < dong.length; i++) {
    const d = dong[i]!.trim();
    if (/^```\s*$/.test(d)) {
      if (sau === 0) return dong.slice(dau + 1, i).join('\n');
      sau--;
    } else if (/^```\S/.test(d)) sau++;
  }
  return dong.slice(dau + 1).join('\n');
}

const chuanTieuDe = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Tách theo tiêu đề `#`/`##`/`###`; phần trước tiêu đề đầu là mục "" (mở đầu). */
function tachMucMd(md: string): Array<{ tieuDe: string; than: string }> {
  const ra: Array<{ tieuDe: string; than: string }> = [];
  let cur = { tieuDe: '', than: '' };
  for (const d of md.split('\n')) {
    const h = /^#{1,3}\s+(.+?)\s*#*\s*$/.exec(d);
    if (h) { if (cur.than.trim() || cur.tieuDe) ra.push(cur); cur = { tieuDe: h[1]!, than: `${d}\n` }; } else cur.than += `${d}\n`;
  }
  if (cur.than.trim() || cur.tieuDe) ra.push(cur);
  return ra;
}

/**
 * Gộp AGENTS.md CỤC BỘ với AGENTS.md của NHÓM (trang Docs): cục bộ THẮNG khi trùng mục (cùng tiêu đề, so không dấu);
 * mục chỉ có ở trang nhóm nối sau, dưới một tiêu đề nói rõ nguồn. Phần mở đầu của trang nhóm bỏ khi cục bộ có mở đầu.
 */
export function gopGhiChu(cucBo: string | null, nhom: string, nguon: string): string {
  const nhomSach = nhom.trim();
  if (!nhomSach) return cucBo ?? '';
  const dau = `${T(`## Hướng dẫn của NHÓM (CT Work · ${nguon})`, `## TEAM instructions (CT Work · ${nguon})`)}\n${T('_Chỉ dẫn do nhóm viết trong CT Work — như AGENTS.md của repo; phần cục bộ ở trên thắng khi trùng mục._', '_Written by the team in CT Work — like a repo AGENTS.md; the local file above wins on overlapping sections._')}\n\n`;
  if (!cucBo?.trim()) return `${dau}${nhomSach}`;
  const coCucBo = new Set(tachMucMd(cucBo).map((m) => chuanTieuDe(m.tieuDe)).filter(Boolean));
  const coMoDau = tachMucMd(cucBo).some((m) => !m.tieuDe && m.than.trim());
  const con = tachMucMd(nhomSach).filter((m) => (m.tieuDe ? !coCucBo.has(chuanTieuDe(m.tieuDe)) : !coMoDau));
  if (!con.length) return cucBo;
  return `${cucBo.trimEnd()}\n\n${dau}${con.map((m) => m.than.trimEnd()).join('\n\n')}`;
}

// ─── Theo dõi ────────────────────────────────────────────────────

export interface CapNhat {
  events: Array<{ id: number; type: string; issue: string | null; title: string | null; excerpt: string | null; reply?: boolean; by: string | null }>;
  unblocked: Array<{ issue: string; blocker: string; blockerTitle: string; by: string | null }>;
  lastId: number;
}

export function docCapNhat(text: string): CapNhat | null {
  const j = rutJson(text) as Partial<CapNhat> | null;
  if (!j || typeof j !== 'object' || typeof j.lastId !== 'number') return null;
  return { events: Array.isArray(j.events) ? j.events : [], unblocked: Array.isArray(j.unblocked) ? j.unblocked : [], lastId: j.lastId };
}

/** Một dòng báo nhẹ cho mỗi sự kiện (giao diện in mờ). */
export function tinTheoDoi(c: CapNhat): string[] {
  const ra: string[] = [];
  for (const e of c.events.slice(0, 6)) {
    const the = e.issue ?? '?';
    const ai = e.by ?? T('ai đó', 'someone');
    if (e.type === 'WORK_ASSIGN') ra.push(T(`📌 Bạn vừa được giao ${the}${e.title ? ` — ${cat(e.title, 60)}` : ''}`, `📌 You were just assigned ${the}${e.title ? ` — ${cat(e.title, 60)}` : ''}`));
    else if (e.type === 'WORK_MENTION') ra.push(T(`💬 ${ai} vừa nhắc bạn trong ${the}`, `💬 ${ai} mentioned you in ${the}`));
    else if (e.type === 'WORK_COMMENT') ra.push(T(`💬 ${ai} vừa ${e.reply ? 'trả lời bạn ở' : 'bình luận'} ${the}`, `💬 ${ai} ${e.reply ? 'replied to you on' : 'commented on'} ${the}`));
    else if (e.type === 'WORK_ALERT') ra.push(`⚑ ${the}: ${cat(e.excerpt ?? T('cần bạn xem', 'needs your attention'), 80)}`);
  }
  if (c.events.length > 6) ra.push(T(`… +${c.events.length - 6} cập nhật khác`, `… +${c.events.length - 6} more updates`));
  for (const u of c.unblocked.slice(0, 4)) {
    ra.push(T(`✅ ${u.blocker} (chặn thẻ ${u.issue} của bạn) đã Done${u.by ? ` — ${u.by}` : ''} — pull về làm được rồi`, `✅ ${u.blocker} (blocking your ${u.issue}) is Done${u.by ? ` — ${u.by}` : ''} — pull and continue`));
  }
  return ra;
}

// ─── Trưởng nhóm: tổng quan ──────────────────────────────────────

export interface TheNhom { key: string; title: string; status: string | null; assignee: string | null; blocked: boolean; dueDate?: string | null; /** Đã biết quá hạn (search JQL `due < startOfDay()`). */ quaHan?: boolean }

/** Tổng quan tiến độ cho trưởng nhóm: mỗi người bao nhiêu thẻ mở / bị chặn / quá hạn, thẻ chưa giao. */
export function veTongQuanNhom(ds: TheNhom[], duAn: string, homNay = new Date()): string {
  if (!ds.length) return T(`${duAn}: không có thẻ nào đang mở.`, `${duAn}: no open issues.`);
  const nguoi = new Map<string, { mo: number; chan: number; qua: string[] }>();
  const chuaGiao: TheNhom[] = [];
  for (const t of ds) {
    if (!t.assignee) { chuaGiao.push(t); continue; }
    const n = nguoi.get(t.assignee) ?? { mo: 0, chan: 0, qua: [] };
    n.mo += 1;
    if (t.blocked) n.chan += 1;
    if (t.quaHan || (t.dueDate && (soNgayToi(t.dueDate, homNay) ?? 0) < 0)) n.qua.push(t.key);
    nguoi.set(t.assignee, n);
  }
  const dong = [`**${T('Tổng quan nhóm', 'Team overview')}** · ${duAn} · ${ds.length} ${T('thẻ mở', 'open issues')}`, ''];
  for (const [ai, n] of [...nguoi.entries()].sort((a, b) => b[1].qua.length - a[1].qua.length || b[1].mo - a[1].mo)) {
    dong.push(`- @${ai.replace(/^@/, '')}: ${n.mo} ${T('mở', 'open')}${n.chan ? ` · ⛔ ${n.chan} ${T('bị chặn', 'blocked')}` : ''}${n.qua.length ? ` · ⚠ ${T('quá hạn', 'overdue')}: ${n.qua.slice(0, 4).join(', ')}` : ''}`);
  }
  if (chuaGiao.length) dong.push(`- ${T('Chưa giao', 'Unassigned')}: ${chuaGiao.length} (${chuaGiao.slice(0, 6).map((t) => t.key).join(', ')})`);
  const tai = [...nguoi.values()].map((n) => n.mo);
  if (tai.length > 1 && Math.max(...tai) >= 2 * Math.max(1, Math.min(...tai))) dong.push('', T('💡 Tải lệch: chuyển bớt thẻ của người nhiều nhất sang người ít nhất (gợi ý — bạn quyết).', '💡 Uneven load: move some issues from the busiest member to the least busy one (a suggestion — your call).'));
  if (chuaGiao.length) dong.push(T(`💡 ${chuaGiao.length} thẻ chưa giao — giao trước khi sprint chạy.`, `💡 ${chuaGiao.length} unassigned issues — assign them before the sprint runs.`));
  return dong.join('\n');
}

/** Tin nhắc người trễ (trưởng nhóm duyệt rồi mới gửi). */
export function soanTinNhacTre(ds: TheNhom[], duAn: string, homNay = new Date()): string | null {
  const tre = ds.filter((t) => t.assignee && (t.quaHan || (t.dueDate && (soNgayToi(t.dueDate, homNay) ?? 0) < 0)));
  if (!tre.length) return null;
  const theo = new Map<string, string[]>();
  for (const t of tre) theo.set(t.assignee!, [...(theo.get(t.assignee!) ?? []), t.key]);
  return T(
    `⏰ Nhắc nhẹ ${duAn}: ${[...theo.entries()].map(([ai, ks]) => `@${ai.replace(/^@/, '')} (${ks.join(', ')})`).join(' · ')} đang quá hạn. Cần hỗ trợ gì cứ báo nhóm nhé!`,
    `⏰ Friendly reminder for ${duAn}: ${[...theo.entries()].map(([ai, ks]) => `@${ai.replace(/^@/, '')} (${ks.join(', ')})`).join(' · ')} ${tre.length === 1 ? 'is' : 'are'} overdue. Shout if you need help!`,
  );
}

// ─── Mẫu FPT theo giai đoạn ──────────────────────────────────────

export interface MauFpt { ten: string; tool: string; cauHoi: string }

/**
 * Mẫu FPT nên điền LÚC NÀY theo loại dự án (template) + tiến độ sprint (tuần thứ mấy / tổng). Không biết loại ⇒ bộ chung.
 */
export function goiYMauFpt(o: { template?: string | null; kind?: string | null; tienDo?: number | null; tool: (ten: string) => boolean }): MauFpt[] {
  const tpl = String(o.template ?? o.kind ?? '').toUpperCase();
  const td = o.tienDo ?? 0.5;
  const ra: MauFpt[] = [];
  const them = (ten: string, tool: string, cauHoi: string) => { if (o.tool(tool)) ra.push({ ten, tool, cauHoi }); };
  them(T('Biên bản họp tuần', 'Weekly meeting minutes'), 'meeting_minutes_propose', T('Soạn biên bản cuộc họp gần nhất của nhóm (meeting_minutes_propose), cho mình xem trước.', 'Draft the minutes of our latest meeting (meeting_minutes_propose) and show me first.'));
  them(T('Báo cáo tuần', 'Weekly report'), 'weekly_report_generate', T('Tạo báo cáo tuần này và tóm tắt những gì còn thiếu.', 'Generate this week\'s report and summarise what is missing.'));
  if (/SWR|SRS|CAPSTONE|SWP|SCHOOL/.test(tpl) || td < 0.5) {
    them(T('SRS / yêu cầu (SWR302)', 'SRS / requirements (SWR302)'), 'srs_get', T('Đọc SRS hiện có (srs_get), chỉ ra use case/màn hình còn thiếu và đề xuất bổ sung.', 'Read the current SRS (srs_get), list missing use cases/screens and propose additions.'));
    them(T('RTM — truy vết yêu cầu', 'RTM — traceability'), 'rtm_get', T('Đọc RTM (rtm_get) và chỉ yêu cầu nào chưa có thẻ/test case.', 'Read the RTM (rtm_get) and list requirements without issues/test cases.'));
  }
  if (/SWT|TEST|SWP|CAPSTONE|SCHOOL/.test(tpl) || td >= 0.5) {
    them(T('Report 5.1 — Unit test', 'Report 5.1 — unit test'), 'fpt_unit_suggest', T('Gợi ý test case Report 5.1 cho hàm mình vừa viết (fpt_unit_suggest), xem trước rồi mới thêm.', 'Suggest Report 5.1 test cases for the function I just wrote (fpt_unit_suggest); preview before adding.'));
    them(T('Report 5.2 / 5.3 — Integration / System', 'Report 5.2 / 5.3 — integration / system'), 'fpt_it_list', T('Xem Report 5.2/5.3 (fpt_it_list) và chỉ module nào chưa có vòng kiểm.', 'Check Reports 5.2/5.3 (fpt_it_list) and list modules with no test round yet.'));
  }
  if (td >= 0.8) them(T('Báo cáo tổng (final report)', 'Final report'), 'final_report_assemble', T('Ráp báo cáo tổng (final_report_assemble) và liệt kê phần còn trống.', 'Assemble the final report (final_report_assemble) and list empty parts.'));
  return ra;
}
