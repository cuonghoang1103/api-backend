// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-NWC204-TS-FE2.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "NWC204"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE2",
      "title": "NWC204 — Practice Final 2 (self-composed)|||NWC204 — Đề luyện cuối kỳ 2 (tự soạn theo dạng đề)",
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
          "prompt": "<div class=\"ml-en\"><p>Which IPv6 header field does the same job as the IPv4 TTL field?</p></div><div class=\"ml-vi\"><p>Trường nào trong phần đầu IPv6 làm cùng việc với trường TTL của IPv4?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Hop Limit|||Hop Limit"
            },
            {
              "text": "Next Header|||Next Header"
            },
            {
              "text": "Flow Label|||Flow Label"
            },
            {
              "text": "Traffic Class|||Traffic Class"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It is decreased by each router, and the packet dies at zero.<br/>B. It names what follows, like the IPv4 Protocol field.<br/>C. It groups packets of a flow.<br/>D. It carries priority marking.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mỗi router giảm trường này, về 0 thì gói bị bỏ.<br/>B. Trường này cho biết phần tiếp theo, giống trường Protocol của IPv4.<br/>C. Trường này nhóm các gói cùng luồng.<br/>D. Trường này mang đánh dấu ưu tiên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>You arrive at an unfamiliar closet and want to see which Cisco devices are directly attached to a switch, without knowing their IP addresses. Which command helps?</p></div><div class=\"ml-vi\"><p>Bạn đến một tủ mạng lạ và muốn biết thiết bị Cisco nào nối trực tiếp với switch mà chưa biết IP của chúng. Lệnh nào giúp được?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "show version|||show version"
            },
            {
              "text": "show cdp neighbors|||show cdp neighbors"
            },
            {
              "text": "show clock|||show clock"
            },
            {
              "text": "show ip route|||show ip route"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It describes the local device.<br/>B. CDP is a Layer 2 protocol that reports directly attached Cisco devices.<br/>C. It shows the time.<br/>D. It shows routes, and Layer 2 switches do not route.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Lệnh này mô tả thiết bị đang đứng.<br/>B. CDP là giao thức tầng 2 báo các thiết bị Cisco nối trực tiếp.<br/>C. Lệnh này hiện thời gian.<br/>D. Lệnh này hiện tuyến, mà switch tầng 2 không định tuyến.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which protocol do Windows computers normally use to share files and printers on a LAN?</p></div><div class=\"ml-vi\"><p>Máy Windows thường dùng giao thức nào để chia sẻ tệp và máy in trong LAN?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "ICMP|||ICMP"
            },
            {
              "text": "SMB|||SMB"
            },
            {
              "text": "DHCP|||DHCP"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. SMTP sends email.<br/>B. ICMP carries error and test messages.<br/>C. Server Message Block handles shared files and printers.<br/>D. DHCP hands out addresses.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. SMTP gửi email.<br/>B. ICMP mang thông điệp lỗi và kiểm tra.<br/>C. Server Message Block lo việc chia sẻ tệp và máy in.<br/>D. DHCP cấp địa chỉ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which WAN topology gives the most redundancy, at the highest cost?</p></div><div class=\"ml-vi\"><p>Tô-pô WAN nào có độ dự phòng cao nhất với chi phí cao nhất?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Hub-and-spoke|||Hub-and-spoke"
            },
            {
              "text": "Bus|||Bus"
            },
            {
              "text": "Point-to-point|||Điểm-điểm"
            },
            {
              "text": "Full mesh|||Mesh đầy đủ (full mesh)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. All sites depend on one hub, which is a single point of failure.<br/>B. A bus is an old LAN layout with no redundancy.<br/>C. A single link has no alternative path.<br/>D. Every site links directly to every other, so many paths exist.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Mọi điểm phụ thuộc một hub, đó là điểm hỏng duy nhất.<br/>B. Bus là kiểu LAN cũ, không có dự phòng.<br/>C. Một đường duy nhất thì không có đường thay thế.<br/>D. Mọi điểm nối thẳng với nhau nên có rất nhiều đường đi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which two statements about the addresses ff02::1 and ff02::2 are correct? (Choose two.)</p></div><div class=\"ml-vi\"><p>Hai phát biểu nào về địa chỉ ff02::1 và ff02::2 là đúng? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Both can be used as a host&#39;s source address|||Cả hai dùng được làm địa chỉ nguồn của máy"
            },
            {
              "text": "ff02::1 reaches all IPv6 nodes on the link|||ff02::1 tới mọi nút IPv6 trên chặng"
            },
            {
              "text": "Routers forward both across the Internet|||Router chuyển cả hai ra Internet"
            },
            {
              "text": "ff02::2 reaches all IPv6 routers on the link|||ff02::2 tới mọi router IPv6 trên chặng"
            },
            {
              "text": "Both are global unicast addresses|||Cả hai đều là global unicast"
            }
          ],
          "correctIndexes": [
            1,
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B, D.</strong><br/>A. A multicast address cannot be a source.<br/>B. This is the all-nodes group.<br/>C. ff02 means link-local scope.<br/>D. This is the all-routers group.<br/>E. The ff prefix means multicast.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B, D.</strong><br/>A. Địa chỉ multicast không được làm nguồn.<br/>B. Đây là nhóm tất cả các nút.<br/>C. ff02 có phạm vi link-local.<br/>D. Đây là nhóm tất cả router.<br/>E. Tiền tố ff nghĩa là multicast.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A router receives a 1500-byte IPv4 packet with the Don&#39;t Fragment bit clear. The next link has an MTU of 1400. What happens?</p></div><div class=\"ml-vi\"><p>Router nhận gói IPv4 1500 byte, bit Don&#39;t Fragment đang tắt. Chặng kế có MTU 1400. Điều gì xảy ra?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The router drops it and sends Time Exceeded|||Router bỏ gói và gửi Time Exceeded"
            },
            {
              "text": "The router sends it unchanged|||Router gửi nguyên gói"
            },
            {
              "text": "The router converts it to IPv6|||Router đổi gói sang IPv6"
            },
            {
              "text": "The router fragments the packet|||Router phân mảnh gói tin"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Time Exceeded relates to TTL.<br/>B. It is too large for that link.<br/>C. Routers do not do this as part of forwarding.<br/>D. IPv4 routers may fragment when DF is clear.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Time Exceeded liên quan đến TTL.<br/>B. Gói quá lớn so với chặng đó.<br/>C. Router không làm việc này khi chuyển gói.<br/>D. Router IPv4 được phân mảnh khi bit DF tắt.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why are the wires inside UTP cable twisted into pairs?</p></div><div class=\"ml-vi\"><p>Vì sao các sợi dây trong cáp UTP được xoắn thành từng đôi?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "To cancel crosstalk and outside interference|||Để triệt nhiễu xuyên âm và nhiễu bên ngoài"
            },
            {
              "text": "To make the cable stronger when pulled|||Để cáp chắc hơn khi kéo"
            },
            {
              "text": "To let one pair reach 10 km|||Để một đôi dây đi được 10 km"
            },
            {
              "text": "To carry light signals|||Để truyền tín hiệu ánh sáng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Twisting balances the magnetic fields, which cancels noise.<br/>B. Strength is not the reason for the twist.<br/>C. UTP is limited to about 100 m.<br/>D. UTP carries electrical signals.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Xoắn dây làm cân bằng từ trường, nhờ đó triệt nhiễu.<br/>B. Độ bền không phải lý do xoắn dây.<br/>C. UTP chỉ đi khoảng 100 m.<br/>D. UTP truyền tín hiệu điện.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>You borrow 6 bits from the host part of a /16 network. How many subnets do you get, and how many usable hosts in each?</p></div><div class=\"ml-vi\"><p>Bạn mượn 6 bit từ phần máy của mạng /16. Bạn có bao nhiêu subnet và mỗi subnet có bao nhiêu máy dùng được?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "64 subnets, 254 hosts|||64 subnet, 254 máy"
            },
            {
              "text": "62 subnets, 1024 hosts|||62 subnet, 1024 máy"
            },
            {
              "text": "64 subnets, 1022 hosts|||64 subnet, 1022 máy"
            },
            {
              "text": "6 subnets, 1022 hosts|||6 subnet, 1022 máy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. 254 hosts belongs to a /24.<br/>B. This subtracts 2 from the wrong number.<br/>C. 2^6 = 64 subnets; 10 host bits remain, and 2^10 - 2 = 1022.<br/>D. The subnet count is 2 to the power of the borrowed bits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. 254 máy là của /24.<br/>B. Cách này trừ 2 nhầm chỗ.<br/>C. 2^6 = 64 subnet; còn 10 bit máy, 2^10 - 2 = 1022.<br/>D. Số subnet là 2 mũ số bit mượn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which switching method reads the whole frame and checks its FCS before forwarding?</p></div><div class=\"ml-vi\"><p>Phương pháp chuyển mạch nào đọc hết khung và kiểm FCS trước khi chuyển đi?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Fragment-free|||Fragment-free"
            },
            {
              "text": "Store-and-forward|||Lưu rồi chuyển (store-and-forward)"
            },
            {
              "text": "Flooding|||Phát tràn"
            },
            {
              "text": "Cut-through|||Cắt ngang (cut-through)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It checks only the first 64 bytes.<br/>B. It buffers the whole frame, so bad frames are dropped.<br/>C. Flooding is what happens with an unknown destination, not a way to check frames.<br/>D. It starts forwarding once it reads the destination MAC.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Nó chỉ kiểm 64 byte đầu.<br/>B. Nó lưu toàn bộ khung nên khung hỏng bị bỏ.<br/>C. Phát tràn là cách xử lý đích chưa biết, không phải cách kiểm khung.<br/>D. Nó bắt đầu chuyển ngay khi đọc xong MAC đích.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>An engineer wants the VTY lines of a switch to accept SSH and refuse Telnet. Which line configuration command does this?</p></div><div class=\"ml-vi\"><p>Kỹ sư muốn đường VTY của switch nhận SSH và từ chối Telnet. Lệnh cấu hình line nào làm được việc này?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "transport input ssh|||transport input ssh"
            },
            {
              "text": "exec-timeout 5 0|||exec-timeout 5 0"
            },
            {
              "text": "login local|||login local"
            },
            {
              "text": "ip ssh version 2|||ip ssh version 2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It limits incoming VTY sessions to SSH only.<br/>B. It logs out idle sessions after five minutes.<br/>C. It selects where usernames are checked.<br/>D. It selects the SSH version, but Telnet stays allowed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Lệnh này giới hạn phiên VTY đi vào chỉ còn SSH.<br/>B. Lệnh này đăng xuất phiên nhàn rỗi sau năm phút.<br/>C. Lệnh này chọn nơi kiểm tra tên người dùng.<br/>D. Lệnh này chọn phiên bản SSH, Telnet vẫn được phép.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does a successful ping 127.0.0.1 prove?</p></div><div class=\"ml-vi\"><p>Ping 127.0.0.1 thành công chứng tỏ điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The cable is plugged in|||Cáp đang được cắm"
            },
            {
              "text": "DNS is working|||DNS đang chạy"
            },
            {
              "text": "The default gateway is reachable|||Default gateway liên lạc được"
            },
            {
              "text": "The local TCP/IP stack is working|||Chồng TCP/IP của máy đang hoạt động"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Loopback works even with no cable.<br/>B. No name is resolved here.<br/>C. No packet leaves the host, so this is not tested.<br/>D. Loopback traffic never leaves the host.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Loopback chạy cả khi không cắm cáp.<br/>B. Không có tên miền nào được phân giải ở đây.<br/>C. Không gói nào rời máy nên điều này chưa được kiểm.<br/>D. Lưu lượng loopback không rời khỏi máy.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A technician enters the commands below, but PCs on that LAN still cannot ping the router. What is missing?</p><pre><code class=\"language-plaintext\">R1(config)# interface g0/0\nR1(config-if)# ip address 192.168.1.1 255.255.255.0\nR1(config-if)# exit</code></pre></div><div class=\"ml-vi\"><p>Kỹ thuật viên nhập các lệnh dưới đây nhưng máy trong LAN đó vẫn không ping được router. Thiếu gì?</p><pre><code class=\"language-plaintext\">R1(config)# interface g0/0\nR1(config-if)# ip address 192.168.1.1 255.255.255.0\nR1(config-if)# exit</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A static route to 192.168.1.0/24|||Một tuyến tĩnh tới 192.168.1.0/24"
            },
            {
              "text": "no shutdown on the interface|||Lệnh no shutdown trên cổng"
            },
            {
              "text": "ip default-gateway on the router|||Lệnh ip default-gateway trên router"
            },
            {
              "text": "copy running-config startup-config|||copy running-config startup-config"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A connected network needs no static route once the interface is up.<br/>B. Router interfaces are shut down by default.<br/>C. That command is for Layer 2 switches.<br/>D. Saving does not bring an interface up.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Mạng nối trực tiếp không cần tuyến tĩnh khi cổng đã bật.<br/>B. Cổng router mặc định đang tắt.<br/>C. Lệnh đó dành cho switch tầng 2.<br/>D. Lưu cấu hình không làm cổng bật lên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which is the full form of 2001:db8:a::1f?</p></div><div class=\"ml-vi\"><p>Dạng đầy đủ của 2001:db8:a::1f là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2001:0db8:a000:0000:0000:0000:0000:1f00|||2001:0db8:a000:0000:0000:0000:0000:1f00"
            },
            {
              "text": "2001:0db8:000a:0000:001f|||2001:0db8:000a:0000:001f"
            },
            {
              "text": "2001:0db8:000a:0000:0000:0000:0000:001f|||2001:0db8:000a:0000:0000:0000:0000:001f"
            },
            {
              "text": "2001:0db8:000a:0000:0000:0000:001f:0000|||2001:0db8:000a:0000:0000:0000:001f:0000"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Zeros are restored on the left of a group, not on the right.<br/>B. This has only five groups.<br/>C. :: fills in the missing groups so there are eight in total.<br/>D. The last group must be 001f, with nothing after it.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Số 0 được thêm vào bên trái nhóm, không phải bên phải.<br/>B. Dạng này chỉ có năm nhóm.<br/>C. :: bù các nhóm còn thiếu cho đủ tám nhóm.<br/>D. Nhóm cuối phải là 001f, không có gì sau nó.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Convert the binary octet 10110110 to decimal.</p></div><div class=\"ml-vi\"><p>Đổi octet nhị phân 10110110 sang thập phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "182|||182"
            },
            {
              "text": "178|||178"
            },
            {
              "text": "214|||214"
            },
            {
              "text": "186|||186"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 128 + 32 + 16 + 4 + 2 = 182.<br/>B. That is 10110010, without the 4.<br/>C. That is 11010110.<br/>D. That is 10111010.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 128 + 32 + 16 + 4 + 2 = 182.<br/>B. Đó là 10110010, thiếu phần 4.<br/>C. Đó là 11010110.<br/>D. Đó là 10111010.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is decimal 230 in hexadecimal?</p></div><div class=\"ml-vi\"><p>Số thập phân 230 viết ở hệ thập lục phân là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "D6|||D6"
            },
            {
              "text": "F6|||F6"
            },
            {
              "text": "E8|||E8"
            },
            {
              "text": "E6|||E6"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. D6 equals 214.<br/>B. F6 equals 246.<br/>C. E8 equals 232.<br/>D. 230 = 14 x 16 + 6, and 14 is written E.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. D6 bằng 214.<br/>B. F6 bằng 246.<br/>C. E8 bằng 232.<br/>D. 230 = 14 x 16 + 6, và 14 viết là E.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A receiver gets TCP data bytes 1-1000, 1001-2000 and then 3001-4000. Bytes 2001-3000 are missing. Which acknowledgment number does it send?</p></div><div class=\"ml-vi\"><p>Bên nhận có các byte TCP 1-1000, 1001-2000 rồi 3001-4000. Các byte 2001-3000 bị thiếu. Bên nhận gửi số xác nhận nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3001|||3001"
            },
            {
              "text": "2001|||2001"
            },
            {
              "text": "2000|||2000"
            },
            {
              "text": "4001|||4001"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. 3001 has arrived but the gap before it has not been filled.<br/>B. TCP acknowledges the next byte it expects, and that is the first missing byte.<br/>C. The number names the next expected byte, not the last byte received.<br/>D. That would claim that everything up to 4000 arrived.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. 3001 đã đến nhưng khoảng trống trước nó chưa được lấp.<br/>B. TCP xác nhận byte kế tiếp đang chờ, tức byte đầu tiên bị thiếu.<br/>C. Con số này chỉ byte đang chờ, không phải byte cuối đã nhận.<br/>D. Như vậy là khẳng định đã nhận đủ tới 4000.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>How long is an IPv6 address, and how long is each hextet?</p></div><div class=\"ml-vi\"><p>Địa chỉ IPv6 dài bao nhiêu bit, và mỗi hextet dài bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "128 bits, 8 bits|||128 bit, 8 bit"
            },
            {
              "text": "32 bits, 8 bits|||32 bit, 8 bit"
            },
            {
              "text": "128 bits, 16 bits|||128 bit, 16 bit"
            },
            {
              "text": "64 bits, 16 bits|||64 bit, 16 bit"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. A hextet holds four hex digits, which is 16 bits.<br/>B. That describes IPv4.<br/>C. Eight groups of 16 bits make 128 bits.<br/>D. 64 bits is the usual interface ID, not the whole address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Mỗi hextet có bốn chữ số hex, tức 16 bit.<br/>B. Đó là mô tả của IPv4.<br/>C. Tám nhóm 16 bit tạo thành 128 bit.<br/>D. 64 bit là phần interface ID thường gặp, không phải cả địa chỉ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which layer of the TCP/IP model covers the functions of OSI Layers 1 and 2?</p></div><div class=\"ml-vi\"><p>Tầng nào của mô hình TCP/IP gồm chức năng của tầng 1 và tầng 2 OSI?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Application layer|||Tầng ứng dụng"
            },
            {
              "text": "Internet layer|||Tầng Internet"
            },
            {
              "text": "Transport layer|||Tầng giao vận"
            },
            {
              "text": "Network access layer|||Tầng truy cập mạng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It maps to OSI Layers 5 to 7.<br/>B. It maps to OSI Layer 3.<br/>C. It maps to OSI Layer 4.<br/>D. It handles both the medium and framing on a link.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Tầng này ứng với tầng 5 đến 7 OSI.<br/>B. Tầng này ứng với tầng 3 OSI.<br/>C. Tầng này ứng với tầng 4 OSI.<br/>D. Tầng này lo cả môi trường truyền lẫn đóng khung trên một chặng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A server runs a web service and an SSH service on one IP address. What lets incoming data reach the right program?</p></div><div class=\"ml-vi\"><p>Máy chủ chạy dịch vụ web và SSH trên cùng một địa chỉ IP. Thứ gì giúp dữ liệu đi vào đến đúng chương trình?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The destination port number|||Số cổng đích"
            },
            {
              "text": "The subnet mask|||Mặt nạ mạng"
            },
            {
              "text": "The MAC address|||Địa chỉ MAC"
            },
            {
              "text": "The TTL value|||Giá trị TTL"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Ports identify the process on a host.<br/>B. The mask separates network and host parts of an address.<br/>C. The MAC only gets the frame to the network card.<br/>D. TTL limits the packet&#39;s life.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Cổng xác định tiến trình trên một máy.<br/>B. Mặt nạ tách phần mạng và phần máy của địa chỉ.<br/>C. MAC chỉ đưa khung tới card mạng.<br/>D. TTL giới hạn đời của gói tin.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A shop adds a second Internet line, and traffic moves to it automatically when the first line fails. Which network quality does this improve?</p></div><div class=\"ml-vi\"><p>Một cửa hàng thêm đường Internet thứ hai, lưu lượng tự chuyển sang đó khi đường đầu hỏng. Điều này cải thiện đặc tính nào của mạng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Quality of Service|||Chất lượng dịch vụ (QoS)"
            },
            {
              "text": "Fault tolerance|||Khả năng chịu lỗi"
            },
            {
              "text": "Scalability|||Khả năng mở rộng"
            },
            {
              "text": "Confidentiality|||Tính bí mật"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. QoS prioritises traffic when a link is busy.<br/>B. Redundant paths keep the service alive when one part fails.<br/>C. Scalability is about growing without redesign.<br/>D. Confidentiality keeps data private.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. QoS ưu tiên lưu lượng khi đường truyền bận.<br/>B. Đường dự phòng giữ dịch vụ sống khi một phần hỏng.<br/>C. Mở rộng là việc lớn lên mà không phải thiết kế lại.<br/>D. Tính bí mật giữ dữ liệu riêng tư.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which kind of malware spreads by itself across a network, without needing a host file or a user&#39;s click?</p></div><div class=\"ml-vi\"><p>Loại mã độc nào tự lây qua mạng, không cần tệp chủ hay cú nhấp của người dùng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Trojan horse|||Ngựa Trojan"
            },
            {
              "text": "Virus|||Virus"
            },
            {
              "text": "Worm|||Sâu máy tính (worm)"
            },
            {
              "text": "Spyware|||Phần mềm gián điệp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. A Trojan pretends to be useful software and relies on the user to run it.<br/>B. A virus attaches to a file and needs that file to be run.<br/>C. A worm copies itself by exploiting vulnerable systems.<br/>D. Spyware collects information and does not spread by itself.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Trojan giả làm phần mềm hữu ích và dựa vào người dùng chạy nó.<br/>B. Virus bám vào tệp và cần tệp đó được chạy.<br/>C. Worm tự sao chép bằng cách khai thác hệ thống có lỗ hổng.<br/>D. Phần mềm gián điệp thu thập thông tin, không tự lây.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>In AAA, which part records what commands an administrator ran and when?</p></div><div class=\"ml-vi\"><p>Trong AAA, phần nào ghi lại quản trị viên đã chạy lệnh gì và lúc nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Authorization|||Authorization (cấp quyền)"
            },
            {
              "text": "Availability|||Availability (sẵn sàng)"
            },
            {
              "text": "Authentication|||Authentication (xác thực)"
            },
            {
              "text": "Accounting|||Accounting (kiểm toán)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It decides what the user may do.<br/>B. This belongs to the CIA triad, not AAA.<br/>C. It proves who the user is.<br/>D. It keeps a record of actions for later review.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Phần này quyết định người dùng được làm gì.<br/>B. Đây thuộc bộ ba CIA, không thuộc AAA.<br/>C. Phần này chứng minh người dùng là ai.<br/>D. Phần này lưu lại hành động để xem lại sau.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A PC cannot reach any website. In what order should you test, from nearest to farthest?</p></div><div class=\"ml-vi\"><p>Một máy không vào được web nào. Nên kiểm theo thứ tự nào, từ gần đến xa?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "DNS, remote host, gateway, loopback|||DNS, máy ở xa, gateway, loopback"
            },
            {
              "text": "Gateway, loopback, remote host, own IP|||Gateway, loopback, máy ở xa, IP của máy"
            },
            {
              "text": "Loopback, own IP, default gateway, remote host|||Loopback, IP của máy, default gateway, máy ở xa"
            },
            {
              "text": "Remote host, DNS, loopback, gateway|||Máy ở xa, DNS, loopback, gateway"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This goes from far to near.<br/>B. This jumps around and is not the nearest-first order.<br/>C. Each step proves one more part of the path.<br/>D. Starting far away tells you little when it fails.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Thứ tự này đi từ xa về gần.<br/>B. Thứ tự này nhảy lung tung, không phải từ gần đến xa.<br/>C. Mỗi bước chứng minh thêm một đoạn đường.<br/>D. Bắt đầu từ xa thì khi lỗi cũng biết rất ít.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What do the first three bytes of a MAC address identify?</p></div><div class=\"ml-vi\"><p>Ba byte đầu của địa chỉ MAC cho biết điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The VLAN the device belongs to|||VLAN mà thiết bị thuộc về"
            },
            {
              "text": "The vendor, through the OUI|||Hãng sản xuất, qua mã OUI"
            },
            {
              "text": "The speed of the port|||Tốc độ của cổng"
            },
            {
              "text": "The IPv4 network|||Mạng IPv4"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. VLAN membership is not encoded in the MAC.<br/>B. The IEEE assigns the Organizationally Unique Identifier.<br/>C. Speed is negotiated, not stored in the address.<br/>D. MAC and IP addresses are independent.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Thông tin VLAN không nằm trong MAC.<br/>B. IEEE cấp mã Organizationally Unique Identifier.<br/>C. Tốc độ được thương lượng, không ghi trong địa chỉ.<br/>D. MAC và IP độc lập với nhau.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which well-known port does DNS use?</p></div><div class=\"ml-vi\"><p>DNS dùng cổng phổ biến nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "53|||53"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "110|||110"
            },
            {
              "text": "143|||143"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. DNS uses port 53 on UDP and TCP.<br/>B. That is SMTP.<br/>C. That is POP3.<br/>D. That is IMAP.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. DNS dùng cổng 53 trên UDP và TCP.<br/>B. Đó là SMTP.<br/>C. Đó là POP3.<br/>D. Đó là IMAP.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Where does a Cisco device keep the running configuration while it is powered on?</p></div><div class=\"ml-vi\"><p>Thiết bị Cisco giữ running-config ở đâu khi đang bật nguồn?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Flash|||Flash"
            },
            {
              "text": "NVRAM|||NVRAM"
            },
            {
              "text": "RAM|||RAM"
            },
            {
              "text": "ROM|||ROM"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Flash holds the IOS image.<br/>B. NVRAM holds the startup configuration.<br/>C. It is volatile, so it disappears on reload unless saved.<br/>D. ROM holds bootstrap code.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Flash giữ tệp IOS.<br/>B. NVRAM giữ startup-config.<br/>C. RAM mất dữ liệu khi tắt nên cấu hình biến mất nếu chưa lưu.<br/>D. ROM giữ mã khởi động.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Halfway through a Cisco command you forget what comes next. Which key shows the options available at that point?</p></div><div class=\"ml-vi\"><p>Đang gõ dở một lệnh Cisco thì bạn quên phần tiếp theo. Phím nào hiện các lựa chọn có thể gõ ở chỗ đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Ctrl+Z|||Ctrl+Z"
            },
            {
              "text": "?|||?"
            },
            {
              "text": "Esc|||Esc"
            },
            {
              "text": "Ctrl+C|||Ctrl+C"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It returns you to privileged EXEC mode.<br/>B. Context-sensitive help lists what can be typed next.<br/>C. Used alone at the prompt, it does not show help.<br/>D. It aborts the current command.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phím này đưa bạn về chế độ EXEC đặc quyền.<br/>B. Trợ giúp theo ngữ cảnh liệt kê những gì có thể gõ tiếp.<br/>C. Dùng một mình ở dấu nhắc, phím này không hiện trợ giúp.<br/>D. Phím này huỷ lệnh đang gõ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>An apartment receives always-on broadband over the same copper pair as its landline telephone. Which access technology is this?</p></div><div class=\"ml-vi\"><p>Một căn hộ nhận Internet băng rộng luôn bật qua chính đôi dây đồng của điện thoại bàn. Đây là công nghệ truy cập nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Cellular|||Di động"
            },
            {
              "text": "Cable Internet|||Internet cáp truyền hình"
            },
            {
              "text": "Satellite|||Vệ tinh"
            },
            {
              "text": "DSL|||DSL"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Cellular runs over mobile towers.<br/>B. Cable uses the coaxial TV network.<br/>C. Satellite uses a dish and needs no telephone pair.<br/>D. DSL uses higher frequencies on the telephone pair, so voice and data share the line.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Di động chạy qua trạm phát sóng.<br/>B. Internet cáp dùng mạng đồng trục truyền hình.<br/>C. Vệ tinh dùng chảo thu và không cần đôi dây điện thoại.<br/>D. DSL dùng tần số cao trên đôi dây điện thoại nên thoại và dữ liệu đi chung đường dây.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which command shows the ARP cache on a Windows PC?</p></div><div class=\"ml-vi\"><p>Lệnh nào hiện ARP cache trên máy Windows?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "arp -a|||arp -a"
            },
            {
              "text": "nslookup|||nslookup"
            },
            {
              "text": "ipconfig /all|||ipconfig /all"
            },
            {
              "text": "tracert|||tracert"
            },
            {
              "text": "netstat -r|||netstat -r"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It lists known IP-to-MAC mappings.<br/>B. It queries DNS.<br/>C. It shows the host&#39;s own settings.<br/>D. It shows the path to a destination.<br/>E. It shows the routing table.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Lệnh này liệt kê các ánh xạ IP sang MAC đã biết.<br/>B. Lệnh này truy vấn DNS.<br/>C. Lệnh này hiện cấu hình của chính máy.<br/>D. Lệnh này hiện đường đi tới đích.<br/>E. Lệnh này hiện bảng định tuyến.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>One end of a patch cable is wired T568A and the other end T568B. What kind of cable is this?</p></div><div class=\"ml-vi\"><p>Một đầu dây nhảy bấm theo T568A, đầu kia theo T568B. Đây là loại cáp gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Crossover|||Cáp chéo"
            },
            {
              "text": "Straight-through|||Cáp thẳng"
            },
            {
              "text": "Rollover|||Cáp rollover"
            },
            {
              "text": "Coaxial|||Cáp đồng trục"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Different standards at each end swap the transmit and receive pairs.<br/>B. A straight-through cable uses the same standard at both ends.<br/>C. A rollover cable reverses all eight pins and is used for console access.<br/>D. Coaxial cable has a single centre conductor and no T568 wiring.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Hai chuẩn khác nhau ở hai đầu làm đảo đôi gửi và đôi nhận.<br/>B. Cáp thẳng dùng cùng một chuẩn ở hai đầu.<br/>C. Cáp rollover đảo cả tám chân, dùng cho cổng console.<br/>D. Cáp đồng trục có một lõi giữa và không bấm theo T568.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A router has no route for a packet and no default route. What does it send back to the source?</p></div><div class=\"ml-vi\"><p>Router không có tuyến cho một gói tin và cũng không có tuyến mặc định. Nó gửi gì về nguồn?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ICMP Time Exceeded|||ICMP Time Exceeded"
            },
            {
              "text": "ICMP Destination Unreachable|||ICMP Destination Unreachable"
            },
            {
              "text": "ICMP Echo Reply|||ICMP Echo Reply"
            },
            {
              "text": "A TCP reset|||Một TCP reset"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. This is sent when TTL reaches zero.<br/>B. This tells the source that the packet cannot be delivered.<br/>C. This answers a ping.<br/>D. Routers do not reset TCP sessions they merely forward.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Thông điệp này gửi khi TTL về 0.<br/>B. Thông điệp này báo cho nguồn biết gói không giao được.<br/>C. Thông điệp này trả lời ping.<br/>D. Router không reset phiên TCP mà nó chỉ chuyển tiếp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which TCP header field lets a slow receiver tell the sender how much data it can accept?</p></div><div class=\"ml-vi\"><p>Trường nào trong phần đầu TCP giúp bên nhận chậm báo cho bên gửi biết nó còn nhận thêm được bao nhiêu dữ liệu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Urgent pointer|||Urgent pointer"
            },
            {
              "text": "Sequence number|||Sequence number"
            },
            {
              "text": "Source port|||Source port"
            },
            {
              "text": "Window size|||Window size"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It marks urgent data.<br/>B. It numbers the data being sent.<br/>C. It identifies the sending process.<br/>D. This is how TCP does flow control.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Trường này đánh dấu dữ liệu khẩn.<br/>B. Trường này đánh số dữ liệu gửi đi.<br/>C. Trường này cho biết tiến trình gửi.<br/>D. Đây là cách TCP điều khiển luồng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A server&#39;s netstat output contains the lines below. What can you conclude?</p><pre><code class=\"language-plaintext\">Proto  Local Address      Foreign Address      State\ntcp    0.0.0.0:22         0.0.0.0:*            LISTEN\ntcp    10.0.0.5:22        203.0.113.9:50122    ESTABLISHED</code></pre></div><div class=\"ml-vi\"><p>Kết quả netstat trên máy chủ có các dòng dưới đây. Bạn kết luận được gì?</p><pre><code class=\"language-plaintext\">Proto  Local Address      Foreign Address      State\ntcp    0.0.0.0:22         0.0.0.0:*            LISTEN\ntcp    10.0.0.5:22        203.0.113.9:50122    ESTABLISHED</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The server itself is a client of 203.0.113.9 on port 22|||Chính máy chủ là client của 203.0.113.9 ở cổng 22"
            },
            {
              "text": "Only UDP traffic is allowed|||Chỉ cho phép lưu lượng UDP"
            },
            {
              "text": "A service listens on port 22 and has one client connected|||Một dịch vụ đang chờ ở cổng 22 và có một client đang nối vào"
            },
            {
              "text": "Port 22 is closed|||Cổng 22 đang đóng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Port 22 is the local side, so the server is the one being reached.<br/>B. Both lines are TCP.<br/>C. LISTEN means waiting for connections and ESTABLISHED means an active session.<br/>D. A closed port would not appear as LISTEN.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Cổng 22 ở phía cục bộ nên máy chủ là bên được gọi tới.<br/>B. Cả hai dòng đều là TCP.<br/>C. LISTEN nghĩa là đang chờ kết nối, ESTABLISHED nghĩa là có phiên đang hoạt động.<br/>D. Cổng đóng thì không hiện LISTEN.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A /24 network must be split into at least 6 equal subnets, each as large as possible. How many usable hosts does each subnet have?</p></div><div class=\"ml-vi\"><p>Mạng /24 phải chia thành ít nhất 6 subnet bằng nhau, mỗi subnet càng lớn càng tốt. Mỗi subnet có bao nhiêu máy dùng được?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "30|||30"
            },
            {
              "text": "62|||62"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "42|||42"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 6 subnets need 3 borrowed bits, giving /27 with 30 hosts.<br/>B. /26 gives only 4 subnets.<br/>C. /28 gives 16 subnets, more than needed, so each is smaller than necessary.<br/>D. Subnet sizes come from powers of 2; 256 / 6 does not work.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 6 subnet cần mượn 3 bit, ra /27 với 30 máy.<br/>B. /26 chỉ cho 4 subnet.<br/>C. /28 cho 16 subnet, nhiều hơn cần thiết nên mỗi subnet nhỏ hơn mức có thể.<br/>D. Cỡ subnet là luỹ thừa của 2; không chia 256 / 6 được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which address can be assigned to a host in the subnet 10.1.8.0/22?</p></div><div class=\"ml-vi\"><p>Địa chỉ nào gán được cho một máy trong subnet 10.1.8.0/22?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10.1.12.1|||10.1.12.1"
            },
            {
              "text": "10.1.8.0|||10.1.8.0"
            },
            {
              "text": "10.1.10.200|||10.1.10.200"
            },
            {
              "text": "10.1.11.255|||10.1.11.255"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That belongs to the next block.<br/>B. That is the network address.<br/>C. /22 makes blocks of 4, so this subnet covers 10.1.8.0 to 10.1.11.255.<br/>D. That is the broadcast address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Địa chỉ này thuộc khối kế tiếp.<br/>B. Đó là địa chỉ mạng.<br/>C. /22 tạo khối 4 nên subnet này phủ từ 10.1.8.0 đến 10.1.11.255.<br/>D. Đó là địa chỉ quảng bá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why is a large file split into many small pieces instead of being sent as one long stream?</p></div><div class=\"ml-vi\"><p>Vì sao một tệp lớn được chia thành nhiều mảnh nhỏ thay vì gửi thành một luồng dài?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Splitting removes the need for error checks|||Chia nhỏ khiến không cần kiểm lỗi"
            },
            {
              "text": "Small pieces need no IP addresses|||Mảnh nhỏ không cần địa chỉ IP"
            },
            {
              "text": "Switches can only store one byte at a time|||Switch chỉ lưu được một byte mỗi lần"
            },
            {
              "text": "Many conversations can share the link, and only lost pieces need resending|||Nhiều cuộc trao đổi dùng chung được đường truyền, và chỉ mảnh bị mất mới phải gửi lại"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Each piece still needs error checks.<br/>B. Every packet still carries addresses.<br/>C. Switches store whole frames.<br/>D. This is the benefit of segmentation and multiplexing.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Mỗi mảnh vẫn cần kiểm lỗi.<br/>B. Gói nào cũng phải mang địa chỉ.<br/>C. Switch lưu nguyên khung.<br/>D. Đây là lợi ích của phân đoạn và ghép kênh.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the usable host range of 192.168.7.64/28?</p></div><div class=\"ml-vi\"><p>Dải máy dùng được của 192.168.7.64/28 là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "192.168.7.64 to 192.168.7.79|||192.168.7.64 đến 192.168.7.79"
            },
            {
              "text": "192.168.7.65 to 192.168.7.78|||192.168.7.65 đến 192.168.7.78"
            },
            {
              "text": "192.168.7.65 to 192.168.7.94|||192.168.7.65 đến 192.168.7.94"
            },
            {
              "text": "192.168.7.1 to 192.168.7.14|||192.168.7.1 đến 192.168.7.14"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. This includes the network and broadcast addresses.<br/>B. A /28 has 16 addresses: .64 is the network and .79 the broadcast.<br/>C. That range belongs to a /27.<br/>D. That is the first /28, not this one.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Dải này tính cả địa chỉ mạng và quảng bá.<br/>B. /28 có 16 địa chỉ: .64 là mạng và .79 là quảng bá.<br/>C. Dải đó của /27.<br/>D. Đó là /28 đầu tiên, không phải subnet này.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>IPv6 has no ARP. How does a host find the MAC address of a neighbour on its link?</p></div><div class=\"ml-vi\"><p>IPv6 không có ARP. Máy tìm MAC của hàng xóm trên cùng chặng bằng cách nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It sends a Neighbor Solicitation to a multicast group|||Nó gửi Neighbor Solicitation tới một nhóm multicast"
            },
            {
              "text": "It reads the MAC from its DNS record|||Nó đọc MAC từ bản ghi DNS"
            },
            {
              "text": "It asks the DHCPv6 server for the MAC|||Nó hỏi máy chủ DHCPv6 về MAC"
            },
            {
              "text": "It broadcasts to FFFF.FFFF.FFFF|||Nó quảng bá tới FFFF.FFFF.FFFF"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It goes to the solicited-node group, which only matching hosts listen to.<br/>B. DNS maps names to IP addresses.<br/>C. DHCPv6 hands out addresses, not neighbour MACs.<br/>D. IPv6 has no broadcast.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó đi tới nhóm solicited-node, chỉ máy có địa chỉ khớp mới nghe nhóm đó.<br/>B. DNS ánh xạ tên sang IP.<br/>C. DHCPv6 cấp địa chỉ, không cung cấp MAC hàng xóm.<br/>D. IPv6 không có quảng bá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A school lets students join the campus Wi-Fi with their own phones and laptops for class work. Which trend describes this?</p></div><div class=\"ml-vi\"><p>Trường cho sinh viên dùng điện thoại và laptop cá nhân vào Wi-Fi của trường để học. Xu hướng nào mô tả điều này?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Extranet access|||Truy cập extranet"
            },
            {
              "text": "Bring Your Own Device|||Bring Your Own Device (BYOD)"
            },
            {
              "text": "Cloud computing|||Điện toán đám mây"
            },
            {
              "text": "Powerline networking|||Mạng qua đường dây điện"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. An extranet is for outside partners.<br/>B. Personal devices used on an organisation&#39;s network are what BYOD means.<br/>C. The cloud is about remote services, not who owns the device.<br/>D. That sends data over electrical wiring.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Extranet dành cho đối tác bên ngoài.<br/>B. Thiết bị cá nhân dùng trên mạng của tổ chức chính là BYOD.<br/>C. Đám mây nói về dịch vụ từ xa, không nói ai sở hữu thiết bị.<br/>D. Đó là truyền dữ liệu qua dây điện.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A PC is set to IP 192.168.5.20, mask 255.255.255.0, gateway 192.168.6.1. It reaches local hosts but nothing beyond. What is wrong?</p></div><div class=\"ml-vi\"><p>Một máy đặt IP 192.168.5.20, mặt nạ 255.255.255.0, gateway 192.168.6.1. Máy tới được các máy cục bộ nhưng không ra ngoài được. Sai ở đâu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A PC needs two gateways|||Máy cần hai gateway"
            },
            {
              "text": "The PC&#39;s IP is a network address|||IP của máy là địa chỉ mạng"
            },
            {
              "text": "The gateway is not in the PC&#39;s own subnet|||Gateway không nằm trong subnet của máy"
            },
            {
              "text": "The mask is too long for a private address|||Mặt nạ quá dài so với địa chỉ riêng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. One default gateway is enough.<br/>B. .20 is a normal host address in this subnet.<br/>C. A host must reach its gateway directly, on the same subnet.<br/>D. A /24 on a private address is normal.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Một default gateway là đủ.<br/>B. .20 là địa chỉ máy bình thường trong subnet này.<br/>C. Máy phải tới gateway trực tiếp, trong cùng subnet.<br/>D. /24 trên địa chỉ riêng là bình thường.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Clients in VLAN 10 get no address, while the DHCP server sits in another subnet behind router R1. What should be configured on R1&#39;s interface facing those clients?</p></div><div class=\"ml-vi\"><p>Máy trong VLAN 10 không nhận được địa chỉ, còn máy chủ DHCP nằm ở subnet khác phía sau router R1. Cần cấu hình gì trên cổng R1 hướng về các máy đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ip nat inside|||ip nat inside"
            },
            {
              "text": "ip default-gateway|||ip default-gateway"
            },
            {
              "text": "A static ARP entry for the DHCP server|||Một mục ARP tĩnh cho máy chủ DHCP"
            },
            {
              "text": "ip helper-address with the server&#39;s IP|||ip helper-address với IP của máy chủ"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. NAT translates addresses and does not relay DHCP broadcasts.<br/>B. That is for Layer 2 switches.<br/>C. ARP cannot carry DHCP across a router.<br/>D. DHCP Discover is a broadcast and routers stop it; a helper relays it as unicast.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. NAT dịch địa chỉ, không chuyển tiếp quảng bá DHCP.<br/>B. Lệnh đó dành cho switch tầng 2.<br/>C. ARP không mang DHCP qua router được.<br/>D. DHCP Discover là quảng bá và bị router chặn; helper chuyển nó thành unicast.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which connector normally terminates a UTP Ethernet cable?</p></div><div class=\"ml-vi\"><p>Đầu nối nào thường dùng để bấm đầu cáp Ethernet UTP?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "BNC|||BNC"
            },
            {
              "text": "RJ-45|||RJ-45"
            },
            {
              "text": "RJ-11|||RJ-11"
            },
            {
              "text": "SC|||SC"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. BNC is a coaxial connector.<br/>B. It is the 8-pin connector used on Ethernet copper.<br/>C. It is the smaller telephone connector.<br/>D. SC is a fiber connector.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. BNC là đầu nối cáp đồng trục.<br/>B. Đây là đầu nối 8 chân dùng cho Ethernet cáp đồng.<br/>C. Đây là đầu nối điện thoại, nhỏ hơn.<br/>D. SC là đầu nối cáp quang.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which two features exist in TCP but not in UDP? (Choose two.)</p></div><div class=\"ml-vi\"><p>Hai tính năng nào có ở TCP nhưng không có ở UDP? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Source and destination ports|||Cổng nguồn và cổng đích"
            },
            {
              "text": "A checksum|||Checksum"
            },
            {
              "text": "Sequence numbers|||Số thứ tự"
            },
            {
              "text": "A three-way handshake|||Bắt tay ba bước"
            },
            {
              "text": "IP addresses in the transport header|||Địa chỉ IP trong phần đầu giao vận"
            }
          ],
          "correctIndexes": [
            2,
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C, D.</strong><br/>A. Both protocols use ports.<br/>B. Both protocols have one.<br/>C. They let the receiver reorder data and spot gaps.<br/>D. TCP sets up a connection; UDP does not.<br/>E. IP addresses are in the IP header.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C, D.</strong><br/>A. Cả hai giao thức đều dùng cổng.<br/>B. Cả hai giao thức đều có.<br/>C. Chúng giúp bên nhận sắp lại dữ liệu và phát hiện chỗ thiếu.<br/>D. TCP thiết lập kết nối, UDP thì không.<br/>E. Địa chỉ IP nằm trong phần đầu IP.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which DNS record tells other servers where to deliver email for a domain?</p></div><div class=\"ml-vi\"><p>Bản ghi DNS nào cho các máy chủ khác biết phải giao email của một tên miền về đâu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "CNAME|||CNAME"
            },
            {
              "text": "AAAA|||AAAA"
            },
            {
              "text": "A|||A"
            },
            {
              "text": "MX|||MX"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. CNAME is an alias for another name.<br/>B. AAAA maps a name to an IPv6 address.<br/>C. A maps a name to an IPv4 address.<br/>D. MX stands for mail exchanger.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. CNAME là bí danh của một tên khác.<br/>B. AAAA ánh xạ tên sang IPv6.<br/>C. A ánh xạ tên sang IPv4.<br/>D. MX là viết tắt của mail exchanger.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>How far do the MAC addresses written in a frame&#39;s header matter?</p></div><div class=\"ml-vi\"><p>Địa chỉ MAC ghi trong phần đầu khung có tác dụng trong phạm vi nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Only on the current link, up to the next Layer 3 device|||Chỉ trên chặng hiện tại, tới thiết bị tầng 3 kế tiếp"
            },
            {
              "text": "Only inside the sending computer|||Chỉ trong máy gửi"
            },
            {
              "text": "Across the whole Internet|||Trên toàn Internet"
            },
            {
              "text": "All the way from source host to final destination|||Suốt từ máy nguồn tới đích cuối"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. A router removes the frame and builds a new one for the next link.<br/>B. They are read by devices on the link.<br/>C. Routers do not forward frames between networks.<br/>D. That is true of IP addresses, not MAC addresses.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Router bỏ khung cũ và dựng khung mới cho chặng sau.<br/>B. Các thiết bị trên chặng đều đọc chúng.<br/>C. Router không chuyển nguyên khung giữa các mạng.<br/>D. Điều đó đúng với địa chỉ IP, không đúng với MAC.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>To which network does host 172.16.77.200/18 belong?</p></div><div class=\"ml-vi\"><p>Máy 172.16.77.200/18 thuộc mạng nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "172.16.0.0|||172.16.0.0"
            },
            {
              "text": "172.16.76.0|||172.16.76.0"
            },
            {
              "text": "172.16.64.0|||172.16.64.0"
            },
            {
              "text": "172.16.77.0|||172.16.77.0"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is the first block, 0-63.<br/>B. This uses a block size of 4, which is /22.<br/>C. /18 makes blocks of 64 in the third octet, and 77 falls in 64-127.<br/>D. This assumes /24.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là khối đầu, 0-63.<br/>B. Cách này dùng khối 4, tức /22.<br/>C. /18 tạo khối 64 ở octet thứ ba, 77 nằm trong 64-127.<br/>D. Cách này giả định /24.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>PC-1 (10.0.1.5/24, gateway 10.0.1.1) has an empty ARP cache and sends a packet to 8.8.4.4. Which IP address does PC-1 ask about in its ARP request?</p></div><div class=\"ml-vi\"><p>PC-1 (10.0.1.5/24, gateway 10.0.1.1) có ARP cache trống và gửi gói tới 8.8.4.4. PC-1 hỏi về địa chỉ IP nào trong ARP request?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8.8.4.4|||8.8.4.4"
            },
            {
              "text": "10.0.1.5|||10.0.1.5"
            },
            {
              "text": "10.0.1.1|||10.0.1.1"
            },
            {
              "text": "10.0.1.255|||10.0.1.255"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. ARP stays on the local network and cannot reach a remote host.<br/>B. PC-1 already knows its own MAC.<br/>C. The destination is remote, so the frame goes to the gateway and only its MAC is needed.<br/>D. That is the broadcast address, not a device to resolve.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. ARP chỉ trong mạng cục bộ, không tới được máy ở xa.<br/>B. PC-1 đã biết MAC của chính nó.<br/>C. Đích ở xa nên khung đi tới gateway, chỉ cần MAC của gateway.<br/>D. Đó là địa chỉ quảng bá, không phải thiết bị cần phân giải.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>IPv4 is called best-effort. What does that mean?</p></div><div class=\"ml-vi\"><p>IPv4 được gọi là best-effort. Điều đó nghĩa là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It encrypts every packet|||Nó mã hoá mọi gói"
            },
            {
              "text": "It tries to deliver packets but gives no guarantee|||Nó cố giao gói nhưng không bảo đảm"
            },
            {
              "text": "It sets up a connection before sending|||Nó thiết lập kết nối trước khi gửi"
            },
            {
              "text": "It always picks the fastest path on the Internet|||Nó luôn chọn đường nhanh nhất trên Internet"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. IP does not encrypt by itself.<br/>B. IP has no acknowledgements or retransmission of its own.<br/>C. IP is connectionless.<br/>D. Path selection is the job of routing, and is not guaranteed fastest.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. IP tự nó không mã hoá.<br/>B. IP không có xác nhận hay gửi lại riêng.<br/>C. IP là phi kết nối.<br/>D. Chọn đường là việc của định tuyến và không chắc là nhanh nhất.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which dotted-decimal mask equals /21?</p></div><div class=\"ml-vi\"><p>Mặt nạ dạng thập phân nào tương đương /21?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "255.255.248.0|||255.255.248.0"
            },
            {
              "text": "255.255.255.248|||255.255.255.248"
            },
            {
              "text": "255.255.252.0|||255.255.252.0"
            },
            {
              "text": "255.255.240.0|||255.255.240.0"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. /21 is 16 bits plus 5 more, and 11111000 is 248.<br/>B. That is /29.<br/>C. That is /22.<br/>D. That is /20.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. /21 là 16 bit cộng 5 bit nữa, mà 11111000 bằng 248.<br/>B. Đó là /29.<br/>C. Đó là /22.<br/>D. Đó là /20.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Compared with a hub, which two benefits does an Ethernet switch give? (Choose two.)</p></div><div class=\"ml-vi\"><p>So với hub, switch Ethernet mang lại hai lợi ích nào? (Chọn hai.)</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Broadcasts are blocked between ports|||Quảng bá bị chặn giữa các cổng"
            },
            {
              "text": "Each port is its own collision domain|||Mỗi cổng là một miền xung đột riêng"
            },
            {
              "text": "Devices no longer need MAC addresses|||Thiết bị không còn cần địa chỉ MAC"
            },
            {
              "text": "Each port gets its own IP subnet|||Mỗi cổng có một subnet IP riêng"
            },
            {
              "text": "Frames go only to the port of the known destination|||Khung chỉ đi tới cổng của đích đã biết"
            }
          ],
          "correctIndexes": [
            1,
            4
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B, E.</strong><br/>A. A switch forwards broadcasts through the whole VLAN.<br/>B. Microsegmentation removes collisions between devices.<br/>C. Switching depends on MAC addresses.<br/>D. A Layer 2 switch works without any subnets per port.<br/>E. The MAC table avoids repeating every frame everywhere.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B, E.</strong><br/>A. Switch chuyển quảng bá khắp VLAN.<br/>B. Vi phân đoạn loại bỏ va chạm giữa các thiết bị.<br/>C. Chuyển mạch dựa vào địa chỉ MAC.<br/>D. Switch tầng 2 không tạo subnet theo cổng.<br/>E. Bảng MAC tránh việc lặp mọi khung ra mọi nơi.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
