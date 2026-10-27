/**
 * PRO192 · Nâng cao 2 — phân tích & cải tiến project Banking của trường.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── N2.2 — 🏦 Case study: the school's Banking project — read, run on JDK 8, measure the bugs, refactor step by step ───────── */
const L_x_banking = {
  title: "N2.2 — 🏦 Case study: the school's Banking project — read, run on JDK 8, measure the bugs, refactor step by step|||N2.2 — 🏦 Phân tích project Banking của trường — đọc code, chạy thật JDK 8, đo lỗi, tái cấu trúc từng bước",
  slug: 'pro192-banking',
  type: 'VIDEO',
  description: 'Bài tự thêm ngoài giáo trình: đọc project mẫu Banking của trường (model Account/Bank/TransLog, menu chữ textview, giao diện Swing), vẽ sơ đồ lớp hiện trạng, chạy thật code gốc trên JDK 8 như người gõ phím và như máy chấm nạp dữ liệu qua pipe, đo từng lỗi thiết kế (Scanner mới mỗi lần gọi, Logout không thoát menu, số tiền âm, setter phá đóng gói, tiền kiểu double, không lưu file…), rồi tái cấu trúc sáu bước có code chạy thật: đóng gói và ngoại lệ nghiệp vụ, nhật ký bất biến, interface kho lưu, tầng service, giao diện console một Scanner, lưu và nạp file; sơ đồ lớp sau khi sửa, ba bài tập mở rộng có lời giải và ô "nếu viết bằng Spring Boot".',
  content: [
    bi(`<span class="eyebrow">Advanced 2 · 🏦 Case study · added by this site</span>
<h2>A real project, written by a lecturer for PRO192 — what is good in it, what breaks, and how to rebuild it properly</h2>
<p class="lead">The school ships a small sample project, <em>Banking</em>: accounts, deposits, withdrawals, transfers and a transaction log, with a text menu and a Swing window. It uses almost every chapter of PRO192 — classes, encapsulation, inheritance, an abstract class, an interface, an inner class, exceptions, collections. That makes it the perfect material for the skill employers actually test: <strong>reading someone else's code, finding what is wrong with evidence, and improving it without breaking it</strong>.</p>
<p class="y-chinh">🎯 Plan: (1) map the project and draw its class diagram; (2) read five key excerpts; (3) run the original on a real JDK 8 — first like a person typing, then like a grader piping input — and measure each bug; (4) refactor in six steps, every step compiled with <code>--release 8</code> and run for real; (5) three extension exercises with solutions; (6) how the same design looks in Spring Boot.</p>
<table>
<thead><tr><th>Part</th><th>Files</th><th>What we do with it</th></tr></thead>
<tbody>
<tr><td><code>model</code></td><td><code>Account</code>, <code>Bank</code>, <code>TransLog</code></td><td>read, measure, rebuild</td></tr>
<tr><td><code>textview</code></td><td><code>Menu</code>, <code>Library</code>, <code>BankApp</code></td><td>run on JDK 8 (typed and piped), rebuild as a console UI</td></tr>
<tr><td><code>view</code></td><td><code>BankGUI</code> + 5 forms (<code>.java</code> + NetBeans <code>.form</code>)</td><td>reading level only — the <code>.form</code> files are generated XML and are not shown here</td></tr>
</tbody>
</table>
<p>You need Chapters 2–9. The Chapter 6 practice already turned this project's crashes into checked exceptions (exercise 6) — this lesson treats the <em>whole</em> project. Everything below that is labelled "output" was produced by running the code; nothing is described from memory.</p>`,
    `<span class="eyebrow">Nâng cao 2 · 🏦 Phân tích tình huống · phần web tự thêm</span>
<h2>Một project thật do giảng viên viết cho PRO192 — chỗ nào tốt, chỗ nào hỏng, và dựng lại cho đúng thế nào</h2>
<p class="lead">Trường phát kèm một project mẫu nhỏ, <em>Banking</em>: tài khoản, nạp, rút, chuyển tiền và nhật ký giao dịch, có menu chữ và cửa sổ Swing. Nó dùng gần như mọi chương của PRO192 — lớp, đóng gói, kế thừa, lớp trừu tượng, interface, lớp lồng, ngoại lệ, collections. Vì thế nó là chất liệu tuyệt vời cho kỹ năng nhà tuyển dụng thật sự kiểm tra: <strong>đọc code của người khác, chỉ ra chỗ sai có bằng chứng, và cải tiến mà không làm hỏng</strong>.</p>
<p class="y-chinh">🎯 Kế hoạch: (1) vẽ bản đồ project và sơ đồ lớp; (2) đọc năm đoạn code then chốt; (3) chạy code gốc trên JDK 8 thật — trước như người gõ phím, sau như máy chấm nạp dữ liệu qua pipe — và đo từng lỗi; (4) tái cấu trúc sáu bước, mỗi bước biên dịch với <code>--release 8</code> và chạy thật; (5) ba bài tập mở rộng có lời giải; (6) cùng thiết kế đó trong Spring Boot trông ra sao.</p>
<table>
<thead><tr><th>Phần</th><th>File</th><th>Ta làm gì với nó</th></tr></thead>
<tbody>
<tr><td><code>model</code></td><td><code>Account</code>, <code>Bank</code>, <code>TransLog</code></td><td>đọc, đo lỗi, dựng lại</td></tr>
<tr><td><code>textview</code></td><td><code>Menu</code>, <code>Library</code>, <code>BankApp</code></td><td>chạy trên JDK 8 (gõ tay và qua pipe), dựng lại thành giao diện console</td></tr>
<tr><td><code>view</code></td><td><code>BankGUI</code> + 5 form (<code>.java</code> + <code>.form</code> của NetBeans)</td><td>chỉ ở mức đọc hiểu — file <code>.form</code> là XML do NetBeans sinh ra, không đưa lên đây</td></tr>
</tbody>
</table>
<p>Bạn cần Chương 2–9. Bài thực hành Chương 6 đã biến các lần sập của project này thành ngoại lệ checked (bài 6) — bài này xử lý <em>toàn bộ</em> project. Mọi thứ ghi là "output" bên dưới đều do chạy code mà ra; không có gì được tả theo trí nhớ.</p>`),
    bi(`<h2>1. The map: three packages, one class diagram</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c6eabfec1ecbec5c8721cbefb9d4eedc0347dbbd.svg" alt="The project as it is, drawn from the real source; the pink notes are bugs measured further down" loading="lazy" /><p class="chu-thich">🧩 The project as it is, drawn from the real source; the pink notes are bugs measured further down</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The school's Banking project as it is - model, textview, view (the Swing forms summarised)
' Drawn from the real source in tai-lieu/banking/src; pink notes = problems measured by running it on JDK 8
package model {
  class Account {
    - accNo : int
    - accName, address, tel, pass : String
    - balance : double
    - lastAccess : Date
    - {static} accNum : int = 1000
    + Account(accName, address, tel, balance, pass)
    + setAccNo(int) / setBalance(double) / setPass(String) ...
    + deposit(amount : double) : double
    + withdraw(amount : double) : double
    + changePass(oldP : String, newP : String) : boolean
  }
  class TransLog {
    - logID, accNo : int
    - transTime : Date
    - transType, description : String
    - amount, postBal : double
    - {static} logNum : int
    + toVector() : Vector
  }
  class Bank {
    - aList : ArrayList&lt;Account&gt;
    - tList : ArrayList&lt;TransLog&gt;
    + getAccount(accNo : int) : Account
    + getLogs(accNo : int) : Vector&lt;Vector&gt;
    + createAccount(a : Account)
    + doDeposit(accNo, amount, desc)
    + doWithdraw(accNo, amount, desc)
    + doTransfer(accNo, toAcc, amount, desc)
    + doLogin(accNo : int, pass : String) : Account
    + doChangePass(accNo, oldP, newP)
  }
}
package textview {
  abstract class Menu {
    - mChon : ArrayList
    - title : String
    + display()
    + getSelected() : int
    + {abstract} execute(n : int)
    + run()
  }
  interface Library {
    + {static} getText(msg : String) : String
    + {static} getInt(msg : String) : int
    + {static} getDouble(msg : String) : double
  }
  class BankApp {
    - bank : Bank
    - curAcc : Account
    + execute(n : int)
    ~ createAccount()
    ~ doLogin()
    ~ doDeposit() / doWithdraw() / doTransfer() / doViewLog()
    + {static} main(arg : String[])
  }
  class "BankApp.TransactionMenu" as TM {
    + execute(n : int)
  }
}
package view {
  class BankGUI &lt;&lt;JFrame&gt;&gt; {
    + {static} bank : Bank
    + {static} curAcc : Account
  }
  class "LoginForm, RegForm, DepositForm,\\nChangePassForm, ViewLogForm" as Forms &lt;&lt;JPanel&gt;&gt;
}
Bank "1" o-- "0..*" Account
Bank "1" o-- "0..*" TransLog
Menu &lt;|-- BankApp
Menu &lt;|-- TM
BankApp +-- TM
BankApp --&gt; "1" Bank
BankApp --&gt; "0..1" Account : curAcc
BankApp ..&gt; Library
BankGUI --&gt; "1" Bank
Forms ..&gt; BankGUI : read and write\\npublic static fields
note right of Library #FFE4E6
  getText() does new Scanner(System.in)
  on EVERY call: piped input is lost
  (NoSuchElementException)
end note
note bottom of TM #FFE4E6
  case 5 (Logout) sets curAcc = null,
  but Menu.run() keeps looping:
  the next choice crashes
end note
note left of Account #FFE4E6
  public setBalance(): money changes
  with no log; negative amounts
  accepted; money as double
end note
note bottom of TransLog #FFE4E6
  toVector() = a JTable row:
  the model knows the GUI
end note
@enduml</code></pre></details>
<p>How the pieces fit: <code>BankApp</code> <strong>is a</strong> <code>Menu</code> (the main menu) and owns a <code>Bank</code>. After a login it starts a second menu, the inner class <code>TransactionMenu</code>, which can call <code>BankApp</code>'s methods and read its <code>curAcc</code> (Chapter 5, inner classes). <code>Bank</code> keeps two lists — accounts and log entries — and is the only door to the model: every operation goes through a <code>doXxx</code> method that also writes a <code>TransLog</code>. The Swing side keeps one <code>Bank</code> in a <code>public static</code> field of <code>BankGUI</code> that every form reads and writes.</p>
<p>Before criticising, note what is <strong>good</strong> and worth keeping:</p>
<ul>
<li><code>Menu</code> is a clean <em>template method</em>: <code>run()</code> is written once, each menu only supplies <code>execute(int)</code> (lesson 5.A).</li>
<li>The model is in its own package and knows nothing about <code>Scanner</code> or <code>System.out</code>.</li>
<li><code>Bank</code> is a single entry point for business operations, and every money movement is logged — a real banking idea.</li>
<li>Fields are <code>private</code>, lists are generic (<code>ArrayList&lt;Account&gt;</code>), account numbers come from a counter instead of the user.</li>
</ul>`,
    `<h2>1. Bản đồ: ba package, một sơ đồ lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c6eabfec1ecbec5c8721cbefb9d4eedc0347dbbd.svg" alt="Project như hiện trạng, vẽ từ mã nguồn thật; ghi chú hồng là các lỗi được đo ở phần dưới" loading="lazy" /><p class="chu-thich">🧩 Project như hiện trạng, vẽ từ mã nguồn thật; ghi chú hồng là các lỗi được đo ở phần dưới</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The school's Banking project as it is - model, textview, view (the Swing forms summarised)
' Vẽ từ mã nguồn thật trong tai-lieu/banking/src; ghi chú hồng = lỗi đo được khi chạy trên JDK 8
package model {
  class Account {
    - accNo : int
    - accName, address, tel, pass : String
    - balance : double
    - lastAccess : Date
    - {static} accNum : int = 1000
    + Account(accName, address, tel, balance, pass)
    + setAccNo(int) / setBalance(double) / setPass(String) ...
    + deposit(amount : double) : double
    + withdraw(amount : double) : double
    + changePass(oldP : String, newP : String) : boolean
  }
  class TransLog {
    - logID, accNo : int
    - transTime : Date
    - transType, description : String
    - amount, postBal : double
    - {static} logNum : int
    + toVector() : Vector
  }
  class Bank {
    - aList : ArrayList&lt;Account&gt;
    - tList : ArrayList&lt;TransLog&gt;
    + getAccount(accNo : int) : Account
    + getLogs(accNo : int) : Vector&lt;Vector&gt;
    + createAccount(a : Account)
    + doDeposit(accNo, amount, desc)
    + doWithdraw(accNo, amount, desc)
    + doTransfer(accNo, toAcc, amount, desc)
    + doLogin(accNo : int, pass : String) : Account
    + doChangePass(accNo, oldP, newP)
  }
}
package textview {
  abstract class Menu {
    - mChon : ArrayList
    - title : String
    + display()
    + getSelected() : int
    + {abstract} execute(n : int)
    + run()
  }
  interface Library {
    + {static} getText(msg : String) : String
    + {static} getInt(msg : String) : int
    + {static} getDouble(msg : String) : double
  }
  class BankApp {
    - bank : Bank
    - curAcc : Account
    + execute(n : int)
    ~ createAccount()
    ~ doLogin()
    ~ doDeposit() / doWithdraw() / doTransfer() / doViewLog()
    + {static} main(arg : String[])
  }
  class "BankApp.TransactionMenu" as TM {
    + execute(n : int)
  }
}
package view {
  class BankGUI &lt;&lt;JFrame&gt;&gt; {
    + {static} bank : Bank
    + {static} curAcc : Account
  }
  class "LoginForm, RegForm, DepositForm,\\nChangePassForm, ViewLogForm" as Forms &lt;&lt;JPanel&gt;&gt;
}
Bank "1" o-- "0..*" Account
Bank "1" o-- "0..*" TransLog
Menu &lt;|-- BankApp
Menu &lt;|-- TM
BankApp +-- TM
BankApp --&gt; "1" Bank
BankApp --&gt; "0..1" Account : curAcc
BankApp ..&gt; Library
BankGUI --&gt; "1" Bank
Forms ..&gt; BankGUI : read and write\\npublic static fields
note right of Library #FFE4E6
  getText() does new Scanner(System.in)
  on EVERY call: piped input is lost
  (NoSuchElementException)
end note
note bottom of TM #FFE4E6
  case 5 (Logout) sets curAcc = null,
  but Menu.run() keeps looping:
  the next choice crashes
end note
note left of Account #FFE4E6
  public setBalance(): money changes
  with no log; negative amounts
  accepted; money as double
end note
note bottom of TransLog #FFE4E6
  toVector() = a JTable row:
  the model knows the GUI
end note
@enduml</code></pre></details>
<p>Các mảnh ghép với nhau thế này: <code>BankApp</code> <strong>là một</strong> <code>Menu</code> (menu chính) và sở hữu một <code>Bank</code>. Sau khi đăng nhập, nó mở menu thứ hai là lớp lồng <code>TransactionMenu</code>, lớp này gọi được phương thức của <code>BankApp</code> và đọc được <code>curAcc</code> của nó (Chương 5, lớp lồng). <code>Bank</code> giữ hai danh sách — tài khoản và dòng nhật ký — và là cửa duy nhất vào model: mọi thao tác đi qua một phương thức <code>doXxx</code>, phương thức đó đồng thời ghi một <code>TransLog</code>. Phía Swing giữ một <code>Bank</code> trong trường <code>public static</code> của <code>BankGUI</code> mà mọi form đều đọc và ghi.</p>
<p>Trước khi chê, hãy ghi nhận chỗ <strong>tốt</strong> đáng giữ lại:</p>
<ul>
<li><code>Menu</code> là một <em>template method</em> gọn gàng: <code>run()</code> viết một lần, mỗi menu chỉ cung cấp <code>execute(int)</code> (bài 5.A).</li>
<li>Model nằm trong package riêng và không biết gì về <code>Scanner</code> hay <code>System.out</code>.</li>
<li><code>Bank</code> là điểm vào duy nhất cho các thao tác nghiệp vụ, và mọi lần tiền dịch chuyển đều được ghi nhật ký — đúng một ý tưởng ngân hàng thật.</li>
<li>Các trường đều <code>private</code>, danh sách có generic (<code>ArrayList&lt;Account&gt;</code>), số tài khoản lấy từ bộ đếm chứ không do người dùng gõ.</li>
</ul>`),
    bi(`<h2>2. Read the code — five excerpts that decide everything</h2>
<p>All excerpts are the school's code, verbatim (only blank lines removed).</p>
<h3>2.1 How input is read: <code>textview/Library.java</code> and <code>Menu.getSelected()</code></h3>
<pre><code class="language-java">public interface Library {
    public static String getText(String msg){
        Scanner sc= new Scanner(System.in);
        System.out.print(msg+" : ");
        return sc.nextLine();
    }
    public static int getInt(String msg){
        return Integer.parseInt(getText(msg));
    }
    // getDouble: the same with Double.parseDouble
}
// in Menu:
    public int getSelected(){
        display();
        System.out.print("Please select..:");
        Scanner sc= new Scanner(System.in);
        return sc.nextInt();
    }</code></pre>
<p>Two smells: an <strong>interface used as a bag of static methods</strong> (legal since Java 8, but an interface should describe a role that classes implement — a <code>final</code> utility class with a private constructor says "helpers" honestly), and a <strong>new <code>Scanner</code> on every call</strong>. A <code>Scanner</code> reads <em>ahead</em> into its own buffer; when it is thrown away, whatever it buffered is thrown away too. Keep that sentence in mind for section 4.</p>
<h3>2.2 The menu loop and the Logout case</h3>
<pre><code class="language-java">// Menu
    public void run(){
        while(true){
            int n=getSelected();
            if(n&gt;mChon.size()) break;
            execute(n);
        }
    }
// BankApp.TransactionMenu
    public void execute(int n){
        switch(n){
            case 1: doDeposit();break;
            case 2: doWithdraw();break;
            case 3: doTransfer();break;
            case 4: doViewLog();break;
            case 5: curAcc=null;return;
        }
    }</code></pre>
<p>Trace it by hand: choosing 5 runs <code>curAcc=null; return;</code> — the <code>return</code> leaves <code>execute</code>, <strong>not</strong> the <code>while</code> loop in <code>run()</code>. Since 5 is not greater than the menu size (5), the loop shows the transaction menu again, now with no logged-in account. The only way out is to type 6 or more. A prediction worth testing in section 3.</p>
<h3>2.3 The money: <code>model/Account.java</code></h3>
<pre><code class="language-java">private double balance;
public void setBalance(double balance) {
    this.balance = balance;
}
public double deposit(double amount){
    return balance+=amount;
}
public double withdraw(double amount){
    if(balance-amount&lt;0) throw new RuntimeException("Not enough money..");
    return balance-=amount;
}</code></pre>
<p>The field is private, but a public <code>setBalance</code> (and <code>setAccNo</code>, <code>setPass</code>) hands the key to everyone — encapsulation in name only (Chapter 3). Nothing rejects a negative or zero amount. The balance is a <code>double</code>. Business errors are plain <code>RuntimeException</code>s.</p>
<h3>2.4 Transfer and log: <code>model/Bank.java</code></h3>
<pre><code class="language-java">public void doTransfer(int accNo,int toAcc,double amount, String desc){
    Account a= getAccount(accNo);
    Account b= getAccount(toAcc);
    a.withdraw(amount); b.deposit(amount);
    tList.add(new TransLog(accNo,"TRT",desc,-amount,a.getBalance()));
    tList.add(new TransLog(toAcc,"TRR",desc,amount,getAccount(toAcc).getBalance()));
}
public Vector&lt;Vector&gt; getLogs(int accNo){
    Vector&lt;Vector&gt; accLogs= new Vector&lt;&gt;();
    for(TransLog t:tList)
        if(t.getAccNo()==accNo) accLogs.add(t.toVector());
    return accLogs;
}</code></pre>
<p>Good: both accounts are looked up <em>before</em> money moves, so a wrong target account cannot lose money. Missing: a check that <code>accNo != toAcc</code> and that <code>amount &gt; 0</code>. And <code>getLogs</code> returns <code>Vector&lt;Vector&gt;</code> — the exact shape a Swing <code>JTable</code> wants — so the model is shaped by one particular screen.</p>
<h3>2.5 Login: <code>BankApp.doLogin()</code> and <code>Bank.doLogin()</code></h3>
<pre><code class="language-java">// BankApp
    if((curAcc=bank.doLogin(accNo, pw))!=null){
        System.out.println("Welcome "+curAcc);
        System.out.println("Your last access: "+curAcc.getLastAccess());
        new TransactionMenu().run();
    }
    else System.out.println("Invalid Login");
// Bank
    public Account doLogin(int accNo,String pass){
        Account a=getAccount(accNo);
        if(a.getPass().equals(pass)) {
            a.setLastAccess(new Date());
            return a;
        }
        else throw new RuntimeException("Invalid Login");
    }</code></pre>
<p>Two contracts disagree: <code>BankApp</code> expects <code>null</code> for a failed login, <code>Bank</code> never returns <code>null</code> — it throws. So the <code>else</code> branch is dead code and a wrong password ends the program. Also, <code>Bank.doLogin</code> overwrites <code>lastAccess</code> with "now" <em>before</em> <code>BankApp</code> prints it as the "last access".</p>`,
    `<h2>2. Đọc code — năm đoạn quyết định mọi thứ</h2>
<p>Mọi đoạn trích là code của trường, nguyên văn (chỉ bỏ dòng trống).</p>
<h3>2.1 Cách đọc dữ liệu: <code>textview/Library.java</code> và <code>Menu.getSelected()</code></h3>
<pre><code class="language-java">public interface Library {
    public static String getText(String msg){
        Scanner sc= new Scanner(System.in);
        System.out.print(msg+" : ");
        return sc.nextLine();
    }
    public static int getInt(String msg){
        return Integer.parseInt(getText(msg));
    }
    // getDouble: y hệt, dùng Double.parseDouble
}
// trong Menu:
    public int getSelected(){
        display();
        System.out.print("Please select..:");
        Scanner sc= new Scanner(System.in);
        return sc.nextInt();
    }</code></pre>
<p>Hai "mùi code": một <strong>interface dùng làm túi phương thức static</strong> (hợp lệ từ Java 8, nhưng interface nên mô tả một vai trò mà các lớp hiện thực — một lớp tiện ích <code>final</code> có constructor private nói thật thà là "hàm phụ"), và <strong>mỗi lần gọi tạo một <code>Scanner</code> mới</strong>. <code>Scanner</code> đọc <em>trước</em> vào bộ đệm riêng của nó; khi nó bị vứt đi, những gì nó đã đệm cũng bị vứt theo. Ghi nhớ câu này cho mục 4.</p>
<h3>2.2 Vòng lặp menu và trường hợp Logout</h3>
<pre><code class="language-java">// Menu
    public void run(){
        while(true){
            int n=getSelected();
            if(n&gt;mChon.size()) break;
            execute(n);
        }
    }
// BankApp.TransactionMenu
    public void execute(int n){
        switch(n){
            case 1: doDeposit();break;
            case 2: doWithdraw();break;
            case 3: doTransfer();break;
            case 4: doViewLog();break;
            case 5: curAcc=null;return;
        }
    }</code></pre>
<p>Lần tay từng bước: chọn 5 chạy <code>curAcc=null; return;</code> — <code>return</code> thoát khỏi <code>execute</code>, <strong>không</strong> thoát vòng <code>while</code> trong <code>run()</code>. Vì 5 không lớn hơn kích thước menu (5), vòng lặp lại hiện menu giao dịch, lúc này không còn tài khoản nào đăng nhập. Lối ra duy nhất là gõ từ 6 trở lên. Một dự đoán đáng đem đi thử ở mục 3.</p>
<h3>2.3 Tiền: <code>model/Account.java</code></h3>
<pre><code class="language-java">private double balance;
public void setBalance(double balance) {
    this.balance = balance;
}
public double deposit(double amount){
    return balance+=amount;
}
public double withdraw(double amount){
    if(balance-amount&lt;0) throw new RuntimeException("Not enough money..");
    return balance-=amount;
}</code></pre>
<p>Trường là private, nhưng một <code>setBalance</code> public (cùng <code>setAccNo</code>, <code>setPass</code>) trao chìa khoá cho mọi người — đóng gói chỉ trên danh nghĩa (Chương 3). Không có gì từ chối số tiền âm hay bằng 0. Số dư là <code>double</code>. Lỗi nghiệp vụ là <code>RuntimeException</code> trơn.</p>
<h3>2.4 Chuyển tiền và nhật ký: <code>model/Bank.java</code></h3>
<pre><code class="language-java">public void doTransfer(int accNo,int toAcc,double amount, String desc){
    Account a= getAccount(accNo);
    Account b= getAccount(toAcc);
    a.withdraw(amount); b.deposit(amount);
    tList.add(new TransLog(accNo,"TRT",desc,-amount,a.getBalance()));
    tList.add(new TransLog(toAcc,"TRR",desc,amount,getAccount(toAcc).getBalance()));
}
public Vector&lt;Vector&gt; getLogs(int accNo){
    Vector&lt;Vector&gt; accLogs= new Vector&lt;&gt;();
    for(TransLog t:tList)
        if(t.getAccNo()==accNo) accLogs.add(t.toVector());
    return accLogs;
}</code></pre>
<p>Tốt: cả hai tài khoản được tìm <em>trước</em> khi tiền dịch chuyển, nên gõ sai tài khoản đích không làm mất tiền. Còn thiếu: kiểm <code>accNo != toAcc</code> và <code>amount &gt; 0</code>. Và <code>getLogs</code> trả về <code>Vector&lt;Vector&gt;</code> — đúng hình dạng mà <code>JTable</code> của Swing cần — nên model bị nặn theo một màn hình cụ thể.</p>
<h3>2.5 Đăng nhập: <code>BankApp.doLogin()</code> và <code>Bank.doLogin()</code></h3>
<pre><code class="language-java">// BankApp
    if((curAcc=bank.doLogin(accNo, pw))!=null){
        System.out.println("Welcome "+curAcc);
        System.out.println("Your last access: "+curAcc.getLastAccess());
        new TransactionMenu().run();
    }
    else System.out.println("Invalid Login");
// Bank
    public Account doLogin(int accNo,String pass){
        Account a=getAccount(accNo);
        if(a.getPass().equals(pass)) {
            a.setLastAccess(new Date());
            return a;
        }
        else throw new RuntimeException("Invalid Login");
    }</code></pre>
<p>Hai "hợp đồng" mâu thuẫn nhau: <code>BankApp</code> chờ <code>null</code> khi đăng nhập hỏng, <code>Bank</code> không bao giờ trả <code>null</code> — nó ném ngoại lệ. Vì vậy nhánh <code>else</code> là code chết và gõ sai mật khẩu là kết thúc chương trình. Ngoài ra, <code>Bank.doLogin</code> ghi đè <code>lastAccess</code> bằng "bây giờ" <em>trước khi</em> <code>BankApp</code> in nó ra làm "lần truy cập trước".</p>`),
    bi(`<h2>3. Run it like a user: the original code on a real JDK 8, typed by hand</h2>
<p>This program writes the six original files of <code>model/</code> and <code>textview/</code> into a folder, compiles them with JDK 8's <code>javac</code> and starts <code>textview.BankApp</code> three times. It behaves like a person at the keyboard: it waits until a prompt appears, then types one line (shown right after the prompt, as a terminal shows it). Dates are replaced by <code>&lt;date&gt;</code> and JDK-internal stack frames are shortened so the output is identical on every run.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Banking");
    vietGoc(new File(d, "src"));                             // the six files of model/ and textview/, unchanged
    new File(d, "build").mkdirs();                           // JDK 8 javac does not create the -d folder
    lenh(d, "javac", "-d", "build", "src/model/Account.java", "src/model/Bank.java", "src/model/TransLog.java",
            "src/textview/Library.java", "src/textview/Menu.java", "src/textview/BankApp.java");
    goTay(d, new String[] {
            "2", "An", "Ha Noi", "0901", "an123", "1000",        // create account An, balance 1000
            "2", "Binh", "Da Nang", "0902", "binh456", "500",    // create account Binh, balance 500
            "1", "1001", "an123",                                // login as An
            "1", "200", "salary",                                // deposit 200
            "3", "1002", "-300", "gift",                         // transfer MINUS 300 to Binh
            "4",                                                 // view log
            "5",                                                 // Logout
            "2" },                                               // Withdraw
            "java", "-cp", "build", "textview.BankApp");
    goTay(d, new String[] { "1", "1001", "an123" }, "java", "-cp", "build", "textview.BankApp");   // a new run: log in again
    goTay(d, new String[] { "one" }, "java", "-cp", "build", "textview.BankApp");                 // a word at the menu
}</code></pre>
<div class="out">&gt; javac -d build src/model/Account.java src/model/Bank.java src/model/TransLog.java src/textview/Library.java src/textview/Menu.java src/textview/BankApp.java<br>
Note: Some input files use unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed by hand, one line after each prompt)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:2<br>
Account Name : An<br>
Address : Ha Noi<br>
Tel No : 0901<br>
Password : an123<br>
Initial Balance : 1000<br>
Your account No: 1001<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:2<br>
Account Name : Binh<br>
Address : Da Nang<br>
Tel No : 0902<br>
Password : binh456<br>
Initial Balance : 500<br>
Your account No: 1002<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:1<br>
Account No : 1001<br>
Password : an123<br>
Welcome Account{accNo=1001, accName=An, address=Ha Noi, balance=1000.0, lastAccess=&lt;date&gt;}<br>
Your last access: &lt;date&gt;<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:1<br>
Enter amount : 200<br>
Enter description : salary<br>
Successful. Your new balance 1200.0<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:3<br>
To Account : 1002<br>
Enter amount : -300<br>
Enter description : gift<br>
Successful. Your new balance 1500.0<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:4<br>
Transaction Log - Account An<br>
-----------------------------------------<br>
[1, &lt;date&gt;, REG, 0.0, Create account, 1000.0]<br>
[3, &lt;date&gt;, DEP, 200.0, salary, 1200.0]<br>
[4, &lt;date&gt;, TRT, 300.0, gift, 1500.0]<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:5<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:2<br>
Exception in thread "main" java.lang.RuntimeException: Login please!!<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.doWithdraw(BankApp.java:60)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp$TransactionMenu.execute(BankApp.java:96)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.doLogin(BankApp.java:45)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.execute(BankApp.java:21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed by hand, one line after each prompt)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:1<br>
Account No : 1001<br>
Password : an123<br>
Exception in thread "main" java.lang.RuntimeException: Account doesnot exist!<br>
&nbsp;&nbsp;&nbsp;&nbsp;at model.Bank.getAccount(Bank.java:14)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at model.Bank.doLogin(Bank.java:50)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.doLogin(BankApp.java:42)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.execute(BankApp.java:21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed by hand, one line after each prompt)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:one<br>
Exception in thread "main" java.util.InputMismatchException<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (JDK frames shortened)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.getSelected(Menu.java:43)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:50)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)</div>
<p>What the real output proves:</p>
<ol>
<li><strong>Typed by hand, the happy path works</strong> — accounts 1001 and 1002, the deposit, the log. That is why the bugs below survive in a demo.</li>
<li><strong>A transfer of -300 is "Successful" and An's balance goes UP to 1500.0</strong>; Binh silently loses 300. The log even records the outgoing transfer as <code>TRT, 300.0</code>. Anyone can drain any account they know the number of.</li>
<li><strong>Logout (5) does not leave the menu</strong> — the transaction menu comes back, exactly as traced in 2.2 — and the next choice crashes with <code>RuntimeException: Login please!!</code>. Read the stack trace bottom-up: <code>main → Menu.run → BankApp.execute → doLogin → Menu.run → TransactionMenu.execute → doWithdraw</code> — the transaction menu runs <em>inside</em> <code>doLogin</code>.</li>
<li><strong>A new run has forgotten everything</strong>: account 1001 "doesnot exist" and, because <code>Bank</code> throws instead of returning <code>null</code>, the program ends instead of saying "Invalid Login".</li>
<li><strong>A word at the menu</strong> ends the program with <code>InputMismatchException</code>. Three sessions, three crashes, zero data kept.</li>
</ol>
<p>The <code>Note: Some input files use unchecked or unsafe operations</code> from <code>javac</code> comes from the raw types (<code>ArrayList mChon</code>, <code>Vector</code>) — a warning the course code teaches students to ignore.</p>`,
    `<h2>3. Chạy như người dùng: code gốc trên JDK 8 thật, gõ tay</h2>
<p>Chương trình này ghi sáu file gốc của <code>model/</code> và <code>textview/</code> vào một thư mục, biên dịch bằng <code>javac</code> của JDK 8 rồi khởi động <code>textview.BankApp</code> ba lần. Nó cư xử như một người ngồi trước bàn phím: chờ đến khi dấu nhắc hiện ra mới gõ một dòng (hiện ngay sau dấu nhắc, như terminal vẫn hiện). Ngày giờ được thay bằng <code>&lt;date&gt;</code> và khung stack nội bộ của JDK được rút gọn để output giống hệt nhau mỗi lần chạy.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Banking");
    vietGoc(new File(d, "src"));                             // sáu file của model/ và textview/, giữ nguyên
    new File(d, "build").mkdirs();                           // javac của JDK 8 không tự tạo thư mục -d
    lenh(d, "javac", "-d", "build", "src/model/Account.java", "src/model/Bank.java", "src/model/TransLog.java",
            "src/textview/Library.java", "src/textview/Menu.java", "src/textview/BankApp.java");
    goTay(d, new String[] {
            "2", "An", "Ha Noi", "0901", "an123", "1000",        // mở tài khoản An, số dư 1000
            "2", "Binh", "Da Nang", "0902", "binh456", "500",    // mở tài khoản Binh, số dư 500
            "1", "1001", "an123",                                // đăng nhập An
            "1", "200", "salary",                                // nạp 200
            "3", "1002", "-300", "gift",                         // chuyển ÂM 300 cho Binh
            "4",                                                 // xem nhật ký
            "5",                                                 // Đăng xuất
            "2" },                                               // Rút tiền
            "java", "-cp", "build", "textview.BankApp");
    goTay(d, new String[] { "1", "1001", "an123" }, "java", "-cp", "build", "textview.BankApp");   // lần chạy mới: đăng nhập lại
    goTay(d, new String[] { "one" }, "java", "-cp", "build", "textview.BankApp");                 // gõ chữ ở menu
}</code></pre>
<div class="out">&gt; javac -d build src/model/Account.java src/model/Bank.java src/model/TransLog.java src/textview/Library.java src/textview/Menu.java src/textview/BankApp.java<br>
Note: Some input files use unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed by hand, one line after each prompt)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:2<br>
Account Name : An<br>
Address : Ha Noi<br>
Tel No : 0901<br>
Password : an123<br>
Initial Balance : 1000<br>
Your account No: 1001<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:2<br>
Account Name : Binh<br>
Address : Da Nang<br>
Tel No : 0902<br>
Password : binh456<br>
Initial Balance : 500<br>
Your account No: 1002<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:1<br>
Account No : 1001<br>
Password : an123<br>
Welcome Account{accNo=1001, accName=An, address=Ha Noi, balance=1000.0, lastAccess=&lt;date&gt;}<br>
Your last access: &lt;date&gt;<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:1<br>
Enter amount : 200<br>
Enter description : salary<br>
Successful. Your new balance 1200.0<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:3<br>
To Account : 1002<br>
Enter amount : -300<br>
Enter description : gift<br>
Successful. Your new balance 1500.0<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:4<br>
Transaction Log - Account An<br>
-----------------------------------------<br>
[1, &lt;date&gt;, REG, 0.0, Create account, 1000.0]<br>
[3, &lt;date&gt;, DEP, 200.0, salary, 1200.0]<br>
[4, &lt;date&gt;, TRT, 300.0, gift, 1500.0]<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:5<br>
Trasaction Menu<br>
-----------------------------<br>
1. Deposit<br>
2. Withdraw<br>
3. Transfer<br>
4. View Log<br>
5. Logout<br>
-----------------------------<br>
Please select..:2<br>
Exception in thread "main" java.lang.RuntimeException: Login please!!<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.doWithdraw(BankApp.java:60)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp$TransactionMenu.execute(BankApp.java:96)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.doLogin(BankApp.java:45)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.execute(BankApp.java:21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed by hand, one line after each prompt)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:1<br>
Account No : 1001<br>
Password : an123<br>
Exception in thread "main" java.lang.RuntimeException: Account doesnot exist!<br>
&nbsp;&nbsp;&nbsp;&nbsp;at model.Bank.getAccount(Bank.java:14)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at model.Bank.doLogin(Bank.java:50)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.doLogin(BankApp.java:42)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.execute(BankApp.java:21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed by hand, one line after each prompt)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:one<br>
Exception in thread "main" java.util.InputMismatchException<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (JDK frames shortened)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.getSelected(Menu.java:43)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:50)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)</div>
<p>Output thật chứng minh điều gì:</p>
<ol>
<li><strong>Gõ tay thì đường đi "suôn sẻ" chạy được</strong> — tài khoản 1001 và 1002, lần nạp, nhật ký. Đó là lý do các lỗi dưới đây sống sót qua buổi demo.</li>
<li><strong>Chuyển -300 vẫn "Successful" và số dư của An TĂNG lên 1500.0</strong>; Binh lặng lẽ mất 300. Nhật ký còn ghi lần chuyển đi là <code>TRT, 300.0</code>. Ai biết số tài khoản nào là rút cạn được tài khoản đó.</li>
<li><strong>Logout (5) không rời menu</strong> — menu giao dịch hiện lại, đúng như đã lần tay ở 2.2 — và lựa chọn kế tiếp làm sập chương trình với <code>RuntimeException: Login please!!</code>. Đọc stack trace từ dưới lên: <code>main → Menu.run → BankApp.execute → doLogin → Menu.run → TransactionMenu.execute → doWithdraw</code> — menu giao dịch chạy <em>bên trong</em> <code>doLogin</code>.</li>
<li><strong>Lần chạy mới đã quên sạch</strong>: tài khoản 1001 "doesnot exist" và, vì <code>Bank</code> ném ngoại lệ thay vì trả <code>null</code>, chương trình kết thúc thay vì báo "Invalid Login".</li>
<li><strong>Gõ chữ ở menu</strong> kết thúc chương trình với <code>InputMismatchException</code>. Ba phiên, ba lần sập, không giữ được chút dữ liệu nào.</li>
</ol>
<p>Dòng <code>Note: Some input files use unchecked or unsafe operations</code> của <code>javac</code> đến từ kiểu thô (raw type: <code>ArrayList mChon</code>, <code>Vector</code>) — một cảnh báo mà code mẫu vô tình dạy sinh viên bỏ qua.</p>`),
    bi(`<h2>4. Run it like a grader, then probe the model</h2>
<p>Graders, LAB211 checkers and scripts do not type: they <strong>pipe</strong> the whole input at once. Same original code, same JDK 8 — and a second, tiny program (<code>DoLoi.java</code>, written next to the original sources) that calls the original model directly to measure one design problem per line.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Banking");
    vietGoc(new File(d, "src"));
    new File(d, "build").mkdirs();
    lenh(d, "javac", "-nowarn", "-d", "build", "src/model/Account.java", "src/model/Bank.java", "src/model/TransLog.java",
            "src/textview/Library.java", "src/textview/Menu.java", "src/textview/BankApp.java");
    lenhVao(d, "2\\nAn\\nHa Noi\\n0901\\nan123\\n1000\\n", "java", "-cp", "build", "textview.BankApp");
    viet(d, "src/DoLoi.java", DO_LOI);                       // the probe below, written next to the original sources
    lenh(d, "javac", "-nowarn", "-cp", "build", "-d", "build", "src/DoLoi.java");
    lenh(d, "java", "-cp", "build", "DoLoi");
}</code></pre>
<details><summary>The probe DoLoi.java (calls only the school's public API)</summary>
<pre><code class="language-java">import model.*;
import java.util.*;
import javax.swing.table.DefaultTableModel;

public class DoLoi {
    public static void main(String[] args) throws Exception {
        Bank bank = new Bank();
        Account an = new Account("An", "Ha Noi", "0901", 1000, "an123");
        bank.createAccount(an);
        Date before = an.getLastAccess();
        Thread.sleep(1100);
        Account a = bank.doLogin(1001, "an123");                 // BankApp prints a.getLastAccess() right after this call
        System.out.println("1. after doLogin, getLastAccess() is the login just now, not the previous visit: " + a.getLastAccess().after(before));

        bank.doDeposit(1001, -500, "minus deposit");
        System.out.println("2. deposit of -500 accepted, balance = " + an.getBalance());
        bank.doWithdraw(1001, -200, "minus withdraw");
        System.out.println("   withdraw of -200 accepted, balance = " + an.getBalance());

        an.setBalance(1000000);
        System.out.println("3. setBalance(1000000) from outside: balance = " + an.getBalance() + ", log entries = " + bank.getLogs(1001).size());

        Account c = new Account("Chi", "Hue", "0903", 0, "chi789");
        bank.createAccount(c);
        bank.doDeposit(c.getAccNo(), 0.1, "a");
        bank.doDeposit(c.getAccNo(), 0.2, "b");
        System.out.println("4. deposits 0.1 + 0.2 on a double balance = " + c.getBalance());

        bank.doTransfer(1001, 1001, 100, "to myself");
        System.out.println("5. transfer to the same account accepted, log entries = " + bank.getLogs(1001).size());

        bank.doChangePass(1001, "an123", "an999");
        Vector last = bank.getLogs(1001).lastElement();
        System.out.println("6. change-password log entry: type " + last.get(2) + ", amount " + last.get(3));

        Vector td = new Vector();                                // the next three lines are copied from view/ViewLogForm.java
        td.add("ID"); td.add("Time"); td.add("Type"); td.add("Amount"); td.add("Post Bal");
        DefaultTableModel dtm = new DefaultTableModel(bank.getLogs(1001), td);
        System.out.println("7. GUI log table: " + dtm.getColumnCount() + " columns, column '" + dtm.getColumnName(4) + "' of the first row shows: " + dtm.getValueAt(0, 4));
    }
}</code></pre>
</details>
<div class="out">&gt; javac -nowarn -d build src/model/Account.java src/model/Bank.java src/model/TransLog.java src/textview/Library.java src/textview/Menu.java src/textview/BankApp.java<br>
Note: Some input files use unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: 2 / An / Ha Noi / 0901 / an123 / 1000)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:Account Name : Exception in thread "main" java.util.NoSuchElementException: No line found<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (JDK frames shortened)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Library.getText(Library.java:9)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.createAccount(BankApp.java:29)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.execute(BankApp.java:22)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)<br>
&gt; javac -nowarn -cp build -d build src/DoLoi.java<br>
Note: src/DoLoi.java uses unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; java -cp build DoLoi<br>
1. after doLogin, getLastAccess() is the login just now, not the previous visit: true<br>
2. deposit of -500 accepted, balance = 500.0<br>
&nbsp;&nbsp;&nbsp;withdraw of -200 accepted, balance = 700.0<br>
3. setBalance(1000000) from outside: balance = 1000000.0, log entries = 3<br>
4. deposits 0.1 + 0.2 on a double balance = 0.30000000000000004<br>
5. transfer to the same account accepted, log entries = 5<br>
6. change-password log entry: type CHP, amount 1000000.0<br>
7. GUI log table: 5 columns, column 'Post Bal' of the first row shows: Create account</div>
<p>The piped run dies at the <strong>first</strong> text prompt: <code>getSelected()</code>'s Scanner read ahead and swallowed all six lines into its buffer to find the number 2; then <code>getText()</code> made a fresh Scanner on an empty stream — <code>NoSuchElementException: No line found</code>. By hand it worked only because a human types slower than the program reads. (Same mechanism as Chapter 6 quiz question 8.)</p>
<p>The probe, line by line: (1) "Your last access" always shows the login that just happened; (2) negative deposits and withdrawals are accepted; (3) code outside the model can set any balance and the log does not notice; (4) <code>double</code> cannot store 0.1 exactly; (5) transferring to yourself is "successful" and writes two log entries; (6) a password change is logged with <code>amount</code> = the balance; (7) in the GUI, <code>ViewLogForm</code> declares 5 column names for 6-value rows, so the column titled "Post Bal" shows the <em>description</em> and the real balance after the transaction is never displayed — a bug you can only see because the model was forced to produce table rows.</p>`,
    `<h2>4. Chạy như máy chấm, rồi dò model</h2>
<p>Máy chấm, công cụ kiểm LAB211 và script không gõ phím: chúng <strong>nạp qua pipe</strong> toàn bộ dữ liệu một lúc. Vẫn code gốc, vẫn JDK 8 — cộng thêm một chương trình nhỏ thứ hai (<code>DoLoi.java</code>, ghi cạnh mã nguồn gốc) gọi thẳng model gốc để đo mỗi dòng một vấn đề thiết kế.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Banking");
    vietGoc(new File(d, "src"));
    new File(d, "build").mkdirs();
    lenh(d, "javac", "-nowarn", "-d", "build", "src/model/Account.java", "src/model/Bank.java", "src/model/TransLog.java",
            "src/textview/Library.java", "src/textview/Menu.java", "src/textview/BankApp.java");
    lenhVao(d, "2\\nAn\\nHa Noi\\n0901\\nan123\\n1000\\n", "java", "-cp", "build", "textview.BankApp");
    viet(d, "src/DoLoi.java", DO_LOI);                       // chương trình dò bên dưới, ghi cạnh mã nguồn gốc
    lenh(d, "javac", "-nowarn", "-cp", "build", "-d", "build", "src/DoLoi.java");
    lenh(d, "java", "-cp", "build", "DoLoi");
}</code></pre>
<details><summary>Chương trình dò DoLoi.java (chỉ gọi API public của trường)</summary>
<pre><code class="language-java">import model.*;
import java.util.*;
import javax.swing.table.DefaultTableModel;

public class DoLoi {
    public static void main(String[] args) throws Exception {
        Bank bank = new Bank();
        Account an = new Account("An", "Ha Noi", "0901", 1000, "an123");
        bank.createAccount(an);
        Date before = an.getLastAccess();
        Thread.sleep(1100);
        Account a = bank.doLogin(1001, "an123");                 // BankApp prints a.getLastAccess() right after this call
        System.out.println("1. after doLogin, getLastAccess() is the login just now, not the previous visit: " + a.getLastAccess().after(before));

        bank.doDeposit(1001, -500, "minus deposit");
        System.out.println("2. deposit of -500 accepted, balance = " + an.getBalance());
        bank.doWithdraw(1001, -200, "minus withdraw");
        System.out.println("   withdraw of -200 accepted, balance = " + an.getBalance());

        an.setBalance(1000000);
        System.out.println("3. setBalance(1000000) from outside: balance = " + an.getBalance() + ", log entries = " + bank.getLogs(1001).size());

        Account c = new Account("Chi", "Hue", "0903", 0, "chi789");
        bank.createAccount(c);
        bank.doDeposit(c.getAccNo(), 0.1, "a");
        bank.doDeposit(c.getAccNo(), 0.2, "b");
        System.out.println("4. deposits 0.1 + 0.2 on a double balance = " + c.getBalance());

        bank.doTransfer(1001, 1001, 100, "to myself");
        System.out.println("5. transfer to the same account accepted, log entries = " + bank.getLogs(1001).size());

        bank.doChangePass(1001, "an123", "an999");
        Vector last = bank.getLogs(1001).lastElement();
        System.out.println("6. change-password log entry: type " + last.get(2) + ", amount " + last.get(3));

        Vector td = new Vector();                                // the next three lines are copied from view/ViewLogForm.java
        td.add("ID"); td.add("Time"); td.add("Type"); td.add("Amount"); td.add("Post Bal");
        DefaultTableModel dtm = new DefaultTableModel(bank.getLogs(1001), td);
        System.out.println("7. GUI log table: " + dtm.getColumnCount() + " columns, column '" + dtm.getColumnName(4) + "' of the first row shows: " + dtm.getValueAt(0, 4));
    }
}</code></pre>
</details>
<div class="out">&gt; javac -nowarn -d build src/model/Account.java src/model/Bank.java src/model/TransLog.java src/textview/Library.java src/textview/Menu.java src/textview/BankApp.java<br>
Note: Some input files use unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; java -cp build textview.BankApp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: 2 / An / Ha Noi / 0901 / an123 / 1000)<br>
Virtual Banking<br>
-----------------------------<br>
1. Login<br>
2. Create Account<br>
3. Logout<br>
4. Quit<br>
-----------------------------<br>
Please select..:Account Name : Exception in thread "main" java.util.NoSuchElementException: No line found<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (JDK frames shortened)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Library.getText(Library.java:9)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.createAccount(BankApp.java:29)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.execute(BankApp.java:22)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.Menu.run(Menu.java:52)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at textview.BankApp.main(BankApp.java:86)<br>
(exit code 1)<br>
&gt; javac -nowarn -cp build -d build src/DoLoi.java<br>
Note: src/DoLoi.java uses unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; java -cp build DoLoi<br>
1. after doLogin, getLastAccess() is the login just now, not the previous visit: true<br>
2. deposit of -500 accepted, balance = 500.0<br>
&nbsp;&nbsp;&nbsp;withdraw of -200 accepted, balance = 700.0<br>
3. setBalance(1000000) from outside: balance = 1000000.0, log entries = 3<br>
4. deposits 0.1 + 0.2 on a double balance = 0.30000000000000004<br>
5. transfer to the same account accepted, log entries = 5<br>
6. change-password log entry: type CHP, amount 1000000.0<br>
7. GUI log table: 5 columns, column 'Post Bal' of the first row shows: Create account</div>
<p>Lần chạy qua pipe chết ngay ở ô nhập chữ <strong>đầu tiên</strong>: Scanner của <code>getSelected()</code> đọc trước và nuốt cả sáu dòng vào bộ đệm của nó để tìm số 2; rồi <code>getText()</code> tạo một Scanner mới trên một luồng đã trống — <code>NoSuchElementException: No line found</code>. Gõ tay chạy được chỉ vì con người gõ chậm hơn chương trình đọc. (Cùng cơ chế với câu 8 quiz Chương 6.)</p>
<p>Chương trình dò, từng dòng: (1) "Your last access" luôn hiện chính lần đăng nhập vừa xong; (2) nạp và rút số âm đều được chấp nhận; (3) code bên ngoài model đặt được số dư tuỳ ý mà nhật ký không hay biết; (4) <code>double</code> không lưu chính xác được 0.1; (5) tự chuyển cho chính mình vẫn "thành công" và ghi hai dòng nhật ký; (6) đổi mật khẩu được ghi nhật ký với <code>amount</code> = số dư; (7) trong GUI, <code>ViewLogForm</code> khai 5 tên cột cho các dòng 6 giá trị, nên cột tên "Post Bal" hiện <em>mô tả</em> và số dư thật sau giao dịch không bao giờ được hiển thị — một lỗi chỉ thấy được vì model bị ép phải sinh ra dòng của bảng.</p>`),
    bi(`<h2>5. The bug list, with evidence</h2>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Evidence</th><th>Root cause</th><th>Fixed in</th></tr></thead>
<tbody>
<tr><td>1</td><td>Piped input crashes at the first prompt</td><td>section 4, <code>NoSuchElementException</code></td><td>new <code>Scanner</code> per call</td><td>step 5</td></tr>
<tr><td>2</td><td>Logout does not leave the menu; next choice crashes</td><td>section 3, session 1</td><td><code>return</code> leaves <code>execute</code>, not <code>run()</code></td><td>step 5</td></tr>
<tr><td>3</td><td>Every business error ends the program</td><td>sessions 1–3</td><td><code>RuntimeException</code>, nobody catches</td><td>steps 1, 4, 5</td></tr>
<tr><td>4</td><td>Wrong login = crash; "Invalid Login" never printed</td><td>session 2</td><td>caller expects <code>null</code>, callee throws</td><td>step 4</td></tr>
<tr><td>5</td><td>Negative deposit / withdrawal / transfer accepted</td><td>probe 2, session 1</td><td>no amount check</td><td>step 1</td></tr>
<tr><td>6</td><td>Balance and account number settable from outside</td><td>probe 3</td><td>public setters</td><td>step 1</td></tr>
<tr><td>7</td><td>Money stored as <code>double</code></td><td>probe 4</td><td>binary floating point</td><td>step 1 (<code>long</code> VND)</td></tr>
<tr><td>8</td><td>Transfer to the same account</td><td>probe 5</td><td>missing rule</td><td>step 4</td></tr>
<tr><td>9</td><td>"Last access" shows the current login</td><td>probe 1</td><td>overwritten before printed</td><td>open exercise 4</td></tr>
<tr><td>10</td><td>Password change logged with amount = balance</td><td>probe 6</td><td>copy-paste argument</td><td>step 2</td></tr>
<tr><td>11</td><td>Model builds JTable rows; GUI column "Post Bal" shows the description</td><td>probe 7</td><td>model shaped by the view</td><td>steps 2–3</td></tr>
<tr><td>12</td><td>Nothing is saved; counters restart at 1001</td><td>session 2</td><td>no file layer</td><td>step 6</td></tr>
<tr><td>13</td><td>Password stored and compared in plain text</td><td>code</td><td>—</td><td>step 1 (hash)</td></tr>
</tbody>
</table>
<p>Smaller smells to mention in a code review: <code>Library</code> as an interface of static methods; raw <code>ArrayList</code>/<code>Vector</code>; unused imports (<code>Serializable</code> in <code>Menu</code>, <code>ArrayList</code> in <code>BankApp</code>); typos shown to users ("Trasaction", "doesnot"); in the GUI, <code>public static</code> global state in <code>BankGUI</code>, an absolute image path <code>G:\\FU\\Course\\DemoSP21\\VirtualBank.gif</code> that exists only on the author's PC, and button handlers that call <code>Double.parseDouble</code> with no <code>try</code>.</p>
<div class="pitfall">A review is only as good as its evidence. "Logout is broken" invites an argument; "choose 5, then 2: <code>RuntimeException: Login please!!</code> at <code>BankApp.java:60</code>" ends it. Always attach the input and the real output.</div>`,
    `<h2>5. Danh sách lỗi, kèm bằng chứng</h2>
<table>
<thead><tr><th>#</th><th>Vấn đề</th><th>Bằng chứng</th><th>Nguyên nhân gốc</th><th>Sửa ở</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nạp qua pipe là sập ngay ô nhập đầu tiên</td><td>mục 4, <code>NoSuchElementException</code></td><td>mỗi lần gọi một <code>Scanner</code> mới</td><td>bước 5</td></tr>
<tr><td>2</td><td>Logout không rời menu; lựa chọn kế tiếp làm sập</td><td>mục 3, phiên 1</td><td><code>return</code> thoát <code>execute</code>, không thoát <code>run()</code></td><td>bước 5</td></tr>
<tr><td>3</td><td>Mọi lỗi nghiệp vụ đều kết thúc chương trình</td><td>phiên 1–3</td><td><code>RuntimeException</code>, không ai bắt</td><td>bước 1, 4, 5</td></tr>
<tr><td>4</td><td>Đăng nhập sai = sập; "Invalid Login" không bao giờ in</td><td>phiên 2</td><td>bên gọi chờ <code>null</code>, bên bị gọi lại ném</td><td>bước 4</td></tr>
<tr><td>5</td><td>Nạp / rút / chuyển số âm được chấp nhận</td><td>dò 2, phiên 1</td><td>không kiểm số tiền</td><td>bước 1</td></tr>
<tr><td>6</td><td>Số dư và số tài khoản đặt được từ bên ngoài</td><td>dò 3</td><td>setter public</td><td>bước 1</td></tr>
<tr><td>7</td><td>Tiền lưu bằng <code>double</code></td><td>dò 4</td><td>số thực dấu phẩy động nhị phân</td><td>bước 1 (<code>long</code> đồng)</td></tr>
<tr><td>8</td><td>Chuyển cho chính tài khoản mình</td><td>dò 5</td><td>thiếu luật</td><td>bước 4</td></tr>
<tr><td>9</td><td>"Last access" hiện chính lần đăng nhập này</td><td>dò 1</td><td>bị ghi đè trước khi in</td><td>bài tập mở 4</td></tr>
<tr><td>10</td><td>Đổi mật khẩu ghi nhật ký với số tiền = số dư</td><td>dò 6</td><td>chép-dán đối số</td><td>bước 2</td></tr>
<tr><td>11</td><td>Model dựng dòng cho JTable; cột "Post Bal" của GUI hiện mô tả</td><td>dò 7</td><td>model bị nặn theo giao diện</td><td>bước 2–3</td></tr>
<tr><td>12</td><td>Không lưu gì; bộ đếm quay về 1001</td><td>phiên 2</td><td>không có tầng file</td><td>bước 6</td></tr>
<tr><td>13</td><td>Mật khẩu lưu và so sánh dạng chữ thường</td><td>đọc code</td><td>—</td><td>bước 1 (băm)</td></tr>
</tbody>
</table>
<p>Các "mùi" nhỏ hơn nên nêu khi review code: <code>Library</code> là interface chứa phương thức static; <code>ArrayList</code>/<code>Vector</code> thô; import thừa (<code>Serializable</code> trong <code>Menu</code>, <code>ArrayList</code> trong <code>BankApp</code>); lỗi chính tả hiện cho người dùng ("Trasaction", "doesnot"); bên GUI, trạng thái toàn cục <code>public static</code> trong <code>BankGUI</code>, đường dẫn ảnh tuyệt đối <code>G:\\FU\\Course\\DemoSP21\\VirtualBank.gif</code> chỉ tồn tại trên máy tác giả, và các hàm xử lý nút bấm gọi <code>Double.parseDouble</code> không có <code>try</code>.</p>
<div class="pitfall">Một bản review chỉ tốt bằng bằng chứng của nó. "Logout hỏng" mời gọi tranh cãi; "chọn 5, rồi 2: <code>RuntimeException: Login please!!</code> tại <code>BankApp.java:60</code>" thì chấm dứt tranh cãi. Luôn đính kèm dữ liệu vào và output thật.</div>`),
    bi(`<h2>6. The target design</h2>
<p>Four rules drive every change: <strong>(1)</strong> an object guards its own data — no setter for money, every rule in one place; <strong>(2)</strong> layers talk downward only: UI → service → repository, all sharing the model; <strong>(3)</strong> the service depends on an <em>interface</em> for storage, so memory and files are interchangeable; <strong>(4)</strong> errors the user can cause are reported and the program keeps running.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/4aa0957b5270803848243d5582e022a91f209c71.svg" alt="After: ui → service → repository, a shared model, a checked BankException family" loading="lazy" /><p class="chu-thich">🧩 After: ui → service → repository, a shared model, a checked BankException family</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title After the refactoring - each layer only talks to the layer below it
' ui -&gt; service -&gt; repository; the model is shared; storage can be swapped without touching the service
package ui {
  class ConsoleUI {
    - bank : BankService
    - in : Input
    + run()
    - accountMenu(me : Account)
  }
  class Input {
    - sc : Scanner
    - echo : boolean
    + text(prompt) : String
    + money(prompt) : long
    + number(prompt) : int
    + choice(min, max) : int
  }
}
package service {
  class BankService {
    # repo : BankRepository
    # clock : Clock
    + openAccount(owner, password, opening) : Account
    + login(accNo, password) : Account
    + deposit(accNo, amount, note)
    + withdraw(accNo, amount, note)
    + transfer(fromNo, toNo, amount, note)
    + changePassword(accNo, oldP, newP)
    + history(accNo) : List&lt;Transaction&gt;
    + richest(n : int) : List&lt;Account&gt;
    # find(accNo) : Account
    # record(a, type, amount, note)
  }
}
package repository {
  interface BankRepository {
    + findAccount(accNo) : Optional&lt;Account&gt;
    + allAccounts() : Collection&lt;Account&gt;
    + saveAccount(a : Account)
    + addTransaction(t : Transaction)
    + transactionsOf(accNo) : List&lt;Transaction&gt;
    + nextAccountNo() : int
    + nextTransactionId() : int
  }
  class MemoryBankRepository {
    # accounts : Map&lt;Integer, Account&gt;
    # transactions : List&lt;Transaction&gt;
  }
  class FileBankRepository {
    - accountFile : File
    - transactionFile : File
    - load()
    - writeAll()
  }
}
package model {
  class Account {
    - accNo : int {final}
    - owner : String {final}
    - passwordHash : String
    - balance : long
    + {static} open(accNo, owner, password, opening) : Account
    + checkPassword(p) : boolean
    + deposit(amount : long)
    + withdraw(amount : long)
    + changePassword(oldP, newP)
  }
  class Transaction &lt;&lt;immutable&gt;&gt; {
    - id, accNo : int
    - time : LocalDateTime
    - type : TxType
    - amount, balanceAfter : long
    - note : String
  }
  enum TxType {
    OPEN
    DEPOSIT
    WITHDRAW
    TRANSFER_OUT
    TRANSFER_IN
    CHANGE_PASSWORD
  }
  class BankException &lt;&lt;checked&gt;&gt;
  class AccountNotFoundException
  class InsufficientFundsException
  class AuthenticationException
}
ConsoleUI --&gt; "1" BankService
ConsoleUI --&gt; "1" Input
BankService --&gt; "1" BankRepository
MemoryBankRepository ..|&gt; BankRepository
FileBankRepository --|&gt; MemoryBankRepository
MemoryBankRepository o-- "0..*" Account
MemoryBankRepository o-- "0..*" Transaction
Transaction --&gt; TxType
BankException &lt;|-- AccountNotFoundException
BankException &lt;|-- InsufficientFundsException
BankException &lt;|-- AuthenticationException
BankService ..&gt; BankException : throws
ConsoleUI ..&gt; BankException : catches, prints, continues
hide BankException members
hide AccountNotFoundException members
hide InsufficientFundsException members
hide AuthenticationException members
@enduml</code></pre></details>
<p>All new code below sits in one file per program so it can be run here; in NetBeans put each class in its own file under packages <code>model</code>, <code>repository</code>, <code>service</code>, <code>ui</code> and make the classes and methods <code>public</code>. Every file is compiled with <code>--release 8</code>, so it is valid on the exam machine.</p>`,
    `<h2>6. Thiết kế đích</h2>
<p>Bốn luật dẫn dắt mọi thay đổi: <strong>(1)</strong> đối tượng tự canh dữ liệu của mình — không có setter cho tiền, mỗi luật nằm ở một chỗ; <strong>(2)</strong> các tầng chỉ gọi xuống dưới: UI → service → repository, cùng dùng chung model; <strong>(3)</strong> service phụ thuộc vào một <em>interface</em> kho lưu, nên bộ nhớ và file thay thế được cho nhau; <strong>(4)</strong> lỗi mà người dùng có thể gây ra thì được báo và chương trình chạy tiếp.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/4aa0957b5270803848243d5582e022a91f209c71.svg" alt="Sau khi sửa: ui → service → repository, model dùng chung, một họ ngoại lệ checked BankException" loading="lazy" /><p class="chu-thich">🧩 Sau khi sửa: ui → service → repository, model dùng chung, một họ ngoại lệ checked BankException</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title After the refactoring - each layer only talks to the layer below it
' ui -&gt; service -&gt; repository; model dùng chung; đổi kho lưu không phải sửa service
package ui {
  class ConsoleUI {
    - bank : BankService
    - in : Input
    + run()
    - accountMenu(me : Account)
  }
  class Input {
    - sc : Scanner
    - echo : boolean
    + text(prompt) : String
    + money(prompt) : long
    + number(prompt) : int
    + choice(min, max) : int
  }
}
package service {
  class BankService {
    # repo : BankRepository
    # clock : Clock
    + openAccount(owner, password, opening) : Account
    + login(accNo, password) : Account
    + deposit(accNo, amount, note)
    + withdraw(accNo, amount, note)
    + transfer(fromNo, toNo, amount, note)
    + changePassword(accNo, oldP, newP)
    + history(accNo) : List&lt;Transaction&gt;
    + richest(n : int) : List&lt;Account&gt;
    # find(accNo) : Account
    # record(a, type, amount, note)
  }
}
package repository {
  interface BankRepository {
    + findAccount(accNo) : Optional&lt;Account&gt;
    + allAccounts() : Collection&lt;Account&gt;
    + saveAccount(a : Account)
    + addTransaction(t : Transaction)
    + transactionsOf(accNo) : List&lt;Transaction&gt;
    + nextAccountNo() : int
    + nextTransactionId() : int
  }
  class MemoryBankRepository {
    # accounts : Map&lt;Integer, Account&gt;
    # transactions : List&lt;Transaction&gt;
  }
  class FileBankRepository {
    - accountFile : File
    - transactionFile : File
    - load()
    - writeAll()
  }
}
package model {
  class Account {
    - accNo : int {final}
    - owner : String {final}
    - passwordHash : String
    - balance : long
    + {static} open(accNo, owner, password, opening) : Account
    + checkPassword(p) : boolean
    + deposit(amount : long)
    + withdraw(amount : long)
    + changePassword(oldP, newP)
  }
  class Transaction &lt;&lt;immutable&gt;&gt; {
    - id, accNo : int
    - time : LocalDateTime
    - type : TxType
    - amount, balanceAfter : long
    - note : String
  }
  enum TxType {
    OPEN
    DEPOSIT
    WITHDRAW
    TRANSFER_OUT
    TRANSFER_IN
    CHANGE_PASSWORD
  }
  class BankException &lt;&lt;checked&gt;&gt;
  class AccountNotFoundException
  class InsufficientFundsException
  class AuthenticationException
}
ConsoleUI --&gt; "1" BankService
ConsoleUI --&gt; "1" Input
BankService --&gt; "1" BankRepository
MemoryBankRepository ..|&gt; BankRepository
FileBankRepository --|&gt; MemoryBankRepository
MemoryBankRepository o-- "0..*" Account
MemoryBankRepository o-- "0..*" Transaction
Transaction --&gt; TxType
BankException &lt;|-- AccountNotFoundException
BankException &lt;|-- InsufficientFundsException
BankException &lt;|-- AuthenticationException
BankService ..&gt; BankException : throws
ConsoleUI ..&gt; BankException : catches, prints, continues
hide BankException members
hide AccountNotFoundException members
hide InsufficientFundsException members
hide AuthenticationException members
@enduml</code></pre></details>
<p>Mọi code mới dưới đây nằm trong một file cho mỗi chương trình để chạy được ở đây; trong NetBeans hãy đặt mỗi lớp vào file riêng thuộc package <code>model</code>, <code>repository</code>, <code>service</code>, <code>ui</code> và cho lớp, phương thức là <code>public</code>. Mọi file đều biên dịch với <code>--release 8</code>, nên hợp lệ trên máy phòng thi.</p>`),
    bi(`<h2>Step 1 — the model guards itself (bugs 3, 5, 6, 7, 13)</h2>
<p>Money becomes a <code>long</code> number of <strong>whole VND</strong> — the đồng has no subunit, so integers are exact. Two tiny helpers format it the Vietnamese way and hash passwords:</p>
<pre class="trich"><code class="language-java">final class Money {                                              // whole VND in a long: exact, never 0.30000000000000004
    private Money() { }

    static String vnd(long amount) {
        DecimalFormatSymbols s = new DecimalFormatSymbols(Locale.US);
        s.setGroupingSeparator('.');                             // Vietnamese style 1.000.000 on every JDK
        return new DecimalFormat("#,##0", s).format(amount) + " VND";
    }

    static long parse(String text) {                             // accepts 1000000, 1.000.000 or 1,000,000
        return Long.parseLong(text.trim().replace(".", "").replace(",", ""));
    }
}

final class Password {
    private Password() { }

    static String hash(String plain) {                           // SHA-256: the files never contain the password itself
        try {
            byte[] h = MessageDigest.getInstance("SHA-256").digest(plain.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : h) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}</code></pre>
<p>Business outcomes a correct program must expect become one small family of <strong>checked</strong> exceptions (the design of Chapter 6 practice, exercise 6):</p>
<pre class="trich"><code class="language-java">class BankException extends Exception {                          // checked: a correct program must expect these outcomes
    BankException(String message) { super(message); }
}

class AccountNotFoundException extends BankException {
    AccountNotFoundException(int accNo) { super("Account " + accNo + " does not exist"); }
}

class InsufficientFundsException extends BankException {
    InsufficientFundsException(long balance, long amount) {
        super("Not enough money: balance " + Money.vnd(balance) + ", requested " + Money.vnd(amount));
    }
}

class AuthenticationException extends BankException {
    AuthenticationException() { super("Wrong account number or password"); }   // never say WHICH one was wrong
}</code></pre>
<p>And the new <code>Account</code>: account number and owner are <code>final</code> with no setter; the balance changes only through <code>deposit</code>/<code>withdraw</code>, which share one rule <code>requirePositive</code>; a static factory <code>open</code> validates new accounts, while the plain constructor is kept for loading saved data; <code>toString</code> never shows the password or its hash.</p>
<pre class="trich"><code class="language-java">class Account {
    private final int accNo;                                     // final + no setter: nobody can renumber an account
    private final String owner;
    private String passwordHash;
    private long balance;                                        // changes ONLY through deposit / withdraw

    Account(int accNo, String owner, String passwordHash, long balance) {   // used by open() and when loading from a file
        this.accNo = accNo;
        this.owner = owner;
        this.passwordHash = passwordHash;
        this.balance = balance;
    }

    static Account open(int accNo, String owner, String password, long openingBalance) {
        if (owner == null || owner.trim().isEmpty()) throw new IllegalArgumentException("Owner name is required");
        if (owner.contains("|")) throw new IllegalArgumentException("Owner name may not contain |");
        checkNewPassword(password);
        if (openingBalance &lt; 0) throw new IllegalArgumentException("Opening balance cannot be negative");
        return new Account(accNo, owner.trim(), Password.hash(password), openingBalance);
    }

    int getAccNo() { return accNo; }
    String getOwner() { return owner; }
    long getBalance() { return balance; }
    String getPasswordHash() { return passwordHash; }           // for the repository only, never printed

    boolean checkPassword(String password) {
        return password != null &amp;&amp; passwordHash.equals(Password.hash(password));
    }

    void changePassword(String oldPassword, String newPassword) throws AuthenticationException {
        if (!checkPassword(oldPassword)) throw new AuthenticationException();
        checkNewPassword(newPassword);
        passwordHash = Password.hash(newPassword);
    }

    void deposit(long amount) {
        requirePositive(amount);
        balance += amount;
    }

    void withdraw(long amount) throws InsufficientFundsException {
        requirePositive(amount);
        if (amount &gt; balance) throw new InsufficientFundsException(balance, amount);
        balance -= amount;
    }

    private static void requirePositive(long amount) {          // one rule, one place: no negative deposit, withdrawal or transfer
        if (amount &lt;= 0) throw new IllegalArgumentException("Amount must be greater than 0");
    }

    private static void checkNewPassword(String password) {
        if (password == null || password.length() &lt; 4) throw new IllegalArgumentException("Password needs at least 4 characters");
    }

    @Override
    public String toString() {                                   // no password, no hash
        return accNo + " " + owner + " " + Money.vnd(balance);
    }
}</code></pre>
<p>Test the model alone before building on it:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    Account a = Account.open(1001, "  An ", "an123", 1000000);
    System.out.println("opened:            " + a);
    try {
        a.deposit(-500);
    } catch (IllegalArgumentException e) {
        System.out.println("deposit(-500):     rejected - " + e.getMessage());
    }
    try {
        a.withdraw(5000000);
    } catch (InsufficientFundsException e) {                   // checked: javac forces this catch
        System.out.println("withdraw(5000000): rejected - " + e.getMessage());
    }
    try {
        a.withdraw(200000);
        System.out.println("withdraw(200000):  ok - " + a);
    } catch (InsufficientFundsException e) {
        System.out.println("unexpected: " + e.getMessage());
    }
    System.out.println("checkPassword:     wrong=" + a.checkPassword("an999") + " right=" + a.checkPassword("an123"));
    System.out.println("toString leaks the password? " + a.toString().contains("an123"));
    double d = 0.1 + 0.2;
    long vnd = 100 + 200;
    System.out.println("double 0.1 + 0.2 = " + d + "   |   long 100 + 200 = " + Money.vnd(vnd));
    try {
        Account.open(1002, "Binh", "12", 0);
    } catch (IllegalArgumentException e) {
        System.out.println("open with password \\"12\\": rejected - " + e.getMessage());
    }
}</code></pre>
<div class="out">opened: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1001 An 1.000.000 VND<br>
deposit(-500): &nbsp;&nbsp;&nbsp;&nbsp;rejected - Amount must be greater than 0<br>
withdraw(5000000): rejected - Not enough money: balance 1.000.000 VND, requested 5.000.000 VND<br>
withdraw(200000): &nbsp;ok - 1001 An 800.000 VND<br>
checkPassword: &nbsp;&nbsp;&nbsp;&nbsp;wrong=false right=true<br>
toString leaks the password? false<br>
double 0.1 + 0.2 = 0.30000000000000004 &nbsp;&nbsp;| &nbsp;&nbsp;long 100 + 200 = 300 VND<br>
open with password "12": rejected - Password needs at least 4 characters</div>
<p class="meo">🧠 Two kinds of "no": a negative amount is a <strong>caller's bug</strong> (the UI should never send it) → unchecked <code>IllegalArgumentException</code>; "not enough money" is a <strong>normal business outcome</strong> → checked <code>InsufficientFundsException</code>, and <code>javac</code> forces every caller to decide. <code>account.setBalance(…)</code> no longer compiles at all — the strongest protection there is.</p>`,
    `<h2>Bước 1 — model tự bảo vệ mình (lỗi 3, 5, 6, 7, 13)</h2>
<p>Tiền trở thành một số <code>long</code> <strong>đồng nguyên</strong> — tiền đồng không có đơn vị nhỏ hơn, nên số nguyên là chính xác. Hai lớp phụ nhỏ định dạng tiền kiểu Việt và băm mật khẩu:</p>
<pre class="trich"><code class="language-java">final class Money {                                              // tiền đồng nguyên kiểu long: chính xác, không bao giờ ra 0.30000000000000004
    private Money() { }

    static String vnd(long amount) {
        DecimalFormatSymbols s = new DecimalFormatSymbols(Locale.US);
        s.setGroupingSeparator('.');                             // kiểu Việt 1.000.000 trên mọi JDK
        return new DecimalFormat("#,##0", s).format(amount) + " VND";
    }

    static long parse(String text) {                             // nhận 1000000, 1.000.000 hoặc 1,000,000
        return Long.parseLong(text.trim().replace(".", "").replace(",", ""));
    }
}

final class Password {
    private Password() { }

    static String hash(String plain) {                           // SHA-256: file lưu không bao giờ chứa chính mật khẩu
        try {
            byte[] h = MessageDigest.getInstance("SHA-256").digest(plain.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : h) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}</code></pre>
<p>Các kết cục nghiệp vụ mà chương trình đúng vẫn phải lường trước trở thành một họ nhỏ các ngoại lệ <strong>checked</strong> (thiết kế của bài thực hành Chương 6, bài 6):</p>
<pre class="trich"><code class="language-java">class BankException extends Exception {                          // checked: một chương trình đúng vẫn phải lường trước các kết cục này
    BankException(String message) { super(message); }
}

class AccountNotFoundException extends BankException {
    AccountNotFoundException(int accNo) { super("Account " + accNo + " does not exist"); }
}

class InsufficientFundsException extends BankException {
    InsufficientFundsException(long balance, long amount) {
        super("Not enough money: balance " + Money.vnd(balance) + ", requested " + Money.vnd(amount));
    }
}

class AuthenticationException extends BankException {
    AuthenticationException() { super("Wrong account number or password"); }   // không bao giờ nói CÁI NÀO sai
}</code></pre>
<p>Và <code>Account</code> mới: số tài khoản và chủ tài khoản là <code>final</code>, không có setter; số dư chỉ đổi qua <code>deposit</code>/<code>withdraw</code>, hai phương thức dùng chung một luật <code>requirePositive</code>; phương thức factory static <code>open</code> kiểm tra tài khoản mới, còn constructor thường được giữ để nạp dữ liệu đã lưu; <code>toString</code> không bao giờ lộ mật khẩu hay mã băm của nó.</p>
<pre class="trich"><code class="language-java">class Account {
    private final int accNo;                                     // final + không setter: không ai đánh số lại được tài khoản
    private final String owner;
    private String passwordHash;
    private long balance;                                        // CHỈ đổi qua deposit / withdraw

    Account(int accNo, String owner, String passwordHash, long balance) {   // dùng bởi open() và khi nạp từ file
        this.accNo = accNo;
        this.owner = owner;
        this.passwordHash = passwordHash;
        this.balance = balance;
    }

    static Account open(int accNo, String owner, String password, long openingBalance) {
        if (owner == null || owner.trim().isEmpty()) throw new IllegalArgumentException("Owner name is required");
        if (owner.contains("|")) throw new IllegalArgumentException("Owner name may not contain |");
        checkNewPassword(password);
        if (openingBalance &lt; 0) throw new IllegalArgumentException("Opening balance cannot be negative");
        return new Account(accNo, owner.trim(), Password.hash(password), openingBalance);
    }

    int getAccNo() { return accNo; }
    String getOwner() { return owner; }
    long getBalance() { return balance; }
    String getPasswordHash() { return passwordHash; }           // chỉ cho kho lưu, không bao giờ in ra

    boolean checkPassword(String password) {
        return password != null &amp;&amp; passwordHash.equals(Password.hash(password));
    }

    void changePassword(String oldPassword, String newPassword) throws AuthenticationException {
        if (!checkPassword(oldPassword)) throw new AuthenticationException();
        checkNewPassword(newPassword);
        passwordHash = Password.hash(newPassword);
    }

    void deposit(long amount) {
        requirePositive(amount);
        balance += amount;
    }

    void withdraw(long amount) throws InsufficientFundsException {
        requirePositive(amount);
        if (amount &gt; balance) throw new InsufficientFundsException(balance, amount);
        balance -= amount;
    }

    private static void requirePositive(long amount) {          // một luật, một chỗ: không nạp, rút hay chuyển số âm
        if (amount &lt;= 0) throw new IllegalArgumentException("Amount must be greater than 0");
    }

    private static void checkNewPassword(String password) {
        if (password == null || password.length() &lt; 4) throw new IllegalArgumentException("Password needs at least 4 characters");
    }

    @Override
    public String toString() {                                   // không mật khẩu, không mã băm
        return accNo + " " + owner + " " + Money.vnd(balance);
    }
}</code></pre>
<p>Kiểm thử riêng model trước khi xây tiếp lên trên:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    Account a = Account.open(1001, "  An ", "an123", 1000000);
    System.out.println("opened:            " + a);
    try {
        a.deposit(-500);
    } catch (IllegalArgumentException e) {
        System.out.println("deposit(-500):     rejected - " + e.getMessage());
    }
    try {
        a.withdraw(5000000);
    } catch (InsufficientFundsException e) {                   // checked: javac bắt buộc có catch này
        System.out.println("withdraw(5000000): rejected - " + e.getMessage());
    }
    try {
        a.withdraw(200000);
        System.out.println("withdraw(200000):  ok - " + a);
    } catch (InsufficientFundsException e) {
        System.out.println("unexpected: " + e.getMessage());
    }
    System.out.println("checkPassword:     wrong=" + a.checkPassword("an999") + " right=" + a.checkPassword("an123"));
    System.out.println("toString leaks the password? " + a.toString().contains("an123"));
    double d = 0.1 + 0.2;
    long vnd = 100 + 200;
    System.out.println("double 0.1 + 0.2 = " + d + "   |   long 100 + 200 = " + Money.vnd(vnd));
    try {
        Account.open(1002, "Binh", "12", 0);
    } catch (IllegalArgumentException e) {
        System.out.println("open with password \\"12\\": rejected - " + e.getMessage());
    }
}</code></pre>
<div class="out">opened: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1001 An 1.000.000 VND<br>
deposit(-500): &nbsp;&nbsp;&nbsp;&nbsp;rejected - Amount must be greater than 0<br>
withdraw(5000000): rejected - Not enough money: balance 1.000.000 VND, requested 5.000.000 VND<br>
withdraw(200000): &nbsp;ok - 1001 An 800.000 VND<br>
checkPassword: &nbsp;&nbsp;&nbsp;&nbsp;wrong=false right=true<br>
toString leaks the password? false<br>
double 0.1 + 0.2 = 0.30000000000000004 &nbsp;&nbsp;| &nbsp;&nbsp;long 100 + 200 = 300 VND<br>
open with password "12": rejected - Password needs at least 4 characters</div>
<p class="meo">🧠 Hai kiểu "không": số tiền âm là <strong>lỗi của bên gọi</strong> (giao diện lẽ ra không bao giờ gửi nó) → <code>IllegalArgumentException</code> unchecked; "không đủ tiền" là <strong>kết cục nghiệp vụ bình thường</strong> → <code>InsufficientFundsException</code> checked, và <code>javac</code> buộc mọi bên gọi phải quyết định. <code>account.setBalance(…)</code> giờ không biên dịch được nữa — đó là sự bảo vệ mạnh nhất có thể.</p>`),
    bi(`<h2>Step 2 — log entries that cannot lie (bugs 10, 11)</h2>
<pre class="trich"><code class="language-java">enum TxType { OPEN, DEPOSIT, WITHDRAW, TRANSFER_OUT, TRANSFER_IN, CHANGE_PASSWORD }

final class Transaction {                                        // immutable: a log line never changes once written
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private final int id;
    private final int accNo;
    private final LocalDateTime time;
    private final TxType type;
    private final long amount;                                   // + money in, - money out
    private final long balanceAfter;
    private final String note;

    Transaction(int id, int accNo, LocalDateTime time, TxType type, long amount, long balanceAfter, String note) {
        this.id = id;
        this.accNo = accNo;
        this.time = time;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.note = note;
    }

    int getId() { return id; }
    int getAccNo() { return accNo; }
    LocalDateTime getTime() { return time; }
    TxType getType() { return type; }
    long getAmount() { return amount; }
    long getBalanceAfter() { return balanceAfter; }
    String getNote() { return note; }

    @Override
    public String toString() {
        String sign = amount &gt; 0 ? "+" : "";
        return String.format("#%-2d %s %-15s %16s  balance %15s  %s", id, TIME.format(time), type, sign + Money.vnd(amount),
                Money.vnd(balanceAfter), note);
    }
}</code></pre>
<p>An <code>enum</code> replaces the magic strings <code>"TRT"</code>/<code>"TRR"</code>/<code>"CHP"</code> (a typo is now a compile error); every field is <code>final</code>, so a written entry can never be edited; <code>LocalDateTime</code> (Java 8) replaces <code>Date</code>. Most importantly, there is no <code>toVector()</code>: the model returns a <code>List&lt;Transaction&gt;</code> and each screen decides how to show it — a console prints <code>toString()</code>, a Swing form would build its own table rows, and a web API would return JSON.</p>`,
    `<h2>Bước 2 — dòng nhật ký không thể nói dối (lỗi 10, 11)</h2>
<pre class="trich"><code class="language-java">enum TxType { OPEN, DEPOSIT, WITHDRAW, TRANSFER_OUT, TRANSFER_IN, CHANGE_PASSWORD }

final class Transaction {                                        // bất biến: một dòng nhật ký không bao giờ đổi sau khi ghi
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private final int id;
    private final int accNo;
    private final LocalDateTime time;
    private final TxType type;
    private final long amount;                                   // + tiền vào, - tiền ra
    private final long balanceAfter;
    private final String note;

    Transaction(int id, int accNo, LocalDateTime time, TxType type, long amount, long balanceAfter, String note) {
        this.id = id;
        this.accNo = accNo;
        this.time = time;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.note = note;
    }

    int getId() { return id; }
    int getAccNo() { return accNo; }
    LocalDateTime getTime() { return time; }
    TxType getType() { return type; }
    long getAmount() { return amount; }
    long getBalanceAfter() { return balanceAfter; }
    String getNote() { return note; }

    @Override
    public String toString() {
        String sign = amount &gt; 0 ? "+" : "";
        return String.format("#%-2d %s %-15s %16s  balance %15s  %s", id, TIME.format(time), type, sign + Money.vnd(amount),
                Money.vnd(balanceAfter), note);
    }
}</code></pre>
<p>Một <code>enum</code> thay cho các chuỗi "ma thuật" <code>"TRT"</code>/<code>"TRR"</code>/<code>"CHP"</code> (gõ sai giờ là lỗi biên dịch); mọi trường là <code>final</code>, nên một dòng đã ghi không bao giờ sửa được; <code>LocalDateTime</code> (Java 8) thay cho <code>Date</code>. Quan trọng nhất là không còn <code>toVector()</code>: model trả về <code>List&lt;Transaction&gt;</code> và mỗi màn hình tự quyết cách hiển thị — console in <code>toString()</code>, form Swing tự dựng dòng cho bảng của nó, còn API web thì trả JSON.</p>`),
    bi(`<h2>Step 3 — storage behind an interface</h2>
<pre class="trich"><code class="language-java">interface BankRepository {                                       // WHAT storage can do; HOW is each implementation's business
    Optional&lt;Account&gt; findAccount(int accNo);
    Collection&lt;Account&gt; allAccounts();
    void saveAccount(Account account);                           // insert or update
    void addTransaction(Transaction t);
    List&lt;Transaction&gt; transactionsOf(int accNo);
    int nextAccountNo();
    int nextTransactionId();
}

class MemoryBankRepository implements BankRepository {
    protected final Map&lt;Integer, Account&gt; accounts = new LinkedHashMap&lt;Integer, Account&gt;();   // O(1) lookup by number, keeps insertion order
    protected final List&lt;Transaction&gt; transactions = new ArrayList&lt;Transaction&gt;();

    public Optional&lt;Account&gt; findAccount(int accNo) { return Optional.ofNullable(accounts.get(accNo)); }
    public Collection&lt;Account&gt; allAccounts() { return Collections.unmodifiableCollection(accounts.values()); }
    public void saveAccount(Account account) { accounts.put(account.getAccNo(), account); }
    public void addTransaction(Transaction t) { transactions.add(t); }

    public List&lt;Transaction&gt; transactionsOf(int accNo) {
        List&lt;Transaction&gt; result = new ArrayList&lt;Transaction&gt;();
        for (Transaction t : transactions) if (t.getAccNo() == accNo) result.add(t);
        return result;
    }

    public int nextAccountNo() {                                 // derived from the data, so it survives a restart
        int max = 1000;
        for (int no : accounts.keySet()) max = Math.max(max, no);
        return max + 1;
    }

    public int nextTransactionId() { return transactions.size() + 1; }
}</code></pre>
<p>The interface says <em>what</em> storage offers; <code>MemoryBankRepository</code> is the first <em>how</em>. Collections chosen on purpose (Chapter 8): a <code>LinkedHashMap&lt;Integer, Account&gt;</code> finds an account by number in O(1) instead of the original loop over a list, and keeps insertion order for printing; <code>Optional</code> (Java 8) makes "maybe not found" visible in the method's type instead of returning <code>null</code> or throwing a <code>RuntimeException</code>. <code>allAccounts()</code> returns an <em>unmodifiable</em> view so nobody can bypass the repository. <code>nextAccountNo()</code> is computed from the data, not from a <code>static</code> counter — after a restart it still continues correctly (bug 12).</p>`,
    `<h2>Bước 3 — kho lưu nằm sau một interface</h2>
<pre class="trich"><code class="language-java">interface BankRepository {                                       // kho lưu làm được GÌ; làm THẾ NÀO là việc của từng lớp hiện thực
    Optional&lt;Account&gt; findAccount(int accNo);
    Collection&lt;Account&gt; allAccounts();
    void saveAccount(Account account);                           // thêm mới hoặc cập nhật
    void addTransaction(Transaction t);
    List&lt;Transaction&gt; transactionsOf(int accNo);
    int nextAccountNo();
    int nextTransactionId();
}

class MemoryBankRepository implements BankRepository {
    protected final Map&lt;Integer, Account&gt; accounts = new LinkedHashMap&lt;Integer, Account&gt;();   // tra theo số O(1), giữ thứ tự thêm vào
    protected final List&lt;Transaction&gt; transactions = new ArrayList&lt;Transaction&gt;();

    public Optional&lt;Account&gt; findAccount(int accNo) { return Optional.ofNullable(accounts.get(accNo)); }
    public Collection&lt;Account&gt; allAccounts() { return Collections.unmodifiableCollection(accounts.values()); }
    public void saveAccount(Account account) { accounts.put(account.getAccNo(), account); }
    public void addTransaction(Transaction t) { transactions.add(t); }

    public List&lt;Transaction&gt; transactionsOf(int accNo) {
        List&lt;Transaction&gt; result = new ArrayList&lt;Transaction&gt;();
        for (Transaction t : transactions) if (t.getAccNo() == accNo) result.add(t);
        return result;
    }

    public int nextAccountNo() {                                 // suy ra từ dữ liệu, nên còn đúng sau khi khởi động lại
        int max = 1000;
        for (int no : accounts.keySet()) max = Math.max(max, no);
        return max + 1;
    }

    public int nextTransactionId() { return transactions.size() + 1; }
}</code></pre>
<p>Interface nói kho lưu cung cấp <em>cái gì</em>; <code>MemoryBankRepository</code> là cách làm <em>thế nào</em> đầu tiên. Collections được chọn có chủ đích (Chương 8): <code>LinkedHashMap&lt;Integer, Account&gt;</code> tìm tài khoản theo số trong O(1) thay vì vòng lặp duyệt list như bản gốc, và giữ thứ tự thêm vào để in; <code>Optional</code> (Java 8) làm cho "có thể không tìm thấy" hiện rõ ngay trong kiểu của phương thức thay vì trả <code>null</code> hay ném <code>RuntimeException</code>. <code>allAccounts()</code> trả về một góc nhìn <em>không sửa được</em> (unmodifiable) để không ai đi vòng qua kho lưu. <code>nextAccountNo()</code> được tính từ dữ liệu chứ không từ một bộ đếm <code>static</code> — khởi động lại vẫn đánh số tiếp đúng (lỗi 12).</p>`),
    bi(`<h2>Step 4 — a service that owns the rules (bugs 3, 4, 8)</h2>
<pre class="trich"><code class="language-java">class BankService {                                              // the business rules — no Scanner, no System.out, no file
    protected final BankRepository repo;
    protected final Clock clock;                                 // injected, so a test can fix the time

    BankService(BankRepository repo, Clock clock) {
        this.repo = repo;
        this.clock = clock;
    }

    Account openAccount(String owner, String password, long openingBalance) {
        Account a = Account.open(repo.nextAccountNo(), owner, password, openingBalance);
        repo.saveAccount(a);
        record(a, TxType.OPEN, openingBalance, "Open account");
        return a;
    }

    Account login(int accNo, String password) throws AuthenticationException {
        Optional&lt;Account&gt; a = repo.findAccount(accNo);
        if (!a.isPresent() || !a.get().checkPassword(password)) throw new AuthenticationException();
        return a.get();
    }

    void deposit(int accNo, long amount, String note) throws BankException {
        Account a = find(accNo);
        a.deposit(amount);
        repo.saveAccount(a);
        record(a, TxType.DEPOSIT, amount, note);
    }

    void withdraw(int accNo, long amount, String note) throws BankException {
        Account a = find(accNo);
        a.withdraw(amount);
        repo.saveAccount(a);
        record(a, TxType.WITHDRAW, -amount, note);
    }

    void transfer(int fromNo, int toNo, long amount, String note) throws BankException {
        if (fromNo == toNo) throw new BankException("Cannot transfer to the same account");
        Account from = find(fromNo);                             // both accounts must exist BEFORE any money moves
        Account to = find(toNo);
        from.withdraw(amount);                                   // may throw: nothing has changed yet
        to.deposit(amount);
        repo.saveAccount(from);
        repo.saveAccount(to);
        record(from, TxType.TRANSFER_OUT, -amount, "to " + toNo + ": " + note);
        record(to, TxType.TRANSFER_IN, amount, "from " + fromNo + ": " + note);
    }

    void changePassword(int accNo, String oldPassword, String newPassword) throws BankException {
        Account a = find(accNo);
        a.changePassword(oldPassword, newPassword);
        repo.saveAccount(a);
        record(a, TxType.CHANGE_PASSWORD, 0, "Password changed");
    }

    List&lt;Transaction&gt; history(int accNo) throws AccountNotFoundException {
        find(accNo);
        return repo.transactionsOf(accNo);
    }

    List&lt;Account&gt; richest(int n) {
        List&lt;Account&gt; list = new ArrayList&lt;Account&gt;(repo.allAccounts());
        Collections.sort(list, new Comparator&lt;Account&gt;() {
            @Override
            public int compare(Account a, Account b) {
                return Long.compare(b.getBalance(), a.getBalance());   // descending
            }
        });
        return list.subList(0, Math.min(n, list.size()));
    }

    protected Account find(int accNo) throws AccountNotFoundException {
        Optional&lt;Account&gt; a = repo.findAccount(accNo);
        if (!a.isPresent()) throw new AccountNotFoundException(accNo);
        return a.get();
    }

    protected void record(Account a, TxType type, long amount, String note) {
        String clean = note == null ? "" : note.replace("|", "/").trim();   // | is the file separator
        repo.addTransaction(new Transaction(repo.nextTransactionId(), a.getAccNo(), LocalDateTime.now(clock), type, amount,
                a.getBalance(), clean));
    }
}</code></pre>
<p>The service has no <code>Scanner</code>, no <code>System.out</code> and no file: it can be driven by a console, a Swing form, a test or a web controller without changing a line. <code>login</code> throws the same <code>AuthenticationException</code> for "no such account" and "wrong password" — telling an attacker which account numbers exist is a leak. The time comes from an injected <code>Clock</code>, so a test can freeze or move it (exercise 1 does exactly that). <code>transfer</code> follows one discipline: <strong>check everything that can fail before changing anything</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3c0974e42cbe8166ae10bb9f958117df11bd5030.svg" alt="transfer() after the refactoring: every failure happens before the first change" loading="lazy" /><p class="chu-thich">🧩 transfer() after the refactoring: every failure happens before the first change</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title transfer(1001, 1002, amount) after the refactoring - check everything before any money moves
' Every check that can fail runs before the first change, so a failure leaves both balances untouched
actor User
participant ConsoleUI as UI
participant BankService as S
participant BankRepository as R
participant "from : Account" as A
participant "to : Account" as B
User -&gt; UI : 3, 1002, 300.000, gift
UI -&gt; S : transfer(1001, 1002, 300000, "gift")
alt fromNo == toNo
  S --&gt; UI : BankException "Cannot transfer to the same account"
end
S -&gt; R : findAccount(1001)
S -&gt; R : findAccount(1002)
alt an account is missing
  S --&gt; UI : AccountNotFoundException
end
S -&gt; A : withdraw(300000)
alt amount &lt;= 0
  A --&gt; UI : IllegalArgumentException (nothing changed)
else amount &gt; balance
  A --&gt; UI : InsufficientFundsException (nothing changed)
end
S -&gt; B : deposit(300000)
S -&gt; R : saveAccount(from), saveAccount(to)
S -&gt; R : addTransaction(TRANSFER_OUT), addTransaction(TRANSFER_IN)
S --&gt; UI : return
UI -&gt; User : OK - balance 900.000 VND
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Go further — databases</strong>: in memory, "check first, change after" is enough. With a database the two updates must succeed or fail together even if the server crashes between them — that is a <em>database transaction</em> (PRJ301 5.4, and <code>@Transactional</code> in Spring).</div>`,
    `<h2>Bước 4 — một service nắm luật nghiệp vụ (lỗi 3, 4, 8)</h2>
<pre class="trich"><code class="language-java">class BankService {                                              // luật nghiệp vụ — không Scanner, không System.out, không file
    protected final BankRepository repo;
    protected final Clock clock;                                 // được truyền vào, nên bài kiểm thử cố định được thời gian

    BankService(BankRepository repo, Clock clock) {
        this.repo = repo;
        this.clock = clock;
    }

    Account openAccount(String owner, String password, long openingBalance) {
        Account a = Account.open(repo.nextAccountNo(), owner, password, openingBalance);
        repo.saveAccount(a);
        record(a, TxType.OPEN, openingBalance, "Open account");
        return a;
    }

    Account login(int accNo, String password) throws AuthenticationException {
        Optional&lt;Account&gt; a = repo.findAccount(accNo);
        if (!a.isPresent() || !a.get().checkPassword(password)) throw new AuthenticationException();
        return a.get();
    }

    void deposit(int accNo, long amount, String note) throws BankException {
        Account a = find(accNo);
        a.deposit(amount);
        repo.saveAccount(a);
        record(a, TxType.DEPOSIT, amount, note);
    }

    void withdraw(int accNo, long amount, String note) throws BankException {
        Account a = find(accNo);
        a.withdraw(amount);
        repo.saveAccount(a);
        record(a, TxType.WITHDRAW, -amount, note);
    }

    void transfer(int fromNo, int toNo, long amount, String note) throws BankException {
        if (fromNo == toNo) throw new BankException("Cannot transfer to the same account");
        Account from = find(fromNo);                             // cả hai tài khoản phải tồn tại TRƯỚC khi tiền dịch chuyển
        Account to = find(toNo);
        from.withdraw(amount);                                   // có thể ném: chưa có gì thay đổi
        to.deposit(amount);
        repo.saveAccount(from);
        repo.saveAccount(to);
        record(from, TxType.TRANSFER_OUT, -amount, "to " + toNo + ": " + note);
        record(to, TxType.TRANSFER_IN, amount, "from " + fromNo + ": " + note);
    }

    void changePassword(int accNo, String oldPassword, String newPassword) throws BankException {
        Account a = find(accNo);
        a.changePassword(oldPassword, newPassword);
        repo.saveAccount(a);
        record(a, TxType.CHANGE_PASSWORD, 0, "Password changed");
    }

    List&lt;Transaction&gt; history(int accNo) throws AccountNotFoundException {
        find(accNo);
        return repo.transactionsOf(accNo);
    }

    List&lt;Account&gt; richest(int n) {
        List&lt;Account&gt; list = new ArrayList&lt;Account&gt;(repo.allAccounts());
        Collections.sort(list, new Comparator&lt;Account&gt;() {
            @Override
            public int compare(Account a, Account b) {
                return Long.compare(b.getBalance(), a.getBalance());   // giảm dần
            }
        });
        return list.subList(0, Math.min(n, list.size()));
    }

    protected Account find(int accNo) throws AccountNotFoundException {
        Optional&lt;Account&gt; a = repo.findAccount(accNo);
        if (!a.isPresent()) throw new AccountNotFoundException(accNo);
        return a.get();
    }

    protected void record(Account a, TxType type, long amount, String note) {
        String clean = note == null ? "" : note.replace("|", "/").trim();   // | là dấu tách trong file
        repo.addTransaction(new Transaction(repo.nextTransactionId(), a.getAccNo(), LocalDateTime.now(clock), type, amount,
                a.getBalance(), clean));
    }
}</code></pre>
<p>Service không có <code>Scanner</code>, không có <code>System.out</code>, không có file: nó có thể được điều khiển bởi console, form Swing, bài kiểm thử hay controller web mà không sửa một dòng. <code>login</code> ném cùng một <code>AuthenticationException</code> cho cả "không có tài khoản này" lẫn "sai mật khẩu" — cho kẻ tấn công biết số tài khoản nào tồn tại là một lỗ rò rỉ. Thời gian lấy từ một <code>Clock</code> được truyền vào, nên bài kiểm thử có thể đóng băng hoặc vặn nó (bài tập 1 làm đúng như vậy). <code>transfer</code> theo một kỷ luật: <strong>kiểm mọi thứ có thể hỏng trước khi thay đổi bất cứ thứ gì</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3c0974e42cbe8166ae10bb9f958117df11bd5030.svg" alt="transfer() sau khi sửa: mọi thất bại xảy ra trước thay đổi đầu tiên" loading="lazy" /><p class="chu-thich">🧩 transfer() sau khi sửa: mọi thất bại xảy ra trước thay đổi đầu tiên</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title transfer(1001, 1002, amount) after the refactoring - check everything before any money moves
' Mọi phép kiểm có thể hỏng đều chạy trước thay đổi đầu tiên, nên khi hỏng hai số dư vẫn nguyên vẹn
actor User
participant ConsoleUI as UI
participant BankService as S
participant BankRepository as R
participant "from : Account" as A
participant "to : Account" as B
User -&gt; UI : 3, 1002, 300.000, gift
UI -&gt; S : transfer(1001, 1002, 300000, "gift")
alt fromNo == toNo
  S --&gt; UI : BankException "Cannot transfer to the same account"
end
S -&gt; R : findAccount(1001)
S -&gt; R : findAccount(1002)
alt an account is missing
  S --&gt; UI : AccountNotFoundException
end
S -&gt; A : withdraw(300000)
alt amount &lt;= 0
  A --&gt; UI : IllegalArgumentException (nothing changed)
else amount &gt; balance
  A --&gt; UI : InsufficientFundsException (nothing changed)
end
S -&gt; B : deposit(300000)
S -&gt; R : saveAccount(from), saveAccount(to)
S -&gt; R : addTransaction(TRANSFER_OUT), addTransaction(TRANSFER_IN)
S --&gt; UI : return
UI -&gt; User : OK - balance 900.000 VND
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Đi tiếp — cơ sở dữ liệu</strong>: trong bộ nhớ, "kiểm trước, đổi sau" là đủ. Với cơ sở dữ liệu, hai lần cập nhật phải cùng thành công hoặc cùng thất bại kể cả khi máy chủ sập giữa chừng — đó là <em>giao dịch cơ sở dữ liệu</em> (database transaction — PRJ301 5.4, và <code>@Transactional</code> trong Spring).</div>`),
    bi(`<h2>Step 5 — a console UI with ONE Scanner and a real Logout (bugs 1, 2, 3)</h2>
<pre class="trich"><code class="language-java">class Input {                                                    // ONE Scanner for the whole program
    private final Scanner sc;
    private final boolean echo;

    Input(InputStream in, boolean echo) {
        this.sc = new Scanner(in);
        this.echo = echo;
    }

    String text(String prompt) {
        System.out.print(prompt + ": ");
        if (!sc.hasNextLine()) throw new IllegalStateException("no more input");
        String s = sc.nextLine().trim();
        if (echo) System.out.println(s);                         // piped input is invisible on the console, so repeat it
        return s;
    }

    long money(String prompt) {
        while (true) {
            String s = text(prompt);
            try {
                return Money.parse(s);
            } catch (NumberFormatException e) {
                System.out.println("  Please type a whole number of VND, e.g. 200.000");
            }
        }
    }

    int number(String prompt) {
        while (true) {
            String s = text(prompt);
            try {
                return Integer.parseInt(s);
            } catch (NumberFormatException e) {
                System.out.println("  Please type a number");
            }
        }
    }

    int choice(int min, int max) {
        while (true) {
            int c = number("Choose");
            if (c &gt;= min &amp;&amp; c &lt;= max) return c;
            System.out.println("  Please choose " + min + "-" + max);
        }
    }
}</code></pre>
<p><code>Input</code> owns the program's only <code>Scanner</code>, reads whole lines and converts them (no <code>nextInt</code> leftovers), and asks again on bad input instead of crashing. When input does not come from a keyboard (<code>System.console() == null</code>: a pipe, a file, a grader) it echoes what it read, so the transcript stays readable.</p>
<pre class="trich"><code class="language-java">class ConsoleUI {                                                // reads, calls the service, prints — no business rule here
    private final BankService bank;
    private final Input in;

    ConsoleUI(BankService bank, Input in) {
        this.bank = bank;
        this.in = in;
    }

    void run() {
        while (true) {
            System.out.println("=== VIRTUAL BANKING ===  1. Login  2. Open account  3. Richest accounts  0. Quit");
            int c = in.choice(0, 3);
            if (c == 0) return;
            try {
                if (c == 1) {
                    int no = in.number("Account no");
                    String pass = in.text("Password");
                    accountMenu(bank.login(no, pass));
                } else if (c == 2) {
                    String owner = in.text("Owner name");
                    String pass = in.text("Password");
                    long opening = in.money("Opening balance");
                    System.out.println("  Opened account " + bank.openAccount(owner, pass, opening).getAccNo());
                } else {
                    for (Account a : bank.richest(3)) System.out.println("  " + a);
                }
            } catch (BankException | IllegalArgumentException e) {   // report, then keep running
                System.out.println("  ! " + e.getMessage());
            }
        }
    }

    private void accountMenu(Account me) {
        System.out.println("  Welcome " + me.getOwner() + " - balance " + Money.vnd(me.getBalance()));
        while (true) {
            System.out.println("--- " + me.getAccNo() + ": 1. Deposit  2. Withdraw  3. Transfer  4. History  5. Change password  0. Logout");
            int c = in.choice(0, 5);
            if (c == 0) {
                System.out.println("  Logged out.");
                return;                                          // really leaves this menu
            }
            try {
                if (c == 1) {
                    long amount = in.money("Amount");
                    bank.deposit(me.getAccNo(), amount, in.text("Note"));
                } else if (c == 2) {
                    long amount = in.money("Amount");
                    bank.withdraw(me.getAccNo(), amount, in.text("Note"));
                } else if (c == 3) {
                    int to = in.number("To account");
                    long amount = in.money("Amount");
                    bank.transfer(me.getAccNo(), to, amount, in.text("Note"));
                } else if (c == 4) {
                    for (Transaction t : bank.history(me.getAccNo())) System.out.println("  " + t);
                    continue;
                } else {
                    String old = in.text("Old password");
                    bank.changePassword(me.getAccNo(), old, in.text("New password"));
                }
                System.out.println("  OK - balance " + Money.vnd(me.getBalance()));
            } catch (BankException | IllegalArgumentException e) {
                System.out.println("  ! " + e.getMessage());
            }
        }
    }
}</code></pre>
<p>The account menu is a method with its own loop, and choice 0 <strong>returns from that method</strong> — leaving the loop for real. Each action is wrapped in one <code>try</code> whose multi-catch (<code>BankException | IllegalArgumentException</code> — unrelated types, so it is legal; compare Progress Test 2, question 3) prints the message and lets the loop continue. There is no business rule in this class: it only reads, calls and prints.</p>`,
    `<h2>Bước 5 — giao diện console với MỘT Scanner và Logout thật (lỗi 1, 2, 3)</h2>
<pre class="trich"><code class="language-java">class Input {                                                    // MỘT Scanner cho cả chương trình
    private final Scanner sc;
    private final boolean echo;

    Input(InputStream in, boolean echo) {
        this.sc = new Scanner(in);
        this.echo = echo;
    }

    String text(String prompt) {
        System.out.print(prompt + ": ");
        if (!sc.hasNextLine()) throw new IllegalStateException("no more input");
        String s = sc.nextLine().trim();
        if (echo) System.out.println(s);                         // dữ liệu nạp qua pipe không hiện trên console, nên in lại
        return s;
    }

    long money(String prompt) {
        while (true) {
            String s = text(prompt);
            try {
                return Money.parse(s);
            } catch (NumberFormatException e) {
                System.out.println("  Please type a whole number of VND, e.g. 200.000");
            }
        }
    }

    int number(String prompt) {
        while (true) {
            String s = text(prompt);
            try {
                return Integer.parseInt(s);
            } catch (NumberFormatException e) {
                System.out.println("  Please type a number");
            }
        }
    }

    int choice(int min, int max) {
        while (true) {
            int c = number("Choose");
            if (c &gt;= min &amp;&amp; c &lt;= max) return c;
            System.out.println("  Please choose " + min + "-" + max);
        }
    }
}</code></pre>
<p><code>Input</code> giữ <code>Scanner</code> duy nhất của chương trình, đọc cả dòng rồi chuyển đổi (không còn phần thừa của <code>nextInt</code>), và hỏi lại khi dữ liệu sai thay vì sập. Khi dữ liệu không đến từ bàn phím (<code>System.console() == null</code>: pipe, file, máy chấm) nó in lại thứ vừa đọc, để bản ghi phiên làm việc vẫn dễ đọc.</p>
<pre class="trich"><code class="language-java">class ConsoleUI {                                                // đọc, gọi service, in — không có luật nghiệp vụ ở đây
    private final BankService bank;
    private final Input in;

    ConsoleUI(BankService bank, Input in) {
        this.bank = bank;
        this.in = in;
    }

    void run() {
        while (true) {
            System.out.println("=== VIRTUAL BANKING ===  1. Login  2. Open account  3. Richest accounts  0. Quit");
            int c = in.choice(0, 3);
            if (c == 0) return;
            try {
                if (c == 1) {
                    int no = in.number("Account no");
                    String pass = in.text("Password");
                    accountMenu(bank.login(no, pass));
                } else if (c == 2) {
                    String owner = in.text("Owner name");
                    String pass = in.text("Password");
                    long opening = in.money("Opening balance");
                    System.out.println("  Opened account " + bank.openAccount(owner, pass, opening).getAccNo());
                } else {
                    for (Account a : bank.richest(3)) System.out.println("  " + a);
                }
            } catch (BankException | IllegalArgumentException e) {   // báo lỗi, rồi chạy tiếp
                System.out.println("  ! " + e.getMessage());
            }
        }
    }

    private void accountMenu(Account me) {
        System.out.println("  Welcome " + me.getOwner() + " - balance " + Money.vnd(me.getBalance()));
        while (true) {
            System.out.println("--- " + me.getAccNo() + ": 1. Deposit  2. Withdraw  3. Transfer  4. History  5. Change password  0. Logout");
            int c = in.choice(0, 5);
            if (c == 0) {
                System.out.println("  Logged out.");
                return;                                          // thật sự rời menu này
            }
            try {
                if (c == 1) {
                    long amount = in.money("Amount");
                    bank.deposit(me.getAccNo(), amount, in.text("Note"));
                } else if (c == 2) {
                    long amount = in.money("Amount");
                    bank.withdraw(me.getAccNo(), amount, in.text("Note"));
                } else if (c == 3) {
                    int to = in.number("To account");
                    long amount = in.money("Amount");
                    bank.transfer(me.getAccNo(), to, amount, in.text("Note"));
                } else if (c == 4) {
                    for (Transaction t : bank.history(me.getAccNo())) System.out.println("  " + t);
                    continue;
                } else {
                    String old = in.text("Old password");
                    bank.changePassword(me.getAccNo(), old, in.text("New password"));
                }
                System.out.println("  OK - balance " + Money.vnd(me.getBalance()));
            } catch (BankException | IllegalArgumentException e) {
                System.out.println("  ! " + e.getMessage());
            }
        }
    }
}</code></pre>
<p>Menu tài khoản là một phương thức có vòng lặp riêng, và lựa chọn 0 <strong>return khỏi phương thức đó</strong> — thật sự rời vòng lặp. Mỗi thao tác được bọc trong một <code>try</code> có multi-catch (<code>BankException | IllegalArgumentException</code> — hai kiểu không liên quan nên hợp lệ; so với câu 3 Progress Test 2) in thông báo rồi để vòng lặp chạy tiếp. Lớp này không có luật nghiệp vụ nào: nó chỉ đọc, gọi và in.</p>`),
    bi(`<h2>Step 6 — save to files, load on start (bug 12) — and the whole program, piped</h2>
<pre class="trich"><code class="language-java">class FileBankRepository extends MemoryBankRepository {         // same behaviour + every change is written to two text files
    private final File accountFile;
    private final File transactionFile;

    FileBankRepository(File folder) throws IOException {
        if (!folder.isDirectory() &amp;&amp; !folder.mkdirs()) throw new IOException("Cannot create folder " + folder);
        accountFile = new File(folder, "accounts.txt");
        transactionFile = new File(folder, "transactions.txt");
        load();
    }

    @Override
    public void saveAccount(Account account) {
        super.saveAccount(account);
        writeAll();
    }

    @Override
    public void addTransaction(Transaction t) {
        super.addTransaction(t);
        writeAll();
    }

    private void load() throws IOException {
        for (String line : readLines(accountFile)) {             // accNo|owner|passwordHash|balance
            String[] f = line.split("\\\\|", -1);
            int no = Integer.parseInt(f[0]);
            accounts.put(no, new Account(no, f[1], f[2], Long.parseLong(f[3])));
        }
        for (String line : readLines(transactionFile)) {         // id|accNo|time|type|amount|balanceAfter|note
            String[] f = line.split("\\\\|", -1);                  // -1 keeps an empty last field (an empty note)
            transactions.add(new Transaction(Integer.parseInt(f[0]), Integer.parseInt(f[1]), LocalDateTime.parse(f[2]),
                    TxType.valueOf(f[3]), Long.parseLong(f[4]), Long.parseLong(f[5]), f[6]));
        }
    }

    private static List&lt;String&gt; readLines(File file) throws IOException {
        List&lt;String&gt; lines = new ArrayList&lt;String&gt;();
        if (!file.exists()) return lines;                        // first run: no file yet
        try (BufferedReader r = new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
            for (String line; (line = r.readLine()) != null; ) if (!line.trim().isEmpty()) lines.add(line);
        }
        return lines;
    }

    private void writeAll() {
        try {
            try (BufferedWriter w = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(accountFile), StandardCharsets.UTF_8))) {
                for (Account a : accounts.values()) {
                    w.write(a.getAccNo() + "|" + a.getOwner() + "|" + a.getPasswordHash() + "|" + a.getBalance());
                    w.newLine();
                }
            }
            try (BufferedWriter w = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(transactionFile), StandardCharsets.UTF_8))) {
                for (Transaction t : transactions) {
                    w.write(t.getId() + "|" + t.getAccNo() + "|" + t.getTime() + "|" + t.getType() + "|" + t.getAmount() + "|"
                            + t.getBalanceAfter() + "|" + t.getNote());
                    w.newLine();
                }
            }
        } catch (IOException e) {
            throw new UncheckedIOException(e);                   // the interface methods cannot declare IOException
        }
    }
}</code></pre>
<p><code>FileBankRepository</code> <strong>extends</strong> the memory version and overrides only the two methods that change data, adding <code>writeAll()</code> after each (Chapter 4 + Chapter 9). Details that matter: files are read and written as UTF-8 with try-with-resources (closed even on errors); <code>split("\\\\|", -1)</code> keeps an empty last field — without <code>-1</code> an empty note would vanish and <code>f[6]</code> would throw; an <code>IOException</code> is wrapped in <code>UncheckedIOException</code> because the interface methods do not declare it; the separator <code>|</code> is refused in names and replaced in notes.</p>
<pre class="trich"><code class="language-java">public class BankingMoi {
    public static void main(String[] args) throws IOException {
        // fixed time so this page prints the same every run; a real program uses Clock.systemDefaultZone()
        Clock clock = Clock.fixed(Instant.parse("2026-10-15T02:00:00Z"), ZoneId.of("Asia/Ho_Chi_Minh"));
        Input in = new Input(System.in, System.console() == null);
        File data = new File("data");

        new ConsoleUI(new BankService(new FileBankRepository(data), clock), in).run();

        System.out.println("=== program restarted: a NEW repository reads data/ ===");
        new ConsoleUI(new BankService(new FileBankRepository(data), clock), in).run();

        for (String name : new String[] { "accounts.txt", "transactions.txt" }) {
            System.out.println("&gt; type data\\\\" + name);
            BufferedReader r = new BufferedReader(new InputStreamReader(new FileInputStream(new File(data, name)), StandardCharsets.UTF_8));
            for (String line; (line = r.readLine()) != null; ) System.out.println(line);
            r.close();
        }
    }
}</code></pre>
<p>The run below feeds <strong>the whole input through a pipe</strong> — exactly what killed the original at its first prompt. After the first Quit, <code>main</code> builds a <em>new</em> repository from the same folder — the same thing a restart does (here inside one JVM so the page can show both halves) — and finally prints the two files.</p>
<div class="out">=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name: An<br>
Password: an123<br>
Opening balance: 1.000.000<br>
&nbsp;&nbsp;Opened account 1001<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name: Binh<br>
Password: binh456<br>
Opening balance: 500000<br>
&nbsp;&nbsp;Opened account 1002<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name:<br>
Password: x<br>
Opening balance: 5<br>
&nbsp;&nbsp;! Owner name is required<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 1<br>
Account no: 1001<br>
Password: wrong<br>
&nbsp;&nbsp;! Wrong account number or password<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 1<br>
Account no: 1001<br>
Password: an123<br>
&nbsp;&nbsp;Welcome An - balance 1.000.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 1<br>
Amount: 200.000<br>
Note: salary<br>
&nbsp;&nbsp;OK - balance 1.200.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1002<br>
Amount: -300000<br>
Note: gift<br>
&nbsp;&nbsp;! Amount must be greater than 0<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1002<br>
Amount: 5.000.000<br>
Note: car<br>
&nbsp;&nbsp;! Not enough money: balance 1.200.000 VND, requested 5.000.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1001<br>
Amount: 1000<br>
Note: me<br>
&nbsp;&nbsp;! Cannot transfer to the same account<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1002<br>
Amount: 300.000<br>
Note: gift<br>
&nbsp;&nbsp;OK - balance 900.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 2<br>
Amount: abc<br>
&nbsp;&nbsp;Please type a whole number of VND, e.g. 200.000<br>
Amount: 50000<br>
Note: atm<br>
&nbsp;&nbsp;OK - balance 850.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 4<br>
&nbsp;&nbsp;#1 &nbsp;15/10/2026 09:00 OPEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+1.000.000 VND &nbsp;balance &nbsp;&nbsp;1.000.000 VND &nbsp;Open account<br>
&nbsp;&nbsp;#3 &nbsp;15/10/2026 09:00 DEPOSIT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+200.000 VND &nbsp;balance &nbsp;&nbsp;1.200.000 VND &nbsp;salary<br>
&nbsp;&nbsp;#4 &nbsp;15/10/2026 09:00 TRANSFER_OUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-300.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;900.000 VND &nbsp;to 1002: gift<br>
&nbsp;&nbsp;#6 &nbsp;15/10/2026 09:00 WITHDRAW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-50.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;850.000 VND &nbsp;atm<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 0<br>
&nbsp;&nbsp;Logged out.<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 3<br>
&nbsp;&nbsp;1001 An 850.000 VND<br>
&nbsp;&nbsp;1002 Binh 800.000 VND<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 0<br>
=== program restarted: a NEW repository reads data/ ===<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 1<br>
Account no: 1002<br>
Password: binh456<br>
&nbsp;&nbsp;Welcome Binh - balance 800.000 VND<br>
--- 1002: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 4<br>
&nbsp;&nbsp;#2 &nbsp;15/10/2026 09:00 OPEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+500.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;500.000 VND &nbsp;Open account<br>
&nbsp;&nbsp;#5 &nbsp;15/10/2026 09:00 TRANSFER_IN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+300.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;800.000 VND &nbsp;from 1001: gift<br>
--- 1002: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 0<br>
&nbsp;&nbsp;Logged out.<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name: Chi<br>
Password: chi789<br>
Opening balance: 0<br>
&nbsp;&nbsp;Opened account 1003<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 7<br>
&nbsp;&nbsp;Please choose 0-3<br>
Choose: 0<br>
&gt; type data\\accounts.txt<br>
1001|An|dda798a799ac9bea14584665d896892b28f87076be0cbe7e07a9339f8934133b|850000<br>
1002|Binh|20074f82d8cbc964c1c43cc6011f925a24cfed68ae20f28e017d6f940c740bf8|800000<br>
1003|Chi|10919368d035f1a933079bb678f97fa206f62776148278feb8fe0c20ffcb4d1b|0<br>
&gt; type data\\transactions.txt<br>
1|1001|2026-10-15T09:00|OPEN|1000000|1000000|Open account<br>
2|1002|2026-10-15T09:00|OPEN|500000|500000|Open account<br>
3|1001|2026-10-15T09:00|DEPOSIT|200000|1200000|salary<br>
4|1001|2026-10-15T09:00|TRANSFER_OUT|-300000|900000|to 1002: gift<br>
5|1002|2026-10-15T09:00|TRANSFER_IN|300000|800000|from 1001: gift<br>
6|1001|2026-10-15T09:00|WITHDRAW|-50000|850000|atm<br>
7|1003|2026-10-15T09:00|OPEN|0|0|Open account</div>
<p>Check the output against the bug list: the transfer of -300000 is refused, 5.000.000 is "not enough money", transferring to yourself is refused, a wrong password is reported, "abc" is asked again, Logout returns to the main menu, and nothing ever crashes. After the "restart" Binh still has his 800.000 VND and the next account is 1003, because the data came back from <code>data\\accounts.txt</code>. The files contain password <em>hashes</em>, never the passwords.</p>`,
    `<h2>Bước 6 — lưu ra file, nạp lúc khởi động (lỗi 12) — và cả chương trình, chạy qua pipe</h2>
<pre class="trich"><code class="language-java">class FileBankRepository extends MemoryBankRepository {         // cùng hành vi + mọi thay đổi được ghi ra hai file văn bản
    private final File accountFile;
    private final File transactionFile;

    FileBankRepository(File folder) throws IOException {
        if (!folder.isDirectory() &amp;&amp; !folder.mkdirs()) throw new IOException("Cannot create folder " + folder);
        accountFile = new File(folder, "accounts.txt");
        transactionFile = new File(folder, "transactions.txt");
        load();
    }

    @Override
    public void saveAccount(Account account) {
        super.saveAccount(account);
        writeAll();
    }

    @Override
    public void addTransaction(Transaction t) {
        super.addTransaction(t);
        writeAll();
    }

    private void load() throws IOException {
        for (String line : readLines(accountFile)) {             // accNo|owner|passwordHash|balance
            String[] f = line.split("\\\\|", -1);
            int no = Integer.parseInt(f[0]);
            accounts.put(no, new Account(no, f[1], f[2], Long.parseLong(f[3])));
        }
        for (String line : readLines(transactionFile)) {         // id|accNo|time|type|amount|balanceAfter|note
            String[] f = line.split("\\\\|", -1);                  // -1 giữ trường cuối rỗng (ghi chú trống)
            transactions.add(new Transaction(Integer.parseInt(f[0]), Integer.parseInt(f[1]), LocalDateTime.parse(f[2]),
                    TxType.valueOf(f[3]), Long.parseLong(f[4]), Long.parseLong(f[5]), f[6]));
        }
    }

    private static List&lt;String&gt; readLines(File file) throws IOException {
        List&lt;String&gt; lines = new ArrayList&lt;String&gt;();
        if (!file.exists()) return lines;                        // lần chạy đầu: chưa có file
        try (BufferedReader r = new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
            for (String line; (line = r.readLine()) != null; ) if (!line.trim().isEmpty()) lines.add(line);
        }
        return lines;
    }

    private void writeAll() {
        try {
            try (BufferedWriter w = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(accountFile), StandardCharsets.UTF_8))) {
                for (Account a : accounts.values()) {
                    w.write(a.getAccNo() + "|" + a.getOwner() + "|" + a.getPasswordHash() + "|" + a.getBalance());
                    w.newLine();
                }
            }
            try (BufferedWriter w = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(transactionFile), StandardCharsets.UTF_8))) {
                for (Transaction t : transactions) {
                    w.write(t.getId() + "|" + t.getAccNo() + "|" + t.getTime() + "|" + t.getType() + "|" + t.getAmount() + "|"
                            + t.getBalanceAfter() + "|" + t.getNote());
                    w.newLine();
                }
            }
        } catch (IOException e) {
            throw new UncheckedIOException(e);                   // phương thức của interface không khai báo được IOException
        }
    }
}</code></pre>
<p><code>FileBankRepository</code> <strong>kế thừa</strong> bản bộ nhớ và chỉ ghi đè hai phương thức làm thay đổi dữ liệu, thêm <code>writeAll()</code> sau mỗi lần (Chương 4 + Chương 9). Những chi tiết quan trọng: file được đọc và ghi bằng UTF-8 với try-with-resources (đóng kể cả khi lỗi); <code>split("\\\\|", -1)</code> giữ trường cuối rỗng — thiếu <code>-1</code> thì ghi chú trống sẽ biến mất và <code>f[6]</code> ném ngoại lệ; <code>IOException</code> được bọc trong <code>UncheckedIOException</code> vì phương thức của interface không khai báo nó; dấu tách <code>|</code> bị từ chối trong tên và được thay trong ghi chú.</p>
<pre class="trich"><code class="language-java">public class BankingMoi {
    public static void main(String[] args) throws IOException {
        // cố định thời gian để trang này in giống nhau mỗi lần chạy; chương trình thật dùng Clock.systemDefaultZone()
        Clock clock = Clock.fixed(Instant.parse("2026-10-15T02:00:00Z"), ZoneId.of("Asia/Ho_Chi_Minh"));
        Input in = new Input(System.in, System.console() == null);
        File data = new File("data");

        new ConsoleUI(new BankService(new FileBankRepository(data), clock), in).run();

        System.out.println("=== program restarted: a NEW repository reads data/ ===");
        new ConsoleUI(new BankService(new FileBankRepository(data), clock), in).run();

        for (String name : new String[] { "accounts.txt", "transactions.txt" }) {
            System.out.println("&gt; type data\\\\" + name);
            BufferedReader r = new BufferedReader(new InputStreamReader(new FileInputStream(new File(data, name)), StandardCharsets.UTF_8));
            for (String line; (line = r.readLine()) != null; ) System.out.println(line);
            r.close();
        }
    }
}</code></pre>
<p>Lần chạy dưới đây nạp <strong>toàn bộ dữ liệu qua pipe</strong> — đúng thứ đã giết bản gốc ngay ô nhập đầu tiên. Sau lần Quit đầu tiên, <code>main</code> dựng một repository <em>mới</em> từ cùng thư mục — y như việc khởi động lại chương trình (ở đây làm trong cùng một JVM để trang hiện được cả hai nửa) — và cuối cùng in hai file ra.</p>
<div class="out">=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name: An<br>
Password: an123<br>
Opening balance: 1.000.000<br>
&nbsp;&nbsp;Opened account 1001<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name: Binh<br>
Password: binh456<br>
Opening balance: 500000<br>
&nbsp;&nbsp;Opened account 1002<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name:<br>
Password: x<br>
Opening balance: 5<br>
&nbsp;&nbsp;! Owner name is required<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 1<br>
Account no: 1001<br>
Password: wrong<br>
&nbsp;&nbsp;! Wrong account number or password<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 1<br>
Account no: 1001<br>
Password: an123<br>
&nbsp;&nbsp;Welcome An - balance 1.000.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 1<br>
Amount: 200.000<br>
Note: salary<br>
&nbsp;&nbsp;OK - balance 1.200.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1002<br>
Amount: -300000<br>
Note: gift<br>
&nbsp;&nbsp;! Amount must be greater than 0<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1002<br>
Amount: 5.000.000<br>
Note: car<br>
&nbsp;&nbsp;! Not enough money: balance 1.200.000 VND, requested 5.000.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1001<br>
Amount: 1000<br>
Note: me<br>
&nbsp;&nbsp;! Cannot transfer to the same account<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 3<br>
To account: 1002<br>
Amount: 300.000<br>
Note: gift<br>
&nbsp;&nbsp;OK - balance 900.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 2<br>
Amount: abc<br>
&nbsp;&nbsp;Please type a whole number of VND, e.g. 200.000<br>
Amount: 50000<br>
Note: atm<br>
&nbsp;&nbsp;OK - balance 850.000 VND<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 4<br>
&nbsp;&nbsp;#1 &nbsp;15/10/2026 09:00 OPEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+1.000.000 VND &nbsp;balance &nbsp;&nbsp;1.000.000 VND &nbsp;Open account<br>
&nbsp;&nbsp;#3 &nbsp;15/10/2026 09:00 DEPOSIT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+200.000 VND &nbsp;balance &nbsp;&nbsp;1.200.000 VND &nbsp;salary<br>
&nbsp;&nbsp;#4 &nbsp;15/10/2026 09:00 TRANSFER_OUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-300.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;900.000 VND &nbsp;to 1002: gift<br>
&nbsp;&nbsp;#6 &nbsp;15/10/2026 09:00 WITHDRAW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-50.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;850.000 VND &nbsp;atm<br>
--- 1001: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 0<br>
&nbsp;&nbsp;Logged out.<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 3<br>
&nbsp;&nbsp;1001 An 850.000 VND<br>
&nbsp;&nbsp;1002 Binh 800.000 VND<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 0<br>
=== program restarted: a NEW repository reads data/ ===<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 1<br>
Account no: 1002<br>
Password: binh456<br>
&nbsp;&nbsp;Welcome Binh - balance 800.000 VND<br>
--- 1002: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 4<br>
&nbsp;&nbsp;#2 &nbsp;15/10/2026 09:00 OPEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+500.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;500.000 VND &nbsp;Open account<br>
&nbsp;&nbsp;#5 &nbsp;15/10/2026 09:00 TRANSFER_IN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+300.000 VND &nbsp;balance &nbsp;&nbsp;&nbsp;&nbsp;800.000 VND &nbsp;from 1001: gift<br>
--- 1002: 1. Deposit &nbsp;2. Withdraw &nbsp;3. Transfer &nbsp;4. History &nbsp;5. Change password &nbsp;0. Logout<br>
Choose: 0<br>
&nbsp;&nbsp;Logged out.<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 2<br>
Owner name: Chi<br>
Password: chi789<br>
Opening balance: 0<br>
&nbsp;&nbsp;Opened account 1003<br>
=== VIRTUAL BANKING === &nbsp;1. Login &nbsp;2. Open account &nbsp;3. Richest accounts &nbsp;0. Quit<br>
Choose: 7<br>
&nbsp;&nbsp;Please choose 0-3<br>
Choose: 0<br>
&gt; type data\\accounts.txt<br>
1001|An|dda798a799ac9bea14584665d896892b28f87076be0cbe7e07a9339f8934133b|850000<br>
1002|Binh|20074f82d8cbc964c1c43cc6011f925a24cfed68ae20f28e017d6f940c740bf8|800000<br>
1003|Chi|10919368d035f1a933079bb678f97fa206f62776148278feb8fe0c20ffcb4d1b|0<br>
&gt; type data\\transactions.txt<br>
1|1001|2026-10-15T09:00|OPEN|1000000|1000000|Open account<br>
2|1002|2026-10-15T09:00|OPEN|500000|500000|Open account<br>
3|1001|2026-10-15T09:00|DEPOSIT|200000|1200000|salary<br>
4|1001|2026-10-15T09:00|TRANSFER_OUT|-300000|900000|to 1002: gift<br>
5|1002|2026-10-15T09:00|TRANSFER_IN|300000|800000|from 1001: gift<br>
6|1001|2026-10-15T09:00|WITHDRAW|-50000|850000|atm<br>
7|1003|2026-10-15T09:00|OPEN|0|0|Open account</div>
<p>Đối chiếu output với danh sách lỗi: chuyển -300000 bị từ chối, 5.000.000 là "không đủ tiền", tự chuyển cho mình bị từ chối, sai mật khẩu được báo, "abc" được hỏi lại, Logout quay về menu chính, và không có gì sập. Sau lần "khởi động lại", Binh vẫn còn 800.000 VND và tài khoản kế tiếp là 1003, vì dữ liệu được nạp lại từ <code>data\\accounts.txt</code>. File chứa <em>mã băm</em> mật khẩu, không bao giờ chứa mật khẩu.</p>`),
    bi(`<h2>Before and after, side by side</h2>
<table>
<thead><tr><th>Aspect</th><th>School version</th><th>Refactored</th></tr></thead>
<tbody>
<tr><td>Input</td><td>new <code>Scanner</code> per call; dies on a pipe</td><td>one <code>Scanner</code>; works typed and piped; re-asks on bad input</td></tr>
<tr><td>Errors</td><td><code>RuntimeException</code>, program ends</td><td><code>BankException</code> family, message, program continues</td></tr>
<tr><td>Money</td><td><code>double</code>, any sign, public <code>setBalance</code></td><td><code>long</code> VND, positive only, no setter</td></tr>
<tr><td>Accounts lookup</td><td>loop over <code>ArrayList</code></td><td><code>LinkedHashMap</code> + <code>Optional</code></td></tr>
<tr><td>Log</td><td><code>Vector</code> rows for a JTable, magic strings</td><td>immutable <code>Transaction</code>, <code>enum TxType</code></td></tr>
<tr><td>Layers</td><td>menu calls <code>Bank</code>; GUI shares <code>public static</code> state</td><td>ui → service → repository (interface)</td></tr>
<tr><td>Persistence</td><td>none</td><td>two UTF-8 text files, numbering continues</td></tr>
<tr><td>Passwords</td><td>plain text</td><td>SHA-256 hash (real systems: salted BCrypt)</td></tr>
<tr><td>Testability</td><td>needs a keyboard</td><td>service and model testable alone; injectable <code>Clock</code></td></tr>
</tbody>
</table>
<p>The GUI is out of scope here, but the same layering tells you how to fix it: a form's button handler should parse its fields inside a <code>try</code>, call the <em>service</em>, and show the exception's message — no <code>public static</code> bank:</p>
<pre><code class="language-java">// DepositForm, button "Deposit" - sketch, reading level only (needs a screen to run)
private void depositButtonActionPerformed(java.awt.event.ActionEvent evt) {
    try {
        long amount = Money.parse(amountTxt.getText());
        bank.deposit(session.getAccNo(), amount, descTxt.getText());   // bank, session: passed in the constructor
        JOptionPane.showMessageDialog(this, "New balance: " + Money.vnd(session.getBalance()));
    } catch (NumberFormatException e) {
        JOptionPane.showMessageDialog(this, "Please type a whole number");
    } catch (BankException | IllegalArgumentException e) {
        JOptionPane.showMessageDialog(this, e.getMessage(), "Cannot deposit", JOptionPane.WARNING_MESSAGE);
    }
}</code></pre>`,
    `<h2>Trước và sau, đặt cạnh nhau</h2>
<table>
<thead><tr><th>Khía cạnh</th><th>Bản của trường</th><th>Bản tái cấu trúc</th></tr></thead>
<tbody>
<tr><td>Nhập liệu</td><td>mỗi lần gọi một <code>Scanner</code> mới; chết khi chạy qua pipe</td><td>một <code>Scanner</code>; chạy được cả gõ tay lẫn pipe; hỏi lại khi nhập sai</td></tr>
<tr><td>Lỗi</td><td><code>RuntimeException</code>, chương trình kết thúc</td><td>họ <code>BankException</code>, báo lỗi, chương trình chạy tiếp</td></tr>
<tr><td>Tiền</td><td><code>double</code>, âm dương tuỳ ý, <code>setBalance</code> public</td><td><code>long</code> đồng, chỉ số dương, không setter</td></tr>
<tr><td>Tìm tài khoản</td><td>duyệt <code>ArrayList</code></td><td><code>LinkedHashMap</code> + <code>Optional</code></td></tr>
<tr><td>Nhật ký</td><td>dòng <code>Vector</code> cho JTable, chuỗi "ma thuật"</td><td><code>Transaction</code> bất biến, <code>enum TxType</code></td></tr>
<tr><td>Phân tầng</td><td>menu gọi <code>Bank</code>; GUI dùng chung trạng thái <code>public static</code></td><td>ui → service → repository (interface)</td></tr>
<tr><td>Lưu trữ</td><td>không có</td><td>hai file văn bản UTF-8, đánh số nối tiếp</td></tr>
<tr><td>Mật khẩu</td><td>chữ thường</td><td>mã băm SHA-256 (hệ thống thật: BCrypt có salt)</td></tr>
<tr><td>Kiểm thử được</td><td>cần bàn phím</td><td>service và model kiểm thử riêng được; <code>Clock</code> truyền vào được</td></tr>
</tbody>
</table>
<p>Giao diện GUI nằm ngoài phạm vi bài này, nhưng cùng cách phân tầng đó chỉ ra cách sửa: hàm xử lý nút bấm của form nên chuyển đổi dữ liệu các ô trong một <code>try</code>, gọi <em>service</em>, rồi hiện thông báo của ngoại lệ — không còn bank <code>public static</code>:</p>
<pre><code class="language-java">// DepositForm, nút "Deposit" - phác thảo, chỉ ở mức đọc hiểu (cần màn hình mới chạy được)
private void depositButtonActionPerformed(java.awt.event.ActionEvent evt) {
    try {
        long amount = Money.parse(amountTxt.getText());
        bank.deposit(session.getAccNo(), amount, descTxt.getText());   // bank, session: truyền vào qua constructor
        JOptionPane.showMessageDialog(this, "New balance: " + Money.vnd(session.getBalance()));
    } catch (NumberFormatException e) {
        JOptionPane.showMessageDialog(this, "Please type a whole number");
    } catch (BankException | IllegalArgumentException e) {
        JOptionPane.showMessageDialog(this, e.getMessage(), "Cannot deposit", JOptionPane.WARNING_MESSAGE);
    }
}</code></pre>`),
    bi(`<h2>Extension exercises (with solutions run for real)</h2>
<h3>🧪 Exercise 1 — a daily withdrawal limit (~30 min)</h3>
<p>No account may send out more than 5.000.000 VND per calendar day (withdrawals + outgoing transfers). Do not edit <code>BankService</code>: extend it. Prove that the limit resets the next day.</p>
<details><summary>Solution — override + a clock the test can move</summary>
<pre class="trich"><code class="language-java">class TestClock extends Clock {                                  // a clock a test can move forward
    private Instant now;
    private final ZoneId zone;

    TestClock(String isoInstant, ZoneId zone) {
        this.now = Instant.parse(isoInstant);
        this.zone = zone;
    }

    void plusHours(long hours) { now = now.plusSeconds(hours * 3600); }

    @Override public ZoneId getZone() { return zone; }
    @Override public Clock withZone(ZoneId z) { return new TestClock(now.toString(), z); }
    @Override public Instant instant() { return now; }
}</code></pre>
<pre class="trich"><code class="language-java">class LimitedBankService extends BankService {
    static final long DAILY_LIMIT = 5000000;                     // 5 million VND out of one account per day

    LimitedBankService(BankRepository repo, Clock clock) { super(repo, clock); }

    long outToday(int accNo) throws AccountNotFoundException {
        LocalDate today = LocalDate.now(clock);
        long sum = 0;
        for (Transaction t : history(accNo)) {
            boolean out = t.getType() == TxType.WITHDRAW || t.getType() == TxType.TRANSFER_OUT;
            if (out &amp;&amp; t.getTime().toLocalDate().equals(today)) sum -= t.getAmount();   // amounts out are negative
        }
        return sum;
    }

    private void checkLimit(int accNo, long amount) throws BankException {
        long used = outToday(accNo);
        if (used + amount &gt; DAILY_LIMIT)
            throw new BankException("Daily limit " + Money.vnd(DAILY_LIMIT) + ": already " + Money.vnd(used) + " today");
    }

    @Override
    void withdraw(int accNo, long amount, String note) throws BankException {
        checkLimit(accNo, amount);
        super.withdraw(accNo, amount, note);
    }

    @Override
    void transfer(int fromNo, int toNo, long amount, String note) throws BankException {
        checkLimit(fromNo, amount);
        super.transfer(fromNo, toNo, amount, note);
    }
}</code></pre>
<p>The rule is checked <em>before</em> calling <code>super</code>, so a refused withdrawal changes nothing. Because the service takes a <code>Clock</code>, "tomorrow" is one line in the test — with <code>new Date()</code> inside the model (the original design) you would have to wait 24 hours.</p>
</details>
<h3>🧪 Exercise 2 — a statement of the largest movements (~15 min)</h3>
<p>Print the three transactions of an account with the largest absolute amount, without reordering the history itself.</p>
<details><summary>Solution — sort a copy with a Comparator</summary>
<pre class="trich"><code class="language-java">static List&lt;Transaction&gt; largest(List&lt;Transaction&gt; list, int n) {
    List&lt;Transaction&gt; copy = new ArrayList&lt;Transaction&gt;(list);   // never sort the caller's list
    Collections.sort(copy, new Comparator&lt;Transaction&gt;() {
        @Override
        public int compare(Transaction a, Transaction b) {
            return Long.compare(Math.abs(b.getAmount()), Math.abs(a.getAmount()));
        }
    });
    return copy.subList(0, Math.min(n, copy.size()));
}</code></pre>
</details>
<h3>🧪 Exercise 3 — month-end interest in whole VND (~20 min)</h3>
<p>Pay 5 per mille to every account holding at least 1.000.000 VND, rounding down to the đồng, and log it.</p>
<details><summary>Solution — integer arithmetic, one log entry per account</summary>
<pre class="trich"><code class="language-java">class FullBankService extends LimitedBankService {
    FullBankService(BankRepository repo, Clock clock) { super(repo, clock); }

    int payMonthlyInterest(long minBalance, int perMille) {      // e.g. 5 per mille = 0.5 %
        int paid = 0;
        for (Account a : repo.allAccounts()) {
            if (a.getBalance() &lt; minBalance) continue;
            long interest = a.getBalance() * perMille / 1000;    // integer division rounds DOWN to whole VND
            if (interest == 0) continue;
            a.deposit(interest);
            repo.saveAccount(a);
            record(a, TxType.DEPOSIT, interest, "Interest " + perMille + " per mille");
            paid++;
        }
        return paid;
    }
}</code></pre>
<p><code>balance * perMille / 1000</code> multiplies first, then divides: dividing first would turn 5/1000 into 0. With <code>long</code> the rounding is explicit and predictable — exactly what an accountant expects.</p>
</details>
<p>The three solutions run together:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws BankException {
    TestClock clock = new TestClock("2026-10-15T02:00:00Z", ZoneId.of("Asia/Ho_Chi_Minh"));
    FullBankService bank = new FullBankService(new MemoryBankRepository(), clock);
    int an = bank.openAccount("An", "an123", 20000000).getAccNo();
    int binh = bank.openAccount("Binh", "binh456", 800000).getAccNo();

    System.out.println("-- Exercise 1: daily limit");
    long[] tries = { 3000000, 1500000, 1000000 };
    for (long amount : tries) {
        try {
            bank.withdraw(an, amount, "atm");
            System.out.println("withdraw " + Money.vnd(amount) + ": ok, out today " + Money.vnd(bank.outToday(an)));
        } catch (BankException e) {
            System.out.println("withdraw " + Money.vnd(amount) + ": ! " + e.getMessage());
        }
    }
    clock.plusHours(24);
    bank.transfer(an, binh, 1000000, "next day");
    System.out.println("next day, transfer 1.000.000 VND: ok, out today " + Money.vnd(bank.outToday(an)));

    System.out.println("-- Exercise 2: three largest movements of account " + an);
    for (Transaction t : largest(bank.history(an), 3)) System.out.println(t);

    System.out.println("-- Exercise 3: 5 per mille interest for balances from 1.000.000 VND");
    System.out.println("accounts paid: " + bank.payMonthlyInterest(1000000, 5));
    for (Account a : bank.richest(5)) System.out.println(a);
}</code></pre>
<div class="out">-- Exercise 1: daily limit<br>
withdraw 3.000.000 VND: ok, out today 3.000.000 VND<br>
withdraw 1.500.000 VND: ok, out today 4.500.000 VND<br>
withdraw 1.000.000 VND: ! Daily limit 5.000.000 VND: already 4.500.000 VND today<br>
next day, transfer 1.000.000 VND: ok, out today 1.000.000 VND<br>
-- Exercise 2: three largest movements of account 1001<br>
#1 &nbsp;15/10/2026 09:00 OPEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+20.000.000 VND &nbsp;balance &nbsp;20.000.000 VND &nbsp;Open account<br>
#3 &nbsp;15/10/2026 09:00 WITHDRAW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-3.000.000 VND &nbsp;balance &nbsp;17.000.000 VND &nbsp;atm<br>
#4 &nbsp;15/10/2026 09:00 WITHDRAW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-1.500.000 VND &nbsp;balance &nbsp;15.500.000 VND &nbsp;atm<br>
-- Exercise 3: 5 per mille interest for balances from 1.000.000 VND<br>
accounts paid: 2<br>
1001 An 14.572.500 VND<br>
1002 Binh 1.809.000 VND</div>
<h3>🧪 Open exercises (no solution given)</h3>
<ol start="4">
<li><strong>Last access, done right</strong> (bug 9): keep the previous login time in <code>Account</code>, show it at login, then update it. Where does the clock come from?</li>
<li><strong>Lock after 3 wrong passwords</strong>: which class counts the failures — <code>Account</code> or <code>BankService</code>? Should the counter be saved to the file?</li>
<li><strong>Safe saving</strong>: <code>writeAll()</code> overwrites the file in place; a crash in the middle leaves a broken file. Write to <code>accounts.tmp</code> first, then replace the old file.</li>
<li><strong>A second UI</strong>: drive <code>BankService</code> from the Swing forms (sketch above) without changing the service. If you have to change it, your layering leaked.</li>
</ol>`,
    `<h2>Bài tập mở rộng (lời giải đã chạy thật)</h2>
<h3>🧪 Bài 1 — hạn mức rút mỗi ngày (~30 phút)</h3>
<p>Không tài khoản nào được chuyển ra quá 5.000.000 VND mỗi ngày dương lịch (rút + chuyển đi). Không sửa <code>BankService</code>: hãy kế thừa nó. Chứng minh hạn mức được làm mới vào ngày hôm sau.</p>
<details><summary>Lời giải — ghi đè + một đồng hồ mà bài kiểm thử vặn được</summary>
<pre class="trich"><code class="language-java">class TestClock extends Clock {                                  // một đồng hồ mà bài kiểm thử vặn tới được
    private Instant now;
    private final ZoneId zone;

    TestClock(String isoInstant, ZoneId zone) {
        this.now = Instant.parse(isoInstant);
        this.zone = zone;
    }

    void plusHours(long hours) { now = now.plusSeconds(hours * 3600); }

    @Override public ZoneId getZone() { return zone; }
    @Override public Clock withZone(ZoneId z) { return new TestClock(now.toString(), z); }
    @Override public Instant instant() { return now; }
}</code></pre>
<pre class="trich"><code class="language-java">class LimitedBankService extends BankService {
    static final long DAILY_LIMIT = 5000000;                     // 5 triệu đồng ra khỏi một tài khoản mỗi ngày

    LimitedBankService(BankRepository repo, Clock clock) { super(repo, clock); }

    long outToday(int accNo) throws AccountNotFoundException {
        LocalDate today = LocalDate.now(clock);
        long sum = 0;
        for (Transaction t : history(accNo)) {
            boolean out = t.getType() == TxType.WITHDRAW || t.getType() == TxType.TRANSFER_OUT;
            if (out &amp;&amp; t.getTime().toLocalDate().equals(today)) sum -= t.getAmount();   // số tiền ra là số âm
        }
        return sum;
    }

    private void checkLimit(int accNo, long amount) throws BankException {
        long used = outToday(accNo);
        if (used + amount &gt; DAILY_LIMIT)
            throw new BankException("Daily limit " + Money.vnd(DAILY_LIMIT) + ": already " + Money.vnd(used) + " today");
    }

    @Override
    void withdraw(int accNo, long amount, String note) throws BankException {
        checkLimit(accNo, amount);
        super.withdraw(accNo, amount, note);
    }

    @Override
    void transfer(int fromNo, int toNo, long amount, String note) throws BankException {
        checkLimit(fromNo, amount);
        super.transfer(fromNo, toNo, amount, note);
    }
}</code></pre>
<p>Luật được kiểm <em>trước khi</em> gọi <code>super</code>, nên một lần rút bị từ chối không thay đổi gì. Vì service nhận một <code>Clock</code>, "ngày mai" chỉ là một dòng trong bài kiểm thử — với <code>new Date()</code> nằm trong model (thiết kế gốc) bạn sẽ phải chờ 24 giờ.</p>
</details>
<h3>🧪 Bài 2 — sao kê các giao dịch lớn nhất (~15 phút)</h3>
<p>In ba giao dịch có số tiền tuyệt đối lớn nhất của một tài khoản, mà không sắp xếp lại chính lịch sử giao dịch.</p>
<details><summary>Lời giải — sắp một bản sao bằng Comparator</summary>
<pre class="trich"><code class="language-java">static List&lt;Transaction&gt; largest(List&lt;Transaction&gt; list, int n) {
    List&lt;Transaction&gt; copy = new ArrayList&lt;Transaction&gt;(list);   // không bao giờ sắp list của bên gọi
    Collections.sort(copy, new Comparator&lt;Transaction&gt;() {
        @Override
        public int compare(Transaction a, Transaction b) {
            return Long.compare(Math.abs(b.getAmount()), Math.abs(a.getAmount()));
        }
    });
    return copy.subList(0, Math.min(n, copy.size()));
}</code></pre>
</details>
<h3>🧪 Bài 3 — lãi cuối tháng tính bằng đồng nguyên (~20 phút)</h3>
<p>Trả lãi 5 phần nghìn cho mọi tài khoản có từ 1.000.000 VND trở lên, làm tròn xuống tới đồng, và ghi nhật ký.</p>
<details><summary>Lời giải — số học nguyên, mỗi tài khoản một dòng nhật ký</summary>
<pre class="trich"><code class="language-java">class FullBankService extends LimitedBankService {
    FullBankService(BankRepository repo, Clock clock) { super(repo, clock); }

    int payMonthlyInterest(long minBalance, int perMille) {      // vd 5 phần nghìn = 0,5 %
        int paid = 0;
        for (Account a : repo.allAccounts()) {
            if (a.getBalance() &lt; minBalance) continue;
            long interest = a.getBalance() * perMille / 1000;    // chia nguyên làm tròn XUỐNG tới đồng
            if (interest == 0) continue;
            a.deposit(interest);
            repo.saveAccount(a);
            record(a, TxType.DEPOSIT, interest, "Interest " + perMille + " per mille");
            paid++;
        }
        return paid;
    }
}</code></pre>
<p><code>balance * perMille / 1000</code> nhân trước, chia sau: chia trước thì 5/1000 thành 0. Với <code>long</code>, việc làm tròn rõ ràng và đoán trước được — đúng thứ kế toán mong đợi.</p>
</details>
<p>Ba lời giải chạy cùng nhau:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws BankException {
    TestClock clock = new TestClock("2026-10-15T02:00:00Z", ZoneId.of("Asia/Ho_Chi_Minh"));
    FullBankService bank = new FullBankService(new MemoryBankRepository(), clock);
    int an = bank.openAccount("An", "an123", 20000000).getAccNo();
    int binh = bank.openAccount("Binh", "binh456", 800000).getAccNo();

    System.out.println("-- Exercise 1: daily limit");
    long[] tries = { 3000000, 1500000, 1000000 };
    for (long amount : tries) {
        try {
            bank.withdraw(an, amount, "atm");
            System.out.println("withdraw " + Money.vnd(amount) + ": ok, out today " + Money.vnd(bank.outToday(an)));
        } catch (BankException e) {
            System.out.println("withdraw " + Money.vnd(amount) + ": ! " + e.getMessage());
        }
    }
    clock.plusHours(24);
    bank.transfer(an, binh, 1000000, "next day");
    System.out.println("next day, transfer 1.000.000 VND: ok, out today " + Money.vnd(bank.outToday(an)));

    System.out.println("-- Exercise 2: three largest movements of account " + an);
    for (Transaction t : largest(bank.history(an), 3)) System.out.println(t);

    System.out.println("-- Exercise 3: 5 per mille interest for balances from 1.000.000 VND");
    System.out.println("accounts paid: " + bank.payMonthlyInterest(1000000, 5));
    for (Account a : bank.richest(5)) System.out.println(a);
}</code></pre>
<div class="out">-- Exercise 1: daily limit<br>
withdraw 3.000.000 VND: ok, out today 3.000.000 VND<br>
withdraw 1.500.000 VND: ok, out today 4.500.000 VND<br>
withdraw 1.000.000 VND: ! Daily limit 5.000.000 VND: already 4.500.000 VND today<br>
next day, transfer 1.000.000 VND: ok, out today 1.000.000 VND<br>
-- Exercise 2: three largest movements of account 1001<br>
#1 &nbsp;15/10/2026 09:00 OPEN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+20.000.000 VND &nbsp;balance &nbsp;20.000.000 VND &nbsp;Open account<br>
#3 &nbsp;15/10/2026 09:00 WITHDRAW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-3.000.000 VND &nbsp;balance &nbsp;17.000.000 VND &nbsp;atm<br>
#4 &nbsp;15/10/2026 09:00 WITHDRAW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-1.500.000 VND &nbsp;balance &nbsp;15.500.000 VND &nbsp;atm<br>
-- Exercise 3: 5 per mille interest for balances from 1.000.000 VND<br>
accounts paid: 2<br>
1001 An 14.572.500 VND<br>
1002 Binh 1.809.000 VND</div>
<h3>🧪 Bài tập mở (không kèm lời giải)</h3>
<ol start="4">
<li><strong>Last access làm cho đúng</strong> (lỗi 9): giữ thời điểm đăng nhập trước trong <code>Account</code>, hiện nó lúc đăng nhập, rồi mới cập nhật. Đồng hồ lấy từ đâu?</li>
<li><strong>Khoá sau 3 lần sai mật khẩu</strong>: lớp nào đếm số lần sai — <code>Account</code> hay <code>BankService</code>? Bộ đếm có nên lưu vào file không?</li>
<li><strong>Lưu an toàn</strong>: <code>writeAll()</code> ghi đè file tại chỗ; sập giữa chừng là để lại file hỏng. Hãy ghi ra <code>accounts.tmp</code> trước, rồi mới thay file cũ.</li>
<li><strong>Giao diện thứ hai</strong>: điều khiển <code>BankService</code> từ các form Swing (phác thảo ở trên) mà không sửa service. Nếu phải sửa nó, nghĩa là cách phân tầng của bạn đã bị rò.</li>
</ol>`),
    bi(`<h2>🧭 If it were written in Spring Boot</h2>
<div class="callout">🧭 <strong>Go further — PRJ301 / Spring Boot</strong> (illustration, Java 17 — not for the PE): the four layers you just built are exactly the ones a Spring Boot application has; the framework only takes over the wiring. <code>BankRepository</code> becomes an interface Spring implements for you against a database, <code>BankService</code> gets <code>@Service</code> and <code>@Transactional</code>, <code>ConsoleUI</code> becomes a <code>@RestController</code>, and the <code>new BankService(new FileBankRepository(…), clock)</code> line in <code>main</code> disappears — Spring injects the constructor arguments (dependency injection).
<pre><code class="language-java">@Entity
public class Account {
    @Id private Integer accNo;
    private String owner;
    private String passwordHash;
    private long balance;
    // deposit(), withdraw() exactly as in step 1 - the rules stay in the entity
}

public interface AccountRepository extends JpaRepository&lt;Account, Integer&gt; { }   // findById returns Optional

@Service
public class BankService {
    private final AccountRepository accounts;
    public BankService(AccountRepository accounts) { this.accounts = accounts; }   // injected by Spring

    @Transactional(rollbackFor = BankException.class)    // both updates commit together, or neither
    // rollbackFor: by default Spring rolls back only on RuntimeException; BankException is checked
    public void transfer(int fromNo, int toNo, long amount) throws BankException {
        Account from = accounts.findById(fromNo).orElseThrow(() -&gt; new AccountNotFoundException(fromNo));
        Account to = accounts.findById(toNo).orElseThrow(() -&gt; new AccountNotFoundException(toNo));
        from.withdraw(amount);
        to.deposit(amount);
    }
}

@RestController
public class BankController {
    private final BankService bank;
    public BankController(BankService bank) { this.bank = bank; }

    @PostMapping("/accounts/{no}/transfers")
    public void transfer(@PathVariable int no, @RequestBody TransferRequest r) throws BankException {
        bank.transfer(no, r.to(), r.amount());
    }
}</code></pre>
The same ideas, step by step, in PRJ301: <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-jdbc-dao">5.1 — the DAO pattern</a> (your repository, written with JDBC), <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-mvc">6.1 — MVC</a> (your UI/service split on the web) and <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-nang-cao">A.1 — Spring Boot</a>.</div>
<p>Design principles behind this lesson, with names: single responsibility, dependency on abstractions, composition over global state — see <a href="/courses/object-oriented-programming/learn?lessonSlug=pro192-n2-1-solid">N2.1 — Good OO design &amp; SOLID basics</a>.</p>`,
    `<h2>🧭 Nếu viết bằng Spring Boot</h2>
<div class="callout">🧭 <strong>Đi tiếp — PRJ301 / Spring Boot</strong> (ví dụ minh hoạ, Java 17 — không dùng cho PE): bốn tầng bạn vừa dựng chính là bốn tầng của một ứng dụng Spring Boot; framework chỉ lo phần lắp ráp. <code>BankRepository</code> thành một interface mà Spring tự hiện thực cho bạn trên cơ sở dữ liệu, <code>BankService</code> được gắn <code>@Service</code> và <code>@Transactional</code>, <code>ConsoleUI</code> thành một <code>@RestController</code>, và dòng <code>new BankService(new FileBankRepository(…), clock)</code> trong <code>main</code> biến mất — Spring tự truyền đối số cho constructor (dependency injection — tiêm phụ thuộc).
<pre><code class="language-java">@Entity
public class Account {
    @Id private Integer accNo;
    private String owner;
    private String passwordHash;
    private long balance;
    // deposit(), withdraw() y như bước 1 - luật vẫn nằm trong entity
}

public interface AccountRepository extends JpaRepository&lt;Account, Integer&gt; { }   // findById trả về Optional

@Service
public class BankService {
    private final AccountRepository accounts;
    public BankService(AccountRepository accounts) { this.accounts = accounts; }   // Spring tự truyền vào

    @Transactional(rollbackFor = BankException.class)    // hai cập nhật cùng được ghi, hoặc không cái nào
    // rollbackFor: mặc định Spring chỉ rollback khi gặp RuntimeException; BankException là checked
    public void transfer(int fromNo, int toNo, long amount) throws BankException {
        Account from = accounts.findById(fromNo).orElseThrow(() -&gt; new AccountNotFoundException(fromNo));
        Account to = accounts.findById(toNo).orElseThrow(() -&gt; new AccountNotFoundException(toNo));
        from.withdraw(amount);
        to.deposit(amount);
    }
}

@RestController
public class BankController {
    private final BankService bank;
    public BankController(BankService bank) { this.bank = bank; }

    @PostMapping("/accounts/{no}/transfers")
    public void transfer(@PathVariable int no, @RequestBody TransferRequest r) throws BankException {
        bank.transfer(no, r.to(), r.amount());
    }
}</code></pre>
Cùng những ý đó, từng bước, trong PRJ301: <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-jdbc-dao">5.1 — mẫu DAO</a> (chính là repository của bạn, viết bằng JDBC), <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-mvc">6.1 — MVC</a> (cách tách UI/service của bạn trên web) và <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-nang-cao">A.1 — Spring Boot</a>.</div>
<p>Các nguyên tắc thiết kế đứng sau bài này, có tên gọi: trách nhiệm đơn nhất, phụ thuộc vào trừu tượng, ghép đối tượng thay cho trạng thái toàn cục — xem <a href="/courses/object-oriented-programming/learn?lessonSlug=pro192-n2-1-solid">N2.1 — Thiết kế OO tốt &amp; SOLID cơ bản</a>.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>code review</strong></td><td>rà soát code</td><td>Reading someone else's code to find bugs and design problems, backed by evidence.</td></tr>
<tr><td><strong>refactoring</strong></td><td>tái cấu trúc</td><td>Changing the structure of code without changing what it does for the user.</td></tr>
<tr><td><strong>layer</strong></td><td>tầng</td><td>A group of classes with one job (UI, service, repository) that only calls the layer below.</td></tr>
<tr><td><strong>service</strong></td><td>tầng nghiệp vụ</td><td>The class that owns the business rules and uses the repository, with no input or output code.</td></tr>
<tr><td><strong>repository</strong></td><td>kho lưu</td><td>An interface that hides how objects are stored and found (memory, file, database).</td></tr>
<tr><td><strong>dead code</strong></td><td>code chết</td><td>Code that can never run, like the else branch of the original login.</td></tr>
<tr><td><strong>read-ahead buffer</strong></td><td>bộ đệm đọc trước</td><td>The text a Scanner has already taken from the input but not yet returned to you.</td></tr>
<tr><td><strong>pipe</strong></td><td>đường ống</td><td>Feeding a program's input from a file or another program all at once, as graders do.</td></tr>
<tr><td><strong>immutable</strong></td><td>bất biến</td><td>An object whose fields can never change after construction (all final, no setters).</td></tr>
<tr><td><strong>static factory method</strong></td><td>phương thức factory tĩnh</td><td>A static method such as Account.open() that validates and creates an object instead of a public constructor.</td></tr>
<tr><td><strong>dependency injection</strong></td><td>tiêm phụ thuộc</td><td>Giving an object what it needs (repository, clock) through its constructor instead of creating it inside.</td></tr>
<tr><td><strong>hash</strong></td><td>mã băm</td><td>A fixed-length fingerprint of a password; the password cannot be read back from it, but a weak password can still be guessed by trying a dictionary — hence a salted, slow hash such as BCrypt.</td></tr>
<tr><td><strong>database transaction</strong></td><td>giao dịch cơ sở dữ liệu</td><td>A group of updates that are saved all together or not at all.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>code review</strong></td><td>rà soát code</td><td>Đọc code của người khác để tìm lỗi và vấn đề thiết kế, kèm bằng chứng.</td></tr>
<tr><td><strong>refactoring</strong></td><td>tái cấu trúc</td><td>Thay đổi cấu trúc code mà không đổi những gì nó làm cho người dùng.</td></tr>
<tr><td><strong>layer</strong></td><td>tầng</td><td>Một nhóm lớp có một nhiệm vụ (UI, service, repository), chỉ gọi tầng bên dưới.</td></tr>
<tr><td><strong>service</strong></td><td>tầng nghiệp vụ</td><td>Lớp nắm luật nghiệp vụ và dùng repository, không có code nhập xuất.</td></tr>
<tr><td><strong>repository</strong></td><td>kho lưu</td><td>Interface che giấu cách đối tượng được lưu và tìm (bộ nhớ, file, cơ sở dữ liệu).</td></tr>
<tr><td><strong>dead code</strong></td><td>code chết</td><td>Code không bao giờ chạy được, như nhánh else của đăng nhập bản gốc.</td></tr>
<tr><td><strong>read-ahead buffer</strong></td><td>bộ đệm đọc trước</td><td>Phần chữ mà Scanner đã lấy khỏi luồng nhập nhưng chưa trả cho bạn.</td></tr>
<tr><td><strong>pipe</strong></td><td>đường ống</td><td>Nạp toàn bộ dữ liệu vào chương trình một lúc từ file hay chương trình khác, như máy chấm làm.</td></tr>
<tr><td><strong>immutable</strong></td><td>bất biến</td><td>Đối tượng mà các trường không bao giờ đổi sau khi tạo (đều final, không setter).</td></tr>
<tr><td><strong>static factory method</strong></td><td>phương thức factory tĩnh</td><td>Phương thức static như Account.open() kiểm tra rồi tạo đối tượng thay cho constructor public.</td></tr>
<tr><td><strong>dependency injection</strong></td><td>tiêm phụ thuộc</td><td>Đưa cho đối tượng thứ nó cần (repository, đồng hồ) qua constructor thay vì tự tạo bên trong.</td></tr>
<tr><td><strong>hash</strong></td><td>mã băm</td><td>Dấu vân tay độ dài cố định của mật khẩu; không thể đọc ngược ra mật khẩu từ nó, nhưng mật khẩu yếu vẫn đoán được bằng cách thử cả một từ điển — vì thế dùng hàm băm có muối và chậm như BCrypt.</td></tr>
<tr><td><strong>database transaction</strong></td><td>giao dịch cơ sở dữ liệu</td><td>Một nhóm cập nhật được lưu cùng lúc tất cả hoặc không cái nào.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

export default {
  extrasEnd: [L_x_banking],
};
