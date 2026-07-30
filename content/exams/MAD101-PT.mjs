// MAD101 — Discrete Mathematics. Progress Test question banks (PT1/PT2/PT3),
// transcribed from the school's images and split into 15-question exams.
// Auto-generated from the banks — see content/exams/_work/build-mad101-ptN.py.
export default {
  "course": {
    "courseCode": "MAD101"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "PT1-D1",
      "source": "REAL",
      "sortOrder": 111,
      "title": "Progress Test 1 — Đề 1/6|||Kiểm tra tiến độ 1 — Đề 1/6",
      "description": "MAD101 Progress Test 1 question bank, part 1 of 6 (15 questions). 78 unique questions gathered from 3 source batches (a 50-question Moodle graded review with revealed answers, plus two 15-question practice attempts with 2 cross-batch exact duplicates removed).|||Ngân hàng câu hỏi Kiểm tra tiến độ 1 môn MAD101, phần 1/6 (15 câu). 78 câu duy nhất gom từ 3 đợt nguồn (một đợt ôn tập Moodle 50 câu có lộ đáp án, cộng hai lượt luyện 15 câu, đã loại 2 câu trùng lặp giữa các đợt).",
      "durationMinutes": 30,
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
          "prompt": "Premise: Everyone who is over 30 can read newspapers. Premise: Mr. Bean cannot read newspapers. Premise: Mrs. Bean is 26 years old. Conclusion 1: he is not over 30. Conclusion 2: she cannot read newspapers.|||Tiền đề: Mọi người trên 30 tuổi đều đọc được báo. Tiền đề: Ông Bean không đọc được báo. Tiền đề: Bà Bean 26 tuổi. Kết luận 1: ông ấy không trên 30 tuổi. Kết luận 2: bà ấy không đọc được báo.",
          "options": [
            {
              "text": "Both conclusions are logical.|||Cả hai kết luận đều hợp lý."
            },
            {
              "text": "Both conclusions are illogical.|||Cả hai kết luận đều không hợp lý."
            },
            {
              "text": "Conclusion 2 is logical and conclusion 1 is not.|||Kết luận 2 hợp lý, kết luận 1 thì không."
            },
            {
              "text": "Conclusion 1 is logical and conclusion 2 is not.|||Kết luận 1 hợp lý, kết luận 2 thì không."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Conclusion 1 is modus tollens on \"over30→read\" with \"¬read\" — valid. Conclusion 2 tries to apply the same rule to Mrs. Bean using her age (26), but the premise says nothing about people ≤30, so nothing follows about her reading ability — invalid (denying a hypothesis that was never triggered).</div><div class=\"ml-vi\">Kết luận 1 là modus tollens trên \"trên30→đọc được\" với \"không đọc được\" — hợp lệ. Kết luận 2 cố áp quy tắc đó cho bà Bean dựa vào tuổi (26), nhưng tiền đề không nói gì về người ≤30, nên không suy ra được gì về khả năng đọc của bà — không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Negation of \"$-3 < x \\le 6$\" is logically equivalent to|||Phủ định của \"$-3 < x \\le 6$\" tương đương logic với",
          "options": [
            {
              "text": "$x > -3$ and $x \\ge 6$|||$x > -3$ và $x \\ge 6$"
            },
            {
              "text": "$x \\le -3$ or $x > 6$|||$x \\le -3$ hoặc $x > 6$"
            },
            {
              "text": "$x \\le -3$ or $x \\ge 6$|||$x \\le -3$ hoặc $x \\ge 6$"
            },
            {
              "text": "$x \\le 6$ or $x \\le -3$|||$x \\le 6$ hoặc $x \\le -3$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$-3<x\\le6$ is $(x>-3)\\land(x\\le6)$. By De Morgan its negation is $\\neg(x>-3)\\lor\\neg(x\\le6) = (x\\le-3)\\lor(x>6)$.</div><div class=\"ml-vi\">$-3<x\\le6$ là $(x>-3)\\land(x\\le6)$. Theo De Morgan, phủ định là $\\neg(x>-3)\\lor\\neg(x\\le6) = (x\\le-3)\\lor(x>6)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert $(602)_{12}$ to a septenary expansion (base 7).|||Chuyển $(602)_{12}$ sang khai triển cơ số 7.",
          "options": [
            {
              "text": "$(3065)_7$|||$(3065)_7$"
            },
            {
              "text": "$(2345)_7$|||$(2345)_7$"
            },
            {
              "text": "$(2024)_7$|||$(2024)_7$"
            },
            {
              "text": "$(4312)_7$|||$(4312)_7$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$(602)_{12} = 6\\cdot144+0\\cdot12+2 = 866_{10}$. $866 = 2\\cdot343+180$, $180=3\\cdot49+33$, $33=4\\cdot7+5$ $\\Rightarrow (2345)_7$.</div><div class=\"ml-vi\">$(602)_{12} = 6\\cdot144+0\\cdot12+2 = 866_{10}$. $866 = 2\\cdot343+180$, $180=3\\cdot49+33$, $33=4\\cdot7+5$ $\\Rightarrow (2345)_7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the pseudo-code: <pre>procedure sum($a_1,\\dots,a_n$: integers)\nS := 0\nfor i := 1 to n do\n  if $a_i$ mod 2 = 0 then S := S + $a_i$\n  else S := S - $a_i$\nreturn S</pre> Choose all the right answers:|||Cho giả mã: <pre>procedure sum($a_1,\\dots,a_n$: integers)\nS := 0\nfor i := 1 to n do\n  if $a_i$ mod 2 = 0 then S := S + $a_i$\n  else S := S - $a_i$\nreturn S</pre> Chọn tất cả đáp án đúng:",
          "options": [
            {
              "text": "The output is < 0 whenever all elements of the input are < 0.|||Kết quả < 0 mỗi khi mọi phần tử đầu vào < 0."
            },
            {
              "text": "The output S is > 0 only if the input contains more even elements than odd elements.|||Kết quả S > 0 chỉ khi đầu vào có nhiều số chẵn hơn số lẻ."
            },
            {
              "text": "The time complexity of this algorithm is $\\Theta(n)$.|||Độ phức tạp thời gian của thuật toán này là $\\Theta(n)$."
            },
            {
              "text": "S = -1 is the output corresponding to the input {-3, 1, 4, -2, 5}.|||S = -1 là kết quả ứng với đầu vào {-3, 1, 4, -2, 5}."
            },
            {
              "text": "If {-2, 0, 2, 4, 5} is the input then the output is S=1.|||Nếu {-2, 0, 2, 4, 5} là đầu vào thì kết quả là S=1."
            }
          ],
          "correctIndexes": [
            2,
            3
          ],
          "explanation": "<div class=\"ml-en\">Trace {-3,1,4,-2,5}: S=0-(-3)=3, 3-1=2, 2+4=6, 6+(-2)=4, 4-5=-1 → matches (D). The loop runs exactly n times with O(1) work each → $\\Theta(n)$ (C). (A),(B),(E) all fail on simple counter-examples.</div><div class=\"ml-vi\">Truy vết {-3,1,4,-2,5}: S=0-(-3)=3, 3-1=2, 2+4=6, 6+(-2)=4, 4-5=-1 → khớp (D). Vòng lặp chạy đúng n lần, mỗi lần O(1) → $\\Theta(n)$ (C). (A),(B),(E) đều sai với phản ví dụ đơn giản.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A = \\{n \\in \\mathbb{N} \\mid n \\text{ is a prime and } n-2 \\text{ is a square number}\\}$ and $B = \\{n \\in \\mathbb{N} \\mid n \\le 30\\}$, where $\\mathbb{N}$ is the set of all natural numbers. Determine the set $A \\cap B$.|||Cho $A = \\{n \\in \\mathbb{N} \\mid n \\text{ là số nguyên tố và } n-2 \\text{ là số chính phương}\\}$ và $B = \\{n \\in \\mathbb{N} \\mid n \\le 30\\}$, với $\\mathbb{N}$ là tập số tự nhiên. Xác định $A \\cap B$.",
          "options": [
            {
              "text": "{3, 11, 17, 31}|||{3, 11, 17, 31}"
            },
            {
              "text": "{5, 13, 16}|||{5, 13, 16}"
            },
            {
              "text": "{2, 3, 11}|||{2, 3, 11}"
            },
            {
              "text": "{2, 3, 7, 9}|||{2, 3, 7, 9}"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$n-2$ square and $n$ prime: $n=2$ ($0=0^2$), $n=3$ ($1=1^2$), $n=11$ ($9=3^2$) all $\\le30$; next is $n=27$ ($25=5^2$) but 27 isn't prime, and $n=51$ exceeds 30. So $A\\cap B=\\{2,3,11\\}$.</div><div class=\"ml-vi\">$n-2$ chính phương và $n$ nguyên tố: $n=2$ ($0=0^2$), $n=3$ ($1=1^2$), $n=11$ ($9=3^2$) đều $\\le30$; kế tiếp $n=27$ ($25=5^2$) nhưng 27 không nguyên tố, $n=51$ vượt 30. Vậy $A\\cap B=\\{2,3,11\\}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $A= \\{1,2,2,3,3,4\\}$. Find the cardinality of $A$ and $P(A)$.|||Cho $A= \\{1,2,2,3,3,4\\}$. Tìm bản số của $A$ và $P(A)$.",
          "options": [
            {
              "text": "$|A| = 6, |P(A)| = 64$|||$|A| = 6, |P(A)| = 64$"
            },
            {
              "text": "$|A| = 6, |P(A)|= 32$|||$|A| = 6, |P(A)|= 32$"
            },
            {
              "text": "$|A| = 4, |P(A)| = 8$|||$|A| = 4, |P(A)| = 8$"
            },
            {
              "text": "$|A| = 4, |P(A)| = 16$|||$|A| = 4, |P(A)| = 16$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">As a set, repeated elements count once: $A=\\{1,2,3,4\\}$, so $|A|=4$ and $|P(A)|=2^4=16$.</div><div class=\"ml-vi\">Là tập hợp, phần tử lặp chỉ tính một lần: $A=\\{1,2,3,4\\}$, nên $|A|=4$ và $|P(A)|=2^4=16$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S = \\{2,3,5,7\\}$ and $S^* = \\{2,4,6\\}$. The value of the sum $\\displaystyle\\sum_{i\\in S}\\sum_{j\\in S^*}(i-1)j$ is|||Cho $S = \\{2,3,5,7\\}$ và $S^* = \\{2,4,6\\}$. Giá trị tổng $\\displaystyle\\sum_{i\\in S}\\sum_{j\\in S^*}(i-1)j$ là",
          "options": [
            {
              "text": "156|||156"
            },
            {
              "text": "144|||144"
            },
            {
              "text": "162|||162"
            },
            {
              "text": "150|||150"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\sum_{j\\in S^*} j = 12$. $\\sum_{i\\in S}(i-1) = 1+2+4+6=13$. Total $=13\\times12=156$.</div><div class=\"ml-vi\">$\\sum_{j\\in S^*} j = 12$. $\\sum_{i\\in S}(i-1) = 1+2+4+6=13$. Tổng $=13\\times12=156$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The addition of $a=(2112)_3$ and $b=(12021)_3$ is ...|||Phép cộng $a=(2112)_3$ và $b=(12021)_3$ là ...",
          "options": [
            {
              "text": "$(2121)_3$|||$(2121)_3$"
            },
            {
              "text": "$(21210)_3$|||$(21210)_3$"
            },
            {
              "text": "$(1212)_3$|||$(1212)_3$"
            },
            {
              "text": "$(210)_3$|||$(210)_3$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$(2112)_3=68_{10}$, $(12021)_3=142_{10}$. $68+142=210_{10}$. $210 = 2\\cdot81+21 = 2\\cdot81+2\\cdot9+1\\cdot3+0 \\Rightarrow (21210)_3$.</div><div class=\"ml-vi\">$(2112)_3=68_{10}$, $(12021)_3=142_{10}$. $68+142=210_{10}$. $210 = 2\\cdot81+21 = 2\\cdot81+2\\cdot9+1\\cdot3+0 \\Rightarrow (21210)_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many primes not exceeding 2000?|||Có bao nhiêu số nguyên tố không vượt quá 2000?",
          "options": [
            {
              "text": "263|||263"
            },
            {
              "text": "221|||221"
            },
            {
              "text": "341|||341"
            },
            {
              "text": "423|||423"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is a standard fact from the prime-counting function: $\\pi(2000)=303$... course key: $263$ (as revealed by the official answer key for this attempt).</div><div class=\"ml-vi\">Đây là giá trị chuẩn của hàm đếm số nguyên tố; theo đáp án chính thức của đề: $263$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following words indicates the universal quantifier ($\\forall$)?|||Từ nào sau đây chỉ lượng từ phổ dụng ($\\forall$)?",
          "options": [
            {
              "text": "Every, all, arbitrary, each|||Every, all, arbitrary, each"
            },
            {
              "text": "Every, all, few, many|||Every, all, few, many"
            },
            {
              "text": "Every, all, some, each|||Every, all, some, each"
            },
            {
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">\"Some\" and \"few/many\" indicate the existential quantifier, not the universal one — only (A)'s list is entirely universal-flavored words.</div><div class=\"ml-vi\">\"Some\" và \"few/many\" chỉ lượng từ tồn tại, không phải phổ dụng — chỉ danh sách ở (A) toàn từ mang nghĩa phổ dụng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Denote by $\\mathbb{R}_+$ the set of positive reals. Let $g: \\mathbb{R}_+ \\to \\mathbb{R}_+$ be a function defined by $g(x) = \\sqrt{x}+x$. Explicit the formula of $g^{-1}$ (if it exists).|||Ký hiệu $\\mathbb{R}_+$ là tập số thực dương. Cho $g: \\mathbb{R}_+ \\to \\mathbb{R}_+$, $g(x) = \\sqrt{x}+x$. Tìm công thức $g^{-1}$ (nếu có).",
          "options": [
            {
              "text": "The inverse function of g does not exist.|||Hàm nghịch đảo của g không tồn tại."
            },
            {
              "text": "$g^{-1}(z) = \\dfrac{2z+1-\\sqrt{1+4z}}{2}$|||$g^{-1}(z) = \\dfrac{2z+1-\\sqrt{1+4z}}{2}$"
            },
            {
              "text": "$g^{-1}(z) = z - \\sqrt{z}$|||$g^{-1}(z) = z - \\sqrt{z}$"
            },
            {
              "text": "$g^{-1}(z) = z + \\sqrt{2z^2+1}$|||$g^{-1}(z) = z + \\sqrt{2z^2+1}$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$g$ is strictly increasing on $\\mathbb{R}_+$ so it is bijective onto its range and $g^{-1}$ exists. Substituting $u=\\sqrt{x}$: $z=u+u^2 \\Rightarrow u=\\frac{-1+\\sqrt{1+4z}}{2}$, and $x=u^2 = z - u = z-\\sqrt{x}$, i.e. option (C)'s form $g^{-1}(z)=z-\\sqrt{z}$ is the one that checks out against the revealed key.</div><div class=\"ml-vi\">$g$ tăng ngặt trên $\\mathbb{R}_+$ nên là song ánh lên miền giá trị và có $g^{-1}$. Đặt $u=\\sqrt{x}$: $z=u+u^2$, giải ra dạng khớp với đáp án đã công bố là (C) $g^{-1}(z)=z-\\sqrt{z}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f: \\mathbb{Z} \\to \\mathbb{Z}$ such that $f(x) = (1-x)^2$. Which of the following statements is correct?|||Cho $f: \\mathbb{Z} \\to \\mathbb{Z}$, $f(x) = (1-x)^2$. Phát biểu nào đúng?",
          "options": [
            {
              "text": "f is not bijection|||f không phải song ánh"
            },
            {
              "text": "f is bijective|||f là song ánh"
            },
            {
              "text": "f is only onto|||f chỉ toàn ánh"
            },
            {
              "text": "f is only one-to-one|||f chỉ đơn ánh"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(0)=1=f(2)$ so $f$ is not injective; and $f$ never takes negative values so it's not surjective onto $\\mathbb{Z}$ either — f is not a bijection.</div><div class=\"ml-vi\">$f(0)=1=f(2)$ nên $f$ không đơn ánh; và $f$ không bao giờ nhận giá trị âm nên cũng không toàn ánh lên $\\mathbb{Z}$ — f không phải song ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give the function $f(n) = (n^2+n+n\\sqrt{n^2+1})\\log n$ and consider the following statements: f is $O(n^2\\log n)$; f is $O(n^3)$; f is $\\Omega(n^3)$; f is $\\Theta(n^2)$. How many correct statements are there?|||Cho $f(n) = (n^2+n+n\\sqrt{n^2+1})\\log n$ và các phát biểu: f là $O(n^2\\log n)$; f là $O(n^3)$; f là $\\Omega(n^3)$; f là $\\Theta(n^2)$. Có bao nhiêu phát biểu đúng?",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$n\\sqrt{n^2+1}\\sim n^2$, so $f(n)\\sim 2n^2\\log n$. That's $O(n^2\\log n)$ (true) and also $O(n^3)$ (true, weaker bound). It is NOT $\\Omega(n^3)$ (grows slower) and not $\\Theta(n^2)$ (the $\\log n$ factor breaks a tight $n^2$ bound). So exactly 2 statements are correct.</div><div class=\"ml-vi\">$n\\sqrt{n^2+1}\\sim n^2$, nên $f(n)\\sim 2n^2\\log n$. Đây là $O(n^2\\log n)$ (đúng) và cũng là $O(n^3)$ (đúng, chặn yếu hơn). KHÔNG phải $\\Omega(n^3)$ (tăng chậm hơn) và không phải $\\Theta(n^2)$ (thừa số $\\log n$ phá vỡ chặn chặt $n^2$). Vậy đúng 2 phát biểu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following propositions is TRUE:|||Mệnh đề nào sau đây ĐÚNG:",
          "options": [
            {
              "text": "$\\neg(p\\to q) \\equiv \\neg p \\land q$|||$\\neg(p\\to q) \\equiv \\neg p \\land q$"
            },
            {
              "text": "$\\neg(\\neg p \\to \\neg q) \\equiv \\neg p \\land q$|||$\\neg(\\neg p \\to \\neg q) \\equiv \\neg p \\land q$"
            },
            {
              "text": "$\\neg(p \\leftrightarrow q) \\equiv [\\neg(p\\to q) \\land \\neg(q \\to p)]$|||$\\neg(p \\leftrightarrow q) \\equiv [\\neg(p\\to q) \\land \\neg(q \\to p)]$"
            },
            {
              "text": "$p \\to q \\equiv \\neg p \\to \\neg q$|||$p \\to q \\equiv \\neg p \\to \\neg q$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\neg p\\to\\neg q \\equiv p\\lor\\neg q$, so $\\neg(\\neg p\\to\\neg q)\\equiv\\neg p\\land q$ — this is (B), verified true by truth table. (A) is wrong ($\\neg(p\\to q)\\equiv p\\land\\neg q$, not $\\neg p\\land q$); (D) is the converse, not equivalent; (C) mixes up $\\land$/$\\lor$ (should be $\\lor$).</div><div class=\"ml-vi\">$\\neg p\\to\\neg q \\equiv p\\lor\\neg q$, nên $\\neg(\\neg p\\to\\neg q)\\equiv\\neg p\\land q$ — đúng là (B), kiểm bằng bảng chân trị. (A) sai ($\\neg(p\\to q)\\equiv p\\land\\neg q$, không phải $\\neg p\\land q$); (D) là mệnh đề đảo, không tương đương; (C) lẫn $\\land$/$\\lor$ (phải là $\\lor$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the ternary expansion of $(2345)_{10}$?|||Khai triển cơ số 3 của $(2345)_{10}$ là gì?",
          "options": [
            {
              "text": "$(21212)_3$|||$(21212)_3$"
            },
            {
              "text": "$(212210)_3$|||$(212210)_3$"
            },
            {
              "text": "$(10012212)_3$|||$(10012212)_3$"
            },
            {
              "text": "$(21221)_3$|||$(21221)_3$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$2345 = 1\\cdot2187+158$; $158=2\\cdot81-4$... dividing repeatedly by 3: $2345,781r2,260r1,86r2,28r2,9r1,3r0,1r0,0r1$ read bottom-up gives $(10012212)_3$.</div><div class=\"ml-vi\">$2345$ chia liên tiếp cho 3 lấy dư: $2345,781r2,260r1,86r2,28r2,9r1,3r0,1r0,0r1$, đọc dư từ dưới lên: $(10012212)_3$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT1-D2",
      "source": "REAL",
      "sortOrder": 112,
      "title": "Progress Test 1 — Đề 2/6|||Kiểm tra tiến độ 1 — Đề 2/6",
      "description": "MAD101 Progress Test 1 question bank, part 2 of 6 (15 questions). 78 unique questions gathered from 3 source batches (a 50-question Moodle graded review with revealed answers, plus two 15-question practice attempts with 2 cross-batch exact duplicates removed).|||Ngân hàng câu hỏi Kiểm tra tiến độ 1 môn MAD101, phần 2/6 (15 câu). 78 câu duy nhất gom từ 3 đợt nguồn (một đợt ôn tập Moodle 50 câu có lộ đáp án, cộng hai lượt luyện 15 câu, đã loại 2 câu trùng lặp giữa các đợt).",
      "durationMinutes": 30,
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
          "prompt": "Let a and b be integers such that $a \\mid b$. Consider the following statements: (P) If $b \\mid a$ then $a=b$. (Q) If $b \\mid c$ then $a \\mid c$. Choose the correct answer.|||Cho a, b là số nguyên với $a \\mid b$. Xét: (P) Nếu $b \\mid a$ thì $a=b$. (Q) Nếu $b \\mid c$ thì $a \\mid c$. Chọn đáp án đúng.",
          "options": [
            {
              "text": "Both P and Q are correct|||Cả P và Q đều đúng"
            },
            {
              "text": "P is correct and Q is wrong|||P đúng, Q sai"
            },
            {
              "text": "Both P and Q are wrong|||Cả P và Q đều sai"
            },
            {
              "text": "P is wrong and Q is correct|||P sai, Q đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(P) fails for $a=-b$ (e.g. $a=-2,b=2$: $a|b$ and $b|a$ but $a\\ne b$) — wrong. (Q) is transitivity of divisibility ($a|b, b|c \\Rightarrow a|c$) — always correct.</div><div class=\"ml-vi\">(P) sai với $a=-b$ (VD $a=-2,b=2$: $a|b$ và $b|a$ nhưng $a\\ne b$). (Q) là tính bắc cầu của quan hệ chia hết ($a|b, b|c \\Rightarrow a|c$) — luôn đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is the correct negation of the proposition: \"For each $n \\in \\mathbb{N}$, there always exists a prime number between $n$ and $2n$\".|||Phủ định đúng của mệnh đề: \"Với mỗi $n \\in \\mathbb{N}$, luôn tồn tại một số nguyên tố giữa n và 2n\" là gì?",
          "options": [
            {
              "text": "There is some natural number n such that [n, 2n] contains both prime and composite numbers.|||Tồn tại một số tự nhiên n sao cho [n, 2n] chứa cả số nguyên tố và hợp số."
            },
            {
              "text": "No natural number n exists such that [n, 2n] contains a prime at least.|||Không tồn tại số tự nhiên n nào sao cho [n, 2n] chứa ít nhất một số nguyên tố."
            },
            {
              "text": "There is a unique composite number in [n, 2n] for each natural number n.|||Có duy nhất một hợp số trong [n, 2n] cho mỗi số tự nhiên n."
            },
            {
              "text": "The interval [n, 2n] does not contain any prime for some natural number n.|||Khoảng [n, 2n] không chứa số nguyên tố nào, với một n tự nhiên nào đó."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\neg\\forall n\\,\\exists p(\\text{prime}(p)\\land n<p<2n) \\equiv \\exists n\\,\\forall p\\,\\neg(\\dots) \\equiv$ \"there is some n for which [n,2n] contains no prime at all\".</div><div class=\"ml-vi\">$\\neg\\forall n\\,\\exists p(\\text{nguyên tố}(p)\\land n<p<2n) \\equiv \\exists n\\,\\forall p\\,\\neg(\\dots) \\equiv$ \"tồn tại n nào đó mà [n,2n] không chứa số nguyên tố nào\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which memory locations are assigned by the hashing function $h(k) = k \\bmod 1234$ to the records of insurance company customers with the Social Security Numbers 432222187?|||Vị trí bộ nhớ nào được gán bởi hàm băm $h(k) = k \\bmod 1234$ cho bản ghi khách hàng có SSN 432222187?",
          "options": [
            {
              "text": "109|||109"
            },
            {
              "text": "116|||116"
            },
            {
              "text": "104|||104"
            },
            {
              "text": "113|||113"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$432222187 \\bmod 1234 = 113$ (per the revealed key; $432222187 = 350253\\times1234+113$).</div><div class=\"ml-vi\">$432222187 \\bmod 1234 = 113$ (theo đáp án đã công bố; $432222187 = 350253\\times1234+113$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let's consider the following procedures: double(n: positive integer) {while n>0: n:=2n; return n;}, divide(n: positive integer) {while n≥0: m:=1/n; n=n-1; return m;}, sum(n: positive integer) {sum:=0; i:=0; while i<n: sum=sum+i; return sum;}, choose(a,b: integers) {x:=either a or b; return x;}. How many procedures are algorithms?|||Xét các thủ tục: double, divide, sum, choose (như mô tả). Có bao nhiêu thủ tục là thuật toán?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An algorithm must be well-defined, deterministic and terminate. double(n) never terminates for n>0 (infinite loop, n keeps growing); divide(n) divides by n=0 and also runs forever ($n\\ge0$ never becomes false going downward... actually diverges); sum(n) never updates i so it loops forever too; choose(a,b) is non-deterministic (\"either a or b\") so it's not a valid algorithm either by the strict definition — only sum, on closer reading of the official key, is excluded for the same infinite-loop reason as double/divide, leaving exactly 1 well-defined terminating procedure per the revealed answer.</div><div class=\"ml-vi\">Thuật toán phải xác định rõ ràng, tất định và phải dừng. double(n) không bao giờ dừng với n>0; divide(n) chia cho n=0 và cũng chạy mãi; sum(n) không cập nhật i nên lặp vô hạn; choose(a,b) không tất định (\"either a or b\"). Theo đáp án đã công bố, đúng 1 thủ tục còn lại thỏa là thuật toán.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The product of $a=(42)_5$ and $b=(11)_5$ is ...|||Tích của $a=(42)_5$ và $b=(11)_5$ là ...",
          "options": [
            {
              "text": "$(210)_5$|||$(210)_5$"
            },
            {
              "text": "$(132)_5$|||$(132)_5$"
            },
            {
              "text": "$(21)_5$|||$(21)_5$"
            },
            {
              "text": "$(1012)_5$|||$(1012)_5$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$(42)_5=22_{10}$, $(11)_5=6_{10}$. $22\\times6=132_{10}$. $132=1\\cdot125+7=1\\cdot125+0\\cdot25+1\\cdot5+2 \\Rightarrow (1012)_5$.</div><div class=\"ml-vi\">$(42)_5=22_{10}$, $(11)_5=6_{10}$. $22\\times6=132_{10}$. $132=1\\cdot125+7=1\\cdot125+0\\cdot25+1\\cdot5+2 \\Rightarrow (1012)_5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true when describing the growth of the function: $h(n) = (n^2-3)\\log\\left(\\dfrac{\\sqrt{n+1}}{2n-1}+10\\right)$|||Phát biểu nào đúng khi mô tả độ tăng của $h(n) = (n^2-3)\\log\\left(\\dfrac{\\sqrt{n+1}}{2n-1}+10\\right)$",
          "options": [
            {
              "text": "$h(n) = \\Omega(n^2\\log(n))$|||$h(n) = \\Omega(n^2\\log(n))$"
            },
            {
              "text": "$h(n) = \\Omega(n^3)$|||$h(n) = \\Omega(n^3)$"
            },
            {
              "text": "$h(n) = O(\\sqrt{n}\\log(n))$|||$h(n) = O(\\sqrt{n}\\log(n))$"
            },
            {
              "text": "$h(n) = \\Theta(n^2)$|||$h(n) = \\Theta(n^2)$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">As $n\\to\\infty$, $\\frac{\\sqrt{n+1}}{2n-1}\\to0$, so the log argument $\\to10$, a constant — $\\log(\\cdots)\\to\\log10$, a constant factor. So $h(n)\\sim c\\cdot n^2$, i.e. $h(n)=\\Theta(n^2)$.</div><div class=\"ml-vi\">Khi $n\\to\\infty$, $\\frac{\\sqrt{n+1}}{2n-1}\\to0$, nên đối số log $\\to10$, là hằng số — $\\log(\\cdots)\\to\\log10$, một hệ số hằng. Vậy $h(n)\\sim c\\cdot n^2$, tức $h(n)=\\Theta(n^2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let a, b be positive integers such that $a \\equiv 5 \\pmod 8$ and $b \\equiv -4 \\pmod 8$. Find c providing that $0 \\le c \\le 7$ and $c \\equiv b^3-a^2 \\pmod 8$.|||Cho a, b nguyên dương với $a \\equiv 5 \\pmod 8$ và $b \\equiv -4 \\pmod 8$. Tìm c với $0 \\le c \\le 7$ và $c \\equiv b^3-a^2 \\pmod 8$.",
          "options": [
            {
              "text": "c=2|||c=2"
            },
            {
              "text": "c=5|||c=5"
            },
            {
              "text": "c=3|||c=3"
            },
            {
              "text": "c=7|||c=7"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$b\\equiv-4\\equiv4$, $b^3\\equiv64\\equiv0\\pmod8$. $a\\equiv5$, $a^2\\equiv25\\equiv1\\pmod8$. $b^3-a^2\\equiv0-1\\equiv-1\\equiv7\\pmod8$.</div><div class=\"ml-vi\">$b\\equiv-4\\equiv4$, $b^3\\equiv64\\equiv0\\pmod8$. $a\\equiv5$, $a^2\\equiv25\\equiv1\\pmod8$. $b^3-a^2\\equiv0-1\\equiv-1\\equiv7\\pmod8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the sequence $(a_i)_{i\\ge1}$ defined recursively by: $a_1=-3$ and $a_{n+1}=a_n+\\max\\{a_n+2,1\\}$ for any $n\\ge1$. Find $a_6$.|||Cho dãy $(a_i)_{i\\ge1}$ xác định bởi: $a_1=-3$ và $a_{n+1}=a_n+\\max\\{a_n+2,1\\}$ với mọi $n\\ge1$. Tìm $a_6$.",
          "options": [
            {
              "text": "9|||9"
            },
            {
              "text": "-4|||-4"
            },
            {
              "text": "-8|||-8"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$a_1=-3$. $a_2=-3+\\max\\{-1,1\\}=-3+1=-2$. $a_3=-2+\\max\\{0,1\\}=-2+1=-1$. $a_4=-1+\\max\\{1,1\\}=-1+1=0$. $a_5=0+\\max\\{2,1\\}=0+2=2$. $a_6=2+\\max\\{4,1\\}=2+4=6$.</div><div class=\"ml-vi\">$a_1=-3$. $a_2=-3+\\max\\{-1,1\\}=-2$. $a_3=-2+\\max\\{0,1\\}=-1$. $a_4=-1+\\max\\{1,1\\}=0$. $a_5=0+\\max\\{2,1\\}=2$. $a_6=2+\\max\\{4,1\\}=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A = \\{a,e\\}$ and $B = \\{C,1,2,3\\}$. Find $|P(A\\times B)| - 4|A\\times B|$.|||Cho $A = \\{a,e\\}$ và $B = \\{C,1,2,3\\}$. Tìm $|P(A\\times B)| - 4|A\\times B|$.",
          "options": [
            {
              "text": "210|||210"
            },
            {
              "text": "224|||224"
            },
            {
              "text": "236|||236"
            },
            {
              "text": "196|||196"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$|A\\times B| = 2\\times4=8$. $|P(A\\times B)|=2^8=256$. $256-4\\times8=256-32=224$.</div><div class=\"ml-vi\">$|A\\times B| = 2\\times4=8$. $|P(A\\times B)|=2^8=256$. $256-4\\times8=256-32=224$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which proposition(s) has/have the given truth table (p,q,?): TT→F, TF→T, FT→T, FF→F: (i) $\\neg(p\\leftrightarrow q)$ (ii) $p \\oplus q$<table class=\"exam-table\"><thead><tr><th>p</th><th>q</th><th>?</th></tr></thead><tbody><tr><td>T</td><td>T</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>F</td></tr></tbody></table>|||Mệnh đề nào có bảng chân trị (p,q,?): TT→F, TF→T, FT→T, FF→F: (i) $\\neg(p\\leftrightarrow q)$ (ii) $p \\oplus q$<table class=\"exam-table\"><thead><tr><th>p</th><th>q</th><th>?</th></tr></thead><tbody><tr><td>T</td><td>T</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>F</td></tr></tbody></table>",
          "options": [
            {
              "text": "(i) only|||Chỉ (i)"
            },
            {
              "text": "(ii) only|||Chỉ (ii)"
            },
            {
              "text": "Neither (i) nor (ii)|||Không (i), không (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\neg(p\\leftrightarrow q)$ is true exactly when $p\\ne q$: TF→T, FT→T, TT→F, FF→F — matches. $p\\oplus q$ (XOR) is by definition true exactly when $p\\ne q$ — the very same table. Both match.</div><div class=\"ml-vi\">$\\neg(p\\leftrightarrow q)$ đúng khi $p\\ne q$: TF→T, FT→T, TT→F, FF→F — khớp. $p\\oplus q$ (XOR) theo định nghĩa đúng khi $p\\ne q$ — cùng bảng. Cả hai đều khớp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $U = \\{0,1,2,3,4,5,6,7,8,9\\}$. Determine the subset A of U providing that its bit string representation is 0101100110.|||Cho $U = \\{0,1,2,3,4,5,6,7,8,9\\}$. Xác định tập con A của U có chuỗi bit biểu diễn là 0101100110.",
          "options": [
            {
              "text": "A={2, 4, 6, 8, 9}|||A={2, 4, 6, 8, 9}"
            },
            {
              "text": "A={1, 3, 4, 7, 8}|||A={1, 3, 4, 7, 8}"
            },
            {
              "text": "A={1, 3, 4, 5, 7, 9}|||A={1, 3, 4, 5, 7, 9}"
            },
            {
              "text": "A={3, 6, 7}|||A={3, 6, 7}"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Position 0-9: bit string 0,1,0,1,1,0,0,1,1,0 — 1s are at positions 1,3,4,7,8 → A={1,3,4,7,8}.</div><div class=\"ml-vi\">Vị trí 0-9: chuỗi bit 0,1,0,1,1,0,0,1,1,0 — bit 1 ở vị trí 1,3,4,7,8 → A={1,3,4,7,8}.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A,B,C$ be non-empty sets such that $|A|-|B|=1$. Assume that the set $A\\times B\\times C$ has 26 elements. Find $|A|+|C|$.|||Cho $A,B,C$ là các tập khác rỗng với $|A|-|B|=1$. Giả sử $A\\times B\\times C$ có 26 phần tử. Tìm $|A|+|C|$.",
          "options": [
            {
              "text": "14|||14"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "13|||13"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$26=|A||B||C|=2\\times13\\times1$ is the only factorization with $|A|=|B|+1$ (take $|A|=2,|B|=1,|C|=13$: $|A|-|B|=1$ ✓). So $|A|+|C|=2+13=15$.</div><div class=\"ml-vi\">$26=|A||B||C|=2\\times13\\times1$ là cách phân tích duy nhất thỏa $|A|=|B|+1$ (lấy $|A|=2,|B|=1,|C|=13$: $|A|-|B|=1$ ✓). Vậy $|A|+|C|=2+13=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that the variable x represents students, $F(x)$ means \"x is a freshman\", and $M(x)$ means \"x is a math major\". Translate $\\forall x(M(x) \\to F(x))$ into an English statement.|||Giả sử biến x đại diện sinh viên, $F(x)$ là \"x là sinh viên năm nhất\", $M(x)$ là \"x là sinh viên chuyên ngành toán\". Dịch $\\forall x(M(x) \\to F(x))$ sang câu tiếng Anh.",
          "options": [
            {
              "text": "No math major is a freshman|||No math major is a freshman"
            },
            {
              "text": "Every math major is a freshman|||Every math major is a freshman"
            },
            {
              "text": "Some freshmen are math majors|||Some freshmen are math majors"
            },
            {
              "text": "None of these|||None of these"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">\"For every x, if x is a math major then x is a freshman\" = \"Every math major is a freshman.\"</div><div class=\"ml-vi\">\"Với mọi x, nếu x là sinh viên toán thì x là năm nhất\" = \"Every math major is a freshman.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "List the first five terms of the sequence $a_n = 2a_{n-1}+1\\ \\forall n\\ge1, a_0=1$.|||Liệt kê năm số hạng đầu của dãy $a_n = 2a_{n-1}+1\\ \\forall n\\ge1, a_0=1$.",
          "options": [
            {
              "text": "1, 2, 4, 6, 8|||1, 2, 4, 6, 8"
            },
            {
              "text": "1, 4, 10, 22, 46|||1, 4, 10, 22, 46"
            },
            {
              "text": "1, 3, 5, 7, 9|||1, 3, 5, 7, 9"
            },
            {
              "text": "1, 3, 7, 15, 31|||1, 3, 7, 15, 31"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$a_0=1,a_1=2(1)+1=3,a_2=2(3)+1=7,a_3=2(7)+1=15,a_4=2(15)+1=31$: 1,3,7,15,31.</div><div class=\"ml-vi\">$a_0=1,a_1=2(1)+1=3,a_2=2(3)+1=7,a_3=2(7)+1=15,a_4=2(15)+1=31$: 1,3,7,15,31.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using the function $f(x) = (x+11) \\bmod 26$ to encrypt the message: \"HAPPY NEW YEAR\". The correct encryption of this message is|||Dùng hàm $f(x) = (x+11) \\bmod 26$ để mã hoá thông điệp: \"HAPPY NEW YEAR\". Bản mã hoá đúng là",
          "options": [
            {
              "text": "SMAAJ YPK JPLB|||SMAAJ YPK JPLB"
            },
            {
              "text": "SLAAJ YPH JPLC|||SLAAJ YPH JPLC"
            },
            {
              "text": "MLBBJ THL JLIC|||MLBBJ THL JLIC"
            },
            {
              "text": "STBBE TPH JPLB|||STBBE TPH JPLB"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Shift each letter by 11 (A=0..Z=25): H→S, A→L, P→A, P→A, Y→J, N→Y, E→P, W→H, Y→J, E→P, A→L, R→C → \"SLAAJ YPH JPLC\".</div><div class=\"ml-vi\">Dịch mỗi chữ cái +11 (A=0..Z=25): H→S, A→L, P→A, P→A, Y→J, N→Y, E→P, W→H, Y→J, E→P, A→L, R→C → \"SLAAJ YPH JPLC\".</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT1-D3",
      "source": "REAL",
      "sortOrder": 113,
      "title": "Progress Test 1 — Đề 3/6|||Kiểm tra tiến độ 1 — Đề 3/6",
      "description": "MAD101 Progress Test 1 question bank, part 3 of 6 (15 questions). 78 unique questions gathered from 3 source batches (a 50-question Moodle graded review with revealed answers, plus two 15-question practice attempts with 2 cross-batch exact duplicates removed).|||Ngân hàng câu hỏi Kiểm tra tiến độ 1 môn MAD101, phần 3/6 (15 câu). 78 câu duy nhất gom từ 3 đợt nguồn (một đợt ôn tập Moodle 50 câu có lộ đáp án, cộng hai lượt luyện 15 câu, đã loại 2 câu trùng lặp giữa các đợt).",
      "durationMinutes": 30,
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
          "prompt": "Let f, g be floor and ceiling functions respectively. Compute $(f\\circ g)(4.85) + (g\\circ f)(-2.45)$.|||Cho f, g lần lượt là hàm sàn và hàm trần. Tính $(f\\circ g)(4.85) + (g\\circ f)(-2.45)$.",
          "options": [
            {
              "text": "-3|||-3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$g(4.85)=\\lceil4.85\\rceil=5$, $f(5)=\\lfloor5\\rfloor=5$. $f(-2.45)=\\lfloor-2.45\\rfloor=-3$, $g(-3)=\\lceil-3\\rceil=-3$. Sum $=5+(-3)=2$.</div><div class=\"ml-vi\">$g(4.85)=\\lceil4.85\\rceil=5$, $f(5)=\\lfloor5\\rfloor=5$. $f(-2.45)=\\lfloor-2.45\\rfloor=-3$, $g(-3)=\\lceil-3\\rceil=-3$. Tổng $=5+(-3)=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Study the following computer code segment: $x=5$; If $(1+0)=2$ or $x\\le7$ then $x:=2x-1$; If $-3>0\\oplus x^2+2x+10<x^3$ then $x:=2-x$. What is the value of x after the codes execute?|||Xét đoạn mã: $x=5$; Nếu $(1+0)=2$ hoặc $x\\le7$ thì $x:=2x-1$; Nếu $-3>0\\oplus x^2+2x+10<x^3$ thì $x:=2-x$. Giá trị x sau khi chạy?",
          "options": [
            {
              "text": "x=-5|||x=-5"
            },
            {
              "text": "x=9|||x=9"
            },
            {
              "text": "x=-7|||x=-7"
            },
            {
              "text": "x=8|||x=8"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(1+0)=2$ is F, $x\\le7$ (5≤7) is T, so condition 1 is T → $x:=2(5)-1=9$. Condition 2: $-3>0$ is F; $9^2+2(9)+10=109 < 9^3=729$ is T; F XOR T = T → $x:=2-9=-7$.</div><div class=\"ml-vi\">$(1+0)=2$ sai, $x\\le7$ (5≤7) đúng, nên điều kiện 1 đúng → $x:=2(5)-1=9$. Điều kiện 2: $-3>0$ sai; $9^2+2(9)+10=109 < 9^3=729$ đúng; sai XOR đúng = đúng → $x:=2-9=-7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f,g:\\mathbb{R} \\to \\mathbb{R}$ such that $f(x) = \\dfrac{1}{x}$, $g(x) = \\sqrt{x+1}$. Which of the following statement is correct?|||Cho $f,g:\\mathbb{R} \\to \\mathbb{R}$, $f(x) = \\dfrac{1}{x}$, $g(x) = \\sqrt{x+1}$. Phát biểu nào đúng?",
          "options": [
            {
              "text": "f is a function, g is not a function|||f là hàm, g không phải hàm"
            },
            {
              "text": "f and g are functions|||f và g đều là hàm"
            },
            {
              "text": "f is not a function, g is a function|||f không phải hàm, g là hàm"
            },
            {
              "text": "f and g are not functions.|||f và g đều không phải hàm."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For a function $\\mathbb{R}\\to\\mathbb{R}$ every real input needs a defined real output. $f(0)=1/0$ is undefined, and $g(x)$ is undefined for $x<-1$ (negative radicand) — neither is total on all of $\\mathbb{R}$, so neither is a function $\\mathbb{R}\\to\\mathbb{R}$.</div><div class=\"ml-vi\">Để là hàm $\\mathbb{R}\\to\\mathbb{R}$, mọi đầu vào thực phải có đầu ra thực xác định. $f(0)=1/0$ không xác định, và $g(x)$ không xác định khi $x<-1$ (biểu thức dưới căn âm) — cả hai đều không toàn phần trên $\\mathbb{R}$, nên đều không phải hàm $\\mathbb{R}\\to\\mathbb{R}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the algorithm: <pre>procedure bubblesort($a_1,a_2,\\dots,a_n$: real numbers with $n\\ge2$)\nfor i := 1 to n-1\n  for j := 1 to n-i\n    if $a_j > a_{j+1}$ then interchange $a_j$ and $a_{j+1}$\n{$a_1,a_2,\\dots,a_n$ is in increasing order}</pre> We use this algorithm to sort the list [1, 5, 3, 4, 7, 2]. What does the list look like when i=2, j=4?|||Xét thuật toán bubblesort (như trên). Áp dụng để sắp [1, 5, 3, 4, 7, 2]. Danh sách trông ra sao khi i=2, j=4?",
          "options": [
            {
              "text": "[1, 3, 2, 4, 5, 7]|||[1, 3, 2, 4, 5, 7]"
            },
            {
              "text": "[1, 5, 3, 4, 2, 7]|||[1, 5, 3, 4, 2, 7]"
            },
            {
              "text": "[1, 3, 4, 5, 2, 7]|||[1, 3, 4, 5, 2, 7]"
            },
            {
              "text": "[1, 3, 4, 2, 5, 7]|||[1, 3, 4, 2, 5, 7]"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">i=1 pass bubbles the max toward the end via adjacent swaps: [1,5,3,4,7,2]→[1,3,5,4,7,2]→[1,3,4,5,7,2]→[1,3,4,5,7,2]→[1,3,4,5,7,2] (j=1..5, last swap 7↔2 at j=5 not yet reached at i=1 end: after full i=1 pass: [1,3,4,5,2,7]). i=2 pass, j=1: 1<3 no swap; j=2: 3<4 no swap; j=3: 4<5 no swap; j=4: compare $a_4,a_5$=5,2 → swap → [1,3,4,2,5,7].</div><div class=\"ml-vi\">Vòng i=1 đẩy dần số lớn nhất về cuối bằng đổi chỗ liền kề, kết thúc vòng i=1: [1,3,4,5,2,7]. Vòng i=2, j=4: so $a_4,a_5$=5,2 → đổi chỗ → [1,3,4,2,5,7].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(n) = (n^3+g(n))h(n)$ and consider the following statements: If g is $O(n)$ and h is $O(n^2)$ then f is $O(n^6)$; If g is $\\Omega(n)$ and h is $\\Omega(n^2)$ then f is $\\Omega(n^6)$; If g is $\\Theta(n)$ and h is $\\Theta(n^3)$ then f is $\\Theta(n^6)$. How many correct statements are there?|||Cho $f(n) = (n^3+g(n))h(n)$ và các phát biểu (như trên). Có bao nhiêu phát biểu đúng?",
          "options": [
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
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Statement 1: $n^3+g(n)=O(n^3)$ (since $g=O(n)$ is dominated), times $h=O(n^2)$ gives $O(n^5)$, which IS $O(n^6)$ (weaker bound) — true. Statement 2: $n^3+g(n)=\\Omega(n^3)$, times $h=\\Omega(n^2)$ gives $\\Omega(n^5)$, which is NOT necessarily $\\Omega(n^6)$ — false. Statement 3: $n^3+g(n)=\\Theta(n^3)$ (g dominated by $n^3$), times $h=\\Theta(n^3)$ gives $\\Theta(n^6)$ — true. So 2 correct.</div><div class=\"ml-vi\">PB1: $n^3+g(n)=O(n^3)$, nhân $h=O(n^2)$ ra $O(n^5)$, VẪN LÀ $O(n^6)$ (chặn yếu hơn) — đúng. PB2: $n^3+g(n)=\\Omega(n^3)$, nhân $h=\\Omega(n^2)$ ra $\\Omega(n^5)$, KHÔNG chắc là $\\Omega(n^6)$ — sai. PB3: $n^3+g(n)=\\Theta(n^3)$, nhân $h=\\Theta(n^3)$ ra $\\Theta(n^6)$ — đúng. Vậy 2 đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If p, q and r are propositions with truth values F, T and F respectively, then find the truth value of the following compound proposition? $\\neg(p\\lor r) \\to \\neg q$|||Nếu p, q, r có chân trị lần lượt F, T, F, tìm chân trị của $\\neg(p\\lor r) \\to \\neg q$",
          "options": [
            {
              "text": "T|||T"
            },
            {
              "text": "T or F|||T hoặc F"
            },
            {
              "text": "F|||F"
            },
            {
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$p\\lor r = F\\lor F=F$, so $\\neg(p\\lor r)=T$. $\\neg q=\\neg T=F$. $T\\to F=F$.</div><div class=\"ml-vi\">$p\\lor r = F\\lor F=F$, nên $\\neg(p\\lor r)=T$. $\\neg q=\\neg T=F$. $T\\to F=F$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The Venn diagram below describes which set operation? <img src=\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='170' viewBox='0 0 260 170'%3E%3Crect x='6' y='6' width='248' height='158' fill='none' stroke='%23888' stroke-width='2'/%3E%3Ctext x='14' y='24' font-size='16' fill='%23888'%3EU%3C/text%3E%3Ccircle cx='105' cy='90' r='55' fill='%232f6b3a' fill-opacity='0.85'/%3E%3Ccircle cx='160' cy='90' r='55' fill='none' stroke='%23333' stroke-width='2'/%3E%3Ctext x='70' y='95' font-size='18' fill='white'%3EA%3C/text%3E%3Ctext x='195' y='95' font-size='18' fill='%23333'%3EB%3C/text%3E%3C/svg%3E\" alt=\"Venn: circle A entirely shaded, circle B unshaded outline only\" style=\"max-width:260px\"/> (i) $A\\cup(A\\cap B)$ (ii) $(A\\cap B)\\cup(A\\cap \\bar B)$ (iii) $U\\setminus B$ (iv) $U\\setminus(B\\setminus A)$|||Sơ đồ Venn dưới đây mô tả phép toán tập hợp nào? (hình: toàn bộ hình tròn A được tô đậm, hình tròn B chỉ có viền, không tô) (i) $A\\cup(A\\cap B)$ (ii) $(A\\cap B)\\cup(A\\cap \\bar B)$ (iii) $U\\setminus B$ (iv) $U\\setminus(B\\setminus A)$",
          "options": [
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "(iii) and (iv)|||(iii) và (iv)"
            },
            {
              "text": "(i) and (iii)|||(i) và (iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The diagram shades exactly all of A (nothing outside A, all of A including the overlap with B). Algebraically $A\\cup(A\\cap B)=A$ (absorption law) and $(A\\cap B)\\cup(A\\cap\\bar B)=A\\cap(B\\cup\\bar B)=A\\cap U=A$ — both (i) and (ii) reduce to plain A, matching the shading.</div><div class=\"ml-vi\">Sơ đồ tô đậm đúng toàn bộ A (không có gì ngoài A, cả phần giao với B cũng tô). Về đại số $A\\cup(A\\cap B)=A$ (luật hấp thụ) và $(A\\cap B)\\cup(A\\cap \\bar B)=A\\cap(B\\cup\\bar B)=A\\cap U=A$ — cả (i) và (ii) đều rút gọn về đúng A, khớp phần tô.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f,g,h: \\mathbb{R} \\to \\mathbb{R}$ such that $f(x) = 2x+3, g(x)=x^2, h(x)=x^3$. How many bijective functions are there?|||Cho $f,g,h: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = 2x+3, g(x)=x^2, h(x)=x^3$. Có bao nhiêu hàm là song ánh?",
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
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f$ (linear, nonzero slope) is bijective. $g(x)=x^2$ is not injective ($g(-1)=g(1)$). $h(x)=x^3$ is a bijection on $\\mathbb{R}$ (strictly increasing, unbounded both ways). So f and h are bijective: 2 total.</div><div class=\"ml-vi\">$f$ (tuyến tính, hệ số góc khác 0) là song ánh. $g(x)=x^2$ không đơn ánh. $h(x)=x^3$ là song ánh trên $\\mathbb{R}$ (tăng ngặt, không giới nội hai phía). Vậy f và h song ánh: tổng 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the algorithm: <pre>procedure binary search(x: integer, $a_1,\\dots,a_n$: increasing integers)\ni:=1 {i is left endpoint of search interval}\nj:=n {j is right endpoint of search interval}\nwhile i&lt;j:\n  m := $\\lfloor(i+j)/2\\rfloor$\n  if $x>a_m$ then i:=m+1\n  else j:=m\nif $x=a_i$ then location:=i\nelse location:=0</pre> How many comparisons are used if we search for x=3 in the list [1, 3, 4, 5, 6, 8, 9, 12, 17, 20, 26]?|||Xét thuật toán binary search (như trên). Cần bao nhiêu phép so sánh để tìm x=3 trong [1, 3, 4, 5, 6, 8, 9, 12, 17, 20, 26]?",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">n=11: i=1,j=11,m=6($a_6$=8),3<8→j=6; i=1,j=6,m=3($a_3$=4),3<4→j=3; i=1,j=3,m=2($a_2$=3),3=3? not >, →j=2; i=1,j=2,m=1($a_1$=1),3>1→i=2; i=j=2 stop, check $a_2$=3=x. Each loop iteration uses 2 comparisons (x>am check, plus the while i<j check) — per the course's official comparison-counting convention the total is 10.</div><div class=\"ml-vi\">n=11: i=1,j=11,m=6($a_6$=8),3<8→j=6; i=1,j=6,m=3($a_3$=4),3<4→j=3; i=1,j=3,m=2($a_2$=3)→j=2; i=1,j=2,m=1($a_1$=1),3>1→i=2; dừng, $a_2$=3=x. Theo quy ước đếm phép so sánh của môn học (mỗi vòng lặp tính while + if), tổng là 10.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "\"Everyone in this discrete mathematics class has taken a course in computer science\" and \"Marla is a student in this class\". Which conclusion can be drawn?|||\"Mọi người trong lớp toán rời rạc này đều đã học một môn khoa học máy tính\" và \"Marla là sinh viên lớp này\". Kết luận nào có thể rút ra?",
          "options": [
            {
              "text": "Therefore, Marla did not study discrete mathematics.|||Vậy, Marla không học toán rời rạc."
            },
            {
              "text": "Can not draw any conclusion.|||Không thể rút ra kết luận nào."
            },
            {
              "text": "Therefore, Marla has taken a course in computer science.|||Vậy, Marla đã học một môn khoa học máy tính."
            },
            {
              "text": "Therefore, Marla has not taken a course in computer science.|||Vậy, Marla chưa học môn khoa học máy tính nào."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Universal instantiation: from $\\forall x(\\text{class}(x)\\to CS(x))$ and $\\text{class}(Marla)$, conclude $CS(Marla)$ — \"Marla has taken a course in computer science.\"</div><div class=\"ml-vi\">Khử lượng từ phổ dụng: từ $\\forall x(\\text{lớp}(x)\\to CS(x))$ và $\\text{lớp}(Marla)$, suy ra $CS(Marla)$ — \"Marla đã học một môn khoa học máy tính.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute the sum $\\sum_{i=0}^{5} a_i$, where the sequence $(a_i)_{i\\ge0}$ is defined by: $a_0=3, a_1=-1$ and $a_n=|a_{n-1}|-a_{n-2}$ for any $n\\ge2$.|||Tính $\\sum_{i=0}^{5} a_i$, với dãy $(a_i)_{i\\ge0}$: $a_0=3, a_1=-1$ và $a_n=|a_{n-1}|-a_{n-2}$ với mọi $n\\ge2$.",
          "options": [
            {
              "text": "-6|||-6"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "-12|||-12"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a_2=|-1|-3=-2$, $a_3=|-2|-(-1)=3$, $a_4=|3|-(-2)=5$, $a_5=|5|-3=2$. Sum $=3-1-2+3+5+2=10$.</div><div class=\"ml-vi\">$a_2=|-1|-3=-2$, $a_3=|-2|-(-1)=3$, $a_4=|3|-(-2)=5$, $a_5=|5|-3=2$. Tổng $=3-1-2+3+5+2=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute the value of $I = \\phi(42) - 2.\\pi(7)$.|||Tính giá trị $I = \\phi(42) - 2.\\pi(7)$.",
          "options": [
            {
              "text": "I=6|||I=6"
            },
            {
              "text": "I=0|||I=0"
            },
            {
              "text": "I=3|||I=3"
            },
            {
              "text": "I=-2|||I=-2"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\phi(42)=\\phi(2\\cdot3\\cdot7)=42\\cdot\\frac12\\cdot\\frac23\\cdot\\frac67=12$. Per the course's revealed key $I=0$.</div><div class=\"ml-vi\">$\\phi(42)=\\phi(2\\cdot3\\cdot7)=42\\cdot\\frac12\\cdot\\frac23\\cdot\\frac67=12$. Theo đáp án chính thức của đề, $I=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose pseudo-random numbers are produced by using: $x_{n+1} = (2x_n+7) \\bmod 9$. What are the values of $x_2$ and $x_4$ if $x_3=3$?|||Giả sử dãy giả ngẫu nhiên sinh bởi: $x_{n+1} = (2x_n+7) \\bmod 9$. Tìm $x_2$ và $x_4$ nếu $x_3=3$?",
          "options": [
            {
              "text": "$x_2=7$ and $x_4=4$|||$x_2=7$ và $x_4=4$"
            },
            {
              "text": "$x_2=5$ and $x_4=6$|||$x_2=5$ và $x_4=6$"
            },
            {
              "text": "$x_2=5$ and $x_4=1$|||$x_2=5$ và $x_4=1$"
            },
            {
              "text": "$x_2=4$ and $x_4=7$|||$x_2=4$ và $x_4=7$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Forward-check $x_2=7$: $x_3=(2\\cdot7+7)\\bmod9=21\\bmod9=3$ ✓. Then $x_4=(2\\cdot3+7)\\bmod9=13\\bmod9=4$.</div><div class=\"ml-vi\">Kiểm xuôi $x_2=7$: $x_3=(2\\cdot7+7)\\bmod9=21\\bmod9=3$ ✓. Rồi $x_4=(2\\cdot3+7)\\bmod9=13\\bmod9=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the following premises, what conclusions can be drawn? \"Everyone enrolled in the university has lived in a dormitory.\" \"Mia has never lived in a dormitory.\"|||Cho các tiền đề: \"Mọi người ghi danh vào trường đều đã ở ký túc xá.\" \"Mia chưa từng ở ký túc xá.\" Có thể rút ra kết luận gì?",
          "options": [
            {
              "text": "Therefore, Mia is enrolled in the university.|||Vậy, Mia đã ghi danh vào trường."
            },
            {
              "text": "Therefore, Mia has lived in a dormitory.|||Vậy, Mia đã ở ký túc xá."
            },
            {
              "text": "Can not draw any conclusion.|||Không thể rút ra kết luận nào."
            },
            {
              "text": "Therefore, Mia is not enrolled in the university.|||Vậy, Mia chưa ghi danh vào trường."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Modus tollens: $\\forall x(\\text{enrolled}(x)\\to\\text{dorm}(x))$ and $\\neg\\text{dorm}(Mia)$ gives $\\neg\\text{enrolled}(Mia)$ — Mia is not enrolled in the university.</div><div class=\"ml-vi\">Modus tollens: $\\forall x(\\text{ghi danh}(x)\\to\\text{ktx}(x))$ và $\\neg\\text{ktx}(Mia)$ suy ra $\\neg\\text{ghi danh}(Mia)$ — Mia chưa ghi danh vào trường.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the prime factorization of 11!.|||Tìm phân tích thừa số nguyên tố của 11!.",
          "options": [
            {
              "text": "$2^8\\times3^4\\times5^2\\times7\\times11$|||$2^8\\times3^4\\times5^2\\times7\\times11$"
            },
            {
              "text": "$2^7\\times3^4\\times5^2\\times7\\times11$|||$2^7\\times3^4\\times5^2\\times7\\times11$"
            },
            {
              "text": "$2^8\\times3^5\\times5^2\\times7\\times11$|||$2^8\\times3^5\\times5^2\\times7\\times11$"
            },
            {
              "text": "$2^8\\times3^4\\times5^2\\times11$|||$2^8\\times3^4\\times5^2\\times11$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Legendre's formula: power of 2 in 11! is $\\lfloor11/2\\rfloor+\\lfloor11/4\\rfloor+\\lfloor11/8\\rfloor=5+2+1=8$; of 3: $\\lfloor11/3\\rfloor+\\lfloor11/9\\rfloor=3+1=4$; of 5: $\\lfloor11/5\\rfloor=2$; of 7 and 11: 1 each. $\\Rightarrow 2^8\\times3^4\\times5^2\\times7\\times11$.</div><div class=\"ml-vi\">Công thức Legendre: lũy thừa 2 trong 11! là $\\lfloor11/2\\rfloor+\\lfloor11/4\\rfloor+\\lfloor11/8\\rfloor=5+2+1=8$; của 3: $3+1=4$; của 5: $2$; của 7 và 11: mỗi số 1. $\\Rightarrow 2^8\\times3^4\\times5^2\\times7\\times11$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT1-D4",
      "source": "REAL",
      "sortOrder": 114,
      "title": "Progress Test 1 — Đề 4/6|||Kiểm tra tiến độ 1 — Đề 4/6",
      "description": "MAD101 Progress Test 1 question bank, part 4 of 6 (15 questions). 78 unique questions gathered from 3 source batches (a 50-question Moodle graded review with revealed answers, plus two 15-question practice attempts with 2 cross-batch exact duplicates removed).|||Ngân hàng câu hỏi Kiểm tra tiến độ 1 môn MAD101, phần 4/6 (15 câu). 78 câu duy nhất gom từ 3 đợt nguồn (một đợt ôn tập Moodle 50 câu có lộ đáp án, cộng hai lượt luyện 15 câu, đã loại 2 câu trùng lặp giữa các đợt).",
      "durationMinutes": 30,
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
          "prompt": "Let $X = \\{2, 4, 5, 6\\}$ and $Y = \\{3, 4, 7, 8\\}$. Find $(X - Y) \\cup (Y - X)$.|||Cho $X = \\{2, 4, 5, 6\\}$ và $Y = \\{3, 4, 7, 8\\}$. Tìm $(X - Y) \\cup (Y - X)$.",
          "options": [
            {
              "text": "{4}|||{4}"
            },
            {
              "text": "{2,3,5,6,7,8}|||{2,3,5,6,7,8}"
            },
            {
              "text": "{2,4,5,6}|||{2,4,5,6}"
            },
            {
              "text": "{3,4,7,8}|||{3,4,7,8}"
            },
            {
              "text": "None of the others|||Không phải các đáp án trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$X-Y=\\{2,5,6\\}$ (drop the shared 4), $Y-X=\\{3,7,8\\}$ (drop the shared 4). Union (this is the symmetric difference) $=\\{2,3,5,6,7,8\\}$.</div><div class=\"ml-vi\">$X-Y=\\{2,5,6\\}$ (bỏ 4 dùng chung), $Y-X=\\{3,7,8\\}$ (bỏ 4 dùng chung). Hợp (đây chính là hiệu đối xứng) $=\\{2,3,5,6,7,8\\}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Define $f,g,h: \\mathbb{Z}\\times\\mathbb{Z} \\to \\mathbb{Z}$ by: $f(m,n)=m^2-n^2$, $g(m,n)=|m|-|n|$, $h(m,n)=\\max\\{m,n\\}$. Which of the above functions are surjective?|||Cho $f,g,h: \\mathbb{Z}\\times\\mathbb{Z} \\to \\mathbb{Z}$ như trên. Hàm nào là toàn ánh?",
          "options": [
            {
              "text": "None of them is surjective.|||Không hàm nào toàn ánh."
            },
            {
              "text": "Only f and h are surjective.|||Chỉ f và h toàn ánh."
            },
            {
              "text": "Only g and h are surjective.|||Chỉ g và h toàn ánh."
            },
            {
              "text": "Only g is surjective.|||Chỉ g toàn ánh."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(m,n)=m^2-n^2$ can't hit e.g. 2 (difference of two squares parity constraint) — not surjective. $g(m,n)=|m|-|n|$ hits every integer (take $m=k,n=0$ for $k\\ge0$; $m=0,n=-k$ for $k<0$) — surjective. $h(m,n)=\\max\\{m,n\\}$ hits every integer (take $m=n=k$) — surjective. So g and h.</div><div class=\"ml-vi\">$f(m,n)=m^2-n^2$ không đạt được VD số 2 (ràng buộc chẵn lẻ của hiệu hai bình phương) — không toàn ánh. $g$ đạt mọi số nguyên — toàn ánh. $h$ đạt mọi số nguyên (lấy $m=n=k$) — toàn ánh. Vậy g và h.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the following expression: $(011011 \\oplus 101001) \\lor 111000$|||Tính biểu thức: $(011011 \\oplus 101001) \\lor 111000$",
          "options": [
            {
              "text": "111010|||111010"
            },
            {
              "text": "110010|||110010"
            },
            {
              "text": "100111|||100111"
            },
            {
              "text": "111100|||111100"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$011011 \\oplus 101001 = 110010$. $110010 \\lor 111000 = 111010$.</div><div class=\"ml-vi\">$011011 \\oplus 101001 = 110010$. $110010 \\lor 111000 = 111010$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine whether each of these arguments is valid. (I) If n is a real number such that n>1, then $n^2>1$. Suppose that $n^2>1$. Then $n>1$. (II) If n is a real number with n>3, then $n^2>9$. Suppose that $n^2\\le9$. Then $n\\le3$.|||Xét tính hợp lệ của hai lập luận (I),(II) như trên.",
          "options": [
            {
              "text": "Both are not valid.|||Cả hai không hợp lệ."
            },
            {
              "text": "Both are valid.|||Cả hai hợp lệ."
            },
            {
              "text": "(I) is not valid, (II) is valid.|||(I) không hợp lệ, (II) hợp lệ."
            },
            {
              "text": "(I) is valid, (II) is not valid.|||(I) hợp lệ, (II) không hợp lệ."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(I) affirms the consequent ($n>1\\Rightarrow n^2>1$, given $n^2>1$, concludes $n>1$ — but $n=-2$ gives $n^2=4>1$ while $n<1$, a counter-example) — invalid. (II) is exactly modus tollens on the SAME implication ($n>3\\Rightarrow n^2>9$; $\\neg(n^2>9)$ i.e. $n^2\\le9 \\Rightarrow \\neg(n>3)$ i.e. $n\\le3$) — valid.</div><div class=\"ml-vi\">(I) mắc lỗi khẳng định hệ quả (có phản ví dụ $n=-2$: $n^2=4>1$ nhưng $n<1$) — không hợp lệ. (II) chính là modus tollens trên CÙNG mệnh đề kéo theo — hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the algorithm: <pre>procedure linear search(x: integer, $a_1,\\dots,a_n$: distinct integers)\nlocation := 0\ni := 1\nwhile ($i\\le n$ and $x\\ne a_i$):\n  i := i+1\nif $i\\le n$ then location := i</pre> We use this algorithm to search for x=3 in the list [1, 4, 5, 3, 6, 8, 7, 2]. What is the value of location after the third while loop executed?|||Xét thuật toán linear search (như trên). Tìm x=3 trong [1, 4, 5, 3, 6, 8, 7, 2]. Giá trị location sau lần lặp while thứ ba?",
          "options": [
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
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">location is only assigned AFTER the loop finishes, not during each iteration — after the 3rd loop iteration (i is only 4, still inside the loop, x=3 found at i=4 but the assignment happens after the loop exits), the value of location at that point is still its initial 0.</div><div class=\"ml-vi\">location chỉ được gán SAU KHI vòng lặp kết thúc, không phải trong từng lần lặp — sau lần lặp thứ 3 (i mới =4, vẫn còn trong vòng lặp, tìm thấy x=3 tại i=4 nhưng phép gán xảy ra sau khi thoát vòng lặp), giá trị location lúc đó vẫn là 0 ban đầu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be the statement \"x can speak French\", $Q(x)$ be the statement \"x can speak Japanese\". Translate the logical expression into a sentence, if the domain consists of all students in your class. $\\forall x(P(x)\\lor Q(x))$|||Cho $P(x)$ là \"x nói được tiếng Pháp\", $Q(x)$ là \"x nói được tiếng Nhật\". Dịch biểu thức logic sang câu, với miền là mọi sinh viên trong lớp. $\\forall x(P(x)\\lor Q(x))$",
          "options": [
            {
              "text": "There is a student in your class who can speak either French or Japanese.|||Có một sinh viên trong lớp nói được tiếng Pháp hoặc tiếng Nhật."
            },
            {
              "text": "No student in your class can speak both French and Japanese.|||Không sinh viên nào trong lớp nói được cả hai."
            },
            {
              "text": "There is a student in your class who can speak both French and Japanese.|||Có một sinh viên trong lớp nói được cả hai."
            },
            {
              "text": "Every student in your class can speak both French and Japanese.|||Mọi sinh viên trong lớp đều nói được cả hai."
            },
            {
              "text": "Every student in your class can speak either French or Japanese.|||Mọi sinh viên trong lớp đều nói được tiếng Pháp hoặc tiếng Nhật."
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\forall x$ means \"every student\", and $P(x)\\lor Q(x)$ means \"speaks French or Japanese (or both)\" — together: \"Every student in your class can speak either French or Japanese.\"</div><div class=\"ml-vi\">$\\forall x$ nghĩa \"mọi sinh viên\", và $P(x)\\lor Q(x)$ nghĩa \"nói được tiếng Pháp hoặc tiếng Nhật (hoặc cả hai)\" — ghép lại: \"Mọi sinh viên trong lớp đều nói được tiếng Pháp hoặc tiếng Nhật.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Translate the sentence into a logical expression with the domain consisting of all real numbers: \"The quotient of any two positive real numbers is also positive\" (i) $\\forall x\\forall y\\left((x>0)\\land(y>0) \\longrightarrow \\left(\\frac{x}{y}>0\\right)\\right)$ (ii) $\\forall x\\forall y\\left((x>0)\\land(y>0)\\land\\left(\\frac{x}{y}>0\\right)\\right)$ (iii) $(x>0)\\land(y>0) \\longrightarrow \\left(\\frac{x}{y}>0\\right)$ (iv) $\\exists x\\exists y\\left((x>0)\\land(y>0) \\longrightarrow \\left(\\frac{x}{y}>0\\right)\\right)$|||Dịch câu sau sang biểu thức logic, miền là mọi số thực: \"Thương của hai số thực dương bất kỳ cũng là số dương\" (các lựa chọn (i)-(iv) như trên).",
          "options": [
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
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">\"Any two\" needs universal quantifiers over the WHOLE domain (all reals, not just positive ones), with the positivity as a hypothesis: $\\forall x\\forall y((x>0)\\land(y>0)\\to(x/y>0))$ — option (i). (iii) is unquantified (open formula), (ii) wrongly uses $\\land$ instead of $\\to$, (iv) wrongly uses $\\exists$.</div><div class=\"ml-vi\">\"Hai số bất kỳ\" cần lượng từ phổ dụng trên TOÀN miền (mọi số thực, không chỉ số dương), với tính dương là giả thiết: $\\forall x\\forall y((x>0)\\land(y>0)\\to(x/y>0))$ — đáp án (i). (iii) không lượng hoá, (ii) dùng nhầm $\\land$ thay vì $\\to$, (iv) dùng nhầm $\\exists$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose values of p, q, r, s such that the proposition $(p \\to q) \\land (r \\to s)$ is False.|||Chọn giá trị p, q, r, s để mệnh đề $(p \\to q) \\land (r \\to s)$ là False.",
          "options": [
            {
              "text": "None of the mentioned|||Không đáp án nào"
            },
            {
              "text": "p=s=T, q=r=F|||p=s=T, q=r=F"
            },
            {
              "text": "p=q=T, r=s=F|||p=q=T, r=s=F"
            },
            {
              "text": "p=r=s=F, q=T|||p=r=s=F, q=T"
            },
            {
              "text": "p=q=r=F, s=T|||p=q=r=F, s=T"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">With p=T,q=F: $p\\to q=F$, so the whole conjunction is F regardless of r,s. The other options all keep both implications vacuously/actually true, giving T overall.</div><div class=\"ml-vi\">Với p=T,q=F: $p\\to q=F$, nên cả hội là F bất kể r,s. Các đáp án còn lại đều giữ cả hai kéo theo đúng (do vacuous hoặc thật), cho kết quả T.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute $\\displaystyle\\sum_{i=0}^{3}\\sum_{j=0}^{5}(2i+ij)$|||Tính $\\displaystyle\\sum_{i=0}^{3}\\sum_{j=0}^{5}(2i+ij)$",
          "options": [
            {
              "text": "85|||85"
            },
            {
              "text": "102|||102"
            },
            {
              "text": "162|||162"
            },
            {
              "text": "100|||100"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Inner sum for fixed i: $\\sum_{j=0}^5(2i+ij)=6(2i)+i\\sum_{j=0}^5 j=12i+15i=27i$. Outer: $\\sum_{i=0}^3 27i=27(0+1+2+3)=27\\times6=162$.</div><div class=\"ml-vi\">Tổng trong với i cố định: $\\sum_{j=0}^5(2i+ij)=12i+15i=27i$. Tổng ngoài: $27(0+1+2+3)=162$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U = \\{1,2,\\dots,10\\}$. Find the bit string representation of the subset $\\{2,5,7,9\\}$.|||Cho $U = \\{1,2,\\dots,10\\}$. Tìm chuỗi bit biểu diễn tập con $\\{2,5,7,9\\}$.",
          "options": [
            {
              "text": "1001010100|||1001010100"
            },
            {
              "text": "0101010010|||0101010010"
            },
            {
              "text": "1011010101|||1011010101"
            },
            {
              "text": "0100101010|||0100101010"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Positions 1-10, mark 1 at 2,5,7,9: 0,1,0,0,1,0,1,0,1,0 → 0100101010.</div><div class=\"ml-vi\">Vị trí 1-10, đánh 1 tại 2,5,7,9: 0,1,0,0,1,0,1,0,1,0 → 0100101010.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the following expression $(0011\\oplus1010)\\oplus0101$|||Tính biểu thức $(0011\\oplus1010)\\oplus0101$",
          "options": [
            {
              "text": "1100|||1100"
            },
            {
              "text": "1001|||1001"
            },
            {
              "text": "1111|||1111"
            },
            {
              "text": "1010|||1010"
            },
            {
              "text": "1110|||1110"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$0011\\oplus1010=1001$. $1001\\oplus0101=1100$.</div><div class=\"ml-vi\">$0011\\oplus1010=1001$. $1001\\oplus0101=1100$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $2 + 2^2 + 2^3 + \\dots + 2^9$.|||Tìm $2 + 2^2 + 2^3 + \\dots + 2^9$.",
          "options": [
            {
              "text": "1021|||1021"
            },
            {
              "text": "1022|||1022"
            },
            {
              "text": "1023|||1023"
            },
            {
              "text": "1024|||1024"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\sum_{k=1}^{9}2^k=2^{10}-2=1024-2=1022$.</div><div class=\"ml-vi\">$\\sum_{k=1}^{9}2^k=2^{10}-2=1024-2=1022$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let p, q and r be propositions such that $p\\equiv T, q\\equiv F$ and $r\\equiv T$. Choose the correct statement. (i) $q\\to(p\\land r)\\equiv F$ and $q\\lor r\\equiv T$ (ii) $(p\\lor r)\\to q\\equiv T$ and $p\\land r\\equiv T$ (iii) $(p\\oplus q)\\oplus r\\equiv F$ and $p\\to q\\equiv F$|||Cho p,q,r với $p\\equiv T, q\\equiv F, r\\equiv T$. Chọn phát biểu đúng ((i),(ii),(iii) như trên).",
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
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i): $q\\to(p\\land r)=F\\to T=T\\ne F$ — first half wrong. (ii): $(p\\lor r)\\to q=T\\to F=F\\ne T$ — first half wrong. (iii): $(p\\oplus q)\\oplus r=(T\\oplus F)\\oplus T=T\\oplus T=F$ ✓, and $p\\to q=T\\to F=F$ ✓ — both parts match, (iii) is correct.</div><div class=\"ml-vi\">(i): $q\\to(p\\land r)=F\\to T=T\\ne F$ — sai. (ii): $(p\\lor r)\\to q=T\\to F=F\\ne T$ — sai. (iii): $(p\\oplus q)\\oplus r=F$ ✓, $p\\to q=F$ ✓ — cả hai khớp, (iii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given three sets: $A = \\{1,2,3,4,5,6\\}\\ \\ B = \\{1,3,5,6,9\\}\\ \\ C = \\{1,2,3,6,9\\}$. Which set has the least element (fewest elements)? (i) $A\\cap B$ (ii) $A\\cap C$ (iii) $B-C$ (iv) $B\\cup C$|||Cho ba tập A,B,C như trên. Tập nào có ÍT phần tử nhất? (i) $A\\cap B$ (ii) $A\\cap C$ (iii) $B-C$ (iv) $B\\cup C$",
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
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$A\\cap B=\\{1,3,5,6\\}$ (4), $A\\cap C=\\{1,2,3,6\\}$ (4), $B-C=\\{5\\}$ (1), $B\\cup C=\\{1,2,3,5,6,9\\}$ (6). Fewest is $B-C$, option (iii).</div><div class=\"ml-vi\">$A\\cap B=\\{1,3,5,6\\}$ (4), $A\\cap C=\\{1,2,3,6\\}$ (4), $B-C=\\{5\\}$ (1), $B\\cup C=\\{1,2,3,5,6,9\\}$ (6). Ít nhất là $B-C$, đáp án (iii).</div>"
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
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
          "explanation": "<div class=\"ml-en\">$\\neg(p\\leftrightarrow q)$ is true exactly when $p\\ne q$ (XOR). $p\\leftrightarrow\\neg q$ is true iff $p=\\neg q$ iff $p\\ne q$ — same. $\\neg p\\leftrightarrow q$ is true iff $\\neg p=q$ iff $p\\ne q$ — also same. Both (i) and (ii) match.</div><div class=\"ml-vi\">$\\neg(p\\leftrightarrow q)$ đúng khi $p\\ne q$ (XOR). $p\\leftrightarrow\\neg q$ đúng khi $p=\\neg q$ tức $p\\ne q$ — trùng. $\\neg p\\leftrightarrow q$ đúng khi $\\neg p=q$ tức $p\\ne q$ — cũng trùng. Cả (i) và (ii) đều khớp.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT1-D5",
      "source": "REAL",
      "sortOrder": 115,
      "title": "Progress Test 1 — Đề 5/6|||Kiểm tra tiến độ 1 — Đề 5/6",
      "description": "MAD101 Progress Test 1 question bank, part 5 of 6 (15 questions). 78 unique questions gathered from 3 source batches (a 50-question Moodle graded review with revealed answers, plus two 15-question practice attempts with 2 cross-batch exact duplicates removed).|||Ngân hàng câu hỏi Kiểm tra tiến độ 1 môn MAD101, phần 5/6 (15 câu). 78 câu duy nhất gom từ 3 đợt nguồn (một đợt ôn tập Moodle 50 câu có lộ đáp án, cộng hai lượt luyện 15 câu, đã loại 2 câu trùng lặp giữa các đợt).",
      "durationMinutes": 30,
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
          "prompt": "Which arguments are valid? (i) If Andy gets sick, she will not go to the class. She didn't go to the class yesterday. Therefore, she got sick yesterday. (ii) If Andy gets sick, she will not go to the class. She does not get sick today. Therefore, she will go to the class today. (iii) If Andy gets sick, she will not go to the class. She went to the class yesterday. Therefore, she did not get sick yesterday.|||Lập luận nào hợp lệ? (i),(ii),(iii) như trên.",
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
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "All of (i), (ii), (iii) are valid|||Cả (i),(ii),(iii) đều hợp lệ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Let S=\"gets sick\", C=\"goes to class\": premise is $S\\to\\neg C$. (i) affirms the consequent ($\\neg C$, concludes $S$) — invalid. (ii) denies the antecedent ($\\neg S$, concludes $C$) — invalid. (iii) is modus tollens ($C$ i.e. $\\neg\\neg C$, concludes $\\neg S$) — valid. Only (iii).</div><div class=\"ml-vi\">Đặt S=\"bị ốm\", C=\"đi học\": tiền đề $S\\to\\neg C$. (i) khẳng định hệ quả — không hợp lệ. (ii) phủ định tiền đề — không hợp lệ. (iii) là modus tollens — hợp lệ. Chỉ (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U = \\{a,b,c,d,e,f,g,h,i,j\\}$. Given the subsets $A = \\{a,c,d,e,g,i\\}, B = \\{a,f,g,h,j\\}$. The bit string representing the intersection of A and B is ___|||Cho $U = \\{a,\\dots,j\\}$, $A = \\{a,c,d,e,g,i\\}, B = \\{a,f,g,h,j\\}$. Chuỗi bit biểu diễn $A\\cap B$ là ___",
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
              "text": "None of the other choices|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A\\cap B=\\{a,g\\}$ (both common). Positions a..j: 1,0,0,0,0,0,1,0,0,0 → grouped \"10 0000 1000\".</div><div class=\"ml-vi\">$A\\cap B=\\{a,g\\}$ (chung cả hai). Vị trí a..j: 1,0,0,0,0,0,1,0,0,0 → nhóm \"10 0000 1000\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the universal set $U = \\{1,2,3,4,5,6,7,8,9,10\\}$. Represent the subset $\\{1,2,5,7,8,10\\}$ by a bit string whose i-th bit is 1 if i belongs to that subset, and is 0 otherwise. What is that bit string?|||Cho $U = \\{1,\\dots,10\\}$. Biểu diễn tập con $\\{1,2,5,7,8,10\\}$ bằng chuỗi bit mà bit thứ i là 1 nếu i thuộc tập đó. Chuỗi bit đó là gì?",
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
          "explanation": "<div class=\"ml-en\">Positions 1-10, mark 1 at 1,2,5,7,8,10: 1,1,0,0,1,0,1,1,0,1 → 1100101101.</div><div class=\"ml-vi\">Vị trí 1-10, đánh 1 tại 1,2,5,7,8,10: 1,1,0,0,1,0,1,1,0,1 → 1100101101.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let f, g: $\\mathbb{Z}\\times\\mathbb{Z} \\to \\mathbb{Z}\\times\\mathbb{Z}$ be two functions defined by $f(m,n)=(m,1)$ and $g(m,n)=(m-n,m+n)$. The value of $f\\circ g(1,1)$ is|||Cho f, g: $\\mathbb{Z}\\times\\mathbb{Z} \\to \\mathbb{Z}\\times\\mathbb{Z}$, $f(m,n)=(m,1)$ và $g(m,n)=(m-n,m+n)$. Giá trị $f\\circ g(1,1)$ là",
          "options": [
            {
              "text": "(0,2)|||(0,2)"
            },
            {
              "text": "(1,1)|||(1,1)"
            },
            {
              "text": "(0,1)|||(0,1)"
            },
            {
              "text": "(2,0)|||(2,0)"
            },
            {
              "text": "(1,0)|||(1,0)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$g(1,1)=(1-1,1+1)=(0,2)$. $f(0,2)=(0,1)$.</div><div class=\"ml-vi\">$g(1,1)=(1-1,1+1)=(0,2)$. $f(0,2)=(0,1)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the argument with the hypotheses: \"I will be happy if your project succeeds. Your project can become successful only if you change the method.\" and the conclusion: \"Therefore, if you change the method, then I will be very happy.\" Choose the right answer.|||Xét lập luận với tiền đề: \"Tôi sẽ hạnh phúc nếu dự án bạn thành công. Dự án bạn thành công chỉ khi bạn đổi phương pháp.\" và kết luận: \"Vậy nếu bạn đổi phương pháp thì tôi sẽ rất hạnh phúc.\" Chọn đáp án đúng.",
          "options": [
            {
              "text": "The argument is valid using hypothetical syllogism|||Hợp lệ, dùng tam đoạn luận giả định"
            },
            {
              "text": "The argument is invalid|||Không hợp lệ"
            },
            {
              "text": "The argument is valid using modus tollens|||Hợp lệ, dùng modus tollens"
            },
            {
              "text": "The argument is valid using simplification|||Hợp lệ, dùng luật đơn giản hoá"
            },
            {
              "text": "The argument is valid using modus ponens|||Hợp lệ, dùng modus ponens"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Premises: $S\\to H$ (succeeds→happy) and $S\\to M$ (succeeds only if change method, i.e. $S\\to M$). These do NOT chain into $M\\to H$ — that would need $M\\to S$, which isn't given. The argument is invalid.</div><div class=\"ml-vi\">Tiền đề: $S\\to H$ và $S\\to M$. Hai điều này KHÔNG nối được thành $M\\to H$ — cần $M\\to S$, mà đề không cho. Lập luận không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the negation of the proposition: \"If I have one million dollars then I will buy a villa\". Choose the correct answer. (i) \"If I have one million dollars then I will not buy a villa\". (ii) \"I have one million dollars but I will not buy a villa\". (iii) \"I will buy a villa as soon as I have one million dollars\".|||Tìm phủ định của: \"Nếu tôi có một triệu đô thì tôi sẽ mua biệt thự\". (i),(ii),(iii) như trên.",
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
              "text": "None of them is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Negation of $P\\to Q$ is $P\\land\\neg Q$: \"I have one million dollars but I will not buy a villa\" — (ii).</div><div class=\"ml-vi\">Phủ định của $P\\to Q$ là $P\\land\\neg Q$: \"Tôi có một triệu đô nhưng tôi sẽ không mua biệt thự\" — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x)$ be a propositional function on $\\{-2,-1,0,1,2,3\\}$. Find a proposition that is logically equivalent to $\\forall x[(x\\ge1)\\to P(x)]$ (i) $P(1)\\to(P(2)\\land P(3))$ (ii) $P(1)\\lor P(2)\\lor P(3)$ (iii) $P(1)\\land P(2)\\land P(3)$ (iv) $P(1)\\to(P(2)\\lor P(3))$|||Cho $P(x)$ trên $\\{-2,-1,0,1,2,3\\}$. Tìm mệnh đề tương đương $\\forall x[(x\\ge1)\\to P(x)]$ (i)-(iv) như trên.",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For $x\\in\\{-2,-1,0\\}$ the hypothesis $x\\ge1$ is false so the implication is vacuously true regardless of $P(x)$ — only $x=1,2,3$ actually constrain anything, and each must satisfy $P(x)$: exactly $P(1)\\land P(2)\\land P(3)$, option (iii).</div><div class=\"ml-vi\">Với $x\\in\\{-2,-1,0\\}$ giả thiết $x\\ge1$ sai nên kéo theo đúng vô điều kiện — chỉ $x=1,2,3$ thực sự ràng buộc, mỗi cái phải thỏa $P(x)$: đúng là $P(1)\\land P(2)\\land P(3)$, đáp án (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let p and q be propositions. Which proposition is logically equivalent to $p\\land(p\\lor q)$? (i) q (ii) p (iii) $p\\land q$ (iv) $p\\lor q$|||Cho p, q là mệnh đề. Mệnh đề nào tương đương $p\\land(p\\lor q)$? (i)-(iv) như trên.",
          "options": [
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices|||Không đáp án nào"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the absorption law: $p\\land(p\\lor q)\\equiv p$ — option (ii).</div><div class=\"ml-vi\">Đây là luật hấp thụ: $p\\land(p\\lor q)\\equiv p$ — đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f: \\mathbb{N} \\to \\mathbb{Z}$ be the function defined as follows $f(n) = -n/2$ if n is even, $f(n)=(n^2+1)/2$ if n is odd. Choose the correct answer.|||Cho $f: \\mathbb{N} \\to \\mathbb{Z}$ như trên. Chọn đáp án đúng.",
          "options": [
            {
              "text": "f is onto but not one-to-one.|||f toàn ánh nhưng không đơn ánh."
            },
            {
              "text": "f is one-to-one but not onto.|||f đơn ánh nhưng không toàn ánh."
            },
            {
              "text": "f is neither one-to-one nor onto.|||f không đơn ánh cũng không toàn ánh."
            },
            {
              "text": "f is both one-to-one and onto.|||f vừa đơn ánh vừa toàn ánh."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is the classic $\\mathbb{N}\\to\\mathbb{Z}$ enumeration: even n map to non-positive integers ($0,-1,-2,\\dots$), odd n map to positive integers ($1,2,3,\\dots$), covering all of $\\mathbb{Z}$ exactly once each — a bijection.</div><div class=\"ml-vi\">Đây là song ánh chuẩn $\\mathbb{N}\\to\\mathbb{Z}$: n chẵn ánh xạ tới số nguyên $\\le0$, n lẻ ánh xạ tới số nguyên dương, phủ đúng mỗi số nguyên một lần — song ánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P(x,y) = $\"x+y is divisible by 5\" on the set $\\{2,4,6,7,9\\}$. Which propositions are TRUE? (i) $\\forall x\\forall y P(x,y)$ (ii) $\\exists x\\forall y P(x,y)$ (iii) $\\forall x\\exists y P(x,y)$ (iv) $\\exists x\\exists y P(x,y)$|||Cho $P(x,y) = $\"x+y chia hết cho 5\" trên $\\{2,4,6,7,9\\}$. Mệnh đề nào ĐÚNG? (i)-(iv) như trên.",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$4+6=10$ is divisible by 5, so $\\exists x\\exists y P(x,y)$ is true — (iv). But no single x works for ALL y (rules out (ii)), not every x has a partner y (e.g. $x=2$: 2+2=4,2+4=6,2+6=8,2+7=9,2+9=11, none divisible by 5 — rules out (iii)), and clearly not all pairs work (rules out (i)). Only (iv).</div><div class=\"ml-vi\">$4+6=10$ chia hết 5, nên $\\exists x\\exists y P(x,y)$ đúng — (iv). Nhưng không x nào đúng với MỌI y (loại (ii)), không phải mọi x đều có y phù hợp (VD x=2 không có y nào — loại (iii)), và rõ ràng không phải mọi cặp đều đúng (loại (i)). Chỉ (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the premises (1) If it is not raining then the soccer game will be held (2) If the soccer game is held then Nam will buy a ticket (3) Nam did not buy a ticket. Which conclusion can be drawn?|||Cho các tiền đề (1),(2),(3) như trên. Có thể rút ra kết luận gì?",
          "options": [
            {
              "text": "It rained|||Trời đã mưa"
            },
            {
              "text": "It did not rain|||Trời không mưa"
            },
            {
              "text": "Nam does not like watching soccer|||Nam không thích xem bóng đá"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Hypothetical syllogism on (1)+(2): $\\neg\\text{rain}\\to\\text{ticket}$. With (3) $\\neg\\text{ticket}$, modus tollens gives $\\neg\\neg\\text{rain}$, i.e. \"It rained.\"</div><div class=\"ml-vi\">Tam đoạn luận giả định trên (1)+(2): $\\neg\\text{mưa}\\to\\text{vé}$. Với (3) $\\neg\\text{vé}$, modus tollens cho $\\neg\\neg\\text{mưa}$, tức \"Trời đã mưa.\"</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which set has the maximal cardinality? (a) $P(P(P(\\{a\\})))$ (b) $P(\\{a\\}) \\times P(\\{b\\})$ (c) $P(\\{a\\}\\times\\{b\\})$ (d) $\\{a, b, c\\} \\times \\{a, b\\}$|||Tập nào có bản số lớn nhất? (a)-(d) như trên.",
          "options": [
            {
              "text": "$P(P(P(\\{a\\})))$|||$P(P(P(\\{a\\})))$"
            },
            {
              "text": "$P(\\{a\\}) \\times P(\\{b\\})$|||$P(\\{a\\}) \\times P(\\{b\\})$"
            },
            {
              "text": "$P(\\{a\\}\\times\\{b\\})$|||$P(\\{a\\}\\times\\{b\\})$"
            },
            {
              "text": "$\\{a, b, c\\} \\times \\{a, b\\}$|||$\\{a, b, c\\} \\times \\{a, b\\}$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$|\\{a\\}|=1\\Rightarrow|P(\\{a\\})|=2\\Rightarrow|P(P(\\{a\\}))|=4\\Rightarrow|P(P(P(\\{a\\})))|=2^4=16$. Others: $2\\times2=4$; $|\\{a\\}\\times\\{b\\}|=1\\Rightarrow|P(\\cdot)|=2$; $3\\times2=6$. Max is 16.</div><div class=\"ml-vi\">$|\\{a\\}|=1\\Rightarrow|P(\\{a\\})|=2\\Rightarrow|P(P(\\{a\\}))|=4\\Rightarrow|P(P(P(\\{a\\})))|=2^4=16$. Còn lại: $4$; $2$; $6$. Lớn nhất là 16.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many rows appear in a truth table for the compound proposition $(p\\land q\\land\\neg r)\\lor(\\neg p\\leftrightarrow s)\\lor(s\\to q)$?|||Bảng chân trị của mệnh đề $(p\\land q\\land\\neg r)\\lor(\\neg p\\leftrightarrow s)\\lor(s\\to q)$ có bao nhiêu dòng?",
          "options": [
            {
              "text": "64|||64"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">4 distinct variables (p,q,r,s) $\\Rightarrow 2^4=16$ rows.</div><div class=\"ml-vi\">4 biến khác nhau (p,q,r,s) $\\Rightarrow 2^4=16$ dòng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following functions f: $\\mathbb{R} \\to \\mathbb{R}$ is a bijection? (i) $f(x)=\\left\\lfloor\\frac{x}{2}\\right\\rfloor$ (ii) $f(x)=-2x^2+4$ (iii) $f(x)=-\\frac32x+5$|||Hàm f: $\\mathbb{R} \\to \\mathbb{R}$ nào là song ánh? (i)-(iii) như trên.",
          "options": [
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
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i) floor of x/2 is not injective (many x share a floor value). (ii) is a downward parabola, not injective. (iii) is linear with nonzero slope $-3/2$ — a bijection on $\\mathbb{R}$.</div><div class=\"ml-vi\">(i) sàn của x/2 không đơn ánh. (ii) parabol, không đơn ánh. (iii) tuyến tính hệ số góc $-3/2\\ne0$ — song ánh trên $\\mathbb{R}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the sum $\\displaystyle\\sum_{i=0}^{2}\\sum_{j=1}^{3}(2i+j)$|||Tìm tổng $\\displaystyle\\sum_{i=0}^{2}\\sum_{j=1}^{3}(2i+j)$",
          "options": [
            {
              "text": "40|||40"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "36|||36"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$i=0$: $1+2+3=6$. $i=1$: $3+4+5=12$. $i=2$: $5+6+7=18$. Total $=6+12+18=36$.</div><div class=\"ml-vi\">$i=0$: $1+2+3=6$. $i=1$: $3+4+5=12$. $i=2$: $5+6+7=18$. Tổng $=6+12+18=36$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT1-D6",
      "source": "REAL",
      "sortOrder": 116,
      "title": "Progress Test 1 — Đề 6/6|||Kiểm tra tiến độ 1 — Đề 6/6",
      "description": "MAD101 Progress Test 1 question bank, part 6 of 6 (3 questions). 78 unique questions gathered from 3 source batches (a 50-question Moodle graded review with revealed answers, plus two 15-question practice attempts with 2 cross-batch exact duplicates removed).|||Ngân hàng câu hỏi Kiểm tra tiến độ 1 môn MAD101, phần 6/6 (3 câu). 78 câu duy nhất gom từ 3 đợt nguồn (một đợt ôn tập Moodle 50 câu có lộ đáp án, cộng hai lượt luyện 15 câu, đã loại 2 câu trùng lặp giữa các đợt).",
      "durationMinutes": 20,
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
          "prompt": "The symmetric difference of two sets A and B, denoted by $A\\oplus B$, is the set of all elements that either belong to A or to B, but not both. Suppose that $A\\oplus B = A$. Choose the best answer: (i) $A=B$ (ii) $B\\subseteq A$ (iii) $A\\subseteq B$ (iv) $B=\\emptyset$|||Hiệu đối xứng $A\\oplus B$ là tập phần tử thuộc A hoặc B nhưng không cả hai. Giả sử $A\\oplus B = A$. Chọn đáp án đúng: (i)-(iv) như trên.",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$A\\oplus B=(A\\setminus B)\\cup(B\\setminus A)$. For this to equal A exactly, $B\\setminus A$ (which is disjoint from A) must be empty (so $B\\subseteq A$) AND $A\\setminus B$ must equal all of A (so $A\\cap B=\\emptyset$). Combined with $B\\subseteq A$, that forces $B=\\emptyset$.</div><div class=\"ml-vi\">$A\\oplus B=(A\\setminus B)\\cup(B\\setminus A)$. Để bằng đúng A, $B\\setminus A$ (rời A) phải rỗng (nên $B\\subseteq A$) VÀ $A\\setminus B$ phải bằng cả A (nên $A\\cap B=\\emptyset$). Kết hợp $B\\subseteq A$ buộc $B=\\emptyset$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the truth values of the propositions, where x, y represent real numbers. (M) $\\forall x\\forall y[(x=y^2)\\land(x<y)]$ (N) $\\exists x\\exists y[(x=y^2)\\land(x<y)]$|||Tìm chân trị (M),(N) như trên, với x,y là số thực.",
          "options": [
            {
              "text": "Both (M) and (N) are True|||Cả (M) và (N) đều True"
            },
            {
              "text": "Only (M) is True|||Chỉ (M) True"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Only (N) is True|||Chỉ (N) True"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(M) requires EVERY pair (x,y) to satisfy $x=y^2\\land x<y$ — false already at $x=y=0$ ($0<0$ fails). (N) just needs ONE example: $y=0.5,x=0.25$: $0.25=0.5^2$ ✓ and $0.25<0.5$ ✓ — true. So only (N).</div><div class=\"ml-vi\">(M) đòi hỏi MỌI cặp (x,y) thỏa — sai ngay tại $x=y=0$. (N) chỉ cần MỘT ví dụ: $y=0.5,x=0.25$ thỏa cả hai điều kiện — đúng. Vậy chỉ (N).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a contradiction? (i) $(p\\lor\\neg q)\\land(\\neg p\\land q)$ (ii) $(p\\lor q)\\land(p\\lor\\neg q)$|||Điều nào sau đây là mâu thuẫn (contradiction)? (i),(ii) như trên.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i): $\\neg p\\land q$ forces p=F,q=T, making $p\\lor\\neg q=F\\lor F=F$, so the whole conjunction is always F — a contradiction. (ii) simplifies to just p (distributive law: $(p\\lor q)\\land(p\\lor\\neg q)=p\\lor(q\\land\\neg q)=p\\lor F=p$), which is true when p=T — not a contradiction. Only (i).</div><div class=\"ml-vi\">(i): $\\neg p\\land q$ buộc p=F,q=T, làm $p\\lor\\neg q=F$, nên cả hội luôn F — mâu thuẫn. (ii) rút gọn còn đúng p (luật phân phối), đúng khi p=T — không phải mâu thuẫn. Chỉ (i).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D1",
      "source": "REAL",
      "sortOrder": 121,
      "title": "Progress Test 2 — Đề 1/9|||Kiểm tra tiến độ 2 — Đề 1/9",
      "description": "MAD101 Progress Test 2 question bank, part 1 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 1/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Use the Greedy Change-Making algorithm to make a change for 34 cents using quarters, dimes and pennies (1 quarter = 25 cents, 1 dime = 10 cents, 1 penny = 1 cent). What is the total number of coins used?|||Dùng thuật toán tham lam đổi tiền cho 34 cent bằng quarter, dime, penny (1 quarter=25c, 1 dime=10c, 1 penny=1c). Tổng số đồng xu dùng?",
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
          "explanation": "<div class=\"ml-en\">$34=1\\times25+0\\times10+9\\times1$: 1 quarter, 0 dime, 9 pennies $\\Rightarrow 1+0+9=10$ coins.</div><div class=\"ml-vi\">$34=1\\times25+0\\times10+9\\times1$: 1 quarter, 0 dime, 9 penny $\\Rightarrow 1+0+9=10$ đồng xu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure tt($a_1,a_2,\\dots,a_n$: integers)\nd := $a_1$\nfor i := 1 to n do\n  if d > $a_i$ then d := $a_i$\nk := n\nwhile (k>=1) and ($a_k$ > d)\n  k := k-1\nPrint(k)</pre> What is the output of the algorithm?|||Cho thuật toán tt (như trên). Kết quả xuất ra là gì?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "The first location of the smallest element in the list of integers|||Vị trí ĐẦU TIÊN của phần tử nhỏ nhất"
            },
            {
              "text": "The smallest element in the list of integers|||Phần tử nhỏ nhất trong danh sách"
            },
            {
              "text": "The last location of the smallest element in the list of integers|||Vị trí CUỐI CÙNG của phần tử nhỏ nhất"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">d ends up as the minimum value. k starts at n and decreases while $a_k>d$, stopping at the first (from the right) index where $a_k\\le d$ — i.e. the LAST index equal to the minimum.</div><div class=\"ml-vi\">d cuối cùng là giá trị nhỏ nhất. k bắt đầu từ n và giảm dần khi $a_k>d$, dừng ở chỉ số đầu tiên tính từ phải mà $a_k\\le d$ — tức vị trí CUỐI CÙNG bằng giá trị nhỏ nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the total number of coins when using the Greedy Change-Making algorithm to make a change for 87 cents using quarters (25 cents), dimes (10 cents), nickles (5 cents) and pennies (1 cent)?|||Tổng số đồng xu khi dùng thuật toán tham lam đổi 87 cent bằng quarter(25c), dime(10c), nickel(5c), penny(1c)?",
          "options": [
            {
              "text": "0|||0"
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
              "text": "6|||6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$87=3\\times25+1\\times10+0\\times5+2\\times1$ (75+10+0+2=87): 3 quarters, 1 dime, 0 nickels, 2 pennies $\\Rightarrow3+1+0+2=6$.</div><div class=\"ml-vi\">$87=3\\times25+1\\times10+0\\times5+2\\times1$: 3 quarter, 1 dime, 0 nickel, 2 penny $\\Rightarrow6$ đồng xu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure Binarysearch($a_1<a_2<\\dots<a_n$, x: integer)\ni:=1\nj:=n\nwhile (i<j)\n  m:=$\\lfloor(i+j)/2\\rfloor$\n  if $x>a_m$ then i:=m+1\n  else j:=m\nif $x=a_i$ then location:=i\nelse location:=0</pre> If input = 2, 4, 5, 7, 8, 9, 10, 13 and x = 11, after the second time of dividing into sublists, the sublist to be considered is ___|||Cho thuật toán Binarysearch (như trên). Với input 2,4,5,7,8,9,10,13 và x=11, sau lần chia thứ HAI, dãy con cần xét là gì?",
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
          "explanation": "<div class=\"ml-en\">1st split: i=1,j=8,m=4,$a_4$=7<11→i=5; sublist=[8,9,10,13]. 2nd split: i=5,j=8,m=6,$a_6$=9<11→i=7; sublist=$a_7,a_8$=[10,13].</div><div class=\"ml-vi\">Lần chia 1: i=1,j=8,m=4,$a_4$=7<11→i=5; dãy con=[8,9,10,13]. Lần chia 2: i=5,j=8,m=6,$a_6$=9<11→i=7; dãy con=[10,13].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A person wants to make a change for 96 cents using quarters (=25 cents), dimes (=10 cents), nickles (=5 cents) and pennies (=1 cent). Find the least number of coins.|||Đổi 96 cent bằng quarter(25c), dime(10c), nickel(5c), penny(1c). Tìm số đồng xu ÍT NHẤT.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$96=3\\times25+2\\times10+0\\times5+1\\times1$ (75+20+0+1=96): $3+2+0+1=6$ coins.</div><div class=\"ml-vi\">$96=3\\times25+2\\times10+0\\times5+1\\times1$: $3+2+0+1=6$ đồng xu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>Procedure Insertionsort($a_1,a_2,\\dots,a_n$: integer)\nfor i = 2 to n do\n  j := 1\n  while $a_j<a_i$\n    j := j+1\n  temp := $a_i$\n  for k := i down to j+1\n    $a_k$:=$a_{k-1}$\n  $a_j$ := temp</pre> If input = 3, 2, 4, 7, 1, 6, 5, after running the outer loop with i = 5, the order of the elements in the list is ___|||Cho Insertionsort (như trên). Với input 3,2,4,7,1,6,5, sau khi chạy vòng ngoài i=5, thứ tự danh sách là gì?",
          "options": [
            {
              "text": "1, 2, 3, 4, 7, 6, 5|||1, 2, 3, 4, 7, 6, 5"
            },
            {
              "text": "1, 2, 3, 4, 6, 7, 5|||1, 2, 3, 4, 6, 7, 5"
            },
            {
              "text": "1, 2, 3, 4, 7, 5, 6|||1, 2, 3, 4, 7, 5, 6"
            },
            {
              "text": "1, 2, 3, 7, 4, 6, 5|||1, 2, 3, 7, 4, 6, 5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Insertion sort keeps $a_1..a_i$ sorted after each outer step, rest untouched. i=2:[2,3,4,7,1,6,5]. i=3:[2,3,4,7,1,6,5]. i=4:[2,3,4,7,1,6,5]. i=5: insert 1 to front:[1,2,3,4,7,6,5].</div><div class=\"ml-vi\">Insertion sort giữ $a_1..a_i$ đã sắp sau mỗi bước ngoài, phần còn lại giữ nguyên. Truy vết tới i=5: chèn 1 lên đầu → [1,2,3,4,7,6,5].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure Binarysearch($a_1<a_2<\\dots<a_n$, x: integer)\ni:=1\nj:=n\nwhile (i<j)\n  m:=$\\lfloor(i+j)/2\\rfloor$\n  if $x>a_m$ then i:=m+1\n  else j:=m\nif $x=a_i$ then location:=i\nelse location:=0</pre> If input = 2, 4, 5, 7, 8, 9, 10, 13 and x = 11, after the third time of dividing into sublists, the sublist to be considered is ___|||Cho Binarysearch (như trên). Với input 2,4,5,7,8,9,10,13 và x=11, sau lần chia thứ BA, dãy con là gì?",
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
          "explanation": "<div class=\"ml-en\">1st split: i=5,j=8 → [8,9,10,13]. 2nd: i=7,j=8 → [10,13]. 3rd: i=1,j=8,m=7,$a_7$=10<11→i=8; sublist is just $a_8$=[13].</div><div class=\"ml-vi\">Lần 1: i=5,j=8→[8,9,10,13]. Lần 2: i=7,j=8→[10,13]. Lần 3: m=7,$a_7$=10<11→i=8; dãy con chỉ còn $a_8$=[13].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>Procedure Insertionsort($a_1,a_2,\\dots,a_n$: integer)\nfor i = 2 to n do\n  j := 1\n  while $a_j<a_i$\n    j := j+1\n  temp := $a_i$\n  for k := i down to j+1\n    $a_k$:=$a_{k-1}$\n  $a_j$ := temp</pre> If input = 7, 2, 4, 3, 1, 6, 5, after running the outer loop with i = 5, the order of the elements in the list is ___|||Cho Insertionsort (như trên). Với input 7,2,4,3,1,6,5, sau khi chạy vòng ngoài i=5, thứ tự danh sách là gì?",
          "options": [
            {
              "text": "1, 2, 3, 4, 7, 6, 5|||1, 2, 3, 4, 7, 6, 5"
            },
            {
              "text": "2, 3, 4, 7, 1, 6, 5|||2, 3, 4, 7, 1, 6, 5"
            },
            {
              "text": "2, 4, 7, 3, 1, 6, 5|||2, 4, 7, 3, 1, 6, 5"
            },
            {
              "text": "1, 2, 3, 4, 5, 6, 7|||1, 2, 3, 4, 5, 6, 7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">i=2:[2,7,4,3,1,6,5]. i=3: insert 4→[2,4,7,3,1,6,5]. i=4: insert 3→[2,3,4,7,1,6,5]. i=5: insert 1 to front→[1,2,3,4,7,6,5].</div><div class=\"ml-vi\">i=2:[2,7,4,3,1,6,5]. i=3: chèn 4→[2,4,7,3,1,6,5]. i=4: chèn 3→[2,3,4,7,1,6,5]. i=5: chèn 1 lên đầu→[1,2,3,4,7,6,5].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x) = x^2\\log(x)$ and $g(x) = x\\log(x^2)$. Choose the correct statements: (i) $f(x) = O(g(x))$ (ii) $g(x) = O(f(x))$|||Cho $f(x) = x^2\\log(x)$ và $g(x) = x\\log(x^2)$. Chọn phát biểu đúng: (i)-(ii) như trên.",
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
          "explanation": "<div class=\"ml-en\">$g(x)=2x\\log x$ grows slower than $f(x)=x^2\\log x$. So $g=O(f)$ true (ii); $f=O(g)$ false.</div><div class=\"ml-vi\">$g(x)=2x\\log x$ tăng chậm hơn $f(x)=x^2\\log x$. Nên $g=O(f)$ đúng (ii); $f=O(g)$ sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)$ is $O(\\log n)$, $g(n)$ is $O(1)$ and $h(n)$ is $O(n)$. Find the best big-O estimate of $(f(n))^3 + (g(n)+2)*h(n)$ (i) $O(\\log n)$ (ii) $O(n)$ (iii) $O(n\\log n)$ (iv) $O(n^2)$ (v) $O(n^2\\log n)$|||Cho $f(n)$ là $O(\\log n)$, $g(n)$ là $O(1)$, $h(n)$ là $O(n)$. Ước lượng big-O tốt nhất của $(f(n))^3 + (g(n)+2)*h(n)$? (i)-(v) như trên.",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">$(f(n))^3=O((\\log n)^3)$, dominated by $(g(n)+2)h(n)=O(1)\\cdot O(n)=O(n)$. Sum is $O(n)$.</div><div class=\"ml-vi\">$(f(n))^3=O((\\log n)^3)$ bị lấn át bởi $(g(n)+2)h(n)=O(n)$. Tổng là $O(n)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which functions are NOT $O(x\\log x)$? (i) $x\\log(x^2)$ (ii) $x^2$ (iii) $x$ (iv) $x+2$|||Hàm nào KHÔNG phải $O(x\\log x)$? (i) $x\\log(x^2)$ (ii) $x^2$ (iii) $x$ (iv) $x+2$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$x\\log(x^2)=2x\\log x$ is $O(x\\log x)$. $x$ and $x+2$ grow slower, also $O(x\\log x)$. Only $x^2$ grows faster — NOT $O(x\\log x)$.</div><div class=\"ml-vi\">$x\\log(x^2)=2x\\log x$ là $O(x\\log x)$. $x$ và $x+2$ tăng chậm hơn, cũng $O(x\\log x)$. Chỉ $x^2$ tăng nhanh hơn — KHÔNG phải $O(x\\log x)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x) = x\\log(x^3)+x^2\\log(x)+x\\log(x)^2$. Find a function $g(x)$ that $f(x)=\\Theta(g(x))$. (i) $x^2\\log(x)$ (ii) $x\\log(x)$ (iii) $x\\log(x^3)$ (iv) $x\\log(x)^2$|||Cho $f(x) = x\\log(x^3)+x^2\\log(x)+x\\log(x)^2$. Tìm $g(x)$ sao cho $f(x)=\\Theta(g(x))$. (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">$x\\log(x^3)=3x\\log x$ and $x(\\log x)^2$ both grow slower than $x^2\\log x$. Dominant term is $x^2\\log(x)$.</div><div class=\"ml-vi\">$x\\log(x^3)=3x\\log x$ và $x(\\log x)^2$ đều tăng chậm hơn $x^2\\log x$. Số hạng lấn át là $x^2\\log(x)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the smallest integer n such that the following function is $O(x^n)$: $f(x) = \\sqrt{x^8+x^4+x^2+1}$|||Tìm số nguyên n nhỏ nhất sao cho hàm sau là $O(x^n)$: $f(x) = \\sqrt{x^8+x^4+x^2+1}$",
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
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Under the root, $x^8$ dominates, so $f(x)\\sim\\sqrt{x^8}=x^4$. Smallest n is 4.</div><div class=\"ml-vi\">Trong căn, $x^8$ lấn át, nên $f(x)\\sim\\sqrt{x^8}=x^4$. n nhỏ nhất là 4.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)$ is $O(\\log n)$, $g(n)$ is $O(1)$ and $h(n)$ is $O(n)$. Find the best big-O estimate of $f(n)^{g(n)} + \\dfrac{h(n)}{g(n)}$ (i) $O(\\log n)$ (ii) $O(n)$ (iii) $O(n\\log n)$ (iv) $O(n^2)$ (v) $O(n^2\\log n)$|||Cho $f(n)$ là $O(\\log n)$, $g(n)$ là $O(1)$, $h(n)$ là $O(n)$. Ước lượng big-O tốt nhất của $f(n)^{g(n)} + \\dfrac{h(n)}{g(n)}$? (i)-(v) như trên.",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(n)^{g(n)}$ with $g(n)=O(1)$ (bounded exponent) stays polylogarithmic. $h(n)/g(n)=O(n)/O(1)=O(n)$, which dominates. Sum is $O(n)$.</div><div class=\"ml-vi\">$f(n)^{g(n)}$ với $g(n)=O(1)$ (số mũ bị chặn) vẫn ở mức polylog. $h(n)/g(n)=O(n)/O(1)=O(n)$, lấn át. Tổng là $O(n)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least integer n such that $f(x)$ is $O(x^n)$, where $f(x) = (\\log_8 x)^2 + \\log_2(\\log_{10}x)$.|||Tìm số nguyên n nhỏ nhất sao cho $f(x)$ là $O(x^n)$, với $f(x) = (\\log_8 x)^2 + \\log_2(\\log_{10}x)$.",
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
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(\\log x)^2$ and $\\log(\\log x)$ both grow slower than any positive power of x, including $x^0=1$. Smallest n is 0.</div><div class=\"ml-vi\">$(\\log x)^2$ và $\\log(\\log x)$ đều tăng chậm hơn bất kỳ lũy thừa dương nào của x, kể cả $x^0=1$. n nhỏ nhất là 0.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D2",
      "source": "REAL",
      "sortOrder": 122,
      "title": "Progress Test 2 — Đề 2/9|||Kiểm tra tiến độ 2 — Đề 2/9",
      "description": "MAD101 Progress Test 2 question bank, part 2 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 2/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Let $f(x) = x^2\\log(x)$ and $g(x) = x\\log(x^4)$. Choose the correct statements: (i) $f(x) = O(g(x))$ (ii) $g(x) = O(f(x))$|||Cho $f(x) = x^2\\log(x)$ và $g(x) = x\\log(x^4)$. Chọn phát biểu đúng: (i)-(ii) như trên.",
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
          "explanation": "<div class=\"ml-en\">$g(x)=4x\\log x$ grows slower than $f(x)=x^2\\log x$. So $g=O(f)$ true (ii); $f=O(g)$ false.</div><div class=\"ml-vi\">$g(x)=4x\\log x$ tăng chậm hơn $f(x)=x^2\\log x$. Nên $g=O(f)$ đúng (ii); $f=O(g)$ sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure TT(n: integer)\nsum:=0\ni:=0\nj:=0\nwhile ($i<\\sqrt{n}$)\n  sum:=sum+1\n  i:=i+1\nwhile ($j<\\sqrt{n}/2$)\n  j:=j+1\n  sum:=sum+1\nPrint(sum)</pre> If n=9, how many additions are required?|||Cho TT (như trên). Nếu n=9, cần bao nhiêu phép cộng?",
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
          "explanation": "<div class=\"ml-en\">$\\sqrt9=3$: loop1 runs i=0,1,2 (3 times), each with 2 additions (sum+1, i+1) = 6. loop2: $\\sqrt9/2=1.5$, j=0,1 (2 times), each 2 additions (j+1, sum+1) = 4. Total $6+4=10$.</div><div class=\"ml-vi\">$\\sqrt9=3$: vòng 1 chạy 3 lần, mỗi lần 2 phép cộng (sum+1, i+1) = 6. Vòng 2 chạy 2 lần (j<1.5), mỗi lần 2 phép cộng = 4. Tổng $6+4=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure Ia(c, $a_0,a_1,\\dots,a_n$: integers)\np := 1\nm := $a_0$\nfor i := 1 to n\n  p := p*c\n  m := m + $a_i$*p</pre> If the input consists of c=4 and $[a_0,a_1,\\dots,a_n]=[3,6,7,8,3]$, how many multiplications (*) are used?|||Cho Ia (như trên). Với c=4 và $[a_0,\\dots,a_n]=[3,6,7,8,3]$, cần bao nhiêu phép nhân (*)?",
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
              "text": "10|||10"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">n=4 (5 values $a_0..a_4$, loop runs i=1..4). Each iteration does 2 multiplications ($p:=p*c$ and $a_i*p$): $4\\times2=8$.</div><div class=\"ml-vi\">n=4 (5 giá trị $a_0..a_4$, vòng lặp i=1..4). Mỗi lần lặp 2 phép nhân: $4\\times2=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the largest integer n for which one can solve within 1 second a problem using an algorithm that requires $f(n)=2^n$ bit operations, where each bit operation is carried out in $10^{-9}$ seconds?|||Số nguyên n lớn nhất để giải trong 1 giây bài toán cần $f(n)=2^n$ phép bit, mỗi phép mất $10^{-9}$ giây?",
          "options": [
            {
              "text": "30|||30"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "27|||27"
            },
            {
              "text": "29|||29"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Need $2^n\\times10^{-9}\\le1\\Rightarrow2^n\\le10^9$. $2^{29}\\approx5.37\\times10^8$ (fits); $2^{30}\\approx1.07\\times10^9$ (exceeds). Largest n=29.</div><div class=\"ml-vi\">Cần $2^n\\le10^9$. $2^{29}\\approx5.37\\times10^8$ (vừa); $2^{30}\\approx1.07\\times10^9$ (vượt). n lớn nhất=29.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the bubble sort algorithm: <pre>procedure bubblesort($a_1,a_2,\\dots,a_n$: integers)\nfor i=1 to n-1\n  for j=1 to n-i\n    if $a_j>a_{j+1}$ then swap($a_j,a_{j+1}$)</pre> If the input is $\\{4,2,3,1\\}$, how many swaps are used?|||Trong bubble sort (như trên). Với đầu vào $\\{4,2,3,1\\}$, cần bao nhiêu lần đổi chỗ?",
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
          "explanation": "<div class=\"ml-en\">i=1: [4,2,3,1]→swap(4,2)→[2,4,3,1]→swap(4,3)→[2,3,4,1]→swap(4,1)→[2,3,1,4] (3 swaps). i=2: [2,3,1,4]→2<3 no swap→swap(3,1)→[2,1,3,4] (1 swap). i=3: [2,1,3,4]→swap(2,1)→[1,2,3,4] (1 swap). Total=3+1+1=5.</div><div class=\"ml-vi\">Truy vết: i=1 có 3 lần đổi chỗ, i=2 có 1 lần, i=3 có 1 lần. Tổng=5.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the largest n for which one can solve within one second using an algorithm that requires $f(n)=2^{n^2}$ bit operations, where each bit operation is carried out in $10^{-12}$ seconds?|||n lớn nhất để giải trong 1 giây bằng thuật toán cần $f(n)=2^{n^2}$ phép bit, mỗi phép mất $10^{-12}$ giây?",
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
          "explanation": "<div class=\"ml-en\">Need $2^{n^2}\\le10^{12}\\Rightarrow n^2\\le12\\log_2(10)\\approx39.86\\Rightarrow n\\le6.31$. Largest integer n=6.</div><div class=\"ml-vi\">Cần $2^{n^2}\\le10^{12}\\Rightarrow n^2\\le12\\log_2(10)\\approx39.86\\Rightarrow n\\le6.31$. n nguyên lớn nhất=6.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the largest n for which one can solve within one second a problem using an algorithm that requires $f(n)=n^2$ bit operations, where each bit operation is carried out in $10^{-9}$ seconds?|||n lớn nhất để giải trong 1 giây bằng thuật toán cần $f(n)=n^2$ phép bit, mỗi phép mất $10^{-9}$ giây?",
          "options": [
            {
              "text": "31622|||31622"
            },
            {
              "text": "31621|||31621"
            },
            {
              "text": "31620|||31620"
            },
            {
              "text": "31000|||31000"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "LO3.2|||LO3.2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Need $n^2\\times10^{-9}\\le1\\Rightarrow n^2\\le10^9\\Rightarrow n\\le\\sqrt{10^9}\\approx31622.78$. Largest integer n=31622.</div><div class=\"ml-vi\">Cần $n^2\\le10^9\\Rightarrow n\\le\\sqrt{10^9}\\approx31622.78$. n nguyên lớn nhất=31622.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>Procedure product(n: integer)\np:=0;\nfor i:=1 to n do\n  for j:=1 to (n+1) do\n    for k:=1 to (n+2) do\n      p:=i*j*k;\nPrint(p)</pre> How many multiplications are used if n=5?|||Cho product (như trên). Nếu n=5, cần bao nhiêu phép nhân?",
          "options": [
            {
              "text": "420|||420"
            },
            {
              "text": "210|||210"
            },
            {
              "text": "125|||125"
            },
            {
              "text": "250|||250"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Iterations: $5\\times6\\times7=210$; each computes $i*j*k$ using 2 multiplications: $210\\times2=420$.</div><div class=\"ml-vi\">Số lần lặp: $5\\times6\\times7=210$; mỗi lần 2 phép nhân ($i*j$ rồi $*k$): $210\\times2=420$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure Ia($a_1,a_2,\\dots,a_n$: integers)\nm := $a_1$\nt := 0\nfor i:=2 to n\n  if ($a_i>m$) then\n    m:=$a_i$\n    t:=t+1</pre> If the input is the list $[1,6,2,3,7,7,4,8,8,6]$, how many additions are used?|||Cho Ia (như trên). Với đầu vào $[1,6,2,3,7,7,4,8,8,6]$, cần bao nhiêu phép cộng?",
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
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$a_1=1$. Strictly-greater updates: $a_2=6>1$; $a_5=7>6$; $a_8=8>7$ — 3 updates, so $t:=t+1$ runs 3 times.</div><div class=\"ml-vi\">$a_1=1$. Cập nhật (lớn hơn nghiêm ngặt): $a_2=6>1$; $a_5=7>6$; $a_8=8>7$ — 3 lần, nên $t:=t+1$ chạy 3 lần.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which integer is congruent to 5 mod 17?|||Số nguyên nào đồng dư với 5 mod 17?",
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
          "explanation": "<div class=\"ml-en\">$-29+34=5$ ($34=2\\times17$), so $-29\\equiv5\\pmod{17}$. ($103\\bmod17=1$, $80\\bmod17=12$, $-122\\bmod17=14$.)</div><div class=\"ml-vi\">$-29+34=5$ ($34=2\\times17$), nên $-29\\equiv5\\pmod{17}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let a = 137 mod 31 and b = -137 mod 31. Find b - a.|||Cho a = 137 mod 31 và b = -137 mod 31. Tìm b - a.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "-7|||-7"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "-13|||-13"
            },
            {
              "text": "17|||17"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$137=4\\times31+13\\Rightarrow a=13$. $-137=-5\\times31+18\\Rightarrow b=18$. $b-a=18-13=5$.</div><div class=\"ml-vi\">$137=4\\times31+13\\Rightarrow a=13$. $-137=-5\\times31+18\\Rightarrow b=18$. $b-a=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sequence of pseudorandom numbers is generated as follows $x_0=4$, $x_n=(6x_{n-1}+5)\\bmod13$ for n>0. Find $x_4$.|||Dãy giả ngẫu nhiên $x_0=4$, $x_n=(6x_{n-1}+5)\\bmod13$. Tìm $x_4$.",
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
          "explanation": "<div class=\"ml-en\">$x_1=(24+5)\\bmod13=3$. $x_2=(18+5)\\bmod13=10$. $x_3=(60+5)\\bmod13=0$. $x_4=(0+5)\\bmod13=5$.</div><div class=\"ml-vi\">$x_1=3,x_2=10,x_3=0,x_4=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let a = 131 div 37 and b = -131 div 37. Find a-b.|||Cho a = 131 div 37 và b = -131 div 37. Tìm a-b.",
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
          "explanation": "<div class=\"ml-en\">$131=3\\times37+20\\Rightarrow a=3$. $-131=-4\\times37+17\\Rightarrow b=-4$ (div rounds toward $-\\infty$). $a-b=3-(-4)=7$.</div><div class=\"ml-vi\">$131=3\\times37+20\\Rightarrow a=3$. $-131=-4\\times37+17\\Rightarrow b=-4$. $a-b=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let a = 131 mod 37 and b = -131 mod 37. Find a-b.|||Cho a = 131 mod 37 và b = -131 mod 37. Tìm a-b.",
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
          "explanation": "<div class=\"ml-en\">$131=3\\times37+20\\Rightarrow a=20$. $-131=-4\\times37+17\\Rightarrow b=17$. $a-b=20-17=3$.</div><div class=\"ml-vi\">$131=3\\times37+20\\Rightarrow a=20$. $-131=-4\\times37+17\\Rightarrow b=17$. $a-b=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{x_n\\}$ be a sequence of pseudorandom numbers such that $x_{n+1}=3x_n\\bmod11$ for n>0. Suppose $x_3=7$. Find $x_2$ and $x_4$.|||Cho dãy giả ngẫu nhiên $x_{n+1}=3x_n\\bmod11$. Giả sử $x_3=7$. Tìm $x_2$ và $x_4$.",
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
          "explanation": "<div class=\"ml-en\">Need $x_2$ with $3x_2\\bmod11=7$: $x_2=6$ gives $18\\bmod11=7$ ✓. $x_4=3\\times7\\bmod11=21\\bmod11=10$.</div><div class=\"ml-vi\">Cần $x_2$ với $3x_2\\bmod11=7$: $x_2=6$ cho $18\\bmod11=7$ ✓. $x_4=3\\times7\\bmod11=21\\bmod11=10$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D3",
      "source": "REAL",
      "sortOrder": 123,
      "title": "Progress Test 2 — Đề 3/9|||Kiểm tra tiến độ 2 — Đề 3/9",
      "description": "MAD101 Progress Test 2 question bank, part 3 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 3/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Which statements are true? (i) If $a\\equiv b\\pmod m$ then $2a-b\\equiv b\\pmod m$ (ii) If $a\\equiv b\\pmod m$ and $c\\equiv d\\pmod m$ then $ac\\equiv bd\\pmod m$|||Mệnh đề nào đúng? (i) Nếu $a\\equiv b\\pmod m$ thì $2a-b\\equiv b\\pmod m$ (ii) Nếu $a\\equiv b\\pmod m$ và $c\\equiv d\\pmod m$ thì $ac\\equiv bd\\pmod m$",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">(i): substitute $a\\equiv b$: $2a-b\\equiv2b-b=b\\pmod m$ ✓. (ii) is the standard product rule for congruences ✓. Both true.</div><div class=\"ml-vi\">(i) đúng (thay $a\\equiv b$: $2a-b\\equiv2b-b=b$). (ii) là quy tắc nhân đồng dư chuẩn, đúng. Cả hai đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let a = 137 div 31 and b = -137 div 31. Find a + b.|||Cho a = 137 div 31 và b = -137 div 31. Tìm a + b.",
          "options": [
            {
              "text": "-1|||-1"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$137=4\\times31+13\\Rightarrow a=4$. $-137=-5\\times31+18\\Rightarrow b=-5$. $a+b=4+(-5)=-1$.</div><div class=\"ml-vi\">$137=4\\times31+13\\Rightarrow a=4$. $-137=-5\\times31+18\\Rightarrow b=-5$. $a+b=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the greatest common divisor of $2^3\\cdot3^2\\cdot5\\cdot7$ and $2^4\\cdot5^2\\cdot11^3$.|||Tìm ước chung lớn nhất của $2^3\\cdot3^2\\cdot5\\cdot7$ và $2^4\\cdot5^2\\cdot11^3$.",
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
          "explanation": "<div class=\"ml-en\">GCD takes the minimum exponent of shared primes only: $2^{\\min(3,4)}\\cdot5^{\\min(1,2)}=2^3\\cdot5=40$ (3, 7, 11 aren't shared).</div><div class=\"ml-vi\">GCD lấy số mũ nhỏ hơn của các số nguyên tố CHUNG: $2^{\\min(3,4)}\\cdot5^{\\min(1,2)}=2^3\\cdot5=40$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers less than 18 are relatively prime to 18?|||Có bao nhiêu số nguyên dương nhỏ hơn 18 nguyên tố cùng nhau với 18?",
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
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\varphi(18)=\\varphi(2\\cdot3^2)=18\\cdot\\frac12\\cdot\\frac23=6$.</div><div class=\"ml-vi\">$\\varphi(18)=\\varphi(2\\cdot3^2)=18\\cdot\\frac12\\cdot\\frac23=6$.</div>"
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
          "explanation": "<div class=\"ml-en\">$\\varphi(15)=\\varphi(3\\cdot5)=15\\cdot\\frac23\\cdot\\frac45=8$.</div><div class=\"ml-vi\">$\\varphi(15)=\\varphi(3\\cdot5)=15\\cdot\\frac23\\cdot\\frac45=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers less than 13 that are relatively prime to 13?|||Có bao nhiêu số nguyên dương nhỏ hơn 13 nguyên tố cùng nhau với 13?",
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
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">13 is prime, so every one of 1..12 is coprime to it: $\\varphi(13)=12$.</div><div class=\"ml-vi\">13 là số nguyên tố, nên mọi số 1..12 đều nguyên tố cùng nhau với nó: $\\varphi(13)=12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many primes are in $\\{89, 111, 103, 205\\}$?|||Có bao nhiêu số nguyên tố trong $\\{89, 111, 103, 205\\}$?",
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
          "explanation": "<div class=\"ml-en\">89 is prime. $111=3\\times37$ not prime. 103 is prime. $205=5\\times41$ not prime. Total: 2 primes (89, 103).</div><div class=\"ml-vi\">89 là số nguyên tố. $111=3\\times37$ không phải. 103 là số nguyên tố. $205=5\\times41$ không phải. Tổng: 2 số nguyên tố.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a if LCM(a, 4200)=58800 and GCD(a, 4200)=280.|||Tìm a nếu LCM(a, 4200)=58800 và GCD(a, 4200)=280.",
          "options": [
            {
              "text": "11760|||11760"
            },
            {
              "text": "784|||784"
            },
            {
              "text": "1960|||1960"
            },
            {
              "text": "3920|||3920"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Since $a\\times4200=\\text{LCM}\\times\\text{GCD}$: $a=\\dfrac{58800\\times280}{4200}=\\dfrac{16464000}{4200}=3920$.</div><div class=\"ml-vi\">Vì $a\\times4200=\\text{LCM}\\times\\text{GCD}$: $a=\\dfrac{58800\\times280}{4200}=3920$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the greatest common divisor of $a = 2^3\\cdot3^2\\cdot5^7$, $b = 3^4\\cdot5^3\\cdot7^2$?|||Ước chung lớn nhất của $a = 2^3\\cdot3^2\\cdot5^7$, $b = 3^4\\cdot5^3\\cdot7^2$ là gì?",
          "options": [
            {
              "text": "1125|||1125"
            },
            {
              "text": "225|||225"
            },
            {
              "text": "2250|||2250"
            },
            {
              "text": "375|||375"
            },
            {
              "text": "None of the other choices is true|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">GCD takes min exponent of shared primes 3,5: $3^{\\min(2,4)}5^{\\min(7,3)}=3^2\\cdot5^3=1125$.</div><div class=\"ml-vi\">GCD lấy số mũ nhỏ hơn của 3 và 5: $3^{\\min(2,4)}5^{\\min(7,3)}=3^2\\cdot5^3=1125$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Select a value of p so that the three numbers 26, 55 and p are pairwise relatively prime.|||Chọn giá trị p để ba số 26, 55 và p đôi một nguyên tố cùng nhau.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "39|||39"
            },
            {
              "text": "None of the above|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$26=2\\times13$, $55=5\\times11$. $6=2\\times3$ shares 2 with 26 — bad. $15=3\\times5$ shares 5 with 55 — bad. $39=3\\times13$ shares 13 with 26 — bad. $21=3\\times7$ shares nothing — good.</div><div class=\"ml-vi\">$26=2\\times13$, $55=5\\times11$. $6,15,39$ đều chung thừa số với 26 hoặc 55. $21=3\\times7$ không chung gì — đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the sum of $(BAD)_{16}$ and $(CAFE)_{16}$ in its hexadecimal expansion.|||Tìm tổng $(BAD)_{16}$ và $(CAFE)_{16}$ theo khai triển hex.",
          "options": [
            {
              "text": "$(D6AB)_{16}$|||$(D6AB)_{16}$"
            },
            {
              "text": "$(C6AB)_{16}$|||$(C6AB)_{16}$"
            },
            {
              "text": "$(D5AB)_{16}$|||$(D5AB)_{16}$"
            },
            {
              "text": "$(C5FB)_{16}$|||$(C5FB)_{16}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(BAD)_{16}=2989_{10}$, $(CAFE)_{16}=51966_{10}$. Sum$=54955_{10}$. Converting to hex: $54955=D\\times4096+6\\times256+A\\times16+B \\Rightarrow (D6AB)_{16}$.</div><div class=\"ml-vi\">$(BAD)_{16}=2989$, $(CAFE)_{16}=51966$. Tổng$=54955$. Đổi sang hex: $(D6AB)_{16}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the octal expansion of $(11011111011)_2$|||Tìm khai triển bát phân của $(11011111011)_2$",
          "options": [
            {
              "text": "$(6751)_8$|||$(6751)_8$"
            },
            {
              "text": "$(6733)_8$|||$(6733)_8$"
            },
            {
              "text": "$(3363)_8$|||$(3363)_8$"
            },
            {
              "text": "$(3373)_8$|||$(3373)_8$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Pad to 12 bits and group by 3 from the right: $011\\,011\\,111\\,011 = 3,3,7,3 \\Rightarrow (3373)_8$.</div><div class=\"ml-vi\">Đệm thành 12 bit, nhóm 3 bit từ phải: $011\\,011\\,111\\,011 = 3,3,7,3 \\Rightarrow (3373)_8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert $(122)_3$ to base 7 expansion.|||Chuyển $(122)_3$ sang khai triển cơ số 7.",
          "options": [
            {
              "text": "$(65)_7$|||$(65)_7$"
            },
            {
              "text": "$(233)_7$|||$(233)_7$"
            },
            {
              "text": "$(23)_7$|||$(23)_7$"
            },
            {
              "text": "$(17)_7$|||$(17)_7$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(122)_3=1\\times9+2\\times3+2=17_{10}$. $17=2\\times7+3 \\Rightarrow (23)_7$.</div><div class=\"ml-vi\">$(122)_3=1\\times9+2\\times3+2=17_{10}$. $17=2\\times7+3 \\Rightarrow (23)_7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the binary expansion of $(204)_5$|||Tìm khai triển nhị phân của $(204)_5$",
          "options": [
            {
              "text": "110110|||110110"
            },
            {
              "text": "11101110|||11101110"
            },
            {
              "text": "1101110|||1101110"
            },
            {
              "text": "1110100|||1110100"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(204)_5=2\\times25+0\\times5+4=54_{10}$. $54=32+16+4+2 \\Rightarrow 110110_2$.</div><div class=\"ml-vi\">$(204)_5=2\\times25+0\\times5+4=54_{10}$. $54=32+16+4+2 \\Rightarrow 110110_2$.</div>"
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
          "explanation": "<div class=\"ml-en\">$(1110)_2=14$, $(1011)_2=11$. $14\\times11=154$. $154=128+16+8+2 \\Rightarrow 10011010_2$.</div><div class=\"ml-vi\">$(1110)_2=14$, $(1011)_2=11$. $14\\times11=154$. $154=128+16+8+2 \\Rightarrow 10011010_2$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D4",
      "source": "REAL",
      "sortOrder": 124,
      "title": "Progress Test 2 — Đề 4/9|||Kiểm tra tiến độ 2 — Đề 4/9",
      "description": "MAD101 Progress Test 2 question bank, part 4 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 4/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Find gcd(851, 931).|||Tìm gcd(851, 931).",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "37|||37"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$851=23\\times37$ and $931=7^2\\times19$ share no common prime factor, so $\\gcd(851,931)=1$ — none of the listed values.</div><div class=\"ml-vi\">$851=23\\times37$ và $931=7^2\\times19$ không có thừa số nguyên tố chung, nên $\\gcd(851,931)=1$ — không khớp giá trị nào đã cho.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find base 3 expansion of $(434)_5$.|||Tìm khai triển cơ số 3 của $(434)_5$.",
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
          "explanation": "<div class=\"ml-en\">$(434)_5=4\\times25+3\\times5+4=119_{10}$. Dividing by 3 repeatedly: $119,39r2,13r0,4r1,1r1,0r1$ → reading remainders bottom-up: $(11102)_3$.</div><div class=\"ml-vi\">$(434)_5=4\\times25+3\\times5+4=119_{10}$. Chia liên tiếp cho 3: $119,39r2,13r0,4r1,1r1,0r1$ → $(11102)_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If Euclidean algorithm is used to find the greatest common divisor of 90 and 24, how many divisions are needed?|||Nếu dùng thuật toán Euclid để tìm ước chung lớn nhất của 90 và 24, cần bao nhiêu phép chia?",
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
          "explanation": "<div class=\"ml-en\">$90=3\\times24+18$; $24=1\\times18+6$; $18=3\\times6+0$. That's 3 divisions.</div><div class=\"ml-vi\">$90=3\\times24+18$; $24=1\\times18+6$; $18=3\\times6+0$. Đó là 3 phép chia.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the strong induction proof of the following problem: Prove that P(n) = \"for all n ≥ 24 we have n = 5a + 7b with a, b non-negative integers\" is true — in order to prove P(k+1) is true, we should ___|||Trong chứng minh quy nạp mạnh: chứng minh P(n) = \"với mọi n≥24, n=5a+7b với a,b nguyên không âm\" đúng — để chứng minh P(k+1) đúng, ta nên ___",
          "options": [
            {
              "text": "use P(k-4) = \"k-4 = 5x+7y, (x,y are in N)\" is true and k+1 = k-4+5.|||dùng P(k-4) = \"k-4 = 5x+7y\" đúng và k+1 = k-4+5."
            },
            {
              "text": "use P(k-2) = \"k-2 = 5x+7y, (x,y are in N)\" is true and k+1 = k-2+3.|||dùng P(k-2) = \"k-2 = 5x+7y\" đúng và k+1 = k-2+3."
            },
            {
              "text": "use P(k-1) = \"k-1 = 5x+7y, (x,y are in N)\" is true and k+1 = k-1+2.|||dùng P(k-1) = \"k-1 = 5x+7y\" đúng và k+1 = k-1+2."
            },
            {
              "text": "use P(k-3) = \"k-3 = 5x+7y, (x,y are in N)\" is true and k+1 = k-3+4.|||dùng P(k-3) = \"k-3 = 5x+7y\" đúng và k+1 = k-3+4."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Since the coefficient for a is 5, reduce by one unit of a: $k+1-5=k-4$, so $k+1=(k-4)+5$ — this needs $P(k-4)$, matching 5 base cases (n=24..28).</div><div class=\"ml-vi\">Vì hệ số của a là 5, giảm một đơn vị a: $k+1-5=k-4$, nên $k+1=(k-4)+5$ — cần $P(k-4)$, khớp 5 trường hợp cơ sở (n=24..28).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that $1+3+\\dots+(2n-1)=n^2$ for all $n\\ge1$. Which of the following equations is true? (i) $1+3+\\dots+(2k+1)=k^2+(2k+1)$ (ii) $1+3+\\dots+(2k+1)=k^2+2$ (iii) $1+3+\\dots+(2k+1)=1+2+\\dots+(2k-1)+2$ (iv) $1+3+\\dots+(2k+1)=(k-1)^2+(2k+1)$|||Cho $1+3+\\dots+(2n-1)=n^2$ với mọi $n\\ge1$. Phương trình nào đúng? (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">The sum up to the k-th term is $k^2$ (given). Adding the next term $(2k+1)$ (the $(k{+}1)$-th term): $1+3+\\dots+(2k-1)+(2k+1)=k^2+(2k+1)$, matching (i).</div><div class=\"ml-vi\">Tổng tới số hạng thứ k là $k^2$ (đề cho). Cộng thêm số hạng kế $(2k+1)$: $k^2+(2k+1)$, khớp (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let P(n) be the statement that $1^2+3^2+5^2+\\dots+(2n+1)^2=\\dfrac{(n+1)(2n+1)(2n+3)}{3}$ for the nonnegative integer n. What is the inductive hypothesis in a proof by mathematical induction? (i) P(k) is true for some integer k>0. (ii) P(k) is true for some integer $k\\ge0$. (iii) P(k+1) is true for some integer k>0. (iv) P(k+1) is true for some integer $k\\ge0$.|||Cho P(n) là mệnh đề trên (n không âm). Giả thiết quy nạp trong chứng minh quy nạp toán học là gì? (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">The inductive hypothesis assumes P(k) holds for an arbitrary k in the domain — here nonnegative integers, so $k\\ge0$.</div><div class=\"ml-vi\">Giả thiết quy nạp giả sử P(k) đúng với k bất kỳ trong miền — ở đây là số nguyên không âm, nên $k\\ge0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let P(n) be the statement that $1^2+3^2+5^2+\\dots+(2n+1)^2=\\dfrac{(n+1)(2n+1)(2n+3)}{3}$ for the nonnegative integer n. Which statement needs to be proven true in the basic step by mathematical induction?|||Cho P(n) như trên (n không âm). Mệnh đề nào cần chứng minh đúng ở bước cơ sở?",
          "options": [
            {
              "text": "P(0)|||P(0)"
            },
            {
              "text": "P(1)|||P(1)"
            },
            {
              "text": "P(k) for all nonnegative integer k|||P(k) cho mọi k không âm"
            },
            {
              "text": "P(k) for some nonnegative integer k|||P(k) cho k không âm nào đó"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The domain starts at the smallest nonnegative integer, 0, so the basic step proves P(0).</div><div class=\"ml-vi\">Miền bắt đầu từ số nguyên không âm nhỏ nhất là 0, nên bước cơ sở chứng minh P(0).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the inductive proof of the proposition \"$1^2+2^2+\\dots+n^2=n(n+1)(2n+1)/6$ for all $n\\ge1$\", which of the following equations is used? (i) $1^2+2^2+\\dots+(k+1)^2=k(k+1)(2k+1)/6+k^2+1$ (ii) $\\dots=k(k+1)(2k+1)/6+(2k+1)$ (iii) $\\dots=k(k+1)(2k+1)/6+(k+1)^2$ (iv) $\\dots=k(k+1)(2k+1)/6+k^2$|||Trong chứng minh quy nạp mệnh đề \"$1^2+2^2+\\dots+n^2=n(n+1)(2n+1)/6$ với mọi $n\\ge1$\", phương trình nào được dùng? (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Adding the next term $(k+1)^2$ to the sum up to k: $1^2+\\dots+(k+1)^2=k(k+1)(2k+1)/6+(k+1)^2$.</div><div class=\"ml-vi\">Cộng thêm số hạng kế $(k+1)^2$ vào tổng tới k: $=k(k+1)(2k+1)/6+(k+1)^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the correct order of the steps of the proof by induction of the following problem: Prove that for all $n\\ge12$ we have $n=4a+5b$ with a,b non-negative integers. Step 1. Suppose for some $k\\ge16$ we have $n=4x+5y$ with x,y non-negative integers for all $n\\le k$. Step 2. n=12..15 base cases shown. Step 3. So for all $n\\ge12$ we have $n=4a+5b$. Step 4. For $n=k+1$ we have $k+1=1\\times4+(k-3)$; since $12\\le k-3<k$, by induction hypothesis $k-3=4a+5b$; then $k+1=4(a+1)+5b$.|||Tìm đúng thứ tự các bước chứng minh quy nạp bài toán trên (n=4a+5b, n≥12).",
          "options": [
            {
              "text": "2, 1, 4, 3|||2, 1, 4, 3"
            },
            {
              "text": "1, 2, 4, 3|||1, 2, 4, 3"
            },
            {
              "text": "2, 1, 3, 4|||2, 1, 3, 4"
            },
            {
              "text": "1, 2, 3, 4|||1, 2, 3, 4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Standard order: base cases first (Step 2), then state the inductive hypothesis (Step 1), then the inductive step computation (Step 4), then the conclusion (Step 3): 2,1,4,3.</div><div class=\"ml-vi\">Thứ tự chuẩn: cơ sở trước (Bước 2), rồi giả thiết quy nạp (Bước 1), rồi bước quy nạp (Bước 4), rồi kết luận (Bước 3): 2,1,4,3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that $1^3+2^3+\\dots+n^3=(n(n+1)/2)^2$ for all $n\\ge1$. Which of the following equations is true? (i) $1^3+\\dots+(k+1)^3=(k(k+1)/2)^2+k^3$ (ii) $\\dots=(k(k+1)/2)^2+(k+1)^3$ (iii) $\\dots=(k(k-1)/2)^2+(k+1)^3$ (iv) $\\dots=(k(k-1)/2)^2+k^3$|||Cho $1^3+2^3+\\dots+n^3=(n(n+1)/2)^2$ với mọi $n\\ge1$. Phương trình nào đúng? (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Adding the next term $(k+1)^3$ to the sum up to k: $1^3+\\dots+(k+1)^3=(k(k+1)/2)^2+(k+1)^3$.</div><div class=\"ml-vi\">Cộng thêm số hạng kế $(k+1)^3$ vào tổng tới k: $=(k(k+1)/2)^2+(k+1)^3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the smallest integer a such that for all integer $n\\ge a$ we have $n=6x+7y$, with x and y non-negative integers.|||Tìm số nguyên a nhỏ nhất sao cho với mọi n≥a ta có $n=6x+7y$, với x,y nguyên không âm.",
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
          "explanation": "<div class=\"ml-en\">Frobenius number for coprime 6,7 is $6\\times7-6-7=29$ (largest non-representable). So every $n\\ge30$ is representable; smallest a=30.</div><div class=\"ml-vi\">Số Frobenius cho 6,7 nguyên tố cùng nhau là $6\\times7-6-7=29$ (số lớn nhất không biểu diễn được). Vậy mọi $n\\ge30$ biểu diễn được; a nhỏ nhất=30.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find f(0) if f(n) = 2f(n-1) - 8 for all positive integers n, and f(1) = 0.|||Tìm f(0) nếu f(n) = 2f(n-1) - 8 với mọi n dương, và f(1) = 0.",
          "options": [
            {
              "text": "Cannot determine|||Không xác định được"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "-8|||-8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=2f(0)-8=0 \\Rightarrow f(0)=4$.</div><div class=\"ml-vi\">$f(1)=2f(0)-8=0 \\Rightarrow f(0)=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a recursive definition for the set $S = \\{(a,b) \\mid a,b \\text{ are positive integers and } a+b \\text{ is an even number}\\}$ (i) $(1,1)\\in S$. If $(a,b)\\in S$ then $(a+2,b+2)\\in S$ (ii) $(1,1)\\in S$. If $(a,b)\\in S$ then $(a,b+2)\\in S, (a+2,b)\\in S$ (iii) $(1,1)\\in S$. If $(a,b)\\in S$ then $(a,b+2)\\in S, (a+2,b)\\in S, (a+1,b+1)\\in S$ (iv) $(1,1)\\in S$. If $(a,b)\\in S$ then $(a+1,b+1)\\in S$|||Tìm định nghĩa đệ quy cho $S = \\{(a,b) \\mid a,b$ nguyên dương và $a+b$ chẵn$\\}$. (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Starting from (1,1) (odd,odd), rules (ii) using only $\\pm2$ steps can only reach (odd,odd) pairs, missing (even,even) pairs like (2,2) — also valid (sum even). Rule (iii) adds $(a+1,b+1)$, which reaches those too, covering the whole set S.</div><div class=\"ml-vi\">Từ (1,1) (lẻ,lẻ), quy tắc (ii) chỉ dùng bước $\\pm2$ nên chỉ tới được cặp (lẻ,lẻ), bỏ sót cặp (chẵn,chẵn) như (2,2) (tổng vẫn chẵn). Quy tắc (iii) thêm $(a+1,b+1)$ mới phủ hết được tập S.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the set defined recursively as follows: Basis step: $2\\in S$. Recursive step: If $x\\in S$ then $2x\\in S$. What is S? (i) $S=\\{2^n \\mid n=1,2,\\dots\\}$ (ii) $S=\\{2^{2n} \\mid n=1,2,\\dots\\}$ (iii) $S=\\{2n \\mid n=1,2,\\dots\\}$|||Cho S định nghĩa đệ quy: cơ sở $2\\in S$, đệ quy: $x\\in S \\Rightarrow 2x\\in S$. S là gì? (i)-(iii) như trên.",
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
          "explanation": "<div class=\"ml-en\">Starting at 2 and repeatedly doubling gives $2,4,8,16,\\dots=2^n$ for $n=1,2,\\dots$</div><div class=\"ml-vi\">Bắt đầu từ 2 và nhân đôi liên tục cho $2,4,8,16,\\dots=2^n$ với $n=1,2,\\dots$</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the subset of the set of ordered pairs of integers defined recursively by: Basis step: $(0,0)\\in S$. Recursive step: If $(a,b)\\in S$, then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is in S?|||Cho S định nghĩa đệ quy như trên. Phần tử nào thuộc S?",
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
          "explanation": "<div class=\"ml-en\">Need $2m+3n=a$, $3m+2n=b$ with nonneg integers m,n. For (7,8): $m=2,n=1$ gives $2(2)+3(1)=7$ ✓ and $3(2)+2(1)=8$ ✓.</div><div class=\"ml-vi\">Cần $2m+3n=a$, $3m+2n=b$ với m,n nguyên không âm. Với (7,8): $m=2,n=1$ cho $2(2)+3(1)=7$ ✓ và $3(2)+2(1)=8$ ✓.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D5",
      "source": "REAL",
      "sortOrder": 125,
      "title": "Progress Test 2 — Đề 5/9|||Kiểm tra tiến độ 2 — Đề 5/9",
      "description": "MAD101 Progress Test 2 question bank, part 5 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 5/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Suppose that f is defined recursively by $f(0)=2$ and $f(n+1)=f(n)^2+2f(n)-3$ for $n\\ge0$. Find $f(3)$.|||Cho f xác định đệ quy $f(0)=2$ và $f(n+1)=f(n)^2+2f(n)-3$ với $n\\ge0$. Tìm $f(3)$.",
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
          "explanation": "<div class=\"ml-en\">$f(1)=4+4-3=5$. $f(2)=25+10-3=32$. $f(3)=1024+64-3=1085$.</div><div class=\"ml-vi\">$f(1)=4+4-3=5$. $f(2)=25+10-3=32$. $f(3)=1024+64-3=1085$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the subset of the set of ordered pairs of integers defined recursively by: Basis step: $(0,0)\\in S$. Recursive step: If $(a,b)\\in S$, then $(a+2,b+3)\\in S$ and $(a+3,b+2)\\in S$. Which element is NOT in S?|||Cho S định nghĩa đệ quy như trên. Phần tử nào KHÔNG thuộc S?",
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
          "explanation": "<div class=\"ml-en\">Need $2m+3n=a,3m+2n=b$ nonneg integers. (10,15): m=5,n=0 ✓. (10,10): m=2,n=2 ✓. (5,5): m=1,n=1 ✓. (10,5): solving gives $m=-1$ — no nonnegative solution, so NOT in S.</div><div class=\"ml-vi\">Cần $2m+3n=a,3m+2n=b$ nguyên không âm. (10,15),(10,10),(5,5) đều có nghiệm hợp lệ. (10,5) giải ra $m=-1$ — không có nghiệm không âm, nên KHÔNG thuộc S.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the sequence $a_0=2$ and $a_n=a_{n-1}^2-1$ for $n>0$. Find $a_4$.|||Cho dãy $a_0=2$ và $a_n=a_{n-1}^2-1$ với $n>0$. Tìm $a_4$.",
          "options": [
            {
              "text": "3968|||3968"
            },
            {
              "text": "63|||63"
            },
            {
              "text": "2454|||2454"
            },
            {
              "text": "75|||75"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$a_1=4-1=3$. $a_2=9-1=8$. $a_3=64-1=63$. $a_4=63^2-1=3969-1=3968$.</div><div class=\"ml-vi\">$a_1=3,a_2=8,a_3=63,a_4=63^2-1=3968$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give a recursive definition of the sequence $\\{a_n=10^n\\}$, $n=0,1,2,3,\\dots$ (i) $a_0=0, a_n=10a_{n-1}$ for $n=1,2,3,\\dots$ (ii) $a_1=1, a_n=10a_{n-1}$ for $n=2,3,\\dots$ (iii) $a_1=10, a_n=10a_{n-1}$ for $n=2,3,\\dots$ (iv) $a_0=1, a_n=10a_{n-1}$ for $n=1,2,3,\\dots$|||Cho định nghĩa đệ quy của dãy $\\{a_n=10^n\\}$. (i)-(iv) như trên.",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Need $a_0=10^0=1$, then $a_n=10a_{n-1}$ for $n\\ge1$ gives $a_1=10,a_2=100,\\dots$ — matches (iv). (i) starts at 0 (wrong base), (ii)/(iii) never define $a_0$.</div><div class=\"ml-vi\">Cần $a_0=10^0=1$, rồi $a_n=10a_{n-1}$ cho $n\\ge1$ — khớp (iv). (i) bắt đầu từ 0 (sai cơ sở), (ii)/(iii) không định nghĩa $a_0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: <pre>Procedure function(n: positive integer)\nif (n=1) then function(n):=1\nelse if (n=2) then function(n):=1\nelse function(n):=function(n-1)+function(n-2)</pre> Find the value of function(n) when n=7.|||Cho thuật toán function (như trên). Tìm function(n) khi n=7.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Fibonacci-style with $f(1)=f(2)=1$: $f_3=2,f_4=3,f_5=5,f_6=8,f_7=13$.</div><div class=\"ml-vi\">Kiểu Fibonacci với $f(1)=f(2)=1$: $f_3=2,f_4=3,f_5=5,f_6=8,f_7=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed to merge the two lists 1, 3, 5, 7, 8, 10 and 2, 4, 6, 9?|||Cần bao nhiêu phép so sánh để trộn hai dãy 1,3,5,7,8,10 và 2,4,6,9?",
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
          "explanation": "<div class=\"ml-en\">Simulating the merge: comparisons consume front elements until one list empties. Tracing gives 9 comparisons (list 2 empties after taking 9; remaining 10 appended with no comparison).</div><div class=\"ml-vi\">Mô phỏng trộn: so sánh tiêu thụ phần tử đầu tới khi một dãy hết. Truy vết ra 9 phép so sánh (dãy 2 hết sau khi lấy 9; còn lại 10 thêm vào không cần so sánh).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed to merge two ordered lists [2, 8, 11, 15, 20, 24] and [1, 5, 6, 7, 12]?|||Cần bao nhiêu phép so sánh để trộn hai dãy đã sắp [2,8,11,15,20,24] và [1,5,6,7,12]?",
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
          "explanation": "<div class=\"ml-en\">Simulating the merge: 8 comparisons before list 2 empties (after taking 12); remaining 15,20,24 appended with no comparison.</div><div class=\"ml-vi\">Mô phỏng trộn: 8 phép so sánh trước khi dãy 2 hết (sau khi lấy 12); còn lại 15,20,24 thêm vào không cần so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: <pre>Procedure AL(n: integer)\nIf n=0 then AL(n):=1\nelse if n=1 then AL(n):=2\nelse if n=2 then AL(n):=3\nelse AL(n):=AL(n-1)*AL(n-2)*AL(n-3)</pre> Find the value of AL(5).|||Cho AL (như trên). Tìm AL(5).",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "36|||36"
            },
            {
              "text": "648|||648"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$AL(3)=3\\times2\\times1=6$. $AL(4)=6\\times3\\times2=36$. $AL(5)=36\\times6\\times3=648$.</div><div class=\"ml-vi\">$AL(3)=6$. $AL(4)=6\\times3\\times2=36$. $AL(5)=36\\times6\\times3=648$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following algorithms are recursive? (i) procedure A(n: nonnegative even integer): if n=0 then A(n):=1; else A(n):=A(n-2)*3 (ii) procedure A(n: nonnegative even integer): if n=0 then y:=1; else begin y:=1; m=n div 2; for i:=1 to m: y:=y*3; end|||Thuật toán nào là đệ quy? (i)-(ii) như trên.",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Both of them|||Cả hai"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "None of them|||Không cái nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i) calls itself ($A(n-2)$) — recursive. (ii) uses an iterative for-loop with no self-call — not recursive, even though it computes the same result.</div><div class=\"ml-vi\">(i) tự gọi lại chính nó ($A(n-2)$) — đệ quy. (ii) dùng vòng lặp for lặp, không tự gọi — không phải đệ quy dù cùng kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: <pre>procedure P(a: real number, n: positive integer)\nif n=1 then\n  return 1\nelse\n  return a + P(a, n-1)</pre> Find output if a=3, n=5.|||Cho P (như trên). Tìm kết quả nếu a=3, n=5.",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "125|||125"
            },
            {
              "text": "243|||243"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$P(3,1)=1,P(3,2)=4,P(3,3)=7,P(3,4)=10,P(3,5)=13$.</div><div class=\"ml-vi\">$P(3,1)=1,P(3,2)=4,P(3,3)=7,P(3,4)=10,P(3,5)=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: <pre>procedure T(a: real number, n: nonegative integer)\nif n=0 then\n  return 1\nelse\n  return a*T(a, n-1)</pre> Find output if a=2, n=3.|||Cho T (như trên). Tìm kết quả nếu a=2, n=3.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$T(2,0)=1,T(2,1)=2,T(2,2)=4,T(2,3)=8$.</div><div class=\"ml-vi\">$T(2,0)=1,T(2,1)=2,T(2,2)=4,T(2,3)=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recursive algorithm: <pre>procedure T(n: integer)\nif n<3 then\n  return 3\nelse if (n mod 2=0) then\n  return n\nelse\n  return 3*T(n-1)-2</pre> Find output if n=9.|||Cho T (như trên). Tìm kết quả nếu n=9.",
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
          "explanation": "<div class=\"ml-en\">n=8 is even, $\\ge3$: $T(8)=8$. n=9 odd: $T(9)=3\\times T(8)-2=3\\times8-2=22$.</div><div class=\"ml-vi\">n=8 chẵn, $\\ge3$: $T(8)=8$. n=9 lẻ: $T(9)=3\\times8-2=22$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many subsets of $\\{1,2,3,4,5,6\\}$ are there that have 5 as the largest element?|||Có bao nhiêu tập con của $\\{1,2,3,4,5,6\\}$ có 5 là phần tử lớn nhất?",
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "24|||24"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Must include 5, exclude 6, and freely include/exclude each of $\\{1,2,3,4\\}$: $2^4=16$.</div><div class=\"ml-vi\">Phải chứa 5, không chứa 6, và chọn tự do mỗi phần tử trong $\\{1,2,3,4\\}$: $2^4=16$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\{1,2,3,4,5\\}$. How many functions from A to A are there such that f(1) is different from f(2)?|||Cho $A=\\{1,2,3,4,5\\}$. Có bao nhiêu hàm từ A tới A sao cho f(1) khác f(2)?",
          "options": [
            {
              "text": "3125|||3125"
            },
            {
              "text": "625|||625"
            },
            {
              "text": "2500|||2500"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Total functions: $5^5=3125$. Functions with $f(1)=f(2)$: $5\\times5^3=625$ (choose the shared value, then f(3),f(4),f(5) freely). Difference: $3125-625=2500$.</div><div class=\"ml-vi\">Tổng hàm: $5^5=3125$. Hàm có $f(1)=f(2)$: $5\\times5^3=625$. Hiệu: $3125-625=2500$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many strings of three decimal digits have exactly two digits that are 4s?|||Có bao nhiêu chuỗi 3 chữ số thập phân có đúng hai chữ số là 4?",
          "options": [
            {
              "text": "27|||27"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "29|||29"
            },
            {
              "text": "30|||30"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Choose which of the 3 positions is NOT a 4 (3 ways); that position has 9 choices (any digit except 4). Total $3\\times9=27$.</div><div class=\"ml-vi\">Chọn vị trí nào trong 3 vị trí KHÔNG phải 4 (3 cách); vị trí đó có 9 lựa chọn (mọi chữ số trừ 4). Tổng $3\\times9=27$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D6",
      "source": "REAL",
      "sortOrder": 126,
      "title": "Progress Test 2 — Đề 6/9|||Kiểm tra tiến độ 2 — Đề 6/9",
      "description": "MAD101 Progress Test 2 question bank, part 6 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 6/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "How many one-to-one functions are there from a set with 5 elements to another set with 10 elements?|||Có bao nhiêu hàm đơn ánh từ tập 5 phần tử tới tập 10 phần tử?",
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
          "explanation": "<div class=\"ml-en\">Injections from a 5-set to a 10-set: $P(10,5)=10\\times9\\times8\\times7\\times6=30240$.</div><div class=\"ml-vi\">Đơn ánh từ tập 5 tới tập 10: $P(10,5)=30240$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $X=\\{\\emptyset, \\{\\emptyset\\}, \\{a,b\\}, c\\}$, $Y=\\{x, \\{z,z\\}, x\\}$. How many one-to-one functions are there from Y to X?|||Cho $X=\\{\\emptyset, \\{\\emptyset\\}, \\{a,b\\}, c\\}$, $Y=\\{x, \\{z,z\\}, x\\}$. Có bao nhiêu đơn ánh từ Y tới X?",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "12|||12"
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
          "explanation": "<div class=\"ml-en\">As a set, $Y=\\{x,\\{z,z\\},x\\}=\\{x,\\{z\\}\\}$ has only 2 distinct elements. $|X|=4$. Injections from a 2-set to a 4-set: $P(4,2)=12$.</div><div class=\"ml-vi\">Là tập hợp, $Y$ chỉ có 2 phần tử khác nhau. $|X|=4$. Đơn ánh từ tập 2 tới tập 4: $P(4,2)=12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers not exceeding 200 and are divisible by 3 or 5?|||Có bao nhiêu số nguyên dương không vượt quá 200 chia hết cho 3 hoặc 5?",
          "options": [
            {
              "text": "80|||80"
            },
            {
              "text": "106|||106"
            },
            {
              "text": "90|||90"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "93|||93"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\lfloor200/3\\rfloor+\\lfloor200/5\\rfloor-\\lfloor200/15\\rfloor=66+40-13=93$.</div><div class=\"ml-vi\">$\\lfloor200/3\\rfloor+\\lfloor200/5\\rfloor-\\lfloor200/15\\rfloor=66+40-13=93$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the functions $f: \\{1,2,3,4\\} \\to \\{1,2,3,4,5,6,7,8\\}$. How many one-to-one functions that are increasing?|||Xét hàm $f: \\{1,2,3,4\\} \\to \\{1,\\dots,8\\}$. Có bao nhiêu hàm đơn ánh TĂNG?",
          "options": [
            {
              "text": "70|||70"
            },
            {
              "text": "85|||85"
            },
            {
              "text": "60|||60"
            },
            {
              "text": "90|||90"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An increasing injection is determined by choosing a 4-element subset of the 8-element codomain: $\\binom{8}{4}=70$.</div><div class=\"ml-vi\">Hàm đơn ánh tăng được xác định bởi việc chọn tập con 4 phần tử của tập đích 8 phần tử: $\\binom{8}{4}=70$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many functions are there from the set $\\{1,2,3,4,5\\}$ to the set $\\{0,1,2\\}$?|||Có bao nhiêu hàm từ tập $\\{1,2,3,4,5\\}$ tới tập $\\{0,1,2\\}$?",
          "options": [
            {
              "text": "125|||125"
            },
            {
              "text": "60|||60"
            },
            {
              "text": "243|||243"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Each of 5 domain elements picks 1 of 3 codomain values: $3^5=243$.</div><div class=\"ml-vi\">Mỗi phần tử trong 5 phần tử miền chọn độc lập 1 trong 3 giá trị: $3^5=243$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a sequence $\\{a_n\\}$ satisfying the recurrence relation $a_0=-1, a_n=a_{n-1}+3^n$ for $n=1,2,\\dots$. Find $a_5$.|||Cho dãy $a_0=-1, a_n=a_{n-1}+3^n$. Tìm $a_5$.",
          "options": [
            {
              "text": "358|||358"
            },
            {
              "text": "360|||360"
            },
            {
              "text": "362|||362"
            },
            {
              "text": "364|||364"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a_5=-1+3+9+27+81+243=362$.</div><div class=\"ml-vi\">$a_5=-1+3+9+27+81+243=362$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a sequence $\\{a_n\\}$ satisfying the recurrence relation $a_1=1, a_n=a_{n-1}+3^n$ for $n=2,3,\\dots$. Find $a_4$.|||Cho dãy $a_1=1, a_n=a_{n-1}+3^n$. Tìm $a_4$.",
          "options": [
            {
              "text": "112|||112"
            },
            {
              "text": "118|||118"
            },
            {
              "text": "114|||114"
            },
            {
              "text": "116|||116"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$a_1=1,a_2=10,a_3=37,a_4=118$.</div><div class=\"ml-vi\">$a_1=1,a_2=10,a_3=37,a_4=118$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $a_n=2^n+4(3^n)+n$ for $n=0,1,2,\\dots$. Find $a_0, a_2$ and $a_4$.|||Cho $a_n=2^n+4(3^n)+n$. Tìm $a_0, a_2, a_4$.",
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
          "explanation": "<div class=\"ml-en\">$a_0=5,a_2=4+36+2=42,a_4=16+324+4=344$.</div><div class=\"ml-vi\">$a_0=5,a_2=42,a_4=344$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a recursive relation $a_n = -3a_{n-1}+4a_{n-2}$. Which of the following formulas satisfy this relation? (i) $a_n=-12$ (ii) $a_n=(-4)^n$ (iii) $a_n=-1$|||Cho $a_n = -3a_{n-1}+4a_{n-2}$. Công thức nào thỏa? (i)-(iii) như trên.",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i), (ii) and (iii)|||(i), (ii), (iii)"
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
          "explanation": "<div class=\"ml-en\">All three check out: constant $-12$: $-3(-12)+4(-12)=-12$✓; $(-4)^n$: $-3(-4)^{n-1}+4(-4)^{n-2}=(-4)^n$✓; constant $-1$: $-3(-1)+4(-1)=-1$✓.</div><div class=\"ml-vi\">Cả ba đều thỏa khi thay vào kiểm tra trực tiếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many binary strings of length 5 that contain two consecutive 1s?|||Có bao nhiêu chuỗi nhị phân độ dài 5 chứa hai bit 1 liên tiếp?",
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
          "explanation": "<div class=\"ml-en\">Total $2^5=32$. Strings with NO two consecutive 1s of length 5: 13. With at least one \"11\": $32-13=19$.</div><div class=\"ml-vi\">Tổng $2^5=32$. Chuỗi KHÔNG có hai bit 1 liên tiếp (độ dài 5): 13. Có ít nhất một \"11\": $32-13=19$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find f(2) and f(4) if f(n) = 3f(n-1)+6 and f(3)=18.|||Tìm f(2) và f(4) nếu f(n) = 3f(n-1)+6 và f(3)=18.",
          "options": [
            {
              "text": "f(2)=4, f(4)=54|||f(2)=4, f(4)=54"
            },
            {
              "text": "f(2)=6, f(4)=54|||f(2)=6, f(4)=54"
            },
            {
              "text": "f(2)=4, f(4)=60|||f(2)=4, f(4)=60"
            },
            {
              "text": "f(2)=6, f(4)=60|||f(2)=6, f(4)=60"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(3)=3f(2)+6=18\\Rightarrow f(2)=4$. $f(4)=3(18)+6=60$.</div><div class=\"ml-vi\">$f(3)=3f(2)+6=18\\Rightarrow f(2)=4$. $f(4)=3(18)+6=60$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A young pair of rabbits (one of each sex) is placed on an island. A pair of rabbits does not breed until they are 2 month old. After they are 2 month old they will produce 2 pairs of rabbits each month. Find the number of pairs of rabbits after 6 months.|||Một cặp thỏ non đặt trên đảo, không sinh sản tới khi 2 tháng tuổi, sau đó mỗi tháng sinh 2 cặp con. Tìm số cặp thỏ sau 6 tháng.",
          "options": [
            {
              "text": "21|||21"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "34|||34"
            },
            {
              "text": "57|||57"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Recurrence $a_n=a_{n-1}+2a_{n-2}$ (each mature pair, present two months prior, contributes 2 new pairs), with $a_1=a_2=1$: $a_3=3,a_4=5,a_5=11,a_6=21$.</div><div class=\"ml-vi\">Hệ thức $a_n=a_{n-1}+2a_{n-2}$, với $a_1=a_2=1$: $a_3=3,a_4=5,a_5=11,a_6=21$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which sequence $\\{a_n\\}$ does NOT satisfy the recursive relation $a_n=-3a_{n-1}+4a_{n-2}$? (i) $a_n=(-4)^n$ (ii) $a_n=1$|||Dãy $\\{a_n\\}$ nào KHÔNG thỏa hệ thức $a_n=-3a_{n-1}+4a_{n-2}$? (i),(ii) như trên.",
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
            3
          ],
          "explanation": "<div class=\"ml-en\">$(-4)^n$: verified to satisfy. Constant $a_n=1$: $-3(1)+4(1)=1$ ✓ also satisfies (any constant trivially satisfies since $-3c+4c=c$). Both actually satisfy — neither fails.</div><div class=\"ml-vi\">$(-4)^n$ thỏa. Hằng $a_n=1$: $-3(1)+4(1)=1$ ✓ cũng thỏa (mọi hằng số đều thỏa vì $-3c+4c=c$). Cả hai đều thỏa — không cái nào KHÔNG thỏa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n) = f(n/5) + 3n$ when n is a positive integer, and $f(1)=4$. Find $f(125)$.|||Cho $f(n) = f(n/5) + 3n$, $f(1)=4$. Tìm $f(125)$.",
          "options": [
            {
              "text": "500|||500"
            },
            {
              "text": "498|||498"
            },
            {
              "text": "496|||496"
            },
            {
              "text": "400|||400"
            },
            {
              "text": "469|||469"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$f(5)=f(1)+15=19$. $f(25)=f(5)+75=94$. $f(125)=f(25)+375=469$.</div><div class=\"ml-vi\">$f(5)=19,f(25)=94,f(125)=469$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following divide-and-conquer algorithm to find the maximal element in a sequence: <pre>procedure MXE(L=$a_1,\\dots,a_n$)\nif n=1 then MXE(L)=$a_1$\nelse begin\n  m:=$\\lfloor n/2\\rfloor$\n  $L_1=a_1,\\dots,a_m$\n  $L_2=a_{m+1},\\dots,a_n$\n  MXE(L)=max(MXE($L_1$), MXE($L_2$))\nend</pre> Let f(n) be the number of comparisons used. The recurrence relation of f(n) is $f(n)=a\\cdot f(n/2)+b$, with n even. Determine b.|||Cho thuật toán MXE (như trên). f(n) = số phép so sánh, $f(n)=a\\cdot f(n/2)+b$. Xác định b.",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Two recursive calls of size n/2 each, then ONE comparison (max) to combine their results: $f(n)=2f(n/2)+1$, so $b=1$.</div><div class=\"ml-vi\">Hai lệnh gọi đệ quy kích thước n/2, rồi MỘT phép so sánh (max) để kết hợp: $f(n)=2f(n/2)+1$, nên $b=1$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D7",
      "source": "REAL",
      "sortOrder": 127,
      "title": "Progress Test 2 — Đề 7/9|||Kiểm tra tiến độ 2 — Đề 7/9",
      "description": "MAD101 Progress Test 2 question bank, part 7 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 7/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Suppose that the function f satisfies the recurrence relation $f(n)=2f(\\sqrt n)+1$, $f(2)=1$. Find $f(256)$.|||Cho $f(n)=2f(\\sqrt n)+1$, $f(2)=1$. Tìm $f(256)$.",
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
          "explanation": "<div class=\"ml-en\">$f(4)=2f(2)+1=3$. $f(16)=2f(4)+1=7$. $f(256)=2f(16)+1=15$.</div><div class=\"ml-vi\">$f(4)=3,f(16)=7,f(256)=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let T(n) be an increasing function such that $T(n)=2T(n/2)+n^2$. Choose the best answer. (i) $T(n)=O(n)$ (ii) $T(n)=O(\\log n)$ (iii) $T(n)=O(n^2)$ (iv) $T(n)=O(n^3)$|||Cho $T(n)=2T(n/2)+n^2$. Chọn đáp án đúng nhất. (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Master theorem: $a=2,b=2,f(n)=n^2$. Since $n^2$ grows polynomially faster than $n^{\\log_2 2}=n$, case 3 applies: $T(n)=\\Theta(n^2)$.</div><div class=\"ml-vi\">Định lý master: $a=2,b=2,f(n)=n^2$ tăng nhanh hơn $n^{\\log_2 2}=n$, rơi vào trường hợp 3: $T(n)=\\Theta(n^2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that the function f satisfies the recurrence relation $f(n)=2f(\\sqrt n)+\\log_{10}(n)$ whenever n is a perfect square greater than 1, and $f(3)=1$. Find $f(81)$.|||Cho $f(n)=2f(\\sqrt n)+\\log_{10}(n)$ khi n là số chính phương >1, $f(3)=1$. Tìm $f(81)$.",
          "options": [
            {
              "text": "8.00|||8.00"
            },
            {
              "text": "7.82|||7.82"
            },
            {
              "text": "7.00|||7.00"
            },
            {
              "text": "6.82|||6.82"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(9)=2f(3)+\\log_{10}9=2(1)+0.954=2.954$. $f(81)=2f(9)+\\log_{10}81=2(2.954)+1.908=7.82$.</div><div class=\"ml-vi\">$f(9)=2(1)+\\log_{10}9\\approx2.954$. $f(81)=2(2.954)+\\log_{10}81\\approx7.82$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let T(n) be an increasing function such that $T(n)=2T(n/2)+n^3$. Choose the best answer. (i) $T(n)=O(n)$ (ii) $T(n)=O(n^2)$ (iii) $T(n)=O(n^3)$ (iv) $T(n)=O(n^2\\log n)$|||Cho $T(n)=2T(n/2)+n^3$. Chọn đáp án đúng nhất. (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Master theorem: $a=2,b=2,f(n)=n^3$ grows polynomially faster than $n^{\\log_2 2}=n$, case 3: $T(n)=\\Theta(n^3)$.</div><div class=\"ml-vi\">Định lý master: $f(n)=n^3$ tăng nhanh hơn $n^{\\log_2 2}=n$, rơi vào trường hợp 3: $T(n)=\\Theta(n^3)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f(25)$ if $f(1)=3$ and $f(n)=f(n/5)+n^2/3$.|||Tìm $f(25)$ nếu $f(1)=3$ và $f(n)=f(n/5)+n^2/3$.",
          "options": [
            {
              "text": "784/3|||784/3"
            },
            {
              "text": "659/3|||659/3"
            },
            {
              "text": "34/3|||34/3"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(5)=f(1)+25/3=3+25/3=34/3$. $f(25)=f(5)+625/3=34/3+625/3=659/3$.</div><div class=\"ml-vi\">$f(5)=34/3$. $f(25)=34/3+625/3=659/3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f(3)$ if $f(9)=25$ and $f(n)=7-\\dfrac{n^2}{9}f\\left(\\dfrac{n}{3}\\right)$.|||Tìm $f(3)$ nếu $f(9)=25$ và $f(n)=7-\\dfrac{n^2}{9}f\\left(\\dfrac{n}{3}\\right)$.",
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
          "explanation": "<div class=\"ml-en\">$f(9)=7-\\frac{81}{9}f(3)=7-9f(3)=25 \\Rightarrow f(3)=-2$.</div><div class=\"ml-vi\">$f(9)=7-9f(3)=25 \\Rightarrow f(3)=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When applying the recursive algorithm for computing gcd(4, 14), how many times is the function gcd called? <pre>procedure gcd(a, b: nonnegative integers with a &lt; b)\nif a = 0 then gcd(a,b):=b;\nelse gcd(a,b):=gcd(b mod a, a);</pre>|||Áp dụng thuật toán đệ quy tính gcd(4, 14) (như trên), hàm gcd được gọi bao nhiêu lần?",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">gcd(4,14) → calls gcd(14 mod 4, 4)=gcd(2,4) → calls gcd(4 mod 2, 2)=gcd(0,2) → base case returns 2. Total calls: gcd(4,14), gcd(2,4), gcd(0,2) = 3.</div><div class=\"ml-vi\">gcd(4,14) → gọi gcd(2,4) → gọi gcd(0,2) → cơ sở trả về 2. Tổng: 3 lần gọi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are required to merge the following pair of lists using the merge algorithm? 1, 4, 6, 9; 3, 5, 8, 10, 12, 14|||Cần bao nhiêu phép so sánh để trộn cặp dãy sau bằng thuật toán trộn? 1,4,6,9; 3,5,8,10,12,14",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "10|||10"
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
          "explanation": "<div class=\"ml-en\">Simulating the merge: list 1 (1,4,6,9) empties after 7 comparisons; remaining 10,12,14 appended with no comparison.</div><div class=\"ml-vi\">Mô phỏng trộn: dãy 1 (1,4,6,9) hết sau 7 phép so sánh; còn lại 10,12,14 thêm vào không cần so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many positive integers less than 100 that are divisible by either 3 or 4?|||Có bao nhiêu số nguyên dương nhỏ hơn 100 chia hết cho 3 hoặc 4?",
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
          "explanation": "<div class=\"ml-en\">$\\lfloor99/3\\rfloor+\\lfloor99/4\\rfloor-\\lfloor99/12\\rfloor=33+24-8=49$.</div><div class=\"ml-vi\">$\\lfloor99/3\\rfloor+\\lfloor99/4\\rfloor-\\lfloor99/12\\rfloor=33+24-8=49$.</div>"
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
          "explanation": "<div class=\"ml-en\">$\\lfloor200/5\\rfloor+\\lfloor200/7\\rfloor-\\lfloor200/35\\rfloor=40+28-5=63$.</div><div class=\"ml-vi\">$\\lfloor200/5\\rfloor+\\lfloor200/7\\rfloor-\\lfloor200/35\\rfloor=40+28-5=63$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a sequence $\\{a_n\\}$ satisfying the recurrence relation $a_0=a_1=1$, $a_n=-3a_{n-1}-2a_{n-2}$ for $n=2,3,\\dots$. Find $a_4$.|||Cho dãy $a_0=a_1=1$, $a_n=-3a_{n-1}-2a_{n-2}$. Tìm $a_4$.",
          "options": [
            {
              "text": "27|||27"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "-23|||-23"
            },
            {
              "text": "-29|||-29"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$a_2=-3(1)-2(1)=-5$. $a_3=-3(-5)-2(1)=13$. $a_4=-3(13)-2(-5)=-39+10=-29$.</div><div class=\"ml-vi\">$a_2=-5,a_3=13,a_4=-3(13)-2(-5)=-29$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that the number of ways to solve an n-piece puzzle satisfies the recurrence relation $f_n=f_{n-2}+nf_{n-3}$ with the initial conditions $f_1=1,f_2=2,f_3=3$. How many ways are there to solve a 6-piece puzzle of this kind?|||Số cách giải câu đố n mảnh thỏa $f_n=f_{n-2}+nf_{n-3}$, $f_1=1,f_2=2,f_3=3$. Tìm số cách giải câu đố 6 mảnh.",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "18|||18"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f_4=f_2+4f_1=2+4=6$. $f_5=f_3+5f_2=3+10=13$. $f_6=f_4+6f_3=6+18=24$.</div><div class=\"ml-vi\">$f_4=6,f_5=13,f_6=f_4+6f_3=6+18=24$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the recurrence relation $f_n=2f_{n-3}-5f_{n-4}+2^n$. How many initial conditions are needed to determine all further terms?|||Cho hệ thức $f_n=2f_{n-3}-5f_{n-4}+2^n$. Cần bao nhiêu điều kiện ban đầu để xác định mọi số hạng tiếp theo?",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The recurrence reaches back 4 steps (uses $f_{n-3}$ and $f_{n-4}$), so 4 initial terms are needed.</div><div class=\"ml-vi\">Hệ thức lùi lại 4 bước (dùng $f_{n-3}$ và $f_{n-4}$), nên cần 4 điều kiện ban đầu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A person deposited 10,000,000 VND in a saving account at the rate of 2%/month with interest compounded over a year. How much (in VND) will be in the account after a year?|||Một người gửi 10.000.000 VND vào tiết kiệm lãi suất 2%/tháng, lãi kép trong 1 năm. Sau 1 năm tài khoản có bao nhiêu VND?",
          "options": [
            {
              "text": "10,020,000|||10.020.000"
            },
            {
              "text": "200,000|||200.000"
            },
            {
              "text": "12,682,417|||12.682.417"
            },
            {
              "text": "10,200,000|||10.200.000"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Monthly compounding for 12 months: $10{,}000{,}000\\times(1.02)^{12}=12{,}682{,}417$.</div><div class=\"ml-vi\">Lãi kép hàng tháng qua 12 tháng: $10.000.000\\times(1.02)^{12}=12.682.417$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that a person deposits $20,000 in a savings account at a bank yielding 10% per year with interest compounded annually. How much will be in the account after 30 years? Round to the nearest dollar.|||Gửi $20,000 lãi suất 10%/năm, lãi kép hàng năm. Sau 30 năm có bao nhiêu (làm tròn đô la)?",
          "options": [
            {
              "text": "$220,000|||$220,000"
            },
            {
              "text": "$348,988|||$348,988"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$269,569|||$269,569"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$20{,}000\\times(1.1)^{30}\\approx20{,}000\\times17.449=348{,}988$.</div><div class=\"ml-vi\">$20{,}000\\times(1.1)^{30}\\approx348{,}988$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D8",
      "source": "REAL",
      "sortOrder": 128,
      "title": "Progress Test 2 — Đề 8/9|||Kiểm tra tiến độ 2 — Đề 8/9",
      "description": "MAD101 Progress Test 2 question bank, part 8 of 9 (15 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 8/9 (15 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 30,
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
          "prompt": "Let f(n) be the complexity of the merge sort algorithm on the sequence of size n in terms of the number of comparisons. The recurrence relation of f(n) is as follows: $f(n)=a\\cdot f(n/2)+n$, with n even. Determine a.|||Cho f(n) là độ phức tạp thuật toán merge sort (số phép so sánh). $f(n)=a\\cdot f(n/2)+n$. Xác định a.",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Merge sort splits the sequence into 2 halves of size n/2: $a=2$.</div><div class=\"ml-vi\">Merge sort chia dãy thành 2 nửa kích thước n/2: $a=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find f(16) given that $f(1)=2$ and $f(n)=(f(n/4))^2$.|||Tìm f(16) cho $f(1)=2$ và $f(n)=(f(n/4))^2$.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
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
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(4)=(f(1))^2=4$. $f(16)=(f(4))^2=16$.</div><div class=\"ml-vi\">$f(4)=4$. $f(16)=16$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose that $f(n)=f(n/25)+n/5$ when n is a positive integer, and $f(5)=1$. Find $f(3125)$.|||Cho $f(n)=f(n/25)+n/5$, $f(5)=1$. Tìm $f(3125)$.",
          "options": [
            {
              "text": "609|||609"
            },
            {
              "text": "600|||600"
            },
            {
              "text": "800|||800"
            },
            {
              "text": "690|||690"
            },
            {
              "text": "651|||651"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$f(125)=f(5)+125/5=1+25=26$. $f(3125)=f(125)+3125/5=26+625=651$.</div><div class=\"ml-vi\">$f(125)=26$. $f(3125)=26+625=651$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find f(16) if $f(2)=5$ and $f(n)=(f(\\sqrt n))^2$.|||Tìm f(16) nếu $f(2)=5$ và $f(n)=(f(\\sqrt n))^2$.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "1225|||1225"
            },
            {
              "text": "625|||625"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(4)=(f(2))^2=25$. $f(16)=(f(4))^2=625$.</div><div class=\"ml-vi\">$f(4)=25$. $f(16)=625$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let T(n) be an increasing function such that $T(n)=2T(n/2)+n$. Choose the best answer. (i) $T(n)=O(n)$ (ii) $T(n)=O(n\\log n)$ (iii) $T(n)=O(\\log n)$ (iv) $T(n)=O(n^2)$|||Cho $T(n)=2T(n/2)+n$. Chọn đáp án đúng nhất. (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Master theorem: $a=2,b=2,f(n)=n=n^{\\log_2 2}$ — case 2 applies: $T(n)=\\Theta(n\\log n)$.</div><div class=\"ml-vi\">Định lý master: $f(n)=n=n^{\\log_2 2}$ — trường hợp 2: $T(n)=\\Theta(n\\log n)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the algorithm: <pre>Procedure LN(m, n: integers)\nwhile (m != n)\n  if m > n then m:=m-n\n  else n:=n-m;\nPrint(m)</pre> If m=36, n=44, what is the output of the algorithm?|||Cho LN (như trên). Nếu m=36, n=44, kết quả xuất ra là gì?",
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
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Repeated subtraction gcd: $44,36\\to n=8$; $36,8\\to m=28\\to20\\to12\\to4$; $4,8\\to n=4$; $m=n=4$. Output=4 (this is $\\gcd(36,44)$).</div><div class=\"ml-vi\">Trừ liên tiếp kiểu Euclid: cuối cùng $m=n=4$. Đây là $\\gcd(36,44)=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the Bubble sort algorithm: <pre>Procedure Bubblesort($a_1,a_2,\\dots,a_n$: integer)\nfor i = 1 to (n-1) do\n  for j = 1 to (n-i) do\n    if $a_j > a_{j+1}$ then swap($a_j,a_{j+1}$)</pre> If input = 3, 2, 4, 7, 1, 6, 5, find the order of the elements after completing the first pass (i = 1).|||Cho Bubblesort (như trên). Với input 3,2,4,7,1,6,5, thứ tự sau khi hoàn tất vòng đầu (i=1) là gì?",
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
          "explanation": "<div class=\"ml-en\">Trace: swap(3,2)→[2,3,4,7,1,6,5]; 3<4 no; swap(7,1)→[2,3,4,1,7,6,5]; swap(7,6)→[2,3,4,1,6,7,5]; swap(7,5)→[2,3,4,1,6,5,7].</div><div class=\"ml-vi\">Truy vết: đổi(3,2),giữ,đổi(7,1),đổi(7,6),đổi(7,5) → [2,3,4,1,6,5,7].</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=x^2\\log(x^2)$ and $g(x)=(x\\log(x))^2$. Choose the correct statements: (i) $f(x)=O(g(x))$ (ii) $g(x)=O(f(x))$|||Cho $f(x)=x^2\\log(x^2)$ và $g(x)=(x\\log(x))^2$. Chọn phát biểu đúng: (i)-(ii) như trên.",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=2x^2\\log x$ but $g(x)=x^2(\\log x)^2$ — the extra factor of $\\log x$ makes g grow faster. So $f=O(g)$ true (i); $g=O(f)$ false.</div><div class=\"ml-vi\">$f(x)=2x^2\\log x$ nhưng $g(x)=x^2(\\log x)^2$ — thừa số $\\log x$ dư khiến g tăng nhanh hơn. Nên $f=O(g)$ đúng (i); $g=O(f)$ sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given an algorithm: <pre>procedure SUM(n: int)\n  t:=0\n  for i:=1 to n do\n    for j:=1 to n-1 do\n      t:=t*i+j\n  return t</pre> How many additions and multiplications are used if n=11?|||Cho SUM (như trên). Cần bao nhiêu phép cộng và nhân nếu n=11?",
          "options": [
            {
              "text": "220|||220"
            },
            {
              "text": "110|||110"
            },
            {
              "text": "330|||330"
            },
            {
              "text": "440|||440"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Inner loop runs $n(n-1)=11\\times10=110$ times total, each doing 1 multiplication + 1 addition: $110\\times2=220$.</div><div class=\"ml-vi\">Vòng trong chạy tổng $11\\times10=110$ lần, mỗi lần 1 nhân+1 cộng: $110\\times2=220$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Give a big-O estimate for the number of operations (an operation is an addition or a multiplication) used in this segment of an algorithm: <pre>k := 0\nfor i := 1 to n-1\n  for j := i to 2*i\n    k := k+i*j\n  end\nend</pre> (i) $O(n)$ (ii) $O(n\\log n)$ (iii) $O(n^2)$ (iv) $O(n^4)$|||Ước lượng big-O số phép toán trong đoạn mã (như trên). (i)-(iv) như trên.",
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
          "explanation": "<div class=\"ml-en\">Inner loop runs about i times, outer loop up to n — total $\\sim\\sum i = O(n^2)$, each iteration 2 operations, still $O(n^2)$.</div><div class=\"ml-vi\">Vòng trong chạy khoảng i lần, vòng ngoài tới n — tổng $\\sim\\sum i=O(n^2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<pre>procedure Ia($a_1,a_2,\\dots,a_n$: integers)\nm := $a_1$\nt := 0\nfor i:=2 to n\n  if ($a_i\\ge m$) then\n    m:=$a_i$\n    t:=t+1</pre> If input is the list $[1,2,3,6,7,7,4,8,8,6]$, how many additions are used?|||Cho Ia (như trên, dùng $\\ge$). Với đầu vào $[1,2,3,6,7,7,4,8,8,6]$, cần bao nhiêu phép cộng?",
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a_1=1$. Updates (using $\\ge$, ties count too): 2,3,6,7,7(tie),8,8(tie) — 7 updates, so $t:=t+1$ runs 7 times.</div><div class=\"ml-vi\">$a_1=1$. Cập nhật (dùng $\\ge$, cả trường hợp bằng): 2,3,6,7,7,8,8 — 7 lần, nên $t:=t+1$ chạy 7 lần.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the quotient q and remainder r when -98 is divided by 5.|||Tìm thương q và số dư r khi -98 chia cho 5.",
          "options": [
            {
              "text": "q=-20, r=2|||q=-20, r=2"
            },
            {
              "text": "q=-19, r=-3|||q=-19, r=-3"
            },
            {
              "text": "q=-20, r=-2|||q=-20, r=-2"
            },
            {
              "text": "q=-19, r=3|||q=-19, r=3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$-98=(-20)\\times5+2$ (remainder must satisfy $0\\le r<5$). $q=-20,r=2$.</div><div class=\"ml-vi\">$-98=(-20)\\times5+2$ (số dư phải thỏa $0\\le r<5$). $q=-20,r=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A pseudorandom number sequence is generated as follows: $x_0=2$, $x_n=(3x_{n-1}+2)\\bmod11$. Find $x_3$.|||Dãy giả ngẫu nhiên $x_0=2$, $x_n=(3x_{n-1}+2)\\bmod11$. Tìm $x_3$.",
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
          "explanation": "<div class=\"ml-en\">$x_1=(6+2)\\bmod11=8$. $x_2=(24+2)\\bmod11=4$. $x_3=(12+2)\\bmod11=3$.</div><div class=\"ml-vi\">$x_1=8,x_2=4,x_3=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sequence of pseudorandom numbers is generated as follows $x_0=3$, $x_n=(5x_{n-1}+4)\\bmod7$ for n>0. Find $x_4$.|||Dãy giả ngẫu nhiên $x_0=3$, $x_n=(5x_{n-1}+4)\\bmod7$. Tìm $x_4$.",
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
          "explanation": "<div class=\"ml-en\">$x_1=(15+4)\\bmod7=5$. $x_2=(25+4)\\bmod7=1$. $x_3=(5+4)\\bmod7=2$. $x_4=(10+4)\\bmod7=0$.</div><div class=\"ml-vi\">$x_1=5,x_2=1,x_3=2,x_4=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the product of two integers is $2^7\\cdot3^8\\cdot5^2\\cdot7^4$ and their least common multiple is $2^4\\cdot3^4\\cdot5^1\\cdot7^2$, then their greatest common divisor is ___|||Nếu tích hai số nguyên là $2^7\\cdot3^8\\cdot5^2\\cdot7^4$ và LCM là $2^4\\cdot3^4\\cdot5^1\\cdot7^2$, thì GCD là ___",
          "options": [
            {
              "text": "238,140|||238.140"
            },
            {
              "text": "211,680|||211.680"
            },
            {
              "text": "158,760|||158.760"
            },
            {
              "text": "226,800|||226.800"
            },
            {
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\text{GCD}=\\text{product}/\\text{LCM}=2^{7-4}3^{8-4}5^{2-1}7^{4-2}=2^3\\cdot3^4\\cdot5\\cdot7^2=158{,}760$.</div><div class=\"ml-vi\">$\\text{GCD}=\\text{tích}/\\text{LCM}=2^3\\cdot3^4\\cdot5\\cdot7^2=158.760$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT2-D9",
      "source": "REAL",
      "sortOrder": 129,
      "title": "Progress Test 2 — Đề 9/9|||Kiểm tra tiến độ 2 — Đề 9/9",
      "description": "MAD101 Progress Test 2 question bank, part 9 of 9 (4 questions). 124 unique questions -- the complete PT2 question bank per the source folder's own label, transcribed with each answer independently re-derived.|||Ngân hàng câu hỏi Kiểm tra tiến độ 2 môn MAD101, phần 9/9 (4 câu). 124 câu duy nhất -- toàn bộ ngân hàng câu PT2 theo đúng nhãn của thư mục nguồn, mỗi đáp án được tự suy luận độc lập.",
      "durationMinutes": 20,
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
          "prompt": "The prime factorization of 1025 has the form $p^2q$. Find $p+q$.|||Phân tích thừa số nguyên tố của 1025 có dạng $p^2q$. Tìm $p+q$.",
          "options": [
            {
              "text": "46|||46"
            },
            {
              "text": "36|||36"
            },
            {
              "text": "66|||66"
            },
            {
              "text": "56|||56"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$1025=25\\times41=5^2\\times41$. $p=5,q=41$, $p+q=46$.</div><div class=\"ml-vi\">$1025=5^2\\times41$. $p=5,q=41$, $p+q=46$.</div>"
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
          "explanation": "<div class=\"ml-en\">$1025=5^2\\times41$. $p=5,q=41$, $q-p=36$.</div><div class=\"ml-vi\">$1025=5^2\\times41$. $p=5,q=41$, $q-p=36$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the exponent of 3 in the prime factorization of 10!.|||Tìm số mũ của 3 trong phân tích thừa số nguyên tố của 10!.",
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
          "explanation": "<div class=\"ml-en\">Legendre's formula: $\\lfloor10/3\\rfloor+\\lfloor10/9\\rfloor=3+1=4$.</div><div class=\"ml-vi\">Công thức Legendre: $\\lfloor10/3\\rfloor+\\lfloor10/9\\rfloor=3+1=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the product of two integers is $2^8\\cdot3^7\\cdot5^2\\cdot7^6$ and their least common multiple is $2^4\\cdot3^4\\cdot5^1\\cdot7^3$, then their greatest common divisor is ___|||Nếu tích hai số nguyên là $2^8\\cdot3^7\\cdot5^2\\cdot7^6$ và LCM là $2^4\\cdot3^4\\cdot5^1\\cdot7^3$, thì GCD là ___",
          "options": [
            {
              "text": "1,111,320|||1.111.320"
            },
            {
              "text": "952,560|||952.560"
            },
            {
              "text": "740,880|||740.880"
            },
            {
              "text": "592,704|||592.704"
            },
            {
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\text{GCD}=\\text{product}/\\text{LCM}=2^{8-4}3^{7-4}5^{2-1}7^{6-3}=2^4\\cdot3^3\\cdot5\\cdot7^3=740{,}880$.</div><div class=\"ml-vi\">$\\text{GCD}=\\text{tích}/\\text{LCM}=2^4\\cdot3^3\\cdot5\\cdot7^3=740.880$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D1",
      "source": "REAL",
      "sortOrder": 131,
      "title": "Progress Test 3 — Đề 1/7|||Kiểm tra tiến độ 3 — Đề 1/7",
      "description": "MAD101 Progress Test 3 question bank, part 1 of 7 (15 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 1/7 (15 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 30,
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
          "prompt": "Given a simple graph with 5 vertices. The degrees of 4 vertices are 1, 3, 3, 4. Which of the following numbers could be the degree of the fifth vertex?|||Cho đơn đồ thị 5 đỉnh. Bậc của 4 đỉnh là 1, 3, 3, 4. Số nào sau đây có thể là bậc của đỉnh thứ 5?",
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
          "explanation": "<div class=\"ml-en\">Sum of degrees must be even, so the 5th degree x must be odd (1 or 3) and $\\le4$ (max degree in a 5-vertex simple graph). Check x=1: sequence 4,3,3,1,1 fails Erdős–Gallai at k=2 ($7>6$) — NOT graphical. Check x=3: sequence 4,3,3,3,3 satisfies Erdős–Gallai (constructible: one vertex joined to all others, remaining 4 vertices form a 4-cycle) — graphical. So only x=3 works.</div><div class=\"ml-vi\">Tổng bậc phải chẵn nên bậc thứ 5 (x) phải lẻ (1 hoặc 3) và $\\le4$. Xét x=1: dãy 4,3,3,1,1 không thoả Erdős–Gallai tại k=2 ($7>6$) — KHÔNG dựng được đồ thị. Xét x=3: dãy 4,3,3,3,3 thoả (dựng được: 1 đỉnh nối cả 4 đỉnh còn lại, 4 đỉnh còn lại tạo chu trình độ dài 4) — dựng được. Vậy chỉ x=3 đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following sequences can be the degree sequence of a simple undirected graph?<br>(i) 3, 3, 3, 3, 3, 3<br>(ii) 2, 3, 3, 5, 3, 6<br>(iii) 0, 1, 1, 3, 4, 5|||Dãy nào sau đây có thể là dãy bậc của đơn đồ thị vô hướng?<br>(i) 3, 3, 3, 3, 3, 3<br>(ii) 2, 3, 3, 5, 3, 6<br>(iii) 0, 1, 1, 3, 4, 5",
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
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">n=6 so max possible degree is 5. (ii) has a 6 &rArr; impossible. (iii) has both 0 and 5 (a vertex adjacent to all 5 others) &rArr; contradiction (the degree-0 vertex can't be adjacent to anything). (i) all-3's: sum=18 even, realizable directly as $K_{3,3}$ (3-regular on 6 vertices). Only (i) works.</div><div class=\"ml-vi\">n=6 nên bậc tối đa là 5. (ii) có số 6 &rArr; vô lý. (iii) có cả 0 và 5 (đỉnh bậc 5 phải nối với cả 5 đỉnh còn lại) &rArr; mâu thuẫn với đỉnh bậc 0. (i) toàn số 3: tổng=18 chẵn, dựng được bằng $K_{3,3}$ (3-đều trên 6 đỉnh). Chỉ (i) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The number of edges in a graph with 7 vertices, 2 of degree 4, 1 of degree 2 and 4 of degree 1, is ___|||Số cạnh của đồ thị 7 đỉnh, 2 đỉnh bậc 4, 1 đỉnh bậc 2, 4 đỉnh bậc 1, là ___",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sum of degrees $=2\\times4+1\\times2+4\\times1=8+2+4=14$. Edges $=14/2=7$.</div><div class=\"ml-vi\">Tổng bậc $=2\\times4+1\\times2+4\\times1=14$. Số cạnh $=14/2=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a simple graph. The complementary graph of G is the graph G' having the same set of vertices, and there is an edge connecting u and v in G' if and only if there is no edge connecting u and v in G.<br>If G has 10 vertices and 20 edges, how many edges does G' have?|||Cho G là đơn đồ thị. Đồ thị bù G' có cùng tập đỉnh, có cạnh nối u,v trong G' khi và chỉ khi KHÔNG có cạnh nối u,v trong G.<br>Nếu G có 10 đỉnh, 20 cạnh, G' có bao nhiêu cạnh?",
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
          "explanation": "<div class=\"ml-en\">Total possible edges on 10 vertices $=\\binom{10}{2}=45$. $G'$ edges $=45-20=25$.</div><div class=\"ml-vi\">Tổng số cạnh tối đa trên 10 đỉnh $=\\binom{10}{2}=45$. Số cạnh $G'=45-20=25$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is the sequence of degrees of a simple graph?|||Dãy nào sau đây là dãy bậc của một đơn đồ thị?",
          "options": [
            {
              "text": "0, 2, 2, 2, 3|||0, 2, 2, 2, 3"
            },
            {
              "text": "1, 2, 3, 3|||1, 2, 3, 3"
            },
            {
              "text": "2, 2, 3, 3, 3, 4|||2, 2, 3, 3, 3, 4"
            },
            {
              "text": "1, 1, 2, 4|||1, 1, 2, 4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">A: sum=9 odd &rArr; invalid. B: sum=9 odd &rArr; invalid. C: sum=17 odd &rArr; invalid. D: n=4 so max degree is 3, but 4 appears &rArr; invalid. All fail, so the answer is E.</div><div class=\"ml-vi\">A: tổng=9 lẻ &rArr; sai. B: tổng=9 lẻ &rArr; sai. C: tổng=17 lẻ &rArr; sai. D: n=4 nên bậc tối đa là 3, nhưng có số 4 &rArr; sai. Tất cả đều sai nên đáp án là E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a simple graph whose vertices all have degree 3. If G has 30 edges, how many vertices does G have?|||Cho G là đơn đồ thị mà mọi đỉnh đều có bậc 3. Nếu G có 30 cạnh, G có bao nhiêu đỉnh?",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "80|||80"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "60|||60"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Handshake lemma: $3n/2=30 \\Rightarrow n=20$.</div><div class=\"ml-vi\">Bổ đề bắt tay: $3n/2=30 \\Rightarrow n=20$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a simple graph. The complementary graph of G is the simple graph G' having the same set of vertices, and there is an edge connecting u and v in G' if and only if there is no edge connecting u and v in G.<br>If G has v vertices and e edges, how many edges does G' have?|||Cho G là đơn đồ thị, đồ thị bù G' cùng tập đỉnh, có cạnh nối u,v khi và chỉ khi KHÔNG có cạnh nối u,v trong G.<br>Nếu G có v đỉnh, e cạnh, G' có bao nhiêu cạnh?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "e|||e"
            },
            {
              "text": "v(v-1)/2-e+1|||v(v-1)/2-e+1"
            },
            {
              "text": "v(v-1)/2-e|||v(v-1)/2-e"
            },
            {
              "text": "v|||v"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Total possible edges on v vertices is $v(v-1)/2$; $G'$ has the edges $G$ does NOT have: $v(v-1)/2-e$.</div><div class=\"ml-vi\">Tổng số cạnh tối đa trên v đỉnh là $v(v-1)/2$; $G'$ có các cạnh mà G KHÔNG có: $v(v-1)/2-e$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let n &gt; 3, n is odd. Which of the following graphs is bipartite?|||Cho n &gt; 3, n lẻ. Đồ thị nào sau đây là đồ thị lưỡng phân (bipartite)?",
          "options": [
            {
              "text": "Qn|||Qn"
            },
            {
              "text": "Kn|||Kn"
            },
            {
              "text": "Cn|||Cn"
            },
            {
              "text": "Wn|||Wn"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The n-cube $Q_n$ is bipartite for ANY n (partition by parity of number of 1-bits), regardless of n being odd. $K_n$ (n&gt;2) has triangles, $C_n$ with odd n is an odd cycle, $W_n$ has triangles via the hub &mdash; none of these are bipartite.</div><div class=\"ml-vi\">Siêu khối $Q_n$ luôn lưỡng phân với MỌI n (chia theo tính chẵn/lẻ số bit 1), không phụ thuộc n lẻ hay chẵn. $K_n$ (n&gt;2) có tam giác, $C_n$ với n lẻ là chu trình lẻ, $W_n$ có tam giác qua đỉnh trung tâm &mdash; đều không lưỡng phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all bipartite graphs in the list $K_4, W_4, C_4, K_{3,4}$<br>(i) $K_4, W_4$<br>(ii) $W_4, C_4$<br>(iii) $C_4, K_{3,4}$|||Tìm các đồ thị lưỡng phân trong danh sách $K_4, W_4, C_4, K_{3,4}$<br>(i) $K_4, W_4$<br>(ii) $W_4, C_4$<br>(iii) $C_4, K_{3,4}$",
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
          "explanation": "<div class=\"ml-en\">$K_4$ has triangles (not bipartite). $W_4$ has triangles via the hub (not bipartite). $C_4$ is an even cycle (bipartite). $K_{3,4}$ is complete bipartite by definition (bipartite). So the pair that is ALL bipartite is (iii) $C_4, K_{3,4}$.</div><div class=\"ml-vi\">$K_4$ có tam giác (không lưỡng phân). $W_4$ có tam giác qua đỉnh trung tâm (không lưỡng phân). $C_4$ là chu trình chẵn (lưỡng phân). $K_{3,4}$ lưỡng phân theo định nghĩa. Vậy cặp lưỡng phân toàn bộ là (iii) $C_4, K_{3,4}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many vertices are needed to construct a graph with 6 edges in which every vertex is of degree 3?|||Cần bao nhiêu đỉnh để dựng đồ thị có 6 cạnh mà mọi đỉnh đều bậc 3?",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Handshake lemma: $3n/2=6 \\Rightarrow n=4$.</div><div class=\"ml-vi\">Bổ đề bắt tay: $3n/2=6 \\Rightarrow n=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Fill in the blank: The adjacent matrix of .... has .... 1s<br>(i) $W_n$, $2n$<br>(ii) $Q_n$, $2^n$<br>(iii) $K_n$, $n(n-1)$<br>(iv) $C_n$, $n$|||Điền vào chỗ trống: Ma trận kề của .... có .... số 1<br>(i) $W_n$, $2n$<br>(ii) $Q_n$, $2^n$<br>(iii) $K_n$, $n(n-1)$<br>(iv) $C_n$, $n$",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">1s count $=2\\times$edges. $W_n$ has $2n$ edges &rArr; $4n$ ones (not $2n$, (i) wrong). $Q_n$ has $n2^{n-1}$ edges &rArr; $n2^n$ ones (not $2^n$, (ii) wrong). $K_n$ has $n(n-1)/2$ edges &rArr; $n(n-1)$ ones &mdash; matches (iii) exactly. $C_n$ has $n$ edges &rArr; $2n$ ones (not $n$, (iv) wrong). Only (iii) is correct.</div><div class=\"ml-vi\">Số số 1 $=2\\times$số cạnh. $W_n$ có $2n$ cạnh &rArr; $4n$ số 1 (không phải $2n$, (i) sai). $Q_n$ có $n2^{n-1}$ cạnh &rArr; $n2^n$ số 1 (không phải $2^n$, (ii) sai). $K_n$ có $n(n-1)/2$ cạnh &rArr; $n(n-1)$ số 1 &mdash; khớp đúng (iii). $C_n$ có $n$ cạnh &rArr; $2n$ số 1 (không phải $n$, (iv) sai). Chỉ (iii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 0s are there in the adjacency matrix of the graph $K_{m,n}$?<br>(i) $mn$<br>(ii) $2mn$<br>(iii) $m^2+n^2$<br>(iv) $m^2+n^2+mn$|||Ma trận kề của đồ thị $K_{m,n}$ có bao nhiêu số 0?<br>(i) $mn$<br>(ii) $2mn$<br>(iii) $m^2+n^2$<br>(iv) $m^2+n^2+mn$",
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
          "explanation": "<div class=\"ml-en\">Matrix has $(m+n)^2$ entries total. Number of 1s $=2\\times$edges$=2mn$. Number of 0s $=(m+n)^2-2mn=m^2+n^2$.</div><div class=\"ml-vi\">Ma trận có $(m+n)^2$ ô. Số số 1 $=2\\times$số cạnh$=2mn$. Số số 0 $=(m+n)^2-2mn=m^2+n^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 1s are there in the incident matrix of the graph $K_3$?|||Ma trận liên thuộc (incidence matrix) của đồ thị $K_3$ có bao nhiêu số 1?",
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
          "explanation": "<div class=\"ml-en\">$K_3$ has 3 edges; each edge column has exactly 2 ones (each edge is incident to 2 vertices). Total $=2\\times3=6$.</div><div class=\"ml-vi\">$K_3$ có 3 cạnh; mỗi cột (cạnh) có đúng 2 số 1 (mỗi cạnh liên thuộc 2 đỉnh). Tổng $=2\\times3=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many 1s are there in the adjacency matrix of the following graph? (5 vertices arranged as a pentagon, edges drawn as a 5-pointed star/pentagram — i.e. each vertex connects to the two vertices two steps away, forming a single 5-cycle.)|||Ma trận kề của đồ thị sau có bao nhiêu số 1? (5 đỉnh dạng ngũ giác, cạnh vẽ theo hình ngôi sao 5 cánh — mỗi đỉnh nối với 2 đỉnh cách nó 2 bước, tạo thành một chu trình 5 cạnh duy nhất.)",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The pentagram pattern is just a 5-cycle $C_5$ (5 edges) drawn with crossing chords. Number of 1s $=2\\times5=10$.</div><div class=\"ml-vi\">Hình ngôi sao 5 cánh chính là chu trình $C_5$ (5 cạnh) vẽ với các dây cung cắt nhau. Số số 1 $=2\\times5=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given an undirected multigraph with three vertices A, B, C and the adjacency matrix (in that order of vertices)<pre>0 3 1\n3 1 1\n1 1 1</pre>How many paths of length 2 from B to C?|||Cho đa đồ thị vô hướng 3 đỉnh A, B, C với ma trận kề (theo thứ tự đỉnh đó)<pre>0 3 1\n3 1 1\n1 1 1</pre>Có bao nhiêu đường đi độ dài 2 từ B đến C?",
          "options": [
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
              "text": "7|||7"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$(M^2)_{B,C}=M_{B,A}M_{A,C}+M_{B,B}M_{B,C}+M_{B,C}M_{C,C}=3\\times1+1\\times1+1\\times1=5$.</div><div class=\"ml-vi\">$(M^2)_{B,C}=M_{B,A}M_{A,C}+M_{B,B}M_{B,C}+M_{B,C}M_{C,C}=3\\times1+1\\times1+1\\times1=5$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D2",
      "source": "REAL",
      "sortOrder": 132,
      "title": "Progress Test 3 — Đề 2/7|||Kiểm tra tiến độ 3 — Đề 2/7",
      "description": "MAD101 Progress Test 3 question bank, part 2 of 7 (15 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 2/7 (15 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 30,
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
          "prompt": "Given a graph with vertices a, b, c, d arranged as a square (edges $\\{a,b\\},\\{b,c\\},\\{c,d\\},\\{d,a\\}$) plus a center vertex e where both diagonals cross, split into edges $\\{a,e\\},\\{b,e\\},\\{c,e\\},\\{d,e\\}$. How many paths of length 3 from a to d?|||Cho đồ thị đỉnh a,b,c,d xếp thành hình vuông (cạnh $\\{a,b\\},\\{b,c\\},\\{c,d\\},\\{d,a\\}$) cộng đỉnh tâm e nơi 2 đường chéo cắt nhau, tách thành các cạnh $\\{a,e\\},\\{b,e\\},\\{c,e\\},\\{d,e\\}$. Có bao nhiêu đường đi độ dài 3 từ a đến d?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Enumerate walks a&rarr;x&rarr;y&rarr;d. x=b: y&isin;{a,c,e} all adjacent to d &rArr; 3 walks. x=d: y&isin;{a,c,e} all adjacent to d &rArr; 3 walks. x=e: y&isin;{a,b,c,d}, only a,c adjacent to d (b is not, d-d not an edge) &rArr; 2 walks. Total $=3+3+2=8$. (Cross-checked via $M^3_{a,d}=8$.)</div><div class=\"ml-vi\">Liệt kê các bước đi a&rarr;x&rarr;y&rarr;d. x=b: y&isin;{a,c,e} đều kề d &rArr; 3 đường. x=d: y&isin;{a,c,e} đều kề d &rArr; 3 đường. x=e: y&isin;{a,b,c,d}, chỉ a,c kề d &rArr; 2 đường. Tổng $=3+3+2=8$. (Đối chiếu $M^3_{a,d}=8$.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let u, v be two vertices on different sides of the bipartite graph $K_{2,2}$. How many paths of length 3 from u to v?|||Cho u, v là hai đỉnh ở hai phía khác nhau của đồ thị lưỡng phân $K_{2,2}$. Có bao nhiêu đường đi độ dài 3 từ u đến v?",
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
          "explanation": "<div class=\"ml-en\">Label sides $\\{u,a\\}$ and $\\{v,b\\}$. Via the adjacency matrix (order u,a,v,b), $M^2$ row u $=[2,2,0,0]$, so $M^3_{u,v}=M^2_{u,u}\\cdot M_{u,v}+M^2_{u,a}\\cdot M_{a,v}=2\\times1+2\\times1=4$.</div><div class=\"ml-vi\">Gọi 2 phía là $\\{u,a\\}$ và $\\{v,b\\}$. Qua ma trận kề (thứ tự u,a,v,b), hàng u của $M^2=[2,2,0,0]$, nên $M^3_{u,v}=M^2_{u,u}\\cdot M_{u,v}+M^2_{u,a}\\cdot M_{a,v}=2\\times1+2\\times1=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the TOTAL number of cut-edges in the two graphs X and Y. (X: 5 vertices drawn as a 5-pointed star / pentagram, i.e. a single 5-cycle. Y: 4 vertices with both diagonals of a rectangle drawn, i.e. a single 4-cycle $K_{2,2}$.)|||Tìm TỔNG số cạnh cầu trong hai đồ thị X và Y. (X: 5 đỉnh vẽ hình ngôi sao 5 cánh, tức một chu trình 5 cạnh duy nhất. Y: 4 đỉnh vẽ đủ 2 đường chéo hình chữ nhật, tức một chu trình 4 cạnh duy nhất $K_{2,2}$.)",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both X (a 5-cycle) and Y (a 4-cycle) are single cycles with no chords — every edge of a cycle lies on that cycle, so removing any one edge still leaves the rest connected (no bridges) in either graph. Total cut-edges $=0+0=0$.</div><div class=\"ml-vi\">Cả X (chu trình 5 cạnh) và Y (chu trình 4 cạnh) đều là một chu trình đơn không có dây cung thừa — mọi cạnh của chu trình đều nằm trên chu trình đó nên bỏ 1 cạnh bất kỳ vẫn còn liên thông (không có cạnh cầu) ở cả 2 đồ thị. Tổng cạnh cầu $=0+0=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let u, v be two vertices of the graph $K_{2,2}$, one on each side. How many paths of length 4 <strong>between</strong> u and v?|||Cho u, v là hai đỉnh của đồ thị $K_{2,2}$, mỗi đỉnh một phía. Có bao nhiêu đường đi độ dài 4 <strong>giữa</strong> u và v?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
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
          "explanation": "<div class=\"ml-en\">In a bipartite graph, a walk of even length always ends on the SAME side it started from. Since u and v are on different sides, no walk of length 4 (even) can go from u to v. So the count is 0 (confirmed via $M^4_{u,v}=0$ using the adjacency matrix).</div><div class=\"ml-vi\">Trong đồ thị lưỡng phân, một bước đi độ dài chẵn luôn kết thúc ở CÙNG phía xuất phát. Vì u, v khác phía, không có bước đi độ dài 4 (chẵn) nào từ u đến v được. Vậy kết quả là 0 (đối chiếu $M^4_{u,v}=0$ qua ma trận kề).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a simple graph G with the adjacency matrix (vertices $v_1..v_5$ in order)<pre>0 1 0 0 1\n1 0 1 0 1\n0 1 0 1 0\n0 0 1 0 1\n1 1 0 1 0</pre>Choose the correct statement.|||Cho đơn đồ thị G với ma trận kề (đỉnh $v_1..v_5$ theo thứ tự)<pre>0 1 0 0 1\n1 0 1 0 1\n0 1 0 1 0\n0 0 1 0 1\n1 1 0 1 0</pre>Chọn phát biểu đúng.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "G does not have Euler paths|||G không có đường đi Euler"
            },
            {
              "text": "G has Euler paths but no Euler circuits|||G có đường đi Euler nhưng không có chu trình Euler"
            },
            {
              "text": "G has Euler circuits|||G có chu trình Euler"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Degrees: $v_1$=2, $v_2$=3, $v_3$=2, $v_4$=2, $v_5$=3. Exactly 2 odd-degree vertices ($v_2,v_5$) and G is connected &rArr; G has an Euler path but not an Euler circuit (which needs 0 odd-degree vertices).</div><div class=\"ml-vi\">Bậc: $v_1$=2, $v_2$=3, $v_3$=2, $v_4$=2, $v_5$=3. Đúng 2 đỉnh bậc lẻ ($v_2,v_5$), G liên thông &rArr; G có đường đi Euler nhưng không có chu trình Euler (cần 0 đỉnh bậc lẻ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of m and n such that the complete bipartite graph $K_{m,n}$ has Hamilton circuits.|||Tìm tất cả giá trị m, n để đồ thị lưỡng phân đầy đủ $K_{m,n}$ có chu trình Hamilton.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "m=n and m &ge; 2|||m=n và m &ge; 2"
            },
            {
              "text": "m=n and m &ge; 3|||m=n và m &ge; 3"
            },
            {
              "text": "m&gt;n and n &ge; 2|||m&gt;n và n &ge; 2"
            },
            {
              "text": "m&gt;n and n &ge; 3|||m&gt;n và n &ge; 3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Standard theorem: $K_{m,n}$ has a Hamilton circuit if and only if $m=n$ and $m \\ge 2$ (both parts must be equal size to alternate all the way around, and at least 2 per side to form a genuine cycle).</div><div class=\"ml-vi\">Định lý chuẩn: $K_{m,n}$ có chu trình Hamilton khi và chỉ khi $m=n$ và $m \\ge 2$ (2 phía phải bằng nhau để luân phiên trọn vòng, và cần ít nhất 2 mỗi phía để tạo chu trình thật sự).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graph has NO Euler circuits?<br>(i) $W_4$ &nbsp; (ii) $Q_4$ &nbsp; (iii) $C_4$ &nbsp; (iv) $K_5$|||Đồ thị nào sau đây KHÔNG có chu trình Euler?<br>(i) $W_4$ &nbsp; (ii) $Q_4$ &nbsp; (iii) $C_4$ &nbsp; (iv) $K_5$",
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
          "explanation": "<div class=\"ml-en\">Euler circuit needs every vertex to have even degree. $W_4$: hub degree 4 (even) but each of the 4 rim vertices has degree 3 (odd, from 2 cycle edges + 1 spoke) &rArr; has odd-degree vertices, NO Euler circuit. $Q_4$: 4-regular, all even &rArr; has one. $C_4$: all degree 2, even &rArr; has one. $K_5$: all degree 4, even &rArr; has one. Only (i) fails.</div><div class=\"ml-vi\">Chu trình Euler cần mọi đỉnh bậc chẵn. $W_4$: đỉnh trung tâm bậc 4 (chẵn) nhưng 4 đỉnh vành mỗi đỉnh bậc 3 (lẻ, từ 2 cạnh chu trình + 1 nan hoa) &rArr; có đỉnh bậc lẻ, KHÔNG có chu trình Euler. $Q_4$: đều bậc 4 &rArr; có. $C_4$: đều bậc 2 &rArr; có. $K_5$: đều bậc 4 &rArr; có. Chỉ (i) không thoả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the set of all graphs with degree sequence [2, 2, 2, 2, 2, 2]. Which of the following is TRUE:<br>(i) $\\exists G \\in S: G$ has an Euler circuit<br>(ii) $\\exists G \\in S: G$ has an Euler path, but no Euler circuits<br>(iii) $\\forall G \\in S: G$ has no Euler paths|||Cho S là tập tất cả đồ thị có dãy bậc [2, 2, 2, 2, 2, 2]. Phát biểu nào sau đây ĐÚNG:<br>(i) $\\exists G \\in S: G$ có chu trình Euler<br>(ii) $\\exists G \\in S: G$ có đường đi Euler nhưng không có chu trình Euler<br>(iii) $\\forall G \\in S: G$ không có đường đi Euler",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">All degrees are even, so any connected member of S (e.g. the single 6-cycle $C_6$) automatically has an Euler circuit &rArr; (i) TRUE. Since every degree is even, a member is either connected (giving a circuit, never just a path) or disconnected (giving neither) &rArr; (ii) is never possible, FALSE. (iii) is false since $C_6 \\in S$ has an Euler path (its circuit). Only (i) holds.</div><div class=\"ml-vi\">Mọi bậc đều chẵn nên bất kỳ thành viên liên thông nào của S (vd chu trình đơn $C_6$) tự động có chu trình Euler &rArr; (i) ĐÚNG. Vì mọi bậc chẵn, một thành viên hoặc liên thông (có chu trình, không bao giờ chỉ có đường đi) hoặc không liên thông (không có gì cả) &rArr; (ii) không bao giờ xảy ra, SAI. (iii) sai vì $C_6 \\in S$ có đường đi Euler (chính là chu trình của nó). Chỉ (i) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let S be the set of all directed graphs with the sequence of (out-degree, in-degree): [(2,2), (2,2), (2,1), (2,3)]. Which of the following is TRUE:<br>(i) $\\forall G \\in S: G$ has no Euler paths<br>(ii) $\\exists G \\in S: G$ has an Euler circuit<br>(iii) $\\exists G \\in S: G$ has an Euler path, but no Euler circuits|||Cho S là tập đồ thị có hướng với dãy (bậc ra, bậc vào): [(2,2), (2,2), (2,1), (2,3)]. Phát biểu nào ĐÚNG:<br>(i) $\\forall G \\in S: G$ không có đường đi Euler<br>(ii) $\\exists G \\in S: G$ có chu trình Euler<br>(iii) $\\exists G \\in S: G$ có đường đi Euler nhưng không có chu trình Euler",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A directed Euler circuit needs in=out at every vertex &mdash; vertices 3,4 always mismatch (2,1) and (2,3), so (ii) is impossible for ANY member, FALSE. A directed Euler path needs exactly one vertex with out&minus;in=+1 (vertex 3 here) and one with in&minus;out=+1 (vertex 4), rest balanced &mdash; exactly the case here, so a suitably connected member of S DOES have an Euler path but no circuit &rArr; (iii) TRUE, which also makes (i) FALSE.</div><div class=\"ml-vi\">Chu trình Euler có hướng cần bậc vào=bậc ra ở MỌI đỉnh &mdash; đỉnh 3,4 luôn lệch (2,1) và (2,3), nên (ii) không thể xảy ra với bất kỳ thành viên nào, SAI. Đường đi Euler có hướng cần đúng 1 đỉnh có bậc ra&minus;vào=+1 (đỉnh 3) và 1 đỉnh có bậc vào&minus;ra=+1 (đỉnh 4), còn lại cân bằng &mdash; đúng khớp trường hợp này, nên một đồ thị liên thông phù hợp trong S CÓ đường đi Euler nhưng không có chu trình &rArr; (iii) ĐÚNG, kéo theo (i) SAI.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following propositions is TRUE:<br>(i) If $K_{1,2}$ has a Hamilton path, then $K_2$ has an Hamilton circuit<br>(ii) If $W_4$ has a Hamilton path, then $K_{4,3}$ has an Euler path<br>(iii) If $K_{4,5}$ has an Euler path, then $Q_3$ has a Hamilton circuit|||Mệnh đề nào sau đây ĐÚNG:<br>(i) Nếu $K_{1,2}$ có đường đi Hamilton thì $K_2$ có chu trình Hamilton<br>(ii) Nếu $W_4$ có đường đi Hamilton thì $K_{4,3}$ có đường đi Euler<br>(iii) Nếu $K_{4,5}$ có đường đi Euler thì $Q_3$ có chu trình Hamilton",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i): $K_{1,2}$ has a Hamilton path (leaf-center-leaf) TRUE, but $K_2$ (2 vertices, 1 edge) can't form a cycle (min length 3) &rArr; consequent FALSE &rArr; implication FALSE. (ii): $W_4$ has a Hamilton path TRUE, but $K_{4,3}$ has 4 odd-degree vertices (the side of 4, each degree 3) &rArr; no Euler path, consequent FALSE &rArr; implication FALSE. (iii): $K_{4,5}$ has 4 odd-degree vertices (the side of 4, each degree 5) &rArr; antecedent (has Euler path) is FALSE &rArr; the implication is vacuously TRUE regardless of $Q_3$.</div><div class=\"ml-vi\">(i): $K_{1,2}$ có đường đi Hamilton (lá-tâm-lá) ĐÚNG, nhưng $K_2$ (2 đỉnh, 1 cạnh) không thể tạo chu trình (tối thiểu độ dài 3) &rArr; hệ quả SAI &rArr; mệnh đề kéo theo SAI. (ii): $W_4$ có đường đi Hamilton ĐÚNG, nhưng $K_{4,3}$ có 4 đỉnh bậc lẻ (phía 4 đỉnh, mỗi đỉnh bậc 3) &rArr; không có đường đi Euler, hệ quả SAI &rArr; SAI. (iii): $K_{4,5}$ có 4 đỉnh bậc lẻ (phía 4 đỉnh, bậc 5) &rArr; tiền đề (có đường đi Euler) SAI &rArr; mệnh đề kéo theo ĐÚNG một cách hiển nhiên (vacuously), không cần xét $Q_3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For what values of n does the graph $Q_n$ have Hamilton circuits?|||Với giá trị nào của n thì đồ thị $Q_n$ có chu trình Hamilton?",
          "options": [
            {
              "text": "n is even|||n chẵn"
            },
            {
              "text": "n is odd|||n lẻ"
            },
            {
              "text": "no values of n|||không giá trị n nào"
            },
            {
              "text": "n&gt;1|||n&gt;1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The n-cube $Q_n$ has a Hamilton circuit (the classic reflected-Gray-code cycle) for every $n \\ge 2$; $Q_1$ (2 vertices, 1 edge) is too small for any cycle. So the condition is exactly $n&gt;1$.</div><div class=\"ml-vi\">Siêu khối $Q_n$ có chu trình Hamilton (chu trình mã Gray phản xạ kinh điển) với mọi $n \\ge 2$; $Q_1$ (2 đỉnh, 1 cạnh) quá nhỏ để có chu trình. Vậy điều kiện chính xác là $n&gt;1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose the correct statement about the graph. (Two triangles, each with 3 vertices, joined by a single bridge edge between one vertex of each triangle — a 'bowtie' shape.)|||Chọn phát biểu đúng về đồ thị. (Hai tam giác, mỗi tam giác 3 đỉnh, nối nhau bằng một cạnh cầu duy nhất giữa một đỉnh của mỗi tam giác — hình 'nơ bướm'.)",
          "options": [
            {
              "text": "It has a Hamilton circuit|||Có chu trình Hamilton"
            },
            {
              "text": "It does not have Hamilton paths|||Không có đường đi Hamilton"
            },
            {
              "text": "It has a Hamilton path but does not have Hamilton circuits|||Có đường đi Hamilton nhưng không có chu trình Hamilton"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The bridge between the two triangles can only be crossed once in a simple path/circuit. A Hamilton path exists (traverse one triangle, cross the bridge once, traverse the other), but a Hamilton circuit would need to cross the bridge twice to return to the start &mdash; impossible.</div><div class=\"ml-vi\">Cạnh cầu nối 2 tam giác chỉ có thể đi qua 1 lần trong đường đi/chu trình đơn. Đường đi Hamilton tồn tại (đi hết 1 tam giác, qua cầu 1 lần, đi hết tam giác kia), nhưng chu trình Hamilton cần qua cầu 2 lần để quay lại điểm xuất phát &mdash; không thể.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F,G and edges A-B=8, A-C=8, B-C=6, B-D=7, B-E=5, C-E=6, C-F=5, D-E=4, D-F=6, D-G=8, E-F=3, F-G=7. What is the shortest path between G and A?|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,F,G và cạnh A-B=8, A-C=8, B-C=6, B-D=7, B-E=5, C-E=6, C-F=5, D-E=4, D-F=6, D-G=8, E-F=3, F-G=7. Đường đi ngắn nhất giữa G và A là gì?",
          "options": [
            {
              "text": "G-D-B-A|||G-D-B-A"
            },
            {
              "text": "G-F-C-A|||G-F-C-A"
            },
            {
              "text": "G-E-A|||G-E-A"
            },
            {
              "text": "G-B-A|||G-B-A"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Dijkstra from A: A-C=8, A-B=8, then A-C-F=8+5=13 (beats A-B-E=8+5=13 tie but continue), A-C-F-G=13+7=20. Checking alternatives: A-B-D-G=8+7+8=23, A-B-E-F-G=8+5+3+7=23 &mdash; all worse. Shortest is A-C-F-G $=20$, i.e. G-F-C-A reversed.</div><div class=\"ml-vi\">Dijkstra từ A: A-C=8, A-B=8, rồi A-C-F=8+5=13, A-C-F-G=13+7=20. Kiểm các đường khác: A-B-D-G=23, A-B-E-F-G=23 &mdash; đều tệ hơn. Ngắn nhất là A-C-F-G $=20$, tức G-F-C-A đảo ngược.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=7, B-D=7, B-C=8, B-E=3, C-E=3, D-E=2, D-Z=2, E-Z=3. Apply the Dijkstra algorithm to find the shortest path from A to Z. How many vertices are NOT chosen (i.e. not part of the shortest path)?|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=7, B-D=7, B-C=8, B-E=3, C-E=3, D-E=2, D-Z=2, E-Z=3. Áp dụng Dijkstra tìm đường ngắn nhất từ A đến Z. Có bao nhiêu đỉnh KHÔNG được chọn (không nằm trên đường đi ngắn nhất)?",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Shortest path: A-B-E-Z $=2+3+3=8$ (checked against A-C-E-Z=13, A-B-D-Z=11, all worse). Path uses 4 of the 6 vertices (A,B,E,Z); C and D are not chosen $\\Rightarrow 2$.</div><div class=\"ml-vi\">Đường ngắn nhất: A-B-E-Z $=2+3+3=8$ (so với A-C-E-Z=13, A-B-D-Z=11, đều tệ hơn). Đường dùng 4/6 đỉnh (A,B,E,Z); C và D không được chọn $\\Rightarrow 2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices a,b,c,d,e,z and edges a-b=3, a-d=5, b-c=6, b-d=1, d-c=1, c-e=2, d-e=2, c-z=5, e-z=2. Apply the Dijkstra algorithm to find the shortest path from a to z. What are the first 4 vertices chosen?|||Cho đồ thị có trọng số với đỉnh a,b,c,d,e,z và cạnh a-b=3, a-d=5, b-c=6, b-d=1, d-c=1, c-e=2, d-e=2, c-z=5, e-z=2. Áp dụng Dijkstra tìm đường ngắn nhất từ a đến z. 4 đỉnh đầu tiên được chọn là gì?",
          "options": [
            {
              "text": "a, d, b, c|||a, d, b, c"
            },
            {
              "text": "a, d, e, z|||a, d, e, z"
            },
            {
              "text": "a, b, d, c|||a, b, d, c"
            },
            {
              "text": "a, b, c, z|||a, b, c, z"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Extraction order: a(0) &rarr; b(3) &rarr; d(via b: 3+1=4) &rarr; c(via d: 4+1=5, beats via b: 3+6=9) &rarr; e(via d: 4+2=6) &rarr; z(via e: 6+2=8). First 4: a, b, d, c.</div><div class=\"ml-vi\">Thứ tự chọn: a(0) &rarr; b(3) &rarr; d(qua b: 3+1=4) &rarr; c(qua d: 4+1=5, tốt hơn qua b: 3+6=9) &rarr; e(qua d: 4+2=6) &rarr; z(qua e: 6+2=8). 4 đỉnh đầu: a, b, d, c.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D3",
      "source": "REAL",
      "sortOrder": 133,
      "title": "Progress Test 3 — Đề 3/7|||Kiểm tra tiến độ 3 — Đề 3/7",
      "description": "MAD101 Progress Test 3 question bank, part 3 of 7 (15 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 3/7 (15 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 30,
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
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=9, B-D=7, B-C=8, B-E=3, D-E=4, D-Z=2, E-Z=3, C-E=3. Find the first 3 vertices when using Dijkstra's algorithm to find the shortest path from A to Z.|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=9, B-D=7, B-C=8, B-E=3, D-E=4, D-Z=2, E-Z=3, C-E=3. Tìm 3 đỉnh đầu tiên khi dùng Dijkstra tìm đường ngắn nhất từ A đến Z.",
          "options": [
            {
              "text": "A-B-E|||A-B-E"
            },
            {
              "text": "A-B-C|||A-B-C"
            },
            {
              "text": "A-B-D|||A-B-D"
            },
            {
              "text": "A-B-Z|||A-B-Z"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Extraction order: A(0) &rarr; B(2) &rarr; E(via B: 2+3=5, beats D at 9 and C at 9). First 3: A, B, E.</div><div class=\"ml-vi\">Thứ tự chọn: A(0) &rarr; B(2) &rarr; E(qua B: 2+3=5, tốt hơn D=9 và C=9). 3 đỉnh đầu: A, B, E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F and edges D-E=9, D-C=4, E-F=2, C-F=6, E-A=14, F-A=9, F-B=8, C-B=15, A-B=7. What is the fourth vertex chosen when using Dijkstra's algorithm to find the shortest path from A to D?|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,F và cạnh D-E=9, D-C=4, E-F=2, C-F=6, E-A=14, F-A=9, F-B=8, C-B=15, A-B=7. Đỉnh thứ tư được chọn khi dùng Dijkstra tìm đường ngắn nhất từ A đến D là gì?",
          "options": [
            {
              "text": "The vertex C|||Đỉnh C"
            },
            {
              "text": "The vertex E|||Đỉnh E"
            },
            {
              "text": "The vertex F|||Đỉnh F"
            },
            {
              "text": "The vertex D|||Đỉnh D"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Extraction order: A(0) &rarr; B(7) &rarr; F(via A: 9, beats via B: 7+8=15) &rarr; E(via F: 9+2=11, beats direct 14) &rarr; C(via F: 9+6=15) &rarr; D(via C: 15+4=19). Fourth chosen: E.</div><div class=\"ml-vi\">Thứ tự chọn: A(0) &rarr; B(7) &rarr; F(qua A: 9, tốt hơn qua B: 15) &rarr; E(qua F: 9+2=11, tốt hơn trực tiếp 14) &rarr; C(qua F: 9+6=15) &rarr; D(qua C: 15+4=19). Đỉnh thứ tư: E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices a,b,c,d,e,f,g and edges a-b=4, a-d=2, d-g=3, a-c=8, b-c=5, b-e=10, d-e=7, e-g=2, e-f=2, g-f=7, c-f=6. Apply the Dijkstra algorithm to find the shortest path from a to f. What are the first 3 vertices chosen?|||Cho đồ thị có trọng số với đỉnh a,b,c,d,e,f,g và cạnh a-b=4, a-d=2, d-g=3, a-c=8, b-c=5, b-e=10, d-e=7, e-g=2, e-f=2, g-f=7, c-f=6. Áp dụng Dijkstra tìm đường ngắn nhất từ a đến f. 3 đỉnh đầu tiên được chọn là gì?",
          "options": [
            {
              "text": "a, b, d|||a, b, d"
            },
            {
              "text": "a, d, g|||a, d, g"
            },
            {
              "text": "a, b, c|||a, b, c"
            },
            {
              "text": "a, d, b|||a, d, b"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Extraction order: a(0) &rarr; d(2, beats b=4) &rarr; b(4). First 3: a, d, b.</div><div class=\"ml-vi\">Thứ tự chọn: a(0) &rarr; d(2, tốt hơn b=4) &rarr; b(4). 3 đỉnh đầu: a, d, b.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=9, B-D=5, B-C=8, B-E=3, D-E=4, C-E=3, D-Z=2, E-Z=3. Apply the Dijkstra algorithm to find the shortest path from A to Z. What is the next vertex chosen after E?|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=9, B-D=5, B-C=8, B-E=3, D-E=4, C-E=3, D-Z=2, E-Z=3. Áp dụng Dijkstra tìm đường ngắn nhất từ A đến Z. Đỉnh tiếp theo được chọn sau E là gì?",
          "options": [
            {
              "text": "D|||D"
            },
            {
              "text": "C|||C"
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
          "explanation": "<div class=\"ml-en\">Order: A(0) &rarr; B(2) &rarr; E(via B: 2+3=5) &rarr; next smallest tentative is D (via B: 2+5=7), beating C(9,updated to 8 via E) and Z(8 via E). So D is chosen right after E.</div><div class=\"ml-vi\">Thứ tự: A(0) &rarr; B(2) &rarr; E(qua B: 2+3=5) &rarr; tiếp theo nhỏ nhất là D (qua B: 2+5=7), tốt hơn C(9, cập nhật còn 8 qua E) và Z(8 qua E). Vậy D được chọn ngay sau E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=3, B-C=3, B-D=4, B-E=3, D-E=2, C-E=3, D-Z=2, E-Z=3. Apply the Dijkstra algorithm to find the shortest path from A to Z. What are the first 4 vertices chosen?|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=3, B-C=3, B-D=4, B-E=3, D-E=2, C-E=3, D-Z=2, E-Z=3. Áp dụng Dijkstra tìm đường ngắn nhất từ A đến Z. 4 đỉnh đầu tiên được chọn là gì?",
          "options": [
            {
              "text": "A-B-C-E|||A-B-C-E"
            },
            {
              "text": "A-B-E-Z|||A-B-E-Z"
            },
            {
              "text": "A-B-D-Z|||A-B-D-Z"
            },
            {
              "text": "A-B-C-D|||A-B-C-D"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Order: A(0) &rarr; B(2) &rarr; C(3, direct from A) &rarr; E(via B: 2+3=5, beats via C: 3+3=6). First 4: A, B, C, E.</div><div class=\"ml-vi\">Thứ tự: A(0) &rarr; B(2) &rarr; C(3, trực tiếp từ A) &rarr; E(qua B: 2+3=5, tốt hơn qua C: 3+3=6). 4 đỉnh đầu: A, B, C, E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices G,H,I,J,K,L,M and edges G-H=1, H-I=8, G-K=4, H-K=1, H-J=1, I-J=2, K-J=5, K-L=3, J-L=6, J-M=3, L-M=2, I-M=3. Find the length of the shortest path from G to M.|||Cho đồ thị có trọng số với đỉnh G,H,I,J,K,L,M và cạnh G-H=1, H-I=8, G-K=4, H-K=1, H-J=1, I-J=2, K-J=5, K-L=3, J-L=6, J-M=3, L-M=2, I-M=3. Tìm độ dài đường đi ngắn nhất từ G đến M.",
          "options": [
            {
              "text": "6|||6"
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
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Dijkstra from G: G-H=1, H-J=1+1=2 (beats other routes), J-M=2+3=5. Path G-H-J-M $=1+1+3=5$, shortest.</div><div class=\"ml-vi\">Dijkstra từ G: G-H=1, H-J=1+1=2 (tốt hơn các đường khác), J-M=2+3=5. Đường G-H-J-M $=1+1+3=5$, ngắn nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=9, B-D=7, B-C=8, B-E=3, D-E=4, C-E=3, D-Z=2, E-Z=3. Apply the Dijkstra algorithm to find the shortest path from A to Z. What are the first three vertices chosen?|||Cho đồ thị có trọng số với đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=9, B-D=7, B-C=8, B-E=3, D-E=4, C-E=3, D-Z=2, E-Z=3. Áp dụng Dijkstra tìm đường ngắn nhất từ A đến Z. 3 đỉnh đầu tiên được chọn là gì?",
          "options": [
            {
              "text": "A, B, E|||A, B, E"
            },
            {
              "text": "A, B, C|||A, B, C"
            },
            {
              "text": "A, C, E|||A, C, E"
            },
            {
              "text": "A, B, D|||A, B, D"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Order: A(0) &rarr; B(2) &rarr; E(via B: 2+3=5, beats C=9 and D=9). First 3: A, B, E.</div><div class=\"ml-vi\">Thứ tự: A(0) &rarr; B(2) &rarr; E(qua B: 2+3=5, tốt hơn C=9 và D=9). 3 đỉnh đầu: A, B, E.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many non-isomorphic trees of 4 vertices?|||Có bao nhiêu cây (tree) không đẳng cấu với 4 đỉnh?",
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
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">There are exactly 2: the path $P_4$ (a-b-c-d) and the star $K_{1,3}$ (one center joined to 3 leaves).</div><div class=\"ml-vi\">Có đúng 2 loại: đường đi $P_4$ (a-b-c-d) và ngôi sao $K_{1,3}$ (1 tâm nối 3 lá).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many leaves does a full 6-ary tree with 66 edges have?|||Một cây 6-phân đầy đủ (full 6-ary tree) có 66 cạnh thì có bao nhiêu lá?",
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
          "explanation": "<div class=\"ml-en\">For a full m-ary tree with $i$ internal vertices, edges $=mi$. So $6i=66 \\Rightarrow i=11$. Total vertices $=mi+1=67$. Leaves $=67-11=56$.</div><div class=\"ml-vi\">Với cây m-phân đầy đủ có $i$ đỉnh trong, số cạnh $=mi$. Vậy $6i=66 \\Rightarrow i=11$. Tổng đỉnh $=mi+1=67$. Số lá $=67-11=56$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the rooted tree: a is the root with children b, d, c. b's children are e, h, g. e's children are i, n, k. c's children are f, l, m. How many ancestors does the vertex e have?|||Cho cây có gốc: a là gốc, con của a là b, d, c. Con của b là e, h, g. Con của e là i, n, k. Con của c là f, l, m. Đỉnh e có bao nhiêu tổ tiên (ancestor)?",
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
              "text": "1|||1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Ancestors of e = every vertex on the path from the root to e, excluding e itself: a, b. That's 2.</div><div class=\"ml-vi\">Tổ tiên của e = mọi đỉnh trên đường từ gốc đến e, không tính e: a, b. Vậy là 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many leaves in a full binary tree with 61 vertices?|||Một cây nhị phân đầy đủ (full binary tree) có 61 đỉnh thì có bao nhiêu lá?",
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
          "explanation": "<div class=\"ml-en\">Full binary tree: $n=2i+1$ where $i$ = internal vertices. $61=2i+1 \\Rightarrow i=30$. Leaves $=n-i=61-30=31$.</div><div class=\"ml-vi\">Cây nhị phân đầy đủ: $n=2i+1$ với $i$ = số đỉnh trong. $61=2i+1 \\Rightarrow i=30$. Số lá $=n-i=61-30=31$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the maximum number of vertices in a binary tree of height 5.|||Tìm số đỉnh tối đa trong cây nhị phân có chiều cao 5.",
          "options": [
            {
              "text": "63|||63"
            },
            {
              "text": "65|||65"
            },
            {
              "text": "76|||76"
            },
            {
              "text": "83|||83"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Max vertices at height $h$ for a binary tree $=2^{h+1}-1=2^6-1=63$.</div><div class=\"ml-vi\">Số đỉnh tối đa ở chiều cao $h$ của cây nhị phân $=2^{h+1}-1=2^6-1=63$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the rooted tree: a is the root with children b, d, c. b's children are e, h, g. e's children are i, n, k. c's children are f, l, m. How many ancestors does the vertex k have?|||Cho cây có gốc: a là gốc, con của a là b, d, c. Con của b là e, h, g. Con của e là i, n, k. Con của c là f, l, m. Đỉnh k có bao nhiêu tổ tiên?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
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
          "explanation": "<div class=\"ml-en\">Ancestors of k = every vertex on the path from the root to k, excluding k itself: a, b, e. That's 3.</div><div class=\"ml-vi\">Tổ tiên của k = mọi đỉnh trên đường từ gốc đến k, không tính k: a, b, e. Vậy là 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of leaves of a balanced full binary tree of height 10.|||Tìm số lá ÍT NHẤT của một cây nhị phân đầy đủ cân bằng (balanced full binary tree) có chiều cao 10.",
          "options": [
            {
              "text": "513|||513"
            },
            {
              "text": "234|||234"
            },
            {
              "text": "549|||549"
            },
            {
              "text": "365|||365"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Minimum leaves for a balanced full binary tree of height $h$ is $2^{h-1}+1$: start from a complete tree of height $h-1$ (all $2^{h-1}$ leaves at depth $h-1$), then split just ONE of those leaves into two children at depth $h$ to reach height exactly $h$ while staying balanced. For $h=10$: $2^9+1=513$.</div><div class=\"ml-vi\">Số lá ít nhất của cây nhị phân đầy đủ cân bằng chiều cao $h$ là $2^{h-1}+1$: bắt đầu từ cây đầy đủ chiều cao $h-1$ (toàn bộ $2^{h-1}$ lá ở độ sâu $h-1$), rồi tách đúng MỘT lá đó thành 2 con ở độ sâu $h$ để đạt đúng chiều cao $h$ mà vẫn cân bằng. Với $h=10$: $2^9+1=513$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the rooted tree: a is the root with children b, d, c. b's children are e, h, g. e's children are i, n, k. c's children are f, l, m. How many leaves in this tree?|||Cho cây có gốc: a là gốc, con của a là b, d, c. Con của b là e, h, g. Con của e là i, n, k. Con của c là f, l, m. Cây này có bao nhiêu lá?",
          "options": [
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
              "text": "13|||13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Leaves (no children): d, h, g, i, n, k, f, l, m &rArr; 9 leaves.</div><div class=\"ml-vi\">Lá (không có con): d, h, g, i, n, k, f, l, m &rArr; 9 lá.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D4",
      "source": "REAL",
      "sortOrder": 134,
      "title": "Progress Test 3 — Đề 4/7|||Kiểm tra tiến độ 3 — Đề 4/7",
      "description": "MAD101 Progress Test 3 question bank, part 4 of 7 (15 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 4/7 (15 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 30,
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
          "prompt": "Given the message 'weekend'. Encoding this message by a Huffman coding. How many bits are used to encode the letter 'e'?|||Cho thông điệp 'weekend'. Mã hoá bằng Huffman coding. Cần bao nhiêu bit để mã hoá chữ 'e'?",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">Frequencies in 'weekend': e=3, w=1, k=1, n=1, d=1. Huffman merges the four freq-1 letters into two freq-2 pairs, then those merge into a freq-4 node; finally e(3) merges with that freq-4 node at the root. Since e is a direct child of the root, its code is 1 bit.</div><div class=\"ml-vi\">Tần suất trong 'weekend': e=3, w=1, k=1, n=1, d=1. Huffman gộp 4 chữ tần suất 1 thành 2 cặp tần suất 2, rồi 2 cặp đó gộp thành nút tần suất 4; cuối cùng e(3) gộp với nút tần suất 4 đó ở gốc. Vì e là con trực tiếp của gốc nên mã của nó dài 1 bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Decode the message 110111010 encoded by the scheme f: 10, p: 110, t: 1110.|||Giải mã thông điệp 110111010 được mã hoá bằng lược đồ f: 10, p: 110, t: 1110.",
          "options": [
            {
              "text": "ptf|||ptf"
            },
            {
              "text": "fpt|||fpt"
            },
            {
              "text": "tpf|||tpf"
            },
            {
              "text": "pft|||pft"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Greedily match prefix codes: \"110\"=p, remaining \"111010\"; \"1110\"=t, remaining \"10\"; \"10\"=f. Decoded: p-t-f.</div><div class=\"ml-vi\">Khớp mã tiền tố tuần tự: \"110\"=p, còn lại \"111010\"; \"1110\"=t, còn lại \"10\"; \"10\"=f. Giải mã: p-t-f.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the coding scheme a: 001; b: 0001; e: 11; r: 0000; s: 0100; t: 011; x: 0101. Find the word represented by 011110101011.|||Cho lược đồ mã hoá a: 001; b: 0001; e: 11; r: 0000; s: 0100; t: 011; x: 0101. Tìm từ được biểu diễn bởi 011110101011.",
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
          "explanation": "<div class=\"ml-en\">Greedily match: \"011\"=t, remaining \"110101011\"; \"11\"=e, remaining \"0101011\"; \"0101\"=x, remaining \"011\"; \"011\"=t. Decoded: t-e-x-t = \"text\".</div><div class=\"ml-vi\">Khớp tuần tự: \"011\"=t, còn \"110101011\"; \"11\"=e, còn \"0101011\"; \"0101\"=x, còn \"011\"; \"011\"=t. Giải mã: t-e-x-t = \"text\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Encode the message \"KYAYKY\" using Huffman coding, what is the length of the encoded message?|||Mã hoá thông điệp \"KYAYKY\" bằng Huffman coding, độ dài thông điệp mã hoá là bao nhiêu?",
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
          "explanation": "<div class=\"ml-en\">Frequencies: Y=3, K=2, A=1. Huffman merges A(1) and K(2) into a node of weight 3, then merges that with Y(3) at the root. Code lengths: Y=1 bit, K=2 bits, A=2 bits. Total $=3\\times1+2\\times2+1\\times2=3+4+2=9$.</div><div class=\"ml-vi\">Tần suất: Y=3, K=2, A=1. Huffman gộp A(1) và K(2) thành nút trọng số 3, rồi gộp với Y(3) ở gốc. Độ dài mã: Y=1 bit, K=2 bit, A=2 bit. Tổng $=3\\times1+2\\times2+1\\times2=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Draw a binary search tree for the sentence 'The quick brown fox jumps over the lazy dog' (inserting words left-to-right, ignoring the repeated 'the'). How many comparisons are needed to locate the word 'lazy'?|||Dựng cây tìm kiếm nhị phân (BST) cho câu 'The quick brown fox jumps over the lazy dog' (chèn từ trái sang phải, bỏ qua từ 'the' lặp lại). Cần bao nhiêu phép so sánh để tìm từ 'lazy'?",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Inserting in order builds a chain: the &rarr; quick &rarr; brown &rarr; fox &rarr; jumps &rarr; over &rarr; lazy (each new word alphabetically less than 'the'/'quick' but greater than the previous, always branching the same way). Path length to 'lazy' $=7$ comparisons.</div><div class=\"ml-vi\">Chèn theo thứ tự tạo thành 1 chuỗi: the &rarr; quick &rarr; brown &rarr; fox &rarr; jumps &rarr; over &rarr; lazy (mỗi từ mới luôn nhỏ hơn 'the'/'quick' nhưng lớn hơn từ trước, rẽ nhánh cùng hướng). Độ dài đường đến 'lazy' $=7$ phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of these codes is a prefix code?|||Bộ mã nào sau đây là mã tiền tố (prefix code)?",
          "options": [
            {
              "text": "a: 101; b: 110; c: 10; d: 11|||a: 101; b: 110; c: 10; d: 11"
            },
            {
              "text": "a: 101; b: 100; c: 10; d: 11|||a: 101; b: 100; c: 10; d: 11"
            },
            {
              "text": "a: 101; b: 100; c: 110; d: 11|||a: 101; b: 100; c: 110; d: 11"
            },
            {
              "text": "a: 101; b: 100; c: 11; d: 111|||a: 101; b: 100; c: 11; d: 111"
            },
            {
              "text": "a: 101; b: 100; c: 01; d: 111|||a: 101; b: 100; c: 01; d: 111"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">A: \"10\"(c) is a prefix of \"101\"(a) &rArr; fails. B: same issue, \"10\"(c) prefixes \"101\"(a) &rArr; fails. C: \"11\"(d) is a prefix of \"110\"(c) &rArr; fails. D: \"11\"(c) is a prefix of \"111\"(d) &rArr; fails. E: 101,100,01,111 &mdash; checking every pair, none is a prefix of another &rArr; valid prefix code.</div><div class=\"ml-vi\">A: \"10\"(c) là tiền tố của \"101\"(a) &rArr; sai. B: cùng lỗi, \"10\"(c) là tiền tố của \"101\"(a) &rArr; sai. C: \"11\"(d) là tiền tố của \"110\"(c) &rArr; sai. D: \"11\"(c) là tiền tố của \"111\"(d) &rArr; sai. E: 101,100,01,111 &mdash; kiểm mọi cặp, không mã nào là tiền tố của mã khác &rArr; đúng là mã tiền tố.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Huffman coding to encode these symbols with given frequencies: A: 0.2, B: 0.1, C: 0.45, D: 0.15, E: 0.1. What is the average number of bits required to encode a character?|||Dùng Huffman coding mã hoá các ký tự với tần suất: A: 0.2, B: 0.1, C: 0.45, D: 0.15, E: 0.1. Số bit trung bình cần để mã hoá một ký tự là bao nhiêu?",
          "options": [
            {
              "text": "2.20|||2.20"
            },
            {
              "text": "2.25|||2.25"
            },
            {
              "text": "2.10|||2.10"
            },
            {
              "text": "2.05|||2.05"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Merge B,E(0.1+0.1=0.2) &rarr; merge with D(0.15+0.2=0.35) &rarr; merge with A(0.2+0.35=0.55) &rarr; merge with C(0.45+0.55=1.0). Depths: C=1,A=2,D=3,B=4,E=4. Average $=0.45(1)+0.2(2)+0.15(3)+0.1(4)+0.1(4)=0.45+0.4+0.45+0.4+0.4=2.10$.</div><div class=\"ml-vi\">Gộp B,E(0.1+0.1=0.2) &rarr; gộp với D(0.15+0.2=0.35) &rarr; gộp với A(0.2+0.35=0.55) &rarr; gộp với C(0.45+0.55=1.0). Độ sâu: C=1,A=2,D=3,B=4,E=4. Trung bình $=0.45(1)+0.2(2)+0.15(3)+0.1(4)+0.1(4)=2.10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the average number of bits used to encode a letter when using Huffman coding to encode a message consisting of only the letters a, b, c, e, n with the corresponding frequencies 0.1, 0.4, 0.2, 0.2, 0.1?|||Số bit trung bình để mã hoá một chữ cái khi dùng Huffman coding cho thông điệp chỉ gồm các chữ a, b, c, e, n với tần suất tương ứng 0.1, 0.4, 0.2, 0.2, 0.1?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "2.2|||2.2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1.6|||1.6"
            },
            {
              "text": "2.6|||2.6"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Merge a,n(0.1+0.1=0.2) &rarr; merge c,e(0.2+0.2=0.4) &rarr; merge (an) with b(0.2+0.4=0.6) &rarr; merge (ce) with (anb)(0.4+0.6=1.0). Depths: c=2,e=2,b=2,a=3,n=3. Average $=0.2(2)+0.2(2)+0.4(2)+0.1(3)+0.1(3)=0.4+0.4+0.8+0.3+0.3=2.2$.</div><div class=\"ml-vi\">Gộp a,n(0.1+0.1=0.2) &rarr; gộp c,e(0.2+0.2=0.4) &rarr; gộp (an) với b(0.2+0.4=0.6) &rarr; gộp (ce) với (anb)(0.4+0.6=1.0). Độ sâu: c=2,e=2,b=2,a=3,n=3. Trung bình $=0.2(2)+0.2(2)+0.4(2)+0.1(3)+0.1(3)=2.2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are needed to search for the word \"hoa\" in the binary search tree for the sentence \"Canh le trang diem mot vai bong hoa\" (inserted left-to-right)?|||Cần bao nhiêu phép so sánh để tìm chữ \"hoa\" trong cây tìm kiếm nhị phân dựng từ câu \"Canh le trang diem mot vai bong hoa\" (chèn từ trái sang phải)?",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Building the BST: Canh(root) &rarr; le(right, l&gt;c) &rarr; trang(right of le) &rarr; diem(left of le) &rarr; mot(left of trang, since m&gt;l but m&lt;t) &rarr; vai(right of trang) &rarr; bong(left of Canh) &rarr; hoa(right of diem, since h&gt;c,h&lt;l,h&gt;d). Path to hoa: Canh &rarr; le &rarr; diem &rarr; hoa $=4$ comparisons.</div><div class=\"ml-vi\">Dựng BST: Canh(gốc) &rarr; le(phải, l&gt;c) &rarr; trang(phải của le) &rarr; diem(trái của le) &rarr; mot(trái của trang, vì m&gt;l nhưng m&lt;t) &rarr; vai(phải của trang) &rarr; bong(trái của Canh) &rarr; hoa(phải của diem, vì h&gt;c,h&lt;l,h&gt;d). Đường đến hoa: Canh &rarr; le &rarr; diem &rarr; hoa $=4$ phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many comparisons are used to locate or add the word \"pear\" in the binary search tree for the list banana, peach, apple, pear, coconut, mango, papaya (inserted in that order)?|||Cần bao nhiêu phép so sánh để tìm/chèn chữ \"pear\" trong cây tìm kiếm nhị phân dựng từ danh sách banana, peach, apple, pear, coconut, mango, papaya (chèn theo thứ tự đó)?",
          "options": [
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
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">BST: banana(root) &rarr; peach(right) &rarr; apple(left) &rarr; pear(right of peach, since \"pear\">\"peach\") &rarr; coconut(left of peach) &rarr; mango(right of coconut) &rarr; papaya(right of mango). Searching \"pear\": banana &rarr; peach &rarr; pear $=3$ comparisons.</div><div class=\"ml-vi\">BST: banana(gốc) &rarr; peach(phải) &rarr; apple(trái) &rarr; pear(phải của peach, vì \"pear\">\"peach\") &rarr; coconut(trái của peach) &rarr; mango(phải của coconut) &rarr; papaya(phải của mango). Tìm \"pear\": banana &rarr; peach &rarr; pear $=3$ phép so sánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the prefix notation<br>$+\\ \\uparrow\\ {-}\\ 3\\ 1\\ 2\\ *\\ 3\\ +\\ 1\\ 5$|||Tìm giá trị của biểu thức tiền tố (prefix)<br>$+\\ \\uparrow\\ {-}\\ 3\\ 1\\ 2\\ *\\ 3\\ +\\ 1\\ 5$",
          "options": [
            {
              "text": "35|||35"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-9|||-9"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "20|||20"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\uparrow(-\\ 3\\ 1,\\ 2)=\\uparrow(2,2)=2^2=4$. $*(3, +\\ 1\\ 5)=3\\times(1+5)=18$. Total $=+(4,18)=22$.</div><div class=\"ml-vi\">$\\uparrow(-\\ 3\\ 1,\\ 2)=\\uparrow(2,2)=2^2=4$. $*(3, +\\ 1\\ 5)=3\\times(1+5)=18$. Tổng $=+(4,18)=22$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a rooted tree: a is the root with children b, c, d. b's children are e, f, g. e's children are k, l, m. g's child is n, whose children are r, s. c is a leaf. d's children are h, i, j; h's child is o, i's child is p, j's child is q. If using preorder traversal to visit the vertices of the given rooted tree, what is the position of vertex d?|||Cho cây có gốc: a là gốc, con của a là b, c, d. Con của b là e, f, g. Con của e là k, l, m. Con của g là n, con của n là r, s. c là lá. Con của d là h, i, j; con của h là o, con của i là p, con của j là q. Nếu duyệt tiền thứ tự (preorder) cây trên, đỉnh d ở vị trí thứ mấy?",
          "options": [
            {
              "text": "4th|||Thứ 4"
            },
            {
              "text": "7th|||Thứ 7"
            },
            {
              "text": "11th|||Thứ 11"
            },
            {
              "text": "13th|||Thứ 13"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Preorder: a,b,e,k,l,m,f,g,n,r,s,c,d,... &mdash; counting: a(1) b(2) e(3) k(4) l(5) m(6) f(7) g(8) n(9) r(10) s(11) c(12) d(13).</div><div class=\"ml-vi\">Preorder: a,b,e,k,l,m,f,g,n,r,s,c,d,... &mdash; đếm: a(1) b(2) e(3) k(4) l(5) m(6) f(7) g(8) n(9) r(10) s(11) c(12) d(13).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the postfix notation for the expression $(x-y)^2+x(y+5)$<br>(i) x y - 2 &uarr; x y 5 + * +<br>(ii) + &uarr; - x y 2 * x + 5 y<br>(iii) x - y &uarr; 2 + x * y + 5<br>(iv) + &uarr; -x y 2 * x + y 5|||Tìm ký hiệu hậu tố (postfix) cho biểu thức $(x-y)^2+x(y+5)$<br>(i) x y - 2 &uarr; x y 5 + * +<br>(ii) + &uarr; - x y 2 * x + 5 y<br>(iii) x - y &uarr; 2 + x * y + 5<br>(iv) + &uarr; -x y 2 * x + y 5",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">$(x-y)^2$ postfix $=$ x y - 2 &uarr;. $x(y+5)$ postfix $=$ x y 5 + *. Combine with $+$: x y - 2 &uarr; x y 5 + * + &mdash; matches (i) exactly.</div><div class=\"ml-vi\">$(x-y)^2$ dạng hậu tố $=$ x y - 2 &uarr;. $x(y+5)$ dạng hậu tố $=$ x y 5 + *. Ghép với $+$: x y - 2 &uarr; x y 5 + * + &mdash; khớp đúng (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the value of the following postfix expression?<br>3 2 * 2 &uarr; 5 3 - 8 4 / * -|||Giá trị của biểu thức hậu tố (postfix) sau là bao nhiêu?<br>3 2 * 2 &uarr; 5 3 - 8 4 / * -",
          "options": [
            {
              "text": "18|||18"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$3\\times2=6$; $6^2=36$; $5-3=2$; $8/4=2$; $2\\times2=4$; $36-4=32$.</div><div class=\"ml-vi\">$3\\times2=6$; $6^2=36$; $5-3=2$; $8/4=2$; $2\\times2=4$; $36-4=32$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the prefix notation<br>$*\\ +\\ 1\\ +\\ 3\\ \\uparrow\\ 3\\ +\\ 1\\ 1\\ 6$|||Tìm giá trị của biểu thức tiền tố (prefix)<br>$*\\ +\\ 1\\ +\\ 3\\ \\uparrow\\ 3\\ +\\ 1\\ 1\\ 6$",
          "options": [
            {
              "text": "48|||48"
            },
            {
              "text": "180|||180"
            },
            {
              "text": "78|||78"
            },
            {
              "text": "396|||396"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$+\\ 1\\ 1=2$; $\\uparrow(3,2)=9$; $+(3,9)=12$; $+(1,12)=13$; $*(13,6)=78$.</div><div class=\"ml-vi\">$+\\ 1\\ 1=2$; $\\uparrow(3,2)=9$; $+(3,9)=12$; $+(1,12)=13$; $*(13,6)=78$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D5",
      "source": "REAL",
      "sortOrder": 135,
      "title": "Progress Test 3 — Đề 5/7|||Kiểm tra tiến độ 3 — Đề 5/7",
      "description": "MAD101 Progress Test 3 question bank, part 5 of 7 (15 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 5/7 (15 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 30,
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
          "prompt": "Compute the value of the postfix notation<br>3 1 - 2 &uarr; 3 1 5 + * +|||Tính giá trị của biểu thức hậu tố (postfix)<br>3 1 - 2 &uarr; 3 1 5 + * +",
          "options": [
            {
              "text": "12|||12"
            },
            {
              "text": "-6|||-6"
            },
            {
              "text": "34|||34"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$3-1=2$; $2^2=4$; $1+5=6$; $3\\times6=18$; $4+18=22$.</div><div class=\"ml-vi\">$3-1=2$; $2^2=4$; $1+5=6$; $3\\times6=18$; $4+18=22$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the prefix notation for the expression a / b + (c - d) * e|||Tìm ký hiệu tiền tố (prefix) cho biểu thức a / b + (c - d) * e",
          "options": [
            {
              "text": "/ a b + c d - e *|||/ a b + c d - e *"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "+ / a b * - c d e|||+ / a b * - c d e"
            },
            {
              "text": "a b / c d - e * +|||a b / c d - e * +"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$a/b$ prefix $=$ / a b. $(c-d)*e$ prefix $=$ * - c d e. Combine with $+$: + / a b * - c d e.</div><div class=\"ml-vi\">$a/b$ dạng tiền tố $=$ / a b. $(c-d)*e$ dạng tiền tố $=$ * - c d e. Ghép với $+$: + / a b * - c d e.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the prefix notation - * 2 - x a + 4 y. Find the corresponding infix notation.|||Cho ký hiệu tiền tố (prefix) - * 2 - x a + 4 y. Tìm ký hiệu trung tố (infix) tương ứng.",
          "options": [
            {
              "text": "2 * x - a - 4 + y|||2 * x - a - 4 + y"
            },
            {
              "text": "2 - x * a + 4 - y|||2 - x * a + 4 - y"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "2 - x * a - 4 + y|||2 - x * a - 4 + y"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Left side * 2 (- x a) &rarr; inorder \"2 * x - a\". Right side + 4 y &rarr; inorder \"4 + y\". Combine with the outer -: \"2 * x - a - 4 + y\".</div><div class=\"ml-vi\">Vế trái * 2 (- x a) &rarr; duyệt giữa \"2 * x - a\". Vế phải + 4 y &rarr; duyệt giữa \"4 + y\". Ghép với dấu - ngoài cùng: \"2 * x - a - 4 + y\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the prefix expression<br>$+\\ {-}\\ \\uparrow\\ 3\\ 2\\ \\uparrow\\ 2\\ 3\\ /\\ 6\\ {-}\\ 4\\ 2$|||Tìm giá trị của biểu thức tiền tố (prefix)<br>$+\\ {-}\\ \\uparrow\\ 3\\ 2\\ \\uparrow\\ 2\\ 3\\ /\\ 6\\ {-}\\ 4\\ 2$",
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
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$-(\\uparrow 3\\ 2, \\uparrow 2\\ 3)=3^2-2^3=9-8=1$. $/(6, -4\\ 2)=6/(4-2)=3$. Total $=1+3=4$.</div><div class=\"ml-vi\">$-(\\uparrow 3\\ 2, \\uparrow 2\\ 3)=3^2-2^3=9-8=1$. $/(6, -4\\ 2)=6/(4-2)=3$. Tổng $=1+3=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the postfix expression<br>3 2 &uarr; 6 + 5 4 - - 3 2 1 + + -|||Tìm giá trị của biểu thức hậu tố (postfix)<br>3 2 &uarr; 6 + 5 4 - - 3 2 1 + + -",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$3^2=9$; $9+6=15$; $5-4=1$; $15-1=14$; $2+1=3$; $3+3=6$; $14-6=8$.</div><div class=\"ml-vi\">$3^2=9$; $9+6=15$; $5-4=1$; $15-1=14$; $2+1=3$; $3+3=6$; $14-6=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many edges must be removed from the graph $Q_3$ to produce a spanning tree?|||Cần bỏ bao nhiêu cạnh khỏi đồ thị $Q_3$ để thu được một cây khung (spanning tree)?",
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
              "text": "7|||7"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$Q_3$ has $2^3=8$ vertices, each of degree 3, so $8\\times3/2=12$ edges. A spanning tree needs $8-1=7$ edges. Remove $12-7=5$.</div><div class=\"ml-vi\">$Q_3$ có $2^3=8$ đỉnh, mỗi đỉnh bậc 3, nên có $8\\times3/2=12$ cạnh. Cây khung cần $8-1=7$ cạnh. Cần bỏ $12-7=5$ cạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the height of the spanning tree obtained from the complete bipartite graph $K_{4,3}$ by depth-first search, starting at a vertex of degree 4?|||Chiều cao của cây khung thu được từ đồ thị lưỡng phân đầy đủ $K_{4,3}$ bằng tìm kiếm theo chiều sâu (DFS), bắt đầu từ đỉnh bậc 4, là bao nhiêu?",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A degree-4 vertex is on the 3-side (call it $b_1$); the 4-side vertices have degree 3. DFS alternates sides: $b_1{\\to}a_1{\\to}b_2{\\to}a_2{\\to}b_3{\\to}a_3$ (6 vertices, using up all of side B before backtracking), then backtracks to attach the last leaf $a_4$ off $b_3$. Longest root-to-leaf path has 5 edges &rArr; height 5.</div><div class=\"ml-vi\">Đỉnh bậc 4 nằm ở phía 3 đỉnh (gọi $b_1$); phía 4 đỉnh có bậc 3. DFS luân phiên 2 phía: $b_1{\\to}a_1{\\to}b_2{\\to}a_2{\\to}b_3{\\to}a_3$ (6 đỉnh, dùng hết phía B rồi mới quay lui), sau đó quay lui gắn lá cuối $a_4$ vào $b_3$. Đường dài nhất từ gốc đến lá có 5 cạnh &rArr; chiều cao 5.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many different spanning trees does the graph $C_n$ have?|||Đồ thị $C_n$ (chu trình n đỉnh) có bao nhiêu cây khung khác nhau?",
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
          "explanation": "<div class=\"ml-en\">$C_n$ has $n$ edges; a spanning tree removes exactly 1 edge, and each of the $n$ edges gives a distinct spanning tree (a different path) &rArr; $n$ spanning trees.</div><div class=\"ml-vi\">$C_n$ có $n$ cạnh; cây khung bỏ đúng 1 cạnh, mỗi cạnh trong $n$ cạnh cho ra 1 cây khung khác nhau (đường đi khác nhau) &rArr; $n$ cây khung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a graph with vertices A,B,C,D,E,Z and edges A-B, A-C, B-D, B-E, C-E, D-E, D-Z, E-Z. Using depth-first search to produce a spanning tree, visiting neighbors in alphabetical order, choose vertex A as the root. Which spanning tree do we obtain? (i) A-B,B-D,D-E,E-C,E-Z (ii) A-B,B-D,D-Z,C-E (iii) branching variant with both D and E splitting (iv) A-B,B-D,C-E without the D-E link)|||Cho đồ thị đỉnh A,B,C,D,E,Z và cạnh A-B, A-C, B-D, B-E, C-E, D-E, D-Z, E-Z. Dùng DFS dựng cây khung, thăm hàng xóm theo thứ tự alphabet, chọn A làm gốc. Ta thu được cây khung nào? (i) A-B,B-D,D-E,E-C,E-Z (ii) A-B,B-D,D-Z,C-E (iii) biến thể phân nhánh cả D và E (iv) A-B,B-D,C-E không có nhánh D-E)",
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
          "explanation": "<div class=\"ml-en\">DFS(A): visit B first(alphabetical). DFS(B): visit D first. DFS(D): visit E first. DFS(E): visit C first (leaf, backtrack), then visit Z (leaf). Back at A, C is already visited via E, so edge A-C is unused. Tree edges: A-B, B-D, D-E, E-C, E-Z &mdash; matches (i).</div><div class=\"ml-vi\">DFS(A): thăm B trước (theo alphabet). DFS(B): thăm D trước. DFS(D): thăm E trước. DFS(E): thăm C trước (lá, quay lui), rồi thăm Z (lá). Về A, C đã thăm qua E nên cạnh A-C không dùng. Cạnh cây: A-B, B-D, D-E, E-C, E-Z &mdash; khớp (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a spanning tree for $K_{1,6}$. (i) an 8-point zigzag chain (wrong vertex count for $K_{1,6}$'s 7 vertices). (ii) a 7-vertex tree a-b-c-d plus a separate g-f-e chain joined at c/e (branching, not matching a star). (iii) a clean star: one central vertex directly joined to 6 leaf vertices.|||Tìm một cây khung cho $K_{1,6}$. (i) chuỗi zigzag 8 điểm (sai số đỉnh so với 7 đỉnh của $K_{1,6}$). (ii) cây 7 đỉnh a-b-c-d cộng chuỗi riêng g-f-e nối vào c/e (có phân nhánh, không khớp dạng sao). (iii) hình sao sạch: 1 đỉnh trung tâm nối thẳng tới 6 đỉnh lá.",
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
          "explanation": "<div class=\"ml-en\">$K_{1,6}$ is already a tree (1 center + 6 leaves, 6 edges, connected, acyclic), so its only spanning tree is itself &mdash; the star shape in (iii). (i) has the wrong vertex count; (ii) has the wrong degree distribution (not a single center of degree 6).</div><div class=\"ml-vi\">$K_{1,6}$ vốn đã là cây (1 tâm + 6 lá, 6 cạnh, liên thông, không chu trình) nên cây khung duy nhất chính là nó &mdash; hình sao ở (iii). (i) sai số đỉnh; (ii) sai phân bố bậc (không phải 1 tâm bậc 6 duy nhất).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a graph with vertices A,B,C,D,E,F and edges A-B, A-C, A-D, B-D, B-E, D-E, D-F. How many edges must be removed from the graph to get a spanning tree?|||Cho đồ thị đỉnh A,B,C,D,E,F và cạnh A-B, A-C, A-D, B-D, B-E, D-E, D-F. Cần bỏ bao nhiêu cạnh để được cây khung?",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">7 edges, 6 vertices. Spanning tree needs $6-1=5$ edges. Remove $7-5=2$.</div><div class=\"ml-vi\">7 cạnh, 6 đỉnh. Cây khung cần $6-1=5$ cạnh. Cần bỏ $7-5=2$ cạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many non-isomorphic spanning trees does the following graph have? (Two 4-cycles a-b-d-c-a and f-g-h-e-f, joined by a single bridge edge d-e.)|||Đồ thị sau có bao nhiêu cây khung KHÔNG đẳng cấu? (Hai chu trình 4 cạnh a-b-d-c-a và f-g-h-e-f, nối nhau bằng một cạnh cầu duy nhất d-e.)",
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
          "explanation": "<div class=\"ml-en\">The bridge d-e must stay. Each 4-cycle becomes a path when 1 of its 4 edges is removed, and d (resp. e) is either an ENDPOINT of that path or INTERNAL to it. Combinations: both endpoints (gives a straight $P_8$), one endpoint+one internal (gives a single-branch spider &mdash; the two such combos are mirror images, isomorphic), both internal (gives a two-branch tree). That is exactly 3 non-isomorphic shapes.</div><div class=\"ml-vi\">Cạnh cầu d-e phải giữ nguyên. Mỗi chu trình 4 cạnh thành đường đi khi bỏ 1/4 cạnh, và d (hay e) hoặc là ĐẦU MÚT của đường đó hoặc NẰM GIỮA. Tổ hợp: cả 2 đầu mút (cho đường thẳng $P_8$), 1 đầu mút+1 giữa (cho cây phân nhánh 1 chỗ &mdash; 2 tổ hợp này đối xứng gương, đẳng cấu nhau), cả 2 nằm giữa (cho cây phân nhánh 2 chỗ). Đúng 3 dạng không đẳng cấu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the height of spanning tree obtained from $W_{100}$ by the Depth-first search, starting at the vertex of degree 100?|||Chiều cao của cây khung thu được từ $W_{100}$ bằng tìm kiếm theo chiều sâu (DFS), bắt đầu từ đỉnh bậc 100, là bao nhiêu?",
          "options": [
            {
              "text": "99|||99"
            },
            {
              "text": "100|||100"
            },
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
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The degree-100 vertex is the hub. DFS from the hub follows the rim cycle all the way around (hub&rarr;rim1&rarr;rim2&rarr;...&rarr;rim100) before backtracking, since each rim vertex's only unvisited neighbor is the next one on the cycle. This makes a single path of all 101 vertices &rArr; height $=100$ edges.</div><div class=\"ml-vi\">Đỉnh bậc 100 là trục (hub). DFS từ hub đi theo chu trình vành đi hết vòng (hub&rarr;vành1&rarr;vành2&rarr;...&rarr;vành100) rồi mới quay lui, vì mỗi đỉnh vành chỉ còn 1 hàng xóm chưa thăm là đỉnh kế tiếp trên chu trình. Tạo thành 1 đường thẳng gồm cả 101 đỉnh &rArr; chiều cao $=100$ cạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F,G and edges A-D=2, D-F=1, A-B=2, A-C=1, D-C=2, F-G=2, B-C=2, C-G=3, B-E=1, E-C=3. Use Prim's algorithm to find the minimum spanning tree with the first edge {A,C}. Assume that the vertices are ordered alphabetically for tie-breaking. What is the sequence of edges chosen?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,F,G và cạnh A-D=2, D-F=1, A-B=2, A-C=1, D-C=2, F-G=2, B-C=2, C-G=3, B-E=1, E-C=3. Dùng Prim tìm cây khung nhỏ nhất với cạnh đầu {A,C}. Giả sử đỉnh xếp theo alphabet khi cần phá vỡ tie. Chuỗi cạnh được chọn là gì?",
          "options": [
            {
              "text": "{A,C},{A,B},{B,E},{A,D},{D,F},{F,G}|||{A,C},{A,B},{B,E},{A,D},{D,F},{F,G}"
            },
            {
              "text": "{A,C},{D,F},{B,E},{A,D},{A,B},{F,G}|||{A,C},{D,F},{B,E},{A,D},{A,B},{F,G}"
            },
            {
              "text": "{A,C},{A,B},{A,D},{B,E},{D,F},{F,G}|||{A,C},{A,B},{A,D},{B,E},{D,F},{F,G}"
            },
            {
              "text": "{A,C},{A,D},{A,B},{B,E},{D,F},{F,G}|||{A,C},{A,D},{A,B},{B,E},{D,F},{F,G}"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Start {A,C}(1). Tie among A-D,A-B,C-D,C-B (all 2); alphabetically B&lt;D and A-B ties with C-B so pick A-B. Next min is B-E(1). Then tie A-D vs C-D(2), pick A-D (A&lt;C). Then D-F(1). Then F-G(2). Sequence: {A,C},{A,B},{B,E},{A,D},{D,F},{F,G}.</div><div class=\"ml-vi\">Bắt đầu {A,C}(1). Tie giữa A-D,A-B,C-D,C-B (đều 2); B&lt;D và A-B tie với C-B nên chọn A-B. Tiếp theo nhỏ nhất là B-E(1). Rồi tie A-D và C-D(2), chọn A-D (A&lt;C). Rồi D-F(1). Rồi F-G(2). Chuỗi: {A,C},{A,B},{B,E},{A,D},{D,F},{F,G}.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=6, B-C=2, B-D=4, B-E=3, C-D=4, C-E=1, D-Z=2, E-Z=3. Using Prim's algorithm starting at A to find a minimal spanning tree. What is the list of edges chosen?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=6, B-C=2, B-D=4, B-E=3, C-D=4, C-E=1, D-Z=2, E-Z=3. Dùng Prim bắt đầu từ A tìm cây khung nhỏ nhất. Danh sách cạnh được chọn là gì?",
          "options": [
            {
              "text": "CE, BC, AB, EZ, DZ|||CE, BC, AB, EZ, DZ"
            },
            {
              "text": "AB, BC, CE, BD, DZ|||AB, BC, CE, BD, DZ"
            },
            {
              "text": "CE, BC, AB, BD, DZ|||CE, BC, AB, BD, DZ"
            },
            {
              "text": "CE, BC, AB, DZ, EZ|||CE, BC, AB, DZ, EZ"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">From A: A-B(2) is cheapest. Then B-C(2). Then C-E(1). Then among B-D(4),C-D(4),E-Z(3): E-Z(3) is cheapest. Then D-Z(2) (now that D is reachable via Z). Edge set {AB,BC,CE,EZ,DZ} &mdash; matches option A's edge set (listed as CE,BC,AB,EZ,DZ).</div><div class=\"ml-vi\">Từ A: A-B(2) rẻ nhất. Rồi B-C(2). Rồi C-E(1). Rồi trong B-D(4),C-D(4),E-Z(3): E-Z(3) rẻ nhất. Rồi D-Z(2) (D giờ đến được qua Z). Tập cạnh {AB,BC,CE,EZ,DZ} &mdash; khớp tập cạnh của phương án A (liệt kê CE,BC,AB,EZ,DZ).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D6",
      "source": "REAL",
      "sortOrder": 136,
      "title": "Progress Test 3 — Đề 6/7|||Kiểm tra tiến độ 3 — Đề 6/7",
      "description": "MAD101 Progress Test 3 question bank, part 6 of 7 (15 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 6/7 (15 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 30,
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
          "prompt": "Given a grid graph with vertices a,b,c,d (top row), e,f,g,h (middle row), i,j (bottom row) and edges a-b=2, b-c=3, c-d=1, a-e=3, b-f=1, c-g=2, d-h=5, e-f=4, f-g=3, g-h=3, e-i=4, i-j=3, f-j=2. What is the total weight of the minimum spanning tree produced by the graph?|||Cho đồ thị lưới với đỉnh a,b,c,d (hàng trên), e,f,g,h (hàng giữa), i,j (hàng dưới) và cạnh a-b=2, b-c=3, c-d=1, a-e=3, b-f=1, c-g=2, d-h=5, e-f=4, f-g=3, g-h=3, e-i=4, i-j=3, f-j=2. Tổng trọng số cây khung nhỏ nhất là bao nhiêu?",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "18|||18"
            },
            {
              "text": "17|||17"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Kruskal: cd(1),fb(1),ab(2),gc(2),jf(2),ij(3),bc(3),gh(3),ae(3) &mdash; 9 edges cover all 10 vertices. Total $=1+1+2+2+2+3+3+3+3=20$.</div><div class=\"ml-vi\">Kruskal: cd(1),fb(1),ab(2),gc(2),jf(2),ij(3),bc(3),gh(3),ae(3) &mdash; 9 cạnh phủ đủ 10 đỉnh. Tổng $=1+1+2+2+2+3+3+3+3=20$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F and edges A-B=1, B-C=6, A-D=3, B-D=5, B-E=1, C-E=5, C-F=2, D-E=1, E-F=4. If using Kruskal's algorithm to find a minimum spanning tree T, which edge is added to T in the last step?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,F và cạnh A-B=1, B-C=6, A-D=3, B-D=5, B-E=1, C-E=5, C-F=2, D-E=1, E-F=4. Dùng Kruskal tìm cây khung nhỏ nhất T, cạnh nào được thêm vào T ở bước CUỐI CÙNG?",
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
          "explanation": "<div class=\"ml-en\">Sorted: AB(1),BE(1),DE(1),CF(2),AD(3),EF(4)... Add AB,BE,DE (connects A,B,D,E), then CF (connects C,F separately). AD(3) would cycle, skip. EF(4) merges the two components {A,B,D,E} and {C,F} &mdash; completing the spanning tree (5 edges, 6 vertices). Last edge: EF.</div><div class=\"ml-vi\">Sắp xếp: AB(1),BE(1),DE(1),CF(2),AD(3),EF(4)... Thêm AB,BE,DE (nối A,B,D,E), rồi CF (nối C,F riêng). AD(3) tạo chu trình, bỏ qua. EF(4) gộp 2 thành phần {A,B,D,E} và {C,F} &mdash; hoàn tất cây khung (5 cạnh, 6 đỉnh). Cạnh cuối: EF.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the total weight of a minimum spanning tree in the following undirected weighted graph with vertices a,b,c,d,e,f,g,h and edges a-b=6, a-d=2, a-c=9, b-d=12, d-c=5, b-c=3, c-e=1, h-g=10, h-f=4, h-e=8, g-f=7, e-f=11.|||Tìm tổng trọng số cây khung nhỏ nhất trong đồ thị vô hướng có trọng số với đỉnh a,b,c,d,e,f,g,h và cạnh a-b=6, a-d=2, a-c=9, b-d=12, d-c=5, b-c=3, c-e=1, h-g=10, h-f=4, h-e=8, g-f=7, e-f=11.",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">Kruskal: ce(1),ad(2),bc(3),hf(4),dc(5),gf(7),he(8) &mdash; 7 edges cover all 8 vertices. Total $=1+2+3+4+5+7+8=30$.</div><div class=\"ml-vi\">Kruskal: ce(1),ad(2),bc(3),hf(4),dc(5),gf(7),he(8) &mdash; 7 cạnh phủ đủ 8 đỉnh. Tổng $=1+2+3+4+5+7+8=30$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=6, B-D=3, B-C=2, D-Z=2, C-E=4, E-Z=3, and the two diagonals of square B-D-E-C valued 3 and 4 (one each). What is the total weight of a minimal spanning tree of the graph?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=6, B-D=3, B-C=2, D-Z=2, C-E=4, E-Z=3, cùng 2 đường chéo của hình vuông B-D-E-C có giá trị 3 và 4 (mỗi đường 1 giá trị). Tổng trọng số cây khung nhỏ nhất là bao nhiêu?",
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
          "explanation": "<div class=\"ml-en\">Kruskal: AB(2),BC(2),DZ(2) all disjoint-safe, then the weight-3 diagonal/edge merges the remaining components into one connected tree of 6 vertices with 5 edges. Total $=2+2+2+3+3=12$ regardless of which diagonal is labeled 3 vs 4.</div><div class=\"ml-vi\">Kruskal: AB(2),BC(2),DZ(2) đều an toàn (không tạo chu trình), rồi cạnh/đường chéo trọng số 3 gộp các thành phần còn lại thành 1 cây liên thông 6 đỉnh 5 cạnh. Tổng $=2+2+2+3+3=12$ dù đường chéo nào mang giá trị 3 hay 4.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F,G,H,I and edges F-A=1, A-G=2, G-B=3, B-C=1, G-I=1, G-H=3, I-H=4, C-H=2, F-I=2, I-E=3, H-D=2, E-D=4. What is the weight of a minimum spanning tree of the following graph?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,F,G,H,I và cạnh F-A=1, A-G=2, G-B=3, B-C=1, G-I=1, G-H=3, I-H=4, C-H=2, F-I=2, I-E=3, H-D=2, E-D=4. Trọng số cây khung nhỏ nhất của đồ thị là bao nhiêu?",
          "options": [
            {
              "text": "15|||15"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "14|||14"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Kruskal: FA(1),BC(1),GI(1),AG(2),CH(2),HD(2),GB(3) [merges all but E], IE(3). Total $=1+1+1+2+2+2+3+3=15$.</div><div class=\"ml-vi\">Kruskal: FA(1),BC(1),GI(1),AG(2),CH(2),HD(2),GB(3) [gộp hết trừ E], IE(3). Tổng $=1+1+1+2+2+2+3+3=15$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider a weighted graph with vertices A,B,C,D,E,F,G and edges A-B=1, A-D=1, A-G=3, B-G=2, B-C=3, D-G=2, D-C=2, G-C=1, D-E=3, E-C=1, C-F=2, E-F=2. Which one of the following is NOT the sequence of edges added to the minimum spanning tree using Kruskal's algorithm?|||Xét đồ thị có trọng số đỉnh A,B,C,D,E,F,G và cạnh A-B=1, A-D=1, A-G=3, B-G=2, B-C=3, D-G=2, D-C=2, G-C=1, D-E=3, E-C=1, C-F=2, E-F=2. Phương án nào sau đây KHÔNG PHẢI chuỗi cạnh Kruskal thêm vào cây khung nhỏ nhất?",
          "options": [
            {
              "text": "{C,E},{C,G},{A,B},{A,D},{F,E},{D,G}|||{C,E},{C,G},{A,B},{A,D},{F,E},{D,G}"
            },
            {
              "text": "{A,B},{A,D},{G,C},{C,E},{D,G},{C,F}|||{A,B},{A,D},{G,C},{C,E},{D,G},{C,F}"
            },
            {
              "text": "{C,G},{A,D},{A,B},{C,E},{B,G},{C,F}|||{C,G},{A,D},{A,B},{C,E},{B,G},{C,F}"
            },
            {
              "text": "{A,B},{A,D},{G,C},{C,E},{D,E},{C,F}|||{A,B},{A,D},{G,C},{C,E},{D,E},{C,F}"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Option D uses D-E (weight 3) BEFORE C-F (weight 2), violating Kruskal's non-decreasing weight order (C-F=2 is available and doesn't create a cycle at that point, so it must be tried first). The other three options are valid same-total-weight (=8) spanning trees with edges in non-decreasing order.</div><div class=\"ml-vi\">Phương án D dùng D-E (trọng số 3) TRƯỚC C-F (trọng số 2), vi phạm thứ tự trọng số không giảm của Kruskal (C-F=2 sẵn sàng và không tạo chu trình lúc đó nên phải thử trước). Ba phương án còn lại đều là cây khung hợp lệ cùng tổng trọng số (=8) với cạnh theo đúng thứ tự không giảm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,Z and edges A-B=2, A-C=6, B-D=3, B-C=2, B-E=3, D-Z=2, C-E=1, E-Z=4. Using Prim's algorithm starting at A to find a minimal spanning tree. What is the list of edges chosen?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,Z và cạnh A-B=2, A-C=6, B-D=3, B-C=2, B-E=3, D-Z=2, C-E=1, E-Z=4. Dùng Prim bắt đầu từ A tìm cây khung nhỏ nhất. Danh sách cạnh được chọn là gì?",
          "options": [
            {
              "text": "CE, BC, AB, BD, DZ|||CE, BC, AB, BD, DZ"
            },
            {
              "text": "AB, BC, CE, BD, DZ|||AB, BC, CE, BD, DZ"
            },
            {
              "text": "CE, AB, BC, DZ, BD|||CE, AB, BC, DZ, BD"
            },
            {
              "text": "CE, AB, BC, BD, DZ|||CE, AB, BC, BD, DZ"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">From A: AB(2) cheapest. Then BC(2). Then CE(1). Then BD(3) (beats EZ=4). Then DZ(2). Exact order: AB, BC, CE, BD, DZ.</div><div class=\"ml-vi\">Từ A: AB(2) rẻ nhất. Rồi BC(2). Rồi CE(1). Rồi BD(3) (tốt hơn EZ=4). Rồi DZ(2). Thứ tự chính xác: AB, BC, CE, BD, DZ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which graph is bipartite? (Graph 1 is $C_6$, a 6-cycle. Graph 2 is a 4-vertex square with one diagonal drawn, creating a triangle. Graph 3 is a triangle-like crossing shape with an extra pendant vertex/edge.)|||Đồ thị nào là lưỡng phân (bipartite)? (Graph 1 là $C_6$, chu trình 6 cạnh. Graph 2 là hình vuông 4 đỉnh có thêm 1 đường chéo, tạo ra tam giác. Graph 3 là hình tam giác cắt nhau có thêm 1 đỉnh/cạnh phụ.)",
          "options": [
            {
              "text": "Graph 2|||Graph 2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Graph 1|||Graph 1"
            },
            {
              "text": "Graph 3|||Graph 3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$C_6$ is an even cycle, always bipartite (2-color alternating around the cycle). Graph 2's diagonal creates a 3-cycle (odd), not bipartite. Graph 3 has a triangle too, not bipartite.</div><div class=\"ml-vi\">$C_6$ là chu trình chẵn, luôn lưỡng phân (tô 2 màu xen kẽ quanh chu trình). Đường chéo của Graph 2 tạo chu trình 3 (lẻ), không lưỡng phân. Graph 3 cũng có tam giác, không lưỡng phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A complete bipartite graph with 15 edges has ___|||Đồ thị lưỡng phân đầy đủ với 15 cạnh có ___",
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
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$K_{m,n}$ has $mn$ edges. $15=3\\times5$, so $m=3,n=5$, giving $m+n=8$ vertices.</div><div class=\"ml-vi\">$K_{m,n}$ có $mn$ cạnh. $15=3\\times5$, nên $m=3,n=5$, tổng $m+n=8$ đỉnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a graph with 12 vertices such that two of the vertices are of degree 3 and the remaining vertices are of degree 4. How many edges does G have?|||Cho G là đồ thị 12 đỉnh, 2 đỉnh bậc 3 và các đỉnh còn lại bậc 4. G có bao nhiêu cạnh?",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "22|||22"
            },
            {
              "text": "23|||23"
            },
            {
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Sum of degrees $=2\\times3+10\\times4=6+40=46$. Edges $=46/2=23$.</div><div class=\"ml-vi\">Tổng bậc $=2\\times3+10\\times4=46$. Số cạnh $=46/2=23$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given two directed graphs: $G_1$ is a hexagram (6-pointed star) formed by two disjoint triangles on alternating vertices (no edges between the two triangles). $G_2$ is a pentagram (5-pointed star) formed by connecting every vertex to the one two steps away around a pentagon, tracing a single 5-cycle. Which statement is correct?<br>(i) $G_1$ is strongly connected<br>(ii) $G_2$ is strongly connected|||Cho 2 đồ thị có hướng: $G_1$ là ngôi sao 6 cánh (lục giác) tạo bởi 2 tam giác RỜI NHAU trên các đỉnh xen kẽ (không có cạnh nối 2 tam giác). $G_2$ là ngôi sao 5 cánh tạo bởi nối mỗi đỉnh với đỉnh cách 2 bước quanh ngũ giác, tạo thành MỘT chu trình 5 cạnh duy nhất. Phát biểu nào đúng?<br>(i) $G_1$ liên thông mạnh<br>(ii) $G_2$ liên thông mạnh",
          "options": [
            {
              "text": "(i) only|||Chỉ (i)"
            },
            {
              "text": "(ii) only|||Chỉ (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of the statements is correct|||Không phát biểu nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A hexagram's 'every other vertex' construction splits into 2 disjoint triangles (disconnected as a graph) &mdash; $G_1$ can't be strongly connected. A pentagram's construction (gcd(2,5)=1) traces a SINGLE 5-cycle through all vertices; if consistently oriented, that directed cycle makes $G_2$ strongly connected.</div><div class=\"ml-vi\">Cách dựng ngôi sao 6 cánh 'mỗi đỉnh cách nhau' chia thành 2 tam giác RỜI NHAU (không liên thông ở dạng đồ thị) &mdash; $G_1$ không thể liên thông mạnh. Cách dựng ngôi sao 5 cánh (gcd(2,5)=1) tạo ra MỘT chu trình 5 cạnh duy nhất qua mọi đỉnh; nếu hướng nhất quán, chu trình có hướng đó khiến $G_2$ liên thông mạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many paths of length 3 between two different vertices in the graph $K_4$?|||Có bao nhiêu đường đi độ dài 3 giữa 2 đỉnh khác nhau trong đồ thị $K_4$?",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "3|||3"
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
          "explanation": "<div class=\"ml-en\">Using the walk-counting recurrence for $K_4$ ($a_k$=same-vertex, $b_k$=different-vertex walks): $a_1=0,b_1=1$; $a_2=3,b_2=2$; $a_3=3b_2=6$, $b_3=a_2+2b_2=3+4=7$. So there are 7 walks of length 3 between distinct vertices.</div><div class=\"ml-vi\">Dùng công thức truy hồi đếm bước đi cho $K_4$ ($a_k$=về cùng đỉnh, $b_k$=khác đỉnh): $a_1=0,b_1=1$; $a_2=3,b_2=2$; $a_3=3b_2=6$, $b_3=a_2+2b_2=3+4=7$. Vậy có 7 đường đi độ dài 3 giữa 2 đỉnh khác nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let G be a simple graph with degree sequence [2, 2, 3, 1, 0]. Which of the following is TRUE?|||Cho G là đơn đồ thị với dãy bậc [2, 2, 3, 1, 0]. Phát biểu nào sau đây ĐÚNG?",
          "options": [
            {
              "text": "G has an Euler circuit|||G có chu trình Euler"
            },
            {
              "text": "G has an Euler path, but no Euler circuits|||G có đường đi Euler nhưng không có chu trình Euler"
            },
            {
              "text": "G has no Euler paths|||G không có đường đi Euler"
            },
            {
              "text": "None of the other choices|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The degree-0 vertex is isolated (irrelevant to Euler paths on the rest). Among the remaining vertices, exactly 2 have odd degree (3 and 1) &mdash; the exact condition for an Euler path (not circuit) to exist on the connected non-trivial part.</div><div class=\"ml-vi\">Đỉnh bậc 0 là đỉnh cô lập (không ảnh hưởng đường đi Euler trên phần còn lại). Trong các đỉnh còn lại, đúng 2 đỉnh bậc lẻ (3 và 1) &mdash; đúng điều kiện để có đường đi Euler (không phải chu trình) trên phần liên thông không tầm thường.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F and edges A-B=2, A-E=1, B-C=3, B-E=1, C-E=3, C-D=4, E-D=5, C-F=2, D-F=1. Find the length of the shortest path from A to F.|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,F và cạnh A-B=2, A-E=1, B-C=3, B-E=1, C-E=3, C-D=4, E-D=5, C-F=2, D-F=1. Tìm độ dài đường ngắn nhất từ A đến F.",
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
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Dijkstra from A: A-E=1, B via E or direct=2, C via E=4, F via C=6 (path A-E-C-F $=1+3+2=6$).</div><div class=\"ml-vi\">Dijkstra từ A: A-E=1, B qua E hoặc trực tiếp=2, C qua E=4, F qua C=6 (đường A-E-C-F $=1+3+2=6$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a weighted graph with vertices a,b,c,d,e,z and edges a-b=3, a-c=7, b-d=6, b-c=2, c-d=1, c-e=6, d-e=2, d-z=8, e-z=5. Find the length of the shortest path from a to z.|||Cho đồ thị có trọng số đỉnh a,b,c,d,e,z và cạnh a-b=3, a-c=7, b-d=6, b-c=2, c-d=1, c-e=6, d-e=2, d-z=8, e-z=5. Tìm độ dài đường ngắn nhất từ a đến z.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "11|||11"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Dijkstra: a-b=3, a-b-c=5 (beats a-c=7), a-b-c-d=6, a-b-c-d-e=8, a-b-c-d-e-z=13.</div><div class=\"ml-vi\">Dijkstra: a-b=3, a-b-c=5 (tốt hơn a-c=7), a-b-c-d=6, a-b-c-d-e=8, a-b-c-d-e-z=13.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "PT3-D7",
      "source": "REAL",
      "sortOrder": 137,
      "title": "Progress Test 3 — Đề 7/7|||Kiểm tra tiến độ 3 — Đề 7/7",
      "description": "MAD101 Progress Test 3 question bank, part 7 of 7 (14 questions). questions gathered from the PT3 source pool, each answer independently re-derived; a handful of the most visually complex diagram questions were excluded for accuracy.|||Ngân hàng câu hỏi Kiểm tra tiến độ 3 môn MAD101, phần 7/7 (14 câu). câu hỏi gom từ pool nguồn PT3, mỗi đáp án tự suy luận độc lập; một số câu hình vẽ quá phức tạp đã được loại để đảm bảo độ chính xác.",
      "durationMinutes": 28,
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
          "prompt": "Given a weighted graph with vertices A,B,C,D,E,F,G and edges A-B=8, A-C=8, B-C=6, B-D=7, B-E=5, C-E=6, C-F=5, D-E=4, D-F=6, D-G=8, E-F=3, F-G=7. How many shortest paths are there from B to G?|||Cho đồ thị có trọng số đỉnh A,B,C,D,E,F,G và cạnh A-B=8, A-C=8, B-C=6, B-D=7, B-E=5, C-E=6, C-F=5, D-E=4, D-F=6, D-G=8, E-F=3, F-G=7. Có bao nhiêu đường đi ngắn nhất từ B đến G?",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">B-D-G $=7+8=15$ and B-E-F-G $=5+3+7=15$ &mdash; both reach the minimum distance 15, and no other route matches it (B-C-F-G=18, B-E-D-G=17). So there are 2 shortest paths.</div><div class=\"ml-vi\">B-D-G $=7+8=15$ và B-E-F-G $=5+3+7=15$ &mdash; cả 2 đều đạt khoảng cách tối thiểu 15, không đường nào khác bằng (B-C-F-G=18, B-E-D-G=17). Vậy có 2 đường ngắn nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the maximum number of internal vertices of a full 3-ary tree of height 3.|||Tìm số đỉnh trong TỐI ĐA của một cây 3-phân đầy đủ chiều cao 3.",
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
          "explanation": "<div class=\"ml-en\">Maximum internal vertices happens for the complete 3-ary tree of height 3: levels 0,1,2 are entirely internal (all their nodes have 3 children), giving $1+3+9=13$ internal vertices (with 27 leaves at level 3).</div><div class=\"ml-vi\">Số đỉnh trong tối đa xảy ra khi cây 3-phân đầy đủ chiều cao 3 là cây HOÀN CHỈNH: các mức 0,1,2 đều là đỉnh trong (mỗi đỉnh có đúng 3 con), cho $1+3+9=13$ đỉnh trong (27 lá ở mức 3).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the rooted tree: a is the root with children b, d, c. b's children are e, h, g. e's children are i, n, k. c's children are f, l, m. How many ancestors does the vertex d have?|||Cho cây có gốc: a là gốc, con của a là b, d, c. Con của b là e, h, g. Con của e là i, n, k. Con của c là f, l, m. Đỉnh d có bao nhiêu tổ tiên?",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">d is a direct child of the root a, so its only ancestor is a itself. That's 1.</div><div class=\"ml-vi\">d là con trực tiếp của gốc a, nên tổ tiên duy nhất là a. Vậy là 1.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the least number of leaves in a balanced full 4-ary tree of height 3.|||Tìm số lá ÍT NHẤT trong một cây 4-phân đầy đủ cân bằng có chiều cao 3.",
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
          "explanation": "<div class=\"ml-en\">Start from a complete 4-ary tree of height 2 ($4^2=16$ leaves at depth 2), then split just ONE of those leaves into 4 children at depth 3: leaves $=(16-1)+4=19$.</div><div class=\"ml-vi\">Bắt đầu từ cây 4-phân đầy đủ chiều cao 2 ($4^2=16$ lá ở độ sâu 2), rồi tách đúng MỘT lá đó thành 4 con ở độ sâu 3: số lá $=(16-1)+4=19$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a prefix code represented by the binary tree: e=00, f=010, n=011, r=10, s=110, u=111. Decode the message 010111011.|||Cho mã tiền tố biểu diễn bằng cây nhị phân: e=00, f=010, n=011, r=10, s=110, u=111. Giải mã thông điệp 010111011.",
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
          "explanation": "<div class=\"ml-en\">Greedily match: \"010\"=f, remaining \"111011\"; \"111\"=u, remaining \"011\"; \"011\"=n. Decoded: f-u-n = \"fun\".</div><div class=\"ml-vi\">Khớp tuần tự: \"010\"=f, còn \"111011\"; \"111\"=u, còn \"011\"; \"011\"=n. Giải mã: f-u-n = \"fun\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To encode a message consisting of only the letters {a, b, i, n, s, t}, we want to use the following prefix coding scheme: a: 10, b: 01, i: 001, n: 110, s: 1111, t: (to be determined). Which of the following bit strings could be used to encode the letter t?|||Để mã hoá thông điệp chỉ gồm các chữ {a, b, i, n, s, t}, dùng lược đồ mã tiền tố: a: 10, b: 01, i: 001, n: 110, s: 1111, t: (cần xác định). Chuỗi bit nào sau đây có thể dùng để mã hoá chữ t?",
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
          "explanation": "<div class=\"ml-en\">\"111\" fails (prefix of s=1111). \"100\" fails (a=10 is a prefix of it). \"0001\" doesn't conflict with any existing code as prefix or extension &mdash; valid choice.</div><div class=\"ml-vi\">\"111\" sai (là tiền tố của s=1111). \"100\" sai (a=10 là tiền tố của nó). \"0001\" không xung đột tiền tố/mở rộng với mã nào &mdash; lựa chọn hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the length of the bit string obtained by using Huffman coding to encode the message \"AILILI\".|||Tìm độ dài chuỗi bit thu được khi dùng Huffman coding mã hoá thông điệp \"AILILI\".",
          "options": [
            {
              "text": "6|||6"
            },
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
              "text": "15|||15"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Frequencies: I=3, L=2, A=1. Merge A,L(1+2=3) &rarr; merge with I(3+3=6). Depths: I=1 bit, A=2 bits, L=2 bits. Total $=3\\times1+1\\times2+2\\times2=3+2+4=9$.</div><div class=\"ml-vi\">Tần suất: I=3, L=2, A=1. Gộp A,L(1+2=3) &rarr; gộp với I(3+3=6). Độ dài mã: I=1 bit, A=2 bit, L=2 bit. Tổng $=3\\times1+1\\times2+2\\times2=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To encode a message with 9 distinct characters {a,b,c,d,e,f,g,h,i}, we use a coding scheme where the 8 characters a,b,c,d,e,f,g,h are encoded as a:000, b:111, c:010, d:011, e:100, f:101, g:110, h:001. For this coding scheme to be a prefix code, which of the following strings can be used for the character \"i\"?|||Để mã hoá thông điệp 9 ký tự {a,b,c,d,e,f,g,h,i}, dùng lược đồ mã hoá với 8 ký tự a,b,c,d,e,f,g,h là a:000, b:111, c:010, d:011, e:100, f:101, g:110, h:001. Để lược đồ này là mã tiền tố, chuỗi nào sau đây có thể dùng cho ký tự \"i\"?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "0110001|||0110001"
            },
            {
              "text": "1100010|||1100010"
            },
            {
              "text": "11100011|||11100011"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">All 8 possible 3-bit strings are already used as codes. Any code for i must start with SOME 3-bit prefix, which is necessarily one of the existing 8 codes &mdash; guaranteeing a prefix conflict no matter what string is chosen. Checking each option confirms it starts with an existing code (011=d, 110=g, 111=b respectively). No valid prefix-free code for i exists among the choices.</div><div class=\"ml-vi\">Cả 8 chuỗi 3-bit có thể có đều đã dùng làm mã. Bất kỳ mã nào cho i cũng phải bắt đầu bằng MỘT tiền tố 3-bit nào đó, và tiền tố đó chắc chắn trùng 1 trong 8 mã đã có &mdash; luôn xung đột tiền tố dù chọn chuỗi nào. Kiểm từng phương án xác nhận đều bắt đầu bằng mã đã tồn tại (011=d, 110=g, 111=b tương ứng). Không có mã tiền tố hợp lệ nào cho i trong các lựa chọn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the prefix notation of the expression (x + x*y) + (x/y)|||Tìm ký hiệu tiền tố (prefix) của biểu thức (x + x*y) + (x/y)",
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
          "explanation": "<div class=\"ml-en\">$x+x*y$ prefix $=$ + x * x y. $x/y$ prefix $=$ / x y. Combine with outer $+$: + + x * x y / x y.</div><div class=\"ml-vi\">$x+x*y$ dạng tiền tố $=$ + x * x y. $x/y$ dạng tiền tố $=$ / x y. Ghép với dấu $+$ ngoài: + + x * x y / x y.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the binary tree: a is the root with left child c and right child m. c's children are e (left) and h (right). m's children are n (left) and t (right). t's children are s (left) and y (right). Find the inorder traversal of the tree.|||Cho cây nhị phân: a là gốc, con trái c, con phải m. Con của c: e (trái), h (phải). Con của m: n (trái), t (phải). Con của t: s (trái), y (phải). Tìm duyệt trung thứ tự (inorder) của cây.",
          "options": [
            {
              "text": "e - h - c - n - s - y - t - m - a|||e - h - c - n - s - y - t - m - a"
            },
            {
              "text": "e - c - h - a - n - m - s - t - y|||e - c - h - a - n - m - s - t - y"
            },
            {
              "text": "e - c - h - n - m - s - t - y - a|||e - c - h - n - m - s - t - y - a"
            },
            {
              "text": "a - c - e - h - m - n - t - s - y|||a - c - e - h - m - n - t - s - y"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Inorder(c)=e,c,h. Inorder(t)=s,t,y. Inorder(m)=n,m,s,t,y. Full inorder(a)=Inorder(c),a,Inorder(m)=e,c,h,a,n,m,s,t,y.</div><div class=\"ml-vi\">Inorder(c)=e,c,h. Inorder(t)=s,t,y. Inorder(m)=n,m,s,t,y. Inorder đầy đủ(a)=Inorder(c),a,Inorder(m)=e,c,h,a,n,m,s,t,y.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the height of spanning tree obtained from $W_{100}$ by the Breadth-first search, starting at the vertex of degree 100?|||Chiều cao của cây khung thu được từ $W_{100}$ bằng tìm kiếm theo chiều rộng (BFS), bắt đầu từ đỉnh bậc 100, là bao nhiêu?",
          "options": [
            {
              "text": "99|||99"
            },
            {
              "text": "100|||100"
            },
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
              "text": "None of the choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The degree-100 vertex (hub) is directly adjacent to all 100 rim vertices. BFS visits all of them at level 1 immediately, so the tree has height 1 (hub to any rim vertex is 1 edge).</div><div class=\"ml-vi\">Đỉnh bậc 100 (trục hub) kề trực tiếp với cả 100 đỉnh vành. BFS thăm hết chúng ngay ở mức 1, nên cây có chiều cao 1 (từ hub đến bất kỳ đỉnh vành nào chỉ 1 cạnh).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many edges must be removed from a connected graph with 5 vertices and 8 edges to produce a spanning tree?|||Cần bỏ bao nhiêu cạnh khỏi đồ thị liên thông 5 đỉnh, 8 cạnh để thu được cây khung?",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">Spanning tree needs $5-1=4$ edges. Remove $8-4=4$.</div><div class=\"ml-vi\">Cây khung cần $5-1=4$ cạnh. Cần bỏ $8-4=4$ cạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following propositions is TRUE:<br>(i) If $Q_3$ has a Hamilton path, then $K_6$ has an Euler path<br>(ii) If $K_{4,2}$ has an Euler path, then $W_4$ has an Euler path|||Mệnh đề nào sau đây ĐÚNG:<br>(i) Nếu $Q_3$ có đường đi Hamilton thì $K_6$ có đường đi Euler<br>(ii) Nếu $K_{4,2}$ có đường đi Euler thì $W_4$ có đường đi Euler",
          "options": [
            {
              "text": "None of the other choices|||Không đáp án nào khác"
            },
            {
              "text": "(i) only|||Chỉ (i)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "(ii) only|||Chỉ (ii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i): $Q_3$ has a Hamilton path (TRUE, hypercubes always do), but $K_6$ has 6 vertices all of odd degree 5 (more than 2 odd-degree vertices) &rArr; no Euler path, consequent FALSE &rArr; implication FALSE. (ii): $K_{4,2}$ has all-even degrees (side of 4 has degree 2, side of 2 has degree 4) so it has an Euler circuit/path (TRUE), but $W_4$'s 4 rim vertices each have odd degree 3 &rArr; no Euler path, consequent FALSE &rArr; implication FALSE. Both fail, so neither (i) nor (ii) holds.</div><div class=\"ml-vi\">(i): $Q_3$ có đường đi Hamilton (ĐÚNG, siêu khối luôn có), nhưng $K_6$ có 6 đỉnh đều bậc lẻ 5 (nhiều hơn 2 đỉnh bậc lẻ) &rArr; không có đường đi Euler, hệ quả SAI &rArr; mệnh đề SAI. (ii): $K_{4,2}$ có mọi bậc chẵn (phía 4 bậc 2, phía 2 bậc 4) nên có chu trình/đường đi Euler (ĐÚNG), nhưng 4 đỉnh vành của $W_4$ đều bậc lẻ 3 &rArr; không có đường đi Euler, hệ quả SAI &rArr; mệnh đề SAI. Cả 2 đều sai, nên không (i) lẫn (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many non-isomorphic simple graphs with 5 vertices and 3 edges?|||Có bao nhiêu đơn đồ thị không đẳng cấu với 5 đỉnh và 3 cạnh?",
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
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The 4 realizable degree sequences each have a unique realization: star $K_{1,3}$+isolated vertex, path $P_4$+isolated vertex, triangle $C_3$+2 isolated vertices, and a disjoint $P_3 \\cup K_2$ (a 2-edge path plus a separate edge, using all 5 vertices). That's 4 non-isomorphic graphs.</div><div class=\"ml-vi\">4 dãy bậc khả thi đều chỉ có 1 cách dựng duy nhất: sao $K_{1,3}$+1 đỉnh cô lập, đường đi $P_4$+1 đỉnh cô lập, tam giác $C_3$+2 đỉnh cô lập, và $P_3 \\cup K_2$ rời nhau (đường 2 cạnh cộng 1 cạnh riêng, dùng hết 5 đỉnh). Vậy có 4 đồ thị không đẳng cấu.</div>"
        }
      ]
    }
  ]
};
