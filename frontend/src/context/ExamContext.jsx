import { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  questions: [],
  currentIndex: 0,
  answers: {},        // { [questionId]: selectedOption (number | null) }
  markedForReview: new Set(),
  examStatus: 'idle', // 'idle' | 'running' | 'submitted'
  result: null,
  config: {
    subject: '',
    difficulty: '',
    limit: 10,
    time: null, // null = auto-calculate, number = minutes (set by GATE mode)
  },
  timeTaken: 0,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const examReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };

    case 'START_EXAM':
      return {
        ...state,
        questions: action.payload,
        currentIndex: 0,
        answers: {},
        markedForReview: new Set(),
        examStatus: 'running',
        result: null,
        timeTaken: 0,
      };

    case 'SET_ANSWER': {
      const { questionId, selectedOption } = action.payload;
      return {
        ...state,
        answers: { ...state.answers, [questionId]: selectedOption },
      };
    }

    case 'TOGGLE_MARK': {
      const newMarked = new Set(state.markedForReview);
      if (newMarked.has(action.payload)) {
        newMarked.delete(action.payload);
      } else {
        newMarked.add(action.payload);
      }
      return { ...state, markedForReview: newMarked };
    }

    case 'SET_INDEX':
      return { ...state, currentIndex: action.payload };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
      };

    case 'PREV_QUESTION':
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };

    case 'SUBMIT_EXAM':
      return {
        ...state,
        examStatus: 'submitted',
        result: action.payload.result,
        timeTaken: action.payload.timeTaken,
      };

    case 'RESET_EXAM':
      return { ...initialState };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);

  const setConfig = useCallback((config) => dispatch({ type: 'SET_CONFIG', payload: config }), []);
  const startExam = useCallback((questions) => dispatch({ type: 'START_EXAM', payload: questions }), []);
  const setAnswer = useCallback((questionId, selectedOption) =>
    dispatch({ type: 'SET_ANSWER', payload: { questionId, selectedOption } }), []);
  const toggleMark = useCallback((questionId) => dispatch({ type: 'TOGGLE_MARK', payload: questionId }), []);
  const setIndex = useCallback((index) => dispatch({ type: 'SET_INDEX', payload: index }), []);
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const prevQuestion = useCallback(() => dispatch({ type: 'PREV_QUESTION' }), []);
  const submitExamResult = useCallback((result, timeTaken) =>
    dispatch({ type: 'SUBMIT_EXAM', payload: { result, timeTaken } }), []);
  const resetExam = useCallback(() => dispatch({ type: 'RESET_EXAM' }), []);

  return (
    <ExamContext.Provider
      value={{
        ...state,
        setConfig,
        startExam,
        setAnswer,
        toggleMark,
        setIndex,
        nextQuestion,
        prevQuestion,
        submitExamResult,
        resetExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error('useExam must be used within ExamProvider');
  return ctx;
};

export default ExamContext;
