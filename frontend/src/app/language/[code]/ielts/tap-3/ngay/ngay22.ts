/**
 * IELTS Tập 3 — Ngày 22 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, đề, bài mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Động vật, thiên nhiên & đa dạng sinh học: 40 từ + 12 cụm, họ từ, từ dễ nhầm, kho ý tưởng      [VC24]
 *   Bài 2 (writing)   Two-part question band 6: đếm vế + một câu hỏi chứa HAI đối tượng, dàn ý 2 câu hỏi, kho ý
 *                     tưởng (bánh xe tầng · nhóm người · chuỗi hệ quả · tự tìm ý từ bài báo), mẫu band 5 vs band 6    [W07 W18]
 *                     — nối Tập 2 Ngày 18 (Two-part nhập môn) · Ngày 6 (dàn ý 5 phút), Tập 3 Ngày 2 (tái tạo bài mẫu)
 *   Bài 3 (speaking)  Part 2: Describe an event vòng 2 — kể quá khứ hoàn chỉnh (4 thì kể chuyện) + “a time when”
 *                     vòng 2 (5 chặng, cảm xúc, câu thoại, bài học) + chiến thuật đổi ý                             [S05]
 *                     — nối Tập 2 Ngày 15 (sự kiện) · Ngày 23 (tình huống), Tập 3 Ngày 1 (hệ thì) · 🔊 -ed + nối âm
 *   Bài tập Ngày 22   43 câu có đáp án + 1 đoạn viết + 1 lượt nói
 * Mọi id bắt đầu `t3d22-`.
 */
import type { Lesson } from '../data';

export const NGAY_22: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t3d22-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Động vật, thiên nhiên & đa dạng sinh học (Animals, nature & biodiversity)",
    goal: "Dùng đúng 40 từ và 12 cụm về loài vật – hệ sinh thái, các mối đe doạ và công tác bảo tồn; phân biệt endangered / extinct, conserve / preserve / reserve, wild / wildlife; có sẵn ý hai phía cho đề Task 2 và Part 3 về sở thú, bảo vệ động vật, thí nghiệm trên động vật — đẩy LR band 6 (đủ rộng, dám dùng từ ít gặp).",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**52 mục từ** chia 4 nhóm: loài vật & hệ sinh thái (14) · mối đe doạ (14) · bảo tồn (12) · cụm ăn điểm (12). Chủ đề này ra đều ở Task 2 (zoos, endangered species, animal testing), Part 2 – 3 và bài đọc khoa học.",
          "Ba cặp dễ nhầm nhất: **endangered** (sắp tuyệt chủng — còn sống) ≠ **extinct** (đã tuyệt chủng) · **conserve / preserve / reserve** · **wild** (tính từ) / **wildlife** (danh từ không đếm được).",
          "**species** số ít và số nhiều viết GIỐNG nhau: one species · many species (không có ~~specie~~).",
          "Học theo **chuỗi nhân quả** để dùng luôn ngữ pháp Ngày 21: deforestation → habitat loss → decline → extinction.",
          "Cuối bài có **kho ý tưởng hai phía** cho đề về sở thú và chi tiền bảo vệ động vật — dùng ngay ở bài Viết hôm nay.",
          "Tiêu chí được đẩy: **LR** (Writing + Speaking). Band 6 = dùng được collocation đúng, không chỉ biết nghĩa từng từ.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Loài vật & hệ sinh thái — 14 từ" },
      {
        t: "p",
        text: "Nhóm này trả lời câu hỏi “cái gì sống ở đâu, ăn gì, quan hệ với nhau thế nào”. Từ khung là **species** (loài) sống trong một **habitat** (nơi sống), nhiều habitat và các loài trong đó làm thành một **ecosystem** (hệ sinh thái); số loài càng phong phú thì **biodiversity** (đa dạng sinh học) càng cao.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Từ nhỏ đến lớn",
        steps: [
          { label: "species", sub: "một loài: the Asian elephant" },
          { label: "habitat", sub: "nơi loài đó sống: tropical forest" },
          { label: "ecosystem", sub: "mọi loài + đất, nước, khí hậu ở đó" },
          { label: "biodiversity", sub: "độ phong phú của sự sống trên một vùng / cả hành tinh" },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "species", pos: "n", ipa: "/ˈspiːʃiːz/", vi: "loài (số ít = số nhiều)", ex: "More than 200 species of bird live in the park.", exVi: "Hơn 200 loài chim sống trong công viên.", more: "a species **of** + N · an endangered / a rare / a native species · KHÔNG có ~~specie~~" },
          { w: "habitat", pos: "n", ipa: "/ˈhæbɪtæt/", vi: "môi trường sống, nơi sống tự nhiên", ex: "Pandas are losing their natural habitat.", exVi: "Gấu trúc đang mất môi trường sống tự nhiên.", more: "natural habitat · habitat loss · destroy / protect a habitat" },
          { w: "ecosystem", pos: "n", ipa: "/ˈiːkəʊsɪstəm/", vi: "hệ sinh thái", ex: "Coral reefs are among the richest ecosystems on Earth.", exVi: "Rạn san hô nằm trong số các hệ sinh thái phong phú nhất Trái Đất.", more: "a fragile / marine ecosystem · damage an ecosystem" },
          { w: "biodiversity", pos: "n", ipa: "/ˌbaɪəʊdaɪˈvɜːsəti/", vi: "đa dạng sinh học (không đếm được)", ex: "Rainforests are home to most of the world's biodiversity.", exVi: "Rừng mưa là nơi có phần lớn đa dạng sinh học của thế giới.", more: "loss of biodiversity · protect biodiversity · tính từ: biodiverse" },
          { w: "wildlife", pos: "n", ipa: "/ˈwaɪldlaɪf/", vi: "động vật hoang dã (không đếm được)", ex: "Tourists come here to watch the local wildlife.", exVi: "Du khách đến đây để ngắm động vật hoang dã địa phương.", more: "KHÔNG ~~wildlifes~~ / ~~a wildlife~~ · wildlife conservation · a wildlife park" },
          { w: "mammal", pos: "n", ipa: "/ˈmæml/", vi: "động vật có vú", ex: "The blue whale is the largest mammal in the world.", exVi: "Cá voi xanh là loài có vú lớn nhất thế giới.", more: "marine mammals (cá voi, cá heo)" },
          { w: "reptile", pos: "n", ipa: "/ˈreptaɪl/", vi: "bò sát", ex: "Snakes and crocodiles are reptiles.", exVi: "Rắn và cá sấu là bò sát.", more: "cùng nhóm: amphibian (lưỡng cư), insect (côn trùng)" },
          { w: "insect", pos: "n", ipa: "/ˈɪnsekt/", vi: "côn trùng", ex: "Many crops depend on insects such as bees.", exVi: "Nhiều cây trồng phụ thuộc vào côn trùng như ong.", more: "pollinate (thụ phấn) · insect populations" },
          { w: "predator", pos: "n", ipa: "/ˈpredətə/", vi: "thú săn mồi", ex: "Without predators, the number of deer grew rapidly.", exVi: "Không có thú săn mồi, số hươu tăng nhanh.", more: "a natural predator · top predator" },
          { w: "prey", pos: "n", ipa: "/preɪ/", vi: "con mồi (không đếm được)", ex: "Owls hunt their prey at night.", exVi: "Cú săn mồi vào ban đêm.", more: "động từ: prey **on** small animals · đọc giống pray" },
          { w: "food chain", pos: "n", ipa: "/ˈfuːd tʃeɪn/", vi: "chuỗi thức ăn", ex: "Plastic in the sea is now entering the food chain.", exVi: "Nhựa trong biển giờ đang đi vào chuỗi thức ăn.", more: "at the top / bottom of the food chain" },
          { w: "breed", pos: "v / n", ipa: "/briːd/", vi: "sinh sản; nhân giống · (n) giống vật nuôi", ex: "Many birds return to the same place to breed.", exVi: "Nhiều loài chim quay lại cùng một nơi để sinh sản.", more: "breed – bred – bred · breed animals in captivity · a breed of dog" },
          { w: "migrate", pos: "v", ipa: "/maɪˈɡreɪt/", vi: "di cư (theo mùa)", ex: "These birds migrate south every autumn.", exVi: "Loài chim này di cư về phương nam mỗi mùa thu.", more: "danh từ: migration · tính từ: migratory birds" },
          { w: "native", pos: "adj", ipa: "/ˈneɪtɪv/", vi: "bản địa", ex: "The red squirrel is native to Britain.", exVi: "Sóc đỏ là loài bản địa của nước Anh.", more: "be native **to** + nơi · native species ↔ invasive species" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với nhóm từ loài vật",
        items: [
          "~~a specie~~ · ~~many kind of animals~~ ⇒ **a species** · **many species / kinds of animals**.",
          "~~wild animals’ habitat is destroyed by human~~ ⇒ **by humans** / **by human activity** (human đếm được).",
          "~~wildlifes~~ ⇒ wildlife không đếm được: **wildlife is** under threat. Muốn đếm: wild animals **are**…",
          "~~nature’s environment~~ / ~~the nature~~ ⇒ **nature** (không the): protect nature; **the natural environment**.",
          "Danh từ đứng trước danh từ khác thì để số ít: **animal rights**, **animal welfare** — không ~~animals rights~~.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Các mối đe doạ — 14 từ" },
      {
        t: "p",
        text: "Đề Task 2 hay hỏi **vì sao** các loài biến mất. Nhóm từ này chính là danh sách nguyên nhân (deforestation, poaching, overfishing, pesticides, invasive species) và kết quả (decline, die out, extinction). Học thành chuỗi để viết câu nhân quả kiểu Ngày 21.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Chuỗi nhân quả — dùng với lead to · result in · as a result",
        steps: [
          { label: "deforestation · overfishing · poaching · pesticides", sub: "nguyên nhân do con người" },
          { label: "habitat loss · less food · fewer adults", sub: "hệ quả trực tiếp" },
          { label: "populations decline", sub: "số lượng giảm; loài trở thành endangered" },
          { label: "the species dies out / becomes extinct", sub: "tuyệt chủng — không đảo ngược được" },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "endangered", pos: "adj", ipa: "/ɪnˈdeɪndʒəd/", vi: "có nguy cơ tuyệt chủng (vẫn còn sống)", ex: "The tiger is an endangered species.", exVi: "Hổ là loài có nguy cơ tuyệt chủng.", more: "critically endangered · động từ: endanger · ≠ extinct" },
          { w: "extinct", pos: "adj", ipa: "/ɪkˈstɪŋkt/", vi: "đã tuyệt chủng", ex: "Dinosaurs became extinct about 66 million years ago.", exVi: "Khủng long tuyệt chủng khoảng 66 triệu năm trước.", more: "become / go extinct · KHÔNG ~~be extincted~~ (extinct không phải động từ)" },
          { w: "extinction", pos: "n", ipa: "/ɪkˈstɪŋkʃn/", vi: "sự tuyệt chủng", ex: "Hundreds of species are now facing extinction.", exVi: "Hàng trăm loài hiện đang đối mặt với tuyệt chủng.", more: "face extinction · be threatened with extinction · save sth from extinction" },
          { w: "threat", pos: "n", ipa: "/θret/", vi: "mối đe doạ", ex: "Plastic waste is a serious threat to sea birds.", exVi: "Rác nhựa là mối đe doạ nghiêm trọng với chim biển.", more: "a threat **to** · pose a threat · động từ: threaten · under threat" },
          { w: "habitat loss", pos: "n", ipa: "/ˈhæbɪtæt lɒs/", vi: "mất môi trường sống", ex: "Habitat loss is the main reason why orangutans are disappearing.", exVi: "Mất môi trường sống là lý do chính khiến đười ươi đang biến mất.", more: "habitat loss / destruction · result in habitat loss" },
          { w: "deforestation", pos: "n", ipa: "/ˌdiːˌfɒrɪˈsteɪʃn/", vi: "nạn phá rừng", ex: "Deforestation has destroyed half of the island's forests.", exVi: "Nạn phá rừng đã huỷ một nửa rừng của hòn đảo.", more: "clear forests for farmland · trái nghĩa: reforestation" },
          { w: "poaching", pos: "n", ipa: "/ˈpəʊtʃɪŋ/", vi: "săn trộm", ex: "Poaching has reduced the number of rhinos dramatically.", exVi: "Săn trộm đã làm giảm mạnh số tê giác.", more: "người: a poacher · động từ: poach · illegal hunting" },
          { w: "overfishing", pos: "n", ipa: "/ˌəʊvəˈfɪʃɪŋ/", vi: "đánh bắt cá quá mức", ex: "Overfishing means that fish cannot breed fast enough to recover.", exVi: "Đánh bắt quá mức khiến cá không sinh sản kịp để phục hồi.", more: "fish stocks (trữ lượng cá) · cùng kiểu: overhunting" },
          { w: "invasive", pos: "adj", ipa: "/ɪnˈveɪsɪv/", vi: "xâm lấn (loài ngoại lai gây hại)", ex: "Invasive plants can push out native species.", exVi: "Cây xâm lấn có thể đẩy lùi loài bản địa.", more: "an invasive species · động từ: invade" },
          { w: "pesticide", pos: "n", ipa: "/ˈpestɪsaɪd/", vi: "thuốc trừ sâu", ex: "The use of pesticides has been linked to the fall in bee numbers.", exVi: "Việc dùng thuốc trừ sâu được cho là liên quan tới số ong sụt giảm.", more: "spray pesticides · chemical pesticides" },
          { w: "decline", pos: "v / n", ipa: "/dɪˈklaɪn/", vi: "suy giảm; sự suy giảm", ex: "Elephant populations have declined by 60% since 1970.", exVi: "Số lượng voi đã giảm 60 % từ năm 1970.", more: "a sharp decline **in** · be in decline · dùng cả trong Task 1" },
          { w: "die out", pos: "phr v", ipa: "/daɪ aʊt/", vi: "chết dần, tuyệt chủng", ex: "Many island birds died out after cats were introduced.", exVi: "Nhiều loài chim đảo tuyệt chủng sau khi mèo được đưa tới.", more: "= become extinct · cũng dùng cho truyền thống: the custom is dying out" },
          { w: "captivity", pos: "n", ipa: "/kæpˈtɪvəti/", vi: "tình trạng nuôi nhốt", ex: "Animals kept in captivity often live longer but behave differently.", exVi: "Động vật nuôi nhốt thường sống lâu hơn nhưng hành xử khác đi.", more: "in captivity ↔ in the wild · be bred in captivity" },
          { w: "exploit", pos: "v", ipa: "/ɪkˈsplɔɪt/", vi: "khai thác, bóc lột", ex: "Some companies exploit animals for entertainment.", exVi: "Một số công ty bóc lột động vật để giải trí.", more: "danh từ: exploitation · exploit natural resources" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Bảo tồn — 12 từ" },
      {
        t: "vocab",
        items: [
          { w: "conservation", pos: "n", ipa: "/ˌkɒnsəˈveɪʃn/", vi: "sự bảo tồn (thiên nhiên)", ex: "The money will be spent on wildlife conservation.", exVi: "Số tiền sẽ được chi cho bảo tồn động vật hoang dã.", more: "người: a conservationist · conservation work / projects" },
          { w: "conserve", pos: "v", ipa: "/kənˈsɜːv/", vi: "bảo tồn; dùng tiết kiệm", ex: "We need to conserve the forests that remain.", exVi: "Ta cần bảo tồn những khu rừng còn lại.", more: "conserve energy / water · ≠ preserve · ≠ reserve (mục 5)" },
          { w: "protected area", pos: "n", ipa: "/prəˌtektɪd ˈeəriə/", vi: "khu vực được bảo vệ", ex: "Hunting is not allowed inside the protected area.", exVi: "Không được săn bắn trong khu vực được bảo vệ.", more: "a protected species · protect sth **from / against**" },
          { w: "nature reserve", pos: "n", ipa: "/ˈneɪtʃə rɪzɜːv/", vi: "khu bảo tồn thiên nhiên", ex: "The wetland was turned into a nature reserve in 2005.", exVi: "Vùng đất ngập nước được chuyển thành khu bảo tồn năm 2005.", more: "cùng nhóm: a national park · a marine reserve" },
          { w: "sanctuary", pos: "n", ipa: "/ˈsæŋktʃuəri/", vi: "khu cứu hộ, nơi trú ẩn cho động vật", ex: "The bears were moved to a sanctuary after being rescued.", exVi: "Những con gấu được chuyển tới khu cứu hộ sau khi được giải cứu.", more: "a wildlife / bird sanctuary · rescue (giải cứu)" },
          { w: "reintroduce", pos: "v", ipa: "/ˌriːɪntrəˈdjuːs/", vi: "tái thả (đưa loài trở lại tự nhiên)", ex: "Wolves were reintroduced to the park in 1995.", exVi: "Sói được tái thả vào công viên năm 1995.", more: "danh từ: reintroduction · release animals into the wild" },
          { w: "breeding programme", pos: "n", ipa: "/ˈbriːdɪŋ prəʊɡræm/", vi: "chương trình nhân giống", ex: "Zoos run breeding programmes for rare species.", exVi: "Sở thú thực hiện các chương trình nhân giống loài quý hiếm.", more: "a captive breeding programme · Anh-Mỹ: program" },
          { w: "restore", pos: "v", ipa: "/rɪˈstɔː/", vi: "phục hồi", ex: "Volunteers are helping to restore the damaged wetland.", exVi: "Tình nguyện viên đang giúp phục hồi vùng đất ngập nước bị hư hại.", more: "danh từ: restoration · restore a habitat / an ecosystem" },
          { w: "ban", pos: "v / n", ipa: "/bæn/", vi: "cấm; lệnh cấm", ex: "The government banned the sale of ivory.", exVi: "Chính phủ cấm bán ngà voi.", more: "a ban **on** + N · ban sb **from** V-ing · impose / lift a ban" },
          { w: "awareness", pos: "n", ipa: "/əˈweənəs/", vi: "nhận thức, sự hiểu biết", ex: "Documentaries have increased public awareness of ocean pollution.", exVi: "Phim tài liệu đã nâng cao nhận thức của công chúng về ô nhiễm đại dương.", more: "raise awareness **of / about** · tính từ: aware **of**" },
          { w: "welfare", pos: "n", ipa: "/ˈwelfeə/", vi: "phúc lợi, sự được chăm sóc tốt", ex: "The law sets standards for the welfare of farm animals.", exVi: "Luật đặt ra tiêu chuẩn về phúc lợi cho vật nuôi ở trang trại.", more: "animal welfare · ≠ animal rights (quyền động vật)" },
          { w: "cruel", pos: "adj", ipa: "/ˈkruːəl/", vi: "tàn nhẫn, độc ác", ex: "Many people think it is cruel to keep whales in small pools.", exVi: "Nhiều người cho rằng nhốt cá voi trong bể nhỏ là tàn nhẫn.", more: "be cruel **to** animals · danh từ: cruelty · trái nghĩa: humane" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mười hai cụm ăn điểm (collocation) cho Task 2 và Part 3" },
      {
        t: "p",
        text: "Collocation = các từ **thường đi với nhau**. Giám khảo band 6 tìm đúng thứ này: không cần từ hiếm, cần cụm đúng. Học cả cụm kèm giới từ; che cột tiếng Anh và tự nói lại.",
      },
      {
        t: "vocab",
        items: [
          { w: "on the verge of extinction", pos: "phr", ipa: "/ɒn ðə vɜːdʒ əv ɪkˈstɪŋkʃn/", vi: "bên bờ tuyệt chủng", ex: "The species was on the verge of extinction in the 1980s.", exVi: "Loài này từng ở bên bờ tuyệt chủng vào thập niên 1980.", more: "= on the brink of extinction" },
          { w: "be driven to extinction", pos: "phr", ipa: "/bi ˈdrɪvn tu ɪkˈstɪŋkʃn/", vi: "bị đẩy tới tuyệt chủng", ex: "Several species have been driven to extinction by hunting.", exVi: "Một số loài đã bị săn bắn đẩy tới tuyệt chủng.", more: "drive – drove – driven · by + nguyên nhân" },
          { w: "in the wild", pos: "phr", ipa: "/ɪn ðə waɪld/", vi: "trong tự nhiên hoang dã", ex: "Only about 5,500 tigers remain in the wild.", exVi: "Chỉ còn khoảng 5.500 con hổ trong tự nhiên.", more: "↔ in captivity · live / survive in the wild" },
          { w: "natural habitat", pos: "phr", ipa: "/ˌnætʃrəl ˈhæbɪtæt/", vi: "môi trường sống tự nhiên", ex: "Animals should be allowed to live in their natural habitat.", exVi: "Động vật nên được sống trong môi trường tự nhiên của chúng.", more: "destroy / lose / protect their natural habitat" },
          { w: "loss of biodiversity", pos: "phr", ipa: "/lɒs əv ˌbaɪəʊdaɪˈvɜːsəti/", vi: "sự suy giảm đa dạng sinh học", ex: "Intensive farming contributes to the loss of biodiversity.", exVi: "Canh tác thâm canh góp phần làm suy giảm đa dạng sinh học.", more: "= biodiversity loss · contribute to / lead to the loss of…" },
          { w: "pose a threat to", pos: "phr", ipa: "/pəʊz ə θret tuː/", vi: "gây ra mối đe doạ cho", ex: "Rising sea temperatures pose a threat to coral reefs.", exVi: "Nhiệt độ nước biển tăng gây đe doạ cho rạn san hô.", more: "pose a serious / major threat to · KHÔNG ~~make a threat~~" },
          { w: "raise awareness of", pos: "phr", ipa: "/reɪz əˈweənəs əv/", vi: "nâng cao nhận thức về", ex: "Zoos help to raise awareness of endangered species.", exVi: "Sở thú giúp nâng cao nhận thức về các loài có nguy cơ tuyệt chủng.", more: "raise (không ~~rise~~ / ~~improve~~) awareness" },
          { w: "upset the balance of nature", pos: "phr", ipa: "/ʌpˈset ðə ˈbæləns əv ˈneɪtʃə/", vi: "làm đảo lộn cân bằng tự nhiên", ex: "Removing one predator can upset the balance of nature.", exVi: "Loại bỏ một loài săn mồi có thể làm đảo lộn cân bằng tự nhiên.", more: "= disturb the ecological balance" },
          { w: "play a vital role in", pos: "phr", ipa: "/pleɪ ə ˈvaɪtl rəʊl ɪn/", vi: "đóng vai trò thiết yếu trong", ex: "Bees play a vital role in food production.", exVi: "Ong đóng vai trò thiết yếu trong sản xuất lương thực.", more: "play a key / major role in + N / V-ing" },
          { w: "animal testing", pos: "phr", ipa: "/ˈænɪml ˈtestɪŋ/", vi: "thử nghiệm trên động vật", ex: "Animal testing for cosmetics is banned in many countries.", exVi: "Thử nghiệm mỹ phẩm trên động vật bị cấm ở nhiều nước.", more: "= experiments on animals · test products **on** animals" },
          { w: "the illegal wildlife trade", pos: "phr", ipa: "/ði ɪˈliːɡl ˈwaɪldlaɪf treɪd/", vi: "nạn buôn bán động vật hoang dã trái phép", ex: "The illegal wildlife trade is worth billions of dollars a year.", exVi: "Buôn bán động vật hoang dã trái phép trị giá hàng tỷ đô-la mỗi năm.", more: "trade **in** ivory / rare birds" },
          { w: "for future generations", pos: "phr", ipa: "/fə ˈfjuːtʃə ˌdʒenəˈreɪʃnz/", vi: "cho các thế hệ tương lai", ex: "We have a duty to protect these forests for future generations.", exVi: "Ta có nghĩa vụ bảo vệ những khu rừng này cho các thế hệ tương lai.", more: "have a duty / responsibility to + V" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Họ từ, từ dễ nhầm và trọng âm" },
      {
        t: "table",
        head: ["Động từ", "Danh từ", "Tính từ", "Ghi chú"],
        rows: [
          ["conserve", "conservation · conservationist", "—", "trọng âm: conSERVE · conserVAtion"],
          ["protect", "protection", "protective · protected", "protect sth **from**"],
          ["threaten", "threat", "threatening · threatened", "threatened species"],
          ["endanger", "danger", "endangered · dangerous", "endangered (bị nguy hiểm) ≠ dangerous (gây nguy hiểm)"],
          ["— (become extinct)", "extinction", "extinct", "KHÔNG có động từ ~~extinct~~"],
          ["destroy", "destruction", "destructive", "habitat destruction"],
          ["migrate", "migration", "migratory", "migratory birds"],
          ["survive", "survival · survivor", "—", "the survival **of** the species"],
          ["pollute", "pollution · pollutant", "polluted", "air / water pollution"],
          ["diversify", "diversity · biodiversity", "diverse", "a diverse ecosystem"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba nhóm từ người Việt hay dùng lẫn",
        cols: [
          { title: "endangered · extinct · rare", items: ["**endangered** = còn sống, sắp mất: Tigers are endangered.", "**extinct** = không còn con nào: The dodo is extinct.", "**rare** = hiếm, khó gặp (chưa chắc nguy cấp)", "~~Tigers are extinct~~ ⇒ sai sự thật"] },
          { title: "conserve · preserve · reserve", items: ["**conserve** = bảo tồn thiên nhiên; dùng tiết kiệm: conserve forests / water", "**preserve** = giữ nguyên trạng: preserve old buildings / traditions / food", "**reserve** (v) = đặt trước: reserve a table", "**reserve** (n) = khu bảo tồn: a nature reserve"] },
          { title: "wild · wildlife · wilderness", items: ["**wild** (adj) = hoang dã: wild animals", "**the wild** (n) = tự nhiên: in the wild", "**wildlife** (n, không đếm được) = động vật hoang dã nói chung", "**wilderness** = vùng hoang vu không người"] },
        ],
      },
      {
        t: "table",
        head: ["Từ", "Trọng âm", "Hay đọc sai"],
        rows: [
          ["HAbitat", "âm 1 /ˈhæbɪtæt/", "~~haBItat~~"],
          ["biodiVERsity", "âm 4 /ˌbaɪəʊdaɪˈvɜːsəti/", "~~BIOdiversity~~"],
          ["exTINCT · exTINCtion", "âm 2", "bỏ mất /k/: ~~/ɪkˈstɪnt/~~"],
          ["SPEcies", "âm 1 /ˈspiːʃiːz/", "~~/ˈspesiz/~~ — chữ c đọc /ʃ/"],
          ["capTIvity", "âm 2 /kæpˈtɪvəti/", "~~CAPtivity~~"],
          ["SANCtuary", "âm 1 /ˈsæŋktʃuəri/", "~~sancTUary~~"],
          ["deforesTAtion", "âm 4", "nhấn nhầm âm 2"],
          ["PREdator", "âm 1 /ˈpredətə/", "~~preDAtor~~"],
        ],
      },
      {
        t: "quiz",
        id: "t3d22-tv-ho-tu",
        kind: "fill",
        title: "Điền đúng dạng của từ trong ngoặc (10 câu)",
        items: [
          { q: "1. The black rhino is one of the most ___ animals in Africa. (DANGER)", answers: ["endangered"] },
          { q: "2. The ___ of the rainforest is happening faster than ever. (DESTROY)", answers: ["destruction"] },
          { q: "3. Many scientists work in wildlife ___. (CONSERVE)", answers: ["conservation"] },
          { q: "4. Without help, the species may become ___ within ten years. (EXTINCTION)", answers: ["extinct"] },
          { q: "5. Pollution is a serious ___ to marine life. (THREATEN)", answers: ["threat"] },
          { q: "6. The annual ___ of these birds covers 10,000 kilometres. (MIGRATE)", answers: ["migration"] },
          { q: "7. A ___ ecosystem recovers more quickly from damage. (DIVERSITY)", answers: ["diverse"] },
          { q: "8. The ___ of the panda depends on protecting bamboo forests. (SURVIVE)", answers: ["survival"] },
          { q: "9. The river is so ___ that no fish can live in it. (POLLUTE)", answers: ["polluted"] },
          { q: "10. Stronger laws are needed for the ___ of rare plants. (PROTECT)", answers: ["protection"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án — điền dạng từ",
        items: [
          "Câu 1: sau “most” và trước danh từ ⇒ tính từ; con vật **bị** nguy hiểm ⇒ endangered (dangerous = con vật gây nguy hiểm).",
          "Câu 4: become + **tính từ** ⇒ extinct. Không có ~~become extinction~~.",
          "Câu 2, 3, 6, 8, 10: sau the / wildlife và trước of / dấu chấm ⇒ danh từ.",
          "Câu 5: a serious + danh từ + to ⇒ threat (to).",
          "Câu 7, 9: trước danh từ / sau so ⇒ tính từ: diverse, polluted.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Dùng trong Task 2 và Part 3 — kho ý tưởng hai phía" },
      {
        t: "p",
        text: "Ba câu hỏi ra nhiều nhất về chủ đề này: (1) Sở thú có nên tồn tại? (2) Có nên chi nhiều tiền bảo vệ động vật hoang dã khi con người còn nghèo? (3) Thử nghiệm trên động vật có chấp nhận được không? Dưới đây là ý cho câu (1); bảng bên dưới cho (2) và (3). Mỗi ý đi kèm cụm từ hôm nay.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Should zoos still exist?",
        cols: [
          { title: "Ủng hộ", items: ["**breeding programmes** cứu loài on the verge of extinction rồi **reintroduce** về tự nhiên", "trẻ thành phố được thấy động vật thật ⇒ **raise awareness of** conservation", "nghiên cứu khoa học khó làm **in the wild**", "tiền vé tài trợ **conservation projects**"] },
          { title: "Phản đối", items: ["thú lớn (voi, cá voi) chịu khổ **in captivity** — không gian quá nhỏ so với **natural habitat**", "nhiều sở thú chỉ là giải trí, **exploit** động vật để kiếm tiền", "con sinh ra trong chuồng hiếm khi sống sót khi thả", "phim tài liệu và **sanctuaries** dạy tốt hơn mà không **cruel**"] },
        ],
        caption: "Lập trường band 6 dễ viết: sở thú tốt (nhân giống, rộng, có nghiên cứu) nên giữ; sở thú chỉ để giải trí nên đóng.",
      },
      {
        t: "table",
        head: ["Đề", "Ý ủng hộ", "Ý phản đối"],
        rows: [
          ["Chi tiền bảo vệ động vật hoang dã", "mất một loài có thể **upset the balance of nature**; ong, cá… **play a vital role in** food production; ecotourism tạo việc làm", "tiền nên ưu tiên y tế, giáo dục; người nghèo sống gần rừng cần đất canh tác; tuyệt chủng là quy luật tự nhiên (ý yếu — nên bác)"],
          ["Animal testing", "thuốc và vắc-xin mới cần thử trước khi dùng cho người; hiện chưa có cách thay thế hoàn toàn", "**cruel**; kết quả trên động vật không luôn đúng với người; mỹ phẩm không phải nhu cầu thiết yếu ⇒ nên **ban**"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Although zoos are often criticised, well-run ones play a vital role in saving species that are on the verge of extinction.", vi: "Mặc dù sở thú hay bị chỉ trích, những sở thú quản lý tốt đóng vai trò thiết yếu trong việc cứu các loài bên bờ tuyệt chủng. (Although — Ngày 21)" },
          { en: "Deforestation leads to habitat loss, which in turn means that large mammals have nowhere to breed.", vi: "Phá rừng dẫn tới mất môi trường sống, điều đó lại khiến thú lớn không còn nơi sinh sản. (chuỗi hệ quả)" },
          { en: "Many species are in decline owing to the illegal wildlife trade.", vi: "Nhiều loài đang suy giảm do nạn buôn bán động vật hoang dã trái phép. (owing to + N)" },
          { en: "[Part 3] I'd say keeping wild animals in captivity is acceptable only if it helps to protect them. Otherwise, it's just cruel.", vi: "[Part 3] Tôi cho rằng nuôi nhốt động vật hoang dã chỉ chấp nhận được nếu nó giúp bảo vệ chúng. Còn không thì chỉ là tàn nhẫn." },
        ],
      },
      { t: "rule", formula: "N (nguyên nhân) + pose a threat to / lead to + N  ·  S + play a vital role in + V-ing  ·  S + be on the verge of extinction", vi: "Ba khung dùng được cho hầu hết đề về động vật – môi trường." },
      {
        t: "mcq",
        id: "t3d22-tv-colloc",
        title: "Chọn từ đi kèm đúng (collocation) — 8 câu",
        items: [
          { q: "Plastic waste ___ a serious threat to sea turtles.", options: ["makes", "poses", "does", "gives"], correct: 1, why: "pose a threat to — collocation cố định." },
          { q: "The campaign aims to ___ awareness of illegal hunting.", options: ["rise", "improve", "grow", "raise"], correct: 3, why: "raise awareness (raise + tân ngữ). rise là nội động từ, không có tân ngữ." },
          { q: "Only about 1,000 mountain gorillas are left ___ the wild.", options: ["in", "on", "at", "by"], correct: 0, why: "in the wild ↔ in captivity." },
          { q: "The koala is native ___ Australia.", options: ["of", "in", "to", "for"], correct: 2, why: "be native to + nơi." },
          { q: "The government has imposed a ban ___ the sale of ivory.", options: ["for", "on", "to", "of"], correct: 1, why: "a ban on + N." },
          { q: "By 1900 the bird had been ___ to extinction by hunters.", options: ["driven", "taken", "moved", "pulled"], correct: 0, why: "be driven to extinction." },
          { q: "Insects play a vital ___ in the food chain.", options: ["part of", "work", "position", "role"], correct: 3, why: "play a vital role in. (play a part in cũng đúng nhưng không có “of”.)" },
          { q: "These pandas were bred in ___ and later released.", options: ["wildlife", "habitat", "captivity", "sanctuary"], correct: 2, why: "be bred in captivity = sinh ra trong điều kiện nuôi nhốt." },
        ],
      },
      {
        t: "mcq",
        id: "t3d22-tv-nghia",
        title: "Chọn từ đúng nghĩa — 6 câu",
        items: [
          { q: "The dodo is ___; the last one died more than 300 years ago.", options: ["endangered", "rare", "extinct", "invasive"], correct: 2, why: "Không còn con nào ⇒ extinct. endangered = còn sống nhưng sắp mất." },
          { q: "A lion is a ___; a zebra is its prey.", options: ["predator", "mammal", "poacher", "breed"], correct: 0, why: "Thú săn mồi = predator. poacher là NGƯỜI săn trộm." },
          { q: "We should ___ water during the dry season.", options: ["reserve", "conserve", "preserve", "restore"], correct: 1, why: "conserve water / energy = dùng tiết kiệm. preserve = giữ nguyên trạng; reserve = đặt trước." },
          { q: "The wetland became a nature ___ where hunting is forbidden.", options: ["conserve", "preserve", "habitat", "reserve"], correct: 3, why: "a nature reserve = khu bảo tồn thiên nhiên." },
          { q: "___ is under threat in many countries. (động vật hoang dã nói chung)", options: ["Wildlife", "Wildlifes", "A wildlife", "Wild"], correct: 0, why: "wildlife không đếm được, không a / -s, động từ số ít." },
          { q: "The grey squirrel is an ___ species that has pushed out the native red squirrel.", options: ["endangered", "invasive", "extinct", "migratory"], correct: 1, why: "Loài ngoại lai lấn át loài bản địa = invasive species." },
        ],
      },
      {
        t: "quiz",
        id: "t3d22-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
        grammar: "collocation chủ đề động vật + cấu trúc nhân quả / nhượng bộ Ngày 21",
        items: [
          { q: "Nhiều loài đang bên bờ tuyệt chủng do mất môi trường sống.", answers: ["Many species are on the verge of extinction due to habitat loss.", "Many species are on the verge of extinction because of habitat loss.", "Many species are on the verge of extinction owing to habitat loss.", "Many species are on the brink of extinction due to habitat loss.", "Many species are on the verge of extinction due to the loss of their habitat."], hint: "on the verge of extinction · due to · habitat loss" },
          { q: "Nạn phá rừng gây ra mối đe doạ nghiêm trọng cho động vật hoang dã.", answers: ["Deforestation poses a serious threat to wildlife.", "Deforestation poses a serious threat to wild animals."], hint: "deforestation · pose a serious threat to · wildlife" },
          { q: "Sở thú giúp nâng cao nhận thức về các loài có nguy cơ tuyệt chủng.", answers: ["Zoos help to raise awareness of endangered species.", "Zoos help raise awareness of endangered species.", "Zoos help to raise awareness about endangered species.", "Zoos help raise awareness about endangered species."], hint: "zoos · help to raise awareness of · endangered species" },
          { q: "Động vật nên sống trong môi trường tự nhiên của chúng thay vì bị nuôi nhốt.", answers: ["Animals should live in their natural habitat rather than in captivity.", "Animals should live in their natural habitat instead of in captivity.", "Animals should live in their natural habitats rather than in captivity.", "Animals should live in their natural habitat instead of being kept in captivity.", "Animals should live in their natural habitat rather than being kept in captivity."], hint: "natural habitat · rather than · in captivity" },
          { q: "Ong đóng vai trò thiết yếu trong sản xuất lương thực.", answers: ["Bees play a vital role in food production.", "Bees play a vital role in producing food.", "Bees play a key role in food production."], hint: "bees · play a vital role in · food production" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t3d22-viet",
    kind: "writing",
    title: "Viết Task 2: Two-part question band 6 — đếm đủ vế, dàn ý hai câu hỏi, kho ý tưởng",
    goal: "Viết một bài Two-part question ≥ 250 từ ở mức band 6: đếm đúng số vế phải trả lời (kể cả khi MỘT câu hỏi chứa HAI đối tượng), lập dàn ý 5 phút cho hai câu hỏi cân nhau, tự sinh ý bằng bánh xe tầng – nhóm người – chuỗi hệ quả và từ 2–3 bài báo ngắn, phát triển mỗi ý bằng giải thích + ví dụ — đẩy TR (trả lời đủ MỌI phần của đề) và CC.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Two-part question** (đề hai câu hỏi trực tiếp) = đề không hỏi “agree or disagree” mà đặt thẳng **hai câu hỏi**. Tập 2 Ngày 18 đã dạy khung 4 đoạn: mỗi câu hỏi một thân bài.",
          "Band 5 → band 6 ở dạng này nằm gần như trọn trong tiêu chí **TR**: band 5 = “trả lời đề nhưng chỗ sâu chỗ nông”; band 6 = “trả lời ==đủ mọi phần==”. Hôm nay học cách **đếm vế** để không sót phần nào.",
          "Cái mới: **một câu hỏi chứa hai đối tượng** (“…on people **and** on the environment?”, “…for individuals **and** for society?”) ⇒ mỗi đối tượng phải có ít nhất một ý được phát triển. Sót một đối tượng = sót một phần đề.",
          "**Kho ý tưởng** (W18): ba công cụ sinh ý khi bí — ==bánh xe tầng== (cá nhân → gia đình → doanh nghiệp → môi trường → xã hội), ==nhóm người==, ==chuỗi hệ quả== — và cách tự gom ý từ 2–3 bài báo ngắn.",
          "Nguyên tắc band 6: **ít ý, giải thích kỹ**. Hai ý có giải thích + ví dụ ăn điểm hơn năm ý liệt kê.",
          "Có bài mẫu **band 5 và band 6** cho cùng một đề, bảng so 4 tiêu chí, 6 câu khung và 2 đề tự viết có AI chấm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bài Two-part question: band 5 và band 6 khác nhau ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 5 điển hình", "Band 6 cần có"],
        rows: [
          ["**TR** — trả lời đề", "Câu hỏi 1 viết dài, câu hỏi 2 vài dòng; sót một đối tượng trong câu hỏi; kết bài thêm giải pháp dù đề không hỏi", "Hai câu hỏi đều được trả lời rõ, mỗi câu ≥ 2 ý có phát triển; câu hỏi có hai đối tượng ⇒ đủ cả hai; kết bài trả lời lại đúng hai câu hỏi"],
          ["**CC** — mạch lạc", "Mỗi câu một từ nối (Firstly, Moreover, Furthermore, Besides…); không rõ đoạn nào trả lời câu hỏi nào", "Mỗi thân bài mở bằng câu chủ đề **nhắc lại câu hỏi**; từ nối đa dạng nhưng vừa đủ; có từ quy chiếu (this trend, these changes)"],
          ["**LR** — từ vựng", "Từ chung: bad effects, many reasons, very important; lặp animals / problem", "Từ theo chủ đề + collocation đúng (habitat loss, pose a threat to); paraphrase từ khoá của đề"],
          ["**GRA** — ngữ pháp", "Câu đơn nối bằng and / so; lỗi chia động từ, bị động", "Trộn câu đơn + câu phức (although, which means that, owing to — Ngày 21); lỗi không làm sai nghĩa"],
        ],
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: dạng đề dễ nhất — và dễ mất điểm TR nhất",
        items: [
          "Dễ nhất vì đề đã chia sẵn bố cục cho bạn: hai câu hỏi = hai thân bài.",
          "Dễ mất điểm nhất vì chỉ cần **bỏ sót hoặc trả lời hời hợt một câu hỏi**, TR khó vượt band 5 dù ngôn ngữ tốt.",
          "Vì vậy 2 phút đầu của dạng này dành để ĐẾM, chưa nghĩ ý.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ôn từ Tập 2 Ngày 18 — các cặp câu hỏi và mỗi câu cần gì" },
      {
        t: "table",
        head: ["Cặp câu hỏi", "Câu 1 cần", "Câu 2 cần", "Thì / cấu trúc hay dùng"],
        rows: [
          ["Why is this happening? + Is it a positive or negative development?", "2 nguyên nhân", "lập trường rõ + 2 lý do", "hiện tại đơn / hoàn thành; I believe this is largely…"],
          ["What are the causes? + What are the effects?", "2 nguyên nhân", "2 hệ quả", "due to · lead to · as a result (Ngày 21)"],
          ["Why…? + What can be done?", "2 nguyên nhân", "2 giải pháp **gắn đúng** nguyên nhân (Ngày 18)", "should · could · One way to… is to…"],
          ["Do you agree…? + What other measures…?", "ý kiến + lý do", "2 biện pháp KHÁC biện pháp trong đề", "While I agree that…, …"],
          ["How has X changed? + Is this change good?", "2 thay đổi (so với trước)", "đánh giá + lý do", "used to · hiện tại hoàn thành"],
        ],
      },
      { t: "rule", formula: "Mở bài (paraphrase + trả lời ngắn 2 câu hỏi) → Thân bài 1 = câu hỏi 1 → Thân bài 2 = câu hỏi 2 → Kết bài (trả lời lại cả hai)", vi: "Khung 4 đoạn của Tập 2 Ngày 18 — hôm nay giữ nguyên, nâng phần ruột." },

      /* ── 3 ── */
      { t: "h", text: "3. Đếm vế đề — khi một câu hỏi chứa HAI đối tượng" },
      {
        t: "p",
        text: "“Vế” = mỗi thứ đề bắt bạn phải trả lời. Đề hai câu hỏi tưởng có 2 vế, nhưng nhiều đề thật có **3 hoặc 4**: một câu hỏi nối hai đối tượng bằng **and** (people **and** the environment · individuals **and** society · children **and** parents), hoặc một câu hỏi thật ra là hai (“What are the causes **and** who is responsible?”). Giám khảo chấm TR bằng cách đếm đúng các vế này.",
      },
      {
        t: "table",
        head: ["Đề (rút gọn)", "Số vế", "Phải có"],
        rows: [
          ["Why do people move to cities? What problems does this cause?", "2", "nguyên nhân · vấn đề"],
          ["Why is this happening? What effects does it have **on people and on the natural environment**?", "3", "nguyên nhân · hệ quả với người · hệ quả với môi trường"],
          ["What are the advantages of this **for individuals and for society**? Are there any disadvantages?", "3", "lợi cho cá nhân · lợi cho xã hội · bất lợi"],
          ["How does this affect **children and their parents**? What can **schools and governments** do?", "4", "ảnh hưởng tới trẻ · tới cha mẹ · việc của trường · việc của chính phủ"],
          ["Why do some people do this, **and** is it a good thing?", "2 (trong MỘT câu)", "lý do · đánh giá"],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Đếm vế trong 60 giây",
        steps: [
          { label: "1. Gạch dưới mỗi dấu “?”", sub: "Bao nhiêu câu hỏi?" },
          { label: "2. Khoanh mọi chữ AND / OR trong câu hỏi", sub: "Nó nối hai ĐỐI TƯỢNG hay chỉ là một cụm cố định (pros and cons)?" },
          { label: "3. Đánh số từng vế: ①②③", sub: "Viết số ngay trên đề" },
          { label: "4. Chép số vế vào dàn ý", sub: "Mỗi vế ≥ 1 ý có giải thích" },
          { label: "5. Viết xong: dò lại ①②③ trong bài", sub: "Mỗi số phải chỉ được vào một chỗ cụ thể" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận khi chia chỗ cho ba vế",
        items: [
          "Ba vế KHÔNG có nghĩa là ba thân bài. Vẫn hai thân bài: thân bài 1 = câu hỏi 1; thân bài 2 = câu hỏi 2, **chia đôi** cho hai đối tượng (mỗi đối tượng 2–3 câu).",
          "Đừng gộp hai đối tượng vào một câu chung chung kiểu “This is bad for both people and the environment” rồi thôi — mỗi đối tượng cần ý RIÊNG.",
          "Nếu bí ý cho một đối tượng, dùng công cụ ở mục 5 — đừng bỏ.",
          "Đề nói “people” ⇒ nói về **con người** (việc làm, thức ăn, sức khoẻ), không lặp lại ý về động vật.",
        ],
      },
      {
        t: "mcq",
        id: "t3d22-viet-dem-ve",
        title: "Đề này có mấy vế phải trả lời? (5 câu)",
        items: [
          { q: "More and more young people are choosing to live alone. Why is this the case? Is this a positive or negative trend?", options: ["1 vế", "2 vế", "3 vế", "4 vế"], correct: 1, why: "Hai câu hỏi, không câu nào chứa hai đối tượng ⇒ 2 vế: nguyên nhân · đánh giá." },
          { q: "Many people now work from home. What are the benefits of this for employees and for employers? Are there any drawbacks?", options: ["2 vế", "4 vế", "3 vế", "1 vế"], correct: 2, why: "Câu hỏi 1 có hai đối tượng (employees · employers) + câu hỏi 2 (drawbacks) ⇒ 3 vế." },
          { q: "Children today spend little time outdoors. How does this affect their health and their social skills? What can parents and schools do about it?", options: ["4 vế", "2 vế", "3 vế", "5 vế"], correct: 0, why: "health · social skills · parents · schools ⇒ 4 vế. Mỗi thân bài chia đôi." },
          { q: "Some people think advertising has both pros and cons. What are the main advantages and disadvantages of advertising for consumers?", options: ["3 vế", "4 vế", "1 vế", "2 vế"], correct: 3, why: "“pros and cons” trong câu dẫn là cụm cố định; câu hỏi yêu cầu advantages · disadvantages cho MỘT đối tượng (consumers) ⇒ 2 vế." },
          { q: "Với đề 3 vế (nguyên nhân · hệ quả với người · hệ quả với môi trường), bố cục nào hợp lý nhất?", options: ["Ba thân bài, mỗi vế một đoạn ngắn 40 từ", "Hai thân bài: (1) nguyên nhân; (2) hệ quả — nửa đầu về người, nửa sau về môi trường", "Hai thân bài: (1) nguyên nhân + hệ quả với người; (2) kết luận", "Một thân bài dài gộp tất cả"], correct: 1, why: "Giữ hai thân bài cân nhau theo hai câu hỏi; thân bài 2 chia đôi cho hai đối tượng. Ba đoạn 40 từ thì không ý nào được phát triển." },
        ],
      },
      { t: "rule", formula: "Số vế = số câu hỏi + số đối tượng thêm sau AND", vi: "Đếm trước, nghĩ ý sau. Mỗi vế ≥ 1 ý có giải thích." },

      /* ── 4 ── */
      { t: "h", text: "4. Dàn ý hai câu hỏi trong 5 phút" },
      {
        t: "p",
        text: "Ôn Tập 2 Ngày 6 · 18: dàn ý chỉ ghi **từ khoá**, không viết câu. Với Two-part, kẻ nhanh một bảng hai cột — mỗi cột một câu hỏi — để nhìn bằng mắt là thấy cân hay lệch. Mỗi ý ghi theo công thức ==Ý → vì sao / thế nào → ví dụ==.",
      },
      {
        t: "table",
        head: ["", "Câu hỏi 1 (Thân bài 1)", "Câu hỏi 2 (Thân bài 2)"],
        rows: [
          ["Câu chủ đề", "nhắc lại câu hỏi 1 bằng lời mình", "nhắc lại câu hỏi 2 bằng lời mình"],
          ["Ý 1", "ý → giải thích → ví dụ", "đối tượng A: ý → giải thích → ví dụ"],
          ["Ý 2", "ý → giải thích (→ ví dụ)", "đối tượng B: ý → giải thích → ví dụ"],
          ["Độ dài", "≈ 90–100 từ", "≈ 90–100 từ"],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "40 phút cho bài Two-part",
        steps: [
          { label: "2 phút — đếm vế", sub: "①②③ ngay trên đề" },
          { label: "3 phút — dàn ý hai cột", sub: "mỗi vế 1–2 ý, kèm ví dụ" },
          { label: "5 phút — mở bài", sub: "paraphrase + trả lời ngắn cả hai câu hỏi" },
          { label: "22 phút — hai thân bài", sub: "11 phút mỗi đoạn; hết 11 phút thì chuyển" },
          { label: "4 phút — kết bài", sub: "trả lời lại hai câu hỏi, không ý mới" },
          { label: "4 phút — soát", sub: "dò ①②③ · chia động từ · mạo từ · số nhiều" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Kho ý tưởng — ba công cụ sinh ý khi bí" },
      {
        t: "p",
        text: "Người kẹt band 5 thường nói “em không có ý”. Thật ra đề IELTS không đòi ý độc đáo — đòi ý **liên quan và được giải thích**. Ba công cụ dưới đây biến một câu hỏi trống rỗng thành 5–6 ý trong một phút. Tập 2 Ngày 6 đã giới thiệu bánh xe tầng; hôm nay dùng trọn cả ba công cụ trên đề thật.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Công cụ 1 — Bánh xe tầng: hỏi “điều này chạm tới ai?” từ gần ra xa",
        center: "Động vật biến mất — ảnh hưởng tới ai?",
        branches: [
          { label: "Cá nhân", items: ["mất thú vui ngắm thiên nhiên", "thực phẩm đắt hơn"] },
          { label: "Gia đình", items: ["gia đình ngư dân mất thu nhập", "con cháu không còn thấy loài đó"] },
          { label: "Doanh nghiệp", items: ["nông trại phải thuê ong thụ phấn", "du lịch sinh thái mất khách"] },
          { label: "Môi trường", items: ["chuỗi thức ăn đứt", "sâu hại tăng khi chim giảm"] },
          { label: "Xã hội / nhà nước", items: ["tốn ngân sách khắc phục", "mất di sản thiên nhiên quốc gia"] },
        ],
        caption: "Đi một vòng 5 tầng, chọn 2–3 ý mình giải thích được dễ nhất — không dùng hết.",
      },
      {
        t: "table",
        head: ["Công cụ", "Câu tự hỏi", "Ví dụ với đề động vật biến mất"],
        rows: [
          ["**1. Bánh xe tầng**", "Chạm tới ai: cá nhân → gia đình → doanh nghiệp → môi trường → xã hội?", "doanh nghiệp: nông dân trồng táo phải thuê tổ ong ⇒ chi phí tăng"],
          ["**2. Nhóm người**", "Trẻ em · người đi làm · người già · nông dân · người thành phố · chính phủ — mỗi nhóm bị ảnh hưởng / có lý do gì khác nhau?", "nông dân phá rừng vì cần đất; người thành phố mua đồ gỗ, dầu cọ ⇒ hai nguyên nhân từ hai nhóm"],
          ["**3. Chuỗi hệ quả**", "Rồi sao nữa? (hỏi 2–3 lần)", "thú săn mồi biến mất → hươu tăng → cây non bị ăn hết → đất xói mòn"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: ý đơn giản giải thích kỹ ăn điểm hơn ý “hay”",
        items: [
          "Ý “hay” nhưng chỉ một câu: “Biodiversity is important for the ecosystem.” ⇒ giám khảo không biết bạn hiểu gì.",
          "Ý đơn giản + chuỗi hệ quả: “When fish stocks collapse, fishermen lose their jobs and local prices rise.” ⇒ rõ, cụ thể, đủ band 6.",
          "Mỗi ý tự hỏi thêm **Why? / So what? / For example?** — trả lời được hai trong ba là đủ một ý phát triển.",
          "Ví dụ không cần số liệu thật thuộc lòng. Nói chung chung nhưng cụ thể về tình huống: “In many coastal towns, for example, …”. Đừng bịa con số hay tên nghiên cứu.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Tự tìm ý từ 2–3 bài báo ngắn — xây kho ý của riêng mình" },
      {
        t: "p",
        text: "Ý tưởng cho Task 2 đến từ **đọc**, không đến từ nghĩ lúc thi. Mỗi tuần chọn một trong 20 chủ đề Task 2, đọc 2–3 mẩu tin ngắn (tiếng Anh, 100–200 từ mỗi mẩu — mục tin khoa học, môi trường, giáo dục của các báo lớn là đủ) và làm 4 bước dưới đây. 15 phút mỗi chủ đề; sau 20 tuần bạn có kho ý cho cả 20 chủ đề.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "4 bước rút ý từ một mẩu tin",
        steps: [
          { label: "1. Đọc tít + đoạn đầu", sub: "Chuyện gì xảy ra, ở đâu?" },
          { label: "2. Ghi 1 SỰ VIỆC + 1 HỆ QUẢ bằng từ khoá của mình", sub: "bees ↓ → farmers rent hives → costs ↑ (không chép câu)" },
          { label: "3. Xếp vào ô", sub: "Nguyên nhân / Hệ quả / Giải pháp · Ủng hộ / Phản đối" },
          { label: "4. Viết MỘT câu của mình + chép 1–2 collocation", sub: "Đưa vào sổ theo chủ đề" },
        ],
        caption: "Ghi ý bằng từ khoá rồi tự viết lại — học KHUNG và Ý, không học thuộc câu của bài báo.",
      },
      {
        t: "passage",
        title: "Ba mẩu tin ngắn (tự soạn để luyện — tên địa phương là hư cấu)",
        paras: [
          { label: "1", text: "Bee numbers in the Harlow valley have fallen by a third in ten years, and wild bees have almost disappeared. Apple growers in the area say they now have to rent hives every spring so that their trees are pollinated, which adds thousands to their costs. Several small farms have stopped growing fruit altogether." },
          { label: "2", text: "When the marsh outside Denby was drained to build a housing estate, wading birds and frogs lost their habitat. What nobody expected was that the town itself would suffer: it has been flooded twice in three winters. Engineers explain that the marsh used to absorb heavy rain like a sponge." },
          { label: "3", text: "Whale-watching boats in Seal Bay carried 40,000 visitors last year. The business now employs more local people than the fishing fleet, and hotel owners say their season has become two months longer. Residents who once wanted the bay opened to oil exploration have changed their minds." },
        ],
      },
      {
        t: "mcq",
        id: "t3d22-viet-rut-y",
        title: "Rút ý từ ba mẩu tin (4 câu)",
        items: [
          { q: "Mẩu tin 1 cho bạn ý nào cho vế “effects on people”?", options: ["Ong là côn trùng có ích", "Khi côn trùng thụ phấn giảm, nông dân tốn thêm chi phí và có người bỏ nghề trồng trái cây", "Táo là trái cây phổ biến", "Chính phủ nên cấm thuốc trừ sâu"], correct: 1, why: "Sự việc (bees ↓) + hệ quả với NGƯỜI (rent hives → costs ↑ → farms stop). D là giải pháp — đề không hỏi và mẩu tin không nói." },
          { q: "Mẩu tin 2 minh hoạ tốt nhất cho công cụ sinh ý nào?", options: ["Nhóm người", "Bánh xe tầng", "Chuỗi hệ quả: phá nơi sống → mất chức năng tự nhiên → con người chịu lũ", "Không công cụ nào"], correct: 2, why: "drained → habitat lost → marsh no longer absorbs rain → town flooded: hỏi “rồi sao nữa?” ba lần." },
          { q: "Câu nào là cách ghi chú ĐÚNG cho mẩu tin 3?", options: ["whale-watching: 40,000 visitors → more jobs than fishing → locals now want protection", "Chép nguyên câu đầu vào sổ", "Whales are very big animals", "Học thuộc con số 40,000 để đưa vào bài thi"], correct: 0, why: "Từ khoá + mũi tên hệ quả. Không chép câu; không dùng con số của một nơi hư cấu vào bài thi." },
          { q: "Từ ba mẩu tin, ý nào dùng được để TRẢ LỜI “Why should we protect wildlife?”", options: ["Vì động vật dễ thương", "Vì luật quy định", "Vì các nước khác đều làm", "Vì thiên nhiên còn nguyên vẹn bảo vệ con người (lũ), nuôi sống nông nghiệp (ong) và tạo việc làm (du lịch)"], correct: 3, why: "Gộp ba mẩu thành ba lý do có ví dụ — đó chính là kho ý tưởng." },
        ],
      },
      {
        t: "table",
        head: ["Kho ý tưởng: Animals & nature", "Ý (từ khoá)", "Ví dụ / giải thích", "Collocation"],
        rows: [
          ["Nguyên nhân 1", "habitat loss", "rừng bị phá lấy đất trồng trọt, xây nhà", "clear forests for farmland · natural habitat"],
          ["Nguyên nhân 2", "over-exploitation", "săn trộm lấy ngà, sừng; đánh cá quá mức", "poaching · overfishing · the illegal wildlife trade"],
          ["Nguyên nhân 3", "pollution & pesticides", "thuốc trừ sâu giết ong; nhựa trong biển", "enter the food chain"],
          ["Nguyên nhân 4", "invasive species", "loài ngoại lai lấn át loài bản địa", "native species · push out"],
          ["Hệ quả với người 1", "food & income", "ngư dân mất việc; nông dân tốn tiền thụ phấn", "play a vital role in · depend on"],
          ["Hệ quả với người 2", "protection & tourism", "mất rừng ngập nước ⇒ lũ; mất khách du lịch sinh thái", "ecotourism · create jobs"],
          ["Hệ quả với môi trường", "food chain breaks", "mất thú săn mồi ⇒ con mồi tăng ⇒ cây bị phá", "upset the balance of nature · loss of biodiversity"],
          ["Giải pháp (khi đề hỏi)", "protect + enforce + educate", "khu bảo tồn; phạt nặng; giáo dục", "nature reserves · impose a ban on · raise awareness of"],
        ],
        caption: "Đây là mẫu MỘT trang kho ý tưởng. Tự làm trang tương tự cho các chủ đề còn lại; trang mẫu này nằm ở mục Tra công thức.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phân tích đề và dàn ý 5 phút" },
      {
        t: "p",
        text: "**Đề:** Many species of animals around the world are disappearing. **Why is this happening? What effects does this have on people and on the natural environment?** Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      },
      {
        t: "table",
        head: ["Bước", "Kết quả"],
        rows: [
          ["Chủ đề", "species disappearing (= tuyệt chủng / suy giảm)"],
          ["Số dấu ?", "2"],
          ["Chữ AND", "on people **and** on the natural environment ⇒ hai đối tượng"],
          ["Số vế", "**3**: ① vì sao · ② hệ quả với người · ③ hệ quả với môi trường"],
          ["Đề KHÔNG hỏi", "giải pháp · ý kiến đồng ý / phản đối ⇒ không viết"],
          ["Paraphrase từ khoá", "disappearing → in decline / dying out / becoming extinct · effects → consequences / impact · people → communities / humans"],
        ],
      },
      {
        t: "note",
        title: "Dàn ý 5 phút — chỉ ghi từ khoá (chép khung này ra nháp)",
        items: [
          "**Intro:** species ↓ worldwide — main cause = human activity; consequences serious for people + environment.",
          "**Body 1 ① Why:** (a) habitat loss — forests cleared → nowhere to feed / breed — e.g. palm oil, orangutans. (b) over-exploitation — poaching, overfishing — illegal but profits high, weak laws.",
          "**Body 2 ②③ Effects:** people — depend on wildlife for food / income — fish stocks collapse → jobs lost, prices ↑; bees → fruit. Environment — food chain — predator gone → prey multiply → plants destroyed.",
          "**Conclusion:** humans destroy habitats + take too much → harms livelihoods + ecosystems. (no solutions)",
          "Kiểm: ① ở Body 1 · ② nửa đầu Body 2 · ③ nửa sau Body 2. Đủ.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bài mẫu band 5 (ước tính) — đọc và tìm xem hỏng ở đâu" },
      {
        t: "p",
        text: "Bài dưới đây (188 từ) được viết **cố ý** theo kiểu band 5 điển hình. Lỗi ngữ pháp được giữ nguyên. Trước khi đọc bảng ở mục 9, tự làm một việc: dò ①②③ trong bài — vế nào bị thiếu?",
      },
      {
        t: "examples",
        items: [
          { en: "[Introduction] Nowadays, animals is a hot topic in all over the world. Many animals are disappear. There are many reasons and effects of this problem. In this essay, I will discuss about it.", vi: "[Mở bài] Câu mở sáo (hot topic); are disappear (sai dạng động từ); “many reasons and effects” không trả lời gì; discuss about (thừa about)." },
          { en: "[Body 1] Firstly, there are many reasons why animals are disappear. The first reason is people cut the trees. When people cut the trees, animals don't have house to live. Moreover, people hunt animals to get money, for example elephants and tigers and rhinos. Furthermore, pollution is also a reason, because factories make the air and water dirty and animals die. Besides, climate change make the weather hotter, so animals cannot live. In addition, some people keep wild animals like pets. So there are a lot of reasons for this problem.", vi: "[Thân bài 1 — 89 từ] NĂM nguyên nhân, mỗi cái một câu, không cái nào được giải thích; mỗi câu một từ nối (Firstly, Moreover, Furthermore, Besides, In addition); câu cuối không thêm thông tin." },
          { en: "[Body 2] Secondly, this problem has bad effects. The environment will be affected. If animals are extincted, the nature will not beautiful anymore. It is very bad for the environment.", vi: "[Thân bài 2 — 28 từ] Chỉ nói về môi trường, và nói rất chung (“not beautiful”). Vế ② — hệ quả với CON NGƯỜI — không có chữ nào. are extincted, the nature, will not beautiful: ba lỗi trong một câu." },
          { en: "[Conclusion] In conclusion, animals are disappear because of many reasons and it has many bad effects. Government should make strict laws and people should protect animals, because animals are our friends. If everyone protect animals, the world will be better.", vi: "[Kết bài] Đề không hỏi giải pháp nhưng kết bài dành hai câu cho giải pháp (ý mới, lạc đề); “animals are our friends” không phải lập luận học thuật." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Bài mẫu band 6 (ước tính) — cùng đề, cùng những ý cơ bản" },
      {
        t: "p",
        text: "Bài này (276 từ) dùng **hai** trong năm nguyên nhân của bài band 5 (phá rừng, săn bắt) nhưng giải thích từng cái, và trả lời đủ ba vế. Từ vựng lấy từ bài 1; cấu trúc nhân quả – nhượng bộ lấy từ Ngày 21. Số ①②③ được chèn để bạn dò — khi viết thật thì không ghi.",
      },
      {
        t: "examples",
        items: [
          { en: "[Introduction] Across the world, a growing number of animal species are in decline or have already died out. This essay will argue that human activity is the main cause, and that the consequences are serious both for people and for the natural environment.", vi: "[Mở bài — 2 câu] Câu 1 paraphrase đề (disappearing → in decline / died out). Câu 2 trả lời ngắn CẢ HAI câu hỏi và nhắc đủ hai đối tượng." },
          { en: "[Body 1 — ①] The principal reason why so many species are disappearing is the loss of their natural habitat. As the human population grows, forests are cleared for farmland and housing, which means that animals have nowhere to feed or breed. In Southeast Asia, for example, large areas of rainforest have been replaced by palm oil plantations, and orangutans have lost most of their territory as a result. A second cause is over-exploitation. Although hunting rare animals is illegal in most countries, poaching and overfishing continue because the profits are high and the laws are weakly enforced.", vi: "[Thân bài 1] Câu chủ đề nhắc lại câu hỏi 1. Nguyên nhân 1: ý → giải thích (which means that) → ví dụ (for example… as a result). Nguyên nhân 2: ý → giải thích bằng câu nhượng bộ (Although…) + because. Hai ý, không phải năm." },
          { en: "[Body 2 — ②③] This trend affects people directly. Many communities depend on wildlife for food and income: when fish stocks collapse owing to overfishing, fishermen lose their jobs and local prices rise. Farmers are also affected, since insects such as bees play a vital role in producing fruit and vegetables. The effects on the environment are equally serious. Every species is part of a food chain, so the loss of one can upset the balance of nature. If a predator disappears, for instance, the animals that it used to hunt may multiply and destroy the plants that other species need.", vi: "[Thân bài 2] Nửa đầu = ② con người (ngư dân, nông dân — sinh từ “bánh xe tầng”). Câu chuyển “The effects on the environment are equally serious” báo sang ③. Nửa sau = chuỗi hệ quả (predator → prey → plants)." },
          { en: "[Conclusion] In conclusion, species are vanishing mainly because humans destroy habitats and hunt or fish too much. This damages people's livelihoods as well as the ecosystems on which all life depends, so protecting wildlife should be treated as a necessity rather than a luxury.", vi: "[Kết bài — 2 câu] Trả lời lại câu hỏi 1 (because…) và câu hỏi 2 (livelihoods + ecosystems). Không giải pháp chi tiết; câu cuối chỉ là nhận định khép bài." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6", "Bài học"],
        rows: [
          ["**TR**", "Thiếu hẳn vế ② (con người); vế ③ chỉ “not beautiful”; kết bài lạc sang giải pháp; 188 từ — dưới 250", "Đủ ①②③, mỗi vế có giải thích + ví dụ; kết bài trả lời lại hai câu hỏi; 276 từ", "Đếm vế trước khi viết; dò lại sau khi viết"],
          ["**CC**", "Thân bài 89 từ / 28 từ — lệch; 7 từ nối đầu câu; không có câu chuyển", "Hai thân bài ~95 từ; câu chủ đề nhắc câu hỏi; this trend, equally serious làm cầu nối", "Câu chủ đề = câu hỏi nói lại. Từ quy chiếu thay từ nối"],
          ["**LR**", "many reasons, bad effects, cut the trees, house to live; lặp animals 9 lần", "natural habitat, over-exploitation, fish stocks collapse, livelihoods, upset the balance of nature", "Dùng collocation của bài Từ vựng; paraphrase từ khoá đề"],
          ["**GRA**", "are disappear, are extincted, the nature, climate change make; gần như chỉ câu đơn", "which means that · Although… · owing to · since · If… may…; lỗi không đáng kể", "Mỗi đoạn 2–3 cấu trúc Ngày 21 là đủ “trộn câu đơn + phức”"],
        ],
        caption: "Band ghi ở đây là ước tính theo mô tả band công khai, để so sánh hai bài với nhau.",
      },
      {
        t: "note",
        title: "💡 Mẹo: bài band 6 không có ý nào “cao siêu”",
        items: [
          "Phá rừng, săn trộm, ngư dân mất việc, ong thụ phấn — học sinh lớp 8 cũng biết. Khác biệt là mỗi ý được **nói cho hết**.",
          "Bài band 5 có NHIỀU ý hơn (5 nguyên nhân) nhưng điểm TR thấp hơn — vì đề hỏi ba thứ và bài chỉ trả lời một thứ rưỡi.",
          "Khi bạn thấy mình sắp viết Moreover lần thứ hai trong một đoạn: dừng lại, giải thích ý vừa nêu thay vì thêm ý mới.",
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Sáu câu khung cho Two-part question" },
      {
        t: "patterns",
        rows: [
          {
            formula: "This essay will argue that + (trả lời 1), and that + (trả lời 2).",
            vi: "Câu luận điểm: trả lời ngắn cả hai câu hỏi trong một câu",
            examples: [{ en: "This essay will argue that human activity is the main cause, and that the consequences are serious both for people and for the natural environment.", vi: "Bài này sẽ lập luận rằng hoạt động của con người là nguyên nhân chính, và rằng hệ quả nghiêm trọng với cả con người lẫn môi trường tự nhiên." }],
          },
          {
            formula: "The principal reason why + S + V + is + N / that + S + V.",
            vi: "Câu chủ đề thân bài 1 — nhắc lại câu hỏi Why",
            examples: [{ en: "The principal reason why fewer people read newspapers is that news is now free online.", vi: "Lý do chính khiến ít người đọc báo giấy hơn là tin tức giờ miễn phí trên mạng." }],
          },
          {
            formula: "A second cause / factor is + N.  Although + S + V, S + V.",
            vi: "Nguyên nhân thứ hai + giải thích bằng câu nhượng bộ",
            examples: [{ en: "A second factor is cost. Although trains are faster, many families still find driving cheaper.", vi: "Yếu tố thứ hai là chi phí. Dù tàu nhanh hơn, nhiều gia đình vẫn thấy lái xe rẻ hơn." }],
          },
          {
            formula: "This trend affects + đối tượng A + directly.  …  The effects on + đối tượng B + are equally serious.",
            vi: "Chia thân bài 2 cho hai đối tượng — câu thứ hai là câu chuyển",
            examples: [{ en: "This trend affects children directly. … The effects on their parents are equally serious.", vi: "Xu hướng này ảnh hưởng trực tiếp tới trẻ em. … Ảnh hưởng tới cha mẹ các em cũng nghiêm trọng không kém." }],
          },
          {
            formula: "When + S + V, S + V and S + V.  /  If + S + V, S + may + V.",
            vi: "Chuỗi hệ quả trong một câu",
            examples: [{ en: "When rents rise, young families move out and local schools lose pupils.", vi: "Khi tiền thuê nhà tăng, các gia đình trẻ chuyển đi và trường học địa phương mất học sinh." }],
          },
          {
            formula: "In conclusion, + S + V + mainly because + S + V.  This + V + A as well as B.",
            vi: "Kết bài: câu 1 trả lời lại câu hỏi 1, câu 2 trả lời lại câu hỏi 2",
            examples: [{ en: "In conclusion, people are moving to cities mainly because jobs are concentrated there. This puts pressure on housing as well as on public transport.", vi: "Tóm lại, người ta chuyển về thành phố chủ yếu vì việc làm tập trung ở đó. Điều này gây áp lực lên nhà ở cũng như giao thông công cộng." }],
          },
        ],
      },
      { t: "rule", formula: "This essay will argue that + S + V, and that + S + V  ·  This trend affects + A + directly … The effects on + B + are equally serious", vi: "Một câu luận điểm trả lời hai câu hỏi; một câu chuyển tách hai đối tượng." },
      {
        t: "quiz",
        id: "t3d22-viet-dich",
        kind: "translate",
        title: "Dịch câu khung Two-part question (5 câu)",
        grammar: "The principal reason why… is… · This trend affects… · The effects on… are equally serious",
        items: [
          { q: "Lý do chính khiến nhiều người trẻ rời nông thôn là thiếu việc làm.", answers: ["The principal reason why many young people leave the countryside is the lack of jobs.", "The principal reason why many young people leave the countryside is a lack of jobs.", "The main reason why many young people leave the countryside is the lack of jobs.", "The principal reason why many young people leave rural areas is the lack of jobs.", "The main reason why many young people leave rural areas is a lack of jobs.", "The principal reason why many young people leave the countryside is that there are not enough jobs."], hint: "The principal reason why · leave the countryside · the lack of jobs" },
          { q: "Xu hướng này ảnh hưởng trực tiếp tới người cao tuổi.", answers: ["This trend affects older people directly.", "This trend affects elderly people directly.", "This trend affects the elderly directly.", "This trend directly affects older people.", "This trend directly affects the elderly."], hint: "This trend · affect (không on) · older people · directly" },
          { q: "Những ảnh hưởng tới môi trường cũng nghiêm trọng không kém.", answers: ["The effects on the environment are equally serious.", "The effects on the environment are just as serious.", "The impact on the environment is equally serious."], hint: "The effects on · the environment · equally serious" },
          { q: "Khi trữ lượng cá sụp đổ, ngư dân mất việc và giá cả tăng.", answers: ["When fish stocks collapse, fishermen lose their jobs and prices rise.", "When fish stocks collapse, fishermen lose their jobs and prices go up.", "When fish stocks collapse, fishermen lose their jobs and prices increase."], hint: "fish stocks · collapse · lose their jobs · prices rise" },
          { q: "Bài này sẽ lập luận rằng công nghệ là nguyên nhân chính, và rằng sự thay đổi này phần lớn là tích cực.", answers: ["This essay will argue that technology is the main cause, and that this change is largely positive.", "This essay will argue that technology is the main cause and that this change is largely positive.", "This essay will argue that technology is the main cause, and that the change is largely positive.", "This essay will argue that technology is the main cause, and that this change is mostly positive."], hint: "This essay will argue that …, and that … · largely positive" },
        ],
      },

      /* ── 11 ── */
      { t: "h", text: "11. Luyện tái tạo bài mẫu — học KHUNG, không học thuộc" },
      {
        t: "p",
        text: "Kỹ thuật này đã dùng ở Tập 2 Ngày 6 · 10 và Tập 3 Ngày 2: đọc bài mẫu → ghi từ khoá → gấp bài lại → **viết lại bằng lời mình** → so. Mục tiêu KHÔNG phải nhớ câu, mà là để tay quen khung “ý → giải thích → ví dụ” và các cụm nối.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Tái tạo bài mẫu band 6 ở mục 9 — 25 phút",
        steps: [
          { label: "1. Đọc bài mẫu hai lần (4 phút)", sub: "Lần 2: gạch chân cụm nối và collocation" },
          { label: "2. Ghi từ khoá từng đoạn (3 phút)", sub: "≤ 12 từ mỗi đoạn, như dàn ý mục 7" },
          { label: "3. Che bài mẫu — viết lại từ dàn ý (15 phút)", sub: "Được dùng câu khác, ví dụ khác" },
          { label: "4. So hai bản (3 phút)", sub: "Chỉ so: đủ ①②③ chưa? cụm nối nào mình bỏ sót? collocation nào viết sai?" },
        ],
        caption: "Chép các cụm bỏ sót vào Sổ lỗi. Một tuần sau làm lại với cùng dàn ý.",
      },
      {
        t: "quiz",
        id: "t3d22-viet-tai-tao",
        kind: "fill",
        title: "Điền lại cụm nối / collocation của bài mẫu band 6 (8 chỗ, mỗi chỗ 1–3 từ)",
        items: [
          { q: "1. a growing number of animal species are in ___ or have already died out. (1 từ)", answers: ["decline"] },
          { q: "2. forests are cleared for farmland and housing, ___ ___ that animals have nowhere to feed or breed. (2 từ)", answers: ["which means"] },
          { q: "3. orangutans have lost most of their territory ___ ___ ___. (3 từ)", answers: ["as a result"] },
          { q: "4. ___ hunting rare animals is illegal in most countries, poaching and overfishing continue. (1 từ)", answers: ["although"] },
          { q: "5. when fish stocks collapse ___ ___ overfishing, fishermen lose their jobs. (2 từ)", answers: ["owing to", "due to"] },
          { q: "6. insects such as bees play a vital ___ in producing fruit and vegetables. (1 từ)", answers: ["role"] },
          { q: "7. The effects on the environment are ___ serious. (1 từ)", answers: ["equally"] },
          { q: "8. the loss of one can upset the ___ of nature. (1 từ)", answers: ["balance"] },
        ],
      },

      /* ── 12 ── */
      { t: "h", text: "12. Sáu lỗi làm bài Two-part kẹt ở band 5 — bảng tự soát" },
      {
        t: "note",
        title: "⚠️ Cẩn thận — soát 6 điểm này trong 4 phút cuối",
        items: [
          "**Sót vế.** Dò ①②③ — mỗi số chỉ vào được một chỗ cụ thể trong bài chưa?",
          "**Lệch.** Thân bài 1 dài gấp đôi thân bài 2? Cắt một ý ở đoạn dài, thêm ví dụ cho đoạn ngắn.",
          "**Trả lời câu hỏi không được hỏi.** Đề không hỏi giải pháp / ý kiến thì không viết. Đề hỏi “positive or negative?” thì PHẢI có lập trường.",
          "**Liệt kê.** Đoạn nào có từ 3 ý trở lên mà mỗi ý một câu ⇒ bỏ bớt, giải thích 2 ý còn lại.",
          "**Mở bài không trả lời.** “This essay will discuss the reasons and effects” chưa trả lời gì. Nêu luôn câu trả lời ngắn.",
          "**Kết bài có ý mới** hoặc chỉ chép lại mở bài. Kết bài = trả lời lại hai câu hỏi bằng từ khác.",
        ],
      },

      /* ── 13 ── */
      { t: "h", text: "13. Viết bài — AI chấm 4 tiêu chí (40 phút mỗi đề)" },
      {
        t: "essay",
        id: "t3d22-viet-bai",
        task: "Task 2",
        prompt: "In many cities, people — especially children — now have very little contact with nature. Why is this the case? What effects does this have on children and on society as a whole? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đếm vế: ① vì sao · ② ảnh hưởng tới trẻ em · ③ ảnh hưởng tới xã hội. Ghi ①②③ lên nháp.",
          "Dàn ý hai cột trong 3 phút; mỗi vế 1–2 ý, có ví dụ.",
          "Mở bài: This essay will argue that …, and that …",
          "Thân bài 2 dùng câu chuyển: The effects on society as a whole are equally serious.",
          "Mỗi thân bài 2–3 cấu trúc Ngày 21: although · owing to · which means that · as a result.",
          "Đề không hỏi giải pháp — kết bài không đề xuất giải pháp chi tiết.",
        ],
      },
      {
        t: "essay",
        id: "t3d22-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm) In some countries, more and more people are choosing to keep exotic wild animals, such as snakes, monkeys and parrots, as pets. Why do people do this? Is it a positive or negative development for the animals and for their owners? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đếm vế: ① vì sao · ② tốt / xấu cho con vật · ③ tốt / xấu cho người nuôi — và phải có LẬP TRƯỜNG rõ (positive or negative).",
          "Dùng từ bài 1: in captivity · natural habitat · the illegal wildlife trade · welfare · cruel · invasive species.",
          "Được phép có lập trường khác nhau cho hai đối tượng (xấu cho con vật, lợi nhỏ cho chủ) — miễn nói rõ.",
          "Viết xong dò lại ①②③ và 6 lỗi ở mục 12.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t3d22-noi",
    kind: "speaking",
    title: "Nói Part 2: Describe an event vòng 2 — kể quá khứ hoàn chỉnh + “a time when” vòng 2",
    goal: "Kể liền mạch 2 phút một sự kiện hoặc một tình huống “a time when…” ở mức band 6: dùng đủ bốn thì kể chuyện (quá khứ đơn làm xương sống, quá khứ tiếp diễn làm nền, quá khứ hoàn thành cho chuyện xảy ra trước, was going to cho dự định), đi đủ 5 chặng có cảm xúc đổi theo chặng, một câu thoại và một bài học, biết đổi ý giữa chừng mà không vỡ mạch, đọc đúng đuôi -ed và nối âm — đẩy FC + GRA + P.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 2 Ngày 15 dạy kể **sự kiện** bằng dàn 4 phần và gần như chỉ dùng quá khứ đơn; Ngày 23 nhập môn đề **tình huống** “Describe a time when…”. Hôm nay là vòng 2 của cả hai, ở mức band 6.",
          "Band 5 kể chuyện bằng chuỗi “and then… and then…” toàn quá khứ đơn. Band 6 kể bằng **bốn thì**: ==quá khứ đơn== (việc chính) · ==quá khứ tiếp diễn== (cảnh nền) · ==quá khứ hoàn thành== (chuyện trước đó) · ==was going to== (dự định bị đổi).",
          "Đề “a time when” đi theo **5 chặng**: bối cảnh → sự cố → hành động → kết quả → bài học. Mỗi chặng một cảm xúc; có **một câu thoại**; kết bằng điều mình rút ra.",
          "**Chiến thuật đổi ý**: lỡ chọn chuyện khó kể, nói sai, hay hết ý ở giây 70 — có sẵn cụm để rẽ hướng mà không im lặng.",
          "Phát âm: ba cách đọc **-ed** (/t/ · /d/ · /ɪd/) và **nối âm** -ed sang nguyên âm (picked‿up, looked‿around) — kể chuyện quá khứ mà nuốt -ed thì giám khảo nghe thành hiện tại.",
          "Tiêu chí được đẩy: **FC** (nói dài, mạch chuyện rõ), **GRA** (trộn thì), **P** (-ed, nối âm). Chủ đề hôm nay dùng lại từ vựng bài 1.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 15 · 23 — band 5 và band 6 kể chuyện khác nhau ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 5 điển hình", "Band 6 cần có"],
        rows: [
          ["**FC**", "Hết ý ở giây 60–70; nối bằng and then / and after that; kể đều đều theo thứ tự", "Nói tới khi giám khảo dừng; có mốc chuyển chặng (At first… / All of a sudden… / In the end…); có một đoạn lùi lại giải thích"],
          ["**LR**", "happy · sad · interesting · very good", "cảm xúc cụ thể: relieved, exhausted, a bit nervous, proud; từ theo chủ đề"],
          ["**GRA**", "chỉ quá khứ đơn; quên chia quá khứ giữa chừng (yesterday I go…)", "trộn 3–4 thì quá khứ; có câu phức (while, because, which, although)"],
          ["**P**", "nuốt -ed; mỗi từ đọc rời", "-ed nghe rõ; nối âm ở cụm quen (picked‿up, looked‿at)"],
        ],
      },
      {
        t: "note",
        title: "📌 Nhắc lại khung Tập 2",
        items: [
          "**Sự kiện (Ngày 15):** dàn 4 phần — đó là sự kiện gì, khi nào ở đâu · ai tham gia · diễn ra thế nào · vì sao đáng nhớ. Kéo dài bằng cách đi hết từng ô thông tin.",
          "**Tình huống (Ngày 23):** đầu – sự cố – kết quả; cảm xúc đổi theo chặng; một câu thoại; kết bằng bài học.",
          "**1 phút ghi chú:** chỉ ghi từ khoá theo ô, không viết câu. Ghi sẵn 2–3 động từ quá khứ khó (had signed up, was raining).",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Kể quá khứ hoàn chỉnh — bốn thì, bốn việc" },
      {
        t: "p",
        text: "Tập 3 Ngày 1 đã dựng trục 12 thì. Khi **kể chuyện**, bạn chỉ cần bốn thì quá khứ, mỗi thì làm một việc riêng. Hãy nghĩ như quay phim: quá khứ đơn là các **cảnh chính** nối nhau; quá khứ tiếp diễn là **phông nền** đang diễn ra; quá khứ hoàn thành là **cảnh hồi tưởng** (xảy ra trước cảnh chính); was going to là **kế hoạch** lúc đó — thường là kế hoạch sắp bị phá.",
      },
      {
        t: "sodo",
        kind: "timeline",
        title: "Một buổi dọn bãi biển — bốn thì trên một trục",
        marks: [
          { from: -9, label: "had signed up (đã đăng ký từ tuần trước)", kieu: "diem", mau: 3 },
          { from: -7, to: -3, label: "was raining (trời đang mưa — nền)", kieu: "doan", mau: 2 },
          { from: -6, label: "arrived", kieu: "diem", mau: 1 },
          { from: -5, label: "picked up", kieu: "diem", mau: 1 },
          { from: -4, label: "found", kieu: "diem", mau: 1 },
        ],
        caption: "Quá khứ đơn = các điểm nối nhau. Quá khứ tiếp diễn = đoạn kéo dài phía sau. Quá khứ hoàn thành = điểm nằm TRƯỚC cả câu chuyện.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V-ed / V2",
            vi: "Quá khứ đơn — việc chính, nối nhau theo thứ tự (xương sống câu chuyện)",
            examples: [{ en: "We arrived at seven, put on gloves and started collecting rubbish.", vi: "Chúng tôi đến lúc bảy giờ, đeo găng và bắt đầu nhặt rác." }],
          },
          {
            formula: "S + was / were + V-ing + when + S + V-ed",
            vi: "Quá khứ tiếp diễn — cảnh nền đang diễn ra thì việc chính chen vào",
            examples: [
              { en: "It was still raining when we got there.", vi: "Trời vẫn đang mưa khi chúng tôi tới." },
              { en: "While I was walking along the beach, I noticed something moving in a net.", vi: "Khi tôi đang đi dọc bãi biển, tôi để ý thấy thứ gì đó cựa quậy trong một tấm lưới." },
            ],
          },
          {
            formula: "S + had + V3 (+ before / by the time + S + V-ed)",
            vi: "Quá khứ hoàn thành — chuyện xảy ra TRƯỚC thời điểm đang kể",
            examples: [
              { en: "I had never joined an event like that before, so I didn't know what to expect.", vi: "Trước đó tôi chưa từng tham gia sự kiện nào như vậy, nên không biết sẽ ra sao." },
              { en: "By the time we finished, we had filled more than fifty bags.", vi: "Tới lúc xong, chúng tôi đã chất đầy hơn năm mươi bao." },
            ],
          },
          {
            formula: "S + was / were going to + V, but + S + V-ed",
            vi: "Dự định lúc đó — thường bị đổi",
            examples: [{ en: "I was going to leave at noon, but I ended up staying until five.", vi: "Tôi định về lúc trưa, nhưng rốt cuộc ở lại tới năm giờ." }],
          },
          {
            formula: "S + used to + V  /  S + would + V",
            vi: "Thói quen trong quá khứ — dùng ở câu nền hoặc câu kết (ôn Tập 2 Ngày 21)",
            examples: [{ en: "I used to think one person couldn't make a difference.", vi: "Tôi từng nghĩ một người thì chẳng thay đổi được gì." }],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi kể chuyện quá khứ",
        items: [
          "**Trượt về hiện tại** sau ba câu: ~~We arrived at seven and then we start to collect…~~ ⇒ đã kể quá khứ thì giữ quá khứ tới hết chuyện. Chỉ đổi sang hiện tại khi nói cảm nghĩ BÂY GIỜ (I still remember…).",
          "**Lạm dụng quá khứ hoàn thành**: ~~I had arrived and I had seen…~~ ⇒ had + V3 chỉ dùng khi lùi về TRƯỚC điểm đang kể. Các việc nối tiếp nhau thì quá khứ đơn.",
          "~~When I walked on the beach, I was seeing a turtle.~~ ⇒ đảo ngược: việc dài = tiếp diễn, việc chen vào = đơn: While I **was walking**, I **saw** a turtle.",
          "~~I was very exciting~~ ⇒ người thì **-ed**: I was excited / exhausted / relieved. Sự việc thì -ing: The day was exciting.",
          "~~I didn't went~~ / ~~Did you saw~~ ⇒ sau did / didn't là động từ nguyên thể.",
        ],
      },
      { t: "rule", formula: "S + V-ed (việc chính)  ·  S + was / were + V-ing (nền)  ·  S + had + V3 (trước đó)  ·  S + was going to + V (dự định)", vi: "Một câu chuyện band 6: chủ yếu quá khứ đơn + ít nhất một câu của mỗi thì còn lại." },
      {
        t: "quiz",
        id: "t3d22-noi-thi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bốn thì kể chuyện (5 câu)",
        grammar: "V-ed · was / were V-ing · had V3 · was going to V",
        items: [
          { q: "Khi chúng tôi đến nơi, buổi hoà nhạc đã bắt đầu rồi.", answers: ["When we arrived, the concert had already started.", "When we got there, the concert had already started.", "By the time we arrived, the concert had already started.", "When we arrived, the concert had already begun."], hint: "when we arrived · had already started" },
          { q: "Tôi đang chụp ảnh thì một con khỉ giật lấy túi của tôi.", answers: ["I was taking photos when a monkey grabbed my bag.", "I was taking pictures when a monkey grabbed my bag.", "I was taking a photo when a monkey grabbed my bag.", "While I was taking photos, a monkey grabbed my bag.", "I was taking photos when a monkey took my bag."], hint: "was taking photos · when · grab my bag" },
          { q: "Tôi định về nhà sớm, nhưng rốt cuộc tôi ở lại tới nửa đêm.", answers: ["I was going to go home early, but I ended up staying until midnight.", "I was going to go home early, but in the end I stayed until midnight.", "I was going to leave early, but I ended up staying until midnight.", "I was going to go home early but I ended up staying until midnight."], hint: "was going to · go home early · end up staying · until midnight" },
          { q: "Trước đó tôi chưa bao giờ nhìn thấy cá heo.", answers: ["I had never seen a dolphin before.", "I had never seen dolphins before.", "I had never seen a dolphin before that."], hint: "had never seen · a dolphin · before" },
          { q: "Trời đang mưa, nên chúng tôi quyết định đợi trong quán cà phê.", answers: ["It was raining, so we decided to wait in a café.", "It was raining, so we decided to wait in a cafe.", "It was raining, so we decided to wait in the café.", "It was raining, so we decided to wait in the cafe.", "It was raining so we decided to wait in a café."], hint: "was raining · so · decide to wait · in a café" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Thẻ sự kiện vòng 2 — đọc động từ của thẻ, đi hết từng ô" },
      {
        t: "p",
        text: "Thẻ sự kiện ở band 6 thường có một **động từ hẹp** quyết định góc kể: an event you **attended** (đi dự) ≠ **took part in** (tự tay làm) ≠ **organised** (đứng ra tổ chức) ≠ **watched** (xem). Chọn chuyện khớp động từ; nếu chuyện của bạn hơi lệch, nói rõ ngay câu đầu. Thẻ mẫu hôm nay:",
      },
      {
        t: "note",
        title: "Thẻ đề A — Part 2",
        items: [
          "**Describe an outdoor event that you took part in.**",
          "You should say: **what** the event was",
          "**where and when** it took place",
          "**what you did** there",
          "and explain **how you felt** about taking part in it.",
        ],
      },
      {
        t: "table",
        head: ["Ô của thẻ", "Ghi chú 1 phút (từ khoá)", "Thì sẽ dùng", "Kéo dài bằng"],
        rows: [
          ["what", "beach clean-up · student club · 60 people", "quá khứ đơn + had signed up", "vì sao mình đăng ký (chuyện trước đó)"],
          ["where / when", "Can Gio · last March · Sunday 6 a.m. · raining", "was raining (nền)", "tả cảnh: bãi biển trông thế nào khi tới"],
          ["what you did", "gloves, bags → plastic, nets → found crab in net → freed", "chuỗi quá khứ đơn + while I was…", "một chi tiết bất ngờ + một câu thoại"],
          ["how you felt", "exhausted but proud · used to think… · now", "quá khứ đơn → hiện tại", "bài học / thay đổi của mình"],
        ],
        caption: "Mỗi ô 25–30 giây ⇒ đủ 2 phút. Ô “what you did” là ô dài nhất.",
      },
      { t: "rule", formula: "Động từ của thẻ → chọn chuyện  ·  4 ô × 25–30 giây  ·  ô “what you did” có 1 chi tiết bất ngờ", vi: "Không đủ 2 phút thường vì bỏ qua ô, không phải vì thiếu từ." },

      /* ── 4 ── */
      { t: "h", text: "4. Nghe và so: band 5 và band 6 cho thẻ đề A" },
      {
        t: "p",
        text: "Hai câu trả lời kể **cùng một buổi** dọn bãi biển. Nghe bản band 5 trước và đếm: bao nhiêu thì? bao nhiêu giây? Rồi nghe bản band 6 và tìm bốn thì kể chuyện.",
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 5 (ước tính) — khoảng 35 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about a beach clean-up. It was last year. I go with my club. We went to the beach in the morning and then we pick up the rubbish. There was a lot of plastic. And then we put it in the bags. And then we took photos. It was very tired but it was very interesting and meaningful. I think everyone should protect the environment. That's all.", vi: "Tôi muốn nói về một buổi dọn bãi biển. Đó là năm ngoái. Tôi đi với câu lạc bộ. Chúng tôi ra bãi biển buổi sáng rồi nhặt rác. Có rất nhiều nhựa. Rồi chúng tôi bỏ vào bao. Rồi chúng tôi chụp ảnh. Nó rất mệt nhưng rất thú vị và ý nghĩa. Tôi nghĩ mọi người nên bảo vệ môi trường. Hết ạ." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 1 phút 55 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about a beach clean-up that I took part in last March. It was organised by the environment club at my university, and I had signed up a week earlier, mainly because a friend had persuaded me — to be honest, I'd never joined anything like that before.", vi: "Tôi muốn kể về một buổi dọn bãi biển mà tôi tham gia tháng Ba vừa rồi. Nó do câu lạc bộ môi trường của trường tôi tổ chức, và tôi đã đăng ký từ một tuần trước, chủ yếu vì một người bạn thuyết phục — thật lòng thì trước đó tôi chưa từng tham gia việc gì như vậy." },
          { who: "Candidate", role: "candidate", text: "It took place at a beach in Can Gio, about two hours from the city centre. We left at four in the morning, and when we arrived it was still raining a little, so the beach looked grey and, well, pretty depressing. There were plastic bottles and old fishing nets everywhere.", vi: "Nó diễn ra ở một bãi biển ở Cần Giờ, cách trung tâm thành phố khoảng hai tiếng. Chúng tôi đi lúc bốn giờ sáng, và khi tới nơi trời vẫn đang mưa lâm râm, nên bãi biển trông xám xịt và, ừm, khá là ảm đạm. Chai nhựa và lưới đánh cá cũ ở khắp nơi." },
          { who: "Candidate", role: "candidate", text: "There were about sixty of us. We were given gloves and bags, and we worked in pairs. I was going to stay near the car park, but my partner wanted to go further, so we walked along the shore. While we were pulling a net out of the sand, I noticed something moving inside it. It was a small crab that had got trapped. My partner shouted, “Don't pull — you'll hurt it!” So we cut the net carefully and let it go.", vi: "Chúng tôi có khoảng sáu mươi người. Chúng tôi được phát găng tay và bao, và làm theo cặp. Tôi định ở gần bãi đỗ xe, nhưng bạn cùng cặp muốn đi xa hơn, nên chúng tôi đi dọc bờ. Khi đang kéo một tấm lưới khỏi cát, tôi để ý thấy thứ gì đó cựa quậy bên trong. Đó là một con cua nhỏ bị mắc kẹt. Bạn tôi hét lên: “Đừng kéo — cậu làm nó đau đấy!” Thế là chúng tôi cắt lưới cẩn thận rồi thả nó đi." },
          { who: "Candidate", role: "candidate", text: "By the time we finished, at around noon, we had filled more than fifty bags. I was exhausted, and my back ached, but I felt really proud. I used to think that one person couldn't make any difference to pollution. After that morning, I changed my mind — and I've actually joined two more clean-ups since then.", vi: "Tới lúc xong, khoảng giữa trưa, chúng tôi đã chất đầy hơn năm mươi bao. Tôi kiệt sức, lưng đau, nhưng thấy rất tự hào. Tôi từng nghĩ một người thì chẳng thay đổi được gì với ô nhiễm. Sau buổi sáng đó, tôi đổi ý — và thật ra từ đó tôi đã tham gia thêm hai buổi dọn nữa." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bản band 5", "Bản band 6"],
        rows: [
          ["**FC**", "khoảng 35 giây; ba lần “and then”; “That's all” — tự dừng", "gần 2 phút; mốc chuyển: when we arrived · While we were… · By the time we finished · After that morning"],
          ["**LR**", "interesting, meaningful, very tired (sai: it was tired)", "persuaded, depressing, shore, got trapped, exhausted, proud, make a difference"],
          ["**GRA**", "quá khứ đơn + hai lần trượt về hiện tại (I go, we pick up)", "had signed up · was still raining · was going to… but · While we were pulling · had got trapped · had filled · used to think"],
          ["**Nội dung**", "liệt kê việc làm, không có chi tiết riêng", "một chi tiết bất ngờ (con cua), một câu thoại, một thay đổi của bản thân"],
        ],
        caption: "Band ghi ở đây là ước tính. Điểm P phải nghe giọng thật mới chấm được — bạn ghi âm ở mục 9.",
      },
      {
        t: "note",
        title: "Vì sao bản thứ hai ở band 6",
        items: [
          "Không có từ nào “khủng”. Khác biệt là **đi hết bốn ô** và mỗi ô có thêm một lớp: lý do đăng ký, cảnh lúc tới, chi tiết con cua, điều đổi trong suy nghĩ.",
          "Có đúng **một** đoạn lùi thời gian (had signed up… had persuaded… I'd never joined) — đủ để giám khảo ghi nhận quá khứ hoàn thành.",
          "“to be honest”, “well”, “actually” là từ đệm tự nhiên — khác với “ờ… ờ…”.",
          "Câu kết nối quá khứ với hiện tại (I've joined two more since then) ⇒ câu chuyện có điểm dừng rõ, không cần “That's all”.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. “Describe a time when…” vòng 2 — năm chặng, cảm xúc, câu thoại, bài học" },
      {
        t: "p",
        text: "Đề **tình huống** không hỏi “sự kiện gì” mà hỏi một **khoảnh khắc**: a time when you were surprised / got lost / helped someone / saw an interesting animal. Tập 2 Ngày 23 dùng khung 3 phần (đầu – sự cố – kết quả). Band 6 tách thành **5 chặng** để đủ 2 phút và để cảm xúc có chỗ thay đổi.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Năm chặng của một câu chuyện “a time when”",
        steps: [
          { label: "1. Bối cảnh (20 giây)", sub: "khi nào, ở đâu, với ai, đang làm gì — was / were V-ing; cảm xúc: thoải mái / háo hức" },
          { label: "2. Sự cố / bước ngoặt (25 giây)", sub: "Suddenly… / All of a sudden… — quá khứ đơn; cảm xúc: giật mình / lo" },
          { label: "3. Mình đã làm gì (30 giây)", sub: "2–3 hành động + MỘT câu thoại" },
          { label: "4. Kết quả (20 giây)", sub: "In the end… / Luckily… — cảm xúc: nhẹ nhõm / buồn cười" },
          { label: "5. Bài học / vì sao nhớ (25 giây)", sub: "Looking back… / Since then… — hiện tại / hiện tại hoàn thành" },
        ],
      },
      {
        t: "table",
        head: ["Chặng", "Cụm mở chặng", "Từ cảm xúc band 6 (thay happy / sad / scared)"],
        rows: [
          ["1. Bối cảnh", "This happened about two years ago, when I was… · I was on a trip to… with…", "relaxed · excited · curious · in a good mood"],
          ["2. Sự cố", "Everything was fine until… · All of a sudden… · Out of nowhere…", "shocked · startled · confused · a bit nervous"],
          ["3. Hành động", "My first reaction was to… · I didn't know what to do, so I… · Someone shouted, “…”", "panicked · embarrassed · determined"],
          ["4. Kết quả", "In the end… · Luckily… · It turned out that…", "relieved · amused · grateful · disappointed"],
          ["5. Bài học", "Looking back, I think… · It taught me that… · Since then, I've always…", "proud · more careful · I still laugh about it"],
        ],
      },
      {
        t: "note",
        title: "Thẻ đề B — Part 2 (tình huống)",
        items: [
          "**Describe a time when you saw an interesting animal.**",
          "You should say: **what** the animal was",
          "**where** you saw it",
          "**what happened**",
          "and explain **why you remember** this experience.",
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) cho thẻ đề B — khoảng 1 phút 40 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "This happened about three years ago, when I was on a class trip to a nature reserve in the south of Vietnam. We were having lunch at some wooden tables near the forest, and everyone was relaxed and chatting.", vi: "Chuyện này xảy ra khoảng ba năm trước, khi tôi đi dã ngoại với lớp tới một khu bảo tồn thiên nhiên ở miền Nam. Chúng tôi đang ăn trưa ở mấy cái bàn gỗ gần rừng, ai cũng thoải mái trò chuyện." },
          { who: "Candidate", role: "candidate", text: "The guide had warned us not to leave food on the tables, but, of course, nobody had really listened. All of a sudden, a monkey jumped onto our table. I was startled, because I had only ever seen monkeys in a zoo before, behind glass.", vi: "Hướng dẫn viên đã cảnh báo chúng tôi đừng để đồ ăn trên bàn, nhưng dĩ nhiên chẳng ai thật sự nghe. Đột nhiên, một con khỉ nhảy lên bàn chúng tôi. Tôi giật mình, vì trước đó tôi chỉ từng thấy khỉ trong sở thú, sau lớp kính." },
          { who: "Candidate", role: "candidate", text: "It looked around, completely calm, picked up my friend's banana and then grabbed her phone as well. She shouted, “Hey, give it back!” — which obviously didn't work. I was going to chase it, but the guide stopped me. He walked over slowly and offered it a piece of fruit, and the monkey dropped the phone and climbed back up a tree.", vi: "Nó nhìn quanh, hoàn toàn bình thản, nhặt quả chuối của bạn tôi rồi chộp luôn cả điện thoại của bạn ấy. Bạn ấy hét: “Này, trả đây!” — dĩ nhiên là vô ích. Tôi định đuổi theo, nhưng hướng dẫn viên ngăn lại. Anh ấy từ từ đi tới, đưa cho nó một miếng trái cây, và con khỉ thả điện thoại xuống rồi trèo ngược lên cây." },
          { who: "Candidate", role: "candidate", text: "In the end the phone was fine, apart from a few scratches, and we were all relieved — and laughing. Looking back, I remember it because it was the first time I'd seen a wild animal behave so intelligently in its natural habitat. It also taught me that when we visit these places, we're the guests, so we really should follow the rules.", vi: "Rốt cuộc điện thoại không sao, ngoài vài vết xước, và cả bọn nhẹ nhõm — và cười. Nhìn lại, tôi nhớ chuyện đó vì đó là lần đầu tôi thấy một con vật hoang dã cư xử thông minh đến vậy trong môi trường tự nhiên của nó. Nó cũng dạy tôi rằng khi tới những nơi này, mình là khách, nên thật sự phải theo quy định." },
        ],
      },
      {
        t: "table",
        head: ["Chặng", "Trong bài mẫu", "Thì / công cụ"],
        rows: [
          ["1. Bối cảnh", "class trip · were having lunch · everyone was relaxed", "quá khứ tiếp diễn làm nền"],
          ["2. Sự cố", "had warned us… nobody had listened · All of a sudden, a monkey jumped", "quá khứ hoàn thành (trước đó) → quá khứ đơn"],
          ["3. Hành động", "picked up… grabbed… She shouted, “Hey, give it back!” · I was going to chase it, but…", "chuỗi quá khứ đơn + câu thoại + was going to"],
          ["4. Kết quả", "In the end the phone was fine… we were all relieved", "quá khứ đơn + từ cảm xúc"],
          ["5. Bài học", "Looking back, I remember it because… It also taught me that…", "hiện tại + quá khứ hoàn thành (the first time I'd seen)"],
        ],
      },
      { t: "rule", formula: "Bối cảnh (was V-ing) → All of a sudden + V-ed → hành động + 1 câu thoại → In the end… → Looking back, it taught me that…", vi: "Năm chặng, mỗi chặng một cảm xúc. Câu thoại chỉ cần một." },

      /* ── 6 ── */
      { t: "h", text: "6. Chiến thuật đổi ý — rẽ hướng mà không vỡ mạch" },
      {
        t: "p",
        text: "Ba tình huống hay làm thí sinh band 5 **im lặng**: (a) nói 10 giây mới nhận ra chuyện mình chọn không đủ để kể; (b) lỡ nói sai một chi tiết / một thì; (c) hết chuyện ở giây 70. Giám khảo không trừ điểm vì bạn đổi ý — người bản xứ cũng làm thế. Họ trừ điểm FC khi bạn **dừng**. Dưới đây là cụm cho từng tình huống.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Actually, now that I think about it, a better example would be + N / the time when + S + V-ed",
            vi: "(a) Đổi hẳn chuyện — chỉ làm trong 15 giây ĐẦU",
            examples: [{ en: "I was going to talk about a concert, but actually, now that I think about it, a better example would be the time when I joined a beach clean-up.", vi: "Tôi định nói về một buổi hoà nhạc, nhưng thật ra, nghĩ lại thì ví dụ hay hơn là lần tôi tham gia dọn bãi biển." }],
          },
          {
            formula: "…, or rather, …  /  Sorry, I mean …  /  Let me put that another way.",
            vi: "(b) Tự sửa nhanh rồi đi tiếp — không xin lỗi dài",
            examples: [
              { en: "It was last May — or rather, last March.", vi: "Đó là tháng Năm — à không, tháng Ba vừa rồi." },
              { en: "We go — sorry, I mean we went there by bus.", vi: "Chúng tôi đi — xin lỗi, ý tôi là đã đi tới đó bằng xe buýt." },
            ],
          },
          {
            formula: "Another thing I remember is (that) + S + V-ed  /  What I haven't mentioned yet is + N",
            vi: "(c) Hết ý sớm — quay lại một ô đã lướt qua",
            examples: [{ en: "Another thing I remember is that the organisers gave everyone a small tree to take home.", vi: "Một điều nữa tôi nhớ là ban tổ chức tặng mỗi người một cây con mang về." }],
          },
          {
            formula: "If I had the chance, I would + V  /  Compared with + N, this was + adj-er",
            vi: "(c) Vẫn còn giờ — thêm một lớp: mong muốn hoặc so sánh",
            examples: [{ en: "If I had the chance, I'd definitely do it again, maybe at a different beach.", vi: "Nếu có cơ hội, tôi chắc chắn sẽ làm lại, có thể ở một bãi biển khác." }],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận khi đổi ý",
        items: [
          "Đổi hẳn chuyện chỉ an toàn trong **15 giây đầu**. Sau giây 30 thì đừng đổi — hãy thêm lớp (ô còn thiếu, cảm xúc, so sánh, mong muốn).",
          "Tự sửa **một lần**, bằng 2–3 từ, rồi đi tiếp. Sửa đi sửa lại cùng một câu làm tụt FC hơn cả để nguyên lỗi.",
          "Không nói “Sorry, my English is not good” hay “I don't know what to say”. Thay bằng “Let me think… what else happened?” — vẫn là tiếng Anh, vẫn giữ mạch.",
          "Thứ tự “cứu” khi hết ý: ô còn thiếu trên thẻ → cảm xúc lúc đó → chuyện trước đó (had + V3) → so sánh / mong muốn. Nhớ thứ tự này như một danh sách kiểm.",
        ],
      },
      {
        t: "mcq",
        id: "t3d22-noi-chon",
        title: "Kiểm tra — kể chuyện và đổi ý (6 câu)",
        items: [
          { q: "Câu nào dùng thì ĐÚNG để tả cảnh nền?", options: ["When we arrived, the band played already.", "When we arrived, the band was playing on the main stage.", "When we were arriving, the band played.", "When we arrive, the band was playing."], correct: 1, why: "Cảnh nền đang diễn ra khi việc chính xảy ra ⇒ was playing; việc chính (arrived) quá khứ đơn." },
          { q: "“I ___ my ticket at home, so I had to go back.” — việc để quên xảy ra TRƯỚC khi phải quay lại.", options: ["leave", "was leaving", "have left", "had left"], correct: 3, why: "Chuyện xảy ra trước thời điểm đang kể ⇒ quá khứ hoàn thành: had left." },
          { q: "Bạn nói được 10 giây thì thấy chuyện mình chọn quá ít chi tiết. Nên làm gì?", options: ["Dừng lại và xin giám khảo đổi thẻ", "Nói “Actually, now that I think about it, a better example would be…” rồi kể chuyện khác", "Im lặng suy nghĩ 15 giây", "Tiếp tục và kết thúc ở giây 40"], correct: 1, why: "Đổi chuyện trong 15 giây đầu bằng một cụm chuyển là an toàn; im lặng hoặc nói quá ngắn mới mất điểm FC. Không được đổi thẻ." },
          { q: "Chặng nào của câu chuyện “a time when” thường dùng “Looking back… / It taught me that…”?", options: ["Bối cảnh", "Sự cố", "Bài học", "Hành động"], correct: 2, why: "Chặng 5 — bài học / vì sao nhớ — nối quá khứ với hiện tại." },
          { q: "Lỡ nói “Yesterday I go…”, cách xử lý tốt nhất là:", options: ["“I went, I mean.” rồi đi tiếp", "Dừng lại, xin lỗi và giải thích mình hay quên thì quá khứ", "Bắt đầu lại cả câu chuyện", "Lặp lại câu đó ba lần cho đúng"], correct: 0, why: "Tự sửa một lần, ngắn, rồi đi tiếp. Band 6 cho phép lỗi và tự sửa; không cho phép vỡ mạch." },
          { q: "Câu nào có từ cảm xúc dùng ĐÚNG?", options: ["I was very exciting about the trip.", "The trip was very excited.", "I felt relieving when I found my phone.", "I was relieved when I found my phone."], correct: 3, why: "Người cảm thấy ⇒ -ed: relieved, excited. Sự việc gây cảm xúc ⇒ -ing: exciting." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: đuôi -ed (/t/ · /d/ · /ɪd/) và nối âm" },
      {
        t: "p",
        text: "Tập 1 Ngày 9 · 14 và Tập 2 Ngày 21 đã dạy ba cách đọc -ed. Ôn nhanh: sau âm **vô thanh** (/p k f s ʃ tʃ θ/) đọc **/t/** — picked /pɪkt/; sau âm **hữu thanh** và nguyên âm đọc **/d/** — arrived /əˈraɪvd/; sau **/t/ hoặc /d/** đọc thêm một âm tiết **/ɪd/** — decided /dɪˈsaɪdɪd/. Cái mới hôm nay là **nối âm**: khi từ sau bắt đầu bằng nguyên âm, âm /t/ hoặc /d/ của -ed “nhảy” sang từ đó. Nhờ vậy -ed nghe RÕ hơn mà nói lại nhanh hơn.",
      },
      {
        t: "table",
        head: ["Viết", "Đọc nối", "Nghe như", "Ghi chú"],
        rows: [
          ["picked up", "/pɪk tʌp/", "pik-tup", "/t/ nối sang up"],
          ["looked around", "/lʊk təˈraʊnd/", "luk-tơ-raond", "/t/ nối sang around"],
          ["arrived at", "/əˈraɪv dət/", "ơ-raiv-dơt", "/d/ nối sang at (at đọc yếu /ət/)"],
          ["jumped onto", "/dʒʌmp tɒntə/", "jump-ton-tơ", "cụm /mpt/: /p/ rất nhẹ, giữ /t/"],
          ["decided to", "/dɪˈsaɪdɪ tə/", "đi-sai-đi-tơ", "/d/ cuối + /t/ đầu ⇒ chỉ bật một lần"],
          ["asked them", "/ɑːst ðəm/", "aast-dhơm", "trước phụ âm: /k/ gần như rơi, /t/ không bật mạnh"],
          ["wanted it", "/ˈwɒntɪ dɪt/", "won-ti-dit", "/ɪd/ + nguyên âm ⇒ /d/ nối"],
        ],
        caption: "Trước NGUYÊN ÂM: nối. Trước PHỤ ÂM: -ed vẫn có nhưng không bật hơi — lưỡi chạm rồi chuyển.",
      },
      {
        t: "note",
        title: "💡 Mẹo luyện -ed + nối âm",
        items: [
          "Đọc tách trước (picked… up), rồi dính dần cho tới khi nghe như một từ (pik-tup).",
          "KHÔNG thêm âm tiết: ~~pick-ked~~, ~~arrive-ved~~, ~~look-ked~~. Chỉ động từ kết thúc bằng /t/, /d/ mới thêm /ɪd/ (wanted, decided, started).",
          "Ghi âm một đoạn kể chuyện 30 giây, nghe lại và đếm: bao nhiêu động từ quá khứ nghe ra -ed? Mục tiêu ≥ 80 %.",
          "Động từ bất quy tắc không có -ed (went, saw, took) — đừng thêm: ~~wented~~, ~~sawed~~.",
        ],
      },
      { t: "rule", formula: "-ed = /t/ sau vô thanh · /d/ sau hữu thanh · /ɪd/ sau t, d  ·  -ed + nguyên âm ⇒ nối: picked‿up /pɪk tʌp/", vi: "Kể quá khứ: -ed phải nghe được. Nối âm giúp nó rõ mà không chậm." },
      {
        t: "phatam",
        id: "t3d22-phat-am",
        title: "Luyện phát âm — -ed và nối âm trong câu kể chuyện",
        note: "Đọc liền như đang kể. Azure chấm từng âm — xem điểm của âm cuối động từ.",
        items: [
          { text: "We picked up all the rubbish.", ipa: "wi pɪkt ʌp ɔːl ðə rʌbɪʃ", vi: "Chúng tôi nhặt hết rác." },
          { text: "I looked around and noticed a monkey.", ipa: "aɪ lʊkt əraʊnd ənd nəʊtɪst ə mʌŋki", vi: "Tôi nhìn quanh và để ý thấy một con khỉ." },
          { text: "It jumped onto the table.", ipa: "ɪt dʒʌmpt ɒntə ðə teɪbl", vi: "Nó nhảy lên bàn." },
          { text: "We arrived at the beach at seven.", ipa: "wi əraɪvd ət ðə biːtʃ ət sevn", vi: "Chúng tôi tới bãi biển lúc bảy giờ." },
          { text: "I had never joined an event like that.", ipa: "aɪ hæd nevə dʒɔɪnd ən ɪvent laɪk ðæt", vi: "Tôi chưa từng tham gia sự kiện nào như vậy." },
          { text: "We decided to stay a bit longer.", ipa: "wi dɪsaɪdɪd tə steɪ ə bɪt lɒŋɡə", vi: "Chúng tôi quyết định ở lại thêm một lúc." },
          { text: "Everyone laughed and clapped.", ipa: "evriwʌn lɑːft ənd klæpt", vi: "Mọi người cười và vỗ tay." },
          { text: "I realised I had learned a lesson.", ipa: "aɪ rɪəlaɪzd aɪ hæd lɜːnd ə lesn", vi: "Tôi nhận ra mình đã học được một bài học." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bảng cụm theo chặng — chép vào Sổ Speaking" },
      {
        t: "table",
        head: ["Việc cần làm", "Cụm dùng ngay"],
        rows: [
          ["Mở chuyện", "I'd like to talk about… · This happened about … ago, when I was…"],
          ["Lùi lại trước đó", "I had signed up / booked / planned… · I'd never… before"],
          ["Tả nền", "It was raining / getting dark · Everyone was chatting / waiting"],
          ["Bước ngoặt", "All of a sudden… · Everything was fine until… · While I was …-ing, I noticed…"],
          ["Dự định bị đổi", "I was going to…, but… · I ended up + V-ing"],
          ["Câu thoại", "Someone shouted, “…” · My friend said, “…” · The guide told us to…"],
          ["Kết quả", "In the end… · Luckily… · It turned out that… · By the time we finished, we had…"],
          ["Bài học", "Looking back… · It taught me that… · I used to think…, but now… · Since then, I've…"],
          ["Đổi ý / cứu mạch", "Actually, now that I think about it… · or rather… · Another thing I remember is…"],
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện nói Part 2 — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi thẻ: **1 phút ghi chú** (từ khoá theo ô / theo 5 chặng; ghi sẵn 2 động từ had + V3 và 1 câu thoại) → **nói 2 phút** không dừng. Nói xong tự chấm bằng bảng dưới rồi mới xem điểm AI. Thẻ 1 là sự kiện, thẻ 2 là tình huống, thẻ 3 là câu hỏi Part 3 nối tiếp.",
      },
      {
        t: "speak",
        id: "t3d22-noi-p2-su-kien",
        part: "2",
        questions: [
          "Describe an outdoor event that you took part in. You should say: what the event was; where and when it took place; what you did there; and explain how you felt about taking part in it.",
          "Describe a public event (for example a festival, a sports match or a ceremony) that you attended and enjoyed. You should say: what the event was; who you went with; what happened during the event; and explain why you enjoyed it.",
        ],
      },
      {
        t: "speak",
        id: "t3d22-noi-p2-tinh-huong",
        part: "2",
        questions: [
          "Describe a time when you saw an interesting animal. You should say: what the animal was; where you saw it; what happened; and explain why you remember this experience.",
          "Describe a time when your plans changed because of the weather. You should say: what you had planned to do; what the weather was like; what you did instead; and explain how you felt about the change.",
        ],
      },
      {
        t: "speak",
        id: "t3d22-noi-p3",
        part: "3",
        questions: [
          "Why do you think some people enjoy taking part in outdoor events more than watching them?",
          "Do you think children today spend enough time in nature? Why or why not?",
          "Some people say zoos are the best place for children to learn about animals. Do you agree?",
          "How might people's attitudes to wild animals change in the future?",
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo — tự chấm trước khi xem điểm AI",
        items: [
          "Tôi nói tới khi hết 2 phút, không tự nói “That's all”? (FC)",
          "Tôi có ít nhất MỘT câu của mỗi thì: was / were V-ing · had V3 · was going to? (GRA)",
          "Tôi có một chi tiết bất ngờ, một câu thoại và một câu bài học? (nội dung)",
          "Tôi dùng ≥ 3 từ cảm xúc khác happy / sad / interesting? (LR)",
          "Nghe lại 30 giây đầu: -ed có nghe ra không? Có chỗ nào trượt về hiện tại? (P · GRA)",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d22-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 22",
    goal: "Ôn trọn Ngày 22: dùng đúng từ và collocation chủ đề động vật – thiên nhiên, đếm vế đề Two-part và chia thân bài cho hai đối tượng, ghép câu khung, chia đúng bốn thì kể chuyện, nhận cách đọc -ed và nối âm, rồi viết một thân bài và kể một tình huống có AI chấm.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (43 câu + 1 đoạn viết + 1 lượt nói)",
        items: [
          "**I–III (22 câu)** — từ vựng: điền từ, collocation, dịch.",
          "**IV–V (10 câu)** — bài Viết: đếm vế, bố cục, ghép câu khung.",
          "**VI–VII (11 câu)** — bài Nói: bốn thì kể chuyện, -ed và nối âm.",
          "**VIII–IX** — viết một thân bài 90–110 từ và nói một thẻ Part 2 (AI chấm).",
          "Đạt: ≥ 30/43. Sai phần nào, quay lại đúng mục ghi ở tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 22 trước khi làm bài",
        center: "Ngày 22",
        branches: [
          { label: "Từ vựng", items: ["endangered ≠ extinct", "in the wild ↔ in captivity", "pose a threat to · raise awareness of"] },
          { label: "Viết", items: ["đếm vế: dấu ? + AND", "thân bài 2 chia đôi hai đối tượng", "ít ý, giải thích kỹ"] },
          { label: "Nói", items: ["4 thì kể chuyện", "5 chặng + câu thoại + bài học", "đổi ý: Actually… · or rather…"] },
          { label: "Phát âm", items: ["-ed: /t/ /d/ /ɪd/", "picked‿up · arrived‿at"] },
        ],
      },

      { t: "h", text: "I. Điền từ theo nghĩa (8 câu) — ôn bài Từ vựng mục 1–3" },
      {
        t: "quiz",
        id: "t3d22-bt-tu",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ cái đầu đã cho)",
        items: [
          { q: "1. The forest is the natural h___ of more than 300 kinds of bird.", answers: ["habitat"] },
          { q: "2. If nothing is done, the Javan rhino may become e___ within a few decades.", answers: ["extinct"] },
          { q: "3. P___ — the illegal hunting of protected animals — is still common in the region.", answers: ["poaching"] },
          { q: "4. Animals born in c___ often cannot find food when they are released.", answers: ["captivity"] },
          { q: "5. The lynx was r___ to the mountains after an absence of 100 years.", answers: ["reintroduced"] },
          { q: "6. The number of wild bees has d___ sharply since the 1990s.", answers: ["declined", "decreased", "dropped"] },
          { q: "7. Sharks are top p___; they have no natural enemies in the sea.", answers: ["predators"] },
          { q: "8. The injured owls are cared for at a bird s___ until they can fly again.", answers: ["sanctuary"] },
        ],
      },

      { t: "h", text: "II. Collocation (8 câu) — ôn bài Từ vựng mục 4–5" },
      {
        t: "mcq",
        id: "t3d22-bt-colloc",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "The Sumatran tiger is on the ___ of extinction.", options: ["side", "verge", "end", "top"], correct: 1, why: "on the verge / brink of extinction." },
          { q: "Many people believe animals should live ___ rather than in zoos.", options: ["on the wild", "in wildlife", "in the wild", "at wild"], correct: 2, why: "in the wild ↔ in captivity." },
          { q: "Removing wolves from the area ___ the balance of nature.", options: ["upset", "broke up", "fell", "turned"], correct: 0, why: "upset the balance of nature." },
          { q: "The charity works to protect elephants ___ poachers.", options: ["of", "to", "with", "from"], correct: 3, why: "protect sb / sth from + mối nguy." },
          { q: "Wetlands ___ a vital role in preventing floods.", options: ["make", "play", "do", "take"], correct: 1, why: "play a (vital) role in." },
          { q: "Several countries have ___ a ban on the trade in rare birds.", options: ["imposed", "put up", "made up", "risen"], correct: 0, why: "impose / introduce a ban on." },
          { q: "Which sentence is correct?", options: ["The wildlifes here are amazing.", "Tigers are extincted in this country.", "This specie is very rare.", "Wildlife is under threat in many regions."], correct: 3, why: "wildlife không đếm được; extinct là tính từ (are extinct); species không bỏ -s." },
          { q: "Intensive farming contributes ___ the loss of biodiversity.", options: ["for", "in", "to", "with"], correct: 2, why: "contribute to + N (Ngày 21)." },
        ],
      },

      { t: "h", text: "III. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d22-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — dùng cụm gợi ý",
        grammar: "collocation chủ đề động vật + although / due to / lead to",
        items: [
          { q: "Đánh bắt quá mức đã dẫn tới sự suy giảm mạnh của trữ lượng cá.", answers: ["Overfishing has led to a sharp decline in fish stocks.", "Overfishing has led to a sharp fall in fish stocks.", "Overfishing has resulted in a sharp decline in fish stocks.", "Overfishing led to a sharp decline in fish stocks."], hint: "overfishing · lead to · a sharp decline in · fish stocks" },
          { q: "Mặc dù săn trộm là bất hợp pháp, nó vẫn tiếp diễn ở nhiều nước.", answers: ["Although poaching is illegal, it continues in many countries.", "Although poaching is illegal, it still continues in many countries.", "Even though poaching is illegal, it continues in many countries.", "Although poaching is illegal, it still happens in many countries."], hint: "although · poaching · illegal · continue" },
          { q: "Chính phủ nên cấm thử nghiệm trên động vật cho mỹ phẩm.", answers: ["The government should ban animal testing for cosmetics.", "Governments should ban animal testing for cosmetics.", "The government should ban the testing of cosmetics on animals.", "The government should ban testing cosmetics on animals."], hint: "ban · animal testing · for cosmetics" },
          { q: "Loài chim này là loài bản địa của Việt Nam.", answers: ["This bird is native to Vietnam.", "This bird is native to Viet Nam.", "This species of bird is native to Vietnam.", "This bird species is native to Vietnam."], hint: "be native to" },
          { q: "Mất môi trường sống là mối đe doạ lớn nhất đối với động vật hoang dã.", answers: ["Habitat loss is the biggest threat to wildlife.", "Habitat loss is the greatest threat to wildlife.", "Habitat loss is the biggest threat to wild animals.", "The loss of habitat is the biggest threat to wildlife."], hint: "habitat loss · the biggest threat to · wildlife" },
          { q: "Chúng ta có nghĩa vụ bảo vệ thiên nhiên cho các thế hệ tương lai.", answers: ["We have a duty to protect nature for future generations.", "We have a responsibility to protect nature for future generations.", "We have a duty to protect nature for the future generations."], hint: "have a duty to · protect nature · for future generations" },
        ],
      },

      { t: "h", text: "IV. Đề Two-part: đếm vế và bố cục (6 câu) — ôn bài Viết mục 3–4, 12" },
      {
        t: "mcq",
        id: "t3d22-bt-de",
        title: "IV. Chọn đáp án đúng",
        items: [
          { q: "“Fewer young people are choosing to become farmers. Why is this happening? What problems might this cause for rural communities and for the country as a whole?” — đề có mấy vế?", options: ["2", "3", "4", "1"], correct: 1, why: "① vì sao · ② vấn đề cho cộng đồng nông thôn · ③ vấn đề cho cả nước." },
          { q: "Với đề trên, đoạn nào trả lời vế ② và ③?", options: ["Mở bài", "Thân bài 1", "Thân bài 2 — chia đôi cho hai đối tượng", "Kết bài"], correct: 2, why: "Thân bài 1 = câu hỏi 1; thân bài 2 = câu hỏi 2, nửa đầu rural communities, nửa sau the country." },
          { q: "Câu mở bài nào trả lời được cả hai câu hỏi?", options: ["This essay will discuss the reasons and the problems of this trend.", "There are many reasons and many problems.", "Nowadays farming is a hot topic all over the world.", "This essay will argue that low incomes are the main reason, and that the trend threatens both village life and national food security."], correct: 3, why: "D nêu câu trả lời ngắn cho câu hỏi 1 (low incomes) và câu hỏi 2 (hai đối tượng). A, B chỉ nhắc lại đề; C sáo." },
          { q: "Đề KHÔNG hỏi giải pháp. Kết bài nên:", options: ["tóm lại nguyên nhân chính và hai nhóm hệ quả bằng từ khác", "đề xuất ba giải pháp chi tiết", "thêm một nguyên nhân mới", "chép lại mở bài"], correct: 0, why: "Kết bài trả lời lại hai câu hỏi; không ý mới, không lạc sang phần đề không hỏi." },
          { q: "Thân bài 1 của bạn có năm nguyên nhân, mỗi nguyên nhân một câu. Sửa thế nào?", options: ["Thêm nguyên nhân thứ sáu cho đủ dài", "Giữ nguyên, thêm Moreover trước mỗi câu", "Chọn hai nguyên nhân, mỗi cái thêm giải thích + ví dụ", "Chuyển hai nguyên nhân xuống kết bài"], correct: 2, why: "Band 6: ít ý, phát triển kỹ. Liệt kê là dấu hiệu band 5." },
          { q: "Công cụ sinh ý nào được dùng trong câu: “When the forest is cleared, heavy rain washes the soil away, and farmers downstream lose their crops.”", options: ["Bánh xe tầng", "Nhóm người", "Đếm vế", "Chuỗi hệ quả"], correct: 3, why: "A → B → C: hỏi “rồi sao nữa?” liên tiếp." },
        ],
      },

      { t: "h", text: "V. Ghép câu khung (4 câu) — ôn bài Viết mục 10" },
      {
        t: "build",
        id: "t3d22-bt-ghep",
        title: "V. Bấm các mảnh theo đúng thứ tự để dựng câu",
        items: [
          { vi: "Lý do chính khiến loài này đang suy giảm là mất môi trường sống.", chips: ["The principal reason why", "this species is declining", "is", "habitat loss.", "because", "are"], answer: ["The principal reason why", "this species is declining", "is", "habitat loss."] },
          { vi: "Xu hướng này ảnh hưởng trực tiếp tới các cộng đồng ven biển.", chips: ["This trend", "affects", "coastal communities", "directly.", "affects on", "effects"], answer: ["This trend", "affects", "coastal communities", "directly."] },
          { vi: "Những ảnh hưởng tới môi trường cũng nghiêm trọng không kém.", chips: ["The effects on", "the environment", "are", "equally serious.", "is", "to"], answer: ["The effects on", "the environment", "are", "equally serious."] },
          { vi: "Mặc dù săn bắn bị cấm, nạn săn trộm vẫn tiếp diễn.", chips: ["Although", "hunting is banned,", "poaching", "continues.", "but", "Despite"], answer: ["Although", "hunting is banned,", "poaching", "continues."] },
        ],
      },

      { t: "h", text: "VI. Bốn thì kể chuyện (6 câu) — ôn bài Nói mục 2" },
      {
        t: "quiz",
        id: "t3d22-bt-thi",
        kind: "fill",
        title: "VI. Chia động từ trong ngoặc: quá khứ đơn · quá khứ tiếp diễn · quá khứ hoàn thành · was / were going to",
        items: [
          { q: "1. While we ___ (walk) through the forest, we heard a strange noise.", answers: ["were walking"] },
          { q: "2. By the time the guide arrived, the monkeys ___ (already / take) all our fruit.", answers: ["had already taken"] },
          { q: "3. I ___ (never / see) a wild elephant before that trip.", answers: ["had never seen"] },
          { q: "4. We ___ (go) camp by the lake, but it started to rain, so we stayed in a hostel. (dự định)", answers: ["were going to"] },
          { q: "5. When the bird suddenly ___ (land) on my shoulder, everyone laughed.", answers: ["landed"] },
          { q: "6. It ___ (get) dark when we finally found the path back.", answers: ["was getting"] },
        ],
      },

      { t: "h", text: "VII. -ed và nối âm (5 câu) — ôn bài Nói mục 7" },
      {
        t: "mcq",
        id: "t3d22-bt-phat-am",
        title: "VII. Chọn đáp án đúng",
        items: [
          { q: "Đuôi -ed trong “jumped” đọc là:", options: ["/ɪd/", "/d/", "/t/", "không đọc"], correct: 2, why: "Sau /p/ (vô thanh) ⇒ /t/: /dʒʌmpt/." },
          { q: "Đuôi -ed trong “arrived” đọc là:", options: ["/d/", "/t/", "/ɪd/", "/əd/"], correct: 0, why: "Sau /v/ (hữu thanh) ⇒ /d/: /əˈraɪvd/." },
          { q: "Từ nào có đuôi -ed đọc /ɪd/?", options: ["noticed", "laughed", "joined", "decided"], correct: 3, why: "decided: gốc kết thúc bằng /d/ ⇒ thêm âm tiết /ɪd/. noticed /t/, laughed /t/, joined /d/." },
          { q: "“picked up” khi nói nhanh nghe như:", options: ["pick-ked up", "pik-tup", "pick up (không có -ed)", "pik-dup"], correct: 1, why: "/pɪkt/ + /ʌp/ ⇒ /t/ nối sang nguyên âm: /pɪk tʌp/." },
          { q: "Từ nào KHÁC ba từ còn lại về cách đọc -ed?", options: ["looked", "watched", "helped", "lived"], correct: 3, why: "lived /lɪvd/ đọc /d/; ba từ kia đọc /t/." },
        ],
      },

      { t: "h", text: "VIII. Viết một thân bài (90–110 từ) — AI chấm" },
      {
        t: "essay",
        id: "t3d22-bt-viet",
        task: "Task 2",
        prompt: "Viết MỘT đoạn thân bài 2 (90–110 từ) cho đề: “In many countries, wild animals are losing their natural habitats. Why is this happening? What effects does this have on local people and on the animals themselves?” — Đoạn của bạn trả lời câu hỏi 2 và phải chia đôi cho HAI đối tượng (local people · the animals), dùng câu chuyển “The effects on … are equally serious.” và ít nhất hai cấu trúc Ngày 21 (owing to · which means that · as a result · although).",
        minWords: 90,
        tips: [
          "Câu 1: This trend affects local people directly.",
          "2–3 câu cho local people: ý → giải thích → ví dụ.",
          "Câu chuyển rồi 2–3 câu cho the animals.",
          "Dùng ≥ 3 cụm của bài Từ vựng.",
        ],
      },

      { t: "h", text: "IX. Nói một thẻ Part 2 — ghi âm, AI chấm" },
      {
        t: "speak",
        id: "t3d22-bt-noi-p2",
        part: "2",
        questions: [
          "Describe a time when you helped an animal or saw someone help an animal. You should say: what the animal was; where it happened; what was done to help it; and explain how you felt afterwards.",
        ],
      },
      {
        t: "note",
        title: "Tự chấm phần IX trước khi xem điểm AI",
        items: [
          "Đủ 5 chặng: bối cảnh → sự cố → hành động → kết quả → bài học?",
          "Có ít nhất một câu was / were V-ing, một câu had + V3?",
          "Có một câu thoại?",
          "Nói đủ gần 2 phút, không tự kết “That's all”?",
          "Nghe lại: -ed có rõ không?",
        ],
      },
    ],
  },
];
