/**
 * IELTS Tập 3 — Ngày 10 (band 5.0 → 6.0)
 *   Bài 1 (vocab)    Science, research & space — 44 từ + 12 cụm                [VC21]
 *   Bài 2 (writing)  Discussion essay band 6 — hai thân bài cân đối + ý kiến rõ; ba biến thể đề; cohesion không lặp từ nối [W04 W16]
 *                    — nối Tập 2 Ngày 6 (Discussion trọn bài) và Ngày 17 (từ nối đúng vai)
 *   Bài 3 (speaking) Part 3 “Do you agree that…?” — đồng ý một phần, 4 cách phát triển, viễn cảnh ngược lại [S06]
 *                    — nối Tập 2 Ngày 17 (thang đồng ý) · 🔊 ngữ điệu nhượng bộ
 *   Bài tập Ngày 10  42 câu có đáp án + 1 đoạn viết + 1 lượt nói
 * Mọi bài mẫu, đề, câu ví dụ đều TỰ SOẠN. Mọi id bắt đầu `t3d10-`.
 */
import type { Lesson } from '../data';

export const NGAY_10: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t3d10-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Khoa học, nghiên cứu & vũ trụ (Science, research & space)",
    goal: "Dùng đúng 44 từ và 12 cụm về làm nghiên cứu, khoa học – xã hội và khám phá vũ trụ (conduct research into, test a hypothesis, allocate funding to, space exploration…) trong câu Task 2 và câu trả lời Part 3 — đẩy Lexical Resource lên band 6: đủ từ cho chủ đề, đúng collocation, đúng họ từ.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Chủ đề **Science, research & space** xuất hiện ở cả bốn kỹ năng: bài Reading khoa học (Ngày 7, 9), Listening Part 3–4 (sinh viên bàn đồ án, bài giảng), Task 2 (chi tiền cho vũ trụ? khoa học có nên bị giới hạn?), Part 3 (Do you agree that…?).",
          "Hôm nay: ==16 từ làm nghiên cứu · 12 từ khoa học & xã hội · 16 từ vũ trụ · 12 cụm ăn điểm== = 56 mục. Cả hai bài sau (Viết, Nói) dùng lại đúng bộ từ này.",
          "Band 6 LR = “đủ rộng, dám dùng từ ít gặp dù còn sai”. Cách nhanh nhất: học **động từ đi kèm** (conduct research, test a hypothesis, draw a conclusion) thay vì học danh từ đứng một mình.",
          "Ba lỗi người Việt gần như ai cũng mắc: ~~researches~~ / ~~a research~~ · ~~make an experiment~~ · nhầm **discover** (tìm ra cái có sẵn) với **invent** (tạo ra cái chưa có).",
          "Hôm nay khối luyện phát âm nằm ở bài Nói; ở bài này chỉ có bảng **trọng âm** của các từ dài (hy**PO**thesis, phe**NO**menon, **SA**tellite).",
        ],
      },

      { t: "h", text: "1. Làm nghiên cứu — 16 từ" },
      {
        t: "p",
        text: "Một nghiên cứu khoa học đi theo trình tự: đặt **giả thuyết** → thiết kế **thí nghiệm** → thu **dữ liệu** từ một **mẫu** → phân tích → công bố **kết quả** → người khác **lặp lại** để kiểm chứng. Thuộc trình tự này là bạn hiểu được 80 % bài Reading và Listening Part 4 về khoa học.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Một nghiên cứu khoa học — 6 bước và từ vựng đi kèm",
        steps: [
          { label: "1. Question → **hypothesis**", sub: "form / propose a hypothesis" },
          { label: "2. Design an **experiment**", sub: "choose a **sample**, control the **variables**" },
          { label: "3. Collect **data**", sub: "**observe**, measure, record" },
          { label: "4. Analyse", sub: "look for patterns, **evidence**" },
          { label: "5. Publish the **findings**", sub: "after **peer review**" },
          { label: "6. Others **replicate**", sub: "a **theory** is supported — or rejected" },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "hypothesis", pos: "n", ipa: "/haɪˈpɒθəsɪs/", vi: "giả thuyết", ex: "The experiment was designed to test the hypothesis that sleep improves memory.", exVi: "Thí nghiệm được thiết kế để kiểm tra giả thuyết rằng giấc ngủ cải thiện trí nhớ.", more: "Số nhiều: **hypotheses** /haɪˈpɒθəsiːz/. **test / support / reject a hypothesis**. Tính từ: **hypothetical** (giả định)." },
          { w: "experiment", pos: "n", ipa: "/ɪkˈsperɪmənt/", vi: "thí nghiệm", ex: "Researchers carried out an experiment on 200 volunteers.", exVi: "Các nhà nghiên cứu tiến hành một thí nghiệm trên 200 tình nguyện viên.", more: "**carry out / conduct / do an experiment** — ~~make an experiment~~. Đừng nhầm với **experience** (kinh nghiệm). Tính từ: **experimental**." },
          { w: "conduct", pos: "v", ipa: "/kənˈdʌkt/", vi: "tiến hành (nghiên cứu, khảo sát)", ex: "The university conducted a survey of 5,000 households.", exVi: "Trường đại học tiến hành một khảo sát trên 5.000 hộ gia đình.", more: "**conduct research / a study / a survey / an experiment**. Trang trọng hơn **do / carry out**. Danh từ **conduct** /ˈkɒndʌkt/ = hạnh kiểm, cách cư xử." },
          { w: "observe", pos: "v", ipa: "/əbˈzɜːv/", vi: "quan sát", ex: "Scientists observed the behaviour of the birds for three years.", exVi: "Các nhà khoa học quan sát tập tính của đàn chim suốt ba năm.", more: "Họ từ: **observation** (n) · **observer** (n) · **observatory** (đài thiên văn). **It has been observed that…**" },
          { w: "data", pos: "n", ipa: "/ˈdeɪtə/", vi: "dữ liệu", ex: "The data show a clear link between diet and heart disease.", exVi: "Dữ liệu cho thấy mối liên hệ rõ ràng giữa chế độ ăn và bệnh tim.", more: "**collect / gather / analyse data**. Văn học thuật: data + động từ số nhiều (**the data show**); đời thường: số ít cũng được. ~~datas~~." },
          { w: "sample", pos: "n", ipa: "/ˈsɑːmpl/", vi: "mẫu (nhóm người / vật được chọn để nghiên cứu)", ex: "The study was based on a sample of 1,200 teenagers.", exVi: "Nghiên cứu dựa trên một mẫu gồm 1.200 thiếu niên.", more: "**a large / small / random sample** · **a sample of** + N · **sample size** (cỡ mẫu). **a blood sample** = mẫu máu." },
          { w: "variable", pos: "n", ipa: "/ˈveəriəbl/", vi: "biến số (yếu tố có thể thay đổi)", ex: "Age and income were the two main variables in the study.", exVi: "Tuổi và thu nhập là hai biến số chính trong nghiên cứu.", more: "Động từ **vary** (thay đổi) · tính từ **variable / varied** · danh từ **variation / variety**." },
          { w: "evidence", pos: "n", ipa: "/ˈevɪdəns/", vi: "bằng chứng", ex: "There is growing evidence that air pollution affects brain development.", exVi: "Ngày càng có nhiều bằng chứng rằng ô nhiễm không khí ảnh hưởng tới sự phát triển của não.", more: "Không đếm được: ~~an evidence~~ / ~~evidences~~ → **a piece of evidence**. **evidence of / for** + N · **evidence that** + S + V · **strong / clear / little evidence**." },
          { w: "findings", pos: "n (số nhiều)", ipa: "/ˈfaɪndɪŋz/", vi: "kết quả nghiên cứu (điều tìm ra)", ex: "The findings were published in a medical journal.", exVi: "Kết quả nghiên cứu được công bố trên một tạp chí y khoa.", more: "**publish / present the findings** · **The findings suggest / indicate that…** — câu mở rất hay cho Part 3." },
          { w: "theory", pos: "n", ipa: "/ˈθɪəri/", vi: "lý thuyết, học thuyết", ex: "The theory of evolution is supported by a huge amount of evidence.", exVi: "Thuyết tiến hoá được hỗ trợ bởi một lượng bằng chứng khổng lồ.", more: "**in theory** (về lý thuyết) ↔ **in practice** (trên thực tế). Tính từ: **theoretical**." },
          { w: "phenomenon", pos: "n", ipa: "/fəˈnɒmɪnən/", vi: "hiện tượng", ex: "Light pollution is a relatively recent phenomenon.", exVi: "Ô nhiễm ánh sáng là một hiện tượng tương đối mới.", more: "Số nhiều: **phenomena** /fəˈnɒmɪnə/ — ~~phenomenons~~, ~~a phenomena~~. **a natural / social / global phenomenon**." },
          { w: "breakthrough", pos: "n", ipa: "/ˈbreɪkθruː/", vi: "bước đột phá", ex: "The vaccine was a major breakthrough in the fight against the disease.", exVi: "Vắc-xin là một bước đột phá lớn trong cuộc chiến chống căn bệnh.", more: "**make / achieve a breakthrough** · **a major / scientific / medical breakthrough** · **a breakthrough in** + lĩnh vực." },
          { w: "peer review", pos: "n", ipa: "/ˌpɪə rɪˈvjuː/", vi: "bình duyệt (chuyên gia cùng ngành thẩm định trước khi công bố)", ex: "All articles in the journal go through peer review.", exVi: "Mọi bài báo trong tạp chí đều qua bình duyệt.", more: "Tính từ: **peer-reviewed journal** (tạp chí có bình duyệt). peer = người ngang hàng." },
          { w: "replicate", pos: "v", ipa: "/ˈreplɪkeɪt/", vi: "lặp lại (thí nghiệm) để kiểm chứng", ex: "Other laboratories were unable to replicate the results.", exVi: "Các phòng thí nghiệm khác không lặp lại được kết quả.", more: "Danh từ: **replication**. Đồng nghĩa dễ hơn: **repeat the experiment / reproduce the results**." },
          { w: "funding", pos: "n", ipa: "/ˈfʌndɪŋ/", vi: "kinh phí, nguồn tài trợ", ex: "Many research projects depend on government funding.", exVi: "Nhiều dự án nghiên cứu phụ thuộc vào kinh phí nhà nước.", more: "Không đếm được. **funding for** + N · **receive / cut / increase funding** · động từ **fund** (tài trợ) · **publicly funded**." },
          { w: "laboratory", pos: "n", ipa: "/ləˈbɒrətri/", vi: "phòng thí nghiệm", ex: "The samples were sent to a laboratory for analysis.", exVi: "Các mẫu được gửi tới phòng thí nghiệm để phân tích.", more: "Viết tắt: **lab**. Anh-Anh nhấn âm 2 (la**BO**ratory), Anh-Mỹ nhấn âm 1 /ˈlæbrətɔːri/. **laboratory tests / conditions**." },
        ],
      },
      {
        t: "note",
        title: "Người Việt hay sai với nhóm từ nghiên cứu",
        items: [
          "**research** không đếm được: ~~a research~~, ~~many researches~~ → **research / a piece of research / a study / many studies**. Động từ đi kèm: **do / conduct / carry out research** — ~~make research~~.",
          "**research into / on** + chủ đề: research **into** the causes of cancer. ~~research about~~ nghe thiếu tự nhiên trong bài viết.",
          "**experiment** (thí nghiệm) ≠ **experience** (kinh nghiệm, trải nghiệm). ~~Scientists did many experiences~~ → experiments.",
          "**evidence**, **information**, **knowledge**, **progress**, **equipment**, **research**, **funding**: bảy danh từ khoa học **không đếm được** — không thêm -s, không dùng a / an.",
          "**prove** (chứng minh — rất mạnh) ≠ **suggest / indicate / show** (cho thấy). Văn học thuật hiếm khi nói “prove”; viết **The findings suggest that…** an toàn và đúng giọng hơn.",
        ],
      },

      { t: "h", text: "2. Khoa học & xã hội — 12 từ" },
      {
        t: "p",
        text: "Đề Task 2 và câu hỏi Part 3 không hỏi bạn cách làm thí nghiệm. Chúng hỏi **khoa học tác động gì tới xã hội**: lợi ích, rủi ro, đạo đức, ai trả tiền. Nhóm từ dưới đây dùng cho các câu hỏi đó.",
      },
      {
        t: "vocab",
        items: [
          { w: "scientific", pos: "adj", ipa: "/ˌsaɪənˈtɪfɪk/", vi: "(thuộc) khoa học", ex: "There is no scientific evidence that the product works.", exVi: "Không có bằng chứng khoa học nào cho thấy sản phẩm có tác dụng.", more: "~~science evidence~~ → **scientific evidence / research / progress / knowledge**. Họ từ: **science** (n) · **scientist** (n) · **scientifically** (adv)." },
          { w: "advance", pos: "n", ipa: "/ədˈvɑːns/", vi: "bước tiến, tiến bộ", ex: "Recent advances in medicine have increased life expectancy.", exVi: "Những tiến bộ gần đây trong y học đã làm tăng tuổi thọ.", more: "**advances in** + lĩnh vực · **scientific / technological / medical advances**. Tính từ: **advanced**. Đồng nghĩa: **progress** (không đếm được), **development**." },
          { w: "application", pos: "n", ipa: "/ˌæplɪˈkeɪʃn/", vi: "ứng dụng (thực tế)", ex: "The research has practical applications in agriculture.", exVi: "Nghiên cứu này có ứng dụng thực tiễn trong nông nghiệp.", more: "**practical / commercial / everyday applications** · động từ **apply sth to** · **applied research** (nghiên cứu ứng dụng) ↔ **basic / pure research** (nghiên cứu cơ bản)." },
          { w: "cutting-edge", pos: "adj", ipa: "/ˌkʌtɪŋ ˈedʒ/", vi: "tiên tiến nhất, mũi nhọn", ex: "The hospital uses cutting-edge technology to treat cancer.", exVi: "Bệnh viện dùng công nghệ tiên tiến nhất để chữa ung thư.", more: "**cutting-edge technology / research**. Cụm danh từ: **at the cutting edge of** + lĩnh vực. Đồng nghĩa: **state-of-the-art**." },
          { w: "pioneering", pos: "adj", ipa: "/ˌpaɪəˈnɪərɪŋ/", vi: "tiên phong, mở đường", ex: "Her pioneering work on radioactivity won two Nobel Prizes.", exVi: "Công trình tiên phong của bà về phóng xạ giành hai giải Nobel.", more: "**pioneering work / research / surgery**. Danh từ / động từ: **pioneer** (người tiên phong; mở đường)." },
          { w: "ethical", pos: "adj", ipa: "/ˈeθɪkl/", vi: "(thuộc) đạo đức; hợp đạo đức", ex: "Genetic testing raises serious ethical questions.", exVi: "Xét nghiệm gen đặt ra những câu hỏi đạo đức nghiêm trọng.", more: "**ethical issues / concerns / questions** · trái nghĩa **unethical** · danh từ **ethics** (đạo đức học). **raise ethical concerns** = làm dấy lên lo ngại về đạo đức." },
          { w: "genetic engineering", pos: "n", ipa: "/dʒəˌnetɪk ˌendʒɪˈnɪərɪŋ/", vi: "kỹ thuật di truyền, công nghệ gen", ex: "Genetic engineering could help crops survive long periods without rain.", exVi: "Kỹ thuật di truyền có thể giúp cây trồng sống sót qua thời kỳ dài không mưa.", more: "Liên quan: **gene** (gen) · **genetically modified (GM) food** (thực phẩm biến đổi gen) · **DNA**." },
          { w: "vaccine", pos: "n", ipa: "/ˈvæksiːn/", vi: "vắc-xin", ex: "It usually takes years to develop a safe vaccine.", exVi: "Thường mất nhiều năm để phát triển một loại vắc-xin an toàn.", more: "**develop / test a vaccine** · **a vaccine against** + bệnh · động từ **vaccinate** · danh từ **vaccination**." },
          { w: "clinical trial", pos: "n", ipa: "/ˌklɪnɪkl ˈtraɪəl/", vi: "thử nghiệm lâm sàng (thử thuốc trên người)", ex: "The drug is still in clinical trials and is not yet available.", exVi: "Thuốc vẫn đang thử nghiệm lâm sàng và chưa có trên thị trường.", more: "**run / take part in a clinical trial**. trial = cuộc thử nghiệm; **trial and error** = thử và sai." },
          { w: "side effect", pos: "n", ipa: "/ˈsaɪd ɪfekt/", vi: "tác dụng phụ", ex: "The treatment is effective, but it has unpleasant side effects.", exVi: "Cách điều trị có hiệu quả nhưng có tác dụng phụ khó chịu.", more: "**have / cause side effects** · **harmful / long-term side effects**. Nghĩa rộng: hệ quả không mong muốn của một chính sách." },
          { w: "sceptical", pos: "adj", ipa: "/ˈskeptɪkl/", vi: "hoài nghi", ex: "Many people remain sceptical about the benefits of space travel.", exVi: "Nhiều người vẫn hoài nghi về lợi ích của du hành vũ trụ.", more: "**sceptical about / of** + N. Anh-Mỹ viết **skeptical**. Danh từ: **scepticism** · người: **a sceptic**." },
          { w: "expertise", pos: "n", ipa: "/ˌekspɜːˈtiːz/", vi: "chuyên môn, kiến thức chuyên sâu", ex: "Developing countries often lack the technical expertise to build satellites.", exVi: "Các nước đang phát triển thường thiếu chuyên môn kỹ thuật để chế tạo vệ tinh.", more: "Không đếm được. **expertise in** + lĩnh vực · **technical / scientific expertise**. Người: **an expert in / on**. Trọng âm ở âm cuối: exper**TISE**." },
        ],
      },

      { t: "h", text: "3. Vũ trụ — 16 từ" },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Từ vựng vũ trụ — chia 4 nhóm cho dễ nhớ",
        center: "Space",
        branches: [
          { label: "Ngoài kia có gì", items: ["the universe", "galaxy", "solar system", "atmosphere", "gravity"] },
          { label: "Phương tiện", items: ["spacecraft", "satellite", "telescope", "space debris"] },
          { label: "Hoạt động", items: ["launch", "orbit", "space exploration", "mission", "colonise"] },
          { label: "Con người", items: ["astronaut", "extraterrestrial life"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "space exploration", pos: "n", ipa: "/ˌspeɪs ˌekspləˈreɪʃn/", vi: "(công cuộc) khám phá vũ trụ", ex: "Some people believe that space exploration is a waste of public money.", exVi: "Một số người tin rằng khám phá vũ trụ là lãng phí tiền công.", more: "Không có the khi nói chung. Họ từ: **explore** (v) · **explorer** (n). Gần nghĩa: **space travel · space research · space programmes**." },
          { w: "universe", pos: "n", ipa: "/ˈjuːnɪvɜːs/", vi: "vũ trụ (toàn bộ)", ex: "Telescopes help scientists understand how the universe began.", exVi: "Kính viễn vọng giúp các nhà khoa học hiểu vũ trụ đã bắt đầu thế nào.", more: "Luôn có **the**: the universe. Tính từ **universal** = phổ quát, chung cho mọi người (universal education)." },
          { w: "galaxy", pos: "n", ipa: "/ˈɡæləksi/", vi: "thiên hà", ex: "Our galaxy contains more than a hundred billion stars.", exVi: "Thiên hà của chúng ta chứa hơn một trăm tỉ ngôi sao.", more: "Số nhiều: **galaxies**. Thiên hà của ta: **the Milky Way** (dải Ngân Hà)." },
          { w: "solar system", pos: "n", ipa: "/ˈsəʊlə sɪstəm/", vi: "hệ Mặt Trời", ex: "Jupiter is the largest planet in the solar system.", exVi: "Sao Mộc là hành tinh lớn nhất trong hệ Mặt Trời.", more: "**solar** = thuộc Mặt Trời: **solar energy / panels**. **planet** = hành tinh." },
          { w: "gravity", pos: "n", ipa: "/ˈɡrævəti/", vi: "trọng lực, lực hấp dẫn", ex: "Gravity keeps the Moon in orbit around the Earth.", exVi: "Lực hấp dẫn giữ Mặt Trăng trên quỹ đạo quanh Trái Đất.", more: "**the force of gravity** · **zero gravity / microgravity** = trạng thái gần như không trọng lượng của phi hành gia trên quỹ đạo (thật ra lực hấp dẫn ở đó vẫn còn khoảng 90 %, họ “lơ lửng” vì đang rơi tự do quanh Trái Đất). Tính từ: **gravitational**." },
          { w: "atmosphere", pos: "n", ipa: "/ˈætməsfɪə/", vi: "khí quyển; bầu không khí", ex: "The spacecraft burned up as it entered the Earth's atmosphere.", exVi: "Tàu vũ trụ bốc cháy khi đi vào khí quyển Trái Đất.", more: "**the Earth's atmosphere** · **release gases into the atmosphere**. Nghĩa bóng: **a friendly atmosphere**." },
          { w: "spacecraft", pos: "n", ipa: "/ˈspeɪskrɑːft/", vi: "tàu vũ trụ", ex: "The spacecraft took seven months to reach Mars.", exVi: "Tàu vũ trụ mất bảy tháng để tới sao Hoả.", more: "Số nhiều không đổi: **two spacecraft** — ~~spacecrafts~~. Gần nghĩa: **spaceship** (đời thường), **rocket** (tên lửa đẩy), **probe** (tàu thăm dò không người)." },
          { w: "satellite", pos: "n", ipa: "/ˈsætəlaɪt/", vi: "vệ tinh", ex: "Weather satellites allow us to predict storms several days in advance.", exVi: "Vệ tinh thời tiết cho phép ta dự báo bão trước vài ngày.", more: "**launch a satellite** · **satellite images / navigation / television**. Ví dụ ăn điểm nhất khi bảo vệ ngân sách vũ trụ." },
          { w: "telescope", pos: "n", ipa: "/ˈtelɪskəʊp/", vi: "kính viễn vọng", ex: "The space telescope has sent back images of distant galaxies.", exVi: "Kính viễn vọng không gian đã gửi về hình ảnh các thiên hà xa xôi.", more: "**look through a telescope** · **a space telescope**. So sánh: **microscope** (kính hiển vi)." },
          { w: "space debris", pos: "n", ipa: "/ˈspeɪs ˌdebriː/", vi: "rác vũ trụ", ex: "Tens of thousands of pieces of space debris are now circling the Earth.", exVi: "Hàng chục nghìn mảnh rác vũ trụ hiện đang bay quanh Trái Đất.", more: "**debris** không đếm được, chữ **s** cuối câm: /ˈdebriː/. Đời thường: **space junk**." },
          { w: "launch", pos: "v / n", ipa: "/lɔːntʃ/", vi: "phóng (tên lửa, vệ tinh); ra mắt", ex: "India launched its first Mars mission in 2013.", exVi: "Ấn Độ phóng sứ mệnh sao Hoả đầu tiên vào năm 2013.", more: "**launch a rocket / satellite / mission** · nghĩa rộng **launch a product / campaign**. Danh từ: **the launch of** + N." },
          { w: "orbit", pos: "n / v", ipa: "/ˈɔːbɪt/", vi: "quỹ đạo; bay quanh", ex: "The space station orbits the Earth roughly every ninety minutes.", exVi: "Trạm vũ trụ bay quanh Trái Đất khoảng chín mươi phút một vòng.", more: "**in orbit** (trên quỹ đạo) · **put a satellite into orbit**. Động từ đi thẳng với tân ngữ: orbit **the** Earth (orbit around the Earth cũng gặp nhưng thừa around — bài viết nên bỏ)." },
          { w: "mission", pos: "n", ipa: "/ˈmɪʃn/", vi: "sứ mệnh, chuyến bay (vũ trụ)", ex: "A crewed mission to Mars could cost hundreds of billions of dollars.", exVi: "Một sứ mệnh có người lái tới sao Hoả có thể tốn hàng trăm tỉ đô-la.", more: "**a crewed / manned mission** (có người) ↔ **an uncrewed / unmanned mission** (không người) · **a mission to** + nơi đến." },
          { w: "colonise", pos: "v", ipa: "/ˈkɒlənaɪz/", vi: "lập khu định cư, chiếm làm thuộc địa", ex: "Some scientists argue that humans should colonise other planets.", exVi: "Một số nhà khoa học cho rằng loài người nên lập khu định cư trên hành tinh khác.", more: "Anh-Mỹ: **colonize**. Danh từ: **colony** (thuộc địa, khu định cư) · **colonisation**." },
          { w: "astronaut", pos: "n", ipa: "/ˈæstrənɔːt/", vi: "phi hành gia", ex: "Astronauts train for years before their first flight.", exVi: "Phi hành gia luyện tập nhiều năm trước chuyến bay đầu tiên.", more: "astro- = sao: **astronomy** (thiên văn học) · **astronomer** (nhà thiên văn) — đừng nhầm **astrology** (chiêm tinh)." },
          { w: "extraterrestrial", pos: "adj", ipa: "/ˌekstrətəˈrestriəl/", vi: "ngoài Trái Đất", ex: "So far, no evidence of extraterrestrial life has been found.", exVi: "Đến nay chưa tìm thấy bằng chứng nào về sự sống ngoài Trái Đất.", more: "extra- (ngoài) + terrestrial (thuộc Trái Đất). **extraterrestrial life** = sự sống ngoài hành tinh; đời thường: **aliens**." },
        ],
      },

      { t: "h", text: "4. Mười hai cụm ăn điểm (collocation) cho Task 2 và Part 3" },
      {
        t: "p",
        text: "**Collocation** = các từ “hay đi với nhau” theo thói quen của người bản ngữ (đã mở đầu ở Tập 2 Ngày 16). Giám khảo chấm LR nhìn chính chỗ này: dùng đúng danh từ nhưng sai động từ đi kèm (~~make research~~, ~~do a breakthrough~~) là dấu hiệu band 5.",
      },
      {
        t: "vocab",
        items: [
          { w: "conduct research into", pos: "cụm", ipa: "/kənˌdʌkt rɪˈsɜːtʃ ɪntə/", vi: "tiến hành nghiên cứu về", ex: "Universities should conduct more research into renewable energy.", exVi: "Các trường đại học nên tiến hành thêm nghiên cứu về năng lượng tái tạo.", more: "Cũng được: **carry out / do research into / on**. Danh từ research nhấn âm 2 (re**SEARCH**) trong Anh-Anh." },
          { w: "carry out an experiment", pos: "cụm", ipa: "/ˌkæri aʊt ən ɪkˈsperɪmənt/", vi: "tiến hành một thí nghiệm", ex: "Students learn more when they carry out experiments themselves.", exVi: "Học sinh học được nhiều hơn khi tự làm thí nghiệm.", more: "**carry out** + a study / a survey / tests / research. Bị động: **The experiment was carried out in 2019.**" },
          { w: "test a hypothesis", pos: "cụm", ipa: "/ˌtest ə haɪˈpɒθəsɪs/", vi: "kiểm tra một giả thuyết", ex: "A large sample is needed to test the hypothesis properly.", exVi: "Cần một mẫu lớn để kiểm tra giả thuyết cho đúng.", more: "Chuỗi: **form → test → support / reject** a hypothesis." },
          { w: "analyse data", pos: "cụm", ipa: "/ˌænəlaɪz ˈdeɪtə/", vi: "phân tích dữ liệu", ex: "Computers can analyse huge amounts of data in seconds.", exVi: "Máy tính có thể phân tích lượng dữ liệu khổng lồ trong vài giây.", more: "Họ từ: **analysis** (n, số nhiều **analyses**) · **analyst** (người) · **analytical** (adj). Anh-Mỹ: **analyze**." },
          { w: "draw a conclusion", pos: "cụm", ipa: "/ˌdrɔː ə kənˈkluːʒn/", vi: "rút ra kết luận", ex: "It is too early to draw any firm conclusions from the study.", exVi: "Còn quá sớm để rút ra kết luận chắc chắn nào từ nghiên cứu.", more: "**draw / reach / come to a conclusion** — ~~make a conclusion~~ / ~~take a conclusion~~." },
          { w: "make a breakthrough", pos: "cụm", ipa: "/ˌmeɪk ə ˈbreɪkθruː/", vi: "tạo ra bước đột phá", ex: "Scientists have made a breakthrough in the treatment of diabetes.", exVi: "Các nhà khoa học đã tạo bước đột phá trong điều trị tiểu đường.", more: "**make a discovery** (có khám phá) · **make progress** (tiến bộ) — nhóm đi với **make**." },
          { w: "allocate funding to", pos: "cụm", ipa: "/ˌæləkeɪt ˈfʌndɪŋ tə/", vi: "phân bổ kinh phí cho", ex: "Governments should allocate more funding to medical research.", exVi: "Chính phủ nên phân bổ thêm kinh phí cho nghiên cứu y khoa.", more: "**allocate money / resources / a budget to** + N. Danh từ: **allocation**. Dễ hơn: **spend more on · invest more in**." },
          { w: "push the boundaries of", pos: "cụm", ipa: "/ˌpʊʃ ðə ˈbaʊndriz əv/", vi: "mở rộng giới hạn của", ex: "Space missions push the boundaries of human knowledge.", exVi: "Các sứ mệnh vũ trụ mở rộng giới hạn hiểu biết của loài người.", more: "**push the boundaries of science / knowledge / technology**. boundary = ranh giới." },
          { w: "benefit humanity", pos: "cụm", ipa: "/ˌbenɪfɪt hjuːˈmænəti/", vi: "mang lại lợi ích cho nhân loại", ex: "Research should be judged by how much it benefits humanity.", exVi: "Nghiên cứu nên được đánh giá theo mức độ nó mang lại lợi ích cho nhân loại.", more: "Động từ benefit đi thẳng với tân ngữ: benefit **society** — ~~benefit for society~~. Danh từ: **be of benefit to** · **for the benefit of humanity / mankind**." },
          { w: "a waste of public money", pos: "cụm", ipa: "/ə ˌweɪst əv ˌpʌblɪk ˈmʌni/", vi: "sự lãng phí tiền công (tiền thuế)", ex: "Critics describe the Mars project as a waste of public money.", exVi: "Những người chỉ trích gọi dự án sao Hoả là sự lãng phí tiền công.", more: "**a waste of time / money / resources**. **taxpayers' money** = tiền của người đóng thuế. **public spending** = chi tiêu công." },
          { w: "pave the way for", pos: "cụm", ipa: "/ˌpeɪv ðə ˈweɪ fə/", vi: "mở đường cho", ex: "Early space research paved the way for modern satellite navigation.", exVi: "Nghiên cứu vũ trụ thời đầu đã mở đường cho định vị vệ tinh hiện đại.", more: "pave the way **for** + N / V-ing. Rất hợp để nói lợi ích dài hạn." },
          { w: "in the long run", pos: "cụm", ipa: "/ɪn ðə ˌlɒŋ ˈrʌn/", vi: "về lâu dài", ex: "Investment in science pays off in the long run.", exVi: "Đầu tư vào khoa học sẽ sinh lời về lâu dài.", more: "↔ **in the short term** (trước mắt). **pay off** = đem lại kết quả xứng đáng. Trang trọng hơn: **in the long term**." },
        ],
      },

      { t: "h", text: "5. Họ từ, từ dễ nhầm và trọng âm" },
      {
        t: "table",
        caption: "Tám họ từ khoa học — Reading hay đổi loại từ giữa câu hỏi và bài (Ngày 9), Writing cần đúng dạng.",
        head: ["Động từ", "Danh từ (việc)", "Danh từ (người)", "Tính từ"],
        rows: [
          ["—", "science", "scientist", "scientific"],
          ["research", "research (không đếm được)", "researcher", "—"],
          ["explore", "exploration", "explorer", "exploratory"],
          ["discover", "discovery", "discoverer", "—"],
          ["invent", "invention", "inventor", "inventive"],
          ["analyse", "analysis", "analyst", "analytical"],
          ["theorise", "theory", "theorist", "theoretical"],
          ["experiment", "experiment · experimentation", "experimenter", "experimental"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba cặp từ người Việt hay dùng lẫn",
        cols: [
          { title: "**discover** vs **invent**", items: ["**discover** = tìm ra cái ĐÃ CÓ sẵn: discover a planet, penicillin, gravity", "**invent** = tạo ra cái CHƯA TỪNG có: invent the telephone, the telescope", "~~Edison discovered the light bulb~~ ✘"] },
          { title: "**research** vs **study** vs **survey**", items: ["**research** (không đếm được) = việc nghiên cứu nói chung", "**a study** (đếm được) = MỘT công trình cụ thể: a recent study found…", "**a survey** = cuộc khảo sát bằng bảng hỏi"] },
          { title: "**science** vs **technology**", items: ["**science** = hiểu thế giới (kiến thức)", "**technology** = dùng kiến thức để làm ra công cụ", "Hai từ đều không đếm được khi nói chung: ~~technologies are developing~~ → technology is developing"] },
        ],
      },
      {
        t: "table",
        caption: "Trọng âm của từ dài — in hoa là âm nhấn. Sai trọng âm là giám khảo khó nhận ra từ.",
        head: ["Từ", "Trọng âm", "Hay đọc sai thành"],
        rows: [
          ["hypothesis", "hy-**PO**-the-sis", "**HY**-po-the-sis"],
          ["phenomenon", "phe-**NO**-me-non", "phe-no-**ME**-non"],
          ["scientific", "sci-en-**TI**-fic (hậu tố -ic: nhấn âm ngay trước)", "**SCI**-en-ti-fic"],
          ["satellite", "**SA**-tel-lite", "sa-**TEL**-lite"],
          ["astronaut", "**AS**-tro-naut", "as-**TRO**-naut"],
          ["exploration", "ex-plo-**RA**-tion (hậu tố -tion: nhấn âm ngay trước)", "ex-**PLO**-ra-tion"],
          ["analysis ↔ analyse", "a-**NA**-ly-sis ↔ **A**-na-lyse", "đọc cùng một chỗ nhấn"],
          ["laboratory", "la-**BO**-ra-try (Anh-Anh, 4 âm tiết)", "la-bo-ra-**TO**-ry"],
        ],
      },
      {
        t: "quiz",
        id: "t3d10-tv-ho-tu",
        kind: "fill",
        title: "Điền đúng dạng của từ trong ngoặc (10 câu)",
        items: [
          { q: "1. There is strong ___ evidence that smoking causes cancer. (SCIENCE)", answers: ["scientific"] },
          { q: "2. A team of ___ at the university has developed a new vaccine. (RESEARCH)", answers: ["researchers"] },
          { q: "3. Space ___ has given us satellite navigation. (EXPLORE)", answers: ["exploration"] },
          { q: "4. The ___ of penicillin saved millions of lives. (DISCOVER)", answers: ["discovery"] },
          { q: "5. A careful ___ of the data showed no link between the two. (ANALYSE)", answers: ["analysis"] },
          { q: "6. The telephone was one of the most important ___ of the nineteenth century. (INVENT)", answers: ["inventions"] },
          { q: "7. In theory the plan is simple, but there are many ___ problems. (PRACTICE)", answers: ["practical"] },
          { q: "8. Testing drugs on animals raises difficult ___ questions. (ETHICS)", answers: ["ethical"] },
          { q: "9. The drug is still at the ___ stage and cannot be sold. (EXPERIMENT)", answers: ["experimental"] },
          { q: "10. Many people are ___ about the benefits of sending humans to Mars. (SCEPTIC)", answers: ["sceptical", "skeptical"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án — điền dạng từ",
        items: [
          "**1 scientific** — trước danh từ evidence cần tính từ; ~~science evidence~~ là lỗi rất phổ biến. **2 researchers** — a team of + danh từ chỉ người, số nhiều.",
          "**3 exploration** — Space ___ làm chủ ngữ ⇒ danh từ; cụm cố định space exploration. **4 discovery** — The ___ of ⇒ danh từ; penicillin có sẵn trong tự nhiên nên là discovery, không phải invention.",
          "**5 analysis** — A careful ___ of ⇒ danh từ số ít. **6 inventions** — one of the most important + danh từ **số nhiều**.",
          "**7 practical** — cặp in theory ↔ practical problems (danh từ practice → tính từ practical). **8 ethical** — tính từ trước questions.",
          "**9 experimental** — the ___ stage ⇒ tính từ. **10 sceptical** — be sceptical about.",
        ],
      },

      { t: "h", text: "6. Dùng trong Task 2 và Part 3 — kho ý tưởng hai phía" },
      {
        t: "p",
        text: "Đề khoa học – vũ trụ gần như luôn xoay quanh **một câu hỏi về tiền**: chi cho nghiên cứu xa vời hay cho nhu cầu trước mắt? Bảng dưới là kho ý cho cả hai phía — bài Viết hôm nay dùng đúng đề này.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Should governments spend money on space exploration?",
        caption: "Mỗi ý đã gắn sẵn từ vựng hôm nay. Chọn 2 ý mỗi bên là đủ cho một bài 250 từ.",
        cols: [
          { title: "Ủng hộ (For)", items: ["**Practical applications**: satellites → weather forecasting, navigation, communication", "**Pave the way for** new technology and medical advances", "Inspire young people to study science and engineering", "**In the long run**: new resources, protection from asteroids", "**Push the boundaries of** human knowledge"] },
          { title: "Phản đối (Against)", items: ["**A waste of public money** while people lack clean water, healthcare, education", "Results are uncertain and take decades", "Funding should be **allocated to** medical research or climate change", "**Space debris** and pollution from launches", "Private companies, not taxpayers, should pay"] },
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Governments should **allocate** more **funding to** medical research rather than to crewed missions to Mars.", vi: "Chính phủ nên phân bổ thêm kinh phí cho nghiên cứu y khoa thay vì cho các sứ mệnh có người lái tới sao Hoả." },
          { en: "Although space programmes are expensive, they have **paved the way for** technologies that **benefit humanity** every day.", vi: "Dù các chương trình vũ trụ tốn kém, chúng đã mở đường cho những công nghệ mang lại lợi ích cho nhân loại mỗi ngày." },
          { en: "**Recent studies suggest that** children who **carry out experiments** at school are more likely to choose a scientific career.", vi: "Các nghiên cứu gần đây cho thấy trẻ được làm thí nghiệm ở trường có nhiều khả năng chọn nghề khoa học hơn." },
          { en: "Critics regard **space exploration** as **a waste of public money**, but **in the long run** it may prove essential.", vi: "Người chỉ trích coi khám phá vũ trụ là lãng phí tiền công, nhưng về lâu dài nó có thể hoá ra thiết yếu." },
        ],
      },
      { t: "rule", formula: "conduct research into + N · carry out an experiment · test a hypothesis · draw a conclusion · make a breakthrough · allocate funding to + N", vi: "Học danh từ khoa học kèm ĐỘNG TỪ của nó: research đi với conduct / do, không đi với make." },
      {
        t: "mcq",
        id: "t3d10-tv-colloc",
        title: "Chọn từ đi kèm đúng (collocation) — 8 câu",
        items: [
          { q: "1. The team ___ an experiment to measure the effect of noise on sleep.", options: ["made", "carried out", "took", "gave"], correct: 1, why: "**carry out / conduct / do an experiment**. ~~make an experiment~~ là lỗi dịch từ “làm thí nghiệm”." },
          { q: "2. More ___ is needed before the drug can be approved.", options: ["researches", "a research", "research", "researchs"], correct: 2, why: "research không đếm được: không -s, không a." },
          { q: "3. It is difficult to ___ a firm conclusion from such a small sample.", options: ["draw", "make", "take", "do"], correct: 0, why: "**draw / reach a conclusion**." },
          { q: "4. Alexander Fleming ___ penicillin in 1928.", options: ["invented", "created", "produced", "discovered"], correct: 3, why: "Penicillin có sẵn trong tự nhiên ⇒ **discover**. invent dùng cho thứ con người tạo ra lần đầu." },
          { q: "5. Scientists have ___ a major breakthrough in battery technology.", options: ["done", "made", "taken", "had"], correct: 1, why: "**make a breakthrough / a discovery / progress**." },
          { q: "6. The government plans to ___ more funding to cancer research.", options: ["allocate", "locate", "spend", "pay"], correct: 0, why: "**allocate funding to**. spend đi với **on**; locate = xác định vị trí." },
          { q: "7. The satellite was put ___ orbit last month.", options: ["on", "at", "to", "into"], correct: 3, why: "**put sth into orbit** · khi đã ở trên đó: **in orbit**." },
          { q: "8. The findings ___ that screen time affects children's sleep.", options: ["prove completely", "are suggest", "suggest", "suggests"], correct: 2, why: "findings số nhiều + **suggest** (không -s). Văn học thuật dùng suggest / indicate, hiếm khi “prove”." },
        ],
      },
      {
        t: "mcq",
        id: "t3d10-tv-nghia",
        title: "Chọn từ đúng nghĩa — 6 câu",
        items: [
          { q: "1. An idea that explains something but has not yet been tested is a", options: ["hypothesis.", "finding.", "sample.", "variable."], correct: 0, why: "hypothesis = giả thuyết, chưa được kiểm chứng. finding = kết quả đã tìm ra." },
          { q: "2. Old rockets and broken satellites that circle the Earth are called", options: ["gravity.", "galaxies.", "space debris.", "missions."], correct: 2, why: "space debris = rác vũ trụ." },
          { q: "3. Before a new medicine is sold, it must be tested on people in a", options: ["peer review.", "clinical trial.", "laboratory sample.", "side effect."], correct: 1, why: "clinical trial = thử nghiệm lâm sàng trên người." },
          { q: "4. When other scientists repeat an experiment to check the results, they ___ it.", options: ["observe", "launch", "colonise", "replicate"], correct: 3, why: "replicate = lặp lại để kiểm chứng." },
          { q: "5. Research that aims to solve a practical problem is called ___ research.", options: ["pure", "applied", "sceptical", "pioneering"], correct: 1, why: "applied research = nghiên cứu ứng dụng ↔ pure / basic research = nghiên cứu cơ bản." },
          { q: "6. A person who doubts that something is true is", options: ["ethical.", "cutting-edge.", "sceptical.", "extraterrestrial."], correct: 2, why: "sceptical = hoài nghi." },
        ],
      },
      {
        t: "quiz",
        id: "t3d10-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
        grammar: "conduct research into · allocate funding to · pave the way for · a waste of public money · in the long run",
        items: [
          { q: "Các nhà khoa học đang tiến hành nghiên cứu về nguyên nhân của căn bệnh.", answers: ["Scientists are conducting research into the causes of the disease.", "Scientists are carrying out research into the causes of the disease.", "Scientists are doing research into the causes of the disease.", "Scientists are conducting research on the causes of the disease."], hint: "conduct research into · the causes of" },
          { q: "Nhiều người cho rằng khám phá vũ trụ là lãng phí tiền công.", answers: ["Many people think that space exploration is a waste of public money.", "Many people think space exploration is a waste of public money.", "Many people believe that space exploration is a waste of public money.", "Many people believe space exploration is a waste of public money.", "Many people argue that space exploration is a waste of public money."], hint: "space exploration · a waste of public money" },
          { q: "Chính phủ nên phân bổ thêm kinh phí cho nghiên cứu y khoa.", answers: ["The government should allocate more funding to medical research.", "Governments should allocate more funding to medical research."], hint: "allocate funding to · medical research" },
          { q: "Vệ tinh cho phép chúng ta dự báo bão trước vài ngày.", answers: ["Satellites allow us to predict storms several days in advance.", "Satellites allow us to predict storms a few days in advance.", "Satellites enable us to predict storms several days in advance.", "Satellites allow us to forecast storms several days in advance."], hint: "allow sb to V · predict storms · in advance" },
          { q: "Về lâu dài, đầu tư vào khoa học mang lại lợi ích cho cả xã hội.", answers: ["In the long run, investment in science benefits the whole of society.", "In the long run, investment in science benefits the whole society.", "In the long run, investing in science benefits the whole of society.", "In the long run, investing in science benefits the whole society.", "In the long run, investment in science benefits society as a whole.", "In the long term, investment in science benefits the whole of society."], hint: "In the long run · investment in · benefit (không for)" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t3d10-viet",
    kind: "writing",
    title: "Viết Task 2: Discussion essay band 6 — hai thân bài cân đối + ý kiến rõ",
    goal: "Viết một bài Discussion ≥ 250 từ ở mức band 6: nhận đúng một trong ba biến thể đề (chỉ thảo luận · thảo luận + ý kiến · ý kiến cân bằng), viết hai thân bài dài và sâu ngang nhau bằng ngôn ngữ thuật lại trung lập, để ý kiến của mình hiện rõ ở mở bài – thân bài – kết bài, và liên kết đoạn bằng từ quy chiếu (this view, such spending, the latter) thay vì rải Firstly / Moreover.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Ôn từ **Tập 2 Ngày 6**: khung 4 đoạn của bài Discussion, dàn ý 5 phút, đề có / không có “give your own opinion”. Hôm nay nâng từ band 5 lên band 6.",
          "**Task Response band 6** = trả lời ==đủ mọi phần== của đề + ==ý kiến rõ xuyên bài==. Bài Discussion band 5 thường hỏng ở đúng hai chỗ: một quan điểm viết dài, quan điểm kia viết hai câu; ý kiến chỉ xuất hiện ở câu cuối hoặc là “both are important”.",
          "**Ba biến thể đề**: chỉ thảo luận (discuss-only) · thảo luận + ý kiến nghiêng một bên · thảo luận + ==ý kiến cân bằng== (balanced opinion — đồng ý với mỗi bên trong một điều kiện nói rõ).",
          "**Coherence & Cohesion band 6** (nối Tập 2 Ngày 17): từ nối đúng vai nhưng **không rải máy móc**; liên kết bằng **từ quy chiếu** — this argument, such spending, these needs, the former / the latter.",
          "Bạn sẽ đọc **một bài band 5 và một bài band 6 cho cùng một đề** (chi tiền cho vũ trụ hay cho các vấn đề trên Trái Đất), so từng tiêu chí, rồi tự viết một bài để AI chấm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bài Discussion: band 5 và band 6 khác nhau ở đâu" },
      {
        t: "table",
        caption: "Đọc theo hàng: cùng một tiêu chí, giám khảo thấy gì ở band 5 và band 6 (diễn giải từ bảng mô tả band công khai).",
        head: ["Tiêu chí", "Band 5", "Band 6"],
        rows: [
          ["**TR** — Task Response (trả lời đề)", "Có nhắc cả hai quan điểm nhưng **lệch**: một bên 120 từ, bên kia 40 từ. Ý kiến riêng mơ hồ hoặc chỉ có ở câu cuối. Ý nêu ra nhưng không giải thích.", "**Cả hai quan điểm** được trình bày đủ; ý kiến riêng **rõ và nhất quán** từ mở bài tới kết bài; ý chính có giải thích / ví dụ (dù còn ý chưa sâu)."],
          ["**CC** — Coherence & Cohesion (mạch lạc)", "Có chia đoạn nhưng câu nào cũng mở bằng Firstly / Moreover / Besides; lặp danh từ; đoạn chứa nhiều ý rời.", "Mỗi đoạn **một ý trung tâm**; có tiến triển; từ nối đúng vai; dùng **this / these / such + danh từ** để nối câu."],
          ["**LR** — Lexical Resource (từ vựng)", "Lặp very important, a lot of, good / bad; sai collocation (spend money for).", "Đủ từ cho chủ đề; **dám dùng từ ít gặp** (allocate, priority, modest) dù đôi chỗ chưa tự nhiên; lỗi không cản hiểu."],
          ["**GRA** — Grammar", "Chủ yếu câu đơn; thử câu phức thì sai (it help, was invented với chủ ngữ số nhiều).", "**Trộn câu đơn và câu phức** (while, although, which, if); còn lỗi nhưng hiếm khi làm sai nghĩa."],
        ],
      },
      {
        t: "note",
        title: "Ghi nhớ: lên band 6 không cần từ “khủng”",
        items: [
          "Thứ đẩy điểm nhanh nhất ở dạng Discussion là **cấu trúc**: hai thân bài cân đối + ý kiến nói rõ ba lần. Hai việc này không cần thêm một từ vựng nào.",
          "Sau đó mới tới **cohesion**: bỏ bớt từ nối đầu câu, thêm từ quy chiếu.",
          "Từ vựng và ngữ pháp: chỉ cần **đúng** những gì bạn đã học (Ngày 9: giới từ phụ thuộc; bài 1 hôm nay: collocation khoa học).",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ba biến thể của đề Discussion — đọc câu lệnh, đếm vế" },
      {
        t: "p",
        text: "Đề Discussion luôn có **hai câu nêu hai quan điểm** rồi **một câu lệnh**. Câu lệnh quyết định bạn có phải nêu ý kiến hay không; và **cách bạn nghĩ** về hai quan điểm quyết định ý kiến đó nghiêng hay cân bằng.",
      },
      {
        t: "table",
        head: ["Biến thể", "Câu lệnh trong đề", "Ý kiến của bạn", "Kết bài"],
        rows: [
          ["**A. Chỉ thảo luận** (discuss-only)", "Discuss both views. / Discuss both sides of this argument.", "Đề **không đòi**. Giữ giọng trung lập; được phép thêm một nhận định ngắn ở kết bài, không bắt buộc.", "Tóm tắt hai quan điểm + (tuỳ chọn) một câu nhận định."],
          ["**B. Thảo luận + ý kiến nghiêng một bên**", "Discuss both views **and give your own opinion**.", "**Bắt buộc**. Bạn thấy một bên thuyết phục hơn hẳn.", "Nhắc lại bên mình chọn + lý do chính."],
          ["**C. Thảo luận + ý kiến cân bằng** (balanced opinion)", "Discuss both views **and give your own opinion**. (cùng câu lệnh với B)", "**Bắt buộc**. Bạn thấy mỗi bên đúng **trong một điều kiện** hoặc nên **kết hợp** theo tỉ lệ / thứ tự ưu tiên.", "Nói rõ điều kiện: A đúng khi…, nhưng B nên được ưu tiên khi…"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ý kiến cân bằng ≠ không có ý kiến",
        caption: "Giám khảo không trừ điểm vì bạn đứng giữa. Họ trừ điểm vì không biết bạn đứng ở đâu.",
        cols: [
          { title: "✘ Mơ hồ (band 5)", items: ["Both views are important.", "Both views have advantages and disadvantages.", "The government should think carefully.", "It depends on each country."] },
          { title: "✔ Cân bằng mà rõ (band 6)", items: ["Problems on Earth deserve **priority**, but a **limited** space budget is still worth keeping.", "Space research is justified in **wealthy** countries, whereas **poorer** nations should focus on basic needs.", "Governments should fund **satellites**, which have practical uses, but leave **Mars missions** to private companies."] },
        ],
      },
      {
        t: "p",
        text: "**Đếm vế đề.** Mỗi quan điểm có thể chứa nhiều hơn một ý. Ví dụ: “governments should spend **large amounts** of money on space exploration” có hai vế — (1) chính phủ chi tiền, (2) chi **nhiều**. Bạn có thể đồng ý vế 1 mà không đồng ý vế 2 — và đó chính là cửa dẫn tới ý kiến cân bằng. Trước khi lập dàn ý, gạch chân: **ai** · **làm gì** · **mức độ** (all, only, large, the best, more than) · **phạm vi** (children, in cities, at school).",
      },
      {
        t: "mcq",
        id: "t3d10-viet-bien-the",
        title: "Nhận biến thể và đếm vế đề (5 câu)",
        items: [
          { q: "1. “Some people think zoos are cruel. Others believe they protect endangered animals. Discuss both views.” — Bạn phải làm gì?", options: ["Chọn một bên và chỉ viết về bên đó.", "Trình bày cả hai quan điểm; ý kiến riêng không bắt buộc.", "Nêu ý kiến riêng ở mọi đoạn.", "Viết ưu điểm và nhược điểm của việc đi sở thú."], correct: 1, why: "Câu lệnh chỉ có “Discuss both views” ⇒ biến thể A. Không bắt buộc ý kiến; nếu thêm thì chỉ một câu ở kết bài." },
          { q: "2. Đề có “Discuss both views and give your own opinion.” Bài của bạn tả kỹ hai quan điểm, kết bằng “Both views are reasonable.” Tiêu chí nào bị ảnh hưởng nặng nhất?", options: ["Grammar", "Lexical Resource", "Task Response", "Không tiêu chí nào"], correct: 2, why: "Đề đòi ý kiến mà bài không có lập trường rõ ⇒ chưa trả lời đủ đề ⇒ Task Response khó vượt band 5." },
          { q: "3. “Some people believe **all** university students should study science subjects.” Từ nào là “vế mức độ” bạn có thể không đồng ý?", options: ["university", "students", "study", "all"], correct: 3, why: "all = mọi sinh viên. Bạn có thể đồng ý rằng khoa học quan trọng nhưng không đồng ý rằng **mọi** sinh viên phải học ⇒ ý kiến cân bằng." },
          { q: "4. Câu nào là một ý kiến cân bằng viết rõ?", options: ["I think both sides are right in some ways.", "This is a difficult question to answer.", "In my view, basic research deserves public funding, while applied research should be paid for by companies.", "Everyone has their own opinion about this issue."], correct: 2, why: "Câu C nói rõ **điều kiện**: loại nghiên cứu nào do ai trả tiền. Ba câu còn lại không cho biết người viết nghĩ gì." },
          { q: "5. Ở biến thể B (nghiêng một bên), nên đặt quan điểm mình ỦNG HỘ ở đâu?", options: ["Thân bài 2 — để nó được nói sau cùng, ngay trước kết bài.", "Thân bài 1 — để gây ấn tượng đầu.", "Chỉ ở kết bài.", "Ở đâu cũng được, không ảnh hưởng."], correct: 0, why: "Quan điểm nói sau có sức nặng hơn và dẫn thẳng vào kết bài. Thứ tự gợi ý: thân 1 = quan điểm mình ít đồng ý, thân 2 = quan điểm mình ủng hộ (như Tập 2 Ngày 6)." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Để ý kiến “rõ xuyên bài”: ba chỗ đặt, ba mức mạnh" },
      {
        t: "p",
        text: "Bảng mô tả band 6 ghi: ý kiến của người viết phải rõ, dù kết luận có thể chưa thật sắc. Cách chắc ăn nhất: cho ý kiến xuất hiện ở **ba chỗ** và **không đổi** giữa các chỗ đó.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Ý kiến xuất hiện ở 3 chỗ",
        steps: [
          { label: "① Mở bài — câu luận điểm (thesis)", sub: "In my view, B deserves priority, but A should not be abandoned." },
          { label: "② Cuối mỗi thân bài — một câu đánh giá", sub: "For these reasons, A cannot simply be dismissed. / This argument is particularly strong in…" },
          { label: "③ Kết bài — nói lại bằng lời khác", sub: "In conclusion, although A…, I believe that B…" },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "While / Although + S + V (quan điểm A), I believe that + S + V (quan điểm B)",
            vi: "Luận điểm nghiêng một bên — nhượng bộ bên A trong mệnh đề phụ, đặt ý mình ở mệnh đề chính.",
            examples: [
              { en: "Although space research has some benefits, I believe that public money should be spent on problems on Earth.", vi: "Dù nghiên cứu vũ trụ có một số lợi ích, tôi tin rằng tiền công nên được chi cho các vấn đề trên Trái Đất." },
            ],
          },
          {
            formula: "In my view, + B + deserves priority / should come first, but + A + is still worth + V-ing",
            vi: "Luận điểm cân bằng theo THỨ TỰ ƯU TIÊN — không bỏ bên nào, nhưng nói rõ bên nào trước.",
            examples: [
              { en: "In my view, problems on Earth deserve priority, but a limited space budget is still worth keeping.", vi: "Theo tôi, các vấn đề trên Trái Đất đáng được ưu tiên, nhưng một ngân sách vũ trụ hạn chế vẫn đáng giữ." },
            ],
          },
          {
            formula: "I would argue that + A + is justified in / for + điều kiện 1, whereas + B + is more appropriate in / for + điều kiện 2",
            vi: "Luận điểm cân bằng theo ĐIỀU KIỆN — mỗi bên đúng trong một hoàn cảnh.",
            examples: [
              { en: "I would argue that space programmes are justified in wealthy countries, whereas developing nations should invest in healthcare first.", vi: "Tôi cho rằng chương trình vũ trụ là chính đáng ở nước giàu, trong khi nước đang phát triển nên đầu tư cho y tế trước." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "Cẩn thận: bốn cách làm ý kiến “biến mất”",
        items: [
          "Mở bài viết “This essay will discuss both views” rồi hết — chưa có luận điểm. Thêm ngay một câu “In my view, …”. (Ở biến thể A thì câu này là đủ.)",
          "Mở bài nghiêng A, kết bài nghiêng B ⇒ **mâu thuẫn** — nặng hơn cả không có ý kiến. Viết kết bài xong, đọc lại mở bài.",
          "Dùng I think / In my opinion **trong thân bài thuật quan điểm mình không theo** ⇒ người đọc tưởng đó là ý bạn. Thân bài đó dùng ngôn ngữ thuật lại (mục 4).",
          "Kết bài đưa **ý mới** (một lý do chưa từng nhắc). Kết bài chỉ tóm tắt và chốt.",
        ],
      },
      { t: "rule", formula: "Thesis (mở bài) → câu đánh giá cuối mỗi thân bài → kết bài nói lại · ba chỗ CÙNG một lập trường", vi: "Ý kiến rõ xuyên bài = nói ba lần, bằng ba cách, không đổi hướng." },

      /* ── 4 ── */
      { t: "h", text: "4. Hai thân bài cân đối — cùng độ dài, cùng độ sâu, cùng khung" },
      {
        t: "p",
        text: "“Cân đối” không có nghĩa bạn phải đồng ý với cả hai. Nó có nghĩa mỗi quan điểm được **trình bày tử tế**: có ý chính, có giải thích, có ví dụ hoặc hệ quả. Mục tiêu: mỗi thân bài **80–95 từ**, chênh nhau không quá khoảng 20 từ.",
      },
      {
        t: "table",
        caption: "Khung một thân bài Discussion band 6 — 4 câu (nối khung P-E-E của Tập 2 Ngày 2 · Ngày 6).",
        head: ["Câu", "Việc", "Khung câu"],
        rows: [
          ["1 — Topic sentence", "Nêu quan điểm của **một nhóm người** (không phải của bạn)", "Supporters of X point out that… · Those who oppose X believe that… · It is often argued that…"],
          ["2 — Giải thích / ví dụ", "Vì sao họ nghĩ vậy — một ví dụ cụ thể", "X, for example, … · This is because…"],
          ["3 — Ý thứ hai hoặc hệ quả", "Mở rộng: thêm một lợi ích, hoặc hệ quả của ý 1", "In addition, … which + V… · If + S + V-ed, S + would + V…"],
          ["4 — Câu đánh giá", "**Ý kiến của bạn** về quan điểm này: mạnh / yếu ở đâu", "For these reasons, X cannot simply be dismissed. · This argument is particularly strong in… · However, this view overlooks…"],
        ],
      },
      {
        t: "table",
        caption: "Ngôn ngữ thuật lại quan điểm người khác — thay Some people think ở mọi chỗ. (Ngày 19 học kỹ động từ tường thuật.)",
        head: ["Chủ ngữ (ai)", "Động từ", "Sắc thái"],
        rows: [
          ["Supporters / Advocates of X · Those who favour X", "argue that · point out that · maintain that", "Bên ủng hộ"],
          ["Opponents / Critics of X · Those who oppose X", "claim that · believe that · object that", "Bên phản đối — claim hàm ý người viết chưa chắc tin"],
          ["It is often argued / claimed / said that…", "(bị động với It)", "Trung lập, không nêu ai"],
          ["From this perspective, … · According to this view, …", "—", "Nối câu 2–3 trong cùng thân bài"],
        ],
      },
      {
        t: "note",
        title: "Người Việt hay sai khi viết hai thân bài",
        items: [
          "Thân bài 1 liệt kê **năm sáu ý**, mỗi ý một câu, không ý nào được giải thích ⇒ dài nhưng nông. Band 6 cần **hai ý có giải thích** hơn là sáu ý trần.",
          "Thân bài 2 chỉ còn hai câu vì hết giờ. Sửa: lập dàn ý 5 phút với **hai ý cho mỗi bên** trước khi viết; viết thân 1 xong nhìn đồng hồ — không quá phút thứ 18.",
          "~~Some people think… Some people think… Other people think…~~ lặp ba lần. Dùng bảng thuật lại ở trên.",
          "~~According to me~~ → **In my view / In my opinion**. ~~In my opinion, I think~~ → bỏ một trong hai.",
          "Viết thân bài bên mình không theo bằng giọng **chế giễu** (“This is a stupid idea”). Văn học thuật tôn trọng cả hai phía: “This view is understandable, but it overlooks…”.",
        ],
      },
      { t: "rule", formula: "Supporters of X point out that + S + V → ví dụ → In addition / If… would… → For these reasons, + đánh giá", vi: "Mỗi thân bài 4 câu, 80–95 từ: thuật quan điểm – chứng minh – mở rộng – đánh giá." },

      /* ── 5 ── */
      { t: "h", text: "5. Cohesion band 6: bớt từ nối, thêm từ quy chiếu" },
      {
        t: "p",
        text: "**Cohesion** (liên kết) là cách các câu “bám” vào nhau. Tập 2 Ngày 17 dạy từ nối đúng vai. Band 5 mắc bệnh ngược lại: **lạm dụng** — câu nào cũng Firstly, Moreover, Furthermore, Besides. Band 6 trở lên nối câu chủ yếu bằng bốn công cụ khác, và chỉ dùng từ nối khi **quan hệ giữa hai câu thật sự cần được báo**.",
      },
      {
        t: "table",
        caption: "Bốn công cụ liên kết ngoài từ nối.",
        head: ["Công cụ", "Cách làm", "Ví dụ"],
        rows: [
          ["① **this / these / such + danh từ tóm tắt**", "Gói cả câu trước vào một danh từ rồi nói tiếp về nó", "Governments spend billions on rockets. **Such spending** is hard to justify. · … **This argument** is particularly strong in…"],
          ["② **Đại từ**: it · they · this · those who", "Thay danh từ vừa nhắc (rõ ràng nó chỉ cái gì)", "Satellites were developed for space research, yet today **they** are essential for navigation."],
          ["③ **Thay thế**: the former / the latter · do so · one(s)", "Tránh lặp cả cụm", "Some favour space research, others medical research. **The latter** has more immediate benefits."],
          ["④ **Chuỗi từ đồng nghĩa**", "Nhắc lại chủ đề bằng tên gọi khác", "space exploration → space programmes → such research → these missions"],
        ],
      },
      {
        t: "table",
        caption: "Danh từ tóm tắt hay dùng sau this / these / such — chọn theo NỘI DUNG câu trước.",
        head: ["Câu trước nói về", "Danh từ tóm tắt"],
        rows: [
          ["một ý kiến", "this **view** · this **argument** · this **claim** · this **belief**"],
          ["một cách làm, một chính sách", "this **approach** · this **policy** · such **measures** · this **strategy**"],
          ["việc chi tiền", "such **spending** · this **investment** · these **costs**"],
          ["một điều đang diễn ra", "this **trend** · this **development** · this **situation** · this **problem**"],
          ["một điều tốt / xấu", "these **benefits** · these **advantages** · this **risk** · these **concerns**"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một đoạn — nối bằng từ nối rải đều vs nối bằng quy chiếu",
        cols: [
          { title: "Band 5 — từ nối ở đầu mọi câu", items: ["**Firstly**, space exploration has many benefits.", "**Moreover**, it helps scientists discover new things.", "**Furthermore**, new technologies were invented.", "**In addition**, it makes young people interested in science.", "**Besides**, people can live on Mars."] },
          { title: "Band 6 — một từ nối, còn lại là quy chiếu", items: ["Supporters of space exploration point out that **it** produces practical benefits.", "Satellites, **for example**, were developed for space research, yet today **they** are essential for navigation.", "**Such programmes** also encourage young people to study science, **which** strengthens the economy.", "**For these reasons**, space spending cannot be described as a waste."] },
        ],
      },
      {
        t: "note",
        title: "Cẩn thận khi dùng từ nối và từ quy chiếu",
        items: [
          "Mỗi thân bài 4 câu chỉ cần **1–2 từ nối**. Hơn thế là “mechanical” (máy móc) — đúng chữ bảng mô tả band 6 dùng để chỉ điểm yếu.",
          "Đưa từ nối **vào giữa câu** cho tự nhiên: Satellites, **for example**, were… · This view, **however**, overlooks…",
          "**Besides** đầu câu trong bài luận nghe như văn nói; dùng **In addition** / **Furthermore** — và chỉ một lần.",
          "**this** phải chỉ rõ cái gì. “This is a problem” sau một câu có ba ý ⇒ người đọc không biết this là ý nào. Thêm danh từ: **This shortage** is a problem.",
          "**the former / the latter** chỉ dùng khi vừa nhắc đúng **hai** thứ, và chỉ một lần trong bài.",
          "**On the other hand** phải báo một ý **đối lập** với đoạn trước — dùng mở thân bài 2 là đúng chỗ. Đừng dùng nó để thêm ý cùng chiều.",
        ],
      },
      { t: "rule", formula: "this / these / such + N tóm tắt · it / they · the former / the latter · do so — rồi mới tới từ nối (1–2 lần mỗi đoạn)", vi: "Cohesion band 6: câu sau bám câu trước bằng quy chiếu, không bằng Firstly – Moreover – Besides." },
      {
        t: "quiz",
        id: "t3d10-viet-quy-chieu",
        kind: "fill",
        title: "Điền MỘT từ quy chiếu vào mỗi chỗ trống (6 câu)",
        items: [
          { q: "1. Governments spend billions on space programmes. Critics argue that ___ spending is unjustified. (s___)", answers: ["such", "this"] },
          { q: "2. Some people support nuclear power, while others prefer wind energy. The ___ is cheaper to build, but the former produces more electricity. (l___)", answers: ["latter"] },
          { q: "3. Scientists have warned about climate change for decades. However, few governments have listened to ___ warnings. (th___)", answers: ["these", "their", "those"] },
          { q: "4. Schools should let children carry out experiments. Doing ___ would make science lessons more interesting.", answers: ["so", "this"] },
          { q: "5. Online courses are usually cheaper than traditional ___.", answers: ["ones"] },
          { q: "6. Many young people are leaving the countryside. ___ trend is likely to continue.", answers: ["This", "The"] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Phân tích đề và dàn ý 5 phút" },
      {
        t: "p",
        text: "**Đề:** Some people believe that governments should spend large amounts of money on space exploration. Others think this money would be better spent on solving problems on Earth. Discuss both views and give your own opinion.",
      },
      {
        t: "table",
        caption: "Đếm vế đề — gạch chân trước khi nghĩ ý.",
        head: ["Vế", "Chữ trong đề", "Bạn phải làm"],
        rows: [
          ["Quan điểm 1", "governments · spend **large amounts** · space exploration", "Thân bài 1: vì sao có người ủng hộ chi (nhiều) tiền cho vũ trụ"],
          ["Quan điểm 2", "this money · **better spent** · problems on Earth", "Thân bài 2: vì sao có người muốn dùng tiền đó cho Trái Đất"],
          ["Câu lệnh", "Discuss both views **and give your own opinion**", "Ý kiến bắt buộc ⇒ biến thể B hoặc C"],
          ["Cửa cho ý kiến cân bằng", "**large** amounts", "Đồng ý chi, không đồng ý chi NHIỀU ⇒ “a limited / modest space budget”"],
        ],
      },
      {
        t: "note",
        title: "Dàn ý 5 phút — chỉ ghi từ khoá (chép khung này ra nháp)",
        items: [
          "**Ý kiến (viết trước tiên):** Earth = priority; keep a small space budget ⇒ biến thể C.",
          "**Mở bài:** space programmes cost billions → some: investment / others: urgent problems → In my view…",
          "**Thân 1 (ủng hộ vũ trụ):** practical benefits — satellites (weather, navigation) · inspire young people → science, economy long run → đánh giá: not simply a waste.",
          "**Thân 2 (ưu tiên Trái Đất):** immediate responsibilities — clean water, healthcare, education · if money → hospitals, results in few years → đánh giá: esp. strong in developing countries.",
          "**Kết bài:** although real advantages → basic needs first → fund space on a modest scale.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Bài mẫu band 5 (ước tính) — đọc và tìm xem hỏng ở đâu" },
      {
        t: "p",
        text: "Bài dưới đây (232 từ) được viết **cố ý** theo kiểu band 5 điển hình của thí sinh Việt Nam. Lỗi ngữ pháp được giữ nguyên. Đọc xong, tự liệt kê 5 điểm yếu rồi mới xem bảng so sánh ở mục 8.",
      },
      {
        t: "examples",
        items: [
          { en: "[Introduction] Nowadays, space exploration is a hot topic in the world. Some people think government should spend a lot of money for space exploration, but other people think the money should spend for problems on Earth. This essay will discuss both views.", vi: "[Mở bài] Chép gần nguyên đề; “hot topic” sáo; sai spend … for, the money should spend (thiếu bị động); KHÔNG có luận điểm dù đề đòi ý kiến." },
          { en: "[Body 1] Firstly, space exploration has many benefits. Moreover, it help scientists to discover new things about the universe. Furthermore, many new technologies was invented because of space programmes, for example satellites and the internet on phones. In addition, space exploration make young people interested in science, and they will study hard to become scientists. Besides, if the Earth is destroyed in the future, people can go to live on another planet such as Mars. Also, a country which sends astronauts to space will be famous and other countries will respect it. So space exploration is very important and very useful for everyone in the world.", vi: "[Thân bài 1 — 104 từ] Sáu ý, mỗi ý một câu, không ý nào được giải thích; sáu từ nối đứng đầu sáu câu; lỗi chia động từ (it help, was invented, make)." },
          { en: "[Body 2] Secondly, there are many problems on Earth. For example, poor people do not have enough food and clean water. Government should help them.", vi: "[Thân bài 2 — 23 từ] Quan điểm thứ hai chỉ có ba câu ngắn ⇒ lệch hẳn so với thân bài 1; không giải thích vì sao tiền nên chuyển sang đây." },
          { en: "[Conclusion] In conclusion, both views have advantages and disadvantages. Space exploration is important and problems on Earth are important too. I think government should think carefully about this problem and spend money in a good way, because money is not easy to get. If government spend money in a good way, the country will develop and people will have a better life in the future.", vi: "[Kết bài] “Cả hai đều quan trọng… nên suy nghĩ cẩn thận” ⇒ không có lập trường; ý mới (money is not easy to get); lặp “in a good way”." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bài mẫu band 6 (ước tính) — cùng đề, cùng ý tưởng" },
      {
        t: "p",
        text: "Bài này (262 từ) dùng **đúng những ý** của bài band 5 — vệ tinh, truyền cảm hứng, người nghèo thiếu nước sạch — nhưng chọn ít ý hơn, giải thích từng ý, cân hai thân bài và nói rõ ý kiến. Từ vựng lấy từ bài 1 hôm nay.",
      },
      {
        t: "examples",
        items: [
          { en: "[Introduction] Space programmes cost governments billions of dollars every year. While some people regard this spending as an investment in the future, others argue that it should be used to deal with urgent problems on our own planet. In my view, problems on Earth deserve priority, but a limited space budget is still worth keeping.", vi: "[Mở bài — 3 câu] Câu nền → hai quan điểm trong MỘT câu phức (While…, others…) → luận điểm cân bằng theo thứ tự ưu tiên." },
          { en: "[Body 1] Supporters of space exploration point out that it produces practical benefits. Satellites, for example, were originally developed for space research, yet today they are essential for weather forecasting, navigation and communication. Medical equipment and new materials have also come out of research done for space missions. In addition, such programmes encourage talented young people to study science and engineering, which strengthens the economy in the long run. For these reasons, space spending cannot simply be described as a waste of public money.", vi: "[Thân bài 1 — 82 từ] Thuật lại quan điểm (Supporters… point out) → ví dụ vệ tinh, thiết bị y tế → ý 2 + hệ quả (which strengthens…) → câu đánh giá của người viết." },
          { en: "[Body 2] On the other hand, those who oppose this spending believe that governments have more immediate responsibilities. Millions of people still lack access to clean water, basic healthcare and education, and these needs cannot wait for decades. Climate change, too, demands large-scale funding now rather than later. If the money allocated to a single mission were invested in hospitals or schools, the results would be seen within a few years. This argument is particularly strong in developing countries, where public funds are limited.", vi: "[Thân bài 2 — 82 từ] Cùng khung: thuật quan điểm → chứng minh (nước sạch, y tế, khí hậu) → hệ quả bằng câu điều kiện loại 2 → câu đánh giá (bên này mạnh hơn, nhất là ở nước đang phát triển)." },
          { en: "[Conclusion] In conclusion, although space research has brought real advantages, I believe that basic human needs should come first. Governments should therefore continue to fund space projects on a modest scale, while devoting the majority of their budgets to problems that affect people's daily lives.", vi: "[Kết bài — 2 câu] Nhượng bộ (although…) + lập trường; câu 2 nói lại luận điểm bằng lời khác (limited budget → on a modest scale)." },
        ],
      },
      {
        t: "table",
        caption: "So hai bài theo 4 tiêu chí — band ghi là ƯỚC TÍNH để học, không phải điểm thi thật.",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6", "Bạn làm gì để chuyển"],
        rows: [
          ["**TR**", "Thân 1: 104 từ, thân 2: 23 từ. Không có luận điểm; kết bài “both are important”. Thiếu 18 từ so với mức 250.", "Hai thân bài đều 82 từ. Ý kiến ở mở bài, ở câu cuối mỗi thân, ở kết bài — cùng một hướng.", "Viết luận điểm TRƯỚC khi viết thân bài. Dàn ý hai ý mỗi bên. Đếm từ."],
          ["**CC**", "Firstly · Moreover · Furthermore · In addition · Besides · Also · So · Secondly — 8 từ nối đầu câu. Sáu ý rời trong một đoạn.", "Chỉ 3 từ nối đầu / giữa câu (for example, In addition, On the other hand); còn lại nối bằng it · they · such programmes · this spending · these needs · This argument.", "Mỗi đoạn tối đa 2 từ nối. Câu sau mở bằng this / such + danh từ."],
          ["**LR**", "a hot topic · many benefits · very important · very useful · in a good way (×2) · spend money **for**.", "regard… as an investment · practical benefits · allocate · immediate responsibilities · on a modest scale · a waste of public money.", "Thay very + tính từ bằng một collocation của chủ đề (bài 1). Kiểm giới từ (Ngày 9)."],
          ["**GRA**", "Gần hết là câu đơn. Lỗi: it help · technologies was invented · exploration make · the money should spend · government (thiếu mạo từ / số nhiều).", "While… others… · yet · which + V · If… were invested…, would be seen · although… · where… Không lỗi chia động từ.", "Mỗi đoạn ít nhất một câu phức ĐÚNG. Soát chủ ngữ – động từ sau khi viết."],
        ],
      },
      {
        t: "note",
        title: "Mẹo: bài band 6 không dùng ý nào “hay” hơn bài band 5",
        items: [
          "Bài band 5 có **sáu** ý ủng hộ; bài band 6 chỉ giữ **hai** (vệ tinh, truyền cảm hứng) và bỏ ý “sống trên sao Hoả”, “nước nổi tiếng” — những ý khó chứng minh trong hai câu.",
          "Ý “người nghèo thiếu nước sạch” ở bài band 5 là một câu; ở bài band 6 nó thành một lập luận: nhu cầu không thể chờ → nếu chuyển tiền thì kết quả thấy trong vài năm → nhất là ở nước nghèo.",
          "Kết luận: **chọn ít ý, đào sâu từng ý** là cách lên band 6 nhanh nhất ở Task Response.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Cùng một đề — mở bài và kết bài cho cả ba biến thể" },
      {
        t: "table",
        caption: "Hai thân bài giữ nguyên; chỉ câu luận điểm và kết bài thay đổi theo biến thể.",
        head: ["Biến thể", "Câu luận điểm (cuối mở bài)", "Kết bài"],
        rows: [
          ["**A. Chỉ thảo luận** (đề chỉ ghi “Discuss both views.”)", "This essay will examine the arguments on both sides of this debate.", "In conclusion, space exploration brings long-term benefits such as satellite technology, whereas spending on Earth meets more urgent needs. Both positions are therefore understandable."],
          ["**B. Nghiêng một bên** (ưu tiên Trái Đất)", "Although space research has some benefits, I believe that public money should be spent on problems on Earth.", "In conclusion, while I accept that space programmes have produced useful technology, I am convinced that healthcare and education are a far better use of public funds."],
          ["**C. Cân bằng** (bài mẫu ở mục 8)", "In my view, problems on Earth deserve priority, but a limited space budget is still worth keeping.", "In conclusion, although space research has brought real advantages, I believe that basic human needs should come first. Governments should therefore continue to fund space projects on a modest scale."],
        ],
      },
      {
        t: "table",
        caption: "Câu khung dùng lại cho MỌI đề Discussion — thay X, A, B bằng nội dung của đề.",
        head: ["Vị trí", "Khung câu"],
        rows: [
          ["Mở bài — nêu hai quan điểm", "While some people regard X as A, others argue that B."],
          ["Mở bài — luận điểm", "In my view, B deserves priority, but A is still worth + V-ing. · Although A, I believe that B."],
          ["Thân 1 — câu chủ đề", "Supporters of X point out that… · It is often argued that…"],
          ["Thân 1 — câu đánh giá", "For these reasons, X cannot simply be described as / dismissed as…"],
          ["Thân 2 — câu chủ đề", "On the other hand, those who oppose X believe that…"],
          ["Thân 2 — hệ quả", "If + S + V-ed / were + V3, the results would be…"],
          ["Thân 2 — câu đánh giá", "This argument is particularly strong in… , where… · However, this view overlooks the fact that…"],
          ["Kết bài", "In conclusion, although A has…, I believe that B should come first. S + should therefore…"],
        ],
      },
      { t: "rule", formula: "While some regard X as A, others argue that B. In my view, … → Supporters of X point out that… → On the other hand, those who oppose X believe that… → In conclusion, although A, I believe that B.", vi: "Bộ khung Discussion band 6 — bốn câu mở đoạn nắm cả bài." },
      {
        t: "quiz",
        id: "t3d10-viet-dich",
        kind: "translate",
        title: "Dịch câu khung Discussion band 6 (5 câu)",
        grammar: "Supporters of X point out that… · This argument is… · In my view, … deserve priority · Although…, I believe that… · If… were…, … would…",
        items: [
          { q: "Những người ủng hộ khám phá vũ trụ chỉ ra rằng nó tạo ra những lợi ích thực tiễn.", answers: ["Supporters of space exploration point out that it produces practical benefits.", "Supporters of space exploration point out that it brings practical benefits.", "Supporters of space exploration point out that it has practical benefits."], hint: "Supporters of… point out that · practical benefits" },
          { q: "Lập luận này đặc biệt mạnh ở các nước đang phát triển.", answers: ["This argument is particularly strong in developing countries.", "This argument is especially strong in developing countries."], hint: "This argument · particularly strong" },
          { q: "Theo quan điểm của tôi, các vấn đề trên Trái Đất đáng được ưu tiên.", answers: ["In my view, problems on Earth deserve priority.", "In my opinion, problems on Earth deserve priority.", "In my view, the problems on Earth deserve priority."], hint: "In my view · deserve priority" },
          { q: "Mặc dù nghiên cứu vũ trụ đã mang lại những lợi ích thật sự, tôi tin rằng nhu cầu cơ bản của con người nên được đặt lên trước.", answers: ["Although space research has brought real benefits, I believe that basic human needs should come first.", "Although space research has brought real advantages, I believe that basic human needs should come first.", "Although space research has brought real benefits, I believe basic human needs should come first.", "Although space research has brought real advantages, I believe basic human needs should come first."], hint: "Although + S + has brought… · basic human needs · come first" },
          { q: "Nếu số tiền này được đầu tư vào bệnh viện, kết quả sẽ được thấy trong vòng vài năm.", answers: ["If this money were invested in hospitals, the results would be seen within a few years.", "If this money was invested in hospitals, the results would be seen within a few years.", "If this money were invested in hospitals, the results would be seen in a few years."], hint: "If + S + were invested in…, S + would be seen · within a few years" },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Sáu lỗi làm bài Discussion kẹt ở band 5 — bảng tự soát" },
      {
        t: "note",
        title: "Cẩn thận — soát 6 điểm này trong 3 phút cuối",
        items: [
          "☐ **Mở bài có luận điểm chưa?** (đề có “give your own opinion” mà mở bài chỉ có “This essay will discuss both views” ⇒ thiếu.)",
          "☐ **Hai thân bài có ngang nhau không?** Đếm dòng: chênh quá 2 dòng ⇒ thêm một câu giải thích cho đoạn ngắn.",
          "☐ **Mỗi thân bài có câu đánh giá cuối đoạn chưa?** Đó là chỗ ý kiến “xuyên bài”.",
          "☐ **Kết bài có cùng hướng với mở bài không?** Và không có ý mới.",
          "☐ **Đếm từ nối đầu câu**: quá 2 trong một đoạn ⇒ xoá bớt, thay bằng this / such + danh từ.",
          "☐ **Soát ngữ pháp nhanh**: chủ ngữ số ít + V-s (it help**s**) · bị động (money should **be** spent) · giới từ (spend **on**, invest **in**, benefit + N).",
        ],
      },

      /* ── 11 ── */
      { t: "h", text: "11. Viết bài — AI chấm 4 tiêu chí (40 phút)" },
      {
        t: "sodo",
        kind: "flow",
        title: "40 phút cho bài Discussion",
        steps: [
          { label: "5′ — Đọc đề, đếm vế, dàn ý", sub: "Viết luận điểm trước; 2 ý mỗi bên" },
          { label: "5′ — Mở bài", sub: "Nền → hai quan điểm → In my view…" },
          { label: "12′ — Thân bài 1", sub: "4 câu, 80–95 từ" },
          { label: "12′ — Thân bài 2", sub: "4 câu, cùng độ dài" },
          { label: "3′ — Kết bài", sub: "Nói lại luận điểm bằng lời khác" },
          { label: "3′ — Soát", sub: "Bảng 6 điểm ở mục 10" },
        ],
      },
      {
        t: "essay",
        id: "t3d10-viet-bai",
        task: "Task 2",
        prompt: "Some people think that scientific research should be carried out and controlled by governments. Others believe that private companies should be responsible for it. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đếm vế: “carried out AND controlled” — hai việc khác nhau; bạn có thể cho rằng công ty LÀM nghiên cứu nhưng chính phủ KIỂM SOÁT ⇒ ý kiến cân bằng.",
          "Viết luận điểm trước: In my view, … / Although …, I believe that …",
          "Thân 1 và thân 2: mỗi đoạn 4 câu — Supporters… point out that → ví dụ → In addition / If… would… → câu đánh giá.",
          "Dùng ít nhất 5 mục từ vựng của bài 1: conduct research into, funding, clinical trial, ethical concerns, breakthrough, practical applications, in the long run…",
          "Mỗi đoạn tối đa 2 từ nối đầu câu; có ít nhất 3 lần this / these / such + danh từ trong cả bài.",
        ],
      },
      {
        t: "essay",
        id: "t3d10-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm — biến thể A, chỉ thảo luận) Some people say that children should start learning science at primary school. Others think it is better to wait until secondary school. Discuss both views. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đề KHÔNG đòi ý kiến ⇒ mở bài: This essay will examine the arguments on both sides.",
          "Hai thân bài vẫn phải cân đối; câu cuối mỗi đoạn có thể là hệ quả thay vì đánh giá.",
          "Kết bài: tóm tắt hai phía; được thêm một câu nhận định ngắn, không bắt buộc.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t3d10-noi",
    kind: "speaking",
    title: "Nói Part 3: “Do you agree that…?” — đồng ý một phần + ngữ điệu nhượng bộ",
    goal: "Trả lời câu hỏi Part 3 dạng “Do you agree that…?” / “Some people say…. Do you agree?” trong 5–7 câu ở mức band 6: mở bằng đúng mức đồng ý, nêu phần đồng ý + lý do, chuyển sang phần không đồng ý bằng một cụm nhượng bộ, phát triển bằng một trong 4 cách (kể cả viễn cảnh ngược lại “If… don't…”), chốt lại — với ngữ điệu xuống–lên ở phần nhượng bộ.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Ôn từ **Tập 2 Ngày 17**: thang đồng ý / phản đối 5 mức (I totally agree → I don't agree at all). Hôm nay nâng lên band 6 và tập trung vào mức ở giữa — ==đồng ý một phần== (partial agreement).",
          "Vì sao “đồng ý một phần” ăn điểm: nó **bắt bạn nói dài** (hai phía = gấp đôi nội dung → Fluency), **bắt dùng câu phức** nhượng bộ (although, while, having said that → GRA) và cho thấy bạn nghĩ có mức độ (→ đúng yêu cầu Part 3).",
          "Khung 4 bước: ==Mức độ → phần đồng ý + lý do → nhượng bộ + phần không đồng ý → chốt==.",
          "**4 cách phát triển** một ý để không cụt sau hai câu: lý do → hệ quả · ví dụ cụ thể · so sánh / đối lập · ==viễn cảnh ngược lại== (If people don't…, they will…).",
          "Nghe và so **một câu trả lời band 5 với band 6** cho cùng câu hỏi (chủ đề khoa học – vũ trụ, dùng từ vựng bài 1).",
          "🔊 **Ngữ điệu nhượng bộ**: giọng xuống rồi lên (↘↗) ở phần “đồng ý nhưng…”, xuống hẳn (↘) ở ý chính của bạn.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Câu hỏi “Do you agree…?” trong Part 3 và ba cách trả lời hỏng" },
      {
        t: "p",
        text: "Part 3 kéo dài 4–5 phút, giám khảo hỏi 4–6 câu trừu tượng nối từ chủ đề Part 2. Một dạng rất hay gặp là đưa ra **một nhận định** rồi hỏi bạn có đồng ý không. Dạng này có nhiều vỏ ngoài:",
      },
      {
        t: "table",
        head: ["Vỏ câu hỏi", "Ví dụ"],
        rows: [
          ["Do you agree that…?", "Do you agree that governments should spend money on space exploration?"],
          ["Some people say / think…. Do you agree? / What do you think?", "Some people say scientists should be free to research anything they want. Do you agree?"],
          ["Do you think it's true that…?", "Do you think it's true that young people today are less interested in science?"],
          ["Would you say that…?", "Would you say that technology has made people lazier?"],
          ["Is it fair to say that…?", "Is it fair to say that science has done more good than harm?"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba cách trả lời làm bạn kẹt ở band 5",
        cols: [
          { title: "① Yes rồi im", items: ["“Yes, I agree. I think it is very important.”", "Hai câu, không lý do ⇒ giám khảo phải hỏi “Why?” — Fluency thấp"] },
          { title: "② Đồng ý 100 % với mọi câu", items: ["Câu nào cũng “I totally agree”", "Không có nhượng bộ ⇒ không có câu phức ⇒ GRA dừng ở câu đơn"] },
          { title: "③ “Vừa có vừa không” mà không tách ra", items: ["“It is important but also not important.”", "Người nghe không hiểu bạn đồng ý phần NÀO, không đồng ý phần NÀO"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Thang đồng ý 5 mức — bản band 6" },
      {
        t: "table",
        caption: "So với Tập 2 Ngày 17: thêm các cụm tự nhiên hơn. Chọn MỘT cụm mỗi mức mà bạn nói trôi nhất và dùng thuần thục.",
        head: ["Mức", "Cụm mở đầu", "Nói tiếp gì"],
        rows: [
          ["① Hoàn toàn đồng ý", "Absolutely. · I couldn't agree more. · Definitely — I think…", "Lý do mạnh nhất + ví dụ. Vẫn nên thêm một câu “the only thing I'd add is…”"],
          ["② Phần lớn đồng ý", "On the whole, yes. · By and large, I'd agree. · I tend to agree with that.", "Lý do → một ngoại lệ nhỏ (although / except when…)"],
          ["③ **Đồng ý một phần**", "**I agree up to a point.** · **To some extent, yes.** · That's partly true. · Yes and no.", "Phần đồng ý + lý do → **Having said that / but** phần không đồng ý → chốt"],
          ["④ Phần lớn không đồng ý", "I'm not so sure about that. · I'm not entirely convinced. · Not really, to be honest.", "Vì sao nghi ngờ → thừa nhận một điểm đúng (I can see why people say that…)"],
          ["⑤ Hoàn toàn không đồng ý", "I'm afraid I disagree. · I don't think that's true at all.", "Lý do + ví dụ ngược lại. Giữ lịch sự: I'm afraid / to be honest"],
        ],
      },
      {
        t: "note",
        title: "Người Việt hay sai với agree",
        items: [
          "~~I am agree~~ / ~~I'm not agree~~ → **I agree** / **I don't agree**. agree là **động từ**, không phải tính từ.",
          "~~I agree with that governments should…~~ → **I agree that** governments should… (agree that + mệnh đề) hoặc **I agree with** that idea / with you (agree with + danh từ). Ngày 9 đã học: agree **with** + người / ý kiến, agree **to** + đề nghị.",
          "~~I agree a half~~ → **I partly agree** / **I agree up to a point** / **I agree to some extent**.",
          "~~Yes, I think so too~~ khi không ai vừa nêu ý kiến của họ — giám khảo chỉ hỏi, không nêu ý. Dùng **Yes, I'd agree with that**.",
          "Đừng mở mọi câu bằng **In my opinion**. Đổi: I'd say… · As I see it… · Personally, I feel… · From my point of view…",
        ],
      },
      { t: "rule", formula: "I agree up to a point. / To some extent, yes. / I tend to agree. / I'm not entirely convinced. + because…", vi: "Mở bằng MỨC ĐỘ đồng ý, không mở bằng Yes / No trần." },

      /* ── 3 ── */
      { t: "h", text: "3. Khung “đồng ý một phần” — 4 bước" },
      {
        t: "sodo",
        kind: "flow",
        title: "Đồng ý một phần — 4 bước, 5–7 câu, 30–40 giây",
        caption: "Bước 3 là nơi ngữ pháp band 6 xuất hiện: câu nhượng bộ.",
        steps: [
          { label: "1. Mức độ", sub: "I agree up to a point. / To some extent, yes." },
          { label: "2. Phần ĐỒNG Ý + lý do", sub: "I think… is justified, because… — for instance, …" },
          { label: "3. Nhượng bộ → phần KHÔNG đồng ý", sub: "Having said that, / But I don't think… / … though." },
          { label: "4. Chốt", sub: "So overall, / So I'd say… but only if / as long as…" },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "I agree up to a point. I think + S + V, because + S + V.",
            vi: "Bước 1–2: nêu mức độ rồi nói ngay bạn đồng ý với PHẦN NÀO.",
            examples: [
              { en: "I agree up to a point. I think some spending on space is justified, because it has given us really useful technology.", vi: "Tôi đồng ý ở một mức nào đó. Tôi nghĩ chi một phần cho vũ trụ là chính đáng, vì nó đã cho ta công nghệ rất hữu ích." },
            ],
          },
          {
            formula: "Having said that, / That said, / At the same time, + S + V",
            vi: "Bước 3 — cụm chuyển hướng đặt ở ĐẦU câu mới (văn nói tự nhiên). Sau cụm có một nhịp ngắt ngắn.",
            examples: [
              { en: "Having said that, I don't think it should be a priority in every country.", vi: "Nói vậy chứ, tôi không cho rằng nó nên là ưu tiên ở mọi nước." },
            ],
          },
          {
            formula: "Although / Even though + S + V, S + V · S + V, though.",
            vi: "Bước 3 — gói nhượng bộ vào MỘT câu phức. Văn nói rất hay đặt though ở CUỐI câu.",
            examples: [
              { en: "Although it's expensive, I think it's worth it in the long run.", vi: "Dù tốn kém, tôi nghĩ về lâu dài nó xứng đáng." },
              { en: "It's very expensive, though.", vi: "Nhưng mà nó rất tốn kém." },
            ],
          },
          {
            formula: "I can see why people say that, but + S + V · It's true that + S + V, but + S + V",
            vi: "Thừa nhận điểm đúng của nhận định trước khi phản đối — lịch sự và có mức độ.",
            examples: [
              { en: "It's true that satellites are useful, but sending people to Mars is a different matter.", vi: "Đúng là vệ tinh hữu ích, nhưng đưa người lên sao Hoả là chuyện khác." },
            ],
          },
          {
            formula: "So overall, / So I'd say + S + V, but only if / as long as + S + V",
            vi: "Bước 4 — chốt bằng một ĐIỀU KIỆN: đồng ý nếu / miễn là…",
            examples: [
              { en: "So overall, yes, I'd support it, but only on a modest scale.", vi: "Nên nhìn chung thì có, tôi ủng hộ, nhưng chỉ ở quy mô vừa phải." },
              { en: "So I'd say it's fine as long as basic needs are covered first.", vi: "Nên tôi cho là ổn, miễn là nhu cầu cơ bản được lo trước." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "Cẩn thận với cụm nhượng bộ",
        items: [
          "~~Although it's expensive, but it's worth it.~~ → bỏ **but** (tiếng Việt “mặc dù… nhưng…”, tiếng Anh chỉ một trong hai). Lỗi này đã nhắc ở Tập 2 — ở band 6 không được còn.",
          "**Having said that** / **That said** đứng đầu câu MỚI, sau dấu chấm. Không nối hai mệnh đề bằng nó như although.",
          "**though** cuối câu là kiểu **văn nói** thân mật — rất hợp Speaking; trong bài viết học thuật nên dùng although / however.",
          "**On the other hand** phải có hai mặt đối lập thật. Đừng dùng nó để thêm một lý do cùng chiều.",
          "Đừng nhượng bộ hai lần ngược nhau (đồng ý → nhưng → nhưng mà → tuy nhiên). Một lần chuyển hướng, rồi chốt.",
        ],
      },
      { t: "rule", formula: "Mức độ → I think + phần đồng ý, because… → Having said that, + phần không đồng ý → So overall, … but only if / as long as…", vi: "Đồng ý một phần = nói rõ đồng ý PHẦN NÀO, không đồng ý PHẦN NÀO, rồi chốt bằng một điều kiện." },
      {
        t: "quiz",
        id: "t3d10-noi-nhuong-bo-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu đồng ý một phần (5 câu)",
        grammar: "I agree up to a point · Having said that, … · Although…, … · It's true that…, but… · as long as…",
        items: [
          { q: "Tôi đồng ý ở một mức độ nào đó.", answers: ["I agree up to a point.", "I agree to some extent.", "I agree to a certain extent.", "To some extent, I agree."], hint: "up to a point / to some extent" },
          { q: "Nói vậy chứ, tôi không nghĩ nó nên là một ưu tiên.", answers: ["Having said that, I don't think it should be a priority.", "That said, I don't think it should be a priority.", "Having said that, I do not think it should be a priority."], hint: "Having said that, · a priority" },
          { q: "Mặc dù nó tốn kém, tôi nghĩ nó xứng đáng.", answers: ["Although it's expensive, I think it's worth it.", "Although it is expensive, I think it is worth it.", "Even though it's expensive, I think it's worth it.", "Although it's costly, I think it's worth it.", "Although it is expensive, I think it's worth it."], hint: "Although (không but) · worth it" },
          { q: "Đúng là vệ tinh hữu ích, nhưng chúng rất đắt.", answers: ["It's true that satellites are useful, but they are very expensive.", "It is true that satellites are useful, but they are very expensive.", "It's true that satellites are useful, but they're very expensive."], hint: "It's true that…, but…" },
          { q: "Tôi cho là ổn, miễn là các nhu cầu cơ bản được lo trước.", answers: ["I'd say it's fine as long as basic needs are covered first.", "I would say it's fine as long as basic needs are covered first.", "I'd say it's fine as long as basic needs are met first.", "I would say it is fine as long as basic needs are covered first.", "I think it's fine as long as basic needs are covered first."], hint: "I'd say · as long as · basic needs are covered" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bốn cách phát triển một ý — để không cụt sau hai câu" },
      {
        t: "p",
        text: "Sau khi nêu lý do, band 5 thường hết ý. Band 6 biết **kéo dài một ý** thêm 2–3 câu. Có bốn hướng — bạn chỉ cần chọn một cho mỗi phần của câu trả lời. Ví dụ cho câu hỏi: **Do you agree that children should learn science from an early age?**",
      },
      {
        t: "table",
        head: ["Cách", "Câu nối", "Ví dụ"],
        rows: [
          ["① **Lý do → hệ quả**", "…, which means (that)… · As a result, … · That's why…", "Young children are naturally curious, **which means** they enjoy asking why things happen. **That's why** simple experiments work so well at that age."],
          ["② **Ví dụ cụ thể**", "For instance, … · Take… for example. · In my country, …", "**Take** my nephew, **for example**. He grew a bean plant in a glass at school and talked about it for weeks."],
          ["③ **So sánh / đối lập**", "…, whereas… · Compared with… · Unlike…", "Children who start early see science as fun, **whereas** teenagers who meet it for the first time at fourteen often find it frightening."],
          ["④ **Viễn cảnh ngược lại**", "If + S + don't / doesn't + V, S + will / may + V · Otherwise, … · Without + N, …", "**If children don't** get the chance to do experiments when they're young, **they'll** probably see science as just a list of facts to memorise."],
        ],
      },
      {
        t: "p",
        text: "**Viễn cảnh ngược lại** là cách ít người dùng nhất và hiệu quả nhất: bạn chứng minh một việc quan trọng bằng cách tả **điều gì xảy ra nếu KHÔNG có nó**. Về ngữ pháp, đó là câu điều kiện loại 1 ở dạng phủ định (Tập 2 Ngày 13). Khi tình huống khó xảy ra, dùng loại 2: **If governments stopped funding research, we would…** — Ngày 15 học kỹ.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + don't / doesn't + V, S + will / may / won't + V",
            vi: "Nếu KHÔNG làm X thì hệ quả xấu Y sẽ / có thể xảy ra (khả năng có thật).",
            examples: [
              { en: "If governments don't invest in research, the country will fall behind.", vi: "Nếu chính phủ không đầu tư vào nghiên cứu, đất nước sẽ tụt lại." },
              { en: "If scientists don't follow any rules, the public may stop trusting them.", vi: "Nếu nhà khoa học không theo quy tắc nào, công chúng có thể thôi tin họ." },
            ],
          },
          {
            formula: "Without + N, S + would / wouldn't + V · Otherwise, S + will + V",
            vi: "Hai cách nói gọn hơn: Without… (không có…) và Otherwise (nếu không thì).",
            examples: [
              { en: "Without satellites, we wouldn't have accurate weather forecasts.", vi: "Không có vệ tinh, ta sẽ không có dự báo thời tiết chính xác." },
              { en: "There have to be limits. Otherwise, people will lose confidence in science.", vi: "Phải có giới hạn. Nếu không, người ta sẽ mất niềm tin vào khoa học." },
            ],
          },
        ],
      },
      { t: "rule", formula: "…, which means… · Take N, for example. · …, whereas… · If + S + don't + V, S + will + V", vi: "Mỗi ý chọn MỘT cách phát triển: hệ quả · ví dụ · đối lập · viễn cảnh ngược lại." },

      /* ── 5 ── */
      { t: "h", text: "5. Nghe và so: band 5 và band 6 cho cùng một câu hỏi" },
      {
        t: "p",
        text: "Câu hỏi: **Do you agree that governments should spend money on space exploration?** Bấm nghe từng câu trả lời, rồi đọc bảng so sánh. Band ghi là **ước tính** để học.",
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 5 (ước tính) — khoảng 15 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you agree that governments should spend money on space exploration?", vi: "Bạn có đồng ý rằng chính phủ nên chi tiền cho khám phá vũ trụ không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I agree. I think space exploration is very important. Because it can help us know more about space. And the government have a lot of money, so they can spend for it. But some people is poor, so... yes, it is important but also not important. That's all.", vi: "Vâng, tôi đồng ý. Tôi nghĩ khám phá vũ trụ rất quan trọng. Vì nó giúp ta biết thêm về vũ trụ. Và chính phủ có nhiều tiền nên họ có thể chi cho nó. Nhưng một số người nghèo, nên… vâng, nó quan trọng nhưng cũng không quan trọng. Hết ạ." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 35 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you agree that governments should spend money on space exploration?", vi: "Bạn có đồng ý rằng chính phủ nên chi tiền cho khám phá vũ trụ không?" },
          { who: "Candidate", role: "candidate", text: "I agree up to a point. I think some spending is justified, because space research has given us really useful things — satellites, for instance, which we rely on for weather forecasts and navigation.", vi: "Tôi đồng ý ở một mức nào đó. Tôi nghĩ chi một phần là chính đáng, vì nghiên cứu vũ trụ đã cho ta những thứ rất hữu ích — vệ tinh chẳng hạn, thứ ta dựa vào để dự báo thời tiết và định vị." },
          { who: "Candidate", role: "candidate", text: "Having said that, I don't think it should be a priority in every country. In a developing country like mine, hospitals and schools are short of money, so if the government spent billions on a Mars mission, people would be quite angry.", vi: "Nói vậy chứ, tôi không nghĩ nó nên là ưu tiên ở mọi nước. Ở một nước đang phát triển như nước tôi, bệnh viện và trường học đang thiếu tiền, nên nếu chính phủ chi hàng tỉ cho một sứ mệnh sao Hoả, người dân sẽ khá tức giận." },
          { who: "Candidate", role: "candidate", text: "So overall, yes, I'd support it, but only on a modest scale.", vi: "Nên nhìn chung thì có, tôi ủng hộ, nhưng chỉ ở quy mô vừa phải." },
        ],
      },
      {
        t: "table",
        caption: "So theo 4 tiêu chí Speaking: FC (Fluency & Coherence) · LR (Lexical Resource) · GRA (Grammar) · P (Pronunciation).",
        head: ["Tiêu chí", "Band 5", "Band 6", "Bạn làm gì để chuyển"],
        rows: [
          ["**FC**", "5 câu ngắn, dừng ở “That's all”. Mâu thuẫn: important but also not important. Nối bằng Because / And / But ở đầu câu.", "Đủ 4 bước, khoảng 35 giây, có mạch: mức độ → đồng ý → Having said that → So overall. Người nghe luôn biết bạn đang ở đâu.", "Thuộc khung 4 bước. Không nói “That's all” — kết bằng câu chốt."],
          ["**LR**", "very important · a lot of money · know more about space.", "justified · rely on · a priority · short of money · a Mars mission · on a modest scale.", "Mỗi câu trả lời cài 2–3 cụm của chủ đề (bài 1) + 1 cụm giới từ (Ngày 9)."],
          ["**GRA**", "Câu đơn. Lỗi: the government have · spend for it · some people is.", "because… · which we rely on… · if the government spent…, people would… · câu phức đúng.", "Mỗi câu trả lời có ít nhất MỘT câu nhượng bộ hoặc điều kiện."],
          ["**P**", "Đều đều, mỗi từ một nhịp; không có lên xuống báo ý.", "Xuống–lên ở “up to a point” và “Having said that”; xuống hẳn ở “modest scale”.", "Luyện mục 7 hôm nay."],
        ],
      },
      {
        t: "p",
        text: "Thêm một mẫu band 6 cho mức **④ phần lớn không đồng ý**, dùng cách phát triển **viễn cảnh ngược lại**:",
      },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — “Some people say scientists should be free to research anything they want. Do you agree?”",
        lines: [
          { who: "Examiner", role: "examiner", text: "Some people say scientists should be free to research anything they want. Do you agree?", vi: "Một số người nói nhà khoa học nên được tự do nghiên cứu bất cứ điều gì họ muốn. Bạn có đồng ý không?" },
          { who: "Candidate", role: "candidate", text: "Not entirely, to be honest. I can see why people say that, because a lot of breakthroughs came from research that seemed useless at first.", vi: "Thật lòng thì không hoàn toàn. Tôi hiểu vì sao người ta nói vậy, vì nhiều bước đột phá đến từ những nghiên cứu ban đầu tưởng như vô ích." },
          { who: "Candidate", role: "candidate", text: "But I think there have to be limits when the work raises ethical concerns — genetic engineering on humans, for example. If scientists don't follow any rules, the public will stop trusting science altogether.", vi: "Nhưng tôi nghĩ phải có giới hạn khi công việc đó làm dấy lên lo ngại về đạo đức — kỹ thuật di truyền trên người chẳng hạn. Nếu nhà khoa học không theo quy tắc nào, công chúng sẽ thôi tin khoa học hoàn toàn." },
          { who: "Candidate", role: "candidate", text: "So I'd say they should be free to choose their topic, but not always their methods.", vi: "Nên tôi cho rằng họ nên được tự do chọn đề tài, nhưng không phải lúc nào cũng được tự do chọn phương pháp." },
        ],
      },
      {
        t: "note",
        title: "Vì sao câu trả lời thứ ba ở band 6",
        items: [
          "Mở bằng mức độ **Not entirely** — không phải Yes / No trần.",
          "Thừa nhận trước (**I can see why people say that, because…**) rồi mới phản đối ⇒ có mức độ.",
          "Phát triển bằng **ví dụ** (genetic engineering on humans) + **viễn cảnh ngược lại** (If scientists don't follow any rules, the public will…).",
          "Chốt bằng một **phân biệt rõ**: tự do chọn đề tài ≠ tự do chọn phương pháp — đây chính là “đếm vế” của nhận định (anything they want).",
          "Từ vựng bài 1: breakthroughs · raises ethical concerns · genetic engineering.",
        ],
      },
      {
        t: "mcq",
        id: "t3d10-noi-chon",
        title: "Kiểm tra — đồng ý một phần (6 câu)",
        items: [
          { q: "1. Câu nào ĐÚNG ngữ pháp?", options: ["I am agree with you.", "I agree that science is important.", "I agree with that science is important.", "I'm not agree."], correct: 1, why: "agree là động từ: I agree. agree that + mệnh đề; agree with + danh từ / người." },
          { q: "2. Cụm nào báo “đồng ý một phần”?", options: ["I couldn't agree more.", "I'm afraid I disagree.", "Absolutely.", "I agree up to a point."], correct: 3, why: "up to a point = tới một mức nào đó. I couldn't agree more / Absolutely = hoàn toàn đồng ý." },
          { q: "3. Chọn câu nối đúng: “It's useful. ___, it's extremely expensive.”", options: ["Having said that", "Although", "Because", "For instance"], correct: 0, why: "Having said that đứng đầu câu MỚI để chuyển hướng. Although phải nối hai mệnh đề trong MỘT câu." },
          { q: "4. Câu nào là “viễn cảnh ngược lại”?", options: ["For example, my brother studies physics.", "Science is more popular than art.", "If schools don't teach science well, fewer students will become engineers.", "I agree to some extent."], correct: 2, why: "If + S + don't + V, S + will + V: tả hệ quả khi KHÔNG làm điều đó." },
          { q: "5. Câu chốt nào tốt nhất cho một câu trả lời đồng ý một phần?", options: ["That's all.", "So I'd say it's a good idea, as long as it doesn't take money away from healthcare.", "So it is good and also bad.", "I don't know what else to say."], correct: 1, why: "Chốt bằng một điều kiện rõ (as long as…). “good and also bad” không cho biết lập trường." },
          { q: "6. “Although it is risky, ___ I think it is necessary.” Chỗ trống điền gì?", options: ["but", "however", "so", "(không điền gì)"], correct: 3, why: "Đã có Although thì KHÔNG thêm but / however. Although it is risky, I think it is necessary." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bảng cụm theo chức năng — chép vào Sổ Speaking" },
      {
        t: "table",
        caption: "Sổ Speaking riêng (bắt đầu từ Ngày 2): chép bảng này, mỗi ô chọn MỘT cụm để luyện tuần này.",
        head: ["Chức năng", "Cụm band 6"],
        rows: [
          ["Mở — đồng ý một phần", "I agree up to a point. · To some extent, yes. · That's partly true. · Yes and no, really."],
          ["Nêu phần đồng ý", "I think… is justified, because… · There's no doubt that… · It's certainly true that…"],
          ["Thừa nhận điểm của người khác", "I can see why people say that. · I take the point that… · Admittedly, …"],
          ["Chuyển hướng (nhượng bộ)", "Having said that, … · That said, … · At the same time, … · … though."],
          ["Nêu phần không đồng ý", "I don't think it should… · I'm not convinced that… · The problem is that…"],
          ["Phát triển", "…, which means… · Take…, for example. · …, whereas… · If… don't…, … will…"],
          ["Chốt có điều kiện", "So overall, … but only if… · So I'd say… as long as… · On balance, I think…"],
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: ngữ điệu nhượng bộ (↘↗ rồi ↘)" },
      {
        t: "p",
        text: "**Ngữ điệu** (intonation) là đường lên xuống của giọng. Tiếng Anh dùng ngữ điệu để báo **“tôi chưa nói xong, còn chữ but phía sau”**: giọng **xuống rồi lên lại** (fall-rise, ký hiệu ↘↗) ở từ cuối của phần nhượng bộ. Khi tới ý chính của mình, giọng **xuống hẳn** (fall, ↘) để báo “đây là điều tôi muốn nói, tôi nói xong rồi”. Người Việt thường nói cả hai phần **đều đều** hoặc xuống giọng ngay ở “I agree” — người nghe tưởng bạn đồng ý hoàn toàn rồi mới ngỡ ngàng vì chữ but.",
      },
      {
        t: "table",
        head: ["Phần của câu", "Ngữ điệu", "Ví dụ (từ in đậm = chỗ đổi giọng)"],
        rows: [
          ["Cụm mức độ", "↘↗ xuống rồi lên ở từ cuối", "I agree up to a ↘↗**point**… · To some ↘↗**extent**…"],
          ["Phần nhượng bộ (Although…, It's true that…)", "↘↗ ở từ nội dung cuối, rồi ngắt ngắn", "Although it's ↘↗**expensive**, | … · It's true that it's ↘↗**useful**, | …"],
          ["Cụm chuyển hướng", "↘↗ + ngắt", "Having said ↘↗**that**, | … · That ↘↗**said**, | …"],
          ["Ý chính của bạn", "↘ xuống hẳn ở từ nội dung cuối", "…I think it's ↘**worth** it. · …we need clear ↘**rules**."],
        ],
      },
      {
        t: "note",
        title: "Mẹo luyện ngữ điệu nhượng bộ",
        items: [
          "Tập riêng chữ **well** theo kiểu “ừ thì…” (giọng xuống rồi lên): we-e-ll↘↗. Đó chính là đường giọng cần đặt lên point / extent / that.",
          "Sau phần ↘↗ luôn có **một nhịp ngắt ngắn** — đừng nói liền sang ý chính.",
          "Ghi âm câu “I agree up to a point, but I think it's too expensive” hai lần: một lần đều đều, một lần ↘↗ … ↘. Nghe lại — bản thứ hai nghe “có suy nghĩ” hơn hẳn.",
          "Máy chấm phát âm bên dưới chấm **độ đúng của từng âm**; ngữ điệu thì bạn tự nghe lại bản ghi và so với giọng mẫu. Ngày 23 luyện tiếp ngữ điệu đối lập.",
        ],
      },
      { t: "rule", formula: "Phần nhượng bộ ↘↗ (xuống–lên) + ngắt · ý chính ↘ (xuống hẳn)", vi: "Giọng chưa xuống hẳn = “tôi còn chữ but”. Giọng xuống hẳn = “đây là ý của tôi”." },
      {
        t: "phatam",
        id: "t3d10-phat-am",
        title: "Luyện phát âm — câu nhượng bộ (↘↗ rồi ↘)",
        note: "Đọc phần trước dấu phẩy với giọng xuống–lên ở từ cuối, ngắt ngắn, rồi xuống hẳn ở cuối câu. Máy chấm từng âm; ngữ điệu tự nghe lại.",
        items: [
          { text: "I agree to some extent.", ipa: "aɪ əɡriː tə sʌm ɪkstent", vi: "Tôi đồng ý ở một mức độ nào đó. (↘↗ ở extent — nghe như còn nói tiếp)" },
          { text: "That's true up to a point.", ipa: "ðæts truː ʌp tə ə pɔɪnt", vi: "Điều đó đúng tới một mức nào đó. (↘↗ ở point)" },
          { text: "It may be expensive, but it is worth it.", ipa: "ɪt meɪ bi ɪkspensɪv bət ɪt ɪz wɜːθ ɪt", vi: "Có thể tốn kém, nhưng nó xứng đáng. (↘↗ expensive · ↘ worth)" },
          { text: "I see your point, but I disagree.", ipa: "aɪ siː jɔː pɔɪnt bət aɪ dɪsəɡriː", vi: "Tôi hiểu ý bạn, nhưng tôi không đồng ý. (↘↗ point · ↘ disagree)" },
          { text: "Science is useful, though it can be risky.", ipa: "saɪəns ɪz juːsfl ðəʊ ɪt kən bi rɪski", vi: "Khoa học hữu ích, dù nó có thể rủi ro. (↘↗ useful · ↘ risky)" },
          { text: "Having said that, we need clear rules.", ipa: "hævɪŋ sed ðæt wi niːd klɪə ruːlz", vi: "Nói vậy chứ, ta cần quy tắc rõ ràng. (↘↗ that · ↘ rules)" },
          { text: "On the whole, I think it depends.", ipa: "ɒn ðə həʊl aɪ θɪŋk ɪt dɪpendz", vi: "Nhìn chung, tôi nghĩ còn tuỳ. (↘↗ whole · ↘ depends)" },
          { text: "Although it is costly, the benefits are huge.", ipa: "ɔːlðəʊ ɪt ɪz kɒstli ðə benɪfɪts ə hjuːdʒ", vi: "Dù tốn kém, lợi ích rất lớn. (↘↗ costly · ↘ huge)" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói Part 3 — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu trả lời **5–7 câu, 30–40 giây**, theo khung 4 bước. Trước khi bấm ghi, quyết định **mức đồng ý** (①–⑤) và **một cách phát triển**. Ít nhất 3 trong 5 câu hãy trả lời ở mức ③ hoặc ④. Nghe lại bản ghi: có cụm mức độ mở đầu không? có đúng một lần chuyển hướng không? có câu chốt không?",
      },
      {
        t: "speak",
        id: "t3d10-noi-p3-khoa-hoc",
        part: "3",
        questions: [
          "Do you agree that governments should spend money on space exploration?",
          "Some people say that science has done more harm than good. Do you agree?",
          "Do you agree that children should learn science from an early age?",
          "Some people think scientists should be free to research anything they want. What do you think?",
          "Would you say that private companies are better at developing new technology than governments?",
        ],
      },
      {
        t: "speak",
        id: "t3d10-noi-p3-xa-hoi",
        part: "3",
        questions: [
          "Do you agree that technology has made people's lives easier?",
          "Some people say that university education should be free for everyone. Do you agree?",
          "Do you think it's true that young people today are less patient than their parents were?",
          "Is it fair to say that money is the most important factor when people choose a job?",
          "Do you agree that people learn more from failure than from success?",
        ],
      },
      {
        t: "note",
        title: "Mẹo — đóng vai giám khảo với chính mình (Sổ Speaking)",
        items: [
          "Sau khi ghi âm, chép **một** câu trả lời tốt nhất vào Sổ Speaking. Hôm sau che đi, tự hỏi lại đúng câu đó và trả lời **ở mức đồng ý khác** (hôm nay ③ thì mai thử ④).",
          "Tự hỏi tiếp một câu “Why?” hoặc “Can you give an example?” sau câu trả lời của mình — giám khảo thật sẽ làm vậy.",
          "Dạng “Do you agree…?” gặp lại ở Ngày 14 (ưu – nhược), Ngày 19 (thuật lại ý người khác) và Ngày 23 (đánh giá “Is it a good thing that…?”).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 10 ═══════════════════════════ */
  {
    id: "t3d10-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 10",
    goal: "Ôn trọn Ngày 10: dùng đúng từ và collocation chủ đề khoa học – vũ trụ, nhận biến thể đề Discussion và luận điểm cân bằng, nối câu bằng từ quy chiếu, dựng câu khung thân bài, chọn đúng cụm đồng ý một phần, rồi viết một thân bài và nói hai câu trả lời Part 3.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (42 câu + 1 đoạn viết + 1 lượt nói)",
        items: [
          "**I.** Điền từ theo nghĩa — 8 câu · **II.** Collocation — 8 câu · **III.** Dịch Việt → Anh — 6 câu.",
          "**IV.** Đề Discussion: biến thể, luận điểm, thân bài — 6 câu · **V.** Từ quy chiếu — 5 câu.",
          "**VI.** Ghép câu khung — 4 câu · **VII.** Part 3: đồng ý một phần — 5 câu.",
          "**VIII.** Viết một thân bài 80–95 từ · **IX.** Nói 2 câu Part 3.",
          "Làm xong mới xem đáp án. Sai ≥ 3 câu ở phần nào thì mở lại đúng mục của bài đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 10 trước khi làm bài",
        center: "Ngày 10",
        branches: [
          { label: "Từ vựng", items: ["conduct research into", "carry out an experiment", "allocate funding to", "a waste of public money"] },
          { label: "Viết", items: ["3 biến thể đề", "Luận điểm ở 3 chỗ", "2 thân bài 80–95 từ", "this / such + N"] },
          { label: "Nói", items: ["I agree up to a point", "Having said that, …", "If… don't…, … will…", "↘↗ rồi ↘"] },
        ],
      },

      { t: "h", text: "I. Điền từ theo nghĩa (8 câu) — ôn bài Từ vựng mục 1–3" },
      {
        t: "quiz",
        id: "t3d10-bt-tu",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ cái đầu đã cho)",
        items: [
          { q: "1. The scientists formed a h___ and then designed an experiment to test it. (giả thuyết)", answers: ["hypothesis"] },
          { q: "2. The study was based on a s___ of 2,000 adults. (mẫu)", answers: ["sample"] },
          { q: "3. The f___ of the study were published last month. (kết quả nghiên cứu)", answers: ["findings"] },
          { q: "4. The discovery was a major b___ in cancer treatment. (bước đột phá)", answers: ["breakthrough"] },
          { q: "5. Many university projects rely on government f___. (kinh phí)", answers: ["funding"] },
          { q: "6. The country plans to l___ its first satellite next year. (phóng)", answers: ["launch"] },
          { q: "7. The space station is in o___ about 400 kilometres above the Earth. (quỹ đạo)", answers: ["orbit"] },
          { q: "8. Cloning animals raises serious e___ questions. (thuộc đạo đức)", answers: ["ethical"] },
        ],
      },

      { t: "h", text: "II. Collocation (8 câu) — ôn bài Từ vựng mục 4–5" },
      {
        t: "mcq",
        id: "t3d10-bt-colloc",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "1. The university is ___ research into the effects of social media on sleep.", options: ["making", "conducting", "taking", "giving"], correct: 1, why: "conduct / do / carry out research. ~~make research~~." },
          { q: "2. There is ___ that regular exercise improves memory.", options: ["an evidence", "evidences", "a strong evidences", "strong evidence"], correct: 3, why: "evidence không đếm được: không a / an, không -s." },
          { q: "3. It is too early to ___ a conclusion.", options: ["reach", "make", "do", "give"], correct: 0, why: "reach / draw / come to a conclusion." },
          { q: "4. The Wright brothers ___ the first successful aeroplane.", options: ["discovered", "found", "invented", "explored"], correct: 2, why: "Tạo ra thứ chưa từng có ⇒ invent." },
          { q: "5. Space research has paved the way ___ modern communication systems.", options: ["to", "for", "of", "with"], correct: 1, why: "pave the way **for** + N." },
          { q: "6. This kind of research will ___ humanity for generations.", options: ["benefit", "benefit for", "benefit to", "be benefit"], correct: 0, why: "Động từ benefit + tân ngữ trực tiếp. (Danh từ: be of benefit **to**.)" },
          { q: "7. Critics see the project as a waste ___ public money.", options: ["for", "in", "on", "of"], correct: 3, why: "a waste **of** time / money." },
          { q: "8. Several other ___ have reported similar results.", options: ["researches", "research", "studies", "study"], correct: 2, why: "Several + danh từ đếm được số nhiều ⇒ studies. research không có số nhiều." },
        ],
      },

      { t: "h", text: "III. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d10-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — dùng cụm gợi ý",
        grammar: "Collocation khoa học + khung Discussion + khung đồng ý một phần",
        items: [
          { q: "Các nhà nghiên cứu đã tiến hành một thí nghiệm trên 300 sinh viên.", answers: ["The researchers carried out an experiment on 300 students.", "Researchers carried out an experiment on 300 students.", "The researchers conducted an experiment on 300 students.", "Researchers conducted an experiment on 300 students."], hint: "carry out an experiment on" },
          { q: "Kết quả nghiên cứu cho thấy giấc ngủ cải thiện trí nhớ.", answers: ["The findings suggest that sleep improves memory.", "The findings show that sleep improves memory.", "The findings indicate that sleep improves memory."], hint: "The findings suggest that" },
          { q: "Những người phản đối khoản chi này tin rằng chính phủ có những trách nhiệm cấp bách hơn.", answers: ["Those who oppose this spending believe that governments have more urgent responsibilities.", "Those who oppose this spending believe that governments have more immediate responsibilities.", "Opponents of this spending believe that governments have more urgent responsibilities.", "Those who oppose this spending believe that the government has more urgent responsibilities."], hint: "Those who oppose · this spending · more urgent responsibilities" },
          { q: "Vì những lý do này, khám phá vũ trụ không thể đơn giản bị coi là lãng phí tiền bạc.", answers: ["For these reasons, space exploration cannot simply be described as a waste of money.", "For these reasons, space exploration cannot simply be regarded as a waste of money.", "For these reasons, space exploration cannot simply be seen as a waste of money.", "For these reasons, space exploration cannot simply be considered a waste of money."], hint: "For these reasons · cannot simply be described as · a waste of money" },
          { q: "Tôi đồng ý ở một mức độ nào đó, nhưng tôi không nghĩ nó nên là một ưu tiên.", answers: ["I agree up to a point, but I don't think it should be a priority.", "I agree to some extent, but I don't think it should be a priority.", "I agree up to a point, but I do not think it should be a priority."], hint: "up to a point · a priority" },
          { q: "Nếu chính phủ không đầu tư vào nghiên cứu, đất nước sẽ tụt lại phía sau.", answers: ["If the government doesn't invest in research, the country will fall behind.", "If the government does not invest in research, the country will fall behind.", "If governments don't invest in research, the country will fall behind.", "If governments do not invest in research, the country will fall behind."], hint: "If… doesn't invest in…, … will fall behind" },
        ],
      },

      { t: "h", text: "IV. Đề Discussion: biến thể, luận điểm, thân bài (6 câu) — ôn bài Viết mục 2–4" },
      {
        t: "mcq",
        id: "t3d10-bt-de",
        title: "IV. Chọn đáp án đúng",
        items: [
          { q: "1. Đề: “Some people think robots will improve our lives. Others fear they will take our jobs. Discuss both views and give your own opinion.” Mở bài nào đạt yêu cầu band 6?", options: ["Nowadays robots are a hot topic. This essay will discuss both views.", "I think robots are very good for our lives.", "While some people welcome robots as a way to improve daily life, others worry about losing their jobs. In my view, the benefits are greater, provided that workers are retrained.", "Robots have advantages and disadvantages."], correct: 2, why: "Câu C nêu cả hai quan điểm trong một câu phức và có luận điểm rõ kèm điều kiện. A thiếu luận điểm; B bỏ một quan điểm; D lạc sang dạng ưu – nhược." },
          { q: "2. Thân bài 1 dài 110 từ, thân bài 2 dài 35 từ. Cách sửa tốt nhất?", options: ["Thêm hai từ nối vào thân bài 2.", "Bớt ý rời ở thân bài 1, thêm giải thích + hệ quả cho thân bài 2.", "Viết kết bài dài hơn.", "Không cần sửa."], correct: 1, why: "Cân đối = cùng độ sâu. Cắt ý trần ở đoạn dài, đào sâu đoạn ngắn. Từ nối không tạo ra nội dung." },
          { q: "3. Câu nào NÊN đứng cuối một thân bài thuật quan điểm mà bạn KHÔNG ủng hộ?", options: ["This is a stupid idea.", "I totally agree with this.", "In conclusion, I disagree.", "This view is understandable, but it overlooks the cost to taxpayers."], correct: 3, why: "Câu đánh giá: tôn trọng quan điểm + chỉ ra điểm yếu. A thiếu trang trọng; B mâu thuẫn lập trường; C là câu của kết bài." },
          { q: "4. Câu chủ đề nào thuật lại quan điểm của người khác đúng giọng học thuật?", options: ["Supporters of nuclear energy point out that it produces very little carbon.", "I think nuclear energy produces very little carbon.", "Everyone knows nuclear energy is clean.", "Nuclear energy is good."], correct: 0, why: "Supporters of X point out that… — trung lập, rõ là quan điểm của một nhóm. B là ý mình; C khái quát quá mức; D quá chung." },
          { q: "5. Mở bài: “I believe public transport should be free.” — Kết bài: “In conclusion, charging fares is the fairest system.” Vấn đề là gì?", options: ["Thiếu từ nối", "Kết bài quá ngắn", "Lập trường mâu thuẫn giữa mở bài và kết bài", "Không có vấn đề"], correct: 2, why: "Ý kiến phải nhất quán xuyên bài. Mâu thuẫn mở – kết là lỗi Task Response nặng." },
          { q: "6. Đề chỉ ghi “Discuss both views.” Bạn nên viết luận điểm thế nào?", options: ["This essay will examine the arguments on both sides.", "In my opinion, the first view is completely wrong.", "Không viết mở bài.", "I strongly believe the second view."], correct: 0, why: "Biến thể A: không bắt buộc ý kiến ⇒ câu định hướng trung lập là đủ." },
        ],
      },

      { t: "h", text: "V. Từ quy chiếu (5 câu) — ôn bài Viết mục 5" },
      {
        t: "quiz",
        id: "t3d10-bt-quy-chieu",
        kind: "fill",
        title: "V. Điền MỘT từ: this · these · such · latter · so · ones (mỗi từ có thể dùng hơn một lần)",
        items: [
          { q: "1. Some countries tax sugary drinks heavily. ___ approach has reduced consumption in several cities.", answers: ["This", "Such"] },
          { q: "2. Schools can teach coding or a foreign language. Many parents prefer the ___ because languages are useful for travel.", answers: ["latter"] },
          { q: "3. Cities are building more cycle lanes and bus routes. ___ measures should reduce traffic.", answers: ["These", "Such"] },
          { q: "4. Employers want staff to work from home two days a week. Doing ___ saves money on office space.", answers: ["so", "this"] },
          { q: "5. Electric cars are quieter than petrol ___.", answers: ["ones"] },
        ],
      },

      { t: "h", text: "VI. Ghép câu khung (4 câu) — ôn bài Viết mục 9, bài Nói mục 3" },
      {
        t: "build",
        id: "t3d10-bt-ghep",
        title: "VI. Bấm các mảnh theo đúng thứ tự để dựng câu",
        items: [
          { vi: "Theo quan điểm của tôi, các vấn đề trên Trái Đất đáng được ưu tiên.", chips: ["In my view,", "problems on Earth", "deserve", "priority.", "deserves", "According to me,"], answer: ["In my view,", "problems on Earth", "deserve", "priority."] },
          { vi: "Lập luận này đặc biệt mạnh ở các nước đang phát triển.", chips: ["This argument", "is", "particularly strong", "in developing countries.", "are", "on"], answer: ["This argument", "is", "particularly strong", "in developing countries."] },
          { vi: "Nói vậy chứ, tôi không nghĩ nó nên là một ưu tiên.", chips: ["Having said that,", "I don't think", "it should be", "a priority.", "Although", "but"], answer: ["Having said that,", "I don't think", "it should be", "a priority."] },
          { vi: "Mặc dù nó tốn kém, tôi nghĩ nó xứng đáng về lâu dài.", chips: ["Although", "it's expensive,", "I think", "it's worth it", "in the long run.", "but"], answer: ["Although", "it's expensive,", "I think", "it's worth it", "in the long run."] },
        ],
      },

      { t: "h", text: "VII. Part 3: đồng ý một phần (5 câu) — ôn bài Nói mục 2–4" },
      {
        t: "mcq",
        id: "t3d10-bt-noi",
        title: "VII. Chọn đáp án đúng",
        items: [
          { q: "1. Giám khảo: “Do you agree that all students should study science until eighteen?” Câu mở nào báo đồng ý một phần?", options: ["Yes.", "No, never.", "To some extent, yes.", "I couldn't agree more."], correct: 2, why: "To some extent = ở một mức nào đó. Rồi nói tiếp: đồng ý phần nào, không đồng ý phần nào (vd chữ all)." },
          { q: "2. “I think basic science is essential for everyone. ___, I don't think every student needs advanced physics.”", options: ["Because", "Having said that", "For example", "Although"], correct: 1, why: "Chuyển sang phần không đồng ý ở một câu mới ⇒ Having said that." },
          { q: "3. Cách phát triển nào là “so sánh / đối lập”?", options: ["Take my cousin, for example.", "If students don't study science, they won't understand the news.", "Science teaches logical thinking, which means it helps in any job.", "Students in cities have laboratories, whereas those in rural schools often don't."], correct: 3, why: "whereas đặt hai nhóm cạnh nhau. A = ví dụ; B = viễn cảnh ngược lại; C = lý do → hệ quả." },
          { q: "4. Câu nào SAI?", options: ["I agree with you to some extent.", "I am agree with this idea.", "I tend to agree with that.", "I'm not entirely convinced."], correct: 1, why: "agree là động từ ⇒ I agree with this idea." },
          { q: "5. Ở câu “I agree up to a point, but it's too expensive”, giọng nên thế nào?", options: ["Xuống–lên ở point, xuống hẳn ở expensive.", "Xuống hẳn ở point, lên ở expensive.", "Đều đều cả câu.", "Lên cao ở cuối câu như câu hỏi."], correct: 0, why: "↘↗ ở phần nhượng bộ (báo còn chữ but), ↘ ở ý chính." },
        ],
      },

      { t: "h", text: "VIII. Viết một thân bài (80–95 từ) — AI chấm" },
      {
        t: "essay",
        id: "t3d10-bt-viet",
        task: "Task 2",
        prompt: "Viết MỘT đoạn thân bài (80–95 từ) thuật lại quan điểm thứ hai của đề sau, theo khung 4 câu (câu chủ đề thuật quan điểm → giải thích / ví dụ → ý thứ hai hoặc hệ quả → câu đánh giá của bạn): “Some people believe that science subjects are the most important part of school education. Others think that arts subjects such as music and literature are equally important. Discuss both views and give your own opinion.”",
        minWords: 80,
        tips: [
          "Mở đoạn: On the other hand, those who value arts subjects argue that…",
          "Tối đa 2 từ nối đầu câu; ít nhất một lần this / these / such + danh từ.",
          "Câu cuối là đánh giá của bạn: This argument is particularly strong… / However, this view overlooks…",
        ],
      },

      { t: "h", text: "IX. Nói 2 câu Part 3 — ghi âm, AI chấm" },
      {
        t: "speak",
        id: "t3d10-bt-noi-p3",
        part: "3",
        questions: [
          "Do you agree that science subjects are more useful than arts subjects?",
          "Some people say that governments should pay for all scientific research. Do you agree?",
        ],
      },
      {
        t: "note",
        title: "Tự chấm phần IX trước khi xem điểm AI",
        items: [
          "☐ Mở bằng một cụm **mức độ** (không phải Yes / No trần)?",
          "☐ Có nói rõ **đồng ý phần nào** + lý do?",
          "☐ Có **một** lần chuyển hướng (Having said that / but / though)?",
          "☐ Có dùng một cách phát triển (hệ quả · ví dụ · đối lập · If… don't…)?",
          "☐ Có **câu chốt** thay cho “That's all”?",
        ],
      },
    ],
  },
];
