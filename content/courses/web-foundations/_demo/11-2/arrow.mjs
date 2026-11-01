const clock = {
  seconds: 0,
  startBroken() {
    setTimeout(function () {
      // a normal function gets its OWN this (window for timers)
      console.log('function: this is clock?', this === clock);
    }, 0);
  },
  startFixed() {
    setTimeout(() => {
      // an arrow has NO this of its own; it uses startFixed's this
      this.seconds++;
      console.log('arrow:    this is clock?', this === clock, '| seconds =', this.seconds);
    }, 0);
  },
};
clock.startBroken();
clock.startFixed();

// The opposite trap: an arrow as a METHOD looks outward, to the module (undefined)
const shop = {
  name: 'CT Shop',
  title: () => (typeof this === 'undefined' ? 'this is undefined' : this.name),
};
console.log('arrow as method:', shop.title());
