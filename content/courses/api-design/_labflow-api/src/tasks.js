// tasks.js — việc chạy nền mà LabFlow biết làm (bài 10.1). API chỉ XẾP việc; worker (hoặc runner trong RAM) chạy việc.
// run(data, { progress(done, total), signal }) ⇒ chuỗi kết quả; type = Content-Type của kết quả.
import { exportBookings } from './exportTask.js';
import { usageReport } from './reportTask.js';

export const TASKS = {
  'bookings-export': { run: exportBookings, type: 'text/csv; charset=utf-8', event: 'labflow.export.completed.v1' },
  'usage-report': { run: usageReport, type: 'application/json', event: 'labflow.report.ready.v1' },   // Lab 10
};
