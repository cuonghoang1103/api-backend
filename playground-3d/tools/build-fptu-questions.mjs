/**
 * Sinh bộ câu hỏi cho khu Đại học FPT trong sân chơi 3D.
 *
 * Nguồn: `content/exams/*.mjs` của chính kho này — đề THẬT đã nhập và đối
 * chiếu, KHÔNG bịa thêm câu nào. Sân chơi là trang tĩnh (không gọi API) nên
 * phải kết tinh ra JSON đặt trong `static/fptu/`.
 *
 * Ánh xạ môn → kỳ lấy TỪ CHÍNH trang /exam của prod (đọc ngày 31/7/2026), không
 * phỏng đoán:
 *   Kỳ 1: CEA201, CSI104, MAE101, PRF192, SSL101c   (56 đề)
 *   Kỳ 2: MAD101                                     (22 đề)
 *   Kỳ 3: JPD113                                     (35 đề)
 * Node.js (14 đề) là khoá riêng của cuongthai.com, không thuộc kỳ FPTU nào nên
 * BỎ QUA. Kỳ 4–9 hiện chưa có đề — không sinh file, và trong game bảng chọn kỳ
 * phải nói thẳng là chưa có thay vì im lặng đưa câu hỏi môn khác.
 *
 * Chạy: node tools/build-fptu-questions.mjs
 */
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const EXAMS_DIR = resolve(HERE, '../../content/exams')
const OUT_DIR = resolve(HERE, '../static/fptu')

/** Môn nào thuộc kỳ nào. */
const SEMESTERS = {
    1: [ 'CEA201', 'CSI104', 'MAE101', 'PRF192', 'SSL101c' ],
    2: [ 'MAD101' ],
    3: [ 'JPD113' ],
}

/** Mỗi môn lấy nhiều nhất bao nhiêu câu — người chơi chỉ đụng chừng chục khối. */
const MAX_PER_SUBJECT = 60

/** Tách chuỗi song ngữ "English|||Tiếng Việt", ưu tiên tiếng Việt. */
const vi = (text) =>
{
    if(typeof text !== 'string') return ''
    const parts = text.split('|||')
    return (parts[1] ?? parts[0] ?? '').trim()
}

/**
 * Bỏ thẻ HTML còn sót (một số câu có <div>, <code>…) và cặp `$…$` của LaTeX —
 * trong web đề thi có MathJax dựng công thức, còn bảng câu hỏi của game chỉ là
 * chữ thuần nên để nguyên `$` sẽ hiện ra dấu đô la lạc lõng giữa câu.
 */
const clean = (text) => vi(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\$?([^$]*)\$\$?/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

const files = readdirSync(EXAMS_DIR).filter((f) => f.endsWith('.mjs'))
const bySubject = new Map()

for(const file of files)
{
    const module = await import(pathToFileURL(resolve(EXAMS_DIR, file)).href)
    const data = module.default
    const code = data?.course?.courseCode
    if(!code) { console.log(`${file}: không có courseCode — bỏ qua`); continue }

    const list = bySubject.get(code) ?? []

    for(const exam of data.exams ?? [])
    {
        for(const question of exam.questions ?? [])
        {
            // Chỉ nhận câu trắc nghiệm MỘT đáp án: khối "?" trong game chỉ cho
            // bấm một lựa chọn, câu "chọn hai đáp án" sẽ luôn bị chấm sai.
            if(question.kind !== 'MCQ') continue
            if(!Array.isArray(question.correctIndexes) || question.correctIndexes.length !== 1) continue

            const options = (question.options ?? []).map((o) => clean(o.text)).filter(Boolean)
            if(options.length < 2 || options.length > 6) continue

            const prompt = clean(question.prompt)
            if(prompt.length < 8 || prompt.length > 320) continue

            /**
             * Bỏ câu còn lệnh LaTeX. Trang đề thi có MathJax dựng công thức
             * thành ký hiệu toán thật, còn bảng câu hỏi trong game chỉ là chữ
             * thuần — để nguyên thì người chơi nhận được nguyên xi
             * `\begin{cases}x+y-z=3\\...` giữa màn hình, không đọc nổi.
             * Thà ít câu mà câu nào cũng đọc được.
             */
            const raw = [ prompt, ...(question.options ?? []).map((o) => clean(o.text)) ].join(' ')
            if(/\\[a-zA-Z]+|\^\{|_\{|\\\\/.test(raw)) continue

            const correct = question.correctIndexes[0]
            if(correct < 0 || correct >= options.length) continue

            list.push({
                s: code,
                q: prompt,
                o: options,
                c: correct,
                e: clean(question.explanation).slice(0, 260) || undefined
            })
        }
    }

    bySubject.set(code, list)
}

console.log('--- gom được ---')
for(const [ code, list ] of [ ...bySubject.entries() ].sort())
    console.log(`  ${code.padEnd(9)} ${String(list.length).padStart(4)} câu một-đáp-án`)

mkdirSync(OUT_DIR, { recursive: true })

const summary = {}

for(const [ semester, codes ] of Object.entries(SEMESTERS))
{
    const questions = []

    for(const code of codes)
    {
        const list = bySubject.get(code) ?? []
        if(list.length === 0) { console.log(`⚠️  ${code}: KHÔNG có câu nào — kiểm lại`); continue }

        // Rải đều qua cả danh sách thay vì cắt 60 câu đầu, để không dồn hết vào
        // một đề duy nhất. Bước nhảy tất định nên build lặp lại cho kết quả y hệt.
        const step = Math.max(1, Math.floor(list.length / MAX_PER_SUBJECT))
        for(let i = 0; i < list.length && questions.filter((q) => q.s === code).length < MAX_PER_SUBJECT; i += step)
            questions.push(list[i])
    }

    const path = `${OUT_DIR}/questions-ky${semester}.json`
    writeFileSync(path, JSON.stringify({ semester: Number(semester), subjects: codes, questions }))
    summary[`Kỳ ${semester}`] = questions.length
    console.log(`đã ghi ${path} — ${questions.length} câu, ${codes.length} môn`)
}

console.log('--- tổng kết ---')
console.log(JSON.stringify(summary))
