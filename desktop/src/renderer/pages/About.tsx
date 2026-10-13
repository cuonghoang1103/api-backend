import { useEffect, useState } from 'react';
import type { AppInfo } from '../../shared/ipc';
import { useDich } from '../i18n';
import { LA_CTWORK } from '../../shared/bienThe';

export function About() {
  const { dich } = useDich();
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    void window.cuongthai?.app.getInfo().then(setInfo);
  }, []);

  return (
    <div className="ct-page">
      <div className="ct-panel">
        <h1>{LA_CTWORK ? 'CT Work Desktop' : 'CuongThai Desktop'}</h1>
        <p className="ct-muted">
          {LA_CTWORK
            ? dich('Ứng dụng desktop riêng của CT Work — quản lý dự án, đồ án và lớp học.')
            : dich('Ứng dụng desktop cho cuongthai.com — nền tảng CuongHoangDev.')}
        </p>

        <dl className="ct-rows">
          <div className="ct-row">
            <dt>{dich('Phiên bản')}</dt>
            <dd>{info?.version ?? '…'}</dd>
          </div>
          <div className="ct-row">
            <dt>Electron</dt>
            <dd>{info?.electronVersion ?? '…'}</dd>
          </div>
          <div className="ct-row">
            <dt>Chromium</dt>
            <dd>{info?.chromeVersion ?? '…'}</dd>
          </div>
          <div className="ct-row">
            <dt>Node</dt>
            <dd>{info?.nodeVersion ?? '…'}</dd>
          </div>
          <div className="ct-row">
            <dt>{dich('Nền tảng')}</dt>
            <dd>{info ? `${info.platform} · ${info.arch}` : '…'}</dd>
          </div>
          <div className="ct-row">
            <dt>{dich('Máy chủ API')}</dt>
            <dd>{info?.apiOrigin ?? '…'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
