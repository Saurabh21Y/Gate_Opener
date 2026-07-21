import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage   from './pages/HomePage';
import ExamPage   from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import { useExam } from './context/ExamContext';

// Guard: redirect to home if exam hasn't started
const ExamGuard = ({ children }) => {
  const { examStatus } = useExam();
  if (examStatus === 'idle') return <Navigate to="/" replace />;
  return children;
};

// Guard: redirect to exam if not submitted yet
const ResultGuard = ({ children }) => {
  const { examStatus } = useExam();
  if (examStatus !== 'submitted') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
  );
}

export default App;
