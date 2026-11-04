# Ch11 · 11.2 — tshark đọc .pcap: lọc HTTP (method/uri/status) rồi THEO luồng TCP để thấy request/response thật.
echo "== http filter: method / uri / status =="
tshark -r /tmp/cap.pcap -Y http -T fields -e http.request.method -e http.request.uri -e http.response.code 2>/dev/null
echo "== follow tcp stream 0 =="
tshark -r /tmp/cap.pcap -q -z follow,tcp,ascii,0 2>/dev/null | sed -n '1,12p'
