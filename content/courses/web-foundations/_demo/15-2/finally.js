const ui = { spinner: false, button: 'enabled' };

async function save(shouldFail) {
  ui.spinner = true;
  ui.button = 'disabled';
  try {
    await new Promise((r) => setTimeout(r, 10));     // pretend to call the server
    if (shouldFail) throw new Error('Network down');
    return 'saved';
  } finally {
    ui.spinner = false;                              // runs after return AND after throw
    ui.button = 'enabled';
  }
}

(async () => {
  console.log('success → ' + await save(false) + ' | spinner ' + ui.spinner + ', button ' + ui.button);
  try {
    await save(true);
  } catch (err) {
    console.log('failure → ' + err.message + ' | spinner ' + ui.spinner + ', button ' + ui.button);
  }

  function risky() {
    try {
      throw new Error('important error');
    } finally {
      return 'finally won';                          // never return from finally
    }
  }
  console.log('return inside finally → ' + risky() + ' (the error is gone, no one will ever see it)');
})();
