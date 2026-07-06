/* eslint-disable */
/**
 * Prisma seed — English learning data (mined from ENGLISH_LEARNING_ROADMAP_FOR_DEV)
 * plus Japanese kana. Run with:  tsx prisma/seed.my-language.ts
 *
 * Fully idempotent & safe to re-run on production:
 *  - languages are upserted by unique code
 *  - categories / words / grammar / conversation / qna / alphabet are find-before-create
 *  - nothing is ever deleted
 *
 * Data is embedded (the source markdown lives outside the repo and is not on prod).
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ============================ TYPES ============================
interface WordSeed {
  word: string;
  meaningVi: string;
  exampleSentence: string | null;
  exampleMeaning: string | null;
  note: string | null;
  pron: string | null; // IPA (English) or romaji (Japanese)
}
interface CategorySeed {
  name: string;
  icon: string;
  words: WordSeed[];
}
interface ExampleSeed {
  sentence: string;
  pronunciation?: string;
  meaningVi: string;
}
interface GrammarSeed {
  level: string;
  title: string;
  structure: string;
  explanation: string;
  examples: ExampleSeed[];
  commonMistakes: string | null;
  comparedWith: string | null;
}
interface ConversationSeed {
  question: string;
  answer: string;
  meaningVi: string | null;
  note: string | null;
}
interface QnaSeed {
  question: string;
  answer: string;
}
interface AlphaItem {
  character: string;
  romanization: string;
  note?: string;
}
interface AlphaGroup {
  name: string;
  description: string;
  items: AlphaItem[];
}

// ============================ DATA ============================
const EN_VOCAB_CATEGORIES: CategorySeed[] = [
  {
    "name": "Lập trình cơ bản",
    "icon": "💻",
    "words": [
      {
        "word": "variable",
        "meaningVi": "biến",
        "exampleSentence": "A variable stores a value temporarily",
        "exampleMeaning": null,
        "note": "Code: int count = 5;",
        "pron": "/ˈveə.ri.ə.bəl/"
      },
      {
        "word": "function",
        "meaningVi": "hàm",
        "exampleSentence": "A function performs a specific task",
        "exampleMeaning": null,
        "note": "Code: void greet() {}",
        "pron": "/ˈfʌŋk.ʃən/"
      },
      {
        "word": "loop",
        "meaningVi": "vòng lặp",
        "exampleSentence": "A loop repeats code multiple times",
        "exampleMeaning": null,
        "note": "Code: for (int i=0; i<10; i++)",
        "pron": "/luːp/"
      },
      {
        "word": "array",
        "meaningVi": "mảng",
        "exampleSentence": "An array holds multiple values of the same type",
        "exampleMeaning": null,
        "note": "Code: String[] names = {\"A\",\"B\"};",
        "pron": "/əˈreɪ/"
      },
      {
        "word": "string",
        "meaningVi": "chuỗi",
        "exampleSentence": "A string is a sequence of characters",
        "exampleMeaning": null,
        "note": "Code: String name = \"Hoang\";",
        "pron": "/strɪŋ/"
      },
      {
        "word": "integer",
        "meaningVi": "số nguyên",
        "exampleSentence": "An integer is a whole number",
        "exampleMeaning": null,
        "note": "Code: int age = 25;",
        "pron": "/ˈɪn.tɪ.dʒər/"
      },
      {
        "word": "boolean",
        "meaningVi": "kiểu logic",
        "exampleSentence": "Boolean is either true or false",
        "exampleMeaning": null,
        "note": "Code: boolean isActive = true;",
        "pron": "/ˈbuː.li.ən/"
      },
      {
        "word": "double",
        "meaningVi": "số thực",
        "exampleSentence": "Double holds decimal numbers",
        "exampleMeaning": null,
        "note": "Code: double price = 99.99;",
        "pron": "/ˈdʌb.əl/"
      },
      {
        "word": "character",
        "meaningVi": "ký tự",
        "exampleSentence": "A character is a single letter or symbol",
        "exampleMeaning": null,
        "note": "Code: char grade = 'A';",
        "pron": "/ˈkær.ək.tər/"
      },
      {
        "word": "constant",
        "meaningVi": "hằng số",
        "exampleSentence": "A constant never changes its value",
        "exampleMeaning": null,
        "note": "Code: final int MAX = 100;",
        "pron": "/ˈkɒn.stənt/"
      },
      {
        "word": "operator",
        "meaningVi": "toán tử",
        "exampleSentence": "An operator performs operations on values",
        "exampleMeaning": null,
        "note": "Code: + - * / % == !=",
        "pron": "/ˈɒp.ə.reɪ.tər/"
      },
      {
        "word": "operand",
        "meaningVi": "toán hạng",
        "exampleSentence": "Operands are the values an operator works on",
        "exampleMeaning": null,
        "note": "Code: 5 + 3 → 5 và 3 là operands",
        "pron": "/ˈɒp.ər.ænd/"
      },
      {
        "word": "statement",
        "meaningVi": "câu lệnh",
        "exampleSentence": "A statement is a complete instruction",
        "exampleMeaning": null,
        "note": "Code: x = x + 1;",
        "pron": "/ˈsteɪ.tmənt/"
      },
      {
        "word": "expression",
        "meaningVi": "biểu thức",
        "exampleSentence": "An expression evaluates to a value",
        "exampleMeaning": null,
        "note": "Code: a + b * 2",
        "pron": "/ɪkˈspreʃ.ən/"
      },
      {
        "word": "condition",
        "meaningVi": "điều kiện",
        "exampleSentence": "A condition checks if something is true",
        "exampleMeaning": null,
        "note": "Code: if (x > 10)",
        "pron": "/kənˈdɪʃ.ən/"
      },
      {
        "word": "iteration",
        "meaningVi": "lần lặp",
        "exampleSentence": "Each run of a loop is an iteration",
        "exampleMeaning": null,
        "note": "Code: for (int i = 0; i < 10; i++)",
        "pron": "/ˌɪt.əˈreɪ.ʃən/"
      },
      {
        "word": "index",
        "meaningVi": "chỉ mục",
        "exampleSentence": "Index starts from 0 in most languages",
        "exampleMeaning": null,
        "note": "Code: arr[0]",
        "pron": "/ˈɪn.deks/"
      },
      {
        "word": "length",
        "meaningVi": "độ dài",
        "exampleSentence": "Length tells how many elements an array has",
        "exampleMeaning": null,
        "note": "Code: arr.length",
        "pron": "/leŋθ/"
      },
      {
        "word": "value",
        "meaningVi": "giá trị",
        "exampleSentence": "A value is the data stored in a variable",
        "exampleMeaning": null,
        "note": "Code: int x = 5;",
        "pron": "/ˈvæljuː/"
      },
      {
        "word": "type",
        "meaningVi": "kiểu",
        "exampleSentence": "Type defines what kind of data a variable holds",
        "exampleMeaning": null,
        "note": "Code: int, String, boolean",
        "pron": "/taɪp/"
      },
      {
        "word": "input",
        "meaningVi": "đầu vào",
        "exampleSentence": "Input is data that goes into a program",
        "exampleMeaning": null,
        "note": "Code: The input is a username and password",
        "pron": "/ˈɪn.pʊt/"
      },
      {
        "word": "output",
        "meaningVi": "đầu ra",
        "exampleSentence": "Output is the result a program produces",
        "exampleMeaning": null,
        "note": "Code: The output is \"Hello, Hoang!\"",
        "pron": "/ˈaʊt.pʊt/"
      },
      {
        "word": "compile",
        "meaningVi": "biên dịch",
        "exampleSentence": "Compile means to convert source code to machine code",
        "exampleMeaning": null,
        "note": "Code: First, we compile the Java file",
        "pron": "/kəmˈpaɪl/"
      },
      {
        "word": "run",
        "meaningVi": "chạy",
        "exampleSentence": "Run means to execute a program",
        "exampleMeaning": null,
        "note": "Code: Run the program to see the output",
        "pron": "/rʌn/"
      },
      {
        "word": "debug",
        "meaningVi": "gỡ lỗi",
        "exampleSentence": "Debug means to find and fix errors",
        "exampleMeaning": null,
        "note": "Code: I spent 2 hours debugging this function",
        "pron": "/diːˈbʌɡ/"
      },
      {
        "word": "error",
        "meaningVi": "lỗi",
        "exampleSentence": "An error is a mistake in code",
        "exampleMeaning": null,
        "note": "Code: There's an error on line 42",
        "pron": "/ˈer.ər/"
      },
      {
        "word": "syntax",
        "meaningVi": "cú pháp",
        "exampleSentence": "Syntax is the grammar rules of a language",
        "exampleMeaning": null,
        "note": "Code: You have a syntax error",
        "pron": "/ˈsɪn.tæks/"
      },
      {
        "word": "keyword",
        "meaningVi": "từ khóa",
        "exampleSentence": "Keywords are reserved words in a language",
        "exampleMeaning": null,
        "note": "Code: if, for, while are keywords",
        "pron": "/ˈkiː.wɜːd/"
      },
      {
        "word": "method",
        "meaningVi": "phương thức",
        "exampleSentence": "A method is a function inside a class",
        "exampleMeaning": null,
        "note": "Code: The main method is the entry point",
        "pron": "/ˈmeθ.əd/"
      },
      {
        "word": "argument",
        "meaningVi": "đối số",
        "exampleSentence": "Arguments are values passed TO a method",
        "exampleMeaning": null,
        "note": "Code: greet(\"Hoang\") — \"Hoang\" is the argument",
        "pron": "/ˈɑː.ɡjʊ.mənt/"
      },
      {
        "word": "parameter",
        "meaningVi": "tham số",
        "exampleSentence": "Parameters are variables in a method definition",
        "exampleMeaning": null,
        "note": "Code: void greet(String name) — name is the parameter",
        "pron": "/pəˈræm.ɪ.tər/"
      },
      {
        "word": "return",
        "meaningVi": "trả về",
        "exampleSentence": "Return sends a value back from a method",
        "exampleMeaning": null,
        "note": "Code: This function returns an integer",
        "pron": "/rɪˈtɜːn/"
      },
      {
        "word": "call",
        "meaningVi": "gọi",
        "exampleSentence": "Call means to invoke a function",
        "exampleMeaning": null,
        "note": "Code: Call calculateTotal() to get the sum",
        "pron": "/kɔːl/"
      },
      {
        "word": "declare",
        "meaningVi": "khai báo",
        "exampleSentence": "Declare means to create a variable",
        "exampleMeaning": null,
        "note": "Code: Declare int count = 0;",
        "pron": "/dɪˈkleər/"
      },
      {
        "word": "initialize",
        "meaningVi": "khởi tạo",
        "exampleSentence": "Initialize means to give an initial value",
        "exampleMeaning": null,
        "note": "Code: Initialize the array with zeros",
        "pron": "/ɪˈnɪʃ.əl.aɪz/"
      },
      {
        "word": "assign",
        "meaningVi": "gán",
        "exampleSentence": "Assign means to give a value to a variable",
        "exampleMeaning": null,
        "note": "Code: Assign x = 10;",
        "pron": "/əˈsaɪn/"
      },
      {
        "word": "increment",
        "meaningVi": "tăng",
        "exampleSentence": "Increment means to increase by 1",
        "exampleMeaning": null,
        "note": "Code: i++ increments i by 1",
        "pron": "/ˈɪn.krɪ.mənt/"
      },
      {
        "word": "decrement",
        "meaningVi": "giảm",
        "exampleSentence": "Decrement means to decrease by 1",
        "exampleMeaning": null,
        "note": "Code: i-- decrements i by 1",
        "pron": "/ˈdiː.krɪ.mənt/"
      },
      {
        "word": "break",
        "meaningVi": "thoát",
        "exampleSentence": "Break exits a loop immediately",
        "exampleMeaning": null,
        "note": "Code: Use break to exit early",
        "pron": "/breɪk/"
      },
      {
        "word": "continue",
        "meaningVi": "tiếp tục",
        "exampleSentence": "Continue skips to the next iteration",
        "exampleMeaning": null,
        "note": "Code: Use continue to skip this step",
        "pron": "/kənˈtɪnjuː/"
      },
      {
        "word": "algorithm",
        "meaningVi": "thuật toán",
        "exampleSentence": "An algorithm is a step-by-step solution",
        "exampleMeaning": null,
        "note": "Code: Binary search is an efficient algorithm",
        "pron": "/ˈæl.ɡə.rɪ.ðəm/"
      },
      {
        "word": "data",
        "meaningVi": "dữ liệu",
        "exampleSentence": "Data is information a program processes",
        "exampleMeaning": null,
        "note": "Code: User data is stored in a database",
        "pron": "/ˈdeɪ.tə/"
      },
      {
        "word": "memory",
        "meaningVi": "bộ nhớ",
        "exampleSentence": "Memory stores data while a program runs",
        "exampleMeaning": null,
        "note": "Code: The array takes up 64 bytes of memory",
        "pron": "/ˈmem.ər.i/"
      },
      {
        "word": "stack",
        "meaningVi": "ngăn xếp",
        "exampleSentence": "Stack is LIFO memory for function calls",
        "exampleMeaning": null,
        "note": "Code: Each function call goes on the stack",
        "pron": "/stæk/"
      },
      {
        "word": "heap",
        "meaningVi": "heap",
        "exampleSentence": "Heap is memory for dynamic allocation",
        "exampleMeaning": null,
        "note": "Code: Objects are created on the heap",
        "pron": "/hiːp/"
      },
      {
        "word": "pointer",
        "meaningVi": "con trỏ",
        "exampleSentence": "A pointer stores a memory address",
        "exampleMeaning": null,
        "note": "Code: In C/C++, a pointer holds an address",
        "pron": "/ˈpɔɪn.tər/"
      },
      {
        "word": "recursion",
        "meaningVi": "đệ quy",
        "exampleSentence": "Recursion is when a function calls itself",
        "exampleMeaning": null,
        "note": "Code: Factorial is commonly done with recursion",
        "pron": "/rɪˈkɜːr.ʒən/"
      },
      {
        "word": "sorting",
        "meaningVi": "sắp xếp",
        "exampleSentence": "Sorting means arranging data in order",
        "exampleMeaning": null,
        "note": "Code: We can sort by name or by date",
        "pron": "/ˈsɔː.tɪŋ/"
      },
      {
        "word": "searching",
        "meaningVi": "tìm kiếm",
        "exampleSentence": "Searching means finding data",
        "exampleMeaning": null,
        "note": "Code: Binary search is faster than linear search",
        "pron": "/ˈsɜː.tʃɪŋ/"
      },
      {
        "word": "file",
        "meaningVi": "tệp",
        "exampleSentence": "A file stores data on disk",
        "exampleMeaning": null,
        "note": "Code: Open the config.json file",
        "pron": "/faɪl/"
      },
      {
        "word": "folder",
        "meaningVi": "thư mục",
        "exampleSentence": "A folder organizes files",
        "exampleMeaning": null,
        "note": "Code: Put all images in the assets folder",
        "pron": "/ˈfəʊl.dər/"
      },
      {
        "word": "path",
        "meaningVi": "đường dẫn",
        "exampleSentence": "A path is the location of a file",
        "exampleMeaning": null,
        "note": "Code: The path is C:/Users/Hoang/Documents",
        "pron": "/pɑːθ/"
      },
      {
        "word": "script",
        "meaningVi": "kịch bản",
        "exampleSentence": "A script is a set of instructions",
        "exampleMeaning": null,
        "note": "Code: Write a shell script to automate deployment",
        "pron": "/skrɪpt/"
      },
      {
        "word": "execute",
        "meaningVi": "thực thi",
        "exampleSentence": "Execute means to run a command",
        "exampleMeaning": null,
        "note": "Code: Execute the build command",
        "pron": "/ˈek.sɪ.kjuːt/"
      },
      {
        "word": "process",
        "meaningVi": "tiến trình",
        "exampleSentence": "A process is a running program",
        "exampleMeaning": null,
        "note": "Code: Kill the hanging process",
        "pron": "/ˈprəʊ.ses/"
      },
      {
        "word": "thread",
        "meaningVi": "luồng",
        "exampleSentence": "A thread is a smallest unit of a process",
        "exampleMeaning": null,
        "note": "Code: Use threads for parallel tasks",
        "pron": "/θred/"
      },
      {
        "word": "memory leak",
        "meaningVi": "rò rỉ bộ nhớ",
        "exampleSentence": "Memory leak is when memory is not freed",
        "exampleMeaning": null,
        "note": "Code: The leak caused the app to crash",
        "pron": "/ˈmem.ər.i liːk/"
      },
      {
        "word": "null",
        "meaningVi": "rỗng",
        "exampleSentence": "Null means no value or no object",
        "exampleMeaning": null,
        "note": "Code: Check if user is null before accessing",
        "pron": "/nʌl/"
      },
      {
        "word": "empty",
        "meaningVi": "trống",
        "exampleSentence": "Empty means no elements",
        "exampleMeaning": null,
        "note": "Code: Check if the list is empty",
        "pron": "/ˈemp.ti/"
      },
      {
        "word": "default",
        "meaningVi": "mặc định",
        "exampleSentence": "Default is the value if nothing is specified",
        "exampleMeaning": null,
        "note": "Code: The default port is 8080",
        "pron": "/dɪˈfɔːlt/"
      },
      {
        "word": "build",
        "meaningVi": "xây dựng",
        "exampleSentence": "Build means to compile all source files",
        "exampleMeaning": null,
        "note": "Code: Run mvn clean package to build",
        "pron": "/bɪld/"
      },
      {
        "word": "test",
        "meaningVi": "kiểm thử",
        "exampleSentence": "Test means to verify code works correctly",
        "exampleMeaning": null,
        "note": "Code: Write a test for each function",
        "pron": "/test/"
      },
      {
        "word": "fail",
        "meaningVi": "thất bại",
        "exampleSentence": "Fail means something went wrong",
        "exampleMeaning": null,
        "note": "Code: The test failed because of a null pointer",
        "pron": "/feɪl/"
      },
      {
        "word": "pass",
        "meaningVi": "đạt",
        "exampleSentence": "Pass means something works correctly",
        "exampleMeaning": null,
        "note": "Code: All 50 tests passed",
        "pron": "/pɑːs/"
      },
      {
        "word": "module",
        "meaningVi": "mô-đun",
        "exampleSentence": "A module is a self-contained unit of code",
        "exampleMeaning": null,
        "note": "Code: Import the utils module",
        "pron": "/ˈmɒd.juːl/"
      },
      {
        "word": "package",
        "meaningVi": "gói",
        "exampleSentence": "A package organizes related classes",
        "exampleMeaning": null,
        "note": "Code: The java.util package contains collections",
        "pron": "/ˈpæk.ɪdʒ/"
      },
      {
        "word": "import",
        "meaningVi": "nhập",
        "exampleSentence": "Import means to include another module",
        "exampleMeaning": null,
        "note": "Code: import java.util.List;",
        "pron": "/ɪmˈpɔːt/"
      },
      {
        "word": "export",
        "meaningVi": "xuất",
        "exampleSentence": "Export means to make available",
        "exampleMeaning": null,
        "note": "Code: Export the data to a CSV file",
        "pron": "/ɪkˈspɔːt/"
      },
      {
        "word": "handle",
        "meaningVi": "xử lý",
        "exampleSentence": "Handle means to deal with an event",
        "exampleMeaning": null,
        "note": "Code: Handle the button click event",
        "pron": "/ˈhæn.dəl/"
      },
      {
        "word": "catch",
        "meaningVi": "bắt",
        "exampleSentence": "Catch means to handle an exception",
        "exampleMeaning": null,
        "note": "Code: catch the exception and log it",
        "pron": "/kætʃ/"
      },
      {
        "word": "throw",
        "meaningVi": "ném",
        "exampleSentence": "Throw means to raise an exception",
        "exampleMeaning": null,
        "note": "Code: Throw an error if validation fails",
        "pron": "/θrəʊ/"
      },
      {
        "word": "runtime",
        "meaningVi": "thời gian chạy",
        "exampleSentence": "Runtime is when the program is executing",
        "exampleMeaning": null,
        "note": "Code: A null check error happens at runtime",
        "pron": "/ˈrʌn.taɪm/"
      },
      {
        "word": "compile-time",
        "meaningVi": "thời gian biên dịch",
        "exampleSentence": "Compile-time is when code is being compiled",
        "exampleMeaning": null,
        "note": "Code: A syntax error is caught at compile-time",
        "pron": "/kəmˈpaɪl.taɪm/"
      },
      {
        "word": "environment",
        "meaningVi": "môi trường",
        "exampleSentence": "Environment is the setup where code runs",
        "exampleMeaning": null,
        "note": "Code: We have dev, staging, and prod environments",
        "pron": "/ɪnˈvaɪ.rən.mənt/"
      },
      {
        "word": "server",
        "meaningVi": "máy chủ",
        "exampleSentence": "A server provides services to clients",
        "exampleMeaning": null,
        "note": "Code: The API server runs on port 8080",
        "pron": "/ˈsɜː.vər/"
      },
      {
        "word": "client",
        "meaningVi": "máy khách",
        "exampleSentence": "A client requests services from a server",
        "exampleMeaning": null,
        "note": "Code: The browser is the client",
        "pron": "/ˈklaɪ.ənt/"
      },
      {
        "word": "request",
        "meaningVi": "yêu cầu",
        "exampleSentence": "A request is a message from client to server",
        "exampleMeaning": null,
        "note": "Code: Send a GET request to the API",
        "pron": "/rɪˈkwest/"
      },
      {
        "word": "response",
        "meaningVi": "phản hồi",
        "exampleSentence": "A response is the server's reply",
        "exampleMeaning": null,
        "note": "Code: The response contains JSON data",
        "pron": "/rɪˈspɒns/"
      },
      {
        "word": "endpoint",
        "meaningVi": "điểm cuối",
        "exampleSentence": "An endpoint is a specific URL path",
        "exampleMeaning": null,
        "note": "Code: The /api/users endpoint returns all users",
        "pron": "/ˈend.pɔɪnt/"
      },
      {
        "word": "resource",
        "meaningVi": "tài nguyên",
        "exampleSentence": "A resource is a piece of data",
        "exampleMeaning": null,
        "note": "Code: A blog post is a resource",
        "pron": "/ˈriː.sɔːs/"
      },
      {
        "word": "payload",
        "meaningVi": "dữ liệu gửi",
        "exampleSentence": "Payload is the data part of a request",
        "exampleMeaning": null,
        "note": "Code: The JSON payload contains user data",
        "pron": "/ˈpeɪ.ləʊd/"
      },
      {
        "word": "query",
        "meaningVi": "truy vấn",
        "exampleSentence": "Query means to request data",
        "exampleMeaning": null,
        "note": "Code: Query the database for active users",
        "pron": "/ˈkwɪə.ri/"
      },
      {
        "word": "header",
        "meaningVi": "tiêu đề",
        "exampleSentence": "Header contains metadata about a request",
        "exampleMeaning": null,
        "note": "Code: The Authorization header holds the token",
        "pron": "/ˈhed.ər/"
      },
      {
        "word": "authentication",
        "meaningVi": "xác thực",
        "exampleSentence": "Authentication verifies who you are",
        "exampleMeaning": null,
        "note": "Code: Login is a form of authentication",
        "pron": "/ɔːˌθen.tɪˈkeɪ.ʃən/"
      },
      {
        "word": "authorization",
        "meaningVi": "phân quyền",
        "exampleSentence": "Authorization checks what you can do",
        "exampleMeaning": null,
        "note": "Code: Admin role is needed for authorization",
        "pron": "/ˌɔː.θər.aɪˈzeɪ.ʃən/"
      },
      {
        "word": "token",
        "meaningVi": "mã thông báo",
        "exampleSentence": "A token is a piece of data for auth",
        "exampleMeaning": null,
        "note": "Code: The JWT token expires in 15 minutes",
        "pron": "/ˈtəʊ.kən/"
      },
      {
        "word": "tokenize",
        "meaningVi": "tách từ",
        "exampleSentence": "Tokenize means to split text into words",
        "exampleMeaning": null,
        "note": "Code: Tokenize the sentence into words",
        "pron": "/ˈtəʊ.kən.aɪz/"
      },
      {
        "word": "encrypt",
        "meaningVi": "mã hóa",
        "exampleSentence": "Encrypt means to make data unreadable",
        "exampleMeaning": null,
        "note": "Code: Passwords are encrypted before storage",
        "pron": "/ɪnˈkrɪpt/"
      },
      {
        "word": "decrypt",
        "meaningVi": "giải mã",
        "exampleSentence": "Decrypt means to make encrypted data readable",
        "exampleMeaning": null,
        "note": "Code: Only the server can decrypt the data",
        "pron": "/dɪˈkrɪpt/"
      },
      {
        "word": "serialize",
        "meaningVi": "tuần tự hóa",
        "exampleSentence": "Serialize means to convert object to bytes",
        "exampleMeaning": null,
        "note": "Code: Serialize the object to JSON",
        "pron": "/ˈsɪə.ri.ə.laɪz/"
      },
      {
        "word": "deserialize",
        "meaningVi": "hủy tuần tự hóa",
        "exampleSentence": "Deserialize means to convert bytes back to object",
        "exampleMeaning": null,
        "note": "Code: Deserialize the JSON response",
        "pron": "/diːˈsɪə.ri.ə.laɪz/"
      },
      {
        "word": "fetch",
        "meaningVi": "lấy",
        "exampleSentence": "Fetch means to retrieve data",
        "exampleMeaning": null,
        "note": "Code: Fetch data from the API",
        "pron": "/fetʃ/"
      },
      {
        "word": "submit",
        "meaningVi": "gửi",
        "exampleSentence": "Submit means to send data",
        "exampleMeaning": null,
        "note": "Code: Submit the form to the server",
        "pron": "/səbˈmɪt/"
      },
      {
        "word": "redirect",
        "meaningVi": "chuyển hướng",
        "exampleSentence": "Redirect means to send user to another page",
        "exampleMeaning": null,
        "note": "Code: Redirect to the dashboard after login",
        "pron": "/rɪː.dɪˈrekt/"
      },
      {
        "word": "refresh",
        "meaningVi": "làm mới",
        "exampleSentence": "Refresh means to reload a page",
        "exampleMeaning": null,
        "note": "Code: Refresh the page to see updates",
        "pron": "/rɪˈfreʃ/"
      },
      {
        "word": "cache",
        "meaningVi": "bộ nhớ đệm",
        "exampleSentence": "Cache stores data for faster access",
        "exampleMeaning": null,
        "note": "Code: Cache the API response for 5 minutes",
        "pron": "/kæʃ/"
      },
      {
        "word": "timeout",
        "meaningVi": "hết thời gian",
        "exampleSentence": "Timeout is when a request takes too long",
        "exampleMeaning": null,
        "note": "Code: The request timed out after 30 seconds",
        "pron": "/ˈtaɪm.aʊt/"
      },
      {
        "word": "retry",
        "meaningVi": "thử lại",
        "exampleSentence": "Retry means to try again",
        "exampleMeaning": null,
        "note": "Code: Retry the request if it fails",
        "pron": "/rɪˈtraɪ/"
      },
      {
        "word": "buffer",
        "meaningVi": "bộ đệm",
        "exampleSentence": "Buffer temporarily stores data",
        "exampleMeaning": null,
        "note": "Code: Data is written to a buffer first",
        "pron": "/ˈbʌf.ər/"
      }
    ]
  },
  {
    "name": "OOP & Design Patterns",
    "icon": "🧩",
    "words": [
      {
        "word": "class",
        "meaningVi": "lớp",
        "exampleSentence": "A class is a blueprint for creating objects",
        "exampleMeaning": null,
        "note": null,
        "pron": "/klɑːs/"
      },
      {
        "word": "object",
        "meaningVi": "đối tượng",
        "exampleSentence": "An object is an instance of a class",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɒb.dʒekt/"
      },
      {
        "word": "instance",
        "meaningVi": "thể hiện",
        "exampleSentence": "This Dog is an instance of the Animal class",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.stəns/"
      },
      {
        "word": "attribute",
        "meaningVi": "thuộc tính",
        "exampleSentence": "Attributes store the state of an object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæt.rɪ.bjuːt/"
      },
      {
        "word": "behavior",
        "meaningVi": "hành vi",
        "exampleSentence": "Behavior describes what an object can do",
        "exampleMeaning": null,
        "note": null,
        "pron": "/bɪˈheɪ.vjər/"
      },
      {
        "word": "inheritance",
        "meaningVi": "kế thừa",
        "exampleSentence": "Inheritance allows code reuse through hierarchy",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪnˈher.ɪ.təns/"
      },
      {
        "word": "extends",
        "meaningVi": "mở rộng",
        "exampleSentence": "Class Dog extends Class Animal",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪkˈstendz/"
      },
      {
        "word": "override",
        "meaningVi": "ghi đè",
        "exampleSentence": "Override a method to change its behavior",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌəʊ.vəˈraɪd/"
      },
      {
        "word": "interface",
        "meaningVi": "giao diện",
        "exampleSentence": "An interface defines a contract for classes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.tə.feɪs/"
      },
      {
        "word": "implement",
        "meaningVi": "thực thi",
        "exampleSentence": "Implement all methods of an interface",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪm.plɪ.ment/"
      },
      {
        "word": "abstract",
        "meaningVi": "trừu tượng",
        "exampleSentence": "Abstract class cannot be instantiated directly",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæb.strækt/"
      },
      {
        "word": "constructor",
        "meaningVi": "hàm tạo",
        "exampleSentence": "Constructor initializes a new object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈstrʌk.tər/"
      },
      {
        "word": "encapsulation",
        "meaningVi": "đóng gói",
        "exampleSentence": "Encapsulation hides internal data from outside",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪnˌkæpsjuˈleɪ.ʃən/"
      },
      {
        "word": "polymorphism",
        "meaningVi": "đa hình",
        "exampleSentence": "Polymorphism allows objects of different types to be treated the same",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌpɒl.iˈmɔː.fɪ.zəm/"
      },
      {
        "word": "abstraction",
        "meaningVi": "trừu tượng",
        "exampleSentence": "Abstraction hides complex details from users",
        "exampleMeaning": null,
        "note": null,
        "pron": "/æbˈstræk.ʃən/"
      },
      {
        "word": "singleton",
        "meaningVi": "singleton",
        "exampleSentence": "Singleton ensures only one instance exists",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɪŋ.gəl.tən/"
      },
      {
        "word": "factory",
        "meaningVi": "factory",
        "exampleSentence": "Factory creates objects without specifying exact class",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfæk.tər.i/"
      },
      {
        "word": "observer",
        "meaningVi": "observer",
        "exampleSentence": "Observer notifies multiple objects of changes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əbˈzɜː.vər/"
      },
      {
        "word": "builder",
        "meaningVi": "builder",
        "exampleSentence": "Builder constructs complex objects step by step",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbɪl.dər/"
      },
      {
        "word": "dependency",
        "meaningVi": "phụ thuộc",
        "exampleSentence": "Class A depends on Class B if it uses B",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈpen.dən.si/"
      },
      {
        "word": "coupling",
        "meaningVi": "liên kết",
        "exampleSentence": "Coupling measures how dependent classes are",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkʌp.lɪŋ/"
      },
      {
        "word": "cohesion",
        "meaningVi": "gắn kết",
        "exampleSentence": "Cohesion measures how related a class's responsibilities are",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəʊˈhiː.ʒən/"
      },
      {
        "word": "refactor",
        "meaningVi": "tái cấu trúc",
        "exampleSentence": "Refactor means to improve code without changing behavior",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈfæk.tər/"
      },
      {
        "word": "instantiate",
        "meaningVi": "khởi tạo",
        "exampleSentence": "Instantiate means to create an object from a class",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.stən.tʃi.eɪt/"
      },
      {
        "word": "modifier",
        "meaningVi": "bổ ngữ",
        "exampleSentence": "Access modifier controls visibility",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmɒd.ɪ.faɪ.ər/"
      },
      {
        "word": "access",
        "meaningVi": "truy cập",
        "exampleSentence": "Access modifier sets who can use a member",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæk.ses/"
      },
      {
        "word": "public",
        "meaningVi": "công khai",
        "exampleSentence": "Public means anyone can access it",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpʌb.lɪk/"
      },
      {
        "word": "private",
        "meaningVi": "riêng tư",
        "exampleSentence": "Private means only within the class",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpraɪ.vət/"
      },
      {
        "word": "protected",
        "meaningVi": "bảo vệ",
        "exampleSentence": "Protected means subclass can access",
        "exampleMeaning": null,
        "note": null,
        "pron": "/prəˈtekt.ɪd/"
      },
      {
        "word": "static",
        "meaningVi": "tĩnh",
        "exampleSentence": "Static belongs to the class, not the instance",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈstæt.ɪk/"
      },
      {
        "word": "final",
        "meaningVi": "cuối cùng",
        "exampleSentence": "Final means value cannot change",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfaɪ.nəl/"
      },
      {
        "word": "abstract class",
        "meaningVi": "lớp trừu tượng",
        "exampleSentence": "Abstract class may have both abstract and concrete methods",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæb.strækt klɑːs/"
      },
      {
        "word": "concrete",
        "meaningVi": "cụ thể",
        "exampleSentence": "Concrete class provides full implementation",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɒŋ.kriːt/"
      },
      {
        "word": "contract",
        "meaningVi": "hợp đồng",
        "exampleSentence": "Interface is a contract that a class must follow",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɒn.trækt/"
      },
      {
        "word": "delegate",
        "meaningVi": "ủy thác",
        "exampleSentence": "Delegate means to pass responsibility to another",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdel.ɪ.ɡeɪt/"
      },
      {
        "word": "aggregate",
        "meaningVi": "tổng hợp",
        "exampleSentence": "Aggregate combines multiple objects into one",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæɡ.rɪ.ɡeɪt/"
      },
      {
        "word": "composition",
        "meaningVi": "hợp thành",
        "exampleSentence": "Composition means an object contains other objects",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌkɒm.pəˈzɪʃ.ən/"
      },
      {
        "word": "association",
        "meaningVi": "kết hợp",
        "exampleSentence": "Association is a relationship between classes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˌsəʊ.siˈeɪ.ʃən/"
      },
      {
        "word": "aggregation",
        "meaningVi": "tổng hợp",
        "exampleSentence": "Aggregation is a \"has-a\" relationship",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌæɡ.rɪˈɡeɪ.ʃən/"
      },
      {
        "word": "dependency injection",
        "meaningVi": "tiêm phụ thuộc",
        "exampleSentence": "DI passes dependencies to a class from outside",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈpen.dən.si ɪnˈdʒek.ʃən/"
      },
      {
        "word": "composition over inheritance",
        "meaningVi": "hợp thành hơn kế thừa",
        "exampleSentence": "Prefer composition over inheritance for flexibility",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌkɒm.pəˈzɪʃ.ən əʊvər ɪnˈher.ɪ.təns/"
      },
      {
        "word": "method signature",
        "meaningVi": "chữ ký phương thức",
        "exampleSentence": "Signature is the method name plus parameters",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmeθ.əd ˈsɪɡ.nə.tʃər/"
      },
      {
        "word": "overload",
        "meaningVi": "nạp chồng",
        "exampleSentence": "Overload means same name, different parameters",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌəʊ.vəˈləʊd/"
      },
      {
        "word": "type casting",
        "meaningVi": "ép kiểu",
        "exampleSentence": "Type casting converts one type to another",
        "exampleMeaning": null,
        "note": null,
        "pron": "/taɪp ˈkɑːst.ɪŋ/"
      },
      {
        "word": "upcasting",
        "meaningVi": "ép kiểu lên",
        "exampleSentence": "Upcasting casts a subclass to its superclass",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈʌp.kɑːst.ɪŋ/"
      },
      {
        "word": "downcasting",
        "meaningVi": "ép kiểu xuống",
        "exampleSentence": "Downcasting casts a superclass to its subclass",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdaʊn.kɑːst.ɪŋ/"
      },
      {
        "word": "generic",
        "meaningVi": "generic",
        "exampleSentence": "Generic allows type-safe collections",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dʒəˈner.ɪk/"
      },
      {
        "word": "annotation",
        "meaningVi": "chú thích",
        "exampleSentence": "Annotation adds metadata to code",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌæn.əˈteɪ.ʃən/"
      },
      {
        "word": "immutability",
        "meaningVi": "tính bất biến",
        "exampleSentence": "Immutability means an object cannot be changed after creation",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪˌmjuː.təˈbɪl.ə.ti/"
      },
      {
        "word": "thread-safe",
        "meaningVi": "an toàn đa luồng",
        "exampleSentence": "Thread-safe means safe to use in multiple threads",
        "exampleMeaning": null,
        "note": null,
        "pron": "/θred siːf/"
      },
      {
        "word": "synchronization",
        "meaningVi": "đồng bộ hóa",
        "exampleSentence": "Synchronization prevents race conditions",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌsɪŋ.krə.naɪˈzeɪ.ʃən/"
      },
      {
        "word": "race condition",
        "meaningVi": "điều kiện đua",
        "exampleSentence": "Race condition when threads access shared data incorrectly",
        "exampleMeaning": null,
        "note": null,
        "pron": "/reɪs kənˈdɪʃ.ən/"
      },
      {
        "word": "deadlock",
        "meaningVi": "bế tắc",
        "exampleSentence": "Deadlock when two threads wait for each other forever",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈded.lɒk/"
      },
      {
        "word": "fluent interface",
        "meaningVi": "giao diện fluent",
        "exampleSentence": "Fluent interface chains method calls",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfluː.ənt ˈɪn.tə.feɪs/"
      },
      {
        "word": "decorator",
        "meaningVi": "decorator",
        "exampleSentence": "Decorator adds behavior to an object dynamically",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdek.ə.reɪ.tər/"
      },
      {
        "word": "adapter",
        "meaningVi": "adapter",
        "exampleSentence": "Adapter converts one interface to another",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈdæp.tər/"
      },
      {
        "word": "facade",
        "meaningVi": "facade",
        "exampleSentence": "Facade provides a simple interface to complex code",
        "exampleMeaning": null,
        "note": null,
        "pron": "/fəˈsɑːd/"
      },
      {
        "word": "strategy",
        "meaningVi": "chiến lược",
        "exampleSentence": "Strategy defines interchangeable algorithms",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈstræt.ə.dʒi/"
      },
      {
        "word": "template method",
        "meaningVi": "phương thức mẫu",
        "exampleSentence": "Template method defines the skeleton of an algorithm",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtem.plət ˈmeθ.əd/"
      },
      {
        "word": "state",
        "meaningVi": "trạng thái",
        "exampleSentence": "State is the current condition of an object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/steɪt/"
      },
      {
        "word": "command",
        "meaningVi": "lệnh",
        "exampleSentence": "Command encapsulates a request as an object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈmɑːnd/"
      },
      {
        "word": "memento",
        "meaningVi": "memento",
        "exampleSentence": "Memento captures an object's state to restore later",
        "exampleMeaning": null,
        "note": null,
        "pron": "/məˈmen.təʊ/"
      },
      {
        "word": "chain of responsibility",
        "meaningVi": "chuỗi trách nhiệm",
        "exampleSentence": "Chain passes request along until handled",
        "exampleMeaning": null,
        "note": null,
        "pron": "/tʃeɪn əv rɪˌspɒn.səˈbɪl.ə.ti/"
      },
      {
        "word": "flyweight",
        "meaningVi": "flyweight",
        "exampleSentence": "Flyweight shares common data to save memory",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈflaɪ.weɪt/"
      },
      {
        "word": "proxy",
        "meaningVi": "proxy",
        "exampleSentence": "Proxy acts as a substitute for another object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈprɒk.si/"
      },
      {
        "word": "composite",
        "meaningVi": "composite",
        "exampleSentence": "Composite lets clients treat objects uniformly",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɒm.pə.zɪt/"
      },
      {
        "word": "mediator",
        "meaningVi": "mediator",
        "exampleSentence": "Mediator controls how objects communicate",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmiː.di.eɪ.tər/"
      },
      {
        "word": "visitor",
        "meaningVi": "visitor",
        "exampleSentence": "Visitor adds new operations without changing classes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈvɪz.ɪ.tər/"
      },
      {
        "word": "solid principles",
        "meaningVi": "nguyên tắc solid",
        "exampleSentence": "SOLID: 5 principles for good OOP design",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɒl.ɪd ˈprɪn.sə.pəlz/"
      },
      {
        "word": "single responsibility",
        "meaningVi": "đơn trách nhiệm",
        "exampleSentence": "A class should have only one reason to change",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɪŋ.ɡəl rɪˌspɒn.səˈbɪl.ə.ti/"
      },
      {
        "word": "open/closed",
        "meaningVi": "mở/đóng",
        "exampleSentence": "Open for extension, closed for modification",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈəʊ.pən kləʊzd/"
      },
      {
        "word": "liskov substitution",
        "meaningVi": "thay thế liskov",
        "exampleSentence": "Subtypes must be substitutable for base types",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈlɪs.kɒf ˌsʌb.stɪˈtuː.ʃən/"
      },
      {
        "word": "interface segregation",
        "meaningVi": "phân tách giao diện",
        "exampleSentence": "Prefer many small interfaces over one large one",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.tə.feɪs ˌseɡ.rɪˈɡeɪ.ʃən/"
      },
      {
        "word": "dependency inversion",
        "meaningVi": "đảo ngược phụ thuộc",
        "exampleSentence": "Depend on abstractions, not concrete classes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈpen.dən.si ɪnˈvɜː.ʒən/"
      },
      {
        "word": "domain",
        "meaningVi": "miền",
        "exampleSentence": "Domain is the business logic area",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dəˈmeɪn/"
      },
      {
        "word": "entity",
        "meaningVi": "thực thể",
        "exampleSentence": "Entity represents a business object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈen.tɪ.ti/"
      },
      {
        "word": "value object",
        "meaningVi": "đối tượng giá trị",
        "exampleSentence": "Value object is defined by its attributes, not identity",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈvæljuː ˈɒb.dʒekt/"
      },
      {
        "word": "service",
        "meaningVi": "dịch vụ",
        "exampleSentence": "Service contains business logic",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɜː.vɪs/"
      },
      {
        "word": "repository",
        "meaningVi": "kho",
        "exampleSentence": "Repository abstracts the data layer",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈpɒz.ɪ.tər.i/"
      },
      {
        "word": "unit of work",
        "meaningVi": "đơn vị công việc",
        "exampleSentence": "Unit of work groups related database operations",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈjuː.nɪt əv wɜːk/"
      },
      {
        "word": "cqrs",
        "meaningVi": "phân tách đọc/ghi",
        "exampleSentence": "CQRS separates read and write operations",
        "exampleMeaning": null,
        "note": null,
        "pron": "/siː kjuː ɑː es/"
      },
      {
        "word": "event sourcing",
        "meaningVi": "nguồn sự kiện",
        "exampleSentence": "Event sourcing stores all state changes as events",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪˈvent ˈsɔː.sɪŋ/"
      },
      {
        "word": "mapper",
        "meaningVi": "mapper",
        "exampleSentence": "Mapper converts between data formats",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmæp.ər/"
      },
      {
        "word": "dto",
        "meaningVi": "đối tượng truyền dữ liệu",
        "exampleSentence": "DTO transfers data between layers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diː tiː əʊ/"
      },
      {
        "word": "vo",
        "meaningVi": "đối tượng giá trị",
        "exampleSentence": "VO is an immutable object representing a value",
        "exampleMeaning": null,
        "note": null,
        "pron": "/viː əʊ/"
      },
      {
        "word": "aggregate root",
        "meaningVi": "gốc tổng hợp",
        "exampleSentence": "Aggregate root is the main entity of a group",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæɡ.rɪ.ɡeɪt ruːt/"
      },
      {
        "word": "bounded context",
        "meaningVi": "ngữ cảnh giới hạn",
        "exampleSentence": "Bounded context defines a clear boundary",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbaʊn.dɪd ˈkɒn.tekst/"
      },
      {
        "word": "domain event",
        "meaningVi": "sự kiện miền",
        "exampleSentence": "Domain event signals something important happened",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dəˈmeɪn ɪˈvent/"
      },
      {
        "word": "anti-pattern",
        "meaningVi": "chống mẫu",
        "exampleSentence": "Anti-pattern is a commonly used but bad solution",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæn.tiˈpæt.ən/"
      },
      {
        "word": "code smell",
        "meaningVi": "mùi code",
        "exampleSentence": "Code smell suggests a potential problem",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəʊd smel/"
      },
      {
        "word": "technical debt",
        "meaningVi": "nợ kỹ thuật",
        "exampleSentence": "Technical debt is the cost of quick fixes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtek.nɪ.kəl det/"
      },
      {
        "word": "convention",
        "meaningVi": "quy ước",
        "exampleSentence": "Convention is an agreed way of doing things",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈven.ʃən/"
      },
      {
        "word": "configuration",
        "meaningVi": "cấu hình",
        "exampleSentence": "Configuration sets up how the app behaves",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˌfɪɡ.jʊˈreɪ.ʃən/"
      },
      {
        "word": "convention over configuration",
        "meaningVi": "quy ước hơn cấu hình",
        "exampleSentence": "Convention over configuration reduces setup",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈven.ʃən əʊvər kənˌfɪɡ.jʊˈreɪ.ʃən/"
      },
      {
        "word": "opinionated",
        "meaningVi": "có ý kiến",
        "exampleSentence": "Opinionated framework makes decisions for you",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈpɪn.jə.neɪ.tɪd/"
      },
      {
        "word": "model",
        "meaningVi": "mô hình",
        "exampleSentence": "Model represents data and business rules",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmɒd.əl/"
      },
      {
        "word": "view",
        "meaningVi": "giao diện",
        "exampleSentence": "View is what the user sees",
        "exampleMeaning": null,
        "note": null,
        "pron": "/vjuː/"
      },
      {
        "word": "controller",
        "meaningVi": "bộ điều khiển",
        "exampleSentence": "Controller handles user input and coordinates",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈtrəʊ.lər/"
      }
    ]
  },
  {
    "name": "Database & SQL",
    "icon": "🗄️",
    "words": [
      {
        "word": "database",
        "meaningVi": "cơ sở dữ liệu",
        "exampleSentence": "The database stores all user information",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdeɪ.tə.beɪs/"
      },
      {
        "word": "table",
        "meaningVi": "bảng",
        "exampleSentence": "The users table has columns for name and email",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈteɪ.bəl/"
      },
      {
        "word": "row",
        "meaningVi": "dòng",
        "exampleSentence": "Each row represents one user in the table",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rəʊ/"
      },
      {
        "word": "column",
        "meaningVi": "cột",
        "exampleSentence": "The email column stores user email addresses",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɒl.əm/"
      },
      {
        "word": "query",
        "meaningVi": "truy vấn",
        "exampleSentence": "Write a query to get all active users",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkwɪə.ri/"
      },
      {
        "word": "primary key",
        "meaningVi": "khóa chính",
        "exampleSentence": "The id column is the primary key",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpraɪ.mər.i kiː/"
      },
      {
        "word": "foreign key",
        "meaningVi": "khóa ngoại",
        "exampleSentence": "The user_id is a foreign key referencing users",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfɒr.ɪn kiː/"
      },
      {
        "word": "index",
        "meaningVi": "chỉ mục",
        "exampleSentence": "An index speeds up data retrieval",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.deks/"
      },
      {
        "word": "join",
        "meaningVi": "nối bảng",
        "exampleSentence": "Join the orders table with customers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dʒɔɪn/"
      },
      {
        "word": "select",
        "meaningVi": "chọn",
        "exampleSentence": "Select all users who signed up this month",
        "exampleMeaning": null,
        "note": null,
        "pron": "/sɪˈlekt/"
      },
      {
        "word": "insert",
        "meaningVi": "chèn",
        "exampleSentence": "Insert a new row into the products table",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪnˈsɜːt/"
      },
      {
        "word": "update",
        "meaningVi": "cập nhật",
        "exampleSentence": "Update the user's profile picture",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ʌpˈdeɪt/"
      },
      {
        "word": "delete",
        "meaningVi": "xóa",
        "exampleSentence": "Delete the post where id equals 5",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈliːt/"
      },
      {
        "word": "where",
        "meaningVi": "điều kiện lọc",
        "exampleSentence": "Where clause filters results",
        "exampleMeaning": null,
        "note": null,
        "pron": "/weər/"
      },
      {
        "word": "group by",
        "meaningVi": "nhóm theo",
        "exampleSentence": "Group by category to count products",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɡruːp baɪ/"
      },
      {
        "word": "order by",
        "meaningVi": "sắp xếp theo",
        "exampleSentence": "Order by created_date descending",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɔː.dər baɪ/"
      },
      {
        "word": "constraint",
        "meaningVi": "ràng buộc",
        "exampleSentence": "Constraint ensures data integrity",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈstreɪnt/"
      },
      {
        "word": "schema",
        "meaningVi": "lược đồ",
        "exampleSentence": "Schema defines the structure of the database",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈskiː.mə/"
      },
      {
        "word": "migration",
        "meaningVi": "di chuyển",
        "exampleSentence": "Run the migration to create new tables",
        "exampleMeaning": null,
        "note": null,
        "pron": "/maɪˈɡreɪ.ʃən/"
      },
      {
        "word": "transaction",
        "meaningVi": "giao dịch",
        "exampleSentence": "Use a transaction to ensure data consistency",
        "exampleMeaning": null,
        "note": null,
        "pron": "/trænˈzæk.ʃən/"
      },
      {
        "word": "commit",
        "meaningVi": "cam kết",
        "exampleSentence": "Commit the transaction to save changes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈmɪt/"
      },
      {
        "word": "rollback",
        "meaningVi": "quay lại",
        "exampleSentence": "Rollback if anything goes wrong",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈrəʊl.bæk/"
      },
      {
        "word": "normalize",
        "meaningVi": "chuẩn hóa",
        "exampleSentence": "Normalize the database to reduce redundancy",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈnɔː.mə.laɪz/"
      },
      {
        "word": "denormalize",
        "meaningVi": "bỏ chuẩn hóa",
        "exampleSentence": "Denormalize for better read performance",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diːˈnɔː.mə.laɪz/"
      },
      {
        "word": "relation",
        "meaningVi": "quan hệ",
        "exampleSentence": "A relation is a table in relational DB",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈleɪ.ʃən/"
      },
      {
        "word": "cardinality",
        "meaningVi": "bản số",
        "exampleSentence": "Cardinality describes the relationship between tables",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌkɑː.dɪ.nəˈlæl.ə.ti/"
      },
      {
        "word": "relationship",
        "meaningVi": "mối quan hệ",
        "exampleSentence": "The one-to-many relationship is common",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈleɪ.ʃən.ʃɪp/"
      },
      {
        "word": "entity",
        "meaningVi": "thực thể",
        "exampleSentence": "Each entity maps to a table",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈen.tɪ.ti/"
      },
      {
        "word": "attribute",
        "meaningVi": "thuộc tính",
        "exampleSentence": "Attributes become columns in the table",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæt.rɪ.bjuːt/"
      },
      {
        "word": "aggregate",
        "meaningVi": "tổng hợp",
        "exampleSentence": "Aggregate functions return a single value",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæɡ.rɪ.ɡeɪt/"
      },
      {
        "word": "union",
        "meaningVi": "hợp",
        "exampleSentence": "Union combines results from two queries",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈjuː.ni.ən/"
      },
      {
        "word": "intersect",
        "meaningVi": "giao",
        "exampleSentence": "Intersect returns common rows",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌɪn.təˈsekt/"
      },
      {
        "word": "except",
        "meaningVi": "trừ",
        "exampleSentence": "Except returns rows in first but not second",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪkˈsept/"
      },
      {
        "word": "subquery",
        "meaningVi": "truy vấn con",
        "exampleSentence": "A subquery is a query inside another query",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsʌb.kwɪə.ri/"
      },
      {
        "word": "cte",
        "meaningVi": "biểu thức bảng",
        "exampleSentence": "CTE makes complex queries readable",
        "exampleMeaning": null,
        "note": null,
        "pron": "/siː tiː iː/"
      },
      {
        "word": "window function",
        "meaningVi": "hàm cửa sổ",
        "exampleSentence": "Window functions operate on a set of rows",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈwɪn.dəʊ ˈfʌŋk.ʃən/"
      },
      {
        "word": "view",
        "meaningVi": "khung nhìn",
        "exampleSentence": "A view is a virtual table based on a query",
        "exampleMeaning": null,
        "note": null,
        "pron": "/vjuː/"
      },
      {
        "word": "materialized view",
        "meaningVi": "khung nhìn vật lý",
        "exampleSentence": "Materialized view stores the result physically",
        "exampleMeaning": null,
        "note": null,
        "pron": "/məˈtɪə.ri.ə.laɪzd vjuː/"
      },
      {
        "word": "trigger",
        "meaningVi": "kích hoạt",
        "exampleSentence": "Trigger fires automatically on an event",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtrɪɡ.ər/"
      },
      {
        "word": "stored procedure",
        "meaningVi": "thủ tục lưu trữ",
        "exampleSentence": "Stored procedure runs complex logic in the DB",
        "exampleMeaning": null,
        "note": null,
        "pron": "/stɔːd prəˈsiː.dʒər/"
      },
      {
        "word": "function",
        "meaningVi": "hàm",
        "exampleSentence": "Function returns a value, procedure does not",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfʌŋk.ʃən/"
      },
      {
        "word": "null",
        "meaningVi": "rỗng",
        "exampleSentence": "Null means the absence of a value",
        "exampleMeaning": null,
        "note": null,
        "pron": "/nʌl/"
      },
      {
        "word": "primary",
        "meaningVi": "chính",
        "exampleSentence": "Primary means first or most important",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpraɪ.mər.i/"
      },
      {
        "word": "unique",
        "meaningVi": "duy nhất",
        "exampleSentence": "Unique constraint ensures no duplicates",
        "exampleMeaning": null,
        "note": null,
        "pron": "/juːˈniːk/"
      },
      {
        "word": "check",
        "meaningVi": "kiểm tra",
        "exampleSentence": "Check constraint limits allowed values",
        "exampleMeaning": null,
        "note": null,
        "pron": "/tʃek/"
      },
      {
        "word": "default",
        "meaningVi": "mặc định",
        "exampleSentence": "Default sets a value if none is provided",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈfɔːlt/"
      },
      {
        "word": "cascade",
        "meaningVi": "xóa cascade",
        "exampleSentence": "Cascade deletes related rows automatically",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kæˈskeɪd/"
      },
      {
        "word": "truncate",
        "meaningVi": "cắt ngắn",
        "exampleSentence": "Truncate removes all rows quickly",
        "exampleMeaning": null,
        "note": null,
        "pron": "/trʌŋˈkeɪt/"
      },
      {
        "word": "drop",
        "meaningVi": "xóa bỏ",
        "exampleSentence": "Drop table removes the table entirely",
        "exampleMeaning": null,
        "note": null,
        "pron": "/drɒp/"
      },
      {
        "word": "alter",
        "meaningVi": "thay đổi",
        "exampleSentence": "Alter table adds or removes columns",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɔːl.tər/"
      },
      {
        "word": "rename",
        "meaningVi": "đổi tên",
        "exampleSentence": "Rename column from old_name to new_name",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈneɪm/"
      },
      {
        "word": "referential integrity",
        "meaningVi": "toàn vẹn tham chiếu",
        "exampleSentence": "Referential integrity keeps data consistent",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌref.əˈren.tʃəl ɪnˈteɡ.rə.ti/"
      },
      {
        "word": "acid",
        "meaningVi": "acid",
        "exampleSentence": "ACID: Atomicity, Consistency, Isolation, Durability",
        "exampleMeaning": null,
        "note": null,
        "pron": "/æs.ɪd/"
      },
      {
        "word": "atomicity",
        "meaningVi": "nguyên tử",
        "exampleSentence": "Atomicity means all or nothing",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌæt.əˈmɪs.ə.ti/"
      },
      {
        "word": "consistency",
        "meaningVi": "nhất quán",
        "exampleSentence": "Consistency ensures valid state after transaction",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈsɪs.tən.si/"
      },
      {
        "word": "isolation",
        "meaningVi": "cô lập",
        "exampleSentence": "Isolation keeps transactions independent",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌaɪ.səˈleɪ.ʃən/"
      },
      {
        "word": "durability",
        "meaningVi": "bền vững",
        "exampleSentence": "Durability ensures committed data is saved",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌdjʊə.rəˈbɪl.ə.ti/"
      },
      {
        "word": "deadlock",
        "meaningVi": "bế tắc",
        "exampleSentence": "Deadlock occurs when transactions wait forever",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈded.lɒk/"
      },
      {
        "word": "lock",
        "meaningVi": "khóa",
        "exampleSentence": "Lock prevents concurrent access to data",
        "exampleMeaning": null,
        "note": null,
        "pron": "/lɒk/"
      },
      {
        "word": "isolation level",
        "meaningVi": "mức cô lập",
        "exampleSentence": "Isolation level controls transaction visibility",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌaɪ.səˈleɪ.ʃən ˈlev.əl/"
      },
      {
        "word": "read uncommitted",
        "meaningVi": "đọc chưa cam kết",
        "exampleSentence": "Lowest isolation, dirty reads possible",
        "exampleMeaning": null,
        "note": null,
        "pron": "/riːd ˌʌn.kəˈmɪt.ɪd/"
      },
      {
        "word": "read committed",
        "meaningVi": "đọc đã cam kết",
        "exampleSentence": "Only committed data is visible",
        "exampleMeaning": null,
        "note": null,
        "pron": "/riːd kəˈmɪt.ɪd/"
      },
      {
        "word": "repeatable read",
        "meaningVi": "đọc lặp lại",
        "exampleSentence": "Same query returns same result",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈpiː.tə.bəl riːd/"
      },
      {
        "word": "serializable",
        "meaningVi": "có thể tuần tự hóa",
        "exampleSentence": "Highest isolation, transactions run one by one",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌsɪə.ri.əˈlaɪ.zə.bəl/"
      },
      {
        "word": "snapshot",
        "meaningVi": "ảnh chụp nhanh",
        "exampleSentence": "Snapshot isolation uses versioned data",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsnæp.ʃɒt/"
      },
      {
        "word": "vacuum",
        "meaningVi": "dọn dẹp",
        "exampleSentence": "Vacuum reclaims storage after deletion",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈvæk.jʊm/"
      },
      {
        "word": "analyze",
        "meaningVi": "phân tích",
        "exampleSentence": "Analyze updates statistics for query planner",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæn.əl.aɪz/"
      },
      {
        "word": "explain",
        "meaningVi": "giải thích",
        "exampleSentence": "Explain shows the query execution plan",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪkˈspleɪn/"
      },
      {
        "word": "cluster",
        "meaningVi": "cụm",
        "exampleSentence": "Cluster organizes data physically on disk",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈklʌs.tər/"
      },
      {
        "word": "partition",
        "meaningVi": "phân vùng",
        "exampleSentence": "Partition splits a table into pieces",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɑːˈtɪʃ.ən/"
      },
      {
        "word": "sharding",
        "meaningVi": "phân mảnh",
        "exampleSentence": "Sharding splits data across databases",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈʃɑː.dɪŋ/"
      },
      {
        "word": "replication",
        "meaningVi": "sao chép",
        "exampleSentence": "Replication copies data to multiple servers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌrep.lɪˈkeɪ.ʃən/"
      },
      {
        "word": "backup",
        "meaningVi": "sao lưu",
        "exampleSentence": "Backup protects against data loss",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbæk.ʌp/"
      },
      {
        "word": "restore",
        "meaningVi": "khôi phục",
        "exampleSentence": "Restore recovers data from a backup",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈstɔː/"
      },
      {
        "word": "recovery",
        "meaningVi": "phục hồi",
        "exampleSentence": "Recovery brings database to a consistent state",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈkʌv.ər.i/"
      },
      {
        "word": "failover",
        "meaningVi": "chuyển đổi dự phòng",
        "exampleSentence": "Failover switches to backup server",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfeɪl.əʊ.vər/"
      },
      {
        "word": "connection pool",
        "meaningVi": "hồ kết nối",
        "exampleSentence": "Connection pool reuses database connections",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈnek.ʃən puːl/"
      }
    ]
  },
  {
    "name": "Web & API",
    "icon": "🌐",
    "words": [
      {
        "word": "endpoint",
        "meaningVi": "điểm cuối",
        "exampleSentence": "The /api/users/123 endpoint returns user data",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈend.pɔɪnt/"
      },
      {
        "word": "request",
        "meaningVi": "yêu cầu",
        "exampleSentence": "The client sends a GET request to the API",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈkwest/"
      },
      {
        "word": "response",
        "meaningVi": "phản hồi",
        "exampleSentence": "The response contains a 200 status code",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈspɒns/"
      },
      {
        "word": "header",
        "meaningVi": "tiêu đề",
        "exampleSentence": "The Authorization header holds the JWT token",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈhed.ər/"
      },
      {
        "word": "body",
        "meaningVi": "thân",
        "exampleSentence": "The request body contains JSON data",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbɒd.i/"
      },
      {
        "word": "authentication",
        "meaningVi": "xác thực",
        "exampleSentence": "Authentication verifies the user's identity",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɔːˌθen.tɪˈkeɪ.ʃən/"
      },
      {
        "word": "authorization",
        "meaningVi": "phân quyền",
        "exampleSentence": "Authorization checks if user can access resource",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌɔː.θər.aɪˈzeɪ.ʃən/"
      },
      {
        "word": "token",
        "meaningVi": "mã thông báo",
        "exampleSentence": "The JWT token contains user information",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtəʊ.kən/"
      },
      {
        "word": "payload",
        "meaningVi": "dữ liệu gửi",
        "exampleSentence": "The payload is the data part of the token",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpeɪ.ləʊd/"
      },
      {
        "word": "status code",
        "meaningVi": "mã trạng thái",
        "exampleSentence": "200 means OK, 404 means Not Found",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsteɪ.təs kəʊd/"
      },
      {
        "word": "json",
        "meaningVi": "json",
        "exampleSentence": "API returns data in JSON format",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdʒeɪ.sɒn/"
      },
      {
        "word": "serialize",
        "meaningVi": "tuần tự hóa",
        "exampleSentence": "Serialize the object to JSON string",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɪə.ri.ə.laɪz/"
      },
      {
        "word": "deserialize",
        "meaningVi": "hủy tuần tự hóa",
        "exampleSentence": "Deserialize the JSON response to object",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diːˈsɪə.ri.ə.laɪz/"
      },
      {
        "word": "fetch",
        "meaningVi": "lấy dữ liệu",
        "exampleSentence": "Use fetch to call the REST API",
        "exampleMeaning": null,
        "note": null,
        "pron": "/fetʃ/"
      },
      {
        "word": "submit",
        "meaningVi": "gửi",
        "exampleSentence": "Submit the form data to the server",
        "exampleMeaning": null,
        "note": null,
        "pron": "/səbˈmɪt/"
      },
      {
        "word": "redirect",
        "meaningVi": "chuyển hướng",
        "exampleSentence": "Redirect to login page if not authenticated",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪː.dɪˈrekt/"
      },
      {
        "word": "timeout",
        "meaningVi": "hết thời gian",
        "exampleSentence": "Request timed out after 30 seconds",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtaɪm.aʊt/"
      },
      {
        "word": "retry",
        "meaningVi": "thử lại",
        "exampleSentence": "Retry the request if it fails",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈtraɪ/"
      },
      {
        "word": "cache",
        "meaningVi": "bộ nhớ đệm",
        "exampleSentence": "Cache API responses for faster load",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kæʃ/"
      },
      {
        "word": "refresh",
        "meaningVi": "làm mới",
        "exampleSentence": "Pull down to refresh the page",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈfreʃ/"
      },
      {
        "word": "async",
        "meaningVi": "bất đồng bộ",
        "exampleSentence": "Async operations don't block the main thread",
        "exampleMeaning": null,
        "note": null,
        "pron": "/eɪˈsɪŋk/"
      },
      {
        "word": "await",
        "meaningVi": "chờ",
        "exampleSentence": "Use await to wait for async to complete",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈweɪt/"
      },
      {
        "word": "promise",
        "meaningVi": "lời hứa",
        "exampleSentence": "Promise represents a future value",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈprɒm.ɪs/"
      },
      {
        "word": "callback",
        "meaningVi": "gọi lại",
        "exampleSentence": "Callback runs when an async task completes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɔːl.bæk/"
      },
      {
        "word": "middleware",
        "meaningVi": "phần mềm trung gian",
        "exampleSentence": "Middleware processes requests before the handler",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmɪd.əl.weər/"
      },
      {
        "word": "route",
        "meaningVi": "tuyến",
        "exampleSentence": "Define the route for the API endpoint",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ruːt/"
      },
      {
        "word": "proxy",
        "meaningVi": "proxy",
        "exampleSentence": "Proxy server forwards requests for you",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈprɒk.si/"
      },
      {
        "word": "server",
        "meaningVi": "máy chủ",
        "exampleSentence": "The backend server handles API requests",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɜː.vər/"
      },
      {
        "word": "client",
        "meaningVi": "máy khách",
        "exampleSentence": "The frontend client consumes the API",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈklaɪ.ənt/"
      },
      {
        "word": "backend",
        "meaningVi": "phía máy chủ",
        "exampleSentence": "Backend handles business logic and DB",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbæk.end/"
      },
      {
        "word": "frontend",
        "meaningVi": "phía máy khách",
        "exampleSentence": "Frontend handles the user interface",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfrʌnt.end/"
      },
      {
        "word": "full-stack",
        "meaningVi": "full-stack",
        "exampleSentence": "Full-stack means both frontend and backend",
        "exampleMeaning": null,
        "note": null,
        "pron": "/fʊl stæk/"
      },
      {
        "word": "restful",
        "meaningVi": "restful",
        "exampleSentence": "RESTful APIs follow REST principles",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈres.tfʊl/"
      },
      {
        "word": "soap",
        "meaningVi": "soap",
        "exampleSentence": "SOAP is an older protocol for web services",
        "exampleMeaning": null,
        "note": null,
        "pron": "/səʊp/"
      },
      {
        "word": "graphql",
        "meaningVi": "graphql",
        "exampleSentence": "GraphQL lets clients request specific data",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dʒiː.əˈkjuː.el/"
      },
      {
        "word": "websocket",
        "meaningVi": "websocket",
        "exampleSentence": "WebSocket enables real-time two-way communication",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈweb.sɒk.ɪt/"
      },
      {
        "word": "http",
        "meaningVi": "http",
        "exampleSentence": "HTTP is the protocol for web communication",
        "exampleMeaning": null,
        "note": null,
        "pron": "/eɪtʃ tiː piː/"
      },
      {
        "word": "https",
        "meaningVi": "https",
        "exampleSentence": "HTTPS encrypts data in transit",
        "exampleMeaning": null,
        "note": null,
        "pron": "/eɪtʃ tiː piː es/"
      },
      {
        "word": "ssl",
        "meaningVi": "ssl",
        "exampleSentence": "SSL secures the connection",
        "exampleMeaning": null,
        "note": null,
        "pron": "/es es el/"
      },
      {
        "word": "tls",
        "meaningVi": "tls",
        "exampleSentence": "TLS is the modern version of SSL",
        "exampleMeaning": null,
        "note": null,
        "pron": "/tiː el es/"
      },
      {
        "word": "certificate",
        "meaningVi": "chứng chỉ",
        "exampleSentence": "SSL certificate verifies the server identity",
        "exampleMeaning": null,
        "note": null,
        "pron": "/səˈtɪf.ɪ.kət/"
      },
      {
        "word": "domain",
        "meaningVi": "tên miền",
        "exampleSentence": "The domain is www.example.com",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dəˈmeɪn/"
      },
      {
        "word": "subdomain",
        "meaningVi": "tên miền phụ",
        "exampleSentence": "api.example.com is a subdomain",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsʌb.də.meɪn/"
      },
      {
        "word": "dns",
        "meaningVi": "dns",
        "exampleSentence": "DNS translates domain to IP address",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diː en es/"
      },
      {
        "word": "url",
        "meaningVi": "url",
        "exampleSentence": "URL is the full address of a resource",
        "exampleMeaning": null,
        "note": null,
        "pron": "/juː ɑː el/"
      },
      {
        "word": "uri",
        "meaningVi": "uri",
        "exampleSentence": "URI identifies a resource uniquely",
        "exampleMeaning": null,
        "note": null,
        "pron": "/juː ɑːr aɪ/"
      },
      {
        "word": "protocol",
        "meaningVi": "giao thức",
        "exampleSentence": "HTTP is the protocol used for web",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈprəʊ.tə.kɒl/"
      },
      {
        "word": "host",
        "meaningVi": "máy chủ",
        "exampleSentence": "The host is example.com",
        "exampleMeaning": null,
        "note": null,
        "pron": "/həʊst/"
      },
      {
        "word": "port",
        "meaningVi": "cổng",
        "exampleSentence": "Port 80 is for HTTP, 443 for HTTPS",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɔːt/"
      },
      {
        "word": "path",
        "meaningVi": "đường dẫn",
        "exampleSentence": "The path is /api/users/123",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɑːθ/"
      },
      {
        "word": "query param",
        "meaningVi": "tham số truy vấn",
        "exampleSentence": "?page=2&limit=10 are query parameters",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkwɪə.ri pəˈræm.ɪ.tər/"
      },
      {
        "word": "fragment",
        "meaningVi": "phần định danh",
        "exampleSentence": "#section is a fragment identifier",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfræɡ.mənt/"
      },
      {
        "word": "pagination",
        "meaningVi": "phân trang",
        "exampleSentence": "Pagination splits results into pages",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌpædʒ.ɪˈneɪ.ʃən/"
      },
      {
        "word": "rate limit",
        "meaningVi": "giới hạn tốc độ",
        "exampleSentence": "Rate limit restricts requests per minute",
        "exampleMeaning": null,
        "note": null,
        "pron": "/reɪt ˈlɪm.ɪt/"
      },
      {
        "word": "throttle",
        "meaningVi": "điều tiết",
        "exampleSentence": "Throttle slow requests to save resources",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈθrɒd.əl/"
      },
      {
        "word": "webhook",
        "meaningVi": "webhook",
        "exampleSentence": "Webhook notifies your app of events",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈweb.hʊk/"
      },
      {
        "word": "polling",
        "meaningVi": "polling",
        "exampleSentence": "Polling checks for updates repeatedly",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpəʊ.lɪŋ/"
      },
      {
        "word": "streaming",
        "meaningVi": "truyền dữ liệu",
        "exampleSentence": "Streaming sends data as it becomes available",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈstriː.mɪŋ/"
      },
      {
        "word": "chunk",
        "meaningVi": "khối",
        "exampleSentence": "Data is split into chunks for streaming",
        "exampleMeaning": null,
        "note": null,
        "pron": "/tʃʌŋk/"
      },
      {
        "word": "upload",
        "meaningVi": "tải lên",
        "exampleSentence": "Upload a file to the server",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈʌp.ləʊd/"
      },
      {
        "word": "download",
        "meaningVi": "tải xuống",
        "exampleSentence": "Download the report as PDF",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdaʊn.ləʊd/"
      },
      {
        "word": "compression",
        "meaningVi": "nén",
        "exampleSentence": "Compression reduces data size",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəmˈpreʃ.ən/"
      },
      {
        "word": "encoding",
        "meaningVi": "mã hóa",
        "exampleSentence": "Encoding converts data to a specific format",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪnˈkəʊ.dɪŋ/"
      },
      {
        "word": "decoding",
        "meaningVi": "giải mã",
        "exampleSentence": "Decoding converts encoded data back",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diːˈkəʊ.dɪŋ/"
      },
      {
        "word": "parsing",
        "meaningVi": "phân tích cú pháp",
        "exampleSentence": "Parsing converts string to data structure",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpɑː.zɪŋ/"
      },
      {
        "word": "validation",
        "meaningVi": "kiểm tra hợp lệ",
        "exampleSentence": "Validation ensures data meets requirements",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌvæl.ɪˈdeɪ.ʃən/"
      },
      {
        "word": "sanitization",
        "meaningVi": "làm sạch",
        "exampleSentence": "Sanitization removes harmful characters",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌsæn.ɪ.tɪˈzeɪ.ʃən/"
      },
      {
        "word": "cors",
        "meaningVi": "cors",
        "exampleSentence": "CORS allows cross-origin requests",
        "exampleMeaning": null,
        "note": null,
        "pron": "/siː əʊ ɑː es/"
      },
      {
        "word": "origin",
        "meaningVi": "nguồn gốc",
        "exampleSentence": "Origin is the combination of protocol + domain + port",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɒr.ɪ.dʒɪn/"
      },
      {
        "word": "preflight",
        "meaningVi": "tiền kiểm tra",
        "exampleSentence": "Preflight request checks CORS headers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpriː.flaɪt/"
      },
      {
        "word": "cookie",
        "meaningVi": "cookie",
        "exampleSentence": "Cookie stores session data in the browser",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkʊk.i/"
      },
      {
        "word": "session",
        "meaningVi": "phiên",
        "exampleSentence": "Session stores user state on the server",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈseʃ.ən/"
      },
      {
        "word": "local storage",
        "meaningVi": "lưu trữ cục bộ",
        "exampleSentence": "LocalStorage persists data in the browser",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈləʊ.kəl ˈstɔː.rɪdʒ/"
      },
      {
        "word": "stateless",
        "meaningVi": "phi trạng thái",
        "exampleSentence": "REST is stateless — no session stored",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsteɪt.ləs/"
      },
      {
        "word": "stateful",
        "meaningVi": "có trạng thái",
        "exampleSentence": "Stateful keeps track of user session",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsteɪt.fʊl/"
      },
      {
        "word": "load balancer",
        "meaningVi": "cân bằng tải",
        "exampleSentence": "Load balancer distributes traffic to servers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ləʊd ˈbæl.ən.sər/"
      },
      {
        "word": "reverse proxy",
        "meaningVi": "proxy ngược",
        "exampleSentence": "Reverse proxy hides the backend servers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈvɜːs ˈprɒk.si/"
      }
    ]
  },
  {
    "name": "DevOps & Cloud",
    "icon": "☁️",
    "words": [
      {
        "word": "deploy",
        "meaningVi": "triển khai",
        "exampleSentence": "Deploy the app to the production server",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈplɔɪ/"
      },
      {
        "word": "container",
        "meaningVi": "container",
        "exampleSentence": "Container packages an app with its dependencies",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈteɪ.nər/"
      },
      {
        "word": "image",
        "meaningVi": "image",
        "exampleSentence": "Docker image is a blueprint for containers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪm.ɪdʒ/"
      },
      {
        "word": "volume",
        "meaningVi": "ổ lưu trữ",
        "exampleSentence": "Volume persists data outside the container",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈvɒl.juːm/"
      },
      {
        "word": "environment",
        "meaningVi": "môi trường",
        "exampleSentence": "We have dev, staging, and prod environments",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪnˈvaɪ.rən.mənt/"
      },
      {
        "word": "pipeline",
        "meaningVi": "đường ống",
        "exampleSentence": "CI/CD pipeline automates the release process",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpaɪp.laɪn/"
      },
      {
        "word": "version control",
        "meaningVi": "kiểm soát phiên bản",
        "exampleSentence": "Git is a version control system",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈvɜː.ʃən kənˈtrəʊl/"
      },
      {
        "word": "repository",
        "meaningVi": "kho",
        "exampleSentence": "Push code to the remote repository",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈpɒz.ɪ.tər.i/"
      },
      {
        "word": "branch",
        "meaningVi": "nhánh",
        "exampleSentence": "Create a new branch for the feature",
        "exampleMeaning": null,
        "note": null,
        "pron": "/brɑːntʃ/"
      },
      {
        "word": "merge",
        "meaningVi": "trộn",
        "exampleSentence": "Merge the feature branch into main",
        "exampleMeaning": null,
        "note": null,
        "pron": "/mɜːdʒ/"
      },
      {
        "word": "commit",
        "meaningVi": "cam kết",
        "exampleSentence": "Commit the changes with a clear message",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈmɪt/"
      },
      {
        "word": "push",
        "meaningVi": "đẩy",
        "exampleSentence": "Push the commits to GitHub",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pʊʃ/"
      },
      {
        "word": "pull",
        "meaningVi": "kéo",
        "exampleSentence": "Pull the latest changes from main",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pʊl/"
      },
      {
        "word": "ci",
        "meaningVi": "tích hợp liên tục",
        "exampleSentence": "CI runs tests on every push",
        "exampleMeaning": null,
        "note": null,
        "pron": "/siː aɪ/"
      },
      {
        "word": "cd",
        "meaningVi": "triển khai liên tục",
        "exampleSentence": "CD automatically deploys after tests pass",
        "exampleMeaning": null,
        "note": null,
        "pron": "/siː diː/"
      },
      {
        "word": "monitor",
        "meaningVi": "giám sát",
        "exampleSentence": "Monitor the server's CPU and memory usage",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmɒn.ɪ.tər/"
      },
      {
        "word": "scaling",
        "meaningVi": "mở rộng",
        "exampleSentence": "Scale horizontally by adding more servers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈskeɪ.lɪŋ/"
      },
      {
        "word": "load balancing",
        "meaningVi": "cân bằng tải",
        "exampleSentence": "Load balancer spreads traffic evenly",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ləʊd ˈbæl.ən.sɪŋ/"
      },
      {
        "word": "recovery",
        "meaningVi": "khôi phục",
        "exampleSentence": "Recovery plan ensures business continuity",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈkʌv.ər.i/"
      },
      {
        "word": "backup",
        "meaningVi": "sao lưu",
        "exampleSentence": "Backup the database every night",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbæk.ʌp/"
      },
      {
        "word": "security",
        "meaningVi": "bảo mật",
        "exampleSentence": "Security is a top priority in production",
        "exampleMeaning": null,
        "note": null,
        "pron": "/sɪˈkjʊə.rə.ti/"
      },
      {
        "word": "firewall",
        "meaningVi": "tường lửa",
        "exampleSentence": "Firewall blocks unauthorized access",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfaɪə.wɔːl/"
      },
      {
        "word": "ssh",
        "meaningVi": "ssh",
        "exampleSentence": "SSH into the server securely",
        "exampleMeaning": null,
        "note": null,
        "pron": "/es es eɪtʃ/"
      },
      {
        "word": "ssl",
        "meaningVi": "ssl",
        "exampleSentence": "SSL encrypts data in transit",
        "exampleMeaning": null,
        "note": null,
        "pron": "/es es el/"
      },
      {
        "word": "tls",
        "meaningVi": "tls",
        "exampleSentence": "TLS provides secure communication",
        "exampleMeaning": null,
        "note": null,
        "pron": "/tiː el es/"
      },
      {
        "word": "certificate",
        "meaningVi": "chứng chỉ",
        "exampleSentence": "Install the SSL certificate",
        "exampleMeaning": null,
        "note": null,
        "pron": "/səˈtɪf.ɪ.kət/"
      },
      {
        "word": "automation",
        "meaningVi": "tự động hóa",
        "exampleSentence": "Automation reduces manual work",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌɔː.təˈmeɪ.ʃən/"
      },
      {
        "word": "infrastructure",
        "meaningVi": "hạ tầng",
        "exampleSentence": "Infrastructure as Code manages servers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.frə.strʌk.tʃər/"
      },
      {
        "word": "orchestration",
        "meaningVi": "điều phối",
        "exampleSentence": "Kubernetes orchestrates containers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌɔː.kɪ.strəˈstreɪ.ʃən/"
      },
      {
        "word": "pod",
        "meaningVi": "pod",
        "exampleSentence": "Pod is the smallest deployable unit in Kubernetes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɒd/"
      },
      {
        "word": "node",
        "meaningVi": "nút",
        "exampleSentence": "Node is a worker machine in the cluster",
        "exampleMeaning": null,
        "note": null,
        "pron": "/nəʊd/"
      },
      {
        "word": "cluster",
        "meaningVi": "cụm",
        "exampleSentence": "The cluster has 3 nodes for high availability",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈklʌs.tər/"
      },
      {
        "word": "namespace",
        "meaningVi": "không gian tên",
        "exampleSentence": "Namespace isolates resources",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈneɪm.speɪs/"
      },
      {
        "word": "service",
        "meaningVi": "dịch vụ",
        "exampleSentence": "Service exposes pods to the network",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɜː.vɪs/"
      },
      {
        "word": "ingress",
        "meaningVi": "đi vào",
        "exampleSentence": "Ingress manages external access to services",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.ɡres/"
      },
      {
        "word": "helm",
        "meaningVi": "helm",
        "exampleSentence": "Helm is a package manager for Kubernetes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/helm/"
      },
      {
        "word": "terraform",
        "meaningVi": "terraform",
        "exampleSentence": "Terraform defines infrastructure as code",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈter.ə.fɔːm/"
      },
      {
        "word": "ansible",
        "meaningVi": "ansible",
        "exampleSentence": "Ansible automates server configuration",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈæn.sɪ.bəl/"
      },
      {
        "word": "jenkins",
        "meaningVi": "jenkins",
        "exampleSentence": "Jenkins runs the CI/CD pipeline",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdʒen.kɪnz/"
      },
      {
        "word": "github actions",
        "meaningVi": "github actions",
        "exampleSentence": "GitHub Actions automates workflows",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɡɪt.hʌb ˈæk.ʃənz/"
      },
      {
        "word": "runner",
        "meaningVi": "runner",
        "exampleSentence": "Runner executes the CI/CD jobs",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈrʌn.ər/"
      },
      {
        "word": "artifact",
        "meaningVi": "sản phẩm",
        "exampleSentence": "Build artifact is the compiled JAR file",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɑː.tɪ.fækt/"
      },
      {
        "word": "build",
        "meaningVi": "xây dựng",
        "exampleSentence": "Build the project with Maven or Gradle",
        "exampleMeaning": null,
        "note": null,
        "pron": "/bɪld/"
      },
      {
        "word": "serverless",
        "meaningVi": "không máy chủ",
        "exampleSentence": "Serverless runs code without managing servers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsɜː.və.ləs/"
      },
      {
        "word": "function",
        "meaningVi": "hàm",
        "exampleSentence": "AWS Lambda runs serverless functions",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfʌŋk.ʃən/"
      },
      {
        "word": "lambda",
        "meaningVi": "lambda",
        "exampleSentence": "Lambda is AWS's serverless compute service",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈlæm.də/"
      },
      {
        "word": "bucket",
        "meaningVi": "thùng",
        "exampleSentence": "S3 bucket stores static files",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbʌk.ɪt/"
      },
      {
        "word": "queue",
        "meaningVi": "hàng đợi",
        "exampleSentence": "Message queue decouples services",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kjuː/"
      },
      {
        "word": "message",
        "meaningVi": "tin nhắn",
        "exampleSentence": "Send a message to the queue",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmes.ɪdʒ/"
      },
      {
        "word": "subscribe",
        "meaningVi": "đăng ký",
        "exampleSentence": "Subscribe to the topic for updates",
        "exampleMeaning": null,
        "note": null,
        "pron": "/səbˈskraɪb/"
      },
      {
        "word": "notification",
        "meaningVi": "thông báo",
        "exampleSentence": "Push notification alerts the user",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌnəʊ.tɪ.fɪˈkeɪ.ʃən/"
      },
      {
        "word": "alert",
        "meaningVi": "cảnh báo",
        "exampleSentence": "Alert triggers when CPU exceeds 90%",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈlɜːt/"
      },
      {
        "word": "metric",
        "meaningVi": "chỉ số",
        "exampleSentence": "Monitor key metrics like response time",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmet.rɪk/"
      },
      {
        "word": "log",
        "meaningVi": "nhật ký",
        "exampleSentence": "Check the logs for errors",
        "exampleMeaning": null,
        "note": null,
        "pron": "/lɒɡ/"
      },
      {
        "word": "logging",
        "meaningVi": "ghi nhật ký",
        "exampleSentence": "Centralized logging with ELK stack",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈlɒɡ.ɪŋ/"
      },
      {
        "word": "tracing",
        "meaningVi": "truy vết",
        "exampleSentence": "Distributed tracing tracks requests across services",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtreɪ.sɪŋ/"
      },
      {
        "word": "debugging",
        "meaningVi": "gỡ lỗi",
        "exampleSentence": "Debugging production issues with logs",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diːˈbʌɡ.ɪŋ/"
      },
      {
        "word": "uptime",
        "meaningVi": "thời gian hoạt động",
        "exampleSentence": "Target 99.9% uptime for production",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈʌp.taɪm/"
      },
      {
        "word": "downtime",
        "meaningVi": "thời gian ngừng",
        "exampleSentence": "Schedule downtime for maintenance",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈdaʊn.taɪm/"
      },
      {
        "word": "incident",
        "meaningVi": "sự cố",
        "exampleSentence": "Log an incident when something breaks",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.sɪ.dənt/"
      },
      {
        "word": "postmortem",
        "meaningVi": "phân tích sự cố",
        "exampleSentence": "Postmortem reviews what went wrong",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌpəʊstˈmɔː.təm/"
      },
      {
        "word": "runbook",
        "meaningVi": "sổ tay vận hành",
        "exampleSentence": "Follow the runbook for incident response",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈrʌn.bʊk/"
      },
      {
        "word": "canary",
        "meaningVi": "canary",
        "exampleSentence": "Canary deployment tests on small percentage",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈneə.ri/"
      },
      {
        "word": "blue-green",
        "meaningVi": "xanh dương-xanh lá",
        "exampleSentence": "Blue-green switches traffic between environments",
        "exampleMeaning": null,
        "note": null,
        "pron": "/bluː ɡriːn/"
      },
      {
        "word": "rolling update",
        "meaningVi": "cập nhật cuộn",
        "exampleSentence": "Rolling update replaces pods gradually",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈrəʊ.lɪŋ ʌpˈdeɪt/"
      },
      {
        "word": "rollback",
        "meaningVi": "quay lại",
        "exampleSentence": "Rollback if the deployment fails",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈrəʊl.bæk/"
      },
      {
        "word": "health check",
        "meaningVi": "kiểm tra sức khỏe",
        "exampleSentence": "Health check verifies if the service is up",
        "exampleMeaning": null,
        "note": null,
        "pron": "/helθ tʃek/"
      },
      {
        "word": "readiness",
        "meaningVi": "sẵn sàng",
        "exampleSentence": "Readiness probe checks if pod is ready",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌred.ɪˈnes/"
      },
      {
        "word": "liveness",
        "meaningVi": "sống",
        "exampleSentence": "Liveness probe restarts crashed containers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈlaɪv.nəs/"
      },
      {
        "word": "resource limit",
        "meaningVi": "giới hạn tài nguyên",
        "exampleSentence": "Set CPU and memory resource limits",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈriː.sɔːs ˈlɪm.ɪt/"
      },
      {
        "word": "quota",
        "meaningVi": "hạn ngạch",
        "exampleSentence": "Quota limits resource usage per team",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkwəʊ.tə/"
      },
      {
        "word": "networking",
        "meaningVi": "mạng",
        "exampleSentence": "Networking connects containers and services",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈnet.wɜː.kɪŋ/"
      },
      {
        "word": "dns",
        "meaningVi": "dns",
        "exampleSentence": "DNS resolves service names to IPs",
        "exampleMeaning": null,
        "note": null,
        "pron": "/diː en es/"
      },
      {
        "word": "ip",
        "meaningVi": "địa chỉ ip",
        "exampleSentence": "The pod has its own IP address",
        "exampleMeaning": null,
        "note": null,
        "pron": "/aɪ piː/"
      },
      {
        "word": "hostname",
        "meaningVi": "tên máy",
        "exampleSentence": "The hostname is api-backend-5f8b9c",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈhəʊst.neɪm/"
      },
      {
        "word": "port",
        "meaningVi": "cổng",
        "exampleSentence": "Expose port 8080 for the API",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɔːt/"
      },
      {
        "word": "configmap",
        "meaningVi": "bản đồ cấu hình",
        "exampleSentence": "ConfigMap stores non-sensitive config",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈfɪɡ.mæp/"
      },
      {
        "word": "secret",
        "meaningVi": "bí mật",
        "exampleSentence": "Secret stores passwords and API keys",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsiː.krɪt/"
      },
      {
        "word": "environment variable",
        "meaningVi": "biến môi trường",
        "exampleSentence": "Set environment variables in the container",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪnˈvaɪ.rən.mənt ˈveə.ri.ə.bəl/"
      },
      {
        "word": "secrets management",
        "meaningVi": "quản lý bí mật",
        "exampleSentence": "Use Vault for secrets management",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsiː.krɪts ˈmæn.ɪdʒ.mənt/"
      },
      {
        "word": "vulnerability",
        "meaningVi": "lỗ hổng",
        "exampleSentence": "Scan for vulnerabilities in dependencies",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌvʌl.nər.əˈbɪl.ə.ti/"
      },
      {
        "word": "scanning",
        "meaningVi": "quét",
        "exampleSentence": "Security scanning checks for CVEs",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈskæn.ɪŋ/"
      },
      {
        "word": "patching",
        "meaningVi": "vá lỗi",
        "exampleSentence": "Patch critical vulnerabilities immediately",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpætʃ.ɪŋ/"
      },
      {
        "word": "hardening",
        "meaningVi": "tăng cường",
        "exampleSentence": "Hardening reduces the attack surface",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈhɑː.də.nɪŋ/"
      },
      {
        "word": "principle of least privilege",
        "meaningVi": "nguyên tắc đặc quyền tối thiểu",
        "exampleSentence": "Grant only the permissions needed",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈprɪn.sə.pəl əv liːst ˈprɪv.ɪ.lɪdʒ/"
      },
      {
        "word": "iam",
        "meaningVi": "quản lý danh tính",
        "exampleSentence": "IAM controls who can access resources",
        "exampleMeaning": null,
        "note": null,
        "pron": "/aɪ em/"
      },
      {
        "word": "role",
        "meaningVi": "vai trò",
        "exampleSentence": "Assign roles for access control",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rəʊl/"
      },
      {
        "word": "policy",
        "meaningVi": "chính sách",
        "exampleSentence": "Policy defines what actions are allowed",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpɒl.ə.si/"
      },
      {
        "word": "audit",
        "meaningVi": "kiểm toán",
        "exampleSentence": "Audit logs track all access and changes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɔː.dɪt/"
      }
    ]
  },
  {
    "name": "Nghề nghiệp & Phỏng vấn",
    "icon": "💼",
    "words": [
      {
        "word": "experience",
        "meaningVi": "kinh nghiệm",
        "exampleSentence": "I have 2 years of experience in Java",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪkˈspɪə.ri.əns/"
      },
      {
        "word": "responsibility",
        "meaningVi": "trách nhiệm",
        "exampleSentence": "My responsibilities include API development",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˌspɒn.səˈbɪl.ə.ti/"
      },
      {
        "word": "achievement",
        "meaningVi": "thành tích",
        "exampleSentence": "One achievement was reducing load time by 40%",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈtʃiː.vmənt/"
      },
      {
        "word": "challenge",
        "meaningVi": "thử thách",
        "exampleSentence": "The biggest challenge was debugging the memory leak",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈtʃæl.ɪndʒ/"
      },
      {
        "word": "deadline",
        "meaningVi": "thời hạn",
        "exampleSentence": "We need to meet the Friday deadline",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈded.laɪn/"
      },
      {
        "word": "sprint",
        "meaningVi": "sprint",
        "exampleSentence": "We deliver features in 2-week sprints",
        "exampleMeaning": null,
        "note": null,
        "pron": "/sprɪnt/"
      },
      {
        "word": "standup",
        "meaningVi": "họp standup",
        "exampleSentence": "Daily standup is at 9 AM",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈstænd.ʌp/"
      },
      {
        "word": "code review",
        "meaningVi": "xem xét code",
        "exampleSentence": "Code review improves code quality",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəʊd rɪˈvjuː/"
      },
      {
        "word": "refactor",
        "meaningVi": "tái cấu trúc",
        "exampleSentence": "Refactor the legacy code to improve maintainability",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈfæk.tər/"
      },
      {
        "word": "maintain",
        "meaningVi": "bảo trì",
        "exampleSentence": "I maintain the payment service",
        "exampleMeaning": null,
        "note": null,
        "pron": "/meɪnˈteɪn/"
      },
      {
        "word": "optimize",
        "meaningVi": "tối ưu",
        "exampleSentence": "Optimize the database query for speed",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɒp.tɪ.maɪz/"
      },
      {
        "word": "requirement",
        "meaningVi": "yêu cầu",
        "exampleSentence": "Collect requirements from stakeholders",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈkwaɪə.mənt/"
      },
      {
        "word": "deliver",
        "meaningVi": "bàn giao",
        "exampleSentence": "Deliver the feature on time",
        "exampleMeaning": null,
        "note": null,
        "pron": "/dɪˈlɪv.ər/"
      },
      {
        "word": "estimate",
        "meaningVi": "ước lượng",
        "exampleSentence": "Estimate the effort for each task",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈes.tɪ.mət/"
      },
      {
        "word": "collaborate",
        "meaningVi": "cộng tác",
        "exampleSentence": "Collaborate with the frontend team",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈlæb.ə.reɪt/"
      },
      {
        "word": "integrate",
        "meaningVi": "tích hợp",
        "exampleSentence": "Integrate the payment gateway",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.tɪ.ɡreɪt/"
      },
      {
        "word": "architecture",
        "meaningVi": "kiến trúc",
        "exampleSentence": "The architecture follows microservices pattern",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɑː.kɪ.tek.tʃər/"
      },
      {
        "word": "scalable",
        "meaningVi": "có thể mở rộng",
        "exampleSentence": "Design a scalable system from the start",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈskeɪ.lə.bəl/"
      },
      {
        "word": "robust",
        "meaningVi": "mạnh mẽ",
        "exampleSentence": "Build robust error handling",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rəʊˈbʌst/"
      },
      {
        "word": "efficient",
        "meaningVi": "hiệu quả",
        "exampleSentence": "Write efficient algorithms",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪˈfɪʃ.ənt/"
      },
      {
        "word": "stakeholder",
        "meaningVi": "bên liên quan",
        "exampleSentence": "Stakeholders approved the feature",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈsteɪk.həʊl.dər/"
      },
      {
        "word": "milestone",
        "meaningVi": "cột mốc",
        "exampleSentence": "Milestone 1 is the MVP delivery",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmaɪ.ləʊ.staɪn/"
      },
      {
        "word": "retrospective",
        "meaningVi": "họp retrospective",
        "exampleSentence": "Sprint retrospective improves our process",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌretr.əˈspek.tɪv/"
      },
      {
        "word": "velocity",
        "meaningVi": "tốc độ",
        "exampleSentence": "Our velocity is 40 story points per sprint",
        "exampleMeaning": null,
        "note": null,
        "pron": "/vəˈlɒs.ə.ti/"
      },
      {
        "word": "backlog",
        "meaningVi": "danh sách công việc",
        "exampleSentence": "The product backlog has 50 items",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbæk.lɒɡ/"
      },
      {
        "word": "user story",
        "meaningVi": "câu chuyện người dùng",
        "exampleSentence": "As a user, I want to reset my password",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈjuː.zər ˈstɔː.ri/"
      },
      {
        "word": "acceptance criteria",
        "meaningVi": "tiêu chí chấp nhận",
        "exampleSentence": "Define clear acceptance criteria upfront",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əkˈsep.təns kraɪˈtɪə.ri.ə/"
      },
      {
        "word": "qa",
        "meaningVi": "kiểm thử chất lượng",
        "exampleSentence": "QA found 3 bugs in the new feature",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kjuː eɪ/"
      },
      {
        "word": "release",
        "meaningVi": "phát hành",
        "exampleSentence": "Release version 2.0 next week",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈliːs/"
      },
      {
        "word": "version",
        "meaningVi": "phiên bản",
        "exampleSentence": "Update to version 3.0 of the library",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈvɜː.ʃən/"
      },
      {
        "word": "support",
        "meaningVi": "hỗ trợ",
        "exampleSentence": "Provide post-launch support",
        "exampleMeaning": null,
        "note": null,
        "pron": "/səˈpɔːt/"
      },
      {
        "word": "handover",
        "meaningVi": "bàn giao",
        "exampleSentence": "Handover the project to the operations team",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈhænd.əʊ.vər/"
      },
      {
        "word": "onboard",
        "meaningVi": "đào tạo",
        "exampleSentence": "Onboard new developers within a week",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɒn.bɔːd/"
      },
      {
        "word": "mentor",
        "meaningVi": "người hướng dẫn",
        "exampleSentence": "Find a mentor to accelerate your growth",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmen.tɔːr/"
      },
      {
        "word": "lead",
        "meaningVi": "dẫn dắt",
        "exampleSentence": "Lead the backend team of 3 engineers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/liːd/"
      },
      {
        "word": "manage",
        "meaningVi": "quản lý",
        "exampleSentence": "Manage the project timeline and budget",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈmæn.ɪdʒ/"
      },
      {
        "word": "skill",
        "meaningVi": "kỹ năng",
        "exampleSentence": "Skills needed: Java, Spring Boot, PostgreSQL",
        "exampleMeaning": null,
        "note": null,
        "pron": "/skɪl/"
      },
      {
        "word": "proficiency",
        "meaningVi": "thành thạo",
        "exampleSentence": "Proficiency in SQL is required",
        "exampleMeaning": null,
        "note": null,
        "pron": "/prəˈfɪʃ.ən.si/"
      },
      {
        "word": "passion",
        "meaningVi": "đam mê",
        "exampleSentence": "Show passion for technology and learning",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈpæʃ.ən/"
      },
      {
        "word": "initiative",
        "meaningVi": "sáng kiến",
        "exampleSentence": "Take initiative to improve the codebase",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɪˈnɪʃ.ə.tɪv/"
      },
      {
        "word": "growth",
        "meaningVi": "tăng trưởng",
        "exampleSentence": "I want to grow as a senior engineer",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɡrəʊθ/"
      },
      {
        "word": "career",
        "meaningVi": "sự nghiệp",
        "exampleSentence": "Plan your career path carefully",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˈrɪər/"
      },
      {
        "word": "promotion",
        "meaningVi": "thăng tiến",
        "exampleSentence": "Promotion to senior requires leadership skills",
        "exampleMeaning": null,
        "note": null,
        "pron": "/prəˈməʊ.ʃən/"
      },
      {
        "word": "remote",
        "meaningVi": "từ xa",
        "exampleSentence": "Remote work is supported at our company",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˈməʊt/"
      },
      {
        "word": "hybrid",
        "meaningVi": "kết hợp",
        "exampleSentence": "Hybrid model: 3 days in office, 2 from home",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈhaɪ.brɪd/"
      },
      {
        "word": "freelance",
        "meaningVi": "tự do",
        "exampleSentence": "Freelance developers set their own rates",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfriː.lɑːns/"
      },
      {
        "word": "contract",
        "meaningVi": "hợp đồng",
        "exampleSentence": "Contract work pays higher but is less stable",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɒn.trækt/"
      },
      {
        "word": "benefits",
        "meaningVi": "phúc lợi",
        "exampleSentence": "Benefits include health insurance and 401k",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈben.ɪf.ɪts/"
      },
      {
        "word": "compensation",
        "meaningVi": "đãi ngộ",
        "exampleSentence": "Total compensation includes salary and bonus",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌkɒm.penˈseɪ.ʃən/"
      },
      {
        "word": "negotiation",
        "meaningVi": "đàm phán",
        "exampleSentence": "Negotiation is part of the hiring process",
        "exampleMeaning": null,
        "note": null,
        "pron": "/nɪˌɡəʊ.siˈeɪ.ʃən/"
      },
      {
        "word": "portfolio",
        "meaningVi": "danh mục",
        "exampleSentence": "A portfolio showcases your best projects",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɔːtˈfəʊ.li.əʊ/"
      },
      {
        "word": "resume",
        "meaningVi": "sơ yếu lý lịch",
        "exampleSentence": "Send your resume and cover letter",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈrez.juː.meɪ/"
      },
      {
        "word": "cover letter",
        "meaningVi": "thư giới thiệu",
        "exampleSentence": "Cover letter explains your interest in the role",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkʌv.ər ˈlet.ər/"
      },
      {
        "word": "interview",
        "meaningVi": "phỏng vấn",
        "exampleSentence": "The technical interview lasts 45 minutes",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɪn.tə.vjuː/"
      },
      {
        "word": "assessment",
        "meaningVi": "đánh giá",
        "exampleSentence": "Take-home assessment tests your coding skills",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈses.mənt/"
      },
      {
        "word": "whiteboard",
        "meaningVi": "bảng trắng",
        "exampleSentence": "Whiteboard coding tests problem-solving",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈwaɪt.bɔː.dəd/"
      },
      {
        "word": "take-home",
        "meaningVi": "về nhà làm",
        "exampleSentence": "Take-home project takes about 4 hours",
        "exampleMeaning": null,
        "note": null,
        "pron": "/teɪk həʊm/"
      },
      {
        "word": "offer",
        "meaningVi": "đề nghị",
        "exampleSentence": "The job offer includes salary and start date",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɒf.ər/"
      },
      {
        "word": "onboarding",
        "meaningVi": "đào tạo",
        "exampleSentence": "Onboarding lasts for the first month",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈɒn.bɔː.dɪŋ/"
      },
      {
        "word": "probation",
        "meaningVi": "thử việc",
        "exampleSentence": "Probation period is 3 months",
        "exampleMeaning": null,
        "note": null,
        "pron": "/prəˈbeɪ.ʃən/"
      },
      {
        "word": "notice period",
        "meaningVi": "thời gian báo trước",
        "exampleSentence": "Notice period is 1 month",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈnəʊ.tɪs ˈpɪə.ri.əd/"
      },
      {
        "word": "culture",
        "meaningVi": "văn hóa",
        "exampleSentence": "Company culture values continuous learning",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkʌl.tʃər/"
      },
      {
        "word": "team",
        "meaningVi": "nhóm",
        "exampleSentence": "The team consists of 8 engineers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/tiːm/"
      },
      {
        "word": "peer",
        "meaningVi": "đồng nghiệp",
        "exampleSentence": "Peer review catches bugs early",
        "exampleMeaning": null,
        "note": null,
        "pron": "/pɪər/"
      },
      {
        "word": "feedback",
        "meaningVi": "phản hồi",
        "exampleSentence": "Give constructive feedback to teammates",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈfiːd.bæk/"
      },
      {
        "word": "conflict",
        "meaningVi": "xung đột",
        "exampleSentence": "Resolve conflicts professionally",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈkɒn.flɪkt/"
      },
      {
        "word": "communication",
        "meaningVi": "giao tiếp",
        "exampleSentence": "Communication is key in remote work",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kəˌmjuː.nɪˈkeɪ.ʃən/"
      },
      {
        "word": "problem-solving",
        "meaningVi": "giải quyết vấn đề",
        "exampleSentence": "Problem-solving is the core skill for developers",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈprɒb.ləm ˈsɒlv.ɪŋ/"
      },
      {
        "word": "attention to detail",
        "meaningVi": "chú ý chi tiết",
        "exampleSentence": "Attention to detail prevents bugs",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˈten.ʃən tə ˈdiː.teɪl/"
      },
      {
        "word": "ownership",
        "meaningVi": "sở hữu",
        "exampleSentence": "Take ownership of your tasks",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈəʊ.nə.ʃɪp/"
      },
      {
        "word": "accountability",
        "meaningVi": "trách nhiệm giải trình",
        "exampleSentence": "Accountability means owning your results",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˌkaʊn.təˈbɪl.ə.ti/"
      },
      {
        "word": "reliability",
        "meaningVi": "đáng tin cậy",
        "exampleSentence": "Be reliable: do what you say you will do",
        "exampleMeaning": null,
        "note": null,
        "pron": "/rɪˌlaɪəˈbɪl.ə.ti/"
      },
      {
        "word": "adaptability",
        "meaningVi": "khả năng thích nghi",
        "exampleSentence": "Adaptability is crucial in fast-changing tech",
        "exampleMeaning": null,
        "note": null,
        "pron": "/əˌdæp.təˈbɪl.ə.ti/"
      },
      {
        "word": "curiosity",
        "meaningVi": "tò mò",
        "exampleSentence": "Curiosity drives you to learn new things",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˌkjʊə.riˈɒs.ə.ti/"
      },
      {
        "word": "self-learning",
        "meaningVi": "tự học",
        "exampleSentence": "Self-learning ability is essential",
        "exampleMeaning": null,
        "note": null,
        "pron": "/self ˈlɜː.nɪŋ/"
      },
      {
        "word": "work-life balance",
        "meaningVi": "cân bằng công việc",
        "exampleSentence": "Maintain a healthy work-life balance",
        "exampleMeaning": null,
        "note": null,
        "pron": "/wɜːk laɪf ˈbæl.əns/"
      },
      {
        "word": "burnout",
        "meaningVi": "kiệt sức",
        "exampleSentence": "Watch out for signs of burnout",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈbɜːn.aʊt/"
      },
      {
        "word": "continuous learning",
        "meaningVi": "học liên tục",
        "exampleSentence": "Continuous learning keeps you competitive",
        "exampleMeaning": null,
        "note": null,
        "pron": "/kənˈtɪn.ju.əs ˈlɜː.nɪŋ/"
      },
      {
        "word": "upward mobility",
        "meaningVi": "thăng tiến",
        "exampleSentence": "Show upward mobility through achievements",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ˈʌp.wəd məˈbɪl.ə.ti/"
      }
    ]
  },
  {
    "name": "Ăn uống & đặt đồ",
    "icon": "🍔",
    "words": [
      {
        "word": "to order",
        "meaningVi": "gọi món, đặt",
        "exampleSentence": "\"Can I order a coffee, please?\"",
        "exampleMeaning": "\"I'd like to order the lunch set.\"",
        "note": "Collocations: order online, order in advance, place an order | Common mistake: ❌ \"I want order\" → ✅ \"I want to order\"",
        "pron": "/ˈɔː.dər/"
      },
      {
        "word": "to grab",
        "meaningVi": "lấy nhanh, mua nhanh",
        "exampleSentence": "\"Let me grab a coffee.\"",
        "exampleMeaning": "\"I'll grab some lunch before the meeting.\"",
        "note": "Collocations: grab a bite, grab lunch, grab coffee | Common mistake: ❌ \"I will grab a coffee for me\" → ✅ \"I'll grab a coffee\"",
        "pron": "/ɡræb/"
      },
      {
        "word": "to pick up",
        "meaningVi": "đón/lấy (đồ ăn/người)",
        "exampleSentence": "\"I'll pick up the food on my way.\"",
        "exampleMeaning": "\"Could you pick up the package from reception?\"",
        "note": "Collocations: pick up food, pick up groceries, pick up the tab | Common mistake: ❌ \"pick up the food\" thường dùng cho takeout",
        "pron": "/pɪk ʌp/"
      },
      {
        "word": "takeout / takeaway",
        "meaningVi": "đồ ăn mang đi",
        "exampleSentence": "\"Is this for here or takeout?\"",
        "exampleMeaning": "\"We offer takeout and dine-in options.\"",
        "note": "Collocations: takeout order, takeout box | Common mistake: BrE dùng \"takeaway\"",
        "pron": "/ˈteɪk.aʊt/"
      },
      {
        "word": "to go",
        "meaningVi": "mang đi (gọi tắt của to-go)",
        "exampleSentence": "\"Two coffees, to go.\"",
        "exampleMeaning": "\"I'll have the latte to go, please.\"",
        "note": "Collocations: \"for here or to go?\" | Common mistake: Câu chuẩn ở Starbucks",
        "pron": "/tə ɡəʊ/"
      },
      {
        "word": "for here",
        "meaningVi": "dùng tại chỗ",
        "exampleSentence": "\"Is that for here or to go?\"",
        "exampleMeaning": "\"We'll dine in, thank you.\"",
        "note": "Collocations: \"for here or to go\" | Common mistake: Câu hỏi quen thuộc ở Mỹ",
        "pron": "/fər hɪər/"
      },
      {
        "word": "dine in",
        "meaningVi": "ăn tại quán",
        "exampleSentence": "\"I'd like to dine in.\"",
        "exampleMeaning": "\"We're dining in tonight.\"",
        "note": "Collocations: dine-in service, dine-in experience",
        "pron": "/daɪn ɪn/"
      },
      {
        "word": "a combo",
        "meaningVi": "combo (combo meal)",
        "exampleSentence": "\"Can I get a combo meal?\"",
        "exampleMeaning": "\"The combo includes a main, side, and drink.\"",
        "note": "Collocations: combo meal, combo deal",
        "pron": "/ˈkɒm.bəʊ/"
      },
      {
        "word": "a side",
        "meaningVi": "món phụ",
        "exampleSentence": "\"I'll have fries as a side.\"",
        "exampleMeaning": "\"Would you like a side with that?\"",
        "note": "Collocations: side dish, side order, on the side",
        "pron": "/saɪd/"
      },
      {
        "word": "a main",
        "meaningVi": "món chính",
        "exampleSentence": "\"What's your main course?\"",
        "exampleMeaning": "\"The main is served with seasonal vegetables.\"",
        "note": "Collocations: main course, main dish",
        "pron": "/meɪn/"
      },
      {
        "word": "appetizer",
        "meaningVi": "món khai vị",
        "exampleSentence": "\"Let's share an appetizer.\"",
        "exampleMeaning": "\"We have a special appetizer today.\"",
        "note": "Collocations: appetizer plate, share an appetizer",
        "pron": "/ˈæp.ɪ.taɪ.zər/"
      },
      {
        "word": "dessert",
        "meaningVi": "món tráng miệng",
        "exampleSentence": "\"I'm too full for dessert.\"",
        "exampleMeaning": "\"Dessert is included in the menu.\"",
        "note": "Collocations: dessert menu, after-dinner dessert | Common mistake: ⚠️ Phát âm: /dɪˈzɜːt/, KHÔNG phải \"des-sert\"",
        "pron": "/dɪˈzɜːt/"
      },
      {
        "word": "the bill / the check",
        "meaningVi": "hóa đơn",
        "exampleSentence": "\"Can I get the check, please?\" (Mỹ)",
        "exampleMeaning": "\"May I have the bill, please?\" (Anh)",
        "note": "Collocations: split the bill, foot the bill | Common mistake: Mỹ: \"check\"; Anh: \"bill\"",
        "pron": "/bɪl/ /tʃek/"
      },
      {
        "word": "to split",
        "meaningVi": "chia đều",
        "exampleSentence": "\"Let's split the bill.\"",
        "exampleMeaning": "\"Would you like to split the payment?\"",
        "note": "Collocations: split the bill, split evenly",
        "pron": "/splɪt/"
      },
      {
        "word": "a tip / to tip",
        "meaningVi": "tiền boa",
        "exampleSentence": "\"Do I tip here?\"",
        "exampleMeaning": "\"A 15-20% tip is customary.\"",
        "note": "Collocations: tip the waiter, leave a tip | Common mistake: Mỹ: tip bắt buộc ~18-20%",
        "pron": "/tɪp/"
      },
      {
        "word": "a refill",
        "meaningVi": "thêm (nước, cà phê)",
        "exampleSentence": "\"Can I get a refill?\"",
        "exampleMeaning": "\"Refills are complimentary.\"",
        "note": "Collocations: free refill, get a refill | Common mistake: Starbucks có free refill",
        "pron": "/ˈriː.fɪl/"
      },
      {
        "word": "to-go cup",
        "meaningVi": "ly mang đi",
        "exampleSentence": "\"I'll need a to-go cup.\"",
        "exampleMeaning": "\"Would you prefer a to-go cup?\"",
        "note": "Collocations: paper to-go cup",
        "pron": "/tə ɡəʊ kʌp/"
      },
      {
        "word": "a receipt",
        "meaningVi": "hóa đơn (đã thanh toán)",
        "exampleSentence": "\"Can I have a receipt?\"",
        "exampleMeaning": "\"Please retain your receipt for returns.\"",
        "note": "Collocations: keep the receipt, email me a receipt | Common mistake: ⚠️ Phát âm: /rɪˈsiːt/",
        "pron": "/rɪˈsiːt/"
      },
      {
        "word": "a reservation",
        "meaningVi": "đặt bàn trước",
        "exampleSentence": "\"I have a reservation under Hoang.\"",
        "exampleMeaning": "\"I'd like to make a reservation for 7 PM.\"",
        "note": "Collocations: make a reservation, cancel a reservation",
        "pron": "/ˌrez.əˈveɪ.ʃən/"
      },
      {
        "word": "to book a table",
        "meaningVi": "đặt bàn",
        "exampleSentence": "\"Can I book a table for two?\"",
        "exampleMeaning": "\"I'd like to book a table for tomorrow.\"",
        "note": "Collocations: book a table, book in advance",
        "pron": "/bʊk ə ˈteɪ.bəl/"
      },
      {
        "word": "a waiter",
        "meaningVi": "người phục vụ (nam)",
        "exampleSentence": "\"Excuse me, waiter?\"",
        "exampleMeaning": "\"The waiter will be right with you.\"",
        "note": "Collocations: flag down the waiter",
        "pron": "/ˈweɪ.tər/"
      },
      {
        "word": "a waitress",
        "meaningVi": "người phục vụ (nữ)",
        "exampleSentence": "\"Waitress, can we have more water?\"",
        "exampleMeaning": "\"Our waitress was very attentive.\"",
        "note": "Common mistake: Hôm nay nhiều nơi dùng \"server\" cho gender-neutral",
        "pron": "/ˈweɪ.trəs/"
      },
      {
        "word": "a server",
        "meaningVi": "người phục vụ",
        "exampleSentence": "\"Our server was great!\"",
        "exampleMeaning": "\"Please ask the server for the menu.\"",
        "note": "Common mistake: Gender-neutral, an toàn nhất",
        "pron": "/ˈsɜː.vər/"
      },
      {
        "word": "the menu",
        "meaningVi": "thực đơn",
        "exampleSentence": "\"Can I see the menu?\"",
        "exampleMeaning": "\"May I see the menu, please?\"",
        "note": "Collocations: menu item, menu price, view the menu",
        "pron": "/ˈmen.juː/"
      },
      {
        "word": "to recommend",
        "meaningVi": "gợi ý, đề xuất",
        "exampleSentence": "\"What do you recommend?\"",
        "exampleMeaning": "\"Could you recommend something spicy?\"",
        "note": "Collocations: highly recommend, recommend a dish",
        "pron": "/ˌrek.əˈmend/"
      },
      {
        "word": "a bestseller",
        "meaningVi": "món bán chạy nhất",
        "exampleSentence": "\"What's your bestseller?\"",
        "exampleMeaning": "\"The bestseller today is the grilled salmon.\"",
        "note": "Collocations: bestseller dish",
        "pron": "/ˌbestˈsel.ər/"
      },
      {
        "word": "to be allergic",
        "meaningVi": "bị dị ứng",
        "exampleSentence": "\"I'm allergic to peanuts.\"",
        "exampleMeaning": "\"I have a nut allergy.\"",
        "note": "Collocations: food allergy, allergic reaction",
        "pron": "/əˈlɜː.dʒɪk/"
      },
      {
        "word": "gluten-free",
        "meaningVi": "không chứa gluten",
        "exampleSentence": "\"Do you have gluten-free options?\"",
        "exampleMeaning": "\"We offer gluten-free alternatives.\"",
        "note": "Collocations: gluten-free menu, gluten-free bread",
        "pron": "/ˈɡluː.tən friː/"
      },
      {
        "word": "vegan",
        "meaningVi": "thuần chay",
        "exampleSentence": "\"Is this dish vegan?\"",
        "exampleMeaning": "\"We have several vegan options.\"",
        "note": "Collocations: vegan option, vegan-friendly",
        "pron": "/ˈviː.ɡən/"
      },
      {
        "word": "vegetarian",
        "meaningVi": "ăn chay (có thể ăn trứng/sữa)",
        "exampleSentence": "\"I'm vegetarian.\"",
        "exampleMeaning": "\"We have vegetarian options marked with V.\"",
        "note": "Collocations: vegetarian dish",
        "pron": "/ˌvedʒ.ɪˈteə.ri.ən/"
      },
      {
        "word": "spicy",
        "meaningVi": "cay",
        "exampleSentence": "\"Not too spicy, please.\"",
        "exampleMeaning": "\"I'd prefer mild to medium spice.\"",
        "note": "Collocations: mildly spicy, extra spicy",
        "pron": "/ˈspaɪ.si/"
      },
      {
        "word": "mild",
        "meaningVi": "nhẹ, ít cay",
        "exampleSentence": "\"Can I have it mild?\"",
        "exampleMeaning": "\"Please make it mild, thank you.\"",
        "note": "Collocations: mild flavor, mild spice",
        "pron": "/maɪld/"
      },
      {
        "word": "well-done",
        "meaningVi": "chín kỹ (steak)",
        "exampleSentence": "\"I'd like my steak well-done.\"",
        "exampleMeaning": "\"How would you like your steak cooked?\"",
        "note": "Collocations: medium well, well done",
        "pron": "/ˌwel ˈdʌn/"
      },
      {
        "word": "medium-rare",
        "meaningVi": "chín tái vừa (steak)",
        "exampleSentence": "\"Medium-rare, please.\"",
        "exampleMeaning": "\"I prefer my steak medium-rare.\"",
        "note": "Collocations: medium rare",
        "pron": "/ˌmiː.di.əm ˈreər/"
      },
      {
        "word": "to box up",
        "meaningVi": "đóng hộp mang đi",
        "exampleSentence": "\"Can you box up the rest?\"",
        "exampleMeaning": "\"Could you box up the leftovers?\"",
        "note": "Collocations: box up leftovers, box it up",
        "pron": "/bɒks ʌp/"
      },
      {
        "word": "leftovers",
        "meaningVi": "đồ ăn thừa",
        "exampleSentence": "\"I'll take the leftovers home.\"",
        "exampleMeaning": "\"We don't offer leftovers for hygiene reasons.\"",
        "note": "Collocations: take leftovers, leftover food",
        "pron": "/ˈlef.təʊ.vərz/"
      },
      {
        "word": "a doggy bag",
        "meaningVi": "hộp đựng đồ ăn thừa",
        "exampleSentence": "\"Can I get a doggy bag?\"",
        "exampleMeaning": "\"We'll package the leftovers in a doggy bag.\"",
        "note": "Collocations: ask for a doggy bag | Common mistake: Casual, Mỹ",
        "pron": "/ˈdɒɡ.i bæɡ/"
      },
      {
        "word": "a tab",
        "meaningVi": "hóa đơn (quán bar)",
        "exampleSentence": "\"Put it on my tab.\"",
        "exampleMeaning": "\"Please add this to my tab.\"",
        "note": "Collocations: open a tab, close a tab, pick up the tab",
        "pron": "/tæb/"
      },
      {
        "word": "on me",
        "meaningVi": "tôi trả",
        "exampleSentence": "\"This one's on me.\"",
        "exampleMeaning": "\"Allow me — it's on me today.\"",
        "note": "Collocations: it's on me, on the house",
        "pron": "/ɒn miː/"
      },
      {
        "word": "on the house",
        "meaningVi": "quán tặng miễn phí",
        "exampleSentence": "\"This dessert is on the house.\"",
        "exampleMeaning": "\"As an apology, dessert is on the house.\"",
        "note": null,
        "pron": "/ɒn ðə haʊs/"
      },
      {
        "word": "cheers",
        "meaningVi": "cảm ơn (informal Anh)",
        "exampleSentence": "\"Cheers, mate!\"",
        "exampleMeaning": "\"Cheers for the help.\"",
        "note": "Common mistake: Informal; BrE",
        "pron": "/tʃɪərz/"
      },
      {
        "word": "a barista",
        "meaningVi": "người pha chế cà phê",
        "exampleSentence": "\"The barista made my latte art.\"",
        "exampleMeaning": "\"Ask the barista for recommendations.\"",
        "note": "Collocations: trained barista",
        "pron": "/bəˈrɪs.tə/"
      },
      {
        "word": "a latte",
        "meaningVi": "cà phê latte",
        "exampleSentence": "\"Can I get a latte?\"",
        "exampleMeaning": "\"I'll have a vanilla latte, please.\"",
        "note": "Collocations: vanilla latte, iced latte",
        "pron": "/ˈlæ.teɪ/"
      },
      {
        "word": "a cappuccino",
        "meaningVi": "cappuccino",
        "exampleSentence": "\"One cappuccino, please.\"",
        "exampleMeaning": "\"We serve traditional Italian cappuccinos.\"",
        "note": "Common mistake: ⚠️ /ˌkæp.ʊˈtʃiː.nəʊ/, không phải \"capu-chino\"",
        "pron": "/ˌkæp.ʊˈtʃiː.nəʊ/"
      },
      {
        "word": "an Americano",
        "meaningVi": "cà phê Americano",
        "exampleSentence": "\"I'll have an Americano.\"",
        "exampleMeaning": "\"One Americano with an extra shot.\"",
        "note": null,
        "pron": "/əˈmer.ɪ.kɑː.noʊ/"
      },
      {
        "word": "a shot of espresso",
        "meaningVi": "một ly espresso",
        "exampleSentence": "\"Can I get an extra shot?\"",
        "exampleMeaning": "\"I'd like a double shot in my latte.\"",
        "note": "Collocations: single shot, double shot",
        "pron": "/ʃɒt əv eˈspres.əʊ/"
      },
      {
        "word": "iced / cold brew",
        "meaningVi": "cà phê đá/lạnh",
        "exampleSentence": "\"I'll have an iced latte.\"",
        "exampleMeaning": "\"Our cold brew is brewed for 12 hours.\"",
        "note": "Collocations: iced coffee, iced matcha",
        "pron": "/aɪst/ /kəʊld bruː/"
      },
      {
        "word": "a frappuccino",
        "meaningVi": "frappuccino",
        "exampleSentence": "\"Can I get a caramel frappuccino?\"",
        "exampleMeaning": "\"We have frappuccinos in many flavors.\"",
        "note": "Common mistake: Starbucks",
        "pron": "/ˌfræp.ʊˈtʃiː.nəʊ/"
      },
      {
        "word": "a smoothie",
        "meaningVi": "sinh tố",
        "exampleSentence": "\"I'll have a mango smoothie.\"",
        "exampleMeaning": "\"Our smoothies are made with fresh fruit.\"",
        "note": "Collocations: fruit smoothie, protein smoothie",
        "pron": "/ˈsmuː.ði/"
      },
      {
        "word": "a bubble tea",
        "meaningVi": "trà sữa trân châu",
        "exampleSentence": "\"Can I get a bubble tea?\"",
        "exampleMeaning": "\"What flavor of bubble tea would you like?\"",
        "note": "Collocations: boba tea, pearl milk tea | Common mistake: \"Boba\" cũng hay dùng",
        "pron": "/ˈbʌb.əl tiː/"
      },
      {
        "word": "boba",
        "meaningVi": "trân châu (informal)",
        "exampleSentence": "\"Add boba, please.\"",
        "exampleMeaning": "\"Would you like boba in your tea?\"",
        "note": "Collocations: boba pearls, add boba",
        "pron": "/ˈbəʊ.bə/"
      },
      {
        "word": "tapioca pearls",
        "meaningVi": "trân châu",
        "exampleSentence": "\"Less tapioca pearls, please.\"",
        "exampleMeaning": "\"Our tapioca pearls are made fresh daily.\"",
        "note": null,
        "pron": "/ˌtæp.iˈəʊ.kə pɜːlz/"
      },
      {
        "word": "a topping",
        "meaningVi": "topping",
        "exampleSentence": "\"What toppings do you have?\"",
        "exampleMeaning": "\"You can choose up to three toppings.\"",
        "note": "Collocations: add toppings, extra topping",
        "pron": "/ˈtɒp.ɪŋ/"
      },
      {
        "word": "sugar level",
        "meaningVi": "mức đường",
        "exampleSentence": "\"50% sugar, please.\"",
        "exampleMeaning": "\"We offer adjustable sugar levels.\"",
        "note": "Collocations: 0% sugar, 50% sugar, 100% sugar | Common mistake: Hay gặp ở tiệm bubble tea",
        "pron": "/ˈʃʊɡ.ər ˈlev.əl/"
      },
      {
        "word": "ice level",
        "meaningVi": "mức đá",
        "exampleSentence": "\"Less ice, please.\"",
        "exampleMeaning": "\"We can adjust ice levels to your preference.\"",
        "note": "Collocations: no ice, less ice, regular ice",
        "pron": "/aɪs ˈlev.əl/"
      },
      {
        "word": "a drink",
        "meaningVi": "đồ uống",
        "exampleSentence": "\"What drinks do you have?\"",
        "exampleMeaning": "\"May I see the drink menu?\"",
        "note": "Collocations: soft drink, cold drink",
        "pron": "/drɪŋk/"
      },
      {
        "word": "a snack",
        "meaningVi": "đồ ăn vặt",
        "exampleSentence": "\"I need a quick snack.\"",
        "exampleMeaning": "\"We offer light snacks at the bar.\"",
        "note": "Collocations: grab a snack, have a snack",
        "pron": "/snæk/"
      },
      {
        "word": "a vending machine",
        "meaningVi": "máy bán hàng tự động",
        "exampleSentence": "\"There's a vending machine downstairs.\"",
        "exampleMeaning": "\"Vending machines are available on each floor.\"",
        "note": null,
        "pron": "/ˈven.dɪŋ məˈʃiːn/"
      },
      {
        "word": "to snack",
        "meaningVi": "ăn vặt",
        "exampleSentence": "\"I snack while coding.\"",
        "exampleMeaning": "\"We don't allow snacking at the desk.\"",
        "note": "Collocations: snack on, snack while",
        "pron": "/snæk/"
      },
      {
        "word": "a fridge",
        "meaningVi": "tủ lạnh",
        "exampleSentence": "\"I'll put it in the fridge.\"",
        "exampleMeaning": "\"Office fridge is cleaned every Friday.\"",
        "note": "Collocations: put in the fridge, fridge magnets",
        "pron": "/frɪdʒ/"
      },
      {
        "word": "a microwave",
        "meaningVi": "lò vi sóng",
        "exampleSentence": "\"Can I use the microwave?\"",
        "exampleMeaning": "\"Microwave is in the pantry area.\"",
        "note": "Collocations: microwave-safe",
        "pron": "/ˈmaɪ.krə.weɪv/"
      },
      {
        "word": "to heat up",
        "meaningVi": "hâm nóng",
        "exampleSentence": "\"Can I heat up my lunch?\"",
        "exampleMeaning": "\"Please feel free to heat up your meals.\"",
        "note": "Collocations: heat up leftovers",
        "pron": "/hiːt ʌp/"
      },
      {
        "word": "a water bottle",
        "meaningVi": "bình nước",
        "exampleSentence": "\"Don't forget your water bottle.\"",
        "exampleMeaning": "\"Reusable water bottles are encouraged.\"",
        "note": "Collocations: reusable water bottle",
        "pron": "/ˈwɔː.tər ˌbɒt.əl/"
      },
      {
        "word": "to hydrate",
        "meaningVi": "uống nước, bù nước",
        "exampleSentence": "\"Remember to hydrate!\"",
        "exampleMeaning": "\"Proper hydration improves productivity.\"",
        "note": "Collocations: stay hydrated, keep hydrated",
        "pron": "/haɪˈdreɪt/"
      },
      {
        "word": "a lunch break",
        "meaningVi": "giờ nghỉ trưa",
        "exampleSentence": "\"See you after lunch break.\"",
        "exampleMeaning": "\"Lunch break is from 12 to 1 PM.\"",
        "note": "Collocations: take a lunch break, during lunch break",
        "pron": "/lʌntʃ breɪk/"
      },
      {
        "word": "a coffee break",
        "meaningVi": "giờ nghỉ uống cà phê",
        "exampleSentence": "\"Let's take a coffee break.\"",
        "exampleMeaning": "\"We have a 15-minute coffee break.\"",
        "note": null,
        "pron": "/ˈkɒf.i breɪk/"
      },
      {
        "word": "a snack run",
        "meaningVi": "đi mua đồ ăn/snack",
        "exampleSentence": "\"Anyone want to join the snack run?\"",
        "exampleMeaning": "\"Would anyone like to be included in the snack run?\"",
        "note": "Common mistake: Casual",
        "pron": "/snæk rʌn/"
      },
      {
        "word": "food court",
        "meaningVi": "khu ăn uống",
        "exampleSentence": "\"Let's eat at the food court.\"",
        "exampleMeaning": "\"The food court has many options.\"",
        "note": null,
        "pron": "/fuːd kɔːt/"
      },
      {
        "word": "fast food",
        "meaningVi": "đồ ăn nhanh",
        "exampleSentence": "\"I'm craving fast food.\"",
        "exampleMeaning": "\"We minimize fast food consumption.\"",
        "note": "Collocations: eat fast food, fast food chain",
        "pron": "/fɑːst fuːd/"
      },
      {
        "word": "a chain restaurant",
        "meaningVi": "chuỗi nhà hàng",
        "exampleSentence": "\"It's a chain restaurant.\"",
        "exampleMeaning": "\"We avoid chain restaurants for team dinners.\"",
        "note": null,
        "pron": "/tʃeɪn ˈres.tə.rɒnt/"
      },
      {
        "word": "a food truck",
        "meaningVi": "xe bán đồ ăn",
        "exampleSentence": "\"There's a food truck outside.\"",
        "exampleMeaning": "\"Food trucks are a popular lunch option.\"",
        "note": null,
        "pron": "/fuːd trʌk/"
      },
      {
        "word": "to cater",
        "meaningVi": "đặt tiệc/catering",
        "exampleSentence": "\"We're catering lunch today.\"",
        "exampleMeaning": "\"The company caters lunch on Fridays.\"",
        "note": "Collocations: catered lunch, catering service",
        "pron": "/ˈkeɪ.tər/"
      },
      {
        "word": "delivery",
        "meaningVi": "giao hàng",
        "exampleSentence": "\"Is delivery free?\"",
        "exampleMeaning": "\"Free delivery on orders over $30.\"",
        "note": "Collocations: food delivery, free delivery",
        "pron": "/dɪˈlɪv.ər.i/"
      },
      {
        "word": "to deliver",
        "meaningVi": "giao",
        "exampleSentence": "\"When will you deliver?\"",
        "exampleMeaning": "\"We deliver within 30 minutes.\"",
        "note": "Collocations: deliver to, deliver on time",
        "pron": "/dɪˈlɪv.ər/"
      },
      {
        "word": "to ship",
        "meaningVi": "gửi (hàng)",
        "exampleSentence": "\"When does it ship?\"",
        "exampleMeaning": "\"Standard orders ship within 2 days.\"",
        "note": "Collocations: ship to, ship from, ready to ship",
        "pron": "/ʃɪp/"
      },
      {
        "word": "to track",
        "meaningVi": "theo dõi (đơn hàng)",
        "exampleSentence": "\"Can I track my order?\"",
        "exampleMeaning": "\"Tracking information will be emailed.\"",
        "note": "Collocations: track order, track package",
        "pron": "/træk/"
      },
      {
        "word": "a delivery fee",
        "meaningVi": "phí giao hàng",
        "exampleSentence": "\"Is there a delivery fee?\"",
        "exampleMeaning": "\"A delivery fee of $5 applies.\"",
        "note": "Collocations: waive the delivery fee",
        "pron": "/dɪˈlɪv.ər.i fiː/"
      },
      {
        "word": "a tip jar",
        "meaningVi": "hũ tiền boa",
        "exampleSentence": "\"There's a tip jar on the counter.\"",
        "exampleMeaning": "\"Tip jars are optional.\"",
        "note": null,
        "pron": "/tɪp dʒɑːr/"
      },
      {
        "word": "to be hungry",
        "meaningVi": "đói",
        "exampleSentence": "\"I'm hungry, let's eat.\"",
        "exampleMeaning": "\"Are you hungry yet?\"",
        "note": "Common mistake: ❌ \"I'm hungry\" KHÔNG dùng \"hungryly\"",
        "pron": "/bi ˈhʌŋ.ɡri/"
      },
      {
        "word": "to be thirsty",
        "meaningVi": "khát",
        "exampleSentence": "\"I'm so thirsty.\"",
        "exampleMeaning": "\"Would you like some water? You look thirsty.\"",
        "note": null,
        "pron": "/bi ˈθɜː.sti/"
      }
    ]
  },
  {
    "name": "Sức khỏe & khám bệnh",
    "icon": "🏥",
    "words": [
      {
        "word": "a doctor",
        "meaningVi": "bác sĩ",
        "exampleSentence": "\"I should see a doctor.\"",
        "exampleMeaning": "\"Please consult your primary doctor first.\"",
        "note": "Collocations: see a doctor, call a doctor",
        "pron": "/ˈdɒk.tər/"
      },
      {
        "word": "a clinic",
        "meaningVi": "phòng khám",
        "exampleSentence": "\"There's a clinic nearby.\"",
        "exampleMeaning": "\"Visit our clinic for a check-up.\"",
        "note": "Collocations: walk-in clinic, urgent care clinic",
        "pron": "/ˈklɪn.ɪk/"
      },
      {
        "word": "a hospital",
        "meaningVi": "bệnh viện",
        "exampleSentence": "\"He's in the hospital.\"",
        "exampleMeaning": "\"She was admitted to the hospital.\"",
        "note": "Collocations: be admitted to hospital",
        "pron": "/ˈhɒs.pɪ.təl/"
      },
      {
        "word": "urgent care",
        "meaningVi": "chăm sóc khẩn cấp (không phải ER)",
        "exampleSentence": "\"Let's go to urgent care.\"",
        "exampleMeaning": "\"Urgent care is appropriate for non-life-threatening issues.\"",
        "note": "Collocations: urgent care center | Common mistake: Khác ER (emergency room)",
        "pron": "/ˈɜː.dʒənt keər/"
      },
      {
        "word": "ER / emergency room",
        "meaningVi": "phòng cấp cứu",
        "exampleSentence": "\"We need the ER!\"",
        "exampleMeaning": "\"Call 911 if it's a real emergency.\"",
        "note": "Collocations: go to the ER | Common mistake: Mỹ: gọi 911 cho cấp cứu",
        "pron": "/iː ɑːr/ /ɪˈmɜː.dʒən.si ruːm/"
      },
      {
        "word": "an appointment",
        "meaningVi": "cuộc hẹn (khám)",
        "exampleSentence": "\"I have an appointment at 3 PM.\"",
        "exampleMeaning": "\"Please schedule an appointment in advance.\"",
        "note": "Collocations: make an appointment, book an appointment",
        "pron": "/əˈpɔɪnt.mənt/"
      },
      {
        "word": "to schedule",
        "meaningVi": "lên lịch",
        "exampleSentence": "\"Can I schedule a check-up?\"",
        "exampleMeaning": "\"Please schedule your visit online.\"",
        "note": "Collocations: schedule a meeting, schedule an appointment",
        "pron": "/ˈskedʒ.uːl/"
      },
      {
        "word": "a check-up",
        "meaningVi": "khám tổng quát",
        "exampleSentence": "\"I go for a check-up yearly.\"",
        "exampleMeaning": "\"Annual check-ups are covered by insurance.\"",
        "note": "Collocations: annual check-up, routine check-up",
        "pron": "/ˈtʃek ʌp/"
      },
      {
        "word": "a symptom",
        "meaningVi": "triệu chứng",
        "exampleSentence": "\"What are your symptoms?\"",
        "exampleMeaning": "\"Please describe your symptoms in detail.\"",
        "note": "Collocations: flu symptoms, COVID symptoms",
        "pron": "/ˈsɪmp.təm/"
      },
      {
        "word": "a fever",
        "meaningVi": "sốt",
        "exampleSentence": "\"I have a fever.\"",
        "exampleMeaning": "\"The patient has a high fever.\"",
        "note": "Collocations: have a fever, run a fever",
        "pron": "/ˈfiː.vər/"
      },
      {
        "word": "a headache",
        "meaningVi": "đau đầu",
        "exampleSentence": "\"I have a bad headache.\"",
        "exampleMeaning": "\"Are you experiencing headaches frequently?\"",
        "note": "Collocations: have a headache, severe headache",
        "pron": "/ˈhed.eɪk/"
      },
      {
        "word": "a sore throat",
        "meaningVi": "đau họng",
        "exampleSentence": "\"My throat is sore.\"",
        "exampleMeaning": "\"She complained of a sore throat.\"",
        "note": "Collocations: have a sore throat",
        "pron": "/sɔːr θrəʊt/"
      },
      {
        "word": "a cough",
        "meaningVi": "ho",
        "exampleSentence": "\"I have a bad cough.\"",
        "exampleMeaning": "\"The cough has persisted for two weeks.\"",
        "note": "Collocations: dry cough, wet cough, have a cough",
        "pron": "/kɒf/"
      },
      {
        "word": "a runny nose",
        "meaningVi": "sổ mũi",
        "exampleSentence": "\"I've got a runny nose.\"",
        "exampleMeaning": "\"Runny nose is a common symptom.\"",
        "note": null,
        "pron": "/ˌrʌn.i nəʊz/"
      },
      {
        "word": "nauseous / nausea",
        "meaningVi": "buồn nôn",
        "exampleSentence": "\"I feel nauseous.\"",
        "exampleMeaning": "\"The patient reports nausea.\"",
        "note": "Collocations: feel nauseous | Common mistake: ❌ \"I'm nausea\" → ✅ \"I feel nauseous\"",
        "pron": "/ˈnɔː.zi.əs/ /ˈnɔː.zi.ə/"
      },
      {
        "word": "dizzy / dizziness",
        "meaningVi": "chóng mặt",
        "exampleSentence": "\"I feel dizzy.\"",
        "exampleMeaning": "\"Dizziness may be a side effect.\"",
        "note": "Collocations: feel dizzy, get dizzy",
        "pron": "/ˈdɪz.i/ /ˈdɪz.i.nəs/"
      },
      {
        "word": "to throw up / vomit",
        "meaningVi": "nôn",
        "exampleSentence": "\"I think I'm going to throw up.\"",
        "exampleMeaning": "\"The patient vomited twice.\"",
        "note": "Collocations: throw up food",
        "pron": "/θrəʊ ʌp/ /ˈvɒm.ɪt/"
      },
      {
        "word": "diarrhea",
        "meaningVi": "tiêu chảy",
        "exampleSentence": "\"I have diarrhea.\"",
        "exampleMeaning": "\"Diarrhea may be caused by the medication.\"",
        "note": "Collocations: have diarrhea, severe diarrhea",
        "pron": "/ˌdaɪ.əˈrɪə/"
      },
      {
        "word": "a prescription",
        "meaningVi": "đơn thuốc",
        "exampleSentence": "\"The doctor gave me a prescription.\"",
        "exampleMeaning": "\"Please fill your prescription at any pharmacy.\"",
        "note": "Collocations: fill a prescription, write a prescription",
        "pron": "/prɪˈskrɪp.ʃən/"
      },
      {
        "word": "a pharmacy / drugstore",
        "meaningVi": "hiệu thuốc",
        "exampleSentence": "\"Where's the nearest pharmacy?\"",
        "exampleMeaning": "\"The pharmacy is open until 10 PM.\"",
        "note": "Collocations: local pharmacy, CVS pharmacy | Common mistake: Mỹ: \"drugstore\"",
        "pron": "/ˈfɑː.mə.si/ /ˈdrʌɡ.stɔːr/"
      },
      {
        "word": "over-the-counter (OTC)",
        "meaningVi": "thuốc không cần đơn",
        "exampleSentence": "\"You can buy it OTC.\"",
        "exampleMeaning": "\"This medication is available over the counter.\"",
        "note": "Collocations: OTC medication, OTC painkiller",
        "pron": "/ˌəʊ.vər ðə ˈkaʊn.tər/"
      },
      {
        "word": "a painkiller",
        "meaningVi": "thuốc giảm đau",
        "exampleSentence": "\"I need a painkiller.\"",
        "exampleMeaning": "\"Painkillers should be taken with food.\"",
        "note": "Collocations: take a painkiller, mild painkiller",
        "pron": "/ˈpeɪn.kɪl.ər/"
      },
      {
        "word": "an antibiotic",
        "meaningVi": "kháng sinh",
        "exampleSentence": "\"The doctor prescribed antibiotics.\"",
        "exampleMeaning": "\"Complete the full course of antibiotics.\"",
        "note": "Collocations: take antibiotics, course of antibiotics",
        "pron": "/ˌæn.ti.baɪˈɒt.ɪk/"
      },
      {
        "word": "side effects",
        "meaningVi": "tác dụng phụ",
        "exampleSentence": "\"Any side effects?\"",
        "exampleMeaning": "\"Common side effects include nausea.\"",
        "note": "Collocations: side effects of, common side effects",
        "pron": "/saɪd ɪˈfekts/"
      },
      {
        "word": "an allergy",
        "meaningVi": "dị ứng",
        "exampleSentence": "\"I have a nut allergy.\"",
        "exampleMeaning": "\"Please list all known allergies.\"",
        "note": "Collocations: food allergy, drug allergy, have an allergy",
        "pron": "/ˈæl.ə.dʒi/"
      },
      {
        "word": "to refill",
        "meaningVi": "mua thêm (thuốc theo đơn)",
        "exampleSentence": "\"I need to refill my prescription.\"",
        "exampleMeaning": "\"Prescription refills require a doctor's approval.\"",
        "note": "Collocations: refill prescription, request a refill",
        "pron": "/ˌriːˈfɪl/"
      },
      {
        "word": "insurance",
        "meaningVi": "bảo hiểm",
        "exampleSentence": "\"Does my insurance cover this?\"",
        "exampleMeaning": "\"Health insurance is provided to all full-time employees.\"",
        "note": "Collocations: health insurance, dental insurance",
        "pron": "/ɪnˈʃʊə.rəns/"
      },
      {
        "word": "a copay",
        "meaningVi": "phí đồng trả (bảo hiểm)",
        "exampleSentence": "\"What's the copay?\"",
        "exampleMeaning": "\"Your copay is $25 for specialist visits.\"",
        "note": "Collocations: copay amount | Common mistake: Mỹ thuật ngữ bảo hiểm",
        "pron": "/ˈkəʊ.peɪ/"
      },
      {
        "word": "a deductible",
        "meaningVi": "mức khấu trừ (bảo hiểm)",
        "exampleSentence": "\"I haven't met my deductible.\"",
        "exampleMeaning": "\"Your annual deductible is $1,500.\"",
        "note": "Collocations: meet the deductible",
        "pron": "/dɪˈdʌk.tə.bəl/"
      },
      {
        "word": "in-network",
        "meaningVi": "trong mạng lưới BH",
        "exampleSentence": "\"Is this doctor in-network?\"",
        "exampleMeaning": "\"In-network providers reduce your costs.\"",
        "note": "Collocations: in-network provider",
        "pron": "/ɪn ˈnet.wɜːk/"
      },
      {
        "word": "out-of-network",
        "meaningVi": "ngoài mạng lưới BH",
        "exampleSentence": "\"This is out-of-network.\"",
        "exampleMeaning": "\"Out-of-network visits have higher copays.\"",
        "note": "Collocations: out-of-network provider",
        "pron": "/ˌaʊt əv ˈnet.wɜːk/"
      },
      {
        "word": "a claim",
        "meaningVi": "yêu cầu bồi thường BH",
        "exampleSentence": "\"Submit your insurance claim.\"",
        "exampleMeaning": "\"Claims must be filed within 90 days.\"",
        "note": "Collocations: file a claim, submit a claim",
        "pron": "/kleɪm/"
      },
      {
        "word": "a sick leave",
        "meaningVi": "nghỉ ốm",
        "exampleSentence": "\"I need to take sick leave.\"",
        "exampleMeaning": "\"Sick leave is accrued at one day per month.\"",
        "note": "Collocations: take sick leave, on sick leave",
        "pron": "/sɪk liːv/"
      },
      {
        "word": "to call in sick",
        "meaningVi": "gọi xin nghỉ ốm",
        "exampleSentence": "\"I'll call in sick today.\"",
        "exampleMeaning": "\"Please call in sick before 9 AM.\"",
        "note": "Collocations: call in sick to work",
        "pron": "/kɔːl ɪn sɪk/"
      },
      {
        "word": "a sick day",
        "meaningVi": "ngày nghỉ ốm",
        "exampleSentence": "\"I need a sick day.\"",
        "exampleMeaning": "\"Employees receive 10 sick days per year.\"",
        "note": "Collocations: use a sick day, take a sick day",
        "pron": "/sɪk deɪ/"
      },
      {
        "word": "to recover",
        "meaningVi": "hồi phục",
        "exampleSentence": "\"I'm recovering from the flu.\"",
        "exampleMeaning": "\"Full recovery is expected within two weeks.\"",
        "note": "Collocations: recover from, full recovery",
        "pron": "/rɪˈkʌv.ər/"
      },
      {
        "word": "to rest",
        "meaningVi": "nghỉ ngơi",
        "exampleSentence": "\"You need to rest more.\"",
        "exampleMeaning": "\"Adequate rest is essential for recovery.\"",
        "note": "Collocations: get plenty of rest, rest up",
        "pron": "/rest/"
      },
      {
        "word": "to hydrate",
        "meaningVi": "bù nước",
        "exampleSentence": "\"Drink water, stay hydrated.\"",
        "exampleMeaning": "\"Hydration is crucial when you're sick.\"",
        "note": "Collocations: stay hydrated, keep hydrated",
        "pron": "/haɪˈdreɪt/"
      },
      {
        "word": "a vaccine",
        "meaningVi": "vắc xin",
        "exampleSentence": "\"Did you get the flu vaccine?\"",
        "exampleMeaning": "\"Vaccines are available at no cost.\"",
        "note": "Collocations: flu vaccine, COVID vaccine, get a vaccine",
        "pron": "/ˈvæk.siːn/"
      },
      {
        "word": "a booster shot",
        "meaningVi": "mũi tiêm nhắc lại",
        "exampleSentence": "\"Time for a booster.\"",
        "exampleMeaning": "\"Booster shots are recommended annually.\"",
        "note": "Collocations: get a booster shot",
        "pron": "/ˈbuː.stər ʃɒt/"
      },
      {
        "word": "a physical",
        "meaningVi": "khám sức khỏe tổng quát",
        "exampleSentence": "\"I have my annual physical next week.\"",
        "exampleMeaning": "\"Annual physicals are part of our wellness program.\"",
        "note": "Collocations: annual physical, get a physical",
        "pron": "/ˈfɪz.ɪ.kəl/"
      },
      {
        "word": "blood work",
        "meaningVi": "xét nghiệm máu",
        "exampleSentence": "\"The doctor ordered blood work.\"",
        "exampleMeaning": "\"Blood work results will be available in 3 days.\"",
        "note": "Collocations: blood work results, do blood work",
        "pron": "/blʌd wɜːk/"
      },
      {
        "word": "a referral",
        "meaningVi": "giấy giới thiệu (đến BS khác)",
        "exampleSentence": "\"I need a referral to a specialist.\"",
        "exampleMeaning": "\"Referrals require pre-authorization.\"",
        "note": "Collocations: get a referral, specialist referral",
        "pron": "/rɪˈfɜː.ri.əl/"
      },
      {
        "word": "a specialist",
        "meaningVi": "bác sĩ chuyên khoa",
        "exampleSentence": "\"She referred me to a specialist.\"",
        "exampleMeaning": "\"Our specialists provide expert care.\"",
        "note": "Collocations: see a specialist",
        "pron": "/ˈspeʃ.əl.ɪst/"
      },
      {
        "word": "to get worse",
        "meaningVi": "tệ hơn",
        "exampleSentence": "\"My cold is getting worse.\"",
        "exampleMeaning": "\"If symptoms get worse, seek medical help.\"",
        "note": "Collocations: get worse, getting worse",
        "pron": "/ɡet wɜːs/"
      },
      {
        "word": "to get better",
        "meaningVi": "khá hơn",
        "exampleSentence": "\"I'm getting better.\"",
        "exampleMeaning": "\"The patient is getting better each day.\"",
        "note": "Collocations: get better soon",
        "pron": "/ɡet ˈbet.ər/"
      },
      {
        "word": "mental health",
        "meaningVi": "sức khỏe tinh thần",
        "exampleSentence": "\"Mental health matters.\"",
        "exampleMeaning": "\"We provide mental health support for all employees.\"",
        "note": "Collocations: mental health day, mental health support",
        "pron": "/ˈmen.təl helθ/"
      },
      {
        "word": "a therapist",
        "meaningVi": "nhà trị liệu",
        "exampleSentence": "\"I see a therapist weekly.\"",
        "exampleMeaning": "\"Our EAP covers therapist visits.\"",
        "note": "Collocations: see a therapist",
        "pron": "/ˈθer.ə.pɪst/"
      },
      {
        "word": "stress",
        "meaningVi": "căng thẳng",
        "exampleSentence": "\"I'm so stressed out.\"",
        "exampleMeaning": "\"Workplace stress is a serious concern.\"",
        "note": "Collocations: stressed out, stressed at work",
        "pron": "/stres/"
      },
      {
        "word": "burnout",
        "meaningVi": "kiệt sức",
        "exampleSentence": "\"I'm hitting burnout.\"",
        "exampleMeaning": "\"Burnout prevention is a leadership priority.\"",
        "note": "Collocations: suffer from burnout, prevent burnout",
        "pron": "/ˈbɜːn.aʊt/"
      }
    ]
  },
  {
    "name": "Nhà ở & đời sống",
    "icon": "🏠",
    "words": [
      {
        "word": "an apartment",
        "meaningVi": "căn hộ",
        "exampleSentence": "\"I live in an apartment.\"",
        "exampleMeaning": "\"The apartment includes parking.\"",
        "note": "Collocations: rent an apartment, apartment complex | Common mistake: Mỹ: apartment; Anh: flat",
        "pron": "/əˈpɑːt.mənt/"
      },
      {
        "word": "a flat",
        "meaningVi": "căn hộ (BrE)",
        "exampleSentence": "\"I'm looking for a flat.\"",
        "exampleMeaning": "\"Two-bedroom flat available now.\"",
        "note": "Common mistake: BrE",
        "pron": "/flæt/"
      },
      {
        "word": "a studio",
        "meaningVi": "studio (1 phòng)",
        "exampleSentence": "\"It's a small studio.\"",
        "exampleMeaning": "\"Studio apartments are popular downtown.\"",
        "note": "Collocations: studio apartment",
        "pron": "/ˈstjuː.di.əʊ/"
      },
      {
        "word": "a condo",
        "meaningVi": "chung cư (sở hữu)",
        "exampleSentence": "\"I bought a condo.\"",
        "exampleMeaning": "\"Condo fees include maintenance.\"",
        "note": "Collocations: condo fees, condo building",
        "pron": "/ˈkɒn.dəʊ/"
      },
      {
        "word": "a roommate",
        "meaningVi": "bạn cùng phòng",
        "exampleSentence": "\"My roommate is cool.\"",
        "exampleMeaning": "\"Roommates share utility costs.\"",
        "note": "Collocations: find a roommate",
        "pron": "/ˈruːm.meɪt/"
      },
      {
        "word": "a landlord",
        "meaningVi": "chủ nhà (cho thuê)",
        "exampleSentence": "\"My landlord is nice.\"",
        "exampleMeaning": "\"Please contact your landlord directly.\"",
        "note": null,
        "pron": "/ˈlænd.lɔːd/"
      },
      {
        "word": "a tenant",
        "meaningVi": "người thuê nhà",
        "exampleSentence": "\"I'm a tenant here.\"",
        "exampleMeaning": "\"Tenants must give 30 days' notice.\"",
        "note": null,
        "pron": "/ˈten.ənt/"
      },
      {
        "word": "a lease",
        "meaningVi": "hợp đồng thuê",
        "exampleSentence": "\"The lease is for one year.\"",
        "exampleMeaning": "\"Lease terms are non-negotiable.\"",
        "note": "Collocations: sign a lease, break a lease",
        "pron": "/liːs/"
      },
      {
        "word": "to rent",
        "meaningVi": "thuê",
        "exampleSentence": "\"I'm renting a place.\"",
        "exampleMeaning": "\"Properties can be rented monthly.\"",
        "note": "Collocations: rent out, for rent",
        "pron": "/rent/"
      },
      {
        "word": "a deposit",
        "meaningVi": "tiền đặt cọc",
        "exampleSentence": "\"I paid one month's deposit.\"",
        "exampleMeaning": "\"Security deposit is refundable.\"",
        "note": "Collocations: security deposit, pay a deposit",
        "pron": "/dɪˈpɒz.ɪt/"
      },
      {
        "word": "rent",
        "meaningVi": "tiền thuê nhà",
        "exampleSentence": "\"How much is the rent?\"",
        "exampleMeaning": "\"Monthly rent is due on the 1st.\"",
        "note": "Collocations: pay rent, monthly rent",
        "pron": "/rent/"
      },
      {
        "word": "utilities",
        "meaningVi": "điện nước gas internet",
        "exampleSentence": "\"Utilities are extra.\"",
        "exampleMeaning": "\"Utilities are not included in rent.\"",
        "note": "Collocations: pay utilities",
        "pron": "/juːˈtɪl.ə.tiz/"
      },
      {
        "word": "electricity",
        "meaningVi": "điện",
        "exampleSentence": "\"The electricity bill is high.\"",
        "exampleMeaning": "\"Electricity is included in rent.\"",
        "note": "Collocations: electricity bill",
        "pron": "/ɪˌlekˈtrɪs.ə.ti/"
      },
      {
        "word": "a water bill",
        "meaningVi": "hóa đơn nước",
        "exampleSentence": "\"Did you pay the water bill?\"",
        "exampleMeaning": "\"Water bills are issued monthly.\"",
        "note": "Collocations: pay the water bill",
        "pron": "/ˈwɔː.tər bɪl/"
      },
      {
        "word": "internet",
        "meaningVi": "internet",
        "exampleSentence": "\"Is internet included?\"",
        "exampleMeaning": "\"High-speed internet is provided.\"",
        "note": "Collocations: internet bill, Wi-Fi password",
        "pron": "/ˈɪn.tə.net/"
      },
      {
        "word": "Wi-Fi password",
        "meaningVi": "mật khẩu Wi-Fi",
        "exampleSentence": "\"What's the Wi-Fi password?\"",
        "exampleMeaning": "\"Please enter the Wi-Fi password.\"",
        "note": "Collocations: connect to Wi-Fi",
        "pron": "/ˈwaɪ.faɪ ˈpɑːs.wɜːd/"
      },
      {
        "word": "to move in",
        "meaningVi": "chuyển vào",
        "exampleSentence": "\"When can I move in?\"",
        "exampleMeaning": "\"Tenants may move in on the 1st.\"",
        "note": "Collocations: move-in date, move in date",
        "pron": "/muːv ɪn/"
      },
      {
        "word": "to move out",
        "meaningVi": "chuyển ra",
        "exampleSentence": "\"I'm moving out next month.\"",
        "exampleMeaning": "\"Please give 30 days' notice before moving out.\"",
        "note": "Collocations: move-out date",
        "pron": "/muːv aʊt/"
      },
      {
        "word": "to relocate",
        "meaningVi": "chuyển chỗ ở/công tác",
        "exampleSentence": "\"I'm relocating for work.\"",
        "exampleMeaning": "\"Our company will relocate you.\"",
        "note": "Collocations: relocate to, job relocation",
        "pron": "/ˌriː.ləʊˈkeɪt/"
      },
      {
        "word": "a neighborhood",
        "meaningVi": "khu phố",
        "exampleSentence": "\"It's a quiet neighborhood.\"",
        "exampleMeaning": "\"This neighborhood is family-friendly.\"",
        "note": "Collocations: nice neighborhood, safe neighborhood",
        "pron": "/ˈneɪ.bə.hʊd/"
      },
      {
        "word": "a commute",
        "meaningVi": "đi lại (đến chỗ làm)",
        "exampleSentence": "\"My commute is 30 minutes.\"",
        "exampleMeaning": "\"The commute can be reduced by remote work.\"",
        "note": "Collocations: daily commute, long commute",
        "pron": "/kəˈmjuːt/"
      },
      {
        "word": "to commute",
        "meaningVi": "đi làm hằng ngày",
        "exampleSentence": "\"I commute by train.\"",
        "exampleMeaning": "\"She commutes two hours each way.\"",
        "note": "Collocations: commute to work",
        "pron": "/kəˈmjuːt/"
      },
      {
        "word": "furniture",
        "meaningVi": "đồ nội thất",
        "exampleSentence": "\"The apartment is furnished.\"",
        "exampleMeaning": "\"Furniture must be removed upon move-out.\"",
        "note": "Collocations: buy furniture, furniture store",
        "pron": "/ˈfɜː.nɪ.tʃər/"
      },
      {
        "word": "furnished",
        "meaningVi": "có sẵn nội thất",
        "exampleSentence": "\"Is the room furnished?\"",
        "exampleMeaning": "\"Furnished units include basic appliances.\"",
        "note": "Collocations: fully furnished",
        "pron": "/ˈfɜː.nɪʃt/"
      },
      {
        "word": "unfurnished",
        "meaningVi": "không có nội thất",
        "exampleSentence": "\"It's unfurnished.\"",
        "exampleMeaning": "\"Unfurnished units are cheaper.\"",
        "note": null,
        "pron": "/ʌnˈfɜː.nɪʃt/"
      },
      {
        "word": "an address",
        "meaningVi": "địa chỉ",
        "exampleSentence": "\"What's your address?\"",
        "exampleMeaning": "\"Please update your billing address.\"",
        "note": "Collocations: home address, email address",
        "pron": "/əˈdres/"
      },
      {
        "word": "a zip code",
        "meaningVi": "mã bưu điện",
        "exampleSentence": "\"What's your zip code?\"",
        "exampleMeaning": "\"Please include your zip code on the form.\"",
        "note": "Common mistake: Mỹ",
        "pron": "/ˈzɪp kəʊd/"
      },
      {
        "word": "a postcode",
        "meaningVi": "mã bưu điện",
        "exampleSentence": "\"What's your postcode?\"",
        "exampleMeaning": "\"Please include your postcode.\"",
        "note": "Common mistake: BrE",
        "pron": "/ˈpəʊst.kəʊd/"
      },
      {
        "word": "a key",
        "meaningVi": "chìa khóa",
        "exampleSentence": "\"Can I get a spare key?\"",
        "exampleMeaning": "\"Keys must be returned upon move-out.\"",
        "note": "Collocations: spare key, lose a key",
        "pron": "/kiː/"
      },
      {
        "word": "to lock",
        "meaningVi": "khóa",
        "exampleSentence": "\"Don't forget to lock the door.\"",
        "exampleMeaning": "\"Please lock all doors before leaving.\"",
        "note": "Collocations: lock the door, lock up",
        "pron": "/lɒk/"
      },
      {
        "word": "a lock",
        "meaningVi": "ổ khóa",
        "exampleSentence": "\"The lock is broken.\"",
        "exampleMeaning": "\"Locks are changed between tenants.\"",
        "note": "Collocations: door lock, change the lock",
        "pron": "/lɒk/"
      },
      {
        "word": "to unlock",
        "meaningVi": "mở khóa",
        "exampleSentence": "\"Let me unlock the door.\"",
        "exampleMeaning": "\"Please unlock the door for the delivery.\"",
        "note": "Collocations: unlock with, smart unlock",
        "pron": "/ʌnˈlɒk/"
      },
      {
        "word": "a hallway",
        "meaningVi": "hành lang",
        "exampleSentence": "\"The hallway is dark.\"",
        "exampleMeaning": "\"Hallways are cleaned daily.\"",
        "note": null,
        "pron": "/ˈhɔːl.weɪ/"
      },
      {
        "word": "an elevator",
        "meaningVi": "thang máy",
        "exampleSentence": "\"Take the elevator to floor 5.\"",
        "exampleMeaning": "\"Elevator maintenance is scheduled Friday.\"",
        "note": "Common mistake: Mỹ",
        "pron": "/ˈel.ɪ.veɪ.tər/"
      },
      {
        "word": "a lift",
        "meaningVi": "thang máy",
        "exampleSentence": "\"Where's the lift?\"",
        "exampleMeaning": "\"Use the lift for heavy items.\"",
        "note": "Common mistake: BrE",
        "pron": "/lɪft/"
      },
      {
        "word": "stairs",
        "meaningVi": "cầu thang",
        "exampleSentence": "\"I'll take the stairs.\"",
        "exampleMeaning": "\"Emergency stairs are on the left.\"",
        "note": "Collocations: take the stairs",
        "pron": "/steərz/"
      },
      {
        "word": "a parking lot",
        "meaningVi": "bãi đỗ xe",
        "exampleSentence": "\"Park in the visitor lot.\"",
        "exampleMeaning": "\"Resident parking is in the basement.\"",
        "note": null,
        "pron": "/ˈpɑː.kɪŋ lɒt/"
      },
      {
        "word": "a garage",
        "meaningVi": "ga-ra",
        "exampleSentence": "\"I park in the garage.\"",
        "exampleMeaning": "\"Garage access requires a fob.\"",
        "note": "Collocations: parking garage",
        "pron": "/ˈɡær.ɑːʒ/"
      },
      {
        "word": "a balcony",
        "meaningVi": "ban công",
        "exampleSentence": "\"I have coffee on the balcony.\"",
        "exampleMeaning": "\"Balconies must not be used for storage.\"",
        "note": null,
        "pron": "/ˈbæl.kə.ni/"
      },
      {
        "word": "a yard",
        "meaningVi": "sân vườn",
        "exampleSentence": "\"Kids play in the yard.\"",
        "exampleMeaning": "\"Yard maintenance is included.\"",
        "note": "Collocations: backyard, front yard",
        "pron": "/jɑːd/"
      },
      {
        "word": "a closet",
        "meaningVi": "tủ âm tường",
        "exampleSentence": "\"There's a walk-in closet.\"",
        "exampleMeaning": "\"Closet space is ample.\"",
        "note": "Collocations: walk-in closet | Common mistake: Mỹ",
        "pron": "/ˈklɒz.ɪt/"
      },
      {
        "word": "a wardrobe",
        "meaningVi": "tủ quần áo",
        "exampleSentence": "\"I need a bigger wardrobe.\"",
        "exampleMeaning": "\"Built-in wardrobes are standard.\"",
        "note": "Common mistake: BrE",
        "pron": "/ˈwɔː.drəʊb/"
      },
      {
        "word": "a kitchen",
        "meaningVi": "bếp",
        "exampleSentence": "\"The kitchen is small.\"",
        "exampleMeaning": "\"The kitchen is fully equipped.\"",
        "note": "Collocations: open kitchen",
        "pron": "/ˈkɪtʃ.ɪn/"
      },
      {
        "word": "a bathroom",
        "meaningVi": "phòng tắm",
        "exampleSentence": "\"Where's the bathroom?\"",
        "exampleMeaning": "\"Each unit has one bathroom.\"",
        "note": "Collocations: shared bathroom, en-suite bathroom",
        "pron": "/ˈbɑːθ.ruːm/"
      },
      {
        "word": "a bedroom",
        "meaningVi": "phòng ngủ",
        "exampleSentence": "\"Two-bedroom apartment.\"",
        "exampleMeaning": "\"Bedrooms include built-in storage.\"",
        "note": "Collocations: master bedroom, bedroom community",
        "pron": "/ˈbed.ruːm/"
      },
      {
        "word": "a living room",
        "meaningVi": "phòng khách",
        "exampleSentence": "\"Living room is spacious.\"",
        "exampleMeaning": "\"Open-concept living room.\"",
        "note": "Collocations: living room set",
        "pron": "/ˈlɪv.ɪŋ ruːm/"
      },
      {
        "word": "a couch / sofa",
        "meaningVi": "ghế sofa",
        "exampleSentence": "\"I'm on the couch.\"",
        "exampleMeaning": "\"Sofa comes with washable covers.\"",
        "note": null,
        "pron": "/kaʊtʃ/ /ˈsəʊ.fə/"
      },
      {
        "word": "to vacuum",
        "meaningVi": "hút bụi",
        "exampleSentence": "\"I need to vacuum.\"",
        "exampleMeaning": "\"Vacuum the carpets weekly.\"",
        "note": "Collocations: vacuum cleaner",
        "pron": "/ˈvæk.juːm/"
      },
      {
        "word": "to do laundry",
        "meaningVi": "giặt đồ",
        "exampleSentence": "\"I'll do laundry tomorrow.\"",
        "exampleMeaning": "\"Laundry facilities are in the basement.\"",
        "note": "Collocations: do the laundry, laundry room",
        "pron": "/duː ˈlɔːn.dri/"
      }
    ]
  },
  {
    "name": "Tiền bạc & banking",
    "icon": "🏦",
    "words": [
      {
        "word": "a salary",
        "meaningVi": "lương (cố định hàng tháng)",
        "exampleSentence": "\"What's your salary?\"",
        "exampleMeaning": "\"Annual salary is paid bi-weekly.\"",
        "note": "Collocations: high salary, salary range | Common mistake: ❌ \"salaries\" thì OK, \"salary\" là số ít",
        "pron": "/ˈsæl.ər.i/"
      },
      {
        "word": "a wage",
        "meaningVi": "lương (theo giờ)",
        "exampleSentence": "\"Wages are low here.\"",
        "exampleMeaning": "\"Hourly wages start at $15.\"",
        "note": "Collocations: minimum wage | Common mistake: Thường dùng cho hourly work",
        "pron": "/weɪdʒ/"
      },
      {
        "word": "pay",
        "meaningVi": "tiền lương (chung)",
        "exampleSentence": "\"The pay is good.\"",
        "exampleMeaning": "\"Pay is reviewed annually.\"",
        "note": "Collocations: take-home pay, base pay",
        "pron": "/peɪ/"
      },
      {
        "word": "a paycheck / pay slip",
        "meaningVi": "phiếu lương",
        "exampleSentence": "\"I got my paycheck.\"",
        "exampleMeaning": "\"Paychecks are issued on the 15th.\"",
        "note": "Collocations: receive a paycheck",
        "pron": "/ˈpeɪ.tʃek/ /ˈpeɪ slɪp/"
      },
      {
        "word": "income",
        "meaningVi": "thu nhập",
        "exampleSentence": "\"My income covers it.\"",
        "exampleMeaning": "\"Annual income must be reported.\"",
        "note": "Collocations: gross income, net income",
        "pron": "/ˈɪn.kʌm/"
      },
      {
        "word": "gross / net",
        "meaningVi": "trước/sau thuế",
        "exampleSentence": "\"Gross is $80k, net is $60k.\"",
        "exampleMeaning": "\"Net income is calculated after deductions.\"",
        "note": "Collocations: gross salary, net salary",
        "pron": "/ɡrəʊs/ /net/"
      },
      {
        "word": "tax",
        "meaningVi": "thuế",
        "exampleSentence": "\"How much tax do I pay?\"",
        "exampleMeaning": "\"Tax rates vary by state.\"",
        "note": "Collocations: income tax, pay tax",
        "pron": "/tæks/"
      },
      {
        "word": "income tax",
        "meaningVi": "thuế thu nhập",
        "exampleSentence": "\"Income tax is deducted.\"",
        "exampleMeaning": "\"Income tax is filed annually.\"",
        "note": null,
        "pron": "/ˈɪn.kʌm tæks/"
      },
      {
        "word": "to tax",
        "meaningVi": "đánh thuế",
        "exampleSentence": "\"The US taxes worldwide income.\"",
        "exampleMeaning": "\"Income earned abroad is also taxed.\"",
        "note": "Collocations: taxed at",
        "pron": "/tæks/"
      },
      {
        "word": "a tax return",
        "meaningVi": "tờ khai thuế",
        "exampleSentence": "\"File your tax return by April.\"",
        "exampleMeaning": "\"Tax returns must be submitted online.\"",
        "note": "Collocations: file a tax return",
        "pron": "/tæks rɪˈtɜːn/"
      },
      {
        "word": "a deduction",
        "meaningVi": "khoản khấu trừ",
        "exampleSentence": "\"What are the deductions?\"",
        "exampleMeaning": "\"Pre-tax deductions reduce taxable income.\"",
        "note": "Collocations: tax deduction",
        "pron": "/dɪˈdʌk.ʃən/"
      },
      {
        "word": "an allowance",
        "meaningVi": "trợ cấp, phụ cấp",
        "exampleSentence": "\"I get a meal allowance.\"",
        "exampleMeaning": "\"Remote workers receive a home-office allowance.\"",
        "note": "Collocations: housing allowance",
        "pron": "/əˈlaʊ.əns/"
      },
      {
        "word": "a bonus",
        "meaningVi": "tiền thưởng",
        "exampleSentence": "\"I got a year-end bonus.\"",
        "exampleMeaning": "\"Performance bonuses are paid quarterly.\"",
        "note": "Collocations: year-end bonus, sign-on bonus",
        "pron": "/ˈbəʊ.nəs/"
      },
      {
        "word": "a raise",
        "meaningVi": "tăng lương",
        "exampleSentence": "\"I got a raise!\"",
        "exampleMeaning": "\"Annual raises are based on performance.\"",
        "note": "Collocations: get a raise, ask for a raise",
        "pron": "/reɪz/"
      },
      {
        "word": "to negotiate",
        "meaningVi": "đàm phán",
        "exampleSentence": "\"I want to negotiate salary.\"",
        "exampleMeaning": "\"We encourage you to negotiate.\"",
        "note": "Collocations: negotiate salary, negotiate terms",
        "pron": "/nɪˈɡəʊ.ʃi.eɪt/"
      },
      {
        "word": "an offer",
        "meaningVi": "đề nghị (công việc)",
        "exampleSentence": "\"I got an offer!\"",
        "exampleMeaning": "\"Please review the formal offer.\"",
        "note": "Collocations: job offer, offer letter",
        "pron": "/ˈɒf.ər/"
      },
      {
        "word": "an offer letter",
        "meaningVi": "thư mời làm việc",
        "exampleSentence": "\"When does the offer letter come?\"",
        "exampleMeaning": "\"Offer letters include terms and conditions.\"",
        "note": "Collocations: sign an offer letter",
        "pron": "/ˈɒf.ər ˈlet.ər/"
      },
      {
        "word": "equity",
        "meaningVi": "cổ phần (công ty)",
        "exampleSentence": "\"They offered equity.\"",
        "exampleMeaning": "\"Equity grants vest over four years.\"",
        "note": "Collocations: equity compensation, stock equity",
        "pron": "/ˈek.wɪ.ti/"
      },
      {
        "word": "stock options",
        "meaningVi": "quyền mua cổ phiếu",
        "exampleSentence": "\"How do stock options work?\"",
        "exampleMeaning": "\"Stock options are subject to a vesting schedule.\"",
        "note": "Collocations: grant stock options",
        "pron": "/stɒk ˈɒp.ʃənz/"
      },
      {
        "word": "RSU",
        "meaningVi": "Restricted Stock Units",
        "exampleSentence": "\"I have RSUs.\"",
        "exampleMeaning": "\"RSUs vest over a 4-year schedule with a 1-year cliff.\"",
        "note": "Collocations: RSU vesting, RSU grant",
        "pron": "/ɑːr es juː/"
      },
      {
        "word": "to vest",
        "meaningVi": "được quyền sở hữu (cổ phần)",
        "exampleSentence": "\"When do my shares vest?\"",
        "exampleMeaning": "\"Equity vests 25% per year.\"",
        "note": "Collocations: vesting schedule, fully vested",
        "pron": "/vest/"
      },
      {
        "word": "a cliff",
        "meaningVi": "mốc vesting (thường 1 năm)",
        "exampleSentence": "\"There's a 1-year cliff.\"",
        "exampleMeaning": "\"The cliff requires continued employment.\"",
        "note": "Collocations: 1-year cliff",
        "pron": "/klɪf/"
      },
      {
        "word": "benefits",
        "meaningVi": "phúc lợi",
        "exampleSentence": "\"Benefits are great here.\"",
        "exampleMeaning": "\"Benefits include health, dental, and vision.\"",
        "note": "Collocations: employee benefits, full benefits",
        "pron": "/ˈben.ɪ.fɪts/"
      },
      {
        "word": "health insurance",
        "meaningVi": "bảo hiểm sức khỏe",
        "exampleSentence": "\"Health insurance kicks in next month.\"",
        "exampleMeaning": "\"Health insurance premiums are covered 100%.\"",
        "note": null,
        "pron": "/helθ ɪnˈʃʊə.rəns/"
      },
      {
        "word": "dental / vision",
        "meaningVi": "nha khoa / mắt",
        "exampleSentence": "\"Dental is included.\"",
        "exampleMeaning": "\"Vision coverage is available as an add-on.\"",
        "note": "Collocations: dental insurance, vision insurance",
        "pron": "/ˈden.təl/ /ˈvɪʒ.ən/"
      },
      {
        "word": "a 401k",
        "meaningVi": "quỹ hưu trí (Mỹ)",
        "exampleSentence": "\"Does the 401k have a match?\"",
        "exampleMeaning": "\"Our 401k matches up to 4%.\"",
        "note": "Collocations: 401k match, contribute to 401k | Common mistake: Mỹ thuật ngữ",
        "pron": "/fɔːr əʊ wʌn keɪ/"
      },
      {
        "word": "a match",
        "meaningVi": "công ty đóng thêm vào 401k",
        "exampleSentence": "\"The match is 4%.\"",
        "exampleMeaning": "\"Employer match vests immediately.\"",
        "note": "Collocations: employer match, 4% match",
        "pron": "/mætʃ/"
      },
      {
        "word": "PTO",
        "meaningVi": "Paid Time Off (ngày nghỉ có lương)",
        "exampleSentence": "\"How much PTO do I get?\"",
        "exampleMeaning": "\"PTO accrues at 1.5 days per month.\"",
        "note": "Collocations: use PTO, PTO policy",
        "pron": "/piː tiː əʊ/"
      },
      {
        "word": "sick leave",
        "meaningVi": "nghỉ ốm",
        "exampleSentence": "\"I need sick leave.\"",
        "exampleMeaning": "\"Sick leave is separate from PTO.\"",
        "note": null,
        "pron": "/sɪk liːv/"
      },
      {
        "word": "parental leave",
        "meaningVi": "nghỉ thai sản",
        "exampleSentence": "\"How long is parental leave?\"",
        "exampleMeaning": "\"Parental leave is 16 weeks paid.\"",
        "note": null,
        "pron": "/pəˈren.təl liːv/"
      },
      {
        "word": "a bank account",
        "meaningVi": "tài khoản ngân hàng",
        "exampleSentence": "\"Open a bank account.\"",
        "exampleMeaning": "\"A bank account is required for direct deposit.\"",
        "note": "Collocations: open a bank account",
        "pron": "/bæŋk əˈkaʊnt/"
      },
      {
        "word": "to deposit",
        "meaningVi": "gửi tiền",
        "exampleSentence": "\"I'll deposit the check.\"",
        "exampleMeaning": "\"Direct deposit is preferred.\"",
        "note": "Collocations: deposit into, direct deposit",
        "pron": "/dɪˈpɒz.ɪt/"
      },
      {
        "word": "to withdraw",
        "meaningVi": "rút tiền",
        "exampleSentence": "\"I need to withdraw cash.\"",
        "exampleMeaning": "\"Withdrawals are limited to $500/day.\"",
        "note": "Collocations: withdraw money",
        "pron": "/wɪðˈdrɔː/"
      },
      {
        "word": "a wire transfer",
        "meaningVi": "chuyển khoản",
        "exampleSentence": "\"I'll send a wire transfer.\"",
        "exampleMeaning": "\"Wire transfers incur a $25 fee.\"",
        "note": "Collocations: wire transfer fee",
        "pron": "/waɪər trænsˈfɜːr/"
      },
      {
        "word": "ACH",
        "meaningVi": "Automated Clearing House (chuyển khoản)",
        "exampleSentence": "\"ACH takes 3 days.\"",
        "exampleMeaning": "\"ACH payments are processed overnight.\"",
        "note": "Collocations: ACH transfer | Common mistake: Mỹ",
        "pron": "/eɪ siː eɪtʃ/"
      },
      {
        "word": "routing number",
        "meaningVi": "số routing (ngân hàng)",
        "exampleSentence": "\"What's your routing number?\"",
        "exampleMeaning": "\"The routing number identifies the bank.\"",
        "note": "Common mistake: Mỹ",
        "pron": "/ˈruː.tɪŋ ˈnʌm.bər/"
      },
      {
        "word": "a credit card",
        "meaningVi": "thẻ tín dụng",
        "exampleSentence": "\"I'll pay by credit card.\"",
        "exampleMeaning": "\"We accept all major credit cards.\"",
        "note": "Collocations: credit card debt",
        "pron": "/ˈkred.ɪt kɑːd/"
      },
      {
        "word": "a debit card",
        "meaningVi": "thẻ ghi nợ",
        "exampleSentence": "\"Use my debit card.\"",
        "exampleMeaning": "\"Debit cards withdraw directly from your account.\"",
        "note": null,
        "pron": "/ˈdeb.ɪt kɑːd/"
      },
      {
        "word": "an ATM",
        "meaningVi": "cây rút tiền",
        "exampleSentence": "\"Where's the nearest ATM?\"",
        "exampleMeaning": "\"ATM fees may apply.\"",
        "note": "Collocations: ATM fee, ATM withdrawal",
        "pron": "/eɪ tiː em/"
      },
      {
        "word": "a fee",
        "meaningVi": "phí",
        "exampleSentence": "\"Any fees?\"",
        "exampleMeaning": "\"A monthly fee of $5 applies.\"",
        "note": "Collocations: service fee, processing fee",
        "pron": "/fiː/"
      },
      {
        "word": "interest",
        "meaningVi": "lãi",
        "exampleSentence": "\"What's the interest rate?\"",
        "exampleMeaning": "\"Interest compounds annually.\"",
        "note": "Collocations: interest rate, earn interest",
        "pron": "/ˈɪn.trəst/"
      },
      {
        "word": "to save",
        "meaningVi": "tiết kiệm",
        "exampleSentence": "\"I'm saving for a trip.\"",
        "exampleMeaning": "\"Save at least 20% of your income.\"",
        "note": "Collocations: save money, save up",
        "pron": "/seɪv/"
      },
      {
        "word": "savings",
        "meaningVi": "tiền tiết kiệm",
        "exampleSentence": "\"I have some savings.\"",
        "exampleMeaning": "\"Maintain 6 months of emergency savings.\"",
        "note": "Collocations: savings account, savings goals",
        "pron": "/ˈseɪ.vɪŋz/"
      },
      {
        "word": "an expense",
        "meaningVi": "chi phí",
        "exampleSentence": "\"Track your expenses.\"",
        "exampleMeaning": "\"Business expenses must be approved.\"",
        "note": "Collocations: monthly expenses, track expenses",
        "pron": "/ɪkˈspens/"
      },
      {
        "word": "a budget",
        "meaningVi": "ngân sách",
        "exampleSentence": "\"I'm on a tight budget.\"",
        "exampleMeaning": "\"The marketing budget has been approved.\"",
        "note": "Collocations: tight budget, monthly budget",
        "pron": "/ˈbʌdʒ.ɪt/"
      },
      {
        "word": "to afford",
        "meaningVi": "có khả năng chi trả",
        "exampleSentence": "\"I can't afford it.\"",
        "exampleMeaning": "\"Can we afford to hire more?\"",
        "note": "Collocations: afford to | Common mistake: ❌ \"I can't afford to buy\" → ✅ OK, hoặc \"I can't afford it\"",
        "pron": "/əˈfɔːd/"
      },
      {
        "word": "expensive",
        "meaningVi": "đắt",
        "exampleSentence": "\"It's too expensive.\"",
        "exampleMeaning": "\"The plan is cost-prohibitive.\"",
        "note": "Collocations: too expensive",
        "pron": "/ɪkˈspen.sɪv/"
      },
      {
        "word": "cheap",
        "meaningVi": "rẻ (chất lượng có thể kém)",
        "exampleSentence": "\"It's super cheap.\"",
        "exampleMeaning": "\"Cheap doesn't always mean good value.\"",
        "note": "Collocations: cheap option",
        "pron": "/tʃiːp/"
      },
      {
        "word": "affordable",
        "meaningVi": "giá cả phải chăng",
        "exampleSentence": "\"It's affordable.\"",
        "exampleMeaning": "\"Affordable housing is a priority.\"",
        "note": "Collocations: affordable housing",
        "pron": "/əˈfɔː.də.bəl/"
      },
      {
        "word": "free",
        "meaningVi": "miễn phí",
        "exampleSentence": "\"It's free!\"",
        "exampleMeaning": "\"Free of charge.\"",
        "note": "Collocations: free of charge, for free",
        "pron": "/friː/"
      },
      {
        "word": "a discount",
        "meaningVi": "giảm giá",
        "exampleSentence": "\"Any discount?\"",
        "exampleMeaning": "\"We offer a 10% discount.\"",
        "note": "Collocations: discount code, student discount",
        "pron": "/ˈdɪs.kaʊnt/"
      },
      {
        "word": "a coupon",
        "meaningVi": "phiếu giảm giá",
        "exampleSentence": "\"Use this coupon.\"",
        "exampleMeaning": "\"Coupons cannot be combined.\"",
        "note": "Collocations: coupon code",
        "pron": "/ˈkuː.pɒn/"
      },
      {
        "word": "a refund",
        "meaningVi": "hoàn tiền",
        "exampleSentence": "\"I want a refund.\"",
        "exampleMeaning": "\"Refunds are processed within 5 days.\"",
        "note": "Collocations: request a refund, full refund",
        "pron": "/ˈriː.fʌnd/"
      },
      {
        "word": "to refund",
        "meaningVi": "hoàn tiền",
        "exampleSentence": "\"Can I get refunded?\"",
        "exampleMeaning": "\"We'll refund the full amount.\"",
        "note": "Collocations: refund policy",
        "pron": "/rɪˈfʌnd/"
      },
      {
        "word": "a receipt",
        "meaningVi": "biên lai",
        "exampleSentence": "\"Keep your receipt.\"",
        "exampleMeaning": "\"Receipts are required for refunds.\"",
        "note": "Collocations: keep the receipt",
        "pron": "/rɪˈsiːt/"
      },
      {
        "word": "to invest",
        "meaningVi": "đầu tư",
        "exampleSentence": "\"I want to invest.\"",
        "exampleMeaning": "\"Consider investing in index funds.\"",
        "note": "Collocations: invest in, long-term invest",
        "pron": "/ɪnˈvest/"
      },
      {
        "word": "a loan",
        "meaningVi": "khoản vay",
        "exampleSentence": "\"I need a loan.\"",
        "exampleMeaning": "\"Loan applications require a credit check.\"",
        "note": "Collocations: apply for a loan",
        "pron": "/ləʊn/"
      },
      {
        "word": "debt",
        "meaningVi": "nợ",
        "exampleSentence": "\"I'm in debt.\"",
        "exampleMeaning": "\"Pay off high-interest debt first.\"",
        "note": "Collocations: in debt, pay off debt",
        "pron": "/det/"
      },
      {
        "word": "a credit score",
        "meaningVi": "điểm tín dụng",
        "exampleSentence": "\"Check your credit score.\"",
        "exampleMeaning": "\"A good credit score is essential.\"",
        "note": "Collocations: good credit score",
        "pron": "/ˈkred.ɪt skɔːr/"
      },
      {
        "word": "a W-2",
        "meaningVi": "form thuế (Mỹ)",
        "exampleSentence": "\"When do I get my W-2?\"",
        "exampleMeaning": "\"W-2 forms are issued by January 31.\"",
        "note": "Common mistake: Mỹ, thuật ngữ thuế",
        "pron": "/ˈdʌb.əl.juː tuː/"
      },
      {
        "word": "a 1099",
        "meaningVi": "form freelance (Mỹ)",
        "exampleSentence": "\"I got a 1099.\"",
        "exampleMeaning": "\"1099 contractors are self-employed.\"",
        "note": "Collocations: 1099 contractor | Common mistake: Mỹ",
        "pron": "/wʌn θaʊ.zænd naɪn.naɪn.ti.naɪn/"
      }
    ]
  },
  {
    "name": "Meeting & sync",
    "icon": "🗓️",
    "words": [
      {
        "word": "to sync up",
        "meaningVi": "đồng bộ, họp nhanh",
        "exampleSentence": "\"Let's sync up later.\"",
        "exampleMeaning": "\"Let's schedule a sync to align on priorities.\"",
        "note": "Collocations: quick sync, sync up on",
        "pron": "/sɪŋk ʌp/"
      },
      {
        "word": "to align",
        "meaningVi": "thống nhất quan điểm",
        "exampleSentence": "\"Let's align on this.\"",
        "exampleMeaning": "\"We need to align our goals.\"",
        "note": "Collocations: align on, align with, get aligned",
        "pron": "/əˈlaɪn/"
      },
      {
        "word": "to circle back",
        "meaningVi": "quay lại (sau)",
        "exampleSentence": "\"Let's circle back tomorrow.\"",
        "exampleMeaning": "\"I'll circle back with the team by EOD.\"",
        "note": "Collocations: circle back on, circle back later",
        "pron": "/ˈsɜː.kəl bæk/"
      },
      {
        "word": "to follow up",
        "meaningVi": "theo dõi tiếp",
        "exampleSentence": "\"I'll follow up on that.\"",
        "exampleMeaning": "\"I'll follow up with HR regarding your request.\"",
        "note": "Collocations: follow up with, follow up on",
        "pron": "/ˈfɒl.əʊ ʌp/"
      },
      {
        "word": "to loop in",
        "meaningVi": "thêm người vào (cuộc thảo luận)",
        "exampleSentence": "\"Can you loop me in?\"",
        "exampleMeaning": "\"Please loop in the legal team.\"",
        "note": "Collocations: loop in on, keep looped in",
        "pron": "/luːp ɪn/"
      },
      {
        "word": "to ping",
        "meaningVi": "liên lạc nhanh",
        "exampleSentence": "\"Ping me when done.\"",
        "exampleMeaning": "\"Please ping me if you have questions.\"",
        "note": "Collocations: ping someone, ping back",
        "pron": "/pɪŋ/"
      },
      {
        "word": "a ping",
        "meaningVi": "tin nhắn nhắc",
        "exampleSentence": "\"Send me a ping.\"",
        "exampleMeaning": "\"I'll send a ping to remind them.\"",
        "note": "Collocations: receive a ping",
        "pron": "/pɪŋ/"
      },
      {
        "word": "to reach out",
        "meaningVi": "liên hệ",
        "exampleSentence": "\"I'll reach out to her.\"",
        "exampleMeaning": "\"Please reach out to the vendor directly.\"",
        "note": "Collocations: reach out to, reach out about",
        "pron": "/riːtʃ aʊt/"
      },
      {
        "word": "to touch base",
        "meaningVi": "chạm nhẹ, cập nhật nhanh",
        "exampleSentence": "\"Let's touch base tomorrow.\"",
        "exampleMeaning": "\"I'd like to touch base on the project status.\"",
        "note": "Collocations: touch base on, touch base with",
        "pron": "/tʌtʃ beɪs/"
      },
      {
        "word": "to check in",
        "meaningVi": "kiểm tra, hỏi thăm",
        "exampleSentence": "\"Let's check in later.\"",
        "exampleMeaning": "\"Weekly check-ins are scheduled.\"",
        "note": "Collocations: check in with, check in on",
        "pron": "/tʃek ɪn/"
      },
      {
        "word": "bandwidth",
        "meaningVi": "năng lực xử lý công việc",
        "exampleSentence": "\"I don't have bandwidth.\"",
        "exampleMeaning": "\"Current bandwidth is limited.\"",
        "note": "Collocations: have bandwidth, no bandwidth | Common mistake: ⚠️ Metaphor: \"I don't have bandwidth for this\"",
        "pron": "/ˈbænd.wɪdθ/"
      },
      {
        "word": "a deliverable",
        "meaningVi": "sản phẩm bàn giao",
        "exampleSentence": "\"What's the deliverable?\"",
        "exampleMeaning": "\"The deliverable is due Friday.\"",
        "note": "Collocations: key deliverable, final deliverable",
        "pron": "/dɪˈlɪv.ər.ə.bəl/"
      },
      {
        "word": "to ship",
        "meaningVi": "phát hành, bàn giao",
        "exampleSentence": "\"Let's ship it!\"",
        "exampleMeaning": "\"We'll ship the feature next sprint.\"",
        "note": "Collocations: ship it, ship by | Common mistake: Casual",
        "pron": "/ʃɪp/"
      },
      {
        "word": "to push back",
        "meaningVi": "phản đối nhẹ, đẩy lại",
        "exampleSentence": "\"I'm going to push back on that.\"",
        "exampleMeaning": "\"I'd like to push back on the timeline.\"",
        "note": "Collocations: push back on, push back against",
        "pron": "/pʊʃ bæk/"
      },
      {
        "word": "to escalate",
        "meaningVi": "leo thang (vấn đề)",
        "exampleSentence": "\"Let's escalate this.\"",
        "exampleMeaning": "\"We need to escalate to the manager.\"",
        "note": "Collocations: escalate to, escalate the issue",
        "pron": "/ˈes.kə.leɪt/"
      },
      {
        "word": "a blocker",
        "meaningVi": "vật cản",
        "exampleSentence": "\"I have a blocker.\"",
        "exampleMeaning": "\"Please flag any blockers immediately.\"",
        "note": "Collocations: main blocker, unblocker",
        "pron": "/ˈblɒk.ər/"
      },
      {
        "word": "to unblock",
        "meaningVi": "tháo gỡ",
        "exampleSentence": "\"Let me unblock you.\"",
        "exampleMeaning": "\"I unblocked the team with the API key.\"",
        "note": "Collocations: unblock someone, unblock progress",
        "pron": "/ʌnˈblɒk/"
      },
      {
        "word": "to flag",
        "meaningVi": "đánh dấu, báo cáo",
        "exampleSentence": "\"Flag this for review.\"",
        "exampleMeaning": "\"Please flag any issues you find.\"",
        "note": "Collocations: flag a bug, flag for review",
        "pron": "/flæɡ/"
      },
      {
        "word": "to bubble up",
        "meaningVi": "đẩy lên cấp trên",
        "exampleSentence": "\"Let me bubble this up.\"",
        "exampleMeaning": "\"I'll bubble this up to leadership.\"",
        "note": "Collocations: bubble up to",
        "pron": "/ˈbʌb.əl ʌp/"
      },
      {
        "word": "a stakeholder",
        "meaningVi": "bên liên quan",
        "exampleSentence": "\"Who's the stakeholder?\"",
        "exampleMeaning": "\"Stakeholders must approve the scope.\"",
        "note": "Collocations: key stakeholder, internal stakeholder",
        "pron": "/ˈsteɪk.həʊl.dər/"
      },
      {
        "word": "an ask",
        "meaningVi": "yêu cầu",
        "exampleSentence": "\"I have an ask.\"",
        "exampleMeaning": "\"I have an ask regarding the timeline.\"",
        "note": "Collocations: have an ask, the ask | Common mistake: Casual",
        "pron": "/ɑːsk/"
      },
      {
        "word": "a quick win",
        "meaningVi": "thắng lợi nhanh",
        "exampleSentence": "\"That's a quick win.\"",
        "exampleMeaning": "\"Let's identify some quick wins.\"",
        "note": null,
        "pron": "/kwɪk wɪn/"
      },
      {
        "word": "low-hanging fruit",
        "meaningVi": "việc dễ làm trước",
        "exampleSentence": "\"Start with low-hanging fruit.\"",
        "exampleMeaning": "\"Let's tackle the low-hanging fruit first.\"",
        "note": "Common mistake: ⚠️ Idiomatic",
        "pron": "/ləʊ ˈhæŋ.ɪŋ fruːt/"
      },
      {
        "word": "the bigger picture",
        "meaningVi": "bức tranh toàn cảnh",
        "exampleSentence": "\"Look at the bigger picture.\"",
        "exampleMeaning": "\"We need to consider the bigger picture.\"",
        "note": "Collocations: see the bigger picture",
        "pron": "/ðə ˈbɪɡ.ə ˈpɪk.tʃər/"
      },
      {
        "word": "deep dive",
        "meaningVi": "phân tích sâu",
        "exampleSentence": "\"Let's do a deep dive.\"",
        "exampleMeaning": "\"We'll schedule a deep dive next week.\"",
        "note": "Collocations: deep dive into",
        "pron": "/diːp daɪv/"
      },
      {
        "word": "to dive into",
        "meaningVi": "tìm hiểu sâu",
        "exampleSentence": "\"I'll dive into this.\"",
        "exampleMeaning": "\"Let's dive into the technical details.\"",
        "note": "Collocations: dive into the details",
        "pron": "/daɪv ˈɪn.tuː/"
      },
      {
        "word": "to walk through",
        "meaningVi": "đi qua từng bước",
        "exampleSentence": "\"Let me walk you through it.\"",
        "exampleMeaning": "\"I'll walk you through the architecture.\"",
        "note": "Collocations: walk through the code",
        "pron": "/wɔːk θruː/"
      },
      {
        "word": "to go over",
        "meaningVi": "xem lại, kiểm tra",
        "exampleSentence": "\"Let's go over this.\"",
        "exampleMeaning": "\"Let's go over the requirements.\"",
        "note": "Collocations: go over the plan",
        "pron": "/ɡəʊ ˈəʊ.vər/"
      },
      {
        "word": "to run through",
        "meaningVi": "chạy qua (nhanh)",
        "exampleSentence": "\"Let me run through this.\"",
        "exampleMeaning": "\"I'll run through the agenda.\"",
        "note": "Collocations: run through quickly",
        "pron": "/rʌn θruː/"
      },
      {
        "word": "to recap",
        "meaningVi": "tóm tắt lại",
        "exampleSentence": "\"Quick recap...\"",
        "exampleMeaning": "\"Let me recap what we discussed.\"",
        "note": "Collocations: quick recap",
        "pron": "/riːˈkæp/"
      },
      {
        "word": "to summarize",
        "meaningVi": "tóm tắt",
        "exampleSentence": "\"To summarize...\"",
        "exampleMeaning": "\"To summarize the meeting outcomes...\"",
        "note": null,
        "pron": "/ˈsʌm.ər.aɪz/"
      },
      {
        "word": "TL;DR",
        "meaningVi": "Too Long; Didn't Read — tóm tắt cực gọn",
        "exampleSentence": "\"TL;DR — we ship Friday.\"",
        "exampleMeaning": "\"Please provide a TL;DR for executives.\"",
        "note": "Common mistake: Phát âm: tê-ell-dee-ar",
        "pron": "/tiː el dɪ ɑːr/"
      },
      {
        "word": "FYI",
        "meaningVi": "For Your Information",
        "exampleSentence": "\"FYI, the meeting moved.\"",
        "exampleMeaning": "\"FYI, the deadline has changed.\"",
        "note": null,
        "pron": "/ef waɪ aɪ/"
      },
      {
        "word": "EOD",
        "meaningVi": "End Of Day",
        "exampleSentence": "\"I'll have it by EOD.\"",
        "exampleMeaning": "\"Please submit your report by EOD.\"",
        "note": "Collocations: by EOD, EOD Friday",
        "pron": "/iː əʊ diː/"
      },
      {
        "word": "ASAP",
        "meaningVi": "As Soon As Possible",
        "exampleSentence": "\"Need this ASAP.\"",
        "exampleMeaning": "\"Please prioritize this ASAP.\"",
        "note": null,
        "pron": "/eɪ es eɪ piː/"
      },
      {
        "word": "TBD / TBA",
        "meaningVi": "To Be Determined / Announced",
        "exampleSentence": "\"The date is TBD.\"",
        "exampleMeaning": "\"Location is TBA.\"",
        "note": null,
        "pron": "/tiː biː diː/ /tiː biː eɪ/"
      },
      {
        "word": "ETA",
        "meaningVi": "Estimated Time of Arrival",
        "exampleSentence": "\"ETA is 30 minutes.\"",
        "exampleMeaning": "\"Please provide an ETA for completion.\"",
        "note": "Collocations: what's the ETA",
        "pron": "/iː tiː eɪ/"
      },
      {
        "word": "OOO",
        "meaningVi": "Out Of Office",
        "exampleSentence": "\"I'm OOO tomorrow.\"",
        "exampleMeaning": "\"I will be OOO from Friday to Monday.\"",
        "note": "Collocations: OOO message",
        "pron": "/əʊ əʊ əʊ/"
      },
      {
        "word": "PTO",
        "meaningVi": "Paid Time Off",
        "exampleSentence": "\"I'm on PTO.\"",
        "exampleMeaning": "\"I have PTO scheduled for next week.\"",
        "note": "Collocations: use PTO, take PTO",
        "pron": "/piː tiː əʊ/"
      },
      {
        "word": "WFH",
        "meaningVi": "Work From Home",
        "exampleSentence": "\"I'll WFH today.\"",
        "exampleMeaning": "\"WFH policy allows 3 days per week.\"",
        "note": null,
        "pron": "/dʌb.əl.juː ef eɪtʃ/"
      },
      {
        "word": "RTO",
        "meaningVi": "Return To Office",
        "exampleSentence": "\"RTO is mandatory now.\"",
        "exampleMeaning": "\"RTO policy starts next quarter.\"",
        "note": "Collocations: RTO mandate",
        "pron": "/ɑː tiː əʊ/"
      },
      {
        "word": "a heads up",
        "meaningVi": "báo trước",
        "exampleSentence": "\"Heads up — meeting moved.\"",
        "exampleMeaning": "\"Just a heads up on the schedule change.\"",
        "note": "Collocations: give a heads up, quick heads up",
        "pron": "/hedz ʌp/"
      },
      {
        "word": "to fill in",
        "meaningVi": "cập nhật thông tin",
        "exampleSentence": "\"I'll fill you in.\"",
        "exampleMeaning": "\"Please fill in the details.\"",
        "note": "Collocations: fill in on, fill in for",
        "pron": "/fɪl ɪn/"
      },
      {
        "word": "to fill in for",
        "meaningVi": "thay thế (người)",
        "exampleSentence": "\"Can you fill in for me?\"",
        "exampleMeaning": "\"I'll fill in for John during his leave.\"",
        "note": "Collocations: fill in for someone",
        "pron": "/fɪl ɪn fɔːr/"
      },
      {
        "word": "to back up",
        "meaningVi": "hỗ trợ",
        "exampleSentence": "\"I've got your back.\"",
        "exampleMeaning": "\"Thank you for backing me up in the meeting.\"",
        "note": "Collocations: back me up, back someone up",
        "pron": "/bæk ʌp/"
      },
      {
        "word": "to step in",
        "meaningVi": "tham gia giúp",
        "exampleSentence": "\"I'll step in if needed.\"",
        "exampleMeaning": "\"Could you step in for the demo?\"",
        "note": "Collocations: step in for, step in when",
        "pron": "/step ɪn/"
      },
      {
        "word": "to take over",
        "meaningVi": "tiếp quản",
        "exampleSentence": "\"I'll take it from here.\"",
        "exampleMeaning": "\"Could you take over the project?\"",
        "note": "Collocations: take over from",
        "pron": "/teɪk ˈəʊ.vər/"
      },
      {
        "word": "to hand off",
        "meaningVi": "bàn giao",
        "exampleSentence": "\"I'll hand this off.\"",
        "exampleMeaning": "\"Let's schedule a proper hand-off.\"",
        "note": "Collocations: hand off to, smooth hand-off",
        "pron": "/hænd ɒf/"
      },
      {
        "word": "to hand over",
        "meaningVi": "chuyển giao",
        "exampleSentence": "\"Time to hand over.\"",
        "exampleMeaning": "\"Please hand over the documentation.\"",
        "note": "Collocations: hand over to",
        "pron": "/hænd ˈəʊ.vər/"
      },
      {
        "word": "to drop the ball",
        "meaningVi": "làm hỏng việc (vì quên/sơ suất)",
        "exampleSentence": "\"I dropped the ball on that.\"",
        "exampleMeaning": "\"We can't drop the ball on this deliverable.\"",
        "note": "Collocations: drop the ball on | Common mistake: ⚠️ Idiomatic",
        "pron": "/drɒp ðə bɔːl/"
      },
      {
        "word": "a fire drill",
        "meaningVi": "tình huống khẩn cấp bất ngờ",
        "exampleSentence": "\"Another fire drill!\"",
        "exampleMeaning": "\"We need to minimize fire drills.\"",
        "note": "Collocations: urgent fire drill | Common mistake: ⚠️ Metaphor",
        "pron": "/ˈfaɪər drɪl/"
      },
      {
        "word": "to put out a fire",
        "meaningVi": "dập lửa (giải quyết khẩn)",
        "exampleSentence": "\"I'm putting out fires.\"",
        "exampleMeaning": "\"We're putting out fires today.\"",
        "note": "Collocations: put out fires | Common mistake: ⚠️ Metaphor",
        "pron": "/pʊt aʊt ə ˈfaɪər/"
      },
      {
        "word": "on the same page",
        "meaningVi": "cùng quan điểm",
        "exampleSentence": "\"Are we on the same page?\"",
        "exampleMeaning": "\"Let's ensure we're on the same page.\"",
        "note": "Collocations: get on the same page",
        "pron": "/ɒn ðə seɪm peɪdʒ/"
      },
      {
        "word": "to be on board",
        "meaningVi": "đồng ý tham gia",
        "exampleSentence": "\"I'm on board.\"",
        "exampleMeaning": "\"Is the team on board with this approach?\"",
        "note": "Collocations: get on board, fully on board",
        "pron": "/bi ɒn bɔːd/"
      },
      {
        "word": "to get buy-in",
        "meaningVi": "có sự đồng thuận",
        "exampleSentence": "\"I need buy-in first.\"",
        "exampleMeaning": "\"We need executive buy-in before proceeding.\"",
        "note": "Collocations: get buy-in from",
        "pron": "/ɡet ˈbaɪ.ɪn/"
      },
      {
        "word": "to move forward",
        "meaningVi": "tiến tới",
        "exampleSentence": "\"Let's move forward.\"",
        "exampleMeaning": "\"We can move forward with the proposal.\"",
        "note": "Collocations: move forward with",
        "pron": "/muːv ˈfɔː.wəd/"
      },
      {
        "word": "to greenlight",
        "meaningVi": "phê duyệt",
        "exampleSentence": "\"Approved! Greenlit!\"",
        "exampleMeaning": "\"The project has been greenlit.\"",
        "note": "Collocations: greenlight a project",
        "pron": "/ˈɡriːn.laɪt/"
      },
      {
        "word": "to table",
        "meaningVi": "hoãn lại (chưa thảo luận)",
        "exampleSentence": "\"Let's table this.\"",
        "exampleMeaning": "\"I'll table this discussion for now.\"",
        "note": "Collocations: table the discussion | Common mistake: ⚠️ Mỹ: tabled = delayed; Anh: tabled = đưa ra thảo luận",
        "pron": "/ˈteɪ.bəl/"
      },
      {
        "word": "to take offline",
        "meaningVi": "thảo luận riêng (không phải trong meeting)",
        "exampleSentence": "\"Let's take this offline.\"",
        "exampleMeaning": "\"We'll take this issue offline.\"",
        "note": "Collocations: take it offline",
        "pron": "/teɪk ˈɒf.laɪn/"
      },
      {
        "word": "to nail down",
        "meaningVi": "chốt lại",
        "exampleSentence": "\"Let's nail down the details.\"",
        "exampleMeaning": "\"We need to nail down the requirements.\"",
        "note": "Collocations: nail down the details",
        "pron": "/neɪl daʊn/"
      },
      {
        "word": "to lock in",
        "meaningVi": "chốt cứng",
        "exampleSentence": "\"Let's lock in the date.\"",
        "exampleMeaning": "\"We'll lock in the schedule by Friday.\"",
        "note": "Collocations: lock in the deal",
        "pron": "/lɒk ɪn/"
      },
      {
        "word": "to firm up",
        "meaningVi": "làm chắc chắn hơn",
        "exampleSentence": "\"Let's firm up the plan.\"",
        "exampleMeaning": "\"We need to firm up the timeline.\"",
        "note": "Collocations: firm up the details",
        "pron": "/fɜːm ʌp/"
      },
      {
        "word": "a rough estimate",
        "meaningVi": "ước lượng sơ bộ",
        "exampleSentence": "\"Rough estimate is 2 weeks.\"",
        "exampleMeaning": "\"A rough estimate should suffice for now.\"",
        "note": "Collocations: rough estimate",
        "pron": "/rʌf ˈes.tɪ.mət/"
      },
      {
        "word": "a ballpark",
        "meaningVi": "khoảng, xấp xỉ",
        "exampleSentence": "\"In the ballpark of $5k.\"",
        "exampleMeaning": "\"Could you give a ballpark figure?\"",
        "note": "Collocations: ballpark figure, ballpark number",
        "pron": "/ˈbɔːl.pɑːk/"
      },
      {
        "word": "to throw under the bus",
        "meaningVi": "đổ lỗi cho người khác",
        "exampleSentence": "\"He threw me under the bus.\"",
        "exampleMeaning": "\"Don't throw teammates under the bus.\"",
        "note": "Collocations: throw someone under the bus | Common mistake: ⚠️ Negative — đừng dùng",
        "pron": "/θrəʊ ˈʌn.də ðə bʌs/"
      },
      {
        "word": "to be in the weeds",
        "meaningVi": "đang bận sâu với chi tiết",
        "exampleSentence": "\"Sorry, I'm in the weeds.\"",
        "exampleMeaning": "\"We're in the weeds on this implementation.\"",
        "note": "Collocations: in the weeds on",
        "pron": "/bi ɪn ðə wiːdz/"
      },
      {
        "word": "to zoom out",
        "meaningVi": "nhìn bao quát",
        "exampleSentence": "\"Let's zoom out.\"",
        "exampleMeaning": "\"Zooming out, what's the strategy?\"",
        "note": "Collocations: zoom out on",
        "pron": "/zuːm aʊt/"
      },
      {
        "word": "to drill down",
        "meaningVi": "đi sâu vào chi tiết",
        "exampleSentence": "\"Let's drill down on this.\"",
        "exampleMeaning": "\"Drill down into the metrics.\"",
        "note": "Collocations: drill down on",
        "pron": "/drɪl daʊn/"
      },
      {
        "word": "to take a step back",
        "meaningVi": "lùi lại một bước",
        "exampleSentence": "\"Let's take a step back.\"",
        "exampleMeaning": "\"Could we take a step back and reconsider?\"",
        "note": "Collocations: take a step back",
        "pron": "/teɪk ə step bæk/"
      },
      {
        "word": "to set the stage",
        "meaningVi": "chuẩn bị nền tảng",
        "exampleSentence": "\"Let me set the stage.\"",
        "exampleMeaning": "\"Let me set the stage for this discussion.\"",
        "note": "Collocations: set the stage for",
        "pron": "/set ðə steɪdʒ/"
      },
      {
        "word": "to kick off",
        "meaningVi": "bắt đầu",
        "exampleSentence": "\"Let's kick off the meeting.\"",
        "exampleMeaning": "\"We'll kick off the project next week.\"",
        "note": "Collocations: kick off the sprint",
        "pron": "/kɪk ɒf/"
      },
      {
        "word": "to wrap up",
        "meaningVi": "kết thúc",
        "exampleSentence": "\"Let's wrap up.\"",
        "exampleMeaning": "\"We need to wrap up by 5 PM.\"",
        "note": "Collocations: wrap up the meeting",
        "pron": "/ræp ʌp/"
      },
      {
        "word": "to call it a day",
        "meaningVi": "kết thúc ngày làm việc",
        "exampleSentence": "\"Let's call it a day.\"",
        "exampleMeaning": "\"I think we should call it a day here.\"",
        "note": "Common mistake: Casual",
        "pron": "/kɔːl ɪt ə deɪ/"
      },
      {
        "word": "action items",
        "meaningVi": "các việc cần làm",
        "exampleSentence": "\"Action items?\"",
        "exampleMeaning": "\"Please list the action items.\"",
        "note": "Collocations: key action items, follow up on action items",
        "pron": "/ˈæk.ʃən ˈaɪ.təmz/"
      },
      {
        "word": "an owner",
        "meaningVi": "người chịu trách nhiệm",
        "exampleSentence": "\"Who's the owner?\"",
        "exampleMeaning": "\"Each action item needs an owner.\"",
        "note": "Collocations: task owner, project owner",
        "pron": "/ˈəʊ.nər/"
      },
      {
        "word": "RACI",
        "meaningVi": "Responsible, Accountable, Consulted, Informed",
        "exampleSentence": "\"Let's clarify the RACI.\"",
        "exampleMeaning": "\"Please update the RACI matrix.\"",
        "note": "Collocations: RACI matrix",
        "pron": "/reɪ siː aɪ/"
      },
      {
        "word": "an OKR",
        "meaningVi": "Objectives and Key Results",
        "exampleSentence": "\"What are this quarter's OKRs?\"",
        "exampleMeaning": "\"OKRs are reviewed monthly.\"",
        "note": "Collocations: set OKRs",
        "pron": "/əʊ keɪ ɑːr/"
      },
      {
        "word": "a KPI",
        "meaningVi": "Key Performance Indicator",
        "exampleSentence": "\"What's our KPI?\"",
        "exampleMeaning": "\"KPIs must be measurable.\"",
        "note": "Collocations: track KPI",
        "pron": "/keɪ piː aɪ/"
      },
      {
        "word": "a sprint demo",
        "meaningVi": "demo cuối sprint",
        "exampleSentence": "\"When's the sprint demo?\"",
        "exampleMeaning": "\"Sprint demos are held bi-weekly.\"",
        "note": "Collocations: demo the feature",
        "pron": "/sprɪnt ˈdem.əʊ/"
      }
    ]
  },
  {
    "name": "Phrasal verbs",
    "icon": "🔗",
    "words": [
      {
        "word": "figure out",
        "meaningVi": "tìm ra, hiểu được",
        "exampleSentence": "\"I'll figure it out.\"",
        "exampleMeaning": "\"We need to figure out the root cause.\"",
        "note": "Example: \"Did you figure out the bug?\"",
        "pron": "/ˈfɪɡ.ər aʊt/"
      },
      {
        "word": "find out",
        "meaningVi": "phát hiện, biết được",
        "exampleSentence": "\"I just found out.\"",
        "exampleMeaning": "\"We found out the deadline moved.\"",
        "note": "Example: \"Find out who broke the build.\"",
        "pron": "/faɪnd aʊt/"
      },
      {
        "word": "point out",
        "meaningVi": "chỉ ra",
        "exampleSentence": "\"Just pointing out...\"",
        "exampleMeaning": "\"I'd like to point out a potential issue.\"",
        "note": "Example: \"He pointed out a typo.\"",
        "pron": "/pɔɪnt aʊt/"
      },
      {
        "word": "come up with",
        "meaningVi": "nghĩ ra",
        "exampleSentence": "\"I came up with an idea.\"",
        "exampleMeaning": "\"We came up with a new approach.\"",
        "note": "Example: \"Can you come up with a better name?\"",
        "pron": "/kʌm ʌp wɪð/"
      },
      {
        "word": "look into",
        "meaningVi": "điều tra, tìm hiểu",
        "exampleSentence": "\"I'll look into it.\"",
        "exampleMeaning": "\"We'll look into the issue immediately.\"",
        "note": "Example: \"Can you look into this bug?\"",
        "pron": "/lʊk ˈɪn.tuː/"
      },
      {
        "word": "look up",
        "meaningVi": "tra cứu",
        "exampleSentence": "\"Let me look it up.\"",
        "exampleMeaning": "\"Please look up the documentation.\"",
        "note": "Example: \"Look up the API reference.\"",
        "pron": "/lʊk ʌp/"
      },
      {
        "word": "look over",
        "meaningVi": "xem lại",
        "exampleSentence": "\"I'll look it over.\"",
        "exampleMeaning": "\"Please look over my PR.\"",
        "note": "Example: \"Look over this report.\"",
        "pron": "/lʊk ˈəʊ.vər/"
      },
      {
        "word": "look forward to",
        "meaningVi": "mong đợi",
        "exampleSentence": "\"Looking forward to it!\"",
        "exampleMeaning": "\"I look forward to your response.\"",
        "note": "Example: \"Looking forward to the meeting.\"",
        "pron": "/lʊk ˈfɔː.wəd tuː/"
      },
      {
        "word": "go over",
        "meaningVi": "xem lại (kỹ)",
        "exampleSentence": "\"Let's go over it.\"",
        "exampleMeaning": "\"Let's go over the requirements.\"",
        "note": "Example: \"Go over the code once more.\"",
        "pron": "/ɡəʊ ˈəʊ.vər/"
      },
      {
        "word": "go through",
        "meaningVi": "trải qua, xem qua",
        "exampleSentence": "\"Going through docs.\"",
        "exampleMeaning": "\"We went through several iterations.\"",
        "note": "Example: \"Going through the codebase.\"",
        "pron": "/ɡəʊ θruː/"
      },
      {
        "word": "set up",
        "meaningVi": "thiết lập",
        "exampleSentence": "\"Set it up.\"",
        "exampleMeaning": "\"Please set up the development environment.\"",
        "note": "Example: \"I'll set up the meeting.\"",
        "pron": "/set ʌp/"
      },
      {
        "word": "break down",
        "meaningVi": "phân tích, chia nhỏ",
        "exampleSentence": "\"Break it down for me.\"",
        "exampleMeaning": "\"Please break down the requirements.\"",
        "note": "Example: \"Break down the problem into steps.\"",
        "pron": "/breɪk daʊn/"
      },
      {
        "word": "catch up",
        "meaningVi": "bắt kịp, cập nhật",
        "exampleSentence": "\"Catch me up?\"",
        "exampleMeaning": "\"Let me catch up on the latest changes.\"",
        "note": "Example: \"Need to catch up on emails.\"",
        "pron": "/kætʃ ʌp/"
      },
      {
        "word": "speed up",
        "meaningVi": "tăng tốc",
        "exampleSentence": "\"Speed it up!\"",
        "exampleMeaning": "\"We need to speed up the process.\"",
        "note": "Example: \"Speed up the CI pipeline.\"",
        "pron": "/spiːd ʌp/"
      },
      {
        "word": "slow down",
        "meaningVi": "chậm lại",
        "exampleSentence": "\"Slow down a sec.\"",
        "exampleMeaning": "\"Let's slow down and think this through.\"",
        "note": "Example: \"Slow down on the design.\"",
        "pron": "/sləʊ daʊn/"
      },
      {
        "word": "bring up",
        "meaningVi": "đưa ra (vấn đề)",
        "exampleSentence": "\"Bring it up in standup.\"",
        "exampleMeaning": "\"I'll bring this up with management.\"",
        "note": "Example: \"Don't bring up politics.\"",
        "pron": "/brɪŋ ʌp/"
      },
      {
        "word": "bring in",
        "meaningVi": "mời vào, đưa vào",
        "exampleSentence": "\"Bring them in.\"",
        "exampleMeaning": "\"We brought in a consultant.\"",
        "note": "Example: \"Bring in a designer for review.\"",
        "pron": "/brɪŋ ɪn/"
      },
      {
        "word": "call in",
        "meaningVi": "gọi vào (gọi điện/xin nghỉ)",
        "exampleSentence": "\"I'll call in.\"",
        "exampleMeaning": "\"Please call in before 9 AM if sick.\"",
        "note": "Example: \"Call in sick / Call in a meeting.\"",
        "pron": "/kɔːl ɪn/"
      },
      {
        "word": "call back",
        "meaningVi": "gọi lại",
        "exampleSentence": "\"I'll call you back.\"",
        "exampleMeaning": "\"Could you call back in 10 minutes?\"",
        "note": "Example: \"Call back when you're free.\"",
        "pron": "/kɔːl bæk/"
      },
      {
        "word": "follow up",
        "meaningVi": "theo dõi tiếp",
        "exampleSentence": "\"Follow up on that.\"",
        "exampleMeaning": "\"Please follow up with the client.\"",
        "note": "Example: \"Follow up tomorrow.\"",
        "pron": "/ˈfɒl.əʊ ʌp/"
      },
      {
        "word": "hand in",
        "meaningVi": "nộp (báo cáo, đơn)",
        "exampleSentence": "\"Hand it in Friday.\"",
        "exampleMeaning": "\"Please hand in your report by Monday.\"",
        "note": "Example: \"Hand in your timesheet.\"",
        "pron": "/hænd ɪn/"
      },
      {
        "word": "hand over",
        "meaningVi": "bàn giao",
        "exampleSentence": "\"I'll hand it over.\"",
        "exampleMeaning": "\"Please hand over the project documentation.\"",
        "note": "Example: \"Hand over to the next shift.\"",
        "pron": "/hænd ˈəʊ.vər/"
      },
      {
        "word": "take over",
        "meaningVi": "tiếp quản",
        "exampleSentence": "\"I'll take over.\"",
        "exampleMeaning": "\"Could you take over the project?\"",
        "note": "Example: \"Take over from John.\"",
        "pron": "/teɪk ˈəʊ.vər/"
      },
      {
        "word": "take off",
        "meaningVi": "nghỉ (ngày), cất cánh",
        "exampleSentence": "\"Taking Friday off.\"",
        "exampleMeaning": "\"I'd like to take off next Monday.\"",
        "note": "Example: \"Take off = ngày nghỉ có/không lương\"",
        "pron": "/teɪk ɒf/"
      },
      {
        "word": "take up",
        "meaningVi": "bắt đầu (sở thích), thảo luận",
        "exampleSentence": "\"I took up coding.\"",
        "exampleMeaning": "\"I'll take this up with the team.\"",
        "note": "Example: \"Take up a new hobby.\"",
        "pron": "/teɪk ʌp/"
      },
      {
        "word": "take on",
        "meaningVi": "nhận (việc), thuê",
        "exampleSentence": "\"I'll take it on.\"",
        "exampleMeaning": "\"We need to take on more engineers.\"",
        "note": "Example: \"Take on a new project.\"",
        "pron": "/teɪk ɒn/"
      },
      {
        "word": "put off",
        "meaningVi": "trì hoãn",
        "exampleSentence": "\"Don't put it off.\"",
        "exampleMeaning": "\"Please don't put off the meeting.\"",
        "note": "Example: \"Put off the launch.\"",
        "pron": "/pʊt ɒf/"
      },
      {
        "word": "put together",
        "meaningVi": "tập hợp, ghép lại",
        "exampleSentence": "\"Let me put it together.\"",
        "exampleMeaning": "\"Please put together a proposal.\"",
        "note": "Example: \"Put together a presentation.\"",
        "pron": "/pʊt təˈɡeð.ər/"
      },
      {
        "word": "run into",
        "meaningVi": "gặp phải (vấn đề), tình cờ gặp",
        "exampleSentence": "\"I ran into a bug.\"",
        "exampleMeaning": "\"We ran into several issues.\"",
        "note": "Example: \"Run into someone at the conference.\"",
        "pron": "/rʌn ˈɪn.tuː/"
      },
      {
        "word": "run over",
        "meaningVi": "chạy quá (thời gian)",
        "exampleSentence": "\"The meeting ran over.\"",
        "exampleMeaning": "\"The presentation ran over by 10 minutes.\"",
        "note": "Example: \"Run over the time limit.\"",
        "pron": "/rʌn ˈəʊ.vər/"
      },
      {
        "word": "run by",
        "meaningVi": "hỏi ý kiến (nhanh)",
        "exampleSentence": "\"Let me run this by you.\"",
        "exampleMeaning": "\"Could I run this idea by you?\"",
        "note": "Example: \"Run it by the manager first.\"",
        "pron": "/rʌn baɪ/"
      },
      {
        "word": "run through",
        "meaningVi": "chạy qua (nhanh)",
        "exampleSentence": "\"Let me run through this.\"",
        "exampleMeaning": "\"I'll run through the agenda.\"",
        "note": "Example: \"Run through the slide deck.\"",
        "pron": "/rʌn θruː/"
      },
      {
        "word": "sign off on",
        "meaningVi": "phê duyệt",
        "exampleSentence": "\"Manager signed off.\"",
        "exampleMeaning": "\"Please sign off on the design.\"",
        "note": "Example: \"Get approval — sign off on X.\"",
        "pron": "/saɪn ɒf ɒn/"
      },
      {
        "word": "sign up for",
        "meaningVi": "đăng ký",
        "exampleSentence": "\"Sign up for the workshop.\"",
        "exampleMeaning": "\"Please sign up for benefits by Friday.\"",
        "note": "Example: \"Sign up for the newsletter.\"",
        "pron": "/saɪn ʌp fɔːr/"
      },
      {
        "word": "log in",
        "meaningVi": "đăng nhập",
        "exampleSentence": "\"Log in to the dashboard.\"",
        "exampleMeaning": "\"Please log in to the VPN.\"",
        "note": "Example: \"Can't log in.\"",
        "pron": "/lɒɡ ɪn/"
      },
      {
        "word": "log out",
        "meaningVi": "đăng xuất",
        "exampleSentence": "\"Log out before leaving.\"",
        "exampleMeaning": "\"Please log out when you're done.\"",
        "note": "Example: \"Don't forget to log out.\"",
        "pron": "/lɒɡ aʊt/"
      },
      {
        "word": "sign in",
        "meaningVi": "đăng nhập (mượt hơn log in)",
        "exampleSentence": "\"Sign in with Google.\"",
        "exampleMeaning": "\"Please sign in to access.\"",
        "note": "Example: \"Sign in with SSO.\"",
        "pron": "/saɪn ɪn/"
      },
      {
        "word": "stand for",
        "meaningVi": "viết tắt của, đại diện",
        "exampleSentence": "\"API stands for...\"",
        "exampleMeaning": "\"REST stands for Representational State Transfer.\"",
        "note": "Example: \"What does HTML stand for?\"",
        "pron": "/stænd fɔːr/"
      },
      {
        "word": "stand out",
        "meaningVi": "nổi bật",
        "exampleSentence": "\"This stands out.\"",
        "exampleMeaning": "\"Your resume stands out from others.\"",
        "note": "Example: \"Stand out from the crowd.\"",
        "pron": "/stænd aʊt/"
      },
      {
        "word": "stand by",
        "meaningVi": "chờ sẵn",
        "exampleSentence": "\"Stand by.\"",
        "exampleMeaning": "\"Please stand by for updates.\"",
        "note": "Example: \"Stand by for the announcement.\"",
        "pron": "/stænd baɪ/"
      },
      {
        "word": "get back to",
        "meaningVi": "quay lại với (ai)",
        "exampleSentence": "\"I'll get back to you.\"",
        "exampleMeaning": "\"I'll get back to you by EOD.\"",
        "note": "Example: \"Get back to me on this.\"",
        "pron": "/ɡet bæk tuː/"
      },
      {
        "word": "get along with",
        "meaningVi": "hòa thuận",
        "exampleSentence": "\"I get along with them.\"",
        "exampleMeaning": "\"It's important to get along with colleagues.\"",
        "note": "Example: \"Get along with coworkers.\"",
        "pron": "/ɡet əˈlɒŋ wɪð/"
      },
      {
        "word": "get in touch",
        "meaningVi": "liên lạc",
        "exampleSentence": "\"Get in touch anytime.\"",
        "exampleMeaning": "\"Please get in touch with HR.\"",
        "note": "Example: \"Get in touch with the team.\"",
        "pron": "/ɡet ɪn tʌtʃ/"
      },
      {
        "word": "get rid of",
        "meaningVi": "loại bỏ",
        "exampleSentence": "\"Get rid of the old code.\"",
        "exampleMeaning": "\"We need to get rid of technical debt.\"",
        "note": "Example: \"Get rid of the warning.\"",
        "pron": "/ɡet rɪd əv/"
      },
      {
        "word": "get stuck",
        "meaningVi": "bị kẹt",
        "exampleSentence": "\"I got stuck.\"",
        "exampleMeaning": "\"We're stuck on the implementation.\"",
        "note": "Example: \"Got stuck on this bug.\"",
        "pron": "/ɡet stʌk/"
      },
      {
        "word": "pass on",
        "meaningVi": "truyền đạt, bỏ qua",
        "exampleSentence": "\"Pass it on.\"",
        "exampleMeaning": "\"Please pass on this information.\"",
        "note": "Example: \"Pass on the message.\"",
        "pron": "/pɑːs ɒn/"
      },
      {
        "word": "pass out",
        "meaningVi": "phân phát (tài liệu)",
        "exampleSentence": "\"Pass out the agenda.\"",
        "exampleMeaning": "\"Materials will be passed out at the door.\"",
        "note": "Example: \"Pass out free swag.\"",
        "pron": "/pɑːs aʊt/"
      },
      {
        "word": "check out",
        "meaningVi": "kiểm tra, xem",
        "exampleSentence": "\"Check out this PR.\"",
        "exampleMeaning": "\"Please check out the new feature.\"",
        "note": "Example: \"Check out the docs.\"",
        "pron": "/tʃek aʊt/"
      },
      {
        "word": "wrap up",
        "meaningVi": "kết thúc, gói gọn",
        "exampleSentence": "\"Let's wrap up.\"",
        "exampleMeaning": "\"Let's wrap up the meeting.\"",
        "note": "Example: \"Wrap up the report.\"",
        "pron": "/ræp ʌp/"
      }
    ]
  },
  {
    "name": "Idioms workplace",
    "icon": "💬",
    "words": [
      {
        "word": "hit a roadblock",
        "meaningVi": "gặp trở ngại",
        "exampleSentence": "\"Hit a roadblock on this.\"",
        "exampleMeaning": "\"We hit a major roadblock.\"",
        "note": "Example: \"Roadblock at line 42.\"",
        "pron": null
      },
      {
        "word": "think outside the box",
        "meaningVi": "suy nghĩ sáng tạo",
        "exampleSentence": "\"Let's think outside the box.\"",
        "exampleMeaning": "\"We need to think outside the box here.\"",
        "note": "Example: \"Outside-the-box thinking.\"",
        "pron": null
      },
      {
        "word": "get the ball rolling",
        "meaningVi": "bắt đầu",
        "exampleSentence": "\"Let's get the ball rolling.\"",
        "exampleMeaning": "\"Let's get the ball rolling on this initiative.\"",
        "note": "Example: \"Start the ball rolling.\"",
        "pron": null
      },
      {
        "word": "on the same page",
        "meaningVi": "cùng quan điểm",
        "exampleSentence": "\"Are we on the same page?\"",
        "exampleMeaning": "\"Let's ensure we're aligned.\"",
        "note": "Example: \"Get on the same page.\"",
        "pron": null
      },
      {
        "word": "learn the ropes",
        "meaningVi": "học cách làm",
        "exampleSentence": "\"Still learning the ropes.\"",
        "exampleMeaning": "\"It takes time to learn the ropes.\"",
        "note": "Example: \"Learning the ropes at the new job.\"",
        "pron": null
      },
      {
        "word": "hit the ground running",
        "meaningVi": "bắt đầu nhanh và mạnh",
        "exampleSentence": "\"He hit the ground running.\"",
        "exampleMeaning": "\"We're looking for someone who can hit the ground running.\"",
        "note": "Example: \"Hit the ground running on day one.\"",
        "pron": null
      },
      {
        "word": "take it one step at a time",
        "meaningVi": "từng bước một",
        "exampleSentence": "\"One step at a time.\"",
        "exampleMeaning": "\"We should take it one step at a time.\"",
        "note": "Example: \"Step by step.\"",
        "pron": null
      },
      {
        "word": "go the extra mile",
        "meaningVi": "cố gắng thêm",
        "exampleSentence": "\"Always go the extra mile.\"",
        "exampleMeaning": "\"We expect employees to go the extra mile.\"",
        "note": "Example: \"Willing to go the extra mile.\"",
        "pron": null
      },
      {
        "word": "in the same boat",
        "meaningVi": "cùng hoàn cảnh",
        "exampleSentence": "\"We're all in the same boat.\"",
        "exampleMeaning": "\"The entire team is in the same boat.\"",
        "note": "Example: \"We're in the same boat.\"",
        "pron": null
      },
      {
        "word": "bite the bullet",
        "meaningVi": "quyết định khó",
        "exampleSentence": "\"Let's bite the bullet.\"",
        "exampleMeaning": "\"We decided to bite the bullet.\"",
        "note": "Example: \"Bite the bullet and refactor.\"",
        "pron": null
      },
      {
        "word": "cut corners",
        "meaningVi": "làm tắt (giảm chất lượng)",
        "exampleSentence": "\"Don't cut corners.\"",
        "exampleMeaning": "\"We cannot cut corners on security.\"",
        "note": "Example: \"Cutting corners on tests.\"",
        "pron": null
      },
      {
        "word": "raise the bar",
        "meaningVi": "nâng tiêu chuẩn",
        "exampleSentence": "\"Let's raise the bar.\"",
        "exampleMeaning": "\"This raises the bar for quality.\"",
        "note": "Example: \"Raise the bar higher.\"",
        "pron": null
      },
      {
        "word": "ball is in your court",
        "meaningVi": "đến lượt bạn",
        "exampleSentence": "\"Ball's in your court.\"",
        "exampleMeaning": "\"The decision is now yours — ball's in your court.\"",
        "note": "Example: \"Your move.\"",
        "pron": null
      },
      {
        "word": "burn the midnight oil",
        "meaningVi": "làm việc khuya",
        "exampleSentence": "\"Burning the midnight oil.\"",
        "exampleMeaning": "\"The team burned the midnight oil to ship on time.\"",
        "note": "Example: \"Working late.\"",
        "pron": null
      },
      {
        "word": "by the book",
        "meaningVi": "đúng quy trình",
        "exampleSentence": "\"Do it by the book.\"",
        "exampleMeaning": "\"All procedures must be followed by the book.\"",
        "note": "Example: \"By the book / off the book.\"",
        "pron": null
      },
      {
        "word": "call it a day",
        "meaningVi": "kết thúc ngày làm việc",
        "exampleSentence": "\"Let's call it a day.\"",
        "exampleMeaning": "\"I think we should call it a day.\"",
        "note": "Example: \"Wrapping up.\"",
        "pron": null
      },
      {
        "word": "cross that bridge when we come to it",
        "meaningVi": "giải quyết khi đến",
        "exampleSentence": "\"Let's cross that bridge later.\"",
        "exampleMeaning": "\"We'll cross that bridge when we come to it.\"",
        "note": "Example: \"Deal with it later.\"",
        "pron": null
      },
      {
        "word": "cut to the chase",
        "meaningVi": "đi thẳng vào vấn đề",
        "exampleSentence": "\"Cut to the chase.\"",
        "exampleMeaning": "\"Let's cut to the chase and discuss the budget.\"",
        "note": "Example: \"Skip the small talk.\"",
        "pron": null
      },
      {
        "word": "don't count your chickens before they hatch",
        "meaningVi": "đừng vui quá sớm",
        "exampleSentence": "\"Don't count chickens yet.\"",
        "exampleMeaning": "\"We shouldn't count our chickens before they hatch.\"",
        "note": "Example: \"Wait until it ships.\"",
        "pron": null
      },
      {
        "word": "draw a line in the sand",
        "meaningVi": "đặt giới hạn",
        "exampleSentence": "\"We need to draw a line.\"",
        "exampleMeaning": "\"The manager drew a line in the sand.\"",
        "note": "Example: \"Set boundaries.\"",
        "pron": null
      },
      {
        "word": "easier said than done",
        "meaningVi": "nói dễ hơn làm",
        "exampleSentence": "\"It's easier said than done.\"",
        "exampleMeaning": "\"While the goal is clear, it's easier said than done.\"",
        "note": "Example: \"Hard to implement.\"",
        "pron": null
      },
      {
        "word": "get out of hand",
        "meaningVi": "vượt tầm kiểm soát",
        "exampleSentence": "\"Things got out of hand.\"",
        "exampleMeaning": "\"The scope got out of hand quickly.\"",
        "note": "Example: \"Out of control.\"",
        "pron": null
      },
      {
        "word": "give it a shot",
        "meaningVi": "thử",
        "exampleSentence": "\"Let me give it a shot.\"",
        "exampleMeaning": "\"We should give this approach a shot.\"",
        "note": "Example: \"Try it.\"",
        "pron": null
      },
      {
        "word": "hang in there",
        "meaningVi": "cố lên",
        "exampleSentence": "\"Hang in there!\"",
        "exampleMeaning": "\"Please hang in there while we resolve this.\"",
        "note": "Example: \"Stay strong.\"",
        "pron": null
      },
      {
        "word": "have a lot on my plate",
        "meaningVi": "bận nhiều việc",
        "exampleSentence": "\"I have a lot on my plate.\"",
        "exampleMeaning": "\"Currently, I have a lot on my plate.\"",
        "note": "Example: \"Very busy.\"",
        "pron": null
      },
      {
        "word": "in a nutshell",
        "meaningVi": "tóm gọn lại",
        "exampleSentence": "\"In a nutshell...\"",
        "exampleMeaning": "\"In a nutshell, the project is on track.\"",
        "note": "Example: \"TL;DR.\"",
        "pron": null
      },
      {
        "word": "it's not rocket science",
        "meaningVi": "không khó",
        "exampleSentence": "\"It's not rocket science.\"",
        "exampleMeaning": "\"This isn't rocket science — just follow the steps.\"",
        "note": "Example: \"Easy.\"",
        "pron": null
      },
      {
        "word": "jump on the bandwagon",
        "meaningVi": "theo trend",
        "exampleSentence": "\"Everyone's jumping on.\"",
        "exampleMeaning": "\"Many companies are jumping on the AI bandwagon.\"",
        "note": "Example: \"Follow the trend.\"",
        "pron": null
      },
      {
        "word": "keep an eye on",
        "meaningVi": "theo dõi",
        "exampleSentence": "\"Keep an eye on it.\"",
        "exampleMeaning": "\"Please keep an eye on the metrics.\"",
        "note": "Example: \"Monitor.\"",
        "pron": null
      },
      {
        "word": "keep it under wraps",
        "meaningVi": "giữ bí mật",
        "exampleSentence": "\"Keep it under wraps.\"",
        "exampleMeaning": "\"Please keep this under wraps until launch.\"",
        "note": "Example: \"Confidential.\"",
        "pron": null
      },
      {
        "word": "kill two birds with one stone",
        "meaningVi": "một công đôi việc",
        "exampleSentence": "\"Two birds, one stone!\"",
        "exampleMeaning": "\"This approach kills two birds with one stone.\"",
        "note": "Example: \"Efficient.\"",
        "pron": null
      },
      {
        "word": "last but not least",
        "meaningVi": "cuối cùng nhưng không kém",
        "exampleSentence": "\"Last but not least...\"",
        "exampleMeaning": "\"Last but not least, let's discuss timelines.\"",
        "note": "Example: \"Finally.\"",
        "pron": null
      },
      {
        "word": "leave no stone unturned",
        "meaningVi": "xem xét tất cả",
        "exampleSentence": "\"Leave no stone unturned.\"",
        "exampleMeaning": "\"We left no stone unturned in the investigation.\"",
        "note": "Example: \"Thorough.\"",
        "pron": null
      },
      {
        "word": "long story short",
        "meaningVi": "nói ngắn gọn",
        "exampleSentence": "\"Long story short...\"",
        "exampleMeaning": "\"Long story short, we shipped on time.\"",
        "note": "Example: \"In short.\"",
        "pron": null
      },
      {
        "word": "lose track of time",
        "meaningVi": "quên thời gian",
        "exampleSentence": "\"I lost track of time.\"",
        "exampleMeaning": "\"I lost track of time reviewing the PR.\"",
        "note": "Example: \"Time flew.\"",
        "pron": null
      },
      {
        "word": "miss the boat",
        "meaningVi": "lỡ cơ hội",
        "exampleSentence": "\"We missed the boat.\"",
        "exampleMeaning": "\"We missed the boat on that opportunity.\"",
        "note": "Example: \"Too late.\"",
        "pron": null
      },
      {
        "word": "no pain, no gain",
        "meaningVi": "không khổ không thành",
        "exampleSentence": "\"No pain, no gain.\"",
        "exampleMeaning": "\"This refactor is painful but no pain, no gain.\"",
        "note": "Example: \"Effort = reward.\"",
        "pron": null
      },
      {
        "word": "off the top of my head",
        "meaningVi": "nghĩ ngay lúc đó",
        "exampleSentence": "\"Off the top of my head...\"",
        "exampleMeaning": "\"Off the top of my head, I'd say 3 days.\"",
        "note": "Example: \"Roughly.\"",
        "pron": null
      },
      {
        "word": "on the fence",
        "meaningVi": "phân vân",
        "exampleSentence": "\"I'm on the fence.\"",
        "exampleMeaning": "\"We're still on the fence about this approach.\"",
        "note": "Example: \"Undecided.\"",
        "pron": null
      },
      {
        "word": "once in a blue moon",
        "meaningVi": "rất hiếm khi",
        "exampleSentence": "\"Once in a blue moon.\"",
        "exampleMeaning": "\"We only do this once in a blue moon.\"",
        "note": "Example: \"Rarely.\"",
        "pron": null
      },
      {
        "word": "out of the blue",
        "meaningVi": "bất ngờ",
        "exampleSentence": "\"Out of the blue!\"",
        "exampleMeaning": "\"Out of the blue, the CEO resigned.\"",
        "note": "Example: \"Unexpected.\"",
        "pron": null
      },
      {
        "word": "piece of cake",
        "meaningVi": "dễ",
        "exampleSentence": "\"Piece of cake.\"",
        "exampleMeaning": "\"This task is a piece of cake.\"",
        "note": "Example: \"Easy.\"",
        "pron": null
      },
      {
        "word": "pull the plug",
        "meaningVi": "dừng lại",
        "exampleSentence": "\"Pull the plug.\"",
        "exampleMeaning": "\"We had to pull the plug on the project.\"",
        "note": "Example: \"Cancel/stop.\"",
        "pron": null
      },
      {
        "word": "put all your eggs in one basket",
        "meaningVi": "đặt cược tất cả",
        "exampleSentence": "\"Don't put all eggs in one basket.\"",
        "exampleMeaning": "\"Diversification prevents putting all eggs in one basket.\"",
        "note": "Example: \"Don't risk everything.\"",
        "pron": null
      },
      {
        "word": "rain on someone's parade",
        "meaningVi": "phá hứng",
        "exampleSentence": "\"Sorry to rain on your parade.\"",
        "exampleMeaning": "\"I don't mean to rain on your parade, but...\"",
        "note": "Example: \"Don't want to disappoint.\"",
        "pron": null
      },
      {
        "word": "reinvent the wheel",
        "meaningVi": "làm lại từ đầu (không cần)",
        "exampleSentence": "\"Don't reinvent the wheel.\"",
        "exampleMeaning": "\"There's no need to reinvent the wheel here.\"",
        "note": "Example: \"Use existing solutions.\"",
        "pron": null
      },
      {
        "word": "silver lining",
        "meaningVi": "điểm tích cực trong khó khăn",
        "exampleSentence": "\"There's a silver lining.\"",
        "exampleMeaning": "\"The silver lining is we learned a lot.\"",
        "note": "Example: \"Bright side.\"",
        "pron": null
      },
      {
        "word": "sleep on it",
        "meaningVi": "ngủ một đêm rồi quyết",
        "exampleSentence": "\"Sleep on it.\"",
        "exampleMeaning": "\"I'd like to sleep on it and respond tomorrow.\"",
        "note": "Example: \"Think overnight.\"",
        "pron": null
      },
      {
        "word": "spread yourself too thin",
        "meaningVi": "ôm đồm quá nhiều",
        "exampleSentence": "\"Spread too thin.\"",
        "exampleMeaning": "\"We've spread ourselves too thin this sprint.\"",
        "note": "Example: \"Over-committed.\"",
        "pron": null
      },
      {
        "word": "take it with a grain of salt",
        "meaningVi": "không nên tin hoàn toàn",
        "exampleSentence": "\"Take it with a grain of salt.\"",
        "exampleMeaning": "\"I'd take that announcement with a grain of salt.\"",
        "note": "Example: \"Be skeptical.\"",
        "pron": null
      },
      {
        "word": "the ball is in your court",
        "meaningVi": "đến lượt bạn",
        "exampleSentence": "\"Ball's in your court.\"",
        "exampleMeaning": "\"We've done our part — ball's in your court.\"",
        "note": "Example: \"Your move.\"",
        "pron": null
      },
      {
        "word": "the elephant in the room",
        "meaningVi": "vấn đề ai cũng biết nhưng không ai nói",
        "exampleSentence": "\"Let's address the elephant.\"",
        "exampleMeaning": "\"The elephant in the room is our deadline.\"",
        "note": "Example: \"Obvious issue.\"",
        "pron": null
      },
      {
        "word": "the last straw",
        "meaningVi": "giọt nước tràn ly",
        "exampleSentence": "\"It was the last straw.\"",
        "exampleMeaning": "\"That bug was the last straw for the user.\"",
        "note": "Example: \"Final push to breaking point.\"",
        "pron": null
      },
      {
        "word": "throw in the towel",
        "meaningVi": "bỏ cuộc",
        "exampleSentence": "\"I want to throw in the towel.\"",
        "exampleMeaning": "\"We didn't throw in the towel despite setbacks.\"",
        "note": "Example: \"Give up.\"",
        "pron": null
      },
      {
        "word": "time is money",
        "meaningVi": "thời gian là tiền bạc",
        "exampleSentence": "\"Time is money!\"",
        "exampleMeaning": "\"We should value efficiency — time is money.\"",
        "note": "Example: \"Be efficient.\"",
        "pron": null
      },
      {
        "word": "under the weather",
        "meaningVi": "không khỏe",
        "exampleSentence": "\"I'm feeling under the weather.\"",
        "exampleMeaning": "\"I'm a bit under the weather today.\"",
        "note": "Example: \"Sick.\"",
        "pron": null
      },
      {
        "word": "up in the air",
        "meaningVi": "chưa chắc chắn",
        "exampleSentence": "\"It's up in the air.\"",
        "exampleMeaning": "\"The decision is still up in the air.\"",
        "note": "Example: \"Uncertain.\"",
        "pron": null
      },
      {
        "word": "when pigs fly",
        "meaningVi": "không bao giờ",
        "exampleSentence": "\"When pigs fly!\"",
        "exampleMeaning": "\"That'll happen when pigs fly.\"",
        "note": "Example: \"Never.\"",
        "pron": null
      },
      {
        "word": "worth a shot",
        "meaningVi": "đáng thử",
        "exampleSentence": "\"Worth a shot.\"",
        "exampleMeaning": "\"It's worth a shot.\"",
        "note": "Example: \"Try it.\"",
        "pron": null
      },
      {
        "word": "you can't have your cake and eat it too",
        "meaningVi": "không thể có cả hai",
        "exampleSentence": "\"Can't have both.\"",
        "exampleMeaning": "\"You can't have your cake and eat it too — choose one.\"",
        "note": "Example: \"Trade-off exists.\"",
        "pron": null
      }
    ]
  },
  {
    "name": "Collocations",
    "icon": "✍️",
    "words": [
      {
        "word": "make a decision",
        "meaningVi": "quyết định",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do a decision\" | ✅ Đúng: \"make a decision\"",
        "pron": null
      },
      {
        "word": "make a mistake",
        "meaningVi": "mắc lỗi",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do a mistake\" | ✅ Đúng: \"make a mistake\"",
        "pron": null
      },
      {
        "word": "make progress",
        "meaningVi": "tiến bộ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do progress\" | ✅ Đúng: \"make progress\"",
        "pron": null
      },
      {
        "word": "make sense",
        "meaningVi": "hợp lý",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do sense\" | ✅ Đúng: \"make sense\"",
        "pron": null
      },
      {
        "word": "make a difference",
        "meaningVi": "tạo khác biệt",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do a difference\" | ✅ Đúng: \"make a difference\"",
        "pron": null
      },
      {
        "word": "make a change",
        "meaningVi": "thay đổi",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do a change\" | ✅ Đúng: \"make a change\"",
        "pron": null
      },
      {
        "word": "make an effort",
        "meaningVi": "cố gắng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do an effort\" | ✅ Đúng: \"make an effort\"",
        "pron": null
      },
      {
        "word": "make time",
        "meaningVi": "dành thời gian",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do time\" | ✅ Đúng: \"make time\"",
        "pron": null
      },
      {
        "word": "make money",
        "meaningVi": "kiếm tiền",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do money\" | ✅ Đúng: \"make money\"",
        "pron": null
      },
      {
        "word": "take a look",
        "meaningVi": "xem qua",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a look\" | ✅ Đúng: \"take a look\"",
        "pron": null
      },
      {
        "word": "take a break",
        "meaningVi": "nghỉ giải lao",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do a break\" | ✅ Đúng: \"take a break\"",
        "pron": null
      },
      {
        "word": "take notes",
        "meaningVi": "ghi chú",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make notes\" | ✅ Đúng: \"take notes\"",
        "pron": null
      },
      {
        "word": "take a screenshot",
        "meaningVi": "chụp màn hình",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do a screenshot\" | ✅ Đúng: \"take a screenshot\"",
        "pron": null
      },
      {
        "word": "take responsibility",
        "meaningVi": "chịu trách nhiệm",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make responsibility\" | ✅ Đúng: \"take responsibility\"",
        "pron": null
      },
      {
        "word": "take action",
        "meaningVi": "hành động",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do action\" | ✅ Đúng: \"take action\"",
        "pron": null
      },
      {
        "word": "take a risk",
        "meaningVi": "mạo hiểm",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a risk\" | ✅ Đúng: \"take a risk\"",
        "pron": null
      },
      {
        "word": "do research",
        "meaningVi": "nghiên cứu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make research\" | ✅ Đúng: \"do research\"",
        "pron": null
      },
      {
        "word": "do a great job",
        "meaningVi": "làm tốt",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a great job\" | ✅ Đúng: \"do a great job\"",
        "pron": null
      },
      {
        "word": "do damage",
        "meaningVi": "gây thiệt hại",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make damage\" | ✅ Đúng: \"do damage\"",
        "pron": null
      },
      {
        "word": "do business",
        "meaningVi": "kinh doanh",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make business\" | ✅ Đúng: \"do business\"",
        "pron": null
      },
      {
        "word": "have a meeting",
        "meaningVi": "họp",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a meeting\" | ✅ Đúng: \"have a meeting\"",
        "pron": null
      },
      {
        "word": "have a conversation",
        "meaningVi": "trò chuyện",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a conversation\" | ✅ Đúng: \"have a conversation\"",
        "pron": null
      },
      {
        "word": "have lunch",
        "meaningVi": "ăn trưa",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make lunch\" | ✅ Đúng: \"have lunch\"",
        "pron": null
      },
      {
        "word": "have a look",
        "meaningVi": "xem qua",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a look\" | ✅ Đúng: \"have a look\" (BrE)",
        "pron": null
      },
      {
        "word": "have a problem",
        "meaningVi": "có vấn đề",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"make a problem\" | ✅ Đúng: \"have a problem\"",
        "pron": null
      },
      {
        "word": "have an idea",
        "meaningVi": "có ý tưởng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": "❌ Sai: \"do an idea\" | ✅ Đúng: \"have an idea\"",
        "pron": null
      },
      {
        "word": "strong opinion",
        "meaningVi": "quan điểm mạnh",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "strong feedback",
        "meaningVi": "phản hồi mạnh",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "strong emphasis",
        "meaningVi": "nhấn mạnh",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "strong connection",
        "meaningVi": "kết nối mạnh",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "strong candidate",
        "meaningVi": "ứng viên tiềm năng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "weak signal",
        "meaningVi": "tín hiệu yếu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "weak password",
        "meaningVi": "mật khẩu yếu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "weak typing",
        "meaningVi": "gõ phím yếu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "weak feedback",
        "meaningVi": "phản hồi yếu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "weak performance",
        "meaningVi": "hiệu suất kém",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "heavy traffic",
        "meaningVi": "giao thông đông",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "heavy user",
        "meaningVi": "người dùng nhiều",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "heavy load",
        "meaningVi": "tải nặng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "heavy lifting",
        "meaningVi": "công việc nặng nhọc",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "heavy fog",
        "meaningVi": "sương mù dày",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "light traffic",
        "meaningVi": "giao thông thưa",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "light user",
        "meaningVi": "người dùng ít",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "light load",
        "meaningVi": "tải nhẹ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "light reading",
        "meaningVi": "đọc nhẹ nhàng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "light meal",
        "meaningVi": "bữa ăn nhẹ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run smoothly",
        "meaningVi": "chạy trơn tru",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run late",
        "meaningVi": "trễ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run out of",
        "meaningVi": "hết",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run a test",
        "meaningVi": "chạy test",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run a build",
        "meaningVi": "chạy build",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run a meeting",
        "meaningVi": "điều hành cuộc họp",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run a business",
        "meaningVi": "điều hành doanh nghiệp",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run errands",
        "meaningVi": "đi làm việc vặt",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run into trouble",
        "meaningVi": "gặp rắc rối",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep in touch",
        "meaningVi": "giữ liên lạc",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep in mind",
        "meaningVi": "ghi nhớ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep an eye on",
        "meaningVi": "theo dõi",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep up the good work",
        "meaningVi": "tiếp tục làm tốt",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep up with",
        "meaningVi": "theo kịp",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep calm",
        "meaningVi": "giữ bình tĩnh",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep it simple",
        "meaningVi": "giữ đơn giản",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep it private",
        "meaningVi": "giữ riêng tư",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep going",
        "meaningVi": "tiếp tục",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "keep track of",
        "meaningVi": "theo dõi",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay attention",
        "meaningVi": "chú ý",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay a visit",
        "meaningVi": "ghé thăm",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay a compliment",
        "meaningVi": "khen ngợi",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay a fine",
        "meaningVi": "nộp phạt",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay respects",
        "meaningVi": "thể hiện sự tôn trọng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay off (debt)",
        "meaningVi": "trả hết nợ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pay off (work)",
        "meaningVi": "được đền đáp",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch up",
        "meaningVi": "bắt kịp",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch a bug",
        "meaningVi": "phát hiện bug",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch a cold",
        "meaningVi": "bị cảm",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch someone's eye",
        "meaningVi": "thu hút sự chú ý",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch a flight",
        "meaningVi": "kịp chuyến bay",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch the last train",
        "meaningVi": "kịp chuyến tàu cuối",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "catch a break",
        "meaningVi": "cuối cùng cũng may mắn",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise a question",
        "meaningVi": "đặt câu hỏi",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise a concern",
        "meaningVi": "nêu lo ngại",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise an issue",
        "meaningVi": "nêu vấn đề",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise the bar",
        "meaningVi": "nâng tiêu chuẩn",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise awareness",
        "meaningVi": "nâng cao nhận thức",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise money",
        "meaningVi": "gây quỹ",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "raise a child",
        "meaningVi": "nuôi con",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "meet a deadline",
        "meaningVi": "kịp deadline",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "meet expectations",
        "meaningVi": "đáp ứng kỳ vọng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "meet requirements",
        "meaningVi": "đáp ứng yêu cầu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "meet a goal",
        "meaningVi": "đạt mục tiêu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "meet someone for the first time",
        "meaningVi": "gặp lần đầu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "meet up",
        "meaningVi": "gặp mặt (casual)",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "ship a feature",
        "meaningVi": "phát hành tính năng",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "push to production",
        "meaningVi": "đẩy lên production",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "break the build",
        "meaningVi": "làm hỏng build",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "crash the server",
        "meaningVi": "làm sập server",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "deploy to staging",
        "meaningVi": "triển khai lên staging",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "merge the PR",
        "meaningVi": "merge pull request",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "close the ticket",
        "meaningVi": "đóng ticket",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "file a bug",
        "meaningVi": "báo cáo bug",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "fix the bug",
        "meaningVi": "sửa bug",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "hit a milestone",
        "meaningVi": "đạt cột mốt",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "miss the deadline",
        "meaningVi": "trễ deadline",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "pass the test",
        "meaningVi": "đậu test",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "write tests",
        "meaningVi": "viết test",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "run tests",
        "meaningVi": "chạy test",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "write code",
        "meaningVi": "viết code",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "review code",
        "meaningVi": "review code",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "write documentation",
        "meaningVi": "viết tài liệu",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "file a PR",
        "meaningVi": "tạo pull request",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "assign a ticket",
        "meaningVi": "giao ticket",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      },
      {
        "word": "estimate a task",
        "meaningVi": "ước lượng task",
        "exampleSentence": null,
        "exampleMeaning": null,
        "note": null,
        "pron": null
      }
    ]
  },
  {
    "name": "AI / LLM",
    "icon": "🤖",
    "words": [
      {
        "word": "AI (Artificial Intelligence)",
        "meaningVi": "trí tuệ nhân tạo",
        "exampleSentence": "\"AI is everywhere now.\"",
        "exampleMeaning": "\"AI is transforming industries.\"",
        "note": null,
        "pron": "/eɪ aɪ/"
      },
      {
        "word": "ML (Machine Learning)",
        "meaningVi": "học máy",
        "exampleSentence": "\"I'm learning ML.\"",
        "exampleMeaning": "\"ML requires large datasets.\"",
        "note": null,
        "pron": "/em el/"
      },
      {
        "word": "DL (Deep Learning)",
        "meaningVi": "học sâu",
        "exampleSentence": "\"Deep learning needs GPUs.\"",
        "exampleMeaning": "\"Deep learning excels at image recognition.\"",
        "note": null,
        "pron": "/diː el/"
      },
      {
        "word": "LLM (Large Language Model)",
        "meaningVi": "mô hình ngôn ngữ lớn",
        "exampleSentence": "\"LLMs are getting smarter.\"",
        "exampleMeaning": "\"LLMs are trained on massive text corpora.\"",
        "note": null,
        "pron": "/el el em/"
      },
      {
        "word": "GPT (Generative Pre-trained Transformer)",
        "meaningVi": "mô hình ngôn ngữ của OpenAI",
        "exampleSentence": "\"GPT-4 is impressive.\"",
        "exampleMeaning": "\"GPT models are widely adopted.\"",
        "note": null,
        "pron": "/dʒiː piː tiː/"
      },
      {
        "word": "Claude",
        "meaningVi": "mô hình AI của Anthropic",
        "exampleSentence": "\"Claude is great for coding.\"",
        "exampleMeaning": "\"Claude 3.5 Sonnet excels at reasoning.\"",
        "note": null,
        "pron": "/klɔːd/"
      },
      {
        "word": "Gemini",
        "meaningVi": "AI của Google",
        "exampleSentence": "\"I use Gemini for research.\"",
        "exampleMeaning": "\"Gemini integrates with Google Workspace.\"",
        "note": null,
        "pron": "/ˈdʒem.ɪ.naɪ/"
      },
      {
        "word": "Llama",
        "meaningVi": "mô hình mã nguồn mở của Meta",
        "exampleSentence": "\"Llama is open-source.\"",
        "exampleMeaning": "\"Llama 3 can run on consumer GPUs.\"",
        "note": null,
        "pron": "/ˈlɑː.mə/"
      },
      {
        "word": "Mistral",
        "meaningVi": "AI mã nguồn mở (Pháp)",
        "exampleSentence": "\"Mistral is fast.\"",
        "exampleMeaning": "\"Mistral models are popular in Europe.\"",
        "note": null,
        "pron": "/ˈmɪs.trəl/"
      },
      {
        "word": "prompt",
        "meaningVi": "câu lệnh đầu vào cho AI",
        "exampleSentence": "\"I tweaked my prompt.\"",
        "exampleMeaning": "\"Prompt engineering is a critical skill.\"",
        "note": null,
        "pron": "/prɒmpt/"
      },
      {
        "word": "prompt engineering",
        "meaningVi": "kỹ thuật viết prompt",
        "exampleSentence": "\"Prompt engineering matters.\"",
        "exampleMeaning": "\"Prompt engineering is now a job title.\"",
        "note": null,
        "pron": "/ˈprɒmpt ˌen.dʒɪˈnɪə.rɪŋ/"
      },
      {
        "word": "to prompt",
        "meaningVi": "đưa prompt cho AI",
        "exampleSentence": "\"Prompt the model carefully.\"",
        "exampleMeaning": "\"Engineers prompt the LLM with context.\"",
        "note": null,
        "pron": "/prɒmpt/"
      },
      {
        "word": "a token",
        "meaningVi": "đơn vị văn bản (≈ 0.75 từ)",
        "exampleSentence": "\"Each token costs money.\"",
        "exampleMeaning": "\"Tokens are how LLMs process text.\"",
        "note": null,
        "pron": "/ˈtəʊ.kən/"
      },
      {
        "word": "context window",
        "meaningVi": "\"trí nhớ\" tối đa của LLM",
        "exampleSentence": "\"Context window is 200k tokens.\"",
        "exampleMeaning": "\"Larger context windows enable longer docs.\"",
        "note": null,
        "pron": "/ˈkɒn.tekst ˈwɪn.dəʊ/"
      },
      {
        "word": "context length",
        "meaningVi": "độ dài ngữ cảnh",
        "exampleSentence": "\"Longer context helps.\"",
        "exampleMeaning": "\"Context length affects performance.\"",
        "note": null,
        "pron": "/ˈkɒn.tekst leŋθ/"
      },
      {
        "word": "temperature",
        "meaningVi": "độ \"sáng tạo\" của AI",
        "exampleSentence": "\"Temperature 0 = focused.\"",
        "exampleMeaning": "\"Lower temperature reduces randomness.\"",
        "note": null,
        "pron": "/ˈtem.prə.tʃər/"
      },
      {
        "word": "top-p (nucleus sampling)",
        "meaningVi": "tham số lấy mẫu",
        "exampleSentence": "\"Use top-p 0.9.\"",
        "exampleMeaning": "\"Top-p sampling controls diversity.\"",
        "note": null,
        "pron": "/tɒp piː/"
      },
      {
        "word": "top-k",
        "meaningVi": "chọn top k token có xác suất cao",
        "exampleSentence": "\"Try top-k 40.\"",
        "exampleMeaning": "\"Top-k limits candidate tokens.\"",
        "note": null,
        "pron": "/tɒp keɪ/"
      },
      {
        "word": "a hallucination",
        "meaningVi": "AI bịa thông tin",
        "exampleSentence": "\"The LLM hallucinated.\"",
        "exampleMeaning": "\"Hallucinations are a known LLM issue.\"",
        "note": "Example: ⚠️ Quan trọng!",
        "pron": "/həˌluː.sɪˈneɪ.ʃən/"
      },
      {
        "word": "to hallucinate",
        "meaningVi": "(AI) bịa",
        "exampleSentence": "\"The model hallucinated facts.\"",
        "exampleMeaning": "\"LLMs may hallucinate with low temperature.\"",
        "note": null,
        "pron": "/həˈluː.sɪ.neɪt/"
      },
      {
        "word": "grounding",
        "meaningVi": "neo thực tế (chống hallucinate)",
        "exampleSentence": "\"Use grounding with search.\"",
        "exampleMeaning": "\"Grounding reduces hallucinations.\"",
        "note": null,
        "pron": "/ˈɡraʊn.dɪŋ/"
      },
      {
        "word": "a system prompt",
        "meaningVi": "prompt hệ thống (ẩn)",
        "exampleSentence": "\"Set the system prompt first.\"",
        "exampleMeaning": "\"System prompts define model behavior.\"",
        "note": null,
        "pron": "/ˈsɪs.təm prɒmpt/"
      },
      {
        "word": "a user prompt",
        "meaningVi": "prompt của người dùng",
        "exampleSentence": "\"User prompt was clear.\"",
        "exampleMeaning": "\"User prompts are processed after system prompts.\"",
        "note": null,
        "pron": "/ˈjuː.zər prɒmpt/"
      },
      {
        "word": "few-shot",
        "meaningVi": "cho vài ví dụ mẫu",
        "exampleSentence": "\"Use few-shot prompting.\"",
        "exampleMeaning": "\"Few-shot prompting improves accuracy.\"",
        "note": null,
        "pron": "/fjuː ʃɒt/"
      },
      {
        "word": "zero-shot",
        "meaningVi": "không cho ví dụ",
        "exampleSentence": "\"Zero-shot worked surprisingly well.\"",
        "exampleMeaning": "\"Zero-shot performance varies by task.\"",
        "note": null,
        "pron": "/ˈzɪə.rəʊ ʃɒt/"
      },
      {
        "word": "one-shot",
        "meaningVi": "cho 1 ví dụ",
        "exampleSentence": "\"Try one-shot.\"",
        "exampleMeaning": "\"One-shot prompts balance detail and simplicity.\"",
        "note": null,
        "pron": "/wʌn ʃɒt/"
      },
      {
        "word": "chain-of-thought (CoT)",
        "meaningVi": "suy nghĩ từng bước",
        "exampleSentence": "\"Use CoT for math.\"",
        "exampleMeaning": "\"Chain-of-thought improves reasoning.\"",
        "note": null,
        "pron": "/tʃeɪn əv θɔːt/"
      },
      {
        "word": "reasoning",
        "meaningVi": "suy luận",
        "exampleSentence": "\"The reasoning is sound.\"",
        "exampleMeaning": "\"Reasoning models like o1 think step by step.\"",
        "note": null,
        "pron": "/ˈriː.zən.ɪŋ/"
      },
      {
        "word": "inference",
        "meaningVi": "suy luận (chạy model)",
        "exampleSentence": "\"Inference is expensive.\"",
        "exampleMeaning": "\"Inference costs scale with usage.\"",
        "note": null,
        "pron": "/ˈɪn.fər.əns/"
      },
      {
        "word": "to fine-tune",
        "meaningVi": "tinh chỉnh model",
        "exampleSentence": "\"We fine-tuned on our data.\"",
        "exampleMeaning": "\"Fine-tuning requires GPU resources.\"",
        "note": null,
        "pron": "/faɪn tjuːn/"
      },
      {
        "word": "RAG (Retrieval-Augmented Generation)",
        "meaningVi": "AI kết hợp truy xuất + sinh văn bản",
        "exampleSentence": "\"RAG fixes hallucinations.\"",
        "exampleMeaning": "\"RAG combines retrieval with generation.\"",
        "note": null,
        "pron": "/ræɡ/"
      },
      {
        "word": "to retrieve",
        "meaningVi": "truy xuất",
        "exampleSentence": "\"Retrieve relevant docs.\"",
        "exampleMeaning": "\"The system retrieves top-k documents.\"",
        "note": null,
        "pron": "/rɪˈtriːv/"
      },
      {
        "word": "a knowledge base",
        "meaningVi": "cơ sở tri thức",
        "exampleSentence": "\"Build a knowledge base.\"",
        "exampleMeaning": "\"The knowledge base is indexed for search.\"",
        "note": null,
        "pron": "/ˈnɒl.ɪdʒ beɪs/"
      },
      {
        "word": "a vector DB",
        "meaningVi": "cơ sở dữ liệu vector",
        "exampleSentence": "\"Vector DBs store embeddings.\"",
        "exampleMeaning": "\"pgvector enables vector search in Postgres.\"",
        "note": null,
        "pron": "/ˈvek.tər diː biː/"
      },
      {
        "word": "an embedding",
        "meaningVi": "vector biểu diễn văn bản",
        "exampleSentence": "\"Compute the embedding.\"",
        "exampleMeaning": "\"Embeddings capture semantic meaning.\"",
        "note": null,
        "pron": "/ɪmˈbed.ɪŋ/"
      },
      {
        "word": "to embed",
        "meaningVi": "chuyển văn bản thành vector",
        "exampleSentence": "\"Embed the documents.\"",
        "exampleMeaning": "\"We embed documents using a transformer.\"",
        "note": null,
        "pron": "/ɪmˈbed/"
      },
      {
        "word": "chunking",
        "meaningVi": "chia văn bản thành đoạn nhỏ",
        "exampleSentence": "\"Chunk size matters.\"",
        "exampleMeaning": "\"Chunking strategy affects retrieval quality.\"",
        "note": null,
        "pron": "/ˈtʃʌŋ.kɪŋ/"
      },
      {
        "word": "a chunk",
        "meaningVi": "đoạn văn bản",
        "exampleSentence": "\"Smaller chunks = better precision.\"",
        "exampleMeaning": "\"Each chunk is embedded separately.\"",
        "note": null,
        "pron": "/tʃʌŋk/"
      },
      {
        "word": "semantic search",
        "meaningVi": "tìm kiếm theo ngữ nghĩa",
        "exampleSentence": "\"Use semantic search.\"",
        "exampleMeaning": "\"Semantic search outperforms keyword search.\"",
        "note": null,
        "pron": "/sɪˈmæn.tɪk sɜːtʃ/"
      },
      {
        "word": "cosine similarity",
        "meaningVi": "độ tương đồng cosine",
        "exampleSentence": "\"Cosine similarity is 0.9.\"",
        "exampleMeaning": "\"Cosine similarity measures vector proximity.\"",
        "note": null,
        "pron": "/ˈkəʊ.saɪn ˌsɪm.ɪˈlær.ɪ.ti/"
      },
      {
        "word": "reranking",
        "meaningVi": "xếp hạng lại kết quả",
        "exampleSentence": "\"Add a reranking step.\"",
        "exampleMeaning": "\"Reranking improves precision.\"",
        "note": null,
        "pron": "/riːˈræŋ.kɪŋ/"
      },
      {
        "word": "a reranker",
        "meaningVi": "model xếp hạng lại",
        "exampleSentence": "\"Cohere has a good reranker.\"",
        "exampleMeaning": "\"Rerankers refine initial retrieval results.\"",
        "note": null,
        "pron": "/riːˈræŋ.kər/"
      },
      {
        "word": "to index",
        "meaningVi": "lập chỉ mục",
        "exampleSentence": "\"Index the documents.\"",
        "exampleMeaning": "\"Documents are indexed in Elasticsearch.\"",
        "note": null,
        "pron": "/ˈɪn.deks/"
      },
      {
        "word": "a vector store",
        "meaningVi": "nơi lưu trữ vector",
        "exampleSentence": "\"Pinecone is a vector store.\"",
        "exampleMeaning": "\"Vector stores enable similarity search.\"",
        "note": null,
        "pron": "/ˈvek.tər stɔːr/"
      },
      {
        "word": "similarity search",
        "meaningVi": "tìm kiếm tương đồng",
        "exampleSentence": "\"Run similarity search.\"",
        "exampleMeaning": "\"Similarity search finds related content.\"",
        "note": null,
        "pron": "/ˌsɪm.ɪˈlær.ɪ.ti sɜːtʃ/"
      },
      {
        "word": "retrieval",
        "meaningVi": "truy xuất",
        "exampleSentence": "\"Improve retrieval.\"",
        "exampleMeaning": "\"Retrieval quality is critical for RAG.\"",
        "note": null,
        "pron": "/rɪˈtriː.vəl/"
      },
      {
        "word": "recall / precision",
        "meaningVi": "độ phủ / độ chính xác",
        "exampleSentence": "\"High recall, lower precision.\"",
        "exampleMeaning": "\"Recall@10 is the standard metric.\"",
        "note": null,
        "pron": "/rɪˈkɔːl/ /ˈpreʒ.ɪ.ʒən/"
      },
      {
        "word": "to ground",
        "meaningVi": "neo thực tế",
        "exampleSentence": "\"Ground the response.\"",
        "exampleMeaning": "\"Grounding prevents hallucinations.\"",
        "note": null,
        "pron": "/ɡraʊnd/"
      },
      {
        "word": "a source citation",
        "meaningVi": "trích dẫn nguồn",
        "exampleSentence": "\"Show source citations.\"",
        "exampleMeaning": "\"Citations improve user trust.\"",
        "note": null,
        "pron": "/sɔːs saɪˈteɪ.ʃən/"
      },
      {
        "word": "the metadata",
        "meaningVi": "dữ liệu mô tả",
        "exampleSentence": "\"Add metadata.\"",
        "exampleMeaning": "\"Metadata includes title and date.\"",
        "note": null,
        "pron": "/ˈmet.ə.dɑː.tə/"
      },
      {
        "word": "to ingest",
        "meaningVi": "nạp dữ liệu",
        "exampleSentence": "\"Ingest the PDFs.\"",
        "exampleMeaning": "\"Ingestion pipeline processes documents.\"",
        "note": null,
        "pron": "/ɪnˈdʒest/"
      },
      {
        "word": "ingestion",
        "meaningVi": "quá trình nạp dữ liệu",
        "exampleSentence": "\"Ingestion takes 30 mins.\"",
        "exampleMeaning": "\"Document ingestion must handle errors.\"",
        "note": null,
        "pron": "/ɪnˈdʒes.tʃən/"
      },
      {
        "word": "an ETL pipeline",
        "meaningVi": "Extract-Transform-Load",
        "exampleSentence": "\"Build an ETL.\"",
        "exampleMeaning": "\"ETL pipelines process documents nightly.\"",
        "note": null,
        "pron": "/ˌiː tiː el ˈpaɪp.laɪn/"
      },
      {
        "word": "document loader",
        "meaningVi": "bộ nạp tài liệu",
        "exampleSentence": "\"LangChain has many loaders.\"",
        "exampleMeaning": "\"Document loaders handle multiple formats.\"",
        "note": null,
        "pron": "/ˈdɒk.jʊ.mənt ˈləʊ.dər/"
      },
      {
        "word": "a splitter",
        "meaningVi": "bộ chia nhỏ văn bản",
        "exampleSentence": "\"RecursiveCharacterTextSplitter.\"",
        "exampleMeaning": "\"Splitters maintain semantic coherence.\"",
        "note": null,
        "pron": "/ˈsplɪt.ər/"
      },
      {
        "word": "an overlap",
        "meaningVi": "phần chồng lấn (giữa chunks)",
        "exampleSentence": "\"Add 200 token overlap.\"",
        "exampleMeaning": "\"Overlap preserves context across chunks.\"",
        "note": null,
        "pron": "/ˈəʊ.və.læp/"
      },
      {
        "word": "a context window",
        "meaningVi": "cửa sổ ngữ cảnh",
        "exampleSentence": "\"Window is 128k.\"",
        "exampleMeaning": "\"Context windows have grown significantly.\"",
        "note": null,
        "pron": "/ˈkɒn.tekst ˈwɪn.dəʊ/"
      },
      {
        "word": "an AI agent",
        "meaningVi": "tác nhân AI",
        "exampleSentence": "\"I built an agent.\"",
        "exampleMeaning": "\"AI agents can take autonomous actions.\"",
        "note": null,
        "pron": "/eɪ aɪ ˈeɪ.dʒənt/"
      },
      {
        "word": "agentic",
        "meaningVi": "thuộc về agent",
        "exampleSentence": "\"Agentic workflows are trending.\"",
        "exampleMeaning": "\"Agentic systems use tools autonomously.\"",
        "note": null,
        "pron": "/əˈdʒen.tɪk/"
      },
      {
        "word": "a tool",
        "meaningVi": "công cụ (cho AI gọi)",
        "exampleSentence": "\"Give it tools.\"",
        "exampleMeaning": "\"LLMs call tools via function calling.\"",
        "note": null,
        "pron": "/tuːl/"
      },
      {
        "word": "function calling",
        "meaningVi": "gọi hàm (từ LLM)",
        "exampleSentence": "\"Function calling is powerful.\"",
        "exampleMeaning": "\"Function calling enables structured outputs.\"",
        "note": null,
        "pron": "/ˈfʌŋk.ʃən ˈkɔː.lɪŋ/"
      },
      {
        "word": "tool use",
        "meaningVi": "sử dụng công cụ",
        "exampleSentence": "\"Tool use is critical.\"",
        "exampleMeaning": "\"Tool use extends LLM capabilities.\"",
        "note": null,
        "pron": "/tuːl juːz/"
      },
      {
        "word": "MCP (Model Context Protocol)",
        "meaningVi": "giao thức context model (Anthropic)",
        "exampleSentence": "\"MCP is the new standard.\"",
        "exampleMeaning": "\"MCP enables standardized tool integration.\"",
        "note": null,
        "pron": "/em siː piː/"
      },
      {
        "word": "a workflow",
        "meaningVi": "quy trình làm việc",
        "exampleSentence": "\"Design the workflow.\"",
        "exampleMeaning": "\"Multi-step workflows require planning.\"",
        "note": null,
        "pron": "/ˈwɜːk.fləʊ/"
      },
      {
        "word": "multi-step",
        "meaningVi": "nhiều bước",
        "exampleSentence": "\"Multi-step reasoning.\"",
        "exampleMeaning": "\"Multi-step agents handle complex tasks.\"",
        "note": null,
        "pron": "/ˌmʌl.ti step/"
      },
      {
        "word": "an orchestrator",
        "meaningVi": "bộ điều phối",
        "exampleSentence": "\"Use an orchestrator.\"",
        "exampleMeaning": "\"LangGraph is an agent orchestrator.\"",
        "note": null,
        "pron": "/ˈɔː.kɪ.streɪ.tər/"
      },
      {
        "word": "autonomous",
        "meaningVi": "tự động, tự trị",
        "exampleSentence": "\"It's autonomous.\"",
        "exampleMeaning": "\"Autonomous agents require guardrails.\"",
        "note": null,
        "pron": "/ɔːˈtɒn.ə.məs/"
      },
      {
        "word": "guardrails",
        "meaningVi": "rào chắn an toàn",
        "exampleSentence": "\"Add guardrails.\"",
        "exampleMeaning": "\"Guardrails prevent harmful outputs.\"",
        "note": null,
        "pron": "/ˈɡɑːd.reɪlz/"
      },
      {
        "word": "an evaluation (eval)",
        "meaningVi": "đánh giá",
        "exampleSentence": "\"Run evals.\"",
        "exampleMeaning": "\"Evals measure model performance.\"",
        "note": null,
        "pron": "/ɪˌvæl.juˈeɪ.ʃən/"
      }
    ]
  },
  {
    "name": "Frameworks & tools",
    "icon": "🛠️",
    "words": [
      {
        "word": "React 19",
        "meaningVi": "phiên bản React mới nhất",
        "exampleSentence": "\"React 19 has new features.\"",
        "exampleMeaning": "\"React 19 introduces Actions and use().\"",
        "note": null,
        "pron": "/riˈækt/"
      },
      {
        "word": "Next.js 15",
        "meaningVi": "framework React full-stack",
        "exampleSentence": "\"Next.js 15 is great.\"",
        "exampleMeaning": "\"Next.js 15 improves caching defaults.\"",
        "note": null,
        "pron": "/nekst dʒeɪ es/"
      },
      {
        "word": "App Router",
        "meaningVi": "routing mới của Next.js",
        "exampleSentence": "\"Use App Router.\"",
        "exampleMeaning": "\"App Router uses React Server Components.\"",
        "note": null,
        "pron": "/æp ˈruː.tər/"
      },
      {
        "word": "Server Components",
        "meaningVi": "components chạy trên server",
        "exampleSentence": "\"RSC is the future.\"",
        "exampleMeaning": "\"Server Components reduce JS bundle size.\"",
        "note": null,
        "pron": "/ˈsɜː.vər kəmˈpəʊ.nənts/"
      },
      {
        "word": "React Server Components (RSC)",
        "meaningVi": "components render trên server",
        "exampleSentence": "\"RSC works with App Router.\"",
        "exampleMeaning": "\"RSC enables zero-bundle components.\"",
        "note": null,
        "pron": "/ɑːr es siː/"
      },
      {
        "word": "useActionState",
        "meaningVi": "hook mới cho form actions",
        "exampleSentence": "\"useActionState handles pending.\"",
        "exampleMeaning": "\"useActionState simplifies form management.\"",
        "note": null,
        "pron": "/juːz ˈæk.ʃən steɪt/"
      },
      {
        "word": "Astro",
        "meaningVi": "framework content-first",
        "exampleSentence": "\"Astro is fast.\"",
        "exampleMeaning": "\"Astro ships zero JS by default.\"",
        "note": null,
        "pron": "/ˈæs.trəʊ/"
      },
      {
        "word": "SvelteKit",
        "meaningVi": "framework Svelte",
        "exampleSentence": "\"SvelteKit is ergonomic.\"",
        "exampleMeaning": "\"SvelteKit enables full-stack Svelte apps.\"",
        "note": null,
        "pron": "/svelt kɪt/"
      },
      {
        "word": "Vue 3.5",
        "meaningVi": "framework Vue",
        "exampleSentence": "\"Vue 3 is great.\"",
        "exampleMeaning": "\"Vue 3.5 improves reactivity system.\"",
        "note": null,
        "pron": "/vjuː/"
      },
      {
        "word": "Nuxt 3",
        "meaningVi": "framework Vue full-stack",
        "exampleSentence": "\"Nuxt is like Next for Vue.\"",
        "exampleMeaning": "\"Nuxt 3 supports hybrid rendering.\"",
        "note": null,
        "pron": "/nʌkst/"
      },
      {
        "word": "Solid.js",
        "meaningVi": "framework reactive",
        "exampleSentence": "\"Solid is fast.\"",
        "exampleMeaning": "\"Solid.js has fine-grained reactivity.\"",
        "note": null,
        "pron": "/ˈsɒl.ɪd/"
      },
      {
        "word": "Qwik",
        "meaningVi": "framework resumable",
        "exampleSentence": "\"Qwik is resumable.\"",
        "exampleMeaning": "\"Qwik eliminates hydration overhead.\"",
        "note": null,
        "pron": "/kwɪk/"
      },
      {
        "word": "Bun",
        "meaningVi": "runtime + bundler + package manager (nhanh hơn Node)",
        "exampleSentence": "\"Bun is super fast.\"",
        "exampleMeaning": "\"Bun is a drop-in Node replacement.\"",
        "note": null,
        "pron": "/bʌn/"
      },
      {
        "word": "Deno",
        "meaningVi": "runtime TypeScript",
        "exampleSentence": "\"Deno has built-in security.\"",
        "exampleMeaning": "\"Deno 2 supports Node compatibility.\"",
        "note": null,
        "pron": "/ˈdiː.nəʊ/"
      },
      {
        "word": "Vite",
        "meaningVi": "build tool cực nhanh",
        "exampleSentence": "\"Vite is the standard now.\"",
        "exampleMeaning": "\"Vite 6 improves HMR performance.\"",
        "note": null,
        "pron": "/viːt/"
      },
      {
        "word": "Turbopack",
        "meaningVi": "bundler của Vercel (Rust)",
        "exampleSentence": "\"Turbopack is fast.\"",
        "exampleMeaning": "\"Turbopack replaces Webpack for Next.js.\"",
        "note": null,
        "pron": "/ˈtɜː.bəʊ.pæk/"
      },
      {
        "word": "Tailwind CSS 4",
        "meaningVi": "utility-first CSS framework",
        "exampleSentence": "\"Tailwind is everywhere.\"",
        "exampleMeaning": "\"Tailwind 4 has CSS-first config.\"",
        "note": null,
        "pron": "/ˈteɪl.wɪnd/"
      },
      {
        "word": "shadcn/ui",
        "meaningVi": "bộ component dựa trên Tailwind",
        "exampleSentence": "\"shadcn/ui is the go-to.\"",
        "exampleMeaning": "\"shadcn/ui uses Radix primitives.\"",
        "note": null,
        "pron": "/ʃæd kəm/"
      },
      {
        "word": "Radix UI",
        "meaningVi": "bộ component headless",
        "exampleSentence": "\"Radix for accessibility.\"",
        "exampleMeaning": "\"Radix provides unstyled primitives.\"",
        "note": null,
        "pron": "/ˈreɪ.dɪks/"
      },
      {
        "word": "Framer Motion",
        "meaningVi": "thư viện animation React",
        "exampleSentence": "\"Framer Motion for animations.\"",
        "exampleMeaning": "\"Framer Motion uses spring physics.\"",
        "note": null,
        "pron": "/ˈfreɪ.mər ˈməʊ.ʃən/"
      },
      {
        "word": "tRPC",
        "meaningVi": "RPC type-safe cho TypeScript",
        "exampleSentence": "\"tRPC end-to-end types.\"",
        "exampleMeaning": "\"tRPC eliminates API boilerplate.\"",
        "note": null,
        "pron": "/tiː ɑː piː siː/"
      },
      {
        "word": "Hono",
        "meaningVi": "web framework nhẹ cho edge",
        "exampleSentence": "\"Hono is fast.\"",
        "exampleMeaning": "\"Hono runs on Cloudflare Workers.\"",
        "note": null,
        "pron": "/ˈhəʊ.nəʊ/"
      },
      {
        "word": "Elysia",
        "meaningVi": "framework TypeScript hiệu năng cao",
        "exampleSentence": "\"Elysia is Bun-native.\"",
        "exampleMeaning": "\"Elysia offers end-to-end type safety.\"",
        "note": null,
        "pron": "/ɪˈlɪz.i.ə/"
      },
      {
        "word": "Fastify 5",
        "meaningVi": "web framework Node.js nhanh",
        "exampleSentence": "\"Fastify beats Express.\"",
        "exampleMeaning": "\"Fastify 5 supports native HTTP/2.\"",
        "note": null,
        "pron": "/ˈfæst.i.faɪ/"
      },
      {
        "word": "NestJS 11",
        "meaningVi": "framework Node có cấu trúc",
        "exampleSentence": "\"NestJS is structured.\"",
        "exampleMeaning": "\"NestJS uses Angular patterns.\"",
        "note": null,
        "pron": "/nest dʒeɪ es/"
      },
      {
        "word": "FastAPI",
        "meaningVi": "framework Python async",
        "exampleSentence": "\"FastAPI is Pythonic.\"",
        "exampleMeaning": "\"FastAPI generates OpenAPI docs automatically.\"",
        "note": null,
        "pron": "/fɑːst eɪ piː aɪ/"
      },
      {
        "word": "Django 5",
        "meaningVi": "framework Python full-featured",
        "exampleSentence": "\"Django 5 is async-first.\"",
        "exampleMeaning": "\"Django 5 supports async ORM.\"",
        "note": null,
        "pron": "/ˈdʒæŋ.ɡəʊ/"
      },
      {
        "word": "Rails 8",
        "meaningVi": "framework Ruby on Rails",
        "exampleSentence": "\"Rails 8 with Kamal.\"",
        "exampleMeaning": "\"Rails 8 enables deployment without Docker.\"",
        "note": null,
        "pron": "/reɪlz/"
      },
      {
        "word": "Go 1.23",
        "meaningVi": "ngôn ngữ Go",
        "exampleSentence": "\"Go is fast.\"",
        "exampleMeaning": "\"Go 1.23 improves range over functions.\"",
        "note": null,
        "pron": "/ɡəʊ/"
      },
      {
        "word": "Rust",
        "meaningVi": "ngôn ngữ Rust",
        "exampleSentence": "\"Rust is hard but fast.\"",
        "exampleMeaning": "\"Rust guarantees memory safety.\"",
        "note": null,
        "pron": "/rʌst/"
      },
      {
        "word": "Actix Web",
        "meaningVi": "framework web Rust",
        "exampleSentence": "\"Actix is the fastest.\"",
        "exampleMeaning": "\"Actix Web benchmarks top the list.\"",
        "note": null,
        "pron": "/ˈæk.tɪks/"
      },
      {
        "word": "Axum",
        "meaningVi": "framework web Rust (Tokio)",
        "exampleSentence": "\"Axum is ergonomic.\"",
        "exampleMeaning": "\"Axum integrates with Tokio ecosystem.\"",
        "note": null,
        "pron": "/ˈæk.sʌm/"
      },
      {
        "word": "Spring Boot 3",
        "meaningVi": "framework Java",
        "exampleSentence": "\"Spring Boot 3 is Jakarta.\"",
        "exampleMeaning": "\"Spring Boot 3 requires Java 17+.\"",
        "note": null,
        "pron": "/sprɪŋ buːt/"
      },
      {
        "word": "Quarkus",
        "meaningVi": "framework Java cho Kubernetes",
        "exampleSentence": "\"Quarkus is cloud-native.\"",
        "exampleMeaning": "\"Quarkus enables GraalVM native images.\"",
        "note": null,
        "pron": "/ˈkwɑː.kəs/"
      },
      {
        "word": "Elixir / Phoenix",
        "meaningVi": "ngôn ngữ + framework",
        "exampleSentence": "\"Phoenix LiveView.\"",
        "exampleMeaning": "\"Phoenix enables real-time apps.\"",
        "note": null,
        "pron": "/ɪˈlɪk.sɪər/ /ˈfiː.nɪks/"
      },
      {
        "word": "PostgreSQL 17",
        "meaningVi": "database SQL mạnh nhất",
        "exampleSentence": "\"PG is the best.\"",
        "exampleMeaning": "\"PostgreSQL 17 improves logical replication.\"",
        "note": null,
        "pron": "/pəʊstɡrɛs/"
      },
      {
        "word": "pgvector",
        "meaningVi": "extension vector cho Postgres",
        "exampleSentence": "\"pgvector for RAG.\"",
        "exampleMeaning": "\"pgvector enables vector search in Postgres.\"",
        "note": null,
        "pron": "/piː dʒiː ˈvek.tər/"
      },
      {
        "word": "Prisma",
        "meaningVi": "ORM TypeScript",
        "exampleSentence": "\"Prisma is nice.\"",
        "exampleMeaning": "\"Prisma generates types from schema.\"",
        "note": null,
        "pron": "/ˈprɪz.mə/"
      },
      {
        "word": "Drizzle ORM",
        "meaningVi": "ORM TypeScript nhẹ",
        "exampleSentence": "\"Drizzle is fast.\"",
        "exampleMeaning": "\"Drizzle uses TypeScript inference.\"",
        "note": null,
        "pron": "/ˈdrɪz.əl/"
      },
      {
        "word": "Supabase",
        "meaningVi": "backend-as-a-service",
        "exampleSentence": "\"Supabase is Firebase alt.\"",
        "exampleMeaning": "\"Supabase is built on Postgres.\"",
        "note": null,
        "pron": "/ˈsuː.pə.beɪs/"
      },
      {
        "word": "Neon",
        "meaningVi": "serverless Postgres",
        "exampleSentence": "\"Neon is serverless.\"",
        "exampleMeaning": "\"Neon separates compute from storage.\"",
        "note": null,
        "pron": "/ˈniː.ɒn/"
      },
      {
        "word": "PlanetScale",
        "meaningVi": "MySQL serverless",
        "exampleSentence": "\"PlanetScale for MySQL.\"",
        "exampleMeaning": "\"PlanetScale offers branching for schemas.\"",
        "note": null,
        "pron": "/ˈplæn.ɪt skeɪl/"
      },
      {
        "word": "MongoDB Atlas",
        "meaningVi": "MongoDB cloud",
        "exampleSentence": "\"MongoDB Atlas is managed.\"",
        "exampleMeaning": "\"Atlas provides global clusters.\"",
        "note": null,
        "pron": "/ˈmɒŋ.ɡəʊ/"
      },
      {
        "word": "Redis 8",
        "meaningVi": "cache + queue",
        "exampleSentence": "\"Redis is everywhere.\"",
        "exampleMeaning": "\"Redis 8 supports vector search.\"",
        "note": null,
        "pron": "/ˈred.ɪs/"
      },
      {
        "word": "Upstash",
        "meaningVi": "Redis serverless",
        "exampleSentence": "\"Upstash is cheap.\"",
        "exampleMeaning": "\"Upstash offers per-request pricing.\"",
        "note": null,
        "pron": "/ˈʌp.stæʃ/"
      },
      {
        "word": "DuckDB",
        "meaningVi": "database analytics in-process",
        "exampleSentence": "\"DuckDB is fast.\"",
        "exampleMeaning": "\"DuckDB is the SQLite of analytics.\"",
        "note": null,
        "pron": "/dʌk diː biː/"
      },
      {
        "word": "SQLite",
        "meaningVi": "database nhúng",
        "exampleSentence": "\"SQLite is everywhere.\"",
        "exampleMeaning": "\"SQLite supports JSON1 natively.\"",
        "note": null,
        "pron": "/ˌes kjuː ˈlaɪt/"
      },
      {
        "word": "Vercel",
        "meaningVi": "platform cho Next.js",
        "exampleSentence": "\"Deploy on Vercel.\"",
        "exampleMeaning": "\"Vercel optimizes for frontend frameworks.\"",
        "note": null,
        "pron": "/ˈvɜː.səl/"
      },
      {
        "word": "Cloudflare Workers",
        "meaningVi": "edge serverless",
        "exampleSentence": "\"Workers run at the edge.\"",
        "exampleMeaning": "\"Workers use V8 isolates.\"",
        "note": null,
        "pron": "/ˈklaʊd.fleər ˈwɜː.kərz/"
      },
      {
        "word": "Fly.io",
        "meaningVi": "platform deploy gần user",
        "exampleSentence": "\"Fly.io has edge.\"",
        "exampleMeaning": "\"Fly.io runs on Firecracker microVMs.\"",
        "note": null,
        "pron": "/flaɪ aɪ əʊ/"
      },
      {
        "word": "Railway",
        "meaningVi": "platform deploy dễ",
        "exampleSentence": "\"Railway is simple.\"",
        "exampleMeaning": "\"Railway offers managed databases.\"",
        "note": null,
        "pron": "/ˈreɪl.weɪ/"
      },
      {
        "word": "Render",
        "meaningVi": "platform cloud",
        "exampleSentence": "\"Render is like Heroku.\"",
        "exampleMeaning": "\"Render provides auto-deploy from Git.\"",
        "note": null,
        "pron": "/ˈren.dər/"
      },
      {
        "word": "AWS Lambda",
        "meaningVi": "serverless functions",
        "exampleSentence": "\"Use Lambda.\"",
        "exampleMeaning": "\"Lambda charges per millisecond.\"",
        "note": null,
        "pron": "/ˈlæm.də/"
      },
      {
        "word": "Edge Functions",
        "meaningVi": "functions chạy ở edge",
        "exampleSentence": "\"Edge functions are fast.\"",
        "exampleMeaning": "\"Edge functions reduce latency.\"",
        "note": null,
        "pron": "/edʒ ˈfʌŋk.ʃənz/"
      },
      {
        "word": "WASM (WebAssembly)",
        "meaningVi": "binary format chạy gần native",
        "exampleSentence": "\"WASM in browser.\"",
        "exampleMeaning": "\"WASM enables near-native performance.\"",
        "note": null,
        "pron": "/wɒzəm/"
      },
      {
        "word": "Litestream",
        "meaningVi": "replication SQLite",
        "exampleSentence": "\"Litestream for backups.\"",
        "exampleMeaning": "\"Litestream enables SQLite at scale.\"",
        "note": null,
        "pron": "/ˈlɪt.striːm/"
      },
      {
        "word": "eBPF",
        "meaningVi": "sandbox kernel Linux",
        "exampleSentence": "\"eBPF for observability.\"",
        "exampleMeaning": "\"eBPF runs programs in kernel space.\"",
        "note": null,
        "pron": "/iː biː piː ef/"
      },
      {
        "word": "K8s (Kubernetes)",
        "meaningVi": "orchestration container",
        "exampleSentence": "\"K8s is complex.\"",
        "exampleMeaning": "\"Kubernetes manages containerized workloads.\"",
        "note": null,
        "pron": "/keɪ eɪts/"
      },
      {
        "word": "Helm",
        "meaningVi": "package manager K8s",
        "exampleSentence": "\"Helm charts.\"",
        "exampleMeaning": "\"Helm templates Kubernetes manifests.\"",
        "note": null,
        "pron": "/helm/"
      },
      {
        "word": "ArgoCD",
        "meaningVi": "GitOps cho K8s",
        "exampleSentence": "\"ArgoCD for CD.\"",
        "exampleMeaning": "\"ArgoCD enables declarative deployments.\"",
        "note": null,
        "pron": "/ˈɑː.ɡəʊ siː diː/"
      },
      {
        "word": "Pulumi",
        "meaningVi": "IaC dùng ngôn ngữ lập trình",
        "exampleSentence": "\"Pulumi over Terraform?\"",
        "exampleMeaning": "\"Pulumi supports TypeScript natively.\"",
        "note": null,
        "pron": "/ˈpʌl.juː.mi/"
      },
      {
        "word": "OpenTelemetry",
        "meaningVi": "chuẩn observability",
        "exampleSentence": "\"OTel is the standard.\"",
        "exampleMeaning": "\"OpenTelemetry unifies tracing.\"",
        "note": null,
        "pron": "/ˈəʊ.pən təˈle.mə.tri/"
      },
      {
        "word": "Cursor",
        "meaningVi": "IDE có AI tích hợp",
        "exampleSentence": "\"Cursor is AI-first.\"",
        "exampleMeaning": "\"Cursor has built-in LLM integration.\"",
        "note": null,
        "pron": "/ˈkɜː.sər/"
      },
      {
        "word": "Copilot",
        "meaningVi": "GitHub AI assistant",
        "exampleSentence": "\"Copilot speeds me up.\"",
        "exampleMeaning": "\"GitHub Copilot uses OpenAI models.\"",
        "note": null,
        "pron": "/ˈkəʊ.paɪ.lɒt/"
      },
      {
        "word": "Cody (Sourcegraph)",
        "meaningVi": "AI code assistant",
        "exampleSentence": "\"Cody knows the codebase.\"",
        "exampleMeaning": "\"Cody uses codebase context.\"",
        "note": null,
        "pron": "/ˈkəʊ.di/"
      },
      {
        "word": "LangChain",
        "meaningVi": "framework cho LLM apps",
        "exampleSentence": "\"LangChain is everywhere.\"",
        "exampleMeaning": "\"LangChain simplifies LLM orchestration.\"",
        "note": null,
        "pron": "/læŋ tʃeɪn/"
      },
      {
        "word": "LangGraph",
        "meaningVi": "framework agent",
        "exampleSentence": "\"LangGraph for agents.\"",
        "exampleMeaning": "\"LangGraph enables stateful agents.\"",
        "note": null,
        "pron": "/læŋ ɡræf/"
      },
      {
        "word": "LlamaIndex",
        "meaningVi": "framework cho RAG",
        "exampleSentence": "\"LlamaIndex for RAG.\"",
        "exampleMeaning": "\"LlamaIndex specializes in data frameworks.\"",
        "note": null,
        "pron": "/lɑː.mə ˈɪn.deks/"
      },
      {
        "word": "Vercel AI SDK",
        "meaningVi": "SDK AI cho Next.js",
        "exampleSentence": "\"AI SDK is nice.\"",
        "exampleMeaning": "\"Vercel AI SDK supports streaming.\"",
        "note": null,
        "pron": "/vɜː.səl eɪ aɪ/"
      },
      {
        "word": "Pinecone",
        "meaningVi": "vector DB cloud",
        "exampleSentence": "\"Pinecone for vectors.\"",
        "exampleMeaning": "\"Pinecone offers managed vector search.\"",
        "note": null,
        "pron": "/ˈpaɪn.kəʊn/"
      }
    ]
  },
  {
    "name": "Cloud & infra",
    "icon": "🌩️",
    "words": [
      {
        "word": "cloud",
        "meaningVi": "điện toán đám mây",
        "exampleSentence": "\"It's in the cloud.\"",
        "exampleMeaning": "\"Cloud computing offers scalability.\"",
        "note": null,
        "pron": "/klaʊd/"
      },
      {
        "word": "on-prem",
        "meaningVi": "on-premise (tại chỗ)",
        "exampleSentence": "\"On-prem is expensive.\"",
        "exampleMeaning": "\"On-premise infrastructure.\"",
        "note": null,
        "pron": "/ɒn prem/"
      },
      {
        "word": "hybrid",
        "meaningVi": "kết hợp",
        "exampleSentence": "\"Hybrid cloud.\"",
        "exampleMeaning": "\"Hybrid deployment model.\"",
        "note": null,
        "pron": "/ˈhaɪ.brɪd/"
      },
      {
        "word": "multi-cloud",
        "meaningVi": "nhiều cloud",
        "exampleSentence": "\"Multi-cloud strategy.\"",
        "exampleMeaning": "\"Avoid vendor lock-in with multi-cloud.\"",
        "note": null,
        "pron": "/ˌmʌl.ti klaʊd/"
      },
      {
        "word": "serverless",
        "meaningVi": "không cần quản lý server",
        "exampleSentence": "\"Go serverless!\"",
        "exampleMeaning": "\"Serverless reduces operational overhead.\"",
        "note": null,
        "pron": "/ˈsɜː.və.ləs/"
      },
      {
        "word": "a VM",
        "meaningVi": "virtual machine",
        "exampleSentence": "\"Spin up a VM.\"",
        "exampleMeaning": "\"VMs provide isolated compute.\"",
        "note": null,
        "pron": "/viː em/"
      },
      {
        "word": "a container",
        "meaningVi": "container",
        "exampleSentence": "\"Run in a container.\"",
        "exampleMeaning": "\"Containers ensure consistency.\"",
        "note": null,
        "pron": "/kənˈteɪ.nər/"
      },
      {
        "word": "orchestration",
        "meaningVi": "điều phối",
        "exampleSentence": "\"Use orchestration.\"",
        "exampleMeaning": "\"Kubernetes handles orchestration.\"",
        "note": null,
        "pron": "/ˌɔː.kɪˈstreɪ.ʃən/"
      },
      {
        "word": "IaC (Infrastructure as Code)",
        "meaningVi": "hạ tầng dưới dạng code",
        "exampleSentence": "\"Use IaC.\"",
        "exampleMeaning": "\"IaC enables reproducibility.\"",
        "note": null,
        "pron": "/aɪ eɪ siː/"
      },
      {
        "word": "GitOps",
        "meaningVi": "quản lý infra qua Git",
        "exampleSentence": "\"GitOps all the way.\"",
        "exampleMeaning": "\"GitOps enables declarative ops.\"",
        "note": null,
        "pron": "/ɡɪt ɒps/"
      },
      {
        "word": "CI/CD",
        "meaningVi": "continuous integration/deployment",
        "exampleSentence": "\"Set up CI/CD.\"",
        "exampleMeaning": "\"CI/CD pipelines automate delivery.\"",
        "note": null,
        "pron": "/siː aɪ siː diː/"
      },
      {
        "word": "a pipeline",
        "meaningVi": "đường ống (CI/CD)",
        "exampleSentence": "\"Pipeline is green.\"",
        "exampleMeaning": "\"The pipeline failed at the test stage.\"",
        "note": null,
        "pron": "/ˈpaɪp.laɪn/"
      },
      {
        "word": "a build",
        "meaningVi": "bản build",
        "exampleSentence": "\"Build succeeded.\"",
        "exampleMeaning": "\"Build artifacts are stored in S3.\"",
        "note": null,
        "pron": "/bɪld/"
      },
      {
        "word": "an artifact",
        "meaningVi": "sản phẩm build",
        "exampleSentence": "\"Upload artifacts.\"",
        "exampleMeaning": "\"Artifacts are versioned.\"",
        "note": null,
        "pron": "/ˈɑː.tɪ.fækt/"
      },
      {
        "word": "a registry",
        "meaningVi": "nơi lưu image",
        "exampleSentence": "\"Push to registry.\"",
        "exampleMeaning": "\"Docker Hub is a public registry.\"",
        "note": null,
        "pron": "/ˈredʒ.ɪ.stri/"
      },
      {
        "word": "a CDN",
        "meaningVi": "Content Delivery Network",
        "exampleSentence": "\"Use a CDN.\"",
        "exampleMeaning": "\"CDN reduces latency globally.\"",
        "note": null,
        "pron": "/siː diː en/"
      },
      {
        "word": "edge",
        "meaningVi": "biên mạng (gần user)",
        "exampleSentence": "\"Run at the edge.\"",
        "exampleMeaning": "\"Edge computing reduces round-trip.\"",
        "note": null,
        "pron": "/edʒ/"
      },
      {
        "word": "a region",
        "meaningVi": "vùng (địa lý cloud)",
        "exampleSentence": "\"Pick the closest region.\"",
        "exampleMeaning": "\"Choose region for data residency.\"",
        "note": null,
        "pron": "/ˈriː.dʒən/"
      },
      {
        "word": "an availability zone (AZ)",
        "meaningVi": "trung tâm dữ liệu",
        "exampleSentence": "\"Multi-AZ for HA.\"",
        "exampleMeaning": "\"Multi-AZ deployments ensure uptime.\"",
        "note": null,
        "pron": "/əˌveɪ.ləˈbɪl.ɪ.ti zəʊn/"
      },
      {
        "word": "high availability (HA)",
        "meaningVi": "tính sẵn sàng cao",
        "exampleSentence": "\"HA setup.\"",
        "exampleMeaning": "\"HA requires redundant infrastructure.\"",
        "note": null,
        "pron": "/haɪ əˌveɪ.ləˈbɪl.ɪ.ti/"
      },
      {
        "word": "DR (disaster recovery)",
        "meaningVi": "khôi phục sau sự cố",
        "exampleSentence": "\"DR plan?\"",
        "exampleMeaning": "\"Disaster recovery must be tested.\"",
        "note": null,
        "pron": "/diː ɑːr/"
      },
      {
        "word": "RPO / RTO",
        "meaningVi": "Recovery Point/Time Objective",
        "exampleSentence": "\"RPO is 1 hour.\"",
        "exampleMeaning": "\"RTO must be under 15 minutes.\"",
        "note": null,
        "pron": "/ɑːr piː əʊ/ /ɑːr tiː əʊ/"
      },
      {
        "word": "a load balancer",
        "meaningVi": "cân bằng tải",
        "exampleSentence": "\"Add a load balancer.\"",
        "exampleMeaning": "\"Load balancers distribute traffic.\"",
        "note": null,
        "pron": "/ləʊd ˈbæl.ən.sər/"
      },
      {
        "word": "an auto-scaling",
        "meaningVi": "tự động mở rộng",
        "exampleSentence": "\"Auto-scale on traffic.\"",
        "exampleMeaning": "\"Auto-scaling reduces costs.\"",
        "note": null,
        "pron": "/ˈɔː.təʊ skeɪ.lɪŋ/"
      },
      {
        "word": "a health check",
        "meaningVi": "kiểm tra sức khỏe",
        "exampleSentence": "\"Health check failed.\"",
        "exampleMeaning": "\"Health checks determine routing.\"",
        "note": null,
        "pron": "/helθ tʃek/"
      },
      {
        "word": "observability",
        "meaningVi": "khả năng quan sát hệ thống",
        "exampleSentence": "\"Observability stack.\"",
        "exampleMeaning": "\"Observability enables debugging.\"",
        "note": null,
        "pron": "/əbˌzɜː.vəˈbɪl.ɪ.ti/"
      },
      {
        "word": "monitoring",
        "meaningVi": "giám sát",
        "exampleSentence": "\"Set up monitoring.\"",
        "exampleMeaning": "\"Monitoring alerts on anomalies.\"",
        "note": null,
        "pron": "/ˈmɒn.ɪ.tə.rɪŋ/"
      },
      {
        "word": "logging",
        "meaningVi": "ghi log",
        "exampleSentence": "\"Centralized logging.\"",
        "exampleMeaning": "\"Logging enables postmortem analysis.\"",
        "note": null,
        "pron": "/ˈlɒɡ.ɪŋ/"
      },
      {
        "word": "tracing",
        "meaningVi": "truy vết request",
        "exampleSentence": "\"Distributed tracing.\"",
        "exampleMeaning": "\"Tracing shows request flow.\"",
        "note": null,
        "pron": "/ˈtreɪ.sɪŋ/"
      },
      {
        "word": "metrics",
        "meaningVi": "chỉ số",
        "exampleSentence": "\"Track metrics.\"",
        "exampleMeaning": "\"Metrics drive observability.\"",
        "note": null,
        "pron": "/ˈmet.rɪks/"
      },
      {
        "word": "an alert",
        "meaningVi": "cảnh báo",
        "exampleSentence": "\"Alert fired.\"",
        "exampleMeaning": "\"Configure alerts for critical paths.\"",
        "note": null,
        "pron": "/əˈlɜːt/"
      },
      {
        "word": "a dashboard",
        "meaningVi": "bảng điều khiển",
        "exampleSentence": "\"Check the dashboard.\"",
        "exampleMeaning": "\"Dashboards visualize metrics.\"",
        "note": null,
        "pron": "/ˈdæʃ.bɔːd/"
      },
      {
        "word": "an incident",
        "meaningVi": "sự cố",
        "exampleSentence": "\"Major incident.\"",
        "exampleMeaning": "\"Incident response procedures must be followed.\"",
        "note": null,
        "pron": "/ˈɪn.sɪ.dənt/"
      },
      {
        "word": "a postmortem",
        "meaningVi": "phân tích sự cố",
        "exampleSentence": "\"Write a postmortem.\"",
        "exampleMeaning": "\"Postmortems drive improvements.\"",
        "note": null,
        "pron": "/pəʊstˈmɔː.təm/"
      },
      {
        "word": "an on-call",
        "meaningVi": "trực (sự cố)",
        "exampleSentence": "\"On-call this week.\"",
        "exampleMeaning": "\"On-call rotations balance load.\"",
        "note": null,
        "pron": "/ɒn kɔːl/"
      },
      {
        "word": "PagerDuty",
        "meaningVi": "công cụ on-call",
        "exampleSentence": "\"Got paged.\"",
        "exampleMeaning": "\"PagerDuty manages incidents.\"",
        "note": null,
        "pron": "/ˈpeɪ.dʒər.djuː.ti/"
      },
      {
        "word": "an SLA",
        "meaningVi": "Service Level Agreement",
        "exampleSentence": "\"SLA is 99.9%.\"",
        "exampleMeaning": "\"SLAs define reliability targets.\"",
        "note": null,
        "pron": "/es el eɪ/"
      },
      {
        "word": "SLO",
        "meaningVi": "Service Level Objective",
        "exampleSentence": "\"SLO: 99.9% uptime.\"",
        "exampleMeaning": "\"SLOs are internal targets.\"",
        "note": null,
        "pron": "/es el əʊ/"
      },
      {
        "word": "SLI",
        "meaningVi": "Service Level Indicator",
        "exampleSentence": "\"Track SLIs.\"",
        "exampleMeaning": "\"SLIs measure user experience.\"",
        "note": null,
        "pron": "/es el aɪ/"
      },
      {
        "word": "an error budget",
        "meaningVi": "ngân sách lỗi",
        "exampleSentence": "\"We have budget.\"",
        "exampleMeaning": "\"Error budgets balance reliability and velocity.\"",
        "note": null,
        "pron": "/ˈer.ər ˈbʌdʒ.ɪt/"
      },
      {
        "word": "chaos engineering",
        "meaningVi": "kỹ thuật gây lỗi để test",
        "exampleSentence": "\"Chaos testing.\"",
        "exampleMeaning": "\"Chaos engineering builds resilience.\"",
        "note": null,
        "pron": "/ˈkeɪ.ɒs ˌen.dʒɪˈnɪə.rɪŋ/"
      },
      {
        "word": "a feature flag",
        "meaningVi": "cờ bật/tắt tính năng",
        "exampleSentence": "\"Toggle the flag.\"",
        "exampleMeaning": "\"Feature flags enable safe rollouts.\"",
        "note": null,
        "pron": "/ˈfiː.tʃər flæɡ/"
      },
      {
        "word": "canary deploy",
        "meaningVi": "triển khai thử cho 1%",
        "exampleSentence": "\"Canary first.\"",
        "exampleMeaning": "\"Canary deployments reduce risk.\"",
        "note": null,
        "pron": "/kəˈneə.ri dɪˈplɔɪ/"
      },
      {
        "word": "blue-green deploy",
        "meaningVi": "triển khai 2 môi trường",
        "exampleSentence": "\"Blue-green deploy.\"",
        "exampleMeaning": "\"Blue-green enables zero-downtime.\"",
        "note": null,
        "pron": "/bluː ɡriːn dɪˈplɔɪ/"
      },
      {
        "word": "a rollback",
        "meaningVi": "quay lại phiên bản cũ",
        "exampleSentence": "\"Roll back!\"",
        "exampleMeaning": "\"Rollback procedures must be tested.\"",
        "note": null,
        "pron": "/ˈrəʊl.bæk/"
      },
      {
        "word": "a green-blue deploy",
        "meaningVi": "triển khai ngược màu",
        "exampleSentence": "\"Use green-blue.\"",
        "exampleMeaning": null,
        "note": null,
        "pron": "/ɡriːn bluː dɪˈplɔɪ/"
      },
      {
        "word": "microservices",
        "meaningVi": "kiến trúc vi dịch vụ",
        "exampleSentence": "\"Microservices all the way.\"",
        "exampleMeaning": "\"Microservices enable independent scaling.\"",
        "note": null,
        "pron": "/ˈmaɪ.krəʊˌsɜː.vɪs.ɪz/"
      },
      {
        "word": "a monolith",
        "meaningVi": "kiến trúc nguyên khối",
        "exampleSentence": "\"From monolith to microservices.\"",
        "exampleMeaning": "\"Monoliths are simpler to start.\"",
        "note": null,
        "pron": "/ˈmɒn.ə.lɪθ/"
      },
      {
        "word": "a service mesh",
        "meaningVi": "lưới dịch vụ",
        "exampleSentence": "\"Use Istio.\"",
        "exampleMeaning": "\"Service meshes manage service-to-service.\"",
        "note": null,
        "pron": "/ˈsɜː.vɪs meʃ/"
      },
      {
        "word": "an event-driven",
        "meaningVi": "hướng sự kiện",
        "exampleSentence": "\"Event-driven architecture.\"",
        "exampleMeaning": "\"Event-driven systems decouple services.\"",
        "note": null,
        "pron": "/ɪˈvent ˈdrɪv.ən/"
      }
    ]
  }
];

const EN_GRAMMAR: GrammarSeed[] = [
  {
    "level": "A1",
    "title": "Present Simple & Present Continuous",
    "structure": "Present Simple: (+) S + V(s/es) | (-) S + do/does not + V | (?) Do/Does + S + V?  ||  Present Continuous: S + am/is/are + V-ing",
    "explanation": "<p><strong>Present Simple</strong> — thói quen, sự thật hiển nhiên, việc thường xuyên.</p><p><strong>Present Continuous</strong> — hành động đang diễn ra tại thời điểm nói (am/is/are + V-ing).</p>",
    "examples": [
      {
        "sentence": "I write code every day.",
        "meaningVi": "Tôi viết code mỗi ngày."
      },
      {
        "sentence": "She is debugging the code at the moment.",
        "meaningVi": "Cô ấy đang gỡ lỗi code ngay lúc này."
      },
      {
        "sentence": "The server is running on port 8080.",
        "meaningVi": "Máy chủ đang chạy trên cổng 8080."
      }
    ],
    "commonMistakes": "❌ \"He is knowing the answer.\" → ✅ \"He knows the answer.\" (know không dùng continuous). ❌ \"I am writing code from 2 hours.\" → ✅ \"I have been writing code for 2 hours.\"",
    "comparedWith": null
  },
  {
    "level": "A2",
    "title": "Past Simple & Past Continuous",
    "structure": "Past Simple: S + V2 | (-) S + did not + V | (?) Did + S + V?  ||  Past Continuous: S + was/were + V-ing",
    "explanation": "<p><strong>Past Simple</strong> — hành động đã hoàn thành trong quá khứ với thời gian cụ thể.</p><p><strong>Past Continuous</strong> — hành động đang diễn ra tại một thời điểm trong quá khứ, hoặc hai hành động song song.</p>",
    "examples": [
      {
        "sentence": "I fixed the bug yesterday.",
        "meaningVi": "Tôi đã sửa lỗi hôm qua."
      },
      {
        "sentence": "I was debugging when the server crashed.",
        "meaningVi": "Tôi đang gỡ lỗi thì máy chủ sập."
      },
      {
        "sentence": "She deployed the app last week.",
        "meaningVi": "Cô ấy đã triển khai ứng dụng tuần trước."
      }
    ],
    "commonMistakes": "❌ \"I have wrote a function.\" → ✅ \"I wrote a function.\" ❌ \"She have fixed the bug.\" → ✅ \"She fixed the bug.\"",
    "comparedWith": null
  },
  {
    "level": "A2",
    "title": "Present Perfect",
    "structure": "S + have/has + V3 (past participle). Dùng với already, yet, ever, for, since.",
    "explanation": "<p><strong>Present Perfect</strong> — sự việc trong quá khứ có liên quan/ảnh hưởng đến hiện tại, hoặc chưa xác định thời gian cụ thể.</p>",
    "examples": [
      {
        "sentence": "I have fixed 3 bugs today.",
        "meaningVi": "Hôm nay tôi đã sửa 3 lỗi."
      },
      {
        "sentence": "She has worked on this project for 2 months.",
        "meaningVi": "Cô ấy đã làm dự án này được 2 tháng."
      },
      {
        "sentence": "Have you tried restarting the server?",
        "meaningVi": "Bạn đã thử khởi động lại máy chủ chưa?"
      }
    ],
    "commonMistakes": "❌ \"I have implemented it yesterday.\" → ✅ \"I implemented it yesterday.\" (có thời gian cụ thể dùng Past Simple).",
    "comparedWith": "Present Perfect (không nói thời gian: for 2 weeks, already, yet, ever) vs Past Simple (thời gian cụ thể: yesterday, last Monday)."
  },
  {
    "level": "B1",
    "title": "Future & Conditionals",
    "structure": "will + V (quyết định tức thì) | be going to + V (kế hoạch có sẵn). Type 1: If + Present, will + V | Type 2: If + Past, would + V | Type 3: If + Past Perfect, would have + V3",
    "explanation": "<p><strong>Will</strong> = quyết định ngay lúc nói. <strong>Be going to</strong> = kế hoạch đã có hoặc dự đoán có bằng chứng.</p><p>Câu điều kiện loại 1 (có thể xảy ra), loại 2 (giả định không có thật ở hiện tại), loại 3 (giả định không có thật trong quá khứ).</p>",
    "examples": [
      {
        "sentence": "I'll deploy the app now.",
        "meaningVi": "Tôi sẽ triển khai ứng dụng ngay bây giờ."
      },
      {
        "sentence": "If I fix the bug, the app will work.",
        "meaningVi": "Nếu tôi sửa lỗi, ứng dụng sẽ chạy."
      },
      {
        "sentence": "If we had used a cache, the response would have been faster.",
        "meaningVi": "Nếu chúng ta đã dùng cache, phản hồi đã nhanh hơn."
      }
    ],
    "commonMistakes": null,
    "comparedWith": "Will = spontaneous (tức thì); Going to = kế hoạch đã có / dự đoán có bằng chứng."
  },
  {
    "level": "B1",
    "title": "Passive Voice",
    "structure": "S + be + V3 (+ by + tác nhân). Các thì: is/are done, was/were done, is being done, has been done, will be done.",
    "explanation": "<p><strong>Passive Voice</strong> — dùng khi người thực hiện không quan trọng hoặc muốn nhấn mạnh kết quả/đối tượng bị tác động.</p>",
    "examples": [
      {
        "sentence": "The code is reviewed by the team lead.",
        "meaningVi": "Code được team lead review."
      },
      {
        "sentence": "The database was migrated last night.",
        "meaningVi": "Cơ sở dữ liệu đã được migrate tối qua."
      },
      {
        "sentence": "The bug has been fixed and deployed.",
        "meaningVi": "Lỗi đã được sửa và triển khai."
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  },
  {
    "level": "B1",
    "title": "Relative Clauses",
    "structure": "who/that (người), which/that (vật), whose (sở hữu), where (nơi chốn), when (thời gian).",
    "explanation": "<p><strong>Mệnh đề quan hệ xác định</strong> (không có dấu phẩy — bắt buộc để hiểu nghĩa) và <strong>không xác định</strong> (có dấu phẩy — bổ sung thông tin thêm).</p>",
    "examples": [
      {
        "sentence": "The developer who wrote this code is on leave.",
        "meaningVi": "Lập trình viên viết đoạn code này đang nghỉ phép."
      },
      {
        "sentence": "My colleague, who works on the frontend, helped me.",
        "meaningVi": "Đồng nghiệp của tôi, người làm frontend, đã giúp tôi."
      },
      {
        "sentence": "The server where the data is stored is down.",
        "meaningVi": "Máy chủ nơi lưu dữ liệu đang bị sập."
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  },
  {
    "level": "B1",
    "title": "Modal Verbs",
    "structure": "can/could/may/might/must/should/would/will + V (nguyên mẫu). Modal + have + V3 = quá khứ/giả định.",
    "explanation": "<p><strong>Modal verbs</strong> diễn tả khả năng, sự cho phép, lời khuyên, nghĩa vụ. \"should have done\" = đáng lẽ phải làm (nhưng chưa); \"could have done\" = có thể đã làm (nhưng không).</p>",
    "examples": [
      {
        "sentence": "You should write a test before deploying.",
        "meaningVi": "Bạn nên viết test trước khi triển khai."
      },
      {
        "sentence": "The code should have been reviewed.",
        "meaningVi": "Đáng lẽ code phải được review."
      },
      {
        "sentence": "Could you review my pull request?",
        "meaningVi": "Bạn có thể review pull request của tôi không?"
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  },
  {
    "level": "B1",
    "title": "Reported Speech",
    "structure": "S + said (that) + mệnh đề lùi thì. Chuyển: will → would, can → could, is → was, are → were.",
    "explanation": "<p><strong>Reported Speech</strong> — thuật lại lời của người khác. Khi động từ tường thuật ở quá khứ thì phải lùi thì.</p>",
    "examples": [
      {
        "sentence": "He said that the bug was fixed.",
        "meaningVi": "Anh ấy nói rằng lỗi đã được sửa."
      },
      {
        "sentence": "She said she would deploy the app.",
        "meaningVi": "Cô ấy nói cô ấy sẽ triển khai ứng dụng."
      },
      {
        "sentence": "The manager told us not to push to main.",
        "meaningVi": "Quản lý bảo chúng tôi đừng push lên nhánh main."
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  },
  {
    "level": "B2",
    "title": "Causative (have/get something done)",
    "structure": "have/get + something + V3 (past participle) — nhờ/khiến ai đó làm việc gì.",
    "explanation": "<p><strong>Causative</strong> — diễn tả việc mình không tự làm mà nhờ người khác làm giúp.</p>",
    "examples": [
      {
        "sentence": "I had my code reviewed by a senior developer.",
        "meaningVi": "Tôi nhờ một lập trình viên senior review code của mình."
      },
      {
        "sentence": "She got her laptop fixed.",
        "meaningVi": "Cô ấy mang laptop đi sửa."
      },
      {
        "sentence": "We should get the server checked.",
        "meaningVi": "Chúng ta nên cho kiểm tra máy chủ."
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  }
];

const EN_CONVERSATION: ConversationSeed[] = [
  {
    "question": "\"Sure, let me walk you through my approach...\"",
    "answer": "Bắt đầu giải thích thuật toán",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Great question! Let me think about this for a second...\"",
    "answer": "Cần suy nghĩ trước khi trả lời",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sure, I can explain how [X] works...\"",
    "answer": "Khi được hỏi về khái niệm",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me start by clarifying the requirements...\"",
    "answer": "Hỏi rõ yêu cầu trước",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Before I dive in, can I ask a clarifying question?\"",
    "answer": "Cần hỏi thêm",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"So basically...\"",
    "answer": "Bắt đầu giải thích đơn giản",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"The idea here is that...\"",
    "answer": "Giải thích concept",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me think out loud...\"",
    "answer": "Nói ra suy nghĩ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"So if I understand correctly...\"",
    "answer": "Paraphrase câu hỏi",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Hmm, that's a good point. I think...\"",
    "answer": "Phản hồi có suy nghĩ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"From my understanding...\"",
    "answer": "Trình bày hiểu biết",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm not 100% sure about this, but...\"",
    "answer": "Nói ra điều không chắc chắn",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Great question, let me think about that for a second.\"",
    "answer": "Câu hỏi khó, cần suy nghĩ",
    "meaningVi": "Cần thời gian",
    "note": null
  },
  {
    "question": "\"Hmm, that's a good point. Let me think...\"",
    "answer": "Sau khi người khác nói",
    "meaningVi": "Cần thời gian",
    "note": null
  },
  {
    "question": "\"Just a sec, I want to make sure I give you a good answer.\"",
    "answer": "Đang cần thời gian thực sự",
    "meaningVi": "Cần thời gian",
    "note": null
  },
  {
    "question": "\"Could you clarify what you mean by [X]?\"",
    "answer": "Không hiểu câu hỏi",
    "meaningVi": "Chưa rõ ý",
    "note": null
  },
  {
    "question": "\"If I understand correctly, you're asking about [X]?\"",
    "answer": "Paraphrase lại để xác nhận",
    "meaningVi": "Chưa rõ ý",
    "note": null
  },
  {
    "question": "\"Let me start by saying...\"",
    "answer": "Bắt đầu một chủ đề",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"So basically, what I'm trying to say is...\"",
    "answer": "Tóm tắt",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"The way I see it...\"",
    "answer": "Đưa quan điểm",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"From my perspective...\"",
    "answer": "Đưa quan điểm (formal)",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"If I may, I'd like to add...\"",
    "answer": "Muốn thêm ý",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Sorry, just to back up for a sec...\"",
    "answer": "Quay lại ý trước",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Just to clarify...\"",
    "answer": "Làm rõ",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"I want to make sure I'm not missing anything...\"",
    "answer": "Kiểm tra hiểu biết",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Let me put it this way...\"",
    "answer": "Giải thích lại bằng cách khác",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Here's the thing...\"",
    "answer": "Đưa ra điểm chính",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"OK so, where were we?\"",
    "answer": "Quay lại sau khi bị ngắt",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Sorry, going back to what [name] said...\"",
    "answer": "Quay lại ý ai đó",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Just to pick up on what you said...\"",
    "answer": "Tiếp tục ý ai đó",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"That's a great question, actually.\"",
    "answer": "Bắt đầu câu trả lời",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"Honestly, I don't know — but I'll find out.\"",
    "answer": "Khi thực sự không biết",
    "meaningVi": "Tổng quát",
    "note": null
  },
  {
    "question": "\"And also...\"",
    "answer": "Nối tiếp",
    "meaningVi": null,
    "note": "\"And also, I want to mention...\""
  },
  {
    "question": "\"On top of that...\"",
    "answer": "Nối tiếp",
    "meaningVi": null,
    "note": "\"On top of that, we have...\""
  },
  {
    "question": "\"Plus...\"",
    "answer": "Nối tiếp",
    "meaningVi": null,
    "note": "\"Plus, the new version is faster.\""
  },
  {
    "question": "\"Not only that, but...\"",
    "answer": "Nối tiếp",
    "meaningVi": null,
    "note": "\"Not only that, but it's also cheaper.\""
  },
  {
    "question": "\"Another thing is...\"",
    "answer": "Nối tiếp",
    "meaningVi": null,
    "note": "\"Another thing is performance.\""
  },
  {
    "question": "\"Building on what [name] said...\"",
    "answer": "Nối tiếp",
    "meaningVi": null,
    "note": "\"Building on what John said...\""
  },
  {
    "question": "\"Speaking of which...\"",
    "answer": "Liên quan",
    "meaningVi": null,
    "note": "\"Speaking of which, did you see the news?\""
  },
  {
    "question": "\"That reminds me...\"",
    "answer": "Liên quan",
    "meaningVi": null,
    "note": "\"That reminds me, I have to...\""
  },
  {
    "question": "\"On a related note...\"",
    "answer": "Liên quan",
    "meaningVi": null,
    "note": "\"On a related note, we should...\""
  },
  {
    "question": "\"By the way...\"",
    "answer": "Liên quan",
    "meaningVi": null,
    "note": "\"By the way, the meeting moved.\""
  },
  {
    "question": "\"Which reminds me...\"",
    "answer": "Liên quan",
    "meaningVi": null,
    "note": "\"Which reminds me, did you email her?\""
  },
  {
    "question": "\"For example...\"",
    "answer": "Ví dụ",
    "meaningVi": null,
    "note": "\"For example, we use Redis here.\""
  },
  {
    "question": "\"For instance...\"",
    "answer": "Ví dụ",
    "meaningVi": null,
    "note": "\"For instance, look at how Slack does it.\""
  },
  {
    "question": "\"Take [X] for example...\"",
    "answer": "Ví dụ",
    "meaningVi": null,
    "note": "\"Take Netflix for example.\""
  },
  {
    "question": "\"Let me give you an example.\"",
    "answer": "Ví dụ",
    "meaningVi": null,
    "note": "\"Let me give you an example.\""
  },
  {
    "question": "\"A good example is...\"",
    "answer": "Ví dụ",
    "meaningVi": null,
    "note": "\"A good example is Stripe.\""
  },
  {
    "question": "\"On the other hand...\"",
    "answer": "Ngược lại",
    "meaningVi": null,
    "note": "\"On the other hand, it's expensive.\""
  },
  {
    "question": "\"That said...\"",
    "answer": "Ngược lại",
    "meaningVi": null,
    "note": "\"That said, we should be careful.\""
  },
  {
    "question": "\"However...\"",
    "answer": "Ngược lại",
    "meaningVi": null,
    "note": "\"However, there's a catch.\""
  },
  {
    "question": "\"So to wrap up...\"",
    "answer": "Tổng kết",
    "meaningVi": null,
    "note": "\"So to wrap up, our plan is...\""
  },
  {
    "question": "\"Sorry, could you repeat that?\"",
    "answer": "Không nghe rõ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I missed that. Could you say it again?\"",
    "answer": "Không nghe rõ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, you're breaking up a bit. Can you repeat the last part?\"",
    "answer": "Không nghe rõ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, what was that?\"",
    "answer": "Không nghe rõ (nhẹ nhàng)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Pardon?\" (BrE, formal)",
    "answer": "Không nghe rõ (nhẹ nhàng)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, what does [word] mean?\"",
    "answer": "Không hiểu từ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm not familiar with [term]. Could you explain?\"",
    "answer": "Không hiểu từ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could you elaborate on that?\"",
    "answer": "Xin giải thích",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could you walk me through that?\"",
    "answer": "Xin giải thích",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could you give me an example?\"",
    "answer": "Xin giải thích",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What do you mean by [X]?\"",
    "answer": "Xin giải thích",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"So you're saying that [X], right?\"",
    "answer": "Xin xác nhận hiểu",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Just to make sure I got this — [X]. Is that correct?\"",
    "answer": "Xin xác nhận hiểu",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Did I understand correctly that [X]?\"",
    "answer": "Xin xác nhận hiểu",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, could you slow down a bit?\"",
    "answer": "Xin chậm lại",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Totally.\" / \"Yep.\" / \"Yeah, makes sense.\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm with you.\" / \"I'm on board.\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sounds good to me.\" / \"SGTM.\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I agree.\" / \"Fair point.\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I see your point.\" / \"Good point.\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That makes sense.\" / \"I think so too.\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Same here.\" / \"Same thought.\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I completely agree.\" / \"I concur.\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That's a valid point.\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I share your perspective.\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Hmm, I'm not sure about that.\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I see your point, but...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Yeah, but...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm not sure I agree — but I hear you.\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I see what you're saying, however...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That's a fair point. I'd also consider...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I have a slightly different view...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I respectfully disagree because...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Hmm, let me push back a little...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'd like to propose an alternative...\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I appreciate the perspective, but I'm not convinced.\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That's a valid concern. However, I'd argue...\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I want to respectfully push back on...\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'd like to offer a different viewpoint.\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"With all due respect, I think...\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I partly agree, but...\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I see your point on X, but Y is also important.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Yes, and also...\" (thêm ý)",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"True, but we should also consider...\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Good point, however, I think...\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"OK, I think that covers it.\"",
    "answer": "Kết thúc",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Alright, thanks everyone for joining.\"",
    "answer": "Kết thúc",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I think we've covered the main points.\"",
    "answer": "Kết thúc",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me wrap up here.\"",
    "answer": "Kết thúc",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"So to summarize...\"",
    "answer": "Tổng kết",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Quick recap of what we agreed on...\"",
    "answer": "Tổng kết",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Just to recap the action items...\"",
    "answer": "Tổng kết",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"So [name], you're on [task] by [date]?\"",
    "answer": "Action items",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'll send a follow-up email with the summary.\"",
    "answer": "Action items",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let's circle back on this next week.\"",
    "answer": "Follow-up",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'll ping you when [X] is done.\"",
    "answer": "Follow-up",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Talk to you tomorrow.\"",
    "answer": "Hẹn gặp lại",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"See you in the next standup.\"",
    "answer": "Hẹn gặp lại",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Talk soon!\" (casual)",
    "answer": "Hẹn gặp lại",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Have a good rest of your day.\"",
    "answer": "Hẹn gặp lại",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Thanks for your time today.\"",
    "answer": "Cảm ơn",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Really appreciate you making time.\"",
    "answer": "Cảm ơn",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Thanks everyone, great discussion.\"",
    "answer": "Cảm ơn",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I have to drop for another call — let's catch up later.\"",
    "answer": "Xin lỗi cắt ngang",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let's pause here and continue tomorrow.\"",
    "answer": "Tạm dừng",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I don't understand.\"",
    "answer": "⭐⭐ Thấp",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm confused.\"",
    "answer": "⭐⭐ Thấp",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Wait, what?\"",
    "answer": "⭐ Rất thấp — chỉ với bạn",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I'm not following.\"",
    "answer": "⭐⭐⭐ Trung bình",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I'm a bit lost.\"",
    "answer": "⭐⭐⭐ Trung bình",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, can you clarify?\"",
    "answer": "⭐⭐⭐ Trung bình",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could you explain that again?\"",
    "answer": "⭐⭐⭐⭐ Khá",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm not sure I follow. Can you rephrase?\"",
    "answer": "⭐⭐⭐⭐ Khá",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Just to make sure I'm on the same page...\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me make sure I understand correctly...\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I want to make sure I'm not missing anything — could you walk me through this?\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I think I may be missing some context here.\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm not 100% sure I follow — could you elaborate?\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I want to make sure I have the full picture.\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me see if I got this right...\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could you help me understand the context here?\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm trying to understand — is [X] what you mean?\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry to interrupt — but I want to make sure I understand...\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could you give me a quick example? I think that'll help.\"",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Just to recap what I understood...\" (sau đó paraphrase)",
    "answer": "⭐⭐⭐⭐⭐ Cao",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, could you speak a bit slower? My ears are still warming up!\" (Casual)",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, my brain's a bit slow today — could you repeat that?\" (Casual)",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I missed the last part. Could you repeat?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, accent's a bit fast for me — one more time?\" (Casual, friendly)",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I want to make sure I heard correctly...\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I don't have that information right now, but I can find out.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm not familiar with that, but I'd love to learn.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That's outside my current scope, but I can dig in.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That's outside my current capacity — could we adjust scope?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I haven't had the chance yet, but I'll prioritize it.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me check and get back to you by EOD.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Umm...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Well...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"So...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I mean...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"You know...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Like...\"",
    "answer": "Casual (đừng lạm dụng)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Actually...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Basically...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Honestly...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"To be honest...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Let me see...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Hmm, let me think...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"How do I put this...\"",
    "answer": "Casual",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"In other words...\"",
    "answer": "Neutral",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That is to say...\"",
    "answer": "Formal",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm confident I can handle this.\"",
    "answer": "Tự tin về khả năng",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I have experience with this.\"",
    "answer": "Tự tin về khả năng",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I've worked on similar projects before.\"",
    "answer": "Tự tin về khả năng",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'd recommend we go with [X] because...\"",
    "answer": "Đề xuất",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Based on my experience, I think...\"",
    "answer": "Đề xuất",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I have a different perspective on this.\"",
    "answer": "Đưa ý kiến",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'd like to suggest an alternative.\"",
    "answer": "Đưa ý kiến",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"That's helpful feedback — I'll incorporate it.\"",
    "answer": "Nhận feedback",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Great point, I hadn't thought of that.\"",
    "answer": "Nhận feedback",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'd love your input on this.\"",
    "answer": "Xin hỗ trợ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Could I get your take on this?\"",
    "answer": "Xin hỗ trợ",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm proud of [achievement].\"",
    "answer": "Nói về thành tích",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I successfully [did X].\"",
    "answer": "Nói về thành tích",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"I'm working on improving my [X].\"",
    "answer": "Nói về điểm yếu",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"One area I'm actively growing in is [X].\"",
    "answer": "Nói về điểm yếu",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What do you do?\"",
    "answer": "\"I'm a [role] at [company]. I work mostly with [tech].\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"How long have you been doing that?\"",
    "answer": "\"About [X] years now.\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What are you working on lately?\"",
    "answer": "\"Mostly [X]. Currently excited about [Y].\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What tech stack do you use?\"",
    "answer": "\"Mainly [X, Y, Z]. We use [W] for [purpose].\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Are you enjoying it?\"",
    "answer": "\"Yeah, it's been great! Especially [X].\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What brings you to this event?\"",
    "answer": "\"Wanted to learn more about [topic] and meet people.\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Have you been to [event] before?\"",
    "answer": "\"Yeah, a couple times. You?\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Cool — how did you get into [topic]?\"",
    "answer": "\"Started [way back], and got really into it during [time].\"",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What talk are you heading to next?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Have you seen the [X] talk yet? It was amazing.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Which track are you most excited about?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What was your favorite talk so far?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Have you tried the [food/drink] here? It's pretty good.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"This venue is awesome, right?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Did you catch the after-party?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Have you been to [city] before?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Are you from here originally?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Any restaurant recommendations?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"What are you doing after the conference?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Are you sticking around for the weekend?\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Cool — how's the weather back home?\" (nếu ở xa)",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Nice chatting! I'm gonna grab some coffee / catch the next talk.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"It was great meeting you! Let's connect on LinkedIn.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Cool, I'll let you mingle. See you around!\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Sorry, I have to run — but let's stay in touch.\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  },
  {
    "question": "\"Alright, I think I see a friend. Talk later!\"",
    "answer": "(câu giao tiếp)",
    "meaningVi": null,
    "note": null
  }
];

const EN_QNA: QnaSeed[] = [
  {
    "question": "Tell me about a project you built that you're proud of.",
    "answer": "One project I'm really proud of is my portfolio website.\nI built it to showcase my development skills.\n\nThe main challenge was integrating an AI chatbot using\nthe RAG architecture. I had to figure out how to chunk\ndocuments, embed them, and store vectors in PostgreSQL.\n\nI spent about 2 weeks on it, working 2-3 hours daily.\nThe result is a chatbot that can answer questions about\nmy projects in real time.\n\nWhat I learned from this project is [something you learned].\nThe biggest takeaway is that [key insight]."
  },
  {
    "question": "How does the internet work?",
    "answer": "Great question. Let me walk you through it step by step.\n\nFirst, when you type a URL, your browser sends a DNS\nrequest to find the IP address of that domain.\n\nThen, your browser establishes a TCP connection with the\nserver using a 3-way handshake: SYN, SYN-ACK, ACK.\n\nOnce connected, the browser sends an HTTP request for\nthe page. The server processes the request and sends\nback an HTTP response with the HTML.\n\nFinally, the browser parses the HTML, finds linked CSS\nand JavaScript files, and renders the page.\n\nAlong the way, routers and switches at various network\npoints help route the data from your computer to the\nserver and back."
  },
  {
    "question": "What is the difference between SQL and NoSQL?",
    "answer": "Good question. There are a few key differences.\n\nFirst, data model. SQL databases use structured tables\nwith rows and columns, like a spreadsheet. NoSQL databases\nstore data as documents, key-value pairs, or graphs.\n\nSecond, schema. SQL has a fixed schema — you define the\nstructure before inserting data. NoSQL is schema-less,\nwhich makes it more flexible.\n\nThird, relationships. SQL is great for related data —\nyou can join tables easily. NoSQL handles relationships\ndifferently — some databases encourage denormalization.\n\nFourth, scalability. SQL typically scales vertically —\nbigger server. NoSQL can scale horizontally — more servers.\n\nUse SQL when you have structured, related data and need\nACID transactions. Use NoSQL when you need flexibility\nand can sacrifice strict consistency."
  },
  {
    "question": "Explain REST API.",
    "answer": "REST stands for Representational State Transfer.\n\nA REST API is a way for two applications to communicate\nover HTTP. It follows a few key principles:\n\nFirst, client-server architecture — the client and server\nare independent. The server doesn't care what the client\nlooks like.\n\nSecond, stateless — each request contains all the\ninformation the server needs. No session is stored on\nthe server.\n\nThird, cacheable — responses can be cached to improve\nperformance.\n\nFourth, it uses standard HTTP methods: GET to read data,\nPOST to create, PUT/PATCH to update, DELETE to remove.\n\nResources are identified by URLs, and data is typically\nexchanged in JSON format."
  },
  {
    "question": "What is the time complexity of...",
    "answer": "For [question about algorithm]:\n[State time complexity]\nThis is because [reason — e.g., \"we iterate through the array once\"]\nIn the worst case [explain worst case scenario]\n[State space complexity]\nThis is because [reason]"
  },
  {
    "question": "Tell me about a time you had to meet a tight deadline.",
    "answer": "SITUATION: At my previous job, we had a critical deadline\nfor a client presentation. We had 3 days to deliver a\nworking demo.\n\nTASK: My responsibility was to build the backend API\nthat would power the demo.\n\nACTION: I broke the project into smaller tasks and\nprioritized the most critical features first. I worked\nextra hours and communicated with the team daily.\nWhen we hit a roadblock, I asked for help instead of\nspending hours stuck.\n\nRESULT: We delivered the demo on time. The client was\nimpressed and signed a contract. I learned the importance\nof scope control and early communication when deadlines\nare tight."
  },
  {
    "question": "Tell me about a time you had a conflict with a teammate.",
    "answer": "SITUATION: During a code review, I disagreed with a\nteammate about the best approach for refactoring a\nmodule.\n\nTASK: We both had strong opinions and needed to reach\na decision quickly.\n\nACTION: I asked them to walk me through their approach\nin detail. I shared my concerns with specific examples.\nWe looked at the trade-offs together and found a middle\nground — combining the best parts of both approaches.\n\nRESULT: The final solution was actually better than\neither of our original ideas. Our working relationship\ngot stronger because we learned to communicate more openly.\n\nLESSON: Conflicts are healthy when handled professionally.\nAlways focus on the code and the problem, not the person."
  },
  {
    "question": "Where do you see yourself in 5 years?",
    "answer": "In 5 years, I see myself as a senior engineer who not\nonly writes great code but also helps make technical\ndecisions for the team.\n\nI'm particularly interested in backend architecture\nand system design. I want to develop the skills to\ndesign scalable systems that can handle millions of users.\n\nI also want to give back by mentoring junior developers.\nI remember how hard it was to get started, and I'd love\nto help others on that journey.\n\nAt the same time, I want to stay hands-on with code.\nI'm not interested in moving purely into management.\nI think the best tech leads are those who understand\nthe code deeply."
  },
  {
    "question": "Design a chatbot with RAG",
    "answer": "Sure, let me walk you through this.\n\nThe system has 3 main components:\n1. Ingestion pipeline (offline): documents are chunked,\n   embedded, and stored in a vector DB.\n2. Query pipeline (online): user question is embedded,\n   used to retrieve top-k similar chunks.\n3. LLM generation: retrieved chunks + question are sent\n   to the LLM with a system prompt to generate answer.\n\nKey design decisions:\n- Chunking strategy: 500 tokens with 100 overlap\n- Embedding model: OpenAI text-embedding-3-small\n- Vector DB: pgvector or Pinecone\n- LLM: GPT-4o or Claude 3.5 Sonnet\n- Top-k: 5 chunks, with reranking\n\nTrade-offs:\n- More chunks = better recall but more noise\n- Larger context window = better answers but more cost\n- Reranking adds latency but improves precision\n\nFor monitoring, I'd track:\n- Retrieval recall (do we find the right docs?)\n- Answer quality (is it helpful?)\n- Hallucination rate (does it make things up?)\n\nTo scale, we could:\n- Cache frequent questions\n- Use a smaller LLM for routing\n- Pre-compute embeddings for hot docs"
  },
  {
    "question": "Design a real-time chat application",
    "answer": "For a real-time chat app like Slack, the core challenge\nis low-latency message delivery.\n\nArchitecture:\n1. Client connects via WebSocket to a chat server.\n2. Messages are sent to the server, which persists them\n   to a database (e.g., Cassandra for write-heavy).\n3. Server fans out the message to other connected clients\n   in the same channel via a pub/sub system (Redis or\n   Kafka).\n4. For offline users, messages are stored and delivered\n   on reconnect.\n\nKey components:\n- WebSocket servers (stateless, scalable)\n- Pub/sub for fan-out\n- Message queue for persistence\n- Push notifications via APNs/FCM for mobile\n\nFor 1M concurrent users:\n- Need ~1000 WebSocket servers (1000 users/server)\n- Sticky sessions or consistent hashing\n- Heartbeats to detect dead connections\n\nTrade-offs:\n- WebSocket vs Server-Sent Events\n- At-least-once vs at-most-once delivery\n- Read receipts cost (writes everywhere)"
  },
  {
    "question": "Design a rate limiter",
    "answer": "A rate limiter protects APIs from abuse. Several\nalgorithms exist:\n\n1. Token bucket: tokens are added at a fixed rate; each\n   request consumes a token. Allows bursts.\n2. Sliding window: counts requests in the last N seconds.\n3. Fixed window: counts per time window (simpler but\n   less accurate).\n\nFor a distributed system:\n- Use Redis with atomic INCR + EXPIRE\n- Or a centralized rate limiter service\n\nTrade-offs:\n- Token bucket: best for bursty traffic\n- Sliding window: most accurate, more memory\n- Fixed window: simplest, edge case issues at boundaries\n\nWhere to enforce:\n- API gateway: catches most abuse early\n- Service-level: for fine-grained limits\n- Per-user, per-IP, per-API-key\n\nReturns 429 Too Many Requests when exceeded."
  },
  {
    "question": "Design a URL shortener (like bit.ly)",
    "answer": "A URL shortener converts long URLs to short ones and\nredirects users.\n\nComponents:\n1. Short URL generation: hash + base62, or auto-increment\n   ID + base62.\n2. Database: store (short_code, long_url, created_at,\n   expires_at, click_count).\n3. Redirect: when user hits /abc123, look up and 301\n   redirect to long URL.\n\nFor 100:1 read/write ratio:\n- Cache hot URLs in Redis\n- Reads from cache, writes through to DB\n- Eventually consistent click counts (increment async)\n\nScaling:\n- Shard DB by hash(short_code)\n- CDN for redirect endpoint\n- Use a NoSQL DB for massive scale\n\nTrade-offs:\n- Short URLs that are predictable (auto-increment) vs\n  random (hashed) — security vs simplicity\n- Analytics tracking adds overhead"
  },
  {
    "question": "Design a notification system",
    "answer": "A notification system delivers messages via email, push,\nSMS, or in-app.\n\nArchitecture:\n1. Event source (e.g., user signs up) emits to a queue.\n2. Notification service consumes event, looks up user\n   preferences.\n3. Routes to appropriate channel(s).\n4. Each channel has its own provider (SendGrid, FCM, Twilio).\n5. Failed deliveries retry with exponential backoff.\n\nKey concerns:\n- User preferences (which channels? frequency?)\n- Batching (don't spam users)\n- Priority (OTP > marketing)\n- Idempotency (don't send twice)\n\nTrade-offs:\n- Real-time vs batched\n- Per-user preferences vs default for everyone\n- Centralized service vs embedded in each feature"
  },
  {
    "question": "Tell me about a time you disagreed with your manager.",
    "answer": "SITUATION: At my last job, my manager wanted to ship a\nfeature in 1 week that I estimated needed 3 weeks.\n\nTASK: I needed to push back on the timeline without\nsounding like I was making excuses.\n\nACTION: I scheduled a 1:1 and laid out my reasoning:\n- Showed the complexity of the requirements\n- Broke down the tasks and how long each would take\n- Pointed out similar past projects that took similar time\n- Proposed a compromise: MVP in 1.5 weeks, full feature\n  in 3 weeks.\n\nRESULT: We agreed on the MVP approach. The manager\nappreciated the data and the willingness to find a middle\nground. We shipped on time with no major issues.\n\nLESSON: Disagreeing with your manager is OK if you have\ndata and propose alternatives."
  },
  {
    "question": "Tell me about a time you helped a teammate.",
    "answer": "SITUATION: A teammate was struggling with a complex bug\nthat blocked their entire team for 2 days.\n\nTASK: The bug wasn't in my area, but I saw the team was\nstuck and decided to help.\n\nACTION: I paired with them for 3 hours. We traced through\nthe code together, narrowed down the issue, and found\nthe root cause — a race condition in a shared utility.\n\nRESULT: We fixed the bug and added a regression test.\nThe team unblocked, and we documented the issue in our\nwiki so others wouldn't hit the same problem.\n\nLESSON: Helping teammates isn't just nice — it builds\ntrust and makes the whole team faster."
  },
  {
    "question": "Tell me about a time you had to learn something quickly.",
    "answer": "SITUATION: I was assigned to a project that used a\nframework I'd never worked with before — they had a\ntight deadline of 2 weeks.\n\nTASK: I needed to become productive in this new tech\nfast.\n\nACTION: I spent the first 2 days reading docs and\nbuilding a small toy app. Then I paired with the tech\nlead for a day to understand the codebase. After that,\nI started contributing to small tickets.\n\nRESULT: By day 5, I was merging PRs independently. By\nthe end of the 2 weeks, I'd shipped 2 features.\n\nLESSON: Learning fast is about momentum — get hands-on\nquickly, even if you don't fully understand everything."
  },
  {
    "question": "Tell me about your biggest professional failure.",
    "answer": "SITUATION: I once pushed a change directly to main\nwithout proper testing because I was in a rush.\n\nTASK: The change broke production for 30 minutes,\naffecting real users.\n\nACTION: I immediately rolled back the change, then\nwrote a detailed postmortem with my team. We identified\nthe root cause: no PR review, no staging test, no CI\nchecks.\n\nRESULT: We implemented new rules: PRs require review,\nall changes go through staging first, CI is mandatory.\nI haven't made that mistake since.\n\nLESSON: Failure is painful but it's how you grow if you\nlearn from it. I now always slow down to do things\nright, even under pressure."
  },
  {
    "question": "Why are you leaving your current job?",
    "answer": "I joined [current company] 2 years ago and have grown a\nlot — but I've hit a ceiling in terms of what I can\nlearn and the impact I can make.\n\nI'm looking for a role where I can work on larger-scale\nsystems and contribute to technical decisions. The\n[role at your company] aligns perfectly with where I\nwant to go — especially the focus on [specific thing].\n\nI'm also drawn to [company's] engineering culture and\nthe chance to learn from people who are at the top of\n[your domain]."
  },
  {
    "question": "What's your ideal work environment?",
    "answer": "I thrive in environments that balance autonomy with\ncollaboration. I want to own my work end-to-end but also\nhave opportunities to learn from senior engineers.\n\nSome things I really value:\n- Clear ownership and accountability\n- Frequent feedback (both directions)\n- A culture that values engineering quality, not just\n  shipping speed\n- Async-first communication with focused deep work time\n\nI work best when given clear goals and the freedom to\nfigure out the best path."
  },
  {
    "question": "How do you handle stress?",
    "answer": "I try to manage stress proactively:\n- Break big problems into small tasks — this makes them\n  feel less overwhelming\n- Communicate early when I'm stuck — better to ask for\n  help than to silently struggle\n- Take breaks — even a 10-minute walk can reset my focus\n\nWhen I'm under serious pressure, I prioritize ruthlessly:\n- What's blocking the team? Fix that first.\n- What can wait? Push it back.\n- What can be cut from scope? Negotiate.\n\nI've learned that stress usually means something is\nbroken in the process — not that I'm working too hard.\nSo I try to fix the process, not just push through."
  },
  {
    "question": "Tell me about a side project you're proud of.",
    "answer": "One project I'm proud of is my portfolio website with\nan AI chatbot.\n\nWHAT: A chatbot that answers questions about my projects\nin real time, using RAG architecture.\n\nWHY: I wanted to learn AI/LLM tech in a hands-on way\nwhile building something useful.\n\nHOW:\n- Scraped my own portfolio content\n- Chunked and embedded it with OpenAI\n- Stored in pgvector\n- Built a chat UI with React\n- Used Claude API for generating responses\n\nWHAT I LEARNED:\n- Embeddings and vector search\n- Prompt engineering\n- Postgres + pgvector\n- Building production-ready RAG apps\n\nThe project got featured on my LinkedIn and a few\npeople reached out about it — which was really cool."
  },
  {
    "question": "How do you stay up-to-date with tech?",
    "answer": "A few habits that work for me:\n\nDAILY: I follow tech Twitter/X and skim the top posts\non Hacker News during coffee.\n\nWEEKLY: I watch 1-2 tech YouTube videos (Fireship, Theo,\nsome conference talks). I read 1-2 long-form blog posts\n(usually from company engineering blogs or Pragmatic\nEngineer).\n\nMONTHLY: I pick one new tech to try hands-on — recently\nI've explored Bun, Drizzle, and Cursor. Even a 2-hour\nspike teaches you a lot.\n\nI try to avoid hype-driven learning — instead, I focus\non tools that solve real problems I have.\n\nHonestly, the best way to learn is still by building.\nReading and watching can only take you so far."
  },
  {
    "question": "What's a deal-breaker for you in a job?",
    "answer": "A few things I really care about:\n\n1. Code quality matters. I want to work somewhere that\n   invests in good engineering practices — code review,\n   testing, technical debt management.\n\n2. Healthy work-life balance. I'm willing to work hard\n   when needed, but I don't want a job that expects\n   60+ hour weeks regularly.\n\n3. Growth opportunities. I want a clear path to senior\n   level, with mentorship along the way.\n\n4. Reasonable on-call. I don't mind being on-call if\n   it's well-structured (rotations, comp time after).\n\nI think the most important thing is honest communication\nfrom leadership. If a company is upfront about its\nchallenges, I'm much more willing to deal with them."
  }
];

const JA_ALPHABET: AlphaGroup[] = [
  {
    "name": "Hiragana",
    "description": "Bảng chữ mềm — 46 âm cơ bản (gojūon)",
    "items": [
      {
        "character": "あ",
        "romanization": "a"
      },
      {
        "character": "い",
        "romanization": "i"
      },
      {
        "character": "う",
        "romanization": "u"
      },
      {
        "character": "え",
        "romanization": "e"
      },
      {
        "character": "お",
        "romanization": "o"
      },
      {
        "character": "か",
        "romanization": "ka"
      },
      {
        "character": "き",
        "romanization": "ki"
      },
      {
        "character": "く",
        "romanization": "ku"
      },
      {
        "character": "け",
        "romanization": "ke"
      },
      {
        "character": "こ",
        "romanization": "ko"
      },
      {
        "character": "さ",
        "romanization": "sa"
      },
      {
        "character": "し",
        "romanization": "shi"
      },
      {
        "character": "す",
        "romanization": "su"
      },
      {
        "character": "せ",
        "romanization": "se"
      },
      {
        "character": "そ",
        "romanization": "so"
      },
      {
        "character": "た",
        "romanization": "ta"
      },
      {
        "character": "ち",
        "romanization": "chi"
      },
      {
        "character": "つ",
        "romanization": "tsu"
      },
      {
        "character": "て",
        "romanization": "te"
      },
      {
        "character": "と",
        "romanization": "to"
      },
      {
        "character": "な",
        "romanization": "na"
      },
      {
        "character": "に",
        "romanization": "ni"
      },
      {
        "character": "ぬ",
        "romanization": "nu"
      },
      {
        "character": "ね",
        "romanization": "ne"
      },
      {
        "character": "の",
        "romanization": "no"
      },
      {
        "character": "は",
        "romanization": "ha"
      },
      {
        "character": "ひ",
        "romanization": "hi"
      },
      {
        "character": "ふ",
        "romanization": "fu"
      },
      {
        "character": "へ",
        "romanization": "he"
      },
      {
        "character": "ほ",
        "romanization": "ho"
      },
      {
        "character": "ま",
        "romanization": "ma"
      },
      {
        "character": "み",
        "romanization": "mi"
      },
      {
        "character": "む",
        "romanization": "mu"
      },
      {
        "character": "め",
        "romanization": "me"
      },
      {
        "character": "も",
        "romanization": "mo"
      },
      {
        "character": "や",
        "romanization": "ya"
      },
      {
        "character": "ゆ",
        "romanization": "yu"
      },
      {
        "character": "よ",
        "romanization": "yo"
      },
      {
        "character": "ら",
        "romanization": "ra"
      },
      {
        "character": "り",
        "romanization": "ri"
      },
      {
        "character": "る",
        "romanization": "ru"
      },
      {
        "character": "れ",
        "romanization": "re"
      },
      {
        "character": "ろ",
        "romanization": "ro"
      },
      {
        "character": "わ",
        "romanization": "wa"
      },
      {
        "character": "を",
        "romanization": "wo"
      },
      {
        "character": "ん",
        "romanization": "n"
      }
    ]
  },
  {
    "name": "Katakana",
    "description": "Bảng chữ cứng — 46 âm cơ bản, dùng cho từ ngoại lai",
    "items": [
      {
        "character": "ア",
        "romanization": "a"
      },
      {
        "character": "イ",
        "romanization": "i"
      },
      {
        "character": "ウ",
        "romanization": "u"
      },
      {
        "character": "エ",
        "romanization": "e"
      },
      {
        "character": "オ",
        "romanization": "o"
      },
      {
        "character": "カ",
        "romanization": "ka"
      },
      {
        "character": "キ",
        "romanization": "ki"
      },
      {
        "character": "ク",
        "romanization": "ku"
      },
      {
        "character": "ケ",
        "romanization": "ke"
      },
      {
        "character": "コ",
        "romanization": "ko"
      },
      {
        "character": "サ",
        "romanization": "sa"
      },
      {
        "character": "シ",
        "romanization": "shi"
      },
      {
        "character": "ス",
        "romanization": "su"
      },
      {
        "character": "セ",
        "romanization": "se"
      },
      {
        "character": "ソ",
        "romanization": "so"
      },
      {
        "character": "タ",
        "romanization": "ta"
      },
      {
        "character": "チ",
        "romanization": "chi"
      },
      {
        "character": "ツ",
        "romanization": "tsu"
      },
      {
        "character": "テ",
        "romanization": "te"
      },
      {
        "character": "ト",
        "romanization": "to"
      },
      {
        "character": "ナ",
        "romanization": "na"
      },
      {
        "character": "ニ",
        "romanization": "ni"
      },
      {
        "character": "ヌ",
        "romanization": "nu"
      },
      {
        "character": "ネ",
        "romanization": "ne"
      },
      {
        "character": "ノ",
        "romanization": "no"
      },
      {
        "character": "ハ",
        "romanization": "ha"
      },
      {
        "character": "ヒ",
        "romanization": "hi"
      },
      {
        "character": "フ",
        "romanization": "fu"
      },
      {
        "character": "ヘ",
        "romanization": "he"
      },
      {
        "character": "ホ",
        "romanization": "ho"
      },
      {
        "character": "マ",
        "romanization": "ma"
      },
      {
        "character": "ミ",
        "romanization": "mi"
      },
      {
        "character": "ム",
        "romanization": "mu"
      },
      {
        "character": "メ",
        "romanization": "me"
      },
      {
        "character": "モ",
        "romanization": "mo"
      },
      {
        "character": "ヤ",
        "romanization": "ya"
      },
      {
        "character": "ユ",
        "romanization": "yu"
      },
      {
        "character": "ヨ",
        "romanization": "yo"
      },
      {
        "character": "ラ",
        "romanization": "ra"
      },
      {
        "character": "リ",
        "romanization": "ri"
      },
      {
        "character": "ル",
        "romanization": "ru"
      },
      {
        "character": "レ",
        "romanization": "re"
      },
      {
        "character": "ロ",
        "romanization": "ro"
      },
      {
        "character": "ワ",
        "romanization": "wa"
      },
      {
        "character": "ヲ",
        "romanization": "wo"
      },
      {
        "character": "ン",
        "romanization": "n"
      }
    ]
  },
  {
    "name": "Kanji cơ bản",
    "description": "Một số chữ Hán cơ bản (số đếm & tự nhiên)",
    "items": [
      {
        "character": "一",
        "romanization": "ichi",
        "note": "một (1)"
      },
      {
        "character": "二",
        "romanization": "ni",
        "note": "hai (2)"
      },
      {
        "character": "三",
        "romanization": "san",
        "note": "ba (3)"
      },
      {
        "character": "人",
        "romanization": "hito / jin",
        "note": "người"
      },
      {
        "character": "日",
        "romanization": "nichi / hi",
        "note": "ngày, mặt trời"
      },
      {
        "character": "月",
        "romanization": "getsu / tsuki",
        "note": "tháng, mặt trăng"
      },
      {
        "character": "水",
        "romanization": "mizu / sui",
        "note": "nước"
      },
      {
        "character": "火",
        "romanization": "hi / ka",
        "note": "lửa"
      }
    ]
  }
];

const JA_VOCAB_CATEGORIES: CategorySeed[] = [
  {
    "name": "Chào hỏi",
    "icon": "👋",
    "words": [
      {
        "word": "こんにちは",
        "meaningVi": "xin chào",
        "exampleSentence": "こんにちは、はじめまして。",
        "exampleMeaning": "Xin chào, rất vui được gặp bạn.",
        "note": null,
        "pron": "konnichiwa"
      },
      {
        "word": "ありがとう",
        "meaningVi": "cảm ơn",
        "exampleSentence": "ありがとうございます。",
        "exampleMeaning": "Cảm ơn rất nhiều (lịch sự).",
        "note": null,
        "pron": "arigatō"
      },
      {
        "word": "おはよう",
        "meaningVi": "chào buổi sáng",
        "exampleSentence": "おはようございます。",
        "exampleMeaning": "Chào buổi sáng (lịch sự).",
        "note": null,
        "pron": "ohayō"
      },
      {
        "word": "さようなら",
        "meaningVi": "tạm biệt",
        "exampleSentence": "さようなら、またあした。",
        "exampleMeaning": "Tạm biệt, hẹn gặp lại ngày mai.",
        "note": null,
        "pron": "sayōnara"
      },
      {
        "word": "すみません",
        "meaningVi": "xin lỗi / làm ơn",
        "exampleSentence": "すみません、みずをください。",
        "exampleMeaning": "Xin lỗi, cho tôi xin nước.",
        "note": null,
        "pron": "sumimasen"
      }
    ]
  },
  {
    "name": "Số đếm",
    "icon": "🔢",
    "words": [
      {
        "word": "いち",
        "meaningVi": "một (1)",
        "exampleSentence": "いちばん",
        "exampleMeaning": "số một, hạng nhất",
        "note": "一",
        "pron": "ichi"
      },
      {
        "word": "に",
        "meaningVi": "hai (2)",
        "exampleSentence": "にほん",
        "exampleMeaning": "hai cây (vật dài)",
        "note": "二",
        "pron": "ni"
      },
      {
        "word": "さん",
        "meaningVi": "ba (3)",
        "exampleSentence": "さんじ",
        "exampleMeaning": "3 giờ",
        "note": "三",
        "pron": "san"
      },
      {
        "word": "よん",
        "meaningVi": "bốn (4)",
        "exampleSentence": "よにん",
        "exampleMeaning": "4 người",
        "note": "四",
        "pron": "yon"
      },
      {
        "word": "ご",
        "meaningVi": "năm (5)",
        "exampleSentence": "ごふん",
        "exampleMeaning": "5 phút",
        "note": "五",
        "pron": "go"
      }
    ]
  }
];

const JA_GRAMMAR: GrammarSeed[] = [
  {
    "level": "N5",
    "title": "Trợ từ は (wa)",
    "structure": "N + は + ... — đánh dấu chủ đề của câu (viết は nhưng đọc là \"wa\").",
    "explanation": "<p>Trợ từ <strong>は</strong> đứng sau danh từ để nêu chủ đề đang được nói tới.</p>",
    "examples": [
      {
        "sentence": "わたしは がくせいです。",
        "pronunciation": "Watashi wa gakusei desu.",
        "meaningVi": "Tôi là học sinh."
      },
      {
        "sentence": "これは ほんです。",
        "pronunciation": "Kore wa hon desu.",
        "meaningVi": "Đây là quyển sách."
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  },
  {
    "level": "N5",
    "title": "Vị ngữ です (desu)",
    "structure": "N + です — \"là/thì\" thể lịch sự. Phủ định: N + ではありません。",
    "explanation": "<p><strong>です</strong> là hệ từ lịch sự, đặt ở cuối câu để khẳng định. Phủ định dùng ではありません (じゃありません).</p>",
    "examples": [
      {
        "sentence": "かれは エンジニアです。",
        "pronunciation": "Kare wa enjinia desu.",
        "meaningVi": "Anh ấy là kỹ sư."
      },
      {
        "sentence": "これは みずではありません。",
        "pronunciation": "Kore wa mizu dewa arimasen.",
        "meaningVi": "Đây không phải là nước."
      }
    ],
    "commonMistakes": null,
    "comparedWith": null
  }
];

const JA_CONVERSATION: ConversationSeed[] = [
  {
    "question": "おなまえは なんですか。",
    "answer": "わたしは ホアンです。",
    "meaningVi": "Tên bạn là gì? — Tôi là Hoang.",
    "note": "Onamae wa nan desu ka. / Watashi wa Hoan desu."
  }
];

const JA_QNA: QnaSeed[] = [
  {
    "question": "Hiragana có bao nhiêu âm cơ bản?",
    "answer": "Hiragana có 46 âm cơ bản (gọi là gojūon / 五十音), là bảng chữ nền tảng đầu tiên khi học tiếng Nhật."
  }
];

// ============================ COUNTERS ============================
interface Counter {
  created: number;
  skipped: number;
}
const mk = (): Counter => ({ created: 0, skipped: 0 });
const summary: Record<string, Counter> = {
  languages: mk(),
  categories: mk(),
  words: mk(),
  pronunciations: mk(),
  grammar: mk(),
  conversation: mk(),
  qna: mk(),
  alphabetGroups: mk(),
  alphabetItems: mk(),
};

// ============================ SEEDERS ============================
interface LanguageInput {
  name: string;
  nameEn: string;
  code: string;
  flagEmoji: string;
  order: number;
}

async function upsertLanguage(input: LanguageInput): Promise<number> {
  const existing = await prisma.language.findUnique({ where: { code: input.code } });
  const lang = await prisma.language.upsert({
    where: { code: input.code },
    update: {}, // never overwrite user edits
    create: { ...input, isActive: true },
  });
  if (existing) summary.languages.skipped++;
  else summary.languages.created++;
  return lang.id;
}

async function seedVocab(
  languageId: number,
  categories: CategorySeed[],
  pronType: string,
): Promise<void> {
  for (let ci = 0; ci < categories.length; ci++) {
    const cat = categories[ci];
    let category = await prisma.langVocabCategory.findFirst({
      where: { languageId, name: cat.name },
    });
    if (category) {
      summary.categories.skipped++;
    } else {
      category = await prisma.langVocabCategory.create({
        data: { languageId, name: cat.name, icon: cat.icon, order: ci },
      });
      summary.categories.created++;
    }
    for (let wi = 0; wi < cat.words.length; wi++) {
      const w = cat.words[wi];
      const existingWord = await prisma.langVocabWord.findFirst({
        where: { categoryId: category.id, word: w.word },
      });
      if (existingWord) {
        summary.words.skipped++;
        continue;
      }
      await prisma.langVocabWord.create({
        data: {
          categoryId: category.id,
          word: w.word,
          meaningVi: w.meaningVi,
          exampleSentence: w.exampleSentence,
          exampleMeaning: w.exampleMeaning,
          note: w.note,
          order: wi,
          pronunciations: w.pron
            ? {
                create: [{ type: pronType, value: w.pron, order: 0 }],
              }
            : undefined,
        },
      });
      summary.words.created++;
      if (w.pron) summary.pronunciations.created++;
    }
  }
}

async function seedGrammar(languageId: number, points: GrammarSeed[]): Promise<void> {
  for (let i = 0; i < points.length; i++) {
    const g = points[i];
    const existing = await prisma.langGrammarPoint.findFirst({
      where: { languageId, title: g.title },
    });
    if (existing) {
      summary.grammar.skipped++;
      continue;
    }
    await prisma.langGrammarPoint.create({
      data: {
        languageId,
        level: g.level,
        title: g.title,
        structure: g.structure,
        explanation: g.explanation as Prisma.InputJsonValue,
        examples: g.examples as unknown as Prisma.InputJsonValue,
        commonMistakes: g.commonMistakes,
        comparedWith: g.comparedWith,
        order: i,
      },
    });
    summary.grammar.created++;
  }
}

async function seedConversation(languageId: number, items: ConversationSeed[]): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const existing = await prisma.langConversationItem.findFirst({
      where: { languageId, question: c.question },
    });
    if (existing) {
      summary.conversation.skipped++;
      continue;
    }
    await prisma.langConversationItem.create({
      data: {
        languageId,
        question: c.question,
        answer: c.answer,
        meaningVi: c.meaningVi,
        note: c.note,
        order: i,
      },
    });
    summary.conversation.created++;
  }
}

async function seedQna(languageId: number, items: QnaSeed[]): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    const q = items[i];
    const existing = await prisma.langQnaItem.findFirst({
      where: { languageId, question: q.question },
    });
    if (existing) {
      summary.qna.skipped++;
      continue;
    }
    await prisma.langQnaItem.create({
      data: { languageId, question: q.question, answer: q.answer, order: i },
    });
    summary.qna.created++;
  }
}

async function seedAlphabet(languageId: number, groups: AlphaGroup[]): Promise<void> {
  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    let group = await prisma.langAlphabetGroup.findFirst({
      where: { languageId, name: g.name },
    });
    if (group) {
      summary.alphabetGroups.skipped++;
    } else {
      group = await prisma.langAlphabetGroup.create({
        data: { languageId, name: g.name, description: g.description, order: gi },
      });
      summary.alphabetGroups.created++;
    }
    for (let ii = 0; ii < g.items.length; ii++) {
      const it = g.items[ii];
      const existing = await prisma.langAlphabetItem.findFirst({
        where: { groupId: group.id, character: it.character },
      });
      if (existing) {
        summary.alphabetItems.skipped++;
        continue;
      }
      await prisma.langAlphabetItem.create({
        data: {
          groupId: group.id,
          character: it.character,
          romanization: it.romanization,
          note: it.note ?? null,
          order: ii,
        },
      });
      summary.alphabetItems.created++;
    }
  }
}

// ============================ MAIN ============================
async function main(): Promise<void> {
  console.log('🌱 Seeding language-learning data...\n');

  // --- English ---
  const enId = await upsertLanguage({
    name: 'Tiếng Anh',
    nameEn: 'English',
    code: 'en',
    flagEmoji: '🇬🇧',
    order: 0,
  });
  await seedVocab(enId, EN_VOCAB_CATEGORIES, 'IPA');
  await seedGrammar(enId, EN_GRAMMAR);
  await seedConversation(enId, EN_CONVERSATION);
  await seedQna(enId, EN_QNA);

  // --- Japanese ---
  const jaId = await upsertLanguage({
    name: 'Tiếng Nhật',
    nameEn: 'Japanese',
    code: 'ja',
    flagEmoji: '🇯🇵',
    order: 1,
  });
  await seedAlphabet(jaId, JA_ALPHABET);
  await seedVocab(jaId, JA_VOCAB_CATEGORIES, 'romaji');
  await seedGrammar(jaId, JA_GRAMMAR);
  await seedConversation(jaId, JA_CONVERSATION);
  await seedQna(jaId, JA_QNA);

  // --- Summary ---
  console.log('\n✅ Seed complete. Summary (created / skipped):');
  for (const [section, c] of Object.entries(summary)) {
    console.log(`  ${section.padEnd(16)} +${c.created} created, ${c.skipped} skipped`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
