'use client';

/**
 * Bước 1 của CT Lồng Tiếng: MỘT ô dán link to, nút "Lồng tiếng ngay", kéo thả tệp ngay bên dưới; tuỳ chọn gập lại
 * (hiện tóm tắt bằng nhãn). Tuỳ chọn được nhớ ở trình duyệt này (localStorage, chỉ tiện nghi).
 * Phím: Enter gửi · ⌘/Ctrl+V ở bất kỳ đâu trên trang (không trong ô nhập) ⇒ dán link vào ô / thêm tệp video.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  AudioLines, Check, ChevronDown, ClipboardPaste, FileAudio, Film, Gauge, Languages, Link2, Loader2, Music2, Pause, Play,
  SlidersHorizontal, Sparkles, Type, Upload, Video, X,
} from 'lucide-react';
import { GauPixel } from '@/components/chat/claude/GauPixel';
import { longTiengApi, moTaTep, putLenKho, type BaiNhac, type BanRa, type LoaiNhac } from '@/lib/longTieng';
import { moTaBanRa } from '@/lib/longTiengTienDo';
import { docNho, ghiNho, kb, laVideo, loi, nhanNgonNgu, nhanNguon, nhanNhac, phut } from './chung';

type Lang = 'auto' | 'zh' | 'en';
type Nhip = 'cho-giong' | 'tang-toc';
interface TuyChon { lang: Lang; nhip: Nhip; banRa: BanRa; goc: number; loaiNhac: LoaiNhac; idNhac: string; amLuong: number }
const MAC_DINH: TuyChon = { lang: 'auto', nhip: 'cho-giong', banRa: 'ca-hai', goc: 0.15, loaiNhac: 'goc', idNhac: '', amLuong: 0.3 };
const KHOA_TUY_CHON = 'lt.tuyChon';
const KHOA_MO = 'lt.tuyChonMo';

export function TaoViec({ onDaTao, setTaiLen }: {
  onDaTao: () => Promise<void>;
  setTaiLen: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [link, setLink] = useState('');
  const [tep, setTep] = useState<File[]>([]);
  const [tenVideo, setTenVideo] = useState('');
  const [tc, setTc] = useState<TuyChon>(MAC_DINH);
  const [mo, setMo] = useState(false);
  const [tepNhac, setTepNhac] = useState<File | null>(null);
  const [thuVien, setThuVien] = useState<BaiNhac[] | null>(null);
  const [dangGui, setDangGui] = useState(false);
  const [keo, setKeo] = useState(false);
  const chonTep = useRef<HTMLInputElement>(null);
  const oLink = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cu = docNho<Partial<TuyChon>>(KHOA_TUY_CHON, {});
    setTc({ ...MAC_DINH, ...cu, loaiNhac: cu.loaiNhac === 'tep' ? 'goc' : cu.loaiNhac ?? 'goc' });
    setMo(docNho(KHOA_MO, false));
  }, []);
  const doi = <K extends keyof TuyChon>(k: K, v: TuyChon[K]) => setTc((c) => { const n = { ...c, [k]: v }; ghiNho(KHOA_TUY_CHON, n); return n; });
  const batMo = () => setMo((m) => { ghiNho(KHOA_MO, !m); return !m; });

  useEffect(() => {
    if (tc.loaiNhac !== 'thu-vien' || thuVien) return;
    longTiengApi.nhac()
      .then((ds) => { setThuVien(ds); if (ds[0] && !ds.some((b) => b.id === tc.idNhac)) doi('idNhac', ds[0].id); })
      .catch((e) => { toast.error(loi(e)); setThuVien([]); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tc.loaiNhac, thuVien]);

  const nhanTep = useCallback((ds: FileList | File[] | null) => {
    const tat = Array.from(ds ?? []);
    const v = tat.filter(laVideo);
    if (tat.length && !v.length) toast.error('Chỉ nhận tệp video (mp4, mkv, mov, webm…).');
    if (v.length) setTep((cu) => [...cu, ...v]);
  }, []);

  // ⌘/Ctrl+V khi không gõ trong ô nào ⇒ link vào ô lớn, tệp video vào danh sách.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) return;
      const files = Array.from(e.clipboardData?.files ?? []).filter(laVideo);
      if (files.length) { e.preventDefault(); nhanTep(files); return; }
      const chu = (e.clipboardData?.getData('text') ?? '').trim();
      if (chu) { e.preventDefault(); setLink(chu); oLink.current?.focus(); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [nhanTep]);

  const danTuClipboard = async () => {
    try {
      const chu = (await navigator.clipboard.readText()).trim();
      if (!chu) { toast.message('Bộ nhớ tạm đang trống.'); return; }
      setLink(chu);
      oLink.current?.focus();
    } catch {
      toast.error('Trình duyệt chặn đọc bộ nhớ tạm — bấm vào ô rồi nhấn ⌘/Ctrl+V.');
      oLink.current?.focus();
    }
  };

  const nhacGui = () => ({
    loai: tc.loaiNhac,
    ...(tc.loaiNhac === 'thu-vien' ? { id: tc.idNhac } : {}),
    ...(tc.loaiNhac === 'thu-vien' || tc.loaiNhac === 'tep' ? { amLuong: tc.amLuong } : {}),
    ...(tc.loaiNhac === 'tep' && tepNhac ? { tep: moTaTep(tepNhac) } : {}),
  });

  const coLink = link.trim().length > 0;
  const soViec = (coLink ? 1 : 0) + tep.length;
  const nguon = coLink ? nhanNguon(link) : null;

  const gui = async () => {
    if (!soViec) { toast.error('Dán link video hoặc kéo thả một tệp video vào trước nhé.'); oLink.current?.focus(); return; }
    if (coLink && !/^https?:\/\/\S+$/i.test(link.trim())) { toast.error('Link phải bắt đầu bằng http:// hoặc https://'); oLink.current?.focus(); return; }
    if (tc.loaiNhac === 'thu-vien' && !tc.idNhac) { toast.error('Chọn một bài nhạc trong thư viện.'); setMo(true); return; }
    if (tc.loaiNhac === 'tep' && !tepNhac) { toast.error('Chọn tệp nhạc nền của bạn.'); setMo(true); return; }
    setDangGui(true);
    const chung = { lang: tc.lang, goc: tc.goc, nhip: tc.nhip, banRa: tc.banRa, nhacNen: nhacGui() };
    const ten = soViec === 1 && tenVideo.trim() ? { tenVideo: tenVideo.trim() } : {};
    try {
      if (coLink) {
        const r = await longTiengApi.taoViec({ ...chung, url: link.trim(), ...ten });
        if (r.taiLenNhac && tepNhac) {
          await onDaTao();
          await putLenKho(r.taiLenNhac, tepNhac, (p) => setTaiLen((m) => ({ ...m, [r.job.id]: p })));
          await longTiengApi.daTaiLen(r.job.id);
          setTaiLen((m) => { const n = { ...m }; delete n[r.job.id]; return n; });
        }
        toast.success('Đã nhận việc — CuongMini bắt tay vào làm ngay.', { description: nguon ? `Nguồn: ${nguon}` : undefined });
        setLink('');
      }
      const conLai = [...tep];
      for (const f of conLai) {
        const r = await longTiengApi.taoViec({ ...chung, tep: moTaTep(f), ...ten });
        await onDaTao();
        const tong = f.size + (tepNhac?.size ?? 0);
        await putLenKho(r.taiLen!, f, (p) => setTaiLen((m) => ({ ...m, [r.job.id]: Math.round((p * f.size) / tong) })));
        if (r.taiLenNhac && tepNhac) {
          await putLenKho(r.taiLenNhac, tepNhac, (p) => setTaiLen((m) => ({ ...m, [r.job.id]: Math.round(((f.size + (p / 100) * tepNhac.size) / tong) * 100) })));
        }
        await longTiengApi.daTaiLen(r.job.id);
        setTaiLen((m) => { const n = { ...m }; delete n[r.job.id]; return n; });
        setTep((ds) => ds.filter((x) => x !== f));
        toast.success(`Đã tải lên: ${f.name}`, { description: 'Việc đã vào hàng chờ trạm.' });
      }
      setTenVideo('');
    } catch (e) {
      toast.error(loi(e));
    } finally {
      setDangGui(false);
      await onDaTao();
    }
  };

  const nutChu = dangGui ? 'Đang gửi…' : soViec > 1 ? `Lồng tiếng ${soViec} video` : 'Lồng tiếng ngay';

  return (
    <>
      <section
        className="lt-card lt-hero"
        onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setKeo(true); } }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeo(false); }}
        onDrop={(e) => { e.preventDefault(); setKeo(false); nhanTep(e.dataTransfer.files); }}
      >
        <div className="lt-hero-grid">
          <div>
            <div className="lt-step-label"><span className="lt-step-num">1</span> Dán link video cần lồng tiếng</div>
            <div className="lt-linkrow">
              <label className="lt-linkbox">
                <Link2 aria-hidden />
                <input
                  ref={oLink}
                  className="lt-linkinput"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !dangGui) { e.preventDefault(); void gui(); } }}
                  placeholder="Dán link YouTube, Bilibili… vào đây"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Link video"
                />
                {nguon && <span className="lt-nguon">{nguon}</span>}
                {coLink ? (
                  <button type="button" className="lt-paste" onClick={() => { setLink(''); oLink.current?.focus(); }} aria-label="Xoá link"><X /></button>
                ) : (
                  <button type="button" className="lt-paste" onClick={danTuClipboard}><ClipboardPaste /> Dán</button>
                )}
              </label>
              <button type="button" className="lt-go" onClick={gui} disabled={dangGui}>
                {dangGui ? <Loader2 className="lt-spin" /> : <Sparkles />} {nutChu}
              </button>
            </div>

            <div className="lt-or">hoặc</div>

            <div
              className="lt-drop"
              data-keo={keo ? '1' : undefined}
              role="button"
              tabIndex={0}
              onClick={() => chonTep.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chonTep.current?.click(); } }}
            >
              <input ref={chonTep} type="file" accept="video/*,.mkv,.flv,.ts" multiple hidden onChange={(e) => { nhanTep(e.target.files); e.target.value = ''; }} />
              <span className="lt-drop-icon"><Upload /></span>
              <div>
                <b>{keo ? 'Thả video vào đây' : 'Kéo thả video vào đây, hoặc bấm để chọn tệp'}</b>
                <span>Nhiều tệp cùng lúc được · tối đa 5 GB mỗi tệp · tải thẳng lên kho, không qua máy chủ web</span>
              </div>
            </div>
            {tep.length > 0 && (
              <div className="lt-files">
                {tep.map((f, k) => (
                  <span key={`${f.name}-${k}`} className="lt-file">
                    <Film className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{f.name}</span> <em>{kb(f.size)}</em>
                    <button type="button" className="lt-btn lt-btn-sm lt-btn-icon" style={{ minHeight: 28, width: 28 }} disabled={dangGui}
                      aria-label={`Bỏ ${f.name}`} onClick={() => setTep((ds) => ds.filter((_, j) => j !== k))}><X /></button>
                  </span>
                ))}
              </div>
            )}
            <p className="lt-hint">
              <span className="lt-hint-kbd">Nhấn <span className="lt-kbd">Enter</span> để gửi · <span className="lt-kbd">⌘/Ctrl</span> + <span className="lt-kbd">V</span> ở bất kỳ đâu trên trang để dán link. </span>
              Trang nào chặn trạm tải thì việc báo lỗi — khi đó tải video về máy rồi kéo vào đây.
            </p>
          </div>

          <div className="lt-hero-mascot" aria-hidden>
            <p className="lt-bubble lt-bubble-top">Dán link vào là xong phần của bạn — phần còn lại để mình lo!</p>
            <GauPixel emotion={keo ? 'surprised' : coLink || tep.length ? 'cheer' : 'happy'} follow size={120} />
          </div>
        </div>
      </section>

      <section className="lt-card">
        <button type="button" className="lt-opt-head" onClick={batMo} aria-expanded={mo} aria-controls="lt-tuy-chon">
          <h2 className="lt-h2"><SlidersHorizontal /> Tuỳ chọn</h2>
          <span className="lt-muted hidden sm:inline">{mo ? 'Thu gọn' : 'Mặc định đã tốt — mở ra nếu muốn chỉnh'}</span>
          <ChevronDown className="lt-chev" aria-hidden />
        </button>
        {!mo && (
          <div className="lt-summary">
            <span className="lt-tag"><Languages /> {nhanNgonNgu(tc.lang)}</span>
            <span className="lt-tag"><Gauge /> {tc.nhip === 'cho-giong' ? 'Giữ nhịp đọc tự nhiên' : 'Giữ độ dài video'}</span>
            <span className="lt-tag"><Video /> {tc.banRa === 'ca-hai' ? '2 video: giọng Việt + song ngữ' : tc.banRa === 'vi' ? 'Chỉ giọng Việt' : 'Chỉ song ngữ'}</span>
            {tc.banRa !== 'vi' && <span className="lt-tag"><AudioLines /> Giọng gốc {Math.round(tc.goc * 100)}%</span>}
            <span className="lt-tag"><Music2 /> {nhanNhac(tc.loaiNhac)}</span>
          </div>
        )}
        {mo && (
          <div className="lt-opts" id="lt-tuy-chon">
            <div className="lt-opt">
              <div className="lt-opt-label">Ngôn ngữ gốc<small>Ngôn ngữ người nói trong video</small></div>
              <div className="lt-chips" role="group" aria-label="Ngôn ngữ gốc">
                {([['auto', 'Tự nhận'], ['zh', 'Tiếng Trung'], ['en', 'Tiếng Anh']] as const).map(([k, chu]) => (
                  <button key={k} type="button" className="lt-chip" aria-pressed={tc.lang === k} onClick={() => doi('lang', k)}>
                    {tc.lang === k && <Check />} {chu}
                  </button>
                ))}
              </div>
            </div>

            <div className="lt-opt">
              <div className="lt-opt-label">Nhịp đọc<small>Khi câu tiếng Việt dài hơn câu gốc</small></div>
              <div className="lt-choices">
                <button type="button" className="lt-choice" aria-pressed={tc.nhip === 'cho-giong'} onClick={() => doi('nhip', 'cho-giong')}>
                  <b>Giữ nhịp đọc tự nhiên <span className="lt-badge">KHUYÊN DÙNG</span></b>
                  <span>Đọc bình thường, kéo chậm hình ở đoạn đó cho khớp. Video ra dài hơn bản gốc một chút.</span>
                </button>
                <button type="button" className="lt-choice" aria-pressed={tc.nhip === 'tang-toc'} onClick={() => doi('nhip', 'tang-toc')}>
                  <b>Giữ nguyên độ dài video</b>
                  <span>Đọc nhanh hơn (tới 1,3×) khi câu dài. Đúng giờ với bản gốc nhưng có câu hơi vội.</span>
                </button>
              </div>
            </div>

            <div className="lt-opt">
              <div className="lt-opt-label">Xuất ra<small>Bạn nhận được video nào</small></div>
              <div>
                <div className="lt-choices">
                  <button type="button" className="lt-choice" aria-pressed={tc.banRa === 'ca-hai'} onClick={() => doi('banRa', 'ca-hai')}>
                    <b>Cả hai video <span className="lt-badge">MẶC ĐỊNH</span></b>
                    <span>Một bản chỉ giọng Việt + một bản song ngữ (nghe thêm giọng gốc thật nhỏ).</span>
                  </button>
                  <button type="button" className="lt-choice" aria-pressed={tc.banRa === 'vi'} onClick={() => doi('banRa', 'vi')}>
                    <b>Chỉ giọng Việt</b>
                    <span>Chỉ còn giọng của bạn + nhạc nền. Xong nhanh hơn.</span>
                  </button>
                  <button type="button" className="lt-choice" aria-pressed={tc.banRa === 'vi-goc'} onClick={() => doi('banRa', 'vi-goc')}>
                    <b>Chỉ song ngữ</b>
                    <span>Giọng Việt to, giọng người nói gốc vặn nhỏ phía sau — để nghe lại thuật ngữ gốc.</span>
                  </button>
                </div>
                <p className="lt-result-line"><Video aria-hidden /> {moTaBanRa(tc.banRa, tc.goc)}</p>
              </div>
            </div>

            {tc.banRa !== 'vi' && (
              <div className="lt-opt">
                <div className="lt-opt-label">Giọng gốc trong bản song ngữ<small>0% = tắt hẳn · 15% là vừa nghe</small></div>
                <div>
                  <div className="lt-range-row">
                    <input type="range" className="lt-range" min={0} max={0.4} step={0.05} value={tc.goc} onChange={(e) => doi('goc', Number(e.target.value))} aria-label="Âm lượng giọng gốc" />
                    <span className="lt-range-val">{Math.round(tc.goc * 100)}%</span>
                  </div>
                  <p className="lt-muted mt-1">Chỉ ảnh hưởng video song ngữ — tên tệp ghi rõ, vd “[VI + giọng gốc {Math.round(tc.goc * 100)}%]”.</p>
                </div>
              </div>
            )}

            <div className="lt-opt">
              <div className="lt-opt-label">Nhạc nền<small>Tự nhỏ đi khi có giọng Việt</small></div>
              <div>
                <div className="lt-chips" role="group" aria-label="Nhạc nền">
                  {([['goc', 'Giữ nhạc gốc'], ['thu-vien', 'Thư viện nhạc'], ['tep', 'Nhạc của tôi'], ['khong', 'Không nhạc']] as const).map(([k, chu]) => (
                    <button key={k} type="button" className="lt-chip" aria-pressed={tc.loaiNhac === k} onClick={() => doi('loaiNhac', k)}>
                      {tc.loaiNhac === k && <Check />} {chu}
                    </button>
                  ))}
                </div>
                {tc.loaiNhac === 'goc' && <p className="lt-muted mt-2">Nhạc + tiếng hiệu ứng của video gốc, đã gỡ giọng người nói.</p>}
                {tc.loaiNhac === 'khong' && <p className="lt-muted mt-2">Chỉ còn giọng Việt — mất luôn tiếng hiệu ứng của video gốc.</p>}
                {tc.loaiNhac === 'thu-vien' && <ChonNhac ds={thuVien} chon={tc.idNhac} setChon={(id) => doi('idNhac', id)} />}
                {tc.loaiNhac === 'tep' && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="lt-btn">
                      <FileAudio /> {tepNhac ? 'Đổi tệp nhạc' : 'Chọn tệp nhạc'}
                      <input type="file" hidden accept="audio/*,.mp3,.m4a,.wav,.flac,.ogg" onChange={(e) => setTepNhac(e.target.files?.[0] ?? null)} />
                    </label>
                    <span className="lt-muted">{tepNhac ? `${tepNhac.name} · ${kb(tepNhac.size)}` : 'mp3, m4a, wav, flac… tối đa 300 MB'}</span>
                  </div>
                )}
                {(tc.loaiNhac === 'thu-vien' || tc.loaiNhac === 'tep') && (
                  <div className="lt-range-row mt-3">
                    <span className="lt-muted shrink-0">Âm lượng nhạc</span>
                    <input type="range" className="lt-range" min={0.05} max={0.8} step={0.05} value={tc.amLuong} onChange={(e) => doi('amLuong', Number(e.target.value))} aria-label="Âm lượng nhạc nền" />
                    <span className="lt-range-val">{Math.round(tc.amLuong * 100)}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lt-opt">
              <div className="lt-opt-label">Tên video<small>Tuỳ chọn — dùng đặt tên tệp</small></div>
              <div className="relative">
                <Type className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--lt-text-3)]" aria-hidden />
                <input className="lt-input" style={{ paddingLeft: 42 }} value={tenVideo} onChange={(e) => setTenVideo(e.target.value)}
                  placeholder={soViec > 1 ? 'Gửi nhiều video: mỗi video lấy tên riêng' : 'Để trống: lấy tên từ link / tệp'} disabled={soViec > 1} maxLength={300} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="lt-btn" onClick={() => { setTc(MAC_DINH); ghiNho(KHOA_TUY_CHON, MAC_DINH); }}>Về mặc định</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function ChonNhac({ ds, chon, setChon }: { ds: BaiNhac[] | null; chon: string; setChon: (id: string) => void }) {
  const [dangNghe, setDangNghe] = useState<string | null>(null);
  const am = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => { am.current?.pause(); }, []);
  if (!ds) return <p className="lt-muted mt-3 flex items-center gap-2"><Loader2 className="lt-spin h-4 w-4" /> Đang tải thư viện…</p>;
  if (!ds.length) return <p className="lt-muted mt-3">Thư viện nhạc chưa có bài nào.</p>;
  const nghe = (b: BaiNhac) => {
    if (dangNghe === b.id) { am.current?.pause(); setDangNghe(null); return; }
    if (!b.nghe) return;
    am.current?.pause();
    am.current = new Audio(b.nghe);
    am.current.volume = 0.6;
    am.current.onended = () => setDangNghe(null);
    void am.current.play().catch(() => setDangNghe(null));
    setDangNghe(b.id);
  };
  return (
    <ul className="lt-tracks" style={{ listStyle: 'none', padding: 0 }}>
      {ds.map((b) => (
        <li key={b.id} className="lt-track" data-chon={chon === b.id ? '1' : undefined}>
          <button type="button" className="lt-track-play" aria-label={dangNghe === b.id ? `Dừng ${b.ten}` : `Nghe thử ${b.ten}`} onClick={() => nghe(b)} disabled={!b.nghe}>
            {dangNghe === b.id ? <Pause /> : <Play />}
          </button>
          <button type="button" onClick={() => setChon(b.id)} className="min-w-0 flex-1 text-left" aria-pressed={chon === b.id}>
            <b>{b.ten}</b>
            <small>{b.tamTrang} · {phut(b.thoiLuong)} · {b.giayPhep}{b.tacGia ? ` · ${b.tacGia}` : ''}</small>
          </button>
          {chon === b.id && <Check className="h-5 w-5 shrink-0 text-[var(--lt-accent-text)]" aria-label="Đang chọn" />}
        </li>
      ))}
    </ul>
  );
}
