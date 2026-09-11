import { useState } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import GateExamPrepPage from './pages/GateExamPrepPage';
import CustomPracticePage from './pages/CustomPracticePage';
import RevisionPage    from './pages/RevisionPage';
import ExamPage        from './pages/ExamPage';
import ResultPage      from './pages/ResultPage';
import { useExam }    from './context/ExamContext';
import { uploadQuestions } from './services/api';
import { FileUpload }  from './components/index';

// ─── Guards ───────────────────────────────────────────────────────────────────
const ExamGuard = ({ children }) => {
  const { examStatus } = useExam();
  if (examStatus === 'idle') return <Navigate to="/" replace />;
  return children;
};

const ResultGuard = ({ children }) => {
  const { examStatus } = useExam();
  if (examStatus !== 'submitted') return <Navigate to="/" replace />;
  return children;
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
      setShowUploadModal(false);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-brand-600 text-white shadow-glow-brand'
        : 'text-slate-400 hover:text-white hover:bg-surface-card'
    }`;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] glass-card px-5 py-3 flex items-center gap-3 animate-slide-up shadow-card ${
          toast.type === 'success' ? 'border-emerald-500/50' : 'border-rose-500/50'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-brand">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">GatePrep</h1>
              <p className="text-xs text-slate-500">GATE Exam Practice</p>
            </div>
          </NavLink>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/gate-prep" className={navLinkClass}>GATE Exam Prep</NavLink>
            <NavLink to="/custom-practice" className={navLinkClass}>Custom Practice</NavLink>
            <NavLink to="/revision" className={navLinkClass}>Revision</NavLink>
          </nav>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-secondary text-sm flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Questions
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden px-6 pb-3 flex gap-1 overflow-x-auto">
          <NavLink to="/gate-prep" className={navLinkClass}>GATE Prep</NavLink>
          <NavLink to="/custom-practice" className={navLinkClass}>Custom</NavLink>
          <NavLink to="/revision" className={navLinkClass}>Revision</NavLink>
        </div>
      </header>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowUploadModal(false); }}
        >
          <div className="glass-card p-8 max-w-md w-full mx-4 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Upload Questions</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <FileUpload onUpload={handleUpload} uploading={uploading} progress={uploadProgress} />

            <div className="text-xs text-slate-500 space-y-1">
              <p>• JSON must have <code className="text-brand-400">subject</code> and <code className="text-brand-400">questions[]</code></p>
              <p>• Each question: <code className="text-brand-400">id, question, options[4], correctAnswer (0–3)</code></p>
            </div>

            {uploadError && (
              <div className="flex items-start gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {uploadError}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const { examStatus } = useExam();
  const hideNav = examStatus === 'running'; // hide navbar during exam

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/"                element={<GateExamPrepPage />} />
        <Route path="/gate-prep"       element={<GateExamPrepPage />} />
        <Route path="/custom-practice" element={<CustomPracticePage />} />
        <Route path="/revision"        element={<RevisionPage />} />
        <Route
          path="/exam"
          element={
            <ExamGuard>
              <ExamPage />
            </ExamGuard>
          }
        />
        <Route
          path="/result"
          element={
            <ResultGuard>
              <ResultPage />
            </ResultGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
