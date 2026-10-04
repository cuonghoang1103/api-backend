'use client';

/**
 * Kanban pipeline — kéo thẻ deal giữa các cột giai đoạn (dnd-kit).
 * Đầu cột: số deal, tổng giá trị, giá trị có trọng số (Σ giá trị × xác suất) — tách theo tiền tệ.
 * Luật chuyển (lý do thua, cổng go/no-go) do SERVER quyết; ở đây chỉ hỏi lý do khi thả vào LOST.
 * Điện thoại: cột rộng cố định, cuộn ngang trong khung riêng; giữ 250 ms rồi kéo (không ăn cuộn).
 */
import { useState } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import { AlertTriangle, Building2, FileSignature, Drama } from 'lucide-react';
import { useAdminT } from '@/components/admin/i18n';
import type { DealListItem, DealStage, Pipeline } from '@/lib/crm-api';
import { Chip, STAGE_LABEL, STAGE_TONE, fmtMoney, fmtMoneyMap } from './shared';

function Card({ deal, onOpen, overlay = false }: { deal: DealListItem; onOpen?: (id: number) => void; overlay?: boolean }) {
  const { L } = useAdminT();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `deal-${deal.id}`, data: { deal } });
  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      {...(overlay ? {} : listeners)}
      {...(overlay ? {} : attributes)}
      data-deal-id={deal.id}
      onClick={() => onOpen?.(deal.id)}
      className={`cursor-grab select-none rounded-[9px] border bg-[var(--a-raised)] p-2.5 text-left active:cursor-grabbing ${
        overlay ? 'border-[var(--a-accent-border)] shadow-2xl' : 'border-[var(--a-border)] hover:border-[var(--a-border-strong)]'
      } ${isDragging && !overlay ? 'opacity-30' : ''}`}
    >
      <p className="line-clamp-2 text-[12.5px] font-medium leading-[1.35] text-[var(--a-text)]">{deal.title}</p>
      {(deal.org || deal.contact) && (
        <p className="mt-1 flex items-center gap-1 truncate text-[11.5px] text-[var(--a-text-3)]">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{deal.org?.name ?? deal.contact?.name}</span>
        </p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="tabular-nums text-[12px] font-semibold text-[var(--a-text-2)]">{fmtMoney(deal.value, deal.currency, true)}</span>
        <span className="tabular-nums text-[11px] text-[var(--a-text-3)]">{deal.effectiveProbability}%</span>
      </div>
      {(deal.stale || deal.isRoleplay || deal.ndaSigned || deal.decision || deal.request) && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {deal.stale && (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[color:var(--a-orange)]" title={L('No activity for 14+ days', 'Hơn 14 ngày không có hoạt động')}>
              <AlertTriangle className="h-3 w-3" /> STALE
            </span>
          )}
          {deal.decision && <Chip tone={deal.decision === 'NO_GO' ? 'var(--a-red)' : 'var(--a-green)'}>{deal.decision.replace('_CONDITIONAL', '·C').replace('_', '-')}</Chip>}
          {deal.ndaSigned && <span title="NDA"><FileSignature className="h-3 w-3 text-[var(--a-text-3)]" /></span>}
          {deal.isRoleplay && <span title={L('Roleplay', 'Nhập vai')}><Drama className="h-3 w-3 text-[color:var(--a-yellow)]" /></span>}
          {deal.request && <span className="ml-auto text-[10.5px] tabular-nums text-[var(--a-text-3)]">{deal.request.code}</span>}
        </div>
      )}
    </div>
  );
}

function Column({ stage, pipeline, onOpen }: { stage: DealStage; pipeline: Pipeline; onOpen: (id: number) => void }) {
  const { vi, L } = useAdminT();
  const { setNodeRef, isOver } = useDroppable({ id: `stage-${stage}`, data: { stage } });
  const deals = pipeline.deals.filter((d) => d.stage === stage);
  const t = pipeline.totals[stage];
  return (
    <div
      ref={setNodeRef}
      data-stage={stage}
      className={`flex w-[264px] shrink-0 flex-col rounded-[11px] border ${isOver ? 'border-[var(--a-accent-border)] bg-[var(--a-accent-soft)]' : 'border-[var(--a-border)] bg-[var(--a-bg)]'}`}
    >
      <div className="border-b border-[var(--a-border)] px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--a-text)]">
            <span className="h-2 w-2 rounded-full" style={{ background: STAGE_TONE[stage] }} />
            {STAGE_LABEL[stage][vi ? 1 : 0]}
          </span>
          <span className="tabular-nums text-[11.5px] text-[var(--a-text-3)]">{t?.count ?? 0}</span>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px]">
          <span className="text-[var(--a-text-3)]">{L('Total', 'Tổng')}</span>
          <span className="text-right tabular-nums text-[var(--a-text-2)]" data-col-total>{fmtMoneyMap(t?.total)}</span>
          <span className="text-[var(--a-text-3)]">{L('Weighted', 'Có trọng số')}</span>
          <span className="text-right tabular-nums text-[var(--a-text-2)]" data-col-weighted>{fmtMoneyMap(t?.weighted)}</span>
        </div>
      </div>
      <div className="flex min-h-[120px] flex-1 flex-col gap-2 p-2">
        {deals.map((d) => <Card key={d.id} deal={d} onOpen={onOpen} />)}
        {!deals.length && <p className="px-1 py-6 text-center text-[11.5px] text-[var(--a-text-3)]">{L('Drop deals here', 'Thả deal vào đây')}</p>}
      </div>
    </div>
  );
}

export default function PipelineBoard({
  pipeline, onOpen, onMove,
}: {
  pipeline: Pipeline;
  onOpen: (id: number) => void;
  onMove: (deal: DealListItem, to: DealStage) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
  );
  const [active, setActive] = useState<DealListItem | null>(null);
  const onStart = (e: DragStartEvent) => setActive((e.active.data.current as { deal: DealListItem }).deal);
  const onEnd = (e: DragEndEvent) => {
    setActive(null);
    const deal = (e.active.data.current as { deal: DealListItem } | undefined)?.deal;
    const to = (e.over?.data.current as { stage: DealStage } | undefined)?.stage;
    if (deal && to && to !== deal.stage) onMove(deal, to);
  };
  return (
    <DndContext sensors={sensors} onDragStart={onStart} onDragEnd={onEnd} onDragCancel={() => setActive(null)}>
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex gap-2.5">
          {pipeline.stages.map((s) => <Column key={s} stage={s} pipeline={pipeline} onOpen={onOpen} />)}
        </div>
      </div>
      <DragOverlay>{active ? <div className="w-[248px]"><Card deal={active} overlay /></div> : null}</DragOverlay>
    </DndContext>
  );
}
