import type { CtltApi } from '../shared/ipc';

declare global {
  interface Window {
    ctlt: CtltApi;
  }
}

export {};
