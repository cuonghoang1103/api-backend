'use client';
/**
 * Vỏ bọc chung quanh MỌI mô phỏng (bài học lẫn trang /cpu-lab, /os-lab): cấp LabBus cho mô phỏng công bố trạng thái,
 * gắn thanh hướng dẫn + nút âm thanh + câu gợi ý vào đầu khung (qua LabChromeContext — Frame tự đọc), và lớp phủ
 * tô sáng / thẻ hướng dẫn khi tour chạy.
 *
 *   tourId   — bài học (class <ns>-t-<id>) hoặc ?tour=… đã chọn tour ⇒ hiện dải giới thiệu nổi bật
 *   autoStart — mở là chạy luôn (trang phòng lab có ?tour=…)
 *   record   — chế độ quay video (?record=1): tự chạy theo dòng thời gian cố định, không ngẫu nhiên
 */
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { LabBus, LabBusProvider } from './bus';
import { LABS } from './registry';
import { LabChromeContext } from './chrome';
import { FALLBACK_ICON, SIM_HINT, SIM_ICON } from './meta';
import { startSfxLog } from './sfx';
import { TOUR_BY_ID, defaultTour, toursOf } from './tour';
import { TourOverlay, TourToolbar } from './tour/TourLayer';
import { useTourRunner } from './tour/useTourRunner';
import type { LabNs } from './selector';

export function LabShell({ ns, name, preset, lang, tourId, autoStart, record = false, rate = 1, children }: {
  ns: LabNs; name: string; preset?: string; lang: 'en' | 'vi'; tourId?: string; autoStart?: boolean; record?: boolean; rate?: number; children: ReactNode;
}) {
  const bus = useMemo(() => { const b = new LabBus(); b.record = record; return b; }, [record]);
  const rootRef = useRef<HTMLDivElement>(null);
  const tours = useMemo(() => toursOf(ns, name), [ns, name]);
  const picked = tourId ? TOUR_BY_ID.get(tourId) : undefined;
  const chosen = picked && picked.ns === ns && picked.sim === name ? picked : undefined;
  const fallback = useMemo(() => defaultTour(ns, name, preset ?? LABS[ns].labs[name]?.presets[0]), [ns, name, preset]);
  const run = useTourRunner(bus, lang, record, rate);
  const Icon = SIM_ICON[ns][name] ?? FALLBACK_ICON;

  // tự chạy (trang phòng lab có ?tour=…, hoặc chế độ quay): đợi mô phỏng vẽ xong một nhịp rồi mới bắt đầu
  useEffect(() => {
    if (!(autoStart || record) || !(chosen ?? fallback)) return;
    if (record) startSfxLog();
    const id = window.setTimeout(() => run.start((chosen ?? fallback)!), record ? 900 : 500);
    return () => window.clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ordered = chosen ? [chosen, ...tours.filter((x) => x.id !== chosen.id)] : fallback ? [fallback, ...tours.filter((x) => x.id !== fallback.id)] : tours;
  const chrome = {
    icon: <Icon />,
    rootRef,
    touring: run.phase !== 'idle',
    toolbar: <TourToolbar lang={lang} run={run} tours={ordered} chosen={chosen ?? fallback} featured={!!chosen} hint={SIM_HINT[ns][name]} record={record} />,
    overlay: <TourOverlay lang={lang} run={run} rootRef={rootRef} record={record} />,
  };
  return (
    <LabBusProvider bus={bus}>
      <LabChromeContext.Provider value={chrome}>{children}</LabChromeContext.Provider>
    </LabBusProvider>
  );
}
