import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubjects, fetchQuestions } from '../services/api';
import { useExam } from '../context/ExamContext';

const DIFFICULTIES = ['Any', 'Easy', 'Medium', 'Hard'];

export default function CustomPracticePage() {
  const navigate = useNavigate();
  const { setConfig, startExam } = useExam();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Any');

  // Custom: free-form number of questions and time
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data.data || []);
    } catch {
      // no subjects yet
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStartExam = async () => {
    const count = parseInt(questionCount, 10);
    const time = parseInt(timeLimitMinutes, 10);

    if (isNaN(count) || count < 1) {
      setError('Please enter a valid number of questions (minimum 1).');
      return;
    }
    if (isNaN(time) || time < 1) {
      setError('Please enter a valid time limit (minimum 1 minute).');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const params = {
        limit: count,
        ...(selectedSubject && { subject: selectedSubject }),
        ...(selectedDifficulty !== 'Any' && { difficulty: selectedDifficulty }),
      };
      const res = await fetchQuestions(params);
      const questions = res.data.data;
      if (!questions || questions.length === 0) {
        setError('No questions found. Try uploading a question file first.');
        return;
      }
      setConfig({ subject: selectedSubject, difficulty: selectedDifficulty, limit: count, time });
      startExam(questions);
      navigate('/exam');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 glass-card px-5 py-3 flex items-center gap-3 animate-slide-up shadow-card ${
          toast.type === 'success' ? 'border-emerald-500/50' : 'border-rose-500/50'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-6">

          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 badge bg-purple-600/20 text-purple-300 border-purple-500/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Custom Practice
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Practice{' '}
              <span className="text-gradient">Your Way</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Set your own question count and time limit for a fully customized session.
            </p>
          </div>

          {/* Config Card */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-bold text-white text-lg">Configure Your Practice</h3>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="subject-select" className="text-sm font-medium text-slate-300">Subject</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="select"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {subjects.length === 0 && (
                <p className="text-xs text-amber-400">No subjects found. Upload a question file first.</p>
              )}
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Difficulty</label>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                      selectedDifficulty === d
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-surface border-surface-border text-slate-400 hover:border-brand-500 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions — free input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Number of Questions
                <span className="ml-2 text-brand-400 font-bold">{questionCount}</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="input w-full"
                placeholder="e.g. 25"
              />
            </div>

            {/* Time Limit — free input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Time Limit
                <span className="ml-2 text-brand-400 font-bold">{timeLimitMinutes} min</span>
              </label>
              <input
                type="number"
                min="1"
                max="360"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                className="input w-full"
                placeholder="e.g. 30"
              />
              <p className="text-xs text-slate-500">
                Estimated: {Math.round(timeLimitMinutes / (questionCount || 1))} min per question
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartExam}
              disabled={loading}
              className="btn-primary w-full text-base py-4"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading Questions...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Custom Practice
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
