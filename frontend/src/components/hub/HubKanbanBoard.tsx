'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { ExternalLink, GripVertical, Image } from 'lucide-react';
import ReactPlayer from 'react-player';
import { toast } from 'sonner';

import type { HubFile, HubLink } from '@/lib/api';
import { hubApi, hubFileApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubKanbanBoardProps {
  links: HubLink[];
  files: HubFile[];
  onEditLink: (link: HubLink) => void;
  onDeleteLink: (id: number) => void;
  onDeleteFile: (id: number) => void;
  onPreviewFile: (file: HubFile) => void;
  onRefresh: () => void;
}

const COLUMNS = [
  { id: 'unread', label: 'Chua doc', color: 'text-text-muted', borderColor: 'border-darkborder' },
  { id: 'learning', label: 'Dang hoc', color: 'text-neon-orange', borderColor: 'border-neon-orange/40' },
  { id: 'done', label: 'Hoan thanh', color: 'text-neon-emerald', borderColor: 'border-neon-emerald/40' },
];

type CardItem = { type: 'link'; data: HubLink } | { type: 'file'; data: HubFile };

function getItemsForColumn(items: CardItem[], status: string): CardItem[] {
  return items.filter((item) => {
    if (item.type === 'link') return item.data.status === status;
    if (item.type === 'file') return item.data.status === status;
    return false;
  });
}

export default function HubKanbanBoard({
  links, files, onEditLink, onDeleteLink, onDeleteFile, onPreviewFile, onRefresh,
}: HubKanbanBoardProps) {
  const allItems: CardItem[] = [
    ...links.map((l) => ({ type: 'link' as const, data: l })),
    ...files.map((f) => ({ type: 'file' as const, data: f })),
  ];

  const [activeItem, setActiveItem] = useState<CardItem | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const item = allItems.find((i) => `${i.type}-${i.type === 'link' ? i.data.id : (i.data as HubFile).id}` === event.active.id);
    if (item) setActiveItem(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) { setActiveColumn(null); return; }
    const overId = String(over.id);
    // over might be a column droppable or a card
    if (['unread', 'learning', 'done'].includes(overId)) {
      setActiveColumn(overId);
    } else {
      // over is a card — find its column
      const col = COLUMNS.find((c) =>
        getItemsForColumn(allItems, c.id).some(
          (item) => `${item.type}-${item.type === 'link' ? item.data.id : (item.data as HubFile).id}` === overId,
        ),
      );
      setActiveColumn(col?.id ?? null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    let targetStatus: string;
    const overId = String(over.id);

    if (activeColumn && ['unread', 'learning', 'done'].includes(activeColumn)) {
      targetStatus = activeColumn;
    } else if (['unread', 'learning', 'done'].includes(overId)) {
      targetStatus = overId;
    } else {
      // over is a card — find its column
      const col = COLUMNS.find((c) =>
        getItemsForColumn(allItems, c.id).some(
          (item) => `${item.type}-${item.type === 'link' ? item.data.id : (item.data as HubFile).id}` === overId,
        ),
      );
      if (!col) return;
      targetStatus = col.id;
    }

    const itemId = String(active.id);
    const [itemType, itemIdNum] = itemId.split('-');

    try {
      if (itemType === 'link') {
        await hubApi.updateLink(Number(itemIdNum), { status: targetStatus as 'unread' | 'learning' | 'done' });
      } else {
        await hubFileApi.update(Number(itemIdNum), { status: targetStatus as 'unread' | 'learning' | 'done' });
      }
      toast.success('Da cap nhat trang thai');
      onRefresh();
    } catch (err) {
      console.error('[hub] status update', err);
      toast.error('Khong the cap nhat trang thai');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colItems = getItemsForColumn(allItems, col.id);
          return (
            <div
              key={col.id}
              className={cn(
                'flex w-72 shrink-0 flex-col rounded-2xl border bg-darkcard/40 backdrop-blur-xl',
                col.borderColor,
              )}
            >
              {/* Column header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-bold uppercase tracking-wider', col.color)}>
                    {col.label}
                  </span>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-darkborder/60 px-1.5 text-[10px] text-text-muted">
                    {colItems.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <SortableContext
                id={`${col.id}-droppable`}
                items={colItems.map((i) => `${i.type}-${i.type === 'link' ? i.data.id : (i.data as HubFile).id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
                  {colItems.length === 0 && (
                    <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-darkborder/40 text-xs text-text-muted">
                      Keo card vao day
                    </div>
                  )}
                  {colItems.map((item) =>
                    item.type === 'link' ? (
                      <KanbanLinkCard
                        key={`link-${item.data.id}`}
                        link={item.data}
                        onEdit={onEditLink}
                        onDelete={onDeleteLink}
                      />
                    ) : (
                      <KanbanFileCard
                        key={`file-${item.data.id}`}
                        file={item.data}
                        onClick={onPreviewFile}
                        onDelete={onDeleteFile}
                      />
                    ),
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="w-72 rounded-2xl border border-neon-violet/40 bg-darkcard/90 shadow-[0_12px_40px_rgba(167,139,250,0.3)] backdrop-blur-xl">
            {activeItem.type === 'link' ? (
              <div className="flex items-center gap-2 p-3">
                <GripVertical className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-xs font-medium text-text-primary">{activeItem.data.title}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3">
                <GripVertical className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-xs font-medium text-text-primary">{(activeItem.data as HubFile).name}</span>
              </div>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Kanban Link Card ─────────────────────────────────────────

function KanbanLinkCard({
  link, onEdit, onDelete,
}: {
  link: HubLink;
  onEdit: (l: HubLink) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `link-${link.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-darkborder/50 bg-darkbg/60 backdrop-blur-sm',
        'hover:border-neon-violet/40',
      )}
    >
      <div className="flex items-start gap-2 p-2.5">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab text-text-muted transition-colors hover:text-text-primary active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <div className="min-w-0 flex-1">
          {link.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={link.thumbnailUrl}
              alt=""
              className="mb-2 h-12 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="mb-2 h-12 w-full rounded-lg bg-gradient-to-br from-neon-indigo/20 to-neon-violet/20" />
          )}
          <p className="line-clamp-2 text-xs font-semibold text-text-primary">{link.title}</p>
          {link.tags.length > 0 && (
            <p className="mt-1 text-[10px] text-text-muted">
              {link.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.04] px-2.5 pb-2 pt-1.5">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-text-muted transition-colors hover:text-neon-violet"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
        <button
          onClick={() => { if (confirm('Xoa link nay?')) onDelete(link.id); }}
          className="text-[10px] text-red-400/60 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
        >
          Xoa
        </button>
      </div>
    </div>
  );
}

// ─── Kanban File Card ─────────────────────────────────────────

function KanbanFileCard({
  file, onClick, onDelete,
}: {
  file: HubFile;
  onClick: (f: HubFile) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `file-${file.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-darkborder/50 bg-darkbg/60 p-2.5 backdrop-blur-sm hover:border-neon-violet/40"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-text-muted transition-colors hover:text-text-primary active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => onClick(file)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <Image className="h-4 w-4 shrink-0 text-neon-violet" />
        <span className="truncate text-xs font-medium text-text-primary">{file.name}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); if (confirm('Xoa file nay?')) onDelete(file.id); }}
        className="text-[10px] text-red-400/60 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
      >
        Xoa
      </button>
    </div>
  );
}
