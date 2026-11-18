/**
 * IELTS Tập 4 — Ngày 2 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     AWL sublist 7 (60 họ từ) + Environment vòng 2 (40 từ: khí hậu – chính sách · hệ sinh thái – tài nguyên – rác)
 *                     + 12 collocation cho Task 2 / Part 3                                                     [VB7 VC08]
 *                     — nối Tập 2 Ngày 2 (Environment vòng 1) · Tập 3 Ngày 20 (AWL 6)
 *   Bài 2 (writing)   Band 7 trông thế nào: 4 tiêu chí band 6 vs band 7, hai bài mẫu cùng đề, phản biện “nêu rồi bác” /
 *                     “Granted… but…”, bảng tự chấm 12 câu, viết lại                                           [W01 W19]
 *                     — nối Tập 3 Ngày 2 (band 6 trông thế nào, sổ lỗi, viết lại 3 phiên bản)
 *   Bài 3 (speaking)  Part 1 band 7: chi tiết + từ ít gặp; ôn nhanh 12 khung; fluency                           [S04 S09 S18]
 *                     — nối Tập 2 Ngày 5 · Tập 3 Ngày 3 (12 khung) · 🔊 trọng âm câu mang nghĩa [S13]
 *   Bài tập Ngày 2    44 câu có đáp án + 1 đoạn viết + 1 lượt nói
 * Mọi id bắt đầu `t4d2-`.
 */
import type { Lesson } from '../data';

export const NGAY_2: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d2-tu-vung",
    kind: "vocab",
    title: "Từ vựng: AWL sublist 7 (60 họ từ) + Môi trường vòng 2 + collocation cho Task 2 / Part 3",
    goal: "Nhận ra và dùng đúng 60 họ từ AWL sublist 7 (đúng giới từ, đúng dạng từ), nói và viết về môi trường ở mức chính sách (net zero, carbon tax, circular economy, enforce regulations) với 12 collocation dùng được ngay trong Task 2 và Part 3.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**AWL** (Academic Word List) = 570 họ từ học thuật, chia 10 sublist. Tập 2–3 đã học sublist 1–6. Tập 4 học **sublist 7–10**; hôm nay là ==sublist 7== (60 họ từ).",
          "**Environment vòng 2:** Tập 2 Ngày 2 dạy từ nền (pollution, recycle, deforestation). Hôm nay lên mức ==chính sách và hệ thống==: 20 từ khí hậu – chính sách + 20 từ hệ sinh thái – tài nguyên – rác.",
          "**12 collocation** (cụm từ đi với nhau tự nhiên) cho Task 2 và Part 3: pose a threat to · take a toll on · curb emissions · strike a balance between…",
          "Band 7 LR = từ ít gặp dùng ==có ý thức về collocation và văn phong==. Biết nghĩa chưa đủ: mỗi từ hôm nay phải thuộc kèm **giới từ** và **từ đi cùng** ở dòng mở rộng.",
          "Cách học: mỗi nhóm 20 từ → che nghĩa tự kiểm → làm bài luyện ngay dưới. Từ tự vào Flashcards “Từ của khoá — Tập 4”. Ôn lại sau 1 – 3 – 7 ngày.",
          "Tiêu chí được đẩy: **LR** (Writing + Speaking) và điểm **Reading** (AWL phủ khoảng 10 % số từ của một bài đọc học thuật).",
        ],
      },
      { t: "h", text: "Cách học 112 mục từ trong một ngày mà không ngợp" },
      {
        t: "note",
        title: "💡 Cách học: ba lượt, mỗi lượt một việc",
        items: [
          "**Lượt 1 (nhận ra):** đọc từ + nghĩa + câu ví dụ. Từ nào đã biết thì bỏ qua nghĩa, chỉ đọc dòng mở rộng (giới từ, họ từ, lỗi).",
          "**Lượt 2 (che nghĩa):** bấm “Che nghĩa”, nói nghĩa tiếng Việt. Rồi “Che từ”, nói từ tiếng Anh.",
          "**Lượt 3 (dùng):** làm bài luyện dưới mỗi nhóm; sai từ nào ⇒ viết một câu của riêng bạn về môi trường với từ đó.",
          "Khoảng một nửa sublist 7 bạn đã gặp (adult, decade, topic, media, survive). Dành thời gian cho nửa còn lại: comprise, empirical, paradigm, infer, successor, somewhat.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. AWL sublist 7 — họ từ 1–20 (adapt → eliminate)" },
      {
        t: "vocab",
        items: [
          { w: "adapt", pos: "v", ipa: "/əˈdæpt/", vi: "thích nghi; điều chỉnh cho hợp", ex: "Coastal communities must adapt to rising sea levels.", exVi: "Các cộng đồng ven biển phải thích nghi với mực nước biển dâng.", more: "**adapt to** + N / V-ing · adaptation (n) · adaptable (adj) · khác **adopt** (áp dụng; nhận nuôi)" },
          { w: "adult", pos: "n, adj", ipa: "/ˈædʌlt/", vi: "người lớn; trưởng thành", ex: "Adult literacy rates have improved in most regions.", exVi: "Tỉ lệ biết chữ ở người lớn đã cải thiện ở hầu hết các vùng.", more: "young **adults** · **adult** education · adulthood (n): reach adulthood" },
          { w: "advocate", pos: "v, n", ipa: "/ˈædvəkeɪt/ (v) · /ˈædvəkət/ (n)", vi: "ủng hộ, chủ trương; người ủng hộ", ex: "Many scientists advocate a tax on carbon emissions.", exVi: "Nhiều nhà khoa học chủ trương đánh thuế phát thải carbon.", more: "**advocate** + N / V-ing (văn viết Anh: không cần for) · an **advocate of** · advocacy (n)" },
          { w: "aid", pos: "n, v", ipa: "/eɪd/", vi: "viện trợ, sự trợ giúp; giúp", ex: "Foreign aid alone cannot end poverty.", exVi: "Chỉ viện trợ nước ngoài thì không thể chấm dứt đói nghèo.", more: "foreign / humanitarian / financial **aid** (không đếm được) · with the **aid** of · first aid" },
          { w: "channel", pos: "n, v", ipa: "/ˈtʃænl/", vi: "kênh; dồn (tiền, nguồn lực) vào", ex: "More funding should be channelled into renewable energy.", exVi: "Nên dồn thêm kinh phí vào năng lượng tái tạo.", more: "**channel** money / resources **into** · a **channel** of communication · Anh: channelled, Mỹ: channeled" },
          { w: "chemical", pos: "n, adj", ipa: "/ˈkemɪkl/", vi: "hoá chất; (thuộc) hoá học", ex: "Farmers are using fewer chemicals than in the past.", exVi: "Nông dân đang dùng ít hoá chất hơn trước.", more: "toxic **chemicals** · **chemical** waste / fertiliser · chemistry (n) · chemist" },
          { w: "classic", pos: "adj, n", ipa: "/ˈklæsɪk/", vi: "kinh điển, điển hình; tác phẩm kinh điển", ex: "Overfishing is a classic example of short-term thinking.", exVi: "Đánh bắt quá mức là ví dụ điển hình của lối nghĩ ngắn hạn.", more: "a **classic** example / case / mistake · khác **classical** (cổ điển: classical music)" },
          { w: "comprehensive", pos: "adj", ipa: "/ˌkɒmprɪˈhensɪv/", vi: "toàn diện, đầy đủ", ex: "The city needs a comprehensive plan for waste management.", exVi: "Thành phố cần một kế hoạch toàn diện về quản lý rác.", more: "a **comprehensive** review / plan / study · comprehensively (adv) · khác **comprehensible** (dễ hiểu)" },
          { w: "comprise", pos: "v", ipa: "/kəmˈpraɪz/", vi: "gồm có; hợp thành", ex: "The committee comprises scientists and local farmers.", exVi: "Uỷ ban gồm các nhà khoa học và nông dân địa phương.", more: "**comprise** + N — KHÔNG of: ~~comprises of~~ · bị động thì có of: be **comprised of** · = consist of, be made up of" },
          { w: "confirm", pos: "v", ipa: "/kənˈfɜːm/", vi: "xác nhận, khẳng định", ex: "Later studies confirmed these findings.", exVi: "Các nghiên cứu sau này đã xác nhận những phát hiện ấy.", more: "**confirm** that… · **confirm** a booking · confirmation (n)" },
          { w: "contrary", pos: "adj, n", ipa: "/ˈkɒntrəri/", vi: "trái ngược; điều ngược lại", ex: "Contrary to popular belief, recycling alone will not solve the problem.", exVi: "Trái với điều nhiều người tin, chỉ tái chế thì không giải quyết được vấn đề.", more: "**contrary to** + N · **on the contrary** (bác ý vừa nêu) khác **in contrast** (so sánh hai thứ)" },
          { w: "convert", pos: "v", ipa: "/kənˈvɜːt/", vi: "chuyển đổi, cải tạo thành", ex: "The old factory was converted into flats.", exVi: "Nhà máy cũ đã được cải tạo thành căn hộ.", more: "**convert** A **into** B · conversion (n) · Task 1 map: was converted into" },
          { w: "couple", pos: "n, v", ipa: "/ˈkʌpl/", vi: "cặp, đôi; vài; (v) kết hợp", ex: "Rising demand, coupled with poor planning, has caused water shortages.", exVi: "Nhu cầu tăng, cùng với quy hoạch kém, đã gây ra thiếu nước.", more: "a **couple** of + N số nhiều · **coupled with** (= cùng với) — cách nối hai nguyên nhân rất học thuật" },
          { w: "decade", pos: "n", ipa: "/ˈdekeɪd/", vi: "thập kỷ", ex: "Over the past decade, sea levels have risen steadily.", exVi: "Trong thập kỷ qua, mực nước biển đã dâng đều.", more: "over the past / last **decade** (+ hiện tại hoàn thành) · for **decades** · in recent **decades**" },
          { w: "definite", pos: "adj", ipa: "/ˈdefɪnət/", vi: "rõ ràng, chắc chắn", ex: "There is no definite answer to this question.", exVi: "Không có câu trả lời chắc chắn cho câu hỏi này.", more: "definitely (adv — chính tả: defin**i**tely) · indefinite · define → definition" },
          { w: "deny", pos: "v", ipa: "/dɪˈnaɪ/", vi: "phủ nhận; không cho hưởng", ex: "Few people would deny that the climate is changing.", exVi: "Ít ai phủ nhận rằng khí hậu đang thay đổi.", more: "**deny** that… / **deny** + V-ing · denial (n) · undeniable: **It is undeniable that**… · There is no denying that…" },
          { w: "differentiate", pos: "v", ipa: "/ˌdɪfəˈrenʃieɪt/", vi: "phân biệt", ex: "It is hard to differentiate between natural and man-made causes.", exVi: "Khó phân biệt giữa nguyên nhân tự nhiên và nguyên nhân do con người.", more: "**differentiate between** A and B · **differentiate** A **from** B · = distinguish" },
          { w: "dispose", pos: "v", ipa: "/dɪˈspəʊz/", vi: "vứt bỏ, xử lý (rác)", ex: "Hospitals must dispose of medical waste safely.", exVi: "Bệnh viện phải xử lý rác y tế một cách an toàn.", more: "**dispose of** + N (bắt buộc of) · disposal (n): waste **disposal** · disposable (dùng một lần)" },
          { w: "dynamic", pos: "adj, n", ipa: "/daɪˈnæmɪk/", vi: "năng động; luôn biến động; (n) động lực", ex: "Ecosystems are dynamic systems that change constantly.", exVi: "Hệ sinh thái là những hệ thống động, thay đổi liên tục.", more: "a **dynamic** economy / city · group **dynamics** · trái nghĩa: static" },
          { w: "eliminate", pos: "v", ipa: "/ɪˈlɪmɪneɪt/", vi: "loại bỏ hoàn toàn", ex: "It is impossible to eliminate plastic from daily life overnight.", exVi: "Không thể loại bỏ nhựa khỏi đời sống hằng ngày chỉ sau một đêm.", more: "**eliminate** poverty / waste / the need for · elimination (n) · mạnh hơn reduce" },
        ],
      },
      {
        t: "quiz",
        id: "t4d2-awl-1",
        kind: "fill",
        title: "Luyện nhóm 1 — điền từ (chia dạng nếu cần): adapt · advocate · channel · comprise · contrary · convert · dispose · eliminate (8 câu)",
        items: [
          { q: "The warehouse has been ___ into a community recycling centre.", answers: ["converted"] },
          { q: "___ to what many people assume, electric cars are not emission-free.", answers: ["Contrary", "contrary"] },
          { q: "Most households still ___ of old batteries with their ordinary rubbish.", answers: ["dispose"] },
          { q: "The panel ___ twelve experts from six countries.", answers: ["comprises", "comprised"] },
          { q: "Farmers in the region have had to ___ to longer dry seasons.", answers: ["adapt"] },
          { q: "The charity ___ stricter limits on fishing in coastal waters.", answers: ["advocates", "advocated"] },
          { q: "No single policy can ___ air pollution completely.", answers: ["eliminate"] },
          { q: "Revenue from the new tax is ___ into public transport.", answers: ["channelled", "channeled"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. AWL sublist 7 — họ từ 21–40 (empirical → paradigm)" },
      {
        t: "vocab",
        items: [
          { w: "empirical", pos: "adj", ipa: "/ɪmˈpɪrɪkl/", vi: "dựa trên thực nghiệm, quan sát thực tế", ex: "There is little empirical evidence to support this claim.", exVi: "Có rất ít bằng chứng thực nghiệm ủng hộ lời khẳng định này.", more: "**empirical** evidence / research / data · empirically (adv) · trái nghĩa: theoretical" },
          { w: "equip", pos: "v", ipa: "/ɪˈkwɪp/", vi: "trang bị", ex: "Schools should equip students with practical skills.", exVi: "Trường học nên trang bị cho học sinh kỹ năng thực tế.", more: "**equip** sb **with** sth · be well **equipped** to V · equipment (n, không đếm được)" },
          { w: "extract", pos: "v, n", ipa: "/ɪkˈstrækt/ (v) · /ˈekstrækt/ (n)", vi: "chiết xuất, khai thác; đoạn trích", ex: "Oil is extracted from beneath the seabed.", exVi: "Dầu được khai thác từ dưới đáy biển.", more: "**extract** A **from** B · extraction (n): oil **extraction** · an **extract** from a book" },
          { w: "file", pos: "n, v", ipa: "/faɪl/", vi: "hồ sơ, tệp; nộp (đơn), lưu hồ sơ", ex: "Residents filed a complaint against the mining company.", exVi: "Người dân đã nộp đơn khiếu nại công ty khai khoáng.", more: "**file** a complaint / a report / a lawsuit · keep sth **on file**" },
          { w: "finite", pos: "adj", ipa: "/ˈfaɪnaɪt/", vi: "có hạn", ex: "Fossil fuels are a finite resource.", exVi: "Nhiên liệu hoá thạch là nguồn tài nguyên có hạn.", more: "**finite** resources · trái nghĩa: infinite /ˈɪnfɪnət/ — đọc khác hẳn finite" },
          { w: "foundation", pos: "n", ipa: "/faʊnˈdeɪʃn/", vi: "nền tảng; quỹ (tổ chức); móng nhà", ex: "Trust is the foundation of any agreement between nations.", exVi: "Lòng tin là nền tảng của mọi thoả thuận giữa các quốc gia.", more: "lay the **foundation(s)** for · found (v, thành lập) → founder · a charitable **foundation**" },
          { w: "globe", pos: "n", ipa: "/ɡləʊb/", vi: "địa cầu; toàn thế giới", ex: "Temperatures are rising across the globe.", exVi: "Nhiệt độ đang tăng trên khắp địa cầu.", more: "across / around the **globe** · global (adj) · globally · globalisation" },
          { w: "grade", pos: "n, v", ipa: "/ɡreɪd/", vi: "cấp, hạng; điểm; xếp loại", ex: "Low-grade plastic is difficult to recycle.", exVi: "Nhựa cấp thấp rất khó tái chế.", more: "high- / low-**grade** · graded (adj) · upgrade / downgrade (v, n)" },
          { w: "guarantee", pos: "v, n", ipa: "/ˌɡærənˈtiː/", vi: "bảo đảm; sự bảo đảm", ex: "Economic growth does not guarantee a cleaner environment.", exVi: "Tăng trưởng kinh tế không bảo đảm một môi trường sạch hơn.", more: "**guarantee** (that)… · there is no **guarantee** that… · chính tả: g-u-a-r-a-n-t-e-e" },
          { w: "hierarchy", pos: "n", ipa: "/ˈhaɪərɑːki/", vi: "hệ thống thứ bậc", ex: "Reduce, reuse, recycle: this order is known as the waste hierarchy.", exVi: "Giảm, dùng lại, tái chế: thứ tự này được gọi là thang ưu tiên xử lý rác.", more: "a social / rigid **hierarchy** · hierarchical (adj) · at the top of the **hierarchy**" },
          { w: "identical", pos: "adj", ipa: "/aɪˈdentɪkl/", vi: "giống hệt", ex: "No two ecosystems are identical.", exVi: "Không có hai hệ sinh thái nào giống hệt nhau.", more: "**identical to** / with · almost / virtually **identical** (Task 1: the two figures were almost identical)" },
          { w: "ideology", pos: "n", ipa: "/ˌaɪdiˈɒlədʒi/", vi: "hệ tư tưởng", ex: "Environmental policy should be driven by evidence, not ideology.", exVi: "Chính sách môi trường nên dựa trên bằng chứng, không phải hệ tư tưởng.", more: "a political **ideology** · ideological (adj)" },
          { w: "infer", pos: "v", ipa: "/ɪnˈfɜː/", vi: "suy ra", ex: "We can infer from the data that the policy has failed.", exVi: "Từ số liệu ta có thể suy ra rằng chính sách đã thất bại.", more: "**infer** A **from** B · inference (n) · Reading: “It can be inferred that…” · khác **imply** (người nói ngụ ý)" },
          { w: "innovate", pos: "v", ipa: "/ˈɪnəveɪt/", vi: "đổi mới, sáng tạo cái mới", ex: "Companies must innovate to reduce their emissions.", exVi: "Doanh nghiệp phải đổi mới để giảm phát thải.", more: "innovation (n): technological **innovation** · innovative (adj) · innovator" },
          { w: "insert", pos: "v", ipa: "/ɪnˈsɜːt/", vi: "chèn vào, đưa vào", ex: "A clause on recycling was inserted into the contract.", exVi: "Một điều khoản về tái chế đã được đưa vào hợp đồng.", more: "**insert** A **into** B · insertion (n)" },
          { w: "intervene", pos: "v", ipa: "/ˌɪntəˈviːn/", vi: "can thiệp", ex: "Governments should intervene when markets fail to protect the environment.", exVi: "Chính phủ nên can thiệp khi thị trường không bảo vệ được môi trường.", more: "**intervene in** + N · intervention (n): government / state **intervention**" },
          { w: "isolate", pos: "v", ipa: "/ˈaɪsəleɪt/", vi: "cô lập, tách riêng", ex: "It is difficult to isolate the effect of a single factor.", exVi: "Khó tách riêng tác động của một yếu tố đơn lẻ.", more: "isolated (adj): an **isolated** community / case · isolation (n): in **isolation**" },
          { w: "media", pos: "n", ipa: "/ˈmiːdiə/", vi: "truyền thông", ex: "The media have a duty to report climate science accurately.", exVi: "Truyền thông có trách nhiệm đưa tin khoa học khí hậu một cách chính xác.", more: "**the media** (luôn có the; động từ số nhiều hoặc số ít) · social **media** · mass **media** · số ít: medium" },
          { w: "mode", pos: "n", ipa: "/məʊd/", vi: "phương thức, kiểu", ex: "Rail is the least polluting mode of transport.", exVi: "Đường sắt là phương thức vận tải ít gây ô nhiễm nhất.", more: "a **mode** of transport / production / payment" },
          { w: "paradigm", pos: "n", ipa: "/ˈpærədaɪm/", vi: "mô hình tư duy, hệ hình", ex: "The circular economy represents a paradigm shift in how we think about waste.", exVi: "Kinh tế tuần hoàn là một sự thay đổi căn bản trong cách ta nghĩ về rác.", more: "a **paradigm shift** (thay đổi căn bản về cách nghĩ) · chữ g câm" },
        ],
      },
      {
        t: "mcq",
        id: "t4d2-awl-2",
        title: "Luyện nhóm 2 — chọn từ đúng (8 câu)",
        items: [
          { q: "The theory sounds convincing, but there is very little ___ evidence for it.", options: ["finite", "empirical", "identical", "dynamic"], correct: 1, why: "empirical evidence = bằng chứng từ quan sát / thí nghiệm thực tế." },
          { q: "Because oil is a ___ resource, alternative sources of energy will eventually be needed.", options: ["finite", "definite", "unique", "sole"], correct: 0, why: "finite = có hạn. definite = rõ ràng (khác nghĩa, gần chữ)." },
          { q: "From the falling number of complaints, we can ___ that the scheme is working.", options: ["imply", "insert", "infer", "intervene"], correct: 2, why: "infer A from B = suy ra. imply = ngụ ý (chủ ngữ là người nói / dữ liệu: the data imply that…)." },
          { q: "The state should ___ only when voluntary measures have clearly failed.", options: ["isolate", "innovate", "extract", "intervene"], correct: 3, why: "intervene = can thiệp." },
          { q: "The move from coal to renewable power is a genuine ___ shift.", options: ["hierarchy", "ideology", "paradigm", "foundation"], correct: 2, why: "a paradigm shift = thay đổi căn bản về mô hình / cách nghĩ." },
          { q: "Cycling is the cheapest ___ of transport for short journeys.", options: ["mode", "grade", "globe", "file"], correct: 0, why: "a mode of transport = phương thức đi lại." },
          { q: "Universities should ___ graduates with the skills that green industries need.", options: ["extract", "equip", "insert", "guarantee"], correct: 1, why: "equip sb with sth = trang bị cho ai cái gì." },
          { q: "The two reports reached almost ___ conclusions.", options: ["empirical", "finite", "isolated", "identical"], correct: 3, why: "almost identical = gần như giống hệt." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. AWL sublist 7 — họ từ 41–60 (phenomenon → voluntary)" },
      {
        t: "vocab",
        items: [
          { w: "phenomenon", pos: "n", ipa: "/fəˈnɒmɪnən/", vi: "hiện tượng", ex: "Urban flooding is a relatively recent phenomenon.", exVi: "Ngập lụt đô thị là một hiện tượng tương đối mới.", more: "số nhiều: **phenomena** (~~phenomenons~~) · a natural / global **phenomenon** · phenomenal (adj)" },
          { w: "priority", pos: "n", ipa: "/praɪˈɒrəti/", vi: "sự ưu tiên; việc ưu tiên", ex: "Clean air should be a top priority for city governments.", exVi: "Không khí sạch nên là ưu tiên hàng đầu của chính quyền thành phố.", more: "a top / high **priority** · give **priority** to · prioritise (v) · prior (adj): prior to" },
          { w: "prohibit", pos: "v", ipa: "/prəˈhɪbɪt/", vi: "cấm", ex: "Several countries have prohibited the sale of single-use plastic bags.", exVi: "Một số nước đã cấm bán túi nhựa dùng một lần.", more: "**prohibit** sb **from** V-ing · prohibition (n) · trang trọng hơn ban" },
          { w: "publication", pos: "n", ipa: "/ˌpʌblɪˈkeɪʃn/", vi: "sự xuất bản; ấn phẩm", ex: "The publication of the report led to a public debate.", exVi: "Việc công bố bản báo cáo đã dẫn tới một cuộc tranh luận công khai.", more: "publish (v) · publisher · **the publication of** + N (the + N + of — Ngày 1)" },
          { w: "quote", pos: "v, n", ipa: "/kwəʊt/", vi: "trích dẫn; báo giá", ex: "The minister was quoted as saying that the target would be met.", exVi: "Bộ trưởng được dẫn lời nói rằng mục tiêu sẽ đạt được.", more: "be **quoted as saying** · **quote** from a report · quotation (n)" },
          { w: "release", pos: "v, n", ipa: "/rɪˈliːs/", vi: "thải ra; phát hành; thả", ex: "Burning coal releases carbon dioxide into the atmosphere.", exVi: "Đốt than thải khí CO2 vào khí quyển.", more: "**release** A **into** B · the **release** of gases / a report / a film" },
          { w: "reverse", pos: "v, n, adj", ipa: "/rɪˈvɜːs/", vi: "đảo ngược; điều ngược lại", ex: "It may be too late to reverse the damage.", exVi: "Có thể đã quá muộn để đảo ngược thiệt hại.", more: "**reverse** a trend / a decision / the decline · irreversible (adj) · the **reverse** is true" },
          { w: "simulate", pos: "v", ipa: "/ˈsɪmjuleɪt/", vi: "mô phỏng", ex: "Computer models simulate how the climate will change.", exVi: "Các mô hình máy tính mô phỏng khí hậu sẽ thay đổi thế nào.", more: "simulation (n): a computer **simulation**" },
          { w: "sole", pos: "adj", ipa: "/səʊl/", vi: "duy nhất", ex: "Cost should not be the sole factor in the decision.", exVi: "Chi phí không nên là yếu tố duy nhất trong quyết định.", more: "the **sole** reason / purpose / responsibility · solely (adv): rely **solely** on" },
          { w: "somewhat", pos: "adv", ipa: "/ˈsʌmwɒt/", vi: "hơi, phần nào", ex: "The results were somewhat disappointing.", exVi: "Kết quả hơi đáng thất vọng.", more: "**somewhat** + adj / so sánh hơn: somewhat higher (Task 1) · trang trọng hơn “a bit”" },
          { w: "submit", pos: "v", ipa: "/səbˈmɪt/", vi: "nộp; đệ trình", ex: "Residents can submit objections to the plan online.", exVi: "Người dân có thể nộp ý kiến phản đối kế hoạch qua mạng.", more: "**submit** an application / a proposal / an essay · submission (n)" },
          { w: "successor", pos: "n", ipa: "/səkˈsesə/", vi: "người / vật kế nhiệm", ex: "The agreement and its successor both set binding targets.", exVi: "Hiệp định và văn kiện kế tiếp nó đều đặt ra các mục tiêu ràng buộc.", more: "a **successor to** · succeed (v, kế nhiệm) · succession · trái nghĩa: predecessor" },
          { w: "survive", pos: "v", ipa: "/səˈvaɪv/", vi: "sống sót, tồn tại", ex: "Many species will not survive a rise of two degrees.", exVi: "Nhiều loài sẽ không sống sót qua mức tăng hai độ.", more: "survival (n): the **survival** of the species · survivor · **survive** on (sống nhờ)" },
          { w: "thesis", pos: "n", ipa: "/ˈθiːsɪs/", vi: "luận án; luận điểm", ex: "The thesis statement tells the reader your position.", exVi: "Câu luận điểm cho người đọc biết lập trường của bạn.", more: "số nhiều: **theses** /ˈθiːsiːz/ · a PhD **thesis** · thesis statement = câu nêu lập trường ở mở bài Task 2" },
          { w: "topic", pos: "n", ipa: "/ˈtɒpɪk/", vi: "chủ đề", ex: "Nuclear power remains a controversial topic.", exVi: "Điện hạt nhân vẫn là một chủ đề gây tranh cãi.", more: "**topic** sentence (câu chủ đề của đoạn) · topical (adj, mang tính thời sự)" },
          { w: "transmit", pos: "v", ipa: "/trænzˈmɪt/", vi: "truyền (tín hiệu, bệnh, kiến thức)", ex: "The disease is transmitted by mosquitoes.", exVi: "Bệnh này lây truyền qua muỗi.", more: "**transmit** A **to** B · transmission (n)" },
          { w: "ultimate", pos: "adj", ipa: "/ˈʌltɪmət/", vi: "cuối cùng, sau cùng", ex: "The ultimate goal is a carbon-neutral economy.", exVi: "Mục tiêu sau cùng là một nền kinh tế trung hoà carbon.", more: "the **ultimate** goal / aim · ultimately (adv): **Ultimately**, … (rốt cuộc — mở câu kết)" },
          { w: "unique", pos: "adj", ipa: "/juˈniːk/", vi: "độc nhất, riêng có", ex: "Each island has its own unique ecosystem.", exVi: "Mỗi hòn đảo có hệ sinh thái riêng độc nhất.", more: "**a** unique (không an) · **unique to** + N · không nói ~~very unique~~" },
          { w: "visible", pos: "adj", ipa: "/ˈvɪzəbl/", vi: "nhìn thấy được; rõ rệt", ex: "The effects of the drought are clearly visible from the air.", exVi: "Tác động của hạn hán nhìn rõ từ trên không.", more: "clearly **visible** · a **visible** improvement · visibility (n) · invisible" },
          { w: "voluntary", pos: "adj", ipa: "/ˈvɒləntri/", vi: "tự nguyện", ex: "Voluntary measures have had little effect; regulation is needed.", exVi: "Các biện pháp tự nguyện hầu như không có tác dụng; cần quy định bắt buộc.", more: "**voluntary** work / schemes · volunteer (n, v) · voluntarily (adv) · trái nghĩa: compulsory, mandatory" },
        ],
      },
      {
        t: "quiz",
        id: "t4d2-awl-3",
        kind: "fill",
        title: "Luyện nhóm 3 — viết dạng đúng của từ trong ngoặc (8 câu)",
        items: [
          { q: "Technological ___ (innovate) alone will not be enough to meet the target.", answers: ["innovation"] },
          { q: "Some economists oppose state ___ (intervene) in the energy market.", answers: ["intervention"] },
          { q: "The ___ (survive) of many coral species depends on cooler seas.", answers: ["survival"] },
          { q: "A total ___ (prohibit) on diesel cars would be difficult to enforce.", answers: ["prohibition"] },
          { q: "Few companies reduce their packaging ___ (voluntary).", answers: ["voluntarily"] },
          { q: "Droughts and floods are natural ___ (phenomenon), but they are becoming more frequent.", answers: ["phenomena"] },
          { q: "Scientists warn that some of the damage is ___ (reverse).", answers: ["irreversible"] },
          { q: "___ (ultimate), the choice lies with voters.", answers: ["Ultimately", "ultimately"] },
        ],
      },
      {
        t: "table",
        head: ["Động từ", "Danh từ", "Tính từ / trạng từ", "Giới từ đi kèm"],
        rows: [
          ["adapt", "adaptation", "adaptable", "adapt **to**"],
          ["convert", "conversion", "convertible", "convert A **into** B"],
          ["dispose", "disposal", "disposable", "dispose **of**"],
          ["intervene", "intervention", "—", "intervene **in**"],
          ["innovate", "innovation", "innovative", "—"],
          ["prohibit", "prohibition", "prohibitive (đắt tới mức không mua nổi)", "prohibit sb **from** V-ing"],
          ["survive", "survival · survivor", "—", "survive **on**"],
          ["reverse", "reversal · the reverse", "reversible · irreversible", "—"],
          ["infer", "inference", "—", "infer A **from** B"],
          ["—", "priority", "prior", "give priority **to** · prior **to**"],
        ],
        caption: "Mười họ từ của sublist 7 hay bị hỏi dạng từ nhất.",
      },
      {
        t: "note",
        title: "⚠️ Tám lỗi hay sai với sublist 7",
        items: [
          "~~The group comprises of ten members~~ → **comprises** ten members / **is comprised of** / **consists of** ten members.",
          "~~dispose rubbish~~ → **dispose of** rubbish. ~~adapt with~~ → **adapt to**.",
          "~~these phenomenons~~ / ~~this phenomena~~ → this **phenomenon** (số ít) · these **phenomena** (số nhiều).",
          "~~Media plays~~ (thiếu the) → **The media** play / plays an important role.",
          "**On the contrary** dùng để BÁC ý vừa nêu (“It is not cheap. On the contrary, it is very expensive.”). Muốn so sánh hai thứ thì dùng **In contrast** / **By contrast**.",
          "**adapt** (thích nghi) khác **adopt** (áp dụng một chính sách, nhận con nuôi): adopt a policy, adapt to a change.",
          "~~an unique~~ → **a** unique (âm đầu /j/). ~~very unique~~ → unique / truly unique.",
          "**finite** đọc /ˈfaɪnaɪt/ nhưng **infinite** đọc /ˈɪnfɪnət/ và **definite** đọc /ˈdefɪnət/.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Environment vòng 2 (A) — khí hậu và chính sách (20 từ)" },
      {
        t: "p",
        text: "Tập 2 Ngày 2 cho bạn từ để ==tả== vấn đề (pollution, greenhouse gas, landfill). Band 7 cần từ để ==bàn giải pháp ở mức hệ thống==: nhà nước làm gì (carbon tax, enforce regulations), doanh nghiệp làm gì (decarbonise, greenwashing), mục tiêu là gì (net zero). Hai từ nền của mọi cuộc bàn luận về khí hậu: **mitigation** = giảm nguyên nhân (cắt phát thải); **adaptation** = sống chung với hậu quả (xây đê, đổi giống cây).",
      },
      {
        t: "vocab",
        items: [
          { w: "net zero", pos: "n, adj", ipa: "/ˌnet ˈzɪərəʊ/", vi: "phát thải ròng bằng không", ex: "The government has pledged to reach net zero by 2050.", exVi: "Chính phủ đã cam kết đạt phát thải ròng bằng không vào năm 2050.", more: "reach / achieve **net zero** · a **net-zero** target (có gạch nối khi đứng trước danh từ)" },
          { w: "carbon-neutral", pos: "adj", ipa: "/ˌkɑːbən ˈnjuːtrəl/", vi: "trung hoà carbon", ex: "The company aims to become carbon-neutral within ten years.", exVi: "Công ty đặt mục tiêu trung hoà carbon trong vòng mười năm.", more: "become / go **carbon-neutral** · carbon neutrality (n)" },
          { w: "decarbonise", pos: "v", ipa: "/ˌdiːˈkɑːbənaɪz/", vi: "khử carbon (bỏ dần nhiên liệu hoá thạch)", ex: "It will take decades to decarbonise the transport sector.", exVi: "Sẽ mất hàng chục năm để khử carbon ngành giao thông.", more: "**decarbonise** the economy / the power sector · decarbonisation (n)" },
          { w: "carbon offsetting", pos: "n", ipa: "/ˈkɑːbən ˌɒfsetɪŋ/", vi: "bù trừ carbon (trả tiền trồng rừng… để bù phần mình thải)", ex: "Critics argue that carbon offsetting lets polluters avoid real change.", exVi: "Giới phê bình cho rằng bù trừ carbon giúp bên gây ô nhiễm né thay đổi thật sự.", more: "**offset** (v) emissions **by** planting trees · a carbon offset scheme" },
          { w: "carbon capture", pos: "n", ipa: "/ˈkɑːbən ˌkæptʃə/", vi: "thu giữ carbon", ex: "Carbon capture remains too expensive to be used widely.", exVi: "Thu giữ carbon vẫn còn quá đắt để dùng rộng rãi.", more: "**carbon capture** and storage · capture (v) carbon dioxide" },
          { w: "mitigate", pos: "v", ipa: "/ˈmɪtɪɡeɪt/", vi: "giảm nhẹ, làm dịu bớt", ex: "Planting trees can help to mitigate the effects of urban heat.", exVi: "Trồng cây có thể giúp giảm nhẹ tác động của nắng nóng đô thị.", more: "**mitigate** the effects / impact / risk of · mitigation (n): climate **mitigation** (cắt phát thải)" },
          { w: "resilience", pos: "n", ipa: "/rɪˈzɪliəns/", vi: "khả năng chống chịu, phục hồi", ex: "Poorer countries need funding to build resilience to floods.", exVi: "Các nước nghèo hơn cần kinh phí để xây dựng khả năng chống chịu lũ lụt.", more: "build **resilience to** · resilient (adj): climate-**resilient** crops" },
          { w: "tipping point", pos: "n", ipa: "/ˈtɪpɪŋ pɔɪnt/", vi: "điểm tới hạn (qua đó thay đổi không dừng lại được)", ex: "Scientists fear that the ice sheet is close to a tipping point.", exVi: "Các nhà khoa học lo rằng tảng băng đang gần điểm tới hạn.", more: "reach / pass a **tipping point** · dùng được cho cả xã hội: a tipping point in public opinion" },
          { w: "irreversible", pos: "adj", ipa: "/ˌɪrɪˈvɜːsəbl/", vi: "không thể đảo ngược", ex: "The loss of a species is irreversible.", exVi: "Sự mất đi của một loài là không thể đảo ngược.", more: "**irreversible** damage / change / decline · gốc: reverse (sublist 7)" },
          { w: "unprecedented", pos: "adj", ipa: "/ʌnˈpresɪdentɪd/", vi: "chưa từng có", ex: "Forests are being cleared on an unprecedented scale.", exVi: "Rừng đang bị phá ở quy mô chưa từng có.", more: "on an **unprecedented** scale · **unprecedented** levels of · precedent (n, tiền lệ)" },
          { w: "extreme weather", pos: "n", ipa: "/ɪkˌstriːm ˈweðə/", vi: "thời tiết cực đoan", ex: "Extreme weather events are becoming more frequent.", exVi: "Các hiện tượng thời tiết cực đoan đang xảy ra thường xuyên hơn.", more: "**extreme weather** events (đếm được nhờ events; weather không đếm được)" },
          { w: "heatwave", pos: "n", ipa: "/ˈhiːtweɪv/", vi: "đợt nắng nóng", ex: "Last summer's heatwave lasted for three weeks.", exVi: "Đợt nắng nóng mùa hè năm ngoái kéo dài ba tuần.", more: "a severe / prolonged **heatwave**" },
          { w: "wildfire", pos: "n", ipa: "/ˈwaɪldfaɪə/", vi: "cháy rừng lan rộng", ex: "Wildfires destroyed thousands of homes in the region.", exVi: "Cháy rừng đã thiêu rụi hàng nghìn ngôi nhà trong vùng.", more: "**wildfires** spread / break out · = bushfire (Úc), forest fire" },
          { w: "sea-level rise", pos: "n", ipa: "/ˈsiː levl ˌraɪz/", vi: "nước biển dâng", ex: "Sea-level rise threatens low-lying cities such as Ho Chi Minh City.", exVi: "Nước biển dâng đe doạ các thành phố trũng thấp như TP. Hồ Chí Minh.", more: "rising **sea levels** · low-lying areas / coastal communities" },
          { w: "carbon tax", pos: "n", ipa: "/ˈkɑːbən tæks/", vi: "thuế carbon", ex: "A carbon tax would make polluting fuels more expensive.", exVi: "Thuế carbon sẽ làm nhiên liệu gây ô nhiễm đắt hơn.", more: "introduce / impose a **carbon tax** on" },
          { w: "emissions trading", pos: "n", ipa: "/ɪˈmɪʃnz ˌtreɪdɪŋ/", vi: "mua bán quyền phát thải", ex: "Under emissions trading, firms that pollute less can sell their permits.", exVi: "Theo cơ chế mua bán phát thải, doanh nghiệp thải ít hơn có thể bán giấy phép của mình.", more: "an **emissions trading** scheme · a cap on emissions (trần phát thải)" },
          { w: "polluter pays principle", pos: "n", ipa: "/pəˌluːtə ˈpeɪz ˌprɪnsəpl/", vi: "nguyên tắc “người gây ô nhiễm phải trả tiền”", ex: "The fine is based on the polluter pays principle.", exVi: "Khoản phạt dựa trên nguyên tắc người gây ô nhiễm phải trả tiền.", more: "make the **polluter pay** · hợp với Task 2 về trách nhiệm doanh nghiệp" },
          { w: "incentivise", pos: "v", ipa: "/ɪnˈsentɪvaɪz/", vi: "khuyến khích bằng lợi ích (tiền, thuế)", ex: "Tax breaks incentivise households to install solar panels.", exVi: "Giảm thuế khuyến khích các hộ gia đình lắp pin mặt trời.", more: "**incentivise** sb **to** V · incentive (n — AWL 6): a financial incentive" },
          { w: "enforce", pos: "v", ipa: "/ɪnˈfɔːs/", vi: "thực thi, buộc tuân thủ (luật)", ex: "Environmental laws are useless unless they are properly enforced.", exVi: "Luật môi trường vô dụng nếu không được thực thi nghiêm túc.", more: "**enforce** a law / a ban / regulations **strictly** · enforcement (n) · khác reinforce (củng cố)" },
          { w: "greenwashing", pos: "n", ipa: "/ˈɡriːnwɒʃɪŋ/", vi: "“tẩy xanh” — quảng cáo thân thiện môi trường nhưng không làm thật", ex: "The airline was accused of greenwashing in its adverts.", exVi: "Hãng hàng không bị cáo buộc “tẩy xanh” trong quảng cáo.", more: "be accused of **greenwashing** · từ báo chí; dùng được ở Part 3 và Task 2" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai hướng ứng phó với biến đổi khí hậu",
        cols: [
          { title: "Mitigation — giảm nguyên nhân", items: ["decarbonise the power sector", "introduce a carbon tax", "reach net zero by 2050", "carbon capture · emissions trading", "enforce limits on pollutants"] },
          { title: "Adaptation — sống chung với hậu quả", items: ["build resilience to floods", "adapt to rising sea levels", "plant climate-resilient crops", "prepare for heatwaves and wildfires", "protect low-lying communities"] },
        ],
        caption: "Task 2 hỏi “giải pháp” ⇒ nêu được cả hai hướng là đã có hai ý chính khác nhau thật sự.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Environment vòng 2 (B) — hệ sinh thái, tài nguyên và rác (20 từ)" },
      {
        t: "vocab",
        items: [
          { w: "ecosystem", pos: "n", ipa: "/ˈiːkəʊsɪstəm/", vi: "hệ sinh thái", ex: "Coral reefs are among the most fragile ecosystems on Earth.", exVi: "Rạn san hô nằm trong số những hệ sinh thái mong manh nhất Trái Đất.", more: "a fragile / marine **ecosystem** · upset the balance of an **ecosystem**" },
          { w: "degradation", pos: "n", ipa: "/ˌdeɡrəˈdeɪʃn/", vi: "sự suy thoái", ex: "Intensive farming leads to the degradation of the soil.", exVi: "Canh tác thâm canh dẫn tới suy thoái đất.", more: "environmental / land / soil **degradation** · degrade (v)" },
          { w: "depletion", pos: "n", ipa: "/dɪˈpliːʃn/", vi: "sự cạn kiệt", ex: "The depletion of groundwater is a serious problem for farmers.", exVi: "Sự cạn kiệt nước ngầm là vấn đề nghiêm trọng với nông dân.", more: "the **depletion** of natural resources / fish stocks · deplete (v)" },
          { w: "extinction", pos: "n", ipa: "/ɪkˈstɪŋkʃn/", vi: "sự tuyệt chủng", ex: "Hundreds of species are on the brink of extinction.", exVi: "Hàng trăm loài đang bên bờ tuyệt chủng.", more: "on the brink / verge of **extinction** · extinct (adj): become extinct · face extinction" },
          { w: "overfishing", pos: "n", ipa: "/ˌəʊvəˈfɪʃɪŋ/", vi: "đánh bắt cá quá mức", ex: "Overfishing has emptied large areas of the sea.", exVi: "Đánh bắt quá mức đã làm cạn cá ở những vùng biển rộng lớn.", more: "fish stocks (trữ lượng cá) · tiền tố over-: overconsumption, overpopulation, overuse" },
          { w: "desertification", pos: "n", ipa: "/dɪˌzɜːtɪfɪˈkeɪʃn/", vi: "sa mạc hoá", ex: "Desertification is forcing farmers to abandon their land.", exVi: "Sa mạc hoá đang buộc nông dân bỏ đất.", more: "combat **desertification** · -ification = quá trình biến thành" },
          { w: "soil erosion", pos: "n", ipa: "/ˈsɔɪl ɪˌrəʊʒn/", vi: "xói mòn đất", ex: "Tree roots help to prevent soil erosion on steep slopes.", exVi: "Rễ cây giúp ngăn xói mòn đất trên sườn dốc.", more: "prevent / cause **soil erosion** · coastal erosion · erode (v)" },
          { w: "water scarcity", pos: "n", ipa: "/ˈwɔːtə ˌskeəsəti/", vi: "khan hiếm nước", ex: "Water scarcity already affects billions of people around the world.", exVi: "Khan hiếm nước đã ảnh hưởng tới hàng tỉ người trên thế giới.", more: "scarce (adj): **scarce** resources · scarcity of + N" },
          { w: "groundwater", pos: "n", ipa: "/ˈɡraʊndwɔːtə/", vi: "nước ngầm", ex: "Chemicals from the factory have polluted the groundwater.", exVi: "Hoá chất từ nhà máy đã làm ô nhiễm nước ngầm.", more: "không đếm được · pollute / pump **groundwater**" },
          { w: "wetland", pos: "n", ipa: "/ˈwetlənd/", vi: "vùng đất ngập nước", ex: "Wetlands act as natural flood defences.", exVi: "Vùng đất ngập nước đóng vai trò như lá chắn lũ tự nhiên.", more: "drain a **wetland** (rút cạn) · protect / restore **wetlands**" },
          { w: "coral reef", pos: "n", ipa: "/ˈkɒrəl riːf/", vi: "rạn san hô", ex: "Warmer seas are killing coral reefs around the world.", exVi: "Biển ấm lên đang giết chết các rạn san hô trên khắp thế giới.", more: "coral bleaching (san hô bị tẩy trắng)" },
          { w: "reforestation", pos: "n", ipa: "/ˌriːfɒrɪˈsteɪʃn/", vi: "trồng lại rừng", ex: "Reforestation projects have restored thousands of hectares.", exVi: "Các dự án trồng lại rừng đã phục hồi hàng nghìn héc-ta.", more: "trái nghĩa: deforestation (Tập 2 Ngày 2) · a **reforestation** scheme" },
          { w: "rewilding", pos: "n", ipa: "/ˌriːˈwaɪldɪŋ/", vi: "tái hoang dã (trả đất về trạng thái tự nhiên, thả lại loài bản địa)", ex: "Rewilding has brought beavers back to several rivers.", exVi: "Tái hoang dã đã đưa hải ly trở lại một số con sông.", more: "rewild (v) an area · reintroduce a species (thả lại một loài)" },
          { w: "circular economy", pos: "n", ipa: "/ˌsɜːkjələr ɪˈkɒnəmi/", vi: "kinh tế tuần hoàn (vật liệu được dùng lại thay vì thải bỏ)", ex: "In a circular economy, waste from one industry becomes a resource for another.", exVi: "Trong kinh tế tuần hoàn, rác của ngành này trở thành tài nguyên của ngành khác.", more: "move towards a **circular economy** · trái: a linear “take – make – throw away” economy" },
          { w: "throwaway culture", pos: "n", ipa: "/ˈθrəʊəweɪ ˌkʌltʃə/", vi: "văn hoá dùng rồi vứt", ex: "Cheap fashion has encouraged a throwaway culture.", exVi: "Thời trang giá rẻ đã khuyến khích văn hoá dùng rồi vứt.", more: "a **throwaway** society · built-in obsolescence (cố ý làm đồ mau hỏng)" },
          { w: "biodegradable", pos: "adj", ipa: "/ˌbaɪəʊdɪˈɡreɪdəbl/", vi: "phân huỷ sinh học được", ex: "Biodegradable packaging breaks down within a few months.", exVi: "Bao bì phân huỷ sinh học sẽ phân rã trong vài tháng.", more: "**biodegradable** bags / packaging · break down (phân rã) · compostable (ủ thành phân được)" },
          { w: "microplastics", pos: "n (số nhiều)", ipa: "/ˈmaɪkrəʊplæstɪks/", vi: "vi nhựa", ex: "Microplastics have been found in drinking water and in fish.", exVi: "Vi nhựa đã được tìm thấy trong nước uống và trong cá.", more: "luôn số nhiều · plastic waste / plastic pollution (không đếm được)" },
          { w: "pollutant", pos: "n", ipa: "/pəˈluːtənt/", vi: "chất gây ô nhiễm", ex: "Diesel engines release harmful pollutants into the air.", exVi: "Động cơ diesel thải chất gây ô nhiễm có hại vào không khí.", more: "ĐẾM ĐƯỢC: air **pollutants** — khác pollution (không đếm được) · polluter (bên gây ô nhiễm)" },
          { w: "hazardous", pos: "adj", ipa: "/ˈhæzədəs/", vi: "nguy hại", ex: "Hazardous waste must be stored in sealed containers.", exVi: "Rác nguy hại phải được chứa trong thùng kín.", more: "**hazardous** waste / chemicals · hazard (n): a health **hazard** · = toxic (độc)" },
          { w: "food miles", pos: "n (số nhiều)", ipa: "/ˈfuːd maɪlz/", vi: "quãng đường thực phẩm đi từ nơi sản xuất tới người ăn", ex: "Buying local produce reduces food miles.", exVi: "Mua nông sản địa phương làm giảm quãng đường vận chuyển thực phẩm.", more: "locally sourced / locally produced food · seasonal produce (nông sản theo mùa)" },
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Environment vòng 2 — 4 nhánh để nhớ",
        center: "Environment",
        branches: [
          { label: "Khí hậu", items: ["extreme weather · heatwave · wildfire", "sea-level rise · tipping point", "irreversible · unprecedented"] },
          { label: "Chính sách", items: ["net zero · carbon tax", "enforce · incentivise · prohibit", "polluter pays · greenwashing"] },
          { label: "Hệ sinh thái", items: ["ecosystem · wetland · coral reef", "extinction · degradation", "reforestation · rewilding"] },
          { label: "Tài nguyên & rác", items: ["depletion · water scarcity", "circular economy · throwaway culture", "microplastics · hazardous waste"] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với nhóm từ môi trường",
        items: [
          "**pollution** không đếm được, **pollutant** đếm được: ~~many pollutions~~ → many **pollutants** / much **pollution**.",
          "~~protect environment~~ → protect **the** environment (luôn the). Nhưng **nature** không the: protect nature (Ngày 1 mục 7).",
          "**weather** không đếm được: ~~an extreme weather~~ → extreme weather / **an extreme weather event**.",
          "~~the global warming~~ → **global warming**; ~~the climate change~~ → **climate change** (nói chung, không the).",
          "**damage** không đếm được: ~~cause damages to~~ → cause **damage to** the environment.",
          "**affect** (v) khác **effect** (n): Pollution **affects** health · Pollution has **an effect on** health.",
        ],
      },
      {
        t: "mcq",
        id: "t4d2-tv-nghia",
        title: "Chọn từ đúng nghĩa — Environment vòng 2 (8 câu)",
        items: [
          { q: "Building sea walls and changing crop varieties are examples of climate ___.", options: ["mitigation", "adaptation", "depletion", "degradation"], correct: 1, why: "Sống chung với hậu quả = adaptation. Cắt phát thải mới là mitigation." },
          { q: "Once the ice sheet passes a ___, the melting cannot be stopped.", options: ["heatwave", "wetland", "tipping point", "carbon tax"], correct: 2, why: "tipping point = điểm tới hạn." },
          { q: "The firm's “eco-friendly” label turned out to be pure ___.", options: ["greenwashing", "rewilding", "resilience", "reforestation"], correct: 0, why: "greenwashing = quảng cáo xanh giả." },
          { q: "The law is strict on paper, but it is rarely ___.", options: ["incentivised", "mitigated", "decarbonised", "enforced"], correct: 3, why: "enforce a law = thực thi luật." },
          { q: "In a ___, products are designed to be repaired and reused rather than thrown away.", options: ["throwaway culture", "circular economy", "tipping point", "food mile"], correct: 1, why: "circular economy = kinh tế tuần hoàn." },
          { q: "The ___ of fish stocks has left many coastal villages without work.", options: ["extinction", "erosion", "depletion", "scarcity"], correct: 2, why: "depletion of fish stocks = cạn kiệt trữ lượng cá. extinction dùng cho cả một loài." },
          { q: "Floods of this size are ___ in the country's recorded history.", options: ["unprecedented", "biodegradable", "hazardous", "voluntary"], correct: 0, why: "unprecedented = chưa từng có." },
          { q: "Diesel fumes contain several dangerous ___.", options: ["pollutions", "pollutes", "polluters", "pollutants"], correct: 3, why: "pollutant (đếm được) = chất gây ô nhiễm. pollution không có số nhiều; polluter = bên gây ô nhiễm." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Mười hai collocation cho Task 2 và Part 3" },
      {
        t: "p",
        text: "**Collocation** = những từ người bản ngữ quen ghép với nhau: nói **pose a threat**, không nói ~~make a threat~~ (nghĩa khác) hay ~~give a threat~~. Band 6 dùng đúng từ đơn; band 7 dùng đúng ==cả cụm==. Mười hai cụm dưới đây không chỉ dùng cho môi trường — đổi danh từ là dùng được cho mọi đề (sức khoẻ, giao thông, giáo dục).",
      },
      {
        t: "vocab",
        items: [
          { w: "pose a threat to", pos: "cụm v", ipa: "/pəʊz ə θret tə/", vi: "gây ra mối đe doạ đối với", ex: "Rising temperatures pose a threat to food production.", exVi: "Nhiệt độ tăng gây ra mối đe doạ đối với sản xuất lương thực.", more: "**pose** a serious / major threat **to** · pose a risk / a challenge / a problem" },
          { w: "take a toll on", pos: "cụm v", ipa: "/teɪk ə təʊl ɒn/", vi: "gây thiệt hại dần dần cho", ex: "Air pollution takes a heavy toll on public health.", exVi: "Ô nhiễm không khí gây thiệt hại nặng nề cho sức khoẻ cộng đồng.", more: "take a heavy **toll on** · dùng được khi nói: Long hours took their toll on me." },
          { w: "curb emissions", pos: "cụm v", ipa: "/kɜːb ɪˈmɪʃnz/", vi: "kiềm chế phát thải", ex: "New rules are needed to curb emissions from shipping.", exVi: "Cần quy định mới để kiềm chế phát thải từ vận tải biển.", more: "**curb** spending / pollution / the use of · = limit, rein in" },
          { w: "exacerbate the problem", pos: "cụm v", ipa: "/ɪɡˈzæsəbeɪt ðə ˈprɒbləm/", vi: "làm vấn đề trầm trọng thêm", ex: "Building more roads would only exacerbate the problem.", exVi: "Xây thêm đường sẽ chỉ làm vấn đề trầm trọng thêm.", more: "**exacerbate** inequality / tensions / the situation · = worsen, aggravate · trái nghĩa: alleviate" },
          { w: "alleviate pressure on", pos: "cụm v", ipa: "/əˈliːvieɪt ˈpreʃər ɒn/", vi: "giảm bớt áp lực lên", ex: "Better public transport would alleviate pressure on the roads.", exVi: "Giao thông công cộng tốt hơn sẽ giảm bớt áp lực lên đường sá.", more: "**alleviate** poverty / congestion / suffering · = ease, relieve" },
          { w: "strike a balance between", pos: "cụm v", ipa: "/straɪk ə ˈbæləns bɪtwiːn/", vi: "tìm điểm cân bằng giữa", ex: "Governments must strike a balance between growth and conservation.", exVi: "Chính phủ phải tìm điểm cân bằng giữa tăng trưởng và bảo tồn.", more: "**strike a balance between** A **and** B — câu kết Task 2 rất hay dùng" },
          { w: "bear the cost of", pos: "cụm v", ipa: "/beə ðə kɒst əv/", vi: "gánh chi phí của", ex: "It is usually the poor who bear the cost of environmental damage.", exVi: "Thường thì người nghèo là người gánh chi phí của thiệt hại môi trường.", more: "**bear** the cost / the burden / responsibility · bear – bore – borne" },
          { w: "reduce reliance on", pos: "cụm v", ipa: "/rɪˈdjuːs rɪˈlaɪəns ɒn/", vi: "giảm sự phụ thuộc vào", ex: "The country is trying to reduce its reliance on imported coal.", exVi: "Đất nước đang cố giảm sự phụ thuộc vào than nhập khẩu.", more: "**reliance on** = dependence on · rely on (v) · be heavily **reliant on**" },
          { w: "hold sb accountable for", pos: "cụm v", ipa: "/həʊld əˈkaʊntəbl fə/", vi: "buộc ai chịu trách nhiệm về", ex: "Companies should be held accountable for the waste they produce.", exVi: "Doanh nghiệp nên bị buộc chịu trách nhiệm về lượng rác họ tạo ra.", more: "be **held accountable for** · accountability (n) · = be held responsible for" },
          { w: "set binding targets", pos: "cụm v", ipa: "/set ˈbaɪndɪŋ ˈtɑːɡɪts/", vi: "đặt mục tiêu có tính ràng buộc", ex: "The agreement sets binding targets for every member state.", exVi: "Hiệp định đặt mục tiêu ràng buộc cho mọi nước thành viên.", more: "meet / miss a **target** · legally **binding** (ràng buộc về pháp lý)" },
          { w: "at the expense of", pos: "cụm giới từ", ipa: "/ət ði ɪkˈspens əv/", vi: "phải trả giá bằng, gây hại cho", ex: "Economic growth has often come at the expense of the environment.", exVi: "Tăng trưởng kinh tế thường phải trả giá bằng môi trường.", more: "come / be achieved **at the expense of** + N" },
          { w: "put a price on carbon", pos: "cụm v", ipa: "/pʊt ə praɪs ɒn ˈkɑːbən/", vi: "định giá carbon (bắt bên phát thải trả tiền)", ex: "Economists argue that putting a price on carbon is the fairest solution.", exVi: "Các nhà kinh tế cho rằng định giá carbon là giải pháp công bằng nhất.", more: "**put a price on** + N · carbon pricing (n) · gắn với carbon tax, emissions trading" },
        ],
      },
      {
        t: "table",
        head: ["Band 6 (đúng nhưng chung chung)", "Band 7 (collocation chính xác)"],
        rows: [
          ["Pollution is bad for people's health.", "Pollution **takes a heavy toll on** public health."],
          ["Climate change is dangerous for farmers.", "Climate change **poses a serious threat to** farmers' livelihoods."],
          ["The government should reduce the gases.", "The government should **curb emissions** from heavy industry."],
          ["This will make the problem worse.", "This will only **exacerbate the problem**."],
          ["We need to think about both the economy and the environment.", "We need to **strike a balance between** economic growth **and** environmental protection."],
          ["Companies must be responsible for their rubbish.", "Companies must be **held accountable for** the waste they produce."],
        ],
        caption: "Cùng một ý. Cột phải không “khó” hơn — chỉ chính xác hơn.",
      },
      {
        t: "note",
        title: "💡 Mẹo học collocation — sổ tay 3 cột (ôn Tập 3 Ngày 14)",
        items: [
          "Cột 1: cụm đầy đủ kèm giới từ (**take a toll on**). Cột 2: một câu về môi trường. Cột 3: ==một câu về chủ đề khác== (Long commutes take a toll on family life) — để cụm không bị “dính” vào một đề.",
          "Mỗi bài Task 2 chỉ cần 4–6 collocation dùng đúng. Nhồi 15 cụm vào 280 từ thì bài nghe như chép — giám khảo gọi là “memorised language”.",
          "Khi nói (Part 3), dùng dạng ngắn hơn: “It really takes a toll on people's health.” · “That would only make things worse” vẫn tốt hơn một cụm khó dùng sai.",
        ],
      },
      { t: "rule", formula: "V + a / the + N + giới từ: pose a threat to · take a toll on · strike a balance between · bear the cost of", vi: "Học cả cụm kèm giới từ. Đổi danh từ cuối là dùng được cho mọi đề." },
      {
        t: "mcq",
        id: "t4d2-tv-colloc",
        title: "Chọn từ đi kèm đúng (collocation) — 8 câu",
        items: [
          { q: "Plastic waste ___ a serious threat to marine life.", options: ["makes", "gives", "poses", "does"], correct: 2, why: "pose a threat to — collocation cố định." },
          { q: "Years of drought have taken a heavy ___ on the region's farmers.", options: ["toll", "cost", "price", "tax"], correct: 0, why: "take a toll on = gây thiệt hại dần." },
          { q: "Cities need to strike a ___ between development and green space.", options: ["weight", "balance", "level", "middle"], correct: 1, why: "strike a balance between A and B." },
          { q: "Cheap flights have been achieved ___ the expense of the climate.", options: ["in", "on", "by", "at"], correct: 3, why: "at the expense of." },
          { q: "Oil companies should be held ___ for the damage caused by spills.", options: ["accountable", "responsibility", "guilty", "accounting"], correct: 0, why: "be held accountable for (tính từ). responsible cũng được, nhưng responsibility là danh từ." },
          { q: "The country hopes to reduce its ___ on coal within a decade.", options: ["reliable", "reliance", "relying", "relied"], correct: 1, why: "reduce reliance on (danh từ)." },
          { q: "Subsidising petrol would only ___ the problem.", options: ["alleviate", "eliminate", "exacerbate", "mitigate"], correct: 2, why: "Trợ giá xăng làm vấn đề tệ hơn ⇒ exacerbate. Ba từ kia đều là “làm giảm”." },
          { q: "The treaty sets legally ___ targets for all signatories.", options: ["tying", "bound", "binded", "binding"], correct: 3, why: "legally binding targets = mục tiêu ràng buộc về pháp lý." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Dùng ngay: câu Task 2 và Part 3 về môi trường" },
      {
        t: "examples",
        items: [
          { en: "Contrary to popular belief, voluntary schemes rarely curb emissions; binding targets, strictly enforced, are far more effective.", vi: "Trái với điều nhiều người tin, các chương trình tự nguyện hiếm khi kiềm chế được phát thải; mục tiêu ràng buộc, được thực thi nghiêm, hiệu quả hơn nhiều." },
          { en: "Rising consumption, coupled with a throwaway culture, has led to the depletion of finite resources.", vi: "Tiêu dùng tăng, cùng với văn hoá dùng rồi vứt, đã dẫn tới sự cạn kiệt các nguồn tài nguyên có hạn." },
          { en: "Governments should intervene to ensure that polluters, not taxpayers, bear the cost of the damage.", vi: "Chính phủ nên can thiệp để bảo đảm rằng bên gây ô nhiễm, chứ không phải người nộp thuế, gánh chi phí thiệt hại." },
          { en: "(Part 3) I'd say the ultimate goal should be a circular economy, but realistically that's decades away.", vi: "(Part 3) Tôi cho rằng mục tiêu sau cùng nên là một nền kinh tế tuần hoàn, nhưng thực tế thì còn cách đó hàng chục năm." },
          { en: "(Part 3) Honestly, a lot of it is greenwashing — companies advertise one eco-friendly product and carry on as before.", vi: "(Part 3) Thật lòng mà nói, phần nhiều là “tẩy xanh” — công ty quảng cáo một sản phẩm thân thiện môi trường rồi vẫn làm như cũ." },
        ],
      },
      {
        t: "quiz",
        id: "t4d2-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
        grammar: "Dùng collocation gợi ý trong ô 💡",
        items: [
          { q: "Mực nước biển dâng gây ra mối đe doạ nghiêm trọng đối với các thành phố ven biển.", answers: ["Rising sea levels pose a serious threat to coastal cities.", "Sea-level rise poses a serious threat to coastal cities.", "Rising sea levels pose a serious threat to cities on the coast."], hint: "Rising sea levels · pose a serious threat to" },
          { q: "Chính phủ nên buộc các công ty chịu trách nhiệm về lượng rác họ tạo ra.", answers: ["The government should hold companies accountable for the waste they produce.", "Governments should hold companies accountable for the waste they produce.", "The government should hold companies accountable for the waste that they produce.", "The government should hold companies accountable for the waste they create."], hint: "hold companies accountable for · the waste they produce" },
          { q: "Chúng ta phải tìm điểm cân bằng giữa tăng trưởng kinh tế và bảo vệ môi trường.", answers: ["We must strike a balance between economic growth and environmental protection.", "We have to strike a balance between economic growth and environmental protection.", "We must strike a balance between economic growth and protecting the environment.", "We need to strike a balance between economic growth and environmental protection."], hint: "strike a balance between A and B · economic growth (không the)" },
          { q: "Trái với điều nhiều người tin, bao bì phân huỷ sinh học không loại bỏ được vấn đề.", answers: ["Contrary to popular belief, biodegradable packaging does not eliminate the problem.", "Contrary to popular belief, biodegradable packaging doesn't eliminate the problem.", "Contrary to what many people believe, biodegradable packaging does not eliminate the problem."], hint: "Contrary to popular belief · biodegradable packaging · eliminate" },
          { q: "Luật môi trường vô dụng nếu chúng không được thực thi nghiêm.", answers: ["Environmental laws are useless unless they are strictly enforced.", "Environmental laws are useless if they are not strictly enforced.", "Environmental laws are useless unless they are properly enforced.", "Environmental laws are useless if they are not properly enforced.", "Environmental laws are useless unless they are enforced strictly."], hint: "Environmental laws · unless · strictly enforced" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d2-viet",
    kind: "writing",
    title: "Viết Task 2: Band 7 trông thế nào — bốn tiêu chí, hai bài mẫu band 6 và band 7, phản biện “Granted… but…”",
    goal: "Chỉ ra được vì sao một bài Task 2 ở band 6 chứ chưa phải band 7 theo từng tiêu chí (TR · CC · LR · GRA), viết được một đoạn phản biện “nêu rồi bác” đúng khung, tự chấm bài của mình bằng bảng 12 câu hỏi và viết lại bài cũ lên band 7.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 3 Ngày 2 đã dạy “band 6 trông thế nào”, sổ lỗi theo mã và viết lại qua 3 phiên bản. Hôm nay làm đúng việc ấy ở ==band 7==: cùng một đề, hai bài mẫu band 6 và band 7 đặt cạnh nhau.",
          "**TR band 7:** lập trường rõ ==suốt bài==; mỗi ý chính được **mở rộng và chống đỡ** (không dừng ở “For example, …” một câu).",
          "**CC band 7:** ý **tiến triển** từ câu này sang câu sau; từ nối đa dạng, không máy móc Firstly – Secondly – Moreover; dùng từ chỉ lại (this, such, that decision).",
          "**LR band 7:** từ ít gặp dùng đúng collocation và đúng văn phong (bài Từ vựng hôm nay). **GRA band 7:** đa dạng câu phức, ==phần lớn câu không lỗi== (bài Ngữ pháp Ngày 1).",
          "Kỹ thuật mới: **phản biện “nêu rồi bác”** (concede and rebut) — nêu ý phía bên kia một cách công bằng, rồi chỉ ra chỗ nó bỏ sót: **Granted, … However, …**",
          "Cuối bài: bảng tự chấm 12 câu, viết một bài mới và ==viết lại bài Task 2 của Đề 6==.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bốn tiêu chí — band 6 và band 7 khác nhau ở chữ nào" },
      {
        t: "p",
        text: "Giám khảo chấm Task 2 theo bốn tiêu chí, mỗi tiêu chí 25 %: **TR** (Task Response — trả lời đề), **CC** (Coherence and Cohesion — mạch lạc và liên kết), **LR** (Lexical Resource — từ vựng), **GRA** (Grammatical Range and Accuracy — ngữ pháp). Bảng dưới tóm tắt bằng tiếng Việt các mô tả band công khai của IELTS. Hãy đọc theo hàng ngang và tìm ==chữ thay đổi==.",
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7", "Chữ quyết định"],
        rows: [
          ["**TR**", "Trả lời đủ các phần, có phần kỹ hơn phần khác; lập trường có nhưng kết luận đôi khi không rõ / lặp; ý chính liên quan nhưng **chưa phát triển đủ**", "Trả lời đủ mọi phần; lập trường **rõ suốt bài**; ý chính được **mở rộng và chống đỡ** (đôi chỗ còn khái quát)", "==mở rộng và chống đỡ==; suốt bài"],
          ["**CC**", "Xếp ý mạch lạc, có tiến triển chung; từ nối dùng được nhưng **máy móc hoặc sai**; chỉ lại (this, it) chưa luôn rõ; có chia đoạn", "Tổ chức logic, **tiến triển rõ**; phương tiện liên kết **đa dạng**, dùng hợp lý (còn chỗ thừa / thiếu); mỗi đoạn có **một chủ đề trung tâm rõ**", "==tiến triển rõ==; đa dạng"],
          ["**LR**", "Đủ từ cho đề; có thử từ ít gặp nhưng **còn sai**; lỗi chính tả / dạng từ không cản hiểu", "Đủ rộng để **linh hoạt và chính xác**; từ ít gặp dùng **có ý thức về văn phong và collocation**; thỉnh thoảng sai chọn từ / chính tả", "==collocation==; chính xác"],
          ["**GRA**", "Trộn câu đơn và câu phức; có lỗi ngữ pháp và dấu câu nhưng hiếm khi cản hiểu", "**Đa dạng** câu phức; **phần lớn câu không lỗi**; kiểm soát tốt ngữ pháp và dấu câu, còn vài lỗi", "==phần lớn câu không lỗi=="],
        ],
        caption: "Band 7 không đòi từ “khủng” hay câu rất dài. Nó đòi: ý được phát triển, mạch rõ, cụm từ chính xác, câu sạch lỗi.",
      },
      {
        t: "note",
        title: "📌 Ba hiểu lầm khiến người học kẹt ở 6.5",
        items: [
          "“Band 7 = nhiều từ khó.” Sai. Một từ khó dùng sai collocation kéo LR ==xuống==. Mười cụm thường mà đúng (play a key role, a growing number of) tốt hơn ba từ hiếm dùng lệch.",
          "“Band 7 = nhiều ý.” Sai. Ba ý mỗi ý một câu là band 6. Hai ý, mỗi ý phát triển 4–5 câu, là band 7.",
          "“Band 7 = câu thật dài.” Sai. Câu 45 từ có hai lỗi không tính là câu sạch. Giám khảo đếm ==câu không lỗi==, không đếm số mệnh đề.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Đọc đề: đếm vế (ôn Tập 3 Ngày 2 · Ngày 6)" },
      {
        t: "note",
        title: "📌 Đề dùng cho cả bài hôm nay",
        items: [
          "**Some people think that environmental problems are too big for individuals to solve, and that only governments and large companies can make a real difference. To what extent do you agree or disagree?**",
          "Write at least 250 words. (40 phút)",
        ],
      },
      {
        t: "table",
        head: ["Vế", "Chữ trong đề", "Bài viết phải làm gì"],
        rows: [
          ["①", "environmental problems", "Nói về vấn đề môi trường (không lạc sang “vấn đề xã hội” chung chung)"],
          ["②", "**too big for individuals to solve**", "Bàn về sức của CÁ NHÂN: cá nhân có giải quyết được không? có vai trò gì?"],
          ["③", "**only** governments and large companies", "Chữ **only** là chữ dễ bị bỏ sót nhất: đồng ý “chính phủ quan trọng” chưa phải là đồng ý “CHỈ chính phủ”"],
          ["④", "make a **real** difference", "Bàn về tác động ĐÁNG KỂ, không phải mọi tác động nhỏ"],
          ["⑤", "To what extent do you agree or disagree?", "Nêu mức độ đồng ý ngay ở mở bài và giữ suốt bài"],
        ],
        caption: "Lập trường hợp lý nhất cho đề có “only”: đồng ý một phần — công nhận ②④ (cá nhân không tự giải quyết nổi) nhưng bác ③ (không phải CHỈ chính phủ và doanh nghiệp).",
      },
      {
        t: "mcq",
        id: "t4d2-viet-de",
        title: "Kiểm tra — đọc đề (4 câu)",
        items: [
          { q: "Một bài chỉ viết “Governments have more power than individuals, so they are important” đã trả lời đủ đề chưa?", options: ["Rồi, vì đã nói chính phủ quan trọng", "Chưa — chưa xử lý chữ “only” và chưa bàn cá nhân có vai trò gì", "Rồi, nếu có thêm ví dụ", "Chưa, vì thiếu số liệu"], correct: 1, why: "Đề khẳng định CHỈ chính phủ và doanh nghiệp mới tạo khác biệt. Phải bàn cả vế “individuals”." },
          { q: "Mở bài nào nêu lập trường rõ nhất?", options: ["This essay will discuss both sides of this issue.", "There are many opinions about this topic.", "While I accept that these institutions hold most of the power, I do not believe that individuals are therefore irrelevant.", "Environmental problems are very serious nowadays."], correct: 2, why: "Câu này cho biết ngay: đồng ý phần nào (institutions hold most of the power) và không đồng ý phần nào (individuals irrelevant)." },
          { q: "Với lập trường “đồng ý một phần”, thân bài nên chia thế nào?", options: ["Thân bài 1: phần tôi công nhận · Thân bài 2: phần tôi phản bác (và vì sao)", "Thân bài 1: ô nhiễm không khí · Thân bài 2: ô nhiễm nước", "Thân bài 1: ý kiến người khác · Thân bài 2: không có ý kiến của tôi", "Một thân bài duy nhất thật dài"], correct: 0, why: "Mỗi thân bài một việc: công nhận rồi phản bác — lập trường xuất hiện ở cả hai." },
          { q: "Kết bài band 7 cần gì?", options: ["Thêm một ý mới chưa nói ở thân bài", "Chép lại nguyên văn mở bài", "Một câu hỏi tu từ", "Nhắc lại lập trường bằng lời khác + gói hai ý chính trong 1–2 câu"], correct: 3, why: "Kết bài không thêm ý mới; lập trường phải trùng với mở bài (TR: “rõ suốt bài”)." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Hai bài mẫu cùng đề — band 6 và band 7 đặt cạnh nhau" },
      {
        t: "p",
        text: "Đọc bài band 6 trước. Bài này ==không tệ==: đủ từ, có lập trường, có chia đoạn, ý liên quan. Hãy tự hỏi: vì sao nó chưa lên được band 7? Ghi ra 3 lý do rồi mới đọc bài band 7 và bảng ở mục 4. Band ghi ở đây là ước tính.",
      },
      {
        t: "passage",
        title: "Bài mẫu band 6 (ước tính) — 260 từ",
        paras: [
          { label: "1", text: "Nowadays, environmental problems are becoming more and more serious. Some people think that these problems are too big for individuals and only governments and big companies can solve them. I partly agree with this opinion." },
          { label: "2", text: "Firstly, governments and big companies have more power than individuals. Governments can make laws to protect the environment. For example, they can ban plastic bags or make factories pay money if they pollute. Big companies also produce a lot of pollution, so if they change, the environment will be better. Moreover, the environmental problems like climate change are global problems, so it needs the cooperation between many countries, and only governments can sign international agreements. One person cannot do these things. Therefore, governments and companies are very important to solve environmental problems." },
          { label: "3", text: "Secondly, individuals can also do many things to help the environment. For example, people can use public transport, save electricity and recycle their rubbish. Although each action is small, the number of people is very large. If everybody do these small things, it will make a big difference. Moreover, individuals can choose to buy products from the companies which are friendly with the environment. In my country, many young people bring their own bottles instead of buying plastic bottles, and my friends and I also do this. This shows that individuals can also solve environmental problems." },
          { label: "4", text: "In conclusion, I think both governments, companies and individuals are important. Governments and big companies have more power, but individuals should also try their best in their daily life to protect the environment for the next generations." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 – 7.5 (ước tính) — 292 từ",
        paras: [
          { label: "1", text: "It is often argued that environmental damage has reached a scale at which the choices of ordinary people no longer matter, and that meaningful change can come only from governments and large corporations. While I accept that these institutions hold most of the power, I do not believe that individuals are therefore irrelevant." },
          { label: "2", text: "There is no denying that the largest sources of pollution lie beyond the reach of any single household. A family can switch off its lights, but it cannot decide whether its electricity comes from coal or from wind; that decision is taken by energy companies and the ministers who regulate them. Legislation works on a similar scale. When a government imposes a tax on carbon or prohibits single-use plastics, millions of people and thousands of firms change their behaviour at once, which is something no amount of personal effort could achieve." },
          { label: "3", text: "Granted, this seems to leave little room for the individual. However, such a conclusion overlooks where the pressure on governments and companies comes from. Politicians respond to voters, and businesses respond to customers. Supermarkets in many countries began to cut plastic packaging not because the law required it, but because shoppers complained and bought elsewhere. In the same way, a government that knows its citizens care about clean air is far more likely to enforce its own regulations. Individual action, in other words, matters less for the emissions it saves directly than for the signal it sends to those with real power." },
          { label: "4", text: "In conclusion, governments and corporations are undoubtedly the only actors able to deliver change on the necessary scale, but they rarely act unless ordinary people push them to do so. For this reason, I would argue that individuals are not powerless; their role is simply indirect." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khác nhau ở đâu? — chấm hai bài theo bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**TR** — lập trường", "“I partly agree” — nhưng không nói đồng ý phần NÀO. Kết bài thành “both… are important”: né chữ **only** của đề.", "Mở bài nói rõ công nhận gì, bác gì. Kết bài nhắc lại đúng lập trường ấy: “not powerless; their role is simply indirect”."],
          ["**TR** — phát triển ý", "Thân bài 2 có **4 ý nhỏ** (đi xe buýt, tiết kiệm điện, tái chế, mua hàng xanh), mỗi ý một câu. Ví dụ “bring their own bottles” không cho thấy vì sao điều đó tạo ra “real difference”.", "Thân bài 2 có **1 ý**: cá nhân tạo áp lực lên bên có quyền. Ý ấy được giải thích cơ chế (voters / customers) → ví dụ (siêu thị) → ví dụ thứ hai (chính phủ) → câu chốt."],
          ["**CC** — tiến triển", "Firstly / Secondly / Moreover / Therefore / For example ở đầu gần như mọi câu. Các câu đứng cạnh nhau như một danh sách.", "Câu sau nối vào câu trước bằng từ chỉ lại: **that decision**, **such a conclusion**, **this**, **In the same way**, **in other words**. Thân bài 2 mở bằng cách phản hồi thân bài 1 (Granted, this seems…)."],
          ["**CC** — chỉ lại", "“so **it** needs the cooperation” — it chỉ cái gì? (problems số nhiều).", "Mỗi this / that / such đi kèm một danh từ tóm ý (decision, conclusion) nên luôn rõ."],
          ["**LR**", "more and more serious · big companies (4 lần) · solve environmental problems (3 lần) · make factories pay money · friendly with the environment (sai collocation).", "has reached a scale · beyond the reach of · imposes a tax on · prohibits · enforce its own regulations · deliver change — cụm chính xác, không lặp."],
          ["**GRA**", "Chủ yếu câu đơn và câu ghép với so / but / if. Lỗi: ~~everybody do~~ · ~~the environmental problems like~~ · ~~it needs~~ · ~~both A, B and C~~ · ~~the companies which~~ · ~~important to solve~~.", "Mệnh đề quan hệ, câu nhượng bộ (While…), not because… but because…, so sánh (matters less for… than for…), dấu chấm phẩy dùng đúng. Không có câu nào lỗi."],
        ],
        caption: "Hai bài dùng gần như CÙNG một quan điểm. Khác biệt không nằm ở “ý hay hơn” mà ở cách phát triển, nối và diễn đạt.",
      },
      {
        t: "table",
        head: ["Câu trong bài band 6", "Lỗi / chỗ yếu", "Sửa"],
        rows: [
          ["the environmental problems like climate change are global problems", "Mạo từ (Ngày 1 lỗi ①): nói chung ⇒ không the", "**Environmental problems** such as climate change are global"],
          ["so it needs the cooperation between many countries", "it không khớp problems; cooperation nói chung ⇒ không the", "so **they require cooperation** between many countries"],
          ["If everybody do these small things", "everybody + động từ số ít", "If everybody **does** these small things"],
          ["the companies which are friendly with the environment", "Mạo từ thừa; collocation", "**companies** that are **environmentally friendly** / eco-friendly companies"],
          ["both governments, companies and individuals", "both chỉ dùng cho HAI thứ", "governments, companies and individuals **all** play a part"],
          ["are very important to solve environmental problems", "important + to V không tự nhiên ở đây", "**play a key role in solving** environmental problems"],
          ["for the next generations", "Cụm cố định", "for **future generations**"],
        ],
        caption: "Bảy lỗi trong 260 từ — mỗi lỗi nhỏ, không cản hiểu. Đây chính là “lỗi hiếm khi cản hiểu” của band 6. Band 7 cho phép khoảng 2–3 lỗi kiểu này.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. TR band 7: một ý được “mở rộng và chống đỡ” trông thế nào" },
      {
        t: "p",
        text: "Band 6 viết theo kiểu ==ý – ví dụ – ý – ví dụ==. Band 7 viết theo kiểu ==một ý đi xuống ba tầng==: ① nêu ý (câu chủ đề) → ② giải thích **cơ chế** (vì sao / bằng cách nào ý ấy đúng) → ③ **ví dụ cụ thể** hoặc hệ quả → ④ câu chốt nối về đề. Ngày 4 sẽ luyện kỹ thang ba tầng này; hôm nay chỉ cần nhận ra nó.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Thân bài band 7 — một ý, ba tầng, một câu chốt",
        steps: [
          { label: "① Câu chủ đề", sub: "…such a conclusion overlooks where the pressure on governments and companies comes from." },
          { label: "② Cơ chế (vì sao?)", sub: "Politicians respond to voters, and businesses respond to customers." },
          { label: "③ Ví dụ cụ thể", sub: "Supermarkets… began to cut plastic packaging… because shoppers complained and bought elsewhere." },
          { label: "④ Câu chốt nối về đề", sub: "Individual action… matters less for the emissions it saves directly than for the signal it sends…" },
        ],
        caption: "Phép thử: che ví dụ đi — đoạn văn còn đứng được không? Nếu còn (nhờ tầng ②) thì ý đã được chống đỡ.",
      },
      {
        t: "table",
        head: ["", "Band 6", "Band 7"],
        rows: [
          ["Số ý chính / thân bài", "3–4 ý nhỏ", "1 ý (tối đa 2)"],
          ["Sau câu chủ đề", "“For example, …” ngay", "Một câu giải thích cơ chế, rồi mới ví dụ"],
          ["Ví dụ", "Chung chung: “In my country, many people…”", "Cụ thể: ai, làm gì, vì sao, kết quả gì"],
          ["Câu cuối đoạn", "“This shows that individuals can also solve environmental problems.” (lặp đề)", "Rút ra điều MỚI nối về đề"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi cố “phát triển ý”",
        items: [
          "Kéo dài bằng cách ==nói lại== ý cũ bằng lời khác (“It is very important. It plays a key role. It is essential.”). Dài hơn nhưng không sâu hơn.",
          "Ví dụ bịa số liệu: “According to a 2019 study by Oxford University, 73 % of…”. Giám khảo không trừ điểm vì bịa, nhưng cũng không cộng — và nghe rất giả. Dùng ví dụ đời thật, không cần số.",
          "Ví dụ không chứng minh câu chủ đề: câu chủ đề nói “cá nhân tạo ra khác biệt lớn”, ví dụ lại là “tôi tắt đèn khi ra khỏi phòng”.",
          "Hai thân bài không cân: thân bài 1 dài 120 từ, thân bài 2 chỉ 50 từ ⇒ “có phần kỹ hơn phần khác” = band 6.",
        ],
      },
      { t: "rule", formula: "Câu chủ đề → cơ chế (vì sao / bằng cách nào) → ví dụ cụ thể → câu chốt nối về đề", vi: "Một thân bài = một ý đi xuống ba tầng, không phải ba ý nằm ngang." },

      /* ── 6 ── */
      { t: "h", text: "6. ★ Phản biện “nêu rồi bác”: Granted… / Admittedly… / It is true that… — but…" },
      {
        t: "p",
        text: "Người viết band 7 không giả vờ rằng phía bên kia không tồn tại. Họ ==nêu ý đối lập một cách công bằng== (concede — nhượng bộ), rồi ==chỉ ra chỗ nó sai hoặc bỏ sót== (rebut — bác lại). Kỹ thuật này làm ba việc cùng lúc: cho thấy bạn đã cân nhắc (TR), tạo một bước tiến rõ trong lập luận (CC), và dùng được cấu trúc nhượng bộ (GRA). Bài mẫu band 7 dùng nó ở đầu thân bài 2: “**Granted**, this seems to leave little room for the individual. **However**, such a conclusion overlooks…”",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Granted, / Admittedly, / Of course, + S + V. However, / Nevertheless, / Yet + S + V.",
            vi: "Hai câu: câu 1 công nhận, câu 2 bác. Granted = “công nhận là…”.",
            examples: [
              { en: "Granted, recycling requires time and effort. However, the alternative is to bury the same waste for centuries.", vi: "Công nhận là tái chế tốn thời gian và công sức. Tuy nhiên, lựa chọn còn lại là chôn chính số rác ấy hàng thế kỷ." },
              { en: "Admittedly, electric cars are still expensive. Nevertheless, their price has fallen every year for a decade.", vi: "Phải thừa nhận xe điện vẫn đắt. Dù vậy, giá của chúng đã giảm mỗi năm suốt một thập kỷ." },
            ],
          },
          {
            formula: "It is true that + S + V, but + S + V.",
            vi: "Một câu, trung tính, dễ dùng nhất — cả khi nói.",
            examples: [
              { en: "It is true that a carbon tax raises prices, but the revenue can be returned to low-income households.", vi: "Đúng là thuế carbon làm tăng giá, nhưng nguồn thu có thể trả lại cho các hộ thu nhập thấp." },
            ],
          },
          {
            formula: "While / Although it may be argued that + S + V, + S + V.",
            vi: "Một câu phức; ý của mình nằm ở mệnh đề chính (phía sau).",
            examples: [
              { en: "While it may be argued that individuals are powerless, this view ignores their influence as voters and consumers.", vi: "Dù có thể lập luận rằng cá nhân bất lực, quan điểm này bỏ qua ảnh hưởng của họ với tư cách cử tri và người tiêu dùng." },
            ],
          },
          {
            formula: "Critics / Opponents might object that + S + V. This objection, however, + overlooks / ignores / rests on …",
            vi: "Nêu rõ “người phản đối sẽ nói gì”, rồi gọi tên chỗ yếu của lời phản đối.",
            examples: [
              { en: "Critics might object that such a ban would cost jobs. This objection, however, overlooks the employment created by new industries.", vi: "Người phản đối có thể nói lệnh cấm như vậy sẽ làm mất việc làm. Tuy nhiên, lời phản đối này bỏ qua số việc làm do các ngành mới tạo ra." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Động từ để BÁC", "Nghĩa", "Ví dụ"],
        rows: [
          ["overlook / ignore", "bỏ sót", "This argument **overlooks** the long-term costs."],
          ["rest on the assumption that", "dựa trên giả định rằng", "It **rests on the assumption that** people always act rationally."],
          ["fail to take into account", "không tính tới", "It **fails to take into account** those who cannot afford a car."],
          ["does not necessarily follow / mean that", "không nhất thiết dẫn tới", "It **does not necessarily follow that** the policy should be abandoned."],
          ["is outweighed by", "bị lấn át bởi (ôn Tập 3 Ngày 14)", "This drawback **is outweighed by** the benefits to public health."],
          ["holds only if", "chỉ đúng nếu", "This **holds only if** the law is properly enforced."],
        ],
        caption: "Sau khi nhượng bộ, đừng chỉ viết “but I disagree”. Hãy nói lời phản đối ấy SAI Ở ĐÂU.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Một đoạn “nêu rồi bác” — 4 bước, 70–90 từ",
        steps: [
          { label: "1. Nêu ý đối lập (công bằng)", sub: "Granted, / Admittedly, / It is true that…" },
          { label: "2. Bẻ lái", sub: "However, / Nevertheless, / Yet / but" },
          { label: "3. Chỉ ra chỗ sai / bỏ sót", sub: "this overlooks… / this rests on the assumption that…" },
          { label: "4. Chống đỡ lời bác", sub: "một lý do hoặc một ví dụ cụ thể" },
        ],
        caption: "Đặt ở đâu? (a) đầu thân bài 2 — như bài mẫu; hoặc (b) cuối thân bài 2, ngay trước kết bài. Một bài chỉ cần MỘT lần.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với phản biện",
        items: [
          "Nhượng bộ xong ==quên bác==: “Admittedly, cars are convenient.” rồi sang ý khác ⇒ người đọc tưởng bạn đổi phe. Luôn có however / but + lời bác ngay sau.",
          "Dùng **although** và **but** trong cùng một câu: ~~Although it is expensive, but it is effective~~ → bỏ but.",
          "**Granted** đứng đầu câu, có dấu phẩy, theo sau là một ==câu đủ== (S + V): ~~Granted that expensive~~ → Granted, it is expensive.",
          "Bác bằng cách dựng “người rơm” — nêu ý đối lập thật ngớ ngẩn để dễ đánh (“Some people think we should do nothing about pollution”). Giám khảo thấy ngay. Hãy nêu ý đối lập ở dạng MẠNH nhất của nó.",
          "Nhượng bộ quá nhiều: ba câu công nhận, một câu bác ⇒ lập trường mờ đi. Tỉ lệ nên là 1 câu nêu – 2 đến 3 câu bác.",
          "Nhầm **On the contrary** (bác ý vừa nêu là sai) với **On the other hand** (nêu mặt còn lại). Sau câu nhượng bộ dùng However / Nevertheless.",
        ],
      },
      { t: "rule", formula: "Granted, / Admittedly, + S + V. However, + S + V (this overlooks / ignores / rests on …)", vi: "Nêu ý đối lập ở dạng mạnh nhất → bẻ lái → nói nó sai ở đâu → chống đỡ. Mỗi bài một lần." },
      {
        t: "quiz",
        id: "t4d2-viet-phan-bien-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu “nêu rồi bác” (5 câu)",
        grammar: "Granted, / Admittedly, / It is true that … + However / but …",
        items: [
          { q: "Công nhận là năng lượng tái tạo vẫn còn đắt. Tuy nhiên, giá của nó đang giảm nhanh. (Granted)", answers: ["Granted, renewable energy is still expensive. However, its price is falling rapidly.", "Granted, renewable energy is still expensive. However, its price is falling quickly.", "Granted, renewable energy is still expensive. However, its price is falling fast.", "Granted, renewable energy is still expensive. However, the price is falling rapidly.", "Granted, renewable energy is still expensive. However, its cost is falling rapidly."], hint: "Granted, … However, its price is falling rapidly" },
          { q: "Đúng là cá nhân không thể tự thay đổi luật, nhưng họ có thể bầu những người làm ra luật. (It is true that)", answers: ["It is true that individuals cannot change the law themselves, but they can vote for the people who make it.", "It is true that individuals cannot change the law by themselves, but they can vote for the people who make it.", "It is true that individuals cannot change laws themselves, but they can vote for the people who make them.", "It is true that individuals cannot change the law on their own, but they can vote for the people who make it.", "It is true that individuals cannot change the law themselves, but they can elect the people who make it.", "It is true that individuals cannot change laws by themselves, but they can vote for the people who make them."], hint: "It is true that … , but they can vote for the people who make it" },
          { q: "Dù có thể lập luận rằng thuế carbon gây hại cho người nghèo, quan điểm này bỏ qua cách nguồn thu được sử dụng.", answers: ["While it may be argued that a carbon tax harms the poor, this view ignores how the revenue is used.", "Although it may be argued that a carbon tax harms the poor, this view ignores how the revenue is used.", "While it may be argued that a carbon tax harms the poor, this view overlooks how the revenue is used.", "Although it may be argued that a carbon tax harms the poor, this view overlooks how the revenue is used.", "While it may be argued that a carbon tax hurts the poor, this view ignores how the revenue is used.", "While it may be argued that carbon taxes harm the poor, this view ignores how the revenue is used.", "While it may be argued that a carbon tax harms poor people, this view ignores how the revenue is used."], hint: "While it may be argued that … , this view ignores / overlooks how the revenue is used" },
          { q: "Phải thừa nhận rằng lệnh cấm này sẽ làm mất một số việc làm. Dù vậy, lợi ích cho sức khoẻ cộng đồng lớn hơn nhiều. (Admittedly)", answers: ["Admittedly, this ban will cost some jobs. Nevertheless, the benefits to public health are far greater.", "Admittedly, this ban would cost some jobs. Nevertheless, the benefits to public health are far greater.", "Admittedly, this ban will cost some jobs. Nevertheless, the benefits for public health are far greater.", "Admittedly, this ban will cost some jobs. However, the benefits to public health are far greater.", "Admittedly, this ban will cost some jobs. Nevertheless, the benefits to public health are much greater.", "Admittedly, this ban will lead to some job losses. Nevertheless, the benefits to public health are far greater."], hint: "Admittedly, … cost some jobs. Nevertheless, the benefits to public health are far greater" },
          { q: "Lập luận này dựa trên giả định rằng người tiêu dùng luôn chọn sản phẩm rẻ nhất.", answers: ["This argument rests on the assumption that consumers always choose the cheapest product.", "This argument rests on the assumption that consumers always choose the cheapest products.", "This argument is based on the assumption that consumers always choose the cheapest product.", "This argument rests on the assumption that consumers will always choose the cheapest product."], hint: "rests on the assumption that · the cheapest product" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. CC band 7: tiến triển và từ chỉ lại thay cho Firstly – Secondly – Moreover" },
      {
        t: "p",
        text: "Band 6 nối câu bằng ==từ nối đứng đầu câu==. Band 7 nối bằng ==nội dung==: câu sau nhặt lại một ý của câu trước rồi đi tiếp. Công cụ chính là **this / these / such / that + danh từ tóm ý** (summary noun): this approach, such measures, that decision, this trend, these concerns. Từ nối vẫn dùng — nhưng ít hơn, đa dạng hơn, và không phải câu nào cũng có. (Ngày 12 sẽ luyện riêng cohesion band 7; hôm nay học đủ để tự chấm.)",
      },
      {
        t: "table",
        head: ["Công cụ", "Band 6", "Band 7"],
        rows: [
          ["Mở thân bài", "Firstly, … / Secondly, …", "There is no denying that… / Granted, this seems… (phản hồi đoạn trước)"],
          ["Thêm ý", "Moreover, … / In addition, … (đầu mọi câu)", "Legislation works on a similar scale. / In the same way, …"],
          ["Chỉ lại", "it / they (không rõ chỉ gì)", "**that decision** · **such a conclusion** · **this approach** · **these measures**"],
          ["Giải thích lại", "It means that…", "…, **in other words**, … / **That is**, …"],
          ["Kết quả", "Therefore, … / So…", "…, **which** means that… / As a result, … / For this reason, …"],
          ["Đối lập", "But… / However, … (đầu câu)", "…; **however**, … / Yet… / …, **whereas**… / **not because**… **but because**…"],
        ],
        caption: "Đếm từ nối đứng đầu câu trong 2 thân bài: bài band 6 có 7 (Firstly, For example, Moreover, Therefore, Secondly, For example, Moreover); bài band 7 chỉ 3 (Granted, However, In the same way) — còn lại nối bằng chỉ lại: that decision · this · such a conclusion.",
      },
      {
        t: "table",
        head: ["Danh từ tóm ý", "Dùng để chỉ lại", "Ví dụ"],
        rows: [
          ["this **approach / policy / measure / strategy**", "một giải pháp vừa nêu", "Many cities now charge drivers to enter the centre. **This approach** has cut traffic noticeably."],
          ["this **trend / shift / development**", "một thay đổi vừa nêu", "Young people are buying fewer cars. **This trend** is likely to continue."],
          ["this **view / claim / argument / assumption**", "một ý kiến vừa nêu", "Some say technology will solve everything. **This assumption** is risky."],
          ["this **problem / issue / difficulty / concern**", "một vấn đề vừa nêu", "Rents have doubled. **This issue** affects students most."],
          ["such **measures / behaviour / schemes**", "loại việc vừa nêu (trang trọng)", "The city planted 10,000 trees. **Such measures** are cheap and popular."],
        ],
        caption: "Danh từ tóm ý nằm sẵn trong AWL: approach, policy, trend, issue, assumption, factor, process, phenomenon.",
      },
      {
        t: "quiz",
        id: "t4d2-viet-chi-lai",
        kind: "fill",
        title: "Điền MỘT danh từ tóm ý phù hợp: approach · trend · assumption · measures · decision · phenomenon (6 câu)",
        items: [
          { q: "The council banned cars from the old town last year. This ___ was unpopular at first, but most residents now support it.", answers: ["decision"], hint: "Việc hội đồng đã quyết" },
          { q: "More and more people are choosing to live alone. This ___ has increased the demand for small flats.", answers: ["trend"], hint: "Một xu hướng" },
          { q: "Some firms pay staff a bonus for cycling to work, and others offer free bus passes. Such ___ cost little and reduce congestion.", answers: ["measures"], hint: "such + danh từ số nhiều" },
          { q: "Many people believe that economic growth always harms the environment. This ___ is not supported by the evidence.", answers: ["assumption"], hint: "Một điều người ta tin mà chưa chứng minh" },
          { q: "In some cities, rainfall has become heavier but less frequent. This ___ is still not fully understood.", answers: ["phenomenon"], hint: "Một hiện tượng (số ít)" },
          { q: "One country taxes carbon and returns most of the money to households. This ___ could be copied elsewhere.", answers: ["approach"], hint: "Một cách làm" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. LR và GRA band 7: chính xác trước, hiếm sau" },
      {
        t: "table",
        head: ["Band 6 trong bài mẫu", "Vấn đề", "Band 7"],
        rows: [
          ["big companies (×4)", "Lặp; big hơi khẩu ngữ", "large corporations · major firms · the private sector · industry"],
          ["solve environmental problems (×3)", "Lặp nguyên cụm của đề", "tackle / address environmental damage · deliver change · curb emissions"],
          ["make laws", "Đúng nhưng đơn giản", "pass / introduce legislation · impose a tax on · prohibit"],
          ["make factories pay money if they pollute", "Diễn đạt vòng", "fine polluters · apply the polluter pays principle"],
          ["friendly with the environment", "Sai collocation", "environmentally friendly · sustainable"],
          ["very important", "Yếu", "play a key role in · be essential to · be central to"],
          ["do many things to help", "Mơ hồ", "contribute to · put pressure on · influence"],
        ],
        caption: "Mọi cụm cột phải đều có trong bài Từ vựng hôm nay hoặc Tập 3. Không cụm nào “hiếm” — chúng chỉ đúng.",
      },
      {
        t: "table",
        head: ["Cấu trúc (GRA band 7)", "Câu trong bài mẫu band 7", "Học kỹ ở"],
        rows: [
          ["Nhượng bộ: While + S + V, S + V", "While I accept that these institutions hold most of the power, I do not believe…", "Tập 3 Ngày 21"],
          ["Cụm danh từ + giới từ + which (bổ nghĩa sau)", "a scale at which the choices of ordinary people no longer matter", "Ngày 1 mục 4 · Tập 3 Ngày 17"],
          ["Mệnh đề quan hệ không xác định với which", "…change their behaviour at once, which is something no amount of personal effort could achieve.", "Tập 3 Ngày 17"],
          ["not because… but because…", "…not because the law required it, but because shoppers complained…", "hôm nay"],
          ["So sánh hai vế: less for A than for B", "matters less for the emissions it saves directly than for the signal it sends…", "Ngày 9"],
          ["Dấu chấm phẩy nối hai mệnh đề liên quan", "…individuals are not powerless; their role is simply indirect.", "Tập 3 Ngày 27"],
        ],
        caption: "Sáu kiểu câu khác nhau trong 292 từ = “đa dạng câu phức”. Quan trọng hơn: cả sáu đều sạch lỗi.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: bốn cách “lên band 7” phản tác dụng",
        items: [
          "Nhồi từ học thuộc không hợp ngữ cảnh: ~~a plethora of~~, ~~in this day and age~~, ~~every coin has two sides~~. Giám khảo coi là ngôn ngữ thuộc lòng.",
          "Dùng từ trang trọng sai collocation: ~~commit pollution~~, ~~do a contribution~~, ~~a big amount of people~~. Kiểm lại trong bảng collocation trước khi dùng.",
          "Câu quá dài để “phức”: trên 35 từ thì tách. Một câu 20 từ sạch lỗi có giá hơn một câu 45 từ có một lỗi mạo từ.",
          "Dùng thể bị động và danh hoá ở mọi câu ⇒ bài nặng, khó đọc (Ngày 21 sẽ nói kỹ về “danh hoá quá đà”).",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Tự chấm, sổ lỗi, viết lại — bản band 7 (nối Tập 3 Ngày 2)" },
      {
        t: "table",
        head: ["#", "Câu hỏi tự chấm", "Tiêu chí", "Nếu “chưa” thì"],
        rows: [
          ["1", "Mở bài có nói rõ tôi đồng ý / không đồng ý với PHẦN NÀO của đề không?", "TR", "Viết lại câu luận điểm (thesis statement)"],
          ["2", "Tôi đã xử lý mọi vế của đề, kể cả chữ only / best / all?", "TR", "Đếm vế lại (mục 2)"],
          ["3", "Mỗi thân bài chỉ có 1–2 ý, mỗi ý có cơ chế + ví dụ cụ thể?", "TR", "Bỏ bớt ý, thêm tầng ② ③ (mục 5)"],
          ["4", "Kết bài có cùng lập trường với mở bài, không thêm ý mới?", "TR", "Viết lại kết bài 2 câu"],
          ["5", "Có một chỗ “nêu rồi bác” không?", "TR · CC", "Thêm 2–3 câu Granted… However… (mục 6)"],
          ["6", "Mỗi đoạn có một chủ đề trung tâm, nêu ở câu đầu?", "CC", "Viết lại câu chủ đề"],
          ["7", "Số từ nối đứng đầu câu ≤ 4 trong cả hai thân bài?", "CC", "Thay bằng this / such + danh từ tóm ý (mục 7)"],
          ["8", "Mọi this / it / they đều rõ chỉ cái gì?", "CC", "Thêm danh từ tóm ý sau this"],
          ["9", "Có 4–6 collocation chính xác; không cụm nào lặp quá 2 lần?", "LR", "Dùng bảng mục 8 + bài Từ vựng"],
          ["10", "Không có cụm thuộc lòng sáo rỗng (every coin has two sides…)?", "LR", "Xoá"],
          ["11", "Có ít nhất 4 kiểu câu phức khác nhau?", "GRA", "Đổi 2 câu đơn thành câu nhượng bộ / quan hệ"],
          ["12", "Soát mạo từ – số ít / nhiều – chia động từ: còn ≤ 3 lỗi?", "GRA", "Soát 4 bước của Ngày 1 mục 2"],
        ],
        caption: "12 “rồi” ≈ band 7. Mỗi “chưa” ở câu 1–5 nặng hơn một “chưa” ở câu 9–12: TR không đạt thì từ đẹp không cứu được.",
      },
      {
        t: "table",
        head: ["Bản", "Thân bài 2 của bài band 6 — viết lại", "Lý do sửa"],
        rows: [
          ["Gốc (band 6)", "Secondly, individuals can also do many things to help the environment. For example, people can use public transport, save electricity and recycle their rubbish. … This shows that individuals can also solve environmental problems.", "4 ý nhỏ, không ý nào được chống đỡ; câu cuối lặp đề"],
          ["Bản 2 — sửa TR", "Individuals can nevertheless make a difference, mainly through what they buy. When enough customers refuse a product, companies notice. In my city, several coffee chains now give a discount to customers who bring their own cup, because so many young people were already doing so. This shows that small choices, repeated by thousands of people, can change how a business behaves.", "Giữ MỘT ý (sức mua); thêm cơ chế (companies notice) + ví dụ cụ thể (chuỗi cà phê) + câu chốt rút ra điều mới"],
          ["Bản 3 — sửa CC · LR · GRA", "Granted, no single shopper can change a company's policy. However, this overlooks the effect of thousands of shoppers making the same choice. When enough customers reject a product, sales fall and firms respond. In my city, several coffee chains began offering a discount for reusable cups only after young customers had started bringing their own. Such examples suggest that consumer pressure, although indirect, can reshape the way businesses behave.", "Thêm “nêu rồi bác”; chỉ lại bằng this / such examples; collocation (reject a product, consumer pressure, reshape); quá khứ hoàn thành đúng chỗ; không còn lỗi"],
        ],
        caption: "Mỗi lượt viết lại chỉ sửa MỘT nhóm tiêu chí và ghi lý do — đúng cách Tập 3 Ngày 2 đã dạy, nay đích là band 7.",
      },
      {
        t: "note",
        title: "💡 Sổ lỗi ở Tập 4 — thêm ba mã mới",
        items: [
          "Giữ tám mã của Tập 3 Ngày 2 (**A** mạo từ · **S** số ít / nhiều · **T** thì · **P** giới từ · **W** từ · **L** từ nối · **C** câu · **I** ý). Ở band 7 tách thêm ba mã: **DEV** = ý chưa phát triển, thiếu cơ chế / ví dụ (tách từ I) · **COL** = sai collocation (tách từ W) · **REF** = this / it không rõ chỉ gì.",
          "Sau mỗi bài AI chấm: chép 3 lỗi nặng nhất vào sổ kèm mã và câu đã sửa. Trước khi viết bài sau, đọc lại 3 dòng gần nhất.",
          "Mỗi tuần viết lại MỘT bài cũ thay vì viết thêm bài mới. Người kẹt ở 6.5 thường viết nhiều nhưng không viết lại.",
        ],
      },
      {
        t: "mcq",
        id: "t4d2-viet-chon",
        title: "Kiểm tra — band 6 hay band 7? (6 câu)",
        items: [
          { q: "Đoạn nào cho thấy ý được “mở rộng và chống đỡ”?", options: ["Cycling is healthy. It is also cheap. Moreover, it is good for the environment.", "Cycling cuts congestion because each bike replaces a car on the road; when my university opened a bike lane to the main campus, the queue of cars at the gate at 8 a.m. became visibly shorter within one term.", "Cycling is very good. For example, many people cycle in my country.", "Firstly, cycling. Secondly, walking. Thirdly, buses."], correct: 1, why: "Một ý (giảm tắc đường) + cơ chế (mỗi xe đạp thay một ô tô) + ví dụ cụ thể. Ba phương án kia là danh sách ý." },
          { q: "Câu nào nối với câu trước bằng danh từ tóm ý?", options: ["Moreover, it is useful.", "Therefore, this is good.", "This approach has since been copied by several other cities.", "In addition, they did it."], correct: 2, why: "this + approach (danh từ tóm ý) chỉ lại rõ ràng việc vừa nêu." },
          { q: "Chọn câu “nêu rồi bác” đúng ngữ pháp.", options: ["Although nuclear power is risky, but it produces no carbon.", "Granted nuclear power risky. However it produces no carbon.", "Admittedly nuclear power is risky, on the contrary it produces no carbon.", "Admittedly, nuclear power carries risks. However, it produces almost no carbon."], correct: 3, why: "Admittedly, + câu đủ. However, + câu bác. Câu đầu thừa but; câu hai thiếu động từ và dấu phẩy; câu ba dùng sai on the contrary." },
          { q: "Cụm nào là collocation đúng?", options: ["tackle the problem", "do a solution", "commit pollution", "make a damage"], correct: 0, why: "tackle / address a problem. Các cụm kia: find a solution · cause pollution · cause damage (không a)." },
          { q: "Theo mô tả band, điều gì phân biệt GRA band 7 với band 6?", options: ["Dùng ít nhất 10 câu bị động", "Phần lớn câu không có lỗi", "Không có câu đơn nào", "Mỗi câu dài trên 30 từ"], correct: 1, why: "Band 7: đa dạng câu phức + phần lớn câu không lỗi. Không có yêu cầu về số câu bị động hay độ dài câu." },
          { q: "Bài viết kết bằng “In conclusion, both sides are important” cho một đề “To what extent do you agree?” thì yếu nhất ở tiêu chí nào?", options: ["LR", "GRA", "TR", "Chính tả"], correct: 2, why: "Không nêu rõ mức độ đồng ý ⇒ lập trường không rõ ⇒ TR." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Viết bài và viết lại — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "sodo",
        kind: "flow",
        title: "40 phút cho một bài Task 2 band 7",
        steps: [
          { label: "0–5: Đếm vế + dàn ý", sub: "lập trường · 2 ý chính · mỗi ý: cơ chế + ví dụ · chỗ đặt “nêu rồi bác”" },
          { label: "5–9: Mở bài", sub: "paraphrase đề + câu luận điểm nói rõ đồng ý phần nào" },
          { label: "9–32: Hai thân bài", sub: "mỗi đoạn 90–110 từ: chủ đề → cơ chế → ví dụ → chốt" },
          { label: "32–35: Kết bài", sub: "2 câu, cùng lập trường, không ý mới" },
          { label: "35–40: Soát", sub: "bảng 12 câu — ưu tiên câu 1–5, rồi mạo từ và -s" },
        ],
      },
      {
        t: "essay",
        id: "t4d2-viet-bai",
        task: "Task 2",
        prompt: "Some people argue that governments should ban products that cannot be recycled, even if this makes everyday goods more expensive. To what extent do you agree or disagree?",
        minWords: 250,
        tips: [
          "Đếm vế: ① governments should **ban** (cấm hẳn, không phải đánh thuế) · ② products that cannot be recycled · ③ **even if** this makes everyday goods more expensive (phải bàn cái giá này) · ④ To what extent.",
          "Câu luận điểm phải nói bạn đồng ý tới đâu VÀ thái độ với vế “đắt hơn”. Ví dụ khung: While a ban would …, I believe that … provided that …",
          "Mỗi thân bài MỘT ý: câu chủ đề → cơ chế → ví dụ cụ thể → câu chốt.",
          "Có một chỗ “nêu rồi bác”: Granted, higher prices would hit low-income families hardest. However, …",
          "Dùng 4–6 cụm của bài Từ vựng: prohibit · dispose of · throwaway culture · bear the cost of · at the expense of · circular economy.",
          "5 phút cuối: bảng 12 câu + soát mạo từ của Ngày 1.",
        ],
      },
      {
        t: "essay",
        id: "t4d2-viet-lai",
        task: "Task 2",
        prompt: "VIẾT LẠI: lấy bài Writing Task 2 bạn đã viết ở Đề 6 (Online Test) và viết lại thành bản band 7. Nếu chưa làm Đề 6, hãy viết bài của riêng bạn cho đề ở mục 2: Some people think that environmental problems are too big for individuals to solve, and that only governments and large companies can make a real difference. To what extent do you agree or disagree?",
        minWords: 250,
        tips: [
          "Trước khi viết lại: tự chấm bài cũ bằng bảng 12 câu, khoanh những câu “chưa”.",
          "Lượt 1 — TR: câu luận điểm rõ; mỗi thân bài còn 1 ý + cơ chế + ví dụ; thêm một chỗ “nêu rồi bác”.",
          "Lượt 2 — CC: bỏ bớt Firstly / Moreover; thêm this / such + danh từ tóm ý.",
          "Lượt 3 — LR · GRA: thay 4–6 cụm chung chung bằng collocation; soát mạo từ, -s, chia động từ.",
          "Dán bản mới vào đây để AI chấm, rồi ghi 3 lỗi nặng nhất vào Sổ lỗi (mã DEV / COL / REF / A / S…).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d2-noi",
    kind: "speaking",
    title: "Nói Part 1 band 7: chi tiết cụ thể + từ ít gặp — ôn nhanh 12 khung, trọng âm câu mang nghĩa",
    goal: "Trả lời câu hỏi Part 1 trong 15–20 giây theo công thức Thẳng → Chi tiết cụ thể → Nét riêng, cài tự nhiên một cụm ít gặp vào mỗi câu, dùng đúng 12 khung câu hỏi ở mức band 7, và nhấn đúng từ mang ý đối lập trong câu.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Part 1 (4–5 phút, khoảng 10–12 câu hỏi về bản thân) là nơi giám khảo có ==ấn tượng đầu==. Band 7 ở Part 1 **không dài hơn** band 6 — vẫn 2–3 câu, 15–20 giây — mà ==cụ thể hơn và tự nhiên hơn==.",
          "Công thức band 7: **Thẳng** (trả lời ngay) → **Chi tiết cụ thể** (ở đâu, lúc nào, với ai, con số) → **Nét riêng** (một cảm nhận, đối lập, hay chuyện nhỏ).",
          "Ôn nhanh **12 khung câu hỏi** Part 1 (Tập 2 Ngày 5 nhập, Tập 3 Ngày 3 học trọn) — nay mỗi khung có câu mở band 7.",
          "**LR band 7:** mỗi câu trả lời cài MỘT cụm ít gặp / thành ngữ tự nhiên, đúng nguyên dạng (get on my nerves, on a whim, a creature of habit).",
          "**FC:** nói không gắng sức, ngập ngừng chỉ để tìm ý; biết nói gì khi chưa từng nghĩ về câu hỏi; kết câu dứt khoát (ôn Tập 3 Ngày 11 · 27).",
          "🔊 **Trọng âm câu mang nghĩa:** nhấn vào từ nào thì người nghe hiểu bạn đang đối lập / sửa / nhấn mạnh điều gì — một đặc trưng phát âm của band 7.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Part 1 ở band 7 khác band 6 ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**FC** (trôi chảy, mạch lạc)", "Sẵn lòng nói dài nhưng đôi lúc mất mạch vì lặp, tự sửa, ngập ngừng; từ nối có nhưng chưa luôn hợp", "Nói dài ==không gắng sức==; ngập ngừng chủ yếu để tìm ý; từ dẫn (discourse markers) linh hoạt"],
          ["**LR** (từ vựng)", "Đủ từ để nói về mọi chủ đề; diễn đạt lại (paraphrase) thường được", "Linh hoạt; có ==từ ít gặp và thành ngữ==, ý thức được văn phong và collocation (đôi chỗ chưa chuẩn)"],
          ["**GRA** (ngữ pháp)", "Trộn câu đơn và câu phức, kém linh hoạt; lỗi hay gặp ở câu phức", "Nhiều cấu trúc phức khá linh hoạt; ==thường nói câu không lỗi==, còn vài lỗi dai dẳng"],
          ["**P** (phát âm)", "Dùng được nhiều đặc trưng nhưng kiểm soát lẫn lộn; nhìn chung dễ hiểu", "Mọi điểm tốt của band 6 + một số của band 8: nhịp, ==trọng âm câu==, ngữ điệu dùng có chủ ý"],
        ],
        caption: "Tóm tắt tiếng Việt từ mô tả band Speaking công khai. Bốn tiêu chí chấm chung cho cả ba Part — nhưng Part 1 là nơi dễ ghi điểm LR và P nhất.",
      },
      {
        t: "note",
        title: "📌 Ba điều KHÔNG đổi từ band 6 lên band 7 ở Part 1",
        items: [
          "Độ dài: 2–3 câu. Trả lời 6–7 câu cho một câu hỏi Part 1 là sai thể loại — giám khảo sẽ ngắt lời (ôn Tập 2 Ngày 5: ngắn – thẳng – dừng đúng lúc).",
          "Câu đầu tiên luôn trả lời thẳng vào câu hỏi. Đừng mở bằng “That's an interesting question” ở Part 1.",
          "Nói thật về mình. Câu trả lời thật thì chi tiết tự đến; câu trả lời bịa thì chỉ ra được ý chung chung.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ôn nhanh 12 khung câu hỏi — bản band 7" },
      {
        t: "p",
        text: "Tập 3 Ngày 3 dạy: thay vì học thuộc 50 chủ đề, hãy nhận ra ==khung của câu hỏi==. Chủ đề lạ đến đâu thì câu hỏi cũng rơi vào một trong 12 khung, và mỗi khung có một cách mở + một thì động từ quen. Bảng dưới là bản nâng lên band 7: câu mở tự nhiên hơn, có mức độ, có nhượng bộ.",
      },
      {
        t: "table",
        head: ["#", "Khung", "Câu mở band 7", "Ngữ pháp cần"],
        rows: [
          ["1", "Do you like X?", "I'm really **into** it. / I'm **not that keen on** it, to be honest. / I **can take it or leave it**.", "Hiện tại đơn + lý do cụ thể"],
          ["2", "How often do you…?", "**Every other day** or so. / **Once in a blue moon**. / **Not as often as I'd like**.", "Trạng từ tần suất + khi nào"],
          ["3", "When was the last time you…?", "**It must have been** a couple of weeks ago. / **It's been ages since I last**…", "Quá khứ đơn, 2 câu kể"],
          ["4", "Do you prefer X or Y?", "X, **mainly because**… — **though I can see the appeal of** Y.", "So sánh + nhượng bộ"],
          ["5", "Is X popular in your country?", "**Hugely** popular **among**…, **less so with**… / It's **catching on**.", "Chia nhóm (tuổi, vùng)"],
          ["6", "How has X changed?", "It's **changed beyond recognition**. People **used to**…; **these days** they…", "used to + hiện tại hoàn thành"],
          ["7", "Did you … as a child?", "**All the time**. We **'d spend** whole afternoons… / **Not really** — I **was more of a**… kid.", "used to / would + V"],
          ["8", "What do you dislike about X?", "**What really gets on my nerves is**… / **The one thing I can't stand is**…", "Câu nhấn What… is…"],
          ["9", "Is it easy / difficult to…?", "**It depends on**… **If** you…, it's **perfectly doable**. **But if**…", "Điều kiện loại 1"],
          ["10", "What is the best time to…?", "**Ideally**, early in the morning, **when**… / **Any time but**…", "Mệnh đề when / before"],
          ["11", "Is X suitable for…?", "**For the most part, yes — as long as**… / **I'd be wary of**…", "as long as / provided"],
          ["12", "What kind of X do you like most?", "I like **all sorts**, **but if I had to pick one, it'd be**…", "Điều kiện loại 2"],
        ],
        caption: "12 khung của Tập 3 Ngày 3. Che cột 3, nhìn cột 2 và nói ngay câu mở — làm tới khi không phải nghĩ.",
      },
      {
        t: "quiz",
        id: "t4d2-noi-khung-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu mở band 7 của các khung (5 câu)",
        grammar: "Câu mở theo khung (bảng trên)",
        items: [
          { q: "Điều thật sự làm tôi bực mình là rác. (khung 8)", answers: ["What really gets on my nerves is the litter.", "What really gets on my nerves is litter.", "What really gets on my nerves is the rubbish.", "What really gets on my nerves is rubbish."], hint: "What really gets on my nerves is…" },
          { q: "Tôi thích đủ loại, nhưng nếu phải chọn một thì đó sẽ là nhạc jazz. (khung 12)", answers: ["I like all sorts, but if I had to pick one, it'd be jazz.", "I like all sorts, but if I had to pick one, it would be jazz.", "I like all sorts, but if I had to choose one, it would be jazz.", "I like all sorts, but if I had to choose one, it'd be jazz.", "I like all kinds, but if I had to pick one, it would be jazz.", "I like all sorts of music, but if I had to pick one, it would be jazz."], hint: "all sorts · if I had to pick one, it'd be" },
          { q: "Lâu lắm rồi tôi chưa đi bơi. (khung 3 — It's been ages…)", answers: ["It's been ages since I last went swimming.", "It has been ages since I last went swimming.", "It's been ages since I went swimming.", "It's been ages since I last swam."], hint: "It's been ages since I last + V2" },
          { q: "Phần lớn là có — miễn là có bố mẹ để mắt tới. (khung 11)", answers: ["For the most part, yes — as long as a parent keeps an eye on them.", "For the most part, yes, as long as a parent keeps an eye on them.", "For the most part, yes — as long as their parents keep an eye on them.", "For the most part, yes, as long as their parents keep an eye on them.", "For the most part, yes - as long as a parent keeps an eye on them.", "For the most part, yes — as long as parents keep an eye on them."], hint: "For the most part, yes — as long as · keep an eye on" },
          { q: "Nó rất phổ biến trong giới trẻ, còn với người lớn tuổi thì ít hơn. (khung 5)", answers: ["It's hugely popular among young people, less so with older people.", "It's hugely popular among young people, but less so with older people.", "It is hugely popular among young people, less so with older people.", "It's hugely popular among young people and less so with older people.", "It is hugely popular among young people, but less so with older people.", "It's hugely popular among the young, less so with older people."], hint: "hugely popular among … , less so with …" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Công thức band 7: Thẳng → Chi tiết cụ thể → Nét riêng" },
      {
        t: "sodo",
        kind: "flow",
        title: "Một câu trả lời Part 1 band 7 (15–20 giây)",
        steps: [
          { label: "1. Thẳng", sub: "Fairly often, yes — a couple of times a week." },
          { label: "2. Chi tiết cụ thể", sub: "ở đâu · lúc nào · với ai · bao nhiêu: “a small park by the canal near my dorm… around six”" },
          { label: "3. Nét riêng", sub: "cảm nhận / đối lập / chuyện nhỏ: “…to clear my head after a day of staring at code.”" },
          { label: "4. Dừng", sub: "Hạ giọng ở từ cuối. Không thêm “…and yeah, that's all.”" },
        ],
        caption: "Tập 1–2 dạy: Trả lời → Lý do → Ví dụ. Band 7 thay “lý do chung” bằng “chi tiết chỉ mình bạn có”.",
      },
      {
        t: "table",
        head: ["Câu hỏi: Do you often go to parks?", "Vì sao ở band đó"],
        rows: [
          ["**Band 5:** Yes, I often go to park. Because it has fresh air.", "Ngắn, lỗi mạo từ, lý do ai cũng nói được"],
          ["**Band 6:** Yes, I often go to parks. I go there about two times a week. I like parks because they have fresh air and many trees, and I can relax there after I study.", "Đủ ý, đúng ngữ pháp — nhưng không có chi tiết nào là của riêng người nói; từ vựng an toàn (fresh air, relax)"],
          ["**Band 7:** Fairly often, yes — a couple of times a week, usually around six when it's cooled down a bit. There's a small park by the canal near my dorm, and I tend to do a few laps there to clear my head after a day of staring at code.", "Chi tiết thật (giờ, nơi, việc làm); cụm tự nhiên (fairly often, cooled down, do a few laps, clear my head, staring at code); câu phức trơn tru"],
        ],
        caption: "Ba câu trả lời dài 11 – 33 – 48 từ. Band 7 chỉ dài hơn band 6 khoảng mười lăm từ (vẫn dưới 20 giây).",
      },
      {
        t: "table",
        head: ["Từ chung (band 6)", "Chi tiết + cụm ít gặp (band 7)"],
        rows: [
          ["I like it because it is interesting.", "I find it **oddly satisfying** — especially when a bug I've been chasing for hours finally disappears."],
          ["It is very crowded.", "It's **packed** at weekends — you can **barely** find a bench."],
          ["I go there sometimes.", "I go **every now and then**, mostly when a friend **drags me along**."],
          ["It is far from my house.", "It's **a bit out of the way** — a good forty minutes by bus."],
          ["I am very busy.", "I'm **snowed under** with deadlines at the moment."],
          ["It helps me relax.", "It helps me **switch off** / **unwind** after lectures."],
        ],
        caption: "Không phải từ “khó” — chỉ là từ người bản ngữ thật sự dùng khi nói chuyện.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi cố nói “band 7” ở Part 1",
        items: [
          "Học thuộc đoạn văn mẫu rồi đọc lại: giọng đều, tốc độ khác hẳn, giám khảo nhận ra trong 5 giây và ==đổi câu hỏi==. Học KHUNG và CỤM, không học đoạn.",
          "Nhồi thành ngữ: “It's a piece of cake, I'm over the moon, it costs an arm and a leg” trong một câu. Mỗi câu trả lời tối đa MỘT cụm, và phải đúng nguyên dạng.",
          "Dùng từ viết khi nói: ~~Furthermore~~, ~~In addition~~, ~~plethora~~, ~~In conclusion~~. Khi nói dùng: also, on top of that, loads of, so basically.",
          "Trả lời “Yes, I do.” rồi im, chờ giám khảo hỏi “Why?” — đó là band 5. Luôn tự đi tiếp tới chi tiết.",
          "Nói quá nhanh để tỏ ra trôi chảy ⇒ nuốt âm cuối, mất điểm P. Trôi chảy là ==không ngắt vô cớ==, không phải nhanh.",
        ],
      },
      { t: "rule", formula: "Thẳng (1 câu) → Chi tiết cụ thể (ở đâu · lúc nào · với ai · con số) → Nét riêng (cảm nhận / đối lập) → dừng", vi: "2–3 câu, 15–20 giây, mỗi câu trả lời cài một cụm ít gặp." },

      /* ── 4 ── */
      { t: "h", text: "4. Chủ đề 1 — Parks & green spaces: band 6 và band 7 cho cùng bốn câu hỏi" },
      {
        t: "p",
        text: "Bốn câu hỏi dùng bốn khung: **How often** (2) · **Did you… as a child** (7) · **Is there enough…** (gần khung 5) · **What do you dislike** (8). Nghe bản band 6 trước, rồi bản band 7. Band ghi là ước tính.",
      },
      {
        t: "dialogue",
        title: "Parks — câu trả lời band 6 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you often go to parks?" },
          { who: "Candidate", role: "candidate", text: "Yes, I often go to parks. I go there about two times a week. I like parks because they have fresh air and many trees, and I can relax there after I study.", vi: "Có, tôi thường đi công viên. Tôi đến đó khoảng hai lần một tuần. Tôi thích công viên vì có không khí trong lành và nhiều cây, và tôi có thể thư giãn ở đó sau khi học." },
          { who: "Examiner", role: "examiner", text: "Did you play in parks when you were a child?" },
          { who: "Candidate", role: "candidate", text: "Yes, I did. When I was a child, I usually played in the park near my house with my friends. We played football and hide-and-seek. It was very fun.", vi: "Có. Khi còn nhỏ, tôi thường chơi ở công viên gần nhà với bạn bè. Chúng tôi chơi bóng đá và trốn tìm. Rất vui." },
          { who: "Examiner", role: "examiner", text: "Are there enough green spaces in your city?" },
          { who: "Candidate", role: "candidate", text: "No, I don't think so. My city has a lot of buildings and not many parks. I think the government should build more parks for people.", vi: "Không, tôi không nghĩ vậy. Thành phố tôi có rất nhiều toà nhà và không nhiều công viên. Tôi nghĩ chính phủ nên xây thêm công viên cho người dân." },
          { who: "Examiner", role: "examiner", text: "What do you dislike about the parks in your city?" },
          { who: "Candidate", role: "candidate", text: "I don't like that some parks are dirty. Some people throw rubbish in the park. Also, they are very crowded at the weekend.", vi: "Tôi không thích việc một số công viên bẩn. Vài người vứt rác trong công viên. Ngoài ra, cuối tuần chúng rất đông." },
        ],
      },
      {
        t: "dialogue",
        title: "Parks — câu trả lời band 7 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you often go to parks?" },
          { who: "Candidate", role: "candidate", text: "Fairly often, yes — a couple of times a week, usually around six when it's cooled down a bit. There's a small park by the canal near my dorm, and I tend to do a few laps there to clear my head after a day of staring at code.", vi: "Khá thường xuyên — một tuần đôi lần, thường khoảng sáu giờ khi trời đã dịu bớt. Có một công viên nhỏ cạnh con kênh gần ký túc xá, và tôi hay chạy vài vòng ở đó cho đầu óc thông thoáng sau một ngày dán mắt vào code." },
          { who: "Examiner", role: "examiner", text: "Did you play in parks when you were a child?" },
          { who: "Candidate", role: "candidate", text: "All the time. I grew up in a small town, and the park was basically our playground — we'd spend whole afternoons there playing football until someone's mum called us in for dinner. Looking back, I don't think we ever got bored.", vi: "Suốt ngày luôn. Tôi lớn lên ở một thị trấn nhỏ, và công viên về cơ bản là sân chơi của bọn tôi — chúng tôi ở đó cả buổi chiều đá bóng cho tới khi mẹ của đứa nào đó gọi về ăn tối. Nghĩ lại, tôi không nghĩ bọn tôi từng thấy chán." },
          { who: "Examiner", role: "examiner", text: "Are there enough green spaces in your city?" },
          { who: "Candidate", role: "candidate", text: "Not nearly enough, to be honest. The centre is so built-up that you can walk for twenty minutes without seeing a single tree. There are a few decent parks on the outskirts, but they're a bit out of the way for most people.", vi: "Thật lòng là còn thiếu xa. Trung tâm xây kín tới mức bạn có thể đi bộ hai mươi phút mà không thấy một cái cây nào. Có vài công viên tử tế ở vùng ven, nhưng với đa số mọi người thì hơi xa." },
          { who: "Examiner", role: "examiner", text: "What do you dislike about the parks in your city?" },
          { who: "Candidate", role: "candidate", text: "What really gets on my nerves is the litter. People have picnics and then just leave everything behind, which spoils it for everyone else. That, and the fact that they're packed at weekends — you can barely find a bench.", vi: "Điều thật sự làm tôi bực là rác. Người ta đi dã ngoại rồi cứ thế để lại mọi thứ, làm hỏng không gian của người khác. Thêm nữa là cuối tuần đông nghẹt — khó mà tìm nổi một cái ghế." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bản band 6", "Bản band 7"],
        rows: [
          ["**FC**", "Mỗi câu trả lời mở bằng cách lặp lại câu hỏi (Yes, I often go to parks). Nối bằng and / also / because.", "Mở tự nhiên (Fairly often, yes · All the time · Not nearly enough, to be honest). Từ dẫn: basically · looking back · to be honest · That, and the fact that…"],
          ["**LR**", "fresh air · relax · very fun · dirty · very crowded — đúng nhưng an toàn. ~~two times~~ nên là twice.", "cooled down · do a few laps · clear my head · built-up · on the outskirts · out of the way · gets on my nerves · packed · barely"],
          ["**GRA**", "Câu đơn + because. Quá khứ đơn đúng. ~~It was very fun~~ → It was great fun.", "we'd spend… until… (would chỉ thói quen quá khứ) · so built-up that… · without seeing… · which spoils it… · What… is… (câu nhấn)"],
          ["**P**", "(nếu đọc đều từng từ) nhịp phẳng", "Nhấn từ mang ý: NOT NEARLY enough · a SINGLE tree · the LITTER · BARELY find a bench"],
        ],
        caption: "Cùng nội dung: đi 2 lần / tuần, hồi nhỏ đá bóng, thiếu công viên, ghét rác và đông. Chỉ khác cách nói.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Chủ đề 2 — Rubbish & recycling (dùng từ vựng hôm nay)" },
      {
        t: "p",
        text: "Bốn khung: **Do you…?** (1) · **Is X popular** (5) · **How has X changed** (6) · **Is it easy to…** (9). Chú ý: đây là Part 1 nên dùng từ đời thường (sort the rubbish, cut down on plastic) — các từ chính sách (carbon tax, circular economy) để dành cho Part 3 và Task 2.",
      },
      {
        t: "dialogue",
        title: "Rubbish & recycling — câu trả lời band 7 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you recycle at home?" },
          { who: "Candidate", role: "candidate", text: "I try to, although I'll admit I'm far from perfect. In my flat we keep a separate bag for bottles and cans, and a woman from the neighbourhood collects them every few days. Food waste is another story — that still goes straight in the bin.", vi: "Tôi có cố, dù phải thừa nhận là còn xa mới hoàn hảo. Ở phòng tôi, bọn tôi để riêng một túi đựng chai và lon, và một cô trong khu phố thu gom vài ngày một lần. Rác thực phẩm thì là chuyện khác — vẫn vào thẳng thùng rác." },
          { who: "Examiner", role: "examiner", text: "Is recycling popular in your country?" },
          { who: "Candidate", role: "candidate", text: "It's catching on, mainly among younger people in the big cities. Having said that, most households still don't sort their rubbish, partly because there's no proper system to collect it separately.", vi: "Nó đang dần phổ biến, chủ yếu trong giới trẻ ở các thành phố lớn. Nói vậy chứ đa số hộ gia đình vẫn chưa phân loại rác, một phần vì chưa có hệ thống tử tế để thu gom riêng." },
          { who: "Examiner", role: "examiner", text: "How has the amount of rubbish people produce changed?" },
          { who: "Candidate", role: "candidate", text: "It's gone up massively, I'd say, largely because of food delivery. When I was a kid, we'd take our own containers to the market; these days, a single lunch order arrives wrapped in three layers of plastic.", vi: "Tôi cho là nó tăng rất mạnh, phần lớn vì dịch vụ giao đồ ăn. Hồi tôi còn nhỏ, nhà tôi mang hộp của mình ra chợ; còn bây giờ, một suất cơm trưa đặt về được bọc trong ba lớp nhựa." },
          { who: "Examiner", role: "examiner", text: "Is it easy to cut down on plastic where you live?" },
          { who: "Candidate", role: "candidate", text: "It depends on how much effort you're willing to put in. If you cook at home and carry your own bottle, it's perfectly doable. But if you rely on takeaways, as most students do, it's almost impossible to avoid.", vi: "Còn tuỳ bạn sẵn lòng bỏ bao nhiêu công sức. Nếu bạn nấu ở nhà và mang chai riêng thì hoàn toàn làm được. Nhưng nếu bạn sống nhờ đồ ăn mang về, như đa số sinh viên, thì gần như không tránh nổi." },
        ],
      },
      {
        t: "table",
        head: ["Chỗ đáng học", "Câu trong bài", "Dùng để làm gì"],
        rows: [
          ["Thừa nhận trung thực", "I try to, although I'll admit I'm far from perfect.", "Nghe thật hơn “Yes, I always recycle” — và có ngay cấu trúc nhượng bộ"],
          ["“…is another story”", "Food waste is another story.", "Chuyển sang mặt đối lập trong 4 từ"],
          ["Having said that, …", "Having said that, most households still don't…", "Từ dẫn band 7 thay cho but / however khi nói"],
          ["Đối lập xưa – nay", "When I was a kid, we'd…; these days, …", "Khung 6: would cho thói quen cũ; these days cho hiện tại"],
          ["It depends on + mệnh đề", "It depends on how much effort you're willing to put in.", "Khung 9: không chỉ “It depends.” rồi dừng"],
          ["as most students do", "…if you rely on takeaways, as most students do, …", "Mệnh đề chen giữa — GRA band 7 khi nói"],
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chủ đề 3 — Apps on your phone" },
      {
        t: "p",
        text: "Bốn khung: **What kind of X… most** (12) · **When was the last time** (3) · **Do you prefer X or Y** (4) · **Is X suitable for…** (11). Chủ đề công nghệ là sân nhà của bạn — nhưng đừng giảng kỹ thuật; giám khảo chấm tiếng Anh, không chấm kiến thức IT.",
      },
      {
        t: "dialogue",
        title: "Apps — câu trả lời band 7 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "What kind of apps do you use most?" },
          { who: "Candidate", role: "candidate", text: "I use all sorts — maps, banking, a couple of language apps — but if I had to pick one, it'd be my notes app. I'm a bit of a creature of habit: every idea and every deadline goes in there, and I'd be lost without it.", vi: "Tôi dùng đủ loại — bản đồ, ngân hàng, vài app học ngoại ngữ — nhưng nếu phải chọn một thì đó là app ghi chú. Tôi hơi thuộc kiểu người sống theo thói quen: mọi ý tưởng và mọi hạn chót đều vào đó, thiếu nó là tôi chịu." },
          { who: "Examiner", role: "examiner", text: "When was the last time you downloaded a new app?" },
          { who: "Candidate", role: "candidate", text: "It must have been a couple of weeks ago. A classmate recommended a flashcard app for vocabulary, so I downloaded it on a whim. I used it every day for about a week and then, typically, forgot all about it.", vi: "Chắc là khoảng hai tuần trước. Một bạn cùng lớp giới thiệu một app thẻ từ vựng, nên tôi tải về theo hứng. Tôi dùng nó mỗi ngày được chừng một tuần rồi, như mọi khi, quên bẵng luôn." },
          { who: "Examiner", role: "examiner", text: "Do you prefer free apps or paid apps?" },
          { who: "Candidate", role: "candidate", text: "Free ones, mainly because I'm a student on a tight budget. That said, I don't mind paying for something I use every day — I'd rather pay a little than be bombarded with adverts every thirty seconds.", vi: "App miễn phí, chủ yếu vì tôi là sinh viên, túi tiền eo hẹp. Dù vậy, tôi không ngại trả tiền cho thứ mình dùng hằng ngày — tôi thà trả một ít còn hơn bị quảng cáo dội vào mặt mỗi ba mươi giây." },
          { who: "Examiner", role: "examiner", text: "Are apps suitable for young children?" },
          { who: "Candidate", role: "candidate", text: "For the most part, yes — as long as a parent keeps an eye on the screen time. Some of the educational ones are genuinely well designed. It's the endless video apps I'd be wary of, because they're built to be addictive.", vi: "Phần lớn là có — miễn là có bố mẹ để mắt tới thời gian dùng màn hình. Một số app giáo dục được thiết kế thật sự tốt. Thứ tôi dè chừng là các app video lướt vô tận, vì chúng được làm ra để gây nghiện." },
        ],
      },
      {
        t: "mcq",
        id: "t4d2-noi-chon",
        title: "Kiểm tra — câu trả lời nào gần band 7 nhất? (5 câu)",
        items: [
          { q: "Do you like cooking?", options: ["Yes, I like cooking very much because it is interesting and useful for my life.", "I'm not much of a cook, to be honest. I can manage instant noodles and a fried egg, but anything beyond that and I'm on the phone to my mum.", "Cooking is an activity that has many benefits. Firstly, it is healthy. Secondly, it saves money. In conclusion, I like it.", "Yes."], correct: 1, why: "Thẳng (I'm not much of a cook) → chi tiết cụ thể (mì gói, trứng rán) → nét riêng hài hước (gọi cho mẹ). Phương án C là văn viết đem ra nói." },
          { q: "How often do you take the bus?", options: ["Hardly ever these days. I used to take the number eight to campus every morning, but since I got a motorbike, it's been once in a blue moon.", "I take the bus sometimes. The bus is cheap and convenient. Many people take the bus in my city.", "I think public transport plays a pivotal role in alleviating traffic congestion in metropolitan areas.", "Two times in a week I am taking the bus."], correct: 0, why: "Tần suất chính xác + đối lập xưa – nay + thành ngữ dùng đúng. Phương án C lạc sang giọng Task 2; D sai ngữ pháp." },
          { q: "Is it easy to find a quiet place to study in your city?", options: ["No, it isn't easy. My city is very noisy. So it is difficult.", "Yes, it is easy.", "It depends on the time of day. Early in the morning the library is practically empty, but by ten o'clock you'd struggle to find a seat.", "Finding a quiet place is a piece of cake, I am over the moon, it costs an arm and a leg."], correct: 2, why: "Khung 9: It depends on… + hai tình huống cụ thể. Phương án D nhồi ba thành ngữ không hợp nghĩa." },
          { q: "What do you dislike about your neighbourhood?", options: ["I dislike the noise. It is very noisy. I don't like noise.", "Nothing. I like everything.", "There are many disadvantages such as noise pollution and air pollution, which have detrimental effects.", "The one thing I can't stand is the karaoke. My neighbours start around eight and they're still going strong at eleven, which is no fun when you've got an exam the next morning."], correct: 3, why: "Khung 8 + chi tiết cụ thể (karaoke, 8 giờ tới 11 giờ) + nét riêng (kỳ thi hôm sau)." },
          { q: "Giám khảo hỏi một câu bạn chưa từng nghĩ tới (“Do you like looking at the sky?”). Mở đầu nào tốt nhất?", options: ["Sorry, I don't know.", "That's not something I've ever really thought about, but now you mention it, I suppose I do — especially…", "Can you ask another question?", "(im lặng 5 giây rồi) Yes."], correct: 1, why: "Thừa nhận ngắn gọn rồi đi tiếp vào câu trả lời — giữ được mạch (FC). Xem mục 8." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Mười lăm cụm ít gặp tự nhiên cho Part 1 — và cách dùng cho đúng" },
      {
        t: "table",
        head: ["Cụm", "Nghĩa", "Câu mẫu", "Lưu ý nguyên dạng"],
        rows: [
          ["be into sth", "mê, thích", "I'm really **into** indie games.", "into + N / V-ing"],
          ["not be that keen on", "không thích lắm", "I'm **not that keen on** spicy food.", "keen **on**"],
          ["get on my nerves", "làm tôi bực", "The noise really **gets on my nerves**.", "~~gets on my nerve~~ — luôn nerves"],
          ["clear my head", "cho đầu óc thông thoáng", "A short walk helps me **clear my head**.", ""],
          ["switch off / unwind", "thả lỏng, ngừng nghĩ về việc", "I listen to podcasts to **unwind**.", ""],
          ["once in a blue moon", "năm thì mười hoạ", "I eat out **once in a blue moon**.", "~~one time in a blue moon~~"],
          ["every now and then", "thỉnh thoảng", "**Every now and then** I treat myself.", ""],
          ["on a whim", "theo hứng, không tính trước", "I bought it **on a whim**.", "~~by a whim~~"],
          ["a creature of habit", "người sống theo thói quen", "I'm **a creature of habit**.", "~~a creature of habits~~"],
          ["on a tight budget", "túi tiền eo hẹp", "Most students are **on a tight budget**.", "on, không phải in"],
          ["keep an eye on", "để mắt tới", "My mum **keeps an eye on** my spending.", "~~keep eyes on~~"],
          ["be wary of", "dè chừng", "I'**m wary of** free Wi-Fi.", "wary **of**"],
          ["be snowed under (with)", "ngập trong việc", "I'm **snowed under** with assignments.", "luôn bị động"],
          ["out of the way", "xa, không tiện đường", "The campus is a bit **out of the way**.", ""],
          ["catch on", "dần phổ biến", "Cycling is **catching on** in my city.", "không có tân ngữ"],
        ],
        caption: "Chọn 5 cụm hợp với đời bạn, đặt mỗi cụm một câu THẬT về mình, ghi vào Sổ Speaking. Thuộc 5 cụm dùng đúng hơn biết 50 cụm dùng sai.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với thành ngữ",
        items: [
          "Sai một chữ là mất tác dụng: ~~get on my nerve~~, ~~once in the blue moon~~, ~~a creature of habits~~. Giám khảo nghe ra ngay là cụm học vẹt.",
          "Một số thành ngữ trong sách cũ nay nghe lỗi thời hoặc quá kịch: ~~It's raining cats and dogs~~, ~~as easy as ABC~~. Ưu tiên cụm động từ và cụm đời thường ở bảng trên.",
          "Thành ngữ thuộc về **Speaking**. Trong Writing Task 2 gần như không dùng (Ngày 18 sẽ học kỹ khi nào dùng, khi nào không).",
          "Ngày 6 (Part 2 tả người) và Ngày 8 (Personality vòng 2) sẽ học thành ngữ tả tính cách — cũng theo nguyên tắc “đúng nguyên dạng”.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Fluency band 7: câu đệm, khi chưa từng nghĩ tới, và kết câu dứt khoát" },
      {
        t: "table",
        head: ["Tình huống", "Band 6 làm", "Band 7 nói"],
        rows: [
          ["Cần 1 giây để nghĩ", "Uhm… uhm… (im)", "**Let me think…** / **Good question…** / **Off the top of my head, …**"],
          ["Chưa từng nghĩ về chuyện này", "I don't know.", "**That's not something I've really thought about, but** I suppose…"],
          ["Không có trải nghiệm", "I never do that. (dừng)", "**I can't say I've ever** tried it, **but if I did, I'd probably**…"],
          ["Quên từ", "(dừng lâu, bỏ câu)", "**What's the word… the thing you use to**… — giải nghĩa bằng mệnh đề (Tập 2 Ngày 9)"],
          ["Nói nhầm", "Sorry, sorry, I mean… no…", "**…or rather**, … / **I mean**, … (sửa một lần rồi đi tiếp)"],
          ["Không nghe rõ câu hỏi", "(đoán và trả lời lạc)", "**Sorry, could you say that again?** (Part 1 chỉ được xin nhắc lại)"],
          ["Hết ý", "…and yeah. / That's all.", "Hạ giọng ở từ khoá cuối; hoặc chốt: **So, all in all, not really my thing.**"],
          ["Thêm một ý", "And… and also…", "**On top of that,** … / **Not only that, but**…"],
        ],
        caption: "Ôn Tập 3 Ngày 11 (không biết / quên từ) và Ngày 27 (kết câu dứt khoát). Im lặng quá 3 giây là mất điểm FC.",
      },
      {
        t: "note",
        title: "💡 Mẹo tập “không gắng sức”",
        items: [
          "Hẹn giờ 20 giây cho mỗi câu trả lời. Nói tới khi chuông kêu là dừng — tập cảm giác “vừa đủ”.",
          "Thu âm 6 câu trả lời. Nghe lại và đếm: mấy lần “uhm” kéo dài? mấy lần lặp lại câu hỏi? mấy lần kết bằng “yeah”? Mục tiêu: mỗi loại ≤ 1.",
          "Câu đệm chỉ dùng khi ==thật sự cần nghĩ==. Mở mọi câu bằng “Well, to be honest…” cũng máy móc như Firstly – Secondly khi viết.",
        ],
      },
      { t: "rule", formula: "That's not something I've really thought about, but I suppose + S + V", vi: "Câu cứu khi gặp câu hỏi lạ: thừa nhận 1 nhịp rồi trả lời ngay, không im." },

      /* ── 9 ── */
      { t: "h", text: "9. Phát âm: trọng âm câu mang nghĩa" },
      {
        t: "p",
        text: "Ngày 1 đã học nhịp: nhấn từ mang nghĩa, lướt từ chức năng. Trong mỗi cụm, có ==một từ được nhấn mạnh nhất== (cao hơn, dài hơn, rõ hơn) — thường là từ mang nghĩa **cuối cùng**. Nhưng người nói có thể **dời** điểm nhấn ấy sang từ khác để báo: “đây là thông tin mới”, “tôi đang đối lập hai thứ” hoặc “tôi sửa lại điều bạn nghĩ”. Cùng một câu, nhấn khác chỗ thì nghĩa ngầm khác.",
      },
      {
        t: "table",
        head: ["Nhấn vào", "Câu (từ IN HOA được nhấn mạnh nhất)", "Nghĩa ngầm"],
        rows: [
          ["Mặc định (từ cuối)", "I go to the park twice a WEEK.", "Câu thông báo bình thường"],
          ["TWICE", "I go to the park TWICE a week.", "…chứ không phải một lần / không phải ngày nào cũng đi"],
          ["PARK", "I go to the PARK twice a week.", "…chứ không phải phòng gym"],
          ["I", "I go to the park twice a week.  (nhấn I)", "…còn bạn cùng phòng tôi thì không"],
          ["DO (trợ động từ thêm vào)", "I DO like parks — I just never have the time.", "Nhấn mạnh là có thật, bác điều người nghe tưởng"],
        ],
        caption: "Khi viết ta dùng “not A but B”. Khi nói, chỉ cần nhấn đúng từ.",
      },
      {
        t: "table",
        head: ["Kiểu", "Quy tắc", "Ví dụ từ các câu trả lời hôm nay"],
        rows: [
          ["Đối lập hai thứ", "Nhấn CẢ HAI từ đối lập", "There are parks on the OUTSKIRTS, but none in the CENTRE. · YOUNG people recycle; OLDER people mostly DON'T."],
          ["Sửa / bác", "Nhấn từ đúng", "It's not the PRICE that bothers me; it's the ADVERTS."],
          ["Thông tin mới", "Nhấn từ mới, lướt từ đã nhắc", "— Do you use free apps? — I use free apps for MOST things."],
          ["Mức độ", "Nhấn trạng từ mức độ", "NOT NEARLY enough · it's gone up MASSIVELY · you can BARELY find a bench"],
          ["Nhấn mạnh là thật", "Thêm và nhấn do / does / did", "I DO try to recycle. · It DOES get on my nerves."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với trọng âm câu",
        items: [
          "Nhấn đều mọi từ ⇒ người nghe không biết đâu là ý chính; nghe như đọc danh sách.",
          "Luôn nhấn từ cuối câu, kể cả khi từ ấy đã nhắc rồi: “— Do you like parks? — Yes, I like PARKS.” Tự nhiên hơn: “Yes, I LOVE parks.”",
          "Nhấn bằng cách nói TO hơn. Người bản ngữ nhấn chủ yếu bằng ==cao độ và độ dài== (kéo dài nguyên âm của âm tiết mang trọng âm), không phải hét.",
          "Nhấn vào đại từ / giới từ khi không có ý đối lập: “I gave it TO him” nghe lạ, trừ khi bạn muốn nói “đưa CHO anh ấy chứ không phải lấy TỪ anh ấy”.",
        ],
      },
      { t: "rule", formula: "Mặc định: nhấn từ mang nghĩa cuối cụm · Đối lập / sửa / thông tin mới: dời điểm nhấn sang từ đó", vi: "Nhấn bằng cao độ và độ dài. Hai từ đối lập thì nhấn cả hai." },
      {
        t: "phatam",
        id: "t4d2-phat-am",
        title: "Luyện phát âm — trọng âm câu mang nghĩa",
        note: "Dòng chú thích cho biết từ nào phải nhấn mạnh nhất. Đọc lần 1 bình thường, lần 2 kéo dài và nâng cao độ ở từ ấy. Thu âm và nghe lại: người nghe có nhận ra ý đối lập không?",
        items: [
          { text: "The parks are fine; it's the litter I can't stand.", ipa: "ðə pɑːks ə faɪn ɪts ðə lɪtər aɪ kɑːnt stænd", vi: "Nhấn LITTER (đối lập với parks)" },
          { text: "I used to go every day, but now I go twice a week.", ipa: "aɪ juːst tə ɡəʊ evri deɪ bət naʊ aɪ ɡəʊ twaɪs ə wiːk", vi: "Nhấn EVERY DAY và TWICE (xưa – nay)" },
          { text: "It's not the price that bothers me; it's the adverts.", ipa: "ɪts nɒt ðə praɪs ðət bɒðəz miː ɪts ði ædvɜːts", vi: "Nhấn PRICE và ADVERTS (sửa / bác)" },
          { text: "Young people recycle; older people mostly don't.", ipa: "jʌŋ piːpl riːsaɪkl əʊldə piːpl məʊstli dəʊnt", vi: "Nhấn YOUNG · OLDER · DON'T; people lần hai lướt" },
          { text: "I do like parks, I just never have the time.", ipa: "aɪ duː laɪk pɑːks aɪ dʒʌst nevə hæv ðə taɪm", vi: "Nhấn DO (nhấn mạnh là thật) và NEVER" },
          { text: "There are parks on the outskirts, but none in the centre.", ipa: "ðeər ə pɑːks ɒn ði aʊtskɜːts bət nʌn ɪn ðə sentə", vi: "Nhấn OUTSKIRTS · NONE · CENTRE" },
          { text: "I don't mind paying for something I use every day.", ipa: "aɪ dəʊnt maɪnd peɪɪŋ fə sʌmθɪŋ aɪ juːz evri deɪ", vi: "Nhấn EVERY (đối lập với thứ ít dùng)" },
          { text: "If I had to pick one, it would be my notes app.", ipa: "ɪf aɪ hæd tə pɪk wʌn ɪt wʊd bi maɪ nəʊts æp", vi: "Nhấn ONE và NOTES" },
        ],
      },
      {
        t: "mcq",
        id: "t4d2-noi-trong-am",
        title: "Kiểm tra — nhấn từ nào? (5 câu)",
        items: [
          { q: "“— Do you go to the gym in the morning? — No, I go in the ___.” Từ nào được nhấn mạnh nhất trong câu trả lời?", options: ["No", "go", "in", "evening"], correct: 3, why: "evening là thông tin mới, sửa lại morning." },
          { q: "“I DO recycle.” — Nhấn vào do để làm gì?", options: ["Vì do là từ mang nghĩa nên luôn nhấn", "Để khẳng định là có thật, bác điều người nghe nghi ngờ", "Để hỏi lại", "Vì đây là câu phủ định"], correct: 1, why: "do thêm vào câu khẳng định và được nhấn = emphatic do: “tôi CÓ tái chế đấy”." },
          { q: "“It's cheap, but it isn't ___.” (… nhưng không tốt). Nhấn vào đâu để thấy rõ đối lập?", options: ["cheap và good", "It's và it", "but", "isn't và It's"], correct: 0, why: "Hai từ đối lập (cheap ↔ good) đều được nhấn." },
          { q: "“— Do you like free apps? — I like free apps for SOME things.” Vì sao “free apps” trong câu trả lời bị lướt?", options: ["Vì nó là danh từ", "Vì nó đứng giữa câu", "Vì nó là thông tin đã nhắc; SOME mới là thông tin mới", "Vì nó có hai từ"], correct: 2, why: "Từ đã nhắc ở câu hỏi thì không nhấn lại; điểm nhấn dời sang thông tin mới." },
          { q: "Người bản ngữ nhấn một từ chủ yếu bằng cách nào?", options: ["Nói thật to", "Nói thật nhanh", "Ngắt trước và sau từ đó thật lâu", "Nâng cao độ và kéo dài nguyên âm mang trọng âm"], correct: 3, why: "Trọng âm = cao độ + độ dài (+ rõ hơn một chút), không phải hét." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Luyện nói — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Ba bộ, mỗi bộ 6 câu, phủ đủ 12 khung. Mỗi câu trả lời ==15–20 giây==: Thẳng → Chi tiết cụ thể → Nét riêng → dừng. Trước khi bấm ghi, chọn MỘT cụm ở mục 7 cho mỗi câu. Đừng viết ra giấy rồi đọc.",
      },
      {
        t: "speak",
        id: "t4d2-noi-parks",
        part: "1",
        questions: [
          "Do you often go to parks?",
          "Did you play in parks when you were a child?",
          "Are there enough green spaces in your city?",
          "What do you dislike about the parks in your city?",
          "What is the best time of day to visit a park?",
          "Do you prefer parks or indoor places such as shopping centres?",
        ],
      },
      {
        t: "speak",
        id: "t4d2-noi-recycling",
        part: "1",
        questions: [
          "Do you recycle at home?",
          "Is recycling popular in your country?",
          "How has the amount of rubbish people produce changed?",
          "Is it easy to cut down on plastic where you live?",
          "When was the last time you repaired something instead of throwing it away?",
          "Did your school teach you about protecting the environment?",
        ],
      },
      {
        t: "speak",
        id: "t4d2-noi-apps",
        part: "1",
        questions: [
          "What kind of apps do you use most?",
          "When was the last time you downloaded a new app?",
          "Do you prefer free apps or paid apps?",
          "Are apps suitable for young children?",
          "How often do you delete apps from your phone?",
          "Is there anything you dislike about the apps you use?",
        ],
      },
      {
        t: "note",
        title: "💡 Ghi vào Sổ Speaking sau khi luyện (nối Tập 3 Ngày 2)",
        items: [
          "Chép lại 3 câu trả lời bạn thấy ổn nhất. Gạch chân chi tiết cụ thể và cụm ít gặp trong mỗi câu.",
          "Với câu trả lời AI chấm thấp nhất: viết lại theo công thức Thẳng → Chi tiết → Nét riêng, rồi nói lại vào hôm sau (tự đóng vai giám khảo hỏi lại).",
          "Ghi 2 lỗi ngữ pháp “dai dẳng” AI chỉ ra (thường là mạo từ, thì quá khứ, -s). Band 7 cho phép còn vài lỗi dai dẳng — nhưng bạn phải biết chúng là gì.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t4d2-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 2",
    goal: "Tự kiểm 44 câu về AWL sublist 7, từ vựng và collocation môi trường, tiêu chí band 7 và phản biện “nêu rồi bác”, khung Part 1 và trọng âm câu; viết một đoạn phản biện 90–110 từ và ghi âm 6 câu Part 1.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (44 câu + 1 đoạn viết + 1 lượt nói)",
        items: [
          "**I–IV (29 câu):** AWL sublist 7 · Environment vòng 2 · collocation · dịch — ôn bài Từ vựng.",
          "**V–VI (10 câu):** tiêu chí band 7, phản biện, danh từ tóm ý, ghép câu khung — ôn bài Viết.",
          "**VII (5 câu):** Part 1 band 7 và trọng âm câu — ôn bài Nói.",
          "**VIII:** viết một đoạn “nêu rồi bác” 90–110 từ (AI chấm). **IX:** ghi âm 6 câu Part 1 (AI chấm).",
          "Đạt: đúng từ 35/44 (≈ 80 %). Phần nào dưới 70 % ⇒ mở lại mục ghi ở tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 2 trước khi làm bài",
        center: "Ngày 2",
        branches: [
          { label: "AWL 7", items: ["comprise (không of) · dispose of", "phenomenon → phenomena", "contrary to · adapt to"] },
          { label: "Environment 2", items: ["mitigation ↔ adaptation", "net zero · carbon tax · enforce", "depletion · circular economy"] },
          { label: "Collocation", items: ["pose a threat to", "take a toll on", "strike a balance between"] },
          { label: "Band 7 Writing", items: ["ý: cơ chế + ví dụ cụ thể", "Granted, … However, …", "this / such + danh từ tóm ý"] },
          { label: "Part 1 band 7", items: ["Thẳng → Chi tiết → Nét riêng", "12 khung", "một cụm ít gặp / câu"] },
          { label: "Trọng âm câu", items: ["nhấn từ mới / từ đối lập", "I DO like…", "cao độ + độ dài"] },
        ],
      },

      { t: "h", text: "I. AWL sublist 7 — điền từ (10 câu) — ôn bài Từ vựng mục 1–3" },
      {
        t: "quiz",
        id: "t4d2-bt-awl",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ cái đầu đã cho; chia dạng nếu cần)",
        items: [
          { q: "C______ to expectations, the number of cyclists fell after the new road opened.", answers: ["Contrary", "contrary"] },
          { q: "The committee c______ five scientists and two farmers.", answers: ["comprises", "comprised"] },
          { q: "Old phones should be d______ of at a recycling point, not in the bin.", answers: ["disposed"] },
          { q: "There is no e______ evidence that the scheme reduces litter.", answers: ["empirical"] },
          { q: "Coal and oil are f______ resources: one day they will run out.", answers: ["finite"] },
          { q: "The state had to i______ to stop the river being polluted.", answers: ["intervene"] },
          { q: "Light pollution is a relatively new p______.", answers: ["phenomenon"] },
          { q: "Protecting drinking water must be the government's top p______.", answers: ["priority"] },
          { q: "The damage to the reef may be impossible to r______.", answers: ["reverse"] },
          { q: "U______, it is consumers who decide which products survive.", answers: ["Ultimately", "ultimately"] },
        ],
      },

      { t: "h", text: "II. Environment vòng 2 (8 câu) — ôn bài Từ vựng mục 4–5" },
      {
        t: "mcq",
        id: "t4d2-bt-env",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "Factories that pollute a river should pay for the clean-up. This is known as the ___ principle.", options: ["circular economy", "polluter pays", "tipping point", "net zero"], correct: 1, why: "polluter pays principle = người gây ô nhiễm phải trả tiền." },
          { q: "The city wants to become ___ by 2040, producing no more carbon than it removes.", options: ["carbon-neutral", "biodegradable", "hazardous", "voluntary"], correct: 0, why: "carbon-neutral = trung hoà carbon." },
          { q: "Cutting down forests on steep hillsides often leads to ___.", options: ["rewilding", "reforestation", "soil erosion", "resilience"], correct: 2, why: "Mất rễ cây giữ đất ⇒ xói mòn đất." },
          { q: "Bags made of ___ material break down naturally within months.", options: ["finite", "toxic", "unprecedented", "biodegradable"], correct: 3, why: "biodegradable = phân huỷ sinh học được." },
          { q: "The ___ of the ozone layer was first noticed in the 1980s.", options: ["depletion", "extinction", "scarcity", "mitigation"], correct: 0, why: "the depletion of the ozone layer = sự suy giảm tầng ozone. extinction dùng cho loài." },
          { q: "Tiny pieces of plastic known as ___ are now found even in rainwater.", options: ["pollutions", "wetlands", "microplastics", "food miles"], correct: 2, why: "microplastics = vi nhựa. pollution không có số nhiều." },
          { q: "Tax breaks are used to ___ companies to invest in clean energy.", options: ["enforce", "incentivise", "prohibit", "exacerbate"], correct: 1, why: "incentivise sb to V = khuyến khích bằng lợi ích." },
          { q: "Three weeks of temperatures above forty degrees: the country had never experienced such a ___.", options: ["wetland", "tipping point", "carbon tax", "heatwave"], correct: 3, why: "heatwave = đợt nắng nóng." },
        ],
      },

      { t: "h", text: "III. Collocation (6 câu) — ôn bài Từ vựng mục 6" },
      {
        t: "quiz",
        id: "t4d2-bt-colloc",
        kind: "fill",
        title: "III. Điền MỘT từ để hoàn chỉnh cụm",
        items: [
          { q: "Invasive species pose a serious ___ to native wildlife.", answers: ["threat"] },
          { q: "Night shifts take a heavy ___ on workers' health.", answers: ["toll"] },
          { q: "Planners have to strike a ___ between housing and green space.", answers: ["balance"] },
          { q: "Low prices are often achieved at the ___ of the environment.", answers: ["expense"] },
          { q: "Polluters should be held ___ for the damage they cause.", answers: ["accountable", "responsible"] },
          { q: "The island is trying to reduce its ___ on imported fuel.", answers: ["reliance", "dependence"] },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d2-bt-dich",
        kind: "translate",
        title: "IV. Dịch sang tiếng Anh — dùng cụm gợi ý",
        grammar: "Collocation + từ AWL sublist 7",
        items: [
          { q: "Ô nhiễm không khí gây thiệt hại nặng nề cho sức khoẻ của trẻ em.", answers: ["Air pollution takes a heavy toll on children's health.", "Air pollution takes a heavy toll on the health of children."], hint: "take a heavy toll on" },
          { q: "Tài nguyên là có hạn, nên chúng ta phải giảm sự phụ thuộc vào nhiên liệu hoá thạch.", answers: ["Resources are finite, so we must reduce our reliance on fossil fuels.", "Resources are finite, so we have to reduce our reliance on fossil fuels.", "Resources are finite, so we must reduce our dependence on fossil fuels.", "Natural resources are finite, so we must reduce our reliance on fossil fuels.", "Resources are finite, so we need to reduce our reliance on fossil fuels."], hint: "finite · reduce our reliance on · fossil fuels" },
          { q: "Chính phủ đã cấm bán túi nhựa dùng một lần.", answers: ["The government has prohibited the sale of single-use plastic bags.", "The government has banned the sale of single-use plastic bags.", "The government prohibited the sale of single-use plastic bags."], hint: "has prohibited · the sale of (the + N + of)" },
          { q: "Tăng trưởng kinh tế không nên đạt được bằng cái giá là môi trường.", answers: ["Economic growth should not be achieved at the expense of the environment.", "Economic growth should not come at the expense of the environment.", "Economic growth shouldn't be achieved at the expense of the environment.", "Economic growth shouldn't come at the expense of the environment."], hint: "Economic growth (không the) · at the expense of · the environment" },
          { q: "Uỷ ban gồm mười nhà khoa học từ năm nước.", answers: ["The committee comprises ten scientists from five countries.", "The committee is comprised of ten scientists from five countries.", "The committee consists of ten scientists from five countries.", "The committee comprises 10 scientists from 5 countries."], hint: "comprises (không of)" },
        ],
      },

      { t: "h", text: "V. Band 7 trông thế nào (6 câu) — ôn bài Viết mục 1 · 5 · 6 · 7" },
      {
        t: "mcq",
        id: "t4d2-bt-viet",
        title: "V. Chọn đáp án đúng",
        items: [
          { q: "Theo mô tả band, TR band 7 khác band 6 ở điểm nào?", options: ["Bài dài trên 350 từ", "Có ít nhất ba ý ở mỗi thân bài", "Ý chính được mở rộng và chống đỡ; lập trường rõ suốt bài", "Có số liệu thống kê"], correct: 2, why: "Band 7: “extends and supports main ideas” + “a clear position throughout”." },
          { q: "“Granted, electric buses are expensive to buy.” Câu tiếp theo hợp nhất là:", options: ["However, they cost far less to run, so the money is recovered within a few years.", "Moreover, they are also very expensive to repair.", "Therefore, cities should not buy them.", "On the contrary, they are expensive."], correct: 0, why: "Sau câu nhượng bộ phải là lời BÁC: However + chỉ ra điều câu trước bỏ sót." },
          { q: "Câu nào dùng “On the contrary” ĐÚNG?", options: ["Buses are cheap. On the contrary, trains are fast.", "Admittedly it is costly. On the contrary, it works.", "Some people like cars. On the contrary, others like bikes.", "The scheme was not a failure. On the contrary, it exceeded every target."], correct: 3, why: "On the contrary bác lại ý phủ định vừa nêu (“không thất bại — trái lại, còn vượt mục tiêu”). Ba câu kia cần In contrast / However." },
          { q: "Trong thân bài band 7, ngay sau câu chủ đề nên là gì?", options: ["Một ý chính khác", "Một câu giải thích cơ chế: vì sao / bằng cách nào ý ấy đúng", "Câu kết luận cả bài", "Một câu hỏi tu từ"], correct: 1, why: "Thang ba tầng: chủ đề → cơ chế → ví dụ cụ thể → chốt." },
          { q: "Câu nào có từ chỉ lại RÕ nhất?", options: ["Many cities charge drivers to enter the centre. This policy has reduced congestion.", "Many cities charge drivers to enter the centre. It has reduced it.", "Many cities charge drivers to enter the centre. They reduced.", "Many cities charge drivers to enter the centre. Moreover, this."], correct: 0, why: "this + danh từ tóm ý (policy) ⇒ người đọc biết ngay “this” chỉ việc thu phí." },
          { q: "Câu nào KHÔNG có lỗi?", options: ["Both governments, companies and individuals are important.", "If everybody do these things, it will help.", "Governments, companies and individuals all have a part to play.", "The environmental problems like climate change is serious."], correct: 2, why: "both chỉ dùng cho hai thứ; everybody + does; nói chung thì không the và problems + are." },
        ],
      },

      { t: "h", text: "VI. Ghép câu khung (4 câu) — ôn bài Viết mục 6, bài Nói mục 2" },
      {
        t: "build",
        id: "t4d2-bt-ghep",
        title: "VI. Bấm các mảnh theo đúng thứ tự để dựng câu",
        items: [
          { vi: "Công nhận là kế hoạch này tốn kém. Tuy nhiên, không làm gì sẽ còn tốn kém hơn.", chips: ["Granted,", "this plan", "is costly.", "However,", "doing nothing", "would cost", "even more.", "Although", "but"], answer: ["Granted,", "this plan", "is costly.", "However,", "doing nothing", "would cost", "even more."] },
          { vi: "Lập luận này bỏ qua các chi phí dài hạn.", chips: ["This argument", "overlooks", "the long-term", "costs.", "overlook", "of"], answer: ["This argument", "overlooks", "the long-term", "costs."] },
          { vi: "Điều thật sự làm tôi bực là tiếng ồn.", chips: ["What", "really", "gets on", "my nerves", "is", "the noise.", "are", "my nerve"], answer: ["What", "really", "gets on", "my nerves", "is", "the noise."] },
          { vi: "Nếu phải chọn một, đó sẽ là app ghi chú của tôi.", chips: ["If", "I had to", "pick one,", "it would be", "my notes app.", "will be", "have to"], answer: ["If", "I had to", "pick one,", "it would be", "my notes app."] },
        ],
      },

      { t: "h", text: "VII. Nói: Part 1 band 7 · cụm ít gặp · trọng âm câu (5 câu) — ôn bài Nói mục 3 · 7 · 9" },
      {
        t: "mcq",
        id: "t4d2-bt-noi",
        title: "VII. Chọn đáp án đúng",
        items: [
          { q: "Một câu trả lời Part 1 band 7 nên dài khoảng bao nhiêu?", options: ["Một từ: Yes / No", "2–3 câu, 15–20 giây", "6–8 câu, gần 1 phút", "Càng dài càng tốt"], correct: 1, why: "Part 1 ngắn – thẳng – dừng đúng lúc; band 7 khác ở độ cụ thể, không ở độ dài." },
          { q: "Cụm nào đúng nguyên dạng?", options: ["It gets on my nerve.", "Once in the blue moon.", "I'm a creature of habits.", "It really gets on my nerves."], correct: 3, why: "get on my nerves · once in a blue moon · a creature of habit." },
          { q: "“I eat out once in a blue moon” nghĩa là:", options: ["Tôi rất hiếm khi đi ăn ngoài.", "Tôi đi ăn ngoài mỗi tháng một lần vào đêm trăng.", "Tôi đi ăn ngoài rất thường xuyên.", "Tôi chưa bao giờ đi ăn ngoài."], correct: 0, why: "once in a blue moon = năm thì mười hoạ." },
          { q: "Câu nào nghe như văn viết, KHÔNG hợp khi trả lời Part 1?", options: ["I'm really into it, to be honest.", "It's a bit out of the way for me.", "Furthermore, it is highly beneficial for one's health.", "Not as often as I'd like."], correct: 2, why: "Furthermore · highly beneficial · one's là văn viết trang trọng." },
          { q: "“I didn't buy it; my sister did.” Từ nào được nhấn mạnh nhất ở vế sau?", options: ["my", "sister", "did", "it"], correct: 1, why: "sister là thông tin đối lập với I ⇒ nhấn." },
        ],
      },

      { t: "h", text: "VIII. Viết một đoạn “nêu rồi bác” (90–110 từ) — AI chấm" },
      {
        t: "essay",
        id: "t4d2-bt-viet-doan",
        task: "Task 2",
        prompt: "Viết MỘT đoạn văn 90–110 từ theo khung “nêu rồi bác”. Ý đối lập cần nêu rồi bác: “A tax on plastic packaging would make food more expensive for poor families.” Bắt đầu bằng Granted, … hoặc Admittedly, …",
        minWords: 90,
        tips: [
          "Câu 1 — nêu ý đối lập ở dạng mạnh nhất: Granted, a tax on plastic packaging would…",
          "Câu 2 — bẻ lái và nói ý ấy bỏ sót gì: However, this objection overlooks…",
          "Câu 3–4 — chống đỡ lời bác: cơ chế (tiền thuế dùng vào đâu? ai thật sự trả?) + một ví dụ cụ thể.",
          "Câu cuối — chốt: For this reason, …",
          "Dùng 2–3 cụm của bài Từ vựng: bear the cost of · low-income households · incentivise · throwaway culture.",
          "Soát mạo từ theo 4 bước của Ngày 1.",
        ],
      },

      { t: "h", text: "IX. Nói 6 câu Part 1 — ghi âm, AI chấm" },
      {
        t: "speak",
        id: "t4d2-bt-noi-p1",
        part: "1",
        questions: [
          "Do you like spending time outdoors?",
          "How often do you buy things you don't really need?",
          "When was the last time you spent a whole day without your phone?",
          "Is cycling popular in your country?",
          "What do you dislike about the area where you live?",
          "What kind of weather do you like most?",
        ],
      },
      {
        t: "note",
        title: "💡 Tự chấm phần IX trước khi xem điểm AI",
        items: [
          "Mỗi câu có mở **thẳng** vào câu hỏi không (không lặp lại nguyên câu hỏi)?",
          "Mỗi câu có ít nhất MỘT chi tiết chỉ bạn mới có (nơi, giờ, người, con số)?",
          "Cả 6 câu có 3–4 cụm ít gặp dùng đúng nguyên dạng không?",
          "Có câu nào dài quá 25 giây hoặc kết bằng “…and yeah” không?",
          "Nghe lại: bạn có nhấn đúng từ mang ý mới / ý đối lập không?",
        ],
      },
    ],
  },
];
