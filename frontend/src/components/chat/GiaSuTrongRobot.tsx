'use client';

/**
 * ============================================================
 * GIA SƯ BÀI HỌC — bản nằm trong con robot nổi
 * ============================================================
 *
 * Người dùng 15/09/2026: "đang học ở trên nhiều lúc phải lướt xuống dưới để chat … rất là phiền". Đây là VỎ THỨ HAI
 * của gia sư; ruột nằm ở `useGiaSuBai`, dùng chung với mục cuối bài.
 *
 * ── Bản 17/11/2026 ──
 * Người dùng: "nâng cấp chat AI cho đẹp, chuyên nghiệp, dễ đọc dễ học" + "thay icon AI bằng CuongMini của app desktop,
 * nhiều biểu cảm" + "hỏi về đúng phần trong video, từng slide".
 *  • Giao diện theo CHỦ ĐỀ sáng/tối (biến `--bg-card`…, `giaSu.css`) thay vì chữ 13px xanh lơ trên nền đen cố định.
 *  • Đầu khung là CuongMini — vẫy tay khi mở, nghĩ khi chờ, nói khi chữ chảy về, vui khi xong, bối rối khi lỗi.
 *  • Gia sư nghe kèm VIDEO đang phát trên trang học (phụ đề + giây đang xem); mốc `[3:20]` trong câu trả lời là nút
 *    tua; "Hỏi đoạn đang xem", "Tóm tắt video"; chip ngữ cảnh khi bấm "Hỏi phần này" ở mục lục / "Hỏi slide này".
 *
 * `nutPhai`: nút riêng của nơi chứa (chuyển trợ lý chung, phóng to, đóng) — khung robot web truyền vào; khung gia sư
 * của app desktop (`OdinDock`) có nút đóng riêng đè góc phải nên không truyền gì.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { BookMarked, BookOpen, Crown, FileQuestion, MessageCirclePlus, Trash2 } from 'lucide-react';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { GOI_Y_GIA_SU, useGiaSuBai } from '@/components/academy/useGiaSuBai';
import { useFaqGiaSu } from '@/components/academy/useFaqGiaSu';
import ChonSlide from '@/components/academy/ChonSlide';
import HoiAICauLuyen from '@/components/academy/HoiAICauLuyen';
import { cauHoiSlide, khoaCacheSlide, type Slide } from '@/components/academy/docSlide';
import TinNhanGiaSu from '@/components/academy/giaSu/TinNhanGiaSu';
import KhungSoanGiaSu from '@/components/academy/giaSu/KhungSoanGiaSu';
import { CuongMiniRobot } from '@/components/cuongmini/CuongMiniRobot';
import { useCamXucGiaSu } from '@/components/cuongmini/useCamXucGiaSu';
import { CAU_TOM_TAT_VIDEO, KHOA_TOM_TAT_VIDEO, doanQuanhGiay } from '@/lib/mucLucVideo';
import { moc } from '@/lib/mocThoiGian';
import { khoaGiaSu, useGiaSuBaiStore, type BaiDangHoc } from '@/store/giaSuBaiStore';
import { useHoiCauLuyenStore } from '@/store/hoiCauLuyenStore';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
import '@/components/academy/giaSu/giaSu.css';

/** Biểu tượng cho bốn gợi ý mở màn — cùng thứ tự `GOI_Y_GIA_SU`. */
const BIEU_TUONG_GOI_Y: Record<string, string> = { start: '🧭', exercises: '✍️', prereq: '🧱', hard: '💡' };


export default function GiaSuTrongRobot({ bai, rong, nutPhai }: { bai: BaiDangHoc; rong: boolean; nutPhai?: ReactNode }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();

  /*
   * ── ĐANG LUYỆN QUIZ CHƯƠNG ⇒ robot mở đúng câu đang làm (22/09/2026) ──
   * `ChapterQuiz` công bố phiên luyện vào `hoiCauLuyenStore`; có phiên thì robot hiện hai thẻ — "Câu đang luyện"
   * (mặc định) và "Bài học" (gia sư bài như cũ).
   */
  const phien = useHoiCauLuyenStore((s) => s.phien);
  const [the, datThe] = useState<'cau' | 'bai'>('cau');
  useEffect(() => { if (phien?.khoa) datThe('cau'); }, [phien?.khoa]);
  const cauPhien = phien ? phien.dsCau[phien.idx] : undefined;

  const g = useGiaSuBai({ lessonId: bai.lessonId, nhanCauCho: 'robot' });
  const { turns, asking, hoi, hoiTiengAnh, hoiLaiMoi, nhoLaiCauCu, ghim, coVideo, videoBai } = g;
  const datGhim = useGiaSuBaiStore((s) => s.datGhim);
  const faq = useFaqGiaSu(`/courses/lessons/${bai.lessonId}/ai/asks`, bai.lessonId);

  const cuoi = turns[turns.length - 1];
  const mood = useCamXucGiaSu({ dangHoi: asking, coChu: !!(cuoi?.streaming && cuoi.content), soLoi: g.soLoi });

  /* Cuộn xuống theo câu trả lời đang gõ — `auto` chứ không `smooth` (gọi lại mỗi mẩu delta thì cuộn mượt tự huỷ). */
  const cuoiRef = useRef<HTMLDivElement>(null);
  useEffect(() => { cuoiRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' }); }, [turns]);

  const ten = bai.lessonTitle || bai.courseTitle || 'bài đang học';

  const dau = (
    <div className="gsb-dau">
      <CuongMiniRobot mood={mood} size={42} title="CuongMini" />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="gsb-dau-ten">
          CuongMini <span className="gsb-huy-hieu">Gia sư bài học</span>
        </div>
        <div className="gsb-dau-phu" title={ten}>
          {asking ? 'Đang soạn câu trả lời…' : ten}
          {bai.courseCode && !asking ? ` · ${bai.courseCode}` : ''}
        </div>
      </div>
      {coVideo && (
        <span className="gsb-huy-hieu" title="Gia sư đã đọc lời giảng của video đang phát — hỏi về bất kỳ phút nào">
          🎬 Đã nghe video
        </span>
      )}
      {isAuthed && (
        <button
          type="button"
          className="gsb-nut-tron"
          onClick={faq.batMo}
          aria-pressed={faq.mo}
          title="Câu hỏi thường gặp của bài này"
          aria-label="Câu hỏi thường gặp"
        >
          <BookMarked size={14} />{faq.ds?.length ? faq.ds.length : ''}
        </button>
      )}
      {nutPhai ?? <span style={{ width: 22 }} aria-hidden />}
    </div>
  );

  /* Thanh hai thẻ — chỉ khi có phiên luyện quiz. */
  const thanhThe = phien && cauPhien ? (
    <div className="gsb-goi-y" role="tablist" aria-label="Robot đang hỏi về" style={{ padding: '8px 12px', borderBottom: '1px solid var(--gsb-vien)' }}>
      {([['cau', `Câu đang luyện · ${cauPhien.soThuTu}/${phien.dsCau.length}`, FileQuestion], ['bai', 'Bài học', BookOpen]] as const).map(([ma, nhan, Icon]) => (
        <button key={ma} type="button" role="tab" aria-selected={the === ma} onClick={() => datThe(ma)}
          style={the === ma ? { borderColor: 'var(--gsb-nhan-vien)', color: 'var(--gsb-nhan)', background: 'var(--gsb-nhan-nhat)' } : undefined}>
          <Icon size={13} /> {nhan}
        </button>
      ))}
    </div>
  ) : null;

  if (phien && cauPhien && the === 'cau') {
    return (
      <div className="gsb" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {dau}
        {thanhThe}
        <HoiAICauLuyen robot cau={cauPhien} dsCau={phien.dsCau} idx={phien.idx} onChonCau={phien.chonCau} tieuDe={phien.tieuDe} />
      </div>
    );
  }

  if (!isAuthed || !isPro) {
    return (
      <div className="gsb" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {dau}
        {thanhThe}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center' }}>
          {!isAuthed ? (
            <>
              <CuongMiniRobot mood="vay" size={84} />
              <p style={{ fontSize: 14, color: 'var(--gsb-chu-2)' }}>Đăng nhập để hỏi CuongMini về bài này.</p>
              <Link href="/login" className="gsb-nut-gui" style={{ width: 'auto', padding: '0 16px', fontSize: 14, fontWeight: 600 }}>Đăng nhập</Link>
            </>
          ) : (
            <>
              <Crown size={30} color="#f59e0b" />
              <p style={{ fontSize: 14, color: 'var(--gsb-chu-2)' }}>Gia sư riêng từng bài là tính năng Pro.</p>
              <Link href="/pro" className="gsb-nut-gui" style={{ width: 'auto', padding: '0 16px', fontSize: 14, fontWeight: 700, background: 'linear-gradient(90deg,#f59e0b,#f97316)' }}>
                Nâng cấp Pro
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const hoiDoanDangXem = () => {
    if (!videoBai) return;
    const giay = videoBai.layGiay() ?? 0;
    datGhim(khoaGiaSu(bai.lessonId), { loai: 'doan', doan: { ...doanQuanhGiay(giay, videoBai.thoiLuong), ten: `Quanh ${moc(giay)}` } });
  };

  return (
    <div className="gsb" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {dau}
      {thanhThe}

      {faq.mo && (
        <div className="gsb-faq">
          {faq.dangTai && !faq.ds ? (
            <p style={{ padding: 14, textAlign: 'center', fontSize: 12, color: 'var(--gsb-chu-3)' }}>Đang tải…</p>
          ) : !faq.ds?.length ? (
            <p style={{ padding: 14, textAlign: 'center', fontSize: 12, color: 'var(--gsb-chu-3)' }}>
              Chưa ai hỏi gì ở bài này. Câu bạn hỏi sẽ được lưu lại đây cho người sau.
            </p>
          ) : (
            <>
              {faq.ds.map((f) => {
                const dangMo = faq.moMuc === f.id;
                return (
                  <div key={f.id} className="gsb-faq-muc">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '8px 12px' }}>
                      <button type="button" onClick={() => faq.datMoMuc(dangMo ? null : f.id)}
                        style={{ minWidth: 0, flex: 1, textAlign: 'left', background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>
                        <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--gsb-chu)' }}>{f.question}</span>
                        <span style={{ display: 'block', marginTop: 2, fontSize: 11, color: 'var(--gsb-chu-3)' }}>
                          {f.nguoiHoi} · {new Date(f.createdAt).toLocaleDateString('vi-VN')}{f.lang === 'en' && ' · EN'}{!dangMo && ' · bấm để xem'}
                        </span>
                      </button>
                      {f.cuaToi && (
                        <button type="button" onClick={() => void faq.xoa(f.id)} aria-label="Xoá câu hỏi này" className="gsb-nut-tron" style={{ height: 24, minWidth: 24 }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    {dangMo && (
                      <div style={{ padding: '0 12px 10px' }}>
                        <div className="gsb-md gsb-the"><ChatMarkdown content={f.answer} /></div>
                        <div className="gsb-goi-y" style={{ marginTop: 8 }}>
                          <button type="button" onClick={() => { nhoLaiCauCu(f); faq.datMoMuc(null); }}>
                            <MessageCirclePlus size={13} /> Hỏi tiếp từ câu này
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {faq.conNua && (
                <div className="gsb-goi-y" style={{ justifyContent: 'center', padding: 8 }}>
                  <button type="button" onClick={() => void faq.napThem()} disabled={faq.dangTai}>
                    {faq.dangTai ? 'Đang tải…' : 'Xem thêm câu cũ hơn'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="gsb-cuon">
        {turns.length === 0 && (
          <div>
            <div className="gsb-chao">
              <CuongMiniRobot size={30} tinh mood="vui" />
              <div className="gsb-chao-the">
                Chào bạn! Mình là <b>CuongMini</b>, gia sư của bài này. Mình đã đọc nội dung bài
                {coVideo ? <> và <b>nghe hết lời giảng trong video</b> (có mốc thời gian)</> : null} —
                hỏi chỗ chưa hiểu, xin ví dụ, nhờ chữa bài, hoặc bấm một gợi ý bên dưới.
              </div>
            </div>

            {videoBai && (
              <>
                <div className="gsb-nhom-ten">Video đang học</div>
                <div className="gsb-the-goi-y">
                  <button type="button" disabled={asking} onClick={hoiDoanDangXem}>
                    <span className="gsb-bieu-tuong">🎯</span> Hỏi đoạn đang xem (±30 giây)
                  </button>
                  <button type="button" disabled={asking}
                    onClick={() => void hoi(CAU_TOM_TAT_VIDEO, { cacheKey: KHOA_TOM_TAT_VIDEO, nguCanh: null })}>
                    <span className="gsb-bieu-tuong">🗂️</span> Tóm tắt video theo từng phần
                  </button>
                </div>
              </>
            )}

            {!!bai.slides?.length && (
              <>
                <div className="gsb-nhom-ten">Slide của bài</div>
                <ChonSlide
                  slides={bai.slides}
                  khoa={asking}
                  onChon={(sl: Slide) => void hoi(cauHoiSlide(sl), {
                    cacheKey: khoaCacheSlide(sl), nguCanh: { loai: 'slide', slide: sl }, cauDaCoNguCanh: true,
                  })}
                />
              </>
            )}

            <div className="gsb-nhom-ten">Gợi ý</div>
            <div className="gsb-the-goi-y">
              {GOI_Y_GIA_SU.map((gy) => (
                <button key={gy.key} type="button" disabled={asking}
                  onClick={() => void hoi(gy.q, { cacheKey: gy.key, nguCanh: null })}>
                  <span className="gsb-bieu-tuong">{BIEU_TUONG_GOI_Y[gy.key] ?? '✨'}</span> {gy.q}
                </button>
              ))}
            </div>
          </div>
        )}

        <TinNhanGiaSu
          turns={turns}
          asking={asking}
          coVideo={coVideo}
          onTua={videoBai ? (s) => videoBai.tua(s) : undefined}
          onHoiTiep={(c) => void hoi(c, { nguCanh: null })}
          onTiengAnh={hoiTiengAnh}
          onHoiLaiMoi={hoiLaiMoi}
        />
        <div ref={cuoiRef} />
      </div>

      <KhungSoanGiaSu
        question={g.question}
        setQuestion={g.setQuestion}
        asking={asking}
        hoi={hoi}
        anhDan={g.anhDan}
        themAnh={g.themAnh}
        boAnh={g.boAnh}
        danVao={g.danVao}
        ghim={ghim}
        boGhim={g.boGhim}
        focusKhi={ghim}
        meo={rong ? <>Enter để gửi · Shift+Enter xuống dòng · phím <b>A</b> mở gia sư, <b>Shift+A</b> hỏi đoạn đang xem</> : undefined}
      />
    </div>
  );
}
