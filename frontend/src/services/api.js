import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
});

// ─── Interceptors ─────────────────────────────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ─── API Methods ──────────────────────────────────────────────────────────────

/**
 * Upload a question file (JSON).
 * @param {File} file
 * @param {(progress: number) => void} onProgress
 */
export const uploadQuestions = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
};

/**
 * Get available subjects.
 */
export const getSubjects = () => API.get('/exam/subjects');

/**
 * Fetch exam questions (correctAnswer hidden by backend).
 * @param {{ subject?: string, difficulty?: string, limit?: number }} params
 */
export const fetchQuestions = (params = {}) => API.get('/exam', { params });

/**
 * Submit exam answers.
 * @param {{ answers: Array, timeTaken: number }} payload
 */
export const submitExam = (payload) => API.post('/exam/submit', payload);

/**
 * Delete all questions for a subject (paper).
 * @param {string} subject
 */
export const deleteSubject = (subject) =>
  API.delete(`/exam/subject/${encodeURIComponent(subject)}`);

export default API;
