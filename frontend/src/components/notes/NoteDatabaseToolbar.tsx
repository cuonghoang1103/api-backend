'use client';

/**
 * Thanh lọc · sắp xếp · nhóm · ẩn cột cho một khung nhìn database.
 *
 * ─── Vì sao lưu bằng DEBOUNCE chứ không lưu mỗi lần đổi ───
 * Người dùng gõ vào ô giá trị của một điều kiện là mỗi ký tự một lần đổi. Ghi
 * ngay nghĩa là một lượt PATCH cho mỗi phím — mà kết quả lọc thì đã hiện ra
 * tức thì rồi (lọc chạy ở trình duyệt). Chờ một nhịp im lặng rồi mới ghi giữ
 * đúng hành vi nhìn thấy được, chỉ bớt phần lãng phí không ai thấy.
 *
 * Trạng thái là của LỚP CHA. Component này không giữ bản sao nào của config —
 * hai nguồn sự thật cho cùng một bộ lọc sẽ lệch nhau ngay khi khung nhìn được
 * nạp lại từ máy chủ.
 */
import { useState } from 'react';
import { ArrowDownUp, Filter, Group, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import type { NoteDatabaseProperty } from '@/lib/api';
import {
  isUnaryOperator, operatorsFor, OPERATOR_LABEL,
  type FilterOperator, type ViewConfig,
} from '@/lib/noteDatabaseQuery';
import { optionNames } from '@/lib/noteDatabaseValues';

interface Props {
  properties: NoteDatabaseProperty[];
  config: ViewConfig;
  onChange: (next: ViewConfig) => void;
  /** Số dòng còn lại sau khi lọc, trên tổng số — để người dùng biết đã giấu bao nhiêu. */
  shown: number;
  total: number;
  canEdit: boolean;
}

type Panel = 'filter' | 'sort' | 'group' | 'columns' | null;

export default function NoteDatabaseToolbar({ properties, config, onChange, shown, total, canEdit }: Props) {
  const [panel, setPanel] = useState<Panel>(null);
  const toggle = (next: Panel) => setPanel((current) => (current === next ? null : next));

  const filterable = properties;
  const groupable = properties.filter((p) => ['SELECT', 'STATUS', 'CHECKBOX', 'TEXT', 'PERSON'].includes(p.type));

  const patch = (partial: Partial<ViewConfig>) => onChange({ ...config, ...partial });

  const chip = (active: boolean) =>
    `flex items-center gap-1 rounded px-2 py-1 text-[12px] transition ${
      active
        ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]'
    }`;

  return (
    <div className="border-b border-slate-200 dark:border-white/[0.06]">
      <div className="flex flex-wrap items-center gap-1 px-3 py-1.5">
        <div className="relative">
          <Search size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={config.search}
            onChange={(event) => patch({ search: event.target.value })}
            placeholder="Tìm trong bảng…"
            aria-label="Tìm trong bảng"
            className="w-40 rounded border border-slate-300 bg-white py-1 pl-7 pr-2 text-[12px] text-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
          />
        </div>

        <button type="button" onClick={() => toggle('filter')} className={chip(config.filters.length > 0)}>
          <Filter size={13} /> Lọc{config.filters.length > 0 ? ` (${config.filters.length})` : ''}
        </button>
        <button type="button" onClick={() => toggle('sort')} className={chip(config.sorts.length > 0)}>
          <ArrowDownUp size={13} /> Sắp xếp{config.sorts.length > 0 ? ` (${config.sorts.length})` : ''}
        </button>
        <button type="button" onClick={() => toggle('group')} className={chip(config.groupPropertyId !== null)}>
          <Group size={13} /> Nhóm
        </button>
        <button type="button" onClick={() => toggle('columns')} className={chip(config.hiddenPropertyIds.length > 0)}>
          <SlidersHorizontal size={13} /> Cột{config.hiddenPropertyIds.length > 0 ? ` (ẩn ${config.hiddenPropertyIds.length})` : ''}
        </button>

        {/* Nói rõ đã giấu bao nhiêu dòng. Không có dòng này thì một bộ lọc bỏ
            quên trông y hệt như dữ liệu bị mất, và đó là lúc người dùng hoảng. */}
        {shown !== total && (
          <span className="ml-auto text-[11.5px] text-amber-700 dark:text-amber-300">
            Hiện {shown}/{total} dòng
            <button
              type="button"
              onClick={() => patch({ filters: [], search: '' })}
              className="ml-1.5 underline underline-offset-2 hover:no-underline"
            >
              bỏ lọc
            </button>
          </span>
        )}
      </div>

      {panel === 'filter' && (
        <div className="space-y-1.5 border-t border-slate-100 px-3 py-2 dark:border-white/[0.05]">
          {config.filters.length > 1 && (
            <div className="flex items-center gap-1 text-[11.5px] text-slate-500">
              Khớp
              {(['and', 'or'] as const).map((join) => (
                <button
                  key={join}
                  type="button"
                  onClick={() => patch({ filterJoin: join })}
                  className={`rounded px-1.5 py-0.5 ${config.filterJoin === join ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}
                >
                  {join === 'and' ? 'mọi điều kiện' : 'bất kỳ điều kiện'}
                </button>
              ))}
            </div>
          )}

          {config.filters.map((filter, index) => {
            const property = properties.find((p) => p.id === filter.propertyId);
            const options = property ? optionNames(property) : [];
            return (
              <div key={index} className="flex flex-wrap items-center gap-1">
                <select
                  value={filter.propertyId}
                  aria-label="Cột"
                  onChange={(event) => {
                    const nextId = Number(event.target.value);
                    const nextProperty = properties.find((p) => p.id === nextId);
                    // Đổi cột thì toán tử cũ có thể không dùng được cho kiểu mới
                    // (ví dụ "≥" trên cột chữ). Đặt lại về toán tử đầu tiên hợp lệ.
                    const nextOps = nextProperty ? operatorsFor(nextProperty.type) : (['contains'] as FilterOperator[]);
                    const next = [...config.filters];
                    next[index] = { propertyId: nextId, operator: nextOps[0]!, value: '' };
                    patch({ filters: next });
                  }}
                  className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[12px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                >
                  {filterable.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                <select
                  value={filter.operator}
                  aria-label="Điều kiện"
                  onChange={(event) => {
                    const next = [...config.filters];
                    next[index] = { ...filter, operator: event.target.value as FilterOperator };
                    patch({ filters: next });
                  }}
                  className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[12px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                >
                  {(property ? operatorsFor(property.type) : []).map((op) => (
                    <option key={op} value={op}>{OPERATOR_LABEL[op]}</option>
                  ))}
                </select>

                {!isUnaryOperator(filter.operator) && (
                  <input
                    value={filter.value ?? ''}
                    aria-label="Giá trị"
                    type={property && ['DATE', 'CREATED_TIME', 'LAST_EDITED_TIME'].includes(property.type) ? 'date' : 'text'}
                    list={options.length > 0 ? `filter-opts-${property?.id}` : undefined}
                    onChange={(event) => {
                      const next = [...config.filters];
                      next[index] = { ...filter, value: event.target.value };
                      patch({ filters: next });
                    }}
                    className="w-32 rounded border border-slate-300 bg-white px-1.5 py-1 text-[12px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                  />
                )}
                {options.length > 0 && (
                  <datalist id={`filter-opts-${property?.id}`}>
                    {options.map((option) => <option key={option} value={option} />)}
                  </datalist>
                )}

                <button
                  type="button"
                  aria-label="Xoá điều kiện"
                  onClick={() => patch({ filters: config.filters.filter((_, i) => i !== index) })}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10"
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}

          {canEdit && filterable.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const first = filterable[0]!;
                patch({ filters: [...config.filters, { propertyId: first.id, operator: operatorsFor(first.type)[0]!, value: '' }] });
              }}
              className="flex items-center gap-1 rounded px-1.5 py-1 text-[12px] text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Plus size={13} /> Thêm điều kiện
            </button>
          )}
        </div>
      )}

      {panel === 'sort' && (
        <div className="space-y-1.5 border-t border-slate-100 px-3 py-2 dark:border-white/[0.05]">
          {config.sorts.map((sort, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="w-4 text-[11px] text-slate-400">{index + 1}</span>
              <select
                value={sort.propertyId}
                aria-label="Cột sắp xếp"
                onChange={(event) => {
                  const next = [...config.sorts];
                  next[index] = { ...sort, propertyId: Number(event.target.value) };
                  patch({ sorts: next });
                }}
                className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[12px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
              >
                {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select
                value={sort.direction}
                aria-label="Chiều sắp xếp"
                onChange={(event) => {
                  const next = [...config.sorts];
                  next[index] = { ...sort, direction: event.target.value as 'asc' | 'desc' };
                  patch({ sorts: next });
                }}
                className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[12px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
              <button
                type="button"
                aria-label="Xoá mức sắp xếp"
                onClick={() => patch({ sorts: config.sorts.filter((_, i) => i !== index) })}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10"
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {canEdit && properties.length > 0 && (
            <button
              type="button"
              onClick={() => patch({ sorts: [...config.sorts, { propertyId: properties[0]!.id, direction: 'asc' }] })}
              className="flex items-center gap-1 rounded px-1.5 py-1 text-[12px] text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Plus size={13} /> Thêm mức sắp xếp
            </button>
          )}
          {config.sorts.length > 1 && (
            <p className="text-[11px] text-slate-400">Mức 1 quyết định trước; các mức sau chỉ dùng khi hoà.</p>
          )}
        </div>
      )}

      {panel === 'group' && (
        <div className="border-t border-slate-100 px-3 py-2 dark:border-white/[0.05]">
          <select
            value={config.groupPropertyId ?? ''}
            aria-label="Nhóm theo cột"
            onChange={(event) => patch({ groupPropertyId: event.target.value === '' ? null : Number(event.target.value) })}
            className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[12px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
          >
            <option value="">Không nhóm</option>
            {groupable.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {groupable.length === 0 && (
            <p className="mt-1 text-[11px] text-slate-400">
              Chưa có cột nào nhóm được. Nhóm theo cột Một lựa chọn, Trạng thái, Ô đánh dấu, Văn bản hoặc Người.
            </p>
          )}
        </div>
      )}

      {panel === 'columns' && (
        <div className="flex flex-wrap gap-1 border-t border-slate-100 px-3 py-2 dark:border-white/[0.05]">
          {properties.map((property) => {
            const hidden = config.hiddenPropertyIds.includes(property.id);
            return (
              <button
                key={property.id}
                type="button"
                // Cột tiêu đề không ẩn được — ẩn nó thì mọi dòng mất nhãn.
                disabled={property.isTitle}
                onClick={() => patch({
                  hiddenPropertyIds: hidden
                    ? config.hiddenPropertyIds.filter((id) => id !== property.id)
                    : [...config.hiddenPropertyIds, property.id],
                })}
                className={`rounded px-2 py-1 text-[12px] ${
                  property.isTitle
                    ? 'cursor-default bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500'
                    : hidden
                      ? 'bg-slate-100 text-slate-400 line-through dark:bg-white/[0.06] dark:text-slate-500'
                      : 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200'
                }`}
                title={property.isTitle ? 'Cột tiêu đề luôn hiện' : hidden ? 'Bấm để hiện' : 'Bấm để ẩn'}
              >
                {property.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
