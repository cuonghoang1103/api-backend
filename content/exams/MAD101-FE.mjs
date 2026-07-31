// MAD101 — Discrete Mathematics. Final Exam question banks (Đề 1..Đề 10),
// transcribed from the school's fuoverflow simulator images, answers solved manually.
// Auto-generated from the banks — see content/exams/_work/build-mad101-fe-deN.py.
export default {
  "course": {
    "courseCode": "MAD101"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "MAD-D1",
      "source": "REAL",
      "sortOrder": 201,
      "title": "Final Exam — Đề 1|||Thi cuối kỳ — Đề 1",
      "description": "MAD101 Final Exam, Đề 1 (49 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 1 (49 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 98,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a proposition with the given truth table: p,q,? = (T,T,T),(T,F,F),(F,T,T),(F,F,F)|||Tìm một mệnh đề có bảng chân trị: p,q,? = (T,T,T),(T,F,F),(F,T,T),(F,F,F)",
          "options": [
            {
              "text": "Only (i) ¬p∧q|||Chỉ (i) ¬p∧q"
            },
            {
              "text": "Only (ii) q∨(¬p∧q)|||Chỉ (ii) q∨(¬p∧q)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The result column equals q in every row (T,F,T,F). (i) ¬p∧q at row p=T,q=T gives F≠T, fails. (ii) q∨(¬p∧q) simplifies by absorption to q, which matches exactly.</div><div class=\"ml-vi\">Cột kết quả bằng q ở mọi dòng (T,F,T,F). (i) ¬p∧q tại p=T,q=T cho F≠T, sai. (ii) q∨(¬p∧q) rút gọn theo luật hấp thụ thành q, khớp hoàn toàn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the expression $(101101 \\lor 110001) \\oplus 001101$|||Tìm giá trị của biểu thức $(101101 \\lor 110001) \\oplus 001101$",
          "options": [
            {
              "text": "101100|||101100"
            },
            {
              "text": "110000|||110000"
            },
            {
              "text": "001101|||001101"
            },
            {
              "text": "111101|||111101"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$101101 \\lor 110001 = 111101$. Then $111101 \\oplus 001101 = 110000$.</div><div class=\"ml-vi\">$101101 \\lor 110001 = 111101$. Sau đó $111101 \\oplus 001101 = 110000$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a proposition that is logically equivalent to $(p \\to q) \\lor (\\neg p \\to q)$|||Tìm mệnh đề tương đương logic với $(p \\to q) \\lor (\\neg p \\to q)$",
          "options": [
            {
              "text": "q|||q"
            },
            {
              "text": "F|||F"
            },
            {
              "text": "p|||p"
            },
            {
              "text": "T|||T"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Truth table check: at every row of p,q the expression evaluates to T (when p→q is F, ¬p→q is T since p must be T there... actually check all 4 rows: always T) — it is a tautology, equivalent to T.</div><div class=\"ml-vi\">Kiểm bảng chân trị: ở mọi dòng của p,q biểu thức đều cho T — đây là hằng đúng (tautology), tương đương với T.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let C(x) = \"x is a student in your school\", P(x) = \"x plays badminton\", J(x) = \"x knows the computer language Java.\" Domain: all people. Express \"All students at your school either play badminton or know Java, but not both.\" in terms of C(x), P(x), J(x), quantifiers, and logical connectives.|||Cho C(x) = \"x là sinh viên trường bạn\", P(x) = \"x chơi cầu lông\", J(x) = \"x biết ngôn ngữ lập trình Java.\" Miền: mọi người. Biểu diễn \"Mọi sinh viên trường bạn hoặc chơi cầu lông hoặc biết Java, nhưng không cả hai.\" theo C(x), P(x), J(x), lượng từ, và liên từ logic.",
          "options": [
            {
              "text": "$\\forall x(C(x)\\land(P(x)\\lor J(x)))$|||$\\forall x(C(x)\\land(P(x)\\lor J(x)))$"
            },
            {
              "text": "$\\forall x(C(x)\\to(P(x)\\lor J(x)))$|||$\\forall x(C(x)\\to(P(x)\\lor J(x)))$"
            },
            {
              "text": "$\\forall x(C(x)\\to(P(x)\\oplus J(x)))$|||$\\forall x(C(x)\\to(P(x)\\oplus J(x)))$"
            },
            {
              "text": "$\\forall x(C(x)\\land(P(x)\\oplus J(x)))$|||$\\forall x(C(x)\\land(P(x)\\oplus J(x)))$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">\"Either...but not both\" is exclusive or (XOR). The statement only constrains students (via C(x)), so it needs an implication, not a conjunction: $\\forall x(C(x)\\to(P(x)\\oplus J(x)))$.</div><div class=\"ml-vi\">\"Hoặc...nhưng không cả hai\" là XOR. Câu chỉ ràng buộc sinh viên (qua C(x)), nên cần dùng kéo theo, không phải hội: $\\forall x(C(x)\\to(P(x)\\oplus J(x)))$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ = \"x was born in Hanoi\", $Q(x)$ = \"x has visited the Temple of Literature\", domain = all people in Vietnam. Which statement means \"Every people in Hanoi has visited the Temple of Literature\"?|||Cho $P(x)$ = \"x sinh ra ở Hà Nội\", $Q(x)$ = \"x đã đến thăm Văn Miếu\", miền = mọi người ở Việt Nam. Mệnh đề nào có nghĩa \"Mọi người ở Hà Nội đều đã đến thăm Văn Miếu\"?",
          "options": [
            {
              "text": "$\\exists x(P(x)\\land Q(x))$|||$\\exists x(P(x)\\land Q(x))$"
            },
            {
              "text": "$\\forall x(P(x)\\to Q(x))$|||$\\forall x(P(x)\\to Q(x))$"
            },
            {
              "text": "$\\exists x(P(x)\\to Q(x))$|||$\\exists x(P(x)\\to Q(x))$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">\"Every ... has visited\" is a universal implication: for all x, if born in Hanoi then visited the temple.</div><div class=\"ml-vi\">\"Mọi ... đều đã đến thăm\" là kéo theo phổ dụng: với mọi x, nếu sinh ở Hà Nội thì đã đến thăm Văn Miếu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x,y)$ = \"x and y are integer numbers such that $x+2y=5$\". Which of the following propositions is true?|||Cho $P(x,y)$ = \"x và y là số nguyên sao cho $x+2y=5$\". Mệnh đề nào sau đây đúng?",
          "options": [
            {
              "text": "$\\exists y\\, P(2,y)$|||$\\exists y\\, P(2,y)$"
            },
            {
              "text": "$\\forall x\\exists y\\, P(x,y)$|||$\\forall x\\exists y\\, P(x,y)$"
            },
            {
              "text": "$\\forall y\\exists x\\, P(x,y)$|||$\\forall y\\exists x\\, P(x,y)$"
            },
            {
              "text": "$\\forall x\\forall y\\, P(x,y)$|||$\\forall x\\forall y\\, P(x,y)$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\exists y\\,P(2,y)$: needs $y=1.5$, not integer, false. $\\forall x\\exists y\\,P(x,y)$: needs $x$ odd, fails for even $x$. $\\forall y\\exists x\\,P(x,y)$: $x=5-2y$ is always an integer for any integer $y$ — true.</div><div class=\"ml-vi\">$\\exists y\\,P(2,y)$: cần $y=1.5$, không nguyên, sai. $\\forall x\\exists y\\,P(x,y)$: cần $x$ lẻ, sai với $x$ chẵn. $\\forall y\\exists x\\,P(x,y)$: $x=5-2y$ luôn là số nguyên với mọi $y$ nguyên — đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statement is the negation of $\\exists x\\exists y(F(x,y)\\land\\forall zL(y,z))$?|||Mệnh đề nào là phủ định của $\\exists x\\exists y(F(x,y)\\land\\forall zL(y,z))$?",
          "options": [
            {
              "text": "$\\exists x\\exists y(\\neg F(x,y)\\lor\\neg\\forall zL(y,z))$|||$\\exists x\\exists y(\\neg F(x,y)\\lor\\neg\\forall zL(y,z))$"
            },
            {
              "text": "$\\forall x\\forall y(\\neg F(x,y)\\land\\exists z\\neg L(y,z))$|||$\\forall x\\forall y(\\neg F(x,y)\\land\\exists z\\neg L(y,z))$"
            },
            {
              "text": "$\\forall x\\forall y(\\neg F(x,y)\\lor\\exists z\\neg L(y,z))$|||$\\forall x\\forall y(\\neg F(x,y)\\lor\\exists z\\neg L(y,z))$"
            },
            {
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Negating: $\\neg\\exists x\\exists y(F\\land\\forall zL) = \\forall x\\forall y\\neg(F\\land\\forall zL) = \\forall x\\forall y(\\neg F\\lor\\neg\\forall zL) = \\forall x\\forall y(\\neg F(x,y)\\lor\\exists z\\neg L(y,z))$.</div><div class=\"ml-vi\">Phủ định: $\\neg\\exists x\\exists y(F\\land\\forall zL) = \\forall x\\forall y\\neg(F\\land\\forall zL) = \\forall x\\forall y(\\neg F\\lor\\neg\\forall zL) = \\forall x\\forall y(\\neg F(x,y)\\lor\\exists z\\neg L(y,z))$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which arguments are valid? (i) If Andy gets sick, she will not go to class. She didn't go to class yesterday. Therefore, she got sick yesterday. (ii) If Andy gets sick, she will not go to class. She do not get sick today. Therefore, she will go to the class today. (iii) If Andy gets sick, she will not go to class. She went to the class yesterday. Therefore, she did not get sick yesterday.|||Lập luận nào hợp lệ? (i) Nếu Andy bị ốm, cô ấy sẽ không đến lớp. Hôm qua cô ấy không đến lớp. Vậy hôm qua cô ấy bị ốm. (ii) Nếu Andy bị ốm, cô ấy sẽ không đến lớp. Hôm nay cô ấy không bị ốm. Vậy hôm nay cô ấy sẽ đến lớp. (iii) Nếu Andy bị ốm, cô ấy sẽ không đến lớp. Hôm qua cô ấy đã đến lớp. Vậy hôm qua cô ấy không bị ốm.",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Only (iii)|||Chỉ (iii)"
            },
            {
              "text": "None of the other answers are correct|||Không đáp án nào đúng"
            },
            {
              "text": "All of (i), (ii), (iii)|||Cả (i), (ii), (iii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Let $S\\to\\neg G$. (i) affirms $\\neg G$ to conclude $S$ — invalid (converse error). (ii) denies antecedent $\\neg S$ to conclude $G$ — invalid. (iii) has $G$ (i.e. $\\neg\\neg G$) and concludes $\\neg S$ — this is modus tollens on the contrapositive, valid.</div><div class=\"ml-vi\">Đặt $S\\to\\neg G$. (i) khẳng định $\\neg G$ rồi kết luận $S$ — không hợp lệ (lỗi đảo đề). (ii) phủ định tiền đề $\\neg S$ rồi kết luận $G$ — không hợp lệ. (iii) có $G$ (tức $\\neg\\neg G$) và kết luận $\\neg S$ — đây là modus tollens, hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following sets is the power set of $A = \\{\\emptyset, a\\}$?|||Tập nào sau đây là tập lũy thừa của $A = \\{\\emptyset, a\\}$?",
          "options": [
            {
              "text": "$\\{\\emptyset,\\{a\\},\\{\\emptyset,a\\}\\}$|||$\\{\\emptyset,\\{a\\},\\{\\emptyset,a\\}\\}$"
            },
            {
              "text": "$\\{\\emptyset,\\{a\\},\\{\\emptyset\\},\\{a,\\emptyset\\}\\}$|||$\\{\\emptyset,\\{a\\},\\{\\emptyset\\},\\{a,\\emptyset\\}\\}$"
            },
            {
              "text": "$\\{\\emptyset,\\{a\\},\\{\\emptyset\\},\\{a,\\{\\emptyset\\}\\}\\}$|||$\\{\\emptyset,\\{a\\},\\{\\emptyset\\},\\{a,\\{\\emptyset\\}\\}\\}$"
            },
            {
              "text": "$\\{\\emptyset,\\{a,\\emptyset\\}\\}$|||$\\{\\emptyset,\\{a,\\emptyset\\}\\}$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$|A|=2$ so $|P(A)|=4$: $\\{\\emptyset, \\{\\emptyset\\}, \\{a\\}, \\{\\emptyset,a\\}\\}$. Option (ii) lists exactly these 4 elements (order/notation aside). (i) is missing $\\{\\emptyset\\}$; (iii) has the wrong element $\\{a,\\{\\emptyset\\}\\}$; (iv) only has 2 elements.</div><div class=\"ml-vi\">$|A|=2$ nên $|P(A)|=4$: $\\{\\emptyset, \\{\\emptyset\\}, \\{a\\}, \\{\\emptyset,a\\}\\}$. Phương án (ii) liệt kê đúng 4 phần tử này. (i) thiếu $\\{\\emptyset\\}$; (iii) sai vì có $\\{a,\\{\\emptyset\\}\\}$; (iv) chỉ có 2 phần tử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U = \\{a,b,c,d,e,f,g,h,i,j\\}$. The bit string representing the subset $\\{a,c,d,g,h,i\\}$ is ______|||Cho $U = \\{a,b,c,d,e,f,g,h,i,j\\}$. Chuỗi bit biểu diễn tập con $\\{a,c,d,g,h,i\\}$ là ______",
          "options": [
            {
              "text": "10 1110 1110|||10 1110 1110"
            },
            {
              "text": "10 1101 1110|||10 1101 1110"
            },
            {
              "text": "10 1100 1011|||10 1100 1011"
            },
            {
              "text": "10 1100 1110|||10 1100 1110"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Position each element a..j to bit 1 if present: a=1,b=0,c=1,d=1,e=0,f=0,g=1,h=1,i=1,j=0 $\\Rightarrow$ 10 1100 1110.</div><div class=\"ml-vi\">Gán bit 1 cho mỗi phần tử a..j nếu có mặt: a=1,b=0,c=1,d=1,e=0,f=0,g=1,h=1,i=1,j=0 $\\Rightarrow$ 10 1100 1110.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $X=\\{1,2,3,4,5\\}$, $Y=\\{0,3,6,9\\}$. Which of the following sets has the minimal cardinality? (i) $X\\cap Y$ (ii) $X-Y$ (iii) $Y-X$|||Cho $X=\\{1,2,3,4,5\\}$, $Y=\\{0,3,6,9\\}$. Tập nào sau đây có bản số nhỏ nhất? (i) $X\\cap Y$ (ii) $X-Y$ (iii) $Y-X$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$X\\cap Y=\\{3\\}$ (size 1); $X-Y=\\{1,2,4,5\\}$ (size 4); $Y-X=\\{0,6,9\\}$ (size 3). Minimal is (i).</div><div class=\"ml-vi\">$X\\cap Y=\\{3\\}$ (cỡ 1); $X-Y=\\{1,2,4,5\\}$ (cỡ 4); $Y-X=\\{0,6,9\\}$ (cỡ 3). Nhỏ nhất là (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following rules defines a function from the set of real numbers to the set of integers? $f(x)=\\dfrac{1}{\\lfloor x\\rfloor}$, $g(x)=\\lceil x+\\pi\\rceil$, $h(x)=\\sqrt{x^2+1}$|||Quy tắc nào sau đây xác định một hàm từ tập số thực đến tập số nguyên? $f(x)=\\dfrac{1}{\\lfloor x\\rfloor}$, $g(x)=\\lceil x+\\pi\\rceil$, $h(x)=\\sqrt{x^2+1}$",
          "options": [
            {
              "text": "g|||g"
            },
            {
              "text": "f|||f"
            },
            {
              "text": "h|||h"
            },
            {
              "text": "f, g and h|||f, g và h"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f$ is undefined at $0\\le x<1$ (denominator 0) and generally not integer-valued. $h$ is not integer-valued (e.g. $h(1)=\\sqrt2$). $g(x)=\\lceil x+\\pi\\rceil$ is defined everywhere and always an integer — only $g$ qualifies.</div><div class=\"ml-vi\">$f$ không xác định khi $0\\le x<1$ (mẫu bằng 0) và nói chung không cho giá trị nguyên. $h$ không cho giá trị nguyên (vd $h(1)=\\sqrt2$). $g(x)=\\lceil x+\\pi\\rceil$ xác định khắp nơi và luôn là số nguyên — chỉ $g$ thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which proposition is FALSE for any real number x? (i) $\\lfloor\\lceil x\\rceil\\rfloor=\\lceil x\\rceil$ (ii) $\\lceil\\lfloor x\\rfloor\\rceil=\\lfloor x\\rfloor$ (iii) $\\lfloor xy\\rfloor=\\lfloor x\\rfloor\\lfloor y\\rfloor$|||Mệnh đề nào SAI với mọi số thực x? (i) $\\lfloor\\lceil x\\rceil\\rfloor=\\lceil x\\rceil$ (ii) $\\lceil\\lfloor x\\rfloor\\rceil=\\lfloor x\\rfloor$ (iii) $\\lfloor xy\\rfloor=\\lfloor x\\rfloor\\lfloor y\\rfloor$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i),(ii) always hold since ceiling/floor of an integer is itself. (iii) fails, e.g. $x=y=1.5$: $\\lfloor xy\\rfloor=\\lfloor2.25\\rfloor=2$ but $\\lfloor x\\rfloor\\lfloor y\\rfloor=1\\cdot1=1$.</div><div class=\"ml-vi\">(i),(ii) luôn đúng vì trần/sàn của số nguyên là chính nó. (iii) sai, vd $x=y=1.5$: $\\lfloor xy\\rfloor=\\lfloor2.25\\rfloor=2$ nhưng $\\lfloor x\\rfloor\\lfloor y\\rfloor=1\\cdot1=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "List the first 5 terms of the sequence whose $n^{th}$ term is $2^n-n!$ for $n=0,1,2,\\dots$|||Liệt kê 5 số hạng đầu của dãy có số hạng thứ $n$ là $2^n-n!$ với $n=0,1,2,\\dots$",
          "options": [
            {
              "text": "0, 1, 2, 2, -18|||0, 1, 2, 2, -18"
            },
            {
              "text": "0, 1, 2, 3, -8|||0, 1, 2, 3, -8"
            },
            {
              "text": "1, 1, 2, 2, -8|||1, 1, 2, 2, -8"
            },
            {
              "text": "0, 1, 2, 2, -8|||0, 1, 2, 2, -8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$n=0$: $1-1=0$. $n=1$: $2-1=1$. $n=2$: $4-2=2$. $n=3$: $8-6=2$. $n=4$: $16-24=-8$.</div><div class=\"ml-vi\">$n=0$: $1-1=0$. $n=1$: $2-1=1$. $n=2$: $4-2=2$. $n=3$: $8-6=2$. $n=4$: $16-24=-8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following procedures is algorithm? procedure TT1(n:integer) x:=0, while n>0 do (n:=n+1, x:=nx). procedure TT2(n:integer) x:=0, while n>0 do (n:=n-1, x:=x/n). procedure TT3(n:integer) x:=0, while n>0 do (x:=nx, n:=n+1). procedure TT4(n:integer) x:=0, while n>0 do (x:=x/n, n:=n-1).|||Thủ tục nào sau đây là thuật toán? procedure TT1(n:integer) x:=0, while n>0 do (n:=n+1, x:=nx). procedure TT2(n:integer) x:=0, while n>0 do (n:=n-1, x:=x/n). procedure TT3(n:integer) x:=0, while n>0 do (x:=nx, n:=n+1). procedure TT4(n:integer) x:=0, while n>0 do (x:=x/n, n:=n-1).",
          "options": [
            {
              "text": "TT1|||TT1"
            },
            {
              "text": "TT4|||TT4"
            },
            {
              "text": "TT2|||TT2"
            },
            {
              "text": "TT3|||TT3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">TT1, TT3 increase n each iteration -> never terminate if n>0. TT2 decrements n before dividing: when n=1 it becomes 0 then computes x/0 (division by zero, not well-defined). TT4 divides by n THEN decrements, so it always divides by the still-positive n and terminates cleanly at n=0 — valid algorithm.</div><div class=\"ml-vi\">TT1, TT3 tăng n mỗi vòng -> không bao giờ dừng nếu n>0. TT2 giảm n trước rồi mới chia: khi n=1 nó thành 0 rồi tính x/0 (chia cho 0, không xác định). TT4 chia cho n TRƯỚC rồi mới giảm, nên luôn chia cho n còn dương và dừng gọn ở n=0 — là thuật toán hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Insertion sort algorithm (standard pseudocode with outer loop i=2 to n). If input = 7, 2, 4, 3, 1, 6, 5, after running the outer loop with i = 4, the order of the elements in the list is ______|||Cho thuật toán Insertion sort (giả mã chuẩn, vòng ngoài i=2 đến n). Nếu đầu vào = 7, 2, 4, 3, 1, 6, 5, sau khi chạy vòng ngoài với i = 4, thứ tự các phần tử trong danh sách là ______",
          "options": [
            {
              "text": "2, 3, 4, 7, 1, 6, 5|||2, 3, 4, 7, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 3, 1, 6, 5|||2, 4, 7, 3, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 1, 3, 6, 5|||2, 4, 7, 1, 3, 6, 5"
            },
            {
              "text": "1, 2, 3, 4, 7, 6, 5|||1, 2, 3, 4, 7, 6, 5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">i=2: insert 2 before 7 -> [2,7,4,3,1,6,5]. i=3: insert 4 between 2,7 -> [2,4,7,3,1,6,5]. i=4: insert 3 between 2,4 -> [2,3,4,7,1,6,5].</div><div class=\"ml-vi\">i=2: chèn 2 trước 7 -> [2,7,4,3,1,6,5]. i=3: chèn 4 giữa 2,7 -> [2,4,7,3,1,6,5]. i=4: chèn 3 giữa 2,4 -> [2,3,4,7,1,6,5].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)$ is $O(\\log n)$, $g(n)$ is $O(1)$ and $h(n)$ is $O(n)$. Find the best big-O estimate of $(f(n))^3+(g(n)+2)\\cdot h(n)$|||Giả sử $f(n)$ là $O(\\log n)$, $g(n)$ là $O(1)$ và $h(n)$ là $O(n)$. Tìm ước lượng big-O tốt nhất của $(f(n))^3+(g(n)+2)\\cdot h(n)$",
          "options": [
            {
              "text": "$O(\\log n)$|||$O(\\log n)$"
            },
            {
              "text": "$O(n)$|||$O(n)$"
            },
            {
              "text": "$O(n\\log n)$|||$O(n\\log n)$"
            },
            {
              "text": "$O(n^2)$|||$O(n^2)$"
            },
            {
              "text": "$O(n^2\\log n)$|||$O(n^2\\log n)$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$(f(n))^3=O(\\log^3 n)$ and $(g(n)+2)h(n)=O(1)\\cdot O(n)=O(n)$. Since $n$ dominates $\\log^3 n$ asymptotically, the sum is $O(n)$.</div><div class=\"ml-vi\">$(f(n))^3=O(\\log^3 n)$ và $(g(n)+2)h(n)=O(1)\\cdot O(n)=O(n)$. Vì $n$ trội hơn $\\log^3 n$ khi $n$ lớn, tổng là $O(n)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the largest n for which one can solve within one second using an algorithm that requires $f(n)=2^{n^2}$ bit operations, where each bit operation is carried out in $10^{-12}$ seconds?|||n lớn nhất để có thể giải trong một giây bằng thuật toán cần $f(n)=2^{n^2}$ phép toán bit, mỗi phép toán bit mất $10^{-12}$ giây là bao nhiêu?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "39|||39"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Need $2^{n^2}\\cdot10^{-12}\\le1 \\Rightarrow n^2\\le\\log_2(10^{12})\\approx39.86 \\Rightarrow n\\le6.31$. Largest integer $n=6$ (check: $n=7$ gives $2^{49}\\cdot10^{-12}\\approx563$s, too slow).</div><div class=\"ml-vi\">Cần $2^{n^2}\\cdot10^{-12}\\le1 \\Rightarrow n^2\\le\\log_2(10^{12})\\approx39.86 \\Rightarrow n\\le6.31$. Số nguyên lớn nhất $n=6$ (kiểm: $n=7$ cho $2^{49}\\cdot10^{-12}\\approx563$s, quá chậm).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sequence of pseudorandom numbers is generated as follows: $x_0=3$, $x_n=5x_{n-1}+4 \\bmod 7$ for $n>0$. Find $x_4$.|||Một dãy số giả ngẫu nhiên được sinh: $x_0=3$, $x_n=5x_{n-1}+4 \\bmod 7$ với $n>0$. Tìm $x_4$.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$x_1=(15+4)\\bmod7=19\\bmod7=5$. $x_2=(25+4)\\bmod7=29\\bmod7=1$. $x_3=(5+4)\\bmod7=9\\bmod7=2$. $x_4=(10+4)\\bmod7=14\\bmod7=0$.</div><div class=\"ml-vi\">$x_1=(15+4)\\bmod7=19\\bmod7=5$. $x_2=(25+4)\\bmod7=29\\bmod7=1$. $x_3=(5+4)\\bmod7=9\\bmod7=2$. $x_4=(10+4)\\bmod7=14\\bmod7=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sequence of pseudo-random numbers are generated using the Linear congruential method: $x_0=1$, $x_{n+1}=(3x_n+4)\\bmod7$. Find $x_3$.|||Một dãy số giả ngẫu nhiên được sinh bằng phương pháp đồng dư tuyến tính: $x_0=1$, $x_{n+1}=(3x_n+4)\\bmod7$. Tìm $x_3$.",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$x_1=(3+4)\\bmod7=0$. $x_2=(0+4)\\bmod7=4$. $x_3=(12+4)\\bmod7=16\\bmod7=2$.</div><div class=\"ml-vi\">$x_1=(3+4)\\bmod7=0$. $x_2=(0+4)\\bmod7=4$. $x_3=(12+4)\\bmod7=16\\bmod7=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The prime factorization of 1025 is $p^2q$. Find $q-p$.|||Phân tích thừa số nguyên tố của 1025 là $p^2q$. Tìm $q-p$.",
          "options": [
            {
              "text": "36|||36"
            },
            {
              "text": "46|||46"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "66|||66"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$1025=5^2\\cdot41$, so $p=5,q=41$, $q-p=36$.</div><div class=\"ml-vi\">$1025=5^2\\cdot41$, nên $p=5,q=41$, $q-p=36$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the greatest common divisor of $2^3\\cdot3^2\\cdot5\\cdot7$ and $2^4\\cdot5^2\\cdot11^3$|||Tìm ước chung lớn nhất của $2^3\\cdot3^2\\cdot5\\cdot7$ và $2^4\\cdot5^2\\cdot11^3$",
          "options": [
            {
              "text": "2310|||2310"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "360|||360"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Take min exponent per prime: $2^{\\min(3,4)}\\cdot3^{\\min(2,0)}\\cdot5^{\\min(1,2)}\\cdot7^{\\min(1,0)}\\cdot11^{\\min(0,3)}=2^3\\cdot5=40$.</div><div class=\"ml-vi\">Lấy số mũ nhỏ nhất mỗi số nguyên tố: $2^{\\min(3,4)}\\cdot3^{\\min(2,0)}\\cdot5^{\\min(1,2)}\\cdot7^{\\min(1,0)}\\cdot11^{\\min(0,3)}=2^3\\cdot5=40$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert $(2BE0)_{16}$ into binary expansion. (i) $(0011101111100000)_2$ (ii) $(0010101011100000)_2$ (iii) $(0010101111110000)_2$|||Chuyển $(2BE0)_{16}$ sang khai triển nhị phân. (i) $(0011101111100000)_2$ (ii) $(0010101011100000)_2$ (iii) $(0010101111110000)_2$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Substitute each hex digit by 4 bits: $2{=}0010, B{=}1011, E{=}1110, 0{=}0000 \\Rightarrow 0010101111100000$. This matches none of (i) 3BE0, (ii) 2AE0, (iii) 2BF0 — all are near-miss decoys.</div><div class=\"ml-vi\">Thay mỗi chữ số hex bằng 4 bit: $2{=}0010, B{=}1011, E{=}1110, 0{=}0000 \\Rightarrow 0010101111100000$. Kết quả này không khớp với (i) 3BE0, (ii) 2AE0, (iii) 2BF0 — đều là phương án gây nhiễu gần giống.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find gcd(899, 941).|||Tìm gcd(899, 941).",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "29|||29"
            },
            {
              "text": "31|||31"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$899=29\\cdot31$ and 941 is prime (not divisible by any prime $\\le\\sqrt{941}\\approx30.7$), so $\\gcd(899,941)=1$, which matches none of A-D.</div><div class=\"ml-vi\">$899=29\\cdot31$ và 941 là số nguyên tố (không chia hết cho số nguyên tố nào $\\le\\sqrt{941}\\approx30.7$), nên $\\gcd(899,941)=1$, không khớp phương án A-D nào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A formula for the sum of the first n even positive integers is ______ (i) $n(n+1)$ (ii) $(n+1)^2$ (iii) $(n-1)^2$ (iv) $2n^2$|||Công thức tổng n số nguyên dương chẵn đầu tiên là ______ (i) $n(n+1)$ (ii) $(n+1)^2$ (iii) $(n-1)^2$ (iv) $2n^2$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$2+4+\\dots+2n=2(1+2+\\dots+n)=2\\cdot\\frac{n(n+1)}{2}=n(n+1)$.</div><div class=\"ml-vi\">$2+4+\\dots+2n=2(1+2+\\dots+n)=2\\cdot\\frac{n(n+1)}{2}=n(n+1)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f$ is defined recursively by $f(0)=2$ and $f(n+1)=f(n)^2+2f(n)-3$ for $n\\ge0$. Find $f(3)$.|||Giả sử $f$ được định nghĩa đệ quy bởi $f(0)=2$ và $f(n+1)=f(n)^2+2f(n)-3$ với $n\\ge0$. Tìm $f(3)$.",
          "options": [
            {
              "text": "32|||32"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "1085|||1085"
            },
            {
              "text": "93|||93"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=4+4-3=5$. $f(2)=25+10-3=32$. $f(3)=32^2+2\\cdot32-3=1024+64-3=1085$.</div><div class=\"ml-vi\">$f(1)=4+4-3=5$. $f(2)=25+10-3=32$. $f(3)=32^2+2\\cdot32-3=1024+64-3=1085$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the subset of ordered pairs of integers defined recursively: Basis step $(0,0)\\in S$. Recursive step: if $(a,b)\\in S$ then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is in S?|||Cho S là tập con các cặp số nguyên được định nghĩa đệ quy: Bước cơ sở $(0,0)\\in S$. Bước đệ quy: nếu $(a,b)\\in S$ thì $(a+2,b+3)\\in S$ và $(a+3,b+2)\\in S$. Phần tử nào thuộc S?",
          "options": [
            {
              "text": "(7, 8)|||(7, 8)"
            },
            {
              "text": "(6, 7)|||(6, 7)"
            },
            {
              "text": "(8, 9)|||(8, 9)"
            },
            {
              "text": "(5, 10)|||(5, 10)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Any $(a,b)\\in S$ has $a=2x+3y,b=3x+2y$ for nonneg integers $x,y$. For (7,8): solving gives $x=2,y=1$ (valid). (6,7) and (8,9) fail the invariant $a+b\\equiv0\\pmod5$; (5,10) needs $y=-1$ (invalid).</div><div class=\"ml-vi\">Mọi $(a,b)\\in S$ có dạng $a=2x+3y,b=3x+2y$ với $x,y$ nguyên không âm. Với (7,8): giải ra $x=2,y=1$ (hợp lệ). (6,7) và (8,9) vi phạm bất biến $a+b\\equiv0\\pmod5$; (5,10) cần $y=-1$ (không hợp lệ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: procedure T(n:integer): if n<3 then return 3; else if (n mod 2=0) then return n; else return 3*T(n-1)-2. Find output if n=9.|||Cho thuật toán đệ quy: procedure T(n:integer): if n<3 then return 3; else if (n mod 2=0) then return n; else return 3*T(n-1)-2. Tìm kết quả nếu n=9.",
          "options": [
            {
              "text": "22|||22"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "27|||27"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$T(9)=3\\cdot T(8)-2$. $T(8)=8$ (even, $\\ge3$). $T(9)=3\\cdot8-2=22$.</div><div class=\"ml-vi\">$T(9)=3\\cdot T(8)-2$. $T(8)=8$ (chẵn, $\\ge3$). $T(9)=3\\cdot8-2=22$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the recursive algorithm if input n = 5. procedure TT(n:integer); if n=1 then f(1):=4 else f(n):=f(n-1)*n;|||Tìm kết quả của thuật toán đệ quy nếu đầu vào n = 5. procedure TT(n:integer); if n=1 then f(1):=4 else f(n):=f(n-1)*n;",
          "options": [
            {
              "text": "120|||120"
            },
            {
              "text": "240|||240"
            },
            {
              "text": "360|||360"
            },
            {
              "text": "480|||480"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=4,f(2)=8,f(3)=24,f(4)=96,f(5)=480$.</div><div class=\"ml-vi\">$f(1)=4,f(2)=8,f(3)=24,f(4)=96,f(5)=480$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many one-to-one functions from a set of 5 elements to a set of 4 elements?|||Có bao nhiêu hàm đơn ánh từ tập 5 phần tử đến tập 4 phần tử?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An injective function requires domain size $\\le$ codomain size. Since $5>4$, no injective function exists — 0.</div><div class=\"ml-vi\">Hàm đơn ánh yêu cầu kích thước miền xác định $\\le$ miền giá trị. Vì $5>4$, không có hàm đơn ánh nào — bằng 0.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers not exceeding 200 and divisible by 5 or 7?|||Có bao nhiêu số nguyên dương không vượt quá 200 chia hết cho 5 hoặc 7?",
          "options": [
            {
              "text": "65|||65"
            },
            {
              "text": "64|||64"
            },
            {
              "text": "66|||66"
            },
            {
              "text": "63|||63"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">By inclusion-exclusion: $\\lfloor200/5\\rfloor+\\lfloor200/7\\rfloor-\\lfloor200/35\\rfloor=40+28-5=63$.</div><div class=\"ml-vi\">Theo bao hàm-loại trừ: $\\lfloor200/5\\rfloor+\\lfloor200/7\\rfloor-\\lfloor200/35\\rfloor=40+28-5=63$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that a person deposits \\$16,000 in a savings account at a bank yielding 12% per year with interest compounded annually. How much will be in the account after 20 years? Round to the nearest dollar.|||Giả sử một người gửi \\$16,000 vào tài khoản tiết kiệm với lãi suất 12%/năm, lãi kép hàng năm. Sau 20 năm tài khoản có bao nhiêu? Làm tròn đến đô-la gần nhất.",
          "options": [
            {
              "text": "\\$154,341|||\\$154,341"
            },
            {
              "text": "\\$160,001|||\\$160,001"
            },
            {
              "text": "\\$179,200|||\\$179,200"
            },
            {
              "text": "\\$192,000|||\\$192,000"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$A=16000\\times(1.12)^{20}\\approx16000\\times9.6463\\approx154{,}341$.</div><div class=\"ml-vi\">$A=16000\\times(1.12)^{20}\\approx16000\\times9.6463\\approx154{,}341$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What of the following is a form of a divide-and-conquer recurrence relation? (i) $f(n)=2f(n-1)+1$ (ii) $f(n)=f(n-1)+n$ (iii) $f(n)=f(n-1)+f(n-2)$ (iv) $f(n)=af(n/b)+g(n)$|||Dạng nào sau đây là hệ thức truy hồi chia-để-trị? (i) $f(n)=2f(n-1)+1$ (ii) $f(n)=f(n-1)+n$ (iii) $f(n)=f(n-1)+f(n-2)$ (iv) $f(n)=af(n/b)+g(n)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Divide-and-conquer recurrences split the problem into subproblems of size $n/b$: $f(n)=af(n/b)+g(n)$.</div><div class=\"ml-vi\">Hệ thức chia-để-trị chia bài toán thành các bài toán con kích thước $n/b$: $f(n)=af(n/b)+g(n)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Does there exist a simple graph with 5 vertices whose degrees are (i) 3,3,3,3,2 (ii) 1,2,3,4,4?|||Có tồn tại đồ thị đơn 5 đỉnh với dãy bậc (i) 3,3,3,3,2 (ii) 1,2,3,4,4 hay không?",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By the Erdős–Gallai theorem, (i) 3,3,3,3,2 satisfies all conditions (graphical). (ii) 4,4,3,2,1 fails at $k=2$: $4+4=8 > 2\\cdot1+\\min(3,2)+\\min(2,2)+\\min(1,2)=2+2+2+1=7$ — not graphical.</div><div class=\"ml-vi\">Theo định lý Erdős–Gallai, (i) 3,3,3,3,2 thỏa mọi điều kiện (là dãy bậc đồ thị). (ii) 4,4,3,2,1 vi phạm tại $k=2$: $4+4=8 > 2\\cdot1+\\min(3,2)+\\min(2,2)+\\min(1,2)=2+2+2+1=7$ — không phải dãy bậc đồ thị.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many rows are there in the adjacency matrix of $W_5$?|||Ma trận kề của $W_5$ có bao nhiêu hàng?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The wheel graph $W_5$ has 5 outer (cycle) vertices plus 1 hub = 6 vertices, so its adjacency matrix is $6\\times6$.</div><div class=\"ml-vi\">Đồ thị bánh xe $W_5$ có 5 đỉnh vòng ngoài cộng 1 đỉnh trung tâm = 6 đỉnh, nên ma trận kề là $6\\times6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be an undirected graph of four vertices A,B,C,D with the incidence matrix $\\begin{pmatrix}1&0&1&1&0&0&0\\\\1&1&1&0&0&1&0\\\\0&1&0&1&0&0&1\\\\0&0&0&0&1&0&1\\end{pmatrix}$ (rows A,B,C,D). Which of the following statements is true?|||Cho G là đồ thị vô hướng 4 đỉnh A,B,C,D với ma trận liên thuộc $\\begin{pmatrix}1&0&1&1&0&0&0\\\\1&1&1&0&0&1&0\\\\0&1&0&1&0&0&1\\\\0&0&0&0&1&0&1\\end{pmatrix}$ (hàng A,B,C,D). Phát biểu nào sau đây đúng?",
          "options": [
            {
              "text": "G is a simple graph.|||G là đồ thị đơn."
            },
            {
              "text": "G is a multigraph.|||G là đa đồ thị."
            },
            {
              "text": "G has no multiple edges.|||G không có cạnh bội."
            },
            {
              "text": "G has loops.|||G có khuyên."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Column 5 has a single 1 in row D and column 6 has a single 1 in row B — each represents a loop (an edge with only one incident vertex). So G has loops (columns 1 and 3 also duplicate edge A-B, but the loop property is the unambiguous true statement).</div><div class=\"ml-vi\">Cột 5 chỉ có một số 1 ở hàng D và cột 6 chỉ có một số 1 ở hàng B — mỗi cột đó biểu diễn một khuyên (cạnh chỉ liên thuộc một đỉnh). Vậy G có khuyên (cột 1 và 3 cũng lặp lại cạnh A-B, nhưng tính chất có khuyên là phát biểu đúng rõ ràng nhất).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be an undirected graph with 3 vertices A,B,C and the incident matrix (in that order of vertices) $\\begin{pmatrix}1&1&1&1\\\\1&1&1&0\\\\0&0&0&1\\end{pmatrix}$. How many paths of length 2 from B to C?|||Cho G là đồ thị vô hướng 3 đỉnh A,B,C với ma trận liên thuộc (theo thứ tự đỉnh đó) $\\begin{pmatrix}1&1&1&1\\\\1&1&1&0\\\\0&0&0&1\\end{pmatrix}$. Có bao nhiêu đường đi độ dài 2 từ B đến C?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Columns 1-3 are all edge A-B (3 parallel edges), column 4 is edge A-C. Every length-2 walk B to C must go through A: $3\\times1=3$ walks.</div><div class=\"ml-vi\">Cột 1-3 đều là cạnh A-B (3 cạnh song song), cột 4 là cạnh A-C. Mọi đường đi độ dài 2 từ B đến C phải qua A: $3\\times1=3$ đường.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be an undirected graph with 3 vertices A,B,C. Assume that the adjacency matrix of G (in that order of vertices) is $\\begin{pmatrix}1&2&0\\\\2&0&2\\\\0&2&2\\end{pmatrix}$. How many paths of length 3 from B to C?|||Cho G là đồ thị vô hướng 3 đỉnh A,B,C. Giả sử ma trận kề của G (theo thứ tự đỉnh đó) là $\\begin{pmatrix}1&2&0\\\\2&0&2\\\\0&2&2\\end{pmatrix}$. Có bao nhiêu đường đi độ dài 3 từ B đến C?",
          "options": [
            {
              "text": "24|||24"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Compute $M^3_{B,C}$: $M^2=\\begin{pmatrix}5&2&4\\\\2&8&4\\\\4&4&8\\end{pmatrix}$, then $M^3_{B,C}=M^2_{B,A}M_{A,C}+M^2_{B,B}M_{B,C}+M^2_{B,C}M_{C,C}=2\\cdot0+8\\cdot2+4\\cdot2=24$.</div><div class=\"ml-vi\">Tính $M^3_{B,C}$: $M^2=\\begin{pmatrix}5&2&4\\\\2&8&4\\\\4&4&8\\end{pmatrix}$, rồi $M^3_{B,C}=M^2_{B,A}M_{A,C}+M^2_{B,B}M_{B,C}+M^2_{B,C}M_{C,C}=2\\cdot0+8\\cdot2+4\\cdot2=24$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For which values of n does the graph $K_n$ have NO Euler circuits?|||Với giá trị n nào thì đồ thị $K_n$ KHÔNG có chu trình Euler?",
          "options": [
            {
              "text": "Any n>2|||Với mọi n>2"
            },
            {
              "text": "n is odd|||n lẻ"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "n is even|||n chẵn"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Every vertex of $K_n$ has degree $n-1$. An Euler circuit requires all degrees even, so $n-1$ even $\\Rightarrow n$ odd has an Euler circuit; when $n$ is even, $n-1$ is odd, so no Euler circuit exists.</div><div class=\"ml-vi\">Mọi đỉnh của $K_n$ có bậc $n-1$. Chu trình Euler cần mọi bậc chẵn, nên $n-1$ chẵn $\\Rightarrow n$ lẻ thì có chu trình Euler; khi $n$ chẵn, $n-1$ lẻ, nên không có chu trình Euler.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many distinct Hamilton circuits does the complete graph $K_4$ have? (Circuits related by rotation or reversal count as the same.)|||Đồ thị đầy đủ $K_4$ có bao nhiêu chu trình Hamilton phân biệt? (Chu trình lệch nhau do xoay vòng hoặc đảo chiều tính là giống nhau.)",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Number of distinct Hamilton circuits in $K_n$ up to rotation/reversal is $(n-1)!/2$. For $n=4$: $3!/2=3$.</div><div class=\"ml-vi\">Số chu trình Hamilton phân biệt trong $K_n$ (tính theo xoay/đảo chiều) là $(n-1)!/2$. Với $n=4$: $3!/2=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the length of the shortest path from A to B in the given weighted graph (nodes A, T1, T2, B, M, D1, D2; edges A-T1=4, A-D1=5, T1-T2=5, T2-B=6, T1-D1=2, A-T2=8, T2-M=3, M-D2=1, M-B=2, D1-D2=6, D2-B=4).|||Tìm độ dài đường đi ngắn nhất từ A đến B trong đồ thị có trọng số cho trước (đỉnh A, T1, T2, B, M, D1, D2; cạnh A-T1=4, A-D1=5, T1-T2=5, T2-B=6, T1-D1=2, A-T2=8, T2-M=3, M-D2=1, M-B=2, D1-D2=6, D2-B=4).",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Dijkstra from A gives dist(T2)=8 (direct edge), dist(M)=8+3=11, dist(B)=min(8+6, 11+2)=13 via A-T2-M-B (8+3+2=13).</div><div class=\"ml-vi\">Chạy Dijkstra từ A: dist(T2)=8 (cạnh trực tiếp), dist(M)=8+3=11, dist(B)=min(8+6, 11+2)=13 qua đường A-T2-M-B (8+3+2=13).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many vertices in a full 3-ary tree with 101 leaves?|||Một cây tam phân đầy đủ có 101 lá thì có bao nhiêu đỉnh?",
          "options": [
            {
              "text": "304|||304"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "200|||200"
            },
            {
              "text": "151|||151"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For a full $m$-ary tree with $i$ internal vertices, leaves $l=(m-1)i+1$. Here $101=2i+1\\Rightarrow i=50$. Total vertices $=i+l=50+101=151$.</div><div class=\"ml-vi\">Với cây $m$-phân đầy đủ có $i$ đỉnh trong, số lá $l=(m-1)i+1$. Ở đây $101=2i+1\\Rightarrow i=50$. Tổng số đỉnh $=i+l=50+101=151$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many leaves in a full binary tree with 61 vertices?|||Cây nhị phân đầy đủ có 61 đỉnh thì có bao nhiêu lá?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "31|||31"
            },
            {
              "text": "61|||61"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "60|||60"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For a full binary tree, $n=2i+1$ where $i$ is the number of internal vertices, leaves $l=i+1$. $61=2i+1\\Rightarrow i=30$, so $l=31$.</div><div class=\"ml-vi\">Với cây nhị phân đầy đủ, $n=2i+1$ với $i$ là số đỉnh trong, số lá $l=i+1$. $61=2i+1\\Rightarrow i=30$, nên $l=31$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the length of the bit string when encoding the following message by a Huffman coding: \"abbbbcccddcba\"|||Tìm độ dài chuỗi bit khi mã hoá thông điệp sau bằng mã Huffman: \"abbbbcccddcba\"",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Frequencies: a=2,b=5,c=4,d=2 (total 13). Huffman merges: (a+d)=4, then (4+c)=8, then (8+b)=13. Resulting code lengths: b=1,c=2,a=3,d=3. Total bits $=5\\cdot1+4\\cdot2+2\\cdot3+2\\cdot3=5+8+6+6=25$.</div><div class=\"ml-vi\">Tần suất: a=2,b=5,c=4,d=2 (tổng 13). Huffman gộp: (a+d)=4, rồi (4+c)=8, rồi (8+b)=13. Độ dài mã: b=1,c=2,a=3,d=3. Tổng bit $=5\\cdot1+4\\cdot2+2\\cdot3+2\\cdot3=5+8+6+6=25$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed to search for the word \"CONCH\" in the binary search tree built (in insertion order) for the list {SHE, SELLS, SEA, SHELLS, BY, THE, SEASHORE}?|||Cần bao nhiêu phép so sánh để tìm từ \"CONCH\" trong cây tìm kiếm nhị phân được xây (theo thứ tự chèn) từ danh sách {SHE, SELLS, SEA, SHELLS, BY, THE, SEASHORE}?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Tree: SHE(root) -L-> SELLS -L-> SEA -L-> BY, -R-> SEASHORE; SHE -R-> SHELLS -R-> THE. Searching CONCH: vs SHE (left, C<S), vs SELLS (left), vs SEA (left), vs BY (right, C>B) — BY has no right child, not found after 4 comparisons.</div><div class=\"ml-vi\">Cây: SHE(gốc) -Trái-> SELLS -Trái-> SEA -Trái-> BY, -Phải-> SEASHORE; SHE -Phải-> SHELLS -Phải-> THE. Tìm CONCH: so với SHE (trái, C<S), so với SELLS (trái), so với SEA (trái), so với BY (phải, C>B) — BY không có con phải, không tìm thấy sau 4 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the postfix notation for the expression $(x-y)^2+x(y+5)$|||Tìm ký hiệu hậu tố (postfix) cho biểu thức $(x-y)^2+x(y+5)$",
          "options": [
            {
              "text": "x y - 2 \\uparrow x y 5 + * +|||x y - 2 \\uparrow x y 5 + * +"
            },
            {
              "text": "+ \\uparrow - x y 2 * x + 5 y|||+ \\uparrow - x y 2 * x + 5 y"
            },
            {
              "text": "x - y \\uparrow 2 + x * y + 5|||x - y \\uparrow 2 + x * y + 5"
            },
            {
              "text": "+ \\uparrow - x y 2 + x + y 5|||+ \\uparrow - x y 2 + x + y 5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(x-y)\\to$ \"x y -\"; $(x-y)^2\\to$ \"x y - 2 $\\uparrow$\"; $(y+5)\\to$ \"y 5 +\"; $x(y+5)\\to$ \"x y 5 + *\"; sum $\\to$ \"x y - 2 $\\uparrow$ x y 5 + * +\".</div><div class=\"ml-vi\">$(x-y)\\to$ \"x y -\"; $(x-y)^2\\to$ \"x y - 2 $\\uparrow$\"; $(y+5)\\to$ \"y 5 +\"; $x(y+5)\\to$ \"x y 5 + *\"; tổng $\\to$ \"x y - 2 $\\uparrow$ x y 5 + * +\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the prefix form of the expression $((x+y)^3)-2$|||Tìm dạng tiền tố (prefix) của biểu thức $((x+y)^3)-2$",
          "options": [
            {
              "text": "- + \\uparrow x y 2 3|||- + \\uparrow x y 2 3"
            },
            {
              "text": "- x + y \\uparrow 2 3|||- x + y \\uparrow 2 3"
            },
            {
              "text": "- \\uparrow + x y 3 2|||- \\uparrow + x y 3 2"
            },
            {
              "text": "- x y + 2 \\uparrow 3|||- x y + 2 \\uparrow 3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(x+y)\\to$ \"+ x y\"; $(x+y)^3\\to$ \"$\\uparrow$ + x y 3\"; subtract 2 $\\to$ \"- $\\uparrow$ + x y 3 2\".</div><div class=\"ml-vi\">$(x+y)\\to$ \"+ x y\"; $(x+y)^3\\to$ \"$\\uparrow$ + x y 3\"; trừ 2 $\\to$ \"- $\\uparrow$ + x y 3 2\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many different spanning trees does $K_{2,2}$ have?|||Đồ thị $K_{2,2}$ có bao nhiêu cây khung khác nhau?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$K_{2,2}$ is the 4-cycle. By the formula for complete bipartite graphs, the number of spanning trees is $m^{n-1}n^{m-1}=2^1\\cdot2^1=4$ (equivalently: removing any 1 of its 4 edges gives a spanning tree).</div><div class=\"ml-vi\">$K_{2,2}$ chính là chu trình 4 đỉnh. Theo công thức đồ thị lưỡng phân đầy đủ, số cây khung là $m^{n-1}n^{m-1}=2^1\\cdot2^1=4$ (tương đương: bỏ bất kỳ 1 trong 4 cạnh sẽ được một cây khung).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If we use Prim's algorithm (starting at vertex a) to find a minimum spanning tree of the weighted graph (3x3 grid a,b,c/d,e,f/g,h,i; outer edges ab=5,bc=4,cf=3,fi=4,hi=2,gh=4,dg=6,ad=2; center-cross be=5,eh=3,de=7,ef=1; diamond diagonals bd=3,bf=6,dh=8,fh=4), what is the fourth edge added? (edges written in alphabetical order, ties broken in reverse dictionary order)|||Nếu dùng thuật toán Prim (bắt đầu từ đỉnh a) để tìm cây khung nhỏ nhất của đồ thị có trọng số (lưới 3x3 a,b,c/d,e,f/g,h,i; cạnh ngoài ab=5,bc=4,cf=3,fi=4,hi=2,gh=4,dg=6,ad=2; chữ thập qua tâm be=5,eh=3,de=7,ef=1; đường chéo hình thoi bd=3,bf=6,dh=8,fh=4), cạnh thứ TƯ được thêm vào là gì? (cạnh viết theo thứ tự alphabet, hoà thì chọn theo thứ tự từ điển ngược)",
          "options": [
            {
              "text": "cf|||cf"
            },
            {
              "text": "bd|||bd"
            },
            {
              "text": "gh|||gh"
            },
            {
              "text": "ab|||ab"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Prim from a: edge1=ad(2). Frontier {ab=5,bd=3,dg=6,de=7,dh=8}: min=bd(3), edge2=bd. Frontier now has bc=4 as min: edge3=bc. Frontier now has cf=3 as min (unique): edge4=cf.</div><div class=\"ml-vi\">Prim từ a: cạnh1=ad(2). Biên {ab=5,bd=3,dg=6,de=7,dh=8}: nhỏ nhất=bd(3), cạnh2=bd. Biên lúc này có bc=4 nhỏ nhất: cạnh3=bc. Biên lúc này có cf=3 nhỏ nhất (duy nhất): cạnh4=cf.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D2",
      "source": "REAL",
      "sortOrder": 202,
      "title": "Final Exam — Đề 2|||Thi cuối kỳ — Đề 2",
      "description": "MAD101 Final Exam, Đề 2 (50 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 2 (50 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 100,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ = \"x has a computer\", $Q(x)$ = \"x can connect to the Internet\", where x represents a student in your school. Translate into a logical expression: \"No student at your school has a computer but can not connect to the Internet.\"|||Cho $P(x)$ = \"x có máy tính\", $Q(x)$ = \"x có thể kết nối Internet\", trong đó x đại diện cho một sinh viên trong trường. Dịch câu sau thành biểu thức logic: \"Không có sinh viên nào trong trường bạn có máy tính nhưng lại không thể kết nối Internet.\"",
          "options": [
            {
              "text": "$\\exists x(P(x)\\land\\neg Q(x))$|||$\\exists x(P(x)\\land\\neg Q(x))$"
            },
            {
              "text": "$\\forall x(P(x)\\lor\\neg Q(x))$|||$\\forall x(P(x)\\lor\\neg Q(x))$"
            },
            {
              "text": "$\\forall x(P(x)\\land\\neg Q(x))$|||$\\forall x(P(x)\\land\\neg Q(x))$"
            },
            {
              "text": "$\\forall x(P(x)\\to Q(x))$|||$\\forall x(P(x)\\to Q(x))$"
            },
            {
              "text": "$\\exists x(P(x)\\lor\\neg Q(x))$|||$\\exists x(P(x)\\lor\\neg Q(x))$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"No student ... has ... but can not ...\" means there is no x with $P(x)\\land\\neg Q(x)$, i.e. $\\neg\\exists x(P(x)\\land\\neg Q(x))\\equiv\\forall x(\\neg P(x)\\lor Q(x))\\equiv\\forall x(P(x)\\to Q(x))$.</div><div class=\"ml-vi\">\"Không có sinh viên nào ... nhưng lại không...\" nghĩa là không tồn tại x sao cho $P(x)\\land\\neg Q(x)$, tức $\\neg\\exists x(P(x)\\land\\neg Q(x))\\equiv\\forall x(\\neg P(x)\\lor Q(x))\\equiv\\forall x(P(x)\\to Q(x))$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To encode a message consisting of only the letters {a, b, i, n, s, t}, we want to use the following prefix coding scheme: a: 10, b: 01, i: 001, n: 110, s: 1111, t: (to be determined). Which of the following bit string could be used to encode the letter t?|||Để mã hoá một thông điệp chỉ gồm các chữ cái {a, b, i, n, s, t}, ta muốn dùng bảng mã tiền tố sau: a: 10, b: 01, i: 001, n: 110, s: 1111, t: (chưa xác định). Chuỗi bit nào sau đây có thể dùng để mã hoá chữ t?",
          "options": [
            {
              "text": "0001|||0001"
            },
            {
              "text": "111|||111"
            },
            {
              "text": "100|||100"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The trie node '00' has child 'i'=001 and a free sibling branch '000' that can extend further. '0001' is not a prefix of, and has no existing code as its prefix — valid. '111' is a prefix of s='1111' — invalid. '100' has a='10' as its prefix — invalid. '1' is a prefix of a, n, s — invalid.</div><div class=\"ml-vi\">Nút '00' trong cây tiền tố có nhánh con i=001 và nhánh còn trống '000' có thể mở rộng thêm. '0001' không phải tiền tố của mã nào đã dùng và không mã nào đã dùng là tiền tố của nó — hợp lệ. '111' là tiền tố của s=1111 — không hợp lệ. '100' có a=10 là tiền tố — không hợp lệ. '1' là tiền tố của a, n, s — không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graphs are isomorphic to $K_{2,3}$? Graph X has 5 vertices (top, left, center, right, bottom) with edges top-left, top-right, left-center, center-right, left-bottom, right-bottom. Graph Y has 5 vertices (top-left, top-mid, top-right, bottom-left, bottom-right) with edges top-left--top-mid, top-mid--top-right, bottom-left--bottom-right, top-left--bottom-right, top-right--bottom-left, top-mid--bottom-left, top-mid--bottom-right.|||Đồ thị nào đẳng cấu với $K_{2,3}$? Đồ thị X có 5 đỉnh (trên, trái, giữa, phải, dưới) với các cạnh trên-trái, trên-phải, trái-giữa, giữa-phải, trái-dưới, phải-dưới. Đồ thị Y có 5 đỉnh (trên-trái, trên-giữa, trên-phải, dưới-trái, dưới-phải) với các cạnh trên-trái--trên-giữa, trên-giữa--trên-phải, dưới-trái--dưới-phải, trên-trái--dưới-phải, trên-phải--dưới-trái, trên-giữa--dưới-trái, trên-giữa--dưới-phải.",
          "options": [
            {
              "text": "X and Y|||X và Y"
            },
            {
              "text": "Y|||Y"
            },
            {
              "text": "X|||X"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">X has degree sequence (2,3,2,3,2): the two degree-3 vertices (left,right) are non-adjacent and each connects to all three degree-2 vertices (top,center,bottom), which are pairwise non-adjacent -- exactly matches $K_{2,3}$'s bipartite structure. Y has 7 edges (not 6) and a degree-4 vertex (top-mid), so it cannot be isomorphic to $K_{2,3}$ (which has exactly 6 edges, max degree 3).</div><div class=\"ml-vi\">X có dãy bậc (2,3,2,3,2): hai đỉnh bậc 3 (trái, phải) không kề nhau và mỗi đỉnh nối với cả ba đỉnh bậc 2 (trên, giữa, dưới), các đỉnh bậc 2 cũng không kề nhau -- đúng khớp cấu trúc lưỡng phân của $K_{2,3}$. Y có 7 cạnh (không phải 6) và một đỉnh bậc 4 (trên-giữa), nên không thể đẳng cấu với $K_{2,3}$ (chỉ có đúng 6 cạnh, bậc tối đa 3).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which integer is congruent to 5 mod 17?|||Số nguyên nào đồng dư với 5 theo modulo 17?",
          "options": [
            {
              "text": "-29|||-29"
            },
            {
              "text": "80|||80"
            },
            {
              "text": "-122|||-122"
            },
            {
              "text": "103|||103"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$-29=5-2\\cdot17$, so $-29\\equiv5\\pmod{17}$. Checking others: $80\\equiv12$; $-122\\equiv14$; $103\\equiv1\\pmod{17}$.</div><div class=\"ml-vi\">$-29=5-2\\cdot17$, nên $-29\\equiv5\\pmod{17}$. Kiểm các đáp án khác: $80\\equiv12$; $-122\\equiv14$; $103\\equiv1\\pmod{17}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the least common multiple of $11\\cdot13^3\\cdot17^2$ and $2^7\\cdot5^2\\cdot9^2\\cdot11^2$?|||Bội chung nhỏ nhất của $11\\cdot13^3\\cdot17^2$ và $2^7\\cdot5^2\\cdot9^2\\cdot11^2$ là gì?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$|||$2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$"
            },
            {
              "text": "$11^2$|||$11^2$"
            },
            {
              "text": "$2^7\\cdot5^3\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$|||$2^7\\cdot5^3\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$"
            },
            {
              "text": "11|||11"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$9^2=3^4$. The LCM takes the max exponent of each prime across both numbers: $2^7$, $3^4$, $5^2$ (all only in the 2nd number), $11^{\\max(1,2)}=11^2$, $13^3$, $17^2$ (only in the 1st). So LCM $=2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$.</div><div class=\"ml-vi\">$9^2=3^4$. BCNN lấy số mũ lớn nhất mỗi số nguyên tố: $2^7$, $3^4$, $5^2$ (chỉ có ở số thứ 2), $11^{\\max(1,2)}=11^2$, $13^3$, $17^2$ (chỉ có ở số thứ 1). Vậy BCNN $=2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a_1,a_2,\\dots$ be the sequence $1,0,0,1,1,1,0,0,0,0,\\dots$ formed of blocks of consecutive equal terms: the $k$-th block has length $k$ and value $1$ if $k$ is odd, $0$ if $k$ is even. Find $a_{100}$ and $a_{201}$.|||Cho $a_1,a_2,\\dots$ là dãy $1,0,0,1,1,1,0,0,0,0,\\dots$ gồm các khối số hạng liên tiếp bằng nhau: khối thứ $k$ có độ dài $k$ và giá trị $1$ nếu $k$ lẻ, $0$ nếu $k$ chẵn. Tìm $a_{100}$ và $a_{201}$.",
          "options": [
            {
              "text": "0 and 0|||0 và 0"
            },
            {
              "text": "1 and 1|||1 và 1"
            },
            {
              "text": "1 and 0|||1 và 0"
            },
            {
              "text": "0 and 1|||0 và 1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Cumulative length after block $k$ is $k(k+1)/2$. Position 100 falls in block 14 (positions 92-105, since $13\\cdot14/2=91$, $14\\cdot15/2=105$); block 14 is even so $a_{100}=0$. Position 201 falls in block 20 (positions 191-210, since $19\\cdot20/2=190$, $20\\cdot21/2=210$); block 20 is even so $a_{201}=0$.</div><div class=\"ml-vi\">Tổng độ dài sau khối $k$ là $k(k+1)/2$. Vị trí 100 rơi vào khối 14 (vị trí 92-105, vì $13\\cdot14/2=91$, $14\\cdot15/2=105$); khối 14 chẵn nên $a_{100}=0$. Vị trí 201 rơi vào khối 20 (vị trí 191-210, vì $19\\cdot20/2=190$, $20\\cdot21/2=210$); khối 20 chẵn nên $a_{201}=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graphs have Euler paths? (i) $K_{3,2}$ (ii) $K_{3,3}$ (iii) $W_3$ (iv) $Q_3$|||Đồ thị nào sau đây có đường đi Euler? (i) $K_{3,2}$ (ii) $K_{3,3}$ (iii) $W_3$ (iv) $Q_3$",
          "options": [
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An Euler path exists iff the graph is connected with exactly 0 or 2 odd-degree vertices. $K_{3,2}$: the 2-side vertices have degree 3 (odd), the 3-side vertices degree 2 (even) -- exactly 2 odd vertices, so it has an Euler path. $K_{3,3}$: all 6 vertices have degree 3 (odd) -- too many. $W_3$ (hub + 3-cycle, 4 vertices): every vertex has degree 3 (odd), 4 odd vertices. $Q_3$ (cube graph, 8 vertices, 3-regular): all 8 vertices odd. None of (ii),(iii),(iv) qualify.</div><div class=\"ml-vi\">Đường đi Euler tồn tại khi đồ thị liên thông và có đúng 0 hoặc 2 đỉnh bậc lẻ. $K_{3,2}$: các đỉnh phía 2 có bậc 3 (lẻ), các đỉnh phía 3 có bậc 2 (chẵn) -- đúng 2 đỉnh lẻ, nên có đường đi Euler. $K_{3,3}$: cả 6 đỉnh đều bậc 3 (lẻ) -- quá nhiều. $W_3$ (trục + chu trình 3 đỉnh, 4 đỉnh): mọi đỉnh đều bậc 3 (lẻ), 4 đỉnh lẻ. $Q_3$ (đồ thị lập phương, 8 đỉnh, 3-đều): cả 8 đỉnh đều lẻ. Không (ii),(iii),(iv) nào thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine the truth value of the proposition, where the domain is the set of all real numbers: $\\forall x\\forall y((x>0)\\land(y>0)\\to(x/y>0))$|||Xác định giá trị chân lý của mệnh đề, với miền là tập số thực: $\\forall x\\forall y((x>0)\\land(y>0)\\to(x/y>0))$",
          "options": [
            {
              "text": "It is not a proposition|||Đây không phải là mệnh đề"
            },
            {
              "text": "False|||Sai"
            },
            {
              "text": "True|||Đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">If $x>0$ and $y>0$ then $y\\neq0$ and dividing two positive numbers always gives a positive result, so $x/y>0$ always holds -- the implication is true for every $x,y$, making the whole statement True.</div><div class=\"ml-vi\">Nếu $x>0$ và $y>0$ thì $y\\neq0$ và chia hai số dương luôn cho kết quả dương, nên $x/y>0$ luôn đúng -- phép kéo theo đúng với mọi $x,y$, nên mệnh đề Đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following sequences is the degree sequence of a simple graph?|||Dãy nào sau đây là dãy bậc của một đồ thị đơn?",
          "options": [
            {
              "text": "3, 3, 2, 2, 1|||3, 3, 2, 2, 1"
            },
            {
              "text": "5, 4, 2, 2, 1|||5, 4, 2, 2, 1"
            },
            {
              "text": "4, 4, 2, 2, 2|||4, 4, 2, 2, 2"
            },
            {
              "text": "5, 5, 2, 1, 1|||5, 5, 2, 1, 1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(A) tổng=11 lẻ, không thể là dãy bậc đồ thị. (B) và (D) đều có bậc 5 trong đồ thị 5 đỉnh, nhưng bậc tối đa có thể là $n-1=4$ -- không thể. (C) 4,4,2,2,2 (tổng=14) khả thi: hai đỉnh bậc 4 nối với nhau và với cả ba đỉnh bậc 2.</div><div class=\"ml-vi\">(A) tổng=11 lẻ, không thể là dãy bậc đồ thị. (B) và (D) đều có bậc 5 trong đồ thị 5 đỉnh, nhưng bậc tối đa có thể là $n-1=4$ -- không thể. (C) 4,4,2,2,2 (tổng=14) khả thi: hai đỉnh bậc 4 nối với nhau và với cả ba đỉnh bậc 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many edges in a tree of 10000 vertices?|||Một cây có 10000 đỉnh thì có bao nhiêu cạnh?",
          "options": [
            {
              "text": "10002|||10002"
            },
            {
              "text": "10001|||10001"
            },
            {
              "text": "9999|||9999"
            },
            {
              "text": "10000|||10000"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A tree with $n$ vertices always has exactly $n-1$ edges: $10000-1=9999$.</div><div class=\"ml-vi\">Một cây có $n$ đỉnh luôn có đúng $n-1$ cạnh: $10000-1=9999$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a recursive definition for the set of all integers not divisible by 3.|||Tìm một định nghĩa đệ quy cho tập tất cả các số nguyên không chia hết cho 3.",
          "options": [
            {
              "text": "1,2 $\\in$ S, if a $\\in$ S then a+3 $\\in$ S, a-3 $\\in$ S|||1,2 $\\in$ S, nếu a $\\in$ S thì a+3 $\\in$ S, a-3 $\\in$ S"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1 $\\in$ S, if a $\\in$ S then a+3 $\\in$ S, a-3 $\\in$ S|||1 $\\in$ S, nếu a $\\in$ S thì a+3 $\\in$ S, a-3 $\\in$ S"
            },
            {
              "text": "1 $\\in$ S, if a $\\in$ S then a+3 $\\in$ S|||1 $\\in$ S, nếu a $\\in$ S thì a+3 $\\in$ S"
            },
            {
              "text": "1,2 $\\in$ S, if a $\\in$ S then a+3 $\\in$ S|||1,2 $\\in$ S, nếu a $\\in$ S thì a+3 $\\in$ S"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Integers not divisible by 3 split into residue classes 1 and 2 mod 3, so both 1 and 2 must be basis elements. Adding or subtracting 3 preserves the residue class mod 3 and both directions are needed to reach every positive AND negative integer in each class. Only '1,2 $\\in$ S; a+3, a-3 $\\in$ S' generates the full set.</div><div class=\"ml-vi\">Các số nguyên không chia hết cho 3 chia thành 2 lớp dư 1 và 2 theo mod 3, nên cả 1 và 2 đều phải là phần tử cơ sở. Cộng/trừ 3 giữ nguyên lớp dư mod 3 và cần cả hai chiều để tới được mọi số nguyên dương LẪN âm trong mỗi lớp. Chỉ có '1,2 $\\in$ S; a+3, a-3 $\\in$ S' sinh ra đủ tập hợp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x,y)$ = \"x+y = x-y\", where x, y are integer numbers. Which proposition is true?|||Cho $P(x,y)$ = \"x+y = x-y\", với x, y là số nguyên. Mệnh đề nào đúng?",
          "options": [
            {
              "text": "$\\forall y\\exists x\\,P(x,y)$|||$\\forall y\\exists x\\,P(x,y)$"
            },
            {
              "text": "$P(1,1)$|||$P(1,1)$"
            },
            {
              "text": "$\\forall x\\exists y\\,P(x,y)$|||$\\forall x\\exists y\\,P(x,y)$"
            },
            {
              "text": "$\\forall x\\forall y\\,P(x,y)$|||$\\forall x\\forall y\\,P(x,y)$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$P(x,y)$ simplifies to $y=0$ (independent of x). $P(1,1)$: $y=1\\neq0$, false. $\\forall x\\exists y\\,P(x,y)$: for every x, choosing $y=0$ makes it true -- this is true. $\\forall y\\exists x\\,P(x,y)$: fails for any $y\\neq0$ since no x can fix it. $\\forall x\\forall y\\,P(x,y)$: fails whenever $y\\neq0$.</div><div class=\"ml-vi\">$P(x,y)$ rút gọn thành $y=0$ (không phụ thuộc x). $P(1,1)$: $y=1\\neq0$, sai. $\\forall x\\exists y\\,P(x,y)$: với mỗi x, chọn $y=0$ sẽ đúng -- mệnh đề này đúng. $\\forall y\\exists x\\,P(x,y)$: sai với mọi $y\\neq0$ vì không x nào sửa được. $\\forall x\\forall y\\,P(x,y)$: sai khi $y\\neq0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the universal set $U = \\{1,2,3,4,5,6,7,8,9,10\\}$. Represent the subset $\\{1,2,5,7,8,10\\}$ by a bit string whose i-th bit is 1 if i belongs to that subset, and is 0 otherwise. What is that bit string?|||Cho tập vũ trụ $U = \\{1,2,3,4,5,6,7,8,9,10\\}$. Biểu diễn tập con $\\{1,2,5,7,8,10\\}$ bằng chuỗi bit mà bit thứ i là 1 nếu i thuộc tập con đó, và là 0 nếu không. Chuỗi bit đó là gì?",
          "options": [
            {
              "text": "1100101101|||1100101101"
            },
            {
              "text": "0011010010|||0011010010"
            },
            {
              "text": "0110100110|||0110100110"
            },
            {
              "text": "1001011001|||1001011001"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Gán bit theo từng vị trí 1..10: 1,2,5,7,8,10 có mặt (bit 1), còn lại 0: positions 1-10 = 1,1,0,0,1,0,1,1,0,1 $\\Rightarrow$ 1100101101.</div><div class=\"ml-vi\">Gán bit theo từng vị trí 1..10: 1,2,5,7,8,10 có mặt (bit 1), còn lại 0: vị trí 1-10 = 1,1,0,0,1,0,1,1,0,1 $\\Rightarrow$ 1100101101.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the value of the following postfix expression? $3\\;2\\;*\\;2\\;\\uparrow\\;5\\;3\\;-\\;8\\;4\\;/\\;*\\;-$|||Giá trị của biểu thức hậu tố (postfix) sau là bao nhiêu? $3\\;2\\;*\\;2\\;\\uparrow\\;5\\;3\\;-\\;8\\;4\\;/\\;*\\;-$",
          "options": [
            {
              "text": "18|||18"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "22|||22"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$3\\,2\\,*=6$; $6\\,2\\uparrow=36$; $5\\,3\\,-=2$; $8\\,4\\,/=2$; then $2*2=4$; finally $36-4=32$.</div><div class=\"ml-vi\">$3\\,2\\,*=6$; $6\\,2\\uparrow=36$; $5\\,3\\,-=2$; $8\\,4\\,/=2$; rồi $2*2=4$; cuối cùng $36-4=32$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If inorder traversal is used, what is the position of the vertex \"d\" in the list? Rooted tree: root d has children b, h (in order). b has children a, c, e (in order). e has children f, g. h has children i, l. l has children j, m, o, p. m has children k, n.|||Nếu dùng duyệt trung tự (inorder traversal), vị trí của đỉnh \"d\" trong danh sách là bao nhiêu? Cây có gốc: gốc d có 2 con b, h (theo thứ tự). b có 3 con a, c, e. e có 2 con f, g. h có 2 con i, l. l có 4 con j, m, o, p. m có 2 con k, n.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Generalized inorder (first subtree, then root, then remaining subtrees): traversal(b)=a,b,c,f,e,g; then d; then traversal(h)=i,h,j,l,k,m,n,o,p. Full order: a,b,c,f,e,g,d,... -- d is the 7th element.</div><div class=\"ml-vi\">Duyệt trung tự tổng quát (cây con đầu tiên, rồi gốc, rồi các cây con còn lại): traversal(b)=a,b,c,f,e,g; rồi d; rồi traversal(h)=i,h,j,l,k,m,n,o,p. Thứ tự đầy đủ: a,b,c,f,e,g,d,... -- d là phần tử thứ 7.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $X=\\{\\emptyset,\\{\\emptyset\\},\\{a,c\\}\\}$, $Y=\\{y,\\{z,z\\},y\\}$. How many functions are there from Y to X?|||Cho $X=\\{\\emptyset,\\{\\emptyset\\},\\{a,c\\}\\}$, $Y=\\{y,\\{z,z\\},y\\}$. Có bao nhiêu hàm từ Y đến X?",
          "options": [
            {
              "text": "12|||12"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$X$ has 3 distinct elements ($|X|=3$). $Y=\\{y,\\{z,z\\},y\\}=\\{y,\\{z\\}\\}$ after removing set-duplicates ($\\{z,z\\}=\\{z\\}$, repeated $y$ counted once), so $|Y|=2$. Number of functions from $Y$ to $X$ is $|X|^{|Y|}=3^2=9$.</div><div class=\"ml-vi\">$X$ có 3 phần tử phân biệt ($|X|=3$). $Y=\\{y,\\{z,z\\},y\\}=\\{y,\\{z\\}\\}$ sau khi bỏ trùng lặp trong tập hợp ($\\{z,z\\}=\\{z\\}$, $y$ lặp chỉ tính 1 lần), nên $|Y|=2$. Số hàm từ $Y$ đến $X$ là $|X|^{|Y|}=3^2=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a graph G with vertices a,b,c,d,e,f,g,h and edges: a-d, d-f (top row), a-b (left vertical), a-c, c-b, c-e (diagonals from c), d-g, f-e (crossing diagonals), f-g (vertical), e-g, g-h (bottom row). What is the order of vertices traversed by Breadth First Search from vertex a? Assume that at each level, the vertices are ordered alphabetically.|||Cho đồ thị G với các đỉnh a,b,c,d,e,f,g,h và các cạnh: a-d, d-f (hàng trên), a-b (dọc trái), a-c, c-b, c-e (đường chéo từ c), d-g, f-e (đường chéo cắt nhau), f-g (dọc), e-g, g-h (hàng dưới). Thứ tự các đỉnh được duyệt bởi thuật toán BFS từ đỉnh a là gì? Giả sử ở mỗi mức, các đỉnh được sắp theo thứ tự bảng chữ cái.",
          "options": [
            {
              "text": "a, b, c, d, e, f, g, h|||a, b, c, d, e, f, g, h"
            },
            {
              "text": "a, b, c, e, g, h, d, f|||a, b, c, e, g, h, d, f"
            },
            {
              "text": "a, b, c, d, e, g, f, h|||a, b, c, d, e, g, f, h"
            },
            {
              "text": "a, b, c, e, f, g, h, d|||a, b, c, e, f, g, h, d"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Level0: a. Level1 (a's neighbors b,c,d, alphabetical): b,c,d. Level2 (new neighbors of b,c,d): c gives e, d gives f,g -- alphabetical: e,f,g. Level3 (new neighbor of g): h. Full order: a,b,c,d,e,f,g,h.</div><div class=\"ml-vi\">Mức0: a. Mức1 (láng giềng của a là b,c,d, theo abc): b,c,d. Mức2 (láng giềng mới của b,c,d): c cho e, d cho f,g -- theo abc: e,f,g. Mức3 (láng giềng mới của g): h. Thứ tự đầy đủ: a,b,c,d,e,f,g,h.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many functions are $O(x^3)$? (i) $f(x)=(2x+1)(x^2+1)$ (ii) $g(x)=\\lfloor x\\rfloor\\lceil x\\rceil\\log x$ (iii) $h(x)=x^4+2x$|||Có bao nhiêu hàm là $O(x^3)$? (i) $f(x)=(2x+1)(x^2+1)$ (ii) $g(x)=\\lfloor x\\rfloor\\lceil x\\rceil\\log x$ (iii) $h(x)=x^4+2x$",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) $f(x)=2x^3+x^2+2x+1$ is a degree-3 polynomial, $\\Theta(x^3)\\subset O(x^3)$. (ii) $g(x)\\approx x^2\\log x$ grows slower than $x^3$, so it is also $O(x^3)$. (iii) $h(x)=x^4+2x$ grows like $x^4$, which is NOT $O(x^3)$. So exactly 2 functions qualify.</div><div class=\"ml-vi\">(i) $f(x)=2x^3+x^2+2x+1$ là đa thức bậc 3, $\\Theta(x^3)\\subset O(x^3)$. (ii) $g(x)\\approx x^2\\log x$ tăng chậm hơn $x^3$, nên cũng là $O(x^3)$. (iii) $h(x)=x^4+2x$ tăng như $x^4$, KHÔNG phải $O(x^3)$. Vậy đúng 2 hàm thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A soccer tournament has 20 teams. Each team plays each other twice (first leg and second leg). How many games are there in the tournament?|||Một giải bóng đá có 20 đội. Mỗi đội đấu với mỗi đội khác 2 lần (lượt đi và lượt về). Có bao nhiêu trận đấu trong giải?",
          "options": [
            {
              "text": "40|||40"
            },
            {
              "text": "400|||400"
            },
            {
              "text": "380|||380"
            },
            {
              "text": "190|||190"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Number of unordered pairs of teams is $\\binom{20}{2}=190$, and each pair plays twice: $190\\times2=380$.</div><div class=\"ml-vi\">Số cặp đội không thứ tự là $\\binom{20}{2}=190$, mỗi cặp đấu 2 lần: $190\\times2=380$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the truth value of each of the following propositions, where x represents a real number. (M) $\\forall x[(x\\ge1)\\to(x^2\\ge1)]$ (N) $\\forall x[(x\\ge1)\\land(x^2\\ge1)]$ (P) $\\forall x[(x\\ge1)\\lor(x^2\\ge1)]$|||Tìm giá trị chân lý của mỗi mệnh đề sau, với x đại diện cho một số thực. (M) $\\forall x[(x\\ge1)\\to(x^2\\ge1)]$ (N) $\\forall x[(x\\ge1)\\land(x^2\\ge1)]$ (P) $\\forall x[(x\\ge1)\\lor(x^2\\ge1)]$",
          "options": [
            {
              "text": "Only (N) is True|||Chỉ (N) đúng"
            },
            {
              "text": "Only (M) is True|||Chỉ (M) đúng"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Only (P) is True|||Chỉ (P) đúng"
            },
            {
              "text": "All of (M), (N) and (P) are True|||Cả (M), (N) và (P) đều đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(M): if $x\\ge1$ then $x^2\\ge1$ always holds -- True. (N): requires $x\\ge1$ to hold for ALL x, false at e.g. $x=0$ -- False. (P): requires $x\\ge1$ or $x^2\\ge1$ for all x, but at $x=0$ both fail (0<1 and $0^2<1$) -- False. Only (M) is True.</div><div class=\"ml-vi\">(M): nếu $x\\ge1$ thì $x^2\\ge1$ luôn đúng -- Đúng. (N): yêu cầu $x\\ge1$ đúng với MỌI x, sai tại vd $x=0$ -- Sai. (P): yêu cầu $x\\ge1$ hoặc $x^2\\ge1$ với mọi x, nhưng tại $x=0$ cả hai đều sai (0<1 và $0^2<1$) -- Sai. Chỉ (M) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the subset of the set of ordered pairs of integers defined recursively by: Basis step: $(0,0)\\in S$. Recursive step: If $(a,b)\\in S$, then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is NOT in S?|||Cho S là tập con của tập các cặp số nguyên có thứ tự, định nghĩa đệ quy: Bước cơ sở $(0,0)\\in S$. Bước đệ quy: nếu $(a,b)\\in S$ thì $(a+2,b+3)\\in S$ và $(a+3,b+2)\\in S$. Phần tử nào KHÔNG thuộc S?",
          "options": [
            {
              "text": "(10, 5)|||(10, 5)"
            },
            {
              "text": "(10, 10)|||(10, 10)"
            },
            {
              "text": "(10, 15)|||(10, 15)"
            },
            {
              "text": "(5, 5)|||(5, 5)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Every $(a,b)\\in S$ has $a=2x+3y,b=3x+2y$ for nonnegative integers $x,y$. For (10,5): solving gives $x=-1$ (invalid) -- not in S. (10,10): $x=y=2$ (valid). (10,15): $x=5,y=0$ (valid). (5,5): $x=y=1$ (valid).</div><div class=\"ml-vi\">Mọi $(a,b)\\in S$ có dạng $a=2x+3y,b=3x+2y$ với $x,y$ nguyên không âm. Với (10,5): giải ra $x=-1$ (không hợp lệ) -- không thuộc S. (10,10): $x=y=2$ (hợp lệ). (10,15): $x=5,y=0$ (hợp lệ). (5,5): $x=y=1$ (hợp lệ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the binary expansion of $(204)_5$|||Tìm khai triển nhị phân của $(204)_5$",
          "options": [
            {
              "text": "1101110|||1101110"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1110100|||1110100"
            },
            {
              "text": "110110|||110110"
            },
            {
              "text": "11101110|||11101110"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$(204)_5=2\\cdot25+0\\cdot5+4=54$ in decimal. $54=32+16+4+2\\Rightarrow(110110)_2$.</div><div class=\"ml-vi\">$(204)_5=2\\cdot25+0\\cdot5+4=54$ ở hệ thập phân. $54=32+16+4+2\\Rightarrow(110110)_2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Binary search algorithm: procedure Binarysearch($a_1<a_2<\\dots<a_n$, x: integer); i:=1; j:=n; while(i<j): m:=$\\lfloor(i+j)/2\\rfloor$; if $x>a_m$ then i:=m+1 else j:=m; if $x=a_i$ then location:=i else location:=0. If input = 2, 4, 5, 7, 8, 9, 10, 13 and x = 6, after the third time of dividing into sublists, the sublist to be considered is ______|||Cho thuật toán tìm kiếm nhị phân: procedure Binarysearch($a_1<a_2<\\dots<a_n$, x: integer); i:=1; j:=n; while(i<j): m:=$\\lfloor(i+j)/2\\rfloor$; if $x>a_m$ then i:=m+1 else j:=m; if $x=a_i$ then location:=i else location:=0. Nếu input = 2, 4, 5, 7, 8, 9, 10, 13 và x = 6, sau lần chia lần thứ ba, danh sách con được xét là ______",
          "options": [
            {
              "text": "5, 7|||5, 7"
            },
            {
              "text": "7, 8|||7, 8"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$i=1,j=8$. Div.1: $m=4,a_4=7,x=6<7\\Rightarrow j=4$, sublist $[1,4]=\\{2,4,5,7\\}$. Div.2: $m=2,a_2=4,x=6>4\\Rightarrow i=3$, sublist $[3,4]=\\{5,7\\}$. Div.3: $m=3,a_3=5,x=6>5\\Rightarrow i=4$, sublist $[4,4]=\\{7\\}$.</div><div class=\"ml-vi\">$i=1,j=8$. Lần 1: $m=4,a_4=7,x=6<7\\Rightarrow j=4$, danh sách $[1,4]=\\{2,4,5,7\\}$. Lần 2: $m=2,a_2=4,x=6>4\\Rightarrow i=3$, danh sách $[3,4]=\\{5,7\\}$. Lần 3: $m=3,a_3=5,x=6>5\\Rightarrow i=4$, danh sách $[4,4]=\\{7\\}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a simple graph. The complementary graph of G is the graph G' having the same set of vertices, and there is an edge connecting u and v in G' if and only if there is no edge connecting u and v in G. If G has 10 vertices and 20 edges, how many edges does G' have?|||Cho G là đồ thị đơn. Đồ thị bù của G là đồ thị G' có cùng tập đỉnh, và có cạnh nối u và v trong G' khi và chỉ khi không có cạnh nối u và v trong G. Nếu G có 10 đỉnh và 20 cạnh, G' có bao nhiêu cạnh?",
          "options": [
            {
              "text": "25|||25"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "70|||70"
            },
            {
              "text": "45|||45"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Maximum possible edges among 10 vertices is $\\binom{10}{2}=45$. $G'$ has the edges $G$ doesn't: $45-20=25$.</div><div class=\"ml-vi\">Số cạnh tối đa có thể có giữa 10 đỉnh là $\\binom{10}{2}=45$. $G'$ có các cạnh mà $G$ không có: $45-20=25$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the recursive algorithm if input n = 5. procedure TT(n:integer); if n=1 then f(1):=0 else f(n):=f(n-1)*n;|||Tìm kết quả của thuật toán đệ quy nếu đầu vào n = 5. procedure TT(n:integer); if n=1 then f(1):=0 else f(n):=f(n-1)*n;",
          "options": [
            {
              "text": "-120|||-120"
            },
            {
              "text": "-240|||-240"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "240|||240"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=0$, and every subsequent term multiplies by $n$: $f(2)=0\\cdot2=0$, $f(3)=0$, $f(4)=0$, $f(5)=0$. The zero propagates through every multiplication.</div><div class=\"ml-vi\">$f(1)=0$, và mọi số hạng sau đều nhân thêm $n$: $f(2)=0\\cdot2=0$, $f(3)=0$, $f(4)=0$, $f(5)=0$. Số 0 lan truyền qua mọi phép nhân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The number $n = 326700000$ can be written uniquely as a product of powers of distinct primes, $n=a^xb^yc^zd^t$, where a, b, c, d are primes. Find x+y+z+t.|||Số $n = 326700000$ có thể viết duy nhất dưới dạng tích các luỹ thừa số nguyên tố phân biệt, $n=a^xb^yc^zd^t$, với a,b,c,d là các số nguyên tố. Tìm x+y+z+t.",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "11|||11"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$326700000=100000\\times3267=(2^5\\cdot5^5)\\times(3^3\\cdot11^2)$. Sum of exponents: $5+5+3+2=15$.</div><div class=\"ml-vi\">$326700000=100000\\times3267=(2^5\\cdot5^5)\\times(3^3\\cdot11^2)$. Tổng số mũ: $5+5+3+2=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let p, q and r be the propositions $p$ = \"I will go to Spain\", $q$ = \"I will go to Italy\", and $r$ = \"I have 10000 dollars\". Translate the following sentence into logical expression: \"I will go to Spain and Italy when I have 10000 dollars\".|||Cho p, q, r là các mệnh đề: $p$ = \"Tôi sẽ đi Tây Ban Nha\", $q$ = \"Tôi sẽ đi Ý\", $r$ = \"Tôi có 10000 đô la\". Dịch câu sau thành biểu thức logic: \"Tôi sẽ đi Tây Ban Nha và Ý khi tôi có 10000 đô la\".",
          "options": [
            {
              "text": "$(p\\lor q)\\to r$|||$(p\\lor q)\\to r$"
            },
            {
              "text": "$(p\\land q)\\to r$|||$(p\\land q)\\to r$"
            },
            {
              "text": "$r\\to(p\\lor q)$|||$r\\to(p\\lor q)$"
            },
            {
              "text": "$r\\to(p\\land q)$|||$r\\to(p\\land q)$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"...and Italy when I have...\" means: whenever r holds, both p and q happen -- $r\\to(p\\land q)$.</div><div class=\"ml-vi\">\"...và Ý khi tôi có...\" nghĩa là: khi nào r đúng thì cả p và q đều xảy ra -- $r\\to(p\\land q)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which propositions are tautology? (i) $\\neg(p\\to q)\\oplus p$ (ii) $\\neg(p\\to q)\\to p$|||Mệnh đề nào là hằng đúng (tautology)? (i) $\\neg(p\\to q)\\oplus p$ (ii) $\\neg(p\\to q)\\to p$",
          "options": [
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Truth table: (i) is True only when $p=T,q=T$ -- not a tautology. (ii): $\\neg(p\\to q)$ is only True when $p=T,q=F$, and in that case $p=T$ too, so the implication holds; in every other case the antecedent is False so the implication is vacuously True. (ii) is always True -- a tautology.</div><div class=\"ml-vi\">Bảng chân trị: (i) chỉ đúng khi $p=T,q=T$ -- không phải hằng đúng. (ii): $\\neg(p\\to q)$ chỉ đúng khi $p=T,q=F$, và lúc đó $p=T$ nên kéo theo đúng; các trường hợp còn lại tiền đề sai nên kéo theo đúng hiển nhiên. (ii) luôn đúng -- là hằng đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let p, q be the propositions $p$ = \"She is out of work\", $q$ = \"She spends less on clothes\". Translate the sentence into logical expression: \"Although she is out of work, she doesn't spend less on clothes.\"|||Cho p, q là các mệnh đề: $p$ = \"Cô ấy thất nghiệp\", $q$ = \"Cô ấy chi tiêu ít hơn cho quần áo\". Dịch câu sau thành biểu thức logic: \"Mặc dù cô ấy thất nghiệp, cô ấy không chi tiêu ít hơn cho quần áo.\"",
          "options": [
            {
              "text": "$p\\leftrightarrow\\neg q$|||$p\\leftrightarrow\\neg q$"
            },
            {
              "text": "$p\\to\\neg q$|||$p\\to\\neg q$"
            },
            {
              "text": "$p\\lor\\neg q$|||$p\\lor\\neg q$"
            },
            {
              "text": "$p\\land\\neg q$|||$p\\land\\neg q$"
            },
            {
              "text": "$\\neg q\\to p$|||$\\neg q\\to p$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"Although X, Y\" is simply a conjunction with contrastive tone: $p\\land\\neg q$ (she is out of work AND she does not spend less on clothes).</div><div class=\"ml-vi\">\"Mặc dù X, Y\" chỉ đơn giản là phép hội mang sắc thái tương phản: $p\\land\\neg q$ (cô ấy thất nghiệp VÀ cô ấy không chi tiêu ít hơn cho quần áo).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many cut vertices and cut edges are in this graph? The graph is a path of 7 vertices drawn in a zigzag: bottom-left -- top-left -- top-right -- middle-left -- middle-right -- bottom-right -- bottom-middle (6 edges, no cycles).|||Đồ thị này có bao nhiêu đỉnh cắt và cạnh cắt? Đồ thị là một đường đi 7 đỉnh vẽ theo hình zic-zac: dưới-trái -- trên-trái -- trên-phải -- giữa-trái -- giữa-phải -- dưới-phải -- dưới-giữa (6 cạnh, không có chu trình).",
          "options": [
            {
              "text": "6 and 6|||6 và 6"
            },
            {
              "text": "5 and 5|||5 và 5"
            },
            {
              "text": "5 and 6|||5 và 6"
            },
            {
              "text": "7 and 6|||7 và 6"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The graph is a tree (a simple path, no cycles): every one of its 6 edges is a bridge (cut edge). Of the 7 vertices, the 2 endpoints (leaves) are not cut vertices, so the other $7-2=5$ vertices are cut vertices.</div><div class=\"ml-vi\">Đồ thị này là một cây (đường đi đơn, không có chu trình): cả 6 cạnh đều là cầu (cạnh cắt). Trong 7 đỉnh, 2 đỉnh đầu mút (lá) không phải đỉnh cắt, nên $7-2=5$ đỉnh còn lại là đỉnh cắt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: procedure P(a: real number, n: positive integer); if n=1 then return 1 else return a+P(a,n-1). Find output if a=3, n=5.|||Cho thuật toán đệ quy: procedure P(a: real number, n: positive integer); if n=1 then return 1 else return a+P(a,n-1). Tìm kết quả nếu a=3, n=5.",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "243|||243"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "125|||125"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$P(a,1)=1$. $P(a,2)=a+1$. $P(a,3)=a+(a+1)=2a+1$. $P(a,4)=a+(2a+1)=3a+1$. $P(a,5)=a+(3a+1)=4a+1$. With $a=3$: $4\\cdot3+1=13$.</div><div class=\"ml-vi\">$P(a,1)=1$. $P(a,2)=a+1$. $P(a,3)=a+(a+1)=2a+1$. $P(a,4)=a+(2a+1)=3a+1$. $P(a,5)=a+(3a+1)=4a+1$. Với $a=3$: $4\\cdot3+1=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of leaves of a full 3-ary tree of height 3.|||Tìm số lá ít nhất của một cây tam phân đầy đủ có chiều cao 3.",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">To minimize leaves while reaching height 3, only one branch keeps expanding at each level (the other 2 children become leaves immediately), and the final level's 3 children must all be leaves: $2+2+3=7$.</div><div class=\"ml-vi\">Để tối thiểu số lá mà vẫn đạt chiều cao 3, ở mỗi mức chỉ một nhánh tiếp tục mở rộng (2 con còn lại thành lá ngay), và mức cuối cả 3 con đều phải là lá: $2+2+3=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a shortest path between c and z in the following weighted graph: edges a-b=4, a-c=3, b-c=2, b-d=5, c-d=3, c-e=6, d-e=1, d-f=5, e-g=5, f-g=2, f-z=7, g-z=4.|||Tìm đường đi ngắn nhất giữa c và z trong đồ thị có trọng số sau: cạnh a-b=4, a-c=3, b-c=2, b-d=5, c-d=3, c-e=6, d-e=1, d-f=5, e-g=5, f-g=2, f-z=7, g-z=4.",
          "options": [
            {
              "text": "c, b, d, e, g, z|||c, b, d, e, g, z"
            },
            {
              "text": "c, d, f, g, z|||c, d, f, g, z"
            },
            {
              "text": "c, d, e, g, z|||c, d, e, g, z"
            },
            {
              "text": "c, e, g, z|||c, e, g, z"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Dijkstra from c: dist(d)=3 (direct edge), dist(e)=3+1=4 (via d), dist(g)=4+5=9 (via e), dist(z)=9+4=13 (via g). Path c-d-e-g-z totals $3+1+5+4=13$, cheaper than c-d-f-g-z ($3+5+2+4=14$) or c-e-g-z ($6+5+4=15$).</div><div class=\"ml-vi\">Dijkstra từ c: dist(d)=3 (cạnh trực tiếp), dist(e)=3+1=4 (qua d), dist(g)=4+5=9 (qua e), dist(z)=9+4=13 (qua g). Đường c-d-e-g-z tổng $3+1+5+4=13$, rẻ hơn c-d-f-g-z ($3+5+2+4=14$) hay c-e-g-z ($6+5+4=15$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\{1,3,5,7,9,11,13,15\\}$, $B=\\{$positive odd numbers less than 15$\\}$. Which of the following statements is true?|||Cho $A=\\{1,3,5,7,9,11,13,15\\}$, $B=\\{$các số nguyên dương lẻ nhỏ hơn 15$\\}$. Phát biểu nào sau đây đúng?",
          "options": [
            {
              "text": "$A\\cap B=\\emptyset$|||$A\\cap B=\\emptyset$"
            },
            {
              "text": "$A=B$|||$A=B$"
            },
            {
              "text": "$B\\subseteq A$|||$B\\subseteq A$"
            },
            {
              "text": "$A\\subseteq B$|||$A\\subseteq B$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$B=\\{1,3,5,7,9,11,13\\}$ (15 is not less than 15, so excluded). Every element of $B$ is in $A$, so $B\\subseteq A$. But $A\\neq B$ since $15\\in A$ but $15\\notin B$, so $A\\not\\subseteq B$ and they are not disjoint either.</div><div class=\"ml-vi\">$B=\\{1,3,5,7,9,11,13\\}$ (15 không nhỏ hơn 15 nên bị loại). Mọi phần tử của $B$ đều thuộc $A$, nên $B\\subseteq A$. Nhưng $A\\neq B$ vì $15\\in A$ mà $15\\notin B$, nên $A\\not\\subseteq B$ và chúng cũng không rời nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $7^7 \\bmod 41$.|||Tìm $7^7 \\bmod 41$.",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "18|||18"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$7^2=49\\equiv8$; $7^4\\equiv8^2=64\\equiv23$; $7^7=7^4\\cdot7^2\\cdot7^1\\equiv23\\cdot8\\cdot7$. $23\\cdot8=184\\equiv184-164=20$; $20\\cdot7=140\\equiv140-123=17$.</div><div class=\"ml-vi\">$7^2=49\\equiv8$; $7^4\\equiv8^2=64\\equiv23$; $7^7=7^4\\cdot7^2\\cdot7^1\\equiv23\\cdot8\\cdot7$. $23\\cdot8=184\\equiv184-164=20$; $20\\cdot7=140\\equiv140-123=17$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The graph (a square with 4 corner vertices plus a center vertex connected to all 4 corners by diagonals, plus the square's 4 outer edges -- 8 edges total, i.e. the wheel graph $W_4$) is isomorphic to which of the following graphs? Graph 1: a square plus an extra vertex outside connected by only 2 crossing lines to 2 of the corners (5 edges). Graph 2: a square plus an internal vertex connected by only 1-2 lines near one corner (6 edges). Graph 3: a pentagon-shaped drawing where the top vertex connects to all 4 other vertices (2 directly, 2 via crossing diagonals) and the other 4 vertices form an outer 4-cycle -- 8 edges, matching $W_4$.|||Đồ thị (hình vuông 4 đỉnh góc cộng 1 đỉnh trung tâm nối với cả 4 góc bằng đường chéo, cộng 4 cạnh ngoài của hình vuông -- tổng 8 cạnh, tức đồ thị bánh xe $W_4$) đẳng cấu với đồ thị nào sau đây? Đồ thị 1: hình vuông cộng 1 đỉnh bên ngoài chỉ nối bằng 2 đường chéo cắt nhau tới 2 góc (5 cạnh). Đồ thị 2: hình vuông cộng 1 đỉnh bên trong chỉ nối bằng 1-2 đường gần một góc (6 cạnh). Đồ thị 3: hình ngũ giác trong đó đỉnh trên cùng nối với cả 4 đỉnh còn lại (2 trực tiếp, 2 qua đường chéo cắt nhau) và 4 đỉnh còn lại tạo thành một chu trình 4 cạnh ngoài -- tổng 8 cạnh, khớp với $W_4$.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The target graph is the wheel $W_4$: degree sequence (4,3,3,3,3), 8 edges. Graph 1 has only 5 edges (degree sequence 3,3,2,2,1) and Graph 2 only 6 edges (degree sequence 4,3,2,2,1) -- neither matches. Graph 3's hub vertex has degree 4 (connects to all 4 rim vertices) and the rim forms a 4-cycle, giving exactly degree sequence (4,3,3,3,3) with 8 edges -- isomorphic to $W_4$.</div><div class=\"ml-vi\">Đồ thị đề bài là bánh xe $W_4$: dãy bậc (4,3,3,3,3), 8 cạnh. Đồ thị 1 chỉ có 5 cạnh (dãy bậc 3,3,2,2,1) và đồ thị 2 chỉ có 6 cạnh (dãy bậc 4,3,2,2,1) -- không khớp. Đỉnh trục của đồ thị 3 có bậc 4 (nối với cả 4 đỉnh vành) và vành tạo thành chu trình 4 cạnh, cho đúng dãy bậc (4,3,3,3,3) với 8 cạnh -- đẳng cấu với $W_4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Encode the message \"KYAYKY\" using Huffman coding, what is the length of the encoded message?|||Mã hoá thông điệp \"KYAYKY\" bằng mã Huffman, độ dài thông điệp đã mã hoá là bao nhiêu?",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Frequencies: Y=3, K=2, A=1. Huffman merges the two smallest (A=1,K=2) first into a node of weight 3, then merges that with Y=3. So Y gets code length 1, while A and K each get code length 2. Total bits $=3\\cdot1+2\\cdot2+1\\cdot2=3+4+2=9$.</div><div class=\"ml-vi\">Tần suất: Y=3, K=2, A=1. Huffman gộp 2 nhỏ nhất (A=1,K=2) trước thành nút trọng số 3, rồi gộp với Y=3. Vậy Y có độ dài mã 1, còn A và K mỗi cái có độ dài mã 2. Tổng bit $=3\\cdot1+2\\cdot2+1\\cdot2=3+4+2=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which rules of inference are used in the following argument? \"It is cold or snowing today. If it is snowing today, I will not go out. I go out today. Therefore, it is cold but not snowing today.\"|||Quy tắc suy luận nào được dùng trong lập luận sau? \"Trời lạnh hoặc có tuyết hôm nay. Nếu có tuyết hôm nay, tôi sẽ không ra ngoài. Tôi ra ngoài hôm nay. Vậy, trời lạnh nhưng không có tuyết hôm nay.\"",
          "options": [
            {
              "text": "Modus tollens and disjunctive syllogism|||Modus tollens và tam đoạn luận rời"
            },
            {
              "text": "Modus ponens and disjunctive syllogism|||Modus ponens và tam đoạn luận rời"
            },
            {
              "text": "Modus tollens and hypothetical syllogism|||Modus tollens và tam đoạn luận giả định"
            },
            {
              "text": "Simplification and hypothetical syllogism|||Đơn giản hoá và tam đoạn luận giả định"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Let $S\\to\\neg G$ (\"snowing\"$\\to$\"not go out\"), and $G$ is given (go out today). Modus tollens on $S\\to\\neg G$ with $G$ true gives $\\neg S$. Then disjunctive syllogism on $C\\lor S$ with $\\neg S$ gives $C$. Combined: $C\\land\\neg S$.</div><div class=\"ml-vi\">Đặt $S\\to\\neg G$ (\"có tuyết\"$\\to$\"không ra ngoài\"), và $G$ cho trước (ra ngoài hôm nay). Modus tollens trên $S\\to\\neg G$ với $G$ đúng cho $\\neg S$. Rồi tam đoạn luận rời trên $C\\lor S$ với $\\neg S$ cho $C$. Kết hợp: $C\\land\\neg S$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A food shop offers 5 food items: Banh My (1 dollar), Banh Bao (1 dollar), Com Rang (2 dollars), Pho (2 dollars) and Bun Bo (3 dollars). The number of ways to spend n dollars on food there satisfies the recurrence relation $f_n=2f_{n-1}+2f_{n-2}+f_{n-3}$ ($n\\ge3$). What are the initial conditions?|||Một quán ăn có 5 món: Bánh Mỳ (1 đô), Bánh Bao (1 đô), Cơm Rang (2 đô), Phở (2 đô) và Bún Bò (3 đô). Số cách để tiêu n đô cho đồ ăn ở đó thoả hệ thức truy hồi $f_n=2f_{n-1}+2f_{n-2}+f_{n-3}$ ($n\\ge3$). Điều kiện đầu là gì?",
          "options": [
            {
              "text": "$f_0=0,f_1=2,f_2=5$|||$f_0=0,f_1=2,f_2=5$"
            },
            {
              "text": "$f_0=0,f_1=1,f_2=2$|||$f_0=0,f_1=1,f_2=2$"
            },
            {
              "text": "$f_0=0,f_1=2,f_2=2$|||$f_0=0,f_1=2,f_2=2$"
            },
            {
              "text": "$f_0=0,f_1=2,f_2=4$|||$f_0=0,f_1=2,f_2=4$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f_1=2$: choose Banh My or Banh Bao (the only \\$1 items). $f_2=5$: either 1 direct \\$2 item (Com Rang or Pho -- 2 ways) or 2 combined \\$1 items (multiset of size 2 from {Banh My, Banh Bao} -- 3 ways): $2+3=5$.</div><div class=\"ml-vi\">$f_1=2$: chọn Bánh Mỳ hoặc Bánh Bao (2 món giá 1 đô duy nhất). $f_2=5$: hoặc 1 món giá 2 đô trực tiếp (Cơm Rang hoặc Phở -- 2 cách) hoặc 2 món giá 1 đô kết hợp (đa tập cỡ 2 từ {Bánh Mỳ, Bánh Bao} -- 3 cách): $2+3=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose the correct statement about the given graph: an outer square with 4 corner vertices connected by the square's 4 sides, containing an inner 5-vertex star/pentagon pattern, where exactly two opposite outer corners each have one extra diagonal edge into the interior (making those 2 corners degree 3, odd) while the other two corners and all interior vertices have even degree.|||Chọn phát biểu đúng về đồ thị sau: hình vuông ngoài 4 đỉnh góc nối bằng 4 cạnh hình vuông, chứa bên trong một hình sao/ngũ giác 5 đỉnh, trong đó đúng hai góc ngoài đối diện nhau mỗi góc có thêm một cạnh chéo vào bên trong (khiến 2 góc đó có bậc 3, lẻ) còn 2 góc kia và mọi đỉnh bên trong đều có bậc chẵn.",
          "options": [
            {
              "text": "The graph has Euler paths|||Đồ thị có đường đi Euler"
            },
            {
              "text": "The graph does not have Euler paths|||Đồ thị không có đường đi Euler"
            },
            {
              "text": "The graph has Euler paths but not Euler circuits|||Đồ thị có đường đi Euler nhưng không có chu trình Euler"
            },
            {
              "text": "The graph has Euler circuits|||Đồ thị có chu trình Euler"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Exactly 2 vertices have odd degree (the two corners with an extra diagonal) and all others are even -- this is precisely the condition for an Euler path to exist without an Euler circuit.</div><div class=\"ml-vi\">Đúng 2 đỉnh có bậc lẻ (hai góc có thêm đường chéo) còn lại đều chẵn -- đây chính xác là điều kiện để có đường đi Euler mà không có chu trình Euler.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Insertion sort algorithm (procedure Insertionsort, standard pseudocode with outer loop i=2 to n). If input = 7, 2, 4, 3, 1, 6, 5, after running the outer loop with i = 3, the order of the elements in the list is ______|||Cho thuật toán Insertion sort (giả mã chuẩn, vòng ngoài i=2 đến n). Nếu đầu vào = 7, 2, 4, 3, 1, 6, 5, sau khi chạy vòng ngoài với i = 3, thứ tự các phần tử trong danh sách là ______",
          "options": [
            {
              "text": "2, 3, 4, 7, 1, 6, 5|||2, 3, 4, 7, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 3, 1, 6, 5|||2, 4, 7, 3, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 1, 3, 6, 5|||2, 4, 7, 1, 3, 6, 5"
            },
            {
              "text": "1, 2, 3, 4, 7, 6, 5|||1, 2, 3, 4, 7, 6, 5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">i=2: insert 2 before 7 -> [2,7,4,3,1,6,5]. i=3: insert 4 between 2 and 7 -> [2,4,7,3,1,6,5].</div><div class=\"ml-vi\">i=2: chèn 2 trước 7 -> [2,7,4,3,1,6,5]. i=3: chèn 4 giữa 2 và 7 -> [2,4,7,3,1,6,5].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a graph with vertices A,B,C,D,E,F and edges: A-B, A-D, A-C, B-D, B-C, D-C (square ABDC with both diagonals), B-F, F-E, D-E (a kite B-F-E-D attached via diagonal B-D). Which of the following is NOT a circuit in this graph?|||Cho đồ thị với các đỉnh A,B,C,D,E,F và các cạnh: A-B, A-D, A-C, B-D, B-C, D-C (hình vuông ABDC với cả 2 đường chéo), B-F, F-E, D-E (hình diều B-F-E-D gắn qua đường chéo B-D). Dãy nào sau đây KHÔNG phải là chu trình trong đồ thị này?",
          "options": [
            {
              "text": "C-D-E-F-B-A-C|||C-D-E-F-B-A-C"
            },
            {
              "text": "A-B-C-D-F-B-A|||A-B-C-D-F-B-A"
            },
            {
              "text": "B-A-D-E-F-B|||B-A-D-E-F-B"
            },
            {
              "text": "D-B-F-E-D|||D-B-F-E-D"
            },
            {
              "text": "E-F-B-A-D-E|||E-F-B-A-D-E"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Edge D-F does not exist in this graph (F only connects to B and E, not D). Option B's path A-B-C-D-F-B-A requires the edge D-F, which is missing -- so it is NOT a valid circuit. All other options only use edges that actually exist (AB,AD,AC,BD,BC,DC,BF,FE,DE).</div><div class=\"ml-vi\">Cạnh D-F không tồn tại trong đồ thị này (F chỉ nối với B và E, không nối D). Đường đi B: A-B-C-D-F-B-A cần cạnh D-F, mà cạnh này không có -- nên KHÔNG phải chu trình hợp lệ. Mọi phương án khác chỉ dùng các cạnh thực sự tồn tại (AB,AD,AC,BD,BC,DC,BF,FE,DE).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To prove that P(n) is true for all positive integers n, where P(n) is a propositional function, we can apply Mathematical Induction. What is the basis step?|||Để chứng minh P(n) đúng với mọi số nguyên dương n, với P(n) là hàm mệnh đề, ta có thể áp dụng Quy nạp toán học. Bước cơ sở là gì?",
          "options": [
            {
              "text": "Verify that P(k+1) is true for some positive integer k.|||Kiểm tra P(k+1) đúng với một số nguyên dương k nào đó."
            },
            {
              "text": "Prove that P(0) is true.|||Chứng minh P(0) đúng."
            },
            {
              "text": "Show that the conditional statement P(k)→P(k+1) is true for all positive integers k.|||Chỉ ra mệnh đề kéo theo P(k)→P(k+1) đúng với mọi số nguyên dương k."
            },
            {
              "text": "Verify that P(1) is true.|||Kiểm tra P(1) đúng."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Since n ranges over positive integers (starting at 1), the basis step verifies the base case $P(1)$; the inductive step is showing $P(k)\\to P(k+1)$.</div><div class=\"ml-vi\">Vì n chạy trên các số nguyên dương (bắt đầu từ 1), bước cơ sở là kiểm tra trường hợp cơ sở $P(1)$; bước quy nạp là chỉ ra $P(k)\\to P(k+1)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the composite function $(f\\circ g)(x) = f(g(x))$ given that $f(x)=2x$ and $g(x)=x^2$.|||Tìm hàm hợp $(f\\circ g)(x) = f(g(x))$ biết $f(x)=2x$ và $g(x)=x^2$.",
          "options": [
            {
              "text": "$2x^2$|||$2x^2$"
            },
            {
              "text": "$x^2$|||$x^2$"
            },
            {
              "text": "$4x^2$|||$4x^2$"
            },
            {
              "text": "$3x^2$|||$3x^2$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(f\\circ g)(x)=f(g(x))=f(x^2)=2\\cdot x^2=2x^2$.</div><div class=\"ml-vi\">$(f\\circ g)(x)=f(g(x))=f(x^2)=2\\cdot x^2=2x^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give a big-O estimate for the number of multiplications and additions used in the following algorithm: procedure Horner($c,a_0,a_1,\\dots,a_n$: real numbers); $y:=a_n$; for $i:=1$ to $n$: $y:=y*c+a_{n-i}$.|||Ước lượng big-O cho số phép nhân và phép cộng dùng trong thuật toán sau: procedure Horner($c,a_0,a_1,\\dots,a_n$: số thực); $y:=a_n$; for $i:=1$ to $n$: $y:=y*c+a_{n-i}$.",
          "options": [
            {
              "text": "$O(\\log n)$|||$O(\\log n)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$O(1)$|||$O(1)$"
            },
            {
              "text": "$O(\\sqrt{n})$|||$O(\\sqrt{n})$"
            },
            {
              "text": "$O(n)$|||$O(n)$"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">The loop runs exactly $n$ times, each iteration doing 1 multiplication and 1 addition -- total $n$ multiplications and $n$ additions, both $O(n)$.</div><div class=\"ml-vi\">Vòng lặp chạy đúng $n$ lần, mỗi lần thực hiện 1 phép nhân và 1 phép cộng -- tổng cộng $n$ phép nhân và $n$ phép cộng, đều là $O(n)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a=296\\text{ div }19$, $b=-125\\text{ div }19$. Find $a-b$.|||Cho $a=296\\text{ div }19$, $b=-125\\text{ div }19$. Tìm $a-b$.",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$296=19\\cdot15+11\\Rightarrow a=15$. For div/mod, remainder must be nonnegative: $-125=19\\cdot(-7)+8\\Rightarrow b=-7$. $a-b=15-(-7)=22$.</div><div class=\"ml-vi\">$296=19\\cdot15+11\\Rightarrow a=15$. Với div/mod, số dư phải không âm: $-125=19\\cdot(-7)+8\\Rightarrow b=-7$. $a-b=15-(-7)=22$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If using Prim's algorithm to find a minimum spanning tree T from the graph below (vertices A,B,C,D,E,F; edges A-B=1, A-D=4, A-E=3, B-D=4, B-E=2, D-E=4, C-E=4, C-F=5, E-F=7), which edge is added to T in the last step?|||Nếu dùng thuật toán Prim để tìm cây khung nhỏ nhất T của đồ thị sau (đỉnh A,B,C,D,E,F; cạnh A-B=1, A-D=4, A-E=3, B-D=4, B-E=2, D-E=4, C-E=4, C-F=5, E-F=7), cạnh nào được thêm vào T ở bước cuối cùng?",
          "options": [
            {
              "text": "EC|||EC"
            },
            {
              "text": "CF|||CF"
            },
            {
              "text": "ED|||ED"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "EF|||EF"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Prim from A: add A-B(1), then B-E(2), then a weight-4 edge connecting D (e.g. A-D or D-E), then C-E(4), then finally C-F(5) to include F -- the last edge added is CF.</div><div class=\"ml-vi\">Prim từ A: thêm A-B(1), rồi B-E(2), rồi một cạnh trọng số 4 nối D (vd A-D hoặc D-E), rồi C-E(4), cuối cùng C-F(5) để đưa F vào -- cạnh cuối cùng thêm vào là CF.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $f(n)=3f(n/2)+1$, $f(1)=1$. Find $f(32)$.|||Cho $f(n)=3f(n/2)+1$, $f(1)=1$. Tìm $f(32)$.",
          "options": [
            {
              "text": "364|||364"
            },
            {
              "text": "278|||278"
            },
            {
              "text": "156|||156"
            },
            {
              "text": "428|||428"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(2)=3(1)+1=4$; $f(4)=3(4)+1=13$; $f(8)=3(13)+1=40$; $f(16)=3(40)+1=121$; $f(32)=3(121)+1=364$.</div><div class=\"ml-vi\">$f(2)=3(1)+1=4$; $f(4)=3(4)+1=13$; $f(8)=3(13)+1=40$; $f(16)=3(40)+1=121$; $f(32)=3(121)+1=364$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the functions from $\\mathbb{Z}\\times\\mathbb{Z}\\to\\mathbb{Z}$ given by $f(m,n)=m+2n$, $g(m,n)=2m+2n+1$, $h(m,n)=m-n$. Which functions are onto?|||Xét các hàm từ $\\mathbb{Z}\\times\\mathbb{Z}\\to\\mathbb{Z}$ cho bởi $f(m,n)=m+2n$, $g(m,n)=2m+2n+1$, $h(m,n)=m-n$. Hàm nào là toàn ánh?",
          "options": [
            {
              "text": "Only g|||Chỉ g"
            },
            {
              "text": "Only f|||Chỉ f"
            },
            {
              "text": "f and h|||f và h"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "g and h|||g và h"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f$: for any $k$, take $m=k,n=0$ -- onto. $h$: for any $k$, take $m=k,n=0$ -- onto. $g(m,n)=2(m+n)+1$ is always odd, so it never hits any even integer -- NOT onto.</div><div class=\"ml-vi\">$f$: với mọi $k$, chọn $m=k,n=0$ -- toàn ánh. $h$: với mọi $k$, chọn $m=k,n=0$ -- toàn ánh. $g(m,n)=2(m+n)+1$ luôn lẻ, nên không bao giờ đạt được số chẵn nào -- KHÔNG phải toàn ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\{0,2,4,6,8,10\\}$, $B=\\{1,2,3,4,5,6\\}$ and $C=\\{1,2,3,4,5,7,8,9\\}$. Find $(A\\cup B)\\cap C$.|||Cho $A=\\{0,2,4,6,8,10\\}$, $B=\\{1,2,3,4,5,6\\}$ và $C=\\{1,2,3,4,5,7,8,9\\}$. Tìm $(A\\cup B)\\cap C$.",
          "options": [
            {
              "text": "{1, 2, 3, 4, 5, 6, 8}|||{1, 2, 3, 4, 5, 6, 8}"
            },
            {
              "text": "{1, 2, 3, 4, 5}|||{1, 2, 3, 4, 5}"
            },
            {
              "text": "{0, 1, 2, 3, 4, 5, 6}|||{0, 1, 2, 3, 4, 5, 6}"
            },
            {
              "text": "{1, 2, 3, 4, 5, 8}|||{1, 2, 3, 4, 5, 8}"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$A\\cup B=\\{0,1,2,3,4,5,6,8,10\\}$. Intersecting with $C=\\{1,2,3,4,5,7,8,9\\}$: common elements are $1,2,3,4,5,8$ (0,6,10 are not in $C$).</div><div class=\"ml-vi\">$A\\cup B=\\{0,1,2,3,4,5,6,8,10\\}$. Giao với $C=\\{1,2,3,4,5,7,8,9\\}$: phần tử chung là $1,2,3,4,5,8$ (0,6,10 không thuộc $C$).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D3",
      "source": "REAL",
      "sortOrder": 203,
      "title": "Final Exam — Đề 3|||Thi cuối kỳ — Đề 3",
      "description": "MAD101 Final Exam, Đề 3 (50 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 3 (50 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 100,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $p,q$ and $r$ be propositions such that $p\\equiv T$, $q\\equiv F$ and $r\\equiv T$. Choose the correct statement. (i) $q\\to(p\\land r)\\equiv F$ and $q\\lor r\\equiv T$ (ii) $(p\\lor r)\\to q\\equiv T$ and $p\\land r\\equiv T$ (iii) $(p\\oplus q)\\oplus r\\equiv F$ and $p\\to q\\equiv F$|||Cho $p,q,r$ là các mệnh đề với $p\\equiv T$, $q\\equiv F$, $r\\equiv T$. Chọn phát biểu đúng. (i) $q\\to(p\\land r)\\equiv F$ và $q\\lor r\\equiv T$ (ii) $(p\\lor r)\\to q\\equiv T$ và $p\\land r\\equiv T$ (iii) $(p\\oplus q)\\oplus r\\equiv F$ và $p\\to q\\equiv F$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) is wrong: $q=F$ makes $q\\to(p\\land r)=T$, not $F$. (ii) is wrong: $(p\\lor r)=T$, so $(p\\lor r)\\to q=T\\to F=F$, not $T$. (iii): $p\\oplus q=T\\oplus F=T$, then $T\\oplus r=T\\oplus T=F$ -- matches. $p\\to q=T\\to F=F$ -- matches. So (iii) is correct.</div><div class=\"ml-vi\">(i) sai: $q=F$ nên $q\\to(p\\land r)=T$, không phải $F$. (ii) sai: $(p\\lor r)=T$, nên $(p\\lor r)\\to q=T\\to F=F$, không phải $T$. (iii): $p\\oplus q=T\\oplus F=T$, rồi $T\\oplus r=T\\oplus T=F$ -- khớp. $p\\to q=T\\to F=F$ -- khớp. Vậy (iii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the propositions p=\"You have the flu\", q=\"You miss the final examination\", r=\"You pass this course\". Express: \"You don't miss the final examination and you don't have the flu but you still did not pass this class.\" (i) $(\\neg p\\land\\neg q)\\to\\neg r$ (ii) $(\\neg p\\lor\\neg q)\\land\\neg r$ (iii) $(p\\land\\neg q)\\to r$ (iv) $(\\neg p\\land\\neg q)\\land\\neg r$|||Cho các mệnh đề p=\"Bạn bị cúm\", q=\"Bạn bỏ lỡ kỳ thi cuối kỳ\", r=\"Bạn đậu môn này\". Diễn đạt: \"Bạn không bỏ lỡ kỳ thi cuối kỳ và bạn không bị cúm nhưng bạn vẫn không đậu môn này.\" (i) $(\\neg p\\land\\neg q)\\to\\neg r$ (ii) $(\\neg p\\lor\\neg q)\\land\\neg r$ (iii) $(p\\land\\neg q)\\to r$ (iv) $(\\neg p\\land\\neg q)\\land\\neg r$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"don't miss final\" = $\\neg q$, \"don't have flu\" = $\\neg p$, \"did not pass\" = $\\neg r$, joined by \"and\"/\"but\" (both conjunctions): $\\neg p\\land\\neg q\\land\\neg r$, exactly option (iv).</div><div class=\"ml-vi\">\"không bỏ lỡ cuối kỳ\" = $\\neg q$, \"không bị cúm\" = $\\neg p$, \"vẫn không đậu\" = $\\neg r$, nối bằng \"và\"/\"nhưng\" (đều là hội): $\\neg p\\land\\neg q\\land\\neg r$, đúng là đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a proposition that is logically equivalent to $(p\\to q)\\lor(p\\to\\neg q)$.|||Tìm mệnh đề tương đương logic với $(p\\to q)\\lor(p\\to\\neg q)$.",
          "options": [
            {
              "text": "q|||q"
            },
            {
              "text": "F|||F"
            },
            {
              "text": "p|||p"
            },
            {
              "text": "T|||T"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$(p\\to q)\\equiv\\neg p\\lor q$ and $(p\\to\\neg q)\\equiv\\neg p\\lor\\neg q$. Their disjunction: $\\neg p\\lor q\\lor\\neg p\\lor\\neg q=\\neg p\\lor(q\\lor\\neg q)=\\neg p\\lor T=T$, a tautology.</div><div class=\"ml-vi\">$(p\\to q)\\equiv\\neg p\\lor q$ và $(p\\to\\neg q)\\equiv\\neg p\\lor\\neg q$. Hội của chúng: $\\neg p\\lor q\\lor\\neg p\\lor\\neg q=\\neg p\\lor(q\\lor\\neg q)=\\neg p\\lor T=T$, một hằng đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $C(x)$=\"x is a student in your school\", $P(x)$=\"x plays badminton\", $J(x)$=\"x knows the computer language Java\", domain = all people. Express: \"Every student at your school either plays badminton or knows Java.\" (i) $\\exists x(C(x)\\land(P(x)\\lor J(x)))$ (ii) $\\exists x(C(x)\\land(P(x)\\land J(x)))$ (iii) $\\forall x(C(x)\\to(P(x)\\land J(x)))$|||Cho $C(x)$=\"x là sinh viên trong trường bạn\", $P(x)$=\"x chơi cầu lông\", $J(x)$=\"x biết ngôn ngữ Java\", miền là mọi người. Diễn đạt: \"Mọi sinh viên trong trường bạn hoặc chơi cầu lông hoặc biết Java.\" (i) $\\exists x(C(x)\\land(P(x)\\lor J(x)))$ (ii) $\\exists x(C(x)\\land(P(x)\\land J(x)))$ (iii) $\\forall x(C(x)\\to(P(x)\\land J(x)))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The correct translation is $\\forall x(C(x)\\to(P(x)\\lor J(x)))$ -- universal quantifier with implication to a disjunction. None of (i)-(iii) match this: (i) uses $\\exists$, (ii) uses $\\exists$ and $\\land$, (iii) uses $\\forall\\to$ but with $\\land$ instead of $\\lor$.</div><div class=\"ml-vi\">Diễn đạt đúng là $\\forall x(C(x)\\to(P(x)\\lor J(x)))$ -- lượng từ toàn thể với kéo theo tới một tuyển. Không đáp án (i)-(iii) nào khớp: (i) dùng $\\exists$, (ii) dùng $\\exists$ và $\\land$, (iii) dùng $\\forall\\to$ nhưng với $\\land$ thay vì $\\lor$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be a propositional function on the domain $\\{-2,-1,0,1,2\\}$. Which proposition is logically equivalent to $\\exists x(\\neg P(x))\\land\\forall x[(x>-1)\\to P(x)]$? (i) $\\neg P(-2)\\land[\\neg P(-1)\\lor P(0)\\lor P(1)\\lor P(2)]$ (ii) $\\neg P(-2)\\land\\neg P(-1)\\land[P(0)\\lor P(1)\\lor P(2)]$ (iii) $\\neg P(-2)\\land[\\neg P(-1)\\land P(0)\\land P(1)\\land P(2)]$ (iv) $[\\neg P(-2)\\lor\\neg P(-1)]\\land P(0)\\land P(1)\\land P(2)$|||Cho $P(x)$ là hàm mệnh đề trên miền $\\{-2,-1,0,1,2\\}$. Mệnh đề nào tương đương logic với $\\exists x(\\neg P(x))\\land\\forall x[(x>-1)\\to P(x)]$? (i) $\\neg P(-2)\\land[\\neg P(-1)\\lor P(0)\\lor P(1)\\lor P(2)]$ (ii) $\\neg P(-2)\\land\\neg P(-1)\\land[P(0)\\lor P(1)\\lor P(2)]$ (iii) $\\neg P(-2)\\land[\\neg P(-1)\\land P(0)\\land P(1)\\land P(2)]$ (iv) $[\\neg P(-2)\\lor\\neg P(-1)]\\land P(0)\\land P(1)\\land P(2)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\forall x[(x>-1)\\to P(x)]$ is vacuously true for $x=-2,-1$ (since $x>-1$ is false there) and requires $P(0)\\land P(1)\\land P(2)$ for the rest. With $P(0),P(1),P(2)$ all true, $\\exists x(\\neg P(x))$ reduces to $\\neg P(-2)\\lor\\neg P(-1)$ (the other disjuncts are false). Overall: $[\\neg P(-2)\\lor\\neg P(-1)]\\land P(0)\\land P(1)\\land P(2)$, exactly (iv).</div><div class=\"ml-vi\">$\\forall x[(x>-1)\\to P(x)]$ đúng hiển nhiên với $x=-2,-1$ (vì $x>-1$ sai ở đó) và đòi hỏi $P(0)\\land P(1)\\land P(2)$ cho phần còn lại. Với $P(0),P(1),P(2)$ đều đúng, $\\exists x(\\neg P(x))$ rút gọn còn $\\neg P(-2)\\lor\\neg P(-1)$ (các tuyển khác sai). Tổng thể: $[\\neg P(-2)\\lor\\neg P(-1)]\\land P(0)\\land P(1)\\land P(2)$, đúng là (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x,y)$=\"x and y are real numbers such that $x+2y=5$\". Which of the following propositions is FALSE? (i) $\\exists y\\,P(2,y)$ (ii) $\\forall x\\exists y\\,P(x,y)$ (iii) $\\forall y\\exists x\\,P(x,y)$ (iv) $\\forall x\\forall y\\,P(x,y)$|||Cho $P(x,y)$=\"x và y là số thực sao cho $x+2y=5$\". Mệnh đề nào sau đây là SAI? (i) $\\exists y\\,P(2,y)$ (ii) $\\forall x\\exists y\\,P(x,y)$ (iii) $\\forall y\\exists x\\,P(x,y)$ (iv) $\\forall x\\forall y\\,P(x,y)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i): $y=1.5$ satisfies $2+2y=5$ -- true. (ii): for any $x$, $y=(5-x)/2$ works -- true. (iii): for any $y$, $x=5-2y$ works -- true. (iv) claims ALL pairs $(x,y)$ satisfy $x+2y=5$, which is false (e.g. $x=0,y=0$ fails).</div><div class=\"ml-vi\">(i): $y=1.5$ thoả $2+2y=5$ -- đúng. (ii): với mọi $x$, $y=(5-x)/2$ luôn có -- đúng. (iii): với mọi $y$, $x=5-2y$ luôn có -- đúng. (iv) khẳng định MỌI cặp $(x,y)$ đều thoả $x+2y=5$, sai (vd $x=0,y=0$ không thoả).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the proposition $\\exists x\\forall y(P(x,y)\\to Q(x,y))$.|||Tìm phủ định của mệnh đề $\\exists x\\forall y(P(x,y)\\to Q(x,y))$.",
          "options": [
            {
              "text": "(i) $\\forall x\\exists y(\\neg P(x,y)\\land Q(x,y))$|||(i) $\\forall x\\exists y(\\neg P(x,y)\\land Q(x,y))$"
            },
            {
              "text": "(ii) $\\forall x\\exists y(P(x,y)\\land\\neg Q(x,y))$|||(ii) $\\forall x\\exists y(P(x,y)\\land\\neg Q(x,y))$"
            },
            {
              "text": "(iv) $\\exists x\\forall y(P(x,y)\\land\\neg Q(x,y))$|||(iv) $\\exists x\\forall y(P(x,y)\\land\\neg Q(x,y))$"
            },
            {
              "text": "(iii) $\\exists x\\forall y(\\neg P(x,y)\\land Q(x,y))$|||(iii) $\\exists x\\forall y(\\neg P(x,y)\\land Q(x,y))$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\neg\\exists x\\forall y(P\\to Q)=\\forall x\\neg\\forall y(P\\to Q)=\\forall x\\exists y\\neg(P\\to Q)=\\forall x\\exists y(P\\land\\neg Q)$, exactly option (ii).</div><div class=\"ml-vi\">$\\neg\\exists x\\forall y(P\\to Q)=\\forall x\\neg\\forall y(P\\to Q)=\\forall x\\exists y\\neg(P\\to Q)=\\forall x\\exists y(P\\land\\neg Q)$, đúng là đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the premises: If I go to bed early, I can wake up early tomorrow. I can go for a walk if I wake up early. I stayed up late tonight. Which conclusion can be drawn from these statements?|||Cho các tiền đề: Nếu tôi đi ngủ sớm, tôi có thể thức dậy sớm vào ngày mai. Tôi có thể đi bộ nếu tôi thức dậy sớm. Tôi đã thức khuya tối nay. Kết luận nào có thể rút ra từ các phát biểu này?",
          "options": [
            {
              "text": "I will go for a walk tomorrow|||Tôi sẽ đi bộ vào ngày mai"
            },
            {
              "text": "I will not go for a walk tomorrow|||Tôi sẽ không đi bộ vào ngày mai"
            },
            {
              "text": "I will wake up early tomorrow|||Tôi sẽ thức dậy sớm vào ngày mai"
            },
            {
              "text": "I will not go to the class tomorrow|||Tôi sẽ không đi học vào ngày mai"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Let bed=\"go to bed early\", wake=\"wake up early\", walk=\"go for a walk\". Premises: bed$\\to$wake, wake$\\to$walk, $\\neg$bed (stayed up late = did not go to bed early). Denying the antecedent ($\\neg$bed) does NOT let us conclude anything about wake or walk (that would be the fallacy of denying the antecedent) -- no valid conclusion follows.</div><div class=\"ml-vi\">Đặt bed=\"đi ngủ sớm\", wake=\"thức dậy sớm\", walk=\"đi bộ\". Tiền đề: bed$\\to$wake, wake$\\to$walk, $\\neg$bed (thức khuya = không đi ngủ sớm). Phủ định tiền đề ($\\neg$bed) KHÔNG cho phép suy ra gì về wake hay walk (đó là ngụy biện phủ định tiền đề) -- không có kết luận hợp lệ nào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\{a,b,c\\}$ and $B=\\{x,y,z,w\\}$. Choose correct statements. (i) $A\\times B=B\\times A$ (ii) $\\emptyset\\in A$ (iii) $|A\\times B|=|A|\\times|B|$|||Cho $A=\\{a,b,c\\}$ và $B=\\{x,y,z,w\\}$. Chọn phát biểu đúng. (i) $A\\times B=B\\times A$ (ii) $\\emptyset\\in A$ (iii) $|A\\times B|=|A|\\times|B|$",
          "options": [
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) is false: $A\\times B$ contains pairs like $(a,x)$ while $B\\times A$ contains $(x,a)$ -- these sets of ordered pairs differ since $A\\neq B$. (ii) is false: $A$'s elements are $a,b,c$, none of which is $\\emptyset$. (iii) is true: this is the standard cardinality rule for Cartesian product, $|A\\times B|=3\\times4=12$.</div><div class=\"ml-vi\">(i) sai: $A\\times B$ chứa cặp như $(a,x)$ còn $B\\times A$ chứa $(x,a)$ -- hai tập cặp có thứ tự này khác nhau vì $A\\neq B$. (ii) sai: các phần tử của $A$ là $a,b,c$, không phần tử nào là $\\emptyset$. (iii) đúng: đây là quy tắc lực lượng chuẩn của tích Descartes, $|A\\times B|=3\\times4=12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let A, B be sets. Assume that $A\\times B=\\emptyset$. Choose the best answer.|||Cho A, B là các tập hợp. Giả sử $A\\times B=\\emptyset$. Chọn đáp án tốt nhất.",
          "options": [
            {
              "text": "(iv) $(A=\\emptyset)\\lor(B=\\emptyset)$|||(iv) $(A=\\emptyset)\\lor(B=\\emptyset)$"
            },
            {
              "text": "(i) $A=\\emptyset$|||(i) $A=\\emptyset$"
            },
            {
              "text": "(iii) $(A=\\emptyset)\\oplus(B=\\emptyset)$|||(iii) $(A=\\emptyset)\\oplus(B=\\emptyset)$"
            },
            {
              "text": "(ii) $(A=\\emptyset)\\land(B=\\emptyset)$|||(ii) $(A=\\emptyset)\\land(B=\\emptyset)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$A\\times B=\\emptyset$ if and only if $A=\\emptyset$ or $B=\\emptyset$ (if both were nonempty, picking one element from each would give a pair in $A\\times B$). This is exactly $(A=\\emptyset)\\lor(B=\\emptyset)$, option (iv). Note $A=\\emptyset$ alone (i) is too strong (B could be nonempty), and both being needed (ii) is also too strong (only one needs to be empty).</div><div class=\"ml-vi\">$A\\times B=\\emptyset$ khi và chỉ khi $A=\\emptyset$ hoặc $B=\\emptyset$ (nếu cả hai đều khác rỗng, lấy một phần tử từ mỗi tập sẽ cho một cặp thuộc $A\\times B$). Đây đúng là $(A=\\emptyset)\\lor(B=\\emptyset)$, đáp án (iv). Lưu ý chỉ $A=\\emptyset$ (i) là quá mạnh (B có thể khác rỗng), và cần cả hai (ii) cũng quá mạnh (chỉ cần một tập rỗng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The symmetric difference of two sets A and B, denoted by $A\\oplus B$, is the set of all elements that either belong to A or to B, but not both. Suppose that $A\\oplus B=A$. Choose the best answer:|||Hiệu đối xứng của hai tập A và B, ký hiệu $A\\oplus B$, là tập các phần tử thuộc A hoặc thuộc B, nhưng không thuộc cả hai. Giả sử $A\\oplus B=A$. Chọn đáp án tốt nhất:",
          "options": [
            {
              "text": "(i) $A=B$|||(i) $A=B$"
            },
            {
              "text": "(ii) $B\\subseteq A$|||(ii) $B\\subseteq A$"
            },
            {
              "text": "(iii) $A\\subseteq B$|||(iii) $A\\subseteq B$"
            },
            {
              "text": "(iv) $B=\\emptyset$|||(iv) $B=\\emptyset$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">If any element of $B$ were outside $A$, it would land in $A\\oplus B$ but not in $A$, contradiction -- so $B\\subseteq A$, making $A\\oplus B=A\\setminus B$. Requiring $A\\setminus B=A$ forces $A\\cap B=\\emptyset$. Combined with $B\\subseteq A$, this forces $B=\\emptyset$ (check: $A\\oplus\\emptyset=A$, always true). This is the exact necessary and sufficient condition, tighter than just $B\\subseteq A$.</div><div class=\"ml-vi\">Nếu có phần tử nào của $B$ nằm ngoài $A$, nó sẽ thuộc $A\\oplus B$ nhưng không thuộc $A$, mâu thuẫn -- vậy $B\\subseteq A$, khi đó $A\\oplus B=A\\setminus B$. Yêu cầu $A\\setminus B=A$ buộc $A\\cap B=\\emptyset$. Kết hợp với $B\\subseteq A$, điều này buộc $B=\\emptyset$ (kiểm: $A\\oplus\\emptyset=A$, luôn đúng). Đây là điều kiện cần và đủ chính xác, chặt hơn chỉ $B\\subseteq A$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute $\\left\\lceil\\frac{3}{2}+\\left\\lfloor\\frac{1}{2}\\cdot\\left\\lfloor\\frac{5}{2}\\right\\rfloor\\right\\rfloor+\\left\\lfloor3-\\frac{7}{8}\\right\\rfloor\\right\\rceil$|||Tính $\\left\\lceil\\frac{3}{2}+\\left\\lfloor\\frac{1}{2}\\cdot\\left\\lfloor\\frac{5}{2}\\right\\rfloor\\right\\rfloor+\\left\\lfloor3-\\frac{7}{8}\\right\\rfloor\\right\\rceil$",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\lfloor5/2\\rfloor=2$, so $\\lfloor(1/2)\\cdot2\\rfloor=\\lfloor1\\rfloor=1$. Then $3/2+1=2.5$. Also $\\lfloor3-7/8\\rfloor=\\lfloor2.125\\rfloor=2$. Sum: $2.5+2=4.5$, and $\\lceil4.5\\rceil=5$.</div><div class=\"ml-vi\">$\\lfloor5/2\\rfloor=2$, nên $\\lfloor(1/2)\\cdot2\\rfloor=\\lfloor1\\rfloor=1$. Rồi $3/2+1=2.5$. Cũng $\\lfloor3-7/8\\rfloor=\\lfloor2.125\\rfloor=2$. Tổng: $2.5+2=4.5$, và $\\lceil4.5\\rceil=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=\\lfloor x/2\\rfloor$, $g(x)=2\\lceil x\\rceil$. Find $g\\circ f(1.75)$.|||Cho $f(x)=\\lfloor x/2\\rfloor$, $g(x)=2\\lceil x\\rceil$. Tìm $g\\circ f(1.75)$.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1.75)=\\lfloor1.75/2\\rfloor=\\lfloor0.875\\rfloor=0$. Then $g(0)=2\\lceil0\\rceil=2\\cdot0=0$.</div><div class=\"ml-vi\">$f(1.75)=\\lfloor1.75/2\\rfloor=\\lfloor0.875\\rfloor=0$. Rồi $g(0)=2\\lceil0\\rceil=2\\cdot0=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the sum $\\sum_{j\\in S}(2j-1)$, where $S=\\{2,4,6,8,10\\}$.|||Tìm giá trị của tổng $\\sum_{j\\in S}(2j-1)$, với $S=\\{2,4,6,8,10\\}$.",
          "options": [
            {
              "text": "40|||40"
            },
            {
              "text": "45|||45"
            },
            {
              "text": "50|||50"
            },
            {
              "text": "55|||55"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$j=2$: 3; $j=4$: 7; $j=6$: 11; $j=8$: 15; $j=10$: 19. Sum $=3+7+11+15+19=55$.</div><div class=\"ml-vi\">$j=2$: 3; $j=4$: 7; $j=6$: 11; $j=8$: 15; $j=10$: 19. Tổng $=3+7+11+15+19=55$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm to find the maximum element of a list: Max:=$a_1$; for i:=2 to n do if Max<$a_i$ then Max:=$a_i$. If the input is the sequence 4, 1, 5, 2, 3, 9, 7, then all the values of the variable Max are ___.|||Cho thuật toán tìm phần tử lớn nhất của danh sách: Max:=$a_1$; for i:=2 to n do if Max<$a_i$ then Max:=$a_i$. Nếu đầu vào là dãy 4, 1, 5, 2, 3, 9, 7, thì tất cả các giá trị mà biến Max nhận là ___.",
          "options": [
            {
              "text": "4, 1, 5, 9|||4, 1, 5, 9"
            },
            {
              "text": "4, 5, 9, 7|||4, 5, 9, 7"
            },
            {
              "text": "1, 4, 5, 2, 9, 7|||1, 4, 5, 2, 9, 7"
            },
            {
              "text": "4, 5, 9|||4, 5, 9"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Max starts at 4. $a_2=1$: $4<1$? No. $a_3=5$: $4<5$? Yes, Max:=5. $a_4=2$, $a_5=3$: no updates ($5<2$, $5<3$ both false). $a_6=9$: $5<9$? Yes, Max:=9. $a_7=7$: $9<7$? No. So Max takes values 4, 5, 9 in that order.</div><div class=\"ml-vi\">Max bắt đầu là 4. $a_2=1$: $4<1$? Không. $a_3=5$: $4<5$? Có, Max:=5. $a_4=2$, $a_5=3$: không đổi ($5<2$, $5<3$ đều sai). $a_6=9$: $5<9$? Có, Max:=9. $a_7=7$: $9<7$? Không. Vậy Max nhận các giá trị 4, 5, 9 theo thứ tự đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Greedy Change-Making algorithm to make a change for 34 cents using quarters, dimes and pennies (1 quarter = 25 cents, 1 dime = 10 cents, 1 penny = 1 cent). What is the total number of coins used?|||Dùng thuật toán tham lam đổi tiền cho 34 xu bằng đồng quarter, dime và penny (1 quarter = 25 xu, 1 dime = 10 xu, 1 penny = 1 xu). Tổng số đồng xu dùng là bao nhiêu?",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Greedy takes 1 quarter (25), leaving 9 cents. 9 < 10, so 0 dimes, then 9 pennies (9 cents). Total coins: $1+0+9=10$.</div><div class=\"ml-vi\">Tham lam lấy 1 quarter (25), còn lại 9 xu. 9 < 10, nên 0 dime, rồi 9 penny (9 xu). Tổng số đồng: $1+0+9=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function below is NOT $O(n^4)$? (i) $f(n)=1+2^3+3^3+\\dots+(n+2)^3$ (ii) $f(n)=(n+4)^5-(n-2)^5$ (iii) $f(n)=(n\\log n-1)^4$|||Hàm nào sau đây KHÔNG là $O(n^4)$? (i) $f(n)=1+2^3+3^3+\\dots+(n+2)^3$ (ii) $f(n)=(n+4)^5-(n-2)^5$ (iii) $f(n)=(n\\log n-1)^4$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i): sum of cubes up to $(n+2)$ is $\\approx((n+2)(n+3)/2)^2=O(n^4)$. (ii): the $n^5$ terms of $(n+4)^5$ and $(n-2)^5$ cancel, leaving a degree-4 leading term $30n^4+\\dots=O(n^4)$. (iii): $(n\\log n-1)^4\\approx n^4(\\log n)^4$, which grows faster than any constant multiple of $n^4$ -- NOT $O(n^4)$.</div><div class=\"ml-vi\">(i): tổng lập phương đến $(n+2)$ xấp xỉ $((n+2)(n+3)/2)^2=O(n^4)$. (ii): các số hạng $n^5$ của $(n+4)^5$ và $(n-2)^5$ triệt tiêu nhau, còn lại số hạng bậc 4 dẫn đầu $30n^4+\\dots=O(n^4)$. (iii): $(n\\log n-1)^4\\approx n^4(\\log n)^4$, tăng nhanh hơn mọi bội hằng số của $n^4$ -- KHÔNG là $O(n^4)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give the best big-O estimate for the number of operations (addition or multiplication) used in this algorithm segment: for i:=1 to n: k:=1; while k<n+1: k:=k*2; end; end.|||Cho ước lượng big-O tốt nhất cho số phép toán (cộng hoặc nhân) dùng trong đoạn thuật toán: for i:=1 to n: k:=1; while k<n+1: k:=k*2; end; end.",
          "options": [
            {
              "text": "$O(n)$|||$O(n)$"
            },
            {
              "text": "$O(n\\log n)$|||$O(n\\log n)$"
            },
            {
              "text": "$O(n^2)$|||$O(n^2)$"
            },
            {
              "text": "$O(n^4)$|||$O(n^4)$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The inner while-loop doubles $k$ from 1 until it exceeds $n$, taking about $\\log_2 n$ multiplications. The outer for-loop runs this $n$ times, giving total $O(n\\log n)$ operations.</div><div class=\"ml-vi\">Vòng while bên trong nhân đôi $k$ từ 1 cho đến khi vượt quá $n$, mất khoảng $\\log_2 n$ phép nhân. Vòng for bên ngoài lặp lại $n$ lần, cho tổng $O(n\\log n)$ phép toán.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{x_n\\}$ be a sequence of pseudorandom numbers such that $x_{n+1}=3x_n\\bmod11$ for $n>0$. Suppose $x_3=7$. Find $x_2$ and $x_4$.|||Cho $\\{x_n\\}$ là dãy số giả ngẫu nhiên với $x_{n+1}=3x_n\\bmod11$ với $n>0$. Giả sử $x_3=7$. Tìm $x_2$ và $x_4$.",
          "options": [
            {
              "text": "6 and 10|||6 và 10"
            },
            {
              "text": "6 and 21|||6 và 21"
            },
            {
              "text": "2 and 10|||2 và 10"
            },
            {
              "text": "3 and 10|||3 và 10"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$x_4=3\\cdot7\\bmod11=21\\bmod11=10$. For $x_2$: solve $3x_2\\equiv7\\pmod{11}$; the inverse of 3 mod 11 is 4 (since $3\\cdot4=12\\equiv1$), so $x_2\\equiv4\\cdot7=28\\equiv6\\pmod{11}$. So $x_2=6$, $x_4=10$.</div><div class=\"ml-vi\">$x_4=3\\cdot7\\bmod11=21\\bmod11=10$. Với $x_2$: giải $3x_2\\equiv7\\pmod{11}$; nghịch đảo của 3 theo mod 11 là 4 (vì $3\\cdot4=12\\equiv1$), nên $x_2\\equiv4\\cdot7=28\\equiv6\\pmod{11}$. Vậy $x_2=6$, $x_4=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A pseudorandom number sequence is generated as follows: $x_0=2$, $x_n=(3x_{n-1}+2)\\bmod11$. Find $x_3$.|||Một dãy số giả ngẫu nhiên được sinh như sau: $x_0=2$, $x_n=(3x_{n-1}+2)\\bmod11$. Tìm $x_3$.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$x_1=(3\\cdot2+2)\\bmod11=8$. $x_2=(3\\cdot8+2)\\bmod11=26\\bmod11=4$. $x_3=(3\\cdot4+2)\\bmod11=14\\bmod11=3$.</div><div class=\"ml-vi\">$x_1=(3\\cdot2+2)\\bmod11=8$. $x_2=(3\\cdot8+2)\\bmod11=26\\bmod11=4$. $x_3=(3\\cdot4+2)\\bmod11=14\\bmod11=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers less than 15 are relatively prime to 15?|||Có bao nhiêu số nguyên dương nhỏ hơn 15 nguyên tố cùng nhau với 15?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is Euler's totient $\\varphi(15)=\\varphi(3)\\cdot\\varphi(5)=2\\cdot4=8$ (since $15=3\\cdot5$, distinct primes).</div><div class=\"ml-vi\">Đây là hàm Euler $\\varphi(15)=\\varphi(3)\\cdot\\varphi(5)=2\\cdot4=8$ (vì $15=3\\cdot5$, hai số nguyên tố khác nhau).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the exponent of 2 in the prime factorization of $20!$.|||Tìm số mũ của 2 trong phân tích thừa số nguyên tố của $20!$.",
          "options": [
            {
              "text": "18|||18"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "22|||22"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Legendre's formula: $\\lfloor20/2\\rfloor+\\lfloor20/4\\rfloor+\\lfloor20/8\\rfloor+\\lfloor20/16\\rfloor=10+5+2+1=18$.</div><div class=\"ml-vi\">Công thức Legendre: $\\lfloor20/2\\rfloor+\\lfloor20/4\\rfloor+\\lfloor20/8\\rfloor+\\lfloor20/16\\rfloor=10+5+2+1=18$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the octal expansion of $(11011111011)_2$.|||Tìm khai triển cơ số 8 của $(11011111011)_2$.",
          "options": [
            {
              "text": "(i) $(6751)_8$|||(i) $(6751)_8$"
            },
            {
              "text": "(ii) $(6733)_8$|||(ii) $(6733)_8$"
            },
            {
              "text": "(iii) $(3363)_8$|||(iii) $(3363)_8$"
            },
            {
              "text": "(iv) $(3373)_8$|||(iv) $(3373)_8$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Pad to 12 bits: $011\\,011\\,111\\,011$. Groups of 3: $011=3$, $011=3$, $111=7$, $011=3$, giving $(3373)_8$.</div><div class=\"ml-vi\">Đệm thành 12 bit: $011\\,011\\,111\\,011$. Nhóm 3 bit: $011=3$, $011=3$, $111=7$, $011=3$, cho $(3373)_8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $11^5\\bmod101$.|||Tìm $11^5\\bmod101$.",
          "options": [
            {
              "text": "57|||57"
            },
            {
              "text": "58|||58"
            },
            {
              "text": "59|||59"
            },
            {
              "text": "60|||60"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$11^2=121\\equiv20\\pmod{101}$. $11^4\\equiv20^2=400\\equiv400-303=97\\pmod{101}$. $11^5\\equiv97\\cdot11=1067\\equiv1067-1010=57\\pmod{101}$.</div><div class=\"ml-vi\">$11^2=121\\equiv20\\pmod{101}$. $11^4\\equiv20^2=400\\equiv400-303=97\\pmod{101}$. $11^5\\equiv97\\cdot11=1067\\equiv1067-1010=57\\pmod{101}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the correct order of a proof by induction of \"Prove that for all positive integers n&gt;2 we have $2^n&gt;n+3$\": 1. Therefore, for all positive integers $n>2$ we have $2^n>n+3$. 2. For $n=3$ we have $2^3=8>3+3=6$. 3. Indeed, we have $2^{k+1}=2\\cdot2^k>2(k+3)$ by the induction hypothesis. For $k>2$ then $2(k+3)>k+4$. Then $2^{k+1}>k+4$. 4. Assume the inequality is true for some $k>2$. We will show that $2^{k+1}>k+4$.|||Tìm thứ tự đúng của chứng minh quy nạp cho \"Chứng minh với mọi số nguyên dương n&gt;2 ta có $2^n&gt;n+3$\": 1. Vậy, với mọi số nguyên dương $n>2$ ta có $2^n>n+3$. 2. Với $n=3$ ta có $2^3=8>3+3=6$. 3. Thật vậy, $2^{k+1}=2\\cdot2^k>2(k+3)$ theo giả thiết quy nạp. Với $k>2$ thì $2(k+3)>k+4$. Vậy $2^{k+1}>k+4$. 4. Giả sử bất đẳng thức đúng với $k>2$ nào đó. Ta sẽ chỉ ra $2^{k+1}>k+4$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1, 3, 2, 4|||1, 3, 2, 4"
            },
            {
              "text": "4, 3, 2, 1|||4, 3, 2, 1"
            },
            {
              "text": "1, 2, 3, 4|||1, 2, 3, 4"
            },
            {
              "text": "2, 4, 3, 1|||2, 4, 3, 1"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Standard induction structure: basis step (2: $n=3$ case) $\\to$ state induction hypothesis (4: assume for $k$, will show for $k+1$) $\\to$ inductive proof (3: derive $2^{k+1}>k+4$) $\\to$ conclusion (1: therefore true for all $n>2$). Order: 2, 4, 3, 1.</div><div class=\"ml-vi\">Cấu trúc quy nạp chuẩn: bước cơ sở (2: trường hợp $n=3$) $\\to$ nêu giả thiết quy nạp (4: giả sử đúng với $k$, sẽ chỉ ra với $k+1$) $\\to$ chứng minh quy nạp (3: suy ra $2^{k+1}>k+4$) $\\to$ kết luận (1: vậy đúng với mọi $n>2$). Thứ tự: 2, 4, 3, 1.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a recursive definition for the set of all integers divisible by 3. (i) $3,-3\\in S$, and if $a\\in S$ then $3a\\in S$ (ii) $3\\in S$, and if $a,b\\in S$ then $a-b\\in S$ (iii) $3\\in S$, and if $a,b\\in S$ then $a+b\\in S$ (iv) $3\\in S$, and if $a\\in S$ then $3a\\in S$|||Tìm định nghĩa đệ quy cho tập tất cả số nguyên chia hết cho 3. (i) $3,-3\\in S$, và nếu $a\\in S$ thì $3a\\in S$ (ii) $3\\in S$, và nếu $a,b\\in S$ thì $a-b\\in S$ (iii) $3\\in S$, và nếu $a,b\\in S$ thì $a+b\\in S$ (iv) $3\\in S$, và nếu $a\\in S$ thì $3a\\in S$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) and (iv) only produce powers of 3 times $\\pm3$ (e.g. 9, 27, ...), missing 6. (iii) only produces positive multiples of 3 (3, 6, 9, ...), missing negatives. (ii): starting from $\\{3\\}$ and closing under subtraction generates the full subgroup of multiples of 3 -- $3-3=0$, $0-3=-3$, $3-(-3)=6$, $-3-3=-6$, $6-3=3$... eventually all multiples of 3, both signs.</div><div class=\"ml-vi\">(i) và (iv) chỉ sinh ra lũy thừa của 3 nhân $\\pm3$ (vd 9, 27, ...), thiếu 6. (iii) chỉ sinh bội dương của 3 (3, 6, 9, ...), thiếu số âm. (ii): bắt đầu từ $\\{3\\}$ và đóng dưới phép trừ sinh ra toàn bộ nhóm con các bội của 3 -- $3-3=0$, $0-3=-3$, $3-(-3)=6$, $-3-3=-6$, $6-3=3$... cuối cùng ra mọi bội của 3, cả âm lẫn dương.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the subset of the set of ordered pairs of integers defined recursively by: Basis step: $(0,0)\\in S$. Recursive step: If $(a,b)\\in S$, then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is in S?|||Cho S là tập con của tập các cặp số nguyên có thứ tự, định nghĩa đệ quy: Bước cơ sở: $(0,0)\\in S$. Bước đệ quy: Nếu $(a,b)\\in S$, thì $(a+2,b+3)\\in S$ và $(a+3,b+2)\\in S$. Phần tử nào thuộc S?",
          "options": [
            {
              "text": "(12,15)|||(12,15)"
            },
            {
              "text": "(10,15)|||(10,15)"
            },
            {
              "text": "(9,15)|||(9,15)"
            },
            {
              "text": "(8,15)|||(8,15)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Each step adds either $(2,3)$ or $(3,2)$, so after $n$ steps $a+b=5n$ must hold and $2n\\le a,b\\le3n$. Only $(10,15)$ has $a+b=25$ divisible by 5 (n=5), reached by 5 consecutive $(2,3)$ steps: $(0,0)\\to(2,3)\\to(4,6)\\to(6,9)\\to(8,12)\\to(10,15)$.</div><div class=\"ml-vi\">Mỗi bước cộng thêm $(2,3)$ hoặc $(3,2)$, nên sau $n$ bước phải có $a+b=5n$ và $2n\\le a,b\\le3n$. Chỉ $(10,15)$ có $a+b=25$ chia hết cho 5 (n=5), đạt được bằng 5 bước $(2,3)$ liên tiếp: $(0,0)\\to(2,3)\\to(4,6)\\to(6,9)\\to(8,12)\\to(10,15)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: procedure ketqua(n: integer); if n=1 then ketqua(n):=98 else ketqua(n):=7$\\cdot$ketqua(n-1). We can use this for computing value of $a_n$ of sequence ___|||Cho thuật toán đệ quy: procedure ketqua(n: integer); if n=1 then ketqua(n):=98 else ketqua(n):=7$\\cdot$ketqua(n-1). Ta có thể dùng thuật toán này để tính giá trị $a_n$ của dãy ___",
          "options": [
            {
              "text": "$a_n=7^n$, $n\\ge1$|||$a_n=7^n$, $n\\ge1$"
            },
            {
              "text": "$a_n=2(7^n)$, $n\\ge1$|||$a_n=2(7^n)$, $n\\ge1$"
            },
            {
              "text": "$a_n=7^{n+1}$, $n\\ge1$|||$a_n=7^{n+1}$, $n\\ge1$"
            },
            {
              "text": "$a_n=2(7^{n+1})$, $n\\ge1$|||$a_n=2(7^{n+1})$, $n\\ge1$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$ketqua(1)=98=2\\cdot7^2$. $ketqua(2)=7\\cdot98=2\\cdot7^3$. In general $ketqua(n)=98\\cdot7^{n-1}=2\\cdot7^2\\cdot7^{n-1}=2\\cdot7^{n+1}$, matching option (iv).</div><div class=\"ml-vi\">$ketqua(1)=98=2\\cdot7^2$. $ketqua(2)=7\\cdot98=2\\cdot7^3$. Tổng quát $ketqua(n)=98\\cdot7^{n-1}=2\\cdot7^2\\cdot7^{n-1}=2\\cdot7^{n+1}$, khớp đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: procedure function(n: positive integer); if (n=1) then function(n):=1 else function(n):=2n-1+function(n-1). What does this algorithm compute?|||Cho thuật toán đệ quy: procedure function(n: positive integer); if (n=1) then function(n):=1 else function(n):=2n-1+function(n-1). Thuật toán này tính gì?",
          "options": [
            {
              "text": "The sum of the first n positive integers|||Tổng n số nguyên dương đầu tiên"
            },
            {
              "text": "The sum of the first n EVEN positive integers|||Tổng n số nguyên dương CHẴN đầu tiên"
            },
            {
              "text": "The sum of all ODD positive integers that are less than n|||Tổng tất cả số nguyên dương LẺ nhỏ hơn n"
            },
            {
              "text": "The sum of the first n ODD positive integers|||Tổng n số nguyên dương LẺ đầu tiên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$function(1)=1=1^2$, $function(2)=3+1=4=2^2$, $function(3)=5+4=9=3^2$. In general $2k-1$ is the $k$-th odd positive integer, so $function(n)=\\sum_{k=1}^n(2k-1)=n^2$, the sum of the first $n$ odd positive integers.</div><div class=\"ml-vi\">$function(1)=1=1^2$, $function(2)=3+1=4=2^2$, $function(3)=5+4=9=3^2$. Tổng quát $2k-1$ là số lẻ dương thứ $k$, nên $function(n)=\\sum_{k=1}^n(2k-1)=n^2$, tổng $n$ số nguyên dương lẻ đầu tiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 8-digit numbers are divisible by 10?|||Có bao nhiêu số có 8 chữ số chia hết cho 10?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "9,000,001|||9.000.001"
            },
            {
              "text": "10,000,000|||10.000.000"
            },
            {
              "text": "10,000,001|||10.000.001"
            },
            {
              "text": "9,000,000|||9.000.000"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">8-digit numbers range from $10{,}000{,}000$ to $99{,}999{,}999$. Those divisible by 10 (ending in 0) range from $10{,}000{,}000$ to $99{,}999{,}990$, giving $(99{,}999{,}990-10{,}000{,}000)/10+1=9{,}000{,}000$.</div><div class=\"ml-vi\">Số có 8 chữ số nằm từ $10.000.000$ đến $99.999.999$. Số chia hết cho 10 (tận cùng 0) nằm từ $10.000.000$ đến $99.999.990$, cho $(99.999.990-10.000.000)/10+1=9.000.000$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers not exceeding 100 are divisible by exactly one of 6 or 9?|||Có bao nhiêu số nguyên dương không vượt quá 100 chia hết cho đúng một trong hai số 6 hoặc 9?",
          "options": [
            {
              "text": "17|||17"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "26|||26"
            },
            {
              "text": "27|||27"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Divisible by 6: $\\lfloor100/6\\rfloor=16$. Divisible by 9: $\\lfloor100/9\\rfloor=11$. Divisible by both ($\\mathrm{lcm}(6,9)=18$): $\\lfloor100/18\\rfloor=5$. Exactly one: $(16-5)+(11-5)=11+6=17$.</div><div class=\"ml-vi\">Chia hết cho 6: $\\lfloor100/6\\rfloor=16$. Chia hết cho 9: $\\lfloor100/9\\rfloor=11$. Chia hết cho cả hai ($\\mathrm{lcm}(6,9)=18$): $\\lfloor100/18\\rfloor=5$. Đúng một: $(16-5)+(11-5)=11+6=17$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a_n=2^n+4(3^n)+n$ for $n=0,1,2,\\dots$. Find $a_0$, $a_2$ and $a_4$.|||Cho $a_n=2^n+4(3^n)+n$ với $n=0,1,2,\\dots$. Tìm $a_0$, $a_2$ và $a_4$.",
          "options": [
            {
              "text": "5, 42, 344|||5, 42, 344"
            },
            {
              "text": "5, 42, 430|||5, 42, 430"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "5, 36, 344|||5, 36, 344"
            },
            {
              "text": "5, 36, 430|||5, 36, 430"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$a_0=1+4+0=5$. $a_2=4+4(9)+2=4+36+2=42$. $a_4=16+4(81)+4=16+324+4=344$.</div><div class=\"ml-vi\">$a_0=1+4+0=5$. $a_2=4+4(9)+2=4+36+2=42$. $a_4=16+4(81)+4=16+324+4=344$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f(3)$ if $f(9)=25$ and $f(n)=7-\\frac{n^2}{9}f\\left(\\frac{n}{3}\\right)$.|||Tìm $f(3)$ nếu $f(9)=25$ và $f(n)=7-\\frac{n^2}{9}f\\left(\\frac{n}{3}\\right)$.",
          "options": [
            {
              "text": "-1|||-1"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(9)=7-\\frac{81}{9}f(3)=7-9f(3)$. Setting this equal to 25: $7-9f(3)=25\\Rightarrow-9f(3)=18\\Rightarrow f(3)=-2$.</div><div class=\"ml-vi\">$f(9)=7-\\frac{81}{9}f(3)=7-9f(3)$. Cho bằng 25: $7-9f(3)=25\\Rightarrow-9f(3)=18\\Rightarrow f(3)=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many vertices are needed to construct a graph with 10 edges in which every vertex is of degree 4?|||Cần bao nhiêu đỉnh để xây dựng một đồ thị có 10 cạnh mà mọi đỉnh đều có bậc 4?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">By the handshaking lemma, sum of degrees $=2\\times\\text{edges}=20$. With every vertex having degree 4, the number of vertices is $20/4=5$.</div><div class=\"ml-vi\">Theo bổ đề bắt tay, tổng bậc $=2\\times\\text{số cạnh}=20$. Với mọi đỉnh đều bậc 4, số đỉnh là $20/4=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the following degree sequences: (i) 7, 5, 4, 3, 2, 2. (ii) 5, 5, 4, 3, 2, 1, 0. What is(are) the degree sequence(s) of an undirected graph?|||Cho các dãy bậc sau: (i) 7, 5, 4, 3, 2, 2. (ii) 5, 5, 4, 3, 2, 1, 0. Dãy nào là dãy bậc của một đồ thị vô hướng?",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "Neither (i) nor (ii)|||Không phải (i) lẫn (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) has 6 vertices but a degree of 7, exceeding the maximum possible degree $n-1=5$ -- impossible, also the sum $23$ is odd. (ii) has 7 vertices with two vertices of degree 5, but one vertex has degree 0 (isolated); a degree-5 vertex must connect to 5 of the other 6, yet the isolated vertex is unavailable, and applying the Erdos-Gallai check at $k=2$: $5+5=10>2(1)+\\min(4,2)+\\min(3,2)+\\min(2,2)+\\min(1,2)=2+2+2+2+1=9$ -- fails, so (ii) is not graphical either.</div><div class=\"ml-vi\">(i) có 6 đỉnh nhưng bậc 7, vượt quá bậc tối đa có thể $n-1=5$ -- không thể, tổng $23$ cũng lẻ. (ii) có 7 đỉnh với hai đỉnh bậc 5, nhưng một đỉnh bậc 0 (cô lập); đỉnh bậc 5 phải nối với 5 trong 6 đỉnh còn lại, nhưng đỉnh cô lập không khả dụng, kiểm tra Erdos-Gallai tại $k=2$: $5+5=10>2(1)+\\min(4,2)+\\min(3,2)+\\min(2,2)+\\min(1,2)=2+2+2+2+1=9$ -- thất bại, nên (ii) cũng không phải dãy bậc hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many non-isomorphic simple graphs with 3 vertices?|||Có bao nhiêu đồ thị đơn không đẳng cấu với nhau có 3 đỉnh?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">By number of edges (0 to 3), each edge-count class has exactly one graph up to isomorphism on 3 vertices: empty graph (0 edges), one edge, two edges (path $P_3$), triangle (3 edges) -- total 4.</div><div class=\"ml-vi\">Theo số cạnh (0 đến 3), mỗi lớp số cạnh chỉ có đúng một đồ thị (sai khác đẳng cấu) với 3 đỉnh: đồ thị rỗng (0 cạnh), một cạnh, hai cạnh (đường đi $P_3$), tam giác (3 cạnh) -- tổng cộng 4.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a simple graph that is isomorphic to the wheel $W_n$. Find the INCORRECT statements. (i) If G has 10 vertices then n=9. (ii) The adjacency matrices of G and $W_n$ are identical. (iii) The number of edges in G and $W_n$ are the same. (iv) If n=3 then G has exactly 4 vertices of degree 3.|||Cho G là đồ thị đơn đẳng cấu với đồ thị bánh xe $W_n$. Tìm các phát biểu SAI. (i) Nếu G có 10 đỉnh thì n=9. (ii) Ma trận kề của G và $W_n$ giống hệt nhau. (iii) Số cạnh của G và $W_n$ bằng nhau. (iv) Nếu n=3 thì G có đúng 4 đỉnh bậc 3.",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$W_n$ has $n+1$ vertices, so 10 vertices means $n=9$ -- (i) is correct. Isomorphic graphs need not have identical adjacency matrices (labeling can differ) -- (ii) is INCORRECT. Isomorphic graphs always have the same edge count -- (iii) is correct. For $n=3$, $W_3$ has 4 vertices (hub + 3-cycle), hub degree 3 and each rim vertex degree $2+1=3$ -- all 4 vertices have degree 3, so (iv) is correct. Only (ii) is incorrect.</div><div class=\"ml-vi\">$W_n$ có $n+1$ đỉnh, nên 10 đỉnh nghĩa là $n=9$ -- (i) đúng. Đồ thị đẳng cấu không nhất thiết có ma trận kề giống hệt (cách đánh nhãn có thể khác) -- (ii) SAI. Đồ thị đẳng cấu luôn có cùng số cạnh -- (iii) đúng. Với $n=3$, $W_3$ có 4 đỉnh (trục + chu trình 3), trục bậc 3 và mỗi đỉnh vành bậc $2+1=3$ -- cả 4 đỉnh đều bậc 3, nên (iv) đúng. Chỉ (ii) sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Graph X is a 5-vertex pentagram (a 5-cycle drawn with crossing straight edges: top, left, right, bottom-left, bottom-right, connected top-BL, top-BR, left-right, left-BR, right-BL). Graph Y is a bowtie: two triangles sharing a common center vertex C (top-left-C-bottom-left triangle, and top-right-C-bottom-right triangle, plus verticals top-left-bottom-left and top-right-bottom-right). Delete one edge from each graph to obtain 2 new graphs. How many cut-edges in total of the new graphs?|||Đồ thị X là ngôi sao 5 cánh (chu trình 5 đỉnh vẽ với các cạnh thẳng cắt nhau: trên, trái, phải, dưới-trái, dưới-phải, nối trên-dướiTrái, trên-dướiPhải, trái-phải, trái-dướiPhải, phải-dướiTrái). Đồ thị Y là hình nơ: hai tam giác chung đỉnh trung tâm C (tam giác trên-trái-C-dưới-trái, và tam giác trên-phải-C-dưới-phải, cộng hai cạnh dọc trên-trái-dưới-trái và trên-phải-dưới-phải). Xoá một cạnh khỏi mỗi đồ thị để được 2 đồ thị mới. Tổng số cạnh cắt (cut-edge) của 2 đồ thị mới là bao nhiêu?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">X (drawn as a pentagram) is actually a 5-cycle $C_5$ (each vertex has degree 2). Deleting any one edge turns a cycle into a path with 4 edges, and every edge of a path is a bridge -- 4 cut-edges. Y is two triangles sharing vertex C; deleting any one edge (which always belongs to exactly one triangle) breaks that triangle into a 2-edge path (both edges become bridges), while the other triangle stays 2-edge-connected (no bridges) -- 2 cut-edges. Total: $4+2=6$.</div><div class=\"ml-vi\">X (vẽ dạng ngôi sao) thực chất là chu trình 5 đỉnh $C_5$ (mỗi đỉnh bậc 2). Xoá một cạnh bất kỳ biến chu trình thành đường đi 4 cạnh, và mọi cạnh của đường đi đều là cầu -- 4 cạnh cắt. Y là hai tam giác chung đỉnh C; xoá một cạnh bất kỳ (luôn thuộc đúng một tam giác) làm tam giác đó vỡ thành đường đi 2 cạnh (cả hai thành cầu), tam giác còn lại vẫn liên thông cạnh-kép (không có cầu) -- 2 cạnh cắt. Tổng: $4+2=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A graph has a pendant vertex $P_3$ attached to $P_1$; $P_1$-$P_2$ edge; $P_2$-$P_4$ edge; and $P_4,P_5,P_6,P_7$ forming a 4-cycle ($P_4$-$P_5$, $P_5$-$P_7$, $P_7$-$P_6$, $P_6$-$P_4$). How many cut-vertices and cut-edges in this graph?|||Một đồ thị có đỉnh treo $P_3$ nối với $P_1$; cạnh $P_1$-$P_2$; cạnh $P_2$-$P_4$; và $P_4,P_5,P_6,P_7$ tạo thành chu trình 4 đỉnh ($P_4$-$P_5$, $P_5$-$P_7$, $P_7$-$P_6$, $P_6$-$P_4$). Đồ thị này có bao nhiêu đỉnh cắt và cạnh cắt?",
          "options": [
            {
              "text": "2 and 3|||2 và 3"
            },
            {
              "text": "2 and 2|||2 và 2"
            },
            {
              "text": "3 and 3|||3 và 3"
            },
            {
              "text": "3 and 2|||3 và 2"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Cut-edges: $P_1$-$P_3$, $P_1$-$P_2$, $P_2$-$P_4$ are all bridges (each is the sole link between two parts of the graph) -- 3 cut-edges; none of the 4-cycle's edges are bridges. Cut-vertices: $P_1$ (separates $P_3$), $P_2$ (separates $\\{P_1,P_3\\}$ from the rest), $P_4$ (separates $\\{P_1,P_2,P_3\\}$ from $\\{P_5,P_6,P_7\\}$) -- 3 cut-vertices; $P_3,P_5,P_6,P_7$ are not cut-vertices (leaf or part of the 2-connected cycle). So 3 and 3.</div><div class=\"ml-vi\">Cạnh cắt: $P_1$-$P_3$, $P_1$-$P_2$, $P_2$-$P_4$ đều là cầu (mỗi cạnh là liên kết duy nhất giữa hai phần đồ thị) -- 3 cạnh cắt; không cạnh nào của chu trình 4 đỉnh là cầu. Đỉnh cắt: $P_1$ (tách $P_3$), $P_2$ (tách $\\{P_1,P_3\\}$ khỏi phần còn lại), $P_4$ (tách $\\{P_1,P_2,P_3\\}$ khỏi $\\{P_5,P_6,P_7\\}$) -- 3 đỉnh cắt; $P_3,P_5,P_6,P_7$ không phải đỉnh cắt (đỉnh treo hoặc thuộc chu trình liên thông-2). Vậy 3 và 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For what values of n does the graph $W_n$ have Hamilton circuits?|||Với giá trị nào của n thì đồ thị $W_n$ có chu trình Hamilton?",
          "options": [
            {
              "text": "n is odd|||n lẻ"
            },
            {
              "text": "n > 2|||n > 2"
            },
            {
              "text": "n is even|||n chẵn"
            },
            {
              "text": "no values of n|||không có giá trị nào của n"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The wheel $W_n$ (hub + n-cycle rim, defined for $n\\ge3$) always has a Hamilton circuit: hub $\\to v_1\\to v_2\\to\\dots\\to v_n\\to$ hub, using two spokes and the full rim cycle. This works for every $n>2$.</div><div class=\"ml-vi\">Đồ thị bánh xe $W_n$ (trục + chu trình vành n đỉnh, định nghĩa với $n\\ge3$) luôn có chu trình Hamilton: trục $\\to v_1\\to v_2\\to\\dots\\to v_n\\to$ trục, dùng hai nan hoa và trọn chu trình vành. Điều này đúng với mọi $n>2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the length of a Hamilton circuit in the graph $Q_3$?|||Độ dài của một chu trình Hamilton trong đồ thị $Q_3$ là bao nhiêu?",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$Q_3$ (the 3-cube graph) has $2^3=8$ vertices. A Hamilton circuit visits every vertex exactly once and returns to the start, so its length equals the number of vertices: 8.</div><div class=\"ml-vi\">$Q_3$ (đồ thị khối lập phương 3 chiều) có $2^3=8$ đỉnh. Chu trình Hamilton đi qua mỗi đỉnh đúng một lần rồi quay về đỉnh đầu, nên độ dài bằng số đỉnh: 8.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the weighted complete graph $K_4$ with vertices A, B, C, D and edge weights $AB=1$, $AC=4$, $AD=6$, $BC=2$, $BD=5$, $CD=3$, what is the average weight of all Hamilton circuits starting and ending at A?|||Cho đồ thị đầy đủ có trọng số $K_4$ với các đỉnh A, B, C, D và trọng số cạnh $AB=1$, $AC=4$, $AD=6$, $BC=2$, $BD=5$, $CD=3$, trọng số trung bình của tất cả chu trình Hamilton bắt đầu và kết thúc tại A là bao nhiêu?",
          "options": [
            {
              "text": "14|||14"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">There are 3 distinct Hamilton circuits from A: A-B-C-D-A ($1+2+3+6=12$), A-B-D-C-A ($1+5+3+4=13$), A-C-B-D-A ($4+2+5+6=17$). Average $=(12+13+17)/3=42/3=14$.</div><div class=\"ml-vi\">Có 3 chu trình Hamilton khác nhau từ A: A-B-C-D-A ($1+2+3+6=12$), A-B-D-C-A ($1+5+3+4=13$), A-C-B-D-A ($4+2+5+6=17$). Trung bình $=(12+13+17)/3=42/3=14$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many leaves does a full 6-ary tree with 66 edges have?|||Cây đầy đủ 6-phân với 66 cạnh có bao nhiêu lá?",
          "options": [
            {
              "text": "56|||56"
            },
            {
              "text": "66|||66"
            },
            {
              "text": "76|||76"
            },
            {
              "text": "50|||50"
            },
            {
              "text": "60|||60"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For a full $m$-ary tree, edges $=m\\cdot i$ where $i$ is the number of internal vertices, so $i=66/6=11$. Total vertices $n=\\text{edges}+1=67$. Leaves $=n-i=67-11=56$.</div><div class=\"ml-vi\">Với cây đầy đủ $m$-phân, số cạnh $=m\\cdot i$ với $i$ là số đỉnh trong, nên $i=66/6=11$. Tổng số đỉnh $n=\\text{số cạnh}+1=67$. Số lá $=n-i=67-11=56$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let T be a full m-ary tree of height 4 with 63 leaves. Find m.|||Cho T là cây đầy đủ m-phân có chiều cao 4 với 63 lá. Tìm m.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For a full m-ary tree of height h with l leaves, $l\\le m^h$, so $m\\ge\\lceil l^{1/h}\\rceil$. Here $63^{1/4}\\approx2.82$, and since $2^4=16<63$ while $3^4=81\\ge63$, the smallest valid $m$ is 3.</div><div class=\"ml-vi\">Với cây đầy đủ m-phân chiều cao h có l lá, ta có $l\\le m^h$, nên $m\\ge\\lceil l^{1/h}\\rceil$. Ở đây $63^{1/4}\\approx2.82$, và vì $2^4=16<63$ trong khi $3^4=81\\ge63$, giá trị $m$ nhỏ nhất hợp lệ là 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given some coding schemes: (i) a:11, b:101, c:01, e:001. (ii) a:0, b:10, e:100, i:111. (iii) a:101, e:011, i:100, n:001, m:11111. Which are prefix codes?|||Cho một số bảng mã: (i) a:11, b:101, c:01, e:001. (ii) a:0, b:10, e:100, i:111. (iii) a:101, e:011, i:100, n:001, m:11111. Bảng nào là mã tiền tố?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "All of them are prefix codes|||Tất cả đều là mã tiền tố"
            },
            {
              "text": "(i) and (iii)|||(i) và (iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i): checking all pairs, no code is a prefix of another (e.g. $01$ is not a prefix of $001$ since they differ at position 2) -- valid. (ii): $b=10$ is a prefix of $e=100$ -- INVALID. (iii): checking all pairs (three length-3 codes differ from each other, none is a prefix of $m=11111$ since none start with $11$) -- valid. So (i) and (iii) are prefix codes.</div><div class=\"ml-vi\">(i): kiểm mọi cặp, không mã nào là tiền tố của mã khác (vd $01$ không phải tiền tố của $001$ vì khác nhau ở vị trí 2) -- hợp lệ. (ii): $b=10$ là tiền tố của $e=100$ -- KHÔNG hợp lệ. (iii): kiểm mọi cặp (ba mã dài 3 khác nhau, không mã nào là tiền tố của $m=11111$ vì không mã nào bắt đầu bằng $11$) -- hợp lệ. Vậy (i) và (iii) là mã tiền tố.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following coding schemes are prefix codes? (i) A:011, B:110, C:1111, D:0101, E:010, F:1010. (ii) A:0101, B:11, C:101, D:1101, E:0111, F:100. (iii) A:1000, B:00, C:101, D:111, E:110, F:1001.|||Bảng mã nào sau đây là mã tiền tố? (i) A:011, B:110, C:1111, D:0101, E:010, F:1010. (ii) A:0101, B:11, C:101, D:1101, E:0111, F:100. (iii) A:1000, B:00, C:101, D:111, E:110, F:1001.",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(i) only|||chỉ (i)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(ii) only|||chỉ (ii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i): $E=010$ is a prefix of $D=0101$ -- INVALID. (ii): $B=11$ is a prefix of $D=1101$ -- INVALID. (iii): checking all pairs (lengths 2,3,3,3,4,4), no code is a prefix of another -- VALID. Only (iii) is a prefix code.</div><div class=\"ml-vi\">(i): $E=010$ là tiền tố của $D=0101$ -- KHÔNG hợp lệ. (ii): $B=11$ là tiền tố của $D=1101$ -- KHÔNG hợp lệ. (iii): kiểm mọi cặp (độ dài 2,3,3,3,4,4), không mã nào là tiền tố của mã khác -- HỢP LỆ. Chỉ (iii) là mã tiền tố.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute the value of the prefix notation $-\\ *\\ /\\ 15\\ -\\ 7\\ +\\ 1\\ 1\\ 3\\ +\\ 2\\ +\\ 1\\ 1$|||Tính giá trị của ký hiệu tiền tố $-\\ *\\ /\\ 15\\ -\\ 7\\ +\\ 1\\ 1\\ 3\\ +\\ 2\\ +\\ 1\\ 1$",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "-15|||-15"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Parse right-to-left recursively: inner $+\\,1\\,1=2$, then $-\\,7\\,2=5$, then $/\\,15\\,5=3$, then $*\\,3\\,3=9$ (using $3$ from the last token of that group). Second half: $+\\,1\\,1=2$, then $+\\,2\\,2=4$. Finally $-\\,9\\,4=5$.</div><div class=\"ml-vi\">Phân tích đệ quy: $+\\,1\\,1=2$, rồi $-\\,7\\,2=5$, rồi $/\\,15\\,5=3$, rồi $*\\,3\\,3=9$ (dùng $3$ ở token cuối nhóm đó). Nửa sau: $+\\,1\\,1=2$, rồi $+\\,2\\,2=4$. Cuối cùng $-\\,9\\,4=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the prefix notation of the expression $(x+x*y)+(x/y)$|||Tìm ký hiệu tiền tố của biểu thức $(x+x*y)+(x/y)$",
          "options": [
            {
              "text": "+ + x * x y / x y|||+ + x * x y / x y"
            },
            {
              "text": "+ x / + * x y x y|||+ x / + * x y x y"
            },
            {
              "text": "x x y * x + y / +|||x x y * x + y / +"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "x x y * + x y / +|||x x y * + x y / +"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$x*y\\to*xy$. $x+(x*y)\\to+x*xy$. $x/y\\to/xy$. Whole expression $\\to+(+x*xy)(/xy)=+\\ +\\ x\\ *\\ x\\ y\\ /\\ x\\ y$.</div><div class=\"ml-vi\">$x*y\\to*xy$. $x+(x*y)\\to+x*xy$. $x/y\\to/xy$. Toàn bộ biểu thức $\\to+(+x*xy)(/xy)=+\\ +\\ x\\ *\\ x\\ y\\ /\\ x\\ y$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many different spanning trees does the graph $C_n$ have?|||Đồ thị $C_n$ có bao nhiêu cây khung khác nhau?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "n-1|||n-1"
            },
            {
              "text": "n|||n"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$C_n$ has $n$ vertices and $n$ edges. A spanning tree needs exactly $n-1$ edges, obtained by removing exactly one edge from the cycle. Removing each of the $n$ different edges gives a distinct spanning tree (a path), so there are $n$ spanning trees.</div><div class=\"ml-vi\">$C_n$ có $n$ đỉnh và $n$ cạnh. Cây khung cần đúng $n-1$ cạnh, đạt được bằng cách xoá đúng một cạnh khỏi chu trình. Xoá mỗi cạnh trong $n$ cạnh khác nhau cho một cây khung khác nhau (một đường đi), nên có $n$ cây khung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If using Kruskal's algorithm to find a minimum spanning tree T from the graph with vertices A,B,C,D,E,F and edges AB=1, BC=6, AD=3, BD=5, BE=1, CE=5, CF=2, DE=1, EF=4, which edge is added to T in the last step?|||Nếu dùng thuật toán Kruskal để tìm cây khung nhỏ nhất T từ đồ thị có các đỉnh A,B,C,D,E,F và các cạnh AB=1, BC=6, AD=3, BD=5, BE=1, CE=5, CF=2, DE=1, EF=4, cạnh nào được thêm vào T ở bước cuối cùng?",
          "options": [
            {
              "text": "AD|||AD"
            },
            {
              "text": "EF|||EF"
            },
            {
              "text": "EC|||EC"
            },
            {
              "text": "BD|||BD"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sorted edges: AB=1, BE=1, DE=1, CF=2, AD=3, EF=4, BD=5, CE=5, BC=6. Adding in order (skipping cycles): AB (\\{A,B\\}), BE (\\{A,B,E\\}), DE (\\{A,B,D,E\\}), CF (\\{C,F\\}), AD skipped (cycle, A,D already connected), EF connects \\{A,B,D,E\\} with \\{C,F\\} -- 5th edge, completing the spanning tree of 6 vertices. Last edge added: EF.</div><div class=\"ml-vi\">Sắp cạnh tăng dần: AB=1, BE=1, DE=1, CF=2, AD=3, EF=4, BD=5, CE=5, BC=6. Thêm theo thứ tự (bỏ qua cạnh tạo chu trình): AB (\\{A,B\\}), BE (\\{A,B,E\\}), DE (\\{A,B,D,E\\}), CF (\\{C,F\\}), AD bỏ qua (tạo chu trình, A,D đã liên thông), EF nối \\{A,B,D,E\\} với \\{C,F\\} -- cạnh thứ 5, hoàn tất cây khung 6 đỉnh. Cạnh cuối cùng: EF.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D4",
      "source": "REAL",
      "sortOrder": 204,
      "title": "Final Exam — Đề 4|||Thi cuối kỳ — Đề 4",
      "description": "MAD101 Final Exam, Đề 4 (50 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 4 (50 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 100,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose a tuple of values of $p,q,r$ such that the proposition $(p\\to q)\\lor r$ is False.|||Chọn bộ giá trị $p,q,r$ sao cho mệnh đề $(p\\to q)\\lor r$ là Sai (False).",
          "options": [
            {
              "text": "p=F, q=T, r=F|||p=F, q=T, r=F"
            },
            {
              "text": "p=q=T, r=F|||p=q=T, r=F"
            },
            {
              "text": "p=T, q=F, r=F|||p=T, q=F, r=F"
            },
            {
              "text": "p=q=r=F|||p=q=r=F"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Need $(p\\to q)=F$ and $r=F$. $p\\to q=F$ only when $p=T,q=F$. So $p=T,q=F,r=F$: $(T\\to F)\\lor F=F\\lor F=F$. Check others: A gives $F\\to T=T$, $T\\lor F=T$. B gives $T\\to T=T$, $T\\lor F=T$. D gives $F\\to F=T$, $T\\lor F=T$. Only option C works.</div><div class=\"ml-vi\">Cần $(p\\to q)=F$ và $r=F$. $p\\to q=F$ chỉ khi $p=T,q=F$. Vậy $p=T,q=F,r=F$: $(T\\to F)\\lor F=F\\lor F=F$. Kiểm các đáp án khác: A cho $F\\to T=T$, $T\\lor F=T$. B cho $T\\to T=T$, $T\\lor F=T$. D cho $F\\to F=T$, $T\\lor F=T$. Chỉ đáp án C đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the propositions $p$=\"Tom washed the car\" and $q$=\"Tom went to mercantile\". Express the following sentence into a logical expression: \"Tom neither washed the car nor went to mercantile\". (i) $\\neg(p\\lor q)$ (ii) $\\neg(p\\land q)$ (iii) $\\neg p\\lor q$ (iv) $p\\lor\\neg q$|||Cho các mệnh đề $p$=\"Tom đã rửa xe\" và $q$=\"Tom đã đi đến khu buôn bán\". Diễn đạt câu sau thành biểu thức logic: \"Tom không rửa xe cũng không đi đến khu buôn bán\". (i) $\\neg(p\\lor q)$ (ii) $\\neg(p\\land q)$ (iii) $\\neg p\\lor q$ (iv) $p\\lor\\neg q$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"Neither...nor...\" means $\\neg p\\land\\neg q$, which by De Morgan equals $\\neg(p\\lor q)$, exactly option (i).</div><div class=\"ml-vi\">\"Không...cũng không...\" nghĩa là $\\neg p\\land\\neg q$, theo De Morgan bằng $\\neg(p\\lor q)$, đúng là đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which propositions are logically equivalent to $\\neg(p\\leftrightarrow q)$? (i) $p\\leftrightarrow\\neg q$ (ii) $\\neg p\\leftrightarrow q$|||Mệnh đề nào tương đương logic với $\\neg(p\\leftrightarrow q)$? (i) $p\\leftrightarrow\\neg q$ (ii) $\\neg p\\leftrightarrow q$",
          "options": [
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\neg(p\\leftrightarrow q)$ is true exactly when $p,q$ differ (XOR). Truth-table check: $p\\leftrightarrow\\neg q$ matches this pattern for all 4 rows, and so does $\\neg p\\leftrightarrow q$. Both (i) and (ii) are equivalent to $p\\oplus q$.</div><div class=\"ml-vi\">$\\neg(p\\leftrightarrow q)$ đúng chính xác khi $p,q$ khác nhau (XOR). Kiểm bảng chân trị: $p\\leftrightarrow\\neg q$ khớp mẫu này ở cả 4 dòng, và $\\neg p\\leftrightarrow q$ cũng vậy. Cả (i) và (ii) đều tương đương $p\\oplus q$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $C(x)$=\"x has a cat\", $D(x)$=\"x has a dog\", $F(x)$=\"x has a ferret\". Let the domain consist of all students in your class. Express the sentence \"All students in your class have a cat, a dog, or a ferret\" in terms of $C(x),D(x),F(x)$, quantifiers, and logical connectives. (i) $\\exists x\\,C(x)\\lor D(x)\\lor F(x)$ (ii) $\\exists x\\,\\neg C(x)\\land\\neg D(x)\\land\\neg F(x)$ (iii) $\\forall x\\,C(x)\\lor D(x)\\lor F(x)$ (iv) $\\forall x\\,\\neg C(x)\\land\\neg D(x)\\land\\neg F(x)$|||Cho $C(x)$=\"x có mèo\", $D(x)$=\"x có chó\", $F(x)$=\"x có chồn sương\". Miền là mọi sinh viên trong lớp bạn. Diễn đạt câu \"Mọi sinh viên trong lớp bạn đều có mèo, chó, hoặc chồn sương\" theo $C(x),D(x),F(x)$, lượng từ, và liên từ logic. (i) $\\exists x\\,C(x)\\lor D(x)\\lor F(x)$ (ii) $\\exists x\\,\\neg C(x)\\land\\neg D(x)\\land\\neg F(x)$ (iii) $\\forall x\\,C(x)\\lor D(x)\\lor F(x)$ (iv) $\\forall x\\,\\neg C(x)\\land\\neg D(x)\\land\\neg F(x)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">\"All students...have\" is a universal statement over the domain of students: for every student $x$, $C(x)\\lor D(x)\\lor F(x)$ holds. That is $\\forall x\\,C(x)\\lor D(x)\\lor F(x)$, option (iii).</div><div class=\"ml-vi\">\"Mọi sinh viên...có\" là phát biểu toàn thể trên miền sinh viên: với mọi sinh viên $x$, $C(x)\\lor D(x)\\lor F(x)$ đúng. Đó là $\\forall x\\,C(x)\\lor D(x)\\lor F(x)$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be a propositional function on $\\{-2,-1,0,1,2,3\\}$. Find a proposition that is logically equivalent to $\\forall x[(x\\ge1)\\to P(x)]$. (i) $P(1)\\to(P(2)\\land P(3))$ (ii) $P(1)\\lor P(2)\\lor P(3)$ (iii) $P(1)\\land P(2)\\land P(3)$ (iv) $P(1)\\to(P(2)\\lor P(3))$|||Cho $P(x)$ là hàm mệnh đề trên $\\{-2,-1,0,1,2,3\\}$. Tìm mệnh đề tương đương logic với $\\forall x[(x\\ge1)\\to P(x)]$. (i) $P(1)\\to(P(2)\\land P(3))$ (ii) $P(1)\\lor P(2)\\lor P(3)$ (iii) $P(1)\\land P(2)\\land P(3)$ (iv) $P(1)\\to(P(2)\\lor P(3))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">For $x=-2,-1,0$ the antecedent $x\\ge1$ is false, so the implication is vacuously true. For $x=1,2,3$ the antecedent is true, forcing $P(1),P(2),P(3)$ all true. So the whole statement reduces to $P(1)\\land P(2)\\land P(3)$, option (iii).</div><div class=\"ml-vi\">Với $x=-2,-1,0$ tiền đề $x\\ge1$ sai, nên phép kéo theo đúng một cách hiển nhiên. Với $x=1,2,3$ tiền đề đúng, buộc $P(1),P(2),P(3)$ đều đúng. Vậy toàn mệnh đề rút gọn thành $P(1)\\land P(2)\\land P(3)$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $L(x,y)$ be the statement \"$x+y>5$\". Translate the statement into a logical expression: \"For any $x$, there are $y$ and $y'$ such that $x+y>5$ and $x+y'\\le5$\". (i) $\\forall x(\\exists y\\,L(x,y)\\land\\exists y'(\\neg L(x,y')))$ (ii) $\\forall x(\\exists y\\,L(x,y)\\land\\exists y'(L(x,y')))$ (iii) $\\forall x(\\exists y\\,L(x,y)\\land\\forall y'(\\neg L(x,y')))$ (iv) $\\forall x(\\exists y\\,L(x,y)\\lor\\exists y'(\\neg L(x,y')))$|||Cho $L(x,y)$ là mệnh đề \"$x+y>5$\". Diễn đạt câu sau thành biểu thức logic: \"Với mọi $x$, tồn tại $y$ và $y'$ sao cho $x+y>5$ và $x+y'\\le5$\". (i) $\\forall x(\\exists y\\,L(x,y)\\land\\exists y'(\\neg L(x,y')))$ (ii) $\\forall x(\\exists y\\,L(x,y)\\land\\exists y'(L(x,y')))$ (iii) $\\forall x(\\exists y\\,L(x,y)\\land\\forall y'(\\neg L(x,y')))$ (iv) $\\forall x(\\exists y\\,L(x,y)\\lor\\exists y'(\\neg L(x,y')))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"$x+y'\\le5$\" is $\\neg L(x,y')$. \"For any $x$, there are $y$ and $y'$\" gives $\\forall x(\\exists y\\ldots\\land\\exists y'\\ldots)$ with the two existence claims joined by \"and\". This matches exactly $\\forall x(\\exists y\\,L(x,y)\\land\\exists y'(\\neg L(x,y')))$, option (i).</div><div class=\"ml-vi\">\"$x+y'\\le5$\" là $\\neg L(x,y')$. \"Với mọi $x$, tồn tại $y$ và $y'$\" cho $\\forall x(\\exists y\\ldots\\land\\exists y'\\ldots)$ với hai khẳng định tồn tại nối bằng \"và\". Khớp chính xác $\\forall x(\\exists y\\,L(x,y)\\land\\exists y'(\\neg L(x,y')))$, đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $m,n$ be integers. Translate the sentence into a logical expression: \"Each integer is either odd or even\". (i) $\\forall m\\forall n[(m=2n+1)\\lor(m=2n)]$ (ii) $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iii) $\\exists m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iv) $\\exists m\\forall n[(m=2n+1)\\lor(m=2n)]$|||Cho $m,n$ là số nguyên. Diễn đạt câu sau thành biểu thức logic: \"Mỗi số nguyên đều là lẻ hoặc chẵn\". (i) $\\forall m\\forall n[(m=2n+1)\\lor(m=2n)]$ (ii) $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iii) $\\exists m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iv) $\\exists m\\forall n[(m=2n+1)\\lor(m=2n)]$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"Each integer\" is universal over $m$: $\\forall m$. \"Is either odd or even\" means there exists some $n$ making $m$ fit the odd form or the even form: $\\exists n[(m=2n+1)\\lor(m=2n)]$. Combined: $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$, option (ii).</div><div class=\"ml-vi\">\"Mỗi số nguyên\" là toàn thể trên $m$: $\\forall m$. \"Là lẻ hoặc chẵn\" nghĩa là tồn tại $n$ nào đó khiến $m$ khớp dạng lẻ hoặc dạng chẵn: $\\exists n[(m=2n+1)\\lor(m=2n)]$. Kết hợp: $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Recall rules of inference: Modus ponens $p\\land(p\\to q)\\to q$; Modus tollens $\\neg q\\land(p\\to q)\\to\\neg p$; Hypothetical syllogism $(p\\to q)\\land(q\\to r)\\to(p\\to r)$; Disjunctive syllogism $[(p\\lor q)\\land\\neg p]\\to q$. Determine the rule used: \"If I wake up early then I will read a book. I woke up early today. Therefore I will read a book.\"|||Nhắc lại các quy tắc suy luận: Modus ponens $p\\land(p\\to q)\\to q$; Modus tollens $\\neg q\\land(p\\to q)\\to\\neg p$; Tam đoạn luận giả định $(p\\to q)\\land(q\\to r)\\to(p\\to r)$; Tam đoạn luận tuyển $[(p\\lor q)\\land\\neg p]\\to q$. Xác định quy tắc dùng trong lập luận: \"Nếu tôi dậy sớm thì tôi sẽ đọc sách. Hôm nay tôi đã dậy sớm. Vậy tôi sẽ đọc sách.\"",
          "options": [
            {
              "text": "Modus ponens|||Modus ponens"
            },
            {
              "text": "Modus tollens|||Modus tollens"
            },
            {
              "text": "Hypothetical syllogism|||Tam đoạn luận giả định"
            },
            {
              "text": "Disjunctive syllogism|||Tam đoạn luận tuyển"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Let $p$=\"I wake up early\", $q$=\"I will read a book\". Premises: $p\\to q$ and $p$; conclusion $q$. This is exactly the pattern $p\\land(p\\to q)\\to q$: Modus ponens.</div><div class=\"ml-vi\">Cho $p$=\"tôi dậy sớm\", $q$=\"tôi sẽ đọc sách\". Tiền đề: $p\\to q$ và $p$; kết luận $q$. Đây chính xác là mẫu $p\\land(p\\to q)\\to q$: Modus ponens.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose $S=\\{1,2,3,4,5\\}$. Find $|P(S)|$.|||Cho $S=\\{1,2,3,4,5\\}$. Tìm $|P(S)|$.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "32|||32"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The power set of a set with $n$ elements has $2^n$ elements. Here $n=5$, so $|P(S)|=2^5=32$.</div><div class=\"ml-vi\">Tập lũy thừa của một tập có $n$ phần tử có $2^n$ phần tử. Ở đây $n=5$, nên $|P(S)|=2^5=32$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is FALSE? (i) $x\\in\\{x\\}$ (ii) $\\{x\\}\\subseteq\\{x\\}$ (iii) $\\{x\\}\\in\\{x\\}$ (iv) $\\{x\\}\\in\\{\\{x\\}\\}$|||Phát biểu nào sau đây SAI? (i) $x\\in\\{x\\}$ (ii) $\\{x\\}\\subseteq\\{x\\}$ (iii) $\\{x\\}\\in\\{x\\}$ (iv) $\\{x\\}\\in\\{\\{x\\}\\}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) is true: $x$ is the sole element of $\\{x\\}$. (ii) is true: every set is a subset of itself. (iv) is true: $\\{\\{x\\}\\}$'s sole element is $\\{x\\}$. (iii) claims $\\{x\\}$ (a set) is a member of $\\{x\\}$, whose only element is $x$ itself, not the set $\\{x\\}$ -- false in general.</div><div class=\"ml-vi\">(i) đúng: $x$ là phần tử duy nhất của $\\{x\\}$. (ii) đúng: mọi tập hợp là tập con của chính nó. (iv) đúng: phần tử duy nhất của $\\{\\{x\\}\\}$ là $\\{x\\}$. (iii) khẳng định $\\{x\\}$ (một tập hợp) là phần tử của $\\{x\\}$, mà phần tử duy nhất của $\\{x\\}$ là $x$, không phải tập $\\{x\\}$ -- sai trong trường hợp tổng quát.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $A=\\{1,2,3\\}$ and $B=\\{x\\mid x\\in\\mathbb{R}\\land x^2-5x+6=0\\}$. Find $B-A$.|||Nếu $A=\\{1,2,3\\}$ và $B=\\{x\\mid x\\in\\mathbb{R}\\land x^2-5x+6=0\\}$. Tìm $B-A$.",
          "options": [
            {
              "text": "$\\{1\\}$|||$\\{1\\}$"
            },
            {
              "text": "$\\{2,3\\}$|||$\\{2,3\\}$"
            },
            {
              "text": "$\\{1,2,3\\}$|||$\\{1,2,3\\}$"
            },
            {
              "text": "$\\emptyset$|||$\\emptyset$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$x^2-5x+6=0$ factors as $(x-2)(x-3)=0$, so $B=\\{2,3\\}$. Since $B\\subseteq A$, every element of $B$ is already in $A$, so $B-A=\\emptyset$.</div><div class=\"ml-vi\">$x^2-5x+6=0$ phân tích thành $(x-2)(x-3)=0$, nên $B=\\{2,3\\}$. Vì $B\\subseteq A$, mọi phần tử của $B$ đều đã thuộc $A$, nên $B-A=\\emptyset$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many bijective functions are there from a set of 6 elements to a set of 7 elements?|||Có bao nhiêu hàm song ánh từ một tập 6 phần tử đến một tập 7 phần tử?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "5040|||5040"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A bijection requires the domain and codomain to have the same cardinality. Since $6\\neq7$, no bijective function can exist between them: the count is 0.</div><div class=\"ml-vi\">Một song ánh đòi hỏi miền xác định và miền giá trị có cùng lực lượng. Vì $6\\neq7$, không thể tồn tại hàm song ánh nào giữa chúng: số lượng là 0.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f,g:\\mathbb{R}\\to\\mathbb{R}$ be two functions given by $f(x)=x^2+1$ and $g(x)=x+1$. Which functions are bijection?|||Cho $f,g:\\mathbb{R}\\to\\mathbb{R}$ là hai hàm số cho bởi $f(x)=x^2+1$ và $g(x)=x+1$. Hàm nào là song ánh?",
          "options": [
            {
              "text": "Only f|||Chỉ f"
            },
            {
              "text": "Only g|||Chỉ g"
            },
            {
              "text": "Both f and g|||Cả f và g"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=x^2+1$ is not injective on $\\mathbb{R}$: $f(1)=f(-1)=2$, so $f$ is not a bijection. $g(x)=x+1$ is a linear function with slope 1, strictly increasing (injective) and surjective onto $\\mathbb{R}$ (for any $y$, $x=y-1$ maps to it) -- so $g$ is a bijection. Only $g$ works.</div><div class=\"ml-vi\">$f(x)=x^2+1$ không đơn ánh trên $\\mathbb{R}$: $f(1)=f(-1)=2$, nên $f$ không phải song ánh. $g(x)=x+1$ là hàm tuyến tính hệ số góc 1, đơn điệu tăng nghiêm ngặt (đơn ánh) và toàn ánh lên $\\mathbb{R}$ (với mọi $y$, $x=y-1$ ánh xạ tới nó) -- vậy $g$ là song ánh. Chỉ $g$ đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute $\\sum_{i=1}^{97}i(i+3)$.|||Tính $\\sum_{i=1}^{97}i(i+3)$.",
          "options": [
            {
              "text": "323200|||323200"
            },
            {
              "text": "323204|||323204"
            },
            {
              "text": "323208|||323208"
            },
            {
              "text": "323312|||323312"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\sum i(i+3)=\\sum i^2+3\\sum i$. With $n=97$: $\\sum i=\\frac{97\\cdot98}{2}=4753$, $\\sum i^2=\\frac{97\\cdot98\\cdot195}{6}=308945$. Total $=308945+3(4753)=308945+14259=323204$.</div><div class=\"ml-vi\">$\\sum i(i+3)=\\sum i^2+3\\sum i$. Với $n=97$: $\\sum i=\\frac{97\\cdot98}{2}=4753$, $\\sum i^2=\\frac{97\\cdot98\\cdot195}{6}=308945$. Tổng $=308945+3(4753)=308945+14259=323204$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Binary search algorithm: procedure Binarysearch($a_1<a_2<\\ldots<a_n$, x: integer): $i:=1$, $j:=n$; while $(i<j)$: $m:=\\lfloor(i+j)/2\\rfloor$, if $x>a_m$ then $i:=m+1$ else $j:=m$; if $x=a_i$ then location:=i else location:=0. If input = 2, 4, 5, 7, 8, 9, 10, 13 and x = 11, after the second time of dividing into sublists, the sublist to be considered is __|||Cho thuật toán Tìm kiếm nhị phân: procedure Binarysearch($a_1<a_2<\\ldots<a_n$, x: integer): $i:=1$, $j:=n$; while $(i<j)$: $m:=\\lfloor(i+j)/2\\rfloor$, if $x>a_m$ then $i:=m+1$ else $j:=m$; if $x=a_i$ then location:=i else location:=0. Nếu đầu vào = 2, 4, 5, 7, 8, 9, 10, 13 và x = 11, sau lần chia thành các dãy con thứ hai, dãy con được xét là __",
          "options": [
            {
              "text": "10, 13|||10, 13"
            },
            {
              "text": "9, 10, 13|||9, 10, 13"
            },
            {
              "text": "9, 10|||9, 10"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$n=8$: $i=1,j=8$. 1st division: $m=\\lfloor9/2\\rfloor=4$, $a_4=7<11$ so $i:=5$. 2nd division: $i=5,j=8$, $m=\\lfloor13/2\\rfloor=6$, $a_6=9<11$ so $i:=7$. Now $i=7,j=8$, the sublist under consideration is $a_7,a_8=10,13$.</div><div class=\"ml-vi\">$n=8$: $i=1,j=8$. Lần chia 1: $m=\\lfloor9/2\\rfloor=4$, $a_4=7<11$ nên $i:=5$. Lần chia 2: $i=5,j=8$, $m=\\lfloor13/2\\rfloor=6$, $a_6=9<11$ nên $i:=7$. Giờ $i=7,j=8$, dãy con đang xét là $a_7,a_8=10,13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Greedy Change-Making algorithm to make change for 63 cents using quarters, nickels and pennies (1 quarter = 25 cents, 1 nickel = 5 cents, 1 penny = 1 cent). What is the total number of coins used?|||Dùng thuật toán Tham lam Đổi tiền để trả 63 cent bằng quarter, nickel và penny (1 quarter = 25 cent, 1 nickel = 5 cent, 1 penny = 1 cent). Tổng số đồng xu dùng là bao nhiêu?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Greedily take the largest coin first: $63=2(25)+13$ (2 quarters, remainder 13), $13=2(5)+3$ (2 nickels, remainder 3), $3=3(1)$ (3 pennies). Total coins $=2+2+3=7$.</div><div class=\"ml-vi\">Tham lam lấy đồng lớn nhất trước: $63=2(25)+13$ (2 quarter, dư 13), $13=2(5)+3$ (2 nickel, dư 3), $3=3(1)$ (3 penny). Tổng số đồng $=2+2+3=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=x^2\\log(x)$ and $g(x)=x\\log(x^4)$. Choose the correct statements. (i) $f(x)=O(g(x))$ (ii) $g(x)=O(f(x))$|||Cho $f(x)=x^2\\log(x)$ và $g(x)=x\\log(x^4)$. Chọn phát biểu đúng. (i) $f(x)=O(g(x))$ (ii) $g(x)=O(f(x))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$g(x)=x\\log(x^4)=4x\\log(x)$. Compare $\\frac{f(x)}{g(x)}=\\frac{x^2\\log x}{4x\\log x}=\\frac{x}{4}\\to\\infty$, so $f$ grows strictly faster: $f\\neq O(g)$, but $g=O(f)$ since $\\frac{g(x)}{f(x)}=\\frac{4}{x}\\to0$ is bounded. Only (ii) holds.</div><div class=\"ml-vi\">$g(x)=x\\log(x^4)=4x\\log(x)$. So sánh $\\frac{f(x)}{g(x)}=\\frac{x^2\\log x}{4x\\log x}=\\frac{x}{4}\\to\\infty$, nên $f$ tăng nhanh hơn hẳn: $f\\neq O(g)$, nhưng $g=O(f)$ vì $\\frac{g(x)}{f(x)}=\\frac{4}{x}\\to0$ bị chặn. Chỉ (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: procedure LS($x,a_1,\\ldots,a_n$: integer): $i:=1$; while ($i\\le n$ and $x>a_i$): $i:=i+1$. How many comparisons are used in the algorithm with input $x=10$ and the sequence $1,3,5,7,9,11$?|||Cho thuật toán: procedure LS($x,a_1,\\ldots,a_n$: integer): $i:=1$; while ($i\\le n$ và $x>a_i$): $i:=i+1$. Thuật toán dùng bao nhiêu phép so sánh với đầu vào $x=10$ và dãy $1,3,5,7,9,11$ ($n=6$)?",
          "options": [
            {
              "text": "11|||11"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Each while-check does 2 comparisons: $i\\le n$ then $x>a_i$ (short-circuit, so $x>a_i$ is only checked when $i\\le n$ holds). For $i=1..5$: $x=10>a_i\\in\\{1,3,5,7,9\\}$ all true, so $i$ advances to 6. At $i=6$: $6\\le6$ true, but $10>11$ false, loop stops. That is 6 checks of $i\\le n$ (all true) and 6 checks of $x>a_i$ (5 true, 1 false) $=6+6=12$ comparisons total.</div><div class=\"ml-vi\">Mỗi lần kiểm tra while thực hiện 2 phép so sánh: $i\\le n$ rồi $x>a_i$ (đoản mạch, chỉ kiểm $x>a_i$ khi $i\\le n$ đúng). Với $i=1..5$: $x=10>a_i\\in\\{1,3,5,7,9\\}$ đều đúng, nên $i$ tăng tới 6. Tại $i=6$: $6\\le6$ đúng, nhưng $10>11$ sai, dừng vòng lặp. Vậy có 6 lần kiểm $i\\le n$ (đều đúng) và 6 lần kiểm $x>a_i$ (5 đúng, 1 sai) $=6+6=12$ phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{x_n\\}$ be a sequence of pseudorandom numbers such that $x_{n+1}=(3x_n+4)\\bmod16$ for $n>0$. Suppose $x_3=9$. Find $x_2$ and $x_4$.|||Cho $\\{x_n\\}$ là dãy số giả ngẫu nhiên với $x_{n+1}=(3x_n+4)\\bmod16$ với $n>0$. Giả sử $x_3=9$. Tìm $x_2$ và $x_4$.",
          "options": [
            {
              "text": "7 and 1|||7 và 1"
            },
            {
              "text": "6 and 15|||6 và 15"
            },
            {
              "text": "3 and 15|||3 và 15"
            },
            {
              "text": "7 and 15|||7 và 15"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$x_4=(3\\cdot9+4)\\bmod16=31\\bmod16=15$. For $x_2$: need $3x_2+4\\equiv9\\pmod{16}\\Rightarrow3x_2\\equiv5\\pmod{16}$. Since $3\\cdot11=33\\equiv1\\pmod{16}$, the inverse of 3 is 11, so $x_2\\equiv11\\cdot5=55\\equiv55-48=7\\pmod{16}$. Check: $(3\\cdot7+4)\\bmod16=25\\bmod16=9$. So $x_2=7,x_4=15$.</div><div class=\"ml-vi\">$x_4=(3\\cdot9+4)\\bmod16=31\\bmod16=15$. Với $x_2$: cần $3x_2+4\\equiv9\\pmod{16}\\Rightarrow3x_2\\equiv5\\pmod{16}$. Vì $3\\cdot11=33\\equiv1\\pmod{16}$, nghịch đảo của 3 là 11, nên $x_2\\equiv11\\cdot5=55\\equiv55-48=7\\pmod{16}$. Kiểm: $(3\\cdot7+4)\\bmod16=25\\bmod16=9$. Vậy $x_2=7,x_4=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a=131\\bmod37$ and $b=-131\\bmod37$. Find $a-b$.|||Cho $a=131\\bmod37$ và $b=-131\\bmod37$. Tìm $a-b$.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "-3|||-3"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "-21|||-21"
            },
            {
              "text": "17|||17"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$131=3(37)+20$, so $a=20$. $-131=-4(37)+17$ (since $-148+17=-131$), so $b=17$. $a-b=20-17=3$.</div><div class=\"ml-vi\">$131=3(37)+20$, nên $a=20$. $-131=-4(37)+17$ (vì $-148+17=-131$), nên $b=17$. $a-b=20-17=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 0s are there at the end of $24!$?|||Có bao nhiêu chữ số 0 ở cuối $24!$?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The number of trailing zeros equals the number of factors of 5 in $24!$: $\\lfloor24/5\\rfloor+\\lfloor24/25\\rfloor=4+0=4$.</div><div class=\"ml-vi\">Số chữ số 0 cuối bằng số thừa số 5 trong $24!$: $\\lfloor24/5\\rfloor+\\lfloor24/25\\rfloor=4+0=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many primes are in $\\{89,111,103,205\\}$?|||Có bao nhiêu số nguyên tố trong $\\{89,111,103,205\\}$?",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$89$ is prime. $111=3\\times37$, not prime. $103$ is prime. $205=5\\times41$, not prime. So exactly 2 primes: 89 and 103.</div><div class=\"ml-vi\">$89$ là số nguyên tố. $111=3\\times37$, không nguyên tố. $103$ là số nguyên tố. $205=5\\times41$, không nguyên tố. Vậy đúng 2 số nguyên tố: 89 và 103.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $3^{17}\\bmod26$.|||Tìm $3^{17}\\bmod26$.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$3^3=27\\equiv1\\pmod{26}$, so 3 has order 3 mod 26. $17=3\\times5+2$, so $3^{17}\\equiv3^2=9\\pmod{26}$.</div><div class=\"ml-vi\">$3^3=27\\equiv1\\pmod{26}$, nên 3 có bậc 3 theo mod 26. $17=3\\times5+2$, nên $3^{17}\\equiv3^2=9\\pmod{26}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the product of $a=(1110)_2$ and $b=(1011)_2$.|||Tìm tích của $a=(1110)_2$ và $b=(1011)_2$.",
          "options": [
            {
              "text": "10011010|||10011010"
            },
            {
              "text": "11001001|||11001001"
            },
            {
              "text": "10001110|||10001110"
            },
            {
              "text": "11110000|||11110000"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$a=(1110)_2=14$, $b=(1011)_2=11$. $14\\times11=154$. Converting to binary: $154=128+16+8+2$, giving $(10011010)_2$.</div><div class=\"ml-vi\">$a=(1110)_2=14$, $b=(1011)_2=11$. $14\\times11=154$. Đổi sang nhị phân: $154=128+16+8+2$, cho $(10011010)_2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The harmonic numbers $H_j$, $j=1,2,3,\\ldots$, are defined by $H_j=1+\\frac12+\\frac13+\\ldots+\\frac1j$. $H(4)$ and $H(k+1)$ are ___. (i) $\\frac{21}{12}$ and $1+\\frac12+\\frac13+\\ldots+\\frac1k+\\frac1{k+1}$ (ii) $\\frac{25}{12}$ and $1+\\frac12+\\frac13+\\ldots+\\frac1{k-1}+\\frac1k$ (iii) $\\frac{25}{12}$ and $1+\\frac12+\\frac13+\\ldots+\\frac1{k+1}+\\frac1{k+2}$ (iv) $\\frac{25}{12}$ and $1+\\frac12+\\frac13+\\ldots+\\frac1k+\\frac1{k+1}$|||Các số điều hòa $H_j$, $j=1,2,3,\\ldots$, được định nghĩa bởi $H_j=1+\\frac12+\\frac13+\\ldots+\\frac1j$. $H(4)$ và $H(k+1)$ là ___. (i) $\\frac{21}{12}$ và $1+\\frac12+\\frac13+\\ldots+\\frac1k+\\frac1{k+1}$ (ii) $\\frac{25}{12}$ và $1+\\frac12+\\frac13+\\ldots+\\frac1{k-1}+\\frac1k$ (iii) $\\frac{25}{12}$ và $1+\\frac12+\\frac13+\\ldots+\\frac1{k+1}+\\frac1{k+2}$ (iv) $\\frac{25}{12}$ và $1+\\frac12+\\frac13+\\ldots+\\frac1k+\\frac1{k+1}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$H(4)=1+\\frac12+\\frac13+\\frac14=\\frac{12+6+4+3}{12}=\\frac{25}{12}$, ruling out (i). By definition, $H(k+1)$ just extends $H_k$'s sum with one more term $\\frac1{k+1}$: $1+\\frac12+\\ldots+\\frac1k+\\frac1{k+1}$, exactly option (iv).</div><div class=\"ml-vi\">$H(4)=1+\\frac12+\\frac13+\\frac14=\\frac{12+6+4+3}{12}=\\frac{25}{12}$, loại (i). Theo định nghĩa, $H(k+1)$ chỉ mở rộng tổng của $H_k$ thêm một số hạng $\\frac1{k+1}$: $1+\\frac12+\\ldots+\\frac1k+\\frac1{k+1}$, đúng là đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S$ be the set defined recursively as follows: Basis step: $2\\in S$. Recursive step: if $x\\in S$ then $2x\\in S$. What is $S$? (i) $S=\\{2^n\\mid n=1,2,\\ldots\\}$ (ii) $S=\\{2^{2n}\\mid n=1,2,\\ldots\\}$ (iii) $S=\\{2n\\mid n=1,2,\\ldots\\}$|||Cho $S$ là tập được định nghĩa đệ quy như sau: Bước cơ sở: $2\\in S$. Bước đệ quy: nếu $x\\in S$ thì $2x\\in S$. $S$ là gì? (i) $S=\\{2^n\\mid n=1,2,\\ldots\\}$ (ii) $S=\\{2^{2n}\\mid n=1,2,\\ldots\\}$ (iii) $S=\\{2n\\mid n=1,2,\\ldots\\}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Starting from $2=2^1$, each step doubles the value: $2\\to4=2^2\\to8=2^3\\to16=2^4\\to\\ldots$. So $S=\\{2,4,8,16,\\ldots\\}=\\{2^n\\mid n=1,2,\\ldots\\}$, option (i).</div><div class=\"ml-vi\">Bắt đầu từ $2=2^1$, mỗi bước nhân đôi giá trị: $2\\to4=2^2\\to8=2^3\\to16=2^4\\to\\ldots$. Vậy $S=\\{2,4,8,16,\\ldots\\}=\\{2^n\\mid n=1,2,\\ldots\\}$, đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the set $S$ defined recursively: $(1,1),(1,2),(2,1)$ is in $S$. If $(a,b)$ is in $S$ then $(a+2,b)$ and $(a,b+2)$ are also in $S$. Which of the following pairs is in $S$?|||Cho tập $S$ được định nghĩa đệ quy: $(1,1),(1,2),(2,1)$ thuộc $S$. Nếu $(a,b)$ thuộc $S$ thì $(a+2,b)$ và $(a,b+2)$ cũng thuộc $S$. Cặp nào sau đây thuộc $S$?",
          "options": [
            {
              "text": "(5,4)|||(5,4)"
            },
            {
              "text": "(4,4)|||(4,4)"
            },
            {
              "text": "(2,6)|||(2,6)"
            },
            {
              "text": "(4,6)|||(4,6)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Adding 2 preserves parity, so from $(1,1)$ we reach all (odd,odd); from $(1,2)$ all (odd,even $\\ge2$); from $(2,1)$ all (even $\\ge2$,odd). No base pair has both coordinates even, so $S$ never contains a pair with both entries even -- ruling out (4,4),(2,6),(4,6). $(5,4)$ has $a=5$ odd, $b=4$ even: reachable from $(1,2)$ via $1\\to3\\to5$ and $2\\to4$.</div><div class=\"ml-vi\">Cộng 2 giữ nguyên tính chẵn lẻ, nên từ $(1,1)$ ta đến mọi (lẻ,lẻ); từ $(1,2)$ mọi (lẻ,chẵn $\\ge2$); từ $(2,1)$ mọi (chẵn $\\ge2$,lẻ). Không cặp gốc nào có cả hai tọa độ chẵn, nên $S$ không bao giờ chứa cặp có cả hai đều chẵn -- loại (4,4),(2,6),(4,6). $(5,4)$ có $a=5$ lẻ, $b=4$ chẵn: đến được từ $(1,2)$ qua $1\\to3\\to5$ và $2\\to4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed to merge the two lists $1,3,5,7,8,10$ and $2,4,6,9$?|||Cần bao nhiêu phép so sánh để trộn hai dãy $1,3,5,7,8,10$ và $2,4,6,9$?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Simulating the merge algorithm: compare 1,2(take1); 3,2(take2); 3,4(take3); 5,4(take4); 5,6(take5); 7,6(take6); 7,9(take7); 8,9(take8); 10,9(take9) -- second list exhausted, append remaining 10 with no comparison. Total: 9 comparisons.</div><div class=\"ml-vi\">Mô phỏng thuật toán trộn: so sánh 1,2(lấy1); 3,2(lấy2); 3,4(lấy3); 5,4(lấy4); 5,6(lấy5); 7,6(lấy6); 7,9(lấy7); 8,9(lấy8); 10,9(lấy9) -- dãy 2 hết, thêm 10 còn lại không cần so sánh. Tổng: 9 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm that computes the $n$-th Fibonacci number: procedure F($n$: natural number): if $n=0$ then $F(n):=0$ else if $n=1$ then $F(n):=1$ else $F(n):=F(n-1)+F(n-2)$. How many additions are used if $n=6$?|||Cho thuật toán đệ quy tính số Fibonacci thứ $n$: procedure F($n$: natural number): nếu $n=0$ thì $F(n):=0$ ngược lại nếu $n=1$ thì $F(n):=1$ ngược lại $F(n):=F(n-1)+F(n-2)$. Cần bao nhiêu phép cộng nếu $n=6$?",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Let $a(n)$ be the number of additions for $F(n)$: $a(0)=a(1)=0$, $a(n)=a(n-1)+a(n-2)+1$. Then $a(2)=1,a(3)=2,a(4)=4,a(5)=7,a(6)=a(5)+a(4)+1=7+4+1=12$.</div><div class=\"ml-vi\">Gọi $a(n)$ là số phép cộng để tính $F(n)$: $a(0)=a(1)=0$, $a(n)=a(n-1)+a(n-2)+1$. Khi đó $a(2)=1,a(3)=2,a(4)=4,a(5)=7,a(6)=a(5)+a(4)+1=7+4+1=12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many strings of four decimal digits have exactly two digits that are 0s?|||Có bao nhiêu chuỗi bốn chữ số thập phân có đúng hai chữ số là 0?",
          "options": [
            {
              "text": "486|||486"
            },
            {
              "text": "560|||560"
            },
            {
              "text": "600|||600"
            },
            {
              "text": "None of them.|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Choose 2 of the 4 positions to be 0: $\\binom{4}{2}=6$ ways. The remaining 2 positions must be nonzero digits (1-9): $9\\times9=81$ ways. Total: $6\\times81=486$.</div><div class=\"ml-vi\">Chọn 2 trong 4 vị trí để là 0: $\\binom{4}{2}=6$ cách. 2 vị trí còn lại phải là chữ số khác 0 (1-9): $9\\times9=81$ cách. Tổng: $6\\times81=486$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many one-to-one functions are there from a set with 5 elements to another set with 10 elements?|||Có bao nhiêu hàm đơn ánh từ một tập 5 phần tử đến một tập 10 phần tử?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "30240|||30240"
            },
            {
              "text": "100000|||100000"
            },
            {
              "text": "50|||50"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The count of injections from a 5-set to a 10-set is $P(10,5)=10\\times9\\times8\\times7\\times6=30240$.</div><div class=\"ml-vi\">Số đơn ánh từ tập 5 phần tử đến tập 10 phần tử là $P(10,5)=10\\times9\\times8\\times7\\times6=30240$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A young pair of rabbits (one of each sex) is placed on an island. A pair of rabbits does not breed until they are 2 months old. After they are 2 months old they will produce 2 pairs of rabbits each month. Find the number of pairs of rabbits after 5 months.|||Một cặp thỏ non (một đực một cái) được đặt trên một hòn đảo. Một cặp thỏ không sinh sản cho đến khi được 2 tháng tuổi. Sau khi được 2 tháng tuổi, mỗi cặp sẽ sinh ra 2 cặp thỏ mỗi tháng. Tìm số cặp thỏ sau 5 tháng.",
          "options": [
            {
              "text": "11|||11"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "20|||20"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Let $f(n)$ be the number of pairs at month $n$. New pairs born each month come from pairs $\\ge2$ months old, i.e. those existing 2 months earlier, each producing 2 pairs: $f(n)=f(n-1)+2f(n-2)$, with $f(0)=f(1)=1$. Then $f(2)=1+2=3$, $f(3)=3+2=5$, $f(4)=5+6=11$, $f(5)=11+10=21$.</div><div class=\"ml-vi\">Gọi $f(n)$ là số cặp thỏ ở tháng $n$. Số cặp mới sinh mỗi tháng đến từ các cặp $\\ge2$ tháng tuổi, tức các cặp đã tồn tại 2 tháng trước, mỗi cặp sinh 2 cặp: $f(n)=f(n-1)+2f(n-2)$, với $f(0)=f(1)=1$. Vậy $f(2)=1+2=3$, $f(3)=3+2=5$, $f(4)=5+6=11$, $f(5)=11+10=21$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)=7f(n/2)+15n^2/4$ when $n$ is an even positive integer. Give the best big-O estimate for $f(n)$ if $f$ is an increasing function. (i) $O(n^7)$ (ii) $O(n^2)$ (iii) $O(n^2\\log n)$ (iv) $O(n^{\\log_2 7})$|||Giả sử $f(n)=7f(n/2)+15n^2/4$ khi $n$ là số nguyên dương chẵn. Cho ước lượng big-O tốt nhất của $f(n)$ nếu $f$ là hàm tăng. (i) $O(n^7)$ (ii) $O(n^2)$ (iii) $O(n^2\\log n)$ (iv) $O(n^{\\log_2 7})$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is a divide-and-conquer recurrence with $a=7,b=2,g(n)=\\Theta(n^2)$. Since $\\log_2 7\\approx2.807>2$, the recursive term dominates (master theorem case where $g(n)=O(n^{\\log_b a-\\epsilon})$), giving $f(n)=\\Theta(n^{\\log_2 7})$, so the best big-O estimate is $O(n^{\\log_2 7})$, option (iv).</div><div class=\"ml-vi\">Đây là công thức truy hồi chia để trị với $a=7,b=2,g(n)=\\Theta(n^2)$. Vì $\\log_2 7\\approx2.807>2$, số hạng đệ quy chiếm ưu thế (định lý thợ với $g(n)=O(n^{\\log_b a-\\epsilon})$), cho $f(n)=\\Theta(n^{\\log_2 7})$, nên ước lượng big-O tốt nhất là $O(n^{\\log_2 7})$, đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be a bipartite simple graph with 6 vertices. Find the maximum number of edges of $G$.|||Cho $G$ là đơn đồ thị lưỡng phân với 6 đỉnh. Tìm số cạnh lớn nhất của $G$.",
          "options": [
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For a bipartite graph on $n$ vertices, the edge count is maximized by splitting the parts as evenly as possible: $3+3$, giving $K_{3,3}$ with $3\\times3=9$ edges.</div><div class=\"ml-vi\">Với đồ thị lưỡng phân trên $n$ đỉnh, số cạnh lớn nhất đạt được khi chia hai phần đều nhau nhất: $3+3$, cho $K_{3,3}$ với $3\\times3=9$ cạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A complete bipartite graph $K_{m,n}$ ($m>1,n>1$) with 15 edges has ___.|||Đồ thị lưỡng phân đầy đủ $K_{m,n}$ ($m>1,n>1$) với 15 cạnh có ___.",
          "options": [
            {
              "text": "7 vertices|||7 đỉnh"
            },
            {
              "text": "8 vertices|||8 đỉnh"
            },
            {
              "text": "9 vertices|||9 đỉnh"
            },
            {
              "text": "10 vertices|||10 đỉnh"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$K_{m,n}$ has $mn$ edges. With $mn=15$ and $m,n>1$, the only factorization is $3\\times5$, so $\\{m,n\\}=\\{3,5\\}$ and the graph has $m+n=8$ vertices.</div><div class=\"ml-vi\">$K_{m,n}$ có $mn$ cạnh. Với $mn=15$ và $m,n>1$, cách phân tích duy nhất là $3\\times5$, nên $\\{m,n\\}=\\{3,5\\}$ và đồ thị có $m+n=8$ đỉnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $M$ be the incidence matrix of the given graph with the rows indexed by $v_1,v_2,v_3,v_4$ and the columns indexed by $e_1,e_2,e_3,e_4,e_5$. The graph has vertices $v_1$(top-left), $v_2$(top-right), $v_3$(bottom-right), $v_4$(bottom-left), with edges $e_1=v_1v_2$ (top), $e_2=v_1v_4$ (left), $e_3=v_4v_2$ (diagonal), $e_4=v_1v_3$ (diagonal), $e_5=v_4v_3$ (bottom). What is the sum of the entries in the fourth row of $M$ (row $v_4$)?|||Cho $M$ là ma trận liên thuộc của đồ thị với các hàng đánh số $v_1,v_2,v_3,v_4$ và các cột đánh số $e_1,e_2,e_3,e_4,e_5$. Đồ thị có đỉnh $v_1$(trên-trái), $v_2$(trên-phải), $v_3$(dưới-phải), $v_4$(dưới-trái), với cạnh $e_1=v_1v_2$ (trên), $e_2=v_1v_4$ (trái), $e_3=v_4v_2$ (chéo), $e_4=v_1v_3$ (chéo), $e_5=v_4v_3$ (dưới). Tổng các phần tử của hàng thứ tư trong $M$ (hàng $v_4$) là bao nhiêu?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The sum of a vertex's row in the incidence matrix equals its degree. $v_4$ is incident to $e_2$ ($v_1v_4$), $e_3$ ($v_4v_2$), and $e_5$ ($v_4v_3$) -- degree 3, so the row sum is 3.</div><div class=\"ml-vi\">Tổng hàng của một đỉnh trong ma trận liên thuộc bằng bậc của đỉnh đó. $v_4$ liên thuộc với $e_2$ ($v_1v_4$), $e_3$ ($v_4v_2$), và $e_5$ ($v_4v_3$) -- bậc 3, nên tổng hàng là 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given two undirected simple graphs $G$ and $H$ with adjacency matrices $A_G$ (rows/cols $a,b,c,d$): $a$-row $[0,1,1,1]$, $b$-row $[1,0,1,0]$, $c$-row $[1,1,0,0]$, $d$-row $[1,0,0,0]$; and $A_H$ (rows/cols $x,y,z,t$): $x$-row $[0,1,1,0]$, $y$-row $[1,0,1,1]$, $z$-row $[1,1,0,0]$, $t$-row $[0,1,0,0]$. Which statements are correct? (i) $G$ and $H$ are not isomorphic because they have different adjacency matrices. (ii) The function $f:\\{a,b,c,d\\}\\to\\{x,y,z,t\\}$ with $f(a)=y,f(b)=x,f(c)=z,f(d)=t$ is an isomorphism.|||Cho hai đơn đồ thị vô hướng $G$ và $H$ với ma trận kề $A_G$ (hàng/cột $a,b,c,d$): hàng $a$ $[0,1,1,1]$, hàng $b$ $[1,0,1,0]$, hàng $c$ $[1,1,0,0]$, hàng $d$ $[1,0,0,0]$; và $A_H$ (hàng/cột $x,y,z,t$): hàng $x$ $[0,1,1,0]$, hàng $y$ $[1,0,1,1]$, hàng $z$ $[1,1,0,0]$, hàng $t$ $[0,1,0,0]$. Phát biểu nào đúng? (i) $G$ và $H$ không đẳng cấu vì có ma trận kề khác nhau. (ii) Hàm $f:\\{a,b,c,d\\}\\to\\{x,y,z,t\\}$ với $f(a)=y,f(b)=x,f(c)=z,f(d)=t$ là một phép đẳng cấu.",
          "options": [
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "None of (i) or (ii)|||Không (i) hay (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) is false: adjacency matrices differ depending on vertex ordering/labeling, so different matrices alone never prove non-isomorphism. (ii): $G$'s edges are $ab,ac,ad,bc$. Under $f$: $ab\\to yx$ (edge in $H$), $ac\\to yz$ (edge), $ad\\to yt$ (edge), $bc\\to xz$ (edge) -- all 4 edges map to $H$'s 4 edges ($xy,xz,yz,yt$) bijectively, so $f$ is indeed an isomorphism. Only (ii) is correct.</div><div class=\"ml-vi\">(i) sai: ma trận kề khác nhau tùy thứ tự/nhãn đỉnh, nên chỉ riêng ma trận khác nhau không bao giờ chứng minh không đẳng cấu. (ii): cạnh của $G$ là $ab,ac,ad,bc$. Qua $f$: $ab\\to yx$ (cạnh của $H$), $ac\\to yz$ (cạnh), $ad\\to yt$ (cạnh), $bc\\to xz$ (cạnh) -- cả 4 cạnh ánh xạ song ánh tới 4 cạnh của $H$ ($xy,xz,yz,yt$), nên $f$ đúng là một phép đẳng cấu. Chỉ (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the graph $G$ with vertices $a,b,c,f,d,e,g$ and edges $ab,ac,bc,cf,cd,fd,fg,de$ (two triangles $abc$ and $cfd$ sharing vertex $c$, with pendant vertices $g$ attached to $f$ and $e$ attached to $d$). How many cut vertices does this graph have?|||Cho đồ thị $G$ với các đỉnh $a,b,c,f,d,e,g$ và các cạnh $ab,ac,bc,cf,cd,fd,fg,de$ (hai tam giác $abc$ và $cfd$ chung đỉnh $c$, với đỉnh treo $g$ nối vào $f$ và $e$ nối vào $d$). Đồ thị này có bao nhiêu đỉnh cắt?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Removing $c$ disconnects $\\{a,b\\}$ from $\\{f,d,e,g\\}$ -- cut vertex. Removing $f$ isolates $g$ -- cut vertex. Removing $d$ isolates $e$ -- cut vertex. Removing $a$, $b$, $g$, or $e$ leaves the rest connected. Total: 3 cut vertices ($c,f,d$).</div><div class=\"ml-vi\">Bỏ $c$ làm tách $\\{a,b\\}$ khỏi $\\{f,d,e,g\\}$ -- đỉnh cắt. Bỏ $f$ làm cô lập $g$ -- đỉnh cắt. Bỏ $d$ làm cô lập $e$ -- đỉnh cắt. Bỏ $a$, $b$, $g$, hoặc $e$ vẫn giữ phần còn lại liên thông. Tổng: 3 đỉnh cắt ($c,f,d$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be an undirected graph of three vertices $A,B,C$ with the adjacency matrix $\\begin{pmatrix}1&3&0\\\\3&0&1\\\\0&1&2\\end{pmatrix}$ (rows/cols ordered $A,B,C$). How many paths of length 3 from $A$ to $C$ are there in $G$?|||Cho $G$ là đồ thị vô hướng ba đỉnh $A,B,C$ với ma trận kề $\\begin{pmatrix}1&3&0\\\\3&0&1\\\\0&1&2\\end{pmatrix}$ (hàng/cột theo thứ tự $A,B,C$). Có bao nhiêu đường đi độ dài 3 từ $A$ đến $C$ trong $G$?",
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The number of walks of length 3 from $A$ to $C$ is entry $(A,C)$ of $M^3$. Computing $M^2=\\begin{pmatrix}10&3&3\\\\3&10&2\\\\3&2&5\\end{pmatrix}$, then $(M^3)_{A,C}=M^2_{A,A}M_{A,C}+M^2_{A,B}M_{B,C}+M^2_{A,C}M_{C,C}=10(0)+3(1)+3(2)=0+3+6=9$.</div><div class=\"ml-vi\">Số đường đi độ dài 3 từ $A$ đến $C$ là phần tử $(A,C)$ của $M^3$. Tính $M^2=\\begin{pmatrix}10&3&3\\\\3&10&2\\\\3&2&5\\end{pmatrix}$, rồi $(M^3)_{A,C}=M^2_{A,A}M_{A,C}+M^2_{A,B}M_{B,C}+M^2_{A,C}M_{C,C}=10(0)+3(1)+3(2)=0+3+6=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $m>n>2$. Which of the following graphs do NOT have Hamilton circuits?|||Cho $m>n>2$. Đồ thị nào sau đây KHÔNG có chu trình Hamilton?",
          "options": [
            {
              "text": "$K_{m,n}$|||$K_{m,n}$"
            },
            {
              "text": "$C_n$|||$C_n$"
            },
            {
              "text": "$Q_n$|||$Q_n$"
            },
            {
              "text": "$K_n$|||$K_n$"
            },
            {
              "text": "$W_n$|||$W_n$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A complete bipartite graph $K_{m,n}$ has a Hamilton circuit only when $m=n$ (a cycle must alternate between the two parts equally). Since $m>n$, $K_{m,n}$ has no Hamilton circuit. Cycles $C_n$, hypercubes $Q_n$, complete graphs $K_n$ ($n\\ge3$), and wheels $W_n$ are all always Hamiltonian.</div><div class=\"ml-vi\">Đồ thị lưỡng phân đầy đủ $K_{m,n}$ chỉ có chu trình Hamilton khi $m=n$ (chu trình phải luân phiên đều giữa hai phần). Vì $m>n$, $K_{m,n}$ không có chu trình Hamilton. Chu trình $C_n$, siêu khối $Q_n$, đồ thị đầy đủ $K_n$ ($n\\ge3$), và đồ thị bánh xe $W_n$ đều luôn có chu trình Hamilton.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graphs have Euler circuits? (i) $K_4$ (ii) $C_4$ (iii) $C_5$ (iv) $Q_3$|||Đồ thị nào có chu trình Euler? (i) $K_4$ (ii) $C_4$ (iii) $C_5$ (iv) $Q_3$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A connected graph has an Euler circuit iff every vertex has even degree. $K_4$: every vertex has degree 3 (odd) -- no. $C_4,C_5$: every vertex has degree 2 (even) -- yes for both. $Q_3$: every vertex has degree 3 (odd) -- no. So (ii) and (iii).</div><div class=\"ml-vi\">Đồ thị liên thông có chu trình Euler khi và chỉ khi mọi đỉnh có bậc chẵn. $K_4$: mọi đỉnh bậc 3 (lẻ) -- không. $C_4,C_5$: mọi đỉnh bậc 2 (chẵn) -- có cho cả hai. $Q_3$: mọi đỉnh bậc 3 (lẻ) -- không. Vậy (ii) và (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Dijkstra's algorithm to find the shortest path from $A$ to $Z$ in the weighted graph with edges $AB=2,AC=7,BD=5,BC=4,BE=3,DE=2,CE=3,DZ=2,EZ=3$. What is the next chosen vertex after $E$?|||Dùng thuật toán Dijkstra để tìm đường đi ngắn nhất từ $A$ đến $Z$ trong đồ thị có trọng số với các cạnh $AB=2,AC=7,BD=5,BC=4,BE=3,DE=2,CE=3,DZ=2,EZ=3$. Đỉnh được chọn tiếp theo sau $E$ là gì?",
          "options": [
            {
              "text": "The vertex C|||Đỉnh C"
            },
            {
              "text": "The vertex D|||Đỉnh D"
            },
            {
              "text": "The vertex Z|||Đỉnh Z"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Order of selection: $A$(0) first, then $B$(2). Relaxing from $B$: $C=\\min(7,2+4)=6$, $D=2+5=7$, $E=2+3=5$. Next smallest unvisited is $E$(5). Relaxing from $E$: $C=\\min(6,5+3)=6$ (no change), $D=\\min(7,5+2)=7$ (no change), $Z=5+3=8$. The next smallest unvisited distance is $C$ at 6 (less than $D$'s 7), so $C$ is chosen next.</div><div class=\"ml-vi\">Thứ tự chọn: $A$(0) trước, rồi $B$(2). Nới lỏng từ $B$: $C=\\min(7,2+4)=6$, $D=2+5=7$, $E=2+3=5$. Đỉnh chưa thăm nhỏ nhất tiếp theo là $E$(5). Nới lỏng từ $E$: $C=\\min(6,5+3)=6$ (không đổi), $D=\\min(7,5+2)=7$ (không đổi), $Z=5+3=8$. Khoảng cách nhỏ nhất tiếp theo chưa thăm là $C$ ở mức 6 (nhỏ hơn 7 của $D$), nên $C$ được chọn tiếp theo.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many vertices in a full 4-ary tree with 50 internal vertices?|||Có bao nhiêu đỉnh trong một cây 4-phân đầy đủ với 50 đỉnh trong?",
          "options": [
            {
              "text": "50|||50"
            },
            {
              "text": "201|||201"
            },
            {
              "text": "54|||54"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "200|||200"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For a full $m$-ary tree with $i$ internal vertices, the total number of vertices is $n=mi+1$. Here $m=4,i=50$: $n=4(50)+1=201$.</div><div class=\"ml-vi\">Với cây $m$-phân đầy đủ có $i$ đỉnh trong, tổng số đỉnh là $n=mi+1$. Ở đây $m=4,i=50$: $n=4(50)+1=201$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the minimum value of the height of a full 3-ary tree with 40 internal vertices?|||Giá trị nhỏ nhất của chiều cao một cây 3-phân đầy đủ với 40 đỉnh trong là bao nhiêu?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">To minimize height, pack internal vertices as high as possible: with height $h$, the maximum internal vertices achievable is $1+3+9+\\ldots+3^{h-1}=\\frac{3^h-1}{2}$ (all levels $0..h-1$ full of internal nodes). For $h=3$: $\\frac{27-1}{2}=13<40$. For $h=4$: $\\frac{81-1}{2}=40$, exactly matching -- a perfect 3-ary tree of height 4 (levels 0-3 all internal: $1+3+9+27=40$) achieves exactly 40 internal vertices. So minimum height is 4.</div><div class=\"ml-vi\">Để tối thiểu chiều cao, dồn các đỉnh trong lên càng cao càng tốt: với chiều cao $h$, số đỉnh trong tối đa đạt được là $1+3+9+\\ldots+3^{h-1}=\\frac{3^h-1}{2}$ (mọi mức $0..h-1$ đều đầy đỉnh trong). Với $h=3$: $\\frac{27-1}{2}=13<40$. Với $h=4$: $\\frac{81-1}{2}=40$, khớp chính xác -- cây 3-phân hoàn hảo chiều cao 4 (mức 0-3 đều là đỉnh trong: $1+3+9+27=40$) đạt đúng 40 đỉnh trong. Vậy chiều cao nhỏ nhất là 4.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which are prefix codes? (i) $a:11,e:00,t:10,s:01$ (ii) $a:0,e:1,t:01,s:001$|||Bộ mã nào là mã tiền tố (prefix code)? (i) $a:11,e:00,t:10,s:01$ (ii) $a:0,e:1,t:01,s:001$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i): all four codewords have length 2 and are distinct, so none can be a prefix of another -- valid prefix code. (ii): codeword \"0\" (for $a$) is a prefix of \"01\" (for $t$), violating the prefix property -- not a prefix code. Only (i) qualifies.</div><div class=\"ml-vi\">(i): cả bốn từ mã đều dài 2 và khác nhau, nên không từ mã nào là tiền tố của từ khác -- là mã tiền tố hợp lệ. (ii): từ mã \"0\" (của $a$) là tiền tố của \"01\" (của $t$), vi phạm tính chất tiền tố -- không phải mã tiền tố. Chỉ (i) thỏa mãn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the message 'weekend'. Find the length of the bit string when encoding this message by a Huffman coding.|||Cho thông điệp 'weekend'. Tìm độ dài chuỗi bit khi mã hóa thông điệp này bằng mã Huffman.",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Frequencies: $e{:}3,w{:}1,k{:}1,n{:}1,d{:}1$ (total 7 letters). Merge the four weight-1 leaves pairwise into two weight-2 nodes, then merge those into a weight-4 node, then merge with $e$(3) at the root. This gives codeword length 1 for $e$ and length 3 for each of $w,k,n,d$. Total bits $=3(1)+1(3)+1(3)+1(3)+1(3)=3+12=15$.</div><div class=\"ml-vi\">Tần suất: $e{:}3,w{:}1,k{:}1,n{:}1,d{:}1$ (tổng 7 chữ). Ghép bốn lá trọng số 1 theo cặp thành hai nút trọng số 2, rồi ghép chúng thành một nút trọng số 4, rồi ghép với $e$(3) ở gốc. Điều này cho độ dài từ mã 1 cho $e$ và độ dài 3 cho mỗi $w,k,n,d$. Tổng bit $=3(1)+1(3)+1(3)+1(3)+1(3)=3+12=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the inorder traversal of the tree with root $a$; $a$'s children $c$ (left) and $m$ (right); $c$'s children $e$ (left), $h$ (right); $m$'s children $n$ (left), $t$ (right); $t$'s children $s$ (left), $y$ (right).|||Tìm phép duyệt trung thứ (inorder) của cây với gốc $a$; con của $a$ là $c$ (trái) và $m$ (phải); con của $c$ là $e$ (trái), $h$ (phải); con của $m$ là $n$ (trái), $t$ (phải); con của $t$ là $s$ (trái), $y$ (phải).",
          "options": [
            {
              "text": "e-h-c-n-s-y-t-m-a|||e-h-c-n-s-y-t-m-a"
            },
            {
              "text": "e-c-h-a-n-m-s-t-y|||e-c-h-a-n-m-s-t-y"
            },
            {
              "text": "e-c-h-n-m-s-t-y-a|||e-c-h-n-m-s-t-y-a"
            },
            {
              "text": "a-c-e-h-m-n-t-s-y|||a-c-e-h-m-n-t-s-y"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Inorder = left, root, right, recursively. Left subtree of $a$ (rooted at $c$) gives $e,c,h$. Then visit $a$. Right subtree of $a$ (rooted at $m$) gives: left leaf $n$, then $m$, then right subtree at $t$ gives $s,t,y$. Combined: $e,c,h,a,n,m,s,t,y$.</div><div class=\"ml-vi\">Trung thứ = trái, gốc, phải, đệ quy. Cây con trái của $a$ (gốc $c$) cho $e,c,h$. Rồi thăm $a$. Cây con phải của $a$ (gốc $m$) cho: lá trái $n$, rồi $m$, rồi cây con phải tại $t$ cho $s,t,y$. Kết hợp: $e,c,h,a,n,m,s,t,y$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the tree: root $a$ with children $b,c$; $b$'s children $d,e$; $e$'s children $i,j$; $j$'s children $m,n,o$; $c$'s children $f,g,h$; $h$'s children $k,l$; $l$'s child $p$. What is the position of the letter $n$ when using the preorder traversal?|||Cho cây: gốc $a$ với con $b,c$; con của $b$ là $d,e$; con của $e$ là $i,j$; con của $j$ là $m,n,o$; con của $c$ là $f,g,h$; con của $h$ là $k,l$; con của $l$ là $p$. Vị trí của chữ $n$ khi dùng phép duyệt tiền thứ (preorder) là bao nhiêu?",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Preorder = root then children left-to-right, recursively: $a,b,d,e,i,j,m,n,o,c,f,g,h,k,l,p$. Counting positions: $a$(1),$b$(2),$d$(3),$e$(4),$i$(5),$j$(6),$m$(7),$n$(8). So $n$ is at position 8.</div><div class=\"ml-vi\">Tiền thứ = gốc rồi các con trái sang phải, đệ quy: $a,b,d,e,i,j,m,n,o,c,f,g,h,k,l,p$. Đếm vị trí: $a$(1),$b$(2),$d$(3),$e$(4),$i$(5),$j$(6),$m$(7),$n$(8). Vậy $n$ ở vị trí 8.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a spanning tree for $K_{1,6}$. (i) a zigzag chain of 8 vertices each with degree $\\le2$ (ii) a tree with two branches of 3 vertices meeting through an extra vertex $d$ off $c$ (iii) a star: one center vertex connected to 6 leaf vertices|||Tìm cây khung của $K_{1,6}$. (i) một chuỗi ngoằn ngoèo 8 đỉnh mỗi đỉnh bậc $\\le2$ (ii) một cây với hai nhánh 3 đỉnh nối qua một đỉnh phụ $d$ từ $c$ (iii) hình sao: một đỉnh trung tâm nối tới 6 đỉnh lá",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$K_{1,6}$ is already a tree (a star with 1 center and 6 leaves, 6 edges, 7 vertices), so its only spanning tree is itself -- the star shape in (iii). (i) is a path-like zigzag (wrong shape/vertex count), (ii) is a different tree shape entirely.</div><div class=\"ml-vi\">$K_{1,6}$ vốn đã là một cây (hình sao 1 tâm và 6 lá, 6 cạnh, 7 đỉnh), nên cây khung duy nhất của nó chính là nó -- hình sao ở (iii). (i) là chuỗi ngoằn ngoèo giống đường đi (sai hình dạng/số đỉnh), (ii) là một hình cây hoàn toàn khác.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the total weight of a minimum spanning tree in the following undirected weighted graph with vertices $a,b,c,d,e,f,g,h$ and edges $ab{=}6,ad{=}2,bd{=}9,bc{=}12,dc{=}5,ch{=}3,ce{=}1,he{=}8,hg{=}10,hf{=}4,gf{=}7,ef{=}11$.|||Tìm tổng trọng số của cây khung nhỏ nhất trong đồ thị vô hướng có trọng số với các đỉnh $a,b,c,d,e,f,g,h$ và các cạnh $ab{=}6,ad{=}2,bd{=}9,bc{=}12,dc{=}5,ch{=}3,ce{=}1,he{=}8,hg{=}10,hf{=}4,gf{=}7,ef{=}11$.",
          "options": [
            {
              "text": "28|||28"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "27|||27"
            },
            {
              "text": "29|||29"
            },
            {
              "text": "31|||31"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Kruskal's algorithm in increasing weight order: $ce(1)$ add, $ad(2)$ add, $ch(3)$ add, $hf(4)$ add, $dc(5)$ add (connects the two components), $ab(6)$ add (connects $b$), $gf(7)$ add (connects $g$) -- now all 8 vertices connected with 7 edges, done. Total weight $=1+2+3+4+5+6+7=28$.</div><div class=\"ml-vi\">Thuật toán Kruskal theo thứ tự trọng số tăng dần: $ce(1)$ thêm, $ad(2)$ thêm, $ch(3)$ thêm, $hf(4)$ thêm, $dc(5)$ thêm (nối hai thành phần), $ab(6)$ thêm (nối $b$), $gf(7)$ thêm (nối $g$) -- giờ cả 8 đỉnh đã liên thông với 7 cạnh, xong. Tổng trọng số $=1+2+3+4+5+6+7=28$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D5",
      "source": "REAL",
      "sortOrder": 205,
      "title": "Final Exam — Đề 5|||Thi cuối kỳ — Đề 5",
      "description": "MAD101 Final Exam, Đề 5 (49 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 5 (49 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 98,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a proposition with the given truth table: $p{=}T,q{=}T\\to F$; $p{=}T,q{=}F\\to F$; $p{=}F,q{=}T\\to T$; $p{=}F,q{=}F\\to T$. (i) $(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)$ (ii) $\\neg p\\land q$ (iii) $q\\lor(\\neg p\\land\\neg q)$|||Tìm mệnh đề có bảng chân trị cho trước: $p{=}T,q{=}T\\to F$; $p{=}T,q{=}F\\to F$; $p{=}F,q{=}T\\to T$; $p{=}F,q{=}F\\to T$. (i) $(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)$ (ii) $\\neg p\\land q$ (iii) $q\\lor(\\neg p\\land\\neg q)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The table is exactly $\\neg p$ (true whenever $p$ is false, regardless of $q$). $(i)=(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)=\\neg p\\land(q\\lor\\neg q)=\\neg p\\land T=\\neg p$ -- matches. $(ii)$ fails at $p{=}F,q{=}F$: gives $F$, but table wants $T$. $(iii)$ fails at $p{=}T,q{=}T$: gives $T$, but table wants $F$.</div><div class=\"ml-vi\">Bảng chính là $\\neg p$ (đúng bất cứ khi nào $p$ sai, bất kể $q$). $(i)=(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)=\\neg p\\land(q\\lor\\neg q)=\\neg p\\land T=\\neg p$ -- khớp. $(ii)$ sai tại $p{=}F,q{=}F$: cho $F$, nhưng bảng cần $T$. $(iii)$ sai tại $p{=}T,q{=}T$: cho $T$, nhưng bảng cần $F$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose values of $p,q,r,s$ such that the proposition $(p\\to q)\\land(r\\to s)$ is False.|||Chọn giá trị $p,q,r,s$ sao cho mệnh đề $(p\\to q)\\land(r\\to s)$ là Sai (False).",
          "options": [
            {
              "text": "p=r=s=F, q=T|||p=r=s=F, q=T"
            },
            {
              "text": "p=s=T, q=r=F|||p=s=T, q=r=F"
            },
            {
              "text": "p=q=r=F, s=T|||p=q=r=F, s=T"
            },
            {
              "text": "p=q=T, r=s=F|||p=q=T, r=s=F"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Need at least one implication false. With $p=T,s=T,q=F,r=F$: $p\\to q=T\\to F=F$, $r\\to s=F\\to T=T$. Whole $=F\\land T=F$. Checking others: A gives $T\\land T=T$; C gives $T\\land T=T$; D gives $T\\land T=T$. Only B works.</div><div class=\"ml-vi\">Cần ít nhất một phép kéo theo sai. Với $p=T,s=T,q=F,r=F$: $p\\to q=T\\to F=F$, $r\\to s=F\\to T=T$. Toàn bộ $=F\\land T=F$. Kiểm các đáp án khác: A cho $T\\land T=T$; C cho $T\\land T=T$; D cho $T\\land T=T$. Chỉ B đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which propositions are tautology? (i) $[p\\lor(p\\to q)]\\to q$ (ii) $[p\\land(p\\to q)]\\to q$|||Mệnh đề nào là hằng đúng (tautology)? (i) $[p\\lor(p\\to q)]\\to q$ (ii) $[p\\land(p\\to q)]\\to q$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i) fails at $p=T,q=F$: $p\\lor(p\\to q)=T\\lor F=T$, then $T\\to q=T\\to F=F$ -- not a tautology. (ii) is exactly Modus Ponens, $[p\\land(p\\to q)]\\to q$, which is always true (checking all 4 rows confirms this).</div><div class=\"ml-vi\">(i) sai tại $p=T,q=F$: $p\\lor(p\\to q)=T\\lor F=T$, rồi $T\\to q=T\\to F=F$ -- không phải hằng đúng. (ii) chính là Modus Ponens, $[p\\land(p\\to q)]\\to q$, luôn đúng (kiểm cả 4 dòng xác nhận điều này).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the proposition $\\exists x(P(x)\\to Q(x))$. (i) $\\forall x(Q(x)\\to P(x))$ (ii) $\\forall x(\\neg Q(x)\\to P(x))$ (iii) $\\forall x(\\neg Q(x)\\land P(x))$ (iv) $\\forall x(\\neg Q(x)\\land\\neg P(x))$|||Tìm phủ định của mệnh đề $\\exists x(P(x)\\to Q(x))$. (i) $\\forall x(Q(x)\\to P(x))$ (ii) $\\forall x(\\neg Q(x)\\to P(x))$ (iii) $\\forall x(\\neg Q(x)\\land P(x))$ (iv) $\\forall x(\\neg Q(x)\\land\\neg P(x))$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\neg\\exists x(P(x)\\to Q(x))=\\forall x\\neg(P(x)\\to Q(x))=\\forall x(P(x)\\land\\neg Q(x))$, which is the same as $\\forall x(\\neg Q(x)\\land P(x))$, option (iii).</div><div class=\"ml-vi\">$\\neg\\exists x(P(x)\\to Q(x))=\\forall x\\neg(P(x)\\to Q(x))=\\forall x(P(x)\\land\\neg Q(x))$, giống với $\\forall x(\\neg Q(x)\\land P(x))$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be the statement \"$x$ is an even number\", where the domain is the set of all integers. Which proposition is TRUE? (i) $P(5)$ (ii) $\\forall xP(x)$ (iii) $\\exists xP(2x+1)$ (iv) $\\exists xP(2x)$ (v) $\\forall xP(x^2)$|||Cho $P(x)$ là mệnh đề \"$x$ là số chẵn\", miền là tập mọi số nguyên. Mệnh đề nào ĐÚNG? (i) $P(5)$ (ii) $\\forall xP(x)$ (iii) $\\exists xP(2x+1)$ (iv) $\\exists xP(2x)$ (v) $\\forall xP(x^2)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(v)|||(v)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$P(5)$ is false (5 is odd). $\\forall xP(x)$ is false (not all integers are even). $2x+1$ is always odd, so $\\exists xP(2x+1)$ is false. $2x$ is always even, so $P(2x)$ is true for every $x$ -- in particular $\\exists xP(2x)$ is true (e.g. $x=0$). $\\forall xP(x^2)$ fails at $x=1$ ($1$ is odd).</div><div class=\"ml-vi\">$P(5)$ sai (5 là số lẻ). $\\forall xP(x)$ sai (không phải mọi số nguyên đều chẵn). $2x+1$ luôn lẻ, nên $\\exists xP(2x+1)$ sai. $2x$ luôn chẵn, nên $P(2x)$ đúng với mọi $x$ -- đặc biệt $\\exists xP(2x)$ đúng (vd $x=0$). $\\forall xP(x^2)$ sai tại $x=1$ (1 là số lẻ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T(x,y)$ mean that \"student $x$ likes cuisine $y$\". Translate the logical expression $\\forall x\\forall z\\exists y((x\\neq z)\\to\\neg(T(x,y)\\land T(z,y)))$ into a sentence.|||Cho $T(x,y)$ nghĩa là \"sinh viên $x$ thích ẩm thực $y$\". Diễn dịch biểu thức logic $\\forall x\\forall z\\exists y((x\\neq z)\\to\\neg(T(x,y)\\land T(z,y)))$ thành câu.",
          "options": [
            {
              "text": "Any two different students will like the same cuisine.|||Bất kỳ hai sinh viên khác nhau nào cũng sẽ thích cùng một món ẩm thực."
            },
            {
              "text": "There exists two different students who don't like the same cuisine.|||Tồn tại hai sinh viên khác nhau không thích cùng một món ẩm thực."
            },
            {
              "text": "For every two different students, there will be a cuisine either of them does not like.|||Với mọi hai sinh viên khác nhau, sẽ có một món ẩm thực mà ít nhất một trong hai không thích."
            },
            {
              "text": "For every two different students, there will be a cuisine they both don't like.|||Với mọi hai sinh viên khác nhau, sẽ có một món ẩm thực mà cả hai đều không thích."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\neg(T(x,y)\\land T(z,y))$ means NOT both $x$ and $z$ like cuisine $y$, i.e. at least one of them dislikes $y$. Combined with $\\forall x\\forall z\\exists y$: for every pair of different students, there is a cuisine that at least one of them does not like -- exactly option (iii)'s wording.</div><div class=\"ml-vi\">$\\neg(T(x,y)\\land T(z,y))$ nghĩa là KHÔNG PHẢI cả $x$ và $z$ đều thích ẩm thực $y$, tức ít nhất một trong hai không thích $y$. Kết hợp với $\\forall x\\forall z\\exists y$: với mọi cặp sinh viên khác nhau, có một món ẩm thực mà ít nhất một trong hai không thích -- đúng nghĩa của đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following propositions is False, where $x,y,z$ represent integers. (i) $\\forall x\\exists y\\exists z(y=(x+z)/2)$ (ii) $\\forall x\\exists y(x=y^{2011})$ (iii) $\\exists x\\forall y((y\\neq0)\\to(y\\neq x^2))$|||Mệnh đề nào sau đây Sai, với $x,y,z$ là các số nguyên. (i) $\\forall x\\exists y\\exists z(y=(x+z)/2)$ (ii) $\\forall x\\exists y(x=y^{2011})$ (iii) $\\exists x\\forall y((y\\neq0)\\to(y\\neq x^2))$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) is true: for any $x$, choose $y=0,z=-x$, giving $y=(x+z)/2=0$. (ii) is false: not every integer is a perfect 2011th power of an integer, e.g. $x=2$ has no integer $y$ with $y^{2011}=2$. (iii) is true: choosing $x=0$ makes $x^2=0$, so for all $y\\neq0$, $y\\neq x^2$ trivially holds. So (ii) is the false one.</div><div class=\"ml-vi\">(i) đúng: với mọi $x$, chọn $y=0,z=-x$, cho $y=(x+z)/2=0$. (ii) sai: không phải mọi số nguyên đều là lũy thừa bậc 2011 hoàn hảo của một số nguyên, ví dụ $x=2$ không có số nguyên $y$ nào với $y^{2011}=2$. (iii) đúng: chọn $x=0$ làm $x^2=0$, nên với mọi $y\\neq0$, $y\\neq x^2$ luôn đúng. Vậy (ii) là mệnh đề sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What rule of inference is used in this argument? \"David is an awesome friend. David is also a good teacher. Therefore, David is an awesome friend and a good teacher.\"|||Quy tắc suy luận nào được dùng trong lập luận này? \"David là một người bạn tuyệt vời. David cũng là một giáo viên tốt. Vậy David là một người bạn tuyệt vời và là một giáo viên tốt.\"",
          "options": [
            {
              "text": "Conjunction|||Hội (Conjunction)"
            },
            {
              "text": "Modus ponens|||Modus ponens"
            },
            {
              "text": "Disjunctive syllogism|||Tam đoạn luận tuyển"
            },
            {
              "text": "Simplification|||Rút gọn (Simplification)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Given two separate premises $p$ and $q$, concluding $p\\land q$ is exactly the Conjunction rule of inference.</div><div class=\"ml-vi\">Cho hai tiền đề riêng $p$ và $q$, kết luận $p\\land q$ chính xác là quy tắc suy luận Hội (Conjunction).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine the true statements: 1) $a\\in\\{a\\}$ 2) $\\{a\\}\\in\\{a\\}$ 3) $a\\subseteq\\{a,b\\}$ 4) $\\{a,b\\}\\in\\{a,b,c,d\\}$ 5) $\\emptyset\\subseteq\\{\\emptyset\\}$ 6) $\\emptyset\\times\\{a\\}=\\emptyset$|||Xác định các phát biểu đúng: 1) $a\\in\\{a\\}$ 2) $\\{a\\}\\in\\{a\\}$ 3) $a\\subseteq\\{a,b\\}$ 4) $\\{a,b\\}\\in\\{a,b,c,d\\}$ 5) $\\emptyset\\subseteq\\{\\emptyset\\}$ 6) $\\emptyset\\times\\{a\\}=\\emptyset$",
          "options": [
            {
              "text": "1,2,3|||1,2,3"
            },
            {
              "text": "1,5,6|||1,5,6"
            },
            {
              "text": "1,4,6|||1,4,6"
            },
            {
              "text": "2,3,5|||2,3,5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">1) True: $a$ is the sole element of $\\{a\\}$. 2) False: the sole element of $\\{a\\}$ is $a$, not the set $\\{a\\}$. 3) False: $a$ is an element, not a subset (subset requires a set argument). 4) False: the elements of $\\{a,b,c,d\\}$ are $a,b,c,d$ individually, not the set $\\{a,b\\}$. 5) True: the empty set is a subset of every set. 6) True: the Cartesian product with the empty set is always empty. So true statements are 1,5,6.</div><div class=\"ml-vi\">1) Đúng: $a$ là phần tử duy nhất của $\\{a\\}$. 2) Sai: phần tử duy nhất của $\\{a\\}$ là $a$, không phải tập $\\{a\\}$. 3) Sai: $a$ là một phần tử, không phải tập con (tập con cần đối số là một tập hợp). 4) Sai: các phần tử của $\\{a,b,c,d\\}$ là $a,b,c,d$ riêng lẻ, không phải tập $\\{a,b\\}$. 5) Đúng: tập rỗng là tập con của mọi tập hợp. 6) Đúng: tích Descartes với tập rỗng luôn là tập rỗng. Vậy các phát biểu đúng là 1,5,6.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A,B$ be sets such that $|B|=|A|+1$. Assume that the set $A\\times B$ has 90 elements. Find $|A|$.|||Cho $A,B$ là các tập sao cho $|B|=|A|+1$. Giả sử tập $A\\times B$ có 90 phần tử. Tìm $|A|$.",
          "options": [
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Let $n=|A|$. Then $|B|=n+1$ and $|A\\times B|=n(n+1)=90$. Solving $n^2+n-90=0$ gives $n=\\frac{-1+\\sqrt{1+360}}{2}=\\frac{-1+19}{2}=9$.</div><div class=\"ml-vi\">Đặt $n=|A|$. Khi đó $|B|=n+1$ và $|A\\times B|=n(n+1)=90$. Giải $n^2+n-90=0$ cho $n=\\frac{-1+\\sqrt{1+360}}{2}=\\frac{-1+19}{2}=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A class has 50 students, out of which 20 students are good at Math, 30 students are good at Python, and 10 students are good at both Math and Python. How many students in the class are neither good at Math nor Python?|||Một lớp có 50 sinh viên, trong đó 20 sinh viên giỏi Toán, 30 sinh viên giỏi Python, và 10 sinh viên giỏi cả Toán lẫn Python. Có bao nhiêu sinh viên trong lớp không giỏi cả Toán lẫn Python?",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "35|||35"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">By inclusion-exclusion, $|M\\cup P|=20+30-10=40$. Neither $=50-40=10$.</div><div class=\"ml-vi\">Theo nguyên lý bù trừ, $|M\\cup P|=20+30-10=40$. Không giỏi cả hai $=50-40=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f,g:\\mathbb{N}\\to\\mathbb{N}$ be two functions defined respectively by $f(n)=2n$ and $g(n)=3n-1$. The value of the composition $g\\circ f$ at $n=2$ is ___|||Cho $f,g:\\mathbb{N}\\to\\mathbb{N}$ là hai hàm được định nghĩa lần lượt bởi $f(n)=2n$ và $g(n)=3n-1$. Giá trị của hàm hợp $g\\circ f$ tại $n=2$ là ___",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(2)=2(2)=4$. Then $g(f(2))=g(4)=3(4)-1=11$.</div><div class=\"ml-vi\">$f(2)=2(2)=4$. Rồi $g(f(2))=g(4)=3(4)-1=11$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a function? (i) $f:\\mathbb{N}\\to\\mathbb{N},f(n)=\\sqrt n$ (ii) $f:\\mathbb{N}\\to\\mathbb{R},f(n)=\\sqrt n$ (iii) $f:\\mathbb{R}\\to\\mathbb{N},f(n)=\\sqrt n$|||Cái nào sau đây là một hàm? (i) $f:\\mathbb{N}\\to\\mathbb{N},f(n)=\\sqrt n$ (ii) $f:\\mathbb{N}\\to\\mathbb{R},f(n)=\\sqrt n$ (iii) $f:\\mathbb{R}\\to\\mathbb{N},f(n)=\\sqrt n$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) fails: $\\sqrt n$ isn't always a natural number (e.g. $\\sqrt2$), so the codomain $\\mathbb{N}$ is violated. (ii) works: $\\sqrt n$ is always a well-defined real number for every natural $n$, giving exactly one output -- a valid function. (iii) fails: $\\sqrt n$ is undefined for negative reals, and not always natural.</div><div class=\"ml-vi\">(i) sai: $\\sqrt n$ không phải luôn là số tự nhiên (vd $\\sqrt2$), nên vi phạm miền giá trị $\\mathbb{N}$. (ii) đúng: $\\sqrt n$ luôn là một số thực xác định rõ với mọi số tự nhiên $n$, cho đúng một giá trị ra -- một hàm hợp lệ. (iii) sai: $\\sqrt n$ không xác định với số thực âm, và không phải luôn là số tự nhiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute $\\sum_{i=1}^{99}i(i+1)$.|||Tính $\\sum_{i=1}^{99}i(i+1)$.",
          "options": [
            {
              "text": "333333|||333333"
            },
            {
              "text": "333400|||333400"
            },
            {
              "text": "333300|||333300"
            },
            {
              "text": "343400|||343400"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\sum i(i+1)=\\sum i^2+\\sum i$. With $n=99$: $\\sum i=\\frac{99\\cdot100}{2}=4950$, $\\sum i^2=\\frac{99\\cdot100\\cdot199}{6}=328350$. Total $=328350+4950=333300$.</div><div class=\"ml-vi\">$\\sum i(i+1)=\\sum i^2+\\sum i$. Với $n=99$: $\\sum i=\\frac{99\\cdot100}{2}=4950$, $\\sum i^2=\\frac{99\\cdot100\\cdot199}{6}=328350$. Tổng $=328350+4950=333300$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm to find the maximum element of a list: procedure Max($a_1,a_2,\\ldots,a_n$: integers): $Max:=a_1$; for $i:=2$ to $n$ do if $Max<a_i$ then $Max:=a_i$. If the input is the sequence $1,4,5,2,7,9,3$, then all the values of the variable $Max$ are ___|||Cho thuật toán tìm phần tử lớn nhất của dãy: procedure Max($a_1,a_2,\\ldots,a_n$: integers): $Max:=a_1$; for $i:=2$ to $n$ do if $Max<a_i$ then $Max:=a_i$. Nếu đầu vào là dãy $1,4,5,2,7,9,3$, thì tất cả các giá trị của biến $Max$ là ___",
          "options": [
            {
              "text": "4, 5, 7, 9|||4, 5, 7, 9"
            },
            {
              "text": "1, 4, 5, 7, 9|||1, 4, 5, 7, 9"
            },
            {
              "text": "1, 5, 7, 9|||1, 5, 7, 9"
            },
            {
              "text": "1, 4, 5, 2, 7, 9|||1, 4, 5, 2, 7, 9"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$Max$ starts at 1. Then: $4>1\\to Max=4$; $5>4\\to Max=5$; $2\\not>5$ no change; $7>5\\to Max=7$; $9>7\\to Max=9$; $3\\not>9$ no change. All values $Max$ takes: $1,4,5,7,9$.</div><div class=\"ml-vi\">$Max$ bắt đầu là 1. Rồi: $4>1\\to Max=4$; $5>4\\to Max=5$; $2\\not>5$ không đổi; $7>5\\to Max=7$; $9>7\\to Max=9$; $3\\not>9$ không đổi. Tất cả giá trị $Max$ nhận: $1,4,5,7,9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Bubble sort algorithm: procedure Bubblesort($a_1,a_2,\\ldots,a_n$: integer): for $i=1$ to $(n-1)$ do for $j=1$ to $(n-i)$ do if $a_j>a_{j+1}$ then swap($a_j,a_{j+1}$). If input $=3,2,4,7,1,6,5$, find the order of the elements after completing the first pass ($i=1$).|||Cho thuật toán sắp xếp nổi bọt: procedure Bubblesort($a_1,a_2,\\ldots,a_n$: integer): for $i=1$ to $(n-1)$ do for $j=1$ to $(n-i)$ do if $a_j>a_{j+1}$ then swap($a_j,a_{j+1}$). Nếu đầu vào $=3,2,4,7,1,6,5$, tìm thứ tự các phần tử sau khi hoàn tất lượt đầu tiên ($i=1$).",
          "options": [
            {
              "text": "2, 3, 4, 1, 6, 5, 7|||2, 3, 4, 1, 6, 5, 7"
            },
            {
              "text": "2, 3, 4, 1, 5, 6, 7|||2, 3, 4, 1, 5, 6, 7"
            },
            {
              "text": "2, 3, 1, 4, 6, 5, 7|||2, 3, 1, 4, 6, 5, 7"
            },
            {
              "text": "2, 3, 1, 4, 5, 6, 7|||2, 3, 1, 4, 5, 6, 7"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Pass 1 ($j=1..6$): compare(3,2) swap$\\to$2,3,4,7,1,6,5; compare(3,4) no; compare(4,7) no; compare(7,1) swap$\\to$2,3,4,1,7,6,5; compare(7,6) swap$\\to$2,3,4,1,6,7,5; compare(7,5) swap$\\to$2,3,4,1,6,5,7.</div><div class=\"ml-vi\">Lượt 1 ($j=1..6$): so sánh(3,2) đổi$\\to$2,3,4,7,1,6,5; so sánh(3,4) không; so sánh(4,7) không; so sánh(7,1) đổi$\\to$2,3,4,1,7,6,5; so sánh(7,6) đổi$\\to$2,3,4,1,6,7,5; so sánh(7,5) đổi$\\to$2,3,4,1,6,5,7.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which functions are $O(x^3)$? (i) $f(x)=8x^3+13x^2+98x\\log x$ (ii) $f(x)=\\lfloor x^2+1\\rfloor\\lfloor x^2-1\\rfloor$ (iii) $f(x)=2x^2+x^3\\log x$|||Hàm nào là $O(x^3)$? (i) $f(x)=8x^3+13x^2+98x\\log x$ (ii) $f(x)=\\lfloor x^2+1\\rfloor\\lfloor x^2-1\\rfloor$ (iii) $f(x)=2x^2+x^3\\log x$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">(i): dominant term $8x^3$, and $x^2,x\\log x$ are both $o(x^3)$, so $f(x)=O(x^3)$. (ii): $(x^2+1)(x^2-1)\\approx x^4-1$ grows like $x^4$, NOT $O(x^3)$. (iii): $x^3\\log x$ grows strictly faster than any constant multiple of $x^3$ (since $\\log x\\to\\infty$), so NOT $O(x^3)$. Only (i) qualifies.</div><div class=\"ml-vi\">(i): số hạng chiếm ưu thế $8x^3$, và $x^2,x\\log x$ đều là $o(x^3)$, nên $f(x)=O(x^3)$. (ii): $(x^2+1)(x^2-1)\\approx x^4-1$ tăng như $x^4$, KHÔNG phải $O(x^3)$. (iii): $x^3\\log x$ tăng nhanh hơn hẳn bất kỳ hằng số nhân $x^3$ nào (vì $\\log x\\to\\infty$), nên KHÔNG phải $O(x^3)$. Chỉ (i) thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: procedure XYZ($n$: integer): $sum:=0$; for $i:=1$ to $n$ do for $j:=1$ to $(i*i)$ do $sum:=sum+i/j$; Print($sum$). If $n=6$, how many divisions are required?|||Cho thuật toán: procedure XYZ($n$: integer): $sum:=0$; for $i:=1$ to $n$ do for $j:=1$ to $(i*i)$ do $sum:=sum+i/j$; Print($sum$). Nếu $n=6$, cần bao nhiêu phép chia?",
          "options": [
            {
              "text": "91|||91"
            },
            {
              "text": "55|||55"
            },
            {
              "text": "66|||66"
            },
            {
              "text": "37|||37"
            },
            {
              "text": "140|||140"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The inner loop runs $i^2$ times for each $i$, and each iteration does one division. Total divisions $=\\sum_{i=1}^{6}i^2=1+4+9+16+25+36=91$.</div><div class=\"ml-vi\">Vòng lặp trong chạy $i^2$ lần với mỗi $i$, mỗi lần lặp thực hiện một phép chia. Tổng số phép chia $=\\sum_{i=1}^{6}i^2=1+4+9+16+25+36=91$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $x_1,x_2,x_3,x_4,x_5$ of the sequence of pseudorandom numbers generated by the linear congruential generator $x_{n+1}=(5x_n+1)\\bmod9$ with seed $x_0=3$.|||Tìm $x_1,x_2,x_3,x_4,x_5$ của dãy số giả ngẫu nhiên sinh bởi bộ sinh đồng dư tuyến tính $x_{n+1}=(5x_n+1)\\bmod9$ với hạt giống $x_0=3$.",
          "options": [
            {
              "text": "6, 4, 3, 7, 0|||6, 4, 3, 7, 0"
            },
            {
              "text": "7, 0, 1, 6, 4|||7, 0, 1, 6, 4"
            },
            {
              "text": "4, 3, 7, 5, 1|||4, 3, 7, 5, 1"
            },
            {
              "text": "4, 7, 3, 1, 5|||4, 7, 3, 1, 5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$x_1=(5\\cdot3+1)\\bmod9=16\\bmod9=7$. $x_2=(5\\cdot7+1)\\bmod9=36\\bmod9=0$. $x_3=(5\\cdot0+1)\\bmod9=1$. $x_4=(5\\cdot1+1)\\bmod9=6$. $x_5=(5\\cdot6+1)\\bmod9=31\\bmod9=4$.</div><div class=\"ml-vi\">$x_1=(5\\cdot3+1)\\bmod9=16\\bmod9=7$. $x_2=(5\\cdot7+1)\\bmod9=36\\bmod9=0$. $x_3=(5\\cdot0+1)\\bmod9=1$. $x_4=(5\\cdot1+1)\\bmod9=6$. $x_5=(5\\cdot6+1)\\bmod9=31\\bmod9=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Calculate $-112\\text{ div }19$ and $-112\\bmod19$.|||Tính $-112\\text{ div }19$ và $-112\\bmod19$.",
          "options": [
            {
              "text": "-5 and -17|||-5 and -17"
            },
            {
              "text": "-6 and 2|||-6 và 2"
            },
            {
              "text": "6 and 2|||6 và 2"
            },
            {
              "text": "5 and 17|||5 và 17"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">By convention, $\\bmod$ result must satisfy $0\\le r<19$. $-112=19q+r$: try $q=-6$: $19(-6)=-114$, $r=-112-(-114)=2$, valid since $0\\le2<19$. So $-112\\text{ div }19=-6$ and $-112\\bmod19=2$.</div><div class=\"ml-vi\">Theo quy ước, kết quả $\\bmod$ phải thỏa $0\\le r<19$. $-112=19q+r$: thử $q=-6$: $19(-6)=-114$, $r=-112-(-114)=2$, hợp lệ vì $0\\le2<19$. Vậy $-112\\text{ div }19=-6$ và $-112\\bmod19=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Two integers $a$ and $b$ are relatively prime if $\\gcd(a,b)=1$. Which of the following pairs of numbers is relatively prime?|||Hai số nguyên $a$ và $b$ nguyên tố cùng nhau nếu $\\gcd(a,b)=1$. Cặp số nào sau đây nguyên tố cùng nhau?",
          "options": [
            {
              "text": "(143, 22)|||(143, 22)"
            },
            {
              "text": "(81, 63)|||(81, 63)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(21, 93)|||(21, 93)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(143,22)$: $143=11\\times13$, $22=2\\times11$, $\\gcd=11\\neq1$. $(81,63)$: $81=3^4$, $63=3^2\\times7$, $\\gcd=9\\neq1$. $(21,93)$: $21=3\\times7$, $93=3\\times31$, $\\gcd=3\\neq1$. None of the given pairs is relatively prime.</div><div class=\"ml-vi\">$(143,22)$: $143=11\\times13$, $22=2\\times11$, $\\gcd=11\\neq1$. $(81,63)$: $81=3^4$, $63=3^2\\times7$, $\\gcd=9\\neq1$. $(21,93)$: $21=3\\times7$, $93=3\\times31$, $\\gcd=3\\neq1$. Không cặp nào trong các cặp trên nguyên tố cùng nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose $a=2^3 3^3 5^2 7^1$ and $b=2^2 3^3 5^4 7^1$. Find $\\frac{lcm(a,b)}{\\gcd(a,b)}$. (i) $2^1 3^1 5^1 7^1$ (ii) $2^1 5^2$ (iii) $2^1 3^1 5^2$ (iv) $2^2 3^1 5^2$|||Cho $a=2^3 3^3 5^2 7^1$ và $b=2^2 3^3 5^4 7^1$. Tìm $\\frac{lcm(a,b)}{\\gcd(a,b)}$. (i) $2^1 3^1 5^1 7^1$ (ii) $2^1 5^2$ (iii) $2^1 3^1 5^2$ (iv) $2^2 3^1 5^2$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$lcm(a,b)=2^{\\max(3,2)}3^{\\max(3,3)}5^{\\max(2,4)}7^{\\max(1,1)}=2^3 3^3 5^4 7^1$. $\\gcd(a,b)=2^{\\min(3,2)}3^{\\min(3,3)}5^{\\min(2,4)}7^{\\min(1,1)}=2^2 3^3 5^2 7^1$. Ratio $=2^{3-2}3^{3-3}5^{4-2}7^{1-1}=2^1 3^0 5^2 7^0=2^1 5^2$.</div><div class=\"ml-vi\">$lcm(a,b)=2^{\\max(3,2)}3^{\\max(3,3)}5^{\\max(2,4)}7^{\\max(1,1)}=2^3 3^3 5^4 7^1$. $\\gcd(a,b)=2^{\\min(3,2)}3^{\\min(3,3)}5^{\\min(2,4)}7^{\\min(1,1)}=2^2 3^3 5^2 7^1$. Tỉ số $=2^{3-2}3^{3-3}5^{4-2}7^{1-1}=2^1 3^0 5^2 7^0=2^1 5^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the base 3 expansion of $(123)_9$. (i) $(1210)_3$ (ii) $(10201)_3$ (iii) $(10210)_3$ (iv) $(100210)_3$|||Tìm biểu diễn cơ số 3 của $(123)_9$. (i) $(1210)_3$ (ii) $(10201)_3$ (iii) $(10210)_3$ (iv) $(100210)_3$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(123)_9=1(81)+2(9)+3=81+18+3=102$ in decimal. Converting 102 to base 3: $102=1(81)+0(27)+2(9)+1(3)+0(1)$, giving digits $1,0,2,1,0=(10210)_3$.</div><div class=\"ml-vi\">$(123)_9=1(81)+2(9)+3=81+18+3=102$ trong hệ thập phân. Đổi 102 sang cơ số 3: $102=1(81)+0(27)+2(9)+1(3)+0(1)$, cho các chữ số $1,0,2,1,0=(10210)_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the base 3 expansion of $(434)_5$.|||Tìm biểu diễn cơ số 3 của $(434)_5$.",
          "options": [
            {
              "text": "11112|||11112"
            },
            {
              "text": "11002|||11002"
            },
            {
              "text": "11102|||11102"
            },
            {
              "text": "10211|||10211"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(434)_5=4(25)+3(5)+4=100+15+4=119$ in decimal. Converting 119 to base 3: $119=1(81)+1(27)+1(9)+0(3)+2(1)$, giving digits $1,1,1,0,2=(11102)_3$.</div><div class=\"ml-vi\">$(434)_5=4(25)+3(5)+4=100+15+4=119$ trong hệ thập phân. Đổi 119 sang cơ số 3: $119=1(81)+1(27)+1(9)+0(3)+2(1)$, cho các chữ số $1,1,1,0,2=(11102)_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the smallest integer $a$ such that for all integer $n\\ge a$ we have $n=5x+6y$, with $x$ and $y$ non-negative integers.|||Tìm số nguyên nhỏ nhất $a$ sao cho với mọi số nguyên $n\\ge a$ ta có $n=5x+6y$, với $x$ và $y$ là số nguyên không âm.",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "18|||18"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "30|||30"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For coprime $5,6$, the Frobenius number (largest non-representable integer) is $5\\times6-5-6=19$. So every integer $n\\ge20$ is representable, and $19$ itself is not -- the smallest valid $a$ is 20.</div><div class=\"ml-vi\">Với $5,6$ nguyên tố cùng nhau, số Frobenius (số nguyên lớn nhất không biểu diễn được) là $5\\times6-5-6=19$. Vậy mọi số nguyên $n\\ge20$ đều biểu diễn được, còn $19$ thì không -- $a$ nhỏ nhất hợp lệ là 20.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a recursive definition for the set of all odd positive integers. (i) $0\\in S$, if $a\\in S$ then $a+2\\in S$. (ii) $1\\in S$, if $a\\in S$ then $a+2\\in S$ and $a-2\\in S$. (iii) $1,2\\in S$, if $a\\in S$ then $a+2\\in S$. (iv) $1\\in S$, if $a\\in S$ then $a+2\\in S$.|||Tìm định nghĩa đệ quy cho tập mọi số nguyên dương lẻ. (i) $0\\in S$, nếu $a\\in S$ thì $a+2\\in S$. (ii) $1\\in S$, nếu $a\\in S$ thì $a+2\\in S$ và $a-2\\in S$. (iii) $1,2\\in S$, nếu $a\\in S$ thì $a+2\\in S$. (iv) $1\\in S$, nếu $a\\in S$ thì $a+2\\in S$.",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Odd positive integers are $1,3,5,7,\\ldots$. Basis $1\\in S$, recursive step $a\\in S\\to a+2\\in S$ generates exactly this set. (i) starts from 0 (generates evens). (ii)'s extra $a-2\\in S$ rule would generate non-positive integers too. (iii) includes 2, generating evens as well.</div><div class=\"ml-vi\">Số nguyên dương lẻ là $1,3,5,7,\\ldots$. Cơ sở $1\\in S$, bước đệ quy $a\\in S\\to a+2\\in S$ sinh đúng tập này. (i) bắt đầu từ 0 (sinh ra số chẵn). Quy tắc $a-2\\in S$ thêm ở (ii) sẽ sinh cả số không dương. (iii) bao gồm 2, cũng sinh ra số chẵn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose a recursive definition for the function $f(n)=3^{n+1}$, $n=1,2,\\ldots$|||Chọn định nghĩa đệ quy cho hàm $f(n)=3^{n+1}$, $n=1,2,\\ldots$",
          "options": [
            {
              "text": "f(n) = n f(n-1), f(1) = 3|||f(n) = n f(n-1), f(1) = 3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "f(n) = 3f(n-1), f(1) = 3|||f(n) = 3f(n-1), f(1) = 3"
            },
            {
              "text": "f(n) = 3f(n-1), f(1) = 9|||f(n) = 3f(n-1), f(1) = 9"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=3^2=9$. Also $f(n)=3^{n+1}=3\\cdot3^n=3f(n-1)$. So the recursive definition is $f(n)=3f(n-1)$ with $f(1)=9$.</div><div class=\"ml-vi\">$f(1)=3^2=9$. Ngoài ra $f(n)=3^{n+1}=3\\cdot3^n=3f(n-1)$. Vậy định nghĩa đệ quy là $f(n)=3f(n-1)$ với $f(1)=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the algorithm if input $n=7$: procedure tt($n$: integer): if $n=1$ then $tt(n):=1$ else $tt(n):=tt(n-1)+n$.|||Tìm kết quả của thuật toán nếu đầu vào $n=7$: procedure tt($n$: integer): nếu $n=1$ thì $tt(n):=1$ ngược lại $tt(n):=tt(n-1)+n$.",
          "options": [
            {
              "text": "35|||35"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This computes the $n$-th triangular number $tt(n)=1+2+\\ldots+n=\\frac{n(n+1)}{2}$. For $n=7$: $\\frac{7\\times8}{2}=28$.</div><div class=\"ml-vi\">Đây tính số tam giác thứ $n$: $tt(n)=1+2+\\ldots+n=\\frac{n(n+1)}{2}$. Với $n=7$: $\\frac{7\\times8}{2}=28$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the recursive algorithm if input $n=5$: procedure TT($n$: integer): if $n=1$ then $f(1):=3$ else $f(n):=f(n-1)*n$.|||Tìm kết quả của thuật toán đệ quy nếu đầu vào $n=5$: procedure TT($n$: integer): nếu $n=1$ thì $f(1):=3$ ngược lại $f(n):=f(n-1)*n$.",
          "options": [
            {
              "text": "120|||120"
            },
            {
              "text": "240|||240"
            },
            {
              "text": "360|||360"
            },
            {
              "text": "480|||480"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=3$, $f(2)=3\\times2=6$, $f(3)=6\\times3=18$, $f(4)=18\\times4=72$, $f(5)=72\\times5=360$.</div><div class=\"ml-vi\">$f(1)=3$, $f(2)=3\\times2=6$, $f(3)=6\\times3=18$, $f(4)=18\\times4=72$, $f(5)=72\\times5=360$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers less than 100 are divisible by either 3 or 4?|||Có bao nhiêu số nguyên dương nhỏ hơn 100 chia hết cho 3 hoặc 4?",
          "options": [
            {
              "text": "49|||49"
            },
            {
              "text": "48|||48"
            },
            {
              "text": "63|||63"
            },
            {
              "text": "77|||77"
            },
            {
              "text": "45|||45"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Divisible by 3: $\\lfloor99/3\\rfloor=33$. Divisible by 4: $\\lfloor99/4\\rfloor=24$. Divisible by $\\text{lcm}(3,4)=12$: $\\lfloor99/12\\rfloor=8$. By inclusion-exclusion: $33+24-8=49$.</div><div class=\"ml-vi\">Chia hết cho 3: $\\lfloor99/3\\rfloor=33$. Chia hết cho 4: $\\lfloor99/4\\rfloor=24$. Chia hết cho $\\text{lcm}(3,4)=12$: $\\lfloor99/12\\rfloor=8$. Theo nguyên lý bù trừ: $33+24-8=49$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many strings of four decimal digits are there in which there are exactly three 9s?|||Có bao nhiêu chuỗi bốn chữ số thập phân có đúng ba chữ số 9?",
          "options": [
            {
              "text": "27|||27"
            },
            {
              "text": "36|||36"
            },
            {
              "text": "45|||45"
            },
            {
              "text": "56|||56"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Choose 3 of the 4 positions to be 9: $\\binom{4}{3}=4$ ways. The remaining position must be a non-9 digit: 9 choices. Total: $4\\times9=36$.</div><div class=\"ml-vi\">Chọn 3 trong 4 vị trí để là 9: $\\binom{4}{3}=4$ cách. Vị trí còn lại phải là chữ số khác 9: 9 lựa chọn. Tổng: $4\\times9=36$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many binary strings of length 5 contain two consecutive 1s?|||Có bao nhiêu chuỗi nhị phân độ dài 5 chứa hai bit 1 liên tiếp?",
          "options": [
            {
              "text": "18|||18"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Total strings of length 5: $2^5=32$. Let $a(n)$ count strings of length $n$ with NO two consecutive 1s: $a(n)=a(n-1)+a(n-2)$, $a(0)=1,a(1)=2$, giving $a(2)=3,a(3)=5,a(4)=8,a(5)=13$. Strings WITH two consecutive 1s: $32-13=19$.</div><div class=\"ml-vi\">Tổng số chuỗi độ dài 5: $2^5=32$. Gọi $a(n)$ đếm chuỗi độ dài $n$ KHÔNG có hai bit 1 liên tiếp: $a(n)=a(n-1)+a(n-2)$, $a(0)=1,a(1)=2$, cho $a(2)=3,a(3)=5,a(4)=8,a(5)=13$. Chuỗi CÓ hai bit 1 liên tiếp: $32-13=19$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(n)=3f(n/3)+4n$ when $n$ is a positive integer divisible by 3, and let $f(1)=3$. What is $f(27)$?|||Cho $f(n)=3f(n/3)+4n$ khi $n$ là số nguyên dương chia hết cho 3, và cho $f(1)=3$. Tìm $f(27)$.",
          "options": [
            {
              "text": "21|||21"
            },
            {
              "text": "99|||99"
            },
            {
              "text": "324|||324"
            },
            {
              "text": "405|||405"
            },
            {
              "text": "1539|||1539"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=3f(1)+4(3)=3(3)+12=21$. $f(9)=3f(3)+4(9)=3(21)+36=99$. $f(27)=3f(9)+4(27)=3(99)+108=297+108=405$.</div><div class=\"ml-vi\">$f(3)=3f(1)+4(3)=3(3)+12=21$. $f(9)=3f(3)+4(9)=3(21)+36=99$. $f(27)=3f(9)+4(27)=3(99)+108=297+108=405$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following statements: (i) $C_n$ has $n$ vertices. (ii) $C_n$ has $n$ edges. (iii) The degree of each vertex in $C_n$ is 2. Choose the correct statement(s):|||Xét các phát biểu sau: (i) $C_n$ có $n$ đỉnh. (ii) $C_n$ có $n$ cạnh. (iii) Bậc của mỗi đỉnh trong $C_n$ là 2. Chọn (các) phát biểu đúng:",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(i) and (iii)|||(i) và (iii)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(i), (ii) and (iii)|||(i), (ii) và (iii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">The cycle graph $C_n$ has exactly $n$ vertices arranged in a ring, $n$ edges (each vertex connects to its two neighbors), and every vertex has degree exactly 2. All three statements are true.</div><div class=\"ml-vi\">Đồ thị chu trình $C_n$ có đúng $n$ đỉnh xếp thành vòng, $n$ cạnh (mỗi đỉnh nối với hai đỉnh lân cận), và mọi đỉnh đều có bậc đúng bằng 2. Cả ba phát biểu đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a simple graph with 5 vertices. The degrees of 4 vertices are 1, 3, 3, 4. Which of the following numbers could be the degree of the fifth vertex?|||Cho một đơn đồ thị với 5 đỉnh. Bậc của 4 đỉnh là 1, 3, 3, 4. Số nào sau đây có thể là bậc của đỉnh thứ năm?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "1 and 3|||1 và 3"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The degree-4 vertex ($A$) must connect to all other 4 vertices. Removing $A$'s contribution, the remaining required degrees among the other 4 vertices (deg 1,3,3,$x$) become $0,2,2,x-1$. The vertex needing 0 is isolated in this sub-problem, forcing the two degree-2 vertices to connect to each other AND to the fifth vertex (only 2 available neighbors each), which forces the fifth vertex to get exactly 2 edges from them, so $x-1=2\\Rightarrow x=3$. $x=1$ is impossible (would require the two degree-2 vertices to gain degree 2 using only each other, i.e. a single edge giving only 1 each) and $x=5$ exceeds the max possible degree (4) in a 5-vertex simple graph.</div><div class=\"ml-vi\">Đỉnh bậc 4 ($A$) phải nối với cả 4 đỉnh còn lại. Loại bỏ đóng góp của $A$, bậc cần thiết còn lại trong 4 đỉnh kia (bậc 1,3,3,$x$) trở thành $0,2,2,x-1$. Đỉnh cần 0 bị cô lập trong bài toán con này, buộc hai đỉnh cần bậc 2 phải nối với nhau VÀ với đỉnh thứ năm (chỉ có 2 hàng xóm khả dĩ mỗi đỉnh), điều này buộc đỉnh thứ năm nhận đúng 2 cạnh từ chúng, nên $x-1=2\\Rightarrow x=3$. $x=1$ không thể (sẽ cần hai đỉnh bậc 2 đạt bậc 2 chỉ dùng lẫn nhau, tức một cạnh duy nhất chỉ cho mỗi bên 1) và $x=5$ vượt quá bậc tối đa có thể (4) trong đơn đồ thị 5 đỉnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a pseudograph with vertices $a,b,c,d$: straight edges $ab$ (top), $ad$ (left), $dc$ (bottom); a triple edge $ac$ (three parallel curved edges from $a$ to $c$); and self-loops at $b$, $c$, and $d$. What is the sum of the numbers in the third row of the adjacency matrix, in the order $a,b,c,d$, of the given graph?|||Cho một giả đồ thị (pseudograph) với các đỉnh $a,b,c,d$: cạnh thẳng $ab$ (trên), $ad$ (trái), $dc$ (dưới); cạnh bội ba $ac$ (ba cạnh cong song song từ $a$ đến $c$); và khuyên (self-loop) tại $b$, $c$, và $d$. Tổng các số trong hàng thứ ba của ma trận kề, theo thứ tự $a,b,c,d$, của đồ thị đã cho là bao nhiêu?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The third row (order $a,b,c,d$) corresponds to vertex $c$. Row sum of an adjacency matrix always equals the vertex's degree. $c$ is incident to: 3 parallel edges to $a$ (+3), 1 edge to $d$ (+1), and 1 loop (which contributes 2 to degree, per the standard convention that a loop is traversed twice) (+2). Total degree of $c$ $=3+1+2=6$.</div><div class=\"ml-vi\">Hàng thứ ba (thứ tự $a,b,c,d$) ứng với đỉnh $c$. Tổng hàng của ma trận kề luôn bằng bậc của đỉnh đó. $c$ liên thuộc với: 3 cạnh song song tới $a$ (+3), 1 cạnh tới $d$ (+1), và 1 khuyên (đóng góp 2 vào bậc, theo quy ước chuẩn rằng khuyên được duyệt hai lần) (+2). Tổng bậc của $c$ $=3+1+2=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be a simple graph with $n$ vertices and $A$ be the adjacency matrix of $G$. Choose the INCORRECT statement:|||Cho $G$ là đơn đồ thị với $n$ đỉnh và $A$ là ma trận kề của $G$. Chọn phát biểu SAI:",
          "options": [
            {
              "text": "The entries of the matrix A are all natural numbers.|||Các phần tử của ma trận A đều là số tự nhiên."
            },
            {
              "text": "There is at least one entry of the matrix A that is equal to 1.|||Có ít nhất một phần tử của ma trận A bằng 1."
            },
            {
              "text": "The entries on the main diagonal of the matrix A are all equal to 0.|||Các phần tử trên đường chéo chính của ma trận A đều bằng 0."
            },
            {
              "text": "The entries of the matrix A can only take the values 0 or 1.|||Các phần tử của ma trận A chỉ có thể nhận giá trị 0 hoặc 1."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A, C, D are always true for any simple graph's adjacency matrix (entries are 0/1 natural numbers, diagonal is 0 since simple graphs have no loops). B is not guaranteed: if $G$ has no edges at all (the empty graph on $n$ vertices), every entry of $A$ is 0, so no entry equals 1. B is the incorrect (not always true) statement.</div><div class=\"ml-vi\">A, C, D luôn đúng với ma trận kề của bất kỳ đơn đồ thị nào (phần tử là số tự nhiên 0/1, đường chéo bằng 0 vì đơn đồ thị không có khuyên). B không được đảm bảo: nếu $G$ không có cạnh nào (đồ thị rỗng trên $n$ đỉnh), mọi phần tử của $A$ đều là 0, nên không phần tử nào bằng 1. B là phát biểu sai (không luôn đúng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the graph with top row vertices $a,b,c,d,e$ connected in a chain, bottom row vertices $h,g,f$, edges $ah$, $ef$, $hg$, $gf$, $cg$, and diagonals $ag$, $eh$. Find the strongly connected components of the given graph (directed).|||Cho đồ thị với hàng trên các đỉnh $a,b,c,d,e$ nối thành chuỗi, hàng dưới các đỉnh $h,g,f$, các cạnh $ah$, $ef$, $hg$, $gf$, $cg$, và đường chéo $ag$, $eh$. Tìm các thành phần liên thông mạnh của đồ thị có hướng đã cho.",
          "options": [
            {
              "text": "{a, b, c, d, e}, {f, h}, {g}|||{a, b, c, d, e}, {f, h}, {g}"
            },
            {
              "text": "{a, b, c, d, e, f}, {h}, {g}|||{a, b, c, d, e, f}, {h}, {g}"
            },
            {
              "text": "{a, b, c, d, e, f, h}, {g}|||{a, b, c, d, e, f, h}, {g}"
            },
            {
              "text": "{a, b, c, d, e, f, g, h}|||{a, b, c, d, e, f, g, h}"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Tracing the directed edges, the top chain $a\\to b\\to c\\to d\\to e$ together with the diagonals allows mutual reachability among $\\{a,b,c,d,e\\}$, forming one SCC. $f$ and $h$ can reach each other via $g$ but $g$ cannot be reached back from them under this edge orientation, so $\\{f,h\\}$ forms its own SCC and $\\{g\\}$ is a singleton SCC.</div><div class=\"ml-vi\">Theo dõi các cạnh có hướng, chuỗi trên $a\\to b\\to c\\to d\\to e$ cùng với các đường chéo cho phép liên thông qua lại giữa $\\{a,b,c,d,e\\}$, tạo thành một SCC. $f$ và $h$ có thể đến nhau qua $g$ nhưng $g$ không thể được quay lại từ chúng theo hướng cạnh này, nên $\\{f,h\\}$ tạo thành SCC riêng và $\\{g\\}$ là SCC đơn lẻ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S$ be the set of all directed graphs with the given (in-degree, out-degree) sequence: $[(3,2),(2,2),(2,2),(1,2)]$. Which of the following is TRUE: (i) $\\forall G\\in S$: $G$ has no Euler paths (ii) $\\exists G\\in S$: $G$ has an Euler circuit (iii) $\\exists G\\in S$: $G$ has an Euler path, but no Euler circuits|||Cho $S$ là tập mọi đồ thị có hướng với dãy (bậc vào, bậc ra) cho trước: $[(3,2),(2,2),(2,2),(1,2)]$. Điều nào sau đây ĐÚNG: (i) $\\forall G\\in S$: $G$ không có đường đi Euler (ii) $\\exists G\\in S$: $G$ có chu trình Euler (iii) $\\exists G\\in S$: $G$ có đường đi Euler, nhưng không có chu trình Euler",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">An Euler circuit requires in-degree=out-degree at EVERY vertex -- impossible here since vertex 1 has $(3,2)$ and vertex 4 has $(1,2)$, so (ii) is false for every $G\\in S$. An Euler path requires exactly one vertex with out-in=1 (start) and exactly one with in-out=1 (end), rest balanced: vertex 4 $(1,2)$ has out-in=1, vertex 1 $(3,2)$ has in-out=1, vertices 2,3 are balanced -- this matches exactly, so some connected $G\\in S$ has an Euler path from vertex 4 to vertex 1, but since it's not balanced everywhere it can't be a circuit. So (iii) is true and (i) is false.</div><div class=\"ml-vi\">Chu trình Euler đòi hỏi bậc vào=bậc ra tại MỌI đỉnh -- không thể ở đây vì đỉnh 1 có $(3,2)$ và đỉnh 4 có $(1,2)$, nên (ii) sai với mọi $G\\in S$. Đường đi Euler đòi hỏi đúng một đỉnh có bậc ra-bậc vào=1 (điểm đầu) và đúng một đỉnh có bậc vào-bậc ra=1 (điểm cuối), còn lại cân bằng: đỉnh 4 $(1,2)$ có bậc ra-vào=1, đỉnh 1 $(3,2)$ có bậc vào-ra=1, đỉnh 2,3 cân bằng -- khớp chính xác, nên một số $G\\in S$ liên thông có đường đi Euler từ đỉnh 4 đến đỉnh 1, nhưng vì không cân bằng khắp nơi nên không thể là chu trình. Vậy (iii) đúng và (i) sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following graphs have Euler circuits? (i) $K_5$ (ii) $C_{20}$ (iii) $W_{10}$|||Đồ thị nào sau đây có chu trình Euler? (i) $K_5$ (ii) $C_{20}$ (iii) $W_{10}$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i), (ii) and (iii)|||(i), (ii) và (iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A connected graph has an Euler circuit iff every vertex has even degree. $K_5$: every vertex has degree 4 (even) -- yes. $C_{20}$: every vertex has degree 2 (even) -- yes. $W_{10}$: the hub has degree 10 (even) but each of the 10 outer rim vertices has degree 3 (2 from the cycle + 1 to the hub, odd) -- no. So (i) and (ii).</div><div class=\"ml-vi\">Đồ thị liên thông có chu trình Euler khi và chỉ khi mọi đỉnh có bậc chẵn. $K_5$: mọi đỉnh bậc 4 (chẵn) -- có. $C_{20}$: mọi đỉnh bậc 2 (chẵn) -- có. $W_{10}$: đỉnh trung tâm bậc 10 (chẵn) nhưng mỗi đỉnh vành ngoài trong 10 đỉnh có bậc 3 (2 từ chu trình + 1 tới trung tâm, lẻ) -- không. Vậy (i) và (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the minimum total weight of a Hamilton path in this graph with vertices $A,B,C,D,E$ and edges $BD=6,BC=5,BA=2,DA=1,DC=8,AC=3,AE=4$ (E connects only to A)?|||Tổng trọng số nhỏ nhất của một đường đi Hamilton trong đồ thị với các đỉnh $A,B,C,D,E$ và các cạnh $BD=6,BC=5,BA=2,DA=1,DC=8,AC=3,AE=4$ (E chỉ nối với A) là bao nhiêu?",
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "18|||18"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Since $E$ has degree 1 (only connects to $A$), $E$ must be a path endpoint via edge $EA=4$. From $A$, try all orderings of $B,C,D$: $A$-$D$(1)-$B$(6)-$C$(5)=12; $A$-$D$(1)-$C$(8)-$B$(5)=14; $A$-$B$(2)-$D$(6)-$C$(8)=16; $A$-$B$(2)-$C$(5)-$D$(8)=15; $A$-$C$(3)-$D$(8)-$B$(6)=17; $A$-$C$(3)-$B$(5)-$D$(6)=14. Minimum is $A$-$D$-$B$-$C$=12, plus $EA=4$ gives total 16.</div><div class=\"ml-vi\">Vì $E$ có bậc 1 (chỉ nối với $A$), $E$ phải là điểm đầu đường đi qua cạnh $EA=4$. Từ $A$, thử mọi thứ tự $B,C,D$: $A$-$D$(1)-$B$(6)-$C$(5)=12; $A$-$D$(1)-$C$(8)-$B$(5)=14; $A$-$B$(2)-$D$(6)-$C$(8)=16; $A$-$B$(2)-$C$(5)-$D$(8)=15; $A$-$C$(3)-$D$(8)-$B$(6)=17; $A$-$C$(3)-$B$(5)-$D$(6)=14. Nhỏ nhất là $A$-$D$-$B$-$C$=12, cộng $EA=4$ cho tổng 16.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For what values of $m$ does there exist a full $m$-ary tree with 32 leaves and height 4?|||Với những giá trị $m$ nào thì tồn tại một cây $m$-phân đầy đủ với 32 lá và chiều cao 4?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "33|||33"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "No value of m|||Không giá trị m nào"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For any full $m$-ary tree, leaves $\\ell$ and internal vertices $i$ satisfy $\\ell=i(m-1)+1$, so $m-1$ must divide $\\ell-1=31$ (prime). Divisors of 31 are 1 and 31, giving $m\\in\\{2,32\\}$. For $m=2$: max leaves at height 4 is $2^4=16<32$ -- impossible. For $m=32$: forces $i=1$ (just the root), giving height 1, not 4 -- impossible. So no value of $m$ works.</div><div class=\"ml-vi\">Với bất kỳ cây $m$-phân đầy đủ nào, số lá $\\ell$ và số đỉnh trong $i$ thỏa $\\ell=i(m-1)+1$, nên $m-1$ phải chia hết $\\ell-1=31$ (số nguyên tố). Ước của 31 là 1 và 31, cho $m\\in\\{2,32\\}$. Với $m=2$: số lá tối đa ở chiều cao 4 là $2^4=16<32$ -- không thể. Với $m=32$: buộc $i=1$ (chỉ gốc), cho chiều cao 1, không phải 4 -- không thể. Vậy không giá trị $m$ nào thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the maximum number of internal vertices of a full 3-ary tree of height 3.|||Tìm số đỉnh trong tối đa của một cây 3-phân đầy đủ chiều cao 3.",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "21|||21"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">To maximize internal vertices, make every node at levels $0,1,2$ internal (leaves only at the deepest level 3): $1+3+9=13$.</div><div class=\"ml-vi\">Để tối đa số đỉnh trong, cho mọi nút ở mức $0,1,2$ đều là đỉnh trong (lá chỉ ở mức sâu nhất 3): $1+3+9=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed in order to locate the word \"lemon\" in the binary search tree of the list mango, banana, apple, pear, coconut, strawberry, lemon?|||Cần bao nhiêu phép so sánh để tìm từ \"lemon\" trong cây tìm kiếm nhị phân được xây từ danh sách mango, banana, apple, pear, coconut, strawberry, lemon?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Inserting in order builds: mango (root); banana < mango goes left; apple < banana goes left; pear > mango goes right; coconut < mango, > banana goes right of banana; strawberry > mango, > pear goes right of pear; lemon < mango (left), > banana (right), < coconut (left) -- found at depth 3. Locating it takes comparisons at mango, banana, coconut, then lemon itself: 4 comparisons.</div><div class=\"ml-vi\">Chèn theo thứ tự xây dựng: mango (gốc); banana < mango sang trái; apple < banana sang trái; pear > mango sang phải; coconut < mango, > banana sang phải của banana; strawberry > mango, > pear sang phải của pear; lemon < mango (trái), > banana (phải), < coconut (trái) -- tìm thấy ở độ sâu 3. Tìm nó cần so sánh tại mango, banana, coconut, rồi chính lemon: 4 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of comparisons needed to sort a list of 6 elements.|||Tìm số phép so sánh ít nhất cần để sắp xếp một danh sách 6 phần tử.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "720|||720"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The comparison-sort lower bound is $\\lceil\\log_2(n!)\\rceil$. For $n=6$: $6!=720$, $\\log_2(720)\\approx9.49$, so $\\lceil9.49\\rceil=10$.</div><div class=\"ml-vi\">Cận dưới của sắp xếp bằng so sánh là $\\lceil\\log_2(n!)\\rceil$. Với $n=6$: $6!=720$, $\\log_2(720)\\approx9.49$, nên $\\lceil9.49\\rceil=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the prefix expression $+\\ *\\ *\\ -\\ 4\\ 3\\ 2\\ 5\\ /\\ 8\\ 4$|||Tìm giá trị của biểu thức tiền tố $+\\ *\\ *\\ -\\ 4\\ 3\\ 2\\ 5\\ /\\ 8\\ 4$",
          "options": [
            {
              "text": "12|||12"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "14|||14"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Parsing recursively from the left: innermost $-\\,4\\,3=1$, then $*\\,1\\,2=2$, then $*\\,2\\,5=10$ (first operand of the root's left branch). Then $/\\,8\\,4=2$ (root's right branch). Finally $+\\,10\\,2=12$.</div><div class=\"ml-vi\">Phân tích đệ quy từ trái: trong cùng $-\\,4\\,3=1$, rồi $*\\,1\\,2=2$, rồi $*\\,2\\,5=10$ (toán hạng đầu của nhánh trái gốc). Rồi $/\\,8\\,4=2$ (nhánh phải gốc). Cuối cùng $+\\,10\\,2=12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the tree: root $a$ with children $b,c$; $b$'s children $d,e$; $e$'s children $i,j$; $j$'s children $m,n,o$; $c$'s children $f,g,h$; $h$'s children $k,l$; $l$'s child $p$. What is the position of the letter $f$ when using the postorder traversal?|||Cho cây: gốc $a$ với con $b,c$; con của $b$ là $d,e$; con của $e$ là $i,j$; con của $j$ là $m,n,o$; con của $c$ là $f,g,h$; con của $h$ là $k,l$; con của $l$ là $p$. Vị trí của chữ $f$ khi dùng phép duyệt hậu thứ (postorder) là bao nhiêu?",
          "options": [
            {
              "text": "9|||9"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Postorder visits children left-to-right then the node itself. $b$'s subtree postorder: $d,i,m,n,o,j,e,b$ (positions 1-8). $c$'s subtree postorder starts with its first child $f$ (leaf) at position 9.</div><div class=\"ml-vi\">Hậu thứ duyệt các con trái sang phải rồi đến chính nút đó. Hậu thứ cây con của $b$: $d,i,m,n,o,j,e,b$ (vị trí 1-8). Hậu thứ cây con của $c$ bắt đầu với con đầu tiên $f$ (lá) ở vị trí 9.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the height of the spanning tree obtained from the complete bipartite graph $K_{4,3}$ by depth-first search, starting at a vertex of degree 4?|||Chiều cao của cây khung thu được từ đồ thị lưỡng phân đầy đủ $K_{4,3}$ bằng tìm kiếm theo chiều sâu, bắt đầu từ một đỉnh bậc 4, là bao nhiêu?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Starting at $y_1$ (in the 3-side, degree 4), DFS goes $y_1\\to x_1\\to y_2\\to x_2\\to y_3\\to x_3$ (depth 5), then backtracks to $y_3$ to visit the last unvisited vertex $x_4$ (also at depth 5). All 7 vertices are visited, and the deepest level reached is depth 5.</div><div class=\"ml-vi\">Bắt đầu tại $y_1$ (phía 3 đỉnh, bậc 4), DFS đi $y_1\\to x_1\\to y_2\\to x_2\\to y_3\\to x_3$ (độ sâu 5), rồi quay lui về $y_3$ để thăm đỉnh chưa thăm cuối cùng $x_4$ (cũng ở độ sâu 5). Cả 7 đỉnh đều được thăm, và mức sâu nhất đạt được là độ sâu 5.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Kruskal's algorithm to find a minimum spanning tree for the weighted graph with vertices $A,B,C,D,E,F,G$ and edges $AD{=}2,DF{=}1,AB{=}2,AC{=}1,DC{=}2,BC{=}2,CF{=}2,FG{=}2,BE{=}1,CE{=}3,CG{=}3$, with the first edge being $\\{A,C\\}$. Assume that the vertices are ordered alphabetically.|||Dùng thuật toán Kruskal để tìm cây khung nhỏ nhất cho đồ thị có trọng số với các đỉnh $A,B,C,D,E,F,G$ và các cạnh $AD{=}2,DF{=}1,AB{=}2,AC{=}1,DC{=}2,BC{=}2,CF{=}2,FG{=}2,BE{=}1,CE{=}3,CG{=}3$, với cạnh đầu tiên là $\\{A,C\\}$. Giả sử các đỉnh được sắp theo thứ tự chữ cái.",
          "options": [
            {
              "text": "{A,C},{B,E},{D,F},{A,D},{A,B},{F,G}|||{A,C},{B,E},{D,F},{A,D},{A,B},{F,G}"
            },
            {
              "text": "{B,E},{A,C},{D,F},{A,D},{A,B},{F,G}|||{B,E},{A,C},{D,F},{A,D},{A,B},{F,G}"
            },
            {
              "text": "{A,C},{B,E},{D,F},{A,B},{A,D},{F,G}|||{A,C},{B,E},{D,F},{A,B},{A,D},{F,G}"
            },
            {
              "text": "{A,C},{D,F},{B,E},{A,D},{A,B},{F,G}|||{A,C},{D,F},{B,E},{A,D},{A,B},{F,G}"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Weight-1 edges alphabetically: $AC,BE,DF$ -- all added (no cycles). Weight-2 edges alphabetically: $AB,AD,BC,CF,DC,FG$. $AB$ connects $\\{A,C\\}$+$\\{B,E\\}$ -- add. $AD$ connects that with $\\{D,F\\}$ -- add. $BC,CF,DC$ all create cycles -- skip. $FG$ connects the last vertex $G$ -- add. Final order: $AC,BE,DF,AB,AD,FG$.</div><div class=\"ml-vi\">Cạnh trọng số 1 theo thứ tự chữ cái: $AC,BE,DF$ -- tất cả được thêm (không tạo chu trình). Cạnh trọng số 2 theo thứ tự chữ cái: $AB,AD,BC,CF,DC,FG$. $AB$ nối $\\{A,C\\}$+$\\{B,E\\}$ -- thêm. $AD$ nối với $\\{D,F\\}$ -- thêm. $BC,CF,DC$ đều tạo chu trình -- bỏ qua. $FG$ nối đỉnh cuối $G$ -- thêm. Thứ tự cuối: $AC,BE,DF,AB,AD,FG$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D6",
      "source": "REAL",
      "sortOrder": 206,
      "title": "Final Exam — Đề 6|||Thi cuối kỳ — Đề 6",
      "description": "MAD101 Final Exam, Đề 6 (48 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 6 (48 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 96,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $p$=\"You passed this class\" and $q$=\"Your average course grade is above 5\". Translate the sentence into a logical expression: \"To pass this class, it is necessary that your average course grade is above 5\". (i) $\\neg p\\to\\neg q$ (ii) $q\\to p$ (iii) $p\\land q$ (iv) $p\\to q$|||Cho $p$=\"Bạn đậu môn này\" và $q$=\"Điểm trung bình môn của bạn trên 5\". Diễn đạt câu sau thành biểu thức logic: \"Để đậu môn này, điều kiện cần là điểm trung bình môn của bạn trên 5\". (i) $\\neg p\\to\\neg q$ (ii) $q\\to p$ (iii) $p\\land q$ (iv) $p\\to q$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"It is necessary that $q$\" for $p$ means $q$ is a necessary condition for $p$, translating to $p\\to q$: if you pass, then your grade is above 5. This is option (iv).</div><div class=\"ml-vi\">\"Điều kiện cần là $q$\" cho $p$ nghĩa là $q$ là điều kiện cần cho $p$, diễn đạt thành $p\\to q$: nếu bạn đậu, thì điểm bạn trên 5. Đây là đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which proposition is False?|||Mệnh đề nào là Sai?",
          "options": [
            {
              "text": "2+2=4 if and only if 1+1=2|||2+2=4 khi và chỉ khi 1+1=2"
            },
            {
              "text": "If 1+1=3 then space aliens exist|||Nếu 1+1=3 thì người ngoài hành tinh tồn tại"
            },
            {
              "text": "If 1+1=2 then 2+2=3|||Nếu 1+1=2 thì 2+2=3"
            },
            {
              "text": "If 1<0 then 3=4|||Nếu 1<0 thì 3=4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A: both sides true, so iff is true. B: antecedent \"1+1=3\" is false, so the implication is vacuously true. D: antecedent \"1<0\" is false, so vacuously true. C: antecedent \"1+1=2\" is TRUE but consequent \"2+2=3\" is FALSE, so $T\\to F=$ False -- this is the false proposition.</div><div class=\"ml-vi\">A: cả hai vế đúng, nên iff đúng. B: tiền đề \"1+1=3\" sai, nên phép kéo theo đúng hiển nhiên. D: tiền đề \"1<0\" sai, nên đúng hiển nhiên. C: tiền đề \"1+1=2\" ĐÚNG nhưng hệ quả \"2+2=3\" SAI, nên $T\\to F=$ Sai -- đây là mệnh đề sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which proposition is a contradiction? (i) $p\\land q$ (ii) $p\\to q$ (iii) $(p\\to q)\\land(q\\to p)$|||Mệnh đề nào là hằng sai (contradiction)? (i) $p\\land q$ (ii) $p\\to q$ (iii) $(p\\to q)\\land(q\\to p)$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) $p\\land q$ is true when $p=q=T$, not always false. (ii) $p\\to q$ is true whenever $p$ is false, not always false. (iii) $(p\\to q)\\land(q\\to p)\\equiv p\\leftrightarrow q$ is true when $p=q$, not always false. None of (i)-(iii) is a contradiction.</div><div class=\"ml-vi\">(i) $p\\land q$ đúng khi $p=q=T$, không luôn sai. (ii) $p\\to q$ đúng bất cứ khi nào $p$ sai, không luôn sai. (iii) $(p\\to q)\\land(q\\to p)\\equiv p\\leftrightarrow q$ đúng khi $p=q$, không luôn sai. Không mệnh đề (i)-(iii) nào là hằng sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x$ represent a student in a university. Let $A(x)$=\"x is a student of class 1A\", $B(x)$=\"x has visited Brazil\", $C(x)$=\"x has visited Columbia\". Translate the sentence into a logical expression: \"Every student of class 1A has visited Brazil or Columbia\". (i) $\\forall x(A(x)\\land(B(x)\\lor C(x)))$ (ii) $\\exists x(A(x)\\to(B(x)\\lor C(x)))$ (iii) $\\forall x(A(x)\\to(B(x)\\lor C(x)))$ (iv) $\\forall x(A(x)\\land(B(x)\\land C(x)))$|||Cho $x$ đại diện một sinh viên trong trường đại học. Cho $A(x)$=\"x là sinh viên lớp 1A\", $B(x)$=\"x đã đến Brazil\", $C(x)$=\"x đã đến Columbia\". Diễn đạt câu sau thành biểu thức logic: \"Mọi sinh viên lớp 1A đều đã đến Brazil hoặc Columbia\". (i) $\\forall x(A(x)\\land(B(x)\\lor C(x)))$ (ii) $\\exists x(A(x)\\to(B(x)\\lor C(x)))$ (iii) $\\forall x(A(x)\\to(B(x)\\lor C(x)))$ (iv) $\\forall x(A(x)\\land(B(x)\\land C(x)))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">\"Every student of class 1A has...\" is a universal implication: for every $x$, if $x$ is in class 1A then $x$ has visited Brazil or Columbia -- $\\forall x(A(x)\\to(B(x)\\lor C(x)))$, option (iii).</div><div class=\"ml-vi\">\"Mọi sinh viên lớp 1A đều...\" là phép kéo theo toàn thể: với mọi $x$, nếu $x$ thuộc lớp 1A thì $x$ đã đến Brazil hoặc Columbia -- $\\forall x(A(x)\\to(B(x)\\lor C(x)))$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be the statement \"x can speak French\", $Q(x)$ be the statement \"x can speak Japanese\". Translate the logical expression $\\forall x(P(x)\\lor Q(x))$ into a sentence, if the domain consists of all students in your class.|||Cho $P(x)$ là mệnh đề \"x nói được tiếng Pháp\", $Q(x)$ là mệnh đề \"x nói được tiếng Nhật\". Diễn đạt biểu thức logic $\\forall x(P(x)\\lor Q(x))$ thành câu, với miền là mọi sinh viên trong lớp bạn.",
          "options": [
            {
              "text": "Every student in your class can speak both French and Japanese.|||Mọi sinh viên trong lớp bạn đều nói được cả tiếng Pháp và tiếng Nhật."
            },
            {
              "text": "There is a student in your class who can speak French or Japanese.|||Có một sinh viên trong lớp bạn nói được tiếng Pháp hoặc tiếng Nhật."
            },
            {
              "text": "Every student in your class can speak French or Japanese.|||Mọi sinh viên trong lớp bạn đều nói được tiếng Pháp hoặc tiếng Nhật."
            },
            {
              "text": "No student in your class can speak both French and Japanese.|||Không sinh viên nào trong lớp bạn nói được cả tiếng Pháp và tiếng Nhật."
            },
            {
              "text": "There is a student in your class who can speak both French and Japanese.|||Có một sinh viên trong lớp bạn nói được cả tiếng Pháp và tiếng Nhật."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\forall x$ is universal (\"every student\"), and $P(x)\\lor Q(x)$ means \"can speak French or Japanese\". Combined: \"Every student in your class can speak French or Japanese.\"</div><div class=\"ml-vi\">$\\forall x$ là toàn thể (\"mọi sinh viên\"), và $P(x)\\lor Q(x)$ nghĩa là \"nói được tiếng Pháp hoặc tiếng Nhật\". Kết hợp: \"Mọi sinh viên trong lớp bạn đều nói được tiếng Pháp hoặc tiếng Nhật.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $m,n$ be integers. Translate the sentence into a logical expression: \"Each integer is either odd or even\". (i) $\\forall m\\forall n[(m=2n+1)\\lor(m=2n)]$ (ii) $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iii) $\\exists m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iv) $\\exists m\\forall n[(m=2n+1)\\lor(m=2n)]$|||Cho $m,n$ là số nguyên. Diễn đạt câu sau thành biểu thức logic: \"Mỗi số nguyên đều là lẻ hoặc chẵn\". (i) $\\forall m\\forall n[(m=2n+1)\\lor(m=2n)]$ (ii) $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iii) $\\exists m\\exists n[(m=2n+1)\\lor(m=2n)]$ (iv) $\\exists m\\forall n[(m=2n+1)\\lor(m=2n)]$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"Each integer\" is universal over $m$: $\\forall m$. \"Is either odd or even\" means there exists some $n$ making $m$ fit the odd form or the even form: $\\exists n[(m=2n+1)\\lor(m=2n)]$. Combined: $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$, option (ii).</div><div class=\"ml-vi\">\"Mỗi số nguyên\" là toàn thể trên $m$: $\\forall m$. \"Là lẻ hoặc chẵn\" nghĩa là tồn tại $n$ nào đó khiến $m$ khớp dạng lẻ hoặc dạng chẵn: $\\exists n[(m=2n+1)\\lor(m=2n)]$. Kết hợp: $\\forall m\\exists n[(m=2n+1)\\lor(m=2n)]$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $Q(x,y)$=\"$x+y=0$\" on the set of integers. Which proposition is TRUE? (i) $\\exists x\\forall yQ(x,y)$ (ii) $\\forall x\\exists yQ(x,y)$ (iii) $\\forall x\\forall yQ(x,y)$ (iv) $\\exists y\\forall xQ(x,y)$|||Cho $Q(x,y)$=\"$x+y=0$\" trên tập số nguyên. Mệnh đề nào ĐÚNG? (i) $\\exists x\\forall yQ(x,y)$ (ii) $\\forall x\\exists yQ(x,y)$ (iii) $\\forall x\\forall yQ(x,y)$ (iv) $\\exists y\\forall xQ(x,y)$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">(i) is false: no single $x$ satisfies $x+y=0$ for all $y$. (ii) is true: for every $x$, choosing $y=-x$ satisfies $x+y=0$. (iii) is false: not all $x,y$ pairs sum to 0. (iv) is false: no single $y$ works for all $x$. Only (ii) is true.</div><div class=\"ml-vi\">(i) sai: không có $x$ đơn lẻ nào thỏa $x+y=0$ với mọi $y$. (ii) đúng: với mọi $x$, chọn $y=-x$ thỏa $x+y=0$. (iii) sai: không phải mọi cặp $x,y$ đều có tổng 0. (iv) sai: không có $y$ đơn lẻ nào thỏa mọi $x$. Chỉ (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the premises: \"Every student in this class is either a Computer Science major or a Math major\", \"Every Computer Science major studies Discrete Mathematics\", \"Every Math major studies Calculus\", \"An, a student in this class, does not study Discrete Mathematics\", \"Binh, a student in this class, does not study Calculus\". Which conclusion can be drawn? (i) An is a Computer Science major (ii) An is a Math major (iii) Binh is a Computer Science major (iv) Binh is a Math major|||Cho các tiền đề: \"Mọi sinh viên trong lớp này đều là sinh viên ngành Khoa học Máy tính hoặc ngành Toán\", \"Mọi sinh viên ngành Khoa học Máy tính đều học Toán rời rạc\", \"Mọi sinh viên ngành Toán đều học Giải tích\", \"An, một sinh viên trong lớp này, không học Toán rời rạc\", \"Binh, một sinh viên trong lớp này, không học Giải tích\". Kết luận nào có thể rút ra? (i) An là sinh viên ngành Khoa học Máy tính (ii) An là sinh viên ngành Toán (iii) Binh là sinh viên ngành Khoa học Máy tính (iv) Binh là sinh viên ngành Toán",
          "options": [
            {
              "text": "(i) and (iii)|||(i) và (iii)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(i) and (iv)|||(i) và (iv)"
            },
            {
              "text": "(ii) and (iv)|||(ii) và (iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An doesn't study Discrete Math, so by contrapositive An is not a CS major, hence (since every student is CS or Math) An is a Math major -- (ii). Binh doesn't study Calculus, so by contrapositive Binh is not a Math major, hence Binh is a CS major -- (iii). So (ii) and (iii).</div><div class=\"ml-vi\">An không học Toán rời rạc, nên theo phản đảo An không phải sinh viên KHMT, do đó (vì mọi sinh viên đều KHMT hoặc Toán) An là sinh viên ngành Toán -- (ii). Binh không học Giải tích, nên theo phản đảo Binh không phải sinh viên ngành Toán, do đó Binh là sinh viên KHMT -- (iii). Vậy (ii) và (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The set $A$ has $n$ elements, $B$ has $n+1$ elements. Assume that $A\\times B$ has 72 elements. Find $n$.|||Tập $A$ có $n$ phần tử, $B$ có $n+1$ phần tử. Giả sử $A\\times B$ có 72 phần tử. Tìm $n$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$|A\\times B|=n(n+1)=72$. Solving $n^2+n-72=0$ gives $n=\\frac{-1+\\sqrt{1+288}}{2}=\\frac{-1+17}{2}=8$.</div><div class=\"ml-vi\">$|A\\times B|=n(n+1)=72$. Giải $n^2+n-72=0$ cho $n=\\frac{-1+\\sqrt{1+288}}{2}=\\frac{-1+17}{2}=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose $S=\\{1,2,3,4,5\\}$. Find $|P(S)|$.|||Cho $S=\\{1,2,3,4,5\\}$. Tìm $|P(S)|$.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "32|||32"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The power set of a set with $n$ elements has $2^n$ elements. Here $n=5$, so $|P(S)|=2^5=32$.</div><div class=\"ml-vi\">Tập lũy thừa của một tập có $n$ phần tử có $2^n$ phần tử. Ở đây $n=5$, nên $|P(S)|=2^5=32$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $X=\\{1,2,3,4,5\\}$, $Y=\\{0,3,6,9\\}$. Which of the following sets has the minimal cardinality? (i) $X\\cap Y$ (ii) $X-Y$ (iii) $Y-X$|||Cho $X=\\{1,2,3,4,5\\}$, $Y=\\{0,3,6,9\\}$. Tập nào sau đây có lực lượng nhỏ nhất? (i) $X\\cap Y$ (ii) $X-Y$ (iii) $Y-X$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$X\\cap Y=\\{3\\}$, cardinality 1. $X-Y=\\{1,2,4,5\\}$, cardinality 4. $Y-X=\\{0,6,9\\}$, cardinality 3. The minimum is $X\\cap Y$, option (i).</div><div class=\"ml-vi\">$X\\cap Y=\\{3\\}$, lực lượng 1. $X-Y=\\{1,2,4,5\\}$, lực lượng 4. $Y-X=\\{0,6,9\\}$, lực lượng 3. Nhỏ nhất là $X\\cap Y$, đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $N=\\{0,1,2,\\ldots\\}$. Let $f:N\\to N$ be the function defined by $f(x)=x^2-2x+1$. Choose the correct statement.|||Cho $N=\\{0,1,2,\\ldots\\}$. Cho $f:N\\to N$ là hàm được định nghĩa bởi $f(x)=x^2-2x+1$. Chọn phát biểu đúng.",
          "options": [
            {
              "text": "f is onto but not one-to-one|||f là toàn ánh nhưng không đơn ánh"
            },
            {
              "text": "f is a bijection|||f là song ánh"
            },
            {
              "text": "f is one-to-one but not onto|||f là đơn ánh nhưng không toàn ánh"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=(x-1)^2$ only produces perfect squares ($0,1,4,9,\\ldots$), missing values like 2 -- not onto. Also $f(0)=1$ and $f(2)=1$ -- not one-to-one. So $f$ is neither onto nor one-to-one.</div><div class=\"ml-vi\">$f(x)=(x-1)^2$ chỉ cho ra các số chính phương ($0,1,4,9,\\ldots$), thiếu các giá trị như 2 -- không toàn ánh. Ngoài ra $f(0)=1$ và $f(2)=1$ -- không đơn ánh. Vậy $f$ không toàn ánh cũng không đơn ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The function $f:N\\to N$ is given by $f(n)=\\lfloor\\sqrt n\\rfloor$. Which statement is TRUE?|||Hàm $f:N\\to N$ cho bởi $f(n)=\\lfloor\\sqrt n\\rfloor$. Phát biểu nào ĐÚNG?",
          "options": [
            {
              "text": "f is one-to-one but not onto|||f đơn ánh nhưng không toàn ánh"
            },
            {
              "text": "f is onto but not one-to-one|||f toàn ánh nhưng không đơn ánh"
            },
            {
              "text": "f is bijection|||f song ánh"
            },
            {
              "text": "f is neither one-to-one nor onto|||f không đơn ánh cũng không toàn ánh"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Onto: for any $m\\in N$, $n=m^2$ gives $f(n)=m$, so every natural number is reached -- onto. Not one-to-one: $f(1)=1$ and $f(2)=\\lfloor1.414\\rfloor=1$, a repeated value. So $f$ is onto but not one-to-one.</div><div class=\"ml-vi\">Toàn ánh: với mọi $m\\in N$, $n=m^2$ cho $f(n)=m$, nên mọi số tự nhiên đều đạt được -- toàn ánh. Không đơn ánh: $f(1)=1$ và $f(2)=\\lfloor1.414\\rfloor=1$, giá trị lặp lại. Vậy $f$ toàn ánh nhưng không đơn ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a_1,a_2,\\ldots$ be the sequence $0,1,1,0,0,0,1,1,1,1,\\ldots$ formed by blocks of increasing length alternating 0s and 1s (block $k$ has length $k$, block 1 = one 0, block 2 = two 1s, block 3 = three 0s, block 4 = four 1s, etc). Find $a_{100}$ and $a_{110}$.|||Cho $a_1,a_2,\\ldots$ là dãy $0,1,1,0,0,0,1,1,1,1,\\ldots$ tạo bởi các khối độ dài tăng dần xen kẽ 0 và 1 (khối $k$ có độ dài $k$, khối 1 = một số 0, khối 2 = hai số 1, khối 3 = ba số 0, khối 4 = bốn số 1, v.v). Tìm $a_{100}$ và $a_{110}$.",
          "options": [
            {
              "text": "1 and 1|||1 và 1"
            },
            {
              "text": "1 and 0|||1 và 0"
            },
            {
              "text": "0 and 1|||0 và 1"
            },
            {
              "text": "0 and 0|||0 và 0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Cumulative length after block $k$ is $\\frac{k(k+1)}{2}$. Block 13 ends at $\\frac{13\\cdot14}{2}=91$; block 14 spans positions 92-105 (even block $\\to$ 1s), so $a_{100}=1$. Block 14 ends at 105; block 15 spans 106-120 (odd block $\\to$ 0s), so $a_{110}=0$.</div><div class=\"ml-vi\">Tổng độ dài lũy kế sau khối $k$ là $\\frac{k(k+1)}{2}$. Khối 13 kết thúc ở $\\frac{13\\cdot14}{2}=91$; khối 14 trải từ vị trí 92-105 (khối chẵn $\\to$ số 1), nên $a_{100}=1$. Khối 14 kết thúc ở 105; khối 15 trải 106-120 (khối lẻ $\\to$ số 0), nên $a_{110}=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm to find the maximum element of a list: procedure Max($a_1,a_2,\\ldots,a_n$: integers): $Max:=a_1$; for $i:=2$ to $n$ do if $Max<a_i$ then $Max:=a_i$. If the input is the sequence $1,4,5,2,7,9,3$, then all the values of the variable $Max$ are ___|||Cho thuật toán tìm phần tử lớn nhất của dãy: procedure Max($a_1,a_2,\\ldots,a_n$: integers): $Max:=a_1$; for $i:=2$ to $n$ do if $Max<a_i$ then $Max:=a_i$. Nếu đầu vào là dãy $1,4,5,2,7,9,3$, thì tất cả các giá trị của biến $Max$ là ___",
          "options": [
            {
              "text": "4, 5, 7, 9|||4, 5, 7, 9"
            },
            {
              "text": "1, 4, 5, 7, 9|||1, 4, 5, 7, 9"
            },
            {
              "text": "1, 5, 7, 9|||1, 5, 7, 9"
            },
            {
              "text": "1, 4, 5, 2, 7, 9|||1, 4, 5, 2, 7, 9"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$Max$ starts at 1. Then: $4>1\\to Max=4$; $5>4\\to Max=5$; $2\\not>5$ no change; $7>5\\to Max=7$; $9>7\\to Max=9$; $3\\not>9$ no change. All values $Max$ takes: $1,4,5,7,9$.</div><div class=\"ml-vi\">$Max$ bắt đầu là 1. Rồi: $4>1\\to Max=4$; $5>4\\to Max=5$; $2\\not>5$ không đổi; $7>5\\to Max=7$; $9>7\\to Max=9$; $3\\not>9$ không đổi. Tất cả giá trị $Max$ nhận: $1,4,5,7,9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which functions are $O(x^3)$? (i) $f(x)=8x^3+13x^2+98x\\log x$ (ii) $f(x)=\\lfloor x^2+1\\rfloor\\lfloor x^2-1\\rfloor$ (iii) $f(x)=2x^2+x^3\\log x$|||Hàm nào là $O(x^3)$? (i) $f(x)=8x^3+13x^2+98x\\log x$ (ii) $f(x)=\\lfloor x^2+1\\rfloor\\lfloor x^2-1\\rfloor$ (iii) $f(x)=2x^2+x^3\\log x$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">(i): dominant term $8x^3$, and $x^2,x\\log x$ are both $o(x^3)$, so $f(x)=O(x^3)$. (ii): $(x^2+1)(x^2-1)\\approx x^4-1$ grows like $x^4$, NOT $O(x^3)$. (iii): $x^3\\log x$ grows strictly faster than any constant multiple of $x^3$, so NOT $O(x^3)$. Only (i) qualifies.</div><div class=\"ml-vi\">(i): số hạng chiếm ưu thế $8x^3$, và $x^2,x\\log x$ đều là $o(x^3)$, nên $f(x)=O(x^3)$. (ii): $(x^2+1)(x^2-1)\\approx x^4-1$ tăng như $x^4$, KHÔNG phải $O(x^3)$. (iii): $x^3\\log x$ tăng nhanh hơn hẳn bất kỳ hằng số nhân $x^3$ nào, nên KHÔNG phải $O(x^3)$. Chỉ (i) thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: procedure TT($n$: integer): $sum:=0$; $i:=0$; $j:=0$; while ($i<\\sqrt n$): $sum:=sum+1$, $i:=i+1$; while ($j<\\sqrt n/2$): $j:=j+1$, $sum:=sum+1$; Print($sum$). If $n=9$, how many additions are required?|||Cho thuật toán: procedure TT($n$: integer): $sum:=0$; $i:=0$; $j:=0$; while ($i<\\sqrt n$): $sum:=sum+1$, $i:=i+1$; while ($j<\\sqrt n/2$): $j:=j+1$, $sum:=sum+1$; Print($sum$). Nếu $n=9$, cần bao nhiêu phép cộng?",
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "14|||14"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\sqrt9=3$. First loop: $i=0,1,2$ satisfy $i<3$ (3 iterations), each doing 2 additions ($sum{+}{=}1$, $i{+}{=}1$) $=6$ additions. Second loop condition $j<1.5$: $j=0,1$ satisfy (2 iterations), each doing 2 additions ($j{+}{=}1$, $sum{+}{=}1$) $=4$ additions. Total $=6+4=10$.</div><div class=\"ml-vi\">$\\sqrt9=3$. Vòng lặp đầu: $i=0,1,2$ thỏa $i<3$ (3 lần lặp), mỗi lần thực hiện 2 phép cộng ($sum{+}{=}1$, $i{+}{=}1$) $=6$ phép cộng. Điều kiện vòng lặp hai $j<1.5$: $j=0,1$ thỏa (2 lần lặp), mỗi lần 2 phép cộng ($j{+}{=}1$, $sum{+}{=}1$) $=4$ phép cộng. Tổng $=6+4=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the quotient $q$ and remainder $r$ when $-98$ is divided by 5.|||Tìm thương $q$ và dư $r$ khi $-98$ chia cho 5.",
          "options": [
            {
              "text": "q = -20, r = 2|||q = -20, r = 2"
            },
            {
              "text": "q = -19, r = -3|||q = -19, r = -3"
            },
            {
              "text": "q = -20, r = -2|||q = -20, r = -2"
            },
            {
              "text": "q = -19, r = 3|||q = -19, r = 3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By convention $0\\le r<5$. $-98=5q+r$: try $q=-20$: $5(-20)=-100$, $r=-98-(-100)=2$, valid since $0\\le2<5$. So $q=-20,r=2$.</div><div class=\"ml-vi\">Theo quy ước $0\\le r<5$. $-98=5q+r$: thử $q=-20$: $5(-20)=-100$, $r=-98-(-100)=2$, hợp lệ vì $0\\le2<5$. Vậy $q=-20,r=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following integers is congruent to 130 modulo 6?|||Số nguyên nào sau đây đồng dư với 130 theo modulo 6?",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$130=6\\times21+4$, so $130\\equiv4\\pmod6$.</div><div class=\"ml-vi\">$130=6\\times21+4$, nên $130\\equiv4\\pmod6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the exponent of 3 in the prime factorization of $10!$.|||Tìm số mũ của 3 trong phân tích thừa số nguyên tố của $10!$.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By Legendre's formula: $\\lfloor10/3\\rfloor+\\lfloor10/9\\rfloor+\\lfloor10/27\\rfloor=3+1+0=4$.</div><div class=\"ml-vi\">Theo công thức Legendre: $\\lfloor10/3\\rfloor+\\lfloor10/9\\rfloor+\\lfloor10/27\\rfloor=3+1+0=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose $a=2^3 3^3 5^2 7^1$ and $b=2^2 3^3 5^4 7^1$. Find $\\frac{lcm(a,b)}{\\gcd(a,b)}$. (i) $2^1 3^1 5^1 7^1$ (ii) $2^1 5^2$ (iii) $2^1 3^1 5^2$ (iv) $2^2 3^1 5^2$|||Cho $a=2^3 3^3 5^2 7^1$ và $b=2^2 3^3 5^4 7^1$. Tìm $\\frac{lcm(a,b)}{\\gcd(a,b)}$. (i) $2^1 3^1 5^1 7^1$ (ii) $2^1 5^2$ (iii) $2^1 3^1 5^2$ (iv) $2^2 3^1 5^2$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$lcm(a,b)=2^3 3^3 5^4 7^1$, $\\gcd(a,b)=2^2 3^3 5^2 7^1$. Ratio $=2^{3-2}3^{3-3}5^{4-2}7^{1-1}=2^1 3^0 5^2 7^0=2^1 5^2$.</div><div class=\"ml-vi\">$lcm(a,b)=2^3 3^3 5^4 7^1$, $\\gcd(a,b)=2^2 3^3 5^2 7^1$. Tỉ số $=2^{3-2}3^{3-3}5^{4-2}7^{1-1}=2^1 3^0 5^2 7^0=2^1 5^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When using the modular exponentiation algorithm to compute $7^9\\bmod19$, the remainders computed by successively squaring are ___|||Khi dùng thuật toán lũy thừa modular để tính $7^9\\bmod19$, các số dư tính được bằng cách bình phương liên tiếp là ___",
          "options": [
            {
              "text": "7,7,11,11|||7,7,11,11"
            },
            {
              "text": "11,11,7,7|||11,11,7,7"
            },
            {
              "text": "11,7,11,7|||11,7,11,7"
            },
            {
              "text": "7,11,7,11|||7,11,7,11"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$7^1\\bmod19=7$. $7^2\\bmod19=49\\bmod19=11$. $7^4=(7^2)^2\\bmod19=11^2\\bmod19=121\\bmod19=7$. $7^8=(7^4)^2\\bmod19=7^2\\bmod19=11$. Sequence: $7,11,7,11$.</div><div class=\"ml-vi\">$7^1\\bmod19=7$. $7^2\\bmod19=49\\bmod19=11$. $7^4=(7^2)^2\\bmod19=11^2\\bmod19=121\\bmod19=7$. $7^8=(7^4)^2\\bmod19=7^2\\bmod19=11$. Dãy: $7,11,7,11$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the binary expansion of 243. (i) $(11110010)_2$ (ii) $(11100010)_2$ (iii) $(11010011)_2$ (iv) $(11110011)_2$|||Tìm biểu diễn nhị phân của 243. (i) $(11110010)_2$ (ii) $(11100010)_2$ (iii) $(11010011)_2$ (iv) $(11110011)_2$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$243=128+64+32+16+2+1=(11110011)_2$. Checking: $128+64+32+16+0+0+2+1=243$. Matches option (iv).</div><div class=\"ml-vi\">$243=128+64+32+16+2+1=(11110011)_2$. Kiểm: $128+64+32+16+0+0+2+1=243$. Khớp đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the correct order of steps of a proof by induction of the problem \"Prove that for all positive integers $n>6$ then $3^n<n!$\": 1. Assume the inequality is true for some $k>6$. We need to show that $3^{k+1}<(k+1)!$. 2. For $n=7$ then $3^7=2187<7!=5040$. 3. Then $3^n<n!$ for all positive integers $n>6$. 4. Indeed, $3^{k+1}=3\\cdot3^k<3(k!)$ by the induction hypothesis. Since $3(k!)<(k+1)!$ for $k>6$, we have $3^{k+1}<(k+1)!$.|||Tìm thứ tự đúng các bước chứng minh quy nạp cho bài toán \"Chứng minh rằng với mọi số nguyên dương $n>6$ thì $3^n<n!$\": 1. Giả sử bất đẳng thức đúng với $k>6$ nào đó. Cần chứng minh $3^{k+1}<(k+1)!$. 2. Với $n=7$ thì $3^7=2187<7!=5040$. 3. Vậy $3^n<n!$ với mọi số nguyên dương $n>6$. 4. Thật vậy, $3^{k+1}=3\\cdot3^k<3(k!)$ theo giả thiết quy nạp. Vì $3(k!)<(k+1)!$ với $k>6$, ta có $3^{k+1}<(k+1)!$.",
          "options": [
            {
              "text": "1, 2, 4, 3|||1, 2, 4, 3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1, 2, 3, 4|||1, 2, 3, 4"
            },
            {
              "text": "2, 1, 3, 4|||2, 1, 3, 4"
            },
            {
              "text": "2, 1, 4, 3|||2, 1, 4, 3"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">The correct proof order is: basis case (2, $n=7$) first, then state the inductive hypothesis and goal (1), then prove the inductive step (4), then state the conclusion (3). Order: 2,1,4,3.</div><div class=\"ml-vi\">Thứ tự chứng minh đúng là: trường hợp cơ sở (2, $n=7$) trước, rồi phát biểu giả thiết quy nạp và mục tiêu (1), rồi chứng minh bước quy nạp (4), rồi phát biểu kết luận (3). Thứ tự: 2,1,4,3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a recursive definition for the set of all positive integers NOT divisible by 3. (i) $1\\in S$, if $a\\in S$ then $a+3\\in S$ and $a-3\\in S$ (ii) $1\\in S$, if $a\\in S$ then $a+3\\in S$ (iii) $1,2\\in S$, if $a\\in S$ then $a+3\\in S$ and $a-3\\in S$ (iv) $1,2\\in S$, if $a\\in S$ then $a+3\\in S$|||Tìm định nghĩa đệ quy cho tập mọi số nguyên dương KHÔNG chia hết cho 3. (i) $1\\in S$, nếu $a\\in S$ thì $a+3\\in S$ và $a-3\\in S$ (ii) $1\\in S$, nếu $a\\in S$ thì $a+3\\in S$ (iii) $1,2\\in S$, nếu $a\\in S$ thì $a+3\\in S$ và $a-3\\in S$ (iv) $1,2\\in S$, nếu $a\\in S$ thì $a+3\\in S$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Positive integers not divisible by 3 are those $\\equiv1$ or $\\equiv2\\pmod3$: $1,2,4,5,7,8,\\ldots$. Basis $1,2\\in S$ covers both residues, and $a+3\\in S$ preserves the residue while generating all larger members. This is option (iv); the extra $a-3\\in S$ rule in (iii) is unnecessary and could produce non-positive integers.</div><div class=\"ml-vi\">Số nguyên dương không chia hết cho 3 là những số $\\equiv1$ hoặc $\\equiv2\\pmod3$: $1,2,4,5,7,8,\\ldots$. Cơ sở $1,2\\in S$ bao phủ cả hai lớp dư, và $a+3\\in S$ giữ nguyên lớp dư trong khi sinh mọi thành viên lớn hơn. Đây là đáp án (iv); quy tắc $a-3\\in S$ thêm ở (iii) không cần thiết và có thể sinh số không dương.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are TRUE? (i) An algorithm is called recursive if it solves a problem by reducing it to an instance of the same problem. (ii) The value of a recursively defined function can be obtained by a recursive algorithm. (iii) If a problem can be solved utilizing solutions to smaller versions of the same problem, and the smaller versions reduce to easily solvable cases, then one can use a recursive algorithm to solve that problem.|||Phát biểu nào sau đây ĐÚNG? (i) Một thuật toán được gọi là đệ quy nếu nó giải quyết bài toán bằng cách quy về một thực thể của cùng bài toán đó. (ii) Giá trị của một hàm được định nghĩa đệ quy có thể thu được bằng một thuật toán đệ quy. (iii) Nếu một bài toán có thể giải được bằng cách sử dụng lời giải của các phiên bản nhỏ hơn của cùng bài toán, và các phiên bản nhỏ hơn quy về các trường hợp dễ giải, thì có thể dùng thuật toán đệ quy để giải bài toán đó.",
          "options": [
            {
              "text": "all of them|||tất cả"
            },
            {
              "text": "(i) and (ii) only|||chỉ (i) và (ii)"
            },
            {
              "text": "(i) and (iii) only|||chỉ (i) và (iii)"
            },
            {
              "text": "(ii) and (iii) only|||chỉ (ii) và (iii)"
            },
            {
              "text": "none of them|||không cái nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">All three are standard true facts about recursion from the textbook: (i) is the definition of a recursive algorithm, (ii) follows directly from how recursively defined functions are evaluated, and (iii) restates the validity condition for constructing a recursive algorithm.</div><div class=\"ml-vi\">Cả ba đều là các sự kiện chuẩn đúng về đệ quy trong giáo trình: (i) là định nghĩa của thuật toán đệ quy, (ii) suy ra trực tiếp từ cách hàm định nghĩa đệ quy được tính giá trị, và (iii) diễn đạt lại điều kiện hợp lệ để xây dựng một thuật toán đệ quy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which algorithms are iterative algorithms? (i) procedure tt1($x$: integer, $n$: positive integer): $d:=0$; for $i:=1$ to $n$ do $d:=d+x$; print($d$) (ii) procedure tt2($x$: integer, $n$: positive integer): if $n=1$ then $tt2(x,n):=x$ else $tt2(x,n):=tt2(x,n-1)+x$ (iii) procedure tt3($n$: positive integer): $s:=0$; for $i:=1$ to $n$ do $s:=s+n$; Print($s$) (iv) procedure tt4($n$: positive integer): if $n=1$ then $tt4(n):=1$ else $tt4(n):=tt4(n-1)+n$|||Thuật toán nào là thuật toán lặp (iterative)? (i) procedure tt1($x$: integer, $n$: positive integer): $d:=0$; for $i:=1$ to $n$ do $d:=d+x$; print($d$) (ii) procedure tt2($x$: integer, $n$: positive integer): nếu $n=1$ thì $tt2(x,n):=x$ ngược lại $tt2(x,n):=tt2(x,n-1)+x$ (iii) procedure tt3($n$: positive integer): $s:=0$; for $i:=1$ to $n$ do $s:=s+n$; Print($s$) (iv) procedure tt4($n$: positive integer): nếu $n=1$ thì $tt4(n):=1$ ngược lại $tt4(n):=tt4(n-1)+n$",
          "options": [
            {
              "text": "(i), (ii)|||(i), (ii)"
            },
            {
              "text": "(i), (iii)|||(i), (iii)"
            },
            {
              "text": "(iii), (iv)|||(iii), (iv)"
            },
            {
              "text": "(ii), (iv)|||(ii), (iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) and (iii) both use a `for` loop to accumulate a result -- iterative. (ii) and (iv) both call themselves with a smaller argument ($tt2(x,n-1)$, $tt4(n-1)$) -- recursive, not iterative.</div><div class=\"ml-vi\">(i) và (iii) đều dùng vòng lặp `for` để tích lũy kết quả -- lặp. (ii) và (iv) đều tự gọi chính nó với đối số nhỏ hơn ($tt2(x,n-1)$, $tt4(n-1)$) -- đệ quy, không phải lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers not exceeding 2016 are divisible by neither 7 nor 9?|||Có bao nhiêu số nguyên dương không vượt quá 2016 chia hết cho cả 7 lẫn 9 đều không?",
          "options": [
            {
              "text": "480|||480"
            },
            {
              "text": "512|||512"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1504|||1504"
            },
            {
              "text": "1536|||1536"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Divisible by 7: $\\lfloor2016/7\\rfloor=288$. Divisible by 9: $\\lfloor2016/9\\rfloor=224$. Divisible by $\\text{lcm}(7,9)=63$: $\\lfloor2016/63\\rfloor=32$. By inclusion-exclusion, divisible by 7 or 9: $288+224-32=480$. Neither: $2016-480=1536$.</div><div class=\"ml-vi\">Chia hết cho 7: $\\lfloor2016/7\\rfloor=288$. Chia hết cho 9: $\\lfloor2016/9\\rfloor=224$. Chia hết cho $\\text{lcm}(7,9)=63$: $\\lfloor2016/63\\rfloor=32$. Theo bù trừ, chia hết cho 7 hoặc 9: $288+224-32=480$. Không chia hết cho cả hai: $2016-480=1536$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Counting bit strings of length 6 with no two consecutive 0s.|||Đếm số chuỗi bit độ dài 6 không có hai bit 0 liên tiếp.",
          "options": [
            {
              "text": "21|||21"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "35|||35"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Let $a(n)$ count such strings: $a(n)=a(n-1)+a(n-2)$, $a(0)=1,a(1)=2$, giving $a(2)=3,a(3)=5,a(4)=8,a(5)=13,a(6)=21$.</div><div class=\"ml-vi\">Gọi $a(n)$ đếm các chuỗi như vậy: $a(n)=a(n-1)+a(n-2)$, $a(0)=1,a(1)=2$, cho $a(2)=3,a(3)=5,a(4)=8,a(5)=13,a(6)=21$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f(81)$ where $f$ satisfies the recurrence relation $f(n)=2f(n/3)+n$ with $f(1)=2$.|||Tìm $f(81)$ với $f$ thỏa hệ thức truy hồi $f(n)=2f(n/3)+n$ và $f(1)=2$.",
          "options": [
            {
              "text": "195|||195"
            },
            {
              "text": "135|||135"
            },
            {
              "text": "227|||227"
            },
            {
              "text": "253|||253"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=2f(1)+3=2(2)+3=7$. $f(9)=2f(3)+9=2(7)+9=23$. $f(27)=2f(9)+27=2(23)+27=73$. $f(81)=2f(27)+81=2(73)+81=227$.</div><div class=\"ml-vi\">$f(3)=2f(1)+3=2(2)+3=7$. $f(9)=2f(3)+9=2(7)+9=23$. $f(27)=2f(9)+27=2(23)+27=73$. $f(81)=2f(27)+81=2(73)+81=227$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many vertices are needed to construct a graph with 6 edges in which every vertex is of degree 3?|||Cần bao nhiêu đỉnh để dựng một đồ thị có 6 cạnh mà mọi đỉnh đều có bậc 3?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">By the handshaking lemma, sum of degrees $=2\\times$edges$=2(6)=12$. With every vertex having degree 3, the number of vertices is $12/3=4$.</div><div class=\"ml-vi\">Theo bổ đề bắt tay, tổng bậc $=2\\times$số cạnh$=2(6)=12$. Với mọi đỉnh đều bậc 3, số đỉnh là $12/3=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all bipartite graphs in the list $K_4, W_4, C_4, K_{3,4}$. (i) $K_4,W_4$ (ii) $W_4,C_4$ (iii) $C_4,K_{3,4}$|||Tìm tất cả đồ thị lưỡng phân trong danh sách $K_4, W_4, C_4, K_{3,4}$. (i) $K_4,W_4$ (ii) $W_4,C_4$ (iii) $C_4,K_{3,4}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$K_4$ contains triangles (odd cycles) -- not bipartite. $W_4$ (wheel) has triangles between the hub and adjacent rim vertices -- not bipartite. $C_4$ is an even cycle -- bipartite. $K_{3,4}$ is complete bipartite by definition -- bipartite. So the bipartite ones are $C_4,K_{3,4}$, option (iii).</div><div class=\"ml-vi\">$K_4$ chứa tam giác (chu trình lẻ) -- không lưỡng phân. $W_4$ (bánh xe) có tam giác giữa trung tâm và các đỉnh vành kề nhau -- không lưỡng phân. $C_4$ là chu trình chẵn -- lưỡng phân. $K_{3,4}$ là lưỡng phân đầy đủ theo định nghĩa -- lưỡng phân. Vậy các đồ thị lưỡng phân là $C_4,K_{3,4}$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 0s are there in the adjacency matrix of the graph $K_{m,n}$? (i) $mn$ (ii) $2mn$ (iii) $m^2+n^2$ (iv) $m^2+n^2+mn$|||Có bao nhiêu số 0 trong ma trận kề của đồ thị $K_{m,n}$? (i) $mn$ (ii) $2mn$ (iii) $m^2+n^2$ (iv) $m^2+n^2+mn$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The adjacency matrix has size $(m+n)\\times(m+n)$, so $(m+n)^2=m^2+2mn+n^2$ total entries. The number of 1s equals $2mn$ (each of the $mn$ edges contributes symmetrically to two entries). Zeros $=m^2+2mn+n^2-2mn=m^2+n^2$, option (iii).</div><div class=\"ml-vi\">Ma trận kề có kích thước $(m+n)\\times(m+n)$, nên $(m+n)^2=m^2+2mn+n^2$ tổng số phần tử. Số lượng số 1 bằng $2mn$ (mỗi cạnh trong $mn$ cạnh đóng góp đối xứng vào hai phần tử). Số 0 $=m^2+2mn+n^2-2mn=m^2+n^2$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a pseudograph $G$ with incidence matrix (rows=vertices $v_1,v_2,v_3$, columns=edges $e_1..e_5$): row $v_1$=$[0,1,0,1,0]$, row $v_2$=$[1,0,0,0,1]$, row $v_3$=$[0,1,1,0,1]$. How many loops does $G$ have?|||Cho giả đồ thị $G$ với ma trận liên thuộc (hàng=đỉnh $v_1,v_2,v_3$, cột=cạnh $e_1..e_5$): hàng $v_1$=$[0,1,0,1,0]$, hàng $v_2$=$[1,0,0,0,1]$, hàng $v_3$=$[0,1,1,0,1]$. $G$ có bao nhiêu khuyên (loop)?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A normal edge has exactly 2 ones in its column (one per endpoint); a loop has only 1 (touching just one vertex). Column sums: $e_1$=1 (loop at $v_2$), $e_2$=2 (edge $v_1v_3$), $e_3$=1 (loop at $v_3$), $e_4$=1 (loop at $v_1$), $e_5$=2 (edge $v_2v_3$). Three columns have sum 1, so $G$ has 3 loops.</div><div class=\"ml-vi\">Một cạnh thường có đúng 2 số 1 trong cột của nó (một cho mỗi đầu mút); một khuyên chỉ có 1 (chỉ chạm một đỉnh). Tổng cột: $e_1$=1 (khuyên tại $v_2$), $e_2$=2 (cạnh $v_1v_3$), $e_3$=1 (khuyên tại $v_3$), $e_4$=1 (khuyên tại $v_1$), $e_5$=2 (cạnh $v_2v_3$). Ba cột có tổng 1, nên $G$ có 3 khuyên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $u,v$ be two vertices on different sides of the bipartite graph $K_{2,2}$. How many paths of length 3 from $u$ to $v$?|||Cho $u,v$ là hai đỉnh ở hai phía khác nhau của đồ thị lưỡng phân $K_{2,2}$. Có bao nhiêu đường đi độ dài 3 từ $u$ đến $v$?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Label sides $\\{u,x\\}$ and $\\{v,y\\}$. Using the adjacency matrix (order $u,x,v,y$) and computing $A^3$, the entry for walks of length 3 from $u$ to $v$ is $(A^3)_{u,v}=4$ (computed via $A^2$ then multiplying by $A$).</div><div class=\"ml-vi\">Đặt hai phía $\\{u,x\\}$ và $\\{v,y\\}$. Dùng ma trận kề (thứ tự $u,x,v,y$) và tính $A^3$, phần tử số đường đi độ dài 3 từ $u$ đến $v$ là $(A^3)_{u,v}=4$ (tính qua $A^2$ rồi nhân với $A$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $m$ and $n$ such that the complete bipartite graph $K_{m,n}$ has Hamilton circuits.|||Tìm tất cả giá trị $m$ và $n$ sao cho đồ thị lưỡng phân đầy đủ $K_{m,n}$ có chu trình Hamilton.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "m=n and m ≥ 2|||m=n và m ≥ 2"
            },
            {
              "text": "m=n and m ≥ 3|||m=n và m ≥ 3"
            },
            {
              "text": "m>n and n ≥ 2|||m>n và n ≥ 2"
            },
            {
              "text": "m>n and n ≥ 3|||m>n và n ≥ 3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A Hamilton circuit in a bipartite graph must alternate between the two parts equally, requiring $m=n$. The smallest case that actually forms a cycle is $K_{2,2}=C_4$, so $m=n$ and $m\\ge2$.</div><div class=\"ml-vi\">Chu trình Hamilton trong đồ thị lưỡng phân phải luân phiên đều giữa hai phía, đòi hỏi $m=n$. Trường hợp nhỏ nhất thực sự tạo thành chu trình là $K_{2,2}=C_4$, nên $m=n$ và $m\\ge2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following propositions is TRUE: (i) If $Q_1$ has a Hamilton path, then $K_6$ has an Euler path (ii) If $K_{5,2}$ has an Euler path, then $W_4$ has an Euler path|||Mệnh đề nào sau đây ĐÚNG: (i) Nếu $Q_1$ có đường đi Hamilton, thì $K_6$ có đường đi Euler (ii) Nếu $K_{5,2}$ có đường đi Euler, thì $W_4$ có đường đi Euler",
          "options": [
            {
              "text": "(i) only|||Chỉ (i)"
            },
            {
              "text": "(ii) only|||Chỉ (ii)"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i): $Q_1$ (single edge) trivially has a Hamilton path -- antecedent TRUE. But $K_6$ has all 6 vertices of odd degree 5 (need exactly 0 or 2 odd-degree vertices for an Euler path) -- consequent FALSE. So (i) is FALSE. (ii): $K_{5,2}$ has exactly 2 odd-degree vertices (the size-2 side, degree 5 each) -- has an Euler path, antecedent TRUE. But $W_4$'s 4 rim vertices all have odd degree 3 -- more than 2 odd vertices, no Euler path -- consequent FALSE. So (ii) is also FALSE. Neither proposition is true.</div><div class=\"ml-vi\">(i): $Q_1$ (một cạnh đơn) hiển nhiên có đường đi Hamilton -- tiền đề ĐÚNG. Nhưng $K_6$ có cả 6 đỉnh bậc lẻ 5 (cần đúng 0 hoặc 2 đỉnh bậc lẻ để có đường đi Euler) -- hệ quả SAI. Vậy (i) SAI. (ii): $K_{5,2}$ có đúng 2 đỉnh bậc lẻ (phía 2 đỉnh, mỗi đỉnh bậc 5) -- có đường đi Euler, tiền đề ĐÚNG. Nhưng 4 đỉnh vành của $W_4$ đều bậc lẻ 3 -- hơn 2 đỉnh lẻ, không có đường đi Euler -- hệ quả SAI. Vậy (ii) cũng SAI. Không mệnh đề nào đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the next vertex chosen after choosing O, A, B, C when using Dijkstra's algorithm to find the shortest path from O to T? Edges: OA=2,OB=5,OC=4,AB=2,AD=7,AF=12,BD=4,BC=3,BE=1,DT=5,DE=1,CE=4,FT=3,ET=7.|||Đỉnh nào được chọn tiếp theo sau khi chọn O, A, B, C khi dùng thuật toán Dijkstra tìm đường đi ngắn nhất từ O đến T? Các cạnh: OA=2,OB=5,OC=4,AB=2,AD=7,AF=12,BD=4,BC=3,BE=1,DT=5,DE=1,CE=4,FT=3,ET=7.",
          "options": [
            {
              "text": "The vertex E|||Đỉnh E"
            },
            {
              "text": "The vertex D|||Đỉnh D"
            },
            {
              "text": "The vertex F|||Đỉnh F"
            },
            {
              "text": "The vertex T|||Đỉnh T"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">After $O$(0),$A$(2): relax gives $B=\\min(5,4)=4$, $D=9$, $F=14$. After $B$(4): relax gives $D=\\min(9,8)=8$, $C=\\min(4,7)=4$, $E=5$. After $C$(4): relax gives $E=\\min(5,8)=5$ (no change). Remaining unvisited distances: $E=5,D=8,F=14$. The smallest is $E$.</div><div class=\"ml-vi\">Sau $O$(0),$A$(2): nới lỏng cho $B=\\min(5,4)=4$, $D=9$, $F=14$. Sau $B$(4): nới lỏng cho $D=\\min(9,8)=8$, $C=\\min(4,7)=4$, $E=5$. Sau $C$(4): nới lỏng cho $E=\\min(5,8)=5$ (không đổi). Khoảng cách chưa thăm còn lại: $E=5,D=8,F=14$. Nhỏ nhất là $E$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many internal vertices in a full 3-ary tree with 101 leaves?|||Có bao nhiêu đỉnh trong trong một cây 3-phân đầy đủ với 101 lá?",
          "options": [
            {
              "text": "151|||151"
            },
            {
              "text": "104|||104"
            },
            {
              "text": "50|||50"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "51|||51"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">For a full $m$-ary tree, leaves $\\ell=i(m-1)+1$ where $i$ is the internal vertex count. With $m=3,\\ell=101$: $i=(101-1)/2=50$.</div><div class=\"ml-vi\">Với cây $m$-phân đầy đủ, số lá $\\ell=i(m-1)+1$ với $i$ là số đỉnh trong. Với $m=3,\\ell=101$: $i=(101-1)/2=50$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the tree: root $a$ with children $b,d,c$; $b$'s children $e,h,g$; $e$'s children $i,n,k$; $c$'s children $f,l,m$. How many ancestors of the vertex $d$ are there?|||Cho cây: gốc $a$ với con $b,d,c$; con của $b$ là $e,h,g$; con của $e$ là $i,n,k$; con của $c$ là $f,l,m$. Có bao nhiêu tổ tiên của đỉnh $d$?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$d$ is a direct child of the root $a$. Its only ancestor is $a$ itself.</div><div class=\"ml-vi\">$d$ là con trực tiếp của gốc $a$. Tổ tiên duy nhất của nó là $a$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To encode a message consisting of only the letters $\\{a,b,i,n,s,t\\}$, we want to use the following prefix coding scheme: $a$:10, $b$:01, $i$:001, $n$:110, $s$:1111, $t$: (to be determined). Which of the following bit strings could be used to encode the letter $t$?|||Để mã hóa thông điệp chỉ gồm các chữ $\\{a,b,i,n,s,t\\}$, ta muốn dùng lược đồ mã tiền tố sau: $a$:10, $b$:01, $i$:001, $n$:110, $s$:1111, $t$: (cần xác định). Chuỗi bit nào sau đây có thể dùng để mã hóa chữ $t$?",
          "options": [
            {
              "text": "0001|||0001"
            },
            {
              "text": "111|||111"
            },
            {
              "text": "100|||100"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"111\" is a prefix of $s$=1111 -- invalid. \"100\" starts with \"10\"=$a$ -- invalid ($a$ is a prefix of it). \"1\" is a prefix of $a$=10 -- invalid. \"0001\": checking against all existing codes (10,01,001,110,1111), none is a prefix of it and it is not a prefix of any of them -- valid.</div><div class=\"ml-vi\">\"111\" là tiền tố của $s$=1111 -- không hợp lệ. \"100\" bắt đầu bằng \"10\"=$a$ -- không hợp lệ ($a$ là tiền tố của nó). \"1\" là tiền tố của $a$=10 -- không hợp lệ. \"0001\": kiểm với mọi mã hiện có (10,01,001,110,1111), không mã nào là tiền tố của nó và nó cũng không là tiền tố của mã nào -- hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Construct a binary search tree for the sentence \"Do not count your chickens before they are hatched\" then find how many comparisons are needed to search the word \"hatched\".|||Xây dựng cây tìm kiếm nhị phân cho câu \"Do not count your chickens before they are hatched\" rồi tìm số phép so sánh cần để tìm từ \"hatched\".",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Inserting in order: \"do\" (root); \"not\">do right; \"count\"<do left; \"your\">do,>not right of not; \"chickens\"<do,<count left of count; \"before\"<chickens left; \"they\">do,>not,<your left of your; \"are\"<before left; \"hatched\">do (right, since h>d alphabetically), <not (left, since h<n) -- found at depth 2. Locating \"hatched\" takes comparisons at do, not, then hatched itself: 3 comparisons.</div><div class=\"ml-vi\">Chèn theo thứ tự: \"do\" (gốc); \"not\">do phải; \"count\"<do trái; \"your\">do,>not phải của not; \"chickens\"<do,<count trái của count; \"before\"<chickens trái; \"they\">do,>not,<your trái của your; \"are\"<before trái; \"hatched\">do (phải, vì h>d theo alphabet), <not (trái, vì h<n) -- tìm thấy ở độ sâu 2. Tìm \"hatched\" cần so sánh tại do, not, rồi chính hatched: 3 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the postfix expression $6\\ 3\\ /\\ 5\\ +\\ 7\\ 2\\ -\\ *$|||Tìm giá trị của biểu thức hậu tố $6\\ 3\\ /\\ 5\\ +\\ 7\\ 2\\ -\\ *$",
          "options": [
            {
              "text": "35|||35"
            },
            {
              "text": "-32|||-32"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "-30|||-30"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Stack evaluation: $6,3\\to6/3=2$; $2,5\\to2+5=7$; $7,2\\to7-2=5$; finally $7*5=35$.</div><div class=\"ml-vi\">Tính bằng ngăn xếp: $6,3\\to6/3=2$; $2,5\\to2+5=7$; $7,2\\to7-2=5$; cuối cùng $7*5=35$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine the order in which a post-order traversal visits the vertices of the given rooted tree: root $a$ with children $b,c$; $b$'s children $d,e$; $e$'s children $f,g$; $c$ is a leaf.|||Xác định thứ tự phép duyệt hậu thứ (post-order) thăm các đỉnh của cây có gốc cho trước: gốc $a$ với con $b,c$; con của $b$ là $d,e$; con của $e$ là $f,g$; $c$ là lá.",
          "options": [
            {
              "text": "d,b,a,e,f,g,c|||d,b,a,e,f,g,c"
            },
            {
              "text": "a,b,c,d,e,f,g|||a,b,c,d,e,f,g"
            },
            {
              "text": "a,c,b,d,e,f,g|||a,c,b,d,e,f,g"
            },
            {
              "text": "f,g,d,e,b,c,a|||f,g,d,e,b,c,a"
            },
            {
              "text": "d,f,g,e,b,c,a|||d,f,g,e,b,c,a"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Postorder = children left-to-right then the node. Subtree $b$: $d$ (leaf) then subtree $e$ ($f,g$ leaves then $e$) then $b$: gives $d,f,g,e,b$. Then leaf $c$. Then root $a$. Full order: $d,f,g,e,b,c,a$.</div><div class=\"ml-vi\">Hậu thứ = các con trái sang phải rồi đến nút đó. Cây con $b$: $d$ (lá) rồi cây con $e$ ($f,g$ là lá rồi $e$) rồi $b$: cho $d,f,g,e,b$. Rồi lá $c$. Rồi gốc $a$. Thứ tự đầy đủ: $d,f,g,e,b,c,a$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many spanning trees does the following graph have? A pentagon $a$-$b$-$c$-$d$-$e$-$a$ is connected to a diamond (4-cycle) $f$-$g$-$h$-$i$-$f$ by TWO parallel edges between $c$ and $f$ (one straight, one curved).|||Đồ thị sau có bao nhiêu cây khung? Một ngũ giác $a$-$b$-$c$-$d$-$e$-$a$ được nối với một hình thoi (chu trình 4) $f$-$g$-$h$-$i$-$f$ bằng HAI cạnh song song giữa $c$ và $f$ (một thẳng, một cong).",
          "options": [
            {
              "text": "30|||30"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "36|||36"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "42|||42"
            },
            {
              "text": "48|||48"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A cycle $C_n$ has $n$ spanning trees. The pentagon $C_5$ contributes 5, the diamond $C_4$ contributes 4. Since there are 2 parallel edges between $c$ and $f$ connecting the two cycles, exactly one of them must be chosen to keep the tree connected without a cycle, contributing a factor of 2. Total: $5\\times4\\times2=40$.</div><div class=\"ml-vi\">Chu trình $C_n$ có $n$ cây khung. Ngũ giác $C_5$ đóng góp 5, hình thoi $C_4$ đóng góp 4. Vì có 2 cạnh song song giữa $c$ và $f$ nối hai chu trình, đúng một trong chúng phải được chọn để giữ cây liên thông không tạo chu trình, đóng góp hệ số 2. Tổng: $5\\times4\\times2=40$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the fourth edge added into the minimum spanning tree in the following undirected weighted graph by using Kruskal's algorithm? Vertices $a,b,c,d,e,f,g,h$ with edges $ab{=}6,ad{=}2,bd{=}9,bc{=}12,dc{=}5,ch{=}3,ce{=}1,he{=}8,hg{=}10,hf{=}4,gf{=}7,ef{=}11$.|||Cạnh thứ tư được thêm vào cây khung nhỏ nhất trong đồ thị vô hướng có trọng số sau bằng thuật toán Kruskal là gì? Các đỉnh $a,b,c,d,e,f,g,h$ với các cạnh $ab{=}6,ad{=}2,bd{=}9,bc{=}12,dc{=}5,ch{=}3,ce{=}1,he{=}8,hg{=}10,hf{=}4,gf{=}7,ef{=}11$.",
          "options": [
            {
              "text": "ab|||ab"
            },
            {
              "text": "hf|||hf"
            },
            {
              "text": "ce|||ce"
            },
            {
              "text": "ch|||ch"
            },
            {
              "text": "cd|||cd"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sorted edges: $ce(1),ad(2),ch(3),hf(4),dc(5),ab(6),gf(7),he(8),bd(9),hg(10),ef(11),bc(12)$. Adding in order skipping cycles: 1st $ce$, 2nd $ad$, 3rd $ch$, 4th $hf$.</div><div class=\"ml-vi\">Cạnh sắp xếp: $ce(1),ad(2),ch(3),hf(4),dc(5),ab(6),gf(7),he(8),bd(9),hg(10),ef(11),bc(12)$. Thêm theo thứ tự bỏ qua chu trình: cạnh 1 $ce$, cạnh 2 $ad$, cạnh 3 $ch$, cạnh 4 $hf$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f$ is defined recursively by $f(0)=2$ and $f(n+1)=f(n)^2+2f(n)-3$ for $n\\ge0$. Find $f(3)$.|||Giả sử $f$ được định nghĩa đệ quy bởi $f(0)=2$ và $f(n+1)=f(n)^2+2f(n)-3$ với $n\\ge0$. Tìm $f(3)$.",
          "options": [
            {
              "text": "32|||32"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "1085|||1085"
            },
            {
              "text": "93|||93"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=f(0)^2+2f(0)-3=4+4-3=5$. $f(2)=f(1)^2+2f(1)-3=25+10-3=32$. $f(3)=f(2)^2+2f(2)-3=1024+64-3=1085$.</div><div class=\"ml-vi\">$f(1)=f(0)^2+2f(0)-3=4+4-3=5$. $f(2)=f(1)^2+2f(1)-3=25+10-3=32$. $f(3)=f(2)^2+2f(2)-3=1024+64-3=1085$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many one-to-one functions from a set of 5 elements to a set of 4 elements?|||Có bao nhiêu hàm đơn ánh từ một tập 5 phần tử đến một tập 4 phần tử?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An injection requires the domain size to be at most the codomain size. Since $5>4$, by the pigeonhole principle no injective function can exist: the count is 0.</div><div class=\"ml-vi\">Một đơn ánh đòi hỏi kích thước miền xác định không vượt quá miền giá trị. Vì $5>4$, theo nguyên lý chuồng bồ câu không thể tồn tại hàm đơn ánh nào: số lượng là 0.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D7",
      "source": "REAL",
      "sortOrder": 207,
      "title": "Final Exam — Đề 7|||Thi cuối kỳ — Đề 7",
      "description": "MAD101 Final Exam, Đề 7 (50 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 7 (50 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 100,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the expression $(101101\\lor110001)\\oplus001101$|||Tìm giá trị của biểu thức $(101101\\lor110001)\\oplus001101$",
          "options": [
            {
              "text": "101100|||101100"
            },
            {
              "text": "110000|||110000"
            },
            {
              "text": "001101|||001101"
            },
            {
              "text": "111101|||111101"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$101101\\lor110001=111101$ (bitwise OR). Then $111101\\oplus001101=110000$ (bitwise XOR).</div><div class=\"ml-vi\">$101101\\lor110001=111101$ (OR theo bit). Rồi $111101\\oplus001101=110000$ (XOR theo bit).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose a tuple of values of $p,q,r$ such that the proposition $(p\\to q)\\lor r$ is False.|||Chọn bộ giá trị $p,q,r$ sao cho mệnh đề $(p\\to q)\\lor r$ là Sai (False).",
          "options": [
            {
              "text": "p=F, q=T, r=F|||p=F, q=T, r=F"
            },
            {
              "text": "p=q=T, r=F|||p=q=T, r=F"
            },
            {
              "text": "p=T, q=F, r=F|||p=T, q=F, r=F"
            },
            {
              "text": "p=q=r=F|||p=q=r=F"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Need $(p\\to q)=F$ and $r=F$. $p\\to q=F$ only when $p=T,q=F$. So $p=T,q=F,r=F$: $(T\\to F)\\lor F=F\\lor F=F$.</div><div class=\"ml-vi\">Cần $(p\\to q)=F$ và $r=F$. $p\\to q=F$ chỉ khi $p=T,q=F$. Vậy $p=T,q=F,r=F$: $(T\\to F)\\lor F=F\\lor F=F$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which propositions are tautology? (i) $(p\\land q)\\to(q\\to p)$ (ii) $(p\\lor q)\\to(p\\land q)$|||Mệnh đề nào là hằng đúng (tautology)? (i) $(p\\land q)\\to(q\\to p)$ (ii) $(p\\lor q)\\to(p\\land q)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i): if $p\\land q$ is true, $p$ is true, so $q\\to p$ is true; if $p\\land q$ is false, the implication is vacuously true. Always true -- tautology. (ii) fails at $p=T,q=F$: $p\\lor q=T$, $p\\land q=F$, $T\\to F=F$ -- not a tautology.</div><div class=\"ml-vi\">(i): nếu $p\\land q$ đúng, $p$ đúng, nên $q\\to p$ đúng; nếu $p\\land q$ sai, phép kéo theo đúng hiển nhiên. Luôn đúng -- hằng đúng. (ii) sai tại $p=T,q=F$: $p\\lor q=T$, $p\\land q=F$, $T\\to F=F$ -- không phải hằng đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $C(x)$=\"x has a cat\", $D(x)$=\"x has a dog\", $F(x)$=\"x has a ferret\". Let the domain consist of all students in your class. Express the sentence \"For each of the three animals, cats, dogs, and ferrets, there is a student in your class who has this animal as a pet\" in terms of $C(x),D(x),F(x)$, quantifiers, and logical connectives. (i) $\\exists xC(x)\\lor\\exists xD(x)\\lor\\exists xF(x)$ (ii) $\\exists xC(x)\\land\\exists xD(x)\\land\\exists xF(x)$ (iii) $\\forall x(C(x)\\land D(x)\\land F(x))$ (iv) $\\forall x(\\neg C(x)\\land\\neg D(x)\\land\\neg F(x))$|||Cho $C(x)$=\"x có mèo\", $D(x)$=\"x có chó\", $F(x)$=\"x có chồn sương\". Miền là mọi sinh viên trong lớp bạn. Diễn đạt câu \"Với mỗi trong ba loài vật, mèo, chó, và chồn sương, có một sinh viên trong lớp bạn có loài vật đó làm thú cưng\" theo $C(x),D(x),F(x)$, lượng từ, và liên từ logic. (i) $\\exists xC(x)\\lor\\exists xD(x)\\lor\\exists xF(x)$ (ii) $\\exists xC(x)\\land\\exists xD(x)\\land\\exists xF(x)$ (iii) $\\forall x(C(x)\\land D(x)\\land F(x))$ (iv) $\\forall x(\\neg C(x)\\land\\neg D(x)\\land\\neg F(x))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">\"For each animal, there is a student who has it\" means three separate existence claims joined by \"and\" (not necessarily the same student): $\\exists xC(x)\\land\\exists xD(x)\\land\\exists xF(x)$, option (ii).</div><div class=\"ml-vi\">\"Với mỗi loài vật, có một sinh viên có nó\" nghĩa là ba khẳng định tồn tại riêng biệt nối bằng \"và\" (không nhất thiết cùng một sinh viên): $\\exists xC(x)\\land\\exists xD(x)\\land\\exists xF(x)$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be the statement \"x is an even number\", where the domain is the set of all integers. Which proposition is TRUE? (i) $P(5)$ (ii) $\\forall xP(x)$ (iii) $\\exists xP(2x+1)$ (iv) $\\exists xP(2x)$ (v) $\\forall xP(x^2)$|||Cho $P(x)$ là mệnh đề \"x là số chẵn\", miền là tập mọi số nguyên. Mệnh đề nào ĐÚNG? (i) $P(5)$ (ii) $\\forall xP(x)$ (iii) $\\exists xP(2x+1)$ (iv) $\\exists xP(2x)$ (v) $\\forall xP(x^2)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(v)|||(v)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$P(5)$ is false. $\\forall xP(x)$ is false. $2x+1$ is always odd, so $\\exists xP(2x+1)$ is false. $2x$ is always even, so $\\exists xP(2x)$ is true (e.g. $x=0$). $\\forall xP(x^2)$ fails at $x=1$.</div><div class=\"ml-vi\">$P(5)$ sai. $\\forall xP(x)$ sai. $2x+1$ luôn lẻ, nên $\\exists xP(2x+1)$ sai. $2x$ luôn chẵn, nên $\\exists xP(2x)$ đúng (vd $x=0$). $\\forall xP(x^2)$ sai tại $x=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $Q(x,y)$ be the statement \"Student $x$ has studied subject $y$\", $S(x,z)$ the statement \"Student $x$ is in class $z$\". Translate the sentence into a logical expression: \"Every student in class CS150 has studied Calculus\". (i) $\\forall x(Q(x,Calculus)\\to S(x,CS150))$ (ii) $\\forall x(S(x,CS150)\\to Q(x,Calculus))$ (iii) $\\exists x(Q(x,Calculus)\\to S(x,CS150))$ (iv) $\\exists x(S(x,CS150)\\to Q(x,Calculus))$|||Cho $Q(x,y)$ là mệnh đề \"Sinh viên $x$ đã học môn $y$\", $S(x,z)$ là mệnh đề \"Sinh viên $x$ ở lớp $z$\". Diễn đạt câu sau thành biểu thức logic: \"Mọi sinh viên trong lớp CS150 đã học Giải tích\". (i) $\\forall x(Q(x,Calculus)\\to S(x,CS150))$ (ii) $\\forall x(S(x,CS150)\\to Q(x,Calculus))$ (iii) $\\exists x(Q(x,Calculus)\\to S(x,CS150))$ (iv) $\\exists x(S(x,CS150)\\to Q(x,Calculus))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">\"Every student in class CS150\" is universal: for every $x$, if $x$ is in class CS150 then $x$ has studied Calculus: $\\forall x(S(x,CS150)\\to Q(x,Calculus))$, option (ii).</div><div class=\"ml-vi\">\"Mọi sinh viên trong lớp CS150\" là toàn thể: với mọi $x$, nếu $x$ ở lớp CS150 thì $x$ đã học Giải tích: $\\forall x(S(x,CS150)\\to Q(x,Calculus))$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $F(x,y)$ be the statement \"x can fool y\" where the domain consists of all people in the world. Translate the sentence into a logical expression: \"There is exactly one person whom everybody can fool.\" (i) $\\exists y\\forall xF(x,y)$ (ii) $\\forall y\\exists xF(x,y)$ (iii) $\\exists y(\\forall xF(x,y)\\land\\forall z(\\forall xF(x,z)\\to y=z))$ (iv) $\\exists y(\\forall xF(x,y)\\land\\exists z(\\forall xF(x,z)\\to y=z))$|||Cho $F(x,y)$ là mệnh đề \"x có thể lừa y\" với miền là mọi người trên thế giới. Diễn đạt câu sau thành biểu thức logic: \"Có đúng một người mà ai cũng có thể lừa được.\" (i) $\\exists y\\forall xF(x,y)$ (ii) $\\forall y\\exists xF(x,y)$ (iii) $\\exists y(\\forall xF(x,y)\\land\\forall z(\\forall xF(x,z)\\to y=z))$ (iv) $\\exists y(\\forall xF(x,y)\\land\\exists z(\\forall xF(x,z)\\to y=z))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">\"Exactly one\" requires existence (some $y$ everybody can fool: $\\forall xF(x,y)$) plus uniqueness (any $z$ with the same property must equal $y$: $\\forall z(\\forall xF(x,z)\\to y=z)$). This is option (iii); (i) only asserts existence without uniqueness, and (iv) incorrectly uses $\\exists z$ for the uniqueness clause.</div><div class=\"ml-vi\">\"Đúng một\" đòi hỏi tồn tại (có $y$ nào đó mà ai cũng lừa được: $\\forall xF(x,y)$) cộng với tính duy nhất (bất kỳ $z$ nào có cùng tính chất phải bằng $y$: $\\forall z(\\forall xF(x,z)\\to y=z)$). Đây là đáp án (iii); (i) chỉ khẳng định tồn tại mà không có tính duy nhất, và (iv) dùng sai $\\exists z$ cho mệnh đề duy nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the premises: \"Lisa is a mathematics and computer science major\", \"Every computer science major has a computer\", \"Some mathematics majors speak French very well\". Which conclusion can be implied?|||Cho các tiền đề: \"Lisa học ngành Toán và Khoa học Máy tính\", \"Mọi sinh viên ngành Khoa học Máy tính đều có máy tính\", \"Một số sinh viên ngành Toán nói tiếng Pháp rất giỏi\". Kết luận nào có thể suy ra?",
          "options": [
            {
              "text": "Lisa has a computer|||Lisa có máy tính"
            },
            {
              "text": "Lisa has a computer and speaks French very well|||Lisa có máy tính và nói tiếng Pháp giỏi"
            },
            {
              "text": "Lisa cannot speak French|||Lisa không thể nói tiếng Pháp"
            },
            {
              "text": "Lisa has not a computer but speaks French very well|||Lisa không có máy tính nhưng nói tiếng Pháp giỏi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Since Lisa is a computer science major (from the first premise), the second premise (every CS major has a computer) directly implies Lisa has a computer. The third premise only says \"some\" math majors speak French -- it doesn't specifically apply to Lisa, so nothing about French can be concluded.</div><div class=\"ml-vi\">Vì Lisa là sinh viên ngành Khoa học Máy tính (từ tiền đề 1), tiền đề 2 (mọi sinh viên KHMT đều có máy tính) suy ra trực tiếp Lisa có máy tính. Tiền đề 3 chỉ nói \"một số\" sinh viên Toán nói tiếng Pháp -- không áp dụng riêng cho Lisa, nên không thể kết luận gì về tiếng Pháp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the cardinality of the set $\\{1,\\{1\\},1,3,\\{1,3\\}\\}$|||Tìm lực lượng của tập $\\{1,\\{1\\},1,3,\\{1,3\\}\\}$",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Sets don't count duplicate elements: the repeated \"1\" collapses, leaving distinct elements $1,\\{1\\},3,\\{1,3\\}$ -- 4 elements.</div><div class=\"ml-vi\">Tập hợp không đếm phần tử trùng lặp: \"1\" lặp lại bị gộp, còn lại các phần tử phân biệt $1,\\{1\\},3,\\{1,3\\}$ -- 4 phần tử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{0,1,2,3,4,5,6,7,8,9,10\\}$. The bit string representing the subset $\\{0,1,4,5,8,9\\}$ is ___|||Cho $U=\\{0,1,2,3,4,5,6,7,8,9,10\\}$. Chuỗi bit biểu diễn tập con $\\{0,1,4,5,8,9\\}$ là ___",
          "options": [
            {
              "text": "11001100110|||11001100110"
            },
            {
              "text": "11001100111|||11001100111"
            },
            {
              "text": "11101100110|||11101100110"
            },
            {
              "text": "11011101110|||11011101110"
            },
            {
              "text": "10011001100|||10011001100"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Position $i$ is 1 if $i$ is in the subset: positions $0,1,4,5,8,9$ get 1, positions $2,3,6,7,10$ get 0. Reading positions 0 to 10: $1,1,0,0,1,1,0,0,1,1,0=11001100110$.</div><div class=\"ml-vi\">Vị trí $i$ là 1 nếu $i$ thuộc tập con: vị trí $0,1,4,5,8,9$ là 1, vị trí $2,3,6,7,10$ là 0. Đọc vị trí 0 đến 10: $1,1,0,0,1,1,0,0,1,1,0=11001100110$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a survey of 1250 people, 650 used Spotify to listen to music and 450 used iTunes to listen to music; of these, 150 used both. How many people used either Spotify or iTunes?|||Trong khảo sát 1250 người, 650 người dùng Spotify để nghe nhạc và 450 người dùng iTunes; trong đó, 150 người dùng cả hai. Có bao nhiêu người dùng Spotify hoặc iTunes?",
          "options": [
            {
              "text": "1100|||1100"
            },
            {
              "text": "850|||850"
            },
            {
              "text": "1200|||1200"
            },
            {
              "text": "950|||950"
            },
            {
              "text": "1050|||1050"
            },
            {
              "text": "900|||900"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">By inclusion-exclusion: $|Spotify\\cup iTunes|=650+450-150=950$.</div><div class=\"ml-vi\">Theo nguyên lý bù trừ: $|Spotify\\cup iTunes|=650+450-150=950$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f:\\mathbb{N}\\to\\mathbb{Z}$ be the function defined as follows: $f(n)=-n/2$ if $n$ is even, $f(n)=(n^2+1)/2$ if $n$ is odd. Choose the correct answer.|||Cho $f:\\mathbb{N}\\to\\mathbb{Z}$ là hàm định nghĩa như sau: $f(n)=-n/2$ nếu $n$ chẵn, $f(n)=(n^2+1)/2$ nếu $n$ lẻ. Chọn đáp án đúng.",
          "options": [
            {
              "text": "f is one-to-one but not onto.|||f đơn ánh nhưng không toàn ánh."
            },
            {
              "text": "f is onto but not one-to-one.|||f toàn ánh nhưng không đơn ánh."
            },
            {
              "text": "f is both one-to-one and onto.|||f vừa đơn ánh vừa toàn ánh."
            },
            {
              "text": "f is neither one-to-one nor onto.|||f không đơn ánh cũng không toàn ánh."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Even $n$ gives non-positive values ($f(0)=0,f(2)=-1,f(4)=-2,\\ldots$, all distinct), odd $n$ gives positive values ($f(1)=1,f(3)=5,f(5)=13,\\ldots$, all distinct) -- the two branches never overlap, so $f$ is injective. But it's not onto: e.g. no $n$ gives $f(n)=2$ or $f(n)=3$ (odd branch skips over most positive integers).</div><div class=\"ml-vi\">$n$ chẵn cho giá trị không dương ($f(0)=0,f(2)=-1,f(4)=-2,\\ldots$, đều phân biệt), $n$ lẻ cho giá trị dương ($f(1)=1,f(3)=5,f(5)=13,\\ldots$, đều phân biệt) -- hai nhánh không bao giờ trùng nhau, nên $f$ đơn ánh. Nhưng không toàn ánh: vd không $n$ nào cho $f(n)=2$ hay $f(n)=3$ (nhánh lẻ bỏ qua hầu hết số dương).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the terms $a_0,a_1,a_2,a_3,a_4$ of the sequence $\\{a_n\\}$, where $a_n=\\lfloor2n/3\\rfloor+\\lceil2n/3\\rceil$.|||Tìm các số hạng $a_0,a_1,a_2,a_3,a_4$ của dãy $\\{a_n\\}$, với $a_n=\\lfloor2n/3\\rfloor+\\lceil2n/3\\rceil$.",
          "options": [
            {
              "text": "0, 1, 2, 3, 4|||0, 1, 2, 3, 4"
            },
            {
              "text": "0, 2, 3, 4, 5|||0, 2, 3, 4, 5"
            },
            {
              "text": "0, 1, 3, 4, 5|||0, 1, 3, 4, 5"
            },
            {
              "text": "0, 1, 2, 4, 5|||0, 1, 2, 4, 5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a_0=0+0=0$. $a_1$: $2/3\\approx0.667$, $\\lfloor\\rfloor=0,\\lceil\\rceil=1$, sum$=1$. $a_2$: $4/3\\approx1.333$, $1+2=3$. $a_3$: $6/3=2$, $2+2=4$. $a_4$: $8/3\\approx2.667$, $2+3=5$.</div><div class=\"ml-vi\">$a_0=0+0=0$. $a_1$: $2/3\\approx0.667$, $\\lfloor\\rfloor=0,\\lceil\\rceil=1$, tổng$=1$. $a_2$: $4/3\\approx1.333$, $1+2=3$. $a_3$: $6/3=2$, $2+2=4$. $a_4$: $8/3\\approx2.667$, $2+3=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Insertion sort algorithm: procedure Insertionsort($a_1,a_2,\\ldots,a_n$: integer): for $i=2$ to $n$ do $j:=1$; while $a_j<a_i$ do $j:=j+1$; $temp:=a_i$; for $k:=i$ down to $j+1$ do $a_k:=a_{k-1}$; $a_j:=temp$. If input $=7,2,4,3,1,6,5$, after running the outer loop with $i=4$, the order of the elements in the list is ___|||Cho thuật toán sắp xếp chèn: procedure Insertionsort($a_1,a_2,\\ldots,a_n$: integer): for $i=2$ to $n$ do $j:=1$; while $a_j<a_i$ do $j:=j+1$; $temp:=a_i$; for $k:=i$ down to $j+1$ do $a_k:=a_{k-1}$; $a_j:=temp$. Nếu đầu vào $=7,2,4,3,1,6,5$, sau khi chạy vòng lặp ngoài với $i=4$, thứ tự các phần tử trong danh sách là ___",
          "options": [
            {
              "text": "2, 3, 4, 7, 1, 6, 5|||2, 3, 4, 7, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 3, 1, 6, 5|||2, 4, 7, 3, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 1, 3, 6, 5|||2, 4, 7, 1, 3, 6, 5"
            },
            {
              "text": "1, 2, 3, 4, 7, 6, 5|||1, 2, 3, 4, 7, 6, 5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$i=2$: insert 2 into [7] $\\to$ [2,7,4,3,1,6,5]. $i=3$: insert 4 into [2,7] $\\to$ [2,4,7,3,1,6,5]. $i=4$: insert 3 into [2,4,7] $\\to$ [2,3,4,7,1,6,5].</div><div class=\"ml-vi\">$i=2$: chèn 2 vào [7] $\\to$ [2,7,4,3,1,6,5]. $i=3$: chèn 4 vào [2,7] $\\to$ [2,4,7,3,1,6,5]. $i=4$: chèn 3 vào [2,4,7] $\\to$ [2,3,4,7,1,6,5].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the binary search algorithm to find the location of 10 in the sequence $\\{1,4,5,7,8,10,12\\}$. How many iterations are needed?|||Dùng thuật toán tìm kiếm nhị phân để tìm vị trí của 10 trong dãy $\\{1,4,5,7,8,10,12\\}$. Cần bao nhiêu lần lặp?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$i=1,j=7$. Iter1: $m=4$, $a_4=7<10$, $i:=5$. Iter2: $i=5,j=7$, $m=6$, $a_6=10$, $x>a_m$ false, $j:=6$. Iter3: $i=5,j=6$, $m=5$, $a_5=8<10$, $i:=6$. Now $i=j=6$, loop stops. Total: 3 iterations.</div><div class=\"ml-vi\">$i=1,j=7$. Lặp1: $m=4$, $a_4=7<10$, $i:=5$. Lặp2: $i=5,j=7$, $m=6$, $a_6=10$, $x>a_m$ sai, $j:=6$. Lặp3: $i=5,j=6$, $m=5$, $a_5=8<10$, $i:=6$. Giờ $i=j=6$, dừng vòng lặp. Tổng: 3 lần lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the smallest integer $n$ such that the following function is $O(x^n)$: $x^2+x^2\\log x$|||Tìm số nguyên nhỏ nhất $n$ sao cho hàm sau là $O(x^n)$: $x^2+x^2\\log x$",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The dominant term $x^2\\log x$ is NOT $O(x^2)$ since $\\log x\\to\\infty$, but it IS $O(x^3)$ since $\\log x=O(x)$. So the smallest integer $n$ is 3.</div><div class=\"ml-vi\">Số hạng chiếm ưu thế $x^2\\log x$ KHÔNG phải $O(x^2)$ vì $\\log x\\to\\infty$, nhưng LÀ $O(x^3)$ vì $\\log x=O(x)$. Vậy số nguyên nhỏ nhất $n$ là 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the bubble sort algorithm: procedure bubblesort($a_1,a_2,\\ldots,a_n$: integers): for $i=1$ to $n-1$ do for $j=1$ to $n-i$ do if $a_j>a_{j+1}$ then swap($a_j,a_{j+1}$). If the input is the list $\\{4,2,3,1\\}$, how many swaps are used?|||Trong thuật toán sắp xếp nổi bọt: procedure bubblesort($a_1,a_2,\\ldots,a_n$: integers): for $i=1$ to $n-1$ do for $j=1$ to $n-i$ do if $a_j>a_{j+1}$ then swap($a_j,a_{j+1}$). Nếu đầu vào là dãy $\\{4,2,3,1\\}$, cần bao nhiêu phép đổi chỗ?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Pass 1: $(4,2)$swap$\\to2,4,3,1$; $(4,3)$swap$\\to2,3,4,1$; $(4,1)$swap$\\to2,3,1,4$ (3 swaps). Pass 2: $(2,3)$no; $(3,1)$swap$\\to2,1,3,4$ (1 swap). Pass 3: $(2,1)$swap$\\to1,2,3,4$ (1 swap). Total: $3+1+1=5$.</div><div class=\"ml-vi\">Lượt 1: $(4,2)$đổi$\\to2,4,3,1$; $(4,3)$đổi$\\to2,3,4,1$; $(4,1)$đổi$\\to2,3,1,4$ (3 lần đổi). Lượt 2: $(2,3)$không; $(3,1)$đổi$\\to2,1,3,4$ (1 lần đổi). Lượt 3: $(2,1)$đổi$\\to1,2,3,4$ (1 lần đổi). Tổng: $3+1+1=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sequence of pseudorandom numbers is generated as follows: $x_0=4$, $x_n=(6x_{n-1}+5)\\bmod13$ for $n>0$. Find $x_4$.|||Một dãy số giả ngẫu nhiên được sinh như sau: $x_0=4$, $x_n=(6x_{n-1}+5)\\bmod13$ với $n>0$. Tìm $x_4$.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$x_1=(6\\cdot4+5)\\bmod13=29\\bmod13=3$. $x_2=(6\\cdot3+5)\\bmod13=23\\bmod13=10$. $x_3=(6\\cdot10+5)\\bmod13=65\\bmod13=0$. $x_4=(6\\cdot0+5)\\bmod13=5$.</div><div class=\"ml-vi\">$x_1=(6\\cdot4+5)\\bmod13=29\\bmod13=3$. $x_2=(6\\cdot3+5)\\bmod13=23\\bmod13=10$. $x_3=(6\\cdot10+5)\\bmod13=65\\bmod13=0$. $x_4=(6\\cdot0+5)\\bmod13=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider an encryption scheme using the function $f(p)=7p+3\\bmod26$. Encrypt the message \"LN\".|||Xét lược đồ mã hóa dùng hàm $f(p)=7p+3\\bmod26$. Mã hóa thông điệp \"LN\".",
          "options": [
            {
              "text": "AX|||AX"
            },
            {
              "text": "ZW|||ZW"
            },
            {
              "text": "CX|||CX"
            },
            {
              "text": "CQ|||CQ"
            },
            {
              "text": "ZG|||ZG"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$L=11$: $f(11)=7(11)+3=80\\bmod26=2=C$. $N=13$: $f(13)=7(13)+3=94\\bmod26=16=Q$. Encrypted: \"CQ\".</div><div class=\"ml-vi\">$L=11$: $f(11)=7(11)+3=80\\bmod26=2=C$. $N=13$: $f(13)=7(13)+3=94\\bmod26=16=Q$. Mã hóa: \"CQ\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose $a=2^3 3^4 5^2 7^1$ and $b=2^2 3^3 5^4 7^1$. Find $\\frac{lcm(a,b)}{\\gcd(a,b)}$. (i) $2^2 3^1 5^2$ (ii) $2^1 3^1 5^1 7^1$ (iii) $2^1 3^1 5^2 7^1$ (iv) $2^1 3^1 5^2$|||Cho $a=2^3 3^4 5^2 7^1$ và $b=2^2 3^3 5^4 7^1$. Tìm $\\frac{lcm(a,b)}{\\gcd(a,b)}$. (i) $2^2 3^1 5^2$ (ii) $2^1 3^1 5^1 7^1$ (iii) $2^1 3^1 5^2 7^1$ (iv) $2^1 3^1 5^2$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$lcm(a,b)=2^3 3^4 5^4 7^1$, $\\gcd(a,b)=2^2 3^3 5^2 7^1$. Ratio $=2^{3-2}3^{4-3}5^{4-2}7^{1-1}=2^1 3^1 5^2 7^0=2^1 3^1 5^2$.</div><div class=\"ml-vi\">$lcm(a,b)=2^3 3^4 5^4 7^1$, $\\gcd(a,b)=2^2 3^3 5^2 7^1$. Tỉ số $=2^{3-2}3^{4-3}5^{4-2}7^{1-1}=2^1 3^1 5^2 7^0=2^1 3^1 5^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers less than 15 are relatively prime to 15?|||Có bao nhiêu số nguyên dương nhỏ hơn 15 nguyên tố cùng nhau với 15?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is Euler's totient $\\phi(15)$. Since $15=3\\times5$: $\\phi(15)=15(1-1/3)(1-1/5)=15\\cdot\\frac23\\cdot\\frac45=8$.</div><div class=\"ml-vi\">Đây là hàm phi Euler $\\phi(15)$. Vì $15=3\\times5$: $\\phi(15)=15(1-1/3)(1-1/5)=15\\cdot\\frac23\\cdot\\frac45=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the binary expansion of $(D0A)_{16}$. (i) $(101100001101)_2$ (ii) $(110001010)_2$ (iii) $(110100001010)_2$ (iv) $(101101101)_2$|||Tìm biểu diễn nhị phân của $(D0A)_{16}$. (i) $(101100001101)_2$ (ii) $(110001010)_2$ (iii) $(110100001010)_2$ (iv) $(101101101)_2$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Each hex digit maps to 4 binary digits: $D=1101$, $0=0000$, $A=1010$. Concatenating: $110100001010$, option (iii).</div><div class=\"ml-vi\">Mỗi chữ số hex ánh xạ thành 4 chữ số nhị phân: $D=1101$, $0=0000$, $A=1010$. Ghép lại: $110100001010$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the strong induction proof of the problem \"Prove that $P(n)$='for all $n\\ge24$ we have $n=5a+7b$ with $a,b$ non-negative integers' is true\", in order to prove $P(k+1)$ is true, we should ___|||Trong chứng minh quy nạp mạnh của bài toán \"Chứng minh $P(n)$='với mọi $n\\ge24$ ta có $n=5a+7b$ với $a,b$ là số nguyên không âm' đúng\", để chứng minh $P(k+1)$ đúng, ta nên ___",
          "options": [
            {
              "text": "use P(k-4) = \"k-4=5x+7y, (x,y are in N)\" is true and k+1=k-4+5.|||dùng P(k-4) = \"k-4=5x+7y, (x,y thuộc N)\" đúng và k+1=k-4+5."
            },
            {
              "text": "use P(k-2) = \"k-2=5x+7y, (x,y are in N)\" is true and k+1=k-2+3.|||dùng P(k-2) = \"k-2=5x+7y, (x,y thuộc N)\" đúng và k+1=k-2+3."
            },
            {
              "text": "use P(k-1) = \"k-1=5x+7y, (x,y are in N)\" is true and k+1=k-1+2.|||dùng P(k-1) = \"k-1=5x+7y, (x,y thuộc N)\" đúng và k+1=k-1+2."
            },
            {
              "text": "use P(k-3) = \"k-3=5x+7y, (x,y are in N)\" is true and k+1=k-3+4.|||dùng P(k-3) = \"k-3=5x+7y, (x,y thuộc N)\" đúng và k+1=k-3+4."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the classic postage-stamp strong induction proof: establish base cases $n=24,\\ldots,28$ directly, then for $k\\ge28$, note $k+1=(k-4)+5$ and use the induction hypothesis on $k-4\\ge24$ to add one more 5-cent stamp.</div><div class=\"ml-vi\">Đây là chứng minh quy nạp mạnh kinh điển về tem bưu chính: thiết lập trực tiếp các trường hợp cơ sở $n=24,\\ldots,28$, rồi với $k\\ge28$, nhận thấy $k+1=(k-4)+5$ và dùng giả thiết quy nạp trên $k-4\\ge24$ để thêm một tem 5 xu nữa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S$ be the subset of the set of ordered pairs of integers defined recursively by: Basis step: $(0,0)\\in S$. Recursive step: if $(a,b)\\in S$, then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is in $S$?|||Cho $S$ là tập con của tập các cặp số nguyên có thứ tự được định nghĩa đệ quy: Bước cơ sở: $(0,0)\\in S$. Bước đệ quy: nếu $(a,b)\\in S$, thì $(a+2,b+3)\\in S$ và $(a+3,b+2)\\in S$. Phần tử nào thuộc $S$?",
          "options": [
            {
              "text": "(12,15)|||(12,15)"
            },
            {
              "text": "(10,15)|||(10,15)"
            },
            {
              "text": "(9,15)|||(9,15)"
            },
            {
              "text": "(8,15)|||(8,15)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Any element reachable is $(2x+3y,3x+2y)$ for non-negative integers $x,y$ (applying the first rule $x$ times, second rule $y$ times), so $a+b=5(x+y)$ must be divisible by 5. Only $(10,15)$ has $a+b=25$ divisible by 5; taking $x=5,y=0$: applying $(a+2,b+3)$ five times from $(0,0)$ gives $(10,15)$.</div><div class=\"ml-vi\">Bất kỳ phần tử nào đến được đều có dạng $(2x+3y,3x+2y)$ với $x,y$ nguyên không âm (áp dụng quy tắc 1 $x$ lần, quy tắc 2 $y$ lần), nên $a+b=5(x+y)$ phải chia hết cho 5. Chỉ $(10,15)$ có $a+b=25$ chia hết cho 5; lấy $x=5,y=0$: áp dụng $(a+2,b+3)$ năm lần từ $(0,0)$ cho $(10,15)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following algorithms are recursive? (i) procedure ABC($n,P$: integers): $P:=0$; for $j:=1$ to $n$ do if ($j\\bmod2=0$) then $P:=P-j$ else $P:=P+j$ (ii) procedure ABC($n,P$: integer): $P:=1$; for $j:=1$ to $n$ do if ($j\\bmod2=0$) then $P:=P+j$ else $P:=P*j$|||Thuật toán nào sau đây là đệ quy? (i) procedure ABC($n,P$: integers): $P:=0$; for $j:=1$ to $n$ do nếu ($j\\bmod2=0$) thì $P:=P-j$ ngược lại $P:=P+j$ (ii) procedure ABC($n,P$: integer): $P:=1$; for $j:=1$ to $n$ do nếu ($j\\bmod2=0$) thì $P:=P+j$ ngược lại $P:=P*j$",
          "options": [
            {
              "text": "None of them|||Không cái nào"
            },
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Both of them|||Cả hai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both (i) and (ii) use a simple `for` loop with no self-call to the procedure -- both are purely iterative, neither is recursive.</div><div class=\"ml-vi\">Cả (i) và (ii) đều dùng vòng lặp `for` đơn giản không có lời tự gọi thủ tục -- cả hai đều thuần lặp, không cái nào đệ quy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are required to merge this pair of lists $[2,3,5,6,9,22]$ and $[1,4,7,25]$?|||Cần bao nhiêu phép so sánh để trộn cặp dãy $[2,3,5,6,9,22]$ và $[1,4,7,25]$?",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Simulating the merge: compare 2,1(take1); 2,4(take2); 3,4(take3); 5,4(take4); 5,7(take5); 6,7(take6); 9,7(take7); 9,25(take9); 22,25(take22) -- list 1 exhausted, append remaining 25 with no comparison. Total: 9 comparisons.</div><div class=\"ml-vi\">Mô phỏng trộn: so sánh 2,1(lấy1); 2,4(lấy2); 3,4(lấy3); 5,4(lấy4); 5,7(lấy5); 6,7(lấy6); 9,7(lấy7); 9,25(lấy9); 22,25(lấy22) -- dãy 1 hết, thêm 25 còn lại không cần so sánh. Tổng: 9 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers not exceeding 100 are divisible by exactly one of 6 or 9?|||Có bao nhiêu số nguyên dương không vượt quá 100 chia hết cho đúng một trong hai số 6 hoặc 9?",
          "options": [
            {
              "text": "17|||17"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "26|||26"
            },
            {
              "text": "27|||27"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Divisible by 6: $\\lfloor100/6\\rfloor=16$. Divisible by 9: $\\lfloor100/9\\rfloor=11$. Divisible by both ($\\text{lcm}=18$): $\\lfloor100/18\\rfloor=5$. Exactly one: $(16-5)+(11-5)=11+6=17$.</div><div class=\"ml-vi\">Chia hết cho 6: $\\lfloor100/6\\rfloor=16$. Chia hết cho 9: $\\lfloor100/9\\rfloor=11$. Chia hết cho cả hai ($\\text{lcm}=18$): $\\lfloor100/18\\rfloor=5$. Đúng một: $(16-5)+(11-5)=11+6=17$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 8-digit numbers are divisible by 10?|||Có bao nhiêu số 8 chữ số chia hết cho 10?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "9 000 001|||9 000 001"
            },
            {
              "text": "10 000 000|||10 000 000"
            },
            {
              "text": "10 000 001|||10 000 001"
            },
            {
              "text": "9 000 000|||9 000 000"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">An 8-digit number divisible by 10 has last digit 0, first digit 1-9 (9 choices), and the middle 6 digits free (0-9 each): $9\\times10^6=9{,}000{,}000$.</div><div class=\"ml-vi\">Một số 8 chữ số chia hết cho 10 có chữ số cuối là 0, chữ số đầu 1-9 (9 lựa chọn), và 6 chữ số giữa tự do (0-9 mỗi chữ số): $9\\times10^6=9{,}000{,}000$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the simultaneous recurrence relations $a_n=a_{n-1}-b_{n-1}$, $b_n=3a_{n-1}+5b_{n-1}$ with the initial conditions $a_0=1,b_0=2$. What are the values of $a_3$ and $b_3$? (i) $a_3=-14,b_3=62$ (ii) $a_3=-1,b_3=13$ (iii) $a_3=-76,b_3=268$ (iv) $a_3=-59,b_3=210$|||Xét các hệ thức truy hồi đồng thời $a_n=a_{n-1}-b_{n-1}$, $b_n=3a_{n-1}+5b_{n-1}$ với điều kiện đầu $a_0=1,b_0=2$. Giá trị của $a_3$ và $b_3$ là gì? (i) $a_3=-14,b_3=62$ (ii) $a_3=-1,b_3=13$ (iii) $a_3=-76,b_3=268$ (iv) $a_3=-59,b_3=210$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a_1=1-2=-1$, $b_1=3(1)+5(2)=13$. $a_2=-1-13=-14$, $b_2=3(-1)+5(13)=62$. $a_3=-14-62=-76$, $b_3=3(-14)+5(62)=-42+310=268$.</div><div class=\"ml-vi\">$a_1=1-2=-1$, $b_1=3(1)+5(2)=13$. $a_2=-1-13=-14$, $b_2=3(-1)+5(13)=62$. $a_3=-14-62=-76$, $b_3=3(-14)+5(62)=-42+310=268$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T(n)$ be an increasing function such that $T(n)=2T(n/2)+n^3$. Choose the best answer. (i) $T(n)=O(n)$ (ii) $T(n)=O(n^2)$ (iii) $T(n)=O(n^3)$ (iv) $T(n)=O(n^2\\log n)$|||Cho $T(n)$ là hàm tăng sao cho $T(n)=2T(n/2)+n^3$. Chọn đáp án tốt nhất. (i) $T(n)=O(n)$ (ii) $T(n)=O(n^2)$ (iii) $T(n)=O(n^3)$ (iv) $T(n)=O(n^2\\log n)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Master theorem with $a=2,b=2,f(n)=n^3$: since $\\log_b a=1$ and $f(n)=n^3$ grows far faster than $n^1$, case 3 applies (the non-recursive term dominates), giving $T(n)=\\Theta(n^3)$, so $T(n)=O(n^3)$.</div><div class=\"ml-vi\">Định lý thợ với $a=2,b=2,f(n)=n^3$: vì $\\log_b a=1$ và $f(n)=n^3$ tăng nhanh hơn hẳn $n^1$, trường hợp 3 áp dụng (số hạng không đệ quy chiếm ưu thế), cho $T(n)=\\Theta(n^3)$, nên $T(n)=O(n^3)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "$Q_n$ has $x$ vertices and $y$ edges. What are the values of $x$ and $y$? (i) $x=2^n,y=n2^n$ (ii) $x=2^n,y=n2^{n-1}$ (iii) $x=2^n,y=2^{n-1}$ (iv) $x=2^{n-1},y=n2^{n-1}$|||$Q_n$ có $x$ đỉnh và $y$ cạnh. Giá trị của $x$ và $y$ là gì? (i) $x=2^n,y=n2^n$ (ii) $x=2^n,y=n2^{n-1}$ (iii) $x=2^n,y=2^{n-1}$ (iv) $x=2^{n-1},y=n2^{n-1}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$Q_n$ has $2^n$ vertices, each of degree $n$. By the handshaking lemma, edges $=\\frac{n\\cdot2^n}{2}=n2^{n-1}$. So $x=2^n,y=n2^{n-1}$, option (ii).</div><div class=\"ml-vi\">$Q_n$ có $2^n$ đỉnh, mỗi đỉnh bậc $n$. Theo bổ đề bắt tay, số cạnh $=\\frac{n\\cdot2^n}{2}=n2^{n-1}$. Vậy $x=2^n,y=n2^{n-1}$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be a simple graph whose vertices are all of degree 3. If $G$ has 15 edges, how many vertices does $G$ have?|||Cho $G$ là đơn đồ thị mà mọi đỉnh đều bậc 3. Nếu $G$ có 15 cạnh, $G$ có bao nhiêu đỉnh?",
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "Such G does not exist|||G như vậy không tồn tại"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Sum of degrees $=2\\times15=30$. With every vertex degree 3, vertices $=30/3=10$.</div><div class=\"ml-vi\">Tổng bậc $=2\\times15=30$. Với mọi đỉnh bậc 3, số đỉnh $=30/3=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 1s are there in the incidence matrix of the graph $K_3$?|||Có bao nhiêu số 1 trong ma trận liên thuộc của đồ thị $K_3$?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$K_3$ (triangle) has 3 edges, each contributing exactly 2 ones (one per endpoint) to the incidence matrix. Total: $3\\times2=6$.</div><div class=\"ml-vi\">$K_3$ (tam giác) có 3 cạnh, mỗi cạnh đóng góp đúng 2 số 1 (một cho mỗi đầu mút) vào ma trận liên thuộc. Tổng: $3\\times2=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be a multigraph with directed edges containing $n$ vertices, and $A$ be the adjacency matrix of $G$. Find the correct statement:|||Cho $G$ là đa đồ thị có hướng với $n$ đỉnh, và $A$ là ma trận kề của $G$. Tìm phát biểu đúng:",
          "options": [
            {
              "text": "A is a symmetric matrix with n rows and n columns.|||A là ma trận đối xứng với n hàng và n cột."
            },
            {
              "text": "If all entries on the main diagonal of A are non-zero, then G has at least n loops.|||Nếu mọi phần tử trên đường chéo chính của A đều khác 0, thì G có ít nhất n khuyên."
            },
            {
              "text": "The entries of A can only take the values 0 or 1.|||Các phần tử của A chỉ có thể nhận giá trị 0 hoặc 1."
            },
            {
              "text": "If G has a loop, then the entries of A on the main diagonal are zero.|||Nếu G có khuyên, thì các phần tử của A trên đường chéo chính bằng 0."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A: false in general -- directed graphs' adjacency matrices aren't symmetric unless every edge is bidirectional. C: false -- multigraphs allow entries greater than 1. D: false -- a loop makes the diagonal entry NON-zero, not zero. B: true -- if every diagonal entry is non-zero, each of the $n$ vertices has at least one loop, giving at least $n$ loops total.</div><div class=\"ml-vi\">A: sai nói chung -- ma trận kề của đồ thị có hướng không đối xứng trừ khi mọi cạnh đều hai chiều. C: sai -- đa đồ thị cho phép phần tử lớn hơn 1. D: sai -- khuyên làm phần tử đường chéo KHÁC 0, không phải bằng 0. B: đúng -- nếu mọi phần tử đường chéo đều khác 0, mỗi đỉnh trong $n$ đỉnh có ít nhất một khuyên, cho tổng ít nhất $n$ khuyên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT a circuit in this graph? Graph has vertices $A,B,C,D,E,F$ with edges $AB,AD,AC,BD,BC,DC,DE,CE,CF,EF,BF$ (square $A,B,C,D$ with both diagonals, plus $D,C$ both connecting to $E$, plus $C,E,B$ all connecting to $F$).|||Cái nào sau đây KHÔNG PHẢI là chu trình trong đồ thị này? Đồ thị có các đỉnh $A,B,C,D,E,F$ với các cạnh $AB,AD,AC,BD,BC,DC,DE,CE,CF,EF,BF$ (hình vuông $A,B,C,D$ với cả hai đường chéo, cộng $D,C$ đều nối với $E$, cộng $C,E,B$ đều nối với $F$).",
          "options": [
            {
              "text": "A-B-C-D-F-B-A|||A-B-C-D-F-B-A"
            },
            {
              "text": "D-B-F-E-D|||D-B-F-E-D"
            },
            {
              "text": "E-F-B-A-D-E|||E-F-B-A-D-E"
            },
            {
              "text": "C-D-E-F-B-A-C|||C-D-E-F-B-A-C"
            },
            {
              "text": "B-A-D-E-F-B|||B-A-D-E-F-B"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Checking each sequence against the edge list $\\{AB,AD,AC,BD,BC,DC,DE,CE,CF,EF,BF\\}$: option A uses the edge $D$-$F$, which does NOT exist in the graph (D is not adjacent to F) -- so A-B-C-D-F-B-A is not a valid circuit. All other options use only existing edges and return to their starting vertex.</div><div class=\"ml-vi\">Kiểm từng dãy với danh sách cạnh $\\{AB,AD,AC,BD,BC,DC,DE,CE,CF,EF,BF\\}$: đáp án A dùng cạnh $D$-$F$, cạnh này KHÔNG tồn tại trong đồ thị (D không kề với F) -- nên A-B-C-D-F-B-A không phải chu trình hợp lệ. Mọi đáp án khác chỉ dùng cạnh có thật và quay lại đúng đỉnh xuất phát.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Graph $X$ is a 5-vertex pentagram (pentagon plus all diagonals, i.e. $K_5$). Graph $Y$ is a bowtie: two triangles joined by a single shared connecting vertex. Which graph has more cut vertices?|||Đồ thị $X$ là ngũ giác sao 5 đỉnh (ngũ giác cộng mọi đường chéo, tức $K_5$). Đồ thị $Y$ là hình nơ: hai tam giác nối qua một đỉnh chung duy nhất. Đồ thị nào có nhiều đỉnh cắt hơn?",
          "options": [
            {
              "text": "Y|||Y"
            },
            {
              "text": "X|||X"
            },
            {
              "text": "They have the same number of cut vertices|||Chúng có cùng số đỉnh cắt"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$X=K_5$ is highly connected (every pair of vertices has multiple disjoint paths) -- it has 0 cut vertices. $Y$'s shared middle vertex is a cut vertex: removing it disconnects the two triangles. So $Y$ has more cut vertices.</div><div class=\"ml-vi\">$X=K_5$ liên thông cao (mọi cặp đỉnh có nhiều đường đi rời nhau) -- có 0 đỉnh cắt. Đỉnh giữa chung của $Y$ là đỉnh cắt: bỏ nó làm tách hai tam giác. Vậy $Y$ có nhiều đỉnh cắt hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following propositions is TRUE: (i) If $K_{1,2}$ has a Hamilton path, then $K_2$ has a Hamilton circuit (ii) If $W_4$ has a Hamilton path, then $K_{4,3}$ has an Euler path (iii) If $K_{4,3}$ has an Euler path, then $Q_3$ has a Hamilton circuit|||Mệnh đề nào sau đây ĐÚNG: (i) Nếu $K_{1,2}$ có đường đi Hamilton, thì $K_2$ có chu trình Hamilton (ii) Nếu $W_4$ có đường đi Hamilton, thì $K_{4,3}$ có đường đi Euler (iii) Nếu $K_{4,3}$ có đường đi Euler, thì $Q_3$ có chu trình Hamilton",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i): $K_{1,2}$ (a path of 3 vertices) trivially has a Hamilton path -- antecedent TRUE. But $K_2$ (single edge) cannot have a Hamilton circuit (needs at least 3 vertices to form a cycle) -- consequent FALSE. So (i) is FALSE. (ii): $W_4$ is Hamiltonian -- antecedent TRUE. But $K_{4,3}$ has 4 odd-degree vertices (more than the 0 or 2 needed) -- no Euler path, consequent FALSE. So (ii) is FALSE. (iii): $K_{4,3}$ has NO Euler path (same reasoning) -- antecedent FALSE, making the implication vacuously TRUE regardless of $Q_3$.</div><div class=\"ml-vi\">(i): $K_{1,2}$ (đường đi 3 đỉnh) hiển nhiên có đường đi Hamilton -- tiền đề ĐÚNG. Nhưng $K_2$ (một cạnh đơn) không thể có chu trình Hamilton (cần ít nhất 3 đỉnh để tạo chu trình) -- hệ quả SAI. Vậy (i) SAI. (ii): $W_4$ có tính Hamilton -- tiền đề ĐÚNG. Nhưng $K_{4,3}$ có 4 đỉnh bậc lẻ (nhiều hơn 0 hoặc 2 cần thiết) -- không có đường đi Euler, hệ quả SAI. Vậy (ii) SAI. (iii): $K_{4,3}$ KHÔNG có đường đi Euler (cùng lý luận) -- tiền đề SAI, làm phép kéo theo ĐÚNG hiển nhiên bất kể $Q_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose the correct statement about the graph: a bowtie shape with two triangles joined by a single bridge edge connecting their two middle vertices (6 vertices total).|||Chọn phát biểu đúng về đồ thị: hình nơ với hai tam giác nối qua một cạnh cầu duy nhất nối hai đỉnh giữa của chúng (tổng 6 đỉnh).",
          "options": [
            {
              "text": "It has a Hamilton circuit|||Nó có chu trình Hamilton"
            },
            {
              "text": "It does not have Hamilton paths|||Nó không có đường đi Hamilton"
            },
            {
              "text": "It has a Hamilton path but does not have Hamilton circuits|||Nó có đường đi Hamilton nhưng không có chu trình Hamilton"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The single bridge edge between the two triangles can only be crossed once, so no circuit can return to its start after visiting both triangles -- no Hamilton circuit. But a Hamilton path exists: traverse one triangle, cross the bridge once, traverse the other triangle, ending there without needing to return.</div><div class=\"ml-vi\">Cạnh cầu duy nhất giữa hai tam giác chỉ có thể đi qua một lần, nên không chu trình nào có thể quay lại điểm xuất phát sau khi thăm cả hai tam giác -- không có chu trình Hamilton. Nhưng có đường đi Hamilton: đi qua một tam giác, qua cầu một lần, đi qua tam giác còn lại, kết thúc ở đó mà không cần quay lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Apply Dijkstra's algorithm to find the shortest path from A to Z in the graph with edges $AB{=}2,AC{=}6,BD{=}5,BC{=}8,BE{=}3,DE{=}4,DZ{=}2,CE{=}3,EZ{=}3$. What is the next vertex chosen after E?|||Áp dụng thuật toán Dijkstra để tìm đường đi ngắn nhất từ A đến Z trong đồ thị với các cạnh $AB{=}2,AC{=}6,BD{=}5,BC{=}8,BE{=}3,DE{=}4,DZ{=}2,CE{=}3,EZ{=}3$. Đỉnh nào được chọn tiếp theo sau E?",
          "options": [
            {
              "text": "C|||C"
            },
            {
              "text": "D|||D"
            },
            {
              "text": "Z|||Z"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$A$(0)$\\to B$(2): relax gives $D=7,C=6,E=5$. Next smallest is $E$(5): relax gives $C=\\min(6,8)=6$(no change), $D=\\min(7,9)=7$(no change), $Z=8$. Remaining unvisited: $C=6,D=7,Z=8$ -- smallest is $C$.</div><div class=\"ml-vi\">$A$(0)$\\to B$(2): nới lỏng cho $D=7,C=6,E=5$. Tiếp theo nhỏ nhất là $E$(5): nới lỏng cho $C=\\min(6,8)=6$(không đổi), $D=\\min(7,9)=7$(không đổi), $Z=8$. Còn lại chưa thăm: $C=6,D=7,Z=8$ -- nhỏ nhất là $C$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the tree: root $a$ with children $b,d,c$; $b$'s children $e,h,g$; $e$'s children $i,n,k$; $c$'s children $f,l,m$; $d$ is a leaf. How many internal vertices in this tree?|||Cho cây: gốc $a$ với con $b,d,c$; con của $b$ là $e,h,g$; con của $e$ là $i,n,k$; con của $c$ là $f,l,m$; $d$ là lá. Có bao nhiêu đỉnh trong trong cây này?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Internal vertices (having at least one child): $a,b,e,c$. All others ($d,h,g,i,n,k,f,l,m$) are leaves. Total internal vertices: 4.</div><div class=\"ml-vi\">Đỉnh trong (có ít nhất một con): $a,b,e,c$. Mọi đỉnh khác ($d,h,g,i,n,k,f,l,m$) đều là lá. Tổng số đỉnh trong: 4.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of leaves in a balanced full 4-ary tree of height 3.|||Tìm số lá ít nhất trong một cây 4-phân đầy đủ cân bằng chiều cao 3.",
          "options": [
            {
              "text": "19|||19"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"Balanced\" requires every leaf at depth 2 or 3, so all nodes at depths 0,1 must be internal (4 at depth 1, giving $4\\times4=16$ nodes at depth 2). To minimize leaves while keeping height exactly 3, only ONE depth-2 node needs to be internal (producing 4 leaves at depth 3); the other 15 depth-2 nodes are leaves. Total: $15+4=19$.</div><div class=\"ml-vi\">\"Cân bằng\" yêu cầu mọi lá ở độ sâu 2 hoặc 3, nên mọi nút ở độ sâu 0,1 phải là đỉnh trong (4 ở độ sâu 1, cho $4\\times4=16$ nút ở độ sâu 2). Để tối thiểu số lá mà vẫn giữ chiều cao đúng 3, chỉ cần MỘT nút độ sâu 2 là đỉnh trong (sinh 4 lá ở độ sâu 3); 15 nút độ sâu 2 còn lại là lá. Tổng: $15+4=19$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which are prefix codes? (i) $a$:11, $e$:00, $t$:10, $s$:01 (ii) $a$:0, $e$:1, $t$:01, $s$:001|||Bộ mã nào là mã tiền tố (prefix code)? (i) $a$:11, $e$:00, $t$:10, $s$:01 (ii) $a$:0, $e$:1, $t$:01, $s$:001",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i): all four codewords have length 2 and are distinct -- prefix-free, valid. (ii): codeword \"0\" (for $a$) is a prefix of \"01\" (for $t$) and of \"001\" (for $s$) -- violates the prefix property, invalid. Only (i) is a prefix code.</div><div class=\"ml-vi\">(i): cả bốn từ mã đều dài 2 và khác nhau -- không tiền tố lẫn nhau, hợp lệ. (ii): từ mã \"0\" (của $a$) là tiền tố của \"01\" (của $t$) và của \"001\" (của $s$) -- vi phạm tính chất tiền tố, không hợp lệ. Chỉ (i) là mã tiền tố.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of comparisons needed to sort a list of 6 elements?|||Tìm số phép so sánh ít nhất cần để sắp xếp một danh sách 6 phần tử?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "720|||720"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The comparison-sort lower bound is $\\lceil\\log_2(n!)\\rceil$. For $n=6$: $6!=720$, $\\log_2(720)\\approx9.49$, so $\\lceil9.49\\rceil=10$.</div><div class=\"ml-vi\">Cận dưới của sắp xếp bằng so sánh là $\\lceil\\log_2(n!)\\rceil$. Với $n=6$: $6!=720$, $\\log_2(720)\\approx9.49$, nên $\\lceil9.49\\rceil=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the prefix notation of some expression $+\\ *\\ 3\\ +\\ x\\ y\\ \\uparrow\\ -\\ x\\ y\\ 2$. Find the postfix notation. (i) $3\\ x\\ y\\ +\\ *\\ x\\ y\\ -\\ 2\\ \\uparrow\\ +$ (ii) $3\\ *\\ +\\ x\\ y\\ +\\ x\\ -\\ y\\uparrow2$ (iii) $x\\ 3\\ y\\ +\\ *\\ x\\ y\\ -\\ 2\\uparrow+$|||Cho ký hiệu tiền tố của một biểu thức $+\\ *\\ 3\\ +\\ x\\ y\\ \\uparrow\\ -\\ x\\ y\\ 2$. Tìm ký hiệu hậu tố. (i) $3\\ x\\ y\\ +\\ *\\ x\\ y\\ -\\ 2\\ \\uparrow\\ +$ (ii) $3\\ *\\ +\\ x\\ y\\ +\\ x\\ -\\ y\\uparrow2$ (iii) $x\\ 3\\ y\\ +\\ *\\ x\\ y\\ -\\ 2\\uparrow+$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Parsing prefix: root $+$ has left $*\\,3\\,(+\\,x\\,y)=3*(x+y)$ and right $\\uparrow\\,(-\\,x\\,y)\\,2=(x-y)^2$. Postfix of left: $3\\,x\\,y\\,+\\,*$. Postfix of right: $x\\,y\\,-\\,2\\,\\uparrow$. Combined with root: $3\\,x\\,y\\,+\\,*\\,x\\,y\\,-\\,2\\,\\uparrow\\,+$, exactly option (i).</div><div class=\"ml-vi\">Phân tích tiền tố: gốc $+$ có trái $*\\,3\\,(+\\,x\\,y)=3*(x+y)$ và phải $\\uparrow\\,(-\\,x\\,y)\\,2=(x-y)^2$. Hậu tố của trái: $3\\,x\\,y\\,+\\,*$. Hậu tố của phải: $x\\,y\\,-\\,2\\,\\uparrow$. Kết hợp với gốc: $3\\,x\\,y\\,+\\,*\\,x\\,y\\,-\\,2\\,\\uparrow\\,+$, đúng là đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the prefix notation for the expression $(x-y)\\uparrow2+x*(y+5)$. (i) $x-y\\uparrow2+x*y+5$ (ii) $x\\ y\\ -\\ 2\\uparrow x\\ y\\ 5\\ +\\ *\\ +$ (iii) $+\\uparrow-xy2*x+y5$ (iv) $+\\uparrow-xy2*x5+y$|||Tìm ký hiệu tiền tố cho biểu thức $(x-y)\\uparrow2+x*(y+5)$. (i) $x-y\\uparrow2+x*y+5$ (ii) $x\\ y\\ -\\ 2\\uparrow x\\ y\\ 5\\ +\\ *\\ +$ (iii) $+\\uparrow-xy2*x+y5$ (iv) $+\\uparrow-xy2*x5+y$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$(x-y)^2\\to\\uparrow\\,(-\\,x\\,y)\\,2=\\uparrow-xy2$. $x*(y+5)\\to*\\,x\\,(+\\,y\\,5)=*x+y5$. Root $+$: combining gives $+\\uparrow-xy2*x+y5$, option (iii).</div><div class=\"ml-vi\">$(x-y)^2\\to\\uparrow\\,(-\\,x\\,y)\\,2=\\uparrow-xy2$. $x*(y+5)\\to*\\,x\\,(+\\,y\\,5)=*x+y5$. Gốc $+$: kết hợp cho $+\\uparrow-xy2*x+y5$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the height of the spanning tree obtained from $W_n$ by the breadth-first search, starting at the central vertex of $W_n$?|||Chiều cao của cây khung thu được từ $W_n$ bằng tìm kiếm theo chiều rộng, bắt đầu tại đỉnh trung tâm của $W_n$, là bao nhiêu?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "n|||n"
            },
            {
              "text": "n-1|||n-1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The hub connects directly to all $n$ rim vertices, so BFS starting at the hub visits every rim vertex at level 1 -- no vertex is farther than depth 1. Height $=1$.</div><div class=\"ml-vi\">Trung tâm nối trực tiếp với mọi $n$ đỉnh vành, nên BFS bắt đầu tại trung tâm thăm mọi đỉnh vành ở mức 1 -- không đỉnh nào xa hơn độ sâu 1. Chiều cao $=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the total weight of a minimal spanning tree of the graph with vertices $A,B,C,D,E,Z$ and edges $AB{=}2,AC{=}6,BD{=}3,BC{=}2,BE{=}3,DE{=}4,DZ{=}2,CE{=}4,EZ{=}3$?|||Tổng trọng số của cây khung nhỏ nhất trong đồ thị với các đỉnh $A,B,C,D,E,Z$ và các cạnh $AB{=}2,AC{=}6,BD{=}3,BC{=}2,BE{=}3,DE{=}4,DZ{=}2,CE{=}4,EZ{=}3$ là bao nhiêu?",
          "options": [
            {
              "text": "14|||14"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Kruskal's algorithm in increasing order: $AB(2)$ add, $BC(2)$ add, $DZ(2)$ add, $BD(3)$ add (connects $\\{A,B,C\\}$ with $\\{D,Z\\}$), $BE(3)$ add (connects $E$) -- 5 edges span all 6 vertices, done. Total: $2+2+2+3+3=12$.</div><div class=\"ml-vi\">Thuật toán Kruskal theo thứ tự tăng dần: $AB(2)$ thêm, $BC(2)$ thêm, $DZ(2)$ thêm, $BD(3)$ thêm (nối $\\{A,B,C\\}$ với $\\{D,Z\\}$), $BE(3)$ thêm (nối $E$) -- 5 cạnh trải khắp 6 đỉnh, xong. Tổng: $2+2+2+3+3=12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the functions from $\\mathbb{Z}\\times\\mathbb{Z}\\to\\mathbb{Z}$ given by $f(m,n)=m+2n$, $g(m,n)=2m+2n+1$, $h(m,n)=m-n$. Which functions are onto?|||Xét các hàm từ $\\mathbb{Z}\\times\\mathbb{Z}\\to\\mathbb{Z}$ cho bởi $f(m,n)=m+2n$, $g(m,n)=2m+2n+1$, $h(m,n)=m-n$. Hàm nào toàn ánh?",
          "options": [
            {
              "text": "f and h|||f và h"
            },
            {
              "text": "Only g|||Chỉ g"
            },
            {
              "text": "Only f|||Chỉ f"
            },
            {
              "text": "g and h|||g và h"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f$: for any target $k$, take $n=0,m=k$: $f(k,0)=k$ -- onto. $h$: take $m=k,n=0$: $h(k,0)=k$ -- onto. $g$: $2m+2n$ is always even, so $g=2m+2n+1$ is always ODD -- can never equal an even integer, NOT onto.</div><div class=\"ml-vi\">$f$: với mọi mục tiêu $k$, lấy $n=0,m=k$: $f(k,0)=k$ -- toàn ánh. $h$: lấy $m=k,n=0$: $h(k,0)=k$ -- toàn ánh. $g$: $2m+2n$ luôn chẵn, nên $g=2m+2n+1$ luôn LẺ -- không bao giờ bằng một số chẵn, không toàn ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many divisions are needed when using the Euclidean algorithm to find the greatest common divisor of 6468 and 3135?|||Cần bao nhiêu phép chia khi dùng thuật toán Euclid để tìm ước chung lớn nhất của 6468 và 3135?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$6468=2(3135)+198$. $3135=15(198)+165$. $198=1(165)+33$. $165=5(33)+0$. That's 4 divisions.</div><div class=\"ml-vi\">$6468=2(3135)+198$. $3135=15(198)+165$. $198=1(165)+33$. $165=5(33)+0$. Đó là 4 phép chia.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f$ is defined recursively by $f(1)=2,f(2)=3$ and $f(n)=3f(n-1)+f(n-2)$ for $n\\ge3$. Find $f(6)$.|||Giả sử $f$ được định nghĩa đệ quy bởi $f(1)=2,f(2)=3$ và $f(n)=3f(n-1)+f(n-2)$ với $n\\ge3$. Tìm $f(6)$.",
          "options": [
            {
              "text": "119|||119"
            },
            {
              "text": "327|||327"
            },
            {
              "text": "99|||99"
            },
            {
              "text": "393|||393"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=3(3)+2=11$. $f(4)=3(11)+3=36$. $f(5)=3(36)+11=119$. $f(6)=3(119)+36=393$.</div><div class=\"ml-vi\">$f(3)=3(3)+2=11$. $f(4)=3(11)+3=36$. $f(5)=3(36)+11=119$. $f(6)=3(119)+36=393$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D8",
      "source": "REAL",
      "sortOrder": 208,
      "title": "Final Exam — Đề 8|||Thi cuối kỳ — Đề 8",
      "description": "MAD101 Final Exam, Đề 8 (48 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 8 (48 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 96,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many bit strings of length 10 either begin with three 0s or end with two 0s?|||Có bao nhiêu chuỗi bit độ dài 10 hoặc bắt đầu bằng ba số 0 hoặc kết thúc bằng hai số 0?",
          "options": [
            {
              "text": "384|||384"
            },
            {
              "text": "352|||352"
            },
            {
              "text": "192|||192"
            },
            {
              "text": "186|||186"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Begin with 000: remaining 7 bits free, $2^7=128$. End with 00: remaining 8 bits free, $2^8=256$. Both (begin 000 AND end 00): remaining 5 middle bits free, $2^5=32$. By inclusion-exclusion: $128+256-32=352$.</div><div class=\"ml-vi\">Bắt đầu bằng 000: 7 bit còn lại tự do, $2^7=128$. Kết thúc bằng 00: 8 bit còn lại tự do, $2^8=256$. Cả hai (bắt đầu 000 VÀ kết thúc 00): 5 bit giữa tự do, $2^5=32$. Theo bù trừ: $128+256-32=352$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be a simple graph that is isomorphic to the wheel $W_n$. Find the INCORRECT statements. (i) If G has 10 vertices then n=9 (ii) The adjacency matrices of G and $W_n$ are identical (iii) The number of edges in G and $W_n$ are the same (iv) If n=3 then G has exactly 4 vertices of degree 3|||Cho $G$ là đơn đồ thị đẳng cấu với bánh xe $W_n$. Tìm (các) phát biểu SAI. (i) Nếu G có 10 đỉnh thì n=9 (ii) Ma trận kề của G và $W_n$ giống hệt nhau (iii) Số cạnh của G và $W_n$ bằng nhau (iv) Nếu n=3 thì G có đúng 4 đỉnh bậc 3",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i),(iii),(iv) are all true (isomorphic graphs preserve vertex/edge counts and degree sequences; $W_3$ has all 4 vertices of degree 3). (ii) is FALSE: isomorphic graphs need not have identical adjacency matrices -- only matrices that are equal after some permutation of rows/columns (relabeling).</div><div class=\"ml-vi\">(i),(iii),(iv) đều đúng (đồ thị đẳng cấu giữ nguyên số đỉnh/cạnh và dãy bậc; $W_3$ có cả 4 đỉnh bậc 3). (ii) SAI: đồ thị đẳng cấu không nhất thiết có ma trận kề giống hệt nhau -- chỉ cần ma trận bằng nhau sau khi hoán vị hàng/cột (đổi nhãn).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many numbers in the set $\\{80,90,-80,-90\\}$ are congruent to 5 modulo 17?|||Có bao nhiêu số trong tập $\\{80,90,-80,-90\\}$ đồng dư với 5 theo modulo 17?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$80\\bmod17=12$ (no). $90\\bmod17=5$ (yes, since $17\\times5=85$). $-80\\bmod17$: $-80+85=5$ (yes). $-90\\bmod17$: $-90+102=12$ (no). So 2 numbers (90 and -80) match.</div><div class=\"ml-vi\">$80\\bmod17=12$ (không). $90\\bmod17=5$ (có, vì $17\\times5=85$). $-80\\bmod17$: $-80+85=5$ (có). $-90\\bmod17$: $-90+102=12$ (không). Vậy 2 số (90 và -80) khớp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the recursive algorithm if input $n=5$: procedure TT($n$: integer): if $n=1$ then $f(1):=-2$ else $f(n):=f(n-1)*n$.|||Tìm kết quả của thuật toán đệ quy nếu đầu vào $n=5$: procedure TT($n$: integer): nếu $n=1$ thì $f(1):=-2$ ngược lại $f(n):=f(n-1)*n$.",
          "options": [
            {
              "text": "-120|||-120"
            },
            {
              "text": "-240|||-240"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "240|||240"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=-2$. $f(2)=-2\\times2=-4$. $f(3)=-4\\times3=-12$. $f(4)=-12\\times4=-48$. $f(5)=-48\\times5=-240$.</div><div class=\"ml-vi\">$f(1)=-2$. $f(2)=-2\\times2=-4$. $f(3)=-4\\times3=-12$. $f(4)=-12\\times4=-48$. $f(5)=-48\\times5=-240$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f$ be the function from $N$ to $N$ such that $f(x)=\\lfloor x/2\\rfloor$. Which of the following statements is true?|||Cho $f$ là hàm từ $N$ đến $N$ sao cho $f(x)=\\lfloor x/2\\rfloor$. Phát biểu nào sau đây đúng?",
          "options": [
            {
              "text": "f is one-to-one but not onto|||f đơn ánh nhưng không toàn ánh"
            },
            {
              "text": "f is onto but not one-to-one|||f toàn ánh nhưng không đơn ánh"
            },
            {
              "text": "f is a bijection|||f song ánh"
            },
            {
              "text": "f is neither one-to-one nor onto|||f không đơn ánh cũng không toàn ánh"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Not one-to-one: $f(0)=f(1)=0$. Onto: for any $m\\in N$, $x=2m$ gives $f(2m)=m$, so every natural number is reached. So $f$ is onto but not one-to-one.</div><div class=\"ml-vi\">Không đơn ánh: $f(0)=f(1)=0$. Toàn ánh: với mọi $m\\in N$, $x=2m$ cho $f(2m)=m$, nên mọi số tự nhiên đều đạt được. Vậy $f$ toàn ánh nhưng không đơn ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a proposition with the given truth table: $p{=}T,q{=}T\\to T$; $p{=}T,q{=}F\\to T$; $p{=}F,q{=}T\\to T$; $p{=}F,q{=}F\\to F$. (i) $p\\to q$ (ii) $q\\to p$ (iii) $p\\to\\neg q$ (iv) $\\neg p\\to q$|||Tìm mệnh đề có bảng chân trị cho trước: $p{=}T,q{=}T\\to T$; $p{=}T,q{=}F\\to T$; $p{=}F,q{=}T\\to T$; $p{=}F,q{=}F\\to F$. (i) $p\\to q$ (ii) $q\\to p$ (iii) $p\\to\\neg q$ (iv) $\\neg p\\to q$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The table is exactly $p\\lor q$. Checking $\\neg p\\to q$: $p{=}T,q{=}T$: $\\neg p=F$, $F\\to T=T$ (matches). $p{=}T,q{=}F$: $F\\to F=T$ (matches). $p{=}F,q{=}T$: $\\neg p=T$, $T\\to T=T$ (matches). $p{=}F,q{=}F$: $T\\to F=F$ (matches). All four rows match -- option (iv).</div><div class=\"ml-vi\">Bảng chính là $p\\lor q$. Kiểm $\\neg p\\to q$: $p{=}T,q{=}T$: $\\neg p=F$, $F\\to T=T$ (khớp). $p{=}T,q{=}F$: $F\\to F=T$ (khớp). $p{=}F,q{=}T$: $\\neg p=T$, $T\\to T=T$ (khớp). $p{=}F,q{=}F$: $T\\to F=F$ (khớp). Cả 4 dòng khớp -- đáp án (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the sequence $\\{a_n\\}=3,5,8,12,17,\\ldots$, assuming that the pattern of the first few terms continues. If we start at $n=0$, what is $a_7$?|||Cho dãy $\\{a_n\\}=3,5,8,12,17,\\ldots$, giả sử mẫu hình của vài số hạng đầu tiếp tục. Nếu bắt đầu từ $n=0$, $a_7$ là gì?",
          "options": [
            {
              "text": "38|||38"
            },
            {
              "text": "47|||47"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "None of the others|||Không đáp án nào ở trên"
            },
            {
              "text": "42|||42"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Differences increase by 1 each time: $+2,+3,+4,+5,\\ldots$. $a_4=17$, $a_5=17+6=23$, $a_6=23+7=30$, $a_7=30+8=38$.</div><div class=\"ml-vi\">Hiệu tăng thêm 1 mỗi lần: $+2,+3,+4,+5,\\ldots$. $a_4=17$, $a_5=17+6=23$, $a_6=23+7=30$, $a_7=30+8=38$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S$ be the set of all directed graphs with the sequence of (out-degree, in-degree): $[(2,2),(2,2),(2,1),(2,3)]$. Which of the following is TRUE: (i) $\\forall G\\in S$: $G$ has no Euler paths (ii) $\\exists G\\in S$: $G$ has an Euler circuit (iii) $\\exists G\\in S$: $G$ has an Euler path, but no Euler circuits|||Cho $S$ là tập mọi đồ thị có hướng với dãy (bậc ra, bậc vào): $[(2,2),(2,2),(2,1),(2,3)]$. Điều nào sau đây ĐÚNG: (i) $\\forall G\\in S$: $G$ không có đường đi Euler (ii) $\\exists G\\in S$: $G$ có chu trình Euler (iii) $\\exists G\\in S$: $G$ có đường đi Euler, nhưng không có chu trình Euler",
          "options": [
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An Euler circuit requires in-degree=out-degree at every vertex -- vertices 3 $(2,1)$ and 4 $(2,3)$ are unbalanced, so (ii) is false for every $G\\in S$. An Euler path requires exactly one vertex with out-in=1 (start) and one with in-out=1 (end): vertex 3 has out-in=1, vertex 4 has in-out=1, vertices 1,2 are balanced -- this matches exactly, so some connected $G\\in S$ has an Euler path from vertex 3 to vertex 4, but since it's not balanced everywhere it can't be a circuit. So (iii) is true and (i) is false.</div><div class=\"ml-vi\">Chu trình Euler đòi hỏi bậc vào=bậc ra tại mọi đỉnh -- đỉnh 3 $(2,1)$ và đỉnh 4 $(2,3)$ không cân bằng, nên (ii) sai với mọi $G\\in S$. Đường đi Euler đòi hỏi đúng một đỉnh có bậc ra-vào=1 (điểm đầu) và một đỉnh có bậc vào-ra=1 (điểm cuối): đỉnh 3 có bậc ra-vào=1, đỉnh 4 có bậc vào-ra=1, đỉnh 1,2 cân bằng -- khớp chính xác, nên một số $G\\in S$ liên thông có đường đi Euler từ đỉnh 3 đến đỉnh 4, nhưng vì không cân bằng khắp nơi nên không thể là chu trình. Vậy (iii) đúng và (i) sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $N=\\{0,1,2,\\ldots\\}$. Let $f,g$ be two functions from $N$ to $N$ with $f(x)=x^2+1$ and $g(x)=x+1$. Which functions are one-to-one?|||Cho $N=\\{0,1,2,\\ldots\\}$. Cho $f,g$ là hai hàm từ $N$ đến $N$ với $f(x)=x^2+1$ và $g(x)=x+1$. Hàm nào đơn ánh?",
          "options": [
            {
              "text": "f and g|||f và g"
            },
            {
              "text": "g|||g"
            },
            {
              "text": "f|||f"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">On the domain $N$ (non-negative integers only, unlike $\\mathbb{Z}$), $x^2$ is strictly increasing for $x\\ge0$, so $f$ is injective (no collision like $f(1)=f(-1)$ since negative inputs aren't in the domain). $g$ is linear and strictly increasing, also injective. Both $f$ and $g$ are one-to-one.</div><div class=\"ml-vi\">Trên miền $N$ (chỉ số nguyên không âm, khác $\\mathbb{Z}$), $x^2$ tăng nghiêm ngặt với $x\\ge0$, nên $f$ đơn ánh (không có va chạm như $f(1)=f(-1)$ vì đầu vào âm không thuộc miền). $g$ tuyến tính và tăng nghiêm ngặt, cũng đơn ánh. Cả $f$ và $g$ đều đơn ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $u,v$ be two vertices on one side of the bipartite graph $K_{2,2}$. How many paths of length 4 from $u$ to $v$?|||Cho $u,v$ là hai đỉnh cùng một phía của đồ thị lưỡng phân $K_{2,2}$. Có bao nhiêu đường đi độ dài 4 từ $u$ đến $v$?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Label sides $\\{u,v\\}$ and $\\{a,b\\}$. Using the adjacency matrix (order $u,v,a,b$), $A^2$ has $(u,u)=(u,v)=2$ and $(u,a)=(u,b)=0$. Then $(A^4)_{u,v}=\\sum_k A^2_{u,k}A^2_{k,v}=A^2_{u,u}A^2_{u,v}+A^2_{u,v}A^2_{v,v}=2(2)+2(2)=8$.</div><div class=\"ml-vi\">Đặt hai phía $\\{u,v\\}$ và $\\{a,b\\}$. Dùng ma trận kề (thứ tự $u,v,a,b$), $A^2$ có $(u,u)=(u,v)=2$ và $(u,a)=(u,b)=0$. Rồi $(A^4)_{u,v}=\\sum_k A^2_{u,k}A^2_{k,v}=A^2_{u,u}A^2_{u,v}+A^2_{u,v}A^2_{v,v}=2(2)+2(2)=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the value of the following prefix expression? $+\\ -\\ \\uparrow\\ 3\\ 2\\ \\uparrow\\ 2\\ 3\\ /\\ 6\\ -\\ 4\\ 2$|||Giá trị của biểu thức tiền tố sau là gì? $+\\ -\\ \\uparrow\\ 3\\ 2\\ \\uparrow\\ 2\\ 3\\ /\\ 6\\ -\\ 4\\ 2$",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Parsing: left of root $+$ is $-\\,(\\uparrow32)\\,(\\uparrow23)=-(9)(8)=1$. Right of root is $/\\,6\\,(-42)=/\\,6\\,2=3$. Final: $1+3=4$, which matches none of the listed numeric options.</div><div class=\"ml-vi\">Phân tích: nhánh trái của gốc $+$ là $-\\,(\\uparrow32)\\,(\\uparrow23)=-(9)(8)=1$. Nhánh phải của gốc là $/\\,6\\,(-42)=/\\,6\\,2=3$. Kết quả: $1+3=4$, không khớp bất kỳ đáp án số nào được liệt kê.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be the statement \"x is an even number\" and $Q(x)$ be the statement \"x is an odd number\", where the domain is the set of all natural numbers. Which propositions are true? (i) $\\forall x\\forall y((P(x)\\land Q(y))\\to Q(xy))$ (ii) $\\forall x\\forall y((P(x)\\land Q(y))\\to P(xy))$ (iii) $\\exists x\\exists y((P(x)\\land Q(y))\\to P(x+y))$|||Cho $P(x)$ là mệnh đề \"x là số chẵn\" và $Q(x)$ là mệnh đề \"x là số lẻ\", với miền là tập mọi số tự nhiên. Mệnh đề nào ĐÚNG? (i) $\\forall x\\forall y((P(x)\\land Q(y))\\to Q(xy))$ (ii) $\\forall x\\forall y((P(x)\\land Q(y))\\to P(xy))$ (iii) $\\exists x\\exists y((P(x)\\land Q(y))\\to P(x+y))$",
          "options": [
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Only (iii)|||Chỉ (iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">(i) is false: take $x=2$ (even), $y=3$ (odd): $P(x)\\land Q(y)$ true, but $xy=6$ is even, not odd, so $Q(xy)$ false -- implication fails. (ii) is true: even times anything is always even, so whenever $P(x)\\land Q(y)$ holds, $P(xy)$ holds too. (iii) is trivially true: pick $x=1$ (odd, so $P(x)$ false), making the implication vacuously true for that existential witness. So (ii) and (iii) are true.</div><div class=\"ml-vi\">(i) sai: lấy $x=2$ (chẵn), $y=3$ (lẻ): $P(x)\\land Q(y)$ đúng, nhưng $xy=6$ là chẵn, không lẻ, nên $Q(xy)$ sai -- phép kéo theo thất bại. (ii) đúng: chẵn nhân bất kỳ số nào luôn ra chẵn, nên bất cứ khi nào $P(x)\\land Q(y)$ đúng, $P(xy)$ cũng đúng. (iii) đúng hiển nhiên: chọn $x=1$ (lẻ, nên $P(x)$ sai), làm phép kéo theo đúng hiển nhiên cho chứng cứ tồn tại đó. Vậy (ii) và (iii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)=2f(n/2)+3$ when $n$ is an even positive integer and $f(16)=125$. Find $f(1)$.|||Giả sử $f(n)=2f(n/2)+3$ khi $n$ là số nguyên dương chẵn và $f(16)=125$. Tìm $f(1)$.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "29|||29"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Working backwards: $f(16)=2f(8)+3=125\\Rightarrow f(8)=61$. $f(8)=2f(4)+3=61\\Rightarrow f(4)=29$. $f(4)=2f(2)+3=29\\Rightarrow f(2)=13$. $f(2)=2f(1)+3=13\\Rightarrow f(1)=5$.</div><div class=\"ml-vi\">Tính ngược: $f(16)=2f(8)+3=125\\Rightarrow f(8)=61$. $f(8)=2f(4)+3=61\\Rightarrow f(4)=29$. $f(4)=2f(2)+3=29\\Rightarrow f(2)=13$. $f(2)=2f(1)+3=13\\Rightarrow f(1)=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graphs have Hamilton circuits? Graph 1 is a 3x3 grid graph (9 vertices). Graph 2 is a house-shaped graph with a pendant (degree-1) vertex sticking out on the right. Graph 3 is $K_{2,3}$.|||Đồ thị nào có chu trình Hamilton? Đồ thị 1 là lưới 3x3 (9 đỉnh). Đồ thị 2 là hình dạng ngôi nhà với một đỉnh treo (bậc 1) nhô ra bên phải. Đồ thị 3 là $K_{2,3}$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Graph 2|||Đồ thị 2"
            },
            {
              "text": "Graph 3|||Đồ thị 3"
            },
            {
              "text": "Graph 1|||Đồ thị 1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Graph 1: the 3x3 grid is bipartite with unequal color classes (5 and 4, since 9 vertices is odd) -- a Hamilton cycle in a bipartite graph needs equal-sized parts, so impossible. Graph 2: has a pendant vertex (degree 1), which can never be part of any cycle -- no Hamilton circuit. Graph 3: $K_{2,3}$ is bipartite with unequal parts (2 and 3) -- same reasoning, impossible. None of the three graphs has a Hamilton circuit.</div><div class=\"ml-vi\">Đồ thị 1: lưới 3x3 là lưỡng phân với các lớp màu không bằng nhau (5 và 4, vì 9 đỉnh là số lẻ) -- chu trình Hamilton trong đồ thị lưỡng phân cần hai phía bằng nhau, nên không thể. Đồ thị 2: có đỉnh treo (bậc 1), không bao giờ có thể thuộc bất kỳ chu trình nào -- không có chu trình Hamilton. Đồ thị 3: $K_{2,3}$ lưỡng phân với hai phía không bằng nhau (2 và 3) -- cùng lý luận, không thể. Không đồ thị nào trong ba đồ thị có chu trình Hamilton.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following statements: (i) $W_n$ has $n$ vertices (ii) $W_n$ has $2n$ edges (iii) The degree of each vertex in $W_n$ is 3 (iv) The degree of each vertex in $W_n$ is $n$. Choose the INCORRECT statement(s):|||Xét các phát biểu sau: (i) $W_n$ có $n$ đỉnh (ii) $W_n$ có $2n$ cạnh (iii) Bậc của mỗi đỉnh trong $W_n$ là 3 (iv) Bậc của mỗi đỉnh trong $W_n$ là $n$. Chọn (các) phát biểu SAI:",
          "options": [
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(i), (iii) and (iv)|||(i), (iii) và (iv)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) is false: $W_n$ has $n+1$ vertices (hub plus $n$ rim vertices), not $n$. (ii) is true: $n$ rim edges (cycle) plus $n$ spokes $=2n$ edges. (iii) is false in general: only rim vertices have degree 3; the hub has degree $n$. (iv) is false in general: only the hub has degree $n$; rim vertices have degree 3. So (i), (iii), (iv) are incorrect.</div><div class=\"ml-vi\">(i) sai: $W_n$ có $n+1$ đỉnh (trung tâm cộng $n$ đỉnh vành), không phải $n$. (ii) đúng: $n$ cạnh vành (chu trình) cộng $n$ nan hoa $=2n$ cạnh. (iii) sai nói chung: chỉ đỉnh vành có bậc 3; trung tâm có bậc $n$. (iv) sai nói chung: chỉ trung tâm có bậc $n$; đỉnh vành có bậc 3. Vậy (i), (iii), (iv) sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f(2)$ and $f(4)$ if $f(n)=3f(n-1)+6$ and $f(3)=18$.|||Tìm $f(2)$ và $f(4)$ nếu $f(n)=3f(n-1)+6$ và $f(3)=18$.",
          "options": [
            {
              "text": "f(2) = 4, f(4) = 54|||f(2) = 4, f(4) = 54"
            },
            {
              "text": "f(2) = 6, f(4) = 54|||f(2) = 6, f(4) = 54"
            },
            {
              "text": "f(2) = 4, f(4) = 60|||f(2) = 4, f(4) = 60"
            },
            {
              "text": "f(2) = 6, f(4) = 60|||f(2) = 6, f(4) = 60"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=3f(2)+6=18\\Rightarrow f(2)=4$. $f(4)=3f(3)+6=3(18)+6=60$.</div><div class=\"ml-vi\">$f(3)=3f(2)+6=18\\Rightarrow f(2)=4$. $f(4)=3f(3)+6=3(18)+6=60$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following procedures are recursive algorithms? (i) procedure tt1($x$: int, $n$: positive int): $d:=0$; for $i:=1$ to $n$ do $d:=d+x$; print($d$) (ii) procedure tt2($x$: int, $n$: positive int): if $n=1$ then $tt2(x,n):=x$ else $tt2(x,n):=tt2(x,n-1)+x$ (iii) procedure tt3($n$: positive int): $s:=0$; for $i:=1$ to $n$ do $s:=s+n$; print($s$) (iv) procedure tt4($n$: positive int): if $n=1$ then $tt4(n):=1$ else $tt4(n):=tt4(n-1)+n$|||Thủ tục nào sau đây là thuật toán đệ quy? (i) procedure tt1($x$: int, $n$: positive int): $d:=0$; for $i:=1$ to $n$ do $d:=d+x$; print($d$) (ii) procedure tt2($x$: int, $n$: positive int): nếu $n=1$ thì $tt2(x,n):=x$ ngược lại $tt2(x,n):=tt2(x,n-1)+x$ (iii) procedure tt3($n$: positive int): $s:=0$; for $i:=1$ to $n$ do $s:=s+n$; print($s$) (iv) procedure tt4($n$: positive int): nếu $n=1$ thì $tt4(n):=1$ ngược lại $tt4(n):=tt4(n-1)+n$",
          "options": [
            {
              "text": "(iii), (iv)|||(iii), (iv)"
            },
            {
              "text": "(i), (ii)|||(i), (ii)"
            },
            {
              "text": "(ii), (iv)|||(ii), (iv)"
            },
            {
              "text": "(i), (iii)|||(i), (iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) and (iii) use simple `for` loops -- iterative, not recursive. (ii) and (iv) both call themselves with a smaller argument ($tt2(x,n-1)$, $tt4(n-1)$) -- recursive.</div><div class=\"ml-vi\">(i) và (iii) dùng vòng lặp `for` đơn giản -- lặp, không đệ quy. (ii) và (iv) đều tự gọi chính nó với đối số nhỏ hơn ($tt2(x,n-1)$, $tt4(n-1)$) -- đệ quy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many vertices are needed to construct a graph with 10 edges in which every vertex is of degree 4?|||Cần bao nhiêu đỉnh để dựng một đồ thị có 10 cạnh mà mọi đỉnh đều có bậc 4?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">By the handshaking lemma, sum of degrees $=2\\times10=20$. With every vertex having degree 4, vertices $=20/4=5$.</div><div class=\"ml-vi\">Theo bổ đề bắt tay, tổng bậc $=2\\times10=20$. Với mọi đỉnh bậc 4, số đỉnh $=20/4=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Binary search algorithm: procedure Binarysearch($a_1<a_2<\\ldots<a_n$, $x$: integer): $i:=1$, $j:=n$; while $(i<j)$: $m:=\\lfloor(i+j)/2\\rfloor$, if $x>a_m$ then $i:=m+1$ else $j:=m$; if $x=a_i$ then location:=i else location:=0. If input $=2,4,5,7,8,9,10,13$ and $x=11$, after the second time of dividing into sublists, the sublist to be considered is ___|||Cho thuật toán Tìm kiếm nhị phân: procedure Binarysearch($a_1<a_2<\\ldots<a_n$, $x$: integer): $i:=1$, $j:=n$; while $(i<j)$: $m:=\\lfloor(i+j)/2\\rfloor$, if $x>a_m$ then $i:=m+1$ else $j:=m$; if $x=a_i$ then location:=i else location:=0. Nếu đầu vào $=2,4,5,7,8,9,10,13$ và $x=11$, sau lần chia thành các dãy con thứ hai, dãy con được xét là ___",
          "options": [
            {
              "text": "9, 10|||9, 10"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "9, 10, 13|||9, 10, 13"
            },
            {
              "text": "10, 13|||10, 13"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$n=8$: $i=1,j=8$. 1st division: $m=4$, $a_4=7<11$ so $i:=5$. 2nd division: $i=5,j=8$, $m=6$, $a_6=9<11$ so $i:=7$. Now $i=7,j=8$, sublist under consideration is $a_7,a_8=10,13$.</div><div class=\"ml-vi\">$n=8$: $i=1,j=8$. Lần chia 1: $m=4$, $a_4=7<11$ nên $i:=5$. Lần chia 2: $i=5,j=8$, $m=6$, $a_6=9<11$ nên $i:=7$. Giờ $i=7,j=8$, dãy con đang xét là $a_7,a_8=10,13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be a propositional function on $\\{a,b,c\\}$. Which statements are propositions? (i) $P(c)$ (ii) $\\forall xP(x)$ (iii) $\\neg P(a)\\lor P(b)$|||Cho $P(x)$ là hàm mệnh đề trên $\\{a,b,c\\}$. Mệnh đề nào sau đây là một mệnh đề (proposition)? (i) $P(c)$ (ii) $\\forall xP(x)$ (iii) $\\neg P(a)\\lor P(b)$",
          "options": [
            {
              "text": "(i), (ii) and (iii)|||(i), (ii) và (iii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A proposition is a statement with a definite truth value and no free variables. $P(c)$ is a specific instance (no free variable) -- a proposition. $\\forall xP(x)$ is fully quantified -- a proposition. $\\neg P(a)\\lor P(b)$ combines specific instances -- a proposition. All three qualify.</div><div class=\"ml-vi\">Một mệnh đề là phát biểu có giá trị chân lý xác định và không biến tự do. $P(c)$ là một thực thể cụ thể (không biến tự do) -- một mệnh đề. $\\forall xP(x)$ được lượng hóa đầy đủ -- một mệnh đề. $\\neg P(a)\\lor P(b)$ kết hợp các thực thể cụ thể -- một mệnh đề. Cả ba đều thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function is NOT $O(x^3)$? (i) $\\log^{2010}x$ (ii) $\\frac{x^5+2}{x\\log x-4}$ (iii) $2x^2+x-1$|||Hàm nào KHÔNG phải $O(x^3)$? (i) $\\log^{2010}x$ (ii) $\\frac{x^5+2}{x\\log x-4}$ (iii) $2x^2+x-1$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) $(\\log x)^{2010}$ grows slower than any positive power of $x$, so it IS $O(x^3)$. (iii) $2x^2+x-1$ is $O(x^2)\\subset O(x^3)$. (ii) behaves like $\\frac{x^5}{x\\log x}=\\frac{x^4}{\\log x}$, which grows faster than $x^3$ (their ratio $\\frac{x}{\\log x}\\to\\infty$) -- NOT $O(x^3)$.</div><div class=\"ml-vi\">(i) $(\\log x)^{2010}$ tăng chậm hơn bất kỳ lũy thừa dương nào của $x$, nên LÀ $O(x^3)$. (iii) $2x^2+x-1$ là $O(x^2)\\subset O(x^3)$. (ii) hoạt động như $\\frac{x^5}{x\\log x}=\\frac{x^4}{\\log x}$, tăng nhanh hơn $x^3$ (tỉ số $\\frac{x}{\\log x}\\to\\infty$) -- KHÔNG phải $O(x^3)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\{0,2,4,6,8,10\\}$, $B=\\{1,2,3,4,5,6\\}$ and $C=\\{1,2,3,4,5,7,8,9\\}$. What is the cardinality of the set $B-(A\\cup C)$?|||Cho $A=\\{0,2,4,6,8,10\\}$, $B=\\{1,2,3,4,5,6\\}$ và $C=\\{1,2,3,4,5,7,8,9\\}$. Lực lượng của tập $B-(A\\cup C)$ là bao nhiêu?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$A\\cup C=\\{0,1,2,3,4,5,6,7,8,9,10\\}$. Every element of $B=\\{1,2,3,4,5,6\\}$ is in $A\\cup C$, so $B-(A\\cup C)=\\emptyset$, cardinality 0.</div><div class=\"ml-vi\">$A\\cup C=\\{0,1,2,3,4,5,6,7,8,9,10\\}$. Mọi phần tử của $B=\\{1,2,3,4,5,6\\}$ đều thuộc $A\\cup C$, nên $B-(A\\cup C)=\\emptyset$, lực lượng 0.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many elements does the set $P(\\{a,a,b\\})$ have?|||Tập $P(\\{a,a,b\\})$ có bao nhiêu phần tử?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">As a set, $\\{a,a,b\\}=\\{a,b\\}$ (duplicates don't count), which has 2 elements. So $|P(\\{a,b\\})|=2^2=4$.</div><div class=\"ml-vi\">Là một tập hợp, $\\{a,a,b\\}=\\{a,b\\}$ (phần tử trùng không tính thêm), có 2 phần tử. Nên $|P(\\{a,b\\})|=2^2=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $p,q$ be the propositions $p$=\"She is out of work\", $q$=\"She spends less on clothes\". Translate the sentence into a logical expression: \"Although she is out of work, she doesn't spend less on clothes.\" (i) $p\\to\\neg q$ (ii) $p\\land\\neg q$ (iii) $p\\lor\\neg q$ (iv) $p\\leftrightarrow\\neg q$ (v) $\\neg q\\to p$|||Cho $p,q$ là các mệnh đề $p$=\"Cô ấy thất nghiệp\", $q$=\"Cô ấy chi tiêu ít hơn cho quần áo\". Diễn đạt câu sau thành biểu thức logic: \"Mặc dù cô ấy thất nghiệp, cô ấy không chi tiêu ít hơn cho quần áo.\" (i) $p\\to\\neg q$ (ii) $p\\land\\neg q$ (iii) $p\\lor\\neg q$ (iv) $p\\leftrightarrow\\neg q$ (v) $\\neg q\\to p$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(v)|||(v)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">\"Although X, Y\" logically means both X and Y hold (the \"although\" just signals contrast, not a conditional): \"she is out of work\" ($p$, true) AND \"she doesn't spend less on clothes\" ($\\neg q$, true). This is $p\\land\\neg q$, option (ii).</div><div class=\"ml-vi\">\"Mặc dù X, Y\" về mặt logic nghĩa là cả X và Y đều đúng (\"mặc dù\" chỉ báo hiệu sự tương phản, không phải điều kiện): \"cô ấy thất nghiệp\" ($p$, đúng) VÀ \"cô ấy không chi tiêu ít hơn\" ($\\neg q$, đúng). Đây là $p\\land\\neg q$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given some coding schemes (i) $a$:11, $b$:101, $c$:01, $e$:001 (ii) $a$:0, $b$:10, $e$:100, $i$:111 (iii) $a$:101, $e$:011, $i$:100, $n$:001, $m$:11111. Which are prefix codes?|||Cho một số lược đồ mã hóa (i) $a$:11, $b$:101, $c$:01, $e$:001 (ii) $a$:0, $b$:10, $e$:100, $i$:111 (iii) $a$:101, $e$:011, $i$:100, $n$:001, $m$:11111. Bộ mã nào là mã tiền tố?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "All of them are prefix codes|||Tất cả đều là mã tiền tố"
            },
            {
              "text": "(i) and (iii)|||(i) và (iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i): checking $\\{11,101,01,001\\}$, no code is a prefix of another -- valid. (ii): $b$=\"10\" is a prefix of $e$=\"100\" -- violates the prefix property, invalid. (iii): checking $\\{101,011,100,001,11111\\}$, no code is a prefix of another -- valid. So (i) and (iii) are prefix codes.</div><div class=\"ml-vi\">(i): kiểm $\\{11,101,01,001\\}$, không mã nào là tiền tố của mã khác -- hợp lệ. (ii): $b$=\"10\" là tiền tố của $e$=\"100\" -- vi phạm tính chất tiền tố, không hợp lệ. (iii): kiểm $\\{101,011,100,001,11111\\}$, không mã nào là tiền tố của mã khác -- hợp lệ. Vậy (i) và (iii) là mã tiền tố.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert BC1 in hexadecimal representation to binary representation.|||Chuyển BC1 dạng biểu diễn thập lục phân sang biểu diễn nhị phân.",
          "options": [
            {
              "text": "101111000001|||101111000001"
            },
            {
              "text": "1011110001|||1011110001"
            },
            {
              "text": "101111001001|||101111001001"
            },
            {
              "text": "111111001|||111111001"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Each hex digit maps to 4 binary digits: $B=1011$, $C=1100$, $1=0001$. Concatenating: $101111000001$.</div><div class=\"ml-vi\">Mỗi chữ số hex ánh xạ thành 4 chữ số nhị phân: $B=1011$, $C=1100$, $1=0001$. Ghép lại: $101111000001$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of vertices of a full 3-ary tree of height 3.|||Tìm số đỉnh ít nhất của một cây 3-phân đầy đủ chiều cao 3.",
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">To minimize vertices while keeping full (every internal node has exactly 3 children) and height exactly 3, only ONE child at each level continues branching (the others are immediate leaves): level 0 = 1 (root), level 1 = 3 (2 leaves + 1 internal), level 2 = 3 (2 leaves + 1 internal), level 3 = 3 (leaves). Total $=1+3+3+3=10$.</div><div class=\"ml-vi\">Để tối thiểu số đỉnh mà vẫn giữ đầy đủ (mỗi đỉnh trong có đúng 3 con) và chiều cao đúng 3, chỉ MỘT con ở mỗi mức tiếp tục phân nhánh (các con còn lại là lá ngay): mức 0 = 1 (gốc), mức 1 = 3 (2 lá + 1 đỉnh trong), mức 2 = 3 (2 lá + 1 đỉnh trong), mức 3 = 3 (lá). Tổng $=1+3+3+3=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the argument with the hypotheses: \"I will be happy if your project succeeds. Your project can become successful only if you change the method.\" and the conclusion: \"Therefore, if you change the method, then I will be very happy.\" Choose the right answer.|||Xét lập luận với các tiền đề: \"Tôi sẽ vui nếu dự án của bạn thành công. Dự án của bạn chỉ có thể thành công nếu bạn thay đổi phương pháp.\" và kết luận: \"Vậy, nếu bạn thay đổi phương pháp, thì tôi sẽ rất vui.\" Chọn đáp án đúng.",
          "options": [
            {
              "text": "The argument is valid using hypothetical syllogism|||Lập luận hợp lệ dùng tam đoạn luận giả định"
            },
            {
              "text": "The argument is invalid|||Lập luận không hợp lệ"
            },
            {
              "text": "The argument is valid using modus tollens|||Lập luận hợp lệ dùng modus tollens"
            },
            {
              "text": "The argument is valid using simplification|||Lập luận hợp lệ dùng rút gọn"
            },
            {
              "text": "The argument is valid using modus ponens|||Lập luận hợp lệ dùng modus ponens"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Let $S$=\"project succeeds\", $H$=\"I will be happy\", $M$=\"you change the method\". Premises: $S\\to H$ and $S\\to M$ (\"only if\" gives $S\\to M$, not $M\\to S$). The conclusion $M\\to H$ would require $M\\to S$ (the converse), which is NOT given. This confuses a necessary condition with a sufficient one -- the argument is invalid.</div><div class=\"ml-vi\">Cho $S$=\"dự án thành công\", $H$=\"tôi sẽ vui\", $M$=\"bạn thay đổi phương pháp\". Tiền đề: $S\\to H$ và $S\\to M$ (\"chỉ khi\" cho $S\\to M$, không phải $M\\to S$). Kết luận $M\\to H$ sẽ cần $M\\to S$ (chiều ngược), điều này KHÔNG được cho. Đây là sự nhầm lẫn giữa điều kiện cần và điều kiện đủ -- lập luận không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many leaves in a full $m$-ary tree with $v$ vertices?|||Có bao nhiêu lá trong một cây $m$-phân đầy đủ với $v$ đỉnh?",
          "options": [
            {
              "text": "(m-1)v + 1|||(m-1)v + 1"
            },
            {
              "text": "(m-1)v|||(m-1)v"
            },
            {
              "text": "mv + 1|||mv + 1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "[(m-1)v + 1]/m|||[(m-1)v + 1]/m"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Let $i$ be internal vertices, $l$ leaves: $l=i(m-1)+1$ and $v=i+l$, so $i=v-l$. Substituting: $l=(v-l)(m-1)+1\\Rightarrow lm=(m-1)v+1\\Rightarrow l=\\frac{(m-1)v+1}{m}$.</div><div class=\"ml-vi\">Gọi $i$ là đỉnh trong, $l$ là lá: $l=i(m-1)+1$ và $v=i+l$, nên $i=v-l$. Thay vào: $l=(v-l)(m-1)+1\\Rightarrow lm=(m-1)v+1\\Rightarrow l=\\frac{(m-1)v+1}{m}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(n)$ be the statement \"$3^n=1$\". The domain consists of all non-negative integers. A proof of $\\forall nP(n)$ is as follows: (i) $P(0)$ is clearly true. (ii) Assume that $P(0),\\ldots,P(k)$ are true for some non-negative integer $k$. (iii) We have: $3^{k+1}=3^{2k}/3^{k-1}=3^k\\cdot3^k/3^{k-1}=1\\cdot1/1=1$. Thus $P(k+1)$ is true. By strong induction, we conclude $\\forall nP(n)$. Which step is wrong in this proof?|||Cho $P(n)$ là mệnh đề \"$3^n=1$\". Miền là mọi số nguyên không âm. Một chứng minh cho $\\forall nP(n)$ như sau: (i) $P(0)$ hiển nhiên đúng. (ii) Giả sử $P(0),\\ldots,P(k)$ đúng với số nguyên không âm $k$ nào đó. (iii) Ta có: $3^{k+1}=3^{2k}/3^{k-1}=3^k\\cdot3^k/3^{k-1}=1\\cdot1/1=1$. Vậy $P(k+1)$ đúng. Theo quy nạp mạnh, ta kết luận $\\forall nP(n)$. Bước nào sai trong chứng minh này?",
          "options": [
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Step (iii) invokes $P(k-1)$ (i.e. $3^{k-1}=1$) to complete the algebra, but this requires $k-1\\ge0$, i.e. $k\\ge1$. When $k=0$ (the very first application, going from the base case to $P(1)$), $k-1=-1$ is NOT a valid non-negative integer and $P(-1)$ was never established -- the algebraic step silently breaks exactly at this transition, making the whole proof invalid despite each individual line looking plausible.</div><div class=\"ml-vi\">Bước (iii) viện dẫn $P(k-1)$ (tức $3^{k-1}=1$) để hoàn tất đại số, nhưng điều này đòi hỏi $k-1\\ge0$, tức $k\\ge1$. Khi $k=0$ (lần áp dụng đầu tiên, từ trường hợp cơ sở sang $P(1)$), $k-1=-1$ KHÔNG phải số nguyên không âm hợp lệ và $P(-1)$ chưa từng được thiết lập -- bước đại số âm thầm gãy đúng tại chuyển tiếp này, làm toàn bộ chứng minh không hợp lệ dù mỗi dòng riêng lẻ trông có vẻ hợp lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give the coding scheme $a$:001, $b$:0001, $e$:11, $r$:0000, $s$:0100, $t$:011, $x$:0101. Find the word represented by 011110101011|||Cho lược đồ mã hóa $a$:001, $b$:0001, $e$:11, $r$:0000, $s$:0100, $t$:011, $x$:0101. Tìm từ được biểu diễn bởi 011110101011",
          "options": [
            {
              "text": "test|||test"
            },
            {
              "text": "text|||text"
            },
            {
              "text": "tea|||tea"
            },
            {
              "text": "teat|||teat"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Decoding greedily: \"011\"=$t$, remaining \"110101011\"; \"11\"=$e$, remaining \"0101011\"; \"0101\"=$x$, remaining \"011\"; \"011\"=$t$. Result: $t,e,x,t$=\"text\".</div><div class=\"ml-vi\">Giải mã tham lam: \"011\"=$t$, còn lại \"110101011\"; \"11\"=$e$, còn lại \"0101011\"; \"0101\"=$x$, còn lại \"011\"; \"011\"=$t$. Kết quả: $t,e,x,t$=\"text\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute the value of the postfix notation $5\\ 6\\ 7\\ -\\ *$|||Tính giá trị của ký hiệu hậu tố $5\\ 6\\ 7\\ -\\ *$",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "-5|||-5"
            },
            {
              "text": "37|||37"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-37|||-37"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$6-7=-1$. Then $5\\times(-1)=-5$.</div><div class=\"ml-vi\">$6-7=-1$. Rồi $5\\times(-1)=-5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The number $n=326700000$ can be written uniquely as a product of powers of distinct primes, $n=a^x b^y c^z d^t$, where $a,b,c,d$ are primes. Find $x+y+z+t$.|||Số $n=326700000$ có thể viết duy nhất thành tích các lũy thừa của các số nguyên tố khác nhau, $n=a^x b^y c^z d^t$, với $a,b,c,d$ là số nguyên tố. Tìm $x+y+z+t$.",
          "options": [
            {
              "text": "17|||17"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "11|||11"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$n=3267\\times10^5$. $3267=3^3\\times11^2$. $10^5=2^5\\times5^5$. So $n=2^5\\times3^3\\times5^5\\times11^2$, giving exponents $5,3,5,2$, sum $=5+3+5+2=15$.</div><div class=\"ml-vi\">$n=3267\\times10^5$. $3267=3^3\\times11^2$. $10^5=2^5\\times5^5$. Vậy $n=2^5\\times3^3\\times5^5\\times11^2$, cho các số mũ $5,3,5,2$, tổng $=5+3+5+2=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the first 3 vertices when using Dijkstra's algorithm to find the shortest path from $A$ to $Z$. Edges: $AB{=}2,AC{=}9,BD{=}7,BC{=}8,BE{=}3,DE{=}4,DZ{=}2,CE{=}3,EZ{=}3$.|||Tìm 3 đỉnh đầu tiên khi dùng thuật toán Dijkstra tìm đường đi ngắn nhất từ $A$ đến $Z$. Các cạnh: $AB{=}2,AC{=}9,BD{=}7,BC{=}8,BE{=}3,DE{=}4,DZ{=}2,CE{=}3,EZ{=}3$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "A-B-C|||A-B-C"
            },
            {
              "text": "A-B-E|||A-B-E"
            },
            {
              "text": "A-B-D|||A-B-D"
            },
            {
              "text": "A-B-Z|||A-B-Z"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A$(0) first. Relax from $A$: $B=2,C=9$. Next smallest unvisited: $B$(2). Relax from $B$: $D=2+7=9$, $C=\\min(9,10)=9$, $E=2+3=5$. Next smallest unvisited: $E$(5). Order: $A,B,E$.</div><div class=\"ml-vi\">$A$(0) trước. Nới lỏng từ $A$: $B=2,C=9$. Tiếp theo nhỏ nhất chưa thăm: $B$(2). Nới lỏng từ $B$: $D=2+7=9$, $C=\\min(9,10)=9$, $E=2+3=5$. Tiếp theo nhỏ nhất chưa thăm: $E$(5). Thứ tự: $A,B,E$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the statement \"If you want to pass this course, then you should study hard and go to class regularly.\"|||Tìm phủ định của mệnh đề \"Nếu bạn muốn đậu môn này, thì bạn nên học chăm chỉ và đi học đều đặn.\"",
          "options": [
            {
              "text": "If you want to pass this course, then you should not study hard and should not go to class regularly.|||Nếu bạn muốn đậu môn này, thì bạn không nên học chăm chỉ và không nên đi học đều đặn."
            },
            {
              "text": "If you do not want to pass this course, then you should study hard and go to class regularly.|||Nếu bạn không muốn đậu môn này, thì bạn nên học chăm chỉ và đi học đều đặn."
            },
            {
              "text": "You want to pass this course, and you should not study hard or you should not go to class regularly.|||Bạn muốn đậu môn này, và bạn không nên học chăm chỉ hoặc bạn không nên đi học đều đặn."
            },
            {
              "text": "You do not want to pass this course, and you should study hard or you should go to class regularly.|||Bạn không muốn đậu môn này, và bạn nên học chăm chỉ hoặc bạn nên đi học đều đặn."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The statement is $p\\to(q\\land r)$. Its negation is $\\neg(p\\to(q\\land r))=p\\land\\neg(q\\land r)=p\\land(\\neg q\\lor\\neg r)$: \"You want to pass this course, AND you should not study hard OR you should not go to class regularly.\"</div><div class=\"ml-vi\">Mệnh đề là $p\\to(q\\land r)$. Phủ định là $\\neg(p\\to(q\\land r))=p\\land\\neg(q\\land r)=p\\land(\\neg q\\lor\\neg r)$: \"Bạn muốn đậu môn này, VÀ bạn không nên học chăm chỉ HOẶC bạn không nên đi học đều đặn.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the weight of a minimum spanning tree of the graph with vertices $A,B,C,D,E,F,G,H,I$ and edges $AF{=}1,AG{=}2,GB{=}3,BC{=}1,GC{=}3,GH{=}4,GI{=}1,HC{=}2,HD{=}2,IF{=}2,IE{=}3,ED{=}4$?|||Trọng số của cây khung nhỏ nhất trong đồ thị với các đỉnh $A,B,C,D,E,F,G,H,I$ và các cạnh $AF{=}1,AG{=}2,GB{=}3,BC{=}1,GC{=}3,GH{=}4,GI{=}1,HC{=}2,HD{=}2,IF{=}2,IE{=}3,ED{=}4$ là bao nhiêu?",
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "15|||15"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Kruskal's algorithm, increasing order: $AF(1)$ add, $BC(1)$ add, $GI(1)$ add, $AG(2)$ add (connects $\\{A,F\\}$+$\\{G,I\\}$), $HC(2)$ add (connects $H$ with $\\{B,C\\}$), $HD(2)$ add (connects $D$), $IF(2)$ skip (cycle), $GB(3)$ add (connects the two big components), $GC(3)$ skip, $IE(3)$ add (connects $E$) -- 8 edges span all 9 vertices. Total: $1+1+1+2+2+2+3+3=15$.</div><div class=\"ml-vi\">Thuật toán Kruskal, thứ tự tăng dần: $AF(1)$ thêm, $BC(1)$ thêm, $GI(1)$ thêm, $AG(2)$ thêm (nối $\\{A,F\\}$+$\\{G,I\\}$), $HC(2)$ thêm (nối $H$ với $\\{B,C\\}$), $HD(2)$ thêm (nối $D$), $IF(2)$ bỏ qua (chu trình), $GB(3)$ thêm (nối hai thành phần lớn), $GC(3)$ bỏ qua, $IE(3)$ thêm (nối $E$) -- 8 cạnh trải khắp 9 đỉnh. Tổng: $1+1+1+2+2+2+3+3=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Euclidean Algorithm: procedure gcd($a,b$: positive integers): $x:=a$; $y:=b$; while $y>0$: $r:=x\\bmod y$, $x:=y$, $y:=r$; return $x$ {$x$ is $\\gcd(a,b)$}. If $a=16,b=573$, after the second iteration of the loop, ___|||Cho thuật toán Euclid: procedure gcd($a,b$: positive integers): $x:=a$; $y:=b$; while $y>0$: $r:=x\\bmod y$, $x:=y$, $y:=r$; return $x$ {$x$ là $\\gcd(a,b)$}. Nếu $a=16,b=573$, sau lần lặp thứ hai của vòng lặp, ___",
          "options": [
            {
              "text": "x=35, y=13|||x=35, y=13"
            },
            {
              "text": "x=13, y=3|||x=13, y=3"
            },
            {
              "text": "x=35, y=16|||x=35, y=16"
            },
            {
              "text": "x=16, y=13|||x=16, y=13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$x=16,y=573$. Iter1: $r=16\\bmod573=16$, $x:=573,y:=16$. Iter2: $r=573\\bmod16$: $16\\times35=560$, $r=13$; $x:=16,y:=13$.</div><div class=\"ml-vi\">$x=16,y=573$. Lặp1: $r=16\\bmod573=16$, $x:=573,y:=16$. Lặp2: $r=573\\bmod16$: $16\\times35=560$, $r=13$; $x:=16,y:=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: procedure Ia($a_1,a_2,\\ldots,a_n$: integers): $m:=a_1$; $t:=0$; for $i:=2$ to $n$: if $(a_i\\ge m)$ then $m:=a_i$, $t:=t+1$. If input is the list $[1,2,3,6,7,7,4,8,8,6]$, then how many additions are used?|||Cho thuật toán: procedure Ia($a_1,a_2,\\ldots,a_n$: integers): $m:=a_1$; $t:=0$; for $i:=2$ to $n$: nếu $(a_i\\ge m)$ thì $m:=a_i$, $t:=t+1$. Nếu đầu vào là dãy $[1,2,3,6,7,7,4,8,8,6]$, cần bao nhiêu phép cộng?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Trace with $m=1,t=0$: $2\\ge1\\to t{=}1$; $3\\ge2\\to t{=}2$; $6\\ge3\\to t{=}3$; $7\\ge6\\to t{=}4$; $7\\ge7\\to t{=}5$; $4\\ge7$ no; $8\\ge7\\to t{=}6$; $8\\ge8\\to t{=}7$; $6\\ge8$ no. Each $t:=t+1$ is one addition, total 7.</div><div class=\"ml-vi\">Theo dõi với $m=1,t=0$: $2\\ge1\\to t{=}1$; $3\\ge2\\to t{=}2$; $6\\ge3\\to t{=}3$; $7\\ge6\\to t{=}4$; $7\\ge7\\to t{=}5$; $4\\ge7$ không; $8\\ge7\\to t{=}6$; $8\\ge8\\to t{=}7$; $6\\ge8$ không. Mỗi $t:=t+1$ là một phép cộng, tổng 7.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{a,b,c,d,e,f,g,h,i,j\\}$. Given the subsets $A=\\{a,c,d,e,i\\}$, $B=\\{a,f,g,h,j\\}$. The bit string representing the union of $A$ and $B$ is ___|||Cho $U=\\{a,b,c,d,e,f,g,h,i,j\\}$. Cho các tập con $A=\\{a,c,d,e,i\\}$, $B=\\{a,f,g,h,j\\}$. Chuỗi bit biểu diễn hợp của $A$ và $B$ là ___",
          "options": [
            {
              "text": "11 0111 1111|||11 0111 1111"
            },
            {
              "text": "10 1111 1111|||10 1111 1111"
            },
            {
              "text": "10 1011 1111|||10 1011 1111"
            },
            {
              "text": "10 1111 1011|||10 1111 1011"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$A\\cup B=\\{a,c,d,e,f,g,h,i,j\\}$ -- every element except $b$. Reading positions $a,b,c,d,e,f,g,h,i,j$: $1,0,1,1,1,1,1,1,1,1=$ \"10 1111 1111\".</div><div class=\"ml-vi\">$A\\cup B=\\{a,c,d,e,f,g,h,i,j\\}$ -- mọi phần tử trừ $b$. Đọc vị trí $a,b,c,d,e,f,g,h,i,j$: $1,0,1,1,1,1,1,1,1,1=$ \"10 1111 1111\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$=\"x is a student\", $Q(x,y)$=\"x knows the programming language y\". Translate the sentence into a logical expression: \"Every student knows some programming language\". (i) $\\forall y\\exists x(P(x)\\to Q(x,y))$ (ii) $\\forall x\\exists y(P(x)\\to Q(x,y))$ (iii) $\\forall x\\exists y(P(x)\\land Q(x,y))$ (iv) $\\forall y\\exists x(P(x)\\land Q(x,y))$|||Cho $P(x)$=\"x là sinh viên\", $Q(x,y)$=\"x biết ngôn ngữ lập trình y\". Diễn đạt câu sau thành biểu thức logic: \"Mọi sinh viên đều biết một ngôn ngữ lập trình nào đó\". (i) $\\forall y\\exists x(P(x)\\to Q(x,y))$ (ii) $\\forall x\\exists y(P(x)\\to Q(x,y))$ (iii) $\\forall x\\exists y(P(x)\\land Q(x,y))$ (iv) $\\forall y\\exists x(P(x)\\land Q(x,y))$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The natural translation is $\\forall x(P(x)\\to\\exists yQ(x,y))$. Since $P(x)$ doesn't involve $y$, this is logically equivalent to $\\forall x\\exists y(P(x)\\to Q(x,y))$ (moving $\\exists y$ inward past an antecedent not containing $y$ preserves truth value), option (ii).</div><div class=\"ml-vi\">Diễn đạt tự nhiên là $\\forall x(P(x)\\to\\exists yQ(x,y))$. Vì $P(x)$ không chứa $y$, điều này tương đương logic với $\\forall x\\exists y(P(x)\\to Q(x,y))$ (đưa $\\exists y$ vào trong qua một tiền đề không chứa $y$ giữ nguyên giá trị chân lý), đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the height of spanning tree obtained from $W_{100}$ by the Depth-first search, starting at the vertex of degree 100?|||Chiều cao của cây khung thu được từ $W_{100}$ bằng tìm kiếm theo chiều sâu, bắt đầu tại đỉnh bậc 100, là bao nhiêu?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "100|||100"
            },
            {
              "text": "99|||99"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Starting at the hub (degree 100, connected to all 100 rim vertices), DFS goes to a first rim vertex, then follows the rim cycle to an unvisited neighbor each time (since each rim vertex connects to 2 cycle-neighbors plus the hub), traversing the entire 100-vertex cycle as one deep path before backtracking. This reaches depth 100 at the last rim vertex visited.</div><div class=\"ml-vi\">Bắt đầu tại trung tâm (bậc 100, nối với cả 100 đỉnh vành), DFS đi đến đỉnh vành đầu tiên, rồi theo chu trình vành đến hàng xóm chưa thăm mỗi lần (vì mỗi đỉnh vành nối với 2 hàng xóm chu trình cộng trung tâm), đi qua toàn bộ chu trình 100 đỉnh như một đường sâu duy nhất trước khi quay lui. Điều này đạt độ sâu 100 tại đỉnh vành cuối cùng được thăm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the least common multiple of $11\\cdot13^3\\cdot17^2$ and $2^7\\cdot5^2\\cdot9^2\\cdot11^2$? (i) $2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$ (ii) $2^7\\cdot5^3\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$ (iii) $11$ (iv) $11^2$|||Bội chung nhỏ nhất của $11\\cdot13^3\\cdot17^2$ và $2^7\\cdot5^2\\cdot9^2\\cdot11^2$ là gì? (i) $2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$ (ii) $2^7\\cdot5^3\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$ (iii) $11$ (iv) $11^2$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">LCM takes the max exponent of each prime across both numbers: $2^{\\max(0,7)}5^{\\max(0,2)}9^{\\max(0,2)}11^{\\max(1,2)}13^{\\max(3,0)}17^{\\max(2,0)}=2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$, option (i).</div><div class=\"ml-vi\">BCNN lấy số mũ lớn nhất của mỗi số nguyên tố ở cả hai số: $2^{\\max(0,7)}5^{\\max(0,2)}9^{\\max(0,2)}11^{\\max(1,2)}13^{\\max(3,0)}17^{\\max(2,0)}=2^7\\cdot5^2\\cdot9^2\\cdot11^2\\cdot13^3\\cdot17^2$, đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Insertion sort algorithm: Procedure Insertionsort($a_1,a_2,\\ldots,a_n$: integer): for $i=2$ to $n$ do: $j:=1$; while $a_j<a_i$ do $j:=j+1$; $temp:=a_i$; for $k:=i$ down to $j+1$ do $a_k:=a_{k-1}$; $a_j:=temp$. If input = 3, 2, 4, 7, 1, 6, 5, after running the outer loop with $i=5$, the order of the elements in the list is ___|||Cho thuật toán sắp xếp chèn: Procedure Insertionsort($a_1,a_2,\\ldots,a_n$: integer): for $i=2$ to $n$ do: $j:=1$; while $a_j<a_i$ do $j:=j+1$; $temp:=a_i$; for $k:=i$ down to $j+1$ do $a_k:=a_{k-1}$; $a_j:=temp$. Nếu đầu vào = 3, 2, 4, 7, 1, 6, 5, sau khi chạy vòng lặp ngoài với $i=5$, thứ tự các phần tử trong danh sách là ___",
          "options": [
            {
              "text": "1, 2, 3, 4, 6, 7, 5|||1, 2, 3, 4, 6, 7, 5"
            },
            {
              "text": "1, 2, 3, 7, 4, 6, 5|||1, 2, 3, 7, 4, 6, 5"
            },
            {
              "text": "1, 2, 3, 4, 7, 5, 6|||1, 2, 3, 4, 7, 5, 6"
            },
            {
              "text": "1, 2, 3, 4, 7, 6, 5|||1, 2, 3, 4, 7, 6, 5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$i=2$: insert 2 into [3] $\\to$ [2,3,4,7,1,6,5]. $i=3$: insert 4, already in place $\\to$ unchanged. $i=4$: insert 7, already in place $\\to$ unchanged. $i=5$: insert 1 into [2,3,4,7] $\\to$ shifts all, giving [1,2,3,4,7,6,5].</div><div class=\"ml-vi\">$i=2$: chèn 2 vào [3] $\\to$ [2,3,4,7,1,6,5]. $i=3$: chèn 4, đã đúng chỗ $\\to$ không đổi. $i=4$: chèn 7, đã đúng chỗ $\\to$ không đổi. $i=5$: chèn 1 vào [2,3,4,7] $\\to$ đẩy hết, cho [1,2,3,4,7,6,5].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a=131\\text{ div }37$ and $b=-131\\text{ div }37$. Find $a-b$.|||Cho $a=131\\text{ div }37$ và $b=-131\\text{ div }37$. Tìm $a-b$.",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "-4|||-4"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$131=37(3)+20$, so $a=3$. $-131\\text{ div }37=\\lfloor-131/37\\rfloor=\\lfloor-3.54\\rfloor=-4$, so $b=-4$. $a-b=3-(-4)=7$.</div><div class=\"ml-vi\">$131=37(3)+20$, nên $a=3$. $-131\\text{ div }37=\\lfloor-131/37\\rfloor=\\lfloor-3.54\\rfloor=-4$, nên $b=-4$. $a-b=3-(-4)=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $X=\\{\\emptyset,\\{\\emptyset\\},\\{a,c\\}\\}$, $Y=\\{y,\\{z,z\\},y\\}$. How many functions are there from $Y$ to $X$?|||Cho $X=\\{\\emptyset,\\{\\emptyset\\},\\{a,c\\}\\}$, $Y=\\{y,\\{z,z\\},y\\}$. Có bao nhiêu hàm từ $Y$ đến $X$?",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">As sets, $X=\\{\\emptyset,\\{\\emptyset\\},\\{a,c\\}\\}$ has 3 distinct elements, and $Y=\\{y,\\{z\\},y\\}=\\{y,\\{z\\}\\}$ (duplicates removed) has 2 distinct elements. Number of functions from $Y$ to $X$: $|X|^{|Y|}=3^2=9$.</div><div class=\"ml-vi\">Là tập hợp, $X=\\{\\emptyset,\\{\\emptyset\\},\\{a,c\\}\\}$ có 3 phần tử phân biệt, và $Y=\\{y,\\{z\\},y\\}=\\{y,\\{z\\}\\}$ (bỏ trùng lặp) có 2 phần tử phân biệt. Số hàm từ $Y$ đến $X$: $|X|^{|Y|}=3^2=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a recursive formula for the sequence $a_n=1/n$, $n=1,2,3,\\ldots$ (i) $a_1=1,a_{n+1}=a_n+\\frac1{n+1}$ (ii) $a_1=1,a_{n+1}=\\frac1{a_n+1}$ (iii) $a_1=1,a_{n+1}=\\frac{a_n}{a_n+1}$|||Tìm công thức đệ quy cho dãy $a_n=1/n$, $n=1,2,3,\\ldots$ (i) $a_1=1,a_{n+1}=a_n+\\frac1{n+1}$ (ii) $a_1=1,a_{n+1}=\\frac1{a_n+1}$ (iii) $a_1=1,a_{n+1}=\\frac{a_n}{a_n+1}$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Testing (iii): if $a_n=1/n$, then $a_n/(a_n+1)=(1/n)/((n+1)/n)=1/(n+1)=a_{n+1}$ -- matches for all $n$. (i) fails at $n=1$: $a_2=1+1/2=1.5\\neq1/2$. (ii) fails at $n=2$: $a_3=1/(0.5+1)=2/3\\neq1/3$.</div><div class=\"ml-vi\">Kiểm (iii): nếu $a_n=1/n$, thì $a_n/(a_n+1)=(1/n)/((n+1)/n)=1/(n+1)=a_{n+1}$ -- khớp với mọi $n$. (i) sai tại $n=1$: $a_2=1+1/2=1.5\\neq1/2$. (ii) sai tại $n=2$: $a_3=1/(0.5+1)=2/3\\neq1/3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f$ is defined recursively by $f(1)=2,f(2)=3$ and $f(n)=3f(n-1)+f(n-2)$ for $n\\ge3$. Find $f(6)$.|||Giả sử $f$ được định nghĩa đệ quy bởi $f(1)=2,f(2)=3$ và $f(n)=3f(n-1)+f(n-2)$ với $n\\ge3$. Tìm $f(6)$.",
          "options": [
            {
              "text": "119|||119"
            },
            {
              "text": "99|||99"
            },
            {
              "text": "327|||327"
            },
            {
              "text": "393|||393"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=3(3)+2=11$. $f(4)=3(11)+3=36$. $f(5)=3(36)+11=119$. $f(6)=3(119)+36=393$.</div><div class=\"ml-vi\">$f(3)=3(3)+2=11$. $f(4)=3(11)+3=36$. $f(5)=3(36)+11=119$. $f(6)=3(119)+36=393$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume that the domain of $x$ consists of all real numbers. Which proposition is FALSE? (i) $\\exists x(x^2=2)$ (ii) $\\exists x(x^2=-1)$ (iii) $\\exists x(x^2=x)$ (iv) $\\exists x(x^2<x)$|||Giả sử miền của $x$ là mọi số thực. Mệnh đề nào SAI? (i) $\\exists x(x^2=2)$ (ii) $\\exists x(x^2=-1)$ (iii) $\\exists x(x^2=x)$ (iv) $\\exists x(x^2<x)$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) true: $x=\\sqrt2$. (iii) true: $x=0$ or $x=1$. (iv) true: $x=0.5$ gives $0.25<0.5$. (ii) is FALSE: no real number squared equals $-1$ (would require an imaginary number).</div><div class=\"ml-vi\">(i) đúng: $x=\\sqrt2$. (iii) đúng: $x=0$ hoặc $x=1$. (iv) đúng: $x=0.5$ cho $0.25<0.5$. (ii) SAI: không số thực nào bình phương bằng $-1$ (cần số ảo).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D9",
      "source": "REAL",
      "sortOrder": 209,
      "title": "Final Exam — Đề 9|||Thi cuối kỳ — Đề 9",
      "description": "MAD101 Final Exam, Đề 9 (48 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 9 (48 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 96,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a proposition with the given truth table: $p{=}T,q{=}T\\to F$; $p{=}T,q{=}F\\to F$; $p{=}F,q{=}T\\to T$; $p{=}F,q{=}F\\to T$. (i) $(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)$ (ii) $\\neg p\\land q$ (iii) $q\\lor(\\neg p\\land\\neg q)$|||Tìm mệnh đề có bảng chân trị cho trước: $p{=}T,q{=}T\\to F$; $p{=}T,q{=}F\\to F$; $p{=}F,q{=}T\\to T$; $p{=}F,q{=}F\\to T$. (i) $(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)$ (ii) $\\neg p\\land q$ (iii) $q\\lor(\\neg p\\land\\neg q)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The table is exactly $\\neg p$. $(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)=\\neg p\\land(q\\lor\\neg q)=\\neg p\\land T=\\neg p$ -- matches. (ii) fails at $p{=}F,q{=}F$: gives $F$, table wants $T$. (iii) fails at $p{=}T,q{=}T$: gives $T$, table wants $F$.</div><div class=\"ml-vi\">Bảng chính là $\\neg p$. $(\\neg p\\land q)\\lor(\\neg p\\land\\neg q)=\\neg p\\land(q\\lor\\neg q)=\\neg p\\land T=\\neg p$ -- khớp. (ii) sai tại $p{=}F,q{=}F$: cho $F$, bảng cần $T$. (iii) sai tại $p{=}T,q{=}T$: cho $T$, bảng cần $F$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the statement \"I will remember to send you the address only if you send me an e-mail message.\"|||Tìm phủ định của mệnh đề \"Tôi sẽ nhớ gửi bạn địa chỉ chỉ khi bạn gửi tôi một email.\"",
          "options": [
            {
              "text": "If I will not remember to send you the address, then you do not send me an e-mail message.|||Nếu tôi sẽ không nhớ gửi bạn địa chỉ, thì bạn không gửi tôi email."
            },
            {
              "text": "You do not send me an e-mail message and I will not remember to send you the address.|||Bạn không gửi tôi email và tôi sẽ không nhớ gửi bạn địa chỉ."
            },
            {
              "text": "If you do not send me an e-mail message, then I will not remember to send you the address.|||Nếu bạn không gửi tôi email, thì tôi sẽ không nhớ gửi bạn địa chỉ."
            },
            {
              "text": "You do not send me an e-mail message but I remember to send you the address.|||Bạn không gửi tôi email nhưng tôi nhớ gửi bạn địa chỉ."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"$p$ only if $q$\" translates to $p\\to q$. Its negation is $\\neg(p\\to q)=p\\land\\neg q$: \"I remember to send the address AND you do not send me an e-mail\" -- same as \"You do not send me an e-mail message but I remember to send you the address.\"</div><div class=\"ml-vi\">\"$p$ chỉ khi $q$\" diễn đạt thành $p\\to q$. Phủ định của nó là $\\neg(p\\to q)=p\\land\\neg q$: \"Tôi nhớ gửi địa chỉ VÀ bạn không gửi email\" -- giống với \"Bạn không gửi tôi email nhưng tôi nhớ gửi bạn địa chỉ.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be a propositional function on $\\{1,2,3\\}$. Find a proposition that is logically equivalent to $\\forall x\\neg P(x)$. (i) $P(1)\\land P(2)\\land P(3)$ (ii) $\\neg P(1)\\land\\neg P(2)\\land\\neg P(3)$ (iii) $P(1)\\lor P(2)\\lor P(3)$ (iv) $\\neg P(1)\\lor\\neg P(2)\\lor\\neg P(3)$|||Cho $P(x)$ là hàm mệnh đề trên $\\{1,2,3\\}$. Tìm mệnh đề tương đương logic với $\\forall x\\neg P(x)$. (i) $P(1)\\land P(2)\\land P(3)$ (ii) $\\neg P(1)\\land\\neg P(2)\\land\\neg P(3)$ (iii) $P(1)\\lor P(2)\\lor P(3)$ (iv) $\\neg P(1)\\lor\\neg P(2)\\lor\\neg P(3)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\forall x\\neg P(x)$ over the finite domain $\\{1,2,3\\}$ expands directly to $\\neg P(1)\\land\\neg P(2)\\land\\neg P(3)$, option (ii). Note this question's negation ($\\forall x\\neg P(x)$ is itself equivalent to $\\neg\\exists xP(x)$, but the question here asks for the direct expansion, not a negation.</div><div class=\"ml-vi\">$\\forall x\\neg P(x)$ trên miền hữu hạn $\\{1,2,3\\}$ khai triển trực tiếp thành $\\neg P(1)\\land\\neg P(2)\\land\\neg P(3)$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the proposition $\\exists x(P(x)\\to Q(x))$. (i) $\\forall x(Q(x)\\to P(x))$ (ii) $\\forall x(\\neg Q(x)\\to P(x))$ (iii) $\\forall x(\\neg Q(x)\\land P(x))$ (iv) $\\forall x(\\neg Q(x)\\land\\neg P(x))$|||Tìm phủ định của mệnh đề $\\exists x(P(x)\\to Q(x))$. (i) $\\forall x(Q(x)\\to P(x))$ (ii) $\\forall x(\\neg Q(x)\\to P(x))$ (iii) $\\forall x(\\neg Q(x)\\land P(x))$ (iv) $\\forall x(\\neg Q(x)\\land\\neg P(x))$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\neg\\exists x(P(x)\\to Q(x))=\\forall x\\neg(P(x)\\to Q(x))=\\forall x(P(x)\\land\\neg Q(x))$, which equals $\\forall x(\\neg Q(x)\\land P(x))$, option (iii).</div><div class=\"ml-vi\">$\\neg\\exists x(P(x)\\to Q(x))=\\forall x\\neg(P(x)\\to Q(x))=\\forall x(P(x)\\land\\neg Q(x))$, bằng $\\forall x(\\neg Q(x)\\land P(x))$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x,y$ represent students in a class. Let $M(x,y)$=\"x sent an email to y\", $T(x,y)$=\"x called y\". Translate the sentence into a logical expression: \"Each student in class either received an email or a call from some other student in class\". (i) $\\forall x\\forall y[(x\\neq y)\\land(M(x,y)\\lor T(x,y))]$ (ii) $\\forall x\\exists y[(x\\neq y)\\land(M(x,y)\\lor T(x,y))]$ (iii) $\\forall x\\exists y[(x\\neq y)\\to(M(x,y)\\lor T(x,y))]$ (iv) $\\forall x\\exists y[(x\\neq y)\\lor(M(x,y)\\land T(x,y))]$|||Cho $x,y$ đại diện sinh viên trong lớp. Cho $M(x,y)$=\"x gửi email cho y\", $T(x,y)$=\"x gọi cho y\". Diễn đạt câu sau thành biểu thức logic: \"Mỗi sinh viên trong lớp đều nhận được email hoặc cuộc gọi từ sinh viên khác trong lớp\". (i) $\\forall x\\forall y[(x\\neq y)\\land(M(x,y)\\lor T(x,y))]$ (ii) $\\forall x\\exists y[(x\\neq y)\\land(M(x,y)\\lor T(x,y))]$ (iii) $\\forall x\\exists y[(x\\neq y)\\to(M(x,y)\\lor T(x,y))]$ (iv) $\\forall x\\exists y[(x\\neq y)\\lor(M(x,y)\\land T(x,y))]$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">\"Each student ... received from SOME other student\" needs $\\forall x\\exists y$, joined with \"and\" since we need $y$ to be different from $x$ AND to have emailed or called: $\\forall x\\exists y[(x\\neq y)\\land(M(x,y)\\lor T(x,y))]$, option (ii). Note the direction is reversed from sender to receiver but the structure matches.</div><div class=\"ml-vi\">\"Mỗi sinh viên ... nhận được từ MỘT sinh viên khác\" cần $\\forall x\\exists y$, nối bằng \"và\" vì cần $y$ khác $x$ VÀ đã gửi email hoặc gọi: $\\forall x\\exists y[(x\\neq y)\\land(M(x,y)\\lor T(x,y))]$, đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $Q(x,y)$=\"$x+y=0$\" on the set of integers. Which proposition is TRUE? (i) $\\exists x\\forall yQ(x,y)$ (ii) $\\forall x\\exists yQ(x,y)$ (iii) $\\forall x\\forall yQ(x,y)$ (iv) $\\exists y\\forall xQ(x,y)$|||Cho $Q(x,y)$=\"$x+y=0$\" trên tập số nguyên. Mệnh đề nào ĐÚNG? (i) $\\exists x\\forall yQ(x,y)$ (ii) $\\forall x\\exists yQ(x,y)$ (iii) $\\forall x\\forall yQ(x,y)$ (iv) $\\exists y\\forall xQ(x,y)$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">(i),(iii),(iv) are all false (no single $x$ or $y$ works for all counterparts, and not all pairs sum to 0). (ii) is true: for every $x$, choosing $y=-x$ satisfies $x+y=0$.</div><div class=\"ml-vi\">(i),(iii),(iv) đều sai (không có $x$ hay $y$ đơn lẻ nào thỏa mọi trường hợp còn lại, và không phải mọi cặp đều có tổng 0). (ii) đúng: với mọi $x$, chọn $y=-x$ thỏa $x+y=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine whether each of these arguments is valid: (i) If x is a real number such that x>2, then x²>4. Suppose that x²>4. Then x>2. (ii) If x is a real number with x<-2, then x²>4. Suppose that x²≤4. Then x≥-2. (iii) If x is a real number with x>2, then x²>4. Suppose that x≤2. Then x²≤4.|||Xác định xem mỗi lập luận sau có hợp lệ không: (i) Nếu x là số thực với x>2, thì x²>4. Giả sử x²>4. Vậy x>2. (ii) Nếu x là số thực với x<-2, thì x²>4. Giả sử x²≤4. Vậy x≥-2. (iii) Nếu x là số thực với x>2, thì x²>4. Giả sử x≤2. Vậy x²≤4.",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) affirms the consequent ($p\\to q$, $q$, therefore $p$) -- invalid (e.g. $x=-3$: $x^2>4$ true but $x>2$ false). (iii) denies the antecedent ($p\\to q$, $\\neg p$, therefore $\\neg q$) -- invalid (same counterexample $x=-3$: $x\\le2$ true but $x^2>4$). (ii) is exactly modus tollens ($p\\to q$, $\\neg q$, therefore $\\neg p$, with $p$=\"$x<-2$\", $q$=\"$x^2>4$\") -- valid.</div><div class=\"ml-vi\">(i) khẳng định hệ quả ($p\\to q$, $q$, vậy $p$) -- không hợp lệ (vd $x=-3$: $x^2>4$ đúng nhưng $x>2$ sai). (iii) phủ định tiền đề ($p\\to q$, $\\neg p$, vậy $\\neg q$) -- không hợp lệ (cùng phản ví dụ $x=-3$: $x\\le2$ đúng nhưng $x^2>4$). (ii) chính xác là modus tollens ($p\\to q$, $\\neg q$, vậy $\\neg p$, với $p$=\"$x<-2$\", $q$=\"$x^2>4$\") -- hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{a,b,c,d,e,f,g,h,i,j\\}$ and the subsets $A=\\{a,c,d,e,g,i\\}$, $B=\\{a,f,g,j\\}$. Find bit string representing the intersection of $A$ and $B$, in the given order of the elements of $U$.|||Cho $U=\\{a,b,c,d,e,f,g,h,i,j\\}$ và các tập con $A=\\{a,c,d,e,g,i\\}$, $B=\\{a,f,g,j\\}$. Tìm chuỗi bit biểu diễn giao của $A$ và $B$, theo thứ tự các phần tử của $U$.",
          "options": [
            {
              "text": "10 0000 0100|||10 0000 0100"
            },
            {
              "text": "10 0000 0010|||10 0000 0010"
            },
            {
              "text": "10 0000 1000|||10 0000 1000"
            },
            {
              "text": "10 0001 0000|||10 0001 0000"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A\\cap B=\\{a,g\\}$. Reading positions $a,b,c,d,e,f,g,h,i,j$: $1,0,0,0,0,0,1,0,0,0=$\"10 0000 1000\".</div><div class=\"ml-vi\">$A\\cap B=\\{a,g\\}$. Đọc vị trí $a,b,c,d,e,f,g,h,i,j$: $1,0,0,0,0,0,1,0,0,0=$\"10 0000 1000\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is an infinite set? ($x$ is an integer) (i) $\\{x\\mid x<2\\lor x>10\\}$ (ii) $\\{x\\mid x<2\\land x>1\\}$ (iii) $\\{x\\mid x\\ge3\\land x\\le6\\}$ (iv) $\\{$letters in the alphabet$\\}$|||Tập nào sau đây là tập vô hạn? ($x$ là số nguyên) (i) $\\{x\\mid x<2\\lor x>10\\}$ (ii) $\\{x\\mid x<2\\land x>1\\}$ (iii) $\\{x\\mid x\\ge3\\land x\\le6\\}$ (iv) $\\{$chữ cái trong bảng chữ cái$\\}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i) is unbounded on both sides ($x\\to-\\infty$ or $x\\to\\infty$) -- infinite. (ii) has no integer solutions (empty). (iii) is $\\{3,4,5,6\\}$ -- finite. (iv) is 26 letters -- finite.</div><div class=\"ml-vi\">(i) không bị chặn cả hai phía ($x\\to-\\infty$ hoặc $x\\to\\infty$) -- vô hạn. (ii) không có nghiệm nguyên nào (rỗng). (iii) là $\\{3,4,5,6\\}$ -- hữu hạn. (iv) là 26 chữ cái -- hữu hạn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A,B,C$ be nonempty sets such that $A\\times B\\subseteq B\\times C$. Choose the correct statement. (i) $A\\subseteq B\\subseteq C$ (ii) $B\\subseteq C\\subseteq A$ (iii) $C\\subseteq B\\subseteq A$|||Cho $A,B,C$ là các tập khác rỗng sao cho $A\\times B\\subseteq B\\times C$. Chọn phát biểu đúng. (i) $A\\subseteq B\\subseteq C$ (ii) $B\\subseteq C\\subseteq A$ (iii) $C\\subseteq B\\subseteq A$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For any $a\\in A,b\\in B$, $(a,b)\\in A\\times B\\subseteq B\\times C$ means $a\\in B$ and $b\\in C$. Since this holds for all $a\\in A$, $A\\subseteq B$. Since it holds for all $b\\in B$, $B\\subseteq C$. So $A\\subseteq B\\subseteq C$.</div><div class=\"ml-vi\">Với mọi $a\\in A,b\\in B$, $(a,b)\\in A\\times B\\subseteq B\\times C$ nghĩa là $a\\in B$ và $b\\in C$. Vì điều này đúng với mọi $a\\in A$, $A\\subseteq B$. Vì đúng với mọi $b\\in B$, $B\\subseteq C$. Vậy $A\\subseteq B\\subseteq C$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which rules are functions? (i) $f:Z\\to R$, $f(x)=1/(x^2-5)$ (ii) $f:Z\\to Z$, $f(x)=1/(x^2-5)$ (iii) $f:Z\\to Z$, $f(x)=1/(x^2-4)$ (iv) $f:Z\\to R$, $f(x)=1/(x^2-4)$|||Quy tắc nào là hàm? (i) $f:Z\\to R$, $f(x)=1/(x^2-5)$ (ii) $f:Z\\to Z$, $f(x)=1/(x^2-5)$ (iii) $f:Z\\to Z$, $f(x)=1/(x^2-4)$ (iv) $f:Z\\to R$, $f(x)=1/(x^2-4)$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(ii) fails: codomain $Z$ but output like $f(0)=-1/5$ isn't an integer. (iii),(iv) fail: undefined at $x=\\pm2$ (division by zero). (i): $x^2=5$ never happens for integer $x$ (5 isn't a perfect square), so it's defined everywhere, and the codomain $R$ accommodates any real output -- a valid function.</div><div class=\"ml-vi\">(ii) sai: miền giá trị $Z$ nhưng đầu ra như $f(0)=-1/5$ không phải số nguyên. (iii),(iv) sai: không xác định tại $x=\\pm2$ (chia cho 0). (i): $x^2=5$ không bao giờ xảy ra với $x$ nguyên (5 không phải số chính phương), nên xác định khắp nơi, và miền giá trị $R$ chứa được mọi đầu ra thực -- một hàm hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the composite function $(f\\circ g)(x)=f(g(x))$ given that $f(x)=2x$ and $g(x)=x^2$.|||Tìm hàm hợp $(f\\circ g)(x)=f(g(x))$ với $f(x)=2x$ và $g(x)=x^2$.",
          "options": [
            {
              "text": "$2x^2$|||$2x^2$"
            },
            {
              "text": "$x^2$|||$x^2$"
            },
            {
              "text": "$4x^2$|||$4x^2$"
            },
            {
              "text": "$3x^2$|||$3x^2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(f\\circ g)(x)=f(g(x))=f(x^2)=2x^2$.</div><div class=\"ml-vi\">$(f\\circ g)(x)=f(g(x))=f(x^2)=2x^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{a_n\\}$ be a geometric progression with the initial term $a=5$ and the common ratio $r=-2$. If we start at $n=0$, find the first four terms $a_0,a_1,a_2,a_3$.|||Cho $\\{a_n\\}$ là cấp số nhân với số hạng đầu $a=5$ và công bội $r=-2$. Nếu bắt đầu từ $n=0$, tìm bốn số hạng đầu $a_0,a_1,a_2,a_3$.",
          "options": [
            {
              "text": "5, -10, 20, -40|||5, -10, 20, -40"
            },
            {
              "text": "5, -10, -20, -40|||5, -10, -20, -40"
            },
            {
              "text": "5, 3, 1, -1|||5, 3, 1, -1"
            },
            {
              "text": "-10, 20, -40, 80|||-10, 20, -40, 80"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$a_n=5\\times(-2)^n$: $a_0=5$, $a_1=5(-2)=-10$, $a_2=5(4)=20$, $a_3=5(-8)=-40$.</div><div class=\"ml-vi\">$a_n=5\\times(-2)^n$: $a_0=5$, $a_1=5(-2)=-10$, $a_2=5(4)=20$, $a_3=5(-8)=-40$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Binary search algorithm: procedure Binarysearch($a_1<a_2<\\ldots<a_n$, $x$: integer): $i:=1$, $j:=n$; while $(i<j)$: $m:=\\lfloor(i+j)/2\\rfloor$, if $x>a_m$ then $i:=m+1$ else $j:=m$; if $x=a_i$ then location:=i else location:=0. If input $=2,4,5,7,8,9,10,13$ and $x=11$, after the third time of dividing into sublists, the sublist to be considered is ___|||Cho thuật toán Tìm kiếm nhị phân: procedure Binarysearch($a_1<a_2<\\ldots<a_n$, $x$: integer): $i:=1$, $j:=n$; while $(i<j)$: $m:=\\lfloor(i+j)/2\\rfloor$, if $x>a_m$ then $i:=m+1$ else $j:=m$; if $x=a_i$ then location:=i else location:=0. Nếu đầu vào $=2,4,5,7,8,9,10,13$ và $x=11$, sau lần chia thành các dãy con thứ ba, dãy con được xét là ___",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "10, 13|||10, 13"
            },
            {
              "text": "9, 10|||9, 10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$n=8$: $i=1,j=8$. 1st: $m=4$, $a_4=7<11$, $i:=5$. 2nd: $i=5,j=8$, $m=6$, $a_6=9<11$, $i:=7$. 3rd: $i=7,j=8$, $m=7$, $a_7=10<11$, $i:=8$. Now $i=j=8$, sublist is just $a_8=13$.</div><div class=\"ml-vi\">$n=8$: $i=1,j=8$. Lần 1: $m=4$, $a_4=7<11$, $i:=5$. Lần 2: $i=5,j=8$, $m=6$, $a_6=9<11$, $i:=7$. Lần 3: $i=7,j=8$, $m=7$, $a_7=10<11$, $i:=8$. Giờ $i=j=8$, dãy con chỉ còn $a_8=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Greedy Change-Making algorithm to make a change for 63 cents using quarters, nickels and pennies (1 quarter = 25 cents, 1 nickel = 5 cents, 1 penny = 1 cent). What is the total number of coins used?|||Dùng thuật toán Tham lam Đổi tiền để trả 63 cent bằng quarter, nickel và penny (1 quarter = 25 cent, 1 nickel = 5 cent, 1 penny = 1 cent). Tổng số đồng xu dùng là bao nhiêu?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$63=2(25)+13$ (2 quarters, remainder 13), $13=2(5)+3$ (2 nickels, remainder 3), $3=3(1)$ (3 pennies). Total: $2+2+3=7$.</div><div class=\"ml-vi\">$63=2(25)+13$ (2 quarter, dư 13), $13=2(5)+3$ (2 nickel, dư 3), $3=3(1)$ (3 penny). Tổng: $2+2+3=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the smallest integer $n$ such that the following function is $O(x^n)$: $f(x)=\\frac{\\log(x)x^3+7x^2+3}{x+1}$|||Tìm số nguyên nhỏ nhất $n$ sao cho hàm sau là $O(x^n)$: $f(x)=\\frac{\\log(x)x^3+7x^2+3}{x+1}$",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For large $x$, $f(x)\\approx\\frac{\\log(x)x^3}{x}=\\log(x)x^2$, which is NOT $O(x^2)$ (since $\\log x\\to\\infty$) but IS $O(x^3)$ (since $\\log x=O(x)$). Smallest integer $n=3$.</div><div class=\"ml-vi\">Với $x$ lớn, $f(x)\\approx\\frac{\\log(x)x^3}{x}=\\log(x)x^2$, KHÔNG phải $O(x^2)$ (vì $\\log x\\to\\infty$) nhưng LÀ $O(x^3)$ (vì $\\log x=O(x)$). Số nguyên nhỏ nhất $n=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: procedure X($n$: integer): $sum:=0$; for $i:=1$ to $n$ do for $j:=1$ to $(i*i)$ do $sum:=sum+i/j$; Print($sum$). If $n=6$, how many divisions are required?|||Cho thuật toán: procedure X($n$: integer): $sum:=0$; for $i:=1$ to $n$ do for $j:=1$ to $(i*i)$ do $sum:=sum+i/j$; Print($sum$). Nếu $n=6$, cần bao nhiêu phép chia?",
          "options": [
            {
              "text": "91|||91"
            },
            {
              "text": "55|||55"
            },
            {
              "text": "66|||66"
            },
            {
              "text": "37|||37"
            },
            {
              "text": "140|||140"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The inner loop runs $i^2$ times for each $i$, each iteration doing one division. Total divisions $=\\sum_{i=1}^{6}i^2=1+4+9+16+25+36=91$.</div><div class=\"ml-vi\">Vòng lặp trong chạy $i^2$ lần với mỗi $i$, mỗi lần lặp thực hiện một phép chia. Tổng số phép chia $=\\sum_{i=1}^{6}i^2=1+4+9+16+25+36=91$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many numbers in the set $\\{80,90,-80,-90\\}$ are congruent to 5 modulo 17?|||Có bao nhiêu số trong tập $\\{80,90,-80,-90\\}$ đồng dư với 5 theo modulo 17?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$80\\bmod17=12$ (no). $90\\bmod17=5$ (yes, $17\\times5=85$). $-80\\bmod17$: $-80+85=5$ (yes). $-90\\bmod17$: $-90+102=12$ (no). 2 numbers match.</div><div class=\"ml-vi\">$80\\bmod17=12$ (không). $90\\bmod17=5$ (có, $17\\times5=85$). $-80\\bmod17$: $-80+85=5$ (có). $-90\\bmod17$: $-90+102=12$ (không). 2 số khớp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the greatest common divisor of $2^3\\cdot3^2\\cdot5\\cdot7$ and $2^4\\cdot5^2\\cdot11^3$|||Tìm ước chung lớn nhất của $2^3\\cdot3^2\\cdot5\\cdot7$ và $2^4\\cdot5^2\\cdot11^3$",
          "options": [
            {
              "text": "2310|||2310"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "360|||360"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\gcd=2^{\\min(3,4)}3^{\\min(2,0)}5^{\\min(1,2)}7^{\\min(1,0)}11^{\\min(0,3)}=2^3\\cdot5=8\\times5=40$.</div><div class=\"ml-vi\">$\\gcd=2^{\\min(3,4)}3^{\\min(2,0)}5^{\\min(1,2)}7^{\\min(1,0)}11^{\\min(0,3)}=2^3\\cdot5=8\\times5=40$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the sum in binary representation $101110+110111$|||Tìm tổng theo biểu diễn nhị phân $101110+110111$",
          "options": [
            {
              "text": "1100101|||1100101"
            },
            {
              "text": "1100111|||1100111"
            },
            {
              "text": "1000101|||1000101"
            },
            {
              "text": "1010101|||1010101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$101110=46$, $110111=55$. $46+55=101$. Converting 101 to binary: $64+32+4+1=101$, giving $1100101$.</div><div class=\"ml-vi\">$101110=46$, $110111=55$. $46+55=101$. Đổi 101 sang nhị phân: $64+32+4+1=101$, cho $1100101$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\gcd(899,941)$.|||Tìm $\\gcd(899,941)$.",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "29|||29"
            },
            {
              "text": "31|||31"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Euclidean algorithm: $941=1(899)+42$; $899=21(42)+17$; $42=2(17)+8$; $17=2(8)+1$; $8=8(1)+0$. So $\\gcd=1$. (Indeed $899=29\\times31$ and $941$ is prime, sharing no common factor.) This doesn't match A-D, so the answer is E.</div><div class=\"ml-vi\">Thuật toán Euclid: $941=1(899)+42$; $899=21(42)+17$; $42=2(17)+8$; $17=2(8)+1$; $8=8(1)+0$. Vậy $\\gcd=1$. (Thật vậy $899=29\\times31$ và $941$ là số nguyên tố, không chia sẻ thừa số chung nào.) Điều này không khớp A-D, nên đáp án là E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the smallest integer $a$ such that for all integer $n\\ge a$ we have $n=6x+7y$, with $x$ and $y$ non-negative integers.|||Tìm số nguyên nhỏ nhất $a$ sao cho với mọi số nguyên $n\\ge a$ ta có $n=6x+7y$, với $x$ và $y$ là số nguyên không âm.",
          "options": [
            {
              "text": "30|||30"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "50|||50"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For coprime $6,7$, the Frobenius number (largest non-representable integer) is $6\\times7-6-7=29$. So every integer $n\\ge30$ is representable, and $29$ itself is not -- the smallest valid $a$ is 30.</div><div class=\"ml-vi\">Với $6,7$ nguyên tố cùng nhau, số Frobenius (số nguyên lớn nhất không biểu diễn được) là $6\\times7-6-7=29$. Vậy mọi số nguyên $n\\ge30$ đều biểu diễn được, còn $29$ thì không -- $a$ nhỏ nhất hợp lệ là 30.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S$ be the subset of the set of ordered pairs of integers defined recursively by: Basis step: $(0,0)\\in S$. Recursive step: If $(a,b)\\in S$, then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is NOT in $S$?|||Cho $S$ là tập con của tập các cặp số nguyên có thứ tự được định nghĩa đệ quy: Bước cơ sở: $(0,0)\\in S$. Bước đệ quy: nếu $(a,b)\\in S$, thì $(a+2,b+3)\\in S$ và $(a+3,b+2)\\in S$. Phần tử nào KHÔNG thuộc $S$?",
          "options": [
            {
              "text": "(10, 15)|||(10, 15)"
            },
            {
              "text": "(10, 10)|||(10, 10)"
            },
            {
              "text": "(10, 5)|||(10, 5)"
            },
            {
              "text": "(5, 5)|||(5, 5)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Any element is $(2x+3y,3x+2y)$ for non-negative integers $x,y$. $(10,15)$: $x=5,y=0$ works. $(10,10)$: $x=y=2$ works. $(5,5)$: $x=y=1$ works. $(10,5)$: solving $2x+3y=10,3x+2y=5$ gives $y=4,x=-1$ -- negative, no valid non-negative solution, so $(10,5)$ is NOT in $S$.</div><div class=\"ml-vi\">Bất kỳ phần tử nào cũng có dạng $(2x+3y,3x+2y)$ với $x,y$ nguyên không âm. $(10,15)$: $x=5,y=0$ được. $(10,10)$: $x=y=2$ được. $(5,5)$: $x=y=1$ được. $(10,5)$: giải $2x+3y=10,3x+2y=5$ cho $y=4,x=-1$ -- âm, không có nghiệm không âm hợp lệ, nên $(10,5)$ KHÔNG thuộc $S$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: Procedure AL($x$:integer, $n$: positive integer): If $n=1$ then $AL(x,n)=x$ else $AL(x,n)=AL(x,n-1)+x$. Find the value of $AL(3,6)$.|||Cho thuật toán đệ quy: Procedure AL($x$:integer, $n$: positive integer): Nếu $n=1$ thì $AL(x,n)=x$ ngược lại $AL(x,n)=AL(x,n-1)+x$. Tìm giá trị $AL(3,6)$.",
          "options": [
            {
              "text": "18|||18"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This computes $n\\times x$ (adding $x$ a total of $n$ times). $AL(3,6)=6\\times3=18$.</div><div class=\"ml-vi\">Đây tính $n\\times x$ (cộng $x$ tổng cộng $n$ lần). $AL(3,6)=6\\times3=18$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the recursive algorithm if input $n=5$: procedure TT($n$: integer): If $n=1$ then $f(1):=0$ else $f(n):=f(n-1)*n$;|||Tìm kết quả của thuật toán đệ quy nếu đầu vào $n=5$: procedure TT($n$: integer): Nếu $n=1$ thì $f(1):=0$ ngược lại $f(n):=f(n-1)*n$;",
          "options": [
            {
              "text": "-120|||-120"
            },
            {
              "text": "-240|||-240"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "240|||240"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=0$. Since anything multiplied by 0 is 0: $f(2)=0\\times2=0$, $f(3)=0$, $f(4)=0$, $f(5)=0$.</div><div class=\"ml-vi\">$f(1)=0$. Vì bất cứ gì nhân với 0 đều bằng 0: $f(2)=0\\times2=0$, $f(3)=0$, $f(4)=0$, $f(5)=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers not exceeding 999 are divisible by neither 3 nor 4?|||Có bao nhiêu số nguyên dương không vượt quá 999 chia hết cho cả 3 lẫn 4 đều không?",
          "options": [
            {
              "text": "500|||500"
            },
            {
              "text": "499|||499"
            },
            {
              "text": "453|||453"
            },
            {
              "text": "536|||536"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Divisible by 3: $\\lfloor999/3\\rfloor=333$. Divisible by 4: $\\lfloor999/4\\rfloor=249$. Divisible by 12: $\\lfloor999/12\\rfloor=83$. By inclusion-exclusion, divisible by 3 or 4: $333+249-83=499$. Neither: $999-499=500$.</div><div class=\"ml-vi\">Chia hết cho 3: $\\lfloor999/3\\rfloor=333$. Chia hết cho 4: $\\lfloor999/4\\rfloor=249$. Chia hết cho 12: $\\lfloor999/12\\rfloor=83$. Theo bù trừ, chia hết cho 3 hoặc 4: $333+249-83=499$. Không chia hết cho cả hai: $999-499=500$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 3-digit numbers are divisible by 2 or 3?|||Có bao nhiêu số 3 chữ số chia hết cho 2 hoặc 3?",
          "options": [
            {
              "text": "150|||150"
            },
            {
              "text": "300|||300"
            },
            {
              "text": "600|||600"
            },
            {
              "text": "200|||200"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">3-digit numbers range 100-999. Divisible by 2: $\\lfloor999/2\\rfloor-\\lfloor99/2\\rfloor=499-49=450$. Divisible by 3: $333-33=300$. Divisible by 6: $166-16=150$. Union: $450+300-150=600$.</div><div class=\"ml-vi\">Số 3 chữ số trong khoảng 100-999. Chia hết cho 2: $\\lfloor999/2\\rfloor-\\lfloor99/2\\rfloor=499-49=450$. Chia hết cho 3: $333-33=300$. Chia hết cho 6: $166-16=150$. Hợp: $450+300-150=600$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a sequence $\\{a_n\\}$ satisfying the recurrence relation $a_0=-1$, $a_n=a_{n-1}+2^n$ for $n=1,2,\\ldots$. Find $a_6$.|||Cho dãy $\\{a_n\\}$ thỏa hệ thức truy hồi $a_0=-1$, $a_n=a_{n-1}+2^n$ với $n=1,2,\\ldots$. Tìm $a_6$.",
          "options": [
            {
              "text": "121|||121"
            },
            {
              "text": "123|||123"
            },
            {
              "text": "125|||125"
            },
            {
              "text": "127|||127"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a_1=-1+2=1$. $a_2=1+4=5$. $a_3=5+8=13$. $a_4=13+16=29$. $a_5=29+32=61$. $a_6=61+64=125$.</div><div class=\"ml-vi\">$a_1=-1+2=1$. $a_2=1+4=5$. $a_3=5+8=13$. $a_4=13+16=29$. $a_5=29+32=61$. $a_6=61+64=125$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that the function $f$ satisfies the recurrence relation $f(n)=2f(\\sqrt n)+1$, $f(2)=1$. Find $f(256)$.|||Giả sử hàm $f$ thỏa hệ thức truy hồi $f(n)=2f(\\sqrt n)+1$, $f(2)=1$. Tìm $f(256)$.",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$256=2^8$. $f(4)=2f(2)+1=2(1)+1=3$. $f(16)=2f(4)+1=2(3)+1=7$. $f(256)=2f(16)+1=2(7)+1=15$.</div><div class=\"ml-vi\">$256=2^8$. $f(4)=2f(2)+1=2(1)+1=3$. $f(16)=2f(4)+1=2(3)+1=7$. $f(256)=2f(16)+1=2(7)+1=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graph is bipartite? Graph 1 is $C_6$ (a 6-cycle). Graph 2 is a square with one diagonal drawn (creating two triangles). Graph 3 is a quadrilateral with an extra vertex connected by two crossing diagonal edges.|||Đồ thị nào lưỡng phân? Đồ thị 1 là $C_6$ (chu trình 6). Đồ thị 2 là hình vuông với một đường chéo (tạo hai tam giác). Đồ thị 3 là tứ giác với một đỉnh phụ nối bằng hai cạnh chéo cắt nhau.",
          "options": [
            {
              "text": "Graph 2|||Đồ thị 2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Graph 1|||Đồ thị 1"
            },
            {
              "text": "Graph 3|||Đồ thị 3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$C_6$ is an even cycle -- always bipartite. Graph 2's diagonal creates a triangle (odd cycle) -- not bipartite. Graph 3's crossing diagonals to the extra vertex also create an odd cycle (triangle) -- not bipartite. Only Graph 1 is bipartite.</div><div class=\"ml-vi\">$C_6$ là chu trình chẵn -- luôn lưỡng phân. Đường chéo của đồ thị 2 tạo tam giác (chu trình lẻ) -- không lưỡng phân. Các đường chéo cắt nhau tới đỉnh phụ của đồ thị 3 cũng tạo chu trình lẻ (tam giác) -- không lưỡng phân. Chỉ đồ thị 1 lưỡng phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $G$ be an undirected graph with 6 vertices, in which 2 vertices are of degree 4 and 4 vertices are of degree 2. How many edges does $G$ have?|||Cho $G$ là đơn đồ thị vô hướng với 6 đỉnh, trong đó 2 đỉnh có bậc 4 và 4 đỉnh có bậc 2. $G$ có bao nhiêu cạnh?",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sum of degrees $=2(4)+4(2)=8+8=16$. Edges $=16/2=8$.</div><div class=\"ml-vi\">Tổng bậc $=2(4)+4(2)=8+8=16$. Số cạnh $=16/2=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given two 7-pointed star graphs (heptagrams), each drawn by connecting 7 vertices with a fixed skip pattern (one uses step 2, the other step 3), forming a single 7-cycle each since $\\gcd(2,7)=\\gcd(3,7)=1$. Are these two graphs isomorphic? If not, what is the reason?|||Cho hai đồ thị ngôi sao 7 cánh (heptagram), mỗi cái vẽ bằng cách nối 7 đỉnh theo một mẫu bỏ-cách cố định (một dùng bước 2, cái kia bước 3), tạo thành một chu trình 7 đỉnh duy nhất vì $\\gcd(2,7)=\\gcd(3,7)=1$. Hai đồ thị này có đẳng cấu không? Nếu không, lý do là gì?",
          "options": [
            {
              "text": "No, they are not isomorphic because they do not have the same number of connected components|||Không đẳng cấu vì không cùng số thành phần liên thông"
            },
            {
              "text": "No, they are not isomorphic because they do not have the same number of vertices of degree 2|||Không đẳng cấu vì không cùng số đỉnh bậc 2"
            },
            {
              "text": "No, they are not isomorphic because they do not have the same number of edges|||Không đẳng cấu vì không cùng số cạnh"
            },
            {
              "text": "Yes, they are isomorphic|||Có, chúng đẳng cấu"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Both graphs are connected 2-regular graphs on 7 vertices (each is literally a 7-cycle $C_7$, just drawn with different visual crossing patterns). Any two connected 2-regular graphs on the same number of vertices are isomorphic to the cycle $C_n$, hence isomorphic to each other -- yes, they are isomorphic.</div><div class=\"ml-vi\">Cả hai đồ thị đều là đồ thị 2-đều liên thông trên 7 đỉnh (mỗi cái thực chất là chu trình 7 đỉnh $C_7$, chỉ vẽ với mẫu cắt nhau khác nhau về hình ảnh). Hai đồ thị 2-đều liên thông bất kỳ trên cùng số đỉnh đều đẳng cấu với chu trình $C_n$, do đó đẳng cấu với nhau -- có, chúng đẳng cấu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given two undirected graphs with adjacency matrices $X$ (order 1-5): row1=[0,1,1,0,0], row2=[1,0,1,0,0], row3=[1,1,0,0,0], row4=[0,0,0,0,1], row5=[0,0,0,1,0]; and $Y$ (order 1-4): row1=[0,1,0,1], row2=[1,0,1,0], row3=[0,1,0,1], row4=[1,0,1,0]. Which graphs are bipartite?|||Cho hai đồ thị vô hướng với ma trận kề $X$ (thứ tự 1-5): hàng1=[0,1,1,0,0], hàng2=[1,0,1,0,0], hàng3=[1,1,0,0,0], hàng4=[0,0,0,0,1], hàng5=[0,0,0,1,0]; và $Y$ (thứ tự 1-4): hàng1=[0,1,0,1], hàng2=[1,0,1,0], hàng3=[0,1,0,1], hàng4=[1,0,1,0]. Đồ thị nào lưỡng phân?",
          "options": [
            {
              "text": "X and Y|||X và Y"
            },
            {
              "text": "X|||X"
            },
            {
              "text": "Y|||Y"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$X$ has vertices $\\{1,2,3\\}$ forming a triangle (1-2,1-3,2-3 all connected) -- an odd cycle, so $X$ is NOT bipartite. $Y$'s edges (1-2,2-3,3-4,4-1) form a 4-cycle $C_4$ -- an even cycle, bipartite with parts $\\{1,3\\},\\{2,4\\}$. Only $Y$ is bipartite.</div><div class=\"ml-vi\">$X$ có các đỉnh $\\{1,2,3\\}$ tạo tam giác (1-2,1-3,2-3 đều nối) -- chu trình lẻ, nên $X$ KHÔNG lưỡng phân. Các cạnh của $Y$ (1-2,2-3,3-4,4-1) tạo chu trình 4 $C_4$ -- chu trình chẵn, lưỡng phân với hai phía $\\{1,3\\},\\{2,4\\}$. Chỉ $Y$ lưỡng phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $X$ is a pentagram (a single 5-cycle $C_5$ drawn with crossing lines, 5 vertices/5 edges) and $Y$ is a bowtie (two triangles sharing one common center vertex, 5 vertices/6 edges). Delete one edge from each graph to obtain 2 new graphs. How many cut-edges in total do the new graphs have?|||Cho $X$ là ngôi sao 5 cánh (một chu trình 5 đỉnh $C_5$ duy nhất vẽ với các đường cắt nhau, 5 đỉnh/5 cạnh) và $Y$ là hình nơ (hai tam giác chung một đỉnh trung tâm, 5 đỉnh/6 cạnh). Xóa một cạnh khỏi mỗi đồ thị để được 2 đồ thị mới. Tổng số cạnh cắt (cut-edge) của các đồ thị mới là bao nhiêu?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Deleting one edge from $C_5$ turns it into a path $P_5$ (4 edges) -- every edge of a path is a cut-edge, giving 4 cut-edges. Deleting one edge from one triangle of the bowtie turns that triangle into a 2-edge path, both of which become cut-edges (2), while the untouched triangle contributes 0 cut-edges (its 3 edges each still lie on a cycle). Total: $4+2=6$.</div><div class=\"ml-vi\">Xóa một cạnh khỏi $C_5$ biến nó thành đường đi $P_5$ (4 cạnh) -- mọi cạnh của đường đi đều là cạnh cắt, cho 4 cạnh cắt. Xóa một cạnh khỏi một tam giác của hình nơ biến tam giác đó thành đường đi 2 cạnh, cả hai đều thành cạnh cắt (2), còn tam giác không đụng tới đóng góp 0 cạnh cắt (3 cạnh của nó vẫn nằm trên một chu trình). Tổng: $4+2=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the graph $Q_4$ (hypercube of dimension 4). Choose the correct answer.|||Xét đồ thị $Q_4$ (siêu khối chiều 4). Chọn đáp án đúng.",
          "options": [
            {
              "text": "It has an Euler circuit.|||Nó có chu trình Euler."
            },
            {
              "text": "It does not have Euler circuits but it has an Euler path.|||Nó không có chu trình Euler nhưng có đường đi Euler."
            },
            {
              "text": "It has no Euler paths|||Nó không có đường đi Euler nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Every vertex of $Q_4$ has degree 4 (even), and $Q_4$ is connected -- an Euler circuit exists.</div><div class=\"ml-vi\">Mọi đỉnh của $Q_4$ đều có bậc 4 (chẵn), và $Q_4$ liên thông -- tồn tại chu trình Euler.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which are the first 4 vertices chosen when using Dijkstra's algorithm to find the shortest path from $G$ to $M$? Edges: $GH{=}1,HI{=}8,GK{=}4,HK{=}1,IJ{=}2,KJ{=}5,KL{=}3,LJ{=}6,IM{=}3,LM{=}2$.|||Đâu là 4 đỉnh đầu tiên được chọn khi dùng thuật toán Dijkstra tìm đường đi ngắn nhất từ $G$ đến $M$? Các cạnh: $GH{=}1,HI{=}8,GK{=}4,HK{=}1,IJ{=}2,KJ{=}5,KL{=}3,LJ{=}6,IM{=}3,LM{=}2$.",
          "options": [
            {
              "text": "G-H-K-I|||G-H-K-I"
            },
            {
              "text": "G-K-H-J|||G-K-H-J"
            },
            {
              "text": "G-H-K-L|||G-H-K-L"
            },
            {
              "text": "G-K-H-M|||G-K-H-M"
            },
            {
              "text": "G-H-K-M|||G-H-K-M"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$G$(0)$\\to H$(1) [smaller than $K$=4]. Relax $H$: $I=9,K=\\min(4,2)=2$. Next smallest unvisited is $K$(2). Relax $K$: $J=2+5=7$, $L=2+3=5$. Remaining unvisited: $I=9,J=7,L=5,M=\\infty$ -- smallest is $L$(5). Order: $G,H,K,L$.</div><div class=\"ml-vi\">$G$(0)$\\to H$(1) [nhỏ hơn $K$=4]. Nới lỏng $H$: $I=9,K=\\min(4,2)=2$. Tiếp theo nhỏ nhất chưa thăm là $K$(2). Nới lỏng $K$: $J=2+5=7$, $L=2+3=5$. Còn lại chưa thăm: $I=9,J=7,L=5,M=\\infty$ -- nhỏ nhất là $L$(5). Thứ tự: $G,H,K,L$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many edges in a tree of 10000 vertices?|||Có bao nhiêu cạnh trong một cây có 10000 đỉnh?",
          "options": [
            {
              "text": "10002|||10002"
            },
            {
              "text": "10001|||10001"
            },
            {
              "text": "9999|||9999"
            },
            {
              "text": "10000|||10000"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A tree with $n$ vertices always has $n-1$ edges: $10000-1=9999$.</div><div class=\"ml-vi\">Một cây có $n$ đỉnh luôn có $n-1$ cạnh: $10000-1=9999$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a prefix code represented by the binary tree: root splits 0(left)/1(right); left child splits into 0$\\to$\"e\"(leaf) and 1$\\to$(splits into 0$\\to$\"f\", 1$\\to$\"n\"); right child splits into 0$\\to$\"r\"(leaf) and 1$\\to$(splits into 0$\\to$\"s\", 1$\\to$\"u\"). This gives codes e=00,f=010,n=011,r=10,s=110,u=111. Decode the message 010111011.|||Cho một mã tiền tố biểu diễn bằng cây nhị phân: gốc tách 0(trái)/1(phải); con trái tách thành 0$\\to$\"e\"(lá) và 1$\\to$(tách thành 0$\\to$\"f\", 1$\\to$\"n\"); con phải tách thành 0$\\to$\"r\"(lá) và 1$\\to$(tách thành 0$\\to$\"s\", 1$\\to$\"u\"). Điều này cho các mã e=00,f=010,n=011,r=10,s=110,u=111. Giải mã thông điệp 010111011.",
          "options": [
            {
              "text": "sure|||sure"
            },
            {
              "text": "fun|||fun"
            },
            {
              "text": "sun|||sun"
            },
            {
              "text": "fur|||fur"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Reading greedily: \"010\"=f, remaining \"111011\"; \"111\"=u, remaining \"011\"; \"011\"=n. Decoded: f,u,n = \"fun\".</div><div class=\"ml-vi\">Đọc tham lam: \"010\"=f, còn lại \"111011\"; \"111\"=u, còn lại \"011\"; \"011\"=n. Giải mã: f,u,n = \"fun\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give the coding scheme A:001, B:1011, C:11, D:0000, E:0100, F:011, G:a01b01. Find $a$ and $b$ such that we have a prefix code.|||Cho lược đồ mã hóa A:001, B:1011, C:11, D:0000, E:0100, F:011, G:a01b01. Tìm $a$ và $b$ sao cho ta có một mã tiền tố.",
          "options": [
            {
              "text": "a=1, b=1|||a=1, b=1"
            },
            {
              "text": "a=1, b=0|||a=1, b=0"
            },
            {
              "text": "a=0, b=1|||a=0, b=1"
            },
            {
              "text": "a=0, b=0|||a=0, b=0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">G=$a$,0,1,$b$,0,1 (length 6). If $a=0$, G starts with \"001\"=A -- conflict, so $a=1$. With $a=1$, if $b=1$, G starts with \"1011\"=B -- conflict, so $b=0$. Checking other codes (11,0000,0100,011) against G's fixed pattern shows no possible conflict regardless of $a,b$ (positions 2-3 of G are fixed 0,1 which rule those out structurally). So $a=1,b=0$.</div><div class=\"ml-vi\">G=$a$,0,1,$b$,0,1 (dài 6). Nếu $a=0$, G bắt đầu bằng \"001\"=A -- xung đột, nên $a=1$. Với $a=1$, nếu $b=1$, G bắt đầu bằng \"1011\"=B -- xung đột, nên $b=0$. Kiểm các mã khác (11,0000,0100,011) với mẫu cố định của G cho thấy không thể xung đột dù $a,b$ là gì (vị trí 2-3 của G cố định 0,1 loại trừ chúng về cấu trúc). Vậy $a=1,b=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the postfix expression $2\\ 1\\ \\uparrow\\ 3\\ +\\ 4\\ 5\\ -\\ -\\ 6\\ 7\\ 8\\ +\\ +\\ -$|||Tìm giá trị của biểu thức hậu tố $2\\ 1\\ \\uparrow\\ 3\\ +\\ 4\\ 5\\ -\\ -\\ 6\\ 7\\ 8\\ +\\ +\\ -$",
          "options": [
            {
              "text": "-15|||-15"
            },
            {
              "text": "-16|||-16"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$2^1=2$; $2+3=5$; $4-5=-1$; $5-(-1)=6$; $7+8=15$; $6+15=21$; $6-21=-15$.</div><div class=\"ml-vi\">$2^1=2$; $2+3=5$; $4-5=-1$; $5-(-1)=6$; $7+8=15$; $6+15=21$; $6-21=-15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a graph $G$ with vertices $a,b,c,d,e,f,g,h$ and edges $ad,df,ac,ab,cb,ce,ce,df,ce,cf,de,eg,fg,gh$ (specifically: $a$ connects to $b,c,d$; $c$ connects to $b,e,f$; $d$ connects to $e,f$; $e,f$ both connect to $g$; $g$ connects to $h$). What is the order of vertices traversed by Breadth First Search algorithm from the vertex $a$? Assume that the vertices are added alphabetically.|||Cho đồ thị $G$ với các đỉnh $a,b,c,d,e,f,g,h$ và các cạnh $a$ nối $b,c,d$; $c$ nối $b,e,f$; $d$ nối $e,f$; $e,f$ đều nối $g$; $g$ nối $h$. Thứ tự các đỉnh được duyệt bằng thuật toán Tìm kiếm theo chiều rộng (BFS) từ đỉnh $a$ là gì? Giả sử các đỉnh được thêm theo thứ tự chữ cái.",
          "options": [
            {
              "text": "a, b, c, e, g, h, d, f|||a, b, c, e, g, h, d, f"
            },
            {
              "text": "a, b, c, e, f, g, h, d|||a, b, c, e, f, g, h, d"
            },
            {
              "text": "a, b, c, d, e, f, g, h|||a, b, c, d, e, f, g, h"
            },
            {
              "text": "a, b, c, d, e, g, f, h|||a, b, c, d, e, g, f, h"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Level 0: $a$. Level 1 (neighbors of $a$, alphabetical): $b,c,d$. Level 2 (new neighbors of $b,c,d$, alphabetical): $e,f$ (both reachable via $c$ and $d$). Level 3: $g$ (via $e$ or $f$). Level 4: $h$ (via $g$). Full order: $a,b,c,d,e,f,g,h$.</div><div class=\"ml-vi\">Mức 0: $a$. Mức 1 (hàng xóm của $a$, thứ tự chữ cái): $b,c,d$. Mức 2 (hàng xóm mới của $b,c,d$, thứ tự chữ cái): $e,f$ (đều đến được qua $c$ và $d$). Mức 3: $g$ (qua $e$ hoặc $f$). Mức 4: $h$ (qua $g$). Thứ tự đầy đủ: $a,b,c,d,e,f,g,h$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If using Kruskal's algorithm to find a minimum spanning tree $T$ from the graph with vertices $A,B,C,D,E,F$ and edges $AB{=}1,AD{=}3,BD{=}5,BE{=}1,BC{=}6,DE{=}1,CE{=}5,CF{=}2,EF{=}4$, which edge is added to $T$ in the last step?|||Nếu dùng thuật toán Kruskal để tìm cây khung nhỏ nhất $T$ từ đồ thị có các đỉnh $A,B,C,D,E,F$ và các cạnh $AB{=}1,AD{=}3,BD{=}5,BE{=}1,BC{=}6,DE{=}1,CE{=}5,CF{=}2,EF{=}4$, cạnh nào được thêm vào $T$ ở bước cuối cùng?",
          "options": [
            {
              "text": "AD|||AD"
            },
            {
              "text": "EF|||EF"
            },
            {
              "text": "EC|||EC"
            },
            {
              "text": "BD|||BD"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sorted edges: $AB(1),BE(1),DE(1),CF(2),AD(3),EF(4),BD(5),CE(5),BC(6)$. Adding in order (skipping cycles): $AB$ (\\{A,B\\}), $BE$ (\\{A,B,E\\}), $DE$ (\\{A,B,D,E\\}), $CF$ (\\{C,F\\}), $AD$ skipped (cycle), $EF$ connects \\{A,B,D,E\\} with \\{C,F\\} -- 5th edge, completing the spanning tree of 6 vertices. Last edge added: $EF$.</div><div class=\"ml-vi\">Cạnh sắp xếp: $AB(1),BE(1),DE(1),CF(2),AD(3),EF(4),BD(5),CE(5),BC(6)$. Thêm theo thứ tự (bỏ qua chu trình): $AB$ (\\{A,B\\}), $BE$ (\\{A,B,E\\}), $DE$ (\\{A,B,D,E\\}), $CF$ (\\{C,F\\}), $AD$ bỏ qua (chu trình), $EF$ nối \\{A,B,D,E\\} với \\{C,F\\} -- cạnh thứ 5, hoàn tất cây khung 6 đỉnh. Cạnh cuối cùng: $EF$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the expression $(101101\\lor110001)\\oplus001101$|||Tìm giá trị của biểu thức $(101101\\lor110001)\\oplus001101$",
          "options": [
            {
              "text": "101100|||101100"
            },
            {
              "text": "110000|||110000"
            },
            {
              "text": "001101|||001101"
            },
            {
              "text": "111101|||111101"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$101101\\lor110001=111101$ (bitwise OR). Then $111101\\oplus001101=110000$ (bitwise XOR).</div><div class=\"ml-vi\">$101101\\lor110001=111101$ (OR theo bit). Rồi $111101\\oplus001101=110000$ (XOR theo bit).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sequence of pseudorandom numbers is generated as follows: $x_0=3$, $x_n=(5x_{n-1}+4)\\bmod7$ for $n>0$. Find $x_4$.|||Một dãy số giả ngẫu nhiên được sinh như sau: $x_0=3$, $x_n=(5x_{n-1}+4)\\bmod7$ với $n>0$. Tìm $x_4$.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$x_1=(5\\cdot3+4)\\bmod7=19\\bmod7=5$. $x_2=(5\\cdot5+4)\\bmod7=29\\bmod7=1$. $x_3=(5\\cdot1+4)\\bmod7=9\\bmod7=2$. $x_4=(5\\cdot2+4)\\bmod7=14\\bmod7=0$.</div><div class=\"ml-vi\">$x_1=(5\\cdot3+4)\\bmod7=19\\bmod7=5$. $x_2=(5\\cdot5+4)\\bmod7=29\\bmod7=1$. $x_3=(5\\cdot1+4)\\bmod7=9\\bmod7=2$. $x_4=(5\\cdot2+4)\\bmod7=14\\bmod7=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $m=7^5\\cdot11^{12}\\cdot13^{90}$ and $mn=2^4\\cdot7^8\\cdot11^{26}\\cdot13^{90}$. Find $lcm(m,n)$. (i) $2^4\\,7^8\\,11^{12}\\,13^{90}$ (ii) $7^8\\,11^{18}\\,13^{90}$ (iii) $7^5\\,11^{12}\\,13^{90}$ (iv) $2^4\\,7^5\\,11^{20}\\,13^{90}$|||Cho $m=7^5\\cdot11^{12}\\cdot13^{90}$ và $mn=2^4\\cdot7^8\\cdot11^{26}\\cdot13^{90}$. Tìm $lcm(m,n)$. (i) $2^4\\,7^8\\,11^{12}\\,13^{90}$ (ii) $7^8\\,11^{18}\\,13^{90}$ (iii) $7^5\\,11^{12}\\,13^{90}$ (iv) $2^4\\,7^5\\,11^{20}\\,13^{90}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$n=\\frac{mn}{m}=2^4\\cdot7^{8-5}\\cdot11^{26-12}\\cdot13^{90-90}=2^4\\cdot7^3\\cdot11^{14}$. $lcm(m,n)=2^{\\max(0,4)}7^{\\max(5,3)}11^{\\max(12,14)}13^{\\max(90,0)}=2^4\\cdot7^5\\cdot11^{14}\\cdot13^{90}$, which matches none of (i)-(iv) exactly (all differ in the exponent of 11 or other primes).</div><div class=\"ml-vi\">$n=\\frac{mn}{m}=2^4\\cdot7^{8-5}\\cdot11^{26-12}\\cdot13^{90-90}=2^4\\cdot7^3\\cdot11^{14}$. $lcm(m,n)=2^{\\max(0,4)}7^{\\max(5,3)}11^{\\max(12,14)}13^{\\max(90,0)}=2^4\\cdot7^5\\cdot11^{14}\\cdot13^{90}$, không khớp chính xác đáp án (i)-(iv) nào (đều khác ở số mũ của 11 hoặc các số nguyên tố khác).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)$ is defined recursively by: $f(0)=1$, $f(n+1)=3f(n)$, $n=0,1,2,\\ldots$. Find $f(1),f(2),f(3)$.|||Giả sử $f(n)$ được định nghĩa đệ quy bởi: $f(0)=1$, $f(n+1)=3f(n)$, $n=0,1,2,\\ldots$. Tìm $f(1),f(2),f(3)$.",
          "options": [
            {
              "text": "3, 9, 27|||3, 9, 27"
            },
            {
              "text": "1, 3, 9|||1, 3, 9"
            },
            {
              "text": "0, 1, 2|||0, 1, 2"
            },
            {
              "text": "3, 3, 3|||3, 3, 3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=3f(0)=3(1)=3$. $f(2)=3f(1)=3(3)=9$. $f(3)=3f(2)=3(9)=27$.</div><div class=\"ml-vi\">$f(1)=3f(0)=3(1)=3$. $f(2)=3f(1)=3(3)=9$. $f(3)=3f(2)=3(9)=27$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $m$ and $n$ such that the complete bipartite graph $K_{m,n}$ has Hamilton circuits.|||Tìm tất cả giá trị $m$ và $n$ sao cho đồ thị lưỡng phân đầy đủ $K_{m,n}$ có chu trình Hamilton.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "m=n and m ≥ 2|||m=n và m ≥ 2"
            },
            {
              "text": "m=n and m ≥ 3|||m=n và m ≥ 3"
            },
            {
              "text": "m>n and n ≥ 2|||m>n và n ≥ 2"
            },
            {
              "text": "m>n and n ≥ 3|||m>n và n ≥ 3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A Hamilton circuit in a bipartite graph must alternate between the two parts equally, requiring $m=n$. The smallest case forming an actual cycle is $K_{2,2}=C_4$, so $m=n$ and $m\\ge2$.</div><div class=\"ml-vi\">Chu trình Hamilton trong đồ thị lưỡng phân phải luân phiên đều giữa hai phía, đòi hỏi $m=n$. Trường hợp nhỏ nhất thực sự tạo chu trình là $K_{2,2}=C_4$, nên $m=n$ và $m\\ge2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine the order in which a post-order traversal visits the vertices of the given rooted tree: root $a$ with children $b$(left),$c$(right); $b$'s children $d$(left),$e$(right); $e$'s children $f$(left),$g$(right).|||Xác định thứ tự phép duyệt hậu thứ (post-order) thăm các đỉnh của cây có gốc cho trước: gốc $a$ với con $b$(trái),$c$(phải); con của $b$ là $d$(trái),$e$(phải); con của $e$ là $f$(trái),$g$(phải).",
          "options": [
            {
              "text": "d,b,a,e,f,g,c|||d,b,a,e,f,g,c"
            },
            {
              "text": "a,b,c,d,e,f,g|||a,b,c,d,e,f,g"
            },
            {
              "text": "a,c,b,d,e,f,g|||a,c,b,d,e,f,g"
            },
            {
              "text": "f,g,d,e,b,c,a|||f,g,d,e,b,c,a"
            },
            {
              "text": "d,f,g,e,b,c,a|||d,f,g,e,b,c,a"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Postorder = children left-to-right then the node. Subtree $b$: $d$(leaf) then subtree $e$ ($f,g$ leaves then $e$) then $b$: gives $d,f,g,e,b$. Then leaf $c$. Then root $a$. Full order: $d,f,g,e,b,c,a$.</div><div class=\"ml-vi\">Hậu thứ = các con trái sang phải rồi đến nút đó. Cây con $b$: $d$(lá) rồi cây con $e$ ($f,g$ là lá rồi $e$) rồi $b$: cho $d,f,g,e,b$. Rồi lá $c$. Rồi gốc $a$. Thứ tự đầy đủ: $d,f,g,e,b,c,a$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAD-D10",
      "source": "REAL",
      "sortOrder": 210,
      "title": "Final Exam — Đề 10|||Thi cuối kỳ — Đề 10",
      "description": "MAD101 Final Exam, Đề 10 (46 questions), transcribed from a fuoverflow practice simulator (answers independently solved and re-derived, not revealed by the source).|||Thi cuối kỳ MAD101, Đề 10 (46 câu), chép từ bộ mô phỏng luyện tập fuoverflow (đáp án tự giải và suy luận độc lập, nguồn không lộ đáp án).",
      "durationMinutes": 92,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $p$=\"An is absent\", $q$=\"It is cold\". Translate the sentence into a logical expression: \"It is cold but An is not absent\". (i) $\\neg p\\land q$ (ii) $p\\land\\neg q$ (iii) $q\\to\\neg p$ (iv) $\\neg p\\lor q$|||Cho $p$=\"An vắng mặt\", $q$=\"Trời lạnh\". Diễn đạt câu sau thành biểu thức logic: \"Trời lạnh nhưng An không vắng mặt\". (i) $\\neg p\\land q$ (ii) $p\\land\\neg q$ (iii) $q\\to\\neg p$ (iv) $\\neg p\\lor q$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">\"It is cold\" = $q$, \"An is not absent\" = $\\neg p$, joined by \"but\" (a conjunction): $q\\land\\neg p$, same as $\\neg p\\land q$, option (i).</div><div class=\"ml-vi\">\"Trời lạnh\" = $q$, \"An không vắng mặt\" = $\\neg p$, nối bằng \"nhưng\" (một phép hội): $q\\land\\neg p$, giống $\\neg p\\land q$, đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $p,q$ be propositions. The compound proposition $(p\\land q)\\to(p\\lor q)$ is ___|||Cho $p,q$ là các mệnh đề. Mệnh đề phức hợp $(p\\land q)\\to(p\\lor q)$ là ___",
          "options": [
            {
              "text": "a tautology|||hằng đúng (tautology)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "a contingency|||một mệnh đề bất định (contingency)"
            },
            {
              "text": "a contradiction|||hằng sai (contradiction)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">If $p\\land q$ is true, both $p,q$ are true, so $p\\lor q$ is true -- $T\\to T=T$. If $p\\land q$ is false, the implication is vacuously true. Always true -- a tautology.</div><div class=\"ml-vi\">Nếu $p\\land q$ đúng, cả $p,q$ đều đúng, nên $p\\lor q$ đúng -- $T\\to T=T$. Nếu $p\\land q$ sai, phép kéo theo đúng hiển nhiên. Luôn đúng -- hằng đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x$ represent a student of the university. Let $F(x)$=\"x is a student of the Business department\", $J(x)$=\"x knows the computer language Java\", $R(x)$=\"x can speak Russian\". Translate the sentence into a logical expression: \"There is a student of the Business department who can speak Russian, but doesn't know Java\". (i) $\\forall x(F(x)\\to(J(x)\\lor R(x)))$ (ii) $\\forall x(F(x)\\to(J(x)\\land R(x)))$ (iii) $\\exists x(F(x)\\land(\\neg J(x)\\land R(x)))$ (iv) $\\exists x(F(x)\\lor(\\neg J(x)\\land R(x)))$|||Cho $x$ đại diện một sinh viên của trường đại học. Cho $F(x)$=\"x là sinh viên khoa Kinh doanh\", $J(x)$=\"x biết ngôn ngữ lập trình Java\", $R(x)$=\"x nói được tiếng Nga\". Diễn đạt câu sau thành biểu thức logic: \"Có một sinh viên khoa Kinh doanh nói được tiếng Nga, nhưng không biết Java\". (i) $\\forall x(F(x)\\to(J(x)\\lor R(x)))$ (ii) $\\forall x(F(x)\\to(J(x)\\land R(x)))$ (iii) $\\exists x(F(x)\\land(\\neg J(x)\\land R(x)))$ (iv) $\\exists x(F(x)\\lor(\\neg J(x)\\land R(x)))$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices|||Không đáp án nào đúng"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">\"There is a student\" is existential ($\\exists x$). \"of the Business department\" = $F(x)$, \"can speak Russian\" = $R(x)$, \"doesn't know Java\" = $\\neg J(x)$, all joined by \"and\": $\\exists x(F(x)\\land\\neg J(x)\\land R(x))$, option (iii).</div><div class=\"ml-vi\">\"Có một sinh viên\" là tồn tại ($\\exists x$). \"khoa Kinh doanh\" = $F(x)$, \"nói được tiếng Nga\" = $R(x)$, \"không biết Java\" = $\\neg J(x)$, tất cả nối bằng \"và\": $\\exists x(F(x)\\land\\neg J(x)\\land R(x))$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of $\\exists x\\forall y(P(x,y)\\leftrightarrow\\neg Q(x,y))$. (i) $\\forall x\\exists y(P(x,y)\\leftrightarrow\\neg Q(x,y))$ (ii) $\\exists x\\forall y(P(x,y)\\oplus\\neg Q(x,y))$ (iii) $\\forall x\\exists y(P(x,y)\\oplus\\neg Q(x,y))$ (iv) $\\exists x\\forall y(P(x,y)\\leftrightarrow Q(x,y))$|||Tìm phủ định của $\\exists x\\forall y(P(x,y)\\leftrightarrow\\neg Q(x,y))$. (i) $\\forall x\\exists y(P(x,y)\\leftrightarrow\\neg Q(x,y))$ (ii) $\\exists x\\forall y(P(x,y)\\oplus\\neg Q(x,y))$ (iii) $\\forall x\\exists y(P(x,y)\\oplus\\neg Q(x,y))$ (iv) $\\exists x\\forall y(P(x,y)\\leftrightarrow Q(x,y))$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\neg\\exists x\\forall y(\\ldots)=\\forall x\\exists y\\neg(P(x,y)\\leftrightarrow\\neg Q(x,y))$. Since $\\neg(A\\leftrightarrow B)\\equiv A\\oplus B$, this becomes $\\forall x\\exists y(P(x,y)\\oplus\\neg Q(x,y))$, option (iii).</div><div class=\"ml-vi\">$\\neg\\exists x\\forall y(\\ldots)=\\forall x\\exists y\\neg(P(x,y)\\leftrightarrow\\neg Q(x,y))$. Vì $\\neg(A\\leftrightarrow B)\\equiv A\\oplus B$, điều này thành $\\forall x\\exists y(P(x,y)\\oplus\\neg Q(x,y))$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $Q(x,y)$ be the statement \"Student $x$ has studied subject $y$\", $S(x,z)$ the statement \"Student $x$ is in class $z$\", $F(x,x')$ the statement \"Students $x$ and $x'$ are friends\". Translate the logical expression $\\exists x\\exists x'(S(x,CS120)\\land F(x,x')\\land Q(x',Physics))$ into a sentence.|||Cho $Q(x,y)$ là mệnh đề \"Sinh viên $x$ đã học môn $y$\", $S(x,z)$ là mệnh đề \"Sinh viên $x$ ở lớp $z$\", $F(x,x')$ là mệnh đề \"Sinh viên $x$ và $x'$ là bạn bè\". Diễn dịch biểu thức logic $\\exists x\\exists x'(S(x,CS120)\\land F(x,x')\\land Q(x',Physics))$ thành câu.",
          "options": [
            {
              "text": "There exists one friend of a student in class CS120 that has studied Physics.|||Có một người bạn của một sinh viên lớp CS120 đã học Vật lý."
            },
            {
              "text": "There exists one student in class CS120 that has studied Physics and has a friend.|||Có một sinh viên lớp CS120 đã học Vật lý và có một người bạn."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "There exists a student who has a friend in class CS120 that has studied Physics.|||Có một sinh viên có một người bạn ở lớp CS120 đã học Vật lý."
            },
            {
              "text": "Every student in class CS120 has a friend that has studied Physics.|||Mọi sinh viên lớp CS120 đều có một người bạn đã học Vật lý."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$x$ is in class CS120 ($S(x,CS120)$), $x$ and $x'$ are friends, and $x'$ has studied Physics ($Q(x',Physics)$). So: a student ($x$) in CS120 has a friend ($x'$) who has studied Physics -- equivalently, a friend of a CS120 student has studied Physics.</div><div class=\"ml-vi\">$x$ ở lớp CS120 ($S(x,CS120)$), $x$ và $x'$ là bạn bè, và $x'$ đã học Vật lý ($Q(x',Physics)$). Vậy: một sinh viên ($x$) lớp CS120 có một người bạn ($x'$) đã học Vật lý -- tương đương, một người bạn của một sinh viên CS120 đã học Vật lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What rule of inference is used in this argument? \"Ronaldo is an excellent football player. If Ronaldo is an excellent football player, then he can earn a lot of money. Therefore, Ronaldo can earn a lot of money.\"|||Quy tắc suy luận nào được dùng trong lập luận này? \"Ronaldo là một cầu thủ bóng đá xuất sắc. Nếu Ronaldo là một cầu thủ xuất sắc, thì anh ấy có thể kiếm được nhiều tiền. Vậy, Ronaldo có thể kiếm được nhiều tiền.\"",
          "options": [
            {
              "text": "Addition|||Cộng (Addition)"
            },
            {
              "text": "Hypothetical syllogism|||Tam đoạn luận giả định"
            },
            {
              "text": "Modus ponens|||Modus ponens"
            },
            {
              "text": "Modus tollens|||Modus tollens"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Given $p$ and $p\\to q$, concluding $q$ is exactly the Modus ponens rule of inference.</div><div class=\"ml-vi\">Cho $p$ và $p\\to q$, kết luận $q$ chính xác là quy tắc suy luận Modus ponens.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true? (i) $\\emptyset\\in\\{x\\}$ (ii) $\\{x\\}\\subseteq\\{x\\}$ (iii) $\\{x\\}\\in\\{x\\}$ (iv) $\\{x\\}\\subset\\{x\\}$|||Phát biểu nào sau đây đúng? (i) $\\emptyset\\in\\{x\\}$ (ii) $\\{x\\}\\subseteq\\{x\\}$ (iii) $\\{x\\}\\in\\{x\\}$ (iv) $\\{x\\}\\subset\\{x\\}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) is false in general: $\\{x\\}$'s only element is $x$, not $\\emptyset$. (iii) is false: $\\{x\\}$'s only element is $x$, not the set $\\{x\\}$. (iv) is false: proper subset requires strict containment, and no set is a proper subset of itself. (ii) is true: every set is a subset of itself.</div><div class=\"ml-vi\">(i) sai nói chung: phần tử duy nhất của $\\{x\\}$ là $x$, không phải $\\emptyset$. (iii) sai: phần tử duy nhất của $\\{x\\}$ là $x$, không phải tập $\\{x\\}$. (iv) sai: tập con thực sự đòi hỏi chứa nghiêm ngặt, và không tập nào là tập con thực sự của chính nó. (ii) đúng: mọi tập hợp là tập con của chính nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{a,b,c,d,e,f,g,h,i,j\\}$. Given the subsets $A=\\{a,c,d,e,i\\}$, $B=\\{a,f,g,h,j\\}$. The bit string representing the subset $A-B$ is ___|||Cho $U=\\{a,b,c,d,e,f,g,h,i,j\\}$. Cho các tập con $A=\\{a,c,d,e,i\\}$, $B=\\{a,f,g,h,j\\}$. Chuỗi bit biểu diễn tập con $A-B$ là ___",
          "options": [
            {
              "text": "01 0110 0010|||01 0110 0010"
            },
            {
              "text": "00 1011 0010|||00 1011 0010"
            },
            {
              "text": "00 0111 1010|||00 0111 1010"
            },
            {
              "text": "00 1110 0010|||00 1110 0010"
            },
            {
              "text": "None of the other choices|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$A-B=\\{c,d,e,i\\}$ ($a$ is removed since it's also in $B$). Reading positions $a,b,c,d,e,f,g,h,i,j$: $0,0,1,1,1,0,0,0,1,0=$\"00 1110 0010\".</div><div class=\"ml-vi\">$A-B=\\{c,d,e,i\\}$ ($a$ bị loại vì cũng thuộc $B$). Đọc vị trí $a,b,c,d,e,f,g,h,i,j$: $0,0,1,1,1,0,0,0,1,0=$\"00 1110 0010\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the sets $A$ and $B$ if $A-B=\\{1,4,5,8\\}$, $B-A=\\{2,7,10\\}$, and $A\\cap B=\\{3,9\\}$.|||Tìm các tập $A$ và $B$ nếu $A-B=\\{1,4,5,8\\}$, $B-A=\\{2,7,10\\}$, và $A\\cap B=\\{3,9\\}$.",
          "options": [
            {
              "text": "A={2,7,10}, B={1,4,5,8}|||A={2,7,10}, B={1,4,5,8}"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "A={1,4,5,8}, B={2,7,10}|||A={1,4,5,8}, B={2,7,10}"
            },
            {
              "text": "A={1,2,4,5,7,8,10}, B={2,3,7,9,10}|||A={1,2,4,5,7,8,10}, B={2,3,7,9,10}"
            },
            {
              "text": "A={1,3,4,5,8,9}, B={2,3,7,9,10}|||A={1,3,4,5,8,9}, B={2,3,7,9,10}"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$A=(A-B)\\cup(A\\cap B)=\\{1,4,5,8\\}\\cup\\{3,9\\}=\\{1,3,4,5,8,9\\}$. $B=(B-A)\\cup(A\\cap B)=\\{2,7,10\\}\\cup\\{3,9\\}=\\{2,3,7,9,10\\}$.</div><div class=\"ml-vi\">$A=(A-B)\\cup(A\\cap B)=\\{1,4,5,8\\}\\cup\\{3,9\\}=\\{1,3,4,5,8,9\\}$. $B=(B-A)\\cup(A\\cap B)=\\{2,7,10\\}\\cup\\{3,9\\}=\\{2,3,7,9,10\\}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a function? (i) $f:Z\\times Z\\to Z$, $f(m,n)=\\lfloor\\sqrt{m+n}\\rfloor$ (ii) $f:Z\\times Z\\to Z$, $f(m,n)=\\frac{m}{2}+n$ (iii) $f:Z\\times Z\\to Z$, $f(m,n)=\\lfloor\\frac{m+n}{2}\\rfloor$ (iv) $f:Z\\times Z\\to Z$, $f(m,n)=\\lfloor\\sqrt m\\rfloor+\\lceil\\sqrt n\\rceil$|||Cái nào sau đây là một hàm? (i) $f:Z\\times Z\\to Z$, $f(m,n)=\\lfloor\\sqrt{m+n}\\rfloor$ (ii) $f:Z\\times Z\\to Z$, $f(m,n)=\\frac{m}{2}+n$ (iii) $f:Z\\times Z\\to Z$, $f(m,n)=\\lfloor\\frac{m+n}{2}\\rfloor$ (iv) $f:Z\\times Z\\to Z$, $f(m,n)=\\lfloor\\sqrt m\\rfloor+\\lceil\\sqrt n\\rceil$",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) and (iv) fail: undefined when $m+n<0$ or $m,n<0$ respectively (square root of a negative number). (ii) fails: $m/2$ isn't an integer for odd $m$, violating the codomain $Z$. (iii) works: $\\lfloor(m+n)/2\\rfloor$ is always a well-defined integer for any $m,n\\in Z$ -- a valid function.</div><div class=\"ml-vi\">(i) và (iv) sai: không xác định khi $m+n<0$ hoặc $m,n<0$ tương ứng (căn bậc hai của số âm). (ii) sai: $m/2$ không phải số nguyên với $m$ lẻ, vi phạm miền giá trị $Z$. (iii) đúng: $\\lfloor(m+n)/2\\rfloor$ luôn là số nguyên xác định rõ với mọi $m,n\\in Z$ -- một hàm hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many bijective functions are there from a set of 6 elements to a set of 7 elements?|||Có bao nhiêu hàm song ánh từ một tập 6 phần tử đến một tập 7 phần tử?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "5040|||5040"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A bijection requires the domain and codomain to have the same cardinality. Since $6\\neq7$, no bijective function can exist: the count is 0.</div><div class=\"ml-vi\">Một song ánh đòi hỏi miền xác định và miền giá trị có cùng lực lượng. Vì $6\\neq7$, không thể tồn tại hàm song ánh nào: số lượng là 0.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the double sum $\\sum_{i=1}^{3}\\sum_{j=-1}^{2}(3i+j)$|||Tìm tổng đôi $\\sum_{i=1}^{3}\\sum_{j=-1}^{2}(3i+j)$",
          "options": [
            {
              "text": "52|||52"
            },
            {
              "text": "78|||78"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "76|||76"
            },
            {
              "text": "60|||60"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For each $i$, the inner sum over $j=-1,0,1,2$ (4 terms) is $4(3i)+(-1+0+1+2)=12i+2$. Summing over $i=1,2,3$: $12(1+2+3)+2(3)=72+6=78$.</div><div class=\"ml-vi\">Với mỗi $i$, tổng trong theo $j=-1,0,1,2$ (4 số hạng) là $4(3i)+(-1+0+1+2)=12i+2$. Tổng theo $i=1,2,3$: $12(1+2+3)+2(3)=72+6=78$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the output of the following algorithm when $n=4$: procedure ABC($n,P$: integer): $P:=1$; for $j:=1$ to $n$ begin if ($j\\bmod2=0$) then $P:=P+j$ else $P:=P*j$ end|||Tìm kết quả của thuật toán sau khi $n=4$: procedure ABC($n,P$: integer): $P:=1$; for $j:=1$ to $n$ begin nếu ($j\\bmod2=0$) thì $P:=P+j$ ngược lại $P:=P*j$ end",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$j=1$ (odd): $P=1*1=1$. $j=2$ (even): $P=1+2=3$. $j=3$ (odd): $P=3*3=9$. $j=4$ (even): $P=9+4=13$.</div><div class=\"ml-vi\">$j=1$ (lẻ): $P=1*1=1$. $j=2$ (chẵn): $P=1+2=3$. $j=3$ (lẻ): $P=3*3=9$. $j=4$ (chẵn): $P=9+4=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the binary search algorithm to find the location of 10 in the sequence $\\{1,4,5,7,8,10,12\\}$. How many iterations are needed?|||Dùng thuật toán tìm kiếm nhị phân để tìm vị trí của 10 trong dãy $\\{1,4,5,7,8,10,12\\}$. Cần bao nhiêu lần lặp?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$i=1,j=7$. Iter1: $m=4$, $a_4=7<10$, $i:=5$. Iter2: $i=5,j=7$, $m=6$, $a_6=10$, $x>a_m$ false, $j:=6$. Iter3: $i=5,j=6$, $m=5$, $a_5=8<10$, $i:=6$. Now $i=j=6$, loop stops. Total: 3 iterations.</div><div class=\"ml-vi\">$i=1,j=7$. Lặp1: $m=4$, $a_4=7<10$, $i:=5$. Lặp2: $i=5,j=7$, $m=6$, $a_6=10$, $x>a_m$ sai, $j:=6$. Lặp3: $i=5,j=6$, $m=5$, $a_5=8<10$, $i:=6$. Giờ $i=j=6$, dừng vòng lặp. Tổng: 3 lần lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=x^2\\log(x)$ and $g(x)=x\\log(x^4)$. Choose the correct statements: (i) $f(x)=O(g(x))$ (ii) $g(x)=O(f(x))$|||Cho $f(x)=x^2\\log(x)$ và $g(x)=x\\log(x^4)$. Chọn phát biểu đúng: (i) $f(x)=O(g(x))$ (ii) $g(x)=O(f(x))$",
          "options": [
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$g(x)=x\\log(x^4)=4x\\log(x)$. $\\frac{f(x)}{g(x)}=\\frac{x^2\\log x}{4x\\log x}=\\frac{x}{4}\\to\\infty$, so $f$ grows strictly faster: $f\\neq O(g)$. But $\\frac{g(x)}{f(x)}=\\frac{4}{x}\\to0$ is bounded, so $g=O(f)$. Only (ii) holds.</div><div class=\"ml-vi\">$g(x)=x\\log(x^4)=4x\\log(x)$. $\\frac{f(x)}{g(x)}=\\frac{x^2\\log x}{4x\\log x}=\\frac{x}{4}\\to\\infty$, nên $f$ tăng nhanh hơn hẳn: $f\\neq O(g)$. Nhưng $\\frac{g(x)}{f(x)}=\\frac{4}{x}\\to0$ bị chặn, nên $g=O(f)$. Chỉ (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: procedure Ia($a_1,a_2,\\ldots,a_n$: integers): $m:=a_1$; $t:=0$; for $i:=2$ to $n$: if ($a_i>m$) then $m:=a_i$, $t:=t+1$. If the input is the list $[1,6,2,3,7,7,4,8,8,6]$, how many additions are used?|||Cho thuật toán: procedure Ia($a_1,a_2,\\ldots,a_n$: integers): $m:=a_1$; $t:=0$; for $i:=2$ to $n$: nếu ($a_i>m$) thì $m:=a_i$, $t:=t+1$. Nếu đầu vào là dãy $[1,6,2,3,7,7,4,8,8,6]$, cần bao nhiêu phép cộng?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Trace with $m=1,t=0$: $6>1\\to t{=}1$; $2>6$ no; $3>6$ no; $7>6\\to t{=}2$; $7>7$ no; $4>7$ no; $8>7\\to t{=}3$; $8>8$ no; $6>8$ no. Each $t:=t+1$ is one addition, total 3.</div><div class=\"ml-vi\">Theo dõi với $m=1,t=0$: $6>1\\to t{=}1$; $2>6$ không; $3>6$ không; $7>6\\to t{=}2$; $7>7$ không; $4>7$ không; $8>7\\to t{=}3$; $8>8$ không; $6>8$ không. Mỗi $t:=t+1$ là một phép cộng, tổng 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following integers is congruent to 130 modulo 6?|||Số nguyên nào sau đây đồng dư với 130 theo modulo 6?",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$130=6\\times21+4$, so $130\\equiv4\\pmod6$.</div><div class=\"ml-vi\">$130=6\\times21+4$, nên $130\\equiv4\\pmod6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a=134\\bmod9$ and $b=-121\\bmod9$. Find $a-b$.|||Cho $a=134\\bmod9$ và $b=-121\\bmod9$. Tìm $a-b$.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "-4|||-4"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$134=9(14)+8$, so $a=8$. $-121=9(-14)+5$ (since $9(-14)=-126$, $-121-(-126)=5$), so $b=5$. $a-b=8-5=3$.</div><div class=\"ml-vi\">$134=9(14)+8$, nên $a=8$. $-121=9(-14)+5$ (vì $9(-14)=-126$, $-121-(-126)=5$), nên $b=5$. $a-b=8-5=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The number $n=326700000$ can be written uniquely as a product of powers of distinct primes, $n=a^xb^yc^zd^t$, where $a,b,c,d$ are primes and $x,y,z,t>0$. Find $a+b+c+d$.|||Số $n=326700000$ có thể viết duy nhất thành tích các lũy thừa của các số nguyên tố khác nhau, $n=a^xb^yc^zd^t$, với $a,b,c,d$ là số nguyên tố và $x,y,z,t>0$. Tìm $a+b+c+d$.",
          "options": [
            {
              "text": "28|||28"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "21|||21"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$n=3267\\times10^5$. $3267=3^3\\times11^2$. $10^5=2^5\\times5^5$. So $n=2^5\\times3^3\\times5^5\\times11^2$, giving primes $2,3,5,11$. Sum: $2+3+5+11=21$.</div><div class=\"ml-vi\">$n=3267\\times10^5$. $3267=3^3\\times11^2$. $10^5=2^5\\times5^5$. Vậy $n=2^5\\times3^3\\times5^5\\times11^2$, cho các số nguyên tố $2,3,5,11$. Tổng: $2+3+5+11=21$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the greatest common divisor of $a=2^3\\cdot3^2\\cdot5^7$, $b=3^4\\cdot5^3\\cdot7^2$?|||Ước chung lớn nhất của $a=2^3\\cdot3^2\\cdot5^7$, $b=3^4\\cdot5^3\\cdot7^2$ là gì?",
          "options": [
            {
              "text": "225|||225"
            },
            {
              "text": "None of the other choices is true|||Không đáp án nào đúng"
            },
            {
              "text": "1125|||1125"
            },
            {
              "text": "2250|||2250"
            },
            {
              "text": "375|||375"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\gcd=2^{\\min(3,0)}3^{\\min(2,4)}5^{\\min(7,3)}7^{\\min(0,2)}=2^0\\cdot3^2\\cdot5^3\\cdot7^0=1\\times9\\times125=1125$.</div><div class=\"ml-vi\">$\\gcd=2^{\\min(3,0)}3^{\\min(2,4)}5^{\\min(7,3)}7^{\\min(0,2)}=2^0\\cdot3^2\\cdot5^3\\cdot7^0=1\\times9\\times125=1125$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find base 3 expansion of $(434)_5$.|||Tìm biểu diễn cơ số 3 của $(434)_5$.",
          "options": [
            {
              "text": "10211|||10211"
            },
            {
              "text": "11112|||11112"
            },
            {
              "text": "11102|||11102"
            },
            {
              "text": "11002|||11002"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(434)_5=4(25)+3(5)+4=100+15+4=119$ in decimal. Converting 119 to base 3: $119=1(81)+1(27)+1(9)+0(3)+2(1)$, giving digits $1,1,1,0,2=(11102)_3$.</div><div class=\"ml-vi\">$(434)_5=4(25)+3(5)+4=100+15+4=119$ trong hệ thập phân. Đổi 119 sang cơ số 3: $119=1(81)+1(27)+1(9)+0(3)+2(1)$, cho các chữ số $1,1,1,0,2=(11102)_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(n)$ be the statement that $n!<n^n$, where $n$ is an integer greater than 1. What do you need to prove in the basic step if using induction method?|||Cho $P(n)$ là mệnh đề $n!<n^n$, với $n$ là số nguyên lớn hơn 1. Cần chứng minh gì ở bước cơ sở nếu dùng phương pháp quy nạp?",
          "options": [
            {
              "text": "Show that P(3) is true|||Chứng minh P(3) đúng"
            },
            {
              "text": "Show that P(2) is true|||Chứng minh P(2) đúng"
            },
            {
              "text": "Show that P(4) is true|||Chứng minh P(4) đúng"
            },
            {
              "text": "Show that P(1) is true|||Chứng minh P(1) đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Since the domain is integers greater than 1, the smallest value to check is $n=2$. The basic step must show $P(2)$ is true.</div><div class=\"ml-vi\">Vì miền là số nguyên lớn hơn 1, giá trị nhỏ nhất cần kiểm là $n=2$. Bước cơ sở phải chứng minh $P(2)$ đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the set $S\\subseteq Z$ defined recursively as follows: Basis step: $4,6\\in S$. Recursive step: if $m,n\\in S$ then $-m\\in S$ and $m+n\\in S$. Which of the following elements belongs to $S$?|||Cho tập $S\\subseteq Z$ được định nghĩa đệ quy như sau: Bước cơ sở: $4,6\\in S$. Bước đệ quy: nếu $m,n\\in S$ thì $-m\\in S$ và $m+n\\in S$. Phần tử nào sau đây thuộc $S$?",
          "options": [
            {
              "text": "21|||21"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "23|||23"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Since $\\gcd(4,6)=2$, and $S$ is closed under addition and negation, $S$ consists exactly of all even integers (the subgroup of $\\mathbb{Z}$ generated by 4 and 6 is $2\\mathbb{Z}$). Among the options, only 22 is even.</div><div class=\"ml-vi\">Vì $\\gcd(4,6)=2$, và $S$ đóng dưới phép cộng và phủ định, $S$ gồm chính xác mọi số nguyên chẵn (nhóm con của $\\mathbb{Z}$ sinh bởi 4 và 6 là $2\\mathbb{Z}$). Trong các đáp án, chỉ 22 là số chẵn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the function $f$ defined recursively as follows: $f(n)=1+f(n-1)f(n-2)-2f(n-1)$, $n=3,4,\\ldots$ with $f(1)=1,f(2)=-1$. Find $f(5)$.|||Cho hàm $f$ được định nghĩa đệ quy như sau: $f(n)=1+f(n-1)f(n-2)-2f(n-1)$, $n=3,4,\\ldots$ với $f(1)=1,f(2)=-1$. Tìm $f(5)$.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=1+f(2)f(1)-2f(2)=1+(-1)(1)-2(-1)=1-1+2=2$. $f(4)=1+f(3)f(2)-2f(3)=1+(2)(-1)-2(2)=1-2-4=-5$. $f(5)=1+f(4)f(3)-2f(4)=1+(-5)(2)-2(-5)=1-10+10=1$.</div><div class=\"ml-vi\">$f(3)=1+f(2)f(1)-2f(2)=1+(-1)(1)-2(-1)=1-1+2=2$. $f(4)=1+f(3)f(2)-2f(3)=1+(2)(-1)-2(2)=1-2-4=-5$. $f(5)=1+f(4)f(3)-2f(4)=1+(-5)(2)-2(-5)=1-10+10=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed to merge two ordered lists $[2,8,11,15,20,24]$ and $[1,5,6,7,12]$?|||Cần bao nhiêu phép so sánh để trộn hai dãy có thứ tự $[2,8,11,15,20,24]$ và $[1,5,6,7,12]$?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Simulating: compare 2,1(take1); 2,5(take2); 8,5(take5); 8,6(take6); 8,7(take7); 8,12(take8); 11,12(take11); 15,12(take12) -- second list exhausted, append remaining 15,20,24 with no comparison. Total: 8 comparisons.</div><div class=\"ml-vi\">Mô phỏng: so sánh 2,1(lấy1); 2,5(lấy2); 8,5(lấy5); 8,6(lấy6); 8,7(lấy7); 8,12(lấy8); 11,12(lấy11); 15,12(lấy12) -- dãy 2 hết, thêm 15,20,24 còn lại không cần so sánh. Tổng: 8 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are TRUE? (i) An algorithm is called recursive if it solves a problem by reducing it to an instance of the same problem. (ii) The value of a recursively defined function can be obtained by a recursive algorithm. (iii) If a problem can be solved utilizing solutions to smaller versions of the same problem, and the smaller versions reduce to easily solvable cases, then one can use a recursive algorithm to solve that problem.|||Phát biểu nào sau đây ĐÚNG? (i) Một thuật toán được gọi là đệ quy nếu nó giải quyết bài toán bằng cách quy về một thực thể của cùng bài toán đó. (ii) Giá trị của một hàm được định nghĩa đệ quy có thể thu được bằng một thuật toán đệ quy. (iii) Nếu một bài toán có thể giải được bằng cách sử dụng lời giải của các phiên bản nhỏ hơn của cùng bài toán, và các phiên bản nhỏ hơn quy về các trường hợp dễ giải, thì có thể dùng thuật toán đệ quy để giải bài toán đó.",
          "options": [
            {
              "text": "all of them|||tất cả"
            },
            {
              "text": "(i) and (ii) only|||chỉ (i) và (ii)"
            },
            {
              "text": "(i) and (iii) only|||chỉ (i) và (iii)"
            },
            {
              "text": "(ii) and (iii) only|||chỉ (ii) và (iii)"
            },
            {
              "text": "none of them|||không cái nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">All three are standard true facts about recursion: (i) is the definition of a recursive algorithm, (ii) follows directly from how recursively defined functions are evaluated, and (iii) restates the validity condition for constructing a recursive algorithm.</div><div class=\"ml-vi\">Cả ba đều là các sự kiện chuẩn đúng về đệ quy: (i) là định nghĩa của thuật toán đệ quy, (ii) suy ra trực tiếp từ cách hàm định nghĩa đệ quy được tính giá trị, và (iii) diễn đạt lại điều kiện hợp lệ để xây dựng một thuật toán đệ quy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many bit strings of length 10 that start with 10 and end with 01?|||Có bao nhiêu chuỗi bit độ dài 10 bắt đầu bằng 10 và kết thúc bằng 01?",
          "options": [
            {
              "text": "10!|||10!"
            },
            {
              "text": "960|||960"
            },
            {
              "text": "64|||64"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Positions 1-2 fixed as \"10\", positions 9-10 fixed as \"01\", leaving 6 middle bits free: $2^6=64$.</div><div class=\"ml-vi\">Vị trí 1-2 cố định là \"10\", vị trí 9-10 cố định là \"01\", còn lại 6 bit giữa tự do: $2^6=64$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a wedding, how many ways to arrange 5 people in a row (including the bride and the groom), so that the bride stands somewhere on the right of the groom?|||Trong một đám cưới, có bao nhiêu cách xếp 5 người thành một hàng (bao gồm cô dâu và chú rể), sao cho cô dâu đứng ở đâu đó bên phải chú rể?",
          "options": [
            {
              "text": "120|||120"
            },
            {
              "text": "60|||60"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "100|||100"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Total arrangements of 5 people: $5!=120$. By symmetry, exactly half have the bride to the right of the groom: $120/2=60$.</div><div class=\"ml-vi\">Tổng số cách xếp 5 người: $5!=120$. Theo đối xứng, đúng một nửa có cô dâu bên phải chú rể: $120/2=60$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A young pair of rabbits (of opposite sex) is placed on an island. A pair of rabbits does not breed until they are 2 months old. After 2 months, they produce 3 pairs of rabbits every month. How many pairs of rabbits after 6 months?|||Một cặp thỏ non (khác giới) được đặt trên một hòn đảo. Một cặp thỏ không sinh sản cho đến khi được 2 tháng tuổi. Sau 2 tháng, chúng sinh ra 3 cặp thỏ mỗi tháng. Có bao nhiêu cặp thỏ sau 6 tháng?",
          "options": [
            {
              "text": "40|||40"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "97|||97"
            },
            {
              "text": "58|||58"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(n)=f(n-1)+3f(n-2)$, $f(0)=f(1)=1$. $f(2)=1+3=4$. $f(3)=4+3=7$. $f(4)=7+12=19$. $f(5)=19+21=40$. $f(6)=40+57=97$.</div><div class=\"ml-vi\">$f(n)=f(n-1)+3f(n-2)$, $f(0)=f(1)=1$. $f(2)=1+3=4$. $f(3)=4+3=7$. $f(4)=7+12=19$. $f(5)=19+21=40$. $f(6)=40+57=97$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For the recurrence relation $f(n)=4f(n/2)+n$, what is the asymptotic complexity of $f(n)$ using the Master Theorem? (i) $O(\\log n)$ (ii) $O(n)$ (iii) $O(n\\log n)$ (iv) $O(n^2)$|||Với hệ thức truy hồi $f(n)=4f(n/2)+n$, độ phức tạp tiệm cận của $f(n)$ dùng Định lý thợ là gì? (i) $O(\\log n)$ (ii) $O(n)$ (iii) $O(n\\log n)$ (iv) $O(n^2)$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Master theorem with $a=4,b=2,f(n)=n$: $\\log_b a=\\log_2 4=2$. Since $f(n)=n=n^1$ and $1<2$, case 1 applies (recursive term dominates): $f(n)=\\Theta(n^{\\log_b a})=\\Theta(n^2)$, so $O(n^2)$.</div><div class=\"ml-vi\">Định lý thợ với $a=4,b=2,f(n)=n$: $\\log_b a=\\log_2 4=2$. Vì $f(n)=n=n^1$ và $1<2$, trường hợp 1 áp dụng (số hạng đệ quy chiếm ưu thế): $f(n)=\\Theta(n^{\\log_b a})=\\Theta(n^2)$, nên $O(n^2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Fill in the blank: \"The graph ___ has ___ edges\" (i) $C_n$, $2n$ (ii) $K_{m,n}$, $mn$ (iii) $W_n$, $2n+1$ (iv) $K_n$, $n^2$|||Điền vào chỗ trống: \"Đồ thị ___ có ___ cạnh\" (i) $C_n$, $2n$ (ii) $K_{m,n}$, $mn$ (iii) $W_n$, $2n+1$ (iv) $K_n$, $n^2$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$C_n$ has $n$ edges, not $2n$ -- (i) wrong. $W_n$ has $2n$ edges (n rim + n spokes), not $2n+1$ -- (iii) wrong. $K_n$ has $n(n-1)/2$ edges, not $n^2$ -- (iv) wrong. $K_{m,n}$ (complete bipartite) has exactly $mn$ edges -- (ii) correct.</div><div class=\"ml-vi\">$C_n$ có $n$ cạnh, không phải $2n$ -- (i) sai. $W_n$ có $2n$ cạnh (n vành + n nan hoa), không phải $2n+1$ -- (iii) sai. $K_n$ có $n(n-1)/2$ cạnh, không phải $n^2$ -- (iv) sai. $K_{m,n}$ (lưỡng phân đầy đủ) có đúng $mn$ cạnh -- (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all bipartite graphs in the list $K_4, W_4, C_4, K_{3,4}$. (i) $K_4,W_4$ (ii) $W_4,C_4$ (iii) $C_4,K_{3,4}$|||Tìm tất cả đồ thị lưỡng phân trong danh sách $K_4, W_4, C_4, K_{3,4}$. (i) $K_4,W_4$ (ii) $W_4,C_4$ (iii) $C_4,K_{3,4}$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$K_4$ contains triangles (odd cycles) -- not bipartite. $W_4$ (wheel) has triangles between the hub and adjacent rim vertices -- not bipartite. $C_4$ is an even cycle -- bipartite. $K_{3,4}$ is complete bipartite by definition -- bipartite. So the bipartite ones are $C_4,K_{3,4}$, option (iii).</div><div class=\"ml-vi\">$K_4$ chứa tam giác (chu trình lẻ) -- không lưỡng phân. $W_4$ (bánh xe) có tam giác giữa trung tâm và các đỉnh vành kề nhau -- không lưỡng phân. $C_4$ là chu trình chẵn -- lưỡng phân. $K_{3,4}$ là lưỡng phân đầy đủ theo định nghĩa -- lưỡng phân. Vậy các đồ thị lưỡng phân là $C_4,K_{3,4}$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a pseudograph with vertices $a,b,c,d$: straight edges $ab$ (top), $ad$ (left), $dc$ (bottom); a triple edge $ac$ (three parallel curved edges from $a$ to $c$); and self-loops at $b$, $c$, and $d$. What is the sum of the numbers in the third row of the adjacency matrix, in the order $a,b,c,d$?|||Cho một giả đồ thị với các đỉnh $a,b,c,d$: cạnh thẳng $ab$ (trên), $ad$ (trái), $dc$ (dưới); cạnh bội ba $ac$ (ba cạnh cong song song từ $a$ đến $c$); và khuyên tại $b$, $c$, và $d$. Tổng các số trong hàng thứ ba của ma trận kề, theo thứ tự $a,b,c,d$, là bao nhiêu?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The third row (order $a,b,c,d$) corresponds to vertex $c$. Row sum of an adjacency matrix always equals the vertex's degree. $c$ is incident to: 3 parallel edges to $a$ (+3), 1 edge to $d$ (+1), and 1 loop (contributing 2 to degree) (+2). Total degree of $c$ $=3+1+2=6$.</div><div class=\"ml-vi\">Hàng thứ ba (thứ tự $a,b,c,d$) ứng với đỉnh $c$. Tổng hàng của ma trận kề luôn bằng bậc của đỉnh đó. $c$ liên thuộc với: 3 cạnh song song tới $a$ (+3), 1 cạnh tới $d$ (+1), và 1 khuyên (đóng góp 2 vào bậc) (+2). Tổng bậc của $c$ $=3+1+2=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $u,v$ be two vertices on different sides of the bipartite graph $K_{2,2}$. How many paths of length 3 from $u$ to $v$?|||Cho $u,v$ là hai đỉnh ở hai phía khác nhau của đồ thị lưỡng phân $K_{2,2}$. Có bao nhiêu đường đi độ dài 3 từ $u$ đến $v$?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Label sides $\\{u,x\\}$ and $\\{v,y\\}$. Using the adjacency matrix (order $u,x,v,y$) and computing $A^3$, the number of walks of length 3 from $u$ to $v$ is $(A^3)_{u,v}=4$.</div><div class=\"ml-vi\">Đặt hai phía $\\{u,x\\}$ và $\\{v,y\\}$. Dùng ma trận kề (thứ tự $u,x,v,y$) và tính $A^3$, số đường đi độ dài 3 từ $u$ đến $v$ là $(A^3)_{u,v}=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graphs have Euler circuits? (i) $K_4$ (ii) $C_4$ (iii) $C_5$ (iv) $Q_5$|||Đồ thị nào có chu trình Euler? (i) $K_4$ (ii) $C_4$ (iii) $C_5$ (iv) $Q_5$",
          "options": [
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A connected graph has an Euler circuit iff every vertex has even degree. $K_4$: every vertex degree 3 (odd) -- no. $C_4,C_5$: every vertex degree 2 (even) -- yes for both. $Q_5$: every vertex degree 5 (odd) -- no. So (ii) and (iii).</div><div class=\"ml-vi\">Đồ thị liên thông có chu trình Euler khi và chỉ khi mọi đỉnh có bậc chẵn. $K_4$: mọi đỉnh bậc 3 (lẻ) -- không. $C_4,C_5$: mọi đỉnh bậc 2 (chẵn) -- có cho cả hai. $Q_5$: mọi đỉnh bậc 5 (lẻ) -- không. Vậy (ii) và (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Apply the Dijkstra algorithm to find the shortest path from A to Z. Edges: $AB{=}2,AC{=}9,BD{=}5,BC{=}8,BE{=}3,DE{=}4,CE{=}3,DZ{=}2,EZ{=}3$. What is the next vertex chosen after E?|||Áp dụng thuật toán Dijkstra tìm đường đi ngắn nhất từ A đến Z. Các cạnh: $AB{=}2,AC{=}9,BD{=}5,BC{=}8,BE{=}3,DE{=}4,CE{=}3,DZ{=}2,EZ{=}3$. Đỉnh nào được chọn tiếp theo sau E?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "D|||D"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "Z|||Z"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$A$(0)$\\to B$(2) [smaller than $C$=9]. Relax $B$: $D=7,C=\\min(9,10)=9,E=2+3=5$. Next smallest is $E$(5). Relax $E$: $C=\\min(9,8)=8$, $Z=5+3=8$, $D=\\min(7,9)=7$(no change). Remaining unvisited: $D=7,C=8,Z=8$ -- smallest is $D$.</div><div class=\"ml-vi\">$A$(0)$\\to B$(2) [nhỏ hơn $C$=9]. Nới lỏng $B$: $D=7,C=\\min(9,10)=9,E=2+3=5$. Tiếp theo nhỏ nhất là $E$(5). Nới lỏng $E$: $C=\\min(9,8)=8$, $Z=5+3=8$, $D=\\min(7,9)=7$(không đổi). Còn lại chưa thăm: $D=7,C=8,Z=8$ -- nhỏ nhất là $D$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the maximum height of a full binary tree with 101 vertices?|||Chiều cao lớn nhất của một cây nhị phân đầy đủ với 101 đỉnh là bao nhiêu?",
          "options": [
            {
              "text": "50|||50"
            },
            {
              "text": "100|||100"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "101|||101"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For a full binary tree, $n=2i+1$ where $i$ is the internal vertex count: $i=(101-1)/2=50$. To maximize height, arrange the tree as a skewed chain (each internal node except the last has one leaf child and one internal child) -- this gives height equal to the number of internal nodes, $50$.</div><div class=\"ml-vi\">Với cây nhị phân đầy đủ, $n=2i+1$ với $i$ là số đỉnh trong: $i=(101-1)/2=50$. Để tối đa chiều cao, xếp cây thành chuỗi lệch (mỗi đỉnh trong trừ đỉnh cuối có một con lá và một con đỉnh trong) -- điều này cho chiều cao bằng số đỉnh trong, $50$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed in order to locate/insert the word \"SHARK\" in the binary search tree of the list {SHE, SELLS, SEA, SHELLS, BY, THE, SEASHORE}?|||Cần bao nhiêu phép so sánh để tìm/chèn từ \"SHARK\" trong cây tìm kiếm nhị phân của danh sách {SHE, SELLS, SEA, SHELLS, BY, THE, SEASHORE}?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Inserting in order builds: SHE (root); SELLS<SHE left; SEA<SELLS left of SELLS; SHELLS>SHE right of SHE; BY<SEA left of SEA; THE>SHELLS right of SHELLS; SEASHORE>SEA right of SEA. Searching \"SHARK\": compare with SHE (\"SHA\"<\"SHE\", go left) -- 1 comparison; compare with SELLS (\"SH\">\"SE\", go right, but SELLS has no right child) -- 2nd comparison, insertion point found. Total: 2 comparisons.</div><div class=\"ml-vi\">Chèn theo thứ tự xây dựng: SHE (gốc); SELLS<SHE trái; SEA<SELLS trái của SELLS; SHELLS>SHE phải của SHE; BY<SEA trái của SEA; THE>SHELLS phải của SHELLS; SEASHORE>SEA phải của SEA. Tìm \"SHARK\": so sánh với SHE (\"SHA\"<\"SHE\", sang trái) -- so sánh 1; so sánh với SELLS (\"SH\">\"SE\", sang phải, nhưng SELLS không có con phải) -- so sánh 2, tìm thấy điểm chèn. Tổng: 2 phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "There are 4 coins among which there is a counterfeit coin that is either heavier or lighter than the others. With a balance scale, how many weighings are needed to determine the counterfeit coin? (No need to determine the weight of the counterfeit coin.)|||Có 4 đồng xu trong đó có một đồng giả nặng hơn hoặc nhẹ hơn các đồng khác. Dùng cân thăng bằng, cần bao nhiêu lần cân để xác định đồng giả? (Không cần xác định đồng giả nặng hơn hay nhẹ hơn.)",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">With unknown direction (heavier or lighter), $k$ weighings can distinguish among up to $\\frac{3^k-1}{2}$ coins in the worst case that still identifies the culprit; for 4 coins, $k=2$ weighings suffice (dividing into groups and comparing).</div><div class=\"ml-vi\">Với hướng không biết (nặng hơn hay nhẹ hơn), $k$ lần cân có thể phân biệt tối đa $\\frac{3^k-1}{2}$ đồng xu trong trường hợp xấu nhất mà vẫn xác định được thủ phạm; với 4 đồng xu, $k=2$ lần cân là đủ (chia nhóm và so sánh).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the postorder traversal of the tree: root $d$ with children $b,h$; $b$'s children $a,c,e$; $e$'s children $f,g$; $h$'s children $i,l$; $l$'s children $j,m,o,p$; $m$'s children $k,n$.|||Tìm phép duyệt hậu thứ của cây: gốc $d$ với con $b,h$; con của $b$ là $a,c,e$; con của $e$ là $f,g$; con của $h$ là $i,l$; con của $l$ là $j,m,o,p$; con của $m$ là $k,n$.",
          "options": [
            {
              "text": "a-b-c-f-e-g-d-i-h-j-l-k-m-n-o-p|||a-b-c-f-e-g-d-i-h-j-l-k-m-n-o-p"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "d-b-a-c-e-f-g-h-i-l-j-m-k-n-o-p|||d-b-a-c-e-f-g-h-i-l-j-m-k-n-o-p"
            },
            {
              "text": "a-c-f-g-e-b-i-j-k-n-m-o-p-l-h-d|||a-c-f-g-e-b-i-j-k-n-m-o-p-l-h-d"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Postorder = children left-to-right then the node. $b$'s subtree: $a,c$, then $e$'s subtree ($f,g,e$), then $b$: gives $a,c,f,g,e,b$. $h$'s subtree: $i$, then $l$'s subtree ($j$, then $m$'s subtree $k,n,m$, then $o,p$, then $l$): gives $i,j,k,n,m,o,p,l$, then $h$. Full: $a,c,f,g,e,b,i,j,k,n,m,o,p,l,h,d$.</div><div class=\"ml-vi\">Hậu thứ = các con trái sang phải rồi đến nút đó. Cây con $b$: $a,c$, rồi cây con $e$ ($f,g,e$), rồi $b$: cho $a,c,f,g,e,b$. Cây con $h$: $i$, rồi cây con $l$ ($j$, rồi cây con $m$: $k,n,m$, rồi $o,p$, rồi $l$): cho $i,j,k,n,m,o,p,l$, rồi $h$. Đầy đủ: $a,c,f,g,e,b,i,j,k,n,m,o,p,l,h,d$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine the order in which a preorder traversal visits the vertices of the given rooted tree: root $a$ with children $b,c$; $b$'s children $d,e$; $e$'s children $f,g$.|||Xác định thứ tự phép duyệt tiền thứ thăm các đỉnh của cây có gốc cho trước: gốc $a$ với con $b,c$; con của $b$ là $d,e$; con của $e$ là $f,g$.",
          "options": [
            {
              "text": "a,b,c,d,e,f,g|||a,b,c,d,e,f,g"
            },
            {
              "text": "a,b,d,e,f,g,c|||a,b,d,e,f,g,c"
            },
            {
              "text": "a,b,d,e,f,g|||a,b,d,e,f,g"
            },
            {
              "text": "f,g,d,e,b,c,a|||f,g,d,e,b,c,a"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Preorder = node, then children left-to-right recursively. $a$, then $b$'s subtree ($b,d$, then $e$'s subtree $e,f,g$), then $c$. Full order: $a,b,d,e,f,g,c$.</div><div class=\"ml-vi\">Tiền thứ = nút, rồi các con trái sang phải đệ quy. $a$, rồi cây con $b$ ($b,d$, rồi cây con $e$: $e,f,g$), rồi $c$. Thứ tự đầy đủ: $a,b,d,e,f,g,c$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are correct? (i) If a simple graph is connected, then it has a spanning tree. (ii) If a simple graph is not connected, then it does not have a spanning tree. (iii) If a simple graph does not have a spanning tree, then it is not connected.|||Phát biểu nào sau đây đúng? (i) Nếu một đơn đồ thị liên thông, thì nó có cây khung. (ii) Nếu một đơn đồ thị không liên thông, thì nó không có cây khung. (iii) Nếu một đơn đồ thị không có cây khung, thì nó không liên thông.",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Only (iii)|||Chỉ (iii)"
            },
            {
              "text": "None of them.|||Không cái nào."
            },
            {
              "text": "All of (i), (ii) and (iii)|||Tất cả (i), (ii) và (iii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">(i) is the fundamental theorem: every connected graph has a spanning tree. (ii) is true: a disconnected graph cannot have a single tree spanning all its vertices. (iii) is exactly the logical contrapositive of (i), hence equally true. All three are correct.</div><div class=\"ml-vi\">(i) là định lý cơ bản: mọi đồ thị liên thông đều có cây khung. (ii) đúng: đồ thị không liên thông không thể có một cây khung duy nhất trải khắp mọi đỉnh. (iii) chính là phản đảo logic của (i), nên cũng đúng. Cả ba đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the total weight of the minimum spanning tree produced by the graph with vertices $a,b,c,d,e,f,g,h,i,j$ (3x3-ish grid) and edges $ab{=}2,bc{=}3,cd{=}1,ae{=}3,bf{=}1,cg{=}2,dh{=}5,ef{=}4,fg{=}3,gh{=}3,ei{=}4,fj{=}2,ij{=}3$?|||Tổng trọng số của cây khung nhỏ nhất từ đồ thị với các đỉnh $a,b,c,d,e,f,g,h,i,j$ (dạng lưới 3x3) và các cạnh $ab{=}2,bc{=}3,cd{=}1,ae{=}3,bf{=}1,cg{=}2,dh{=}5,ef{=}4,fg{=}3,gh{=}3,ei{=}4,fj{=}2,ij{=}3$ là bao nhiêu?",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "18|||18"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "23|||23"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Kruskal's algorithm, increasing order: $cd(1)$ add, $bf(1)$ add, $ab(2)$ add, $cg(2)$ add, $fj(2)$ add, $bc(3)$ add (joins the two groups), $ae(3)$ add, $fg(3)$ skip (cycle), $gh(3)$ add, $ij(3)$ add -- 9 edges span all 10 vertices. Total: $1+1+2+2+2+3+3+3+3=20$.</div><div class=\"ml-vi\">Thuật toán Kruskal, thứ tự tăng dần: $cd(1)$ thêm, $bf(1)$ thêm, $ab(2)$ thêm, $cg(2)$ thêm, $fj(2)$ thêm, $bc(3)$ thêm (nối hai nhóm), $ae(3)$ thêm, $fg(3)$ bỏ qua (chu trình), $gh(3)$ thêm, $ij(3)$ thêm -- 9 cạnh trải khắp 10 đỉnh. Tổng: $1+1+2+2+2+3+3+3+3=20$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the proposition: \"If I have one million dollars then I will buy a villa\". Choose the correct answer. (i) \"If I have one million dollars then I will not buy a villa\" (ii) \"I have one million dollars but I will not buy a villa\" (iii) \"I will buy a villa as soon as I have one million dollars\"|||Tìm phủ định của mệnh đề: \"Nếu tôi có một triệu đô la thì tôi sẽ mua một biệt thự\". Chọn đáp án đúng. (i) \"Nếu tôi có một triệu đô la thì tôi sẽ không mua biệt thự\" (ii) \"Tôi có một triệu đô la nhưng tôi sẽ không mua biệt thự\" (iii) \"Tôi sẽ mua biệt thự ngay khi tôi có một triệu đô la\"",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of them is correct|||Không cái nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The statement is $p\\to q$. Its negation is $\\neg(p\\to q)=p\\land\\neg q$: \"I have one million dollars but I will not buy a villa\", option (ii).</div><div class=\"ml-vi\">Mệnh đề là $p\\to q$. Phủ định của nó là $\\neg(p\\to q)=p\\land\\neg q$: \"Tôi có một triệu đô la nhưng tôi sẽ không mua biệt thự\", đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many divisions are needed when using the Euclidean algorithm to find the greatest common divisor of 6468 and 3135?|||Cần bao nhiêu phép chia khi dùng thuật toán Euclid để tìm ước chung lớn nhất của 6468 và 3135?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$6468=2(3135)+198$. $3135=15(198)+165$. $198=1(165)+33$. $165=5(33)+0$. That's 4 divisions.</div><div class=\"ml-vi\">$6468=2(3135)+198$. $3135=15(198)+165$. $198=1(165)+33$. $165=5(33)+0$. Đó là 4 phép chia.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $m$ and $n$ such that the complete bi-partite graph $K_{m,n}$ have Hamilton circuits.|||Tìm tất cả giá trị $m$ và $n$ sao cho đồ thị lưỡng phân đầy đủ $K_{m,n}$ có chu trình Hamilton.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "m=n and m ≥ 2|||m=n và m ≥ 2"
            },
            {
              "text": "m=n and m ≥ 3|||m=n và m ≥ 3"
            },
            {
              "text": "m>n and n ≥ 2|||m>n và n ≥ 2"
            },
            {
              "text": "m>n and n ≥ 3|||m>n và n ≥ 3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A Hamilton circuit in a bipartite graph must alternate between the two parts equally, requiring $m=n$. The smallest case forming an actual cycle is $K_{2,2}=C_4$, so $m=n$ and $m\\ge2$.</div><div class=\"ml-vi\">Chu trình Hamilton trong đồ thị lưỡng phân phải luân phiên đều giữa hai phía, đòi hỏi $m=n$. Trường hợp nhỏ nhất thực sự tạo chu trình là $K_{2,2}=C_4$, nên $m=n$ và $m\\ge2$.</div>"
        }
      ]
    }
  ]
};
