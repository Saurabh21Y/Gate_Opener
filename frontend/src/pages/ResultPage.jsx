import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import { ScoreCard, QuestionCard } from '../components/index';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const StatusBadge = ({ status }) => {
  const map = {
    correct:     { label: '✓ Correct',     cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    wrong:       { label: '✗ Wrong',        cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30'         },
    unattempted: { label: '— Skipped',      cls: 'bg-slate-500/20 text-slate-400 border-slate-500/30'      },
  };
  const { label, cls } = map[status] || map.unattempted;
  return <span className={`badge border ${cls}`}>{label}</span>;
};

export default function ResultPage() {
  const navigate = useNavigate();
  const { result, resetExam, questions } = useExam();
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');

  if (!result) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-slate-400">No result found.</p>
      </div>
    );
  }

  const { summary, questionResults } = result;

  const filteredResults = questionResults.filter((qr) => {
    if (reviewFilter === 'all')         return true;
    if (reviewFilter === 'correct')     return qr.status === 'correct';
    if (reviewFilter === 'wrong')       return qr.status === 'wrong';
    if (reviewFilter === 'unattempted') return qr.status === 'unattempted';
    return true;
  });

  const handleRetry = () => {
    resetExam();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-brand-700/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-surface-border bg-surface-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-brand">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Exam Results</h1>
              <p className="text-xs text-slate-500 -mt-0.5">GatePrep</p>
            </div>
          </div>
          <button
            id="retry-btn"
            onClick={handleRetry}
            className="btn-primary text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Practice Again
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Score Card */}
        <ScoreCard summary={summary} />

        {/* Review Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            id="toggle-review-btn"
            onClick={() => setShowReview((v) => !v)}
            className={showReview ? 'btn-primary' : 'btn-secondary'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {showReview ? 'Hide Review' : 'Review All Questions'}
          </button>

          {showReview && (
            <div className="flex gap-2 flex-wrap">
              {['all', 'correct', 'wrong', 'unattempted'].map((f) => (
                <button
                  key={f}
                  id={`filter-${f}`}
                  onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    reviewFilter === f
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : 'bg-surface border-surface-border text-slate-400 hover:border-brand-400'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== 'all' && (
                    <span className="ml-1 opacity-70">
                      ({
                        f === 'correct' ? summary.correct :
                        f === 'wrong' ? summary.wrong : summary.unattempted
                      })
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Question Review */}
        {showReview && (
          <div className="space-y-4 animate-fade-in">
            {filteredResults.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-500">
                No questions in this category.
              </div>
            ) : (
              filteredResults.map((qr, idx) => (
                <div
                  key={qr.questionId}
                  id={`review-q-${idx}`}
                  className={`glass-card p-6 space-y-5 border-l-4 ${
                    qr.status === 'correct'     ? 'border-l-emerald-500' :
                    qr.status === 'wrong'       ? 'border-l-rose-500'    :
                                                  'border-l-slate-600'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <StatusBadge status={qr.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>+{qr.marks}m</span>
                      {qr.negativeMarks > 0 && <span className="text-rose-400">-{qr.negativeMarks}m</span>}
                    </div>
                  </div>

                  {/* Options in review mode */}
                  <QuestionCard
                    question={qr}
                    selectedOption={qr.selectedOption}
                    correctAnswer={qr.correctAnswer}
                    reviewMode
                  />

                  {/* Explanation */}
                  {qr.explanation && (
                    <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-4">
                      <p className="text-xs font-semibold text-brand-400 mb-1">💡 Explanation</p>
                      <p className="text-sm text-slate-300">{qr.explanation}</p>
                    </div>
                  )}

                  {/* Answer Summary */}
                  {qr.status !== 'unattempted' && (
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>
                        Your answer:{' '}
                        <strong className={qr.status === 'correct' ? 'text-emerald-400' : 'text-rose-400'}>
                          {qr.selectedOption !== null ? OPTION_LABELS[qr.selectedOption] : '—'}
                        </strong>
                      </span>
                      <span>
                        Correct answer:{' '}
                        <strong className="text-emerald-400">{OPTION_LABELS[qr.correctAnswer]}</strong>
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
