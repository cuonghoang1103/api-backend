'use client';

/**
 * MÀN TRƯỚC KHI THI (12/11/2026) — như máy thi thật: xác nhận thông tin thí sinh → "Instructions to candidates"
 * (EN + giải thích VI gọn) → Listening có KIỂM TAI NGHE (phát câu mẫu + thanh âm lượng) → Start.
 * Toàn màn hình (cùng lớp `.thi` với phòng làm bài) — không còn menu web.
 */
import { useEffect, useState } from 'react';
import type { De } from './de/types';
import { TEN_KY_NANG } from './de/index';
import { useTenThiSinh } from './ThanhThi';
import { play, stopAudio, getVolume, setVolume } from '@/components/sach-hoc/audio';
import { useHienThi } from '../chung/MenuTren';
import s from '../chung/cdt.module.css';

type Props = {
  de: De;
  cheDo: 'practice' | 'full';
  phanChon: number[];
  /** Phút của lượt này (null = không giới hạn). */
  phut: number | null;
  /** Bước trong bộ đề: "Phần 2/4". */
  buocBo?: string;
  onBatDau: () => void;
  onHuy: () => void;
};

const HD: Record<string, { en: string[]; vi: string[] }> = {
  doc: {
    en: [
      'The test has 3 passages and 40 questions. You have 60 minutes.',
      'Answer ALL the questions. Type your answers in the boxes or select from the options. Spelling matters.',
      'Follow the word limit in each instruction (e.g. ONE WORD ONLY). Answers over the limit are marked wrong.',
      'You may highlight text and make notes. Use the Review flag for questions you want to return to.',
      'Click Submit when you have finished. The test ends automatically when the time is up.',
    ],
    vi: ['3 bài đọc, 40 câu, 60 phút — không có thời gian chép đáp án thêm như thi giấy.', 'Chính tả phải đúng; vượt giới hạn số từ là sai dù có chứa đáp án.', 'Hết giờ hệ thống tự nộp; có thể Submit sớm.'],
  },
  nghe: {
    en: [
      'You will hear 4 parts. Each part is played ONCE only. Before each part you have time to read the questions.',
      'Answer the questions as you listen. Type numbers as figures, spell names as they are spelled.',
      'At the end of the recording you have 2 minutes to check your answers before the test is submitted automatically.',
      'Check your headphones and adjust the volume now — you can also change the volume during the test.',
    ],
    vi: ['Băng phát MỘT lần, liền 4 Part; vừa nghe vừa trả lời (bản máy không có 10 phút chép đáp án).', 'Hết băng có 2 phút kiểm tra, rồi tự nộp.', 'Kiểm tai nghe + âm lượng trước khi Start.'],
  },
  viet: {
    en: [
      'There are 2 tasks. Task 1: at least 150 words, about 20 minutes. Task 2: at least 250 words, about 40 minutes.',
      'Task 2 contributes twice as much as Task 1 to your Writing score. Under-length answers lose marks.',
      'Type your answers in the response boxes. A live word count is shown. There is no spell-checker.',
      'You may switch between tasks at any time. Click Submit when finished.',
    ],
    vi: ['2 bài: Task 1 ≥ 150 từ (≈ 20′), Task 2 ≥ 250 từ (≈ 40′); Task 2 tính gấp đôi.', 'Không có kiểm tra chính tả; đếm từ hiện trực tiếp.', 'Sau khi nộp, AI chấm 4 tiêu chí (band ước tính).'],
  },
};

export function ManTruocThi({ de, cheDo, phanChon, phut, buocBo, onBatDau, onHuy }: Props) {
  const { thuocTinh } = useHienThi();
  const ten = useTenThiSinh();
  const laNghe = de.kyNang === 'nghe';
  const [xacNhan, setXacNhan] = useState(false);
  const [daThu, setDaThu] = useState(false);
  const [dangPhat, setDangPhat] = useState(false);
  const [vol, setVol] = useState(1);
  useEffect(() => { setVol(getVolume()); return () => stopAudio(); }, []);
  const hd = HD[de.kyNang] ?? HD.doc;
  const kyNangEn = TEN_KY_NANG[de.kyNang];
  const soPhan = phanChon.length;

  const thuTai = () => {
    setDangPhat(true);
    // Máy chủ giọng chậm/hỏng thì vẫn cho Start sau 6 s — người học tự nghe được hay không là đủ để quyết định.
    setTimeout(() => { setDaThu(true); setDangPhat(false); }, 6000);
    play([
      { text: 'This is the IELTS Listening test. If you can hear this clearly, your headphones are working. Adjust the volume now.', voice: 'uk-nu' },
      { text: 'Part one. You will hear a conversation. First you have some time to look at the questions.', voice: 'uk-nam' },
    ], () => { setDangPhat(false); setDaThu(true); });
  };

  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      <header className={s.thiTren}>
        <div className={s.thiSinh}><span className={s.thiSinhTen}>👤 {ten}</span><span className={s.tenThi}>IELTS {kyNangEn} · {de.ten}</span><span className={s.cheDoThi}>{cheDo === 'full' ? 'Full test' : 'Practice'}{buocBo ? ` · ${buocBo}` : ''}</span></div>
        <div className={s.dongHoGiua}><span className={s.dongHoChu}>{phut ? `${phut} minutes` : 'No time limit'}</span></div>
        <div className={s.thiDieuKhien}><button type="button" className={s.iconBtn} onClick={onHuy}>Thoát</button></div>
      </header>
      <div className={s.truocThi}>
        <section className={s.truocKhung}>
          <h1 className={s.truocTieuDe}>IELTS {kyNangEn}{cheDo === 'practice' ? ' — Practice' : ''}</h1>
          <p className={s.mo} style={{ margin: '0 0 16px' }}>{de.boDe} · {de.capDo} · {cheDo === 'practice' ? `${soPhan} ${de.kyNang === 'viet' ? 'task' : de.kyNang === 'doc' ? 'passage' : 'part'}` : 'đủ đề'}{phut ? ` · ${phut} phút` : ''}</p>

          <h2 className={s.truocH2}>Candidate details · Thông tin thí sinh</h2>
          <div className={s.truocThe}>
            <div><span className={s.mo}>Name</span><b>{ten}</b></div>
            <div><span className={s.mo}>Test</span><b>{kyNangEn} {cheDo === 'full' ? 'Full test' : 'Practice'}</b></div>
            <div><span className={s.mo}>Paper</span><b>{de.ten}</b></div>
            <div><span className={s.mo}>Date</span><b>{new Date().toLocaleDateString('vi-VN')}</b></div>
          </div>
          <label className={s.truocTick}>
            <input type="checkbox" checked={xacNhan} onChange={(e) => setXacNhan(e.target.checked)} />
            <span>I confirm that the details above are correct. — Tôi xác nhận thông tin trên đúng.</span>
          </label>

          <h2 className={s.truocH2}>Instructions to candidates</h2>
          <ol className={s.truocDs}>{hd.en.map((x, i) => <li key={i}>{x}</li>)}</ol>
          <div className={s.truocVi}>
            <b>Tóm tắt tiếng Việt</b>
            <ul>{hd.vi.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>

          {laNghe && (
            <>
              <h2 className={s.truocH2}>Sound check · Kiểm tai nghe</h2>
              <div className={s.truocAm}>
                <button type="button" className={s.nutPhu} onClick={thuTai} disabled={dangPhat}>{dangPhat ? '🔊 Đang phát…' : daThu ? '🔁 Phát lại câu mẫu' : '▶ Phát câu mẫu'}</button>
                <label className={s.amLuong}>
                  🔈
                  <input type="range" min={0} max={1} step={0.05} value={vol} aria-label="Âm lượng" onChange={(e) => { const v = Number(e.target.value); setVol(v); setVolume(v); }} />
                  🔊 <span className={s.mo}>{Math.round(vol * 100)}%</span>
                </label>
                <span className={s.mo}>{daThu ? '✓ Đã nghe thử. Nếu nghe rõ, bấm Start.' : 'Đeo tai nghe, bấm phát câu mẫu rồi chỉnh âm lượng vừa tai.'}</span>
              </div>
            </>
          )}

          <div className={s.hangNut} style={{ justifyContent: 'flex-start', marginTop: 22 }}>
            <button type="button" className={s.batDau} disabled={!xacNhan || (laNghe && cheDo === 'full' && !daThu)} onClick={() => { stopAudio(); onBatDau(); }}>Start test</button>
            <button type="button" className={s.nutPhu} onClick={onHuy}>Quay lại</button>
            {!xacNhan && <span className={s.mo}>Tick xác nhận để bật Start.</span>}
            {xacNhan && laNghe && cheDo === 'full' && !daThu && <span className={s.mo}>Chế độ thi: phải nghe thử trước (băng chỉ phát một lần).</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
