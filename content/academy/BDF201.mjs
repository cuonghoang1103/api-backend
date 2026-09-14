/**
 * BDF201 — Blockchain and Decentralized Finance. Giáo trình tham khảo:
 * Antonopoulos "Mastering Bitcoin" & "Mastering Ethereum"; Harvey/Ramachandran
 * "DeFi and the Future of Finance"; Coinbase/Ethereum.org docs; a16z crypto.
 * Song ngữ + ví dụ + bài tập. Cân bằng, nêu rõ rủi ro, KHÔNG khuyến nghị đầu tư.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp;, "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bdf201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền tảng (Mastering Bitcoin/Ethereum, DeFi and the Future of Finance), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">BDF201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Blockchain and Decentralized Finance — how blockchains work, Bitcoin &amp; Ethereum, smart contracts, tokens, DeFi, stablecoins, wallet security and regulation — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal, well-known resources.</p>
<h3>📘 Reference books</h3>
<ul>
<li><a href="https://github.com/bitcoinbook/bitcoinbook" target="_blank" rel="noopener"><em>Mastering Bitcoin</em> — Andreas M. Antonopoulos (free online)</a></li>
<li><a href="https://github.com/ethereumbook/ethereumbook" target="_blank" rel="noopener"><em>Mastering Ethereum</em> — Antonopoulos &amp; Wood (free online)</a></li>
<li><a href="https://www.wiley.com/en-us/DeFi+and+the+Future+of+Finance-p-9781119836018" target="_blank" rel="noopener"><em>DeFi and the Future of Finance</em> — Harvey, Ramachandran &amp; Santoro</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ethereum.org/en/developers/docs/" target="_blank" rel="noopener">Ethereum.org — developer docs</a></li>
<li><a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener">Bitcoin whitepaper — Satoshi Nakamoto (2008)</a></li>
<li><a href="https://www.coinbase.com/learn" target="_blank" rel="noopener">Coinbase Learn — plain-language crypto &amp; DeFi guides</a></li>
<li><a href="https://a16zcrypto.com/education/" target="_blank" rel="noopener">a16z crypto — Crypto Canon &amp; education</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Finematics" target="_blank" rel="noopener">Finematics</a> — DeFi mechanisms explained visually</li>
<li><a href="https://www.youtube.com/@whiteboardcrypto" target="_blank" rel="noopener">Whiteboard Crypto</a> — blockchain &amp; DeFi fundamentals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://remix.ethereum.org/" target="_blank" rel="noopener">Remix IDE</a> — write &amp; test Solidity smart contracts in the browser</li>
<li><a href="https://etherscan.io/" target="_blank" rel="noopener">Etherscan</a> — inspect real transactions, contracts &amp; tokens on Ethereum</li>
<li><a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener">Testnet faucets</a> — get free test ETH to try contracts risk-free</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — decentralization, distributed ledgers, consensus, Bitcoin's UTXO model, Ethereum's account model &amp; smart contracts.</li>
<li><strong>Practice</strong> — deploy a toy ERC-20/NFT contract on a testnet in Remix; read a real transaction on Etherscan.</li>
<li><strong>Go deeper</strong> — DeFi primitives (AMM, lending, staking), stablecoins, wallet security.</li>
<li><strong>Big picture</strong> — regulation, CBDCs, tokenization of real-world assets and where crypto fits (or doesn't) in the financial system.</li>
</ol></div>
<p><em>Note: this course explains how the technology and markets work. It is educational content, not financial or investment advice.</em></p>`,
    `<span class="eyebrow">BDF201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Blockchain và Tài chính phi tập trung — blockchain hoạt động thế nào, Bitcoin &amp; Ethereum, smart contract, token, DeFi, stablecoin, bảo mật ví và pháp lý — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, uy tín.</p>
<h3>📘 Sách tham khảo</h3>
<ul>
<li><a href="https://github.com/bitcoinbook/bitcoinbook" target="_blank" rel="noopener"><em>Mastering Bitcoin</em> — Andreas M. Antonopoulos (đọc miễn phí)</a></li>
<li><a href="https://github.com/ethereumbook/ethereumbook" target="_blank" rel="noopener"><em>Mastering Ethereum</em> — Antonopoulos &amp; Wood (đọc miễn phí)</a></li>
<li><a href="https://www.wiley.com/en-us/DeFi+and+the+Future+of+Finance-p-9781119836018" target="_blank" rel="noopener"><em>DeFi and the Future of Finance</em> — Harvey, Ramachandran &amp; Santoro</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ethereum.org/en/developers/docs/" target="_blank" rel="noopener">Ethereum.org — tài liệu lập trình</a></li>
<li><a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener">Whitepaper Bitcoin — Satoshi Nakamoto (2008)</a></li>
<li><a href="https://www.coinbase.com/learn" target="_blank" rel="noopener">Coinbase Learn — hướng dẫn crypto &amp; DeFi dễ hiểu</a></li>
<li><a href="https://a16zcrypto.com/education/" target="_blank" rel="noopener">a16z crypto — Crypto Canon &amp; tài liệu học</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Finematics" target="_blank" rel="noopener">Finematics</a> — cơ chế DeFi minh hoạ trực quan</li>
<li><a href="https://www.youtube.com/@whiteboardcrypto" target="_blank" rel="noopener">Whiteboard Crypto</a> — nền tảng blockchain &amp; DeFi</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://remix.ethereum.org/" target="_blank" rel="noopener">Remix IDE</a> — viết &amp; thử smart contract Solidity ngay trên trình duyệt</li>
<li><a href="https://etherscan.io/" target="_blank" rel="noopener">Etherscan</a> — soi giao dịch, hợp đồng &amp; token thật trên Ethereum</li>
<li><a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener">Testnet faucet</a> — lấy ETH thử miễn phí để thao tác không rủi ro</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — phi tập trung, sổ cái phân tán, đồng thuận, mô hình UTXO của Bitcoin, mô hình tài khoản &amp; smart contract của Ethereum.</li>
<li><strong>Luyện tập</strong> — triển khai thử hợp đồng ERC-20/NFT trên testnet bằng Remix; đọc một giao dịch thật trên Etherscan.</li>
<li><strong>Đào sâu</strong> — cơ chế DeFi (AMM, cho vay, staking), stablecoin, bảo mật ví.</li>
<li><strong>Bức tranh lớn</strong> — pháp lý, CBDC, token hoá tài sản thực và vị trí của crypto (hay không) trong hệ thống tài chính.</li>
</ol></div>
<p><em>Lưu ý: môn này giải thích công nghệ và thị trường hoạt động ra sao. Đây là nội dung giáo dục, KHÔNG phải khuyến nghị đầu tư hay tài chính.</em></p>`,
  ]]);

const intro = doc('bdf201-0-1-overview', 'Course overview: Blockchain & Decentralized Finance|||Tổng quan: Blockchain & Tài chính phi tập trung',
  'Blockchain và DeFi là gì, vì sao ra đời; lộ trình 8 chương từ nguyên lý blockchain → Bitcoin → Ethereum/smart contract → token → DeFi → stablecoin → bảo mật/rủi ro → pháp lý/CBDC.',
  [[
    `<span class="eyebrow">BDF201 · Lesson 0.1 · Overview</span>
<h2>Blockchain &amp; Decentralized Finance</h2>
<p class="lead">This course explains <strong>how blockchains and decentralized finance (DeFi) actually work</strong> — the technology, the economics, and the risks — so you can reason about crypto as a business student, not just repeat headlines.</p>
<h3>Why this matters for business</h3>
<p>Blockchain introduced a new way to keep records and move value <strong>without a central intermediary</strong> (a bank, a clearinghouse, a government registry). That idea spawned a new asset class (cryptocurrency), a new way to raise and move capital (tokens), and an entire parallel financial system built on smart contracts (DeFi) — plus new risks: volatility, scams, and an unsettled regulatory landscape.</p>
<h3>Roadmap</h3>
<ol>
<li>Blockchain fundamentals — decentralization, distributed ledgers, consensus</li>
<li>Bitcoin &amp; cryptocurrency</li>
<li>Ethereum &amp; smart contracts</li>
<li>Tokens &amp; standards (ERC-20, NFTs)</li>
<li>DeFi overview — DEX, AMM, lending, staking</li>
<li>Stablecoins &amp; decentralized payments</li>
<li>Wallets, security, risk &amp; scams</li>
<li>Regulation, CBDCs &amp; the future of finance</li>
</ol>
<div class="callout"><span class="badge">Ground rule</span> This course is educational and deliberately balanced — it covers real benefits AND real risks (volatility, hacks, scams, regulatory uncertainty). Nothing here is investment advice.</div>`,
    `<span class="eyebrow">BDF201 · Bài 0.1 · Tổng quan</span>
<h2>Blockchain &amp; Tài chính phi tập trung</h2>
<p class="lead">Môn này giải thích <strong>blockchain và tài chính phi tập trung (DeFi) hoạt động thế nào thật sự</strong> — công nghệ, kinh tế học, và rủi ro — để bạn lý giải được crypto với tư cách sinh viên kinh doanh, chứ không chỉ lặp lại tiêu đề báo.</p>
<h3>Vì sao quan trọng với kinh doanh</h3>
<p>Blockchain mở ra một cách lưu sổ sách và chuyển giá trị <strong>không cần trung gian trung tâm</strong> (ngân hàng, trung tâm thanh toán bù trừ, sổ đăng ký của nhà nước). Ý tưởng đó sinh ra một lớp tài sản mới (tiền mã hoá), một cách gọi vốn và chuyển vốn mới (token), và cả một hệ thống tài chính song song xây trên smart contract (DeFi) — cùng những rủi ro mới: biến động giá, lừa đảo, và khung pháp lý chưa ổn định.</p>
<h3>Lộ trình</h3>
<ol>
<li>Nguyên lý blockchain — phi tập trung, sổ cái phân tán, đồng thuận</li>
<li>Bitcoin &amp; tiền mã hoá</li>
<li>Ethereum &amp; smart contract</li>
<li>Token &amp; tiêu chuẩn (ERC-20, NFT)</li>
<li>Tổng quan DeFi — DEX, AMM, cho vay, staking</li>
<li>Stablecoin &amp; thanh toán phi tập trung</li>
<li>Ví, bảo mật, rủi ro &amp; scam</li>
<li>Quy định pháp lý, CBDC &amp; tương lai tài chính</li>
</ol>
<div class="callout"><span class="badge">Nguyên tắc nền</span> Môn này mang tính giáo dục và cố tình cân bằng — nêu cả lợi ích thật LẪN rủi ro thật (biến động giá, bị hack, lừa đảo, pháp lý chưa rõ ràng). Không có nội dung nào ở đây là khuyến nghị đầu tư.</div>`,
  ]]);

const c1 = doc('bdf201-1-1-blockchain-fundamentals', '1.1 — What is blockchain & how it works|||1.1 — Blockchain là gì & nguyên lý hoạt động',
  'Sổ cái phân tán (distributed ledger), khối liên kết bằng hash, phi tập trung so với tập trung, đồng thuận (PoW/PoS), tính bất biến.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 1 · Lesson 1.1</span>
<h2>What is blockchain &amp; how it works</h2>
<h3>A distributed ledger, not a database</h3>
<p>A <strong>blockchain</strong> is a <strong>distributed ledger</strong> — a record of transactions copied across many independent computers (<strong>nodes</strong>) instead of one central server. Records are grouped into <strong>blocks</strong>; each block stores a <strong>cryptographic hash</strong> of the previous block, chaining them together. Change one old block and every hash after it breaks — that's what makes the ledger practically <strong>immutable</strong> (tamper-evident).</p>
<pre><code>Block 1        Block 2              Block 3
[data]         [data]               [data]
[hash: h1] &lt;-- [prevHash: h1]  &lt;-- [prevHash: h2]
               [hash: h2]           [hash: h3]
</code></pre>
<h3>Centralized vs. decentralized</h3>
<ul>
<li><strong>Centralized ledger</strong> (a bank's database) — one authority controls and can alter the record; you trust that authority.</li>
<li><strong>Decentralized ledger</strong> (a blockchain) — thousands of independent nodes each hold a full copy; no single party can rewrite history alone. Trust shifts from an institution to <strong>math + majority agreement</strong>.</li>
</ul>
<h3>Consensus: how thousands of strangers agree</h3>
<p>With no central authority, nodes need a rule to agree on which transactions are valid and in what order — this is <strong>consensus</strong>. Two dominant mechanisms:</p>
<ul>
<li><strong>Proof-of-Work (PoW)</strong> — nodes ("miners") compete to solve a costly computational puzzle; the winner adds the next block and is rewarded. Security comes from the sheer cost of the work (used by Bitcoin).</li>
<li><strong>Proof-of-Stake (PoS)</strong> — nodes ("validators") lock up (stake) cryptocurrency as collateral; the protocol picks a validator to propose the next block, weighted by stake. Dishonest validators lose their stake ("slashing"). Far less energy-intensive than PoW (used by Ethereum since 2022).</li>
</ul>
<div class="callout"><span class="badge">Trade-off, not magic</span> Decentralization buys censorship-resistance and no single point of failure — at the cost of speed, and it doesn't remove human risk: bugs, scams and bad governance still exist on-chain.</div>`,
    `<span class="eyebrow">BDF201 · Chương 1 · Bài 1.1</span>
<h2>Blockchain là gì &amp; nguyên lý hoạt động</h2>
<h3>Sổ cái phân tán, không phải cơ sở dữ liệu</h3>
<p>Một <strong>blockchain</strong> là <strong>sổ cái phân tán</strong> — bản ghi giao dịch được sao chép trên nhiều máy tính độc lập (<strong>node</strong>) thay vì một máy chủ trung tâm. Bản ghi được nhóm thành <strong>khối (block)</strong>; mỗi khối lưu <strong>hash mật mã</strong> của khối trước, xâu chuỗi chúng lại. Sửa một khối cũ thì mọi hash sau đó đều sai — đây là điều khiến sổ cái gần như <strong>bất biến</strong> (giả mạo là bị phát hiện ngay).</p>
<pre><code>Khối 1         Khối 2               Khối 3
[dữ liệu]      [dữ liệu]            [dữ liệu]
[hash: h1] &lt;-- [prevHash: h1]  &lt;-- [prevHash: h2]
               [hash: h2]           [hash: h3]
</code></pre>
<h3>Tập trung so với phi tập trung</h3>
<ul>
<li><strong>Sổ cái tập trung</strong> (cơ sở dữ liệu của một ngân hàng) — một bên duy nhất kiểm soát và có thể sửa bản ghi; bạn phải tin bên đó.</li>
<li><strong>Sổ cái phi tập trung</strong> (blockchain) — hàng ngàn node độc lập cùng giữ một bản sao đầy đủ; không bên nào một mình viết lại lịch sử được. Niềm tin chuyển từ một tổ chức sang <strong>toán học + sự đồng thuận của số đông</strong>.</li>
</ul>
<h3>Đồng thuận: hàng ngàn người lạ thống nhất thế nào</h3>
<p>Không có cơ quan trung tâm, các node cần một quy tắc để thống nhất giao dịch nào hợp lệ và theo thứ tự nào — đó là <strong>đồng thuận (consensus)</strong>. Hai cơ chế phổ biến nhất:</p>
<ul>
<li><strong>Proof-of-Work (PoW)</strong> — các node ("thợ đào") thi giải một bài toán tính toán tốn kém; người thắng được thêm khối tiếp theo và nhận thưởng. An toàn đến từ chi phí khổng lồ của việc tính toán đó (Bitcoin dùng cơ chế này).</li>
<li><strong>Proof-of-Stake (PoS)</strong> — các node ("validator") khoá (stake) tiền mã hoá làm tài sản đảm bảo; giao thức chọn một validator đề xuất khối tiếp theo, theo tỉ lệ số tiền đã stake. Validator gian lận sẽ mất phần stake ("slashing"). Tốn ít năng lượng hơn PoW rất nhiều (Ethereum dùng từ 2022).</li>
</ul>
<div class="callout"><span class="badge">Đánh đổi, không phải phép màu</span> Phi tập trung mua được khả năng chống kiểm duyệt và không có điểm lỗi duy nhất — đổi lại là tốc độ chậm hơn, và nó KHÔNG loại bỏ rủi ro con người: lỗi mã, lừa đảo và quản trị kém vẫn tồn tại trên chuỗi.</div>`,
  ]]);

const c1q = quiz('bdf201-quiz-1', 'Quiz 1 — Blockchain fundamentals|||Quiz 1 — Nguyên lý blockchain', [
  { id: 'q1', question: 'Điều gì khiến dữ liệu trên blockchain gần như bất biến?', options: ['Dữ liệu được mã hoá bằng mật khẩu', 'Mỗi khối lưu hash của khối trước, sửa 1 khối cũ làm sai mọi hash sau đó', 'Chỉ admin mới sửa được', 'Dữ liệu lưu trên một máy chủ duy nhất được bảo vệ tốt'], correctIndex: 1, explanation: 'Các khối xâu chuỗi bằng hash — đổi một khối cũ phá vỡ toàn bộ chuỗi hash phía sau, nên gian lận bị phát hiện ngay.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa sổ cái tập trung và phi tập trung là gì?', options: ['Phi tập trung nhanh hơn tập trung', 'Tập trung do một bên kiểm soát; phi tập trung do nhiều node độc lập cùng giữ bản sao', 'Tập trung không thể bị hack', 'Phi tập trung không cần máy tính'], correctIndex: 1, explanation: 'Niềm tin chuyển từ một tổ chức trung tâm sang sự đồng thuận của nhiều node độc lập.' },
  { id: 'q3', question: 'Proof-of-Stake (PoS) khác Proof-of-Work (PoW) chủ yếu ở điểm nào?', options: ['PoS dùng máy đào chuyên dụng như PoW', 'PoS chọn người xác nhận khối theo lượng tiền đã "stake" thay vì cuộc đua tính toán tốn năng lượng', 'PoS không cần đồng thuận', 'PoS chỉ dùng cho NFT'], correctIndex: 1, explanation: 'PoS thay cuộc đua tính toán (PoW) bằng cơ chế đặt cọc tài sản (stake), tốn ít năng lượng hơn nhiều.' },
]);

const c2 = doc('bdf201-2-1-bitcoin-cryptocurrency', '2.1 — Bitcoin & cryptocurrency|||2.1 — Bitcoin & tiền mã hoá',
  'Whitepaper Satoshi Nakamoto (2008), mô hình UTXO, đào coin (mining) & phần thưởng khối, halving, cặp khoá công khai/riêng tư & ví.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 2 · Lesson 2.1</span>
<h2>Bitcoin &amp; cryptocurrency</h2>
<h3>The 2008 whitepaper</h3>
<p>In 2008, an anonymous author (or group) under the name <strong>Satoshi Nakamoto</strong> published <em>"Bitcoin: A Peer-to-Peer Electronic Cash System"</em> — a proposal for digital money that moves directly between people <strong>without a bank or payment processor</strong>, secured by cryptography and a Proof-of-Work blockchain (Chapter 1). The network launched in January 2009.</p>
<h3>The UTXO model</h3>
<p>Bitcoin doesn't track "account balances" the way a bank does. Instead it tracks <strong>Unspent Transaction Outputs (UTXOs)</strong> — like unspent bills in your pocket. Your wallet's "balance" is just the sum of every UTXO addressed to you. A transaction consumes existing UTXOs as inputs and creates new ones as outputs (with any leftover sent back to yourself as "change").</p>
<pre><code>Wallet has UTXOs: 0.6 BTC + 0.5 BTC
Pay 0.9 BTC to a friend:
  Inputs:  0.6 BTC + 0.5 BTC  (spent together)
  Outputs: 0.9 BTC -&gt; friend
           0.2 BTC -&gt; change, back to you (new UTXO)
</code></pre>
<h3>Mining &amp; the halving</h3>
<p>New bitcoins enter circulation as the <strong>block reward</strong> paid to the miner who wins each round of Proof-of-Work. That reward is cut in half roughly every four years (every 210,000 blocks) — the <strong>halving</strong> — capping total supply at <strong>21 million BTC</strong>. This programmed scarcity is why Bitcoin is often called "digital gold."</p>
<h3>Keys &amp; wallets</h3>
<p>Ownership is proven with <strong>public-key cryptography</strong>: a <strong>private key</strong> (secret, signs transactions) generates a <strong>public key</strong>, which derives a public <strong>address</strong> (safe to share). Whoever holds the private key controls the funds — there is no password reset.</p>
<div class="callout"><span class="badge">Not backed by a company or government</span> Bitcoin's value comes from scarcity, network security and adoption — not from a central issuer's promise. That also means no institution can bail out a lost key or a bad trade.</div>`,
    `<span class="eyebrow">BDF201 · Chương 2 · Bài 2.1</span>
<h2>Bitcoin &amp; tiền mã hoá</h2>
<h3>Whitepaper năm 2008</h3>
<p>Năm 2008, một tác giả (hoặc nhóm) ẩn danh dưới tên <strong>Satoshi Nakamoto</strong> công bố <em>"Bitcoin: A Peer-to-Peer Electronic Cash System"</em> — đề xuất về tiền số chuyển trực tiếp giữa người với người <strong>không cần ngân hàng hay bên xử lý thanh toán</strong>, được bảo mật bằng mật mã học và blockchain Proof-of-Work (Chương 1). Mạng lưới khởi chạy tháng 1/2009.</p>
<h3>Mô hình UTXO</h3>
<p>Bitcoin không theo dõi "số dư tài khoản" như ngân hàng. Thay vào đó nó theo dõi <strong>UTXO (Unspent Transaction Output — đầu ra giao dịch chưa tiêu)</strong> — giống như những tờ tiền lẻ chưa tiêu trong túi bạn. "Số dư" ví của bạn chỉ là tổng mọi UTXO gửi cho bạn. Một giao dịch tiêu các UTXO hiện có làm đầu vào và tạo UTXO mới làm đầu ra (phần dư gửi lại chính bạn dưới dạng "tiền thừa").</p>
<pre><code>Ví có UTXO: 0.6 BTC + 0.5 BTC
Trả 0.9 BTC cho bạn:
  Đầu vào:  0.6 BTC + 0.5 BTC  (tiêu cùng lúc)
  Đầu ra:   0.9 BTC -&gt; bạn
            0.2 BTC -&gt; tiền thừa, về lại bạn (UTXO mới)
</code></pre>
<h3>Đào coin (mining) &amp; halving</h3>
<p>Bitcoin mới đi vào lưu thông qua <strong>phần thưởng khối</strong> trả cho thợ đào thắng mỗi vòng Proof-of-Work. Phần thưởng đó bị giảm một nửa khoảng mỗi bốn năm (mỗi 210.000 khối) — gọi là <strong>halving</strong> — giới hạn tổng cung ở <strong>21 triệu BTC</strong>. Sự khan hiếm được lập trình sẵn này là lý do Bitcoin hay được gọi là "vàng số".</p>
<h3>Khoá &amp; ví</h3>
<p>Quyền sở hữu được chứng minh bằng <strong>mật mã khoá công khai</strong>: một <strong>khoá riêng tư</strong> (bí mật, ký giao dịch) sinh ra một <strong>khoá công khai</strong>, từ đó suy ra một <strong>địa chỉ</strong> công khai (chia sẻ được). Ai giữ khoá riêng tư thì kiểm soát tiền — không có chuyện "quên mật khẩu, đặt lại".</p>
<div class="callout"><span class="badge">Không có công ty hay chính phủ đứng sau</span> Giá trị của Bitcoin đến từ sự khan hiếm, độ an toàn của mạng và mức độ chấp nhận — không đến từ lời hứa của một tổ chức phát hành trung tâm. Điều đó cũng nghĩa là không ai "cứu" bạn nếu mất khoá hay giao dịch sai.</div>`,
  ]]);

const c2q = quiz('bdf201-quiz-2', 'Quiz 2 — Bitcoin & cryptocurrency|||Quiz 2 — Bitcoin & tiền mã hoá', [
  { id: 'q1', question: 'Bitcoin theo dõi quyền sở hữu tiền bằng mô hình nào?', options: ['Số dư tài khoản như ngân hàng', 'UTXO — các đầu ra giao dịch chưa tiêu', 'Sổ ghi nợ tập trung', 'Thẻ tín dụng'], correctIndex: 1, explanation: 'Bitcoin dùng mô hình UTXO thay vì số dư tài khoản.' },
  { id: 'q2', question: '"Halving" trong Bitcoin là gì?', options: ['Chia đôi tổng số node mạng', 'Giảm một nửa phần thưởng khối cho thợ đào theo chu kỳ, giới hạn tổng cung 21 triệu BTC', 'Chia đôi phí giao dịch', 'Tách blockchain thành hai chuỗi'], correctIndex: 1, explanation: 'Halving giảm một nửa phần thưởng khối mỗi ~4 năm, tạo khan hiếm lập trình sẵn.' },
  { id: 'q3', question: 'Ai kiểm soát số bitcoin trong một địa chỉ ví?', options: ['Sàn giao dịch nơi mua bitcoin', 'Bất kỳ ai biết địa chỉ công khai', 'Người nắm giữ khoá riêng tư (private key) tương ứng', 'Ngân hàng trung ương'], correctIndex: 2, explanation: 'Khoá riêng tư ký giao dịch và chứng minh quyền sở hữu; mất khoá là mất quyền kiểm soát tiền.' },
]);

const c3 = doc('bdf201-3-1-ethereum-smart-contracts', '3.1 — Ethereum & smart contracts|||3.1 — Ethereum & smart contract',
  'Ethereum là "máy tính thế giới", EVM, mô hình tài khoản (EOA/contract) so với UTXO, gas, ví dụ smart contract Solidity đơn giản.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 3 · Lesson 3.1</span>
<h2>Ethereum &amp; smart contracts</h2>
<h3>Beyond money: a "world computer"</h3>
<p>Bitcoin's blockchain mainly tracks who owns how much money. <strong>Ethereum</strong> (launched 2015) generalizes the idea: every node also runs a shared, tamper-proof virtual machine — the <strong>Ethereum Virtual Machine (EVM)</strong> — that can execute arbitrary programs called <strong>smart contracts</strong>. A smart contract is just code stored on-chain that runs exactly as written, with its state (balances, ownership records, etc.) also stored on-chain.</p>
<h3>Account-based, not UTXO</h3>
<p>Ethereum uses an <strong>account model</strong> (like a bank statement) instead of Bitcoin's UTXO model:</p>
<ul>
<li><strong>Externally Owned Account (EOA)</strong> — controlled by a private key, like a Bitcoin wallet; has a simple ETH balance.</li>
<li><strong>Contract account</strong> — controlled by its own code (a smart contract), not a private key; can hold funds and run logic when called.</li>
</ul>
<h3>Gas: paying for computation</h3>
<p>Every operation on the EVM (storing data, transferring tokens, running a loop) costs <strong>gas</strong>, paid in ETH. This prevents infinite loops from freezing the network and prices computation fairly — a complex contract call costs more gas than a simple transfer.</p>
<h3>A minimal smart contract (Solidity)</h3>
<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address =&gt; uint256) public balance;

    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balance[msg.sender] &gt;= amount, "insufficient balance");
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
</code></pre>
<p>This tiny contract lets anyone deposit ETH and withdraw only what they put in — no bank, no branch, just code that runs identically for everyone.</p>
<div class="callout"><span class="badge">Code is law — for better and worse</span> A deployed contract runs exactly as written, bugs included. Since 2016 (the infamous "DAO hack"), millions of dollars have been lost to smart-contract bugs — one reason audits matter (Chapter 7).</div>`,
    `<span class="eyebrow">BDF201 · Chương 3 · Bài 3.1</span>
<h2>Ethereum &amp; smart contract</h2>
<h3>Hơn cả tiền: một "máy tính thế giới"</h3>
<p>Blockchain của Bitcoin chủ yếu theo dõi ai sở hữu bao nhiêu tiền. <strong>Ethereum</strong> (ra mắt 2015) tổng quát hoá ý tưởng đó: mỗi node còn chạy một máy ảo dùng chung, chống giả mạo — <strong>EVM (Ethereum Virtual Machine)</strong> — có thể thực thi các chương trình tuỳ ý gọi là <strong>smart contract</strong>. Smart contract chỉ là mã lưu trên chuỗi, chạy đúng như đã viết, với trạng thái (số dư, quyền sở hữu...) cũng lưu trên chuỗi.</p>
<h3>Mô hình tài khoản, không phải UTXO</h3>
<p>Ethereum dùng <strong>mô hình tài khoản</strong> (giống sao kê ngân hàng) thay vì mô hình UTXO của Bitcoin:</p>
<ul>
<li><strong>EOA (Externally Owned Account)</strong> — do khoá riêng tư kiểm soát, giống ví Bitcoin; có số dư ETH đơn giản.</li>
<li><strong>Tài khoản hợp đồng (contract account)</strong> — do chính mã của nó (smart contract) kiểm soát, không phải khoá riêng tư; có thể giữ tiền và chạy logic khi được gọi.</li>
</ul>
<h3>Gas: trả tiền cho tính toán</h3>
<p>Mọi thao tác trên EVM (lưu dữ liệu, chuyển token, chạy vòng lặp) đều tốn <strong>gas</strong>, trả bằng ETH. Cơ chế này ngăn vòng lặp vô hạn làm treo mạng và định giá công bằng cho tính toán — gọi một hợp đồng phức tạp tốn gas hơn một lệnh chuyển đơn giản.</p>
<h3>Một smart contract tối giản (Solidity)</h3>
<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address =&gt; uint256) public balance;

    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balance[msg.sender] &gt;= amount, "insufficient balance");
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
</code></pre>
<p>Hợp đồng nhỏ này cho phép bất kỳ ai gửi ETH và chỉ rút được đúng số đã gửi — không ngân hàng, không chi nhánh, chỉ có mã chạy giống hệt cho mọi người.</p>
<div class="callout"><span class="badge">Code là luật — cả nghĩa tốt lẫn xấu</span> Hợp đồng đã triển khai chạy đúng như đã viết, kể cả khi có lỗi. Từ 2016 (vụ "DAO hack" nổi tiếng), hàng triệu đô đã mất vì lỗi smart contract — một lý do vì sao audit (kiểm toán mã) quan trọng (Chương 7).</div>`,
  ]]);

const c3q = quiz('bdf201-quiz-3', 'Quiz 3 — Ethereum & smart contract|||Quiz 3 — Ethereum & smart contract', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi của Ethereum so với Bitcoin là gì?', options: ['Ethereum không dùng blockchain', 'Ethereum chạy một máy ảo dùng chung (EVM) có thể thực thi smart contract, không chỉ theo dõi tiền', 'Ethereum không cần đồng thuận', 'Ethereum chỉ dùng để phát hành NFT'], correctIndex: 1, explanation: 'Ethereum tổng quát hoá blockchain thành "máy tính thế giới" chạy smart contract qua EVM.' },
  { id: 'q2', question: '"Gas" trên Ethereum dùng để làm gì?', options: ['Phí gửi email xác nhận', 'Trả tiền (bằng ETH) cho mỗi thao tác tính toán trên EVM, ngăn vòng lặp vô hạn', 'Chuyển đổi Bitcoin sang Ethereum', 'Phí lưu trữ ví lạnh'], correctIndex: 1, explanation: 'Gas định giá và giới hạn tính toán trên EVM, trả bằng ETH.' },
  { id: 'q3', question: 'Tài khoản hợp đồng (contract account) trên Ethereum được kiểm soát bởi gì?', options: ['Một khoá riêng tư như ví thường', 'Chính mã (code) của smart contract đó', 'Một cơ quan trung ương', 'Không ai kiểm soát được'], correctIndex: 1, explanation: 'Khác EOA (do private key kiểm soát), tài khoản hợp đồng chạy theo logic của chính mã nó.' },
]);

const c4 = doc('bdf201-4-1-tokens-standards', '4.1 — Tokens & standards (ERC-20, NFT)|||4.1 — Token & tiêu chuẩn (ERC-20, NFT)',
  'Token là gì (khác coin gốc), tiêu chuẩn ERC-20 (token thay thế được), ERC-721/NFT (token không thay thế được), ERC-1155.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 4 · Lesson 4.1</span>
<h2>Tokens &amp; standards</h2>
<h3>Coin vs. token</h3>
<p>ETH is Ethereum's native <strong>coin</strong>, built into the protocol. A <strong>token</strong> is an asset defined by a <em>smart contract running on top of</em> a blockchain — anyone can create one without changing the underlying network. Standards define a common set of functions so wallets, exchanges and apps all know how to interact with any token that follows them.</p>
<h3>ERC-20 — fungible tokens</h3>
<p><strong>ERC-20</strong> is the standard for <strong>fungible</strong> tokens — every unit is identical and interchangeable, like currency or shares. It defines a small interface every ERC-20 token must implement:</p>
<pre><code>function totalSupply() view returns (uint256)
function balanceOf(address account) view returns (uint256)
function transfer(address to, uint256 amount) returns (bool)
function approve(address spender, uint256 amount) returns (bool)
function transferFrom(address from, address to, uint256 amount) returns (bool)
</code></pre>
<p>Because every ERC-20 token exposes the same functions, one wallet UI or one DEX can support thousands of different tokens without custom code for each.</p>
<h3>ERC-721 — non-fungible tokens (NFTs)</h3>
<p><strong>ERC-721</strong> defines <strong>non-fungible</strong> tokens — each has a unique <code>tokenId</code> and is NOT interchangeable with another, even from the same contract (like house deeds, not dollar bills). NFTs are used for digital art, collectibles, in-game items, and increasingly for representing ownership of real-world assets (Chapter 8).</p>
<h3>ERC-1155 — multi-token standard</h3>
<p><strong>ERC-1155</strong> lets a single contract manage many token types at once — fungible, non-fungible, or semi-fungible (e.g. 1,000 copies of one game item) — more gas-efficient for apps like games that need many item types.</p>
<div class="callout"><span class="badge">Standard ≠ safe</span> Following ERC-20/721 makes a token interoperable, not trustworthy. Anyone can deploy a token contract in minutes — the standard says nothing about who controls the supply or whether the project is legitimate (see Chapter 7's rug-pull warning).</div>`,
    `<span class="eyebrow">BDF201 · Chương 4 · Bài 4.1</span>
<h2>Token &amp; tiêu chuẩn</h2>
<h3>Coin so với token</h3>
<p>ETH là <strong>coin</strong> gốc của Ethereum, tích hợp sẵn trong giao thức. Một <strong>token</strong> là tài sản được định nghĩa bởi <em>smart contract chạy trên nền</em> một blockchain — ai cũng tạo được mà không cần thay đổi mạng gốc. Các tiêu chuẩn định nghĩa một bộ hàm chung để ví, sàn giao dịch và ứng dụng đều biết cách tương tác với bất kỳ token nào tuân theo chuẩn đó.</p>
<h3>ERC-20 — token thay thế được (fungible)</h3>
<p><strong>ERC-20</strong> là tiêu chuẩn cho token <strong>fungible</strong> — mỗi đơn vị giống hệt nhau và đổi cho nhau được, như tiền tệ hay cổ phiếu. Nó định nghĩa một bộ hàm nhỏ mà mọi token ERC-20 phải có:</p>
<pre><code>function totalSupply() view returns (uint256)
function balanceOf(address account) view returns (uint256)
function transfer(address to, uint256 amount) returns (bool)
function approve(address spender, uint256 amount) returns (bool)
function transferFrom(address from, address to, uint256 amount) returns (bool)
</code></pre>
<p>Vì mọi token ERC-20 đều phơi ra cùng bộ hàm, một giao diện ví hay một sàn DEX có thể hỗ trợ hàng ngàn token khác nhau mà không cần viết mã riêng cho từng cái.</p>
<h3>ERC-721 — token không thay thế được (NFT)</h3>
<p><strong>ERC-721</strong> định nghĩa token <strong>non-fungible</strong> — mỗi cái có một <code>tokenId</code> riêng biệt và KHÔNG đổi ngang được với cái khác, kể cả cùng một hợp đồng (giống sổ đỏ nhà, không phải tờ tiền). NFT dùng cho nghệ thuật số, vật phẩm sưu tầm, vật phẩm trong game, và ngày càng được dùng để đại diện quyền sở hữu tài sản thực (Chương 8).</p>
<h3>ERC-1155 — tiêu chuẩn đa token</h3>
<p><strong>ERC-1155</strong> cho phép một hợp đồng duy nhất quản lý nhiều loại token cùng lúc — fungible, non-fungible, hoặc bán-fungible (vd 1.000 bản sao của một vật phẩm game) — tiết kiệm gas hơn cho ứng dụng như game cần nhiều loại vật phẩm.</p>
<div class="callout"><span class="badge">Đúng chuẩn ≠ an toàn</span> Theo chuẩn ERC-20/721 giúp token tương thích, không có nghĩa là đáng tin. Ai cũng triển khai được một hợp đồng token trong vài phút — tiêu chuẩn không nói gì về ai kiểm soát nguồn cung hay dự án có chính đáng hay không (xem cảnh báo rug-pull ở Chương 7).</div>`,
  ]]);

const c4q = quiz('bdf201-quiz-4', 'Quiz 4 — Token & standards|||Quiz 4 — Token & tiêu chuẩn', [
  { id: 'q1', question: 'Token khác coin gốc (như ETH) ở điểm nào?', options: ['Token không có giá trị', 'Token được định nghĩa bởi smart contract chạy trên nền một blockchain, không phải tích hợp sẵn trong giao thức', 'Token chỉ dùng cho NFT', 'Không có khác biệt'], correctIndex: 1, explanation: 'Coin gốc (ETH) tích hợp sẵn trong protocol; token là tài sản định nghĩa bằng smart contract chạy trên nền blockchain.' },
  { id: 'q2', question: 'ERC-20 là tiêu chuẩn dùng cho loại token nào?', options: ['Token không thay thế được (NFT)', 'Token thay thế được (fungible) — mọi đơn vị giống hệt nhau', 'Chỉ dùng cho stablecoin', 'Chỉ dùng cho ví lạnh'], correctIndex: 1, explanation: 'ERC-20 định nghĩa token fungible, các đơn vị đổi ngang cho nhau được.' },
  { id: 'q3', question: 'Vì sao "đúng chuẩn ERC-20/721" KHÔNG có nghĩa là token đáng tin?', options: ['Vì chuẩn đó đã lỗi thời', 'Vì ai cũng triển khai được một hợp đồng token trong vài phút, chuẩn không nói gì về người kiểm soát hay tính chính đáng của dự án', 'Vì token luôn miễn phí', 'Vì tiêu chuẩn chỉ áp dụng cho Bitcoin'], correctIndex: 1, explanation: 'Tuân chuẩn chỉ đảm bảo tính tương thích kỹ thuật, không đảm bảo dự án chính đáng hay an toàn.' },
]);

const c5 = doc('bdf201-5-1-defi-overview', '5.1 — DeFi overview: DEX, AMM, lending, staking|||5.1 — Tổng quan DeFi: DEX, AMM, cho vay, staking',
  'Sàn giao dịch phi tập trung (DEX) so với sàn tập trung (CEX), Automated Market Maker (AMM) & công thức x·y=k, pool thanh khoản, cho vay/thế chấp, staking.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 5 · Lesson 5.1</span>
<h2>DeFi overview: DEX, AMM, lending, staking</h2>
<h3>What is DeFi?</h3>
<p><strong>Decentralized Finance (DeFi)</strong> rebuilds financial services — trading, lending, earning interest — as smart contracts on a public blockchain, open to anyone with a wallet, with no bank account or approval process. It runs 24/7, globally, and its logic is publicly auditable (in principle).</p>
<h3>DEX vs. CEX</h3>
<ul>
<li><strong>CEX (centralized exchange)</strong> — e.g. a typical exchange app: a company holds your funds and matches orders on its own servers.</li>
<li><strong>DEX (decentralized exchange)</strong> — a smart contract that lets users trade directly from their own wallets; no company custodies the funds.</li>
</ul>
<h3>The AMM: trading without an order book</h3>
<p>Most DEXs use an <strong>Automated Market Maker (AMM)</strong> instead of matching buyers with sellers. A simple AMM (e.g. Uniswap's constant-product model) holds a pool of two tokens and enforces:</p>
<pre><code>x * y = k     (constant product)

Pool: 100 ETH * 200,000 USDC = k (constant)
Buy ETH with USDC -&gt; USDC in pool increases, ETH decreases
-&gt; price of ETH (in USDC) rises automatically along the curve
</code></pre>
<p>Anyone can become a <strong>liquidity provider (LP)</strong> by depositing both tokens into the pool, earning a share of trading fees in return (and taking on <strong>impermanent loss</strong> — value drift versus just holding the two tokens — if their relative price moves a lot).</p>
<h3>Lending &amp; borrowing</h3>
<p>DeFi lending protocols let you deposit crypto to earn interest, or borrow against crypto you post as <strong>collateral</strong>. Because there's no credit check, loans are typically <strong>over-collateralized</strong> (e.g. deposit $150 of ETH to borrow $100 of a stablecoin). If collateral value falls too far, the position is automatically <strong>liquidated</strong> by the smart contract to protect lenders.</p>
<h3>Staking</h3>
<p><strong>Staking</strong> means locking tokens to help secure a Proof-of-Stake network (Chapter 1) or a protocol, earning rewards in return — conceptually similar to earning interest, but with its own risks (lock-up periods, slashing, smart-contract bugs).</p>
<div class="callout"><span class="badge">"Yield" is not free money</span> Every DeFi yield compensates for a real risk: smart-contract bugs, impermanent loss, liquidation, or the protocol's token losing value. Higher advertised yield usually means higher risk somewhere in that list.</div>`,
    `<span class="eyebrow">BDF201 · Chương 5 · Bài 5.1</span>
<h2>Tổng quan DeFi: DEX, AMM, cho vay, staking</h2>
<h3>DeFi là gì?</h3>
<p><strong>Tài chính phi tập trung (DeFi)</strong> dựng lại các dịch vụ tài chính — giao dịch, cho vay, sinh lãi — thành smart contract trên blockchain công khai, ai có ví đều dùng được, không cần tài khoản ngân hàng hay xét duyệt. Nó chạy 24/7, toàn cầu, và logic có thể kiểm chứng công khai (về nguyên tắc).</p>
<h3>DEX so với CEX</h3>
<ul>
<li><strong>CEX (sàn tập trung)</strong> — vd một app sàn giao dịch thông thường: một công ty giữ tiền của bạn và khớp lệnh trên máy chủ riêng của họ.</li>
<li><strong>DEX (sàn phi tập trung)</strong> — một smart contract cho phép người dùng giao dịch trực tiếp từ ví của mình; không công ty nào giữ hộ tiền.</li>
</ul>
<h3>AMM: giao dịch không cần sổ lệnh</h3>
<p>Hầu hết DEX dùng <strong>Automated Market Maker (AMM)</strong> thay vì khớp người mua với người bán. Một AMM đơn giản (vd mô hình tích không đổi của Uniswap) giữ một pool gồm hai token và tuân theo:</p>
<pre><code>x * y = k     (tích không đổi)

Pool: 100 ETH * 200.000 USDC = k (hằng số)
Mua ETH bằng USDC -&gt; USDC trong pool tăng, ETH giảm
-&gt; giá ETH (tính bằng USDC) tự động tăng theo đường cong
</code></pre>
<p>Ai cũng có thể trở thành <strong>nhà cung cấp thanh khoản (LP)</strong> bằng cách gửi cả hai token vào pool, đổi lại nhận một phần phí giao dịch (và chịu <strong>impermanent loss</strong> — giá trị lệch đi so với chỉ nắm giữ hai token — nếu giá tương đối của chúng biến động mạnh).</p>
<h3>Cho vay &amp; đi vay</h3>
<p>Giao thức cho vay DeFi cho phép bạn gửi crypto để sinh lãi, hoặc vay dựa trên crypto ký quỹ làm <strong>tài sản thế chấp</strong>. Vì không có kiểm tra tín dụng, khoản vay thường <strong>thế chấp vượt mức</strong> (vd gửi 150$ ETH để vay 100$ stablecoin). Nếu giá trị thế chấp giảm quá sâu, vị thế bị smart contract tự động <strong>thanh lý (liquidation)</strong> để bảo vệ người cho vay.</p>
<h3>Staking</h3>
<p><strong>Staking</strong> là khoá token để giúp bảo mật một mạng Proof-of-Stake (Chương 1) hoặc một giao thức, đổi lại nhận thưởng — về ý tưởng giống gửi tiết kiệm sinh lãi, nhưng có rủi ro riêng (thời gian khoá, bị "slashing", lỗi smart contract).</p>
<div class="callout"><span class="badge">"Lãi suất" không phải tiền miễn phí</span> Mọi khoản lãi trong DeFi đều bù đắp cho một rủi ro thật: lỗi smart contract, impermanent loss, bị thanh lý, hoặc token của giao thức mất giá. Lãi suất quảng cáo càng cao thường đồng nghĩa rủi ro càng lớn ở đâu đó trong danh sách này.</div>`,
  ]]);

const c5q = quiz('bdf201-quiz-5', 'Quiz 5 — DeFi overview|||Quiz 5 — Tổng quan DeFi', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa DEX và CEX là gì?', options: ['DEX nhanh hơn CEX', 'DEX là smart contract cho giao dịch trực tiếp từ ví, không công ty nào giữ hộ tiền; CEX do một công ty giữ tiền và khớp lệnh', 'CEX không thể bị hack', 'DEX chỉ giao dịch được NFT'], correctIndex: 1, explanation: 'DEX phi tập trung hoá việc custody và khớp lệnh; CEX vẫn do một công ty trung tâm vận hành.' },
  { id: 'q2', question: 'Trong AMM theo mô hình tích không đổi (x·y=k), điều gì xảy ra khi mua ETH bằng USDC trong pool?', options: ['Giá ETH giảm', 'Giá ETH tăng vì lượng ETH trong pool giảm, USDC tăng, giữ tích x·y không đổi', 'Giá không đổi', 'Pool bị đóng băng'], correctIndex: 1, explanation: 'Mua ETH rút ETH khỏi pool và thêm USDC vào, đẩy giá ETH lên theo đường cong x·y=k.' },
  { id: 'q3', question: 'Vì sao các khoản vay DeFi thường "thế chấp vượt mức" (over-collateralized)?', options: ['Để giao thức thu thêm phí', 'Vì không có kiểm tra tín dụng như ngân hàng, tài sản thế chấp lớn hơn khoản vay để bảo vệ người cho vay', 'Vì luật pháp yêu cầu', 'Vì token thế chấp không có giá trị'], correctIndex: 1, explanation: 'Không kiểm tra tín dụng nên giao thức yêu cầu thế chấp lớn hơn khoản vay, tự thanh lý nếu giá trị thế chấp sụt giảm.' },
]);

const c6 = doc('bdf201-6-1-stablecoins-payments', '6.1 — Stablecoins & decentralized payments|||6.1 — Stablecoin & thanh toán phi tập trung',
  'Ba loại stablecoin (thế chấp fiat, thế chấp crypto, thuật toán), rủi ro (vụ sụp đổ UST/Terra 2022), ứng dụng chuyển tiền xuyên biên giới.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 6 · Lesson 6.1</span>
<h2>Stablecoins &amp; decentralized payments</h2>
<h3>Why stablecoins exist</h3>
<p>Bitcoin and Ether are useful as assets, but their price swings make them impractical as everyday money. A <strong>stablecoin</strong> is a crypto token designed to hold a stable value, usually pegged 1:1 to a fiat currency like the US dollar — combining blockchain's transfer speed with price stability.</p>
<h3>Three main designs</h3>
<ul>
<li><strong>Fiat-collateralized</strong> (e.g. USDC, USDT) — a company holds real dollars (or equivalent) in reserve for every token issued, and is supposed to be independently audited. Simplest and most widely used, but requires trusting the issuer to actually hold the reserves.</li>
<li><strong>Crypto-collateralized</strong> (e.g. DAI) — backed by other cryptocurrencies locked in a smart contract, over-collateralized to absorb price swings (similar mechanics to DeFi lending in Chapter 5). More decentralized, but exposed to the volatility of its crypto collateral.</li>
<li><strong>Algorithmic</strong> — attempts to hold the peg purely through code and market incentives, with little or no collateral. Historically the riskiest design.</li>
</ul>
<h3>A cautionary case: TerraUST, 2022</h3>
<p>Algorithmic stablecoin <strong>TerraUSD (UST)</strong> tried to keep its $1 peg via a minting/burning relationship with a sister token (LUNA), with no real collateral behind it. In May 2022, a loss of confidence triggered a self-reinforcing collapse — UST fell far below $1 and roughly $40 billion in value was wiped out within days. It is the standard teaching example of algorithmic-stablecoin risk.</p>
<h3>Payments &amp; remittances</h3>
<p>Because they combine price stability with near-instant, low-fee blockchain transfers, stablecoins are increasingly used for <strong>cross-border payments and remittances</strong> — sending value internationally without the multi-day delays and high fees of traditional wire transfers, though users still face on/off-ramp friction (converting to/from local cash) and regulatory uncertainty in many countries.</p>
<div class="callout"><span class="badge">"Stable" is a design goal, not a guarantee</span> Every stablecoin can, in principle, lose its peg. Always ask: what actually backs this token, and who can verify it?</div>`,
    `<span class="eyebrow">BDF201 · Chương 6 · Bài 6.1</span>
<h2>Stablecoin &amp; thanh toán phi tập trung</h2>
<h3>Vì sao stablecoin ra đời</h3>
<p>Bitcoin và Ether hữu ích như tài sản, nhưng giá biến động mạnh khiến chúng không thực tế để dùng làm tiền hàng ngày. <strong>Stablecoin</strong> là token crypto được thiết kế để giữ giá trị ổn định, thường neo 1:1 vào một đồng tiền pháp định như đô la Mỹ — kết hợp tốc độ chuyển của blockchain với sự ổn định giá.</p>
<h3>Ba thiết kế chính</h3>
<ul>
<li><strong>Thế chấp bằng fiat</strong> (vd USDC, USDT) — một công ty giữ đô la thật (hoặc tương đương) làm dự trữ cho mỗi token phát hành, và được cho là kiểm toán độc lập. Đơn giản và phổ biến nhất, nhưng đòi hỏi tin rằng bên phát hành thực sự giữ đủ dự trữ.</li>
<li><strong>Thế chấp bằng crypto</strong> (vd DAI) — được đảm bảo bằng crypto khác khoá trong smart contract, thế chấp vượt mức để hấp thụ biến động giá (cơ chế tương tự cho vay DeFi ở Chương 5). Phi tập trung hơn, nhưng chịu rủi ro biến động của chính tài sản thế chấp.</li>
<li><strong>Thuật toán (algorithmic)</strong> — cố giữ giá neo hoàn toàn bằng mã và động lực thị trường, ít hoặc không có tài sản thế chấp. Thiết kế rủi ro nhất trong lịch sử.</li>
</ul>
<h3>Bài học cảnh báo: TerraUST, 2022</h3>
<p>Stablecoin thuật toán <strong>TerraUSD (UST)</strong> cố giữ giá neo 1$ qua cơ chế đúc/đốt với một token chị em (LUNA), không có tài sản thế chấp thật đứng sau. Tháng 5/2022, mất niềm tin kích hoạt một vòng sụp đổ tự củng cố — UST rơi sâu dưới 1$ và khoảng 40 tỷ đô giá trị bị xoá sổ chỉ trong vài ngày. Đây là ví dụ giảng dạy kinh điển về rủi ro stablecoin thuật toán.</p>
<h3>Thanh toán &amp; chuyển tiền</h3>
<p>Vì kết hợp ổn định giá với chuyển khoản blockchain gần như tức thời, phí thấp, stablecoin ngày càng được dùng cho <strong>thanh toán xuyên biên giới &amp; chuyển tiền kiều hối</strong> — gửi giá trị quốc tế mà không mất nhiều ngày và phí cao như chuyển khoản ngân hàng truyền thống, dù người dùng vẫn gặp ma sát ở khâu quy đổi sang/từ tiền mặt địa phương và pháp lý chưa rõ ràng ở nhiều nước.</p>
<div class="callout"><span class="badge">"Ổn định" là mục tiêu thiết kế, không phải bảo đảm</span> Về nguyên tắc, mọi stablecoin đều có thể mất giá neo. Luôn hỏi: cái gì thực sự đứng sau token này, và ai kiểm chứng được điều đó?</div>`,
  ]]);

const c6q = quiz('bdf201-quiz-6', 'Quiz 6 — Stablecoins & payments|||Quiz 6 — Stablecoin & thanh toán', [
  { id: 'q1', question: 'Stablecoin thế chấp bằng fiat (vd USDC) hoạt động dựa trên điều gì?', options: ['Thuật toán thuần tuý không cần dự trữ', 'Một bên phát hành giữ đô la thật (hoặc tương đương) làm dự trữ cho mỗi token', 'Thế chấp bằng Bitcoin', 'Không có gì đứng sau'], correctIndex: 1, explanation: 'Stablecoin thế chấp fiat dựa vào dự trữ tiền thật do bên phát hành nắm giữ.' },
  { id: 'q2', question: 'Vụ sụp đổ TerraUST (UST) năm 2022 là ví dụ điển hình cho rủi ro của loại stablecoin nào?', options: ['Thế chấp bằng fiat', 'Thế chấp bằng crypto', 'Thuật toán (algorithmic), không có tài sản thế chấp thật', 'Không loại nào, đó là lỗi sàn giao dịch'], correctIndex: 2, explanation: 'UST là stablecoin thuật toán, giữ giá neo bằng cơ chế đúc/đốt với LUNA chứ không có tài sản thế chấp thật.' },
  { id: 'q3', question: 'Vì sao stablecoin được dùng ngày càng nhiều cho chuyển tiền xuyên biên giới?', options: ['Vì giá biến động mạnh giúp sinh lời', 'Vì kết hợp ổn định giá với chuyển khoản blockchain nhanh, phí thấp hơn chuyển khoản ngân hàng truyền thống', 'Vì được chính phủ mọi nước bảo lãnh', 'Vì không cần quy đổi sang tiền mặt địa phương'], correctIndex: 1, explanation: 'Ổn định giá + tốc độ/phí của blockchain là lý do chính, dù vẫn còn ma sát khi quy đổi ra tiền mặt.' },
]);

const c7 = doc('bdf201-7-1-wallets-security-risks', '7.1 — Wallets, security, risks & scams|||7.1 — Ví, bảo mật, rủi ro & scam',
  'Ví nóng/lạnh, custodial/non-custodial, cụm từ khôi phục (seed phrase), rug pull, phishing, khai thác smart contract, lừa đảo phổ biến.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 7 · Lesson 7.1</span>
<h2>Wallets, security, risks &amp; scams</h2>
<h3>Custodial vs. non-custodial wallets</h3>
<ul>
<li><strong>Custodial</strong> (e.g. an exchange account) — a company holds your private keys for you; convenient, but you're trusting that company's security and solvency ("not your keys, not your coins").</li>
<li><strong>Non-custodial</strong> — you hold your own private key (in a software or hardware wallet); full control, but full responsibility — there is no customer support that can reverse a mistake.</li>
</ul>
<h3>Hot vs. cold storage</h3>
<p>A <strong>hot wallet</strong> stays connected to the internet (a phone/browser app) — convenient for frequent use, more exposed to online attacks. A <strong>cold wallet</strong> (a hardware device, or keys generated and stored fully offline) never exposes the private key to an internet-connected device — safer for larger, long-term holdings.</p>
<h3>The seed phrase</h3>
<p>Most wallets generate a human-readable <strong>seed phrase</strong> (typically 12–24 words) that can regenerate every key in the wallet. Anyone who obtains it has full, permanent control of the funds — it must never be typed into a website, shared, or stored in plain text online.</p>
<h3>Common attacks &amp; scams</h3>
<ul>
<li><strong>Phishing</strong> — fake wallet-connect pop-ups or fake websites trick users into signing a transaction that drains their wallet, or into typing their seed phrase.</li>
<li><strong>Rug pull</strong> — developers of a token/project hype it, collect funds (often via a liquidity pool), then withdraw the liquidity or mint unlimited tokens and disappear.</li>
<li><strong>Smart-contract exploits</strong> — bugs like <strong>reentrancy</strong> (a contract is called again before it finishes updating its own state) have caused some of the largest DeFi hacks; this is why independent security <strong>audits</strong> matter before trusting a protocol with funds.</li>
<li><strong>Ponzi/pump-and-dump schemes</strong> — "guaranteed" high returns paid from new investors' money rather than real yield; collapses when new money stops flowing in.</li>
</ul>
<div class="callout"><span class="badge">Practical rules of thumb</span> Never share a seed phrase with anyone or any website. Verify contract addresses independently (e.g. on Etherscan) before interacting. Treat "guaranteed" high returns as a red flag, not a selling point. None of this is investment advice — it's basic risk hygiene.</div>`,
    `<span class="eyebrow">BDF201 · Chương 7 · Bài 7.1</span>
<h2>Ví, bảo mật, rủi ro &amp; scam</h2>
<h3>Ví custodial so với non-custodial</h3>
<ul>
<li><strong>Custodial</strong> (vd tài khoản trên sàn) — một công ty giữ khoá riêng tư hộ bạn; tiện lợi, nhưng bạn phải tin vào bảo mật và khả năng thanh khoản của công ty đó ("không giữ khoá, không phải tiền của bạn").</li>
<li><strong>Non-custodial</strong> — bạn tự giữ khoá riêng tư (trong ví phần mềm hoặc ví cứng); toàn quyền kiểm soát, nhưng cũng toàn bộ trách nhiệm — không có bộ phận hỗ trợ nào đảo ngược được một sai lầm.</li>
</ul>
<h3>Ví nóng so với ví lạnh</h3>
<p>Một <strong>ví nóng</strong> luôn kết nối internet (app điện thoại/trình duyệt) — tiện dùng thường xuyên, dễ bị tấn công trực tuyến hơn. Một <strong>ví lạnh</strong> (thiết bị phần cứng, hoặc khoá tạo và lưu hoàn toàn ngoại tuyến) không bao giờ để lộ khoá riêng tư cho thiết bị có kết nối internet — an toàn hơn cho khoản lớn, giữ dài hạn.</p>
<h3>Cụm từ khôi phục (seed phrase)</h3>
<p>Hầu hết ví sinh ra một <strong>seed phrase</strong> dễ đọc (thường 12–24 từ) có thể tạo lại mọi khoá trong ví. Ai có được nó thì có toàn quyền, vĩnh viễn với số tiền — tuyệt đối không được gõ vào một website, chia sẻ, hay lưu dạng văn bản thô trên mạng.</p>
<h3>Các kiểu tấn công &amp; lừa đảo phổ biến</h3>
<ul>
<li><strong>Phishing</strong> — pop-up kết nối ví giả hoặc website giả lừa người dùng ký một giao dịch rút sạch ví, hoặc gõ seed phrase.</li>
<li><strong>Rug pull</strong> — nhóm phát triển một token/dự án thổi phồng, gom tiền (thường qua pool thanh khoản), rồi rút thanh khoản hoặc đúc token không giới hạn và biến mất.</li>
<li><strong>Khai thác smart contract</strong> — lỗi như <strong>reentrancy</strong> (hợp đồng bị gọi lại trước khi cập nhật xong trạng thái của chính nó) đã gây ra một số vụ hack DeFi lớn nhất; đây là lý do <strong>audit</strong> bảo mật độc lập quan trọng trước khi tin tưởng gửi tiền vào một giao thức.</li>
<li><strong>Ponzi/pump-and-dump</strong> — lợi nhuận cao "đảm bảo" thực chất trả bằng tiền của nhà đầu tư mới chứ không phải lợi nhuận thật; sụp đổ khi dòng tiền mới ngừng chảy vào.</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc thực hành</span> Không bao giờ chia sẻ seed phrase với bất kỳ ai hay website nào. Tự kiểm tra địa chỉ hợp đồng độc lập (vd trên Etherscan) trước khi tương tác. Coi lợi nhuận "đảm bảo" cao là dấu hiệu cảnh báo, không phải điểm hấp dẫn. Đây không phải khuyến nghị đầu tư — chỉ là vệ sinh rủi ro cơ bản.</div>`,
  ]]);

const c7q = quiz('bdf201-quiz-7', 'Quiz 7 — Wallets, security & scams|||Quiz 7 — Ví, bảo mật & scam', [
  { id: 'q1', question: 'Vì sao ví lạnh (cold wallet) an toàn hơn ví nóng (hot wallet) cho khoản tiền lớn?', options: ['Ví lạnh có phí giao dịch thấp hơn', 'Ví lạnh không bao giờ để lộ khoá riêng tư cho thiết bị có kết nối internet', 'Ví lạnh nhanh hơn khi giao dịch', 'Ví lạnh do sàn giao dịch quản lý'], correctIndex: 1, explanation: 'Ví lạnh giữ khoá riêng tư hoàn toàn ngoại tuyến, giảm bề mặt tấn công trực tuyến.' },
  { id: 'q2', question: '"Rug pull" là kiểu lừa đảo như thế nào?', options: ['Hack trực tiếp vào ví lạnh', 'Nhóm phát triển gom tiền từ dự án rồi rút thanh khoản/đúc token vô hạn và biến mất', 'Lỗi kỹ thuật ngẫu nhiên của blockchain', 'Chính phủ đóng băng tài sản'], correctIndex: 1, explanation: 'Rug pull là hành vi có chủ đích của người phát triển dự án, không phải lỗi kỹ thuật.' },
  { id: 'q3', question: 'Vì sao KHÔNG bao giờ được gõ seed phrase vào một website?', options: ['Vì làm chậm trình duyệt', 'Vì ai có seed phrase sẽ có toàn quyền, vĩnh viễn kiểm soát mọi khoá và tiền trong ví', 'Vì website sẽ tự động trừ phí', 'Vì seed phrase chỉ dùng được một lần'], correctIndex: 1, explanation: 'Seed phrase tái tạo được mọi private key của ví — lộ ra là mất toàn bộ, không thể đảo ngược.' },
]);

const c8 = doc('bdf201-8-1-regulation-cbdc-future', '8.1 — Regulation, CBDCs & the future of finance|||8.1 — Quy định pháp lý, CBDC & tương lai tài chính',
  'Khung pháp lý toàn cầu chưa thống nhất, CBDC (tiền số ngân hàng trung ương), token hoá tài sản thực (RWA), ứng dụng blockchain trong doanh nghiệp.',
  [[
    `<span class="eyebrow">BDF201 · Chapter 8 · Lesson 8.1</span>
<h2>Regulation, CBDCs &amp; the future of finance</h2>
<h3>A patchwork of regulation</h3>
<p>Governments worldwide have not converged on one approach to crypto. Broadly:</p>
<ul>
<li>Some jurisdictions (e.g. the EU's <strong>MiCA</strong> — Markets in Crypto-Assets regulation) have built comprehensive licensing and disclosure rules for issuers and exchanges.</li>
<li>Others (e.g. U.S. regulators) largely apply existing securities/commodities law case-by-case, creating uncertainty about which rules apply to which token.</li>
<li>Some countries restrict or ban crypto trading and mining outright, citing capital-flow, consumer-protection or energy concerns.</li>
</ul>
<p>For a business, this means compliance requirements can differ sharply by country, and can change faster than a product roadmap.</p>
<h3>CBDCs — central bank digital currency</h3>
<p>A <strong>Central Bank Digital Currency (CBDC)</strong> is a digital form of a country's official currency, issued and backed directly by its central bank — unlike Bitcoin or stablecoins, it is centralized by design. Dozens of central banks are researching or piloting CBDCs, aiming to modernize payments while keeping monetary policy firmly in central-bank hands; critics raise concerns about privacy and the central bank's visibility into individual transactions.</p>
<h3>Tokenizing real-world assets (RWA)</h3>
<p>An emerging use case is representing traditional assets — government bonds, real estate, private credit, even company shares — as tokens on a blockchain (<strong>tokenization</strong>). Proponents argue this enables fractional ownership, faster settlement and broader access; it also inherits blockchain's risks (smart-contract bugs, custody of the underlying asset, and legal enforceability of on-chain ownership records).</p>
<h3>Enterprise &amp; institutional adoption</h3>
<p>Beyond retail speculation, banks and enterprises are experimenting with blockchain for <strong>trade finance</strong>, <strong>supply-chain tracking</strong>, and <strong>cross-border settlement</strong> — often on permissioned (private) blockchains rather than public ones like Bitcoin/Ethereum, trading some decentralization for compliance and control.</p>
<div class="callout"><span class="badge">Where this leaves us</span> Blockchain and DeFi are real, working technology with genuine trade-offs — not a guaranteed path to wealth, and not a passing fad either. The honest position for a business student: understand the mechanics, weigh the risks (technical, financial, regulatory) case by case, and never treat this course as investment advice.</div>`,
    `<span class="eyebrow">BDF201 · Chương 8 · Bài 8.1</span>
<h2>Quy định pháp lý, CBDC &amp; tương lai tài chính</h2>
<h3>Bức tranh pháp lý chắp vá</h3>
<p>Các chính phủ trên thế giới chưa thống nhất một cách tiếp cận với crypto. Nhìn chung:</p>
<ul>
<li>Một số khu vực (vd <strong>MiCA</strong> của EU — Markets in Crypto-Assets) đã xây quy định cấp phép và công bố thông tin toàn diện cho bên phát hành và sàn giao dịch.</li>
<li>Nơi khác (vd cơ quan quản lý Mỹ) phần lớn áp dụng luật chứng khoán/hàng hoá hiện có theo từng vụ việc, gây bất định về việc quy tắc nào áp dụng cho token nào.</li>
<li>Một số nước hạn chế hoặc cấm hẳn giao dịch và đào crypto, viện dẫn lo ngại về dòng vốn, bảo vệ người tiêu dùng hoặc năng lượng.</li>
</ul>
<p>Với một doanh nghiệp, điều này nghĩa là yêu cầu tuân thủ có thể khác nhau rất nhiều theo từng nước, và có thể thay đổi nhanh hơn cả lộ trình sản phẩm.</p>
<h3>CBDC — tiền số ngân hàng trung ương</h3>
<p><strong>CBDC (Central Bank Digital Currency)</strong> là dạng số của đồng tiền chính thức một quốc gia, do chính ngân hàng trung ương phát hành và bảo đảm — khác Bitcoin hay stablecoin, nó tập trung hoá theo đúng thiết kế. Hàng chục ngân hàng trung ương đang nghiên cứu hoặc thí điểm CBDC, nhằm hiện đại hoá thanh toán trong khi vẫn giữ chặt chính sách tiền tệ trong tay ngân hàng trung ương; giới phê bình lo ngại về quyền riêng tư và khả năng ngân hàng trung ương "nhìn thấy" từng giao dịch cá nhân.</p>
<h3>Token hoá tài sản thực (RWA)</h3>
<p>Một ứng dụng mới nổi là đại diện tài sản truyền thống — trái phiếu chính phủ, bất động sản, tín dụng tư nhân, thậm chí cổ phần công ty — dưới dạng token trên blockchain (<strong>tokenization</strong>). Người ủng hộ cho rằng điều này giúp sở hữu theo phần nhỏ, giải quyết nhanh hơn và tiếp cận rộng hơn; nó cũng thừa hưởng rủi ro của blockchain (lỗi smart contract, việc lưu giữ tài sản gốc, và tính pháp lý của bản ghi sở hữu trên chuỗi).</p>
<h3>Ứng dụng doanh nghiệp &amp; tổ chức</h3>
<p>Ngoài đầu cơ bán lẻ, ngân hàng và doanh nghiệp đang thử nghiệm blockchain cho <strong>tài trợ thương mại (trade finance)</strong>, <strong>truy vết chuỗi cung ứng</strong>, và <strong>thanh toán xuyên biên giới</strong> — thường trên blockchain có cấp quyền (private) thay vì công khai như Bitcoin/Ethereum, đánh đổi bớt phi tập trung để lấy tuân thủ và kiểm soát.</p>
<div class="callout"><span class="badge">Vị trí của chúng ta hiện nay</span> Blockchain và DeFi là công nghệ thật, đang vận hành, với những đánh đổi thật — không phải con đường làm giàu chắc chắn, cũng không phải trào lưu nhất thời. Vị trí trung thực cho một sinh viên kinh doanh: hiểu cơ chế, cân nhắc rủi ro (kỹ thuật, tài chính, pháp lý) theo từng trường hợp, và không bao giờ coi môn này là khuyến nghị đầu tư.</div>`,
  ]]);

const c8q = quiz('bdf201-quiz-8', 'Quiz 8 — Regulation, CBDC & future|||Quiz 8 — Pháp lý, CBDC & tương lai', [
  { id: 'q1', question: 'Vì sao khung pháp lý crypto trên thế giới được gọi là "chắp vá"?', options: ['Vì mọi nước đều cấm crypto', 'Vì các nước áp dụng cách tiếp cận khác nhau — có nơi ban hành luật riêng (MiCA), có nơi áp luật hiện có theo từng vụ, có nơi cấm hẳn', 'Vì crypto không thể quản lý được', 'Vì chỉ Mỹ có luật về crypto'], correctIndex: 1, explanation: 'Không có sự thống nhất toàn cầu — mỗi khu vực chọn cách tiếp cận pháp lý khác nhau.' },
  { id: 'q2', question: 'CBDC khác Bitcoin ở điểm cốt lõi nào?', options: ['CBDC không dùng công nghệ số', 'CBDC do ngân hàng trung ương phát hành và kiểm soát, tập trung hoá theo thiết kế; Bitcoin phi tập trung, không ai phát hành', 'CBDC luôn có giá cao hơn Bitcoin', 'Không có khác biệt'], correctIndex: 1, explanation: 'CBDC là tiền số tập trung do nhà nước phát hành; Bitcoin là mạng phi tập trung không ai kiểm soát.' },
  { id: 'q3', question: 'Token hoá tài sản thực (RWA) là gì?', options: ['Tạo token không có giá trị gì đứng sau', 'Đại diện tài sản truyền thống (trái phiếu, bất động sản...) dưới dạng token trên blockchain', 'Chuyển đổi Bitcoin thành cổ phiếu', 'Một loại thuế đánh vào crypto'], correctIndex: 1, explanation: 'RWA (Real-World Asset) tokenization đưa tài sản thực lên blockchain dưới dạng token đại diện quyền sở hữu.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'BDF201',
    slug: 'bdf201-blockchain-and-decentralized-finance',
    title: 'Blockchain and decentralized finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BDF201.webp',
    shortDescription: 'How blockchain works — decentralization, consensus; Bitcoin & Ethereum; smart contracts; tokens (ERC-20/NFT); DeFi (DEX, AMM, lending, staking); stablecoins; wallet security & scams; regulation & CBDCs. Bilingual, balanced, not investment advice.|||Blockchain hoạt động thế nào — phi tập trung, đồng thuận; Bitcoin & Ethereum; smart contract; token (ERC-20/NFT); DeFi (DEX, AMM, cho vay, staking); stablecoin; bảo mật ví & lừa đảo; pháp lý & CBDC. Song ngữ, cân bằng rủi ro, không khuyến nghị đầu tư.',
    description: 'Môn <strong>BDF201 — Blockchain and Decentralized Finance</strong> (khối Quản trị Kinh doanh, kỳ 2) giải thích <strong>blockchain và DeFi hoạt động thế nào</strong> một cách cân bằng, có căn cứ. Từ <strong>nguyên lý blockchain</strong> (phi tập trung, sổ cái phân tán, đồng thuận PoW/PoS) → <strong>Bitcoin</strong> (UTXO, mining, halving) → <strong>Ethereum &amp; smart contract</strong> (EVM, gas, Solidity) → <strong>token</strong> (ERC-20, NFT/ERC-721) → <strong>DeFi</strong> (DEX, AMM, cho vay, staking) → <strong>stablecoin</strong> → <strong>bảo mật ví &amp; rủi ro/scam</strong> → <strong>quy định pháp lý, CBDC &amp; ứng dụng doanh nghiệp</strong>. Song ngữ, có ví dụ minh hoạ và quiz mỗi chương. Nội dung giáo dục, KHÔNG khuyến nghị đầu tư.',
    whatYouLearn: 'Nguyên lý blockchain (sổ cái phân tán, hash, PoW/PoS); Bitcoin (UTXO, mining, halving, khoá & ví); Ethereum (mô hình tài khoản, EVM, gas, smart contract Solidity); tiêu chuẩn token (ERC-20, ERC-721/NFT, ERC-1155); DeFi (DEX, AMM x·y=k, pool thanh khoản, cho vay/thế chấp, staking); stablecoin (thế chấp fiat/crypto, thuật toán, rủi ro); bảo mật ví (hot/cold, seed phrase) & nhận diện scam (rug pull, phishing, khai thác smart contract); quy định pháp lý, CBDC & token hoá tài sản thực.',
    requirements: 'Kiến thức tài chính/kinh doanh cơ bản (bậc BBA). Không cần biết lập trình trước — các ví dụ mã nguồn chỉ mang tính minh hoạ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền tảng, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Blockchain & DeFi là gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nguyên lý blockchain|||Chapter 1 — Blockchain fundamentals', description: 'Phi tập trung, sổ cái phân tán, đồng thuận PoW/PoS.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bitcoin & tiền mã hoá|||Chapter 2 — Bitcoin & cryptocurrency', description: 'UTXO, mining, halving, khoá & ví.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ethereum & smart contract|||Chapter 3 — Ethereum & smart contracts', description: 'EVM, mô hình tài khoản, gas, Solidity.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Token & tiêu chuẩn|||Chapter 4 — Tokens & standards', description: 'ERC-20, ERC-721/NFT, ERC-1155.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tổng quan DeFi|||Chapter 5 — DeFi overview', description: 'DEX, AMM, cho vay, staking.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Stablecoin & thanh toán|||Chapter 6 — Stablecoins & payments', description: 'Ba loại stablecoin, rủi ro, chuyển tiền xuyên biên giới.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ví, bảo mật & rủi ro|||Chapter 7 — Wallets, security & risks', description: 'Hot/cold wallet, seed phrase, rug pull, phishing, exploit.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Pháp lý, CBDC & tương lai|||Chapter 8 — Regulation, CBDC & future', description: 'Quy định toàn cầu, CBDC, token hoá tài sản thực, doanh nghiệp.', lessons: [c8, c8q] },
  ],
};
