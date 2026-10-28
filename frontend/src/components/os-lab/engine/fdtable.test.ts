/**
 * Bảng fd: đối chiếu với output thật lab/out/c92-fd, c91-inode, c104-fd.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/fdtable.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FD_PRESETS, dfBytes, duBytes, inodeOf, namesOf, openCount, posOf, runFd } from './fdtable';

const end = (k: string) => { const P = FD_PRESETS[k]; const st = runFd(P.init, P.ops); return { st, S: st[st.length - 1] }; };
const file = (S: ReturnType<typeof end>['S'], name: string) => inodeOf(S, S.dentries.find((d) => d.name === name)!.ino)!.data;

describe('fdtable — ofd.c (c92-fd)', () => {
  it('twice: two descriptions, pos 26 and 13, B overwrites the start: "worker B: hi\\ner 1001 paid\\n"', () => {
    const { st, S } = end('twice');
    const w = st[st.length - 2];
    assert.equal(posOf(w, 100, 3), 26); assert.equal(posOf(w, 100, 4), 13);
    assert.equal(file(S, 'log.txt'), 'worker B: hi\ner 1001 paid\n');
    assert.deepEqual(S.term, ['worker B: hi\ner 1001 paid']);
    assert.equal(S.ofds.filter((o) => o.ino === 12).length, 2);
  });
  it('dup: one shared description, both at 39, both lines intact', () => {
    const { S } = end('dup');
    assert.equal(posOf(S, 100, 3), 39); assert.equal(posOf(S, 100, 4), 39);
    assert.equal(file(S, 'log.txt'), 'worker A: order 1001 paid\nworker B: hi\n');
    assert.equal(S.ofds.find((o) => o.ino === 12)!.refs, 2);
  });
  it('append: A at 26, B jumps to the end ⇒ 39', () => {
    const { S } = end('append');
    assert.equal(posOf(S, 100, 3), 26); assert.equal(posOf(S, 100, 4), 39);
    assert.equal(file(S, 'log.txt'), 'worker A: order 1001 paid\nworker B: hi\n');
  });
  it('fork: shared offset — child 28, parent 42', () => {
    const { st, S } = end('fork');
    assert.equal(posOf(st[4], 101, 3), 28); assert.equal(posOf(S, 100, 3), 42);
    assert.equal(file(S, 'log.txt'), 'child  line 1\nchild  line 2\nparent line 3\n');
  });
  it('redirect: "> f 2>&1" sends the error to the file, "2>&1 > f" to the terminal', () => {
    const { st } = end('redirect');
    const first = st[8];
    assert.equal(file(first, 'out.txt'), "ls: cannot access '/nope': No such file or directory\n");
    const S = st[st.length - 1];
    assert.equal(file(S, 'out.txt'), '');
    assert.ok(S.term.includes("ls: cannot access '/nope': No such file or directory"));
  });
});

describe('fdtable — inodes (c91-inode, Chapter 2)', () => {
  it('links: hard link survives rm, symlink dangles, EXDEV mv, inode 14 reused', () => {
    const { st, S } = end('links');
    const afterLn = st[4];
    assert.equal(inodeOf(afterLn, 14)!.links, 2);
    assert.deepEqual(namesOf(afterLn, 14).sort(), ['app.env', 'app.env.bak']);
    assert.equal(st[5].dentries.find((d) => d.name === 'current.env')!.ino, 15);
    assert.deepEqual(st[8].term, ['PORT=3000', 'cat: current.env: No such file or directory']);
    assert.equal(S.dentries.find((d) => d.name === 'new.txt')!.ino, 14);
  });
  it('deleted but open: du drops, df does not, until close()', () => {
    const { st } = end('deleted');
    const afterRm = st[3];
    assert.equal(duBytes(afterRm), 0);
    assert.equal(dfBytes(afterRm), 900 * (1 << 20));
    assert.equal(inodeOf(afterRm, 12)!.links, 0); assert.equal(openCount(afterRm, 12), 1);
    assert.equal(dfBytes(st[4]), 950 * (1 << 20));
    assert.equal(inodeOf(st[5], 12), undefined); assert.equal(dfBytes(st[5]), 0);
  });
  it('emfile: 1024 soft limit ⇒ EMFILE; ulimit 4096 lets it continue', () => {
    const { st } = end('emfile');
    assert.equal(st[3].procs[0].fds.length, 1004);
    assert.equal(st[4].last.err, 'EMFILE'); assert.equal(st[4].procs[0].fds.length, 1024);
    assert.equal(st[6].last.err, undefined); assert.equal(st[6].procs[0].fds.length, 1524);
  });
});
