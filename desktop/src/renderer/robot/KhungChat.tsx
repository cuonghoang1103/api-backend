/**
 * ============================================================
 * KHUNG CHAT MINI CỦA ROBOT NỔI ("Trợ lý")
 * ============================================================
 *
 * Tách khỏi `robot.tsx` 03/10/2026 khi thêm KỸ NĂNG (chip Ảnh · Code · Toán ·
 * Tiếng Anh · Tiếng Nhật · Tiếng Việt). Mọi lời gọi máy chủ vẫn đi qua MAIN —
 * cửa sổ robot chạy ở origin `app://`, không giữ phiên đăng nhập và vướng CORS
 * (xem `robot:hoi` bên `main/ipc/robot.ts`).
 *
 * ⚠️ KHUNG NÀY KHÔNG BỊ THÁO KHI THU GỌN. Người dùng hỏi một câu dài rồi thu
 * khung lại để làm việc khác — tháo component là vứt luôn câu trả lời đang về.
 * Nay nó chỉ ẩn (`an`), câu trả lời về khi khung đang ẩn thì robot báo bằng
 * bong bóng "Xong rồi nè" (`onXong`), bấm vào là mở lại đúng chỗ.
 */
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { dich, dichP } from '../i18n';
import { KY_NANG, tenKyNang } from './kyNang';
import type { RobotKyNang } from '../../shared/ipc';

/**
 * Bộ dựng markdown của app chính — DÙNG LẠI, không viết bản thứ hai: markdown,
 * khối mã tô màu (highlight.js), công thức (KaTeX), mermaid. `lazy` vì nó kéo
 * ~600KB mà cửa sổ robot phần lớn thời gian chỉ là con robot nhỏ ở góc.
 */
const ChuAgent = lazy(() => import('../features/chat/markdown').then((m) => ({ default: m.ChuAgent })));

/** Ba bậc, khớp `CHAT_MODELS` bên máy chủ. */
const BAC = [
  { id: 'cuongmini-max', ten: 'CuongMini Max' },
  { id: 'cuongmini-pro', ten: 'CuongMini Pro' },
  { id: 'cuongmini-3.11', ten: 'CuongMini 3.11' },
] as const;

/* Mặc định MAX theo yêu cầu người dùng; chưa Pro thì máy chủ tự rơi bậc và
   khung NÓI RA điều đó (`roiBac`). */
const BAC_MAC_DINH = 'cuongmini-max';
const KHOA_BAC = 'ct-robot-bac';
const KHOA_KY_NANG = 'ct-robot-ky-nang';

/** Trần ảnh: khớp lược đồ IPC (4 ảnh, 8MB mỗi ảnh). */
const TOI_DA_ANH = 4;

interface Luot { toi: boolean; chu: string; anh?: string[]; kyNang?: string | null; loi?: boolean }

/** Bài cửa sổ chính đang mở — main chuyển sang qua `robot:baiHoc`. */
interface BaiHoc {
  lessonId: number;
  courseCode?: string;
  courseTitle?: string;
  lessonTitle?: string;
  slides?: { so: number; tong: number; bo: string; ten: string }[];
}

/** Gợi ý mở màn của gia sư — CÙNG `key` với web để dùng chung cache câu trả lời. */
const GOI_Y_BAI: { key: string; q: string }[] = [
  { key: 'start', q: 'Bài này học gì? Tôi nên bắt đầu từ đâu?' },
  { key: 'exercises', q: 'Cho tôi 3 bài tập luyện + đáp án để tự kiểm tra.' },
  { key: 'prereq', q: 'Kiến thức nền nào cần có trước khi học bài này?' },
  { key: 'hard', q: 'Giảng lại phần khó nhất của bài một cách dễ hiểu.' },
];

function docLuu(khoa: string, macDinh: string): string {
  try { return localStorage.getItem(khoa) ?? macDinh; } catch { return macDinh; }
}
function ghiLuu(khoa: string, v: string): void {
  try { localStorage.setItem(khoa, v); } catch { /* chế độ riêng tư */ }
}

export interface KhungChatProps {
  /** Khung đang thu gọn (vẫn sống, chỉ ẩn). */
  an: boolean;
  onDong: () => void;
  /** Nắm thanh tiêu đề để kéo CẢ khung. */
  onKeoKhung: (e: React.PointerEvent<HTMLElement>) => void;
  /** Đang chờ máy chủ ⇒ robot ra dáng đang nghĩ. */
  onDangCho: (cho: boolean) => void;
  /** Một lượt vừa xong — robot vui/bối rối, và báo nếu khung đang ẩn. */
  onXong: (kq: { ok: boolean; chu: string }) => void;
}

export function KhungChat({ an, onDong, onKeoKhung, onDangCho, onXong }: KhungChatProps) {
  const [nhap, datNhap] = useState('');
  const [luot, datLuot] = useState<Luot[]>([]);
  const [dangCho, datDangCho] = useState(false);
  const [bac, datBac] = useState<string>(() => docLuu(KHOA_BAC, BAC_MAC_DINH));
  const [kyNang, datKyNang] = useState<RobotKyNang>(() => {
    const v = docLuu(KHOA_KY_NANG, 'tu-dong');
    return (KY_NANG.find((k) => k.id === v)?.id ?? 'tu-dong');
  });
  const [anh, datAnh] = useState<string[]>([]);
  const [phienId, datPhienId] = useState<string | null>(null);
  const [moSu, datMoSu] = useState(false);
  const [su, datSu] = useState<Array<{ id: string; ten: string; luc: string; so: number }>>([]);
  const [bao, datBao] = useState<string | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);
  const oNhapRef = useRef<HTMLTextAreaElement>(null);
  const chonTepRef = useRef<HTMLInputElement>(null);

  useEffect(() => { onDangCho(dangCho); }, [dangCho, onDangCho]);

  /* Mở lại khung ⇒ đưa con trỏ vào ô nhập ngay, khỏi phải bấm thêm một lần. */
  useEffect(() => { if (!an) oNhapRef.current?.focus(); }, [an]);

  /* Ô nhập TỰ GIÃN theo số dòng, tới trần rồi cuộn trong chính nó. Đặt
     `height: auto` TRƯỚC khi đo, không thì xoá bớt chữ mà ô không co lại. */
  /* Đo lại cả khi khung vừa hiện và khi cửa sổ đổi cỡ: lần đo đầu xảy ra lúc
     cửa sổ còn hẹp bằng con robot ⇒ chữ mờ xuống 3 dòng ⇒ ô nhập cao gấp ba
     dù chưa gõ gì (thấy trong ảnh chụp thử 03/10/2026). */
  const [rongCuaSo, datRongCuaSo] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth));
  useEffect(() => {
    const doi = (): void => datRongCuaSo(window.innerWidth);
    window.addEventListener('resize', doi);
    return () => window.removeEventListener('resize', doi);
  }, []);
  useLayoutEffect(() => {
    const el = oNhapRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [nhap, an, rongCuaSo]);

  /*
   * ── GIA SƯ CỦA BÀI ĐANG HỌC ──
   * Cửa sổ chính báo sang qua main (`robot:baiHoc`). Có bài ⇒ mặc định chế độ
   * gia sư; rời trang bài học ⇒ main gửi `null` và khung tự về trợ lý thường.
   */
  const [bai, datBai] = useState<BaiHoc | null>(null);
  const [muonChung, datMuonChung] = useState(false);
  const cheDoGiaSu = !!bai && !muonChung;

  /* Lượt hỏi-đáp vừa xảy ra ở KHUNG DƯỚI BÀI ⇒ ghép vào mạch. Lọc theo
     `lessonId`: lượt của bài CŨ tới muộn mà ghép vào là trộn hai bài. */
  useEffect(() => window.cuongthai?.on('academy:giaSuLuot', (p) => {
    const l = p as { lessonId: number; hoi: string; dap: string };
    if (!bai || l.lessonId !== bai.lessonId || !l.dap) return;
    datLuot((c) => [...c, { toi: true, chu: l.hoi }, { toi: false, chu: l.dap }]);
  }), [bai]);

  useEffect(() => {
    const bo = window.cuongthai?.on('robot:baiHoc', (b) => {
      const moi = (b ?? null) as BaiHoc | null;
      datBai(moi);
      // Đổi sang bài KHÁC ⇒ vứt hội thoại cũ.
      datLuot((c) => (moi && moi.lessonId !== bai?.lessonId ? [] : c));
    });
    return () => { bo?.(); };
  }, [bai?.lessonId]);

  useEffect(() => {
    const el = cuonRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [luot, dangCho, an]);

  const doiBac = (id: string) => { datBac(id); ghiLuu(KHOA_BAC, id); };
  const doiKyNang = (id: RobotKyNang) => {
    datKyNang(id);
    ghiLuu(KHOA_KY_NANG, id);
    oNhapRef.current?.focus();
    /* Chọn "Ảnh" mà chưa có ảnh nào ⇒ mở luôn hộp chọn ảnh: đó là việc kế
       tiếp chắc chắn của người dùng. */
    if (id === 'anh' && anh.length === 0) chonTepRef.current?.click();
  };

  const themAnh = (ds: File[]): void => {
    const con = TOI_DA_ANH - anh.length;
    if (con <= 0) { datBao(dichP('Tối đa {n} ảnh một lượt.', { n: TOI_DA_ANH })); return; }
    for (const f of ds.slice(0, con)) {
      if (!f.type.startsWith('image/')) continue;
      const doc = new FileReader();
      doc.onload = () => {
        const u = typeof doc.result === 'string' ? doc.result : '';
        if (u.startsWith('data:image/')) datAnh((c) => [...c, u].slice(0, TOI_DA_ANH));
      };
      doc.readAsDataURL(f);
    }
  };

  /* Dán ảnh bằng Ctrl/Cmd+V ngay trong ô nhập — chụp màn hình xong dán luôn. */
  const nhanDan = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const tep = [...e.clipboardData.items]
      .filter((x) => x.kind === 'file' && x.type.startsWith('image/'))
      .map((x) => x.getAsFile())
      .filter((x): x is File => x !== null);
    if (tep.length === 0) return;
    e.preventDefault();
    themAnh(tep);
  };

  const moLichSu = async (): Promise<void> => {
    datMoSu((v) => !v);
    if (su.length === 0) {
      const r = await window.cuongthai?.robot.phienDs();
      datSu(r?.ds ?? []);
    }
  };

  const chonPhien = async (id: string): Promise<void> => {
    datMoSu(false);
    datDangCho(true);
    try {
      const r = await window.cuongthai?.robot.phienDoc(id);
      datLuot(r?.luot ?? []);
      datPhienId(id);
      datBao(null);
    } finally {
      datDangCho(false);
    }
  };

  const cuocMoi = (): void => {
    datLuot([]);
    datPhienId(null);
    datAnh([]);
    datBao(null);
    datMoSu(false);
    /* Xoá cả ở MAIN (phiên + vòng nhớ ngữ cảnh), không chỉ trên màn hình. */
    void window.cuongthai?.robot.cuocMoi();
  };

  /** Chuyển lượt vừa xong sang KHUNG GIA SƯ DƯỚI BÀI ở cửa sổ chính. */
  const chuyenLuot = (lessonId: number, hoi: string, dap: string): void => {
    if (!dap) return;
    window.cuongthai?.academy.giaSuLuot({ lessonId, hoi, dap }).catch(() => {});
  };

  /** Hỏi gia sư một câu CÓ SẴN — `cacheKey` dùng chung cache với web. */
  const hoiNhanh = async (cau: string, cacheKey?: string): Promise<void> => {
    if (!bai || dangCho) return;
    datLuot((c) => [...c, { toi: true, chu: cau }]);
    datDangCho(true);
    try {
      const g = await window.cuongthai?.robotGiaSu.hoi({
        lessonId: bai.lessonId, chu: cau, ...(cacheKey ? { cacheKey } : {}),
      });
      const dap = g?.chu || (g?.loi ?? dich('Không nhận được trả lời.'));
      datLuot((c) => [...c, { toi: false, chu: dap, loi: !g?.chu }]);
      onXong({ ok: !!g?.chu, chu: dap });
      if (g?.chu) chuyenLuot(bai.lessonId, cau, g.chu);
    } finally {
      datDangCho(false);
    }
  };

  const hoiSlide = (sl: { so: number; tong: number; bo: string; ten: string }): Promise<void> => hoiNhanh(
    `Giảng kỹ slide ${sl.so}${sl.tong ? `/${sl.tong}` : ''} của bộ ${sl.bo}`
      + `${sl.ten ? ` (“${sl.ten}”)` : ''} trong bài này: ý chính là gì, vì sao nó quan trọng, và một ví dụ dễ hiểu.`,
    `slide:${sl.bo}:${sl.so}`.slice(0, 40),
  );

  const gui = async (): Promise<void> => {
    const t = nhap.trim();
    if ((!t && anh.length === 0) || dangCho) return;
    const keo = anh;
    datNhap('');
    datAnh([]);
    datBao(null);
    datLuot((c) => [...c, { toi: true, chu: t || dich('(ảnh)'), anh: keo }]);
    datDangCho(true);
    try {
      if (cheDoGiaSu && bai) {
        /* Gia sư đi ĐƯỜNG KHÁC: endpoint của bài, có sẵn trọn nội dung bài.
           Chỉ dán ảnh mà không gõ gì ⇒ gửi một câu mặc định (máy chủ từ chối
           chuỗi rỗng). PHẢI gửi ảnh — bỏ sót là model trả lời về một tấm ảnh
           nó chưa từng thấy trong khi người dùng đang nhìn thấy nó. */
        const g = await window.cuongthai?.robotGiaSu.hoi({
          lessonId: bai.lessonId,
          chu: t || 'Giải thích giúp mình chỗ trong ảnh này (liên hệ với nội dung bài đang học).',
          lichSu: luot.slice(-8).map((x) => ({
            role: x.toi ? ('user' as const) : ('assistant' as const),
            content: x.chu,
          })),
          ...(keo.length ? { anh: keo } : {}),
        });
        const dapAnh = g?.chu || (g?.loi ?? dich('Không nhận được trả lời.'));
        datLuot((c) => [...c, { toi: false, chu: dapAnh, loi: !g?.chu }]);
        onXong({ ok: !!g?.chu, chu: dapAnh });
        if (g?.chu) chuyenLuot(bai.lessonId, t || '(ảnh)', g.chu);
        return;
      }
      const r = await window.cuongthai?.robot.hoi(t || dich('Xem ảnh này giúp mình.'), {
        model: bac,
        phienId,
        kyNang,
        ...(keo.length ? { anh: keo } : {}),
      });
      const chu = r?.chu || r?.loi || dich('Không nhận được trả lời.');
      const ok = !!r?.chu && !r?.loi;
      datLuot((c) => [...c, { toi: false, chu, kyNang: r?.kyNang ?? null, loi: !ok }]);
      onXong({ ok, chu });
      if (r?.phienId) datPhienId(r.phienId);
      if (r?.roiBac) {
        /* Máy chủ hạ bậc trong im lặng khi chưa Pro. Nói ra, và nói LÝ DO. */
        const t2 = BAC.find((b) => b.id === r.roiBac!.thanh)?.ten ?? r.roiBac.thanh;
        datBao(r.roiBac.lyDo === 'pro_required'
          ? dichP('Bậc này cần gói Pro — đã trả lời bằng {t}.', { t: t2 })
          : dichP('Đã trả lời bằng {t}.', { t: t2 }));
      }
    } catch (err) {
      const chu = `${dich('Lỗi:')} ${(err as Error).message}`;
      datLuot((c) => [...c, { toi: false, chu, loi: true }]);
      onXong({ ok: false, chu });
    } finally {
      datDangCho(false);
    }
  };

  const chip = KY_NANG.find((k) => k.id === kyNang) ?? KY_NANG[0]!;

  return (
    <div className="rb-chat" hidden={an}>
      <div
        className="rb-chat-dau"
        /* Nắm thanh tiêu đề = kéo CẢ khung (qua main, không qua vùng kéo của
           hệ điều hành — vùng đó không lưu vị trí và không kẹp màn hình). */
        onPointerDown={(e) => {
          if (e.button !== 0 || (e.target as HTMLElement).closest('button, select, input')) return;
          onKeoKhung(e);
        }}
      >
        <strong className="rb-chat-ten">{cheDoGiaSu ? dich('Gia sư bài học') : dich('Trợ lý')}</strong>
        {!cheDoGiaSu && (
          <select
            className="rb-bac"
            value={bac}
            onChange={(e) => doiBac(e.target.value)}
            title={dich('Bậc model')}
          >
            {BAC.map((b) => <option key={b.id} value={b.id}>{b.ten}</option>)}
          </select>
        )}
        <div className="rb-chat-nut">
          {bai && (
            <button
              type="button"
              onClick={() => { datMuonChung((v) => !v); datLuot([]); }}
              title={cheDoGiaSu ? dich('Chuyển sang trợ lý chung') : dich('Quay lại gia sư của bài đang học')}
            >
              {cheDoGiaSu ? dich('Trợ lý') : dich('Gia sư')}
            </button>
          )}
          {!cheDoGiaSu && (
            <button type="button" onClick={() => void moLichSu()} title={dich('Lịch sử trò chuyện')} data-dang={moSu}>
              {dich('Lịch sử')}
            </button>
          )}
          <button type="button" onClick={cuocMoi} title={dich('Bắt đầu cuộc mới')}>{dich('Mới')}</button>
          <button
            type="button"
            onClick={() => void window.cuongthai?.robot.moChinh('/chat')}
            title={dich('Mở trang AI Chat')}
          >
            {dich('Đầy đủ')}
          </button>
          <button type="button" className="rb-chat-dong" onClick={onDong} title={dich('Thu gọn')} aria-label={dich('Thu gọn')}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 12h12" /></svg>
          </button>
        </div>
      </div>

      {moSu && (
        <div className="rb-su">
          {su.length === 0
            ? <p className="rb-chat-trong">{dich('Chưa có cuộc nào.')}</p>
            : su.map((x) => (
              <button key={x.id} type="button" onClick={() => void chonPhien(x.id)} data-dang={x.id === phienId}>
                <span>{x.ten}</span>
                <em>{x.so}</em>
              </button>
            ))}
        </div>
      )}

      {cheDoGiaSu && bai && (
        <div className="rb-bai">
          <span className="rb-bai-ten" title={bai.lessonTitle ?? ''}>{bai.lessonTitle ?? dich('Bài đang học')}</span>
          {bai.courseCode && <span className="rb-bai-ma">{bai.courseCode}</span>}
        </div>
      )}

      <div className="rb-chat-than" ref={cuonRef}>
        {luot.length === 0 && !moSu && cheDoGiaSu && (
          <div className="rb-goiy">
            <p className="rb-chat-trong">
              {dich('Hỏi bất cứ điều gì về bài này — chỗ chưa hiểu, kiến thức nền, hay xin bài tập luyện.')}
            </p>
            {!!bai?.slides?.length && (
              <details className="rb-slide">
                <summary>{dichP('Hỏi theo slide ({n})', { n: bai.slides.length })}</summary>
                <div className="rb-slide-ds">
                  {bai.slides.map((sl) => (
                    <button key={`${sl.bo}#${sl.so}`} type="button" disabled={dangCho} onClick={() => void hoiSlide(sl)}>
                      <em>{sl.bo} {sl.so}{sl.tong ? `/${sl.tong}` : ''}</em> {sl.ten || '—'}
                    </button>
                  ))}
                </div>
              </details>
            )}
            <div className="rb-goiy-ds">
              {GOI_Y_BAI.map((g) => (
                <button key={g.key} type="button" disabled={dangCho} onClick={() => void hoiNhanh(g.q, g.key)}>
                  {g.q}
                </button>
              ))}
            </div>
          </div>
        )}
        {luot.length === 0 && !moSu && !cheDoGiaSu && (
          <div className="rb-chao">
            <p className="rb-chao-tieu">{dich('Chào bạn! Tớ giúp gì được nào?')}</p>
            <p className="rb-chat-trong">{dich('Chọn một kỹ năng bên dưới, hoặc cứ hỏi — tớ tự nhận việc.')}</p>
            <div className="rb-mau">
              {chip.mau.map((m) => (
                <button key={m} type="button" onClick={() => { datNhap(dich(m)); oNhapRef.current?.focus(); }}>
                  {dich(m)}
                </button>
              ))}
            </div>
          </div>
        )}
        {luot.map((l, i) => (
          <div key={i} className={l.toi ? 'rb-toi' : 'rb-may'} data-loi={l.loi ? 'true' : undefined}>
            {l.anh?.map((u, k) => <img key={k} src={u} alt="" className="rb-anh" />)}
            {/* Câu của MÌNH giữ chữ thuần; chỉ câu của trợ lý đi qua bộ dựng. */}
            {l.toi
              ? l.chu
              : <Suspense fallback={l.chu}><ChuAgent text={l.chu} /></Suspense>}
            {!l.toi && tenKyNang(l.kyNang) && (
              <span className="rb-nhan-ky-nang">{dich(tenKyNang(l.kyNang)!)}</span>
            )}
          </div>
        ))}
        {dangCho && (
          <div className="rb-may rb-cho" aria-label={dich('Chờ tớ suy nghĩ xíu nhé…')}>
            <span className="rb-go"><i /><i /><i /></span>
            {dich('Chờ tớ suy nghĩ xíu nhé…')}
          </div>
        )}
      </div>

      {bao && <p className="rb-bao">{bao}</p>}

      {/* Chip KỸ NĂNG — chỉ ở trợ lý chung. Gia sư bài học có luật riêng của
          máy chủ (`course_tutor`), chip ở đó là nút không đổi được gì. */}
      {!cheDoGiaSu && (
        <div className="rb-ky-nang" role="radiogroup" aria-label={dich('Kỹ năng')}>
          {KY_NANG.map((k) => (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={k.id === kyNang}
              data-chon={k.id === kyNang}
              onClick={() => doiKyNang(k.id)}
              title={dich(k.goiYNhap)}
            >
              <b aria-hidden>{k.kyHieu}</b>{dich(k.ten)}
            </button>
          ))}
        </div>
      )}

      {anh.length > 0 && (
        <div className="rb-anh-cho">
          {anh.map((u, i) => (
            <span key={i}>
              <img src={u} alt="" />
              <button type="button" onClick={() => datAnh((c) => c.filter((_, k) => k !== i))} aria-label={dich('Bỏ ảnh')}>×</button>
            </span>
          ))}
        </div>
      )}

      <div className="rb-chat-soan">
        <button
          type="button"
          className="rb-kep"
          onClick={() => chonTepRef.current?.click()}
          title={dich('Đính kèm ảnh')}
          aria-label={dich('Đính kèm ảnh')}
          disabled={anh.length >= TOI_DA_ANH}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 8" />
          </svg>
        </button>
        <input
          ref={chonTepRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => { themAnh([...(e.target.files ?? [])]); e.target.value = ''; }}
        />
        <textarea
          ref={oNhapRef}
          rows={1}
          autoFocus
          value={nhap}
          placeholder={cheDoGiaSu ? dich('Nhắn nhanh, dán ảnh được…') : dich(chip.goiYNhap)}
          onChange={(e) => datNhap(e.target.value)}
          onPaste={nhanDan}
          onKeyDown={(e) => {
            // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void gui(); }
            if (e.key === 'Escape') { e.preventDefault(); onDong(); }
          }}
        />
        <button
          type="button"
          className="rb-gui"
          onClick={() => void gui()}
          disabled={(!nhap.trim() && anh.length === 0) || dangCho}
          title={dich('Gửi')}
          aria-label={dich('Gửi')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
