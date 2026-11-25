/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 7: Từ vựng theo tình huống và phát âm thuật ngữ (soạn 24/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-7-1 … tak-7-5).
 * Mọi số đếm, phiên âm máy và output là THẬT, chạy 24/11/2026 trên máy Fedora của tác giả:
 * dem-tu.mjs + kiem-thuat-ngu.mjs (tự viết cho chương này, in nguyên văn ở bài 7.1 và 7.4) và kiem-email.mjs (Chương 4) trong
 * node:22-alpine (Node 22.23.5), --network none; kho chữ = lịch sử commit thật của actions/cache (GitHub, 671 commit 2019–2025) và
 * oh-my-zsh, cùng 628 tệp NEWS/CHANGELOG trong /usr/share/doc; âm thanh bằng eSpeak NG 1.52.0, nghe lại bằng faster-whisper 1.2.1
 * (small.en, CPU, ngoại tuyến, Python 3.14.6) qua nghe.py của bài 6.5.
 * Phiên âm IPA "từ điển" theo Cambridge Dictionary (giọng Mỹ); phiên âm "máy" là output của espeak-ng --ipa (để so, không phải chuẩn).
 * Nguồn sự cố: CrowdStrike, "Preliminary Post Incident Review" (24/7/2024) + "Root Cause Analysis" (6/8/2024), Microsoft blog 20/7/2024
 * (8,5 triệu máy Windows); GitHub, "October 21 post-incident analysis" (30/10/2018); Cloudflare, "Details of the Cloudflare outage on
 * July 2, 2019" (12/7/2019); npm blog "crossenv malware on the npm registry" (2/8/2017).
 */
import { mau, saiDung, tuVung, Q, esc } from './_chung.mjs';
/* p0 — SINH TỰ ĐỘNG từ lab/ch7 bằng gen-p0.mjs (mẫu + output THẬT). Đừng sửa tay. */
const EM = {"20-thuat-ngu.tsv":"# term\taccept (regex, case-insensitive)\tIPA (Cambridge, US)\tVietnamese meaning\tsentence to say\tVietnamese-style reading (eSpeak phonemes, for the demo only)\ncache\tcache\t/kæʃ/\tbộ nhớ đệm\tClear the cache and reload the page.\t[[k'atSeI]]\nsuite\tsuite\t/swiːt/\tbộ (kiểm thử)\tThe test suite takes ten minutes.\t[[s'u:t]]\nqueue\tqueue\t/kjuː/\thàng đợi\tThe job is still in the queue.\t[[k'ju:eI]]\ndata\tdata\t/ˈdeɪtə/, /ˈdætə/\tdữ liệu\tThe data is stored in the database.\t-\nLinux\tlinux\t/ˈlɪnəks/\thệ điều hành Linux\tThe server runs Linux.\t[[l'aIn@ks]]\nnginx\tnginx|engine ?x\t/ˌendʒɪnˈeks/\tmáy chủ web nginx\tNginx sends the request to Node.\t-\nSQL\tsql|sequel\t/ˌes.kjuːˈel/, /ˈsiːkwəl/\tngôn ngữ truy vấn SQL\tI wrote the SQL query myself.\t-\nGUI\tgui|gooey\t/ˈɡuːi/\tgiao diện đồ hoạ\tThe admin tool has no GUI.\t-\nchar\tchar\t/tʃɑːr/\tkiểu ký tự (char)\tA char is one character.\t-\nenum\tenum\t/ˈiːnʌm/\tkiểu liệt kê (enum)\tStatus is an enum with four values.\t-\nAzure\tazure\t/ˈæʒər/\tđám mây Microsoft Azure\tWe deploy the API to Azure.\t[[a:z'u:r@]]\nsudo\tsudo\t/ˈsuːduː/\tchạy lệnh quyền root\tRun the command with sudo.\t-\nKubernetes\tkubernetes\t/ˌkuːbərˈnetiːz/\thệ điều phối container\tThe app runs on Kubernetes.\t[[k'u:b@net]]\nGitHub\tgithub\t/ˈɡɪthʌb/\tnền tảng GitHub\tThe code is on GitHub.\t-\nwidth\twidth\t/wɪdθ/\tchiều rộng\tCheck the width of the table.\t-\nheight\theight\t/haɪt/\tchiều cao\tThe height is wrong on mobile.\t[[h'eIt]]\ndeploy\tdeploy\t/dɪˈplɔɪ/\ttriển khai\tWe deploy every Friday.\t[['di:plOI]]\nschema\tschema\t/ˈskiːmə/\tlược đồ (CSDL)\tI changed the database schema.\t[[S'e:ma:]]\narchive\tarchive\t/ˈɑːrkaɪv/\ttệp nén, lưu trữ\tDownload the archive and unzip it.\t[[a:tS'i:v]]\ninteger\tinteger\t/ˈɪntɪdʒər/\tsố nguyên\tThe ID must be an integer.\t[[Int'eg@]]\n","100-mau-cau.tsv":"# group\tpattern (___ = fill in)\tVietnamese\twhere\n1 Asking & clarifying\tCould you clarify whether ___ or ___?\tAnh/chị làm rõ giúp là ___ hay ___?\temail, chat\n1 Asking & clarifying\tJust to confirm: ___. Is that correct?\tXác nhận lại: ___. Như vậy đúng không?\tall\n1 Asking & clarifying\tWe assume ___. Could you confirm?\tChúng tôi giả định ___. Anh/chị xác nhận giúp?\tQ&A list\n1 Asking & clarifying\tWhat should happen when ___?\tKhi ___ thì hệ thống phải làm gì?\tspec, meeting\n1 Asking & clarifying\tDo you mean ___ or ___?\tÝ anh/chị là ___ hay ___?\tmeeting\n1 Asking & clarifying\tSorry, I didn't catch ___. Could you say it again?\tXin lỗi, tôi chưa nghe rõ ___. Anh/chị nhắc lại giúp?\tmeeting\n1 Asking & clarifying\tCould you give me an example of ___?\tAnh/chị cho tôi một ví dụ về ___ được không?\tmeeting\n1 Asking & clarifying\tWhich environment did you see this on?\tAnh/chị thấy lỗi này trên môi trường nào?\tbug, chat\n1 Asking & clarifying\tIs ___ in scope for this sprint?\t___ có nằm trong phạm vi sprint này không?\tplanning\n1 Asking & clarifying\tWho is the right person to ask about ___?\tHỏi về ___ thì hỏi ai là đúng?\tchat\n1 Asking & clarifying\tWhen do you need ___ by?\tAnh/chị cần ___ trước lúc nào?\tchat, email\n1 Asking & clarifying\tCould you share the steps to reproduce?\tAnh/chị gửi giúp các bước tái hiện?\tbug\n1 Asking & clarifying\tHow would you like us to handle ___?\tAnh/chị muốn chúng tôi xử lý ___ thế nào?\temail\n1 Asking & clarifying\tLet me make sure I understand: ___.\tĐể tôi chắc là mình hiểu đúng: ___.\tmeeting\n2 Requesting & asking for help\tCould you take a look at ___ when you have a moment?\tKhi rảnh anh/chị xem giúp ___ được không?\tchat\n2 Requesting & asking for help\tCould you review my PR for ___ by ___?\tAnh/chị review giúp PR ___ trước ___ được không?\tchat\n2 Requesting & asking for help\tI'm stuck on ___. I've tried ___ and ___.\tTôi đang kẹt ở ___. Tôi đã thử ___ và ___.\tchat\n2 Requesting & asking for help\tDo you have 15 minutes today to go through ___?\tHôm nay anh/chị có 15 phút để cùng xem ___ không?\tchat\n2 Requesting & asking for help\tCould you grant me access to ___?\tAnh/chị cấp giúp tôi quyền truy cập ___?\temail, ticket\n2 Requesting & asking for help\tWould it be possible to ___?\tCó thể ___ được không ạ?\temail\n2 Requesting & asking for help\tCould you send me ___ by ___ (your time)?\tAnh/chị gửi giúp ___ trước ___ (giờ bên anh/chị)?\temail\n2 Requesting & asking for help\tCan I pair with you on ___ for half an hour?\tTôi làm cùng anh/chị về ___ nửa tiếng được không?\tchat\n2 Requesting & asking for help\tCould you point me to the docs for ___?\tAnh/chị chỉ giúp tài liệu về ___ ở đâu?\tchat\n2 Requesting & asking for help\tI'd appreciate your feedback on ___.\tRất mong anh/chị góp ý về ___.\temail\n2 Requesting & asking for help\tCould you approve ___ so we can ___?\tAnh/chị duyệt ___ để chúng tôi ___ được không?\temail\n2 Requesting & asking for help\tPlease let me know if ___ works for you.\tAnh/chị cho biết ___ có ổn với anh/chị không.\temail\n3 Reporting progress\tI finished ___ yesterday.\tHôm qua tôi đã xong ___.\tstand-up\n3 Reporting progress\tToday I'm working on ___.\tHôm nay tôi làm ___.\tstand-up\n3 Reporting progress\t___ is ready for review.\t___ đã sẵn sàng để review.\tticket, chat\n3 Reporting progress\t___ is merged and deployed to staging.\t___ đã gộp và đã triển khai lên staging.\tticket\n3 Reporting progress\tI've fixed ___; the fix is in PR #___.\tTôi đã sửa ___; bản sửa ở PR #___.\tticket\n3 Reporting progress\tThe remaining work is ___.\tPhần còn lại là ___.\tstand-up, ticket\n3 Reporting progress\tI expect to finish ___ by ___.\tTôi dự kiến xong ___ trước ___.\tstand-up\n3 Reporting progress\tWe're on track for ___.\tChúng tôi đang đúng tiến độ cho ___.\temail\n3 Reporting progress\tAll ___ tests pass on CI.\tCả ___ bài kiểm thử đều qua trên CI.\tPR\n3 Reporting progress\tI tested it on ___ and ___.\tTôi đã kiểm trên ___ và ___.\tPR\n3 Reporting progress\tHere is a quick summary of ___.\tĐây là tóm tắt ngắn về ___.\temail\n3 Reporting progress\tThe root cause was ___.\tNguyên nhân gốc là ___.\tticket, incident\n3 Reporting progress\tAs a workaround, ___.\tTạm thời có thể ___ (cách đi vòng).\tticket\n3 Reporting progress\tNo blockers.\tKhông vướng gì.\tstand-up\n4 Raising problems & bad news\tI'm blocked by ___.\tTôi đang bị chặn bởi ___.\tstand-up\n4 Raising problems & bad news\tI'm waiting for ___ from ___.\tTôi đang chờ ___ từ ___.\tstand-up\n4 Raising problems & bad news\tI found an issue with ___.\tTôi phát hiện một vấn đề với ___.\tchat\n4 Raising problems & bad news\tThis will take longer than planned because ___.\tViệc này sẽ lâu hơn dự kiến vì ___.\tstand-up, email\n4 Raising problems & bad news\tUnfortunately, ___. As a result, ___.\tRất tiếc ___. Vì vậy ___.\temail\n4 Raising problems & bad news\tI want to flag a risk: ___.\tTôi muốn báo trước một rủi ro: ___.\tmeeting\n4 Raising problems & bad news\tWe're investigating ___. Next update at ___.\tChúng tôi đang điều tra ___. Cập nhật tiếp lúc ___.\tincident\n4 Raising problems & bad news\tUsers can't ___ since ___.\tNgười dùng không ___ được kể từ ___.\tincident\n4 Raising problems & bad news\tI broke ___. I'm fixing it now.\tTôi làm hỏng ___. Tôi đang sửa ngay.\tchat\n4 Raising problems & bad news\tThis works on ___ but fails on ___.\tCái này chạy trên ___ nhưng lỗi trên ___.\tbug\n5 Apologizing & taking responsibility\tSorry for the late reply.\tXin lỗi vì trả lời muộn.\temail, chat\n5 Apologizing & taking responsibility\tSorry, that was my mistake. I've ___.\tXin lỗi, đó là lỗi của tôi. Tôi đã ___.\tchat\n5 Apologizing & taking responsibility\tThanks for catching that. Fixed in ___.\tCảm ơn đã phát hiện. Đã sửa ở ___.\treview\n5 Apologizing & taking responsibility\tI should have ___. Next time I'll ___.\tLẽ ra tôi nên ___. Lần sau tôi sẽ ___.\tretro\n5 Apologizing & taking responsibility\tApologies for the confusion. To clarify, ___.\tXin lỗi vì gây nhầm lẫn. Nói rõ lại: ___.\temail\n5 Apologizing & taking responsibility\tI misunderstood ___. I've updated ___.\tTôi đã hiểu nhầm ___. Tôi đã cập nhật ___.\tchat\n5 Apologizing & taking responsibility\tWe apologize for the inconvenience this caused.\tChúng tôi xin lỗi vì sự bất tiện đã gây ra.\tincident email\n5 Apologizing & taking responsibility\tTo prevent this, we will ___.\tĐể không lặp lại, chúng tôi sẽ ___.\tpostmortem\n6 Declining & pushing back\tI see your point. My concern is ___.\tTôi hiểu ý anh/chị. Điều tôi lo là ___.\tmeeting\n6 Declining & pushing back\tThat's outside the scope of ___. We can do it as a change request.\tViệc đó ngoài phạm vi ___. Có thể làm qua change request.\temail\n6 Declining & pushing back\tI can't take ___ this sprint, but I can ___.\tSprint này tôi không nhận ___ được, nhưng tôi có thể ___.\tplanning\n6 Declining & pushing back\tIf we add ___, we need to move ___.\tNếu thêm ___ thì phải dời ___.\tmeeting\n6 Declining & pushing back\tCould we ___ instead?\tThay vào đó mình ___ được không?\tmeeting\n6 Declining & pushing back\tI'd suggest ___, because ___.\tTôi đề xuất ___, vì ___.\treview, meeting\n6 Declining & pushing back\tI'm not sure that's the best option. What about ___?\tTôi chưa chắc đó là cách tốt nhất. Còn ___ thì sao?\treview\n6 Declining & pushing back\tI'd rather not ___ before ___.\tTôi muốn chưa ___ trước khi ___.\tchat\n6 Declining & pushing back\tI can't promise ___ yet. I'll confirm by ___.\tTôi chưa hứa ___ được. Tôi sẽ xác nhận trước ___.\tmeeting\n6 Declining & pushing back\tLet's take this offline.\tMình bàn riêng việc này sau buổi họp nhé.\tstand-up\n7 Agreeing & confirming\tSounds good. I'll ___.\tĐược ạ. Tôi sẽ ___.\tchat\n7 Agreeing & confirming\tAgreed. Let's go with ___.\tĐồng ý. Mình chọn ___.\tmeeting\n7 Agreeing & confirming\tThat makes sense.\tHợp lý.\tmeeting\n7 Agreeing & confirming\tConfirmed: ___.\tĐã xác nhận: ___.\tQ&A list\n7 Agreeing & confirming\tI'll take care of ___.\tTôi sẽ lo ___.\tmeeting\n7 Agreeing & confirming\tNoted. I'll update ___ accordingly.\tĐã ghi nhận. Tôi sẽ cập nhật ___ theo đó.\temail\n7 Agreeing & confirming\tGood catch.\tBắt lỗi chuẩn.\treview\n7 Agreeing & confirming\tLGTM.\tTôi thấy ổn (looks good to me).\treview\n8 Thanking & praising\tThanks for the quick reply.\tCảm ơn anh/chị đã trả lời nhanh.\temail\n8 Thanking & praising\tThanks for your help with ___.\tCảm ơn anh/chị đã giúp về ___.\tchat\n8 Thanking & praising\tThank you for your patience.\tCảm ơn anh/chị đã kiên nhẫn chờ.\tincident email\n8 Thanking & praising\tGreat work on ___!\t___ làm tốt lắm!\tchat\n8 Thanking & praising\tThis is really helpful.\tCái này giúp ích thật.\tchat\n8 Thanking & praising\tThanks, that answers my question.\tCảm ơn, vậy là tôi rõ rồi.\tchat\n8 Thanking & praising\tI really appreciate you staying late for ___.\tRất cảm ơn anh/chị đã ở lại muộn vì ___.\tchat\n8 Thanking & praising\tThanks for the detailed review.\tCảm ơn vì đã review kỹ.\treview\n9 Scheduling & meetings\tAre you available for a 30-minute call on ___ at ___?\tAnh/chị có rảnh gọi 30 phút vào ___ lúc ___ không?\temail\n9 Scheduling & meetings\tDoes ___ (your time) work for you?\t___ (giờ bên anh/chị) có tiện không?\temail\n9 Scheduling & meetings\tCould we move the meeting to ___?\tMình dời buổi họp sang ___ được không?\tchat\n9 Scheduling & meetings\tLet's get started. Today we have three items.\tMình bắt đầu nhé. Hôm nay có ba mục.\tmeeting\n9 Scheduling & meetings\tCan everyone see my screen?\tMọi người thấy màn hình của tôi chưa?\tmeeting\n9 Scheduling & meetings\tYou're on mute.\tAnh/chị đang tắt mic.\tmeeting\n9 Scheduling & meetings\tSorry, you broke up. Could you repeat the last part?\tXin lỗi, tiếng bị ngắt. Anh/chị nhắc lại đoạn cuối?\tmeeting\n9 Scheduling & meetings\tWe're running out of time. Let's ___.\tSắp hết giờ rồi. Mình ___ nhé.\tmeeting\n9 Scheduling & meetings\tTo sum up, ___.\tTóm lại, ___.\tmeeting\n9 Scheduling & meetings\tI'll send the minutes by ___.\tTôi sẽ gửi biên bản trước ___.\tmeeting\n10 Handing over & closing\tI'm off on ___. ___ will cover ___.\tNgày ___ tôi nghỉ. ___ sẽ lo ___.\tchat\n10 Handing over & closing\tHere's where I left off: ___.\tTôi dừng ở chỗ này: ___.\thandover\n10 Handing over & closing\tLet me know if you have any questions.\tCó câu hỏi gì anh/chị cứ báo tôi.\temail\n10 Handing over & closing\tI'll follow up on ___ by ___.\tTôi sẽ theo tiếp ___ trước ___.\temail, meeting\n10 Handing over & closing\tClosing this ticket. Feel free to reopen if ___.\tĐóng ticket này. Nếu ___ thì cứ mở lại.\tticket\n10 Handing over & closing\tHave a good weekend!\tChúc cuối tuần vui vẻ!\tchat\n","them-10.tsv":"# term\taccept (regex, case-insensitive)\tIPA\tVietnamese meaning\tsentence to say\nbean\tbean\t/biːn/\tđối tượng do Spring quản lý\tSpring creates the bean at startup.\nHibernate\thibernate\t/ˈhaɪbərneɪt/\tthư viện ORM của Java\tHibernate generates the SQL for us.\nMaven\tmaven\t/ˈmeɪvən/\tcông cụ build Java\tMaven downloads the dependencies.\nPostgreSQL\tpostgres(ql)?|postgre ?sql\t/ˈpoʊstɡres ˌkjuː ˈel/\thệ CSDL PostgreSQL\tOur database is PostgreSQL sixteen.\nRedis\tredis\t/ˈredɪs/\tkho dữ liệu trong bộ nhớ\tWe cache sessions in Redis.\nOAuth\to-?auth\t/ˈoʊ.ɔːθ/\tchuẩn uỷ quyền đăng nhập\tUsers log in with Google through OAuth.\nJWT\tjwt|j\\.? ?w\\.? ?t\t/ˌdʒeɪ.dʌbəl.juːˈtiː/\tmã thông báo JSON Web Token\tThe API returns a JWT after login.\nCORS\tcors\t/kɔːrz/\tchia sẻ tài nguyên khác nguồn\tThe browser blocks the request because of CORS.\nmiddleware\tmiddleware\t/ˈmɪdəlwer/\tlớp xử lý chen giữa\tThe auth middleware checks the token.\nendpoint\tendpoint\t/ˈendpɔɪnt/\tđiểm cuối API\tThe endpoint returns a list of bookings.\n"};
const OUT = {"100-dem":"100 patterns, 6.6 words on average, longest 14 words\n","100-kiem":"OK: 100/100\n","72-don":"cache\t[[k'atSeI]]\tCASH\tOkay\nsuite\t[[s'u:t]]\tSweet.\tSoot.\nqueue\t[[k'ju:eI]]\tKew.\tQA\nLinux\t[[l'aIn@ks]]\tliddox.\tlilacs\nAzure\t[[a:z'u:r@]]\tAzure.\tAzura.\nKubernetes\t[[k'u:b@net]]\tKubernetes\tKOOBANET\nheight\t[[h'eIt]]\tHi\tKate.\ndeploy\t[['di:plOI]]\tDiploid\tThe Lawyer.\nschema\t[[S'e:ma:]]\tSchema.\tK-Man.\narchive\t[[a:tS'i:v]]\tArchive\tteam.\ninteger\t[[Int'eg@]]\tinteger.\tIntegra\n","74-csv":"front,back\n\"cache\",\"/kæʃ/ · bộ nhớ đệm · Clear the cache and reload the page.\"\n\"suite\",\"/swiːt/ · bộ (kiểm thử) · The test suite takes ten minutes.\"\n\"queue\",\"/kjuː/ · hàng đợi · The job is still in the queue.\"\n\"data\",\"/ˈdeɪtə/, /ˈdætə/ · dữ liệu · The data is stored in the database.\"\n\"Linux\",\"/ˈlɪnəks/ · hệ điều hành Linux · The server runs Linux.\"\n\"nginx\",\"/ˌendʒɪnˈeks/ · máy chủ web nginx · Nginx sends the request to Node.\"\n\"SQL\",\"/ˌes.kjuːˈel/, /ˈsiːkwəl/ · ngôn ngữ truy vấn SQL · I wrote the SQL query myself.\"\n\"GUI\",\"/ˈɡuːi/ · giao diện đồ hoạ · The admin tool has no GUI.\"\n\"char\",\"/tʃɑːr/ · kiểu ký tự (char) · A char is one character.\"\n\"enum\",\"/ˈiːnʌm/ · kiểu liệt kê (enum) · Status is an enum with four values.\"\n\"Azure\",\"/ˈæʒər/ · đám mây Microsoft Azure · We deploy the API to Azure.\"\n\"sudo\",\"/ˈsuːduː/ · chạy lệnh quyền root · Run the command with sudo.\"\n\"Kubernetes\",\"/ˌkuːbərˈnetiːz/ · hệ điều phối container · The app runs on Kubernetes.\"\n\"GitHub\",\"/ˈɡɪthʌb/ · nền tảng GitHub · The code is on GitHub.\"\n\"width\",\"/wɪdθ/ · chiều rộng · Check the width of the table.\"\n\"height\",\"/haɪt/ · chiều cao · The height is wrong on mobile.\"\n\"deploy\",\"/dɪˈplɔɪ/ · triển khai · We deploy every Friday.\"\n\"schema\",\"/ˈskiːmə/ · lược đồ (CSDL) · I changed the database schema.\"\n\"archive\",\"/ˈɑːrkaɪv/ · tệp nén, lưu trữ · Download the archive and unzip it.\"\n\"integer\",\"/ˈɪntɪdʒər/ · số nguyên · The ID must be an integer.\"\n","74-kiem-dung":"✓  1. cache       /kæʃ/\n✓  2. suite       /swiːt/\n✓  3. queue       /kjuː/\n✓  4. data        /ˈdeɪtə/, /ˈdætə/\n✓  5. Linux       /ˈlɪnəks/\n✓  6. nginx       /ˌendʒɪnˈeks/\n✓  7. SQL         /ˌes.kjuːˈel/, /ˈsiːkwəl/\n✓  8. GUI         /ˈɡuːi/\n✓  9. char        /tʃɑːr/\n✓ 10. enum        /ˈiːnʌm/\n✓ 11. Azure       /ˈæʒər/\n✓ 12. sudo        /ˈsuːduː/\n✓ 13. Kubernetes  /ˌkuːbərˈnetiːz/\n✓ 14. GitHub      /ˈɡɪthʌb/\n✓ 15. width       /wɪdθ/\n✓ 16. height      /haɪt/\n✓ 17. deploy      /dɪˈplɔɪ/\n✓ 18. schema      /ˈskiːmə/\n✓ 19. archive     /ˈɑːrkaɪv/\n✓ 20. integer     /ˈɪntɪdʒər/\n--- 20/20 terms heard (100%) — now ask a person to listen too\nexit=0\n","74-kiem-sai":"✓  1. cache       /kæʃ/\n✓  2. suite       /swiːt/\n✗  3. queue       /kjuː/   ← not heard: listen to the model, say it again\n✓  4. data        /ˈdeɪtə/, /ˈdætə/\n✓  5. Linux       /ˈlɪnəks/\n✓  6. nginx       /ˌendʒɪnˈeks/\n✓  7. SQL         /ˌes.kjuːˈel/, /ˈsiːkwəl/\n✓  8. GUI         /ˈɡuːi/\n✓  9. char        /tʃɑːr/\n✓ 10. enum        /ˈiːnʌm/\n✗ 11. Azure       /ˈæʒər/   ← not heard: listen to the model, say it again\n✓ 12. sudo        /ˈsuːduː/\n✓ 13. Kubernetes  /ˌkuːbərˈnetiːz/\n✓ 14. GitHub      /ˈɡɪthʌb/\n✓ 15. width       /wɪdθ/\n✓ 16. height      /haɪt/\n✓ 17. deploy      /dɪˈplɔɪ/\n✓ 18. schema      /ˈskiːmə/\n✗ 19. archive     /ˈɑːrkaɪv/   ← not heard: listen to the model, say it again\n✓ 20. integer     /ˈɪntɪdʒər/\n--- 17/20 terms heard (85%)\nexit=1\n","74-kiem-them":"✗  1. bean        /biːn/   ← not heard: listen to the model, say it again\n✓  2. Hibernate   /ˈhaɪbərneɪt/\n✓  3. Maven       /ˈmeɪvən/\n✗  4. PostgreSQL  /ˈpoʊstɡres ˌkjuː ˈel/   ← not heard: listen to the model, say it again\n✓  5. Redis       /ˈredɪs/\n✗  6. OAuth       /ˈoʊ.ɔːθ/   ← not heard: listen to the model, say it again\n✓  7. JWT         /ˌdʒeɪ.dʌbəl.juːˈtiː/\n✗  8. CORS        /kɔːrz/   ← not heard: listen to the model, say it again\n✓  9. middleware  /ˈmɪdəlwer/\n✓ 10. endpoint    /ˈendpɔɪnt/\n--- 6/10 terms heard (60%)\nexit=1\n","74-nghe-dung":"[   0.0s ->    7.7s] clear the cache and reload the page. The test suite takes 10 minutes. The job is still in the queue.\n[   7.7s ->   15.2s] The data is stored in the database. The server runs Linux. Nginx sends the request to node.\n[  15.2s ->   22.4s] I wrote the SQL query myself. The admin tool has no GUI. A char is one character.\n[  22.4s ->   29.7s] Status is an enum with four values. We deploy the API to Azure. Run the command with sudo.\n[  29.7s ->   36.2s] The app runs on Kubernetes. The code is on GitHub. Check the width of the table.\n[  36.2s ->   42.9s] The height is wrong on mobile. We deploy every Friday. I change the database schema.\n[  42.9s ->   47.6s] Download the archive and unzip it. The ID must be an integer.\n--- 115 words in 47.8 s = 144 words per minute\n","74-nghe-sai":"[   0.0s ->    7.8s] clear the cache and reload the page. The test suite takes 10 minutes. The job is still in the QA.\n[   7.8s ->   15.3s] The data is stored in the database. The server runs Linux. Nginx sends the request to Node.\n[  15.3s ->   22.6s] I wrote the SQL query myself. The admin tool has no GUI. A char is one character.\n[  22.6s ->   29.8s] Status is an enum with four values. We deploy the API to Azura. Run the command with sudo.\n[  29.8s ->   36.2s] The app runs on Kubernetes. The code is on GitHub. Check the width of the table.\n[  36.2s ->   40.3s] The height is run on mobile. We deploy every Friday.\n[  40.3s ->   47.5s] I changed the database schema. Download the achieve and unzip it. The ID must be an integer.\n--- 115 words in 47.7 s = 145 words per minute\n","74-nghe-them":"[   0.0s ->    2.8s] Spring creates the bnet startup.\n[   2.8s ->    5.9s] Hibernate generates the SQL for us.\n[   5.9s ->    8.6s] Maven downloads the dependencies.\n[   8.6s ->   12.0s] Our databases post the SQL 16.\n[  12.0s ->   14.0s] We cache sessions in Redis.\n[  14.0s ->   16.7s] Users log in with Google through auth.\n[  16.7s ->   20.2s] The API returns a JWT after log in.\n[  20.2s ->   23.7s] The browser blocks the request because of cores.\n[  23.7s ->   26.3s] The auth middleware checks the token.\n[  26.3s ->   29.3s] The endpoint returns a list of bookings.\n--- 62 words in 29.3 s = 127 words per minute\n","74-sai-script":"Clear the [[k'atSeI]] and reload the page. The test [[s'u:t]] takes ten minutes. The job is still in the [[k'ju:eI]]. The data is stored in the database. The server runs [[l'aIn@ks]]. Nginx sends the request to Node. I wrote the SQL query myself. The admin tool has no GUI. A char is one character. Status is an enum with four values. We deploy the API to [[a:z'u:r@]]. Run the command with sudo. The app runs on [[k'u:b@net]]. The code is on GitHub. Check the width of the table. The [[h'eIt]] is wrong on mobile. We [['di:plOI]] every Friday. I changed the database [[S'e:ma:]]. Download the [[a:tS'i:v]] and unzip it. The ID must be an [[Int'eg@]]. \n","74-them-ipa":"PostgreSQL           pˈoʊstɡɚɹ ˌɛskjˌuːˈɛl\nOAuth                ˈoʊ ˈɔːθ\nthe bean at startup  ðə bˈiːn æt stˈɑːɹɾʌp\nCORS                 kˈɔːɹz\ncores                kˈɔːɹz\n","am-version":"eSpeak NG text-to-speech: 1.52.0  Data at: /usr/share/espeak-ng-data\nPython 3.14.6 · faster-whisper 1.2.1\n","commit-vi-du":"Apply workaround for earlyExit\nRevert \"Update action.yml\"\nMerge pull request #1118 from actions/pdotl/zstd-hotfix\nUpdate tips-and-workarounds.md\nRevert compression changes related to windows but keep version logging (#1049)\ndocs: fix an invalid link in workarounds.md (#929)\nMerge pull request #1005 from actions/revert-998-dependabot/npm_and_yarn/minimatch-3.1.2\nRevert \"Bump minimatch from 3.0.4 to 3.1.2\"\n","dem-commit":"2 file(s), 15148 words\nplanning       scope 3 · estimate 0 · deadline 0 · milestone 0 · requirement 0 · priority 0\ncoding         dependency 145 · bump 112 · typo 18 · deprecate 9 · refactor 6 · cleanup 5\ntesting        test 95 · regression 1 · edge case 0 · flaky 0 · reproduce 0\ndeploying      release 116 · revert 21 · migration 2 · hotfix 1 · deploy 0 · roll out 0 · roll back 0\nincidents      workaround 14 · outage 0 · downtime 0 · root cause 0 · mitigate 0 · incident 0 · degraded 0\nphrasal verbs  set up 27 · fall back 13 · look into 0 · follow up 0 · figure out 0 · run into 0 · break down 0\n","dem-doc":"1 file(s), 5991794 words\nplanning       requirement 610 · priority 529 · scope 386 · estimate 173 · milestone 84 · deadline 6\ncoding         deprecate 3926 · cleanup 3359 · typo 2117 · dependency 1991 · bump 1752 · refactor 980\ntesting        test 24974 · regression 1863 · reproduce 169 · edge case 81 · flaky 56\ndeploying      release 12766 · revert 1094 · migration 410 · deploy 106 · roll back 59 · hotfix 7 · roll out 5\nincidents      workaround 1251 · mitigate 69 · degraded 41 · root cause 33 · incident 5 · outage 2 · downtime 2\nphrasal verbs  fall back 1264 · set up 1166 · figure out 89 · follow up 57 · run into 36 · look into 11 · break down 1\n","ipa-cap":"record    noun: ɐ ɹˈɛkɚd          verb: tə ɹᵻkˈɔːɹd\nproject   noun: ɐ pɹˈɑːdʒɛkt    verb: tə pɹədʒˈɛkt\nprogress  noun: ɪn pɹˈɑːɡɹɛs   verb: tə pɹəɡɹˈɛs\nupdate    noun: ɐn ˈʌpdeɪt         verb: tʊ ʌpdˈeɪt\nobject    noun: ɐn ˈɑːbdʒɛkt     verb: tʊ ɑːbdʒˈɛkt\nincrease  noun: ɐn ˈɪŋkɹiːs      verb: tʊ ɪŋkɹˈiːs\n","ipa":"cache        us kˈæʃ            uk kˈæʃ\nsuite        us swˈiːt           uk swˈiːt\nqueue        us kjˈuː            uk kjˈuː\ndata         us dˈeɪɾə         uk dˈeɪtɐ\nLinux        us lˈɪnʌks         uk lˈɪnʌks\nnginx        us ˈɛndʒɪnˌɛks  uk ˈɛndʒɪnˌɛks\nSQL          us ˌɛskjˌuːˈɛl  uk ˌɛskjˌuːˈɛl\nGUI          us ɡˈuːi           uk ɡˈuːɪ\nchar         us tʃˈɑːɹ        uk tʃˈɑː\nenum         us ɪnˈʌm           uk ɪnˈʌm\nAzure        us ˈæʒɚ           uk ˈæʒɐ\nsudo         us sˈuːdoʊ         uk sjˈuːdəʊ\nKubernetes   us kˌuːbɚnˈɛɾiːz uk kˌuːbənˈɛtiːz\nGitHub       us ɡˈɪthˈʌb      uk ɡˈɪthˈʌb\nwidth        us wˈɪtθ           uk wˈɪtθ\nheight       us hˈaɪt            uk hˈaɪt\ndeploy       us dᵻplˈɔɪ       uk dɪplˈɔɪ\nschema       us skˈiːmə         uk skˈiːmɐ\narchive      us ˈɑːɹkaɪv      uk ˈɑːkaɪv\ninteger      us ˈɪntɪdʒɚ      uk ˈɪntɪdʒɐ\nmethod       us mˈɛθəd         uk mˈɛθəd\ncomponent    us kəmpˈoʊnənt    uk kəmpˈəʊnənt\nvariable     us vˈɛɹɪəbəl    uk vˈeəɹɪəbəl\nasync        us ɐsˈɪŋk         uk ɐsˈɪŋk\nimage        us ˈɪmɪdʒ         uk ˈɪmɪdʒ\nnull         us nˈʌl             uk nˈʌl\nUbuntu       us uːbˈuːntuː     uk uːbˈuːntuː\nJSON         us dʒˈeɪsˈɑːn   uk dʒˈeɪsˈɒn\nYAML         us jˈæməl          uk jˈæməl\ndebug        us dˈiːbˌʌɡ      uk dˈiːbˌʌɡ\nrouter       us ɹˈaʊɾɚ        uk ɹˈuːtɐ\nquery        us kwˈiəɹi         uk kwˈiəɹɪ\nboolean      us bˈuːliən        uk bˈuːliən\nstatus       us stˈæɾəs        uk stˈeɪtəs\ndevelop      us dɪvˈɛləp       uk dɪvˈɛləp\nenvironment  us ɛnvˈaɪɹənmənt uk ɛnvˈaɪɹənmənt\n","kho":"actions/cache: 671 commits, 2019-10-17 → 2025-09-24\noh-my-zsh: 192 commits (shallow clone), 2026-07-07 → 2026-11-09\n/usr/share/doc: 628 NEWS/CHANGELOG files\n","node-version":"v22.23.5\n","tu-dau-commit":"    171 Merge\n     95 Update\n     76 Add\n     40 Fix\n     21 Updated\n     21 Bump\n     17 Use\n     11 Create\n      9 Remove\n      7 Upgrade\n      7 Revert\n      6 update\n"};
const KIEMTN = "#!/usr/bin/env node\n// kiem-thuat-ngu.mjs — did the listener hear your tech terms? (Technical English at Work, chapter 7)\n// Usage: node kiem-thuat-ngu.mjs <terms.tsv> <transcript.txt>   compare a Whisper transcript (lesson 6.5, nghe.py) with your list\n//        node kiem-thuat-ngu.mjs <terms.tsv> --csv              export a flashcard file (Anki / Quizlet / CT Language notebook)\n// terms.tsv: one term per line, TAB-separated: term, accepted spellings (regex), IPA, meaning, sentence[, ...]. Lines starting with # are skipped.\n// It checks WORDS, not sounds: Whisper may still guess a badly said word from context, so a ✓ is the minimum, not proof.\nimport { readFileSync } from 'node:fs';\n\nconst [listFile, second] = process.argv.slice(2);\nif (!listFile || !second) {\n  console.error('usage: node kiem-thuat-ngu.mjs <terms.tsv> <transcript.txt> | --csv'); process.exit(2);\n}\nconst terms = readFileSync(listFile, 'utf8').replace(/\\r/g, '').split('\\n')\n  .filter((l) => l.trim() && !l.startsWith('#'))\n  .map((l) => { const [term, accept, ipa, meaning, sentence] = l.split('\\t'); return { term, accept, ipa, meaning, sentence }; });\n\nif (second === '--csv') {\n  const q = (s) => `\"${String(s ?? '').replace(/\"/g, '\"\"')}\"`;\n  console.log('front,back');\n  for (const t of terms) console.log([q(t.term), q(`${t.ipa} · ${t.meaning} · ${t.sentence}`)].join(','));\n  process.exit(0);\n}\n\n// Transcript: lines from nghe.py look like \"[  0.0s ->   2.1s] text\"; keep only the text.\nconst heard = readFileSync(second, 'utf8').split('\\n')\n  .filter((l) => !l.startsWith('---')).map((l) => l.replace(/^\\[[^\\]]*\\]\\s*/, '')).join(' ').toLowerCase();\n// A term counts as heard only if it appears as many times as in your sentences\n// (\"deploy\" in two sentences must be heard twice — one good \"deploy\" cannot hide one bad one).\nconst count = (text, re) => (text.match(new RegExp(`\\\\b(${re})\\\\b`, 'gi')) || []).length;\nconst script = terms.map((t) => t.sentence).join(' ');\nlet ok = 0;\nfor (const [i, t] of terms.entries()) {\n  const found = count(heard, t.accept) >= count(script, t.accept);\n  if (found) ok++;\n  console.log(`${found ? '✓' : '✗'} ${String(i + 1).padStart(2)}. ${t.term.padEnd(11)} ${t.ipa}${found ? '' : '   ← not heard: listen to the model, say it again'}`);\n}\nconst pct = Math.round((ok / terms.length) * 100);\nconsole.log(`--- ${ok}/${terms.length} terms heard (${pct}%)${ok === terms.length ? ' — now ask a person to listen too' : ''}`);\nprocess.exit(ok === terms.length ? 0 : 1);\n";
const DEMTU = "#!/usr/bin/env node\n// dem-tu.mjs — which work words do real teams actually write? (Technical English at Work, chapter 7)\n// Usage: node dem-tu.mjs <file>...   counts each word family below in real text (commit logs, changelogs, postmortems)\n// A word family includes its forms: \"roll out\" also matches \"rolled out\", \"rolling out\", \"rollout\".\nimport { readFileSync } from 'node:fs';\n\nconst FAMILIES = {\n  planning: { estimate: 'estimat(e|es|ed|ing|ion|ions)', scope: 'scope[sd]?', deadline: 'deadlines?', milestone: 'milestones?', requirement: 'requirements?', priority: 'priorit(y|ies|ize|ized|ise|ised)' },\n  coding: { refactor: 'refactor(s|ed|ing)?', deprecate: 'deprecat(e|es|ed|ing|ion)', dependency: 'dependenc(y|ies)', bump: 'bump(s|ed|ing)?', typo: 'typos?', cleanup: 'clean(s|ed|ing)?[- ]?up' },\n  testing: { test: 'tests?|tested|testing', regression: 'regressions?', 'edge case': 'edge[- ]cases?', flaky: 'flak(y|iness)', reproduce: 'reproduc(e|es|ed|ing|ible)|repro' },\n  deploying: { release: 'releases?|released|releasing', deploy: 'deploy(s|ed|ing|ment|ments)?', 'roll out': 'roll(s|ed|ing)?[- ]?outs?', 'roll back': 'roll(s|ed|ing)?[- ]?backs?', revert: 'revert(s|ed|ing)?', hotfix: 'hot[- ]?fix(es|ed)?', migration: 'migrat(e|es|ed|ing|ion|ions)' },\n  incidents: { outage: 'outages?', downtime: 'downtime', 'root cause': 'root[- ]causes?', workaround: 'work[- ]?arounds?', mitigate: 'mitigat(e|es|ed|ing|ion)', incident: 'incidents?', degraded: 'degrad(ed|ation)' },\n  'phrasal verbs': { 'set up': 'set(s|ting)?[- ]?ups?', 'look into': '(look|looks|looked|looking) into', 'follow up': 'follow(s|ed|ing)?[- ]?ups?', 'figure out': 'figur(e|es|ed|ing) out', 'run into': '(run|runs|ran|running) into', 'fall back': 'fall(s|ing)?[- ]?backs?|fell back', 'break down': 'break(s|ing)?[- ]?down|broke down' },\n};\nconst files = process.argv.slice(2);\nif (!files.length) { console.error('usage: node dem-tu.mjs <file>...'); process.exit(2); }\nconst text = files.map((f) => readFileSync(f, 'utf8')).join('\\n');\nconst words = (text.match(/[A-Za-z']+/g) || []).length;\nconsole.log(`${files.length} file(s), ${words} words`);\nfor (const [situation, fam] of Object.entries(FAMILIES)) {\n  const rows = Object.entries(fam).map(([w, re]) => [w, (text.match(new RegExp(`\\\\b(${re})\\\\b`, 'gi')) || []).length]).sort((a, b) => b[1] - a[1]);\n  console.log(`${situation.padEnd(14)} ${rows.map(([w, n]) => `${w} ${n}`).join(' · ')}`);\n}\n";

const lienKet = (href, ico, tieuDe, phu) => `
<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>
</a>`;
const RUN = (key, cmd, nhan) => mau(`$ ${cmd}\n` + OUT[key].replace(/exit=(\d+)\n?$/, '$ echo $?\n$1'), nhan);
const NOTE_RUN = (en) => en ? 'Real output — inside node:22-alpine, Node 22.23.5, no network, 24 Nov 2026.' : 'Output THẬT — chạy trong node:22-alpine, Node 22.23.5, không mạng, 24/11/2026.';
const NOTE_AM = (en) => en ? 'Real output — eSpeak NG 1.52.0 speaks, faster-whisper 1.2.1 (model small.en, CPU) writes what it heard (nghe.py, lesson 6.5). 24 Nov 2026.' : 'Output THẬT — eSpeak NG 1.52.0 đọc, faster-whisper 1.2.1 (mô hình small.en, CPU) ghi lại điều nó nghe được (nghe.py, bài 6.5). 24/11/2026.';
/** Phiên âm máy (espeak-ng --ipa) của một từ, giọng us/uk. */
const IPA = (w, g = 'us') => { const l = OUT.ipa.split('\n').find((x) => x.startsWith(w + ' ')) || ''; const m = l.match(/us (\S+)\s+uk (\S+)/); return m ? (g === 'us' ? m[1] : m[2]) : '?'; };
/** Dòng của out/72-don.txt: từ, cách đọc sai, Whisper nghe bản đúng, Whisper nghe bản sai. */
const DON = OUT['72-don'].trim().split('\n').map((l) => l.split('\t'));
/** 100 mẫu câu: [nhóm, mẫu, nghĩa, dùng ở đâu]. */
const MAU100 = EM['100-mau-cau.tsv'].trim().split('\n').filter((l) => !l.startsWith('#')).map((l) => l.split('\t'));
const NHOM100 = [...new Set(MAU100.map((r) => r[0]))];
const tenNhom = (n) => n.replace(/^\d+ /, '');

/* ═════════════ 7.1 — Từ vựng theo tình huống ═════════════ */
const L71 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 7 · Vocabulary' : 'Chương 7 · Từ vựng'}</span>
<h2>${en ? '7.1 — Vocabulary by situation: planning, coding, testing, deploying, incidents' : '7.1 — Từ vựng theo tình huống: lên kế hoạch, viết code, kiểm thử, triển khai, sự cố'}</h2>
<p class="lead">${en
    ? 'You do not need ten thousand words to work in English. You need about a hundred work words, used in the right situation, with the right partner words around them. This lesson groups those words by the five moments of a project, shows from real commit logs and changelogs which ones teams actually write, and fixes the word pairs Vietnamese developers mix up most (deploy/release, rollback/revert, hotfix/workaround, outage/downtime).'
    : 'Bạn không cần mười nghìn từ để đi làm bằng tiếng Anh. Bạn cần khoảng một trăm từ nghề, dùng đúng tình huống, đi kèm đúng những từ bạn của nó. Bài này xếp các từ đó theo năm thời điểm của một dự án, dùng lịch sử commit và changelog THẬT để xem đội phần mềm thật sự hay viết từ nào, và sửa những cặp từ người Việt hay lẫn nhất (deploy/release, rollback/revert, hotfix/workaround, outage/downtime).'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A plumber’s toolbox has a few dozen tools, not thousands, and each one lives in the drawer for the job: cutting, sealing, measuring. Nobody learns tools alphabetically. Work vocabulary is the same: learn it by drawer (situation), and learn each word with the words it always sits next to — you <em>roll back</em> a deployment, you <em>reproduce</em> a bug, you <em>estimate</em> a task, you <em>mitigate</em> an incident.'
    : 'Hộp đồ nghề của thợ nước chỉ có vài chục món, không phải hàng nghìn, và mỗi món nằm đúng ngăn của việc: cắt, bịt, đo. Không ai học dụng cụ theo thứ tự chữ cái. Từ vựng đi làm cũng vậy: học theo ngăn (tình huống), và học mỗi từ cùng những từ luôn đứng cạnh nó — bạn <em>roll back</em> một lần triển khai, <em>reproduce</em> một lỗi, <em>estimate</em> một task, <em>mitigate</em> một sự cố.'}</p>

<h3>${en ? 'Situation: one message, six almost-right phrases' : 'Tình huống: một tin nhắn, sáu cụm gần đúng'}</h3>
<p>${en
    ? 'Friday evening, the reservation feature of LabFlow 2.0 breaks right after it goes to the client’s server. An posts in the project channel:'
    : 'Tối thứ Sáu, chức năng đặt trước thiết bị của LabFlow 2.0 hỏng ngay sau khi lên máy chủ của khách. An nhắn vào kênh dự án:'}</p>
${mau(`Server is die after release. I will rollback the hotfix in downtime and
feedback to customer. Many informations in the log, I am solving the bug.`, en ? 'What An wrote.' : 'An viết.')}
<p>${en
    ? 'Every word is "almost" right, which is the problem: the reader has to guess. Is the server down, or only slow? Was it a release or a deployment? Rollback of which version? Is there downtime planned, or is the outage itself the downtime? Here is the same message with work words used precisely:'
    : 'Từ nào cũng "gần đúng", và đó chính là vấn đề: người đọc phải đoán. Máy chủ sập hẳn hay chỉ chậm? Là release hay một lần deploy? Roll back về bản nào? Có downtime theo kế hoạch hay chính sự cố là downtime? Đây là cùng tin nhắn đó với từ nghề dùng chính xác:'}</p>
${mau(`Reservations are down on production since the 18:05 ICT deployment (v2.3.0):
every booking returns HTTP 500. I'm rolling back to v2.2.4 now (about 10 min).
Root cause unknown yet; the log shows a missing column error. I'll post an
update by 18:45 ICT and send the client a short summary after that.`, en ? 'Rewritten.' : 'Viết lại.')}
${saiDung([
    ['Server is die', 'Reservations are <strong>down</strong> / the server is <strong>down</strong>', en ? '"die" is a verb; a service is <em>down</em>, <em>degraded</em> or <em>slow</em> — say which.' : '"die" là động từ; dịch vụ thì <em>down</em> (sập), <em>degraded</em> (chạy kém) hay <em>slow</em> — nói rõ cái nào.'],
    ['I will rollback', 'I’m <strong>rolling back</strong> to v2.2.4', en ? 'Verb = two words (roll back); noun = one word (a rollback). Always say back <em>to what</em>.' : 'Động từ = hai chữ (roll back); danh từ = một chữ (a rollback). Luôn nói về <em>bản nào</em>.'],
    ['in downtime', 'now (about 10 min)', en ? '<em>Downtime</em> is the time a system is unavailable — planned or not. Give the time instead.' : '<em>Downtime</em> là khoảng thời gian hệ thống không dùng được — có kế hoạch hay không. Nói thời gian cụ thể.'],
    ['feedback to customer', 'send the client a short summary', en ? '<em>Feedback</em> is a noun in normal English (give feedback). "Client" is the company paying for the project.' : '<em>Feedback</em> là danh từ (give feedback), không dùng làm động từ. "Client" là công ty thuê làm dự án.'],
    ['Many informations', 'the log shows …', en ? '<em>Information</em> is uncountable — and the reader wants the one useful line, not "many".' : '<em>Information</em> không đếm được — và người đọc cần đúng một dòng có ích, không cần "nhiều".'],
    ['I am solving the bug', 'Root cause unknown yet', en ? 'You <em>fix</em> a bug and <em>solve</em> a problem; here the honest status is "cause unknown".' : 'Lỗi thì <em>fix</em>, vấn đề thì <em>solve</em>; ở đây trạng thái thật là "chưa rõ nguyên nhân".'],
  ], en)}

<h3>${en ? 'Real data: which words do teams actually write?' : 'Dữ liệu thật: đội phần mềm thật sự viết từ nào?'}</h3>
<p>${en
    ? 'Word lists in books are guesses. To see real usage, the chapter tool <code>dem-tu.mjs</code> (source below) counts word families — "roll back" also matches "rolled back" and "rollback" — in two real collections on the author’s machine:'
    : 'Danh sách từ trong sách là phỏng đoán. Để thấy cách dùng thật, công cụ <code>dem-tu.mjs</code> của chương (mã nguồn ở dưới) đếm theo họ từ — "roll back" khớp cả "rolled back" và "rollback" — trong hai kho chữ thật trên máy tác giả:'}</p>
${mau(OUT.kho, en ? 'The two collections.' : 'Hai kho chữ.')}
${RUN('dem-commit', 'node dem-tu.mjs kho/actions-cache-log.txt kho/oh-my-zsh-log.txt', en ? 'Commit messages (subject + body) of GitHub’s actions/cache and of oh-my-zsh. ' + NOTE_RUN(en) : 'Commit message (tiêu đề + thân) của actions/cache (GitHub) và oh-my-zsh. ' + NOTE_RUN(en))}
${RUN('dem-doc', 'node dem-tu.mjs kho/usr-share-doc.txt', en ? 'Release notes: 628 NEWS/CHANGELOG files of the software installed on a Fedora machine. ' + NOTE_RUN(en) : 'Ghi chú phát hành: 628 tệp NEWS/CHANGELOG của phần mềm cài trên một máy Fedora. ' + NOTE_RUN(en))}
<p>${en
    ? 'And the first word of every commit subject in actions/cache — the verbs real engineers start with:'
    : 'Và chữ đầu tiên của mọi tiêu đề commit trong actions/cache — những động từ kỹ sư thật hay mở đầu:'}</p>
${mau(`$ git log --format=%s | awk '{print $1}' | sed 's/[:(].*//' | sort | uniq -c | sort -rn | head -12\n` + OUT['tu-dau-commit'], en ? 'Real output, repository actions/cache, 24 Nov 2026.' : 'Output THẬT, kho actions/cache, 24/11/2026.')}
${mau(`$ git log --format=%s | grep -iE '\\b(revert|roll ?back|hotfix|workaround|regression)' | head -8\n` + OUT['commit-vi-du'], en ? 'Real subjects that use deployment/incident words.' : 'Tiêu đề thật có dùng từ triển khai/sự cố.')}
<p>${en ? 'What the numbers teach:' : 'Những con số dạy gì:'}</p>
<ul>
<li>${en
    ? '<strong>Each document type has its own vocabulary.</strong> Commit logs are full of <em>update, add, fix, bump, dependency, release, revert</em>; release notes add <em>deprecate, regression, workaround, fall back</em>; incident words (<em>outage, downtime, root cause, mitigate</em>) are almost absent — they live in postmortems and status pages, which is why this lesson studies three real postmortems below.'
    : '<strong>Mỗi loại tài liệu có bộ từ riêng.</strong> Commit log đầy <em>update, add, fix, bump, dependency, release, revert</em>; release notes thêm <em>deprecate, regression, workaround, fall back</em>; từ sự cố (<em>outage, downtime, root cause, mitigate</em>) gần như vắng mặt — chúng sống ở postmortem và trang trạng thái, vì thế phía dưới bài đọc ba postmortem thật.'}</li>
<li>${en
    ? '<strong>"Bump" is everywhere</strong> (112 times in actions/cache, 1,752 in release notes): it means "raise a version number". Many of these come from Dependabot, the bot that opens pull requests to update libraries — in actions/cache, 10 of the 21 commit subjects starting with "Bump" are by dependabot[bot] ("Bump minimatch from 3.0.4 to 3.1.2"). You will read it daily and rarely see it in a dictionary.'
    : '<strong>"Bump" ở khắp nơi</strong> (112 lần trong actions/cache, 1.752 lần trong release notes): nghĩa là "nâng số phiên bản". Nhiều dòng trong số đó đến từ Dependabot, con bot tự mở pull request cập nhật thư viện — trong actions/cache, 10/21 tiêu đề commit bắt đầu bằng "Bump" là của dependabot[bot] ("Bump minimatch from 3.0.4 to 3.1.2"). Bạn sẽ đọc nó mỗi ngày mà từ điển phổ thông ít khi ghi.'}</li>
<li>${en
    ? '<strong>Phrasal verbs are real work words</strong>: <em>set up</em> and <em>fall back</em> appear more than a thousand times each in release notes. <em>Look into</em> and <em>follow up</em> are rare in written logs but constant in chat and meetings ("I’ll look into it", "I’ll follow up tomorrow") — the counter only sees writing.'
    : '<strong>Cụm động từ là từ nghề thật</strong>: <em>set up</em> và <em>fall back</em> xuất hiện hơn một nghìn lần mỗi từ trong release notes. <em>Look into</em> và <em>follow up</em> hiếm trong log viết nhưng có liên tục trong chat và họp ("I’ll look into it", "I’ll follow up tomorrow") — bộ đếm chỉ thấy chữ viết.'}</li>
<li>${en
    ? '<strong>Some words you expect are rare.</strong> <em>Hotfix</em> appears once in 671 commits; <em>deploy</em> only 106 times in six million words of release notes, against 12,766 for <em>release</em>. Open-source projects <em>release</em> versions; companies <em>deploy</em> them to their servers. Know both, and use the right one (table below).'
    : '<strong>Có từ bạn tưởng phổ biến mà lại hiếm.</strong> <em>Hotfix</em> chỉ có một lần trong 671 commit; <em>deploy</em> chỉ 106 lần trong sáu triệu từ release notes, so với 12.766 lần <em>release</em>. Dự án mã nguồn mở <em>release</em> phiên bản; công ty <em>deploy</em> phiên bản lên máy chủ của mình. Biết cả hai và dùng đúng (bảng dưới).'}</li>
</ul>
<details><summary>${en ? 'Source of dem-tu.mjs (Node, no packages)' : 'Mã nguồn dem-tu.mjs (Node, không cần gói)'}</summary>${mau(DEMTU)}
<p>${en
    ? 'Try it on your own team’s history: <code>git log --format=\'%s%n%b\' &gt; log.txt</code>, then <code>node dem-tu.mjs log.txt</code>. Add the words of your project to <code>FAMILIES</code>.'
    : 'Thử trên lịch sử của chính nhóm bạn: <code>git log --format=\'%s%n%b\' &gt; log.txt</code>, rồi <code>node dem-tu.mjs log.txt</code>. Thêm từ của dự án bạn vào <code>FAMILIES</code>.'}</p></details>

<h3>${en ? 'The five drawers' : 'Năm ngăn từ'}</h3>
<p>${en
    ? 'Each table gives the word, the meaning in a software project, and a sentence you can reuse as it is. Words in the same row of a sentence are the "partners" to learn together.'
    : 'Mỗi bảng có từ, nghĩa trong dự án phần mềm, và một câu dùng lại được nguyên văn. Những chữ đứng cạnh từ trong câu là "từ bạn" cần học cùng.'}</p>
<h4>1. ${en ? 'Planning' : 'Lên kế hoạch'}</h4>
${tuVung([
    ['estimate (n, v)', en ? 'how long you think a task takes — a guess, not a promise' : 'ước lượng thời gian — là phỏng đoán, không phải lời hứa', 'My estimate for LAB-315 is two days.'],
    ['deadline', en ? 'the date by which it must be done' : 'hạn chót phải xong', 'The deadline for UAT is 4 December.'],
    ['scope', en ? 'what is included in the work' : 'phạm vi công việc', 'Export to PDF is out of scope for phase 1.'],
    ['requirement', en ? 'something the system must do' : 'yêu cầu hệ thống phải đáp ứng', 'This requirement is not in the SRS.'],
    ['priority / prioritize', en ? 'what comes first' : 'độ ưu tiên / xếp ưu tiên', 'Could you prioritize these three tickets?'],
    ['milestone', en ? 'an important checkpoint in the plan' : 'mốc quan trọng của kế hoạch', 'Milestone 2 is the first client demo.'],
    ['capacity', en ? 'how much work the team can take in a sprint' : 'lượng việc đội nhận được trong một sprint', 'We are at full capacity this sprint.'],
    ['dependency', en ? 'a task that must wait for another task' : 'việc phải chờ việc khác', 'LAB-320 has a dependency on the API team.'],
    ['trade-off', en ? 'you gain one thing and lose another' : 'được cái này mất cái kia', 'The trade-off is speed versus test coverage.'],
    ['ETA', en ? 'estimated time of arrival — when it will be ready' : 'dự kiến lúc nào xong', 'What is the ETA for the fix?'],
  ], en)}
<h4>2. ${en ? 'Coding' : 'Viết code'}</h4>
${tuVung([
    ['implement', en ? 'write the code that makes a feature work' : 'hiện thực, viết mã cho tính năng', 'I implemented the conflict check.'],
    ['refactor', en ? 'change the structure without changing behaviour' : 'sắp xếp lại mã, không đổi hành vi', 'I refactored the service; no behaviour change.'],
    ['deprecate', en ? 'mark as "do not use, will be removed"' : 'đánh dấu "sắp bỏ, đừng dùng"', 'The v1 endpoint is deprecated and will be removed in June.'],
    ['bump', en ? 'raise a version number' : 'nâng số phiên bản', 'Bump express from 4.19.2 to 4.21.0.'],
    ['dependency', en ? 'a library your code needs' : 'thư viện mã cần dùng', 'Remove the unused dependency.'],
    ['hard-code', en ? 'put a fixed value in the code instead of config' : 'viết cứng giá trị trong mã', 'Don’t hard-code the API key.'],
    ['edge case', en ? 'an unusual input at the limit' : 'trường hợp biên', 'An empty list is an edge case we missed.'],
    ['tech debt', en ? 'shortcuts that cost time later' : 'nợ kỹ thuật', 'This TODO is tech debt; I created LAB-330.'],
    ['legacy code', en ? 'old code still in use' : 'mã cũ vẫn đang chạy', 'The legacy code has no tests.'],
    ['typo', en ? 'a spelling mistake' : 'lỗi gõ nhầm', 'Fix typo in README.'],
  ], en)}
<h4>3. ${en ? 'Testing' : 'Kiểm thử'}</h4>
${tuVung([
    ['reproduce (repro)', en ? 'make a bug happen again on purpose' : 'tái hiện lỗi', 'I can reproduce it on Chrome but not on Firefox.'],
    ['regression', en ? 'something that used to work and broke' : 'chức năng đang chạy tốt bị hỏng lại', 'This is a regression from v2.2.'],
    ['test case / test suite', en ? 'one check / a whole set of checks' : 'một ca kiểm / cả bộ kiểm', 'The test suite has 214 test cases.'],
    ['pass / fail', en ? 'the result of a test' : 'đạt / trượt', 'All tests pass on CI.'],
    ['flaky test', en ? 'a test that fails sometimes for no code reason' : 'bài kiểm lúc qua lúc trượt', 'This flaky test fails one run in ten.'],
    ['expected / actual', en ? 'what should happen / what happened' : 'mong đợi / thực tế', 'Expected: 200. Actual: 500.'],
    ['coverage', en ? 'how much code the tests run' : 'độ phủ của bài kiểm', 'Coverage dropped to 71%.'],
    ['smoke test', en ? 'a quick check that the basics work' : 'kiểm nhanh phần cơ bản', 'I ran a smoke test after the deployment.'],
    ['UAT', en ? 'user acceptance testing — the client tests' : 'khách nghiệm thu', 'UAT starts on Monday.'],
    ['blocker (bug)', en ? 'a bug that stops release or testing' : 'lỗi chặn phát hành/kiểm thử', 'This is a blocker for UAT.'],
  ], en)}
<h4>4. ${en ? 'Deploying' : 'Triển khai'}</h4>
${tuVung([
    ['release (n, v)', en ? 'a version made available' : 'phiên bản được phát hành', 'Release 2.3.0 includes the reservation module.'],
    ['deploy / deployment', en ? 'put a version on a server/environment' : 'đưa phiên bản lên máy chủ/môi trường', 'I deployed 2.3.0 to staging.'],
    ['staging / production', en ? 'the copy for testing / the real system users use' : 'môi trường thử / hệ thống thật', 'It works on staging but fails on production.'],
    ['roll out', en ? 'release gradually or to everyone' : 'tung ra dần hoặc cho tất cả', 'We will roll out the feature to 10% of users first.'],
    ['roll back (v) / rollback (n)', en ? 'go back to the previous version' : 'quay về phiên bản trước', 'We rolled back to 2.2.4.'],
    ['revert', en ? 'undo a specific commit (git revert)' : 'đảo một commit cụ thể', 'I reverted commit 3f2a9c1.'],
    ['hotfix', en ? 'an urgent fix released outside the normal schedule' : 'bản sửa gấp ngoài lịch', 'We shipped a hotfix the same night.'],
    ['migration', en ? 'a script that changes the database structure' : 'kịch bản đổi cấu trúc CSDL', 'The migration adds a column to reservations.'],
    ['feature flag', en ? 'a switch to turn a feature on/off without deploying' : 'công tắc bật/tắt tính năng', 'The feature is behind a flag.'],
    ['code freeze', en ? 'no new changes before a release' : 'ngừng nhận thay đổi trước phát hành', 'Code freeze starts Thursday 17:00 ICT.'],
  ], en)}
<h4>5. ${en ? 'Incidents' : 'Sự cố'}</h4>
${tuVung([
    ['incident', en ? 'an unplanned event that hurts users' : 'sự cố ngoài kế hoạch ảnh hưởng người dùng', 'We are handling an incident on the booking API.'],
    ['outage', en ? 'the service does not work at all' : 'dịch vụ sập hoàn toàn', 'The outage lasted 25 minutes.'],
    ['degraded', en ? 'works, but slowly or partly' : 'vẫn chạy nhưng chậm/thiếu', 'Search is degraded; booking works.'],
    ['downtime', en ? 'time the system is unavailable (planned or not)' : 'thời gian không dùng được', 'We need 15 minutes of planned downtime.'],
    ['impact', en ? 'who is affected and how' : 'ai bị ảnh hưởng, thế nào', 'Impact: about 300 students cannot book.'],
    ['mitigate', en ? 'reduce the damage now, before the real fix' : 'giảm thiệt hại trước khi sửa tận gốc', 'We mitigated it by disabling reminders.'],
    ['workaround', en ? 'a way to avoid the problem without fixing it' : 'cách đi vòng, chưa sửa', 'Workaround: book from the web, not the app.'],
    ['root cause', en ? 'the real reason underneath' : 'nguyên nhân gốc', 'The root cause was a missing index.'],
    ['escalate', en ? 'pass to someone with more authority/skill' : 'chuyển lên cấp cao hơn', 'I escalated it to the tech lead.'],
    ['postmortem', en ? 'the written review after an incident' : 'báo cáo rút kinh nghiệm sau sự cố', 'The postmortem is blameless.'],
  ], en)}

<h3>${en ? 'The pairs that get mixed up' : 'Những cặp hay bị lẫn'}</h3>
<table>
<thead><tr><th>${en ? 'Pair' : 'Cặp'}</th><th>${en ? 'Difference' : 'Khác nhau'}</th><th>${en ? 'Test sentence' : 'Câu thử'}</th></tr></thead>
<tbody>
<tr><td><strong>release</strong> vs <strong>deploy</strong></td><td>${en ? 'A release is a version (2.3.0). A deployment puts a version on one environment. One release can be deployed many times (staging, then production).' : 'Release là một phiên bản (2.3.0). Deploy là đưa phiên bản lên một môi trường. Một release có thể deploy nhiều lần (staging rồi production).'}</td><td><em>We deployed release 2.3.0 to production.</em></td></tr>
<tr><td><strong>roll back</strong> vs <strong>revert</strong></td><td>${en ? 'Roll back = run the previous version again (fast, whole system). Revert = a new commit that undoes one commit (then you deploy it).' : 'Roll back = chạy lại bản trước (nhanh, cả hệ thống). Revert = một commit mới đảo ngược một commit (rồi mới deploy).'}</td><td><em>We rolled back first, then reverted the bad commit.</em></td></tr>
<tr><td><strong>hotfix</strong> vs <strong>patch</strong> vs <strong>workaround</strong></td><td>${en ? 'Hotfix = urgent fix outside the schedule. Patch = a small fix version (2.3.1). Workaround = no fix yet, just a way around.' : 'Hotfix = sửa gấp ngoài lịch. Patch = bản sửa nhỏ (2.3.1). Workaround = chưa sửa, chỉ là đường vòng.'}</td><td><em>Until the hotfix, use the workaround.</em></td></tr>
<tr><td><strong>outage</strong> vs <strong>degraded</strong> vs <strong>downtime</strong></td><td>${en ? 'Outage = not working. Degraded = working badly. Downtime = the length of time it was unavailable (also planned maintenance).' : 'Outage = không chạy. Degraded = chạy kém. Downtime = khoảng thời gian không dùng được (kể cả bảo trì có kế hoạch).'}</td><td><em>No outage, but search was degraded for 20 minutes.</em></td></tr>
<tr><td><strong>bug</strong> / <strong>defect</strong> / <strong>issue</strong> / <strong>incident</strong></td><td>${en ? 'Bug = developers’ word; defect = testers’/formal word (same thing); issue = any ticket (bug, task, question); incident = something happening to users now.' : 'Bug = từ của dev; defect = từ của tester/văn bản chính thức (cùng nghĩa); issue = mọi ticket (lỗi, việc, câu hỏi); incident = chuyện đang xảy ra với người dùng.'}</td><td><em>QA logged 12 defects; one caused an incident.</em></td></tr>
<tr><td><strong>estimate</strong> vs <strong>deadline</strong></td><td>${en ? 'Estimate comes from you (a guess). Deadline comes from the plan or the client (a commitment).' : 'Estimate do bạn đưa ra (phỏng đoán). Deadline đến từ kế hoạch hoặc khách (cam kết).'}</td><td><em>My estimate is 3 days, so we will miss the deadline.</em></td></tr>
<tr><td><strong>fix</strong> vs <strong>solve</strong></td><td>${en ? 'You fix a bug or a test; you solve a problem or a puzzle.' : 'Bug/test thì fix; problem/bài toán thì solve.'}</td><td><em>I fixed the bug, which solved the login problem.</em></td></tr>
<tr><td><strong>client</strong> vs <strong>customer</strong> vs <strong>user</strong></td><td>${en ? 'Client = the company that pays for the project (outsourcing). Customer = who buys a product. User = who uses the system.' : 'Client = công ty thuê làm dự án (outsourcing). Customer = người mua sản phẩm. User = người dùng hệ thống.'}</td><td><em>The client wants students (users) to book from the app.</em></td></tr>
</tbody>
</table>

<h3>${en ? 'Phrasal verbs, and the space that changes the word' : 'Cụm động từ, và dấu cách làm đổi từ loại'}</h3>
<p>${en
    ? 'Many work verbs have two parts. Written as two words they are verbs; joined (or hyphenated) they become nouns or adjectives. Reviewers notice this, and so do grammar checkers.'
    : 'Nhiều động từ nghề có hai phần. Viết hai chữ là động từ; viết liền (hoặc gạch nối) thành danh từ hay tính từ. Người review để ý điều này, công cụ kiểm ngữ pháp cũng vậy.'}</p>
<table>
<thead><tr><th>${en ? 'Verb (two words)' : 'Động từ (hai chữ)'}</th><th>${en ? 'Noun / adjective' : 'Danh từ / tính từ'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
<tr><td>set up</td><td>setup</td><td><em>I set up the database. The setup takes 5 minutes.</em></td></tr>
<tr><td>roll back</td><td>rollback</td><td><em>We rolled back. The rollback took 3 minutes.</em></td></tr>
<tr><td>log in</td><td>login</td><td><em>Log in with your FPT account. The login page is slow.</em></td></tr>
<tr><td>back up</td><td>backup</td><td><em>Back up the database before the migration. The backup is in S3.</em></td></tr>
<tr><td>shut down</td><td>shutdown</td><td><em>Shut down the old server. The shutdown is planned for Sunday.</em></td></tr>
<tr><td>check out</td><td>checkout</td><td><em>Check out the branch. The checkout page has a bug.</em></td></tr>
<tr><td>fall back</td><td>fallback</td><td><em>It falls back to email. The fallback is email.</em></td></tr>
<tr><td>follow up</td><td>follow-up</td><td><em>I’ll follow up tomorrow. Here is a follow-up question.</em></td></tr>
</tbody>
</table>
${tuVung([
    ['look into', en ? 'investigate' : 'tìm hiểu, điều tra', 'I’ll look into the timeout this afternoon.'],
    ['figure out', en ? 'find the answer after thinking/trying' : 'tìm ra (sau khi thử)', 'I figured out why the test was flaky.'],
    ['run into', en ? 'meet a problem unexpectedly' : 'gặp phải (vấn đề)', 'I ran into a CORS error on staging.'],
    ['break down', en ? 'split a big task into small ones' : 'chia nhỏ việc lớn', 'Let’s break down the epic into five stories.'],
    ['hand over / take over', en ? 'give your work to someone / receive it' : 'bàn giao / nhận bàn giao', 'Minh will take over LAB-315 while I’m off.'],
    ['carry over', en ? 'move unfinished work to the next sprint' : 'chuyển việc dở sang sprint sau', 'Two stories were carried over to Sprint 7.'],
    ['push back', en ? 'disagree with / delay' : 'phản đối / dời lại', 'The client pushed back on the new deadline.'],
    ['sign off (on)', en ? 'give final approval' : 'duyệt chính thức', 'The client signed off on the design.'],
    ['bring up', en ? 'mention a topic in a meeting' : 'nêu ra (trong họp)', 'I’ll bring it up at the retro.'],
    ['sort out', en ? 'fix a messy situation' : 'giải quyết cho ổn', 'We sorted out the access problem.'],
  ], en)}

<h3>${en ? 'Uncountable words in IT' : 'Danh từ không đếm được trong IT'}</h3>
<p>${en
    ? 'Vietnamese has no plural ending, so learners often add "-s" everywhere — or nowhere. These IT words are uncountable in standard English: no "-s", no "a/an". Use a counter word when you need a number.'
    : 'Tiếng Việt không có đuôi số nhiều, nên người học hay thêm "-s" khắp nơi — hoặc bỏ hết. Các từ IT sau không đếm được trong tiếng Anh chuẩn: không "-s", không "a/an". Cần đếm thì dùng từ chỉ đơn vị.'}</p>
${saiDung([
    ['informations, an information', 'information · a piece of information', en ? 'uncountable' : 'không đếm được'],
    ['feedbacks', 'feedback · two pieces of feedback · two comments', en ? 'uncountable' : 'không đếm được'],
    ['softwares, hardwares', 'software · two applications / tools', en ? 'uncountable' : 'không đếm được'],
    ['equipments', 'equipment · three devices', en ? 'uncountable (the LabFlow spec says "equipment items")' : 'không đếm được (spec LabFlow viết "equipment items")'],
    ['documentations', 'documentation · two documents / pages', en ? 'uncountable' : 'không đếm được'],
    ['advices', 'advice · a tip · a suggestion', en ? 'uncountable' : 'không đếm được'],
    ['codes (meaning source code)', 'code · three files · 200 lines of code', en ? '"codes" only for separate codes: error codes, discount codes' : '"codes" chỉ dùng cho các mã riêng lẻ: error codes, discount codes'],
    ['the data are / the data is', 'the data is (both are accepted at work)', en ? 'formal science writing uses "are"; software teams almost always say "is"' : 'văn khoa học trang trọng dùng "are"; đội phần mềm gần như luôn nói "is"'],
  ], en)}

<h3>${en ? 'Real incidents, read with these words' : 'Sự cố thật, đọc bằng chính những từ này'}</h3>
<p>${en
    ? 'Public postmortems are the best free reading for the incident drawer: real engineers, careful words, no marketing. Read each one and notice which words from the tables appear.'
    : 'Postmortem công khai là tài liệu đọc miễn phí tốt nhất cho ngăn "sự cố": kỹ sư thật, chữ dùng cẩn thận, không quảng cáo. Đọc từng vụ và để ý những từ trong các bảng trên xuất hiện ở đâu.'}</p>
<ul>
<li>${en
    ? '<strong>CrowdStrike, 19 July 2024.</strong> A <em>content update</em> (Channel File 291) for the Falcon sensor was pushed at 04:09 UTC and <em>reverted</em> at 05:27 UTC, but Windows machines that had received it crashed in a loop — about 8.5 million devices according to Microsoft, grounding flights and stopping hospitals. The <em>workaround</em> was manual: boot into Safe Mode and delete the file. The <em>root cause analysis</em> (6 August 2024) found a mismatch: the template defined 21 input fields but the sensor code supplied 20, causing an out-of-bounds memory read. Words: content update, revert, workaround, root cause, impact, staggered rollout (what they promised next).'
    : '<strong>CrowdStrike, 19/7/2024.</strong> Một <em>content update</em> (Channel File 291) cho cảm biến Falcon được đẩy lúc 04:09 UTC và <em>revert</em> lúc 05:27 UTC, nhưng máy Windows nào đã nhận thì sập lặp vòng — khoảng 8,5 triệu máy theo Microsoft, máy bay phải nằm đất, bệnh viện ngừng việc. <em>Workaround</em> phải làm tay: khởi động vào Safe Mode rồi xoá tệp. Bản <em>root cause analysis</em> (6/8/2024) chỉ ra chỗ lệch: mẫu định nghĩa 21 trường đầu vào nhưng mã cảm biến chỉ đưa 20 giá trị, dẫn tới đọc bộ nhớ ngoài vùng. Từ cần để ý: content update, revert, workaround, root cause, impact, staggered rollout (biện pháp họ hứa làm sau đó).'}</li>
<li>${en
    ? '<strong>GitHub, 21 October 2018.</strong> During routine maintenance, the network link between the US East Coast hub and the main data centre was lost for 43 seconds. The database system <em>failed over</em> to the US West Coast, the two sides disagreed about the data, and GitHub chose to keep data correct rather than fast: the service was <em>degraded</em> for 24 hours and 11 minutes. Words: maintenance, failover, degraded, data integrity, post-incident analysis.'
    : '<strong>GitHub, 21/10/2018.</strong> Trong lúc bảo trì định kỳ, đường mạng giữa trung tâm mạng bờ Đông nước Mỹ và trung tâm dữ liệu chính mất 43 giây. Hệ CSDL tự <em>fail over</em> sang bờ Tây, hai bên lệch dữ liệu, và GitHub chọn giữ dữ liệu đúng thay vì nhanh: dịch vụ <em>degraded</em> suốt 24 giờ 11 phút. Từ cần để ý: maintenance, failover, degraded, data integrity, post-incident analysis.'}</li>
<li>${en
    ? '<strong>Cloudflare, 2 July 2019.</strong> A new firewall rule with a badly written regular expression was <em>deployed globally</em> at once; the expression used 100% CPU on every server and visitors saw 502 errors for about 27 minutes, until the team did a "global kill" of that rule set. Words: deploy, global, CPU exhaustion, 502, kill switch — and the lesson they wrote: <em>roll out</em> rule changes gradually.'
    : '<strong>Cloudflare, 2/7/2019.</strong> Một luật tường lửa mới chứa biểu thức chính quy viết kém được <em>deploy toàn cầu</em> cùng lúc; biểu thức ăn 100% CPU trên mọi máy chủ và người truy cập thấy lỗi 502 khoảng 27 phút, cho tới khi đội tắt hẳn ("global kill") bộ luật đó. Từ cần để ý: deploy, global, CPU exhaustion, 502, kill switch — và bài học họ viết: <em>roll out</em> thay đổi luật từ từ.'}</li>
</ul>
<p>${en
    ? 'Notice the pattern: in all three, the fix that stopped the damage (revert, failover decision, kill switch) came before the root cause was understood. That is exactly the difference between <em>mitigate</em> and <em>fix</em>, and why an incident update says "mitigated" first and "resolved" later.'
    : 'Để ý điểm chung: cả ba vụ, bước chặn thiệt hại (revert, quyết định fail over, công tắc tắt) đến TRƯỚC khi hiểu nguyên nhân gốc. Đó chính là khác biệt giữa <em>mitigate</em> và <em>fix</em>, và vì sao bản cập nhật sự cố ghi "mitigated" trước rồi mới tới "resolved".'}</p>

<h3>${en ? 'At work: OJT situations' : 'Đi làm: tình huống OJT'}</h3>
<ul>
<li>${en
    ? 'Your Japanese client writes "Please do not release on Friday." Ask: do they mean deploy to production, or publish the version to their users? On outsourcing projects the client often uses "release" for "deploy to production". Confirm with lesson 5.2: "Just to confirm: no deployment to production on Fridays. Is that correct?"'
    : 'Khách Nhật viết "Please do not release on Friday." Hãy hỏi: họ muốn nói deploy lên production, hay công bố phiên bản cho người dùng của họ? Ở dự án outsourcing khách hay dùng "release" theo nghĩa "deploy lên production". Xác nhận bằng mẫu bài 5.2: "Just to confirm: no deployment to production on Fridays. Is that correct?"'}</li>
<li>${en
    ? 'Your leader asks "Is it a regression?" They want to know: did it work in the last release? Check with <code>git log</code> or the previous build before answering yes.'
    : 'Trưởng nhóm hỏi "Is it a regression?" Họ muốn biết: ở bản trước nó có chạy không? Kiểm bằng <code>git log</code> hoặc bản build trước rồi mới trả lời "yes".'}</li>
<li>${en
    ? 'In a ticket, "Resolved" and "Closed" are different statuses (lesson 2.3): resolved = the fix is done; closed = someone verified it. Incident updates use the same idea: mitigated → resolved → postmortem published.'
    : 'Trong ticket, "Resolved" và "Closed" là hai trạng thái khác nhau (bài 2.3): resolved = đã sửa xong; closed = đã có người kiểm lại. Cập nhật sự cố cũng cùng ý: mitigated → resolved → postmortem published.'}</li>
</ul>

<h3>${en ? 'Practice' : 'Bài luyện'}</h3>
<p><strong>${en ? 'A. Choose the right word (10 sentences).' : 'A. Chọn từ đúng (10 câu).'}</strong></p>
${mau(`1. We (deployed / released) version 2.3.0 to staging this morning.
2. The bug is a (regression / defect) — it worked in 2.2.4.
3. Until the fix is ready, please use this (hotfix / workaround): book from the web.
4. Search was (down / degraded) for 20 minutes: slow, but it worked.
5. I'll (rollback / roll back) to 2.2.4 now.
6. My (estimate / deadline) is two days, but the (estimate / deadline) is tomorrow.
7. Thanks for your (feedback / feedbacks).
8. Export to PDF is (out of scope / out of requirement) for phase 1.
9. The (setup / set up) script fails on Windows.
10. We (mitigated / solved) the incident by turning off reminders; the root cause is still unknown.`)}
<details><summary>${en ? 'Answers' : 'Đáp án'}</summary>${mau(`1. deployed (a version goes to an environment)
2. regression (it used to work)
3. workaround (not a fix yet)
4. degraded (working badly, not down)
5. roll back (verb = two words)
6. estimate … deadline
7. feedback (uncountable)
8. out of scope
9. setup (noun before "script")
10. mitigated (damage reduced, cause unknown — not solved yet)`)}</details>
<p><strong>${en ? 'B. Write an incident update (4–5 sentences) using: degraded, impact, mitigate, root cause, next update.' : 'B. Viết một cập nhật sự cố (4–5 câu) có dùng: degraded, impact, mitigate, root cause, next update.'}</strong> ${en ? 'Situation: since 09:40 ICT the LabFlow reminder emails are delayed by about an hour; booking works.' : 'Tình huống: từ 09:40 ICT email nhắc lịch của LabFlow bị trễ khoảng một tiếng; đặt lịch vẫn chạy bình thường.'}</p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`[Investigating] Reminder emails are degraded since 09:40 ICT: they arrive
about one hour late. Impact: students get reminders late; booking itself
works normally. We mitigated the backlog by adding a second mail worker.
The root cause is still unknown; we suspect the mail provider's rate limit.
Next update by 11:00 ICT.`)}
<p>${en ? 'Check: the status word first, a time with time zone, impact separated from cause, no promise of a fix time you do not know. This is the structure of lesson 4.4.' : 'Soát: chữ trạng thái đứng đầu, giờ kèm múi giờ, ảnh hưởng tách khỏi nguyên nhân, không hứa giờ sửa xong khi chưa biết. Đây là khuôn của bài 4.4.'}</p></details>

${lienKet('/language', '📒', en ? 'CT Language — IT notebook (CNTT – phần mềm)' : 'CT Language — Sổ tay chuyên ngành CNTT – phần mềm', en ? '96 single words in six groups (Git, Agile, testing, deployment, meetings, documents) with IPA and audio — learn the words there, use them in sentences here.' : '96 từ đơn lẻ chia sáu nhóm (Git, Agile, kiểm thử, triển khai, họp, tài liệu) có IPA và âm thanh — học từ ở đó, dùng thành câu ở đây.')}
${lienKet('/courses/distributed-systems/learn?lessonSlug=dist-10-1-postmortem', '📰', en ? 'Distributed systems 10.1 — Reading public postmortems' : 'Hệ thống phân tán 10.1 — Đọc báo cáo sự cố công khai', en ? 'The GitHub 2018 incident in technical depth.' : 'Vụ GitHub 2018 ở mức kỹ thuật sâu.')}
${lienKet('/courses/git/learn?lessonSlug=git-4-3-revert', '↩️', en ? 'Git 4.3 — revert' : 'Git 4.3 — revert', en ? 'What git revert does, next to a rollback.' : 'git revert làm gì, đặt cạnh rollback.')}
${lienKet('/courses/incident-response/learn?lessonSlug=ir-10-2-mau', '🚨', en ? 'Incident response 10.2 — templates' : 'Ứng phó sự cố 10.2 — mẫu', en ? 'Status-page and postmortem templates in Vietnamese context.' : 'Mẫu trang trạng thái và postmortem.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>estimate · deadline · scope · regression · reproduce · flaky · release · deploy · roll back / rollback · revert · hotfix · workaround · outage · degraded · downtime · mitigate · root cause · postmortem · ${en ? 'phrasal verb' : 'cụm động từ (phrasal verb)'} · ${en ? 'uncountable noun' : 'danh từ không đếm được'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Learn work words by situation and with their partner words, not alphabetically.' : 'Học từ nghề theo tình huống và cùng từ bạn của nó, không theo thứ tự chữ cái.'}</li>
<li>${en ? 'Real logs show each document type has its own vocabulary: commits (update, add, fix, bump, revert), release notes (deprecate, regression, workaround), postmortems (outage, mitigate, root cause).' : 'Log thật cho thấy mỗi loại tài liệu có bộ từ riêng: commit (update, add, fix, bump, revert), release notes (deprecate, regression, workaround), postmortem (outage, mitigate, root cause).'}</li>
<li>${en ? 'Release ≠ deploy, roll back ≠ revert, workaround ≠ fix, degraded ≠ down, estimate ≠ deadline.' : 'Release ≠ deploy, roll back ≠ revert, workaround ≠ fix, degraded ≠ down, estimate ≠ deadline.'}</li>
<li>${en ? 'Two words = verb (set up, roll back, log in); one word = noun (setup, rollback, login).' : 'Hai chữ = động từ (set up, roll back, log in); một chữ = danh từ (setup, rollback, login).'}</li>
<li>${en ? 'information, feedback, software, equipment, documentation, advice, code: no "-s".' : 'information, feedback, software, equipment, documentation, advice, code: không thêm "-s".'}</li>
</ul>
</div>`;

/* ═════════════ 7.2 — Phát âm thuật ngữ ═════════════ */
/** [từ, IPA chuẩn (Cambridge giọng Mỹ; từ không có trong từ điển: theo tài liệu của hãng/cách dùng phổ biến), gợi ý đọc kiểu Việt, lỗi hay gặp (vi), lỗi hay gặp (en)] — IPA máy lấy từ out/ipa.txt. */
const PHAT_AM = [
  ['cache', '/kæʃ/', 'như <em>cash</em> (tiền mặt)', '"ca-chê", "kếch"', '"ca-shay", "catch"'],
  ['suite', '/swiːt/', 'như <em>sweet</em>', '"xu-ít", "sút"', '"suit", "soot"'],
  ['queue', '/kjuː/', 'như chữ <em>Q</em>', '"kiu-ê", "quơ"', '"kyoo-ay", "kway"'],
  ['data', '/ˈdeɪtə/, /ˈdætə/', '<strong>ĐÂY</strong>-tơ (hoặc <strong>ĐA</strong>-tơ)', 'nhấn âm cuối "đa-TA"', 'stress on the last syllable'],
  ['Linux', '/ˈlɪnəks/', '<strong>LI</strong>-nợks', '"lai-nớt"', '"LIE-nux"'],
  ['nginx', '/ˌendʒɪnˈeks/', '<em>engine</em> + <em>x</em>', '"en-gin-x", "ngin-x"', '"en-jinx", "n-ginx"'],
  ['SQL', '/ˌes.kjuːˈel/, /ˈsiːkwəl/', 'ét-xkiu-<strong>EO</strong> hoặc <strong>XI</strong>-quơl', 'đọc chữ cái kiểu Việt "ét-quy-lờ"', 'Vietnamese letter names'],
  ['GUI', '/ˈɡuːi/', '<strong>GU</strong>-i (như <em>gooey</em>)', '"gờ-u-i"', 'reading the letters the Vietnamese way'],
  ['char', '/tʃɑːr/', 'như <em>char</em>coal; nhiều người nói <em>car</em> hay <em>care</em> — đều được hiểu', '"cha-rờ"', '"cha-ruh"'],
  ['enum', '/ˈiːnʌm/', '<strong>I</strong>-nâm (nhấn đầu)', '"e-num", nhấn sau', '"eh-NUM", stress on the second'],
  ['Azure', '/ˈæʒər/', '<strong>A</strong>-giơ (âm "gi" mềm như "measure")', '"a-du-rơ"', '"a-ZOO-ruh"'],
  ['sudo', '/ˈsuːduː/, /ˈsuːdoʊ/', '<strong>XU</strong>-đu hoặc <strong>XU</strong>-đâu', '"xu-đô" nhấn sau', 'stress on the second'],
  ['Kubernetes', '/ˌkuːbərˈnetiːz/', 'ku-bơ-<strong>NÉT</strong>-tiz', '"ku-be-nét" (mất đuôi, sai nhấn)', 'dropping the last syllable'],
  ['GitHub', '/ˈɡɪthʌb/', '<strong>GÍT</strong>-hấp', '"gai-thấp", "git-húp"', '"guy-tub", "git-hoob"'],
  ['width', '/wɪdθ/', 'uýt + đầu lưỡi giữa răng (θ)', '"uýt" (mất dθ)', 'dropping the final dθ'],
  ['height', '/haɪt/', '<strong>HAI</strong>-t (vần với <em>light</em>)', '"hây", "hết" (đọc như eight)', '"hate", "hay"'],
  ['deploy', '/dɪˈplɔɪ/', 'đi-<strong>PLOI</strong> (nhấn sau)', '<strong>ĐI</strong>-ploi (nhấn đầu)', 'stress on the first syllable'],
  ['schema', '/ˈskiːmə/', '<strong>SKI</strong>-mơ', '"sê-ma"', '"SHE-ma", "SEH-ma"'],
  ['archive', '/ˈɑːrkaɪv/', '<strong>AR</strong>-cai-v', '"ar-chi-vờ"', '"ar-CHEEV"'],
  ['integer', '/ˈɪntɪdʒər/', '<strong>IN</strong>-ti-giơ', '"in-tê-gơ"', '"in-TEG-er" with a hard g'],
  ['method', '/ˈmeθəd/', '<strong>ME</strong>-thợd (θ)', '"mê-thót"', '"meh-TOD"'],
  ['component', '/kəmˈpoʊnənt/', 'kơm-<strong>PÂU</strong>-nơnt', 'nhấn cuối "com-pô-NEN"', 'stress on the last syllable'],
  ['variable', '/ˈveriəbəl/', '<strong>VE</strong>-ri-ơ-bồl', '"va-ri-A-bồ"', '"va-ree-AH-bul"'],
  ['async', '/ˈeɪsɪŋk/', '<strong>ÂY</strong>-xinh-k', '"a-xin"', '"ah-SIN"'],
  ['image', '/ˈɪmɪdʒ/', '<strong>I</strong>-mịtch', '"i-mây", "i-mát"', '"ee-MAYJ"'],
  ['null', '/nʌl/', 'nâl (như <em>dull</em>)', '"nun", "nu"', '"nool", "nu"'],
  ['Ubuntu', '/ʊˈbʊntuː/', 'u-<strong>BUN</strong>-tu', '"u-bun-tu" đều nhau', 'flat, no stress'],
  ['JSON', '/ˈdʒeɪsən/', 'như tên <em>Jason</em>', '"giê-xơn", "giây-sơn"', '"jay-SON"'],
  ['YAML', '/ˈjæməl/', '<strong>YA</strong>-mồl (vần với <em>camel</em>)', '"y-a-m-l"', 'spelling the letters'],
  ['debug', '/ˌdiːˈbʌɡ/', 'đi-<strong>BẤG</strong>', '"đề-bắc"', '"DEB-ug"'],
  ['router', '/ˈraʊtər/ (Mỹ), /ˈruːtər/ (Anh)', 'Mỹ: <strong>RAO</strong>-tơ · Anh: <strong>RU</strong>-tơ', 'trộn hai giọng trong một câu', 'mixing both in one sentence'],
  ['query', '/ˈkwɪri/', '<strong>QUY</strong>-ri', '"que-ri"', '"kweh-REE"'],
  ['boolean', '/ˈbuːliən/', '<strong>BU</strong>-li-ơn', '"bô-lê-an"', '"boo-LEAN"'],
  ['status', '/ˈsteɪtəs/, /ˈstætəs/', '<strong>XTÂY</strong>-tợs hoặc <strong>XTA</strong>-tợs', 'nhấn cuối "sta-TUS"', '"sta-TOOS"'],
  ['develop', '/dɪˈveləp/', 'đi-<strong>VE</strong>-lợp', '"đề-vơ-LỐP"', '"DEV-e-lop"'],
  ['environment', '/ɪnˈvaɪrənmənt/', 'in-<strong>VAI</strong>-rơn-mơnt', '"en-vi-rôn-MEN"', '"en-vee-RON-ment"'],
];
const bangPhatAm = (en, tu) => `
<table>
<thead><tr><th>${en ? 'Term' : 'Thuật ngữ'}</th><th>${en ? 'Standard (dictionary, US / maker’s docs)' : 'Chuẩn (từ điển Mỹ / tài liệu của hãng)'}</th><th>${en ? 'eSpeak NG (machine)' : 'eSpeak NG (máy)'}</th><th>${en ? 'Say it like' : 'Đọc gần như'}</th><th>${en ? 'Common mistake' : 'Hay đọc sai'}</th></tr></thead>
<tbody>
${PHAT_AM.filter((r) => tu.includes(r[0])).map(([w, ipa, goiY, saiVi, saiEn]) => `<tr><td><strong>${w}</strong></td><td>${ipa}</td><td><code>${esc(IPA(w))}</code></td><td>${goiY}</td><td>${en ? saiEn : saiVi}</td></tr>`).join('\n')}
</tbody>
</table>`;
const TU_LAB = ['cache', 'suite', 'queue', 'data', 'Linux', 'nginx', 'SQL', 'GUI', 'char', 'enum', 'Azure', 'sudo', 'Kubernetes', 'GitHub', 'width', 'height', 'deploy', 'schema', 'archive', 'integer'];
const TU_THEM = PHAT_AM.map((r) => r[0]).filter((w) => !TU_LAB.includes(w));

const L72 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 7 · Pronunciation' : 'Chương 7 · Phát âm'}</span>
<h2>${en ? '7.2 — Tech terms Vietnamese speakers often mispronounce' : '7.2 — Thuật ngữ người Việt hay phát âm sai'}</h2>
<p class="lead">${en
    ? 'Your English can be grammatically perfect and still fail in a call because one word — "queue", "Azure", "schema" — comes out in a shape the listener does not know. This lesson gives the right shape of 36 everyday terms (dictionary IPA next to a machine reading), the four rules behind most mistakes (stress, final sounds, spelling traps, letter names), how to say symbols and addresses aloud, and two real experiments that show when a listener can still guess you and when the guess goes wrong.'
    : 'Tiếng Anh của bạn có thể đúng ngữ pháp hoàn toàn mà vẫn hỏng trong cuộc gọi, chỉ vì một từ — "queue", "Azure", "schema" — phát ra thành một hình dạng người nghe không nhận ra. Bài này đưa ra hình dạng đúng của 36 thuật ngữ hằng ngày (IPA từ điển đặt cạnh cách máy đọc), bốn quy luật đứng sau phần lớn lỗi (trọng âm, âm cuối, bẫy chính tả, tên chữ cái), cách đọc ký hiệu và địa chỉ thành lời, và hai thí nghiệm thật cho thấy khi nào người nghe vẫn đoán ra bạn nói gì và khi nào đoán sai.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Word stress in English works a bit like tones in Vietnamese. A foreigner who says "ma" for "má", "mà" and "mạ" can still be understood in a full sentence about family — but say the word alone, or in a sentence where two meanings fit, and you hear something else. Putting the stress on the wrong syllable of "deploy" or "component" is the English version of the wrong tone.'
    : 'Trọng âm tiếng Anh giống thanh điệu tiếng Việt một chút. Người nước ngoài nói "ma" cho cả "má", "mà", "mạ" vẫn được hiểu khi cả câu đang nói chuyện gia đình — nhưng nói riêng một chữ, hoặc trong câu mà hai nghĩa đều hợp, thì bạn nghe thành chữ khác. Nhấn sai âm tiết của "deploy" hay "component" là phiên bản tiếng Anh của sai thanh.'}</p>

<h3>${en ? 'Experiment 1: the word alone' : 'Thí nghiệm 1: nói riêng một từ'}</h3>
<p>${en
    ? 'A machine voice (eSpeak NG) said each word twice — once correctly, once the way many Vietnamese learners say it — and Whisper, the speech recognizer from lesson 6.5, wrote what it heard. No sentence, no context:'
    : 'Một giọng máy (eSpeak NG) đọc mỗi từ hai lần — một lần đúng, một lần theo cách nhiều người học Việt Nam hay đọc — và Whisper, bộ nhận dạng giọng nói ở bài 6.5, ghi lại điều nó nghe. Không có câu, không có ngữ cảnh:'}</p>
<table>
<thead><tr><th>${en ? 'Word' : 'Từ'}</th><th>${en ? 'Said correctly → Whisper wrote' : 'Đọc đúng → Whisper ghi'}</th><th>${en ? 'Said Vietnamese-style → Whisper wrote' : 'Đọc kiểu Việt → Whisper ghi'}</th></tr></thead>
<tbody>
${DON.map(([w, ph, a, b]) => `<tr><td><strong>${w}</strong></td><td><code>${esc(a)}</code></td><td><code>${esc(b)}</code> <small>(${esc(ph)})</small></td></tr>`).join('\n')}
</tbody>
</table>
<p class="note-ct">${NOTE_AM(en)} ${en ? 'The Vietnamese-style shapes are written in eSpeak phoneme code, e.g. [[k\'ju:eI]] = "kiu-ê".' : 'Cách đọc kiểu Việt viết bằng mã âm vị của eSpeak, ví dụ [[k\'ju:eI]] = "kiu-ê".'}</p>
<p>${en ? 'Two surprises, both useful:' : 'Hai điều bất ngờ, cả hai đều có ích:'}</p>
<ul>
<li>${en
    ? '<strong>Even the correct words come back "wrong".</strong> "cache" → CASH, "suite" → Sweet, "queue" → Kew, "height" → Hi. That is not a mistake by Whisper: cache/cash, suite/sweet and queue/cue/Kew are <em>homophones</em> — same sound, different spelling. Alone, nobody can tell them apart; and with no context at all, even correct "Linux" and "deploy" came back as the non-words "liddox" and "Diploid". Rule: <strong>never say a tech term alone</strong>; say it inside a phrase that gives the meaning — "the browser cache", "the test suite", "the job queue".'
    : '<strong>Ngay cả từ đọc ĐÚNG cũng ra "sai".</strong> "cache" → CASH, "suite" → Sweet, "queue" → Kew, "height" → Hi. Đó không phải lỗi của Whisper: cache/cash, suite/sweet và queue/cue/Kew là <em>từ đồng âm</em> — cùng âm, khác chữ. Nói riêng thì không ai phân biệt được; và khi không có chút ngữ cảnh nào, ngay cả "Linux" và "deploy" đọc đúng cũng ra chữ vô nghĩa "liddox" và "Diploid". Luật: <strong>đừng bao giờ nói thuật ngữ trơ trọi</strong>; đặt nó trong cụm có nghĩa — "the browser cache", "the test suite", "the job queue".'}</li>
<li>${en
    ? '<strong>The Vietnamese-style words become different words.</strong> "deploy" stressed on the first syllable → "The Lawyer"; "schema" as "sê-ma" → "K-Man"; "archive" as "ar-chi-vờ" → "team"; "queue" as "kiu-ê" → "QA". A listener does the same thing: the brain picks the nearest word it knows.'
    : '<strong>Từ đọc kiểu Việt biến thành từ khác.</strong> "deploy" nhấn âm đầu → "The Lawyer"; "schema" đọc "sê-ma" → "K-Man"; "archive" đọc "ar-chi-vờ" → "team"; "queue" đọc "kiu-ê" → "QA". Người nghe cũng làm y như vậy: não chọn từ gần nhất mà nó biết.'}</li>
</ul>

<h3>${en ? 'Experiment 2: the same words inside sentences' : 'Thí nghiệm 2: cùng các từ đó, đặt trong câu'}</h3>
<p>${en
    ? 'Now the 20 sentences of the lab in lesson 7.4, read in one go at 140 words per minute — once correctly, once with 11 of the terms in Vietnamese style. Whisper’s transcript of the Vietnamese-style reading:'
    : 'Giờ là 20 câu của lab bài 7.4, đọc liền một lượt 140 từ mỗi phút — một lần đúng hết, một lần có 11 thuật ngữ đọc kiểu Việt. Bản Whisper chép lại lượt đọc kiểu Việt:'}</p>
${mau(OUT['74-nghe-sai'], NOTE_AM(en))}
<p>${en
    ? 'Eight of the eleven wrong words were "repaired" by context: "The app runs on [ku-be-nét]" still became Kubernetes, because nothing else fits. Three were not, and look at what they became:'
    : 'Tám trong mười một từ đọc sai được ngữ cảnh "vá" lại: "The app runs on [ku-be-nét]" vẫn ra Kubernetes, vì không có từ nào khác hợp. Ba từ thì không, và xem chúng thành gì:'}</p>
<ul>
<li>${en
    ? '"The job is still in the <strong>QA</strong>." — a completely plausible sentence on a software project, with a different meaning (the job is being tested, not waiting in a queue). This is the dangerous kind of mistake: nobody asks again, because it makes sense.'
    : '"The job is still in the <strong>QA</strong>." — một câu hoàn toàn hợp lý trong dự án phần mềm, nhưng nghĩa khác hẳn (việc đang được kiểm thử, chứ không phải đang chờ trong hàng đợi). Đây là loại lỗi nguy hiểm nhất: không ai hỏi lại, vì câu vẫn có nghĩa.'}</li>
<li>${en ? '"Download the <strong>achieve</strong>" and "deploy the API to <strong>Azura</strong>" — the listener notices something is wrong and has to stop and think.' : '"Download the <strong>achieve</strong>" và "deploy the API to <strong>Azura</strong>" — người nghe thấy có gì đó sai và phải dừng lại nghĩ.'}</li>
<li>${en ? '"The height is <strong>run</strong> on mobile" — "height" said like "hate" broke the word <em>after</em> it ("wrong"), which was said correctly. Mistakes leak into neighbours.' : '"The height is <strong>run</strong> on mobile" — "height" đọc thành "hây-t" làm hỏng luôn chữ <em>đứng sau</em> nó ("wrong"), dù chữ đó đọc đúng. Lỗi lan sang chữ bên cạnh.'}</li>
</ul>
<p>${en
    ? 'Conclusion: context saves you most of the time, but at a cost (the listener works harder, gets tired, and in a long call stops following), and it fails exactly where two meanings fit. A human client is better than Whisper at context — and much worse at unfamiliar Vietnamese-style sounds.'
    : 'Kết luận: phần lớn trường hợp ngữ cảnh cứu bạn, nhưng phải trả giá (người nghe phải cố hơn, mệt hơn, cuộc gọi dài thì bỏ theo dõi), và nó hỏng đúng ở chỗ hai nghĩa đều hợp. Khách thật đoán ngữ cảnh giỏi hơn Whisper — nhưng kém hơn nhiều với những âm kiểu Việt lạ tai.'}</p>

<h3>${en ? 'The 20 terms of this chapter' : '20 thuật ngữ của chương'}</h3>
<p>${en
    ? 'The standard column is Cambridge Dictionary (US) where the word exists, otherwise the maker’s documentation or the common usage at work. The machine column is what eSpeak NG produced on this machine — mostly the same, sometimes not: it stresses <em>enum</em> on the second syllable (dictionaries put it on the first) and reads <em>sudo</em> as "soo-doh" (both "soo-doo" and "soo-doh" are heard at work). Trust the dictionary and YouGlish, not one machine.'
    : 'Cột chuẩn lấy từ Cambridge Dictionary (giọng Mỹ) khi từ có trong đó, nếu không thì theo tài liệu của hãng hoặc cách dùng phổ biến khi đi làm. Cột "máy" là output eSpeak NG trên máy này — phần lớn trùng, đôi chỗ không: máy nhấn <em>enum</em> ở âm thứ hai (từ điển nhấn âm đầu) và đọc <em>sudo</em> là "xu-đâu" (đi làm bạn sẽ nghe cả "xu-đu" lẫn "xu-đâu"). Tin từ điển và YouGlish, đừng tin một cái máy.'}</p>
${bangPhatAm(en, TU_LAB)}
<h4>${en ? '16 more you will say every week' : 'Thêm 16 từ bạn sẽ nói hằng tuần'}</h4>
${bangPhatAm(en, TU_THEM)}
<p>${en
    ? 'Look at <em>router</em> and <em>status</em> in the machine column: the US voice says "rao-tơ" and "xta-tợs", the British voice says "ru-tơ" and "xtây-tợs". Both are correct. Pick one accent per word and keep it; do not switch inside one sentence.'
    : 'Xem <em>router</em> và <em>status</em> ở cột máy: giọng Mỹ đọc "rao-tơ" và "xta-tợs", giọng Anh đọc "ru-tơ" và "xtây-tợs". Cả hai đều đúng. Chọn một giọng cho mỗi từ và giữ nguyên; đừng đổi qua lại trong cùng một câu.'}</p>
${mau(OUT.ipa.split('\n').filter((l) => /^(router|status|data|sudo|enum)\s/.test(l)).join('\n'), en ? 'Machine IPA, US voice vs British voice (espeak-ng -q --ipa -v en-us / en-gb-x-rp).' : 'IPA máy, giọng Mỹ và giọng Anh (espeak-ng -q --ipa -v en-us / en-gb-x-rp).')}

<h3>${en ? 'Rule 1 — Stress: where the loud syllable goes' : 'Quy luật 1 — Trọng âm: âm tiết nào to'}</h3>
<p>${en
    ? 'In IPA the mark ˈ comes <em>before</em> the stressed syllable: /dɪˈplɔɪ/ = de-PLOY. Vietnamese gives every syllable the same weight, so English words sound "flat" or get stressed at the end. Five patterns cover most tech words:'
    : 'Trong IPA, dấu ˈ đứng <em>trước</em> âm tiết được nhấn: /dɪˈplɔɪ/ = đi-PLOI. Tiếng Việt cho mọi âm tiết nặng như nhau, nên từ tiếng Anh nghe "phẳng" hoặc bị nhấn ở cuối. Năm mẫu sau phủ được phần lớn từ kỹ thuật:'}</p>
<ol>
<li>${en ? '<strong>Same spelling, noun vs verb</strong>: nouns stress the first syllable, verbs the second. Machine reading, real output:' : '<strong>Cùng chữ, danh từ và động từ</strong>: danh từ nhấn âm đầu, động từ nhấn âm sau. Máy đọc, output thật:'}
${mau(OUT['ipa-cap'], en ? 'espeak-ng -q --ipa -v en-us "a record" / "to record" …, 24 Nov 2026.' : 'espeak-ng -q --ipa -v en-us "a record" / "to record" …, 24/11/2026.')}
${en ? '"The project is in progress" (PROject, PROgress) but "we project costs" (proJECT). In stand-ups you mostly need the nouns.' : '"The project is in progress" (PROject, PROgress) nhưng "we project costs" (proJECT). Trong standup bạn chủ yếu cần danh từ.'}</li>
<li>${en ? '<strong>Endings that pull the stress just before them</strong>: -tion/-sion (configuRAtion, authentiCAtion, appliCAtion, VERsion), -ic/-ical (GRAphic, speCIfic, TECHnical), -ity (seCUrity, availaBIlity, compatiBIlity).' : '<strong>Đuôi kéo trọng âm về ngay trước nó</strong>: -tion/-sion (configuRAtion, authentiCAtion, appliCAtion, VERsion), -ic/-ical (GRAphic, speCIfic, TECHnical), -ity (seCUrity, availaBIlity, compatiBIlity).'}</li>
<li>${en ? '<strong>Compound nouns stress the first part</strong>: DAtabase, FRAMEwork, BACKend, FRONTend, WORKflow, KEYboard, PASSword, DEADline.' : '<strong>Danh từ ghép nhấn phần đầu</strong>: DAtabase, FRAMEwork, BACKend, FRONTend, WORKflow, KEYboard, PASSword, DEADline.'}</li>
<li>${en ? '<strong>Phrasal verbs stress the particle; their nouns stress the first part</strong>: "we’ll roll BACK" but "the ROLLback"; "set UP the server" but "the SETup".' : '<strong>Cụm động từ nhấn tiểu từ; danh từ tương ứng nhấn phần đầu</strong>: "we’ll roll BACK" nhưng "the ROLLback"; "set UP the server" nhưng "the SETup".'}</li>
<li>${en ? '<strong>Acronyms stress the last letter</strong>: A-P-I, U-R-L, C-S-S, A-W-S, S-Q-L. Acronyms said as words have their own stress: JSON (JAY-son), YAML (YA-mul), CRUD (crud), SaaS (sass).' : '<strong>Từ viết tắt đọc từng chữ thì nhấn chữ cuối</strong>: A-P-<strong>I</strong>, U-R-<strong>L</strong>, A-W-<strong>S</strong>, S-Q-<strong>L</strong>. Viết tắt đọc thành từ có trọng âm riêng: JSON (GIÂY-xơn), YAML (YA-mồl), CRUD (crắd), SaaS (xas).'}</li>
</ol>

<h3>${en ? 'Rule 2 — Final sounds carry the grammar' : 'Quy luật 2 — Âm cuối mang ngữ pháp'}</h3>
<p>${en
    ? 'Vietnamese syllables end softly (t, p, c are stopped, never released, and there are no clusters like "-sts"). In English the last sound is often the grammar: "fix" vs "fixed" is the difference between a plan and a done task. Lesson 6.5 showed Whisper hearing "fixed … merged" said without endings as "pick … murr".'
    : 'Âm tiết tiếng Việt kết thúc nhẹ (t, p, c bị chặn lại, không bật hơi, và không có cụm như "-sts"). Trong tiếng Anh âm cuối thường chính là ngữ pháp: "fix" và "fixed" là khác biệt giữa kế hoạch và việc đã xong. Bài 6.5 đã cho thấy Whisper nghe "fixed … merged" đọc thiếu đuôi thành "pick … murr".'}</p>
<table>
<thead><tr><th>${en ? 'Ending' : 'Đuôi'}</th><th>${en ? 'Sound' : 'Âm'}</th><th>${en ? 'Tech examples' : 'Ví dụ trong nghề'}</th></tr></thead>
<tbody>
<tr><td>-ed</td><td>/t/ ${en ? 'after p, k, s, sh, ch, f' : 'sau p, k, s, sh, ch, f'}</td><td>fixed /fɪkst/, pushed, checked, cached, stopped</td></tr>
<tr><td>-ed</td><td>/d/ ${en ? 'after voiced sounds' : 'sau âm hữu thanh'}</td><td>deployed, logged, merged, reviewed, released</td></tr>
<tr><td>-ed</td><td>/ɪd/ ${en ? 'after t, d — an extra syllable' : 'sau t, d — thêm một âm tiết'}</td><td>tested, updated, deprecated, added, reverted</td></tr>
<tr><td>-s</td><td>/s/ ${en ? 'after p, t, k, f' : 'sau p, t, k, f'}</td><td>tests, commits, tickets, docs, scripts</td></tr>
<tr><td>-s</td><td>/z/ ${en ? 'after voiced sounds' : 'sau âm hữu thanh'}</td><td>logs, bugs, files, servers, users</td></tr>
<tr><td>-s / -es</td><td>/ɪz/ ${en ? 'after s, z, sh, ch, dʒ — an extra syllable' : 'sau s, z, sh, ch, dʒ — thêm một âm tiết'}</td><td>caches /ˈkæʃɪz/, fixes, branches, pages, images, statuses</td></tr>
</tbody>
</table>
<p>${en
    ? 'Hardest clusters for Vietnamese speakers, worth ten repetitions each: <em>tests</em> /tests/, <em>texts</em> /teksts/, <em>width</em> /wɪdθ/, <em>months</em> /mʌnθs/, <em>scripts</em> /skrɪpts/, <em>asked</em> /æskt/. If a cluster will not come out, slow down — never drop it.'
    : 'Cụm khó nhất với người Việt, mỗi cụm đáng lặp mười lần: <em>tests</em> /tests/, <em>texts</em> /teksts/, <em>width</em> /wɪdθ/, <em>months</em> /mʌnθs/, <em>scripts</em> /skrɪpts/, <em>asked</em> /æskt/. Cụm nào chưa bật ra được thì nói chậm lại — đừng bao giờ bỏ.'}</p>

<h3>${en ? 'Rule 3 — Spelling traps' : 'Quy luật 3 — Bẫy chính tả'}</h3>
<p>${en
    ? 'Most wrong shapes come from reading English letters with Vietnamese (or French) rules. A short list of traps explains a large part of the table:'
    : 'Phần lớn hình dạng sai đến từ việc đọc chữ tiếng Anh theo luật tiếng Việt (hoặc tiếng Pháp). Một danh sách bẫy ngắn giải thích được phần lớn bảng trên:'}</p>
<ul>
<li>${en ? '<strong>ch = /k/</strong> in words from Greek: <em>schema</em> /sk/, <em>archive</em> /k/, <em>architecture</em> /k/, <em>technical</em> /k/, <em>mechanism</em> /k/. Only <em>cache</em> is /ʃ/ (from French).' : '<strong>ch = /k/</strong> trong từ gốc Hy Lạp: <em>schema</em> /sk/, <em>archive</em> /k/, <em>architecture</em> /k/, <em>technical</em> /k/, <em>mechanism</em> /k/. Riêng <em>cache</em> là /ʃ/ (gốc Pháp).'}</li>
<li>${en ? '<strong>Silent letters</strong>: queue (only "Q"), suite (= sweet), height (gh silent), debt in "tech debt" (b silent), design (g silent), know/knowledge (k silent).' : '<strong>Chữ câm</strong>: queue (chỉ còn "Q"), suite (= sweet), height (gh câm), debt trong "tech debt" (b câm), design (g câm), know/knowledge (k câm).'}</li>
<li>${en ? '<strong>-age, -ate, -ine</strong> are weak at the end: image /ˈɪmɪdʒ/, package /ˈpækɪdʒ/, private /ˈpraɪvət/, machine /məˈʃiːn/, engine /ˈendʒɪn/.' : '<strong>-age, -ate, -ine</strong> đọc yếu ở cuối: image /ˈɪmɪdʒ/, package /ˈpækɪdʒ/, private /ˈpraɪvət/, machine /məˈʃiːn/, engine /ˈendʒɪn/.'}</li>
<li>${en ? '<strong>th</strong> is /θ/ (tongue between teeth, no voice) in method, width, thread, auth; /ð/ (with voice) in the, this, other. Not /t/ and not /s/.' : '<strong>th</strong> là /θ/ (đầu lưỡi giữa hai răng, không rung) trong method, width, thread, auth; /ð/ (có rung) trong the, this, other. Không phải /t/ cũng không phải /s/.'}</li>
<li>${en ? '<strong>Product names</strong> have the pronunciation their makers chose: nginx = "engine-x" (from its documentation), Linux = "LIN-ux" (Linus Torvalds published a short recording of himself saying it), Azure = "AZH-er", Kubernetes = "koo-ber-NET-eez" (Greek for helmsman), Ubuntu = "oo-BOON-too".' : '<strong>Tên sản phẩm</strong> đọc theo cách nhà làm ra nó chọn: nginx = "engine-x" (ghi trong tài liệu của nó), Linux = "LI-nớx" (Linus Torvalds có đăng một đoạn tự thu âm cách đọc), Azure = "A-giơ", Kubernetes = "ku-bơ-NÉT-tiz" (tiếng Hy Lạp nghĩa là người lái tàu), Ubuntu = "u-BUN-tu".'}</li>
</ul>

<h3>${en ? 'Rule 4 — Letters, symbols and addresses aloud' : 'Quy luật 4 — Đọc chữ cái, ký hiệu và địa chỉ thành lời'}</h3>
<p>${en
    ? 'In calls you constantly spell: ticket keys, branch names, file paths, emails, commands. The letters Vietnamese speakers mix up most are the ones whose English names differ from Vietnamese ones:'
    : 'Trong cuộc gọi bạn đánh vần liên tục: mã ticket, tên nhánh, đường dẫn tệp, email, câu lệnh. Những chữ cái người Việt hay lẫn nhất là chữ có tên tiếng Anh khác tên tiếng Việt:'}</p>
<table>
<thead><tr><th>${en ? 'Letter' : 'Chữ'}</th><th>${en ? 'English name' : 'Tên tiếng Anh'}</th><th>${en ? 'Confused with' : 'Hay lẫn với'}</th></tr></thead>
<tbody>
<tr><td>A · E · I</td><td>/eɪ/ "ây" · /iː/ "i" · /aɪ/ "ai"</td><td>${en ? 'Vietnamese a, e, i are heard as R, A, E' : 'a, e, i đọc kiểu Việt bị nghe thành R, A, E'}</td></tr>
<tr><td>G · J</td><td>/dʒiː/ "gi" · /dʒeɪ/ "giây"</td><td>${en ? 'each other; say "G as in Google, J as in Java"' : 'lẫn nhau; nói "G as in Google, J as in Java"'}</td></tr>
<tr><td>H</td><td>/eɪtʃ/ "ếch"</td><td>${en ? 'Vietnamese "hát"' : '"hát" tiếng Việt'}</td></tr>
<tr><td>R · Y · W</td><td>/ɑːr/ "a-r" · /waɪ/ "wai" · /ˈdʌbəl.juː/ "đấp-bồ-diu"</td><td>${en ? 'Vietnamese "e-rờ", "i dài", "vê kép"' : '"e-rờ", "i dài", "vê kép"'}</td></tr>
<tr><td>Z</td><td>/ziː/ (US) · /zed/ (UK)</td><td>${en ? 'both correct' : 'cả hai đều đúng'}</td></tr>
<tr><td>Q · U</td><td>/kjuː/ "kiu" · /juː/ "diu"</td><td>${en ? 'Vietnamese "quy", "u"' : '"quy", "u"'}</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>${en ? 'Symbol' : 'Ký hiệu'}</th><th>${en ? 'Say' : 'Đọc'}</th><th>${en ? 'Symbol' : 'Ký hiệu'}</th><th>${en ? 'Say' : 'Đọc'}</th></tr></thead>
<tbody>
<tr><td><code>.</code></td><td>dot (${en ? 'in versions: point' : 'trong số phiên bản: point'})</td><td><code>/</code> · <code>\\</code></td><td>slash · backslash</td></tr>
<tr><td><code>-</code></td><td>dash / hyphen</td><td><code>_</code></td><td>underscore</td></tr>
<tr><td><code>@</code></td><td>at</td><td><code>#</code></td><td>hash (${en ? 'or "number" before a ticket: "PR number 42"' : 'hoặc "number" trước số PR: "PR number 42"'})</td></tr>
<tr><td><code>~</code></td><td>tilde</td><td><code>*</code></td><td>asterisk / star</td></tr>
<tr><td><code>&amp;</code></td><td>ampersand / and</td><td><code>|</code></td><td>pipe</td></tr>
<tr><td><code>:</code> · <code>;</code></td><td>colon · semicolon</td><td><code>( )</code> · <code>[ ]</code> · <code>{ }</code></td><td>parentheses · square brackets · curly braces</td></tr>
<tr><td><code>&lt; &gt;</code></td><td>angle brackets / less than, greater than</td><td><code>\`</code></td><td>backtick</td></tr>
<tr><td><code>!</code></td><td>exclamation mark (${en ? 'devs say "bang"' : 'dev hay nói "bang"'})</td><td><code>=</code> · <code>==</code></td><td>equals · double equals</td></tr>
</tbody>
</table>
${mau(`Path:    src/main/java     → "s-r-c slash main slash java"
Branch:  feat/LAB-315_retry → "feat slash L-A-B dash three-one-five underscore retry"
Email:   an.nguyen@fsoft.com.vn → "an dot nguyen at f-soft dot com dot v-n"
Version: v2.3.0           → "version two point three point zero"
Command: npm i -D vitest  → "npm i, space, dash capital D, space, vitest"`, en ? 'Saying things you would normally type.' : 'Đọc thành lời những thứ bình thường bạn gõ.')}
<p>${en
    ? 'When it matters, do not only say it: <strong>paste it in the chat</strong> ("I’ll paste the branch name in the chat"). Speech is for the conversation; text is for anything someone has to type.'
    : 'Khi chuyện đó quan trọng, đừng chỉ nói: <strong>dán vào khung chat</strong> ("I’ll paste the branch name in the chat"). Lời nói để trò chuyện; chữ viết cho mọi thứ người khác phải gõ lại.'}</p>

<h3>🛡️ ${en ? 'Hacker corner: the package name you heard' : 'Góc hacker: tên gói bạn nghe qua tai'}</h3>
<p>${en
    ? 'In late July 2017 a user called "hacktask" published about 40 npm packages whose names were one small change away from popular ones — the best known was <code>crossenv</code>, next to the real <code>cross-env</code> (said aloud, both are "cross env"). The fake packages worked like the real ones and, while installing, quietly sent the machine’s environment variables — npm tokens, cloud keys, database passwords — to a server controlled by the attacker. A developer reported it on 1 August 2017 and npm removed the packages; npm’s blog post of 2 August 2017 told everyone who had installed them to rotate every credential.'
    : 'Cuối tháng 7/2017, một tài khoản tên "hacktask" đăng khoảng 40 gói npm có tên chỉ khác gói nổi tiếng một chút — nổi nhất là <code>crossenv</code>, đứng cạnh gói thật <code>cross-env</code> (đọc thành lời thì cả hai đều là "cross env"). Gói giả chạy y như gói thật và, ngay lúc cài, lặng lẽ gửi biến môi trường của máy — token npm, khoá cloud, mật khẩu CSDL — về máy chủ của kẻ tấn công. Một developer báo ngày 1/8/2017 và npm gỡ các gói; bài blog của npm ngày 2/8/2017 yêu cầu ai đã cài thì đổi TOÀN BỘ thông tin đăng nhập.'}</p>
<p>${en ? 'This attack is called <strong>typosquatting</strong>, and spoken English makes it easier: in a call, a senior says "just install cross env" and you type what you heard. Protect yourself:' : 'Kiểu tấn công này gọi là <strong>typosquatting</strong>, và tiếng Anh nói thành lời làm nó dễ hơn: trong cuộc gọi, anh senior bảo "just install cross env" và bạn gõ đúng thứ mình nghe. Cách phòng:'}</p>
<ul>
<li>${en ? 'Never type a package, image, domain or repository name from a call. Ask: "Could you paste the exact name in the chat?" — or copy it from the official documentation.' : 'Đừng bao giờ gõ tên gói, image, tên miền hay kho mã theo lời nói trong cuộc gọi. Hỏi: "Could you paste the exact name in the chat?" — hoặc chép từ tài liệu chính thức.'}</li>
<li>${en ? 'When you are the one speaking, spell the dangerous part: "cross, <em>dash</em>, env — with a hyphen".' : 'Khi chính bạn nói, đánh vần phần nguy hiểm: "cross, <em>dash</em>, env — with a hyphen".'}</li>
<li>${en ? 'Before installing, check the package page: weekly downloads, repository link, publisher. A fake has few downloads and a new publisher.' : 'Trước khi cài, xem trang của gói: số lượt tải mỗi tuần, liên kết kho mã, người đăng. Gói giả có ít lượt tải và người đăng mới.'}</li>
</ul>
${lienKet('/courses/nodejs/learn?lessonSlug=nodejs-4-3-bao-mat-npm', '📦', en ? 'Node.js 4.3 — npm security' : 'Node.js 4.3 — Bảo mật npm', en ? 'Typosquatting, lockfiles and npm audit in practice.' : 'Typosquatting, lockfile và npm audit khi làm thật.')}

<h3>${en ? 'How to learn a new word’s sound (2 minutes per word)' : 'Cách học âm của một từ mới (2 phút mỗi từ)'}</h3>
<ol>
<li>${en ? '<strong>Dictionary</strong>: look it up on Cambridge Dictionary (dictionary.cambridge.org); read the IPA, find the ˈ mark, press the US and UK speaker icons.' : '<strong>Từ điển</strong>: tra trên Cambridge Dictionary (dictionary.cambridge.org); đọc IPA, tìm dấu ˈ, bấm loa giọng Mỹ và giọng Anh.'}</li>
<li>${en ? '<strong>Real speakers</strong>: on YouGlish (youglish.com), type the word and choose English — it plays short clips from real YouTube talks where people say it. For tech words you get conference speakers: the most realistic model there is. Listen to 3–5 different people.' : '<strong>Người nói thật</strong>: trên YouGlish (youglish.com), gõ từ và chọn English — trang phát những đoạn ngắn trong video YouTube thật có người nói từ đó. Với từ kỹ thuật bạn sẽ nghe diễn giả hội thảo: mẫu sát thực tế nhất. Nghe 3–5 người khác nhau.'}</li>
<li>${en ? '<strong>Shadowing</strong>: play one sentence, pause, repeat it out loud at the same speed and melody, three times. Then say <em>your own</em> sentence with the word.' : '<strong>Shadowing (nói đuổi)</strong>: phát một câu, dừng, lặp lại thành tiếng cùng tốc độ và ngữ điệu, ba lần. Rồi nói một câu <em>của chính bạn</em> có từ đó.'}</li>
<li>${en ? '<strong>Check</strong>: record that sentence and run it through Whisper (lesson 6.5, and the lab of 7.4). Put the word in a flashcard deck so it comes back in three days.' : '<strong>Kiểm</strong>: ghi âm câu đó và cho qua Whisper (bài 6.5, và lab bài 7.4). Đưa từ vào bộ thẻ để ba ngày sau nó quay lại.'}</li>
</ol>

<h3>${en ? 'Practice' : 'Bài luyện'}</h3>
<p><strong>${en ? 'A. Mark the stressed syllable (write it in capitals).' : 'A. Đánh dấu âm tiết được nhấn (viết hoa âm đó).'}</strong></p>
${mau(`deploy · component · develop · environment · database · configuration
security · a record (noun) · to record (verb) · Kubernetes · enum · archive`)}
<details><summary>${en ? 'Answers' : 'Đáp án'}</summary>${mau(`de-PLOY · com-PO-nent · de-VEL-op · en-VI-ron-ment · DA-ta-base · con-fig-u-RA-tion
se-CU-ri-ty · a RE-cord · to re-CORD · ku-ber-NE-tes · E-num · AR-chive`)}</details>
<p><strong>${en ? 'B. Say these aloud, record yourself, then compare with the model.' : 'B. Đọc thành lời, ghi âm, rồi so với đáp án mẫu.'}</strong></p>
${mau(`1. The branch name: fix/LAB-412_null-check
2. The config path: ~/.config/labflow/app.yaml
3. The email: minh.tran@fsoft.com.vn
4. "The job is still in the queue." (so nobody hears "QA")`)}
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`1. "fix slash L-A-B dash four-one-two underscore null dash check"
   (then: "I'll paste it in the chat.")
2. "tilde slash dot config slash labflow slash app dot yaml"
3. "minh dot tran at f-soft dot com dot v-n"
4. Say "queue" as one sound, /kjuː/, like the letter Q, and give context:
   "The job is still waiting in the queue, so it hasn't started yet."`)}</details>
<p><strong>${en ? 'C. Why is "The job is still in the QA" more dangerous than "Download the achieve"?' : 'C. Vì sao "The job is still in the QA" nguy hiểm hơn "Download the achieve"?'}</strong></p>
<details><summary>${en ? 'Answer' : 'Đáp án'}</summary><p>${en ? 'Because it is a normal, meaningful sentence on a project: the listener believes it and nobody asks again, so the misunderstanding (testing vs waiting) travels into decisions. "Download the achieve" is obviously odd, so the listener asks or guesses "archive". Mistakes that produce a plausible meaning are the ones to fix first.' : 'Vì đó là một câu bình thường, có nghĩa trong dự án: người nghe tin và không ai hỏi lại, nên hiểu lầm (đang kiểm thử hay đang chờ) đi thẳng vào quyết định. "Download the achieve" nghe rõ là lạ, nên người nghe sẽ hỏi hoặc đoán ra "archive". Lỗi tạo ra một nghĩa hợp lý là lỗi phải sửa trước tiên.'}</p></details>

${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-6-5-lab', '🎙️', en ? '6.5 — Recording lab and Whisper' : '6.5 — Lab ghi âm và Whisper', en ? 'nghe.py, and 12 sentences showing what Whisper catches and misses.' : 'nghe.py, và 12 câu cho thấy Whisper bắt được và bỏ sót lỗi nào.')}
${lienKet('/language', '🗣️', en ? 'CT Language — pronunciation practice' : 'CT Language — luyện phát âm', en ? 'Listen to each word in the IT notebook and record yourself against it.' : 'Nghe từng từ trong sổ tay CNTT và tự ghi âm để so.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>IPA · ${en ? 'word stress' : 'trọng âm'} (stress) · ${en ? 'homophone' : 'từ đồng âm'} (homophone) · ${en ? 'final consonant' : 'phụ âm cuối'} · ${en ? 'consonant cluster' : 'cụm phụ âm'} · ${en ? 'silent letter' : 'chữ câm'} · shadowing · YouGlish · typosquatting</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Alone, even correct words are ambiguous (cache = cash, suite = sweet, queue = Q): always say a term inside a phrase.' : 'Nói riêng thì ngay cả từ đọc đúng cũng mơ hồ (cache = cash, suite = sweet, queue = Q): luôn đặt thuật ngữ trong một cụm.'}</li>
<li>${en ? 'Context repaired 8 of 11 Vietnamese-style terms in the test, but the 3 failures changed meaning (queue → QA) or broke neighbours.' : 'Trong thí nghiệm, ngữ cảnh vá được 8/11 thuật ngữ đọc kiểu Việt, nhưng 3 chỗ hỏng thì đổi nghĩa (queue → QA) hoặc làm hỏng chữ bên cạnh.'}</li>
<li>${en ? 'Four rules: stress (noun/verb pairs, -tion/-ic/-ity, compounds, acronyms), final sounds (-ed, -s), spelling traps (ch = k, silent letters, product names), letters and symbols.' : 'Bốn quy luật: trọng âm (cặp danh/động từ, -tion/-ic/-ity, từ ghép, viết tắt), âm cuối (-ed, -s), bẫy chính tả (ch = k, chữ câm, tên sản phẩm), chữ cái và ký hiệu.'}</li>
<li>${en ? 'Anything someone has to type — names, paths, commands — goes into the chat, not only into the air. Typosquatting (crossenv, 2017) lives in that gap.' : 'Mọi thứ người khác phải gõ lại — tên, đường dẫn, lệnh — phải dán vào chat, không chỉ nói. Typosquatting (crossenv, 2017) sống ở khe hở đó.'}</li>
</ul>
</div>`;

/* ═════════════ 7.3 — 100 mẫu câu ═════════════ */
const bangNhom = (en, nhom) => `
<table>
<thead><tr><th>#</th><th>${en ? 'Pattern (___ = fill in)' : 'Mẫu (___ = chỗ điền)'}</th><th>${en ? 'In Vietnamese' : 'Nghĩa'}</th><th>${en ? 'Where' : 'Dùng ở'}</th></tr></thead>
<tbody>
${MAU100.map((r, i) => [i + 1, ...r]).filter((r) => r[1] === nhom).map(([n, , m, vi, o]) => `<tr><td>${n}</td><td><strong>${esc(m)}</strong></td><td>${esc(vi)}</td><td>${esc(o)}</td></tr>`).join('\n')}
</tbody>
</table>`;
const banIn = () => NHOM100.map((g) => `${tenNhom(g).toUpperCase()}\n` + MAU100.map((r, i) => [i + 1, ...r]).filter((r) => r[1] === g).map(([n, , m]) => `${String(n).padStart(3)}. ${m}`).join('\n')).join('\n\n');

const L73 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 7 · Sentence patterns' : 'Chương 7 · Mẫu câu'}</span>
<h2>${en ? '7.3 — 100 sentence patterns for daily work situations' : '7.3 — 100 mẫu câu cho tình huống làm việc hằng ngày'}</h2>
<p class="lead">${en
    ? 'Fluent speakers do not build every sentence from grammar rules; they reuse ready-made chunks and change one or two words. This lesson gives you 100 such chunks for the ten things you do every working day — ask, request, report, raise a problem, apologise, push back, agree, thank, run a meeting, hand over — each with a slot to fill, the Vietnamese meaning and the channel where it fits. All 100 were checked with the email/chat checker from chapter 4, and there is a one-page version to print.'
    : 'Người nói trôi chảy không dựng từng câu từ luật ngữ pháp; họ dùng lại những "khối câu" có sẵn và chỉ đổi một hai chữ. Bài này đưa bạn 100 khối như thế cho mười việc bạn làm mỗi ngày đi làm — hỏi, nhờ, báo cáo, báo vấn đề, xin lỗi, phản đối, đồng ý, cảm ơn, điều khiển buổi họp, bàn giao — mỗi mẫu có chỗ trống để điền, nghĩa tiếng Việt và kênh dùng phù hợp. Cả 100 mẫu đã qua công cụ kiểm email/chat của chương 4, và có bản một trang để in.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Listen to a good receptionist at a hotel or a bank: "How can I help you?", "Could I have your name, please?", "One moment, please." They are not improvising; they have a small set of formulas that always work, and their attention goes to the guest, not to grammar. At work, these 100 patterns are your formulas. When they are automatic, your thinking is free for the technical content.'
    : 'Nghe một lễ tân giỏi ở khách sạn hay ngân hàng: "How can I help you?", "Could I have your name, please?", "One moment, please." Họ không ứng biến; họ có một bộ câu cửa miệng nhỏ luôn dùng được, và đầu óc dành cho khách chứ không dành cho ngữ pháp. Đi làm, 100 mẫu này là câu cửa miệng của bạn. Khi chúng đã thành phản xạ, đầu óc bạn rảnh để lo nội dung kỹ thuật.'}</p>

<h3>${en ? 'How to use the list' : 'Cách dùng danh sách'}</h3>
<ul>
<li>${en ? '<strong>Fill the slot with something real</strong> from your project (a ticket key, a date with time zone, a name). A pattern with a vague slot is still a vague sentence: "Could you take a look at <em>it</em>?" vs "Could you take a look at <em>PR #48, the retry logic</em>?"' : '<strong>Điền chỗ trống bằng thứ có thật</strong> trong dự án (mã ticket, ngày kèm múi giờ, tên người). Mẫu điền mơ hồ vẫn là câu mơ hồ: "Could you take a look at <em>it</em>?" so với "Could you take a look at <em>PR #48, the retry logic</em>?"'}</li>
<li>${en ? '<strong>Ten a day, in speech and in writing.</strong> Say each pattern out loud three times with a different fill, then write one in a real message that day. In ten working days you have used all 100.' : '<strong>Mỗi ngày mười mẫu, cả nói lẫn viết.</strong> Đọc to mỗi mẫu ba lần với ba cách điền khác nhau, rồi dùng một mẫu trong một tin nhắn thật hôm đó. Mười ngày làm việc là bạn đã dùng đủ 100.'}</li>
<li>${en ? '<strong>Match the channel.</strong> "LGTM" is perfect in a review and wrong in an email to a client; "We apologize for the inconvenience" fits an incident email and sounds cold in a team chat.' : '<strong>Đúng kênh.</strong> "LGTM" hoàn hảo trong review nhưng sai trong email gửi khách; "We apologize for the inconvenience" hợp email sự cố nhưng nghe lạnh lùng trong chat nội bộ.'}</li>
</ul>

<h3>${en ? 'Checked, not just written' : 'Đã kiểm, không chỉ viết ra'}</h3>
<p>${en
    ? 'Each pattern was saved as one chat message (with "X" in the slots) and passed through <code>kiem-email.mjs</code> from lesson 4.6, which flags ASAP/EOD, "tomorrow" without a date, repeated apologies, "Dear Sir/Madam", "do the needful" and other habits:'
    : 'Mỗi mẫu được lưu thành một tin nhắn chat (chỗ trống thay bằng "X") và cho qua <code>kiem-email.mjs</code> của bài 4.6 — công cụ bắt ASAP/EOD, "tomorrow" không kèm ngày, xin lỗi lặp, "Dear Sir/Madam", "do the needful" và các thói quen khác:'}</p>
${RUN('100-kiem', 'node kiem-email.mjs *.txt | grep -v ": OK$"; echo "OK: …"', NOTE_RUN(en))}
${mau(OUT['100-dem'], en ? 'Length of the patterns (awk, same run).' : 'Độ dài các mẫu (awk, cùng lượt chạy).')}
<p>${en
    ? 'The first run was not clean: the checker flagged pattern 95, then written "I’m off tomorrow. ___ will cover ___.", with <code>DATE-REL "tomorrow" without a date; it is already tomorrow for someone</code>. For a client in Tokyo or a teammate reading the next morning, "tomorrow" is ambiguous — the pattern is now "I’m off on ___." A tool is useful exactly when it catches what the author did not see.'
    : 'Lượt chạy đầu không sạch: công cụ bắt mẫu 95, khi đó viết "I’m off tomorrow. ___ will cover ___.", với cảnh báo <code>DATE-REL "tomorrow" without a date; it is already tomorrow for someone</code>. Với khách ở Tokyo hay đồng nghiệp đọc vào sáng hôm sau, "tomorrow" là mơ hồ — mẫu giờ là "I’m off on ___." Công cụ có ích đúng ở chỗ nó bắt được điều người viết không thấy.'}</p>

<h3>${en ? 'The politeness ladder' : 'Bậc thang lịch sự'}</h3>
<p>${en
    ? 'Most requests in the list start with "Could you…". That is the safe middle step. Move up or down depending on the person and the size of the request:'
    : 'Phần lớn câu nhờ trong danh sách bắt đầu bằng "Could you…". Đó là bậc giữa an toàn. Lên hay xuống bậc tuỳ người nghe và độ lớn của việc nhờ:'}</p>
<table>
<thead><tr><th>${en ? 'Step' : 'Bậc'}</th><th>${en ? 'Example' : 'Ví dụ'}</th><th>${en ? 'Use with' : 'Dùng với'}</th></tr></thead>
<tbody>
<tr><td>1</td><td><em>Can you check PR #48?</em></td><td>${en ? 'close teammates, small things' : 'đồng đội thân, việc nhỏ'}</td></tr>
<tr><td>2</td><td><em>Could you check PR #48 today?</em></td><td>${en ? 'everyone — the default' : 'mọi người — mặc định'}</td></tr>
<tr><td>3</td><td><em>Would you mind checking PR #48 before the demo?</em></td><td>${en ? 'seniors, the client, extra work' : 'senior, khách, việc thêm cho họ'}</td></tr>
<tr><td>4</td><td><em>I was wondering if you could review the design document this week.</em></td><td>${en ? 'big requests, people you do not know' : 'việc lớn, người chưa quen'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'Two warnings. "Please" does not make an order polite ("Please send it now" is still an order); the question form does. And do not climb too high in a team chat — "I was wondering if you could possibly…" for a two-minute review sounds strange. Lessons 3.3 and 4.5 practise this in reviews and chat.'
    : 'Hai lưu ý. "Please" không biến mệnh lệnh thành lịch sự ("Please send it now" vẫn là ra lệnh); dạng câu hỏi mới làm được. Và đừng leo quá cao trong chat nội bộ — "I was wondering if you could possibly…" cho một lần review hai phút nghe rất lạ. Bài 3.3 và 4.5 luyện điều này trong review và chat.'}</p>

<h3>${en ? 'Translated sentences to replace' : 'Những câu "dịch từng chữ" cần thay'}</h3>
${saiDung([
    ['I want you to check this.', 'Could you check this?', en ? '"I want you to" sounds like an order from a boss.' : '"I want you to" nghe như sếp ra lệnh.'],
    ['You must reply before Friday.', 'Could you reply by Friday 17:00 JST? We need it to start the migration.', en ? '"must" from a vendor to a client is rude; give the reason instead.' : 'bên làm thuê dùng "must" với khách là thô; đưa lý do thay vào.'],
    ['I’m not understand.', 'Sorry, I don’t understand the second point. Do you mean ___?', en ? 'grammar + say which part.' : 'sai ngữ pháp + nói rõ phần nào chưa hiểu.'],
    ['Why you don’t test it?', 'Could you tell me how it was tested?', en ? 'a "why" question about a person sounds like blame.' : 'hỏi "why" về một người nghe như trách móc.'],
    ['Please kindly help me.', 'Could you help me with ___?', en ? '"please kindly" is double and old-fashioned; say what help.' : '"please kindly" thừa và cũ; nói rõ nhờ việc gì.'],
    ['Noted with thanks.', 'Thanks, noted. I’ll update the ticket today.', en ? 'fine but empty; add what you will do.' : 'được nhưng rỗng; thêm việc bạn sẽ làm.'],
    ['It’s OK, no problem.', 'Agreed. I’ll take care of it by Thursday.', en ? '"no problem" after a client request can sound like the request was trivial; confirm the action.' : '"no problem" sau một yêu cầu của khách có thể nghe như việc đó vặt vãnh; xác nhận hành động.'],
    ['Sorry sorry, my bad, sorry.', 'Sorry, that was my mistake. I’ve fixed it in PR #51.', en ? 'apologise once, then the fix (lesson 4.3).' : 'xin lỗi một lần, rồi tới cách sửa (bài 4.3).'],
  ], en)}

<h3>${en ? 'The 100 patterns' : '100 mẫu câu'}</h3>
${NHOM100.map((g) => `<h4>${esc(g.replace(/^(\d+) /, '$1. '))}</h4>\n${bangNhom(en, g)}`).join('\n')}

<h3>${en ? 'One-page version to print' : 'Bản một trang để in'}</h3>
<p>${en ? 'English only, numbered like the tables. Print it, stick it next to your screen for the first month of OJT, and cross out each pattern the first time you use it for real.' : 'Chỉ tiếng Anh, đánh số như các bảng. In ra, dán cạnh màn hình trong tháng đầu OJT, và gạch mỗi mẫu ngay lần đầu bạn dùng nó thật.'}</p>
${mau(banIn())}

<h3>${en ? 'At work: OJT situations' : 'Đi làm: tình huống OJT'}</h3>
<ul>
<li>${en ? 'First week: you will mostly need groups 1 (asking), 2 (requesting) and 3 (reporting). Learn those 40 first.' : 'Tuần đầu: bạn chủ yếu cần nhóm 1 (hỏi), 2 (nhờ) và 3 (báo cáo). Học 40 mẫu đó trước.'}</li>
<li>${en ? 'Your mentor writes "Could you take a look at the failing test when you have a moment?" — this is a polite <em>request with a deadline of "soon"</em>, not an optional suggestion. Reply with pattern 33: "Sure, I expect to finish it by 15:00."' : 'Mentor viết "Could you take a look at the failing test when you have a moment?" — đây là một <em>yêu cầu lịch sự có hạn là "sớm"</em>, không phải gợi ý tuỳ ý. Trả lời bằng mẫu 33: "Sure, I expect to finish it by 15:00."'}</li>
<li>${en ? 'A Japanese client rarely says "no" (lesson 6.3). Patterns 59–68 are how <em>you</em> say "no" in the same indirect but clear way: concern + reason + alternative.' : 'Khách Nhật hiếm khi nói thẳng "no" (bài 6.3). Mẫu 59–68 là cách <em>bạn</em> nói "không" theo cùng lối gián tiếp nhưng rõ: mối lo + lý do + phương án khác.'}</li>
</ul>

<h3>${en ? 'Practice' : 'Bài luyện'}</h3>
<p><strong>${en ? 'A. Which pattern fits? Write the full sentence.' : 'A. Mẫu nào hợp? Viết thành câu đầy đủ.'}</strong></p>
${mau(`1. You need read access to the client's Jira project.
2. In the call you missed the date the client said.
3. A teammate found a bug in your PR.
4. The client asks for a new report page in the middle of the sprint.
5. You will finish LAB-412 on Thursday afternoon.
6. You will be on leave on 2 December; Minh covers your tickets.
7. You want 15 minutes with the tech lead to discuss caching.
8. The meeting is almost over and two items are left.
9. A tester shows a bug you cannot reproduce on your machine.
10. The client approved the design in the meeting.`)}
<details><summary>${en ? 'Model answers' : 'Đáp án mẫu'}</summary>${mau(`1. (19) Could you grant me access to the client's Jira project?
2. (6)  Sorry, I didn't catch the date. Could you say it again?
3. (53) Thanks for catching that. Fixed in commit 7c1d2e9.
4. (60) That's outside the scope of Sprint 6. We can do it as a change request.
5. (33) I expect to finish LAB-412 by Thursday afternoon.
6. (95) I'm off on 2 December. Minh will cover LAB-412 and LAB-415.
7. (18) Do you have 15 minutes today to go through the caching options?
8. (92) We're running out of time. Let's move the last two items to Friday.
9. (8)  Which environment did you see this on?  (+ 12) Could you share the steps to reproduce?
10. (72) Confirmed: the client approved the design on 24 Nov 2026.`)}</details>
<p><strong>${en ? 'B. Rewrite these five messages with patterns from the list.' : 'B. Viết lại năm tin nhắn sau bằng mẫu trong danh sách.'}</strong></p>
${mau(`1. I want you review my code today.
2. Why you not reply my email?
3. Sorry sorry, the build is fail because me.
4. This is not my task.
5. OK no problem, we will do the new report for you.`)}
<details><summary>${en ? 'Model answers' : 'Đáp án mẫu'}</summary>${mau(`1. Could you review my PR for LAB-412 by 17:00 today? It's small (60 lines).
2. Just checking: did you get my email from Monday about the test account?
   We need it to start UAT on Thursday.
3. Sorry, that was my mistake: my last commit broke the build.
   I've reverted it and the build is green again.
4. I'm not the owner of this one. I think Linh is the right person to ask.
   I can take it if she's busy.
5. Thanks for the request. The new report is outside the scope of this sprint;
   we can send you an estimate as a change request by Friday.`)}</details>

${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-4-6-lab', '✉️', en ? '4.6 — Lab: six emails' : '4.6 — Lab: sáu email', en ? 'kiem-email.mjs, the checker used above.' : 'kiem-email.mjs, công cụ kiểm dùng ở trên.')}
${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-6-3-hop', '🤝', en ? '6.3 — Meetings' : '6.3 — Họp', en ? 'Patterns 59–68 and 85–94 in a real call.' : 'Mẫu 59–68 và 85–94 trong một cuộc gọi thật.')}
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-8-4-khi-khong-hieu', '❓', en ? 'Interview prep 8.4 — When you don’t understand' : 'Chuẩn bị phỏng vấn 8.4 — Khi không hiểu câu hỏi', en ? 'The asking patterns, used in an interview.' : 'Các mẫu hỏi lại, dùng khi phỏng vấn.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>${en ? 'chunk (sentence pattern)' : 'khối câu (chunk)'} · ${en ? 'slot' : 'chỗ trống (slot)'} · ${en ? 'politeness ladder' : 'bậc lịch sự'} · ${en ? 'channel' : 'kênh'} · LGTM · ${en ? 'change request' : 'yêu cầu thay đổi (change request)'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Fluency at work = reusing chunks and filling the slot with something real.' : 'Trôi chảy khi đi làm = dùng lại khối câu và điền chỗ trống bằng thứ có thật.'}</li>
<li>${en ? 'Ten groups, 100 patterns, 6.6 words on average; all 100 pass the chapter 4 checker.' : 'Mười nhóm, 100 mẫu, trung bình 6,6 từ; cả 100 qua công cụ kiểm của chương 4.'}</li>
<li>${en ? '"Could you…?" is the default; climb the ladder for seniors, clients and big requests.' : '"Could you…?" là mặc định; leo bậc với senior, khách và việc nhờ lớn.'}</li>
<li>${en ? 'Replace translated orders ("I want you to", "You must", "Why you…") with questions and reasons.' : 'Thay câu ra lệnh dịch từng chữ ("I want you to", "You must", "Why you…") bằng câu hỏi và lý do.'}</li>
</ul>
</div>`;

/* ═════════════ 7.4 — Lab: kiểm phát âm + bộ từ ═════════════ */
const L74 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 7 · Lab' : 'Chương 7 · Lab'}</span>
<h2>${en ? '7.4 — Lab: pronunciation check with recordings and a vocabulary set in CT Language' : '7.4 — Lab: Kiểm phát âm bằng ghi âm và tạo bộ từ trong CT Language'}</h2>
<p class="lead">${en
    ? 'In this lab you say the 20 terms of lesson 7.2 inside 20 short sentences, let Whisper write down what it heard, and check the result with a 39-line tool that tells you which terms did not get through. Then you turn the same list into a flashcard deck that comes back to you on a schedule, so the right shape stays. The whole loop is first done in front of you with a machine voice — real output — so you know exactly what to expect.'
    : 'Trong lab này bạn nói 20 thuật ngữ của bài 7.2 trong 20 câu ngắn, để Whisper chép lại điều nó nghe được, rồi kiểm kết quả bằng một công cụ 39 dòng chỉ ra thuật ngữ nào chưa "lọt tai". Sau đó bạn biến chính danh sách ấy thành một bộ thẻ ôn tự quay lại theo lịch, để hình dạng đúng không bị quên. Cả vòng được làm mẫu trước bằng giọng máy — output thật — để bạn biết chính xác sẽ thấy gì.'}</p>

<h3>${en ? 'Pass criteria' : 'Đạt khi'}</h3>
<ul>
<li>${en ? 'Whisper hears <strong>20/20</strong> terms in your recording (the tool exits with code 0).' : 'Whisper nghe được <strong>20/20</strong> thuật ngữ trong bản ghi của bạn (công cụ thoát mã 0).'}</li>
<li>${en ? 'A person (classmate, mentor, AI speaking partner) listens to 10 random terms and confirms the <strong>stress</strong> is right — Whisper cannot check stress reliably (lesson 7.2, experiment 2).' : 'Một người (bạn học, mentor, bạn luyện nói AI) nghe 10 thuật ngữ bất kỳ và xác nhận <strong>trọng âm</strong> đúng — Whisper không kiểm được trọng âm một cách tin cậy (bài 7.2, thí nghiệm 2).'}</li>
<li>${en ? 'A deck of at least 20 cards exists and you have reviewed it on <strong>three different days</strong>.' : 'Có một bộ thẻ ít nhất 20 thẻ và bạn đã ôn nó vào <strong>ba ngày khác nhau</strong>.'}</li>
</ul>

<h3>${en ? 'What you need' : 'Cần chuẩn bị'}</h3>
<ul>
<li>${en ? 'A phone or laptop that records audio (.m4a, .wav or .mp3 all work).' : 'Điện thoại hoặc laptop ghi âm được (.m4a, .wav hay .mp3 đều được).'}</li>
<li>${en ? '<code>nghe.py</code> from lesson 6.5 (Python + <code>pip install faster-whisper</code>; the first run downloads the model, then it works offline).' : '<code>nghe.py</code> của bài 6.5 (Python + <code>pip install faster-whisper</code>; lần đầu tải mô hình, sau đó chạy không cần mạng).'}</li>
<li>${en ? 'Node.js 18+ for <code>kiem-thuat-ngu.mjs</code> (source at the end of this lesson, no packages).' : 'Node.js 18+ để chạy <code>kiem-thuat-ngu.mjs</code> (mã nguồn ở cuối bài, không cần gói).'}</li>
<li>${en ? 'The list file below, saved as <code>20-thuat-ngu.tsv</code> (TAB between columns). The last column is only for the machine demo; you can delete it.' : 'Tệp danh sách dưới đây, lưu thành <code>20-thuat-ngu.tsv</code> (TAB giữa các cột). Cột cuối chỉ dùng cho phần làm mẫu bằng máy; bạn xoá được.'}</li>
</ul>
${mau(EM['20-thuat-ngu.tsv'], en ? '20-thuat-ngu.tsv — the "accept" column lists spellings that count as heard (nginx may come back as "engine x", SQL as "sequel").' : '20-thuat-ngu.tsv — cột "accept" ghi các cách viết được tính là nghe đúng (nginx có thể ra "engine x", SQL ra "sequel").')}

<h3>${en ? 'The loop, done once with a machine voice' : 'Cả vòng, làm mẫu một lần bằng giọng máy'}</h3>
<p>${en ? '<strong>1. Correct reading.</strong> eSpeak NG reads the 20 sentences in one go; Whisper writes them down; the tool compares.' : '<strong>1. Đọc đúng.</strong> eSpeak NG đọc liền 20 câu; Whisper chép lại; công cụ so.'}</p>
${mau(`$ espeak-ng -v en-us -s 140 -w 74-dung.wav "$(grep -v '^#' 20-thuat-ngu.tsv | cut -f5 | tr '\\n' ' ')"\n$ python nghe.py 74-dung.wav > 74-nghe-dung.txt\n$ cat 74-nghe-dung.txt\n` + OUT['74-nghe-dung'], NOTE_AM(en))}
${RUN('74-kiem-dung', 'node kiem-thuat-ngu.mjs 20-thuat-ngu.tsv 74-nghe-dung.txt', NOTE_RUN(en))}
<p>${en ? '<strong>2. Vietnamese-style reading</strong> of 11 terms (the last column of the list). Same steps:' : '<strong>2. Đọc kiểu Việt</strong> 11 thuật ngữ (cột cuối của danh sách). Cùng các bước:'}</p>
${RUN('74-kiem-sai', 'node kiem-thuat-ngu.mjs 20-thuat-ngu.tsv 74-nghe-sai.txt', NOTE_RUN(en))}
<p>${en
    ? '17/20 and exit code 1: queue (heard as "QA"), Azure ("Azura") and archive ("achieve") did not get through. The eight other wrong terms passed because the sentence gave them away — which is why the second pass criterion (a person checks stress) exists. Read a ✓ as "the word survived", not "the word was perfect".'
    : '17/20 và mã thoát 1: queue (nghe thành "QA"), Azure ("Azura") và archive ("achieve") không lọt tai. Tám thuật ngữ đọc sai còn lại vẫn qua vì câu đã "lộ" đáp án — chính vì vậy có tiêu chí đạt thứ hai (một người nghe trọng âm). Hiểu ✓ là "từ sống sót", không phải "từ hoàn hảo".'}</p>
<p>${en
    ? 'Why must "deploy" be heard <em>twice</em>? It appears in two sentences (11 and 17). The tool counts how many times each term occurs in your script and requires at least as many in the transcript, so one good "deploy" cannot hide one bad one.'
    : 'Vì sao "deploy" phải được nghe <em>hai lần</em>? Nó xuất hiện ở hai câu (11 và 17). Công cụ đếm số lần mỗi thuật ngữ có trong kịch bản và đòi bản chép lời phải có ít nhất bấy nhiêu lần, để một chữ "deploy" đọc tốt không che được một chữ đọc hỏng.'}</p>

<h3>${en ? 'Your turn — step by step' : 'Đến lượt bạn — từng bước'}</h3>
<ol>
<li>${en ? '<strong>Listen first (10 minutes).</strong> For each term, open Cambridge Dictionary or YouGlish (lesson 7.2) and listen to 3 speakers. Mark the stressed syllable on your printed list.' : '<strong>Nghe trước (10 phút).</strong> Với mỗi thuật ngữ, mở Cambridge Dictionary hoặc YouGlish (bài 7.2) và nghe 3 người nói. Đánh dấu âm được nhấn vào bản in.'}</li>
<li>${en ? '<strong>Shadow (10 minutes).</strong> Read each sentence aloud three times, at a normal speed. Do not slow down only on the term — say the whole sentence with the same rhythm.' : '<strong>Nói đuổi (10 phút).</strong> Đọc to mỗi câu ba lần, tốc độ bình thường. Đừng chỉ chậm lại ở thuật ngữ — nói cả câu cùng một nhịp.'}</li>
<li>${en ? '<strong>Record</strong> the 20 sentences in one take (about 50 seconds). One take, no editing: in a meeting there is no second try.' : '<strong>Ghi âm</strong> 20 câu trong một lượt (khoảng 50 giây). Một lượt, không cắt ghép: trong buổi họp không có lần thứ hai.'}</li>
<li>${en ? '<strong>Transcribe</strong>: <code>python nghe.py ban-ghi.m4a &gt; nghe.txt</code>' : '<strong>Chép lời</strong>: <code>python nghe.py ban-ghi.m4a &gt; nghe.txt</code>'}</li>
<li>${en ? '<strong>Check</strong>: <code>node kiem-thuat-ngu.mjs 20-thuat-ngu.tsv nghe.txt</code>' : '<strong>Kiểm</strong>: <code>node kiem-thuat-ngu.mjs 20-thuat-ngu.tsv nghe.txt</code>'}</li>
<li>${en ? '<strong>Fix only the ✗ terms</strong>: listen again, record just those sentences, check again. Then the person check (10 random terms).' : '<strong>Chỉ sửa thuật ngữ ✗</strong>: nghe lại, ghi lại riêng các câu đó, kiểm lại. Rồi nhờ người nghe (10 thuật ngữ bất kỳ).'}</li>
<li>${en ? '<strong>Keep the first recording.</strong> Record again in a month and compare — this is your progress evidence.' : '<strong>Giữ bản ghi đầu tiên.</strong> Một tháng sau ghi lại và so — đây là bằng chứng tiến bộ của bạn.'}</li>
</ol>

<h3>${en ? 'How to read a ✗ (it is not always you)' : 'Đọc một dấu ✗ thế nào (không phải lúc nào cũng tại bạn)'}</h3>
<p>${en
    ? 'Task B below adds 10 terms from a Spring/Node project. Even the machine voice, reading them correctly, got only 6/10:'
    : 'Bài B ở dưới thêm 10 thuật ngữ của một dự án Spring/Node. Ngay cả giọng máy đọc đúng cũng chỉ được 6/10:'}</p>
${mau(OUT['74-nghe-them'], NOTE_AM(en))}
${RUN('74-kiem-them', 'node kiem-thuat-ngu.mjs them-10.tsv 74-nghe-them.txt', NOTE_RUN(en))}
${mau(OUT['74-them-ipa'], en ? 'How eSpeak NG pronounced the four failures (espeak-ng -q --ipa -v en-us).' : 'eSpeak NG đã đọc bốn chỗ hỏng thế nào (espeak-ng -q --ipa -v en-us).')}
<p>${en ? 'Four different reasons, four different fixes:' : 'Bốn lý do khác nhau, bốn cách sửa khác nhau:'}</p>
<table>
<thead><tr><th>${en ? 'Term → heard as' : 'Thuật ngữ → nghe thành'}</th><th>${en ? 'Reason' : 'Lý do'}</th><th>${en ? 'What to do' : 'Cách làm'}</th></tr></thead>
<tbody>
<tr><td>CORS → <code>cores</code></td><td>${en ? 'Homophone: /kɔːrz/ is exactly "cores" (the machine IPA is identical).' : 'Đồng âm: /kɔːrz/ y hệt "cores" (IPA máy giống hệt nhau).'}</td><td>${en ? 'Add a noun: "a CORS error", "the CORS policy". Spell it in the chat.' : 'Thêm danh từ: "a CORS error", "the CORS policy". Đánh vần trong chat.'}</td></tr>
<tr><td>PostgreSQL → <code>post the SQL</code></td><td>${en ? 'The machine read it wrongly ("post-ger-S-Q-L"). The name is "post-gres-Q-L"; most people just say "Postgres".' : 'Máy đọc sai ("pốt-gơ-S-Q-L"). Tên đọc là "pốt-grét-Q-L"; đa số chỉ nói "Postgres".'}</td><td>${en ? 'Say "Postgres". Not your fault if the model is wrong — check the model too.' : 'Nói "Postgres". Không phải lỗi của bạn khi mẫu sai — kiểm cả mẫu nữa.'}</td></tr>
<tr><td>OAuth → <code>auth</code></td><td>${en ? 'The short "O" was swallowed at normal speed.' : 'Chữ "O" ngắn bị nuốt khi nói tốc độ thường.'}</td><td>${en ? 'Give the O its own beat: "O — auth", "OAuth two point zero".' : 'Cho chữ O một nhịp riêng: "Ô — ót", "OAuth two point zero".'}</td></tr>
<tr><td>bean → <code>bnet</code></td><td>${en ? 'Linking: "bean at" ran together into a non-word.' : 'Nối âm: "bean at" dính lại thành một chữ vô nghĩa.'}</td><td>${en ? 'Tiny pause after short terms, or a longer phrase: "the UserService bean".' : 'Ngừng rất ngắn sau thuật ngữ ngắn, hoặc dùng cụm dài hơn: "the UserService bean".'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'This is the most useful part of the lab: the tool shows <em>where</em> communication may break; you decide <em>why</em>. In real calls the same four fixes work for people: add context, use the common name, give short words a beat, and paste anything important in the chat.'
    : 'Đây là phần có ích nhất của lab: công cụ chỉ ra <em>chỗ</em> giao tiếp có thể hỏng; bạn quyết định <em>vì sao</em>. Trong cuộc gọi thật, bốn cách sửa ấy cũng dùng được với người: thêm ngữ cảnh, dùng tên phổ biến, cho chữ ngắn một nhịp, và dán mọi thứ quan trọng vào chat.'}</p>

<h3>${en ? 'Part 2 — a deck that comes back on schedule' : 'Phần 2 — bộ thẻ tự quay lại theo lịch'}</h3>
<p>${en
    ? 'Pronunciation you fixed today is gone in a week unless you meet it again. Spaced repetition shows a card just before you would forget it: after 1 day, then 6 days, then about 15, 38, 95 days if you answer "good" each time — the interval is multiplied each time you remember, and goes back to 1 day when you forget (the SM-2 method, which Anki and the CT Language notebook are built on; apps tune the first steps).'
    : 'Phát âm bạn sửa hôm nay sẽ mất sau một tuần nếu không gặp lại. Ôn tập ngắt quãng (spaced repetition) cho thẻ hiện ra đúng lúc bạn sắp quên: sau 1 ngày, rồi 6 ngày, rồi khoảng 15, 38, 95 ngày nếu lần nào cũng chấm "được" — mỗi lần nhớ được thì khoảng cách nhân lên, quên thì quay về 1 ngày (phương pháp SM-2, nền của Anki và sổ tay CT Language; mỗi ứng dụng chỉnh lại vài bước đầu).'}</p>
<p><strong>${en ? 'Option A — CT Language (app).' : 'Cách A — CT Language (ứng dụng).'}</strong></p>
<ol>
<li>${en ? 'Open <strong>Notebook (Sổ tay)</strong> → <strong>Industry notebooks (Sổ tay chuyên ngành)</strong> → English → <strong>CNTT – phần mềm</strong>: 96 work words in six groups, each with IPA, audio and an example sentence. "Add the whole set" puts them in a notebook; "Study cards now" starts a review.' : 'Mở <strong>Sổ tay</strong> → <strong>Sổ tay chuyên ngành</strong> → tiếng Anh → <strong>CNTT – phần mềm</strong>: 96 từ nghề chia sáu nhóm, mỗi từ có IPA, âm thanh và câu ví dụ. "Thêm cả bộ" đưa cả bộ vào một sổ; "Học thẻ ngay" bắt đầu ôn.'}</li>
<li>${en ? 'Create your own notebook <strong>"TAK – 20 thuật ngữ"</strong>, look up each term of your list in the dictionary tab and save it to that notebook (a word can be in several notebooks).' : 'Tạo sổ riêng <strong>"TAK – 20 thuật ngữ"</strong>, tra từng thuật ngữ trong danh sách ở tab Từ điển và lưu vào sổ đó (một từ nằm được trong nhiều sổ).'}</li>
<li>${en ? 'Where the app offers <strong>pronunciation practice</strong> on a word or example sentence, record yourself there too: it scores each sound (accuracy, fluency) and gives tips written for Vietnamese speakers.' : 'Ở từ hoặc câu ví dụ nào ứng dụng có nút <strong>Luyện phát âm</strong>, ghi âm luôn ở đó: nó chấm từng âm (độ chính xác, độ trôi chảy) và gợi ý sửa viết riêng cho người Việt.'}</li>
<li>${en ? 'Turn on the review reminder (Me › settings) for a time you are free every day — 10 minutes on the bus is enough.' : 'Bật nhắc ôn (Tôi › cài đặt) vào một giờ bạn rảnh mỗi ngày — 10 phút trên xe buýt là đủ.'}</li>
</ol>
<p><strong>${en ? 'Option B — any flashcard app (Anki, Quizlet).' : 'Cách B — ứng dụng thẻ bất kỳ (Anki, Quizlet).'}</strong> ${en ? 'The tool exports your list as CSV:' : 'Công cụ xuất danh sách của bạn thành CSV:'}</p>
${RUN('74-csv', 'node kiem-thuat-ngu.mjs 20-thuat-ngu.tsv --csv > the-tu.csv', NOTE_RUN(en))}
<p>${en ? 'Import <code>the-tu.csv</code> into Anki (File › Import, comma-separated, first line is the header) or Quizlet (Import, separator "comma"). Add the audio of a real speaker to the back of each card if your app allows it.' : 'Nhập <code>the-tu.csv</code> vào Anki (File › Import, phân tách bằng dấu phẩy, dòng đầu là tiêu đề) hoặc Quizlet (Import, dấu phân tách "comma"). Ứng dụng cho phép thì thêm âm thanh người nói thật vào mặt sau mỗi thẻ.'}</p>
<p>${en
    ? 'Whichever option: the card front is the <em>written</em> term; when it appears, <strong>say it out loud</strong> in a sentence before turning it over. A silent review trains reading, not speaking.'
    : 'Cách nào cũng vậy: mặt trước là thuật ngữ <em>viết</em>; khi thẻ hiện ra, <strong>nói to</strong> nó trong một câu rồi mới lật. Ôn thầm là luyện đọc, không phải luyện nói.'}</p>

<h3>${en ? 'Tasks' : 'Bài tập'}</h3>
<p><strong>${en ? 'A. Do the loop with your own voice and keep the report.' : 'A. Làm cả vòng bằng giọng của bạn và giữ lại kết quả.'}</strong></p>
<details><summary>${en ? 'What a good report looks like' : 'Một báo cáo tốt trông thế nào'}</summary>${mau(`Lab 7.4 — 2026-11-24
Take 1: 16/20. Missed: queue (heard "Q"), Azure ("as you"), schema ("scheme a"),
        width ("with").
Fixes:  queue -> "the job queue"; Azure -> /ˈæʒər/, 2 syllables; schema -> SKI-mə;
        width -> tongue between teeth for dθ.
Take 2: 20/20. Person check (Linh, 10 terms): stress wrong on "enum" (I said e-NUM).
Deck:   CT Language notebook "TAK – 20 thuật ngữ", 20 cards; reviewed 24/11, 25/11, 27/11.
Next:   record again on 24/12 and compare with take 1.`)}
<p>${en ? 'Your misses will differ; what matters is the shape: score, misses with what was heard, the fix for each, the person check, the deck, the next date.' : 'Các chỗ hỏng của bạn sẽ khác; điều quan trọng là khuôn: điểm, chỗ hỏng kèm thứ máy nghe được, cách sửa từng chỗ, người nghe kiểm, bộ thẻ, ngày ghi lại.'}</p></details>
<p><strong>${en ? 'B. Extend the list with 10 terms from your own project.' : 'B. Thêm vào danh sách 10 thuật ngữ của chính dự án bạn.'}</strong> ${en ? 'Write the TSV lines (term, accepted spellings, IPA, meaning, sentence).' : 'Viết các dòng TSV (thuật ngữ, cách viết chấp nhận, IPA, nghĩa, câu).'}</p>
<details><summary>${en ? 'Model answer (a Spring/Node project) — this is the file used above' : 'Đáp án mẫu (dự án Spring/Node) — chính là tệp đã dùng ở trên'}</summary>${mau(EM['them-10.tsv'])}
<p>${en ? 'Notes: "accept" lists the spellings Whisper may legitimately produce (postgres or postgresql; o-auth or oauth). Do not add near-words like "course" for CORS — that would hide a real problem.' : 'Ghi chú: "accept" ghi các cách viết Whisper có thể đưa ra một cách chính đáng (postgres hay postgresql; o-auth hay oauth). Đừng thêm chữ gần giống như "course" cho CORS — làm vậy sẽ che mất vấn đề thật.'}</p></details>
<p><strong>${en ? 'C. Talk for 60 seconds about how your project is built, using at least 8 terms from the lists. Record and check it.' : 'C. Nói 60 giây về cách dự án của bạn được dựng, dùng ít nhất 8 thuật ngữ trong các danh sách. Ghi âm và kiểm.'}</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`Our project is a lab booking system. The frontend is React, and the backend is
a Spring Boot API with about twenty endpoints. Data is stored in Postgres,
and we use Hibernate, so we rarely write SQL by hand. Users log in with
Google through OAuth, and the API returns a JWT that a middleware checks on
every request. We cache the list of devices in Redis. Everything runs in
Docker on a Linux server, and GitHub Actions deploys it when we merge to main.
The hardest bug was a CORS error between the React app and the API.`)}
<p>${en ? '14 terms from the lists in 99 words. Each term sits inside a phrase that explains it ("the list of devices in Redis", "a CORS error between…"), so a listener who misses one word still follows.' : '14 thuật ngữ của các danh sách trong 99 từ. Mỗi thuật ngữ nằm trong một cụm tự giải thích ("the list of devices in Redis", "a CORS error between…"), nên người nghe lỡ một chữ vẫn theo kịp.'}</p></details>

<h3>${en ? 'Source of kiem-thuat-ngu.mjs' : 'Mã nguồn kiem-thuat-ngu.mjs'}</h3>
${mau(KIEMTN, en ? 'Node 18+, no packages. Exit code 0 = every term heard, 1 = some missing, 2 = wrong usage.' : 'Node 18+, không cần gói. Mã thoát 0 = nghe đủ, 1 = thiếu thuật ngữ, 2 = gọi sai cách.')}

<h3>🎤 ${en ? 'Interviewers will ask (answer in English, 30–60 seconds each)' : 'Phỏng vấn viên sẽ hỏi (trả lời bằng tiếng Anh, mỗi câu 30–60 giây)'}</h3>
<p>${en ? 'OJT/fresher interviews often check English by asking you to <em>explain</em> technical words. Record your answer before opening the model, then run it through the same loop.' : 'Phỏng vấn OJT/fresher hay kiểm tiếng Anh bằng cách bắt bạn <em>giải thích</em> từ kỹ thuật. Ghi âm câu trả lời trước khi mở đáp án mẫu, rồi cho chạy qua đúng vòng kiểm ở trên.'}</p>
<p><strong>1. What is the difference between a rollback and a hotfix?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`A rollback means going back to the previous version that worked, for example
from 2.3.0 to 2.2.4. It's fast and it stops the damage, but the new features
are gone too. A hotfix is a new, small version with only the fix, released
outside the normal schedule. In practice we often roll back first to protect
users, and then prepare a hotfix when we understand the root cause.`)}</details>
<p><strong>2. Can you explain what a cache is, to someone who is not technical?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`A cache is a copy of data kept close to where it's needed, so we don't have
to fetch it from far away every time. It's like keeping a bottle of water on
your desk instead of walking to the kitchen. It makes the system much faster,
but the copy can become old, so we have to decide when to refresh it.`)}</details>
<p><strong>3. Walk me through how your project is deployed.</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`When we merge a pull request to main, GitHub Actions runs the tests and builds
a Docker image. If the tests pass, it pushes the image and deploys it to a
staging server first. We do a quick smoke test there. Then we deploy the same
image to production. If something goes wrong, we roll back to the previous
image, which takes about two minutes.`)}</details>
<p><strong>4. What do you do when a client uses an English term you don’t know?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`I ask right away, and I make it specific: "Sorry, could you explain what you
mean by 'carry-over'?" Then I repeat it in my own words to confirm. After the
meeting I add the term to our project glossary, so the whole team uses it the
same way. Guessing is risky, because the same word can mean different things
in different companies.`)}</details>
<p><strong>5. How do you keep improving your English?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`I practise fifteen minutes a day. I read one technical article or a public
postmortem in English, I review a flashcard deck of work terms, and twice a
week I record a short talk about my project and check it with a speech
recognition tool. Last month it showed me I said "queue" in a way that sounded
like "QA", so I fixed that. I also write all my commit messages and pull
requests in English.`)}</details>
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-8-5-lab-noi-tieng-anh', '🎤', en ? 'Interview prep 8.5 — English speaking lab' : 'Chuẩn bị phỏng vấn 8.5 — Lab nói tiếng Anh', en ? 'Self-introduction and project story for the interview itself.' : 'Tự giới thiệu và kể dự án cho chính buổi phỏng vấn.')}
${lienKet('/language', '📒', en ? 'CT Language — IT notebook and pronunciation practice' : 'CT Language — Sổ tay CNTT và luyện phát âm', en ? 'Where the deck of Part 2 lives.' : 'Nơi đặt bộ thẻ của Phần 2.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>shadowing · transcript · ${en ? 'spaced repetition' : 'ôn tập ngắt quãng (spaced repetition)'} · SM-2 · flashcard · ${en ? 'homophone' : 'từ đồng âm'} · ${en ? 'linking' : 'nối âm (linking)'} · ${en ? 'exit code' : 'mã thoát (exit code)'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Loop: listen → shadow → record one take → nghe.py → kiem-thuat-ngu.mjs → fix only the ✗ → a person checks stress.' : 'Vòng: nghe → nói đuổi → ghi một lượt → nghe.py → kiem-thuat-ngu.mjs → chỉ sửa chỗ ✗ → người thật nghe trọng âm.'}</li>
<li>${en ? 'Machine demo: 20/20 when read correctly, 17/20 with 11 Vietnamese-style terms — context hid eight of the eleven mistakes.' : 'Làm mẫu bằng máy: đọc đúng 20/20, đọc kiểu Việt 11 thuật ngữ còn 17/20 — ngữ cảnh che mất tám trong mười một lỗi.'}</li>
<li>${en ? 'A ✗ can mean a homophone (CORS = cores), a wrong model (PostgreSQL), a swallowed sound (OAuth) or linking (bean at): each has its own fix.' : 'Dấu ✗ có thể là đồng âm (CORS = cores), mẫu sai (PostgreSQL), âm bị nuốt (OAuth) hay nối âm (bean at): mỗi loại một cách sửa.'}</li>
<li>${en ? 'Keep it with spaced repetition (CT Language notebook or Anki/Quizlet via --csv), and say every card out loud.' : 'Giữ lại bằng ôn tập ngắt quãng (sổ tay CT Language hoặc Anki/Quizlet qua --csv), và nói to mọi thẻ.'}</li>
</ul>
</div>`;

/* ═════════════ 7.5 — Kiểm tra ═════════════ */
const QUIZ7 = [
  Q('tak7-1', 'Where is the stress in "deploy"?|||Trọng âm của "deploy" ở đâu?', [
    'DE-ploy|||DE-ploy',
    'de-PLOY|||de-PLOY',
    'Both syllables equally|||Hai âm tiết bằng nhau',
    'It depends on the accent|||Tuỳ giọng',
  ], 1, '/dɪˈplɔɪ/. Stressed on the first syllable, Whisper heard "The Lawyer". Lesson 7.2.|||/dɪˈplɔɪ/. Nhấn âm đầu thì Whisper nghe thành "The Lawyer". Bài 7.2.'),
  Q('tak7-2', 'Search is slow but still works. Which word fits the status update?|||Chức năng tìm kiếm chậm nhưng vẫn chạy. Từ nào hợp với bản cập nhật trạng thái?', [
    'Search is down.|||Search is down.',
    'Search has an outage.|||Search has an outage.',
    'Search is degraded.|||Search is degraded.',
    'Search is die.|||Search is die.',
  ], 2, 'Degraded = working badly; down/outage = not working. Lesson 7.1.|||Degraded = chạy kém; down/outage = không chạy. Bài 7.1.'),
  Q('tak7-3', 'Which sentence is correct?|||Câu nào đúng?', [
    'I will rollback to 2.2.4.|||I will rollback to 2.2.4.',
    'I will roll back to 2.2.4. The rollback takes 3 minutes.|||I will roll back to 2.2.4. The rollback takes 3 minutes.',
    'The roll back takes 3 minutes.|||The roll back takes 3 minutes.',
    'I will rolled back to 2.2.4.|||I will rolled back to 2.2.4.',
  ], 1, 'Verb = two words, noun = one word (set up/setup, log in/login). Lesson 7.1.|||Động từ = hai chữ, danh từ = một chữ (set up/setup, log in/login). Bài 7.1.'),
  Q('tak7-4', 'Which sentence is correct?|||Câu nào đúng?', [
    'Thanks for your feedbacks and advices.|||Thanks for your feedbacks and advices.',
    'We need more informations about the equipments.|||We need more informations about the equipments.',
    'Thanks for your feedback. Could you share more information about the equipment?|||Thanks for your feedback. Could you share more information about the equipment?',
    'Please send an information.|||Please send an information.',
  ], 2, 'feedback, advice, information, equipment, software, documentation are uncountable. Lesson 7.1.|||feedback, advice, information, equipment, software, documentation không đếm được. Bài 7.1.'),
  Q('tak7-5', 'Your team rolled back production first and reverted the bad commit later. Why in that order?|||Đội bạn roll back production trước rồi mới revert commit lỗi. Vì sao theo thứ tự đó?', [
    'Revert is not allowed on production.|||Không được revert trên production.',
    'Rolling back is the fastest way to stop the damage; the revert is a new commit that still has to be built and deployed.|||Roll back là cách nhanh nhất để chặn thiệt hại; revert là một commit mới vẫn phải build và deploy.',
    'They mean the same thing.|||Hai từ cùng nghĩa.',
    'Revert deletes the history.|||Revert xoá lịch sử.',
  ], 1, 'Mitigate first, fix later — CrowdStrike, GitHub and Cloudflare all did it. Lesson 7.1.|||Giảm thiệt hại trước, sửa sau — CrowdStrike, GitHub, Cloudflare đều làm vậy. Bài 7.1.'),
  Q('tak7-6', 'Said alone and correctly, "cache" was written by Whisper as "CASH". What is the lesson?|||Nói riêng và đúng, "cache" vẫn bị Whisper ghi thành "CASH". Bài học là gì?', [
    'Whisper is broken.|||Whisper bị hỏng.',
    'Say "catch" instead.|||Hãy nói "catch".',
    'Cache and cash are homophones: always say a term inside a phrase ("the browser cache").|||Cache và cash đồng âm: luôn nói thuật ngữ trong một cụm ("the browser cache").',
    'Never use the word cache.|||Đừng bao giờ dùng chữ cache.',
  ], 2, 'Also suite = sweet, queue = Q, CORS = cores. Lessons 7.2, 7.4.|||Còn có suite = sweet, queue = Q, CORS = cores. Bài 7.2, 7.4.'),
  Q('tak7-7', 'Which mispronunciation is the MOST dangerous in a meeting?|||Lỗi phát âm nào NGUY HIỂM NHẤT trong buổi họp?', [
    'One that the listener cannot understand at all.|||Lỗi khiến người nghe không hiểu gì.',
    'One that turns the word into another plausible word, like "queue" heard as "QA".|||Lỗi biến từ thành một từ khác vẫn hợp lý, như "queue" nghe thành "QA".',
    'A slightly wrong vowel in a long sentence.|||Một nguyên âm hơi lệch trong câu dài.',
    'A British accent instead of an American one.|||Giọng Anh thay vì giọng Mỹ.',
  ], 1, 'A plausible wrong meaning is believed, so nobody asks again. Lesson 7.2.|||Nghĩa sai mà hợp lý thì được tin, nên không ai hỏi lại. Bài 7.2.'),
  Q('tak7-8', 'In a call, a senior says "just install cross env". What should you do?|||Trong cuộc gọi, anh senior nói "just install cross env". Bạn nên làm gì?', [
    'Type npm install crossenv right away.|||Gõ ngay npm install crossenv.',
    'Ask them to paste the exact package name in the chat, and check the package page before installing.|||Nhờ dán đúng tên gói vào chat, và xem trang của gói trước khi cài.',
    'Search Google for "cross env" and install the first result.|||Tìm Google "cross env" rồi cài kết quả đầu tiên.',
    'Install both crossenv and cross-env to be safe.|||Cài cả crossenv lẫn cross-env cho chắc.',
  ], 1, 'crossenv (2017) was a typosquatting package that stole environment variables. Lesson 7.2.|||crossenv (2017) là gói typosquatting đánh cắp biến môi trường. Bài 7.2.'),
  Q('tak7-9', 'You need a big favour from the client’s architect, whom you have never met. Which opening fits best?|||Bạn cần nhờ một việc lớn từ kiến trúc sư phía khách, người bạn chưa gặp. Câu mở đầu nào hợp nhất?', [
    'I want you to review our design.|||I want you to review our design.',
    'Review our design please.|||Review our design please.',
    'I was wondering if you could review our design document this week.|||I was wondering if you could review our design document this week.',
    'Can u check design?|||Can u check design?',
  ], 2, 'The higher steps of the politeness ladder are for big requests and people you do not know. Lesson 7.3.|||Bậc cao của thang lịch sự dành cho việc nhờ lớn và người chưa quen. Bài 7.3.'),
  Q('tak7-10', 'kiem-thuat-ngu.mjs shows ✓ for "Kubernetes" even though you said "ku-be-nét". What does the ✓ mean?|||kiem-thuat-ngu.mjs báo ✓ cho "Kubernetes" dù bạn nói "ku-be-nét". Dấu ✓ nghĩa là gì?', [
    'Your pronunciation is correct.|||Bạn phát âm đúng.',
    'The word survived in context; a person still has to check the stress.|||Từ "sống sót" nhờ ngữ cảnh; vẫn cần người thật kiểm trọng âm.',
    'The tool is broken.|||Công cụ bị hỏng.',
    'Whisper does not know Kubernetes.|||Whisper không biết Kubernetes.',
  ], 1, 'In the real test, context repaired 8 of 11 Vietnamese-style terms. Lesson 7.4.|||Trong thử nghiệm thật, ngữ cảnh vá được 8/11 thuật ngữ đọc kiểu Việt. Bài 7.4.'),
];

export default {
  title: 'Chapter 7 — Vocabulary by situation and pronunciation of tech terms|||Chương 7 — Từ vựng theo tình huống và phát âm thuật ngữ',
  description: 'Từ nghề theo năm tình huống (kế hoạch, code, kiểm thử, triển khai, sự cố) đếm trên commit log và changelog thật, các cặp hay lẫn, cụm động từ, danh từ không đếm được, ba postmortem thật; phát âm 36 thuật ngữ với hai thí nghiệm Whisper thật, bốn quy luật, đọc ký hiệu, góc hacker typosquatting; 100 mẫu câu đã qua công cụ kiểm; lab ghi âm + bộ thẻ ôn ngắt quãng.',
  lessons: [
    { title: '7.1 — Vocabulary by situation: planning, coding, testing, deploying, incidents|||7.1 — Từ vựng theo tình huống: lên kế hoạch, viết code, kiểm thử, triển khai, sự cố', slug: 'tak-7-1-tu-vung', type: 'LESSON', isFreePreview: true, description: 'Một tin nhắn sự cố sáu cụm từ gần đúng và bản sửa, công cụ dem-tu.mjs đếm từ nghề trên lịch sử commit thật (actions/cache, oh-my-zsh) và 628 changelog, năm ngăn từ 50 mục có câu mẫu, tám cặp hay lẫn (release/deploy, roll back/revert, hotfix/workaround, outage/degraded/downtime…), cụm động từ và dấu cách đổi từ loại, danh từ không đếm được, ba postmortem thật (CrowdStrike 2024, GitHub 2018, Cloudflare 2019), bài luyện có đáp án.', content: L71(true) + L71(false) },
    { title: '7.2 — Tech terms Vietnamese speakers often mispronounce|||7.2 — Thuật ngữ người Việt hay phát âm sai', slug: 'tak-7-2-phat-am', type: 'LESSON', isFreePreview: true, description: 'Hai thí nghiệm thật (giọng máy đọc đúng và kiểu Việt, Whisper nghe lại): từ đơn lẻ mơ hồ cả khi đúng (cache = CASH), trong câu ngữ cảnh vá 8/11 nhưng queue thành "QA"; bảng 36 thuật ngữ IPA chuẩn cạnh IPA máy; bốn quy luật (trọng âm, âm cuối -ed/-s, bẫy chính tả, chữ cái và ký hiệu); góc hacker typosquatting crossenv 2017; cách học âm bằng Cambridge + YouGlish + shadowing; bài luyện có đáp án.', content: L72(true) + L72(false) },
    { title: '7.3 — 100 sentence patterns for daily work situations|||7.3 — 100 mẫu câu cho tình huống làm việc hằng ngày', slug: 'tak-7-3-mau-cau', type: 'LESSON', isFreePreview: true, description: '100 mẫu câu chia mười nhóm (hỏi, nhờ, báo cáo, báo vấn đề, xin lỗi, phản đối, đồng ý, cảm ơn, họp, bàn giao) có chỗ điền, nghĩa và kênh dùng; cả 100 qua kiem-email.mjs (output thật), bậc thang lịch sự, tám câu dịch từng chữ cần thay, bản một trang để in, hai bài luyện có đáp án.', content: L73(true) + L73(false) },
    { title: '7.4 — Lab: pronunciation check with recordings and a vocabulary set in CT Language|||7.4 — Lab: Kiểm phát âm bằng ghi âm và tạo bộ từ trong CT Language', slug: 'tak-7-4-lab', type: 'LESSON', isFreePreview: true, description: 'Vòng ghi âm 20 câu → nghe.py → kiem-thuat-ngu.mjs (mã nguồn in đủ), làm mẫu bằng giọng máy (20/20 và 17/20), đọc dấu ✗ qua 10 thuật ngữ Spring/Node (CORS = cores, PostgreSQL, OAuth, nối âm), bộ thẻ ôn ngắt quãng trong CT Language hoặc Anki/Quizlet qua --csv, ba bài tập có đáp án, năm câu phỏng vấn tiếng Anh giải thích thuật ngữ.', content: L74(true) + L74(false) },
    {
      title: '7.5 — Chapter 7 quiz|||7.5 — Kiểm tra Chương 7',
      slug: 'tak-7-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: trọng âm, chọn từ theo tình huống, cụm động từ và danh từ, danh từ không đếm được, rollback và revert, từ đồng âm, lỗi phát âm nguy hiểm nhất, typosquatting, bậc lịch sự, dấu ✓ của công cụ nghĩa là gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions built from the words, sounds and patterns of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu dựng từ chính từ vựng, âm và mẫu câu trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ7 },
    },
  ],
};
