// Start the real server: JWT_SECRET=… PORT=3000 node src/api/main.js
// Tests never import this file — they use createApp() and Supertest, which opens a temporary port by itself.
import { createApp } from './server.js';
import { createAuth } from './auth.js';
import { createMemoryRepo } from '../booking/service.js';

const app = createApp({ repo: createMemoryRepo(), auth: createAuth({ secret: process.env.JWT_SECRET }) });
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log('LabFlow Lite API on http://localhost:' + port));
