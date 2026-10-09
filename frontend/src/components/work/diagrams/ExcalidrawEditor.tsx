'use client';

/**
 * CTW Diagram — bảng vẽ tay / whiteboard bằng Excalidraw (MIT). Nạp LƯỜI: tệp này chỉ được import qua `next/dynamic`
 * (ssr:false) từ DiagramStudio ⇒ ~1 MB của Excalidraw không vào gói chính. Phông của Excalidraw tự host ở
 * `/excalidraw-assets/fonts` (CSP chặn font từ CDN; app desktop chạy ở app:// nên đường dẫn đi qua anhTuyetDoi).
 * Lưu = JSON Excalidraw (elements + appState gọn + files). Xem trước/nhúng Docs = PNG xuất ở trình duyệt.
 */

import '@excalidraw/excalidraw/index.css';
import { useEffect, useMemo, useRef, useState, type ComponentType, type MutableRefObject } from 'react';
import { anhTuyetDoi } from '@/lib/anhTuyetDoi';
import { useWT } from '@/components/work/i18n';

export interface ExcalidrawHandle {
  getJson(): string;
  toSvg(): Promise<string>;
  toPng(): Promise<Blob>;
}

type ExMod = typeof import('@excalidraw/excalidraw');
type Api = { getSceneElements(): readonly unknown[]; getAppState(): Record<string, unknown>; getFiles(): Record<string, unknown> };

if (typeof window !== 'undefined') {
  (window as unknown as { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = anhTuyetDoi('/excalidraw-assets/');
}

/** Tổng `version` của phần tử — đổi khi người vẽ (Excalidraw gọi onChange cả lúc chỉ cuộn/chọn). */
const versionSum = (els: ReadonlyArray<{ version?: number }>) => els.reduce((s, e) => s + (e.version ?? 0), 0);

/**
 * `handleRef` (không phải `ref`): `next/dynamic` KHÔNG chuyển tiếp ref ⇒ ref thường sẽ luôn null và Lưu/Xuất âm thầm dùng
 * bản cũ. Nơi gọi đưa một ref object, component tự gắn handle vào.
 */
export default function ExcalidrawEditor({ source, dark, readOnly, onDirty, label, handleRef }: { source: string; dark: boolean; readOnly: boolean; onDirty?: () => void; label: string; handleRef: MutableRefObject<ExcalidrawHandle | null> }) {
  const { t } = useWT();
  const [mod, setMod] = useState<ExMod | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const apiRef = useRef<Api | null>(null);
  useEffect(() => {
    let alive = true;
    import('@excalidraw/excalidraw').then((m) => { if (alive) setMod(m); }).catch((e: Error) => alive && setFailed(e.message));
    return () => { alive = false; };
  }, []);
  const initial = useMemo(() => {
    try {
      const o = JSON.parse(source || '{}') as { elements?: unknown[]; appState?: Record<string, unknown>; files?: Record<string, unknown> };
      return { elements: o.elements ?? [], appState: { ...(o.appState ?? {}), currentItemFontFamily: (o.appState?.currentItemFontFamily as number | undefined) ?? 6 }, files: o.files ?? {} };
    } catch { return { elements: [], appState: { currentItemFontFamily: 6 }, files: {} }; }
    // Chỉ nạp nguồn lúc gắn (đổi sơ đồ ⇒ key mới ở nơi gọi).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mốc so sánh = lần onChange ĐẦU (Excalidraw restore() tự điền version cho phần tử thiếu ⇒ không lấy từ JSON).
  const baseSum = useRef<number | null>(null);

  const handle = useMemo<ExcalidrawHandle>(() => ({
    getJson() {
      const api = apiRef.current;
      if (!api || !mod) return source;
      const json = mod.serializeAsJSON(api.getSceneElements() as never, api.getAppState() as never, api.getFiles() as never, 'local');
      return json;
    },
    async toSvg() {
      const api = apiRef.current;
      if (!api || !mod) throw new Error('The drawing is not ready yet');
      const svg = await mod.exportToSvg({ elements: api.getSceneElements() as never, appState: { ...(api.getAppState() as object), exportBackground: true, exportWithDarkMode: false } as never, files: api.getFiles() as never });
      return new XMLSerializer().serializeToString(svg);
    },
    async toPng() {
      const api = apiRef.current;
      if (!api || !mod) throw new Error('The drawing is not ready yet');
      return mod.exportToBlob({ elements: api.getSceneElements() as never, appState: { ...(api.getAppState() as object), exportBackground: true, exportWithDarkMode: false } as never, files: api.getFiles() as never, mimeType: 'image/png', exportPadding: 16 } as never);
    },
  }), [mod, source]);
  useEffect(() => { handleRef.current = handle; return () => { if (handleRef.current === handle) handleRef.current = null; }; }, [handle, handleRef]);

  if (failed) return <p className="p-4 text-[13px] text-[var(--w-red-text)]">{t('diagram.excalidrawFailed')}: {failed}</p>;
  if (!mod) return <div className="grid h-full place-items-center text-[13px] text-[var(--w-text-3)]">{t('diagram.loadingWhiteboard')}</div>;
  const Ex = mod.Excalidraw as unknown as ComponentType<Record<string, unknown>>;
  return (
    <div className="ctw-excalidraw h-full min-h-[420px] w-full" aria-label={label} role="region">
      <Ex
        initialData={initial}
        theme={dark ? 'dark' : 'light'}
        viewModeEnabled={readOnly}
        excalidrawAPI={(api: Api) => { apiRef.current = api; }}
        onChange={(els: ReadonlyArray<{ version?: number; isDeleted?: boolean }>) => { const v = versionSum(els); if (baseSum.current === null) { baseSum.current = v; return; } if (v !== baseSum.current) onDirty?.(); }}
        UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false, export: false, saveAsImage: false } }}
      />
    </div>
  );
}
