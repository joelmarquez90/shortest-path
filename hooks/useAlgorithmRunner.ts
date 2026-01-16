'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Graph, AlgorithmStep, AlgorithmGenerator } from '@/types';

interface UseAlgorithmRunnerOptions {
  graph: Graph;
  sourceId: string;
  algorithmFn: (graph: Graph, sourceId: string) => AlgorithmGenerator;
}

interface UseAlgorithmRunnerReturn {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  currentStep: AlgorithmStep | null;
  isPlaying: boolean;
  isComplete: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  runToCompletion: () => void;
}

export function useAlgorithmRunner({
  graph,
  sourceId,
  algorithmFn,
}: UseAlgorithmRunnerOptions): UseAlgorithmRunnerReturn {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generatorRef = useRef<AlgorithmGenerator | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize generator and get first step
  const initialize = useCallback(() => {
    generatorRef.current = algorithmFn(graph, sourceId);
    const firstResult = generatorRef.current.next();

    if (!firstResult.done) {
      setSteps([firstResult.value]);
      setCurrentStepIndex(0);
    }
  }, [graph, sourceId, algorithmFn]);

  // Get next step from generator
  const getNextStep = useCallback(() => {
    if (!generatorRef.current) return null;

    const result = generatorRef.current.next();
    return result.value || null;
  }, []);

  // Step forward
  const stepForward = useCallback(() => {
    // If we have cached steps, just move forward
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      return;
    }

    // Otherwise, generate next step
    const nextStep = getNextStep();
    if (nextStep) {
      setSteps(prev => [...prev, nextStep]);
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length, getNextStep]);

  // Step backward
  const stepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  // Go to specific step
  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  // Play animation
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Pause animation
  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset to beginning
  const reset = useCallback(() => {
    pause();
    setSteps([]);
    setCurrentStepIndex(0);
    initialize();
  }, [pause, initialize]);

  // Run algorithm to completion
  const runToCompletion = useCallback(() => {
    if (!generatorRef.current) return;

    const allSteps = [...steps];
    let result = generatorRef.current.next();

    while (!result.done) {
      if (result.value) {
        allSteps.push(result.value);
      }
      result = generatorRef.current.next();
    }

    // Add final step if it exists
    if (result.value) {
      allSteps.push(result.value);
    }

    setSteps(allSteps);
    setCurrentStepIndex(allSteps.length - 1);
  }, [steps]);

  // Handle play/pause interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          // Check if we need to generate more steps
          if (prev >= steps.length - 1) {
            const nextStep = getNextStep();
            if (nextStep) {
              setSteps(prevSteps => [...prevSteps, nextStep]);
              return prev + 1;
            } else {
              // No more steps, stop playing
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length, getNextStep]);

  // Initialize on mount or when graph/source changes
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check if algorithm is complete
  const isComplete = currentStepIndex >= steps.length - 1 &&
    steps[steps.length - 1]?.type === 'done';

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex] || null,
    isPlaying,
    isComplete,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    goToStep,
    setSpeed,
    runToCompletion,
  };
}
