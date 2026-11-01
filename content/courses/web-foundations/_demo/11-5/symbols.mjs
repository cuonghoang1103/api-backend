const tests = [
  [/^\d{10}$/, '0912345678', 'exactly 10 digits, nothing else'],
  [/^\d{10}$/, '091 234 5678', 'spaces are not digits'],
  [/^0[35789]\d{8}$/, '0912345678', 'VN mobile: 0 + 3/5/7/8/9 + 8 digits'],
  [/^0[35789]\d{8}$/, '0212345678', '02... is a landline prefix'],
  [/colou?r/, 'color', '? = the u is optional'],
  [/^[A-Z][a-z]+$/, 'Hanoi', 'one capital, then lowercase letters'],
  [/^\w+$/, 'user_01', '\\w = letters, digits, underscore'],
  [/^(jpg|png|webp)$/i, 'PNG', '| = or, i = ignore case'],
  [/^.{3,5}$/, 'abcdef', '. = any char, {3,5} = 3 to 5 times'],
];
for (const [re, input, note] of tests) console.log(String(re).padEnd(20), JSON.stringify(input).padEnd(15), re.test(input), '-', note);
