import { useEffect, useState } from "react";

export const usePracticeTimer = (startedAt: number | null) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);

      setElapsedSeconds(elapsed);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const minutes = Math.floor(elapsedSeconds / 60);

  const seconds = elapsedSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  return {
    elapsedSeconds,
    formattedTime,
  };
};
