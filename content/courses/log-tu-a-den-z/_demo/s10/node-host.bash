# 10.4 — Chạy trong container lgz-node của Lab 10: pino-pretty, winston vs pino, lỗi khởi động/kết nối hay gặp
grep -m2 '"level":50' logs/app.log | docker exec -i lgz-node node_modules/.bin/pino-pretty --colorize false --ignore req.headers,pid,hostname | head -n 14
docker exec lgz-node node -e "require('pino')({base: {service: 'shop-api'}}).error({orderId: 1007}, 'inventory call failed')"
docker exec lgz-node node -e "const w = require('winston'); w.createLogger({format: w.format.combine(w.format.timestamp(), w.format.json()), defaultMeta: {service: 'shop-api'}, transports: [new w.transports.Console()]}).error('inventory call failed', {orderId: 1007})"
docker exec lgz-node node app.js 2>&1 | head -n 6
docker exec lgz-node node -e "fetch('http://10.255.255.1/').catch(e => console.log(e.message, '<-', e.cause.code, e.cause.message))"
docker exec lgz-node node -e "fetch('http://127.0.0.1:41999/').catch(e => console.log(e.message, '<-', e.cause.code, e.cause.message))"
docker exec lgz-node node -e "fetch('http://kho.invalid/').catch(e => console.log(e.message, '<-', e.cause.code, e.cause.message))"
