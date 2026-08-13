'use client';

/**
 * Ảnh bài giảng / đề bài → Word · PDF
 * ─────────────────────────────────────────────────────────────────────────
 * Luồng có BA bước, và bước giữa là bước quan trọng nhất:
 *
 *      chọn ảnh + dặn dò  →  MÁY CHÉP  →  NGƯỜI XEM LẠI & SỬA  →  tải file
 *
 * Đo ngày 13/08/2026: model chép đúng gần hết ký hiệu toán, kể cả trên ảnh
 * chụp lệch và nén nát, nhưng vẫn sót cỡ một chỗ nhỏ mỗi trang. Với đề kiểm
 * tra và giáo án thì một con số sai lọt vào file là hỏng việc thật — nên
 * KHÔNG có nút "ảnh → Word" một phát ăn ngay. Bản chép phải qua mắt người
 * dùng, và ô sửa nằm ngay cạnh ô xem trước để soi cho nhanh.
 *
 * PDF được IN ra từ chính ô xem trước (`window.print()` + CSS @media print),
 * chứ không dựng ở máy chủ: trình duyệt đã có sẵn bộ dàn trang thật, cho ra
 * PDF chữ vector nét căng, và máy chủ không phải cõng thêm Chrome.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { docToolsApi, type CheDoHinh, type TrangChep } from '@/lib/api';
import MathPreview from '@/components/tools/MathPreview';
import { useAuthStore } from '@/store/authStore';

interface AnhChon {
  file: File;
  url: string;
  id: string;
}

type TrangThai = 'cho' | 'dang-chay' | 'xong' | 'loi';

interface TienDo {
  [id: string]: TrangThai;
}

const VI_DU_GHI_CHU = `Ví dụ:
- Trong ảnh phân số viết bằng dấu / — hãy đổi thành phân số ngang.
- Chữ "căn" viết thành dấu căn thật.
- Bỏ qua phần chữ viết tay màu đỏ ở lề.`;

/**
 * Lỗi trần trụi của axios ("Request failed with status code 401") không nói
 * cho người dùng biết phải làm gì. Dịch những mã hay gặp sang việc cần làm.
 */
function docLoi(e: unknown): string {
  const err = e as { response?: { status?: number; data?: { message?: string } }; message?: string; code?: string };
  const status = err?.response?.status;
  if (status === 401) return 'Phiên đăng nhập đã hết. Đăng nhập lại rồi bấm chuyển đổi lần nữa.';
  if (status === 429) return 'Bạn gửi quá nhanh. Chờ một chút rồi thử lại.';
  if (status === 413) return 'Ảnh quá nặng. Chụp lại ở mức thường hoặc giảm dung lượng.';
  if (err?.code === 'ECONNABORTED') return 'Quá lâu không có trả lời. Thử lại với ít ảnh hơn, hoặc tắt chế độ vẽ lại hình.';
  return err?.response?.data?.message || err?.message || 'Lỗi không rõ';
}

export default function ImageToDocPage() {
  const { user, isHydrated } = useAuthStore();
  const [anhs, setAnhs] = useState<AnhChon[]>([]);
  const [presets, setPresets] = useState<string[]>(['math']);
  const [danhSachPreset, setDanhSachPreset] = useState<{ id: string; label: string; hint: string }[]>([]);
  const [cheDoHinh, setCheDoHinh] = useState<CheDoHinh>('bo-qua');
  const [note, setNote] = useState('');
  const [tieuDe, setTieuDe] = useState('');
  const [dangChay, setDangChay] = useState(false);
  const [tienDo, setTienDo] = useState<TienDo>({});
  const [trangs, setTrangs] = useState<TrangChep[]>([]);
  const [banSua, setBanSua] = useState<string>('');
  const [loi, setLoi] = useState<string | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [thongBaoTai, setThongBaoTai] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    docToolsApi
      .presets()
      .then((r) => setDanhSachPreset(r.data.data.presets))
      .catch(() => setDanhSachPreset([]));
  }, []);

  // Ảnh preview là object URL — không thu hồi thì mỗi lần chọn lại là một mảng
  // bộ nhớ nữa không ai trả.
  useEffect(() => () => anhs.forEach((a) => URL.revokeObjectURL(a.url)), [anhs]);

  const themAnh = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    setLoi(null);
    setAnhs((truoc) => {
      const them = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => ({ file: f, url: URL.createObjectURL(f), id: `${f.name}-${f.size}-${f.lastModified}` }))
        .filter((a) => !truoc.some((t) => t.id === a.id));
      const gop = [...truoc, ...them];
      if (gop.length > 10) setLoi('Tối đa 10 ảnh mỗi lần — những ảnh vượt quá đã bị bỏ.');
      return gop.slice(0, 10);
    });
  }, []);

  const xoaAnh = (id: string) => setAnhs((t) => t.filter((a) => a.id !== id));

  const doiCho = (i: number, huong: -1 | 1) => {
    setAnhs((t) => {
      const j = i + huong;
      if (j < 0 || j >= t.length) return t;
      const ra = [...t];
      [ra[i], ra[j]] = [ra[j], ra[i]];
      return ra;
    });
  };

  const chuyenDoi = async () => {
    if (!anhs.length || dangChay) return;
    setDangChay(true);
    setLoi(null);
    setTrangs([]);
    setTienDo(Object.fromEntries(anhs.map((a) => [a.id, 'cho' as TrangThai])));

    const ketQua: TrangChep[] = [];
    // Hai luồng song song: đủ nhanh mà không nện cổng LLM, và vẫn giữ được
    // thứ tự trang vì mỗi kết quả mang theo chỉ số của nó.
    const hangDoi = anhs.map((a, i) => ({ ...a, i }));
    let ke = 0;
    const chay = async (): Promise<void> => {
      for (;;) {
        const k = ke++;
        if (k >= hangDoi.length) return;
        const item = hangDoi[k];
        setTienDo((t) => ({ ...t, [item.id]: 'dang-chay' }));
        try {
          const r = await docToolsApi.transcribe(item.file, { presets, note, cheDoHinh });
          const trang = r.data.data.trang[0];
          ketQua.push({ ...trang, chiSo: item.i, ten: item.file.name });
          setTienDo((t) => ({ ...t, [item.id]: trang.loi ? 'loi' : 'xong' }));
        } catch (e) {
          ketQua.push({ chiSo: item.i, ten: item.file.name, vanBan: '', hinhVeLai: [], soChoNgo: 0, loi: docLoi(e) });
          setTienDo((t) => ({ ...t, [item.id]: 'loi' }));
        }
      }
    };

    await Promise.all([chay(), chay()]);
    ketQua.sort((a, b) => a.chiSo - b.chiSo);
    setTrangs(ketQua);
    setBanSua(ketQua.filter((t) => !t.loi).map((t) => t.vanBan).join('\n\n'));
    setDangChay(false);

    const hong = ketQua.filter((t) => t.loi);
    if (hong.length) setLoi(`${hong.length}/${ketQua.length} trang không chép được: ${hong[0].loi}`);
  };

  const hinhTatCa = useMemo(
    () =>
      trangs.flatMap((t, i) =>
        t.hinhVeLai.map((h, k) => ({
          pngBase64: h.pngBase64,
          chuThich: `Hình ${i + 1}.${k + 1} — máy vẽ lại, cần đối chiếu ảnh gốc`,
        })),
      ),
    [trangs],
  );

  const tongTien = useMemo(() => trangs.reduce((s, t) => s + (t.costUsd ?? 0), 0), [trangs]);
  const tongChoNgo = useMemo(() => trangs.reduce((s, t) => s + t.soChoNgo, 0), [trangs]);

  const taiWord = async () => {
    if (!banSua.trim() || dangTai) return;
    setDangTai(true);
    setThongBaoTai(null);
    try {
      const r = await docToolsApi.exportDocx({ tieuDe, vanBan: banSua, hinh: hinhTatCa });
      const hong = Number(r.headers['x-cong-thuc-hong'] ?? 0);
      const tong = Number(r.headers['x-cong-thuc-tong'] ?? 0);
      const url = URL.createObjectURL(r.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tieuDe.trim() || 'ban-chep'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setThongBaoTai(
        hong > 0
          ? `Đã tải. ⚠️ ${hong}/${tong} công thức không dựng được thành công thức Word — chúng nằm trong file dưới dạng chữ nghiêng, cần sửa tay.`
          : `Đã tải. ${tong} công thức đều là công thức Word thật (bấm vào sửa được).`,
      );
    } catch (e) {
      setThongBaoTai(`Không tải được file: ${docLoi(e)}`);
    } finally {
      setDangTai(false);
    }
  };

  if (isHydrated && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center" style={{ color: 'var(--text-primary)' }}>
        <h1 className="text-2xl font-bold mb-3">Cần đăng nhập</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
          Công cụ này gọi AI để đọc ảnh nên cần tài khoản, để tính hạn mức theo từng người.
        </p>
        <Link href="/login" className="px-5 py-2.5 rounded-lg font-medium text-white inline-block" style={{ background: 'var(--accent-color)' }}>
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    // `pt-16` = chừa chỗ cho thanh điều hướng CỐ ĐỊNH cao 4rem, giống /cv,
    // /notes, /interview. Thiếu nó thì tiêu đề chui xuống dưới navbar.
    // Đệm đáy theo `--app-chrome-bottom` để thanh dưới trên điện thoại không
    // che mất nút cuối trang.
    <div
      className="max-w-[1400px] mx-auto px-4 pt-16 pb-[calc(2rem+var(--app-chrome-bottom,0px))]"
      style={{ color: 'var(--text-primary)' }}
    >
      <div className="mb-6 mt-6 khong-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Ảnh bài giảng → Word / PDF</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm md:text-base">
          Chụp trang đề, trang bài giảng — máy chép lại thành văn bản, giữ đúng phân số, căn, mũ, tích phân. Công thức
          trong file Word là công thức Word thật, bấm vào sửa được.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-6">
        {/* ─── Cột trái: chọn ảnh + dặn dò ─── */}
        <div className="space-y-5 khong-in">
          <section className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="font-semibold mb-3">1. Chọn ảnh (tối đa 10)</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                themAnh(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg p-6 text-center cursor-pointer transition-colors"
              style={{ border: '2px dashed var(--border-color)', background: 'var(--bg-surface)' }}
            >
              <div className="text-3xl mb-1">🖼️</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Kéo ảnh vào đây hoặc bấm để chọn
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                JPG, PNG, HEIC — mỗi ảnh tối đa 12MB. Chụp thẳng, đủ sáng, không che mất chữ.
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                themAnh(e.target.files);
                e.target.value = '';
              }}
            />

            {anhs.length > 0 && (
              <ul className="mt-3 space-y-2">
                {anhs.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-3 rounded-lg p-2" style={{ background: 'var(--bg-surface)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.url} alt="" className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{i + 1}. {a.file.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {(a.file.size / 1024 / 1024).toFixed(1)}MB
                        {tienDo[a.id] === 'dang-chay' && ' · đang chép…'}
                        {tienDo[a.id] === 'xong' && ' · ✅ xong'}
                        {tienDo[a.id] === 'loi' && ' · ❌ lỗi'}
                      </div>
                    </div>
                    <button onClick={() => doiCho(i, -1)} disabled={i === 0} className="px-1.5 text-sm disabled:opacity-30" title="Lên">↑</button>
                    <button onClick={() => doiCho(i, 1)} disabled={i === anhs.length - 1} className="px-1.5 text-sm disabled:opacity-30" title="Xuống">↓</button>
                    <button onClick={() => xoaAnh(a.id)} className="px-1.5 text-sm" style={{ color: '#dc2626' }} title="Bỏ ảnh">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="font-semibold mb-3">2. Dặn máy cách viết ký hiệu</h2>
            <div className="space-y-2">
              {danhSachPreset.map((p) => (
                <label key={p.id} className="flex gap-2.5 items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={presets.includes(p.id)}
                    onChange={(e) =>
                      setPresets((t) => (e.target.checked ? [...t, p.id] : t.filter((x) => x !== p.id)))
                    }
                    className="mt-1"
                  />
                  <span>
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            <label className="block mt-4 text-sm font-medium">Ghi chú riêng (máy đọc trước khi chép)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder={VI_DU_GHI_CHU}
              className="w-full mt-1.5 rounded-lg p-2.5 text-sm font-mono"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Ghi chú này thắng mọi ô đã tích ở trên nếu mâu thuẫn.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="font-semibold mb-3">3. Trang có hình vẽ?</h2>
            {(
              [
                ['bo-qua', 'Không xử lý hình', 'Nhanh nhất. Chỗ có hình chỉ ghi [HÌNH]; bạn tự chèn ảnh gốc vào file sau.'],
                ['mo-ta', 'Mô tả hình bằng lời', 'Ghi lại điểm, nét đứt, ký hiệu góc vuông, số đo trên cạnh.'],
                ['ve-lai', 'Vẽ lại hình', 'Dựng lại hình nét chèn vào file. Chậm hơn ~4 lần và PHẢI đối chiếu ảnh gốc — máy có thể thêm ký hiệu nó suy ra từ lời đề chứ không có trong hình.'],
              ] as const
            ).map(([id, label, hint]) => (
              <label key={id} className="flex gap-2.5 items-start cursor-pointer mb-2">
                <input type="radio" name="chedohinh" checked={cheDoHinh === id} onChange={() => setCheDoHinh(id)} className="mt-1" />
                <span>
                  <span className="text-sm font-medium">{label}</span>
                  <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</span>
                </span>
              </label>
            ))}
          </section>

          <button
            onClick={chuyenDoi}
            disabled={!anhs.length || dangChay}
            className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--accent-color)' }}
          >
            {dangChay ? `Đang chép… (${Object.values(tienDo).filter((t) => t === 'xong' || t === 'loi').length}/${anhs.length})` : `Chuyển ${anhs.length || ''} ảnh thành văn bản`}
          </button>
          {dangChay && (
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Mỗi trang mất 15–30 giây, trang có vẽ lại hình lâu hơn. Đừng đóng tab.
            </p>
          )}
          {loi && <p className="text-sm" style={{ color: '#dc2626' }}>{loi}</p>}
        </div>

        {/* ─── Cột phải: sửa + xem trước ─── */}
        <div className="space-y-4">
          {trangs.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center khong-in"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}
            >
              Kết quả sẽ hiện ở đây: bên trái để sửa, bên phải xem trước đúng như lúc in.
            </div>
          ) : (
            <>
              <div className="rounded-xl p-4 khong-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <input
                    value={tieuDe}
                    onChange={(e) => setTieuDe(e.target.value)}
                    placeholder="Tiêu đề tài liệu (đặt tên file)"
                    className="flex-1 min-w-[200px] rounded-lg px-3 py-2 text-sm"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={taiWord}
                    disabled={dangTai}
                    className="px-4 py-2 rounded-lg font-medium text-white text-sm disabled:opacity-50"
                    style={{ background: '#2b579a' }}
                  >
                    {dangTai ? 'Đang dựng…' : '⬇ Tải Word (.docx)'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-lg font-medium text-sm"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    title="Hộp thoại in → chọn “Lưu thành PDF”"
                  >
                    🖨 Xuất PDF
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{trangs.length} trang</span>
                  <span>≈ {(tongTien * 26000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</span>
                  {tongChoNgo > 0 && <span style={{ color: '#d97706' }}>⚠️ {tongChoNgo} chỗ máy không đọc chắc — tìm dấu [?] và sửa</span>}
                  {hinhTatCa.length > 0 && <span>{hinhTatCa.length} hình vẽ lại</span>}
                </div>
                {thongBaoTai && (
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{thongBaoTai}</p>
                )}
              </div>

              <div className="grid xl:grid-cols-2 gap-4">
                <div className="khong-in">
                  <label className="text-sm font-medium mb-1.5 block">Sửa ở đây</label>
                  <textarea
                    value={banSua}
                    onChange={(e) => setBanSua(e.target.value)}
                    rows={28}
                    spellCheck={false}
                    className="w-full rounded-xl p-3 text-sm font-mono leading-relaxed"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Công thức nằm trong $…$. Sửa xong là ô bên phải đổi theo.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block khong-in">Xem trước (đúng như lúc in)</label>
                  <div className="vung-in rounded-xl overflow-auto" style={{ maxHeight: '80vh' }}>
                    <MathPreview vanBan={banSua} hinh={hinhTatCa} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trang giấy + CSS in. Nền trắng chữ đen CỐ ĐỊNH, không theo theme —
          in bản theme tối ra giấy thì chữ xám trên nền trắng, gần như mất chữ. */}
      <style jsx global>{`
        .mp-giay {
          background: #ffffff;
          color: #111111;
          font-family: 'Times New Roman', Times, serif;
          font-size: 15px;
          line-height: 1.9;
          padding: 28px 32px;
        }
        .mp-giay h2 { font-size: 19px; font-weight: 700; text-align: center; margin: 4px 0 14px; }
        .mp-giay h3 { font-size: 16px; font-weight: 700; margin: 12px 0 6px; }
        .mp-giay p { margin: 0 0 8px; }
        .mp-giay .mp-gach { padding-left: 14px; }
        .mp-giay .mp-hinh { color: #555; border-left: 3px solid #ccc; padding-left: 10px; margin: 8px 0; }
        .mp-giay .mp-anh { margin: 14px 0; text-align: center; }
        .mp-giay .mp-anh img { max-width: 100%; height: auto; }
        .mp-giay .mp-anh figcaption { font-size: 12px; color: #666; font-style: italic; margin-top: 4px; }
        .mp-giay .katex { font-size: 1.05em; }
        .mp-giay .katex-display { margin: 10px 0; }

        @media print {
          @page { size: A4; margin: 16mm 14mm; }
          body { background: #fff !important; }
          .khong-in, nav, header, footer { display: none !important; }
          .vung-in { max-height: none !important; overflow: visible !important; border: none !important; }
          .mp-giay { padding: 0; font-size: 13pt; }
        }
      `}</style>
    </div>
  );
}
