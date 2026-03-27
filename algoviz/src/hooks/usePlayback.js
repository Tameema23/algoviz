import { useEffect, useRef } from 'react';
import { useStore } from '../store';

export function usePlayback() {
  const { isPlaying, speed, currentStep, steps, nextStep, setIsPlaying } = useStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const { currentStep, steps } = useStore.getState();
        if (currentStep >= steps.length - 1) {
          setIsPlaying(false);
        } else {
          nextStep();
        }
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed]);

  return { isPlaying, currentStep, steps };
}
