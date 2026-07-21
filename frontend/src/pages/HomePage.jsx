import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubjects, fetchQuestions, uploadQuestions } from '../services/api';
import { useExam } from '../context/ExamContext';
import { FileUpload } from '../components/index';

const DIFFICULTIES = ['Any', 'Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [5, 10, 15, 20, 30];

export default function HomePage() {
  const navigate = useNavigate();
  const { setConfig, startExam, config } = useExam();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Any');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data.data || []);
    } catch {
      // No subjects yet — user needs to upload
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpload = async (file) => {
    if (!file.name.endsWith('.json')) {
      setError('Only .json files are accepted.');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setError('');
    try {
      const res = await uploadQuestions(file, setUploadProgress);
      showToast(res.data.message, 'success');
      await loadSubjects();
      setShowUpload(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleStartExam = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: questionCount,
        ...(selectedSubject && { subject: selectedSubject }),
        ...(selectedDifficulty !== 'Any' && { difficulty: selectedDifficulty }),
      };
      const res = await fetchQuestions(params);
      const questions = res.data.data;
      if (!questions || questions.length === 0) {
        setError('No questions found. Try uploading a question file first.');
        return;
      }
      setConfig({ subject: selectedSubject, difficulty: selectedDifficulty, limit: questionCount });
      startExam(questions);
      navigate('/exam');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-surface-border bg-surface-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-brand">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">GatePrep</h1>
              <p className="text-xs text-slate-500 -mt-0.5">GATE Exam Practice</p>
            </div>
          </div>
          <button
            id="toggle-upload-btn"
            onClick={() => setShowUpload((v) => !v)}
            className="btn-secondary text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Questions
          </button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 glass-card px-5 py-3 flex items-center gap-3 animate-slide-up shadow-card ${
          toast.type === 'success' ? 'border-emerald-500/50' : 'border-rose-500/50'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-6">

          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 badge bg-brand-600/20 text-brand-300 border-brand-500/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Phase 1 – MVP
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Practice{' '}
              <span className="text-gradient">GATE Exams</span>
              {' '}Like a Pro
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Upload your question bank, configure your exam, and get instant performance analytics.
            </p>
          </div>

          {/* Upload Panel */}
          {showUpload && (
            <div className="glass-card p-6 space-y-4 animate-slide-up">
              <h3 className="font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Question Bank
              </h3>
              <FileUpload onUpload={handleUpload} uploading={uploading} progress={uploadProgress} />
              <div className="text-xs text-slate-500 space-y-1">
                <p>• JSON file must have <code className="text-brand-400">subject</code> and <code className="text-brand-400">questions[]</code> fields</p>
                <p>• Each question needs: <code className="text-brand-400">id, question, options[4], correctAnswer (0–3)</code></p>
              </div>
            </div>
          )}

          {/* Exam Config */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-bold text-white text-lg">Configure Your Exam</h3>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="subject-select" className="text-sm font-medium text-slate-300">
                Subject
              </label>
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
                <p className="text-xs text-amber-400">No subjects found. Upload a question file to get started.</p>
              )}
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Difficulty</label>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    id={`diff-${d.toLowerCase()}`}
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

            {/* Number of Questions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Number of Questions
                <span className="ml-2 text-brand-400 font-bold">{questionCount}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    id={`count-${n}`}
                    onClick={() => setQuestionCount(n)}
                    className={`w-14 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                      questionCount === n
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-surface border-surface-border text-slate-400 hover:border-brand-500 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Start Button */}
            <button
              id="start-exam-btn"
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
                  Start Exam
                </>
              )}
            </button>
          </div>

          {/* Sample JSON hint */}
          <div className="glass-card p-4">
            <details>
              <summary className="text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors">
                📄 Sample JSON format
              </summary>
              <pre className="mt-3 text-xs text-slate-400 bg-surface rounded-xl p-4 overflow-x-auto">{`{
  "subject": "Operating System",
  "questions": [
    {
      "id": 1,
      "question": "Which scheduling algorithm is preemptive?",
      "options": ["FCFS", "Round Robin", "SJF", "Priority"],
      "correctAnswer": 1,
      "difficulty": "Easy",
      "concept": "CPU Scheduling",
      "explanation": "Round Robin is preemptive."
    }
  ]
}`}</pre>
            </details>
          </div>
        </div>
      </main>
    </div>
  );
}
