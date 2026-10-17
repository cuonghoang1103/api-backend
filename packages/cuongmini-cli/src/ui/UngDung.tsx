/**
 * GỐC giao diện: mở phiên đã lưu ⇒ (chưa có thì) đăng nhập ⇒ khởi động lõi ⇒ chat.
 */
import { Box, useApp, useStdout } from 'ink';
import { Text } from './chu';
import { useEffect, useState } from 'react';
import type { CoDong } from '../coDong';
import type { KetNoiLoi } from '../ketNoi';
import type { KhoChat } from '../kho';
import { L } from '../i18n';
import { khoiDongPhien } from '../khoiDong';
import { THUONG_HIEU, mau, mo } from '../mau';
import { moLaiPhien, tenHienThi, type NguoiDung } from '../phien';
import { SAO } from '../trangThai';
import { ManChat } from './ManChat';
import { ManDangNhap } from './ManDangNhap';

type Pha =
  | { loai: 'moLai' }
  | { loai: 'dangNhap'; nhacNho?: string }
  | { loai: 'khoiDong'; nguoi: NguoiDung; ngoaiTuyen: boolean }
  | { loai: 'chat'; kn: KetNoiLoi; kho: KhoChat; ngoaiTuyen: boolean; banMoi: string | null }
  | { loai: 'loi'; chu: string };

export function UngDung({ co, thuMuc, phienBan, chiDangNhap, banMoi, onThoat }: {
  co: CoDong; thuMuc: string; phienBan: string; chiDangNhap: boolean; banMoi: Promise<string | null>;
  onThoat: (loiNhan?: string) => void;
}) {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [pha, setPha] = useState<Pha>(chiDangNhap ? { loai: 'dangNhap' } : { loai: 'moLai' });
  const [nhip, setNhip] = useState(0);

  useEffect(() => {
    if (pha.loai !== 'moLai' && pha.loai !== 'khoiDong') return undefined;
    const h = setInterval(() => setNhip((n) => n + 1), 120);
    return () => clearInterval(h);
  }, [pha.loai]);

  useEffect(() => {
    if (pha.loai !== 'moLai') return;
    moLaiPhien().then(
      (r) => setPha(r ? { loai: 'khoiDong', nguoi: r.nguoi, ngoaiTuyen: r.ngoaiTuyen } : { loai: 'dangNhap' }),
      (e: Error) => setPha({ loai: 'loi', chu: e.message }),
    );
  }, [pha.loai]);

  useEffect(() => {
    if (pha.loai !== 'khoiDong') return;
    const { nguoi, ngoaiTuyen } = pha;
    void (async () => {
      try {
        const p = await khoiDongPhien(nguoi, co, thuMuc, phienBan);
        // Kiểm bản mới chạy song song từ lúc mở; chờ thêm tối đa 1,5s cho kịp in lên màn mở đầu.
        const moi = await Promise.race([banMoi, new Promise<null>((ok) => setTimeout(() => ok(null), 1500))]).catch(() => null);
        for (const c of p.canhBao) p.kho.thongBao(c, 'canh');
        setPha({ loai: 'chat', kn: p.kn, kho: p.kho, ngoaiTuyen, banMoi: moi });
      } catch (e) {
        setPha({ loai: 'loi', chu: L(`Không khởi động được lõi AI Code: ${(e as Error).message}`, `Could not start the AI Code core: ${(e as Error).message}`) });
      }
    })();
  }, [pha, co, thuMuc, phienBan, banMoi]);

  useEffect(() => {
    if (pha.loai !== 'loi') return;
    onThoat();
    const h = setTimeout(() => exit(new Error(pha.chu)), 50);
    return () => clearTimeout(h);
  }, [pha, exit, onThoat]);

  const rong = stdout.columns || 100;
  const sao = mau(THUONG_HIEU.tim)(SAO[nhip % SAO.length]!);
  switch (pha.loai) {
    case 'moLai': return <Text>{`${sao} ${mo(L('Đang mở phiên đăng nhập…', 'Restoring your session…'))}`}</Text>;
    case 'khoiDong': return <Text>{`${sao} ${mo(L(`Xin chào ${tenHienThi(pha.nguoi)} — đang khởi động lõi AI Code…`, `Hi ${tenHienThi(pha.nguoi)} — starting the AI Code core…`))}`}</Text>;
    case 'dangNhap':
      return (
        <ManDangNhap
          rong={rong}
          nhacNho={pha.nhacNho}
          onXong={(n) => {
            if (chiDangNhap) { onThoat(L(`✓ Đã đăng nhập: ${tenHienThi(n)}. Gõ \`cuongmini\` để bắt đầu.`, `✓ Signed in as ${tenHienThi(n)}. Run \`cuongmini\` to start.`)); exit(); return; }
            setPha({ loai: 'khoiDong', nguoi: n, ngoaiTuyen: false });
          }}
          onHuy={() => { onThoat(L('Đã huỷ đăng nhập.', 'Sign-in cancelled.')); exit(); }}
        />
      );
    case 'chat':
      return (
        <ManChat
          kn={pha.kn} kho={pha.kho} thuMuc={thuMuc} phienBan={phienBan} cauHoiDau={co.cauHoi}
          banMoi={pha.banMoi} ngoaiTuyen={pha.ngoaiTuyen} chonViecCu={co.chonViecCu} onThoat={onThoat}
        />
      );
    case 'loi':
      return <Box><Text>{mau('#f87171')(`✗ ${pha.chu}`)}</Text></Box>;
  }
}
