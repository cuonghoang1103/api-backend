/**
 * Câu hỏi từ vựng khi xe tông vỡ tường gạch.
 *
 * Từ vựng lấy từ mục My Language của cuongthai.com, xuất sẵn ra
 * static/vocab/vocab-en.json (1221 từ, 17 chủ đề).
 *
 * NGUYÊN TẮC AN TOÀN — đọc trước khi sửa:
 * Module này TUYỆT ĐỐI không được làm treo hay chặn game. Nếu tệp từ vựng hỏng,
 * thiếu, hay tải chậm thì `ready` vẫn là false và mọi lời gọi `ask()` lặng lẽ
 * không làm gì. Không await ở đường đi chính, không ném lỗi ra ngoài.
 * Lý do: một lần sửa areas.glb đã làm cả thế giới kẹt ở màn hình tải mà không
 * ném lỗi nào — từ đó mọi thứ thêm vào đều phải hỏng-được-mà-không-kéo-ai-theo.
 */
export class VocabQuiz
{
    constructor()
    {
        this.ready = false
        this.words = []
        this.queue = []          // hàng đợi đã xáo, duyệt tuần tự => KHÔNG trùng
        this.queueIndex = 0
        this.asking = false      // mỗi lúc chỉ một câu hỏi
        this.answered = 0
        this.correct = 0

        this.element = document.querySelector('.js-vocab')
        if(!this.element)
            return

        this.wordElement = this.element.querySelector('.js-vocab-word')
        this.topicElement = this.element.querySelector('.js-vocab-topic')
        this.exampleElement = this.element.querySelector('.js-vocab-example')
        this.choicesElement = this.element.querySelector('.js-vocab-choices')
        this.scoreElement = this.element.querySelector('.js-vocab-score')

        this.setKeyboard()
        this.load()
    }

    load()
    {
        // Đường dẫn tương đối, khớp cách các loader khác trong game trỏ tới
        // static/ — nhờ vậy đặt trang ở thư mục con (/playground/) vẫn đúng.
        fetch('vocab/vocab-en.json')
            .then(response => response.ok ? response.json() : null)
            .then(data =>
            {
                if(!Array.isArray(data) || data.length < 8)
                    return

                // Bỏ từ trùng nhau: bản xuất có 65 từ lặp giữa các chủ đề.
                const seen = new Set()
                this.words = data.filter(item =>
                {
                    if(!item || !item.word || !item.meaning)
                        return false
                    const key = item.word.trim().toLowerCase()
                    if(seen.has(key))
                        return false
                    seen.add(key)
                    return true
                })

                if(this.words.length < 8)
                    return

                this.reshuffle()
                this.ready = true
            })
            .catch(() => {})
    }

    reshuffle()
    {
        this.queue = this.words.slice()
        // Xáo Fisher-Yates rồi duyệt tuần tự — cách này bảo đảm đi hết 1221 từ
        // mới lặp lại từ đầu tiên, thay vì bốc ngẫu nhiên và trùng ngay lần hai.
        for(let i = this.queue.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1))
            const tmp = this.queue[i]
            this.queue[i] = this.queue[j]
            this.queue[j] = tmp
        }
        this.queueIndex = 0
    }

    nextWord()
    {
        if(this.queueIndex >= this.queue.length)
            this.reshuffle()

        return this.queue[this.queueIndex++]
    }

    /**
     * Sinh 3 đáp án nhiễu. Ưu tiên lấy từ CÙNG chủ đề để câu hỏi không dễ đoán
     * (nghĩa cùng lĩnh vực thì phải đọc kỹ mới chọn đúng); thiếu thì bù bằng từ
     * bất kỳ.
     */
    buildChoices(target)
    {
        const chosen = [ target.meaning ]
        const sameTopic = this.words.filter(item => item.topic === target.topic && item.meaning !== target.meaning)
        const pools = [ sameTopic, this.words ]

        for(const pool of pools)
        {
            let guard = 0
            while(chosen.length < 4 && pool.length > 0 && guard++ < 60)
            {
                const candidate = pool[Math.floor(Math.random() * pool.length)].meaning
                if(!chosen.includes(candidate))
                    chosen.push(candidate)
            }
        }

        while(chosen.length < 4)
            chosen.push('—')

        for(let i = chosen.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1))
            const tmp = chosen[i]
            chosen[i] = chosen[j]
            chosen[j] = tmp
        }

        return chosen
    }

    ask()
    {
        if(!this.ready || this.asking || !this.element)
            return false

        const entry = this.nextWord()
        if(!entry)
            return false

        this.asking = true
        this.current = entry

        this.wordElement.textContent = entry.word
        this.topicElement.textContent = entry.topic || ''
        this.exampleElement.textContent = entry.example || ''
        this.exampleElement.hidden = !entry.example

        const choices = this.buildChoices(entry)
        this.choicesElement.innerHTML = ''

        choices.forEach((choice, index) =>
        {
            const button = document.createElement('button')
            button.type = 'button'
            button.className = 'vocab-choice'
            button.dataset.index = String(index + 1)
            button.innerHTML = `<span class="vocab-key">${index + 1}</span><span>${this.escape(choice)}</span>`
            button.addEventListener('click', () => this.answer(choice, button))
            this.choicesElement.appendChild(button)
        })

        this.element.classList.add('is-open')
        return true
    }

    answer(choice, button)
    {
        if(!this.asking)
            return

        const isCorrect = choice === this.current.meaning
        this.asking = false
        this.answered++
        if(isCorrect)
            this.correct++

        for(const item of this.choicesElement.children)
        {
            item.disabled = true
            const text = item.textContent.slice(1)
            if(text === this.current.meaning)
                item.classList.add('is-correct')
        }
        if(!isCorrect && button)
            button.classList.add('is-wrong')

        this.scoreElement.textContent = `${this.correct}/${this.answered}`

        // Đóng sau một nhịp để người chơi kịp đọc đáp án đúng.
        clearTimeout(this.closeTimeout)
        this.closeTimeout = setTimeout(() => this.close(), isCorrect ? 1100 : 2200)
    }

    close()
    {
        if(!this.element)
            return
        this.element.classList.remove('is-open')
        this.asking = false
    }

    setKeyboard()
    {
        // Phím 1-4 để trả lời — người chơi đang giữ tay trên bàn phím lái xe,
        // bắt rời tay sang chuột thì phá nhịp chơi.
        window.addEventListener('keydown', (event) =>
        {
            if(!this.asking)
                return

            const index = [ 'Digit1', 'Digit2', 'Digit3', 'Digit4' ].indexOf(event.code)
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
