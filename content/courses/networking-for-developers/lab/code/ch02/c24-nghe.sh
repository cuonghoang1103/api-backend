# Ch2 · 2.4 — máy chủ: app nghe 0.0.0.0 (chỉ IPv4) với app nghe :: (cả hai) — và địa chỉ "::ffff:" trong log
@ node -e "require('http').createServer((q,s)=>s.end('v4-only app sees '+q.socket.remoteAddress+'\n')).listen(3000,'0.0.0.0')" & sleep 0.3
@ node -e "require('http').createServer((q,s)=>s.end('dual-stack app sees '+q.socket.remoteAddress+'\n')).listen(3001)" & sleep 1
ss -tln 'sport = :3000 or sport = :3001'
