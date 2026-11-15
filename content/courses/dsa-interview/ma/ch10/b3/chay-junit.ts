// Compiles CuaSoTest.java (JUnit 5) + JUnitChay.java against the JUnit jars in the local Maven cache (~/.m2),
// then runs the tests twice: -Dban=dung (fixed) and -Dban=loi (buggy). In an IDE you would just click "Run tests".
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const m2 = join(homedir(), '.m2/repository/org');
const jars = [
  'junit/jupiter/junit-jupiter-api/5.12.2/junit-jupiter-api-5.12.2.jar',
  'junit/jupiter/junit-jupiter-engine/5.12.2/junit-jupiter-engine-5.12.2.jar',
  'junit/platform/junit-platform-commons/1.12.2/junit-platform-commons-1.12.2.jar',
  'junit/platform/junit-platform-engine/1.12.2/junit-platform-engine-1.12.2.jar',
  'junit/platform/junit-platform-launcher/1.12.2/junit-platform-launcher-1.12.2.jar',
  'opentest4j/opentest4j/1.3.0/opentest4j-1.3.0.jar',
  'apiguardian/apiguardian-api/1.1.2/apiguardian-api-1.1.2.jar',
].map((j) => join(m2, j));
const out = join(process.env.TMPDIR || tmpdir(), 'dsa-nhap', 'ch10', 'b3', 'junit-build');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const cp = jars.join(':');
const c = spawnSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-cp', cp, '-d', out, 'CuaSoTest.java', 'JUnitChay.java'],
  { cwd: import.meta.dirname, encoding: 'utf8' });
if (c.status !== 0) { console.error(c.stderr); process.exit(1); }
for (const ban of ['dung', 'loi']) {
  console.log(`$ java -Dban=${ban} JUnitChay`);
  const r = spawnSync('java', [`-Dban=${ban}`, '-cp', `${out}:${cp}`, 'JUnitChay'], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  console.log(r.stdout.trimEnd() + '\n');
}
rmSync(out, { recursive: true, force: true });
