/**
 * IELTS Tập 3 — Ngày 24 (band 5.0 → 6.0).
 * Bài 1 từ vựng: Energy & resources (VC25) + collocation Task 1 (VD3 — nối Tập 3 Ngày 14).
 * Bài 2 viết: Task 1 mixed charts — bar + line; pie + table: mở bài 2 câu, overview mỗi hình một ý, mỗi khổ một hình,
 *   mỗi hình một thì (W12 — nối Tập 3 Ngày 8 · 12 · 16 · 20).
 * Bài 3 nghe: Part 4 Summary + Table completion, giọng New Zealand (L06 · L10 · L08 · L17 — nối Tập 2 Ngày 19, Tập 3 Ngày 13 · 20)
 *   · 🔊 nhận ra ngữ điệu khi nghe (S15 — nối Tập 3 Ngày 23).
 * Bài 5: kiểm tra chặng Ngày 19–24 (t3d24-kiem-tra).
 * Mọi số liệu, kịch bản nghe, bài đọc, bài mẫu đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_24: Lesson[] = [
  /* ═══════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════ */
  {
    id: "t3d24-tu-vung",
    kind: "vocab",
    title: "Năng lượng & tài nguyên + collocation Task 1",
    goal: "Dùng đúng 43 từ và 12 cụm về năng lượng – tài nguyên (renewable energy, the grid, deplete, meet the demand for…) trong Task 2 và Part 3, cùng 14 collocation tả số liệu (account for, peak at, a threefold increase…) cho Task 1.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        items: [
          "Chủ đề **Energy & resources** — hay ra ở Task 2 (nên đầu tư năng lượng tái tạo hay không), Part 3 (tiết kiệm điện nước), Reading và Listening Part 4. Hôm nay học **43 từ** chia 3 nhóm: nguồn năng lượng · sản xuất – tiêu thụ · tài nguyên – bền vững.",
          "**12 cụm** dùng ngay cho Task 2 / Part 3: meet the demand for energy · reduce our reliance on fossil fuels · switch to renewable sources · run out of…",
          "**14 collocation Task 1** (nối Ngày 14): account for · make up · peak at · stand at · a threefold increase · the figure for… Bài 2 hôm nay (biểu đồ kết hợp) dùng hết.",
          "Tập 2 Ngày 8 và Tập 3 Ngày 20 đã có emissions, carbon footprint, subsidy, fuel-efficient, phase out — hôm nay **không dạy lại**, chỉ dùng lại trong ví dụ.",
          "Bài nghe hôm nay là bài giảng về địa nhiệt ở New Zealand — học kỹ nhóm 1 và 2 thì nghe dễ hẳn.",
          "Đẩy tiêu chí **LR** band 6: đủ rộng để bàn một chủ đề “khó”, dám dùng từ ít gặp.",
        ],
      },

      { t: "h", text: "1. Nguồn năng lượng (14 từ)" },
      { t: "p", text: "Cách học như mọi ngày: đọc to từ + câu ví dụ → **Che nghĩa** tự nói nghĩa → **Che từ** nhìn nghĩa nói lại từ. Dòng **more** là cụm đi kèm — đó mới là thứ bạn viết ra khi thi." },
      {
        t: "sodo", kind: "mindmap", title: "Hai họ nguồn năng lượng", center: "energy sources",
        branches: [
          { label: "fossil fuels (hoá thạch — có hạn)", items: ["coal", "crude oil", "natural gas"] },
          { label: "renewables (tái tạo)", items: ["solar power", "wind power", "hydroelectric power", "geothermal energy", "tidal power", "biofuel"] },
          { label: "nuclear power (hạt nhân)", items: ["ít phát thải", "không tái tạo", "chất thải phóng xạ"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "fossil fuel", pos: "n", ipa: "/ˈfɒsl fjuːəl/", vi: "nhiên liệu hoá thạch (than, dầu, khí)", ex: "Most of the world's electricity still comes from fossil fuels.", exVi: "Phần lớn điện của thế giới vẫn đến từ nhiên liệu hoá thạch.", more: "**burn** fossil fuels · **reliance on** fossil fuels · đếm được: fossil fuel**s**" },
          { w: "coal", pos: "n", ipa: "/kəʊl/", vi: "than đá", ex: "The country closed its last coal mine in 2015.", exVi: "Nước này đóng mỏ than cuối cùng vào năm 2015.", more: "a **coal-fired** power station · a coal mine · không đếm được" },
          { w: "crude oil", pos: "n", ipa: "/ˌkruːd ˈɔɪl/", vi: "dầu thô", ex: "The price of crude oil doubled within a year.", exVi: "Giá dầu thô tăng gấp đôi trong vòng một năm.", more: "a barrel of **crude oil** · oil reserves · an oil field · petrol (UK) = gasoline (US)" },
          { w: "natural gas", pos: "n", ipa: "/ˌnætʃrəl ˈɡæs/", vi: "khí tự nhiên", ex: "Natural gas produces less carbon dioxide than coal.", exVi: "Khí tự nhiên thải ít CO₂ hơn than.", more: "a **gas-fired** plant · a gas pipeline" },
          { w: "nuclear power", pos: "n", ipa: "/ˌnjuːkliə ˈpaʊə/", vi: "điện hạt nhân", ex: "Nuclear power provides a steady supply of electricity without burning fuel.", exVi: "Điện hạt nhân cung cấp nguồn điện ổn định mà không đốt nhiên liệu.", more: "a **nuclear** power station / reactor · nuclear waste · đọc đúng: NEW-klee-uh, không phải ~~nu-cu-lar~~" },
          { w: "renewable", pos: "adj, n", ipa: "/rɪˈnjuːəbl/", vi: "tái tạo được; (n, số nhiều) các nguồn tái tạo", ex: "Renewable energy now accounts for a third of the country's electricity.", exVi: "Năng lượng tái tạo hiện chiếm một phần ba lượng điện của cả nước.", more: "**renewable** energy / sources / resources · invest in **renewables** · ≠ non-renewable · renew (v)" },
          { w: "solar power", pos: "n", ipa: "/ˌsəʊlə ˈpaʊə/", vi: "điện mặt trời", ex: "Solar power is cheap, but it is only available during the day.", exVi: "Điện mặt trời rẻ, nhưng chỉ có vào ban ngày.", more: "**solar** energy / panels / farm · solar-powered (adj)" },
          { w: "solar panel", pos: "n", ipa: "/ˌsəʊlə ˈpænl/", vi: "tấm pin mặt trời", ex: "More and more households are installing solar panels on their roofs.", exVi: "Ngày càng nhiều hộ lắp pin mặt trời trên mái nhà.", more: "**install / fit** solar panels · rooftop solar panels" },
          { w: "wind farm", pos: "n", ipa: "/ˈwɪnd fɑːm/", vi: "trang trại điện gió", ex: "A new offshore wind farm will power half a million homes.", exVi: "Một trang trại điện gió ngoài khơi mới sẽ cấp điện cho nửa triệu hộ.", more: "an **offshore / onshore** wind farm · wind power / energy" },
          { w: "turbine", pos: "n", ipa: "/ˈtɜːbaɪn/", vi: "tua-bin", ex: "Steam from the well is used to turn a turbine.", exVi: "Hơi nước từ giếng được dùng để quay tua-bin.", more: "a wind **turbine** · **turn / drive** a turbine" },
          { w: "hydroelectric", pos: "adj", ipa: "/ˌhaɪdrəʊɪˈlektrɪk/", vi: "thuộc thuỷ điện", ex: "Hydroelectric dams supply most of the region's power.", exVi: "Các đập thuỷ điện cung cấp phần lớn điện cho vùng.", more: "a **hydroelectric** dam / plant · hydropower = hydro (n) · dam (n) = đập" },
          { w: "geothermal", pos: "adj", ipa: "/ˌdʒiːəʊˈθɜːml/", vi: "thuộc địa nhiệt (nhiệt trong lòng đất)", ex: "Geothermal energy can be produced day and night, whatever the weather.", exVi: "Năng lượng địa nhiệt có thể sản xuất cả ngày lẫn đêm, bất kể thời tiết.", more: "**geothermal** energy / field / plant · geo- = đất · thermal = nhiệt" },
          { w: "tidal", pos: "adj", ipa: "/ˈtaɪdl/", vi: "thuộc thuỷ triều", ex: "Tidal power is more predictable than wind power.", exVi: "Điện thuỷ triều dễ dự đoán hơn điện gió.", more: "**tidal** power / energy · tide (n) = thuỷ triều · wave power = điện sóng" },
          { w: "biofuel", pos: "n", ipa: "/ˈbaɪəʊfjuːəl/", vi: "nhiên liệu sinh học", ex: "Biofuel made from crops competes with food production for land.", exVi: "Nhiên liệu sinh học làm từ cây trồng cạnh tranh đất với sản xuất lương thực.", more: "bio- = sinh học · biomass (n) = sinh khối · biodegradable (adj)" },
        ],
      },

      { t: "h", text: "2. Sản xuất, truyền tải, tiêu thụ (14 từ)" },
      {
        t: "sodo", kind: "flow", title: "Đường đi của một kilowatt-giờ",
        steps: [
          { label: "generate", sub: "power station · turbine · output" },
          { label: "transmit", sub: "the national grid · pipeline" },
          { label: "store", sub: "storage · battery" },
          { label: "consume", sub: "household appliances · consumption · peak demand" },
          { label: "save", sub: "insulation · energy-efficient · smart meter" },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "generate", pos: "v", ipa: "/ˈdʒenəreɪt/", vi: "sản xuất (điện), tạo ra", ex: "The dam generates enough electricity for two million homes.", exVi: "Con đập sản xuất đủ điện cho hai triệu hộ.", more: "**generate** electricity / power / income · generation (n): electricity generation · generator (n) = máy phát" },
          { w: "power station", pos: "n", ipa: "/ˈpaʊə steɪʃn/", vi: "nhà máy điện", ex: "The old power station was replaced by a wind farm.", exVi: "Nhà máy điện cũ được thay bằng một trang trại điện gió.", more: "= power plant (US) · a coal-fired / nuclear **power station**" },
          { w: "grid", pos: "n", ipa: "/ɡrɪd/", vi: "lưới điện", ex: "Homes with solar panels can sell extra electricity back to the grid.", exVi: "Nhà có pin mặt trời có thể bán điện dư lại cho lưới.", more: "the **national grid** · be connected to the grid · off-grid (adj) = không nối lưới" },
          { w: "output", pos: "n", ipa: "/ˈaʊtpʊt/", vi: "sản lượng", ex: "Total output rose from 245 to 300 terawatt-hours.", exVi: "Tổng sản lượng tăng từ 245 lên 300 terawatt-giờ.", more: "energy / industrial **output** · increase / reduce output · rất hợp Task 1" },
          { w: "consumption", pos: "n", ipa: "/kənˈsʌmpʃn/", vi: "sự tiêu thụ, mức tiêu thụ", ex: "Energy consumption per person fell by 10% over the decade.", exVi: "Mức tiêu thụ năng lượng trên đầu người giảm 10% trong thập kỷ.", more: "energy / water / fuel **consumption** · consume (v) · consumer (n)" },
          { w: "demand", pos: "n", ipa: "/dɪˈmɑːnd/", vi: "nhu cầu", ex: "Demand for electricity peaks in the early evening.", exVi: "Nhu cầu điện đạt đỉnh vào đầu buổi tối.", more: "**demand for** sth (không phải ~~demand of~~) · meet / satisfy demand · peak demand · ≠ supply" },
          { w: "supply", pos: "n, v", ipa: "/səˈplaɪ/", vi: "nguồn cung; cung cấp", ex: "Hydro power supplies about sixty per cent of the country's electricity.", exVi: "Thuỷ điện cung cấp khoảng sáu mươi phần trăm điện của cả nước.", more: "**supply** sb **with** sth · a reliable supply of energy · water supplies · supply and demand" },
          { w: "energy efficiency", pos: "n", ipa: "/ˌenədʒi ɪˈfɪʃnsi/", vi: "hiệu quả sử dụng năng lượng", ex: "Improving energy efficiency is cheaper than building new power stations.", exVi: "Nâng hiệu quả năng lượng rẻ hơn xây nhà máy điện mới.", more: "**energy-efficient** appliances / homes · efficient (adj) ≠ inefficient · efficiently (adv)" },
          { w: "insulation", pos: "n", ipa: "/ˌɪnsjuˈleɪʃn/", vi: "lớp cách nhiệt; sự cách nhiệt", ex: "Good insulation can cut heating bills by a third.", exVi: "Cách nhiệt tốt có thể giảm một phần ba hoá đơn sưởi.", more: "roof / wall **insulation** · insulate (v) a house · a well-insulated home" },
          { w: "appliance", pos: "n", ipa: "/əˈplaɪəns/", vi: "thiết bị gia dụng (chạy điện)", ex: "Appliances left on standby still use electricity.", exVi: "Thiết bị để chế độ chờ vẫn tốn điện.", more: "household / electrical / kitchen **appliances** · leave sth on standby" },
          { w: "power cut", pos: "n", ipa: "/ˈpaʊə kʌt/", vi: "sự mất điện, cúp điện", ex: "The storm caused power cuts across the whole region.", exVi: "Cơn bão gây mất điện trên toàn vùng.", more: "= blackout / power outage (US) · **cause / suffer** a power cut" },
          { w: "storage", pos: "n", ipa: "/ˈstɔːrɪdʒ/", vi: "sự lưu trữ", ex: "Battery storage allows solar energy to be used at night.", exVi: "Lưu trữ bằng pin cho phép dùng năng lượng mặt trời vào ban đêm.", more: "energy / battery **storage** · store (v) energy · storage capacity" },
          { w: "pipeline", pos: "n", ipa: "/ˈpaɪplaɪn/", vi: "đường ống (dẫn dầu, khí)", ex: "The gas is transported by pipeline from the coast.", exVi: "Khí được vận chuyển bằng đường ống từ bờ biển.", more: "an oil / gas **pipeline** · in the pipeline (thành ngữ) = đang được chuẩn bị" },
          { w: "meter", pos: "n", ipa: "/ˈmiːtə/", vi: "công tơ, đồng hồ đo (điện, nước, gas)", ex: "A smart meter shows how much electricity you are using in real time.", exVi: "Công tơ thông minh cho thấy bạn đang dùng bao nhiêu điện theo thời gian thực.", more: "a **smart meter** · read the meter · an electricity / water meter" },
        ],
      },

      { t: "h", text: "3. Tài nguyên và tính bền vững (15 từ)" },
      {
        t: "vocab",
        items: [
          { w: "natural resources", pos: "n (pl)", ipa: "/ˌnætʃrəl rɪˈzɔːsɪz/", vi: "tài nguyên thiên nhiên", ex: "The country is rich in natural resources such as copper and timber.", exVi: "Nước này giàu tài nguyên thiên nhiên như đồng và gỗ.", more: "be **rich in** natural resources · **manage / waste** resources · resource (n) cũng = nguồn lực" },
          { w: "finite", pos: "adj", ipa: "/ˈfaɪnaɪt/", vi: "có hạn, hữu hạn", ex: "Oil is a finite resource, so it will eventually run out.", exVi: "Dầu là tài nguyên có hạn nên rồi sẽ cạn.", more: "a **finite** resource / supply · ≠ infinite /ˈɪnfɪnət/ (chú ý: hai từ đọc khác hẳn nhau)" },
          { w: "abundant", pos: "adj", ipa: "/əˈbʌndənt/", vi: "dồi dào, phong phú", ex: "Sunlight is abundant in the south of the country.", exVi: "Ánh nắng dồi dào ở miền nam đất nước.", more: "an **abundant** supply of · abundance (n): an abundance of water · ≠ scarce" },
          { w: "scarce", pos: "adj", ipa: "/skeəs/", vi: "khan hiếm", ex: "Clean water is becoming scarce in many large cities.", exVi: "Nước sạch đang trở nên khan hiếm ở nhiều thành phố lớn.", more: "**scarce** resources · scarcity (n): water scarcity · scarcely (adv) = hầu như không" },
          { w: "reserves", pos: "n (pl)", ipa: "/rɪˈzɜːvz/", vi: "trữ lượng", ex: "The region has some of the largest gas reserves in the world.", exVi: "Vùng này có trữ lượng khí vào loại lớn nhất thế giới.", more: "oil / gas / coal **reserves** · a nature reserve = khu bảo tồn (Ngày 22)" },
          { w: "deplete", pos: "v", ipa: "/dɪˈpliːt/", vi: "làm cạn kiệt", ex: "Overfishing has depleted fish stocks in the North Sea.", exVi: "Đánh bắt quá mức đã làm cạn nguồn cá ở Biển Bắc.", more: "**deplete** resources / reserves / stocks · depletion (n): the depletion of natural resources" },
          { w: "extract", pos: "v", ipa: "/ɪkˈstrækt/", vi: "khai thác, chiết ra", ex: "It is becoming more expensive to extract oil from deep under the sea.", exVi: "Khai thác dầu từ sâu dưới biển ngày càng đắt.", more: "**extract** oil / minerals **from** · extraction (n) · danh từ extract /ˈekstrækt/ = đoạn trích" },
          { w: "exploit", pos: "v", ipa: "/ɪkˈsplɔɪt/", vi: "khai thác (tài nguyên); bóc lột", ex: "The country has only begun to exploit its wind resources.", exVi: "Nước này mới chỉ bắt đầu khai thác tài nguyên gió.", more: "(gặp ở Ngày 22 với động vật — hôm nay dùng cho tài nguyên) **exploit** resources (trung tính) · exploit workers (xấu) · exploitation (n)" },
          { w: "mining", pos: "n", ipa: "/ˈmaɪnɪŋ/", vi: "ngành khai mỏ", ex: "Mining provides jobs but often damages the local environment.", exVi: "Khai mỏ tạo việc làm nhưng thường gây hại môi trường địa phương.", more: "coal / gold **mining** · a mine (n) · miner (n) · mineral (n) = khoáng sản" },
          { w: "drill", pos: "v, n", ipa: "/drɪl/", vi: "khoan; mũi khoan", ex: "Engineers drill wells up to three kilometres deep.", exVi: "Kỹ sư khoan các giếng sâu tới ba ki-lô-mét.", more: "**drill for** oil / gas · drill a well / hole" },
          { w: "raw material", pos: "n", ipa: "/ˌrɔː məˈtɪəriəl/", vi: "nguyên liệu thô", ex: "Recycling reduces the need for new raw materials.", exVi: "Tái chế làm giảm nhu cầu nguyên liệu thô mới.", more: "import / process **raw materials** · hay gặp ở Task 1 dạng quy trình" },
          { w: "sustainable", pos: "adj", ipa: "/səˈsteɪnəbl/", vi: "bền vững", ex: "Sustainable development meets today's needs without harming future generations.", exVi: "Phát triển bền vững đáp ứng nhu cầu hôm nay mà không gây hại thế hệ sau.", more: "**sustainable** development / energy / farming · sustainability (n) · ≠ unsustainable · sustain (v)" },
          { w: "conserve", pos: "v", ipa: "/kənˈsɜːv/", vi: "tiết kiệm, giữ gìn (tài nguyên)", ex: "Simple habits such as shorter showers help to conserve water.", exVi: "Thói quen đơn giản như tắm nhanh hơn giúp tiết kiệm nước.", more: "(Ngày 22: conserve wildlife — hôm nay: tiết kiệm tài nguyên) **conserve** energy / water / resources · conservation (n) · ≠ waste" },
          { w: "greenhouse gas", pos: "n", ipa: "/ˌɡriːnhaʊs ˈɡæs/", vi: "khí nhà kính", ex: "Burning coal releases large amounts of greenhouse gases.", exVi: "Đốt than thải ra lượng lớn khí nhà kính.", more: "**emit / release** greenhouse gases · greenhouse gas **emissions** · the greenhouse effect" },
          { w: "carbon-neutral", pos: "adj", ipa: "/ˌkɑːbən ˈnjuːtrəl/", vi: "trung hoà carbon", ex: "The city aims to become carbon-neutral by 2040.", exVi: "Thành phố đặt mục tiêu trung hoà carbon vào năm 2040.", more: "become / go **carbon-neutral** · reach **net zero** (emissions) · low-carbon (adj)" },
        ],
      },
      {
        t: "table",
        caption: "Họ từ cần đổi được (hay ra ở bài điền dạng từ và giúp paraphrase)",
        head: ["Động từ", "Danh từ", "Tính từ"],
        rows: [
          ["consume", "consumption · consumer", "—"],
          ["generate", "generation · generator", "—"],
          ["renew", "renewal · renewables", "renewable"],
          ["sustain", "sustainability", "sustainable"],
          ["deplete", "depletion", "depleted"],
          ["extract", "extraction", "—"],
          ["conserve", "conservation", "—"],
          ["insulate", "insulation", "insulated"],
          ["—", "efficiency", "efficient"],
          ["—", "scarcity", "scarce"],
          ["—", "abundance", "abundant"],
          ["rely (on)", "reliance · reliability", "reliable · reliant (on)"],
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai với nhóm từ này", items: [
        "**energy** không đếm được: ~~energies~~, ~~an energy~~ → renewable **energy**, a source **of** energy. (Số nhiều chỉ dùng trong “renewable energies” kiểu kỹ thuật — khi thi tránh.)",
        "**electricity** ≠ **electric** ≠ **electrical**: electricity (n) = điện; an electric car / heater (chạy bằng điện); electrical appliances / engineering (liên quan đến điện).",
        "**power** (điện, năng lượng) ≠ **strength**: solar power, a power station. ~~solar strength~~",
        "~~save the energy~~ → **save energy** (nói chung, không the). ~~waste of energy~~ ✔ (danh từ) nhưng động từ: **waste** energy.",
        "**demand for**, **reliance on**, **access to**, **shortage of**: mỗi danh từ một giới từ — học cả cụm.",
        "**economic** (thuộc kinh tế) ≠ **economical** (tiết kiệm): an economical car = xe ít tốn xăng.",
      ] },

      { t: "h", text: "4. Mười hai cụm dùng ngay trong Task 2 và Part 3" },
      {
        t: "vocab",
        items: [
          { w: "meet the demand for", pos: "phr", ipa: "/miːt ðə dɪˈmɑːnd fə/", vi: "đáp ứng nhu cầu về", ex: "Renewables alone cannot yet meet the demand for electricity in large cities.", exVi: "Chỉ riêng năng lượng tái tạo chưa thể đáp ứng nhu cầu điện ở các thành phố lớn.", more: "meet the **growing / rising** demand for energy" },
          { w: "reliance on", pos: "phr", ipa: "/rɪˈlaɪəns ɒn/", vi: "sự phụ thuộc vào", ex: "Governments should reduce their reliance on imported oil.", exVi: "Các chính phủ nên giảm phụ thuộc vào dầu nhập khẩu.", more: "**reduce our reliance / dependence on** fossil fuels · rely on (v) · be reliant on" },
          { w: "switch to", pos: "phr v", ipa: "/swɪtʃ tuː/", vi: "chuyển sang", ex: "Many households would switch to solar power if the panels were cheaper.", exVi: "Nhiều hộ sẽ chuyển sang điện mặt trời nếu pin rẻ hơn.", more: "**switch (from A) to** B · make the switch to renewables · = shift to / move to" },
          { w: "run out of", pos: "phr v", ipa: "/rʌn aʊt əv/", vi: "hết, cạn (cái gì)", ex: "Some scientists warn that we may run out of fresh water before we run out of oil.", exVi: "Một số nhà khoa học cảnh báo ta có thể hết nước ngọt trước khi hết dầu.", more: "We are **running out of** time. · Oil will **run out**. (không tân ngữ thì bỏ of)" },
          { w: "energy bill", pos: "n", ipa: "/ˈenədʒi bɪl/", vi: "hoá đơn năng lượng (điện, gas)", ex: "Better insulation is the quickest way to cut energy bills.", exVi: "Cách nhiệt tốt hơn là cách nhanh nhất để giảm hoá đơn năng lượng.", more: "**cut / reduce / lower** energy bills · rising energy bills · an electricity bill" },
          { w: "energy security", pos: "n", ipa: "/ˌenədʒi sɪˈkjʊərəti/", vi: "an ninh năng lượng", ex: "Producing power at home improves a country's energy security.", exVi: "Tự sản xuất điện trong nước cải thiện an ninh năng lượng của quốc gia.", more: "**improve / threaten** energy security · an energy crisis = khủng hoảng năng lượng" },
          { w: "invest in clean energy", pos: "phr", ipa: "/ɪnˈvest ɪn kliːn ˈenədʒi/", vi: "đầu tư vào năng lượng sạch", ex: "Countries that invest in clean energy today will pay less for power tomorrow.", exVi: "Nước nào đầu tư vào năng lượng sạch hôm nay sẽ trả ít tiền điện hơn mai sau.", more: "clean / green / low-carbon energy · investment **in** (n)" },
          { w: "harness", pos: "v", ipa: "/ˈhɑːnɪs/", vi: "khai thác, tận dụng (sức gió, nước, nắng)", ex: "Coastal countries are well placed to harness the power of the wind.", exVi: "Các nước ven biển có vị trí thuận lợi để tận dụng sức gió.", more: "**harness the power of** the sun / wind / tides — cụm band 7 dùng được ngay" },
          { w: "alternative energy sources", pos: "phr", ipa: "/ɔːlˈtɜːnətɪv ˈenədʒi sɔːsɪz/", vi: "các nguồn năng lượng thay thế", ex: "Rising oil prices encourage companies to look for alternative energy sources.", exVi: "Giá dầu tăng thúc đẩy các công ty tìm nguồn năng lượng thay thế.", more: "an **alternative to** fossil fuels · alternative (n, adj)" },
          { w: "transition", pos: "n", ipa: "/trænˈzɪʃn/", vi: "sự chuyển đổi", ex: "The transition to renewable energy will take several decades.", exVi: "Việc chuyển đổi sang năng lượng tái tạo sẽ mất vài thập kỷ.", more: "the **transition (from A) to** B · the energy transition · a gradual / smooth transition" },
          { w: "environmentally friendly", pos: "adj", ipa: "/ɪnˌvaɪrənˈmentəli ˈfrendli/", vi: "thân thiện với môi trường", ex: "Wind power is environmentally friendly, but turbines can spoil the landscape.", exVi: "Điện gió thân thiện với môi trường, nhưng tua-bin có thể làm xấu cảnh quan.", more: "= eco-friendly, green · ≠ harmful to the environment · go green (thân mật) = sống xanh" },
          { w: "in the long run", pos: "phr", ipa: "/ɪn ðə ˈlɒŋ rʌn/", vi: "về lâu dài", ex: "Solar panels are expensive to install but save money in the long run.", exVi: "Pin mặt trời lắp thì đắt nhưng về lâu dài tiết kiệm tiền.", more: "= in the long term · ≠ in the short term / run — cặp đối lập rất hợp câu hỏi đánh giá (Ngày 23)" },
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "Although + S + V (nhược), S + V (ưu) + in the long run", vi: "Khung nhượng bộ (Ngày 21) cho chủ đề năng lượng", examples: [
            { en: "Although wind farms are costly to build, they reduce our reliance on fossil fuels in the long run.", vi: "Dù trang trại điện gió xây tốn kém, về lâu dài chúng giảm sự phụ thuộc vào nhiên liệu hoá thạch." },
          ] },
          { formula: "It is essential that + S + (should) + V + in order to + V", vi: "Khung giải pháp (Ngày 23)", examples: [
            { en: "It is essential that governments invest in storage in order to meet the growing demand for electricity.", vi: "Điều thiết yếu là chính phủ đầu tư vào lưu trữ để đáp ứng nhu cầu điện ngày càng tăng." },
          ] },
          { formula: "Unless + S + V, S + will + V", vi: "Khung cảnh báo", examples: [
            { en: "Unless we conserve water now, many cities will run out of it within a generation.", vi: "Trừ khi ta tiết kiệm nước ngay, nhiều thành phố sẽ cạn nước trong vòng một thế hệ." },
          ] },
        ],
      },
      { t: "rule", formula: "reduce our reliance on + N  ·  switch to + N  ·  meet the demand for + N  ·  run out of + N", vi: "Bốn cụm lõi của chủ đề — thuộc cả giới từ." },

      { t: "h", text: "5. Collocation Task 1 — 14 cụm tả số liệu" },
      { t: "p", text: "Ngày 14 bạn đã học collocation cho Task 2. Task 1 cũng có collocation riêng: giám khảo nghe “the number **increased sharply**”, “**accounted for** a quarter” là biết người viết quen văn tả số liệu. Band 5 hay viết đúng nghĩa nhưng **sai cặp** (~~increased strongly~~, ~~occupied 40%~~). Học cả cặp." },
      {
        t: "vocab",
        items: [
          { w: "account for", pos: "phr v", ipa: "/əˈkaʊnt fɔː/", vi: "chiếm (bao nhiêu phần)", ex: "Heating accounts for 42% of household energy use.", exVi: "Sưởi ấm chiếm 42% năng lượng dùng trong hộ gia đình.", more: "= make up, represent, constitute · KHÔNG dùng ~~occupy 42%~~ / ~~take 42%~~" },
          { w: "make up", pos: "phr v", ipa: "/meɪk ʌp/", vi: "tạo thành, chiếm", ex: "Cooking and lighting together make up only 15% of the total.", exVi: "Nấu ăn và chiếu sáng cộng lại chỉ chiếm 15% tổng.", more: "A and B **together make up**… · bị động: be made up of = gồm có" },
          { w: "the largest share", pos: "phr", ipa: "/ðə ˈlɑːdʒɪst ʃeə/", vi: "phần lớn nhất", ex: "Coal had the largest share of electricity generation in 2000.", exVi: "Than có phần lớn nhất trong sản xuất điện năm 2000.", more: "the largest / smallest **share / proportion of** · a significant / small proportion of" },
          { w: "stand at", pos: "phr v", ipa: "/stænd æt/", vi: "ở mức (một con số tại một thời điểm)", ex: "In 2000, the price stood at 10 cents per kilowatt-hour.", exVi: "Năm 2000, giá ở mức 10 xu mỗi kilowatt-giờ.", more: "**stood at** + số · = was · dùng cho điểm đầu / điểm cuối" },
          { w: "peak at", pos: "phr v", ipa: "/piːk æt/", vi: "đạt đỉnh ở mức", ex: "Coal output peaked at 130 terawatt-hours in 2005.", exVi: "Sản lượng than đạt đỉnh 130 terawatt-giờ vào năm 2005.", more: "**reach a peak of** + số · ≠ **hit a low of** + số (chạm đáy)" },
          { w: "rise steadily", pos: "phr", ipa: "/raɪz ˈstedəli/", vi: "tăng đều", ex: "The price rose steadily from 10 to 16 cents.", exVi: "Giá tăng đều từ 10 lên 16 xu.", more: "rise / fall + **steadily · sharply · slightly · gradually · dramatically** · KHÔNG ~~increase strongly~~" },
          { w: "a sharp increase in", pos: "phr", ipa: "/ə ʃɑːp ˈɪŋkriːs ɪn/", vi: "một mức tăng mạnh về", ex: "There was a sharp increase in wind and solar output.", exVi: "Có một mức tăng mạnh về sản lượng điện gió và mặt trời.", more: "a **sharp / steady / slight / gradual / dramatic** increase / rise / fall / decline **in** (không phải ~~of~~) + cái gì; **of** + con số: an increase of 20%" },
          { w: "remain stable", pos: "phr", ipa: "/rɪˈmeɪn ˈsteɪbl/", vi: "giữ ổn định", ex: "Nuclear output remained stable at 40 terawatt-hours.", exVi: "Sản lượng hạt nhân giữ ổn định ở 40 terawatt-giờ.", more: "remain **stable / unchanged / constant / steady** at · level off at = chững lại ở" },
          { w: "threefold", pos: "adj, adv", ipa: "/ˈθriːfəʊld/", vi: "gấp ba lần", ex: "The table shows a threefold increase in investment.", exVi: "Bảng cho thấy đầu tư tăng gấp ba.", more: "a **twofold / threefold / tenfold increase in** · increase **fivefold** · = triple (v), treble (v) · double (v), halve (v)" },
          { w: "overtake", pos: "v", ipa: "/ˌəʊvəˈteɪk/", vi: "vượt qua", ex: "Gas overtook coal as the main source of electricity.", exVi: "Khí vượt than để thành nguồn điện chính.", more: "A **overtook** B (as…) · = surpass, exceed (Ngày 20) · quá khứ: overtook, overtaken" },
          { w: "the figure for", pos: "phr", ipa: "/ðə ˈfɪɡə fɔː/", vi: "con số của (hạng mục nào)", ex: "The figure for hydro was slightly higher, at 35.", exVi: "Con số của thuỷ điện cao hơn một chút, ở mức 35.", more: "**the figure for** + hạng mục · the figures for 2010 and 2020 · dùng để khỏi lặp tên đơn vị" },
          { w: "respectively", pos: "adv", ipa: "/rɪˈspektɪvli/", vi: "lần lượt (theo đúng thứ tự vừa nêu)", ex: "Cooking and lighting make up 8% and 7% respectively.", exVi: "Nấu ăn và chiếu sáng lần lượt chiếm 8% và 7%.", more: "đặt **cuối câu**, sau hai con số; chỉ dùng khi có đúng 2–3 mục khớp 2–3 số" },
          { w: "by contrast", pos: "phr", ipa: "/baɪ ˈkɒntrɑːst/", vi: "trái lại", ex: "By contrast, electricity from gas almost doubled.", exVi: "Trái lại, điện từ khí gần như tăng gấp đôi.", more: "= in contrast · **in contrast to** + N · đứng đầu câu, có dấu phẩy" },
          { w: "be projected to", pos: "phr", ipa: "/bi prəˈdʒektɪd tuː/", vi: "được dự báo sẽ", ex: "Water use is projected to fall to 120 litres per person by 2040.", exVi: "Mức dùng nước được dự báo giảm còn 120 lít mỗi người vào năm 2040.", more: "is **projected / expected / predicted / forecast to** + V · a projected fall to… (Ngày 5)" },
        ],
      },
      {
        t: "table",
        caption: "Ghép cặp đúng — động từ + trạng từ · tính từ + danh từ",
        head: ["Mức thay đổi", "Động từ + trạng từ", "Tính từ + danh từ"],
        rows: [
          ["rất mạnh", "rise / fall **dramatically · sharply**", "a **dramatic · sharp** rise / fall"],
          ["đáng kể", "increase / decrease **significantly · considerably**", "a **significant · considerable** increase / decrease"],
          ["đều", "grow / decline **steadily**", "a **steady** growth / decline"],
          ["từ từ", "climb / drop **gradually**", "a **gradual** climb / drop"],
          ["nhẹ", "rise / dip **slightly · marginally**", "a **slight · marginal** rise / dip"],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: sáu cặp sai hay gặp ở band 5", items: [
        "~~increase strongly / highly~~ → increase **sharply / significantly**.",
        "~~occupy / take 40%~~ → **account for / make up** 40%.",
        "~~an increase of electricity prices~~ → an increase **in** electricity prices; an increase **of** 9 cents.",
        "~~reach to 19 cents~~ → **reach** 19 cents (reach không có to); nhưng rise **to** 19 cents.",
        "~~the number of electricity~~ → the **amount** of electricity (không đếm được); the **number** of turbines (đếm được).",
        "~~8% and 7% respective~~ → …8% and 7% **respectively**.",
      ] },

      { t: "h", text: "6. Luyện tập" },
      {
        t: "mcq", id: "t3d24-tv-chon", title: "Chọn từ đúng (10 câu)",
        items: [
          { q: "Oil is a ___ resource: once it has been burned, it cannot be replaced.", options: ["finite", "abundant", "renewable", "sustainable"], correct: 0, why: "finite = có hạn; ba từ kia trái nghĩa với ý câu." },
          { q: "Extra electricity from rooftop panels can be sold back to the national ___.", options: ["pipeline", "turbine", "grid", "meter"], correct: 2, why: "the national grid = lưới điện quốc gia." },
          { q: "Good ___ keeps a house warm in winter and cuts heating bills.", options: ["consumption", "insulation", "extraction", "generation"], correct: 1, why: "insulation = lớp cách nhiệt." },
          { q: "Years of overfishing have ___ fish stocks in the region.", options: ["conserved", "supplied", "harnessed", "depleted"], correct: 3, why: "deplete stocks = làm cạn nguồn." },
          { q: "The government wants to reduce the country's ___ on imported gas.", options: ["demand", "reliance", "supply", "storage"], correct: 1, why: "reliance on = sự phụ thuộc vào." },
          { q: "Renewables cannot yet ___ the demand for electricity on windless winter evenings.", options: ["reach", "take", "meet", "do"], correct: 2, why: "meet the demand (for)." },
          { q: "Coastal nations are well placed to ___ the power of the tides.", options: ["harness", "deplete", "insulate", "consume"], correct: 0, why: "harness the power of = tận dụng sức." },
          { q: "Clean water is becoming ___ in many fast-growing cities.", options: ["abundant", "finite", "efficient", "scarce"], correct: 3, why: "scarce = khan hiếm." },
          { q: "A ___ station burns coal or gas to produce electricity.", options: ["strength", "power", "energy", "electric"], correct: 1, why: "a power station = nhà máy điện." },
          { q: "Solar panels are expensive to install, but they save money ___.", options: ["in the short term", "by contrast", "in the long run", "respectively"], correct: 2, why: "in the long run = về lâu dài." },
        ],
      },
      {
        t: "quiz", id: "t3d24-tv-dang-tu", title: "Viết dạng đúng của từ trong ngoặc (8 câu)", kind: "fill",
        items: [
          { q: "Energy ___ per person has fallen since 2010. (consume)", answers: ["consumption"] },
          { q: "Wind and solar are both ___ sources of energy. (renew)", answers: ["renewable"] },
          { q: "The ___ of natural resources is a threat to future generations. (deplete)", answers: ["depletion"] },
          { q: "Modern fridges are far more energy-___ than older models. (efficiency)", answers: ["efficient"] },
          { q: "Water ___ is already a serious problem in the region. (scarce)", answers: ["scarcity"] },
          { q: "The city wants to develop a more ___ transport system. (sustain)", answers: ["sustainable"] },
          { q: "Electricity ___ from coal halved over the period. (generate)", answers: ["generation"] },
          { q: "The ___ of oil from the sea bed is expensive and risky. (extract)", answers: ["extraction"] },
        ],
      },
      { t: "p", text: "Bài kế dùng hộp từ: **accounted · stood · peaked · steadily · sharp · threefold · respectively · contrast**. Mỗi từ dùng một lần." },
      {
        t: "quiz", id: "t3d24-tv-task1", title: "Collocation Task 1 — điền từ trong hộp (8 câu)", kind: "fill",
        items: [
          { q: "Heating ___ for almost half of the energy used at home.", answers: ["accounted"] },
          { q: "In 2000, the price of electricity ___ at 10 cents per unit.", answers: ["stood"] },
          { q: "The price rose ___ over the next ten years, by about half a cent each year.", answers: ["steadily"] },
          { q: "Sales ___ at 90,000 in 2018 before falling back.", answers: ["peaked"] },
          { q: "There was a ___ increase in wind output between 2015 and 2020.", answers: ["sharp"] },
          { q: "Investment went from $3 billion to $9 billion — a ___ increase.", answers: ["threefold"] },
          { q: "Flats and houses cost $900 and $2,100 to run ___.", answers: ["respectively"] },
          { q: "Coal output halved. By ___, the figure for gas almost doubled.", answers: ["contrast"] },
        ],
      },
      {
        t: "quiz", id: "t3d24-tu-vung-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "reduce reliance on · switch to · meet the demand for · account for",
        items: [
          { q: "Chúng ta cần giảm sự phụ thuộc vào nhiên liệu hoá thạch.", answers: ["We need to reduce our reliance on fossil fuels.", "We need to reduce our dependence on fossil fuels.", "We need to reduce reliance on fossil fuels.", "We need to reduce the reliance on fossil fuels.", "We need to reduce our reliance on fossil fuel."], hint: "reduce our reliance on fossil fuels" },
          { q: "Nhiều hộ gia đình đã chuyển sang điện mặt trời.", answers: ["Many households have switched to solar power.", "Many households have switched to solar energy.", "Many families have switched to solar power.", "Many households switched to solar power."], hint: "have switched to solar power" },
          { q: "Năng lượng tái tạo chưa thể đáp ứng nhu cầu về điện.", answers: ["Renewable energy cannot yet meet the demand for electricity.", "Renewable energy can't yet meet the demand for electricity.", "Renewable energy cannot meet the demand for electricity yet.", "Renewables cannot yet meet the demand for electricity.", "Renewable energy can't meet the demand for electricity yet."], hint: "cannot yet meet the demand for" },
          { q: "Sưởi ấm chiếm 42% lượng năng lượng dùng trong gia đình.", answers: ["Heating accounts for 42% of the energy used at home.", "Heating accounts for 42% of household energy use.", "Heating makes up 42% of the energy used at home.", "Heating accounts for 42% of the energy used in homes.", "Heating accounts for 42% of energy used at home.", "Heating makes up 42% of household energy use."], hint: "accounts for 42% of" },
          { q: "Có một mức tăng mạnh về giá điện.", answers: ["There was a sharp increase in electricity prices.", "There was a sharp increase in the price of electricity.", "There was a sharp rise in electricity prices.", "There was a sharp rise in the price of electricity.", "There was a dramatic increase in electricity prices."], hint: "There was a sharp increase in" },
        ],
      },
    ],
  },
  /* ═══════════════════════ BÀI 2 — VIẾT ═══════════════════════ */
  {
    id: "t3d24-viet",
    kind: "writing",
    title: "Task 1 mixed charts — hai hình khác loại trong một đề",
    goal: "Viết trọn một bài Task 1 band 6 cho đề có hai hình khác loại (bar + line; pie + table): mở bài hai câu, overview mỗi hình một ý, mỗi khổ thân bài một hình, mỗi hình chọn đúng thì — trong 20 phút, 160–190 từ.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "**Mixed charts** = một đề, **hai hình khác loại** (bar + line, pie + table, line + table…). Đây là dạng thứ 7 và cuối cùng của Task 1; sáu dạng đơn bạn đã viết ở Tập 2 và Tập 3 Ngày 4 · 8 · 12 · 16 · 20.",
          "Không có kỹ năng mới về đọc hình — chỉ có kỹ năng **tổ chức**: **mở bài 2 câu · overview mỗi hình 1 ý · mỗi khổ 1 hình · mỗi hình 1 thì**.",
          "Lỗi band 5 điển hình: tả hình 1 thật kỹ rồi hết giờ, hình 2 còn hai dòng; hoặc trộn số liệu hai hình vào một khổ; hoặc **tự bịa quan hệ nhân quả** giữa hai hình.",
          "**Chọn thì theo từng hình**: hình không có năm ⇒ hiện tại đơn; có năm quá khứ ⇒ quá khứ đơn; có năm dự báo ⇒ is projected to (Ngày 5).",
          "Dùng lại collocation bài 1: account for · stand at · peak at · a threefold increase · the figure for · respectively.",
          "Đẩy **TA** (overview rõ, phủ cả hai hình) và **CC** (chia đoạn logic) của band 6.",
        ],
      },

      { t: "h", text: "1. Band 5 và band 6 khác nhau ở đâu? (đề hai hình)" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 5", "Band 6"],
        rows: [
          ["TA", "Chỉ có overview cho một hình, hoặc không có; kể mọi số của hình 1, hình 2 sơ sài; thêm ý kiến / nguyên nhân", "Overview **phủ cả hai hình** (mỗi hình một ý); chọn số tiêu biểu **cân đối** giữa hai hình; không ý kiến"],
          ["CC", "Một khổ dài lẫn cả hai hình; chuyển hình không báo", "4 đoạn: mở – overview – hình 1 – hình 2; câu chuyển rõ (Turning to… · As for…)"],
          ["LR", "is / increased / decreased lặp; ~~occupied 42%~~", "accounted for · stood at · halved · fifteenfold · by far the largest · respectively"],
          ["GRA", "Thì lẫn lộn (hình quá khứ viết hiện tại); câu đơn nối bằng and", "Mỗi hình đúng thì của nó; có câu phức: while · whereas · despite · which · with + V-ing"],
        ],
      },
      { t: "note", title: "📌 Một phép thử band 5 hay 6", items: [
        "Che thân bài, chỉ đọc **overview**. Người đọc có biết đề có **hai** hình và mỗi hình nói điều chính gì không? Có ⇒ đang ở hướng band 6.",
        "Đếm số từ dành cho mỗi hình ở thân bài. Lệch quá 2 : 1 ⇒ bạn đã bỏ rơi một hình.",
      ] },

      { t: "h", text: "2. Đọc đề hai hình trong 3 phút — 5 câu hỏi" },
      { t: "p", text: "Với mỗi hình, bạn vẫn hỏi 4 câu quen thuộc của Tập 2 (hình nói về **cái gì** · **đơn vị** gì · **thời gian** nào · **điểm nổi bật** là gì). Đề hai hình thêm câu hỏi thứ năm: **hai hình liên quan thế nào?** Câu trả lời quyết định câu mở bài và từ nối giữa hai khổ — nhưng **không** cho phép bạn giải thích nguyên nhân." },
      {
        t: "sodo", kind: "flow", title: "3 phút đọc đề",
        steps: [
          { label: "1. Hình 1: cái gì · đơn vị · thời gian", sub: "ghi ngay THÌ sẽ dùng bên lề" },
          { label: "2. Hình 2: cái gì · đơn vị · thời gian", sub: "đơn vị thường KHÁC hình 1 (TWh ↔ cents; % ↔ $)" },
          { label: "3. Mối liên hệ", sub: "cùng nơi? cùng giai đoạn? cùng chủ đề? — chỉ để viết mở bài" },
          { label: "4. Mỗi hình 1 điểm nổi bật nhất", sub: "⇒ hai ý của overview" },
          { label: "5. Mỗi hình khoanh 4–6 số", sub: "tổng cả bài 8–12 số; cân giữa hai hình" },
        ],
      },
      {
        t: "table",
        caption: "Hai hình liên quan thế nào — và được viết gì",
        head: ["Quan hệ", "Ví dụ", "Được viết", "KHÔNG được viết"],
        rows: [
          ["Cùng chủ đề, cùng giai đoạn", "điện sản xuất theo nguồn + giá điện, 2000–2020", "…over the same period · At the same time, …", "~~The price rose **because** wind power is expensive.~~"],
          ["Tổng thể + chi tiết", "pie: cơ cấu dùng năng lượng · table: hoá đơn theo loại nhà", "The pie chart shows… and the table gives…", "~~Heating is the reason why bills are high.~~"],
          ["Hai mặt của một nhóm", "line: số khách · bar: lý do đến", "…while the bar chart shows why…", "suy diễn nhóm nào quan trọng hơn"],
          ["Gần như không liên quan", "pie: dùng nước ở nhà · line: lượng nước / người ở một thành phố", "tả riêng từng hình; nối bằng As for…", "ép một phép so sánh giữa hai hình"],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: Task 1 không hỏi “vì sao”", items: [
        "Hai hình đặt cạnh nhau rất dễ khiến bạn viết “this led to…”, “as a result…”. Đề chỉ bảo **summarise** và **make comparisons** — giải thích nguyên nhân là thông tin không có trong hình ⇒ trừ TA.",
        "Được phép nêu **sự trùng hợp về thời gian**: “Over the same period, prices almost doubled.” — đây là mô tả, không phải giải thích.",
        "Không so số của hai hình khác đơn vị (120 TWh với 10 cents) — nối Ngày 20: cột khác đơn vị không so ngang.",
      ] },

      { t: "h", text: "3. Mở bài hai câu (hoặc một câu ghép)" },
      { t: "p", text: "Đề đơn: mở bài một câu. Đề hai hình: **mỗi hình một mệnh đề** — viết thành hai câu, hoặc một câu ghép bằng **while / and**. Vẫn là paraphrase đề (Ngày 4): đổi động từ (shows → compares, illustrates, gives information about), đổi danh từ thành **mệnh đề danh ngữ** (how much… / how… — bài 1 Ngày 23)." },
      {
        t: "patterns",
        rows: [
          { formula: "The [hình 1] + V + N / Wh-clause, while the [hình 2] + V + N / Wh-clause.", vi: "Một câu ghép — gọn nhất, dùng khi mỗi vế không quá dài", examples: [
            { en: "The bar chart compares the amount of electricity generated from five sources in 2000 and 2020, while the line graph shows how much households paid for electricity over the same period.", vi: "Biểu đồ cột so sánh lượng điện sản xuất từ năm nguồn vào 2000 và 2020, còn biểu đồ đường cho thấy các hộ trả bao nhiêu tiền điện trong cùng giai đoạn." },
          ] },
          { formula: "The [hình 1] + V + … . The [hình 2] + V + … .", vi: "Hai câu rời — an toàn khi đề dài", examples: [
            { en: "The pie chart illustrates how an average household uses energy. The table gives the average yearly energy bill for three types of home in 2010 and 2020.", vi: "Biểu đồ tròn minh hoạ cách một hộ trung bình dùng năng lượng. Bảng cho biết hoá đơn năng lượng trung bình hằng năm của ba loại nhà vào 2010 và 2020." },
          ] },
          { formula: "The two charts give information about + N (chung) + in + nơi: the first shows…, and the second…", vi: "Mở bằng điểm chung rồi tách — nghe “tổng quát” hơn, hợp khi hai hình cùng chủ đề", examples: [
            { en: "The two charts give information about electricity in Norland: the first shows where it came from, and the second how its price changed.", vi: "Hai biểu đồ cho thông tin về điện ở Norland: hình thứ nhất cho thấy điện đến từ đâu, hình thứ hai cho thấy giá thay đổi thế nào." },
          ] },
        ],
      },
      {
        t: "table",
        caption: "Động từ mở bài — hình nào hợp động từ nào",
        head: ["Hình", "Động từ hợp", "Tránh"],
        rows: [
          ["bar chart", "compares · shows · gives information about", "~~describes~~ (hình không “mô tả”)"],
          ["line graph", "shows how… changed · illustrates changes in · tracks", "~~compares~~ nếu chỉ có một đường"],
          ["pie chart", "illustrates · shows the proportion of · breaks down… by…", "~~shows the number of~~ (pie là tỉ lệ)"],
          ["table", "gives · provides figures for · lists", "~~draws~~"],
        ],
      },
      { t: "note", title: "⚠️ Bốn lỗi mở bài của đề hai hình", items: [
        "Chỉ nhắc **một** hình: “The chart shows electricity in Norland.” ⇒ người đọc không biết còn hình kia.",
        "~~The bar chart and line graph shows…~~ → hai chủ ngữ ⇒ **show**. Tốt hơn: tách mỗi hình một động từ.",
        "Chép nguyên đề (giám khảo không tính số từ chép). Đổi ít nhất động từ + một cụm danh từ.",
        "~~The line graph shows how did the price change.~~ → how the price **changed** (mệnh đề danh ngữ, không đảo).",
      ] },
      { t: "rule", formula: "The bar chart + compares + N, while the line graph + shows + how + S + V.", vi: "Mở bài đề hai hình: mỗi hình một mệnh đề, nối bằng while; không số liệu." },
      {
        t: "quiz", id: "t3d24-mo-bai-dich", title: "Dịch Việt → Anh — câu mở bài (4 câu)", kind: "translate", grammar: "The [hình] + V + N / Wh-clause, while the [hình] + V + …",
        items: [
          { q: "Biểu đồ tròn cho thấy nước được dùng thế nào trong một hộ gia đình điển hình.", answers: ["The pie chart shows how water is used in a typical household.", "The pie chart illustrates how water is used in a typical household.", "The pie chart shows how water is used in a typical home.", "The pie chart illustrates how water is used in a typical home."], hint: "shows how water is used (bị động, hiện tại)" },
          { q: "Biểu đồ đường cho thấy giá điện thay đổi thế nào từ năm 2000 đến 2020.", answers: ["The line graph shows how the price of electricity changed between 2000 and 2020.", "The line graph shows how electricity prices changed between 2000 and 2020.", "The line graph shows how the price of electricity changed from 2000 to 2020.", "The line graph shows how electricity prices changed from 2000 to 2020.", "The line graph illustrates how the price of electricity changed between 2000 and 2020."], hint: "shows how the price… changed between… and…" },
          { q: "Bảng cho biết hoá đơn năng lượng trung bình của ba loại nhà.", answers: ["The table gives the average energy bill for three types of home.", "The table gives the average energy bill for three types of house.", "The table gives the average energy bills for three types of home.", "The table shows the average energy bill for three types of home.", "The table gives the average energy bill for three types of homes."], hint: "The table gives the average energy bill for" },
          { q: "Biểu đồ cột so sánh lượng điện được sản xuất từ năm nguồn, còn biểu đồ đường cho thấy giá của nó.", answers: ["The bar chart compares the amount of electricity generated from five sources, while the line graph shows its price.", "The bar chart compares the amount of electricity produced from five sources, while the line graph shows its price.", "The bar chart compares the amount of electricity generated from five sources while the line graph shows its price.", "The bar chart compares the amount of electricity generated from five sources, and the line graph shows its price."], hint: "compares the amount of electricity generated from…, while…" },
        ],
      },

      { t: "h", text: "4. Overview — mỗi hình một ý" },
      { t: "p", text: "Overview của đề đơn (Ngày 4) chọn **2 điểm** nổi bật của một hình. Ở đề hai hình, bạn chọn **mỗi hình 1 điểm** (nhiều nhất 2 nếu hình đó phức tạp). Viết 2 câu: câu đầu mở bằng **Overall,** cho hình 1; câu sau mở bằng **At the same time, / It is also clear that / As for the…** cho hình 2. Không số liệu." },
      {
        t: "patterns",
        rows: [
          { formula: "Overall, + [ý chính hình 1]. At the same time, + [ý chính hình 2].", vi: "Hai hình cùng giai đoạn", examples: [
            { en: "Overall, the country moved away from coal towards gas and, in particular, wind and solar power. At the same time, the price of electricity almost doubled.", vi: "Nhìn chung, đất nước chuyển từ than sang khí và đặc biệt là điện gió – mặt trời. Đồng thời, giá điện tăng gần gấp đôi." },
          ] },
          { formula: "Overall, + [ý chính hình 1], while + [ý phụ]. It is also clear that + [ý chính hình 2].", vi: "Hình 1 cần hai vế; hình 2 một nhận định (It is clear that — Ngày 23)", examples: [
            { en: "Overall, heating is responsible for the largest share of household energy use, while lighting and cooking take very little. It is also clear that bills rose for every type of home.", vi: "Nhìn chung, sưởi ấm chiếm phần lớn nhất năng lượng hộ gia đình, còn chiếu sáng và nấu ăn rất ít. Cũng rõ ràng là hoá đơn tăng ở mọi loại nhà." },
          ] },
        ],
      },
      { t: "note", title: "💡 Mẹo tìm ý overview cho từng loại hình (ôn nhanh)", items: [
        "**bar không thời gian**: nhóm cao nhất – thấp nhất. **bar hai năm**: nhóm nào tăng, nhóm nào giảm, ai đổi ngôi (Ngày 12).",
        "**line**: xu hướng chung + điểm cắt / đỉnh (Ngày 8).",
        "**pie**: miếng lớn nhất + nhóm các miếng nhỏ (Ngày 16).",
        "**table**: hàng / cột Total trước, rồi lớn nhất – nhỏ nhất (Ngày 20).",
      ] },
      { t: "rule", formula: "Overall, + ý hình 1.  At the same time / It is also clear that + ý hình 2.", vi: "Overview hai câu, mỗi hình một ý, không số." },

      { t: "h", text: "5. Mỗi khổ một hình — mỗi hình một thì" },
      { t: "p", text: "Thân bài chia **hai khổ, mỗi khổ một hình**. Đừng trộn — giám khảo phải biết mỗi con số thuộc hình nào. Khổ thứ hai luôn mở bằng một **câu chuyển** để báo đổi hình. Và trước khi viết mỗi khổ, nhìn lại chữ ghi bên lề: hình này dùng **thì** gì?" },
      {
        t: "table",
        caption: "Chọn thì theo từng hình",
        head: ["Hình có gì", "Thì", "Ví dụ"],
        rows: [
          ["Không có năm / “a typical household”", "hiện tại đơn", "Heating **accounts** for 42%."],
          ["Một hay nhiều năm đã qua", "quá khứ đơn", "Coal **was** the largest source in 2000."],
          ["Hai mốc quá khứ, nhìn từ mốc sau", "quá khứ hoàn thành + by", "This figure **had halved** by 2020."],
          ["Từ quá khứ tới nay (… to the present)", "hiện tại hoàn thành", "Prices **have risen** since 2015."],
          ["Có năm tương lai / “projected”", "is projected / expected to · will", "Use **is projected to fall** to 120 litres by 2040."],
        ],
      },
      {
        t: "table",
        caption: "Câu chuyển sang hình thứ hai",
        head: ["Câu chuyển", "Ghi chú"],
        rows: [
          ["**Turning to the line graph,** households paid…", "phổ biến, an toàn"],
          ["**As for the table,** a detached house was…", "ngắn"],
          ["**Regarding the price of electricity,** it stood at…", "chuyển theo chủ đề thay vì tên hình"],
          ["**According to the pie chart,** heating accounts for…", "dùng mở khổ 1 cũng được"],
          ["**The line graph shows that** water use fell…", "that-clause — Ngày 23"],
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Khung 4 đoạn của đề hai hình",
        cols: [
          { title: "Đoạn 1 — Mở bài", items: ["1 câu ghép (while) hoặc 2 câu", "paraphrase cả hai hình", "≈ 30–35 từ"] },
          { title: "Đoạn 2 — Overview", items: ["Overall, ý hình 1", "At the same time, ý hình 2", "không số · ≈ 30–40 từ"] },
          { title: "Đoạn 3 — Hình 1", items: ["4–6 số · đúng thì hình 1", "so sánh trong hình", "≈ 50–60 từ"] },
          { title: "Đoạn 4 — Hình 2", items: ["Turning to… + 4–6 số", "đúng thì hình 2", "≈ 45–55 từ · KHÔNG kết luận"] },
        ],
      },
      {
        t: "mcq", id: "t3d24-viet-thi", title: "Hình nào — thì nào? (5 câu)",
        items: [
          { q: "Pie chart: “How a typical family spends its income” (không ghi năm). Câu nào đúng thì?", options: ["Housing took up a third of income.", "Housing takes up a third of income.", "Housing has taken up a third of income.", "Housing will take up a third of income."], correct: 1, why: "Không có năm ⇒ hiện tại đơn." },
          { q: "Table: số liệu năm 2010 và 2020. Câu nào đúng?", options: ["Flats are the cheapest, at $900 and $1,150.", "Flats have been the cheapest, at $900 and $1,150.", "Flats will be the cheapest, at $900 and $1,150.", "Flats were the cheapest, at $900 and $1,150."], correct: 3, why: "Hai năm đã qua ⇒ quá khứ đơn." },
          { q: "Line graph 2000–2040, trong đó 2030 và 2040 là dự báo. Câu nào đúng cho năm 2040?", options: ["Water use is projected to fall to 120 litres.", "Water use fell to 120 litres.", "Water use falls to 120 litres.", "Water use had fallen to 120 litres."], correct: 0, why: "Năm tương lai ⇒ is projected to + V." },
          { q: "Bar chart năm 2000 và 2020. Chọn câu dùng đúng quá khứ hoàn thành:", options: ["Coal had halved in 2000.", "By 2020, coal output had halved.", "Coal has halved by 2020.", "By 2020, coal output halves."], correct: 1, why: "By + mốc quá khứ sau ⇒ had + V3." },
          { q: "Đề có pie (không năm) + table (2010, 2020). Bài viết sẽ dùng:", options: ["chỉ hiện tại đơn cho cả bài", "chỉ quá khứ đơn cho cả bài", "hiện tại cho pie, quá khứ cho table", "tương lai cho table"], correct: 2, why: "Mỗi hình chọn thì riêng." },
        ],
      },

      { t: "h", text: "6. Đề mẫu 1 (bar + line) — phân tích và dàn ý" },
      { t: "p", text: "**Đề:** The bar chart below shows the amount of electricity generated from five sources in Norland in 2000 and 2020. The line graph shows the average price of electricity paid by households in Norland between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words." },
      {
        t: "chart", kind: "bar", title: "Electricity generated in Norland by source, 2000 and 2020", unit: "terawatt-hours (TWh)",
        labels: ["Coal", "Gas", "Nuclear", "Hydro", "Wind & solar"],
        series: [
          { name: "2000", values: [120, 50, 40, 30, 5] },
          { name: "2020", values: [60, 90, 40, 35, 75] },
        ],
      },
      {
        t: "chart", kind: "line", title: "Average household electricity price in Norland, 2000–2020", unit: "cents per kWh",
        labels: ["2000", "2005", "2010", "2015", "2020"],
        series: [{ name: "Price", values: [10, 12, 16, 15, 19] }],
      },
      {
        t: "table",
        caption: "5 câu hỏi đọc đề — làm mẫu",
        head: ["Câu hỏi", "Hình 1 (bar)", "Hình 2 (line)"],
        rows: [
          ["Cái gì?", "lượng điện sản xuất theo 5 nguồn", "giá điện hộ gia đình"],
          ["Đơn vị?", "TWh (terawatt-hours)", "cents per kWh"],
          ["Thời gian → thì?", "2000 và 2020 → quá khứ (+ had V3 by 2020)", "2000–2020, 5 mốc → quá khứ"],
          ["Điểm nổi bật?", "than giảm một nửa; khí lên đầu; gió – mặt trời tăng 15 lần; tổng 245 → 300", "gần gấp đôi (10 → 19), có một lần giảm nhẹ (2015)"],
          ["Liên hệ?", "cùng nước, cùng giai đoạn", "⇒ “over the same period”, “At the same time” — KHÔNG “because”"],
        ],
      },
      {
        t: "table",
        caption: "Tính nhẩm trước khi viết (nối Ngày 11 · 20)",
        head: ["Số trong hình", "Tính ra", "Viết thành"],
        rows: [
          ["Coal 120 → 60", "÷ 2", "halved · fell by half"],
          ["Gas 50 → 90", "× 1,8", "almost doubled · rose from 50 to 90"],
          ["Wind & solar 5 → 75", "× 15", "increased fifteenfold · a fifteenfold increase"],
          ["Nuclear 40 → 40", "0", "remained unchanged at 40"],
          ["Hydro 30 → 35", "+5", "a slight rise to 35"],
          ["Tổng 245 → 300", "+55", "total output rose (số tự cộng — có thể nêu “from about 245 to 300”)"],
          ["Price 10 → 19", "× 1,9", "almost doubled"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Dàn ý 4 đoạn — viết ra nháp trong 2 phút",
        steps: [
          { label: "Mở bài", sub: "bar compares electricity from 5 sources 2000 / 2020, while line shows household price, same period" },
          { label: "Overview", sub: "coal → gas + wind & solar, total up · price almost doubled despite small fall" },
          { label: "Thân 1 (bar)", sub: "coal 120 → halved · gas 50 → 90 leading · wind & solar 5 → 75 · nuclear 40 = · hydro 35" },
          { label: "Thân 2 (line)", sub: "10 (2000) → steadily 16 (2010) → dip 15 (2015) → peak 19 (2020)" },
        ],
      },

      { t: "h", text: "7. Hai bài mẫu đặt cạnh nhau: band 5 và band 6" },
      { t: "p", text: "Cùng đề Norland. Đọc bản band 5 trước và tự tìm: overview ở đâu? thì đúng chưa? có câu nào **không có trong hình**? Rồi đọc bản band 6." },
      {
        t: "passage", title: "Bài mẫu band 5 (ước tính) — 165 từ",
        paras: [
          { text: "The bar chart show the electricity from five sources in Norland in 2000 and 2020 and the line graph show the price of electricity." },
          { text: "In 2000, coal is 120 TWh, gas is 50 TWh, nuclear is 40 TWh, hydro is 30 TWh and wind and solar is 5 TWh. In 2020, coal is 60 TWh, gas is 90 TWh, nuclear is 40 TWh, hydro is 35 TWh and wind and solar is 75 TWh. So coal decreased and gas increased and wind and solar increased very strongly. The price was 10 cents in 2000 and 12 cents in 2005. Then it increase to 16 cents in 2010 and decrease to 15 cents in 2015 and it was 19 cents in 2020." },
          { text: "In conclusion, the electricity in Norland changed a lot and the price is more expensive because wind and solar energy is very expensive to build. I think the government should control the price so that poor people can pay their electricity bill every month." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 6 – 6.5 (ước tính) — 175 từ",
        paras: [
          { text: "The bar chart compares the amount of electricity that Norland generated from five sources in 2000 and 2020, while the line graph shows how much households paid for electricity over the same period." },
          { text: "Overall, the country moved away from coal towards gas and, in particular, wind and solar power, and total output rose. At the same time, the price of electricity almost doubled, despite a small fall in the middle of the period." },
          { text: "In 2000, coal was by far the largest source, at 120 terawatt-hours, but this figure had halved by 2020. By contrast, electricity from gas rose from 50 to 90 terawatt-hours, making it the leading source, and wind and solar output increased fifteenfold, from only 5 to 75. Nuclear power remained unchanged at 40, and hydro saw only a slight rise, to 35." },
          { text: "Turning to the line graph, households paid 10 cents per kilowatt-hour in 2000. The price then climbed steadily to 16 cents in 2010, dipped slightly to 15 cents five years later, and reached a peak of 19 cents in 2020." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
        rows: [
          ["TA", "Không có overview (đoạn “In conclusion” chỉ nói “changed a lot”); liệt kê **đủ 15 số** không chọn lọc; thêm **nguyên nhân** (“because wind and solar is expensive”) và **ý kiến** (“the government should…”) — không có trong hình", "Overview riêng, phủ **cả hai hình**; 11 số có chọn lọc; có so sánh (by far the largest · halved · fifteenfold); không ý kiến, không nguyên nhân"],
          ["CC", "Hai hình nhồi **một khổ**, chuyển hình không báo (“The price was…”); nối bằng and / then / so", "4 đoạn: mở – overview – bar – line; từ nối đa dạng: while · At the same time · By contrast · Turning to · then"],
          ["LR", "is ×10 · increased / decreased lặp · ~~increased very strongly~~", "moved away from · by far the largest · halved · fifteenfold · remained unchanged · climbed steadily · dipped slightly · reached a peak of"],
          ["GRA", "Sai chia: ~~chart show~~ · ~~it increase~~; hình quá khứ viết **hiện tại** (coal is 120); toàn câu đơn", "Quá khứ nhất quán + **had halved by 2020**; câu phức: while… · despite + N · making it… (V-ing) · mệnh đề danh ngữ how much households paid"],
        ],
      },
      { t: "note", title: "💡 Bài band 6 vẫn chưa phải band 7 — vì sao?", items: [
        "Thân 2 tả đường giá **theo từng mốc** (2000 → 2010 → 2015 → 2020) hơi máy móc; band 7 sẽ gom: “rose in every five-year period except 2010–2015”.",
        "Chưa nêu con số tổng (245 → 300) dù overview nói total output rose; band 7 sẽ chống đỡ nhận định bằng số.",
        "Từ nối đủ loại nhưng còn “đúng sách”. Đó chính là mô tả CC band 6 — và hoàn toàn đủ cho mục tiêu Tập 3.",
      ] },
      {
        t: "quiz", id: "t3d24-viet-dien-mau", title: "Gập bài mẫu band 6 lại — điền từ còn thiếu (8 chỗ trống)", kind: "fill",
        items: [
          { q: "The bar chart compares the amount of electricity…, ___ the line graph shows how much households paid.", answers: ["while", "whereas"] },
          { q: "…how much households paid for electricity over the ___ period.", answers: ["same"] },
          { q: "Overall, the country moved ___ from coal towards gas.", answers: ["away"] },
          { q: "…the price of electricity almost doubled, ___ a small fall in the middle of the period.", answers: ["despite"] },
          { q: "In 2000, coal was by ___ the largest source.", answers: ["far"] },
          { q: "…but this figure had ___ by 2020. (120 → 60)", answers: ["halved"] },
          { q: "Nuclear power remained ___ at 40.", answers: ["unchanged", "stable", "constant", "steady"] },
          { q: "___ to the line graph, households paid 10 cents per kilowatt-hour in 2000.", answers: ["Turning"] },
        ],
      },

      { t: "h", text: "8. Đề mẫu 2 (pie + table) — hai hình, hai thì" },
      { t: "p", text: "**Đề:** The pie chart shows how energy is used in an average household in Westland. The table shows the average annual energy bill for three types of home in Westland in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant." },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Energy use in an average Westland household (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Heating", value: 42 },
            { label: "Appliances & electronics", value: 20 },
            { label: "Hot water", value: 18 },
            { label: "Cooking", value: 8 },
            { label: "Lighting", value: 7 },
            { label: "Other", value: 5 },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "table",
          title: "Average annual energy bill by type of home in Westland, 2010 and 2020 ($)",
          note: "Số liệu tự đặt cho bài luyện.",
          unit: "dollars per year",
          categories: ["2010", "2020"],
          series: [
            { name: "Flat", values: [900, 1150] },
            { name: "Terraced house", values: [1300, 1600] },
            { name: "Detached house", values: [2100, 2700] },
          ],
        },
      },
      {
        t: "table",
        caption: "Đọc đề — điểm khác đề mẫu 1",
        head: ["", "Pie", "Table"],
        rows: [
          ["Thì", "không có năm ⇒ **hiện tại đơn**", "2010, 2020 ⇒ **quá khứ đơn**"],
          ["Đơn vị", "% của năng lượng dùng", "đô-la / năm"],
          ["Điểm nổi bật", "heating 42% — hơn gấp đôi mục thứ nhì; cooking + lighting rất nhỏ", "mọi loại nhà đều tăng; nhà càng lớn hoá đơn càng cao; detached tăng nhiều nhất ($600)"],
          ["Liên hệ", "tổng thể (dùng vào đâu) + chi tiết (trả bao nhiêu)", "KHÔNG viết “bills are high because of heating”"],
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 6 – 6.5 (ước tính) — 161 từ",
        paras: [
          { text: "The pie chart illustrates how an average household in Westland uses energy, and the table gives the average yearly energy bill for three types of home in 2010 and 2020." },
          { text: "Overall, heating is responsible for the largest share of household energy use, while lighting and cooking take very little. It is also clear that bills rose for every type of home, and that larger homes cost considerably more to run." },
          { text: "According to the pie chart, heating accounts for 42% of the energy used, which is more than twice the figure for appliances (20%) and hot water (18%). Cooking and lighting make up only 8% and 7% respectively, and the remaining 5% is used for other purposes." },
          { text: "As for the table, a detached house was the most expensive to run in both years, with the bill climbing from $2,100 to $2,700. Terraced houses cost $1,300 in 2010 and $1,600 a decade later, whereas flats remained the cheapest, at $900 and $1,150 respectively." },
        ],
      },
      { t: "note", title: "📌 Soi bài mẫu 2", items: [
        "**Thì**: đoạn 3 toàn hiện tại (accounts · make up · is used); đoạn 4 toàn quá khứ (was · cost · remained). Overview trộn đúng: heating **is**… / bills **rose**.",
        "**Mệnh đề danh ngữ** (Ngày 23): how an average household uses energy · It is also clear **that** bills rose…, and **that** larger homes cost…",
        "**Collocation bài 1**: is responsible for the largest share · accounts for · the figure for · make up… respectively.",
        "**with + N + V-ing** (with the bill climbing from… to…) — một cách gắn số liệu vào câu rất gọn, đáng học thuộc.",
        "Không có câu nào nối nhân quả giữa pie và table.",
      ] },
      {
        t: "mcq", id: "t3d24-viet-chon", title: "Chọn câu tốt nhất (6 câu — theo hai đề mẫu)",
        items: [
          { q: "Mở bài tốt nhất cho đề Westland:", options: ["The pie chart shows energy.", "The pie chart and the table shows information about Westland.", "The pie chart illustrates how an average household in Westland uses energy, and the table gives yearly energy bills for three types of home in 2010 and 2020.", "In this essay I will describe a pie chart and a table about energy."], correct: 2, why: "Nhắc cả hai hình, mỗi hình một động từ, có paraphrase. B sai hoà hợp (shows); D là mở bài luận, không phải Task 1." },
          { q: "Overview tốt nhất cho đề Norland:", options: ["Overall, coal was 120 and the price was 10 cents.", "Overall, the country relied less on coal and more on gas and renewables, while electricity became considerably more expensive.", "Overall, there are two charts with many numbers.", "Overall, prices rose because renewable energy is costly."], correct: 1, why: "Mỗi hình một ý, không số, không nguyên nhân." },
          { q: "Câu nào KHÔNG nên có trong bài Task 1 này?", options: ["Nuclear power remained unchanged at 40 terawatt-hours.", "The price reached a peak of 19 cents in 2020.", "Gas overtook coal as the leading source.", "This shows that green energy makes electricity too expensive for families."], correct: 3, why: "Suy diễn nhân quả + đánh giá — không có trong hình." },
          { q: "Câu chuyển sang hình thứ hai tốt nhất:", options: ["Turning to the line graph, the price stood at 10 cents in 2000.", "Next I will talk about the second picture.", "And the price was 10 cents.", "Secondly, the line."], correct: 0, why: "Turning to + tên hình, rồi vào số liệu ngay." },
          { q: "Câu nào dùng collocation ĐÚNG?", options: ["Heating occupies 42% of energy use.", "Wind output increased strongly.", "Heating accounts for 42% of energy use.", "The price reached to 19 cents."], correct: 2, why: "account for + %; increase sharply; reach + số (không to)." },
          { q: "Bài viết 4 đoạn, đoạn về hình 1 dài 95 từ, đoạn về hình 2 dài 20 từ. Vấn đề chính:", options: ["Thiếu kết luận", "Bài quá dài", "Dùng quá nhiều số", "Hình 2 bị bỏ rơi — TA chưa “phủ đủ đặc điểm chính”"], correct: 3, why: "Hai hình phải cân đối; Task 1 không cần kết luận." },
        ],
      },

      { t: "h", text: "9. Lỗi mất điểm + bảng tự soát 2 phút" },
      {
        t: "table",
        head: ["Lỗi", "Vì sao mất điểm", "Sửa"],
        rows: [
          ["Mở bài chỉ nhắc một hình", "TA: chưa giới thiệu đủ đề", "mỗi hình một mệnh đề, nối while"],
          ["Overview chỉ cho một hình", "TA: overview không đủ", "Overall, … At the same time, …"],
          ["Trộn số hai hình một khổ", "CC: không rõ số thuộc hình nào", "mỗi khổ một hình + câu chuyển"],
          ["Một thì cho cả bài", "GRA: sai thì có hệ thống", "ghi thì của từng hình bên lề trước khi viết"],
          ["Giải thích nguyên nhân / nêu ý kiến", "TA: thông tin ngoài hình", "chỉ dùng at the same time / over the same period"],
          ["Hình 1 dài, hình 2 hai dòng", "TA: bỏ đặc điểm chính", "chia giờ: 3’ đọc · 7’ hình 1 · 7’ hình 2 · 3’ soát"],
          ["So số khác đơn vị giữa hai hình", "TA: so sánh vô nghĩa", "chỉ so trong cùng một hình"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "20 phút cho đề hai hình",
        steps: [
          { label: "0–3’", sub: "đọc 2 hình · ghi thì · khoanh 8–12 số · 2 ý overview" },
          { label: "3–6’", sub: "mở bài (while) + overview 2 câu" },
          { label: "6–12’", sub: "khổ hình 1" },
          { label: "12–17’", sub: "Turning to… khổ hình 2" },
          { label: "17–20’", sub: "soát: thì từng khổ · -s số ít · giới từ số liệu · đủ 150 từ" },
        ],
      },
      { t: "note", title: "💡 Mẹo soát 2 phút cuối", items: [
        "Gạch dưới **mọi động từ** của khổ 3 rồi khổ 4: mỗi khổ có cùng một thì không?",
        "Đếm tên hình: “bar chart / pie chart” và “line graph / table” đều phải xuất hiện ở mở bài **và** thân bài.",
        "Tìm chữ **because / so / as a result / I think** — thấy thì xoá.",
        "Giới từ số liệu: rose **from** 50 **to** 90 · **at** 120 · an increase **of** 9 cents · an increase **in** price.",
      ] },

      { t: "h", text: "10. Tự viết — AI chấm 4 tiêu chí" },
      { t: "p", text: "Bấm giờ **20 phút**. Đề có ba “thì”: pie không có năm; line có năm đã qua (2000–2020) **và** năm dự báo (2030, 2040). Viết xong mới xem gợi ý bên dưới." },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "How water is used in a typical home in Ashby (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Showers and baths", value: 34 },
            { label: "Toilet flushing", value: 26 },
            { label: "Washing clothes", value: 15 },
            { label: "Kitchen (cooking, dishes)", value: 14 },
            { label: "Garden", value: 7 },
            { label: "Other", value: 4 },
          ],
        },
      },
      {
        t: "chart", kind: "line", title: "Average daily water use per person in Ashby, 2000–2040 (2030 and 2040 are projections)", unit: "litres per person per day",
        labels: ["2000", "2010", "2020", "2030", "2040"],
        series: [{ name: "Water use", values: [165, 158, 142, 130, 120] }],
      },
      { t: "note", title: "💡 Gợi ý đọc hình (đừng xem nếu muốn tự làm)", items: [
        "**Pie → hiện tại**: showers and baths lớn nhất (34%), cùng toilet flushing (26%) chiếm 60%; garden + other chỉ 11%.",
        "**Line → quá khứ + dự báo**: giảm liên tục; 165 → 142 (2000–2020), giảm nhanh hơn sau 2010; is projected to fall to 120 by 2040 — thấp hơn năm 2000 khoảng một phần tư (45 lít).",
        "**Overview**: phần lớn nước dùng trong phòng tắm – nhà vệ sinh; lượng nước mỗi người giảm đều và được dự báo tiếp tục giảm.",
        "**Không** viết “water use fell because people take shorter showers”.",
      ] },
      {
        t: "essay", id: "t3d24-viet-bai", task: "Task 1",
        prompt: "The pie chart below shows how water is used in a typical home in the town of Ashby. The line graph shows the average amount of water used per person per day in Ashby between 2000 and 2020, with projections for 2030 and 2040.\n\nPie chart (% of household water): Showers and baths 34 · Toilet flushing 26 · Washing clothes 15 · Kitchen (cooking, dishes) 14 · Garden 7 · Other 4\nLine graph (litres per person per day): 2000: 165 · 2010: 158 · 2020: 142 · 2030: 130 (projected) · 2040: 120 (projected)\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Mở bài: mỗi hình một mệnh đề, nối bằng while; dùng mệnh đề danh ngữ (how water is used · how much water each person used).",
          "Overview 2 câu, không số: pie — phòng tắm và nhà vệ sinh chiếm phần lớn; line — giảm đều và dự báo giảm tiếp.",
          "Thân 1 (pie) viết hiện tại đơn: accounts for · make up · respectively. Thân 2 (line) quá khứ tới 2020, rồi is projected to… by 2040.",
          "Tổng 8–10 số. Không because, không ý kiến, không kết luận.",
          "Dành 3 phút cuối soát thì từng khổ và giới từ số liệu.",
        ],
      },
      { t: "note", title: "📌 Sau khi AI chấm — ghi sổ lỗi (Tập 3 Ngày 2)", items: [
        "Ghi lại điểm TA: AI có nhận xét “overview chưa phủ cả hai hình” không? Nếu có, viết lại riêng đoạn overview.",
        "Đếm số từ hai khổ thân bài, ghi tỉ lệ vào sổ (mục tiêu không lệch quá 2 : 1).",
        "Ngày 26 sẽ ôn cả 7 dạng Task 1 — giữ bài này để so.",
      ] },
    ],
  },
  /* ═══════════════════════ BÀI 3 — NGHE ═══════════════════════ */
  {
    id: "t3d24-nghe",
    kind: "listening",
    title: "Part 4 — Summary + Table completion (giọng New Zealand)",
    goal: "Theo được một bài giảng 4–5 phút giọng New Zealand ở tốc độ tự nhiên và làm đúng ít nhất 7/10 câu Summary completion + Table completion: đoán trước loại từ, bám tín hiệu chuyển ý và ngữ điệu của người giảng để không lạc câu.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        items: [
          "**Part 4** = một người giảng liền mạch, **không có quãng nghỉ giữa bài**, 10 câu. Tập 2 Ngày 19 dạy lần đầu; Tập 3 Ngày 13 làm Note completion. Hôm nay hai dạng còn lại: **Summary completion** và **Table completion**.",
          "**Summary** = một đoạn văn liền, chỗ trống nằm giữa câu ⇒ ngữ pháp của câu cho bạn biết **loại từ** trước khi nghe. **Table** = thông tin xếp hàng – cột ⇒ tiêu đề cột cho bạn biết **loại thông tin**.",
          "Cả hai đều đi **theo thứ tự bài nói** và đều **paraphrase**: chữ trên giấy khác chữ bạn nghe, chỉ **đáp án** là nguyên văn.",
          "Giọng **New Zealand** lần 3 (sau Ngày 12 · 20): ôn ba nguyên âm bị “xoay” — ten nghe như “tin”, six nghe như “sux”.",
          "🔊 **Nhận ra ngữ điệu khi nghe**: giọng lên ở mục liệt kê, lơ lửng trước “but”, hạ + ngắt khi hết ý — đó là biển báo để bạn chuyển câu hỏi (nối bài nói Ngày 23).",
          "Mục tiêu Listening band 6: 23/40. Part 4 đạt 6–7/10 là đúng tiến độ.",
        ],
      },

      { t: "h", text: "1. Part 4 ở band 6 — khác Part 1–3 ở đâu" },
      {
        t: "table",
        head: ["", "Part 1–3", "Part 4"],
        rows: [
          ["Người nói", "2–4 người, có đối đáp", "1 người, bài giảng học thuật"],
          ["Nghỉ giữa bài", "có (đọc tiếp nhóm câu sau)", "**không** — đọc trước cả 10 câu trong ~45 giây"],
          ["Tín hiệu chuyển ý", "người kia hỏi câu mới", "**từ chỉ đường** của người giảng + ngữ điệu"],
          ["Từ vựng", "đời sống, đăng ký, đồ án", "học thuật: nguyên nhân, quy trình, so sánh"],
          ["Bẫy", "đổi ý, sửa thông tin", "nêu ý sai phổ biến rồi bác (People often assume…, but…)"],
        ],
      },
      { t: "note", title: "📌 Ôn chiến thuật một lần nghe (Tập 2 Ngày 19 · Tập 3 Ngày 13)", items: [
        "**Đọc trước**: gạch tiêu đề, đoán loại từ từng chỗ trống, khoanh từ đứng ngay trước / sau chỗ trống.",
        "**Bám tín hiệu**: I'll begin with… · So, what is…? · That brings me to… · Let me finish by… · Finally, …",
        "**Lỡ một câu thì bỏ**: nghe thấy thông tin của câu sau ⇒ nhảy ngay, đừng tiếc.",
        "**2 phút kiểm (thi máy)**: soát chính tả, số ít – số nhiều, giới hạn số từ.",
      ] },

      { t: "h", text: "2. Summary completion — đoán loại từ từ ngữ pháp của câu" },
      { t: "p", text: "Summary là **bản tóm tắt bằng lời khác** của một phần bài giảng. Vì là câu văn đầy đủ, mỗi chỗ trống bị ngữ pháp “khoá” lại: sau **the** phải là danh từ; sau **by** thường là V-ing hoặc danh từ; sau **for cooking,** là một V-ing / danh từ cùng loại. Làm việc này trong lúc đọc đề thì khi nghe bạn chỉ còn chờ **đúng loại từ đó** xuất hiện." },
      {
        t: "table",
        caption: "Đoán trước chỗ trống — làm mẫu với 4 câu",
        head: ["Câu trong summary", "Ngữ pháp báo gì", "Chờ nghe"],
        rows: [
          ["hot rock is found near the ___", "the + danh từ số ít, chỉ vị trí", "surface / coast / top…"],
          ["engineers reach it by drilling ___ up to three kilometres deep", "tân ngữ của drilling; có thể số nhiều", "wells / holes…"],
          ["so that the ___ in the field does not change", "the + danh từ + does ⇒ **số ít / không đếm được**", "pressure / temperature / level…"],
          ["used the heat for cooking, ___ and warming their houses", "liệt kê song song ⇒ V-ing / danh từ hoạt động", "bathing / washing…"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "4 bước Summary completion (45 giây đọc đề)",
        steps: [
          { label: "1. Giới hạn từ", sub: "ONE WORD ONLY ⇒ viết 2 từ là sai dù đúng ý" },
          { label: "2. Loại từ từng chỗ trống", sub: "danh từ số ít / số nhiều · V-ing · tính từ · số" },
          { label: "3. Từ neo", sub: "từ nội dung ngay trước chỗ trống — bài nói sẽ nói từ đó hoặc từ đồng nghĩa" },
          { label: "4. Nghe: đáp án nguyên văn, xung quanh paraphrase", sub: "summary: “returned underground” ← bài: “pumped back underground”" },
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: ba bẫy của Summary", items: [
        "**Ý sai nêu trước**: “People often assume the steam is released into the air… In older plants it was, **but nowadays**…” ⇒ đáp án ở sau but.",
        "**Số ít – số nhiều**: câu summary có “does” ⇒ danh từ số ít; có “were” ⇒ số nhiều. Nghe “geysers” mà viết “geyser” vào chỗ cần số nhiều là mất điểm.",
        "**Từ đúng loại nhưng sai chỗ**: bài nói ba hoạt động (cooking, bathing, keeping homes warm); summary đã in hai — chỉ điền cái còn thiếu.",
      ] },
      { t: "rule", formula: "Summary: ngữ pháp câu → loại từ → từ neo → nghe đúng loại từ đó", vi: "Chữ quanh chỗ trống là paraphrase; chỉ đáp án là nguyên văn và đúng giới hạn số từ." },

      { t: "h", text: "3. Table completion — đọc tiêu đề cột trước" },
      { t: "p", text: "Bảng trong Part 4 thường **so sánh 3–4 thứ theo cùng vài tiêu chí** (ưu điểm, nhược điểm, tỉ lệ…). Người giảng gần như luôn đi **từng hàng một**: nói hết về thứ A rồi mới sang B. Số câu hỏi cho bạn biết hướng đi: nếu câu 36, 37 cùng một hàng ⇒ đi ngang. Tập 2 Ngày 5 đã làm bảng ở Part 1 (giờ, giá); ở Part 4 ô trống là **khái niệm** (flexible, location, cost)." },
      {
        t: "sodo", kind: "flow", title: "4 bước Table completion",
        steps: [
          { label: "1. Tiêu đề cột", sub: "mỗi cột = một loại thông tin (Share · Advantage · Drawback)" },
          { label: "2. Tiêu đề hàng", sub: "tên các thứ được so — đây là **mốc chuyển**: nghe tên hàng mới ⇒ nhảy hàng" },
          { label: "3. Hướng số câu", sub: "ngang hay dọc? đi theo số" },
          { label: "4. Ô đã điền sẵn = mẫu", sub: "ô mẫu ghi 1 tính từ ⇒ ô trống cùng cột cũng 1 tính từ / danh từ ngắn" },
        ],
      },
      {
        t: "table",
        caption: "Từ báo cột — nghe thấy là biết đang ở cột nào",
        head: ["Cột", "Người giảng hay nói"],
        rows: [
          ["Advantage / Strength", "Its great advantage is… · Its main strength is… · The good thing about… is…"],
          ["Drawback / Weakness", "Its weakness is… · The drawback is… · The obvious problem is…"],
          ["Share / Proportion", "It supplies about… · provides roughly… · accounts for around… per cent"],
          ["Sang hàng mới", "Next, … · Then there's… · Finally, … · Turning to…"],
        ],
      },
      { t: "note", title: "💡 Mẹo — số trong bảng", items: [
        "ONE WORD AND/OR A NUMBER: viết **18** hay **eighteen** đều được; đừng viết kèm % nếu bảng đã in sẵn %.",
        "Phân biệt -teen / -ty (Ngày 5): eigh**TEEN** nhấn sau, **EIGH**ty nhấn trước. Giọng NZ nói nhanh, hãy nghe trọng âm.",
        "Người giảng hay nói “about / roughly / around” trước con số — bạn chỉ ghi con số.",
      ] },

      { t: "h", text: "4. Giọng New Zealand — ôn ba nguyên âm" },
      { t: "p", text: "Ngày 20 đã dạy kỹ. Nhắc lại ba điểm làm người học giật mình nhất, kèm đúng các từ sẽ xuất hiện trong hai bài nghe hôm nay." },
      {
        t: "table",
        head: ["Âm", "Giọng Anh chuẩn", "Giọng NZ nghe như", "Từ trong bài hôm nay"],
        rows: [
          ["/e/ ngắn", "ten · desk · wells", "“tin” · “disk” · “wills”", "wells · sensors · desk · per cent · yes"],
          ["/ɪ/ ngắn", "six · fish · minutes", "gần “sux” · “fush” (âm /ə/)", "six · sixty · cities · wind · minutes"],
          ["/æ/", "plan · back · dams", "“plen” · “beck” · “dems”", "dams · back · advantage · that"],
          ["Cuối câu", "hạ giọng", "hay **lên giọng** dù không hỏi", "…and it is still running today ↗"],
        ],
      },
      { t: "note", title: "💡 Mẹo — khi nghe ra một từ “vô lý”", items: [
        "Nghe “drill **wills**” — vô nghĩa ⇒ đổi nguyên âm ngược lại: “i” → “e” ⇒ **wells**. Luôn để ngữ cảnh quyết định.",
        "Lên giọng cuối câu kể (high rising terminal) **không phải câu hỏi** — đừng chờ ai trả lời; người giảng chỉ đang kiểm xem bạn theo kịp không.",
        "Từ Māori (Wairākei, Rotorua, Taupō) là tên riêng — đề không bao giờ bắt bạn viết chúng nếu chưa được đánh vần.",
      ] },

      { t: "h", text: "5. Khởi động — thông báo ngắn giọng NZ (5 câu)" },
      { t: "p", text: "Một giảng viên đọc thông báo trước giờ học. Đọc đoạn summary 20 giây, đoán loại từ, rồi nghe **một lần**." },
      {
        t: "listen", id: "t3d24-nghe-khoi-dong", title: "A notice from the sustainability office",
        dan: { so: "Day 24, Warm-up (New Zealand accent)", boiCanh: "a lecturer giving a short notice about saving energy on campus.", cau: [1, 5] },
        note: "Khoảng 60 giây, giọng New Zealand (nữ).",
        lines: [
          { who: "Lecturer", voice: "nz-nu", text: "Kia ora, everyone. Before we start, a quick notice from the sustainability office. Last year the university spent nearly two million dollars on electricity, and almost a third of that went on heating rooms that were empty.", vi: "Xin chào mọi người. Trước khi bắt đầu, có một thông báo nhanh từ văn phòng phát triển bền vững. Năm ngoái trường chi gần hai triệu đô-la tiền điện, và gần một phần ba số đó là để sưởi các phòng không có ai." },
          { who: "Lecturer", voice: "nz-nu", text: "So from Monday, the heating in all lecture theatres will switch off automatically at six p.m., not eight as it does now. If you book a room for an evening event, you'll need to request heating at least two days ahead — you can do that online, on the bookings page.", vi: "Vì vậy từ thứ Hai, hệ thống sưởi ở mọi giảng đường sẽ tự tắt lúc sáu giờ tối, không phải tám giờ như hiện nay. Nếu bạn đặt phòng cho sự kiện buổi tối, bạn cần yêu cầu bật sưởi trước ít nhất hai ngày — làm trực tuyến, ở trang đặt phòng." },
          { who: "Lecturer", voice: "nz-nu", text: "We're also replacing the old light switches in the library with sensors, so the lights will only come on when someone walks past. That work begins in the basement and should take about three weeks.", vi: "Chúng tôi cũng đang thay các công tắc đèn cũ trong thư viện bằng cảm biến, nên đèn chỉ bật khi có người đi qua. Việc đó bắt đầu ở tầng hầm và sẽ mất khoảng ba tuần." },
          { who: "Lecturer", voice: "nz-nu", text: "And finally, we're looking for student volunteers to read the meters in each building once a month. If you're interested, leave your name at the front desk.", vi: "Và cuối cùng, chúng tôi đang tìm sinh viên tình nguyện đọc công tơ ở mỗi toà nhà mỗi tháng một lần. Nếu bạn quan tâm, hãy để lại tên ở quầy lễ tân." },
        ],
      },
      { t: "p", text: "**Questions 1–5.** Complete the summary below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "quiz", id: "t3d24-nghe-kd-cau", title: "Questions 1–5 — Summary completion", kind: "fill",
        items: [
          { q: "The university wants to cut its electricity bill. Nearly a 1 ___ of last year's spending went on heating rooms nobody was using.", answers: ["third"] },
          { q: "Heating in lecture theatres will now go off at 2 ___ p.m.", answers: ["6", "six"] },
          { q: "People organising evening events must ask for heating 3 ___ days in advance.", answers: ["2", "two"] },
          { q: "In the library, the lights will be controlled by 4 ___ .", answers: ["sensors"] },
          { q: "Volunteers are needed to read the 5 ___ every month.", answers: ["meters"] },
        ],
      },
      { t: "note", title: "Giải thích phần khởi động", items: [
        "**1 third** — “almost a third of that went on heating rooms that were empty”. Summary: nearly ← almost; rooms nobody was using ← rooms that were empty. “two million” là bẫy (đứng sau a phải là phân số).",
        "**2 six** — “switch off automatically at six p.m., **not eight** as it does now”: bẫy sửa thông tin. Giọng NZ: six nghe gần “sux”.",
        "**3 two** — “at least two days ahead”; in advance ← ahead. “three weeks” là thời gian sửa thư viện.",
        "**4 sensors** — “replacing the old light switches… with sensors”. Số nhiều. Giọng NZ: nghe gần “sinsors”.",
        "**5 meters** — “read the meters in each building once a month”; every month ← once a month. Từ của bài 1 hôm nay.",
      ] },

      { t: "h", text: "6. Bài chính — Questions 31–40 (Part 4)" },
      { t: "p", text: "Bạn sẽ nghe một giảng viên New Zealand giảng về **năng lượng địa nhiệt**. Dành **45 giây** đọc cả 10 câu: 31–35 là summary (ONE WORD ONLY), 36–40 là bảng (ONE WORD AND/OR A NUMBER). Nghe **một lần**, không tua. Từ vựng bài 1 sẽ giúp: geothermal, turbine, drill, hydro, output, supply." },
      { t: "p", text: "**Questions 31–35.** Complete the summary below. Write **ONE WORD ONLY** for each answer." },
      { t: "note", title: "📌 Summary — Geothermal energy in New Zealand", items: ["Geothermal energy is heat from inside the earth. In the central North Island, hot rock is found near the **31** ___ . Rainwater is heated and returns as steam, which engineers reach by drilling **32** ___ up to three kilometres deep. The steam drives a turbine. In modern plants, the used water is returned underground so that the **33** ___ in the field does not change. Māori people traditionally used the heat for cooking, **34** ___ and warming their houses. In one town, private use of geothermal heat damaged the famous **35** ___ , and many wells had to be closed."] },
      { t: "p", text: "**Questions 36–40.** Complete the table below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "table",
        caption: "New Zealand's three main renewable sources",
        head: ["Source", "Share of electricity", "Main advantage", "Main drawback"],
        rows: [
          ["Hydro", "about 60%", "36 ___ : output can be changed in minutes", "depends on 37 ___"],
          ["Geothermal", "roughly 38 ___ %", "constant: runs day and night", "39 ___ : fields are far from cities"],
          ["Wind", "around 6%", "low 40 ___", "supply is unpredictable"],
        ],
      },
      {
        t: "listen", id: "t3d24-nghe-bai", title: "Heat from below — geothermal energy in New Zealand",
        dan: { so: "Day 24, Practice (Listening Part 4)", boiCanh: "part of a lecture on renewable energy given to first-year environmental science students in New Zealand.", cau: [31, 40] },
        note: "Khoảng 4 phút 40 giây, giọng New Zealand (nam). Số liệu tỉ lệ điện được làm tròn cho bài luyện.",
        lines: [
          { who: "Lecturer", voice: "nz-nam", text: "Good morning, everyone. In last week's lecture we looked at fossil fuels, so today I'd like to turn to renewable energy, and in particular to one source that New Zealand is unusually well placed to use — geothermal energy. I'll begin with how it works, then say something about its history here, and I'll finish by comparing it with our two other main renewable sources.", vi: "Chào buổi sáng mọi người. Trong bài giảng tuần trước ta đã xem nhiên liệu hoá thạch, nên hôm nay tôi muốn chuyển sang năng lượng tái tạo, và cụ thể là một nguồn mà New Zealand có vị trí thuận lợi khác thường để dùng — năng lượng địa nhiệt. Tôi sẽ bắt đầu bằng cách nó hoạt động, rồi nói đôi điều về lịch sử của nó ở đây, và kết thúc bằng việc so sánh nó với hai nguồn tái tạo chính còn lại của chúng ta." },
          { who: "Lecturer", voice: "nz-nam", text: "So, what is geothermal energy? Put simply, it's heat from inside the earth. In most countries that heat is too deep to reach, but New Zealand sits on the boundary between two of the earth's plates, and in the central North Island the hot rock lies unusually close to the surface. Rainwater sinks down through cracks in the ground, is heated by this rock, and rises again as hot water or steam.", vi: "Vậy năng lượng địa nhiệt là gì? Nói đơn giản, đó là nhiệt từ bên trong trái đất. Ở hầu hết các nước, nhiệt đó nằm quá sâu không với tới được, nhưng New Zealand nằm trên ranh giới giữa hai mảng kiến tạo của trái đất, và ở miền trung Đảo Bắc, đá nóng nằm gần bề mặt một cách khác thường. Nước mưa thấm xuống qua các khe nứt trong lòng đất, được đá này làm nóng, rồi lại trồi lên dưới dạng nước nóng hoặc hơi nước." },
          { who: "Lecturer", voice: "nz-nam", text: "To make electricity, engineers drill wells — typically between one and three kilometres deep — and the steam that comes up is used to turn a turbine. Now, people often assume the steam is simply released into the air afterwards. In older plants it was, but nowadays the water is cooled and pumped back underground, which keeps the pressure of the field stable. Without that step, a field would slowly lose its power over twenty or thirty years.", vi: "Để tạo ra điện, kỹ sư khoan các giếng — thường sâu từ một đến ba ki-lô-mét — và hơi nước bốc lên được dùng để quay tua-bin. Này, mọi người hay cho rằng sau đó hơi nước đơn giản được thải ra không khí. Ở các nhà máy cũ thì đúng vậy, nhưng ngày nay nước được làm nguội và bơm trở lại lòng đất, việc này giữ cho áp suất của mỏ ổn định. Không có bước đó, một mỏ sẽ dần mất sức trong hai mươi hay ba mươi năm." },
          { who: "Lecturer", voice: "nz-nam", text: "Long before anyone thought of electricity, of course, Māori communities were using this heat in daily life — for cooking, for bathing, and for keeping their homes warm in winter. Large-scale use came much later. The first geothermal power station in the country, at Wairākei, near Lake Taupō, opened in nineteen fifty-eight, and it was only the second in the world. What's remarkable is that it is still running today.", vi: "Tất nhiên, từ rất lâu trước khi có ai nghĩ tới điện, các cộng đồng Māori đã dùng nguồn nhiệt này trong đời sống hằng ngày — để nấu ăn, để tắm, và để giữ ấm nhà vào mùa đông. Việc sử dụng quy mô lớn đến muộn hơn nhiều. Nhà máy điện địa nhiệt đầu tiên của đất nước, ở Wairākei, gần hồ Taupō, mở cửa năm 1958, và nó mới chỉ là nhà máy thứ hai trên thế giới. Điều đáng chú ý là nó vẫn đang chạy tới hôm nay." },
          { who: "Lecturer", voice: "nz-nam", text: "That brings me to a lesson we learned the hard way. In the town of Rotorua, hundreds of households drilled their own private wells to heat their homes. It was cheap, and nobody saw any harm in it. But by the nineteen eighties it was obvious that the town's famous geysers, which attract visitors from all over the world, were getting weaker. Some had stopped altogether. The government's response was to shut down every well near the main geyser area. It was an unpopular decision at the time, but the geysers have slowly recovered. So although we call geothermal energy renewable, it's only renewable if we take the heat out no faster than nature puts it back.", vi: "Điều đó đưa tôi tới một bài học mà chúng ta đã phải trả giá mới học được. Ở thị trấn Rotorua, hàng trăm hộ gia đình tự khoan giếng riêng để sưởi nhà. Việc đó rẻ, và không ai thấy có hại gì. Nhưng tới những năm 1980 thì rõ ràng là các mạch nước phun nổi tiếng của thị trấn, thứ thu hút du khách từ khắp thế giới, đang yếu đi. Một số đã ngừng hẳn. Chính phủ đáp lại bằng cách đóng mọi giếng nằm gần khu mạch phun chính. Lúc đó đây là một quyết định không được lòng dân, nhưng các mạch phun đã dần hồi phục. Vậy nên dù ta gọi địa nhiệt là tái tạo, nó chỉ tái tạo nếu ta lấy nhiệt ra không nhanh hơn tự nhiên bù lại." },
          { who: "Lecturer", voice: "nz-nam", text: "Let me finish by comparing our three main renewable sources. Hydro power — electricity from dams — is by far the largest: it supplies about sixty per cent of the country's electricity. Its great advantage is that it's flexible. Operators can increase or reduce output within minutes, which no coal plant can do. Its weakness is that it depends on rainfall, so in a dry year the lakes run low and prices climb.", vi: "Tôi xin kết thúc bằng việc so sánh ba nguồn tái tạo chính của chúng ta. Thuỷ điện — điện từ các con đập — lớn nhất, bỏ xa các nguồn khác: nó cung cấp khoảng sáu mươi phần trăm điện của cả nước. Ưu điểm lớn của nó là linh hoạt. Người vận hành có thể tăng hay giảm sản lượng trong vài phút, điều mà không nhà máy than nào làm được. Điểm yếu của nó là phụ thuộc vào lượng mưa, nên vào năm khô hạn, các hồ cạn và giá leo thang." },
          { who: "Lecturer", voice: "nz-nam", text: "Geothermal provides roughly eighteen per cent — that's one-eight, not eighty. Its main strength is that it's constant: a geothermal plant runs day and night, whatever the weather. The drawback is location. Almost all the fields are in one region, and you can't move them closer to the cities that need the power.", vi: "Địa nhiệt cung cấp khoảng mười tám phần trăm — một-tám, không phải tám mươi. Thế mạnh chính của nó là ổn định: một nhà máy địa nhiệt chạy cả ngày lẫn đêm, bất kể thời tiết. Nhược điểm là vị trí. Gần như mọi mỏ đều nằm ở một vùng, và bạn không thể dời chúng lại gần các thành phố cần điện." },
          { who: "Lecturer", voice: "nz-nam", text: "Finally, wind. At the moment it accounts for only around six per cent, though that figure is growing quickly. You might expect me to say its advantage is that it's clean, but so are the other two. Wind's real advantage is cost: a wind farm is now the cheapest kind of new power station to build. Its obvious drawback is that the supply is unpredictable, which is why wind has to be combined with something more reliable. Next week, we'll look at how storage might solve that problem.", vi: "Cuối cùng là gió. Hiện tại nó chỉ chiếm khoảng sáu phần trăm, dù con số đó đang tăng nhanh. Có lẽ bạn nghĩ tôi sẽ nói ưu điểm của nó là sạch, nhưng hai nguồn kia cũng sạch. Ưu điểm thật của gió là chi phí: trang trại điện gió hiện là loại nhà máy điện mới rẻ nhất để xây. Nhược điểm hiển nhiên là nguồn cung khó đoán, đó là lý do gió phải được kết hợp với thứ gì đó đáng tin cậy hơn. Tuần sau, ta sẽ xem lưu trữ có thể giải quyết vấn đề đó thế nào." },
        ],
      },
      {
        t: "quiz", id: "t3d24-nghe-tom-tat", title: "Questions 31–35 — Summary completion (ONE WORD ONLY)", kind: "fill",
        items: [
          { q: "31. hot rock is found near the ___", answers: ["surface"] },
          { q: "32. engineers reach the steam by drilling ___ up to three kilometres deep", answers: ["wells"] },
          { q: "33. so that the ___ in the field does not change", answers: ["pressure"] },
          { q: "34. used the heat for cooking, ___ and warming their houses", answers: ["bathing"] },
          { q: "35. private use damaged the famous ___", answers: ["geysers"] },
        ],
      },
      {
        t: "quiz", id: "t3d24-nghe-bang", title: "Questions 36–40 — Table completion (ONE WORD AND/OR A NUMBER)", kind: "fill",
        items: [
          { q: "36. Hydro — main advantage: ___ (output can be changed in minutes)", answers: ["flexible"] },
          { q: "37. Hydro — main drawback: depends on ___", answers: ["rainfall", "rain"] },
          { q: "38. Geothermal — share of electricity: roughly ___ %", answers: ["18", "eighteen"] },
          { q: "39. Geothermal — main drawback: ___ (fields are far from cities)", answers: ["location"] },
          { q: "40. Wind — main advantage: low ___", answers: ["cost", "costs"] },
        ],
      },
      {
        t: "table",
        caption: "Giải thích từng câu — câu trong bài, paraphrase, bẫy",
        head: ["Câu", "Đáp án", "Bài nói", "Paraphrase / bẫy"],
        rows: [
          ["31", "surface", "the hot rock lies unusually close to the surface", "found near ← lies close to. Bẫy: “too deep to reach” là nói về các nước khác"],
          ["32", "wells", "engineers drill wells — typically between one and three kilometres deep", "up to three kilometres ← between one and three. Giọng NZ: “wills”. Số nhiều"],
          ["33", "pressure", "pumped back underground, which keeps the pressure of the field stable", "returned underground ← pumped back; does not change ← stable. Bẫy: “released into the air” — ý sai nêu trước but nowadays"],
          ["34", "bathing", "for cooking, for bathing, and for keeping their homes warm", "warming their houses ← keeping their homes warm; liệt kê ↗ ↗ ↘"],
          ["35", "geysers", "the town's famous geysers… were getting weaker", "damaged ← were getting weaker / had stopped. Số nhiều. Bẫy: “wells” (đã dùng ở 32 — và wells là thứ bị đóng, không phải thứ bị hại)"],
          ["36", "flexible", "Its great advantage is that it's flexible… increase or reduce output within minutes", "changed in minutes ← increase or reduce within minutes"],
          ["37", "rainfall", "Its weakness is that it depends on rainfall", "drawback ← weakness. “dry year”, “lakes” là chi tiết minh hoạ"],
          ["38", "18", "roughly eighteen per cent — that's one-eight, not eighty", "Người giảng tự sửa bẫy -teen / -ty"],
          ["39", "location", "The drawback is location. Almost all the fields are in one region…", "far from cities ← can't move them closer to the cities"],
          ["40", "cost", "You might expect… clean, but so are the other two. Wind's real advantage is cost", "Bẫy: “clean” nêu trước rồi bị gạt; low cost ← the cheapest… to build"],
        ],
      },
      { t: "note", title: "📌 Chấm điểm và học lại", items: [
        "**8–10 đúng**: Part 4 của bạn đã ở mức band 6.5–7. **6–7**: đúng tiến độ band 6. **≤ 5**: nghe lại lần hai có mở lời thoại, đánh dấu chỗ mình lạc.",
        "Sai 33 hoặc 40 ⇒ bạn sập bẫy “ý sai nêu trước”. Tập phản xạ: nghe **People often assume / You might expect** ⇒ đáp án chưa tới, chờ **but**.",
        "Sai 32 hoặc 35 vì thiếu -s ⇒ soát số ít – số nhiều trong 2 phút kiểm.",
        "Sai 38 ⇒ ôn lại Ngày 5 (thirteen / thirty).",
        "Nghe lại lần ba **không nhìn đề**, chỉ ghi các cụm chỉ đường: I'll begin with · So, what is · Now, · That brings me to · Let me finish by · Finally. Sáu cụm đó chia bài thành sáu khúc — mỗi khúc 1–3 câu hỏi.",
      ] },

      { t: "h", text: "7. Phát âm: nhận ra ngữ điệu khi nghe" },
      { t: "p", text: "Hôm qua bạn **nói** ngữ điệu đối lập. Hôm nay dùng tai: người giảng không đọc dấu chấm, dấu phẩy — họ **hát** chúng. Bốn kiểu ngữ điệu dưới đây là bốn biển báo giúp bạn biết: còn mục nữa không, đáp án ở trước hay sau, khi nào sang câu hỏi mới. Cách luyện tốt nhất để **nghe ra** là tự **nói ra** — nên khối luyện bên dưới lấy đúng các câu của bài giảng." },
      {
        t: "table",
        caption: "Bốn biển báo bằng giọng",
        head: ["Ngữ điệu", "Nghe thế nào", "Báo cho bạn", "Ví dụ trong bài"],
        rows: [
          ["Liệt kê", "mỗi mục **lên** ↗, mục cuối **xuống** ↘", "chưa xuống = còn mục nữa; chỗ trống có thể là mục giữa", "for cooking ↗, for bathing ↗, and for keeping their homes warm ↘"],
          ["Đối lập", "vế đầu **lơ lửng** ↘↗, nhấn từ đối nhau, vế sau xuống", "vế đầu thường là ý sai / ý cũ ⇒ **đáp án ở vế sau**", "In older plants it WAS ↘↗, but NOWadays… ↘"],
          ["Chuyển ý", "từ chỉ đường đọc riêng, **hạ giọng + ngắt** rồi bắt đầu cao trở lại", "sang phần mới ⇒ **sang câu hỏi / hàng mới**", "Finally ↘ | wind."],
          ["Câu hỏi tu từ", "Wh- xuống ↘ rồi ngắt", "người giảng sắp **tự trả lời** — định nghĩa / đáp án ngay sau", "So, what IS geothermal energy? ↘ | Put simply, …"],
          ["Nhấn thông tin mới", "một từ to, dài, cao hơn hẳn", "từ đó thường **là đáp án**", "Wind's REAL advantage is COST."],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận — ba điều dễ nghe nhầm", items: [
        "Giọng New Zealand (và Úc) hay **lên giọng cuối câu kể**. Đừng nhầm với liệt kê hay câu hỏi: nếu sau đó là một câu mới hoàn toàn thì đó chỉ là thói quen vùng miền.",
        "Số được **sửa** luôn được nhấn mạnh: “one-EIGHT, not EIGHty” — nghe thấy nhấn kiểu này là người giảng đang giúp bạn.",
        "Từ bị nuốt (to, of, the, that — Ngày 20) không bao giờ là đáp án. Đáp án là từ nội dung, và từ nội dung luôn được nhấn.",
      ] },
      {
        t: "phatam", id: "t3d24-phat-am", title: "Luyện phát âm — ngữ điệu của người giảng",
        note: "Bấm “Nghe mẫu”, để ý giọng lên – xuống ở đâu, rồi bắt chước y hệt (cường điệu lên) và “Đọc & chấm”. Máy chấm từng âm; phần ngữ điệu bạn nghe lại bản ghi của mình và so với mẫu.",
        items: [
          { text: "for cooking, for bathing, and for keeping homes warm", ipa: "fə kʊkɪŋ fə beɪðɪŋ ənd fə kiːpɪŋ həʊmz wɔːm", vi: "liệt kê: ↗ ↗ ↘" },
          { text: "So, what is geothermal energy?", ipa: "səʊ wɒt ɪz dʒiːəʊθɜːml enədʒi", vi: "câu hỏi tu từ: nhấn IS, xuống giọng" },
          { text: "In older plants it was, but nowadays the water is pumped back underground.", ipa: "ɪn əʊldə plɑːnts ɪt wɒz bət naʊədeɪz ðə wɔːtə ɪz pʌmpt bæk ʌndəɡraʊnd", vi: "đối lập: WAS lơ lửng — NOWadays" },
          { text: "It was an unpopular decision, but the geysers have recovered.", ipa: "ɪt wəz ən ʌnpɒpjələ dɪsɪʒn bət ðə ɡiːzəz həv rɪkʌvəd", vi: "đối lập: unPOPular ↔ reCOVered" },
          { text: "Hydro is flexible, geothermal is constant, and wind is cheap.", ipa: "haɪdrəʊ ɪz fleksəbl dʒiːəʊθɜːml ɪz kɒnstənt ənd wɪnd ɪz tʃiːp", vi: "liệt kê ba vế: ↗ ↗ ↘" },
          { text: "Finally, wind.", ipa: "faɪnəli wɪnd", vi: "chuyển ý: hạ giọng, ngắt, rồi nhấn WIND" },
          { text: "It supplies about sixty per cent, not sixteen.", ipa: "ɪt səplaɪz əbaʊt sɪksti pə sent nɒt sɪkstiːn", vi: "sửa số: SIXty ↔ sixTEEN" },
          { text: "The drawback is location.", ipa: "ðə drɔːbæk ɪz ləʊkeɪʃn", vi: "nhấn thông tin mới: loCAtion" },
          { text: "It's only renewable if we use it slowly.", ipa: "ɪts əʊnli rɪnjuːəbl ɪf wi juːz ɪt sləʊli", vi: "nhấn ONly và SLOWly" },
          { text: "Next week, we'll look at storage.", ipa: "nekst wiːk wiːl lʊk ət stɔːrɪdʒ", vi: "câu kết: xuống giọng hẳn" },
        ],
      },
      {
        t: "mcq", id: "t3d24-nghe-ngu-dieu", title: "Giọng báo gì? (6 câu)",
        items: [
          { q: "Bạn nghe: “for cooking ↗, for bathing ↗…” — giọng vẫn đang lên. Điều đó báo:", options: ["danh sách đã hết", "người giảng đang hỏi", "còn ít nhất một mục nữa", "người giảng sắp đổi chủ đề"], correct: 2, why: "Liệt kê: mục chưa cuối thì lên; mục cuối mới xuống." },
          { q: "“People often assume the steam is released into the air ↘↗…” — giọng lơ lửng ở cuối. Bạn nên:", options: ["chờ — ý thật sắp đến sau but", "ghi ngay “air”", "bỏ câu này", "chuyển sang câu kế"], correct: 0, why: "Ý sai phổ biến + giọng lơ lửng ⇒ sắp có but và đáp án." },
          { q: "“Finally ↘ | wind.” — người giảng hạ giọng ở Finally rồi ngắt. Trong bảng, bạn:", options: ["ở yên hàng Geothermal", "quay lại hàng Hydro", "dừng nghe", "nhảy xuống hàng Wind"], correct: 3, why: "Từ chỉ đường + ngắt = sang hàng mới." },
          { q: "“So, what IS geothermal energy? ↘” — sau câu này thường là:", options: ["một câu hỏi khác", "định nghĩa / câu trả lời của chính người giảng", "một quãng nghỉ dài", "phần kết bài"], correct: 1, why: "Câu hỏi tu từ: người giảng tự trả lời ngay." },
          { q: "“Wind's REAL advantage is COST.” — từ được nhấn mạnh nhất (cost) nhiều khả năng là:", options: ["từ chức năng", "từ gây nhiễu", "đáp án", "tên riêng"], correct: 2, why: "Thông tin mới được nhấn — và thông tin mới là thứ đề hỏi." },
          { q: "Một giảng viên New Zealand nói: “…and it is still running today ↗.” rồi sang câu mới. Giọng lên ở đây là:", options: ["một câu hỏi cần trả lời", "thói quen lên giọng cuối câu kể của giọng NZ", "dấu hiệu còn mục liệt kê", "dấu hiệu người giảng không chắc"], correct: 1, why: "High rising terminal — đặc trưng giọng NZ / Úc, không mang nghĩa hỏi." },
        ],
      },
      { t: "note", title: "💡 Cách học sau bài", items: [
        "Nghe lại bài chính, **nhắm mắt**, giơ một ngón tay mỗi khi nghe giọng lên ở mục liệt kê và gập lại khi giọng xuống. Làm 2 lần là tai quen.",
        "Shadowing 1 phút đoạn so sánh ba nguồn (Hydro… Geothermal… Finally, wind): nói đuổi theo băng, bắt chước cả cao độ.",
        "Chép 6 cụm chỉ đường của bài vào sổ — Ngày 26 bạn sẽ dùng chính chúng khi nói Part 2 và khi viết báo cáo ngắn.",
      ] },
    ],
  },
  /* ═══════════════════════ BÀI 4 — BÀI TẬP ═══════════════════════ */
  {
    id: "t3d24-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 24 — Energy & resources · collocation Task 1 · mixed charts · Part 4 giọng NZ",
    goal: "Tự kiểm cả ngày bằng 38 câu có đáp án; đúng từ 27 câu trở lên là đạt.",
    minutes: 50,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "Sáu phần: I–III từ vựng (22 câu) · IV dịch câu Task 1 (5 câu) · V đề hai hình (6 câu) · VI nghe giọng New Zealand (5 câu).",
          "Làm một mạch, không mở lại bài học. Đúng **≥ 27 / 38** là đạt; phần nào dưới 70% thì quay lại mục ghi cạnh tên phần.",
          "Phần VI nghe **một lần**, đọc bảng trước 20 giây.",
          "Xong bài tập thì sang **bài kiểm tra chặng Ngày 19–24** — nên làm vào buổi khác, khi đầu óc còn tỉnh.",
        ],
      },

      { t: "h", text: "Phần I — Energy & resources: chọn từ (8 câu · ôn bài 1 mục 1–4)" },
      {
        t: "mcq", id: "t3d24-bt-nghia", title: "Chọn từ đúng",
        items: [
          { q: "Coal, oil and gas are all ___.", options: ["renewables", "biofuels", "raw materials", "fossil fuels"], correct: 3, why: "Than, dầu, khí = nhiên liệu hoá thạch." },
          { q: "The steam is used to turn a ___, which generates electricity.", options: ["turbine", "pipeline", "meter", "grid"], correct: 0, why: "turn a turbine." },
          { q: "Household ___ such as fridges and washing machines use a fifth of the energy.", options: ["reserves", "appliances", "resources", "supplies"], correct: 1, why: "household appliances = thiết bị gia dụng." },
          { q: "The storm caused a ___ that lasted six hours.", options: ["power station", "power point", "power cut", "power line"], correct: 2, why: "a power cut = mất điện." },
          { q: "The country is rich ___ natural resources.", options: ["of", "in", "with", "on"], correct: 1, why: "be rich in." },
          { q: "The city aims to become carbon-___ by 2040.", options: ["neutral", "free", "empty", "zero"], correct: 0, why: "carbon-neutral = trung hoà carbon (hoặc reach net zero)." },
          { q: "If we do not act now, we will ___ out of clean water.", options: ["go", "get", "make", "run"], correct: 3, why: "run out of = cạn." },
          { q: "The ___ from fossil fuels to renewables will take decades.", options: ["consumption", "extraction", "transition", "insulation"], correct: 2, why: "the transition from A to B." },
        ],
      },

      { t: "h", text: "Phần II — Collocation Task 1: điền MỘT từ (8 câu · ôn bài 1 mục 5)" },
      {
        t: "quiz", id: "t3d24-bt-collocation", title: "Điền một từ", kind: "fill",
        items: [
          { q: "Heating accounts ___ 42% of household energy use.", answers: ["for"] },
          { q: "There was a sharp increase ___ the price of electricity.", answers: ["in"] },
          { q: "The price rose ___ 10 cents to 19 cents over the period.", answers: ["from"] },
          { q: "Cooking and lighting ___ up only 15% of the total.", answers: ["make", "made"] },
          { q: "Coal output peaked ___ 130 terawatt-hours in 2005.", answers: ["at"] },
          { q: "Nuclear output ___ stable at 40 terawatt-hours.", answers: ["remained", "stayed"] },
          { q: "Water use is ___ to fall to 120 litres by 2040.", answers: ["projected", "expected", "predicted", "forecast"] },
          { q: "Flats and houses cost $900 and $2,100 ___ . (lần lượt)", answers: ["respectively"] },
        ],
      },

      { t: "h", text: "Phần III — Dạng từ (6 câu · ôn bài 1, bảng họ từ)" },
      {
        t: "quiz", id: "t3d24-bt-dang-tu", title: "Viết dạng đúng của từ trong ngoặc", kind: "fill",
        items: [
          { q: "Wind power is clean but not always ___ . (rely)", answers: ["reliable"] },
          { q: "Water ___ fell by a quarter between 2000 and 2020. (consume)", answers: ["consumption"] },
          { q: "The house is well ___ , so it stays warm in winter. (insulate)", answers: ["insulated"] },
          { q: "The government is investing in the ___ of rainforests. (conserve)", answers: ["conservation"] },
          { q: "The region has an ___ of sunshine. (abundant)", answers: ["abundance"] },
          { q: "Our current use of water is simply ___ . (sustain)", answers: ["unsustainable"] },
        ],
      },

      { t: "h", text: "Phần IV — Dịch câu Task 1 (5 câu · ôn bài 2 mục 3–5)" },
      { t: "p", text: "Theo hai đề mẫu của bài 2 (Norland và Westland). Chú ý **thì** của từng hình." },
      {
        t: "quiz", id: "t3d24-bt-dich", title: "Dịch sang tiếng Anh", kind: "translate", grammar: "account for · stood at · had + V3 by · Turning to… · is projected to",
        items: [
          { q: "Năm 2000, than là nguồn lớn nhất, bỏ xa các nguồn khác.", answers: ["In 2000, coal was by far the largest source.", "In 2000 coal was by far the largest source.", "Coal was by far the largest source in 2000.", "In 2000, coal was by far the biggest source."], hint: "was by far the largest source" },
          { q: "Con số này đã giảm một nửa vào năm 2020.", answers: ["This figure had halved by 2020.", "By 2020, this figure had halved.", "By 2020 this figure had halved.", "This figure had fallen by half by 2020."], hint: "had halved by 2020" },
          { q: "Chuyển sang biểu đồ đường, giá ở mức 10 xu vào năm 2000.", answers: ["Turning to the line graph, the price stood at 10 cents in 2000.", "Turning to the line graph, the price was 10 cents in 2000.", "Turning to the line graph, the price stood at ten cents in 2000."], hint: "Turning to the line graph, … stood at" },
          { q: "Nấu ăn và chiếu sáng lần lượt chiếm 8% và 7%.", answers: ["Cooking and lighting account for 8% and 7% respectively.", "Cooking and lighting make up 8% and 7% respectively.", "Cooking and lighting account for 8% and 7%, respectively.", "Cooking and lighting make up 8% and 7%, respectively."], hint: "account for / make up … respectively (hiện tại — pie không có năm)" },
          { q: "Mức dùng nước được dự báo sẽ giảm xuống 120 lít vào năm 2040.", answers: ["Water use is projected to fall to 120 litres by 2040.", "Water use is expected to fall to 120 litres by 2040.", "Water use is predicted to fall to 120 litres by 2040.", "Water consumption is projected to fall to 120 litres by 2040.", "Water use is projected to drop to 120 litres by 2040.", "Water use is projected to decrease to 120 litres by 2040."], hint: "is projected to fall to… by 2040" },
        ],
      },

      { t: "h", text: "Phần V — Đề hai hình (6 câu · ôn bài 2)" },
      { t: "p", text: "**Đề:** The bar chart shows the percentage of electricity produced from renewable sources in four countries in 2022. The table shows total investment in renewable energy in the same countries in 2012 and 2022." },
      {
        t: "chart", kind: "bar", title: "Share of electricity from renewable sources, 2022", unit: "%",
        labels: ["Arland", "Belmont", "Corvia", "Dunmark"],
        series: [{ name: "Renewables", values: [62, 35, 18, 48] }],
      },
      {
        t: "figure",
        fig: {
          kind: "table",
          title: "Investment in renewable energy, 2012 and 2022 ($ billion)",
          note: "Số liệu tự đặt cho bài luyện.",
          unit: "$ billion",
          categories: ["2012", "2022"],
          series: [
            { name: "Arland", values: [4, 9] },
            { name: "Belmont", values: [10, 22] },
            { name: "Corvia", values: [12, 14] },
            { name: "Dunmark", values: [3, 11] },
          ],
        },
      },
      {
        t: "mcq", id: "t3d24-bt-hai-hinh", title: "Chọn đáp án đúng",
        items: [
          { q: "Mở bài tốt nhất:", options: ["The chart shows renewable energy in four countries.", "The bar chart compares the proportion of electricity that four countries produced from renewable sources in 2022, while the table shows how much each invested in renewable energy in 2012 and 2022.", "The bar chart and the table shows the percentage and the investment.", "I am going to describe two charts about four countries."], correct: 1, why: "Mỗi hình một mệnh đề, nối while, có paraphrase; C sai hoà hợp." },
          { q: "Overview tốt nhất:", options: ["Overall, Arland was 62% and Belmont invested $22 billion.", "Overall, renewable energy is very important for the future of every country.", "Overall, Arland relied most on renewables and Corvia least, while investment rose in all four countries, most sharply in Dunmark.", "Overall, Belmont invested the most because it is the richest country."], correct: 2, why: "Mỗi hình một ý, không số, không ý kiến / nguyên nhân. (Dunmark 3 → 11: gần gấp bốn.)" },
          { q: "Câu nào viết ĐÚNG về bảng?", options: ["Investment in Dunmark almost quadrupled, from $3 billion to $11 billion.", "Investment in Corvia doubled.", "Belmont invested the least in 2022.", "Investment fell in Arland."], correct: 0, why: "3 → 11 ≈ gấp 3,7 lần ⇒ almost quadrupled. Corvia 12 → 14 chỉ tăng nhẹ; Belmont cao nhất; Arland tăng." },
          { q: "Câu nào KHÔNG được viết?", options: ["Corvia had the lowest share of renewables, at 18%.", "Belmont was the largest investor in both years.", "By contrast, Corvia's investment rose only slightly.", "Arland has the highest share because it invested wisely."], correct: 3, why: "Suy diễn nhân quả giữa hai hình (và Arland thật ra đầu tư ít)." },
          { q: "Hai hình đều có năm đã qua (2022; 2012 và 2022). Thân bài dùng:", options: ["hiện tại đơn cho bar, quá khứ cho table", "tương lai cho cả hai", "hiện tại hoàn thành cho cả hai", "quá khứ đơn cho cả hai"], correct: 3, why: "Có năm quá khứ ⇒ quá khứ đơn; chỉ hình không năm mới dùng hiện tại." },
          { q: "Câu chuyển sang bảng hay nhất:", options: ["And the table.", "As for investment, Belmont spent the most in both years.", "Now I talk about table.", "Because of this, investment rose."], correct: 1, why: "As for + chủ đề của hình 2, vào số liệu ngay; D bịa nhân quả." },
        ],
      },

      { t: "h", text: "Phần VI — Nghe: so sánh ba cách sưởi nhà, giọng New Zealand (5 câu · ôn bài 3)" },
      { t: "p", text: "Một giảng viên giao bài và so sánh ba cách sưởi nhà. Đọc bảng 20 giây, nghe **một lần**, điền **ONE WORD AND/OR A NUMBER**." },
      {
        t: "table",
        caption: "Three ways of heating a home",
        head: ["Type", "Good point", "Weak point"],
        rows: [
          ["Wood burner", "cheap to run", "produces 1 ___"],
          ["Heat pump (costs $ 2 ___ to install)", "also 3 ___ the house in summer", "less efficient below 4 ___ degrees"],
          ["Gas heater", "warms a room quickly", "adds 5 ___ to the air"],
        ],
      },
      {
        t: "listen", id: "t3d24-bt-nghe", title: "Three ways to heat a home",
        dan: { so: "Day 24, Homework (Listening Part 4)", boiCanh: "a lecturer explaining an assignment about home heating.", cau: [1, 5] },
        note: "Khoảng 70 giây, giọng New Zealand (nữ).",
        lines: [
          { who: "Lecturer", voice: "nz-nu", text: "Right, so for your assignment you'll compare three ways of heating a home. Let's start with the wood burner. It's cheap to run — if you can collect your own wood it costs almost nothing — but it does produce smoke, so it's banned in some city suburbs.", vi: "Được rồi, trong bài tập này các bạn sẽ so sánh ba cách sưởi nhà. Hãy bắt đầu với lò đốt củi. Nó rẻ khi vận hành — nếu tự kiếm được củi thì gần như không tốn gì — nhưng nó tạo ra khói, nên bị cấm ở một số khu ngoại ô thành phố." },
          { who: "Lecturer", voice: "nz-nu", text: "Next, the heat pump. This is the most popular choice in New Zealand now. It costs about two thousand dollars to install, not three thousand as it says in your textbook — that figure's out of date. The good thing is that it cools the house in summer as well. Its weakness is that it becomes less efficient when the temperature drops below zero.", vi: "Tiếp theo là máy bơm nhiệt. Đây là lựa chọn phổ biến nhất ở New Zealand hiện nay. Lắp đặt tốn khoảng hai nghìn đô-la, không phải ba nghìn như sách giáo khoa của các bạn ghi — con số đó đã cũ. Điểm hay là nó còn làm mát nhà vào mùa hè. Điểm yếu là nó kém hiệu quả hơn khi nhiệt độ xuống dưới không độ." },
          { who: "Lecturer", voice: "nz-nu", text: "And lastly, gas heaters. They warm a room very quickly, I'll give them that, but they add moisture to the air, and that can lead to mould on the walls. So have a think about which one suits a cold, damp climate.", vi: "Và cuối cùng là máy sưởi gas. Chúng làm ấm phòng rất nhanh, tôi công nhận điều đó, nhưng chúng thêm hơi ẩm vào không khí, và điều đó có thể dẫn tới nấm mốc trên tường. Vậy hãy nghĩ xem cái nào hợp với khí hậu lạnh, ẩm." },
        ],
      },
      {
        t: "quiz", id: "t3d24-bt-nghe-cau", title: "Questions 1–5 — Table completion", kind: "fill",
        items: [
          { q: "1. Wood burner — weak point: produces ___", answers: ["smoke"] },
          { q: "2. Heat pump — costs $ ___ to install", answers: ["2000", "2,000", "two thousand"] },
          { q: "3. Heat pump — good point: also ___ the house in summer", answers: ["cools"] },
          { q: "4. Heat pump — weak point: less efficient below ___ degrees", answers: ["zero", "0"] },
          { q: "5. Gas heater — weak point: adds ___ to the air", answers: ["moisture"] },
        ],
      },
      { t: "note", title: "Giải thích phần nghe", items: [
        "**1 smoke** — “it does produce smoke, so it's banned in some city suburbs”. Giọng lơ lửng trước but ⇒ nhược điểm ở sau.",
        "**2 2,000** — “about two thousand dollars to install, **not three thousand** as it says in your textbook”: bẫy sửa số.",
        "**3 cools** — “it cools the house in summer as well”; also ← as well. Cần động từ có -s (ô mẫu: “also ___ the house”).",
        "**4 zero** — “when the temperature drops below zero”.",
        "**5 moisture** — “they add moisture to the air”. “mould” là hậu quả, không phải thứ được thêm vào không khí.",
        "Ba từ chuyển hàng: **Let's start with · Next, · And lastly,** — nghe thấy là nhảy hàng.",
      ] },
    ],
  },
  /* ═══════════════════════ BÀI 5 — KIỂM TRA CHẶNG (NGÀY 19–24) ═══════════════════════ */
  {
    id: "t3d24-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 19–24)",
    goal: "Tự đo đã nắm chắc Ngày 19–24 của Tập 3 chưa — câu tường thuật, modal suy đoán, nhượng bộ – nhân quả, mệnh đề danh ngữ; AWL sublist 6, Transport, Animals & nature, Energy & resources; Matching information / features, Yes / No / Not Given; bảng có Total, Two-part question, biểu đồ kết hợp; Part 3 – Part 4 giọng New Zealand; Part 2 sự kiện và Part 3 đánh giá — đạt từ 70% mỗi phần.",
    minutes: 170,
    blocks: [
      {
        t: "recap", title: "Bài kiểm tra này đo gì",
        items: [
          "**8 phần**, gom cả chặng 4 (Ngày 19–24): ngữ pháp · từ vựng · dịch · nghe · đọc · viết · nói · phát âm. Làm trong một buổi ~2 giờ 50 phút, hoặc chia hai buổi (phần 1–5 rồi phần 6–8).",
          "**Ngưỡng đạt: ≥ 70% từng phần** — không lấy phần giỏi bù phần yếu. Tên mỗi phần ghi rõ **trượt thì ôn Ngày nào**.",
          "Phần Nghe: nghe **một lần**, không tua. Phần Đọc: bấm giờ **20 phút**. Phần Viết: Task 1 **20 phút**, Task 2 **40 phút**.",
          "Không mở lại bài học trong lúc làm. Sai câu nào chép vào **sổ lỗi** kèm một dòng lý do.",
          "Đạt cả 8 phần ⇒ sang chặng 5 (Ngày 25–30) và chuẩn bị **Đề 5 — thi cuối Tập 3**.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Chặng 4 (Ngày 19–24) — những gì sẽ bị kiểm", center: "Ngày 19–24",
        branches: [
          { label: "Ngữ pháp", items: ["N19 câu tường thuật · modal suy đoán", "N21 nhượng bộ · nhân quả", "N23 mệnh đề danh ngữ · It is + adj"] },
          { label: "Từ vựng", items: ["N20 AWL sublist 6 · Transport", "N22 Animals, nature & biodiversity", "N24 Energy & resources · collocation Task 1"] },
          { label: "Đọc", items: ["N19 Matching information", "N21 Matching features", "N23 Yes / No / Not Given"] },
          { label: "Viết", items: ["N20 bảng có Total", "N22 Two-part question", "N24 biểu đồ kết hợp"] },
          { label: "Nghe", items: ["N20 Part 3 giọng NZ", "N21 đề 40 câu", "N24 Part 4 Summary + Table"] },
          { label: "Nói + phát âm", items: ["N19 Some people say…", "N22 Part 2 sự kiện", "N23 Is it a good thing…?", "/s/ /z/ · âm yếu · /ð/ · -ed · ngữ điệu"] },
        ],
      },
      { t: "note", title: "Cách làm bài", items: [
        "Chuẩn bị: giấy nháp, tai nghe, đồng hồ bấm giờ. Tắt thông báo điện thoại.",
        "Phần 1–3 và 8: làm xong bấm chấm ngay, ghi điểm vào bảng dưới.",
        "Phần 4 (Nghe): đọc câu hỏi 30–45 giây trước mỗi bài, nghe một lần.",
        "Phần 5 (Đọc): 20 phút cho 13 câu, kể cả thời gian đọc bài.",
        "Phần 6 (Viết) và 7 (Nói): AI chấm theo 4 tiêu chí; mục tiêu **band 5.5 trở lên** ở mỗi bài (band ước tính).",
        "Mệt thì nghỉ giữa phần 5 và phần 6 — đừng nghỉ giữa một phần.",
      ] },
      {
        t: "table",
        caption: "Bảng ghi điểm — chép ra giấy",
        head: ["Phần", "Số câu", "Ngưỡng đạt", "Trượt thì ôn"],
        rows: [
          ["1. Ngữ pháp", "24", "≥ 17", "Ngày 19 · 21 · 23"],
          ["2. Từ vựng", "18", "≥ 13", "Ngày 20 · 22 · 24"],
          ["3. Dịch", "6", "≥ 5", "Ngày 19 · 21 · 23"],
          ["4. Nghe", "13", "≥ 9", "Ngày 20 · 21 · 24"],
          ["5. Đọc", "13", "≥ 9", "Ngày 19 · 21 · 23"],
          ["6. Viết", "6 câu + 2 bài", "≥ 5/6 · AI ≥ 5.5", "Ngày 20 · 22 · 24"],
          ["7. Nói", "Part 2 + 4 câu Part 3", "AI ≥ 5.5", "Ngày 19 · 22 · 23"],
          ["8. Phát âm", "8", "≥ 6", "Ngày 19 · 20 · 21 · 22 · 23 · 24"],
        ],
      },

      { t: "h", text: "Phần 1 — Ngữ pháp (15 + 9 câu · đạt ≥ 17/24 · trượt thì ôn Ngày 19, 21, 23)" },
      {
        t: "mcq", id: "t3d24-kt-ngu-phap-chon", title: "1a. Chọn đáp án đúng (15 câu)",
        items: [
          { q: "“I am working on a new project,” she said. → She said that she ___ on a new project.", options: ["is working", "was working", "has worked", "works"], correct: 1, why: "Động từ dẫn quá khứ ⇒ lùi thì: am working → was working (Ngày 19)." },
          { q: "The interviewer asked me ___ .", options: ["where did I study", "where I had studied", "where had I studied", "where do I study"], correct: 1, why: "Tường thuật câu hỏi: Wh- + S + V, không đảo, lùi thì." },
          { q: "My tutor suggested ___ the introduction.", options: ["me to rewrite", "to rewrite", "that I rewrite", "me rewriting"], correct: 2, why: "suggest + that + S + (should) + V / suggest + V-ing; không suggest sb to V." },
          { q: "The streets are wet. It ___ during the night.", options: ["must have rained", "must rain", "should have rained", "can't have rained"], correct: 0, why: "Suy đoán chắc chắn về quá khứ: must have + V3." },
          { q: "The bridge collapsed after ten years. The engineers ___ it more carefully.", options: ["must have tested", "might test", "can't have tested", "should have tested"], correct: 3, why: "Đánh giá việc đã không làm: should have + V3." },
          { q: "___ the high cost, many families are installing solar panels.", options: ["Although", "Despite", "However", "Whereas"], correct: 1, why: "despite + cụm danh từ (Ngày 21)." },
          { q: "___ wind power is clean, it is not always reliable.", options: ["Despite", "In spite of", "Although", "Because of"], correct: 2, why: "although + mệnh đề." },
          { q: "City residents rely on public transport, ___ people in rural areas depend on cars.", options: ["whereas", "despite", "due to", "therefore"], correct: 0, why: "whereas nối hai vế đối lập trực tiếp." },
          { q: "The flight was cancelled ___ heavy fog.", options: ["because", "as a result", "so", "due to"], correct: 3, why: "due to + danh từ; because + mệnh đề." },
          { q: "Deforestation ___ the loss of many habitats.", options: ["results from", "is due", "has led to", "is because"], correct: 2, why: "Nguyên nhân + lead to / result in + kết quả. results from thì ngược chiều." },
          { q: "The chart shows ___ each country spent on energy.", options: ["how much", "that how much", "how much did", "what much"], correct: 0, why: "Mệnh đề danh ngữ: how much + S + V (Ngày 23)." },
          { q: "___ worries scientists is the speed of the change.", options: ["That", "It", "Which", "What"], correct: 3, why: "What + V + is… (what = the thing that)." },
          { q: "It is ___ for small farms to compete with large companies.", options: ["likely", "difficult", "clear", "true"], correct: 1, why: "It is difficult + for sb + to V; likely / clear / true + that." },
          { q: "It depends on ___ the government keeps its promise.", options: ["if", "that", "whether", "what"], correct: 2, why: "Sau giới từ ⇒ whether." },
          { q: "The fact ___ so many species are disappearing should worry us all.", options: ["which", "that", "what", "of"], correct: 1, why: "the fact + that + mệnh đề." },
        ],
      },
      {
        t: "quiz", id: "t3d24-kt-ngu-phap-dien", title: "1b. Điền dạng đúng / MỘT từ (9 câu)", kind: "fill",
        items: [
          { q: "“We will publish the results next week,” the team said. → The team said that they ___ publish the results the following week. (1 từ)", answers: ["would"] },
          { q: "“Do you cycle to work?” → He asked me ___ I cycled to work. (1 từ)", answers: ["if", "whether"] },
          { q: "The researchers ___ (claim) that the method is safe, but they offer little evidence. (hiện tại)", answers: ["claim"] },
          { q: "He isn't answering his phone. He ___ have left it at home. (có lẽ — 1 từ)", answers: ["might", "may", "could"] },
          { q: "In ___ of the rain, the match went ahead. (1 từ)", answers: ["spite"] },
          { q: "Fuel prices rose sharply. As a ___ , many people stopped driving to work. (1 từ)", answers: ["result"] },
          { q: "The delay resulted ___ a signal failure. (signal failure là nguyên nhân — 1 từ)", answers: ["from"] },
          { q: "Many people find ___ difficult to give up their cars. (1 từ)", answers: ["it"] },
          { q: "___ is estimated that a million species are at risk. (1 từ)", answers: ["It"] },
        ],
      },

      { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 20, 22, 24)" },
      {
        t: "mcq", id: "t3d24-kt-tu-vung-chon", title: "2a. Chọn từ đúng (12 câu)",
        items: [
          { q: "The council has ___ $5 million to new cycle lanes.", options: ["exceeded", "allocated", "inhibited", "presumed"], correct: 1, why: "allocate money to = phân bổ (AWL 6, Ngày 20)." },
          { q: "Drivers who ___ the speed limit will be fined.", options: ["utilise", "precede", "exceed", "cite"], correct: 2, why: "exceed the limit = vượt giới hạn." },
          { q: "Free parking at the station is an ___ for people to take the train.", options: ["incentive", "interval", "index", "incidence"], correct: 0, why: "an incentive (for sb) to do = động lực khuyến khích." },
          { q: "The city introduced a congestion ___ to reduce traffic in the centre.", options: ["fare", "toll", "fee", "charge"], correct: 3, why: "a congestion charge = phí vào khu trung tâm." },
          { q: "Trains are crowded during the ___ hour.", options: ["peak-off", "rush", "busy", "top"], correct: 1, why: "the rush hour = giờ cao điểm." },
          { q: "The tiger is an ___ species: only a few thousand remain in the wild.", options: ["extinct", "abundant", "endangered", "invasive"], correct: 2, why: "endangered = có nguy cơ tuyệt chủng; extinct = đã tuyệt chủng (Ngày 22)." },
          { q: "Cutting down forests destroys the natural ___ of many animals.", options: ["habitat", "prey", "breed", "captivity"], correct: 0, why: "natural habitat = môi trường sống tự nhiên." },
          { q: "Rainforests are famous for their rich ___ — thousands of species live in one small area.", options: ["conservation", "extinction", "deforestation", "biodiversity"], correct: 3, why: "biodiversity = đa dạng sinh học." },
          { q: "Lions are ___ ; zebras are their prey.", options: ["poachers", "predators", "mammals", "reptiles"], correct: 1, why: "predator = loài săn mồi ↔ prey = con mồi." },
          { q: "Wind and solar are ___ sources of energy.", options: ["finite", "fossil", "renewable", "scarce"], correct: 2, why: "renewable = tái tạo (Ngày 24)." },
          { q: "Governments should reduce their ___ on imported oil.", options: ["reliance", "demand", "supply", "output"], correct: 0, why: "reliance on = sự phụ thuộc vào." },
          { q: "Heating ___ for 42% of household energy use.", options: ["occupies", "takes", "stands", "accounts"], correct: 3, why: "account for + % (collocation Task 1)." },
        ],
      },
      {
        t: "quiz", id: "t3d24-kt-tu-vung-dang", title: "2b. Viết dạng đúng của từ trong ngoặc (6 câu)", kind: "fill",
        items: [
          { q: "The table gives an ___ picture of how people travel. (accuracy)", answers: ["accurate"] },
          { q: "The new buses are ___ to wheelchair users. (access)", answers: ["accessible"] },
          { q: "Many species face ___ within the next fifty years. (extinct)", answers: ["extinction"] },
          { q: "Wildlife ___ needs both money and public support. (conserve)", answers: ["conservation"] },
          { q: "Energy ___ per person fell by 10%. (consume)", answers: ["consumption"] },
          { q: "We need a more ___ way of using water. (sustain)", answers: ["sustainable"] },
        ],
      },

      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      {
        t: "quiz", id: "t3d24-kt-dich", title: "3. Dịch sang tiếng Anh", kind: "translate", grammar: "câu tường thuật · although / despite · due to · What… is… · It is + adj + to V",
        items: [
          { q: "Bộ trưởng nói rằng giá vé sẽ không tăng.", answers: ["The minister said that fares would not rise.", "The minister said that fares would not increase.", "The minister said fares would not rise.", "The minister said that fares wouldn't rise.", "The minister said that ticket prices would not rise.", "The minister said that fares would not go up."], hint: "said that… would not rise (Ngày 19)" },
          { q: "Lẽ ra thành phố nên xây thêm đường cho xe đạp.", answers: ["The city should have built more cycle lanes.", "The city should have built more bike lanes.", "The city should have built more cycle paths.", "The city should have built more bicycle lanes."], hint: "should have + V3 (Ngày 19)" },
          { q: "Mặc dù năng lượng mặt trời sạch, nó vẫn đắt.", answers: ["Although solar energy is clean, it is still expensive.", "Although solar power is clean, it is still expensive.", "Even though solar energy is clean, it is still expensive.", "Though solar energy is clean, it is still expensive.", "Even though solar power is clean, it is still expensive."], hint: "Although + S + V, S + V (không but — Ngày 21)" },
          { q: "Nhiều loài đang biến mất do mất môi trường sống.", answers: ["Many species are disappearing due to habitat loss.", "Many species are disappearing because of habitat loss.", "Many species are disappearing owing to habitat loss.", "Many species are disappearing due to the loss of habitat.", "Many species are disappearing due to the loss of their habitats.", "Many species are disappearing because of the loss of their habitat."], hint: "due to + N: habitat loss (Ngày 21 · 22)" },
          { q: "Điều chúng ta cần là một hệ thống giao thông công cộng tốt hơn.", answers: ["What we need is a better public transport system.", "What we need is a better system of public transport.", "What we need is a better public transportation system."], hint: "What we need is… (Ngày 23)" },
          { q: "Rất khó để các nước nghèo chuyển sang năng lượng tái tạo.", answers: ["It is difficult for poor countries to switch to renewable energy.", "It is very difficult for poor countries to switch to renewable energy.", "It is hard for poor countries to switch to renewable energy.", "It is very hard for poor countries to switch to renewable energy.", "It is difficult for poor countries to switch to renewables.", "It is difficult for poorer countries to switch to renewable energy."], hint: "It is difficult for… to switch to (Ngày 23 · 24)" },
        ],
      },

      { t: "h", text: "Phần 4 — Nghe (6 + 7 câu · đạt ≥ 9/13 · trượt thì ôn Ngày 20, 21, 24)" },
      { t: "p", text: "**4a — Part 3, giọng New Zealand (Questions 1–6).** Hai sinh viên, Liam và Aroha, bàn về bài thuyết trình môn bảo tồn. Đọc 6 câu hỏi 30 giây, nghe **một lần**. Câu 1–3: **ONE WORD AND/OR A NUMBER**." },
      {
        t: "listen", id: "t3d24-kt-nghe-thao-luan", title: "A presentation on a rare bird",
        dan: { so: "Checkpoint Test 4, Recording 1", boiCanh: "two students, Liam and Aroha, talking about a presentation for their conservation course.", cau: [1, 6] },
        note: "Khoảng 1 phút 50 giây, giọng New Zealand (nam + nữ).",
        lines: [
          { who: "Liam", voice: "nz-nam", text: "So, Aroha, have you chosen a topic for the conservation presentation?", vi: "Aroha này, bạn chọn đề tài cho bài thuyết trình môn bảo tồn chưa?" },
          { who: "Aroha", voice: "nz-nu", text: "I have. I was going to do the kiwi, but half the class is doing that, so I've switched to a rare green parrot that can't fly.", vi: "Rồi. Mình định làm về chim kiwi, nhưng nửa lớp đang làm đề tài đó, nên mình đổi sang một loài vẹt xanh quý hiếm không biết bay." },
          { who: "Liam", voice: "nz-nam", text: "Good choice. How many are left?", vi: "Chọn hay đấy. Còn bao nhiêu con?" },
          { who: "Aroha", voice: "nz-nu", text: "When I checked last year it was about two hundred, but the latest count is two hundred and fifty.", vi: "Năm ngoái mình xem thì khoảng hai trăm, nhưng lần đếm mới nhất là hai trăm năm mươi." },
          { who: "Liam", voice: "nz-nam", text: "And why did they nearly die out? Hunting?", vi: "Thế vì sao chúng suýt tuyệt chủng? Do săn bắn à?" },
          { who: "Aroha", voice: "nz-nu", text: "That's what I assumed, but the main cause was actually predators — the cats and rats that settlers brought with them. The birds nest on the ground, so the eggs were easy to find.", vi: "Mình cũng tưởng vậy, nhưng nguyên nhân chính thật ra là loài săn mồi — mèo và chuột mà người định cư mang theo. Chim làm tổ dưới đất nên trứng rất dễ bị tìm thấy." },
          { who: "Liam", voice: "nz-nam", text: "So how are they being protected?", vi: "Vậy chúng đang được bảo vệ thế nào?" },
          { who: "Aroha", voice: "nz-nu", text: "They've all been moved to small islands where there are no cats or rats. And every bird wears a tiny transmitter, so the rangers always know where it is.", vi: "Tất cả đã được chuyển tới các đảo nhỏ không có mèo hay chuột. Và mỗi con đeo một máy phát tín hiệu tí hon, nên kiểm lâm luôn biết nó ở đâu." },
          { who: "Liam", voice: "nz-nam", text: "Dr Patel said we need a clear argument, though, not just facts.", vi: "Nhưng cô Patel nói bọn mình cần một luận điểm rõ, không chỉ dữ kiện." },
          { who: "Aroha", voice: "nz-nu", text: "Yeah, she told me the same. I want to argue that saving one famous species is worth it, because it brings in money for the whole habitat.", vi: "Ừ, cô cũng bảo mình vậy. Mình muốn lập luận rằng cứu một loài nổi tiếng là đáng, vì nó mang tiền về cho cả môi trường sống." },
          { who: "Liam", voice: "nz-nam", text: "Hmm. Some people would say that money should go to less attractive species instead.", vi: "Hừm. Có người sẽ nói tiền đó nên dành cho những loài kém hấp dẫn hơn." },
          { who: "Aroha", voice: "nz-nu", text: "That's true, and I'll mention it. But I still think a famous bird is what gets the public interested.", vi: "Đúng, và mình sẽ nhắc tới ý đó. Nhưng mình vẫn nghĩ một loài chim nổi tiếng mới là thứ khiến công chúng quan tâm." },
          { who: "Liam", voice: "nz-nam", text: "Fair enough. What about your slides?", vi: "Cũng phải. Còn slide của bạn thì sao?" },
          { who: "Aroha", voice: "nz-nu", text: "I've got too many — twenty. Dr Patel suggested cutting them to ten, so I'll have to drop some good photos, but it'll be clearer.", vi: "Mình có nhiều quá — hai mươi cái. Cô Patel gợi ý cắt còn mười, nên mình sẽ phải bỏ vài ảnh đẹp, nhưng sẽ rõ ràng hơn." },
          { who: "Liam", voice: "nz-nam", text: "And when are you presenting?", vi: "Thế bao giờ bạn thuyết trình?" },
          { who: "Aroha", voice: "nz-nu", text: "It was meant to be Tuesday, but the room's being painted, so it's Thursday now.", vi: "Lẽ ra là thứ Ba, nhưng phòng đang được sơn, nên giờ là thứ Năm." },
        ],
      },
      {
        t: "quiz", id: "t3d24-kt-nghe-thao-luan-cau", title: "Questions 1–3 — Sentence completion", kind: "fill",
        items: [
          { q: "1. The most recent count of the birds is ___ .", answers: ["250", "two hundred and fifty"] },
          { q: "2. The birds almost disappeared mainly because of ___ .", answers: ["predators"] },
          { q: "3. All the birds now live on small ___ without cats or rats.", answers: ["islands"] },
        ],
      },
      {
        t: "mcq", id: "t3d24-kt-nghe-thao-luan-chon", title: "Questions 4–6 — A, B or C",
        items: [
          { q: "4. What will Aroha argue in her presentation?", options: ["All species deserve an equal share of funding.", "Protecting a well-known species helps its whole habitat.", "Less attractive species need more money."], correct: 1, why: "“saving one famous species is worth it, because it brings in money for the whole habitat.” C là ý của “some people” mà Liam thuật lại." },
          { q: "5. What did Dr Patel advise Aroha to do about her slides?", options: ["use fewer of them", "add more photographs", "make the text clearer"], correct: 0, why: "“Dr Patel suggested cutting them to ten” — fewer ← cutting. “clearer” là kết quả Aroha mong, không phải lời khuyên." },
          { q: "6. When will Aroha give her presentation?", options: ["on Tuesday", "on Wednesday", "on Thursday"], correct: 2, why: "“It was meant to be Tuesday, but… it's Thursday now.” — bẫy đổi thông tin." },
        ],
      },
      { t: "note", title: "Giải thích 4a", items: [
        "**1 250** — “about two hundred” là số năm ngoái; “the latest count is two hundred and fifty” (most recent ← latest).",
        "**2 predators** — “Hunting?” là phỏng đoán của Liam; “the main cause was actually predators”. actually báo sửa ý.",
        "**3 islands** — “moved to small islands where there are no cats or rats”.",
        "Ngày 19: Liam dùng **Dr Patel said…**, **Some people would say that…**; Aroha dùng **she told me**, **suggested cutting** — nghe ra ai nói gì là kỹ năng của Part 3.",
      ] },
      { t: "p", text: "**4b — Part 4, giọng New Zealand (Questions 7–13).** Một đoạn bài giảng về xe buýt điện. Đọc summary và bảng 40 giây, nghe **một lần**. Mỗi chỗ trống: **ONE WORD AND/OR A NUMBER**." },
      { t: "note", title: "📌 Questions 7–10 — Summary", items: [
        "Electric buses produce no fumes at street level and are also much **7** ___ than diesel buses. They cost about **8** ___ as much to buy, but operators say the money is recovered because electricity is cheaper and there are fewer moving parts to **9** ___ . Newer models can travel around **10** ___ kilometres on one charge.",
      ] },
      {
        t: "table",
        caption: "Questions 11–13 — Two ways of charging",
        head: ["Method", "When", "Advantage", "Drawback"],
        rows: [
          ["Depot charging", "overnight", "uses cheap 11 ___ electricity", "each bus needs a large, heavy battery"],
          ["Opportunity charging", "a few minutes at the end of each route", "smaller battery, so room for more 12 ___", "chargers in the street take a lot of 13 ___"],
        ],
      },
      {
        t: "listen", id: "t3d24-kt-nghe-bai-giang", title: "Electric buses",
        dan: { so: "Checkpoint Test 4, Recording 2", boiCanh: "part of a lecture on reducing emissions from public transport.", cau: [7, 13] },
        note: "Khoảng 1 phút 50 giây, giọng New Zealand (nam).",
        lines: [
          { who: "Lecturer", voice: "nz-nam", text: "Today I want to look briefly at how cities are cutting emissions from public transport, using the example of electric buses. The idea is simple. A diesel bus burns fuel and produces exhaust fumes at street level, exactly where people are walking. An electric bus produces none, and it's also much quieter, which residents notice immediately.", vi: "Hôm nay tôi muốn xem nhanh các thành phố đang cắt giảm phát thải từ giao thông công cộng thế nào, lấy ví dụ xe buýt điện. Ý tưởng rất đơn giản. Xe buýt diesel đốt nhiên liệu và thải khói ngay ở mặt đường, đúng nơi người ta đi bộ. Xe buýt điện không thải gì, và nó cũng êm hơn nhiều, điều mà cư dân nhận ra ngay." },
          { who: "Lecturer", voice: "nz-nam", text: "So why hasn't every city switched? The first reason is the purchase price: an electric bus costs roughly twice as much as a diesel one. Operators argue, however, that the money is recovered through lower running costs — electricity is cheaper than diesel, and there are fewer moving parts to repair.", vi: "Vậy sao chưa phải thành phố nào cũng chuyển đổi? Lý do thứ nhất là giá mua: một xe buýt điện đắt khoảng gấp đôi xe diesel. Tuy vậy, các đơn vị vận hành lập luận rằng số tiền đó được thu lại nhờ chi phí vận hành thấp hơn — điện rẻ hơn diesel, và có ít bộ phận chuyển động phải sửa hơn." },
          { who: "Lecturer", voice: "nz-nam", text: "The second problem is range. Early models could travel only about a hundred and fifty kilometres on one charge, which wasn't enough for a full day. Newer ones manage around three hundred.", vi: "Vấn đề thứ hai là tầm hoạt động. Các mẫu đầu chỉ đi được khoảng một trăm năm mươi ki-lô-mét mỗi lần sạc, không đủ cho cả ngày. Các mẫu mới đi được khoảng ba trăm." },
          { who: "Lecturer", voice: "nz-nam", text: "Now, let me compare the two ways of charging. Depot charging means the buses are plugged in overnight. The advantage is that it uses cheap off-peak electricity; the drawback is that each bus needs a large, heavy battery.", vi: "Bây giờ, để tôi so sánh hai cách sạc. Sạc tại bãi nghĩa là xe được cắm sạc qua đêm. Ưu điểm là nó dùng điện giờ thấp điểm giá rẻ; nhược điểm là mỗi xe cần một bộ pin lớn và nặng." },
          { who: "Lecturer", voice: "nz-nam", text: "The alternative is what's called opportunity charging, where a bus tops up for a few minutes at the end of each route. That allows a smaller battery, so the bus can carry more passengers — but the chargers have to be built along the streets, and that takes a lot of space. Most cities, in practice, end up using a mixture of the two.", vi: "Cách còn lại gọi là sạc tranh thủ, khi xe sạc thêm vài phút ở cuối mỗi tuyến. Cách đó cho phép dùng pin nhỏ hơn, nên xe chở được nhiều hành khách hơn — nhưng trạm sạc phải xây dọc các con phố, và việc đó chiếm nhiều diện tích. Trên thực tế, đa số thành phố rốt cuộc dùng kết hợp cả hai." },
        ],
      },
      {
        t: "quiz", id: "t3d24-kt-nghe-bai-giang-cau", title: "Questions 7–13 — Summary + Table completion", kind: "fill",
        items: [
          { q: "7. Electric buses are also much ___ than diesel buses.", answers: ["quieter"] },
          { q: "8. They cost about ___ as much to buy.", answers: ["twice"] },
          { q: "9. …there are fewer moving parts to ___ .", answers: ["repair"] },
          { q: "10. Newer models can travel around ___ kilometres on one charge.", answers: ["300", "three hundred"] },
          { q: "11. Depot charging uses cheap ___ electricity.", answers: ["off-peak", "off peak", "offpeak"] },
          { q: "12. Opportunity charging: smaller battery, so room for more ___ .", answers: ["passengers"] },
          { q: "13. Chargers in the street take a lot of ___ .", answers: ["space"] },
        ],
      },
      { t: "note", title: "Giải thích 4b", items: [
        "**7 quieter** — “it's also much quieter”. Cần tính từ so sánh (sau much, trước than).",
        "**8 twice** — “costs roughly twice as much as a diesel one”; about ← roughly.",
        "**9 repair** — “fewer moving parts to repair”.",
        "**10 300** — “Early models… a hundred and fifty” là bẫy (mẫu cũ); “Newer ones manage around three hundred”.",
        "**11 off-peak** — “uses cheap off-peak electricity” (từ của Ngày 20).",
        "**12 passengers** — “so the bus can carry more passengers”. **13 space** — “that takes a lot of space”.",
        "Mốc chuyển: **So why…? · The second problem is · Now, let me compare · The alternative is** — mỗi mốc là một khúc câu hỏi.",
      ] },

      { t: "h", text: "Phần 5 — Đọc (4 + 3 + 6 câu · đạt ≥ 9/13 · 20 phút · trượt thì ôn Ngày 19, 21, 23)" },
      { t: "p", text: "Bấm giờ **20 phút**. Bài có ba dạng: Matching information (Ngày 19) · Matching features (Ngày 21) · Yes / No / Not Given (Ngày 23)." },
      {
        t: "passage", title: "Bringing the Beaver Back",
        paras: [
          { label: "A", text: "Four centuries after it was hunted to extinction in Britain, the beaver is being returned to a number of river valleys. Supporters describe the animal as a ‘natural engineer’ that restores damaged habitats at no cost. Although this claim is sometimes exaggerated, the evidence so far suggests that the reintroduction deserves cautious support." },
          { label: "B", text: "The ecological case is strong. Beavers build dams, and the ponds that form behind them attract species that had largely disappeared from farmland. The ecologist Dr Hannah Lowe, who has monitored one valley for eight years, reports that the number of bird species there has doubled. She admits, however, that the valley was chosen because it was already in good condition, so the result might not be repeated elsewhere." },
          { label: "C", text: "A second argument concerns flooding. According to the hydrologist Professor Ian Reid, beaver dams slow the movement of water after heavy rain, which reduces the height of floods in villages downstream. His measurements show a fall of around a third in peak flow. Reid stresses that this benefit depends on the dams being left in place: where landowners remove them, it disappears within weeks." },
          { label: "D", text: "Not everyone is persuaded. Tom Ashby, who represents local farmers, points out that the same dams flood fields and that beavers cut down young trees. He argues that farmers should be compensated for these losses. This seems to me a reasonable demand. It would be a mistake, however, to conclude that the project should be abandoned. Owing to their small numbers, beavers currently affect less than one per cent of farmland in the area, whereas the flood protection benefits thousands of households. What matters now is that the costs are shared fairly rather than left with the few people who happen to live beside the river." },
        ],
      },
      { t: "p", text: "**Questions 1–4.** The passage has four paragraphs, **A–D**. Which paragraph contains the following information? Write the correct letter, **A–D**." },
      {
        t: "quiz", id: "t3d24-kt-doc-thong-tin", title: "Questions 1–4 — Matching information (viết chữ cái A–D)", kind: "fill",
        items: [
          { q: "1. a reason why the findings of one study may not apply to other places", answers: ["B", "b"] },
          { q: "2. a condition that must be met for a benefit to continue", answers: ["C", "c"] },
          { q: "3. a comparison between the scale of the harm and the scale of the benefit", answers: ["D", "d"] },
          { q: "4. a reference to how long the animal has been absent", answers: ["A", "a"] },
        ],
      },
      { t: "p", text: "**Questions 5–7.** Look at the following statements and the list of people. Match each statement with the correct person." },
      {
        t: "mcq", id: "t3d24-kt-doc-nguoi", title: "Questions 5–7 — Matching features",
        items: [
          { q: "5. People who suffer damage ought to receive payment.", options: ["Dr Hannah Lowe", "Professor Ian Reid", "Tom Ashby"], correct: 2, why: "Đoạn D: “He argues that farmers should be compensated for these losses.” compensated → receive payment." },
          { q: "6. The variety of wildlife in one location has increased.", options: ["Dr Hannah Lowe", "Professor Ian Reid", "Tom Ashby"], correct: 0, why: "Đoạn B: “reports that the number of bird species there has doubled.”" },
          { q: "7. Taking away what the animals build quickly cancels the effect.", options: ["Dr Hannah Lowe", "Professor Ian Reid", "Tom Ashby"], correct: 1, why: "Đoạn C: “where landowners remove them, it disappears within weeks.”" },
        ],
      },
      { t: "p", text: "**Questions 8–13.** Do the following statements agree with the views of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t3d24-kt-doc-ynng", title: "Questions 8–13 — Yes / No / Not Given",
        items: [
          { q: "8. Supporters always describe the benefits of beavers accurately.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: “this claim is sometimes exaggerated” ⇒ trái với always… accurately ⇒ NO." },
          { q: "9. The return of the beaver deserves support, though with some care.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “deserves cautious support” ⇒ YES." },
          { q: "10. Beavers were originally hunted mainly for their fur.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói “hunted to extinction”, không nói vì sao ⇒ NOT GIVEN." },
          { q: "11. The farmers' request for compensation is fair.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “This seems to me a reasonable demand.” ⇒ YES (ý của Ashby, tác giả tán thành)." },
          { q: "12. The damage to farmland is serious enough to justify ending the project.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn D: “It would be a mistake… to conclude that the project should be abandoned.” ⇒ NO." },
          { q: "13. Beavers will spread to most farmland in the region within ten years.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói hiện tại chưa tới 1%; không có dự đoán nào ⇒ NOT GIVEN." },
        ],
      },
      { t: "note", title: "Giải thích Questions 1–4", items: [
        "**1 B** — “the valley was chosen because it was already in good condition, so the result might not be repeated elsewhere.” Loại thông tin: **a reason**.",
        "**2 C** — “this benefit depends on the dams being left in place”. Loại thông tin: **a condition**.",
        "**3 D** — “less than one per cent of farmland… whereas the flood protection benefits thousands of households.” whereas = dấu hiệu so sánh (Ngày 21).",
        "**4 A** — “Four centuries after it was hunted to extinction”. how long… absent ← four centuries.",
        "Sai 1–4 ⇒ ôn Ngày 19 (gọi tên loại thông tin). Sai 5–7 ⇒ ôn Ngày 21 (quét theo tên). Sai 8–13 ⇒ ôn Ngày 23 (ai nói — mức độ — từng vế).",
      ] },

      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 20, 22, 24)" },
      {
        t: "mcq", id: "t3d24-kt-viet-chon", title: "6a. Kiến thức viết band 6 (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "Bảng có hàng **Total**. Khi đọc và viết, bạn nên:", options: ["bỏ qua hàng Total", "đọc Total sau cùng và không nhắc tới", "đọc Total trước; dùng nó cho overview và câu mở thân bài", "so Total ngang hàng với từng hạng mục"], correct: 2, why: "Ngày 20: Total đọc trước, viết trước, không so ngang hàng với thành phần." },
          { q: "Bảng có một cột tính bằng km và một cột tính bằng phút. Bạn:", options: ["chỉ so trong từng cột (so dọc)", "so km với phút để tìm số lớn nhất", "cộng hai cột lại", "bỏ một cột"], correct: 0, why: "Cột khác đơn vị không so ngang." },
          { q: "Đề: “Why is this happening? What can **governments and individuals** do?” Thân bài 2 cần:", options: ["chỉ giải pháp của chính phủ", "ít nhất một giải pháp cho chính phủ VÀ một cho cá nhân", "chỉ nêu lại nguyên nhân", "ý kiến đồng ý hay không"], correct: 1, why: "Ngày 22: một câu hỏi chứa hai đối tượng ⇒ mỗi đối tượng ít nhất một ý." },
          { q: "Bài Two-part question cân đối nhất khi:", options: ["câu hỏi 1 viết 200 từ, câu hỏi 2 viết 30 từ", "trả lời cả hai câu hỏi ngay trong mở bài rồi kể chuyện", "chỉ trả lời câu hỏi mình thích", "mỗi câu hỏi một thân bài, mở bài báo trước cả hai câu trả lời"], correct: 3, why: "Hai câu hỏi ⇒ hai thân bài; thesis trả lời gọn cả hai." },
          { q: "Đề Task 1 có pie (không năm) + table (2010, 2020). Chọn câu đúng:", options: ["Cả bài viết quá khứ đơn.", "Pie viết hiện tại, table viết quá khứ; mỗi khổ một hình.", "Trộn số của hai hình trong một khổ cho gọn.", "Thêm một đoạn giải thích vì sao số liệu thay đổi."], correct: 1, why: "Ngày 24: mỗi khổ một hình, mỗi hình một thì; không giải thích nguyên nhân." },
          { q: "Overview của đề hai hình cần:", options: ["mỗi hình một ý, không số liệu", "số liệu lớn nhất của hình 1", "ý kiến của người viết", "chỉ nói về hình phức tạp hơn"], correct: 0, why: "Overall, ý hình 1. At the same time, ý hình 2." },
        ],
      },
      { t: "p", text: "**6b — Task 1 (20 phút, ≥ 150 từ).** Đề hai hình: line graph có năm dự báo + table hai năm. Ghi **thì** của từng hình trước khi viết." },
      {
        t: "chart", kind: "line", title: "Number of electric buses in service in Calder, 2015–2035 (2030 and 2035 are projections)", unit: "buses",
        labels: ["2015", "2020", "2025", "2030", "2035"],
        series: [{ name: "Electric buses", values: [20, 90, 210, 330, 400] }],
      },
      {
        t: "figure",
        fig: {
          kind: "table",
          title: "How Calder residents travelled to work, 2015 and 2025 (% of commuters)",
          note: "Số liệu tự đặt cho bài luyện.",
          unit: "% of commuters",
          categories: ["2015", "2025"],
          series: [
            { name: "Car", values: [58, 44] },
            { name: "Bus", values: [20, 29] },
            { name: "Bicycle", values: [6, 11] },
            { name: "Walking", values: [9, 9] },
            { name: "Other", values: [7, 7] },
          ],
        },
      },
      {
        t: "essay", id: "t3d24-kt-viet-task1", task: "Task 1",
        prompt: "The line graph below shows the number of electric buses in service in the city of Calder between 2015 and 2025, with projections for 2030 and 2035. The table shows how Calder residents travelled to work in 2015 and 2025.\n\nLine graph (number of electric buses): 2015: 20 · 2020: 90 · 2025: 210 · 2030: 330 (projected) · 2035: 400 (projected)\nTable (% of commuters, 2015 → 2025): Car 58 → 44 · Bus 20 → 29 · Bicycle 6 → 11 · Walking 9 → 9 · Other 7 → 7\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Mở bài: mỗi hình một mệnh đề, nối while.",
          "Overview: số xe buýt điện tăng mạnh và được dự báo tăng tiếp; người đi làm bỏ dần ô tô sang xe buýt và xe đạp.",
          "Thân 1 (line): quá khứ tới 2025, rồi is projected to reach… by 2035. Thân 2 (table): quá khứ đơn; car vẫn nhất dù giảm; walking và other không đổi.",
          "Không viết “more people took the bus because the buses were electric”.",
        ],
      },
      { t: "p", text: "**6c — Task 2 (40 phút, ≥ 250 từ).** Two-part question. Đếm vế đề: **hai** câu hỏi; câu thứ hai có **hai** đối tượng." },
      {
        t: "essay", id: "t3d24-kt-viet-task2", task: "Task 2",
        prompt: "In many parts of the world, the number of wild animal species is falling rapidly.\n\nWhy is this happening? What can governments and individuals do to protect wildlife?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Mở bài: paraphrase hiện tượng + thesis trả lời gọn cả hai câu hỏi.",
          "Thân 1 (Why): 2 nguyên nhân, dùng ngôn ngữ nhân quả Ngày 21 (due to · lead to · as a result) và từ Ngày 22 (habitat loss, poaching, endangered).",
          "Thân 2 (What): ít nhất 1 việc của governments + 1 việc của individuals; khung Ngày 23: What governments should do is… · It is essential that…",
          "Kết bài: 1–2 câu chốt lại cả hai câu trả lời; không ý mới.",
        ],
      },

      { t: "h", text: "Phần 7 — Nói (Part 2 + 4 câu Part 3 · AI ≥ band 5.5 · trượt thì ôn Ngày 19, 22, 23)" },
      { t: "p", text: "**Part 2** (Ngày 22): 1 phút ghi chú, nói **2 phút**. Kể bằng các thì quá khứ đủ bộ (was doing · did · had done), có đầu – sự cố – kết quả. **Part 3**: mỗi câu 35–45 giây. Hai câu đầu dùng khung T–V–M–V (Ngày 19), hai câu sau dùng Đ–T–N–C (Ngày 23)." },
      {
        t: "speak", id: "t3d24-kt-noi-p2", part: "2",
        questions: [
          "Describe an event you attended that did not go as planned. You should say: what the event was · when and where it took place · what went wrong · and explain how you felt about it afterwards.",
        ],
      },
      {
        t: "speak", id: "t3d24-kt-noi-p3", part: "3",
        questions: [
          "Some people say that zoos are cruel and should be closed. What do you think?",
          "Many people believe that public transport should be free. Why do you think they hold that view?",
          "Is it a good thing that more and more cities are restricting cars in their centres?",
          "Do you think it's good for a country to depend on tourism to protect its wildlife?",
        ],
      },
      { t: "note", title: "Tự kiểm sau khi ghi âm", items: [
        "**Part 2**: có nói đủ 2 phút không? Có ít nhất một câu quá khứ hoàn thành (had + V3) và đọc rõ đuôi -ed không?",
        "**Câu 1–2**: có thuật ý người khác bằng lời mình (không chép lại câu hỏi) rồi mới nêu ý mình không?",
        "**Câu 3–4**: có đủ Đ – T – N – C và một câu đối lập đọc đúng ngữ điệu không?",
        "AI chấm dưới 5.5 ở tiêu chí nào thì ghi vào Sổ Speaking và ôn đúng ngày: FC → Ngày 22 · 23; GRA → Ngày 19 · 23; P → khối phát âm Ngày 19–24.",
      ] },

      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm)" },
      {
        t: "mcq", id: "t3d24-kt-phat-am", title: "8. Âm nào? Giọng nào? (8 câu)",
        items: [
          { q: "Đuôi -s của từ nào đọc là /ɪz/?", options: ["claims", "argues", "suggests", "increases"], correct: 3, why: "Sau /s/ ⇒ /ɪz/, thêm một âm tiết: in-crea-ses (Ngày 19)." },
          { q: "Đuôi -s của từ nào đọc là /s/?", options: ["thinks", "believes", "says", "shows"], correct: 0, why: "Sau âm vô thanh /k/ ⇒ /s/." },
          { q: "Trong câu nói nhanh “I'd like a cup **of** tea”, of đọc là:", options: ["/ɒv/ rõ ràng", "/əv/ yếu (gần như “ə”)", "/ɔːf/", "không đổi so với đọc riêng"], correct: 1, why: "Từ chức năng đọc yếu trong hội thoại nhanh (Ngày 20)." },
          { q: "Từ nào bắt đầu bằng /ð/ (hữu thanh)?", options: ["think", "theory", "though", "thousand"], correct: 2, why: "though /ðəʊ/; ba từ kia là /θ/ (Ngày 21)." },
          { q: "Trong từ nào **th** đọc /θ/ (vô thanh)?", options: ["whether", "although", "nevertheless", "growth"], correct: 3, why: "growth /ɡrəʊθ/; whether, although, nevertheless đều có /ð/." },
          { q: "Đuôi -ed của từ nào đọc là /ɪd/?", options: ["decided", "happened", "missed", "arrived"], correct: 0, why: "Sau /d/ hoặc /t/ ⇒ /ɪd/ (Ngày 22)." },
          { q: "“It's good for CITIES, but not for VILLAGES.” — Cuối vế đầu (cities), giọng:", options: ["hạ hẳn", "lơ lửng (xuống rồi hơi lên)", "tắt dần", "đều"], correct: 1, why: "Ngữ điệu đối lập: vế đầu fall-rise (Ngày 23)." },
          { q: "Nghe: “for cooking ↗, for bathing ↗, and for heating ↘”. Giọng xuống ở heating báo:", options: ["còn mục nữa", "người nói đang hỏi", "danh sách đã hết", "người nói sửa thông tin"], correct: 2, why: "Liệt kê: mục cuối xuống giọng (Ngày 24)." },
        ],
      },
      { t: "note", title: "📌 Đọc lại các khối phát âm có máy chấm", items: [
        "Ngày 19 — âm cuối /s/ · /z/ · /ɪz/ (bài Nói).",
        "Ngày 20 — âm yếu trong hội thoại nhanh (bài Nghe).",
        "Ngày 21 — /ð/ trong although · whereas (bài Nghe).",
        "Ngày 22 — đuôi -ed + nối âm (bài Nói).",
        "Ngày 23 — ngữ điệu đối lập (bài Nói) · Ngày 24 — ngữ điệu của người giảng (bài Nghe).",
        "Mỗi khối đọc lại một lượt; mục nào máy chấm dưới 80 điểm thì đọc thêm ba lần.",
      ] },

      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        head: ["Kết quả", "Nghĩa là", "Việc làm tiếp"],
        rows: [
          ["Đạt cả 8 phần", "Bạn đã chắc chặng 4", "Sang Ngày 25 (cụm danh từ phức · danh hoá)"],
          ["Trượt 1–2 phần", "Có lỗ hổng cụ thể", "Ôn đúng các Ngày ghi ở tên phần, 2 ngày sau làm lại **riêng phần đó**"],
          ["Trượt ≥ 3 phần", "Chặng này đi hơi nhanh", "Dành 3 ngày ôn Ngày 19–24 (mỗi ngày 2 bài), rồi làm lại cả bài"],
          ["Viết / Nói dưới 5.5", "Kỹ năng sản sinh còn yếu", "Viết lại bài theo nhận xét AI (Ngày 2: ba phiên bản); ghi âm lại sau 1 ngày"],
        ],
      },
      { t: "note", title: "Đọc kết quả", items: [
        "Nghe 9/13 và Đọc 9/13 tương ứng khoảng 27–28/40 nếu giữ tỉ lệ trên cả đề — trên mốc band 6 (23/40). Nhưng đây là bài ngắn; con số đáng tin hơn là **Đề 5** cuối tập.",
        "Band Viết / Nói do AI chấm là **ước tính**; nhìn nhận xét từng tiêu chí hơn là con số.",
        "Ghi ngày làm + điểm 8 phần vào sổ. Trước khi thi Đề 5, mở lại để biết mình cần ôn gì.",
        "Chặng 5 (Ngày 25–30) là chặng cuối: cụm danh từ, dấu câu, bảng tự soát 6 lượt, hai đề Listening / Reading đủ và Giám khảo AI 14 phút.",
        "Nghỉ một buổi trước khi sang chặng mới — não cần thời gian xếp lại những gì vừa học.",
      ] },
    ],
  },
];
