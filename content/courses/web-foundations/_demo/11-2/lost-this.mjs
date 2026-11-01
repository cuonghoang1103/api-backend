const user = {
  name: 'Chi',
  greet() {
    return 'Hi, I am ' + this.name;
  },
};

console.log(user.greet());          // method call: works

const greet = user.greet;           // pull the function OUT of the object
console.log(greet());               // strict mode: this is undefined -> TypeError
