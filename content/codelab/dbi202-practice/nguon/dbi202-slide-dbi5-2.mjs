/**
 * DBI202 · 3.B Slide trường Chương 4 (19–32) — từ sơ đồ E/R sang quan hệ: tập thực thể, liên kết nhiều-nhiều,
 * gộp liên kết nhiều-một, tập thực thể yếu.
 */
import { mod, de, cs, bang1, sau, chan, duoc, cot, YC_DDL, TN, tn } from './_chung.mjs';

const STARS_IN = `CREATE TABLE Movies (
    title VARCHAR(60) NOT NULL,
    year  INT         NOT NULL,
    PRIMARY KEY (title, year)
);
CREATE TABLE Stars (
    name    VARCHAR(40) NOT NULL PRIMARY KEY,
    address VARCHAR(60) NULL
);
CREATE TABLE StarsIn (                                -- many-many: a table of its own
    title    VARCHAR(60) NOT NULL,
    year     INT         NOT NULL,
    starName VARCHAR(40) NOT NULL REFERENCES Stars (name),
    PRIMARY KEY (title, year, starName),             -- keys of both sides
    FOREIGN KEY (title, year) REFERENCES Movies (title, year)
);`;

const CREWS = `CREATE TABLE Studios (
    name    VARCHAR(30) NOT NULL PRIMARY KEY,
    address VARCHAR(60) NULL
);
CREATE TABLE Crews (                                  -- weak: identified by (studioName, number)
    studioName VARCHAR(30) NOT NULL REFERENCES Studios (name) ON DELETE CASCADE,
    number     INT         NOT NULL,                  -- partial key
    crewChief  VARCHAR(40) NULL,
    PRIMARY KEY (studioName, number)
);`;

export default mod('dbi202-slide-dbi5-2', '3.B From E/R diagrams to relations (slides 19–32)', [
  de({
    csdl: '', ld: null,
    t: 'Stars-in: a many-many relationship becomes a table', k: 'MEDIUM', p: 10,
    kn: ['many-many', 'composite key', 'composite foreign key'], tag: ['erd', 'ddl', 'slide'],
    en: '<p>Convert <code>Movies(title, year)</code>, <code>Stars(name, address)</code> and the many-many relationship <b>Stars-in</b>. Names: <code>Movies(title VARCHAR(60), year INT)</code> key (title, year); <code>Stars(name VARCHAR(40) PK, address VARCHAR(60))</code>; <code>StarsIn(title, year, starName VARCHAR(40))</code>.</p>',
    vi: '<p>Chuyển <code>Movies(title, year)</code>, <code>Stars(name, address)</code> và liên kết nhiều-nhiều <b>Stars-in</b>. Tên: <code>Movies(title VARCHAR(60), year INT)</code> khoá (title, year); <code>Stars(name VARCHAR(40) PK, address VARCHAR(60))</code>; <code>StarsIn(title, year, starName VARCHAR(40))</code>.</p>',
    yc: [['StarsIn holds the keys of both sides; its key is all three columns.', 'StarsIn chứa khoá của cả hai bên; khoá của nó là cả ba cột.'], ['(title, year) is ONE composite foreign key to Movies; starName is a foreign key to Stars.', '(title, year) là MỘT khoá ngoại ghép tới Movies; starName là khoá ngoại tới Stars.'], YC_DDL],
    giai: STARS_IN,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Movies', 'Stars', 'StarsIn'])),
      duoc(['A star in two movies, a movie with two stars', 'Một diễn viên hai phim, một phim hai diễn viên'], `INSERT INTO Movies VALUES ('Star Wars', 1977), ('Empire', 1980); INSERT INTO Stars (name) VALUES ('Carrie Fisher'), ('Mark Hamill'); INSERT INTO StarsIn VALUES ('Star Wars', 1977, 'Carrie Fisher'), ('Star Wars', 1977, 'Mark Hamill'), ('Empire', 1980, 'Carrie Fisher')`),
      chan(['The same star twice in the same movie is rejected', 'Cùng diễn viên hai lần trong cùng phim bị từ chối'], `INSERT INTO Movies VALUES ('Star Wars', 1977); INSERT INTO Stars (name) VALUES ('Carrie Fisher'); INSERT INTO StarsIn VALUES ('Star Wars', 1977, 'Carrie Fisher'), ('Star Wars', 1977, 'Carrie Fisher')`, '23505'),
      chan(['A (title, year) pair that is not a movie is rejected', 'Cặp (title, year) không phải phim nào bị từ chối'], `INSERT INTO Movies VALUES ('Star Wars', 1977); INSERT INTO Stars (name) VALUES ('Carrie Fisher'); INSERT INTO StarsIn VALUES ('Star Wars', 1999, 'Carrie Fisher')`, '23503'),
      chan(['An unknown star is rejected', 'Diễn viên không tồn tại bị từ chối'], `INSERT INTO Movies VALUES ('Star Wars', 1977); INSERT INTO StarsIn VALUES ('Star Wars', 1977, 'Nobody')`, '23503'),
    ],
    sai: [
      `CREATE TABLE Movies (title VARCHAR(60) NOT NULL, year INT NOT NULL, PRIMARY KEY (title, year)); CREATE TABLE Stars (name VARCHAR(40) NOT NULL PRIMARY KEY, address VARCHAR(60)); CREATE TABLE StarsIn (title VARCHAR(60) NOT NULL, year INT NOT NULL, starName VARCHAR(40) NOT NULL REFERENCES Stars(name), PRIMARY KEY (title, year, starName));`,
      `CREATE TABLE Movies (title VARCHAR(60) NOT NULL, year INT NOT NULL, PRIMARY KEY (title, year)); CREATE TABLE Stars (name VARCHAR(40) NOT NULL PRIMARY KEY, address VARCHAR(60)); CREATE TABLE StarsIn (title VARCHAR(60) NOT NULL, year INT NOT NULL, starName VARCHAR(40) NOT NULL REFERENCES Stars(name), PRIMARY KEY (title, year), FOREIGN KEY (title, year) REFERENCES Movies(title, year));`,
    ],
    gy: [['Rule R5: many-many ⇒ a new table whose key is the keys of both entity sets.', 'Luật R5: nhiều-nhiều ⇒ bảng mới có khoá là khoá của cả hai tập thực thể.'], ['FOREIGN KEY (title, year) REFERENCES Movies (title, year) — one constraint over two columns.', 'FOREIGN KEY (title, year) REFERENCES Movies (title, year) — một ràng buộc trên hai cột.']],
    lhg: [['PRIMARY KEY (title, year) on StarsIn — then a movie can have only one star.', 'PRIMARY KEY (title, year) trên StarsIn — khi đó mỗi phim chỉ có một diễn viên.'], ['Forgetting the composite foreign key to Movies — StarsIn can mention a film that does not exist.', 'Quên khoá ngoại ghép tới Movies — StarsIn nhắc được tới phim không tồn tại.']],
    gt: ['<p>Two separate FKs (title → Movies.title, year → Movies.year) are impossible: neither column alone is a key of Movies. A composite key needs a composite foreign key.</p>', '<p>Hai khoá ngoại riêng (title → Movies.title, year → Movies.year) là không thể: không cột nào riêng là khoá của Movies. Khoá ghép cần khoá ngoại ghép.</p>'],
    tn: [TN.fk, tn('composite foreign key', 'khoá ngoại ghép')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Crews: a weak entity set and its owner', k: 'MEDIUM', p: 10,
    kn: ['weak entity set', 'partial key', 'ON DELETE CASCADE'], tag: ['erd', 'ddl', 'weak-entity', 'slide'],
    en: '<p>Crews is weak: crew <i>number</i> is unique only inside its studio (slides 29–32). Create <code>Studios(name VARCHAR(30) PK, address VARCHAR(60))</code> and <code>Crews(studioName VARCHAR(30), number INT, crewChief VARCHAR(40))</code>. When a studio is deleted its crews go with it.</p>',
    vi: '<p>Crews là thực thể yếu: <i>number</i> của đội chỉ duy nhất trong hãng (slide 29–32). Tạo <code>Studios(name VARCHAR(30) PK, address VARCHAR(60))</code> và <code>Crews(studioName VARCHAR(30), number INT, crewChief VARCHAR(40))</code>. Xoá một hãng thì các đội của nó cũng mất theo.</p>',
    yc: [['Key of Crews = (studioName, number) — the owner\'s key plus the partial key.', 'Khoá của Crews = (studioName, number) — khoá của chủ cộng khoá bộ phận.'], ['studioName references Studios with ON DELETE CASCADE. The supporting relationship Unit-of gets no table.', 'studioName tham chiếu Studios với ON DELETE CASCADE. Liên kết hỗ trợ Unit-of không có bảng.'], YC_DDL],
    giai: CREWS,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Studios', 'Crews'])),
      duoc(['Crew 1 of Disney and crew 1 of Fox can both exist', 'Đội 1 của Disney và đội 1 của Fox cùng tồn tại được'], `INSERT INTO Studios (name) VALUES ('Disney'), ('Fox'); INSERT INTO Crews (studioName, number) VALUES ('Disney', 1), ('Fox', 1)`),
      chan(['Two crews 1 in the same studio are rejected', 'Hai đội 1 trong cùng hãng bị từ chối'], `INSERT INTO Studios (name) VALUES ('Disney'); INSERT INTO Crews (studioName, number) VALUES ('Disney', 1), ('Disney', 1)`, '23505'),
      chan(['A crew of an unknown studio is rejected', 'Đội của hãng không tồn tại bị từ chối'], `INSERT INTO Crews (studioName, number) VALUES ('Nowhere', 1)`, '23503'),
      sau(['Deleting a studio deletes its crews', 'Xoá hãng thì xoá luôn các đội'], `INSERT INTO Studios (name) VALUES ('Disney'), ('Fox'); INSERT INTO Crews (studioName, number) VALUES ('Disney', 1), ('Disney', 2), ('Fox', 1); DELETE FROM Studios WHERE name = 'Disney'; SELECT studioName, number FROM Crews`),
    ],
    sai: [
      `CREATE TABLE Studios (name VARCHAR(30) NOT NULL PRIMARY KEY, address VARCHAR(60)); CREATE TABLE Crews (studioName VARCHAR(30) NOT NULL REFERENCES Studios(name) ON DELETE CASCADE, number INT NOT NULL PRIMARY KEY, crewChief VARCHAR(40));`,
      `CREATE TABLE Studios (name VARCHAR(30) NOT NULL PRIMARY KEY, address VARCHAR(60)); CREATE TABLE Crews (studioName VARCHAR(30) NOT NULL REFERENCES Studios(name), number INT NOT NULL, crewChief VARCHAR(40), PRIMARY KEY (studioName, number));`,
    ],
    gy: [['Rule R2: weak entity table = owner key + partial key, both in the PRIMARY KEY.', 'Luật R2: bảng thực thể yếu = khoá chủ + khoá bộ phận, cả hai trong PRIMARY KEY.'], ['A weak entity cannot exist without its owner ⇒ ON DELETE CASCADE.', 'Thực thể yếu không tồn tại thiếu chủ ⇒ ON DELETE CASCADE.']],
    lhg: [['PRIMARY KEY (number) — crew 1 of Fox is rejected because Disney already has a crew 1.', 'PRIMARY KEY (number) — đội 1 của Fox bị từ chối vì Disney đã có đội 1.'], ['No CASCADE — deleting Disney fails while it has crews.', 'Không CASCADE — xoá Disney lỗi khi còn đội.']],
    gt: ['<p>The double diamond (supporting relationship) never becomes a table: it is the foreign key studioName, which is also part of Crews\' key.</p>', '<p>Hình thoi đôi (liên kết hỗ trợ) không bao giờ thành bảng: nó là khoá ngoại studioName, đồng thời là một phần khoá của Crews.</p>'],
    tn: [tn('weak entity set', 'tập thực thể yếu'), tn('partial key', 'khoá bộ phận'), tn('ON DELETE CASCADE', 'xoá lan truyền')],
  }),
  cs({
    t: 'How many tables, and what key?', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['E/R to relations', 'combining relations'], tag: ['erd', 'slide'],
    en: '<p>Apply the conversion rules of slides 19–32. For each fragment give the relation it produces (or "merged" when the relationship is folded into an entity\'s table) and its key.</p>',
    vi: '<p>Áp dụng luật chuyển của slide 19–32. Với mỗi mảnh, cho biết quan hệ sinh ra (hoặc "merged" khi liên kết được gộp vào bảng của thực thể) và khoá của nó.</p>',
    bang: [bang1('b1', ['Fragment → relation', 'Mảnh → quan hệ'],
      [{ ma: 'manh', ten: 'Fragment / Mảnh' }, { ma: 'rel', ten: 'Own table? / Bảng riêng?', luaChon: ['own table', 'merged'] }, { ma: 'khoa', ten: 'Key / Khoá', luaChon: ['name', '(title, year)', '(title, year, starName)', '(studioName, number)', '(title, year, starName, studioOfStar)'] }],
      [{ o: { manh: 'entity set Stars(name, address)' }, a: { rel: 'own table', khoa: 'name' } },
        { o: { manh: 'many-many Stars-in(Movies, Stars)' }, a: { rel: 'own table', khoa: '(title, year, starName)' } },
        { o: { manh: 'many-one Owns(Movies → Studios)' }, a: { rel: 'merged', khoa: '(title, year)' } },
        { o: { manh: 'weak entity set Crews(number) of Studios' }, a: { rel: 'own table', khoa: '(studioName, number)' } },
        { o: { manh: '4-way Contracts(starName, title, year, studioOfStar, producingStudio) with an arrow to the producing studio' }, a: { rel: 'own table', khoa: '(title, year, starName, studioOfStar)' } }],
      ['Entity ⇒ table keyed by its key. Many-many ⇒ table keyed by both keys. Many-one ⇒ merged into the "many" entity, whose key stays (title, year). Weak ⇒ owner key + partial key. A multiway relationship with an arrow to one entity: that entity\'s key leaves the key (the others determine it).', 'Thực thể ⇒ bảng có khoá của nó. Nhiều-nhiều ⇒ bảng có khoá của hai bên. Nhiều-một ⇒ gộp vào thực thể phía "nhiều", khoá vẫn là (title, year). Yếu ⇒ khoá chủ + khoá bộ phận. Liên kết nhiều ngôi có mũi tên tới một thực thể: khoá của thực thể đó ra khỏi khoá (các bên kia quyết định nó).'])],
    gy: [['An arrow means "the entity at the head is determined by the others" ⇒ it is not needed in the key.', 'Mũi tên nghĩa là "thực thể ở đầu mũi tên được các bên kia quyết định" ⇒ không cần trong khoá.'], ['Many-one relationships are merged; many-many never are.', 'Liên kết nhiều-một được gộp; nhiều-nhiều thì không bao giờ.']],
    lhg: [['Giving Owns a table of its own.', 'Cho Owns một bảng riêng.'], ['Putting all four keys in Contracts\' key despite the arrow.', 'Đưa cả bốn khoá vào khoá của Contracts dù có mũi tên.']],
    tn: [tn('E/R to relational conversion', 'chuyển E/R sang quan hệ')],
  }),
]);
