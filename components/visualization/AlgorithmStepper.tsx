'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface AlgorithmStepperProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStepChange: (step: number) => void;
}

export function AlgorithmStepper({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onStepChange,
}: AlgorithmStepperProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-slate-200">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600 min-w-[80px]">
          Paso {currentStep + 1} / {totalSteps}
        </span>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onStepChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          title="Reiniciar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onStepBackward}
          disabled={currentStep === 0}
          title="Paso anterior"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {isPlaying ? (
          <Button
            variant="primary"
            size="md"
            onClick={onPause}
            title="Pausar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2">Pausar</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={onPlay}
            title="Reproducir"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2">Play</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          title="Paso siguiente"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Velocidad:</span>
        <Slider
          min={100}
          max={2000}
          value={speed}
          onChange={onSpeedChange}
          showValue={false}
          className="flex-1"
        />
        <span className="text-sm text-slate-500 min-w-[60px]">{speed}ms</span>
      </div>
    </div>
  );
}
