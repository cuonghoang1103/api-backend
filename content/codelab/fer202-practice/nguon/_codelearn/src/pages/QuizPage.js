//@from F7
// src/pages/QuizPage.js — quiz cuối chương: chọn đáp án, nộp (phải trả lời hết), xem điểm + xem lại từng câu
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import { fetchMyEnrollments } from '../features/enrollments/enrollmentsSlice';
import { answerSelected, fetchQuiz, retakeQuiz, submitQuiz } from '../features/quiz/quizSlice';
import { PASS_PERCENT } from '../utils/learning';

export default function QuizPage() {
  const { chapterId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { chapter, questions, answers, result, status, error, submitStatus } = useSelector((state) => state.quiz);
  const enrollments = useSelector((state) => state.enrollments);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchQuiz(chapterId));
  }, [chapterId, dispatch]);
  useEffect(() => {
    dispatch(fetchMyEnrollments(user.id));
  }, [user.id, dispatch]);

  if (status === 'failed') {
    return <Alert variant="danger" id="quiz-not-found">{error === 'notFound' ? 'Chapter not found.' : `Could not load the quiz (${error}).`}</Alert>;
  }
  if (status !== 'succeeded' || enrollments.status !== 'succeeded') {
    return <div id="quiz-loading" className="text-center py-5"><Spinner animation="border" /></div>;
  }
  // chỉ học viên đã đăng ký khoá chứa chương này mới được làm (mở thẳng URL cũng bị chặn)
  if (!enrollments.items.some((e) => e.courseId === chapter.courseId)) {
    return (
      <Alert variant="warning" id="not-enrolled">
        You are not enrolled in this course. <Link to={`/courses/${chapter.courseId}`}>View the course</Link>
      </Alert>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = questions.filter((q) => answers[q.id] === undefined).length;
    if (missing > 0) {
      setFormError(`Please answer all questions (${missing} unanswered).`);
      return;
    }
    setFormError('');
    dispatch(submitQuiz({ userId: user.id }));
  };

  const handleRetake = () => {
    setFormError('');
    dispatch(retakeQuiz());
  };

  return (
    <>
      <Link to={`/learn/${chapter.courseId}`} id="back-to-learn" className="small">← Back to lessons</Link>
      <h2 id="quiz-title" className="mt-2">Quiz: {chapter.title}</h2>
      <p className="text-muted">{questions.length} questions · pass mark {PASS_PERCENT}%</p>

      {questions.length === 0 ? (
        <Alert variant="secondary" id="no-questions">This chapter has no quiz questions yet.</Alert>
      ) : (
        <Form id="quiz-form" noValidate onSubmit={handleSubmit}>
          {result && (
            <Alert variant={result.passed ? 'success' : 'warning'} id="quiz-result">
              You scored {result.score}/{result.total} ({result.percent}%) — {result.passed ? 'Passed 🎉' : 'Not passed'}
            </Alert>
          )}
          {questions.map((q, i) => {
            const chosen = answers[q.id];
            const verdict = result ? (chosen === q.answerIndex ? ' correct' : ' incorrect') : '';
            return (
              <Card key={q.id} className={`question mb-3${verdict}`} id={`q-${q.id}`}>
                <Card.Body>
                  <Card.Title className="question-text fs-6">{i + 1}. {q.content}</Card.Title>
                  {q.options.map((option, oi) => {
                    // sau khi nộp: tô xanh đáp án đúng, gạch đỏ đáp án sai đã chọn
                    let cls = 'option';
                    if (result && oi === q.answerIndex) cls += ' option-correct';
                    else if (result && oi === chosen) cls += ' option-wrong';
                    return (
                      <Form.Check
                        key={oi}
                        type="radio"
                        id={`q${q.id}-o${oi}`}
                        name={`q-${q.id}`}
                        label={option}
                        className={cls}
                        checked={chosen === oi}
                        disabled={!!result}
                        onChange={() => dispatch(answerSelected({ questionId: q.id, optionIndex: oi }))}
                      />
                    );
                  })}
                  {result && q.explanation && <div className="explanation small text-muted mt-2">💡 {q.explanation}</div>}
                </Card.Body>
              </Card>
            );
          })}
          {formError && <Alert variant="danger" id="quiz-error">{formError}</Alert>}
          {submitStatus === 'failed' && <Alert variant="danger" id="quiz-save-error">Your answers could not be saved. Please try again.</Alert>}
          {result ? (
            <Button id="retake-quiz" variant="outline-primary" onClick={handleRetake}>Retake quiz</Button>
          ) : (
            <Button id="submit-quiz" type="submit" disabled={submitStatus === 'loading'}>Submit answers</Button>
          )}
        </Form>
      )}
    </>
  );
}
