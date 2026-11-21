// chay: tay — được index.html nạp
// Milestone 4 starter: ONE array is the truth; render() redraws the list from it.
const state = {
  recipes: [
    { id: 1, name: 'Pho bo', minutes: 90 },
    { id: 2, name: 'Banh flan', minutes: 40 },
  ],
  query: '',
};
let nextId = 3;

const list = document.querySelector('#list');
const form = document.querySelector('#add-form');
const search = document.querySelector('#search');
const error = document.querySelector('#form-error');

function render() {
  const q = state.query.trim().toLowerCase();
  const shown = state.recipes.filter((r) => r.name.toLowerCase().includes(q));
  list.replaceChildren(...shown.map((r) => {
    const li = document.createElement('li');
    li.dataset.id = r.id;
    const text = document.createElement('span');
    text.textContent = r.name + ' · ' + r.minutes + ' min';   // textContent: user text is never HTML
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete';
    del.textContent = 'Delete';
    li.append(text, ' ', del);
    return li;
  }));
  document.querySelector('#count').textContent = shown.length + ' of ' + state.recipes.length + ' recipes';
  if (shown.length === 0) list.innerHTML = '<li class="empty">No recipe matches.</li>';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();                                   // stay on the page
  const name = form.elements.name.value.trim();
  const minutes = Number(form.elements.minutes.value);
  if (name.length < 2 || !Number.isInteger(minutes) || minutes <= 0) {
    error.textContent = 'Name needs 2+ characters and minutes a whole number above 0.';
    return;
  }
  error.textContent = '';
  state.recipes.push({ id: nextId++, name, minutes });
  form.reset();
  render();
});

// One listener on the list handles every Delete button, even ones added later (event delegation).
list.addEventListener('click', (event) => {
  const button = event.target.closest('button.delete');
  if (!button) return;
  const id = Number(button.closest('li').dataset.id);
  state.recipes = state.recipes.filter((r) => r.id !== id);
  render();
});

search.addEventListener('input', () => { state.query = search.value; render(); });

render();
