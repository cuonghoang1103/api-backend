/**
 * ĐỒNG BỘ GIT trên THANH TRẠNG THÁI của VS Code (28/10/2026, đợt 2 CuongMini ↔ CT Work code).
 *
 * Chạy ngay trong tiến trình extension bằng ĐÚNG lõi thuần `packages/cuongmini-core/src/gitDongBo.ts` (CLI và app
 * desktop dùng chung) — không phụ thuộc app desktop có mở hay không, có cập nhật hay chưa.
 *
 *   • `$(cloud-download) 3↓ 1↑` · `$(check)` · `$(git-compare) phân kỳ` — bấm để xem chi tiết + kéo về.
 *   • Fetch lặng lẽ lúc mở, mỗi 5 phút và khi quay lại cửa sổ (≥ 2 phút từ lần trước); mất mạng thì so với lần trước.
 *   • Nhánh đang SAU GitHub ⇒ một thông báo "pull không?" (mỗi mức sau chỉ hỏi một lần trong phiên).
 *   • ⛔ Kéo về chỉ khi người dùng bấm: mặc định fast-forward; rebase/merge hỏi lại bằng hộp xác nhận. Không bao giờ ép.
 *   • Tắt: cài đặt `cuongthai.dongBoGit` = false.
 */
import * as vscode from 'vscode';
import { keoVe, kiemDongBo, veDongBo, dsCommitMoi, type CachKeo, type MucTieuKeo, type TrangThaiDongBo } from '../../cuongmini-core/src/gitDongBo';

const MOI_LAN_FETCH_MS = 5 * 60_000;

export class ThanhDongBo implements vscode.Disposable {
  private muc: vscode.StatusBarItem;
  private tt: TrangThaiDongBo | null = null;
  private lanFetch = 0;
  private dangKiem = false;
  private daHoi = new Set<string>();
  private rac: vscode.Disposable[] = [];

  constructor(private nhoCuongMini: (cauHoi: string) => void) {
    this.muc = vscode.window.createStatusBarItem('cuongthai.dongBoGit', vscode.StatusBarAlignment.Left, 40);
    this.muc.name = 'CuongMini — đồng bộ git';
    this.muc.command = 'cuongthai.dongBoGit';
    this.rac.push(
      this.muc,
      vscode.commands.registerCommand('cuongthai.dongBoGit', () => this.moMenu()),
      vscode.window.onDidChangeWindowState((s) => { if (s.focused) void this.kiem(Date.now() - this.lanFetch > 2 * 60_000); }),
      vscode.workspace.onDidChangeConfiguration((e) => { if (e.affectsConfiguration('cuongthai.dongBoGit')) void this.kiem(true); }),
      vscode.workspace.onDidChangeWorkspaceFolders(() => void this.kiem(true)),
    );
    const g = this.thuMuc();
    if (g) {
      // HEAD đổi (đổi nhánh, commit, pull ở terminal) ⇒ đọc lại, không fetch.
      const w = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(g), '.git/{HEAD,FETCH_HEAD,ORIG_HEAD,refs/heads/**}'));
      const doc = () => void this.kiem(false);
      w.onDidChange(doc); w.onDidCreate(doc); w.onDidDelete(doc);
      this.rac.push(w);
    }
    const h = setInterval(() => void this.kiem(true), MOI_LAN_FETCH_MS);
    this.rac.push({ dispose: () => clearInterval(h) });
    setTimeout(() => void this.kiem(true), 4000);
  }

  dispose(): void { for (const d of this.rac) d.dispose(); }

  private bat(): boolean {
    return vscode.workspace.isTrusted && vscode.workspace.getConfiguration('cuongthai').get<boolean>('dongBoGit', true);
  }

  private thuMuc(): string | null { return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null; }

  async kiem(fetch: boolean): Promise<void> {
    const g = this.thuMuc();
    if (!g || !this.bat()) { this.muc.hide(); return; }
    if (this.dangKiem) return;
    this.dangKiem = true;
    try {
      this.tt = await kiemDongBo(g, { fetch });
      if (fetch) this.lanFetch = Date.now();
      this.ve();
      if (fetch) this.hoiNeuSau();
    } finally {
      this.dangKiem = false;
    }
  }

  private ve(): void {
    const t = this.tt;
    if (!t?.laKho) { this.muc.hide(); return; }
    const up = t.soVoiUpstream;
    const nh = t.nhanh ?? 'HEAD';
    let chu = `$(check) ${nh}`;
    if (t.dangDo) chu = `$(warning) ${nh} · ${t.dangDo}`;
    else if (t.phanKy && up) chu = `$(git-compare) ${nh} ${up.sau}↓ ${up.truoc}↑`;
    else if (up && (up.sau || up.truoc)) chu = `$(${up.sau ? 'cloud-download' : 'cloud-upload'}) ${nh}${up.sau ? ` ${up.sau}↓` : ''}${up.truoc ? ` ${up.truoc}↑` : ''}`;
    else if (!t.upstream && t.remote.length) chu = `$(cloud-upload) ${nh} · chưa đẩy`;
    if (!t.fetch.ok && t.fetch.loi && t.fetch.loi !== 'khongCoRemote') chu += ' $(debug-disconnect)';
    this.muc.text = chu;
    const tb = veDongBo(t, 'vi');
    const md = new vscode.MarkdownString([`**CuongMini · git**`, ...(tb.hoi ? [tb.hoi.cauHoi] : []), ...tb.dong].join('\n\n'));
    md.appendMarkdown('\n\n_Bấm để xem chi tiết / kéo về. Tắt: cài đặt `cuongthai.dongBoGit`._');
    this.muc.tooltip = md;
    this.muc.backgroundColor = tb.hoi ? new vscode.ThemeColor('statusBarItem.warningBackground') : undefined;
    this.muc.show();
  }

  /** Nhánh đang sau GitHub (hoặc phân kỳ) ⇒ hỏi MỘT lần cho mỗi mức sau. */
  private hoiNeuSau(): void {
    const t = this.tt;
    if (!t?.laKho || !t.soVoiUpstream || t.soVoiUpstream.sau === 0 || t.dangDo) return;
    const khoa = `${t.goc}|${t.nhanh}|${t.upstream}|${t.soVoiUpstream.sau}|${t.soVoiUpstream.truoc}`;
    if (this.daHoi.has(khoa)) return;
    this.daHoi.add(khoa);
    const tb = veDongBo(t, 'vi');
    if (!tb.hoi) return;
    const nut = tb.hoi.loai === 'keo' ? ['Pull (fast-forward)', 'Xem commit mới', 'Không'] : ['Chọn cách cập nhật…', 'Không'];
    void vscode.window.showInformationMessage(`CuongMini: ${tb.hoi.cauHoi}`, ...nut).then((c) => {
      if (c === 'Pull (fast-forward)') void this.lam('ff', 'upstream');
      else if (c === 'Xem commit mới') void this.xem('upstream');
      else if (c === 'Chọn cách cập nhật…') void this.moMenu();
    });
  }

  async moMenu(): Promise<void> {
    await this.kiem(Date.now() - this.lanFetch > 30_000);
    const t = this.tt;
    if (!t) { void vscode.window.showInformationMessage('CuongMini: chưa mở thư mục dự án (hoặc đã tắt `cuongthai.dongBoGit`).'); return; }
    const tb = veDongBo(t, 'vi');
    type Muc = vscode.QuickPickItem & { giaTri: string };
    const ds: Muc[] = [
      ...(tb.hoi?.luaChon ?? []).filter((x) => x.giaTri !== 'khong').map((x) => ({ label: x.nhan, ...(x.mo ? { description: x.mo } : {}), giaTri: x.giaTri })),
      { label: '$(refresh) Kiểm lại ngay (fetch)', giaTri: 'kiem' },
      { label: '$(comment-discussion) Hỏi CuongMini: luồng git của nhóm (nhánh theo thẻ, commit, PR)', giaTri: 'hoi' },
    ];
    const chon = await vscode.window.showQuickPick(ds, {
      title: tb.hoi?.cauHoi ?? `CuongMini · git · ${t.nhanh ?? 'HEAD'}`,
      placeHolder: [tb.hoi?.moTa, ...tb.dong].filter(Boolean).join(' ').slice(0, 300) || 'Không có gì cần làm.',
    });
    if (!chon) return;
    if (chon.giaTri === 'kiem') { await this.kiem(true); void vscode.window.showInformationMessage(`CuongMini: ${veDongBo(this.tt!, 'vi').dong.join(' ') || 'đã kiểm.'}`); return; }
    if (chon.giaTri === 'hoi') { this.nhoCuongMini('Dùng kỹ năng git-ctwork: kiểm nhánh hiện tại, gợi ý tên nhánh theo thẻ CT Work, lời nhắn commit có key thẻ, và các bước mở PR cho nhóm. '); return; }
    const [viec, mt] = chon.giaTri.split(':') as [string, MucTieuKeo];
    if (viec === 'xem') { await this.xem(mt); return; }
    if (viec === 'ff' || viec === 'rebase' || viec === 'merge') await this.lam(viec, mt);
  }

  private async xem(mt: MucTieuKeo): Promise<void> {
    const g = this.thuMuc();
    if (!g) return;
    const r = await dsCommitMoi(g, mt, { n: 30 });
    const kenh = vscode.window.createOutputChannel('CuongMini · git');
    kenh.clear();
    kenh.appendLine(`Mới trên ${r.dich ?? '?'} (${r.moi.length}):`);
    for (const d of r.moi) kenh.appendLine(`  ${d}`);
    kenh.appendLine('');
    kenh.appendLine(`Của bạn, chưa có trên đó (${r.cuaToi.length}):`);
    for (const d of r.cuaToi) kenh.appendLine(`  ${d}`);
    kenh.show(true);
  }

  private async lam(cach: CachKeo, mt: MucTieuKeo): Promise<void> {
    const g = this.thuMuc();
    const t = this.tt;
    if (!g || !t?.nhanh) return;
    if (cach !== 'ff') {
      const dich = mt === 'upstream' ? t.upstream : t.macDinh;
      const ok = await vscode.window.showWarningMessage(
        `${cach === 'rebase' ? 'Rebase' : 'Merge'} nhánh ${t.nhanh} ${cach === 'rebase' ? 'lên' : 'với'} ${dich}? Xung đột ⇒ CuongMini huỷ về đúng như trước và liệt kê file. Không bao giờ đẩy ép.`,
        { modal: true }, cach === 'rebase' ? 'Rebase' : 'Merge',
      );
      if (!ok) return;
    }
    const r = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: cach === 'ff' ? 'CuongMini: đang pull…' : `CuongMini: đang ${cach}…` },
      () => keoVe(g, { cach, mucTieu: mt, nhanh: t.nhanh!, ngonNgu: 'vi' }));
    await this.kiem(false);
    if (r.ok) { void vscode.window.showInformationMessage(`CuongMini: ${r.noi}`); return; }
    if (r.xungDot?.length) {
      const c = await vscode.window.showWarningMessage(`CuongMini: ${r.noi}`, 'Nhờ CuongMini giải xung đột');
      if (c) this.nhoCuongMini(`Giúp mình ${cach} nhánh ${t.nhanh} lên ${mt === 'upstream' ? t.upstream : t.macDinh} và giải xung đột từng bước (file: ${r.xungDot.slice(0, 6).join(', ')})`);
      return;
    }
    void vscode.window.showWarningMessage(`CuongMini: ${r.noi}`);
  }
}
