# @ chạy trên "may-nha" (bash ch02/c27-dung.sh trước): docker exec -w /lab/ch02 os-c27-nha bash -c "phien c27-ssh.sh 2>&1"
ssh -o BatchMode=yes -o ConnectTimeout=5 vps 'hostname; uptime'
ssh vps "df -h / | tail -1; free -m | sed -n 2p"
ssh vps 'systemctl is-active ctw-web; systemctl show ctw-web -p MainPID -p NRestarts -p MemoryCurrent'
ssh -o BatchMode=yes -o ConnectTimeout=3 -p 2222 vps true; echo "exit=$?"
du -sh /srv/build; find /srv/build -type f | wc -l
rsync -az --delete --bwlimit=20000 --info=progress2,stats1 /srv/build/ vps:/srv/app/ | tr '\r' '\n' | awk 'NF && (++n <= 7 || /to-chk=0\// || !/[0-9]%/)'
echo "// hotfix" >> /srv/build/server-chunk-2.js; rsync -az --delete --info=progress2,stats1 /srv/build/ vps:/srv/app/ | tr '\r' '\n' | awk 'NF'
ssh vps 'for p in /health /api/v1/admin/users /api/v1/gifs; do echo "$p $(curl -s -o /dev/null -w "%{http_code}" localhost:3000$p)"; done'
