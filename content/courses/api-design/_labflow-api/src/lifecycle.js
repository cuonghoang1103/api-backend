// lifecycle.js — bài 12.7: trạng thái vòng đời của instance. draining = đã nhận SIGTERM, đang tắt êm.
import { EventEmitter } from 'node:events';

export const lifecycle = Object.assign(new EventEmitter(), { draining: false, startedAt: Date.now() });
