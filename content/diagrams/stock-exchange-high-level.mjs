/**
 * Sơ đồ kiến trúc sàn giao dịch chứng khoán — dựng lại Figure 13.6 của
 * "System Design Interview Vol 2" để làm mẫu cho bộ dựng sơ đồ.
 *
 *   node scripts/gen-diagram.mjs --file ./content/diagrams/stock-exchange-high-level.mjs
 *
 * Đây là file DỮ LIỆU: sơ đồ mới chỉ cần thêm một file như thế này.
 *
 * Cạnh nối bằng NEO theo id hộp (`'om:left:+44'`) chứ không phải toạ độ trần,
 * nên xê dịch một hộp thì mọi mũi tên cắm vào nó tự đi theo. Hậu tố `:±n` dịch
 * dọc theo cạnh — chính là thứ cho phép xếp hai mũi tên ngược chiều song song
 * giữa cùng một cặp hộp mà không đè lên nhau (③ đi ra ở +0, ⑫ quay lại ở +44).
 */
export default {
  title: 'Stock Exchange — High-level design',
  canvas: { w: 1560, h: 900 },

  boundaries: [{ x: 330, y: 34, w: 1200, h: 800, label: 'Stock Exchange' }],

  boxes: [
    { id: 'user', x: 20,  y: 404, w: 92,  h: 60,  shape: 'monitor', label: '' },
    // Chú thích dài hơn bề rộng hộp ⇒ phải dùng subOutside, đặt bên trong sẽ tràn viền.
    { id: 'broker', x: 150, y: 400, w: 160, h: 84, label: 'Broker',
      subOutside: ['Robinhood,', 'Goldman Sachs, etc'] },

    { id: 'ds',   x: 400,  y: 70,  w: 170, h: 66,  label: 'Data Service' },
    { id: 'mdp',  x: 1290, y: 70,  w: 190, h: 66,  label: 'Market Data Publisher' },
    { id: 'risk', x: 700,  y: 168, w: 190, h: 66,  label: 'Aggregated Risk Check' },

    { id: 'cg',  x: 400,  y: 400, w: 160, h: 84,  label: 'Client Gateway' },
    { id: 'om',  x: 670,  y: 372, w: 250, h: 140, label: 'Order Manager', inner: 'Wallet' },
    { id: 'seq', x: 1010, y: 400, w: 160, h: 84,  label: 'Sequencer' },
    { id: 'me',  x: 1280, y: 372, w: 210, h: 140, label: 'Matching Engine', inner: 'Order Book' },

    { id: 'rep', x: 700, y: 592, w: 190, h: 62, label: 'Reporter' },
    { id: 'db',  x: 720, y: 716, w: 150, h: 74, shape: 'cylinder', label: 'DB',
      subOutside: ['orders, executions'] },
  ],

  edges: [
    /* Luồng chính (nét liền). Chiều đi ở -22, chiều về ở +22 so với tâm hộp,
       nên hai mũi tên chạy song song thay vì chồng lên nhau. */
    { from: 'user:right:-20', to: 'broker:left:-20',  badge: '①' },
    { from: 'broker:right:-20', to: 'cg:left:-20',    badge: '②' },
    { from: 'cg:right:-20',  to: 'om:left:-20',       badge: '③' },
    /* ⚠ Đường THẲNG ĐỨNG thì hai đầu phải dùng CÙNG một độ lệch. Đặt lệch
       khác nhau (+90 với +60) là ra đường chéo — đúng lỗi của bản dựng đầu. */
    { from: 'om:top:-35',      to: 'risk:bottom:-35', badge: '④' },
    { from: 'risk:bottom:+35', to: 'om:top:+35',      badge: '⑤' },
    { from: 'om:right:-20',  to: 'seq:left:-20',      badge: '⑦' },
    { from: 'seq:right:-20', to: 'me:left:-20',       badge: '⑧' },
    { from: 'me:left:+24',   to: 'seq:right:+24',     badge: '⑩' },
    { from: 'seq:left:+24',  to: 'om:right:+24',      badge: '⑪' },
    { from: 'om:left:+24',   to: 'cg:right:+24',      badge: '⑫' },
    { from: 'cg:left:+24',   to: 'broker:right:+24',  badge: '⑬' },
    { from: 'broker:left:+24', to: 'user:right:+24',  badge: '⑭' },

    /* Luồng dữ liệu thị trường (gạch dài). Huy hiệu Ⓜ② đẩy sang phải để KHÔNG
       đè lên nhãn "candlestick chart, order book" đặt ở giữa đường. */
    { from: 'me:top',   to: 'mdp:bottom', kind: 'dash', badge: 'Ⓜ①' },
    { from: 'mdp:left', to: 'ds:right',   kind: 'dash', badge: 'Ⓜ②',
      bx: 1220, by: 103, label: 'candlestick chart, order book', lx: 940, ly: 97 },
    /* Đi vòng lên trên rồi thả thẳng xuống Broker. Chặng cuối phải cắm vào
       ĐÚNG tâm Broker (x = 230) thì mới thẳng — lệch một chút là ra đường xiên. */
    { from: 'ds:top:+40', to: 'broker:top', kind: 'dash', badge: 'Ⓜ③',
      via: [[525, 30], [230, 30]], bx: 230, by: 200 },

    /* Luồng báo cáo (chấm, đầu mũi tên rỗng) */
    { from: 'om:bottom',  to: 'rep:top', kind: 'dot', badge: 'Ⓡ①' },
    { from: 'rep:bottom', to: 'db:top',  kind: 'dot', badge: 'Ⓡ②' },
  ],

  legend: {
    x: 40, y: 640,
    items: [
      { kind: 'solid', badge: '①', label: 'Critical Path' },
      { kind: 'dash',  badge: 'Ⓜ', label: 'Market Data Flow' },
      { kind: 'dot',   badge: 'Ⓡ', label: 'Reporting Flow' },
    ],
  },
};
