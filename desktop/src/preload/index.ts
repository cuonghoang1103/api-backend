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
  AgentInfo,
  AgentCuocDangMo,
  AgentMcpTrangThai,
  AgentMucKhoiPhuc,
  AgentPhien,
  AgentQuyetDinh,
  AgentWorkspace,
  MucNoLuc,
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
  UpdateStatus,
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
  'agent:event',
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
    getStatus: () => ipcRenderer.invoke('update:getStatus') as Promise<UpdateStatus>,
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

  agent: {
    getInfo: () => ipcRenderer.invoke('agent:getInfo') as Promise<AgentInfo>,
    getWorkspace: (cuocId: string) =>
      ipcRenderer.invoke('agent:getWorkspace', { cuocId }) as Promise<AgentWorkspace>,
    chooseWorkspace: (cuocId: string) =>
      ipcRenderer.invoke('agent:chooseWorkspace', { cuocId }) as Promise<AgentWorkspace>,
    clearWorkspace: (cuocId: string) =>
      ipcRenderer.invoke('agent:clearWorkspace', { cuocId }) as Promise<AgentWorkspace>,
    // Không có timeout ở đây: một lượt agent chạy vài phút là bình thường. Muốn
    // dừng thì gọi `cancel()`, đừng trông vào việc lời hứa này tự bỏ cuộc.
    taoCuoc: () => ipcRenderer.invoke('agent:taoCuoc') as Promise<string>,
    dongCuoc: (cuocId: string) => ipcRenderer.invoke('agent:dongCuoc', { cuocId }) as Promise<void>,
    send: (cuocId: string, text: string, anh?: string[]) =>
      ipcRenderer.invoke('agent:send', { cuocId, text, anh }) as Promise<void>,
    cancel: (cuocId: string) => ipcRenderer.invoke('agent:cancel', { cuocId }) as Promise<void>,
    reset: (cuocId: string) => ipcRenderer.invoke('agent:reset', { cuocId }) as Promise<void>,
    traLoiXinPhep: (cuocId: string, id: string, quyetDinh: AgentQuyetDinh) =>
      ipcRenderer.invoke('agent:traLoiXinPhep', { cuocId, id, quyetDinh }) as Promise<void>,
    datCheDoSua: (cuocId: string, bat: boolean) =>
      ipcRenderer.invoke('agent:datCheDoSua', { cuocId, bat }) as Promise<AgentWorkspace>,
    datCheDoLenh: (cuocId: string, bat: boolean) =>
      ipcRenderer.invoke('agent:datCheDoLenh', { cuocId, bat }) as Promise<AgentWorkspace>,
    datMucNoLuc: (muc: MucNoLuc) =>
      ipcRenderer.invoke('agent:datMucNoLuc', { muc }) as Promise<void>,
    hoanTac: (cuocId: string) =>
      ipcRenderer.invoke('agent:hoanTac', { cuocId }) as Promise<{ soFile: number; loi: string[] }>,
    dsPhien: () => ipcRenderer.invoke('agent:dsPhien') as Promise<AgentPhien[]>,
    moPhien: (cuocId: string, id: string) =>
      ipcRenderer.invoke('agent:moPhien', { cuocId, id }) as
        Promise<{ muc: AgentMucKhoiPhuc[] } | null>,
    xoaPhien: (id: string) => ipcRenderer.invoke('agent:xoaPhien', { id }) as Promise<void>,
    dsCuoc: () => ipcRenderer.invoke('agent:dsCuoc') as Promise<AgentCuocDangMo[]>,
    bangGhi: (cuocId: string) =>
      ipcRenderer.invoke('agent:bangGhi', { cuocId }) as
        Promise<{ muc: AgentMucKhoiPhuc[]; dangChay: boolean }>,
    mcpTrangThai: () => ipcRenderer.invoke('agent:mcpTrangThai') as Promise<AgentMcpTrangThai>,
    mcpNapLai: () => ipcRenderer.invoke('agent:mcpNapLai') as Promise<AgentMcpTrangThai>,
    mcpMoCauHinh: () => ipcRenderer.invoke('agent:mcpMoCauHinh') as Promise<void>,
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
