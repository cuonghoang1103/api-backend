// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-NWC204-TS-FE3.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "NWC204"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE3",
      "title": "NWC204 — Practice Final 3 (self-composed)|||NWC204 — Đề luyện cuối kỳ 3 (tự soạn theo dạng đề)",
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
          "prompt": "<div class=\"ml-en\"><p>What is the first usable address in the subnet of host 172.18.203.9/21?</p></div><div class=\"ml-vi\"><p>Địa chỉ dùng được đầu tiên trong subnet của máy 172.18.203.9/21 là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "172.18.200.0|||172.18.200.0"
            },
            {
              "text": "172.18.203.1|||172.18.203.1"
            },
            {
              "text": "172.18.200.1|||172.18.200.1"
            },
            {
              "text": "172.18.192.1|||172.18.192.1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is the network address.<br/>B. This assumes a /24.<br/>C. /21 makes blocks of 8 in the third octet, so 203 belongs to the block starting at 200.<br/>D. This uses a block of 16, which is /20.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là địa chỉ mạng.<br/>B. Cách này giả định /24.<br/>C. /21 tạo khối 8 ở octet thứ ba nên 203 thuộc khối bắt đầu từ 200.<br/>D. Cách này dùng khối 16, tức /20.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Two browser tabs on one laptop open connections to the same HTTPS server. How does the laptop keep the replies apart?</p></div><div class=\"ml-vi\"><p>Hai tab trình duyệt trên một laptop cùng mở kết nối tới một máy chủ HTTPS. Laptop tách trả lời cho từng tab bằng cách nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The server opens a different port for each tab|||Máy chủ mở một cổng khác cho mỗi tab"
            },
            {
              "text": "Each tab gets its own IP address|||Mỗi tab có một địa chỉ IP riêng"
            },
            {
              "text": "Each tab gets its own MAC address|||Mỗi tab có một địa chỉ MAC riêng"
            },
            {
              "text": "Each connection uses a different source port|||Mỗi kết nối dùng một cổng nguồn khác nhau"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Both connections use server port 443.<br/>B. Both tabs share the laptop&#39;s IP.<br/>C. The laptop has one MAC per NIC.<br/>D. The port pair and IP pair together identify each connection.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cả hai kết nối đều dùng cổng 443 của máy chủ.<br/>B. Hai tab dùng chung IP của laptop.<br/>C. Laptop có một MAC cho mỗi card mạng.<br/>D. Cặp cổng và cặp IP cùng xác định từng kết nối.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A printer is unplugged and stays silent for a long time. What happens to its entry in the switch&#39;s MAC table?</p></div><div class=\"ml-vi\"><p>Một máy in bị rút dây và im lặng rất lâu. Mục của nó trong bảng MAC của switch sẽ ra sao?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It becomes a broadcast address|||Trở thành địa chỉ quảng bá"
            },
            {
              "text": "It ages out and is removed|||Hết hạn và bị xoá"
            },
            {
              "text": "It stays forever|||Tồn tại mãi"
            },
            {
              "text": "It moves to the router&#39;s ARP table|||Chuyển sang bảng ARP của router"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. An entry never changes into a broadcast address.<br/>B. Dynamic entries are removed after a timer, typically 5 minutes.<br/>C. Only static entries remain until removed by hand.<br/>D. The tables are unrelated.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Một mục không bao giờ đổi thành địa chỉ quảng bá.<br/>B. Mục động bị xoá sau một khoảng thời gian, thường là 5 phút.<br/>C. Chỉ mục tĩnh mới còn cho tới khi xoá tay.<br/>D. Hai bảng này không liên quan nhau.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>An attacker on a LAN sends forged ARP replies claiming to be the default gateway. What is the attacker trying to do?</p></div><div class=\"ml-vi\"><p>Kẻ tấn công trong LAN gửi ARP reply giả, tự nhận là default gateway. Kẻ đó định làm gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Make hosts send their traffic through the attacker|||Khiến các máy gửi lưu lượng đi qua kẻ tấn công"
            },
            {
              "text": "Assign new IP addresses|||Cấp địa chỉ IP mới"
            },
            {
              "text": "Change the ISP&#39;s DNS records|||Đổi bản ghi DNS của nhà mạng"
            },
            {
              "text": "Speed up routing for everyone|||Tăng tốc định tuyến cho mọi người"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. This is ARP spoofing, a man-in-the-middle method.<br/>B. That is DHCP&#39;s job.<br/>C. ARP cannot reach or change DNS.<br/>D. There is no benefit for the victims.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Đây là giả mạo ARP, một cách làm man-in-the-middle.<br/>B. Đó là việc của DHCP.<br/>C. ARP không tới được DNS và không đổi được DNS.<br/>D. Nạn nhân không được lợi gì.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which two statements about fiber are correct? (Choose two.)</p></div><div class=\"ml-vi\"><p>Hai phát biểu nào về cáp quang là đúng? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Fiber carries electrical pulses|||Cáp quang mang xung điện"
            },
            {
              "text": "Fiber is more affected by EMI than UTP|||Cáp quang chịu ảnh hưởng EMI hơn UTP"
            },
            {
              "text": "Single-mode fiber has a very small core and usually a laser source|||Cáp đơn mode có lõi rất nhỏ và thường dùng nguồn laser"
            },
            {
              "text": "Multimode reaches farther than single-mode|||Đa mode đi xa hơn đơn mode"
            },
            {
              "text": "Multimode fiber has a wider core and suits shorter runs|||Cáp đa mode có lõi rộng hơn và hợp đoạn ngắn"
            }
          ],
          "correctIndexes": [
            2,
            4
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C, E.</strong><br/>A. It carries light.<br/>B. Fiber is immune to EMI.<br/>C. The narrow core gives one light path over long distances.<br/>D. Single-mode reaches farther.<br/>E. Several light paths spread out, which limits the distance.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C, E.</strong><br/>A. Nó mang ánh sáng.<br/>B. Cáp quang miễn nhiễm EMI.<br/>C. Lõi hẹp cho một đường sáng trên khoảng cách dài.<br/>D. Đơn mode đi xa hơn.<br/>E. Nhiều đường sáng bị phân tán nên khoảng cách bị giới hạn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which range holds the well-known port numbers?</p></div><div class=\"ml-vi\"><p>Dải nào chứa các số cổng phổ biến (well-known)?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1024 to 49151|||1024 đến 49151"
            },
            {
              "text": "0 to 65535|||0 đến 65535"
            },
            {
              "text": "49152 to 65535|||49152 đến 65535"
            },
            {
              "text": "0 to 1023|||0 đến 1023"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. These are registered ports.<br/>B. That is the whole port space.<br/>C. These are dynamic or private ports.<br/>D. These are reserved for common services such as HTTP and DNS.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đây là dải cổng đăng ký.<br/>B. Đó là toàn bộ không gian cổng.<br/>C. Đây là dải cổng động.<br/>D. Dải này dành cho dịch vụ thông dụng như HTTP và DNS.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A PC with an empty cache looks up a name. Assuming nothing is cached along the way, which order is right?</p></div><div class=\"ml-vi\"><p>Một máy với cache trống tra một tên miền. Giả sử dọc đường không có gì trong cache, thứ tự nào đúng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Local resolver, root server, TLD server, authoritative server|||Máy chủ phân giải cục bộ, root, TLD, máy chủ có thẩm quyền"
            },
            {
              "text": "DHCP server, ARP table, root server, TLD server|||Máy chủ DHCP, bảng ARP, root, TLD"
            },
            {
              "text": "Root server, local resolver, authoritative server, TLD server|||Root, máy chủ phân giải, máy chủ có thẩm quyền, TLD"
            },
            {
              "text": "Authoritative server, TLD server, root server, local resolver|||Máy chủ có thẩm quyền, TLD, root, máy chủ phân giải"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The resolver walks down the DNS hierarchy on the client&#39;s behalf.<br/>B. DHCP and ARP are not part of name lookup.<br/>C. The client asks its resolver first, and TLD comes before authoritative.<br/>D. This is upside down.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Máy chủ phân giải đi dần xuống cây DNS thay cho máy khách.<br/>B. DHCP và ARP không thuộc quá trình tra tên.<br/>C. Máy khách hỏi máy phân giải trước, và TLD đứng trước máy có thẩm quyền.<br/>D. Thứ tự này ngược.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A server&#39;s network card is replaced but its IP stays the same. For some minutes other PCs on the LAN cannot reach it, though it can reach them. What is the likely reason?</p></div><div class=\"ml-vi\"><p>Card mạng của máy chủ được thay nhưng IP giữ nguyên. Vài phút sau đó các máy khác trong LAN không tới được nó, dù nó tới được chúng. Lý do khả dĩ là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The DNS record has expired|||Bản ghi DNS đã hết hạn"
            },
            {
              "text": "The new card needs a new subnet mask|||Card mới cần mặt nạ mạng mới"
            },
            {
              "text": "Their ARP caches still map that IP to the old MAC|||ARP cache của chúng vẫn ánh xạ IP đó sang MAC cũ"
            },
            {
              "text": "Routers block new MAC addresses for ten minutes|||Router chặn MAC mới trong mười phút"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The name-to-IP mapping did not change.<br/>B. The mask does not depend on the card.<br/>C. Frames go to the old MAC until the entries expire or are cleared.<br/>D. No such behaviour exists on the LAN path.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Ánh xạ tên sang IP không đổi.<br/>B. Mặt nạ không phụ thuộc vào card.<br/>C. Khung đi tới MAC cũ cho tới khi mục hết hạn hoặc bị xoá.<br/>D. Không có hành vi đó trên đường đi trong LAN.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A subnet is configured on G0/1 of a router, yet its C route is missing from show ip route. What is the most likely reason?</p></div><div class=\"ml-vi\"><p>Một subnet đã đặt trên G0/1 của router nhưng dòng C của nó không có trong show ip route. Lý do khả dĩ nhất là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "DHCP must be enabled on the router|||Phải bật DHCP trên router"
            },
            {
              "text": "The interface is not up/up|||Cổng chưa ở trạng thái up/up"
            },
            {
              "text": "Connected routes appear only after saving the configuration|||Tuyến nối trực tiếp chỉ xuất hiện sau khi lưu cấu hình"
            },
            {
              "text": "The router needs a default route first|||Router phải có tuyến mặc định trước"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Static addressing is enough.<br/>B. A connected route enters the table only while the interface is working.<br/>C. Saving has no effect on the routing table.<br/>D. Connected routes do not depend on a default route.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Địa chỉ tĩnh là đủ.<br/>B. Tuyến nối trực tiếp chỉ vào bảng khi cổng đang hoạt động.<br/>C. Lưu cấu hình không ảnh hưởng tới bảng định tuyến.<br/>D. Tuyến nối trực tiếp không phụ thuộc tuyến mặc định.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>During migration, a server keeps both an IPv4 and an IPv6 address and answers on either. What is this technique called?</p></div><div class=\"ml-vi\"><p>Trong giai đoạn chuyển đổi, một máy chủ giữ cả địa chỉ IPv4 và IPv6, trả lời trên cả hai. Kỹ thuật này gọi là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Translation|||Dịch địa chỉ"
            },
            {
              "text": "Tunneling|||Tạo đường hầm"
            },
            {
              "text": "Subnetting|||Chia subnet"
            },
            {
              "text": "Dual stack|||Chồng kép (dual stack)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Translation converts between the two protocols.<br/>B. Tunneling wraps one protocol inside the other.<br/>C. Subnetting divides an address block.<br/>D. Both protocol stacks run side by side.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Dịch địa chỉ chuyển đổi giữa hai giao thức.<br/>B. Đường hầm bọc giao thức này trong giao thức kia.<br/>C. Chia subnet là chia một khối địa chỉ.<br/>D. Hai chồng giao thức chạy song song.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which name is a valid Cisco IOS hostname under the usual naming rules?</p></div><div class=\"ml-vi\"><p>Theo quy tắc đặt tên thường dùng, tên nào hợp lệ làm hostname của Cisco IOS?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Floor 2 Switch|||Floor 2 Switch"
            },
            {
              "text": "Floor2-Sw1|||Floor2-Sw1"
            },
            {
              "text": "2nd-Floor-Sw|||2nd-Floor-Sw"
            },
            {
              "text": "Sw1-|||Sw1-"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Spaces are not allowed.<br/>B. It starts with a letter and contains no spaces.<br/>C. A hostname should begin with a letter.<br/>D. A hostname should end with a letter or digit.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Không được có dấu cách.<br/>B. Tên này bắt đầu bằng chữ cái và không có dấu cách.<br/>C. Hostname nên bắt đầu bằng chữ cái.<br/>D. Hostname nên kết thúc bằng chữ cái hoặc chữ số.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A web form sends a new password to the server. Which HTTP method should it use?</p></div><div class=\"ml-vi\"><p>Một biểu mẫu web gửi mật khẩu mới lên máy chủ. Nên dùng phương thức HTTP nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "POST|||POST"
            },
            {
              "text": "OPTIONS|||OPTIONS"
            },
            {
              "text": "HEAD|||HEAD"
            },
            {
              "text": "GET|||GET"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. POST sends data in the request body rather than in the URL.<br/>B. OPTIONS asks which methods are allowed.<br/>C. HEAD asks only for headers.<br/>D. GET would put the data in the URL, where it gets logged.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. POST gửi dữ liệu trong thân yêu cầu thay vì trên URL.<br/>B. OPTIONS hỏi phương thức nào được phép.<br/>C. HEAD chỉ xin phần đầu.<br/>D. GET đưa dữ liệu lên URL, nơi nó bị ghi vào nhật ký.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A packet capture shows an IPv4 Protocol field of 17. What does the packet carry?</p></div><div class=\"ml-vi\"><p>Bắt gói thấy trường Protocol của IPv4 bằng 17. Gói tin mang gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ARP|||ARP"
            },
            {
              "text": "ICMP|||ICMP"
            },
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "TCP|||TCP"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. ARP is not carried inside IP at all.<br/>B. ICMP is 1.<br/>C. Protocol 17 is UDP, 6 is TCP and 1 is ICMP.<br/>D. TCP is 6.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. ARP hoàn toàn không nằm trong IP.<br/>B. ICMP là 1.<br/>C. Protocol 17 là UDP, 6 là TCP và 1 là ICMP.<br/>D. TCP là 6.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A block is written 10.30.0.0/23. Counting only the addresses you can give to devices, how many does it offer?</p></div><div class=\"ml-vi\"><p>Một khối được viết là 10.30.0.0/23. Chỉ tính các địa chỉ gán được cho thiết bị, khối này có bao nhiêu địa chỉ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "512|||512"
            },
            {
              "text": "1022|||1022"
            },
            {
              "text": "510|||510"
            },
            {
              "text": "254|||254"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That includes the network and broadcast addresses.<br/>B. That is a /22.<br/>C. 9 host bits give 512 addresses, minus 2.<br/>D. That is a /24.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Số này tính cả địa chỉ mạng và quảng bá.<br/>B. Đó là /22.<br/>C. 9 bit máy cho 512 địa chỉ, trừ 2.<br/>D. Đó là /24.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>In 192.168.9.0/24, the blocks 192.168.9.0/26 and 192.168.9.64/27 are already in use. A new LAN needs 12 hosts. Which is the next correct block?</p></div><div class=\"ml-vi\"><p>Trong 192.168.9.0/24, các khối 192.168.9.0/26 và 192.168.9.64/27 đã dùng. Một LAN mới cần 12 máy. Khối đúng kế tiếp là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "192.168.9.96/29|||192.168.9.96/29"
            },
            {
              "text": "192.168.9.96/28|||192.168.9.96/28"
            },
            {
              "text": "192.168.9.104/28|||192.168.9.104/28"
            },
            {
              "text": "192.168.9.64/28|||192.168.9.64/28"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A /29 gives only 6 hosts.<br/>B. Free space starts at .96, and 12 hosts need a /28 with 14 usable addresses.<br/>C. .104 is not a /28 boundary, because /28 blocks start at multiples of 16, such as .96 and .112.<br/>D. That overlaps the /27 in use.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. /29 chỉ cho 6 máy.<br/>B. Chỗ trống bắt đầu từ .96, và 12 máy cần /28 có 14 địa chỉ dùng được.<br/>C. .104 không phải ranh giới /28, vì khối /28 bắt đầu ở bội của 16, như .96 và .112.<br/>D. Khối đó chồng lấn /27 đang dùng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which IOS command blocks login attempts for 120 seconds after 3 failed tries within 60 seconds?</p></div><div class=\"ml-vi\"><p>Lệnh IOS nào chặn đăng nhập trong 120 giây sau 3 lần sai trong vòng 60 giây?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "login block-for 120 attempts 3 within 60|||login block-for 120 attempts 3 within 60"
            },
            {
              "text": "exec-timeout 120 60|||exec-timeout 120 60"
            },
            {
              "text": "security passwords min-length 3|||security passwords min-length 3"
            },
            {
              "text": "login block-for 60 attempts 3 within 120|||login block-for 60 attempts 3 within 120"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The order is block time, attempts, then the window.<br/>B. It sets the idle timeout.<br/>C. It sets the minimum password length.<br/>D. This blocks for 60 s after 3 failures in 120 s.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Thứ tự là thời gian chặn, số lần thử, rồi khoảng thời gian.<br/>B. Lệnh này đặt thời gian chờ nhàn rỗi.<br/>C. Lệnh này đặt độ dài tối thiểu của mật khẩu.<br/>D. Lệnh này chặn 60 giây sau 3 lần sai trong 120 giây.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>The output below comes from a PC that reaches local hosts but not the Internet. What is the problem?</p><pre><code class=\"language-plaintext\">C:\\&gt; ipconfig\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.50\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . :</code></pre></div><div class=\"ml-vi\"><p>Kết quả dưới đây lấy từ một máy tới được các máy cục bộ nhưng không ra được Internet. Vấn đề là gì?</p><pre><code class=\"language-plaintext\">C:\\&gt; ipconfig\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.50\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . :</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The IP address is a broadcast address|||Địa chỉ IP là địa chỉ quảng bá"
            },
            {
              "text": "The subnet mask is invalid|||Mặt nạ mạng không hợp lệ"
            },
            {
              "text": "The PC has an APIPA address|||Máy đang dùng địa chỉ APIPA"
            },
            {
              "text": "No default gateway is configured|||Chưa cấu hình default gateway"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. .50 is a normal host in this /24.<br/>B. 255.255.255.0 is valid.<br/>C. APIPA addresses start with 169.254.<br/>D. Without a gateway the PC has nowhere to send remote traffic.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. .50 là địa chỉ máy bình thường trong /24 này.<br/>B. 255.255.255.0 là hợp lệ.<br/>C. Địa chỉ APIPA bắt đầu bằng 169.254.<br/>D. Không có gateway thì máy không biết gửi lưu lượng ra ngoài đi đâu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>As a frame climbs the stack at the receiver, what does the data link layer do before passing data upward?</p></div><div class=\"ml-vi\"><p>Khi khung đi lên chồng giao thức ở bên nhận, tầng liên kết dữ liệu làm gì trước khi đẩy dữ liệu lên trên?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Checks the frame, strips its header and trailer, passes the packet up|||Kiểm khung, bỏ phần đầu và đuôi, rồi đẩy gói tin lên"
            },
            {
              "text": "Changes the destination IP address|||Đổi địa chỉ IP đích"
            },
            {
              "text": "Adds a new TCP header to the data|||Thêm một phần đầu TCP mới vào dữ liệu"
            },
            {
              "text": "Sends the bits back onto the wire|||Gửi các bit trở lại đường dây"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. This is de-encapsulation at Layer 2.<br/>B. Layer 2 does not touch the IP header.<br/>C. Headers are removed, not added, on the way up.<br/>D. That is what a repeater does.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Đây là mở gói ở tầng 2.<br/>B. Tầng 2 không đụng vào phần đầu IP.<br/>C. Khi đi lên, phần đầu được bỏ đi chứ không thêm vào.<br/>D. Đó là việc của bộ lặp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What usually separates a WAN from a LAN?</p></div><div class=\"ml-vi\"><p>Điểm nào thường phân biệt WAN với LAN?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A LAN cannot use Ethernet|||LAN không dùng được Ethernet"
            },
            {
              "text": "A LAN needs a service provider but a WAN does not|||LAN cần nhà cung cấp còn WAN thì không"
            },
            {
              "text": "A WAN uses only wireless links|||WAN chỉ dùng đường không dây"
            },
            {
              "text": "A WAN links distant sites, usually over provider links|||WAN nối các điểm ở xa, thường qua đường của nhà cung cấp"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Ethernet is the main LAN technology.<br/>B. This reverses the usual situation.<br/>C. Most WAN links are fiber.<br/>D. Organisations rarely own long-distance links, so they lease them.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Ethernet là công nghệ LAN chính.<br/>B. Câu này đảo ngược tình huống thường gặp.<br/>C. Phần lớn đường WAN là cáp quang.<br/>D. Tổ chức hiếm khi tự sở hữu đường dài nên phải thuê.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>In the topology below, how many broadcast domains are there?</p><pre class=\"mermaid\">flowchart LR\n  R[Router]\n  S1[Switch 1] --- R\n  S2[Switch 2] --- S1\n  S3[Switch 3] --- R\n  P1[PC 1] --- S1\n  P2[PC 2] --- S1\n  P3[PC 3] --- S2\n  P4[PC 4] --- S2\n  P5[PC 5] --- S3\n  P6[PC 6] --- S3</pre></div><div class=\"ml-vi\"><p>Trong tô-pô dưới đây có bao nhiêu miền quảng bá?</p><pre class=\"mermaid\">flowchart LR\n  R[Router]\n  S1[Switch 1] --- R\n  S2[Switch 2] --- S1\n  S3[Switch 3] --- R\n  P1[PC 1] --- S1\n  P2[PC 2] --- S1\n  P3[PC 3] --- S2\n  P4[PC 4] --- S2\n  P5[PC 5] --- S3\n  P6[PC 6] --- S3</pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That counts every host; hosts on a LAN share a broadcast domain.<br/>B. The router stops broadcasts between its two LANs.<br/>C. Each router interface bounds one broadcast domain, and the switches do not split them.<br/>D. Three switches sit in two segments, and switches do not divide broadcast domains.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Cách đó đếm từng máy, trong khi các máy cùng LAN chung một miền quảng bá.<br/>B. Router chặn quảng bá giữa hai LAN của nó.<br/>C. Mỗi cổng router giới hạn một miền quảng bá, còn switch không chia nhỏ miền.<br/>D. Ba switch nằm trong hai đoạn mạng, mà switch không chia miền quảng bá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>How is a TCP connection normally closed?</p></div><div class=\"ml-vi\"><p>Một kết nối TCP thường được đóng như thế nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Each side sends a SYN again|||Mỗi bên gửi lại SYN"
            },
            {
              "text": "Each side sends FIN and the other side acknowledges it|||Mỗi bên gửi FIN và bên kia xác nhận"
            },
            {
              "text": "The client just stops sending|||Client chỉ cần ngừng gửi"
            },
            {
              "text": "The router removes the session|||Router xoá phiên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. SYN opens a connection.<br/>B. Each direction closes on its own, which often takes four segments.<br/>C. Silence does not close a connection.<br/>D. Routers do not track TCP sessions in normal forwarding.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. SYN dùng để mở kết nối.<br/>B. Mỗi chiều đóng riêng nên thường mất bốn segment.<br/>C. Im lặng không đóng được kết nối.<br/>D. Router không theo dõi phiên TCP khi chuyển gói thông thường.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which protocol uses one TCP connection for commands and a separate one for file data?</p></div><div class=\"ml-vi\"><p>Giao thức nào dùng một kết nối TCP cho lệnh và một kết nối riêng cho dữ liệu tệp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "SSH|||SSH"
            },
            {
              "text": "Telnet|||Telnet"
            },
            {
              "text": "FTP|||FTP"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. SMTP uses one connection.<br/>B. SSH multiplexes everything on one connection.<br/>C. Telnet uses one connection.<br/>D. FTP uses a control connection on port 21 and a data connection.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. SMTP dùng một kết nối.<br/>B. SSH gộp mọi thứ trên một kết nối.<br/>C. Telnet dùng một kết nối.<br/>D. FTP dùng kết nối điều khiển ở cổng 21 và một kết nối dữ liệu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which IEEE standard family describes wireless LANs such as Wi-Fi 6?</p></div><div class=\"ml-vi\"><p>Họ chuẩn IEEE nào mô tả mạng LAN không dây như Wi-Fi 6?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "802.15|||802.15"
            },
            {
              "text": "802.3|||802.3"
            },
            {
              "text": "802.11|||802.11"
            },
            {
              "text": "802.1Q|||802.1Q"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That covers personal area networks such as Bluetooth.<br/>B. That is wired Ethernet.<br/>C. Wi-Fi 6 is 802.11ax.<br/>D. That is VLAN tagging.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là mạng cá nhân như Bluetooth.<br/>B. Đó là Ethernet có dây.<br/>C. Wi-Fi 6 là 802.11ax.<br/>D. Đó là gắn thẻ VLAN.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A captured Ethernet frame has the type field value 0x0800. What does the receiving device learn from it?</p></div><div class=\"ml-vi\"><p>Một khung Ethernet bắt được có trường type bằng 0x0800. Thiết bị nhận biết được điều gì từ đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The frame belongs to VLAN 800|||Khung thuộc VLAN 800"
            },
            {
              "text": "The payload is an IPv4 packet|||Phần dữ liệu là một gói IPv4"
            },
            {
              "text": "The payload is an ARP message|||Phần dữ liệu là một thông điệp ARP"
            },
            {
              "text": "The frame is 2048 bytes long|||Khung dài 2048 byte"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A VLAN tag is a separate field.<br/>B. 0x0800 is IPv4, while 0x86DD is IPv6 and 0x0806 is ARP.<br/>C. ARP uses 0x0806.<br/>D. Values above 0x0600 name a protocol, not a length.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Thẻ VLAN là một trường riêng.<br/>B. 0x0800 là IPv4, 0x86DD là IPv6 và 0x0806 là ARP.<br/>C. ARP dùng 0x0806.<br/>D. Giá trị trên 0x0600 chỉ giao thức, không phải độ dài.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which two jobs does a typical home wireless router combine in one box? (Choose two.)</p></div><div class=\"ml-vi\"><p>Router không dây gia đình thường gộp hai việc nào trong một hộp? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A core ISP router|||Một router lõi của nhà mạng"
            },
            {
              "text": "A small switch for its wired LAN ports|||Một switch nhỏ cho các cổng LAN có dây"
            },
            {
              "text": "An authoritative DNS server for the Internet|||Một máy chủ DNS có thẩm quyền cho Internet"
            },
            {
              "text": "A mail server for the household|||Một máy chủ thư cho gia đình"
            },
            {
              "text": "A wireless access point|||Một điểm truy cập không dây"
            }
          ],
          "correctIndexes": [
            1,
            4
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B, E.</strong><br/>A. Core routers are far larger and sit in the provider&#39;s network.<br/>B. The LAN ports behave like a switch.<br/>C. A home router may forward DNS queries, but it holds no Internet zones.<br/>D. That is not a normal function of a home router.<br/>E. The radios let Wi-Fi clients join the LAN.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B, E.</strong><br/>A. Router lõi lớn hơn nhiều và nằm trong mạng nhà cung cấp.<br/>B. Các cổng LAN hoạt động như một switch.<br/>C. Router gia đình có thể chuyển tiếp truy vấn DNS nhưng không giữ vùng tên của Internet.<br/>D. Đó không phải chức năng thường có của router gia đình.<br/>E. Bộ phát sóng cho máy Wi-Fi vào được LAN.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>In a Cisco routing table, what does a line marked L such as L 192.168.1.1/32 show?</p></div><div class=\"ml-vi\"><p>Trong bảng định tuyến Cisco, dòng đánh dấu L như L 192.168.1.1/32 cho biết điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The router&#39;s own interface address|||Địa chỉ cổng của chính router"
            },
            {
              "text": "The default route|||Tuyến mặc định"
            },
            {
              "text": "A route learned from a neighbour|||Tuyến học từ router hàng xóm"
            },
            {
              "text": "The whole connected network|||Toàn bộ mạng nối trực tiếp"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. L means local, a /32 host route for the interface&#39;s IP.<br/>B. That is marked S* or similar.<br/>C. Learned routes carry codes such as O or R.<br/>D. That is the C line.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. L nghĩa là local, tuyến /32 cho IP của cổng.<br/>B. Tuyến đó đánh dấu S* hoặc tương tự.<br/>C. Tuyến học được có mã như O hoặc R.<br/>D. Đó là dòng C.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which of these is a Layer 2 protocol often used on WAN serial links?</p></div><div class=\"ml-vi\"><p>Giao thức tầng 2 nào thường dùng trên đường WAN nối tiếp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "PPP|||PPP"
            },
            {
              "text": "IPv4|||IPv4"
            },
            {
              "text": "HTTP|||HTTP"
            },
            {
              "text": "UDP|||UDP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Point-to-Point Protocol frames data between two directly linked devices.<br/>B. IPv4 is Layer 3.<br/>C. HTTP is an application protocol.<br/>D. UDP is Layer 4.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Point-to-Point Protocol đóng khung dữ liệu giữa hai thiết bị nối trực tiếp.<br/>B. IPv4 ở tầng 3.<br/>C. HTTP là giao thức ứng dụng.<br/>D. UDP ở tầng 4.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A single flat subnet must hold 500 hosts, with as little waste as possible. Which mask should be used?</p></div><div class=\"ml-vi\"><p>Một subnet phẳng phải chứa 500 máy, càng ít lãng phí càng tốt. Nên dùng mặt nạ nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "255.255.255.128|||255.255.255.128"
            },
            {
              "text": "255.255.252.0|||255.255.252.0"
            },
            {
              "text": "255.255.255.0|||255.255.255.0"
            },
            {
              "text": "255.255.254.0|||255.255.254.0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. /25 has only 126 hosts.<br/>B. /22 works but wastes about half of the block.<br/>C. /24 has only 254 hosts.<br/>D. /23 gives 510 usable hosts, and /24 gives only 254.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. /25 chỉ có 126 máy.<br/>B. /22 đủ nhưng phí khoảng nửa khối.<br/>C. /24 chỉ có 254 máy.<br/>D. /23 cho 510 máy dùng được, còn /24 chỉ cho 254.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>At which OSI layers do a hub, a Layer 2 switch and a router mainly work, in that order?</p></div><div class=\"ml-vi\"><p>Hub, switch tầng 2 và router chủ yếu làm việc ở các tầng OSI nào, theo đúng thứ tự đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2, 2, 4|||2, 2, 4"
            },
            {
              "text": "2, 1, 3|||2, 1, 3"
            },
            {
              "text": "1, 2, 3|||1, 2, 3"
            },
            {
              "text": "1, 3, 2|||1, 3, 2"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. A hub is Layer 1 and a router does not forward on Layer 4 data.<br/>B. A hub cannot read frames, and a switch does more than repeat bits.<br/>C. A hub repeats bits, a switch reads MACs, and a router reads IP addresses.<br/>D. This swaps the switch and the router.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Hub ở tầng 1, còn router không chuyển gói theo dữ liệu tầng 4.<br/>B. Hub không đọc được khung, còn switch làm nhiều hơn lặp bit.<br/>C. Hub lặp bit, switch đọc MAC, router đọc địa chỉ IP.<br/>D. Cách này đảo switch và router.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>How does traceroute learn the routers along a path?</p></div><div class=\"ml-vi\"><p>Traceroute biết các router trên đường đi bằng cách nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It floods ARP requests across the Internet|||Nó phát ARP khắp Internet"
            },
            {
              "text": "It raises TTL step by step and reads Time Exceeded replies|||Nó tăng TTL từng bước và đọc các trả lời Time Exceeded"
            },
            {
              "text": "It reads the routing tables of remote routers|||Nó đọc bảng định tuyến của các router ở xa"
            },
            {
              "text": "It asks DNS for the path|||Nó hỏi DNS về đường đi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. ARP stays on one link.<br/>B. Each hop reveals itself by answering when TTL reaches zero.<br/>C. It has no such access.<br/>D. DNS knows names, not paths.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. ARP chỉ ở trong một chặng.<br/>B. Mỗi chặng tự lộ diện khi trả lời lúc TTL về 0.<br/>C. Nó không có quyền truy cập đó.<br/>D. DNS biết tên, không biết đường đi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Write the binary value 11011011 in hexadecimal.</p></div><div class=\"ml-vi\"><p>Viết giá trị nhị phân 11011011 ở hệ thập lục phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "DB|||DB"
            },
            {
              "text": "BD|||BD"
            },
            {
              "text": "CB|||CB"
            },
            {
              "text": "DA|||DA"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 1101 is D and 1011 is B.<br/>B. The two groups are swapped.<br/>C. 1100 would be C, but the high group is 1101.<br/>D. 1010 would be A, but the low group is 1011.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 1101 là D và 1011 là B.<br/>B. Hai nhóm bị đảo.<br/>C. 1100 mới là C, còn nhóm cao là 1101.<br/>D. 1010 mới là A, còn nhóm thấp là 1011.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A 140 m Cat 6 run between a switch and a PC gives many errors, while a 20 m run on the same switch is clean. What is the likely physical cause?</p></div><div class=\"ml-vi\"><p>Đường Cat 6 dài 140 m từ switch tới máy tính báo nhiều lỗi, còn đường 20 m trên cùng switch thì sạch. Nguyên nhân vật lý khả dĩ là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "IPv6 is disabled on the PC|||IPv6 bị tắt trên máy tính"
            },
            {
              "text": "The DHCP lease time is too short|||Thời hạn thuê DHCP quá ngắn"
            },
            {
              "text": "Attenuation over a run beyond the 100 m limit|||Suy hao do đoạn cáp vượt giới hạn 100 m"
            },
            {
              "text": "The switch&#39;s MAC table is full|||Bảng MAC của switch đã đầy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is not a physical problem.<br/>B. That has nothing to do with signal errors.<br/>C. A signal weakens with distance and copper Ethernet is specified to 100 m.<br/>D. The other run works, and a full table causes flooding, not errors.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó không phải vấn đề vật lý.<br/>B. Điều đó không liên quan đến lỗi tín hiệu.<br/>C. Tín hiệu yếu dần theo khoảng cách và Ethernet cáp đồng chỉ quy định tới 100 m.<br/>D. Đường kia vẫn tốt, và bảng đầy gây phát tràn chứ không gây lỗi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>An admin cannot ping switch Sw-B, and sees the output below. What should be done?</p><pre><code class=\"language-plaintext\">Sw-B# show ip interface brief\nInterface     IP-Address     OK? Method Status                Protocol\nVlan1         192.168.1.2    YES manual administratively down down\nFastEth0/1    unassigned     YES unset  up                    up</code></pre></div><div class=\"ml-vi\"><p>Quản trị viên không ping được switch Sw-B và thấy kết quả dưới đây. Cần làm gì?</p><pre><code class=\"language-plaintext\">Sw-B# show ip interface brief\nInterface     IP-Address     OK? Method Status                Protocol\nVlan1         192.168.1.2    YES manual administratively down down\nFastEth0/1    unassigned     YES unset  up                    up</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Erase the startup configuration|||Xoá startup-config"
            },
            {
              "text": "Replace the cable on Fa0/1|||Thay cáp ở Fa0/1"
            },
            {
              "text": "Put 192.168.1.2 on Fa0/1 instead|||Đặt 192.168.1.2 lên Fa0/1"
            },
            {
              "text": "Enter interface vlan 1, then no shutdown|||Vào interface vlan 1 rồi gõ no shutdown"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That would delete the settings and fix nothing.<br/>B. Fa0/1 is up and up.<br/>C. Layer 2 access ports do not take an IP address.<br/>D. Vlan1 has an IP but is administratively down, so it must be enabled.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Việc đó xoá cấu hình và không sửa được gì.<br/>B. Fa0/1 đang up và up.<br/>C. Cổng access tầng 2 không nhận IP.<br/>D. Vlan1 có IP nhưng đang bị tắt nên phải bật lên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A walkie-talkie lets either side talk, but only one at a time. Which communication mode is this?</p></div><div class=\"ml-vi\"><p>Bộ đàm cho phép mỗi bên nói, nhưng chỉ một bên mỗi lúc. Đây là chế độ truyền nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Full duplex|||Song công"
            },
            {
              "text": "Half duplex|||Bán song công"
            },
            {
              "text": "Multicast|||Multicast"
            },
            {
              "text": "Simplex|||Đơn công"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Full duplex lets both sides send at once.<br/>B. Both directions exist, but not at the same moment.<br/>C. Multicast describes who receives, not how the two directions share the medium.<br/>D. Simplex is one direction only.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Song công cho hai bên gửi cùng lúc.<br/>B. Có cả hai chiều nhưng không cùng lúc.<br/>C. Multicast nói về ai nhận, không nói về cách hai chiều dùng chung đường truyền.<br/>D. Đơn công chỉ có một chiều.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Using EUI-64, what is the interface ID built from MAC address 00-1A-2B-3C-4D-5E?</p></div><div class=\"ml-vi\"><p>Dùng EUI-64, interface ID được tạo từ địa chỉ MAC 00-1A-2B-3C-4D-5E là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "021a:2bfe:ff3c:4d5e|||021a:2bfe:ff3c:4d5e"
            },
            {
              "text": "001a:2bff:fe3c:4d5e|||001a:2bff:fe3c:4d5e"
            },
            {
              "text": "001a:2b3c:4d5e:fffe|||001a:2b3c:4d5e:fffe"
            },
            {
              "text": "021a:2bff:fe3c:4d5e|||021a:2bff:fe3c:4d5e"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The inserted bytes are ff then fe, in that order.<br/>B. The seventh bit has not been flipped.<br/>C. fffe goes in the middle of the MAC, not at the end.<br/>D. Insert fffe in the middle and flip the seventh bit, so 00 becomes 02.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Hai byte chèn là ff rồi fe, đúng thứ tự đó.<br/>B. Bit thứ bảy chưa được lật.<br/>C. fffe đặt ở giữa MAC, không phải cuối.<br/>D. Chèn fffe vào giữa và lật bit thứ bảy, nên 00 thành 02.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A brand-new switch has no IP address yet. How do you reach its CLI for the first time?</p></div><div class=\"ml-vi\"><p>Switch mới tinh chưa có địa chỉ IP. Bạn vào CLI của nó lần đầu bằng cách nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Through SSH|||Qua SSH"
            },
            {
              "text": "Through the console port|||Qua cổng console"
            },
            {
              "text": "Through a web browser|||Qua trình duyệt web"
            },
            {
              "text": "Through Telnet|||Qua Telnet"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. SSH needs an IP address and prior configuration.<br/>B. Console access is out-of-band and needs no IP.<br/>C. A browser also needs an IP address.<br/>D. Telnet needs an IP address too.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. SSH cần địa chỉ IP và cấu hình sẵn.<br/>B. Truy cập console là ngoài băng và không cần IP.<br/>C. Trình duyệt cũng cần địa chỉ IP.<br/>D. Telnet cũng cần địa chỉ IP.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which of these is an intermediary device rather than an end device?</p></div><div class=\"ml-vi\"><p>Thiết bị nào dưới đây là thiết bị trung gian chứ không phải thiết bị đầu cuối?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "An Ethernet switch|||Switch Ethernet"
            },
            {
              "text": "A network printer|||Máy in mạng"
            },
            {
              "text": "An IP phone|||Điện thoại IP"
            },
            {
              "text": "A student&#39;s laptop|||Laptop của sinh viên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It forwards other devices&#39; traffic rather than being the source or target of it.<br/>B. A printer is the destination of the data, so it is an end device.<br/>C. It is where a call starts and ends.<br/>D. It is a classic end device.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó chuyển lưu lượng của thiết bị khác chứ không phải nguồn hay đích của lưu lượng đó.<br/>B. Máy in là đích của dữ liệu nên là thiết bị đầu cuối.<br/>C. Cuộc gọi bắt đầu và kết thúc ở đây.<br/>D. Đây là thiết bị đầu cuối điển hình.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does a stateful firewall do that a plain packet filter does not?</p></div><div class=\"ml-vi\"><p>Tường lửa trạng thái (stateful) làm được gì mà bộ lọc gói đơn giản không làm được?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It assigns IP addresses to hosts|||Nó cấp địa chỉ IP cho máy"
            },
            {
              "text": "It replaces every switch in the LAN|||Nó thay mọi switch trong LAN"
            },
            {
              "text": "It tracks connections from inside and allows their replies|||Nó theo dõi kết nối từ bên trong và cho phép gói trả lời"
            },
            {
              "text": "It encrypts all traffic automatically|||Nó tự mã hoá mọi lưu lượng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is DHCP.<br/>B. Firewalls do not do the LAN&#39;s switching.<br/>C. It tracks sessions rather than judging each packet alone.<br/>D. A firewall filters traffic; encryption is a separate function.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là DHCP.<br/>B. Tường lửa không làm việc chuyển mạch của LAN.<br/>C. Nó theo dõi phiên thay vì xét riêng từng gói.<br/>D. Tường lửa lọc lưu lượng; mã hoá là chức năng khác.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which organisation develops the Ethernet (802.3) and Wi-Fi (802.11) standards?</p></div><div class=\"ml-vi\"><p>Tổ chức nào phát triển chuẩn Ethernet (802.3) và Wi-Fi (802.11)?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ICANN|||ICANN"
            },
            {
              "text": "ITU|||ITU"
            },
            {
              "text": "IEEE|||IEEE"
            },
            {
              "text": "IETF|||IETF"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. ICANN coordinates names and number resources.<br/>B. The ITU works on telecommunications and radio standards, but not the 802 family.<br/>C. The 802 family belongs to the IEEE.<br/>D. The IETF publishes RFCs for Internet protocols.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. ICANN điều phối tên miền và tài nguyên số.<br/>B. ITU làm chuẩn viễn thông và vô tuyến, không làm họ 802.<br/>C. Họ chuẩn 802 thuộc về IEEE.<br/>D. IETF công bố RFC cho các giao thức Internet.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A routing protocol sends its updates to 224.0.0.5. Which kind of IPv4 destination is that?</p></div><div class=\"ml-vi\"><p>Một giao thức định tuyến gửi cập nhật tới 224.0.0.5. Đó là loại địa chỉ đích IPv4 nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Multicast|||Multicast"
            },
            {
              "text": "Private unicast|||Unicast riêng"
            },
            {
              "text": "Limited broadcast|||Quảng bá giới hạn"
            },
            {
              "text": "Loopback|||Loopback"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 224.0.0.0 to 239.255.255.255 is reserved for multicast.<br/>B. Private ranges are in 10, 172.16 and 192.168.<br/>C. Limited broadcast is 255.255.255.255.<br/>D. Loopback is 127.0.0.0/8.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 224.0.0.0 đến 239.255.255.255 dành cho multicast.<br/>B. Các dải riêng là 10, 172.16 và 192.168.<br/>C. Quảng bá giới hạn là 255.255.255.255.<br/>D. Loopback là 127.0.0.0/8.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Many laptops at home use 192.168.1.x addresses, yet they all browse the web through one public address. What makes this possible?</p></div><div class=\"ml-vi\"><p>Nhiều laptop ở nhà dùng địa chỉ 192.168.1.x nhưng cùng duyệt web qua một địa chỉ công cộng. Điều gì làm được việc này?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "DNS on the laptops|||DNS trên laptop"
            },
            {
              "text": "NAT on the home router|||NAT trên router gia đình"
            },
            {
              "text": "ARP on the ISP&#39;s router|||ARP trên router của nhà mạng"
            },
            {
              "text": "The Ethernet preamble|||Phần preamble của Ethernet"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. DNS resolves names, not addresses in transit.<br/>B. NAT translates private sources to the public address and tracks each flow.<br/>C. ARP resolves MACs on one link.<br/>D. The preamble only synchronises the receiver.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. DNS phân giải tên, không dịch địa chỉ gói tin.<br/>B. NAT dịch địa chỉ nguồn riêng sang địa chỉ công cộng và theo dõi từng luồng.<br/>C. ARP phân giải MAC trên một chặng.<br/>D. Preamble chỉ giúp đồng bộ bên nhận.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which command correctly assigns an IPv4 address to a Cisco router interface?</p></div><div class=\"ml-vi\"><p>Lệnh nào gán đúng địa chỉ IPv4 cho cổng router Cisco?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "set ip 10.0.0.1 255.255.255.0|||set ip 10.0.0.1 255.255.255.0"
            },
            {
              "text": "ip address 10.0.0.1/24|||ip address 10.0.0.1/24"
            },
            {
              "text": "ipv4 10.0.0.1 mask 24|||ipv4 10.0.0.1 mask 24"
            },
            {
              "text": "ip address 10.0.0.1 255.255.255.0|||ip address 10.0.0.1 255.255.255.0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. This is not an IOS interface command.<br/>B. Prefix notation is accepted for IPv6, not for this IPv4 command.<br/>C. This is not an IOS command.<br/>D. IOS expects the address followed by a dotted-decimal mask.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đây không phải lệnh cấu hình cổng của IOS.<br/>B. Dạng tiền tố dùng cho IPv6, không dùng cho lệnh IPv4 này.<br/>C. Đây không phải lệnh IOS.<br/>D. IOS yêu cầu địa chỉ rồi đến mặt nạ dạng thập phân.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Someone phones a staff member, claims to be from the IT helpdesk and asks for a password to &quot;fix an account&quot;. What kind of attack is this?</p></div><div class=\"ml-vi\"><p>Một người gọi điện cho nhân viên, tự nhận là bộ phận hỗ trợ IT và xin mật khẩu để &quot;sửa tài khoản&quot;. Đây là kiểu tấn công gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ARP spoofing|||Giả mạo ARP"
            },
            {
              "text": "Port scanning|||Quét cổng"
            },
            {
              "text": "Buffer overflow|||Tràn bộ đệm"
            },
            {
              "text": "Social engineering|||Tấn công phi kỹ thuật (social engineering)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That forges Layer 2 mappings.<br/>B. That probes services on a host.<br/>C. That exploits a software bug.<br/>D. The attacker manipulates a person instead of a system.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Kiểu đó giả ánh xạ tầng 2.<br/>B. Kiểu đó dò dịch vụ trên máy.<br/>C. Kiểu đó khai thác lỗi phần mềm.<br/>D. Kẻ tấn công thao túng con người thay vì hệ thống.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Ping from a lab PC gives the result below. What does it tell you?</p><pre><code class=\"language-plaintext\">C:\\&gt; ping 172.31.9.9\nReply from 10.0.0.1: Destination net unreachable.\nReply from 10.0.0.1: Destination net unreachable.</code></pre></div><div class=\"ml-vi\"><p>Ping từ máy trong lab cho kết quả dưới đây. Kết quả đó cho biết điều gì?</p><pre><code class=\"language-plaintext\">C:\\&gt; ping 172.31.9.9\nReply from 10.0.0.1: Destination net unreachable.\nReply from 10.0.0.1: Destination net unreachable.</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The DNS lookup failed|||Tra DNS thất bại"
            },
            {
              "text": "Router 10.0.0.1 has no route to the target network|||Router 10.0.0.1 không có tuyến tới mạng đích"
            },
            {
              "text": "The PC&#39;s Ethernet cable is unplugged|||Cáp Ethernet của máy đã rút"
            },
            {
              "text": "The target host 172.31.9.9 replied normally|||Máy đích 172.31.9.9 trả lời bình thường"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The ping used an IP address.<br/>B. The message comes from the router that gave up, not from the target.<br/>C. A reply came back, so the link works.<br/>D. The reply comes from 10.0.0.1, not from the target.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Ping dùng địa chỉ IP.<br/>B. Thông điệp đến từ router đã bỏ cuộc, không phải từ máy đích.<br/>C. Có trả lời nghĩa là đường truyền vẫn tốt.<br/>D. Trả lời đến từ 10.0.0.1, không phải từ máy đích.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>IPv6 addresses are configured on a router, but hosts on the LAN get no SLAAC prefix and the router does not forward IPv6 packets. Which global command is missing?</p></div><div class=\"ml-vi\"><p>Đã đặt địa chỉ IPv6 trên router, nhưng máy trong LAN không nhận được tiền tố SLAAC và router không chuyển gói IPv6. Thiếu lệnh toàn cục nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ip routing|||ip routing"
            },
            {
              "text": "ipv6 address autoconfig|||ipv6 address autoconfig"
            },
            {
              "text": "ipv6 unicast-routing|||ipv6 unicast-routing"
            },
            {
              "text": "ipv6 enable|||ipv6 enable"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It concerns IPv4 routing.<br/>B. It makes the router itself a SLAAC client.<br/>C. It turns on IPv6 forwarding, and the router then starts sending Router Advertisements.<br/>D. It is an interface command that only creates a link-local address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Lệnh này liên quan định tuyến IPv4.<br/>B. Lệnh này biến chính router thành client SLAAC.<br/>C. Lệnh này bật chuyển gói IPv6, và router bắt đầu gửi Router Advertisement.<br/>D. Đây là lệnh trên cổng, chỉ tạo địa chỉ link-local.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which cable type connects a PC&#39;s serial or USB adapter to a Cisco console port?</p></div><div class=\"ml-vi\"><p>Loại cáp nào nối bộ chuyển serial hoặc USB của máy tính vào cổng console Cisco?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Rollover cable|||Cáp rollover"
            },
            {
              "text": "Crossover UTP|||Cáp UTP chéo"
            },
            {
              "text": "Straight-through UTP|||Cáp UTP thẳng"
            },
            {
              "text": "Coaxial cable|||Cáp đồng trục"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. A console cable is a rollover cable, with pin 1 mapped to pin 8.<br/>B. That connects two similar devices.<br/>C. That connects a PC to a switch.<br/>D. Console ports do not use coaxial cable.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Cáp console là cáp rollover, chân 1 nối sang chân 8.<br/>B. Cáp đó nối hai thiết bị cùng loại.<br/>C. Cáp đó nối máy với switch.<br/>D. Cổng console không dùng cáp đồng trục.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A planner gives 10.0.16.0/21 to one site and 10.0.20.0/22 to another. Why is this a problem?</p></div><div class=\"ml-vi\"><p>Người quy hoạch cấp 10.0.16.0/21 cho một điểm và 10.0.20.0/22 cho điểm khác. Vì sao có vấn đề?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10.0.20.0 is a broadcast address|||10.0.20.0 là địa chỉ quảng bá"
            },
            {
              "text": "The second block lies inside the first|||Khối thứ hai nằm bên trong khối thứ nhất"
            },
            {
              "text": "Private addresses cannot use VLSM|||Địa chỉ riêng không dùng VLSM được"
            },
            {
              "text": "A /22 is smaller than any allowed subnet|||/22 nhỏ hơn mức subnet cho phép"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It is a valid /22 network address.<br/>B. 10.0.16.0/21 runs to 10.0.23.255, which includes 10.0.20.0 to 10.0.23.255.<br/>C. VLSM works with any IPv4 block.<br/>D. /22 is an ordinary size.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là địa chỉ mạng /22 hợp lệ.<br/>B. 10.0.16.0/21 chạy tới 10.0.23.255, bao gồm cả 10.0.20.0 đến 10.0.23.255.<br/>C. VLSM dùng được với mọi khối IPv4.<br/>D. /22 là cỡ bình thường.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>In a small office network, which two devices should normally get static IP addresses? (Choose two.)</p></div><div class=\"ml-vi\"><p>Trong mạng văn phòng nhỏ, hai thiết bị nào thường nên dùng địa chỉ IP tĩnh? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A meeting-room tablet|||Máy bảng phòng họp"
            },
            {
              "text": "Staff laptops|||Laptop của nhân viên"
            },
            {
              "text": "The default gateway router|||Router làm default gateway"
            },
            {
              "text": "A visitor&#39;s phone|||Điện thoại của khách"
            },
            {
              "text": "The file server|||Máy chủ tệp"
            }
          ],
          "correctIndexes": [
            2,
            4
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C, E.</strong><br/>A. It only acts as a client, so DHCP is enough.<br/>B. DHCP makes them easier to manage.<br/>C. Every host&#39;s settings point at it.<br/>D. Guests come and go, so DHCP suits them.<br/>E. Clients must find it at a stable address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C, E.</strong><br/>A. Nó chỉ làm client nên DHCP là đủ.<br/>B. DHCP giúp quản lý chúng dễ hơn.<br/>C. Cấu hình của mọi máy đều trỏ tới nó.<br/>D. Khách đến rồi đi nên DHCP hợp hơn.<br/>E. Máy khách phải tìm nó ở một địa chỉ ổn định.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A host&#39;s last octet is 90 and the mask&#39;s last octet is 224. What is the result of a bitwise AND on those two octets?</p></div><div class=\"ml-vi\"><p>Octet cuối của máy là 90, octet cuối của mặt nạ là 224. Kết quả AND từng bit của hai octet đó là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "90|||90"
            },
            {
              "text": "224|||224"
            },
            {
              "text": "64|||64"
            },
            {
              "text": "96|||96"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That keeps the host value unchanged.<br/>B. That is the mask itself.<br/>C. 01011010 AND 11100000 = 01000000 = 64.<br/>D. 96 is the next network boundary, not the AND result.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Như vậy là giữ nguyên giá trị của máy.<br/>B. Đó chính là mặt nạ.<br/>C. 01011010 AND 11100000 = 01000000 = 64.<br/>D. 96 là ranh giới mạng kế tiếp, không phải kết quả AND.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A router has both enable password and enable secret configured with different values. Which one does it accept at the enable prompt?</p></div><div class=\"ml-vi\"><p>Router có cả enable password và enable secret với hai giá trị khác nhau. Nó nhận giá trị nào ở dấu nhắc enable?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Neither, the commands cancel each other|||Không giá trị nào, hai lệnh triệt tiêu nhau"
            },
            {
              "text": "Either value|||Giá trị nào cũng được"
            },
            {
              "text": "The enable password value only|||Chỉ giá trị enable password"
            },
            {
              "text": "The enable secret value only|||Chỉ giá trị enable secret"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. They do not cancel out.<br/>B. Only one is accepted.<br/>C. The older plain command is ignored once a secret exists.<br/>D. When both exist, the secret takes priority.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Hai lệnh không triệt tiêu nhau.<br/>B. Chỉ một giá trị được chấp nhận.<br/>C. Lệnh cũ dạng rõ bị bỏ qua khi đã có secret.<br/>D. Khi có cả hai, secret được ưu tiên.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
