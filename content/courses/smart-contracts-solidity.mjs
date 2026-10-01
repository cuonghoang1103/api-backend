/**
 * Smart Contracts với Solidity — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 01/10/2026 theo lộ trình 6 nghề
 * (content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md, gói B). Khoá SỞ HỮU: Solidity, Foundry/Hardhat, chuẩn token & OpenZeppelin,
 * gas, mẫu thiết kế hợp đồng (proxy, EIP-712, account abstraction), lỗ hổng kinh điển để PHÒNG THỦ, audit & công cụ,
 * DeFi từ bên trong, dApp full-stack, triển khai & vận hành.
 * Học trước: blockchain-fundamentals (EVM, gas, token ở mức khái niệm, pháp lý Ch10). Chạm: web-security (tư duy bảo mật,
 * chuỗi cung ứng), testing, react, applied-cryptography (chữ ký) — bài "Nếu đã học …" + link.
 * AN TOÀN: lab chỉ trên Anvil/Hardhat cục bộ và testnet (Sepolia); lỗ hổng chỉ thực hành trên hợp đồng CỐ Ý có lỗi trong lab
 * hoặc nền tảng luyện tập cho phép (Ethernaut, Damn Vulnerable DeFi chạy cục bộ); không hướng dẫn tấn công hợp đồng thật;
 * không triển khai lên mainnet trong khoá.
 * Soạn chi tiết sau theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'smart-contracts-solidity',
    title: 'Smart Contracts with Solidity',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/smart-contracts-solidity.png?v=4',
    shortDescription: 'Write, test and secure smart contracts: Solidity from zero, Foundry fuzz and invariant tests, OpenZeppelin tokens, gas, upgradeable proxies, classic vulnerabilities learned defensively, audits, DeFi internals and a React dApp — local chains and testnets only.|||Viết, kiểm thử, bảo vệ smart contract: Solidity từ số 0, fuzz/invariant test bằng Foundry, token OpenZeppelin, gas, proxy nâng cấp, lỗ hổng kinh điển học để phòng thủ, audit, DeFi, dApp React — chỉ chain cục bộ và testnet.',
    description: 'Khoá cho lập trình viên đã học Blockchain Fundamentals (hoặc hiểu EVM, gas, giao dịch) và biết JavaScript/TypeScript. Solidity từ kiểu dữ liệu tới delegatecall và ABI; Foundry (forge, cast, anvil) với unit, fuzz, invariant và fork test; ERC-20/721/1155/4626 và OpenZeppelin; mô hình gas và tối ưu có chừng mực; mẫu thiết kế: checks-effects-interactions, pull payment, factory/clone, proxy transparent/UUPS/beacon, EIP-712, account abstraction ERC-4337; các lỗ hổng kinh điển (reentrancy, phân quyền sai, làm tròn, thao túng oracle, front-running, chữ ký phát lại, proxy chưa khởi tạo) — học bằng hợp đồng cố ý có lỗi trong lab để biết cách phòng; quy trình audit và công cụ (Slither, Echidna, Medusa, Halmos); AMM và cho vay từ bên trong; dApp React với wagmi/viem và backend Spring Boot với web3j; triển khai, xác minh mã nguồn, multisig, timelock, giám sát; dự án cuối khoá: chứng chỉ hoàn thành lab không chuyển nhượng cho LabFlow, kèm bộ test và báo cáo tự audit.',
    whatYouLearn: 'Viết hợp đồng Solidity rõ ràng và an toàn; dựng dự án Foundry với unit, fuzz và invariant test; dùng OpenZeppelin đúng cách cho token và phân quyền; đo và giảm gas mà không đánh đổi an toàn; thiết kế hợp đồng nâng cấp được không đụng storage; ký và kiểm chữ ký EIP-712; nhận diện và vá các lỗ hổng kinh điển; chạy Slither và fuzzer, viết một finding đúng chuẩn audit; giải thích AMM và cơ chế thanh lý; dựng dApp React nối ví; triển khai lên testnet, xác minh mã nguồn và chuyển quyền cho multisig.',
    requirements: 'Đã học Blockchain Fundamentals (blockchain-fundamentals), đặc biệt Ch5 (EVM, gas) và Ch10 (an toàn, pháp lý). JavaScript/TypeScript cơ bản. Nên biết React (khoá React) cho Chương 10 và có tư duy bảo mật từ khoá Web Security. Không cần tiền thật — mọi lab trên chain cục bộ và testnet.',
    documentsNote: 'Tài liệu chính: docs.soliditylang.org • Foundry Book (book.getfoundry.sh) • hardhat.org/docs • docs.openzeppelin.com/contracts • eips.ethereum.org (ERC-20, 721, 1155, 4626, 2612, 712, 1167, 1967, 1822, 7201, 4337) • ethereum.org/developers • viem.sh và wagmi.sh • docs.web3j.io • github.com/crytic/slither và Echidna (Trail of Bits) • Smart Contract Security Verification Standard (SCSVS) • Ethernaut (OpenZeppelin) và Damn Vulnerable DeFi — chỉ chạy cục bộ/testnet • Uniswap v2 whitepaper • Cyfrin Updraft (miễn phí).',
  },
  sections: khung('sol', [
    ['Section 0 — Code that holds money and cannot be patched', 'Mục 0 — Code giữ tiền và không vá được', 'Smart contract là gì, những vụ mất tiền kinh điển, quy tắc an toàn khi học, và dựng môi trường.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Smart contracts in everyday words, their history, and the incidents that defined the field', 'Bắt đầu tại đây (1/2) — Smart contract bằng lời đời thường, lịch sử, và những sự cố định hình nghề này', 'Máy bán hàng tự động của Nick Szabo (1994) · Solidity đề xuất năm 2014, bản 0.8 (2020) tự kiểm tràn số · The DAO (06/2016) mất khoảng 3,6 triệu ETH vì reentrancy · Ví multisig Parity: bị rút (07/2017) rồi bị đóng băng vĩnh viễn (11/2017) · Euler Finance (03/2023) · Code bất biến nghĩa là lỗi cũng bất biến'],
      ['bat-dau-lo-trinh', 'Start here (2/2) — What you can do after this course, the jobs, and where it sits in the path', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, các nghề, và vị trí khoá trong lộ trình', 'Smart contract developer, auditor, audit contest, bug bounty có luật chơi · Lộ trình: Blockchain Fundamentals → khoá này → audit chuyên sâu · Chuỗi LabFlow: chứng chỉ hoàn thành lab on-chain (tuỳ chọn) · Cách học: đọc code người giỏi, viết test trước'],
      ['neu-da-hoc', 'If you took Blockchain Fundamentals: EVM, gas, accounts and token concepts in one page', 'Nếu đã học Blockchain Fundamentals: EVM, gas, tài khoản và khái niệm token trong một trang', 'Trỏ /courses/blockchain-fundamentals Ch5–6 · storage/memory/calldata đã biết · Ở đây: viết, kiểm thử và bảo vệ hợp đồng'],
      ['an-toan-phap-ly', 'Lab rules and ethics: local chains and testnets only, intentionally vulnerable contracts, responsible disclosure', 'Quy tắc lab và đạo đức: chỉ chain cục bộ và testnet, chỉ hợp đồng cố ý có lỗi, công bố có trách nhiệm', 'Không triển khai lên mainnet trong khoá · Không thử khai thác hợp đồng đang chạy của người khác · Ethernaut, Damn Vulnerable DeFi chạy cục bộ · Tìm thấy lỗi thật ⇒ báo qua chương trình bug bounty chính thức · Pháp lý: trỏ /courses/blockchain-fundamentals Ch10'],
      ['cai-dat', 'Setting up: Foundry (forge, cast, anvil, chisel), Hardhat, VS Code, Remix and viem', 'Dựng môi trường: Foundry (forge, cast, anvil, chisel), Hardhat, VS Code, Remix và viem', 'foundryup · Cấu trúc dự án forge init · Extension Solidity cho VS Code · Remix để thử nhanh · Hardhat cho người quen JavaScript'],
    ]],
    ['Chapter 1 — Solidity fundamentals', 'Chương 1 — Solidity căn bản', 'Ngôn ngữ từ con số 0: kiểu, hàm, sự kiện và lỗi.', [
      ['cau-truc', 'Anatomy of a contract: license, pragma, state variables, constructor', 'Giải phẫu một hợp đồng: license, pragma, biến trạng thái, constructor', 'SPDX license · Ghim phiên bản trình biên dịch · Hợp đồng đầu tiên: bộ đếm · Biên dịch và triển khai lên Anvil'],
      ['kieu-du-lieu', 'Value and reference types: integers, address, bytes, string, arrays, structs, mappings', 'Kiểu giá trị và kiểu tham chiếu: số nguyên, address, bytes, string, mảng, struct, mapping', 'uint256 và kích thước · address vs address payable · mapping không duyệt được · enum'],
      ['vi-tri-du-lieu', 'Data locations: storage, memory and calldata — and copy vs reference', 'Vị trí dữ liệu: storage, memory và calldata — sao chép hay tham chiếu', 'Gán storage sang memory là sao chép · Con trỏ storage · calldata chỉ đọc và rẻ'],
      ['ham', 'Functions: visibility, view/pure, payable and modifiers', 'Hàm: phạm vi truy cập, view/pure, payable và modifier', 'public/external/internal/private · Hàm nhận ETH · Modifier và thứ tự chạy · Private không có nghĩa là bí mật'],
      ['event-loi', 'Events and errors: emit, require, revert and custom errors', 'Event và lỗi: emit, require, revert và custom error', 'Event là log rẻ cho bên ngoài đọc · indexed · Custom error tiết kiệm gas · Revert hoàn tác toàn bộ'],
    ]],
    ['Chapter 2 — Advanced Solidity', 'Chương 2 — Solidity nâng cao', 'Kế thừa, gọi hợp đồng khác, ABI và những góc khuất của ngôn ngữ.', [
      ['ke-thua', 'Inheritance, interfaces, abstract contracts and libraries', 'Kế thừa, interface, hợp đồng trừu tượng và library', 'Đa kế thừa và tuyến tính hoá C3 · virtual/override · Interface để gọi hợp đồng khác · Library nội tuyến vs liên kết'],
      ['nhan-gui-eth', 'Receiving and sending ether: receive, fallback, call vs transfer vs send', 'Nhận và gửi ether: receive, fallback, call vs transfer vs send', 'Vì sao transfer với 2300 gas không còn được khuyên dùng · Kiểm giá trị trả về của call · Hợp đồng từ chối nhận ETH'],
      ['low-level', 'Low-level calls: call, staticcall, delegatecall — and why delegatecall is dangerous', 'Lời gọi mức thấp: call, staticcall, delegatecall — và vì sao delegatecall nguy hiểm', 'Ngữ cảnh storage của delegatecall · Nền tảng của proxy · Bài học Parity'],
      ['abi', 'ABI encoding, function selectors and abi.encode vs abi.encodePacked', 'Mã hoá ABI, function selector và abi.encode vs abi.encodePacked', 'Bốn byte đầu của keccak256 · Va chạm băm khi encodePacked nhiều tham số động · Giải mã calldata bằng cast'],
      ['so-hoc', 'Arithmetic: checked math in 0.8, unchecked blocks, fixed-point and rounding', 'Số học: kiểm tràn ở 0.8, khối unchecked, số thực điểm cố định và làm tròn', 'Không có số thực · Nhân trước chia sau · Làm tròn về phía có lợi cho giao thức · Thư viện mulDiv'],
      ['tinh-nang-moi', 'immutable, constant, transient storage (EIP-1153) and recent compiler features', 'immutable, constant, transient storage (EIP-1153) và tính năng mới của trình biên dịch', 'Hằng số không tốn storage · Transient storage từ Cancun (2024) · Theo dõi release note Solidity'],
    ]],
    ['Chapter 3 — Testing with Foundry', 'Chương 3 — Kiểm thử với Foundry', 'Test là lưới an toàn duy nhất của code không vá được.', [
      ['forge-test', 'forge test: assertions, setUp, naming and traces', 'forge test: assertion, setUp, đặt tên và trace', 'Test viết bằng Solidity · Mức verbosity -vvvv · Đọc trace khi test đỏ · Trỏ /courses/testing cho tư duy kiểm thử'],
      ['cheatcode', 'Cheatcodes: prank, deal, warp, roll, expectRevert, expectEmit', 'Cheatcode: prank, deal, warp, roll, expectRevert, expectEmit', 'Giả làm người gọi khác · Cấp số dư · Tua thời gian · Kiểm lỗi và event'],
      ['fuzz', 'Fuzz testing: properties instead of examples', 'Fuzz testing: kiểm tính chất thay vì kiểm ví dụ', 'Tham số ngẫu nhiên · bound và assume · Tìm ca biên tự động · Số lượt chạy'],
      ['invariant', 'Invariant testing with handlers', 'Kiểm thử bất biến với handler', 'Bất biến: tổng cung bằng tổng số dư · Handler giới hạn hành động hợp lệ · Ghost variable · Đọc chuỗi gọi gây lỗi'],
      ['fork-coverage', 'Fork tests, coverage and gas snapshots', 'Fork test, độ phủ và ảnh chụp gas', 'Chạy test trên bản sao trạng thái chain trong máy (chỉ đọc, cục bộ) · forge coverage · forge snapshot so sánh gas giữa hai lần'],
      ['hardhat', 'The same tests in Hardhat with TypeScript, for comparison', 'Cùng bộ test trong Hardhat với TypeScript, để đối chiếu', 'Khi nào đội chọn Hardhat · viem trong Hardhat · Plugin hữu ích'],
    ]],
    ['Chapter 4 — Token standards and OpenZeppelin', 'Chương 4 — Chuẩn token và OpenZeppelin', 'Không tự viết lại thứ đã được kiểm toán — nhưng phải hiểu nó.', [
      ['erc20', 'ERC-20 in depth: approve/allowance pitfalls and permit (EIP-2612)', 'ERC-20 chuyên sâu: bẫy approve/allowance và permit (EIP-2612)', 'Đọc mã OpenZeppelin ERC20 · Approve vô hạn và rủi ro · Permit ký ngoài chuỗi · Token không chuẩn (không trả bool) và SafeERC20'],
      ['erc721-1155', 'ERC-721 and ERC-1155: ownership, metadata and safe transfers', 'ERC-721 và ERC-1155: sở hữu, metadata và chuyển an toàn', 'tokenURI và nơi lưu metadata · onERC721Received và reentrancy qua callback · Batch trong 1155'],
      ['erc4626', 'ERC-4626 tokenised vaults and the inflation attack (defensively)', 'Vault token hoá ERC-4626 và tấn công lạm phát (góc phòng thủ)', 'Share và asset · Làm tròn khi gửi/rút · Phòng thủ bằng virtual shares của OpenZeppelin'],
      ['phan-quyen', 'Access control: Ownable, Ownable2Step, AccessControl and roles', 'Phân quyền: Ownable, Ownable2Step, AccessControl và vai trò', 'Chuyển quyền hai bước · Vai trò tối thiểu · Ai giữ quyền admin trên production'],
      ['khan-cap', 'Pausable, rate limits and emergency design', 'Pausable, giới hạn tần suất và thiết kế khẩn cấp', 'Nút dừng và rủi ro tập trung · Giới hạn rút theo thời gian · Công bố rõ quyền admin cho người dùng'],
    ]],
    ['Chapter 5 — Gas and optimisation', 'Chương 5 — Gas và tối ưu', 'Hiểu giá từng thao tác, tối ưu có chừng mực, không đánh đổi an toàn.', [
      ['mo-hinh-gas', 'The gas cost model: SSTORE, cold vs warm access (EIP-2929), refunds', 'Mô hình giá gas: SSTORE, truy cập lạnh và ấm (EIP-2929), hoàn gas', 'Ghi storage đắt nhất · Lần đầu chạm vào đắt hơn · Đo bằng forge snapshot'],
      ['dong-goi', 'Storage packing, calldata, events vs storage', 'Đóng gói storage, calldata, event thay cho storage', 'Xếp biến vào cùng slot · Đọc slot bằng cast storage · Dữ liệu chỉ cần cho bên ngoài thì phát event'],
      ['vong-lap-dos', 'Loops, unbounded arrays and gas-limit denial of service', 'Vòng lặp, mảng không giới hạn và từ chối dịch vụ vì giới hạn gas', 'Mảng lớn dần làm hàm chết · Phân trang trên chuỗi · Pull thay vì push'],
      ['optimizer', 'The optimiser, via-IR, and when not to optimise', 'Optimizer, via-IR, và khi nào KHÔNG nên tối ưu', 'Số runs · Assembly chỉ khi thật cần · Code dễ audit đáng giá hơn vài nghìn gas'],
    ]],
    ['Chapter 6 — Contract design patterns', 'Chương 6 — Mẫu thiết kế hợp đồng', 'Những mẫu đã được kiểm chứng: an toàn khi gọi ra ngoài, nâng cấp, chữ ký và tài khoản thông minh.', [
      ['cei-pull', 'Checks-effects-interactions, pull over push, and reentrancy guards', 'Checks-effects-interactions, pull thay vì push, và khoá chống reentrancy', 'Thứ tự viết hàm an toàn · ReentrancyGuard (kể cả bản transient) · Cho người nhận tự rút'],
      ['factory-clone', 'Factories and minimal proxies (EIP-1167 clones), CREATE2 addresses', 'Factory và minimal proxy (clone EIP-1167), địa chỉ CREATE2', 'Triển khai nhiều bản rẻ · Biết trước địa chỉ · Khởi tạo thay constructor'],
      ['proxy', 'Upgradeable proxies: transparent, UUPS (EIP-1822) and beacon, with EIP-1967 slots', 'Proxy nâng cấp được: transparent, UUPS (EIP-1822) và beacon, với slot EIP-1967', 'Tách logic và storage · Ai được nâng cấp · Initializer và _disableInitializers · Nâng cấp là một quyền lực cần timelock'],
      ['storage-layout', 'Storage layout and collisions: ERC-7201 namespaced storage and upgrade checks', 'Bố cục storage và va chạm: storage theo namespace ERC-7201 và kiểm tra khi nâng cấp', 'Thêm biến sai chỗ là hỏng dữ liệu · OpenZeppelin Upgrades plugin kiểm bố cục · Diamond (EIP-2535) lướt qua'],
      ['chu-ky', 'Off-chain signatures: EIP-712 typed data, ecrecover pitfalls, nonces and deadlines', 'Chữ ký ngoài chuỗi: dữ liệu có kiểu EIP-712, bẫy ecrecover, nonce và hạn dùng', 'Domain separator chống phát lại chéo chain · ecrecover trả địa chỉ 0 · Chữ ký dễ biến dạng và thư viện ECDSA · Trỏ /courses/applied-cryptography 5.5'],
      ['aa', 'Account abstraction: ERC-4337, smart accounts and paymasters', 'Account abstraction: ERC-4337, tài khoản thông minh và paymaster', 'UserOperation và bundler · Trả phí hộ người dùng · Khôi phục tài khoản xã hội · EIP-7702 (khái niệm)'],
    ]],
    ['Chapter 7 — Classic vulnerabilities, learned defensively', 'Chương 7 — Lỗ hổng kinh điển, học để phòng thủ', 'Mỗi lỗi: vì sao xảy ra, sự cố công khai liên quan, tái hiện trên hợp đồng cố ý có lỗi trong lab, và cách vá kèm test hồi quy.', [
      ['reentrancy', 'Reentrancy: single-function, cross-function and read-only', 'Reentrancy: một hàm, chéo hàm và chỉ đọc', 'The DAO (2016) nhìn từ code · Tái hiện trên hợp đồng lab trên Anvil · Vá bằng CEI và guard · Test hồi quy'],
      ['phan-quyen-sai', 'Broken access control and unprotected initialisers', 'Phân quyền hỏng và hàm khởi tạo không được bảo vệ', 'Bài học ví Parity (2017) · Proxy chưa khởi tạo · tx.origin để xác thực là sai · Checklist quyền mỗi hàm'],
      ['lam-tron', 'Precision loss, rounding direction and accounting errors', 'Mất độ chính xác, hướng làm tròn và lỗi sổ sách', 'Chia trước nhân sau · Làm tròn có lợi cho người dùng là lỗ cho giao thức · Fuzz tìm sai lệch'],
      ['oracle-flashloan', 'Price-oracle manipulation and flash loans: why spot prices are unsafe', 'Thao túng oracle giá và flash loan: vì sao giá tức thời không an toàn', 'Flash loan là gì · Giá từ một pool dễ bị đẩy trong một giao dịch · Phòng thủ: TWAP, oracle phi tập trung, giới hạn lệch giá · Chỉ mô phỏng trên Anvil'],
      ['mev', 'Front-running and MEV: sandwiching, commit-reveal and slippage limits', 'Front-running và MEV: kẹp giao dịch, commit-reveal và giới hạn trượt giá', 'Mempool công khai · Thứ tự giao dịch là thứ có giá · Commit-reveal · minAmountOut và hạn chót'],
      ['phat-lai-dos', 'Signature replay, denial of service and unchecked external calls', 'Phát lại chữ ký, từ chối dịch vụ và lời gọi ngoài không kiểm kết quả', 'Thiếu nonce/chainId · Người nhận cố tình revert làm kẹt vòng lặp · Kiểm giá trị trả về · Luyện thêm trên Ethernaut và Damn Vulnerable DeFi cục bộ'],
    ]],
    ['Chapter 8 — Auditing and security tooling', 'Chương 8 — Audit và công cụ bảo mật', 'Quy trình audit chuyên nghiệp và bộ công cụ tự động.', [
      ['quy-trinh', 'The audit process: scoping, threat modelling, manual review and severity', 'Quy trình audit: xác định phạm vi, mô hình đe doạ, review thủ công và mức nghiêm trọng', 'Đọc tài liệu trước code · Liệt kê tác nhân và tài sản · Ma trận tác động × khả năng · Trỏ /courses/threat-modeling'],
      ['slither', 'Static analysis with Slither and Aderyn', 'Phân tích tĩnh với Slither và Aderyn', 'Chạy trên dự án Foundry · Phân loại cảnh báo đúng/sai · Đưa vào CI'],
      ['fuzzer', 'Property-based fuzzing with Echidna and Medusa', 'Fuzz theo tính chất với Echidna và Medusa', 'Viết property · So với fuzz của Foundry · Chạy dài trên máy nhà'],
      ['formal', 'Formal and symbolic verification: SMTChecker, Halmos, Certora at a glance', 'Kiểm chứng hình thức và ký hiệu: SMTChecker, Halmos, Certora lướt qua', 'Chứng minh cho mọi đầu vào · Giới hạn và chi phí · Khi nào đáng dùng'],
      ['bao-cao', 'Writing a finding: title, impact, proof of concept, recommendation', 'Viết một finding: tiêu đề, tác động, PoC, khuyến nghị', 'PoC là một test Foundry trên lab · Mẫu báo cáo công khai của các hãng audit · Viết để đội dev sửa được'],
      ['contest-bounty', 'Audit contests and bug bounties: Code4rena, Sherlock, Cantina, Immunefi — rules and ethics', 'Audit contest và bug bounty: Code4rena, Sherlock, Cantina, Immunefi — luật chơi và đạo đức', 'Chỉ trong phạm vi chương trình công bố · Không thử trên mainnet · Công bố có trách nhiệm · Xây danh mục từ kết quả contest'],
    ]],
    ['Chapter 9 — DeFi from the inside', 'Chương 9 — DeFi từ bên trong', 'Toán và code của sàn AMM, cho vay và oracle — tự dựng bản thu nhỏ trên Anvil.', [
      ['amm', 'Automated market makers: Uniswap v2 constant product x·y=k', 'Sàn tạo lập thị trường tự động: tích hằng số x·y=k của Uniswap v2', 'Toán định giá và trượt giá · Phí và LP token · Tổn thất tạm thời · Lab: tự viết mini-AMM trên Anvil'],
      ['v3', 'Concentrated liquidity (Uniswap v3) at a conceptual level', 'Thanh khoản tập trung (Uniswap v3) ở mức khái niệm', 'Khoảng giá và tick · LP như một NFT · Vì sao code phức tạp hơn nhiều'],
      ['cho-vay', 'Lending protocols: collateral, health factor, liquidation and interest-rate models', 'Giao thức cho vay: tài sản thế chấp, health factor, thanh lý và mô hình lãi suất', 'Aave/Compound ở mức cơ chế · Thanh lý giữ giao thức không vỡ nợ · Lãi theo mức sử dụng'],
      ['oracle-thiet-ke', 'Oracle design in practice: Chainlink feeds, TWAP and staleness checks', 'Thiết kế oracle thực tế: Chainlink feed, TWAP và kiểm dữ liệu cũ', 'Kiểm updatedAt · Giới hạn lệch · Phương án khi oracle chết'],
      ['rui-ro-ghep', 'Composability risk: when protocols build on each other', 'Rủi ro ghép nối: khi các giao thức dựa lên nhau', 'Một mắt xích hỏng kéo theo cả chuỗi · Token lạ (fee-on-transfer, rebasing) · Đọc báo cáo sự cố công khai'],
    ]],
    ['Chapter 10 — Full-stack dApps', 'Chương 10 — dApp full-stack', 'Nối hợp đồng với giao diện React và backend Spring Boot.', [
      ['vi-ket-noi', 'Wallet connection: EIP-1193, wagmi + viem, and connector kits', 'Kết nối ví: EIP-1193, wagmi + viem, và bộ kết nối có sẵn', 'Provider của ví · Đổi mạng, đổi tài khoản · RainbowKit/ConnectKit · Trỏ /courses/react'],
      ['ux-giao-dich', 'Transaction UX: pending states, confirmations, reverts and reorgs', 'Trải nghiệm giao dịch: trạng thái chờ, xác nhận, revert và reorg', 'Mô phỏng trước khi gửi · Giải mã lỗi custom error · Hiển thị cho người không rành blockchain'],
      ['index-event', 'Indexing events for the UI: Ponder or The Graph, or your own indexer into PostgreSQL', 'Đánh chỉ mục event cho giao diện: Ponder hay The Graph, hoặc tự đánh chỉ mục vào PostgreSQL', 'Không đọc lịch sử trực tiếp từ RPC mỗi lần · Xử lý reorg · Trỏ /courses/blockchain-fundamentals 9.2'],
      ['backend-web3j', 'A Spring Boot backend with web3j: generated wrappers, signing service, key management', 'Backend Spring Boot với web3j: wrapper sinh tự động, dịch vụ ký, quản lý khoá', 'Sinh lớp Java từ ABI · Khoá ký không nằm trong code · Hàng đợi giao dịch và nonce · Trỏ /courses/applied-cryptography Ch9'],
      ['luu-tru-phi-tap-trung', 'Off-chain storage: IPFS, pinning and Arweave', 'Lưu trữ ngoài chuỗi: IPFS, pinning và Arweave', 'Định danh theo nội dung · Ai giữ file sống · Chỉ lưu băm trên chuỗi'],
    ]],
    ['Chapter 11 — Deployment and operations', 'Chương 11 — Triển khai và vận hành', 'Đưa hợp đồng lên testnet đúng quy trình, trao quyền an toàn và theo dõi sau khi chạy.', [
      ['script-deploy', 'Deployment scripts with forge script, on Anvil then Sepolia', 'Script triển khai bằng forge script, trên Anvil rồi Sepolia', 'Mô phỏng trước khi phát · Biến môi trường và khoá thử · Ghi lại địa chỉ đã triển khai'],
      ['xac-minh', 'Verifying source code on block explorers and Sourcify', 'Xác minh mã nguồn trên block explorer và Sourcify', 'Vì sao người dùng cần thấy code · forge verify-contract · Khớp cài đặt trình biên dịch'],
      ['khoa-quyen', 'Deployer keys, multisig (Safe) and timelocks', 'Khoá triển khai, multisig (Safe) và timelock', 'Ví cứng cho khoá triển khai · Chuyển quyền admin cho multisig · Timelock cho nâng cấp · Không để một người giữ tất cả'],
      ['giam-sat', 'Monitoring and incident response for contracts', 'Giám sát và ứng phó sự cố cho hợp đồng', 'Theo dõi event và giao dịch bất thường · Cảnh báo tự động (Tenderly, Forta, OpenZeppelin Monitor) · Kịch bản tạm dừng và công bố · Trỏ /courses/incident-response'],
      ['l2', 'Deploying on layer 2: what changes on rollups', 'Triển khai trên layer 2: điều gì khác trên rollup', 'Opcode và giá gas khác · Cầu nối và thời gian rút · Kiểm tài liệu chính thức từng mạng'],
    ]],
    ['Chapter 12 — Interviews, portfolio and further learning', 'Chương 12 — Phỏng vấn, danh mục và học tiếp', 'Câu hỏi phỏng vấn, xây danh mục bằng việc thật, và nguồn học đáng tin.', [
      ['cau-hoi', 'Smart contract interview questions with reasoning', 'Câu hỏi phỏng vấn smart contract kèm lập luận', 'storage vs memory · delegatecall · reentrancy và cách phòng · Proxy và bố cục storage · Đọc một đoạn code tìm lỗi'],
      ['danh-muc', 'Building a portfolio: open-source contributions, audit contest results, write-ups', 'Xây danh mục: đóng góp mã nguồn mở, kết quả audit contest, bài phân tích', 'Không có chứng chỉ bắt buộc của ngành · GitHub có test và báo cáo · Viết lời giải Ethernaut cục bộ'],
      ['hoc-tiep', 'Where to go next: Cyfrin Updraft, Secureum, public audit reports, Yul and the EVM in depth', 'Học tiếp ở đâu: Cyfrin Updraft, Secureum, báo cáo audit công khai, Yul và EVM chuyên sâu', 'Nguồn miễn phí đáng tin · Đọc báo cáo của các hãng audit · Ngôn ngữ khác: Vyper, Rust cho Solana (giới thiệu)'],
    ]],
    ['Chapter 13 — Capstone: on-chain lab completion certificates for LabFlow AI', 'Chương 13 — Dự án cuối khoá: chứng chỉ hoàn thành lab on-chain cho LabFlow AI', 'Chứng chỉ không chuyển nhượng và sổ đăng ký dấu băm, có bộ test đầy đủ, dApp, backend và báo cáo tự audit — chỉ trên Anvil và Sepolia.', [
      ['thiet-ke', 'Design: a soulbound certificate (ERC-721 + ERC-5192), a hash registry and roles', 'Thiết kế: chứng chỉ không chuyển nhượng (ERC-721 + ERC-5192), sổ đăng ký dấu băm và vai trò', 'Ai được cấp, ai được thu hồi · Không dữ liệu cá nhân trên chuỗi · Nâng cấp hay bất biến — ghi ADR · Mô hình đe doạ'],
      ['viet-test', 'Implementation with OpenZeppelin, plus unit, fuzz and invariant tests', 'Cài đặt với OpenZeppelin, kèm unit, fuzz và invariant test', 'Độ phủ mục tiêu · Bất biến: một sinh viên một chứng chỉ mỗi lab · Gas snapshot'],
      ['tu-audit', 'Self-audit: Slither, a fuzzing campaign and a written report', 'Tự audit: Slither, một đợt fuzz và báo cáo viết', 'Danh sách finding theo mức nghiêm trọng · Sửa và test hồi quy · Mời bạn cùng lớp review chéo'],
      ['dapp', 'dApp and backend: React verification page and Spring Boot issuing service with web3j', 'dApp và backend: trang kiểm chứng React và dịch vụ cấp chứng chỉ Spring Boot với web3j', 'Sinh viên nối ví thử để xem chứng chỉ · Giảng viên cấp qua backend · Trang công khai kiểm một chứng chỉ'],
      ['trien-khai-bao-ve', 'Deploying to Sepolia with a multisig owner, verification, and the interview story', 'Triển khai lên Sepolia với chủ sở hữu multisig, xác minh mã, và câu chuyện phỏng vấn', 'Chỉ testnet · Xác minh mã nguồn · Checklist cả khoá · Trình bày cả lý do chọn và không chọn blockchain'],
    ]],
  ]),
};
