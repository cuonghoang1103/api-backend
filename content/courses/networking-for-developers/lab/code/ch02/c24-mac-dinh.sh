# Ch2 · 2.4 — các con số mặc định đứng sau Happy Eyeballs và sau một lần kết nối treo
node -p "process.version + ' autoSelectFamily=' + require('net').getDefaultAutoSelectFamily() + ' attemptTimeout=' + require('net').getDefaultAutoSelectFamilyAttemptTimeout() + ' ms'"
curl --version | head -1
sysctl net.ipv4.tcp_syn_retries
