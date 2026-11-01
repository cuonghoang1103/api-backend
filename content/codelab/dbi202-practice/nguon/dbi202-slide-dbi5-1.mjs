/**
 * DBI202 · 3.A Slide trường Chương 4 (1–18) — tập thực thể, thuộc tính, liên kết, bậc/bản số, vai trò, thực thể yếu.
 */
import { mod, de, cs, q, bang1, sau, chan, duoc, cot, YC_DDL, TN, tn } from './_chung.mjs';

const STUDIO_MOVIE = `CREATE TABLE Studios (
    name    VARCHAR(30) NOT NULL PRIMARY KEY,
    address VARCHAR(60) NULL
);
CREATE TABLE Movies (
    title      VARCHAR(60) NOT NULL,
    year       INT         NOT NULL,
    length     INT         NULL,
    studioName VARCHAR(30) NULL REFERENCES Studios (name),   -- Owns: many movies → one studio
    PRIMARY KEY (title, year)
);`;

export default mod('dbi202-slide-dbi5-1', '3.A E/R model: entities, relationships, weak entities (slides 1–18)', [
  cs({
    t: 'Read the E/R diagram of the movie database', k: 'EASY', p: 7, loai: 'table',
    kn: ['entity set', 'attribute', 'relationship', 'multiplicity'], tag: ['erd', 'slide'],
    en: '<p>Slides 5–12 draw Movies(title, year, length, genre), Stars(name, address), Studios(name, address) with the relationships <b>Stars-in</b> (Movies–Stars) and <b>Owns</b> (Movies → Studios, arrow to Studios). Classify each piece.</p>',
    vi: '<p>Slide 5–12 vẽ Movies(title, year, length, genre), Stars(name, address), Studios(name, address) với các liên kết <b>Stars-in</b> (Movies–Stars) và <b>Owns</b> (Movies → Studios, mũi tên chỉ về Studios). Phân loại từng phần.</p>',
    bang: [bang1('b1', ['Pieces of the diagram', 'Các thành phần của sơ đồ'],
      [{ ma: 'pt', ten: 'Piece / Thành phần' }, { ma: 'loai', ten: 'Kind / Loại', luaChon: ['entity set (rectangle)', 'attribute (oval)', 'relationship (diamond)'] }, { ma: 'bs', ten: 'Multiplicity (if a relationship) / Bản số', luaChon: ['—', 'many-many', 'many-one', 'one-one'] }],
      [{ o: { pt: 'Movies' }, a: { loai: 'entity set (rectangle)', bs: '—' } },
        { o: { pt: 'genre' }, a: { loai: 'attribute (oval)', bs: '—' } },
        { o: { pt: 'Stars-in' }, a: { loai: 'relationship (diamond)', bs: 'many-many' } },
        { o: { pt: 'Owns' }, a: { loai: 'relationship (diamond)', bs: 'many-one' } },
        { o: { pt: 'Studios' }, a: { loai: 'entity set (rectangle)', bs: '—' } }],
      ['A movie has many stars and a star plays in many movies: many-many (no arrows). The arrow of Owns points to Studios: each movie is owned by at most one studio — many-one.', 'Một phim có nhiều diễn viên, một diễn viên đóng nhiều phim: nhiều-nhiều (không mũi tên). Mũi tên của Owns chỉ về Studios: mỗi phim thuộc tối đa một hãng — nhiều-một.'])],
    gy: [['Rectangle = entity set, oval = attribute, diamond = relationship.', 'Chữ nhật = tập thực thể, oval = thuộc tính, hình thoi = liên kết.'], ['An arrow points to the "one" side.', 'Mũi tên chỉ về phía "một".']],
    lhg: [['Reading the arrow backwards ("one movie owns many studios").', 'Đọc mũi tên ngược ("một phim sở hữu nhiều hãng").'], ['Calling genre an entity set — it is just a value of a movie.', 'Gọi genre là tập thực thể — nó chỉ là một giá trị của phim.']],
    tn: [tn('entity set', 'tập thực thể'), tn('relationship', 'liên kết'), tn('multiplicity', 'bản số')],
  }),
  cs({
    t: 'Multiplicity, roles, weak entity sets', k: 'MEDIUM', p: 8,
    kn: ['many-one', 'roles', 'weak entity set', 'supporting relationship'], tag: ['erd', 'slide'],
    en: '<p>Five questions on slides 9–18.</p>', vi: '<p>Năm câu về slide 9–18.</p>',
    cau: [
      q('c1', ['Each studio has exactly one president and a person presides over at most one studio. Runs (Studios–Presidents) is…', 'Mỗi hãng có đúng một chủ tịch và một người làm chủ tịch tối đa một hãng. Runs (Studios–Presidents) là…'], ['one-one (arrows to both sides)', 'many-one towards Studios', 'many-many', 'a weak relationship'], ['At most one in each direction ⇒ one-one, arrows on both ends. "Exactly one" adds a rounded arrow (referential integrity).', 'Tối đa một theo cả hai chiều ⇒ một-một, mũi tên hai đầu. "Đúng một" thêm mũi tên tròn (toàn vẹn tham chiếu).']),
      q('c2', ['Sequel-of links Movies to Movies (original, sequel). What are "original" and "sequel"?', 'Sequel-of nối Movies với Movies (bản gốc, phần tiếp). "original" và "sequel" là gì?'], ['roles — the same entity set appears twice in one relationship', 'two different entity sets that look alike', 'two attributes of Movies holding titles', 'two weak entity sets owned by Movies'], ['A recursive relationship needs role names on its two edges.', 'Liên kết đệ quy cần tên vai trò trên hai cạnh.']),
      q('c3', ['Crews(number, crewChief) of a studio: crew 1 of Disney and crew 1 of Fox are different crews. Crews is…', 'Crews(number, crewChief) của một hãng: đội 1 của Disney và đội 1 của Fox là hai đội khác nhau. Crews là…'], ['a weak entity set, identified by (studio name, number)', 'a strong entity set with key number', 'a relationship between Studios and numbers', 'an attribute of Studios'], ['number is unique only inside its studio (partial key); the key borrows the studio\'s key through the supporting relationship Unit-of.', 'number chỉ duy nhất trong hãng (khoá bộ phận); khoá mượn khoá của hãng qua liên kết hỗ trợ Unit-of.']),
      q('c4', ['How is a weak entity set drawn?', 'Tập thực thể yếu được vẽ thế nào?'], ['double rectangle, and a double diamond for its supporting relationship', 'dashed rectangle with dashed attributes', 'a rectangle inside a diamond', 'an oval with two keys underlined'], ['Double rectangle + double diamond (supporting relationship), partial key underlined.', 'Hình chữ nhật đôi + hình thoi đôi (liên kết hỗ trợ), khoá bộ phận gạch chân.']),
      q('c5', ['Contracts(star, movie, studio of the star, producing studio) needs Studios twice. Why not split it into binary relationships?', 'Contracts(diễn viên, phim, hãng của diễn viên, hãng sản xuất) cần Studios hai lần. Sao không tách thành các liên kết hai ngôi?'], ['Binary pieces cannot say which studio pair goes with which star-movie pair', 'E/R diagrams forbid binary relationships between more than two sets', 'Splitting would need fewer tables, which E/R does not allow', 'Weak entity sets can never take part in a binary relationship'], ['A multiway relationship records combinations; splitting it loses which combination was real (unless a dependency allows it).', 'Liên kết nhiều ngôi ghi lại tổ hợp; tách ra là mất thông tin tổ hợp nào là thật (trừ khi có phụ thuộc cho phép).']),
    ],
    gy: [['Arrow = "at most one"; rounded arrow = "exactly one".', 'Mũi tên = "tối đa một"; mũi tên tròn = "đúng một".'], ['Weak = identified only together with its owner\'s key.', 'Yếu = chỉ xác định được khi kèm khoá của chủ.']],
    lhg: [['Treating every ID-less entity as weak — weak means the key needs the owner.', 'Coi mọi thực thể không có ID là yếu — yếu là khoá cần khoá của chủ.'], ['Drawing a recursive relationship without role names.', 'Vẽ liên kết đệ quy mà không ghi tên vai trò.']],
    tn: [tn('weak entity set', 'tập thực thể yếu'), tn('role', 'vai trò')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Owns: a many-one relationship becomes a foreign key', k: 'MEDIUM', p: 10,
    kn: ['many-one', 'foreign key', 'composite key'], tag: ['erd', 'ddl', 'slide'],
    en: '<p>Turn this part of the diagram into tables: <code>Studios(name, address)</code>, <code>Movies(title, year, length)</code>, and the many-one relationship <b>Owns</b> (each movie owned by at most one studio). Use exactly these names: <code>Studios(name VARCHAR(30) PK, address VARCHAR(60))</code>, <code>Movies(title VARCHAR(60), year INT, length INT, studioName VARCHAR(30))</code> with key (title, year).</p>',
    vi: '<p>Chuyển phần sơ đồ này thành bảng: <code>Studios(name, address)</code>, <code>Movies(title, year, length)</code> và liên kết nhiều-một <b>Owns</b> (mỗi phim thuộc tối đa một hãng). Dùng đúng tên: <code>Studios(name VARCHAR(30) PK, address VARCHAR(60))</code>, <code>Movies(title VARCHAR(60), year INT, length INT, studioName VARCHAR(30))</code> với khoá (title, year).</p>',
    yc: [['Two tables, Studios first. Owns gets NO table of its own: it is the column studioName on the many side.', 'Hai bảng, Studios trước. Owns KHÔNG có bảng riêng: nó là cột studioName ở phía nhiều.'], ['studioName is a foreign key to Studios(name) and may be NULL (a movie may not be owned).', 'studioName là khoá ngoại tới Studios(name) và được NULL (phim có thể không thuộc hãng nào).'], YC_DDL],
    giai: STUDIO_MOVIE,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Studios', 'Movies'])),
      duoc(['A studio with two movies', 'Một hãng có hai phim'], `INSERT INTO Studios (name) VALUES ('Disney'); INSERT INTO Movies (title, year, length, studioName) VALUES ('E.T.', 1982, 115, 'Disney'), ('Jaws', 1975, 124, 'Disney')`),
      chan(['A movie of an unknown studio is rejected', 'Phim của hãng không tồn tại bị từ chối'], `INSERT INTO Movies (title, year, length, studioName) VALUES ('Alien', 1979, 117, 'Fox')`, '23503'),
      chan(['The same (title, year) twice is rejected', 'Cùng (title, year) hai lần bị từ chối'], `INSERT INTO Movies (title, year) VALUES ('Jaws', 1975), ('Jaws', 1975)`, '23505'),
      duoc(['A movie without a studio is allowed', 'Phim không thuộc hãng nào được phép'], `INSERT INTO Movies (title, year) VALUES ('Indie', 2001)`),
    ],
    sai: [
      `CREATE TABLE Studios (name VARCHAR(30) NOT NULL PRIMARY KEY, address VARCHAR(60)); CREATE TABLE Movies (title VARCHAR(60) NOT NULL, year INT NOT NULL, length INT, studioName VARCHAR(30), PRIMARY KEY (title, year));`,
      `CREATE TABLE Studios (name VARCHAR(30) NOT NULL PRIMARY KEY, address VARCHAR(60)); CREATE TABLE Movies (title VARCHAR(60) NOT NULL, year INT NOT NULL, length INT); CREATE TABLE Owns (title VARCHAR(60), year INT, studioName VARCHAR(30) REFERENCES Studios(name), PRIMARY KEY (title, year, studioName));`,
    ],
    gy: [['Rule R3: a many-one relationship = a foreign key on the "many" side.', 'Luật R3: liên kết nhiều-một = khoá ngoại ở phía "nhiều".'], ['studioName VARCHAR(30) NULL REFERENCES Studios (name)', 'studioName VARCHAR(30) NULL REFERENCES Studios (name)']],
    lhg: [['Forgetting REFERENCES — a movie can point to a studio that does not exist.', 'Quên REFERENCES — phim trỏ được tới hãng không tồn tại.'], ['Creating a table Owns(title, year, studioName) — it adds a join and lets a movie have two studios, which the arrow forbids.', 'Tạo bảng Owns(title, year, studioName) — thêm một phép nối và cho phép một phim có hai hãng, điều mũi tên cấm.']],
    gt: ['<p>A relationship with an arrow merges into the entity at its tail. Studios must be created first so the foreign key has something to reference.</p>', '<p>Liên kết có mũi tên được gộp vào thực thể ở đuôi mũi tên. Studios phải tạo trước để khoá ngoại có chỗ tham chiếu.</p>'],
    tn: [TN.fk, TN.pk],
  }),
]);
