// && and || return one of their VALUES, not just true/false.
console.log('Linh' && 'logged in');   // first falsy, or the last
console.log('' && 'logged in');
console.log('' || 'guest');           // first truthy, or the last
console.log('Linh' || 'guest');

// || treats 0 and '' as "missing". ?? only treats null and undefined as missing.
const settings = { volume: 0, title: '' };
console.log(settings.volume || 50, settings.volume ?? 50);
console.log(settings.title || 'Untitled', settings.title ?? 'Untitled');
console.log(settings.size ?? 'medium');

// ?. stops safely if something is null or undefined.
const user = { profile: null };
console.log(user.profile?.city);
console.log(user.profile?.city ?? 'unknown city');

// The ternary is an expression: it produces a value.
const age = 20;
console.log(age >= 18 ? 'adult' : 'minor');
