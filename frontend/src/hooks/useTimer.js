import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTimer – countdown timer hook.
 * @param {number} initialSeconds – total duration in seconds
 * @param {() => void} onExpire – called when timer reaches 0
 * @returns {{ timeLeft: number, isRunning: boolean, start, pause, reset, formatted }}
 */
const useTimer = (initialSeconds, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  // Keep onExpire ref up-to-date
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return; // Already running
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stop();
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stop]);

  const pause = useCallback(() => {
    stop();
  }, [stop]);

  const reset = useCallback((seconds) => {
    stop();
    setTimeLeft(seconds ?? initialSeconds);
  }, [stop, initialSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatted = {
    hours: Math.floor(timeLeft / 3600),
    minutes: Math.floor((timeLeft % 3600) / 60),
    seconds: timeLeft % 60,
    display: [
      Math.floor(timeLeft / 3600),
      Math.floor((timeLeft % 3600) / 60),
      timeLeft % 60,
    ]
      .map((n) => String(n).padStart(2, '0'))
      .join(':'),
    isLow: timeLeft <= 300, // last 5 minutes
    isCritical: timeLeft <= 60, // last 1 minute
  };

  return { timeLeft, isRunning, start, pause, reset, formatted };
};

export default useTimer;
