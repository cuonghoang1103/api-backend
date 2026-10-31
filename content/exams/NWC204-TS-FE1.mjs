// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-NWC204-TS-FE1.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "NWC204"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE1",
      "title": "NWC204 — Practice Final 1 (self-composed)|||NWC204 — Đề luyện cuối kỳ 1 (tự soạn theo dạng đề)",
      "description": "Practice final written from the course content, following the usual exam format. Source: tự soạn theo dạng đề.|||Đề luyện viết mới từ nội dung môn học, theo đúng dạng đề thường gặp. Nguồn: tự soạn theo dạng đề.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "source": "SAMPLE",
      "shuffleQuestions": false,
      "shuffleOptions": false,
      "instructions": "<div class=\"ml-en\"><p>This is a <b>practice final</b> for <b>Computer Networking</b>, <b>self-composed</b> from the course content following the usual exam format (50 questions, 60 minutes). It is not an official exam paper. Every question is <b>multiple choice</b> and auto-graded.</p><ul><li>Some questions say \"Choose two\" — they are only correct when both right answers are selected.</li><li>Read code, tables and diagrams carefully; several questions turn on a subtle detail.</li></ul><p>You can flag a question and come back. The timer auto-submits at the end. After you submit, every question explains each option in both languages.</p></div><div class=\"ml-vi\"><p>Đây là <b>đề luyện cuối kỳ</b> môn <b>Mạng máy tính</b>, <b>tự soạn theo dạng đề</b> từ nội dung môn học (50 câu, 60 phút). Đây không phải đề thi chính thức. Mọi câu đều là <b>trắc nghiệm</b>, chấm tự động.</p><ul><li>Một số câu ghi \"Chọn hai\": chỉ đúng khi chọn đủ cả hai đáp án đúng.</li><li>Đọc kỹ code, bảng và sơ đồ; nhiều câu ăn thua ở một chi tiết nhỏ.</li></ul><p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp. Nộp xong, mỗi câu đều giải thích từng đáp án bằng hai thứ tiếng.</p></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A new laptop joins the network and needs an address from DHCP. What is the correct order of messages?</p></div><div class=\"ml-vi\"><p>Laptop mới vào mạng và cần địa chỉ từ DHCP. Thứ tự thông điệp đúng là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Discover, Request, Offer, Acknowledgment|||Discover, Request, Offer, Acknowledgment"
            },
            {
              "text": "Request, Offer, Discover, Acknowledgment|||Request, Offer, Discover, Acknowledgment"
            },
            {
              "text": "Offer, Discover, Acknowledgment, Request|||Offer, Discover, Acknowledgment, Request"
            },
            {
              "text": "Discover, Offer, Request, Acknowledgment|||Discover, Offer, Request, Acknowledgment"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The client cannot request an offer it has not received.<br/>B. The client must find a server before requesting.<br/>C. The server does not speak first.<br/>D. This is the DORA sequence.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Client không thể xin một đề nghị chưa nhận được.<br/>B. Client phải tìm máy chủ trước khi xin.<br/>C. Máy chủ không nói trước.<br/>D. Đây là chuỗi DORA.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>In the TCP three-way handshake, what does the server send in the second step?</p></div><div class=\"ml-vi\"><p>Trong bắt tay ba bước của TCP, máy chủ gửi gì ở bước hai?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A segment with FIN set|||Segment bật FIN"
            },
            {
              "text": "A segment with only RST set|||Segment chỉ bật RST"
            },
            {
              "text": "A segment with both SYN and ACK set|||Segment bật cả SYN và ACK"
            },
            {
              "text": "A segment with only ACK set|||Segment chỉ bật ACK"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. FIN closes a connection.<br/>B. RST rejects or aborts a connection.<br/>C. It acknowledges the client&#39;s SYN and sends its own.<br/>D. That is the third step, sent by the client.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. FIN dùng để đóng kết nối.<br/>B. RST từ chối hoặc huỷ kết nối.<br/>C. Nó xác nhận SYN của client và gửi SYN của chính nó.<br/>D. Đó là bước ba, do client gửi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which traffic best fits UDP rather than TCP?</p></div><div class=\"ml-vi\"><p>Loại lưu lượng nào hợp với UDP hơn TCP?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A live voice call, where a late packet is useless|||Cuộc gọi thoại trực tiếp, nơi gói đến trễ là vô dụng"
            },
            {
              "text": "Downloading a software installer|||Tải bộ cài phần mềm"
            },
            {
              "text": "Loading a banking web page|||Tải trang web ngân hàng"
            },
            {
              "text": "Sending an email through SMTP|||Gửi email qua SMTP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Real-time audio prefers low delay; resending old audio does not help.<br/>B. Every byte must arrive, so TCP&#39;s reliability is needed.<br/>C. The page must arrive complete and in order.<br/>D. SMTP runs over TCP.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Âm thanh thời gian thực cần độ trễ thấp; gửi lại âm thanh cũ không có ích.<br/>B. Mọi byte phải đến đủ nên cần độ tin cậy của TCP.<br/>C. Trang phải đến đủ và đúng thứ tự.<br/>D. SMTP chạy trên TCP.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Thousands of infected home devices send requests to a shop&#39;s website at the same moment until it stops responding. What is this attack?</p></div><div class=\"ml-vi\"><p>Hàng nghìn thiết bị gia đình bị nhiễm cùng lúc gửi yêu cầu tới web của một cửa hàng cho tới khi web ngừng trả lời. Đây là kiểu tấn công gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A reconnaissance sweep|||Quét trinh sát"
            },
            {
              "text": "A distributed DoS attack|||Tấn công DoS phân tán"
            },
            {
              "text": "A phishing attack|||Tấn công lừa đảo (phishing)"
            },
            {
              "text": "A man-in-the-middle attack|||Tấn công kẻ đứng giữa"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Reconnaissance gathers information and does not bring a site down.<br/>B. Many sources overwhelm one target to destroy availability.<br/>C. Phishing tricks a person into giving something away.<br/>D. That attacker sits between two parties to read or change traffic.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Trinh sát thu thập thông tin, không làm sập web.<br/>B. Nhiều nguồn áp đảo một mục tiêu để phá tính sẵn sàng.<br/>C. Phishing lừa người dùng tiết lộ thông tin.<br/>D. Kẻ này đứng giữa hai bên để đọc hoặc sửa dữ liệu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Look at the output below. Which interface has working Layer 1 but a problem at Layer 2?</p><pre><code class=\"language-plaintext\">R1# show ip interface brief\nInterface            IP-Address     OK? Method Status                Protocol\nGigabitEthernet0/0   192.168.10.1   YES manual up                    up\nGigabitEthernet0/1   192.168.20.1   YES manual administratively down down\nSerial0/0/0          10.0.0.1       YES manual up                    down</code></pre></div><div class=\"ml-vi\"><p>Xem kết quả dưới đây. Cổng nào đã ổn ở tầng 1 nhưng có vấn đề ở tầng 2?</p><pre><code class=\"language-plaintext\">R1# show ip interface brief\nInterface            IP-Address     OK? Method Status                Protocol\nGigabitEthernet0/0   192.168.10.1   YES manual up                    up\nGigabitEthernet0/1   192.168.20.1   YES manual administratively down down\nSerial0/0/0          10.0.0.1       YES manual up                    down</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "None of the interfaces shown has such a problem|||Không cổng nào có vấn đề như vậy"
            },
            {
              "text": "Serial0/0/0|||Serial0/0/0"
            },
            {
              "text": "GigabitEthernet0/0|||GigabitEthernet0/0"
            },
            {
              "text": "GigabitEthernet0/1|||GigabitEthernet0/1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Serial0/0/0 shows exactly this pattern.<br/>B. Status up with protocol down means the signal is there but the Layer 2 protocol is not working, for example mismatched encapsulation.<br/>C. Up and up means the interface is working normally.<br/>D. Administratively down means someone shut it down; it is not a Layer 2 fault.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Serial0/0/0 thể hiện đúng dấu hiệu này.<br/>B. Status up nhưng protocol down nghĩa là có tín hiệu nhưng giao thức tầng 2 chưa chạy, ví dụ đóng gói không khớp.<br/>C. Up và up nghĩa là cổng đang chạy bình thường.<br/>D. Administratively down nghĩa là có người tắt cổng, không phải lỗi tầng 2.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Traceroute from a campus PC prints the lines below. What is the most reasonable reading?</p><pre><code class=\"language-plaintext\">C:\\&gt; tracert 203.0.113.10\n  1    1 ms    1 ms    1 ms  192.168.1.1\n  2    4 ms    3 ms    4 ms  10.1.1.1\n  3    *       *       *     Request timed out.\n  4    *       *       *     Request timed out.</code></pre></div><div class=\"ml-vi\"><p>Traceroute từ máy trong trường in ra các dòng dưới đây. Cách hiểu hợp lý nhất là gì?</p><pre><code class=\"language-plaintext\">C:\\&gt; tracert 203.0.113.10\n  1    1 ms    1 ms    1 ms  192.168.1.1\n  2    4 ms    3 ms    4 ms  10.1.1.1\n  3    *       *       *     Request timed out.\n  4    *       *       *     Request timed out.</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Packets reach 10.1.1.1, and the fault lies just beyond it|||Gói tới được 10.1.1.1, lỗi nằm ngay sau đó"
            },
            {
              "text": "The PC&#39;s own network card has failed|||Card mạng của máy đã hỏng"
            },
            {
              "text": "The default gateway 192.168.1.1 is down|||Default gateway 192.168.1.1 đã chết"
            },
            {
              "text": "DNS cannot resolve the name|||DNS không phân giải được tên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The last router that answered shows how far the path works.<br/>B. Two hops replied, so the card works.<br/>C. Hop 1 replied with normal times.<br/>D. Traceroute is using the IP 203.0.113.10, so no name is involved here.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Router cuối cùng trả lời cho biết đường đi còn tốt tới đâu.<br/>B. Hai chặng đã trả lời nên card mạng vẫn chạy.<br/>C. Chặng 1 trả lời với thời gian bình thường.<br/>D. Traceroute đang dùng IP 203.0.113.10 nên không dính đến tên miền.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>PC-A sends a packet to PC-B through router R1. As the frame leaves R1&#39;s G0/1 toward PC-B, what are its source MAC and source IP?</p><pre class=\"mermaid\">flowchart LR\n  A[PC-A] -- LAN 1 --- R0[R1 G0/0]\n  R0 --- R2[R1 G0/1]\n  R2 -- LAN 2 --- B[PC-B]</pre></div><div class=\"ml-vi\"><p>PC-A gửi gói tin tới PC-B qua router R1. Khi khung rời cổng G0/1 của R1 về phía PC-B, MAC nguồn và IP nguồn của nó là gì?</p><pre class=\"mermaid\">flowchart LR\n  A[PC-A] -- LAN 1 --- R0[R1 G0/0]\n  R0 --- R2[R1 G0/1]\n  R2 -- LAN 2 --- B[PC-B]</pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Source MAC of R1 G0/0, source IP of PC-A|||MAC nguồn của R1 G0/0, IP nguồn của PC-A"
            },
            {
              "text": "Source MAC of R1 G0/1, source IP of R1 G0/1|||MAC nguồn của R1 G0/1, IP nguồn của R1 G0/1"
            },
            {
              "text": "Source MAC of R1 G0/1, source IP of PC-A|||MAC nguồn của R1 G0/1, IP nguồn của PC-A"
            },
            {
              "text": "Source MAC of PC-A, source IP of PC-A|||MAC nguồn của PC-A, IP nguồn của PC-A"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The frame leaves G0/1, so that interface&#39;s MAC is used.<br/>B. A router does not replace the source IP during normal routing.<br/>C. Layer 2 addresses are rewritten on every hop; the IP addresses stay end to end.<br/>D. PC-A&#39;s MAC only applies on the first link.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Khung ra ở G0/1 nên dùng MAC của cổng đó.<br/>B. Router không thay IP nguồn khi định tuyến thông thường.<br/>C. Địa chỉ tầng 2 được ghi lại ở từng chặng; địa chỉ IP giữ nguyên từ đầu đến cuối.<br/>D. MAC của PC-A chỉ có nghĩa ở chặng đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Layer 2 switch Sw-A must be reachable over SSH from an admin PC in a different IP subnet. Which two settings are required on Sw-A? (Choose two.)</p></div><div class=\"ml-vi\"><p>Switch tầng 2 Sw-A phải SSH được từ máy quản trị ở một subnet IP khác. Hai cấu hình nào là bắt buộc trên Sw-A? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "An IP address on a VLAN interface (SVI) that is not shut down|||Địa chỉ IP trên cổng VLAN (SVI) và cổng đó không bị shutdown"
            },
            {
              "text": "Half-duplex on the uplink port|||Đặt half-duplex trên cổng uplink"
            },
            {
              "text": "The ipv6 unicast-routing command|||Lệnh ipv6 unicast-routing"
            },
            {
              "text": "An IP address directly on access port Fa0/1|||Địa chỉ IP đặt thẳng trên cổng access Fa0/1"
            },
            {
              "text": "The ip default-gateway command pointing at the local router|||Lệnh ip default-gateway trỏ tới router cục bộ"
            }
          ],
          "correctIndexes": [
            0,
            4
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A, E.</strong><br/>A. A Layer 2 switch has no routed ports, so its management IP lives on an SVI.<br/>B. Duplex is unrelated to remote management and half-duplex would only slow the link.<br/>C. It turns on IPv6 routing on a router and has nothing to do with this task.<br/>D. Access ports on a Layer 2 switch do not accept an IP address.<br/>E. Replies to another subnet must go through a router, and this tells the switch which one.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A, E.</strong><br/>A. Switch tầng 2 không có cổng định tuyến nên IP quản lý nằm trên SVI.<br/>B. Duplex không liên quan đến quản trị từ xa, half-duplex chỉ làm chậm đường truyền.<br/>C. Lệnh này bật định tuyến IPv6 trên router, không liên quan đến yêu cầu này.<br/>D. Cổng access trên switch tầng 2 không nhận địa chỉ IP.<br/>E. Gói trả lời sang subnet khác phải đi qua router, lệnh này cho switch biết router nào.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A switch port and a server NIC are linked, but file copies are slow and the interface shows many late collisions on one side. What is the likely cause?</p></div><div class=\"ml-vi\"><p>Cổng switch và card mạng máy chủ đã nối nhưng chép tệp chậm, và một bên báo rất nhiều late collision. Nguyên nhân khả dĩ là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "An expired DHCP lease|||Hợp đồng thuê DHCP hết hạn"
            },
            {
              "text": "A DNS misconfiguration|||Cấu hình DNS sai"
            },
            {
              "text": "A wrong default gateway on the server|||Default gateway sai trên máy chủ"
            },
            {
              "text": "A duplex mismatch|||Lệch chế độ duplex"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Lease problems cause addressing failures, not collisions.<br/>B. DNS affects names only.<br/>C. That is a Layer 3 problem and would not create collisions.<br/>D. Late collisions appear on the half-duplex side when the other side sends in full duplex.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Lỗi lease gây mất địa chỉ, không gây va chạm.<br/>B. DNS chỉ ảnh hưởng tới tên miền.<br/>C. Đó là lỗi tầng 3, không tạo ra va chạm.<br/>D. Late collision xuất hiện ở bên half-duplex khi bên kia gửi kiểu full-duplex.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Host 172.20.46.130/25 sends one packet to every device in its own subnet. Which destination IPv4 address does it use?</p></div><div class=\"ml-vi\"><p>Máy 172.20.46.130/25 gửi một gói tới mọi thiết bị trong subnet của nó. Máy dùng địa chỉ IPv4 đích nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "172.20.46.128|||172.20.46.128"
            },
            {
              "text": "172.20.46.254|||172.20.46.254"
            },
            {
              "text": "172.20.46.127|||172.20.46.127"
            },
            {
              "text": "172.20.46.255|||172.20.46.255"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is the network address of this subnet.<br/>B. That is the last usable host.<br/>C. That is the broadcast of the lower half.<br/>D. /25 splits the last octet into 0-127 and 128-255; 130 falls in the upper half, whose last address is .255.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là địa chỉ mạng của subnet này.<br/>B. Đó là địa chỉ máy dùng được cuối cùng.<br/>C. Đó là địa chỉ quảng bá của nửa dưới.<br/>D. /25 chia octet cuối thành 0-127 và 128-255; 130 nằm ở nửa trên, địa chỉ cuối là .255.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the decimal value 198 in 8-bit binary?</p></div><div class=\"ml-vi\"><p>Số thập phân 198 viết ở dạng nhị phân 8 bit là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11000110|||11000110"
            },
            {
              "text": "10100110|||10100110"
            },
            {
              "text": "11100110|||11100110"
            },
            {
              "text": "11000101|||11000101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 198 = 128 + 64 + 4 + 2.<br/>B. That equals 166.<br/>C. That equals 230.<br/>D. That equals 197.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 198 = 128 + 64 + 4 + 2.<br/>B. Số này bằng 166.<br/>C. Số này bằng 230.<br/>D. Số này bằng 197.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which of these IPv4 addresses is public, meaning it is routable on the Internet?</p></div><div class=\"ml-vi\"><p>Địa chỉ IPv4 nào dưới đây là địa chỉ công cộng, tức định tuyến được trên Internet?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10.255.0.1|||10.255.0.1"
            },
            {
              "text": "172.32.0.1|||172.32.0.1"
            },
            {
              "text": "192.168.254.1|||192.168.254.1"
            },
            {
              "text": "172.31.200.9|||172.31.200.9"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It lies inside 10.0.0.0/8, which is private.<br/>B. The private 172 block ends at 172.31.255.255, so 172.32.x.x is public.<br/>C. It lies inside 192.168.0.0/16, which is private.<br/>D. It lies inside 172.16.0.0/12, which is private.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Địa chỉ này nằm trong 10.0.0.0/8, là dải riêng.<br/>B. Khối riêng 172 kết thúc ở 172.31.255.255 nên 172.32.x.x là công cộng.<br/>C. Địa chỉ này nằm trong 192.168.0.0/16, là dải riêng.<br/>D. Địa chỉ này nằm trong 172.16.0.0/12, là dải riêng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>How many usable host addresses does a /27 subnet provide?</p></div><div class=\"ml-vi\"><p>Một subnet /27 có bao nhiêu địa chỉ máy dùng được?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "32|||32"
            },
            {
              "text": "62|||62"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "14|||14"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That counts the network and broadcast addresses too.<br/>B. That is a /26.<br/>C. 5 host bits give 32 addresses, minus the network and broadcast addresses.<br/>D. That is a /28.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Số này tính cả địa chỉ mạng và quảng bá.<br/>B. Đó là /26.<br/>C. 5 bit máy cho 32 địa chỉ, trừ địa chỉ mạng và quảng bá.<br/>D. Đó là /28.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Before crypto key generate rsa can run on a Cisco router, which two items must already be set? (Choose two.)</p></div><div class=\"ml-vi\"><p>Trước khi chạy được lệnh crypto key generate rsa trên router Cisco, hai mục nào phải được đặt sẵn? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A hostname other than the default|||Tên máy khác tên mặc định"
            },
            {
              "text": "An IP domain name|||Tên miền IP"
            },
            {
              "text": "A default route to the Internet|||Tuyến mặc định ra Internet"
            },
            {
              "text": "A DHCP pool|||Một DHCP pool"
            },
            {
              "text": "A login banner|||Một banner đăng nhập"
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A, B.</strong><br/>A. The key name is built from the hostname and domain name.<br/>B. The ip domain-name value is the other half of the key name.<br/>C. Key generation is local and needs no routing.<br/>D. DHCP serves addresses and has nothing to do with SSH keys.<br/>E. A banner is good practice but is not required for keys.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A, B.</strong><br/>A. Tên khoá được dựng từ tên máy và tên miền.<br/>B. Giá trị ip domain-name là nửa còn lại của tên khoá.<br/>C. Tạo khoá là việc cục bộ, không cần định tuyến.<br/>D. DHCP cấp địa chỉ, không liên quan khoá SSH.<br/>E. Banner là thói quen tốt nhưng không bắt buộc để tạo khoá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>At which OSI layer is the protocol data unit called a frame?</p></div><div class=\"ml-vi\"><p>Ở tầng OSI nào đơn vị dữ liệu giao thức (PDU) được gọi là frame (khung)?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Data link layer|||Tầng liên kết dữ liệu"
            },
            {
              "text": "Network layer|||Tầng mạng"
            },
            {
              "text": "Transport layer|||Tầng giao vận"
            },
            {
              "text": "Physical layer|||Tầng vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Layer 2 wraps a packet in a header and trailer to make a frame.<br/>B. The Layer 3 PDU is a packet.<br/>C. The Layer 4 PDU is a segment for TCP or a datagram for UDP.<br/>D. Layer 1 deals in bits, not frames.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Tầng 2 bọc gói tin bằng phần đầu và phần đuôi để tạo thành khung.<br/>B. PDU của tầng 3 là gói tin (packet).<br/>C. PDU của tầng 4 là segment với TCP hoặc datagram với UDP.<br/>D. Tầng 1 làm việc với bit, không phải khung.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A Windows laptop shows the address 169.254.77.3. What is the most likely cause?</p></div><div class=\"ml-vi\"><p>Một laptop Windows hiện địa chỉ 169.254.77.3. Nguyên nhân khả dĩ nhất là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It is connected to an IPv6-only network|||Nó đang nối vào mạng chỉ có IPv6"
            },
            {
              "text": "It could not reach a DHCP server|||Nó không liên lạc được với máy chủ DHCP"
            },
            {
              "text": "Its loopback adapter is active|||Bộ loopback của nó đang bật"
            },
            {
              "text": "It was given a public address by the ISP|||Nó được nhà mạng cấp địa chỉ công cộng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The address shown is IPv4 and points at a DHCP failure.<br/>B. 169.254.0.0/16 is the link-local range a host assigns itself when DHCP fails.<br/>C. Loopback uses 127.0.0.0/8.<br/>D. This range is not routable on the Internet.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Địa chỉ này là IPv4 và cho thấy DHCP thất bại.<br/>B. 169.254.0.0/16 là dải link-local mà máy tự gán khi DHCP thất bại.<br/>C. Loopback dùng 127.0.0.0/8.<br/>D. Dải này không định tuyến được trên Internet.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A home router offers both 2.4 GHz and 5 GHz Wi-Fi. Which statement is generally true?</p></div><div class=\"ml-vi\"><p>Router gia đình phát cả Wi-Fi 2.4 GHz và 5 GHz. Phát biểu nào nói chung là đúng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5 GHz works only with a cable plugged in|||5 GHz chỉ chạy khi cắm cáp"
            },
            {
              "text": "2.4 GHz gives higher speed and shorter range|||2.4 GHz cho tốc độ cao hơn và tầm ngắn hơn"
            },
            {
              "text": "Both bands have the same range and speed|||Hai băng có cùng tầm phủ và tốc độ"
            },
            {
              "text": "5 GHz gives higher speed but weaker coverage through walls|||5 GHz cho tốc độ cao hơn nhưng xuyên tường kém hơn"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. 5 GHz is a radio band, so no cable is involved.<br/>B. This reverses the two bands.<br/>C. Frequency directly affects both range and capacity.<br/>D. Higher frequencies carry more data but lose strength faster through obstacles.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. 5 GHz là băng tần vô tuyến, không dùng cáp.<br/>B. Câu này đảo ngược hai băng tần.<br/>C. Tần số ảnh hưởng trực tiếp đến tầm phủ và dung lượng.<br/>D. Tần số cao mang được nhiều dữ liệu hơn nhưng suy hao nhanh hơn qua vật cản.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A college retires its separate telephone wiring and video system. Voice calls, lecture streams and web traffic now all run over the same IP network. What is this kind of network called?</p></div><div class=\"ml-vi\"><p>Một trường cao đẳng bỏ hệ thống dây điện thoại và hệ thống video riêng. Cuộc gọi thoại, luồng bài giảng và lưu lượng web nay đều chạy trên cùng một mạng IP. Loại mạng này gọi là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Extranet|||Extranet"
            },
            {
              "text": "Peer-to-peer network|||Mạng ngang hàng"
            },
            {
              "text": "Converged network|||Mạng hội tụ"
            },
            {
              "text": "Circuit-switched network|||Mạng chuyển mạch kênh"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. An extranet gives outside partners controlled access; it says nothing about merging services.<br/>B. Peer-to-peer describes host roles, not how many services share the infrastructure.<br/>C. One network carrying voice, video and data is the definition of a converged network.<br/>D. That is the older telephone model the college just retired; IP is packet-switched.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Extranet cho đối tác bên ngoài truy cập có kiểm soát, không liên quan đến gộp dịch vụ.<br/>B. Ngang hàng nói về vai trò của máy, không nói về việc nhiều dịch vụ dùng chung hạ tầng.<br/>C. Một mạng mang cả thoại, video và dữ liệu chính là định nghĩa mạng hội tụ.<br/>D. Đó là mô hình điện thoại cũ mà trường vừa bỏ; mạng IP là chuyển mạch gói.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>You subnet 192.168.50.0/24 with VLSM, largest need first: LAN A 100 hosts, LAN B 50 hosts, LAN C 25 hosts, then a point-to-point link. Blocks are assigned in order from the start of the range, with no gaps. Which subnet does LAN C get?</p></div><div class=\"ml-vi\"><p>Bạn chia 192.168.50.0/24 bằng VLSM, nhu cầu lớn trước: LAN A 100 máy, LAN B 50 máy, LAN C 25 máy, rồi một đường điểm-điểm. Các khối được cấp lần lượt từ đầu dải, không để trống. LAN C nhận subnet nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "192.168.50.192/26|||192.168.50.192/26"
            },
            {
              "text": "192.168.50.224/27|||192.168.50.224/27"
            },
            {
              "text": "192.168.50.192/27|||192.168.50.192/27"
            },
            {
              "text": "192.168.50.128/27|||192.168.50.128/27"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The start is right, but a /26 wastes space and leaves no room for the link.<br/>B. This skips .192 for no reason, which leaves a gap.<br/>C. A takes .0/25, B takes .128/26, so C starts at .192 and 25 hosts need a /27.<br/>D. That block already belongs to LAN B.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Điểm đầu đúng nhưng /26 lãng phí và không còn chỗ cho đường điểm-điểm.<br/>B. Cách này bỏ qua .192 không lý do, tạo khoảng trống.<br/>C. A lấy .0/25, B lấy .128/26, nên C bắt đầu từ .192 và 25 máy cần /27.<br/>D. Khối đó đã thuộc LAN B.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why do Wi-Fi stations use collision avoidance (CSMA/CA) rather than collision detection?</p></div><div class=\"ml-vi\"><p>Vì sao các trạm Wi-Fi dùng tránh va chạm (CSMA/CA) thay vì phát hiện va chạm?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Collision detection needs fiber cabling|||Phát hiện va chạm cần cáp quang"
            },
            {
              "text": "Wi-Fi frames have no destination address|||Khung Wi-Fi không có địa chỉ đích"
            },
            {
              "text": "Wi-Fi always runs full duplex|||Wi-Fi luôn chạy song công"
            },
            {
              "text": "A radio cannot reliably hear a collision while it is transmitting|||Bộ thu phát vô tuyến không nghe được va chạm một cách tin cậy khi đang phát"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. CSMA/CD was built for shared copper Ethernet.<br/>B. Wi-Fi frames do carry addresses, in fact several of them.<br/>C. Wi-Fi is half duplex on a channel, and that is why contention matters.<br/>D. Its own signal drowns out everything else, so it tries to prevent collisions instead.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. CSMA/CD được làm cho Ethernet cáp đồng dùng chung.<br/>B. Khung Wi-Fi có địa chỉ, thậm chí có nhiều địa chỉ.<br/>C. Wi-Fi là bán song công trên một kênh, nên mới phải tranh chấp.<br/>D. Tín hiệu của chính nó át mọi thứ khác nên nó phải cố ngăn va chạm từ trước.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A technician&#39;s drawing shows which rack each switch sits in, which room each wall jack serves and how long every cable run is. What kind of documentation is this?</p></div><div class=\"ml-vi\"><p>Bản vẽ của kỹ thuật viên cho biết mỗi switch nằm ở tủ rack nào, mỗi ổ mạng trên tường phục vụ phòng nào và mỗi đường cáp dài bao nhiêu. Đây là loại tài liệu gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Physical topology diagram|||Sơ đồ tô-pô vật lý"
            },
            {
              "text": "Logical topology diagram|||Sơ đồ tô-pô logic"
            },
            {
              "text": "IP addressing plan|||Bảng quy hoạch địa chỉ IP"
            },
            {
              "text": "Protocol stack diagram|||Sơ đồ chồng giao thức"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It records real locations and cable paths, which is exactly what a physical topology shows.<br/>B. A logical topology shows IP networks, VLANs and interfaces, not racks or cable lengths.<br/>C. An addressing plan lists subnets and hosts; it says nothing about racks or cable runs.<br/>D. A protocol stack shows layers of protocols, not building layout.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó ghi vị trí thật và đường đi cáp, đúng nội dung của tô-pô vật lý.<br/>B. Tô-pô logic thể hiện mạng IP, VLAN và cổng, không nói về tủ rack hay chiều dài cáp.<br/>C. Bảng địa chỉ chỉ liệt kê subnet và máy, không nói về tủ rack hay đường cáp.<br/>D. Chồng giao thức thể hiện các tầng giao thức, không phải bố trí toà nhà.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A lab needs 120 host addresses in one subnet, wasting as few as possible. What is the longest prefix that still fits?</p></div><div class=\"ml-vi\"><p>Một phòng lab cần 120 địa chỉ máy trong một subnet, càng ít lãng phí càng tốt. Tiền tố dài nhất vẫn đủ là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "/27|||/27"
            },
            {
              "text": "/25|||/25"
            },
            {
              "text": "/26|||/26"
            },
            {
              "text": "/24|||/24"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. /27 gives only 30 hosts.<br/>B. /25 gives 126 usable hosts, enough for 120.<br/>C. /26 gives only 62 hosts.<br/>D. /24 fits but wastes more than half of the block.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. /27 chỉ cho 30 máy.<br/>B. /25 cho 126 địa chỉ dùng được, đủ cho 120.<br/>C. /26 chỉ cho 62 máy.<br/>D. /24 đủ nhưng lãng phí hơn nửa khối.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the last usable host address in the network 10.4.96.0/20?</p></div><div class=\"ml-vi\"><p>Địa chỉ máy dùng được cuối cùng trong mạng 10.4.96.0/20 là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10.4.111.255|||10.4.111.255"
            },
            {
              "text": "10.4.111.254|||10.4.111.254"
            },
            {
              "text": "10.4.96.254|||10.4.96.254"
            },
            {
              "text": "10.4.103.254|||10.4.103.254"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the broadcast address.<br/>B. /20 means blocks of 16 in the third octet: 96 to 111. The broadcast is 10.4.111.255, so the last host is .254.<br/>C. This assumes a /24.<br/>D. This assumes a block of 8, which is a /21.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là địa chỉ quảng bá.<br/>B. /20 tạo khối 16 ở octet thứ ba: từ 96 đến 111. Quảng bá là 10.4.111.255 nên máy cuối là .254.<br/>C. Cách này giả định mạng /24.<br/>D. Cách này giả định khối 8, tức /21.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the minimum size of a standard Ethernet frame?</p></div><div class=\"ml-vi\"><p>Kích thước tối thiểu của một khung Ethernet chuẩn là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1518 bytes|||1518 byte"
            },
            {
              "text": "46 bytes|||46 byte"
            },
            {
              "text": "1500 bytes|||1500 byte"
            },
            {
              "text": "64 bytes|||64 byte"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. 1518 is the maximum standard frame size.<br/>B. 46 is the minimum data field, not the whole frame.<br/>C. 1500 is the usual maximum data field (MTU).<br/>D. Counted from the destination MAC through the FCS, the minimum is 64 bytes.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. 1518 là kích thước khung chuẩn tối đa.<br/>B. 46 là phần dữ liệu tối thiểu, không phải cả khung.<br/>C. 1500 là phần dữ liệu tối đa thường gặp (MTU).<br/>D. Tính từ MAC đích đến hết FCS, tối thiểu là 64 byte.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Hosts 10.20.30.40/19 and 10.20.50.60/19 sit on the same physical switch with no router. Can they talk to each other directly?</p></div><div class=\"ml-vi\"><p>Hai máy 10.20.30.40/19 và 10.20.50.60/19 nối cùng một switch, không có router. Chúng có liên lạc trực tiếp được không?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Yes, both are in 10.20.0.0/16|||Có, cả hai thuộc 10.20.0.0/16"
            },
            {
              "text": "No, because a /19 mask is invalid|||Không, vì mặt nạ /19 không hợp lệ"
            },
            {
              "text": "No, they are in 10.20.0.0/19 and 10.20.32.0/19|||Không, chúng thuộc 10.20.0.0/19 và 10.20.32.0/19"
            },
            {
              "text": "Yes, because a switch ignores IP addresses|||Có, vì switch bỏ qua địa chỉ IP"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Their mask is /19, not /16.<br/>B. /19 is a normal mask.<br/>C. /19 makes blocks of 32 in the third octet, and 30 and 50 fall in different blocks.<br/>D. The switch does, but each host checks the mask and sends to its gateway.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Mặt nạ của chúng là /19, không phải /16.<br/>B. /19 là mặt nạ bình thường.<br/>C. /19 tạo khối 32 ở octet thứ ba, 30 và 50 rơi vào hai khối khác nhau.<br/>D. Switch có bỏ qua, nhưng mỗi máy tự so mặt nạ rồi gửi cho gateway.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>One byte of a MAC address is written as A7. What is its decimal value?</p></div><div class=\"ml-vi\"><p>Một byte của địa chỉ MAC được viết là A7. Giá trị thập phân của nó là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "167|||167"
            },
            {
              "text": "247|||247"
            },
            {
              "text": "107|||107"
            },
            {
              "text": "170|||170"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. A7 = 10 x 16 + 7 = 167.<br/>B. That is hex F7.<br/>C. This treats A as 10 in base 10.<br/>D. That is hex AA.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. A7 = 10 x 16 + 7 = 167.<br/>B. Đó là hex F7.<br/>C. Cách này coi A là chữ số hàng chục của hệ 10.<br/>D. Đó là hex AA.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Two factory buildings stand 1.5 km apart and the cable route passes heavy electric motors. Which medium suits this link best?</p></div><div class=\"ml-vi\"><p>Hai nhà xưởng cách nhau 1,5 km và đường cáp đi qua các động cơ điện lớn. Môi trường truyền nào phù hợp nhất?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Coaxial cable|||Cáp đồng trục"
            },
            {
              "text": "Cat 6 UTP|||Cáp UTP Cat 6"
            },
            {
              "text": "A 2.4 GHz Wi-Fi bridge|||Cầu Wi-Fi 2.4 GHz"
            },
            {
              "text": "Single-mode fiber|||Cáp quang đơn mode"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It is still copper, and this is not how Ethernet campus links are built today.<br/>B. UTP is limited to about 100 m and picks up electrical noise.<br/>C. Motors generate interference and 2.4 GHz reaches far less than 1.5 km with normal gear.<br/>D. Light is immune to electromagnetic interference and single-mode covers kilometres.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đây vẫn là cáp đồng và không phải cách nối Ethernet giữa các toà nhà hiện nay.<br/>B. UTP chỉ đi khoảng 100 m và dễ nhiễm nhiễu điện.<br/>C. Động cơ gây nhiễu và 2.4 GHz với thiết bị thường không đi xa tới 1,5 km.<br/>D. Ánh sáng miễn nhiễm nhiễu điện từ và cáp đơn mode đi được nhiều km.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A 300 MB file (1 MB = 10^6 bytes) takes exactly one minute to copy across a link rated at 100 Mbps. What was the average throughput?</p></div><div class=\"ml-vi\"><p>Một tệp 300 MB (1 MB = 10^6 byte) mất đúng một phút để chép qua đường truyền danh định 100 Mbps. Thông lượng trung bình là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "300 Mbps|||300 Mbps"
            },
            {
              "text": "5 Mbps|||5 Mbps"
            },
            {
              "text": "40 Mbps|||40 Mbps"
            },
            {
              "text": "100 Mbps|||100 Mbps"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This mixes up the file size with a rate.<br/>B. That is 300 / 60, which forgets to convert bytes to bits.<br/>C. 300 MB is 2400 megabits, and 2400 / 60 s = 40 Mbps.<br/>D. That is the bandwidth rating, not what was measured.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây là nhầm kích thước tệp với tốc độ.<br/>B. Đó là 300 / 60, quên đổi byte sang bit.<br/>C. 300 MB bằng 2400 megabit, 2400 / 60 giây = 40 Mbps.<br/>D. Đó là băng thông danh định, không phải số đo được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>You read mail on a phone and a laptop and want both to show the same folders and read status. Which protocol fits?</p></div><div class=\"ml-vi\"><p>Bạn đọc thư trên điện thoại và laptop, muốn cả hai hiện cùng thư mục và trạng thái đã đọc. Giao thức nào phù hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "IMAP|||IMAP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "POP3|||POP3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. IMAP keeps mail and folders on the server and synchronises every client.<br/>B. SMTP sends mail; it does not retrieve it.<br/>C. FTP transfers files.<br/>D. POP3 usually downloads mail to one device, so nothing stays in sync.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. IMAP giữ thư và thư mục trên máy chủ, đồng bộ mọi thiết bị.<br/>B. SMTP dùng để gửi thư, không dùng để nhận.<br/>C. FTP dùng để truyền tệp.<br/>D. POP3 thường tải thư về một máy nên không đồng bộ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A switch receives a unicast frame whose destination MAC is not in its table. What does the switch do?</p></div><div class=\"ml-vi\"><p>Switch nhận một khung unicast có MAC đích chưa có trong bảng. Switch làm gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Sends it back out the arrival port|||Gửi ngược ra cổng nhận"
            },
            {
              "text": "Floods it out every port in the VLAN except the arrival port|||Phát tràn ra mọi cổng cùng VLAN trừ cổng nhận"
            },
            {
              "text": "Drops it and logs an error|||Bỏ khung và ghi lỗi"
            },
            {
              "text": "Sends it only to the default gateway|||Chỉ gửi cho default gateway"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A switch never forwards a frame back out the port it came in on.<br/>B. An unknown destination could be anywhere, so the switch tries all other ports.<br/>C. Dropping would make first contact with a device impossible.<br/>D. Switches forward by MAC and do not know about gateways.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Switch không bao giờ gửi khung ngược ra chính cổng nhận.<br/>B. Đích chưa biết có thể ở bất kỳ đâu nên switch thử mọi cổng còn lại.<br/>C. Nếu bỏ khung thì thiết bị mới không bao giờ liên lạc được.<br/>D. Switch chuyển theo MAC và không biết gì về gateway.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>An ARP request travels inside an Ethernet frame. Which value fills that frame&#39;s destination MAC field?</p></div><div class=\"ml-vi\"><p>ARP request được mang trong một khung Ethernet. Giá trị nào điền vào trường MAC đích của khung đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The MAC of the default gateway|||MAC của default gateway"
            },
            {
              "text": "0000.0000.0000|||0000.0000.0000"
            },
            {
              "text": "0100.5E00.0001|||0100.5E00.0001"
            },
            {
              "text": "FFFF.FFFF.FFFF|||FFFF.FFFF.FFFF"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That would be unicast, and ARP requests are broadcasts.<br/>B. All zeros appears in the target hardware field inside the ARP message, not as the frame destination.<br/>C. That is an IPv4 multicast MAC, not used by ARP.<br/>D. The sender does not yet know the target&#39;s MAC, so it broadcasts on the local network.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Như vậy là unicast, còn ARP request là quảng bá.<br/>B. Toàn số 0 nằm ở trường địa chỉ đích bên trong thông điệp ARP, không phải đích của khung.<br/>C. Đó là MAC multicast IPv4, ARP không dùng.<br/>D. Bên gửi chưa biết MAC của đích nên phải quảng bá trong mạng cục bộ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which action directly reduces the attack surface of a switch in a shared classroom?</p></div><div class=\"ml-vi\"><p>Hành động nào trực tiếp giảm bề mặt tấn công của switch trong phòng học dùng chung?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Shut down unused ports and move them to an unused VLAN|||Tắt các cổng không dùng và chuyển chúng sang VLAN không dùng"
            },
            {
              "text": "Leave CDP and every default service enabled|||Để CDP và mọi dịch vụ mặc định chạy"
            },
            {
              "text": "Change the hostname to something longer|||Đổi tên máy cho dài hơn"
            },
            {
              "text": "Replace SSH with Telnet|||Thay SSH bằng Telnet"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. An unused port that is off cannot be plugged into by an intruder.<br/>B. Extra services add ways in rather than removing them.<br/>C. A hostname gives no protection.<br/>D. Telnet sends everything in plain text, so this is worse.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Cổng không dùng đã tắt thì kẻ xâm nhập không cắm vào dùng được.<br/>B. Dịch vụ thừa thêm đường vào chứ không bớt đi.<br/>C. Tên máy không bảo vệ được gì.<br/>D. Telnet gửi mọi thứ dạng rõ nên còn tệ hơn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>An admin changes a switch&#39;s hostname and management IP, tests them, and goes home. A power cut overnight restarts the switch and both changes are gone. Which command did the admin forget?</p></div><div class=\"ml-vi\"><p>Quản trị viên đổi tên và IP quản lý của switch, thử xong thì về. Mất điện đêm đó làm switch khởi động lại và cả hai thay đổi biến mất. Quản trị viên đã quên lệnh nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "copy startup-config running-config|||copy startup-config running-config"
            },
            {
              "text": "copy running-config startup-config|||copy running-config startup-config"
            },
            {
              "text": "erase startup-config|||erase startup-config"
            },
            {
              "text": "show running-config|||show running-config"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. This goes the wrong way: it merges the saved file into RAM and saves nothing.<br/>B. It writes the configuration from RAM to NVRAM, so it survives a reload.<br/>C. It deletes the saved configuration, the opposite of what was needed.<br/>D. It only displays the configuration.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Lệnh này đi ngược chiều: nạp tệp đã lưu vào RAM, không lưu gì cả.<br/>B. Lệnh này ghi cấu hình từ RAM vào NVRAM nên còn sau khi khởi động lại.<br/>C. Lệnh này xoá cấu hình đã lưu, ngược với điều cần làm.<br/>D. Lệnh này chỉ hiển thị cấu hình.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A frame arrives on port Fa0/5 with source 0050.7966.1001 and destination 0050.7966.1002. What does the switch do, given the table below?</p><pre><code class=\"language-plaintext\">Sw-Lab# show mac address-table\nVlan   Mac Address       Type      Ports\n1      0050.7966.1001    DYNAMIC   Fa0/1\n1      0050.7966.1002    DYNAMIC   Fa0/2\n1      0050.7966.1003    DYNAMIC   Fa0/3</code></pre></div><div class=\"ml-vi\"><p>Một khung đến cổng Fa0/5 với nguồn 0050.7966.1001 và đích 0050.7966.1002. Dựa vào bảng dưới đây, switch làm gì?</p><pre><code class=\"language-plaintext\">Sw-Lab# show mac address-table\nVlan   Mac Address       Type      Ports\n1      0050.7966.1001    DYNAMIC   Fa0/1\n1      0050.7966.1002    DYNAMIC   Fa0/2\n1      0050.7966.1003    DYNAMIC   Fa0/3</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Drops the frame because 1001 belongs to Fa0/1|||Bỏ khung vì 1001 thuộc Fa0/1"
            },
            {
              "text": "Sends the frame out Fa0/1 and Fa0/2|||Gửi khung ra Fa0/1 và Fa0/2"
            },
            {
              "text": "Moves entry 1001 to Fa0/5 and forwards the frame out Fa0/2 only|||Chuyển mục 1001 sang Fa0/5 và chỉ chuyển khung ra Fa0/2"
            },
            {
              "text": "Keeps the table unchanged and floods the frame|||Giữ nguyên bảng và phát tràn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Without port security, a moved device is simply relearned.<br/>B. Only the destination port is used.<br/>C. The source was seen on a new port, so the entry is updated; the destination is known, so it is forwarded.<br/>D. The destination is known, and the source entry is now out of date.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Không bật port security thì thiết bị đổi cổng chỉ được học lại.<br/>B. Chỉ cổng của đích được dùng.<br/>C. Nguồn xuất hiện ở cổng mới nên mục được cập nhật; đích đã biết nên chuyển thẳng.<br/>D. Đích đã biết, còn mục của nguồn đã lỗi thời.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which OSI layer is responsible for common data formats, compression and encryption, so that two applications can read each other&#39;s data?</p></div><div class=\"ml-vi\"><p>Tầng OSI nào chịu trách nhiệm định dạng dữ liệu chung, nén và mã hoá để hai ứng dụng đọc được dữ liệu của nhau?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Data link layer|||Tầng liên kết dữ liệu"
            },
            {
              "text": "Presentation layer|||Tầng trình diễn"
            },
            {
              "text": "Transport layer|||Tầng giao vận"
            },
            {
              "text": "Session layer|||Tầng phiên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Layer 2 moves frames across one link.<br/>B. Layer 6 handles how data is represented, including compression and encryption.<br/>C. Layer 4 segments data and tracks delivery between processes.<br/>D. Layer 5 sets up and manages dialogues; it does not change data formats.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Tầng 2 đưa khung qua một chặng.<br/>B. Tầng 6 lo cách biểu diễn dữ liệu, gồm cả nén và mã hoá.<br/>C. Tầng 4 chia đoạn và theo dõi việc giao giữa các tiến trình.<br/>D. Tầng 5 thiết lập và quản lý phiên hội thoại, không đổi định dạng dữ liệu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>The configuration of a router shows the console and VTY passwords in clear text. Which single global command scrambles every plain-text password already in the configuration?</p></div><div class=\"ml-vi\"><p>Cấu hình của router hiện mật khẩu console và VTY dạng rõ. Lệnh toàn cục nào, chỉ một lệnh, làm xáo trộn mọi mật khẩu dạng rõ đang có trong cấu hình?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "service password-encryption|||service password-encryption"
            },
            {
              "text": "security passwords min-length 8|||security passwords min-length 8"
            },
            {
              "text": "login local|||login local"
            },
            {
              "text": "enable secret|||enable secret"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It applies weak encryption to all plain-text passwords, so they cannot be read over someone&#39;s shoulder.<br/>B. It only sets a minimum length for new passwords.<br/>C. It tells a line to use the local user database; it does not touch stored passwords.<br/>D. It sets a hashed password for privileged mode only; console and VTY passwords stay as they were.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Lệnh này mã hoá yếu mọi mật khẩu dạng rõ để người đứng cạnh không đọc được.<br/>B. Lệnh này chỉ đặt độ dài tối thiểu cho mật khẩu mới.<br/>C. Lệnh này bảo đường line dùng cơ sở người dùng cục bộ, không đụng đến mật khẩu đã lưu.<br/>D. Lệnh này chỉ đặt mật khẩu băm cho chế độ đặc quyền; mật khẩu console và VTY vẫn như cũ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>You see the prompt below on a Cisco switch. Which mode are you in?</p><pre><code class=\"language-plaintext\">Sw-Lab1(config-if)#</code></pre></div><div class=\"ml-vi\"><p>Bạn thấy dấu nhắc dưới đây trên switch Cisco. Bạn đang ở chế độ nào?</p><pre><code class=\"language-plaintext\">Sw-Lab1(config-if)#</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Global configuration mode|||Chế độ cấu hình toàn cục"
            },
            {
              "text": "Privileged EXEC mode|||Chế độ EXEC đặc quyền"
            },
            {
              "text": "User EXEC mode|||Chế độ EXEC người dùng"
            },
            {
              "text": "Interface configuration mode|||Chế độ cấu hình cổng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That prompt ends in (config)# without the -if part.<br/>B. That prompt is just the hostname followed by #.<br/>C. That prompt is the hostname followed by &gt;.<br/>D. The (config-if) part means a specific interface is being configured.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Dấu nhắc đó là (config)#, không có phần -if.<br/>B. Dấu nhắc đó chỉ là tên máy kèm dấu #.<br/>C. Dấu nhắc đó là tên máy kèm dấu &gt;.<br/>D. Phần (config-if) nghĩa là đang cấu hình một cổng cụ thể.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which sublayer of the data link layer adds the source and destination hardware addresses and controls access to the media?</p></div><div class=\"ml-vi\"><p>Tầng con nào của tầng liên kết dữ liệu thêm địa chỉ phần cứng nguồn, đích và điều khiển việc truy cập môi trường truyền?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Transport sublayer|||Tầng con giao vận"
            },
            {
              "text": "Session sublayer|||Tầng con phiên"
            },
            {
              "text": "MAC sublayer|||Tầng con MAC"
            },
            {
              "text": "LLC sublayer|||Tầng con LLC"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. There is no such sublayer; transport is OSI Layer 4.<br/>B. There is no such sublayer; session is OSI Layer 5.<br/>C. Media Access Control handles Layer 2 addressing and media access.<br/>D. LLC talks to the network layer above and identifies which Layer 3 protocol is carried.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Không có tầng con này; giao vận là tầng 4 của OSI.<br/>B. Không có tầng con này; phiên là tầng 5 của OSI.<br/>C. Media Access Control lo địa chỉ tầng 2 và truy cập môi trường.<br/>D. LLC giao tiếp với tầng mạng phía trên và cho biết giao thức tầng 3 nào được mang.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Using the routing table below, where does the router send a packet for 10.10.40.9?</p><pre><code class=\"language-plaintext\">S*   0.0.0.0/0 [1/0] via 203.0.113.1\nC    10.10.0.0/16 is directly connected, Gig0/0\nS    10.10.32.0/20 [1/0] via 10.10.0.2\nC    172.16.5.0/24 is directly connected, Gig0/1</code></pre></div><div class=\"ml-vi\"><p>Dựa vào bảng định tuyến dưới đây, router gửi gói tin tới 10.10.40.9 đi đâu?</p><pre><code class=\"language-plaintext\">S*   0.0.0.0/0 [1/0] via 203.0.113.1\nC    10.10.0.0/16 is directly connected, Gig0/0\nS    10.10.32.0/20 [1/0] via 10.10.0.2\nC    172.16.5.0/24 is directly connected, Gig0/1</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It is dropped because no route matches|||Bị bỏ vì không có tuyến khớp"
            },
            {
              "text": "Via 10.10.0.2|||Qua 10.10.0.2"
            },
            {
              "text": "Via 203.0.113.1|||Qua 203.0.113.1"
            },
            {
              "text": "Out Gig0/0, directly connected|||Ra Gig0/0, nối trực tiếp"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Two specific routes and a default route all match.<br/>B. Both 10.10.0.0/16 and 10.10.32.0/20 match, and the longest prefix wins: 10.10.32.0/20 covers 10.10.32.0 to 10.10.47.255.<br/>C. The default route is used only when nothing more specific matches.<br/>D. The /16 matches, but it is less specific than the /20.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Có hai tuyến cụ thể và cả tuyến mặc định đều khớp.<br/>B. Cả 10.10.0.0/16 và 10.10.32.0/20 đều khớp, tiền tố dài nhất thắng: 10.10.32.0/20 phủ từ 10.10.32.0 đến 10.10.47.255.<br/>C. Tuyến mặc định chỉ dùng khi không có tuyến cụ thể hơn.<br/>D. /16 khớp nhưng kém cụ thể hơn /20.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A PC can ping 8.8.8.8 but opening www.example.com says the host cannot be found. Which setting should you check first?</p></div><div class=\"ml-vi\"><p>Một máy ping được 8.8.8.8 nhưng mở www.example.com thì báo không tìm thấy máy chủ. Nên kiểm cấu hình nào trước?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The default gateway|||Default gateway"
            },
            {
              "text": "The Ethernet cable|||Cáp Ethernet"
            },
            {
              "text": "The subnet mask|||Mặt nạ mạng"
            },
            {
              "text": "The DNS server setting|||Cấu hình máy chủ DNS"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The ping to an outside address proves the gateway works.<br/>B. The cable is carrying the ping traffic.<br/>C. A wrong mask would normally break routed traffic too.<br/>D. IP connectivity works, so name resolution is the failing step.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Ping được địa chỉ bên ngoài chứng tỏ gateway vẫn chạy.<br/>B. Cáp vẫn đang mang lưu lượng ping.<br/>C. Mặt nạ sai thường làm hỏng cả lưu lượng đi qua router.<br/>D. Kết nối IP vẫn tốt nên bước phân giải tên đang hỏng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which IPv4 header field does each router decrease by one so that a packet cannot loop forever?</p></div><div class=\"ml-vi\"><p>Trường nào trong phần đầu IPv4 được mỗi router giảm đi một để gói tin không lặp mãi?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Fragment Offset|||Fragment Offset"
            },
            {
              "text": "Protocol|||Protocol"
            },
            {
              "text": "Time to Live|||Time to Live (TTL)"
            },
            {
              "text": "Header Checksum|||Header Checksum"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It locates a fragment within the original packet.<br/>B. It names the payload protocol, such as TCP or UDP.<br/>C. When TTL reaches zero the router drops the packet.<br/>D. The checksum is recomputed, but it does not limit a packet&#39;s life.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Trường này định vị mảnh trong gói gốc.<br/>B. Trường này cho biết giao thức bên trong, như TCP hay UDP.<br/>C. TTL về 0 thì router bỏ gói.<br/>D. Checksum được tính lại nhưng không giới hạn đời gói tin.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Host 192.168.40.25/24 sends a packet to 192.168.41.7. Where does the host send the frame first?</p></div><div class=\"ml-vi\"><p>Máy 192.168.40.25/24 gửi gói tin tới 192.168.41.7. Máy gửi khung tới đâu trước tiên?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "To its default gateway|||Tới default gateway của nó"
            },
            {
              "text": "To the broadcast address 192.168.40.255|||Tới địa chỉ quảng bá 192.168.40.255"
            },
            {
              "text": "Directly to 192.168.41.7|||Thẳng tới 192.168.41.7"
            },
            {
              "text": "To the DNS server|||Tới máy chủ DNS"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. With a /24 mask, 192.168.41.7 is on another network, so the router must carry it.<br/>B. Broadcast would reach local hosts only and is not used for routed traffic.<br/>C. Direct delivery only works on the local network.<br/>D. DNS resolves names; it does not forward packets.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Với mặt nạ /24, 192.168.41.7 ở mạng khác nên phải nhờ router.<br/>B. Quảng bá chỉ tới máy cục bộ và không dùng cho lưu lượng cần định tuyến.<br/>C. Gửi thẳng chỉ dùng trong mạng cục bộ.<br/>D. DNS phân giải tên, không chuyển tiếp gói.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>How does a switch fill its MAC address table?</p></div><div class=\"ml-vi\"><p>Switch điền bảng địa chỉ MAC bằng cách nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It reads the destination MAC of each incoming frame and records the port|||Nó đọc MAC đích của mỗi khung đi vào và ghi lại cổng"
            },
            {
              "text": "It reads the source MAC of each incoming frame and records the port|||Nó đọc MAC nguồn của mỗi khung đi vào và ghi lại cổng"
            },
            {
              "text": "The administrator must enter each MAC by hand|||Quản trị viên phải nhập tay từng MAC"
            },
            {
              "text": "It sends ARP requests for every address it finds|||Nó gửi ARP cho mọi địa chỉ nó thấy"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The destination is looked up, not learned; it says nothing about the arrival port.<br/>B. Source addresses show where each device is attached.<br/>C. Static entries exist, but learning is automatic by default.<br/>D. A Layer 2 switch does not need ARP to learn ports.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Địa chỉ đích dùng để tra, không dùng để học; nó không liên quan đến cổng nhận.<br/>B. Địa chỉ nguồn cho biết thiết bị đang nối ở cổng nào.<br/>C. Có thể nhập tĩnh, nhưng mặc định switch tự học.<br/>D. Switch tầng 2 không cần ARP để học cổng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A host forms a global IPv6 address with no DHCPv6 server. Which ICMPv6 message gives it the network prefix?</p></div><div class=\"ml-vi\"><p>Một máy tự tạo địa chỉ IPv6 toàn cục mà không có DHCPv6. Thông điệp ICMPv6 nào cung cấp tiền tố mạng cho nó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Router Advertisement|||Router Advertisement"
            },
            {
              "text": "Router Solicitation|||Router Solicitation"
            },
            {
              "text": "Echo Reply|||Echo Reply"
            },
            {
              "text": "Neighbor Solicitation|||Neighbor Solicitation"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. SLAAC relies on the prefix a router announces in an RA.<br/>B. The host sends this to ask for an RA; it carries no prefix.<br/>C. This is the ping response.<br/>D. This resolves a neighbour&#39;s MAC or checks for duplicates.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. SLAAC dựa vào tiền tố mà router thông báo trong RA.<br/>B. Máy gửi thông điệp này để xin RA, nó không mang tiền tố.<br/>C. Đây là phản hồi của ping.<br/>D. Thông điệp này tìm MAC hàng xóm hoặc kiểm tra trùng địa chỉ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A student&#39;s browser opens a new HTTPS connection to a web server. Which port pair is most likely in the first segment?</p></div><div class=\"ml-vi\"><p>Trình duyệt của sinh viên mở một kết nối HTTPS mới tới máy chủ web. Cặp cổng nào nhiều khả năng xuất hiện trong segment đầu tiên?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Source 443, destination 51544|||Nguồn 443, đích 51544"
            },
            {
              "text": "Source 80, destination 443|||Nguồn 80, đích 443"
            },
            {
              "text": "Source 51544, destination 443|||Nguồn 51544, đích 443"
            },
            {
              "text": "Source 51544, destination 53|||Nguồn 51544, đích 53"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is the direction of the server&#39;s reply.<br/>B. A client does not use a well-known port as its source.<br/>C. The client picks a dynamic source port and targets the well-known HTTPS port.<br/>D. Port 53 is DNS, not HTTPS.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là chiều máy chủ trả lời.<br/>B. Client không dùng cổng phổ biến làm cổng nguồn.<br/>C. Client chọn cổng nguồn động và nhắm tới cổng HTTPS phổ biến.<br/>D. Cổng 53 là DNS, không phải HTTPS.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the shortest correct form of 2001:0db8:0000:0000:0a40:0000:0000:0301?</p></div><div class=\"ml-vi\"><p>Dạng rút gọn đúng và ngắn nhất của 2001:0db8:0000:0000:0a40:0000:0000:0301 là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2001:db8:0:0:a4:0:0:301|||2001:db8:0:0:a4:0:0:301"
            },
            {
              "text": "2001:db8::a4::31|||2001:db8::a4::31"
            },
            {
              "text": "2001:db8::a40::301|||2001:db8::a40::301"
            },
            {
              "text": "2001:db8::a40:0:0:301|||2001:db8::a40:0:0:301"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Only leading zeros may be dropped; 0a40 cannot become a4.<br/>B. This breaks both the :: rule and the leading-zero rule.<br/>C. :: appears twice, which makes the address ambiguous.<br/>D. Leading zeros go, and :: may be used once. With two equal runs of zeros, the first is compressed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Chỉ được bỏ số 0 ở đầu; 0a40 không thể thành a4.<br/>B. Cách này sai cả luật :: lẫn luật số 0 đầu.<br/>C. :: xuất hiện hai lần nên địa chỉ bị mơ hồ.<br/>D. Bỏ số 0 đầu, và :: chỉ dùng một lần. Hai dãy 0 dài bằng nhau thì rút gọn dãy đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which prefix identifies IPv6 link-local addresses?</p></div><div class=\"ml-vi\"><p>Tiền tố nào nhận diện địa chỉ IPv6 link-local?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2000::/3|||2000::/3"
            },
            {
              "text": "fe80::/10|||fe80::/10"
            },
            {
              "text": "fc00::/7|||fc00::/7"
            },
            {
              "text": "ff00::/8|||ff00::/8"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the global unicast range.<br/>B. Link-local addresses start with fe80 and stay on one link.<br/>C. That is unique local.<br/>D. That is multicast.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là dải global unicast.<br/>B. Địa chỉ link-local bắt đầu bằng fe80 và chỉ dùng trên một chặng.<br/>C. Đó là unique local.<br/>D. Đó là multicast.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which protocol carries the messages that ping sends and receives?</p></div><div class=\"ml-vi\"><p>Giao thức nào mang các thông điệp mà ping gửi và nhận?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ICMP|||ICMP"
            },
            {
              "text": "DNS|||DNS"
            },
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "ARP|||ARP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Ping uses ICMP Echo Request and Echo Reply.<br/>B. DNS may run first to resolve a name, but it does not carry the echo.<br/>C. Ping does not open a connection and has no port.<br/>D. ARP resolves addresses on the local link.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Ping dùng ICMP Echo Request và Echo Reply.<br/>B. DNS có thể chạy trước để phân giải tên, nhưng không mang gói echo.<br/>C. Ping không mở kết nối và không có cổng.<br/>D. ARP phân giải địa chỉ trong mạng cục bộ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A receiving NIC recalculates the frame check sequence and it does not match the value in the trailer. What does Ethernet do?</p></div><div class=\"ml-vi\"><p>Card mạng bên nhận tính lại frame check sequence và thấy không khớp với giá trị ở phần đuôi. Ethernet xử lý thế nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The NIC asks the sender to resend that frame|||Card mạng yêu cầu bên gửi gửi lại khung đó"
            },
            {
              "text": "The NIC repairs the flipped bits|||Card mạng sửa lại các bit bị lật"
            },
            {
              "text": "The frame is discarded|||Khung bị loại bỏ"
            },
            {
              "text": "The frame is passed up with a warning flag|||Khung được đưa lên trên kèm cờ cảnh báo"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Ethernet has no Layer 2 retransmission; TCP may resend later.<br/>B. A CRC detects errors but cannot say which bits to fix.<br/>C. FCS only detects errors; a bad frame is dropped and any recovery is left to upper layers.<br/>D. Damaged frames never reach Layer 3.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Ethernet không gửi lại ở tầng 2; TCP có thể gửi lại sau.<br/>B. CRC phát hiện lỗi nhưng không chỉ ra bit nào cần sửa.<br/>C. FCS chỉ phát hiện lỗi; khung hỏng bị bỏ, việc khôi phục để tầng trên lo.<br/>D. Khung hỏng không bao giờ lên tới tầng 3.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A laptop sends a web request. In which order is the data wrapped on the way down the stack?</p></div><div class=\"ml-vi\"><p>Laptop gửi một yêu cầu web. Dữ liệu được đóng gói theo thứ tự nào khi đi xuống chồng giao thức?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Data, frame, packet, segment, bits|||Dữ liệu, frame, packet, segment, bit"
            },
            {
              "text": "Data, packet, segment, frame, bits|||Dữ liệu, packet, segment, frame, bit"
            },
            {
              "text": "Bits, frame, packet, segment, data|||Bit, frame, packet, segment, dữ liệu"
            },
            {
              "text": "Data, segment, packet, frame, bits|||Dữ liệu, segment, packet, frame, bit"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. This is close to the receive direction, not the send direction.<br/>B. Transport work happens before network work, so segment comes before packet.<br/>C. This is the de-encapsulation order at the receiver.<br/>D. The transport header makes a segment, IP makes a packet, Layer 2 makes a frame, and Layer 1 sends bits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Thứ tự này gần với chiều nhận, không phải chiều gửi.<br/>B. Giao vận làm trước tầng mạng nên segment phải đứng trước packet.<br/>C. Đây là thứ tự mở gói ở bên nhận.<br/>D. Phần đầu giao vận tạo segment, IP tạo packet, tầng 2 tạo frame, tầng 1 gửi bit.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
