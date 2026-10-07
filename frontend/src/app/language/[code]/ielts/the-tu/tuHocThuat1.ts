/**
 * Từ vựng học thuật IELTS theo chủ đề — PHẦN 1 (chủ đề 1–15). TỰ SOẠN 07/10/2026.
 * Mỗi dòng: `từ|loại từ|IPA (Anh-Anh)|nghĩa tiếng Việt|câu ví dụ tiếng Anh|collocation hay đi kèm`.
 * Chọn từ người học band 5–6 hay THIẾU khi viết/nói band 7+: không có từ quá cơ bản (đã có ở chặng 1–2).
 */
export type ChuDeTu = { id: string; ten: string; icon: string; ds: string };

export const TU_HOC_THUAT_1: ChuDeTu[] = [
  {
    id: 'ht-giao-duc', ten: 'Education', icon: '🎓', ds: `
curriculum|n|/kəˈrɪkjələm/|chương trình giảng dạy|The national curriculum now includes basic coding.|a broad curriculum
compulsory|adj|/kəmˈpʌlsəri/|bắt buộc|Education is compulsory until the age of sixteen.|compulsory subject
tuition|n|/tjuˈɪʃn/|học phí; sự giảng dạy|Tuition fees have risen sharply in recent years.|tuition fees
literacy|n|/ˈlɪtərəsi/|khả năng đọc viết|Adult literacy rates have improved across the region.|literacy rate
numeracy|n|/ˈnjuːmərəsi/|khả năng tính toán|Employers complain about poor numeracy among school leavers.|basic numeracy
assessment|n|/əˈsesmənt/|sự đánh giá, kiểm tra|Continuous assessment reduces the pressure of final exams.|continuous assessment
academic|adj|/ˌækəˈdemɪk/|thuộc học thuật|She has an excellent academic record.|academic performance
vocational|adj|/vəʊˈkeɪʃənl/|thuộc dạy nghề|Vocational courses prepare students for specific trades.|vocational training
enrol|v|/ɪnˈrəʊl/|đăng ký nhập học|More adults are enrolling in online courses.|enrol on a course
graduate|n|/ˈɡrædʒuət/|người tốt nghiệp|Many graduates struggle to find jobs in their field.|recent graduates
dropout|n|/ˈdrɒpaʊt/|người bỏ học|The dropout rate is highest in rural areas.|dropout rate
discipline|n|/ˈdɪsəplɪn/|kỷ luật; ngành học|Strict discipline does not always lead to better results.|maintain discipline
rote learning|n|/ˌrəʊt ˈlɜːnɪŋ/|học vẹt|Rote learning leaves little room for critical thinking.|rely on rote learning
critical thinking|n|/ˌkrɪtɪkl ˈθɪŋkɪŋ/|tư duy phản biện|Universities aim to develop critical thinking.|develop critical thinking
scholarship|n|/ˈskɒləʃɪp/|học bổng|He won a full scholarship to study abroad.|be awarded a scholarship
mentor|n|/ˈmentɔː(r)/|người hướng dẫn, cố vấn|Every new student is assigned a mentor.|act as a mentor
lifelong learning|n|/ˌlaɪflɒŋ ˈlɜːnɪŋ/|học tập suốt đời|Lifelong learning is essential in a changing job market.|promote lifelong learning
distance learning|n|/ˌdɪstəns ˈlɜːnɪŋ/|học từ xa|Distance learning gives working adults more flexibility.|distance learning programme
acquire|v|/əˈkwaɪə(r)/|đạt được, tiếp thu|Children acquire languages remarkably quickly.|acquire skills
expertise|n|/ˌekspɜːˈtiːz/|chuyên môn|Teachers need expertise as well as patience.|technical expertise
` },
  {
    id: 'ht-cong-viec', ten: 'Work & Careers', icon: '💼', ds: `
employment|n|/ɪmˈplɔɪmənt/|việc làm|Full-time employment is harder to find than before.|full-time employment
unemployment|n|/ˌʌnɪmˈplɔɪmənt/|thất nghiệp|Youth unemployment remains a serious problem.|unemployment rate
recruit|v|/rɪˈkruːt/|tuyển dụng|The company plans to recruit fifty new engineers.|recruit staff
candidate|n|/ˈkændɪdət/|ứng viên|The ideal candidate will speak two languages.|suitable candidate
qualification|n|/ˌkwɒlɪfɪˈkeɪʃn/|bằng cấp, trình độ|Formal qualifications are not everything.|professional qualifications
promotion|n|/prəˈməʊʃn/|sự thăng chức|She was offered a promotion after two years.|get a promotion
colleague|n|/ˈkɒliːɡ/|đồng nghiệp|I get on well with my colleagues.|a close colleague
workload|n|/ˈwɜːkləʊd/|khối lượng công việc|Heavy workloads are a major cause of stress.|a heavy workload
flexible|adj|/ˈfleksəbl/|linh hoạt|Flexible working hours suit parents with young children.|flexible working hours
remote|adj|/rɪˈməʊt/|từ xa; hẻo lánh|Remote work has become common since 2020.|work remotely
productivity|n|/ˌprɒdʌkˈtɪvəti/|năng suất|Shorter weeks may actually raise productivity.|boost productivity
job satisfaction|n|/ˌdʒɒb sætɪsˈfækʃn/|sự hài lòng với công việc|Job satisfaction matters more than salary for many people.|high job satisfaction
salary|n|/ˈsæləri/|lương (tháng/năm)|Starting salaries in IT are relatively high.|a competitive salary
incentive|n|/ɪnˈsentɪv/|động lực, khuyến khích|Bonuses are an incentive to work harder.|financial incentive
redundant|adj|/rɪˈdʌndənt/|bị cho nghỉ việc; thừa|Hundreds of workers were made redundant.|be made redundant
self-employed|adj|/ˌself ɪmˈplɔɪd/|tự làm chủ|Being self-employed means having no fixed income.|self-employed worker
internship|n|/ˈɪntɜːnʃɪp/|kỳ thực tập|An internship can lead to a permanent job.|do an internship
work-life balance|n|/ˌwɜːk laɪf ˈbæləns/|cân bằng công việc – cuộc sống|Long commutes damage work-life balance.|achieve a work-life balance
burnout|n|/ˈbɜːnaʊt/|kiệt sức vì công việc|Burnout is increasingly common among young doctors.|suffer from burnout
entrepreneur|n|/ˌɒntrəprəˈnɜː(r)/|doanh nhân khởi nghiệp|Young entrepreneurs need access to cheap loans.|a successful entrepreneur
` },
  {
    id: 'ht-cong-nghe', ten: 'Technology', icon: '💻', ds: `
innovation|n|/ˌɪnəˈveɪʃn/|sự đổi mới, cải tiến|Innovation drives long-term economic growth.|technological innovation
device|n|/dɪˈvaɪs/|thiết bị|Most teenagers own at least one mobile device.|electronic device
automation|n|/ˌɔːtəˈmeɪʃn/|tự động hoá|Automation could replace many routine jobs.|increased automation
artificial intelligence|n|/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/|trí tuệ nhân tạo|Artificial intelligence is changing how doctors diagnose disease.|advances in artificial intelligence
digital|adj|/ˈdɪdʒɪtl/|thuộc kỹ thuật số|Digital skills are now essential in most jobs.|digital literacy
obsolete|adj|/ˈɒbsəliːt/|lỗi thời|Fax machines have become almost obsolete.|become obsolete
cutting-edge|adj|/ˌkʌtɪŋ ˈedʒ/|tiên tiến nhất|The lab uses cutting-edge equipment.|cutting-edge technology
breakthrough|n|/ˈbreɪkθruː/|bước đột phá|Scientists have made a breakthrough in battery design.|a major breakthrough
privacy|n|/ˈprɪvəsi/|quyền riêng tư|Social networks raise serious privacy concerns.|invasion of privacy
cybersecurity|n|/ˌsaɪbəsɪˈkjʊərəti/|an ninh mạng|Banks invest heavily in cybersecurity.|cybersecurity threats
user-friendly|adj|/ˌjuːzə ˈfrendli/|dễ sử dụng|The new app is far more user-friendly.|a user-friendly interface
access|v|/ˈækses/|truy cập, tiếp cận|Students can access the library online.|access information
rely on|phr v|/rɪˈlaɪ ɒn/|phụ thuộc vào|We rely on our phones for almost everything.|rely heavily on
addictive|adj|/əˈdɪktɪv/|gây nghiện|Many games are deliberately addictive.|highly addictive
screen time|n|/ˈskriːn taɪm/|thời gian dùng màn hình|Parents worry about children's screen time.|limit screen time
online platform|n|/ˌɒnlaɪn ˈplætfɔːm/|nền tảng trực tuyến|Small firms sell through online platforms.|use an online platform
gadget|n|/ˈɡædʒɪt/|thiết bị nhỏ, đồ công nghệ|The kitchen is full of useless gadgets.|the latest gadgets
data|n|/ˈdeɪtə/|dữ liệu|Companies collect vast amounts of personal data.|collect data
upgrade|v|/ˌʌpˈɡreɪd/|nâng cấp|Users are urged to upgrade their software.|upgrade a system
virtual|adj|/ˈvɜːtʃuəl/|ảo|Virtual meetings save time and travel costs.|virtual reality
` },
  {
    id: 'ht-moi-truong', ten: 'Environment', icon: '🌱', ds: `
pollution|n|/pəˈluːʃn/|sự ô nhiễm|Air pollution is a leading cause of illness in cities.|air pollution
emission|n|/iˈmɪʃn/|khí thải|Carbon emissions must be cut by half.|reduce emissions
climate change|n|/ˈklaɪmət tʃeɪndʒ/|biến đổi khí hậu|Climate change threatens low-lying coastal areas.|tackle climate change
global warming|n|/ˌɡləʊbl ˈwɔːmɪŋ/|sự nóng lên toàn cầu|Global warming is melting polar ice.|contribute to global warming
sustainable|adj|/səˈsteɪnəbl/|bền vững|We need more sustainable ways of producing food.|sustainable development
renewable|adj|/rɪˈnjuːəbl/|tái tạo được|Renewable energy is becoming cheaper every year.|renewable energy
deforestation|n|/ˌdiːˌfɒrɪˈsteɪʃn/|nạn phá rừng|Deforestation destroys the habitats of many species.|large-scale deforestation
habitat|n|/ˈhæbɪtæt/|môi trường sống|Wetlands provide a habitat for migrating birds.|natural habitat
endangered|adj|/ɪnˈdeɪndʒəd/|có nguy cơ tuyệt chủng|The tiger is an endangered species.|endangered species
biodiversity|n|/ˌbaɪəʊdaɪˈvɜːsəti/|đa dạng sinh học|Coral reefs have extremely high biodiversity.|loss of biodiversity
recycle|v|/ˌriːˈsaɪkl/|tái chế|Most plastic is never recycled.|recycle waste
waste|n|/weɪst/|rác thải; sự lãng phí|Households produce too much food waste.|household waste
landfill|n|/ˈlændfɪl/|bãi chôn lấp rác|Landfill sites are running out of space.|landfill site
contaminate|v|/kənˈtæmɪneɪt/|làm ô nhiễm|Chemicals from factories contaminated the river.|contaminate water supplies
fossil fuel|n|/ˈfɒsl fjuːəl/|nhiên liệu hoá thạch|Our dependence on fossil fuels must end.|burn fossil fuels
carbon footprint|n|/ˌkɑːbən ˈfʊtprɪnt/|lượng khí carbon thải ra|Flying greatly increases your carbon footprint.|reduce your carbon footprint
drought|n|/draʊt/|hạn hán|The drought ruined this year's harvest.|severe drought
flood|n|/flʌd/|lũ lụt|Heavy rain caused floods across the delta.|flood defences
conservation|n|/ˌkɒnsəˈveɪʃn/|sự bảo tồn|Wildlife conservation needs public support.|conservation efforts
ecosystem|n|/ˈiːkəʊsɪstəm/|hệ sinh thái|Plastic waste damages marine ecosystems.|fragile ecosystem
` },
  {
    id: 'ht-suc-khoe', ten: 'Health', icon: '🩺', ds: `
obesity|n|/əʊˈbiːsəti/|béo phì|Childhood obesity has doubled in twenty years.|childhood obesity
sedentary|adj|/ˈsedntri/|ít vận động|A sedentary lifestyle increases the risk of heart disease.|sedentary lifestyle
nutrition|n|/njuˈtrɪʃn/|dinh dưỡng|Good nutrition is vital in the first years of life.|poor nutrition
diet|n|/ˈdaɪət/|chế độ ăn|A balanced diet includes plenty of vegetables.|a balanced diet
chronic|adj|/ˈkrɒnɪk/|mãn tính|Diabetes is a chronic condition.|chronic illness
epidemic|n|/ˌepɪˈdemɪk/|dịch bệnh|The city faced a flu epidemic last winter.|an epidemic of
prevention|n|/prɪˈvenʃn/|sự phòng ngừa|Prevention is better than cure.|disease prevention
symptom|n|/ˈsɪmptəm/|triệu chứng|Fever is a common symptom of infection.|early symptoms
treatment|n|/ˈtriːtmənt/|sự điều trị|The treatment is expensive but effective.|receive treatment
life expectancy|n|/ˈlaɪf ɪkspektənsi/|tuổi thọ trung bình|Life expectancy has risen steadily.|average life expectancy
well-being|n|/ˌwel ˈbiːɪŋ/|sự khoẻ mạnh, hạnh phúc|Exercise improves mental well-being.|mental well-being
vaccine|n|/ˈvæksiːn/|vắc-xin|The vaccine is free for children.|develop a vaccine
healthcare|n|/ˈhelθkeə(r)/|chăm sóc sức khoẻ|Everyone should have access to healthcare.|healthcare system
stress|n|/stres/|căng thẳng|Exams cause a great deal of stress.|reduce stress
mental health|n|/ˌmentl ˈhelθ/|sức khoẻ tinh thần|Schools should talk openly about mental health.|mental health problems
processed food|n|/ˌprəʊsest ˈfuːd/|thực phẩm chế biến sẵn|Processed food often contains too much salt.|eat processed food
infection|n|/ɪnˈfekʃn/|sự nhiễm trùng|Washing hands reduces the risk of infection.|risk of infection
recover|v|/rɪˈkʌvə(r)/|hồi phục|She recovered quickly after the operation.|recover from an illness
physical activity|n|/ˌfɪzɪkl ækˈtɪvəti/|hoạt động thể chất|Adults need at least 150 minutes of physical activity a week.|regular physical activity
detrimental|adj|/ˌdetrɪˈmentl/|có hại|Lack of sleep is detrimental to health.|detrimental effect on
` },
  {
    id: 'ht-do-thi', ten: 'Cities & Housing', icon: '🏙️', ds: `
urbanisation|n|/ˌɜːbənaɪˈzeɪʃn/|đô thị hoá|Rapid urbanisation puts pressure on housing.|rapid urbanisation
infrastructure|n|/ˈɪnfrəstrʌktʃə(r)/|cơ sở hạ tầng|The city must invest in its infrastructure.|transport infrastructure
congestion|n|/kənˈdʒestʃən/|tắc nghẽn|Traffic congestion wastes millions of hours every year.|traffic congestion
overcrowded|adj|/ˌəʊvəˈkraʊdɪd/|quá đông đúc|Many schools in the capital are overcrowded.|overcrowded cities
affordable|adj|/əˈfɔːdəbl/|giá phải chăng|There is a shortage of affordable housing.|affordable housing
residential|adj|/ˌrezɪˈdenʃl/|thuộc khu dân cư|Factories are not allowed in residential areas.|residential area
suburb|n|/ˈsʌbɜːb/|vùng ngoại ô|Many families move to the suburbs for more space.|live in the suburbs
inhabitant|n|/ɪnˈhæbɪtənt/|cư dân|The town has about 20,000 inhabitants.|local inhabitants
amenity|n|/əˈmiːnəti/|tiện ích|The area lacks basic amenities such as shops.|local amenities
high-rise|adj|/ˈhaɪ raɪz/|cao tầng|High-rise flats house thousands of people.|high-rise buildings
green space|n|/ˌɡriːn ˈspeɪs/|không gian xanh|Green spaces improve residents' health.|public green space
slum|n|/slʌm/|khu ổ chuột|Millions still live in slums without clean water.|slum areas
renovate|v|/ˈrenəveɪt/|cải tạo, tân trang|The old factory was renovated into flats.|renovate a building
rent|n|/rent/|tiền thuê|Rents in the city centre have doubled.|pay rent
pedestrian|n|/pəˈdestriən/|người đi bộ|The street is now only for pedestrians.|pedestrian zone
noise|n|/nɔɪz/|tiếng ồn|Noise from traffic disturbs people's sleep.|noise pollution
crime rate|n|/ˈkraɪm reɪt/|tỷ lệ tội phạm|The crime rate fell after more street lights were added.|a low crime rate
homeless|adj|/ˈhəʊmləs/|vô gia cư|The number of homeless people is rising.|homeless people
commute|v|/kəˈmjuːt/|đi lại (giữa nhà và nơi làm)|I commute by train every day.|commute to work
sprawl|n|/sprɔːl/|sự lan rộng (đô thị)|Urban sprawl swallows farmland.|urban sprawl
` },
  {
    id: 'ht-giao-thong', ten: 'Transport', icon: '🚆', ds: `
public transport|n|/ˌpʌblɪk ˈtrænspɔːt/|giao thông công cộng|Cheap public transport reduces car use.|use public transport
vehicle|n|/ˈviːəkl/|phương tiện|Electric vehicles are becoming more popular.|electric vehicle
fuel|n|/ˈfjuːəl/|nhiên liệu|Fuel prices rose sharply last year.|fuel consumption
rush hour|n|/ˈrʌʃ aʊə(r)/|giờ cao điểm|Trains are packed during rush hour.|in the rush hour
toll|n|/təʊl/|phí cầu đường|Drivers pay a toll to enter the centre.|road toll
cycle lane|n|/ˈsaɪkl leɪn/|làn xe đạp|New cycle lanes have made cycling safer.|build cycle lanes
fare|n|/feə(r)/|giá vé|Bus fares are free for students.|train fare
accident|n|/ˈæksɪdənt/|tai nạn|Speeding is a major cause of road accidents.|road accident
speed limit|n|/ˈspiːd lɪmɪt/|giới hạn tốc độ|The speed limit near schools is 30 km/h.|exceed the speed limit
freight|n|/freɪt/|hàng hoá vận chuyển|Most freight is carried by road.|freight transport
destination|n|/ˌdestɪˈneɪʃn/|điểm đến|Hanoi is a popular destination for tourists.|popular destination
route|n|/ruːt/|tuyến đường|This bus route serves the airport.|bus route
journey|n|/ˈdʒɜːni/|chuyến đi|The journey takes about two hours.|a long journey
reliable|adj|/rɪˈlaɪəbl/|đáng tin cậy|The metro is fast and reliable.|reliable service
subsidise|v|/ˈsʌbsɪdaɪz/|trợ giá|The government subsidises rail travel.|heavily subsidised
car ownership|n|/ˈkɑːr əʊnəʃɪp/|việc sở hữu ô tô|Car ownership has grown rapidly in Asia.|rising car ownership
gridlock|n|/ˈɡrɪdlɒk/|kẹt xe hoàn toàn|The city centre was in gridlock for hours.|traffic gridlock
emission-free|adj|/ɪˈmɪʃn friː/|không phát thải|Emission-free buses now run in the centre.|emission-free vehicles
infrastructure project|n|/ˈɪnfrəstrʌktʃə ˌprɒdʒekt/|dự án hạ tầng|The bridge is the country's largest infrastructure project.|a major infrastructure project
navigate|v|/ˈnævɪɡeɪt/|định hướng, tìm đường|Tourists navigate the city using their phones.|navigate the streets
` },
  {
    id: 'ht-truyen-thong', ten: 'Media & Advertising', icon: '📺', ds: `
advertisement|n|/ədˈvɜːtɪsmənt/|quảng cáo|Advertisements aimed at children should be banned.|television advertisement
consumer|n|/kənˈsjuːmə(r)/|người tiêu dùng|Consumers are becoming more environmentally aware.|consumer behaviour
persuade|v|/pəˈsweɪd/|thuyết phục|Adverts persuade us to buy things we do not need.|persuade somebody to do
influence|v|/ˈɪnfluəns/|ảnh hưởng|Celebrities influence young people's choices.|strongly influence
mislead|v|/ˌmɪsˈliːd/|đánh lừa|Some adverts mislead customers about prices.|misleading information
journalism|n|/ˈdʒɜːnəlɪzəm/|nghề báo|Good journalism holds the powerful to account.|investigative journalism
headline|n|/ˈhedlaɪn/|tiêu đề báo|The story made headlines around the world.|make headlines
coverage|n|/ˈkʌvərɪdʒ/|sự đưa tin|The election received extensive coverage.|media coverage
censorship|n|/ˈsensəʃɪp/|sự kiểm duyệt|Censorship limits freedom of expression.|strict censorship
broadcast|v|/ˈbrɔːdkɑːst/|phát sóng|The match was broadcast live.|broadcast live
social media|n|/ˌsəʊʃl ˈmiːdiə/|mạng xã hội|Social media spreads news within minutes.|on social media
misinformation|n|/ˌmɪsɪnfəˈmeɪʃn/|thông tin sai lệch|Misinformation spreads faster than corrections.|spread misinformation
audience|n|/ˈɔːdiəns/|khán giả, độc giả|The show attracts a young audience.|target audience
commercial|adj|/kəˈmɜːʃl/|thuộc thương mại|Commercial television depends on advertising.|commercial success
publicity|n|/pʌbˈlɪsəti/|sự quảng bá, chú ý của công chúng|The scandal brought unwanted publicity.|attract publicity
sponsor|v|/ˈspɒnsə(r)/|tài trợ|A bank sponsors the football league.|sponsor an event
brand|n|/brænd/|thương hiệu|Teenagers are very loyal to certain brands.|brand loyalty
reliable source|n|/rɪˌlaɪəbl ˈsɔːs/|nguồn tin đáng tin|Always check news against a reliable source.|from a reliable source
biased|adj|/ˈbaɪəst/|thiên vị|Some newspapers are clearly biased.|biased reporting
viral|adj|/ˈvaɪrəl/|lan truyền nhanh|The video went viral overnight.|go viral
` },
  {
    id: 'ht-phap-luat', ten: 'Crime & Law', icon: '⚖️', ds: `
offender|n|/əˈfendə(r)/|người phạm tội|Young offenders need education, not just punishment.|young offenders
punishment|n|/ˈpʌnɪʃmənt/|hình phạt|Harsh punishment does not always reduce crime.|severe punishment
prison sentence|n|/ˈprɪzn sentəns/|án tù|He received a five-year prison sentence.|serve a prison sentence
rehabilitation|n|/ˌriːəˌbɪlɪˈteɪʃn/|sự cải tạo, phục hồi|Rehabilitation helps prisoners return to society.|rehabilitation programmes
deter|v|/dɪˈtɜː(r)/|răn đe, ngăn chặn|Cameras deter shoplifters.|deter crime
legislation|n|/ˌledʒɪsˈleɪʃn/|luật pháp, sự lập pháp|New legislation bans smoking in public places.|introduce legislation
enforce|v|/ɪnˈfɔːs/|thi hành (luật)|The police struggle to enforce the speed limit.|enforce the law
illegal|adj|/ɪˈliːɡl/|bất hợp pháp|It is illegal to sell alcohol to minors.|illegal activities
victim|n|/ˈvɪktɪm/|nạn nhân|Victims of crime deserve support.|crime victims
juvenile|adj|/ˈdʒuːvənaɪl/|thuộc vị thành niên|Juvenile crime has fallen this decade.|juvenile delinquency
fine|n|/faɪn/|tiền phạt|Littering carries a heavy fine.|pay a fine
surveillance|n|/sɜːˈveɪləns/|sự giám sát|CCTV surveillance is everywhere in big cities.|under surveillance
commit|v|/kəˈmɪt/|phạm (tội)|Most crimes are committed by a small group.|commit a crime
reoffend|v|/ˌriːəˈfend/|tái phạm|Education reduces the chance that prisoners will reoffend.|likely to reoffend
community service|n|/kəˌmjuːnəti ˈsɜːvɪs/|lao động công ích|Minor offenders may do community service instead.|sentenced to community service
fraud|n|/frɔːd/|gian lận|Online fraud is increasing rapidly.|credit card fraud
justice|n|/ˈdʒʌstɪs/|công lý|Victims want to see justice done.|the justice system
evidence|n|/ˈevɪdəns/|bằng chứng|There is little evidence that longer sentences work.|strong evidence
law-abiding|adj|/ˈlɔː əbaɪdɪŋ/|tuân thủ pháp luật|Most citizens are law-abiding.|law-abiding citizens
violent|adj|/ˈvaɪələnt/|bạo lực|Violent crime is relatively rare here.|violent crime
` },
  {
    id: 'ht-xa-hoi', ten: 'Government & Society', icon: '🏛️', ds: `
authority|n|/ɔːˈθɒrəti/|chính quyền; quyền lực|Local authorities are responsible for rubbish collection.|local authorities
policy|n|/ˈpɒləsi/|chính sách|The new policy aims to reduce poverty.|government policy
allocate|v|/ˈæləkeɪt/|phân bổ|More funds should be allocated to education.|allocate resources
taxpayer|n|/ˈtækspeɪə(r)/|người nộp thuế|Taxpayers should not pay for failed banks.|taxpayers' money
welfare|n|/ˈwelfeə(r)/|phúc lợi|The welfare system supports the unemployed.|social welfare
inequality|n|/ˌɪnɪˈkwɒləti/|sự bất bình đẳng|Income inequality is growing in many countries.|reduce inequality
poverty|n|/ˈpɒvəti/|sự nghèo đói|Millions still live in extreme poverty.|live in poverty
citizen|n|/ˈsɪtɪzn/|công dân|Every citizen has the right to vote.|ordinary citizens
regulation|n|/ˌreɡjuˈleɪʃn/|quy định|Stricter regulations are needed for food safety.|strict regulations
fund|v|/fʌnd/|cấp vốn|Museums should be funded by the state.|publicly funded
priority|n|/praɪˈɒrəti/|ưu tiên|Health care should be a top priority.|a top priority
volunteer|n|/ˌvɒlənˈtɪə(r)/|tình nguyện viên|Volunteers help to run the local library.|work as a volunteer
community|n|/kəˈmjuːnəti/|cộng đồng|The festival brings the community together.|local community
discrimination|n|/dɪˌskrɪmɪˈneɪʃn/|sự phân biệt đối xử|Discrimination at work is illegal.|racial discrimination
equality|n|/iˈkwɒləti/|sự bình đẳng|Gender equality has improved but is not complete.|gender equality
campaign|n|/kæmˈpeɪn/|chiến dịch|A campaign was launched to stop drink-driving.|launch a campaign
measure|n|/ˈmeʒə(r)/|biện pháp|Governments should take measures to reduce traffic.|take measures
implement|v|/ˈɪmplɪment/|thực hiện, triển khai|The plan will be implemented next year.|implement a policy
public spending|n|/ˌpʌblɪk ˈspendɪŋ/|chi tiêu công|Public spending on health has risen.|cut public spending
bureaucracy|n|/bjʊəˈrɒkrəsi/|bộ máy quan liêu|Too much bureaucracy slows down new businesses.|reduce bureaucracy
` },
  {
    id: 'ht-kinh-te', ten: 'Economy & Business', icon: '📈', ds: `
economy|n|/ɪˈkɒnəmi/|nền kinh tế|Tourism is vital to the local economy.|a growing economy
growth|n|/ɡrəʊθ/|sự tăng trưởng|Economic growth slowed last year.|economic growth
inflation|n|/ɪnˈfleɪʃn/|lạm phát|High inflation makes food more expensive.|rising inflation
recession|n|/rɪˈseʃn/|suy thoái|Many firms closed during the recession.|economic recession
investment|n|/ɪnˈvestmənt/|sự đầu tư|Foreign investment created thousands of jobs.|foreign investment
revenue|n|/ˈrevənjuː/|doanh thu|Advertising is the main source of revenue.|tax revenue
profit|n|/ˈprɒfɪt/|lợi nhuận|The company doubled its profits.|make a profit
competitive|adj|/kəmˈpetətɪv/|cạnh tranh|The phone market is extremely competitive.|highly competitive
consumption|n|/kənˈsʌmpʃn/|sự tiêu thụ|Meat consumption is rising in Asia.|energy consumption
export|n|/ˈekspɔːt/|xuất khẩu|Rice is the country's main export.|export market
import|n|/ˈɪmpɔːt/|nhập khẩu|The country relies on imports of oil.|import duties
budget|n|/ˈbʌdʒɪt/|ngân sách|The project went over budget.|on a tight budget
expenditure|n|/ɪkˈspendɪtʃə(r)/|khoản chi tiêu|Household expenditure on food has fallen.|public expenditure
multinational|n|/ˌmʌltiˈnæʃnəl/|công ty đa quốc gia|Multinationals often pay little tax.|large multinationals
start-up|n|/ˈstɑːt ʌp/|công ty khởi nghiệp|Tech start-ups attract young graduates.|a tech start-up
market share|n|/ˌmɑːkɪt ˈʃeə(r)/|thị phần|The brand lost market share to cheaper rivals.|increase market share
loan|n|/ləʊn/|khoản vay|Students take out loans to pay fees.|take out a loan
debt|n|/det/|khoản nợ|Many graduates are in debt for years.|be in debt
prosperity|n|/prɒˈsperəti/|sự thịnh vượng|Trade brought prosperity to the region.|economic prosperity
supply chain|n|/səˈplaɪ tʃeɪn/|chuỗi cung ứng|The flood disrupted global supply chains.|global supply chains
` },
  {
    id: 'ht-khoa-hoc', ten: 'Science & Research', icon: '🔬', ds: `
hypothesis|n|/haɪˈpɒθəsɪs/|giả thuyết|The experiment was designed to test a hypothesis.|test a hypothesis
experiment|n|/ɪkˈsperɪmənt/|thí nghiệm|Scientists carried out a series of experiments.|carry out an experiment
evidence-based|adj|/ˈevɪdəns beɪst/|dựa trên bằng chứng|Policy should be evidence-based.|evidence-based approach
findings|n|/ˈfaɪndɪŋz/|kết quả nghiên cứu|The findings were published in a journal.|research findings
conduct|v|/kənˈdʌkt/|tiến hành|The study was conducted over ten years.|conduct research
analyse|v|/ˈænəlaɪz/|phân tích|Researchers analysed data from 5,000 patients.|analyse data
sample|n|/ˈsɑːmpl/|mẫu|The sample included people of all ages.|a large sample
significant|adj|/sɪɡˈnɪfɪkənt/|đáng kể; có ý nghĩa|There was a significant increase in sales.|statistically significant
phenomenon|n|/fəˈnɒmɪnən/|hiện tượng|Fast fashion is a recent phenomenon.|a natural phenomenon
theory|n|/ˈθɪəri/|lý thuyết|His theory was later proved correct.|a scientific theory
laboratory|n|/ləˈbɒrətri/|phòng thí nghiệm|The samples were tested in a laboratory.|laboratory tests
discovery|n|/dɪˈskʌvəri/|sự phát hiện|The discovery changed modern medicine.|a major discovery
funding|n|/ˈfʌndɪŋ/|kinh phí|Research funding has been cut.|research funding
peer review|n|/ˌpɪə rɪˈvjuː/|bình duyệt|All papers go through peer review.|peer-reviewed journal
variable|n|/ˈveəriəbl/|biến số|Age was an important variable in the study.|a key variable
correlation|n|/ˌkɒrəˈleɪʃn/|sự tương quan|There is a correlation between income and health.|a strong correlation
conclusive|adj|/kənˈkluːsɪv/|có tính kết luận|The results are not yet conclusive.|conclusive evidence
replicate|v|/ˈreplɪkeɪt/|lặp lại (thí nghiệm)|Other teams failed to replicate the results.|replicate a study
ethical|adj|/ˈeθɪkl/|thuộc đạo đức|Animal testing raises ethical questions.|ethical issues
innovative|adj|/ˈɪnəveɪtɪv/|đổi mới, sáng tạo|The team used an innovative method.|an innovative approach
` },
  {
    id: 'ht-van-hoa', ten: 'Culture & Tradition', icon: '🏮', ds: `
heritage|n|/ˈherɪtɪdʒ/|di sản|Hoi An is part of our cultural heritage.|cultural heritage
custom|n|/ˈkʌstəm/|phong tục|It is a custom to give red envelopes at Tet.|local customs
tradition|n|/trəˈdɪʃn/|truyền thống|Family traditions are disappearing in big cities.|keep a tradition alive
identity|n|/aɪˈdentəti/|bản sắc|Language is central to national identity.|cultural identity
diversity|n|/daɪˈvɜːsəti/|sự đa dạng|London is famous for its cultural diversity.|cultural diversity
preserve|v|/prɪˈzɜːv/|bảo tồn|We must preserve traditional crafts.|preserve traditions
ritual|n|/ˈrɪtʃuəl/|nghi lễ|Weddings involve many ancient rituals.|religious ritual
festival|n|/ˈfestɪvl/|lễ hội|The festival attracts thousands of visitors.|a traditional festival
ancestor|n|/ˈænsestə(r)/|tổ tiên|Many families worship their ancestors.|worship ancestors
generation|n|/ˌdʒenəˈreɪʃn/|thế hệ|Stories are passed from one generation to the next.|younger generation
values|n|/ˈvæljuːz/|giá trị (quan niệm)|Parents pass on their values to children.|traditional values
assimilate|v|/əˈsɪməleɪt/|hoà nhập, đồng hoá|Immigrants often assimilate within a generation.|assimilate into society
folklore|n|/ˈfəʊklɔː(r)/|văn hoá dân gian|Dragons appear often in Asian folklore.|local folklore
craft|n|/krɑːft/|nghề thủ công|Pottery is a traditional craft in Bat Trang.|traditional crafts
globalised|adj|/ˈɡləʊbəlaɪzd/|toàn cầu hoá|In a globalised world, cultures influence each other.|a globalised world
multicultural|adj|/ˌmʌltiˈkʌltʃərəl/|đa văn hoá|Singapore is a multicultural society.|multicultural society
landmark|n|/ˈlændmɑːk/|địa danh nổi tiếng|The bridge is the city's best-known landmark.|historic landmark
museum|n|/mjuˈziːəm/|bảo tàng|Should museums be free to enter?|visit a museum
monument|n|/ˈmɒnjumənt/|tượng đài, di tích|Ancient monuments need protection.|historic monument
erode|v|/ɪˈrəʊd/|làm xói mòn|Tourism can erode local culture.|erode traditions
` },
  {
    id: 'ht-du-lich', ten: 'Tourism & Travel', icon: '✈️', ds: `
tourism|n|/ˈtʊərɪzəm/|du lịch|Tourism brings money but also pollution.|mass tourism
eco-tourism|n|/ˈiːkəʊ tʊərɪzəm/|du lịch sinh thái|Eco-tourism supports local communities.|promote eco-tourism
attraction|n|/əˈtrækʃn/|điểm tham quan|The castle is the main tourist attraction.|tourist attraction
accommodation|n|/əˌkɒməˈdeɪʃn/|chỗ ở|Accommodation is expensive in summer.|cheap accommodation
itinerary|n|/aɪˈtɪnərəri/|lịch trình|Our itinerary includes three cities.|a detailed itinerary
souvenir|n|/ˌsuːvəˈnɪə(r)/|quà lưu niệm|Tourists buy souvenirs in the old quarter.|buy souvenirs
peak season|n|/ˈpiːk siːzn/|mùa cao điểm|Prices double in peak season.|during peak season
overseas|adv|/ˌəʊvəˈsiːz/|ở nước ngoài|More students are studying overseas.|travel overseas
hospitality|n|/ˌhɒspɪˈtæləti/|lòng hiếu khách; ngành khách sạn|Vietnamese hospitality is famous.|the hospitality industry
explore|v|/ɪkˈsplɔː(r)/|khám phá|We spent a week exploring the mountains.|explore the area
breathtaking|adj|/ˈbreθteɪkɪŋ/|đẹp ngoạn mục|The view from the top is breathtaking.|breathtaking scenery
picturesque|adj|/ˌpɪktʃəˈresk/|đẹp như tranh|It is a picturesque fishing village.|a picturesque village
crowded|adj|/ˈkraʊdɪd/|đông đúc|The beach gets very crowded in July.|crowded streets
budget travel|n|/ˌbʌdʒɪt ˈtrævl/|du lịch tiết kiệm|Budget travel is popular with students.|budget travellers
jet lag|n|/ˈdʒet læɡ/|mệt mỏi do lệch múi giờ|I always suffer from jet lag after long flights.|suffer from jet lag
visa|n|/ˈviːzə/|thị thực|You need a visa to enter the country.|apply for a visa
off the beaten track|idiom|/ɒf ðə ˌbiːtn ˈtræk/|nơi ít người biết đến|We prefer places off the beaten track.|travel off the beaten track
broaden|v|/ˈbrɔːdn/|mở rộng|Travel broadens the mind.|broaden your horizons
backpacker|n|/ˈbækpækə(r)/|khách du lịch ba lô|Backpackers stay in cheap hostels.|young backpackers
local cuisine|n|/ˌləʊkl kwɪˈziːn/|ẩm thực địa phương|Trying the local cuisine is part of the experience.|sample the local cuisine
` },
  {
    id: 'ht-gia-dinh', ten: 'Family & Relationships', icon: '👨‍👩‍👧', ds: `
upbringing|n|/ˈʌpbrɪŋɪŋ/|sự nuôi dạy|She had a strict upbringing.|a strict upbringing
nuclear family|n|/ˌnjuːkliə ˈfæməli/|gia đình hạt nhân|The nuclear family is now the norm in cities.|the traditional nuclear family
extended family|n|/ɪkˌstendɪd ˈfæməli/|đại gia đình|We live with our extended family.|live with the extended family
sibling|n|/ˈsɪblɪŋ/|anh chị em ruột|I have two siblings.|older siblings
role model|n|/ˈrəʊl mɒdl/|tấm gương|Parents are children's first role models.|a positive role model
bond|n|/bɒnd/|sự gắn kết|Shared meals strengthen family bonds.|a strong bond
generation gap|n|/ˌdʒenəˈreɪʃn ɡæp/|khoảng cách thế hệ|Technology has widened the generation gap.|bridge the generation gap
peer pressure|n|/ˈpɪə preʃə(r)/|áp lực bạn bè|Teenagers are very sensitive to peer pressure.|give in to peer pressure
independent|adj|/ˌɪndɪˈpendənt/|độc lập|Students become more independent at university.|financially independent
responsibility|n|/rɪˌspɒnsəˈbɪləti/|trách nhiệm|Children should share household responsibilities.|take responsibility for
nurture|v|/ˈnɜːtʃə(r)/|nuôi dưỡng|Good teachers nurture students' talents.|nurture talent
divorce|n|/dɪˈvɔːs/|ly hôn|Divorce rates have risen in many countries.|divorce rate
elderly|adj|/ˈeldəli/|cao tuổi|Elderly parents often live with their children.|elderly people
caregiver|n|/ˈkeəɡɪvə(r)/|người chăm sóc|Many women are full-time caregivers.|family caregiver
spoil|v|/spɔɪl/|làm hư (chiều quá)|Grandparents sometimes spoil their grandchildren.|spoil a child
obedient|adj|/əˈbiːdiənt/|vâng lời|Obedient children are not always happy children.|obedient child
household|n|/ˈhaʊshəʊld/|hộ gia đình|Single-person households are increasing.|household chores
supportive|adj|/səˈpɔːtɪv/|hay giúp đỡ, ủng hộ|My parents were very supportive of my plans.|supportive family
conflict|n|/ˈkɒnflɪkt/|xung đột|Conflict between parents affects children.|resolve a conflict
companionship|n|/kəmˈpæniənʃɪp/|tình bạn đồng hành|Pets provide companionship for lonely people.|seek companionship
` },
];
