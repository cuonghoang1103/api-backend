// Version 1: a plain object — anyone can change the balance
const open = { balance: 100 };
open.balance = 1000000;
console.log('plain object:', open.balance);

// Version 2: a closure — balance can only change through the functions we return
function createAccount(start) {
  let balance = start;
  return {
    deposit(amount) {
      if (amount <= 0) throw new Error('amount must be positive');
      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const acc = createAccount(100);
acc.deposit(50);
acc.balance = 1000000;           // creates a NEW property, does not touch the real balance
console.log('closure:', acc.getBalance(), '| fake field:', acc.balance);
try {
  acc.deposit(-5);
} catch (e) {
  console.log('rejected:', e.message);
}
