import { useEffect, useState } from 'react';
import type { AppInfo } from '../../shared/ipc';

export function About() {
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    void window.cuongthai?.app.getInfo().then(setInfo);
  }, []);

  return (
    <div className="ct-page">
      <div className="ct-panel">
        <h1>CuongThai Desktop</h1>
        <p className="ct-muted">
          Ứng dụng desktop cho cuongthai.com — nền tảng CuongHoangDev.
        </p>

        <dl className="ct-rows">
          <div className="ct-row">
            <dt>Phiên bản</dt>
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
            <dt>Nền tảng</dt>
            <dd>{info ? `${info.platform} · ${info.arch}` : '…'}</dd>
          </div>
          <div className="ct-row">
            <dt>Máy chủ API</dt>
            <dd>{info?.apiOrigin ?? '…'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
