import { useEffect, useRef, useState } from 'react';
import type { BaiNhacHienThi, TrangThaiApp, TuyChonViec, ViecHienThi } from '../shared/ipc';
import type { LoaiNhacNen, NgonNgu, Nhip } from '../shared/hopDong';
import { dinhDangThoiLuong } from '../shared/tenTep';
import { giayDaTroi } from '../shared/trangThai';
import { Icon, Robot } from './Hinh';

const NGON_NGU: Array<[NgonNgu, string]> = [['auto', 'Tự nhận'], ['zh', 'Tiếng Trung'], ['en', 'Tiếng Anh']];
const NHAC: Array<[LoaiNhacNen, string]> = [['goc', 'Giữ nhạc gốc'], ['thu-vien', 'Từ thư viện'], ['tep', 'Nhạc của tôi'], ['khong', 'Không nhạc']];

function useBayGio(): number {
  const [t, datT] = useState(Date.now());
  useEffect(() => {
    const h = window.setInterval(() => datT(Date.now()), 1000);
    return () => window.clearInterval(h);
  }, []);
  return t;
}

export function TrangChu({ s, baoToast, moPhat }: { s: TrangThaiApp; baoToast: (m: string) => void; moPhat: (id: string) => void }) {
  const [link, datLink] = useState('');
  const [lang, datLang] = useState<NgonNgu>(s.caiDat.ngonNgu);
  const [goc, datGoc] = useState(s.caiDat.goc);
  const [nhip, datNhip] = useState<Nhip>(s.caiDat.nhip);
  const [tenVideo, datTenVideo] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [keo, datKeo] = useState(0);
  const nhacNen = s.caiDat.nhacNen;

  const tuyChon = (): TuyChonViec => ({ lang, goc, nhip, nhacNen, ...(tenVideo.trim() ? { tenVideo: tenVideo.trim() } : {}) });

  const ketQua = (r: { ok: boolean; loi?: string }, thanhCong: string) => {
    if (r.ok) { datLoi(null); datTenVideo(''); baoToast(thanhCong); } else if (r.loi) datLoi(r.loi);
  };

  const guiLink = async () => {
    if (!link.trim()) return;
    datDangGui(true);
    const r = await window.ctlt.taoViecLink(link.trim(), tuyChon());
    datDangGui(false);
    if (r.ok) datLink('');
    ketQua(r, 'Đã gửi link cho trạm lồng tiếng.');
  };

  const chonTep = async () => ketQua(await window.ctlt.chonTep(tuyChon()), 'Đang tải video lên…');

  // Kéo thả: cả cửa sổ là vùng thả (đếm enter/leave vì sự kiện nổi bọt qua phần tử con).
  useEffect(() => {
    const coTep = (e: DragEvent) => !!e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files');
    const vao = (e: DragEvent) => { if (coTep(e)) { e.preventDefault(); datKeo((n) => n + 1); } };
    const ra = (e: DragEvent) => { if (coTep(e)) datKeo((n) => Math.max(0, n - 1)); };
    const tren = (e: DragEvent) => { if (coTep(e)) e.preventDefault(); };
    const tha = (e: DragEvent) => {
      e.preventDefault();
      datKeo(0);
      const ds = Array.from(e.dataTransfer?.files ?? []);
      if (ds.length) void window.ctlt.keoThaTep(ds, tuyChon()).then((r) => ketQua(r, `Đang tải ${ds.length} video lên…`));
    };
    window.addEventListener('dragenter', vao);
    window.addEventListener('dragleave', ra);
    window.addEventListener('dragover', tren);
    window.addEventListener('drop', tha);
    return () => {
      window.removeEventListener('dragenter', vao);
      window.removeEventListener('dragleave', ra);
      window.removeEventListener('dragover', tren);
      window.removeEventListener('drop', tha);
    };
  });

  const dangChay = s.viec.filter((v) => v.hienThi.dangChay).length;

  return (
    <div className="trang">
      <h1>Lồng tiếng video</h1>
      <p className="phu">Dán link hoặc thả video — trạm ở nhà tách giọng, dịch và đọc lại bằng giọng Việt, rồi app tự tải về.</p>
      {s.loiMang && <div className="bao-mang">Mất kết nối máy chủ: {s.loiMang} — app sẽ tự thử lại.</div>}

      <section className="the">
        <form className="o-link" onSubmit={(e) => { e.preventDefault(); void guiLink(); }}>
          <span className="bieu-tuong">{Icon.link(20)}</span>
          <input
            className="o-nhap"
            placeholder="Dán link video (YouTube, Bilibili…)"
            value={link}
            onChange={(e) => datLink(e.target.value)}
            spellCheck={false}
            aria-label="Link video"
          />
          <button className="nut chinh lon" disabled={dangGui || !link.trim()}>{Icon.micro(18)} Lồng tiếng</button>
        </form>
        <div className="tuy-chon">
          <div>
            <label className="ten">Ngôn ngữ gốc</label>
            <div className="phan-doan" role="group" aria-label="Ngôn ngữ gốc">
              {NGON_NGU.map(([k, t]) => <button key={k} type="button" aria-pressed={lang === k} onClick={() => datLang(k)}>{t}</button>)}
            </div>
          </div>
          <div>
            <label className="ten" htmlFor="goc">Giữ giọng gốc nhỏ</label>
            <div className="thanh-truot">
              <input id="goc" type="range" min={0} max={40} step={5} value={Math.round(goc * 100)} onChange={(e) => datGoc(Number(e.target.value) / 100)} />
              <output>{Math.round(goc * 100)}%</output>
            </div>
          </div>
          <div>
            <label className="ten" htmlFor="ten-video">Tên video (tuỳ chọn)</label>
            <input id="ten-video" className="o-nhap" style={{ height: 34 }} placeholder="Để trống = lấy tên gốc" value={tenVideo} onChange={(e) => datTenVideo(e.target.value)} />
          </div>
          <div>
            <label className="ten">Nhịp đọc</label>
            <div className="phan-doan" role="group" aria-label="Nhịp đọc">
              <button type="button" aria-pressed={nhip === 'cho-giong'} onClick={() => datNhip('cho-giong')}>Video chờ giọng</button>
              <button type="button" aria-pressed={nhip === 'tang-toc'} onClick={() => datNhip('tang-toc')}>Tăng tốc giọng</button>
            </div>
            <div className="goi-y">
              {nhip === 'cho-giong' ? 'Đọc thong thả, video tự kéo dài chỗ cần (khuyên dùng).' : 'Giữ đúng thời lượng video gốc.'}
            </div>
          </div>
          <NhacNenChon s={s} baoToast={baoToast} />
        </div>
      </section>

      <div className={`vung-tha${keo ? ' dang-keo' : ''}`}>
        <span className="bieu">{Icon.taiLen(22)}</span>
        <div>
          <b>Kéo thả video vào đây</b>
          <span>Một hoặc nhiều tệp mp4, mkv, webm, mov… Mỗi tệp là một việc riêng.</span>
        </div>
        <button className="nut" onClick={() => void chonTep()}>{Icon.tep(16)} Chọn tệp…</button>
      </div>
      {loi && <div className="loi-thanh" role="alert">{loi}<button className="nut trong nho" onClick={() => datLoi(null)}>Đóng</button></div>}

      <div className="dau-muc">
        <h2>Hàng việc</h2>
        <span className="dem">{s.viec.length ? `${s.viec.length} việc${dangChay ? ` · ${dangChay} đang chạy` : ''}` : ''}</span>
        <button className="nut trong nho" onClick={() => void window.ctlt.lamMoi()}>{Icon.thuLai(14)} Làm mới</button>
      </div>
      {s.viec.length === 0 ? (
        <div className="trong-rong the">
          <Robot size={72} />
          <div>Chưa có việc nào. Dán một link ở trên để bắt đầu.</div>
        </div>
      ) : (
        <div className="ds-viec">
          {s.viec.map((v) => <TheViec key={v.id} v={v} baoToast={baoToast} moPhat={moPhat} />)}
        </div>
      )}
      {keo > 0 && <div className="phu-toan-trang">Thả để lồng tiếng {Icon.taiLen(22)}</div>}
    </div>
  );
}

function NhacNenChon({ s, baoToast }: { s: TrangThaiApp; baoToast: (m: string) => void }) {
  const n = s.caiDat.nhacNen;
  const [ds, datDs] = useState<BaiNhacHienThi[] | null>(null);
  const [loiDs, datLoiDs] = useState<string | null>(null);
  const [dangNghe, datDangNghe] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [amLuong, datAmLuong] = useState(n.amLuong);

  const luu = (p: Partial<typeof n>) => void window.ctlt.luuCaiDat({ nhacNen: { ...n, ...p } });

  useEffect(() => {
    if (n.loai !== 'thu-vien' || ds) return;
    void window.ctlt.dsNhac().then((r) => { datDs(r.ds); datLoiDs(r.ok ? null : r.loi ?? 'Không tải được thư viện nhạc.'); });
  }, [n.loai, ds]);

  useEffect(() => () => { audio.current?.pause(); }, []);

  const nghe = (b: BaiNhacHienThi) => {
    if (!b.nghiThu) return;
    if (dangNghe === b.id) { audio.current?.pause(); datDangNghe(null); return; }
    audio.current?.pause();
    const a = new Audio(b.nghiThu);
    a.volume = Math.max(0.05, amLuong);
    a.onended = () => datDangNghe(null);
    a.onerror = () => { datDangNghe(null); baoToast('Không phát được bản nghe thử.'); };
    audio.current = a;
    void a.play().then(() => datDangNghe(b.id), () => datDangNghe(null));
  };

  const chonLoai = async (loai: LoaiNhacNen) => {
    if (loai === 'tep' && !s.caiDat.nhacNenTep) {
      const r = await window.ctlt.chonNhacTep();
      if (!r.ok) { if (r.loi) baoToast(r.loi); return; }
      return;
    }
    if (loai === 'thu-vien') { luu({ loai, id: n.id ?? ds?.[0]?.id ?? null }); return; }
    luu({ loai, id: null });
  };

  const tenTep = s.caiDat.nhacNenTep?.split(/[\\/]/).pop() ?? null;

  return (
    <div className="cot-doi">
      <label className="ten">Nhạc nền</label>
      <div className="phan-doan" role="group" aria-label="Nhạc nền">
        {NHAC.map(([k, t]) => <button key={k} type="button" aria-pressed={n.loai === k} onClick={() => void chonLoai(k)}>{t}</button>)}
      </div>
      {n.loai !== 'khong' && (
        <div className="thanh-truot" style={{ marginTop: 8 }}>
          <span className="goi-y" style={{ margin: 0 }}>Âm lượng</span>
          <input type="range" min={0} max={100} step={5} value={Math.round(amLuong * 100)} aria-label="Âm lượng nhạc nền"
            onChange={(e) => { const v = Number(e.target.value) / 100; datAmLuong(v); if (audio.current) audio.current.volume = Math.max(0.05, v); }}
            onPointerUp={() => luu({ amLuong })} onKeyUp={() => luu({ amLuong })} />
          <output>{Math.round(amLuong * 100)}%</output>
        </div>
      )}
      {n.loai === 'tep' && (
        <div className="goi-y" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon.tep(14)} {tenTep ?? 'Chưa chọn tệp'}
          <button type="button" className="nut trong nho" onClick={() => void window.ctlt.chonNhacTep()}>Đổi…</button>
        </div>
      )}
      {n.loai === 'thu-vien' && (
        <div className="ds-nhac" role="listbox" aria-label="Thư viện nhạc nền">
          {loiDs && <div className="goi-y" style={{ padding: 10 }}>{loiDs}</div>}
          {!ds && !loiDs && <div className="goi-y" style={{ padding: 10 }}>Đang tải thư viện nhạc…</div>}
          {ds?.map((b) => (
            <div key={b.id} className="bai-nhac" role="option" aria-selected={n.id === b.id} onClick={() => luu({ loai: 'thu-vien', id: b.id })}>
              <button type="button" className="nut-phat" aria-label={dangNghe === b.id ? 'Dừng nghe thử' : 'Nghe thử'} disabled={!b.nghiThu}
                onClick={(e) => { e.stopPropagation(); nghe(b); }}>
                {dangNghe === b.id ? Icon.dung(14) : Icon.phat(14)}
              </button>
              <div>
                <div className="ten-bai">{b.ten}</div>
                <div className="meta">{[b.tamTrang, b.giay ? dinhDangThoiLuong(b.giay) : null].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="giay-phep">{b.giayPhep ?? 'Chưa rõ giấy phép'}{b.nguon && <><br />{b.nguon}</>}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TEN_NGON_NGU: Record<string, string> = { auto: 'Tự nhận', zh: 'Trung → Việt', en: 'Anh → Việt' };

function TheViec({ v, baoToast, moPhat }: { v: ViecHienThi; baoToast: (m: string) => void; moPhat: (id: string) => void }) {
  const bayGio = useBayGio();
  const h = v.hienThi;
  const [ban, datBan] = useState(false);
  const lam = async (fn: () => Promise<{ ok: boolean; loi?: string }>) => {
    datBan(true);
    const r = await fn();
    datBan(false);
    if (!r.ok && r.loi) baoToast(r.loi);
  };
  const huy = () => {
    const cauHoi = h.dangChay ? `Huỷ việc "${v.tieuDe}"? Tệp trên máy chủ sẽ bị xoá.` : `Xoá "${v.tieuDe}" khỏi hàng việc? (Video đã tải về vẫn giữ.)`;
    if (window.confirm(cauHoi)) void lam(() => window.ctlt.huyViec(v.id));
  };
  const coThanhTienDo = h.dangChay || (h.chip === 'xong' && !v.daTaiVe && h.phanTram !== null);
  return (
    <article className="the the-viec">
      <span className="nguon" title={v.nguon === 'link' ? 'Từ link' : 'Từ tệp'}>{v.nguon === 'link' ? Icon.link(18) : Icon.tep(18)}</span>
      <div className="hang-1">
        <span className="tieu-de chon-duoc" title={v.link ?? v.tieuDe}>{v.tieuDe}</span>
        <span className={`chip ${h.chip}`}>{h.nhan}</span>
      </div>
      <div className="hanh-dong">
        {v.coTheTaiTrenMay && <button className="nut chinh nho" disabled={ban} onClick={() => void lam(() => window.ctlt.taiTrenMay(v.id))}>{Icon.mayTinh(15)} Tải trên máy này</button>}
        {v.coTheTaiVe && <button className="nut chinh nho" disabled={ban} onClick={() => void lam(() => window.ctlt.taiVe(v.id))}>{Icon.taiVe(15)} Tải về</button>}
        {v.coTheThuLai && <button className="nut nho" disabled={ban} onClick={() => void lam(() => window.ctlt.thuLai(v.id))}>{Icon.thuLai(15)} Thử lại</button>}
        {v.mucThuVien && <button className="nut chinh nho" onClick={() => moPhat(v.mucThuVien!)}>{Icon.phat(14)} Xem</button>}
        {v.daTaiVe && <button className="nut trong nho" title="Mở thư mục" aria-label="Mở thư mục" onClick={() => void window.ctlt.moThuMucViec(v.id)}>{Icon.thuMuc(16)}</button>}
        <button className="nut trong nho nguy" disabled={ban} title={h.dangChay ? 'Huỷ' : 'Xoá khỏi hàng'} aria-label={h.dangChay ? 'Huỷ' : 'Xoá'} onClick={huy}>
          {h.dangChay ? Icon.huy(16) : Icon.xoa(16)}
        </button>
      </div>
      <div className="meta">
        <span>{TEN_NGON_NGU[v.lang] ?? v.lang}</span>
        <span>Giọng gốc {Math.round(v.goc * 100)}%</span>
        <span>{v.nhip === 'tang-toc' ? 'Tăng tốc giọng' : 'Video chờ giọng'}</span>
        <span>⏱ {dinhDangThoiLuong(giayDaTroi(v.tao, h.ketThuc ? v.xong : null, bayGio))}</span>
        {v.thoiLuong ? <span>Video {dinhDangThoiLuong(v.thoiLuong)}</span> : null}
      </div>
      {coThanhTienDo && (
        <div className="tien-do">
          <div className="buoc"><span>{h.buoc || '…'}</span><span>{h.phanTram !== null ? `${h.phanTram}%` : ''}</span></div>
          <div className={`thanh-tien-do${h.phanTram === null ? ' vo-dinh' : ''}`}><i style={{ width: `${h.phanTram ?? 0}%` }} /></div>
        </div>
      )}
      {h.chip === 'loi' && h.buoc && <div className="loi-chu">{h.buoc}</div>}
    </article>
  );
}
