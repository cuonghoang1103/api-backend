import { app } from './app.js';
import { attachWs } from './ws.js';

const PORT = process.env.PORT ?? 4000;
const server = app.listen(PORT, () => console.log(`LabFlow API chạy ở http://localhost:${PORT}`));
attachWs(server);                                             // bài 10.4: WebSocket dùng chung cổng với HTTP
