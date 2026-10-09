/**
 * Tên trạng thái / loại thẻ là DỮ LIỆU của dự án (đội tự đổi được, JQL tìm theo tên gốc). Ở đây chỉ dịch phần HIỂN
 * THỊ của những tên MẶC ĐỊNH do mẫu dự án tạo; tên tự đặt giữ nguyên. Không bao giờ gửi tên đã dịch lên máy chủ.
 */
import { translate, type WKey, type WorkLocale } from './core';
import { currentWorkLocale } from './store';

const STATUS: Record<string, WKey> = {
  'to do': 'status.stToDo', 'in progress': 'status.stInProgress', done: 'status.stDone', 'in review': 'status.stInReview',
  'code review': 'status.stCodeReview', qa: 'status.stQa', backlog: 'status.stBacklog', open: 'status.stOpen',
  closed: 'status.stClosed', fixed: 'status.stFixed', reopened: 'status.stReopened', retest: 'status.stRetest',
  selected: 'status.stSelected', doing: 'status.stDoing',
};
const TYPE: Record<string, WKey> = {
  epic: 'status.tyEpic', story: 'status.tyStory', task: 'status.tyTask', bug: 'status.tyBug',
  requirement: 'status.tyRequirement', test: 'status.tyTest', 'sub-task': 'status.tySubtask', subtask: 'status.tySubtask',
};

export function statusNameIn(locale: WorkLocale, name: string): string {
  if (locale === 'en') return name;
  const k = STATUS[name.trim().toLowerCase()];
  return k ? translate(locale, k) : name;
}
export function typeNameIn(locale: WorkLocale, name: string): string {
  if (locale === 'en') return name;
  const k = TYPE[name.trim().toLowerCase()];
  return k ? translate(locale, k) : name;
}
/** Tên trạng thái để HIỂN THỊ theo ngôn ngữ CT Work hiện tại. */
export const statusName = (name: string) => statusNameIn(currentWorkLocale(), name);
/** Tên loại thẻ để HIỂN THỊ theo ngôn ngữ CT Work hiện tại. */
export const typeName = (name: string) => typeNameIn(currentWorkLocale(), name);
