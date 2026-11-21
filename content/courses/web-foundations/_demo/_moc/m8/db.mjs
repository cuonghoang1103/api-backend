// Milestone 8 starter: a real database file (node:sqlite, built into Node 22), parameterized queries,
// a JOIN, and a transaction. Run: node db.mjs <path-to-file.db>
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'recipes.db';
const open = () => {
  const db = new DatabaseSync(file);
  db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  return db;
};

let db = open();
const plain = (rows) => rows.map((r) => ({ ...r }));   // node:sqlite rows have a null prototype
db.prepare('INSERT INTO users (email) VALUES (?)').run('an@example.com');
const addRecipe = db.prepare('INSERT INTO recipes (owner_id, name, minutes) VALUES (?, ?, ?)');
const addIngredient = db.prepare('INSERT INTO ingredients (recipe_id, name, amount) VALUES (?, ?, ?)');

// A recipe and its ingredients are saved together or not at all.
function createRecipe(ownerId, name, minutes, ingredients) {
  db.exec('BEGIN');
  try {
    const { lastInsertRowid } = addRecipe.run(ownerId, name, minutes);
    for (const [ing, amount] of ingredients) addIngredient.run(lastInsertRowid, ing, amount);
    db.exec('COMMIT');
    return Number(lastInsertRowid);
  } catch (err) {
    db.exec('ROLLBACK');
    throw new Error('could not save recipe "' + name + '"', { cause: err });
  }
}

createRecipe(1, 'Pho bo', 90, [['beef', '300 g'], ['rice noodles', '400 g']]);
try {
  createRecipe(1, 'Bad flan', 40, [['eggs', '4'], [null, '1 cup']]);   // second ingredient breaks NOT NULL
} catch (err) {
  console.log(err.message, '->', err.cause.message);
}
console.log('recipes after the failed save:', db.prepare('SELECT count(*) AS n FROM recipes').get().n);

// The user's text is a VALUE (?), never glued into the SQL string.
const search = db.prepare('SELECT id, name FROM recipes WHERE name LIKE ?');
console.log('search "pho":', plain(search.all('%pho%')));
console.log("search \"' OR 1=1 --\":", plain(search.all("%' OR 1=1 --%")));

const page = db.prepare(`
  SELECT r.name AS recipe, u.email AS owner, count(i.id) AS ingredients
  FROM recipes r
  JOIN users u ON u.id = r.owner_id
  LEFT JOIN ingredients i ON i.recipe_id = r.id
  GROUP BY r.id`);
console.log('list page:', plain(page.all()));

try {
  addRecipe.run(42, 'Ghost recipe', 10);
} catch (err) {
  console.log('owner 42 does not exist ->', err.message);
}

db.close();
db = open();   // "restart the server": the data is still in the file
console.log('after reopening the file:', plain(db.prepare('SELECT name FROM recipes').all()));
