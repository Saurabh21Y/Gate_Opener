import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import { submitExam as submitExamAPI } from '../services/api';
import { Timer, QuestionCard, QuestionNav } from '../components/index';

// Duration per question (2 min each, max 3 hours)
const SECONDS_PER_QUESTION = 120;

export default function ExamPage() {
  const navigate = useNavigate();
  const {
    questions, currentIndex, answers, markedForReview,
    setAnswer, toggleMark, setIndex, nextQuestion, prevQuestion,
    submitExamResult, examStatus, config,
  } = useExam();

  // Use preset time from GATE mode config (in minutes), or fall back to 2 min per question
  const totalDuration = config.time
    ? config.time * 60
    : Math.min(questions.length * SECONDS_PER_QUESTION, 3 * 3600);
  const timeLeftRef = useRef(totalDuration);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = questions[currentIndex];

  const handleSubmit = useCallback(async (forced = false) => {
    setSubmitting(true);
    setShowSubmitModal(false);
    setError('');

    const timeTaken = totalDuration - timeLeftRef.current;
    const userAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] ?? null,
    }));

    try {
      const res = await submitExamAPI({ answers: userAnswers, timeTaken });
      submitExamResult(res.data.data, timeTaken);
      navigate('/result');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }, [questions, answers, totalDuration, submitExamResult, navigate]);

  const handleTimerExpire = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  const handleTimerTick = useCallback((t) => {
    timeLeftRef.current = t;
  }, []);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-slate-400">No questions loaded.</p>
      </div>
    );
  }

  const attempted = questions.filter(q => answers[q._id] !== undefined && answers[q._id] !== null).length;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ─── Top Bar ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Logo + Subject */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-glow-brand">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0..." />
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-500">Subject</p>
              <p className="text-sm font-bold text-white truncate max-w-xs">
                {config.subject || 'All Subjects'}
              </p>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{attempted} / {questions.length} attempted</span>
              <span>{Math.round((attempted / questions.length) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(attempted / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Right: Timer + Submit */}
          <div className="flex items-center gap-3">
            <Timer
              durationSeconds={totalDuration}
              onExpire={handleTimerExpire}
              onTick={handleTimerTick}
            />
            <button
              id="submit-exam-btn"
              onClick={() => setShowSubmitModal(true)}
              disabled={submitting}
              className="btn-danger text-sm px-4 py-2 hidden sm:flex"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Submit Exam'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Layout ────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">

        {/* Left: Question Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Question Header */}
          <div className="glass-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Question
              </span>
              <span className="text-lg font-black text-white">
                {currentIndex + 1}
                <span className="text-slate-500 font-normal text-sm"> / {questions.length}</span>
              </span>
              {currentQuestion.concept && (
                <span className="badge bg-brand-600/20 text-brand-300 border-brand-500/30 hidden sm:inline-flex">
                  {currentQuestion.concept}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentQuestion.difficulty && (
                <span className={`badge badge-${currentQuestion.difficulty.toLowerCase()}`}>
                  {currentQuestion.difficulty}
                </span>
              )}
              <span className="text-xs text-slate-500">
                {currentQuestion.marks || 1} mark{(currentQuestion.marks || 1) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-6 flex-1">
            <QuestionCard
              question={currentQuestion}
              selectedOption={answers[currentQuestion._id] ?? null}
              onSelect={(opt) => setAnswer(currentQuestion._id, opt)}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              id="prev-btn"
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              id="mark-review-btn"
              onClick={() => toggleMark(currentQuestion._id)}
              className={markedForReview.has(currentQuestion._id) ? 'btn-amber' : 'btn-secondary'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {markedForReview.has(currentQuestion._id) ? 'Marked' : 'Mark for Review'}
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                id="submit-final-btn"
                onClick={() => setShowSubmitModal(true)}
                className="btn-danger"
              >
                Submit Exam
              </button>
            ) : (
              <button
                id="next-btn"
                onClick={nextQuestion}
                className="btn-primary"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Submit */}
          <button
            id="submit-mobile-btn"
            onClick={() => setShowSubmitModal(true)}
            className="btn-danger sm:hidden w-full"
          >
            Submit Exam
          </button>

          {error && (
            <p className="text-rose-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Right: Question Navigator */}
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <QuestionNav
              questions={questions}
              answers={answers}
              markedForReview={markedForReview}
              currentIndex={currentIndex}
              onSelect={setIndex}
            />
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn-danger w-full"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      {/* ─── Submit Confirmation Modal ──────────────────────────────────── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 max-w-md w-full mx-4 space-y-5 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white">Submit Exam?</h3>
              <p className="text-slate-400 text-sm">This action cannot be undone.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-surface rounded-xl p-3">
                <div className="text-brand-400 font-black text-xl">{attempted}</div>
                <div className="text-slate-500 text-xs">Attempted</div>
              </div>
              <div className="bg-surface rounded-xl p-3">
                <div className="text-rose-400 font-black text-xl">{questions.length - attempted}</div>
                <div className="text-slate-500 text-xs">Unattempted</div>
              </div>
              <div className="bg-surface rounded-xl p-3">
                <div className="text-amber-400 font-black text-xl">{markedForReview.size}</div>
                <div className="text-slate-500 text-xs">Marked</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                id="cancel-submit-btn"
                onClick={() => setShowSubmitModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                id="confirm-submit-btn"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="btn-danger flex-1"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
