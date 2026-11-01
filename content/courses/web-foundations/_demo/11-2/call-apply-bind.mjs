function introduce(greeting, punctuation) {
  return greeting + ', I am ' + this.name + punctuation;
}
const lan = { name: 'Lan' };

console.log(introduce.call(lan, 'Hello', '!'));      // call: arguments one by one
console.log(introduce.apply(lan, ['Hi', '.']));      // apply: arguments as an array
const lanIntro = introduce.bind(lan, 'Hey');          // bind: returns a NEW function, this fixed
console.log(lanIntro('?'));

// bind is permanent: calling it as a method of another object does not change this
const other = { name: 'Minh', lanIntro };
console.log(other.lanIntro('!!'));
