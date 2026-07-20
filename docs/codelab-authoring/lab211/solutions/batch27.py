# Batch 27 — J1.L.P0025 (Long Assignment, 450 LOC): read input.txt, normalize
# the text against seven written rules, write output.txt.
#
# Everything here was run before it was written down. In particular every claim
# in the walkthrough about String.split, Character.isWhitespace and
# toLowerCase was checked against a real JVM (Java 21) first — see the
# "What was measured" paragraph.
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.L.P0025 — Normalize text (450 LOC)
# ════════════════════════════════════════════════════════════════

P0025_DOCUMENT = '''package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * One document on its way through the program: where it came from, the lines
 * exactly as they were read, and the normalized text once the rules have run.
 *
 * It keeps BOTH forms on purpose. The screen shows "before" beside "after", and
 * a marker who cannot see the original has no way to judge whether the rules
 * did anything at all. Dropping the raw lines the moment they are normalized
 * would save a few bytes and throw away the only evidence the program has.
 *
 * The list is copied in and copied out. Handing back the internal List would
 * let a caller add a line to a document that has already been normalized, and
 * the "before" text would then no longer be the text the "after" came from.
 */
public class TextDocument implements Serializable {

    private static final long serialVersionUID = 1L;

    private String sourcePath;
    private List<String> rawLines;
    private String normalizedText;

    public TextDocument() {
        this.sourcePath = "";
        this.rawLines = new ArrayList<>();
        this.normalizedText = "";
    }

    public TextDocument(String sourcePath, List<String> rawLines) {
        this.sourcePath = sourcePath;
        this.rawLines = new ArrayList<>(rawLines);
        this.normalizedText = "";
    }

    public String getSourcePath() {
        return sourcePath;
    }

    public void setSourcePath(String sourcePath) {
        this.sourcePath = sourcePath;
    }

    public List<String> getRawLines() {
        return new ArrayList<>(rawLines);
    }

    public void setRawLines(List<String> rawLines) {
        this.rawLines = new ArrayList<>(rawLines);
    }

    public String getNormalizedText() {
        return normalizedText;
    }

    public void setNormalizedText(String normalizedText) {
        this.normalizedText = normalizedText;
    }

    public int getLineCount() {
        return rawLines.size();
    }

    @Override
    public String toString() {
        return "TextDocument{source=" + sourcePath
                + ", lines=" + rawLines.size()
                + ", normalized=" + normalizedText.length() + " chars}";
    }
}
'''

P0025_NORMALIZER = '''package bo;

import java.util.List;

/**
 * The seven rules from the brief, and nothing else. No printing, no files.
 *
 * WHY A HAND-WRITTEN SCANNER AND NOT A STACK OF replaceAll() CALLS
 * ----------------------------------------------------------------
 * The obvious way to write this is six regular expressions in a row. It falls
 * over for a reason that is easy to miss: the rules OVERLAP. "no space in front
 * of a dot" and "exactly one space after a dot" and "no space just inside a
 * quote" can all apply to the same three characters, and the result then
 * depends on which replaceAll ran first. Chains like that pass the brief's own
 * example and fail on `word . " ok` .
 *
 * Walking the string once, deciding each character with the characters already
 * emitted in view, removes the ordering question completely. Each pass below
 * has ONE job, and the passes are applied in an order that is stated and
 * defended rather than accidental.
 *
 * ORDER OF THE PASSES
 *   1. join      - many lines become one; blank lines disappear
 *   2. collapse  - every run of whitespace becomes exactly one space
 *   3. lower     - the whole text goes to lower case
 *   4. punctuate - ", . :" pulled onto the word in front, one space after
 *   5. quotes    - the spaces just inside a pair of quotes are removed
 *   6. capitals  - first letter of the text, and of every sentence, raised
 *   7. finalDot  - the text is made to end in a full stop
 *
 * lower() has to run BEFORE capitals(), or the capitals it just made would be
 * flattened again. capitals() has to run AFTER punctuate(), because it looks
 * for "a dot, then the next letter", and before punctuate() has run that dot
 * may still have a space in front of it and none behind.
 */
public class TextNormalizer {

    /**
     * The quotation marks the brief names, written as escapes rather than
     * pasted characters. A source file that only ever contains ASCII cannot be
     * broken by a compiler, an editor or a zip tool guessing the wrong
     * encoding, and this assignment is handed in as a zip.
     */
    public static final char OPEN_QUOTE = '\\u201C';   // "
    public static final char CLOSE_QUOTE = '\\u201D';  // "
    public static final char STRAIGHT_QUOTE = '"';

    /**
     * A non-breaking space. Character.isWhitespace('\\u00A0') is FALSE - checked
     * on a real JVM, not assumed - so a text pasted out of Word keeps invisible
     * characters that look exactly like spaces and are not collapsed by any
     * whitespace rule. It is listed by hand here for that reason.
     */
    private static final char NBSP = '\\u00A0';

    /** The characters the brief calls out: comma, dot, colon. */
    private static final String PUNCTUATION = ",.:";

    /**
     * The end of a piece of text. The brief only names the dot; "?" and "!" are
     * added because appending a dot to a question would produce "?." , which no
     * marker wants to read. This is a deliberate extension and is written down
     * in the walkthrough as one.
     */
    private static final String TERMINATORS = ".?!";

    /**
     * The whole job, for a document read from a file.
     *
     * Blank lines are dropped here rather than in the reader: the reader's job
     * is to report faithfully what is on the disk, and a reader that quietly
     * edits its input is a reader nobody can debug against.
     */
    public String normalize(List<String> lines) {
        StringBuilder joined = new StringBuilder();
        for (String line : lines) {
            if (isBlank(line)) {
                // "There are no blank line between lines" - a line that is
                // empty, or only spaces and tabs, contributes nothing.
                continue;
            }
            if (joined.length() > 0) {
                joined.append(' ');
            }
            joined.append(line);
        }
        return normalize(joined.toString());
    }

    /** The whole job, for one piece of text. */
    public String normalize(String text) {
        if (text == null) {
            return "";
        }
        String result = collapseSpaces(text);
        result = toLower(result);
        result = tightenPunctuation(result);
        result = tightenQuotes(result);
        result = applyCapitals(result);
        result = ensureFinalDot(result);
        return result;
    }

    // ── pass 2: one space between words ──────────────────────────

    /**
     * Every run of whitespace becomes a single space, and the ends are trimmed.
     *
     * This is where the tabs go. It is also why the program does NOT do
     * `text.split(" ")`: on "a    b" that produces FIVE pieces - "a", "", "",
     * "", "b" - because split cuts at every single space and keeps what is
     * between two of them. Rejoining those five pieces with a space puts the
     * four spaces straight back.
     */
    public String collapseSpaces(String text) {
        StringBuilder out = new StringBuilder();
        boolean pendingSpace = false;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (isSpace(c)) {
                // The space is only remembered, never written yet: a run of
                // twenty spaces at the end of the text must leave nothing
                // behind, and that is only knowable once a real character
                // turns up after it.
                pendingSpace = out.length() > 0;
            } else {
                if (pendingSpace) {
                    out.append(' ');
                    pendingSpace = false;
                }
                out.append(c);
            }
        }
        return out.toString();
    }

    // ── pass 3: everything down to lower case ────────────────────

    /**
     * "other words are in lower case", applied to the whole text; the capitals
     * the brief does want are put back in pass 6.
     *
     * Character.toLowerCase(char) and not String.toLowerCase(). The String
     * method uses the DEFAULT LOCALE, and in Turkish "I".toLowerCase() is
     * "\\u0131" - a dotless i - so the same program produces different text on
     * a machine in Istanbul. The character method has no locale to get wrong.
     */
    public String toLower(String text) {
        StringBuilder out = new StringBuilder(text.length());
        for (int i = 0; i < text.length(); i++) {
            out.append(Character.toLowerCase(text.charAt(i)));
        }
        return out.toString();
    }

    // ── pass 4: comma, dot, colon ────────────────────────────────

    /**
     * Pulls ", . :" onto the word in front of it and leaves exactly one space
     * behind it.
     *
     * Two rules of the brief are enforced by the same loop because they are two
     * halves of one decision - what surrounds this mark - and splitting them
     * into two passes would mean the second pass re-deciding what the first
     * one just settled.
     *
     * No space is inserted after the mark when:
     *   - the text ends there                         "... strings."
     *   - the next visible character is punctuation   "wait..."
     *   - the next visible character closes a quote   "hello," + closing mark
     *   - the mark is a decimal point                 "3.14", not "3. 14"
     *
     * The decimal case is not in the brief. It is in the program because the
     * brief's rules were written with prose in mind, and a marker who types a
     * price is entitled to get it back unbroken. It is a stated decision, not a
     * silent one.
     */
    public String tightenPunctuation(String text) {
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i < text.length()) {
            char c = text.charAt(i);
            if (PUNCTUATION.indexOf(c) < 0) {
                out.append(c);
                i++;
                continue;
            }

            // "There are no space between comma or dot and word in front of it."
            dropTrailingSpace(out);
            out.append(c);

            // Look past the spaces that follow to decide whether one survives.
            int next = i + 1;
            while (next < text.length() && text.charAt(next) == ' ') {
                next++;
            }
            if (next < text.length()) {
                char after = text.charAt(next);
                boolean decimalPoint = c == '.'
                        && Character.isDigit(after)
                        && endsWithDigitBeforeDot(out);
                boolean glued = PUNCTUATION.indexOf(after) >= 0
                        || after == CLOSE_QUOTE
                        || after == STRAIGHT_QUOTE;
                if (!decimalPoint && !glued) {
                    out.append(' ');
                }
            }
            i = next;
        }
        return out.toString();
    }

    /** True when `out` currently reads "...<digit>." - the shape of "3." . */
    private boolean endsWithDigitBeforeDot(StringBuilder out) {
        return out.length() >= 2 && Character.isDigit(out.charAt(out.length() - 2));
    }

    // ── pass 5: quotation marks ──────────────────────────────────

    /**
     * "There are no spaces before and after sentence or word phrases in
     * quotes."
     *
     * Read literally, that sentence would also delete the space between a
     * closing quote and the next word, turning `the "second row" is` into
     * `the "second row"is` - which the brief's own example does NOT do. The
     * rule means the spaces JUST INSIDE the marks: none after the opening one,
     * none before the closing one. The example is the tie-breaker and the
     * walkthrough says so.
     *
     * The straight ASCII quote is handled by parity. There is no such thing as
     * a "closing" straight quote to look at - the character is identical at
     * both ends - so the only way to know which one this is, is to count how
     * many came before it.
     */
    public String tightenQuotes(String text) {
        StringBuilder out = new StringBuilder();
        boolean insideStraightQuotes = false;
        int i = 0;
        while (i < text.length()) {
            char c = text.charAt(i);
            if (c == OPEN_QUOTE) {
                out.append(c);
                i = skipSpaces(text, i + 1);
            } else if (c == CLOSE_QUOTE) {
                dropTrailingSpace(out);
                out.append(c);
                i++;
            } else if (c == STRAIGHT_QUOTE) {
                if (insideStraightQuotes) {
                    dropTrailingSpace(out);
                    out.append(c);
                    i++;
                } else {
                    out.append(c);
                    i = skipSpaces(text, i + 1);
                }
                insideStraightQuotes = !insideStraightQuotes;
            } else {
                out.append(c);
                i++;
            }
        }
        return out.toString();
    }

    private int skipSpaces(String text, int from) {
        int i = from;
        while (i < text.length() && text.charAt(i) == ' ') {
            i++;
        }
        return i;
    }

    // ── pass 6: the capitals the brief asks for ──────────────────

    /**
     * "First character of word in first line is in Uppercase" and "First
     * character of word after dot is in Uppercase".
     *
     * One flag walks the string. It starts true, so the first LETTER is raised
     * whatever comes before it - the brief's own example starts with a quotation
     * mark, and a program that blindly upper-cases character 0 would raise a
     * quotation mark, which upper-cases to itself, and then leave the actual
     * first word in lower case with nothing on screen to show why.
     *
     * A decimal point does not start a sentence: "3.14 metres" must not become
     * "3.14 Metres".
     */
    public String applyCapitals(String text) {
        StringBuilder out = new StringBuilder(text);
        boolean sentenceStart = true;
        for (int i = 0; i < out.length(); i++) {
            char c = out.charAt(i);
            if (sentenceStart && Character.isLetter(c)) {
                out.setCharAt(i, Character.toUpperCase(c));
                sentenceStart = false;
            } else if (TERMINATORS.indexOf(c) >= 0 && !isDecimalPoint(out, i)) {
                sentenceStart = true;
            }
        }
        return out.toString();
    }

    /** True when the dot at `index` has a digit on each side. */
    private boolean isDecimalPoint(StringBuilder text, int index) {
        return text.charAt(index) == '.'
                && index > 0 && index + 1 < text.length()
                && Character.isDigit(text.charAt(index - 1))
                && Character.isDigit(text.charAt(index + 1));
    }

    // ── pass 7: the full stop at the end ─────────────────────────

    /**
     * "Must have dot at the end of text."
     *
     * Empty text is left empty. A document with nothing in it has no end to put
     * a full stop at, and a file whose entire content is "." is worse than a
     * file that is empty - it looks like data.
     *
     * A trailing comma or colon is REPLACED rather than followed: "ends with a
     * comma ," has to become "... comma." and not "... comma,.".
     */
    public String ensureFinalDot(String text) {
        if (text.isEmpty()) {
            return text;
        }
        char last = text.charAt(text.length() - 1);
        if (TERMINATORS.indexOf(last) >= 0) {
            return text;
        }
        if (last == ',' || last == ':') {
            return text.substring(0, text.length() - 1) + '.';
        }
        return text + '.';
    }

    // ── small shared helpers ─────────────────────────────────────

    /**
     * A space for this program's purposes: anything Java calls whitespace, plus
     * the non-breaking space Java does not.
     */
    private boolean isSpace(char c) {
        return Character.isWhitespace(c) || c == NBSP;
    }

    /** True when the line has no visible character on it. */
    public boolean isBlank(String line) {
        for (int i = 0; i < line.length(); i++) {
            if (!isSpace(line.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    /** Removes one trailing space from the buffer, if there is one. */
    private void dropTrailingSpace(StringBuilder out) {
        while (out.length() > 0 && out.charAt(out.length() - 1) == ' ') {
            out.setLength(out.length() - 1);
        }
    }
}
'''

P0025_FILE_MANAGER = '''package bo;

import entity.TextDocument;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Everything that touches the disk, and the only class in the program allowed
 * to know that files can fail.
 *
 * The brief asks for the failures to be handled with exceptions. This class
 * THROWS them - with a sentence a human can read - and the controller is the
 * one place that catches. A file layer that catches its own IOException and
 * prints "error!" has told the caller nothing and returned an empty list that
 * looks exactly like an empty file.
 *
 * WHY THE CHARSET IS WRITTEN OUT
 * new FileReader(f) uses the platform default charset. The text this program is
 * built for contains typographic quotation marks (U+201C / U+201D) and may well
 * contain Vietnamese; read on a machine whose default is windows-1252 those
 * become nonsense, and the nonsense is written back out to output.txt. Naming
 * UTF-8 on both the reader and the writer makes the round trip the same
 * everywhere, which is a property a marker can check by opening the file.
 */
public class DocumentFileManager {

    /** The sample the program can lay down so there is something to normalize. */
    private static final String[] SAMPLE = {
        "   as you can see , detecting whether a string is normalized can be quite efficient.A lot of the cost",
        "of normalizing in the \\u201C second row \\u201D is for the initialization of buffers .",
        "",
        "\\tThe cost of which is amortized   when one is    processing larger strings.",
        "   ",
        "as it turns out,these buffers are rarely needed , so we may change the implementation",
        "at some point   to speed up the common case for small strings even further"
    };

    /**
     * Reads every line of a text file.
     *
     * The two checks before the try block exist so the common failures get a
     * sentence of their own. Letting `new FileInputStream` throw would produce
     * "input.txt (No such file or directory)", which is accurate and tells a
     * first-year student nothing about which of the program's files is missing.
     */
    public List<String> readLines(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("File not found: " + path);
        }
        if (file.isDirectory()) {
            throw new Exception("Not a file: " + path);
        }
        if (!file.canRead()) {
            throw new Exception("Cannot read the file: " + path);
        }
        List<String> lines = new ArrayList<>();
        // try-with-resources: the reader is closed whether the read succeeds or
        // throws. A close() in a finally block does the same job and is three
        // more lines that can be written wrongly.
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
            String line = reader.readLine();
            while (line != null) {
                // Stored exactly as it is on the disk - trailing spaces, tabs
                // and all. Trimming here would hide from the "before" panel the
                // very thing the program is supposed to be fixing.
                lines.add(line);
                line = reader.readLine();
            }
        } catch (IOException e) {
            throw new Exception("Cannot read the file: " + path + " (" + e.getMessage() + ")");
        }
        return lines;
    }

    /** Reads a file into a document, remembering where it came from. */
    public TextDocument readDocument(String path) throws Exception {
        return new TextDocument(path, readLines(path));
    }

    /** Writes one line of text, replacing whatever was there before. */
    public void writeText(String path, String text) throws Exception {
        File file = new File(path);
        if (file.exists() && !file.canWrite()) {
            throw new Exception("Cannot write the file: " + path);
        }
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(file), StandardCharsets.UTF_8))) {
            writer.write(text);
            // The trailing newline is deliberate. A text file whose last line
            // has no line terminator is technically malformed, and some tools
            // silently refuse to show that last line at all.
            writer.newLine();
        } catch (IOException e) {
            throw new Exception("Cannot write the file: " + path + " (" + e.getMessage() + ")");
        }
    }

    /** Lays down the untidy sample document so there is something to work on. */
    public int writeSample(String path) throws Exception {
        StringBuilder text = new StringBuilder();
        for (int i = 0; i < SAMPLE.length; i++) {
            if (i > 0) {
                text.append(System.lineSeparator());
            }
            text.append(SAMPLE[i]);
        }
        writeText(path, text.toString());
        return SAMPLE.length;
    }

    public boolean exists(String path) {
        return new File(path).isFile();
    }
}
'''

P0025_CONTROLLER = '''package controller;

import bo.DocumentFileManager;
import bo.TextNormalizer;
import entity.TextDocument;
import java.util.List;
import utils.Validator;

/**
 * The join between the screen and the rules: it asks for what it needs, calls
 * bo, and turns whatever comes back - a document or an exception - into
 * something readable.
 *
 * This layer exists in a program of six classes because it is the ONLY place
 * that catches. bo throws, ui prints; if the catch blocks lived in Main then
 * Main would have to import IOException-shaped concerns and know the file
 * names, and "the menu and the screen, nothing else" would stop being true.
 */
public class NormalizeController {

    public static final String INPUT_FILE = "input.txt";
    public static final String OUTPUT_FILE = "output.txt";

    private static final String RULE = "--------------------------------------------------";

    private final DocumentFileManager fileManager = new DocumentFileManager();
    private final TextNormalizer normalizer = new TextNormalizer();

    /** Menu 1 - put an untidy sample on the disk to work on. */
    public void createSample() {
        try {
            int lines = fileManager.writeSample(INPUT_FILE);
            System.out.println("Sample input written to " + INPUT_FILE + " (" + lines + " lines).");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    /**
     * Menu 2 - the assignment itself: read, normalize, write.
     *
     * The "before" panel is printed with tabs shown as \\t and the ends of every
     * line marked, because the whole point of the exercise is invisible
     * characters, and a before/after picture in which the "before" looks tidy
     * proves nothing.
     */
    public void normalizeFile() {
        try {
            TextDocument document = fileManager.readDocument(INPUT_FILE);
            List<String> raw = document.getRawLines();

            System.out.println(RULE);
            System.out.println("BEFORE - " + INPUT_FILE + " (" + raw.size() + " lines)");
            System.out.println(RULE);
            for (int i = 0; i < raw.size(); i++) {
                System.out.println((i + 1) + ": [" + visible(raw.get(i)) + "]");
            }

            document.setNormalizedText(normalizer.normalize(raw));
            fileManager.writeText(OUTPUT_FILE, document.getNormalizedText());

            System.out.println(RULE);
            System.out.println("AFTER - " + OUTPUT_FILE + " (1 line)");
            System.out.println(RULE);
            System.out.println(document.getNormalizedText());
            System.out.println(RULE);
            System.out.println("Normalized document written to " + OUTPUT_FILE + ".");
        } catch (Exception e) {
            // The one catch in the program. Everything below throws; nothing
            // below prints.
            System.out.println("Error: " + e.getMessage());
        }
    }

    /**
     * Menu 3 - read output.txt back off the disk.
     *
     * This is not decoration. It is the only proof that the write actually
     * reached the file system rather than a buffer that was never flushed:
     * the file is re-opened, by a fresh reader, and what comes back is shown.
     */
    public void showOutput() {
        try {
            List<String> lines = fileManager.readLines(OUTPUT_FILE);
            System.out.println(RULE);
            System.out.println("ON DISK - " + OUTPUT_FILE + " (" + lines.size()
                    + (lines.size() == 1 ? " line)" : " lines)"));
            System.out.println(RULE);
            for (String line : lines) {
                System.out.println(line);
            }
            System.out.println(RULE);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    /** Menu 4 - normalize one line the marker types, exactly as typed. */
    public void normalizeTypedLine() {
        System.out.println("Type the line to normalize:");
        String typed = Validator.getRawLine();
        System.out.println("IN : [" + visible(typed) + "]");
        System.out.println("OUT: [" + visible(normalizer.normalize(typed)) + "]");
    }

    /**
     * Menu 5 - the rules demonstrated on the cases that break naive solutions.
     *
     * Every one of these was a real bug in some version of this program, or a
     * case the brief names and does not illustrate. Showing them on screen is
     * how the defence question "what about an empty file?" gets answered by
     * pressing a key instead of by arguing.
     */
    public void showCases() {
        String[][] cases = {
            {"leading and trailing spaces", "   hello world   "},
            {"a run of many spaces", "a    b     c"},
            {"tabs mixed with spaces", "a \\t  b\\t\\tc"},
            {"empty text", ""},
            {"spaces only", "     "},
            {"punctuation glued to the next word", "one ,two.three:four"},
            {"space in front of punctuation", "sentence one . sentence two"},
            {"capitals in the middle", "the QUICK brown FOX jumps"},
            {"single-letter words", "a dog. i saw i and a cat"},
            {"curly quotes with spaces inside", "he said \\u201C  hello there  \\u201D loudly"},
            {"straight quotes with spaces inside", "he said \\"  hello there  \\" loudly"},
            {"comma at the very end", "this ends with a comma ,"},
            {"a decimal number", "the price is 3.14 dollars"},
            {"a non-breaking space", "word\\u00A0word and more"},
            {"Vietnamese, non-ASCII", "  ch\\u00E0o   b\\u1EA1n ,t\\u00F4i t\\u00EAn l\\u00E0 c\\u01B0\\u1EDDng.r\\u1EA5t vui"},
            {"already normalized", "This is fine. It is already correct."}
        };

        System.out.println(RULE);
        System.out.println("RULES ON SAMPLE CASES");
        System.out.println(RULE);
        for (int i = 0; i < cases.length; i++) {
            System.out.printf("%2d. %s%n", i + 1, cases[i][0]);
            System.out.println("    IN : [" + visible(cases[i][1]) + "]");
            System.out.println("    OUT: [" + visible(normalizer.normalize(cases[i][1])) + "]");
        }
        System.out.println(RULE);
    }

    /**
     * Renders a string so that what is wrong with it can be seen.
     *
     * Printing a tab as a tab makes a broken line look like a tidy one; the
     * marker is being shown the difference between one space and four, and that
     * difference has to survive the trip to the console.
     */
    private String visible(String text) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            switch (c) {
                case '\\t':
                    out.append("\\\\t");
                    break;
                case '\\u00A0':
                    out.append("<nbsp>");
                    break;
                default:
                    out.append(c);
            }
        }
        return out.toString();
    }
}
'''

P0025_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every read from the keyboard in the program, in one place.
 *
 * One static Scanner over System.in, and a private constructor so nobody can
 * make a second one. Two Scanners on the same stream is the classic way to lose
 * a line of input: the first one buffers ahead, the second one never sees what
 * the first one swallowed.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /**
     * A menu number, re-asked until it is one.
     *
     * On end of input it returns `min`, and the menu is numbered so that `min`
     * is Exit. Without that, a program whose input is piped from a file spins
     * forever on the last prompt once the file runs out - which is exactly how
     * a scripted test hangs instead of failing.
     */
    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            if (!SCANNER.hasNextLine()) {
                System.out.println();
                return min;
            }
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
     * One line, exactly as typed - NOT trimmed.
     *
     * This is the one place in the program where trimming would be a bug. The
     * whole exercise is about leading and trailing whitespace, so a validator
     * that helpfully removes it first would make the program unable to
     * demonstrate the very rule it implements.
     */
    public static String getRawLine() {
        if (!SCANNER.hasNextLine()) {
            return "";
        }
        return SCANNER.nextLine();
    }
}
'''

P0025_MAIN = '''package ui;

import controller.NormalizeController;
import utils.Validator;

/**
 * The menu and the screen, and nothing else: no rules, no files, no catch
 * blocks. Every branch is one call into the controller.
 */
public class Main {

    private static final String BAR = "============ TEXT NORMALIZER ============";

    public static void main(String[] args) {
        NormalizeController controller = new NormalizeController();
        boolean running = true;

        while (running) {
            System.out.println(BAR);
            System.out.println("1. Create the sample input file (" + NormalizeController.INPUT_FILE + ")");
            System.out.println("2. Normalize " + NormalizeController.INPUT_FILE
                    + " into " + NormalizeController.OUTPUT_FILE);
            System.out.println("3. Show " + NormalizeController.OUTPUT_FILE + " from the disk");
            System.out.println("4. Normalize one line typed on the keyboard");
            System.out.println("5. Show the rules on sample cases");
            System.out.println("0. Exit");
            System.out.println("========================================");

            int choice = Validator.getInt("Your choice: ", 0, 5);
            switch (choice) {
                case 1:
                    controller.createSample();
                    break;
                case 2:
                    controller.normalizeFile();
                    break;
                case 3:
                    controller.showOutput();
                    break;
                case 4:
                    controller.normalizeTypedLine();
                    break;
                case 5:
                    controller.showCases();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''


P0025_FILES = [
    ('src/entity/TextDocument.java', P0025_DOCUMENT),
    ('src/bo/TextNormalizer.java', P0025_NORMALIZER),
    ('src/bo/DocumentFileManager.java', P0025_FILE_MANAGER),
    ('src/controller/NormalizeController.java', P0025_CONTROLLER),
    ('src/utils/Validator.java', P0025_VALIDATOR),
    ('src/ui/Main.java', P0025_MAIN),
]


solution(
    'J1.L.P0025',
    title_vi='Chuẩn hoá văn bản từ tệp',
    files=P0025_FILES,
    main_class='ui.Main',
    runs=[
        # RUN 0 - nothing on the disk yet: both file operations must fail with a
        # sentence, not a stack trace.
        ('2\n3\n0\n',
         '''============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Error: File not found: input.txt
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Error: File not found: output.txt
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Goodbye.'''),
        # RUN 1 - lay the sample down, normalize it, write output.txt.
        ('1\n2\n0\n',
         '''============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Sample input written to input.txt (7 lines).
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: --------------------------------------------------
BEFORE - input.txt (7 lines)
--------------------------------------------------
1: [   as you can see , detecting whether a string is normalized can be quite efficient.A lot of the cost]
2: [of normalizing in the “ second row ” is for the initialization of buffers .]
3: []
4: [\\tThe cost of which is amortized   when one is    processing larger strings.]
5: [   ]
6: [as it turns out,these buffers are rarely needed , so we may change the implementation]
7: [at some point   to speed up the common case for small strings even further]
--------------------------------------------------
AFTER - output.txt (1 line)
--------------------------------------------------
As you can see, detecting whether a string is normalized can be quite efficient. A lot of the cost of normalizing in the “second row” is for the initialization of buffers. The cost of which is amortized when one is processing larger strings. As it turns out, these buffers are rarely needed, so we may change the implementation at some point to speed up the common case for small strings even further.
--------------------------------------------------
Normalized document written to output.txt.
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Goodbye.'''),
        # RUN 2 - a NEW process, a fresh reader: the only real proof that the
        # previous run's write reached the file system.
        ('3\n0\n',
         '''============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: --------------------------------------------------
ON DISK - output.txt (1 line)
--------------------------------------------------
As you can see, detecting whether a string is normalized can be quite efficient. A lot of the cost of normalizing in the “second row” is for the initialization of buffers. The cost of which is amortized when one is processing larger strings. As it turns out, these buffers are rarely needed, so we may change the implementation at some point to speed up the common case for small strings even further.
--------------------------------------------------
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Goodbye.'''),
        # RUN 3 - the edge cases, on screen.
        ('5\n0\n',
         '''============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: --------------------------------------------------
RULES ON SAMPLE CASES
--------------------------------------------------
 1. leading and trailing spaces
    IN : [   hello world   ]
    OUT: [Hello world.]
 2. a run of many spaces
    IN : [a    b     c]
    OUT: [A b c.]
 3. tabs mixed with spaces
    IN : [a \\t  b\\t\\tc]
    OUT: [A b c.]
 4. empty text
    IN : []
    OUT: []
 5. spaces only
    IN : [     ]
    OUT: []
 6. punctuation glued to the next word
    IN : [one ,two.three:four]
    OUT: [One, two. Three: four.]
 7. space in front of punctuation
    IN : [sentence one . sentence two]
    OUT: [Sentence one. Sentence two.]
 8. capitals in the middle
    IN : [the QUICK brown FOX jumps]
    OUT: [The quick brown fox jumps.]
 9. single-letter words
    IN : [a dog. i saw i and a cat]
    OUT: [A dog. I saw i and a cat.]
10. curly quotes with spaces inside
    IN : [he said “  hello there  ” loudly]
    OUT: [He said “hello there” loudly.]
11. straight quotes with spaces inside
    IN : [he said "  hello there  " loudly]
    OUT: [He said "hello there" loudly.]
12. comma at the very end
    IN : [this ends with a comma ,]
    OUT: [This ends with a comma.]
13. a decimal number
    IN : [the price is 3.14 dollars]
    OUT: [The price is 3.14 dollars.]
14. a non-breaking space
    IN : [word<nbsp>word and more]
    OUT: [Word word and more.]
15. Vietnamese, non-ASCII
    IN : [  chào   bạn ,tôi tên là cường.rất vui]
    OUT: [Chào bạn, tôi tên là cường. Rất vui.]
16. already normalized
    IN : [This is fine. It is already correct.]
    OUT: [This is fine. It is already correct.]
--------------------------------------------------
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Goodbye.'''),
        # RUN 4 - typed lines (whitespace preserved), then two bad menu answers.
        ('4\n   these   are\tmixed ,and  spaces  \n4\n\n4\n     \n4\nhe said “  hello there  ” loudly\n9\nx\n0\n',
         '''============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Type the line to normalize:
IN : [   these   are\\tmixed ,and  spaces  ]
OUT: [These are mixed, and spaces.]
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Type the line to normalize:
IN : []
OUT: []
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Type the line to normalize:
IN : [     ]
OUT: []
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Type the line to normalize:
IN : [he said “  hello there  ” loudly]
OUT: [He said “hello there” loudly.]
============ TEXT NORMALIZER ============
1. Create the sample input file (input.txt)
2. Normalize input.txt into output.txt
3. Show output.txt from the disk
4. Normalize one line typed on the keyboard
5. Show the rules on sample cases
0. Exit
========================================
Your choice: Please choose from 0 to 5.
Your choice: You must input a number.
Your choice: Goodbye.'''),
    ],
    explain_en='''<p><strong>What is actually being marked.</strong> Not "can you call
<code>replaceAll</code>". The brief lists seven rules, and the marks are in what happens where two of
them cover the same three characters. <code>word&nbsp;.&nbsp;&#8221;</code> is touched by "no space in
front of a dot", by "one space after a dot" and by "no space just inside a quote" at once. A solution
built as a stack of regular expressions gets an answer that depends on which line happened to run
first — it will pass the brief's own example and fall over on the first thing a marker types. So the
rules here are seven <em>passes</em>, each with one job, applied in an order that is written down and
defended in the class comment rather than arrived at by trial and error.</p>
<p><strong>The order is the design, and two of the steps cannot be swapped.</strong> Lower-casing has
to happen <em>before</em> the capitals are applied, or it flattens the capitals it just made. The
capitals pass has to happen <em>after</em> the punctuation pass, because it looks for "a dot, then the
next letter" — and before the punctuation pass has run, that dot may still have a space in front of it
and nothing behind it. Say those two sentences at the defence and the design question is answered.</p>
<p><strong>Why the string is walked by hand instead of split.</strong> This was measured on a real JVM,
not assumed. <code>"a    b".split(" ")</code> returns <strong>five</strong> elements — <code>a</code>,
three empty strings, <code>b</code> — because <code>split</code> cuts at every single space and keeps
what lies between two of them; rejoining those five with a space puts all four spaces straight back.
<code>split("\\\\s+")</code> does return two, but it has its own trap: <code>"  a b".split("\\\\s+")</code>
is <strong>three</strong> elements with an <em>empty first one</em> (a leading separator produces a
leading empty field, a trailing one does not), so a program that splits and rejoins gains a space at
the front of every indented line. Two more measured facts from the same session, for anyone tempted to
guess: <code>"a,b,".split(",")</code> is length 2 and <code>"a,b,".split(",", -1)</code> is length 3 —
trailing empty fields are dropped unless you ask for them; and <code>"".split("\\\\s+")</code> has length
<strong>1</strong> while <code>"   ".split("\\\\s+")</code> has length <strong>0</strong>, which is the
kind of asymmetry that turns "handle the empty file" into a null-pointer at the demonstration. One
<code>StringBuilder</code> and one loop has none of these properties.</p>
<p><strong>The invisible character that is not whitespace.</strong>
<code>Character.isWhitespace('\\u00A0')</code> returns <strong>false</strong> — checked, not assumed.
The non-breaking space is what you get when text is pasted out of Word or off a web page; it is exactly
as wide as a space, it is invisible, and no whitespace rule in Java touches it. The collapse pass
therefore defines its own <code>isSpace</code>: whatever Java calls whitespace, <em>plus</em> U+00A0.
Sample case 14 on the "rules" screen shows it going in as <code>word&lt;nbsp&gt;word</code> and coming
out as two words with one ordinary space between them.</p>
<p><strong>Lower case has a locale, and the locale can be wrong.</strong>
<code>String.toLowerCase()</code> with no argument uses the machine's default locale, and in Turkish
<code>"I".toLowerCase()</code> is <code>\\u0131</code>, a dotless i. The same program then produces
different files on different machines. <code>Character.toLowerCase(char)</code> has no locale to get
wrong, so the pass walks the string a character at a time. It costs nothing and removes a class of bug
that is impossible to reproduce on the machine you wrote it on.</p>
<p><strong>Where the brief argues with itself, and what was done about it.</strong> Three places, and
noticing them is worth more than any of the code:</p>
<ul>
<li><em>"There are no spaces before and after sentence or word phrases in quotes."</em> Read literally,
that deletes the space between a closing quote and the next word, turning
<code>the &#8220;second row&#8221; is</code> into <code>the &#8220;second row&#8221;is</code> — which the
brief's own worked example does <strong>not</strong> do. The rule means the spaces <em>just inside</em>
the marks. The example is the tie-breaker.</li>
<li>The brief's "after" text turns <code>… of buffers. The cost of which …</code> into
<code>… of buffers, the cost of which …</code>. No rule in the list turns a full stop into a comma. It
is an editing slip in the sheet; the program leaves the full stop alone.</li>
<li>The brief's "after" text opens with a quotation mark, <code>&#8220;As you can see</code>, and never
closes it. That is the sheet quoting its own example paragraph, not a rule. The program does not invent
a quotation mark.</li>
</ul>
<p><strong>Two deliberate extensions, declared rather than smuggled in.</strong> First, a dot with a
digit on each side is a decimal point: without that guard, "one space after a dot" turns
<code>3.14</code> into <code>3. 14</code> and then capitalises the next word. Second, <code>?</code> and
<code>!</code> are treated as sentence ends as well as <code>.</code> — the brief only names the dot,
but appending one to a question produces <code>?.</code>, which nobody wants to read. Both are choices
beyond the letter of the brief, both are in the class comment, and both are the sort of thing to raise
yourself at the defence before the examiner finds them.</p>
<p><strong>Empty text stays empty.</strong> "Must have dot at the end of text" was <em>not</em> applied
to an empty document, because a file whose entire content is <code>.</code> looks like data and is
worse than a file with nothing in it. The rules screen shows both the empty string and a string of
nothing but spaces arriving as <code>[]</code> and leaving as <code>[]</code>; a trailing comma, by
contrast, is <em>replaced</em> by the full stop rather than followed by one, so
<code>this ends with a comma ,</code> becomes <code>This ends with a comma.</code> and never
<code>… comma,.</code></p>
<p><strong>The layers, and why there are six files and not four.</strong> <code>entity</code> holds the
document — where it came from, the lines exactly as they were on the disk, and the normalized text.
<code>bo</code> is split in two because the two jobs fail in completely different ways:
<code>TextNormalizer</code> is pure text in, text out and cannot fail at all, which is what makes it
testable by pressing 5; <code>DocumentFileManager</code> is the only class that knows files exist and
the only one that throws. <code>controller</code> earns its place as the <em>single</em> place that
catches — put those catch blocks in <code>Main</code> and "the menu and the screen, nothing else" stops
being true, and the file names leak into the UI. <code>utils/Validator</code> holds the one
<code>Scanner</code>; two Scanners on <code>System.in</code> is the classic way to lose a line of input,
because the first one buffers ahead and the second never sees what it swallowed.</p>
<p><strong>The one place where trimming input would be a bug.</strong> <code>Validator</code> has the
usual <code>getInt</code>, which trims — and a separate <code>getRawLine()</code> which does not. The
whole assignment is about leading and trailing whitespace, so a helpful validator that strips it before
the normalizer ever sees it would make the program unable to demonstrate its own rules. Run 4 types
<code>[   these   are\\tmixed ,and  spaces  ]</code>, tab and all, and gets
<code>[These are mixed, and spaces.]</code> back.</p>
<p><strong>The charset is named on both ends, on purpose.</strong> <code>new FileReader(f)</code> uses
the platform default. The text in this assignment contains typographic quotation marks (U+201C /
U+201D) and may well contain Vietnamese; read on a machine whose default is windows-1252 those arrive
as mojibake and the mojibake is written straight back out. <code>InputStreamReader</code> and
<code>OutputStreamWriter</code> with <code>StandardCharsets.UTF_8</code> make the round trip identical
everywhere — and it was tested with real Vietnamese, not assumed: case 15 turns
<code>  ch&#224;o   b&#7841;n ,t&#244;i t&#234;n l&#224; c&#432;&#7901;ng.r&#7845;t vui</code> into
<code>Ch&#224;o b&#7841;n, t&#244;i t&#234;n l&#224; c&#432;&#7901;ng. R&#7845;t vui.</code>, with the
tone marks intact and <code>c</code> → <code>C</code> and <code>r</code> → <code>R</code> raised
correctly.</p>
<p><strong>How the file half was proved.</strong> Not by looking at a success message. Five runs, in
order, in one directory: run 1 asks for <code>input.txt</code> when nothing is there and gets
<code>Error: File not found: input.txt</code>, then asks for <code>output.txt</code> and gets the same
treatment — the brief's exception requirement, demonstrated rather than asserted. Run 2 writes the
sample, normalizes it and writes <code>output.txt</code>. Run 3 is a <strong>separate JVM process</strong>
that opens <code>output.txt</code> with a fresh reader and prints what it finds. That last step is the
only thing that distinguishes a write that reached the disk from a buffer that was never flushed, and
the text that comes back is character-for-character the text run 2 produced.</p>
<p><strong>The result against the brief's own example.</strong> The sample input is the brief's
paragraph with the damage put back in: leading spaces, a dot glued to the next word, a space before a
full stop, spaces inside the quotation marks, a tab-indented line, two blank lines and no full stop at
the end. What comes out is the brief's "after" paragraph exactly — one line, one space between words,
<code>&#8220;second row&#8221;</code> tight inside its quotes, a capital after every dot, and a full
stop at the end — apart from the two places where the brief's own example breaks its own rules, listed
above.</p>
<p><strong>What the examiner will ask.</strong> "What happens with an empty file?" — press 5, cases 4
and 5. "What if there is no dot at the end?" — case 12, and the sample document itself. "Why not
<code>replaceAll</code>?" — because the rules overlap and the answer would depend on their order.
"Where do you catch the exception?" — in exactly one place, and here is what the screen says when the
file is missing.</p>''',
    explain_vi='''<p><strong>Bài này thật ra chấm cái gì.</strong> Không phải "có biết gọi
<code>replaceAll</code> không". Đề liệt kê bảy luật, và điểm nằm ở chỗ hai luật cùng phủ lên đúng ba ký
tự. Chuỗi <code>word&nbsp;.&nbsp;&#8221;</code> bị đụng cùng lúc bởi "không có khoảng trắng trước dấu
chấm", "đúng một khoảng trắng sau dấu chấm" và "không có khoảng trắng ngay bên trong dấu ngoặc kép".
Lời giải xếp chồng nhiều biểu thức chính quy sẽ cho kết quả phụ thuộc vào dòng nào chạy trước — nó qua
được đúng ví dụ trong đề rồi gãy ngay ở thứ đầu tiên người chấm gõ vào. Nên ở đây bảy luật là bảy
<em>lượt duyệt</em>, mỗi lượt một việc, theo một thứ tự được viết ra và biện luận trong chú thích lớp
chứ không phải mò ra.</p>
<p><strong>Thứ tự chính là thiết kế, và có hai bước không được đổi chỗ.</strong> Hạ chữ thường phải chạy
<em>trước</em> khi viết hoa, nếu không nó xoá sạch những chữ hoa vừa tạo. Lượt viết hoa phải chạy
<em>sau</em> lượt dấu câu, vì nó tìm mẫu "một dấu chấm, rồi chữ cái kế tiếp" — mà trước lượt dấu câu,
dấu chấm đó có thể vẫn còn khoảng trắng ở phía trước và không có gì ở phía sau. Nói được hai câu này
lúc bảo vệ là đã trả lời xong câu hỏi thiết kế.</p>
<p><strong>Vì sao duyệt chuỗi bằng tay chứ không dùng split.</strong> Điều này được <em>đo</em> trên JVM
thật, không phải đoán. <code>"a    b".split(" ")</code> trả về <strong>năm</strong> phần tử —
<code>a</code>, ba chuỗi rỗng, <code>b</code> — vì <code>split</code> cắt ở từng khoảng trắng một và giữ
lại phần nằm giữa hai khoảng trắng; nối năm phần đó bằng một dấu cách là trả đủ bốn khoảng trắng về chỗ
cũ. <code>split("\\\\s+")</code> đúng là trả về hai, nhưng nó có bẫy riêng:
<code>"  a b".split("\\\\s+")</code> ra <strong>ba</strong> phần tử với <em>phần tử đầu rỗng</em> (dấu
phân cách ở đầu sinh ra một trường rỗng, ở cuối thì không), nên chương trình cắt-rồi-nối sẽ thêm một
khoảng trắng vào đầu mỗi dòng thụt lề. Hai sự thật nữa cũng đo trong cùng phiên, cho ai định đoán:
<code>"a,b,".split(",")</code> dài 2 còn <code>"a,b,".split(",", -1)</code> dài 3 — trường rỗng ở cuối
bị bỏ trừ khi bạn xin giữ; và <code>"".split("\\\\s+")</code> dài <strong>1</strong> trong khi
<code>"   ".split("\\\\s+")</code> dài <strong>0</strong>, đúng kiểu bất đối xứng biến "xử lý tệp rỗng"
thành lỗi null ngay lúc trình bày. Một <code>StringBuilder</code> và một vòng lặp thì không có bất kỳ
tính chất nào trong số đó.</p>
<p><strong>Ký tự vô hình mà Java không coi là khoảng trắng.</strong>
<code>Character.isWhitespace('\\u00A0')</code> trả về <strong>false</strong> — đã kiểm, không phải đoán.
Khoảng trắng không ngắt dòng là thứ bạn nhận được khi dán văn bản từ Word hay từ trang web; nó rộng
đúng bằng dấu cách, nó vô hình, và không luật whitespace nào của Java đụng tới nó. Vì vậy lượt gom
khoảng trắng tự định nghĩa <code>isSpace</code>: mọi thứ Java gọi là whitespace, <em>cộng thêm</em>
U+00A0. Trường hợp mẫu số 14 trên màn hình "rules" cho thấy nó vào là
<code>word&lt;nbsp&gt;word</code> và ra là hai từ cách nhau đúng một dấu cách bình thường.</p>
<p><strong>Chữ thường cũng có locale, và locale có thể sai.</strong> <code>String.toLowerCase()</code>
không tham số dùng locale mặc định của máy, mà trong tiếng Thổ Nhĩ Kỳ <code>"I".toLowerCase()</code> ra
<code>\\u0131</code> — chữ i không chấm. Cùng một chương trình sẽ sinh ra tệp khác nhau trên các máy khác
nhau. <code>Character.toLowerCase(char)</code> không có locale nào để sai, nên lượt này duyệt chuỗi từng
ký tự. Nó chẳng tốn gì và loại bỏ hẳn một loại lỗi không thể tái hiện trên chính máy bạn viết code.</p>
<p><strong>Chỗ đề tự mâu thuẫn, và đã xử lý thế nào.</strong> Ba chỗ, và nhận ra chúng còn đáng giá hơn
toàn bộ phần code:</p>
<ul>
<li><em>"There are no spaces before and after sentence or word phrases in quotes."</em> Hiểu theo đúng
mặt chữ thì luật này xoá luôn khoảng trắng giữa dấu ngoặc đóng và từ kế tiếp, biến
<code>the &#8220;second row&#8221; is</code> thành <code>the &#8220;second row&#8221;is</code> — điều mà
chính ví dụ trong đề <strong>không</strong> làm. Luật này nói về khoảng trắng <em>ngay bên trong</em>
cặp ngoặc. Ví dụ là căn cứ phân xử.</li>
<li>Phần "sau khi chuẩn hoá" của đề đổi <code>… of buffers. The cost of which …</code> thành
<code>… of buffers, the cost of which …</code>. Không luật nào trong danh sách biến dấu chấm thành dấu
phẩy. Đó là lỗi biên tập của đề; chương trình giữ nguyên dấu chấm.</li>
<li>Phần "sau khi chuẩn hoá" mở đầu bằng một dấu ngoặc kép, <code>&#8220;As you can see</code>, và không
bao giờ đóng lại. Đó là đề đang trích dẫn chính đoạn ví dụ của nó, không phải một luật. Chương trình
không tự bịa ra dấu ngoặc kép.</li>
</ul>
<p><strong>Hai phần mở rộng có chủ ý, khai báo rõ chứ không lén.</strong> Thứ nhất, dấu chấm có chữ số ở
cả hai bên là dấu thập phân: không có chốt này thì luật "một khoảng trắng sau dấu chấm" biến
<code>3.14</code> thành <code>3. 14</code> rồi viết hoa từ kế tiếp. Thứ hai, <code>?</code> và
<code>!</code> cũng được coi là kết thúc câu như <code>.</code> — đề chỉ nói dấu chấm, nhưng thêm một
dấu chấm vào sau câu hỏi sẽ ra <code>?.</code>, chẳng ai muốn đọc. Cả hai đều vượt ra ngoài mặt chữ của
đề, cả hai đều ghi trong chú thích lớp, và cả hai đều là thứ nên tự nêu ra lúc bảo vệ trước khi người
chấm phát hiện.</p>
<p><strong>Văn bản rỗng thì để rỗng.</strong> Luật "Must have dot at the end of text"
<em>không</em> áp cho tài liệu rỗng, vì một tệp mà toàn bộ nội dung là <code>.</code> trông giống dữ
liệu thật và còn tệ hơn một tệp trống. Màn hình các trường hợp mẫu cho thấy cả chuỗi rỗng lẫn chuỗi
toàn khoảng trắng vào là <code>[]</code> và ra là <code>[]</code>; ngược lại, dấu phẩy ở cuối bị
<em>thay</em> bằng dấu chấm chứ không phải nối thêm, nên <code>this ends with a comma ,</code> ra
<code>This ends with a comma.</code> chứ không bao giờ ra <code>… comma,.</code></p>
<p><strong>Các tầng, và vì sao là sáu tệp chứ không phải bốn.</strong> <code>entity</code> giữ tài liệu
— nó đến từ đâu, các dòng y nguyên như trên đĩa, và phần văn bản đã chuẩn hoá. <code>bo</code> tách làm
hai vì hai việc này hỏng theo những cách hoàn toàn khác nhau: <code>TextNormalizer</code> là văn bản
vào, văn bản ra, không thể hỏng — chính điều đó khiến nó kiểm được bằng cách bấm phím 5;
<code>DocumentFileManager</code> là lớp duy nhất biết trên đời có tệp, và là lớp duy nhất ném ngoại lệ.
<code>controller</code> xứng đáng tồn tại vì nó là nơi <em>duy nhất</em> bắt ngoại lệ — đặt các khối
catch đó vào <code>Main</code> thì câu "thực đơn và màn hình, không làm gì khác" không còn đúng nữa, và
tên tệp rò rỉ lên tầng giao diện. <code>utils/Validator</code> giữ <code>Scanner</code> duy nhất; hai
Scanner trên <code>System.in</code> là cách kinh điển để mất một dòng nhập, vì cái thứ nhất đọc đệm
trước còn cái thứ hai không bao giờ thấy phần nó đã nuốt.</p>
<p><strong>Chỗ duy nhất mà cắt khoảng trắng đầu vào là một lỗi.</strong> <code>Validator</code> có
<code>getInt</code> như thường lệ, có trim — và một <code>getRawLine()</code> riêng thì không.
Toàn bộ bài này nói về khoảng trắng đầu và cuối, nên một validator "tốt bụng" cắt sạch trước khi bộ
chuẩn hoá kịp nhìn thấy sẽ khiến chương trình không thể minh hoạ chính luật nó cài đặt. Lần chạy 4 gõ
vào <code>[   these   are\\tmixed ,and  spaces  ]</code>, cả ký tự tab, và nhận về
<code>[These are mixed, and spaces.]</code>.</p>
<p><strong>Bảng mã được ghi rõ ở cả hai đầu, có chủ ý.</strong> <code>new FileReader(f)</code> dùng bảng
mã mặc định của nền tảng. Văn bản của bài này chứa dấu ngoặc kép kiểu chữ in (U+201C / U+201D) và rất
có thể chứa tiếng Việt; đọc trên máy có mặc định windows-1252 thì chúng vào thành ký tự rác, rồi rác đó
được ghi thẳng ra tệp kết quả. <code>InputStreamReader</code> và <code>OutputStreamWriter</code> kèm
<code>StandardCharsets.UTF_8</code> khiến vòng đọc–ghi giống hệt nhau ở mọi nơi — và điều này đã được
thử bằng tiếng Việt thật chứ không phải đoán: trường hợp 15 biến
<code>  ch&#224;o   b&#7841;n ,t&#244;i t&#234;n l&#224; c&#432;&#7901;ng.r&#7845;t vui</code> thành
<code>Ch&#224;o b&#7841;n, t&#244;i t&#234;n l&#224; c&#432;&#7901;ng. R&#7845;t vui.</code>, dấu thanh
còn nguyên và <code>c</code> → <code>C</code>, <code>r</code> → <code>R</code> viết hoa đúng.</p>
<p><strong>Nửa phần tệp được chứng minh thế nào.</strong> Không phải bằng cách nhìn một dòng thông báo
thành công. Năm lần chạy, theo thứ tự, trong cùng một thư mục: lần 1 đòi <code>input.txt</code> khi
chưa có gì và nhận <code>Error: File not found: input.txt</code>, rồi đòi <code>output.txt</code> và
nhận đúng cách đối xử đó — yêu cầu dùng ngoại lệ của đề, được <em>trình diễn</em> chứ không phải tuyên
bố suông. Lần 2 ghi tệp mẫu, chuẩn hoá và ghi <code>output.txt</code>. Lần 3 là một
<strong>tiến trình JVM khác</strong> mở <code>output.txt</code> bằng một reader mới và in ra thứ nó
tìm thấy. Bước cuối đó là thứ duy nhất phân biệt được một lần ghi đã chạm đĩa với một bộ đệm chưa bao
giờ được flush, và văn bản đọc về khớp từng ký tự với văn bản lần 2 sinh ra.</p>
<p><strong>Kết quả so với chính ví dụ của đề.</strong> Tệp mẫu là đoạn văn trong đề được cố tình làm hỏng
lại: khoảng trắng đầu dòng, dấu chấm dính vào từ sau, khoảng trắng trước dấu chấm, khoảng trắng bên
trong cặp ngoặc kép, một dòng thụt bằng tab, hai dòng trống và không có dấu chấm ở cuối. Thứ đi ra
đúng bằng đoạn "sau khi chuẩn hoá" của đề — một dòng, một khoảng trắng giữa các từ,
<code>&#8220;second row&#8221;</code> khít trong cặp ngoặc, chữ hoa sau mỗi dấu chấm, và một dấu chấm ở
cuối — trừ đúng hai chỗ mà ví dụ của đề tự phá luật của nó, đã liệt kê ở trên.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> "Tệp rỗng thì sao?" — bấm 5, trường hợp 4 và 5. "Nếu cuối văn
bản không có dấu chấm?" — trường hợp 12, và chính tệp mẫu. "Sao không dùng <code>replaceAll</code>?" —
vì các luật chồng lên nhau và kết quả sẽ phụ thuộc vào thứ tự. "Bắt ngoại lệ ở đâu?" — đúng một chỗ, và
đây là những gì màn hình hiện khi thiếu tệp.</p>''',
    hints_en=[
        'Do not split on " ": "a    b".split(" ") gives five pieces, three of them empty, and rejoining them puts every space back. Walk the string with one StringBuilder instead.',
        'Order the passes and be able to defend it: collapse spaces, lower-case everything, fix ", . :", tighten the quotes, then raise the capitals, then add the final dot. Lower-casing after capitalising undoes the capitals.',
        'Character.isWhitespace(\'\\u00A0\') is false — a non-breaking space pasted from Word survives every whitespace rule unless you name it yourself.',
        'Use Character.toLowerCase(char), not String.toLowerCase(): the String version uses the default locale, and in Turkish "I" lower-cases to a dotless \\u0131.',
        'Read and write with InputStreamReader/OutputStreamWriter and StandardCharsets.UTF_8 — the curly quotes in this brief do not survive the platform default charset.',
        'Prove the write by reading output.txt back in a SECOND run of the program, not by printing "done".',
    ],
    hints_vi=[
        'Đừng cắt bằng " ": "a    b".split(" ") ra năm phần, ba phần rỗng, nối lại là trả đủ khoảng trắng về chỗ cũ. Hãy duyệt chuỗi bằng một StringBuilder.',
        'Sắp thứ tự các lượt duyệt và phải biện luận được: gom khoảng trắng, hạ hết về chữ thường, sửa ", . :", siết dấu ngoặc kép, rồi mới viết hoa, rồi thêm dấu chấm cuối. Hạ chữ thường sau khi viết hoa là xoá sạch chữ hoa vừa làm.',
        'Character.isWhitespace(\'\\u00A0\') là false — khoảng trắng không ngắt dòng dán từ Word sống sót qua mọi luật whitespace trừ khi bạn tự kể tên nó.',
        'Dùng Character.toLowerCase(char), đừng dùng String.toLowerCase(): bản String dùng locale mặc định, trong tiếng Thổ "I" hạ thành \\u0131 không chấm.',
        'Đọc và ghi bằng InputStreamReader/OutputStreamWriter với StandardCharsets.UTF_8 — dấu ngoặc kép cong trong đề này không sống sót qua bảng mã mặc định của nền tảng.',
        'Chứng minh việc ghi bằng cách đọc lại output.txt ở LẦN CHẠY THỨ HAI của chương trình, không phải bằng câu "đã xong".',
    ],
)


# ── Vietnamese brief ─────────────────────────────────────────────
VI = {
    'J1.L.P0025': '''<h3>Bối cảnh</h3>
<p>Chuẩn hoá văn bản là việc đưa một đoạn văn bản lộn xộn — thừa khoảng trắng, thiếu khoảng trắng, chữ
hoa chữ thường tuỳ tiện, dòng trống rải rác — về một dạng trình bày thống nhất. Đây là công việc có
thật ở mọi hệ thống xử lý tài liệu, và nó là bài tập kinh điển về thao tác chuỗi: luật thì đơn giản,
nhưng các luật <strong>chồng lên nhau</strong>, nên thứ tự áp dụng mới là phần khó.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình Java chạy trên console, đọc một tệp văn bản (<code>input.txt</code>), chuẩn hoá nội
dung, rồi ghi tài liệu đã chuẩn hoá ra tệp kết quả (<code>output.txt</code>).</p>
<h3>Chi tiết chức năng</h3>
<p>Các luật chuẩn hoá:</p>
<ul>
<li>Giữa hai từ chỉ có <strong>một</strong> khoảng trắng.</li>
<li>Sau dấu phẩy (,), dấu chấm (.) và dấu hai chấm (:) chỉ có <strong>một</strong> khoảng trắng. Ký tự
đầu của từ đứng sau dấu chấm được viết <strong>hoa</strong>, các từ khác viết <strong>thường</strong>.</li>
<li>Không có khoảng trắng ở trước và sau câu hoặc cụm từ nằm trong dấu ngoặc kép (“”).</li>
<li>Ký tự đầu của từ đầu tiên ở dòng đầu được viết hoa.</li>
<li>Không có dòng trống giữa các dòng.</li>
<li>Không có khoảng trắng giữa dấu phẩy hoặc dấu chấm và từ đứng ngay trước nó.</li>
<li>Cuối văn bản bắt buộc phải có dấu chấm.</li>
</ul>
<p>Chương trình <strong>phải dùng Exception</strong> để xử lý các lỗi khi đọc và ghi tệp (không tìm thấy
tệp, không đọc/ghi được, v.v.).</p>
<h3>Ví dụ</h3>
<p><strong>Tài liệu trước khi chuẩn hoá:</strong></p>
<pre>as you can see, detecting whether a string is normalized can be quite efficient. A lot of
the cost of normalizing in the “second row” is for the initialization of buffers. The cost
of which is amortized when one is processing larger strings.

As it turns out, these buffers are rarely needed, so we may change the implementation at
some point to speed up the common case for small strings even further</pre>
<p><strong>Tài liệu sau khi chuẩn hoá:</strong></p>
<pre>As you can see, detecting whether a string is normalized can be quite efficient. A lot of the cost of normalizing in the “second row” is for the initialization of buffers. The cost of which is amortized when one is processing larger strings. As it turns out, these buffers are rarely needed, so we may change the implementation at some point to speed up the common case for small strings even further.</pre>
<p><em>Lưu ý:</em> đoạn mẫu trong đề gốc có hai chỗ tự phá luật của chính nó — nó mở một dấu ngoặc kép ở
đầu đoạn mà không bao giờ đóng lại, và nó đổi <code>… of buffers. The cost …</code> thành
<code>… of buffers, the cost …</code> dù không luật nào cho phép biến dấu chấm thành dấu phẩy. Phần
<strong>Hướng dẫn</strong> mới là bản có hiệu lực; hãy làm theo bảy luật ở trên.</p>
<h3>Yêu cầu kỹ thuật</h3>
<ol>
<li>Lập trình theo phong cách hướng đối tượng.</li>
<li>Chỉ dùng các lớp và hàm lõi của Java (không dùng thư viện ngoài).</li>
</ol>
<h3>Hướng dẫn</h3>
<table>
<thead><tr><th>Slot</th><th>Công việc</th><th>Mô tả</th></tr></thead>
<tbody>
<tr><td>1</td><td>Thiết kế mã nguồn<br />Đọc tệp văn bản</td><td>Nên dùng <code>BufferedReader</code>,
<code>StringBuffer</code>…</td></tr>
<tr><td>2</td><td>Chuẩn hoá nội dung</td><td>Giữa hai từ chỉ một khoảng trắng.<br />Sau dấu phẩy (,),
dấu chấm (.) và dấu hai chấm (:) chỉ một khoảng trắng. Ký tự đầu của từ sau dấu chấm viết hoa, các từ
khác viết thường.</td></tr>
<tr><td>3</td><td>Chuẩn hoá nội dung</td><td>Không có khoảng trắng trước và sau câu hoặc cụm từ trong
dấu ngoặc kép (“”).<br />Ký tự đầu của từ đầu tiên ở dòng đầu viết hoa.</td></tr>
<tr><td>4</td><td>Chuẩn hoá nội dung</td><td>Không có khoảng trắng giữa dấu phẩy hoặc dấu chấm và từ
đứng trước nó.<br />Cuối văn bản phải có dấu chấm.<br />Ghi kết quả ra tệp output.</td></tr>
<tr><td>5</td><td>Rà soát chương trình</td><td></td></tr>
</tbody></table>
<p><strong>Gợi ý làm bài.</strong> Đừng viết bảy luật thành bảy lệnh <code>replaceAll</code> nối đuôi
nhau: các luật chồng lên nhau, và kết quả sẽ phụ thuộc vào lệnh nào chạy trước. Hãy duyệt chuỗi bằng
một <code>StringBuilder</code>/<code>StringBuffer</code> và tách thành các lượt riêng, mỗi lượt một
việc, theo thứ tự: gom khoảng trắng → hạ chữ thường → xử lý <code>, . :</code> → siết dấu ngoặc kép →
viết hoa đầu câu → thêm dấu chấm cuối. Đọc/ghi tệp bằng <code>BufferedReader</code>/
<code>BufferedWriter</code> có nêu rõ <code>StandardCharsets.UTF_8</code>, và bọc trong
<code>try-with-resources</code>.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
