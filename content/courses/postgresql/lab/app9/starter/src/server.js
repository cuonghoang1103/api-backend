// server.js — start one API process. Several processes (or containers) ⇒ several pools: see C6.
import { taoPrisma, thongSoPool } from './db.js';
import { taoApp } from './app.js';

const prisma = taoPrisma();
const app = taoApp(prisma);
const port = Number(process.env.PORT ?? 3009);
const server = app.listen(port, () => console.log(`ctshop-api on http://localhost:${port} · pool`, thongSoPool()));

// Close the pool cleanly on Ctrl+C / docker stop, so PostgreSQL does not keep half-open sessions.
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(async () => { await prisma.$disconnect(); process.exit(0); }));
