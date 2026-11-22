import { parentPort, workerData } from 'node:worker_threads';
import { yearlyReport } from './m02-lib.mjs';
parentPort.postMessage(yearlyReport(workerData));
