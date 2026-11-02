// Lesson 9.5 — the entry point of a tiny TypeScript project
import { loadConfig } from './config.js';

const config = loadConfig(process.env);
console.log(`Server would listen on port ${config.port}`);
