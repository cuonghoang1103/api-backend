// Same code, but as an old-style classic script (no strict mode)
var user = {
  name: 'Chi',
  greet: function () {
    return 'Hi, I am ' + this.name;
  },
};
var greet = user.greet;
console.log(greet());        // no error! this = window, window.name is '' -> silent bug
console.log(this === window);
