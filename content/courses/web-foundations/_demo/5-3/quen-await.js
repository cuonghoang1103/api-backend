const getName = async () => 'Linh';
const getAge = async () => 20;

async function profile() {
  const name = getName();            // forgot await
  console.log('Hello ' + name);
  console.log(name === 'Linh', typeof name.then);
  const fixed = await getName();
  console.log('Hello ' + fixed);
  console.log(getName() + getAge());  // two promises joined as text
}
profile();
