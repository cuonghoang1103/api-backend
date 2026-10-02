'use client';
/**
 * Một việc: hướng dẫn → Bắt đầu (bấm giờ) → Nộp bằng chứng → AI chấm → điểm + lỗi.
 * KHÔNG có nút "đánh dấu xong" — chỉ AI/Claude tích (yêu cầu của người dùng 02/10/2026).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Paperclip, Play, Send, Link2, X, RotateCcw, ExternalLink } from 'lucide-react';
import Markdown from '@/components/markdown/Markdown';
import { hocTapApi, NHAN_LOAI, type Viec } from '@/lib/hoc-tap-api';
import { HopThoai, NhanTrangThai, Nut, conLai, cx, oNhap } from './ui';

function DongHoBamGio({ batDauLuc, phut }: { batDauLuc: string; phut: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const het = new Date(batDauLuc).getTime() + phut * 60_000;
  const con = het - now;
  const qua = con < 0;
  const a = Math.abs(con);
  const mm = String(Math.floor(a / 60_000)).padStart(2, '0');
  const ss = String(Math.floor((a % 60_000) / 1000)).padStart(2, '0');
  const pct = Math.min(100, Math.max(0, ((phut * 60_000 - con) / (phut * 60_000)) * 100));
  return (
    <div className={cx('rounded-2xl border p-3', qua ? 'border-red-500/60 bg-red-500/10' : 'border-blue-500/40 bg-blue-500/10')}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-muted">{qua ? '⏰ QUÁ GIỜ ĐÃ HẸN' : '⏱ Đang bấm giờ'}</span>
        <span className={cx('font-mono text-2xl font-black tabular-nums', qua ? 'text-red-500' : 'text-blue-500')}>{qua ? '+' : ''}{mm}:{ss}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border-color)]">
        <div className={cx('h-full', qua ? 'bg-red-500' : 'bg-blue-500')} style={{ width: `${pct}%` }} />
      </div>
      {qua && <p className="mt-1.5 text-[11px] text-red-500">Nộp sau 125% thời lượng sẽ bị tính “nộp trễ” và cộng vào tỷ lệ trượt.</p>}
    </div>
  );
}

export function ChiTietViec({ viecId, onDong, onDoi }: { viecId: number | null; onDong: () => void; onDoi: () => void }) {
  const [v, setV] = useState<(Viec & { mon: { maMon: string; ten: string } }) | null>(null);
  const [loi, setLoi] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [linkMoi, setLinkMoi] = useState('');
  const [tep, setTep] = useState<Array<{ url: string; ten?: string; loai?: string }>>([]);
  const [dangTai, setDangTai] = useState(false);
  const [dangNop, setDangNop] = useState(false);
  const [traLoi, setTraLoi] = useState<string[]>([]);
  const [dangTraLoi, setDangTraLoi] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const tai = useCallback(async () => {
    if (!viecId) return;
    try { setV(await hocTapApi.viec(viecId)); } catch (e) { setLoi(thongBao(e)); }
  }, [viecId]);

  useEffect(() => { setV(null); setLoi(''); setNoiDung(''); setLinks([]); setTep([]); void tai(); }, [tai]);

  // Đang chấm ⇒ hỏi lại mỗi 4 giây.
  useEffect(() => {
    if (v?.trangThai !== 'CHO_CHAM') return;
    const t = setInterval(async () => {
      const moi = await hocTapApi.viec(v.id).catch(() => null);
      if (moi && moi.trangThai !== 'CHO_CHAM') { setV(moi); onDoi(); }
      else if (moi) setV(moi);
    }, 4000);
    return () => clearInterval(t);
  }, [v?.trangThai, v?.id, onDoi]);

  async function chonTep(files: FileList | null) {
    if (!files?.length) return;
    const ds = Array.from(files);
    setDangTai(true); setLoi('');
    try {
      for (const f of ds.slice(0, 10 - tep.length)) {
        const t = await hocTapApi.taiTep(f);
        setTep((x) => [...x, t]);
      }
    } catch (e) { setLoi(`Tải tệp lỗi: ${thongBao(e)} (mã nguồn .js/.html nên dán chữ hoặc gửi link GitHub)`); }
    finally { setDangTai(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  // Dán ảnh chụp màn hình thẳng vào ô (⌘V).
  async function danAnh(e: React.ClipboardEvent) {
    const anh = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith('image/'));
    if (!anh.length) return;
    e.preventDefault();
    const dt = new DataTransfer();
    anh.forEach((f) => dt.items.add(f));
    await chonTep(dt.files);
  }

  async function nop() {
    if (!v) return;
    const tatCaLink = [...links, ...(linkMoi.trim() ? [linkMoi.trim()] : [])];
    setDangNop(true); setLoi('');
    try {
      await hocTapApi.nop(v.id, { noiDung: noiDung.trim() || undefined, lienKet: tatCaLink, tep });
      setNoiDung(''); setLinks([]); setLinkMoi(''); setTep([]);
      await tai(); onDoi();
    } catch (e) { setLoi(thongBao(e)); }
    finally { setDangNop(false); }
  }

  const l = v ? NHAN_LOAI[v.loai] ?? { ten: v.loai, bieuTuong: '•' } : null;
  const coTheNop = v && v.trangThai !== 'DAT' && v.trangThai !== 'CHO_CHAM' && v.trangThai !== 'VAN_DAP';
  const h = v ? conLai(v.hanChot) : null;

  return (
    <HopThoai mo={viecId !== null} onDong={onDong} rong tieuDe={v ? <span>{l?.bieuTuong} {v.tieuDe}</span> : 'Đang mở…'}>
      {!v ? (
        <p className="text-sm text-text-muted">{loi || 'Đang tải…'}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <b className="text-text-primary">{v.mon.maMon}</b>
            <span>· Tuần {v.tuan} · {l?.ten} · ⏱ {v.thoiLuongPhut} phút · trọng số {v.trongSo}</span>
            <span className={h?.tre ? 'font-semibold text-red-500' : ''}>· hạn {new Date(v.hanChot).toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} ({h?.chu})</span>
            <NhanTrangThai t={v.trangThai} />
            {v.gioBatDau && (
              <label className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-primary)] px-2 py-0.5">
                📅 giờ học
                <input type="datetime-local" className="bg-transparent text-text-primary outline-none"
                  defaultValue={new Date(new Date(v.gioBatDau).getTime() + 7 * 3_600_000).toISOString().slice(0, 16)}
                  onBlur={async (e) => { if (!e.target.value) return; await hocTapApi.doiGio(v.id, `${e.target.value}:00+07:00`).catch((x) => setLoi(thongBao(x))); await tai(); onDoi(); }} />
              </label>
            )}
            <span className="rounded-full bg-[var(--bg-primary)] px-2 py-0.5">giao bởi {v.nguon === 'NGUOI_HOC' ? 'bạn' : v.nguon === 'CLAUDE' ? 'Claude' : 'AI'}</span>
          </div>

          {v.lienKet && (
            <Link href={v.lienKet} target="_blank" className="inline-flex items-center gap-1.5 rounded-xl bg-neon-violet/10 px-3 py-1.5 text-sm font-semibold text-neon-violet hover:bg-neon-violet/20">
              <ExternalLink size={14} /> Mở bài học
            </Link>
          )}

          {v.huongDan && (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 text-sm markdown-body">
              <Markdown mdx={v.huongDan} />
            </div>
          )}
          {v.yeuCauBangChung && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-text-primary">
              <b>📎 Phải nộp:</b> {v.yeuCauBangChung}
            </div>
          )}

          {/* Kết quả chấm gần nhất */}
          {v.chamLuc && v.diem !== null && (
            <div className={cx('rounded-2xl border p-4', v.trangThai === 'DAT' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-orange-500/50 bg-orange-500/10')}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">{v.trangThai === 'DAT' ? '✅ ĐẠT' : '↻ CHƯA ĐẠT — sửa rồi nộp lại'}</span>
                <span className="font-heading text-3xl font-black tabular-nums" style={{ color: v.trangThai === 'DAT' ? '#10b981' : '#f97316' }}>{v.diem}<span className="text-base text-text-muted">/10</span></span>
              </div>
              <p className="mt-1 text-[11px] text-text-muted">Chấm bởi {v.nguoiCham === 'CLAUDE' ? 'Claude' : 'AI (gpt-6-sol)'} · {new Date(v.chamLuc).toLocaleString('vi-VN')}</p>
              {v.nhanXet && <div className="mt-2 text-sm markdown-body"><Markdown mdx={v.nhanXet} /></div>}
              <DanhSach tieuDe="💪 Làm tốt" ds={v.loiCanSua?.diemManh} mau="#10b981" />
              <DanhSach tieuDe="❌ Lỗi cần sửa" ds={v.loiCanSua?.loi} mau="#ef4444" />
              <DanhSach tieuDe="📈 Cần cải thiện" ds={v.loiCanSua?.canCaiThien} mau="#f59e0b" />
            </div>
          )}

          {v.trangThai === 'VAN_DAP' && v.vanDap && (
            <div className="space-y-3 rounded-2xl border-2 border-sky-500/60 bg-sky-500/10 p-4">
              <div className="text-sm font-black text-sky-500">🎤 VẤN ĐÁP — bằng chứng đã đạt ({v.vanDap.diemBangChung}/10), giờ chứng minh bạn TỰ LÀM và HIỂU</div>
              <p className="text-xs text-text-muted">Trả lời bằng lời của bạn, ngắn thôi. Đúng ≥ 2/3 câu mới được tích. Đừng hỏi AI — vấn đáp là để bạn biết mình hiểu thật chưa.</p>
              {v.vanDap.cauHoi.map((c, i) => (
                <label key={i} className="block space-y-1">
                  <span className="text-sm font-semibold text-text-primary">{i + 1}. {c}</span>
                  <textarea rows={3} className={oNhap} value={traLoi[i] ?? ''} onChange={(e) => setTraLoi((a) => { const n = [...a]; n[i] = e.target.value; return n; })} />
                </label>
              ))}
              <Nut disabled={dangTraLoi || v.vanDap.cauHoi.some((_, i) => (traLoi[i] ?? '').trim().length < 3)} onClick={async () => {
                setDangTraLoi(true); setLoi('');
                try { await hocTapApi.vanDap(v.id, traLoi); setTraLoi([]); await tai(); onDoi(); } catch (e) { setLoi(thongBao(e)); } finally { setDangTraLoi(false); }
              }}><Send size={14} /> {dangTraLoi ? 'Đang chấm vấn đáp…' : 'Nộp câu trả lời'}</Nut>
            </div>
          )}

          {v.vanDap?.ketQua && (
            <div className={cx('rounded-2xl border p-3 text-sm', v.vanDap.ketQua.hieu ? 'border-emerald-500/40' : 'border-orange-500/40')}>
              <div className="font-bold text-text-primary">🎤 Vấn đáp: {v.vanDap.ketQua.tungCau.filter((t) => t.dung).length}/{v.vanDap.ketQua.tungCau.length} câu đúng {v.vanDap.ketQua.hieu ? '— chứng minh được hiểu bài ✅' : '— chưa chứng minh được ❌'}</div>
              {v.vanDap.cauHoi.map((c, i) => (
                <div key={i} className="mt-2 text-xs">
                  <div className="font-semibold text-text-primary">{v.vanDap!.ketQua!.tungCau[i]?.dung ? '✓' : '✗'} {c}</div>
                  <div className="text-text-muted">Bạn: {v.vanDap!.traLoi?.[i]}</div>
                  {v.vanDap!.ketQua!.tungCau[i]?.goiY && <div className="text-emerald-600">Ý đúng: {v.vanDap!.ketQua!.tungCau[i].goiY}</div>}
                </div>
              ))}
            </div>
          )}

          {v.trangThai === 'CHO_CHAM' && (
            <div className="flex items-center gap-3 rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4 text-sm text-text-primary">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              <span className="flex-1">{v.nhanXet?.startsWith('AI chưa chấm') ? v.nhanXet : 'AI đang đọc bằng chứng và chấm… (thường 20–60 giây, có thể đóng cửa sổ)'}</span>
              {v.nhanXet?.startsWith('AI chưa chấm') && v.bangChung[0] && (
                <Nut kieu="phu" onClick={async () => { await hocTapApi.chamLai(v.bangChung[0].id).catch((e) => setLoi(thongBao(e))); await tai(); }}><RotateCcw size={14} /> Chấm lại</Nut>
              )}
            </div>
          )}

          {coTheNop && (
            <>
              {v.batDauLuc ? (
                <DongHoBamGio batDauLuc={v.batDauLuc} phut={v.thoiLuongPhut} />
              ) : (
                <Nut className="w-full py-3 text-base" onClick={async () => { await hocTapApi.batDau(v.id).catch((e) => setLoi(thongBao(e))); await tai(); onDoi(); }}>
                  <Play size={18} /> Bắt đầu — bấm giờ {v.thoiLuongPhut} phút
                </Nut>
              )}

              <div className="space-y-2 rounded-2xl border border-[var(--border-color)] p-3">
                <div className="text-sm font-bold text-text-primary">Nộp bằng chứng {v.bangChung.length ? `(lần ${v.bangChung.length + 1})` : ''}</div>
                <textarea
                  value={noiDung} onChange={(e) => setNoiDung(e.target.value)} onPaste={danAnh} rows={5}
                  placeholder="Dán kết quả Terminal, câu trả lời của bạn, đoạn code… (dán ảnh chụp màn hình bằng ⌘V cũng được)"
                  className={oNhap}
                />
                <div className="flex gap-2">
                  <input value={linkMoi} onChange={(e) => setLinkMoi(e.target.value)} placeholder="Link GitHub / link bài (tuỳ chọn)" className={oNhap} />
                  <Nut kieu="phu" onClick={() => { if (/^https?:\/\//.test(linkMoi.trim())) { setLinks((x) => [...x, linkMoi.trim()]); setLinkMoi(''); } }}><Link2 size={14} /></Nut>
                </div>
                {(links.length > 0 || tep.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {links.map((x, i) => <Chip key={x} chu={`🔗 ${x.replace(/^https?:\/\//, '').slice(0, 40)}`} onXoa={() => setLinks((a) => a.filter((_, j) => j !== i))} />)}
                    {tep.map((t, i) => <Chip key={t.url} chu={`${t.loai?.startsWith('image/') ? '🖼' : '📄'} ${t.ten ?? 'tệp'}`} onXoa={() => setTep((a) => a.filter((_, j) => j !== i))} />)}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <input ref={fileRef} type="file" multiple className="hidden" accept="image/*,.pdf,.txt,.md,.java,.py,.sql,.json,.docx,.pptx" onChange={(e) => chonTep(e.target.files)} />
                  <Nut kieu="phu" onClick={() => fileRef.current?.click()} disabled={dangTai}><Paperclip size={14} /> {dangTai ? 'Đang tải…' : 'Ảnh / tệp'}</Nut>
                  <div className="flex-1" />
                  <Nut onClick={nop} disabled={dangNop || dangTai || (!noiDung.trim() && !links.length && !linkMoi.trim() && !tep.length)}>
                    <Send size={14} /> {dangNop ? 'Đang nộp…' : 'Nộp cho AI chấm'}
                  </Nut>
                </div>
                <p className="text-[11px] text-text-muted"><b>Đạt khi:</b> nộp ĐỦ mọi mục trong “📎 Phải nộp” <b>và</b> điểm ≥ 5/10. Thiếu một mục bắt buộc thì chưa đạt, dù phần còn lại tốt. “Em làm xong rồi” không phải bằng chứng 🙂</p>
              </div>
            </>
          )}

          {loi && <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{loi}</p>}

          {v.bangChung.length > 0 && (
            <details className="rounded-2xl border border-[var(--border-color)] p-3">
              <summary className="cursor-pointer text-sm font-semibold text-text-primary">Lịch sử nộp ({v.bangChung.length})</summary>
              <div className="mt-2 space-y-2">
                {v.bangChung.map((b) => (
                  <div key={b.id} className="rounded-xl bg-[var(--bg-primary)] p-2 text-xs text-text-muted">
                    <div className="flex justify-between">
                      <span>Lần {b.lanNop} · {new Date(b.createdAt).toLocaleString('vi-VN')}{b.nopTre ? ' · ⏰ trễ' : ''}</span>
                      <span className="font-bold" style={{ color: b.dat ? '#10b981' : b.dat === false ? '#f97316' : undefined }}>{b.diem !== null ? `${b.diem}/10` : b.ketQua?.loi ? 'lỗi chấm' : 'đang chấm'}</span>
                    </div>
                    {b.noiDung && <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] text-text-primary">{b.noiDung}</pre>}
                    {b.tep?.map((t) => <a key={t.url} href={t.url} target="_blank" rel="noreferrer" className="mr-2 text-neon-violet underline">{t.ten || 'tệp'}</a>)}
                    {b.lienKet?.map((x) => <a key={x} href={x} target="_blank" rel="noreferrer" className="mr-2 text-neon-violet underline">{x}</a>)}
                  </div>
                ))}
              </div>
            </details>
          )}

          {v.nguon === 'NGUOI_HOC' && v.trangThai !== 'DAT' && (
            <button className="text-xs text-text-muted underline hover:text-red-500" onClick={async () => { if (window.confirm('Xoá việc bạn tự thêm này?')) { await hocTapApi.xoaViec(v.id); onDoi(); onDong(); } }}>Xoá việc này</button>
          )}
        </div>
      )}
    </HopThoai>
  );
}

function DanhSach({ tieuDe, ds, mau }: { tieuDe: string; ds?: string[]; mau: string }) {
  if (!ds?.length) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-bold" style={{ color: mau }}>{tieuDe}</div>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-text-primary">{ds.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );
}

function Chip({ chu, onXoa }: { chu: string; onXoa: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[var(--bg-primary)] px-2.5 py-1 text-xs text-text-primary">
      <span className="truncate">{chu}</span>
      <button onClick={onXoa} aria-label="Bỏ"><X size={12} /></button>
    </span>
  );
}

export function thongBao(e: unknown): string {
  const r = (e as { response?: { data?: { message?: string; error?: string | { message?: string } } } })?.response?.data;
  const m = r?.message ?? (typeof r?.error === 'string' ? r.error : r?.error?.message);
  return m || (e instanceof Error ? e.message : 'Có lỗi xảy ra');
}
