// Runs before every web test file (vitest.web.config.js → setupFiles).
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';   // toBeInTheDocument, toHaveAccessibleName, toBeDisabled …

afterEach(cleanup);   // without Vitest globals, Testing Library cannot unmount by itself (lesson 6.1)
