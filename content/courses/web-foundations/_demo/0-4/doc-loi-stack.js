// The same error, caught so we can print its full text — the "stack" DevTools shows under the red line.
function showCity(user) {
  return user.profile.city;           // line 3
}
function renderPage() {
  const user = { name: 'Linh', profile: null };
  return showCity(user);              // line 7
}
try {
  renderPage();                       // line 10
} catch (err) {
  console.log(err.stack.replaceAll(location.origin, ''));
}
