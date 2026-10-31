# Ch2 · 2.1 — Docker cũng chia subnet: mạng mặc định và hai mạng của lab (chạy trên máy của bạn)
docker network inspect bridge -f '{{.Name}}: {{range .IPAM.Config}}{{.Subnet}} gateway {{.Gateway}}{{end}}'
docker network inspect nfd-lan nfd-dmz -f '{{.Name}}: {{range .IPAM.Config}}{{.Subnet}} gateway {{.Gateway}}{{end}}'
