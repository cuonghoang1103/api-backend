/**
 * KHU ĐẠI HỌC FPT — hộp thoại ở cổng + bộ câu hỏi theo kỳ.
 *
 * Luồng đúng như người dùng mô tả:
 *   Lái vào cổng  →  "Bạn là sinh viên FPT đúng không?"
 *     • Đúng   →  "Bạn đang học kỳ mấy?"  →  chọn kỳ  →  dọc đường mọc lên các
 *                 khối "?" , đâm vào thì hiện câu hỏi CỦA ĐÚNG CÁC MÔN kỳ đó
 *     • Không  →  không có khối "?" nào, đi dạo và đụng phá thoải mái
 *
 * ─── VÌ SAO KỲ 4–9 KHÔNG CÓ CÂU HỎI ───
 * Câu hỏi lấy từ `content/exams/*.mjs` — đề THẬT đã nhập và đối chiếu. Kho đó
 * hiện chỉ phủ Kỳ 1 (CEA201, CSI104, MAE101, PRF192, SSL101c), Kỳ 2 (MAD101) và
 * Kỳ 3 (JPD113). Các kỳ còn lại CHƯA có đề, nên bảng chọn nói thẳng "chưa có đề"
 * thay vì lặng lẽ đưa câu hỏi môn khác. Thêm đề mới thì chỉ cần chạy lại
 * `tools/build-fptu-questions.mjs`, không phải sửa file này.
 *
 * Lựa chọn nhớ qua `localStorage`; muốn đổi thì lái qua cổng lần nữa.
 */

const STORAGE_KEY = 'fptuProfile'

/** Kỳ nào đã có bộ câu hỏi — phải khớp file `static/fptu/questions-ky*.json`. */
const SEMESTERS_WITH_QUESTIONS = [ 1, 2, 3 ]

const SEMESTER_SUBJECTS = {
    1: 'CEA201 · CSI104 · MAE101 · PRF192 · SSL101c',
    2: 'MAD101',
    3: 'JPD113',
}

const TOTAL_SEMESTERS = 9

export class FptuQuiz
{
    constructor()
    {
        this.profile = this.readProfile()
        this.questions = []
        this.pool = []
        this.asking = false
        this.answered = 0
        this.correct = 0
        this.loadedSemester = null

        this.gate = document.querySelector('.js-fptu-gate')
        this.gateTitle = document.querySelector('.js-fptu-gate-title')
        this.gateSub = document.querySelector('.js-fptu-gate-sub')
        this.gateStep1 = document.querySelector('.js-fptu-gate-step1')
        this.gateStep2 = document.querySelector('.js-fptu-gate-step2')
        this.gateNote = document.querySelector('.js-fptu-gate-note')

        this.panel = document.querySelector('.js-fptu-quiz')
        this.topicElement = document.querySelector('.js-fptu-quiz-topic')
        this.scoreElement = document.querySelector('.js-fptu-quiz-score')
        this.questionElement = document.querySelector('.js-fptu-quiz-question')
        this.explainElement = document.querySelector('.js-fptu-quiz-explain')
        this.choicesElement = document.querySelector('.js-fptu-quiz-choices')

        this.setGate()
        this.setKeyboard()

        // Đã chọn từ lần chơi trước thì nạp sẵn, khỏi bắt chọn lại
        if(this.profile.isStudent && this.profile.semester)
            this.loadQuestions(this.profile.semester)
    }

    readProfile()
    {
        try
        {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            const parsed = raw ? JSON.parse(raw) : null
            if(parsed && typeof parsed === 'object')
                return { isStudent: !!parsed.isStudent, semester: Number(parsed.semester) || null }
        }
        catch(error) { /* localStorage bị chặn thì coi như chưa chọn gì */ }

        return { isStudent: null, semester: null }
    }

    saveProfile()
    {
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile)) }
        catch(error) { /* không lưu được cũng không sao, chỉ mất trí nhớ giữa các phiên */ }
    }

    /** Có mọc khối "?" trên đường không. */
    get active()
    {
        return !!(this.profile.isStudent && this.profile.semester && this.questions.length > 0)
    }

    /** Đã từng trả lời câu hỏi ở cổng chưa (để không hỏi lại mỗi lần chạy ngang). */
    get answeredGate()
    {
        return this.profile.isStudent !== null
    }

    setGate()
    {
        if(!this.gate) return

        this.gate.querySelector('.js-fptu-yes')?.addEventListener('click', () => this.showSemesters())
        this.gate.querySelector('.js-fptu-no')?.addEventListener('click', () =>
        {
            this.profile = { isStudent: false, semester: null }
            this.saveProfile()
            this.questions = []
            this.pool = []
            this.closeGate()
        })

        // Bấm ra nền tối = đóng, coi như chưa quyết định gì
        this.gate.addEventListener('click', (event) =>
        {
            if(event.target === this.gate) this.closeGate()
        })
    }

    openGate()
    {
        if(!this.gate) return

        this.gateTitle.textContent = 'Bạn là sinh viên FPT đúng không?'
        this.gateSub.textContent = 'Nhận là sinh viên thì dọc đường vào trường sẽ có các khối “?” chứa câu hỏi đúng môn kỳ bạn đang học.'
        this.gateStep1.hidden = false
        this.gateStep2.hidden = true
        this.gateNote.textContent = 'Đổi lại lúc nào cũng được: lái qua cổng trường lần nữa.'

        this.gate.classList.add('is-open')
    }

    closeGate()
    {
        this.gate?.classList.remove('is-open')
    }

    showSemesters()
    {
        this.gateTitle.textContent = 'Bạn đang học kỳ mấy?'
        this.gateSub.textContent = 'Chọn kỳ để lấy đúng bộ câu hỏi các môn của kỳ đó.'
        this.gateStep1.hidden = true
        this.gateStep2.hidden = false
        this.gateStep2.innerHTML = ''

        for(let semester = 1; semester <= TOTAL_SEMESTERS; semester++)
        {
            const has = SEMESTERS_WITH_QUESTIONS.includes(semester)

            const button = document.createElement('button')
            button.type = 'button'
            button.className = `fptu-btn${has ? '' : ' is-empty'}`
            button.innerHTML = `Kỳ ${semester}<small>${has ? SEMESTER_SUBJECTS[semester] : 'chưa có đề'}</small>`
            button.addEventListener('click', () => this.chooseSemester(semester))

            this.gateStep2.appendChild(button)
        }

        this.gateNote.textContent = 'Kỳ chưa có đề vẫn vào trường chơi bình thường, chỉ là không có khối “?”.'
    }

    chooseSemester(semester)
    {
        this.profile = { isStudent: true, semester }
        this.saveProfile()

        if(!SEMESTERS_WITH_QUESTIONS.includes(semester))
        {
            this.questions = []
            this.pool = []
            this.gateTitle.textContent = `Kỳ ${semester} chưa có đề`
            this.gateSub.textContent = 'Kho đề của trang mới có Kỳ 1, 2 và 3. Bạn cứ vào dạo và đụng phá thoải mái — khi nào có đề kỳ này thì các khối “?” sẽ tự xuất hiện.'
            this.gateStep2.hidden = true
            this.gateStep1.hidden = false
            return
        }

        this.loadQuestions(semester)
        this.closeGate()
    }

    /** Nạp lười bộ câu hỏi của kỳ — file tĩnh, không gọi API. */
    loadQuestions(semester)
    {
        if(this.loadedSemester === semester && this.questions.length > 0)
            return

        fetch(`fptu/questions-ky${semester}.json`)
            .then((response) => response.ok ? response.json() : Promise.reject(new Error(String(response.status))))
            .then((data) =>
            {
                this.questions = Array.isArray(data.questions) ? data.questions : []
                this.loadedSemester = semester
                this.refillPool()
            })
            .catch(() =>
            {
                console.warn(`[FPTU] không nạp được bộ câu hỏi Kỳ ${semester} — khu trường vẫn đi lại bình thường`)
                this.questions = []
                this.pool = []
            })
    }

    /**
     * Xáo lại toàn bộ câu hỏi vào một "túi". Rút cạn túi rồi mới xáo lại, để
     * không gặp lại cùng một câu hai lần liên tiếp — chơi kiểu rút ngẫu nhiên
     * thuần thì đụng ba khối liền có thể trúng đúng một câu.
     */
    refillPool()
    {
        this.pool = [ ...this.questions ]

        for(let i = this.pool.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1))
            const tmp = this.pool[i]
            this.pool[i] = this.pool[j]
            this.pool[j] = tmp
        }
    }

    ask()
    {
        if(!this.active || this.asking || !this.panel)
            return false

        if(this.pool.length === 0)
            this.refillPool()

        const entry = this.pool.pop()
        if(!entry)
            return false

        this.asking = true
        this.current = entry

        this.topicElement.textContent = `${entry.s} · Kỳ ${this.profile.semester}`
        this.questionElement.textContent = entry.q
        this.explainElement.textContent = ''
        this.explainElement.hidden = true

        this.choicesElement.innerHTML = ''

        entry.o.forEach((choice, index) =>
        {
            const button = document.createElement('button')
            button.type = 'button'
            button.className = 'vocab-choice'
            button.innerHTML = `<span class="vocab-key">${index + 1}</span><span>${this.escape(choice)}</span>`
            button.addEventListener('click', () => this.answer(index, button))
            this.choicesElement.appendChild(button)
        })

        this.panel.classList.add('is-open')
        return true
    }

    answer(index, button)
    {
        if(!this.asking)
            return

        const isCorrect = index === this.current.c
        this.asking = false
        this.answered++
        if(isCorrect)
            this.correct++

        const children = [ ...this.choicesElement.children ]
        children.forEach((item, i) =>
        {
            item.disabled = true
            if(i === this.current.c)
                item.classList.add('is-correct')
        })

        if(!isCorrect && button)
            button.classList.add('is-wrong')

        this.scoreElement.textContent = `${this.correct}/${this.answered}`

        // Sai thì cho xem lời giải — đây là chỗ học được nhiều nhất
        if(!isCorrect && this.current.e)
        {
            this.explainElement.textContent = this.current.e
            this.explainElement.hidden = false
        }

        clearTimeout(this.closeTimeout)
        this.closeTimeout = setTimeout(() => this.close(), isCorrect ? 1300 : 4200)
    }

    close()
    {
        this.panel?.classList.remove('is-open')
        this.asking = false
    }

    setKeyboard()
    {
        window.addEventListener('keydown', (event) =>
        {
            if(!this.asking)
                return

            const index = [ 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6' ].indexOf(event.code)
            if(index === -1)
                return

            const button = this.choicesElement.children[index]
            if(button)
            {
                event.preventDefault()
                button.click()
            }
        })
    }

    escape(value)
    {
        return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
}
