function readSettings(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('Could not read saved settings', { cause: err });   // wrap, keep the original
  }
}
try {
  readSettings('{"theme": "dark",}');
} catch (err) {
  console.log(err.message);
  console.log('  cause → ' + err.cause.name + ': ' + err.cause.message);
}

function readSettingsLossy(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Could not read saved settings');                   // the real reason is gone
  }
}
try {
  readSettingsLossy('{"theme": "dark",}');
} catch (err) {
  console.log('lossy version → cause: ' + err.cause);
}
