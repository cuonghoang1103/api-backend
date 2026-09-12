/**
 * KHO MẪU — nhạc lấy từ ngoài, kèm giấy phép.
 *
 * ─── Vì sao KHÔNG có ô tìm kiếm ───
 * ccMixter, Freesound và Archive.org đều có API. Nhưng cả ba tên miền đó
 * không gọi được từ máy dựng bản này, nên hình dạng API của chúng chưa kiểm
 * chứng được — và một bộ tìm kiếm dựa trên API đoán mò thì hỏng đúng kiểu nút
 * "Tải model" từng trả HTTP 404 trên máy người dùng. Ở đây chỉ MỞ TRANG của
 * họ; người dùng tải về rồi thêm vào kho, và họ đọc giấy phép bằng mắt mình
 * trên chính trang đó — vốn là điều nên xảy ra dù có API hay không.
 *
 * ─── Vì sao khai giấy phép TRƯỚC khi chọn tệp ───
 * Sau khi chép xong thì không ai quay lại điền nữa. Hỏi trước, lúc người dùng
 * vẫn còn nhớ mình vừa tải nó ở đâu, là cách duy nhất để cái kho này còn giá
 * trị sau sáu tháng.
 */
import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, FolderPlus, Loader2, Music4, Trash2 } from 'lucide-react';
import type { MauNhac } from '../../../shared/ipc';
import { useDich } from '../../i18n';

/** Chép từ `main/nhac/khoMau.ts`. Phép kiểm chốt hai bên khớp nhau. */
export const GIAY_PHEP_UI = [
  { ma: 'cc0', ten: 'CC0', dienDuoc: true },
  { ma: 'cc-by', ten: 'CC BY', dienDuoc: true },
  { ma: 'cc-by-sa', ten: 'CC BY-SA', dienDuoc: true },
  { ma: 'cc-by-nc', ten: 'CC BY-NC', dienDuoc: false },
  { ma: 'cong-cong', ten: 'Phạm vi công cộng', dienDuoc: true },
  { ma: 'tu-thu', ten: 'Tự thu', dienDuoc: true },
  { ma: 'khac', ten: 'Chưa rõ', dienDuoc: false },
] as const;

export const NGUON_UI = [
  { ma: 'ccmixter', ten: 'ccMixter', url: 'https://ccmixter.org/',
    moTa: 'A cappella và stem đăng lên ĐỂ người khác remix' },
  { ma: 'freesound', ten: 'Freesound', url: 'https://freesound.org/',
    moTa: 'Sample, loop, one-shot — phần lớn CC0 hoặc CC BY' },
  { ma: 'archive', ten: 'Internet Archive', url: 'https://archive.org/details/audio',
    moTa: 'Nhạc trọn bài, phần lớn công cộng hoặc CC' },
] as const;

export function traUI(ma: string): (typeof GIAY_PHEP_UI)[number] {
  return GIAY_PHEP_UI.find((g) => g.ma === ma) ?? GIAY_PHEP_UI[GIAY_PHEP_UI.length - 1]!;
}

interface Props {
  /** Nạp một mẫu thành một bài trong xưởng, để nó vào dòng thời gian. */
  onDung: (tep: string, ten: string) => void | Promise<void>;
}

export function KhoMau({ onDung }: Props) {
  const { dich } = useDich();
  const cau = window.cuongthai;

  const [ds, setDs] = useState<MauNhac[]>([]);
  const [dangTai, setDangTai] = useState(false);
  const [giayPhep, setGiayPhep] = useState<string>('cc0');
  const [tacGia, setTacGia] = useState('');
  const [nguon, setNguon] = useState('');
  const [url, setUrl] = useState('');
  const [dangDung, setDangDung] = useState<string | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  const lamMoi = useCallback(async () => {
    if (!cau) return;
    try {
      setDs(await cau.xuongRemix.dsMau());
    } catch (e) {
      setLoi((e as Error).message);
    }
  }, [cau]);

  useEffect(() => { void lamMoi(); }, [lamMoi]);

  const them = useCallback(async () => {
    if (!cau) return;
    setDangTai(true);
    setLoi(null);
    try {
      const moi = await cau.xuongRemix.themMau({
        giayPhep,
        ...(tacGia.trim() ? { tacGia: tacGia.trim() } : {}),
        ...(nguon.trim() ? { nguon: nguon.trim() } : {}),
        ...(url.trim() ? { url: url.trim() } : {}),
      });
      if (moi !== null) await lamMoi();
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangTai(false);
    }
  }, [cau, giayPhep, tacGia, nguon, url, lamMoi]);

  const xoa = useCallback(async (tep: string) => {
    if (!cau) return;
    try {
      await cau.xuongRemix.xoaMau(tep);
      await lamMoi();
    } catch (e) {
      setLoi((e as Error).message);
    }
  }, [cau, lamMoi]);

  const dung = useCallback(async (m: MauNhac) => {
    setDangDung(m.tep);
    setLoi(null);
    try {
      await onDung(m.tep, m.ten);
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangDung(null);
    }
  }, [onDung]);

  return (
    <div className="ct-xr-km">
      {/* ── Ba nguồn có giấy phép ────────────────────── */}
      <div className="ct-xr-km-nguon">
        {NGUON_UI.map((n) => (
          <button key={n.ma} type="button" className="ct-xr-km-trang"
            onClick={() => void cau?.app.openExternal(n.url)}>
            <b>{n.ten}</b>
            <span>{dich(n.moTa)}</span>
            <ExternalLink size={11} aria-hidden />
          </button>
        ))}
      </div>

      <p className="ct-muted ct-xr-nhac">
        {dich('Ba nguồn này cho phép remix — nhưng mỗi bài một giấy phép, đọc nhãn trên chính trang đó. Tải về rồi khai giấy phép ở đây; app giữ nó cạnh tệp để sáu tháng sau bạn còn biết bài nào đem đi diễn được.')}
      </p>

      {/* ── Khai giấy phép rồi mới chọn tệp ──────────── */}
      <div className="ct-xr-km-them">
        <label className="ct-xr-dtg-o">
          <span>{dich('Giấy phép')}</span>
          <select value={giayPhep} onChange={(e) => setGiayPhep(e.target.value)}>
            {GIAY_PHEP_UI.map((g) => (
              <option key={g.ma} value={g.ma}>{dich(g.ten)}</option>
            ))}
          </select>
        </label>
        <label className="ct-xr-dtg-o">
          <span>{dich('Tác giả')}</span>
          <input type="text" value={tacGia} maxLength={200} placeholder="—"
            onChange={(e) => setTacGia(e.target.value)} />
        </label>
        <label className="ct-xr-dtg-o">
          <span>{dich('Nguồn')}</span>
          <input type="text" value={nguon} maxLength={200} placeholder="ccMixter"
            onChange={(e) => setNguon(e.target.value)} />
        </label>
        <label className="ct-xr-dtg-o ct-xr-km-url">
          <span>{dich('Đường dẫn')}</span>
          <input type="url" value={url} maxLength={2048} placeholder="https://…"
            onChange={(e) => setUrl(e.target.value)} />
        </label>
        <button type="button" className="ct-btn" disabled={dangTai} onClick={() => void them()}>
          {dangTai ? <Loader2 size={14} className="ct-xoay" aria-hidden />
                   : <FolderPlus size={14} aria-hidden />}
          {dich('Chọn tệp để thêm')}
        </button>
      </div>

      {loi && <p className="ct-xr-ngo" data-tone="loi">{loi}</p>}

      {/* ── Danh sách mẫu ───────────────────────────── */}
      {ds.length === 0
        ? <p className="ct-muted ct-xr-nhac">{dich('Kho mẫu còn trống.')}</p>
        : (
          <div className="ct-xr-km-ds">
            {ds.map((m) => {
              const g = traUI(m.giayPhep);
              return (
                <div key={m.id} className="ct-xr-km-o" data-canh={g.dienDuoc ? undefined : '1'}>
                  <b title={m.ten}>{m.ten}</b>
                  <span className="ct-xr-km-gp" data-dien={g.dienDuoc ? '1' : undefined}>
                    {dich(g.ten)}
                    {/* Nói thẳng cái KHÔNG BIẾT. Tệp kèm mất mà vẫn hiện như
                        mọi mẫu khác thì cái kho này thành vô dụng đúng lúc nó
                        cần nhất. */}
                    {!m.coGiayPhep && ` · ${dich('mất tệp giấy phép')}`}
                  </span>
                  <code>
                    {(m.byte / 1e6).toFixed(1)} MB
                    {m.tacGia ? ` · ${m.tacGia}` : ''}
                  </code>
                  <div className="ct-xr-km-nut">
                    <button type="button" className="ct-btn ct-btn-ghost"
                      disabled={dangDung !== null} onClick={() => void dung(m)}>
                      {dangDung === m.tep ? <Loader2 size={13} className="ct-xoay" aria-hidden />
                                          : <Music4 size={13} aria-hidden />}
                      {dich('Dùng bài này')}
                    </button>
                    <button type="button" className="ct-xr-x" aria-label={dich('Xoá khỏi kho')}
                      onClick={() => void xoa(m.tep)}>
                      <Trash2 size={13} aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
