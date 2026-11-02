// A real error, exactly as the Console shows it. Read it before you touch anything.
const user = { name: 'Linh', profile: null };   // profile was never loaded
console.log('step 1: user loaded →', user.name);
console.log('step 2: city →', user.profile.city); // 💥 line 4
console.log('step 3: never runs');
