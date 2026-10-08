/**
 * Trạng thái cài game riêng + tiến độ tải, dùng chung cho thẻ Nổi bật và trang
 * cửa hàng. Mọi việc nặng ở main (`troChoi:*`); đây chỉ nghe và gọi.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TroChoiMa, TroChoiTienDo, TroChoiTinhTrang } from '../../../../shared/ipc';

export interface CaiGame {
  tt: TroChoiTinhTrang | null;
  tienDo: TroChoiTienDo | null;
  loi: string | null;
  /** Có cầu nối app không (chạy ngoài app desktop thì không). */
  coCau: boolean;
  napLai: (bo?: boolean) => Promise<void>;
  tai: () => Promise<void>;
  huy: () => Promise<void>;
  choi: () => Promise<{ ok: boolean; loi?: string; chan?: boolean }>;
  go: () => Promise<void>;
  moThuMuc: () => Promise<void>;
}

export function useCaiGame(ma: TroChoiMa): CaiGame {
  const cau = typeof window !== 'undefined' ? window.cuongthai?.troChoi : undefined;
  const [tt, setTt] = useState<TroChoiTinhTrang | null>(null);
  const [tienDo, setTienDo] = useState<TroChoiTienDo | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const conSong = useRef(true);

  const napLai = useCallback(async (bo = false) => {
    if (!cau) return;
    try {
      const t = await cau.tinhTrang(ma, bo);
      if (conSong.current) setTt(t);
    } catch (e) {
      if (conSong.current) setLoi((e as Error)?.message ?? 'Lỗi không rõ.');
    }
  }, [cau, ma]);

  useEffect(() => {
    conSong.current = true;
    void napLai();
    const huyNghe = window.cuongthai?.on('troChoi:tienDo', (goi) => {
      const t = goi as TroChoiTienDo;
      if (t.ma !== ma) return;
      setTienDo(t);
      if (t.buoc === 'loi') setLoi(t.loi ?? 'Lỗi không rõ.');
      if (t.buoc === 'xong' || t.buoc === 'loi' || t.buoc === 'huy') void napLai();
    });
    return () => { conSong.current = false; huyNghe?.(); };
  }, [ma, napLai]);

  const tai = useCallback(async () => {
    if (!cau) return;
    setLoi(null);
    setTienDo({ ma, buoc: 'tai', daCo: tt?.daTaiDo ?? 0, tong: tt?.banMoi?.size ?? 0, bps: 0 });
    const kq = await cau.tai(ma);
    if (!kq.ok) { setLoi(kq.loi ?? 'Không bắt đầu tải được.'); setTienDo(null); }
    void napLai();
  }, [cau, ma, napLai, tt]);

  const huy = useCallback(async () => {
    await cau?.huyTai(ma);
  }, [cau, ma]);

  const choi = useCallback(async () => {
    if (!cau) return { ok: false, loi: 'Chỉ chơi được trong app desktop.' };
    return cau.choi(ma);
  }, [cau, ma]);

  const go = useCallback(async () => {
    if (!cau) return;
    const kq = await cau.go(ma);
    if (!kq.ok) setLoi(kq.loi ?? 'Không gỡ được.');
    setTienDo(null);
    await napLai();
  }, [cau, ma, napLai]);

  const moThuMuc = useCallback(async () => { await cau?.moThuMuc(ma); }, [cau, ma]);

  return { tt, tienDo, loi, coCau: !!cau, napLai, tai, huy, choi, go, moThuMuc };
}
