'use client';

/**
 * Khung KIỂM THỬ dưới editor (đợt Academy 28/10/2026) — như tab "Testcase / Test Result" của LeetCode.
 *
 *  - "Kiểm mẫu": danh sách kiểm mẫu của đề (thấy trước khi chạy) — với bài JS hiện lời gọi + mong đợi.
 *  - "Kết quả": từng kiểm ✓/✗ + thời gian; kiểm mẫu trượt mở sẵn "mong đợi vs nhận"; kiểm ẩn (chỉ khi
 *    Nộp) CHỈ báo đạt/trượt + gợi ý chung, không lộ đáp án. Đề có thang điểm ⇒ bảng điểm theo chức
 *    năng như bảng điểm PE ("2. Search 1.5/1.5").
 */
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Lock, MinusCircle, ChevronRight, Trophy, Timer, FlaskConical, ListChecks } from 'lucide-react';
import type { Diem, Kiem, KetQuaKiem, TestsJson } from './cham/kieu';
import { BangSqlNho, BangSqlSo } from './BangSqlSo';

export type CheDoCham = 'chay' | 'nop';

export interface TrangThaiCham {
  dang: CheDoCham | null;
  cheDo: CheDoCham | null;
  ketQua: KetQuaKiem[] | null;
  diem: Diem | null;
  dat: number;
  tong: number;
  ms: number;
  /** Lỗi chung (không lấy được bộ kiểm, máy chủ từ chối lượt nộp…). */
  loi: string | null;
  /** Lượt nộp đã lưu (đăng nhập) — số thứ tự để hiện "Lượt #12 đã lưu". */
  daLuu: boolean | null;
}

export const CHAM_RONG: TrangThaiCham = { dang: null, cheDo: null, ketQua: null, diem: null, dat: 0, tong: 0, ms: 0, loi: null, daLuu: null };

function moTaLoiGoi(k: Kiem): string | null {
  const goi = typeof k.goi === 'string' ? k.goi : null;
  if (!goi) return null;
  return (typeof k.chuanBi === 'string' && k.chuanBi.trim() ? `${k.chuanBi.trim()}\n` : '') + goi;
}

const laBangSql = (v: unknown): v is { cot: string[]; hang: unknown[][] } => !!v && typeof v === 'object' && Array.isArray((v as { cot?: unknown }).cot) && Array.isArray((v as { hang?: unknown }).hang);

const ngan = (v: unknown) => { const s = JSON.stringify(v); return s && s.length > 200 ? `${s.slice(0, 197)}...` : (s ?? String(v)); };

export function TestPanel({ tj, st, onDong, videoHref, chiKetQua }: { tj: TestsJson | null | undefined; st: TrangThaiCham; onDong?: () => void; videoHref?: string | null; /** đề trắc nghiệm/bảng: không có tab Kiểm mẫu */ chiKetQua?: boolean }) {
  const [tab, setTab] = useState<'mau' | 'kq'>(chiKetQua ? 'kq' : 'mau');
  const [mo, setMo] = useState<Record<number, boolean>>({});
  const mau = (tj?.kiem ?? []).filter((k) => !k.an);
  const soAn = tj?.soAn ?? 0;
  const coKq = !!st.ketQua || !!st.dang || !!st.loi;
  const tabNow = tab;
  // Vừa bấm Chạy/Nộp ⇒ sang tab Kết quả
  useEffect(() => { if (st.dang || st.loi) setTab('kq'); }, [st.dang, st.loi]);

  const tatCaDat = !!st.ketQua && st.tong > 0 && st.dat === st.tong;
  const rubric = st.diem && st.diem.nhom.length > 0 ? st.diem : null;

  return (
    <section className="cl-tp" aria-label="Kiểm thử">
      <div className="cl-tp-head" role="tablist">
        {!chiKetQua && (
          <button type="button" role="tab" aria-selected={tabNow === 'mau'} onClick={() => setTab('mau')}>
            <ListChecks size={14} /> Kiểm mẫu <span className="cl-tp-count">{mau.length}</span>
          </button>
        )}
        <button type="button" role="tab" aria-selected={tabNow === 'kq'} onClick={() => setTab('kq')} disabled={!coKq}>
          <FlaskConical size={14} /> Kết quả
          {st.ketQua && !st.dang && (
            <span className="cl-tp-count" data-ok={tatCaDat ? 'true' : 'false'}>{st.dat}/{st.tong}</span>
          )}
        </button>
        {onDong && <button type="button" className="cl-tp-close" onClick={onDong} aria-label="Thu gọn">×</button>}
      </div>

      {tabNow === 'mau' && (
        <div className="cl-tp-body">
          {mau.length === 0 && <p className="cl-tp-empty">Đề này không có kiểm mẫu — mọi kiểm chạy khi Nộp.</p>}
          <ol className="cl-tp-list">
            {mau.map((k, idx) => {
              const loiGoi = moTaLoiGoi(k);
              return (
                <li key={idx} className="cl-tp-case">
                  <div className="cl-tp-row"><span className="cl-tp-n">{idx + 1}</span><span className="min-w-0 flex-1">{k.moTa}</span></div>
                  {loiGoi && (
                    <dl className="cl-tp-io">
                      <div><dt>Gọi</dt><dd><code>{loiGoi}</code></dd></div>
                      {k.mongDoi !== undefined && <div><dt>Mong đợi</dt><dd><code>{ngan(k.mongDoi)}</code></dd></div>}
                    </dl>
                  )}
                  {/* SQL (29/10/2026): bảng mong đợi của kiểm mẫu */}
                  {(tj?.loai === 'sql' || tj?.loai === 'sql-pg') && laBangSql(k.mongDoi) && <BangSqlNho b={k.mongDoi} />}
                </li>
              );
            })}
          </ol>
          {soAn > 0 && (
            <p className="cl-tp-note"><Lock size={12} /> Thêm {soAn} kiểm ẩn chỉ chạy khi <b>Nộp</b> — để chắc bạn giải đúng ý đề, không chỉ khớp ví dụ.</p>
          )}
        </div>
      )}

      {tabNow === 'kq' && (
        <div className="cl-tp-body" aria-live="polite">
          {st.dang && (
            <p className="cl-tp-run"><Loader2 size={15} className="animate-spin" /> {st.dang === 'nop' ? 'Đang chấm toàn bộ kiểm…' : 'Đang chạy kiểm mẫu…'}</p>
          )}
          {st.loi && <p className="cl-tp-loi">{st.loi}</p>}
          {st.ketQua && !st.dang && (
            <div className={`cl-tp-verdict ${tatCaDat ? 'is-ok' : 'is-bad'}`}>
              {tatCaDat ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              <div className="min-w-0">
                <div className="cl-tp-verdict-t">
                  {tatCaDat
                    ? (st.cheDo === 'nop' ? 'Accepted — đạt mọi kiểm' : 'Đạt mọi kiểm mẫu')
                    : (st.cheDo === 'nop' ? 'Chưa đạt — Wrong Answer' : 'Còn kiểm mẫu trượt')}
                </div>
                <div className="cl-tp-verdict-s">
                  {st.dat}/{st.tong} kiểm · <Timer size={11} className="inline" /> {st.ms < 1000 ? `${st.ms} ms` : `${(st.ms / 1000).toFixed(1)} s`}
                  {st.cheDo === 'chay' && tatCaDat && (tj?.soAn ?? 0) > 0 && ' · bấm Nộp để chạy cả kiểm ẩn'}
                  {st.cheDo === 'nop' && st.daLuu === true && ' · đã lưu vào Lượt nộp'}
                  {st.cheDo === 'nop' && st.daLuu === false && ' · đăng nhập để lưu kết quả & tiến độ'}
                </div>
                {!tatCaDat && videoHref && (
                  <a href={videoHref} className="cl-tp-video">📺 Xem lại đoạn bài giảng của phần này</a>
                )}
              </div>
              {st.diem && st.cheDo === 'nop' && (
                <div className="cl-tp-score"><Trophy size={14} /> {rubric ? `${st.diem.score}/${st.diem.maxScore}` : `${st.diem.score}%`}</div>
              )}
            </div>
          )}

          {rubric && !st.dang && (
            <table className="cl-tp-rubric">
              <thead><tr><th>Chức năng</th><th>Kiểm đạt</th><th>Điểm</th></tr></thead>
              <tbody>
                {rubric.nhom.map((n) => (
                  <tr key={n.ma} data-ok={n.tong > 0 && n.dat === n.tong ? 'true' : 'false'}>
                    <td>{n.ten}</td>
                    <td className="tabular-nums">{n.tong ? `${n.dat}/${n.tong}` : '—'}</td>
                    <td className="tabular-nums font-semibold">{n.diemDat}/{n.diem}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td>Tổng</td><td /><td className="tabular-nums font-bold">{rubric.score}/{rubric.maxScore}</td></tr></tfoot>
            </table>
          )}

          {st.ketQua && (
            <ol className="cl-tp-list">
              {st.ketQua.map((r, idx) => {
                const an = !!r.an;
                const coChiTiet = !an && !r.dat && !!(r.thay || r.mong);
                const mo1 = mo[idx] ?? coChiTiet;
                return (
                  <li key={idx} className="cl-tp-case" data-ok={r.boQua ? 'skip' : r.dat ? 'true' : 'false'}>
                    <button type="button" className="cl-tp-row" onClick={() => setMo((m) => ({ ...m, [idx]: !mo1 }))} disabled={an || (!r.thay && !r.mong)}>
                      {r.boQua ? <MinusCircle size={15} className="cl-tp-ic skip" /> : r.dat ? <CheckCircle2 size={15} className="cl-tp-ic ok" /> : <XCircle size={15} className="cl-tp-ic bad" />}
                      <span className="min-w-0 flex-1 text-left">
                        {an ? <><Lock size={11} className="mr-1 inline" />Kiểm ẩn #{r.i + 1}</> : r.moTa}
                      </span>
                      {typeof r.ms === 'number' && <span className="cl-tp-ms">{r.ms} ms</span>}
                      {!an && (r.thay || r.mong) && <ChevronRight size={14} className={`cl-tp-car ${mo1 ? 'is-open' : ''}`} />}
                    </button>
                    {an && !r.dat && (
                      <p className="cl-tp-hint">Kiểm ẩn trượt — xem lại các trường hợp chưa có trong kiểm mẫu: giá trị rỗng/biên, thứ tự, yêu cầu “lưu/nhớ” và các mục trong Requirements.</p>
                    )}
                    {r.boQua && <p className="cl-tp-hint">{r.boQua}</p>}
                    {!an && mo1 && (r.thay || r.mong) && (
                      <dl className="cl-tp-io">
                        {r.mong && <div><dt>Mong đợi</dt><dd><code>{r.mong}</code></dd></div>}
                        {r.thay && <div><dt>{r.dat ? 'Nhận' : 'Nhận được'}</dt><dd><code>{r.thay}</code></dd></div>}
                      </dl>
                    )}
                    {!an && mo1 && r.bangSql && <BangSqlSo d={r.bangSql} />}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
