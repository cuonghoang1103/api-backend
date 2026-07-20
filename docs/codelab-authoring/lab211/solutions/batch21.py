# Batch 21 — J1.S.P0079 (zip / unzip with java.util.zip) and J1.S.P0070
# (Tien Phong Bank Ebank login: ResourceBundle + regex + captcha).
#
# Both labs are verified by RUNNING them, and both needed a check stronger than
# "no exception was thrown":
#
#   * P0079 — a zip program that writes an unreadable archive still "succeeds"
#     if you only look for exceptions. So the scripted runs do a real round
#     trip: run 0 zips the project's own src/ folder, run 1 is a NEW process
#     that unzips it into a different folder, and the checker compares the
#     restored files BYTE FOR BYTE with the originals. Run 2 feeds the program
#     a hand-built malicious archive whose entry is named ../../pwned.txt and
#     proves the extractor refuses it (zip slip).
#
#   * P0070 — the captcha is random, so a fixed transcript is impossible. The
#     checker reads the captcha the program actually printed, rebuilds the
#     transcript that that captcha implies, and diffs the whole console against
#     it. Nothing is left to luck.
import glob
import io
import os
import re
import tempfile
import zipfile

from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0079 — Zipper program (130 LOC)
# ════════════════════════════════════════════════════════════════

P0079_ZIP_MANAGER = '''package bo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

/**
 * All the archive work, and no printing at all.
 *
 * The two methods the brief names by signature - compressTo and extractTo -
 * return a boolean status, which is the whole contract. But the screen has to
 * list every file that went in or came out, and a boolean cannot carry a list.
 * So each of them is a thin wrapper over a private method that returns the
 * names and throws on failure; the wrapper catches, records, and answers
 * true/false. The alternative - printing from in here - would make these
 * methods impossible to test with anything except a human reading a console.
 */
public class ZipManager {

    private static final int BUFFER_SIZE = 8192;

    /** What the last call handled, and why it failed, for the screen to show. */
    private static List<String> lastEntries = new ArrayList<>();
    private static String lastError = "";

    private ZipManager() {
    }

    /**
     * @param pathSrc      folder holding the files to be zipped
     * @param fileZipName  name of the archive to create
     * @param pathCompress folder the archive is written into
     * @return true if the archive was written
     */
    public static boolean compressTo(String pathSrc, String fileZipName, String pathCompress) {
        lastEntries = new ArrayList<>();
        lastError = "";
        try {
            lastEntries = zip(pathSrc, fileZipName, pathCompress);
            return true;
        } catch (IOException e) {
            lastError = e.getMessage();
            return false;
        }
    }

    /**
     * @param pathZipFile the archive to read
     * @param pathExtract folder the entries are written into
     * @return true if every entry was extracted
     */
    public static boolean extractTo(String pathZipFile, String pathExtract) {
        lastEntries = new ArrayList<>();
        lastError = "";
        try {
            lastEntries = unzip(pathZipFile, pathExtract);
            return true;
        } catch (IOException e) {
            lastError = e.getMessage();
            return false;
        }
    }

    public static List<String> getLastEntries() {
        return lastEntries;
    }

    public static String getLastError() {
        return lastError;
    }

    private static List<String> zip(String pathSrc, String fileZipName, String pathCompress)
            throws IOException {
        File source = new File(pathSrc);
        if (!source.isDirectory()) {
            throw new IOException("Source folder does not exist: " + pathSrc);
        }
        File targetFolder = new File(pathCompress);
        if (!targetFolder.isDirectory() && !targetFolder.mkdirs()) {
            throw new IOException("Cannot create destination folder: " + pathCompress);
        }
        // A file called "backup" is not an archive to any tool that opens it by
        // extension, so the missing .zip is added rather than trusted to the user.
        String name = fileZipName.toLowerCase().endsWith(".zip") ? fileZipName : fileZipName + ".zip";
        File archive = new File(targetFolder, name);

        List<String> names = new ArrayList<>();
        // try-with-resources, and it is not a style preference. A zip file ends
        // with a central directory listing every entry, and ZipOutputStream
        // writes it in close(). Skip the close - or lose it to an exception on
        // the way out - and what is left on disk is a file of roughly the right
        // size that no tool on earth can open.
        try (ZipOutputStream out = new ZipOutputStream(new FileOutputStream(archive))) {
            addFolder(source, "", out, names, archive.getCanonicalFile());
        }
        return names;
    }

    /**
     * Walks the folder depth-first, writing one entry per file.
     *
     * Two details that are easy to get wrong and expensive when you do:
     *
     * 1. Every putNextEntry is matched by a closeEntry. In this simple flow the
     *    next putNextEntry would have closed the previous entry anyway, which is
     *    exactly why leaving it out survives casual testing - but it is the
     *    documented contract, and it is the only thing that finishes the last
     *    entry if the stream is handed somewhere else before it is closed.
     * 2. The archive is skipped if it happens to live inside the folder being
     *    zipped. Otherwise the program feeds the file it is writing back into
     *    itself, which grows without end.
     *
     * The children are sorted so two runs over the same folder produce the same
     * archive and the same listing. An archive that reshuffles itself between
     * runs cannot be compared with anything.
     */
    private static void addFolder(File folder, String prefix, ZipOutputStream out,
                                  List<String> names, File archive) throws IOException {
        File[] children = folder.listFiles();
        if (children == null) {
            return;
        }
        Arrays.sort(children);
        for (File child : children) {
            if (child.getCanonicalFile().equals(archive)) {
                continue;
            }
            String entryName = prefix + child.getName();
            if (child.isDirectory()) {
                // The trailing slash is what marks an entry as a folder; without
                // it an empty folder is silently lost on extraction.
                out.putNextEntry(new ZipEntry(entryName + "/"));
                out.closeEntry();
                addFolder(child, entryName + "/", out, names, archive);
            } else {
                out.putNextEntry(new ZipEntry(entryName));
                try (InputStream in = new FileInputStream(child)) {
                    copy(in, out);
                }
                out.closeEntry();
                names.add(entryName);
            }
        }
    }

    private static List<String> unzip(String pathZipFile, String pathExtract) throws IOException {
        File archive = new File(pathZipFile);
        if (!archive.isFile()) {
            throw new IOException("Zip file does not exist: " + pathZipFile);
        }
        File targetFolder = new File(pathExtract);
        if (!targetFolder.isDirectory() && !targetFolder.mkdirs()) {
            throw new IOException("Cannot create destination folder: " + pathExtract);
        }
        String root = targetFolder.getCanonicalPath() + File.separator;

        List<String> names = new ArrayList<>();
        try (ZipInputStream in = new ZipInputStream(new FileInputStream(archive))) {
            ZipEntry entry;
            while ((entry = in.getNextEntry()) != null) {
                File target = new File(targetFolder, entry.getName());

                // Zip slip. An entry name is data written by whoever built the
                // archive, and nothing stops it being "../../etc/passwd". Left
                // unchecked, extracting a downloaded archive lets its author
                // overwrite any file this process can write. The canonical path
                // of the target must start inside the destination folder, or the
                // entry is refused - the check has to be on the CANONICAL path,
                // because "a/../../b" only looks harmless before it is resolved.
                if (!target.getCanonicalPath().startsWith(root)) {
                    throw new IOException("Entry is outside the destination folder: " + entry.getName());
                }

                if (entry.isDirectory()) {
                    target.mkdirs();
                } else {
                    File parent = target.getParentFile();
                    if (parent != null) {
                        parent.mkdirs();
                    }
                    try (OutputStream out = new FileOutputStream(target)) {
                        copy(in, out);
                    }
                    names.add(entry.getName());
                }
                in.closeEntry();
            }
        }
        return names;
    }

    /**
     * Copies one stream into another WITHOUT closing either.
     *
     * That is the point: on the way out the destination is the shared
     * ZipOutputStream, and on the way in the source is the shared
     * ZipInputStream. A helper that closed what it was given would end the
     * whole archive after the first file.
     */
    private static void copy(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[BUFFER_SIZE];
        int read;
        while ((read = in.read(buffer)) > 0) {
            out.write(buffer, 0, read);
        }
    }
}
'''

P0079_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * One static Scanner over System.in, and a private constructor so nobody can
 * create a second one. Two Scanners on the same stream is a classic way to lose
 * input: the first one buffers ahead, and the lines it swallowed never reach
 * the second.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please choose from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /** A path the user typed. Blank is refused; a blank path is never what was meant. */
    public static String getString(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("You must input a value.");
        }
    }
}
'''

P0079_MAIN = '''package ui;

import bo.ZipManager;
import utils.Validator;

/**
 * The menu and the screen, and nothing else.
 *
 * Both branches end in the same report() call: the result screen is identical
 * for compression and extraction, so writing it twice would be two places to
 * fix the day the wording changes.
 */
public class Main {

    private static final String RESULT = "------------ Result -----------";

    public static void main(String[] args) {
        boolean running = true;
        while (running) {
            System.out.println("========= Zipper program =========");
            System.out.println("1. Compression");
            System.out.println("2. Extraction");
            System.out.println("3. Exit");
            switch (Validator.getInt("Please choice one option: ", 1, 3)) {
                case 1:
                    compress();
                    break;
                case 2:
                    extract();
                    break;
                default:
                    running = false;
            }
        }
    }

    private static void compress() {
        System.out.println("---------- Compression --------");
        String source = Validator.getString("Enter Source Folder: ");
        String destination = Validator.getString("Enter Destination Folder: ");
        String name = Validator.getString("Enter Name: ");
        report(ZipManager.compressTo(source, name, destination));
    }

    private static void extract() {
        System.out.println("---------- Extraction ---------");
        String source = Validator.getString("Enter Source file: ");
        String destination = Validator.getString("Enter Destination Folder: ");
        report(ZipManager.extractTo(source, destination));
    }

    /** One result screen for both jobs; the reason is shown when it failed. */
    private static void report(boolean done) {
        System.out.println(RESULT);
        if (!done) {
            System.out.println(ZipManager.getLastError());
            System.out.println("Failed");
            return;
        }
        for (String name : ZipManager.getLastEntries()) {
            System.out.println("File name " + name);
        }
        System.out.println("Successfully");
    }
}
'''


# ── the round-trip checker ───────────────────────────────────────
#
# The three scripted runs share one working directory, in order, exactly as a
# marker's session would: run 0 creates the archive, run 1 is a brand new JVM
# that finds it on disk and unpacks it, run 2 is handed a hostile archive.
#
# solkit hands a predicate the console text only, so the checker locates that
# shared directory itself: solkit builds it as <tmp>/lab211-sol-*/J1_S_P0079,
# and the newest match that actually contains the project is the live one.

def _p0079_rundir():
    pattern = os.path.join(tempfile.gettempdir(), 'lab211-sol-*', 'J1_S_P0079')
    candidates = [d for d in glob.glob(pattern)
                  if os.path.isdir(os.path.join(d, 'src', 'bo'))]
    if not candidates:
        return None
    return max(candidates, key=os.path.getmtime)


ZIP_LISTING = ['bo/ZipManager.java', 'ui/Main.java', 'utils/Validator.java']

P0079_RUN0 = '''========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: ---------- Compression --------
Enter Source Folder: Enter Destination Folder: Enter Name: ------------ Result -----------
Source folder does not exist: no-such-folder
Failed
========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: ---------- Compression --------
Enter Source Folder: Enter Destination Folder: Enter Name: ------------ Result -----------
File name bo/ZipManager.java
File name ui/Main.java
File name utils/Validator.java
Successfully
========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: '''


def _p0079_run0(out):
    """Zipped the project's own src/ folder — is the archive really an archive?"""
    if out.strip() != P0079_RUN0.strip():
        return False, 'the console differs from the expected transcript'

    run = _p0079_rundir()
    if run is None:
        return False, 'could not locate the shared working directory'
    archive = os.path.join(run, 'archive', 'backup.zip')
    if not os.path.isfile(archive):
        return False, 'archive/backup.zip was not created (the .zip suffix should be added to "backup")'

    # Read it with a completely independent implementation. An archive whose
    # ZipOutputStream was never closed has no central directory and is caught
    # right here — it is a file of the right size that no tool can open.
    try:
        with zipfile.ZipFile(archive) as zf:
            broken = zf.testzip()
            if broken is not None:
                return False, f'the archive is corrupt at entry {broken}'
            files = [n for n in zf.namelist() if not n.endswith('/')]
            if sorted(files) != ZIP_LISTING:
                return False, f'entries are {files}, expected {ZIP_LISTING}'
            for name in files:
                original = open(os.path.join(run, 'src', *name.split('/')), 'rb').read()
                if zf.read(name) != original:
                    return False, f'{name} inside the archive differs from the file on disk'
    except zipfile.BadZipFile as e:
        return False, f'the archive cannot be opened at all ({e}) — was the ZipOutputStream closed?'

    # Plant the hostile archive that run 2 will be asked to extract. Nothing in
    # java.util.zip stops an entry from being named ../../pwned.txt, so the only
    # honest way to test the guard is to build one and try it.
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as zf:
        zf.writestr('readme.txt', 'harmless\n')
        zf.writestr('../../pwned.txt', 'you have been owned\n')
    open(os.path.join(run, 'evil.zip'), 'wb').write(buf.getvalue())
    return True, ''


P0079_RUN1 = '''========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: ---------- Extraction ---------
Enter Source file: Enter Destination Folder: ------------ Result -----------
File name bo/ZipManager.java
File name ui/Main.java
File name utils/Validator.java
Successfully
========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: '''


def _p0079_run1(out):
    """A NEW process unzips what the previous one wrote — and the bytes must match."""
    if out.strip() != P0079_RUN1.strip():
        return False, 'the console differs from the expected transcript'

    run = _p0079_rundir()
    if run is None:
        return False, 'could not locate the shared working directory'

    restored_root = os.path.join(run, 'restored')
    if not os.path.isdir(restored_root):
        return False, 'the destination folder was not created'

    for name in ZIP_LISTING:
        original = os.path.join(run, 'src', *name.split('/'))
        restored = os.path.join(restored_root, *name.split('/'))
        if not os.path.isfile(restored):
            return False, f'{name} was not extracted'
        if open(original, 'rb').read() != open(restored, 'rb').read():
            return False, f'{name} came back with different bytes than went in'

    # It has to land in the folder that was asked for, not somewhere else.
    stray = os.path.join(run, 'bo', 'ZipManager.java')
    if os.path.exists(stray):
        return False, 'entries were written next to the archive instead of into the destination folder'
    return True, ''


P0079_RUN2 = '''========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: ---------- Extraction ---------
Enter Source file: Enter Destination Folder: ------------ Result -----------
Entry is outside the destination folder: ../../pwned.txt
Failed
========= Zipper program =========
1. Compression
2. Extraction
3. Exit
Please choice one option: '''


def _p0079_run2(out):
    """Zip slip: the archive planted in run 0 must be refused, not obeyed."""
    if out.strip() != P0079_RUN2.strip():
        return False, 'the console differs from the expected transcript'

    run = _p0079_rundir()
    if run is None:
        return False, 'could not locate the shared working directory'
    for escaped in (os.path.join(run, 'pwned.txt'),
                    os.path.join(os.path.dirname(run), 'pwned.txt')):
        if os.path.exists(escaped):
            return False, f'the malicious entry escaped and wrote {escaped}'
    # The harmless entry that came first is allowed to have been written.
    return True, ''


solution(
    'J1.S.P0079',
    title_vi='Chương trình nén và giải nén tệp',
    files=[('src/bo/ZipManager.java', P0079_ZIP_MANAGER),
           ('src/utils/Validator.java', P0079_VALIDATOR),
           ('src/ui/Main.java', P0079_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — a folder that does not exist (the error path), then zip the
        # project's own src/ folder into archive/backup.zip.
        ('1\nno-such-folder\narchive\nbackup\n'
         '1\nsrc\narchive\nbackup\n'
         '3\n', _p0079_run0),
        # Run 1 — a NEW JVM, same working directory: unpack what run 0 wrote.
        ('2\narchive/backup.zip\nrestored\n3\n', _p0079_run1),
        # Run 2 — the hostile archive planted by run 0's checker.
        ('2\nevil.zip\nrestored2\n3\n', _p0079_run2),
    ],
    explain_en='''<p><strong>The two signatures are the contract.</strong> The Guidelines name
<code>public static boolean compressTo(String pathSrc, String fileZipName, String pathCompress)</code>
and <code>public static boolean extractTo(String pathZipFile, String pathExtract)</code>, so those exist
exactly as written, down to the argument order — note that the zip <em>name</em> comes before the
<em>folder</em> it is written into, which is the reverse of the order the screen asks for them in. A
marker looks for the method by signature; the screen is free to collect the answers in whatever order
reads best.</p>
<p><strong>Why a boolean method still manages to list the files.</strong> The screen has to print
<code>File name …</code> for every entry, and a <code>boolean</code> cannot carry a list. Rather than
change the signature or print from inside the business layer, each public method is a thin wrapper over
a private one that <em>returns the names and throws on failure</em>; the wrapper catches, records the
names and the reason, and answers true/false. That keeps <code>bo</code> silent — a method that both
does the work and prints it cannot be tested by anything except a human reading a console.</p>
<p><strong>The mistake that hides for weeks: an archive that is never closed.</strong> A zip file ends
with a <em>central directory</em> — the index of every entry — and <code>ZipOutputStream</code> writes it
in <code>close()</code>. Write all the entries and forget the close (or lose it to an exception on the
way out) and the result is a file of roughly the right size that no tool on earth can open. Nothing
throws, the method returns true, the console says <code>Successfully</code>. That is exactly why "it ran
without an error" is not evidence that a zip program works, and it is the first thing the verification
below goes after: this solution was re-run with the <code>try</code>-with-resources removed, and the
checker reported <em>the archive cannot be opened at all</em> while the program itself still claimed
success.</p>
<p><strong>And the one that is repeated more often than it is true.</strong> "Every
<code>putNextEntry</code> must be matched by a <code>closeEntry</code> or the archive is truncated" is
half-right. It <em>is</em> the documented contract and it is written here — but the next
<code>putNextEntry</code>, and the final <code>close()</code>, each close the current entry anyway, so
leaving it out survives casual testing. Removing it from this solution was tried, and the round trip
still passed. Say the accurate version at the defence: keep <code>closeEntry()</code> because it is the
contract and because it is what finishes the last entry when the stream outlives the method, not because
its absence corrupts a simple archive. The <em>copy helper</em> is where a stream really does get closed
too early: a helper that closes what it was handed ends the archive after the first file, and the second
one dies with <code>Stream closed</code> — that failure was reproduced too.</p>
<p><strong>So the proof is a round trip, not an absence of exceptions.</strong> Three runs share one
working directory, the way a marker's session does. Run 0 zips the project's own <code>src/</code>
folder into <code>archive/backup.zip</code>. Run 1 is a <strong>brand new JVM</strong> that finds that
file on disk and unpacks it into <code>restored/</code>. Then every restored file is compared with the
original <strong>byte for byte</strong>, and the archive is additionally opened by an independent
implementation that verifies its CRCs. A truncated or scrambled archive cannot survive that; "no
exception was thrown" would not have noticed.</p>
<p><strong>Zip slip, and why it is worth a paragraph at the defence.</strong> An entry name is just text
chosen by whoever built the archive, and nothing in <code>java.util.zip</code> stops it being
<code>../../pwned.txt</code>. An extractor that joins that name onto the destination folder and writes
will happily place the file <em>outside</em> the folder the user chose — that is a real, named
vulnerability that has shipped in very large products. So <code>extractTo</code> resolves each target to
its <strong>canonical</strong> path and refuses anything that does not start inside the destination.
Canonical, not the raw path: <code>dest/a/../../b</code> only looks harmless until it is resolved. Run 2
extracts a hand-built malicious archive and checks both that the program refuses it and that no file
appeared outside the destination.</p>
<p><strong>Two smaller decisions.</strong> Directory entries are written with a trailing
<code>/</code> — that slash is the only thing marking an entry as a folder, and without it an empty
folder disappears on extraction. And <code>listFiles()</code> returns children in whatever order the
file system feels like, so they are sorted: two runs over the same folder then produce the same archive
and the same listing, which is what makes the round trip comparable at all.</p>
<p><strong>The self-swallowing archive.</strong> If the destination folder is inside the source folder,
a naive walker feeds the archive it is currently writing back into itself and grows until the disk is
full. The walker skips any child whose canonical path is the archive, which costs one line and removes
a whole class of very confusing bug reports.</p>
<p><strong>Where the layers went.</strong> Three files: <code>bo</code> does the archive work and never
prints, <code>utils/Validator</code> owns the single <code>Scanner</code>, <code>ui/Main</code> is the
menu. There is no <code>entity</code> because this program has no domain object to model — its data is
files on disk, and inventing a <code>ZipFileInfo</code> POJO to hold a name would be a class that earns
nothing. There is no <code>controller</code> either: with one screen and two operations there is nothing
for it to coordinate, and an empty controller is a mark lost, not gained.</p>
<p><strong>Where the sheet and the specification disagree.</strong> The Program Specification numbers the
menu 1/2/3 and the program asks you to "choice one option", but the expected-screen picture prints the
three items with no numbers at all; the same picture also runs the banner and the first prompt together
on one line (<code>---------- Compression --------Enter Source Folder:</code>). The menu here is
numbered, because a prompt that wants a number beside a menu that shows none is unusable. Note also that
the prompts are printed with <code>print()</code>, not <code>println()</code>, so when input is piped
rather than typed the transcript shows several prompts on the same line — that is the terminal echo
missing, not a bug.</p>''',
    explain_vi='''<p><strong>Hai chữ ký hàm là bản có hiệu lực.</strong> Phần Hướng dẫn nêu đích danh
<code>public static boolean compressTo(String pathSrc, String fileZipName, String pathCompress)</code>
và <code>public static boolean extractTo(String pathZipFile, String pathExtract)</code>, nên hai hàm đó
tồn tại đúng như vậy, kể cả thứ tự tham số — để ý <em>tên</em> tệp zip đứng trước <em>thư mục</em> chứa
nó, ngược với thứ tự màn hình hỏi. Người chấm dò hàm theo chữ ký; còn màn hình muốn hỏi theo thứ tự nào
dễ đọc hơn thì tuỳ.</p>
<p><strong>Vì sao hàm trả về boolean mà vẫn liệt kê được danh sách tệp.</strong> Màn hình phải in
<code>File name …</code> cho từng mục, mà một <code>boolean</code> thì không mang theo được danh sách.
Thay vì đổi chữ ký hoặc cho tầng nghiệp vụ tự in, mỗi hàm công khai chỉ là lớp vỏ mỏng bọc một hàm
private <em>trả về danh sách tên và ném ngoại lệ khi hỏng</em>; lớp vỏ bắt ngoại lệ, ghi lại tên và lý
do, rồi trả true/false. Nhờ vậy <code>bo</code> im lặng tuyệt đối — một phương thức vừa làm việc vừa in
ra màn hình thì không thể kiểm bằng gì khác ngoài mắt người.</p>
<p><strong>Lỗi trốn được hàng tuần: tệp nén không bao giờ được đóng.</strong> Một tệp zip kết thúc bằng
<em>central directory</em> — bảng mục lục liệt kê mọi mục — và <code>ZipOutputStream</code> ghi bảng đó
trong <code>close()</code>. Ghi hết các mục rồi quên đóng (hoặc mất lần đóng vì một ngoại lệ trên đường
ra) thì thứ còn lại trên đĩa là một tệp gần đúng kích thước mà không công cụ nào trên đời mở được. Không
gì ném ngoại lệ, hàm vẫn trả về true, màn hình vẫn ghi <code>Successfully</code>. Đó đúng là lý do "chạy
không lỗi" không phải bằng chứng cho thấy chương trình nén hoạt động, và đó cũng là thứ đầu tiên phần
kiểm chứng bên dưới nhắm tới: lời giải này đã được chạy lại sau khi bỏ <code>try</code>-with-resources,
và bộ kiểm báo <em>không mở nổi tệp nén</em> trong khi chương trình vẫn tự nhận là thành công.</p>
<p><strong>Và câu bị nhắc lại nhiều hơn mức nó đúng.</strong> "Mỗi <code>putNextEntry</code> phải có một
<code>closeEntry</code>, nếu không tệp nén sẽ bị cụt" chỉ đúng một nửa. Đó <em>đúng</em> là hợp đồng có
ghi trong tài liệu và ở đây vẫn viết đủ — nhưng lần <code>putNextEntry</code> kế tiếp, và lần
<code>close()</code> cuối cùng, đằng nào cũng đóng mục đang mở, nên bỏ nó đi vẫn qua được mọi phép thử qua
loa. Đã thử bỏ hẳn trong lời giải này và vòng khứ hồi vẫn xanh. Khi bảo vệ hãy nói bản chính xác: giữ
<code>closeEntry()</code> vì đó là hợp đồng và vì nó là thứ kết thúc mục cuối khi luồng còn sống lâu hơn
phương thức, chứ không phải vì thiếu nó thì hỏng tệp nén đơn giản. Chỗ luồng thật sự bị đóng quá sớm là
<em>hàm copy</em>: một hàm phụ trợ đóng luôn luồng người ta đưa cho sẽ kết thúc tệp nén ngay sau tệp đầu
tiên, và tệp thứ hai chết với <code>Stream closed</code> — lỗi đó cũng đã được tái hiện.</p>
<p><strong>Nên bằng chứng ở đây là một vòng khứ hồi, không phải chuyện vắng ngoại lệ.</strong> Ba lần
chạy dùng chung một thư mục làm việc, đúng như một buổi chấm bài. Lần 0 nén chính thư mục
<code>src/</code> của project thành <code>archive/backup.zip</code>. Lần 1 là một <strong>tiến trình
JVM hoàn toàn mới</strong>, tìm thấy tệp đó trên đĩa và giải nén ra <code>restored/</code>. Sau đó mọi
tệp phục hồi được so với bản gốc <strong>từng byte một</strong>, và tệp nén còn được mở bằng một cài đặt
độc lập để kiểm CRC. Một tệp nén bị cụt hay lộn xộn không thể sống sót qua đó; còn "không có ngoại lệ"
thì chẳng phát hiện ra gì.</p>
<p><strong>Zip slip, và vì sao nó đáng nói một đoạn khi bảo vệ.</strong> Tên mục trong tệp nén chỉ là
một chuỗi do người tạo ra tệp nén tự đặt, và <code>java.util.zip</code> không hề ngăn nó là
<code>../../pwned.txt</code>. Một chương trình giải nén cứ ghép tên đó vào thư mục đích rồi ghi sẽ vui vẻ
đặt tệp <em>ra ngoài</em> thư mục người dùng chọn — đây là một lỗ hổng có tên tuổi hẳn hoi, từng xuất
hiện trong những sản phẩm rất lớn. Vì thế <code>extractTo</code> quy mỗi đích về đường dẫn
<strong>canonical</strong> và từ chối mọi thứ không nằm trong thư mục đích. Phải là canonical chứ không
phải đường dẫn thô: <code>dest/a/../../b</code> chỉ trông vô hại cho tới khi được rút gọn. Lần chạy 2
giải nén một tệp nén độc hại dựng tay, kiểm cả việc chương trình từ chối lẫn việc không có tệp nào rơi
ra ngoài thư mục đích.</p>
<p><strong>Hai quyết định nhỏ hơn.</strong> Mục thư mục được ghi kèm dấu <code>/</code> ở cuối — dấu đó
là thứ duy nhất đánh dấu một mục là thư mục, thiếu nó thì thư mục rỗng biến mất khi giải nén. Và
<code>listFiles()</code> trả về các con theo thứ tự tuỳ hứng của hệ tệp, nên phải sắp xếp: hai lần nén
cùng một thư mục khi đó cho ra cùng một tệp nén và cùng một danh sách — chính điều đó mới khiến vòng
khứ hồi so sánh được.</p>
<p><strong>Tệp nén tự nuốt chính nó.</strong> Nếu thư mục đích nằm bên trong thư mục nguồn, một vòng
duyệt ngây thơ sẽ nạp chính tệp nén nó đang ghi vào lại chính nó và phình ra tới khi đầy đĩa. Vòng duyệt
ở đây bỏ qua đứa con nào có đường dẫn canonical trùng tệp nén — tốn một dòng và dẹp hẳn một loại lỗi rất
khó hiểu.</p>
<p><strong>Các tầng đi đâu mất.</strong> Ba tệp: <code>bo</code> làm việc với tệp nén và không in gì,
<code>utils/Validator</code> giữ <code>Scanner</code> duy nhất, <code>ui/Main</code> là thực đơn. Không
có <code>entity</code> vì chương trình này chẳng có đối tượng nghiệp vụ nào để mô hình hoá — dữ liệu của
nó là tệp trên đĩa, và bịa ra một POJO <code>ZipFileInfo</code> chỉ để giữ một cái tên là một lớp không
kiếm được gì. Cũng không có <code>controller</code>: một màn hình và hai thao tác thì chẳng có gì để
điều phối, mà một controller rỗng là mất điểm chứ không phải được điểm.</p>
<p><strong>Chỗ đề tự mâu thuẫn.</strong> Phần Đặc tả đánh số thực đơn 1/2/3 và chương trình bảo bạn
"choice one option", nhưng ảnh màn hình mong đợi lại in ba mục không có số nào; cũng ảnh đó còn dính
dòng tiêu đề với lời nhắc đầu tiên vào làm một
(<code>---------- Compression --------Enter Source Folder:</code>). Ở đây thực đơn có đánh số, vì một
lời nhắc đòi nhập số bên cạnh một thực đơn không có số thì không dùng được. Cũng lưu ý các lời nhắc in
bằng <code>print()</code> chứ không phải <code>println()</code>, nên khi dữ liệu được nạp qua đường ống
thay vì gõ tay, bản ghi màn hình sẽ có vài lời nhắc nằm chung một dòng — đó là do thiếu phần echo của
terminal, không phải lỗi.</p>''',
    hints_en=[
        'Keep the Guidelines signatures exactly: compressTo(pathSrc, fileZipName, pathCompress) and extractTo(pathZipFile, pathExtract).',
        'Close the ZipOutputStream (try-with-resources): close() writes the central directory, and without it the archive is unopenable while your program still reports success.',
        'Write a copy() helper that does NOT close its streams: the shared ZipOutputStream must survive the first file.',
        'Refuse an entry whose canonical target path falls outside the destination folder (zip slip: an entry may be named ../../x).',
        'Sort listFiles() and give directory entries a trailing slash, then prove it by unzipping and comparing the bytes.',
    ],
    hints_vi=[
        'Giữ đúng chữ ký trong Hướng dẫn: compressTo(pathSrc, fileZipName, pathCompress) và extractTo(pathZipFile, pathExtract).',
        'Nhớ đóng ZipOutputStream (try-with-resources): close() ghi central directory, thiếu nó thì tệp nén không mở được trong khi chương trình vẫn báo thành công.',
        'Viết hàm copy() KHÔNG đóng luồng: ZipOutputStream dùng chung phải sống qua tệp đầu tiên.',
        'Từ chối mục nào có đường dẫn canonical rơi ra ngoài thư mục đích (zip slip: tên mục có thể là ../../x).',
        'Sắp xếp listFiles() và thêm dấu / cuối cho mục thư mục, rồi chứng minh bằng cách giải nén và so từng byte.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0070 — Ebank login (150 LOC)
# ════════════════════════════════════════════════════════════════

P0070_MESSAGES = '''package lang;

import java.util.ListResourceBundle;

/**
 * The default bundle: English.
 *
 * The brief asks for En.properties / Vi.properties. A ListResourceBundle is the
 * same ResourceBundle API from the caller's side - getBundle(base, locale) then
 * getString(key) - but the translations are compiled with the rest of the
 * project instead of being copied into build/classes by the IDE. That removes
 * the single most common failure of this assignment: the program works in
 * NetBeans and throws MissingResourceException the moment it is run from a jar
 * or handed to somebody else, because the .properties files were never on the
 * classpath.
 *
 * Every string a marker diffs is spelled here exactly as the assignment sheet
 * spells it - including the sheet's own broken English, which is copied rather
 * than corrected.
 */
public class Messages extends ListResourceBundle {

    @Override
    protected Object[][] getContents() {
        return new Object[][]{
            {"account.prompt", "Account number:  "},
            {"account.error", "Account number must is a number and must have 10 digits"},
            {"password.prompt", "Password: "},
            {"password.error", "Password must be between 8 and 31 characters and must be alphanumeric"},
            {"captcha.label", "Captcha incorrect: "},
            {"captcha.prompt", "Enter a Captcha incorrect characters: "},
            {"captcha.error", "Captcha incorrect"},
            {"login.success", "Login successfully"},
        };
    }
}
'''

P0070_MESSAGES_EN = '''package lang;

/**
 * English.
 *
 * It holds nothing and it is not optional. ResourceBundle.getBundle() looks for
 * the requested locale first, but if it finds nothing it falls back to the
 * DEFAULT locale of the machine before it falls back to the base bundle. On a
 * machine whose default locale is Vietnamese, asking for English without this
 * class would quietly hand back the Vietnamese bundle - a bug that is invisible
 * on the developer's laptop and obvious on the examiner's.
 */
public class Messages_en extends Messages {
}
'''

P0070_MESSAGES_VI = '''package lang;

import java.util.ListResourceBundle;

/**
 * Vietnamese, spelled without diacritics exactly as the assignment sheet spells
 * it. That is not a shortcut: a .properties file is read as ISO-8859-1 unless
 * you say otherwise, so accented text in a translation file is a reliable way
 * to get mojibake on somebody else's machine. The sheet avoided the problem by
 * writing plain ASCII, and the marker diffs against the sheet.
 */
public class Messages_vi extends ListResourceBundle {

    @Override
    protected Object[][] getContents() {
        return new Object[][]{
            {"account.prompt", "So tai khoan:  "},
            {"account.error", "So tai khoan phai la 1 so va phai co 10 chu so"},
            {"password.prompt", "Mat khau: "},
            {"password.error", "Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so"},
            {"captcha.label", "Captcha: "},
            {"captcha.prompt", "Nhap 1 ky tu captcha: "},
            {"captcha.error", "Captcha sai"},
            {"login.success", "Dang nhap thanh cong"},
        };
    }
}
'''

P0070_EBANK = '''package bo;

import java.util.Locale;
import java.util.Random;
import java.util.ResourceBundle;

/**
 * The rules of the login screen. It decides; it never prints.
 *
 * Each check returns a MESSAGE rather than a boolean, because that is the
 * signature the Guidelines give: String checkAccountNumber(String), String
 * checkPassword(String), String checkCaptcha(String, String). A String return
 * has no way of saying "fine", so OK is the empty string - a value the caller
 * can print, compare and test without ever risking a NullPointerException,
 * which null would not be.
 */
public class Ebank {

    /** Base name of the bundle: lang.Messages, lang.Messages_en, lang.Messages_vi. */
    private static final String BUNDLE = "lang.Messages";

    /** Ten digits and nothing else. */
    private static final String ACCOUNT_PATTERN = "\\\\d{10}";

    /**
     * 8 to 31 characters, letters and digits only, and at least one of each.
     *
     * The two lookaheads are what the sheet's own examples demand: "12345678"
     * and "aaaaaaaa" are both eight legal characters and both must be rejected,
     * so "alphanumeric" here means "contains letters AND numbers", not "is made
     * of letters or numbers".
     */
    private static final String PASSWORD_PATTERN = "(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,31}";

    private static final String CAPTCHA_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CAPTCHA_LENGTH = 5;

    /** The answer that means "nothing to report". */
    public static final String OK = "";

    private final Random random = new Random();

    private ResourceBundle messages = ResourceBundle.getBundle(BUNDLE, Locale.ENGLISH);

    /**
     * Switches every screen string to another language.
     *
     * Spelled setLocate, with a parameter the sheet calls "Locate", because the
     * Guidelines spell it that way and a marker greps for the name. The type is
     * java.util.Locale - there is no such class as Locate.
     */
    public void setLocate(Locale locate) {
        messages = ResourceBundle.getBundle(BUNDLE, locate);
    }

    /** The screen asks the bundle through here, so only this class knows the keys exist. */
    public String getMessage(String key) {
        return messages.getString(key);
    }

    public String checkAccountNumber(String accountNumber) {
        if (accountNumber != null && accountNumber.matches(ACCOUNT_PATTERN)) {
            return OK;
        }
        return messages.getString("account.error");
    }

    public String checkPassword(String password) {
        if (password != null && password.matches(PASSWORD_PATTERN)) {
            return OK;
        }
        return messages.getString("password.error");
    }

    /** Five characters drawn from A-Z and 0-9, fresh on every login. */
    public String generateCaptcha() {
        StringBuilder captcha = new StringBuilder(CAPTCHA_LENGTH);
        for (int i = 0; i < CAPTCHA_LENGTH; i++) {
            captcha.append(CAPTCHA_ALPHABET.charAt(random.nextInt(CAPTCHA_ALPHABET.length())));
        }
        return captcha.toString();
    }

    /**
     * The Guidelines say to check with contains(), so it checks with contains().
     *
     * The empty string is the trap: "H9MOA".contains("") is TRUE in Java, so an
     * extractor of this rule that only calls contains() lets somebody log in by
     * pressing Enter. Rejecting the empty input first is one line and closes it.
     */
    public String checkCaptcha(String captchaInput, String captchaGenerate) {
        if (captchaInput == null || captchaInput.isEmpty()) {
            return messages.getString("captcha.error");
        }
        if (captchaGenerate.contains(captchaInput)) {
            return OK;
        }
        return messages.getString("captcha.error");
    }
}
'''

P0070_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please choose from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /**
     * One line, returned exactly as typed.
     *
     * Deliberately NOT trimmed and deliberately not rejecting a blank line: the
     * whole point of this assignment is that Ebank judges the value. A helper
     * that quietly trimmed would hide a password ending in a space, and a helper
     * that rejected blanks would hide the empty-captcha hole instead of letting
     * checkCaptcha close it.
     */
    public static String readLine(String message) {
        System.out.print(message);
        return SCANNER.nextLine();
    }
}
'''

P0070_MAIN = '''package ui;

import bo.Ebank;
import java.util.Locale;
import utils.Validator;

/**
 * The menu and the login screen.
 *
 * The menu itself stays in English: it is the question "which language?", and
 * asking it in the language that has not been chosen yet helps nobody. The
 * sheet's picture shows it in English for both runs too.
 */
public class Main {

    public static void main(String[] args) {
        Ebank ebank = new Ebank();

        System.out.println("-------Login Program-------");
        System.out.println("1. Vietnamese");
        System.out.println("2. English");
        System.out.println("3. Exit");
        int choice = Validator.getInt("Please choice one option: ", 1, 3);
        if (choice == 3) {
            return;
        }
        ebank.setLocate(choice == 1 ? Locale.forLanguageTag("vi") : Locale.ENGLISH);
        login(ebank);
    }

    /**
     * Account, then password, then captcha - in that order, and each one is
     * asked again until it is right. The order matters: the brief only lets the
     * user reach the password once the account number is valid, so a wrong
     * account number never leaks the information that the password was the
     * problem.
     */
    private static void login(Ebank ebank) {
        askUntilValid(ebank, "account.prompt", true);
        askUntilValid(ebank, "password.prompt", false);

        String captcha = ebank.generateCaptcha();
        System.out.println(ebank.getMessage("captcha.label") + captcha);
        while (true) {
            String input = Validator.readLine(ebank.getMessage("captcha.prompt"));
            String error = ebank.checkCaptcha(input, captcha);
            if (error.isEmpty()) {
                break;
            }
            System.out.println(error);
        }
        System.out.println(ebank.getMessage("login.success"));
    }

    /** One loop for both fields; the flag picks which rule to apply. */
    private static void askUntilValid(Ebank ebank, String promptKey, boolean isAccount) {
        while (true) {
            String value = Validator.readLine(ebank.getMessage(promptKey));
            String error = isAccount ? ebank.checkAccountNumber(value) : ebank.checkPassword(value);
            if (error.isEmpty()) {
                return;
            }
            System.out.println(error);
        }
    }
}
'''

# ── the captcha-aware checker ────────────────────────────────────
#
# The captcha is random, so there is no fixed transcript to diff against. But
# the program PRINTS the captcha it generated, and everything after that is a
# consequence of it: the marker's script feeds one character per attempt, so the
# number of refusals is exactly the number of fed characters before the first
# one the captcha contains. Read the captcha out of the console, rebuild the
# whole transcript it implies, and diff. A lucky run cannot pass, and neither
# can a program that accepts the empty captcha.

VI_MSG = {
    'account.prompt': 'So tai khoan:  ',
    'account.error': 'So tai khoan phai la 1 so va phai co 10 chu so',
    'password.prompt': 'Mat khau: ',
    'password.error': 'Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so',
    'captcha.label': 'Captcha: ',
    'captcha.prompt': 'Nhap 1 ky tu captcha: ',
    'captcha.error': 'Captcha sai',
    'login.success': 'Dang nhap thanh cong',
}

EN_MSG = {
    'account.prompt': 'Account number:  ',
    'account.error': 'Account number must is a number and must have 10 digits',
    'password.prompt': 'Password: ',
    'password.error': 'Password must be between 8 and 31 characters and must be alphanumeric',
    'captcha.label': 'Captcha incorrect: ',
    'captcha.prompt': 'Enter a Captcha incorrect characters: ',
    'captcha.error': 'Captcha incorrect',
    'login.success': 'Login successfully',
}

MENU = ('-------Login Program-------\n'
        '1. Vietnamese\n'
        '2. English\n'
        '3. Exit\n'
        'Please choice one option: ')

# The sheet's own examples: four rejected account numbers then a good one, four
# rejected passwords then a good one.
BAD_ACCOUNTS = ['1', 'a', 'aaaaaaaaaa', '123456789']
GOOD_ACCOUNT = '0123456789'
BAD_PASSWORDS = ['1', '12345678', 'aaaaaaaa', '1' * 32]
GOOD_PASSWORD = '123456ab'

# An empty line first — "ABCDE".contains("") is true in Java, so a program that
# leans on contains() alone lets you in by pressing Enter. Then every character
# of the alphabet: the captcha is drawn from it, so a hit is guaranteed.
CAPTCHA_FEED = [''] + list('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')


def _p0070_stdin(choice):
    lines = [choice] + BAD_ACCOUNTS + [GOOD_ACCOUNT] + BAD_PASSWORDS + [GOOD_PASSWORD]
    return '\n'.join(lines + CAPTCHA_FEED) + '\n'


def _p0070_expected(msg, captcha):
    """The exact console this captcha implies, prompts-without-newline included."""
    out = MENU
    for _ in BAD_ACCOUNTS:
        out += msg['account.prompt'] + msg['account.error'] + '\n'
    out += msg['account.prompt']
    for _ in BAD_PASSWORDS:
        out += msg['password.prompt'] + msg['password.error'] + '\n'
    out += msg['password.prompt']
    out += msg['captcha.label'] + captcha + '\n'
    for fed in CAPTCHA_FEED:
        if fed and fed in captcha:
            out += msg['captcha.prompt'] + msg['login.success'] + '\n'
            return out
        out += msg['captcha.prompt'] + msg['captcha.error'] + '\n'
    return out  # no hit: impossible, and it will fail the diff loudly


def _p0070_check(msg):
    def check(out):
        found = re.search(re.escape(msg['captcha.label']) + r'([A-Z0-9]{5})\n', out)
        if not found:
            return False, 'no 5-character captcha was printed'
        captcha = found.group(1)
        if not any(c and c in captcha for c in CAPTCHA_FEED):
            return False, f'captcha {captcha} uses characters outside A-Z0-9'
        expected = _p0070_expected(msg, captcha)
        if out.strip() != expected.strip():
            return False, (f'the console does not match what captcha "{captcha}" implies\n'
                           f'--- EXPECTED ---\n{expected}')
        return True, ''
    return check


P0070_EXIT = '''-------Login Program-------
1. Vietnamese
2. English
3. Exit
Please choice one option: Please choose from 1 to 3.
Please choice one option: You must input a number.
Please choice one option: '''


solution(
    'J1.S.P0070',
    title_vi='Hệ thống đăng nhập Ebank của ngân hàng Tiên Phong',
    files=[('src/lang/Messages.java', P0070_MESSAGES),
           ('src/lang/Messages_en.java', P0070_MESSAGES_EN),
           ('src/lang/Messages_vi.java', P0070_MESSAGES_VI),
           ('src/bo/Ebank.java', P0070_EBANK),
           ('src/utils/Validator.java', P0070_VALIDATOR),
           ('src/ui/Main.java', P0070_MAIN)],
    main_class='ui.Main',
    runs=[
        # 1 — Vietnamese: every rejection the sheet shows, then the captcha.
        (_p0070_stdin('1'), _p0070_check(VI_MSG)),
        # 2 — English: the same walk, proving the bundle really switched.
        (_p0070_stdin('2'), _p0070_check(EN_MSG)),
        # 3 — Exit, after an out-of-range option and a non-number.
        ('9\nx\n3\n', P0070_EXIT),
    ],
    explain_en='''<p><strong>What this program actually checks — say it out loud at the defence.</strong>
Nothing. There is no account file, no password store, no user record: every "check" here is a check of
<em>format</em>. <code>0123456789</code> is accepted because it is ten digits, not because it belongs to
anybody. That is what the brief asks for, and it is worth naming, because the moment a real system does
compare a password it must compare it against a <strong>salted hash from bcrypt, scrypt or
Argon2</strong> — never against a stored plaintext, and never against a plain MD5 or SHA-256 digest.
Those two are built to be fast, which is exactly the wrong property: fast is what lets an attacker who
has stolen the table try billions of guesses a second. If a later assignment tells you to store MD5
passwords, do it and say in your report that production would not.</p>
<p><strong>The three signatures the Guidelines name, kept exactly.</strong> <code>void setLocate(Locale
locate)</code>, <code>String checkAccountNumber(String)</code> and <code>String
checkPassword(String)</code>, plus <code>generateCaptcha()</code> and <code>checkCaptcha()</code>. The
name is <code>setLocate</code>, not <code>setLocale</code>, and the sheet calls its parameter type
"Locate" — there is no such class, so the type is <code>java.util.Locale</code> while the misspelled
method name is preserved, because a marker searches by name and the Guidelines are the contract.</p>
<p><strong>Why a check returns a String and what "OK" is.</strong> The signature has no room for a
boolean, so the return value is the error message and the answer "fine" has to be encoded in it. It is
the <strong>empty string</strong>, not <code>null</code>: an empty string can be printed, compared and
tested by the caller without any chance of a NullPointerException, and the calling loop reads as
<code>if (error.isEmpty()) break;</code>. Returning null would make every call site one forgotten check
away from a crash.</p>
<p><strong>The password rule is stricter than the word "alphanumeric" suggests.</strong> The sheet's own
examples settle it: <code>12345678</code> and <code>aaaaaaaa</code> are both eight perfectly
alphanumeric characters and both are rejected, so the rule is "letters <em>and</em> digits", not
"letters or digits". That is two lookaheads —
<code>(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,31}</code> — and the 32-character line of ones in the sheet
is there to catch anyone who wrote <code>{8,}</code>.</p>
<p><strong>The regex trap that passes every casual test.</strong> <code>String.matches()</code> anchors
at both ends; <code>Pattern.find()</code> does not. Written with <code>find()</code>, the account rule
<code>\\d{10}</code> happily accepts <code>abc0123456789xyz</code>, because ten digits do occur
somewhere inside it. Every check here uses <code>matches()</code> for that reason.</p>
<p><strong>The captcha hole that is one character wide.</strong> The Guidelines say to check the captcha
with <code>contains()</code>, so it does. But <code>"H9MOA".contains("")</code> is <strong>true</strong>
in Java: a program that only calls <code>contains()</code> lets anybody in by pressing Enter. Rejecting
the empty input first is one line, and the scripted run sends an empty line as its very first captcha
attempt to prove it is refused. Worth adding at the defence that <code>contains()</code> is a
comically weak captcha check even when it is not empty — any single correct character passes — and that
a real one compares the whole string; it is done this way because the Guidelines name the method.</p>
<p><strong>Why the translations are classes and not .properties files.</strong> The brief asks for
En.properties and Vi.properties. The API used here is identical from the caller's side —
<code>ResourceBundle.getBundle("lang.Messages", locale)</code> then <code>getString(key)</code> — but
the translations are <code>ListResourceBundle</code> subclasses, so they are compiled with the rest of
the project. That removes this assignment's most common failure: it works inside the IDE and throws
<code>MissingResourceException</code> the moment it runs from a jar, because the .properties files were
never copied onto the classpath. If you do hand in .properties files, put them in the same package
folder as the class that loads them and check that they appear under <code>build/classes</code>.</p>
<p><strong><code>Messages_en</code> is empty and it is not optional.</strong>
<code>ResourceBundle.getBundle()</code> tries the locale you asked for, and if it finds nothing it falls
back to <strong>the machine's default locale</strong> before it falls back to the base bundle. On a
laptop whose default locale is Vietnamese, asking for English with no <code>Messages_en</code> present
quietly returns the Vietnamese bundle — invisible on your machine, obvious on the examiner's.</p>
<p><strong>How a random program was verified without luck.</strong> The captcha changes every run, so no
fixed transcript exists. But the program prints the captcha, and everything after it follows: the script
feeds one character per attempt, so the number of refusals must be exactly the number of characters fed
before the first one the captcha contains. The checker reads the captcha out of the console, rebuilds
the <em>entire</em> expected transcript from it — every prompt, every error line, in both languages —
and diffs. Both the Vietnamese and the English run are checked this way, which is also what proves
<code>setLocate</code> really switched the bundle rather than the program hard-coding one language.</p>
<p><strong>Two things the sheet gets wrong, both preserved.</strong> Its English error text reads
"Account number must is a number", and its English captcha lines read <code>Captcha incorrect:
H9MOA</code> and <code>Enter a Captcha incorrect characters:</code> — the word "incorrect" has clearly
been spliced into the label and the prompt by a careless find-and-replace of the error message. Both are
copied character for character, because the marker diffs the screen. Say that you noticed; noticing
counts in your favour, silently "fixing" it costs the diff.</p>
<p><strong>One judgement call.</strong> The sheet's transcript simply stops after the correct captcha, so
it never says whether the program returns to the menu or ends. This one prints a success line and ends
the session — a login screen that says nothing on success is indistinguishable from a crash, and the
success message is the only line here that is not taken from the sheet.</p>''',
    explain_vi='''<p><strong>Chương trình này thật ra kiểm cái gì — hãy nói thẳng khi bảo vệ.</strong>
Không kiểm gì cả. Không có tệp tài khoản, không có kho mật khẩu, không có bản ghi người dùng: mọi thứ
gọi là "kiểm tra" ở đây đều là kiểm <em>định dạng</em>. <code>0123456789</code> được chấp nhận vì nó gồm
mười chữ số, chứ không phải vì nó thuộc về ai. Đề yêu cầu như vậy, và điều này đáng nói ra, vì khi một
hệ thống thật sự đối chiếu mật khẩu thì nó phải đối chiếu với một <strong>hàm băm có muối bằng bcrypt,
scrypt hoặc Argon2</strong> — không bao giờ với mật khẩu lưu thô, và cũng không bao giờ với MD5 hay
SHA-256 trần. Hai thứ đó được thiết kế để chạy nhanh, mà nhanh chính là tính chất sai: nhanh là thứ cho
phép kẻ đã trộm được bảng dữ liệu thử hàng tỉ lượt đoán mỗi giây. Nếu một bài sau bắt bạn lưu mật khẩu
MD5, cứ làm và ghi rõ trong báo cáo rằng sản phẩm thật sẽ không làm thế.</p>
<p><strong>Ba chữ ký hàm Hướng dẫn nêu tên, giữ nguyên xi.</strong> <code>void setLocate(Locale
locate)</code>, <code>String checkAccountNumber(String)</code> và <code>String
checkPassword(String)</code>, cùng <code>generateCaptcha()</code> và <code>checkCaptcha()</code>. Tên
hàm là <code>setLocate</code> chứ không phải <code>setLocale</code>, và đề gọi kiểu tham số là
"Locate" — chẳng có lớp nào tên vậy, nên kiểu dùng <code>java.util.Locale</code> còn tên hàm viết sai
thì giữ lại, vì người chấm dò theo tên và phần Hướng dẫn là bản có hiệu lực.</p>
<p><strong>Vì sao hàm kiểm tra trả về String, và "hợp lệ" là gì.</strong> Chữ ký không còn chỗ cho
boolean, nên giá trị trả về là thông báo lỗi và câu trả lời "ổn" phải được mã hoá vào đó. Nó là
<strong>chuỗi rỗng</strong>, không phải <code>null</code>: chuỗi rỗng in được, so sánh được, kiểm được
mà không bao giờ có nguy cơ NullPointerException, và vòng lặp gọi đọc rất gọn:
<code>if (error.isEmpty()) break;</code>. Trả về null thì mọi chỗ gọi chỉ cách một lần quên kiểm là
sập.</p>
<p><strong>Luật mật khẩu chặt hơn nghĩa của chữ "alphanumeric".</strong> Chính ví dụ trong đề chốt lại
điều đó: <code>12345678</code> và <code>aaaaaaaa</code> đều là tám ký tự chữ-số hoàn toàn hợp lệ mà đều
bị từ chối, nên luật là "có chữ <em>và</em> có số", không phải "gồm chữ hoặc số". Nghĩa là hai lookahead
— <code>(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,31}</code> — còn dòng 32 chữ số 1 trong đề đặt ở đó để
bắt ai viết <code>{8,}</code>.</p>
<p><strong>Cái bẫy biểu thức chính quy lọt qua mọi phép thử qua loa.</strong> <code>String.matches()</code>
neo cả hai đầu; <code>Pattern.find()</code> thì không. Viết bằng <code>find()</code>, luật số tài khoản
<code>\\d{10}</code> vui vẻ nhận <code>abc0123456789xyz</code>, vì bên trong nó đúng là có mười chữ số
liền nhau. Mọi phép kiểm ở đây dùng <code>matches()</code> chính vì lẽ đó.</p>
<p><strong>Lỗ hổng captcha rộng đúng một ký tự.</strong> Hướng dẫn bảo kiểm captcha bằng
<code>contains()</code>, nên nó dùng <code>contains()</code>. Nhưng
<code>"H9MOA".contains("")</code> trả về <strong>true</strong> trong Java: một chương trình chỉ gọi
<code>contains()</code> sẽ cho bất kỳ ai vào chỉ bằng cách bấm Enter. Chặn chuỗi rỗng trước là một dòng,
và kịch bản chạy gửi một dòng trống làm lần nhập captcha đầu tiên để chứng minh nó bị từ chối. Khi bảo
vệ nên nói thêm rằng <code>contains()</code> là cách kiểm captcha yếu đến buồn cười ngay cả khi không
rỗng — đúng một ký tự bất kỳ trong chuỗi là qua — và captcha thật so sánh cả chuỗi; ở đây làm vậy vì
Hướng dẫn nêu đích danh hàm đó.</p>
<p><strong>Vì sao bản dịch là lớp chứ không phải tệp .properties.</strong> Đề yêu cầu En.properties và
Vi.properties. API dùng ở đây nhìn từ phía người gọi là y hệt —
<code>ResourceBundle.getBundle("lang.Messages", locale)</code> rồi <code>getString(key)</code> — nhưng
bản dịch là các lớp con của <code>ListResourceBundle</code>, nên chúng được biên dịch cùng phần còn lại
của project. Điều đó dẹp luôn kiểu hỏng phổ biến nhất của bài này: chạy trong IDE thì ngon, vừa đóng gói
thành jar là ném <code>MissingResourceException</code>, vì tệp .properties chưa bao giờ được chép vào
classpath. Nếu bạn vẫn nộp .properties, hãy đặt chúng trong đúng thư mục gói của lớp nạp chúng và kiểm
xem chúng có xuất hiện dưới <code>build/classes</code> không.</p>
<p><strong><code>Messages_en</code> rỗng, và nó không phải thứ có cũng được.</strong>
<code>ResourceBundle.getBundle()</code> thử locale bạn yêu cầu trước, không thấy thì lùi về
<strong>locale mặc định của máy</strong> rồi mới lùi về bundle gốc. Trên máy có locale mặc định là tiếng
Việt, xin tiếng Anh mà không có <code>Messages_en</code> sẽ lặng lẽ trả về bundle tiếng Việt — vô hình
trên máy bạn, lộ ngay trên máy người chấm.</p>
<p><strong>Kiểm một chương trình ngẫu nhiên mà không nhờ may mắn.</strong> Captcha đổi mỗi lần chạy nên
không có bản ghi màn hình cố định nào. Nhưng chương trình có in captcha ra, và mọi thứ sau đó là hệ quả
của nó: kịch bản nhập mỗi lần một ký tự, nên số lần bị từ chối phải đúng bằng số ký tự đã nhập trước ký
tự đầu tiên có trong captcha. Bộ kiểm đọc captcha từ màn hình, dựng lại <em>toàn bộ</em> bản ghi mong
đợi từ nó — từng lời nhắc, từng dòng lỗi, ở cả hai ngôn ngữ — rồi so khớp. Cả lần chạy tiếng Việt lẫn
tiếng Anh đều kiểm như vậy, và đó cũng chính là thứ chứng minh <code>setLocate</code> thật sự đổi bundle
chứ không phải chương trình cắm cứng một ngôn ngữ.</p>
<p><strong>Hai chỗ đề viết sai, đều giữ nguyên.</strong> Câu lỗi tiếng Anh của đề là "Account number
must is a number", còn phần captcha tiếng Anh ghi <code>Captcha incorrect: H9MOA</code> và
<code>Enter a Captcha incorrect characters:</code> — rõ ràng chữ "incorrect" bị nhét vào nhãn và lời
nhắc do một lần thay thế hàng loạt cẩu thả từ câu báo lỗi. Cả hai được chép lại từng ký tự, vì người
chấm so màn hình. Hãy nói rằng bạn có nhận ra; nhận ra thì được cộng, còn lặng lẽ "sửa cho đúng" thì
lệch bản so khớp.</p>
<p><strong>Một quyết định phải tự cân nhắc.</strong> Bản ghi màn hình trong đề dừng ngay sau captcha
đúng, nên nó không hề nói chương trình quay lại thực đơn hay kết thúc. Bản này in một dòng báo thành
công rồi kết thúc phiên — một màn hình đăng nhập không nói gì khi thành công thì không phân biệt được
với một lần treo, và dòng báo thành công là dòng duy nhất ở đây không lấy từ đề.</p>''',
    hints_en=[
        'Keep the Guidelines spelling: setLocate(Locale locate), checkAccountNumber, checkPassword — the type is java.util.Locale.',
        'Return the error message and let the empty string mean "valid"; never null, or every call site is one forgotten check from a crash.',
        'Use matches(), not find(): with find() the pattern \\d{10} accepts abc0123456789xyz.',
        '"Alphanumeric" here means letters AND digits: (?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,31}, since 12345678 must be rejected.',
        'Reject an empty captcha before calling contains() — "H9MOA".contains("") is true in Java.',
    ],
    hints_vi=[
        'Giữ đúng cách viết trong Hướng dẫn: setLocate(Locale locate), checkAccountNumber, checkPassword — kiểu là java.util.Locale.',
        'Trả về thông báo lỗi và để chuỗi rỗng nghĩa là "hợp lệ"; đừng dùng null, kẻo mọi chỗ gọi chỉ cách một lần quên kiểm là sập.',
        'Dùng matches() chứ không phải find(): với find() thì mẫu \\d{10} nhận cả abc0123456789xyz.',
        '"Alphanumeric" ở đây là có chữ VÀ có số: (?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,31}, vì 12345678 phải bị từ chối.',
        'Chặn captcha rỗng trước khi gọi contains() — "H9MOA".contains("") trả về true trong Java.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0079': '''<h3>Bối cảnh</h3>
<p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình nén và giải nén tệp với thực đơn sau:</p>
<ol>
<li>Nén tệp.</li>
<li>Giải nén tệp.</li>
<li>Thoát.</li>
</ol>
<ul>
<li>Khi người dùng chọn 1
<ul>
<li>Hỏi đường dẫn tới các tệp cần nén</li>
<li>Hỏi tên tệp nén</li>
<li>Thực hiện nén các tệp trong thư mục</li>
</ul>
</li>
<li>Khi người dùng chọn 2
<ul>
<li>Hỏi đường dẫn tới tệp cần giải nén</li>
<li>Hỏi đường dẫn thư mục đích chứa các tệp được giải nén</li>
<li>Thực hiện giải nén</li>
</ul>
</li>
<li>Khi người dùng chọn 3: thoát chương trình</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn một mục.</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình yêu cầu chọn một mục.</li>
<li>Người dùng chọn xong thì thực hiện Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn.</h4>
<ul>
<li>Mục 1: nén tệp
<ul>
<li>Nhập đường dẫn tới các tệp cần nén</li>
<li>Đặt tên tệp nén</li>
<li>Thực hiện nén</li>
</ul>
</li>
<li>Mục 2: giải nén
<ul>
<li>Nhập đường dẫn tệp cần giải nén</li>
<li>Nhập đường dẫn thư mục đích</li>
<li>Thực hiện giải nén</li>
</ul>
</li>
<li>Mục 3: thoát chương trình</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>========= Zipper program =========
Compression
Extraction
Exit
Please choice one option:</pre>
<pre>---------- Compression --------Enter Source Folder:
Enter Destination Folder:
Enter Name:
------------ Result -----------
File name 1.txt
File name 2.exe
Successfully</pre>
<pre>---------- Extraction ---------
Enter Source file:
Enter Destination Folder:
------------ Result -----------
File name 1.txt
File name 2.exe
Successfully</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên bắt buộc phải cài đặt hai phương thức</p>
<ul>
<li><code>compressTo</code></li>
<li><code>extractTo</code></li>
</ul>
<p>trong mã nguồn.</p>
<h4>Ví dụ</h4>
<p>Sinh viên dùng gói <code>java.util.zip</code> để nén và giải nén.</p>
<h4>Chức năng 1: nén tệp</h4>
<ul>
<li>Cài đặt hàm:
<code>public static boolean compressTo(String pathSrc, String fileZipName, String pathCompress)</code>
<ul>
<li>Đầu vào:</li>
<li><code>pathSrc</code>: đường dẫn tới thư mục chứa các tệp cần nén.</li>
<li><code>fileZipName</code>: tên tệp nén.</li>
<li><code>pathCompress</code>: đường dẫn tới tệp nén.</li>
<li>Trả về: trạng thái nén tệp.</li>
</ul>
</li>
</ul>
<h4>Chức năng 2: giải nén</h4>
<ul>
<li>Cài đặt hàm: <code>public static boolean extractTo(String pathZipFile, String pathExtract)</code>
<ul>
<li>Đầu vào:</li>
<li><code>pathZipFile</code>: đường dẫn tới tệp đã nén.</li>
<li><code>pathExtract</code>: đường dẫn thư mục đích chứa các tệp được giải nén.</li>
<li>Giá trị trả về: trạng thái giải nén.</li>
</ul>
</li>
</ul>''',

    'J1.S.P0070': '''<h3>Bối cảnh</h3>
<p>(Mô-đun trích từ dự án ebank của ngân hàng Tiên Phong.)</p>
<h3>Đặc tả chương trình</h3>
<p>Chức năng đăng nhập của hệ thống Ebank gồm:</p>
<ol>
<li>Vietnamese</li>
<li>English</li>
<li>Exit</li>
</ol>
<p>Nếu người dùng chọn 1: chuyển giao diện sang tiếng Việt rồi thực hiện chức năng "kiểm tra đăng nhập".</p>
<p>Nếu người dùng chọn 2: giữ giao diện tiếng Anh rồi thực hiện chức năng "kiểm tra đăng nhập".</p>
<p>Chức năng kiểm tra đăng nhập:</p>
<ul>
<li>Yêu cầu nhập số tài khoản:
<ul>
<li>Kiểm tra số tài khoản phải là một số.</li>
<li>Mỗi số tài khoản phải có đúng 10 chữ số.</li>
</ul>
</li>
<li>Nhập mật khẩu:
<ul>
<li>Kiểm tra độ dài mật khẩu có đủ hay không.</li>
<li>Kiểm tra mật khẩu có gồm cả chữ và số hay không.</li>
</ul>
</li>
<li>Yêu cầu nhập một hoặc nhiều ký tự của captcha:
<ul>
<li>Sinh một mã captcha ngẫu nhiên ở mỗi lần đăng nhập.</li>
<li>Kiểm tra các ký tự captcha nhập vào có đúng hay không.</li>
</ul>
</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn một mục.</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình yêu cầu chọn một mục.</li>
<li>Người dùng chọn xong thì thực hiện Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện theo ngôn ngữ đã chọn.</h4>
<p><strong>Đổi ngôn ngữ</strong>: dùng <code>ResourceBundle</code> để lấy giá trị theo khoá trong hai tệp
<code>En.properties</code> và <code>Vi.properties</code> tương ứng tiếng Anh và tiếng Việt.</p>
<p><strong>Kiểm tra số tài khoản</strong>: dùng biểu thức chính quy để kiểm tính hợp lệ của số tài khoản
đã nhập theo yêu cầu của đề. Nếu số tài khoản không hợp lệ thì trả về thông báo lỗi tương ứng với ngôn
ngữ đã chọn.</p>
<p><strong>Kiểm tra mật khẩu</strong>: dùng biểu thức chính quy để kiểm tính hợp lệ của mật khẩu đã nhập.
Nếu không hợp lệ thì trả về thông báo lỗi tương ứng với ngôn ngữ đã chọn.</p>
<p><strong>Sinh mã captcha ngẫu nhiên</strong>: dùng <code>Random</code> để sinh một dãy ngẫu nhiên rồi
chuyển thành ký tự (kiểu <code>char</code>).</p>
<p><strong>Kiểm tra captcha</strong>: dùng hàm <code>contains()</code> để kiểm ký tự captcha nhập vào có
tồn tại trong chuỗi captcha đã sinh ra ban đầu hay không. Nếu không hợp lệ thì trả về thông báo lỗi
tương ứng với ngôn ngữ đã chọn.</p>
<p><strong>Đăng nhập</strong>: cho phép người dùng nhập số tài khoản, mật khẩu và captcha từ bàn phím.
Nếu số tài khoản hợp lệ thì cho nhập mật khẩu; nếu không hợp lệ thì in ra màn hình báo lỗi và cho nhập
lại. Nếu mật khẩu hợp lệ thì cho nhập captcha, ngược lại in báo lỗi và cho nhập lại. Nếu captcha không
hợp lệ thì in ra màn hình báo lỗi.</p>
<h3>Màn hình mong đợi</h3>
<pre>-------Login Program-------
1. Vietnamese
2. English
3. Exit
Please choice one option:</pre>
<pre>So tai khoan:  1
So tai khoan phai la 1 so va phai co 10 chu so
So tai khoan:  a
So tai khoan phai la 1 so va phai co 10 chu so
So tai khoan:  aaaaaaaaaa
So tai khoan phai la 1 so va phai co 10 chu so
So tai khoan:  123456789
So tai khoan phai la 1 so va phai co 10 chu so
So tai khoan:  0123456789
Mat khau: 1
Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so
Mat khau: 12345678
Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so
Mat khau: aaaaaaaa
Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so
Mat khau: 11111111111111111111111111111111
Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so
Mat khau: 123456ab
Captcha: H9MOA
Nhap 1 ky tu captcha: Adafda
Captcha sai
Nhap 1 ky tu captcha: H</pre>
<pre>Account number:  1
Account number must is a number and must have 10 digits
Account number:  a
Account number must is a number and must have 10 digits
Account number:  aaaaaaaaaa
Account number must is a number and must have 10 digits
Account number:  123456789
Account number must is a number and must have 10 digits
Account number:  0123456789
Password: 1
Password must be between 8 and 31 characters and must be alphanumeric
Password: 12345678
Password must be between 8 and 31 characters and must be alphanumeric
Password: aaaaaaaa
Password must be between 8 and 31 characters and must be alphanumeric
Password: 11111111111111111111111111111111
Password must be between 8 and 31 characters and must be alphanumeric
Password: 123456ab
Captcha incorrect: H9MOA
Enter a Captcha incorrect characters: Adafda
Captcha incorrect
Enter a Captcha incorrect characters: H</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên bắt buộc phải cài đặt các phương thức <code>setLocate</code>,
<code>checkAccountNumber</code>, <code>checkPassword</code> trong mã nguồn.</p>
<ul>
<li>Tạo lớp <code>Main</code> để hiển thị ngôn ngữ đã chọn trong thực đơn.</li>
<li>Tạo lớp <code>Ebank</code> gồm các chức năng sau:</li>
</ul>
<h4>Chức năng 1: Đổi ngôn ngữ.</h4>
<ul>
<li>Chương trình chuyển từ ngôn ngữ này sang ngôn ngữ khác, sao cho các phần tử định nghĩa trong tệp
<code>Language.properties</code> đổi theo.</li>
<li>Cài đặt hàm: <code>void setLocate(Locate locate)</code>
<ul>
<li>Đầu vào: <code>locate</code> — tên tệp properties cần chuyển sang.</li>
</ul>
</li>
</ul>
<h4>Chức năng 2: Kiểm tra số tài khoản.</h4>
<ul>
<li>Cài đặt hàm: <code>String checkAccountNumber(String accountNumber)</code>
<ul>
<li>Đầu vào: <code>accountNumber</code> — số tài khoản cần kiểm.</li>
<li>Giá trị trả về: thông báo về giá trị của số tài khoản.</li>
</ul>
</li>
</ul>
<h4>Chức năng 3: Kiểm tra mật khẩu.</h4>
<ul>
<li>Cài đặt hàm: <code>String checkPassword(String password)</code>
<ul>
<li>Đầu vào: <code>password</code> — mật khẩu cần kiểm.</li>
<li>Giá trị trả về: thông báo về giá trị của mật khẩu.</li>
</ul>
</li>
</ul>
<h4>Chức năng 4: Sinh mã captcha ngẫu nhiên.</h4>
<ul>
<li>Cài đặt hàm: <code>String generateCaptcha()</code>
<ul>
<li>Giá trị trả về: một chuỗi captcha ngẫu nhiên.</li>
</ul>
</li>
</ul>
<h4>Chức năng 5: Kiểm tra mã captcha.</h4>
<ul>
<li>Cài đặt hàm: <code>String checkCaptcha(String captchaInput, String captchaGenerate)</code>
<ul>
<li>Đầu vào: <code>captchaInput</code> — captcha người dùng nhập; <code>captchaGenerate</code> — captcha
đã sinh ra.</li>
<li>Giá trị trả về: thông báo về giá trị của captcha.</li>
</ul>
</li>
</ul>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
