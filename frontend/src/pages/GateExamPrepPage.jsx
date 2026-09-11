import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubjects, fetchQuestions, uploadQuestions, deleteSubject } from '../services/api';
import { useExam } from '../context/ExamContext';
import { FileUpload } from '../components/index';

// GATE exam modes with preset configurations
const GATE_MODES = [
  { id: 'full', label: 'Full Mock Test', description: '65 questions · 3 hours', questions: 65, time: 180, icon: '🏆' },
  { id: 'half', label: 'Half Mock Test', description: '33 questions · 90 min', questions: 33, time: 90, icon: '⚡' },
  { id: 'subject', label: 'Subject-wise Test', description: '30 questions · 60 min', questions: 30, time: 60, icon: '📚' },
  { id: 'chapter', label: 'Chapter Practice', description: '15 questions · 30 min', questions: 15, time: 30, icon: '📖' },
  { id: 'pyq', label: 'Previous Year Questions', description: 'All PYQ · 3 hours', questions: 65, time: 180, icon: '📅' },
];

const SUBJECTS_LIST = [
  'Operating Systems', 'Computer Networks', 'Database Management Systems',
  'Data Structures', 'Algorithms', 'Computer Organization', 'Theory of Computation',
  'Discrete Mathematics', 'Digital Logic', 'Programming & DS', 'Compiler Design',
];

export default function GateExamPrepPage() {
  const navigate = useNavigate();
  const { setConfig, startExam } = useExam();

  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [filterSubject, setFilterSubject] = useState('');

  // Upload modal state
  const [allPapers, setAllPapers] = useState([]);   // list of subject strings from DB
  const [selectedPaper, setSelectedPaper] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [paperLabel, setPaperLabel] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const res = await getSubjects();
      setAllPapers(res.data.data || []);
    } catch {
      // no papers yet
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleModeClick = (mode) => {
    setSelectedMode(mode);
    setFilterSubject('');
    setSelectedPaper('');
    setUploadError('');
    setShowModal(true);
  };

  const handleSubjectClick = (subject) => {
    setFilterSubject(subject);
    setSelectedPaper('');
    setUploadError('');
    setShowModal(true);
    setSelectedMode(GATE_MODES.find(m => m.id === 'subject'));
  };

  // Bidirectional fuzzy match for subject filtering
  const visiblePapers = filterSubject
    ? allPapers.filter(p => {
        const pL = p.toLowerCase();
        const fL = filterSubject.toLowerCase();
        return pL.includes(fL) || fL.includes(pL);
      })
    : allPapers;

  const handleUpload = async (file) => {
    if (!file.name.endsWith('.json')) {
      setUploadError('Only .json files are accepted.');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    try {
      const res = await uploadQuestions(file, setUploadProgress);
      showToast(res.data.message, 'success');
      await loadPapers();
      setPaperLabel('');
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeletePaper = async (paper, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete all questions for "${paper}"?`)) return;
    try {
      await deleteSubject(paper);
      showToast(`Deleted "${paper}"`, 'success');
      if (selectedPaper === paper) setSelectedPaper('');
      await loadPapers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleStartExam = async () => {
    if (!selectedPaper) {
      setUploadError('Please select a paper from the dropdown.');
      return;
    }
    const mode = selectedMode || GATE_MODES[0];
    setLoading(true);
    setUploadError('');
    try {
      const params = {
        limit: mode.questions,
        subject: selectedPaper,
      };
      const res = await fetchQuestions(params);
      const questions = res.data.data;
      if (!questions || questions.length === 0) {
        setUploadError('No questions found for this paper. Please upload questions first.');
        return;
      }
      setConfig({ subject: selectedPaper, limit: mode.questions, time: mode.time });
      startExam(questions);
      navigate('/exam');
    } catch (err) {
      setUploadError(err.message);
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

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 badge bg-brand-600/20 text-brand-300 border-brand-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            GATE Exam Preparation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Practice{' '}
            <span className="text-gradient">GATE Exams</span>
            {' '}Like a Pro
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Choose your exam mode, select a paper, and start your timed practice session.
          </p>
        </div>

        {/* Exam Modes */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Select Exam Mode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GATE_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode)}
                className="glass-card p-5 text-left hover:border-brand-500/50 transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">{mode.icon}</div>
                <h3 className="font-bold text-white text-base group-hover:text-brand-300 transition-colors">{mode.label}</h3>
                <p className="text-slate-500 text-sm mt-1">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Subject-wise Quick Access */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Subject-wise Practice</h2>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS_LIST.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-surface-border bg-surface text-slate-400 hover:border-brand-500 hover:text-white transition-all duration-150"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Upload / Select Paper Modal ─────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="glass-card p-8 max-w-lg w-full mx-4 space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">
                  {filterSubject ? `${filterSubject} Papers` : (selectedMode?.label || 'Select Paper')}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {selectedMode ? selectedMode.description : 'Choose a paper to start'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Paper Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {filterSubject ? `${filterSubject} Papers` : 'Previously Uploaded Papers'}
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(v => !v)}
                  className="w-full select text-left flex items-center justify-between"
                >
                  <span className={selectedPaper ? 'text-white' : 'text-slate-500'}>
                    {selectedPaper || 'Select a paper…'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-surface-card border border-surface-border rounded-xl shadow-xl overflow-hidden">
                    {visiblePapers.length === 0 ? (
                      <p className="text-slate-500 text-sm p-3">
                        {filterSubject
                          ? `No ${filterSubject} papers uploaded yet.`
                          : 'No papers uploaded yet. Upload one below.'}
                      </p>
                    ) : (
                      visiblePapers.map((paper) => (
                        <div
                          key={paper}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-brand-600/20 transition-colors ${
                            selectedPaper === paper ? 'bg-brand-600/30 text-brand-300' : 'text-slate-300'
                          }`}
                          onClick={() => { setSelectedPaper(paper); setShowDropdown(false); }}
                        >
                          <span className="text-sm">{paper}</span>
                          <button
                            onClick={(e) => handleDeletePaper(paper, e)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete paper"
                          >
                            🗑
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-border" />
              <span className="text-xs text-slate-500">OR UPLOAD NEW</span>
              <div className="flex-1 h-px bg-surface-border" />
            </div>

            {/* Paper Label */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Paper Label</label>
              <input
                type="text"
                value={paperLabel}
                onChange={(e) => setPaperLabel(e.target.value)}
                placeholder={`e.g. ${filterSubject || 'Operating System'} – GATE 2023`}
                className="input w-full"
              />
              {paperLabel.trim() && (
                <p className="text-xs text-brand-400">
                  Will be saved as: <span className="font-semibold">"{filterSubject || 'Subject'} – {paperLabel.trim()}"</span>
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Upload JSON File</label>
              <FileUpload onUpload={handleUpload} uploading={uploading} progress={uploadProgress} />
              <div className="text-xs text-slate-500 space-y-0.5">
                <p>• JSON must have <code className="text-brand-400">subject</code> and <code className="text-brand-400">questions[]</code></p>
                <p>• Each question: <code className="text-brand-400">id, question, options[4], correctAnswer (0–3)</code></p>
              </div>
            </div>

            {/* Sample JSON */}
            <details className="glass-card p-3">
              <summary className="text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors">
                📄 Sample JSON format
              </summary>
              <pre className="mt-3 text-xs text-slate-400 bg-surface rounded-xl p-3 overflow-x-auto">{`{
  "subject": "Operating Systems",
  "questions": [
    {
      "id": 1,
      "question": "Which scheduling is preemptive?",
      "options": ["FCFS","Round Robin","SJF","Priority"],
      "correctAnswer": 1,
      "difficulty": "Easy",
      "concept": "CPU Scheduling"
    }
  ]
}`}</pre>
            </details>

            {/* Error */}
            {uploadError && (
              <div className="flex items-start gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {uploadError}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartExam}
              disabled={loading || !selectedPaper}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start {selectedMode?.label || 'Exam'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
