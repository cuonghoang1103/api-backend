/**
 * Curated YouTube track for CEA201 — Computer Organization and Architecture.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/computer-organization-and-architecture.mjs
 */
export default {
  courseSlug: 'computer-organization-and-architecture',
  defaultVideoTrack: 'YT',
  lessons: {
    "cea201-gioi-thieu": { yt: "O5nskjZ_GoI", credit: "CrashCourse — Early Computing: Crash Course Computer Science #1" },
    "cea201-1-1-org-vs-arch": { yt: "Ol8D69VKX2k", credit: "Neso Academy — Introduction to Computer Organization and Architecture (COA)" },
    "cea201-2-1-history-moore": { yt: "6-tKOHICqrI", credit: "CrashCourse — Integrated Circuits & Moore's Law: Crash Course Computer Science #17" },
    "cea201-2-2-performance-amdahl": { yt: "2dYV_lADfFI", credit: "Engineering Funda — Amdahl's Law in COA: Basics, Proof, and CPU Performance Explained" },
    "cea201-3-1-components-cycle": { yt: "FZGugFqdr60", credit: "CrashCourse — The Central Processing Unit (CPU): Crash Course Computer Science #7" },
    "cea201-3-2-bus": { yt: "xBYhHC8_A6o", credit: "Gate Smashers — L-1.4:Types of Buses (Address, Data and Control) in Computer Organization and Architecture" },
    "cea201-4-1-locality": { yt: "E6QATWzjWZU", credit: "Gate Smashers — L-3.11: Locality of Reference in Cache Memory | Spatial Vs Temporal Locality | Computer Organization" },
    "cea201-4-2-mapping": { yt: "m1dA7D6c3C0", credit: "Gate Smashers — L-3.5: What is Cache Mapping || Cache Mapping techniques || Computer Organisation and Architecture" },
    "cea201-5-1-ram-rom": { yt: "19t0Uw3nkgM", credit: "LS Academy for Technical Education  — RAM,ROM & their types(SRAM,DRAM,PROM,EPROM,EEPROM,Flash memory) |COA Lecture series" },
    "cea201-5-2-error-correction": { yt: "wbH2VxzmoZk", credit: "Neso Academy — Hamming Code | Error Correction" },
    "cea201-6-1-magnetic-disk": { yt: "e8tpapnaJ44", credit: "Chirag Bhalodia — Magnetic Disk Structure | Hard Disk Structure | Explain working of hard disk using animation" },
    "cea201-6-2-raid-ssd": { yt: "-6sA9nHlZDc", credit: "Gate Smashers — Lec-126: What is RAID? RAID 0, RAID 1, RAID 4, RAID 5, RAID 6, Nested RAID 10 Explained" },
    "cea201-7-1-io-techniques": { yt: "E82x-cug9YE", credit: "Dr. Sapna Katiyar — Modes of Transfer | Programmed,Interrupt-initiated I/O&DMA || Computer Organization and Architecture" },
    "cea201-8-1-os-support": { yt: "o2_iCzS9-ZQ", credit: "Gate Smashers — L-5.19: Virtual Memory | Page fault | Significance of virtual memory | Operating System" },
    "cea201-9-1-boolean-gates": { yt: "gI-qXk7XojA", credit: "CrashCourse — Boolean Logic & Logic Gates: Crash Course Computer Science #3" },
    "cea201-9-2-circuits": { yt: "fLN1YOmuAr8", credit: "ALL ABOUT ELECTRONICS — Introduction to Sequential Circuits | Digital Electronics" },
    "cea201-10-1-instruction-anatomy": { yt: "jTa0w-MxFJE", credit: "Learn Computer Science — What Is Instruction Format ? | Addressing Mode, OPCODE , OPERAND Explained" },
    "cea201-11-1-addressing-modes": { yt: "_CH4cm5PhK8", credit: "Gate Smashers — L-2.1: What is Addressing Mode | Various Types of Addressing Modes | COA" },
    "cea201-12-1-registers-cycle": { yt: "2mowjC3dCqk", credit: "Gate Smashers — L-1.3:Various General Purpose Registers in Computer Organization and Architecture" },
    "cea201-12-2-pipelining": { yt: "nv0yAm5gc-E", credit: "Gate Smashers — L-4.2: Pipelining Introduction and structure | Computer Organisation" },
    "cea201-13-1-risc-cisc": { yt: "ZW1gb3h-f9k", credit: "Gate Smashers — L-2.13: RISC vs CISC | Computer Organization & Architecture" },
    "cea201-14-1-ilp-superscalar": { yt: "Ut8wY6qtie4", credit: "Tech CS&IT — Instruction Level Parallelism | ILP Techniques | Superscalar Technique | Computer Architecture" },
    "cea201-15-1-multicore": { yt: "r_ZE1XVT8Ao", credit: "Neso Academy — Cache Coherence Problem & Cache Coherency Protocols" },
    "cea201-n1-1-marie": { yt: "mkXdChZ1D2Y", credit: "THE IT CHANNEL — Programming with MARIE Simulator: Take inputs, compute sum, and display result" },
    "cea201-n2-1-branch-prediction": { yt: "nczJ58WvtYo", credit: "Computerphile — How Branch Prediction Works in CPUs - Computerphile" },
    "cea201-n3-1-spectre-meltdown": { yt: "I5mRwzVvFGE", credit: "Computerphile — Spectre & Meltdown - Computerphile" },

    /* ---- Bổ sung: các bài "Slide by slide" + phần mở đầu/ôn thi ---- */
    // Section 0 — Introduction & Study Guide
    "cea201-chuan-dau-ra": { yt: "aa6YISbAJEA", credit: "Branch Education — The Incredible Evolution of Computers" },
    "cea201-tai-lieu": { yt: "1Zo8ZE0r_bo", credit: "THE IT CHANNEL — Architecture and Programming with Marie Simulator - A Short Tutorial (part 1/3)!" },
    // Chapter 1 — Introduction
    "cea201-1-0a-slides-organization-architecture": { yt: "j8NnE1YeSN0", credit: "Gate Smashers — L-1.2: Von Neumann's Architecture | Stored Memory Concept in Computer Architecture" },
    "cea201-1-0b-slides-moore-intel-arm": { yt: "dX9CGRZwD-w", credit: "Branch Education — How are Microchips Made? 🖥️🛠️ CPU Manufacturing Process Steps" },
    "cea201-1-2-structure-function": { yt: "d86ws7mQYIg", credit: "Branch Education — How does Computer Hardware Work?  💻🛠🔬  [3D Animated Teardown]" },
    // Chapter 2 — Computer Evolution & Performance
    "cea201-2-0-slides-hieu-nang-amdahl": { yt: "5ayaVunXFUY", credit: "Engineering Funda — CPU Performance Parameters in COA: Average CPI, MIPS, and Execution Time | COA" },
    // Chapter 3 — Top-Level View & Interconnection
    "cea201-3-0a-slides-chu-trinh-lenh-ngat": { yt: "dXdoim96v5A", credit: "Ben Eater — 8-bit CPU control logic: Part 1" },
    "cea201-3-0b-slides-bus-pcie-qpi": { yt: "nJyH0XEoPEs", credit: "AKIO TV — PCI Express lanes explained (AKIO TV)" },
    // Chapter 4 — Cache Memory
    "cea201-4-0a-slides-phan-cap-bo-nho-locality": { yt: "7yrK_9PderQ", credit: "BitLemon — Cache Hierarchy: How Modern CPU Caches Are Organized (L1, L2 and L3)" },
    "cea201-4-0b-slides-cache-anh-xa-truc-tiep": { yt: "V_QS1HzJ8Bc", credit: "Neso Academy — Direct Memory Mapping" },
    "cea201-4-0c-slides-set-associative-thay-the-ghi": { yt: "KhAh6thw_TI", credit: "Neso Academy — Set Associative Mapping" },
    // Chapter 5 — Internal Memory
    "cea201-5-0a-slides-dram-sram-rom": { yt: "7J7X7aZvMXQ", credit: "Branch Education — How does Computer Memory Work? 💻🛠" },
    "cea201-5-0b-slides-sua-loi-ddr-edram-cong-nghe-moi": { yt: "OokKoNO75QE", credit: "Actually Hardcore Overclocking — How double data rate DRAM works" },
    // Chapter 6 — External Memory
    "cea201-6-0a-slides-dia-tu-va-raid-0-1-2": { yt: "wtdnatmVdIg", credit: "Branch Education — How do Hard Disk Drives Work?  💻💿🛠" },
    "cea201-6-0b-slides-raid-ssd-quang-bang-tu": { yt: "5Mh3o886qpg", credit: "Branch Education — How do SSDs Work? | How does your Smartphone store data? |  Insanely Complex Nanoscopic Structures!" },
    // Chapter 7 — Input/Output
    "cea201-7-0a-slides-module-io-programmed-ngat-dma": { yt: "tadUeiNe5-g", credit: "Core Dumped — How CPUs Interact with So Many Different Devices" },
    "cea201-7-0b-slides-dma-dca-kenh-io-chuan-ghep-noi": { yt: "s8RGHggL7ws", credit: "BitLemon — DMA Controller: How Peripheral Devices Transfer Data to RAM" },
    // Chapter 8 — Operating System Support
    "cea201-8-0a-slides-he-dieu-hanh-lap-lich": { yt: "O2tV9q6784k", credit: "Core Dumped — The Fancy Algorithms That Make Your Computer Feel Smoother" },
    "cea201-8-0b-slides-quan-ly-bo-nho-phan-trang-tlb-x86-arm": { yt: "Zmtxl7LZwjQ", credit: "Core Dumped — Why Can't Programs Access Each Other's Memory?" },
    // Chapter 9 — Digital Logic
    "cea201-9-0a-slides-dai-so-boole-mach-to-hop": { yt: "RO5alU6PpSU", credit: "The Organic Chemistry Tutor — Introduction to Karnaugh Maps - Combinational Logic Circuits, Functions, & Truth Tables" },
    "cea201-9-0b-slides-giai-ma-rom-cong-mach-tuan-tu": { yt: "wvJc9CZcvBc", credit: "Ben Eater — Learn how computers add numbers and build a 4 bit adder circuit" },
    // Chapter 10 — Instruction Sets: Characteristics
    "cea201-10-0a-slides-lenh-may-toan-hang-thao-tac": { yt: "WAO_W6Hpzyk", credit: "Gate Smashers — L-1.13: What is Instruction Format | Understand Computer Organisation with Simple Story" },
    "cea201-10-0b-slides-phep-toan-chuyen-dieu-khien-x86-arm": { yt: "u_-oQx_4jvo", credit: "Mxy — How Assembly Functions Work - The Stack Explained" },
    // Chapter 11 — Instruction Sets: Addressing Modes
    "cea201-11-0-slides-che-do-dia-chi-khuon-dang-lenh": { yt: "TGcjn8zMhfM", credit: "Computer Science Lessons — Processor Addressing Modes" },
    // Chapter 12 — Processor Structure & Function
    "cea201-12-0a-slides-to-chuc-cpu-thanh-ghi-pipeline": { yt: "vgPFzblBh7w", credit: "Intel Technology — Architecture All Access: Modern CPU Architecture Part 1 – Key Concepts | Intel Technology" },
    "cea201-12-0b-slides-re-nhanh-du-doan-to-chuc-cpu": { yt: "srlgaJgaxRE", credit: "Gate Smashers — L-4.6: What is Hazard in Pipelining | various types of Hazards | computer Architecture" },
    // Chapter 13 — RISC
    "cea201-13-0a-slides-risc-thong-ke-thanh-ghi": { yt: "PaeXsm5HGJs", credit: "Craig'n'Dave — 6. OCR A Level (H046-H446) SLR2 - 1.1 CISC vs RISC" },
    "cea201-13-0b-slides-dac-trung-risc-pipeline-tranh-luan": { yt: "8SemUimYUJ4", credit: "Sudhakar Atchala — RISC Pipeline In Computer Organization Architecture || Three-Segment Instruction Pipeline" },
    // Chapter 14 — ILP & Superscalar
    "cea201-14-0a-slides-superscalar-phu-thuoc-lenh-intel-core": { yt: "_qvOlL8nhN4", credit: "Computerphile — CPUs Are Out of Order - Computerphile" },
    "cea201-14-0b-slides-intel-core-va-arm-cortex": { yt: "o_WXTRS2qTY", credit: "Intel Technology — Architecture All Access: Modern CPU Architecture 2 - Microarchitecture Deep Dive | Intel Technology" },
    // Chapter 15 — Parallel Processing & Multicore
    "cea201-15-0a-slides-flynn-smp-nhat-quan-cache": { yt: "MJ-ettBDJqQ", credit: "Intermation — Intro to Parallelism with Flynn's Taxonomy" },
    "cea201-15-0b-slides-mesi-da-luong-cum-may-numa": { yt: "-p9tfMMu1PE", credit: "Wandida, EPFL — MESI Cache Coherence Protocol | Vasileios Trigonakis" },
    "cea201-15-0c-slides-da-loi-cache-va-khong-dong-nhat": { yt: "w1pTBzHu4bI", credit: "Onur Mutlu Lectures — Computer Architecture - Lecture 19b: Heterogeneous Multi-Core Systems (ETH Zürich, Fall 2018)" },
    // Practical Assembly Language with MARIE
    "cea201-asm-a-slides-hop-ngu-chi-thi-macro": { yt: "ZBOfeiRN3T8", credit: "Daniel Ross — Learn Assembly Programming - Instructions, Mnemonics, Operands, and Opcodes" },
    "cea201-asm-b-slides-trinh-dich-lien-ket-tai": { yt: "N2y6csonII4", credit: "EngMicroLectures — Compiling, assembling, and linking" },
    // Final Exam
    "cea201-final-exam-fe": { yt: "ZMSdU9DLbrU", credit: "Unify Study — Computer Organization and Architecture in One Class - Marathon |Computer Architecture Series - Day 3" },
  },
};
