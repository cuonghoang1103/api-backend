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
      "description": "MAE101 real FE multiple-choice paper, transcribed from the exam images; answers reasoned here. Four questions that the narrow scan had cropped were replaced by equivalent questions written for this bank. (50 questions)|||Đề trắc nghiệm FE thật môn MAE101, chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. Bốn câu bị ảnh quét cắt mất dữ liệu đã được thay bằng câu tương đương do chúng tôi soạn. (50 câu)",
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
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The table below gives the values of a function $f$ at five equally spaced points on $[0,4]$. Use Simpson's rule with $n=4$ to approximate $\\displaystyle\\int_0^4 f(x)\\,dx$.<table class=\"exam-table\"><thead><tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>f(x)</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr></tbody></table>|||Bảng dưới đây cho giá trị của hàm $f$ tại năm điểm cách đều trên $[0,4]$. Dùng quy tắc Simpson với $n=4$ để xấp xỉ $\\displaystyle\\int_0^4 f(x)\\,dx$.<table class=\"exam-table\"><thead><tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>f(x)</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr></tbody></table>",
          "options": [
            {
              "text": "12|||12"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "14|||14"
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
          "explanation": "<div class=\"ml-en\">Here $h=\\dfrac{4-0}{4}=1$ and Simpson's rule uses the weights $1,4,2,4,1$: $\\dfrac{h}{3}\\big(f(0)+4f(1)+2f(2)+4f(3)+f(4)\\big)=\\dfrac13(1+8+6+16+5)=\\dfrac{36}{3}=12$. A common error is to use the trapezoidal weights $1,2,2,2,1$ instead.</div><div class=\"ml-vi\">Ở đây $h=\\dfrac{4-0}{4}=1$ và quy tắc Simpson dùng bộ trọng số $1,4,2,4,1$: $\\dfrac{h}{3}\\big(f(0)+4f(1)+2f(2)+4f(3)+f(4)\\big)=\\dfrac13(1+8+6+16+5)=\\dfrac{36}{3}=12$. Lỗi thường gặp là dùng nhầm trọng số hình thang $1,2,2,2,1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_1^4 \\dfrac{1}{\\sqrt{x}}\\,dx$.|||Tính $\\displaystyle\\int_1^4 \\dfrac{1}{\\sqrt{x}}\\,dx$.",
          "options": [
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
              "text": "$\\dfrac12$|||$\\dfrac12$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Write the integrand as $x^{-1/2}$; an antiderivative is $2x^{1/2}=2\\sqrt{x}$. Then $\\big[2\\sqrt{x}\\big]_1^4=2(2)-2(1)=2$.</div><div class=\"ml-vi\">Viết hàm dưới dấu tích phân thành $x^{-1/2}$; một nguyên hàm là $2x^{1/2}=2\\sqrt{x}$. Khi đó $\\big[2\\sqrt{x}\\big]_1^4=2(2)-2(1)=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An object cools so that its temperature after $t$ minutes is $T(t)=20+60e^{-0.05t}$ (degrees Celsius). How fast is the temperature changing at $t=0$?|||Một vật nguội đi sao cho nhiệt độ sau $t$ phút là $T(t)=20+60e^{-0.05t}$ (độ C). Nhiệt độ đang thay đổi nhanh thế nào tại $t=0$?",
          "options": [
            {
              "text": "$-3$ degrees per minute|||$-3$ độ mỗi phút"
            },
            {
              "text": "$-0.05$ degrees per minute|||$-0.05$ độ mỗi phút"
            },
            {
              "text": "$-60$ degrees per minute|||$-60$ độ mỗi phút"
            },
            {
              "text": "$3$ degrees per minute|||$3$ độ mỗi phút"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$T'(t)=60\\cdot(-0.05)e^{-0.05t}=-3e^{-0.05t}$, so $T'(0)=-3$. The sign is negative because the object is cooling; the constant 20 is the ambient temperature and does not affect the rate.</div><div class=\"ml-vi\">$T'(t)=60\\cdot(-0.05)e^{-0.05t}=-3e^{-0.05t}$, nên $T'(0)=-3$. Dấu âm vì vật đang nguội đi; hằng số 20 là nhiệt độ môi trường và không ảnh hưởng tới tốc độ biến thiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following vectors belongs to $\\text{span}\\{(1,0,1),\\ (0,1,1)\\}$?|||Vectơ nào sau đây thuộc $\\text{span}\\{(1,0,1),\\ (0,1,1)\\}$?",
          "options": [
            {
              "text": "$(2,3,5)$|||$(2,3,5)$"
            },
            {
              "text": "$(1,1,1)$|||$(1,1,1)$"
            },
            {
              "text": "$(1,2,4)$|||$(1,2,4)$"
            },
            {
              "text": "$(0,0,1)$|||$(0,0,1)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A combination $a(1,0,1)+b(0,1,1)=(a,\\ b,\\ a+b)$, so a vector lies in the span exactly when its third component is the sum of the first two. Only $(2,3,5)$ satisfies $2+3=5$; the others fail: $1+1\\ne1$, $1+2\\ne4$ and $0+0\\ne1$.</div><div class=\"ml-vi\">Tổ hợp $a(1,0,1)+b(0,1,1)=(a,\\ b,\\ a+b)$, nên một vectơ thuộc không gian sinh đúng khi thành phần thứ ba bằng tổng hai thành phần đầu. Chỉ $(2,3,5)$ thoả $2+3=5$; các vectơ khác đều sai: $1+1\\ne1$, $1+2\\ne4$ và $0+0\\ne1$.</div>"
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
          "prompt": "John and Joe earn a total of USD 39.5 when John works 2 hours and Joe works 3 hours. If John works 3 hours and Joe works 2 hours, they get USD 38. Find Joe's hourly rate (in dollars).|||John và Joe kiếm được tổng cộng 39.5 USD khi John làm 2 giờ và Joe làm 3 giờ. Nếu John làm 3 giờ và Joe làm 2 giờ, họ được 38 USD. Tìm mức lương theo giờ của Joe (đô la).",
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
    },
    {
      "kind": "FE",
      "code": "MAE-D3",
      "source": "REAL",
      "sortOrder": 2,
      "title": "Đề 3 — Final Exam|||Đề 3 — Thi cuối kỳ",
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
          "prompt": "Find the function $f\\circ g(x)$ for $f(x)=\\dfrac{1}{x^2+1}$, $g(x)=e^{x}$.<br>(i) $\\dfrac{1}{e^{2x}+1}$ (ii) $\\dfrac{1}{(e^{x}+1)^2}$ (iii) $\\dfrac{1}{2e^{x}+1}$ (iv) $\\dfrac{2}{e^{2x}+1}$|||Tìm hàm $f\\circ g(x)$ với $f(x)=\\dfrac{1}{x^2+1}$, $g(x)=e^{x}$.<br>(i) $\\dfrac{1}{e^{2x}+1}$ (ii) $\\dfrac{1}{(e^{x}+1)^2}$ (iii) $\\dfrac{1}{2e^{x}+1}$ (iv) $\\dfrac{2}{e^{2x}+1}$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of them|||Không phương án nào"
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
            4
          ],
          "explanation": "<div class=\"ml-en\">$f(g(x))=\\dfrac{1}{(e^{x})^2+1}=\\dfrac{1}{e^{2x}+1}$ — that is (i).</div><div class=\"ml-vi\">$f(g(x))=\\dfrac{1}{(e^{x})^2+1}=\\dfrac{1}{e^{2x}+1}$ — chính là (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Describe how the graph of $y=-f(x)+3$ is obtained from the graph of $y=f(x)$.|||Mô tả cách nhận được đồ thị $y=-f(x)+3$ từ đồ thị $y=f(x)$.",
          "options": [
            {
              "text": "Reflect about the x-axis, and then shift 3 units upward|||Đối xứng qua trục Ox, rồi tịnh tiến lên trên 3 đơn vị"
            },
            {
              "text": "Reflect about the y-axis, and then shift 3 units upward|||Đối xứng qua trục Oy, rồi tịnh tiến lên trên 3 đơn vị"
            },
            {
              "text": "Reflect about the x-axis, and then shift 3 units downward|||Đối xứng qua trục Ox, rồi tịnh tiến xuống dưới 3 đơn vị"
            },
            {
              "text": "Reflect about the y-axis, and then shift 3 units downward|||Đối xứng qua trục Oy, rồi tịnh tiến xuống dưới 3 đơn vị"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$-f(x)$ flips the graph vertically (reflection in the $x$-axis); adding $+3$ then shifts it 3 units up.</div><div class=\"ml-vi\">$-f(x)$ lật đồ thị theo phương đứng (đối xứng qua trục $Ox$); cộng thêm $+3$ tịnh tiến lên trên 3 đơn vị.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to1^{+}}\\dfrac{\\left|x^2-4x+3\\right|}{x-1}$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to1^{+}}\\dfrac{\\left|x^2-4x+3\\right|}{x-1}$",
          "options": [
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
            4
          ],
          "explanation": "<div class=\"ml-en\">$x^2-4x+3=(x-1)(x-3)$. For $x\\to1^{+}$: $x-1\\gt0$ and $x-3\\lt0$, so the product is negative and $|x^2-4x+3|=(x-1)(3-x)$. The quotient is $3-x\\to2$.</div><div class=\"ml-vi\">$x^2-4x+3=(x-1)(x-3)$. Khi $x\\to1^{+}$: $x-1\\gt0$ và $x-3\\lt0$ nên tích âm, do đó $|x^2-4x+3|=(x-1)(3-x)$. Thương bằng $3-x\\to2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the constant $c$ that makes $f$ continuous on $(-\\infty,\\infty)$: $f(x)=\\begin{cases}x+c & \\text{if } x\\leq 0\\\\ 2x+1 & \\text{if } x\\gt 0\\end{cases}$|||Tìm hằng số $c$ để $f$ liên tục trên $(-\\infty,\\infty)$: $f(x)=\\begin{cases}x+c & \\text{nếu } x\\leq 0\\\\ 2x+1 & \\text{nếu } x\\gt 0\\end{cases}$",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "$c$ doesn't exist|||Không tồn tại $c$"
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
          "explanation": "<div class=\"ml-en\">Continuity at $x=0$ needs $\\lim_{x\\to0^{-}}f=f(0)=c$ and $\\lim_{x\\to0^{+}}f=1$, so $c=1$.</div><div class=\"ml-vi\">Liên tục tại $x=0$ đòi hỏi $\\lim_{x\\to0^{-}}f=f(0)=c$ và $\\lim_{x\\to0^{+}}f=1$, suy ra $c=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For $f(x)=3x^2-4x+1$, which of the following limits is $f'(2)$?<br>(i) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(3x+2)}{x-2}$ (ii) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(2x+3)}{x-2}$ (iii) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(x+5)}{x-2}$ (iv) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(5x+1)}{x-2}$|||Với $f(x)=3x^2-4x+1$, giới hạn nào sau đây bằng $f'(2)$?<br>(i) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(3x+2)}{x-2}$ (ii) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(2x+3)}{x-2}$ (iii) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(x+5)}{x-2}$ (iv) $\\displaystyle\\lim_{x\\to2}\\dfrac{(x-2)(5x+1)}{x-2}$",
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
          "explanation": "<div class=\"ml-en\">$f'(2)=\\lim_{x\\to2}\\dfrac{f(x)-f(2)}{x-2}$ with $f(2)=5$: $f(x)-5=3x^2-4x-4=(x-2)(3x+2)$ — that is (i) (its value is $8$).</div><div class=\"ml-vi\">$f'(2)=\\lim_{x\\to2}\\dfrac{f(x)-f(2)}{x-2}$ với $f(2)=5$: $f(x)-5=3x^2-4x-4=(x-2)(3x+2)$ — chính là (i) (giá trị bằng $8$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all the values of $x$ where the tangent line to the graph of the function $f(x)=x^2+\\sqrt{x}$ is horizontal.|||Tìm tất cả giá trị $x$ mà tiếp tuyến của đồ thị hàm $f(x)=x^2+\\sqrt{x}$ nằm ngang.",
          "options": [
            {
              "text": "5/6|||5/6"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "1/6|||1/6"
            },
            {
              "text": "Does not exist|||Không tồn tại"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=2x+\\dfrac{1}{2\\sqrt{x}}$ on the domain $x\\gt0$; both terms are positive there, so $f'(x)\\gt0$ always and never vanishes (at $x=0$ the derivative is undefined). No such $x$ exists.</div><div class=\"ml-vi\">$f'(x)=2x+\\dfrac{1}{2\\sqrt{x}}$ trên miền $x\\gt0$; cả hai hạng tử đều dương nên $f'(x)\\gt0$ luôn, không bao giờ bằng 0 (tại $x=0$ đạo hàm không xác định). Không có $x$ nào thoả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A rock is dropped from a height of 100 meters. Its height above ground at time $t$ seconds later is given by $s(t)=-4t^2+100$, $0\\leq t\\leq5$. Find its instantaneous velocity at 2 seconds after it is dropped.|||Một hòn đá được thả từ độ cao 100 mét. Độ cao so với mặt đất tại thời điểm $t$ giây là $s(t)=-4t^2+100$, $0\\leq t\\leq5$. Tìm vận tốc tức thời tại giây thứ 2 sau khi thả.",
          "options": [
            {
              "text": "-16 (m/s)|||-16 (m/s)"
            },
            {
              "text": "16 (m/s)|||16 (m/s)"
            },
            {
              "text": "-84 (m/s)|||-84 (m/s)"
            },
            {
              "text": "84 (m/s)|||84 (m/s)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$v(t)=s'(t)=-8t$, so $v(2)=-16$ m/s (negative = falling).</div><div class=\"ml-vi\">$v(t)=s'(t)=-8t$, nên $v(2)=-16$ m/s (dấu âm = đang rơi xuống).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For $f(x)=\\sin 6x$, find $f^{(2023)}(x)$.<br>(i) $-6^{2023}\\sin(6x)$ (ii) $6^{2023}\\cos(6x)$ (iii) $-6^{2023}\\cos(6x)$ (iv) $6^{2023}\\sin(6x)$|||Với $f(x)=\\sin 6x$, tìm $f^{(2023)}(x)$.<br>(i) $-6^{2023}\\sin(6x)$ (ii) $6^{2023}\\cos(6x)$ (iii) $-6^{2023}\\cos(6x)$ (iv) $6^{2023}\\sin(6x)$",
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
          "explanation": "<div class=\"ml-en\">$f^{(n)}(x)=6^{n}\\sin\\!\\left(6x+\\dfrac{n\\pi}{2}\\right)$. Since $2023=4\\cdot505+3$, the phase is $\\dfrac{3\\pi}{2}$ and $\\sin\\!\\left(6x+\\dfrac{3\\pi}{2}\\right)=-\\cos 6x$, giving $-6^{2023}\\cos(6x)$ — (iii).</div><div class=\"ml-vi\">$f^{(n)}(x)=6^{n}\\sin\\!\\left(6x+\\dfrac{n\\pi}{2}\\right)$. Vì $2023=4\\cdot505+3$ nên pha là $\\dfrac{3\\pi}{2}$ và $\\sin\\!\\left(6x+\\dfrac{3\\pi}{2}\\right)=-\\cos 6x$, được $-6^{2023}\\cos(6x)$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $dy/dx$ by implicit differentiation: $y^2-xy+x^2=7$.|||Tìm $dy/dx$ bằng đạo hàm hàm ẩn: $y^2-xy+x^2=7$.",
          "options": [
            {
              "text": "$(2x+y)/(x+2y)$|||$(2x+y)/(x+2y)$"
            },
            {
              "text": "$(2x-y)/(x+2y)$|||$(2x-y)/(x+2y)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$(2x+y)/(x-2y)$|||$(2x+y)/(x-2y)$"
            },
            {
              "text": "$(2x-y)/(x-2y)$|||$(2x-y)/(x-2y)$"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Differentiate: $2yy'-(y+xy')+2x=0\\Rightarrow y'(2y-x)=y-2x\\Rightarrow y'=\\dfrac{y-2x}{2y-x}=\\dfrac{2x-y}{x-2y}$.</div><div class=\"ml-vi\">Đạo hàm hai vế: $2yy'-(y+xy')+2x=0\\Rightarrow y'(2y-x)=y-2x\\Rightarrow y'=\\dfrac{y-2x}{2y-x}=\\dfrac{2x-y}{x-2y}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A particle moves along the curve $y^2=1+x^3$. As it reaches the point $(2,3)$, the $y$-coordinate is increasing at a rate of 4 cm/s. How fast is the $x$-coordinate of the point changing at that instant?|||Một chất điểm chuyển động trên đường cong $y^2=1+x^3$. Khi đến điểm $(2,3)$, tung độ $y$ đang tăng với tốc độ 4 cm/s. Hoành độ $x$ đang thay đổi nhanh thế nào tại thời điểm đó?",
          "options": [
            {
              "text": "2 cm/s|||2 cm/s"
            },
            {
              "text": "2/9 cm/s|||2/9 cm/s"
            },
            {
              "text": "1/9 cm/s|||1/9 cm/s"
            },
            {
              "text": "1 cm/s|||1 cm/s"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Differentiate with respect to $t$: $2y\\dfrac{dy}{dt}=3x^2\\dfrac{dx}{dt}$. At $(2,3)$: $2(3)(4)=3(4)\\dfrac{dx}{dt}\\Rightarrow 24=12\\dfrac{dx}{dt}\\Rightarrow \\dfrac{dx}{dt}=2$ cm/s.</div><div class=\"ml-vi\">Đạo hàm theo $t$: $2y\\dfrac{dy}{dt}=3x^2\\dfrac{dx}{dt}$. Tại $(2,3)$: $2(3)(4)=3(4)\\dfrac{dx}{dt}\\Rightarrow 24=12\\dfrac{dx}{dt}\\Rightarrow \\dfrac{dx}{dt}=2$ cm/s.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a linear approximation for $f(x)=e^{2x}$ at $x=1$.<br>(i) $2e^{2}x-e^{2}$ (ii) $2e^{2}x+e^{2}$ (iii) $e^{2}x-e^{2}$ (iv) $e^{2}x+e^{2}$|||Tìm xấp xỉ tuyến tính của $f(x)=e^{2x}$ tại $x=1$.<br>(i) $2e^{2}x-e^{2}$ (ii) $2e^{2}x+e^{2}$ (iii) $e^{2}x-e^{2}$ (iv) $e^{2}x+e^{2}$",
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
          "explanation": "<div class=\"ml-en\">$f(1)=e^{2}$, $f'(x)=2e^{2x}$ so $f'(1)=2e^{2}$. Then $L(x)=e^{2}+2e^{2}(x-1)=2e^{2}x-e^{2}$ — (i).</div><div class=\"ml-vi\">$f(1)=e^{2}$, $f'(x)=2e^{2x}$ nên $f'(1)=2e^{2}$. Vậy $L(x)=e^{2}+2e^{2}(x-1)=2e^{2}x-e^{2}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute maximum and absolute minimum values of $f(x)=\\sqrt[3]{x}$ on $[0,8]$.|||Tìm giá trị lớn nhất và nhỏ nhất tuyệt đối của $f(x)=\\sqrt[3]{x}$ trên $[0,8]$.",
          "options": [
            {
              "text": "No absolute extrema|||Không có cực trị tuyệt đối"
            },
            {
              "text": "Absolute minimum: 0, no absolute maximum|||Giá trị nhỏ nhất: 0, không có giá trị lớn nhất"
            },
            {
              "text": "Absolute maximum: 2, absolute minimum: 0|||Giá trị lớn nhất: 2, giá trị nhỏ nhất: 0"
            },
            {
              "text": "Absolute maximum: 8, absolute minimum: 0|||Giá trị lớn nhất: 8, giá trị nhỏ nhất: 0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f$ is continuous and increasing on $[0,8]$, so the extremes occur at the endpoints: $f(0)=0$ (min) and $f(8)=2$ (max).</div><div class=\"ml-vi\">$f$ liên tục và đồng biến trên $[0,8]$ nên cực trị nằm ở hai đầu mút: $f(0)=0$ (nhỏ nhất) và $f(8)=2$ (lớn nhất).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the relative extrema, if they exist, of the function $f(x)=\\dfrac{4}{x^2-1}$.|||Tìm cực trị địa phương (nếu có) của hàm $f(x)=\\dfrac{4}{x^2-1}$.",
          "options": [
            {
              "text": "No relative extrema|||Không có cực trị địa phương"
            },
            {
              "text": "Relative maximum at $(0,4)$, no relative minimum|||Cực đại tại $(0,4)$, không có cực tiểu"
            },
            {
              "text": "Relative minimum at $(0,-4)$, no relative maximum|||Cực tiểu tại $(0,-4)$, không có cực đại"
            },
            {
              "text": "Relative maximum at $(0,-4)$, no relative minimum|||Cực đại tại $(0,-4)$, không có cực tiểu"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=\\dfrac{-8x}{(x^2-1)^2}$, which is $0$ only at $x=0$ (the points $x=\\pm1$ are outside the domain). $f'\\gt0$ for $x\\lt0$ and $f'\\lt0$ for $x\\gt0$, so $x=0$ gives a relative maximum with $f(0)=-4$.</div><div class=\"ml-vi\">$f'(x)=\\dfrac{-8x}{(x^2-1)^2}$, chỉ bằng $0$ tại $x=0$ (các điểm $x=\\pm1$ không thuộc miền xác định). $f'\\gt0$ khi $x\\lt0$ và $f'\\lt0$ khi $x\\gt0$, nên $x=0$ là điểm cực đại với $f(0)=-4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For the function whose graph is given, find $\\displaystyle\\lim_{x\\to3}f(x)$.<br>The graph (from the exam paper) has a vertical asymptote at $x=1$ where both branches rise off the top of the picture, then the curve falls, crosses the $x$-axis a little after $x=2$ and plunges off the bottom of the picture on both sides of $x=3$, coming back up to a local maximum near $x=4$ before decaying.<br>(i) $-4$ (ii) $-\\infty$ (iii) $4$ (iv) $\\infty$|||Với hàm số có đồ thị cho trong đề, tìm $\\displaystyle\\lim_{x\\to3}f(x)$.<br>Đồ thị (theo ảnh đề) có tiệm cận đứng tại $x=1$ với hai nhánh vọt lên khỏi khung hình, sau đó đường cong đi xuống, cắt trục hoành ngay sau $x=2$ rồi lao xuống khỏi đáy khung hình ở cả hai phía của $x=3$, rồi đi lên tới một cực đại địa phương gần $x=4$ trước khi giảm dần.<br>(i) $-4$ (ii) $-\\infty$ (iii) $4$ (iv) $\\infty$",
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
          "explanation": "<div class=\"ml-en\">$x=3$ is a vertical asymptote and the curve goes down without bound on <b>both</b> sides, so the two-sided limit is $-\\infty$ — (ii). (A finite value such as $\\pm4$ would require the graph to approach a height, which it does not.)</div><div class=\"ml-vi\">$x=3$ là tiệm cận đứng và đường cong đi xuống vô hạn ở <b>cả hai</b> phía, nên giới hạn hai phía là $-\\infty$ — (ii). (Giá trị hữu hạn như $\\pm4$ đòi hỏi đồ thị tiến tới một độ cao xác định, điều không xảy ra ở đây.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the point on the line $y=5x+2$ that is closest to the origin.|||Tìm điểm trên đường thẳng $y=5x+2$ gần gốc toạ độ nhất.",
          "options": [
            {
              "text": "$(-5/13,\\ 1/13)$|||$(-5/13,\\ 1/13)$"
            },
            {
              "text": "$(5/13,\\ 51)$|||$(5/13,\\ 51)$"
            },
            {
              "text": "$(-5/13,\\ 51/13)$|||$(-5/13,\\ 51/13)$"
            },
            {
              "text": "$(5/13,\\ -51/13)$|||$(5/13,\\ -51/13)$"
            },
            {
              "text": "None of others|||Không phương án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Minimize $D=x^2+(5x+2)^2$: $D'=2x+10(5x+2)=52x+20=0\\Rightarrow x=-\\dfrac{5}{13}$, then $y=5\\!\\left(-\\dfrac{5}{13}\\right)+2=\\dfrac{1}{13}$.</div><div class=\"ml-vi\">Cực tiểu hoá $D=x^2+(5x+2)^2$: $D'=2x+10(5x+2)=52x+20=0\\Rightarrow x=-\\dfrac{5}{13}$, suy ra $y=5\\!\\left(-\\dfrac{5}{13}\\right)+2=\\dfrac{1}{13}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the initial approximation $x_1=1$ to find $x_3$ of the equation $\\sin x=x^3-1$.|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1=1$ để tìm $x_3$ của phương trình $\\sin x=x^3-1$.",
          "options": [
            {
              "text": "1.256|||1.256"
            },
            {
              "text": "1.009|||1.009"
            },
            {
              "text": "1.249|||1.249"
            },
            {
              "text": "1.004|||1.004"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Let $f(x)=x^3-1-\\sin x$, $f'(x)=3x^2-\\cos x$. $f(1)=-0.8415$, $f'(1)=2.4597\\Rightarrow x_2=1+0.3421=1.3421$. Then $f(x_2)=0.4435$, $f'(x_2)=5.1770\\Rightarrow x_3=1.3421-0.0857\\approx1.256$.</div><div class=\"ml-vi\">Đặt $f(x)=x^3-1-\\sin x$, $f'(x)=3x^2-\\cos x$. $f(1)=-0.8415$, $f'(1)=2.4597\\Rightarrow x_2=1+0.3421=1.3421$. Tiếp: $f(x_2)=0.4435$, $f'(x_2)=5.1770\\Rightarrow x_3=1.3421-0.0857\\approx1.256$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the <b>Right-endpoint Rule</b> with $n=4$ to estimate $\\displaystyle\\int_0^2 f(x)\\,dx$. Choose the correct Right-endpoint formula for this case:<br>(i) $0.5[f(0.5)+f(1)+f(1.5)+f(2)]$ (ii) $0.5[f(0)+f(0.5)+f(1)+f(1.5)]$ (iii) $\\dfrac{0.5}{3}[f(0)+4f(0.5)+2f(1)+4f(1.5)+f(2)]$ (iv) $\\dfrac{1}{5}\\sum_{i=0}^{4}f(i\\cdot0.5)$|||Dùng <b>quy tắc điểm mút phải</b> với $n=4$ để ước lượng $\\displaystyle\\int_0^2 f(x)\\,dx$. Chọn công thức điểm mút phải đúng cho trường hợp này:<br>(i) $0.5[f(0.5)+f(1)+f(1.5)+f(2)]$ (ii) $0.5[f(0)+f(0.5)+f(1)+f(1.5)]$ (iii) $\\dfrac{0.5}{3}[f(0)+4f(0.5)+2f(1)+4f(1.5)+f(2)]$ (iv) $\\dfrac{1}{5}\\sum_{i=0}^{4}f(i\\cdot0.5)$",
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
          "explanation": "<div class=\"ml-en\">$\\Delta x=\\dfrac{2-0}{4}=0.5$ and the right endpoints are $0.5,1,1.5,2$, so the sum is $0.5[f(0.5)+f(1)+f(1.5)+f(2)]$ — (i). ((ii) is the left-endpoint rule, (iii) is Simpson's rule.)</div><div class=\"ml-vi\">$\\Delta x=\\dfrac{2-0}{4}=0.5$ và các điểm mút phải là $0.5,1,1.5,2$, nên tổng là $0.5[f(0.5)+f(1)+f(1.5)+f(2)]$ — (i). ((ii) là quy tắc mút trái, (iii) là quy tắc Simpson.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Express the integral $\\displaystyle\\int_1^5\\dfrac{x}{x^2+2}\\,dx$ as a limit of a Riemann sum.<br>(i) $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\dfrac{1}{x_i^2+2}\\Delta x,\\ [1,5]$ (ii) $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\dfrac{x_i}{x_i^2+2}\\Delta x,\\ [1,5]$ (iii) $\\displaystyle\\lim_{n\\to\\infty}x\\sum_{i=1}^{n}\\dfrac{1}{x_i^2+2}\\Delta x,\\ [1,5]$|||Biểu diễn tích phân $\\displaystyle\\int_1^5\\dfrac{x}{x^2+2}\\,dx$ dưới dạng giới hạn của tổng Riemann.<br>(i) $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\dfrac{1}{x_i^2+2}\\Delta x,\\ [1,5]$ (ii) $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\dfrac{x_i}{x_i^2+2}\\Delta x,\\ [1,5]$ (iii) $\\displaystyle\\lim_{n\\to\\infty}x\\sum_{i=1}^{n}\\dfrac{1}{x_i^2+2}\\Delta x,\\ [1,5]$",
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
          "explanation": "<div class=\"ml-en\">The Riemann sum evaluates the whole integrand at the sample point: $f(x_i)=\\dfrac{x_i}{x_i^2+2}$ — (ii). ((iii) is wrong because a free $x$ cannot sit outside the sum.)</div><div class=\"ml-vi\">Tổng Riemann phải lấy TOÀN BỘ hàm dưới dấu tích phân tại điểm mẫu: $f(x_i)=\\dfrac{x_i}{x_i^2+2}$ — (ii). ((iii) sai vì không thể để $x$ tự do ngoài dấu tổng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=\\displaystyle\\int_{1-x}^{3-x}(t^2+3t+1)\\,dt$. Find $f'(x)$.|||Cho $f(x)=\\displaystyle\\int_{1-x}^{3-x}(t^2+3t+1)\\,dt$. Tìm $f'(x)$.",
          "options": [
            {
              "text": "$4x-14$|||$4x-14$"
            },
            {
              "text": "$4x-20$|||$4x-20$"
            },
            {
              "text": "$4x+17$|||$4x+17$"
            },
            {
              "text": "$4x-16$|||$4x-16$"
            },
            {
              "text": "$4x-18$|||$4x-18$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By the Fundamental Theorem with the chain rule, $f'(x)=g(3-x)\\cdot(-1)-g(1-x)\\cdot(-1)$ where $g(t)=t^2+3t+1$. Since $g(3-x)=x^2-9x+19$ and $g(1-x)=x^2-5x+5$, $f'(x)=-(x^2-9x+19)+(x^2-5x+5)=4x-14$.</div><div class=\"ml-vi\">Theo định lý cơ bản kết hợp quy tắc dây chuyền: $f'(x)=g(3-x)\\cdot(-1)-g(1-x)\\cdot(-1)$ với $g(t)=t^2+3t+1$. Vì $g(3-x)=x^2-9x+19$ và $g(1-x)=x^2-5x+5$ nên $f'(x)=-(x^2-9x+19)+(x^2-5x+5)=4x-14$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the <u>average value</u> of the function $f(x)=7x+5$ on the interval $[1,4]$.|||Tìm <u>giá trị trung bình</u> của hàm $f(x)=7x+5$ trên đoạn $[1,4]$.",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "22.5|||22.5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$f_{avg}=\\dfrac{1}{3}\\displaystyle\\int_1^4(7x+5)\\,dx=\\dfrac{1}{3}\\left[\\dfrac{7x^2}{2}+5x\\right]_1^4=\\dfrac{1}{3}(76-8.5)=22.5$. (Shortcut: for a linear function the average is the midpoint value $f(2.5)=22.5$.)</div><div class=\"ml-vi\">$f_{tb}=\\dfrac{1}{3}\\displaystyle\\int_1^4(7x+5)\\,dx=\\dfrac{1}{3}\\left[\\dfrac{7x^2}{2}+5x\\right]_1^4=\\dfrac{1}{3}(76-8.5)=22.5$. (Mẹo: với hàm bậc nhất, trung bình bằng giá trị tại trung điểm $f(2.5)=22.5$.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int\\dfrac{15e^{7x}\\,dx}{e^{7x}+1}$.<br>(i) $15\\ln(e^{7x}+1)+C$ (ii) $(7/15)\\ln(e^{7x}+1)+C$ (iii) $(5/7)\\ln(e^{7x}+1)+C$ (iv) $(15/7)\\ln(e^{7x}+1)+C$|||Tính $\\displaystyle\\int\\dfrac{15e^{7x}\\,dx}{e^{7x}+1}$.<br>(i) $15\\ln(e^{7x}+1)+C$ (ii) $(7/15)\\ln(e^{7x}+1)+C$ (iii) $(5/7)\\ln(e^{7x}+1)+C$ (iv) $(15/7)\\ln(e^{7x}+1)+C$",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Substitute $u=e^{7x}+1$, $du=7e^{7x}dx$: the integral is $\\dfrac{15}{7}\\displaystyle\\int\\dfrac{du}{u}=\\dfrac{15}{7}\\ln(e^{7x}+1)+C$ — (iv).</div><div class=\"ml-vi\">Đặt $u=e^{7x}+1$, $du=7e^{7x}dx$: tích phân bằng $\\dfrac{15}{7}\\displaystyle\\int\\dfrac{du}{u}=\\dfrac{15}{7}\\ln(e^{7x}+1)+C$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the integral $\\displaystyle\\int(\\ln x+1)\\,dx$.<br>(i) $x\\ln x+C$ (ii) $x\\ln x-x+C$ (iii) $x\\ln x+x+C$ (iv) $\\ln x+x+C$|||Tính tích phân $\\displaystyle\\int(\\ln x+1)\\,dx$.<br>(i) $x\\ln x+C$ (ii) $x\\ln x-x+C$ (iii) $x\\ln x+x+C$ (iv) $\\ln x+x+C$",
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
          "explanation": "<div class=\"ml-en\">$\\displaystyle\\int\\ln x\\,dx=x\\ln x-x$ (integration by parts), so $\\displaystyle\\int(\\ln x+1)dx=x\\ln x-x+x+C=x\\ln x+C$ — (i). Check: $(x\\ln x)'=\\ln x+1$.</div><div class=\"ml-vi\">$\\displaystyle\\int\\ln x\\,dx=x\\ln x-x$ (tích phân từng phần), nên $\\displaystyle\\int(\\ln x+1)dx=x\\ln x-x+x+C=x\\ln x+C$ — (i). Kiểm tra: $(x\\ln x)'=\\ln x+1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Left endpoint Method with $n=6$ steps to approximate the integral $\\displaystyle\\int_1^4 f(x)\\,dx$, given the table<table class=\"exam-table\"><thead><tr><th>$x$</th><th>1</th><th>1.5</th><th>2</th><th>2.5</th><th>3</th><th>3.5</th><th>4</th></tr></thead><tbody><tr><td>$f(x)$</td><td>2</td><td>6</td><td>4</td><td>8</td><td>2</td><td>5</td><td>9</td></tr></tbody></table>|||Dùng phương pháp điểm mút trái với $n=6$ bước để xấp xỉ tích phân $\\displaystyle\\int_1^4 f(x)\\,dx$, với bảng sau<table class=\"exam-table\"><thead><tr><th>$x$</th><th>1</th><th>1.5</th><th>2</th><th>2.5</th><th>3</th><th>3.5</th><th>4</th></tr></thead><tbody><tr><td>$f(x)$</td><td>2</td><td>6</td><td>4</td><td>8</td><td>2</td><td>5</td><td>9</td></tr></tbody></table>",
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
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=\\dfrac{4-1}{6}=0.5$; left endpoints $1,1.5,2,2.5,3,3.5$ give $f$-values $2,6,4,8,2,5$ summing to $27$. Estimate $=0.5\\times27=13.5$.</div><div class=\"ml-vi\">$\\Delta x=\\dfrac{4-1}{6}=0.5$; các điểm mút trái $1,1.5,2,2.5,3,3.5$ cho giá trị $f$ là $2,6,4,8,2,5$, tổng $=27$. Xấp xỉ $=0.5\\times27=13.5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following improper integrals diverges?<br>(i) $\\displaystyle\\int_{-3}^{3}\\dfrac{1}{(x+1)^2}\\,dx$ (ii) $\\displaystyle\\int_{0}^{\\infty}\\cos x\\,dx$|||Tích phân suy rộng nào sau đây phân kỳ?<br>(i) $\\displaystyle\\int_{-3}^{3}\\dfrac{1}{(x+1)^2}\\,dx$ (ii) $\\displaystyle\\int_{0}^{\\infty}\\cos x\\,dx$",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Neither (i) nor (ii)|||Cả (i) và (ii) đều không"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) has an infinite discontinuity at $x=-1$ inside $[-3,3]$ and $\\displaystyle\\int\\dfrac{dx}{(x+1)^2}$ blows up there ($p=2\\geq1$), so it diverges. (ii) $\\displaystyle\\int_0^{b}\\cos x\\,dx=\\sin b$ oscillates and has no limit as $b\\to\\infty$, so it also diverges.</div><div class=\"ml-vi\">(i) có điểm gián đoạn vô cực tại $x=-1$ nằm trong $[-3,3]$ và $\\displaystyle\\int\\dfrac{dx}{(x+1)^2}$ phân kỳ tại đó ($p=2\\geq1$). (ii) $\\displaystyle\\int_0^{b}\\cos x\\,dx=\\sin b$ dao động, không có giới hạn khi $b\\to\\infty$ nên cũng phân kỳ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The rank of $\\begin{bmatrix}1&2&3\\\\2&3&4\\\\3&4&m\\end{bmatrix}$ is 2. Then $m$ is …|||Hạng của ma trận $\\begin{bmatrix}1&2&3\\\\2&3&4\\\\3&4&m\\end{bmatrix}$ bằng 2. Khi đó $m$ là …",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "any real number|||số thực bất kỳ"
            },
            {
              "text": "any number but 5|||mọi số trừ 5"
            },
            {
              "text": "any number but 0|||mọi số trừ 0"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Rank $\\lt3$ requires $\\det=0$: $\\det=1(3m-16)-2(2m-12)+3(8-9)=-m+5=0\\Rightarrow m=5$. With $m=5$ the first two rows are still independent, so the rank is exactly 2.</div><div class=\"ml-vi\">Hạng $\\lt3$ đòi hỏi $\\det=0$: $\\det=1(3m-16)-2(2m-12)+3(8-9)=-m+5=0\\Rightarrow m=5$. Với $m=5$ hai hàng đầu vẫn độc lập nên hạng đúng bằng 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $c$ such that the graph of $y=a+bx+cx^2$ passes through $(0,5)$, $(-1,-7)$, $(2,11)$.|||Tìm $c$ sao cho đồ thị $y=a+bx+cx^2$ đi qua $(0,5)$, $(-1,-7)$, $(2,11)$.",
          "options": [
            {
              "text": "-3|||-3"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "-9|||-9"
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
          "explanation": "<div class=\"ml-en\">From $(0,5)$: $a=5$. From $(-1,-7)$: $-b+c=-12$. From $(2,11)$: $2b+4c=6\\Rightarrow b+2c=3$. Adding the last two: $3c=-9\\Rightarrow c=-3$.</div><div class=\"ml-vi\">Từ $(0,5)$: $a=5$. Từ $(-1,-7)$: $-b+c=-12$. Từ $(2,11)$: $2b+4c=6\\Rightarrow b+2c=3$. Cộng hai phương trình sau: $3c=-9\\Rightarrow c=-3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The echelon form of the augmented matrix of a system of linear equations has the following form $\\begin{bmatrix}1&*&*&*&*&|&*\\\\0&1&*&*&*&|&*\\\\0&0&0&1&*&|&*\\\\0&0&0&0&1&|&*\\end{bmatrix}$, where $(*)$ denotes any real number. What can you say about the number of the solutions of this system?|||Dạng bậc thang của ma trận bổ sung của một hệ phương trình tuyến tính có dạng $\\begin{bmatrix}1&*&*&*&*&|&*\\\\0&1&*&*&*&|&*\\\\0&0&0&1&*&|&*\\\\0&0&0&0&1&|&*\\end{bmatrix}$, với $(*)$ là số thực bất kỳ. Bạn kết luận gì về số nghiệm của hệ?",
          "options": [
            {
              "text": "This system has no solution|||Hệ vô nghiệm"
            },
            {
              "text": "This system has a unique solution|||Hệ có nghiệm duy nhất"
            },
            {
              "text": "Not enough information|||Không đủ thông tin"
            },
            {
              "text": "This system has infinitely many solutions|||Hệ có vô số nghiệm"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">There are 5 unknowns and 4 pivots (columns 1, 2, 4, 5); column 3 has no pivot, so it is a free variable. No row of the form $[0\\ 0\\ 0\\ 0\\ 0\\,|\\,\\text{nonzero}]$ appears, so the system is consistent → infinitely many solutions.</div><div class=\"ml-vi\">Có 5 ẩn và 4 phần tử trụ (cột 1, 2, 4, 5); cột 3 không có trụ nên là ẩn tự do. Không có hàng dạng $[0\\ 0\\ 0\\ 0\\ 0\\,|\\,\\text{khác }0]$ nên hệ tương thích → vô số nghiệm.</div>"
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
              "text": "The system has only the trivial solution, or infinitely many solutions.|||Hệ chỉ có nghiệm tầm thường, hoặc có vô số nghiệm."
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
          "explanation": "<div class=\"ml-en\">A homogeneous system is always consistent ($x=0$ works). The rank is at most 5, so with 6 unknowns there is at least $6-5=1$ free variable → infinitely many solutions, always.</div><div class=\"ml-vi\">Hệ thuần nhất luôn tương thích (nghiệm $x=0$). Hạng nhiều nhất bằng 5, mà có 6 ẩn nên còn ít nhất $6-5=1$ ẩn tự do → luôn có vô số nghiệm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{pmatrix}1&0&2\\\\3&2&-1\\end{pmatrix}$, $B=\\begin{pmatrix}1&1\\\\2&-1\\\\3&0\\end{pmatrix}$. Find $(-3A)+B^{T}$.<br>(i) $\\begin{pmatrix}2&2&3\\\\-8&-7&3\\end{pmatrix}$ (ii) $\\begin{pmatrix}-2&2&-3\\\\8&7&3\\end{pmatrix}$ (iii) $\\begin{pmatrix}-2&2&-3\\\\-8&-7&3\\end{pmatrix}$|||Cho $A=\\begin{pmatrix}1&0&2\\\\3&2&-1\\end{pmatrix}$, $B=\\begin{pmatrix}1&1\\\\2&-1\\\\3&0\\end{pmatrix}$. Tìm $(-3A)+B^{T}$.<br>(i) $\\begin{pmatrix}2&2&3\\\\-8&-7&3\\end{pmatrix}$ (ii) $\\begin{pmatrix}-2&2&-3\\\\8&7&3\\end{pmatrix}$ (iii) $\\begin{pmatrix}-2&2&-3\\\\-8&-7&3\\end{pmatrix}$",
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
          "explanation": "<div class=\"ml-en\">$-3A=\\begin{pmatrix}-3&0&-6\\\\-9&-6&3\\end{pmatrix}$ and $B^{T}=\\begin{pmatrix}1&2&3\\\\1&-1&0\\end{pmatrix}$; adding entrywise gives $\\begin{pmatrix}-2&2&-3\\\\-8&-7&3\\end{pmatrix}$ — (iii).</div><div class=\"ml-vi\">$-3A=\\begin{pmatrix}-3&0&-6\\\\-9&-6&3\\end{pmatrix}$ và $B^{T}=\\begin{pmatrix}1&2&3\\\\1&-1&0\\end{pmatrix}$; cộng từng phần tử được $\\begin{pmatrix}-2&2&-3\\\\-8&-7&3\\end{pmatrix}$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T$ be the rotation in $\\mathbb{R}^2$ of angle $\\theta$ radians, with matrix $\\dfrac{1}{\\sqrt2}\\begin{bmatrix}-1&-1\\\\1&-1\\end{bmatrix}$. Find $\\theta$.<br>(i) $\\dfrac{\\pi}{4}$ (ii) $\\dfrac{3\\pi}{4}$ (iii) $-\\dfrac{\\pi}{4}$ (iv) $-\\dfrac{3\\pi}{4}$|||Cho $T$ là phép quay trong $\\mathbb{R}^2$ góc $\\theta$ radian, với ma trận $\\dfrac{1}{\\sqrt2}\\begin{bmatrix}-1&-1\\\\1&-1\\end{bmatrix}$. Tìm $\\theta$.<br>(i) $\\dfrac{\\pi}{4}$ (ii) $\\dfrac{3\\pi}{4}$ (iii) $-\\dfrac{\\pi}{4}$ (iv) $-\\dfrac{3\\pi}{4}$",
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
          "explanation": "<div class=\"ml-en\">A rotation matrix is $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$, so $\\cos\\theta=-\\dfrac{1}{\\sqrt2}$ and $\\sin\\theta=\\dfrac{1}{\\sqrt2}$ — second quadrant, $\\theta=\\dfrac{3\\pi}{4}$.</div><div class=\"ml-vi\">Ma trận quay có dạng $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$, nên $\\cos\\theta=-\\dfrac{1}{\\sqrt2}$ và $\\sin\\theta=\\dfrac{1}{\\sqrt2}$ — góc phần tư thứ hai, $\\theta=\\dfrac{3\\pi}{4}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}$, where $a$ is a real number. Compute $A^{100}$.<br>(i) $\\begin{bmatrix}1&100a\\\\0&0\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&a^{100}\\\\0&0\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}$|||Cho $A=\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}$, với $a$ là số thực. Tính $A^{100}$.<br>(i) $\\begin{bmatrix}1&100a\\\\0&0\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&a^{100}\\\\0&0\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}$",
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
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$A^2=\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}=\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}=A$: $A$ is idempotent, so $A^{100}=A$ — (iii).</div><div class=\"ml-vi\">$A^2=\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}=\\begin{bmatrix}1&a\\\\0&0\\end{bmatrix}=A$: $A$ luỹ đẳng, nên $A^{100}=A$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are true?<br>(i) If $A^5=I$, then $A$ is invertible and $A^{-1}=A^4$. (ii) If $A^5=I$, then $A$ is invertible and $A^{-1}=A^5$.|||Phát biểu nào sau đây đúng?<br>(i) Nếu $A^5=I$ thì $A$ khả nghịch và $A^{-1}=A^4$. (ii) Nếu $A^5=I$ thì $A$ khả nghịch và $A^{-1}=A^5$.",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
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
          "explanation": "<div class=\"ml-en\">$A\\cdot A^4=A^5=I$, so $A^{-1}=A^4$: (i) is true. (ii) is false because $A^5=I$, and $A^{-1}=I$ would force $A=I$.</div><div class=\"ml-vi\">$A\\cdot A^4=A^5=I$ nên $A^{-1}=A^4$: (i) đúng. (ii) sai vì $A^5=I$, mà $A^{-1}=I$ sẽ kéo theo $A=I$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ be a linear map with $T\\!\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}=\\begin{bmatrix}5\\\\1\\end{bmatrix}$ and $T\\!\\begin{bmatrix}-1\\\\1\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$. Then $T\\!\\begin{bmatrix}5\\\\-1\\\\2\\end{bmatrix}$ is …<br>(i) $\\begin{bmatrix}4\\\\2\\end{bmatrix}$ (ii) $\\begin{bmatrix}2\\\\4\\end{bmatrix}$ (iii) $\\begin{bmatrix}2\\\\-3\\end{bmatrix}$|||Cho ánh xạ tuyến tính $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ với $T\\!\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}=\\begin{bmatrix}5\\\\1\\end{bmatrix}$ và $T\\!\\begin{bmatrix}-1\\\\1\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$. Khi đó $T\\!\\begin{bmatrix}5\\\\-1\\\\2\\end{bmatrix}$ bằng …<br>(i) $\\begin{bmatrix}4\\\\2\\end{bmatrix}$ (ii) $\\begin{bmatrix}2\\\\4\\end{bmatrix}$ (iii) $\\begin{bmatrix}2\\\\-3\\end{bmatrix}$",
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
              "text": "None of the others|||Không phương án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Write $(5,-1,2)=a(1,1,1)+b(-1,1,0)$: the third coordinate gives $a=2$, then $a+b=-1\\Rightarrow b=-3$ (check: $a-b=5$ ✓). By linearity $T=2\\begin{bmatrix}5\\\\1\\end{bmatrix}-3\\begin{bmatrix}2\\\\0\\end{bmatrix}=\\begin{bmatrix}4\\\\2\\end{bmatrix}$ — (i).</div><div class=\"ml-vi\">Viết $(5,-1,2)=a(1,1,1)+b(-1,1,0)$: toạ độ thứ ba cho $a=2$, rồi $a+b=-1\\Rightarrow b=-3$ (kiểm tra: $a-b=5$ ✓). Theo tính tuyến tính, $T=2\\begin{bmatrix}5\\\\1\\end{bmatrix}-3\\begin{bmatrix}2\\\\0\\end{bmatrix}=\\begin{bmatrix}4\\\\2\\end{bmatrix}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be a linear transformation with matrix $\\begin{bmatrix}-1&0\\\\0&0\\end{bmatrix}$. Which of the following statements is true?<br>(i) $T$ is the reflection in the $x$-axis. (ii) $T$ is the reflection in the $y$-axis. (iii) $T$ is the projection onto the $x$-axis. (iv) $T$ is the projection onto the $y$-axis.|||Cho phép biến đổi tuyến tính $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ với ma trận $\\begin{bmatrix}-1&0\\\\0&0\\end{bmatrix}$. Phát biểu nào đúng?<br>(i) $T$ là phép đối xứng qua trục $Ox$. (ii) $T$ là phép đối xứng qua trục $Oy$. (iii) $T$ là phép chiếu lên trục $Ox$. (iv) $T$ là phép chiếu lên trục $Oy$.",
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
          "explanation": "<div class=\"ml-en\">$T(x,y)=(-x,0)$. Reflections are $\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$ and $\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$; the projection onto the $x$-axis is $\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$. Our map is a projection onto the $x$-axis <i>followed by</i> a sign flip, so none of (i)–(iv) is correct.</div><div class=\"ml-vi\">$T(x,y)=(-x,0)$. Các phép đối xứng là $\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$ và $\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$; phép chiếu lên trục $Ox$ là $\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$. Ánh xạ này là phép chiếu lên trục $Ox$ <i>rồi</i> đổi dấu, nên không phương án (i)–(iv) nào đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ and $B$ be square matrices of the same size. Which of the following statements are true?<br>(i) $\\det(A+B)=\\det(A)+\\det(B)$. (ii) If $A$ is $2\\times2$, then $\\det(5A)=25\\det(A)$.|||Cho $A$ và $B$ là các ma trận vuông cùng cỡ. Phát biểu nào đúng?<br>(i) $\\det(A+B)=\\det(A)+\\det(B)$. (ii) Nếu $A$ cỡ $2\\times2$ thì $\\det(5A)=25\\det(A)$.",
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
          "explanation": "<div class=\"ml-en\">(i) is false in general (e.g. $A=B=I_2$: $\\det(2I)=4\\neq1+1$). (ii) is true: $\\det(kA)=k^{n}\\det A$ with $n=2$, $k=5$ gives $25\\det A$.</div><div class=\"ml-vi\">(i) sai trong trường hợp tổng quát (ví dụ $A=B=I_2$: $\\det(2I)=4\\neq1+1$). (ii) đúng: $\\det(kA)=k^{n}\\det A$ với $n=2$, $k=5$ cho $25\\det A$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the number $k$ for which the matrix $A=\\begin{bmatrix}1&2&k\\\\3&-1&1\\\\5&3&-5\\end{bmatrix}$ has no inverse.|||Tìm số $k$ để ma trận $A=\\begin{bmatrix}1&2&k\\\\3&-1&1\\\\5&3&-5\\end{bmatrix}$ không khả nghịch.",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "-3|||-3"
            },
            {
              "text": "All numbers but -3|||Mọi số trừ -3"
            },
            {
              "text": "All numbers but 5|||Mọi số trừ 5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">No inverse $\\iff\\det A=0$: $\\det A=1(5-3)-2(-15-5)+k(9+5)=2+40+14k=42+14k=0\\Rightarrow k=-3$.</div><div class=\"ml-vi\">Không khả nghịch $\\iff\\det A=0$: $\\det A=1(5-3)-2(-15-5)+k(9+5)=2+40+14k=42+14k=0\\Rightarrow k=-3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A,B,C$ be $10\\times10$ matrices with $\\det A=3$, $\\det B=2$ and $\\det C=-1$. Find $\\det\\!\\left(A^{-1}B^{T}C^{-1}\\right)$.|||Cho $A,B,C$ là các ma trận $10\\times10$ với $\\det A=3$, $\\det B=2$ và $\\det C=-1$. Tính $\\det\\!\\left(A^{-1}B^{T}C^{-1}\\right)$.",
          "options": [
            {
              "text": "2/3|||2/3"
            },
            {
              "text": "-2/3|||-2/3"
            },
            {
              "text": "-6|||-6"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
            },
            {
              "text": "1/3|||1/3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\det(A^{-1})=\\dfrac13$, $\\det(B^{T})=\\det B=2$, $\\det(C^{-1})=-1$. Product: $\\dfrac13\\cdot2\\cdot(-1)=-\\dfrac23$.</div><div class=\"ml-vi\">$\\det(A^{-1})=\\dfrac13$, $\\det(B^{T})=\\det B=2$, $\\det(C^{-1})=-1$. Nhân lại: $\\dfrac13\\cdot2\\cdot(-1)=-\\dfrac23$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $3\\times3$ matrix with eigenvalues $\\lambda_1=2$, $\\lambda_2=-3$ and $\\lambda_3=4$. What is the determinant of $A$?|||Cho $A$ là ma trận $3\\times3$ với các trị riêng $\\lambda_1=2$, $\\lambda_2=-3$ và $\\lambda_3=4$. Định thức của $A$ bằng bao nhiêu?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "-6|||-6"
            },
            {
              "text": "-24|||-24"
            },
            {
              "text": "There is not enough information to conclude|||Không đủ thông tin để kết luận"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The determinant equals the product of the eigenvalues (with multiplicity): $2\\cdot(-3)\\cdot4=-24$.</div><div class=\"ml-vi\">Định thức bằng tích các trị riêng (kể cả bội): $2\\cdot(-3)\\cdot4=-24$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that $\\lambda=2$ is an eigenvalue of the matrix $A=\\begin{bmatrix}2&3&4\\\\0&5&1\\\\0&6&7\\end{bmatrix}$, find an eigenvector corresponding to the eigenvalue $\\lambda=2$.|||Biết $\\lambda=2$ là một trị riêng của ma trận $A=\\begin{bmatrix}2&3&4\\\\0&5&1\\\\0&6&7\\end{bmatrix}$, tìm một vectơ riêng ứng với trị riêng $\\lambda=2$.",
          "options": [
            {
              "text": "$[1,\\ 0,\\ 0]$|||$[1,\\ 0,\\ 0]$"
            },
            {
              "text": "$[0,\\ 1,\\ 0]$|||$[0,\\ 1,\\ 0]$"
            },
            {
              "text": "$[0,\\ 0,\\ 1]$|||$[0,\\ 0,\\ 1]$"
            },
            {
              "text": "$[1,\\ 1,\\ 1]$|||$[1,\\ 1,\\ 1]$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(A-2I)x=0$ with $A-2I=\\begin{bmatrix}0&3&4\\\\0&3&1\\\\0&6&5\\end{bmatrix}$: rows 1 and 2 give $3y+4z=0$ and $3y+z=0\\Rightarrow z=0,\\ y=0$, while $x$ is free. So $[1,0,0]$ works (check directly: $A[1,0,0]^{T}=[2,0,0]^{T}=2[1,0,0]^{T}$).</div><div class=\"ml-vi\">Giải $(A-2I)x=0$ với $A-2I=\\begin{bmatrix}0&3&4\\\\0&3&1\\\\0&6&5\\end{bmatrix}$: hai hàng đầu cho $3y+4z=0$ và $3y+z=0\\Rightarrow z=0,\\ y=0$, còn $x$ tự do. Vậy $[1,0,0]$ thoả (kiểm tra trực tiếp: $A[1,0,0]^{T}=[2,0,0]^{T}=2[1,0,0]^{T}$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $u$, $v$ be vectors. Choose the correct statement.|||Cho $u$, $v$ là các vectơ. Chọn phát biểu đúng.",
          "options": [
            {
              "text": "If $\\|u-v\\|=0$ then $u=v$|||Nếu $\\|u-v\\|=0$ thì $u=v$"
            },
            {
              "text": "If $\\|u\\|=\\|v\\|$ then $u=v$|||Nếu $\\|u\\|=\\|v\\|$ thì $u=v$"
            },
            {
              "text": "$\\|u+v\\|=\\|u\\|+\\|v\\|$ for all vectors $u,v$|||$\\|u+v\\|=\\|u\\|+\\|v\\|$ với mọi vectơ $u,v$"
            },
            {
              "text": "$\\|-3u\\|=-3\\|u\\|$|||$\\|-3u\\|=-3\\|u\\|$"
            },
            {
              "text": "All of the other choices are correct|||Tất cả các phương án đều đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A norm is zero only for the zero vector, so $\\|u-v\\|=0\\Rightarrow u-v=0\\Rightarrow u=v$. The others fail: equal lengths need not mean equal vectors; the triangle inequality is $\\leq$ (equality only for parallel same-direction vectors); and $\\|-3u\\|=3\\|u\\|\\geq0$.</div><div class=\"ml-vi\">Chuẩn chỉ bằng 0 với vectơ không, nên $\\|u-v\\|=0\\Rightarrow u-v=0\\Rightarrow u=v$. Các phương án còn lại sai: độ dài bằng nhau không suy ra vectơ bằng nhau; bất đẳng thức tam giác là $\\leq$ (dấu bằng chỉ khi cùng phương cùng hướng); và $\\|-3u\\|=3\\|u\\|\\geq0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the distance from the origin to the line passing through the point $(3,1,5)$ and having the direction $v=(2,-1,1)$.<br>(i) $\\sqrt{\\dfrac{55}{3}}$ (ii) $2\\sqrt{\\dfrac{11}{13}}$ (iii) $5\\sqrt{\\dfrac{11}{3}}$ (iv) $10\\sqrt{\\dfrac{11}{3}}$|||Tìm khoảng cách từ gốc toạ độ đến đường thẳng đi qua điểm $(3,1,5)$ và có vectơ chỉ phương $v=(2,-1,1)$.<br>(i) $\\sqrt{\\dfrac{55}{3}}$ (ii) $2\\sqrt{\\dfrac{11}{13}}$ (iii) $5\\sqrt{\\dfrac{11}{3}}$ (iv) $10\\sqrt{\\dfrac{11}{3}}$",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">With $w=(3,1,5)$: $w\\cdot v=10$, $\\|v\\|^2=6$, $\\|w\\|^2=35$. Then $d^2=\\|w\\|^2-\\dfrac{(w\\cdot v)^2}{\\|v\\|^2}=35-\\dfrac{100}{6}=\\dfrac{55}{3}$, so $d=\\sqrt{55/3}$ — (i).</div><div class=\"ml-vi\">Với $w=(3,1,5)$: $w\\cdot v=10$, $\\|v\\|^2=6$, $\\|w\\|^2=35$. Khi đó $d^2=\\|w\\|^2-\\dfrac{(w\\cdot v)^2}{\\|v\\|^2}=35-\\dfrac{100}{6}=\\dfrac{55}{3}$, nên $d=\\sqrt{55/3}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A(-2,1,3)$ and $B(1,2,4)$. Let $P(a,b,c)$ be the point on the line $AB$ that is closest to the origin. Find $a$.|||Cho $A(-2,1,3)$ và $B(1,2,4)$. Gọi $P(a,b,c)$ là điểm trên đường thẳng $AB$ gần gốc toạ độ nhất. Tìm $a$.",
          "options": [
            {
              "text": "35/11|||35/11"
            },
            {
              "text": "13/11|||13/11"
            },
            {
              "text": "-16/11|||-16/11"
            },
            {
              "text": "-2/11|||-2/11"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Direction $d=B-A=(3,1,1)$, $P=A+td$. Closest to $O$ means $\\overrightarrow{OP}\\cdot d=0$: $A\\cdot d+t\\|d\\|^2=0$ with $A\\cdot d=-2$, $\\|d\\|^2=11\\Rightarrow t=\\dfrac{2}{11}$. Then $a=-2+3\\cdot\\dfrac{2}{11}=-\\dfrac{16}{11}$.</div><div class=\"ml-vi\">Vectơ chỉ phương $d=B-A=(3,1,1)$, $P=A+td$. Gần $O$ nhất nghĩa là $\\overrightarrow{OP}\\cdot d=0$: $A\\cdot d+t\\|d\\|^2=0$ với $A\\cdot d=-2$, $\\|d\\|^2=11\\Rightarrow t=\\dfrac{2}{11}$. Vậy $a=-2+3\\cdot\\dfrac{2}{11}=-\\dfrac{16}{11}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $u$ and $v$ are two nonzero vectors, then $u$ and $v$ are parallel if and only if ______<br>(i) $\\|u\\times v\\|=-1$ (ii) $\\|u\\times v\\|=0$ (iii) $\\|u\\times v\\|=1$|||Nếu $u$ và $v$ là hai vectơ khác không thì $u$ và $v$ song song khi và chỉ khi ______<br>(i) $\\|u\\times v\\|=-1$ (ii) $\\|u\\times v\\|=0$ (iii) $\\|u\\times v\\|=1$",
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
              "text": "None of other choices is correct|||Không phương án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\|u\\times v\\|=\\|u\\|\\|v\\|\\sin\\theta$; for nonzero vectors this vanishes exactly when $\\sin\\theta=0$, i.e. the vectors are parallel. ((i) is impossible since a norm is never negative.)</div><div class=\"ml-vi\">$\\|u\\times v\\|=\\|u\\|\\|v\\|\\sin\\theta$; với các vectơ khác không, biểu thức này bằng 0 đúng khi $\\sin\\theta=0$, tức hai vectơ song song. ((i) vô lý vì chuẩn không bao giờ âm.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be the projection on the line $y=3x$ followed by the reflection in the line $y=-x$. Find $T([1\\ \\ 3]^{T})$.<br>(i) $[3\\ \\ -1]^{T}$ (ii) $[-1\\ \\ 3]^{T}$ (iii) $[-3\\ \\ -1]^{T}$ (iv) $[1\\ \\ -3]^{T}$|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép chiếu lên đường thẳng $y=3x$ rồi đối xứng qua đường thẳng $y=-x$. Tìm $T([1\\ \\ 3]^{T})$.<br>(i) $[3\\ \\ -1]^{T}$ (ii) $[-1\\ \\ 3]^{T}$ (iii) $[-3\\ \\ -1]^{T}$ (iv) $[1\\ \\ -3]^{T}$",
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
          "explanation": "<div class=\"ml-en\">$(1,3)$ already lies on $y=3x$, so the projection leaves it unchanged. Reflection in $y=-x$ sends $(x,y)\\mapsto(-y,-x)$, giving $(-3,-1)$ — (iii).</div><div class=\"ml-vi\">Điểm $(1,3)$ đã nằm trên $y=3x$ nên phép chiếu giữ nguyên. Phép đối xứng qua $y=-x$ biến $(x,y)\\mapsto(-y,-x)$, cho $(-3,-1)$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=[1,1,1]$, $V=[0,1,2]$, $W=[2,0,3]$ and $K=[0,0,1]$. The vector $K$ can be written uniquely as $K=aU+bV+cW$ where $a,b,c$ are numbers. Find $a$.|||Cho $U=[1,1,1]$, $V=[0,1,2]$, $W=[2,0,3]$ và $K=[0,0,1]$. Vectơ $K$ được viết duy nhất dưới dạng $K=aU+bV+cW$ với $a,b,c$ là các số. Tìm $a$.",
          "options": [
            {
              "text": "2/5|||2/5"
            },
            {
              "text": "-1/5|||-1/5"
            },
            {
              "text": "-2/5|||-2/5"
            },
            {
              "text": "1/5|||1/5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Componentwise: $a+2c=0$, $a+b=0$, $a+2b+3c=1$. From the first two, $a=-2c$ and $b=-a=2c$; substituting into the third: $-2c+4c+3c=5c=1\\Rightarrow c=\\dfrac15$, hence $a=-\\dfrac25$.</div><div class=\"ml-vi\">Theo từng thành phần: $a+2c=0$, $a+b=0$, $a+2b+3c=1$. Từ hai phương trình đầu, $a=-2c$ và $b=-a=2c$; thế vào phương trình thứ ba: $-2c+4c+3c=5c=1\\Rightarrow c=\\dfrac15$, suy ra $a=-\\dfrac25$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are subspaces of $\\mathbb{R}^3$?<br>(i) $U=\\{(4a-b,\\ 3a-7b,\\ 2a+b)\\mid a,b \\text{ are any real numbers}\\}$ (ii) $U=\\{(a,b,c)\\mid 2a-3b+c=0,\\ a-b+c=1\\}$|||Tập nào sau đây là không gian con của $\\mathbb{R}^3$?<br>(i) $U=\\{(4a-b,\\ 3a-7b,\\ 2a+b)\\mid a,b \\text{ là các số thực bất kỳ}\\}$ (ii) $U=\\{(a,b,c)\\mid 2a-3b+c=0,\\ a-b+c=1\\}$",
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
              "text": "Neither (i) or (ii)|||Không tập nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) is the span of $(4,3,2)$ and $(-1,-7,1)$ — a span is always a subspace. (ii) fails: the equation $a-b+c=1$ is not homogeneous, so the zero vector is not in the set.</div><div class=\"ml-vi\">(i) là span của $(4,3,2)$ và $(-1,-7,1)$ — span luôn là không gian con. (ii) không phải: phương trình $a-b+c=1$ không thuần nhất nên vectơ không không thuộc tập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true?<br>(i) $\\left\\{\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},\\begin{bmatrix}1\\\\-1\\\\0\\end{bmatrix},\\begin{bmatrix}4\\\\-1\\\\3\\end{bmatrix}\\right\\}$ is a basis of $\\mathbb{R}^3$. (ii) $\\left\\{\\begin{bmatrix}3\\\\1\\end{bmatrix},\\begin{bmatrix}1\\\\2\\end{bmatrix},\\begin{bmatrix}1\\\\-3\\end{bmatrix}\\right\\}$ is a basis of $\\mathbb{R}^2$.|||Phát biểu nào sau đây đúng?<br>(i) $\\left\\{\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},\\begin{bmatrix}1\\\\-1\\\\0\\end{bmatrix},\\begin{bmatrix}4\\\\-1\\\\3\\end{bmatrix}\\right\\}$ là một cơ sở của $\\mathbb{R}^3$. (ii) $\\left\\{\\begin{bmatrix}3\\\\1\\end{bmatrix},\\begin{bmatrix}1\\\\2\\end{bmatrix},\\begin{bmatrix}1\\\\-3\\end{bmatrix}\\right\\}$ là một cơ sở của $\\mathbb{R}^2$.",
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
              "text": "Neither (i) nor (ii)|||Không phát biểu nào"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) The determinant of the three columns is $0$ (indeed the third vector equals the sum of the first two: $(1,2,3)+(1,-1,0)\\cdot3=(4,-1,3)$), so they are dependent — not a basis. (ii) Three vectors in $\\mathbb{R}^2$ are always dependent — not a basis either.</div><div class=\"ml-vi\">(i) Định thức của ba cột bằng $0$ (thực tế vectơ thứ ba là tổ hợp của hai vectơ đầu: $(1,2,3)+3(1,-1,0)=(4,-1,3)$) nên chúng phụ thuộc — không phải cơ sở. (ii) Ba vectơ trong $\\mathbb{R}^2$ luôn phụ thuộc tuyến tính — cũng không phải cơ sở.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{(a,b,c,d)\\mid 3a-5d=0,\\ b+c+d=0\\}$ be a subspace of $\\mathbb{R}^4$. Find the dimension of $U$.|||Cho $U=\\{(a,b,c,d)\\mid 3a-5d=0,\\ b+c+d=0\\}$ là không gian con của $\\mathbb{R}^4$. Tìm số chiều của $U$.",
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
          "explanation": "<div class=\"ml-en\">The two constraints are independent, so $\\dim U=4-2=2$. Explicitly, taking $c$ and $d$ free: $a=\\dfrac{5d}{3}$, $b=-c-d$, a 2-parameter family.</div><div class=\"ml-vi\">Hai ràng buộc độc lập nên $\\dim U=4-2=2$. Cụ thể, chọn $c$ và $d$ tự do: $a=\\dfrac{5d}{3}$, $b=-c-d$, tức họ nghiệm 2 tham số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all $a$, $b$ and $c$ such that the set $[1\\ \\ 2\\ \\ 1\\ \\ 1]$, $[2\\ \\ 1\\ \\ -1\\ \\ -3]$, $[a\\ \\ b\\ \\ c\\ \\ 3]$ is orthogonal.|||Tìm tất cả $a$, $b$, $c$ sao cho tập $[1\\ \\ 2\\ \\ 1\\ \\ 1]$, $[2\\ \\ 1\\ \\ -1\\ \\ -3]$, $[a\\ \\ b\\ \\ c\\ \\ 3]$ là trực giao.",
          "options": [
            {
              "text": "$a=s+7$, $b=-s-5$, $c=s$|||$a=s+7$, $b=-s-5$, $c=s$"
            },
            {
              "text": "$a=4s$, $b=4s-3$, $c=s$|||$a=4s$, $b=4s-3$, $c=s$"
            },
            {
              "text": "$a=s-6$, $b=3s+3$, $c=s$|||$a=s-6$, $b=3s+3$, $c=s$"
            },
            {
              "text": "$a=s+5$, $b=s-7$, $c=s$|||$a=s+5$, $b=s-7$, $c=s$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The first two vectors are already orthogonal ($2+2-1-3=0$). Requiring the third to be orthogonal to both, with $c=s$: $a+2b+s+3=0$ and $2a+b-s-9=0$. Solving gives $b=-s-5$ and $a=s+7$.</div><div class=\"ml-vi\">Hai vectơ đầu đã trực giao ($2+2-1-3=0$). Yêu cầu vectơ thứ ba trực giao với cả hai, đặt $c=s$: $a+2b+s+3=0$ và $2a+b-s-9=0$. Giải ra $b=-s-5$ và $a=s+7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the dimension of the column space of $\\begin{bmatrix}-1&7&0&3&1\\\\1&-1&0&-1&-1\\\\0&-3&0&-1&-1\\\\0&5&3&4&-3\\end{bmatrix}$.|||Tìm số chiều của không gian cột của $\\begin{bmatrix}-1&7&0&3&1\\\\1&-1&0&-1&-1\\\\0&-3&0&-1&-1\\\\0&5&3&4&-3\\end{bmatrix}$.",
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
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Row-reduce: $R_1+R_2=[0,6,0,2,0]$; combining with $R_3$ gives $[0,0,0,0,-1]$; $R_4$ still contributes a pivot in column 3. Four independent rows remain, so the rank — and therefore $\\dim\\operatorname{Col}$ — is 4 (the maximum possible for a $4\\times5$ matrix).</div><div class=\"ml-vi\">Khử hàng: $R_1+R_2=[0,6,0,2,0]$; kết hợp với $R_3$ được $[0,0,0,0,-1]$; $R_4$ vẫn cho một trụ ở cột 3. Còn lại 4 hàng độc lập nên hạng — và do đó $\\dim\\operatorname{Col}$ — bằng 4 (tối đa với ma trận $4\\times5$).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D4",
      "source": "REAL",
      "sortOrder": 3,
      "title": "Đề 4 — SP26 Final Exam|||Đề 4 — Thi cuối kỳ SP26",
      "description": "MAE101 real FE multiple-choice paper (Spring 2026), transcribed from the exam images; answers reasoned here. (50 questions)|||Đề trắc nghiệm FE thật môn MAE101 (kỳ Xuân 2026), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (50 câu)",
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
          "prompt": "Find the range of the function $f(x)=x^3+5$.<br>(i) $(-\\infty,5)$ (ii) $(-\\infty,\\infty)$ (iii) $(5,\\infty)$|||Tìm tập giá trị của hàm $f(x)=x^3+5$.<br>(i) $(-\\infty,5)$ (ii) $(-\\infty,\\infty)$ (iii) $(5,\\infty)$",
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
              "text": "None of them|||Không phương án nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$x\\mapsto x^3$ is onto $\\mathbb{R}$ (it is continuous, increasing, and unbounded in both directions); shifting by $+5$ keeps the range $(-\\infty,\\infty)$.</div><div class=\"ml-vi\">$x\\mapsto x^3$ nhận mọi giá trị thực (liên tục, đồng biến, không bị chặn hai phía); cộng thêm $5$ nên tập giá trị vẫn là $(-\\infty,\\infty)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A car was purchased for USD 20000. The value of the car depreciates by USD 1500 per year; find a linear function that models the value $V$ of the car after $t$ years.|||Một chiếc xe được mua với giá 20000 USD. Giá trị xe giảm 1500 USD mỗi năm; tìm hàm bậc nhất mô tả giá trị $V$ của xe sau $t$ năm.",
          "options": [
            {
              "text": "$V(t)=20000+1500t$|||$V(t)=20000+1500t$"
            },
            {
              "text": "$V(t)=20000-1500t$|||$V(t)=20000-1500t$"
            },
            {
              "text": "$V(t)=1500+20000t$|||$V(t)=1500+20000t$"
            },
            {
              "text": "$V(t)=(20000-1500)t$|||$V(t)=(20000-1500)t$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Initial value $20000$ at $t=0$ and a constant loss of $1500$ per year gives slope $-1500$: $V(t)=20000-1500t$.</div><div class=\"ml-vi\">Giá trị ban đầu $20000$ tại $t=0$ và mỗi năm mất $1500$ nên hệ số góc là $-1500$: $V(t)=20000-1500t$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to1^{-}}\\dfrac{\\left|x^2-4x+3\\right|}{x-1}$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to1^{-}}\\dfrac{\\left|x^2-4x+3\\right|}{x-1}$",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "-3|||-3"
            },
            {
              "text": "0|||0"
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
            3
          ],
          "explanation": "<div class=\"ml-en\">$x^2-4x+3=(x-1)(x-3)$. For $x\\to1^{-}$ both factors are negative, so the product is positive and $|x^2-4x+3|=(x-1)(x-3)$. The quotient is $x-3\\to-2$.</div><div class=\"ml-vi\">$x^2-4x+3=(x-1)(x-3)$. Khi $x\\to1^{-}$ cả hai thừa số đều âm nên tích dương và $|x^2-4x+3|=(x-1)(x-3)$. Thương bằng $x-3\\to-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the number $a$ such that the function $f(x)=\\begin{cases}\\dfrac{\\sqrt{x+7}-3}{x-2}, & x\\neq2\\\\[4pt] a, & x=2\\end{cases}$ is continuous at 2.|||Tìm số $a$ để hàm $f(x)=\\begin{cases}\\dfrac{\\sqrt{x+7}-3}{x-2}, & x\\neq2\\\\[4pt] a, & x=2\\end{cases}$ liên tục tại 2.",
          "options": [
            {
              "text": "0|||0"
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
              "text": "1/6|||1/6"
            },
            {
              "text": "Does not exist|||Không tồn tại"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Rationalize: $\\dfrac{\\sqrt{x+7}-3}{x-2}=\\dfrac{x-2}{(x-2)(\\sqrt{x+7}+3)}=\\dfrac{1}{\\sqrt{x+7}+3}\\to\\dfrac{1}{6}$ as $x\\to2$, so $a=\\dfrac16$.</div><div class=\"ml-vi\">Nhân liên hợp: $\\dfrac{\\sqrt{x+7}-3}{x-2}=\\dfrac{x-2}{(x-2)(\\sqrt{x+7}+3)}=\\dfrac{1}{\\sqrt{x+7}+3}\\to\\dfrac{1}{6}$ khi $x\\to2$, nên $a=\\dfrac16$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Simplify the quotient $\\dfrac{f(x+h)-f(x)}{h}$ for $f(x)=-x^3+2$.<br>(i) $3xh-3x^2+h$ (ii) $-3xh-3x^2-h^2$ (iii) $3x+3x^2-h$ (iv) $3x-3x^2+h$|||Rút gọn $\\dfrac{f(x+h)-f(x)}{h}$ với $f(x)=-x^3+2$.<br>(i) $3xh-3x^2+h$ (ii) $-3xh-3x^2-h^2$ (iii) $3x+3x^2-h$ (iv) $3x-3x^2+h$",
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
          "explanation": "<div class=\"ml-en\">$\\dfrac{-(x+h)^3+x^3}{h}=\\dfrac{-(3x^2h+3xh^2+h^3)}{h}=-3x^2-3xh-h^2$ — that is (ii).</div><div class=\"ml-vi\">$\\dfrac{-(x+h)^3+x^3}{h}=\\dfrac{-(3x^2h+3xh^2+h^3)}{h}=-3x^2-3xh-h^2$ — chính là (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\dfrac{d^4y}{dx^4}$ for $y=\\sqrt[3]{x}$.<br>(i) $-\\dfrac{80}{81x^{7/3}}$ (ii) $\\dfrac{80}{81x^{7/3}}$ (iii) $\\dfrac{80}{81x^{11/3}}$ (iv) $-\\dfrac{80}{81x^{11/3}}$|||Tìm $\\dfrac{d^4y}{dx^4}$ với $y=\\sqrt[3]{x}$.<br>(i) $-\\dfrac{80}{81x^{7/3}}$ (ii) $\\dfrac{80}{81x^{7/3}}$ (iii) $\\dfrac{80}{81x^{11/3}}$ (iv) $-\\dfrac{80}{81x^{11/3}}$",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$y=x^{1/3}$: $y'=\\tfrac13x^{-2/3}$, $y''=-\\tfrac29x^{-5/3}$, $y'''=\\tfrac{10}{27}x^{-8/3}$, $y^{(4)}=-\\tfrac{80}{81}x^{-11/3}=-\\dfrac{80}{81x^{11/3}}$ — (iv).</div><div class=\"ml-vi\">$y=x^{1/3}$: $y'=\\tfrac13x^{-2/3}$, $y''=-\\tfrac29x^{-5/3}$, $y'''=\\tfrac{10}{27}x^{-8/3}$, $y^{(4)}=-\\tfrac{80}{81}x^{-11/3}=-\\dfrac{80}{81x^{11/3}}$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A particle moves along a straight line with displacement given by $s(t)=t^2-8t+18$. What is the instantaneous velocity when $t=4$?|||Một chất điểm chuyển động thẳng với li độ $s(t)=t^2-8t+18$. Vận tốc tức thời khi $t=4$ bằng bao nhiêu?",
          "options": [
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$v(t)=s'(t)=2t-8$, so $v(4)=8-8=0$ (the particle turns around at $t=4$).</div><div class=\"ml-vi\">$v(t)=s'(t)=2t-8$, nên $v(4)=8-8=0$ (chất điểm đổi chiều tại $t=4$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $f(u)=u^3$, $g(x)=\\dfrac{x+4}{x-2}$, find $(f\\circ g)'(3)$.|||Cho $f(u)=u^3$, $g(x)=\\dfrac{x+4}{x-2}$, tìm $(f\\circ g)'(3)$.",
          "options": [
            {
              "text": "882|||882"
            },
            {
              "text": "147|||147"
            },
            {
              "text": "-147|||-147"
            },
            {
              "text": "-882|||-882"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Chain rule: $(f\\circ g)'(x)=3g(x)^2g'(x)$. Here $g(3)=7$ and $g'(x)=\\dfrac{-6}{(x-2)^2}\\Rightarrow g'(3)=-6$, so the value is $3\\cdot49\\cdot(-6)=-882$.</div><div class=\"ml-vi\">Quy tắc dây chuyền: $(f\\circ g)'(x)=3g(x)^2g'(x)$. Ở đây $g(3)=7$ và $g'(x)=\\dfrac{-6}{(x-2)^2}\\Rightarrow g'(3)=-6$, nên giá trị là $3\\cdot49\\cdot(-6)=-882$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Differentiate implicitly to find the slope of the curve at the given point: $y^3+yx^2+x^2-3y^2=0$, $(-1,1)$.|||Đạo hàm hàm ẩn để tìm hệ số góc của đường cong tại điểm đã cho: $y^3+yx^2+x^2-3y^2=0$, $(-1,1)$.",
          "options": [
            {
              "text": "-1/2|||-1/2"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "3/2|||3/2"
            },
            {
              "text": "-1|||-1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Differentiating: $3y^2y'+(y'x^2+2xy)+2x-6yy'=0$. At $(-1,1)$: $3y'+y'-2-2-6y'=0\\Rightarrow-2y'=4\\Rightarrow y'=-2$.</div><div class=\"ml-vi\">Đạo hàm hai vế: $3y^2y'+(y'x^2+2xy)+2x-6yy'=0$. Tại $(-1,1)$: $3y'+y'-2-2-6y'=0\\Rightarrow-2y'=4\\Rightarrow y'=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The area of a square is decreasing at a rate of $30\\ \\text{cm}^2$/s. At what rate (in cm/s) is the side of the square changing when the area of the square is $625\\ \\text{cm}^2$?|||Diện tích một hình vuông đang giảm với tốc độ $30\\ \\text{cm}^2$/s. Cạnh hình vuông thay đổi với tốc độ nào (cm/s) khi diện tích bằng $625\\ \\text{cm}^2$?",
          "options": [
            {
              "text": "0.6|||0.6"
            },
            {
              "text": "1.2|||1.2"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "-0.6|||-0.6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-1.2|||-1.2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$A=s^2\\Rightarrow\\dfrac{dA}{dt}=2s\\dfrac{ds}{dt}$. With $A=625$, $s=25$ and $\\dfrac{dA}{dt}=-30$: $-30=50\\dfrac{ds}{dt}\\Rightarrow\\dfrac{ds}{dt}=-0.6$ cm/s.</div><div class=\"ml-vi\">$A=s^2\\Rightarrow\\dfrac{dA}{dt}=2s\\dfrac{ds}{dt}$. Với $A=625$, $s=25$ và $\\dfrac{dA}{dt}=-30$: $-30=50\\dfrac{ds}{dt}\\Rightarrow\\dfrac{ds}{dt}=-0.6$ cm/s.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The edge of a cube was found to be 20 cm with a possible error in measurement of at most 0.1 cm. What is the maximum possible error in computing the surface area of the cube?|||Cạnh của một hình lập phương đo được 20 cm với sai số tối đa 0.1 cm. Sai số tối đa có thể khi tính diện tích toàn phần của hình lập phương là bao nhiêu?",
          "options": [
            {
              "text": "24|||24"
            },
            {
              "text": "2.4|||2.4"
            },
            {
              "text": "240|||240"
            },
            {
              "text": "0.24|||0.24"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$S=6x^2\\Rightarrow dS=12x\\,dx=12(20)(0.1)=24\\ \\text{cm}^2$.</div><div class=\"ml-vi\">$S=6x^2\\Rightarrow dS=12x\\,dx=12(20)(0.1)=24\\ \\text{cm}^2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute maximum and absolute minimum values of $f(x)=x^3-3x^2+3x+1$ on $[0,2]$.|||Tìm giá trị lớn nhất và nhỏ nhất tuyệt đối của $f(x)=x^3-3x^2+3x+1$ trên $[0,2]$.",
          "options": [
            {
              "text": "Absolute maximum: 3, absolute minimum: 2|||Lớn nhất: 3, nhỏ nhất: 2"
            },
            {
              "text": "Absolute maximum: 3, absolute minimum: 1|||Lớn nhất: 3, nhỏ nhất: 1"
            },
            {
              "text": "Absolute maximum: 2, absolute minimum: 1|||Lớn nhất: 2, nhỏ nhất: 1"
            },
            {
              "text": "Absolute maximum: 3, absolute minimum: 0|||Lớn nhất: 3, nhỏ nhất: 0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=3x^2-6x+3=3(x-1)^2\\geq0$, so $f$ is increasing on $[0,2]$: minimum $f(0)=1$, maximum $f(2)=3$.</div><div class=\"ml-vi\">$f'(x)=3x^2-6x+3=3(x-1)^2\\geq0$ nên $f$ đồng biến trên $[0,2]$: nhỏ nhất $f(0)=1$, lớn nhất $f(2)=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find points of inflection for $f(x)=x^3-3x^2+2x+15$.|||Tìm điểm uốn của $f(x)=x^3-3x^2+2x+15$.",
          "options": [
            {
              "text": "$(-1,13)$|||$(-1,13)$"
            },
            {
              "text": "$(-1,14)$|||$(-1,14)$"
            },
            {
              "text": "$(0,15)$|||$(0,15)$"
            },
            {
              "text": "$(1,15)$|||$(1,15)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f''(x)=6x-6=0\\Rightarrow x=1$, and $f''$ changes sign there. $f(1)=1-3+2+15=15$, so the inflection point is $(1,15)$.</div><div class=\"ml-vi\">$f''(x)=6x-6=0\\Rightarrow x=1$, và $f''$ đổi dấu tại đó. $f(1)=1-3+2+15=15$, nên điểm uốn là $(1,15)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the limit $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{x-1}{(x-2)\\sqrt{x}}$.|||Tìm giới hạn $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{x-1}{(x-2)\\sqrt{x}}$.",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "positive infinity|||dương vô cùng"
            },
            {
              "text": "negative infinity|||âm vô cùng"
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
          "explanation": "<div class=\"ml-en\">The numerator grows like $x$ while the denominator grows like $x^{3/2}$, so the quotient behaves like $x^{-1/2}\\to0$.</div><div class=\"ml-vi\">Tử tăng cỡ $x$ còn mẫu tăng cỡ $x^{3/2}$ nên thương hành xử như $x^{-1/2}\\to0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find two positive numbers such that the sum of the first and three times the second is 60, and the product of the numbers is as large as possible.|||Tìm hai số dương sao cho tổng của số thứ nhất và ba lần số thứ hai bằng 60, và tích hai số lớn nhất có thể.",
          "options": [
            {
              "text": "30 and 10|||30 và 10"
            },
            {
              "text": "-10 and 90|||-10 và 90"
            },
            {
              "text": "15 and 15|||15 và 15"
            },
            {
              "text": "0 and 60|||0 và 60"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">With $x+3y=60$, maximize $P=xy=(60-3y)y$. Then $P'=60-6y=0\\Rightarrow y=10$ and $x=30$; the product is $300$.</div><div class=\"ml-vi\">Với $x+3y=60$, cực đại hoá $P=xy=(60-3y)y$. Khi đó $P'=60-6y=0\\Rightarrow y=10$ và $x=30$; tích bằng $300$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the initial approximation $x_1=1$ to find $x_3$, the third approximation to the root of the equation $x^5-10=0$. Round your answer to 4 decimal places.|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1=1$ để tìm $x_3$, xấp xỉ thứ ba của nghiệm phương trình $x^5-10=0$. Làm tròn 4 chữ số thập phân.",
          "options": [
            {
              "text": "2.2725|||2.2725"
            },
            {
              "text": "2.8000|||2.8000"
            },
            {
              "text": "1.9952|||1.9952"
            },
            {
              "text": "2.4341|||2.4341"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=x^5-10$, $f'(x)=5x^4$. $x_2=1-\\dfrac{1-10}{5}=2.8$. Then $x_3=2.8-\\dfrac{2.8^5-10}{5\\cdot2.8^4}=2.8-\\dfrac{162.1037}{307.328}\\approx2.2725$.</div><div class=\"ml-vi\">$f(x)=x^5-10$, $f'(x)=5x^4$. $x_2=1-\\dfrac{1-10}{5}=2.8$. Tiếp: $x_3=2.8-\\dfrac{2.8^5-10}{5\\cdot2.8^4}=2.8-\\dfrac{162.1037}{307.328}\\approx2.2725$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Left Riemann sum with $n=3$ ($L_3$) to approximate $I=\\displaystyle\\int_0^3\\ln(1+x)\\,dx$. Let Error $=|L_3-I|$. What is the value of the error? (Round your final answer to three decimal places.)|||Dùng tổng Riemann trái với $n=3$ ($L_3$) để xấp xỉ $I=\\displaystyle\\int_0^3\\ln(1+x)\\,dx$. Đặt Sai số $=|L_3-I|$. Giá trị sai số là bao nhiêu? (Làm tròn ba chữ số thập phân.)",
          "options": [
            {
              "text": "2.545|||2.545"
            },
            {
              "text": "1.791|||1.791"
            },
            {
              "text": "0.753|||0.753"
            },
            {
              "text": "0.234|||0.234"
            },
            {
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=1$ and left endpoints $0,1,2$ give $L_3=\\ln1+\\ln2+\\ln3=1.7918$. Exactly, $I=\\left[(1+x)\\ln(1+x)-(1+x)\\right]_0^3=4\\ln4-3=2.5452$. Error $=|1.7918-2.5452|\\approx0.753$.</div><div class=\"ml-vi\">$\\Delta x=1$ và các điểm mút trái $0,1,2$ cho $L_3=\\ln1+\\ln2+\\ln3=1.7918$. Chính xác, $I=\\left[(1+x)\\ln(1+x)-(1+x)\\right]_0^3=4\\ln4-3=2.5452$. Sai số $=|1.7918-2.5452|\\approx0.753$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Express the limit $\\displaystyle\\lim_{n\\to\\infty}\\dfrac1n\\left[\\sin\\!\\left(\\dfrac1n\\right)+\\sin\\!\\left(\\dfrac2n\\right)+\\cdots+\\sin\\!\\left(\\dfrac{n}{n}\\right)\\right]$ as a definite integral.<br>(i) $\\displaystyle\\int_0^{+\\infty}\\sin x\\,dx$ (ii) $\\displaystyle\\int_0^{+\\infty}\\cos x\\,dx$ (iii) $\\displaystyle\\int_0^{1}\\cos x\\,dx$ (iv) $\\displaystyle\\int_0^{1}\\sin x\\,dx$|||Biểu diễn giới hạn $\\displaystyle\\lim_{n\\to\\infty}\\dfrac1n\\left[\\sin\\!\\left(\\dfrac1n\\right)+\\sin\\!\\left(\\dfrac2n\\right)+\\cdots+\\sin\\!\\left(\\dfrac{n}{n}\\right)\\right]$ dưới dạng tích phân xác định.<br>(i) $\\displaystyle\\int_0^{+\\infty}\\sin x\\,dx$ (ii) $\\displaystyle\\int_0^{+\\infty}\\cos x\\,dx$ (iii) $\\displaystyle\\int_0^{1}\\cos x\\,dx$ (iv) $\\displaystyle\\int_0^{1}\\sin x\\,dx$",
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
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is a right-endpoint Riemann sum for $f(x)=\\sin x$ on $[0,1]$ with $\\Delta x=\\dfrac1n$ and $x_i=\\dfrac{i}{n}$, hence $\\displaystyle\\int_0^1\\sin x\\,dx$ — (iv).</div><div class=\"ml-vi\">Đây là tổng Riemann điểm mút phải của $f(x)=\\sin x$ trên $[0,1]$ với $\\Delta x=\\dfrac1n$ và $x_i=\\dfrac{i}{n}$, nên bằng $\\displaystyle\\int_0^1\\sin x\\,dx$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\dfrac{dy}{dx}$ for $y=\\displaystyle\\int_1^{x}e^{-t^2}\\,dt$.<br>(i) $e^{-x}$ (ii) $e^{x}$ (iii) $e^{x+2}$ (iv) $e^{-x+1}$ (v) $e^{-x^2}$|||Tìm $\\dfrac{dy}{dx}$ với $y=\\displaystyle\\int_1^{x}e^{-t^2}\\,dt$.<br>(i) $e^{-x}$ (ii) $e^{x}$ (iii) $e^{x+2}$ (iv) $e^{-x+1}$ (v) $e^{-x^2}$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">By the Fundamental Theorem of Calculus (Part 1), the derivative is the integrand evaluated at the upper limit: $e^{-x^2}$ — (v).</div><div class=\"ml-vi\">Theo định lý cơ bản của giải tích (phần 1), đạo hàm bằng hàm dưới dấu tích phân tại cận trên: $e^{-x^2}$ — (v).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume that $w'(t)$ is the rate of growth of a child's weight in kilograms in year $t$. What does the integral $\\displaystyle\\int_2^{7}w'(t)\\,dt$ represent?|||Giả sử $w'(t)$ là tốc độ tăng cân nặng (kg) của một đứa trẻ trong năm $t$. Tích phân $\\displaystyle\\int_2^{7}w'(t)\\,dt$ biểu thị điều gì?",
          "options": [
            {
              "text": "The increase in the child's height (in meters) between the ages of 2 and 7;|||Phần tăng chiều cao (mét) của đứa trẻ từ 2 đến 7 tuổi;"
            },
            {
              "text": "The decrease in the child's weight (in kilograms) between the ages of 2 and 7;|||Phần giảm cân nặng (kg) của đứa trẻ từ 2 đến 7 tuổi;"
            },
            {
              "text": "The child's weight at age 2;|||Cân nặng của đứa trẻ lúc 2 tuổi;"
            },
            {
              "text": "The increase in the child's weight (in kilograms) between the ages of 2 and 7;|||Phần tăng cân nặng (kg) của đứa trẻ từ 2 đến 7 tuổi;"
            },
            {
              "text": "The child's weight at age 7;|||Cân nặng của đứa trẻ lúc 7 tuổi;"
            },
            {
              "text": "None of the other choices is correct.|||Không đáp án nào đúng."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">By the Net Change Theorem, $\\displaystyle\\int_2^7w'(t)\\,dt=w(7)-w(2)$: the total change (increase) in weight between ages 2 and 7.</div><div class=\"ml-vi\">Theo định lý biến thiên toàn phần, $\\displaystyle\\int_2^7w'(t)\\,dt=w(7)-w(2)$: tổng mức thay đổi (tăng) cân nặng từ 2 đến 7 tuổi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the integral $\\displaystyle\\int_0^2\\dfrac{x\\,dx}{\\sqrt{9-x^2}}$.<br>(i) $3-\\sqrt5$ (ii) $\\sqrt5-3$ (iii) $5-\\sqrt3$ (iv) $3+\\sqrt5$|||Tính tích phân $\\displaystyle\\int_0^2\\dfrac{x\\,dx}{\\sqrt{9-x^2}}$.<br>(i) $3-\\sqrt5$ (ii) $\\sqrt5-3$ (iii) $5-\\sqrt3$ (iv) $3+\\sqrt5$",
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
              "text": "None of others|||Không phương án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An antiderivative is $-\\sqrt{9-x^2}$, so the value is $\\left[-\\sqrt{9-x^2}\\right]_0^2=-\\sqrt5+3=3-\\sqrt5$ — (i).</div><div class=\"ml-vi\">Một nguyên hàm là $-\\sqrt{9-x^2}$, nên giá trị bằng $\\left[-\\sqrt{9-x^2}\\right]_0^2=-\\sqrt5+3=3-\\sqrt5$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the integral $\\displaystyle\\int x^2\\sin 2x\\,dx$.<br>(i) $-\\dfrac{x^2\\cos2x}{2}+\\dfrac{x\\sin2x}{2}+\\dfrac{\\cos2x}{4}+C$ (ii) $\\dfrac{x^2\\cos2x}{2}-\\dfrac{x\\sin2x}{2}+\\dfrac{\\cos2x}{4}+C$ (iii) $\\dfrac{x^2\\cos2x}{2}+\\dfrac{x\\sin2x}{2}-\\dfrac{\\cos2x}{4}+C$ (iv) $-\\dfrac{x^2\\cos2x}{2}-\\dfrac{x\\sin2x}{2}-\\dfrac{\\cos2x}{4}+C$|||Tính tích phân $\\displaystyle\\int x^2\\sin 2x\\,dx$.<br>(i) $-\\dfrac{x^2\\cos2x}{2}+\\dfrac{x\\sin2x}{2}+\\dfrac{\\cos2x}{4}+C$ (ii) $\\dfrac{x^2\\cos2x}{2}-\\dfrac{x\\sin2x}{2}+\\dfrac{\\cos2x}{4}+C$ (iii) $\\dfrac{x^2\\cos2x}{2}+\\dfrac{x\\sin2x}{2}-\\dfrac{\\cos2x}{4}+C$ (iv) $-\\dfrac{x^2\\cos2x}{2}-\\dfrac{x\\sin2x}{2}-\\dfrac{\\cos2x}{4}+C$",
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
          "explanation": "<div class=\"ml-en\">Integrating by parts twice: $\\displaystyle\\int x^2\\sin2x\\,dx=-\\dfrac{x^2\\cos2x}{2}+\\displaystyle\\int x\\cos2x\\,dx=-\\dfrac{x^2\\cos2x}{2}+\\dfrac{x\\sin2x}{2}+\\dfrac{\\cos2x}{4}+C$ — (i).</div><div class=\"ml-vi\">Tích phân từng phần hai lần: $\\displaystyle\\int x^2\\sin2x\\,dx=-\\dfrac{x^2\\cos2x}{2}+\\displaystyle\\int x\\cos2x\\,dx=-\\dfrac{x^2\\cos2x}{2}+\\dfrac{x\\sin2x}{2}+\\dfrac{\\cos2x}{4}+C$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Midpoint Rule with $n=4$ to estimate the value of the integral $\\displaystyle\\int_2^4 f(x)\\,dx$<table class=\"exam-table\"><thead><tr><th>$x$</th><th>2.00</th><th>2.25</th><th>2.50</th><th>2.75</th><th>3.00</th><th>3.25</th><th>3.50</th><th>3.75</th><th>4.0</th></tr></thead><tbody><tr><td>$f(x)$</td><td>1.50</td><td>1.57</td><td>1.64</td><td>1.71</td><td>1.78</td><td>1.84</td><td>1.91</td><td>1.97</td><td>2.03</td></tr></tbody></table>|||Dùng quy tắc trung điểm với $n=4$ để ước lượng giá trị tích phân $\\displaystyle\\int_2^4 f(x)\\,dx$<table class=\"exam-table\"><thead><tr><th>$x$</th><th>2.00</th><th>2.25</th><th>2.50</th><th>2.75</th><th>3.00</th><th>3.25</th><th>3.50</th><th>3.75</th><th>4.0</th></tr></thead><tbody><tr><td>$f(x)$</td><td>1.50</td><td>1.57</td><td>1.64</td><td>1.71</td><td>1.78</td><td>1.84</td><td>1.91</td><td>1.97</td><td>2.03</td></tr></tbody></table>",
          "options": [
            {
              "text": "7.090|||7.090"
            },
            {
              "text": "2.978|||2.978"
            },
            {
              "text": "3.545|||3.545"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "5.645|||5.645"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=\\dfrac{4-2}{4}=0.5$; the midpoints are $2.25,\\ 2.75,\\ 3.25,\\ 3.75$ with $f$-values $1.57,\\ 1.71,\\ 1.84,\\ 1.97$ summing to $7.09$. Estimate $=0.5\\times7.09=3.545$.</div><div class=\"ml-vi\">$\\Delta x=\\dfrac{4-2}{4}=0.5$; các trung điểm là $2.25,\\ 2.75,\\ 3.25,\\ 3.75$ với giá trị $f$ là $1.57,\\ 1.71,\\ 1.84,\\ 1.97$, tổng $=7.09$. Ước lượng $=0.5\\times7.09=3.545$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the following improper integral $\\displaystyle\\int_0^1 x\\ln(4x)\\,dx$.|||Tính tích phân suy rộng $\\displaystyle\\int_0^1 x\\ln(4x)\\,dx$.",
          "options": [
            {
              "text": "Converges to $\\ln(2)-\\dfrac14$|||Hội tụ về $\\ln(2)-\\dfrac14$"
            },
            {
              "text": "None of the other choice is correct.|||Không đáp án nào đúng."
            },
            {
              "text": "Converges to $\\ln(2)$|||Hội tụ về $\\ln(2)$"
            },
            {
              "text": "Diverges|||Phân kỳ"
            },
            {
              "text": "Converges to $\\ln(2)+\\dfrac14$|||Hội tụ về $\\ln(2)+\\dfrac14$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\displaystyle\\int_0^1x\\ln(4x)dx=\\ln4\\displaystyle\\int_0^1x\\,dx+\\displaystyle\\int_0^1x\\ln x\\,dx=\\dfrac{\\ln4}{2}-\\dfrac14=\\ln2-\\dfrac14$ (the integrand stays integrable at $0$ since $x\\ln x\\to0$).</div><div class=\"ml-vi\">$\\displaystyle\\int_0^1x\\ln(4x)dx=\\ln4\\displaystyle\\int_0^1x\\,dx+\\displaystyle\\int_0^1x\\ln x\\,dx=\\dfrac{\\ln4}{2}-\\dfrac14=\\ln2-\\dfrac14$ (hàm vẫn khả tích tại $0$ vì $x\\ln x\\to0$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $x$ so that the matrix $\\begin{bmatrix}-x&x+1&x-1\\\\0&x^2&x\\end{bmatrix}$ is in reduced-row echelon form.|||Tìm $x$ để ma trận $\\begin{bmatrix}-x&x+1&x-1\\\\0&x^2&x\\end{bmatrix}$ ở dạng bậc thang rút gọn theo hàng.",
          "options": [
            {
              "text": "1 or -1|||1 hoặc -1"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "0 or -1|||0 hoặc -1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">If $x=-1$ the matrix is $\\begin{bmatrix}1&0&-2\\\\0&1&-1\\end{bmatrix}$ — a valid RREF. If $x=0$ it is $\\begin{bmatrix}0&1&-1\\\\0&0&0\\end{bmatrix}$ — also a valid RREF (leading 1 in column 2, zero row at the bottom). No other $x$ works, so $x=0$ or $x=-1$.</div><div class=\"ml-vi\">Nếu $x=-1$ ma trận là $\\begin{bmatrix}1&0&-2\\\\0&1&-1\\end{bmatrix}$ — đúng dạng RREF. Nếu $x=0$ ma trận là $\\begin{bmatrix}0&1&-1\\\\0&0&0\\end{bmatrix}$ — cũng là RREF hợp lệ (số 1 dẫn đầu ở cột 2, hàng không ở dưới cùng). Không có $x$ nào khác thoả, nên $x=0$ hoặc $x=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve the system of equations for $y$: $\\begin{cases}x+4y+2z=1\\\\2x+3y+3z=-1\\\\4x+y+4z=0\\end{cases}$|||Giải hệ phương trình tìm $y$: $\\begin{cases}x+4y+2z=1\\\\2x+3y+3z=-1\\\\4x+y+4z=0\\end{cases}$",
          "options": [
            {
              "text": "-4/5|||-4/5"
            },
            {
              "text": "8/5|||8/5"
            },
            {
              "text": "4/5|||4/5"
            },
            {
              "text": "-8/5|||-8/5"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Eliminate $x$ using the first equation: from equations 2 and 1, $5y+z=3$; from equations 3 and 1, $15y+4z=4$. Substituting $z=3-5y$: $15y+12-20y=4\\Rightarrow-5y=-8\\Rightarrow y=\\dfrac85$.</div><div class=\"ml-vi\">Khử $x$ nhờ phương trình đầu: từ (2) và (1) được $5y+z=3$; từ (3) và (1) được $15y+4z=4$. Thế $z=3-5y$: $15y+12-20y=4\\Rightarrow-5y=-8\\Rightarrow y=\\dfrac85$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The echelon form of the augmented matrix of a system of linear equations is given as $\\begin{bmatrix}1&0&-2&4&3&|&7\\\\0&0&1&3&0&|&-2\\\\0&0&0&1&8&|&0\\\\0&0&0&0&0&|&0\\end{bmatrix}$. Which of the following statements is true?|||Dạng bậc thang của ma trận bổ sung của một hệ phương trình tuyến tính là $\\begin{bmatrix}1&0&-2&4&3&|&7\\\\0&0&1&3&0&|&-2\\\\0&0&0&1&8&|&0\\\\0&0&0&0&0&|&0\\end{bmatrix}$. Phát biểu nào đúng?",
          "options": [
            {
              "text": "The system has a unique solution.|||Hệ có nghiệm duy nhất."
            },
            {
              "text": "There are exactly 2 variables that are free parameters|||Có đúng 2 ẩn là tham số tự do"
            },
            {
              "text": "There are exactly 3 variables that are free parameters|||Có đúng 3 ẩn là tham số tự do"
            },
            {
              "text": "The system has no solution.|||Hệ vô nghiệm."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">There are 5 unknowns and pivots in columns 1, 3, 4 (three pivots). The last row is all zeros, so the system is consistent, and the number of free variables is $5-3=2$.</div><div class=\"ml-vi\">Có 5 ẩn và các trụ ở cột 1, 3, 4 (ba trụ). Hàng cuối toàn số 0 nên hệ tương thích, và số ẩn tự do là $5-3=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $m$ for which the system $\\begin{cases}mx+2y+z=0\\\\x+y+3z=0\\\\2x+my-6z=0\\end{cases}$ has <b>nontrivial</b> solutions.|||Tìm tất cả giá trị $m$ để hệ $\\begin{cases}mx+2y+z=0\\\\x+y+3z=0\\\\2x+my-6z=0\\end{cases}$ có nghiệm <b>không tầm thường</b>.",
          "options": [
            {
              "text": "$m=1/3$|||$m=1/3$"
            },
            {
              "text": "$m$ is different from $1/3$|||$m$ khác $1/3$"
            },
            {
              "text": "$m=2,\\ -11/3$|||$m=2,\\ -11/3$"
            },
            {
              "text": "$m$ is different from $2,\\ -11/3$|||$m$ khác $2,\\ -11/3$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A homogeneous square system has nontrivial solutions exactly when the determinant vanishes: $\\det=-3m^2-5m+22=0\\Rightarrow3m^2+5m-22=0\\Rightarrow m=2$ or $m=-\\dfrac{11}{3}$.</div><div class=\"ml-vi\">Hệ thuần nhất vuông có nghiệm không tầm thường đúng khi định thức bằng 0: $\\det=-3m^2-5m+22=0\\Rightarrow3m^2+5m-22=0\\Rightarrow m=2$ hoặc $m=-\\dfrac{11}{3}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $s$, $t$ such that the given matrix is symmetric: $\\begin{bmatrix}s&t\\\\t+1&1\\end{bmatrix}$.|||Tìm tất cả giá trị $s$, $t$ để ma trận sau đối xứng: $\\begin{bmatrix}s&t\\\\t+1&1\\end{bmatrix}$.",
          "options": [
            {
              "text": "$s=1$, $t$ is arbitrary.|||$s=1$, $t$ tuỳ ý."
            },
            {
              "text": "There are no such $s$, $t$.|||Không tồn tại $s$, $t$ như vậy."
            },
            {
              "text": "$s=2$, $t=1$.|||$s=2$, $t=1$."
            },
            {
              "text": "$s=0$, $t=0$.|||$s=0$, $t=0$."
            },
            {
              "text": "$s=1$, $t=2$.|||$s=1$, $t=2$."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Symmetry requires the $(1,2)$- and $(2,1)$-entries to agree: $t=t+1$, which is impossible. Hence no such $s,t$ exist.</div><div class=\"ml-vi\">Tính đối xứng đòi hỏi phần tử $(1,2)$ và $(2,1)$ bằng nhau: $t=t+1$, điều này vô lý. Vậy không tồn tại $s,t$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T$ be the linear transformation defined by $T(X)=\\begin{bmatrix}1&0\\\\6&1\\end{bmatrix}X$. Describe geometrically the effect of $T$.|||Cho phép biến đổi tuyến tính $T(X)=\\begin{bmatrix}1&0\\\\6&1\\end{bmatrix}X$. Mô tả hình học tác dụng của $T$.",
          "options": [
            {
              "text": "Vertical shear|||Trượt đứng (vertical shear)"
            },
            {
              "text": "Projection onto x-axis|||Chiếu lên trục Ox"
            },
            {
              "text": "Projection onto y-axis|||Chiếu lên trục Oy"
            },
            {
              "text": "Horizontal shear|||Trượt ngang (horizontal shear)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$T(x,y)=(x,\\ 6x+y)$: the $x$-coordinate is unchanged while each point is pushed vertically by an amount proportional to $x$ — a vertical shear.</div><div class=\"ml-vi\">$T(x,y)=(x,\\ 6x+y)$: hoành độ giữ nguyên còn mỗi điểm bị đẩy theo phương đứng một lượng tỉ lệ với $x$ — đó là phép trượt đứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The sizes of two matrices $A$ and $B$ are $2\\times1$ and $1\\times1$, respectively. Find the sizes of the products $AB$ and $BA$, if they are defined.|||Cỡ của hai ma trận $A$ và $B$ lần lượt là $2\\times1$ và $1\\times1$. Tìm cỡ của các tích $AB$ và $BA$ nếu chúng xác định.",
          "options": [
            {
              "text": "$AB$ is $2\\times1$, $BA$ is undefined.|||$AB$ cỡ $2\\times1$, $BA$ không xác định."
            },
            {
              "text": "$AB$ is $2\\times2$, $BA$ is $1\\times1$.|||$AB$ cỡ $2\\times2$, $BA$ cỡ $1\\times1$."
            },
            {
              "text": "$AB$ is undefined, $BA$ is $1\\times2$.|||$AB$ không xác định, $BA$ cỡ $1\\times2$."
            },
            {
              "text": "$AB$ is $1\\times2$, $BA$ is $1\\times1$.|||$AB$ cỡ $1\\times2$, $BA$ cỡ $1\\times1$."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$AB$: $(2\\times1)(1\\times1)$ — inner dimensions match, result $2\\times1$. $BA$: $(1\\times1)(2\\times1)$ — inner dimensions $1\\neq2$, so it is undefined.</div><div class=\"ml-vi\">$AB$: $(2\\times1)(1\\times1)$ — kích thước trong khớp nhau, kết quả cỡ $2\\times1$. $BA$: $(1\\times1)(2\\times1)$ — kích thước trong $1\\neq2$ nên không xác định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ and $B$ be square matrices of the same size. Which of the following statements are true?<br>(i) If $AB=-3I$ then $A$ and $B$ are both invertible. (ii) If $A^{T}B=3I$ then $A$ and $B$ are both invertible.|||Cho $A$ và $B$ là các ma trận vuông cùng cỡ. Phát biểu nào đúng?<br>(i) Nếu $AB=-3I$ thì cả $A$ và $B$ đều khả nghịch. (ii) Nếu $A^{T}B=3I$ thì cả $A$ và $B$ đều khả nghịch.",
          "options": [
            {
              "text": "Only (i).|||Chỉ (i)."
            },
            {
              "text": "Both (i) and (ii).|||Cả (i) và (ii)."
            },
            {
              "text": "Only (ii).|||Chỉ (ii)."
            },
            {
              "text": "None of them.|||Không phát biểu nào."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">For square matrices, $AB=cI$ with $c\\neq0$ forces $\\det A\\det B\\neq0$, so both are invertible — (i) is true. In (ii), $A^{T}B=3I$ makes $A^{T}$ and $B$ invertible, and $\\det A=\\det A^{T}\\neq0$, so $A$ is invertible too — (ii) is true.</div><div class=\"ml-vi\">Với ma trận vuông, $AB=cI$ với $c\\neq0$ kéo theo $\\det A\\det B\\neq0$ nên cả hai khả nghịch — (i) đúng. Ở (ii), $A^{T}B=3I$ khiến $A^{T}$ và $B$ khả nghịch, mà $\\det A=\\det A^{T}\\neq0$ nên $A$ cũng khả nghịch — (ii) đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=(a_{ij})$ be the matrix of rotation in the plane through $\\pi/3$. Find $a_{12}$.<br>(i) $1/2$ (ii) $-1/2$ (iii) $\\dfrac{\\sqrt3}{2}$ (iv) $-\\dfrac{\\sqrt3}{2}$|||Cho $A=(a_{ij})$ là ma trận của phép quay trong mặt phẳng một góc $\\pi/3$. Tìm $a_{12}$.<br>(i) $1/2$ (ii) $-1/2$ (iii) $\\dfrac{\\sqrt3}{2}$ (iv) $-\\dfrac{\\sqrt3}{2}$",
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
          "explanation": "<div class=\"ml-en\">The rotation matrix is $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$, so $a_{12}=-\\sin\\dfrac{\\pi}{3}=-\\dfrac{\\sqrt3}{2}$ — (iv).</div><div class=\"ml-vi\">Ma trận quay là $\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$ nên $a_{12}=-\\sin\\dfrac{\\pi}{3}=-\\dfrac{\\sqrt3}{2}$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $L:\\mathbb{R}^3\\to\\mathbb{R}^2$ be a linear transformation for which we know that $L\\!\\begin{bmatrix}1\\\\0\\\\0\\end{bmatrix}=\\begin{bmatrix}1\\\\-2\\end{bmatrix}$, $L\\!\\begin{bmatrix}0\\\\1\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\-3\\end{bmatrix}$, $L\\!\\begin{bmatrix}0\\\\0\\\\1\\end{bmatrix}=\\begin{bmatrix}5\\\\1\\end{bmatrix}$. Find $L\\!\\begin{bmatrix}1\\\\-2\\\\3\\end{bmatrix}$.<br>(i) $\\begin{bmatrix}12\\\\7\\end{bmatrix}$ (ii) $\\begin{bmatrix}7\\\\12\\end{bmatrix}$ (iii) $\\begin{bmatrix}8\\\\-4\\end{bmatrix}$ (iv) $\\begin{bmatrix}-4\\\\8\\end{bmatrix}$|||Cho ánh xạ tuyến tính $L:\\mathbb{R}^3\\to\\mathbb{R}^2$ với $L\\!\\begin{bmatrix}1\\\\0\\\\0\\end{bmatrix}=\\begin{bmatrix}1\\\\-2\\end{bmatrix}$, $L\\!\\begin{bmatrix}0\\\\1\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\-3\\end{bmatrix}$, $L\\!\\begin{bmatrix}0\\\\0\\\\1\\end{bmatrix}=\\begin{bmatrix}5\\\\1\\end{bmatrix}$. Tìm $L\\!\\begin{bmatrix}1\\\\-2\\\\3\\end{bmatrix}$.<br>(i) $\\begin{bmatrix}12\\\\7\\end{bmatrix}$ (ii) $\\begin{bmatrix}7\\\\12\\end{bmatrix}$ (iii) $\\begin{bmatrix}8\\\\-4\\end{bmatrix}$ (iv) $\\begin{bmatrix}-4\\\\8\\end{bmatrix}$",
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
              "text": "None of the other choices are correct|||Không phương án nào đúng"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">By linearity, $L(1,-2,3)=1\\begin{bmatrix}1\\\\-2\\end{bmatrix}-2\\begin{bmatrix}2\\\\-3\\end{bmatrix}+3\\begin{bmatrix}5\\\\1\\end{bmatrix}=\\begin{bmatrix}1-4+15\\\\-2+6+3\\end{bmatrix}=\\begin{bmatrix}12\\\\7\\end{bmatrix}$ — (i).</div><div class=\"ml-vi\">Theo tính tuyến tính, $L(1,-2,3)=1\\begin{bmatrix}1\\\\-2\\end{bmatrix}-2\\begin{bmatrix}2\\\\-3\\end{bmatrix}+3\\begin{bmatrix}5\\\\1\\end{bmatrix}=\\begin{bmatrix}1-4+15\\\\-2+6+3\\end{bmatrix}=\\begin{bmatrix}12\\\\7\\end{bmatrix}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $4\\times4$ matrix and $\\det A=2$. Find $\\det(2A)$.|||Cho $A$ là ma trận $4\\times4$ với $\\det A=2$. Tìm $\\det(2A)$.",
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\det(kA)=k^{n}\\det A$ for an $n\\times n$ matrix, so $\\det(2A)=2^4\\cdot2=32$.</div><div class=\"ml-vi\">$\\det(kA)=k^{n}\\det A$ với ma trận $n\\times n$, nên $\\det(2A)=2^4\\cdot2=32$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $3\\times3$ matrix with <b>the cofactor matrix</b> $\\begin{bmatrix}1&0&2\\\\2&-1&0\\\\0&2&-1\\end{bmatrix}$. Given that $\\det(A)=3$, find the $(2,3)$-entry of the inverse matrix $A^{-1}$.|||Cho $A$ là ma trận $3\\times3$ với <b>ma trận phần bù đại số</b> $\\begin{bmatrix}1&0&2\\\\2&-1&0\\\\0&2&-1\\end{bmatrix}$. Biết $\\det(A)=3$, tìm phần tử $(2,3)$ của ma trận nghịch đảo $A^{-1}$.",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "2/3|||2/3"
            },
            {
              "text": "1/3|||1/3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A^{-1}=\\dfrac{1}{\\det A}\\operatorname{adj}(A)=\\dfrac{1}{3}C^{T}$ where $C$ is the cofactor matrix. Hence the $(2,3)$-entry equals $\\dfrac{C_{32}}{3}=\\dfrac{2}{3}$.</div><div class=\"ml-vi\">$A^{-1}=\\dfrac{1}{\\det A}\\operatorname{adj}(A)=\\dfrac{1}{3}C^{T}$ với $C$ là ma trận phần bù đại số. Do đó phần tử $(2,3)$ bằng $\\dfrac{C_{32}}{3}=\\dfrac{2}{3}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be an $n\\times n$ matrix. Choose correct statements:<br>(i) If $A^2=I$ then $A$ is invertible (ii) If $A^2=-A$ then $A$ is invertible|||Cho $A$ là ma trận $n\\times n$. Chọn phát biểu đúng:<br>(i) Nếu $A^2=I$ thì $A$ khả nghịch (ii) Nếu $A^2=-A$ thì $A$ khả nghịch",
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
          "explanation": "<div class=\"ml-en\">(i) $A\\cdot A=I$ exhibits $A^{-1}=A$, so $A$ is invertible. (ii) is false: $A=O$ satisfies $A^2=-A$ but is not invertible (in general $A^2=-A$ only gives $A(A+I)=O$).</div><div class=\"ml-vi\">(i) $A\\cdot A=I$ cho thấy $A^{-1}=A$ nên $A$ khả nghịch. (ii) sai: $A=O$ thoả $A^2=-A$ nhưng không khả nghịch (nói chung $A^2=-A$ chỉ cho $A(A+I)=O$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $A=\\begin{bmatrix}-4&3&1\\\\3&6&-1\\\\1&0&2\\end{bmatrix}$, $u=[3\\ \\ -1\\ \\ 2]^{T}$ and $v=[-7\\ \\ 2\\ \\ 1]^{T}$. Choose the correct statement.|||Cho $A=\\begin{bmatrix}-4&3&1\\\\3&6&-1\\\\1&0&2\\end{bmatrix}$, $u=[3\\ \\ -1\\ \\ 2]^{T}$ và $v=[-7\\ \\ 2\\ \\ 1]^{T}$. Chọn phát biểu đúng.",
          "options": [
            {
              "text": "$v$ is an eigenvector of $A$|||$v$ là vectơ riêng của $A$"
            },
            {
              "text": "$u$ is an eigenvector of $A$|||$u$ là vectơ riêng của $A$"
            },
            {
              "text": "Both $u$ and $v$ are eigenvectors of $A$|||Cả $u$ và $v$ đều là vectơ riêng của $A$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$Av=(35,-10,-5)=-5v$, so $v$ is an eigenvector (eigenvalue $-5$). But $Au=(-13,1,7)$ is not a multiple of $u=(3,-1,2)$, so $u$ is not.</div><div class=\"ml-vi\">$Av=(35,-10,-5)=-5v$ nên $v$ là vectơ riêng (trị riêng $-5$). Còn $Au=(-13,1,7)$ không phải bội của $u=(3,-1,2)$ nên $u$ không phải.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a set of basic eigenvectors of the matrix $\\begin{bmatrix}2&3\\\\3&2\\end{bmatrix}$.|||Tìm một hệ vectơ riêng cơ sở của ma trận $\\begin{bmatrix}2&3\\\\3&2\\end{bmatrix}$.",
          "options": [
            {
              "text": "$[0,1]$ and $[1,0]$|||$[0,1]$ và $[1,0]$"
            },
            {
              "text": "$[1,-5]$ and $[1,-1]$|||$[1,-5]$ và $[1,-1]$"
            },
            {
              "text": "$[1;1]$ and $[1;-1]$|||$[1;1]$ và $[1;-1]$"
            },
            {
              "text": "$[1,5]$ and $[1,-1]$|||$[1,5]$ và $[1,-1]$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Characteristic equation: $(2-\\lambda)^2-9=0\\Rightarrow\\lambda=5$ or $\\lambda=-1$. For $\\lambda=5$: $-3x+3y=0\\Rightarrow[1;1]$. For $\\lambda=-1$: $3x+3y=0\\Rightarrow[1;-1]$.</div><div class=\"ml-vi\">Phương trình đặc trưng: $(2-\\lambda)^2-9=0\\Rightarrow\\lambda=5$ hoặc $\\lambda=-1$. Với $\\lambda=5$: $-3x+3y=0\\Rightarrow[1;1]$. Với $\\lambda=-1$: $3x+3y=0\\Rightarrow[1;-1]$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all points $C$ on the line passing through the points $A(1,-1,1)$ and $B(3,0,5)$ such that $\\left\\|\\overrightarrow{AC}\\right\\|=3\\left\\|\\overrightarrow{BC}\\right\\|$.|||Tìm tất cả các điểm $C$ trên đường thẳng đi qua $A(1,-1,1)$ và $B(3,0,5)$ sao cho $\\left\\|\\overrightarrow{AC}\\right\\|=3\\left\\|\\overrightarrow{BC}\\right\\|$.",
          "options": [
            {
              "text": "$C(4,1/2,7)$ or $C(5/2,-1/4,4)$|||$C(4,1/2,7)$ hoặc $C(5/2,-1/4,4)$"
            },
            {
              "text": "$C(2,1/4,-3)$|||$C(2,1/4,-3)$"
            },
            {
              "text": "$C(5/2,-1,0)$ or $C(1,-1/3,0)$|||$C(5/2,-1,0)$ hoặc $C(1,-1/3,0)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Write $C=A+t(B-A)$ with $B-A=(2,1,4)$. Then $\\|\\overrightarrow{AC}\\|=|t|\\,\\|B-A\\|$ and $\\|\\overrightarrow{BC}\\|=|t-1|\\,\\|B-A\\|$, so $|t|=3|t-1|\\Rightarrow t=\\dfrac32$ or $t=\\dfrac34$, giving $C(4,\\tfrac12,7)$ and $C(\\tfrac52,-\\tfrac14,4)$.</div><div class=\"ml-vi\">Viết $C=A+t(B-A)$ với $B-A=(2,1,4)$. Khi đó $\\|\\overrightarrow{AC}\\|=|t|\\,\\|B-A\\|$ và $\\|\\overrightarrow{BC}\\|=|t-1|\\,\\|B-A\\|$, nên $|t|=3|t-1|\\Rightarrow t=\\dfrac32$ hoặc $t=\\dfrac34$, cho $C(4,\\tfrac12,7)$ và $C(\\tfrac52,-\\tfrac14,4)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a normal vector of the plane through $A(1,2,0)$, $B(1,1,1)$, $C(0,0,2)$.|||Tìm một vectơ pháp tuyến của mặt phẳng đi qua $A(1,2,0)$, $B(1,1,1)$, $C(0,0,2)$.",
          "options": [
            {
              "text": "all of the other choices are false|||Tất cả các phương án khác đều sai"
            },
            {
              "text": "$(3,-5,2)$|||$(3,-5,2)$"
            },
            {
              "text": "$(2,1,-3)$|||$(2,1,-3)$"
            },
            {
              "text": "$(0,-1,-1)$|||$(0,-1,-1)$"
            },
            {
              "text": "$(0,1,-1)$|||$(0,1,-1)$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\overrightarrow{AB}=(0,-1,1)$, $\\overrightarrow{AC}=(-1,-2,2)$, and $\\overrightarrow{AB}\\times\\overrightarrow{AC}=(0,-1,-1)$.</div><div class=\"ml-vi\">$\\overrightarrow{AB}=(0,-1,1)$, $\\overrightarrow{AC}=(-1,-2,2)$, và $\\overrightarrow{AB}\\times\\overrightarrow{AC}=(0,-1,-1)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $\\vec{u}=(3,0,3)$ and $\\vec{v}=(-5,1,8)$; the orthogonal projection of $\\vec{v}$ along $\\vec{u}$ is:|||Cho $\\vec{u}=(3,0,3)$ và $\\vec{v}=(-5,1,8)$; hình chiếu trực giao của $\\vec{v}$ lên $\\vec{u}$ là:",
          "options": [
            {
              "text": "$(-1,1/5,8/5)$|||$(-1,1/5,8/5)$"
            },
            {
              "text": "$(-3/2,0,-3/2)$|||$(-3/2,0,-3/2)$"
            },
            {
              "text": "$(1,-1/5,-8/5)$|||$(1,-1/5,-8/5)$"
            },
            {
              "text": "$(3/2,0,3/2)$|||$(3/2,0,3/2)$"
            },
            {
              "text": "$(5,-1,-8)$|||$(5,-1,-8)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\operatorname{proj}_{\\vec u}\\vec v=\\dfrac{\\vec v\\cdot\\vec u}{\\|\\vec u\\|^2}\\vec u=\\dfrac{9}{18}(3,0,3)=\\left(\\dfrac32,0,\\dfrac32\\right)$.</div><div class=\"ml-vi\">$\\operatorname{proj}_{\\vec u}\\vec v=\\dfrac{\\vec v\\cdot\\vec u}{\\|\\vec u\\|^2}\\vec u=\\dfrac{9}{18}(3,0,3)=\\left(\\dfrac32,0,\\dfrac32\\right)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The angle between vectors $u=[-1;\\ 1;\\ 2]^{T}$ and $v=[2;\\ 1;\\ -1]^{T}$ is ______<br>(i) $\\dfrac{\\pi}{3}$ (ii) $\\dfrac{4\\pi}{3}$ (iii) $\\dfrac{\\pi}{6}$ (iv) $\\dfrac{2\\pi}{3}$|||Góc giữa hai vectơ $u=[-1;\\ 1;\\ 2]^{T}$ và $v=[2;\\ 1;\\ -1]^{T}$ là ______<br>(i) $\\dfrac{\\pi}{3}$ (ii) $\\dfrac{4\\pi}{3}$ (iii) $\\dfrac{\\pi}{6}$ (iv) $\\dfrac{2\\pi}{3}$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            },
            {
              "text": "None of other choices is correct|||Không phương án nào đúng"
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
          "explanation": "<div class=\"ml-en\">$u\\cdot v=-2+1-2=-3$ and $\\|u\\|=\\|v\\|=\\sqrt6$, so $\\cos\\theta=\\dfrac{-3}{6}=-\\dfrac12\\Rightarrow\\theta=\\dfrac{2\\pi}{3}$ — (iv).</div><div class=\"ml-vi\">$u\\cdot v=-2+1-2=-3$ và $\\|u\\|=\\|v\\|=\\sqrt6$, nên $\\cos\\theta=\\dfrac{-3}{6}=-\\dfrac12\\Rightarrow\\theta=\\dfrac{2\\pi}{3}$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be projection on the line $y=3x$ followed by projection on the line $y=-x$. Find the $(2,1)$-entry of the matrix of $T$.|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép chiếu lên đường thẳng $y=3x$ rồi chiếu lên đường thẳng $y=-x$. Tìm phần tử $(2,1)$ của ma trận của $T$.",
          "options": [
            {
              "text": "-1/10|||-1/10"
            },
            {
              "text": "3/10|||3/10"
            },
            {
              "text": "1/10|||1/10"
            },
            {
              "text": "-3/10|||-3/10"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Projection onto $y=3x$: $P_1=\\dfrac{1}{10}\\begin{bmatrix}1&3\\\\3&9\\end{bmatrix}$; onto $y=-x$: $P_2=\\dfrac12\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}$. Then $T=P_2P_1=\\dfrac{1}{20}\\begin{bmatrix}-2&-6\\\\2&6\\end{bmatrix}$, whose $(2,1)$-entry is $\\dfrac{2}{20}=\\dfrac{1}{10}$.</div><div class=\"ml-vi\">Phép chiếu lên $y=3x$: $P_1=\\dfrac{1}{10}\\begin{bmatrix}1&3\\\\3&9\\end{bmatrix}$; lên $y=-x$: $P_2=\\dfrac12\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}$. Khi đó $T=P_2P_1=\\dfrac{1}{20}\\begin{bmatrix}-2&-6\\\\2&6\\end{bmatrix}$, phần tử $(2,1)$ bằng $\\dfrac{2}{20}=\\dfrac{1}{10}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{(x,y,z)\\mid 2x-y+z=0\\}$ be a subspace of $\\mathbb{R}^3$. Which of the following statements are true?<br>(i) $U=\\operatorname{span}\\{(1,0,-2),(0,1,1)\\}$ (ii) $U=\\operatorname{span}\\{(1,2,0)\\}$|||Cho $U=\\{(x,y,z)\\mid 2x-y+z=0\\}$ là không gian con của $\\mathbb{R}^3$. Phát biểu nào đúng?<br>(i) $U=\\operatorname{span}\\{(1,0,-2),(0,1,1)\\}$ (ii) $U=\\operatorname{span}\\{(1,2,0)\\}$",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$U$ is a plane through the origin, so $\\dim U=2$. Both $(1,0,-2)$ and $(0,1,1)$ satisfy the equation and are independent, so (i) is exactly $U$. In (ii) the single vector $(1,2,0)$ lies in $U$ but spans only a line — too small.</div><div class=\"ml-vi\">$U$ là mặt phẳng qua gốc nên $\\dim U=2$. Cả $(1,0,-2)$ và $(0,1,1)$ đều thoả phương trình và độc lập nên (i) đúng bằng $U$. Ở (ii), vectơ $(1,2,0)$ thuộc $U$ nhưng chỉ sinh ra một đường thẳng — quá nhỏ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are subspaces?<br>(i) $\\{[5a,\\ a,\\ -a]\\mid a\\in\\mathbb{R}\\}$ (ii) $\\{[a+b-3,\\ a,\\ b]\\mid a,b\\in\\mathbb{R}\\}$|||Tập nào sau đây là không gian con?<br>(i) $\\{[5a,\\ a,\\ -a]\\mid a\\in\\mathbb{R}\\}$ (ii) $\\{[a+b-3,\\ a,\\ b]\\mid a,b\\in\\mathbb{R}\\}$",
          "options": [
            {
              "text": "(i) and (ii)|||(i) và (ii)"
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
            3
          ],
          "explanation": "<div class=\"ml-en\">(i) is $\\operatorname{span}\\{(5,1,-1)\\}$ — a subspace. (ii) fails: taking $a=b=0$ gives $(-3,0,0)$, and no choice of $a,b$ gives the zero vector (it would need $a=b=0$ and $a+b=3$).</div><div class=\"ml-vi\">(i) chính là $\\operatorname{span}\\{(5,1,-1)\\}$ — là không gian con. (ii) không phải: với $a=b=0$ ta được $(-3,0,0)$, và không có $a,b$ nào cho vectơ không (phải có $a=b=0$ đồng thời $a+b=3$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all numbers $a$ such that the set of vectors $\\{(1,-1,0),(2,0,1),(0,1,a)\\}$ is dependent.|||Tìm tất cả các số $a$ để hệ vectơ $\\{(1,-1,0),(2,0,1),(0,1,a)\\}$ phụ thuộc tuyến tính.",
          "options": [
            {
              "text": "1/3|||1/3"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "All numbers but 1/2|||Mọi số trừ 1/2"
            },
            {
              "text": "All numbers but 1/3|||Mọi số trừ 1/3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Dependence for three vectors in $\\mathbb{R}^3$ means zero determinant: $\\det\\begin{bmatrix}1&-1&0\\\\2&0&1\\\\0&1&a\\end{bmatrix}=-1+2a=0\\Rightarrow a=\\dfrac12$.</div><div class=\"ml-vi\">Ba vectơ trong $\\mathbb{R}^3$ phụ thuộc khi định thức bằng 0: $\\det\\begin{bmatrix}1&-1&0\\\\2&0&1\\\\0&1&a\\end{bmatrix}=-1+2a=0\\Rightarrow a=\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following sets are bases for $\\mathbb{R}^3$?<br>(i) $\\{(1,1,1),(1,8,9),(0,3,4)\\}$ (ii) $\\{(0,3,1),(1,-8,9),(0,3,4),(2,3,5)\\}$|||Tập nào sau đây là cơ sở của $\\mathbb{R}^3$?<br>(i) $\\{(1,1,1),(1,8,9),(0,3,4)\\}$ (ii) $\\{(0,3,1),(1,-8,9),(0,3,4),(2,3,5)\\}$",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of (i) or (ii)|||Không tập nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i) The determinant of the three vectors is $4\\neq0$, so they are independent and form a basis. (ii) contains 4 vectors in $\\mathbb{R}^3$ — always dependent, so it is not a basis.</div><div class=\"ml-vi\">(i) Định thức của ba vectơ bằng $4\\neq0$ nên chúng độc lập và tạo thành cơ sở. (ii) gồm 4 vectơ trong $\\mathbb{R}^3$ — luôn phụ thuộc nên không phải cơ sở.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $t$ so that $\\{[1/2,\\ -t],\\ [1/t,\\ 2]\\}$ is an orthogonal set.|||Tìm $t$ để $\\{[1/2,\\ -t],\\ [1/t,\\ 2]\\}$ là một hệ trực giao.",
          "options": [
            {
              "text": "1/4 and -1/4|||1/4 và -1/4"
            },
            {
              "text": "1/2 and -1/2|||1/2 và -1/2"
            },
            {
              "text": "1 and -1|||1 và -1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Orthogonality means the dot product vanishes: $\\dfrac12\\cdot\\dfrac1t+(-t)(2)=0\\Rightarrow\\dfrac{1}{2t}=2t\\Rightarrow4t^2=1\\Rightarrow t=\\pm\\dfrac12$.</div><div class=\"ml-vi\">Trực giao nghĩa là tích vô hướng bằng 0: $\\dfrac12\\cdot\\dfrac1t+(-t)(2)=0\\Rightarrow\\dfrac{1}{2t}=2t\\Rightarrow4t^2=1\\Rightarrow t=\\pm\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $4\\times3$ matrix and $B$ a $3\\times4$ matrix. Assume that $\\operatorname{rank}(AB)=3$. Find $\\dim(\\operatorname{Null}(AB))$.|||Cho $A$ là ma trận $4\\times3$ và $B$ là ma trận $3\\times4$. Giả sử $\\operatorname{rank}(AB)=3$. Tìm $\\dim(\\operatorname{Null}(AB))$.",
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
          "explanation": "<div class=\"ml-en\">$AB$ is $4\\times4$, so by the rank–nullity theorem $\\dim\\operatorname{Null}(AB)=4-\\operatorname{rank}(AB)=4-3=1$.</div><div class=\"ml-vi\">$AB$ cỡ $4\\times4$ nên theo định lý hạng–số khuyết, $\\dim\\operatorname{Null}(AB)=4-\\operatorname{rank}(AB)=4-3=1$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D5",
      "source": "REAL",
      "sortOrder": 4,
      "title": "Đề 5 — SP26 Final Exam|||Đề 5 — Thi cuối kỳ SP26",
      "description": "MAE101 real FE multiple-choice paper (Spring 2026), transcribed from the exam images; answers reasoned here. (50 questions)|||Đề trắc nghiệm FE thật môn MAE101 (kỳ Xuân 2026), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (50 câu)",
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
          "prompt": "Find the domain of the function $f(x)=\\ln(3x+6)$.<br>(i) $[-2,\\infty)$ (ii) $[-6,\\infty)$ (iii) $(-2,\\infty)$ (iv) $(6,\\infty)$ (v) $(-\\infty,\\infty)$|||Tìm tập xác định của hàm $f(x)=\\ln(3x+6)$.<br>(i) $[-2,\\infty)$ (ii) $[-6,\\infty)$ (iii) $(-2,\\infty)$ (iv) $(6,\\infty)$ (v) $(-\\infty,\\infty)$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\ln$ requires a strictly positive argument: $3x+6\\gt0\\Rightarrow x\\gt-2$, i.e. $(-2,\\infty)$ — (iii). (The endpoint $-2$ is excluded because $\\ln0$ is undefined.)</div><div class=\"ml-vi\">Hàm $\\ln$ đòi hỏi biểu thức bên trong dương thực sự: $3x+6\\gt0\\Rightarrow x\\gt-2$, tức $(-2,\\infty)$ — (iii). (Loại điểm $-2$ vì $\\ln0$ không xác định.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the equation of the line that passes through the points $(7,4)$ and $(-9,4)$.|||Tìm phương trình đường thẳng đi qua hai điểm $(7,4)$ và $(-9,4)$.",
          "options": [
            {
              "text": "$y=4$|||$y=4$"
            },
            {
              "text": "$y=4x+7$|||$y=4x+7$"
            },
            {
              "text": "$9y=7x+4$|||$9y=7x+4$"
            },
            {
              "text": "$y=-4$|||$y=-4$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both points have the same $y$-coordinate, so the line is horizontal: $y=4$ (slope $0$).</div><div class=\"ml-vi\">Hai điểm có cùng tung độ nên đường thẳng nằm ngang: $y=4$ (hệ số góc bằng $0$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to\\pi}\\left[5\\cos(2x)+16\\tan(x)\\right]$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to\\pi}\\left[5\\cos(2x)+16\\tan(x)\\right]$",
          "options": [
            {
              "text": "-3|||-3"
            },
            {
              "text": "-5|||-5"
            },
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Both functions are continuous at $x=\\pi$: $5\\cos2\\pi+16\\tan\\pi=5(1)+16(0)=5$.</div><div class=\"ml-vi\">Cả hai hàm đều liên tục tại $x=\\pi$: $5\\cos2\\pi+16\\tan\\pi=5(1)+16(0)=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine where $f$ is discontinuous. $f(x)=\\begin{cases}\\sqrt{-x} & \\text{if } x\\lt0\\\\ 3-x & \\text{if } 0\\leq x\\lt3\\\\ (3-x)^2 & \\text{if } x\\gt3\\end{cases}$|||Xác định các điểm mà $f$ gián đoạn. $f(x)=\\begin{cases}\\sqrt{-x} & \\text{nếu } x\\lt0\\\\ 3-x & \\text{nếu } 0\\leq x\\lt3\\\\ (3-x)^2 & \\text{nếu } x\\gt3\\end{cases}$",
          "options": [
            {
              "text": "0 and -3|||0 và -3"
            },
            {
              "text": "0 only|||Chỉ 0"
            },
            {
              "text": "-3 only|||Chỉ -3"
            },
            {
              "text": "0 and 3|||0 và 3"
            },
            {
              "text": "3 only|||Chỉ 3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">At $x=0$: the left limit is $\\sqrt{0}=0$ but $f(0)=3$ — a jump. At $x=3$: both one-sided limits are $0$, yet $f(3)$ is not defined by any branch — a removable discontinuity. So $f$ is discontinuous at $0$ and $3$.</div><div class=\"ml-vi\">Tại $x=0$: giới hạn trái là $\\sqrt{0}=0$ nhưng $f(0)=3$ — bước nhảy. Tại $x=3$: cả hai giới hạn một phía đều bằng $0$, nhưng $f(3)$ không được định nghĩa ở nhánh nào — gián đoạn khử được. Vậy $f$ gián đoạn tại $0$ và $3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Simplify the quotient $\\dfrac{f(x+h)-f(x)}{h}$ for $f(x)=-x^2+3x$.|||Rút gọn $\\dfrac{f(x+h)-f(x)}{h}$ với $f(x)=-x^2+3x$.",
          "options": [
            {
              "text": "$-2x-h+3$|||$-2x-h+3$"
            },
            {
              "text": "$-2x+h-3$|||$-2x+h-3$"
            },
            {
              "text": "$2x-h-3$|||$2x-h-3$"
            },
            {
              "text": "$2x-h+3$|||$2x-h+3$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x+h)-f(x)=-(2xh+h^2)+3h$, so dividing by $h$ gives $-2x-h+3$.</div><div class=\"ml-vi\">$f(x+h)-f(x)=-(2xh+h^2)+3h$, chia cho $h$ được $-2x-h+3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $y'(1)$ for $y=\\dfrac{5x+7}{9x-2}$.|||Tìm $y'(1)$ với $y=\\dfrac{5x+7}{9x-2}$.",
          "options": [
            {
              "text": "73/49|||73/49"
            },
            {
              "text": "73/7|||73/7"
            },
            {
              "text": "-73/7|||-73/7"
            },
            {
              "text": "-73/49|||-73/49"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Quotient rule: $y'=\\dfrac{5(9x-2)-9(5x+7)}{(9x-2)^2}=\\dfrac{-73}{(9x-2)^2}$. At $x=1$ the denominator is $49$, so $y'(1)=-\\dfrac{73}{49}$.</div><div class=\"ml-vi\">Quy tắc thương: $y'=\\dfrac{5(9x-2)-9(5x+7)}{(9x-2)^2}=\\dfrac{-73}{(9x-2)^2}$. Tại $x=1$ mẫu bằng $49$, nên $y'(1)=-\\dfrac{73}{49}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ball dropped from the top of a building has a height of $s=576-16t^2$ meters after $t$ seconds. How long does it take the ball to reach the ground? What is the ball's velocity at the moment of impact?|||Một quả bóng thả rơi từ nóc toà nhà có độ cao $s=576-16t^2$ mét sau $t$ giây. Quả bóng mất bao lâu để chạm đất? Vận tốc lúc chạm đất là bao nhiêu?",
          "options": [
            {
              "text": "6 sec, -192 m/sec|||6 giây, -192 m/s"
            },
            {
              "text": "6 sec, 192 m/sec|||6 giây, 192 m/s"
            },
            {
              "text": "36 sec, -1152 m/sec|||36 giây, -1152 m/s"
            },
            {
              "text": "12 sec, -96 m/sec|||12 giây, -96 m/s"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Ground: $576-16t^2=0\\Rightarrow t^2=36\\Rightarrow t=6$ s. Velocity $v(t)=s'(t)=-32t$, so $v(6)=-192$ m/s (negative because the ball moves downward).</div><div class=\"ml-vi\">Chạm đất: $576-16t^2=0\\Rightarrow t^2=36\\Rightarrow t=6$ giây. Vận tốc $v(t)=s'(t)=-32t$, nên $v(6)=-192$ m/s (âm vì bóng đi xuống).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\dfrac{d^2y}{dx^2}$ at $x=2$ for $y=\\dfrac{1}{x^2-1}$.|||Tính $\\dfrac{d^2y}{dx^2}$ tại $x=2$ với $y=\\dfrac{1}{x^2-1}$.",
          "options": [
            {
              "text": "25/3|||25/3"
            },
            {
              "text": "26/3|||26/3"
            },
            {
              "text": "25/27|||25/27"
            },
            {
              "text": "26/27|||26/27"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$y'=-2x(x^2-1)^{-2}$ and $y''=-2(x^2-1)^{-2}+8x^2(x^2-1)^{-3}$. At $x=2$ ($x^2-1=3$): $-\\dfrac{2}{9}+\\dfrac{32}{27}=\\dfrac{-6+32}{27}=\\dfrac{26}{27}$.</div><div class=\"ml-vi\">$y'=-2x(x^2-1)^{-2}$ và $y''=-2(x^2-1)^{-2}+8x^2(x^2-1)^{-3}$. Tại $x=2$ ($x^2-1=3$): $-\\dfrac{2}{9}+\\dfrac{32}{27}=\\dfrac{-6+32}{27}=\\dfrac{26}{27}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Differentiate implicitly to find the slope of the curve at the point $(2,1)$: $x^4y^4=16$.|||Đạo hàm hàm ẩn để tìm hệ số góc của đường cong tại điểm $(2,1)$: $x^4y^4=16$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "-1/2|||-1/2"
            },
            {
              "text": "3/2|||3/2"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$4x^3y^4+4x^4y^3y'=0\\Rightarrow y'=-\\dfrac{y}{x}$. At $(2,1)$: $y'=-\\dfrac12$.</div><div class=\"ml-vi\">$4x^3y^4+4x^4y^3y'=0\\Rightarrow y'=-\\dfrac{y}{x}$. Tại $(2,1)$: $y'=-\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $4y^2+9z^2=36$, and $dz/dt=4$, find $dy/dt$ when $z=\\sqrt2$.<br>(i) $\\pm3/\\sqrt2$ (ii) $\\pm2/\\sqrt3$ (iii) $\\pm2$ (iv) $\\pm6$|||Nếu $4y^2+9z^2=36$ và $dz/dt=4$, tìm $dy/dt$ khi $z=\\sqrt2$.<br>(i) $\\pm3/\\sqrt2$ (ii) $\\pm2/\\sqrt3$ (iii) $\\pm2$ (iv) $\\pm6$",
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
          "explanation": "<div class=\"ml-en\">At $z=\\sqrt2$: $4y^2=36-18=18\\Rightarrow y=\\pm\\dfrac{3}{\\sqrt2}$. Differentiating, $8y\\dfrac{dy}{dt}+18z\\dfrac{dz}{dt}=0\\Rightarrow\\dfrac{dy}{dt}=-\\dfrac{18\\sqrt2\\cdot4}{8y}=\\mp6$ — magnitude $\\pm6$, i.e. (iv).</div><div class=\"ml-vi\">Tại $z=\\sqrt2$: $4y^2=36-18=18\\Rightarrow y=\\pm\\dfrac{3}{\\sqrt2}$. Đạo hàm: $8y\\dfrac{dy}{dt}+18z\\dfrac{dz}{dt}=0\\Rightarrow\\dfrac{dy}{dt}=-\\dfrac{18\\sqrt2\\cdot4}{8y}=\\mp6$ — độ lớn $\\pm6$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the <b>total</b> area between the function $f(x)=\\sin x$ and the x-axis over the interval $\\left[\\dfrac{\\pi}{2},\\dfrac{4\\pi}{3}\\right]$.|||Tìm <b>tổng</b> diện tích giữa hàm $f(x)=\\sin x$ và trục hoành trên đoạn $\\left[\\dfrac{\\pi}{2},\\dfrac{4\\pi}{3}\\right]$.",
          "options": [
            {
              "text": "0.5|||0.5"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "1.5|||1.5"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Split at $x=\\pi$ where $\\sin x$ changes sign. $\\displaystyle\\int_{\\pi/2}^{\\pi}\\sin x\\,dx=1$ and $\\left|\\displaystyle\\int_{\\pi}^{4\\pi/3}\\sin x\\,dx\\right|=\\left|-\\cos\\dfrac{4\\pi}{3}+\\cos\\pi\\right|=0.5$. Total area $=1+0.5=1.5$.</div><div class=\"ml-vi\">Chia tại $x=\\pi$ nơi $\\sin x$ đổi dấu. $\\displaystyle\\int_{\\pi/2}^{\\pi}\\sin x\\,dx=1$ và $\\left|\\displaystyle\\int_{\\pi}^{4\\pi/3}\\sin x\\,dx\\right|=\\left|-\\cos\\dfrac{4\\pi}{3}+\\cos\\pi\\right|=0.5$. Tổng diện tích $=1+0.5=1.5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute minimum and absolute maximum values of $f(x)=x^3-3x^2+1$ on $[-1,3]$.|||Tìm giá trị nhỏ nhất và lớn nhất tuyệt đối của $f(x)=x^3-3x^2+1$ trên $[-1,3]$.",
          "options": [
            {
              "text": "No absolute maximum, absolute minimum: -3|||Không có GTLN, GTNN: -3"
            },
            {
              "text": "Absolute maximum: 3, absolute minimum: -1|||GTLN: 3, GTNN: -1"
            },
            {
              "text": "Absolute maximum: 3, no absolute minimum|||GTLN: 3, không có GTNN"
            },
            {
              "text": "Absolute maximum: 1, absolute minimum: -3|||GTLN: 1, GTNN: -3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=3x^2-6x=3x(x-2)$, critical points $x=0,2$. Values: $f(-1)=-3$, $f(0)=1$, $f(2)=-3$, $f(3)=1$. So the maximum is $1$ and the minimum is $-3$.</div><div class=\"ml-vi\">$f'(x)=3x^2-6x=3x(x-2)$, điểm tới hạn $x=0,2$. Giá trị: $f(-1)=-3$, $f(0)=1$, $f(2)=-3$, $f(3)=1$. Vậy GTLN là $1$ và GTNN là $-3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the intervals on which the function is increasing: $f(x)=2x^3-3x^2-12x$.|||Tìm các khoảng mà hàm số đồng biến: $f(x)=2x^3-3x^2-12x$.",
          "options": [
            {
              "text": "$x\\lt-1$|||$x\\lt-1$"
            },
            {
              "text": "$x\\gt2$|||$x\\gt2$"
            },
            {
              "text": "$-1\\lt x\\lt2$|||$-1\\lt x\\lt2$"
            },
            {
              "text": "$x\\lt-1$ or $x\\gt2$|||$x\\lt-1$ hoặc $x\\gt2$"
            },
            {
              "text": "None of these|||Không phương án nào"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=6x^2-6x-12=6(x-2)(x+1)\\gt0$ exactly when $x\\lt-1$ or $x\\gt2$.</div><div class=\"ml-vi\">$f'(x)=6x^2-6x-12=6(x-2)(x+1)\\gt0$ đúng khi $x\\lt-1$ hoặc $x\\gt2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{\\sqrt{4x^2+1}}{3x-5}$.|||Tính giới hạn $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{\\sqrt{4x^2+1}}{3x-5}$.",
          "options": [
            {
              "text": "-4/3|||-4/3"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
            },
            {
              "text": "4/3|||4/3"
            },
            {
              "text": "-2/3|||-2/3"
            },
            {
              "text": "2/3|||2/3"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Divide numerator and denominator by $x\\gt0$: $\\dfrac{\\sqrt{4+1/x^2}}{3-5/x}\\to\\dfrac{2}{3}$.</div><div class=\"ml-vi\">Chia tử và mẫu cho $x\\gt0$: $\\dfrac{\\sqrt{4+1/x^2}}{3-5/x}\\to\\dfrac{2}{3}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A box with a square base and open top must have 8 volume units. Find the <b>length of one side of the base</b> that minimizes the surface area.<br>(i) $4$ (ii) $2$ (iii) $2\\sqrt[3]{2}$ (iv) $2\\sqrt[3]{4}$|||Một hộp đáy vuông không nắp có thể tích 8 đơn vị. Tìm <b>độ dài cạnh đáy</b> để diện tích bề mặt nhỏ nhất.<br>(i) $4$ (ii) $2$ (iii) $2\\sqrt[3]{2}$ (iv) $2\\sqrt[3]{4}$",
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
          "explanation": "<div class=\"ml-en\">With base $x$ and height $h=\\dfrac{8}{x^2}$, the surface area is $S=x^2+4xh=x^2+\\dfrac{32}{x}$. Then $S'=2x-\\dfrac{32}{x^2}=0\\Rightarrow x^3=16\\Rightarrow x=\\sqrt[3]{16}=2\\sqrt[3]{2}$ — (iii).</div><div class=\"ml-vi\">Với cạnh đáy $x$ và chiều cao $h=\\dfrac{8}{x^2}$, diện tích bề mặt là $S=x^2+4xh=x^2+\\dfrac{32}{x}$. Khi đó $S'=2x-\\dfrac{32}{x^2}=0\\Rightarrow x^3=16\\Rightarrow x=\\sqrt[3]{16}=2\\sqrt[3]{2}$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the specified initial approximation $x_1=2$ to find $x_3$ of the following equation $\\ln(x^2+4)-2x=0$.|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1=2$ để tìm $x_3$ của phương trình $\\ln(x^2+4)-2x=0$.",
          "options": [
            {
              "text": "0.76054|||0.76054"
            },
            {
              "text": "0.71963|||0.71963"
            },
            {
              "text": "0.76070|||0.76070"
            },
            {
              "text": "0.71696|||0.71696"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=\\ln(x^2+4)-2x$, $f'(x)=\\dfrac{2x}{x^2+4}-2$. $f(2)=\\ln8-4=-1.92056$, $f'(2)=-1.5\\Rightarrow x_2=0.71963$. Then $f(x_2)=0.06878$, $f'(x_2)=-1.68143\\Rightarrow x_3\\approx0.76054$.</div><div class=\"ml-vi\">$f(x)=\\ln(x^2+4)-2x$, $f'(x)=\\dfrac{2x}{x^2+4}-2$. $f(2)=\\ln8-4=-1.92056$, $f'(2)=-1.5\\Rightarrow x_2=0.71963$. Tiếp: $f(x_2)=0.06878$, $f'(x_2)=-1.68143\\Rightarrow x_3\\approx0.76054$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use left-endpoint approximation to approximate the area under the curve of $f(x)=2^{x}$ on the interval $[0,2]$ with $n=4$.|||Dùng xấp xỉ điểm mút trái để ước lượng diện tích dưới đường cong $f(x)=2^{x}$ trên đoạn $[0,2]$ với $n=4$.",
          "options": [
            {
              "text": "10.24|||10.24"
            },
            {
              "text": "3.62|||3.62"
            },
            {
              "text": "5.12|||5.12"
            },
            {
              "text": "7.24|||7.24"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=0.5$ and the left endpoints are $0,\\,0.5,\\,1,\\,1.5$: $0.5\\left(1+\\sqrt2+2+2\\sqrt2\\right)=0.5(7.2426)\\approx3.62$.</div><div class=\"ml-vi\">$\\Delta x=0.5$ và các điểm mút trái là $0,\\,0.5,\\,1,\\,1.5$: $0.5\\left(1+\\sqrt2+2+2\\sqrt2\\right)=0.5(7.2426)\\approx3.62$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that $\\displaystyle\\int_4^6 f(x)\\,dx=\\dfrac{6}{57}$, find $\\displaystyle\\int_6^4 f(x)\\,dx$.|||Biết $\\displaystyle\\int_4^6 f(x)\\,dx=\\dfrac{6}{57}$, tìm $\\displaystyle\\int_6^4 f(x)\\,dx$.",
          "options": [
            {
              "text": "-6/57|||-6/57"
            },
            {
              "text": "6/57|||6/57"
            },
            {
              "text": "57/6|||57/6"
            },
            {
              "text": "-57/6|||-57/6"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Swapping the limits changes the sign: $\\displaystyle\\int_6^4 f=-\\displaystyle\\int_4^6 f=-\\dfrac{6}{57}$.</div><div class=\"ml-vi\">Đổi cận thì đổi dấu: $\\displaystyle\\int_6^4 f=-\\displaystyle\\int_4^6 f=-\\dfrac{6}{57}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the derivative of the following function $g(x)=\\displaystyle\\int_0^{\\sin x}\\dfrac{t^5+4t}{e^{5t}}\\,dt$.<br>(i) $\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}$ (ii) $\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cdot\\sin x$ (iii) $\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cdot\\cos x$ (iv) $-\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cdot\\cos x$|||Tìm đạo hàm của hàm $g(x)=\\displaystyle\\int_0^{\\sin x}\\dfrac{t^5+4t}{e^{5t}}\\,dt$.<br>(i) $\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}$ (ii) $\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cdot\\sin x$ (iii) $\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cdot\\cos x$ (iv) $-\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cdot\\cos x$",
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
          "explanation": "<div class=\"ml-en\">By the Fundamental Theorem plus the chain rule: $g'(x)=f(\\sin x)\\cdot(\\sin x)'=\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cos x$ — (iii).</div><div class=\"ml-vi\">Theo định lý cơ bản kết hợp quy tắc dây chuyền: $g'(x)=f(\\sin x)\\cdot(\\sin x)'=\\dfrac{\\sin^5x+4\\sin x}{e^{5\\sin x}}\\cos x$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the average value of $f(x)=x^2-1$ on the interval $[0,3]$.|||Tìm giá trị trung bình của $f(x)=x^2-1$ trên đoạn $[0,3]$.",
          "options": [
            {
              "text": "6|||6"
            },
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
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f_{avg}=\\dfrac{1}{3}\\displaystyle\\int_0^3(x^2-1)dx=\\dfrac13\\left[\\dfrac{x^3}{3}-x\\right]_0^3=\\dfrac13(9-3)=2$.</div><div class=\"ml-vi\">$f_{tb}=\\dfrac{1}{3}\\displaystyle\\int_0^3(x^2-1)dx=\\dfrac13\\left[\\dfrac{x^3}{3}-x\\right]_0^3=\\dfrac13(9-3)=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int\\dfrac{8\\,dy}{(y-9)^3}$.<br>(i) $-\\dfrac{4}{(y-9)^2}+C$ (ii) $\\dfrac{4}{(y-9)^2}+C$ (iii) $-\\dfrac{4}{y-9}+C$ (iv) $-\\dfrac{1}{4(y-9)^2}+C$|||Tính $\\displaystyle\\int\\dfrac{8\\,dy}{(y-9)^3}$.<br>(i) $-\\dfrac{4}{(y-9)^2}+C$ (ii) $\\dfrac{4}{(y-9)^2}+C$ (iii) $-\\dfrac{4}{y-9}+C$ (iv) $-\\dfrac{1}{4(y-9)^2}+C$",
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
          "explanation": "<div class=\"ml-en\">$\\displaystyle\\int8(y-9)^{-3}dy=8\\cdot\\dfrac{(y-9)^{-2}}{-2}+C=-\\dfrac{4}{(y-9)^2}+C$ — (i).</div><div class=\"ml-vi\">$\\displaystyle\\int8(y-9)^{-3}dy=8\\cdot\\dfrac{(y-9)^{-2}}{-2}+C=-\\dfrac{4}{(y-9)^2}+C$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the integral $\\displaystyle\\int4x^2e^{-2x}\\,dx$.<br>(i) $e^{-2x}(2x^2+2x-1)+C$ (ii) $e^{-2x}(2x^2+2x+1)+C$ (iii) $e^{-2x}(2x^2-2x+1)+C$ (iv) $-e^{-2x}(2x^2+2x+1)+C$|||Tính tích phân $\\displaystyle\\int4x^2e^{-2x}\\,dx$.<br>(i) $e^{-2x}(2x^2+2x-1)+C$ (ii) $e^{-2x}(2x^2+2x+1)+C$ (iii) $e^{-2x}(2x^2-2x+1)+C$ (iv) $-e^{-2x}(2x^2+2x+1)+C$",
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
          "explanation": "<div class=\"ml-en\">Two integrations by parts give $\\displaystyle\\int x^2e^{-2x}dx=e^{-2x}\\!\\left(-\\dfrac{x^2}{2}-\\dfrac{x}{2}-\\dfrac14\\right)+C$; multiplying by 4: $-e^{-2x}(2x^2+2x+1)+C$ — (iv). (Check by differentiating.)</div><div class=\"ml-vi\">Tích phân từng phần hai lần cho $\\displaystyle\\int x^2e^{-2x}dx=e^{-2x}\\!\\left(-\\dfrac{x^2}{2}-\\dfrac{x}{2}-\\dfrac14\\right)+C$; nhân 4: $-e^{-2x}(2x^2+2x+1)+C$ — (iv). (Kiểm tra bằng cách đạo hàm.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When using Simpson's rule to approximate a definite integral, it is necessary for the number of subintervals to be ______|||Khi dùng quy tắc Simpson để xấp xỉ tích phân xác định, số khoảng chia bắt buộc phải là ______",
          "options": [
            {
              "text": "an odd number.|||số lẻ."
            },
            {
              "text": "an even number.|||số chẵn."
            },
            {
              "text": "a multiple of 3.|||bội của 3."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Simpson's rule pairs consecutive subintervals into parabolic arcs, so $n$ must be even.</div><div class=\"ml-vi\">Quy tắc Simpson ghép từng cặp khoảng liên tiếp thành cung parabol, nên $n$ phải chẵn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following integrals is divergent?<br>(i) $\\displaystyle\\int_1^{\\infty}\\dfrac{2010}{5x^2}\\,dx$ (ii) $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{\\sqrt{x^3}}\\,dx$ (iii) $\\displaystyle\\int_1^{\\infty}\\dfrac{1+xe^{-2x}}{x}\\,dx$|||Tích phân nào sau đây phân kỳ?<br>(i) $\\displaystyle\\int_1^{\\infty}\\dfrac{2010}{5x^2}\\,dx$ (ii) $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{\\sqrt{x^3}}\\,dx$ (iii) $\\displaystyle\\int_1^{\\infty}\\dfrac{1+xe^{-2x}}{x}\\,dx$",
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
          "explanation": "<div class=\"ml-en\">(i) and (ii) are $p$-integrals with $p=2$ and $p=\\dfrac32$, both $\\gt1$, hence convergent. (iii) splits as $\\displaystyle\\int_1^\\infty\\dfrac{dx}{x}+\\displaystyle\\int_1^\\infty e^{-2x}dx$; the first piece is the harmonic ($p=1$) integral, which diverges.</div><div class=\"ml-vi\">(i) và (ii) là tích phân dạng $p$ với $p=2$ và $p=\\dfrac32$, đều $\\gt1$ nên hội tụ. (iii) tách thành $\\displaystyle\\int_1^\\infty\\dfrac{dx}{x}+\\displaystyle\\int_1^\\infty e^{-2x}dx$; phần đầu là tích phân điều hoà ($p=1$) nên phân kỳ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following matrices has reduced row-echelon form?<br>(i) $\\begin{bmatrix}1&3&-1&2\\\\0&1&2/7&-6/7\\\\0&0&1&25\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&0&0&3\\\\0&1&0&-8\\\\0&0&1&25\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&0&-1&-22\\\\0&1&0&-8\\\\0&0&1&25\\end{bmatrix}$ (iv) $\\begin{bmatrix}1&3&-1&2\\\\0&1&0&-8\\\\0&0&1&25\\end{bmatrix}$|||Ma trận nào sau đây ở dạng bậc thang rút gọn theo hàng?<br>(i) $\\begin{bmatrix}1&3&-1&2\\\\0&1&2/7&-6/7\\\\0&0&1&25\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&0&0&3\\\\0&1&0&-8\\\\0&0&1&25\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&0&-1&-22\\\\0&1&0&-8\\\\0&0&1&25\\end{bmatrix}$ (iv) $\\begin{bmatrix}1&3&-1&2\\\\0&1&0&-8\\\\0&0&1&25\\end{bmatrix}$",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">In reduced form every pivot must be the only nonzero entry in its column. Only (ii) satisfies this; (i), (iii) and (iv) still have nonzero entries above a pivot.</div><div class=\"ml-vi\">Ở dạng rút gọn, mỗi phần tử trụ phải là phần tử khác 0 duy nhất trong cột của nó. Chỉ (ii) thoả; (i), (iii) và (iv) vẫn còn số khác 0 phía trên một trụ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $m$ so that the system $\\begin{cases}x-y-z=1\\\\x+y-z=2\\\\-x+3y+z=m\\end{cases}$ has no solution.|||Tìm tất cả giá trị $m$ để hệ $\\begin{cases}x-y-z=1\\\\x+y-z=2\\\\-x+3y+z=m\\end{cases}$ vô nghiệm.",
          "options": [
            {
              "text": "any number but 0|||mọi số trừ 0"
            },
            {
              "text": "any real number|||mọi số thực"
            },
            {
              "text": "any number but 1|||mọi số trừ 1"
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
            0
          ],
          "explanation": "<div class=\"ml-en\">Subtracting the first equation from the second gives $y=\\dfrac12$, hence $x-z=\\dfrac32$. The third equation reads $-(x-z)+3y=m$, i.e. $-\\dfrac32+\\dfrac32=m\\Rightarrow m=0$. So the system is consistent only for $m=0$ and has no solution for every other $m$.</div><div class=\"ml-vi\">Lấy phương trình thứ hai trừ phương trình đầu được $y=\\dfrac12$, suy ra $x-z=\\dfrac32$. Phương trình thứ ba là $-(x-z)+3y=m$, tức $-\\dfrac32+\\dfrac32=m\\Rightarrow m=0$. Vậy hệ chỉ tương thích khi $m=0$, và vô nghiệm với mọi $m$ khác.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve for $z$ in the system of equations $\\begin{cases}x+y-z=3\\\\x+2y-2z=4\\\\2x+y+2z=5\\end{cases}$|||Giải hệ phương trình tìm $z$: $\\begin{cases}x+y-z=3\\\\x+2y-2z=4\\\\2x+y+2z=5\\end{cases}$",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "$z$ is arbitrary|||$z$ tuỳ ý"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "-1|||-1"
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
          "explanation": "<div class=\"ml-en\">Equation 2 minus equation 1 gives $y-z=1$. Equation 3 minus twice equation 1 gives $-y+4z=-1$. Adding: $3z=0\\Rightarrow z=0$.</div><div class=\"ml-vi\">Phương trình 2 trừ phương trình 1 được $y-z=1$. Phương trình 3 trừ 2 lần phương trình 1 được $-y+4z=-1$. Cộng lại: $3z=0\\Rightarrow z=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x=[1,1,2]$, $y=[2,6,0]$, $z=[2,2,4]$ and $v=[-1,9,6]$. Write $v$ as a linear combination of $x$, $y$ and $z$.|||Cho $x=[1,1,2]$, $y=[2,6,0]$, $z=[2,2,4]$ và $v=[-1,9,6]$. Viết $v$ thành tổ hợp tuyến tính của $x$, $y$, $z$.",
          "options": [
            {
              "text": "$v=-2x+5y-2z$|||$v=-2x+5y-2z$"
            },
            {
              "text": "$v=x+2y+2z$|||$v=x+2y+2z$"
            },
            {
              "text": "There is no linear combination|||Không tồn tại tổ hợp tuyến tính"
            },
            {
              "text": "$v=-4x+5y-z$|||$v=-4x+5y-z$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Note $z=2x$, so $\\operatorname{span}\\{x,y,z\\}=\\operatorname{span}\\{x,y\\}$. Solving $ax+by=v$: the third coordinate gives $2a=6\\Rightarrow a=3$, the first gives $b=-2$, but then the second is $3+6(-2)=-9\\neq9$. No combination exists.</div><div class=\"ml-vi\">Chú ý $z=2x$ nên $\\operatorname{span}\\{x,y,z\\}=\\operatorname{span}\\{x,y\\}$. Giải $ax+by=v$: toạ độ thứ ba cho $2a=6\\Rightarrow a=3$, toạ độ đầu cho $b=-2$, nhưng khi đó toạ độ thứ hai là $3+6(-2)=-9\\neq9$. Vậy không tồn tại tổ hợp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve for $A$ if $3A-2A^{T}=\\begin{bmatrix}2&4\\\\-1&0\\end{bmatrix}$.<br>(i) $\\begin{bmatrix}2&0\\\\5&0\\end{bmatrix}$ (ii) $\\begin{bmatrix}2&2\\\\1&0\\end{bmatrix}$ (iii) $\\begin{bmatrix}5&0\\\\2&0\\end{bmatrix}$|||Tìm $A$ nếu $3A-2A^{T}=\\begin{bmatrix}2&4\\\\-1&0\\end{bmatrix}$.<br>(i) $\\begin{bmatrix}2&0\\\\5&0\\end{bmatrix}$ (ii) $\\begin{bmatrix}2&2\\\\1&0\\end{bmatrix}$ (iii) $\\begin{bmatrix}5&0\\\\2&0\\end{bmatrix}$",
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
          "explanation": "<div class=\"ml-en\">Write $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$; then $3A-2A^{T}=\\begin{bmatrix}a&3b-2c\\\\3c-2b&d\\end{bmatrix}$. Matching: $a=2$, $d=0$, $3b-2c=4$, $3c-2b=-1\\Rightarrow b=2,\\ c=1$ — (ii).</div><div class=\"ml-vi\">Viết $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$; khi đó $3A-2A^{T}=\\begin{bmatrix}a&3b-2c\\\\3c-2b&d\\end{bmatrix}$. Đồng nhất: $a=2$, $d=0$, $3b-2c=4$, $3c-2b=-1\\Rightarrow b=2,\\ c=1$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given a matrix $A$ and column vectors $x$, $b$. Which of the following statements are correct?<br>(i) If $Ax=0$ then either $A=0$ or $x=0$. (ii) If $x_1,x_2$ are solutions to $Ax=b$ then $A(x_1-x_2)=0$.|||Cho ma trận $A$ và các vectơ cột $x$, $b$. Phát biểu nào đúng?<br>(i) Nếu $Ax=0$ thì hoặc $A=0$ hoặc $x=0$. (ii) Nếu $x_1,x_2$ là nghiệm của $Ax=b$ thì $A(x_1-x_2)=0$.",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
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
          "explanation": "<div class=\"ml-en\">(i) is false — a singular $A\\neq0$ has nonzero null vectors, e.g. $A=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$, $x=(0,1)$. (ii) is true by linearity: $Ax_1-Ax_2=b-b=0$.</div><div class=\"ml-vi\">(i) sai — ma trận suy biến $A\\neq0$ vẫn có vectơ khác 0 trong hạt nhân, ví dụ $A=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$, $x=(0,1)$. (ii) đúng theo tính tuyến tính: $Ax_1-Ax_2=b-b=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$. Compute $A^{10}$.<br>(i) $\\begin{bmatrix}1&10\\\\0&1\\end{bmatrix}$ (ii) $\\begin{bmatrix}10&10\\\\0&10\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$|||Cho $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$. Tính $A^{10}$.<br>(i) $\\begin{bmatrix}1&10\\\\0&1\\end{bmatrix}$ (ii) $\\begin{bmatrix}10&10\\\\0&10\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$",
          "options": [
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
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
          "explanation": "<div class=\"ml-en\">By induction $A^{n}=\\begin{bmatrix}1&n\\\\0&1\\end{bmatrix}$ (a shear composes additively), so $A^{10}=\\begin{bmatrix}1&10\\\\0&1\\end{bmatrix}$ — (i).</div><div class=\"ml-vi\">Bằng quy nạp, $A^{n}=\\begin{bmatrix}1&n\\\\0&1\\end{bmatrix}$ (phép trượt cộng dồn), nên $A^{10}=\\begin{bmatrix}1&10\\\\0&1\\end{bmatrix}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\begin{cases}3x+4y=a\\\\4x+5y=b\\end{cases}$, find $x$, $y$ in terms of $a$ and $b$.<br>(i) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}5a-4b\\\\-4a+3b\\end{bmatrix}$ (ii) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}-5a+4b\\\\4a-3b\\end{bmatrix}$ (iii) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}4a-3b\\\\-5a+4b\\end{bmatrix}$ (iv) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}-4a-3b\\\\5a-4b\\end{bmatrix}$|||Cho $\\begin{cases}3x+4y=a\\\\4x+5y=b\\end{cases}$, tìm $x$, $y$ theo $a$ và $b$.<br>(i) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}5a-4b\\\\-4a+3b\\end{bmatrix}$ (ii) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}-5a+4b\\\\4a-3b\\end{bmatrix}$ (iii) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}4a-3b\\\\-5a+4b\\end{bmatrix}$ (iv) $\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}-4a-3b\\\\5a-4b\\end{bmatrix}$",
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
          "explanation": "<div class=\"ml-en\">The coefficient matrix has $\\det=15-16=-1$, so its inverse is $-\\begin{bmatrix}5&-4\\\\-4&3\\end{bmatrix}=\\begin{bmatrix}-5&4\\\\4&-3\\end{bmatrix}$, giving $x=-5a+4b$, $y=4a-3b$ — (ii).</div><div class=\"ml-vi\">Ma trận hệ số có $\\det=15-16=-1$ nên nghịch đảo là $-\\begin{bmatrix}5&-4\\\\-4&3\\end{bmatrix}=\\begin{bmatrix}-5&4\\\\4&-3\\end{bmatrix}$, cho $x=-5a+4b$, $y=4a-3b$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be a linear transformation that satisfies $T(1,1)=(2,3)$ and $T(2,1)=(4,3)$. Find $T(1,0)$.|||Cho phép biến đổi tuyến tính $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ thoả $T(1,1)=(2,3)$ và $T(2,1)=(4,3)$. Tìm $T(1,0)$.",
          "options": [
            {
              "text": "$(2,0)$|||$(2,0)$"
            },
            {
              "text": "$(1,1)$|||$(1,1)$"
            },
            {
              "text": "$(1,3)$|||$(1,3)$"
            },
            {
              "text": "$(2,2)$|||$(2,2)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(1,0)=(2,1)-(1,1)$, so by linearity $T(1,0)=(4,3)-(2,3)=(2,0)$.</div><div class=\"ml-vi\">$(1,0)=(2,1)-(1,1)$ nên theo tính tuyến tính $T(1,0)=(4,3)-(2,3)=(2,0)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be rotation through $\\pi/2$ followed by reflection in the line $y=x$. Then $T$ is:|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép quay góc $\\pi/2$ rồi đối xứng qua đường thẳng $y=x$. Khi đó $T$ là:",
          "options": [
            {
              "text": "Reflection in the x-axis.|||Đối xứng qua trục Ox."
            },
            {
              "text": "Reflection in the y-axis.|||Đối xứng qua trục Oy."
            },
            {
              "text": "Reflection about $y=-x$.|||Đối xứng qua $y=-x$."
            },
            {
              "text": "Rotation through 180 degrees|||Phép quay 180 độ"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Rotation by $\\pi/2$ sends $(x,y)\\mapsto(-y,x)$; reflecting in $y=x$ swaps coordinates: $(-y,x)\\mapsto(x,-y)$. That is exactly reflection in the $x$-axis.</div><div class=\"ml-vi\">Phép quay $\\pi/2$ biến $(x,y)\\mapsto(-y,x)$; đối xứng qua $y=x$ hoán vị hai toạ độ: $(-y,x)\\mapsto(x,-y)$. Đó chính là phép đối xứng qua trục $Ox$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $3\\times3$ matrix. Choose correct statements:<br>(i) $\\det(-A)=-\\det(A)$ (ii) If $A$ has two equal rows, then $\\det(A)=0$ (iii) If $\\det(A)=0$, then $A$ has two equal rows.|||Cho $A$ là ma trận $3\\times3$. Chọn các phát biểu đúng:<br>(i) $\\det(-A)=-\\det(A)$ (ii) Nếu $A$ có hai hàng bằng nhau thì $\\det(A)=0$ (iii) Nếu $\\det(A)=0$ thì $A$ có hai hàng bằng nhau.",
          "options": [
            {
              "text": "All of (i), (ii) and (iii)|||Cả (i), (ii) và (iii)"
            },
            {
              "text": "(ii) and (iii)|||(ii) và (iii)"
            },
            {
              "text": "(i) and (ii)|||(i) và (ii)"
            },
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(i) and (iii)|||(i) và (iii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) $\\det(-A)=(-1)^3\\det A=-\\det A$ for $n=3$ — true. (ii) Two equal rows always force $\\det=0$ — true. (iii) is false: e.g. $\\begin{bmatrix}1&2&3\\\\2&4&6\\\\0&0&1\\end{bmatrix}$ has $\\det=0$ with no two equal rows.</div><div class=\"ml-vi\">(i) $\\det(-A)=(-1)^3\\det A=-\\det A$ với $n=3$ — đúng. (ii) Hai hàng bằng nhau luôn khiến $\\det=0$ — đúng. (iii) sai: ví dụ $\\begin{bmatrix}1&2&3\\\\2&4&6\\\\0&0&1\\end{bmatrix}$ có $\\det=0$ nhưng không có hai hàng bằng nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $m$ such that the following matrix is invertible $A=\\begin{pmatrix}1&2&1\\\\2&3&m\\\\3&2&-1\\end{pmatrix}\\begin{pmatrix}1&1&1\\\\2&3&2\\\\5&7&5\\end{pmatrix}$.|||Tìm tất cả giá trị $m$ để ma trận sau khả nghịch $A=\\begin{pmatrix}1&2&1\\\\2&3&m\\\\3&2&-1\\end{pmatrix}\\begin{pmatrix}1&1&1\\\\2&3&2\\\\5&7&5\\end{pmatrix}$.",
          "options": [
            {
              "text": "No such $m$|||Không có $m$ nào"
            },
            {
              "text": "$m$ is arbitrary|||$m$ tuỳ ý"
            },
            {
              "text": "$m=0$|||$m=0$"
            },
            {
              "text": "$m=1$|||$m=1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The second factor has identical first and third columns, so its determinant is $0$. Then $\\det A=\\det(\\text{first})\\cdot0=0$ for every $m$, and $A$ is never invertible.</div><div class=\"ml-vi\">Thừa số thứ hai có cột 1 và cột 3 giống hệt nhau nên định thức bằng $0$. Do đó $\\det A=\\det(\\text{thừa số đầu})\\cdot0=0$ với mọi $m$, và $A$ không bao giờ khả nghịch.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be an $3\\times3$ matrix. Find $\\det A$ if $AA^{T}=3I$.<br>(i) $1$ (ii) $3\\sqrt3$ or $1$ (iii) $3\\sqrt3$ or $-3\\sqrt3$ (iv) $\\sqrt3$ or $-\\sqrt3$|||Cho $A$ là ma trận $3\\times3$. Tìm $\\det A$ nếu $AA^{T}=3I$.<br>(i) $1$ (ii) $3\\sqrt3$ hoặc $1$ (iii) $3\\sqrt3$ hoặc $-3\\sqrt3$ (iv) $\\sqrt3$ hoặc $-\\sqrt3$",
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
          "explanation": "<div class=\"ml-en\">$\\det(AA^{T})=(\\det A)^2$ and $\\det(3I)=3^3=27$, so $(\\det A)^2=27\\Rightarrow\\det A=\\pm3\\sqrt3$ — (iii).</div><div class=\"ml-vi\">$\\det(AA^{T})=(\\det A)^2$ và $\\det(3I)=3^3=27$, nên $(\\det A)^2=27\\Rightarrow\\det A=\\pm3\\sqrt3$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $A=\\begin{bmatrix}4&3&1\\\\3&6&-1\\\\1&0&2\\end{bmatrix}$. Choose the correct statement.|||Cho $A=\\begin{bmatrix}4&3&1\\\\3&6&-1\\\\1&0&2\\end{bmatrix}$. Chọn phát biểu đúng.",
          "options": [
            {
              "text": "4 is an eigenvalue of $A$|||4 là trị riêng của $A$"
            },
            {
              "text": "5 is an eigenvalue of $A$|||5 là trị riêng của $A$"
            },
            {
              "text": "Both 5 and 4 are eigenvalues of $A$|||Cả 5 và 4 đều là trị riêng của $A$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\det(A-4I)=13\\neq0$ and $\\det(A-5I)=26\\neq0$, so neither 4 nor 5 is an eigenvalue. (The characteristic polynomial is $-\\lambda^3+12\\lambda^2-34\\lambda+21$, whose roots are $3$ and $\\dfrac{9\\pm\\sqrt{53}}{2}$.)</div><div class=\"ml-vi\">$\\det(A-4I)=13\\neq0$ và $\\det(A-5I)=26\\neq0$ nên cả 4 lẫn 5 đều không phải trị riêng. (Đa thức đặc trưng là $-\\lambda^3+12\\lambda^2-34\\lambda+21$, nghiệm là $3$ và $\\dfrac{9\\pm\\sqrt{53}}{2}$.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&4&2\\\\0&2&-1\\\\0&1&1\\end{bmatrix}$. What is the characteristic polynomial $c(x)$ of the matrix $A$?<br>(i) $c(x)=(x-1)^2(x-2)$ (ii) $c(x)=(x-1)(x^2+3x+3)$ (iii) $c(x)=(x-1)(x^2-3x+3)$ (iv) $c(x)=(x-1)(x-2)$|||Cho $A=\\begin{bmatrix}1&4&2\\\\0&2&-1\\\\0&1&1\\end{bmatrix}$. Đa thức đặc trưng $c(x)$ của ma trận $A$ là gì?<br>(i) $c(x)=(x-1)^2(x-2)$ (ii) $c(x)=(x-1)(x^2+3x+3)$ (iii) $c(x)=(x-1)(x^2-3x+3)$ (iv) $c(x)=(x-1)(x-2)$",
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
          "explanation": "<div class=\"ml-en\">Expanding along the first column, $c(x)=(x-1)\\left[(x-2)(x-1)+1\\right]=(x-1)(x^2-3x+3)$ — (iii).</div><div class=\"ml-vi\">Khai triển theo cột đầu: $c(x)=(x-1)\\left[(x-2)(x-1)+1\\right]=(x-1)(x^2-3x+3)$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which points of the set $\\{P(1,2,3),\\ Q(3,1,4),\\ R(2,1,1)\\}$ lie on the line $x=2+t,\\ y=-1+2t,\\ z=1+3t$?|||Điểm nào trong tập $\\{P(1,2,3),\\ Q(3,1,4),\\ R(2,1,1)\\}$ nằm trên đường thẳng $x=2+t,\\ y=-1+2t,\\ z=1+3t$?",
          "options": [
            {
              "text": "Only R|||Chỉ R"
            },
            {
              "text": "Only P|||Chỉ P"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
            },
            {
              "text": "Only Q|||Chỉ Q"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For $Q$: $x=3\\Rightarrow t=1$, and then $y=-1+2=1$ ✓, $z=1+3=4$ ✓. For $P$: $t=-1$ gives $y=-3\\neq2$. For $R$: $t=0$ gives $y=-1\\neq1$. Only $Q$ lies on the line.</div><div class=\"ml-vi\">Với $Q$: $x=3\\Rightarrow t=1$, khi đó $y=-1+2=1$ ✓, $z=1+3=4$ ✓. Với $P$: $t=-1$ cho $y=-3\\neq2$. Với $R$: $t=0$ cho $y=-1\\neq1$. Chỉ $Q$ nằm trên đường thẳng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the second coordinate of the projection of the vector $\\vec{u}=[1\\ \\ 2\\ \\ -1]^{T}$ on the vector $\\vec{v}=[0\\ \\ 2\\ \\ 1]^{T}$.|||Tìm toạ độ thứ hai của hình chiếu vectơ $\\vec{u}=[1\\ \\ 2\\ \\ -1]^{T}$ lên vectơ $\\vec{v}=[0\\ \\ 2\\ \\ 1]^{T}$.",
          "options": [
            {
              "text": "2/5|||2/5"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các phương án khác đều sai"
            },
            {
              "text": "6/5|||6/5"
            },
            {
              "text": "3/5|||3/5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\operatorname{proj}_{\\vec v}\\vec u=\\dfrac{\\vec u\\cdot\\vec v}{\\|\\vec v\\|^2}\\vec v=\\dfrac{3}{5}(0,2,1)=\\left(0,\\dfrac65,\\dfrac35\\right)$; the second coordinate is $\\dfrac65$.</div><div class=\"ml-vi\">$\\operatorname{proj}_{\\vec v}\\vec u=\\dfrac{\\vec u\\cdot\\vec v}{\\|\\vec v\\|^2}\\vec v=\\dfrac{3}{5}(0,2,1)=\\left(0,\\dfrac65,\\dfrac35\\right)$; toạ độ thứ hai là $\\dfrac65$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the parametric equation of the line passing through the origin, intersecting the line $x=1+2t,\\ y=2-3t,\\ z=t$ and perpendicular to that line.|||Tìm phương trình tham số của đường thẳng đi qua gốc toạ độ, cắt đường thẳng $x=1+2t,\\ y=2-3t,\\ z=t$ và vuông góc với đường thẳng đó.",
          "options": [
            {
              "text": "$x=11t,\\ y=8t,\\ z=2t$|||$x=11t,\\ y=8t,\\ z=2t$"
            },
            {
              "text": "$x=3t,\\ y=-2t,\\ z=0$|||$x=3t,\\ y=-2t,\\ z=0$"
            },
            {
              "text": "$x=t,\\ y=0,\\ z=-t$|||$x=t,\\ y=0,\\ z=-t$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A point of the given line is $P=(1+2t,2-3t,t)$ with direction $d=(2,-3,1)$. Perpendicularity means $\\overrightarrow{OP}\\cdot d=0$: $2(1+2t)-3(2-3t)+t=14t-4=0\\Rightarrow t=\\dfrac27$, giving $\\overrightarrow{OP}=\\left(\\dfrac{11}{7},\\dfrac87,\\dfrac27\\right)\\parallel(11,8,2)$.</div><div class=\"ml-vi\">Một điểm trên đường thẳng đã cho là $P=(1+2t,2-3t,t)$ với vectơ chỉ phương $d=(2,-3,1)$. Điều kiện vuông góc: $\\overrightarrow{OP}\\cdot d=0$: $2(1+2t)-3(2-3t)+t=14t-4=0\\Rightarrow t=\\dfrac27$, cho $\\overrightarrow{OP}=\\left(\\dfrac{11}{7},\\dfrac87,\\dfrac27\\right)\\parallel(11,8,2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^3\\to\\mathbb{R}^3$ be the linear transformation given by $T([x\\ y\\ z]^{T})=[y+2x\\ \\ \\ 2x-y\\ \\ \\ z+x]^{T}$. Let $u=[1\\ 0\\ 1]^{T}$, $v=[1\\ -1\\ 2]^{T}$, $w=[2\\ 1\\ -1]^{T}$. Find the volume of the parallelepiped determined by $T(u)$, $T(v)$ and $T(w)$.|||Cho phép biến đổi tuyến tính $T:\\mathbb{R}^3\\to\\mathbb{R}^3$ với $T([x\\ y\\ z]^{T})=[y+2x\\ \\ \\ 2x-y\\ \\ \\ z+x]^{T}$. Cho $u=[1\\ 0\\ 1]^{T}$, $v=[1\\ -1\\ 2]^{T}$, $w=[2\\ 1\\ -1]^{T}$. Tìm thể tích khối hộp tạo bởi $T(u)$, $T(v)$, $T(w)$.",
          "options": [
            {
              "text": "8|||8"
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
            0
          ],
          "explanation": "<div class=\"ml-en\">The matrix of $T$ is $M=\\begin{bmatrix}2&1&0\\\\2&-1&0\\\\1&0&1\\end{bmatrix}$ with $\\det M=-4$. The original parallelepiped has volume $\\left|\\det[u\\ v\\ w]\\right|=2$, and a linear map scales volume by $|\\det M|$: $4\\times2=8$.</div><div class=\"ml-vi\">Ma trận của $T$ là $M=\\begin{bmatrix}2&1&0\\\\2&-1&0\\\\1&0&1\\end{bmatrix}$ với $\\det M=-4$. Khối hộp ban đầu có thể tích $\\left|\\det[u\\ v\\ w]\\right|=2$, và ánh xạ tuyến tính nhân thể tích với $|\\det M|$: $4\\times2=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be the linear transformation such that $T([x\\ \\ y]^{T})=\\left[\\dfrac{25x+15y}{34}\\ \\ \\ \\dfrac{15x+9y}{34}\\right]^{T}$. Determine if $T$ is projection on a line or reflection in a line.|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép biến đổi tuyến tính $T([x\\ \\ y]^{T})=\\left[\\dfrac{25x+15y}{34}\\ \\ \\ \\dfrac{15x+9y}{34}\\right]^{T}$. Xác định $T$ là phép chiếu lên một đường thẳng hay phép đối xứng qua một đường thẳng.",
          "options": [
            {
              "text": "Reflection in the line $3x-5y=0$|||Đối xứng qua đường thẳng $3x-5y=0$"
            },
            {
              "text": "Projection on the line $3x-5y=0$|||Chiếu lên đường thẳng $3x-5y=0$"
            },
            {
              "text": "Reflection in the line $5x-3y=0$|||Đối xứng qua đường thẳng $5x-3y=0$"
            },
            {
              "text": "Projection on the line $5x-3y=0$|||Chiếu lên đường thẳng $5x-3y=0$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The matrix is $\\dfrac{1}{34}\\begin{bmatrix}25&15\\\\15&9\\end{bmatrix}$ with trace $1$ and determinant $0$ — the signature of a projection (a reflection would have trace $0$, determinant $-1$). Its image is spanned by $(5,3)$, the line $y=\\dfrac{3}{5}x$, i.e. $3x-5y=0$.</div><div class=\"ml-vi\">Ma trận là $\\dfrac{1}{34}\\begin{bmatrix}25&15\\\\15&9\\end{bmatrix}$ với vết bằng $1$ và định thức bằng $0$ — đặc trưng của phép chiếu (phép đối xứng sẽ có vết $0$, định thức $-1$). Ảnh của nó sinh bởi $(5,3)$, tức đường thẳng $y=\\dfrac{3}{5}x$, hay $3x-5y=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of $t$ for which $(1,2,t)$ lies in $U=\\operatorname{span}\\{(1,3,4);\\ (0,2,2)\\}$.|||Tìm giá trị $t$ để $(1,2,t)$ thuộc $U=\\operatorname{span}\\{(1,3,4);\\ (0,2,2)\\}$.",
          "options": [
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
              "text": "-1|||-1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Write $(1,2,t)=a(1,3,4)+b(0,2,2)$. The first coordinate gives $a=1$; the second gives $3+2b=2\\Rightarrow b=-\\dfrac12$; then $t=4+2\\!\\left(-\\dfrac12\\right)=3$.</div><div class=\"ml-vi\">Viết $(1,2,t)=a(1,3,4)+b(0,2,2)$. Toạ độ đầu cho $a=1$; toạ độ thứ hai cho $3+2b=2\\Rightarrow b=-\\dfrac12$; suy ra $t=4+2\\!\\left(-\\dfrac12\\right)=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\operatorname{span}\\{(1,1,2,1),(0,1,1,-2)\\}$. Find all values of $t$ such that $(1,t,3,4)$ is in $U$.|||Cho $U=\\operatorname{span}\\{(1,1,2,1),(0,1,1,-2)\\}$. Tìm tất cả giá trị $t$ để $(1,t,3,4)$ thuộc $U$.",
          "options": [
            {
              "text": "There is no such $t$|||Không tồn tại $t$ nào"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "All nonzero numbers|||Mọi số khác 0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "All numbers different from -1|||Mọi số khác -1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">From the first coordinate $a=1$; the third gives $2+b=3\\Rightarrow b=1$. But then the fourth coordinate is $1-2=-1\\neq4$, so no combination works for any $t$.</div><div class=\"ml-vi\">Từ toạ độ đầu, $a=1$; toạ độ thứ ba cho $2+b=3\\Rightarrow b=1$. Nhưng khi đó toạ độ thứ tư là $1-2=-1\\neq4$, nên không có $t$ nào thoả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find a basis for the subspace of $\\mathbb{R}^3$ defined as $U=\\{[a\\ \\ b\\ \\ a-b]^{T}\\mid a,b \\text{ are real numbers}\\}$.<br>(i) $\\{[1\\ 0\\ 1]^{T},[0\\ 1\\ -1]^{T}\\}$ (ii) $\\{[1\\ 1\\ 0]^{T}\\}$ (iii) $\\{[1\\ 0\\ 1]^{T},[-1\\ 0\\ -1]^{T},[0\\ 1\\ -1]^{T}\\}$|||Tìm một cơ sở của không gian con của $\\mathbb{R}^3$ xác định bởi $U=\\{[a\\ \\ b\\ \\ a-b]^{T}\\mid a,b \\text{ là số thực}\\}$.<br>(i) $\\{[1\\ 0\\ 1]^{T},[0\\ 1\\ -1]^{T}\\}$ (ii) $\\{[1\\ 1\\ 0]^{T}\\}$ (iii) $\\{[1\\ 0\\ 1]^{T},[-1\\ 0\\ -1]^{T},[0\\ 1\\ -1]^{T}\\}$",
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
          "explanation": "<div class=\"ml-en\">$[a,b,a-b]=a[1,0,1]+b[0,1,-1]$, and those two vectors are independent, so (i) is a basis ($\\dim U=2$). (ii) is too small; (iii) is dependent (its second vector is $-1$ times the first).</div><div class=\"ml-vi\">$[a,b,a-b]=a[1,0,1]+b[0,1,-1]$, và hai vectơ này độc lập nên (i) là cơ sở ($\\dim U=2$). (ii) quá ít; (iii) phụ thuộc (vectơ thứ hai bằng $-1$ lần vectơ đầu).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{u,v,w\\}$ be independent. Which of the following sets are independent?<br>(i) $\\{u,\\ v-w,\\ w\\}$ (ii) $\\{u,\\ u-v,\\ u+v,\\ w\\}$|||Cho $\\{u,v,w\\}$ độc lập tuyến tính. Tập nào sau đây độc lập tuyến tính?<br>(i) $\\{u,\\ v-w,\\ w\\}$ (ii) $\\{u,\\ u-v,\\ u+v,\\ w\\}$",
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
          "explanation": "<div class=\"ml-en\">(i) is obtained from $\\{u,v,w\\}$ by an elementary operation ($v\\mapsto v-w$), which preserves independence. (ii) is dependent: $(u-v)+(u+v)=2u$, so the four vectors satisfy a nontrivial relation.</div><div class=\"ml-vi\">(i) nhận được từ $\\{u,v,w\\}$ bằng một phép biến đổi sơ cấp ($v\\mapsto v-w$), bảo toàn tính độc lập. (ii) phụ thuộc: $(u-v)+(u+v)=2u$, nên bốn vectơ có một hệ thức không tầm thường.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume that the set $\\{[1,2,3],\\ [-2,1,0],\\ [1,a,b]\\}$ is orthogonal. Find $a-b$.|||Giả sử tập $\\{[1,2,3],\\ [-2,1,0],\\ [1,a,b]\\}$ là trực giao. Tìm $a-b$.",
          "options": [
            {
              "text": "11/3|||11/3"
            },
            {
              "text": "7/3|||7/3"
            },
            {
              "text": "1/3|||1/3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Orthogonality with $[-2,1,0]$ gives $-2+a=0\\Rightarrow a=2$; with $[1,2,3]$: $1+2a+3b=0\\Rightarrow b=-\\dfrac53$. Hence $a-b=2+\\dfrac53=\\dfrac{11}{3}$.</div><div class=\"ml-vi\">Trực giao với $[-2,1,0]$ cho $-2+a=0\\Rightarrow a=2$; với $[1,2,3]$: $1+2a+3b=0\\Rightarrow b=-\\dfrac53$. Vậy $a-b=2+\\dfrac53=\\dfrac{11}{3}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $3\\times5$ matrix. If $\\dim(\\operatorname{Null}(A))=4$, what is the rank of $A$?|||Cho $A$ là ma trận $3\\times5$. Nếu $\\dim(\\operatorname{Null}(A))=4$, hạng của $A$ bằng bao nhiêu?",
          "options": [
            {
              "text": "4|||4"
            },
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
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Rank–nullity for a matrix with 5 columns: $\\operatorname{rank}+\\dim\\operatorname{Null}=5\\Rightarrow\\operatorname{rank}=5-4=1$.</div><div class=\"ml-vi\">Định lý hạng–số khuyết với ma trận 5 cột: $\\operatorname{rank}+\\dim\\operatorname{Null}=5\\Rightarrow\\operatorname{rank}=5-4=1$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D6",
      "source": "REAL",
      "sortOrder": 5,
      "title": "Đề 6 — FA25 Retake Exam|||Đề 6 — Thi lại FA25",
      "description": "MAE101 real FE retake paper (Fall 2025), transcribed from the exam images; answers reasoned here. (50 questions)|||Đề thi lại FE thật môn MAE101 (kỳ Thu 2025), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (50 câu)",
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
          "prompt": "Let $h(x)=f(g(x))$. If $f(x)=2x-4$ and $g(x)=x-5$ then $h(x)$ is|||Cho $h(x)=f(g(x))$. Nếu $f(x)=2x-4$ và $g(x)=x-5$ thì $h(x)$ bằng",
          "options": [
            {
              "text": "$-2x+7$|||$-2x+7$"
            },
            {
              "text": "$-2x-10$|||$-2x-10$"
            },
            {
              "text": "$-2x+3$|||$-2x+3$"
            },
            {
              "text": "$2x-14$|||$2x-14$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$h(x)=f(x-5)=2(x-5)-4=2x-14$.</div><div class=\"ml-vi\">$h(x)=f(x-5)=2(x-5)-4=2x-14$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the slope of the line passing $(1,2)$ and $(3,-8)$?|||Hệ số góc của đường thẳng đi qua $(1,2)$ và $(3,-8)$ là bao nhiêu?",
          "options": [
            {
              "text": "-5|||-5"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "-8/3|||-8/3"
            },
            {
              "text": "3/2|||3/2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$m=\\dfrac{-8-2}{3-1}=\\dfrac{-10}{2}=-5$.</div><div class=\"ml-vi\">$m=\\dfrac{-8-2}{3-1}=\\dfrac{-10}{2}=-5$.</div>"
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
          "explanation": "<div class=\"ml-en\">Multiply by the conjugate: $\\dfrac{x^2+3x-4}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{(x+4)(x-1)}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{x+4}{\\sqrt{x^2+3x}+2}\\to\\dfrac54$.</div><div class=\"ml-vi\">Nhân liên hợp: $\\dfrac{x^2+3x-4}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{(x+4)(x-1)}{(x-1)(\\sqrt{x^2+3x}+2)}=\\dfrac{x+4}{\\sqrt{x^2+3x}+2}\\to\\dfrac54$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statements are true for the piecewise function $f(x)=\\begin{cases}\\dfrac{3x-3}{\\sqrt{x+3}-2} & \\text{if } x\\lt1\\\\[4pt] 3x^2+6 & \\text{if } x\\geq1\\end{cases}$?<br>(i) $\\displaystyle\\lim_{x\\to1^{-}}f(x)=12$ (ii) $f(1)=12$ (iii) $\\displaystyle\\lim_{x\\to1^{+}}f(x)=12$|||Phát biểu nào đúng với hàm từng khúc $f(x)=\\begin{cases}\\dfrac{3x-3}{\\sqrt{x+3}-2} & \\text{nếu } x\\lt1\\\\[4pt] 3x^2+6 & \\text{nếu } x\\geq1\\end{cases}$?<br>(i) $\\displaystyle\\lim_{x\\to1^{-}}f(x)=12$ (ii) $f(1)=12$ (iii) $\\displaystyle\\lim_{x\\to1^{+}}f(x)=12$",
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
              "text": "All of (i), (ii) and (iii)|||Cả (i), (ii) và (iii)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For $x\\to1^{-}$, rationalize: $\\dfrac{3(x-1)(\\sqrt{x+3}+2)}{x-1}=3(\\sqrt{x+3}+2)\\to12$, so (i) is true. But $f(1)=3+6=9$ and $\\lim_{x\\to1^{+}}f(x)=9$, so (ii) and (iii) are false.</div><div class=\"ml-vi\">Khi $x\\to1^{-}$, nhân liên hợp: $\\dfrac{3(x-1)(\\sqrt{x+3}+2)}{x-1}=3(\\sqrt{x+3}+2)\\to12$, nên (i) đúng. Nhưng $f(1)=3+6=9$ và $\\lim_{x\\to1^{+}}f(x)=9$ nên (ii), (iii) sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Simplify the expression $\\dfrac{f(x+h)-f(x)}{h}$ for $f(x)=x^2+5x$.|||Rút gọn biểu thức $\\dfrac{f(x+h)-f(x)}{h}$ với $f(x)=x^2+5x$.",
          "options": [
            {
              "text": "$2h+x+5$|||$2h+x+5$"
            },
            {
              "text": "$h+2x-5$|||$h+2x-5$"
            },
            {
              "text": "$h+2x+5$|||$h+2x+5$"
            },
            {
              "text": "$2h+x-5$|||$2h+x-5$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{(x+h)^2+5(x+h)-x^2-5x}{h}=\\dfrac{2xh+h^2+5h}{h}=2x+h+5$.</div><div class=\"ml-vi\">$\\dfrac{(x+h)^2+5(x+h)-x^2-5x}{h}=\\dfrac{2xh+h^2+5h}{h}=2x+h+5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the derivative of the function $f(x)=9x^{5/2}-7x^{3/2}$ at $x=4$.|||Tính giá trị đạo hàm của hàm $f(x)=9x^{5/2}-7x^{3/2}$ tại $x=4$.",
          "options": [
            {
              "text": "127|||127"
            },
            {
              "text": "130|||130"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "159|||159"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=\\dfrac{45}{2}x^{3/2}-\\dfrac{21}{2}x^{1/2}$. At $x=4$: $x^{3/2}=8$, $x^{1/2}=2$, so $f'(4)=\\dfrac{45}{2}(8)-\\dfrac{21}{2}(2)=180-21=159$.</div><div class=\"ml-vi\">$f'(x)=\\dfrac{45}{2}x^{3/2}-\\dfrac{21}{2}x^{1/2}$. Tại $x=4$: $x^{3/2}=8$, $x^{1/2}=2$, nên $f'(4)=\\dfrac{45}{2}(8)-\\dfrac{21}{2}(2)=180-21=159$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $C(x)$ = the cost of producing $x$ units of a product, the rate of change of $C(x)$ is called the <b>marginal cost</b>. Let $C(x)=0.000003x^3-0.04x^2+200x+70000$. Find the marginal cost of 3000 units.|||Nếu $C(x)$ là chi phí sản xuất $x$ đơn vị sản phẩm thì tốc độ thay đổi của $C(x)$ gọi là <b>chi phí biên</b>. Cho $C(x)=0.000003x^3-0.04x^2+200x+70000$. Tìm chi phí biên tại 3000 đơn vị.",
          "options": [
            {
              "text": "310000|||310000"
            },
            {
              "text": "410|||410"
            },
            {
              "text": "41|||41"
            },
            {
              "text": "3000|||3000"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$C'(x)=0.000009x^2-0.08x+200$. At $x=3000$: $0.000009(9\\,000\\,000)-0.08(3000)+200=81-240+200=41$.</div><div class=\"ml-vi\">$C'(x)=0.000009x^2-0.08x+200$. Tại $x=3000$: $0.000009(9\\,000\\,000)-0.08(3000)+200=81-240+200=41$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Differentiate $y=\\sqrt[5]{x^7+9x}$.<br>(i) $dy/dx=\\dfrac15(x^7+9x)^{-4/5}$ (ii) $dy/dx=\\dfrac15(x^7+9x)^{4/5}(7x^6+9)$ (iii) $dy/dx=\\dfrac15(x^7+9x)^{-4/5}(7x^6+9)$ (iv) $dy/dx=\\dfrac15(x^7+9x)^{-4/5}(x^6+9)$|||Tính đạo hàm $y=\\sqrt[5]{x^7+9x}$.<br>(i) $dy/dx=\\dfrac15(x^7+9x)^{-4/5}$ (ii) $dy/dx=\\dfrac15(x^7+9x)^{4/5}(7x^6+9)$ (iii) $dy/dx=\\dfrac15(x^7+9x)^{-4/5}(7x^6+9)$ (iv) $dy/dx=\\dfrac15(x^7+9x)^{-4/5}(x^6+9)$",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">Chain rule on $y=(x^7+9x)^{1/5}$: $y'=\\dfrac15(x^7+9x)^{-4/5}\\cdot(7x^6+9)$ — (iii).</div><div class=\"ml-vi\">Quy tắc dây chuyền với $y=(x^7+9x)^{1/5}$: $y'=\\dfrac15(x^7+9x)^{-4/5}\\cdot(7x^6+9)$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $dy/dx$ by implicit differentiation $(1/3)x^3-9y^2=1$.<br>(i) $x^2/(9y)$ (ii) $x^2/(18y)$ (iii) $18y/(x^2+1)$ (iv) $18y/(x^2)$|||Tìm $dy/dx$ bằng đạo hàm hàm ẩn $(1/3)x^3-9y^2=1$.<br>(i) $x^2/(9y)$ (ii) $x^2/(18y)$ (iii) $18y/(x^2+1)$ (iv) $18y/(x^2)$",
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
            0
          ],
          "explanation": "<div class=\"ml-en\">Differentiating: $x^2-18y\\,y'=0\\Rightarrow y'=\\dfrac{x^2}{18y}$ — (ii).</div><div class=\"ml-vi\">Đạo hàm hai vế: $x^2-18y\\,y'=0\\Rightarrow y'=\\dfrac{x^2}{18y}$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Volume of a spherical balloon is decreasing at rate $9\\ \\text{cm}^3$/s. How fast is its diameter decreasing when the volume is $6\\ \\text{cm}^3$?|||Thể tích một quả bóng hình cầu đang giảm với tốc độ $9\\ \\text{cm}^3$/s. Đường kính của nó giảm nhanh thế nào khi thể tích bằng $6\\ \\text{cm}^3$?",
          "options": [
            {
              "text": "1.127 cm/s|||1.127 cm/s"
            },
            {
              "text": "2.127 cm/s|||2.127 cm/s"
            },
            {
              "text": "3.127 cm/s|||3.127 cm/s"
            },
            {
              "text": "0.127 cm/s|||0.127 cm/s"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In terms of the diameter, $V=\\dfrac{\\pi}{6}d^3$, so $\\dfrac{dV}{dt}=\\dfrac{\\pi}{2}d^2\\dfrac{dd}{dt}$. From $V=6$: $d=\\sqrt[3]{36/\\pi}\\approx2.2547$, $d^2\\approx5.0837$. Then $\\left|\\dfrac{dd}{dt}\\right|=\\dfrac{9}{(\\pi/2)(5.0837)}\\approx1.127$ cm/s.</div><div class=\"ml-vi\">Theo đường kính, $V=\\dfrac{\\pi}{6}d^3$ nên $\\dfrac{dV}{dt}=\\dfrac{\\pi}{2}d^2\\dfrac{dd}{dt}$. Từ $V=6$: $d=\\sqrt[3]{36/\\pi}\\approx2.2547$, $d^2\\approx5.0837$. Vậy $\\left|\\dfrac{dd}{dt}\\right|=\\dfrac{9}{(\\pi/2)(5.0837)}\\approx1.127$ cm/s.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the linearization $L(x)$ of $f(x)=\\sqrt[3]{x^2}$ at $x=8$.|||Tìm xấp xỉ tuyến tính $L(x)$ của $f(x)=\\sqrt[3]{x^2}$ tại $x=8$.",
          "options": [
            {
              "text": "$L(x)=x/3+4/3$|||$L(x)=x/3+4/3$"
            },
            {
              "text": "$L(x)=x/3+1/3$|||$L(x)=x/3+1/3$"
            },
            {
              "text": "$L(x)=x/3-4/3$|||$L(x)=x/3-4/3$"
            },
            {
              "text": "$L(x)=-x/3+4/3$|||$L(x)=-x/3+4/3$"
            },
            {
              "text": "$L(x)=-x/3+1/3$|||$L(x)=-x/3+1/3$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(8)=4$ and $f'(x)=\\dfrac23x^{-1/3}\\Rightarrow f'(8)=\\dfrac13$. So $L(x)=4+\\dfrac13(x-8)=\\dfrac{x}{3}+\\dfrac43$.</div><div class=\"ml-vi\">$f(8)=4$ và $f'(x)=\\dfrac23x^{-1/3}\\Rightarrow f'(8)=\\dfrac13$. Vậy $L(x)=4+\\dfrac13(x-8)=\\dfrac{x}{3}+\\dfrac43$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the critical numbers of the function $y=x^2e^{x-1}$.|||Tìm các điểm tới hạn của hàm $y=x^2e^{x-1}$.",
          "options": [
            {
              "text": "-2; 1|||-2; 1"
            },
            {
              "text": "-2; 0|||-2; 0"
            },
            {
              "text": "0; 2|||0; 2"
            },
            {
              "text": "0; 1|||0; 1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$y'=2xe^{x-1}+x^2e^{x-1}=xe^{x-1}(x+2)$. Since $e^{x-1}\\gt0$, $y'=0\\iff x=0$ or $x=-2$.</div><div class=\"ml-vi\">$y'=2xe^{x-1}+x^2e^{x-1}=xe^{x-1}(x+2)$. Vì $e^{x-1}\\gt0$ nên $y'=0\\iff x=0$ hoặc $x=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine where the function $f(x)=(x+3)^{2/3}$ is concave up and where it is concave down.<br>(i) Concave down on $(-\\infty,-3)$ and concave up on $(-3,\\infty)$ (ii) Concave down on $(-\\infty,-3)$ and $(-3,\\infty)$ (iii) Concave up on $(-\\infty,-3)$ and $(-3,\\infty)$ (iv) Concave up on $(-\\infty,-3)$ and concave down on $(-3,\\infty)$|||Xác định khoảng lồi/lõm của hàm $f(x)=(x+3)^{2/3}$.<br>(i) Lõm xuống trên $(-\\infty,-3)$ và lõm lên trên $(-3,\\infty)$ (ii) Lõm xuống trên $(-\\infty,-3)$ và $(-3,\\infty)$ (iii) Lõm lên trên $(-\\infty,-3)$ và $(-3,\\infty)$ (iv) Lõm lên trên $(-\\infty,-3)$ và lõm xuống trên $(-3,\\infty)$",
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
          "explanation": "<div class=\"ml-en\">$f'(x)=\\dfrac23(x+3)^{-1/3}$ and $f''(x)=-\\dfrac29(x+3)^{-4/3}$. Since $(x+3)^{-4/3}\\gt0$ for $x\\neq-3$, $f''\\lt0$ everywhere on both sides: concave down on $(-\\infty,-3)$ and $(-3,\\infty)$ — (ii).</div><div class=\"ml-vi\">$f'(x)=\\dfrac23(x+3)^{-1/3}$ và $f''(x)=-\\dfrac29(x+3)^{-4/3}$. Vì $(x+3)^{-4/3}\\gt0$ với mọi $x\\neq-3$ nên $f''\\lt0$ ở cả hai phía: lõm xuống trên $(-\\infty,-3)$ và $(-3,\\infty)$ — (ii).</div>"
        },
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
          "explanation": "<div class=\"ml-en\">$\\left|\\dfrac{\\sin(x^2)}{x}\\right|\\leq\\dfrac{1}{|x|}\\to0$ as $x\\to\\pm\\infty$ (squeeze theorem), so $f(x)\\to-1$: the horizontal asymptote is $y=-1$.</div><div class=\"ml-vi\">$\\left|\\dfrac{\\sin(x^2)}{x}\\right|\\leq\\dfrac{1}{|x|}\\to0$ khi $x\\to\\pm\\infty$ (định lý kẹp) nên $f(x)\\to-1$: tiệm cận ngang là $y=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find two real numbers such that the first minus two times the second is 10 and the sum of their square is minimum|||Tìm hai số thực sao cho số thứ nhất trừ hai lần số thứ hai bằng 10 và tổng bình phương của chúng nhỏ nhất",
          "options": [
            {
              "text": "The first is 10, the second is 0|||Số thứ nhất là 10, số thứ hai là 0"
            },
            {
              "text": "The first is 0, the second is 10|||Số thứ nhất là 0, số thứ hai là 10"
            },
            {
              "text": "The first is 2, the second is -4|||Số thứ nhất là 2, số thứ hai là -4"
            },
            {
              "text": "The first is -4, the second is 2|||Số thứ nhất là -4, số thứ hai là 2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">With $a-2b=10$, minimize $S=a^2+b^2=(10+2b)^2+b^2$. Then $S'=4(10+2b)+2b=40+10b=0\\Rightarrow b=-4$ and $a=2$.</div><div class=\"ml-vi\">Với $a-2b=10$, cực tiểu hoá $S=a^2+b^2=(10+2b)^2+b^2$. Khi đó $S'=4(10+2b)+2b=40+10b=0\\Rightarrow b=-4$ và $a=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the specified initial approximation $x_1$ to find $x_3$, the third approximation to the root of the given equation. $x^3-3x^2+1=0$, $x_1=3$ (Give your answer to 4 decimal places)|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1$ để tìm $x_3$, xấp xỉ thứ ba của nghiệm phương trình $x^3-3x^2+1=0$, $x_1=3$ (làm tròn 4 chữ số thập phân)",
          "options": [
            {
              "text": "2.8794|||2.8794"
            },
            {
              "text": "2.9888|||2.9888"
            },
            {
              "text": "1.8794|||1.8794"
            },
            {
              "text": "1.1112|||1.1112"
            },
            {
              "text": "1.1206|||1.1206"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=3x^2-6x$. $f(3)=1$, $f'(3)=9\\Rightarrow x_2=3-\\dfrac19=2.8889$. Then $f(x_2)=0.0727$, $f'(x_2)=7.7037\\Rightarrow x_3\\approx2.8794$.</div><div class=\"ml-vi\">$f'(x)=3x^2-6x$. $f(3)=1$, $f'(3)=9\\Rightarrow x_2=3-\\dfrac19=2.8889$. Tiếp: $f(x_2)=0.0727$, $f'(x_2)=7.7037\\Rightarrow x_3\\approx2.8794$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the sum indicated by the notation $\\displaystyle\\sum_{n=1}^{10}(2n+1)$.|||Tính tổng $\\displaystyle\\sum_{n=1}^{10}(2n+1)$.",
          "options": [
            {
              "text": "120|||120"
            },
            {
              "text": "110|||110"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "65|||65"
            },
            {
              "text": "121|||121"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\displaystyle\\sum_{n=1}^{10}(2n+1)=2\\cdot\\dfrac{10\\cdot11}{2}+10=110+10=120$.</div><div class=\"ml-vi\">$\\displaystyle\\sum_{n=1}^{10}(2n+1)=2\\cdot\\dfrac{10\\cdot11}{2}+10=110+10=120$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine a region $A$ whose area is equal to $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\dfrac{\\pi}{4n}\\sin\\!\\left(\\dfrac{(i+n)\\pi}{4n}\\right)$<br>(i) under the graph of $f(x)=\\sin x$ from $x=0$ to $x=\\dfrac{\\pi}{4}$ (ii) under the graph of $f(x)=\\dfrac14\\sin x$ from $x=0$ to $x=\\dfrac{\\pi}{4}$ (iii) under the graph of $f(x)=\\sin x$ from $x=\\dfrac{\\pi}{4}$ to $x=\\dfrac{\\pi}{2}$ (iv) under the graph of $f(x)=\\dfrac14\\sin x$ from $x=\\dfrac{\\pi}{4}$ to $x=\\dfrac{\\pi}{2}$|||Xác định miền $A$ có diện tích bằng $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\dfrac{\\pi}{4n}\\sin\\!\\left(\\dfrac{(i+n)\\pi}{4n}\\right)$<br>(i) dưới đồ thị $f(x)=\\sin x$ từ $x=0$ đến $x=\\dfrac{\\pi}{4}$ (ii) dưới đồ thị $f(x)=\\dfrac14\\sin x$ từ $x=0$ đến $x=\\dfrac{\\pi}{4}$ (iii) dưới đồ thị $f(x)=\\sin x$ từ $x=\\dfrac{\\pi}{4}$ đến $x=\\dfrac{\\pi}{2}$ (iv) dưới đồ thị $f(x)=\\dfrac14\\sin x$ từ $x=\\dfrac{\\pi}{4}$ đến $x=\\dfrac{\\pi}{2}$",
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
          "explanation": "<div class=\"ml-en\">Here $\\Delta x=\\dfrac{\\pi}{4n}$ and the sample points are $x_i=\\dfrac{(i+n)\\pi}{4n}=\\dfrac{\\pi}{4}+i\\Delta x$, which run from $\\dfrac{\\pi}{4}$ to $\\dfrac{\\pi}{4}+\\dfrac{\\pi}{4}=\\dfrac{\\pi}{2}$ with $f(x)=\\sin x$ — (iii).</div><div class=\"ml-vi\">Ở đây $\\Delta x=\\dfrac{\\pi}{4n}$ và các điểm mẫu là $x_i=\\dfrac{(i+n)\\pi}{4n}=\\dfrac{\\pi}{4}+i\\Delta x$, chạy từ $\\dfrac{\\pi}{4}$ đến $\\dfrac{\\pi}{4}+\\dfrac{\\pi}{4}=\\dfrac{\\pi}{2}$ với $f(x)=\\sin x$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the derivative of the function $g(x)=\\displaystyle\\int_5^{\\sin x}(1+t)\\,dt$.|||Tìm đạo hàm của hàm $g(x)=\\displaystyle\\int_5^{\\sin x}(1+t)\\,dt$.",
          "options": [
            {
              "text": "$(1+\\sin x)\\cos x$|||$(1+\\sin x)\\cos x$"
            },
            {
              "text": "$-(1+\\sin x)\\cos x$|||$-(1+\\sin x)\\cos x$"
            },
            {
              "text": "$(1+\\sin x)\\sin x$|||$(1+\\sin x)\\sin x$"
            },
            {
              "text": "$-(1+\\sin x)\\sin x$|||$-(1+\\sin x)\\sin x$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By the Fundamental Theorem with the chain rule: $g'(x)=(1+\\sin x)\\cdot(\\sin x)'=(1+\\sin x)\\cos x$.</div><div class=\"ml-vi\">Theo định lý cơ bản kết hợp quy tắc dây chuyền: $g'(x)=(1+\\sin x)\\cdot(\\sin x)'=(1+\\sin x)\\cos x$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A particle moves along a line with the velocity $v(t)=t^2-2t$ (m/s). Find the distance traveled by the particle during the time interval $0\\leq t\\leq3$.|||Một chất điểm chuyển động trên đường thẳng với vận tốc $v(t)=t^2-2t$ (m/s). Tìm quãng đường chất điểm đi được trong khoảng thời gian $0\\leq t\\leq3$.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "8/3|||8/3"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "4/3|||4/3"
            },
            {
              "text": "2/3|||2/3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Distance $=\\displaystyle\\int_0^3|v|\\,dt$. Since $v\\lt0$ on $(0,2)$ and $v\\gt0$ on $(2,3)$: $\\displaystyle\\int_0^2(2t-t^2)dt=\\dfrac43$ and $\\displaystyle\\int_2^3(t^2-2t)dt=\\dfrac43$, total $\\dfrac83$ m.</div><div class=\"ml-vi\">Quãng đường $=\\displaystyle\\int_0^3|v|\\,dt$. Vì $v\\lt0$ trên $(0,2)$ và $v\\gt0$ trên $(2,3)$: $\\displaystyle\\int_0^2(2t-t^2)dt=\\dfrac43$ và $\\displaystyle\\int_2^3(t^2-2t)dt=\\dfrac43$, tổng $\\dfrac83$ m.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int\\dfrac{dx}{x(\\ln x)^6}$.<br>(i) $\\dfrac{-1}{x(\\ln x)^7}+C$ (ii) $\\dfrac{-1}{5(\\ln x)^5}+C$ (iii) $\\dfrac{1}{7(\\ln x)^7}+C$ (iv) $\\dfrac{-1}{5x(\\ln x)^5}+C$|||Tính $\\displaystyle\\int\\dfrac{dx}{x(\\ln x)^6}$.<br>(i) $\\dfrac{-1}{x(\\ln x)^7}+C$ (ii) $\\dfrac{-1}{5(\\ln x)^5}+C$ (iii) $\\dfrac{1}{7(\\ln x)^7}+C$ (iv) $\\dfrac{-1}{5x(\\ln x)^5}+C$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
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
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Substitute $u=\\ln x$, $du=\\dfrac{dx}{x}$: $\\displaystyle\\int u^{-6}du=\\dfrac{u^{-5}}{-5}+C=\\dfrac{-1}{5(\\ln x)^5}+C$ — (ii).</div><div class=\"ml-vi\">Đặt $u=\\ln x$, $du=\\dfrac{dx}{x}$: $\\displaystyle\\int u^{-6}du=\\dfrac{u^{-5}}{-5}+C=\\dfrac{-1}{5(\\ln x)^5}+C$ — (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\displaystyle\\int4x\\ln(2x)\\,dx$.<br>(i) $x^2(2\\ln(2x)-1)+C$ (ii) $x^2(\\ln(2x)+1)+C$ (iii) $2x^2(\\ln(2x)-1)+C$ (iv) $2x^2(\\ln(2x)+1)+C$|||Tính $\\displaystyle\\int4x\\ln(2x)\\,dx$.<br>(i) $x^2(2\\ln(2x)-1)+C$ (ii) $x^2(\\ln(2x)+1)+C$ (iii) $2x^2(\\ln(2x)-1)+C$ (iv) $2x^2(\\ln(2x)+1)+C$",
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
          "explanation": "<div class=\"ml-en\">By parts with $u=\\ln(2x)$, $dv=4x\\,dx$: $2x^2\\ln(2x)-\\displaystyle\\int2x^2\\cdot\\dfrac1x dx=2x^2\\ln(2x)-x^2=x^2(2\\ln(2x)-1)+C$ — (i).</div><div class=\"ml-vi\">Tích phân từng phần với $u=\\ln(2x)$, $dv=4x\\,dx$: $2x^2\\ln(2x)-\\displaystyle\\int2x^2\\cdot\\dfrac1x dx=2x^2\\ln(2x)-x^2=x^2(2\\ln(2x)-1)+C$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Simpson's Rule with $n=4$ steps to approximate the integral $\\displaystyle\\int_1^5 x\\cos x\\,dx$|||Dùng quy tắc Simpson với $n=4$ bước để xấp xỉ tích phân $\\displaystyle\\int_1^5 x\\cos x\\,dx$",
          "options": [
            {
              "text": "-5.92|||-5.92"
            },
            {
              "text": "-6.26|||-6.26"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-3.43|||-3.43"
            },
            {
              "text": "-6.89|||-6.89"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$h=1$ and the nodes are $1,2,3,4,5$ with $f$-values $0.5403,\\ -0.8323,\\ -2.9700,\\ -2.6146,\\ 1.4183$. Simpson: $\\dfrac13\\left[0.5403+4(-0.8323)+2(-2.9700)+4(-2.6146)+1.4183\\right]\\approx-5.92$.</div><div class=\"ml-vi\">$h=1$ và các nút là $1,2,3,4,5$ với giá trị $f$ lần lượt $0.5403,\\ -0.8323,\\ -2.9700,\\ -2.6146,\\ 1.4183$. Simpson: $\\dfrac13\\left[0.5403+4(-0.8323)+2(-2.9700)+4(-2.6146)+1.4183\\right]\\approx-5.92$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following integrals is convergent?<br>(i) $\\displaystyle\\int_1^{\\infty}\\dfrac{1+e^{-x}}{x}\\,dx$ (ii) $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^2}\\,dx$|||Tích phân nào sau đây hội tụ?<br>(i) $\\displaystyle\\int_1^{\\infty}\\dfrac{1+e^{-x}}{x}\\,dx$ (ii) $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^2}\\,dx$",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) contains $\\displaystyle\\int_1^\\infty\\dfrac{dx}{x}$, which diverges ($p=1$). (ii) is a $p$-integral with $p=2\\gt1$, hence convergent (its value is 1).</div><div class=\"ml-vi\">(i) chứa $\\displaystyle\\int_1^\\infty\\dfrac{dx}{x}$, phân kỳ ($p=1$). (ii) là tích phân dạng $p$ với $p=2\\gt1$ nên hội tụ (giá trị bằng 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that rank of the matrix $\\begin{bmatrix}-1&4&5\\\\2&3&-2\\\\3&10&a\\end{bmatrix}$ is 2, what is $a$?|||Biết hạng của ma trận $\\begin{bmatrix}-1&4&5\\\\2&3&-2\\\\3&10&a\\end{bmatrix}$ bằng 2, tìm $a$.",
          "options": [
            {
              "text": "-1|||-1"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "0|||0"
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
            4
          ],
          "explanation": "<div class=\"ml-en\">Rank $\\lt3$ requires $\\det=0$: $-1(3a+20)-4(2a+6)+5(20-9)=-11a+11=0\\Rightarrow a=1$. The first two rows stay independent, so the rank is exactly 2.</div><div class=\"ml-vi\">Hạng $\\lt3$ đòi hỏi $\\det=0$: $-1(3a+20)-4(2a+6)+5(20-9)=-11a+11=0\\Rightarrow a=1$. Hai hàng đầu vẫn độc lập nên hạng đúng bằng 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve the system of linear equations $\\begin{cases}3x+y+z=9\\\\x-y+z=3\\end{cases}$|||Giải hệ phương trình tuyến tính $\\begin{cases}3x+y+z=9\\\\x-y+z=3\\end{cases}$",
          "options": [
            {
              "text": "$(3+z/2,\\ z/2,\\ z)$|||$(3+z/2,\\ z/2,\\ z)$"
            },
            {
              "text": "$(3-2z,\\ 2z,\\ z)$|||$(3-2z,\\ 2z,\\ z)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$(3-z/2,\\ z/2,\\ z)$|||$(3-z/2,\\ z/2,\\ z)$"
            },
            {
              "text": "$(3+2z,\\ z/2,\\ z)$|||$(3+2z,\\ z/2,\\ z)$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Adding the equations: $4x+2z=12\\Rightarrow x=3-\\dfrac{z}{2}$. Substituting into the second: $y=x+z-3=\\dfrac{z}{2}$. So the solution set is $\\left(3-\\dfrac z2,\\ \\dfrac z2,\\ z\\right)$.</div><div class=\"ml-vi\">Cộng hai phương trình: $4x+2z=12\\Rightarrow x=3-\\dfrac{z}{2}$. Thế vào phương trình thứ hai: $y=x+z-3=\\dfrac{z}{2}$. Vậy nghiệm là $\\left(3-\\dfrac z2,\\ \\dfrac z2,\\ z\\right)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the solution of the following system of linear equations $\\begin{cases}x+2y-3z=-1\\\\x+5z=5\\\\2x-4y+5z=1\\end{cases}$|||Tìm nghiệm của hệ phương trình tuyến tính $\\begin{cases}x+2y-3z=-1\\\\x+5z=5\\\\2x-4y+5z=1\\end{cases}$",
          "options": [
            {
              "text": "$(0,1,1)$|||$(0,1,1)$"
            },
            {
              "text": "$(1,0,1)$|||$(1,0,1)$"
            },
            {
              "text": "$(1,1,0)$|||$(1,1,0)$"
            },
            {
              "text": "No solution|||Vô nghiệm"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">From the second equation $x=5-5z$; the first gives $y=-3+4z$. Substituting into the third: $2(5-5z)-4(-3+4z)+5z=22-21z=1\\Rightarrow z=1$, hence $x=0$, $y=1$.</div><div class=\"ml-vi\">Từ phương trình thứ hai $x=5-5z$; phương trình đầu cho $y=-3+4z$. Thế vào phương trình thứ ba: $2(5-5z)-4(-3+4z)+5z=22-21z=1\\Rightarrow z=1$, suy ra $x=0$, $y=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider a homogeneous system of linear equations of 5 equations and in 8 variables. Assume that the row-echelon form of the coefficient matrix has a row of zeros. How many solutions would it have?|||Xét hệ phương trình tuyến tính thuần nhất gồm 5 phương trình với 8 ẩn. Giả sử dạng bậc thang của ma trận hệ số có một hàng không. Hệ có bao nhiêu nghiệm?",
          "options": [
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
            },
            {
              "text": "Infinitely many solutions|||Vô số nghiệm"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">A homogeneous system is always consistent, and here the rank is at most 4 while there are 8 unknowns, leaving at least 4 free variables → infinitely many solutions.</div><div class=\"ml-vi\">Hệ thuần nhất luôn tương thích, và ở đây hạng nhiều nhất bằng 4 trong khi có 8 ẩn nên còn ít nhất 4 ẩn tự do → vô số nghiệm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x=\\begin{bmatrix}2\\\\1\\end{bmatrix}$ and $y=\\begin{bmatrix}4\\\\3\\end{bmatrix}$. Assume that $2x+z=5y$. Find $z$.<br>(i) $\\begin{bmatrix}24\\\\17\\end{bmatrix}$ (ii) $\\begin{bmatrix}-24\\\\-17\\end{bmatrix}$ (iii) $\\begin{bmatrix}-16\\\\-13\\end{bmatrix}$ (iv) $\\begin{bmatrix}16\\\\13\\end{bmatrix}$|||Cho $x=\\begin{bmatrix}2\\\\1\\end{bmatrix}$ và $y=\\begin{bmatrix}4\\\\3\\end{bmatrix}$. Giả sử $2x+z=5y$. Tìm $z$.<br>(i) $\\begin{bmatrix}24\\\\17\\end{bmatrix}$ (ii) $\\begin{bmatrix}-24\\\\-17\\end{bmatrix}$ (iii) $\\begin{bmatrix}-16\\\\-13\\end{bmatrix}$ (iv) $\\begin{bmatrix}16\\\\13\\end{bmatrix}$",
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
          "explanation": "<div class=\"ml-en\">$z=5y-2x=\\begin{bmatrix}20\\\\15\\end{bmatrix}-\\begin{bmatrix}4\\\\2\\end{bmatrix}=\\begin{bmatrix}16\\\\13\\end{bmatrix}$ — (iv).</div><div class=\"ml-vi\">$z=5y-2x=\\begin{bmatrix}20\\\\15\\end{bmatrix}-\\begin{bmatrix}4\\\\2\\end{bmatrix}=\\begin{bmatrix}16\\\\13\\end{bmatrix}$ — (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute $Ax$ where $A=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$ and $x=[x_1\\ \\ x_2]^{T}$.<br>(i) $[x_1-x_2\\ \\ \\ x_2]^{T}$ (ii) $[x_1\\ \\ \\ -x_1+x_2]^{T}$ (iii) $[x_2\\ \\ \\ x_1-x_2]^{T}$ (iv) $[-x_1+x_2\\ \\ \\ x_1]^{T}$|||Tính $Ax$ với $A=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$ và $x=[x_1\\ \\ x_2]^{T}$.<br>(i) $[x_1-x_2\\ \\ \\ x_2]^{T}$ (ii) $[x_1\\ \\ \\ -x_1+x_2]^{T}$ (iii) $[x_2\\ \\ \\ x_1-x_2]^{T}$ (iv) $[-x_1+x_2\\ \\ \\ x_1]^{T}$",
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
          "explanation": "<div class=\"ml-en\">Row by row: first entry $1\\cdot x_1+(-1)x_2=x_1-x_2$, second entry $0\\cdot x_1+1\\cdot x_2=x_2$ — (i).</div><div class=\"ml-vi\">Nhân theo hàng: phần tử đầu $1\\cdot x_1+(-1)x_2=x_1-x_2$, phần tử sau $0\\cdot x_1+1\\cdot x_2=x_2$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&1\\\\-1&1\\end{bmatrix}$. Find the $(1,2)$-entry of $A(2A^{T}-I_2)$.|||Cho $A=\\begin{bmatrix}1&1\\\\-1&1\\end{bmatrix}$. Tìm phần tử $(1,2)$ của $A(2A^{T}-I_2)$.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$A^{T}=\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}$, so $2A^{T}-I=\\begin{bmatrix}1&-2\\\\2&1\\end{bmatrix}$ and $A(2A^{T}-I)=\\begin{bmatrix}3&-1\\\\1&3\\end{bmatrix}$. The $(1,2)$-entry is $-1$.</div><div class=\"ml-vi\">$A^{T}=\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}$ nên $2A^{T}-I=\\begin{bmatrix}1&-2\\\\2&1\\end{bmatrix}$ và $A(2A^{T}-I)=\\begin{bmatrix}3&-1\\\\1&3\\end{bmatrix}$. Phần tử $(1,2)$ bằng $-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be an invertible matrix such that $A^{-1}=\\begin{bmatrix}1&2&-1\\\\0&1&2\\\\3&0&1\\end{bmatrix}$. Find the $(2,3)$-entry of the matrix $(3A^{T})^{-1}$.|||Cho $A$ khả nghịch với $A^{-1}=\\begin{bmatrix}1&2&-1\\\\0&1&2\\\\3&0&1\\end{bmatrix}$. Tìm phần tử $(2,3)$ của ma trận $(3A^{T})^{-1}$.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "-2/3|||-2/3"
            },
            {
              "text": "2/3|||2/3"
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
          "explanation": "<div class=\"ml-en\">$(3A^{T})^{-1}=\\dfrac13(A^{T})^{-1}=\\dfrac13(A^{-1})^{T}$. The $(2,3)$-entry of $(A^{-1})^{T}$ is the $(3,2)$-entry of $A^{-1}$, which is $0$; hence the answer is $0$.</div><div class=\"ml-vi\">$(3A^{T})^{-1}=\\dfrac13(A^{T})^{-1}=\\dfrac13(A^{-1})^{T}$. Phần tử $(2,3)$ của $(A^{-1})^{T}$ chính là phần tử $(3,2)$ của $A^{-1}$, bằng $0$; nên đáp án là $0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ is rotation through $2\\pi/3$, then $T\\begin{bmatrix}2\\\\-6\\end{bmatrix}$ is:<br>(i) $\\begin{bmatrix}3\\sqrt3-1\\\\\\sqrt3+3\\end{bmatrix}$ (ii) $\\begin{bmatrix}1-3\\sqrt3\\\\\\sqrt3-3\\end{bmatrix}$ (iii) $\\begin{bmatrix}\\sqrt3\\\\2\\end{bmatrix}$ (iv) $\\begin{bmatrix}3\\sqrt3-1\\\\3-\\sqrt3\\end{bmatrix}$|||Nếu $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép quay góc $2\\pi/3$ thì $T\\begin{bmatrix}2\\\\-6\\end{bmatrix}$ bằng:<br>(i) $\\begin{bmatrix}3\\sqrt3-1\\\\\\sqrt3+3\\end{bmatrix}$ (ii) $\\begin{bmatrix}1-3\\sqrt3\\\\\\sqrt3-3\\end{bmatrix}$ (iii) $\\begin{bmatrix}\\sqrt3\\\\2\\end{bmatrix}$ (iv) $\\begin{bmatrix}3\\sqrt3-1\\\\3-\\sqrt3\\end{bmatrix}$",
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
          "explanation": "<div class=\"ml-en\">With $\\cos\\dfrac{2\\pi}{3}=-\\dfrac12$, $\\sin\\dfrac{2\\pi}{3}=\\dfrac{\\sqrt3}{2}$: $x'=-\\dfrac12(2)-\\dfrac{\\sqrt3}{2}(-6)=3\\sqrt3-1$ and $y'=\\dfrac{\\sqrt3}{2}(2)-\\dfrac12(-6)=\\sqrt3+3$ — (i).</div><div class=\"ml-vi\">Với $\\cos\\dfrac{2\\pi}{3}=-\\dfrac12$, $\\sin\\dfrac{2\\pi}{3}=\\dfrac{\\sqrt3}{2}$: $x'=-\\dfrac12(2)-\\dfrac{\\sqrt3}{2}(-6)=3\\sqrt3-1$ và $y'=\\dfrac{\\sqrt3}{2}(2)-\\dfrac12(-6)=\\sqrt3+3$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be the rotation through $\\pi$ followed by reflection in the X axis. Then $T$ is:|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép quay góc $\\pi$ rồi đối xứng qua trục Ox. Khi đó $T$ là:",
          "options": [
            {
              "text": "Reflection in the y-axis.|||Đối xứng qua trục Oy."
            },
            {
              "text": "Projection in the y-axis.|||Chiếu lên trục Oy."
            },
            {
              "text": "Reflection about $y=x$.|||Đối xứng qua $y=x$."
            },
            {
              "text": "Projection about $y=x$|||Chiếu lên $y=x$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Rotation by $\\pi$ maps $(x,y)\\mapsto(-x,-y)$; reflecting in the $x$-axis then gives $(-x,y)$ — that is reflection in the $y$-axis.</div><div class=\"ml-vi\">Phép quay góc $\\pi$ biến $(x,y)\\mapsto(-x,-y)$; sau đó đối xứng qua trục $Ox$ cho $(-x,y)$ — chính là phép đối xứng qua trục $Oy$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the determinant of the matrix $\\begin{bmatrix}1+a&a&a\\\\b&1+b&b\\\\c&c&1+c\\end{bmatrix}$|||Tính định thức của ma trận $\\begin{bmatrix}1+a&a&a\\\\b&1+b&b\\\\c&c&1+c\\end{bmatrix}$",
          "options": [
            {
              "text": "$(a+b+c)/2$|||$(a+b+c)/2$"
            },
            {
              "text": "$abc$|||$abc$"
            },
            {
              "text": "$1+a+b+c$|||$1+a+b+c$"
            },
            {
              "text": "$1-abc$|||$1-abc$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The matrix is $I+uv^{T}$ with $u=(a,b,c)^{T}$ and $v=(1,1,1)^{T}$, so $\\det=1+v^{T}u=1+a+b+c$. (Directly: add columns 2 and 3 to column 1 and factor.)</div><div class=\"ml-vi\">Ma trận có dạng $I+uv^{T}$ với $u=(a,b,c)^{T}$ và $v=(1,1,1)^{T}$ nên $\\det=1+v^{T}u=1+a+b+c$. (Cách khác: cộng cột 2 và 3 vào cột 1 rồi đặt nhân tử chung.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given $A=\\begin{pmatrix}2&3&1\\\\2&-1&2\\\\3&4&-2\\end{pmatrix}$, find the first row of the adjugate matrix of $A$.|||Cho $A=\\begin{pmatrix}2&3&1\\\\2&-1&2\\\\3&4&-2\\end{pmatrix}$, tìm hàng đầu của ma trận phụ hợp (adjugate) của $A$.",
          "options": [
            {
              "text": "$[-6\\ \\ 10\\ \\ 7]$|||$[-6\\ \\ 10\\ \\ 7]$"
            },
            {
              "text": "$[-6\\ \\ -10\\ \\ 7]$|||$[-6\\ \\ -10\\ \\ 7]$"
            },
            {
              "text": "$[-6\\ \\ 10\\ \\ -7]$|||$[-6\\ \\ 10\\ \\ -7]$"
            },
            {
              "text": "$[6\\ \\ 10\\ \\ 7]$|||$[6\\ \\ 10\\ \\ 7]$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\operatorname{adj}(A)=C^{T}$, so its first row consists of $C_{11},C_{21},C_{31}$: $C_{11}=\\det\\begin{bmatrix}-1&2\\\\4&-2\\end{bmatrix}=-6$, $C_{21}=-\\det\\begin{bmatrix}3&1\\\\4&-2\\end{bmatrix}=10$, $C_{31}=\\det\\begin{bmatrix}3&1\\\\-1&2\\end{bmatrix}=7$.</div><div class=\"ml-vi\">$\\operatorname{adj}(A)=C^{T}$ nên hàng đầu gồm $C_{11},C_{21},C_{31}$: $C_{11}=\\det\\begin{bmatrix}-1&2\\\\4&-2\\end{bmatrix}=-6$, $C_{21}=-\\det\\begin{bmatrix}3&1\\\\4&-2\\end{bmatrix}=10$, $C_{31}=\\det\\begin{bmatrix}3&1\\\\-1&2\\end{bmatrix}=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the first column of the adjugate matrix of $A=\\begin{pmatrix}a&b&c\\\\2&-1&2\\\\3&4&-2\\end{pmatrix}$, ($a,b,c$ are real numbers)<br>(i) $\\begin{pmatrix}-6\\\\10\\\\11\\end{pmatrix}$ (ii) $\\begin{pmatrix}-6\\\\-a\\\\-11\\end{pmatrix}$ (iii) $\\begin{pmatrix}b\\\\10\\\\11\\end{pmatrix}$|||Tìm cột đầu của ma trận phụ hợp (adjugate) của $A=\\begin{pmatrix}a&b&c\\\\2&-1&2\\\\3&4&-2\\end{pmatrix}$, ($a,b,c$ là số thực)<br>(i) $\\begin{pmatrix}-6\\\\10\\\\11\\end{pmatrix}$ (ii) $\\begin{pmatrix}-6\\\\-a\\\\-11\\end{pmatrix}$ (iii) $\\begin{pmatrix}b\\\\10\\\\11\\end{pmatrix}$",
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
          "explanation": "<div class=\"ml-en\">The first column of $\\operatorname{adj}(A)=C^{T}$ is $(C_{11},C_{12},C_{13})$, all computed from rows 2 and 3 only: $C_{11}=\\det\\begin{bmatrix}-1&2\\\\4&-2\\end{bmatrix}=-6$, $C_{12}=-\\det\\begin{bmatrix}2&2\\\\3&-2\\end{bmatrix}=10$, $C_{13}=\\det\\begin{bmatrix}2&-1\\\\3&4\\end{bmatrix}=11$ — independent of $a,b,c$.</div><div class=\"ml-vi\">Cột đầu của $\\operatorname{adj}(A)=C^{T}$ là $(C_{11},C_{12},C_{13})$, đều chỉ tính từ hàng 2 và 3: $C_{11}=\\det\\begin{bmatrix}-1&2\\\\4&-2\\end{bmatrix}=-6$, $C_{12}=-\\det\\begin{bmatrix}2&2\\\\3&-2\\end{bmatrix}=10$, $C_{13}=\\det\\begin{bmatrix}2&-1\\\\3&4\\end{bmatrix}=11$ — không phụ thuộc $a,b,c$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that -5 is an eigenvalue for the matrix $\\begin{bmatrix}3&-6\\\\8&-11\\end{bmatrix}$. Find all eigenvectors corresponding to this eigenvalue.|||Biết $-5$ là một trị riêng của ma trận $\\begin{bmatrix}3&-6\\\\8&-11\\end{bmatrix}$. Tìm tất cả vectơ riêng ứng với trị riêng này.",
          "options": [
            {
              "text": "$t[3,-4]$, $t\\neq0$|||$t[3,-4]$, $t\\neq0$"
            },
            {
              "text": "$t[-4,3]$, $t\\neq0$|||$t[-4,3]$, $t\\neq0$"
            },
            {
              "text": "$t[4,3]$, $t\\neq0$|||$t[4,3]$, $t\\neq0$"
            },
            {
              "text": "$t[3,4]$, $t\\neq0$|||$t[3,4]$, $t\\neq0$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$A+5I=\\begin{bmatrix}8&-6\\\\8&-6\\end{bmatrix}$, so $8x=6y\\Rightarrow\\dfrac{x}{y}=\\dfrac34$: the eigenvectors are $t[3,4]$, $t\\neq0$.</div><div class=\"ml-vi\">$A+5I=\\begin{bmatrix}8&-6\\\\8&-6\\end{bmatrix}$ nên $8x=6y\\Rightarrow\\dfrac{x}{y}=\\dfrac34$: các vectơ riêng là $t[3,4]$, $t\\neq0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}2&-4\\\\-1&-1\\end{bmatrix}$. Find a diagonal form $D$ of the matrix $A$ (if exists)<br>(i) $\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$ (ii) $\\begin{bmatrix}2&0\\\\0&-3\\end{bmatrix}$ (iii) $\\begin{bmatrix}-2&0\\\\0&3\\end{bmatrix}$|||Cho $A=\\begin{bmatrix}2&-4\\\\-1&-1\\end{bmatrix}$. Tìm dạng chéo $D$ của ma trận $A$ (nếu tồn tại)<br>(i) $\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$ (ii) $\\begin{bmatrix}2&0\\\\0&-3\\end{bmatrix}$ (iii) $\\begin{bmatrix}-2&0\\\\0&3\\end{bmatrix}$",
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
          "explanation": "<div class=\"ml-en\">Characteristic equation: $(2-\\lambda)(-1-\\lambda)-4=\\lambda^2-\\lambda-6=0\\Rightarrow\\lambda=3,\\ -2$. The diagonal form therefore has entries $-2$ and $3$ — (iii).</div><div class=\"ml-vi\">Phương trình đặc trưng: $(2-\\lambda)(-1-\\lambda)-4=\\lambda^2-\\lambda-6=0\\Rightarrow\\lambda=3,\\ -2$. Vậy dạng chéo gồm $-2$ và $3$ — (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A(3,-1,-1)$, $B(1,-2,0)$, $C(1,-1,2)$ be three vertices of the parallelogram with two adjacent sides $AB$ and $AC$. Find the fourth vertex.|||Cho $A(3,-1,-1)$, $B(1,-2,0)$, $C(1,-1,2)$ là ba đỉnh của hình bình hành với hai cạnh kề $AB$ và $AC$. Tìm đỉnh thứ tư.",
          "options": [
            {
              "text": "$(-1,2,3)$|||$(-1,2,3)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$(-1,-2,-3)$|||$(-1,-2,-3)$"
            },
            {
              "text": "$(1,-2,3)$|||$(1,-2,3)$"
            },
            {
              "text": "$(-1,-2,3)$|||$(-1,-2,3)$"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">With $AB$ and $AC$ adjacent, the fourth vertex is $D=B+C-A=(1+1-3,\\ -2-1+1,\\ 0+2+1)=(-1,-2,3)$.</div><div class=\"ml-vi\">Vì $AB$ và $AC$ là hai cạnh kề nên đỉnh thứ tư là $D=B+C-A=(1+1-3,\\ -2-1+1,\\ 0+2+1)=(-1,-2,3)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $Q(a,b,c)$ be the point on the plane with equation $x+y+z=1$ that is closest to the point $P(1,0,3)$. Find $b$.|||Gọi $Q(a,b,c)$ là điểm trên mặt phẳng $x+y+z=1$ gần điểm $P(1,0,3)$ nhất. Tìm $b$.",
          "options": [
            {
              "text": "-1|||-1"
            },
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
              "text": "-2|||-2"
            },
            {
              "text": "None of the others|||Không phương án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The normal is $n=(1,1,1)$ with $\\|n\\|^2=3$. Since $P\\cdot n-1=4-1=3$, the parameter is $t=\\dfrac{3}{3}=1$ and $Q=P-tn=(0,-1,2)$, so $b=-1$.</div><div class=\"ml-vi\">Vectơ pháp tuyến $n=(1,1,1)$ với $\\|n\\|^2=3$. Vì $P\\cdot n-1=4-1=3$ nên $t=\\dfrac{3}{3}=1$ và $Q=P-tn=(0,-1,2)$, suy ra $b=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $(m)$ be the line through $A=(1,2,3)$ and parallel to the line joining $B=(-2,2,0)$ and $C=(4,-1,7)$. Let $(n)$ be the line joining $E=(1,-1,8)$ and $F=(10,-1,11)$. Then the lines $(m)$ and $(n)$ ______|||Cho $(m)$ là đường thẳng qua $A=(1,2,3)$ và song song với đường thẳng nối $B=(-2,2,0)$ và $C=(4,-1,7)$. Cho $(n)$ là đường thẳng nối $E=(1,-1,8)$ và $F=(10,-1,11)$. Khi đó hai đường thẳng $(m)$ và $(n)$ ______",
          "options": [
            {
              "text": "are parallel but not the same|||song song nhưng không trùng nhau"
            },
            {
              "text": "are the same|||trùng nhau"
            },
            {
              "text": "are orthogonal|||vuông góc"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Direction of $(m)$: $C-B=(6,-3,7)$; direction of $(n)$: $F-E=(9,0,3)$. They are not proportional (not parallel) and their dot product is $54+0+21=75\\neq0$ (not orthogonal), so none of the listed relations holds.</div><div class=\"ml-vi\">Vectơ chỉ phương của $(m)$: $C-B=(6,-3,7)$; của $(n)$: $F-E=(9,0,3)$. Hai vectơ không tỉ lệ (không song song) và tích vô hướng bằng $54+0+21=75\\neq0$ (không vuông góc), nên không quan hệ nào được liệt kê là đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The triangle with vertices $(-3,0,2)$, $(6,1,4)$, $(-5,1,0)$ has area<br>(i) $\\dfrac12\\sqrt{333}$ (ii) $\\dfrac12\\sqrt{33}$ (iii) $\\dfrac12\\sqrt{331}$ (iv) $\\dfrac12\\sqrt{3}$|||Tam giác với các đỉnh $(-3,0,2)$, $(6,1,4)$, $(-5,1,0)$ có diện tích<br>(i) $\\dfrac12\\sqrt{333}$ (ii) $\\dfrac12\\sqrt{33}$ (iii) $\\dfrac12\\sqrt{331}$ (iv) $\\dfrac12\\sqrt{3}$",
          "options": [
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
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$u=(9,1,2)$, $v=(-2,1,-2)$ and $u\\times v=(-4,14,11)$ with $\\|u\\times v\\|^2=16+196+121=333$. Area $=\\dfrac12\\sqrt{333}$ — (i).</div><div class=\"ml-vi\">$u=(9,1,2)$, $v=(-2,1,-2)$ và $u\\times v=(-4,14,11)$ với $\\|u\\times v\\|^2=16+196+121=333$. Diện tích $=\\dfrac12\\sqrt{333}$ — (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the projection of $v=[0;\\ 1;\\ -3]$ on the plane with equation $x-y+4z=0$.|||Tìm hình chiếu của $v=[0;\\ 1;\\ -3]$ lên mặt phẳng $x-y+4z=0$.",
          "options": [
            {
              "text": "$[13/18;\\ -5/18;\\ -1/9]$|||$[13/18;\\ -5/18;\\ -1/9]$"
            },
            {
              "text": "$[-13/18;\\ 5/18;\\ -1/9]$|||$[-13/18;\\ 5/18;\\ -1/9]$"
            },
            {
              "text": "$[13/18;\\ 5/18;\\ 1/9]$|||$[13/18;\\ 5/18;\\ 1/9]$"
            },
            {
              "text": "$[13/18;\\ 5/18;\\ -1/9]$|||$[13/18;\\ 5/18;\\ -1/9]$"
            },
            {
              "text": "None of other choices is correct|||Không phương án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">With $n=(1,-1,4)$, $\\|n\\|^2=18$ and $v\\cdot n=-13$: $\\operatorname{proj}_n v=-\\dfrac{13}{18}(1,-1,4)$. The projection onto the plane is $v-\\operatorname{proj}_n v=\\left(\\dfrac{13}{18},\\ \\dfrac{5}{18},\\ -\\dfrac19\\right)$.</div><div class=\"ml-vi\">Với $n=(1,-1,4)$, $\\|n\\|^2=18$ và $v\\cdot n=-13$: $\\operatorname{proj}_n v=-\\dfrac{13}{18}(1,-1,4)$. Hình chiếu lên mặt phẳng là $v-\\operatorname{proj}_n v=\\left(\\dfrac{13}{18},\\ \\dfrac{5}{18},\\ -\\dfrac19\\right)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of $t$ for which $(4,6,t)$ is a linear combination of the vectors $(1,3,1)$, $(2,8,-1)$|||Tìm giá trị $t$ để $(4,6,t)$ là tổ hợp tuyến tính của các vectơ $(1,3,1)$, $(2,8,-1)$",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "11|||11"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Solve $a(1,3,1)+b(2,8,-1)=(4,6,t)$: $a+2b=4$ and $3a+8b=6$ give $a=10$, $b=-3$; then $t=a-b=13$.</div><div class=\"ml-vi\">Giải $a(1,3,1)+b(2,8,-1)=(4,6,t)$: từ $a+2b=4$ và $3a+8b=6$ được $a=10$, $b=-3$; suy ra $t=a-b=13$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all real numbers $a$ such that the vector $X=(1,2,a)$ lies in the subspace $U=\\operatorname{span}\\{(1,0,2),\\ (-1,1,0)\\}$.|||Tìm tất cả số thực $a$ để vectơ $X=(1,2,a)$ thuộc không gian con $U=\\operatorname{span}\\{(1,0,2),\\ (-1,1,0)\\}$.",
          "options": [
            {
              "text": "$a=1$|||$a=1$"
            },
            {
              "text": "$a=6$|||$a=6$"
            },
            {
              "text": "$a=2$|||$a=2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$c(1,0,2)+d(-1,1,0)=(c-d,\\ d,\\ 2c)$. Matching: $d=2$ and $c-d=1\\Rightarrow c=3$, hence $a=2c=6$.</div><div class=\"ml-vi\">$c(1,0,2)+d(-1,1,0)=(c-d,\\ d,\\ 2c)$. Đồng nhất: $d=2$ và $c-d=1\\Rightarrow c=3$, suy ra $a=2c=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following subsets are independent in $\\mathbb{R}^4$?<br>(i) $\\{[1\\ 2\\ 3\\ 4]^{T},\\ [2\\ 0\\ 1\\ -1]^{T},\\ [1\\ -1\\ 0\\ 3]^{T}\\}$ (ii) $\\{[2\\ 0\\ 1\\ -1]^{T},\\ [1\\ 2\\ -1\\ 1]^{T},\\ [3\\ 2\\ 0\\ 0]^{T}\\}$|||Tập con nào sau đây độc lập tuyến tính trong $\\mathbb{R}^4$?<br>(i) $\\{[1\\ 2\\ 3\\ 4]^{T},\\ [2\\ 0\\ 1\\ -1]^{T},\\ [1\\ -1\\ 0\\ 3]^{T}\\}$ (ii) $\\{[2\\ 0\\ 1\\ -1]^{T},\\ [1\\ 2\\ -1\\ 1]^{T},\\ [3\\ 2\\ 0\\ 0]^{T}\\}$",
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
          "explanation": "<div class=\"ml-en\">In (ii) the third vector is the sum of the first two, so that set is dependent. In (i) solving $\\alpha v_1+\\beta v_2+\\gamma v_3=0$ forces $\\alpha=\\beta=\\gamma=0$, so it is independent.</div><div class=\"ml-vi\">Ở (ii), vectơ thứ ba bằng tổng hai vectơ đầu nên tập này phụ thuộc. Ở (i), giải $\\alpha v_1+\\beta v_2+\\gamma v_3=0$ chỉ cho $\\alpha=\\beta=\\gamma=0$ nên tập độc lập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following subspace of $\\mathbb{R}^3$: $W=\\{(x,y,z)\\in\\mathbb{R}^3\\mid x+y-z=0,\\ 2x+2y+3z=0,\\ 3x+3y-2z=0\\}$. The dimension of $W$ is ______|||Xét không gian con của $\\mathbb{R}^3$: $W=\\{(x,y,z)\\in\\mathbb{R}^3\\mid x+y-z=0,\\ 2x+2y+3z=0,\\ 3x+3y-2z=0\\}$. Số chiều của $W$ là ______",
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
          "explanation": "<div class=\"ml-en\">From the first equation $z=x+y$; substituting into the second gives $5(x+y)=0\\Rightarrow x+y=0$, hence $z=0$ and $y=-x$ (the third equation is then automatic). The solution set is $\\{t(1,-1,0)\\}$, so $\\dim W=1$.</div><div class=\"ml-vi\">Từ phương trình đầu $z=x+y$; thế vào phương trình thứ hai được $5(x+y)=0\\Rightarrow x+y=0$, suy ra $z=0$ và $y=-x$ (phương trình thứ ba khi đó tự thoả). Tập nghiệm là $\\{t(1,-1,0)\\}$ nên $\\dim W=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all vectors $(a,b,c,d)$ such that the following set is orthogonal: $\\{(1,0,-1,1),\\ (2,1,1,-1),\\ (1,-3,1,0),\\ (a,b,c,d)\\}$|||Tìm tất cả vectơ $(a,b,c,d)$ để tập sau trực giao: $\\{(1,0,-1,1),\\ (2,1,1,-1),\\ (1,-3,1,0),\\ (a,b,c,d)\\}$",
          "options": [
            {
              "text": "$t(-1,2,10,13)+s(-1,0,7,8)$|||$t(-1,2,10,13)+s(-1,0,7,8)$"
            },
            {
              "text": "$t(-1,5,10,11)$|||$t(-1,5,10,11)$"
            },
            {
              "text": "$t(-1,2,10,13)+s(-2,0,-6,8)$|||$t(-1,2,10,13)+s(-2,0,-6,8)$"
            },
            {
              "text": "$t(-1,3,10,11)$|||$t(-1,3,10,11)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The three conditions are $a-c+d=0$, $2a+b+c-d=0$, $a-3b+c=0$. From the first two, $b=-3a$; the third then gives $c=-10a$ and $d=c-a=-11a$. So $(a,b,c,d)=a(1,-3,-10,-11)=t(-1,3,10,11)$.</div><div class=\"ml-vi\">Ba điều kiện là $a-c+d=0$, $2a+b+c-d=0$, $a-3b+c=0$. Từ hai phương trình đầu, $b=-3a$; phương trình thứ ba cho $c=-10a$ và $d=c-a=-11a$. Vậy $(a,b,c,d)=a(1,-3,-10,-11)=t(-1,3,10,11)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\operatorname{span}\\{[1,0,10],\\ [0,1,15],\\ [1,1,25]\\}$. Find $\\dim U$.|||Cho $U=\\operatorname{span}\\{[1,0,10],\\ [0,1,15],\\ [1,1,25]\\}$. Tìm $\\dim U$.",
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
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The third vector is the sum of the first two, so the spanning set reduces to two independent vectors: $\\dim U=2$.</div><div class=\"ml-vi\">Vectơ thứ ba bằng tổng hai vectơ đầu nên hệ sinh rút gọn còn hai vectơ độc lập: $\\dim U=2$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D7",
      "source": "REAL",
      "sortOrder": 6,
      "title": "Đề 7 — FA25 Final Exam|||Đề 7 — Thi cuối kỳ FA25",
      "description": "MAE101 real FE multiple-choice paper (Fall 2025), transcribed from the exam images; answers reasoned here. (50 questions)|||Đề trắc nghiệm FE thật môn MAE101 (kỳ Thu 2025), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (50 câu)",
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
          "prompt": "Find the range of the function $f(x)=x^4+2x^2+1$.<br>(i) $(0,\\infty)$ (ii) $[0,\\infty)$ (iii) $(1,\\infty)$ (iv) $[1,\\infty)$|||Tìm tập giá trị của hàm số $f(x)=x^4+2x^2+1$.<br>(i) $(0,\\infty)$ (ii) $[0,\\infty)$ (iii) $(1,\\infty)$ (iv) $[1,\\infty)$",
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
          "explanation": "<div class=\"ml-en\">$f(x)=(x^2+1)^2\\geq1$ and equals $1$ at $x=0$; as $x\\to\\pm\\infty$, $f\\to\\infty$. Hence the range is $[1,\\infty)$, i.e. (iv).</div><div class=\"ml-vi\">$f(x)=(x^2+1)^2\\geq1$, dấu bằng tại $x=0$; khi $x\\to\\pm\\infty$ thì $f\\to\\infty$. Vậy tập giá trị là $[1,\\infty)$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Describe how the graph of $y=f(x-2)+3$ is obtained from the graph of $y=f(x)$.|||Mô tả cách nhận được đồ thị $y=f(x-2)+3$ từ đồ thị $y=f(x)$.",
          "options": [
            {
              "text": "Shift 2 units to the right then shift 3 units up.|||Tịnh tiến sang phải 2 đơn vị rồi lên trên 3 đơn vị."
            },
            {
              "text": "Shift 2 units to the left then shift 3 units up.|||Tịnh tiến sang trái 2 đơn vị rồi lên trên 3 đơn vị."
            },
            {
              "text": "Shift 2 units to the right then shift 3 units down.|||Tịnh tiến sang phải 2 đơn vị rồi xuống dưới 3 đơn vị."
            },
            {
              "text": "Shift 2 units to the left then shift 3 units down.|||Tịnh tiến sang trái 2 đơn vị rồi xuống dưới 3 đơn vị."
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Replacing $x$ by $x-2$ shifts the graph 2 units to the right; adding $3$ shifts it 3 units up.</div><div class=\"ml-vi\">Thay $x$ bởi $x-2$ làm đồ thị dịch sang PHẢI 2 đơn vị; cộng thêm $3$ làm đồ thị dịch LÊN 3 đơn vị.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $1\\leq f(x)\\leq x^2+6x-6$ for all $x$, find the limit $\\displaystyle\\lim_{x\\to1}f(x)$.|||Nếu $1\\leq f(x)\\leq x^2+6x-6$ với mọi $x$, hãy tìm giới hạn $\\displaystyle\\lim_{x\\to1}f(x)$.",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">At $x=1$ the upper bound equals $1+6-6=1$, the lower bound is $1$. By the Squeeze Theorem $\\lim_{x\\to1}f(x)=1$.</div><div class=\"ml-vi\">Tại $x=1$, cận trên bằng $1+6-6=1$, cận dưới bằng $1$. Theo định lý kẹp, $\\lim_{x\\to1}f(x)=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the function $f(x)=\\begin{cases}1, & 0\\leq x\\lt1\\\\ x^2, & x\\in(-\\infty,0)\\cup[1,+\\infty)\\end{cases}$ Choose the correct statement.|||Cho hàm số $f(x)=\\begin{cases}1, & 0\\leq x\\lt1\\\\ x^2, & x\\in(-\\infty,0)\\cup[1,+\\infty)\\end{cases}$ Chọn phát biểu đúng.",
          "options": [
            {
              "text": "$f$ is continuous on $\\mathbb{R}$|||$f$ liên tục trên $\\mathbb{R}$"
            },
            {
              "text": "$f$ is discontinuous at 0, and $f$ is continuous at 1|||$f$ gián đoạn tại 0 và liên tục tại 1"
            },
            {
              "text": "$f$ is discontinuous at 1, and $f$ is continuous at 0|||$f$ gián đoạn tại 1 và liên tục tại 0"
            },
            {
              "text": "$f$ is discontinuous at 0 and at 1|||$f$ gián đoạn tại cả 0 và 1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">At $x=0$: $\\lim_{x\\to0^-}f=0^2=0$ but $f(0)=1=\\lim_{x\\to0^+}f$, so $f$ is discontinuous at $0$. At $x=1$: $\\lim_{x\\to1^-}f=1$, $f(1)=1^2=1$, $\\lim_{x\\to1^+}f=1$, so $f$ is continuous at $1$.</div><div class=\"ml-vi\">Tại $x=0$: $\\lim_{x\\to0^-}f=0^2=0$ nhưng $f(0)=1=\\lim_{x\\to0^+}f$ nên $f$ GIÁN ĐOẠN tại $0$. Tại $x=1$: $\\lim_{x\\to1^-}f=1$, $f(1)=1^2=1$, $\\lim_{x\\to1^+}f=1$ nên $f$ LIÊN TỤC tại $1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The graph of $f(x)$ is given (the curve has a vertical asymptote at $x=0$ and a sharp corner/peak at $x=3$). State the numbers at which $f(x)$ is <u>not</u> differentiable.|||Cho đồ thị hàm $f(x)$ (đồ thị có tiệm cận đứng tại $x=0$ và một điểm gãy nhọn tại $x=3$). Hãy nêu các giá trị mà tại đó $f(x)$ <u>không</u> khả vi.",
          "options": [
            {
              "text": "0; 3|||0; 3"
            },
            {
              "text": "0; 1; 3; 4|||0; 1; 3; 4"
            },
            {
              "text": "0; 2; 4|||0; 2; 4"
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
          "explanation": "<div class=\"ml-en\">A function is not differentiable where it is not continuous (the vertical asymptote at $x=0$) and where the graph has a sharp corner (the peak at $x=3$). Hence $x=0$ and $x=3$.</div><div class=\"ml-vi\">Hàm không khả vi tại nơi không liên tục (tiệm cận đứng $x=0$) và tại điểm gãy nhọn (đỉnh nhọn $x=3$). Vậy $x=0$ và $x=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "State the domain of the derivative of the function $f(x)=\\sqrt{x}$.<br>(i) $(-\\infty,\\infty)$ (ii) $[0,\\infty)$ (iii) $(-\\infty,\\infty)\\setminus\\{0\\}$ (iv) $(0,\\infty)$|||Hãy nêu tập xác định của đạo hàm của hàm số $f(x)=\\sqrt{x}$.<br>(i) $(-\\infty,\\infty)$ (ii) $[0,\\infty)$ (iii) $(-\\infty,\\infty)\\setminus\\{0\\}$ (iv) $(0,\\infty)$",
          "options": [
            {
              "text": "None of them|||Không cái nào"
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
            4
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=\\dfrac{1}{2\\sqrt{x}}$, which requires $x\\gt0$ (at $x=0$ the one-sided derivative is infinite). Domain: $(0,\\infty)$, i.e. (iv).</div><div class=\"ml-vi\">$f'(x)=\\dfrac{1}{2\\sqrt{x}}$, đòi hỏi $x\\gt0$ (tại $x=0$ đạo hàm một phía vô hạn). Tập xác định: $(0,\\infty)$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ball is thrown upward such that its height (in meters) after $t$ seconds takes the form $h(t)=1+25t+at^2$. Assume that the velocity of the ball at time $t=2$ is 5 m/s. Find $a$.|||Một quả bóng được ném lên sao cho độ cao (mét) sau $t$ giây có dạng $h(t)=1+25t+at^2$. Giả sử vận tốc của quả bóng tại thời điểm $t=2$ là 5 m/s. Tìm $a$.",
          "options": [
            {
              "text": "-5|||-5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "-10|||-10"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$v(t)=h'(t)=25+2at$. From $v(2)=25+4a=5$ we get $4a=-20$, so $a=-5$.</div><div class=\"ml-vi\">$v(t)=h'(t)=25+2at$. Từ $v(2)=25+4a=5$ suy ra $4a=-20$, vậy $a=-5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\dfrac{d^4y}{dx^4}$ for $y=\\sqrt{x+2}$.<br>(i) $\\dfrac{-1}{16(x+2)^{3/2}}$ (ii) $\\dfrac{-15}{16(x+2)^{7/2}}$ (iii) $\\dfrac{-15}{16(x+2)^{5/2}}$ (iv) $\\dfrac{-1}{16(x+2)^{7/2}}$|||Tìm $\\dfrac{d^4y}{dx^4}$ với $y=\\sqrt{x+2}$.<br>(i) $\\dfrac{-1}{16(x+2)^{3/2}}$ (ii) $\\dfrac{-15}{16(x+2)^{7/2}}$ (iii) $\\dfrac{-15}{16(x+2)^{5/2}}$ (iv) $\\dfrac{-1}{16(x+2)^{7/2}}$",
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
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$y=(x+2)^{1/2}$, $y'=\\tfrac12(x+2)^{-1/2}$, $y''=-\\tfrac14(x+2)^{-3/2}$, $y'''=\\tfrac38(x+2)^{-5/2}$, $y^{(4)}=-\\tfrac{15}{16}(x+2)^{-7/2}=\\dfrac{-15}{16(x+2)^{7/2}}$, i.e. (ii).</div><div class=\"ml-vi\">$y=(x+2)^{1/2}$, $y'=\\tfrac12(x+2)^{-1/2}$, $y''=-\\tfrac14(x+2)^{-3/2}$, $y'''=\\tfrac38(x+2)^{-5/2}$, $y^{(4)}=-\\tfrac{15}{16}(x+2)^{-7/2}=\\dfrac{-15}{16(x+2)^{7/2}}$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $dy/dx$ by implicit differentiation: $9xy+2y-2=0$.<br>(i) $(-9y(x+1))/2$ (ii) $(-9y)/(9xy+2)$ (iii) $-9(x+y)/2$ (iv) $(-9y)/(9x+2)$|||Tìm $dy/dx$ bằng đạo hàm hàm ẩn: $9xy+2y-2=0$.<br>(i) $(-9y(x+1))/2$ (ii) $(-9y)/(9xy+2)$ (iii) $-9(x+y)/2$ (iv) $(-9y)/(9x+2)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
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
          "explanation": "<div class=\"ml-en\">Differentiate: $9y+9xy'+2y'=0\\Rightarrow y'(9x+2)=-9y\\Rightarrow y'=\\dfrac{-9y}{9x+2}$, i.e. (iv).</div><div class=\"ml-vi\">Lấy đạo hàm hai vế: $9y+9xy'+2y'=0\\Rightarrow y'(9x+2)=-9y\\Rightarrow y'=\\dfrac{-9y}{9x+2}$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If $x^2+y^2=4x$ and $dy/dt=6$, find $dx/dt$ at the point $(1,\\sqrt3)$.<br>(i) $6\\sqrt3$ (ii) $-6\\sqrt3$ (iii) $12\\sqrt3$ (iv) $-12\\sqrt3$|||Nếu $x^2+y^2=4x$ và $dy/dt=6$, hãy tìm $dx/dt$ tại điểm $(1,\\sqrt3)$.<br>(i) $6\\sqrt3$ (ii) $-6\\sqrt3$ (iii) $12\\sqrt3$ (iv) $-12\\sqrt3$",
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
          "explanation": "<div class=\"ml-en\">Differentiate with respect to $t$: $2x\\,x'+2y\\,y'=4x'\\Rightarrow x'(2x-4)=-2y\\,y'$. At $(1,\\sqrt3)$: $x'(2-4)=-2\\sqrt3(6)=-12\\sqrt3$, so $x'=6\\sqrt3$, i.e. (i).</div><div class=\"ml-vi\">Đạo hàm theo $t$: $2x\\,x'+2y\\,y'=4x'\\Rightarrow x'(2x-4)=-2y\\,y'$. Tại $(1,\\sqrt3)$: $x'(2-4)=-2\\sqrt3(6)=-12\\sqrt3$, suy ra $x'=6\\sqrt3$, tức (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The average value of $f(x)=x+1$ over the interval $[1,a]$ is 3. Find the number $a$.|||Giá trị trung bình của $f(x)=x+1$ trên đoạn $[1,a]$ bằng 3. Tìm số $a$.",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{1}{a-1}\\int_1^a(x+1)dx=\\dfrac{1}{a-1}\\left[\\dfrac{x^2}{2}+x\\right]_1^a=3$. This gives $a^2+2a-3=6a-6\\Rightarrow a^2-4a+3=0\\Rightarrow a=1$ or $a=3$; since $a\\gt1$, $a=3$.</div><div class=\"ml-vi\">$\\dfrac{1}{a-1}\\int_1^a(x+1)dx=\\dfrac{1}{a-1}\\left[\\dfrac{x^2}{2}+x\\right]_1^a=3$. Ta được $a^2+2a-3=6a-6\\Rightarrow a^2-4a+3=0\\Rightarrow a=1$ hoặc $a=3$; vì $a\\gt1$ nên $a=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute maximum and absolute minimum values of $f(x)=|x^2-1|$ on $[-2,1]$.|||Tìm giá trị lớn nhất và nhỏ nhất tuyệt đối của $f(x)=|x^2-1|$ trên $[-2,1]$.",
          "options": [
            {
              "text": "Absolute maximum value is 3 and absolute minimum is 0|||Giá trị lớn nhất là 3 và nhỏ nhất là 0"
            },
            {
              "text": "Absolute maximum value is 1 and absolute minimum is 0|||Giá trị lớn nhất là 1 và nhỏ nhất là 0"
            },
            {
              "text": "Absolute maximum value is 2 and absolute minimum is 0|||Giá trị lớn nhất là 2 và nhỏ nhất là 0"
            },
            {
              "text": "Absolute maximum value is 0 and absolute minimum is -1|||Giá trị lớn nhất là 0 và nhỏ nhất là -1"
            },
            {
              "text": "Absolute maximum value is 0 and absolute minimum is -2|||Giá trị lớn nhất là 0 và nhỏ nhất là -2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Candidates: $f(-2)=|4-1|=3$, $f(-1)=0$, $f(0)=1$, $f(1)=0$. Maximum $=3$, minimum $=0$.</div><div class=\"ml-vi\">Các điểm cần xét: $f(-2)=|4-1|=3$, $f(-1)=0$, $f(0)=1$, $f(1)=0$. Lớn nhất $=3$, nhỏ nhất $=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine where the function $f(x)=-x^3+10x+4$ is concave up and where it is concave down.<br>(i) Concave down on $(-\\infty,4)$, concave up on $(4,\\infty)$ (ii) Concave down on $(-\\infty,0)$, concave up on $(0,\\infty)$ (iii) Concave up on $(-\\infty,4)$, concave down on $(4,\\infty)$ (iv) Concave up on $(-\\infty,0)$, concave down on $(0,\\infty)$|||Xác định khoảng lồi/lõm của hàm số $f(x)=-x^3+10x+4$.<br>(i) Lõm xuống trên $(-\\infty,4)$, lõm lên trên $(4,\\infty)$ (ii) Lõm xuống trên $(-\\infty,0)$, lõm lên trên $(0,\\infty)$ (iii) Lõm lên trên $(-\\infty,4)$, lõm xuống trên $(4,\\infty)$ (iv) Lõm lên trên $(-\\infty,0)$, lõm xuống trên $(0,\\infty)$",
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
          "explanation": "<div class=\"ml-en\">$f''(x)=-6x$. So $f''\\gt0$ (concave up) when $x\\lt0$ and $f''\\lt0$ (concave down) when $x\\gt0$, i.e. (iv).</div><div class=\"ml-vi\">$f''(x)=-6x$. Vậy $f''\\gt0$ (lõm lên) khi $x\\lt0$ và $f''\\lt0$ (lõm xuống) khi $x\\gt0$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the vertical and horizontal asymptotes of the graph of the following function $f(x)=x+\\dfrac{1}{x-1}$|||Tìm tiệm cận đứng và tiệm cận ngang của đồ thị hàm số $f(x)=x+\\dfrac{1}{x-1}$",
          "options": [
            {
              "text": "vertical asymptote $x=1$ and horizontal asymptote $y=0$|||tiệm cận đứng $x=1$ và tiệm cận ngang $y=0$"
            },
            {
              "text": "vertical asymptote $x=0$ and horizontal asymptote $y=-1$|||tiệm cận đứng $x=0$ và tiệm cận ngang $y=-1$"
            },
            {
              "text": "vertical asymptote $x=1$ and there is no horizontal asymptote|||tiệm cận đứng $x=1$ và KHÔNG có tiệm cận ngang"
            },
            {
              "text": "There is no vertical and no horizontal asymptote|||Không có tiệm cận đứng cũng như tiệm cận ngang"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">As $x\\to1$, $f\\to\\pm\\infty$, so $x=1$ is a vertical asymptote. As $x\\to\\pm\\infty$, $f(x)\\approx x\\to\\pm\\infty$, so there is no horizontal asymptote (there is a slant asymptote $y=x$).</div><div class=\"ml-vi\">Khi $x\\to1$ thì $f\\to\\pm\\infty$ nên $x=1$ là tiệm cận đứng. Khi $x\\to\\pm\\infty$ thì $f(x)\\approx x\\to\\pm\\infty$ nên KHÔNG có tiệm cận ngang (chỉ có tiệm cận xiên $y=x$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the minimum value of the sum of two positive numbers whose product is 196.|||Tìm giá trị nhỏ nhất của tổng hai số dương có tích bằng 196.",
          "options": [
            {
              "text": "100|||100"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "none of these|||không đáp án nào"
            },
            {
              "text": "18|||18"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">With $xy=196$, $S=x+\\dfrac{196}{x}$; $S'=1-\\dfrac{196}{x^2}=0\\Rightarrow x=14$, so $S_{\\min}=14+14=28$ (equivalently AM-GM: $S\\geq2\\sqrt{196}=28$).</div><div class=\"ml-vi\">Với $xy=196$, $S=x+\\dfrac{196}{x}$; $S'=1-\\dfrac{196}{x^2}=0\\Rightarrow x=14$, nên $S_{\\min}=14+14=28$ (hoặc dùng AM-GM: $S\\geq2\\sqrt{196}=28$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the specified initial approximation $x_1$ to find the third approximation $x_3$ to the root of the given equation $x^3+x+3=0$, $x_1=-1$. (Give your answer to 4 decimal places)|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1$ để tìm xấp xỉ thứ ba $x_3$ của nghiệm phương trình $x^3+x+3=0$, $x_1=-1$. (Làm tròn 4 chữ số thập phân)",
          "options": [
            {
              "text": "-1.2143|||-1.2143"
            },
            {
              "text": "-1.2100|||-1.2100"
            },
            {
              "text": "-1.2741|||-1.2741"
            },
            {
              "text": "-1.3140|||-1.3140"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=x^3+x+3$, $f'(x)=3x^2+1$. $x_2=-1-\\dfrac{f(-1)}{f'(-1)}=-1-\\dfrac{1}{4}=-1.25$. Then $f(-1.25)=-0.203125$, $f'(-1.25)=5.6875$, so $x_3=-1.25+0.035714\\approx-1.2143$.</div><div class=\"ml-vi\">$f(x)=x^3+x+3$, $f'(x)=3x^2+1$. $x_2=-1-\\dfrac{f(-1)}{f'(-1)}=-1-\\dfrac{1}{4}=-1.25$. Tiếp theo $f(-1.25)=-0.203125$, $f'(-1.25)=5.6875$, nên $x_3=-1.25+0.035714\\approx-1.2143$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Approximate the area under the graph of the function $f(x)=\\dfrac{1}{x^2}$ on the interval $[1,5]$ using 4 subintervals and left endpoints.|||Xấp xỉ diện tích dưới đồ thị hàm $f(x)=\\dfrac{1}{x^2}$ trên đoạn $[1,5]$ với 4 khoảng chia và mút TRÁI.",
          "options": [
            {
              "text": "1.4236|||1.4236"
            },
            {
              "text": "0.4636|||0.4636"
            },
            {
              "text": "1.4636|||1.4636"
            },
            {
              "text": "2.0833|||2.0833"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=1$, left endpoints $1,2,3,4$: $L_4=1+\\dfrac14+\\dfrac19+\\dfrac1{16}=1+0.25+0.1111+0.0625=1.4236$.</div><div class=\"ml-vi\">$\\Delta x=1$, các mút trái $1,2,3,4$: $L_4=1+\\dfrac14+\\dfrac19+\\dfrac1{16}=1+0.25+0.1111+0.0625=1.4236$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the definite integral $\\displaystyle\\int_0^3 f(x)dx$ where $f(x)=\\begin{cases}4x & \\text{if } x\\gt2\\\\ 1-3x^2 & \\text{if } x\\leq2\\end{cases}$|||Tính tích phân xác định $\\displaystyle\\int_0^3 f(x)dx$ với $f(x)=\\begin{cases}4x & \\text{nếu } x\\gt2\\\\ 1-3x^2 & \\text{nếu } x\\leq2\\end{cases}$",
          "options": [
            {
              "text": "18|||18"
            },
            {
              "text": "-24|||-24"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "-10|||-10"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\int_0^2(1-3x^2)dx=[x-x^3]_0^2=2-8=-6$ and $\\int_2^3 4x\\,dx=[2x^2]_2^3=18-8=10$. Total: $-6+10=4$.</div><div class=\"ml-vi\">$\\int_0^2(1-3x^2)dx=[x-x^3]_0^2=2-8=-6$ và $\\int_2^3 4x\\,dx=[2x^2]_2^3=18-8=10$. Tổng: $-6+10=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the derivative of the function $g(x)=\\displaystyle\\int_5^{x^2}\\sqrt{1+e^{2t}}\\,dt$.<br>(i) $2\\sqrt{1+e^{2x^2}}$ (ii) $\\sqrt{1+e^{2x^2}}$ (iii) $x\\sqrt{1+e^{2x^2}}$ (iv) $2x\\sqrt{1+e^{2x^2}}$ (v) $\\sqrt{1+2xe^{2x^2}}$|||Tìm đạo hàm của hàm số $g(x)=\\displaystyle\\int_5^{x^2}\\sqrt{1+e^{2t}}\\,dt$.<br>(i) $2\\sqrt{1+e^{2x^2}}$ (ii) $\\sqrt{1+e^{2x^2}}$ (iii) $x\\sqrt{1+e^{2x^2}}$ (iv) $2x\\sqrt{1+e^{2x^2}}$ (v) $\\sqrt{1+2xe^{2x^2}}$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">By the Fundamental Theorem of Calculus with the chain rule: $g'(x)=\\sqrt{1+e^{2x^2}}\\cdot(x^2)'=2x\\sqrt{1+e^{2x^2}}$, i.e. (iv).</div><div class=\"ml-vi\">Dùng định lý cơ bản của giải tích kết hợp quy tắc dây chuyền: $g'(x)=\\sqrt{1+e^{2x^2}}\\cdot(x^2)'=2x\\sqrt{1+e^{2x^2}}$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the average value of the function $f(x)=x^2-6x+4$ over the interval $[0,2]$.|||Tìm giá trị trung bình của hàm số $f(x)=x^2-6x+4$ trên đoạn $[0,2]$.",
          "options": [
            {
              "text": "10/3|||10/3"
            },
            {
              "text": "-4|||-4"
            },
            {
              "text": "-2/3|||-2/3"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{1}{2}\\int_0^2(x^2-6x+4)dx=\\dfrac{1}{2}\\left[\\dfrac{x^3}{3}-3x^2+4x\\right]_0^2=\\dfrac{1}{2}\\left(\\dfrac83-12+8\\right)=\\dfrac{1}{2}\\cdot\\left(-\\dfrac43\\right)=-\\dfrac23$.</div><div class=\"ml-vi\">$\\dfrac{1}{2}\\int_0^2(x^2-6x+4)dx=\\dfrac{1}{2}\\left[\\dfrac{x^3}{3}-3x^2+4x\\right]_0^2=\\dfrac{1}{2}\\left(\\dfrac83-12+8\\right)=\\dfrac{1}{2}\\cdot\\left(-\\dfrac43\\right)=-\\dfrac23$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int\\dfrac{t^3}{\\sqrt[4]{3+t^4}}dt$.<br>(i) $(1/4)(3+t^4)^{3/4}+C$ (ii) $3(3+t^4)^{3/4}+C$ (iii) $(1/3)(3+t^4)^{3/4}+C$ (iv) $4(3+t^4)^{3/4}+C$|||Tính $\\displaystyle\\int\\dfrac{t^3}{\\sqrt[4]{3+t^4}}dt$.<br>(i) $(1/4)(3+t^4)^{3/4}+C$ (ii) $3(3+t^4)^{3/4}+C$ (iii) $(1/3)(3+t^4)^{3/4}+C$ (iv) $4(3+t^4)^{3/4}+C$",
          "options": [
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
              "text": "(i)|||(i)"
            },
            {
              "text": "(ii)|||(ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Let $u=3+t^4$, $du=4t^3dt$: $\\dfrac14\\int u^{-1/4}du=\\dfrac14\\cdot\\dfrac{u^{3/4}}{3/4}=\\dfrac13(3+t^4)^{3/4}+C$, i.e. (iii).</div><div class=\"ml-vi\">Đặt $u=3+t^4$, $du=4t^3dt$: $\\dfrac14\\int u^{-1/4}du=\\dfrac14\\cdot\\dfrac{u^{3/4}}{3/4}=\\dfrac13(3+t^4)^{3/4}+C$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose $f(x)$ is continuous and differentiable, $f(1)=5$ and $\\displaystyle\\int_0^1 f(x)dx=4$. Find $\\displaystyle\\int_0^1 xf'(x)dx$.|||Giả sử $f(x)$ liên tục và khả vi, $f(1)=5$ và $\\displaystyle\\int_0^1 f(x)dx=4$. Tính $\\displaystyle\\int_0^1 xf'(x)dx$.",
          "options": [
            {
              "text": "-2|||-2"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "-3|||-3"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Integration by parts: $\\int_0^1 xf'(x)dx=[xf(x)]_0^1-\\int_0^1 f(x)dx=f(1)-4=5-4=1$.</div><div class=\"ml-vi\">Tích phân từng phần: $\\int_0^1 xf'(x)dx=[xf(x)]_0^1-\\int_0^1 f(x)dx=f(1)-4=5-4=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Trapezoidal Rule with $n=5$ to approximate the integral $\\displaystyle\\int_1^6 f(x)dx$ from the table below.<table class=\"exam-table\"><thead><tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead><tbody><tr><td>f(x)</td><td>3.2</td><td>1.6</td><td>2.4</td><td>3.8</td><td>4.4</td><td>1.3</td></tr></tbody></table>|||Dùng quy tắc hình thang với $n=5$ để xấp xỉ tích phân $\\displaystyle\\int_1^6 f(x)dx$ theo bảng dưới đây.<table class=\"exam-table\"><thead><tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead><tbody><tr><td>f(x)</td><td>3.2</td><td>1.6</td><td>2.4</td><td>3.8</td><td>4.4</td><td>1.3</td></tr></tbody></table>",
          "options": [
            {
              "text": "14.45|||14.45"
            },
            {
              "text": "28.90|||28.90"
            },
            {
              "text": "15.55|||15.55"
            },
            {
              "text": "31.1|||31.1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$h=1$, $T=\\dfrac{h}{2}\\left[f(1)+2(f(2)+f(3)+f(4)+f(5))+f(6)\\right]=\\dfrac12[3.2+2(1.6+2.4+3.8+4.4)+1.3]=\\dfrac12[4.5+24.4]=14.45$.</div><div class=\"ml-vi\">$h=1$, $T=\\dfrac{h}{2}\\left[f(1)+2(f(2)+f(3)+f(4)+f(5))+f(6)\\right]=\\dfrac12[3.2+2(1.6+2.4+3.8+4.4)+1.3]=\\dfrac12[4.5+24.4]=14.45$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Investigate the convergence of $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^n}dx$.<br>(i) The integral converges when $n\\lt1$ and diverges when $n\\geq1$. (ii) The integral converges when $n\\gt1$ and diverges when $n\\leq1$. (iii) The integral converges when $n\\neq1$ and diverges when $n=1$.|||Khảo sát sự hội tụ của $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^n}dx$.<br>(i) Tích phân hội tụ khi $n\\lt1$ và phân kỳ khi $n\\geq1$. (ii) Tích phân hội tụ khi $n\\gt1$ và phân kỳ khi $n\\leq1$. (iii) Tích phân hội tụ khi $n\\neq1$ và phân kỳ khi $n=1$.",
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
          "explanation": "<div class=\"ml-en\">This is the $p$-integral: $\\int_1^{\\infty}x^{-n}dx=\\left[\\dfrac{x^{1-n}}{1-n}\\right]_1^{\\infty}$ converges iff $n\\gt1$ (and for $n=1$ it gives $\\ln x\\to\\infty$).</div><div class=\"ml-vi\">Đây là tích phân dạng $p$: $\\int_1^{\\infty}x^{-n}dx=\\left[\\dfrac{x^{1-n}}{1-n}\\right]_1^{\\infty}$ hội tụ khi và chỉ khi $n\\gt1$ (với $n=1$ ta có $\\ln x\\to\\infty$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following matrices are in row-echelon form?<br>(i) $\\begin{bmatrix}1&2&3\\\\-1&0&0\\\\0&1&0\\end{bmatrix}$ (ii) $\\begin{bmatrix}2&4&1\\\\0&1&3\\\\0&0&0\\end{bmatrix}$|||Ma trận nào sau đây ở dạng bậc thang theo hàng (row-echelon form)?<br>(i) $\\begin{bmatrix}1&2&3\\\\-1&0&0\\\\0&1&0\\end{bmatrix}$ (ii) $\\begin{bmatrix}2&4&1\\\\0&1&3\\\\0&0&0\\end{bmatrix}$",
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
              "text": "(i) and (ii)|||(i) và (ii)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">In (i) the entry $-1$ below the first pivot violates the echelon condition. In (ii) each leading entry lies strictly to the right of the one above it and the zero row is at the bottom, so only (ii) is in row-echelon form.</div><div class=\"ml-vi\">Ở (i), phần tử $-1$ nằm dưới phần tử dẫn đầu của hàng 1 nên vi phạm điều kiện bậc thang. Ở (ii), mỗi phần tử dẫn đầu nằm bên phải phần tử dẫn đầu hàng trên và hàng không nằm cuối, nên chỉ (ii) ở dạng bậc thang.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of $t$ for which the following system is consistent: $\\begin{cases}x+y=1\\\\ tx+y=t\\\\ (1+t)x+2y=3\\end{cases}$|||Tìm giá trị $t$ để hệ sau tương thích (có nghiệm): $\\begin{cases}x+y=1\\\\ tx+y=t\\\\ (1+t)x+2y=3\\end{cases}$",
          "options": [
            {
              "text": "$t=3$|||$t=3$"
            },
            {
              "text": "$t=-2$|||$t=-2$"
            },
            {
              "text": "$t=2$|||$t=2$"
            },
            {
              "text": "$t=-3$|||$t=-3$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Subtracting the first equation from the second gives $(t-1)x=t-1$. If $t\\neq1$ then $x=1,y=0$; substituting into the third equation: $1+t=3\\Rightarrow t=2$. If $t=1$ the third equation becomes $x+y=1.5$, contradicting $x+y=1$. Hence $t=2$.</div><div class=\"ml-vi\">Trừ phương trình 1 khỏi phương trình 2: $(t-1)x=t-1$. Nếu $t\\neq1$ thì $x=1,y=0$; thay vào phương trình 3: $1+t=3\\Rightarrow t=2$. Nếu $t=1$, phương trình 3 thành $x+y=1.5$ mâu thuẫn với $x+y=1$. Vậy $t=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "John and Joe earn a total of USD 24.60 when John works 2 hours and Joe works 3 hours. If John works 3 hours and Joe works 2 hours, they get USD 23.90. Find their hourly rates (in USD).|||John và Joe kiếm được tổng cộng 24.60 USD khi John làm 2 giờ và Joe làm 3 giờ. Nếu John làm 3 giờ và Joe làm 2 giờ thì họ được 23.90 USD. Tìm tiền công mỗi giờ của họ (USD).",
          "options": [
            {
              "text": "6.70, 9.40|||6.70, 9.40"
            },
            {
              "text": "4.50, 5.20|||4.50, 5.20"
            },
            {
              "text": "12.60, 15.80|||12.60, 15.80"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả các lựa chọn khác đều sai"
            },
            {
              "text": "1.40, 0.80|||1.40, 0.80"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Let $x,y$ be the rates: $2x+3y=24.60$, $3x+2y=23.90$. Adding: $5(x+y)=48.5\\Rightarrow x+y=9.7$; subtracting: $y-x=0.7$. Hence $y=5.20$, $x=4.50$.</div><div class=\"ml-vi\">Gọi $x,y$ là tiền công mỗi giờ: $2x+3y=24.60$, $3x+2y=23.90$. Cộng lại: $5(x+y)=48.5\\Rightarrow x+y=9.7$; trừ nhau: $y-x=0.7$. Vậy $y=5.20$, $x=4.50$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The system $\\begin{cases}x-y-z=0\\\\ 2x+y-z=0\\\\ 3x-y-mz=0\\end{cases}$ is inconsistent. Then...|||Hệ $\\begin{cases}x-y-z=0\\\\ 2x+y-z=0\\\\ 3x-y-mz=0\\end{cases}$ là hệ vô nghiệm (không tương thích). Khi đó...",
          "options": [
            {
              "text": "The situation is impossible.|||Tình huống này là bất khả thi."
            },
            {
              "text": "$m=1$|||$m=1$"
            },
            {
              "text": "$m=-2$|||$m=-2$"
            },
            {
              "text": "$m$ is any number but 1|||$m$ là số bất kỳ khác 1"
            },
            {
              "text": "$m$ is any number but -2|||$m$ là số bất kỳ khác -2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The system is homogeneous, so it always has at least the trivial solution $x=y=z=0$. A homogeneous system can never be inconsistent, so the described situation is impossible.</div><div class=\"ml-vi\">Hệ này là hệ THUẦN NHẤT nên luôn có ít nhất nghiệm tầm thường $x=y=z=0$. Hệ thuần nhất không bao giờ vô nghiệm, nên tình huống đề nêu là bất khả thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all values of $a,b,c,d$ such that $\\begin{bmatrix}1&3\\\\2&4\\end{bmatrix}=a\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}+b\\begin{bmatrix}0&3\\\\0&0\\end{bmatrix}+c\\begin{bmatrix}0&0\\\\2&0\\end{bmatrix}+d\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$|||Tìm tất cả giá trị $a,b,c,d$ sao cho $\\begin{bmatrix}1&3\\\\2&4\\end{bmatrix}=a\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}+b\\begin{bmatrix}0&3\\\\0&0\\end{bmatrix}+c\\begin{bmatrix}0&0\\\\2&0\\end{bmatrix}+d\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$",
          "options": [
            {
              "text": "$a=1, b=2, c=3, d=4$|||$a=1, b=2, c=3, d=4$"
            },
            {
              "text": "$a=1, b=1, c=1, d=1$|||$a=1, b=1, c=1, d=1$"
            },
            {
              "text": "$a=1, b=3, c=2, d=4$|||$a=1, b=3, c=2, d=4$"
            },
            {
              "text": "$a=1, b=1, c=1, d=4$|||$a=1, b=1, c=1, d=4$"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Compare entries: $a=1$; $3b=3\\Rightarrow b=1$; $2c=2\\Rightarrow c=1$; $d=4$.</div><div class=\"ml-vi\">So sánh từng phần tử: $a=1$; $3b=3\\Rightarrow b=1$; $2c=2\\Rightarrow c=1$; $d=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute $A\\mathbf{x}$ where $\\mathbf{x}=[-2\\ \\ 1\\ \\ 0]^T$ and $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\\\10&11&12\\end{bmatrix}$<br>(i) $[0\\ \\ 3\\ \\ -6\\ \\ -9]^T$ (ii) $[0\\ \\ -3\\ \\ 6\\ \\ -9]^T$ (iii) $[0\\ \\ -3\\ \\ -6\\ \\ -9]^T$ (iv) $[0\\ \\ -3\\ \\ -6\\ \\ 9]^T$|||Tính $A\\mathbf{x}$ với $\\mathbf{x}=[-2\\ \\ 1\\ \\ 0]^T$ và $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\\\10&11&12\\end{bmatrix}$<br>(i) $[0\\ \\ 3\\ \\ -6\\ \\ -9]^T$ (ii) $[0\\ \\ -3\\ \\ 6\\ \\ -9]^T$ (iii) $[0\\ \\ -3\\ \\ -6\\ \\ -9]^T$ (iv) $[0\\ \\ -3\\ \\ -6\\ \\ 9]^T$",
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
              "text": "None of the choices is correct|||Không lựa chọn nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Row by row: $1(-2)+2(1)+3(0)=0$; $4(-2)+5=-3$; $7(-2)+8=-6$; $10(-2)+11=-9$. So $A\\mathbf{x}=[0\\ -3\\ -6\\ -9]^T$, i.e. (iii).</div><div class=\"ml-vi\">Tính theo từng hàng: $1(-2)+2(1)+3(0)=0$; $4(-2)+5=-3$; $7(-2)+8=-6$; $10(-2)+11=-9$. Vậy $A\\mathbf{x}=[0\\ -3\\ -6\\ -9]^T$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the $(2,3)$-entry of the product $\\begin{bmatrix}1\\\\-2\\\\3\\end{bmatrix}\\begin{bmatrix}0&5&-4\\end{bmatrix}$|||Tìm phần tử $(2,3)$ của tích $\\begin{bmatrix}1\\\\-2\\\\3\\end{bmatrix}\\begin{bmatrix}0&5&-4\\end{bmatrix}$",
          "options": [
            {
              "text": "-14|||-14"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "-22|||-22"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The $(2,3)$-entry is (2nd entry of the column)$\\times$(3rd entry of the row) $=(-2)(-4)=8$.</div><div class=\"ml-vi\">Phần tử $(2,3)$ bằng (phần tử thứ 2 của cột)$\\times$(phần tử thứ 3 của hàng) $=(-2)(-4)=8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&0&1\\\\k&1&k\\\\3&k&2\\end{bmatrix}$. Find the $(2,1)$-entry of the inverse matrix $A^{-1}$.|||Cho $A=\\begin{bmatrix}1&0&1\\\\k&1&k\\\\3&k&2\\end{bmatrix}$. Tìm phần tử $(2,1)$ của ma trận nghịch đảo $A^{-1}$.",
          "options": [
            {
              "text": "$-k$|||$-k$"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\det A=1(2-k^2)-0+1(k^2-3)=-1$. The $(2,1)$-entry of $A^{-1}$ equals $\\dfrac{C_{12}}{\\det A}$ where $C_{12}=-\\det\\begin{bmatrix}k&k\\\\3&2\\end{bmatrix}=-(2k-3k)=k$. So the entry is $\\dfrac{k}{-1}=-k$.</div><div class=\"ml-vi\">$\\det A=1(2-k^2)-0+1(k^2-3)=-1$. Phần tử $(2,1)$ của $A^{-1}$ bằng $\\dfrac{C_{12}}{\\det A}$ với $C_{12}=-\\det\\begin{bmatrix}k&k\\\\3&2\\end{bmatrix}=-(2k-3k)=k$. Vậy phần tử đó là $\\dfrac{k}{-1}=-k$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^3$ be the linear transformation such that $T\\begin{bmatrix}1\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\3\\\\0\\end{bmatrix}$, $T\\begin{bmatrix}2\\\\1\\end{bmatrix}=\\begin{bmatrix}1\\\\-1\\\\3\\end{bmatrix}$. Let $T\\begin{bmatrix}5\\\\2\\end{bmatrix}=\\begin{bmatrix}a\\\\b\\\\c\\end{bmatrix}$. Find $a$.|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^3$ là ánh xạ tuyến tính thoả $T\\begin{bmatrix}1\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\3\\\\0\\end{bmatrix}$, $T\\begin{bmatrix}2\\\\1\\end{bmatrix}=\\begin{bmatrix}1\\\\-1\\\\3\\end{bmatrix}$. Cho $T\\begin{bmatrix}5\\\\2\\end{bmatrix}=\\begin{bmatrix}a\\\\b\\\\c\\end{bmatrix}$. Tìm $a$.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Write $\\begin{bmatrix}5\\\\2\\end{bmatrix}=1\\cdot\\begin{bmatrix}1\\\\0\\end{bmatrix}+2\\cdot\\begin{bmatrix}2\\\\1\\end{bmatrix}$. By linearity $T\\begin{bmatrix}5\\\\2\\end{bmatrix}=(2,3,0)+2(1,-1,3)=(4,1,6)$, so $a=4$.</div><div class=\"ml-vi\">Viết $\\begin{bmatrix}5\\\\2\\end{bmatrix}=1\\cdot\\begin{bmatrix}1\\\\0\\end{bmatrix}+2\\cdot\\begin{bmatrix}2\\\\1\\end{bmatrix}$. Theo tính tuyến tính: $T\\begin{bmatrix}5\\\\2\\end{bmatrix}=(2,3,0)+2(1,-1,3)=(4,1,6)$, vậy $a=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following maps $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ are matrix transformations?<br>(i) $T(x,y)=(x^2-y^2,\\ x^2+y^2)$ (ii) $T(x,y)=(5x+6y,\\ y^2)$ (iii) $T(x,y)=(5x+6y,\\ 1)$ (iv) $T(x,y)=(5x+6y,\\ 0)$|||Ánh xạ nào sau đây $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép biến đổi ma trận (tuyến tính)?<br>(i) $T(x,y)=(x^2-y^2,\\ x^2+y^2)$ (ii) $T(x,y)=(5x+6y,\\ y^2)$ (iii) $T(x,y)=(5x+6y,\\ 1)$ (iv) $T(x,y)=(5x+6y,\\ 0)$",
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
          "explanation": "<div class=\"ml-en\">A matrix transformation must have every component a linear combination of $x,y$. (i),(ii) contain squares; (iii) has the constant 1 (so $T(0,0)\\neq0$). Only (iv) is linear, with matrix $\\begin{bmatrix}5&6\\\\0&0\\end{bmatrix}$.</div><div class=\"ml-vi\">Phép biến đổi ma trận đòi hỏi mọi thành phần là tổ hợp tuyến tính của $x,y$. (i),(ii) chứa bình phương; (iii) có hằng số 1 (nên $T(0,0)\\neq0$). Chỉ (iv) tuyến tính, với ma trận $\\begin{bmatrix}5&6\\\\0&0\\end{bmatrix}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\det\\begin{bmatrix}a&b&c\\\\p&q&r\\\\x&y&z\\end{bmatrix}=3$, find $\\det\\begin{bmatrix}a+2x&b+2y&c+2z\\\\3a-p&3b-q&3c-r\\\\a&b&c\\end{bmatrix}$.|||Cho $\\det\\begin{bmatrix}a&b&c\\\\p&q&r\\\\x&y&z\\end{bmatrix}=3$, hãy tính $\\det\\begin{bmatrix}a+2x&b+2y&c+2z\\\\3a-p&3b-q&3c-r\\\\a&b&c\\end{bmatrix}$.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "-6|||-6"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "-24|||-24"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "None of the others|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Write the rows as $A=(a,b,c)$, $B=(p,q,r)$, $C=(x,y,z)$. The determinant is $\\det(A+2C,\\,3A-B,\\,A)$. Any term containing $A$ twice vanishes, leaving $2\\det(C,-B,A)=-2\\det(C,B,A)$. Swapping rows 1 and 3 gives $\\det(C,B,A)=-\\det(A,B,C)=-3$, so the answer is $-2(-3)=6$.</div><div class=\"ml-vi\">Ký hiệu các hàng $A=(a,b,c)$, $B=(p,q,r)$, $C=(x,y,z)$. Định thức cần tính là $\\det(A+2C,\\,3A-B,\\,A)$. Mọi số hạng chứa $A$ hai lần đều bằng 0, còn lại $2\\det(C,-B,A)=-2\\det(C,B,A)$. Đổi chỗ hàng 1 và 3: $\\det(C,B,A)=-\\det(A,B,C)=-3$, nên kết quả là $-2(-3)=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find values of $c$ for which the matrix $A=\\begin{bmatrix}1&2&1\\\\2&c&1\\\\0&0&c\\end{bmatrix}$ has an inverse.|||Tìm các giá trị $c$ để ma trận $A=\\begin{bmatrix}1&2&1\\\\2&c&1\\\\0&0&c\\end{bmatrix}$ khả nghịch.",
          "options": [
            {
              "text": "All nonzero numbers|||Mọi số khác 0"
            },
            {
              "text": "All numbers different from 0 and 4|||Mọi số khác 0 và khác 4"
            },
            {
              "text": "All real numbers|||Mọi số thực"
            },
            {
              "text": "All numbers different from 4|||Mọi số khác 4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Expanding along the third row: $\\det A=c\\det\\begin{bmatrix}1&2\\\\2&c\\end{bmatrix}=c(c-4)$. The matrix is invertible iff $c\\neq0$ and $c\\neq4$.</div><div class=\"ml-vi\">Khai triển theo hàng 3: $\\det A=c\\det\\begin{bmatrix}1&2\\\\2&c\\end{bmatrix}=c(c-4)$. Ma trận khả nghịch khi và chỉ khi $c\\neq0$ và $c\\neq4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&2&0\\\\3&0&1\\\\-1&2&2\\end{bmatrix}$. Find the determinant of the matrix $2A^{-1}$.|||Cho $A=\\begin{bmatrix}1&2&0\\\\3&0&1\\\\-1&2&2\\end{bmatrix}$. Tính định thức của ma trận $2A^{-1}$.",
          "options": [
            {
              "text": "1/8|||1/8"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "-1/2|||-1/2"
            },
            {
              "text": "-1/8|||-1/8"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\det A=1(0\\cdot2-1\\cdot2)-2(3\\cdot2-1\\cdot(-1))+0=-2-14=-16$. Then $\\det(2A^{-1})=2^3\\cdot\\dfrac{1}{\\det A}=\\dfrac{8}{-16}=-\\dfrac12$.</div><div class=\"ml-vi\">$\\det A=1(0\\cdot2-1\\cdot2)-2(3\\cdot2-1\\cdot(-1))+0=-2-14=-16$. Do đó $\\det(2A^{-1})=2^3\\cdot\\dfrac{1}{\\det A}=\\dfrac{8}{-16}=-\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all eigenvalues of the matrix $A=\\begin{bmatrix}4&0\\\\1&3\\end{bmatrix}$.|||Tìm tất cả các giá trị riêng của ma trận $A=\\begin{bmatrix}4&0\\\\1&3\\end{bmatrix}$.",
          "options": [
            {
              "text": "2 and 4|||2 và 4"
            },
            {
              "text": "none of the other choices is true|||không đáp án nào khác đúng"
            },
            {
              "text": "3 and 4|||3 và 4"
            },
            {
              "text": "1 and 3|||1 và 3"
            },
            {
              "text": "2 and 3|||2 và 3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A$ is lower triangular, so its eigenvalues are the diagonal entries: $4$ and $3$. (Check: $\\det(A-\\lambda I)=(4-\\lambda)(3-\\lambda)=0$.)</div><div class=\"ml-vi\">$A$ là ma trận tam giác dưới nên các giá trị riêng chính là các phần tử trên đường chéo: $4$ và $3$. (Kiểm tra: $\\det(A-\\lambda I)=(4-\\lambda)(3-\\lambda)=0$.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that $\\lambda=0$ is an eigenvalue of the matrix $\\begin{bmatrix}1&1&0\\\\1&1&2\\\\1&1&2\\end{bmatrix}$, find a set of basic eigenvectors corresponding to this eigenvalue 0.<br>(i) $[1\\ \\ 1\\ \\ 0]^T$ (ii) $[1\\ \\ -1\\ \\ 0]^T$ (iii) $[1\\ \\ 0\\ \\ -1]^T$ (iv) $[1\\ \\ -1\\ \\ 0]^T$ and $[1\\ \\ 0\\ \\ -1]^T$|||Biết $\\lambda=0$ là một giá trị riêng của ma trận $\\begin{bmatrix}1&1&0\\\\1&1&2\\\\1&1&2\\end{bmatrix}$, hãy tìm hệ vectơ riêng cơ bản ứng với giá trị riêng 0.<br>(i) $[1\\ \\ 1\\ \\ 0]^T$ (ii) $[1\\ \\ -1\\ \\ 0]^T$ (iii) $[1\\ \\ 0\\ \\ -1]^T$ (iv) $[1\\ \\ -1\\ \\ 0]^T$ và $[1\\ \\ 0\\ \\ -1]^T$",
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
          "explanation": "<div class=\"ml-en\">Solve $Ax=0$: row 1 gives $x+y=0$; row 2 gives $x+y+2z=0\\Rightarrow z=0$; row 3 is the same as row 2. So $x=-y$, $z=0$, and a basic eigenvector is $[1\\ -1\\ 0]^T$, i.e. (ii).</div><div class=\"ml-vi\">Giải $Ax=0$: hàng 1 cho $x+y=0$; hàng 2 cho $x+y+2z=0\\Rightarrow z=0$; hàng 3 trùng hàng 2. Vậy $x=-y$, $z=0$, vectơ riêng cơ bản là $[1\\ -1\\ 0]^T$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let ABCD be a parallelogram with $A(1,2,3)$, $C(3,0,1)$. Assume that $M(0,1,2)$ is the midpoint of AB. Find the coordinates of vector $\\overrightarrow{BD}$.|||Cho hình bình hành ABCD với $A(1,2,3)$, $C(3,0,1)$. Giả sử $M(0,1,2)$ là trung điểm của AB. Tìm toạ độ vectơ $\\overrightarrow{BD}$.",
          "options": [
            {
              "text": "(6, 2, 2)|||(6, 2, 2)"
            },
            {
              "text": "(1, 1, -2)|||(1, 1, -2)"
            },
            {
              "text": "(6, -2, -2)|||(6, -2, -2)"
            },
            {
              "text": "(7, 1, 2)|||(7, 1, 2)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$B=2M-A=(-1,0,1)$. In parallelogram ABCD the diagonals share a midpoint, so $D=A+C-B=(5,2,3)$. Then $\\overrightarrow{BD}=D-B=(6,2,2)$.</div><div class=\"ml-vi\">$B=2M-A=(-1,0,1)$. Trong hình bình hành ABCD hai đường chéo cắt nhau tại trung điểm mỗi đường nên $D=A+C-B=(5,2,3)$. Suy ra $\\overrightarrow{BD}=D-B=(6,2,2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find an equation describing the plane passing through $(6,0,2)$ and perpendicular to the line of intersection of the planes $x+y-2z=4$ and $3x-2y+z=1$.|||Tìm phương trình mặt phẳng đi qua $(6,0,2)$ và vuông góc với giao tuyến của hai mặt phẳng $x+y-2z=4$ và $3x-2y+z=1$.",
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
          "explanation": "<div class=\"ml-en\">The direction of the line is $\\mathbf{n}_1\\times\\mathbf{n}_2=(1,1,-2)\\times(3,-2,1)=(-3,-7,-5)$. This is the normal of the required plane: $-3(x-6)-7y-5(z-2)=0\\Rightarrow3x+7y+5z=28$.</div><div class=\"ml-vi\">Vectơ chỉ phương của giao tuyến là $\\mathbf{n}_1\\times\\mathbf{n}_2=(1,1,-2)\\times(3,-2,1)=(-3,-7,-5)$. Đây chính là vectơ pháp tuyến của mặt phẳng cần tìm: $-3(x-6)-7y-5(z-2)=0\\Rightarrow3x+7y+5z=28$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find an equation for the plane passing through $(2,1,4)$, $(1,-1,2)$, $(4,-1,1)$.|||Tìm phương trình mặt phẳng đi qua ba điểm $(2,1,4)$, $(1,-1,2)$, $(4,-1,1)$.",
          "options": [
            {
              "text": "$2x-7y+6z=21$|||$2x-7y+6z=21$"
            },
            {
              "text": "$2x-7y+6z=-21$|||$2x-7y+6z=-21$"
            },
            {
              "text": "$2x-7y-6z=21$|||$2x-7y-6z=21$"
            },
            {
              "text": "$2x+7y-6z=-21$|||$2x+7y-6z=-21$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\overrightarrow{PQ}=(-1,-2,-2)$, $\\overrightarrow{PR}=(2,-2,-3)$; $\\mathbf{n}=\\overrightarrow{PQ}\\times\\overrightarrow{PR}=(2,-7,6)$. Plane: $2x-7y+6z=2(2)-7(1)+6(4)=21$.</div><div class=\"ml-vi\">$\\overrightarrow{PQ}=(-1,-2,-2)$, $\\overrightarrow{PR}=(2,-2,-3)$; $\\mathbf{n}=\\overrightarrow{PQ}\\times\\overrightarrow{PR}=(2,-7,6)$. Mặt phẳng: $2x-7y+6z=2(2)-7(1)+6(4)=21$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The area of the parallelogram determined by the vectors $\\mathbf{u}$ and $\\mathbf{v}$ is 100. Find the area of the parallelogram determined by the vectors $\\mathbf{u}$ and $2\\mathbf{u}+3\\mathbf{v}$.|||Diện tích hình bình hành tạo bởi hai vectơ $\\mathbf{u}$ và $\\mathbf{v}$ bằng 100. Tìm diện tích hình bình hành tạo bởi hai vectơ $\\mathbf{u}$ và $2\\mathbf{u}+3\\mathbf{v}$.",
          "options": [
            {
              "text": "500|||500"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "300|||300"
            },
            {
              "text": "200|||200"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\|\\mathbf{u}\\times(2\\mathbf{u}+3\\mathbf{v})\\|=\\|2(\\mathbf{u}\\times\\mathbf{u})+3(\\mathbf{u}\\times\\mathbf{v})\\|=3\\|\\mathbf{u}\\times\\mathbf{v}\\|=3(100)=300$.</div><div class=\"ml-vi\">$\\|\\mathbf{u}\\times(2\\mathbf{u}+3\\mathbf{v})\\|=\\|2(\\mathbf{u}\\times\\mathbf{u})+3(\\mathbf{u}\\times\\mathbf{v})\\|=3\\|\\mathbf{u}\\times\\mathbf{v}\\|=3(100)=300$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be projection on the line $y=3x$ followed by projection on the line $y=-x$. Find $T([-2\\ \\ 1]^T)$.<br>(i) $[1/10\\ \\ -1/10]^T$ (ii) $[-3/10\\ \\ 3/10]^T$ (iii) $[-1/10\\ \\ 1/10]^T$ (iv) $[3/10\\ \\ -3/10]^T$|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép chiếu lên đường thẳng $y=3x$ rồi chiếu tiếp lên đường thẳng $y=-x$. Tính $T([-2\\ \\ 1]^T)$.<br>(i) $[1/10\\ \\ -1/10]^T$ (ii) $[-3/10\\ \\ 3/10]^T$ (iii) $[-1/10\\ \\ 1/10]^T$ (iv) $[3/10\\ \\ -3/10]^T$",
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
          "explanation": "<div class=\"ml-en\">Project on $y=3x$ (direction $(1,3)$): $\\dfrac{(-2,1)\\cdot(1,3)}{10}(1,3)=\\dfrac{1}{10}(1,3)=(0.1,0.3)$. Project that on $y=-x$ (direction $(1,-1)$): $\\dfrac{(0.1,0.3)\\cdot(1,-1)}{2}(1,-1)=-0.1(1,-1)=(-1/10,\\ 1/10)$, i.e. (iii).</div><div class=\"ml-vi\">Chiếu lên $y=3x$ (phương $(1,3)$): $\\dfrac{(-2,1)\\cdot(1,3)}{10}(1,3)=\\dfrac{1}{10}(1,3)=(0.1,0.3)$. Chiếu kết quả lên $y=-x$ (phương $(1,-1)$): $\\dfrac{(0.1,0.3)\\cdot(1,-1)}{2}(1,-1)=-0.1(1,-1)=(-1/10,\\ 1/10)$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are subspaces of $\\mathbb{R}^3$?<br>(i) $\\{(a,a,0)\\mid a\\in\\mathbb{R}\\}$ (ii) $\\{(a+b-3,a,b)\\mid a,b\\in\\mathbb{R}\\}$|||Tập nào sau đây là không gian con của $\\mathbb{R}^3$?<br>(i) $\\{(a,a,0)\\mid a\\in\\mathbb{R}\\}$ (ii) $\\{(a+b-3,a,b)\\mid a,b\\in\\mathbb{R}\\}$",
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
          "explanation": "<div class=\"ml-en\">(i) is the span of $(1,1,0)$, hence a subspace. (ii) does not contain the zero vector: $a=b=0$ gives $(-3,0,0)\\neq\\mathbf{0}$, so it is not a subspace.</div><div class=\"ml-vi\">(i) là span của $(1,1,0)$ nên là không gian con. (ii) không chứa vectơ 0: với $a=b=0$ ta được $(-3,0,0)\\neq\\mathbf{0}$, nên không phải không gian con.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a subspace of $\\mathbb{R}^3$?<br>(i) $U=\\{(a+b,\\ 3a-b,\\ 2a+b)\\mid a,b\\in\\mathbb{R}\\}$ (ii) $U=\\{(a,b,c)\\mid a^2+b^2-c^2=0\\}$|||Tập nào sau đây là không gian con của $\\mathbb{R}^3$?<br>(i) $U=\\{(a+b,\\ 3a-b,\\ 2a+b)\\mid a,b\\in\\mathbb{R}\\}$ (ii) $U=\\{(a,b,c)\\mid a^2+b^2-c^2=0\\}$",
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
              "text": "Neither (i) nor (ii)|||Không cái nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) equals $\\mathrm{span}\\{(1,3,2),(1,-1,1)\\}$, hence a subspace. (ii) is not closed under addition: $(1,0,1)$ and $(0,1,1)$ satisfy the condition but their sum $(1,1,2)$ gives $1+1-4\\neq0$.</div><div class=\"ml-vi\">(i) chính là $\\mathrm{span}\\{(1,3,2),(1,-1,1)\\}$ nên là không gian con. (ii) không đóng với phép cộng: $(1,0,1)$ và $(0,1,1)$ thoả điều kiện nhưng tổng $(1,1,2)$ cho $1+1-4\\neq0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $U=\\{(a,b,c,d)\\mid a+2d=3b+c\\}$ be a subspace in $\\mathbb{R}^4$. Find the dimension of $U$.|||Cho $U=\\{(a,b,c,d)\\mid a+2d=3b+c\\}$ là không gian con của $\\mathbb{R}^4$. Tìm số chiều của $U$.",
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
            3
          ],
          "explanation": "<div class=\"ml-en\">The set is the solution space of ONE non-trivial linear equation in $\\mathbb{R}^4$, so $\\dim U=4-1=3$.</div><div class=\"ml-vi\">Tập này là không gian nghiệm của MỘT phương trình tuyến tính không tầm thường trong $\\mathbb{R}^4$, nên $\\dim U=4-1=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the dimension of the space $U=\\{[a\\ \\ b\\ \\ c\\ \\ d]^T\\mid a=b+c \\text{ and } b=2c+d,\\ \\text{where } a,b,c,d\\in\\mathbb{R}\\}$.|||Tìm số chiều của không gian $U=\\{[a\\ \\ b\\ \\ c\\ \\ d]^T\\mid a=b+c \\text{ và } b=2c+d,\\ \\text{với } a,b,c,d\\in\\mathbb{R}\\}$.",
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
          "explanation": "<div class=\"ml-en\">Two independent linear constraints in $\\mathbb{R}^4$: choosing $c,d$ freely determines $b=2c+d$ and $a=b+c=3c+d$. Hence $\\dim U=4-2=2$.</div><div class=\"ml-vi\">Hai ràng buộc tuyến tính độc lập trong $\\mathbb{R}^4$: chọn tự do $c,d$ thì $b=2c+d$ và $a=b+c=3c+d$. Vậy $\\dim U=4-2=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{v_1,v_2,v_3\\}=\\{(2,1,0),(1,-2,0),(0,0,3)\\}$ be an orthogonal basis of $U=\\mathbb{R}^3$. Find the coefficient of $v_1$ when expressing $u=(1,2,2)$ as a linear combination of $\\{v_1,v_2,v_3\\}$.|||Cho $\\{v_1,v_2,v_3\\}=\\{(2,1,0),(1,-2,0),(0,0,3)\\}$ là cơ sở trực giao của $U=\\mathbb{R}^3$. Tìm hệ số của $v_1$ khi biểu diễn $u=(1,2,2)$ thành tổ hợp tuyến tính của $\\{v_1,v_2,v_3\\}$.",
          "options": [
            {
              "text": "-4/5|||-4/5"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "-5|||-5"
            },
            {
              "text": "4/5|||4/5"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For an orthogonal basis the coefficient is $\\dfrac{u\\cdot v_1}{v_1\\cdot v_1}=\\dfrac{(1)(2)+(2)(1)+0}{4+1+0}=\\dfrac{4}{5}$.</div><div class=\"ml-vi\">Với cơ sở trực giao, hệ số bằng $\\dfrac{u\\cdot v_1}{v_1\\cdot v_1}=\\dfrac{(1)(2)+(2)(1)+0}{4+1+0}=\\dfrac{4}{5}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $7\\times8$ matrix. Assume that the rows of $A$ are linearly independent. Find rank $A$.|||Cho $A$ là ma trận $7\\times8$. Giả sử các HÀNG của $A$ độc lập tuyến tính. Tìm hạng của $A$.",
          "options": [
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "There is not enough information|||Không đủ thông tin"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The rank equals the number of linearly independent rows. $A$ has 7 rows and they are independent, so rank $A=7$.</div><div class=\"ml-vi\">Hạng bằng số hàng độc lập tuyến tính. $A$ có 7 hàng và chúng độc lập nên hạng $A=7$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D8",
      "source": "REAL",
      "sortOrder": 7,
      "title": "Đề 8 — SU25 Retake Exam|||Đề 8 — Thi lại SU25",
      "description": "MAE101 real FE retake paper (Summer 2025), transcribed from the exam images; answers reasoned here. (50 questions)|||Đề thi lại FE thật môn MAE101 (kỳ Hè 2025), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (50 câu)",
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
          "prompt": "Which of the following are <u>even</u> functions?<br>(i) $f(x)=x^3-1010$ (ii) $f(x)=\\sin(2x^4)$ (iii) $f(x)=\\sin(x-10x^5)$ (iv) $f(x)=x+\\dfrac{5}{x}+2$ (v) $f(x)=\\sin x\\cos x$|||Hàm nào sau đây là hàm <u>chẵn</u>?<br>(i) $f(x)=x^3-1010$ (ii) $f(x)=\\sin(2x^4)$ (iii) $f(x)=\\sin(x-10x^5)$ (iv) $f(x)=x+\\dfrac{5}{x}+2$ (v) $f(x)=\\sin x\\cos x$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Only (ii): $\\sin(2(-x)^4)=\\sin(2x^4)$ since $x^4$ is even. (i) and (iv) are neither; (iii) and (v) are odd ($\\sin x\\cos x=\\tfrac12\\sin2x$).</div><div class=\"ml-vi\">Chỉ (ii): $\\sin(2(-x)^4)=\\sin(2x^4)$ vì $x^4$ chẵn. (i) và (iv) không chẵn không lẻ; (iii) và (v) là hàm lẻ ($\\sin x\\cos x=\\tfrac12\\sin2x$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $(L)$ be the line passing through $(1,-1)$ with slope $-1/2$. Which of the following points lies in $(L)$?|||Cho $(L)$ là đường thẳng đi qua $(1,-1)$ với hệ số góc $-1/2$. Điểm nào sau đây thuộc $(L)$?",
          "options": [
            {
              "text": "$(-2, 1/2)$|||$(-2, 1/2)$"
            },
            {
              "text": "$(-2, -3/2)$|||$(-2, -3/2)$"
            },
            {
              "text": "$(2, 1)$|||$(2, 1)$"
            },
            {
              "text": "$(2, 0)$|||$(2, 0)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(L): y+1=-\\tfrac12(x-1)\\Rightarrow y=-\\tfrac{x}{2}-\\tfrac12$. At $x=-2$: $y=1-\\tfrac12=\\tfrac12$, so $(-2,1/2)$ lies on the line.</div><div class=\"ml-vi\">$(L): y+1=-\\tfrac12(x-1)\\Rightarrow y=-\\tfrac{x}{2}-\\tfrac12$. Tại $x=-2$: $y=1-\\tfrac12=\\tfrac12$, nên $(-2,1/2)$ nằm trên đường thẳng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to1^{+}}\\dfrac{|x^2-4x+3|}{x-1}$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to1^{+}}\\dfrac{|x^2-4x+3|}{x-1}$",
          "options": [
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
            4
          ],
          "explanation": "<div class=\"ml-en\">$x^2-4x+3=(x-1)(x-3)$. For $x\\to1^{+}$ we have $x-1\\gt0$ and $x-3\\lt0$, so $|(x-1)(x-3)|=-(x-1)(x-3)$ and the quotient is $-(x-3)\\to-(1-3)=2$.</div><div class=\"ml-vi\">$x^2-4x+3=(x-1)(x-3)$. Khi $x\\to1^{+}$ thì $x-1\\gt0$ và $x-3\\lt0$ nên $|(x-1)(x-3)|=-(x-1)(x-3)$, thương bằng $-(x-3)\\to-(1-3)=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the numbers at which the function $f(x)=\\begin{cases}x^3+6 & \\text{if } x\\leq1\\\\ 2x & \\text{if } 1\\lt x\\leq3\\\\ 3-x & \\text{if } x\\gt3\\end{cases}$ is discontinuous.|||Tìm các giá trị tại đó hàm số $f(x)=\\begin{cases}x^3+6 & \\text{nếu } x\\leq1\\\\ 2x & \\text{nếu } 1\\lt x\\leq3\\\\ 3-x & \\text{nếu } x\\gt3\\end{cases}$ gián đoạn.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "1; 3|||1; 3"
            },
            {
              "text": "None of them|||Không giá trị nào"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">At $x=1$: left value $1+6=7$ but right limit $2(1)=2$ — discontinuous. At $x=3$: left value $2(3)=6$ but right limit $3-3=0$ — discontinuous. So $x=1$ and $x=3$.</div><div class=\"ml-vi\">Tại $x=1$: giá trị trái $1+6=7$ nhưng giới hạn phải $2(1)=2$ — gián đoạn. Tại $x=3$: giá trị trái $2(3)=6$ nhưng giới hạn phải $3-3=0$ — gián đoạn. Vậy $x=1$ và $x=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Simplify the quotient $\\dfrac{f(x+h)-f(x)}{h}$ for $f(x)=2x^2+x$.|||Rút gọn biểu thức $\\dfrac{f(x+h)-f(x)}{h}$ với $f(x)=2x^2+x$.",
          "options": [
            {
              "text": "$4x+2h+1$|||$4x+2h+1$"
            },
            {
              "text": "$4x-2h-1$|||$4x-2h-1$"
            },
            {
              "text": "$4x-2h+1$|||$4x-2h+1$"
            },
            {
              "text": "$2x+2h+1$|||$2x+2h+1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{2(x+h)^2+(x+h)-2x^2-x}{h}=\\dfrac{4xh+2h^2+h}{h}=4x+2h+1$.</div><div class=\"ml-vi\">$\\dfrac{2(x+h)^2+(x+h)-2x^2-x}{h}=\\dfrac{4xh+2h^2+h}{h}=4x+2h+1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find an equation of the tangent line to the curve $y=\\dfrac{\\sqrt{x}}{x+1}$ at $(4,0.4)$.|||Tìm phương trình tiếp tuyến của đường cong $y=\\dfrac{\\sqrt{x}}{x+1}$ tại $(4,0.4)$.",
          "options": [
            {
              "text": "$y=-0.03x+0.52$|||$y=-0.03x+0.52$"
            },
            {
              "text": "$y=-0.03x+0.28$|||$y=-0.03x+0.28$"
            },
            {
              "text": "$y=-0.03x-0.52$|||$y=-0.03x-0.52$"
            },
            {
              "text": "$y=-0.03x-0.28$|||$y=-0.03x-0.28$"
            },
            {
              "text": "$y=0.03x+0.52$|||$y=0.03x+0.52$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$y'=\\dfrac{\\frac{1}{2\\sqrt{x}}(x+1)-\\sqrt{x}}{(x+1)^2}$. At $x=4$: $\\dfrac{0.25(5)-2}{25}=\\dfrac{-0.75}{25}=-0.03$. Tangent: $y=0.4-0.03(x-4)=-0.03x+0.52$.</div><div class=\"ml-vi\">$y'=\\dfrac{\\frac{1}{2\\sqrt{x}}(x+1)-\\sqrt{x}}{(x+1)^2}$. Tại $x=4$: $\\dfrac{0.25(5)-2}{25}=\\dfrac{-0.75}{25}=-0.03$. Tiếp tuyến: $y=0.4-0.03(x-4)=-0.03x+0.52$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A rocket is fired vertically upward from the ground. The distance $s$ in feet that the rocket travels from the ground after $t$ seconds is given by $s(t)=-16t^2+560t$. Find the acceleration (ft/s²) of the rocket 2 seconds after being fired.|||Một tên lửa được phóng thẳng đứng lên từ mặt đất. Quãng đường $s$ (feet) tên lửa đi được sau $t$ giây là $s(t)=-16t^2+560t$. Tìm gia tốc (ft/s²) của tên lửa 2 giây sau khi phóng.",
          "options": [
            {
              "text": "-32|||-32"
            },
            {
              "text": "1077|||1077"
            },
            {
              "text": "496|||496"
            },
            {
              "text": "-496|||-496"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$v(t)=s'(t)=-32t+560$, $a(t)=s''(t)=-32$ — constant, so $a(2)=-32$.</div><div class=\"ml-vi\">$v(t)=s'(t)=-32t+560$, $a(t)=s''(t)=-32$ — hằng số, nên $a(2)=-32$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $f'(0)$ for $f(x)=\\cos(x^3+3x+4)$.|||Tìm $f'(0)$ với $f(x)=\\cos(x^3+3x+4)$.",
          "options": [
            {
              "text": "$-3\\sin(4)$|||$-3\\sin(4)$"
            },
            {
              "text": "$3\\sin(4)$|||$3\\sin(4)$"
            },
            {
              "text": "$3\\cos(4)$|||$3\\cos(4)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$\\cos(4)$|||$\\cos(4)$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=-\\sin(x^3+3x+4)\\cdot(3x^2+3)$. At $x=0$: $-\\sin(4)\\cdot3=-3\\sin(4)$.</div><div class=\"ml-vi\">$f'(x)=-\\sin(x^3+3x+4)\\cdot(3x^2+3)$. Tại $x=0$: $-\\sin(4)\\cdot3=-3\\sin(4)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $dy/dx$ by implicit differentiation: $9xy+2y-2=0$.<br>(i) $(-9y(x+1))/2$ (ii) $(-9y)/(9xy+2)$ (iii) $-9(x+y)/2$ (iv) $(-9y)/(9x+2)$|||Tìm $dy/dx$ bằng đạo hàm hàm ẩn: $9xy+2y-2=0$.<br>(i) $(-9y(x+1))/2$ (ii) $(-9y)/(9xy+2)$ (iii) $-9(x+y)/2$ (iv) $(-9y)/(9x+2)$",
          "options": [
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
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
          "explanation": "<div class=\"ml-en\">Differentiate: $9y+9xy'+2y'=0\\Rightarrow y'(9x+2)=-9y\\Rightarrow y'=\\dfrac{-9y}{9x+2}$, i.e. (iv).</div><div class=\"ml-vi\">Lấy đạo hàm hai vế: $9y+9xy'+2y'=0\\Rightarrow y'(9x+2)=-9y\\Rightarrow y'=\\dfrac{-9y}{9x+2}$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A particle moves along the curve $y^2=1+x^3$. As it reaches the point $(2,3)$, the $y$-coordinate is increasing at a rate of 4 cm/s. How fast is the $x$-coordinate of the point changing at that instant?|||Một chất điểm chuyển động trên đường cong $y^2=1+x^3$. Khi tới điểm $(2,3)$, tung độ $y$ tăng với tốc độ 4 cm/s. Hoành độ $x$ thay đổi nhanh thế nào tại thời điểm đó?",
          "options": [
            {
              "text": "2 cm/s|||2 cm/s"
            },
            {
              "text": "2/9 cm/s|||2/9 cm/s"
            },
            {
              "text": "1/9 cm/s|||1/9 cm/s"
            },
            {
              "text": "1 cm/s|||1 cm/s"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Differentiate: $2y\\,y'=3x^2x'$. At $(2,3)$: $2(3)(4)=3(4)x'\\Rightarrow24=12x'\\Rightarrow x'=2$ cm/s.</div><div class=\"ml-vi\">Lấy đạo hàm: $2y\\,y'=3x^2x'$. Tại $(2,3)$: $2(3)(4)=3(4)x'\\Rightarrow24=12x'\\Rightarrow x'=2$ cm/s.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the linear approximation of the function $f(x)=\\dfrac{1}{\\sqrt{1+2x}}$ at $x=0$.|||Tìm xấp xỉ tuyến tính của hàm số $f(x)=\\dfrac{1}{\\sqrt{1+2x}}$ tại $x=0$.",
          "options": [
            {
              "text": "$1-x$|||$1-x$"
            },
            {
              "text": "$1-3x$|||$1-3x$"
            },
            {
              "text": "$1+3x$|||$1+3x$"
            },
            {
              "text": "$x$|||$x$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=(1+2x)^{-1/2}$, $f(0)=1$; $f'(x)=-(1+2x)^{-3/2}$, $f'(0)=-1$. So $L(x)=1-x$.</div><div class=\"ml-vi\">$f(x)=(1+2x)^{-1/2}$, $f(0)=1$; $f'(x)=-(1+2x)^{-3/2}$, $f'(0)=-1$. Vậy $L(x)=1-x$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute maximum and absolute minimum values of $f(x)=\\dfrac{-1}{x^2}$ on $[1/2,\\ 2]$.|||Tìm giá trị lớn nhất và nhỏ nhất tuyệt đối của $f(x)=\\dfrac{-1}{x^2}$ trên $[1/2,\\ 2]$.",
          "options": [
            {
              "text": "Absolute maximum: -1/2, absolute minimum: -2|||Lớn nhất: -1/2, nhỏ nhất: -2"
            },
            {
              "text": "Absolute maximum: -1/4, absolute minimum: -2|||Lớn nhất: -1/4, nhỏ nhất: -2"
            },
            {
              "text": "Absolute maximum: -1/2, absolute minimum: -4|||Lớn nhất: -1/2, nhỏ nhất: -4"
            },
            {
              "text": "Absolute maximum: -1/4, absolute minimum: -4|||Lớn nhất: -1/4, nhỏ nhất: -4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=\\dfrac{2}{x^3}\\gt0$ on $(0,\\infty)$, so $f$ increases: minimum at $x=1/2$ giving $-4$, maximum at $x=2$ giving $-1/4$.</div><div class=\"ml-vi\">$f'(x)=\\dfrac{2}{x^3}\\gt0$ trên $(0,\\infty)$ nên $f$ đồng biến: nhỏ nhất tại $x=1/2$ bằng $-4$, lớn nhất tại $x=2$ bằng $-1/4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Determine where the function $f(x)=x^4-24x^2$ is concave up and where it is concave down.<br>(i) Concave down on $(-\\infty,-3)$ and $(3,\\infty)$, concave up on $(-3,3)$ (ii) Concave down on $(-\\infty,-2)$ and $(2,\\infty)$, concave up on $(-2,2)$ (iii) Concave up on $(-\\infty,-3)$ and $(3,\\infty)$, concave down on $(-3,3)$ (iv) Concave up on $(-\\infty,-2)$ and $(2,\\infty)$, concave down on $(-2,2)$|||Xác định khoảng lồi/lõm của hàm số $f(x)=x^4-24x^2$.<br>(i) Lõm xuống trên $(-\\infty,-3)$ và $(3,\\infty)$, lõm lên trên $(-3,3)$ (ii) Lõm xuống trên $(-\\infty,-2)$ và $(2,\\infty)$, lõm lên trên $(-2,2)$ (iii) Lõm lên trên $(-\\infty,-3)$ và $(3,\\infty)$, lõm xuống trên $(-3,3)$ (iv) Lõm lên trên $(-\\infty,-2)$ và $(2,\\infty)$, lõm xuống trên $(-2,2)$",
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
          "explanation": "<div class=\"ml-en\">$f''(x)=12x^2-48=12(x^2-4)$, positive when $|x|\\gt2$ and negative when $|x|\\lt2$: concave up on $(-\\infty,-2)$ and $(2,\\infty)$, concave down on $(-2,2)$, i.e. (iv).</div><div class=\"ml-vi\">$f''(x)=12x^2-48=12(x^2-4)$, dương khi $|x|\\gt2$ và âm khi $|x|\\lt2$: lõm lên trên $(-\\infty,-2)$ và $(2,\\infty)$, lõm xuống trên $(-2,2)$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the vertical and horizontal asymptotes of the graph of the following function $f(x)=x+\\dfrac{1}{x-1}$|||Tìm tiệm cận đứng và tiệm cận ngang của đồ thị hàm số $f(x)=x+\\dfrac{1}{x-1}$",
          "options": [
            {
              "text": "vertical asymptote $x=1$ and horizontal asymptote $y=0$|||tiệm cận đứng $x=1$ và tiệm cận ngang $y=0$"
            },
            {
              "text": "vertical asymptote $x=0$ and horizontal asymptote $y=-1$|||tiệm cận đứng $x=0$ và tiệm cận ngang $y=-1$"
            },
            {
              "text": "vertical asymptote $x=1$ and there is no horizontal asymptote|||tiệm cận đứng $x=1$ và KHÔNG có tiệm cận ngang"
            },
            {
              "text": "There is no vertical and no horizontal asymptote|||Không có tiệm cận đứng cũng như tiệm cận ngang"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">As $x\\to1$, $f\\to\\pm\\infty$, so $x=1$ is a vertical asymptote. As $x\\to\\pm\\infty$, $f(x)\\approx x\\to\\pm\\infty$, so there is no horizontal asymptote (there is a slant asymptote $y=x$).</div><div class=\"ml-vi\">Khi $x\\to1$ thì $f\\to\\pm\\infty$ nên $x=1$ là tiệm cận đứng. Khi $x\\to\\pm\\infty$ thì $f(x)\\approx x\\to\\pm\\infty$ nên KHÔNG có tiệm cận ngang (chỉ có tiệm cận xiên $y=x$).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the minimum of the sum of two positive numbers whose product is 324.|||Tìm giá trị nhỏ nhất của tổng hai số dương có tích bằng 324.",
          "options": [
            {
              "text": "36|||36"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "42|||42"
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
          "explanation": "<div class=\"ml-en\">By AM-GM, $x+y\\geq2\\sqrt{xy}=2\\sqrt{324}=2(18)=36$, with equality when $x=y=18$.</div><div class=\"ml-vi\">Theo bất đẳng thức AM-GM, $x+y\\geq2\\sqrt{xy}=2\\sqrt{324}=2(18)=36$, dấu bằng khi $x=y=18$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the specified initial approximation $x_1$ to find $x_3$, the third approximation to the root of the given equation $x^4-13=0$, $x_1=2$. (Give your answer to four decimal places.)|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1$ để tìm $x_3$, xấp xỉ thứ ba của nghiệm phương trình $x^4-13=0$, $x_1=2$. (Làm tròn 4 chữ số thập phân.)",
          "options": [
            {
              "text": "1.8989|||1.8989"
            },
            {
              "text": "1.9063|||1.9063"
            },
            {
              "text": "1.9898|||1.9898"
            },
            {
              "text": "1.9686|||1.9686"
            },
            {
              "text": "1.8686|||1.8686"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=x^4-13$, $f'(x)=4x^3$. $x_2=2-\\dfrac{3}{32}=1.90625$. Then $f(1.90625)\\approx0.20443$, $f'(1.90625)\\approx27.7076$, so $x_3\\approx1.90625-0.00738=1.8989$.</div><div class=\"ml-vi\">$f(x)=x^4-13$, $f'(x)=4x^3$. $x_2=2-\\dfrac{3}{32}=1.90625$. Tiếp theo $f(1.90625)\\approx0.20443$, $f'(1.90625)\\approx27.7076$, nên $x_3\\approx1.90625-0.00738=1.8989$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Approximate the area under the graph of $f(x)=x^2+2$ over the interval $[0,5]$ using 5 subintervals and left endpoints.|||Xấp xỉ diện tích dưới đồ thị $f(x)=x^2+2$ trên đoạn $[0,5]$ với 5 khoảng chia và mút TRÁI.",
          "options": [
            {
              "text": "40|||40"
            },
            {
              "text": "65|||65"
            },
            {
              "text": "73|||73"
            },
            {
              "text": "66|||66"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=1$, left endpoints $0,1,2,3,4$: $L_5=2+3+6+11+18=40$.</div><div class=\"ml-vi\">$\\Delta x=1$, các mút trái $0,1,2,3,4$: $L_5=2+3+6+11+18=40$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\displaystyle\\int_1^5 f(x)dx=7$, $\\displaystyle\\int_1^5 g(x)dx=8$. Find $\\displaystyle\\int_1^5[2f(x)+3g(x)+1]dx$.|||Cho $\\displaystyle\\int_1^5 f(x)dx=7$, $\\displaystyle\\int_1^5 g(x)dx=8$. Tính $\\displaystyle\\int_1^5[2f(x)+3g(x)+1]dx$.",
          "options": [
            {
              "text": "38|||38"
            },
            {
              "text": "42|||42"
            },
            {
              "text": "37|||37"
            },
            {
              "text": "41|||41"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$2(7)+3(8)+\\int_1^5 1\\,dx=14+24+4=42$.</div><div class=\"ml-vi\">$2(7)+3(8)+\\int_1^5 1\\,dx=14+24+4=42$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the average value of $f(x)=5x-2$ over the interval $[0,3]$.|||Tìm giá trị trung bình của $f(x)=5x-2$ trên đoạn $[0,3]$.",
          "options": [
            {
              "text": "12.5|||12.5"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "5.5|||5.5"
            },
            {
              "text": "16.5|||16.5"
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
          "explanation": "<div class=\"ml-en\">$\\dfrac13\\int_0^3(5x-2)dx=\\dfrac13\\left[\\dfrac{5x^2}{2}-2x\\right]_0^3=\\dfrac13(22.5-6)=\\dfrac{16.5}{3}=5.5$.</div><div class=\"ml-vi\">$\\dfrac13\\int_0^3(5x-2)dx=\\dfrac13\\left[\\dfrac{5x^2}{2}-2x\\right]_0^3=\\dfrac13(22.5-6)=\\dfrac{16.5}{3}=5.5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_3^4(t+\\sqrt3)(t-\\sqrt3)\\,dt$|||Tính $\\displaystyle\\int_3^4(t+\\sqrt3)(t-\\sqrt3)\\,dt$",
          "options": [
            {
              "text": "-26/3|||-26/3"
            },
            {
              "text": "34|||34"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "28/3|||28/3"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$(t+\\sqrt3)(t-\\sqrt3)=t^2-3$, so the integral is $\\left[\\dfrac{t^3}{3}-3t\\right]_3^4=\\left(\\dfrac{64}{3}-12\\right)-(9-9)=\\dfrac{28}{3}$.</div><div class=\"ml-vi\">$(t+\\sqrt3)(t-\\sqrt3)=t^2-3$, nên tích phân bằng $\\left[\\dfrac{t^3}{3}-3t\\right]_3^4=\\left(\\dfrac{64}{3}-12\\right)-(9-9)=\\dfrac{28}{3}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int\\dfrac{x^3}{4x^4+3}dx$.<br>(i) $(1/16)\\ln|4x^4+4|+C$ (ii) $(1/4)\\ln|4x^4+3|+C$ (iii) $(1/16)\\ln|4x^4+3|+C$ (iv) $16\\ln|4x^4+3|+C$|||Tính $\\displaystyle\\int\\dfrac{x^3}{4x^4+3}dx$.<br>(i) $(1/16)\\ln|4x^4+4|+C$ (ii) $(1/4)\\ln|4x^4+3|+C$ (iii) $(1/16)\\ln|4x^4+3|+C$ (iv) $16\\ln|4x^4+3|+C$",
          "options": [
            {
              "text": "(iii)|||(iii)"
            },
            {
              "text": "(iv)|||(iv)"
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
          "explanation": "<div class=\"ml-en\">Let $u=4x^4+3$, $du=16x^3dx$: $\\dfrac{1}{16}\\int\\dfrac{du}{u}=\\dfrac{1}{16}\\ln|4x^4+3|+C$, i.e. (iii).</div><div class=\"ml-vi\">Đặt $u=4x^4+3$, $du=16x^3dx$: $\\dfrac{1}{16}\\int\\dfrac{du}{u}=\\dfrac{1}{16}\\ln|4x^4+3|+C$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the integral $\\displaystyle\\int e^{-x}(x^2+1)dx$.<br>(i) $-e^{-x}(x^2-2x+3)+C$ (ii) $e^{-x}(x^2+2x+3)+C$ (iii) $-e^{-x}(x^2+2x+3)+C$ (iv) $e^{-x}(x^2-2x+3)+C$|||Tính tích phân $\\displaystyle\\int e^{-x}(x^2+1)dx$.<br>(i) $-e^{-x}(x^2-2x+3)+C$ (ii) $e^{-x}(x^2+2x+3)+C$ (iii) $-e^{-x}(x^2+2x+3)+C$ (iv) $e^{-x}(x^2-2x+3)+C$",
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
          "explanation": "<div class=\"ml-en\">Check by differentiating (iii): $\\dfrac{d}{dx}\\left[-e^{-x}(x^2+2x+3)\\right]=e^{-x}(x^2+2x+3)-e^{-x}(2x+2)=e^{-x}(x^2+1)$ ✓.</div><div class=\"ml-vi\">Kiểm bằng cách đạo hàm (iii): $\\dfrac{d}{dx}\\left[-e^{-x}(x^2+2x+3)\\right]=e^{-x}(x^2+2x+3)-e^{-x}(2x+2)=e^{-x}(x^2+1)$ ✓.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using Simpson's Rule with $n=8$ to approximate $\\displaystyle\\int_0^8 f(x)dx$ from the table below.<table class=\"exam-table\"><thead><tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead><tbody><tr><td>f(x)</td><td>3</td><td>1</td><td>2</td><td>5</td><td>3</td><td>8</td><td>7</td><td>6</td><td>2</td></tr></tbody></table>|||Dùng quy tắc Simpson với $n=8$ để xấp xỉ $\\displaystyle\\int_0^8 f(x)dx$ theo bảng dưới đây.<table class=\"exam-table\"><thead><tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead><tbody><tr><td>f(x)</td><td>3</td><td>1</td><td>2</td><td>5</td><td>3</td><td>8</td><td>7</td><td>6</td><td>2</td></tr></tbody></table>",
          "options": [
            {
              "text": "40|||40"
            },
            {
              "text": "36.3|||36.3"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "34.5|||34.5"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$h=1$: $S=\\dfrac{h}{3}[f_0+4f_1+2f_2+4f_3+2f_4+4f_5+2f_6+4f_7+f_8]=\\dfrac13[3+4+4+20+6+32+14+24+2]=\\dfrac{109}{3}\\approx36.3$.</div><div class=\"ml-vi\">$h=1$: $S=\\dfrac{h}{3}[f_0+4f_1+2f_2+4f_3+2f_4+4f_5+2f_6+4f_7+f_8]=\\dfrac13[3+4+4+20+6+32+14+24+2]=\\dfrac{109}{3}\\approx36.3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are improper integrals?<br>(i) $\\displaystyle\\int_{-\\infty}^{0}e^x\\,dx$ (ii) $\\displaystyle\\int_0^5\\dfrac{1}{|x-2|}dx$|||Tích phân nào sau đây là tích phân suy rộng?<br>(i) $\\displaystyle\\int_{-\\infty}^{0}e^x\\,dx$ (ii) $\\displaystyle\\int_0^5\\dfrac{1}{|x-2|}dx$",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of the other choices is correct.|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) has an infinite limit of integration; (ii) has an infinite discontinuity at $x=2$ inside $[0,5]$. Both are improper.</div><div class=\"ml-vi\">(i) có cận vô hạn; (ii) có điểm gián đoạn vô cực tại $x=2$ nằm trong $[0,5]$. Cả hai đều là tích phân suy rộng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following matrices is the reduced row-echelon form of the matrix $\\begin{bmatrix}1&2&0&1\\\\0&1&3&2\\\\0&0&0&1\\end{bmatrix}$?<br>(i) $\\begin{bmatrix}1&0&-6&0\\\\0&1&3&0\\\\0&0&0&1\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&0&0&0\\\\0&1&3&0\\\\0&0&0&1\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&0&6&0\\\\0&1&3&0\\\\0&0&0&1\\end{bmatrix}$ (iv) $\\begin{bmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&0&1\\end{bmatrix}$|||Ma trận nào sau đây là dạng bậc thang rút gọn (rref) của ma trận $\\begin{bmatrix}1&2&0&1\\\\0&1&3&2\\\\0&0&0&1\\end{bmatrix}$?<br>(i) $\\begin{bmatrix}1&0&-6&0\\\\0&1&3&0\\\\0&0&0&1\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&0&0&0\\\\0&1&3&0\\\\0&0&0&1\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&0&6&0\\\\0&1&3&0\\\\0&0&0&1\\end{bmatrix}$ (iv) $\\begin{bmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&0&1\\end{bmatrix}$",
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
            1
          ],
          "explanation": "<div class=\"ml-en\">$R_1\\to R_1-2R_2$ gives $[1,0,-6,-3]$; then clear column 4 with $R_3$: $R_1\\to R_1+3R_3=[1,0,-6,0]$, $R_2\\to R_2-2R_3=[0,1,3,0]$. Result is (i).</div><div class=\"ml-vi\">$R_1\\to R_1-2R_2$ cho $[1,0,-6,-3]$; sau đó khử cột 4 bằng $R_3$: $R_1\\to R_1+3R_3=[1,0,-6,0]$, $R_2\\to R_2-2R_3=[0,1,3,0]$. Kết quả là (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve for $z$ from the system $\\begin{cases}x-2y+3z=1\\\\ -x+4y-7z=3\\\\ 2x+y+2z=12\\end{cases}$|||Giải tìm $z$ từ hệ $\\begin{cases}x-2y+3z=1\\\\ -x+4y-7z=3\\\\ 2x+y+2z=12\\end{cases}$",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "-5|||-5"
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
            0
          ],
          "explanation": "<div class=\"ml-en\">Adding equations 1 and 2: $2y-4z=4\\Rightarrow y=2+2z$. From equation 1: $x=1+2y-3z=5+z$. Substituting into equation 3: $2(5+z)+(2+2z)+2z=12\\Rightarrow12+6z=12\\Rightarrow z=0$.</div><div class=\"ml-vi\">Cộng phương trình 1 và 2: $2y-4z=4\\Rightarrow y=2+2z$. Từ phương trình 1: $x=1+2y-3z=5+z$. Thay vào phương trình 3: $2(5+z)+(2+2z)+2z=12\\Rightarrow12+6z=12\\Rightarrow z=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find conditions on $a,b,c$ such that the system $\\begin{cases}x-y+2z=a\\\\ 3x+y-z=b\\\\ 5x+3y-4z=c\\end{cases}$ has infinitely many solutions.|||Tìm điều kiện của $a,b,c$ để hệ $\\begin{cases}x-y+2z=a\\\\ 3x+y-z=b\\\\ 5x+3y-4z=c\\end{cases}$ có vô số nghiệm.",
          "options": [
            {
              "text": "$a-2b+c=0$|||$a-2b+c=0$"
            },
            {
              "text": "$a-2b+c$ is not 0|||$a-2b+c$ khác 0"
            },
            {
              "text": "$b-2c+a$ is not 0|||$b-2c+a$ khác 0"
            },
            {
              "text": "$b-2c+a=0$|||$b-2c+a=0$"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Row 3 of the coefficient matrix equals $-R_1+2R_2$ (check: $-1+6=5$, $1+2=3$, $-2-2=-4$). Consistency with infinitely many solutions therefore requires $c=-a+2b$, i.e. $a-2b+c=0$.</div><div class=\"ml-vi\">Hàng 3 của ma trận hệ số bằng $-R_1+2R_2$ (kiểm: $-1+6=5$, $1+2=3$, $-2-2=-4$). Do đó để hệ tương thích và có vô số nghiệm cần $c=-a+2b$, tức $a-2b+c=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}3&-1&2\\\\1&-2&6\\\\-1&0&8\\end{bmatrix}$ and $B=\\begin{bmatrix}2&3&-1\\\\1&1&-2\\\\-1&2&1\\end{bmatrix}$. Find the $(3,2)$-entry of the matrix $2A-3B^T$.|||Cho $A=\\begin{bmatrix}3&-1&2\\\\1&-2&6\\\\-1&0&8\\end{bmatrix}$ và $B=\\begin{bmatrix}2&3&-1\\\\1&1&-2\\\\-1&2&1\\end{bmatrix}$. Tìm phần tử $(3,2)$ của ma trận $2A-3B^T$.",
          "options": [
            {
              "text": "-6|||-6"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "None of them|||Không cái nào"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$A_{32}=0$ and $(B^T)_{32}=B_{23}=-2$. So the entry is $2(0)-3(-2)=6$.</div><div class=\"ml-vi\">$A_{32}=0$ và $(B^T)_{32}=B_{23}=-2$. Vậy phần tử đó là $2(0)-3(-2)=6$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Write the matrix equation $\\begin{bmatrix}2&3\\\\-3&-2\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}4\\\\5\\end{bmatrix}$ as a system of linear equations.|||Viết phương trình ma trận $\\begin{bmatrix}2&3\\\\-3&-2\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}4\\\\5\\end{bmatrix}$ thành hệ phương trình tuyến tính.",
          "options": [
            {
              "text": "$2x+3y=4$, $-3x-2y=5$|||$2x+3y=4$, $-3x-2y=5$"
            },
            {
              "text": "$2x+3y=5$, $-3x-2y=4$|||$2x+3y=5$, $-3x-2y=4$"
            },
            {
              "text": "$2x-3y=4$, $3x-2y=5$|||$2x-3y=4$, $3x-2y=5$"
            },
            {
              "text": "$2x-3y=5$, $3x-2y=4$|||$2x-3y=5$, $3x-2y=4$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Row 1 gives $2x+3y=4$; row 2 gives $-3x-2y=5$.</div><div class=\"ml-vi\">Hàng 1 cho $2x+3y=4$; hàng 2 cho $-3x-2y=5$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=(a_{ij})$ be a $3\\times3$ matrix with $a_{ij}=i-j$ for all $1\\leq i,j\\leq3$. Find the $(2,3)$-entry of the matrix $A^2$.|||Cho $A=(a_{ij})$ là ma trận $3\\times3$ với $a_{ij}=i-j$ với mọi $1\\leq i,j\\leq3$. Tìm phần tử $(2,3)$ của ma trận $A^2$.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "-3|||-3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A=\\begin{bmatrix}0&-1&-2\\\\1&0&-1\\\\2&1&0\\end{bmatrix}$. The $(2,3)$-entry of $A^2$ is row 2 of $A$ times column 3 of $A$: $(1,0,-1)\\cdot(-2,-1,0)=-2$.</div><div class=\"ml-vi\">$A=\\begin{bmatrix}0&-1&-2\\\\1&0&-1\\\\2&1&0\\end{bmatrix}$. Phần tử $(2,3)$ của $A^2$ là hàng 2 nhân cột 3: $(1,0,-1)\\cdot(-2,-1,0)=-2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ and $B$ be square matrices of the same size. Which of the following statements are true?<br>(i) If $AB=-3I$ then $A$ and $B$ are both invertible. (ii) If $A^TB=3I$ then $A$ and $B$ are both invertible.|||Cho $A$ và $B$ là các ma trận vuông cùng cỡ. Phát biểu nào sau đây đúng?<br>(i) Nếu $AB=-3I$ thì $A$ và $B$ đều khả nghịch. (ii) Nếu $A^TB=3I$ thì $A$ và $B$ đều khả nghịch.",
          "options": [
            {
              "text": "Only (i).|||Chỉ (i)."
            },
            {
              "text": "Both (i) and (ii).|||Cả (i) và (ii)."
            },
            {
              "text": "Only (ii).|||Chỉ (ii)."
            },
            {
              "text": "None of them.|||Không cái nào."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) $\\det A\\det B=\\det(-3I)\\neq0$, so both determinants are nonzero. (ii) $\\det(A^T)\\det B=\\det(3I)\\neq0$ and $\\det A^T=\\det A$, so again both are invertible. Both statements are true.</div><div class=\"ml-vi\">(i) $\\det A\\det B=\\det(-3I)\\neq0$ nên cả hai định thức đều khác 0. (ii) $\\det(A^T)\\det B=\\det(3I)\\neq0$ và $\\det A^T=\\det A$ nên cả hai đều khả nghịch. Cả hai phát biểu đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ be a linear transformation with matrix $\\begin{bmatrix}-1&0\\\\0&0\\end{bmatrix}$. Which of the following statements is true?<br>(i) $T$ is the reflection in the $x$-axis. (ii) $T$ is the reflection in the $y$-axis. (iii) $T$ is the projection onto the $x$-axis. (iv) $T$ is the projection onto the $y$-axis.|||Cho $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ là ánh xạ tuyến tính với ma trận $\\begin{bmatrix}-1&0\\\\0&0\\end{bmatrix}$. Phát biểu nào sau đây đúng?<br>(i) $T$ là phép đối xứng qua trục $x$. (ii) $T$ là phép đối xứng qua trục $y$. (iii) $T$ là phép chiếu lên trục $x$. (iv) $T$ là phép chiếu lên trục $y$.",
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
          "explanation": "<div class=\"ml-en\">The standard matrices are: reflection in $x$-axis $\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$, reflection in $y$-axis $\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$, projection onto $x$-axis $\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$, projection onto $y$-axis $\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$. The given matrix matches none of them (it is a projection followed by a reflection), so the answer is 'none'.</div><div class=\"ml-vi\">Các ma trận chuẩn là: đối xứng qua trục $x$ $\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$, đối xứng qua trục $y$ $\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}$, chiếu lên trục $x$ $\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$, chiếu lên trục $y$ $\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$. Ma trận đề cho không khớp cái nào (nó là phép chiếu rồi lấy đối xứng), nên chọn 'không đáp án nào'.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The $(2,3)$-cofactor of the matrix $\\begin{bmatrix}1&3&-2\\\\4&5&-7\\\\8&15&10\\end{bmatrix}$ is ________|||Phần bù đại số (cofactor) $(2,3)$ của ma trận $\\begin{bmatrix}1&3&-2\\\\4&5&-7\\\\8&15&10\\end{bmatrix}$ là ________",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$C_{23}=(-1)^{2+3}\\det\\begin{bmatrix}1&3\\\\8&15\\end{bmatrix}=-(15-24)=9$.</div><div class=\"ml-vi\">$C_{23}=(-1)^{2+3}\\det\\begin{bmatrix}1&3\\\\8&15\\end{bmatrix}=-(15-24)=9$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&0&-2\\\\3&1&4\\\\5&2&-3\\end{bmatrix}$. Find $\\det(2A^{-1})$.|||Cho $A=\\begin{bmatrix}1&0&-2\\\\3&1&4\\\\5&2&-3\\end{bmatrix}$. Tính $\\det(2A^{-1})$.",
          "options": [
            {
              "text": "-8/13|||-8/13"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-2/13|||-2/13"
            },
            {
              "text": "-26|||-26"
            },
            {
              "text": "13/8|||13/8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\det A=1(-3-8)-0+(-2)(6-5)=-11-2=-13$. Then $\\det(2A^{-1})=\\dfrac{2^3}{\\det A}=\\dfrac{8}{-13}=-\\dfrac{8}{13}$.</div><div class=\"ml-vi\">$\\det A=1(-3-8)-0+(-2)(6-5)=-11-2=-13$. Do đó $\\det(2A^{-1})=\\dfrac{2^3}{\\det A}=\\dfrac{8}{-13}=-\\dfrac{8}{13}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ and $B$ be $3\\times3$ matrices such that $\\det A=1$, $\\det B=3$. Find $\\det(2AB^{-1})$.|||Cho $A$ và $B$ là các ma trận $3\\times3$ với $\\det A=1$, $\\det B=3$. Tính $\\det(2AB^{-1})$.",
          "options": [
            {
              "text": "2/3|||2/3"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "8/3|||8/3"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\det(2AB^{-1})=2^3\\cdot\\dfrac{\\det A}{\\det B}=8\\cdot\\dfrac{1}{3}=\\dfrac{8}{3}$.</div><div class=\"ml-vi\">$\\det(2AB^{-1})=2^3\\cdot\\dfrac{\\det A}{\\det B}=8\\cdot\\dfrac{1}{3}=\\dfrac{8}{3}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $x=[-1,2]^T$, $y=[2,1]^T$, $z=[3,-1]^T$ be vectors in $\\mathbb{R}^2$ and $A=\\begin{bmatrix}-2&-2\\\\2&3\\end{bmatrix}$. Which are eigenvectors of the matrix $A$?|||Cho $x=[-1,2]^T$, $y=[2,1]^T$, $z=[3,-1]^T$ là các vectơ trong $\\mathbb{R}^2$ và $A=\\begin{bmatrix}-2&-2\\\\2&3\\end{bmatrix}$. Vectơ nào là vectơ riêng của $A$?",
          "options": [
            {
              "text": "All of $x$, $y$ and $z$|||Cả $x$, $y$ và $z$"
            },
            {
              "text": "Only $x$ and $y$|||Chỉ $x$ và $y$"
            },
            {
              "text": "Only $x$|||Chỉ $x$"
            },
            {
              "text": "Only $z$|||Chỉ $z$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$Ax=(-2(-1)-2(2),\\ 2(-1)+3(2))=(-2,4)=2x$ ✓. $Ay=(-6,7)$ is not a multiple of $(2,1)$; $Az=(-4,3)$ is not a multiple of $(3,-1)$. Only $x$ is an eigenvector.</div><div class=\"ml-vi\">$Ax=(-2(-1)-2(2),\\ 2(-1)+3(2))=(-2,4)=2x$ ✓. $Ay=(-6,7)$ không tỉ lệ với $(2,1)$; $Az=(-4,3)$ không tỉ lệ với $(3,-1)$. Chỉ $x$ là vectơ riêng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\vec{u}=[1\\ \\ 2\\ \\ 3]^T$, $\\vec{v}=[-1\\ \\ 0\\ \\ 2]^T$. Let $\\vec{x}$ be such that $\\vec{u}-\\vec{v}=\\|\\vec{x}\\|\\vec{x}$. Find the length of $\\vec{x}$.|||Cho $\\vec{u}=[1\\ \\ 2\\ \\ 3]^T$, $\\vec{v}=[-1\\ \\ 0\\ \\ 2]^T$. Gọi $\\vec{x}$ thoả $\\vec{u}-\\vec{v}=\\|\\vec{x}\\|\\vec{x}$. Tìm độ dài của $\\vec{x}$.",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\vec{u}-\\vec{v}=(2,2,1)$ with length $3$. Taking norms: $\\|\\|\\vec{x}\\|\\vec{x}\\|=\\|\\vec{x}\\|^2=3$, so $\\|\\vec{x}\\|=\\sqrt3$, which is not among the numeric choices.</div><div class=\"ml-vi\">$\\vec{u}-\\vec{v}=(2,2,1)$ có độ dài $3$. Lấy chuẩn hai vế: $\\|\\|\\vec{x}\\|\\vec{x}\\|=\\|\\vec{x}\\|^2=3$, nên $\\|\\vec{x}\\|=\\sqrt3$ — không nằm trong các lựa chọn số, do đó chọn 'không đáp án nào đúng'.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $P=(a,b,c)$ be the point on the line $x=1+t$, $y=-1+2t$, $z=3+t$ that is closest to the point $C=(1;-1;0)$. Find $a$.|||Gọi $P=(a,b,c)$ là điểm trên đường thẳng $x=1+t$, $y=-1+2t$, $z=3+t$ gần điểm $C=(1;-1;0)$ nhất. Tìm $a$.",
          "options": [
            {
              "text": "All other choices are incorrect|||Tất cả lựa chọn khác đều sai"
            },
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "-1/2|||-1/2"
            },
            {
              "text": "-1|||-1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\overrightarrow{CP}=(t,2t,3+t)$ must be perpendicular to the direction $(1,2,1)$: $t+4t+3+t=0\\Rightarrow6t=-3\\Rightarrow t=-\\tfrac12$. Hence $a=1+t=\\tfrac12$.</div><div class=\"ml-vi\">$\\overrightarrow{CP}=(t,2t,3+t)$ phải vuông góc với vectơ chỉ phương $(1,2,1)$: $t+4t+3+t=0\\Rightarrow6t=-3\\Rightarrow t=-\\tfrac12$. Vậy $a=1+t=\\tfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the second coordinate of the projection of the vector $\\vec{u}=[1\\ \\ 2\\ \\ -1]^T$ on the vector $\\vec{v}=[0\\ \\ 2\\ \\ 1]^T$.|||Tìm toạ độ thứ hai của hình chiếu của vectơ $\\vec{u}=[1\\ \\ 2\\ \\ -1]^T$ lên vectơ $\\vec{v}=[0\\ \\ 2\\ \\ 1]^T$.",
          "options": [
            {
              "text": "2/5|||2/5"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả lựa chọn khác đều sai"
            },
            {
              "text": "6/5|||6/5"
            },
            {
              "text": "3/5|||3/5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\mathrm{proj}_{\\vec v}\\vec u=\\dfrac{\\vec u\\cdot\\vec v}{\\vec v\\cdot\\vec v}\\vec v=\\dfrac{0+4-1}{0+4+1}(0,2,1)=\\dfrac35(0,2,1)=(0,\\tfrac65,\\tfrac35)$. The second coordinate is $\\dfrac65$.</div><div class=\"ml-vi\">$\\mathrm{proj}_{\\vec v}\\vec u=\\dfrac{\\vec u\\cdot\\vec v}{\\vec v\\cdot\\vec v}\\vec v=\\dfrac{0+4-1}{0+4+1}(0,2,1)=\\dfrac35(0,2,1)=(0,\\tfrac65,\\tfrac35)$. Toạ độ thứ hai là $\\dfrac65$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The area of the parallelogram determined by the vectors $\\mathbf{u}$ and $\\mathbf{v}$ is 100. Find the area of the parallelogram determined by the vectors $\\mathbf{u}$ and $2\\mathbf{u}+3\\mathbf{v}$.|||Diện tích hình bình hành tạo bởi hai vectơ $\\mathbf{u}$ và $\\mathbf{v}$ bằng 100. Tìm diện tích hình bình hành tạo bởi $\\mathbf{u}$ và $2\\mathbf{u}+3\\mathbf{v}$.",
          "options": [
            {
              "text": "500|||500"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "300|||300"
            },
            {
              "text": "200|||200"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\|\\mathbf{u}\\times(2\\mathbf{u}+3\\mathbf{v})\\|=3\\|\\mathbf{u}\\times\\mathbf{v}\\|=3(100)=300$ since $\\mathbf{u}\\times\\mathbf{u}=\\mathbf{0}$.</div><div class=\"ml-vi\">$\\|\\mathbf{u}\\times(2\\mathbf{u}+3\\mathbf{v})\\|=3\\|\\mathbf{u}\\times\\mathbf{v}\\|=3(100)=300$ vì $\\mathbf{u}\\times\\mathbf{u}=\\mathbf{0}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T$ be projection on the line $y=x$ followed by reflection in the $x$-axis in the $xy$-plane. Find the sum of all entries in the first row of the matrix of $T$.|||Cho $T$ là phép chiếu lên đường thẳng $y=x$ rồi lấy đối xứng qua trục $x$ trong mặt phẳng $xy$. Tìm tổng các phần tử ở hàng đầu của ma trận $T$.",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Projection on $y=x$: $P=\\tfrac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$; reflection in $x$-axis: $R=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Then $T=RP=\\tfrac12\\begin{bmatrix}1&1\\\\-1&-1\\end{bmatrix}$, and the first row sums to $\\tfrac12+\\tfrac12=1$.</div><div class=\"ml-vi\">Phép chiếu lên $y=x$: $P=\\tfrac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$; đối xứng qua trục $x$: $R=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Khi đó $T=RP=\\tfrac12\\begin{bmatrix}1&1\\\\-1&-1\\end{bmatrix}$, tổng hàng đầu bằng $\\tfrac12+\\tfrac12=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following sets are subspaces of $\\mathbb{R}^3$?<br>$U=\\{(x,y,x-y)\\mid x,y \\text{ are real numbers}\\}$; $V=\\{(x,y,xy)\\mid x,y \\text{ are real numbers}\\}$|||Tập nào sau đây là không gian con của $\\mathbb{R}^3$?<br>$U=\\{(x,y,x-y)\\mid x,y \\text{ là số thực}\\}$; $V=\\{(x,y,xy)\\mid x,y \\text{ là số thực}\\}$",
          "options": [
            {
              "text": "None of $U$ and $V$|||Không tập nào"
            },
            {
              "text": "Both $U$ and $V$|||Cả $U$ và $V$"
            },
            {
              "text": "$U$ only|||Chỉ $U$"
            },
            {
              "text": "$V$ only|||Chỉ $V$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$U=\\mathrm{span}\\{(1,0,1),(0,1,-1)\\}$ is a subspace. $V$ is not closed under scalar multiplication: $2(1,1,1)=(2,2,2)$ but $2\\cdot2=4\\neq2$.</div><div class=\"ml-vi\">$U=\\mathrm{span}\\{(1,0,1),(0,1,-1)\\}$ là không gian con. $V$ không đóng với phép nhân vô hướng: $2(1,1,1)=(2,2,2)$ nhưng $2\\cdot2=4\\neq2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{X,Y,Z\\}$ be a set of linearly independent vectors. Which of the following sets are linearly independent?<br>(i) $\\{X+Y,\\ Y+Z,\\ Z+X\\}$ (ii) $\\{X-Y,\\ Y-Z,\\ Z-X\\}$|||Cho $\\{X,Y,Z\\}$ là hệ vectơ độc lập tuyến tính. Hệ nào sau đây độc lập tuyến tính?<br>(i) $\\{X+Y,\\ Y+Z,\\ Z+X\\}$ (ii) $\\{X-Y,\\ Y-Z,\\ Z-X\\}$",
          "options": [
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "None of (i) or (ii)|||Không hệ nào"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "Only (i)|||Chỉ (i)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For (i) the coefficient matrix $\\begin{bmatrix}1&1&0\\\\0&1&1\\\\1&0&1\\end{bmatrix}$ has determinant $2\\neq0$ — independent. For (ii) the three vectors sum to $\\mathbf{0}$ — dependent.</div><div class=\"ml-vi\">Với (i), ma trận hệ số $\\begin{bmatrix}1&1&0\\\\0&1&1\\\\1&0&1\\end{bmatrix}$ có định thức $2\\neq0$ — độc lập. Với (ii), tổng ba vectơ bằng $\\mathbf{0}$ — phụ thuộc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following sets are bases for $\\mathbb{R}^3$?<br>(i) $\\{(1,1,1),(1,8,9),(0,3,4)\\}$ (ii) $\\{(0,3,1),(1,-8,9),(0,3,4),(2,3,5)\\}$|||Tập nào sau đây là cơ sở của $\\mathbb{R}^3$?<br>(i) $\\{(1,1,1),(1,8,9),(0,3,4)\\}$ (ii) $\\{(0,3,1),(1,-8,9),(0,3,4),(2,3,5)\\}$",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of (i) or (ii)|||Không tập nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(i): $\\det\\begin{bmatrix}1&1&1\\\\1&8&9\\\\0&3&4\\end{bmatrix}=5-4+3=4\\neq0$, so it is a basis. (ii) has 4 vectors in $\\mathbb{R}^3$, so they are dependent and cannot form a basis.</div><div class=\"ml-vi\">(i): $\\det\\begin{bmatrix}1&1&1\\\\1&8&9\\\\0&3&4\\end{bmatrix}=5-4+3=4\\neq0$ nên là cơ sở. (ii) có 4 vectơ trong $\\mathbb{R}^3$ nên phụ thuộc tuyến tính, không thể là cơ sở.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{v_1,v_2,v_3,v_4\\}$ be an orthogonal set in $\\mathbb{R}^4$. Which of the following statements are true?<br>(i) $\\{v_1,\\ v_2+v_3,\\ v_4\\}$ is orthogonal in $\\mathbb{R}^4$. (ii) $\\{v_1,\\ v_2+v_3,\\ v_3+v_4\\}$ is orthogonal in $\\mathbb{R}^4$. (iii) $\\{2v_1,\\ v_2,\\ v_3+3v_4\\}$ is orthogonal in $\\mathbb{R}^4$.|||Cho $\\{v_1,v_2,v_3,v_4\\}$ là hệ trực giao trong $\\mathbb{R}^4$. Phát biểu nào đúng?<br>(i) $\\{v_1,\\ v_2+v_3,\\ v_4\\}$ trực giao trong $\\mathbb{R}^4$. (ii) $\\{v_1,\\ v_2+v_3,\\ v_3+v_4\\}$ trực giao trong $\\mathbb{R}^4$. (iii) $\\{2v_1,\\ v_2,\\ v_3+3v_4\\}$ trực giao trong $\\mathbb{R}^4$.",
          "options": [
            {
              "text": "(i) only.|||Chỉ (i)."
            },
            {
              "text": "Both (i) and (iii).|||Cả (i) và (iii)."
            },
            {
              "text": "(iii) only.|||Chỉ (iii)."
            },
            {
              "text": "Both (i) and (ii).|||Cả (i) và (ii)."
            },
            {
              "text": "(ii) only.|||Chỉ (ii)."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">(i) and (iii) keep all pairwise dot products zero. In (ii), $(v_2+v_3)\\cdot(v_3+v_4)=v_3\\cdot v_3=\\|v_3\\|^2\\neq0$, so it is not orthogonal.</div><div class=\"ml-vi\">(i) và (iii) giữ mọi tích vô hướng từng cặp bằng 0. Ở (ii), $(v_2+v_3)\\cdot(v_3+v_4)=v_3\\cdot v_3=\\|v_3\\|^2\\neq0$ nên không trực giao.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a matrix of size $10\\times7$ and $\\mathrm{rank}(A)=6$. Which of the following statements are true?<br>(i) $\\dim(\\mathrm{im}(A))=10$ (ii) $\\dim(\\mathrm{Null}(A))=0$|||Cho $A$ là ma trận cỡ $10\\times7$ và $\\mathrm{rank}(A)=6$. Phát biểu nào đúng?<br>(i) $\\dim(\\mathrm{im}(A))=10$ (ii) $\\dim(\\mathrm{Null}(A))=0$",
          "options": [
            {
              "text": "Only (i)|||Chỉ (i)"
            },
            {
              "text": "Only (ii)|||Chỉ (ii)"
            },
            {
              "text": "Both (i) and (ii)|||Cả (i) và (ii)"
            },
            {
              "text": "None of other choices is correct|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\dim(\\mathrm{im}A)=\\mathrm{rank}(A)=6\\neq10$, and by rank–nullity $\\dim(\\mathrm{Null}A)=7-6=1\\neq0$. Both statements are false.</div><div class=\"ml-vi\">$\\dim(\\mathrm{im}A)=\\mathrm{rank}(A)=6\\neq10$, và theo định lý hạng–số khuyết $\\dim(\\mathrm{Null}A)=7-6=1\\neq0$. Cả hai phát biểu đều sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many solutions would a HOMOGENEOUS system of linear equations of 4 equations and in 6 variables have?|||Hệ phương trình tuyến tính THUẦN NHẤT gồm 4 phương trình và 6 ẩn có bao nhiêu nghiệm?",
          "options": [
            {
              "text": "No solution|||Vô nghiệm"
            },
            {
              "text": "Unique solution|||Nghiệm duy nhất"
            },
            {
              "text": "Infinitely many solutions|||Vô số nghiệm"
            },
            {
              "text": "There is not enough information|||Không đủ thông tin"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A homogeneous system always has the trivial solution, and with more variables (6) than equations (4) there is at least one free variable, so there are infinitely many solutions.</div><div class=\"ml-vi\">Hệ thuần nhất luôn có nghiệm tầm thường, và vì số ẩn (6) nhiều hơn số phương trình (4) nên có ít nhất một ẩn tự do — hệ có vô số nghiệm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ be a linear map and $T\\begin{pmatrix}1\\\\1\\\\1\\end{pmatrix}=\\begin{bmatrix}5\\\\1\\end{bmatrix}$, $T\\begin{pmatrix}-1\\\\1\\\\0\\end{pmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$. Then $T\\begin{pmatrix}5\\\\-1\\\\2\\end{pmatrix}$ is...<br>(i) $\\begin{bmatrix}4\\\\2\\end{bmatrix}$ (ii) $\\begin{bmatrix}2\\\\4\\end{bmatrix}$ (iii) $\\begin{bmatrix}2\\\\-3\\end{bmatrix}$|||Cho $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ là ánh xạ tuyến tính và $T\\begin{pmatrix}1\\\\1\\\\1\\end{pmatrix}=\\begin{bmatrix}5\\\\1\\end{bmatrix}$, $T\\begin{pmatrix}-1\\\\1\\\\0\\end{pmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$. Khi đó $T\\begin{pmatrix}5\\\\-1\\\\2\\end{pmatrix}$ bằng...<br>(i) $\\begin{bmatrix}4\\\\2\\end{bmatrix}$ (ii) $\\begin{bmatrix}2\\\\4\\end{bmatrix}$ (iii) $\\begin{bmatrix}2\\\\-3\\end{bmatrix}$",
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
              "text": "None of the others|||Không cái nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(5,-1,2)=2(1,1,1)-3(-1,1,0)$ (check: $(2,2,2)+(3,-3,0)=(5,-1,2)$ ✓). By linearity $T=2(5,1)-3(2,0)=(10,2)-(6,0)=(4,2)$, i.e. (i).</div><div class=\"ml-vi\">$(5,-1,2)=2(1,1,1)-3(-1,1,0)$ (kiểm: $(2,2,2)+(3,-3,0)=(5,-1,2)$ ✓). Theo tính tuyến tính: $T=2(5,1)-3(2,0)=(10,2)-(6,0)=(4,2)$, tức (i).</div>"
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
          "explanation": "<div class=\"ml-en\">$\\det(xI-A)=\\det\\begin{bmatrix}x-1&-1\\\\0&x-2\\end{bmatrix}=(x-1)(x-2)=x^2-3x+2$, i.e. (ii).</div><div class=\"ml-vi\">$\\det(xI-A)=\\det\\begin{bmatrix}x-1&-1\\\\0&x-2\\end{bmatrix}=(x-1)(x-2)=x^2-3x+2$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $S=\\{(-1,0,1),(2,1,4)\\}$. The value of $m$ for which the vector $(4m,3,10)$ belongs to the linear span of $S$ is __________|||Cho $S=\\{(-1,0,1),(2,1,4)\\}$. Giá trị $m$ để vectơ $(4m,3,10)$ thuộc span tuyến tính của $S$ là __________",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "-2|||-2"
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
          "explanation": "<div class=\"ml-en\">Write $(4m,3,10)=a(-1,0,1)+b(2,1,4)$. The second coordinate gives $b=3$; the third gives $a+12=10\\Rightarrow a=-2$; the first gives $4m=-a+2b=2+6=8\\Rightarrow m=2$.</div><div class=\"ml-vi\">Viết $(4m,3,10)=a(-1,0,1)+b(2,1,4)$. Toạ độ thứ hai cho $b=3$; toạ độ thứ ba cho $a+12=10\\Rightarrow a=-2$; toạ độ thứ nhất cho $4m=-a+2b=2+6=8\\Rightarrow m=2$.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D9",
      "source": "REAL",
      "sortOrder": 8,
      "title": "Đề 9 — SU25 Final Exam|||Đề 9 — Thi cuối kỳ SU25",
      "description": "MAE101 real FE multiple-choice paper (Summer 2025), transcribed from the exam images; answers reasoned here. One question that existed only as a graph was replaced by an equivalent question written for this bank. (50 questions)|||Đề trắc nghiệm FE thật môn MAE101 (kỳ Hè 2025), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. Một câu chỉ có đồ thị đã được thay bằng câu tương đương do chúng tôi soạn. (50 câu)",
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
          "prompt": "If a snowball melts so that its volume decreases at a rate of 1 cm³/min, how fast is the radius of the snowball decreasing when the diameter is 10 cm?<br>(i) $\\dfrac{1}{50\\pi}$ cm/min (ii) $\\dfrac{1}{200\\pi}$ cm/min (iii) $\\dfrac{1}{100\\pi}$ cm/min (iv) $\\dfrac{1}{400\\pi}$ cm/min|||Một quả cầu tuyết tan sao cho thể tích giảm với tốc độ 1 cm³/phút. Bán kính quả cầu giảm nhanh thế nào khi đường kính bằng 10 cm?<br>(i) $\\dfrac{1}{50\\pi}$ cm/phút (ii) $\\dfrac{1}{200\\pi}$ cm/phút (iii) $\\dfrac{1}{100\\pi}$ cm/phút (iv) $\\dfrac{1}{400\\pi}$ cm/phút",
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
              "text": "(iv)|||(iv)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$V=\\dfrac43\\pi r^3\\Rightarrow \\dfrac{dV}{dt}=4\\pi r^2\\dfrac{dr}{dt}$. With $r=5$ and $\\dfrac{dV}{dt}=-1$: $\\dfrac{dr}{dt}=\\dfrac{-1}{100\\pi}$, so the radius decreases at $\\dfrac{1}{100\\pi}$ cm/min, i.e. (iii).</div><div class=\"ml-vi\">$V=\\dfrac43\\pi r^3\\Rightarrow \\dfrac{dV}{dt}=4\\pi r^2\\dfrac{dr}{dt}$. Với $r=5$ và $\\dfrac{dV}{dt}=-1$: $\\dfrac{dr}{dt}=\\dfrac{-1}{100\\pi}$, tức bán kính giảm với tốc độ $\\dfrac{1}{100\\pi}$ cm/phút, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute maximum and absolute minimum values of $f(x)=x^4-4x^3+4x^2+1$ on $[0,2]$.|||Tìm giá trị lớn nhất và nhỏ nhất tuyệt đối của $f(x)=x^4-4x^3+4x^2+1$ trên $[0,2]$.",
          "options": [
            {
              "text": "Absolute maximum: 1, absolute minimum: 0|||Lớn nhất: 1, nhỏ nhất: 0"
            },
            {
              "text": "Absolute maximum: 2, absolute minimum: 0|||Lớn nhất: 2, nhỏ nhất: 0"
            },
            {
              "text": "Absolute maximum: 2, absolute minimum: 1|||Lớn nhất: 2, nhỏ nhất: 1"
            },
            {
              "text": "Absolute maximum: 1, absolute minimum: -1|||Lớn nhất: 1, nhỏ nhất: -1"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=4x^3-12x^2+8x=4x(x-1)(x-2)$, so the critical points in $[0,2]$ are $0,1,2$. Values: $f(0)=1$, $f(1)=2$, $f(2)=1$. Maximum $=2$, minimum $=1$.</div><div class=\"ml-vi\">$f'(x)=4x^3-12x^2+8x=4x(x-1)(x-2)$ nên các điểm tới hạn trong $[0,2]$ là $0,1,2$. Giá trị: $f(0)=1$, $f(1)=2$, $f(2)=1$. Lớn nhất $=2$, nhỏ nhất $=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a square matrix such that $A^2+A=I$, where $I$ is the identity matrix. Which of the following statements is true?<br>(i) $A$ is not invertible (ii) $A$ is invertible and $A^{-1}=A+I$ (iii) $A$ is invertible and $A^{-1}=A-I$|||Cho $A$ là ma trận vuông thoả $A^2+A=I$, với $I$ là ma trận đơn vị. Phát biểu nào đúng?<br>(i) $A$ không khả nghịch (ii) $A$ khả nghịch và $A^{-1}=A+I$ (iii) $A$ khả nghịch và $A^{-1}=A-I$",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$A^2+A=I\\Rightarrow A(A+I)=I$, so $A$ is invertible with $A^{-1}=A+I$, i.e. (ii).</div><div class=\"ml-vi\">$A^2+A=I\\Rightarrow A(A+I)=I$ nên $A$ khả nghịch và $A^{-1}=A+I$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of the derivative of the function $y=\\dfrac{x^2+8x+3}{\\sqrt{x}}$ at $x=1$.|||Tính giá trị đạo hàm của hàm số $y=\\dfrac{x^2+8x+3}{\\sqrt{x}}$ tại $x=1$.",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "-4|||-4"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Write $y=x^{3/2}+8x^{1/2}+3x^{-1/2}$, so $y'=\\dfrac32x^{1/2}+4x^{-1/2}-\\dfrac32x^{-3/2}$. At $x=1$: $\\dfrac32+4-\\dfrac32=4$.</div><div class=\"ml-vi\">Viết $y=x^{3/2}+8x^{1/2}+3x^{-1/2}$, suy ra $y'=\\dfrac32x^{1/2}+4x^{-1/2}-\\dfrac32x^{-3/2}$. Tại $x=1$: $\\dfrac32+4-\\dfrac32=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit $\\displaystyle\\lim_{x\\to-\\infty}\\dfrac{2x^4-3x^2+5}{(3x-1)(5x^3+2)}$|||Tính giới hạn $\\displaystyle\\lim_{x\\to-\\infty}\\dfrac{2x^4-3x^2+5}{(3x-1)(5x^3+2)}$",
          "options": [
            {
              "text": "-2/15|||-2/15"
            },
            {
              "text": "2/15|||2/15"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$+\\infty$|||$+\\infty$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Both numerator and denominator have degree 4; the leading coefficients are $2$ and $3\\cdot5=15$, so the limit is $\\dfrac{2}{15}$.</div><div class=\"ml-vi\">Tử và mẫu đều bậc 4; hệ số bậc cao nhất là $2$ và $3\\cdot5=15$ nên giới hạn bằng $\\dfrac{2}{15}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "John and Joe earn a total of USD 34.00 when John works 2 hours and Joe works 3 hours. If John works 3 hours and Joe works 2 hours, they get USD 33.50. Find John's hourly rate (in USD).|||John và Joe kiếm được tổng cộng 34.00 USD khi John làm 2 giờ và Joe làm 3 giờ. Nếu John làm 3 giờ và Joe làm 2 giờ thì họ được 33.50 USD. Tìm tiền công mỗi giờ của John (USD).",
          "options": [
            {
              "text": "6.50|||6.50"
            },
            {
              "text": "7.00|||7.00"
            },
            {
              "text": "6.00|||6.00"
            },
            {
              "text": "7.50|||7.50"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Let $J,j$ be the rates: $2J+3j=34$, $3J+2j=33.5$. Adding: $5(J+j)=67.5\\Rightarrow J+j=13.5$; subtracting: $J-j=-0.5$. Hence $J=6.5$ and $j=7$.</div><div class=\"ml-vi\">Gọi $J,j$ là tiền công mỗi giờ: $2J+3j=34$, $3J+2j=33.5$. Cộng lại: $5(J+j)=67.5\\Rightarrow J+j=13.5$; trừ nhau: $J-j=-0.5$. Vậy $J=6.5$ và $j=7$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&2&0\\\\3&0&1\\\\-1&2&2\\end{bmatrix}$. Find the determinant of the matrix $2A^{-1}$.|||Cho $A=\\begin{bmatrix}1&2&0\\\\3&0&1\\\\-1&2&2\\end{bmatrix}$. Tính định thức của ma trận $2A^{-1}$.",
          "options": [
            {
              "text": "1/2|||1/2"
            },
            {
              "text": "-1/8|||-1/8"
            },
            {
              "text": "1/8|||1/8"
            },
            {
              "text": "-1/2|||-1/2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\det A=1(0\\cdot2-1\\cdot2)-2(3\\cdot2-1\\cdot(-1))+0=-2-14=-16$, so $\\det(2A^{-1})=\\dfrac{2^3}{-16}=-\\dfrac12$.</div><div class=\"ml-vi\">$\\det A=1(0\\cdot2-1\\cdot2)-2(3\\cdot2-1\\cdot(-1))+0=-2-14=-16$, nên $\\det(2A^{-1})=\\dfrac{2^3}{-16}=-\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the integral $\\displaystyle\\int_0^9(10+6y-y^2)dy$|||Tính tích phân $\\displaystyle\\int_0^9(10+6y-y^2)dy$",
          "options": [
            {
              "text": "None of these|||Không đáp án nào"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "900|||900"
            },
            {
              "text": "90|||90"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\left[10y+3y^2-\\dfrac{y^3}{3}\\right]_0^9=90+243-243=90$.</div><div class=\"ml-vi\">$\\left[10y+3y^2-\\dfrac{y^3}{3}\\right]_0^9=90+243-243=90$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T$ be projection on the line $y=x$ followed by reflection in the $x$-axis in the $xy$-plane. Find the sum of all entries in the first row of the matrix of $T$.|||Cho $T$ là phép chiếu lên đường thẳng $y=x$ rồi lấy đối xứng qua trục $x$ trong mặt phẳng $xy$. Tìm tổng các phần tử ở hàng đầu của ma trận $T$.",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Projection on $y=x$: $P=\\tfrac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$; reflection in the $x$-axis: $R=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. So $T=RP=\\tfrac12\\begin{bmatrix}1&1\\\\-1&-1\\end{bmatrix}$ and the first row sums to $1$.</div><div class=\"ml-vi\">Phép chiếu lên $y=x$: $P=\\tfrac12\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$; đối xứng qua trục $x$: $R=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$. Vậy $T=RP=\\tfrac12\\begin{bmatrix}1&1\\\\-1&-1\\end{bmatrix}$ và tổng hàng đầu bằng $1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which points of the set $\\{P(1,2,3),\\ Q(3,1,4),\\ R(2,1,1)\\}$ lie on the line $x=2+t$, $y=-1+2t$, $z=1+3t$?|||Điểm nào trong tập $\\{P(1,2,3),\\ Q(3,1,4),\\ R(2,1,1)\\}$ nằm trên đường thẳng $x=2+t$, $y=-1+2t$, $z=1+3t$?",
          "options": [
            {
              "text": "Only R|||Chỉ R"
            },
            {
              "text": "Only P|||Chỉ P"
            },
            {
              "text": "All of the other choices are incorrect|||Tất cả lựa chọn khác đều sai"
            },
            {
              "text": "Only Q|||Chỉ Q"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">For $Q(3,1,4)$: $x=3\\Rightarrow t=1$, then $y=-1+2=1$ ✓ and $z=1+3=4$ ✓. For $P$: $t=-1$ gives $y=-3\\neq2$. For $R$: $t=0$ gives $y=-1\\neq1$. Only $Q$ lies on the line.</div><div class=\"ml-vi\">Với $Q(3,1,4)$: $x=3\\Rightarrow t=1$, khi đó $y=-1+2=1$ ✓ và $z=1+3=4$ ✓. Với $P$: $t=-1$ cho $y=-3\\neq2$. Với $R$: $t=0$ cho $y=-1\\neq1$. Chỉ $Q$ nằm trên đường thẳng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many solutions must a homogeneous linear system of 6 equations in 7 unknowns have?|||Hệ tuyến tính thuần nhất gồm 6 phương trình và 7 ẩn có bao nhiêu nghiệm?",
          "options": [
            {
              "text": "infinitely many solutions|||vô số nghiệm"
            },
            {
              "text": "no solutions|||vô nghiệm"
            },
            {
              "text": "exactly 7 solutions|||đúng 7 nghiệm"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "exactly one solution|||đúng một nghiệm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A homogeneous system always has the trivial solution, and since there are more unknowns (7) than equations (6) there is at least one free variable — infinitely many solutions.</div><div class=\"ml-vi\">Hệ thuần nhất luôn có nghiệm tầm thường, và vì số ẩn (7) nhiều hơn số phương trình (6) nên có ít nhất một ẩn tự do — vô số nghiệm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements are true?<br>(i) $(3,4,2)$ is a linear combination of $(1,1,1)$ and $(0,1,-1)$. (ii) If $\\{u,v\\}$ is a spanning set of a subspace $U$ then $\\{2u,3v\\}$ is also a spanning set of $U$.|||Phát biểu nào sau đây đúng?<br>(i) $(3,4,2)$ là tổ hợp tuyến tính của $(1,1,1)$ và $(0,1,-1)$. (ii) Nếu $\\{u,v\\}$ là hệ sinh của không gian con $U$ thì $\\{2u,3v\\}$ cũng là hệ sinh của $U$.",
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
          "explanation": "<div class=\"ml-en\">(i) $3(1,1,1)+1(0,1,-1)=(3,4,2)$ ✓. (ii) multiplying spanning vectors by nonzero scalars does not change their span ✓. Both are true.</div><div class=\"ml-vi\">(i) $3(1,1,1)+1(0,1,-1)=(3,4,2)$ ✓. (ii) nhân các vectơ sinh với vô hướng khác 0 không làm đổi span ✓. Cả hai đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int 7pe^{5p^2}dp$.<br>(i) $-(7/10)e^{5p^2}+C$ (ii) $(7/5)e^{5p^2}+C$ (iii) $(7/10)e^{5p^2}+C$ (iv) $35e^{5p^2}+C$|||Tính $\\displaystyle\\int 7pe^{5p^2}dp$.<br>(i) $-(7/10)e^{5p^2}+C$ (ii) $(7/5)e^{5p^2}+C$ (iii) $(7/10)e^{5p^2}+C$ (iv) $35e^{5p^2}+C$",
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
              "text": "(ii)|||(ii)"
            },
            {
              "text": "(iii)|||(iii)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Let $u=5p^2$, $du=10p\\,dp$: $\\dfrac{7}{10}\\int e^u du=\\dfrac{7}{10}e^{5p^2}+C$, i.e. (iii).</div><div class=\"ml-vi\">Đặt $u=5p^2$, $du=10p\\,dp$: $\\dfrac{7}{10}\\int e^u du=\\dfrac{7}{10}e^{5p^2}+C$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $c$ so that the function is continuous on $\\mathbb{R}$: $f(x)=\\begin{cases}\\dfrac{x^2-1}{\\sqrt{x^2+2x+1}} & \\text{if } x\\lt-1\\\\[6pt] 2x+c & \\text{if } x\\geq-1\\end{cases}$|||Tìm $c$ để hàm số liên tục trên $\\mathbb{R}$: $f(x)=\\begin{cases}\\dfrac{x^2-1}{\\sqrt{x^2+2x+1}} & \\text{nếu } x\\lt-1\\\\[6pt] 2x+c & \\text{nếu } x\\geq-1\\end{cases}$",
          "options": [
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
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\sqrt{x^2+2x+1}=|x+1|=-(x+1)$ for $x\\lt-1$, so the first branch is $\\dfrac{(x-1)(x+1)}{-(x+1)}=1-x\\to2$ as $x\\to-1^-$. At $x=-1$ the second branch gives $c-2$. Continuity requires $c-2=2$, so $c=4$.</div><div class=\"ml-vi\">$\\sqrt{x^2+2x+1}=|x+1|=-(x+1)$ khi $x\\lt-1$, nên nhánh đầu bằng $\\dfrac{(x-1)(x+1)}{-(x+1)}=1-x\\to2$ khi $x\\to-1^-$. Tại $x=-1$ nhánh sau cho $c-2$. Để liên tục cần $c-2=2$, vậy $c=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the linearization of the function $f(x)=3x^3+2x^2+x$ at $x=1$.|||Tìm xấp xỉ tuyến tính (linearization) của hàm số $f(x)=3x^3+2x^2+x$ tại $x=1$.",
          "options": [
            {
              "text": "$6x-8$|||$6x-8$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$14x-8$|||$14x-8$"
            },
            {
              "text": "$14x+6$|||$14x+6$"
            },
            {
              "text": "$6x+14$|||$6x+14$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(1)=6$ and $f'(x)=9x^2+4x+1\\Rightarrow f'(1)=14$. So $L(x)=6+14(x-1)=14x-8$.</div><div class=\"ml-vi\">$f(1)=6$ và $f'(x)=9x^2+4x+1\\Rightarrow f'(1)=14$. Vậy $L(x)=6+14(x-1)=14x-8$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Approximate the area under the graph of $f(x)=0.015x^3+4$ over the interval $[-6,0]$ using 3 subintervals and left endpoints.|||Xấp xỉ diện tích dưới đồ thị $f(x)=0.015x^3+4$ trên đoạn $[-6,0]$ với 3 khoảng chia và mút TRÁI.",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "7.68|||7.68"
            },
            {
              "text": "21.84|||21.84"
            },
            {
              "text": "15.36|||15.36"
            },
            {
              "text": "10.92|||10.92"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=2$; left endpoints $-6,-4,-2$ give $f=0.76,\\ 3.04,\\ 3.88$. Sum $=7.68$, so the area $\\approx2(7.68)=15.36$.</div><div class=\"ml-vi\">$\\Delta x=2$; các mút trái $-6,-4,-2$ cho $f=0.76,\\ 3.04,\\ 3.88$. Tổng $=7.68$, nên diện tích $\\approx2(7.68)=15.36$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following vectors is perpendicular to the plane passing through the points $(-7,10,0)$, $(4,1,6)$ and $(2,-1,3)$?|||Vectơ nào sau đây vuông góc với mặt phẳng đi qua ba điểm $(-7,10,0)$, $(4,1,6)$ và $(2,-1,3)$?",
          "options": [
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(-39; 21; 40)|||(-39; 21; 40)"
            },
            {
              "text": "(-12; 33; 22)|||(-12; 33; 22)"
            },
            {
              "text": "(12; 33; 22)|||(12; 33; 22)"
            },
            {
              "text": "(39; 21; -40)|||(39; 21; -40)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$\\overrightarrow{PQ}=(11,-9,6)$, $\\overrightarrow{PR}=(9,-11,3)$; $\\overrightarrow{PQ}\\times\\overrightarrow{PR}=(-27+66,\\ -(33-54),\\ -121+81)=(39,21,-40)$.</div><div class=\"ml-vi\">$\\overrightarrow{PQ}=(11,-9,6)$, $\\overrightarrow{PR}=(9,-11,3)$; $\\overrightarrow{PQ}\\times\\overrightarrow{PR}=(-27+66,\\ -(33-54),\\ -121+81)=(39,21,-40)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve the system of linear equations $\\begin{cases}3x+y+z=9\\\\ x-y+z=3\\end{cases}$|||Giải hệ phương trình tuyến tính $\\begin{cases}3x+y+z=9\\\\ x-y+z=3\\end{cases}$",
          "options": [
            {
              "text": "$(3+2z,\\ z/2,\\ z)$|||$(3+2z,\\ z/2,\\ z)$"
            },
            {
              "text": "$(3-z/2,\\ z/2,\\ z)$|||$(3-z/2,\\ z/2,\\ z)$"
            },
            {
              "text": "$(3+z/2,\\ z/2,\\ z)$|||$(3+z/2,\\ z/2,\\ z)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "$(3-2z,\\ 2z,\\ z)$|||$(3-2z,\\ 2z,\\ z)$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Adding the two equations: $4x+2z=12\\Rightarrow x=3-\\dfrac{z}{2}$. Then $y=x+z-3=\\dfrac{z}{2}$. The solution set is $\\left(3-\\dfrac{z}{2},\\ \\dfrac{z}{2},\\ z\\right)$.</div><div class=\"ml-vi\">Cộng hai phương trình: $4x+2z=12\\Rightarrow x=3-\\dfrac{z}{2}$. Khi đó $y=x+z-3=\\dfrac{z}{2}$. Tập nghiệm là $\\left(3-\\dfrac{z}{2},\\ \\dfrac{z}{2},\\ z\\right)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the matrices below is the reduced row-echelon form of the matrix $\\begin{bmatrix}1&2&-2&6\\\\2&5&6&0\\end{bmatrix}$?<br>(i) $\\begin{bmatrix}1&2&-2&6\\\\0&1&10&-12\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&0&-22&30\\\\0&1&10&-12\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&2&0&6\\\\0&0&1&0\\end{bmatrix}$|||Ma trận nào sau đây là dạng bậc thang rút gọn (rref) của ma trận $\\begin{bmatrix}1&2&-2&6\\\\2&5&6&0\\end{bmatrix}$?<br>(i) $\\begin{bmatrix}1&2&-2&6\\\\0&1&10&-12\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&0&-22&30\\\\0&1&10&-12\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&2&0&6\\\\0&0&1&0\\end{bmatrix}$",
          "options": [
            {
              "text": "none of the other choices is true|||không đáp án nào khác đúng"
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
            3
          ],
          "explanation": "<div class=\"ml-en\">$R_2\\to R_2-2R_1=[0,1,10,-12]$, then $R_1\\to R_1-2R_2=[1,0,-22,30]$. The result is (ii).</div><div class=\"ml-vi\">$R_2\\to R_2-2R_1=[0,1,10,-12]$, sau đó $R_1\\to R_1-2R_2=[1,0,-22,30]$. Kết quả là (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the volume of the parallelepiped determined by $2u$, $-3v$, $5w$, provided that $u=[1,2,-1]^T$, $v=[0,2,4]^T$, $w=[1,4,a]^T$.|||Tìm thể tích hình hộp tạo bởi $2u$, $-3v$, $5w$, biết $u=[1,2,-1]^T$, $v=[0,2,4]^T$, $w=[1,4,a]^T$.",
          "options": [
            {
              "text": "$30|a-3|$|||$30|a-3|$"
            },
            {
              "text": "$30|a+3|$|||$30|a+3|$"
            },
            {
              "text": "$60|a-3|$|||$60|a-3|$"
            },
            {
              "text": "$60|a+3|$|||$60|a+3|$"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\det[u,v,w]=1(2a-16)-2(0-4)+(-1)(0-2)=2a-6=2(a-3)$. Scaling the three vectors multiplies the volume by $|2\\cdot(-3)\\cdot5|=30$, so $V=30\\cdot|2(a-3)|=60|a-3|$.</div><div class=\"ml-vi\">$\\det[u,v,w]=1(2a-16)-2(0-4)+(-1)(0-2)=2a-6=2(a-3)$. Nhân ba vectơ với các hệ số làm thể tích nhân $|2\\cdot(-3)\\cdot5|=30$, nên $V=30\\cdot|2(a-3)|=60|a-3|$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following matrices is invertible?<br>(i) $\\begin{pmatrix}1&1&1\\\\2&3&1\\\\3&4&0\\end{pmatrix}$ (ii) $\\begin{pmatrix}-1&2\\\\1&-2\\end{pmatrix}$ (iii) $\\begin{pmatrix}x&1&2x\\\\y&2&2y\\\\z&1&2z\\end{pmatrix}$ ($x,y,z$ any real numbers)|||Ma trận nào sau đây khả nghịch?<br>(i) $\\begin{pmatrix}1&1&1\\\\2&3&1\\\\3&4&0\\end{pmatrix}$ (ii) $\\begin{pmatrix}-1&2\\\\1&-2\\end{pmatrix}$ (iii) $\\begin{pmatrix}x&1&2x\\\\y&2&2y\\\\z&1&2z\\end{pmatrix}$ ($x,y,z$ là số thực bất kỳ)",
          "options": [
            {
              "text": "Can not be determined|||Không xác định được"
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">(i) $\\det=1(0-4)-1(0-3)+1(8-9)=-2\\neq0$ ✓. (ii) $\\det=2-2=0$. (iii) column 3 equals twice column 1, so $\\det=0$. Only (i) is invertible.</div><div class=\"ml-vi\">(i) $\\det=1(0-4)-1(0-3)+1(8-9)=-2\\neq0$ ✓. (ii) $\\det=2-2=0$. (iii) cột 3 bằng 2 lần cột 1 nên $\\det=0$. Chỉ (i) khả nghịch.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Differentiate $y=\\left(\\dfrac{3x+3}{x-5}\\right)^5$.<br>(i) $dy/dx=\\dfrac{-90}{(x-5)^2}$ (ii) $dy/dx=\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{-90}{(x-5)^2}$ (iii) $dy/dx=\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{18}{(x-5)^2}$ (iv) $dy/dx=\\left(\\dfrac{3x+3}{x-5}\\right)^4$|||Tính đạo hàm $y=\\left(\\dfrac{3x+3}{x-5}\\right)^5$.<br>(i) $dy/dx=\\dfrac{-90}{(x-5)^2}$ (ii) $dy/dx=\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{-90}{(x-5)^2}$ (iii) $dy/dx=\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{18}{(x-5)^2}$ (iv) $dy/dx=\\left(\\dfrac{3x+3}{x-5}\\right)^4$",
          "options": [
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
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{d}{dx}\\dfrac{3x+3}{x-5}=\\dfrac{3(x-5)-(3x+3)}{(x-5)^2}=\\dfrac{-18}{(x-5)^2}$. By the chain rule $y'=5\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{-18}{(x-5)^2}=\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{-90}{(x-5)^2}$, i.e. (ii).</div><div class=\"ml-vi\">$\\dfrac{d}{dx}\\dfrac{3x+3}{x-5}=\\dfrac{3(x-5)-(3x+3)}{(x-5)^2}=\\dfrac{-18}{(x-5)^2}$. Theo quy tắc dây chuyền: $y'=5\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{-18}{(x-5)^2}=\\left(\\dfrac{3x+3}{x-5}\\right)^4\\cdot\\dfrac{-90}{(x-5)^2}$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the Midpoint Rule with $n=4$ to estimate the value of the integral $\\displaystyle\\int_0^2 f(x)dx$ from the table below.<table class=\"exam-table\"><thead><tr><th>x</th><th>0.00</th><th>0.25</th><th>0.50</th><th>0.75</th><th>1.00</th><th>1.25</th><th>1.50</th><th>1.75</th><th>2.00</th></tr></thead><tbody><tr><td>f(x)</td><td>1.00</td><td>0.61</td><td>0.49</td><td>0.42</td><td>0.37</td><td>0.33</td><td>0.29</td><td>0.27</td><td>0.24</td></tr></tbody></table>|||Dùng quy tắc trung điểm với $n=4$ để ước lượng giá trị tích phân $\\displaystyle\\int_0^2 f(x)dx$ theo bảng dưới đây.<table class=\"exam-table\"><thead><tr><th>x</th><th>0.00</th><th>0.25</th><th>0.50</th><th>0.75</th><th>1.00</th><th>1.25</th><th>1.50</th><th>1.75</th><th>2.00</th></tr></thead><tbody><tr><td>f(x)</td><td>1.00</td><td>0.61</td><td>0.49</td><td>0.42</td><td>0.37</td><td>0.33</td><td>0.29</td><td>0.27</td><td>0.24</td></tr></tbody></table>",
          "options": [
            {
              "text": "0.4225|||0.4225"
            },
            {
              "text": "0.4075|||0.4075"
            },
            {
              "text": "0.815|||0.815"
            },
            {
              "text": "0.855|||0.855"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=0.5$ and the midpoints are $0.25,0.75,1.25,1.75$ with $f=0.61,\\ 0.42,\\ 0.33,\\ 0.27$. Sum $=1.63$, so the estimate is $0.5(1.63)=0.815$.</div><div class=\"ml-vi\">$\\Delta x=0.5$ và các trung điểm là $0.25,0.75,1.25,1.75$ với $f=0.61,\\ 0.42,\\ 0.33,\\ 0.27$. Tổng $=1.63$, nên ước lượng là $0.5(1.63)=0.815$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be a $2\\times2$ matrix with two eigenvectors $v_1=[1,-1]^T$ and $v_2=[-1,2]^T$ corresponding to the eigenvalues $\\lambda_1=2$ and $\\lambda_2=3$, respectively. Find $A$.<br>(i) $\\begin{bmatrix}1&-1\\\\2&4\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&1\\\\2&4\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&2\\\\-1&4\\end{bmatrix}$|||Cho $A$ là ma trận $2\\times2$ với hai vectơ riêng $v_1=[1,-1]^T$ và $v_2=[-1,2]^T$ ứng với các giá trị riêng $\\lambda_1=2$ và $\\lambda_2=3$. Tìm $A$.<br>(i) $\\begin{bmatrix}1&-1\\\\2&4\\end{bmatrix}$ (ii) $\\begin{bmatrix}1&1\\\\2&4\\end{bmatrix}$ (iii) $\\begin{bmatrix}1&2\\\\-1&4\\end{bmatrix}$",
          "options": [
            {
              "text": "(iv)|||(iv)"
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
            2
          ],
          "explanation": "<div class=\"ml-en\">$A=PDP^{-1}$ with $P=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$, $D=\\mathrm{diag}(2,3)$ and $P^{-1}=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$: $A=\\begin{bmatrix}2&-3\\\\-2&6\\end{bmatrix}\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}=\\begin{bmatrix}1&-1\\\\2&4\\end{bmatrix}$, i.e. (i).</div><div class=\"ml-vi\">$A=PDP^{-1}$ với $P=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$, $D=\\mathrm{diag}(2,3)$ và $P^{-1}=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$: $A=\\begin{bmatrix}2&-3\\\\-2&6\\end{bmatrix}\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}=\\begin{bmatrix}1&-1\\\\2&4\\end{bmatrix}$, tức (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A$ be the matrix $\\begin{bmatrix}1&-1&2&0&3\\\\2&-1&0&1&5\\\\-1&0&2&-1&-2\\end{bmatrix}$. Then $\\dim(\\mathrm{row}A)$ is...|||Cho $A$ là ma trận $\\begin{bmatrix}1&-1&2&0&3\\\\2&-1&0&1&5\\\\-1&0&2&-1&-2\\end{bmatrix}$. Khi đó $\\dim(\\mathrm{row}A)$ bằng...",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "4x3|||4x3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "3x4|||3x4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$R_2\\to R_2-2R_1=[0,1,-4,1,-1]$ and $R_3\\to R_3+R_1=[0,-1,4,-1,1]=-R_2$, so the third row is dependent. The rank (dimension of the row space) is $2$.</div><div class=\"ml-vi\">$R_2\\to R_2-2R_1=[0,1,-4,1,-1]$ và $R_3\\to R_3+R_1=[0,-1,4,-1,1]=-R_2$ nên hàng thứ ba phụ thuộc. Hạng (số chiều không gian hàng) bằng $2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{bmatrix}1&3\\\\2&4\\end{bmatrix}$ and $B=\\begin{bmatrix}0&6\\\\5&1\\end{bmatrix}$. Find the first row of the matrix $A+B^T$.|||Cho $A=\\begin{bmatrix}1&3\\\\2&4\\end{bmatrix}$ và $B=\\begin{bmatrix}0&6\\\\5&1\\end{bmatrix}$. Tìm hàng đầu của ma trận $A+B^T$.",
          "options": [
            {
              "text": "[2  8]|||[2  8]"
            },
            {
              "text": "[1  6]|||[1  6]"
            },
            {
              "text": "[2  6]|||[2  6]"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "[1  8]|||[1  8]"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">$B^T=\\begin{bmatrix}0&5\\\\6&1\\end{bmatrix}$, so $A+B^T=\\begin{bmatrix}1&8\\\\8&5\\end{bmatrix}$ and the first row is $[1\\ \\ 8]$.</div><div class=\"ml-vi\">$B^T=\\begin{bmatrix}0&5\\\\6&1\\end{bmatrix}$ nên $A+B^T=\\begin{bmatrix}1&8\\\\8&5\\end{bmatrix}$ và hàng đầu là $[1\\ \\ 8]$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $R_\\theta:\\mathbb{R}^2\\to\\mathbb{R}^2$ be the rotation through an angle $\\theta$. Which of the following statements are true?<br>(i) $R_\\pi\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}-x\\\\-y\\end{bmatrix}$ for every $\\begin{bmatrix}x\\\\y\\end{bmatrix}\\in\\mathbb{R}^2$. (ii) $R_{2\\pi}\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}x\\\\y\\end{bmatrix}$ for every $\\begin{bmatrix}x\\\\y\\end{bmatrix}\\in\\mathbb{R}^2$.|||Cho $R_\\theta:\\mathbb{R}^2\\to\\mathbb{R}^2$ là phép quay góc $\\theta$. Phát biểu nào đúng?<br>(i) $R_\\pi\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}-x\\\\-y\\end{bmatrix}$ với mọi $\\begin{bmatrix}x\\\\y\\end{bmatrix}\\in\\mathbb{R}^2$. (ii) $R_{2\\pi}\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}x\\\\y\\end{bmatrix}$ với mọi $\\begin{bmatrix}x\\\\y\\end{bmatrix}\\in\\mathbb{R}^2$.",
          "options": [
            {
              "text": "Only (ii).|||Chỉ (ii)."
            },
            {
              "text": "None of them.|||Không cái nào."
            },
            {
              "text": "Only (i).|||Chỉ (i)."
            },
            {
              "text": "Both (i) and (ii).|||Cả (i) và (ii)."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Rotating by $\\pi$ sends $(x,y)$ to $(-x,-y)$; rotating by $2\\pi$ is the identity. Both statements are true.</div><div class=\"ml-vi\">Quay góc $\\pi$ biến $(x,y)$ thành $(-x,-y)$; quay góc $2\\pi$ là ánh xạ đồng nhất. Cả hai phát biểu đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $A=\\begin{pmatrix}1&0&2\\\\3&2&-1\\end{pmatrix}$, $B=\\begin{pmatrix}1&1\\\\2&-1\\\\3&0\\end{pmatrix}$. Find $AB$.<br>(i) $\\begin{pmatrix}7&1\\\\4&1\\end{pmatrix}$ (ii) $\\begin{pmatrix}1&7\\\\1&4\\end{pmatrix}$ (iii) $\\begin{pmatrix}1&1\\\\7&4\\end{pmatrix}$|||Cho $A=\\begin{pmatrix}1&0&2\\\\3&2&-1\\end{pmatrix}$, $B=\\begin{pmatrix}1&1\\\\2&-1\\\\3&0\\end{pmatrix}$. Tính $AB$.<br>(i) $\\begin{pmatrix}7&1\\\\4&1\\end{pmatrix}$ (ii) $\\begin{pmatrix}1&7\\\\1&4\\end{pmatrix}$ (iii) $\\begin{pmatrix}1&1\\\\7&4\\end{pmatrix}$",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Row 1: $(1,0,2)\\cdot(1,2,3)=7$ and $(1,0,2)\\cdot(1,-1,0)=1$. Row 2: $(3,2,-1)\\cdot(1,2,3)=4$ and $(3,2,-1)\\cdot(1,-1,0)=1$. So $AB=\\begin{pmatrix}7&1\\\\4&1\\end{pmatrix}$, i.e. (i).</div><div class=\"ml-vi\">Hàng 1: $(1,0,2)\\cdot(1,2,3)=7$ và $(1,0,2)\\cdot(1,-1,0)=1$. Hàng 2: $(3,2,-1)\\cdot(1,2,3)=4$ và $(3,2,-1)\\cdot(1,-1,0)=1$. Vậy $AB=\\begin{pmatrix}7&1\\\\4&1\\end{pmatrix}$, tức (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_0^3\\dfrac{1}{\\sqrt{3-x}}dx$.<br>(i) diverges (ii) $2\\sqrt3$ (iii) $-2\\sqrt3$ (iv) $4\\sqrt3$|||Tính $\\displaystyle\\int_0^3\\dfrac{1}{\\sqrt{3-x}}dx$.<br>(i) phân kỳ (ii) $2\\sqrt3$ (iii) $-2\\sqrt3$ (iv) $4\\sqrt3$",
          "options": [
            {
              "text": "(iv)|||(iv)"
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
            1
          ],
          "explanation": "<div class=\"ml-en\">This is an improper integral with a singularity at $x=3$: $\\int_0^3(3-x)^{-1/2}dx=\\left[-2\\sqrt{3-x}\\right]_0^3=0+2\\sqrt3=2\\sqrt3$ — it converges, so (ii).</div><div class=\"ml-vi\">Đây là tích phân suy rộng có điểm kỳ dị tại $x=3$: $\\int_0^3(3-x)^{-1/2}dx=\\left[-2\\sqrt{3-x}\\right]_0^3=0+2\\sqrt3=2\\sqrt3$ — hội tụ, nên chọn (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The position of an object moving along a straight line is given by $s(t)=t^3-6t^2+9t$. Determine the time intervals when the object is speeding up.<br>(i) $(-\\infty,1)\\cup(3,+\\infty)$ (ii) $(1,3)$ (iii) $(1,2)\\cup(3,+\\infty)$ (iv) $(1,2)$|||Vị trí của một vật chuyển động thẳng là $s(t)=t^3-6t^2+9t$. Xác định các khoảng thời gian vật chuyển động NHANH DẦN.<br>(i) $(-\\infty,1)\\cup(3,+\\infty)$ (ii) $(1,3)$ (iii) $(1,2)\\cup(3,+\\infty)$ (iv) $(1,2)$",
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
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "(iv)|||(iv)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$v=3(t-1)(t-3)$ and $a=6(t-2)$. The object speeds up when $v$ and $a$ have the same sign: on $(1,2)$ both are negative, on $(3,\\infty)$ both are positive. Hence (iii).</div><div class=\"ml-vi\">$v=3(t-1)(t-3)$ và $a=6(t-2)$. Vật nhanh dần khi $v$ và $a$ CÙNG DẤU: trên $(1,2)$ cả hai âm, trên $(3,\\infty)$ cả hai dương. Vậy chọn (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find points of inflection of $f(x)=(x-3)^{1/3}+8$.<br>(i) $(0,-3^{1/3}+8)$; $(3,8)$ (ii) $(3,8)$ (iii) $(0,-3^{1/3}+8)$|||Tìm điểm uốn của $f(x)=(x-3)^{1/3}+8$.<br>(i) $(0,-3^{1/3}+8)$; $(3,8)$ (ii) $(3,8)$ (iii) $(0,-3^{1/3}+8)$",
          "options": [
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
              "text": "(i)|||(i)"
            },
            {
              "text": "No points of inflection|||Không có điểm uốn"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f''(x)=-\\dfrac{2}{9}(x-3)^{-5/3}$ changes sign at $x=3$ (where $f''$ is undefined but $f$ is continuous), giving the inflection point $(3,8)$.</div><div class=\"ml-vi\">$f''(x)=-\\dfrac{2}{9}(x-3)^{-5/3}$ đổi dấu tại $x=3$ (nơi $f''$ không xác định nhưng $f$ liên tục), cho điểm uốn $(3,8)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{X,Y,Z\\}$ be an independent set of vectors. Which of the following sets are also independent?<br>(i) $\\{X-Y+Z,\\ X+Y,\\ 2X+Z\\}$ (ii) $\\{X+2Y,\\ Y+2Z,\\ Z+2X\\}$|||Cho $\\{X,Y,Z\\}$ là hệ vectơ độc lập tuyến tính. Hệ nào sau đây cũng độc lập?<br>(i) $\\{X-Y+Z,\\ X+Y,\\ 2X+Z\\}$ (ii) $\\{X+2Y,\\ Y+2Z,\\ Z+2X\\}$",
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
          "explanation": "<div class=\"ml-en\">(i): $\\det\\begin{bmatrix}1&-1&1\\\\1&1&0\\\\2&0&1\\end{bmatrix}=0$, so the set is dependent (indeed $(X-Y+Z)+(X+Y)=2X+Z$). (ii): $\\det\\begin{bmatrix}1&2&0\\\\0&1&2\\\\2&0&1\\end{bmatrix}=9\\neq0$ — independent.</div><div class=\"ml-vi\">(i): $\\det\\begin{bmatrix}1&-1&1\\\\1&1&0\\\\2&0&1\\end{bmatrix}=0$ nên hệ phụ thuộc (thật vậy $(X-Y+Z)+(X+Y)=2X+Z$). (ii): $\\det\\begin{bmatrix}1&2&0\\\\0&1&2\\\\2&0&1\\end{bmatrix}=9\\neq0$ — độc lập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the range of the function $f(x)=x^4+2x^2+1$.<br>(i) $(0,\\infty)$ (ii) $[0,\\infty)$ (iii) $(1,\\infty)$ (iv) $[1,\\infty)$|||Tìm tập giá trị của hàm số $f(x)=x^4+2x^2+1$.<br>(i) $(0,\\infty)$ (ii) $[0,\\infty)$ (iii) $(1,\\infty)$ (iv) $[1,\\infty)$",
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
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$f(x)=(x^2+1)^2\\geq1$ with equality at $x=0$, and $f\\to\\infty$ as $x\\to\\pm\\infty$. The range is $[1,\\infty)$, i.e. (iv).</div><div class=\"ml-vi\">$f(x)=(x^2+1)^2\\geq1$, dấu bằng tại $x=0$, và $f\\to\\infty$ khi $x\\to\\pm\\infty$. Tập giá trị là $[1,\\infty)$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $dy/dx$ by implicit differentiation: $9xy+2y-2=0$.<br>(i) $(-9y(x+1))/2$ (ii) $(-9y)/(9xy+2)$ (iii) $-9(x+y)/2$ (iv) $(-9y)/(9x+2)$|||Tìm $dy/dx$ bằng đạo hàm hàm ẩn: $9xy+2y-2=0$.<br>(i) $(-9y(x+1))/2$ (ii) $(-9y)/(9xy+2)$ (iii) $-9(x+y)/2$ (iv) $(-9y)/(9x+2)$",
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
          "explanation": "<div class=\"ml-en\">$9y+9xy'+2y'=0\\Rightarrow y'(9x+2)=-9y\\Rightarrow y'=\\dfrac{-9y}{9x+2}$, i.e. (iv).</div><div class=\"ml-vi\">$9y+9xy'+2y'=0\\Rightarrow y'(9x+2)=-9y\\Rightarrow y'=\\dfrac{-9y}{9x+2}$, tức (iv).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find two positive numbers such that the sum of the first and three times the second is 60, and the product of the numbers is as large as possible.|||Tìm hai số dương sao cho tổng của số thứ nhất và ba lần số thứ hai bằng 60, đồng thời tích hai số lớn nhất có thể.",
          "options": [
            {
              "text": "30 and 10|||30 và 10"
            },
            {
              "text": "-10 and 90|||-10 và 90"
            },
            {
              "text": "15 and 15|||15 và 15"
            },
            {
              "text": "0 and 60|||0 và 60"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">With $x+3y=60$, $P=xy=y(60-3y)$; $P'=60-6y=0\\Rightarrow y=10$ and $x=30$. Maximum product $=300$.</div><div class=\"ml-vi\">Với $x+3y=60$, $P=xy=y(60-3y)$; $P'=60-6y=0\\Rightarrow y=10$ và $x=30$. Tích lớn nhất $=300$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Write the following system in matrix form: $\\begin{cases}2x+y+z=1\\\\ 3x-z=0\\\\ x+z=-1\\end{cases}$<br>(i) $\\begin{bmatrix}2&1&1\\\\3&0&-1\\\\1&1&0\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (ii) $\\begin{bmatrix}2&1&1\\\\3&0&-1\\\\1&0&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (iii) $\\begin{bmatrix}2&3&1\\\\1&0&0\\\\1&-1&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$|||Viết hệ sau dưới dạng ma trận: $\\begin{cases}2x+y+z=1\\\\ 3x-z=0\\\\ x+z=-1\\end{cases}$<br>(i) $\\begin{bmatrix}2&1&1\\\\3&0&-1\\\\1&1&0\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (ii) $\\begin{bmatrix}2&1&1\\\\3&0&-1\\\\1&0&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$ (iii) $\\begin{bmatrix}2&3&1\\\\1&0&0\\\\1&-1&1\\end{bmatrix}[x\\ y\\ z]^T=[1\\ 0\\ -1]^T$",
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
            2
          ],
          "explanation": "<div class=\"ml-en\">The coefficient rows are $(2,1,1)$, $(3,0,-1)$ and $(1,0,1)$, with right-hand side $[1,0,-1]^T$ — matrix (ii).</div><div class=\"ml-vi\">Các hàng hệ số là $(2,1,1)$, $(3,0,-1)$ và $(1,0,1)$, vế phải $[1,0,-1]^T$ — ma trận (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Express the limit as a definite integral over $[0,2]$: $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\left(5(x_i^*)^2-3(x_i^*)^3\\right)\\Delta x$<br>(i) $\\int_1^2(5x^2-3x^3)dx$ (ii) $\\int_0^2(5x^2-3x^3)dx$ (iii) $\\int_0^1(5x^2-3x^3)dx$ (iv) $\\int_0^2(4x^2-3x^3)dx$|||Biểu diễn giới hạn sau thành tích phân xác định trên $[0,2]$: $\\displaystyle\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\left(5(x_i^*)^2-3(x_i^*)^3\\right)\\Delta x$<br>(i) $\\int_1^2(5x^2-3x^3)dx$ (ii) $\\int_0^2(5x^2-3x^3)dx$ (iii) $\\int_0^1(5x^2-3x^3)dx$ (iv) $\\int_0^2(4x^2-3x^3)dx$",
          "options": [
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A Riemann sum of $f(x)=5x^2-3x^3$ over $[0,2]$ converges to $\\int_0^2(5x^2-3x^3)dx$, i.e. (ii).</div><div class=\"ml-vi\">Tổng Riemann của $f(x)=5x^2-3x^3$ trên $[0,2]$ hội tụ về $\\int_0^2(5x^2-3x^3)dx$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given vectors $x,y,z$ of $\\mathbb{R}^4$: $x=(2,-1,0,1)$, $y=(1,0,0,1)$, and $z=(0,1,0,1)$. Which of the following statements are true?|||Cho các vectơ $x,y,z$ trong $\\mathbb{R}^4$: $x=(2,-1,0,1)$, $y=(1,0,0,1)$, $z=(0,1,0,1)$. Phát biểu nào đúng?",
          "options": [
            {
              "text": "$x$, $y$ and $z$ are linearly dependent and $x=-2y+z$|||$x$, $y$, $z$ phụ thuộc tuyến tính và $x=-2y+z$"
            },
            {
              "text": "$x$, $y$ and $z$ are linearly dependent and $x=2y-z$|||$x$, $y$, $z$ phụ thuộc tuyến tính và $x=2y-z$"
            },
            {
              "text": "$x$, $y$ and $z$ are linearly independent|||$x$, $y$, $z$ độc lập tuyến tính"
            },
            {
              "text": "$x$, $y$ and $z$ are linearly dependent and $x=2y+z$|||$x$, $y$, $z$ phụ thuộc tuyến tính và $x=2y+z$"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$2y-z=(2,0,0,2)-(0,1,0,1)=(2,-1,0,1)=x$, so the three vectors are dependent with $x=2y-z$.</div><div class=\"ml-vi\">$2y-z=(2,0,0,2)-(0,1,0,1)=(2,-1,0,1)=x$ nên ba vectơ phụ thuộc tuyến tính với $x=2y-z$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $X=(-1,-3,3)$ and $U=\\mathrm{span}\\{Y=(1,0,3),\\ Z=(1,1,1)\\}$. If $X$ is in $U$, write $X=aY+bZ$, then find the sum $a+b$.|||Cho $X=(-1,-3,3)$ và $U=\\mathrm{span}\\{Y=(1,0,3),\\ Z=(1,1,1)\\}$. Nếu $X$ thuộc $U$, viết $X=aY+bZ$ rồi tính tổng $a+b$.",
          "options": [
            {
              "text": "$X$ is not in $U$|||$X$ không thuộc $U$"
            },
            {
              "text": "$a+b=-1$|||$a+b=-1$"
            },
            {
              "text": "$a+b=4$|||$a+b=4$"
            },
            {
              "text": "$a+b=0$|||$a+b=0$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The second coordinate gives $b=-3$; the first gives $a+b=-1\\Rightarrow a=2$; check the third: $3(2)+(-3)=3$ ✓. Hence $a+b=-1$.</div><div class=\"ml-vi\">Toạ độ thứ hai cho $b=-3$; toạ độ thứ nhất cho $a+b=-1\\Rightarrow a=2$; kiểm toạ độ thứ ba: $3(2)+(-3)=3$ ✓. Vậy $a+b=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $L:\\mathbb{R}^3\\to\\mathbb{R}^2$ be a linear transformation for which $L[1,0,0]^T=[1,-2]^T$, $L[0,1,0]^T=[2,-3]^T$, $L[0,0,1]^T=[5,1]^T$. Find $L[1,-2,3]^T$.<br>(i) $[12\\ \\ 7]^T$ (ii) $[7\\ \\ 12]^T$ (iii) $[8\\ \\ -4]^T$ (iv) $[-4\\ \\ 8]^T$|||Cho $L:\\mathbb{R}^3\\to\\mathbb{R}^2$ là ánh xạ tuyến tính với $L[1,0,0]^T=[1,-2]^T$, $L[0,1,0]^T=[2,-3]^T$, $L[0,0,1]^T=[5,1]^T$. Tính $L[1,-2,3]^T$.<br>(i) $[12\\ \\ 7]^T$ (ii) $[7\\ \\ 12]^T$ (iii) $[8\\ \\ -4]^T$ (iv) $[-4\\ \\ 8]^T$",
          "options": [
            {
              "text": "(iv)|||(iv)"
            },
            {
              "text": "(i)|||(i)"
            },
            {
              "text": "None of the other choices are correct|||Không đáp án nào khác đúng"
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
          "explanation": "<div class=\"ml-en\">$L[1,-2,3]^T=(1,-2)-2(2,-3)+3(5,1)=(1-4+15,\\ -2+6+3)=(12,7)$, i.e. (i).</div><div class=\"ml-vi\">$L[1,-2,3]^T=(1,-2)-2(2,-3)+3(5,1)=(1-4+15,\\ -2+6+3)=(12,7)$, tức (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $(L)$ be the line passing through $(1,-1)$ with slope $-1/2$. Which of the following points lies in $(L)$?|||Cho $(L)$ là đường thẳng đi qua $(1,-1)$ với hệ số góc $-1/2$. Điểm nào sau đây thuộc $(L)$?",
          "options": [
            {
              "text": "$(-2, 1/2)$|||$(-2, 1/2)$"
            },
            {
              "text": "$(-2, -3/2)$|||$(-2, -3/2)$"
            },
            {
              "text": "$(2, 1)$|||$(2, 1)$"
            },
            {
              "text": "$(2, 0)$|||$(2, 0)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$(L): y=-\\dfrac{x}{2}-\\dfrac12$. At $x=-2$: $y=1-\\dfrac12=\\dfrac12$.</div><div class=\"ml-vi\">$(L): y=-\\dfrac{x}{2}-\\dfrac12$. Tại $x=-2$: $y=1-\\dfrac12=\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the derivative of the function $F(x)=\\displaystyle\\int_x^{10}\\tan\\theta\\,d\\theta$.<br>(i) $-1-\\tan^2(x)$ (ii) $1+\\tan^2(x)$ (iii) $-\\tan(x)$ (iv) $\\tan(x)$|||Tìm đạo hàm của hàm số $F(x)=\\displaystyle\\int_x^{10}\\tan\\theta\\,d\\theta$.<br>(i) $-1-\\tan^2(x)$ (ii) $1+\\tan^2(x)$ (iii) $-\\tan(x)$ (iv) $\\tan(x)$",
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
          "explanation": "<div class=\"ml-en\">$F(x)=-\\int_{10}^{x}\\tan\\theta\\,d\\theta$, so by the Fundamental Theorem of Calculus $F'(x)=-\\tan(x)$, i.e. (iii).</div><div class=\"ml-vi\">$F(x)=-\\int_{10}^{x}\\tan\\theta\\,d\\theta$ nên theo định lý cơ bản của giải tích $F'(x)=-\\tan(x)$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the limit, if it exists $\\displaystyle\\lim_{x\\to1}\\dfrac{x^2-3x+2}{x-1}$|||Tính giới hạn nếu tồn tại $\\displaystyle\\lim_{x\\to1}\\dfrac{x^2-3x+2}{x-1}$",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "-2|||-2"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\dfrac{(x-1)(x-2)}{x-1}=x-2\\to1-2=-1$.</div><div class=\"ml-vi\">$\\dfrac{(x-1)(x-2)}{x-1}=x-2\\to1-2=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Newton's method with the specified initial approximation $x_1$ to find $x_3$, the third approximation to the root of the given equation $x^3-3x+1=0$, $x_1=2$. (Give your answer to 4 decimal places)|||Dùng phương pháp Newton với xấp xỉ ban đầu $x_1$ để tìm $x_3$, xấp xỉ thứ ba của nghiệm phương trình $x^3-3x+1=0$, $x_1=2$. (Làm tròn 4 chữ số thập phân)",
          "options": [
            {
              "text": "1.6667|||1.6667"
            },
            {
              "text": "2.2451|||2.2451"
            },
            {
              "text": "1.5486|||1.5486"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            },
            {
              "text": "2.6667|||2.6667"
            },
            {
              "text": "0.5468|||0.5468"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">$f(2)=3$, $f'(2)=9\\Rightarrow x_2=2-\\dfrac13=1.66667$. Then $f(1.66667)\\approx0.62963$, $f'(1.66667)\\approx5.33333$, so $x_3\\approx1.66667-0.11806=1.5486$.</div><div class=\"ml-vi\">$f(2)=3$, $f'(2)=9\\Rightarrow x_2=2-\\dfrac13=1.66667$. Tiếp theo $f(1.66667)\\approx0.62963$, $f'(1.66667)\\approx5.33333$, nên $x_3\\approx1.66667-0.11806=1.5486$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the distance from the origin to the line passing through the point $(3,1,5)$ and having the direction $v=(2,-1,1)$.<br>(i) $\\sqrt{\\dfrac{55}{3}}$ (ii) $2\\sqrt{\\dfrac{11}{13}}$ (iii) $5\\sqrt{\\dfrac{11}{3}}$ (iv) $10\\sqrt{\\dfrac{11}{3}}$|||Tìm khoảng cách từ gốc toạ độ đến đường thẳng đi qua điểm $(3,1,5)$ với vectơ chỉ phương $v=(2,-1,1)$.<br>(i) $\\sqrt{\\dfrac{55}{3}}$ (ii) $2\\sqrt{\\dfrac{11}{13}}$ (iii) $5\\sqrt{\\dfrac{11}{3}}$ (iv) $10\\sqrt{\\dfrac{11}{3}}$",
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">$\\overrightarrow{OP}\\times v=(3,1,5)\\times(2,-1,1)=(6,7,-5)$ with length $\\sqrt{110}$, and $\\|v\\|=\\sqrt6$. So $d=\\dfrac{\\sqrt{110}}{\\sqrt6}=\\sqrt{\\dfrac{55}{3}}$, i.e. (i).</div><div class=\"ml-vi\">$\\overrightarrow{OP}\\times v=(3,1,5)\\times(2,-1,1)=(6,7,-5)$ có độ dài $\\sqrt{110}$, và $\\|v\\|=\\sqrt6$. Vậy $d=\\dfrac{\\sqrt{110}}{\\sqrt6}=\\sqrt{\\dfrac{55}{3}}$, tức (i).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve the equation $\\begin{vmatrix}x+5&5&3\\\\x-1&x-1&0\\\\1&1&1\\end{vmatrix}=0.$|||Giải phương trình $\\begin{vmatrix}x+5&5&3\\\\x-1&x-1&0\\\\1&1&1\\end{vmatrix}=0.$",
          "options": [
            {
              "text": "$x=0$|||$x=0$"
            },
            {
              "text": "$x=1$; $x=2$|||$x=1$; $x=2$"
            },
            {
              "text": "None of the others|||Không đáp án nào khác"
            },
            {
              "text": "$x=1$|||$x=1$"
            },
            {
              "text": "$x=0$; $x=1$|||$x=0$; $x=1$"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Subtract $3R_3$ from $R_1$: the first row becomes $(x+2,2,0)$. Expanding along the third column: $\\det=1\\cdot\\begin{vmatrix}x+2&2\\\\x-1&x-1\\end{vmatrix}=(x-1)(x+2-2)=x(x-1)$. Setting this to $0$ gives $x=0$ or $x=1$.</div><div class=\"ml-vi\">Trừ $3R_3$ khỏi $R_1$: hàng đầu thành $(x+2,2,0)$. Khai triển theo cột 3: $\\det=1\\cdot\\begin{vmatrix}x+2&2\\\\x-1&x-1\\end{vmatrix}=(x-1)(x+2-2)=x(x-1)$. Cho bằng $0$ ta được $x=0$ hoặc $x=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find $\\displaystyle\\int x^3e^{x^2}dx$.<br>(i) $e^{x^2}-x^2+C$ (ii) $e^{x^2}(x^2-1)/2+C$ (iii) $e^{x^2}(x^2-1)+C$ (iv) $e^x-x^3+C$ (v) $e^{x^3}-x^3+C$|||Tính $\\displaystyle\\int x^3e^{x^2}dx$.<br>(i) $e^{x^2}-x^2+C$ (ii) $e^{x^2}(x^2-1)/2+C$ (iii) $e^{x^2}(x^2-1)+C$ (iv) $e^x-x^3+C$ (v) $e^{x^3}-x^3+C$",
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
              "text": "(v)|||(v)"
            },
            {
              "text": "(i)|||(i)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Let $u=x^2$, $du=2x\\,dx$: $\\dfrac12\\int ue^u du=\\dfrac12(u-1)e^u+C=\\dfrac{e^{x^2}(x^2-1)}{2}+C$, i.e. (ii).</div><div class=\"ml-vi\">Đặt $u=x^2$, $du=2x\\,dx$: $\\dfrac12\\int ue^u du=\\dfrac12(u-1)e^u+C=\\dfrac{e^{x^2}(x^2-1)}{2}+C$, tức (ii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given that $\\lambda=1$ is an eigenvalue of the matrix $\\begin{bmatrix}1&1&1\\\\0&1&1\\\\0&0&0\\end{bmatrix}$, find a set of basic eigenvectors corresponding to this eigenvalue $\\lambda=1$.<br>(i) $\\{[0,0,1]^T\\}$ (ii) $\\{[1,0,0]^T,[0,0,1]^T\\}$ (iii) $\\{[1,0,0]^T\\}$ (iv) $\\{[0,0,1]^T,[1,1,0]^T\\}$|||Biết $\\lambda=1$ là một giá trị riêng của ma trận $\\begin{bmatrix}1&1&1\\\\0&1&1\\\\0&0&0\\end{bmatrix}$, hãy tìm hệ vectơ riêng cơ bản ứng với giá trị riêng $\\lambda=1$.<br>(i) $\\{[0,0,1]^T\\}$ (ii) $\\{[1,0,0]^T,[0,0,1]^T\\}$ (iii) $\\{[1,0,0]^T\\}$ (iv) $\\{[0,0,1]^T,[1,1,0]^T\\}$",
          "options": [
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
            },
            {
              "text": "None of the others|||Không cái nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Solve $(A-I)x=0$ with $A-I=\\begin{bmatrix}0&1&1\\\\0&0&1\\\\0&0&-1\\end{bmatrix}$: rows 2–3 give $z=0$, row 1 gives $y=0$, and $x$ is free. A basic eigenvector is $[1,0,0]^T$, i.e. (iii).</div><div class=\"ml-vi\">Giải $(A-I)x=0$ với $A-I=\\begin{bmatrix}0&1&1\\\\0&0&1\\\\0&0&-1\\end{bmatrix}$: hàng 2–3 cho $z=0$, hàng 1 cho $y=0$, còn $x$ tự do. Vectơ riêng cơ bản là $[1,0,0]^T$, tức (iii).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $\\{v_1,v_2,v_3\\}$ be an <b>orthonormal</b> set in $\\mathbb{R}^3$. Which of the following statements are true?<br>(i) $\\{v_1,\\ v_2+v_3\\}$ is an orthonormal set in $\\mathbb{R}^3$. (ii) $\\left\\{v_1,\\ \\dfrac{1}{\\sqrt2}v_2+\\dfrac{1}{\\sqrt2}v_3\\right\\}$ is an orthonormal set in $\\mathbb{R}^3$.|||Cho $\\{v_1,v_2,v_3\\}$ là hệ <b>trực chuẩn</b> trong $\\mathbb{R}^3$. Phát biểu nào đúng?<br>(i) $\\{v_1,\\ v_2+v_3\\}$ là hệ trực chuẩn trong $\\mathbb{R}^3$. (ii) $\\left\\{v_1,\\ \\dfrac{1}{\\sqrt2}v_2+\\dfrac{1}{\\sqrt2}v_3\\right\\}$ là hệ trực chuẩn trong $\\mathbb{R}^3$.",
          "options": [
            {
              "text": "(ii) only.|||Chỉ (ii)."
            },
            {
              "text": "None of them.|||Không cái nào."
            },
            {
              "text": "Both (i) and (ii).|||Cả (i) và (ii)."
            },
            {
              "text": "(i) only.|||Chỉ (i)."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both sets are orthogonal, but $\\|v_2+v_3\\|=\\sqrt2\\neq1$, so (i) is not orthonormal. In (ii) the norm is $\\sqrt{\\tfrac12+\\tfrac12}=1$, so only (ii) is orthonormal.</div><div class=\"ml-vi\">Cả hai hệ đều trực giao, nhưng $\\|v_2+v_3\\|=\\sqrt2\\neq1$ nên (i) không trực chuẩn. Ở (ii) chuẩn bằng $\\sqrt{\\tfrac12+\\tfrac12}=1$, nên chỉ (ii) trực chuẩn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "At which numbers is the function $f(x)=|x^2-4|$ NOT differentiable?|||Hàm $f(x)=|x^2-4|$ KHÔNG khả vi tại những giá trị nào?",
          "options": [
            {
              "text": "$x=-2$ and $x=2$|||$x=-2$ và $x=2$"
            },
            {
              "text": "$x=0$ only|||Chỉ tại $x=0$"
            },
            {
              "text": "$x=2$ only|||Chỉ tại $x=2$"
            },
            {
              "text": "It is differentiable everywhere|||Hàm khả vi tại mọi điểm"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The absolute value creates a corner exactly where the inside expression changes sign, i.e. where $x^2-4=0$, so at $x=\\pm2$. At $x=2$ the one-sided slopes are $-4$ (from the left) and $+4$ (from the right); the same happens at $x=-2$. Everywhere else $f$ is a polynomial and therefore differentiable.</div><div class=\"ml-vi\">Dấu giá trị tuyệt đối tạo ra điểm gãy đúng tại nơi biểu thức bên trong đổi dấu, tức nơi $x^2-4=0$, nghĩa là tại $x=\\pm2$. Tại $x=2$, hệ số góc một phía là $-4$ (bên trái) và $+4$ (bên phải); tại $x=-2$ cũng vậy. Ở mọi điểm khác $f$ là một đa thức nên khả vi.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "MAE-D10",
      "source": "SAMPLE",
      "sortOrder": 9,
      "title": "Đề 10 — Practice Exam (authored)|||Đề 10 — Đề luyện tập (tự soạn)",
      "description": "MAE101 practice paper written in the format of the nine real FE papers, covering calculus and linear algebra. Every question is new — none repeats a question from Đề 1 to Đề 9, and every answer was verified numerically. (50 questions)|||Đề luyện tập MAE101 soạn theo đúng format của 9 đề FE thật, phủ cả giải tích và đại số tuyến tính. Toàn bộ câu hỏi đều mới — không trùng với Đề 1 đến Đề 9, và mọi đáp án đều đã được kiểm bằng máy. (50 câu)",
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
          "prompt": "Evaluate $\\lim_{x\\to 2}\\dfrac{x^2-4}{x^2-3x+2}$.|||Tính $\\lim_{x\\to 2}\\dfrac{x^2-4}{x^2-3x+2}$.",
          "options": [
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
              "text": "$\\infty$|||$\\infty$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both numerator and denominator vanish at $x=2$, so factor first: $\\dfrac{(x-2)(x+2)}{(x-2)(x-1)}=\\dfrac{x+2}{x-1}$ for $x\\ne 2$. Letting $x\\to 2$ gives $\\dfrac{4}{1}=4$.</div><div class=\"ml-vi\">Cả tử và mẫu đều bằng 0 tại $x=2$ nên phải phân tích thành nhân tử trước: $\\dfrac{(x-2)(x+2)}{(x-2)(x-1)}=\\dfrac{x+2}{x-1}$ với $x\\ne 2$. Cho $x\\to 2$ được $\\dfrac{4}{1}=4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\lim_{x\\to\\infty}\\dfrac{3x^2-5x+1}{2x^2+7}$.|||Tính $\\lim_{x\\to\\infty}\\dfrac{3x^2-5x+1}{2x^2+7}$.",
          "options": [
            {
              "text": "$\\dfrac32$|||$\\dfrac32$"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "$\\infty$|||$\\infty$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Divide numerator and denominator by $x^2$: $\\dfrac{3-5/x+1/x^2}{2+7/x^2}\\to\\dfrac{3}{2}$. When the degrees are equal the limit is the ratio of the leading coefficients.</div><div class=\"ml-vi\">Chia cả tử và mẫu cho $x^2$: $\\dfrac{3-5/x+1/x^2}{2+7/x^2}\\to\\dfrac{3}{2}$. Khi bậc tử bằng bậc mẫu, giới hạn bằng tỉ số hai hệ số bậc cao nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\lim_{x\\to 0}\\dfrac{\\sin 5x}{3x}$.|||Tính $\\lim_{x\\to 0}\\dfrac{\\sin 5x}{3x}$.",
          "options": [
            {
              "text": "$\\dfrac53$|||$\\dfrac53$"
            },
            {
              "text": "$\\dfrac35$|||$\\dfrac35$"
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
          "explanation": "<div class=\"ml-en\">Rewrite as $\\dfrac{5}{3}\\cdot\\dfrac{\\sin 5x}{5x}$. Since $\\lim_{u\\to0}\\dfrac{\\sin u}{u}=1$ with $u=5x$, the limit is $\\dfrac53$.</div><div class=\"ml-vi\">Viết lại thành $\\dfrac{5}{3}\\cdot\\dfrac{\\sin 5x}{5x}$. Vì $\\lim_{u\\to0}\\dfrac{\\sin u}{u}=1$ với $u=5x$ nên giới hạn bằng $\\dfrac53$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the value of $a$ so that $f(x)=\\begin{cases}x^2+a & \\text{if } x\\lt 1\\\\ 3x-2 & \\text{if } x\\ge 1\\end{cases}$ is continuous at $x=1$.|||Tìm giá trị của $a$ để hàm $f(x)=\\begin{cases}x^2+a & \\text{nếu } x\\lt 1\\\\ 3x-2 & \\text{nếu } x\\ge 1\\end{cases}$ liên tục tại $x=1$.",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "-1|||-1"
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
          "explanation": "<div class=\"ml-en\">Continuity at $x=1$ requires the two one-sided limits to agree with $f(1)$: $\\lim_{x\\to1^-}f(x)=1+a$ and $f(1)=3(1)-2=1$. So $1+a=1$, giving $a=0$.</div><div class=\"ml-vi\">Liên tục tại $x=1$ đòi hỏi hai giới hạn một phía bằng $f(1)$: $\\lim_{x\\to1^-}f(x)=1+a$ và $f(1)=3(1)-2=1$. Vậy $1+a=1$, suy ra $a=0$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\lim_{x\\to 0}\\dfrac{\\sqrt{x+9}-3}{x}$.|||Tính $\\lim_{x\\to 0}\\dfrac{\\sqrt{x+9}-3}{x}$.",
          "options": [
            {
              "text": "$\\dfrac16$|||$\\dfrac16$"
            },
            {
              "text": "$\\dfrac13$|||$\\dfrac13$"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "$\\dfrac19$|||$\\dfrac19$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Multiply by the conjugate: $\\dfrac{(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)}{x(\\sqrt{x+9}+3)}=\\dfrac{x}{x(\\sqrt{x+9}+3)}=\\dfrac{1}{\\sqrt{x+9}+3}\\to\\dfrac{1}{6}$.</div><div class=\"ml-vi\">Nhân với biểu thức liên hợp: $\\dfrac{(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)}{x(\\sqrt{x+9}+3)}=\\dfrac{x}{x(\\sqrt{x+9}+3)}=\\dfrac{1}{\\sqrt{x+9}+3}\\to\\dfrac{1}{6}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\lim_{x\\to 0^-}\\dfrac{|x|}{x}$.|||Tính $\\lim_{x\\to 0^-}\\dfrac{|x|}{x}$.",
          "options": [
            {
              "text": "-1|||-1"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "The limit does not exist|||Giới hạn không tồn tại"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For $x\\lt 0$ we have $|x|=-x$, so the quotient is $\\dfrac{-x}{x}=-1$ for every such $x$; the one-sided limit is $-1$. (The two-sided limit does not exist, because the right-hand limit is $+1$ — but the question asks only for the left one.)</div><div class=\"ml-vi\">Với $x\\lt 0$ thì $|x|=-x$ nên thương bằng $\\dfrac{-x}{x}=-1$ với mọi $x$ như vậy; giới hạn một phía bằng $-1$. (Giới hạn hai phía không tồn tại vì giới hạn phải bằng $+1$ — nhưng câu hỏi chỉ hỏi giới hạn trái.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=x^3e^x$. Find $f'(1)$.|||Cho $f(x)=x^3e^x$. Tính $f'(1)$.",
          "options": [
            {
              "text": "$4e$|||$4e$"
            },
            {
              "text": "$3e$|||$3e$"
            },
            {
              "text": "$e$|||$e$"
            },
            {
              "text": "$4e^2$|||$4e^2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Product rule: $f'(x)=3x^2e^x+x^3e^x=e^x(3x^2+x^3)$. At $x=1$: $e(3+1)=4e$.</div><div class=\"ml-vi\">Quy tắc tích: $f'(x)=3x^2e^x+x^3e^x=e^x(3x^2+x^3)$. Tại $x=1$: $e(3+1)=4e$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $y=\\dfrac{2x+1}{x^2+3}$. Find $y'(1)$.|||Cho $y=\\dfrac{2x+1}{x^2+3}$. Tính $y'(1)$.",
          "options": [
            {
              "text": "$\\dfrac18$|||$\\dfrac18$"
            },
            {
              "text": "$\\dfrac14$|||$\\dfrac14$"
            },
            {
              "text": "$-\\dfrac18$|||$-\\dfrac18$"
            },
            {
              "text": "$\\dfrac{1}{16}$|||$\\dfrac{1}{16}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Quotient rule: $y'=\\dfrac{2(x^2+3)-(2x+1)(2x)}{(x^2+3)^2}$. At $x=1$: $\\dfrac{2\\cdot4-3\\cdot2}{16}=\\dfrac{2}{16}=\\dfrac18$.</div><div class=\"ml-vi\">Quy tắc thương: $y'=\\dfrac{2(x^2+3)-(2x+1)(2x)}{(x^2+3)^2}$. Tại $x=1$: $\\dfrac{2\\cdot4-3\\cdot2}{16}=\\dfrac{2}{16}=\\dfrac18$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $y=\\sqrt{x^2+1}$. Find $y'(2)$.|||Cho $y=\\sqrt{x^2+1}$. Tính $y'(2)$.",
          "options": [
            {
              "text": "$\\dfrac{2}{\\sqrt5}$|||$\\dfrac{2}{\\sqrt5}$"
            },
            {
              "text": "$\\dfrac{1}{\\sqrt5}$|||$\\dfrac{1}{\\sqrt5}$"
            },
            {
              "text": "$\\dfrac{4}{\\sqrt5}$|||$\\dfrac{4}{\\sqrt5}$"
            },
            {
              "text": "$\\sqrt5$|||$\\sqrt5$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Chain rule: $y'=\\dfrac{x}{\\sqrt{x^2+1}}$. At $x=2$: $\\dfrac{2}{\\sqrt5}$.</div><div class=\"ml-vi\">Quy tắc dây chuyền: $y'=\\dfrac{x}{\\sqrt{x^2+1}}$. Tại $x=2$: $\\dfrac{2}{\\sqrt5}$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The curve $x^2+xy+y^2=7$ passes through $(1,2)$. Find $\\dfrac{dy}{dx}$ at that point.|||Đường cong $x^2+xy+y^2=7$ đi qua điểm $(1,2)$. Tính $\\dfrac{dy}{dx}$ tại điểm đó.",
          "options": [
            {
              "text": "$-\\dfrac45$|||$-\\dfrac45$"
            },
            {
              "text": "$-\\dfrac54$|||$-\\dfrac54$"
            },
            {
              "text": "$\\dfrac45$|||$\\dfrac45$"
            },
            {
              "text": "$-\\dfrac13$|||$-\\dfrac13$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Differentiate implicitly: $2x+y+xy'+2yy'=0$, so $y'=-\\dfrac{2x+y}{x+2y}$. At $(1,2)$: $-\\dfrac{2+2}{1+4}=-\\dfrac45$.</div><div class=\"ml-vi\">Đạo hàm hai vế theo ẩn: $2x+y+xy'+2yy'=0$, suy ra $y'=-\\dfrac{2x+y}{x+2y}$. Tại $(1,2)$: $-\\dfrac{2+2}{1+4}=-\\dfrac45$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $f(x)=\\sin 2x$. Find $f''\\left(\\dfrac{\\pi}{4}\\right)$.|||Cho $f(x)=\\sin 2x$. Tính $f''\\left(\\dfrac{\\pi}{4}\\right)$.",
          "options": [
            {
              "text": "-4|||-4"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "-2|||-2"
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
          "explanation": "<div class=\"ml-en\">$f'(x)=2\\cos 2x$ and $f''(x)=-4\\sin 2x$. At $x=\\dfrac{\\pi}{4}$: $-4\\sin\\dfrac{\\pi}{2}=-4$.</div><div class=\"ml-vi\">$f'(x)=2\\cos 2x$ và $f''(x)=-4\\sin 2x$. Tại $x=\\dfrac{\\pi}{4}$: $-4\\sin\\dfrac{\\pi}{2}=-4$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use the linearization of $f(x)=\\sqrt{x}$ at $a=4$ to estimate $\\sqrt{4.02}$.|||Dùng xấp xỉ tuyến tính của $f(x)=\\sqrt{x}$ tại $a=4$ để ước lượng $\\sqrt{4.02}$.",
          "options": [
            {
              "text": "2.005|||2.005"
            },
            {
              "text": "2.05|||2.05"
            },
            {
              "text": "2.0005|||2.0005"
            },
            {
              "text": "2.01|||2.01"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$L(x)=f(4)+f'(4)(x-4)=2+\\dfrac14(x-4)$. With $x=4.02$: $2+\\dfrac14(0.02)=2.005$.</div><div class=\"ml-vi\">$L(x)=f(4)+f'(4)(x-4)=2+\\dfrac14(x-4)$. Với $x=4.02$: $2+\\dfrac14(0.02)=2.005$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ladder 13 ft long leans against a vertical wall. The foot of the ladder slides away from the wall at 2 ft/s. How fast is the top sliding down when the foot is 5 ft from the wall?|||Một cái thang dài 13 ft dựa vào tường thẳng đứng. Chân thang trượt ra xa tường với tốc độ 2 ft/s. Đầu thang tụt xuống nhanh thế nào khi chân thang cách tường 5 ft?",
          "options": [
            {
              "text": "$\\dfrac56$ ft/s|||$\\dfrac56$ ft/s"
            },
            {
              "text": "$\\dfrac65$ ft/s|||$\\dfrac65$ ft/s"
            },
            {
              "text": "$\\dfrac{5}{12}$ ft/s|||$\\dfrac{5}{12}$ ft/s"
            },
            {
              "text": "2 ft/s|||2 ft/s"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">From $x^2+y^2=169$: $2x\\dfrac{dx}{dt}+2y\\dfrac{dy}{dt}=0$. When $x=5$, $y=\\sqrt{169-25}=12$, so $\\dfrac{dy}{dt}=-\\dfrac{x}{y}\\dfrac{dx}{dt}=-\\dfrac{5\\cdot2}{12}=-\\dfrac56$ ft/s; the top falls at $\\dfrac56$ ft/s.</div><div class=\"ml-vi\">Từ $x^2+y^2=169$: $2x\\dfrac{dx}{dt}+2y\\dfrac{dy}{dt}=0$. Khi $x=5$ thì $y=\\sqrt{169-25}=12$, nên $\\dfrac{dy}{dt}=-\\dfrac{x}{y}\\dfrac{dx}{dt}=-\\dfrac{5\\cdot2}{12}=-\\dfrac56$ ft/s; đầu thang tụt xuống với tốc độ $\\dfrac56$ ft/s.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find all critical numbers of $f(x)=x^3-3x^2-9x+5$.|||Tìm tất cả các điểm tới hạn của $f(x)=x^3-3x^2-9x+5$.",
          "options": [
            {
              "text": "$x=-1$ and $x=3$|||$x=-1$ và $x=3$"
            },
            {
              "text": "$x=1$ and $x=-3$|||$x=1$ và $x=-3$"
            },
            {
              "text": "$x=0$ and $x=3$|||$x=0$ và $x=3$"
            },
            {
              "text": "$x=-1$ only|||Chỉ có $x=-1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=3x^2-6x-9=3(x^2-2x-3)=3(x-3)(x+1)$, which is zero exactly at $x=3$ and $x=-1$. The derivative is a polynomial, so there are no points where it fails to exist.</div><div class=\"ml-vi\">$f'(x)=3x^2-6x-9=3(x^2-2x-3)=3(x-3)(x+1)$, bằng 0 đúng tại $x=3$ và $x=-1$. Đạo hàm là đa thức nên không có điểm nào đạo hàm không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the absolute maximum and absolute minimum values of $f(x)=2x^3-3x^2-12x+1$ on $[-2,3]$.|||Tìm giá trị lớn nhất và nhỏ nhất tuyệt đối của $f(x)=2x^3-3x^2-12x+1$ trên $[-2,3]$.",
          "options": [
            {
              "text": "Maximum 8, minimum -19|||Lớn nhất 8, nhỏ nhất -19"
            },
            {
              "text": "Maximum 8, minimum -8|||Lớn nhất 8, nhỏ nhất -8"
            },
            {
              "text": "Maximum -3, minimum -19|||Lớn nhất -3, nhỏ nhất -19"
            },
            {
              "text": "Maximum 1, minimum -19|||Lớn nhất 1, nhỏ nhất -19"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$f'(x)=6x^2-6x-12=6(x-2)(x+1)$, so the critical numbers inside $[-2,3]$ are $x=-1$ and $x=2$. Values: $f(-2)=-3$, $f(-1)=8$, $f(2)=-19$, $f(3)=-8$. Maximum $=8$, minimum $=-19$.</div><div class=\"ml-vi\">$f'(x)=6x^2-6x-12=6(x-2)(x+1)$ nên các điểm tới hạn trong $[-2,3]$ là $x=-1$ và $x=2$. Giá trị: $f(-2)=-3$, $f(-1)=8$, $f(2)=-19$, $f(3)=-8$. Lớn nhất $=8$, nhỏ nhất $=-19$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the inflection point of the curve $y=x^3-6x^2+9x$.|||Tìm điểm uốn của đường cong $y=x^3-6x^2+9x$.",
          "options": [
            {
              "text": "$(2,2)$|||$(2,2)$"
            },
            {
              "text": "$(2,0)$|||$(2,0)$"
            },
            {
              "text": "$(1,4)$|||$(1,4)$"
            },
            {
              "text": "$(3,0)$|||$(3,0)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$y''=6x-12=0$ gives $x=2$, and $y''$ changes sign there, so it really is an inflection point. The $y$-value is $8-24+18=2$, so the point is $(2,2)$.</div><div class=\"ml-vi\">$y''=6x-12=0$ cho $x=2$, và $y''$ đổi dấu tại đó nên đây thực sự là điểm uốn. Giá trị $y$ bằng $8-24+18=2$, vậy điểm uốn là $(2,2)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A rectangle has a perimeter of 40 m. What is the largest possible area?|||Một hình chữ nhật có chu vi 40 m. Diện tích lớn nhất có thể là bao nhiêu?",
          "options": [
            {
              "text": "$100\\ \\text{m}^2$|||$100\\ \\text{m}^2$"
            },
            {
              "text": "$80\\ \\text{m}^2$|||$80\\ \\text{m}^2$"
            },
            {
              "text": "$400\\ \\text{m}^2$|||$400\\ \\text{m}^2$"
            },
            {
              "text": "$50\\ \\text{m}^2$|||$50\\ \\text{m}^2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">With $2(x+y)=40$ we get $y=20-x$ and $A(x)=x(20-x)=20x-x^2$. Then $A'(x)=20-2x=0$ gives $x=10$, $y=10$ and $A=100\\ \\text{m}^2$; $A''=-2\\lt 0$ confirms a maximum. Among all rectangles of a fixed perimeter the square is the largest.</div><div class=\"ml-vi\">Từ $2(x+y)=40$ được $y=20-x$ và $A(x)=x(20-x)=20x-x^2$. Khi đó $A'(x)=20-2x=0$ cho $x=10$, $y=10$ và $A=100\\ \\text{m}^2$; $A''=-2\\lt 0$ khẳng định đây là cực đại. Trong các hình chữ nhật cùng chu vi, hình vuông có diện tích lớn nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Apply one step of Newton's method to $f(x)=x^2-5$ starting from $x_0=2$. What is $x_1$?|||Thực hiện một bước của phương pháp Newton cho $f(x)=x^2-5$ với $x_0=2$. Giá trị $x_1$ là bao nhiêu?",
          "options": [
            {
              "text": "2.25|||2.25"
            },
            {
              "text": "2.5|||2.5"
            },
            {
              "text": "2.2|||2.2"
            },
            {
              "text": "1.75|||1.75"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$x_1=x_0-\\dfrac{f(x_0)}{f'(x_0)}=2-\\dfrac{4-5}{4}=2+0.25=2.25$. (For comparison $\\sqrt5\\approx2.2360$, so one step is already close.)</div><div class=\"ml-vi\">$x_1=x_0-\\dfrac{f(x_0)}{f'(x_0)}=2-\\dfrac{4-5}{4}=2+0.25=2.25$. (Để so sánh, $\\sqrt5\\approx2.2360$ nên chỉ một bước đã khá sát.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The function $f(x)=x^2$ satisfies the hypotheses of the Mean Value Theorem on $[1,3]$. Find the number $c$ that the theorem guarantees.|||Hàm $f(x)=x^2$ thoả các giả thiết của Định lý giá trị trung bình trên $[1,3]$. Tìm số $c$ mà định lý bảo đảm tồn tại.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "1.5|||1.5"
            },
            {
              "text": "2.5|||2.5"
            },
            {
              "text": "$\\sqrt3$|||$\\sqrt3$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The theorem requires $f'(c)=\\dfrac{f(3)-f(1)}{3-1}=\\dfrac{9-1}{2}=4$. Since $f'(x)=2x$, we solve $2c=4$, so $c=2$, which does lie in $(1,3)$.</div><div class=\"ml-vi\">Định lý đòi hỏi $f'(c)=\\dfrac{f(3)-f(1)}{3-1}=\\dfrac{9-1}{2}=4$. Vì $f'(x)=2x$ nên giải $2c=4$, được $c=2$, và $c=2$ nằm trong $(1,3)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_0^1 (3x^2+2x)\\,dx$.|||Tính $\\displaystyle\\int_0^1 (3x^2+2x)\\,dx$.",
          "options": [
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
              "text": "5|||5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An antiderivative is $x^3+x^2$, so the value is $(1+1)-(0+0)=2$.</div><div class=\"ml-vi\">Một nguyên hàm là $x^3+x^2$ nên giá trị bằng $(1+1)-(0+0)=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_0^1 xe^x\\,dx$.|||Tính $\\displaystyle\\int_0^1 xe^x\\,dx$.",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "$e-1$|||$e-1$"
            },
            {
              "text": "$e$|||$e$"
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
          "explanation": "<div class=\"ml-en\">Integrate by parts with $u=x$, $dv=e^x dx$: $\\int xe^x dx = xe^x-e^x$. Evaluating from 0 to 1: $(e-e)-(0-1)=1$.</div><div class=\"ml-vi\">Tích phân từng phần với $u=x$, $dv=e^x dx$: $\\int xe^x dx = xe^x-e^x$. Thay cận từ 0 đến 1: $(e-e)-(0-1)=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_0^1 \\dfrac{2x}{x^2+1}\\,dx$.|||Tính $\\displaystyle\\int_0^1 \\dfrac{2x}{x^2+1}\\,dx$.",
          "options": [
            {
              "text": "$\\ln 2$|||$\\ln 2$"
            },
            {
              "text": "$\\dfrac12\\ln 2$|||$\\dfrac12\\ln 2$"
            },
            {
              "text": "$\\ln 3$|||$\\ln 3$"
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
          "explanation": "<div class=\"ml-en\">Substitute $u=x^2+1$, $du=2x\\,dx$; the limits become $u=1$ to $u=2$, so the integral is $\\int_1^2\\dfrac{du}{u}=\\ln 2$.</div><div class=\"ml-vi\">Đổi biến $u=x^2+1$, $du=2x\\,dx$; cận trở thành $u=1$ tới $u=2$, nên tích phân bằng $\\int_1^2\\dfrac{du}{u}=\\ln 2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate $\\displaystyle\\int_1^e \\dfrac{\\ln x}{x}\\,dx$.|||Tính $\\displaystyle\\int_1^e \\dfrac{\\ln x}{x}\\,dx$.",
          "options": [
            {
              "text": "$\\dfrac12$|||$\\dfrac12$"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "$e-1$|||$e-1$"
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
          "explanation": "<div class=\"ml-en\">Put $u=\\ln x$, $du=\\dfrac{dx}{x}$. The limits become $u=0$ to $u=1$, so the integral is $\\int_0^1 u\\,du=\\dfrac{u^2}{2}\\Big|_0^1=\\dfrac12$.</div><div class=\"ml-vi\">Đặt $u=\\ln x$, $du=\\dfrac{dx}{x}$. Cận trở thành $u=0$ tới $u=1$, nên tích phân bằng $\\int_0^1 u\\,du=\\dfrac{u^2}{2}\\Big|_0^1=\\dfrac12$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A particle moves along a line with velocity $v(t)=3t^2-2t$ (m/s). Find its displacement between $t=0$ and $t=2$ seconds.|||Một chất điểm chuyển động trên đường thẳng với vận tốc $v(t)=3t^2-2t$ (m/s). Tìm độ dời của nó từ $t=0$ đến $t=2$ giây.",
          "options": [
            {
              "text": "4 m|||4 m"
            },
            {
              "text": "8 m|||8 m"
            },
            {
              "text": "12 m|||12 m"
            },
            {
              "text": "2 m|||2 m"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By the net change theorem, displacement $=\\int_0^2 v(t)\\,dt=\\big[t^3-t^2\\big]_0^2=(8-4)-0=4$ m. Note that $v(t)\\ge0$ on $[0,2]$ only from $t=\\dfrac23$ on, but the question asks for displacement, not total distance.</div><div class=\"ml-vi\">Theo định lý biến thiên toàn phần, độ dời $=\\int_0^2 v(t)\\,dt=\\big[t^3-t^2\\big]_0^2=(8-4)-0=4$ m. Chú ý $v(t)\\ge0$ trên $[0,2]$ chỉ từ $t=\\dfrac23$ trở đi, nhưng câu hỏi hỏi độ dời chứ không phải quãng đường đi được.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $g(x)=\\displaystyle\\int_0^{x^2}\\sin t\\,dt$. Find $g'(x)$.|||Cho $g(x)=\\displaystyle\\int_0^{x^2}\\sin t\\,dt$. Tính $g'(x)$.",
          "options": [
            {
              "text": "$2x\\sin(x^2)$|||$2x\\sin(x^2)$"
            },
            {
              "text": "$\\sin(x^2)$|||$\\sin(x^2)$"
            },
            {
              "text": "$2x\\cos(x^2)$|||$2x\\cos(x^2)$"
            },
            {
              "text": "$-\\cos(x^2)$|||$-\\cos(x^2)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By the Fundamental Theorem of Calculus combined with the chain rule, if $g(x)=\\int_0^{u(x)}f(t)dt$ then $g'(x)=f(u(x))\\cdot u'(x)$. Here $f=\\sin$ and $u=x^2$, so $g'(x)=\\sin(x^2)\\cdot 2x$.</div><div class=\"ml-vi\">Theo Định lý cơ bản của giải tích kết hợp quy tắc dây chuyền, nếu $g(x)=\\int_0^{u(x)}f(t)dt$ thì $g'(x)=f(u(x))\\cdot u'(x)$. Ở đây $f=\\sin$ và $u=x^2$ nên $g'(x)=\\sin(x^2)\\cdot 2x$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Evaluate the improper integral $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^3}\\,dx$.|||Tính tích phân suy rộng $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^3}\\,dx$.",
          "options": [
            {
              "text": "$\\dfrac12$|||$\\dfrac12$"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "$\\dfrac13$|||$\\dfrac13$"
            },
            {
              "text": "The integral diverges|||Tích phân phân kỳ"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\int_1^{b}x^{-3}dx=\\left[-\\dfrac{1}{2x^2}\\right]_1^{b}=\\dfrac12-\\dfrac{1}{2b^2}\\to\\dfrac12$ as $b\\to\\infty$. In general $\\int_1^\\infty x^{-p}dx$ converges exactly when $p\\gt 1$, and here $p=3$.</div><div class=\"ml-vi\">$\\int_1^{b}x^{-3}dx=\\left[-\\dfrac{1}{2x^2}\\right]_1^{b}=\\dfrac12-\\dfrac{1}{2b^2}\\to\\dfrac12$ khi $b\\to\\infty$. Tổng quát, $\\int_1^\\infty x^{-p}dx$ hội tụ đúng khi $p\\gt 1$, ở đây $p=3$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Approximate $\\displaystyle\\int_0^2 x^2\\,dx$ by a Riemann sum with $n=4$ subintervals, using right endpoints.|||Xấp xỉ $\\displaystyle\\int_0^2 x^2\\,dx$ bằng tổng Riemann với $n=4$ đoạn con, dùng mút phải.",
          "options": [
            {
              "text": "3.75|||3.75"
            },
            {
              "text": "2.75|||2.75"
            },
            {
              "text": "2.5|||2.5"
            },
            {
              "text": "3.5|||3.5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\Delta x=\\dfrac{2-0}{4}=0.5$ and the right endpoints are $0.5,\\ 1,\\ 1.5,\\ 2$. The sum is $0.5(0.25+1+2.25+4)=0.5\\cdot7.5=3.75$. (The exact value is $\\dfrac83\\approx2.67$; a right sum overestimates an increasing function.)</div><div class=\"ml-vi\">$\\Delta x=\\dfrac{2-0}{4}=0.5$ và các mút phải là $0.5,\\ 1,\\ 1.5,\\ 2$. Tổng bằng $0.5(0.25+1+2.25+4)=0.5\\cdot7.5=3.75$. (Giá trị chính xác là $\\dfrac83\\approx2.67$; tổng mút phải cho kết quả lớn hơn với hàm đồng biến.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Simpson's rule with $n=2$ to approximate $\\displaystyle\\int_0^2 x^3\\,dx$.|||Dùng quy tắc Simpson với $n=2$ để xấp xỉ $\\displaystyle\\int_0^2 x^3\\,dx$.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "4.5|||4.5"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$h=\\dfrac{2-0}{2}=1$ and Simpson's rule gives $\\dfrac{h}{3}\\big(f(0)+4f(1)+f(2)\\big)=\\dfrac13(0+4+8)=4$. This matches the exact value $\\dfrac{x^4}{4}\\Big|_0^2=4$, because Simpson's rule is exact for polynomials of degree up to 3.</div><div class=\"ml-vi\">$h=\\dfrac{2-0}{2}=1$ và quy tắc Simpson cho $\\dfrac{h}{3}\\big(f(0)+4f(1)+f(2)\\big)=\\dfrac13(0+4+8)=4$. Kết quả trùng với giá trị chính xác $\\dfrac{x^4}{4}\\Big|_0^2=4$, vì quy tắc Simpson chính xác với đa thức bậc không quá 3.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compute the determinant of $A=\\begin{pmatrix}1&2&3\\\\0&1&4\\\\5&6&0\\end{pmatrix}$.|||Tính định thức của $A=\\begin{pmatrix}1&2&3\\\\0&1&4\\\\5&6&0\\end{pmatrix}$.",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "0|||0"
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
          "explanation": "<div class=\"ml-en\">Expand along the first row: $1(1\\cdot0-4\\cdot6)-2(0\\cdot0-4\\cdot5)+3(0\\cdot6-1\\cdot5)=-24+40-15=1$.</div><div class=\"ml-vi\">Khai triển theo hàng đầu: $1(1\\cdot0-4\\cdot6)-2(0\\cdot0-4\\cdot5)+3(0\\cdot6-1\\cdot5)=-24+40-15=1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the inverse of $A=\\begin{pmatrix}2&1\\\\5&3\\end{pmatrix}$.|||Tìm ma trận nghịch đảo của $A=\\begin{pmatrix}2&1\\\\5&3\\end{pmatrix}$.",
          "options": [
            {
              "text": "$\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$|||$\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}3&1\\\\5&2\\end{pmatrix}$|||$\\begin{pmatrix}3&1\\\\5&2\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}-3&1\\\\5&-2\\end{pmatrix}$|||$\\begin{pmatrix}-3&1\\\\5&-2\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}2&-1\\\\-5&3\\end{pmatrix}$|||$\\begin{pmatrix}2&-1\\\\-5&3\\end{pmatrix}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For a $2\\times2$ matrix, $A^{-1}=\\dfrac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$. Here $\\det A=6-5=1$, so $A^{-1}=\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$; multiplying it by $A$ indeed gives the identity.</div><div class=\"ml-vi\">Với ma trận $2\\times2$, $A^{-1}=\\dfrac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$. Ở đây $\\det A=6-5=1$ nên $A^{-1}=\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}$; nhân với $A$ đúng bằng ma trận đơn vị.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The matrix $B$ is obtained from a $3\\times3$ matrix $A$ by interchanging two rows. If $\\det(A)=5$, what is $\\det(B)$?|||Ma trận $B$ nhận được từ ma trận $3\\times3$ $A$ bằng cách đổi chỗ hai hàng. Nếu $\\det(A)=5$ thì $\\det(B)$ bằng bao nhiêu?",
          "options": [
            {
              "text": "-5|||-5"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "10|||10"
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
          "explanation": "<div class=\"ml-en\">Interchanging two rows reverses the sign of a determinant, so $\\det(B)=-5$. For comparison: multiplying one row by $k$ multiplies the determinant by $k$, while adding a multiple of one row to another leaves it unchanged.</div><div class=\"ml-vi\">Đổi chỗ hai hàng thì định thức đổi dấu, nên $\\det(B)=-5$. Để so sánh: nhân một hàng với $k$ thì định thức nhân $k$, còn cộng một bội của hàng này vào hàng khác thì định thức không đổi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $D=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$. Compute $D^4$.|||Cho $D=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$. Tính $D^4$.",
          "options": [
            {
              "text": "$\\begin{pmatrix}16&0\\\\0&81\\end{pmatrix}$|||$\\begin{pmatrix}16&0\\\\0&81\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}8&0\\\\0&12\\end{pmatrix}$|||$\\begin{pmatrix}8&0\\\\0&12\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}16&0\\\\0&12\\end{pmatrix}$|||$\\begin{pmatrix}16&0\\\\0&12\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}8&0\\\\0&81\\end{pmatrix}$|||$\\begin{pmatrix}8&0\\\\0&81\\end{pmatrix}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A diagonal matrix is raised to a power entrywise on the diagonal: $D^n=\\begin{pmatrix}2^n&0\\\\0&3^n\\end{pmatrix}$. With $n=4$: $2^4=16$ and $3^4=81$, so $D^4=\\begin{pmatrix}16&0\\\\0&81\\end{pmatrix}$. Multiplying the entries by 4 instead of exponentiating is the usual mistake.</div><div class=\"ml-vi\">Ma trận đường chéo được luỹ thừa theo từng phần tử trên đường chéo: $D^n=\\begin{pmatrix}2^n&0\\\\0&3^n\\end{pmatrix}$. Với $n=4$: $2^4=16$ và $3^4=81$, nên $D^4=\\begin{pmatrix}16&0\\\\0&81\\end{pmatrix}$. Lỗi thường gặp là nhân các phần tử với 4 thay vì luỹ thừa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use Cramer's rule to find $x$ in the system $\\begin{cases}2x+y=5\\\\x+3y=10\\end{cases}$.|||Dùng quy tắc Cramer để tìm $x$ trong hệ $\\begin{cases}2x+y=5\\\\x+3y=10\\end{cases}$.",
          "options": [
            {
              "text": "$x=1$|||$x=1$"
            },
            {
              "text": "$x=3$|||$x=3$"
            },
            {
              "text": "$x=5$|||$x=5$"
            },
            {
              "text": "$x=-1$|||$x=-1$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$D=\\begin{vmatrix}2&1\\\\1&3\\end{vmatrix}=6-1=5$ and $D_x=\\begin{vmatrix}5&1\\\\10&3\\end{vmatrix}=15-10=5$, so $x=\\dfrac{D_x}{D}=1$. (Similarly $D_y=20-5=15$ gives $y=3$; check: $2(1)+3=5$ and $1+3(3)=10$.)</div><div class=\"ml-vi\">$D=\\begin{vmatrix}2&1\\\\1&3\\end{vmatrix}=6-1=5$ và $D_x=\\begin{vmatrix}5&1\\\\10&3\\end{vmatrix}=15-10=5$, nên $x=\\dfrac{D_x}{D}=1$. (Tương tự $D_y=20-5=15$ cho $y=3$; kiểm tra: $2(1)+3=5$ và $1+3(3)=10$.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the rank of $\\begin{pmatrix}1&2&3&4\\\\2&4&6&8\\\\1&1&1&1\\end{pmatrix}$.|||Tìm hạng của ma trận $\\begin{pmatrix}1&2&3&4\\\\2&4&6&8\\\\1&1&1&1\\end{pmatrix}$.",
          "options": [
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
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Row 2 is exactly twice row 1, so it disappears in elimination. Rows 1 and 3 are not proportional, so exactly two rows remain independent: the rank is 2.</div><div class=\"ml-vi\">Hàng 2 đúng bằng 2 lần hàng 1 nên bị triệt tiêu khi khử. Hàng 1 và hàng 3 không tỉ lệ với nhau nên còn đúng hai hàng độc lập: hạng bằng 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Solve the system $\\begin{cases}2x+3y=8\\\\x-y=-1\\end{cases}$.|||Giải hệ $\\begin{cases}2x+3y=8\\\\x-y=-1\\end{cases}$.",
          "options": [
            {
              "text": "$x=1,\\ y=2$|||$x=1,\\ y=2$"
            },
            {
              "text": "$x=2,\\ y=1$|||$x=2,\\ y=1$"
            },
            {
              "text": "$x=-1,\\ y=2$|||$x=-1,\\ y=2$"
            },
            {
              "text": "$x=1,\\ y=-2$|||$x=1,\\ y=-2$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">From the second equation $x=y-1$. Substituting: $2(y-1)+3y=8\\Rightarrow 5y=10\\Rightarrow y=2$ and $x=1$. Check: $2(1)+3(2)=8$ and $1-2=-1$.</div><div class=\"ml-vi\">Từ phương trình thứ hai, $x=y-1$. Thế vào: $2(y-1)+3y=8\\Rightarrow 5y=10\\Rightarrow y=2$ và $x=1$. Kiểm tra: $2(1)+3(2)=8$ và $1-2=-1$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A homogeneous system $Ax=0$ has coefficient matrix $A$ of size $3\\times5$ with rank 2. What is the dimension of its solution space?|||Hệ thuần nhất $Ax=0$ có ma trận hệ số $A$ cỡ $3\\times5$ với hạng bằng 2. Số chiều của không gian nghiệm bằng bao nhiêu?",
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
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The number of unknowns is 5 (the number of columns). By the rank-nullity theorem the solution space has dimension $n-\\operatorname{rank}=5-2=3$. The number of rows, 3, plays no role here.</div><div class=\"ml-vi\">Số ẩn bằng 5 (số cột). Theo định lý hạng - số khuyết, không gian nghiệm có số chiều $n-\\operatorname{rank}=5-2=3$. Số hàng (bằng 3) không đóng vai trò gì ở đây.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Let $T:\\mathbb{R}^5\\to\\mathbb{R}^3$ be a linear transformation of rank 3. Find $\\dim(\\ker T)$.|||Cho $T:\\mathbb{R}^5\\to\\mathbb{R}^3$ là ánh xạ tuyến tính có hạng bằng 3. Tính $\\dim(\\ker T)$.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "0|||0"
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
          "explanation": "<div class=\"ml-en\">Rank-nullity: $\\dim(\\ker T)+\\operatorname{rank}(T)=\\dim(\\mathbb{R}^5)=5$, so $\\dim(\\ker T)=5-3=2$. Note the dimension of the domain is used, not that of the codomain.</div><div class=\"ml-vi\">Định lý hạng - số khuyết: $\\dim(\\ker T)+\\operatorname{rank}(T)=\\dim(\\mathbb{R}^5)=5$, nên $\\dim(\\ker T)=5-3=2$. Chú ý phải dùng số chiều của không gian nguồn, không phải không gian đích.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For which value of $m$ does the system $\\begin{cases}x+2y=3\\\\2x+my=6\\end{cases}$ have infinitely many solutions?|||Với giá trị nào của $m$ thì hệ $\\begin{cases}x+2y=3\\\\2x+my=6\\end{cases}$ có vô số nghiệm?",
          "options": [
            {
              "text": "$m=4$|||$m=4$"
            },
            {
              "text": "$m=2$|||$m=2$"
            },
            {
              "text": "$m=-4$|||$m=-4$"
            },
            {
              "text": "No value of m|||Không có giá trị $m$ nào"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The second equation must be a multiple of the first. Since the constant terms already satisfy $6=2\\cdot3$ and $2=2\\cdot1$, we need $m=2\\cdot2=4$. Then the second row reduces to all zeros: one equation, two unknowns, so infinitely many solutions. For $m\\ne4$ the system has a unique solution.</div><div class=\"ml-vi\">Phương trình thứ hai phải là bội của phương trình thứ nhất. Vì các số hạng tự do đã thoả $6=2\\cdot3$ và hệ số $2=2\\cdot1$, nên cần $m=2\\cdot2=4$. Khi đó hàng thứ hai khử về toàn 0: một phương trình, hai ẩn, do đó vô số nghiệm. Với $m\\ne4$ hệ có nghiệm duy nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Are the vectors $u=(1,2,3)$, $v=(0,1,4)$ and $w=(2,5,10)$ in $\\mathbb{R}^3$ linearly independent?|||Ba vectơ $u=(1,2,3)$, $v=(0,1,4)$, $w=(2,5,10)$ trong $\\mathbb{R}^3$ có độc lập tuyến tính không?",
          "options": [
            {
              "text": "They are linearly dependent, because the determinant of the matrix formed by them is 0|||Chúng phụ thuộc tuyến tính, vì định thức của ma trận tạo bởi chúng bằng 0"
            },
            {
              "text": "They are linearly independent, because that determinant is nonzero|||Chúng độc lập tuyến tính, vì định thức đó khác 0"
            },
            {
              "text": "They are linearly independent, because three vectors in a 3-dimensional space always are|||Chúng độc lập tuyến tính, vì ba vectơ trong không gian 3 chiều thì luôn độc lập"
            },
            {
              "text": "It cannot be decided without solving a system|||Không thể kết luận nếu chưa giải hệ"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Placing the three vectors as rows gives $\\det\\begin{pmatrix}1&2&3\\\\0&1&4\\\\2&5&10\\end{pmatrix}=0$, so they are dependent. Concretely $w=2u+v$. Option C is a common misconception: the count of vectors alone never proves independence.</div><div class=\"ml-vi\">Xếp ba vectơ thành các hàng, ta có $\\det\\begin{pmatrix}1&2&3\\\\0&1&4\\\\2&5&10\\end{pmatrix}=0$ nên chúng phụ thuộc. Cụ thể $w=2u+v$. Phương án C là ngộ nhận thường gặp: chỉ dựa vào số lượng vectơ thì không bao giờ chứng minh được tính độc lập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the dimension of the subspace of $\\mathbb{R}^3$ spanned by $(1,2,1)$, $(2,4,3)$ and $(3,6,4)$.|||Tìm số chiều của không gian con của $\\mathbb{R}^3$ sinh bởi $(1,2,1)$, $(2,4,3)$ và $(3,6,4)$.",
          "options": [
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
              "text": "0|||0"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Row reduction shows the rank of the matrix with these rows is 2: the third vector is the sum of the first two, $(3,6,4)=(1,2,1)+(2,4,3)$. The dimension of a span equals the rank, so it is 2 — a plane through the origin.</div><div class=\"ml-vi\">Khử hàng cho thấy hạng của ma trận gồm các vectơ này bằng 2: vectơ thứ ba là tổng của hai vectơ đầu, $(3,6,4)=(1,2,1)+(2,4,3)$. Số chiều của không gian sinh bằng hạng, nên bằng 2 — một mặt phẳng qua gốc toạ độ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the reduced row echelon form of $\\begin{pmatrix}1&2&-1&3\\\\2&4&1&9\\end{pmatrix}$.|||Tìm dạng bậc thang rút gọn theo hàng của $\\begin{pmatrix}1&2&-1&3\\\\2&4&1&9\\end{pmatrix}$.",
          "options": [
            {
              "text": "$\\begin{pmatrix}1&2&0&4\\\\0&0&1&1\\end{pmatrix}$|||$\\begin{pmatrix}1&2&0&4\\\\0&0&1&1\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}1&2&-1&3\\\\0&0&3&3\\end{pmatrix}$|||$\\begin{pmatrix}1&2&-1&3\\\\0&0&3&3\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}1&0&0&4\\\\0&1&1&1\\end{pmatrix}$|||$\\begin{pmatrix}1&0&0&4\\\\0&1&1&1\\end{pmatrix}$"
            },
            {
              "text": "$\\begin{pmatrix}1&2&0&3\\\\0&0&1&1\\end{pmatrix}$|||$\\begin{pmatrix}1&2&0&3\\\\0&0&1&1\\end{pmatrix}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$R_2\\to R_2-2R_1$ gives $(0,0,3,3)$, then dividing by 3 gives $(0,0,1,1)$ — this is only row echelon form (option B is that intermediate step). For the REDUCED form we must also clear above the leading 1: $R_1\\to R_1+R_2$ turns $(1,2,-1,3)$ into $(1,2,0,4)$.</div><div class=\"ml-vi\">$R_2\\to R_2-2R_1$ cho $(0,0,3,3)$, chia cho 3 được $(0,0,1,1)$ — đây mới là dạng bậc thang (phương án B chính là bước trung gian này). Muốn dạng RÚT GỌN thì còn phải khử phía trên số 1 dẫn đầu: $R_1\\to R_1+R_2$ biến $(1,2,-1,3)$ thành $(1,2,0,4)$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the dimension of the column space of $A=\\begin{pmatrix}1&0&2\\\\0&1&3\\\\1&1&5\\end{pmatrix}$.|||Tìm số chiều của không gian cột của $A=\\begin{pmatrix}1&0&2\\\\0&1&3\\\\1&1&5\\end{pmatrix}$.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
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
          "explanation": "<div class=\"ml-en\">The third column is $2\\times$(first) $+\\ 3\\times$(second), and the third row is the sum of the first two, so the rank is 2. The dimension of the column space equals the rank, so it is 2.</div><div class=\"ml-vi\">Cột thứ ba bằng $2\\times$(cột 1) $+\\ 3\\times$(cột 2), và hàng thứ ba bằng tổng hai hàng đầu, nên hạng bằng 2. Số chiều của không gian cột bằng hạng, do đó bằng 2.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the eigenvalues of $A=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$.|||Tìm các giá trị riêng của $A=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$.",
          "options": [
            {
              "text": "$\\lambda=3$ and $\\lambda=2$|||$\\lambda=3$ và $\\lambda=2$"
            },
            {
              "text": "$\\lambda=3$ and $\\lambda=1$|||$\\lambda=3$ và $\\lambda=1$"
            },
            {
              "text": "$\\lambda=1$ and $\\lambda=2$|||$\\lambda=1$ và $\\lambda=2$"
            },
            {
              "text": "$\\lambda=5$ and $\\lambda=6$|||$\\lambda=5$ và $\\lambda=6$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$\\det(A-\\lambda I)=(3-\\lambda)(2-\\lambda)-1\\cdot0=(3-\\lambda)(2-\\lambda)$, so $\\lambda=3$ and $\\lambda=2$. For any triangular matrix the eigenvalues are simply the diagonal entries.</div><div class=\"ml-vi\">$\\det(A-\\lambda I)=(3-\\lambda)(2-\\lambda)-1\\cdot0=(3-\\lambda)(2-\\lambda)$, nên $\\lambda=3$ và $\\lambda=2$. Với mọi ma trận tam giác, các giá trị riêng chính là các phần tử trên đường chéo.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One eigenvalue of $A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ is $\\lambda=3$. Which vector is a corresponding eigenvector?|||Một giá trị riêng của $A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ là $\\lambda=3$. Vectơ nào là vectơ riêng tương ứng?",
          "options": [
            {
              "text": "$(1,1)$|||$(1,1)$"
            },
            {
              "text": "$(1,-1)$|||$(1,-1)$"
            },
            {
              "text": "$(2,1)$|||$(2,1)$"
            },
            {
              "text": "$(0,1)$|||$(0,1)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$A(1,1)^T=(2+1,\\ 1+2)^T=(3,3)^T=3(1,1)^T$, so $(1,1)$ works. The vector $(1,-1)$ is an eigenvector too, but for the other eigenvalue $\\lambda=1$, since $A(1,-1)^T=(1,-1)^T$.</div><div class=\"ml-vi\">$A(1,1)^T=(2+1,\\ 1+2)^T=(3,3)^T=3(1,1)^T$ nên $(1,1)$ thoả mãn. Vectơ $(1,-1)$ cũng là vectơ riêng nhưng ứng với giá trị riêng còn lại $\\lambda=1$, vì $A(1,-1)^T=(1,-1)^T$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the characteristic polynomial of $A=\\begin{pmatrix}4&1\\\\2&3\\end{pmatrix}$.|||Tìm đa thức đặc trưng của $A=\\begin{pmatrix}4&1\\\\2&3\\end{pmatrix}$.",
          "options": [
            {
              "text": "$\\lambda^2-7\\lambda+10$|||$\\lambda^2-7\\lambda+10$"
            },
            {
              "text": "$\\lambda^2+7\\lambda+10$|||$\\lambda^2+7\\lambda+10$"
            },
            {
              "text": "$\\lambda^2-7\\lambda-10$|||$\\lambda^2-7\\lambda-10$"
            },
            {
              "text": "$\\lambda^2-\\lambda+10$|||$\\lambda^2-\\lambda+10$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For a $2\\times2$ matrix the characteristic polynomial is $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$. Here the trace is $4+3=7$ and the determinant is $12-2=10$, giving $\\lambda^2-7\\lambda+10$, whose roots are $\\lambda=5$ and $\\lambda=2$.</div><div class=\"ml-vi\">Với ma trận $2\\times2$, đa thức đặc trưng là $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$. Ở đây vết bằng $4+3=7$ và định thức bằng $12-2=10$, cho $\\lambda^2-7\\lambda+10$, có nghiệm $\\lambda=5$ và $\\lambda=2$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the cosine of the angle between $u=(1,2,2)$ and $v=(2,0,1)$.|||Tìm côsin của góc giữa $u=(1,2,2)$ và $v=(2,0,1)$.",
          "options": [
            {
              "text": "$\\dfrac{4}{3\\sqrt5}$|||$\\dfrac{4}{3\\sqrt5}$"
            },
            {
              "text": "$\\dfrac{4}{5}$|||$\\dfrac{4}{5}$"
            },
            {
              "text": "$\\dfrac{2}{3\\sqrt5}$|||$\\dfrac{2}{3\\sqrt5}$"
            },
            {
              "text": "$\\dfrac{4}{15}$|||$\\dfrac{4}{15}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$u\\cdot v=2+0+2=4$, $|u|=\\sqrt{1+4+4}=3$ and $|v|=\\sqrt{4+0+1}=\\sqrt5$. Hence $\\cos\\theta=\\dfrac{4}{3\\sqrt5}=\\dfrac{4\\sqrt5}{15}\\approx0.596$.</div><div class=\"ml-vi\">$u\\cdot v=2+0+2=4$, $|u|=\\sqrt{1+4+4}=3$ và $|v|=\\sqrt{4+0+1}=\\sqrt5$. Do đó $\\cos\\theta=\\dfrac{4}{3\\sqrt5}=\\dfrac{4\\sqrt5}{15}\\approx0.596$.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the area of the parallelogram determined by $u=(1,2,0)$ and $v=(0,3,4)$.|||Tính diện tích hình bình hành xác định bởi $u=(1,2,0)$ và $v=(0,3,4)$.",
          "options": [
            {
              "text": "$\\sqrt{89}$|||$\\sqrt{89}$"
            },
            {
              "text": "$\\sqrt{74}$|||$\\sqrt{74}$"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "$\\dfrac{\\sqrt{89}}{2}$|||$\\dfrac{\\sqrt{89}}{2}$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">$u\\times v=(2\\cdot4-0\\cdot3,\\ 0\\cdot0-1\\cdot4,\\ 1\\cdot3-2\\cdot0)=(8,-4,3)$, so the area is $|u\\times v|=\\sqrt{64+16+9}=\\sqrt{89}$. Halving it would give the area of the triangle, not the parallelogram.</div><div class=\"ml-vi\">$u\\times v=(2\\cdot4-0\\cdot3,\\ 0\\cdot0-1\\cdot4,\\ 1\\cdot3-2\\cdot0)=(8,-4,3)$, nên diện tích bằng $|u\\times v|=\\sqrt{64+16+9}=\\sqrt{89}$. Nếu chia đôi thì ra diện tích tam giác chứ không phải hình bình hành.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find an equation of the plane through the point $(1,2,3)$ with normal vector $n=(2,-1,4)$.|||Viết phương trình mặt phẳng đi qua điểm $(1,2,3)$ với vectơ pháp tuyến $n=(2,-1,4)$.",
          "options": [
            {
              "text": "$2x-y+4z=12$|||$2x-y+4z=12$"
            },
            {
              "text": "$2x-y+4z=0$|||$2x-y+4z=0$"
            },
            {
              "text": "$x+2y+3z=12$|||$x+2y+3z=12$"
            },
            {
              "text": "$2x+y+4z=16$|||$2x+y+4z=16$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The plane is $2(x-1)-1(y-2)+4(z-3)=0$, i.e. $2x-y+4z=2-2+12=12$. Option B is the parallel plane through the origin; option C wrongly uses the point as the normal vector.</div><div class=\"ml-vi\">Mặt phẳng là $2(x-1)-1(y-2)+4(z-3)=0$, tức $2x-y+4z=2-2+12=12$. Phương án B là mặt phẳng song song đi qua gốc; phương án C lấy nhầm toạ độ điểm làm vectơ pháp tuyến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Find the distance from the point $(1,1,1)$ to the plane $x+2y+2z=6$.|||Tính khoảng cách từ điểm $(1,1,1)$ tới mặt phẳng $x+2y+2z=6$.",
          "options": [
            {
              "text": "$\\dfrac13$|||$\\dfrac13$"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "$\\dfrac19$|||$\\dfrac19$"
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
          "explanation": "<div class=\"ml-en\">$d=\\dfrac{|ax_0+by_0+cz_0-d_0|}{\\sqrt{a^2+b^2+c^2}}=\\dfrac{|1+2+2-6|}{\\sqrt{1+4+4}}=\\dfrac{1}{3}$. The denominator is the length of the normal vector, so forgetting the square root is the usual mistake.</div><div class=\"ml-vi\">$d=\\dfrac{|ax_0+by_0+cz_0-d_0|}{\\sqrt{a^2+b^2+c^2}}=\\dfrac{|1+2+2-6|}{\\sqrt{1+4+4}}=\\dfrac{1}{3}$. Mẫu số là độ dài vectơ pháp tuyến, nên quên lấy căn là lỗi thường gặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A line passes through the point $(1,0,2)$ with direction vector $(2,1,-1)$. Which of the following points also lies on this line?|||Một đường thẳng đi qua điểm $(1,0,2)$ với vectơ chỉ phương $(2,1,-1)$. Điểm nào sau đây cũng nằm trên đường thẳng đó?",
          "options": [
            {
              "text": "$(3,1,1)$|||$(3,1,1)$"
            },
            {
              "text": "$(2,1,1)$|||$(2,1,1)$"
            },
            {
              "text": "$(3,1,3)$|||$(3,1,3)$"
            },
            {
              "text": "$(0,1,2)$|||$(0,1,2)$"
            },
            {
              "text": "None of the other choices is correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Parametric equations: $(x,y,z)=(1+2t,\\ t,\\ 2-t)$. Taking $t=1$ gives $(3,1,1)$. Checking the others: $(2,1,1)$ would need $t=1$ from $y$ but then $x=3\\ne2$; $(3,1,3)$ fails in $z$; $(0,1,2)$ fails in both $x$ and $z$.</div><div class=\"ml-vi\">Phương trình tham số: $(x,y,z)=(1+2t,\\ t,\\ 2-t)$. Lấy $t=1$ được $(3,1,1)$. Kiểm tra các điểm khác: $(2,1,1)$ thì từ $y$ suy ra $t=1$ nhưng khi đó $x=3\\ne2$; $(3,1,3)$ sai ở $z$; $(0,1,2)$ sai ở cả $x$ và $z$.</div>"
        }
      ]
    }
  ]
};
