/**
 * Cloud AWS — Mục 0: Cloud là gì (soạn 19/11/2026, agent aws trên máy nhà).
 * GIỮ title chương + slug 4 bài của khung (seeder neo chương bằng slug bài đầu: aws-0-8-bat-dau-tai-day); thêm 0.3, 0.4, quiz 0.5.
 * Mọi output chạy thật trên máy nhà 19/11/2026 bằng scratchpad/aws/lab/m0/{chay.sh,tf.sh,gia.mjs}:
 *   AWS CLI 2.41.0 (ảnh amazon/aws-cli) · LocalStack 4.12.0 community (bản latest 2026 đòi auth token) · Moto (Budgets/IAM MFA —
 *   LocalStack community không có Budgets) · Terraform 1.17.2 + provider hashicorp/aws 6.73.0 · gitleaks · giá thật từ AWS Price
 *   List API (ap-southeast-1, công bố 11/2026) · độ trễ đo thật từ Việt Nam tới endpoint công khai từng region.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/hcl()/js() của _chung.mjs.
 */
import { bash, json, hcl, js, out, tl, giai } from './_chung.mjs';

/* ═══════════════════════════ Output thật dùng chung ═══════════════════════════ */
const OUT_API = out(`$ aws --version
aws-cli/2.41.0 Python/3.14.8 Linux/7.1.3-201.fc44.x86_64 docker/x86_64.amzn.2023
$ aws sts get-caller-identity
{
    "UserId": "AKIAIOSFODNN7EXAMPLE",
    "Account": "000000000000",
    "Arn": "arn:aws:iam::000000000000:root"
}
$ aws s3 mb s3://labflow-anh-demo
make_bucket: labflow-anh-demo
$ aws s3 cp chao.txt s3://labflow-anh-demo/chao.txt
upload: ./chao.txt to s3://labflow-anh-demo/chao.txt
$ aws s3 ls s3://labflow-anh-demo
2026-11-18 17:51:33         15 chao.txt`);
const OUT_KY = out(`$ aws s3 cp chao.txt s3://labflow-anh-demo/lan2.txt --debug 2>&1 | grep …
method=PUT, url=http://127.0.0.1:44566/labflow-anh-demo/lan2.txt
AWS4-HMAC-SHA256 Credential=test/20261118/ap-southeast-1/s3/aws4_request
Signature=24c6e6d024de055e`);

/* ═══════════════════════════ 0.8 — Bắt đầu tại đây (1/2) ═══════════════════════════ */
const L08_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What the cloud is, where it came from, and why employers ask for it</h2>
<p class="lead">Open any backend job posting in Vietnam — intern, fresher, mid-level — and there is a good chance it says “experience with AWS is a plus”. A senior engineer at an outsourcing company may even ask you over coffee: “Do you know cloud?” This course exists so that your honest answer becomes “yes — I have deployed a real API on AWS, I know what it costs, and I know how people get hacked on it”. This first lesson installs nothing. It explains what the cloud actually is, how it was born, and what you will be able to do at the end.</p>

<h3>The cloud in one sentence — then in a kitchen</h3>
<p><strong>Cloud computing is renting computing resources — machines, disks, databases, networks — from a provider over the Internet, created and destroyed in seconds by an API call, and paid for by the second or by the request.</strong></p>
<p>Think about eating. You can <em>build a kitchen at home</em> (buy a server, put it in a room, pay for power and Internet — “on-premises”). You can <em>rent a small kitchen by the month</em> (a VPS — what cuongthai.com runs on today). Or you can <em>order from a huge central kitchen</em> that has every appliance in the world, where you pay only for the dishes you order, and you can go from one dish to ten thousand dishes in a minute. That central kitchen is the cloud. The catch is in the last part: if you forget to cancel an order, the kitchen keeps cooking — and keeps billing you.</p>

<h3>Everything is an API — see it for yourself</h3>
<p>The single idea that makes the cloud different from “someone else's computer” is this: <strong>every resource is created by an API call</strong>. Clicking a button in the web console, typing a CLI command and running Terraform all end up as the same signed HTTPS request. Here is the real AWS CLI talking to LocalStack — a free AWS emulator you will install in lesson 0.4 — on the machine this course was written on:</p>
${OUT_API}
<p>And here is what that upload looked like on the wire. The CLI turned “copy this file” into an HTTP <code>PUT</code>, then signed it with a key, a date, a region and a service name — the signature scheme is called <strong>Signature Version 4 (SigV4)</strong>:</p>
${OUT_KY}
<p>That signature is why a leaked key is so dangerous (lesson 0.9): whoever holds the key can produce exactly the same requests as you, from anywhere in the world.</p>

<h3>A short history with real dates</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">2000–2003</span><span class="lz-t">Amazon's own pain</span><span class="lz-d">Amazon.com's teams kept rebuilding the same infrastructure for every project. The company forced every team to expose its work through service interfaces — the habit that later became AWS.</span></div>
  <div class="lz-step"><span class="lz-k">Nov 2004</span><span class="lz-t">SQS, the first public service</span><span class="lz-d">Simple Queue Service opens in beta: a message queue you rent by the request.</span></div>
  <div class="lz-step"><span class="lz-k">14 Mar 2006</span><span class="lz-t">Amazon S3</span><span class="lz-d">Storage priced per gigabyte per month, reachable from anywhere by HTTP. The day most people count as the birth of AWS.</span></div>
  <div class="lz-step"><span class="lz-k">25 Aug 2006</span><span class="lz-t">Amazon EC2 (beta)</span><span class="lz-d">Virtual machines by the hour. A start-up no longer needed to buy servers before it had customers.</span></div>
  <div class="lz-step"><span class="lz-k">2008–2014</span><span class="lz-t">Competitors and managed services</span><span class="lz-d">Google App Engine (2008), Microsoft Azure (2010), Amazon RDS (2009) for managed databases, AWS Lambda (2014) for “serverless”.</span></div>
  <div class="lz-step"><span class="lz-k">2026</span><span class="lz-t">Where we are now</span><span class="lz-d">AWS has dozens of regions and hundreds of services, and is still the largest provider — around a third of the cloud infrastructure market by most industry estimates, ahead of Microsoft Azure and Google Cloud.</span></div>
</div>

<h3>IaaS, PaaS, SaaS — who manages what</h3>
<p>Cloud services are often sorted by how much of the stack the provider runs for you. Back to the kitchen: IaaS is renting an empty kitchen, PaaS is renting a kitchen with a cook who follows your recipe, SaaS is eating at the restaurant.</p>
<table>
  <thead><tr><th>Model</th><th>You manage</th><th>Provider manages</th><th>AWS examples</th></tr></thead>
  <tbody>
    <tr><td><strong>IaaS</strong> — infrastructure</td><td>Operating system, runtime, app, data</td><td>Hardware, network, virtualisation</td><td>EC2, EBS, VPC</td></tr>
    <tr><td><strong>PaaS</strong> — platform</td><td>Your code and data</td><td>OS patches, runtime, scaling</td><td>Elastic Beanstalk, App Runner, RDS, Lambda</td></tr>
    <tr><td><strong>SaaS</strong> — software</td><td>Only your usage and settings</td><td>Everything</td><td>Amazon WorkMail, Gmail, Google Docs (not AWS)</td></tr>
  </tbody>
</table>
<p>This split is the seed of the <strong>shared responsibility model</strong>, a favourite exam topic: AWS is responsible for security <em>of</em> the cloud (data centres, hardware, the hypervisor); you are responsible for security <em>in</em> the cloud (who can log in, which ports are open, whether your bucket is public). Almost every disaster in lesson 0.9 happened on the customer's side of that line.</p>

<h3>The six advantages AWS itself lists (and the exam asks about)</h3>
<ul>
  <li><strong>Trade fixed expense for variable expense</strong> — no server purchase up front; pay as you use.</li>
  <li><strong>Benefit from massive economies of scale</strong> — AWS buys hardware by the million, so per-unit prices fall.</li>
  <li><strong>Stop guessing capacity</strong> — scale up for exam week, scale down after.</li>
  <li><strong>Increase speed and agility</strong> — a new database in minutes, not a purchase order in weeks.</li>
  <li><strong>Stop spending money running and maintaining data centres</strong>.</li>
  <li><strong>Go global in minutes</strong> — deploy close to users in another continent.</li>
</ul>
<p>Each has a flip side you will meet in this course: variable expense means a variable — sometimes shocking — bill; “minutes” means a mistake also spreads in minutes.</p>

<h3>What “knows AWS” means in a job posting</h3>
<p>For a backend intern or fresher, it rarely means “knows all 200 services”. In practice it means you can:</p>
<ol>
  <li>Create resources safely: an account with MFA and a budget alarm, IAM users/roles with least privilege.</li>
  <li>Deploy your API: a container on EC2 or ECS Fargate, a PostgreSQL database on RDS, files on S3, behind a load balancer.</li>
  <li>Automate it: Terraform for the infrastructure, GitHub Actions to build and deploy.</li>
  <li>Watch it: logs, metrics and alarms in CloudWatch.</li>
  <li>Not burn money or leak data: explain what each resource costs and what is public.</li>
</ol>
<p>That list <em>is</em> this course. At the end you deploy LabFlow — the lab-booking API you build in the Node.js and Spring Boot courses — to AWS the way a company would, and you get two chapters of practice for the <strong>AWS Certified Cloud Practitioner (CLF-C02)</strong> and <strong>Solutions Architect – Associate (SAA-C03)</strong> exams.</p>

<h3>The roadmap</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0</span><span class="lz-t">Safe start</span><span class="lz-d">What the cloud is, disasters, a safe account with a budget alarm, cloud vs VPS, regions, and your free local lab (LocalStack + Terraform).</span></div>
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">IAM and S3</span><span class="lz-d">Who can do what; storing files — and why cuongthai.com's Cloudflare R2 speaks the same protocol.</span></div>
  <div class="lz-step"><span class="lz-k">3–5</span><span class="lz-t">Network, servers, going public</span><span class="lz-d">VPC, EC2, load balancers, auto scaling, Route 53, CloudFront.</span></div>
  <div class="lz-step"><span class="lz-k">6–9</span><span class="lz-t">Data, containers, serverless, events</span><span class="lz-d">RDS + secrets, ECR + ECS Fargate, Lambda + API Gateway, SQS/SNS/EventBridge.</span></div>
  <div class="lz-step"><span class="lz-k">10–13</span><span class="lz-t">Operate like a professional</span><span class="lz-d">CloudWatch, Terraform for everything, CI/CD to ECS, cost and security.</span></div>
  <div class="lz-step"><span class="lz-k">14–16</span><span class="lz-t">Capstone and certifications</span><span class="lz-d">LabFlow on AWS production-style; CLF-C02 and SAA-C03 practice.</span></div>
</div>

<h3>What you need before you start</h3>
<ul>
  <li>Basic Linux commands and Docker (run a container, map a port). The Docker and Linux &amp; Bash courses on this site are enough.</li>
  <li>Git, and an API you can run — Node.js or Spring Boot, any small one.</li>
  <li>For lessons that touch the real AWS: a payment card (AWS verifies it at sign-up) and the discipline to follow every “clean up” step. Every demo in this course also runs <strong>for free</strong> on your own machine with LocalStack.</li>
</ul>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“What is cloud computing?”</strong> — On-demand delivery of IT resources over the Internet with pay-as-you-go pricing; resources are created by API in seconds instead of bought in weeks.</li>
  <li><strong>“IaaS vs PaaS vs SaaS — give an example of each on AWS.”</strong> — EC2 (you patch the OS), RDS or Lambda (AWS runs the platform), and a finished product such as Amazon WorkMail.</li>
  <li><strong>“What is the shared responsibility model?”</strong> — AWS secures the cloud itself; the customer secures what they put in it: identities, network rules, data, encryption settings.</li>
</ol>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
  <li>Open three backend job postings on ITviec, TopDev or LinkedIn and write down every cloud word they mention (AWS, EC2, S3, Docker, Kubernetes, CI/CD…).</li>
  <li>For each word, find the chapter of the roadmap above that teaches it.</li>
  <li>Write, in your own words, one sentence on what “security <em>in</em> the cloud” means for a student project.</li>
</ol>
<p><strong>Done when:</strong> you have a list of at least eight words, each mapped to a chapter, and one sentence you could say in an interview.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cloud computing</span><span class="v">Renting IT resources over the Internet, created by API, billed by usage.</span></div>
  <div class="kv"><span class="k">On-premises</span><span class="v">Servers you own and run in your own room or data centre.</span></div>
  <div class="kv"><span class="k">IaaS / PaaS / SaaS</span><span class="v">How much of the stack the provider runs: infrastructure, platform, or the whole software.</span></div>
  <div class="kv"><span class="k">Shared responsibility</span><span class="v">AWS secures the cloud; you secure what you put in it.</span></div>
  <div class="kv"><span class="k">API</span><span class="v">The signed HTTPS requests behind every console click, CLI command and Terraform run.</span></div>
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS's request-signing scheme: access key + date + region + service ⇒ signature.</span></div>
  <div class="kv"><span class="k">LocalStack</span><span class="v">A local emulator of AWS APIs; this course runs its demos on it for free.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The cloud is a central kitchen: rent exactly what you need by the second, created by API.</li>
  <li>Every action is a signed HTTPS request — the key is the identity.</li>
  <li>AWS started with SQS (2004), S3 and EC2 (2006); it is still the largest provider.</li>
  <li>IaaS/PaaS/SaaS differ in who manages the layers; shared responsibility splits security the same way.</li>
  <li>“Knows AWS” for a fresher = safe account, deploy an API, automate, watch, and not burn money.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html', '☁️', 'Overview of Amazon Web Services — Six advantages of cloud computing', 'The official whitepaper section the Cloud Practitioner exam is built on.')}
${tl('https://aws.amazon.com/compliance/shared-responsibility-model/', '🛡️', 'AWS Shared Responsibility Model', 'Who secures what — with the diagram used in every AWS training.')}

<h3>Sources</h3>
<ul>
  <li>Amazon S3 launch press release (14 March 2006): <a href="https://press.aboutamazon.com/2006/3/amazon-web-services-launches" target="_blank" rel="noopener">press.aboutamazon.com</a></li>
  <li>“Amazon EC2 Beta” — Jeff Barr, AWS News Blog (25 August 2006): <a href="https://aws.amazon.com/blogs/aws/amazon_ec2_beta/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/amazon_ec2_beta</a></li>
  <li>AWS whitepaper “Overview of Amazon Web Services”: <a href="https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html" target="_blank" rel="noopener">docs.aws.amazon.com/whitepapers/latest/aws-overview</a></li>
  <li>Signature Version 4: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html</a></li>
</ul>
</div>
`;

const L08_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Điện toán đám mây là gì, ra đời thế nào, và vì sao nhà tuyển dụng đòi</h2>
<p class="lead">Mở bất kỳ tin tuyển backend nào ở Việt Nam — thực tập, fresher hay mid — rất hay gặp dòng “biết AWS là lợi thế”. Một anh senior ở công ty outsourcing có thể hỏi bạn ngay lúc uống cà phê: “Em biết cloud không?”. Khoá này có mặt để câu trả lời thật lòng của bạn là “có — em đã tự đưa một API thật lên AWS, biết nó tốn bao nhiêu tiền, và biết người ta bị hack trên đó thế nào”. Bài đầu tiên chưa cài gì cả. Bài giải thích cloud thật ra là gì, ra đời ra sao, và học xong bạn làm được gì.</p>

<h3>Cloud trong một câu — rồi trong một căn bếp</h3>
<p><strong>Điện toán đám mây là THUÊ tài nguyên tính toán — máy chủ, ổ đĩa, cơ sở dữ liệu, mạng — của một nhà cung cấp qua Internet, tạo và xoá trong vài giây bằng một lời gọi API, trả tiền theo giây hoặc theo lượt dùng.</strong></p>
<p>Hãy nghĩ về chuyện ăn uống. Bạn có thể <em>tự xây bếp ở nhà</em> (mua máy chủ, đặt trong phòng, tự trả tiền điện, tiền mạng — gọi là “on-premises”). Bạn có thể <em>thuê một gian bếp nhỏ theo tháng</em> (một VPS — thứ cuongthai.com đang chạy hôm nay). Hoặc bạn <em>gọi món từ một bếp trung tâm khổng lồ</em> có đủ mọi thiết bị trên đời, gọi món nào trả tiền món đó, và từ một món nhảy lên mười nghìn món chỉ trong một phút. Bếp trung tâm đó chính là cloud. Cái bẫy nằm ở vế cuối: quên huỷ món đã gọi thì bếp vẫn nấu — và vẫn tính tiền.</p>

<h3>Mọi thứ là API — tự mắt thấy</h3>
<p>Ý tưởng làm cloud khác hẳn “máy tính của người khác” là: <strong>mọi tài nguyên đều được tạo bằng một lời gọi API</strong>. Bấm nút trên trang web console, gõ lệnh CLI hay chạy Terraform thì cuối cùng đều thành cùng một request HTTPS có chữ ký. Dưới đây là AWS CLI thật nói chuyện với LocalStack — bộ giả lập AWS miễn phí bạn sẽ cài ở bài 0.4 — chạy trên chính máy soạn khoá này:</p>
${OUT_API}
<p>Và đây là lần tải tệp đó khi đi trên dây mạng. CLI biến “chép tệp này lên” thành một request HTTP <code>PUT</code>, rồi ký nó bằng khoá, ngày, region và tên dịch vụ — kiểu chữ ký này tên là <strong>Signature Version 4 (SigV4)</strong>:</p>
${OUT_KY}
<p>Chính chữ ký này giải thích vì sao lộ khoá nguy hiểm đến thế (bài 0.9): ai cầm khoá cũng tạo được y hệt các request của bạn, từ bất cứ đâu trên thế giới.</p>

<h3>Lịch sử ngắn, có ngày tháng thật</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">2000–2003</span><span class="lz-t">Nỗi khổ của chính Amazon</span><span class="lz-d">Các nhóm ở Amazon.com cứ dựng đi dựng lại cùng một thứ hạ tầng cho mỗi dự án. Công ty buộc mọi nhóm phải mở công việc của mình qua giao diện dịch vụ — thói quen sau này thành AWS.</span></div>
  <div class="lz-step"><span class="lz-k">11/2004</span><span class="lz-t">SQS, dịch vụ công khai đầu tiên</span><span class="lz-d">Simple Queue Service mở bản beta: một hàng đợi tin nhắn thuê theo lượt gọi.</span></div>
  <div class="lz-step"><span class="lz-k">14/03/2006</span><span class="lz-t">Amazon S3</span><span class="lz-d">Lưu trữ tính tiền theo gigabyte mỗi tháng, truy cập từ mọi nơi qua HTTP. Ngày được nhiều người coi là ngày AWS ra đời.</span></div>
  <div class="lz-step"><span class="lz-k">25/08/2006</span><span class="lz-t">Amazon EC2 (beta)</span><span class="lz-d">Máy ảo thuê theo giờ. Start-up không còn phải mua máy chủ trước khi có khách hàng.</span></div>
  <div class="lz-step"><span class="lz-k">2008–2014</span><span class="lz-t">Đối thủ và dịch vụ được quản lý</span><span class="lz-d">Google App Engine (2008), Microsoft Azure (2010), Amazon RDS (2009) cho cơ sở dữ liệu được quản lý, AWS Lambda (2014) cho “serverless”.</span></div>
  <div class="lz-step"><span class="lz-k">2026</span><span class="lz-t">Hiện tại</span><span class="lz-d">AWS có vài chục region, vài trăm dịch vụ, và vẫn là nhà cung cấp lớn nhất — khoảng một phần ba thị trường hạ tầng cloud theo đa số ước tính của giới phân tích, đứng trước Microsoft Azure và Google Cloud.</span></div>
</div>

<h3>IaaS, PaaS, SaaS — ai quản lý cái gì</h3>
<p>Dịch vụ cloud hay được chia theo chuyện nhà cung cấp lo giúp bạn bao nhiêu tầng. Quay lại căn bếp: IaaS là thuê bếp trống, PaaS là thuê bếp có đầu bếp nấu theo công thức của bạn, SaaS là ra nhà hàng ngồi ăn.</p>
<table>
  <thead><tr><th>Mô hình</th><th>Bạn lo</th><th>Nhà cung cấp lo</th><th>Ví dụ trên AWS</th></tr></thead>
  <tbody>
    <tr><td><strong>IaaS</strong> — hạ tầng</td><td>Hệ điều hành, runtime, ứng dụng, dữ liệu</td><td>Phần cứng, mạng, ảo hoá</td><td>EC2, EBS, VPC</td></tr>
    <tr><td><strong>PaaS</strong> — nền tảng</td><td>Mã và dữ liệu của bạn</td><td>Vá hệ điều hành, runtime, co giãn</td><td>Elastic Beanstalk, App Runner, RDS, Lambda</td></tr>
    <tr><td><strong>SaaS</strong> — phần mềm</td><td>Chỉ cách dùng và cài đặt</td><td>Mọi thứ</td><td>Amazon WorkMail, Gmail, Google Docs (không phải AWS)</td></tr>
  </tbody>
</table>
<p>Cách chia này là mầm của <strong>mô hình trách nhiệm chung (shared responsibility model)</strong> — chủ đề đề thi rất thích: AWS chịu trách nhiệm bảo mật <em>của</em> cloud (trung tâm dữ liệu, phần cứng, tầng ảo hoá); bạn chịu trách nhiệm bảo mật <em>trong</em> cloud (ai được đăng nhập, cổng nào mở, bucket có công khai không). Gần như mọi thảm hoạ ở bài 0.9 đều xảy ra ở phía khách hàng của đường ranh này.</p>

<h3>Sáu lợi ích chính AWS tự liệt kê (và đề thi hỏi)</h3>
<ul>
  <li><strong>Đổi chi phí cố định thành chi phí biến đổi</strong> — không mua máy trước; dùng bao nhiêu trả bấy nhiêu.</li>
  <li><strong>Hưởng lợi từ quy mô khổng lồ</strong> — AWS mua phần cứng theo triệu chiếc nên giá mỗi đơn vị giảm.</li>
  <li><strong>Thôi đoán công suất</strong> — mùa thi tăng máy, thi xong giảm.</li>
  <li><strong>Nhanh và linh hoạt hơn</strong> — có cơ sở dữ liệu mới trong vài phút, không phải chờ đơn mua hàng vài tuần.</li>
  <li><strong>Thôi tốn tiền vận hành trung tâm dữ liệu</strong>.</li>
  <li><strong>Ra toàn cầu trong vài phút</strong> — đặt máy gần người dùng ở châu lục khác.</li>
</ul>
<p>Mỗi lợi ích đều có mặt trái bạn sẽ gặp trong khoá: chi phí biến đổi nghĩa là hoá đơn cũng biến đổi — đôi khi đến mức sốc; “vài phút” cũng có nghĩa là một sai lầm lan ra trong vài phút.</p>

<h3>“Biết AWS” trong tin tuyển dụng nghĩa là gì</h3>
<p>Với thực tập sinh hay fresher backend, hiếm khi nó nghĩa là “biết cả 200 dịch vụ”. Thực tế nó nghĩa là bạn:</p>
<ol>
  <li>Tạo tài nguyên an toàn: tài khoản có MFA và cảnh báo ngân sách, user/role IAM theo quyền tối thiểu.</li>
  <li>Đưa API của mình lên: container trên EC2 hoặc ECS Fargate, PostgreSQL trên RDS, tệp trên S3, đứng sau load balancer.</li>
  <li>Tự động hoá: Terraform cho hạ tầng, GitHub Actions để build và deploy.</li>
  <li>Theo dõi: log, chỉ số và cảnh báo trong CloudWatch.</li>
  <li>Không đốt tiền, không lộ dữ liệu: nói được mỗi tài nguyên tốn bao nhiêu và cái gì đang công khai.</li>
</ol>
<p>Danh sách đó <em>chính là</em> khoá học này. Cuối khoá bạn đưa LabFlow — API đặt lịch phòng lab bạn xây ở khoá Node.js và Spring Boot — lên AWS theo cách một công ty làm, và có hai chương luyện thi <strong>AWS Certified Cloud Practitioner (CLF-C02)</strong> và <strong>Solutions Architect – Associate (SAA-C03)</strong>.</p>

<h3>Lộ trình</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0</span><span class="lz-t">Khởi đầu an toàn</span><span class="lz-d">Cloud là gì, các thảm hoạ, tài khoản an toàn có cảnh báo ngân sách, cloud so với VPS, region, và phòng lab miễn phí ở máy bạn (LocalStack + Terraform).</span></div>
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">IAM và S3</span><span class="lz-d">Ai được làm gì; lưu tệp — và vì sao Cloudflare R2 của cuongthai.com nói cùng giao thức.</span></div>
  <div class="lz-step"><span class="lz-k">3–5</span><span class="lz-t">Mạng, máy chủ, ra Internet</span><span class="lz-d">VPC, EC2, load balancer, auto scaling, Route 53, CloudFront.</span></div>
  <div class="lz-step"><span class="lz-k">6–9</span><span class="lz-t">Dữ liệu, container, serverless, sự kiện</span><span class="lz-d">RDS + bí mật, ECR + ECS Fargate, Lambda + API Gateway, SQS/SNS/EventBridge.</span></div>
  <div class="lz-step"><span class="lz-k">10–13</span><span class="lz-t">Vận hành như người đi làm</span><span class="lz-d">CloudWatch, Terraform cho mọi thứ, CI/CD lên ECS, chi phí và bảo mật.</span></div>
  <div class="lz-step"><span class="lz-k">14–16</span><span class="lz-t">Dự án cuối khoá và chứng chỉ</span><span class="lz-d">LabFlow trên AWS kiểu production; luyện CLF-C02 và SAA-C03.</span></div>
</div>

<h3>Cần gì trước khi bắt đầu</h3>
<ul>
  <li>Lệnh Linux cơ bản và Docker (chạy container, mở cổng). Khoá Docker và Linux &amp; Bash trên trang là đủ.</li>
  <li>Git, và một API chạy được — Node.js hay Spring Boot, nhỏ cũng được.</li>
  <li>Với bài đụng AWS thật: một thẻ thanh toán (AWS xác minh lúc đăng ký) và kỷ luật làm đủ mọi bước “dọn dẹp”. Mọi demo trong khoá cũng chạy được <strong>miễn phí</strong> ngay trên máy bạn bằng LocalStack.</li>
</ul>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>“Điện toán đám mây là gì?”</strong> — Cung cấp tài nguyên IT theo nhu cầu qua Internet, trả theo mức dùng; tài nguyên tạo bằng API trong vài giây thay vì mua trong vài tuần.</li>
  <li><strong>“IaaS, PaaS, SaaS khác nhau thế nào — cho ví dụ trên AWS.”</strong> — EC2 (bạn tự vá hệ điều hành), RDS hoặc Lambda (AWS chạy nền tảng), và một sản phẩm hoàn chỉnh như Amazon WorkMail.</li>
  <li><strong>“Mô hình trách nhiệm chung là gì?”</strong> — AWS bảo vệ bản thân cloud; khách hàng bảo vệ thứ mình đưa lên: danh tính, luật mạng, dữ liệu, cấu hình mã hoá.</li>
</ol>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Mở ba tin tuyển backend trên ITviec, TopDev hoặc LinkedIn, chép lại mọi từ liên quan cloud (AWS, EC2, S3, Docker, Kubernetes, CI/CD…).</li>
  <li>Với mỗi từ, tìm chương nào trong lộ trình trên dạy nó.</li>
  <li>Viết một câu bằng lời của bạn: “bảo mật <em>trong</em> cloud” nghĩa là gì với một đồ án sinh viên.</li>
</ol>
<p><strong>Đạt khi:</strong> có danh sách ít nhất tám từ, mỗi từ gắn với một chương, và một câu bạn nói được khi phỏng vấn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cloud computing</span><span class="v">Thuê tài nguyên IT qua Internet, tạo bằng API, tính tiền theo mức dùng.</span></div>
  <div class="kv"><span class="k">On-premises</span><span class="v">Máy chủ tự sở hữu, tự chạy trong phòng hay trung tâm dữ liệu riêng.</span></div>
  <div class="kv"><span class="k">IaaS / PaaS / SaaS</span><span class="v">Nhà cung cấp lo bao nhiêu tầng: hạ tầng, nền tảng, hay cả phần mềm.</span></div>
  <div class="kv"><span class="k">Trách nhiệm chung</span><span class="v">AWS bảo vệ cloud; bạn bảo vệ thứ bạn đưa lên cloud.</span></div>
  <div class="kv"><span class="k">API</span><span class="v">Các request HTTPS có chữ ký nằm sau mọi cú bấm console, lệnh CLI và lần chạy Terraform.</span></div>
  <div class="kv"><span class="k">SigV4</span><span class="v">Cách AWS ký request: khoá truy cập + ngày + region + dịch vụ ⇒ chữ ký.</span></div>
  <div class="kv"><span class="k">LocalStack</span><span class="v">Bộ giả lập API AWS chạy ở máy bạn; khoá này chạy demo trên nó, không tốn tiền.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cloud là bếp trung tâm: thuê đúng thứ cần theo giây, tạo bằng API.</li>
  <li>Mọi thao tác là một request HTTPS có chữ ký — khoá chính là danh tính.</li>
  <li>AWS bắt đầu bằng SQS (2004), S3 và EC2 (2006); hiện vẫn là nhà cung cấp lớn nhất.</li>
  <li>IaaS/PaaS/SaaS khác nhau ở chỗ ai lo tầng nào; trách nhiệm bảo mật chia theo đúng đường đó.</li>
  <li>“Biết AWS” với fresher = tài khoản an toàn, đưa API lên, tự động hoá, theo dõi, không đốt tiền.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html', '☁️', 'Overview of Amazon Web Services — Six advantages of cloud computing', 'Đoạn whitepaper chính thức mà đề Cloud Practitioner dựa vào.')}
${tl('https://aws.amazon.com/compliance/shared-responsibility-model/', '🛡️', 'AWS Shared Responsibility Model', 'Ai bảo vệ cái gì — kèm sơ đồ dùng trong mọi khoá đào tạo AWS.')}

<h3>Nguồn</h3>
<ul>
  <li>Thông cáo ra mắt Amazon S3 (14/03/2006): <a href="https://press.aboutamazon.com/2006/3/amazon-web-services-launches" target="_blank" rel="noopener">press.aboutamazon.com</a></li>
  <li>“Amazon EC2 Beta” — Jeff Barr, AWS News Blog (25/08/2006): <a href="https://aws.amazon.com/blogs/aws/amazon_ec2_beta/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/amazon_ec2_beta</a></li>
  <li>Whitepaper AWS “Overview of Amazon Web Services”: <a href="https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html" target="_blank" rel="noopener">docs.aws.amazon.com/whitepapers/latest/aws-overview</a></li>
  <li>Signature Version 4: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.9 — Bắt đầu tại đây (2/2) ═══════════════════════════ */
const OUT_LO = out(`$ git log --oneline
<sha> xoa .env, them .gitignore
<sha> khoi tao du an
$ git show HEAD~1:.env | grep AWS_ACCESS
AWS_ACCESS_KEY_ID=AKIAEXAMPLE000000005
$ docker run --rm -v $PWD:/repo zricethezav/gitleaks git /repo --no-banner
Finding:     AKIAEXAMPLE000000005
RuleID:      aws-access-token
File:        .env
Commit:      <sha>
Finding:     AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
RuleID:      generic-api-key
File:        .env
INF 2 commits scanned.
WRN leaks found: 2`);
const OUT_MO = out(`$ curl -s "https://noaa-ghcn-pds.s3.amazonaws.com/?list-type=2&max-keys=3"
<Name>noaa-ghcn-pds</Name>
<Key>csv.gz/1763.csv.gz</Key>  <Size>3358</Size>
<Key>csv.gz/1764.csv.gz</Key>  <Size>3327</Size>
<Key>csv.gz/1765.csv.gz</Key>  <Size>3335</Size>
$ curl -s https://khong-ai-dat-ten-nay-9f3k2.s3.amazonaws.com/
<Code>NoSuchBucket</Code>
<Message>The specified bucket does not exist</Message>`);

const L09_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Cloud disasters: surprise bills, public buckets, leaked keys — and how to study without getting burned</h2>
<p class="lead">The cloud makes it easy to build things fast. It makes it just as easy to lose money or data fast. Before you create a single resource, look at what has really happened to companies and students — with names, years and sources — and at the three habits that would have prevented almost all of it.</p>

<h3>Disaster 1 — The leaked key: minutes, not days</h3>
<p>An AWS <strong>access key</strong> is a pair: an ID that starts with <code>AKIA</code> and a 40-character secret. Together they can sign any API request your user is allowed to make (lesson 0.8). Attackers run bots that read every public commit on GitHub, looking for exactly that pattern.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A student pushes a project</span><span class="lz-d">The <code>.env</code> file with <code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> goes into the first commit.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A bot finds it</span><span class="lz-d">Palo Alto Networks Unit 42 watched this happen in the “EleKtra-Leak” campaign (2023): exposed AWS keys were picked up and used within about five minutes.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The bot launches machines</span><span class="lz-d">It starts the largest instances it is allowed to, in many regions, and mines cryptocurrency. You see nothing until the bill or AWS's warning e-mail.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The bill arrives</span><span class="lz-d">One GPU instance (g4dn.xlarge in Singapore) costs 0.736 USD an hour — about 537 USD a month. Bots run dozens.</span></div>
</div>
<p>“But I deleted the file in the next commit.” Git does not forget. This is a real run on the course machine — the key is fake, the behaviour is not:</p>
${OUT_LO}
<p>The second commit removed <code>.env</code> from Git, yet the first commit still holds it, and a free scanner (gitleaks) finds it in milliseconds — exactly what attackers' bots do at scale. <strong>The only fix for a leaked key is to deactivate and delete it in IAM</strong>, then check CloudTrail for what it did. Rewriting history is cleanup, not a fix.</p>
<p>Two famous real cases: <strong>Uber (2016)</strong> — attackers found AWS credentials inside a <em>private</em> GitHub repository used by Uber engineers, and used them to download data on 57 million riders and drivers stored in S3; Uber paid the attackers 100,000 USD to keep quiet and only disclosed it a year later. <strong>Code Spaces (2014)</strong> — an attacker got into the company's AWS console, demanded a ransom, and when refused deleted servers, data and the backups kept in the same account. The company shut down.</p>

<h3>Disaster 2 — The public bucket</h3>
<p>An S3 bucket is a folder in the cloud reachable by HTTP. If its permissions say “anyone may read”, then <em>anyone</em> — with no account and no key — can list and download it. Here is a bucket that is public on purpose (NOAA weather data in the AWS Open Data registry), read with a plain <code>curl</code> and no credentials:</p>
${OUT_MO}
<p>Notice the second answer too: “does not exist”. A private bucket answers <code>AccessDenied</code> instead. That difference is how scanning tools guess company bucket names (<code>company-backup</code>, <code>company-dev</code>…) and find the ones that are open. Real leaks found this way: <strong>Verizon (2017)</strong>, about 14 million customer records in a bucket run by a contractor; <strong>Accenture (2017)</strong>, buckets holding keys and passwords to its own cloud platform — both discovered by the security firm UpGuard. Since April 2023, new buckets block public access by default; most leaks today come from someone turning that protection off “just to test”.</p>

<h3>Disaster 3 — The surprise bill (without any hacker)</h3>
<ul>
  <li><strong>The forgotten resource.</strong> A typical student lab creates a NAT gateway, finishes the exercise and closes the browser. The NAT gateway keeps running: 0.059 USD an hour in Singapore, 43 USD a month for doing nothing (real price, lesson 0.2). Same story for idle load balancers, databases and public IPv4 addresses (0.005 USD an hour each since February 2024).</li>
  <li><strong>The bucket you did not even share.</strong> In April 2024 developer Maciej Pocwierz created an <em>empty, private</em> S3 bucket and found a bill of about 1,300 USD the next day: a popular open-source tool used the same bucket name as a default, and millions of machines kept sending requests to it — and S3 then charged the bucket owner even for rejected requests. After his post went viral, AWS changed the rule (May 2024): unauthorised requests from outside your account are no longer billed. The lesson stays: bucket names are global and public, so add a random suffix.</li>
  <li><strong>Free Tier is not “free forever”.</strong> Free usage covers specific services, sizes and limits. A bigger instance, a second region or a service outside the list is billed normally — on a Paid plan. Lesson 0.1 shows the new Free plan (2025) and how to make sure you get a warning before any of this.</li>
</ul>

<h3>The three habits that prevent almost all of it</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Budget alarm first</span><span class="lz-d">Before any resource: an AWS Budget of a few dollars that e-mails you at 50% actual and 100% forecast (lesson 0.1).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">No long-lived keys in code</span><span class="lz-d">MFA on every human login; keys only in <code>~/.aws</code> or, better, short-lived via SSO and roles; <code>.env</code> in <code>.gitignore</code> before the first commit; a secret scanner in CI.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Clean up and check</span><span class="lz-d">Every lab ends with a destroy step and a “what is still billing?” check (lesson 0.4). Tag everything with the project name so you can find it.</span></div>
</div>

<h3>How to study this course without giving up</h3>
<ul>
  <li><strong>Local first, real AWS second.</strong> Every demo runs on LocalStack on your machine (free, nothing to forget). Do the real-AWS version only with your budget alarm on, and only when the lesson says the real service behaves differently.</li>
  <li><strong>One lesson = one sitting</strong>: watch, type every command, do the 🧪 practice, then clean up. About an hour.</li>
  <li><strong>Draw it.</strong> After each network or architecture lesson, redraw the diagram from memory on paper. Interviewers ask you to draw, not to recite.</li>
  <li><strong>Minimum path</strong> if you are short of time: Section 0 → Ch.1 IAM → Ch.2 S3 → Ch.3 VPC → Ch.4 EC2 → Ch.6 RDS → Ch.7 ECS → Ch.14 capstone. The rest deepens it.</li>
  <li>Stuck for more than 30 minutes? Re-read the error, search the exact error code in AWS docs, and check the region — “resource not found” in the wrong region is the most common beginner mistake.</li>
</ul>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“You accidentally pushed an AWS key to GitHub. What do you do?”</strong> — Deactivate and delete the key in IAM immediately, check CloudTrail for activity from it, terminate anything it created, then clean the Git history and add secret scanning. Order matters: revoke first.</li>
  <li><strong>“How do you prevent S3 data leaks?”</strong> — Keep Block Public Access on at account level, use bucket policies with least privilege, serve public files through CloudFront with origin access control, and audit with IAM Access Analyzer.</li>
  <li><strong>“How do you control cloud costs on a project?”</strong> — Budgets and alerts from day one, tags on every resource, delete idle resources, and choose the right size and pricing model.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>On your machine, create a throw-away Git repo, commit a <code>.env</code> containing a fake key in the form <code>AKIA</code> + 16 capital letters/digits, then remove it in a second commit.</li>
  <li>Run gitleaks with Docker as shown above and confirm it still finds the key.</li>
  <li>Run the same scan on one of your real projects. Write down any finding and what you will do about it.</li>
</ol>
<p><strong>Done when:</strong> gitleaks reports the fake key in the throw-away repo, and you have scanned at least one real repository.</p>
${giai('Hint if gitleaks finds nothing in the test repo', '<p>gitleaks ignores keys that look like documentation examples (for example ones ending in <code>EXAMPLE</code>). Make the 16 characters random, e.g. <code>AKIA</code> + <code>T7WJ3DMFYQMJ7I3O</code>. Also make sure you mounted the repository folder, not its parent.</p>')}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access key</span><span class="v">A long-lived credential pair (AKIA… + secret) that signs API calls as an IAM user.</span></div>
  <div class="kv"><span class="k">Cryptojacking</span><span class="v">Using someone else's compute to mine cryptocurrency — the usual first use of a stolen cloud key.</span></div>
  <div class="kv"><span class="k">Public bucket</span><span class="v">An S3 bucket whose policy or ACL lets anonymous users read or list it.</span></div>
  <div class="kv"><span class="k">Block Public Access</span><span class="v">Account- and bucket-level switches that override any policy making S3 data public; on by default since 2023.</span></div>
  <div class="kv"><span class="k">AWS Budgets</span><span class="v">A service that e-mails or notifies you when actual or forecast cost passes a threshold.</span></div>
  <div class="kv"><span class="k">CloudTrail</span><span class="v">The log of API calls in your account — who did what, from where, when.</span></div>
  <div class="kv"><span class="k">Secret scanning</span><span class="v">Tools (gitleaks, GitHub push protection) that detect keys in code and history.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Leaked keys are exploited within minutes; deleting the file does not remove it from Git history — revoke the key.</li>
  <li>Public buckets are readable by anyone with curl; scanners guess names; keep Block Public Access on.</li>
  <li>Surprise bills usually come from forgotten resources, not hackers: NAT gateways, idle databases, IPv4, big instances.</li>
  <li>Three habits: budget alarm first, no long-lived keys in code, clean up and check after every lab.</li>
  <li>Study local-first with LocalStack; use real AWS deliberately.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/', '🕵️', 'Unit 42 — EleKtra-Leak: exposed AWS IAM keys and cryptojacking', 'How fast leaked keys are found, and what attackers do with them.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html', '🔑', 'AWS docs — Managing access keys for IAM users', 'Rotate, deactivate and delete keys; why to prefer temporary credentials.')}

<h3>Sources</h3>
<ul>
  <li>Unit 42, “EleKtra-Leak Cryptojacking Campaign” (October 2023): <a href="https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/" target="_blank" rel="noopener">unit42.paloaltonetworks.com</a></li>
  <li>US Department of Justice, Uber non-prosecution agreement over the 2016 breach cover-up (July 2022): <a href="https://www.justice.gov/usao-ndca/pr/uber-enters-non-prosecution-agreement" target="_blank" rel="noopener">justice.gov</a></li>
  <li>Code Spaces shutdown (June 2014) — reported by InfoWorld and others: <a href="https://www.infoworld.com/article/2608076/murder-in-the-amazon-cloud.html" target="_blank" rel="noopener">infoworld.com</a></li>
  <li>UpGuard research on the Verizon and Accenture S3 exposures (2017): <a href="https://www.upguard.com/breaches/verizon-cloud-leak" target="_blank" rel="noopener">upguard.com/breaches/verizon-cloud-leak</a></li>
  <li>Maciej Pocwierz, “How an empty S3 bucket can make your AWS bill explode” (April 2024), and AWS's change for unauthorised requests (May 2024): <a href="https://aws.amazon.com/about-aws/whats-new/2024/05/amazon-s3-no-charge-http-error-codes/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new</a></li>
  <li>S3 Block Public Access and ACLs disabled by default for new buckets (April 2023): <a href="https://aws.amazon.com/blogs/aws/heads-up-amazon-s3-security-changes-are-coming-in-april-of-2023/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws</a></li>
</ul>
</div>
`;

const L09_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Thảm hoạ cloud: hoá đơn bất ngờ, bucket công khai, lộ khoá — và cách học không bị “bỏng”</h2>
<p class="lead">Cloud giúp dựng mọi thứ rất nhanh. Nó cũng giúp mất tiền hoặc mất dữ liệu nhanh y như vậy. Trước khi tạo tài nguyên đầu tiên, hãy xem những gì đã thật sự xảy ra với các công ty và sinh viên — có tên, có năm, có nguồn — và ba thói quen lẽ ra đã chặn được gần hết.</p>

<h3>Thảm hoạ 1 — Lộ khoá: tính bằng phút, không phải bằng ngày</h3>
<p><strong>Khoá truy cập (access key)</strong> của AWS là một cặp: mã bắt đầu bằng <code>AKIA</code> và một chuỗi bí mật 40 ký tự. Hai thứ đó ký được mọi request API mà user của bạn được phép làm (bài 0.8). Kẻ tấn công chạy bot đọc mọi commit công khai trên GitHub để tìm đúng mẫu đó.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một bạn sinh viên đẩy dự án lên</span><span class="lz-d">Tệp <code>.env</code> có <code>AWS_ACCESS_KEY_ID</code> và <code>AWS_SECRET_ACCESS_KEY</code> nằm trong commit đầu tiên.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bot tìm thấy</span><span class="lz-d">Nhóm Unit 42 của Palo Alto Networks theo dõi chiến dịch “EleKtra-Leak” (2023): khoá AWS lộ trên GitHub bị nhặt và dùng chỉ sau khoảng năm phút.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bot bật máy</span><span class="lz-d">Nó bật những máy to nhất được phép, ở nhiều region, để đào tiền mã hoá. Bạn không thấy gì cho tới khi có hoá đơn hoặc thư cảnh báo của AWS.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hoá đơn về</span><span class="lz-d">Một máy GPU (g4dn.xlarge ở Singapore) giá 0,736 USD một giờ — khoảng 537 USD một tháng. Bot bật hàng chục cái.</span></div>
</div>
<p>“Nhưng em xoá tệp ở commit sau rồi mà.” Git không quên. Đây là lần chạy thật trên máy soạn khoá — khoá là giả, còn hành vi là thật:</p>
${OUT_LO}
<p>Commit thứ hai đã gỡ <code>.env</code> khỏi Git, nhưng commit đầu vẫn giữ nó, và một công cụ quét miễn phí (gitleaks) tìm ra trong vài mili giây — đúng việc bot của kẻ tấn công làm ở quy mô lớn. <strong>Cách sửa duy nhất khi lộ khoá là vô hiệu hoá rồi xoá khoá trong IAM</strong>, sau đó xem CloudTrail khoá đó đã làm gì. Viết lại lịch sử Git chỉ là dọn dẹp, không phải sửa lỗi.</p>
<p>Hai vụ thật nổi tiếng: <strong>Uber (2016)</strong> — kẻ tấn công tìm thấy thông tin xác thực AWS trong một kho GitHub <em>riêng tư</em> của kỹ sư Uber, rồi dùng nó tải dữ liệu của 57 triệu khách và tài xế lưu trên S3; Uber trả kẻ tấn công 100.000 USD để im lặng, một năm sau mới công bố. <strong>Code Spaces (2014)</strong> — kẻ tấn công vào được trang quản trị AWS của công ty, đòi tiền chuộc, bị từ chối thì xoá máy chủ, dữ liệu và cả bản sao lưu để chung tài khoản. Công ty đóng cửa.</p>

<h3>Thảm hoạ 2 — Bucket công khai</h3>
<p>Bucket S3 là một thư mục trên cloud truy cập được bằng HTTP. Nếu quyền của nó ghi “ai cũng được đọc” thì <em>bất kỳ ai</em> — không tài khoản, không khoá — cũng liệt kê và tải được. Đây là một bucket công khai có chủ đích (dữ liệu thời tiết NOAA trong kho Open Data của AWS), đọc bằng <code>curl</code> trần, không có thông tin xác thực nào:</p>
${OUT_MO}
<p>Để ý cả câu trả lời thứ hai: “không tồn tại”. Bucket riêng tư thì trả về <code>AccessDenied</code>. Chính khác biệt đó giúp công cụ quét đoán tên bucket của công ty (<code>congty-backup</code>, <code>congty-dev</code>…) và tìm ra cái nào đang mở. Các vụ lộ thật bị tìm ra theo cách này: <strong>Verizon (2017)</strong>, khoảng 14 triệu bản ghi khách hàng trong một bucket do nhà thầu quản lý; <strong>Accenture (2017)</strong>, các bucket chứa khoá và mật khẩu vào chính nền tảng cloud của họ — cả hai do hãng bảo mật UpGuard phát hiện. Từ tháng 4/2023, bucket mới mặc định chặn truy cập công khai; đa số vụ lộ bây giờ đến từ việc ai đó tắt lớp bảo vệ đó “để thử chút thôi”.</p>

<h3>Thảm hoạ 3 — Hoá đơn bất ngờ (không cần hacker)</h3>
<ul>
  <li><strong>Tài nguyên bị quên.</strong> Một bài lab sinh viên điển hình tạo NAT gateway, làm xong bài rồi đóng trình duyệt. NAT gateway vẫn chạy: 0,059 USD mỗi giờ ở Singapore, 43 USD một tháng để không làm gì (giá thật, bài 0.2). Load balancer bỏ không, cơ sở dữ liệu bỏ không, địa chỉ IPv4 công khai (mỗi cái 0,005 USD/giờ từ tháng 2/2024) cũng y như vậy.</li>
  <li><strong>Bucket bạn chưa hề chia sẻ.</strong> Tháng 4/2024, lập trình viên Maciej Pocwierz tạo một bucket S3 <em>rỗng, riêng tư</em> và hôm sau thấy hoá đơn khoảng 1.300 USD: một công cụ mã nguồn mở phổ biến dùng đúng tên bucket đó làm mặc định, hàng triệu máy liên tục gửi request tới — và S3 khi đó tính tiền chủ bucket cả cho những request bị từ chối. Sau khi bài viết của anh lan rộng, AWS đổi luật (tháng 5/2024): request trái phép từ ngoài tài khoản không còn bị tính tiền. Bài học vẫn còn nguyên: tên bucket là toàn cầu và công khai, nên thêm hậu tố ngẫu nhiên.</li>
  <li><strong>Free Tier không phải “miễn phí mãi mãi”.</strong> Phần miễn phí chỉ áp cho một số dịch vụ, cỡ máy và hạn mức. Máy to hơn, region thứ hai hay dịch vụ ngoài danh sách đều tính tiền bình thường — khi ở gói Paid. Bài 0.1 giới thiệu gói Free mới (2025) và cách chắc chắn được cảnh báo trước khi chuyện này xảy ra.</li>
</ul>

<h3>Ba thói quen chặn gần như tất cả</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cảnh báo ngân sách trước tiên</span><span class="lz-d">Trước mọi tài nguyên: một AWS Budget vài đô gửi thư khi chi phí thật vượt 50% và chi phí dự báo vượt 100% (bài 0.1).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Không để khoá dài hạn trong mã</span><span class="lz-d">MFA cho mọi lần người đăng nhập; khoá chỉ nằm trong <code>~/.aws</code>, tốt hơn là khoá ngắn hạn qua SSO và role; <code>.env</code> vào <code>.gitignore</code> trước commit đầu; quét bí mật trong CI.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dọn và kiểm</span><span class="lz-d">Lab nào cũng kết thúc bằng bước xoá và kiểm “còn gì đang tính tiền” (bài 0.4). Gắn tag tên dự án cho mọi thứ để còn tìm ra.</span></div>
</div>

<h3>Cách học khoá này mà không bỏ cuộc</h3>
<ul>
  <li><strong>Máy mình trước, AWS thật sau.</strong> Mọi demo chạy được trên LocalStack ở máy bạn (miễn phí, không có gì để quên tắt). Chỉ làm bản trên AWS thật khi đã bật cảnh báo ngân sách, và khi bài nói rõ dịch vụ thật chạy khác.</li>
  <li><strong>Một bài = một lần ngồi</strong>: xem, gõ lại mọi lệnh, làm 🧪 thực hành, rồi dọn. Khoảng một giờ.</li>
  <li><strong>Vẽ lại.</strong> Sau mỗi bài về mạng hay kiến trúc, vẽ lại sơ đồ ra giấy theo trí nhớ. Người phỏng vấn bảo bạn vẽ, không bảo bạn đọc thuộc.</li>
  <li><strong>Lộ trình tối thiểu</strong> nếu ít thời gian: Mục 0 → Ch.1 IAM → Ch.2 S3 → Ch.3 VPC → Ch.4 EC2 → Ch.6 RDS → Ch.7 ECS → Ch.14 dự án cuối khoá. Phần còn lại để đào sâu.</li>
  <li>Kẹt quá 30 phút? Đọc lại thông báo lỗi, tìm đúng mã lỗi trong tài liệu AWS, và kiểm region — “không tìm thấy tài nguyên” vì đứng nhầm region là lỗi người mới gặp nhiều nhất.</li>
</ul>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>“Em lỡ đẩy khoá AWS lên GitHub. Em làm gì?”</strong> — Vô hiệu hoá và xoá khoá trong IAM ngay, xem CloudTrail khoá đó đã làm gì, xoá mọi thứ nó tạo, rồi mới dọn lịch sử Git và thêm quét bí mật. Thứ tự quan trọng: thu hồi trước.</li>
  <li><strong>“Làm sao tránh lộ dữ liệu S3?”</strong> — Giữ Block Public Access bật ở cấp tài khoản, bucket policy theo quyền tối thiểu, tệp công khai thì phát qua CloudFront có origin access control, và kiểm định kỳ bằng IAM Access Analyzer.</li>
  <li><strong>“Em kiểm soát chi phí cloud của dự án thế nào?”</strong> — Budgets và cảnh báo từ ngày đầu, tag mọi tài nguyên, xoá thứ bỏ không, chọn đúng cỡ và đúng mô hình giá.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên máy bạn, tạo một kho Git bỏ đi, commit tệp <code>.env</code> chứa khoá giả dạng <code>AKIA</code> + 16 chữ hoa/số, rồi xoá nó ở commit thứ hai.</li>
  <li>Chạy gitleaks bằng Docker như trên, xác nhận nó vẫn tìm ra khoá.</li>
  <li>Quét y như vậy một dự án thật của bạn. Ghi lại phát hiện (nếu có) và việc bạn sẽ làm.</li>
</ol>
<p><strong>Đạt khi:</strong> gitleaks báo khoá giả trong kho thử, và bạn đã quét ít nhất một kho thật.</p>
${giai('Gợi ý nếu gitleaks không tìm thấy gì trong kho thử', '<p>gitleaks bỏ qua khoá trông như ví dụ trong tài liệu (ví dụ khoá kết thúc bằng <code>EXAMPLE</code>). Hãy để 16 ký tự ngẫu nhiên, ví dụ <code>AKIA</code> + <code>T7WJ3DMFYQMJ7I3O</code>. Kiểm cả việc bạn gắn đúng thư mục kho, không phải thư mục cha.</p>')}</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access key</span><span class="v">Cặp thông tin xác thực dài hạn (AKIA… + bí mật) dùng ký lời gọi API thay mặt một IAM user.</span></div>
  <div class="kv"><span class="k">Cryptojacking</span><span class="v">Dùng máy của người khác để đào tiền mã hoá — việc đầu tiên thường làm với khoá cloud bị trộm.</span></div>
  <div class="kv"><span class="k">Bucket công khai</span><span class="v">Bucket S3 có policy hoặc ACL cho người vô danh đọc hay liệt kê.</span></div>
  <div class="kv"><span class="k">Block Public Access</span><span class="v">Công tắc cấp tài khoản và cấp bucket, ghi đè mọi policy làm dữ liệu S3 thành công khai; mặc định bật từ 2023.</span></div>
  <div class="kv"><span class="k">AWS Budgets</span><span class="v">Dịch vụ gửi thư hay thông báo khi chi phí thật hoặc dự báo vượt ngưỡng.</span></div>
  <div class="kv"><span class="k">CloudTrail</span><span class="v">Nhật ký lời gọi API trong tài khoản — ai làm gì, từ đâu, lúc nào.</span></div>
  <div class="kv"><span class="k">Quét bí mật</span><span class="v">Công cụ (gitleaks, GitHub push protection) phát hiện khoá trong mã và lịch sử.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Khoá lộ bị khai thác trong vài phút; xoá tệp không xoá khỏi lịch sử Git — phải thu hồi khoá.</li>
  <li>Bucket công khai thì ai có curl cũng đọc được; công cụ quét đoán tên; giữ Block Public Access bật.</li>
  <li>Hoá đơn bất ngờ thường do tài nguyên bị quên, không phải hacker: NAT gateway, cơ sở dữ liệu bỏ không, IPv4, máy to.</li>
  <li>Ba thói quen: cảnh báo ngân sách trước tiên, không khoá dài hạn trong mã, dọn và kiểm sau mỗi lab.</li>
  <li>Học trên LocalStack ở máy mình trước; dùng AWS thật có chủ đích.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/', '🕵️', 'Unit 42 — EleKtra-Leak: khoá IAM AWS bị lộ và cryptojacking', 'Khoá lộ bị tìm ra nhanh thế nào, và kẻ tấn công làm gì với nó.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html', '🔑', 'Tài liệu AWS — Quản lý access key của IAM user', 'Xoay, vô hiệu hoá, xoá khoá; vì sao nên dùng thông tin xác thực tạm thời.')}

<h3>Nguồn</h3>
<ul>
  <li>Unit 42, “EleKtra-Leak Cryptojacking Campaign” (10/2023): <a href="https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/" target="_blank" rel="noopener">unit42.paloaltonetworks.com</a></li>
  <li>Bộ Tư pháp Mỹ, thoả thuận không truy tố Uber vì che giấu vụ 2016 (7/2022): <a href="https://www.justice.gov/usao-ndca/pr/uber-enters-non-prosecution-agreement" target="_blank" rel="noopener">justice.gov</a></li>
  <li>Code Spaces đóng cửa (6/2014) — InfoWorld và nhiều báo khác đưa tin: <a href="https://www.infoworld.com/article/2608076/murder-in-the-amazon-cloud.html" target="_blank" rel="noopener">infoworld.com</a></li>
  <li>Nghiên cứu của UpGuard về các vụ lộ S3 của Verizon và Accenture (2017): <a href="https://www.upguard.com/breaches/verizon-cloud-leak" target="_blank" rel="noopener">upguard.com/breaches/verizon-cloud-leak</a></li>
  <li>Maciej Pocwierz, “How an empty S3 bucket can make your AWS bill explode” (4/2024), và thay đổi của AWS về request trái phép (5/2024): <a href="https://aws.amazon.com/about-aws/whats-new/2024/05/amazon-s3-no-charge-http-error-codes/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new</a></li>
  <li>S3 Block Public Access và tắt ACL mặc định cho bucket mới (4/2023): <a href="https://aws.amazon.com/blogs/aws/heads-up-amazon-s3-security-changes-are-coming-in-april-of-2023/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.1 — Tài khoản an toàn ═══════════════════════════ */
const MA_BUDGET = json(`
{ "BudgetName": "canh-bao-5-usd", "BudgetType": "COST", "TimeUnit": "MONTHLY",
  "BudgetLimit": { "Amount": "5", "Unit": "USD" } }`);
const MA_THONGBAO = json(`
[ { "Notification": { "NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN",
                      "Threshold": 50, "ThresholdType": "PERCENTAGE" },
    "Subscribers": [ { "SubscriptionType": "EMAIL", "Address": "ban@example.com" } ] },
  { "Notification": { "NotificationType": "FORECASTED", "ComparisonOperator": "GREATER_THAN",
                      "Threshold": 100, "ThresholdType": "PERCENTAGE" },
    "Subscribers": [ { "SubscriptionType": "EMAIL", "Address": "ban@example.com" } ] } ]`);
const OUT_BUDGET = out(`$ aws budgets create-budget --account-id 123456789012 \\
    --budget file://budget.json --notifications-with-subscribers file://thongbao.json
(không in gì = thành công)
$ aws budgets describe-budgets --account-id 123456789012 \\
    --query 'Budgets[].[BudgetName,BudgetLimit.Amount,BudgetLimit.Unit,TimeUnit]' --output text
canh-bao-5-usd	5	USD	MONTHLY
$ aws budgets describe-notifications-for-budget --account-id 123456789012 \\
    --budget-name canh-bao-5-usd --query 'Notifications[].[NotificationType,Threshold]' --output text
ACTUAL	50
FORECASTED	100`);
const OUT_MFA = out(`$ aws iam create-user --user-name cuong-admin
arn:aws:iam::123456789012:user/cuong-admin
$ aws iam create-virtual-mfa-device --virtual-mfa-device-name cuong-admin-mfa \\
    --outfile qr.png --bootstrap-method QRCodePNG
arn:aws:iam::123456789012:mfa/cuong-admin-mfa
$ aws iam enable-mfa-device --user-name cuong-admin \\
    --serial-number arn:aws:iam::123456789012:mfa/cuong-admin-mfa \\
    --authentication-code1 123456 --authentication-code2 654321
(không in gì = thành công)
$ aws iam list-mfa-devices --user-name cuong-admin --output text \\
    --query 'MFADevices[].[UserName,SerialNumber]'
cuong-admin	arn:aws:iam::123456789012:mfa/cuong-admin-mfa
$ aws iam get-account-summary \\
    --query 'SummaryMap.{MFA_root:AccountMFAEnabled,Users:Users,MFADevicesInUse:MFADevicesInUse}'
{
    "MFA_root": 0,
    "Users": 1,
    "MFADevicesInUse": 1
}`);

const L01_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 1</span>
<h2>0.1 — A safe AWS account: root, MFA, and a budget alarm before anything else</h2>
<p class="lead">The first 20 minutes with a new AWS account decide whether you sleep well for the rest of the course. This lesson does them in the right order: understand the Free plan, lock the root user, create a budget alarm, then create the identity you will use every day. The commands are shown running for real on a local AWS emulator; in the console the same steps are a few clicks.</p>

<h3>Free plan or Paid plan — what changed in 2025</h3>
<p>Since July 2025, a new AWS account chooses a plan at sign-up. Per the official Free Tier page (checked November 2026):</p>
<table>
  <thead><tr><th></th><th>Free plan</th><th>Paid plan</th></tr></thead>
  <tbody>
    <tr><td>Credits</td><td>100 USD at sign-up + up to 100 USD more for trying key services</td><td>Same credits</td></tr>
    <tr><td>Can you be charged?</td><td>No — usage stops when credits run out</td><td>Yes, beyond credits and free allowances</td></tr>
    <tr><td>Services</td><td>Limited to a selection</td><td>All services</td></tr>
    <tr><td>Duration</td><td>Up to 6 months or until credits are used; then the account closes and AWS keeps your data 90 days</td><td>Until you close it</td></tr>
  </tbody>
</table>
<p>For this course: start on the <strong>Free plan</strong>. You can upgrade later if a lesson needs a Paid-only service. One of the activities that earns extra credits is literally “set up a cost budget using AWS Budgets” — AWS itself rewards the first habit of this lesson. Accounts created before July 2025 keep the older 12-month Free Tier and <em>can</em> be charged — the budget alarm matters even more there.</p>

<h3>Step 1 — Understand and lock the root user</h3>
<p>The e-mail and password you sign up with is the <strong>root user</strong>. It can do everything, including closing the account and changing payment details, and <em>no permission policy can restrict it</em>. It is the master key of a building: you keep it in a safe, not on your keychain.</p>
<ul>
  <li>Turn on <strong>MFA</strong> for root (passkey, security key or authenticator app). Since 2024 AWS requires MFA for root users and asks you to register it at sign-in.</li>
  <li><strong>Never create access keys for root.</strong> A leaked root key is the worst case of lesson 0.9.</li>
  <li>Use root only for the few tasks that require it (closing the account, changing the support plan, some billing settings).</li>
  <li>Set alternate contacts (billing, security) so AWS warnings reach someone who reads them.</li>
</ul>

<h3>Step 2 — The budget alarm, before any resource</h3>
<p>An <strong>AWS Budget</strong> watches your cost and notifies you when it crosses a threshold. A budget that only watches and sends notifications does not cost anything. The two notifications every learner should have:</p>
<ol>
  <li><strong>ACTUAL &gt; 50%</strong> of a small amount (e.g. 5 USD) — something is running that you did not plan.</li>
  <li><strong>FORECASTED &gt; 100%</strong> — at the current pace you will pass the budget this month. This one fires early, often days before the money is actually spent — but AWS needs about 5 weeks of usage data before it can forecast, so on a brand-new account only ACTUAL (and a zero spend budget) will fire at first.</li>
</ol>
<p>In the console: Billing and Cost Management → Budgets → Create budget → “Use a template” → <em>Monthly cost budget</em> or <em>Zero spend budget</em>. As code, it is two JSON files and one command:</p>
${MA_BUDGET}
${MA_THONGBAO}
<p>Here it is running for real against Moto, an open-source AWS emulator (LocalStack's free edition has no Budgets API). On a real account the commands are the same, with your 12-digit account ID:</p>
${OUT_BUDGET}
<div class="callout warn">A budget is an <strong>alarm, not a brake</strong>. It e-mails you; it does not stop resources (budget “actions” can, but you configure them yourself). Billing data also lags by several hours. Treat the e-mail as “go and look now”, and still clean up after every lab.</div>
<p>Two more switches worth turning on in Billing preferences: <strong>Free Tier usage alerts</strong> (an e-mail when you approach a free limit) and <strong>Cost Anomaly Detection</strong> (machine-learning alerts for unusual spending). Exam note: the older way is a CloudWatch alarm on the <code>EstimatedCharges</code> metric, which exists only in the <code>us-east-1</code> region.</p>

<h3>Step 3 — An everyday identity with MFA</h3>
<p>You now need a login for daily work that is <em>not</em> root. AWS recommends <strong>IAM Identity Center</strong> (single sign-on with short-lived credentials — Chapter 1 explains it). For a personal learning account, an IAM user in an “Admins” group with MFA is acceptable while you learn. The CLI version, run for real on Moto:</p>
${OUT_MFA}
<p>Read the last output carefully: the user has an MFA device in use, but <code>MFA_root</code> is <code>0</code> — the root user's MFA is set in the console's Security credentials page, not through the API. The real authenticator gives two consecutive six-digit codes; the emulator accepts any.</p>

<h3>Real-life link</h3>
<p>This is the same idea as your bank app: the bank's master safe is not opened for daily payments, every transfer needs an OTP, and you get an SMS for every transaction over a threshold. Root = the safe, MFA = the OTP, Budgets = the SMS. At work, a new developer on day one usually receives an SSO login with MFA — never the root password, never a long-lived key.</p>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“What should you do first with a new AWS account?”</strong> — Enable MFA on root, do not create root access keys, set up a budget with alerts, create an admin identity (Identity Center or IAM with MFA) and stop using root.</li>
  <li><strong>“Does AWS Budgets stop spending when the limit is reached?”</strong> — No, it notifies. Stopping requires budget actions (apply a policy, stop instances) or your own automation.</li>
  <li><strong>“Which tasks require the root user?”</strong> — Closing the account, changing account settings such as the support plan, and a few billing tasks; everything else should use IAM identities.</li>
</ol>

<h3>🧪 Practice (20 minutes) — do it on your real account, or on LocalStack/Moto</h3>
<div class="callout ok"><ol>
  <li>Create two budgets: a monthly cost budget of 5 USD with ACTUAL 50% and FORECASTED 100% notifications to your e-mail, and a zero-spend budget.</li>
  <li>Turn on MFA for root and for your daily identity.</li>
  <li>Write down, in your notes, which identity you will use for this course and where its MFA lives.</li>
</ol>
<p><strong>Done when:</strong> the Budgets page lists both budgets with your e-mail as subscriber, and the IAM dashboard shows MFA enabled for root.</p>
${giai('Hint: running it on Moto at home', '<p>Start Moto with <code>docker run -d --name aws-moto -p 127.0.0.1:44567:5000 motoserver/moto</code>, then call the AWS CLI with <code>--endpoint-url http://127.0.0.1:44567</code> and dummy keys (<code>AWS_ACCESS_KEY_ID=test</code>). Remove the container when done: <code>docker rm -f aws-moto</code>.</p>')}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Root user</span><span class="v">The sign-up identity; unlimited power, cannot be restricted by IAM policies.</span></div>
  <div class="kv"><span class="k">MFA</span><span class="v">Multi-factor authentication: password plus something you have (passkey, security key, authenticator code).</span></div>
  <div class="kv"><span class="k">Free plan</span><span class="v">The 2025 sign-up plan: credits, a selection of services, no charges, up to 6 months.</span></div>
  <div class="kv"><span class="k">AWS Budgets</span><span class="v">Thresholds on cost or usage with notifications; ACTUAL vs FORECASTED.</span></div>
  <div class="kv"><span class="k">Zero spend budget</span><span class="v">A template that alerts as soon as any cost appears.</span></div>
  <div class="kv"><span class="k">IAM Identity Center</span><span class="v">AWS single sign-on: users log in once and receive short-lived credentials.</span></div>
  <div class="kv"><span class="k">EstimatedCharges</span><span class="v">The CloudWatch billing metric (only in us-east-1) used for classic billing alarms.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Order: understand the plan → lock root with MFA → budget alarm → daily identity with MFA.</li>
  <li>The Free plan cannot charge you; older or Paid accounts can — the alarm matters most there.</li>
  <li>Budgets notify, they do not stop; data lags hours; clean up anyway.</li>
  <li>Root has no access keys and is used for a handful of tasks only.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html', '🆓', 'AWS docs — Free Tier account plans', 'Free vs Paid plan, credits, what happens when the plan expires.')}
${tl('https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html', '💰', 'AWS docs — Managing your costs with AWS Budgets', 'Budget types, templates, notifications and actions.')}

<h3>Sources</h3>
<ul>
  <li>AWS Free Tier page (checked 19 Nov 2026): <a href="https://aws.amazon.com/free/" target="_blank" rel="noopener">aws.amazon.com/free</a> · Earning additional credits: <a href="https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans-activities.html" target="_blank" rel="noopener">docs.aws.amazon.com</a></li>
  <li>“Security by design: AWS to enhance MFA requirements in 2024”: <a href="https://aws.amazon.com/blogs/security/security-by-design-aws-to-enhance-mfa-requirements-in-2024/" target="_blank" rel="noopener">aws.amazon.com/blogs/security</a></li>
  <li>Tasks that require root user credentials: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-tasks.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/root-user-tasks.html</a></li>
  <li>Budgets best practices (forecasts need ~5 weeks of usage data): <a href="https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html" target="_blank" rel="noopener">docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html</a></li>
</ul>
</div>
`;

const L01_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 1</span>
<h2>0.1 — Tài khoản AWS an toàn: root, MFA, và cảnh báo ngân sách trước mọi thứ</h2>
<p class="lead">Hai mươi phút đầu với một tài khoản AWS mới quyết định bạn có ngủ ngon suốt khoá học hay không. Bài này làm đúng thứ tự: hiểu gói Free, khoá user root, tạo cảnh báo ngân sách, rồi mới tạo danh tính dùng hằng ngày. Các lệnh được chạy thật trên bộ giả lập AWS ở máy; trên console thì cùng các bước đó chỉ là vài cú bấm.</p>

<h3>Gói Free hay gói Paid — thay đổi từ 2025</h3>
<p>Từ tháng 7/2025, tài khoản AWS mới chọn gói ngay lúc đăng ký. Theo trang Free Tier chính thức (kiểm 11/2026):</p>
<table>
  <thead><tr><th></th><th>Gói Free</th><th>Gói Paid</th></tr></thead>
  <tbody>
    <tr><td>Tín dụng</td><td>100 USD khi đăng ký + tối đa 100 USD nữa khi dùng thử các dịch vụ chính</td><td>Cùng mức tín dụng</td></tr>
    <tr><td>Có bị tính tiền không?</td><td>Không — hết tín dụng là dừng</td><td>Có, phần vượt tín dụng và hạn mức miễn phí</td></tr>
    <tr><td>Dịch vụ</td><td>Chỉ một số dịch vụ chọn sẵn</td><td>Mọi dịch vụ</td></tr>
    <tr><td>Thời hạn</td><td>Tối đa 6 tháng hoặc tới khi hết tín dụng; sau đó tài khoản tự đóng, AWS giữ dữ liệu 90 ngày</td><td>Tới khi bạn đóng</td></tr>
  </tbody>
</table>
<p>Với khoá này: bắt đầu bằng <strong>gói Free</strong>. Bài nào cần dịch vụ chỉ gói Paid mới có thì nâng cấp sau. Một trong các hoạt động được thưởng thêm tín dụng chính là “tạo ngân sách chi phí bằng AWS Budgets” — AWS tự thưởng cho thói quen đầu tiên của bài này. Tài khoản tạo trước tháng 7/2025 giữ Free Tier kiểu cũ 12 tháng và <em>có thể</em> bị tính tiền — ở đó cảnh báo ngân sách càng quan trọng.</p>

<h3>Bước 1 — Hiểu và khoá user root</h3>
<p>Email và mật khẩu dùng để đăng ký chính là <strong>user root</strong>. Nó làm được mọi thứ, kể cả đóng tài khoản và đổi thông tin thanh toán, và <em>không policy phân quyền nào giới hạn được nó</em>. Nó là chìa khoá tổng của cả toà nhà: cất trong két, không đeo vào chùm chìa khoá hằng ngày.</p>
<ul>
  <li>Bật <strong>MFA</strong> cho root (passkey, khoá bảo mật hoặc ứng dụng xác thực). Từ 2024 AWS bắt buộc MFA cho user root và yêu cầu đăng ký ngay lúc đăng nhập.</li>
  <li><strong>Không bao giờ tạo access key cho root.</strong> Lộ khoá root là trường hợp tệ nhất của bài 0.9.</li>
  <li>Chỉ dùng root cho vài việc bắt buộc (đóng tài khoản, đổi gói hỗ trợ, một số cài đặt thanh toán).</li>
  <li>Điền liên hệ thay thế (thanh toán, bảo mật) để cảnh báo của AWS đến tay người có đọc.</li>
</ul>

<h3>Bước 2 — Cảnh báo ngân sách, trước mọi tài nguyên</h3>
<p><strong>AWS Budget</strong> theo dõi chi phí và báo cho bạn khi vượt ngưỡng. Một budget chỉ theo dõi và gửi thông báo thì không mất phí. Hai thông báo người học nào cũng nên có:</p>
<ol>
  <li><strong>ACTUAL &gt; 50%</strong> của một khoản nhỏ (ví dụ 5 USD) — có thứ gì đó đang chạy ngoài dự tính.</li>
  <li><strong>FORECASTED &gt; 100%</strong> — với tốc độ hiện tại, tháng này bạn sẽ vượt ngân sách. Thông báo này đến sớm, thường trước khi tiền thật sự bị tiêu vài ngày — nhưng AWS cần khoảng 5 tuần dữ liệu sử dụng mới dự báo được, nên tài khoản mới tinh lúc đầu chỉ có ACTUAL (và zero spend budget) kêu.</li>
</ol>
<p>Trên console: Billing and Cost Management → Budgets → Create budget → “Use a template” → <em>Monthly cost budget</em> hoặc <em>Zero spend budget</em>. Viết dưới dạng mã thì là hai tệp JSON và một lệnh:</p>
${MA_BUDGET}
${MA_THONGBAO}
<p>Và đây là lần chạy thật trên Moto, một bộ giả lập AWS mã nguồn mở (bản miễn phí của LocalStack không có API Budgets). Trên tài khoản thật lệnh y hệt, chỉ thay mã tài khoản 12 chữ số của bạn:</p>
${OUT_BUDGET}
<div class="callout warn">Budget là <strong>chuông báo, không phải phanh</strong>. Nó gửi thư; nó không tắt tài nguyên (“action” của budget thì làm được, nhưng bạn phải tự cấu hình). Dữ liệu chi phí cũng trễ vài giờ. Coi thư cảnh báo là “vào xem ngay”, và vẫn dọn sau mỗi lab.</div>
<p>Hai công tắc nữa nên bật trong Billing preferences: <strong>Free Tier usage alerts</strong> (thư khi sắp chạm hạn mức miễn phí) và <strong>Cost Anomaly Detection</strong> (cảnh báo bằng máy học khi chi tiêu bất thường). Ghi chú cho đề thi: cách cũ là đặt CloudWatch alarm trên chỉ số <code>EstimatedCharges</code>, chỉ số này chỉ có ở region <code>us-east-1</code>.</p>

<h3>Bước 3 — Danh tính dùng hằng ngày có MFA</h3>
<p>Giờ bạn cần một lối đăng nhập cho việc hằng ngày mà <em>không phải</em> root. AWS khuyên dùng <strong>IAM Identity Center</strong> (đăng nhập một lần, nhận khoá ngắn hạn — Chương 1 giải thích kỹ). Với tài khoản tự học, một IAM user trong nhóm “Admins” có MFA là chấp nhận được trong lúc học. Bản dùng CLI, chạy thật trên Moto:</p>
${OUT_MFA}
<p>Đọc kỹ output cuối: user đã có một thiết bị MFA đang dùng, nhưng <code>MFA_root</code> vẫn là <code>0</code> — MFA của root đặt ở trang Security credentials trên console, không qua API. Ứng dụng xác thực thật cho hai mã sáu số liên tiếp; bộ giả lập thì nhận mã nào cũng được.</p>

<h3>Liên hệ đời thường</h3>
<p>Ý tưởng y như ứng dụng ngân hàng của bạn: két tổng của ngân hàng không mở cho giao dịch hằng ngày, mỗi lần chuyển tiền cần OTP, và giao dịch nào vượt ngưỡng cũng có tin nhắn báo. Root = cái két, MFA = OTP, Budgets = tin nhắn báo. Đi làm, ngày đầu dev mới thường nhận một tài khoản SSO có MFA — không bao giờ là mật khẩu root, không bao giờ là khoá dài hạn.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>“Việc đầu tiên làm với một tài khoản AWS mới là gì?”</strong> — Bật MFA cho root, không tạo access key cho root, đặt budget có cảnh báo, tạo danh tính quản trị (Identity Center hoặc IAM có MFA) và thôi dùng root.</li>
  <li><strong>“AWS Budgets có tự dừng chi tiêu khi chạm hạn mức không?”</strong> — Không, nó chỉ báo. Muốn dừng phải dùng budget action (gắn policy chặn, tắt máy) hoặc tự viết tự động hoá.</li>
  <li><strong>“Việc gì bắt buộc dùng user root?”</strong> — Đóng tài khoản, đổi cài đặt tài khoản như gói hỗ trợ, và vài việc thanh toán; mọi việc khác dùng danh tính IAM.</li>
</ol>

<h3>🧪 Thực hành (20 phút) — làm trên tài khoản thật, hoặc trên LocalStack/Moto</h3>
<div class="callout ok"><ol>
  <li>Tạo hai budget: budget chi phí tháng 5 USD có thông báo ACTUAL 50% và FORECASTED 100% gửi về email của bạn, và một zero-spend budget.</li>
  <li>Bật MFA cho root và cho danh tính dùng hằng ngày.</li>
  <li>Ghi vào sổ tay: bạn dùng danh tính nào cho khoá này và MFA của nó nằm ở đâu.</li>
</ol>
<p><strong>Đạt khi:</strong> trang Budgets liệt kê đủ hai budget với email của bạn là người nhận, và bảng IAM báo root đã bật MFA.</p>
${giai('Gợi ý: chạy bằng Moto ở nhà', '<p>Bật Moto bằng <code>docker run -d --name aws-moto -p 127.0.0.1:44567:5000 motoserver/moto</code>, rồi gọi AWS CLI với <code>--endpoint-url http://127.0.0.1:44567</code> và khoá giả (<code>AWS_ACCESS_KEY_ID=test</code>). Xong thì xoá container: <code>docker rm -f aws-moto</code>.</p>')}</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">User root</span><span class="v">Danh tính lúc đăng ký; quyền vô hạn, policy IAM không giới hạn được.</span></div>
  <div class="kv"><span class="k">MFA</span><span class="v">Xác thực nhiều lớp: mật khẩu cộng một thứ bạn đang cầm (passkey, khoá bảo mật, mã ứng dụng xác thực).</span></div>
  <div class="kv"><span class="k">Gói Free</span><span class="v">Gói đăng ký từ 2025: có tín dụng, một số dịch vụ, không bị tính tiền, tối đa 6 tháng.</span></div>
  <div class="kv"><span class="k">AWS Budgets</span><span class="v">Ngưỡng chi phí hoặc mức dùng kèm thông báo; ACTUAL (thật) và FORECASTED (dự báo).</span></div>
  <div class="kv"><span class="k">Zero spend budget</span><span class="v">Mẫu budget báo ngay khi xuất hiện bất kỳ chi phí nào.</span></div>
  <div class="kv"><span class="k">IAM Identity Center</span><span class="v">Đăng nhập một lần của AWS: người dùng đăng nhập một lần và nhận khoá ngắn hạn.</span></div>
  <div class="kv"><span class="k">EstimatedCharges</span><span class="v">Chỉ số thanh toán trên CloudWatch (chỉ ở us-east-1) dùng cho billing alarm kiểu cũ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Thứ tự: hiểu gói → khoá root bằng MFA → cảnh báo ngân sách → danh tính hằng ngày có MFA.</li>
  <li>Gói Free không tính tiền được; tài khoản cũ hoặc gói Paid thì có — ở đó cảnh báo càng quan trọng.</li>
  <li>Budget chỉ báo, không dừng; dữ liệu trễ vài giờ; vẫn phải dọn.</li>
  <li>Root không có access key, chỉ dùng cho vài việc bắt buộc.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html', '🆓', 'Tài liệu AWS — Các gói tài khoản Free Tier', 'Gói Free và Paid, tín dụng, chuyện gì xảy ra khi gói hết hạn.')}
${tl('https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html', '💰', 'Tài liệu AWS — Quản lý chi phí bằng AWS Budgets', 'Các loại budget, mẫu, thông báo và action.')}

<h3>Nguồn</h3>
<ul>
  <li>Trang AWS Free Tier (kiểm 19/11/2026): <a href="https://aws.amazon.com/free/" target="_blank" rel="noopener">aws.amazon.com/free</a> · Nhận thêm tín dụng: <a href="https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans-activities.html" target="_blank" rel="noopener">docs.aws.amazon.com</a></li>
  <li>“Security by design: AWS to enhance MFA requirements in 2024”: <a href="https://aws.amazon.com/blogs/security/security-by-design-aws-to-enhance-mfa-requirements-in-2024/" target="_blank" rel="noopener">aws.amazon.com/blogs/security</a></li>
  <li>Các việc bắt buộc dùng user root: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-tasks.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/root-user-tasks.html</a></li>
  <li>Thực hành tốt với Budgets (dự báo cần khoảng 5 tuần dữ liệu): <a href="https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html" target="_blank" rel="noopener">docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.2 — Cloud vs VPS ═══════════════════════════ */
const OUT_GIA = out(`$ node gia.mjs

A. Một máy EC2 làm "VPS" (giống cuongthai.com hôm nay)
  EC2 t4g.large chạy cả tháng                    61.90 USD
  Ổ EBS gp3 80 GB                                 7.68 USD
  1 IPv4 công khai                                3.65 USD
  Ra Internet 300 GB (100 GB đầu miễn phí)       24.00 USD
  TỔNG / tháng                                   97.23 USD

B. Kiểu "production" tối thiểu: ALB + 2 máy + RDS Multi-AZ + NAT
  2 × EC2 t3.micro                               19.27 USD
  ALB (chưa tính LCU)                            18.40 USD
  RDS db.t4g.micro Multi-AZ                      37.23 USD
  RDS gp3 20 GB                                   2.76 USD
  NAT gateway (1 cái)                            43.07 USD
  NAT xử lý 50 GB                                 2.95 USD
  2 IPv4 công khai của ALB                        7.30 USD
  S3 20 GB ảnh                                    0.50 USD
  CloudWatch Logs 5 GB                            3.50 USD
  Secrets Manager 2 bí mật                        0.80 USD
  Ra Internet 300 GB                             24.00 USD
  TỔNG / tháng                                  159.78 USD

NAT gateway để không cả tháng: 43.07 USD — đắt hơn cả RDS Single-AZ (18.25 USD).`);
const MA_GIA = js(`
// Giá THẬT ap-southeast-1 (Singapore) lấy từ AWS Price List API, bản công bố 11/2026. 1 tháng = 730 giờ.
const GIO = 730;
const GIA = { 't4g.large': 0.0848, 't3.micro': 0.0132, 'ebs-gp3-GB': 0.096, 'ipv4-gio': 0.005,
  'rds-t4g.micro-multiaz': 0.051, 'rds-gp3-GB': 0.138, 'alb-gio': 0.0252,
  'nat-gio': 0.059, 'nat-GB': 0.059, 's3-GB': 0.025, 'ra-internet-GB': 0.12 };
const vps = GIA['t4g.large'] * GIO + GIA['ebs-gp3-GB'] * 80 + GIA['ipv4-gio'] * GIO;
console.log(vps.toFixed(2)); // phần máy + ổ + IP của kịch bản A`);

function bangDoiChieu(en) {
  const r = en ? [
    ['VPS (8 GB RAM) running Docker Compose', 'EC2 (one VM) — or ECS on Fargate (containers without managing a VM)', 'Ch.4, Ch.7'],
    ['PostgreSQL 16 + PostGIS + pgvector in a container', 'RDS for PostgreSQL (supports PostGIS and pgvector)', 'Ch.6'],
    ['Redis 7 in a container', 'ElastiCache (Redis OSS / Valkey)', 'Ch.6'],
    ['Nginx reverse proxy + TLS certificate', 'Application Load Balancer + ACM certificate', 'Ch.5'],
    ['Cloudflare R2 for media (media.cuongthai.com)', 'S3 — same API; the site\'s code already uses @aws-sdk/client-s3', 'Ch.2'],
    ['Cloudflare CDN / proxy in front of the site', 'CloudFront (+ AWS WAF, Shield)', 'Ch.5'],
    ['DNS on Cloudflare', 'Route 53', 'Ch.5'],
    ['Docker images on GHCR', 'ECR', 'Ch.7'],
    ['deploy-nha.sh: home machine builds → GHCR → VPS swaps containers', 'GitHub Actions (OIDC) → ECR → ECS rolling / blue-green deploy', 'Ch.12'],
    ['Secrets in an .env file on the VPS', 'Secrets Manager / Parameter Store', 'Ch.6'],
    ['Logs + error tracking + Telegram bot alerts', 'CloudWatch Logs, metrics, alarms → SNS', 'Ch.10'],
    ['Rented GPU machine by the hour (voice, rendering)', 'EC2 GPU instances (g4dn/g5/g6), Spot to save', 'Ch.4'],
  ] : [
    ['VPS (8 GB RAM) chạy Docker Compose', 'EC2 (một máy ảo) — hoặc ECS trên Fargate (chạy container, không phải lo máy)', 'Ch.4, Ch.7'],
    ['PostgreSQL 16 + PostGIS + pgvector trong container', 'RDS cho PostgreSQL (hỗ trợ PostGIS và pgvector)', 'Ch.6'],
    ['Redis 7 trong container', 'ElastiCache (Redis OSS / Valkey)', 'Ch.6'],
    ['Nginx reverse proxy + chứng chỉ TLS', 'Application Load Balancer + chứng chỉ ACM', 'Ch.5'],
    ['Cloudflare R2 chứa ảnh/video (media.cuongthai.com)', 'S3 — cùng API; mã của trang vốn đã dùng @aws-sdk/client-s3', 'Ch.2'],
    ['CDN / proxy Cloudflare đứng trước trang', 'CloudFront (+ AWS WAF, Shield)', 'Ch.5'],
    ['DNS trên Cloudflare', 'Route 53', 'Ch.5'],
    ['Ảnh Docker trên GHCR', 'ECR', 'Ch.7'],
    ['deploy-nha.sh: máy nhà build → GHCR → VPS tráo container', 'GitHub Actions (OIDC) → ECR → ECS deploy cuốn chiếu / blue-green', 'Ch.12'],
    ['Bí mật trong tệp .env trên VPS', 'Secrets Manager / Parameter Store', 'Ch.6'],
    ['Log + theo dõi lỗi + bot Telegram báo động', 'CloudWatch Logs, chỉ số, alarm → SNS', 'Ch.10'],
    ['Máy GPU thuê theo giờ (lồng tiếng, render)', 'Máy EC2 GPU (g4dn/g5/g6), dùng Spot cho rẻ', 'Ch.4'],
  ];
  const h = en ? ['cuongthai.com today', 'On AWS', 'Taught in'] : ['cuongthai.com hôm nay', 'Trên AWS là', 'Học ở'];
  return `<table>
  <thead><tr><th>${h[0]}</th><th>${h[1]}</th><th>${h[2]}</th></tr></thead>
  <tbody>
${r.map(([a, b, c]) => `    <tr><td>${a}</td><td><strong>${b}</strong></td><td>${c}</td></tr>`).join('\n')}
  </tbody>
</table>`;
}

const L02_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 2</span>
<h2>0.2 — Cloud vs the VPS you already run: a real system, mapped piece by piece</h2>
<p class="lead">You probably already “run something on a server”: a VPS with Docker, a database in a container, Nginx in front. cuongthai.com itself runs exactly like that. This lesson maps every piece of that real system to its AWS counterpart, prices both with real numbers, and gives you an honest rule for when a VPS is enough and when the cloud earns its price.</p>

<h3>What cuongthai.com runs today</h3>
<p>One VPS with 8 GB of RAM runs everything with Docker Compose: the Node.js/Express backend, the Next.js frontend, PostgreSQL 16 (with PostGIS and pgvector), Redis and Nginx. Images and videos live on Cloudflare R2; Cloudflare also provides DNS and the CDN. Deploys are done by a script: the home machine builds the Docker images, pushes them to GitHub Container Registry, and the VPS only pulls and swaps the containers. Alerts arrive through a Telegram bot. Heavy GPU work (voice, rendering) runs on a GPU machine rented by the hour.</p>
<p>That is a perfectly reasonable setup — many start-ups run this way for years. Here is what each piece becomes on AWS:</p>
${bangDoiChieu(true)}
<p>Notice row 5: the website's code already talks to R2 through <code>@aws-sdk/client-s3</code>, the official AWS SDK, because R2 implements the S3 API. Moving those files to S3 would be mostly a change of endpoint and keys. Chapter 2 shows the same code running against S3, R2-style endpoints and LocalStack.</p>

<h3>Same app, two ways — what really changes</h3>
<table>
  <thead><tr><th>Question</th><th>VPS</th><th>AWS (managed services)</th></tr></thead>
  <tbody>
    <tr><td>The machine dies</td><td>Site down until you restore it on a new VPS</td><td>Auto Scaling starts a new one; RDS Multi-AZ fails over in minutes</td></tr>
    <tr><td>Traffic ×10 for exam week</td><td>Upgrade plan, reboot, hope</td><td>More tasks/instances behind the load balancer, automatically</td></tr>
    <tr><td>Database backups</td><td>Your script, your testing</td><td>Automatic backups and point-in-time restore, built in</td></tr>
    <tr><td>OS security patches</td><td>You</td><td>You on EC2; AWS on Fargate, RDS, Lambda</td></tr>
    <tr><td>Monthly cost</td><td>Fixed and low</td><td>Variable; higher for the same resources; can explode if misconfigured</td></tr>
    <tr><td>What you must learn</td><td>Linux, Docker, Nginx</td><td>All of that + IAM, VPC, the billing model</td></tr>
  </tbody>
</table>

<h3>Pricing with real numbers</h3>
<p>The prices below were downloaded from the <strong>AWS Price List API</strong> for the Singapore region (ap-southeast-1), the closest region to Vietnam, in November 2026. A month is 730 hours; tax is not included; the traffic figure (300 GB out) is an assumption. The calculator is a few lines of JavaScript:</p>
${MA_GIA}
${OUT_GIA}
<p>Three lessons from those numbers:</p>
<ul>
  <li><strong>Scenario A</strong> — one EC2 “VPS” — already costs about as much as several typical VPS plans of the same size: you pay for the platform even when you use none of it. If one machine is all you need, a VPS is usually cheaper.</li>
  <li><strong>Scenario B</strong> buys you things a VPS does not have: a database that survives a data-centre failure, machines that replace themselves, a load balancer. That is what the extra money is for.</li>
  <li><strong>The quiet killer is the NAT gateway</strong>: 43 USD a month just for existing — more than the database itself. Chapter 3 shows how to avoid it (VPC endpoints, public subnets for dev). Data transfer to the Internet (0.12 USD/GB after the first 100 GB) is the other line that surprises people.</li>
</ul>

<h3>An honest rule of thumb</h3>
<ul>
  <li><strong>A VPS is enough</strong> when: one machine handles the load, a few minutes of downtime is acceptable, the team is small and knows Linux, and the budget is tight. Most student projects and many small products are here.</li>
  <li><strong>The cloud earns its price</strong> when: downtime costs real money, traffic is spiky or growing, you need managed databases with backups and failover, compliance asks for audit logs and encryption, or the company already uses AWS — which is why employers ask for it.</li>
  <li>Many real systems are <strong>hybrid</strong>: cuongthai.com already rents R2 storage and a GPU machine by the hour while keeping the core on a VPS.</li>
</ul>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“Why would you move an app from a VPS to AWS — or not?”</strong> — Move for availability (multi-AZ), elasticity, managed backups, security and audit tooling; stay when one machine is enough and cost predictability matters more. Show you know the trade-off, not just the buzzwords.</li>
  <li><strong>“What is the AWS equivalent of Nginx, Postgres in Docker, and a CDN?”</strong> — ALB (+ACM), RDS for PostgreSQL, CloudFront.</li>
  <li><strong>“Which AWS costs surprise teams most?”</strong> — NAT gateways, data transfer out, idle load balancers and databases, public IPv4 addresses, oversized instances and log ingestion.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Draw your own project (or LabFlow) as boxes: app, database, files, proxy, DNS, CI.</li>
  <li>Next to each box, write its AWS counterpart using the table above.</li>
  <li>Open the AWS Pricing Calculator (calculator.aws), choose Asia Pacific (Singapore), and price scenario A for your project. Compare with what you pay (or would pay) for a VPS.</li>
</ol>
<p><strong>Done when:</strong> you have a diagram with an AWS name on every box and a monthly estimate you can explain line by line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">VPS</span><span class="v">Virtual private server rented by the month with fixed resources.</span></div>
  <div class="kv"><span class="k">Managed service</span><span class="v">The provider runs the software (patches, backups, failover); you use it through an API.</span></div>
  <div class="kv"><span class="k">Multi-AZ</span><span class="v">A standby copy in another data-centre group that takes over automatically.</span></div>
  <div class="kv"><span class="k">NAT gateway</span><span class="v">Lets private machines reach the Internet; billed per hour and per GB.</span></div>
  <div class="kv"><span class="k">Data transfer out</span><span class="v">Traffic from AWS to the Internet; the first 100 GB/month are free, then billed per GB.</span></div>
  <div class="kv"><span class="k">Price List API</span><span class="v">AWS's public, machine-readable price files — the source of the numbers above.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every piece of a VPS stack has an AWS counterpart; R2 → S3 is the easiest because the API is the same.</li>
  <li>The cloud costs more for the same raw resources; you pay for availability, elasticity and managed operations.</li>
  <li>Price with real numbers; watch NAT gateways, data transfer and idle resources.</li>
  <li>VPS for one machine and tight budgets; cloud when downtime, growth or compliance matter.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://calculator.aws/', '🧮', 'AWS Pricing Calculator', 'Estimate a whole architecture per month, region by region.')}
${tl('https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html', '📄', 'AWS docs — Using the AWS Price List API', 'Where the machine-readable prices in this lesson come from.')}

<h3>Sources</h3>
<ul>
  <li>AWS Price List API, ap-southeast-1 offer files for EC2, RDS, ELB, VPC, S3, CloudWatch, Secrets Manager, Data Transfer (published November 2026): <a href="https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json" target="_blank" rel="noopener">pricing.us-east-1.amazonaws.com</a></li>
  <li>Public IPv4 address charge (from 1 February 2024): <a href="https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws</a></li>
  <li>RDS for PostgreSQL extensions (PostGIS, pgvector): <a href="https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html" target="_blank" rel="noopener">docs.aws.amazon.com</a></li>
</ul>
</div>
`;

const L02_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 2</span>
<h2>0.2 — Cloud so với VPS bạn đang chạy: một hệ thống thật, đối chiếu từng mảnh</h2>
<p class="lead">Rất có thể bạn đã “chạy gì đó trên server”: một VPS có Docker, cơ sở dữ liệu trong container, Nginx đứng trước. Chính cuongthai.com cũng chạy đúng kiểu đó. Bài này đối chiếu từng mảnh của hệ thống thật ấy sang dịch vụ AWS tương ứng, tính tiền cả hai bằng số thật, và cho bạn một luật thật lòng: khi nào VPS là đủ, khi nào cloud đáng đồng tiền.</p>

<h3>cuongthai.com đang chạy gì</h3>
<p>Một VPS 8 GB RAM chạy tất cả bằng Docker Compose: backend Node.js/Express, frontend Next.js, PostgreSQL 16 (có PostGIS và pgvector), Redis và Nginx. Ảnh và video nằm trên Cloudflare R2; Cloudflare lo luôn DNS và CDN. Deploy bằng một script: máy ở nhà build ảnh Docker, đẩy lên GitHub Container Registry, VPS chỉ việc kéo về và tráo container. Báo động đến qua bot Telegram. Việc nặng cần GPU (lồng tiếng, render) chạy trên một máy GPU thuê theo giờ.</p>
<p>Đó là một cách dựng hoàn toàn hợp lý — nhiều start-up chạy như vậy nhiều năm. Đây là mỗi mảnh khi sang AWS:</p>
${bangDoiChieu(false)}
<p>Để ý dòng 5: mã của trang web vốn đã nói chuyện với R2 qua <code>@aws-sdk/client-s3</code>, SDK chính thức của AWS, vì R2 cài đặt đúng API của S3. Chuyển tệp sang S3 phần lớn chỉ là đổi endpoint và khoá. Chương 2 cho thấy cùng một đoạn mã chạy với S3, với endpoint kiểu R2 và với LocalStack.</p>

<h3>Cùng một ứng dụng, hai cách — thật sự khác ở đâu</h3>
<table>
  <thead><tr><th>Câu hỏi</th><th>VPS</th><th>AWS (dịch vụ được quản lý)</th></tr></thead>
  <tbody>
    <tr><td>Máy chết</td><td>Trang sập tới khi bạn dựng lại trên VPS mới</td><td>Auto Scaling bật máy mới; RDS Multi-AZ chuyển dự phòng trong vài phút</td></tr>
    <tr><td>Lượng truy cập ×10 mùa thi</td><td>Nâng gói, khởi động lại, cầu may</td><td>Thêm task/máy sau load balancer, tự động</td></tr>
    <tr><td>Sao lưu cơ sở dữ liệu</td><td>Script của bạn, bạn tự kiểm</td><td>Sao lưu tự động và khôi phục về thời điểm bất kỳ, có sẵn</td></tr>
    <tr><td>Vá bảo mật hệ điều hành</td><td>Bạn</td><td>Bạn nếu dùng EC2; AWS nếu dùng Fargate, RDS, Lambda</td></tr>
    <tr><td>Chi phí tháng</td><td>Cố định và thấp</td><td>Biến đổi; cao hơn cho cùng tài nguyên; có thể bùng nổ nếu cấu hình sai</td></tr>
    <tr><td>Phải học thêm gì</td><td>Linux, Docker, Nginx</td><td>Tất cả những thứ đó + IAM, VPC, cách AWS tính tiền</td></tr>
  </tbody>
</table>

<h3>Tính tiền bằng số thật</h3>
<p>Giá dưới đây tải từ <strong>AWS Price List API</strong> cho region Singapore (ap-southeast-1), region gần Việt Nam nhất, vào tháng 11/2026. Một tháng tính 730 giờ; chưa gồm thuế; con số lưu lượng (300 GB ra Internet) là giả định. Máy tính chi phí chỉ là vài dòng JavaScript:</p>
${MA_GIA}
${OUT_GIA}
<p>Ba bài học từ những con số đó:</p>
<ul>
  <li><strong>Kịch bản A</strong> — một EC2 làm “VPS” — đã đắt ngang mấy gói VPS phổ biến cùng cấu hình: bạn trả tiền cho cả nền tảng dù không dùng gì của nó. Nếu chỉ cần một máy, VPS thường rẻ hơn.</li>
  <li><strong>Kịch bản B</strong> mua được những thứ VPS không có: cơ sở dữ liệu sống sót khi một trung tâm dữ liệu hỏng, máy tự thay thế, load balancer. Tiền thêm là để trả cho những thứ đó.</li>
  <li><strong>Sát thủ thầm lặng là NAT gateway</strong>: 43 USD một tháng chỉ để tồn tại — đắt hơn cả cơ sở dữ liệu. Chương 3 chỉ cách né (VPC endpoint, subnet public cho môi trường dev). Lưu lượng ra Internet (0,12 USD/GB sau 100 GB đầu) là dòng còn lại hay làm người ta giật mình.</li>
</ul>

<h3>Một luật thật lòng</h3>
<ul>
  <li><strong>VPS là đủ</strong> khi: một máy gánh được tải, sập vài phút chấp nhận được, nhóm nhỏ và biết Linux, ngân sách eo hẹp. Đa số đồ án sinh viên và nhiều sản phẩm nhỏ nằm ở đây.</li>
  <li><strong>Cloud đáng đồng tiền</strong> khi: sập là mất tiền thật, lượng truy cập lên xuống thất thường hoặc đang tăng, cần cơ sở dữ liệu được quản lý có sao lưu và chuyển dự phòng, quy định bắt buộc có nhật ký kiểm toán và mã hoá, hoặc công ty vốn đã dùng AWS — đó là lý do nhà tuyển dụng đòi.</li>
  <li>Nhiều hệ thống thật là <strong>lai</strong>: cuongthai.com đã thuê kho R2 và máy GPU theo giờ trong khi phần lõi vẫn ở VPS.</li>
</ul>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>“Vì sao em chuyển (hoặc không chuyển) ứng dụng từ VPS lên AWS?”</strong> — Chuyển vì tính sẵn sàng (nhiều AZ), co giãn, sao lưu được quản lý, công cụ bảo mật và kiểm toán; ở lại khi một máy là đủ và chi phí ổn định quan trọng hơn. Cho thấy bạn hiểu đánh đổi, không chỉ nhắc từ khoá.</li>
  <li><strong>“Trên AWS thì Nginx, Postgres trong Docker, CDN tương ứng với gì?”</strong> — ALB (+ACM), RDS cho PostgreSQL, CloudFront.</li>
  <li><strong>“Chi phí AWS nào hay làm các nhóm bất ngờ nhất?”</strong> — NAT gateway, lưu lượng ra Internet, load balancer và cơ sở dữ liệu bỏ không, địa chỉ IPv4 công khai, máy quá cỡ, và tiền nạp log.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Vẽ dự án của bạn (hoặc LabFlow) thành các hộp: ứng dụng, cơ sở dữ liệu, tệp, proxy, DNS, CI.</li>
  <li>Cạnh mỗi hộp, ghi dịch vụ AWS tương ứng theo bảng trên.</li>
  <li>Mở AWS Pricing Calculator (calculator.aws), chọn Asia Pacific (Singapore), tính kịch bản A cho dự án của bạn. So với tiền bạn đang (hoặc sẽ) trả cho VPS.</li>
</ol>
<p><strong>Đạt khi:</strong> có sơ đồ mà hộp nào cũng có tên dịch vụ AWS, và một con số ước tính hằng tháng bạn giải thích được từng dòng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">VPS</span><span class="v">Máy chủ ảo riêng thuê theo tháng, tài nguyên cố định.</span></div>
  <div class="kv"><span class="k">Dịch vụ được quản lý</span><span class="v">Nhà cung cấp vận hành phần mềm (vá, sao lưu, chuyển dự phòng); bạn dùng qua API.</span></div>
  <div class="kv"><span class="k">Multi-AZ</span><span class="v">Bản dự phòng ở một cụm trung tâm dữ liệu khác, tự tiếp quản khi bản chính hỏng.</span></div>
  <div class="kv"><span class="k">NAT gateway</span><span class="v">Cho máy private ra Internet; tính tiền theo giờ và theo GB.</span></div>
  <div class="kv"><span class="k">Data transfer out</span><span class="v">Lưu lượng từ AWS ra Internet; 100 GB đầu mỗi tháng miễn phí, sau đó tính theo GB.</span></div>
  <div class="kv"><span class="k">Price List API</span><span class="v">Các tệp giá công khai, máy đọc được của AWS — nguồn của mọi con số ở trên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mảnh nào của hệ VPS cũng có dịch vụ AWS tương ứng; R2 → S3 dễ nhất vì cùng API.</li>
  <li>Với cùng tài nguyên thô, cloud đắt hơn; bạn trả cho tính sẵn sàng, co giãn và vận hành được quản lý.</li>
  <li>Tính bằng số thật; canh NAT gateway, lưu lượng ra ngoài và tài nguyên bỏ không.</li>
  <li>VPS cho một máy và ngân sách eo hẹp; cloud khi sập, tăng trưởng hay quy định là chuyện lớn.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://calculator.aws/', '🧮', 'AWS Pricing Calculator', 'Ước tính cả một kiến trúc theo tháng, từng region.')}
${tl('https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html', '📄', 'Tài liệu AWS — Dùng AWS Price List API', 'Nơi lấy các con số giá máy đọc được trong bài này.')}

<h3>Nguồn</h3>
<ul>
  <li>AWS Price List API, tệp giá ap-southeast-1 của EC2, RDS, ELB, VPC, S3, CloudWatch, Secrets Manager, Data Transfer (công bố 11/2026): <a href="https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json" target="_blank" rel="noopener">pricing.us-east-1.amazonaws.com</a></li>
  <li>Tính phí địa chỉ IPv4 công khai (từ 01/02/2024): <a href="https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws</a></li>
  <li>Extension của RDS cho PostgreSQL (PostGIS, pgvector): <a href="https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html" target="_blank" rel="noopener">docs.aws.amazon.com</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.3 — Hạ tầng toàn cầu ═══════════════════════════ */
const OUT_VUNG = out(`$ aws ec2 describe-regions --query 'length(Regions)'
38
$ aws ec2 describe-availability-zones --region ap-southeast-1 \\
    --query 'AvailabilityZones[].[ZoneName,ZoneId]' --output text
ap-southeast-1a	apse1-az1
ap-southeast-1b	apse1-az2
ap-southeast-1c	apse1-az3`);
const OUT_TRE = out(`region          vị trí            TCP connect (trung vị 7 lần, đo từ Việt Nam)
ap-southeast-7  Thai Lan          38 ms
ap-east-1       Hong Kong         42 ms
ap-southeast-1  Singapore         48 ms
ap-southeast-5  Malaysia          53 ms
ap-northeast-1  Tokyo             99 ms
eu-central-1    Frankfurt        219 ms
us-east-1       Virginia (My)    243 ms`);
const MA_TRE = bash(`
# Đo độ trễ tới endpoint công khai của từng region: 7 lần, lấy trung vị thời gian bắt tay TCP
for r in ap-southeast-1 ap-southeast-7 ap-east-1 ap-northeast-1 us-east-1; do
  for i in 1 2 3 4 5 6 7; do
    curl -s -o /dev/null -m 10 -w '%{time_namelookup} %{time_connect}\\n' https://dynamodb.$r.amazonaws.com/ping
  done | awk '{print ($2-$1)*1000}' | sort -n | awk -v r=$r '{a[NR]=$1} END{printf "%-15s %4.0f ms\\n", r, a[4]}'
done`);

const L03_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 3</span>
<h2>0.3 — AWS global infrastructure: regions, Availability Zones and edge locations</h2>
<p class="lead">“Where is my server?” On a VPS the answer is one machine in one data centre. On AWS the first thing every console page asks is a <em>region</em>, and the first thing every architecture diagram shows is <em>Availability Zones</em>. Getting these right decides your latency, your price, what survives a failure — and half of the beginner bugs (“my resource disappeared!” — no, you are looking at another region).</p>

<h3>Three levels, one picture</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Region</span><span class="lz-t">A geographic area — e.g. ap-southeast-1 (Singapore)</span><span class="lz-d">Fully independent from other regions: its own services, prices, and failures. Data does not leave a region unless you move it. Each region has several AZs, typically three or more.</span></div>
  <div class="lz-step"><span class="lz-k">AZ</span><span class="lz-t">Availability Zone — e.g. ap-southeast-1a</span><span class="lz-d">One or more separate data centres with their own power, cooling and network, a meaningful distance from the other AZs but close enough (within about 100 km) for single-digit-millisecond links. A fire or flood in one AZ should not touch the others.</span></div>
  <div class="lz-step"><span class="lz-k">Edge</span><span class="lz-t">Edge locations / points of presence</span><span class="lz-d">Hundreds of smaller sites in many more cities, used by CloudFront (CDN), Route 53 (DNS) and Global Accelerator to answer users close to where they are.</span></div>
</div>
<p>A real-life picture: a bank (region) has several branches across the city (AZs), each with its own generator and vault, and ATMs on every corner (edge locations). If one branch floods, you go to another; the ATMs only hand out cash that is already there.</p>
<p>Here is what the AWS CLI reports, run on LocalStack (the emulator returns AWS's list of regions and the three Singapore AZs):</p>
${OUT_VUNG}
<p>Notice the two columns. <code>ap-southeast-1a</code> is a <strong>name</strong>, and in the nine oldest Regions (Singapore, Tokyo and N. Virginia among them) AWS mapped names to physical zones differently for each account created before November 2025 — so a company account's “1a” may be your “1b”. Regions launched after 2012 and accounts created since November 2025 use one mapping. The <strong>AZ ID</strong> (<code>apse1-az1</code>) is the same physical zone for everyone, always. Use the ID when two accounts must agree on a zone.</p>

<h3>Which region for a Vietnamese user? Measure it</h3>
<p>Latency is physics: light in fibre needs time, and every route has detours. Rather than guessing, this course measured it — 7 connections from Vietnam to the public endpoint of each region, keeping the median TCP handshake time:</p>
${MA_TRE}
${OUT_TRE}
<p>Two surprises worth noticing: Bangkok (ap-southeast-7, opened January 2025) and Hong Kong answered slightly faster than Singapore from this connection, and the numbers move a few milliseconds between runs. The big picture is stable: Southeast Asia around 40–50 ms, Tokyo about 100 ms, Europe and the US East coast 220–240 ms. A page that needs ten round trips feels instant from Singapore and sluggish from Virginia.</p>

<h3>Four questions to choose a region</h3>
<ol>
  <li><strong>Law and data residency.</strong> Some data must stay in a country or region (personal data, banking, government). Vietnam's personal-data rules (Decree 13/2023 and the 2025 Personal Data Protection Law) put conditions on transferring data abroad — at work, the legal team decides, not the developer.</li>
  <li><strong>Latency to your users.</strong> Measure, as above. For Vietnam, Singapore is the usual default.</li>
  <li><strong>Service and instance availability.</strong> New services and instance types appear in large regions first; check the region list of the service before you design around it.</li>
  <li><strong>Price.</strong> The same t3.micro is 0.0104 USD/hour in us-east-1 and 0.0132 USD/hour in Singapore — about 27% more. For a demo that is nothing; for a fleet it is real money.</li>
</ol>

<h3>Global or regional? A common trap</h3>
<ul>
  <li><strong>Global</strong> services: IAM, Route 53, CloudFront, Organizations. A user created in IAM exists everywhere.</li>
  <li><strong>Regional</strong> services: EC2, RDS, Lambda, VPC, most others. A machine in Singapore is invisible when the console is set to Tokyo.</li>
  <li><strong>S3 is the odd one</strong>: bucket names are global (unique in the world), but each bucket lives in one region.</li>
</ul>

<h3>What a region failure looks like — real incidents</h3>
<p>Multi-AZ protects you from losing <em>one</em> data centre group. It does not protect you from a problem in a regional service itself. On <strong>7 December 2021</strong>, a network problem inside AWS's us-east-1 region disrupted many services for hours; on <strong>20 October 2025</strong>, a DNS automation fault around DynamoDB in us-east-1 cascaded into a long outage that took down well-known apps worldwide. Both were in the oldest, largest region — the one many “global” control planes depend on. Lessons for you: deploy across at least two AZs from day one; for systems that must never stop, design a multi-region plan (Chapter 16); and do not put everything in us-east-1 just because it is the default and the cheapest.</p>

<h3>Beyond regions (exam vocabulary)</h3>
<ul>
  <li><strong>Local Zones</strong> — small extensions of a region placed in a big city for very low latency.</li>
  <li><strong>Wavelength</strong> — AWS compute inside telecom 5G networks.</li>
  <li><strong>Outposts</strong> — AWS racks installed in your own data centre.</li>
</ul>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“Region vs Availability Zone?”</strong> — A region is an independent geographic area; an AZ is an isolated data-centre group inside it. You get high availability by spreading across AZs, disaster recovery by spreading across regions.</li>
  <li><strong>“How do you choose a region?”</strong> — Compliance first, then latency to users, service availability, and price.</li>
  <li><strong>“Is IAM regional?”</strong> — No, IAM is global; EC2, RDS and VPC are regional; S3 bucket names are global but the data is regional.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run the measuring loop above from your home and from your school network. Do the rankings change?</li>
  <li>Pick a region for LabFlow (users in Vietnam) and write two sentences justifying it with the four questions.</li>
  <li>In the console (or the AWS docs), find one service or instance type that is not available in your chosen region.</li>
</ol>
<p><strong>Done when:</strong> you have two latency tables and a written region choice that mentions compliance, latency, availability and price.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Region</span><span class="v">An independent geographic area of AWS, e.g. ap-southeast-1.</span></div>
  <div class="kv"><span class="k">Availability Zone (AZ)</span><span class="v">An isolated group of data centres inside a region.</span></div>
  <div class="kv"><span class="k">AZ ID</span><span class="v">The account-independent identifier of a physical AZ, e.g. apse1-az1.</span></div>
  <div class="kv"><span class="k">Edge location</span><span class="v">A site used by CloudFront and Route 53 to serve users nearby.</span></div>
  <div class="kv"><span class="k">Latency</span><span class="v">Time for a round trip; measured here as the TCP handshake.</span></div>
  <div class="kv"><span class="k">Data residency</span><span class="v">Rules on where data may be stored and processed.</span></div>
  <div class="kv"><span class="k">Local Zone / Outposts</span><span class="v">AWS capacity placed in a city / in your own data centre.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Region ⊃ AZs; edge locations sit closer to users for CDN and DNS.</li>
  <li>AZ names may differ between accounts (old Regions, accounts before 11/2025); AZ IDs are physical.</li>
  <li>Choose a region by compliance, latency (measure it), availability, price.</li>
  <li>Spread across AZs always; across regions when downtime is unacceptable.</li>
  <li>IAM, Route 53, CloudFront are global; most services are regional.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://aws.amazon.com/about-aws/global-infrastructure/regions_az/', '🌏', 'AWS — Regions and Availability Zones', 'The official map and definitions.')}
${tl('https://docs.aws.amazon.com/ram/latest/userguide/working-with-az-ids.html', '🆔', 'AWS docs — AZ IDs for your resources', 'Why ap-southeast-1a differs between accounts.')}

<h3>Sources</h3>
<ul>
  <li>Summary of the AWS service event in us-east-1, 7 December 2021: <a href="https://aws.amazon.com/message/12721/" target="_blank" rel="noopener">aws.amazon.com/message/12721</a></li>
  <li>Summary of the Amazon DynamoDB service disruption in us-east-1, October 2025: <a href="https://aws.amazon.com/message/101925/" target="_blank" rel="noopener">aws.amazon.com/message/101925</a></li>
  <li>AWS Asia Pacific (Thailand) region launch, January 2025: <a href="https://aws.amazon.com/blogs/aws/announcing-the-new-aws-asia-pacific-thailand-region/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws</a></li>
  <li>Prices: AWS Price List API (us-east-1 and ap-southeast-1 EC2 offers, November 2026).</li>
  <li>AZ IDs and Regions with independently mapped Availability Zones: <a href="https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html" target="_blank" rel="noopener">docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html</a></li>
</ul>
</div>
`;

const L03_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 3</span>
<h2>0.3 — Hạ tầng toàn cầu của AWS: region, Availability Zone và edge location</h2>
<p class="lead">“Máy chủ của mình nằm ở đâu?” Với VPS, câu trả lời là một máy trong một trung tâm dữ liệu. Với AWS, thứ đầu tiên mọi trang console hỏi là <em>region</em>, và thứ đầu tiên mọi sơ đồ kiến trúc vẽ là <em>Availability Zone</em>. Hiểu đúng hai thứ này quyết định độ trễ, giá tiền, cái gì sống sót khi có sự cố — và một nửa số lỗi của người mới (“tài nguyên của em biến mất!” — không, bạn đang nhìn sang region khác).</p>

<h3>Ba tầng, một bức tranh</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Region</span><span class="lz-t">Một vùng địa lý — ví dụ ap-southeast-1 (Singapore)</span><span class="lz-d">Độc lập hoàn toàn với region khác: dịch vụ riêng, giá riêng, sự cố riêng. Dữ liệu không rời region trừ khi bạn tự chuyển. Mỗi region có nhiều AZ, thường từ ba trở lên.</span></div>
  <div class="lz-step"><span class="lz-k">AZ</span><span class="lz-t">Availability Zone — ví dụ ap-southeast-1a</span><span class="lz-d">Một hoặc vài trung tâm dữ liệu riêng biệt, có điện, làm mát và mạng riêng, cách các AZ khác một khoảng đáng kể nhưng đủ gần (trong khoảng 100 km) để nối nhau chỉ vài mili giây. Cháy hay lụt ở một AZ không được lan sang AZ khác.</span></div>
  <div class="lz-step"><span class="lz-k">Edge</span><span class="lz-t">Edge location / điểm hiện diện</span><span class="lz-d">Hàng trăm điểm nhỏ hơn ở nhiều thành phố hơn, dùng cho CloudFront (CDN), Route 53 (DNS) và Global Accelerator để trả lời người dùng ngay gần họ.</span></div>
</div>
<p>Hình ảnh đời thường: một ngân hàng (region) có vài chi nhánh khắp thành phố (AZ), mỗi chi nhánh có máy phát điện và kho tiền riêng, còn cây ATM thì ở mọi góc phố (edge location). Một chi nhánh bị ngập thì bạn sang chi nhánh khác; cây ATM chỉ nhả ra tiền đã có sẵn trong nó.</p>
<p>Đây là thứ AWS CLI báo về khi chạy trên LocalStack (bộ giả lập trả đúng danh sách region của AWS và ba AZ của Singapore):</p>
${OUT_VUNG}
<p>Để ý hai cột. <code>ap-southeast-1a</code> là một <strong>tên</strong>, và ở chín region lâu đời nhất (có Singapore, Tokyo, N. Virginia), AWS ánh xạ tên sang vùng vật lý khác nhau cho từng tài khoản tạo trước tháng 11/2025 — nên “1a” của tài khoản công ty có thể là “1b” của bạn. Region mở sau 2012 và tài khoản tạo từ tháng 11/2025 dùng chung một cách ánh xạ. <strong>AZ ID</strong> (<code>apse1-az1</code>) thì luôn là cùng một vùng vật lý với mọi người. Dùng ID khi hai tài khoản cần thống nhất cùng một vùng.</p>

<h3>Người dùng ở Việt Nam thì chọn region nào? Đo đi</h3>
<p>Độ trễ là chuyện vật lý: ánh sáng trong cáp quang cần thời gian, và đường đi nào cũng vòng vèo. Thay vì đoán, khoá này đã đo — 7 kết nối từ Việt Nam tới endpoint công khai của từng region, lấy trung vị thời gian bắt tay TCP:</p>
${MA_TRE}
${OUT_TRE}
<p>Hai điều bất ngờ đáng để ý: Bangkok (ap-southeast-7, mở tháng 1/2025) và Hồng Kông trả lời nhanh hơn Singapore một chút từ đường mạng này, và các con số xê dịch vài mili giây giữa các lần đo. Bức tranh lớn thì ổn định: Đông Nam Á khoảng 40–50 ms, Tokyo khoảng 100 ms, châu Âu và bờ Đông nước Mỹ 220–240 ms. Một trang cần mười lượt đi–về thì từ Singapore thấy tức thì, từ Virginia thấy ì ạch.</p>

<h3>Bốn câu hỏi để chọn region</h3>
<ol>
  <li><strong>Luật và nơi lưu dữ liệu.</strong> Có loại dữ liệu bắt buộc ở lại trong một nước hay một vùng (dữ liệu cá nhân, ngân hàng, cơ quan nhà nước). Quy định về dữ liệu cá nhân của Việt Nam (Nghị định 13/2023 và Luật Bảo vệ dữ liệu cá nhân 2025) đặt điều kiện khi chuyển dữ liệu ra nước ngoài — đi làm thì bộ phận pháp chế quyết, không phải lập trình viên.</li>
  <li><strong>Độ trễ tới người dùng.</strong> Đo như trên. Với Việt Nam, Singapore là lựa chọn mặc định thường gặp.</li>
  <li><strong>Dịch vụ và loại máy có sẵn không.</strong> Dịch vụ mới và loại máy mới thường có ở region lớn trước; xem danh sách region của dịch vụ trước khi thiết kế dựa vào nó.</li>
  <li><strong>Giá.</strong> Cùng một máy t3.micro: 0,0104 USD/giờ ở us-east-1 và 0,0132 USD/giờ ở Singapore — đắt hơn khoảng 27%. Với một bản demo thì chẳng đáng gì; với cả đội máy thì là tiền thật.</li>
</ol>

<h3>Toàn cầu hay theo region? Một cái bẫy hay gặp</h3>
<ul>
  <li>Dịch vụ <strong>toàn cầu</strong>: IAM, Route 53, CloudFront, Organizations. User tạo trong IAM có mặt ở mọi nơi.</li>
  <li>Dịch vụ <strong>theo region</strong>: EC2, RDS, Lambda, VPC, và đa số dịch vụ khác. Máy ở Singapore sẽ vô hình khi console đang chọn Tokyo.</li>
  <li><strong>S3 là trường hợp lạ</strong>: tên bucket là toàn cầu (duy nhất trên thế giới), nhưng mỗi bucket nằm ở một region.</li>
</ul>

<h3>Sự cố cả region trông thế nào — các vụ thật</h3>
<p>Multi-AZ bảo vệ bạn khi mất <em>một</em> cụm trung tâm dữ liệu. Nó không bảo vệ khi chính một dịch vụ cấp region gặp sự cố. Ngày <strong>7/12/2021</strong>, một sự cố mạng bên trong region us-east-1 làm nhiều dịch vụ gián đoạn hàng giờ; ngày <strong>20/10/2025</strong>, một lỗi tự động hoá DNS quanh DynamoDB ở us-east-1 lan dây chuyền thành đợt sập dài, kéo theo nhiều ứng dụng nổi tiếng trên khắp thế giới. Cả hai đều ở region lâu đời và lớn nhất — nơi nhiều phần điều khiển “toàn cầu” phụ thuộc vào. Bài học cho bạn: triển khai trên ít nhất hai AZ ngay từ ngày đầu; hệ thống không được phép dừng thì cần phương án nhiều region (Chương 16); và đừng dồn mọi thứ vào us-east-1 chỉ vì nó là mặc định và rẻ nhất.</p>

<h3>Ngoài region (từ vựng đề thi)</h3>
<ul>
  <li><strong>Local Zones</strong> — phần mở rộng nhỏ của một region đặt ở thành phố lớn để độ trễ thật thấp.</li>
  <li><strong>Wavelength</strong> — máy tính AWS đặt ngay trong mạng 5G của nhà mạng.</li>
  <li><strong>Outposts</strong> — tủ máy AWS lắp ngay trong trung tâm dữ liệu của bạn.</li>
</ul>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>“Region khác Availability Zone thế nào?”</strong> — Region là một vùng địa lý độc lập; AZ là một cụm trung tâm dữ liệu cách ly bên trong nó. Trải trên nhiều AZ để có tính sẵn sàng cao, trải trên nhiều region để phục hồi thảm hoạ.</li>
  <li><strong>“Em chọn region thế nào?”</strong> — Quy định pháp lý trước, rồi độ trễ tới người dùng, dịch vụ có sẵn, và giá.</li>
  <li><strong>“IAM có theo region không?”</strong> — Không, IAM là toàn cầu; EC2, RDS, VPC theo region; tên bucket S3 toàn cầu nhưng dữ liệu nằm theo region.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy vòng đo ở trên từ mạng nhà và mạng trường. Thứ hạng có đổi không?</li>
  <li>Chọn region cho LabFlow (người dùng ở Việt Nam), viết hai câu giải thích bằng bốn câu hỏi.</li>
  <li>Trên console (hoặc tài liệu AWS), tìm một dịch vụ hay loại máy không có ở region bạn chọn.</li>
</ol>
<p><strong>Đạt khi:</strong> có hai bảng độ trễ và một lựa chọn region viết ra, có nhắc tới pháp lý, độ trễ, dịch vụ có sẵn và giá.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Region</span><span class="v">Một vùng địa lý độc lập của AWS, ví dụ ap-southeast-1.</span></div>
  <div class="kv"><span class="k">Availability Zone (AZ)</span><span class="v">Một cụm trung tâm dữ liệu cách ly bên trong region.</span></div>
  <div class="kv"><span class="k">AZ ID</span><span class="v">Mã của AZ vật lý, giống nhau với mọi tài khoản, ví dụ apse1-az1.</span></div>
  <div class="kv"><span class="k">Edge location</span><span class="v">Điểm dùng cho CloudFront và Route 53 để phục vụ người dùng ở gần.</span></div>
  <div class="kv"><span class="k">Độ trễ</span><span class="v">Thời gian một lượt đi–về; ở đây đo bằng bắt tay TCP.</span></div>
  <div class="kv"><span class="k">Data residency</span><span class="v">Quy định dữ liệu được lưu và xử lý ở đâu.</span></div>
  <div class="kv"><span class="k">Local Zone / Outposts</span><span class="v">Năng lực AWS đặt ở một thành phố / trong trung tâm dữ liệu của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Region chứa nhiều AZ; edge location ở gần người dùng hơn, phục vụ CDN và DNS.</li>
  <li>Tên AZ có thể khác nhau giữa các tài khoản (region cũ, tài khoản trước 11/2025); AZ ID là vùng vật lý.</li>
  <li>Chọn region theo pháp lý, độ trễ (hãy đo), dịch vụ có sẵn, giá.</li>
  <li>Luôn trải trên nhiều AZ; trải nhiều region khi không được phép sập.</li>
  <li>IAM, Route 53, CloudFront là toàn cầu; đa số dịch vụ theo region.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://aws.amazon.com/about-aws/global-infrastructure/regions_az/', '🌏', 'AWS — Regions and Availability Zones', 'Bản đồ và định nghĩa chính thức.')}
${tl('https://docs.aws.amazon.com/ram/latest/userguide/working-with-az-ids.html', '🆔', 'Tài liệu AWS — AZ ID cho tài nguyên', 'Vì sao ap-southeast-1a khác nhau giữa các tài khoản.')}

<h3>Nguồn</h3>
<ul>
  <li>Tóm tắt sự cố dịch vụ AWS ở us-east-1, 7/12/2021: <a href="https://aws.amazon.com/message/12721/" target="_blank" rel="noopener">aws.amazon.com/message/12721</a></li>
  <li>Tóm tắt sự cố Amazon DynamoDB ở us-east-1, 10/2025: <a href="https://aws.amazon.com/message/101925/" target="_blank" rel="noopener">aws.amazon.com/message/101925</a></li>
  <li>Ra mắt region Asia Pacific (Thailand), 1/2025: <a href="https://aws.amazon.com/blogs/aws/announcing-the-new-aws-asia-pacific-thailand-region/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws</a></li>
  <li>Giá: AWS Price List API (tệp giá EC2 của us-east-1 và ap-southeast-1, 11/2026).</li>
  <li>AZ ID và các region ánh xạ AZ riêng theo tài khoản: <a href="https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html" target="_blank" rel="noopener">docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.4 — Công cụ + phòng lab ở máy ═══════════════════════════ */
const OUT_LS_LATEST = out(`$ docker run --rm localstack/localstack:latest
LocalStack version: 2026.10.8
…
License activation failed! 🔑❌
Reason: No credentials were found in the environment. Please set the LOCALSTACK_AUTH_TOKEN variable
to a valid auth token. …
Localstack returning with exit code 55.`);
const MA_LAB = bash(`
# 1) LocalStack bản community, GHIM phiên bản (bản latest từ 2026 đòi auth token)
docker run -d --name aws-ls -p 127.0.0.1:4566:4566 localstack/localstack:4.12
curl -s localhost:4566/_localstack/health | head -c 120

# 2) AWS CLI v2 thật, chạy trong Docker (không cần cài), trỏ vào LocalStack
alias awsl='docker run --rm -i --network host -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \\
  -e AWS_DEFAULT_REGION=ap-southeast-1 -v "$PWD":/aws amazon/aws-cli --endpoint-url http://127.0.0.1:4566'
awsl s3 ls

# 3) Terraform, cũng trong Docker
alias tf='docker run --rm --network host -v "$PWD":/w -w /w hashicorp/terraform:latest'
tf version`);
const MA_TF = hcl(`
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}

# Trỏ provider AWS vào LocalStack trên máy bạn (không tốn tiền, không cần tài khoản)
provider "aws" {
  region                      = "ap-southeast-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true
  endpoints {
    s3 = "http://127.0.0.1:44566"
  }
  default_tags {
    tags = { Project = "labflow", Owner = "sv", Lab = "m0" }
  }
}

resource "aws_s3_bucket" "anh" {
  bucket = "labflow-anh-m0"
}

output "ten_bucket" {
  value = aws_s3_bucket.anh.bucket
}`);
const OUT_TF = out(`$ terraform version
Terraform v1.17.2
$ terraform init
- Installing hashicorp/aws v6.73.0...
- Installed hashicorp/aws v6.73.0 (signed by HashiCorp)
Terraform has been successfully initialized!
$ terraform plan
  # aws_s3_bucket.anh will be created
  + resource "aws_s3_bucket" "anh" {
      + bucket                      = "labflow-anh-m0"
      + region                      = "ap-southeast-1"
      + tags_all                    = {
          + "Lab"     = "m0"
          + "Owner"   = "sv"
          + "Project" = "labflow"
        }
    }
Plan: 1 to add, 0 to change, 0 to destroy.
$ terraform apply -auto-approve
aws_s3_bucket.anh: Creating...
aws_s3_bucket.anh: Creation complete after 0s [id=labflow-anh-m0]
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
ten_bucket = "labflow-anh-m0"
$ aws s3 ls
2026-11-18 17:58:11 labflow-anh-m0
$ aws s3api get-bucket-tagging --bucket labflow-anh-m0 --output text
TAGSET	Lab	m0
TAGSET	Owner	sv
TAGSET	Project	labflow
$ terraform destroy -auto-approve
aws_s3_bucket.anh: Destroying... [id=labflow-anh-m0]
aws_s3_bucket.anh: Destruction complete after 0s
Destroy complete! Resources: 1 destroyed.
$ aws s3 ls
(rỗng — không còn gì)`);
const MA_CONGI = bash(`
# "Còn gì đang tính tiền?" — chạy trên tài khoản AWS THẬT (cần quyền đọc). Quét MỌI region.
for r in $(aws ec2 describe-regions --query 'Regions[].RegionName' --output text); do
  echo "== $r"
  aws ec2 describe-instances --region $r --output text \\
    --filters Name=instance-state-name,Values=running,stopped \\
    --query 'Reservations[].Instances[].[InstanceId,InstanceType,State.Name]'
  aws ec2 describe-nat-gateways --region $r --output text \\
    --filter Name=state,Values=available --query 'NatGateways[].NatGatewayId'
  aws ec2 describe-addresses --region $r --output text --query 'Addresses[].PublicIp'
  aws ec2 describe-volumes --region $r --output text --query 'Volumes[].[VolumeId,Size,State]'
  aws rds describe-db-instances --region $r --output text --query 'DBInstances[].DBInstanceIdentifier'
  aws elbv2 describe-load-balancers --region $r --output text --query 'LoadBalancers[].LoadBalancerName'
done
aws s3 ls        # bucket là toàn cầu: liệt kê một lần`);

const L04_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 4</span>
<h2>0.4 — Your tools and a free local lab: Console, CLI, SDK, LocalStack and Terraform</h2>
<p class="lead">There are four ways to talk to AWS, and they all send the same signed API calls. This lesson shows when to use each, then builds the free lab you will use for the whole course — LocalStack, the real AWS CLI and Terraform, all in Docker — and ends with the most important habit of all: the “what is still billing?” check.</p>

<h3>Four ways in</h3>
<table>
  <thead><tr><th>Tool</th><th>Best for</th><th>Watch out</th></tr></thead>
  <tbody>
    <tr><td><strong>Management Console</strong> (web)</td><td>Exploring, reading bills and graphs, one-off settings</td><td>Not repeatable; easy to forget what you clicked — and where (region selector, top right)</td></tr>
    <tr><td><strong>AWS CLI v2</strong></td><td>Scripts, checks, quick queries with <code>--query</code></td><td>Uses whatever credentials and region it finds first</td></tr>
    <tr><td><strong>SDKs</strong> (JavaScript v3, Java v2, Python boto3…)</td><td>Your application code: upload to S3, send to SQS</td><td>Never hard-code keys; let the SDK find a role</td></tr>
    <tr><td><strong>Infrastructure as code</strong> (Terraform, CloudFormation, CDK)</td><td>Everything that must be rebuilt, reviewed or destroyed cleanly</td><td>The state file is precious (Chapter 11)</td></tr>
  </tbody>
</table>
<p><strong>AWS CloudShell</strong> is a browser terminal inside the console with the CLI already logged in as you — handy on a school computer where you cannot install anything.</p>

<h3>Where do the CLI and SDKs find credentials?</h3>
<p>They search in a fixed order and stop at the first hit — the <em>credential provider chain</em>: (1) environment variables <code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code>; (2) the profile in <code>~/.aws/credentials</code> and <code>~/.aws/config</code> (including SSO profiles); (3) on AWS itself, the role of the container or EC2 instance. That order explains a classic bug: an old key in an environment variable silently overrides the profile you think you are using. One real-run surprise (19 Nov 2026): the <strong>CLI</strong> lets the environment key win even over <code>AWS_PROFILE</code>, while the <strong>JavaScript SDK v3</strong> (credential-provider-node 3.972) does the opposite when <code>AWS_PROFILE</code> is set — it uses the profile and only prints a <em>Multiple credential sources detected</em> warning, saying a future version may change this. Never set both. <code>aws sts get-caller-identity</code> tells you who you really are — run it whenever in doubt.</p>

<h3>The free lab: LocalStack + AWS CLI + Terraform in Docker</h3>
<p>LocalStack emulates the AWS APIs on your machine: S3, SQS, SNS, Lambda, DynamoDB, IAM, CloudWatch, and more. Nothing is billed, and nothing is left running when you remove the container. One real-world note found while writing this course: since 2026 the <code>latest</code> image of LocalStack requires a (free or paid) account token and refuses to start without it:</p>
${OUT_LS_LATEST}
<p>So the course <strong>pins the last community version, 4.12</strong>, which runs without an account. Pinning versions is a good habit anyway — “latest” changes under your feet.</p>
${MA_LAB}
<p>What LocalStack cannot do: it does not enforce IAM permissions in the free edition (every call is allowed), and some services (Budgets, load balancers, ECS, CloudFront) are missing or paid. When a lesson needs those, it says so and either uses another emulator (Moto, in lesson 0.1) or shows a diagram and the real-AWS commands.</p>

<h3>Your first Terraform run: create, check, destroy</h3>
<p>Terraform describes resources in files; <code>plan</code> shows what will change, <code>apply</code> does it, <code>destroy</code> removes everything it created. Here the provider points at LocalStack, and <code>default_tags</code> stamps every resource with the project name — the habit that makes cleanup possible later:</p>
${MA_TF}
${OUT_TF}
<p>Read the output as a checklist: the plan says <em>1 to add</em>; after apply the bucket exists with its three tags; after destroy <code>aws s3 ls</code> is empty. That last check is not optional.</p>

<h3>The “what is still billing?” check (real account)</h3>
<p>On a real account, resources hide in other regions. Before you close the laptop after a lab, run a sweep like this — it lists the usual suspects in every region:</p>
${MA_CONGI}
<p>Then open <strong>Billing → Bills</strong>: charges are broken down by service <em>and region</em>, which catches what a script misses. The console's <strong>Tag Editor</strong> can also search all regions for resources with <code>Project=labflow</code>. If a line says “0” everywhere and the bill shows nothing new the next day, you are clean.</p>

<h3>Real-life link</h3>
<p>The local lab is a flight simulator: you can crash as often as you like for free. The real account is the plane — you still fly it, but only with a checklist, and you walk around it after landing.</p>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“How does the AWS SDK find credentials?”</strong> — Through the provider chain: environment variables, shared config/credentials files and SSO profiles, then the container or instance role. In production use roles, not keys.</li>
  <li><strong>“Why use Terraform instead of the console?”</strong> — Repeatable, reviewable in pull requests, versioned, and able to destroy exactly what it created.</li>
  <li><strong>“How do you test AWS code without an AWS account?”</strong> — Emulators such as LocalStack or Moto, pointed at by an endpoint override, plus unit tests with mocked clients; then a real integration test in a sandbox account.</li>
</ol>

<h3>🧪 Practice (25 minutes) — the lab setup you will reuse</h3>
<div class="callout ok"><ol>
  <li>Start LocalStack 4.12 and create the <code>awsl</code> and <code>tf</code> aliases.</li>
  <li>Write the Terraform file above, change the bucket name to include your name, and run init → plan → apply.</li>
  <li>Prove the bucket exists and carries the three tags, then destroy it and prove it is gone.</li>
  <li>Remove the LocalStack container.</li>
</ol>
<p><strong>Done when:</strong> your terminal shows “Apply complete! Resources: 1 added”, the tags, “Destroy complete! Resources: 1 destroyed”, and an empty <code>s3 ls</code>.</p>
${giai('Hint: “connection refused” or Terraform cannot reach the endpoint', '<p>Check that LocalStack is healthy (<code>curl localhost:4566/_localstack/health</code>) and that the port in the <code>endpoints</code> block matches the one you published. Docker Desktop on Windows/macOS cannot use <code>--network host</code> the same way — use <code>http://host.docker.internal:4566</code> as the endpoint there.</p>')}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AWS CLI v2</span><span class="v">The official command-line client; every command is one or more API calls.</span></div>
  <div class="kv"><span class="k">SDK</span><span class="v">Libraries for calling AWS from code, e.g. @aws-sdk/client-s3 for Node.js.</span></div>
  <div class="kv"><span class="k">CloudShell</span><span class="v">A browser terminal with the CLI pre-authenticated as your console user.</span></div>
  <div class="kv"><span class="k">Credential provider chain</span><span class="v">The order in which CLI/SDKs look for credentials.</span></div>
  <div class="kv"><span class="k">LocalStack</span><span class="v">An AWS emulator in a container; pin version 4.12 for the free edition.</span></div>
  <div class="kv"><span class="k">Terraform plan / apply / destroy</span><span class="v">Preview changes, make them, remove everything Terraform created.</span></div>
  <div class="kv"><span class="k">default_tags</span><span class="v">Provider setting that tags every resource — the key to finding and cleaning up.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Console to explore, CLI to check, SDK in code, Terraform for anything you must rebuild or destroy.</li>
  <li>The credential chain decides who you are; <code>aws sts get-caller-identity</code> confirms it.</li>
  <li>Free lab = LocalStack 4.12 + AWS CLI + Terraform in Docker; know what it does not emulate.</li>
  <li>Every lab ends with destroy + a “what is still billing?” sweep across regions.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.localstack.cloud/', '🧪', 'LocalStack documentation', 'Supported services, configuration and integrations with Terraform and SDKs.')}
${tl('https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html', '🔗', 'AWS SDKs and Tools — credential providers', 'The exact lookup order used by the CLI and every SDK.')}

<h3>Sources</h3>
<ul>
  <li>Outputs in this lesson: run on the course machine, 19 Nov 2026 — AWS CLI 2.41.0, LocalStack 4.12.0, Terraform 1.17.2, provider hashicorp/aws 6.73.0.</li>
  <li>Terraform AWS provider documentation: <a href="https://registry.terraform.io/providers/hashicorp/aws/latest/docs" target="_blank" rel="noopener">registry.terraform.io/providers/hashicorp/aws</a></li>
  <li>AWS CloudShell: <a href="https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/cloudshell</a></li>
  <li>AWS CLI — configuration and credential precedence: <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html" target="_blank" rel="noopener">docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html</a></li>
</ul>
</div>
`;

const L04_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 4</span>
<h2>0.4 — Công cụ và phòng lab miễn phí ở máy: Console, CLI, SDK, LocalStack và Terraform</h2>
<p class="lead">Có bốn cách nói chuyện với AWS, và cả bốn đều gửi cùng những lời gọi API có chữ ký. Bài này chỉ khi nào dùng cách nào, rồi dựng phòng lab miễn phí bạn dùng suốt khoá — LocalStack, AWS CLI thật và Terraform, tất cả trong Docker — và kết thúc bằng thói quen quan trọng nhất: kiểm “còn gì đang tính tiền”.</p>

<h3>Bốn lối vào</h3>
<table>
  <thead><tr><th>Công cụ</th><th>Hợp nhất cho</th><th>Cẩn thận</th></tr></thead>
  <tbody>
    <tr><td><strong>Management Console</strong> (web)</td><td>Khám phá, xem hoá đơn và biểu đồ, cài đặt một lần</td><td>Không lặp lại được; dễ quên đã bấm gì — và bấm ở đâu (ô chọn region, góc trên bên phải)</td></tr>
    <tr><td><strong>AWS CLI v2</strong></td><td>Script, kiểm tra, truy vấn nhanh bằng <code>--query</code></td><td>Dùng thông tin xác thực và region nào nó tìm thấy trước</td></tr>
    <tr><td><strong>SDK</strong> (JavaScript v3, Java v2, Python boto3…)</td><td>Mã ứng dụng: tải tệp lên S3, gửi vào SQS</td><td>Không bao giờ viết cứng khoá; để SDK tự tìm role</td></tr>
    <tr><td><strong>Hạ tầng dưới dạng mã</strong> (Terraform, CloudFormation, CDK)</td><td>Mọi thứ cần dựng lại, cần review hay cần xoá sạch</td><td>Tệp state rất quý (Chương 11)</td></tr>
  </tbody>
</table>
<p><strong>AWS CloudShell</strong> là một terminal trong trình duyệt, nằm ngay trong console, CLI đã đăng nhập sẵn bằng chính bạn — tiện khi dùng máy ở trường không cài được gì.</p>

<h3>CLI và SDK tìm thông tin xác thực ở đâu?</h3>
<p>Chúng tìm theo một thứ tự cố định và dừng ở chỗ thấy đầu tiên — gọi là <em>credential provider chain</em>: (1) biến môi trường <code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code>; (2) profile trong <code>~/.aws/credentials</code> và <code>~/.aws/config</code> (kể cả profile SSO); (3) khi chạy trên AWS, role của container hay máy EC2. Thứ tự đó giải thích một lỗi kinh điển: một khoá cũ nằm trong biến môi trường âm thầm ghi đè profile bạn tưởng đang dùng. Một bất ngờ khi chạy thật (19/11/2026): <strong>CLI</strong> cho khoá trong biến môi trường thắng cả <code>AWS_PROFILE</code>, còn <strong>SDK JavaScript v3</strong> (credential-provider-node 3.972) làm ngược lại khi có <code>AWS_PROFILE</code> — nó dùng profile và chỉ in cảnh báo <em>Multiple credential sources detected</em>, kèm câu “bản sau có thể đổi”. Đừng bao giờ đặt cả hai. <code>aws sts get-caller-identity</code> cho biết bạn thật sự là ai — cứ nghi là chạy.</p>

<h3>Phòng lab miễn phí: LocalStack + AWS CLI + Terraform trong Docker</h3>
<p>LocalStack giả lập API của AWS ngay trên máy bạn: S3, SQS, SNS, Lambda, DynamoDB, IAM, CloudWatch và nhiều nữa. Không bị tính tiền, và xoá container là không còn gì chạy. Một chuyện thật phát hiện ra lúc soạn khoá: từ 2026, ảnh <code>latest</code> của LocalStack đòi token tài khoản (miễn phí hoặc trả phí) và từ chối khởi động nếu thiếu:</p>
${OUT_LS_LATEST}
<p>Vì vậy khoá này <strong>ghim bản community cuối cùng, 4.12</strong>, chạy không cần tài khoản. Ghim phiên bản vốn là thói quen tốt — “latest” đổi ngay dưới chân bạn.</p>
${MA_LAB}
<p>Những gì LocalStack không làm: bản miễn phí không kiểm quyền IAM (gọi gì cũng được phép), và vài dịch vụ (Budgets, load balancer, ECS, CloudFront) không có hoặc phải trả phí. Bài nào cần tới, bài đó nói rõ và hoặc dùng bộ giả lập khác (Moto, ở bài 0.1), hoặc vẽ sơ đồ kèm lệnh dùng trên AWS thật.</p>

<h3>Lần chạy Terraform đầu tiên: tạo, kiểm, xoá</h3>
<p>Terraform mô tả tài nguyên trong tệp; <code>plan</code> cho xem sẽ đổi gì, <code>apply</code> làm thật, <code>destroy</code> xoá mọi thứ nó đã tạo. Ở đây provider trỏ vào LocalStack, và <code>default_tags</code> đóng dấu tên dự án lên mọi tài nguyên — thói quen giúp sau này còn dọn được:</p>
${MA_TF}
${OUT_TF}
<p>Đọc output như một danh sách kiểm: plan báo <em>1 to add</em>; sau apply bucket có mặt với đủ ba tag; sau destroy <code>aws s3 ls</code> rỗng. Bước kiểm cuối không phải tuỳ chọn.</p>

<h3>Kiểm “còn gì đang tính tiền” (tài khoản thật)</h3>
<p>Trên tài khoản thật, tài nguyên hay nấp ở region khác. Trước khi gập máy sau một bài lab, chạy một lượt quét như sau — nó liệt kê các “nghi phạm” quen thuộc ở mọi region:</p>
${MA_CONGI}
<p>Rồi mở <strong>Billing → Bills</strong>: chi phí được chia theo dịch vụ <em>và theo region</em>, bắt được thứ script bỏ sót. <strong>Tag Editor</strong> trên console cũng tìm được tài nguyên có <code>Project=labflow</code> ở mọi region. Mọi dòng đều trống, và hôm sau hoá đơn không có gì mới — thế là sạch.</p>

<h3>Liên hệ đời thường</h3>
<p>Phòng lab ở máy là buồng lái mô phỏng: rơi bao nhiêu lần cũng không mất tiền. Tài khoản thật là máy bay thật — vẫn bay, nhưng chỉ khi có danh sách kiểm, và hạ cánh xong thì đi một vòng quanh máy bay để soát.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>“AWS SDK tìm thông tin xác thực thế nào?”</strong> — Theo provider chain: biến môi trường, tệp config/credentials dùng chung và profile SSO, rồi tới role của container hay máy. Trên production thì dùng role, không dùng khoá.</li>
  <li><strong>“Sao dùng Terraform thay vì console?”</strong> — Lặp lại được, review được trong pull request, có phiên bản, và xoá đúng những gì nó đã tạo.</li>
  <li><strong>“Kiểm thử mã dùng AWS mà không có tài khoản AWS thế nào?”</strong> — Dùng bộ giả lập như LocalStack hay Moto qua endpoint ghi đè, cộng unit test với client giả; sau đó chạy integration test thật trong một tài khoản sandbox.</li>
</ol>

<h3>🧪 Thực hành (25 phút) — dựng phòng lab dùng cả khoá</h3>
<div class="callout ok"><ol>
  <li>Bật LocalStack 4.12 và tạo hai alias <code>awsl</code> và <code>tf</code>.</li>
  <li>Viết tệp Terraform ở trên, đổi tên bucket có tên bạn, chạy init → plan → apply.</li>
  <li>Chứng minh bucket có thật và mang đủ ba tag, rồi destroy và chứng minh nó đã biến mất.</li>
  <li>Xoá container LocalStack.</li>
</ol>
<p><strong>Đạt khi:</strong> terminal của bạn có “Apply complete! Resources: 1 added”, ba tag, “Destroy complete! Resources: 1 destroyed”, và <code>s3 ls</code> rỗng.</p>
${giai('Gợi ý: “connection refused” hoặc Terraform không gọi được endpoint', '<p>Kiểm LocalStack đã khoẻ chưa (<code>curl localhost:4566/_localstack/health</code>) và cổng trong khối <code>endpoints</code> có khớp cổng bạn mở không. Docker Desktop trên Windows/macOS không dùng <code>--network host</code> theo cùng cách — ở đó đặt endpoint là <code>http://host.docker.internal:4566</code>.</p>')}</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AWS CLI v2</span><span class="v">Công cụ dòng lệnh chính thức; mỗi lệnh là một hay vài lời gọi API.</span></div>
  <div class="kv"><span class="k">SDK</span><span class="v">Thư viện để gọi AWS từ mã, ví dụ @aws-sdk/client-s3 cho Node.js.</span></div>
  <div class="kv"><span class="k">CloudShell</span><span class="v">Terminal trong trình duyệt, CLI đã xác thực sẵn bằng user console của bạn.</span></div>
  <div class="kv"><span class="k">Credential provider chain</span><span class="v">Thứ tự CLI/SDK đi tìm thông tin xác thực.</span></div>
  <div class="kv"><span class="k">LocalStack</span><span class="v">Bộ giả lập AWS trong container; ghim bản 4.12 để dùng bản miễn phí.</span></div>
  <div class="kv"><span class="k">Terraform plan / apply / destroy</span><span class="v">Xem trước thay đổi, làm thật, xoá mọi thứ Terraform đã tạo.</span></div>
  <div class="kv"><span class="k">default_tags</span><span class="v">Cài đặt provider gắn tag cho mọi tài nguyên — chìa khoá để tìm và dọn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Console để khám phá, CLI để kiểm, SDK trong mã, Terraform cho mọi thứ cần dựng lại hay xoá sạch.</li>
  <li>Provider chain quyết định bạn là ai; <code>aws sts get-caller-identity</code> xác nhận.</li>
  <li>Phòng lab miễn phí = LocalStack 4.12 + AWS CLI + Terraform trong Docker; biết nó không giả lập được gì.</li>
  <li>Lab nào cũng kết thúc bằng destroy + quét “còn gì đang tính tiền” khắp các region.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://docs.localstack.cloud/', '🧪', 'Tài liệu LocalStack', 'Dịch vụ hỗ trợ, cấu hình, tích hợp với Terraform và SDK.')}
${tl('https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html', '🔗', 'AWS SDKs and Tools — credential provider', 'Thứ tự tìm thông tin xác thực chính xác của CLI và mọi SDK.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: chạy trên máy soạn khoá ngày 19/11/2026 — AWS CLI 2.41.0, LocalStack 4.12.0, Terraform 1.17.2, provider hashicorp/aws 6.73.0.</li>
  <li>Tài liệu Terraform AWS provider: <a href="https://registry.terraform.io/providers/hashicorp/aws/latest/docs" target="_blank" rel="noopener">registry.terraform.io/providers/hashicorp/aws</a></li>
  <li>AWS CloudShell: <a href="https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/cloudshell</a></li>
  <li>AWS CLI — configuration and credential precedence: <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html" target="_blank" rel="noopener">docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.5 — Quiz ═══════════════════════════ */
const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ0 = [
  Q('According to the shared responsibility model, who is responsible for making sure an S3 bucket is not public?|||Theo mô hình trách nhiệm chung, ai chịu trách nhiệm đảm bảo một bucket S3 không bị công khai?', [
    'AWS, because S3 is a managed service|||AWS, vì S3 là dịch vụ được quản lý',
    'The customer — it is security IN the cloud|||Khách hàng — đó là bảo mật TRONG cloud',
    'The Internet service provider|||Nhà mạng',
    'Nobody: buckets are always private|||Không ai cả: bucket luôn riêng tư',
  ], 1),
  Q('You pushed an AWS access key to a public GitHub repo, then deleted the file in the next commit. What must you do FIRST?|||Bạn đẩy access key AWS lên kho GitHub công khai, rồi xoá tệp ở commit sau. Việc phải làm ĐẦU TIÊN là gì?', [
    'Nothing — the file is deleted|||Không cần gì — tệp đã xoá rồi',
    'Make the repository private|||Chuyển kho sang riêng tư',
    'Deactivate and delete the key in IAM, then check CloudTrail|||Vô hiệu hoá và xoá khoá trong IAM, rồi xem CloudTrail',
    'Rewrite Git history with a force push|||Viết lại lịch sử Git rồi force push',
  ], 2),
  Q('What does an AWS Budget do when actual cost passes 100% of the limit (with no actions configured)?|||Khi chi phí thật vượt 100% hạn mức, AWS Budget (không cấu hình action) làm gì?', [
    'Stops all running resources|||Tắt mọi tài nguyên đang chạy',
    'Sends the configured notifications only|||Chỉ gửi thông báo đã cấu hình',
    'Closes the account|||Đóng tài khoản',
    'Switches the account to the Free plan|||Chuyển tài khoản sang gói Free',
  ], 1),
  Q('Which statement about the root user is TRUE?|||Câu nào về user root là ĐÚNG?', [
    'IAM policies can restrict it like any user|||Policy IAM giới hạn được nó như mọi user',
    'It should have access keys for the CLI|||Nên tạo access key cho nó để dùng CLI',
    'It should have MFA and be used only for the few tasks that require it|||Nên bật MFA và chỉ dùng cho vài việc bắt buộc',
    'It is created per region|||Mỗi region có một root riêng',
  ], 2),
  Q('From the lesson 0.2 calculation, which resource cost more per month than an RDS Single-AZ db.t4g.micro just by existing?|||Theo phép tính bài 0.2, tài nguyên nào chỉ cần tồn tại đã tốn tiền tháng hơn cả RDS Single-AZ db.t4g.micro?', [
    'An S3 bucket with 20 GB|||Một bucket S3 chứa 20 GB',
    'A NAT gateway|||Một NAT gateway',
    'An IAM user|||Một IAM user',
    'A budget|||Một budget',
  ], 1),
  Q('Your account shows ap-southeast-1a. Another account also shows ap-southeast-1a. Are they the same physical zone?|||Tài khoản bạn có ap-southeast-1a. Tài khoản khác cũng có ap-southeast-1a. Có phải cùng một vùng vật lý không?', [
    'Always yes|||Luôn luôn đúng',
    'Not necessarily — compare AZ IDs such as apse1-az1|||Chưa chắc — so AZ ID như apse1-az1',
    'Never|||Không bao giờ',
    'Only in us-east-1|||Chỉ ở us-east-1',
  ], 1),
  Q('Which of these services is GLOBAL rather than regional?|||Dịch vụ nào là TOÀN CẦU chứ không theo region?', [
    'Amazon EC2|||Amazon EC2',
    'Amazon RDS|||Amazon RDS',
    'AWS IAM|||AWS IAM',
    'Amazon VPC|||Amazon VPC',
  ], 2),
  Q('Which is the BEST first criterion when choosing a region for an app storing Vietnamese citizens\' personal data?|||Tiêu chí NÊN xét đầu tiên khi chọn region cho ứng dụng lưu dữ liệu cá nhân công dân Việt Nam?', [
    'The cheapest region|||Region rẻ nhất',
    'Legal and data-residency requirements|||Yêu cầu pháp lý và nơi lưu dữ liệu',
    'The region with the most services|||Region nhiều dịch vụ nhất',
    'us-east-1 because it is the default|||us-east-1 vì là mặc định',
  ], 1),
  Q('An old key in AWS_ACCESS_KEY_ID is set in your shell, and you also configured an SSO profile. Which identity does the CLI use by default?|||Shell của bạn còn khoá cũ trong AWS_ACCESS_KEY_ID, và bạn cũng đã cấu hình profile SSO. Mặc định CLI dùng danh tính nào?', [
    'The SSO profile, because it is newer|||Profile SSO, vì mới hơn',
    'The environment-variable key — it comes first in the provider chain|||Khoá trong biến môi trường — nó đứng trước trong provider chain',
    'Neither: the CLI fails|||Không cái nào: CLI báo lỗi',
    'The root user|||User root',
  ], 1),
  Q('After a Terraform lab on a real account, what proves you are clean?|||Sau một bài lab Terraform trên tài khoản thật, điều gì chứng minh bạn đã dọn sạch?', [
    'Closing the browser tab|||Đóng tab trình duyệt',
    'terraform destroy succeeded AND a sweep across regions plus the bill by service/region shows nothing left|||terraform destroy thành công VÀ lượt quét các region cùng hoá đơn theo dịch vụ/region không còn gì',
    'Deleting the .tf files|||Xoá các tệp .tf',
    'Waiting until the end of the month|||Chờ tới cuối tháng',
  ], 1),
];

export default {
  title: 'Section 0 — What the cloud is|||Mục 0 — Cloud là gì',
  description: 'Cloud là gì và lịch sử AWS, thảm hoạ cloud có thật (khoá lộ, bucket công khai, hoá đơn), tài khoản an toàn với Budgets + MFA, cloud so với VPS bằng giá thật, region/AZ đo độ trễ từ Việt Nam, và phòng lab miễn phí LocalStack + Terraform.',
  lessons: [
    {
      title: 'Start here (1/2) — What the cloud is, where it came from, and why employers ask for it|||Bắt đầu tại đây (1/2) — Điện toán đám mây là gì, ra đời thế nào, vì sao nhà tuyển dụng đòi',
      slug: 'aws-0-8-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cloud bằng hình ảnh căn bếp, mọi thứ là API có chữ ký SigV4 (chạy thật), lịch sử AWS 2004–2026, IaaS/PaaS/SaaS, trách nhiệm chung, sáu lợi ích, "biết AWS" nghĩa là gì và lộ trình khoá.',
      content: L08_EN + L08_VI,
    },
    {
      title: 'Start here (2/2) — Cloud disasters: surprise bills, public buckets, leaked keys|||Bắt đầu tại đây (2/2) — Thảm hoạ cloud: hoá đơn bất ngờ, bucket công khai, lộ khoá',
      slug: 'aws-0-9-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'EleKtra-Leak 2023, Uber 2016, Code Spaces 2014, Verizon/Accenture 2017, bucket rỗng bị tính tiền 2024; khoá lộ trong lịch sử Git bị gitleaks bắt (chạy thật); ba thói quen và cách học.',
      content: L09_EN + L09_VI,
    },
    {
      title: '0.1 — A safe AWS account: root, MFA, and a budget alarm first|||0.1 — Tài khoản AWS an toàn: root, MFA và cảnh báo ngân sách trước tiên',
      slug: 'aws-0-1-tai-khoan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Gói Free/Paid 2025, khoá root, AWS Budgets ACTUAL/FORECASTED bằng CLI (chạy thật), Free Tier alerts, danh tính hằng ngày có MFA.',
      content: L01_EN + L01_VI,
    },
    {
      title: '0.2 — Cloud vs the VPS you already run|||0.2 — Cloud so với VPS bạn đang chạy',
      slug: 'aws-0-2-cloud-vs-vps',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng đối chiếu cuongthai.com ⇒ AWS, so sánh vận hành, tính tiền tháng bằng giá thật Singapore (NAT gateway đắt hơn RDS), khi nào VPS là đủ.',
      content: L02_EN + L02_VI,
    },
    {
      title: '0.3 — Global infrastructure: regions, Availability Zones, edge locations|||0.3 — Hạ tầng toàn cầu: region, Availability Zone, edge location',
      slug: 'aws-0-3-ha-tang-toan-cau',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Region/AZ/edge, AZ name vs AZ ID, đo độ trễ thật từ Việt Nam tới 7 region, bốn câu hỏi chọn region, dịch vụ toàn cầu vs theo region, sự cố us-east-1 2021 và 2025.',
      content: L03_EN + L03_VI,
    },
    {
      title: '0.4 — Tools and a free local lab: CLI, SDK, LocalStack, Terraform|||0.4 — Công cụ và phòng lab miễn phí: CLI, SDK, LocalStack, Terraform',
      slug: 'aws-0-4-cong-cu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Console/CLI/SDK/IaC, credential provider chain, LocalStack 4.12 (bản latest đòi token), Terraform init/plan/apply/destroy chạy thật, lệnh kiểm "còn gì đang tính tiền".',
      content: L04_EN + L04_VI,
    },
    {
      title: '0.5 — Section 0 quiz|||0.5 — Kiểm tra Mục 0',
      slug: 'aws-0-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về trách nhiệm chung, khoá lộ, Budgets, root, chi phí, AZ, dịch vụ toàn cầu, chọn region, provider chain và dọn dẹp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Each question comes from something you saw running in this section — a budget, a leaked key, a price table, a Terraform run. If you miss one, the explanation is in the lesson the question mentions.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy chạy thật trong mục này — một budget, một khoá bị lộ, một bảng giá, một lần chạy Terraform. Sai câu nào thì lời giải nằm trong bài được nhắc trong câu.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ0 },
    },
  ],
};
