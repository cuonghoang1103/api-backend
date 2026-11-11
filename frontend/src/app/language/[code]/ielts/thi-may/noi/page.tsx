'use client';

/**
 * Trang THỬ phòng thi Speaking — chạy độc lập trong lúc trung tâm thi (`ThiMay.tsx`) chưa gắn `PhongNoi`.
 *   /language/en/ielts/thi-may/noi?de=noi-00            (chế độ thi)
 *   /language/en/ielts/thi-may/noi?de=noi-demo&che=luyen (chế độ luyện, đề thử)
 * Đề tải từ `de/noi-XX.ts` qua `taiDeNoi`; kết quả `onXong` hiện ngay dưới (JSON) để agent/người kiểm tra.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { docTruyVan } from '@/components/sach-hoc/moiTruong';
import type { DeNoi } from '../de/types';
import type { CheDoNoi, KetQuaNoi } from '../noiTypes';
import { taiDeNoi } from '../noiApi';
import PhongNoi from '../PhongNoi';
import s from '../../chung/cdt.module.css';

export default function PhongNoiThuPage() {
  const code = String(useParams().code);
  const [de, setDe] = useState<DeNoi | null>(null);
  const [cheDo, setCheDo] = useState<CheDoNoi>('thi');
  const [id, setId] = useState('');
  const [loi, setLoi] = useState('');
  const [kq, setKq] = useState<KetQuaNoi | null>(null);

  useEffect(() => {
    const q = docTruyVan();
    const deId = q.get('de') || 'noi-demo';
    setId(deId);
    setCheDo(q.get('che') === 'luyen' ? 'luyen' : 'thi');
    void taiDeNoi(deId).then((d) => { if (d) setDe(d); else setLoi(`Không tìm thấy đề "${deId}" (de/${deId}.ts). Thử ?de=noi-demo`); });
  }, []);

  if (code !== 'en') return <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>Phòng thi IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/thi-may/noi">Mở</Link></div>;
  if (kq) {
    return (
      <div className={s.goc}><div className={s.khung}>
        <h1 className={s.tenDe}>Kết quả Speaking — {id} ({cheDo})</h1>
        <div className={s.tomTat}>
          <div className={s.oSoLieu}><span>Band</span><b>{kq.band.toFixed(1)}</b></div>
          <div className={s.oSoLieu}><span>FC</span><b>{kq.tieuChi.fc.toFixed(1)}</b></div>
          <div className={s.oSoLieu}><span>LR</span><b>{kq.tieuChi.lr.toFixed(1)}</b></div>
          <div className={s.oSoLieu}><span>GRA</span><b>{kq.tieuChi.gra.toFixed(1)}</b></div>
          <div className={s.oSoLieu}><span>P</span><b>{kq.tieuChi.p.toFixed(1)}</b></div>
        </div>
        <p>{kq.nhanXet}</p>
        <pre className={s.vanBan} data-testid="kq-json" style={{ fontSize: 12 }}>{JSON.stringify(kq, null, 2)}</pre>
        <Link href={`/language/en/ielts/thi-may/noi?de=${id}&che=${cheDo}`} className={s.nutPhu} onClick={() => setKq(null)}>Làm lại</Link>
      </div></div>
    );
  }
  if (loi) return <div className={s.goc}><div className={s.khung}><p className={s.loi}>{loi}</p></div></div>;
  if (!de) return <div className={s.goc}><div className={s.khung}><p className={s.mo}>Đang tải đề…</p></div></div>;
  return <PhongNoi de={de} cheDo={cheDo} onXong={setKq} />;
}
