// Lesson 9.1 — three everyday bugs TypeScript catches while you type
interface User {
  id: number;
  name: string;
  email: string | null;
}
function greet(user: User) {
  return 'Hello, ' + user.nmae;                       // 1. a typo
}
function domain(user: User) {
  return user.email.split('@')[1];                    // 2. email may be null
}
const input = document.querySelector('#search');
console.log(input.value);                             // 3. the element may not exist, and may not be an <input>
greet({ id: 1, name: 'Lan' });                        // 4. a required field is missing
