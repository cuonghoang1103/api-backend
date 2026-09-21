/**
 * BỘ SOÁT MÁY 25 MỤC — chốt hành vi.
 *
 * Mỗi phép kiểm dưới đây là một loại lỗi ĐÃ GẶP THẬT trong 54 lời giải LAB211
 * khi đối chiếu với tờ checklist giấy ngày 21/09/2026 — và một ca "viết đúng"
 * đi kèm để bộ soát không báo nhầm. Báo nhầm "trượt" là dạy người học sửa cái
 * không sai; bỏ sót là để họ mang lỗi đi gặp thầy.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { soatDuAn, tomTatChoPrompt, type TepJava } from './soatJava.js';
import { CHECKLIST_THAY } from './checklistThay.js';

/** Một project nhỏ viết ĐÚNG tờ giấy — mọi mục máy chấm phải là "dat". */
const SACH: TepJava[] = [
  {
    duong: 'src/constants/Message.java',
    noiDung: `package constants;

/**
 * Every message the program prints.
 *
 * @author HE176322
 */
public final class Message {

    // Prompt for the size.
    public static final String INPUT_SIZE = "Enter size: ";

    // Label in front of the sorted array.
    public static final String LABEL_SORTED = "Sorted array: ";

    // Private constructor: this class only holds constants.
    private Message() {
    }
}
`,
  },
  {
    duong: 'src/repository/NumberRepository.java',
    noiDung: `package repository;

/**
 * Holds the numbers of the program.
 *
 * @author HE176322
 */
public class NumberRepository {

    // The numbers, in their current order.
    private int[] numberArray;

    // Creates an empty store.
    public NumberRepository() {
        numberArray = new int[0];
    }

    // Returns the numbers.
    public int[] getNumberArray() {
        return numberArray;
    }

    // Replaces the numbers.
    public void setNumberArray(int[] numberArray) {
        this.numberArray = numberArray;
    }
}
`,
  },
  {
    duong: 'src/view/SortView.java',
    noiDung: `package view;

import constants.Message;
import dto.SortResponseDTO;

/**
 * Prints the sorted array.
 *
 * @author HE176322
 */
public class SortView {

    // The result to print, handed over by the controller.
    private SortResponseDTO responseDTO;

    // Receives the result the next display() prints.
    public void setResponseDTO(SortResponseDTO responseDTO) {
        this.responseDTO = responseDTO;
    }

    // Prints the label, then the array.
    public void display() {
        System.out.print(Message.LABEL_SORTED);
        System.out.println(responseDTO.getSorted());
    }
}
`,
  },
  {
    duong: 'src/utils/Validation.java',
    noiDung: `package utils;

/**
 * Shared checks of what the user typed.
 *
 * @author HE176322
 */
public final class Validation {

    // Private constructor: every method is called through the class name.
    private Validation() {
    }

    // Converts a choice and checks it lies in [min, max].
    public static int getChoice(String input, int min, int max) throws Exception {
        int choice = 0;

        // parse first, so letters give the number message
        try {
            choice = Integer.parseInt(input.trim());
        } catch (NumberFormatException e) {
            // not a number at all
            throw new Exception(input);
        }

        // then the range
        if ((choice < min) || (choice > max)) {
            throw new Exception(input);
        }

        return choice;
    }
}
`,
  },
];

function mucCua(files: TepJava[], stt: string) {
  return soatDuAn(files).theoMuc[stt]!;
}

test('project viết đúng tờ giấy: không mục nào trượt', () => {
  const kq = soatDuAn(SACH);
  const truot = Object.entries(kq.theoMuc).filter(([, m]) => m.ket === 'truot');
  assert.deepEqual(truot.map(([stt, m]) => `${stt}: ${m.bangChung[0]?.ghiChu}`), []);
  assert.equal(kq.coRepository, true);
});

test('1.1 — thiếu repository là trượt, kể cả bài thuật toán', () => {
  const khongRepo = SACH.filter((t) => !t.duong.includes('/repository/'));
  const m = mucCua(khongRepo, '1.1');
  assert.equal(m.ket, 'truot');
  assert.match(m.bangChung[0]!.ghiChu, /Bắt buộc phải có repository/);
});

test('1.1 — View nhận dữ liệu qua THAM SỐ là trượt; setter + display() thì không', () => {
  const sai: TepJava = {
    duong: 'src/view/DoctorView.java',
    noiDung: `package view;

/**
 * View.
 */
public class DoctorView {

    // Prints one message.
    public void showMessage(String message) {
        System.out.println(message);
    }
}
`,
  };
  const m = mucCua([...SACH, sai], '1.1');
  assert.equal(m.ket, 'truot');
  assert.ok(m.bangChung.some((b) => /showMessage\(String\).*THAM SỐ/.test(b.ghiChu)));
});

test('1.1 — controller gọi view hai lần trong một hàm là trượt', () => {
  const ctrl: TepJava = {
    duong: 'src/controller/DoctorController.java',
    noiDung: `package controller;

import view.DoctorView;

/**
 * Controller.
 */
public class DoctorController {

    // Prints.
    private DoctorView doctorView;

    // Creates the controller.
    public DoctorController() {
        doctorView = new DoctorView();
    }

    // Deletes, then shows two things.
    public void deleteDoctor() {
        doctorView.display();
        doctorView.displayAll();
    }
}
`,
  };
  const m = mucCua([...SACH, ctrl], '1.1');
  assert.ok(m.bangChung.some((b) => /gọi view 2 lần/.test(b.ghiChu)));
});

test('1.1 — đọc tệp trong repository là trượt (tờ giấy: đọc file ở Main)', () => {
  const repo: TepJava = {
    duong: 'src/repository/DoctorRepository.java',
    noiDung: `package repository;

import utils.FileUtils;

/**
 * Repo.
 */
public class DoctorRepository {

    // Loads.
    public void loadDoctors() {
        FileUtils.readLines();
    }
}
`,
  };
  const m = mucCua([...SACH, repo], '1.1');
  assert.ok(m.bangChung.some((b) => /đọc tệp \/ mã hoá ngoài Main/.test(b.ghiChu)));
});

test('1.3 — interface phải bắt đầu bằng I, exception phải kết thúc bằng Exception', () => {
  const t: TepJava[] = [
    { duong: 'src/service/SortStrategy.java', noiDung: 'package service;\n\n/** S. */\npublic interface SortStrategy {\n}\n' },
    { duong: 'src/exceptions/ExceptionCar.java', noiDung: 'package exceptions;\n\n/** E. */\npublic class ExceptionCar extends Exception {\n}\n' },
    { duong: 'src/service/ISortStrategy.java', noiDung: 'package service;\n\n/** S. */\npublic interface ISortStrategy {\n}\n' },
  ];
  const m = mucCua([...SACH, ...t], '1.3');
  const ghi = m.bangChung.map((b) => b.ghiChu).join(' | ');
  assert.match(ghi, /interface "SortStrategy"/);
  assert.match(ghi, /ExceptionCar/);
  assert.doesNotMatch(ghi, /"ISortStrategy"/);
});

test('1.5 — đuôi List/Map/Array và viết Id', () => {
  const t: TepJava = {
    duong: 'src/repository/StudentRepository.java',
    noiDung: `package repository;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Repo.
 */
public class StudentRepository {

    // Students.
    private ArrayList<String> students = new ArrayList<>();

    // Scores.
    private HashMap<String, Integer> scoreMap = new HashMap<>();

    // Id of the last student.
    private String lastStudentID = "";

    // Returns all.
    public ArrayList<String> getStudents() {
        String[] parts = lastStudentID.split(",");

        // use everything once
        scoreMap.clear();
        students.add(parts[0]);
        return students;
    }
}
`,
  };
  const ghi = mucCua([...SACH, t], '1.5').bangChung.map((b) => b.ghiChu).join(' | ');
  assert.match(ghi, /"students".*phải kết thúc bằng "List"/);
  assert.match(ghi, /"parts".*phải kết thúc bằng "Array"/);
  assert.match(ghi, /viết "Id" chứ không "ID" \(lastStudentID\)/);
  assert.doesNotMatch(ghi, /"scoreMap"/);
});

test('2.6 + 3.7 + 2.8 — khai báo giữa block, không khởi tạo, thiếu dòng trống', () => {
  const t: TepJava = {
    duong: 'src/main/Main.java',
    noiDung: `package main;

import java.util.Scanner;

/**
 * Main.
 */
public final class Main {

    // No object.
    private Main() {
    }

    // Starts.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int size;
        System.out.println(size);
        String line = sc.nextLine();
        // prints the line
        System.out.println(line);
    }
}
`,
  };
  const kq = soatDuAn([...SACH, t]);
  assert.ok(kq.theoMuc['2.6']!.bangChung.some((b) => /"line" khai báo GIỮA block/.test(b.ghiChu)));
  assert.ok(kq.theoMuc['3.7']!.bangChung.some((b) => /"size" khai báo mà không khởi tạo/.test(b.ghiChu)));
  assert.equal(kq.theoMuc['2.8']!.ket, 'truot');
});

test('3.3 — so sánh cạnh || phải có ngoặc riêng; viết đúng thì không báo', () => {
  const t: TepJava = {
    duong: 'src/service/RangeService.java',
    noiDung: `package service;

/**
 * Range.
 */
public class RangeService {

    // Checks the range.
    public boolean isOutside(int value, int max) {
        // outside when negative or too big
        if (value < 0 || value > max) {
            return true;
        }

        return false;
    }
}
`,
  };
  const m = mucCua([...SACH, t], '3.3');
  assert.equal(m.ket, 'truot');
  assert.equal(mucCua(SACH, '3.3').ket, 'dat', 'Validation mẫu đã có ngoặc — không được báo');
});

test('3.4 — lớp toàn static thiếu final là trượt; Main thì chỉ rủi ro', () => {
  const t: TepJava[] = [
    {
      duong: 'src/utils/FileUtils.java',
      noiDung: 'package utils;\n\n/** F. */\npublic class FileUtils {\n\n    // Reads.\n    public static void readLines() {\n    }\n}\n',
    },
    {
      duong: 'src/main/Main.java',
      noiDung: 'package main;\n\n/** M. */\npublic class Main {\n\n    // Starts.\n    public static void main(String[] args) {\n    }\n}\n',
    },
  ];
  const m = mucCua([...SACH, ...t], '3.4');
  assert.equal(m.ket, 'truot');
  assert.ok(m.bangChung.some((b) => b.ket === 'truot' && /FileUtils/.test(b.ghiChu)));
  assert.ok(m.bangChung.some((b) => b.ket === 'ruiRo' && /Main/.test(b.ghiChu)));
});

test('3.8 — String += là trượt', () => {
  const t: TepJava = {
    duong: 'src/service/TextService.java',
    noiDung: `package service;

/**
 * Text.
 */
public class TextService {

    // Joins.
    public String joinAll(String first) {
        String result = "";

        // add the first part
        result += first;
        return result;
    }
}
`,
  };
  assert.equal(mucCua([...SACH, t], '3.8').ket, 'truot');
});

test('3.6 — field chỉ gán mà không đọc là trượt', () => {
  const t: TepJava = {
    duong: 'src/service/Ebank.java',
    noiDung: `package service;

/**
 * Bank.
 */
public class Ebank {

    // The last account.
    private String account;

    // Logs in.
    public void login(String accountNumber) {
        account = accountNumber;
    }
}
`,
  };
  const m = mucCua([...SACH, t], '3.6');
  assert.ok(m.bangChung.some((b) => /chỉ được gán/.test(b.ghiChu)));
});

test('danh sách mục máy chấm khớp tờ giấy, và tóm tắt cho prompt có file:dòng', () => {
  const kq = soatDuAn(SACH);
  for (const stt of Object.keys(kq.theoMuc)) {
    assert.ok(CHECKLIST_THAY.some((m) => m.stt === stt), `mục ${stt} không có trên tờ giấy`);
  }
  assert.equal(CHECKLIST_THAY.length, 25, 'tờ giấy có đúng 25 mục');
  const khongRepo = soatDuAn(SACH.filter((t) => !t.duong.includes('/repository/')));
  const tom = tomTatChoPrompt(khongRepo);
  assert.match(tom, /repository\/: MISSING/);
  assert.match(tom, /\[1\.1\] truot/);
});
