// MAE101 — Mathematics for Engineering. Real FE multiple-choice papers,
// transcribed from the school's images; answers + bilingual explanations
// authored here. Math via KaTeX ($...$). Auto-generated from the banks.
export default {
  "course": {
    "courseCode": "MAE101"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "MAE-D1",
      "source": "REAL",
      "sortOrder": 0,
      "title": "Đề 1 — Final Exam|||Đề 1 — Thi cuối kỳ",
      "description": "MAE101 real FE multiple-choice paper, transcribed from the exam images; answers reasoned here. (46 questions)|||Đề trắc nghiệm FE thật môn MAE101, chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (46 câu)",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Math is rendered with formulas — read carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Công thức toán được hiển thị — đọc kỹ. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the horizontal asymptote of $f(x)=\\dfrac{\\sin(x^2)}{x}-1$.|||Tìm tiệm cận ngang của $f(x)=\\dfrac{\\sin(x^2)}{x}-1$.",
          "options": [
            {
              "text": "$y=1$|||$y=1$"
            },
            {
              "text": "$y=0$|||$y=0$"
            },
            {
              "text": "$y=-1$|||$y=-1$"
            },
            {
              "text": "No horizontal asymptotes|||Không có tiệm cận ngang"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">As $x\\to\\pm\\infty$, $\\sin(x^2)$ is bounded and $\\dfrac{\\sin(x^2)}{x}\\to0$, so $f(x)\\to0-1=-1$. Horizontal asymptote $y=-1$.</div><div class=\"ml-vi\">Khi $x\\to\\pm\\infty$, $\\sin(x^2)$ bị chặn nên $\\dfrac{\\sin(x^2)}{x}\\to0$, do đó $f(x)\\to0-1=-1$. Tiệm cận ngang $y=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are true?<br>(i) $\\mathbb{R}^3=\\operatorname{Span}\\{(1,0,0),(0,1,1),(0,0,1)\\}$.<br>(ii) $(3,4,1)$ is a linear combination of $(1,1,1)$ and $(0,1,-1)$.|||Phát biểu nào sau đây đúng?<br>(i) $\\mathbb{R}^3=\\operatorname{Span}\\{(1,0,0),(0,1,1),(0,0,1)\\}$.<br>(ii) $(3,4,1)$ là tổ hợp tuyến tính của $(1,1,1)$ và $(0,1,-1)$.",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "Neither|||Không câu nào"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i) The determinant of the three vectors is $1\\ne0$, so they span $\\mathbb{R}^3$ — TRUE. (ii) Solving $a(1,1,1)+b(0,1,-1)=(3,4,1)$ gives $a=3,b=1$ but then $a-b=2\\ne1$ — contradiction, FALSE. Only (i).</div><div class=\"ml-vi\">(i) Định thức của ba vector bằng $1\\ne0$ nên chúng sinh ra $\\mathbb{R}^3$ — ĐÚNG. (ii) Giải $a(1,1,1)+b(0,1,-1)=(3,4,1)$ được $a=3,b=1$ nhưng khi đó $a-b=2\\ne1$ — mâu thuẫn, SAI. Chỉ (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $A$ is $3\\times 3$ and $\\det(2A^{-1})=-4$, then $\\det A$ is...|||Nếu $A$ là ma trận $3\\times 3$ và $\\det(2A^{-1})=-4$ thì $\\det A$ bằng...",
          "options": [
            {
              "text": "None of the others|||Không câu nào"
            },
            {
              "text": "$1/2$|||$1/2$"
            },
            {
              "text": "$2$|||$2$"
            },
            {
              "text": "$-1/2$|||$-1/2$"
            },
            {
              "text": "$-2$|||$-2$"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\det(2A^{-1})=2^3\\det(A^{-1})=\\dfrac{8}{\\det A}=-4$, so $\\det A=\\dfrac{8}{-4}=-2$.</div><div class=\"ml-vi\">$\\det(2A^{-1})=2^3\\det(A^{-1})=\\dfrac{8}{\\det A}=-4$, suy ra $\\det A=\\dfrac{8}{-4}=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\displaystyle\\int 4x\\sin(2x)\\,dx$.|||Tính $\\displaystyle\\int 4x\\sin(2x)\\,dx$.",
          "options": [
            {
              "text": "$\\sin(2x)+2x\\cos(2x)+C$|||$\\sin(2x)+2x\\cos(2x)+C$"
            },
            {
              "text": "$2\\sin(2x)-2x\\cos(2x)+C$|||$2\\sin(2x)-2x\\cos(2x)+C$"
            },
            {
              "text": "$2\\sin(2x)+2x\\cos(2x)+C$|||$2\\sin(2x)+2x\\cos(2x)+C$"
            },
            {
              "text": "$\\sin(2x)-2x\\cos(2x)+C$|||$\\sin(2x)-2x\\cos(2x)+C$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">By parts with $u=4x,\\ dv=\\sin(2x)dx$: $=-2x\\cos(2x)+2\\int\\cos(2x)dx=-2x\\cos(2x)+\\sin(2x)+C$.</div><div class=\"ml-vi\">Tích phân từng phần $u=4x,\\ dv=\\sin(2x)dx$: $=-2x\\cos(2x)+2\\int\\cos(2x)dx=-2x\\cos(2x)+\\sin(2x)+C$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ be a linear map with $T\\!\\begin{pmatrix}1\\\\1\\\\1\\end{pmatrix}=\\begin{pmatrix}5\\\\1\\end{pmatrix}$ and $T\\!\\begin{pmatrix}-1\\\\1\\\\0\\end{pmatrix}=\\begin{pmatrix}2\\\\0\\end{pmatrix}$. Then $T\\!\\begin{pmatrix}5\\\\-1\\\\2\\end{pmatrix}$ is...<br>(i) $\\begin{pmatrix}4\\\\2\\end{pmatrix}$ (ii) $\\begin{pmatrix}2\\\\4\\end{pmatrix}$ (iii) $\\begin{pmatrix}2\\\\-3\\end{pmatrix}$|||Cho $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ tuyến tính với $T\\!\\begin{pmatrix}1\\\\1\\\\1\\end{pmatrix}=\\begin{pmatrix}5\\\\1\\end{pmatrix}$ và $T\\!\\begin{pmatrix}-1\\\\1\\\\0\\end{pmatrix}=\\begin{pmatrix}2\\\\0\\end{pmatrix}$. Khi đó $T\\!\\begin{pmatrix}5\\\\-1\\\\2\\end{pmatrix}$ bằng...<br>(i) $\\begin{pmatrix}4\\\\2\\end{pmatrix}$ (ii) $\\begin{pmatrix}2\\\\4\\end{pmatrix}$ (iii) $\\begin{pmatrix}2\\\\-3\\end{pmatrix}$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of the others|||Không câu nào"
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
          "explanation": "<div class=\"ml-en\">$(5,-1,2)=2(1,1,1)-3(-1,1,0)$, so $T(5,-1,2)=2(5,1)-3(2,0)=(4,2)$ — answer (i).</div><div class=\"ml-vi\">$(5,-1,2)=2(1,1,1)-3(-1,1,0)$ nên $T(5,-1,2)=2(5,1)-3(2,0)=(4,2)$ — đáp án (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The characteristic polynomial of $A=\\begin{bmatrix}3&-2\\\\1&0\\end{bmatrix}$ is:<br>(i) $(x-2)(x+1)$ (ii) $x^2-3x+2$ (iii) $(x+2)(x+1)$ (iv) $3x^2$|||Đa thức đặc trưng của $A=\\begin{bmatrix}3&-2\\\\1&0\\end{bmatrix}$ là:<br>(i) $(x-2)(x+1)$ (ii) $x^2-3x+2$ (iii) $(x+2)(x+1)$ (iv) $3x^2$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\det(A-xI)=(3-x)(-x)-(-2)(1)=x^2-3x+2$ — answer (ii).</div><div class=\"ml-vi\">$\\det(A-xI)=(3-x)(-x)-(-2)(1)=x^2-3x+2$ — đáp án (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $L$ be the line through $A(1,2,1)$ parallel to the line $x=2-t,\\ y=4+3t,\\ z=2t$. Which of the following points lie in $L$? $P(3,-4,-3),\\ Q(3,6,1)$.|||Cho $L$ là đường thẳng qua $A(1,2,1)$ song song với đường $x=2-t,\\ y=4+3t,\\ z=2t$. Điểm nào sau đây nằm trên $L$? $P(3,-4,-3),\\ Q(3,6,1)$.",
          "options": [
            {
              "text": "Both $P$ and $Q$|||Cả $P$ và $Q$"
            },
            {
              "text": "Only $P$|||Chỉ $P$"
            },
            {
              "text": "Only $Q$|||Chỉ $Q$"
            },
            {
              "text": "None of $P$ and $Q$|||Không điểm nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Direction $(-1,3,2)$, so $L:(1-t,2+3t,1+2t)$. For $P$: $1-t=3\\Rightarrow t=-2\\Rightarrow(3,-4,-3)$ ✓. For $Q$: $t=-2$ gives $y=-4\\ne6$ ✗. Only $P$.</div><div class=\"ml-vi\">Vector chỉ phương $(-1,3,2)$ nên $L:(1-t,2+3t,1+2t)$. Với $P$: $1-t=3\\Rightarrow t=-2\\Rightarrow(3,-4,-3)$ ✓. Với $Q$: $t=-2$ cho $y=-4\\ne6$ ✗. Chỉ $P$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the slope of the line passing through $(1,2)$ and $(3,-8)$?|||Hệ số góc của đường thẳng qua $(1,2)$ và $(3,-8)$ là?",
          "options": [
            {
              "text": "$-5$|||$-5$"
            },
            {
              "text": "$3$|||$3$"
            },
            {
              "text": "$-8/3$|||$-8/3$"
            },
            {
              "text": "$3/2$|||$3/2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Slope $=\\dfrac{-8-2}{3-1}=\\dfrac{-10}{2}=-5$.</div><div class=\"ml-vi\">Hệ số góc $=\\dfrac{-8-2}{3-1}=\\dfrac{-10}{2}=-5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Two cars start moving from the same point. One travels south at 28 mi/h and the other travels west at 70 mi/h. At what rate is the distance between the cars increasing 5 hours later? Round to the nearest hundredth.|||Hai xe khởi hành từ cùng một điểm. Một xe đi về phía nam với 28 mi/h, xe kia đi về phía tây với 70 mi/h. Sau 5 giờ, khoảng cách giữa hai xe tăng với tốc độ bao nhiêu? Làm tròn đến phần trăm.",
          "options": [
            {
              "text": "75.39 mi/h|||75.39 mi/h"
            },
            {
              "text": "75.49 mi/h|||75.49 mi/h"
            },
            {
              "text": "75.38 mi/h|||75.38 mi/h"
            },
            {
              "text": "75.42 mi/h|||75.42 mi/h"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "76.4 mi/h|||76.4 mi/h"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Distance $D=t\\sqrt{28^2+70^2}=t\\sqrt{5684}$, so $\\dfrac{dD}{dt}=\\sqrt{5684}\\approx75.39$ mi/h (constant).</div><div class=\"ml-vi\">Khoảng cách $D=t\\sqrt{28^2+70^2}=t\\sqrt{5684}$ nên $\\dfrac{dD}{dt}=\\sqrt{5684}\\approx75.39$ mi/h (không đổi).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all numbers $a$ such that the following matrix has rank 2. $\\begin{bmatrix}-1&4&5&3\\\\2&3&-2&6\\\\3&10&a&15\\end{bmatrix}$|||Tìm tất cả số $a$ để ma trận sau có hạng bằng 2. $\\begin{bmatrix}-1&4&5&3\\\\2&3&-2&6\\\\3&10&a&15\\end{bmatrix}$",
          "options": [
            {
              "text": "All numbers but $-1$|||Mọi số trừ $-1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "All numbers but $1$|||Mọi số trừ $1$"
            },
            {
              "text": "$1$|||$1$"
            },
            {
              "text": "$-1$|||$-1$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Row 3 $=$ Row1 $+2\\cdot$Row2 requires the third column: $5+2(-2)=1$, so $a=1$ makes rank $2$; otherwise rank $3$.</div><div class=\"ml-vi\">Hàng 3 $=$ Hàng1 $+2\\cdot$Hàng2 đòi hỏi cột thứ ba: $5+2(-2)=1$, nên $a=1$ cho hạng $2$; ngược lại hạng $3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the shortest distance between two parallel lines<br>$(L_1): [x,y,z]=[-1,1,2]+t[2,1,1]$<br>$(L_2): [x,y,z]=[0,3,1]+t[2,1,1]$<br>(i) $\\sqrt{3}$ (ii) $\\dfrac{3\\sqrt{2}}{2}$ (iii) $\\dfrac{3\\sqrt{2}}{4}$ (iv) $\\dfrac{3}{2}$|||Tìm khoảng cách ngắn nhất giữa hai đường thẳng song song<br>$(L_1): [x,y,z]=[-1,1,2]+t[2,1,1]$<br>$(L_2): [x,y,z]=[0,3,1]+t[2,1,1]$<br>(i) $\\sqrt{3}$ (ii) $\\dfrac{3\\sqrt{2}}{2}$ (iii) $\\dfrac{3\\sqrt{2}}{4}$ (iv) $\\dfrac{3}{2}$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
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
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$w=(1,2,-1),\\ d=(2,1,1)$. $w\\times d=(3,-3,-3)$, $|w\\times d|=3\\sqrt3$, $|d|=\\sqrt6$. Distance $=\\dfrac{3\\sqrt3}{\\sqrt6}=\\dfrac{3\\sqrt2}{2}$ — (ii).</div><div class=\"ml-vi\">$w=(1,2,-1),\\ d=(2,1,1)$. $w\\times d=(3,-3,-3)$, $|w\\times d|=3\\sqrt3$, $|d|=\\sqrt6$. Khoảng cách $=\\dfrac{3\\sqrt3}{\\sqrt6}=\\dfrac{3\\sqrt2}{2}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int 2x^2\\sqrt[4]{7+3x^3}\\,dx$<br>(i) $2(7+3x^3)^{5/4}+C$ (ii) $\\dfrac{8}{45}(7+3x^3)^{5/4}+C$ (iii) $\\dfrac{8}{5}(7+3x^3)^{5/4}+C$ (iv) $-\\dfrac{4}{3}(7+3x^3)^{-3/4}+C$|||Tính $\\displaystyle\\int 2x^2\\sqrt[4]{7+3x^3}\\,dx$<br>(i) $2(7+3x^3)^{5/4}+C$ (ii) $\\dfrac{8}{45}(7+3x^3)^{5/4}+C$ (iii) $\\dfrac{8}{5}(7+3x^3)^{5/4}+C$ (iv) $-\\dfrac{4}{3}(7+3x^3)^{-3/4}+C$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Let $u=7+3x^3,\\ du=9x^2dx$. $\\int2x^2u^{1/4}dx=\\dfrac29\\int u^{1/4}du=\\dfrac{8}{45}u^{5/4}+C$ — (ii).</div><div class=\"ml-vi\">Đặt $u=7+3x^3,\\ du=9x^2dx$. $\\int2x^2u^{1/4}dx=\\dfrac29\\int u^{1/4}du=\\dfrac{8}{45}u^{5/4}+C$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Simplify the quotient $\\dfrac{f(x+h)-f(x)}{h}$ for $f(x)=\\dfrac{1}{x}$.<br>(i) $\\dfrac{-1}{(x-h)x}$ (ii) $\\dfrac{1}{(x+h)x}$ (iii) $\\dfrac{-1}{(x+h)x}$ (iv) $\\dfrac{-1}{(x+h)(x-h)}$|||Rút gọn $\\dfrac{f(x+h)-f(x)}{h}$ với $f(x)=\\dfrac{1}{x}$.<br>(i) $\\dfrac{-1}{(x-h)x}$ (ii) $\\dfrac{1}{(x+h)x}$ (iii) $\\dfrac{-1}{(x+h)x}$ (iv) $\\dfrac{-1}{(x+h)(x-h)}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{1}{h}\\!\\left(\\dfrac{1}{x+h}-\\dfrac1x\\right)=\\dfrac{1}{h}\\cdot\\dfrac{-h}{(x+h)x}=\\dfrac{-1}{(x+h)x}$ — (iii).</div><div class=\"ml-vi\">$\\dfrac{1}{h}\\!\\left(\\dfrac{1}{x+h}-\\dfrac1x\\right)=\\dfrac{1}{h}\\cdot\\dfrac{-h}{(x+h)x}=\\dfrac{-1}{(x+h)x}$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}^{\\,n}$. If $n=7$ then $A=?$<br>(i) $\\begin{pmatrix}1&7\\\\1&1\\end{pmatrix}$ (ii) $\\begin{pmatrix}1&7\\\\0&1\\end{pmatrix}$ (iii) $\\begin{pmatrix}1&1\\\\7&7\\end{pmatrix}$|||Cho $A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}^{\\,n}$. Nếu $n=7$ thì $A=?$<br>(i) $\\begin{pmatrix}1&7\\\\1&1\\end{pmatrix}$ (ii) $\\begin{pmatrix}1&7\\\\0&1\\end{pmatrix}$ (iii) $\\begin{pmatrix}1&1\\\\7&7\\end{pmatrix}$",
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
            3
          ],
          "explanation": "<div class=\"ml-en\">For $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$, $A^n=\\begin{pmatrix}1&n\\\\0&1\\end{pmatrix}$, so $A^7=\\begin{pmatrix}1&7\\\\0&1\\end{pmatrix}$ — (ii).</div><div class=\"ml-vi\">Với $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ thì $A^n=\\begin{pmatrix}1&n\\\\0&1\\end{pmatrix}$, nên $A^7=\\begin{pmatrix}1&7\\\\0&1\\end{pmatrix}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true for the system<br>$\\begin{cases}x+14y-11z=-7\\\\3x-8y+8z=5\\\\10x-10y+13z=91\\end{cases}$|||Phát biểu nào đúng cho hệ<br>$\\begin{cases}x+14y-11z=-7\\\\3x-8y+8z=5\\\\10x-10y+13z=91\\end{cases}$",
          "options": [
            {
              "text": "It has infinitely many solutions with 2 free parameters.|||Có vô số nghiệm với 2 tham số tự do."
            },
            {
              "text": "It has the unique solution $(3;-1;-1)$.|||Có nghiệm duy nhất $(3;-1;-1)$."
            },
            {
              "text": "It has the trivial solution.|||Có nghiệm tầm thường."
            },
            {
              "text": "It is inconsistent.|||Vô nghiệm (không tương thích)."
            },
            {
              "text": "It has infinitely many solutions with 1 free parameter.|||Có vô số nghiệm với 1 tham số tự do."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Eliminate $x$: $R2-3R1$ and $R3-10R1$ give $-50y+41z=26$ and $-150y+123z=161$. But $3(-50y+41z)=-150y+123z=78\\ne161$ — contradiction, so the system is inconsistent.</div><div class=\"ml-vi\">Khử $x$: $R2-3R1$ và $R3-10R1$ cho $-50y+41z=26$ và $-150y+123z=161$. Nhưng $3(-50y+41z)=-150y+123z=78\\ne161$ — mâu thuẫn, hệ vô nghiệm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the volume of the tetrahedron with vertices $(0,0,0),(1,2,3),(2,1,3),$ and $(3,1,2)$.|||Tìm thể tích tứ diện có các đỉnh $(0,0,0),(1,2,3),(2,1,3),$ và $(3,1,2)$.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "7/3|||7/3"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$V=\\dfrac16\\left|\\det\\begin{bmatrix}1&2&3\\\\2&1&3\\\\3&1&2\\end{bmatrix}\\right|=\\dfrac16|6|=1$.</div><div class=\"ml-vi\">$V=\\dfrac16\\left|\\det\\begin{bmatrix}1&2&3\\\\2&1&3\\\\3&1&2\\end{bmatrix}\\right|=\\dfrac16|6|=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the critical numbers of the function $g(x)=\\sqrt[3]{x^2-x}$.|||Tìm các số tới hạn (critical numbers) của hàm $g(x)=\\sqrt[3]{x^2-x}$.",
          "options": [
            {
              "text": "0 and 1|||0 và 1"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "0, 1 and 1/2|||0, 1 và 1/2"
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
            2
          ],
          "explanation": "<div class=\"ml-en\">$g'(x)=\\dfrac{2x-1}{3(x^2-x)^{2/3}}$. Zero at $x=\\tfrac12$; undefined (but $g$ defined) at $x=0,1$. Critical numbers $0,1,\\tfrac12$.</div><div class=\"ml-vi\">$g'(x)=\\dfrac{2x-1}{3(x^2-x)^{2/3}}$. Bằng $0$ tại $x=\\tfrac12$; không xác định (nhưng $g$ xác định) tại $x=0,1$. Các số tới hạn $0,1,\\tfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all numbers $b$ such that the following system has infinitely many solutions:<br>$\\begin{cases}x-2y+bz=3\\\\3x+2z=2\\\\5x+2y=1\\end{cases}$|||Tìm tất cả số $b$ để hệ sau có vô số nghiệm:<br>$\\begin{cases}x-2y+bz=3\\\\3x+2z=2\\\\5x+2y=1\\end{cases}$",
          "options": [
            {
              "text": "Any numbers but $-3$|||Mọi số trừ $-3$"
            },
            {
              "text": "Any numbers but 4|||Mọi số trừ 4"
            },
            {
              "text": "$-3$|||$-3$"
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
          "explanation": "<div class=\"ml-en\">$\\det=6b-24=0\\Rightarrow b=4$. At $b=4$ substitution gives $3=3$ (always true), so infinitely many solutions. Answer $b=4$.</div><div class=\"ml-vi\">$\\det=6b-24=0\\Rightarrow b=4$. Với $b=4$, thế vào được $3=3$ (luôn đúng) nên hệ có vô số nghiệm. Đáp án $b=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Estimate the area under the graph of $f(x)=x^2-9$ from $x=3$ to $x=5$ using four approximating rectangles and right endpoints.|||Ước lượng diện tích dưới đồ thị $f(x)=x^2-9$ từ $x=3$ đến $x=5$ dùng bốn hình chữ nhật xấp xỉ và mút phải.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "19.45|||19.45"
            },
            {
              "text": "18.75|||18.75"
            },
            {
              "text": "19.75|||19.75"
            },
            {
              "text": "18.45|||18.45"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=0.5$; right endpoints $3.5,4,4.5,5$ give $f=3.25,7,11.25,16$. Sum $\\times0.5=37.5\\times0.5=18.75$.</div><div class=\"ml-vi\">$\\Delta x=0.5$; mút phải $3.5,4,4.5,5$ cho $f=3.25,7,11.25,16$. Tổng $\\times0.5=37.5\\times0.5=18.75$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_0^3 \\dfrac{1}{\\sqrt{3-x}}\\,dx$<br>(i) diverges (ii) $2\\sqrt{3}$ (iii) $-2\\sqrt{3}$ (iv) $4\\sqrt{3}$|||Tính $\\displaystyle\\int_0^3 \\dfrac{1}{\\sqrt{3-x}}\\,dx$<br>(i) phân kỳ (ii) $2\\sqrt{3}$ (iii) $-2\\sqrt{3}$ (iv) $4\\sqrt{3}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
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
          "explanation": "<div class=\"ml-en\">Improper at $x=3$. With $u=3-x$: $\\int_0^3(3-x)^{-1/2}dx=\\big[-2\\sqrt{3-x}\\big]_0^3=0+2\\sqrt3=2\\sqrt3$ — converges to (ii).</div><div class=\"ml-vi\">Suy rộng tại $x=3$. Với $u=3-x$: $\\int_0^3(3-x)^{-1/2}dx=\\big[-2\\sqrt{3-x}\\big]_0^3=0+2\\sqrt3=2\\sqrt3$ — hội tụ, (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $dy/dx$ by implicit differentiation if $e^{x+y}+y=6$.<br>(i) $\\dfrac{e^{x+y}}{1+e^{x+y}}$ (ii) $\\dfrac{-e^{x+y}}{1+e^{x+y}}$ (iii) $\\dfrac{-e^{x+y}}{1-e^{x+y}}$ (iv) $\\dfrac{e^{x+y}}{1-e^{x+y}}$|||Tìm $dy/dx$ bằng đạo hàm ẩn nếu $e^{x+y}+y=6$.<br>(i) $\\dfrac{e^{x+y}}{1+e^{x+y}}$ (ii) $\\dfrac{-e^{x+y}}{1+e^{x+y}}$ (iii) $\\dfrac{-e^{x+y}}{1-e^{x+y}}$ (iv) $\\dfrac{e^{x+y}}{1-e^{x+y}}$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of them|||Không câu nào"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$e^{x+y}(1+y')+y'=0\\Rightarrow y'(e^{x+y}+1)=-e^{x+y}\\Rightarrow y'=\\dfrac{-e^{x+y}}{1+e^{x+y}}$ — (ii).</div><div class=\"ml-vi\">$e^{x+y}(1+y')+y'=0\\Rightarrow y'(e^{x+y}+1)=-e^{x+y}\\Rightarrow y'=\\dfrac{-e^{x+y}}{1+e^{x+y}}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be the rotation through $\\pi$ followed by reflection in the X axis. Then $T$ is:|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép quay góc $\\pi$ rồi phản chiếu qua trục X. Khi đó $T$ là:",
          "options": [
            {
              "text": "Reflection in the y-axis.|||Phản chiếu qua trục y."
            },
            {
              "text": "Reflection about $y=x$.|||Phản chiếu qua $y=x$."
            },
            {
              "text": "Projection in the y-axis.|||Phép chiếu lên trục y."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "Projection about $y=x$.|||Phép chiếu qua $y=x$."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Rotation $\\pi=\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}$; reflection in X $=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Product $=\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$ = reflection in the y-axis.</div><div class=\"ml-vi\">Quay $\\pi=\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}$; phản chiếu qua X $=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Tích $=\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$ = phản chiếu qua trục y.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_1^4 \\dfrac{t^7-t^3}{t^5}\\,dt$|||Tính $\\displaystyle\\int_1^4 \\dfrac{t^7-t^3}{t^5}\\,dt$",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "81/4|||81/4"
            },
            {
              "text": "275/12|||275/12"
            },
            {
              "text": "259/12|||259/12"
            },
            {
              "text": "79/4|||79/4"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\int_1^4(t^2-t^{-2})dt=\\Big[\\dfrac{t^3}{3}+\\dfrac1t\\Big]_1^4=\\big(\\tfrac{64}{3}+\\tfrac14\\big)-\\big(\\tfrac13+1\\big)=21-\\tfrac34=\\dfrac{81}{4}$.</div><div class=\"ml-vi\">$\\int_1^4(t^2-t^{-2})dt=\\Big[\\dfrac{t^3}{3}+\\dfrac1t\\Big]_1^4=\\big(\\tfrac{64}{3}+\\tfrac14\\big)-\\big(\\tfrac13+1\\big)=21-\\tfrac34=\\dfrac{81}{4}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{X,Y,Z\\}$ be an independent set of vectors. Which of the following sets are also independent?<br>(i) $\\{X-Y+Z,\\ X+Y,\\ 2X+Z\\}$<br>(ii) $\\{X+2Y,\\ Y+2Z,\\ Z+2X\\}$|||Cho $\\{X,Y,Z\\}$ là tập vector độc lập tuyến tính. Tập nào sau đây cũng độc lập?<br>(i) $\\{X-Y+Z,\\ X+Y,\\ 2X+Z\\}$<br>(ii) $\\{X+2Y,\\ Y+2Z,\\ Z+2X\\}$",
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
          "explanation": "<div class=\"ml-en\">(i) coefficient determinant $=0$ → dependent. (ii) determinant $=9\\ne0$ → independent. Only (ii).</div><div class=\"ml-vi\">(i) định thức hệ số $=0$ → phụ thuộc. (ii) định thức $=9\\ne0$ → độc lập. Chỉ (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the minimum of the product of two numbers with the property that the first minus 4 times the second is 8.|||Tìm giá trị nhỏ nhất của tích hai số với tính chất: số thứ nhất trừ 4 lần số thứ hai bằng 8.",
          "options": [
            {
              "text": "$-3$|||$-3$"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "$-1$|||$-1$"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "$-4$|||$-4$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$x-4y=8\\Rightarrow x=8+4y$. $P=xy=4y^2+8y$, $P'=8y+8=0\\Rightarrow y=-1,x=4$, $P=-4$ (minimum).</div><div class=\"ml-vi\">$x-4y=8\\Rightarrow x=8+4y$. $P=xy=4y^2+8y$, $P'=8y+8=0\\Rightarrow y=-1,x=4$, $P=-4$ (cực tiểu).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the linear approximation for $f(x)=\\sqrt{x^3+1}$ at $x=2$.|||Tìm xấp xỉ tuyến tính của $f(x)=\\sqrt{x^3+1}$ tại $x=2$.",
          "options": [
            {
              "text": "$2x+1$|||$2x+1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$3x+2$|||$3x+2$"
            },
            {
              "text": "$2x-1$|||$2x-1$"
            },
            {
              "text": "$3x-2$|||$3x-2$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f(2)=3$, $f'(x)=\\dfrac{3x^2}{2\\sqrt{x^3+1}}$, $f'(2)=2$. $L(x)=3+2(x-2)=2x-1$.</div><div class=\"ml-vi\">$f(2)=3$, $f'(x)=\\dfrac{3x^2}{2\\sqrt{x^3+1}}$, $f'(2)=2$. $L(x)=3+2(x-2)=2x-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true?<br>(i) $\\left\\{\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},\\begin{bmatrix}1\\\\-1\\\\0\\end{bmatrix},\\begin{bmatrix}4\\\\-1\\\\3\\end{bmatrix}\\right\\}$ is a basis of $\\mathbb{R}^3$.<br>(ii) $\\left\\{\\begin{bmatrix}3\\\\1\\end{bmatrix},\\begin{bmatrix}1\\\\2\\end{bmatrix},\\begin{bmatrix}1\\\\-3\\end{bmatrix}\\right\\}$ is a basis of $\\mathbb{R}^2$.|||Phát biểu nào sau đây đúng?<br>(i) $\\left\\{\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},\\begin{bmatrix}1\\\\-1\\\\0\\end{bmatrix},\\begin{bmatrix}4\\\\-1\\\\3\\end{bmatrix}\\right\\}$ là cơ sở của $\\mathbb{R}^3$.<br>(ii) $\\left\\{\\begin{bmatrix}3\\\\1\\end{bmatrix},\\begin{bmatrix}1\\\\2\\end{bmatrix},\\begin{bmatrix}1\\\\-3\\end{bmatrix}\\right\\}$ là cơ sở của $\\mathbb{R}^2$.",
          "options": [
            {
              "text": "Neither (i) nor (ii)|||Không câu nào"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
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
          "explanation": "<div class=\"ml-en\">(i) determinant $=0$ → not a basis. (ii) three vectors cannot be a basis of $\\mathbb{R}^2$ (needs exactly 2). Neither.</div><div class=\"ml-vi\">(i) định thức $=0$ → không là cơ sở. (ii) ba vector không thể là cơ sở của $\\mathbb{R}^2$ (cần đúng 2). Không câu nào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statements are true for the piecewise function $f(x)=\\begin{cases}\\dfrac{3x-3}{\\sqrt{x+3}-2}&\\text{if }x\\lt 1\\\\[4pt]3x^2+6&\\text{if }x\\ge 1\\end{cases}$<br>(i) $\\lim_{x\\to1^-}f(x)=12$ (ii) $f(1)=12$ (iii) $\\lim_{x\\to1^+}f(x)=12$|||Phát biểu nào đúng cho hàm từng khúc $f(x)=\\begin{cases}\\dfrac{3x-3}{\\sqrt{x+3}-2}&\\text{nếu }x\\lt 1\\\\[4pt]3x^2+6&\\text{nếu }x\\ge 1\\end{cases}$<br>(i) $\\lim_{x\\to1^-}f(x)=12$ (ii) $f(1)=12$ (iii) $\\lim_{x\\to1^+}f(x)=12$",
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
              "text": "All of (i), (ii) and (iii)|||Cả (i), (ii) và (iii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Rationalize: $\\dfrac{3(x-1)}{\\sqrt{x+3}-2}=3(\\sqrt{x+3}+2)\\to12$ as $x\\to1^-$, so (i) TRUE. But $f(1)=9$ and $\\lim_{x\\to1^+}=9$, so (ii),(iii) FALSE. Only (i).</div><div class=\"ml-vi\">Nhân liên hợp: $\\dfrac{3(x-1)}{\\sqrt{x+3}-2}=3(\\sqrt{x+3}+2)\\to12$ khi $x\\to1^-$ nên (i) ĐÚNG. Nhưng $f(1)=9$ và $\\lim_{x\\to1^+}=9$ nên (ii),(iii) SAI. Chỉ (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given two vectors $X,Y$ such that the vectors $\\tfrac13 X$ and $\\tfrac12 Y$ are orthonormal. Compute $(X-2Y)\\cdot(2X+Y)$.|||Cho hai vector $X,Y$ sao cho $\\tfrac13 X$ và $\\tfrac12 Y$ là hệ trực chuẩn. Tính $(X-2Y)\\cdot(2X+Y)$.",
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Orthonormal $\\Rightarrow |X|=3,\\ |Y|=2,\\ X\\cdot Y=0$. $(X-2Y)\\cdot(2X+Y)=2|X|^2-3X\\cdot Y-2|Y|^2=18-0-8=10$.</div><div class=\"ml-vi\">Trực chuẩn $\\Rightarrow |X|=3,\\ |Y|=2,\\ X\\cdot Y=0$. $(X-2Y)\\cdot(2X+Y)=2|X|^2-3X\\cdot Y-2|Y|^2=18-0-8=10$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statements are TRUE?<br>(i) $\\begin{bmatrix}-2\\\\3\\end{bmatrix}$ is a linear combination of $\\begin{bmatrix}0\\\\1\\end{bmatrix}$ and $\\begin{bmatrix}1\\\\0\\end{bmatrix}$.<br>(ii) If $x_1,x_2$ are solutions to $Ax=b$, then $x_1-x_2$ is a solution to $Ax=0$.|||Phát biểu nào ĐÚNG?<br>(i) $\\begin{bmatrix}-2\\\\3\\end{bmatrix}$ là tổ hợp tuyến tính của $\\begin{bmatrix}0\\\\1\\end{bmatrix}$ và $\\begin{bmatrix}1\\\\0\\end{bmatrix}$.<br>(ii) Nếu $x_1,x_2$ là nghiệm của $Ax=b$ thì $x_1-x_2$ là nghiệm của $Ax=0$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) $-2\\begin{bmatrix}1\\\\0\\end{bmatrix}+3\\begin{bmatrix}0\\\\1\\end{bmatrix}=\\begin{bmatrix}-2\\\\3\\end{bmatrix}$ — TRUE. (ii) $A(x_1-x_2)=b-b=0$ — TRUE. Both.</div><div class=\"ml-vi\">(i) $-2\\begin{bmatrix}1\\\\0\\end{bmatrix}+3\\begin{bmatrix}0\\\\1\\end{bmatrix}=\\begin{bmatrix}-2\\\\3\\end{bmatrix}$ — ĐÚNG. (ii) $A(x_1-x_2)=b-b=0$ — ĐÚNG. Cả hai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&1\\\\0&m\\end{bmatrix}$. Find all values of $m$ such that $A^2=I_2$.|||Cho $A=\\begin{bmatrix}1&1\\\\0&m\\end{bmatrix}$. Tìm tất cả giá trị $m$ để $A^2=I_2$.",
          "options": [
            {
              "text": "$-1$|||$-1$"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "$-2$|||$-2$"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "1 and $-1$|||1 và $-1$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$A^2=\\begin{bmatrix}1&1+m\\\\0&m^2\\end{bmatrix}=I_2$ requires $1+m=0$ and $m^2=1$, both give $m=-1$.</div><div class=\"ml-vi\">$A^2=\\begin{bmatrix}1&1+m\\\\0&m^2\\end{bmatrix}=I_2$ đòi hỏi $1+m=0$ và $m^2=1$, cả hai cho $m=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\det\\begin{bmatrix}a&b&c\\\\p&q&r\\\\x&y&z\\end{bmatrix}=3$, find $\\det\\begin{bmatrix}a+2x&b+2y&c+2z\\\\3a-p&3b-q&3c-r\\\\a&b&c\\end{bmatrix}$.|||Cho $\\det\\begin{bmatrix}a&b&c\\\\p&q&r\\\\x&y&z\\end{bmatrix}=3$, tính $\\det\\begin{bmatrix}a+2x&b+2y&c+2z\\\\3a-p&3b-q&3c-r\\\\a&b&c\\end{bmatrix}$.",
          "options": [
            {
              "text": "24|||24"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the others|||Không câu nào"
            },
            {
              "text": "$-6$|||$-6$"
            },
            {
              "text": "$-24$|||$-24$"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            5
          ],
          "explanation": "<div class=\"ml-en\">Rows: $R_1{+}2R_3,\\ 3R_1{-}R_2,\\ R_1$. Subtract $R_3$-row: reduces to $\\det[2R_3;-R_2;R_1]=2(-1)\\det[R_3;R_2;R_1]=-2(-3)=6$.</div><div class=\"ml-vi\">Các hàng: $R_1{+}2R_3,\\ 3R_1{-}R_2,\\ R_1$. Trừ hàng $R_1$: đưa về $\\det[2R_3;-R_2;R_1]=2(-1)\\det[R_3;R_2;R_1]=-2(-3)=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider a homogeneous system of 5 linear equations in 6 unknowns. Which of the following is true?|||Xét một hệ thuần nhất gồm 5 phương trình tuyến tính với 6 ẩn. Phát biểu nào đúng?",
          "options": [
            {
              "text": "The system always has infinitely many solutions.|||Hệ luôn có vô số nghiệm."
            },
            {
              "text": "The system has only the trivial solution, or infinitely many solutions.|||Hệ chỉ có nghiệm tầm thường, hoặc vô số nghiệm."
            },
            {
              "text": "The system has between 0 and 5 solutions.|||Hệ có từ 0 đến 5 nghiệm."
            },
            {
              "text": "The system has only the trivial solution.|||Hệ chỉ có nghiệm tầm thường."
            },
            {
              "text": "The system can have no solution.|||Hệ có thể vô nghiệm."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Rank $\\le5<6=$ number of unknowns, so there is always a free variable → infinitely many solutions (always).</div><div class=\"ml-vi\">Hạng $\\le5<6=$ số ẩn nên luôn có biến tự do → vô số nghiệm (luôn luôn).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find an equation for the plane passing through $P(1,3,-1)$ and perpendicular to the vector $[2,1,-1]$.|||Tìm phương trình mặt phẳng qua $P(1,3,-1)$ và vuông góc với vector $[2,1,-1]$.",
          "options": [
            {
              "text": "$x-y-2z=0$|||$x-y-2z=0$"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các lựa chọn khác đều sai"
            },
            {
              "text": "$2(x-1)+(y-3)-(z+1)=0$|||$2(x-1)+(y-3)-(z+1)=0$"
            },
            {
              "text": "$(x-2)+3(y-1)-(z+1)=0$|||$(x-2)+3(y-1)-(z+1)=0$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Point-normal form with normal $(2,1,-1)$ through $P(1,3,-1)$: $2(x-1)+(y-3)-(z+1)=0$.</div><div class=\"ml-vi\">Dạng điểm-pháp với vector pháp $(2,1,-1)$ qua $P(1,3,-1)$: $2(x-1)+(y-3)-(z+1)=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $x$ where the tangent line to the graph of $f(x)=x^3-3x^2+1$ is horizontal.|||Tìm tất cả giá trị $x$ mà tiếp tuyến của đồ thị $f(x)=x^3-3x^2+1$ nằm ngang.",
          "options": [
            {
              "text": "$-2; 0; 2$|||$-2; 0; 2$"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$0; 2$|||$0; 2$"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=3x^2-6x=3x(x-2)=0\\Rightarrow x=0$ or $x=2$.</div><div class=\"ml-vi\">$f'(x)=3x^2-6x=3x(x-2)=0\\Rightarrow x=0$ hoặc $x=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the $(2,3)$-entry of $A^{-1}$ if $A=\\begin{bmatrix}1&2&-1\\\\3&1&1\\\\0&4&7\\end{bmatrix}$.|||Tìm phần tử $(2,3)$ của $A^{-1}$ nếu $A=\\begin{bmatrix}1&2&-1\\\\3&1&1\\\\0&4&7\\end{bmatrix}$.",
          "options": [
            {
              "text": "3/41|||3/41"
            },
            {
              "text": "4/71|||4/71"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "4/51|||4/51"
            },
            {
              "text": "2/31|||2/31"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$(A^{-1})_{23}=\\dfrac{C_{32}}{\\det A}$. $C_{32}=-\\det\\begin{bmatrix}1&-1\\\\3&1\\end{bmatrix}=-4$, $\\det A=-51$, so $=\\dfrac{-4}{-51}=\\dfrac{4}{51}$.</div><div class=\"ml-vi\">$(A^{-1})_{23}=\\dfrac{C_{32}}{\\det A}$. $C_{32}=-\\det\\begin{bmatrix}1&-1\\\\3&1\\end{bmatrix}=-4$, $\\det A=-51$, nên $=\\dfrac{-4}{-51}=\\dfrac{4}{51}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to1}\\dfrac{x^2-3x+2}{x-1}$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to1}\\dfrac{x^2-3x+2}{x-1}$",
          "options": [
            {
              "text": "$-1$|||$-1$"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "$-2$|||$-2$"
            },
            {
              "text": "0|||0"
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
          "explanation": "<div class=\"ml-en\">$\\dfrac{x^2-3x+2}{x-1}=\\dfrac{(x-1)(x-2)}{x-1}=x-2\\to1-2=-1$.</div><div class=\"ml-vi\">$\\dfrac{x^2-3x+2}{x-1}=\\dfrac{(x-1)(x-2)}{x-1}=x-2\\to1-2=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A table of values for $f,g,f',g'$ is given. Find $h'(1)$ if $h(x)=f(g(x))$.<table class=\"exam-table\"><thead><tr><th>x</th><th>f(x)</th><th>g(x)</th><th>f'(x)</th><th>g'(x)</th></tr></thead><tbody><tr><td>0</td><td>1</td><td>1</td><td>2</td><td>-2</td></tr><tr><td>1</td><td>0</td><td>2</td><td>3</td><td>-1</td></tr><tr><td>2</td><td>4</td><td>-1</td><td>5</td><td>6</td></tr></tbody></table>|||Bảng giá trị của $f,g,f',g'$ được cho. Tìm $h'(1)$ nếu $h(x)=f(g(x))$.<table class=\"exam-table\"><thead><tr><th>x</th><th>f(x)</th><th>g(x)</th><th>f'(x)</th><th>g'(x)</th></tr></thead><tbody><tr><td>0</td><td>1</td><td>1</td><td>2</td><td>-2</td></tr><tr><td>1</td><td>0</td><td>2</td><td>3</td><td>-1</td></tr><tr><td>2</td><td>4</td><td>-1</td><td>5</td><td>6</td></tr></tbody></table>",
          "options": [
            {
              "text": "None of them|||Không câu nào"
            },
            {
              "text": "-6|||-6"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "-5|||-5"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$h'(x)=f'(g(x))\\,g'(x)$, so $h'(1)=f'(g(1))\\,g'(1)=f'(2)\\cdot(-1)=5\\cdot(-1)=-5$.</div><div class=\"ml-vi\">$h'(x)=f'(g(x))\\,g'(x)$ nên $h'(1)=f'(g(1))\\,g'(1)=f'(2)\\cdot(-1)=5\\cdot(-1)=-5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^3\\to\\mathbb{R}^3$ be the linear transformation $T([x\\ y\\ z]^T)=[\\,y+2x\\quad 2x-y\\quad z+x\\,]^T$. Let $u=[1\\ 0\\ 1]^T$, $v=[1\\ -1\\ 2]^T$, $w=[2\\ 1\\ -1]^T$. Find the volume of the parallelepiped determined by $T(u),T(v),T(w)$.|||Cho $T:\\mathbb{R}^3\\to\\mathbb{R}^3$ tuyến tính $T([x\\ y\\ z]^T)=[\\,y+2x\\quad 2x-y\\quad z+x\\,]^T$. Cho $u=[1\\ 0\\ 1]^T$, $v=[1\\ -1\\ 2]^T$, $w=[2\\ 1\\ -1]^T$. Tìm thể tích hình hộp xác định bởi $T(u),T(v),T(w)$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Matrix $M=\\begin{bmatrix}2&1&0\\\\2&-1&0\\\\1&0&1\\end{bmatrix}$, $\\det M=-4$. $\\det[u\\,v\\,w]=2$. Volume $=|\\det M|\\cdot|\\det[u\\,v\\,w]|=4\\cdot2=8$.</div><div class=\"ml-vi\">Ma trận $M=\\begin{bmatrix}2&1&0\\\\2&-1&0\\\\1&0&1\\end{bmatrix}$, $\\det M=-4$. $\\det[u\\,v\\,w]=2$. Thể tích $=|\\det M|\\cdot|\\det[u\\,v\\,w]|=4\\cdot2=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the initial approximation $x_1=-1$ to find $x_3$, the third approximation to the root of $x^5+2=0$.|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1=-1$ để tìm $x_3$, xấp xỉ thứ ba của nghiệm $x^5+2=0$.",
          "options": [
            {
              "text": "-2.0027|||-2.0027"
            },
            {
              "text": "-1.3229|||-1.3229"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-1.1529|||-1.1529"
            },
            {
              "text": "-2.3058|||-2.3058"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$x_{n+1}=x_n-\\dfrac{x_n^5+2}{5x_n^4}$. $x_1=-1\\Rightarrow x_2=-1.2\\Rightarrow x_3\\approx-1.1529$.</div><div class=\"ml-vi\">$x_{n+1}=x_n-\\dfrac{x_n^5+2}{5x_n^4}$. $x_1=-1\\Rightarrow x_2=-1.2\\Rightarrow x_3\\approx-1.1529$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine where the function $f(x)=2x^3+9x^2+12x$ is concave up and where it is concave down.<br>(i) Concave up on $(-\\infty,3/2)$, down on $(3/2,\\infty)$ (ii) Concave down on $(-\\infty,-3/2)$, up on $(-3/2,\\infty)$ (iii) Concave up on $(-\\infty,-3/2)$, down on $(-3/2,\\infty)$ (iv) Concave down on $(-\\infty,3/2)$, up on $(3/2,\\infty)$|||Xác định khoảng lồi/lõm của $f(x)=2x^3+9x^2+12x$.<br>(i) Lõm (concave up) trên $(-\\infty,3/2)$, lồi trên $(3/2,\\infty)$ (ii) Lồi trên $(-\\infty,-3/2)$, lõm trên $(-3/2,\\infty)$ (iii) Lõm trên $(-\\infty,-3/2)$, lồi trên $(-3/2,\\infty)$ (iv) Lồi trên $(-\\infty,3/2)$, lõm trên $(3/2,\\infty)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
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
            3
          ],
          "explanation": "<div class=\"ml-en\">$f''(x)=12x+18=0\\Rightarrow x=-\\tfrac32$. $f''\\lt0$ (concave down) for $x\\lt-\\tfrac32$, $f''\\gt0$ (concave up) for $x\\gt-\\tfrac32$ — (ii).</div><div class=\"ml-vi\">$f''(x)=12x+18=0\\Rightarrow x=-\\tfrac32$. $f''\\lt0$ (lồi) khi $x\\lt-\\tfrac32$, $f''\\gt0$ (lõm) khi $x\\gt-\\tfrac32$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\dfrac{d}{dx}\\displaystyle\\int_{29}^{x^3}\\sin t\\,dt$<br>(i) $-3x^2\\cos x^3$ (ii) $x^3\\cos x^3$ (iii) $3x^2\\cos x^3$ (iv) $3x^2\\sin x^3$|||Tìm $\\dfrac{d}{dx}\\displaystyle\\int_{29}^{x^3}\\sin t\\,dt$<br>(i) $-3x^2\\cos x^3$ (ii) $x^3\\cos x^3$ (iii) $3x^2\\cos x^3$ (iv) $3x^2\\sin x^3$",
          "options": [
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
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">By the FTC and chain rule: $\\dfrac{d}{dx}\\int_{29}^{x^3}\\sin t\\,dt=\\sin(x^3)\\cdot 3x^2=3x^2\\sin x^3$ — (iv).</div><div class=\"ml-vi\">Theo định lý cơ bản và quy tắc dây chuyền: $\\dfrac{d}{dx}\\int_{29}^{x^3}\\sin t\\,dt=\\sin(x^3)\\cdot 3x^2=3x^2\\sin x^3$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{pmatrix}2&-1\\\\3&0\\\\5&4\\end{pmatrix}$, $B=\\begin{pmatrix}-1&3\\\\2&5\\\\7&8\\end{pmatrix}$, $C=\\begin{pmatrix}0&4\\\\12&5\\\\7&13\\end{pmatrix}$. Find the $(2,1)$-entry of $A-2B+3C$.|||Cho $A=\\begin{pmatrix}2&-1\\\\3&0\\\\5&4\\end{pmatrix}$, $B=\\begin{pmatrix}-1&3\\\\2&5\\\\7&8\\end{pmatrix}$, $C=\\begin{pmatrix}0&4\\\\12&5\\\\7&13\\end{pmatrix}$. Tìm phần tử $(2,1)$ của $A-2B+3C$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "35|||35"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$(2,1)$: $3-2(2)+3(12)=3-4+36=35$.</div><div class=\"ml-vi\">$(2,1)$: $3-2(2)+3(12)=3-4+36=35$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $A=\\begin{bmatrix}5&-4\\\\1&0\\end{bmatrix}$, $u=[1\\ -1]^T$, $v=[4\\ 1]^T$. Choose the correct answer.|||Cho $A=\\begin{bmatrix}5&-4\\\\1&0\\end{bmatrix}$, $u=[1\\ -1]^T$, $v=[4\\ 1]^T$. Chọn đáp án đúng.",
          "options": [
            {
              "text": "$v$ is an eigenvector of $A$|||$v$ là vector riêng của $A$"
            },
            {
              "text": "Both $u$ and $v$ are eigenvectors of $A$|||Cả $u$ và $v$ là vector riêng của $A$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$u$ is an eigenvector of $A$|||$u$ là vector riêng của $A$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$Av=[16,4]^T=4v$ → $v$ is an eigenvector (eigenvalue 4). $Au=[9,1]^T$ is not a multiple of $u$. Only $v$.</div><div class=\"ml-vi\">$Av=[16,4]^T=4v$ → $v$ là vector riêng (giá trị riêng 4). $Au=[9,1]^T$ không là bội của $u$. Chỉ $v$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $3\\times 5$ matrix. What is the maximum value of $\\operatorname{rank}(A)$?|||Cho $A$ là ma trận $3\\times 5$. Giá trị lớn nhất của $\\operatorname{rank}(A)$ là?",
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
              "text": "2|||2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\operatorname{rank}(A)\\le\\min(3,5)=3$.</div><div class=\"ml-vi\">$\\operatorname{rank}(A)\\le\\min(3,5)=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "State the domain of the function $F(x)=\\sqrt{x-3}\\,\\sin x$.<br>(i) $(0,3)$ (ii) $[3,\\infty)$ (iii) $(3,\\infty)$ (iv) $(0,3]$|||Nêu tập xác định của hàm $F(x)=\\sqrt{x-3}\\,\\sin x$.<br>(i) $(0,3)$ (ii) $[3,\\infty)$ (iii) $(3,\\infty)$ (iv) $(0,3]$",
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
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả đều sai"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Need $x-3\\ge0\\Rightarrow x\\ge3$; $\\sin x$ is defined everywhere. Domain $[3,\\infty)$ — (ii).</div><div class=\"ml-vi\">Cần $x-3\\ge0\\Rightarrow x\\ge3$; $\\sin x$ xác định khắp nơi. Tập xác định $[3,\\infty)$ — (ii).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D2",
      "source": "REAL",
      "sortOrder": 1,
      "title": "Đề 2 — Final Exam|||Đề 2 — Thi cuối kỳ",
      "description": "MAE101 real FE multiple-choice paper, transcribed from the exam images; answers reasoned here. (50 questions)|||Đề trắc nghiệm FE thật môn MAE101, chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (50 câu)",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Math is rendered with formulas — read carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Công thức toán được hiển thị — đọc kỹ. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f\\circ g\\circ h$, where $f(x)=\\sqrt{x^2+1}$, $g(x)=\\sin(5x)$, $h(x)=2x+1$.<br>(i) $\\sqrt{\\sin^2(10x+5)}+1$ (ii) $\\sqrt{\\sin^2(10x+5)+1}$ (iii) $\\sqrt{\\sin^2(10x+1)}+1$ (iv) $\\sqrt{\\sin^2(10x+1)+1}$|||Tìm $f\\circ g\\circ h$, với $f(x)=\\sqrt{x^2+1}$, $g(x)=\\sin(5x)$, $h(x)=2x+1$.<br>(i) $\\sqrt{\\sin^2(10x+5)}+1$ (ii) $\\sqrt{\\sin^2(10x+5)+1}$ (iii) $\\sqrt{\\sin^2(10x+1)}+1$ (iv) $\\sqrt{\\sin^2(10x+1)+1}$",
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
          "explanation": "<div class=\"ml-en\">$h(x)=2x+1$, $g(h(x))=\\sin(5(2x+1))=\\sin(10x+5)$, $f(g(h))=\\sqrt{\\sin^2(10x+5)+1}$ — the $+1$ is INSIDE the radical, argument $10x+5$: (ii).</div><div class=\"ml-vi\">$h(x)=2x+1$, $g(h(x))=\\sin(5(2x+1))=\\sin(10x+5)$, $f(g(h))=\\sqrt{\\sin^2(10x+5)+1}$ — số $+1$ nằm TRONG căn, đối số $10x+5$: (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $(L)$ be the line passing through $(2,-1)$ with slope $1/2$. Which of the following points lies in $(L)$?|||Cho đường thẳng $(L)$ qua $(2,-1)$ với hệ số góc $1/2$. Điểm nào sau đây nằm trên $(L)$?",
          "options": [
            {
              "text": "$(-2,-3)$|||$(-2,-3)$"
            },
            {
              "text": "$(-2,0)$|||$(-2,0)$"
            },
            {
              "text": "$(2,2)$|||$(2,2)$"
            },
            {
              "text": "$(2,4)$|||$(2,4)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(L): y=\\tfrac12(x-2)-1=\\tfrac{x}{2}-2$. At $x=-2$: $y=-3$, so $(-2,-3)$ lies on $(L)$.</div><div class=\"ml-vi\">$(L): y=\\tfrac12(x-2)-1=\\tfrac{x}{2}-2$. Tại $x=-2$: $y=-3$, nên $(-2,-3)$ nằm trên $(L)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to1}\\dfrac{\\sqrt{x^2+3x}-2}{x-1}$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to1}\\dfrac{\\sqrt{x^2+3x}-2}{x-1}$",
          "options": [
            {
              "text": "5/4|||5/4"
            },
            {
              "text": "-5/4|||-5/4"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "-5/2|||-5/2"
            },
            {
              "text": "5/2|||5/2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Rationalize: $\\dfrac{x^2+3x-4}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{(x+4)(x-1)}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{x+4}{\\sqrt{x^2+3x}+2}\\to\\dfrac{5}{4}$.</div><div class=\"ml-vi\">Nhân liên hợp: $\\dfrac{x^2+3x-4}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{(x+4)(x-1)}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{x+4}{\\sqrt{x^2+3x}+2}\\to\\dfrac{5}{4}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "State the interval(s) over which the function $f(x)=\\dfrac{x-1}{x^2-3x+2}$ is continuous.<br>(i) $(-\\infty,2),(2,+\\infty)$ (ii) $(1,2)$ (iii) $(-\\infty,1),(1,2),(2,+\\infty)$ (iv) $(-\\infty,2)$ (v) $(-\\infty,1)$|||Nêu các khoảng mà hàm $f(x)=\\dfrac{x-1}{x^2-3x+2}$ liên tục.<br>(i) $(-\\infty,2),(2,+\\infty)$ (ii) $(1,2)$ (iii) $(-\\infty,1),(1,2),(2,+\\infty)$ (iv) $(-\\infty,2)$ (v) $(-\\infty,1)$",
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
            2
          ],
          "explanation": "<div class=\"ml-en\">$x^2-3x+2=(x-1)(x-2)$; the rational function is continuous everywhere except $x=1,2$: $(-\\infty,1),(1,2),(2,+\\infty)$ — (iii).</div><div class=\"ml-vi\">$x^2-3x+2=(x-1)(x-2)$; hàm hữu tỉ liên tục ở mọi nơi trừ $x=1,2$: $(-\\infty,1),(1,2),(2,+\\infty)$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Simplify the quotient $\\dfrac{f(x+h)-f(x)}{h}$ for $f(x)=\\dfrac{x^2}{2}$.|||Rút gọn $\\dfrac{f(x+h)-f(x)}{h}$ với $f(x)=\\dfrac{x^2}{2}$.",
          "options": [
            {
              "text": "$(2x+h)/2$|||$(2x+h)/2$"
            },
            {
              "text": "$(x-2h)/2$|||$(x-2h)/2$"
            },
            {
              "text": "$(-2x-h)/2$|||$(-2x-h)/2$"
            },
            {
              "text": "$x/2$|||$x/2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{(x+h)^2/2-x^2/2}{h}=\\dfrac{2xh+h^2}{2h}=\\dfrac{2x+h}{2}$.</div><div class=\"ml-vi\">$\\dfrac{(x+h)^2/2-x^2/2}{h}=\\dfrac{2xh+h^2}{2h}=\\dfrac{2x+h}{2}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\dfrac{d^2y}{dx^2}$ at $x=1$ for $y=2x^{3/2}-6x^{1/2}$.|||Tính $\\dfrac{d^2y}{dx^2}$ tại $x=1$ với $y=2x^{3/2}-6x^{1/2}$.",
          "options": [
            {
              "text": "1.5|||1.5"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "-3|||-3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$y'=3x^{1/2}-3x^{-1/2}$, $y''=\\tfrac32 x^{-1/2}+\\tfrac32 x^{-3/2}$; at $x=1$: $\\tfrac32+\\tfrac32=3$.</div><div class=\"ml-vi\">$y'=3x^{1/2}-3x^{-1/2}$, $y''=\\tfrac32 x^{-1/2}+\\tfrac32 x^{-3/2}$; tại $x=1$: $\\tfrac32+\\tfrac32=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The function $s(t)=t^2\\cos t+4t^2$ is the position of a particle moving along a horizontal line. Find the velocity at $t=\\pi$.<br>(i) $4\\pi$ (ii) $8\\pi$ (iii) $6\\pi$ (iv) $2\\pi$|||Hàm $s(t)=t^2\\cos t+4t^2$ là vị trí của một chất điểm chuyển động trên đường thẳng ngang. Tìm vận tốc tại $t=\\pi$.<br>(i) $4\\pi$ (ii) $8\\pi$ (iii) $6\\pi$ (iv) $2\\pi$",
          "options": [
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
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$v=s'=2t\\cos t-t^2\\sin t+8t$; at $t=\\pi$: $2\\pi(-1)-\\pi^2(0)+8\\pi=6\\pi$ — (iii).</div><div class=\"ml-vi\">$v=s'=2t\\cos t-t^2\\sin t+8t$; tại $t=\\pi$: $2\\pi(-1)-\\pi^2(0)+8\\pi=6\\pi$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Differentiate $(4x^2+3)^5-(1+4x^3)^5$.<br>(i) $20x(4x^2+3)^4-5x^2(1+4x^3)^4$ (ii) $40x(4x^2+3)^4-60x^2(1+4x^3)^4$ (iii) $40x(4x^2+3)^4-5(1+4x^3)^4$ (iv) $5(4x^2+3)^4-60x^2(1+4x^3)^4$|||Tính đạo hàm $(4x^2+3)^5-(1+4x^3)^5$.<br>(i) $20x(4x^2+3)^4-5x^2(1+4x^3)^4$ (ii) $40x(4x^2+3)^4-60x^2(1+4x^3)^4$ (iii) $40x(4x^2+3)^4-5(1+4x^3)^4$ (iv) $5(4x^2+3)^4-60x^2(1+4x^3)^4$",
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
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{dy}{dx}=5(4x^2+3)^4(8x)-5(1+4x^3)^4(12x^2)=40x(4x^2+3)^4-60x^2(1+4x^3)^4$ — (ii).</div><div class=\"ml-vi\">$\\dfrac{dy}{dx}=5(4x^2+3)^4(8x)-5(1+4x^3)^4(12x^2)=40x(4x^2+3)^4-60x^2(1+4x^3)^4$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Calculate $y'$ from the equation $xy^3+x^5y=2x+4y$.<br>(i) $y'=\\dfrac{y^3+5x^4y-2}{4-x^5-3xy^2}$ (ii) $y'=\\dfrac{2y^3+5x^4y+2}{4-x^5-3xy^2}$ (iii) $y'=\\dfrac{3y^2+5x^4y-2x}{4-x^5-3xy^2}$ (iv) $y'=\\dfrac{y^3+5x^4y-2x}{4-x^5-3xy^2}$|||Tính $y'$ từ phương trình $xy^3+x^5y=2x+4y$.<br>(i) $y'=\\dfrac{y^3+5x^4y-2}{4-x^5-3xy^2}$ (ii) $y'=\\dfrac{2y^3+5x^4y+2}{4-x^5-3xy^2}$ (iii) $y'=\\dfrac{3y^2+5x^4y-2x}{4-x^5-3xy^2}$ (iv) $y'=\\dfrac{y^3+5x^4y-2x}{4-x^5-3xy^2}$",
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
              "text": "None of others|||Không câu nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Differentiating: $y^3+3xy^2y'+5x^4y+x^5y'=2+4y'$, so $y'=\\dfrac{y^3+5x^4y-2}{4-x^5-3xy^2}$ — (i).</div><div class=\"ml-vi\">Đạo hàm hai vế: $y^3+3xy^2y'+5x^4y+x^5y'=2+4y'$, suy ra $y'=\\dfrac{y^3+5x^4y-2}{4-x^5-3xy^2}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The equation of motion for a particle is $s(t)=\\sin(2\\pi t)$, where $s$ is in meters and $t$ in seconds. Find the acceleration after 4.5 seconds.<br>(i) $-81\\pi^2\\,m/s^2$ (ii) $81\\pi^2\\,m/s^2$ (iii) $0\\,m/s^2$ (iv) $-9\\pi^2\\,m/s^2$ (v) $9\\pi^2\\,m/s^2$|||Phương trình chuyển động của một chất điểm là $s(t)=\\sin(2\\pi t)$, $s$ tính bằng mét, $t$ bằng giây. Tìm gia tốc sau 4.5 giây.<br>(i) $-81\\pi^2\\,m/s^2$ (ii) $81\\pi^2\\,m/s^2$ (iii) $0\\,m/s^2$ (iv) $-9\\pi^2\\,m/s^2$ (v) $9\\pi^2\\,m/s^2$",
          "options": [
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
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$a=s''=-4\\pi^2\\sin(2\\pi t)$; at $t=4.5$: $\\sin(9\\pi)=0$, so $a=0$ — (iii).</div><div class=\"ml-vi\">$a=s''=-4\\pi^2\\sin(2\\pi t)$; tại $t=4.5$: $\\sin(9\\pi)=0$ nên $a=0$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the linear approximation for $f(x)=\\dfrac{1}{2x-1}$ at $x=1$.|||Tìm xấp xỉ tuyến tính của $f(x)=\\dfrac{1}{2x-1}$ tại $x=1$.",
          "options": [
            {
              "text": "$-2x+3$|||$-2x+3$"
            },
            {
              "text": "$2x+3$|||$2x+3$"
            },
            {
              "text": "$2x-3$|||$2x-3$"
            },
            {
              "text": "$-2x-3$|||$-2x-3$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=1$, $f'(x)=\\dfrac{-2}{(2x-1)^2}$, $f'(1)=-2$. $L(x)=1-2(x-1)=-2x+3$.</div><div class=\"ml-vi\">$f(1)=1$, $f'(x)=\\dfrac{-2}{(2x-1)^2}$, $f'(1)=-2$. $L(x)=1-2(x-1)=-2x+3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the critical numbers of the function $y=x^2e^{x-1}$.|||Tìm các số tới hạn của hàm $y=x^2e^{x-1}$.",
          "options": [
            {
              "text": "$-2;\\ 1$|||$-2;\\ 1$"
            },
            {
              "text": "$-2;\\ 0$|||$-2;\\ 0$"
            },
            {
              "text": "$0;\\ 2$|||$0;\\ 2$"
            },
            {
              "text": "$0;\\ 1$|||$0;\\ 1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$y'=e^{x-1}(x^2+2x)=e^{x-1}x(x+2)=0\\Rightarrow x=0$ or $x=-2$.</div><div class=\"ml-vi\">$y'=e^{x-1}(x^2+2x)=e^{x-1}x(x+2)=0\\Rightarrow x=0$ hoặc $x=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the points of inflection for $f(x)=-\\tfrac23 x^3+6x^2-x$.|||Tìm điểm uốn của $f(x)=-\\tfrac23 x^3+6x^2-x$.",
          "options": [
            {
              "text": "$(-3,75)$|||$(-3,75)$"
            },
            {
              "text": "$(3,0)$|||$(3,0)$"
            },
            {
              "text": "$(3,-17)$|||$(3,-17)$"
            },
            {
              "text": "$(3,33)$|||$(3,33)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f''(x)=-4x+12=0\\Rightarrow x=3$; $f(3)=-18+54-3=33$. Inflection $(3,33)$.</div><div class=\"ml-vi\">$f''(x)=-4x+12=0\\Rightarrow x=3$; $f(3)=-18+54-3=33$. Điểm uốn $(3,33)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statement is true for the function $f(x)=\\dfrac{2x}{x^2+1}\\cos x$?|||Phát biểu nào đúng cho hàm $f(x)=\\dfrac{2x}{x^2+1}\\cos x$?",
          "options": [
            {
              "text": "The graph of $f(x)$ has a vertical asymptote $x=0$ and no horizontal asymptote|||Đồ thị $f(x)$ có tiệm cận đứng $x=0$ và không có tiệm cận ngang"
            },
            {
              "text": "The graph of $f(x)$ has a horizontal asymptote $y=0$ and no vertical asymptote|||Đồ thị $f(x)$ có tiệm cận ngang $y=0$ và không có tiệm cận đứng"
            },
            {
              "text": "The graph of $f(x)$ has a vertical asymptote $x=0$ and a horizontal asymptote $y=0$|||Đồ thị $f(x)$ có tiệm cận đứng $x=0$ và tiệm cận ngang $y=0$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$x^2+1$ never $0$ → no vertical asymptote. As $x\\to\\pm\\infty$, $\\dfrac{2x}{x^2+1}\\to0$ and $\\cos x$ is bounded, so $f\\to0$: horizontal asymptote $y=0$.</div><div class=\"ml-vi\">$x^2+1$ không bao giờ $=0$ → không có tiệm cận đứng. Khi $x\\to\\pm\\infty$, $\\dfrac{2x}{x^2+1}\\to0$ và $\\cos x$ bị chặn nên $f\\to0$: tiệm cận ngang $y=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x,y$ be non-negative real numbers such that $x+2y=8$. Find the maximum and the minimum of $y-\\dfrac1x$ (if they exist).<br>(i) The maximum is $4-\\sqrt2$ and the minimum is $-\\tfrac18$ (ii) The maximum is $4-\\sqrt2$ and the minimum does not exist (iii) The maximum does not exist and the minimum is $-\\tfrac18$ (iv) The maximum does not exist and the minimum does not exist|||Cho $x,y$ là các số thực không âm với $x+2y=8$. Tìm giá trị lớn nhất và nhỏ nhất của $y-\\dfrac1x$ (nếu tồn tại).<br>(i) Max là $4-\\sqrt2$ và min là $-\\tfrac18$ (ii) Max là $4-\\sqrt2$ và min không tồn tại (iii) Max không tồn tại và min là $-\\tfrac18$ (iv) Max không tồn tại và min không tồn tại",
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
          "explanation": "<div class=\"ml-en\">$g(x)=4-\\tfrac{x}{2}-\\tfrac1x$ on $(0,8]$. $g'=-\\tfrac12+\\tfrac1{x^2}=0\\Rightarrow x=\\sqrt2$, a max $g(\\sqrt2)=4-\\sqrt2$. As $x\\to0^+$, $g\\to-\\infty$, so no minimum — (ii).</div><div class=\"ml-vi\">$g(x)=4-\\tfrac{x}{2}-\\tfrac1x$ trên $(0,8]$. $g'=-\\tfrac12+\\tfrac1{x^2}=0\\Rightarrow x=\\sqrt2$, cực đại $g(\\sqrt2)=4-\\sqrt2$. Khi $x\\to0^+$, $g\\to-\\infty$ nên không có min — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with $x_1=1$ to find $x_4$, the fourth approximation to the root of $x^3+2x-4=0$.|||Dùng phương pháp Newton với $x_1=1$ để tìm $x_4$, xấp xỉ thứ tư của nghiệm $x^3+2x-4=0$.",
          "options": [
            {
              "text": "2.3415|||2.3415"
            },
            {
              "text": "1.5647|||1.5647"
            },
            {
              "text": "1.1795|||1.1795"
            },
            {
              "text": "2.0034|||2.0034"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$x_{n+1}=x_n-\\dfrac{x_n^3+2x_n-4}{3x_n^2+2}$: $x_1=1\\to x_2=1.2\\to x_3\\approx1.17975\\to x_4\\approx1.1795$.</div><div class=\"ml-vi\">$x_{n+1}=x_n-\\dfrac{x_n^3+2x_n-4}{3x_n^2+2}$: $x_1=1\\to x_2=1.2\\to x_3\\approx1.17975\\to x_4\\approx1.1795$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use right-endpoint approximation to approximate the area under the curve of $f(x)=x^2-x+\\tfrac14$ on $[0,2]$ with $n=4$ subintervals.|||Dùng xấp xỉ mút phải để tính diện tích dưới đường cong $f(x)=x^2-x+\\tfrac14$ trên $[0,2]$ với $n=4$ đoạn con.",
          "options": [
            {
              "text": "2.00|||2.00"
            },
            {
              "text": "1.75|||1.75"
            },
            {
              "text": "0.75|||0.75"
            },
            {
              "text": "1.50|||1.50"
            },
            {
              "text": "1.00|||1.00"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=0.5$; right endpoints $0.5,1,1.5,2$ give $f=0,0.25,1,2.25$. Sum $\\times0.5=3.5\\times0.5=1.75$.</div><div class=\"ml-vi\">$\\Delta x=0.5$; mút phải $0.5,1,1.5,2$ cho $f=0,0.25,1,2.25$. Tổng $\\times0.5=3.5\\times0.5=1.75$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the function $f(x)=3x^2+2x$. Find the number $b$ such that the average value of $f$ on $[0,b]$ is equal to 72.|||Xét hàm $f(x)=3x^2+2x$. Tìm số $b$ sao cho giá trị trung bình của $f$ trên $[0,b]$ bằng 72.",
          "options": [
            {
              "text": "$b=10$|||$b=10$"
            },
            {
              "text": "$b=7$|||$b=7$"
            },
            {
              "text": "$b=9$|||$b=9$"
            },
            {
              "text": "$b=8$|||$b=8$"
            },
            {
              "text": "$b=11$|||$b=11$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Average $=\\dfrac1b\\int_0^b(3x^2+2x)dx=\\dfrac1b(b^3+b^2)=b^2+b=72\\Rightarrow b=8$.</div><div class=\"ml-vi\">Trung bình $=\\dfrac1b\\int_0^b(3x^2+2x)dx=\\dfrac1b(b^3+b^2)=b^2+b=72\\Rightarrow b=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=2x^2-2x+1$. Find a number $c$ such that $f(c)$ equals the average value of $f(x)$ over $[-1,1]$.<br>(i) $(3-2\\sqrt2)/5$ (ii) $(-3+\\sqrt{21})/6$ (iii) $(3-\\sqrt{21})/6$ (iv) $(3+2\\sqrt2)/5$|||Cho $f(x)=2x^2-2x+1$. Tìm số $c$ sao cho $f(c)$ bằng giá trị trung bình của $f(x)$ trên $[-1,1]$.<br>(i) $(3-2\\sqrt2)/5$ (ii) $(-3+\\sqrt{21})/6$ (iii) $(3-\\sqrt{21})/6$ (iv) $(3+2\\sqrt2)/5$",
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
          "explanation": "<div class=\"ml-en\">Average $=\\tfrac12\\int_{-1}^1(2x^2-2x+1)dx=\\tfrac53$. Solve $2c^2-2c+1=\\tfrac53\\Rightarrow 3c^2-3c-1=0\\Rightarrow c=\\dfrac{3\\pm\\sqrt{21}}{6}$; the value in $[-1,1]$ is $\\dfrac{3-\\sqrt{21}}{6}$ — (iii).</div><div class=\"ml-vi\">Trung bình $=\\tfrac12\\int_{-1}^1(2x^2-2x+1)dx=\\tfrac53$. Giải $2c^2-2c+1=\\tfrac53\\Rightarrow 3c^2-3c-1=0\\Rightarrow c=\\dfrac{3\\pm\\sqrt{21}}{6}$; giá trị trong $[-1,1]$ là $\\dfrac{3-\\sqrt{21}}{6}$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the integral $\\displaystyle\\int_0^9(10+6y-y^2)\\,dy$.|||Tính tích phân $\\displaystyle\\int_0^9(10+6y-y^2)\\,dy$.",
          "options": [
            {
              "text": "90|||90"
            },
            {
              "text": "900|||900"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "None of these|||Không câu nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$[10y+3y^2-\\tfrac{y^3}{3}]_0^9=90+243-243=90$.</div><div class=\"ml-vi\">$[10y+3y^2-\\tfrac{y^3}{3}]_0^9=90+243-243=90$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int 5e^{3x}\\,dx$.<br>(i) $(5/3)e^{3x}+C$ (ii) $\\dfrac{5}{3x}e^{3x}+C$ (iii) $(1/3)e^{3x}+C$ (iv) $5e^{3x}+C$|||Tính $\\displaystyle\\int 5e^{3x}\\,dx$.<br>(i) $(5/3)e^{3x}+C$ (ii) $\\dfrac{5}{3x}e^{3x}+C$ (iii) $(1/3)e^{3x}+C$ (iv) $5e^{3x}+C$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\int 5e^{3x}dx=\\tfrac53 e^{3x}+C$ — (i).</div><div class=\"ml-vi\">$\\int 5e^{3x}dx=\\tfrac53 e^{3x}+C$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the integral of $f(x)=(x^2+1)e^{-x}$ on the interval $[0,1]$.|||Tính tích phân của $f(x)=(x^2+1)e^{-x}$ trên đoạn $[0,1]$.",
          "options": [
            {
              "text": "$(2e+5)/e$|||$(2e+5)/e$"
            },
            {
              "text": "$(3e-6)/e$|||$(3e-6)/e$"
            },
            {
              "text": "$(5-2e)/e$|||$(5-2e)/e$"
            },
            {
              "text": "$-(2e+3)/e$|||$-(2e+3)/e$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\int(x^2+1)e^{-x}dx=-(x^2+2x+3)e^{-x}$; from $0$ to $1$: $-6/e-(-3)=3-6/e=(3e-6)/e$.</div><div class=\"ml-vi\">$\\int(x^2+1)e^{-x}dx=-(x^2+2x+3)e^{-x}$; từ $0$ đến $1$: $-6/e-(-3)=3-6/e=(3e-6)/e$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Midpoint Rule with $n=3$ subintervals to approximate $\\int_1^4 f(x)\\,dx$, given the table.<table class=\"exam-table\"><thead><tr><th>$x$</th><th>1</th><th>1.5</th><th>2</th><th>2.5</th><th>3</th><th>3.5</th><th>4</th></tr></thead><tbody><tr><td>$f(x)$</td><td>2</td><td>6</td><td>4</td><td>8</td><td>2</td><td>5</td><td>9</td></tr></tbody></table>|||Dùng Quy tắc Trung điểm với $n=3$ đoạn con để xấp xỉ $\\int_1^4 f(x)\\,dx$, theo bảng.<table class=\"exam-table\"><thead><tr><th>$x$</th><th>1</th><th>1.5</th><th>2</th><th>2.5</th><th>3</th><th>3.5</th><th>4</th></tr></thead><tbody><tr><td>$f(x)$</td><td>2</td><td>6</td><td>4</td><td>8</td><td>2</td><td>5</td><td>9</td></tr></tbody></table>",
          "options": [
            {
              "text": "13.5|||13.5"
            },
            {
              "text": "17|||17"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "15.25|||15.25"
            },
            {
              "text": "16.5|||16.5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=1$; subintervals $[1,2],[2,3],[3,4]$ with midpoints $1.5,2.5,3.5$: $f=6,8,5$. Sum $=1\\cdot(6+8+5)=19$.</div><div class=\"ml-vi\">$\\Delta x=1$; các đoạn $[1,2],[2,3],[3,4]$ có trung điểm $1.5,2.5,3.5$: $f=6,8,5$. Tổng $=1\\cdot(6+8+5)=19$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_1^{+\\infty}\\dfrac{1}{x\\sqrt{x}}\\,dx$.|||Tính $\\displaystyle\\int_1^{+\\infty}\\dfrac{1}{x\\sqrt{x}}\\,dx$.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "diverges|||phân kỳ"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\int_1^\\infty x^{-3/2}dx=[-2x^{-1/2}]_1^\\infty=0-(-2)=2$.</div><div class=\"ml-vi\">$\\int_1^\\infty x^{-3/2}dx=[-2x^{-1/2}]_1^\\infty=0-(-2)=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which matrices are reduced-row echelon?<br>(i) $\\begin{bmatrix}1&0&0&3\\\\0&0&1&5\\\\0&1&0&1\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&2&0&3&0\\\\0&0&1&1&0\\\\0&0&0&0&1\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&0&3&4\\\\0&1&0&1\\end{bmatrix}$ (iv) $\\begin{bmatrix}1&2&0&0\\\\0&1&0&1\\\\0&0&0&0\\end{bmatrix}$|||Ma trận nào ở dạng bậc thang rút gọn theo dòng (RREF)?<br>(i) $\\begin{bmatrix}1&0&0&3\\\\0&0&1&5\\\\0&1&0&1\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&2&0&3&0\\\\0&0&1&1&0\\\\0&0&0&0&1\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&0&3&4\\\\0&1&0&1\\end{bmatrix}$ (iv) $\\begin{bmatrix}1&2&0&0\\\\0&1&0&1\\\\0&0&0&0\\end{bmatrix}$",
          "options": [
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(ii), (iii) and (iv)|||(ii), (iii) và (iv)"
            },
            {
              "text": "(iii) and (iv)|||(iii) và (iv)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) leading 1s out of order (col 3 before col 2) — no. (iv) column of the row-2 leading 1 has a nonzero above it — no. (ii) and (iii) are RREF.</div><div class=\"ml-vi\">(i) các số 1 dẫn đầu sai thứ tự (cột 3 trước cột 2) — không. (iv) cột của số 1 dẫn đầu ở dòng 2 còn phần tử khác 0 phía trên — không. (ii) và (iii) là RREF.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "John and Joe earn a total of \\$39.5 when John works 2 hours and Joe works 3 hours. If John works 3 hours and Joe works 2 hours, they get \\$38. Find Joe's hourly rate (in dollars).|||John và Joe kiếm được tổng cộng \\$39.5 khi John làm 2 giờ và Joe làm 3 giờ. Nếu John làm 3 giờ và Joe làm 2 giờ, họ được \\$38. Tìm mức lương theo giờ của Joe (đô la).",
          "options": [
            {
              "text": "6.5|||6.5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "5.5|||5.5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "8.5|||8.5"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$2j+3e=39.5,\\ 3j+2e=38$. Solving: $5e=42.5\\Rightarrow e=8.5$.</div><div class=\"ml-vi\">$2j+3e=39.5,\\ 3j+2e=38$. Giải: $5e=42.5\\Rightarrow e=8.5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve the following system of linear equations: $\\begin{cases}x+y+z=2\\\\2x+3y-z=8\\\\x-y-z=-8\\end{cases}$|||Giải hệ phương trình tuyến tính sau: $\\begin{cases}x+y+z=2\\\\2x+3y-z=8\\\\x-y-z=-8\\end{cases}$",
          "options": [
            {
              "text": "$(-3;\\ 19/4;\\ 1/4)$|||$(-3;\\ 19/4;\\ 1/4)$"
            },
            {
              "text": "$(-3;\\ 17/4;\\ -1/4)$|||$(-3;\\ 17/4;\\ -1/4)$"
            },
            {
              "text": "$(3;\\ 19/4;\\ -1/4)$|||$(3;\\ 19/4;\\ -1/4)$"
            },
            {
              "text": "the system is inconsistent|||hệ vô nghiệm"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Add eq1+eq3: $2x=-6\\Rightarrow x=-3$; then $y+z=5$ and $3y-z=14\\Rightarrow y=19/4,\\ z=1/4$.</div><div class=\"ml-vi\">Cộng pt1+pt3: $2x=-6\\Rightarrow x=-3$; rồi $y+z=5$ và $3y-z=14\\Rightarrow y=19/4,\\ z=1/4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider a homogeneous system of 5 equations in 5 variables. Assume that the row-echelon form of $A$ has a row of zeros. How many solutions would it have?|||Xét một hệ thuần nhất gồm 5 phương trình với 5 ẩn. Giả sử dạng bậc thang dòng của $A$ có một dòng toàn số 0. Hệ có bao nhiêu nghiệm?",
          "options": [
            {
              "text": "Infinitely many solutions|||Vô số nghiệm"
            },
            {
              "text": "There is not enough information to conclude|||Không đủ thông tin để kết luận"
            },
            {
              "text": "No solution|||Vô nghiệm"
            },
            {
              "text": "Unique solution|||Nghiệm duy nhất"
            },
            {
              "text": "5 solutions|||5 nghiệm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A row of zeros means rank $<5$, so there is a free variable; a homogeneous system is always consistent → infinitely many solutions.</div><div class=\"ml-vi\">Một dòng toàn 0 nghĩa là hạng $<5$ nên có biến tự do; hệ thuần nhất luôn tương thích → vô số nghiệm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For matrices $A,B,C$ and a real number $k$, which of the following statements are correct?<br>(i) $A+B=A+C$ then $B$ and $C$ have the same size. (ii) If $kB=0$ then $k=0$ or $B=0$. (iii) If $A+B$ is symmetric then so are $A$ and $B$.|||Với các ma trận $A,B,C$ và số thực $k$, phát biểu nào đúng?<br>(i) $A+B=A+C$ thì $B$ và $C$ cùng cỡ. (ii) Nếu $kB=0$ thì $k=0$ hoặc $B=0$. (iii) Nếu $A+B$ đối xứng thì $A$ và $B$ cũng đối xứng.",
          "options": [
            {
              "text": "Only (i).|||Chỉ (i)."
            },
            {
              "text": "Only (i) and (ii).|||Chỉ (i) và (ii)."
            },
            {
              "text": "(i), (ii) and (iii)|||(i), (ii) và (iii)"
            },
            {
              "text": "Only (ii) and (iii)|||Chỉ (ii) và (iii)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) TRUE ($B=C$). (ii) TRUE (if $k\\ne0$ then $B=0$). (iii) FALSE (e.g. $A=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix},B=\\begin{bmatrix}0&0\\\\1&0\\end{bmatrix}$). Only (i) and (ii).</div><div class=\"ml-vi\">(i) ĐÚNG ($B=C$). (ii) ĐÚNG (nếu $k\\ne0$ thì $B=0$). (iii) SAI (ví dụ $A=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix},B=\\begin{bmatrix}0&0\\\\1&0\\end{bmatrix}$). Chỉ (i) và (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Write the following system in matrix form: $\\begin{cases}2x+y+z=1\\\\3x-y-z=0\\\\x+z=-1\\end{cases}$<br>(i) $\\begin{bmatrix}2&1&1\\\\3&-1&-1\\\\1&1&0\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (ii) $\\begin{bmatrix}2&3&1\\\\1&-1&0\\\\1&-1&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (iii) $\\begin{bmatrix}2&1&1\\\\3&-1&-1\\\\1&0&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (iv) $\\begin{bmatrix}2&3&1\\\\1&-1&1\\\\1&-1&0\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$|||Viết hệ sau dưới dạng ma trận: $\\begin{cases}2x+y+z=1\\\\3x-y-z=0\\\\x+z=-1\\end{cases}$<br>(i) $\\begin{bmatrix}2&1&1\\\\3&-1&-1\\\\1&1&0\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (ii) $\\begin{bmatrix}2&3&1\\\\1&-1&0\\\\1&-1&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (iii) $\\begin{bmatrix}2&1&1\\\\3&-1&-1\\\\1&0&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (iv) $\\begin{bmatrix}2&3&1\\\\1&-1&1\\\\1&-1&0\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$",
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
          "explanation": "<div class=\"ml-en\">The coefficient rows are $(2,1,1),(3,-1,-1),(1,0,1)$ (last row: $x+z=-1$) — matrix (iii).</div><div class=\"ml-vi\">Các dòng hệ số là $(2,1,1),(3,-1,-1),(1,0,1)$ (dòng cuối: $x+z=-1$) — ma trận (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the matrix $ABC$ can be formed where $A$ is $2\\times2$ and $C$ is $4\\times4$, what is the size of $A^2B$?|||Nếu tích $ABC$ lập được với $A$ cỡ $2\\times2$ và $C$ cỡ $4\\times4$, thì cỡ của $A^2B$ là bao nhiêu?",
          "options": [
            {
              "text": "$2\\times4$|||$2\\times4$"
            },
            {
              "text": "$4\\times4$|||$4\\times4$"
            },
            {
              "text": "$2\\times2$|||$2\\times2$"
            },
            {
              "text": "$4\\times2$|||$4\\times2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For $ABC$ defined, $B$ must be $2\\times4$. $A^2$ is $2\\times2$, so $A^2B$ is $2\\times4$.</div><div class=\"ml-vi\">Để $ABC$ xác định, $B$ phải là $2\\times4$. $A^2$ là $2\\times2$ nên $A^2B$ là $2\\times4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the matrix $A$ such that $(I+A^T)^{-1}=\\begin{bmatrix}1&2\\\\3&5\\end{bmatrix}$.<br>(i) $\\begin{bmatrix}-6&3\\\\2&-2\\end{bmatrix}$ (ii) $\\begin{bmatrix}6&-3\\\\-2&2\\end{bmatrix}$ (iii) $\\begin{bmatrix}-6&2\\\\3&-2\\end{bmatrix}$|||Tìm ma trận $A$ sao cho $(I+A^T)^{-1}=\\begin{bmatrix}1&2\\\\3&5\\end{bmatrix}$.<br>(i) $\\begin{bmatrix}-6&3\\\\2&-2\\end{bmatrix}$ (ii) $\\begin{bmatrix}6&-3\\\\-2&2\\end{bmatrix}$ (iii) $\\begin{bmatrix}-6&2\\\\3&-2\\end{bmatrix}$",
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
          "explanation": "<div class=\"ml-en\">$I+A^T=\\begin{bmatrix}1&2\\\\3&5\\end{bmatrix}^{-1}=\\begin{bmatrix}-5&2\\\\3&-1\\end{bmatrix}$, so $A^T=\\begin{bmatrix}-6&2\\\\3&-2\\end{bmatrix}$ and $A=\\begin{bmatrix}-6&3\\\\2&-2\\end{bmatrix}$ — (i).</div><div class=\"ml-vi\">$I+A^T=\\begin{bmatrix}1&2\\\\3&5\\end{bmatrix}^{-1}=\\begin{bmatrix}-5&2\\\\3&-1\\end{bmatrix}$ nên $A^T=\\begin{bmatrix}-6&2\\\\3&-2\\end{bmatrix}$ và $A=\\begin{bmatrix}-6&3\\\\2&-2\\end{bmatrix}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be a linear transformation such that $T\\!\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\begin{bmatrix}2\\\\3\\end{bmatrix}$ and $T\\!\\begin{bmatrix}1\\\\0\\end{bmatrix}=\\begin{bmatrix}1\\\\2\\end{bmatrix}$. Find the matrix of $T$.<br>(i) $\\begin{bmatrix}1&2\\\\2&3\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&1\\\\2&1\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&1\\\\1&2\\end{bmatrix}$|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ tuyến tính với $T\\!\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\begin{bmatrix}2\\\\3\\end{bmatrix}$ và $T\\!\\begin{bmatrix}1\\\\0\\end{bmatrix}=\\begin{bmatrix}1\\\\2\\end{bmatrix}$. Tìm ma trận của $T$.<br>(i) $\\begin{bmatrix}1&2\\\\2&3\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&1\\\\2&1\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&1\\\\1&2\\end{bmatrix}$",
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
              "text": "(iii)|||(iii)"
            },
            {
              "text": "None of them.|||Không câu nào."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Column 1 $=T(e_1)=[1,2]^T$. $T(e_2)=T([1,1])-T([1,0])=[2,3]-[1,2]=[1,1]^T$. Matrix $\\begin{bmatrix}1&1\\\\2&1\\end{bmatrix}$ — (ii).</div><div class=\"ml-vi\">Cột 1 $=T(e_1)=[1,2]^T$. $T(e_2)=T([1,1])-T([1,0])=[2,3]-[1,2]=[1,1]^T$. Ma trận $\\begin{bmatrix}1&1\\\\2&1\\end{bmatrix}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=(a_{ij})$ be the matrix of rotation in the plane through $\\pi/6$. Find $a_{22}$.<br>(i) $1/2$ (ii) $-1/2$ (iii) $\\dfrac{\\sqrt3}{2}$ (iv) $-\\dfrac{\\sqrt3}{2}$|||Cho $A=(a_{ij})$ là ma trận quay trong mặt phẳng góc $\\pi/6$. Tìm $a_{22}$.<br>(i) $1/2$ (ii) $-1/2$ (iii) $\\dfrac{\\sqrt3}{2}$ (iv) $-\\dfrac{\\sqrt3}{2}$",
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
          "explanation": "<div class=\"ml-en\">Rotation matrix $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$; $a_{22}=\\cos(\\pi/6)=\\dfrac{\\sqrt3}{2}$ — (iii).</div><div class=\"ml-vi\">Ma trận quay $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$; $a_{22}=\\cos(\\pi/6)=\\dfrac{\\sqrt3}{2}$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the $(1,2)$-cofactor of the matrix $\\begin{bmatrix}1&2&3\\\\4&-1&5\\\\0&7&6\\end{bmatrix}$.|||Tìm phần bù đại số (cofactor) vị trí $(1,2)$ của ma trận $\\begin{bmatrix}1&2&3\\\\4&-1&5\\\\0&7&6\\end{bmatrix}$.",
          "options": [
            {
              "text": "-3|||-3"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "-24|||-24"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$C_{12}=(-1)^{1+2}\\det\\begin{bmatrix}4&5\\\\0&6\\end{bmatrix}=-(24)=-24$.</div><div class=\"ml-vi\">$C_{12}=(-1)^{1+2}\\det\\begin{bmatrix}4&5\\\\0&6\\end{bmatrix}=-(24)=-24$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For any $3\\times3$ matrices $A,B$ such that $|A|=3,\\ |B|=-2$, calculate $|3A^{-1}B^{T}|$.|||Với mọi ma trận $3\\times3$ $A,B$ thỏa $|A|=3,\\ |B|=-2$, tính $|3A^{-1}B^{T}|$.",
          "options": [
            {
              "text": "-18|||-18"
            },
            {
              "text": "18|||18"
            },
            {
              "text": "-162|||-162"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-54|||-54"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$|3A^{-1}B^{T}|=3^3\\cdot\\dfrac{1}{|A|}\\cdot|B|=27\\cdot\\dfrac13\\cdot(-2)=-18$.</div><div class=\"ml-vi\">$|3A^{-1}B^{T}|=3^3\\cdot\\dfrac{1}{|A|}\\cdot|B|=27\\cdot\\dfrac13\\cdot(-2)=-18$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}a&a&a\\\\x&y&z\\\\b&b&b\\end{bmatrix}$, where $a,b,x,y,z$ are real numbers. Find the second column of $\\operatorname{adj}(A)$.<br>(i) $\\begin{bmatrix}bz-bx\\\\0\\\\ax-az\\end{bmatrix}$ (ii) $\\begin{bmatrix}bx-bz\\\\0\\\\az-ax\\end{bmatrix}$ (iii) $\\begin{bmatrix}0\\\\0\\\\0\\end{bmatrix}$|||Cho $A=\\begin{bmatrix}a&a&a\\\\x&y&z\\\\b&b&b\\end{bmatrix}$, với $a,b,x,y,z$ là số thực. Tìm cột thứ hai của $\\operatorname{adj}(A)$.<br>(i) $\\begin{bmatrix}bz-bx\\\\0\\\\ax-az\\end{bmatrix}$ (ii) $\\begin{bmatrix}bx-bz\\\\0\\\\az-ax\\end{bmatrix}$ (iii) $\\begin{bmatrix}0\\\\0\\\\0\\end{bmatrix}$",
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
              "text": "All of the other choices are incorrect|||Tất cả đều sai"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The second column of $\\operatorname{adj}(A)$ consists of the row-2 cofactors $C_{21},C_{22},C_{23}$. Each minor deletes row 2, leaving rows $(a,a,a),(b,b,b)$ whose $2\\times2$ dets are all $0$, so the column is $[0,0,0]^T$ — (iii).</div><div class=\"ml-vi\">Cột thứ hai của $\\operatorname{adj}(A)$ gồm các cofactor dòng 2: $C_{21},C_{22},C_{23}$. Mỗi minor bỏ dòng 2, còn lại các dòng $(a,a,a),(b,b,b)$ có mọi định thức $2\\times2$ bằng $0$, nên cột là $[0,0,0]^T$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the characteristic polynomial of the matrix $\\begin{bmatrix}1&1\\\\0&2\\end{bmatrix}$.<br>(i) $x^2+3x-2$ (ii) $x^2-3x+2$ (iii) $x^2-3x+1$ (iv) $x^2+3x-1$|||Tìm đa thức đặc trưng của ma trận $\\begin{bmatrix}1&1\\\\0&2\\end{bmatrix}$.<br>(i) $x^2+3x-2$ (ii) $x^2-3x+2$ (iii) $x^2-3x+1$ (iv) $x^2+3x-1$",
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
          "explanation": "<div class=\"ml-en\">$\\det(A-xI)=(1-x)(2-x)=x^2-3x+2$ — (ii).</div><div class=\"ml-vi\">$\\det(A-xI)=(1-x)(2-x)=x^2-3x+2$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $A=\\begin{bmatrix}1&4\\\\2&3\\end{bmatrix}$. Which of the following statements is true?|||Cho $A=\\begin{bmatrix}1&4\\\\2&3\\end{bmatrix}$. Phát biểu nào sau đây đúng?",
          "options": [
            {
              "text": "3 is an eigenvalue|||3 là giá trị riêng"
            },
            {
              "text": "4 is an eigenvalue|||4 là giá trị riêng"
            },
            {
              "text": "5 is an eigenvalue|||5 là giá trị riêng"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\det(A-xI)=x^2-4x-5=(x-5)(x+1)$, eigenvalues $5,-1$; so $5$ is an eigenvalue.</div><div class=\"ml-vi\">$\\det(A-xI)=x^2-4x-5=(x-5)(x+1)$, giá trị riêng $5,-1$; nên $5$ là giá trị riêng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $L$ be the line through $A(1,2,1)$ parallel to the line $x=2-t,\\ y=4+3t,\\ z=2t$. Which of the following points lie in $L$? $P(3,-4,-3),\\ Q(3,6,1)$.|||Cho $L$ là đường thẳng qua $A(1,2,1)$ song song với đường $x=2-t,\\ y=4+3t,\\ z=2t$. Điểm nào nằm trên $L$? $P(3,-4,-3),\\ Q(3,6,1)$.",
          "options": [
            {
              "text": "Both $P$ and $Q$|||Cả $P$ và $Q$"
            },
            {
              "text": "Only $P$|||Chỉ $P$"
            },
            {
              "text": "Only $Q$|||Chỉ $Q$"
            },
            {
              "text": "None of $P$ and $Q$|||Không điểm nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Direction $(-1,3,2)$, $L:(1-t,2+3t,1+2t)$. $P$: $t=-2$ gives $(3,-4,-3)$ ✓; $Q$ fails. Only $P$.</div><div class=\"ml-vi\">Vector chỉ phương $(-1,3,2)$, $L:(1-t,2+3t,1+2t)$. $P$: $t=-2$ cho $(3,-4,-3)$ ✓; $Q$ không. Chỉ $P$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find an equation describing the plane passing through $(6,0,2)$ and perpendicular to the line of intersection of the planes $x+y-2z=4$ and $3x-2y+z=1$.|||Tìm phương trình mặt phẳng qua $(6,0,2)$ và vuông góc với giao tuyến của hai mặt phẳng $x+y-2z=4$ và $3x-2y+z=1$.",
          "options": [
            {
              "text": "$3x+7y+5z=28$|||$3x+7y+5z=28$"
            },
            {
              "text": "$3x-7y-5z=28$|||$3x-7y-5z=28$"
            },
            {
              "text": "$3x-7y-5z=-28$|||$3x-7y-5z=-28$"
            },
            {
              "text": "$3x+7y+5z=-28$|||$3x+7y+5z=-28$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Line direction $=n_1\\times n_2=(1,1,-2)\\times(3,-2,1)=(-3,-7,-5)$. Plane with normal $(3,7,5)$ through $(6,0,2)$: $3x+7y+5z=28$.</div><div class=\"ml-vi\">Vector chỉ phương giao tuyến $=n_1\\times n_2=(1,1,-2)\\times(3,-2,1)=(-3,-7,-5)$. Mặt phẳng pháp $(3,7,5)$ qua $(6,0,2)$: $3x+7y+5z=28$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the distance from the point $(1,-2,3)$ to the plane $2x-y-z=6$.<br>(i) $\\dfrac{\\sqrt6}{6}$ (ii) $\\dfrac{5\\sqrt6}{6}$ (iii) $\\dfrac{2\\sqrt3}{3}$ (iv) $\\dfrac{\\sqrt2}{2}$|||Tìm khoảng cách từ điểm $(1,-2,3)$ đến mặt phẳng $2x-y-z=6$.<br>(i) $\\dfrac{\\sqrt6}{6}$ (ii) $\\dfrac{5\\sqrt6}{6}$ (iii) $\\dfrac{2\\sqrt3}{3}$ (iv) $\\dfrac{\\sqrt2}{2}$",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">$d=\\dfrac{|2(1)-(-2)-3-6|}{\\sqrt{4+1+1}}=\\dfrac{5}{\\sqrt6}=\\dfrac{5\\sqrt6}{6}$ — (ii).</div><div class=\"ml-vi\">$d=\\dfrac{|2(1)-(-2)-3-6|}{\\sqrt{4+1+1}}=\\dfrac{5}{\\sqrt6}=\\dfrac{5\\sqrt6}{6}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the area of the parallelogram $ABCD$ given that $A=(2,1,-2),\\ B=(1,1,0)$ and $C=(-5,7,11)$.<br>(i) $\\dfrac{\\sqrt{181}}{2}$ (ii) $\\sqrt{181}$ (iii) $181$ (iv) $\\dfrac{181}{2}$ (v) $\\dfrac{181}{4}$|||Tìm diện tích hình bình hành $ABCD$ biết $A=(2,1,-2),\\ B=(1,1,0)$ và $C=(-5,7,11)$.<br>(i) $\\dfrac{\\sqrt{181}}{2}$ (ii) $\\sqrt{181}$ (iii) $181$ (iv) $\\dfrac{181}{2}$ (v) $\\dfrac{181}{4}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(v)|||(v)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\vec{AB}=(-1,0,2),\\ \\vec{BC}=(-6,6,11)$; $\\vec{AB}\\times\\vec{BC}=(-12,-1,-6)$, area $=\\sqrt{144+1+36}=\\sqrt{181}$ — (ii).</div><div class=\"ml-vi\">$\\vec{AB}=(-1,0,2),\\ \\vec{BC}=(-6,6,11)$; $\\vec{AB}\\times\\vec{BC}=(-12,-1,-6)$, diện tích $=\\sqrt{144+1+36}=\\sqrt{181}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$, $T([x,y]^T)=\\tfrac12\\big([\\,x-\\sqrt3\\,y,\\ \\sqrt3\\,x+y\\,]^T\\big)$. Determine whether $T$ is a rotation, a projection on a line, or a reflection in a line.|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$, $T([x,y]^T)=\\tfrac12\\big([\\,x-\\sqrt3\\,y,\\ \\sqrt3\\,x+y\\,]^T\\big)$. Xác định $T$ là phép quay, phép chiếu lên đường thẳng, hay phép phản chiếu qua đường thẳng.",
          "options": [
            {
              "text": "$T$ is a rotation|||$T$ là phép quay"
            },
            {
              "text": "$T$ is a projection on a line|||$T$ là phép chiếu lên đường thẳng"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$T$ is a reflection in a line|||$T$ là phép phản chiếu qua đường thẳng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Matrix $\\begin{bmatrix}1/2&-\\sqrt3/2\\\\\\sqrt3/2&1/2\\end{bmatrix}=\\begin{bmatrix}\\cos60^\\circ&-\\sin60^\\circ\\\\\\sin60^\\circ&\\cos60^\\circ\\end{bmatrix}$, $\\det=1$: a rotation.</div><div class=\"ml-vi\">Ma trận $\\begin{bmatrix}1/2&-\\sqrt3/2\\\\\\sqrt3/2&1/2\\end{bmatrix}=\\begin{bmatrix}\\cos60^\\circ&-\\sin60^\\circ\\\\\\sin60^\\circ&\\cos60^\\circ\\end{bmatrix}$, $\\det=1$: phép quay.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $u=(0,1,1),\\ v=(1,1,-1)$ be vectors. Which of the following vectors belong to $\\operatorname{span}\\{u,v\\}$? $x=(1,3,-1),\\ y=(0,2,3)$.|||Cho $u=(0,1,1),\\ v=(1,1,-1)$. Vector nào sau đây thuộc $\\operatorname{span}\\{u,v\\}$? $x=(1,3,-1),\\ y=(0,2,3)$.",
          "options": [
            {
              "text": "Both $x$ and $y$|||Cả $x$ và $y$"
            },
            {
              "text": "Only $x$|||Chỉ $x$"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả đều sai"
            },
            {
              "text": "Only $y$|||Chỉ $y$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$au+bv=(b,a+b,a-b)$. For $x$: $b=1,a=2$ but $a-b=1\\ne-1$. For $y$: $b=0,a=2$ but $a-b=2\\ne3$. Neither belongs.</div><div class=\"ml-vi\">$au+bv=(b,a+b,a-b)$. Với $x$: $b=1,a=2$ nhưng $a-b=1\\ne-1$. Với $y$: $b=0,a=2$ nhưng $a-b=2\\ne3$. Không vector nào thuộc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are true?<br>(i) $(3,4,2)$ is a linear combination of $(1,1,1)$ and $(0,1,-1)$. (ii) If $\\{u,v\\}$ is a spanning set of a subspace $U$ then $\\{2u,3v\\}$ is also a spanning set of $U$.|||Phát biểu nào sau đây đúng?<br>(i) $(3,4,2)$ là tổ hợp tuyến tính của $(1,1,1)$ và $(0,1,-1)$. (ii) Nếu $\\{u,v\\}$ là tập sinh của không gian con $U$ thì $\\{2u,3v\\}$ cũng là tập sinh của $U$.",
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
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) $(3,4,2)=3(1,1,1)+1(0,1,-1)$ — TRUE. (ii) scaling by nonzero scalars preserves span — TRUE. Both.</div><div class=\"ml-vi\">(i) $(3,4,2)=3(1,1,1)+1(0,1,-1)$ — ĐÚNG. (ii) nhân với vô hướng khác 0 giữ nguyên span — ĐÚNG. Cả hai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{X,Y\\}$ be a basis of a subspace $U$ of $\\mathbb{R}^3$ and $V=\\operatorname{span}\\{3X+Y,\\ -X+2Y,\\ Y\\}$. What is the dimension of $V$?|||Cho $\\{X,Y\\}$ là cơ sở của không gian con $U$ của $\\mathbb{R}^3$ và $V=\\operatorname{span}\\{3X+Y,\\ -X+2Y,\\ Y\\}$. Số chiều của $V$ là bao nhiêu?",
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
          "explanation": "<div class=\"ml-en\">All three generators lie in $U=\\operatorname{span}\\{X,Y\\}$, and from $Y$ and $3X+Y$ we recover $X$, so $V=U$, $\\dim V=2$.</div><div class=\"ml-vi\">Cả ba vector sinh đều nằm trong $U=\\operatorname{span}\\{X,Y\\}$, và từ $Y$ và $3X+Y$ ta suy ra $X$, nên $V=U$, $\\dim V=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the dimension of the solution space of the system $x+y+z=0,\\ x+2y=0,\\ y-z=0$?|||Số chiều của không gian nghiệm của hệ $x+y+z=0,\\ x+2y=0,\\ y-z=0$ là bao nhiêu?",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">The coefficient matrix has rank 2 (row 3 $=$ row 2 $-$ row 1), so nullity $=3-2=1$.</div><div class=\"ml-vi\">Ma trận hệ số có hạng 2 (dòng 3 $=$ dòng 2 $-$ dòng 1) nên số chiều nghiệm $=3-2=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $X,Y$ be vectors in $\\mathbb{R}^n$ such that $\\|X\\|=4,\\ \\|Y\\|=3,\\ X\\cdot Y=-2$. Compute $\\|2X-3Y\\|$.|||Cho $X,Y$ là các vector trong $\\mathbb{R}^n$ với $\\|X\\|=4,\\ \\|Y\\|=3,\\ X\\cdot Y=-2$. Tính $\\|2X-3Y\\|$.",
          "options": [
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "13|||13"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\|2X-3Y\\|^2=4\\|X\\|^2-12(X\\cdot Y)+9\\|Y\\|^2=64+24+81=169$, so $\\|2X-3Y\\|=13$.</div><div class=\"ml-vi\">$\\|2X-3Y\\|^2=4\\|X\\|^2-12(X\\cdot Y)+9\\|Y\\|^2=64+24+81=169$ nên $\\|2X-3Y\\|=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $30\\times70$ matrix having $\\operatorname{rank}A=20$. Find $\\dim(\\operatorname{Col}(A))$, $\\dim(\\operatorname{Row}(A))$ and $\\dim(\\operatorname{Null}(A))$.|||Cho $A$ là ma trận $30\\times70$ có $\\operatorname{rank}A=20$. Tìm $\\dim(\\operatorname{Col}(A))$, $\\dim(\\operatorname{Row}(A))$ và $\\dim(\\operatorname{Null}(A))$.",
          "options": [
            {
              "text": "70, 30, 20|||70, 30, 20"
            },
            {
              "text": "20, 20, 40|||20, 20, 40"
            },
            {
              "text": "20, 30, 50|||20, 30, 50"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\dim\\operatorname{Col}=\\dim\\operatorname{Row}=\\operatorname{rank}=20$; $\\dim\\operatorname{Null}=70-20=50$. So $(20,20,50)$, which is none of the listed options.</div><div class=\"ml-vi\">$\\dim\\operatorname{Col}=\\dim\\operatorname{Row}=\\operatorname{rank}=20$; $\\dim\\operatorname{Null}=70-20=50$. Vậy $(20,20,50)$, không trùng lựa chọn nào được liệt kê.</div>"
        }
      ]
    }
  ]
};
