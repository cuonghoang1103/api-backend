/**
 * MÀN ĐĂNG NHẬP — hai đường y như app/extension (`cuongmini-core/src/dangNhap.ts`):
 *  • Google / GitHub / Apple: mở trình duyệt hệ thống, web trả token về cổng
 *    vòng 127.0.0.1 (RFC 8252). Không tự mở được trình duyệt (SSH, máy chủ…)
 *    thì in link để người dùng tự mở.
 *  • Tên đăng nhập + mật khẩu: ô mật khẩu KHÔNG hiện ký tự, xoá khỏi bộ nhớ
 *    ngay sau khi gửi.
 */
import { Box, useInput } from 'ink';
import { Text } from './chu';
import { kieuVien } from '../kyTu';
import { useEffect, useRef, useState } from 'react';
import { dangNhapMatKhau, dangNhapTrinhDuyet, huyDangNhapTrinhDuyet } from '../../../cuongmini-core/src/dangNhap';
import { moNgoai } from '../heThong';
import { veLogo } from '../logo';
import { THUONG_HIEU, dam, mau, mauInk, mo } from '../mau';
import { luuPhien, type NguoiDung } from '../phien';
import { MenuView, ONhapNho } from './thanhPhan';

type Buoc = 'chon' | 'trinhDuyet' | 'ten' | 'matKhau' | 'dang';

const LUA_CHON = [
  { giaTri: 'google', nhan: 'Tiếp tục với Google' },
  { giaTri: 'github', nhan: 'Tiếp tục với GitHub' },
  { giaTri: 'apple', nhan: 'Tiếp tục với Apple' },
  { giaTri: 'matKhau', nhan: 'Tên đăng nhập + mật khẩu' },
  { giaTri: 'thoat', nhan: 'Thoát' },
] as const;

export function ManDangNhap({ rong, nhacNho, onXong, onHuy }: {
  rong: number; nhacNho?: string; onXong: (n: NguoiDung) => void; onHuy: () => void;
}) {
  const [buoc, setBuoc] = useState<Buoc>('chon');
  const [chon, setChon] = useState(0);
  const [ten, setTen] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [loi, setLoi] = useState(nhacNho ?? '');
  const [url, setUrl] = useState('');
  const [moDuoc, setMoDuoc] = useState(true);
  const conSong = useRef(true);
  useEffect(() => () => { conSong.current = false; huyDangNhapTrinhDuyet(); }, []);

  const xong = (n: NguoiDung) => {
    luuPhien(n);
    if (conSong.current) onXong(n);
  };

  const trinhDuyet = (nha: 'google' | 'github' | 'apple') => {
    setBuoc('trinhDuyet');
    setLoi('');
    setUrl('');
    dangNhapTrinhDuyet(nha, async (u) => {
      setUrl(u);
      const ok = await moNgoai(u);
      setMoDuoc(ok);
      // Không mở được trình duyệt: VẪN chờ — người dùng tự mở link đang in trên màn hình.
      return true;
    }, 'terminal').then(xong, (e: Error) => {
      if (!conSong.current) return;
      setBuoc('chon');
      setLoi(e.message);
    });
  };

  const matKhauGui = () => {
    const mk = matKhau;
    setMatKhau('');
    setBuoc('dang');
    dangNhapMatKhau(ten.trim(), mk).then(xong, (e: Error) => {
      if (!conSong.current) return;
      setBuoc('matKhau');
      setLoi(e.message);
    });
  };

  useInput((input, key) => {
    if (buoc === 'chon') {
      if (key.upArrow) setChon((c) => (c - 1 + LUA_CHON.length) % LUA_CHON.length);
      else if (key.downArrow || key.tab) setChon((c) => (c + 1) % LUA_CHON.length);
      else if (key.escape || (key.ctrl && input === 'c')) onHuy();
      else if (key.return || /^[1-5]$/.test(input)) {
        const i = key.return ? chon : Number(input) - 1;
        const m = LUA_CHON[i]!;
        setChon(i);
        if (m.giaTri === 'thoat') onHuy();
        else if (m.giaTri === 'matKhau') { setLoi(''); setBuoc('ten'); }
        else trinhDuyet(m.giaTri);
      }
      return;
    }
    if (buoc === 'trinhDuyet') {
      if (key.escape || (key.ctrl && input === 'c')) { huyDangNhapTrinhDuyet(); setBuoc('chon'); }
      return;
    }
    if (buoc === 'ten' || buoc === 'matKhau') {
      if (key.escape || (key.ctrl && input === 'c')) { setMatKhau(''); setBuoc('chon'); return; }
      const dat = buoc === 'ten' ? setTen : setMatKhau;
      if (key.return) {
        if (buoc === 'ten') { if (ten.trim()) setBuoc('matKhau'); }
        else if (matKhau) matKhauGui();
        return;
      }
      if (key.tab && buoc === 'ten' && ten.trim()) { setBuoc('matKhau'); return; }
      if (key.backspace || key.delete) { dat((v) => [...v].slice(0, -1).join('')); return; }
      if (key.ctrl && input === 'u') { dat(''); return; }
      if (input && !key.ctrl && !key.meta) dat((v) => v + input.replace(/[\r\n]/g, ''));
    }
  });

  const logo = veLogo(Math.min(rong - 4, 80));
  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text>{logo.join('\n')}</Text>
      </Box>
      <Text>{`${dam('Đăng nhập tài khoản cuongthai.com')} ${mo('để dùng CuongMini — lõi AI Code của CuongThai, ngay trong terminal.')}`}</Text>
      {loi ? <Box marginTop={1}><Text>{mau('#f87171')(`✕ ${loi}`)}</Text></Box> : null}
      {buoc === 'chon' ? (
        <MenuView tieuDe="Chọn cách đăng nhập" ds={LUA_CHON.map((l) => ({ ...l, giaTri: l.giaTri as string }))} chon={chon} loc="" coLoc={false} rong={Math.min(rong - 2, 70)} />
      ) : null}
      {buoc === 'trinhDuyet' ? (
        <Box borderStyle={kieuVien()} borderColor={mauInk(THUONG_HIEU.tim)} flexDirection="column" paddingX={1} marginTop={1} width={Math.min(rong - 2, 100)}>
          <Text>{`${mau(THUONG_HIEU.timNhat)('◐')} ${moDuoc ? 'Đã mở trình duyệt — đăng nhập xong sẽ tự quay lại đây…' : 'Không tự mở được trình duyệt. Mở link dưới đây bằng tay:'}`}</Text>
          {url ? <Box marginTop={1}><Text>{`${mo('Link:')} ${mau('#60a5fa')(url)}`}</Text></Box> : null}
          <Text>{mo('Esc để huỷ · tự huỷ sau 5 phút')}</Text>
        </Box>
      ) : null}
      {buoc === 'ten' || buoc === 'matKhau' || buoc === 'dang' ? (
        <Box borderStyle={kieuVien()} borderColor={mauInk(THUONG_HIEU.tim)} flexDirection="column" paddingX={1} marginTop={1} width={Math.min(rong - 2, 70)}>
          <ONhapNho nhan="Tên / email" giaTri={ten} dangNhap={buoc === 'ten'} />
          <ONhapNho nhan="Mật khẩu" giaTri={buoc === 'dang' ? '••••••' : matKhau} an dangNhap={buoc === 'matKhau'} />
          <Box marginTop={1}><Text>{buoc === 'dang' ? mau(THUONG_HIEU.timNhat)('Đang đăng nhập…') : mo('Enter tiếp tục · Esc quay lại')}</Text></Box>
        </Box>
      ) : null}
      <Box marginTop={1}><Text>{mo('Chưa có tài khoản? Đăng ký ở https://cuongthai.com/register')}</Text></Box>
    </Box>
  );
}
