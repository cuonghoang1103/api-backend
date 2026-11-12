'use client';

/**
 * 🔒 Tài liệu riêng IELTS (12/11/2026) — khung gập đầu mỗi bài IELTS (Tập 1 + Tập 2) + thẻ tài liệu + trình phát có mốc
 * + xem PDF từng trang. CHỈ hiện khi `/sach-rieng/quyen` có 'ielts'; người khác không thấy gì và không gọi thêm API.
 * Tên/tiêu đề tài liệu chỉ đến từ API (xem ielts.ts).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useAnhDuong } from './useSachRieng';
import {
  NHAN_LOAI, dongHo, moTaNgan, urlMedia, urlTrangIelts, useCoIelts, useMucCuaBai, type MocIelts, type MucIelts,
} from './ielts';
import st from './taiLieuIelts.module.css';

/* ── Trình phát video/audio có danh sách mốc ───────────────────────── */

export function TrinhPhatIelts({ muc, moc, tuaDau }: { muc: MucIelts; moc: MocIelts[]; tuaDau?: number }) {
  const ref = useRef<HTMLMediaElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [loi, setLoi] = useState('');
  const [giay, setGiay] = useState(0);
  const het = useRef(0);
  const choTua = useRef<number | null>(tuaDau ?? null);
  const dangPhat = useRef(tuaDau != null);
  const thuLai = useRef(0);

  /** Xin vé mới (lần đầu, vé hết hạn, hoặc phát lỗi giữa chừng) — giữ chỗ đang nghe. */
  const layVe = useCallback(async (giuTai?: number) => {
    try {
      const v = await urlMedia(muc.id);
      het.current = v.het;
      if (giuTai != null) choTua.current = giuTai;
      setSrc(v.url);
      setLoi('');
    } catch {
      setLoi('Không lấy được quyền phát (mạng hoặc phiên đăng nhập). Tải lại trang rồi thử lại.');
    }
  }, [muc.id]);
  useEffect(() => { void layVe(); }, [layVe]);

  const tua = (g: number) => {
    const el = ref.current;
    if (!el) return;
    dangPhat.current = true;
    if (het.current * 1000 - Date.now() < 60_000) { void layVe(g); return; } // vé sắp hết ⇒ xin vé rồi tua
    el.currentTime = g;
    void el.play().catch(() => {});
  };

  const mocDang = useMemo(() => {
    let k = -1;
    moc.forEach((m, i) => { if (m.giay <= giay + 0.5) k = i; });
    return k;
  }, [moc, giay]);

  const chung = {
    src: src ?? undefined,
    controls: true,
    preload: 'metadata' as const,
    controlsList: 'nodownload',
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      const el = e.currentTarget;
      if (choTua.current != null) { el.currentTime = choTua.current; choTua.current = null; }
      if (dangPhat.current) void el.play().catch(() => {});
    },
    onTimeUpdate: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      const g = Math.floor(e.currentTarget.currentTime);
      setGiay((x) => (x === g ? x : g));
    },
    onPlay: () => { dangPhat.current = true; thuLai.current = 0; },
    onPause: () => { dangPhat.current = false; },
    onError: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (!src) return;
      // Thường là vé hết hạn (để tạm dừng > 30 phút) ⇒ xin vé mới, phát tiếp đúng chỗ. Hỏng 2 lần liền ⇒ báo.
      if (thuLai.current < 2) { thuLai.current++; void layVe(e.currentTarget.currentTime || giay); return; }
      setLoi('Không phát được tệp này. Thử tải lại trang.');
    },
  };

  return (
    <div className={st.trinhPhat}>
      {muc.loai === 'video'
        ? <video ref={(el) => { ref.current = el; }} playsInline {...chung} />
        : <audio ref={(el) => { ref.current = el; }} {...chung} />}
      {!src && !loi && <p className={st.phu}>Đang mở…</p>}
      {loi && <p className={st.loi}>{loi}</p>}
      {moc.length > 0 && (
        <div className={st.moc} aria-label="Mốc trong tệp">
          {moc.map((m, i) => (
            <button key={`${m.giay}-${i}`} type="button" className={`${st.nutPhu} ${i === mocDang ? st.dang : ''}`} onClick={() => tua(m.giay)}>
              <b>{dongHo(m.giay)}</b> {m.ghiChu}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PDF: xem từng trang ───────────────────────────────────────────── */

export function XemPdfIelts({ muc }: { muc: MucIelts }) {
  const so = muc.soTrang ?? 0;
  const [p, setP] = useState(1);
  const src = useAnhDuong(urlTrangIelts(muc.id, p));
  const sau = useAnhDuong(urlTrangIelts(muc.id, Math.min(so, p + 1)), p < so); // nạp trước trang kế
  if (!so) return <p className={st.loi}>Tài liệu này chưa có trang nào.</p>;
  const doi = (n: number) => setP(Math.max(1, Math.min(so, n)));
  return (
    <div className={st.trang}>
      <div className={st.thanhTrang}>
        <button type="button" className={st.nutPhu} onClick={() => doi(p - 1)} disabled={p <= 1}>◀ Trước</button>
        <label>
          Trang{' '}
          <select value={p} onChange={(e) => doi(Number(e.target.value))} aria-label="Chọn trang">
            {Array.from({ length: so }, (_, k) => <option key={k + 1} value={k + 1}>{k + 1}</option>)}
          </select>{' '}
          / {so}
        </label>
        <button type="button" className={st.nutPhu} onClick={() => doi(p + 1)} disabled={p >= so}>Sau ▶</button>
      </div>
      <div className={st.trangAnh} style={{ marginTop: 8 }}>
        {src && src !== 'loi' && (
          // eslint-disable-next-line @next/next/no-img-element -- ảnh riêng tư qua API, không qua next/image
          <img src={src} alt={`Trang ${p}`} onClick={() => doi(p + 1)} style={{ cursor: p < so ? 'pointer' : undefined }} />
        )}
        {src === 'loi' && <p className={st.loi} style={{ padding: 12 }}>Không tải được trang này.</p>}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- nạp trước, không hiện */}
      {sau && sau !== 'loi' && p < so && <img src={sau} alt="" style={{ display: 'none' }} />}
    </div>
  );
}

/* ── Thẻ một tài liệu ─────────────────────────────────────────────── */

export function TheMucIelts({ muc, lessonId, mo: moBanDau = false, chanTrang }: {
  muc: MucIelts;
  /** Đang ở bài nào (khung đầu bài) — hiện trọng tâm + mốc của RIÊNG bài đó. Không có ⇒ mọi bài gắn. */
  lessonId?: string;
  mo?: boolean;
  /** Phần thêm dưới thẻ (trang tổng: danh sách bài gắn). */
  chanTrang?: React.ReactNode;
}) {
  const [mo, setMo] = useState(moBanDau);
  const [tuaDau, setTuaDau] = useState<number | undefined>(undefined);
  const gan = useMemo(() => (lessonId ? muc.baiGan.filter((b) => b.lessonId === lessonId) : muc.baiGan), [muc, lessonId]);
  const moc = useMemo(() => {
    const ds = gan.flatMap((b) => b.moc ?? []);
    const thay = new Set<string>();
    return ds.filter((m) => { const k = `${m.giay}|${m.ghiChu}`; if (thay.has(k)) return false; thay.add(k); return true; }).sort((a, b) => a.giay - b.giay);
  }, [gan]);
  const trongTam = lessonId ? gan.map((b) => b.trongTam).filter(Boolean).join('\n') : '';
  const nhanMo = muc.loai === 'video' ? '▶ Mở video' : muc.loai === 'audio' ? '🎧 Nghe' : '📄 Xem PDF';

  return (
    <div className={st.muc}>
      <div className={st.dau}>
        <span className={st.tieuDe}>{muc.tieuDe}</span>
        <span className={st.phu}>{NHAN_LOAI[muc.loai]} · {muc.nguon}{moTaNgan(muc) ? ` · ${moTaNgan(muc)}` : ''}</span>
      </div>
      {trongTam && <p className={st.trongTam}><b>Trọng tâm:</b> {trongTam}</p>}
      {!lessonId && muc.tomTat && <p className={st.trongTam}>{muc.tomTat}</p>}
      {!mo && (
        <>
          {moc.length > 0 && muc.loai !== 'pdf' && (
            <div className={st.moc}>
              {moc.map((m, i) => (
                <button key={`${m.giay}-${i}`} type="button" className={st.nutPhu} onClick={() => { setTuaDau(m.giay); setMo(true); }}>
                  <b>{dongHo(m.giay)}</b> {m.ghiChu}
                </button>
              ))}
            </div>
          )}
          <button type="button" className={st.nut} onClick={() => setMo(true)}>{nhanMo}</button>
        </>
      )}
      {mo && (
        <>
          {muc.loai === 'pdf' ? <XemPdfIelts muc={muc} /> : <TrinhPhatIelts muc={muc} moc={moc} tuaDau={tuaDau} />}
          <button type="button" className={st.nutPhu} style={{ marginTop: 8 }} onClick={() => setMo(false)}>Thu gọn</button>
        </>
      )}
      {chanTrang}
    </div>
  );
}

/* ── Khung đầu bài ─────────────────────────────────────────────────── */

const KHOA_MO = 'ielts-tai-lieu-rieng-mo';

/** Khung gập "🔒 Tài liệu riêng — chỉ bạn thấy" đầu một bài IELTS. Không quyền / không có mục ⇒ không vẽ gì. */
export function TaiLieuIeltsBai({ lessonId }: { lessonId: string }) {
  const co = useCoIelts();
  const ds = useMucCuaBai(lessonId, !!co);
  const [mo, setMo] = useState(false);
  useEffect(() => { try { setMo(localStorage.getItem(KHOA_MO) === '1'); } catch { /* trình duyệt chặn lưu */ } }, []);
  if (!co || !ds?.length) return null;
  return (
    <details className={st.khung} open={mo} onToggle={(e) => {
      const m = (e.currentTarget as HTMLDetailsElement).open;
      setMo(m);
      try { localStorage.setItem(KHOA_MO, m ? '1' : '0'); } catch { /* bỏ qua */ }
    }}>
      <summary>🔒 Tài liệu riêng — chỉ bạn thấy <span className={st.dem}>{ds.length} mục</span></summary>
      <div className={st.than}>
        {ds.map((m) => <TheMucIelts key={m.id} muc={m} lessonId={lessonId} />)}
        <Link href="/language/en/ielts/tai-lieu-rieng" className={st.phu} style={{ fontWeight: 600 }}>Tất cả tài liệu riêng →</Link>
      </div>
    </details>
  );
}
