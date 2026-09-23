'use client';

/**
 * Lưới widget kéo-thả để sắp xếp lại khi đang sửa dashboard (dnd-kit, cùng
 * thư viện với Board/Backlog). Chỉ kéo bằng tay nắm ⠿ — bấm vào biểu đồ, link
 * trong widget vẫn hoạt động bình thường. Bàn phím: Tab tới tay nắm, Space để
 * nhấc, mũi tên để di chuyển, Space để thả.
 */

import type { ReactNode } from 'react';
import {
  closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

function Item({ id, className, disabled, children }: {
  id: string; className?: string; disabled: boolean; children: (handle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const handle = disabled ? null : (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      title="Drag to reorder"
      aria-label="Drag to reorder widget"
      className="w-btn w-btn-ghost w-btn-icon w-btn-sm cursor-grab touch-none active:cursor-grabbing"
    >
      <GripVertical size={13} />
    </button>
  );
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('min-w-0', className, isDragging && 'relative z-[5] opacity-80 [&>*]:shadow-[var(--w-shadow-pop)]')}
    >
      {children(handle)}
    </div>
  );
}

export default function SortableWidgets<T extends { id: string }>({ items, editing, onReorder, className, itemClassName, renderItem }: {
  items: T[];
  /** Chỉ kéo được khi đang sửa. */
  editing: boolean;
  onReorder: (next: T[]) => void;
  /** Lớp của lưới (vd "grid grid-cols-1 gap-3 md:grid-cols-2"). */
  className?: string;
  /** Lớp của từng ô lưới (vd widget rộng: "md:col-span-2"). */
  itemClassName?: (item: T) => string | undefined;
  /** `handle` = tay nắm kéo (null khi không sửa) — đặt vào thanh tiêu đề widget. */
  renderItem: (item: T, index: number, handle: ReactNode) => ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragEnd = (e: DragEndEvent) => {
    const from = items.findIndex((w) => w.id === e.active.id);
    const to = items.findIndex((w) => w.id === e.over?.id);
    if (from === -1 || to === -1 || from === to) return;
    onReorder(arrayMove(items, from, to));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((w) => w.id)} strategy={rectSortingStrategy}>
        <div className={className}>
          {items.map((w, i) => (
            <Item key={w.id} id={w.id} disabled={!editing} className={itemClassName?.(w)}>
              {(handle) => renderItem(w, i, handle)}
            </Item>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
