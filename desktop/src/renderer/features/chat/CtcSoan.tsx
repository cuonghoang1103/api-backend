/**
 * Ô soạn kiểu Claude: một hộp bo tròn lớn, chữ tự giãn, hàng đáy gồm
 * [+ đính kèm & công cụ] … [giữ-để-nói] [chọn model ▾] [gửi ↑ / dừng ■].
 *
 * Enter gửi · Shift+Enter xuống dòng · nhường Enter cho bộ gõ (IME
 * `isComposing`) — gõ Telex/VNI mà Enter chốt chữ không được gửi nhầm.
 */
import { useEffect, useLayoutEffect, type ReactNode, type RefObject } from 'react';
import { ArrowUp, AudioLines, Camera, Lock, Paperclip, Plus, Sparkle, Square, X } from 'lucide-react';
import { DaiDinhKem, ODinhKem, type useDinhKem } from './DinhKem';
import { NutGoiThoai } from './NutGoiThoai';
import { CtcChonModel, type MaModel } from './CtcChonModel';
import { CtcMenu, useCtcMo, type MucCtc } from './CtcMenu';
import { useCtcChu } from './CtcChu';

export function CtcSoan({
  oRef, nhap, datNhap, onGui, onDung, dangChay, pro, model, onChonModel, dk,
  onChupMan, onMoGoi, onNoi, giuaTrang, duoiTrai, kyNang, dsKyNang = [], onChonKyNang,
}: {
  oRef: RefObject<HTMLTextAreaElement>;
  nhap: string;
  datNhap: (s: string) => void;
  onGui: () => void;
  onDung: () => void;
  dangChay: boolean;
  pro: boolean;
  model: string;
  onChonModel: (id: MaModel) => void;
  dk: ReturnType<typeof useDinhKem>;
  onChupMan: () => void;
  onMoGoi: () => void;
  onNoi: (cau: string) => Promise<string>;
  /** Màn trống: ô soạn nằm giữa trang, chữ gợi ý khác. */
  giuaTrang: boolean;
  /** Bên TRÁI hàng dưới ô soạn (chọn dự án / dòng lưu ý). Model luôn ở bên phải hàng đó (10/11, như /chat web). */
  duoiTrai?: ReactNode;
  /** Kỹ năng đang chọn cho câu hỏi (chip trong ô) + kỹ năng chọn được trong menu ＋. */
  kyNang?: { id: string; ten: string } | null;
  dsKyNang?: Array<{ id: string; ten: string }>;
  onChonKyNang?: (id: string | null) => void;
}) {
  const { c } = useCtcChu();
  const cong = useCtcMo();
  const coGiDeGui = Boolean(nhap.trim()) || dk.tep.length > 0;

  /* Tự giãn theo nội dung — đo lại MỖI lần chữ đổi. Trần chiều cao do CSS
     (`max-height`), vượt thì ô tự cuộn. */
  useLayoutEffect(() => {
    const o = oRef.current;
    if (!o) return;
    o.style.height = 'auto';
    o.style.height = `${o.scrollHeight}px`;
  }, [nhap, oRef, giuaTrang]);

  useEffect(() => { oRef.current?.focus(); }, [oRef]);

  const mucCong: MucCtc[] = [
    {
      nhan: c('Tải ảnh hoặc tệp lên'),
      phu: c('Tối đa 4 ảnh · 3 tài liệu mỗi lượt'),
      icon: <Paperclip size={15} aria-hidden />,
      khoa: !pro || dangChay,
      onChon: dk.moChonTep,
      ...(pro ? {} : { duoi: <span className="ctc-menu-pro"><Lock size={11} aria-hidden />{c('Cần Pro')}</span> }),
    },
    {
      nhan: c('Chụp màn hình'),
      icon: <Camera size={15} aria-hidden />,
      khoa: !pro || dangChay,
      onChon: onChupMan,
      ...(pro ? {} : { duoi: <span className="ctc-menu-pro"><Lock size={11} aria-hidden />{c('Cần Pro')}</span> }),
    },
    { loai: 'vach' },
    {
      nhan: c('Nói chuyện rảnh tay'),
      icon: <AudioLines size={15} aria-hidden />,
      khoa: dangChay,
      onChon: onMoGoi,
    },
    ...(onChonKyNang && dsKyNang.length
      ? [
        { loai: 'vach' } as MucCtc,
        { loai: 'tieuDe', nhan: c('Dùng kỹ năng') } as MucCtc,
        ...dsKyNang.map((k): MucCtc => ({
          nhan: k.ten,
          icon: <Sparkle size={15} aria-hidden />,
          chon: kyNang?.id === k.id,
          onChon: () => onChonKyNang(kyNang?.id === k.id ? null : k.id),
        })),
      ]
      : []),
  ];

  return (
    <>
    <div className="ctc-soan" data-chay={dangChay} data-giua={giuaTrang}>
      <DaiDinhKem tep={dk.tep} bo={dk.bo} />
      <textarea
        ref={oRef}
        className="ctc-soan-o"
        rows={1}
        value={nhap}
        placeholder={giuaTrang ? c('Nhắn cho CuongMini…') : c('Trả lời…')}
        onChange={(e) => datNhap(e.target.value)}
        onPaste={pro ? dk.danVao : undefined}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return; // nhường Enter cho bộ gõ
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!dangChay) onGui();
          }
        }}
      />
      <div className="ctc-soan-hang">
        <ODinhKem oFileRef={dk.oFileRef} nhanTuO={dk.nhanTuO} />
        <button
          ref={cong.neo}
          type="button"
          className="ctc-soan-icon"
          data-nut="dinhKem"
          data-mo={cong.mo}
          onClick={cong.bat}
          title={c('Đính kèm & công cụ')}
          aria-label={c('Đính kèm & công cụ')}
          aria-haspopup="menu"
          aria-expanded={cong.mo}
        >
          <Plus size={18} aria-hidden />
        </button>
        <CtcMenu
          mo={cong.mo}
          onDong={cong.dong}
          neo={cong.neo}
          muc={mucCong}
          huong={giuaTrang ? 'duoi' : 'tren'}
          canh="trai"
          rong={260}
          nhan={c('Đính kèm & công cụ')}
        />

        {kyNang && (
          <span className="ctd-chip-kn">
            <Sparkle size={13} aria-hidden /> {kyNang.ten}
            {onChonKyNang && <button type="button" onClick={() => onChonKyNang(null)} aria-label={c('Bỏ kỹ năng')}><X size={12} aria-hidden /></button>}
          </span>
        )}
        <span className="ctc-soan-dem" />

        <span className="ctc-soan-mic">
          <NutGoiThoai khoa={dangChay} onNoi={onNoi} />
        </span>
        {dangChay ? (
          <button
            type="button"
            className="ctc-soan-gui"
            data-dung
            onClick={onDung}
            title={c('Dừng')}
            aria-label={c('Dừng')}
          >
            <Square size={13} fill="currentColor" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className="ctc-soan-gui"
            data-nut="gui"
            onClick={onGui}
            disabled={!coGiDeGui}
            title={c('Gửi')}
            aria-label={c('Gửi')}
          >
            <ArrowUp size={17} strokeWidth={2.4} aria-hidden />
          </button>
        )}
      </div>
    </div>
    <div className="ctd-duoi-soan" data-giua={giuaTrang}>
      <div className="ctd-duoi-trai">{duoiTrai}</div>
      <CtcChonModel giaTri={model} pro={pro} khoa={dangChay} onChon={onChonModel} huong={giuaTrang ? 'duoi' : 'tren'} />
    </div>
    </>
  );
}
