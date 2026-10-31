# Ch2 · 2.4 — Happy Eyeballs: v6 hỏng mà trang vẫn mở, chỉ chậm hơn một chút
curl -sv -o /dev/null http://labflow.test/ 2>&1 | grep -E '^\* (  Trying|Connected|Established)'
curl -s -o /dev/null -w 'connected to %{remote_ip} after %{time_connect} s\n' http://labflow.test/
curl -6 -sS -o /dev/null -m 5 -w '%{remote_ip}\n' http://labflow.test/; echo "curl exit code $?"
node -e "const t=Date.now(); fetch('http://labflow.test/').then(r=>r.text()).then(b=>console.log('node fetch:', b.split('\n')[1], 'after', Date.now()-t, 'ms'))"
node --no-network-family-autoselection -e "const t=Date.now(); fetch('http://labflow.test/', {signal: AbortSignal.timeout(8000)}).then(r=>console.log(r.status)).catch(e=>console.log('node fetch without Happy Eyeballs:', e.cause?.code || e.name, 'after', Date.now()-t, 'ms'))"
