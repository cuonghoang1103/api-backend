// Lesson 8.2: run ONLY the weak suite of lesson 8.1 (100% coverage of booking.js).
import { defineConfig, mergeConfig } from 'vitest/config';
import base from '../vitest.config.js';

export default mergeConfig(base, defineConfig({ test: { include: ['demo8/du-nhanh.test.js'] } }));
