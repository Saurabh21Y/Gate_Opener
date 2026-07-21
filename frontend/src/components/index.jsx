import { useEffect } from 'react';
import useTimer from '../hooks/useTimer';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/**
 * Timer component — displays countdown with color urgency.
 */
export const Timer = ({ durationSeconds, onExpire, onTick }) => {
  const { formatted, start, timeLeft } = useTimer(durationSeconds, onExpire);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    onTick?.(timeLeft);
  }, [timeLeft, onTick]);

  return (
    <div
      className={`flex items-center gap-2 font-mono font-bold text-lg px-4 py-2 rounded-xl border transition-all duration-300 ${
        formatted.isCritical
          ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse-slow'
          : formatted.isLow
          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
          : 'bg-surface-card border-surface-border text-slate-100'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{formatted.display}</span>
    </div>
  );
};

/**
 * QuestionCard – renders a single question with radio options.
 */
export const QuestionCard = ({ question, selectedOption, onSelect, reviewMode, correctAnswer }) => {
  const getOptionClass = (index) => {
    if (reviewMode) {
      if (index === correctAnswer) return 'option-btn correct';
      if (index === selectedOption && index !== correctAnswer) return 'option-btn wrong';
      return 'option-btn';
    }
    return selectedOption === index ? 'option-btn selected' : 'option-btn';
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Question Text */}
      <p className="text-slate-100 text-base md:text-lg leading-relaxed font-medium">
        {question.question}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            id={`option-${question._id}-${i}`}
            className={getOptionClass(i)}
            onClick={() => !reviewMode && onSelect(i)}
            disabled={reviewMode}
          >
            {/* Label Circle */}
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                reviewMode && i === correctAnswer
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : reviewMode && i === selectedOption && i !== correctAnswer
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : selectedOption === i
                  ? 'border-brand-400 bg-brand-600 text-white'
                  : 'border-slate-600 text-slate-400'
              }`}
            >
              {OPTION_LABELS[i]}
            </span>
            <span className="flex-1 text-sm md:text-base">{opt}</span>

            {/* Review Icons */}
            {reviewMode && i === correctAnswer && (
              <span className="ml-auto text-emerald-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
            {reviewMode && i === selectedOption && i !== correctAnswer && (
              <span className="ml-auto text-rose-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * QuestionNav – question number grid with status colors.
 */
export const QuestionNav = ({ questions, answers, markedForReview, currentIndex, onSelect }) => {
  const getStatus = (qId, idx) => {
    const isMarked = markedForReview.has(qId);
    const isAnswered = answers[qId] !== undefined && answers[qId] !== null;
    const isCurrent = idx === currentIndex;
    if (isMarked) return 'marked';
    if (isAnswered) return 'attempted';
    return 'unattempted';
  };

  const attempted = questions.filter(q => answers[q._id] !== undefined && answers[q._id] !== null).length;

  return (
    <div className="glass-card p-4 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-surface rounded-lg p-2">
          <div className="text-brand-400 font-bold text-base">{attempted}</div>
          <div className="text-slate-500">Attempted</div>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <div className="text-rose-400 font-bold text-base">{questions.length - attempted}</div>
          <div className="text-slate-500">Remaining</div>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <div className="text-amber-400 font-bold text-base">{markedForReview.size}</div>
          <div className="text-slate-500">Marked</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-brand-600 inline-block"></span> Attempted
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-surface border border-slate-600 inline-block"></span> Pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-600 inline-block"></span> Marked
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, idx) => {
          const status = getStatus(q._id, idx);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q._id}
              id={`q-nav-${idx}`}
              onClick={() => onSelect(idx)}
              className={`q-num-btn ${status} ${isCurrent ? 'current' : ''}`}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * ScoreCard – summary card for results page.
 */
export const ScoreCard = ({ summary }) => {
  const { totalQuestions, correct, wrong, unattempted, score, totalMarks, accuracy, timeTaken } = summary;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const scorePercent = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  const stats = [
    { label: 'Total Questions', value: totalQuestions, color: 'text-slate-300' },
    { label: 'Correct',         value: correct,        color: 'text-emerald-400' },
    { label: 'Wrong',           value: wrong,           color: 'text-rose-400'    },
    { label: 'Unattempted',     value: unattempted,    color: 'text-amber-400'   },
    { label: 'Score',           value: `${score} / ${totalMarks}`, color: 'text-brand-400' },
    { label: 'Accuracy',        value: `${accuracy}%`, color: 'text-purple-400'  },
    { label: 'Time Taken',      value: formatTime(timeTaken), color: 'text-cyan-400' },
  ];

  return (
    <div className="glass-card p-6 space-y-6 animate-slide-up">
      {/* Score Ring */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={scorePercent >= 60 ? '#22c55e' : scorePercent >= 33 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - scorePercent / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{Math.round(scorePercent)}%</span>
            <span className="text-xs text-slate-400">Score</span>
          </div>
        </div>
        <p className={`font-bold text-lg ${
          scorePercent >= 60 ? 'text-emerald-400' : scorePercent >= 33 ? 'text-amber-400' : 'text-rose-400'
        }`}>
          {scorePercent >= 60 ? '🎉 Excellent!' : scorePercent >= 33 ? '📚 Keep Practicing' : '💪 Don\'t Give Up!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-surface rounded-xl p-3 text-center">
            <div className={`text-xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Score Progress</span>
          <span>{score} / {totalMarks} marks</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(100, scorePercent)}%` }} />
        </div>
      </div>
    </div>
  );
};

/**
 * FileUpload – drag-and-drop + click JSON uploader.
 */
export const FileUpload = ({ onUpload, uploading, progress }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div
      className="relative border-2 border-dashed border-surface-border hover:border-brand-500 rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input').click()}
      id="file-upload-zone"
    >
      <input
        id="file-input"
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleChange}
      />

      {uploading ? (
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-300 font-medium">Uploading... {progress}%</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center group-hover:bg-brand-600/30 transition-colors">
            <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <p className="text-slate-200 font-semibold">Drop your JSON file here</p>
            <p className="text-slate-500 text-sm mt-1">or click to browse — max 10 MB</p>
          </div>
          <span className="badge bg-brand-600/20 text-brand-300 border-brand-500/30">.json</span>
        </div>
      )}
    </div>
  );
};
