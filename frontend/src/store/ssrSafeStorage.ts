interface SyncStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

export const ssrSafeStorage: SyncStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(name);
      // Return null for null, undefined, or invalid values to prevent JSON.parse errors
      if (item === null || item === 'null' || item === 'undefined' || item === '') {
        return null;
      }
      return item;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // quota exceeded or private mode
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};
