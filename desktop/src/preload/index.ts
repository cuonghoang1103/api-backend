/**
 * Preload — bề mặt DUY NHẤT nối renderer với main.
 *
 * Chạy với `sandbox: true` + `contextIsolation: true`, nghĩa là file này KHÔNG
 * có `fs`, `child_process`, hay `require` tự do; nó chỉ được dùng `ipcRenderer`
 * và `contextBridge`. Mọi thứ nó phơi ra đều đi qua `contextBridge`, nên
 * renderer nhận về bản sao đã đóng băng chứ không phải tham chiếu sống — trang
 * web (kể cả nội dung bị chèn độc) không với ngược lên prototype của main được.
 *
 * File này CỐ Ý không import zod cũng không import bảng schema. Kiểm tra đầu
 * vào là việc của main (main/ipc/index.ts). Kiểm ở preload là kiểm ở phía tin
 * tưởng SAI: preload đứng cùng phía với renderer, ai kiểm soát được renderer
 * thì cũng vượt được lớp kiểm ở đây. Preload chỉ chuyển tiếp; main mới phán.
 */
import { contextBridge, ipcRenderer } from 'electron';
import type {
  AppInfo,
  DesktopBridge,
  EventChannel,
  SettingKey,
  SettingValue,
  DownloadedTrack,
  MusicUsage,
  NoteFileInfo,
  NotesFolder,
  StorageUsage,
  StoredSession,
} from '../shared/ipc';

/**
 * Danh sách trắng sự kiện, viết thẳng thành chuỗi (không import hằng dùng
 * chung) để preload không kéo theo module nào — bó nhỏ thì bề mặt tấn công nhỏ.
 * Phải khớp với `EVENT_CHANNELS` trong shared/ipc.ts; test đối chiếu hai bên.
 */
const ALLOWED_EVENTS: readonly EventChannel[] = [
  'app:networkChanged',
  'app:navigate',
  'update:status',
];

const bridge: DesktopBridge = {
  app: {
    getInfo: () => ipcRenderer.invoke('app:getInfo') as Promise<AppInfo>,
    openExternal: (url: string) =>
      ipcRenderer.invoke('app:openExternal', url) as Promise<void>,
    reload: () => ipcRenderer.invoke('app:reload') as Promise<void>,
    setZoom: (level: number) =>
      ipcRenderer.invoke('app:setZoom', level) as Promise<void>,
  },

  settings: {
    getAll: () =>
      ipcRenderer.invoke('settings:getAll') as Promise<
        Partial<Record<SettingKey, SettingValue>>
      >,
    set: (key: SettingKey, value: SettingValue) =>
      ipcRenderer.invoke('settings:set', { key, value }) as Promise<void>,
  },

  auth: {
    storeSession: (session: StoredSession) =>
      ipcRenderer.invoke('auth:storeSession', session) as Promise<void>,
    loadSession: () =>
      ipcRenderer.invoke('auth:loadSession') as Promise<StoredSession | null>,
    clearSession: () => ipcRenderer.invoke('auth:clearSession') as Promise<void>,
  },

  update: {
    check: () => ipcRenderer.invoke('update:check') as Promise<void>,
    install: () => ipcRenderer.invoke('update:install') as Promise<void>,
  },

  storage: {
    usage: () => ipcRenderer.invoke('storage:usage') as Promise<StorageUsage>,
    clearCache: () => ipcRenderer.invoke('storage:clearCache') as Promise<void>,
  },

  notes: {
    getFolder: () => ipcRenderer.invoke('notes:getFolder') as Promise<NotesFolder>,
    chooseFolder: () => ipcRenderer.invoke('notes:chooseFolder') as Promise<NotesFolder>,
    listFiles: () => ipcRenderer.invoke('notes:listFiles') as Promise<NoteFileInfo[]>,
    readFile: (fileName: string) =>
      ipcRenderer.invoke('notes:readFile', { fileName }) as Promise<string | null>,
    writeFile: (fileName: string, content: string) =>
      ipcRenderer.invoke('notes:writeFile', { fileName, content }) as Promise<void>,
    deleteFile: (fileName: string) =>
      ipcRenderer.invoke('notes:deleteFile', { fileName }) as Promise<void>,
    revealFolder: () => ipcRenderer.invoke('notes:revealFolder') as Promise<void>,
  },

  music: {
    listDownloaded: () =>
      ipcRenderer.invoke('music:listDownloaded') as Promise<DownloadedTrack[]>,
    saveAudio: (trackId: number, bytes: Uint8Array, ext: string) =>
      ipcRenderer.invoke('music:saveAudio', { trackId, bytes, ext }) as Promise<void>,
    deleteAudio: (trackId: number) =>
      ipcRenderer.invoke('music:deleteAudio', { trackId }) as Promise<void>,
    usage: () => ipcRenderer.invoke('music:usage') as Promise<MusicUsage>,
    clearAll: () => ipcRenderer.invoke('music:clearAll') as Promise<void>,
  },

  on: (channel: EventChannel, listener: (payload: unknown) => void) => {
    if (!ALLOWED_EVENTS.includes(channel)) {
      throw new Error(`Kênh sự kiện không được phép: ${channel}`);
    }
    // Bọc lại để KHÔNG chuyển `IpcRendererEvent` sang renderer. Đối tượng đó
    // mang theo `sender` — tức là một đường vòng ra ipcRenderer đầy đủ. Chỉ
    // đưa payload.
    const wrapped = (_event: unknown, payload: unknown) => listener(payload);
    ipcRenderer.on(channel, wrapped);
    return () => {
      ipcRenderer.removeListener(channel, wrapped);
    };
  },
};

contextBridge.exposeInMainWorld('cuongthai', bridge);
