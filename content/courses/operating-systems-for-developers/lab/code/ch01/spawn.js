// spawn.js — Node tạo tiến trình con
const { spawn, execSync } = require('child_process');
console.log('node pid =', process.pid);
const c = spawn('sh', ['-c', 'echo "child pid=$$ ppid=$PPID"; exit 3'], { stdio: 'inherit' });
c.on('exit', (code, signal) => {
  console.log('child exited, code =', code, 'signal =', signal);
  console.log(execSync('echo synchronous: $$').toString().trim());   // execSync chặn event loop tới khi con xong!
});
