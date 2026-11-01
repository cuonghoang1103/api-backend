/**
 * DBI202 · 3.C Slide trường Chương 4 (33–53) — cấu trúc lớp con (E/R, OO, NULL) với Movies/Cartoons/MurderMysteries, và UML.
 */
import { mod, de, cs, q, bang1, sau, chan, duoc, cot, YC_DDL, tn } from './_chung.mjs';

const ER_STYLE = `CREATE TABLE Movies (
    title  VARCHAR(60) NOT NULL,
    year   INT         NOT NULL,
    length INT         NULL,
    genre  VARCHAR(10) NULL,
    PRIMARY KEY (title, year)
);
CREATE TABLE Cartoons (                         -- E/R style: only the key + the subclass's own attribute
    title  VARCHAR(60) NOT NULL,
    year   INT         NOT NULL,
    voices VARCHAR(200) NULL,
    PRIMARY KEY (title, year),
    FOREIGN KEY (title, year) REFERENCES Movies (title, year) ON DELETE CASCADE
);
CREATE TABLE MurderMysteries (
    title  VARCHAR(60) NOT NULL,
    year   INT         NOT NULL,
    weapon VARCHAR(30) NULL,
    PRIMARY KEY (title, year),
    FOREIGN KEY (title, year) REFERENCES Movies (title, year) ON DELETE CASCADE
);`;

export default mod('dbi202-slide-dbi5-3', '3.C Subclass structures to relations and UML (slides 33–53)', [
  cs({
    t: 'Three strategies for Movies, Cartoons and Murder Mysteries', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['E/R style', 'object-oriented style', 'null style'], tag: ['erd', 'subclass', 'slide'],
    en: '<p>Movies(title, year, length, genre) has two subclasses: Cartoons(voices) and MurderMysteries(weapon); a movie may be both. Fill the comparison of slides 36–42.</p>',
    vi: '<p>Movies(title, year, length, genre) có hai lớp con: Cartoons(voices) và MurderMysteries(weapon); một phim có thể là cả hai. Điền bảng so sánh của slide 36–42.</p>',
    bang: [bang1('b1', ['Strategy comparison', 'So sánh chiến lược'],
      [{ ma: 'cl', ten: 'Strategy / Chiến lược' }, { ma: 'so', ten: 'Number of relations / Số quan hệ' }, { ma: 'uu', ten: 'Strength / Ưu điểm', luaChon: ['no NULLs; one table per possible class combination', 'subclass tables hold only key + own attribute', 'one table, no joins, but many NULLs'] }],
      [{ o: { cl: 'E/R style (one relation per entity set)' }, a: { so: '3', uu: 'subclass tables hold only key + own attribute' } },
        { o: { cl: 'Object-oriented style (one relation per subtree / class combination)' }, a: { so: '4', uu: 'no NULLs; one table per possible class combination' } },
        { o: { cl: 'Null style (one wide relation)' }, a: { so: '1', uu: 'one table, no joins, but many NULLs' } }],
      ['E/R: Movies, Cartoons(title, year, voices), MurderMysteries(title, year, weapon) = 3. OO: Movies, MoviesC, MoviesMM, MoviesCMM (cartoon AND mystery) = 4. Null: Movies(title, year, length, genre, voices, weapon) = 1.', 'E/R: Movies, Cartoons(title, year, voices), MurderMysteries(title, year, weapon) = 3. OO: Movies, MoviesC, MoviesMM, MoviesCMM (vừa hoạt hình vừa trinh thám) = 4. NULL: Movies(title, year, length, genre, voices, weapon) = 1.'])],
    gy: [['OO style needs one table for every combination of classes an object can belong to.', 'Kiểu OO cần một bảng cho mỗi tổ hợp lớp mà một đối tượng có thể thuộc.'], ['Null style puts every attribute in one relation; missing ones are NULL.', 'Kiểu NULL đặt mọi thuộc tính vào một quan hệ; thiếu thì NULL.']],
    lhg: [['Counting 3 for the OO style — the "both" combination (cartoon murder mystery) needs its own table.', 'Đếm 3 cho kiểu OO — tổ hợp "cả hai" (phim hoạt hình trinh thám) cần bảng riêng.'], ['Repeating length and genre in the E/R-style subclass tables.', 'Lặp length và genre trong các bảng lớp con kiểu E/R.']],
    tn: [tn('isa hierarchy', 'phân cấp isa')],
  }),
  de({
    csdl: '', ld: null,
    t: 'E/R style: Movies with Cartoons and MurderMysteries', k: 'MEDIUM', p: 10,
    kn: ['subclass', 'primary key as foreign key'], tag: ['erd', 'ddl', 'subclass', 'slide'],
    en: '<p>Implement the E/R-style strategy: <code>Movies(title VARCHAR(60), year INT, length INT, genre VARCHAR(10))</code> key (title, year); <code>Cartoons(title, year, voices VARCHAR(200))</code>; <code>MurderMysteries(title, year, weapon VARCHAR(30))</code>. A subclass row must belong to an existing movie and disappears with it.</p>',
    vi: '<p>Cài chiến lược kiểu E/R: <code>Movies(title VARCHAR(60), year INT, length INT, genre VARCHAR(10))</code> khoá (title, year); <code>Cartoons(title, year, voices VARCHAR(200))</code>; <code>MurderMysteries(title, year, weapon VARCHAR(30))</code>. Dòng lớp con phải thuộc một phim có sẵn và mất theo phim đó.</p>',
    yc: [['The key of each subclass table is (title, year), and that key is ALSO a foreign key to Movies (ON DELETE CASCADE).', 'Khoá của mỗi bảng lớp con là (title, year), và khoá đó ĐỒNG THỜI là khoá ngoại tới Movies (ON DELETE CASCADE).'], ['A movie may be in both subclasses.', 'Một phim có thể thuộc cả hai lớp con.'], YC_DDL],
    giai: ER_STYLE,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Movies', 'Cartoons', 'MurderMysteries'])),
      duoc(['Roger Rabbit is a cartoon AND a murder mystery', 'Roger Rabbit vừa là phim hoạt hình VỪA là trinh thám'], `INSERT INTO Movies VALUES ('Who Framed Roger Rabbit', 1988, 104, 'comedy'); INSERT INTO Cartoons VALUES ('Who Framed Roger Rabbit', 1988, 'Roger, Jessica'); INSERT INTO MurderMysteries VALUES ('Who Framed Roger Rabbit', 1988, 'dip')`),
      chan(['A cartoon that is not a movie is rejected', 'Phim hoạt hình không có trong Movies bị từ chối'], `INSERT INTO Cartoons VALUES ('Lion King', 1994, 'Simba')`, '23503'),
      chan(['The same movie twice in Cartoons is rejected', 'Một phim hai lần trong Cartoons bị từ chối'], `INSERT INTO Movies VALUES ('Lion King', 1994, 88, 'drama'); INSERT INTO Cartoons VALUES ('Lion King', 1994, 'Simba'), ('Lion King', 1994, 'Nala')`, '23505'),
      sau(['Deleting the movie deletes its subclass rows', 'Xoá phim thì xoá luôn dòng lớp con'], `INSERT INTO Movies VALUES ('Lion King', 1994, 88, 'drama'); INSERT INTO Cartoons VALUES ('Lion King', 1994, 'Simba'); DELETE FROM Movies WHERE title = 'Lion King'; SELECT COUNT(*) AS cartoonsLeft FROM Cartoons`),
    ],
    sai: [
      `CREATE TABLE Movies (title VARCHAR(60) NOT NULL, year INT NOT NULL, length INT, genre VARCHAR(10), PRIMARY KEY (title, year)); CREATE TABLE Cartoons (title VARCHAR(60) NOT NULL, year INT NOT NULL, voices VARCHAR(200), PRIMARY KEY (title, year)); CREATE TABLE MurderMysteries (title VARCHAR(60) NOT NULL, year INT NOT NULL, weapon VARCHAR(30), PRIMARY KEY (title, year));`,
      `CREATE TABLE Movies (title VARCHAR(60) NOT NULL, year INT NOT NULL, length INT, genre VARCHAR(10), PRIMARY KEY (title, year)); CREATE TABLE Cartoons (title VARCHAR(60) NOT NULL, year INT NOT NULL, voices VARCHAR(200), PRIMARY KEY (title, year), FOREIGN KEY (title, year) REFERENCES Movies(title, year)); CREATE TABLE MurderMysteries (title VARCHAR(60) NOT NULL, year INT NOT NULL, weapon VARCHAR(30), PRIMARY KEY (title, year), FOREIGN KEY (title, year) REFERENCES Movies(title, year));`,
    ],
    gy: [['Subclass table = superclass key + its own attributes.', 'Bảng lớp con = khoá của lớp cha + thuộc tính riêng.'], ['PRIMARY KEY (title, year) and FOREIGN KEY (title, year) REFERENCES Movies (title, year) ON DELETE CASCADE.', 'PRIMARY KEY (title, year) và FOREIGN KEY (title, year) REFERENCES Movies (title, year) ON DELETE CASCADE.']],
    lhg: [['No foreign key — a "cartoon" can exist without being a movie.', 'Không khoá ngoại — một "phim hoạt hình" tồn tại được mà không là phim.'], ['No CASCADE — deleting a movie that is a cartoon fails.', 'Không CASCADE — xoá một phim là phim hoạt hình sẽ lỗi.']],
    gt: ['<p>"Primary key that is also a foreign key" is the signature of a subclass (or a 1-1) — the reverse-engineering rule of lesson 3.4.</p>', '<p>"Khoá chính đồng thời là khoá ngoại" là dấu hiệu của lớp con (hoặc 1-1) — luật đọc ngược của bài 3.4.</p>'],
    tn: [tn('subclass', 'lớp con')],
  }),
  cs({
    t: 'UML class diagrams for databases', k: 'EASY', p: 6,
    kn: ['UML', 'association', 'multiplicity', 'composition'], tag: ['uml', 'slide'],
    en: '<p>Slides 43–53: the same model in UML.</p>', vi: '<p>Slide 43–53: cùng mô hình viết bằng UML.</p>',
    cau: [
      q('c1', ['In UML, an association end labelled 0..* means…', 'Trong UML, đầu liên kết ghi 0..* nghĩa là…'], ['any number, possibly none', 'exactly one', 'at most one', 'at least one'], ['0..* = zero or more; 1..1 = exactly one; 0..1 = at most one; 1..* = at least one.', '0..* = không hoặc nhiều; 1..1 = đúng một; 0..1 = tối đa một; 1..* = ít nhất một.']),
      q('c2', ['Movies 0..* —— 0..1 Studios. In E/R this is…', 'Movies 0..* —— 0..1 Studios. Trong E/R đây là…'], ['many-one from Movies to Studios', 'many-many', 'one-one', 'a weak relationship'], ['Each movie has at most one studio (0..1 at the Studios end), a studio has many movies.', 'Mỗi phim có tối đa một hãng (0..1 ở đầu Studios), một hãng có nhiều phim.']),
      q('c3', ['A filled diamond (composition) from Crews to Studios corresponds in E/R to…', 'Hình thoi đặc (composition) từ Crews tới Studios tương ứng trong E/R với…'], ['a weak entity set with its supporting relationship', 'a many-many relationship with attributes', 'a subclass connected by an isa triangle', 'a derived attribute shown with a dashed oval'], ['Composition: the part cannot exist without the whole — exactly a weak entity set.', 'Composition: phần không tồn tại thiếu toàn thể — đúng là tập thực thể yếu.']),
      q('c4', ['How does UML show a key attribute like title, year in class Movies?', 'UML thể hiện thuộc tính khoá như title, year của lớp Movies thế nào?'], ['with the stereotype PK after the attribute', 'with a double rectangle', 'by underlining the class name', 'with a dashed line'], ['The deck writes "title PK, year PK" inside the class box.', 'Bộ slide viết "title PK, year PK" trong khung lớp.']),
      q('c5', ['An association class in UML corresponds to…', 'Lớp liên kết (association class) trong UML tương ứng với…'], ['a relationship that has its own attributes', 'an entity without a key', 'a subclass with no attributes', 'an index'], ['e.g. a Contracts class on the Movies–Stars association carrying salary.', 'vd lớp Contracts trên liên kết Movies–Stars mang thuộc tính salary.']),
    ],
    gy: [['Read the multiplicity at the FAR end of the line.', 'Đọc bản số ở đầu XA của đường nối.'], ['Composition ⇔ weak entity; generalisation (triangle) ⇔ isa.', 'Composition ⇔ thực thể yếu; tổng quát hoá (tam giác) ⇔ isa.']],
    lhg: [['Reading 0..1 as "zero to many".', 'Đọc 0..1 thành "không tới nhiều".'], ['Confusing aggregation (hollow diamond) with composition (filled).', 'Nhầm aggregation (thoi rỗng) với composition (thoi đặc).']],
    tn: [tn('composition', 'quan hệ hợp thành'), tn('association class', 'lớp liên kết')],
  }),
]);
