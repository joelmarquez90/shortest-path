'use client';

import { useState, useMemo } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { AlgorithmStepper } from '@/components/visualization/AlgorithmStepper';
import { StatePanel } from '@/components/visualization/StatePanel';
import { PseudocodeViewer } from '@/components/visualization/PseudocodeViewer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAlgorithmRunner } from '@/hooks/useAlgorithmRunner';
import { bmsspAlgorithm, bmsspPseudocode, algorithmExplanation } from '@/lib/algorithms/newAlgorithm';
import { graphExamples } from '@/lib/examples/sampleGraphs';
import { NodeState, EdgeState } from '@/types';

export default function NewAlgorithmPage() {
  const [selectedGraph, setSelectedGraph] = useState<keyof typeof graphExamples>('medium');
  const [sourceId, setSourceId] = useState(graphExamples.medium.source);

  const currentExample = graphExamples[selectedGraph];
  const graph = currentExample.graph;

  const handleGraphChange = (key: keyof typeof graphExamples) => {
    setSelectedGraph(key);
    setSourceId(graphExamples[key].source);
  };

  const {
    steps,
    currentStepIndex,
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    goToStep,
    setSpeed,
  } = useAlgorithmRunner({
    graph,
    sourceId,
    algorithmFn: bmsspAlgorithm,
  });

  const nodeStates = useMemo(() => {
    return currentStep?.nodeStates || new Map<string, NodeState>();
  }, [currentStep]);

  const edgeStates = useMemo(() => {
    return currentStep?.edgeStates || new Map<string, EdgeState>();
  }, [currentStep]);

  const distances = useMemo(() => {
    return currentStep?.distances || new Map<string, number>();
  }, [currentStep]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Algoritmo BMSSP
            <span className="ml-2 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              2025
            </span>
          </h1>
          <p className="text-slate-600 mt-1">
            Complejidad: <span className="font-mono text-purple-600">O(m log<sup>2/3</sup> n)</span>
            {' '}- ¡Rompe la barrera del sorting!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Grafo:</span>
          <select
            value={selectedGraph}
            onChange={(e) => handleGraphChange(e.target.value as keyof typeof graphExamples)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {Object.entries(graphExamples).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={reset}>
            Reiniciar
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph visualization */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <GraphCanvas
                graph={graph}
                nodeStates={nodeStates}
                edgeStates={edgeStates}
                distances={distances}
                sourceId={sourceId}
                width={700}
                height={450}
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <AlgorithmStepper
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            speed={speed}
            onPlay={play}
            onPause={pause}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={reset}
            onSpeedChange={setSpeed}
            onStepChange={goToStep}
          />
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Pseudocode */}
          <PseudocodeViewer
            code={bmsspPseudocode}
            currentLine={currentStep?.currentLine || 0}
            title="Pseudocódigo BMSSP"
          />

          {/* State panel */}
          <StatePanel step={currentStep} sourceId={sourceId} />
        </div>
      </div>

      {/* Legend */}
      <Card className="border-purple-200">
        <CardHeader className="py-3">
          <CardTitle className="text-base">Leyenda de Colores</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-400"></span>
              <span className="text-sm text-slate-600">No visitado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-400"></span>
              <span className="text-sm text-slate-600">En frontier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500"></span>
              <span className="text-sm text-slate-600">Pivot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-500"></span>
              <span className="text-sm text-slate-600">Procesando</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
              <span className="text-sm text-slate-600">Completado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Ideas */}
      <div className="grid md:grid-cols-2 gap-6">
        {algorithmExplanation.keyIdeas.map((idea, index) => (
          <Card key={index} className="border-purple-100">
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {idea.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm text-slate-600">{idea.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación con Dijkstra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dijkstra */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Dijkstra
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Complejidad:</span>
                  <span className="font-mono">{algorithmExplanation.comparison.dijkstra.complexity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Operaciones heap:</span>
                  <span className="font-mono text-xs">{algorithmExplanation.comparison.dijkstra.heapOperations}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Bottleneck:</span>
                  <span className="text-xs">{algorithmExplanation.comparison.dijkstra.bottleneck}</span>
                </div>
              </div>
            </div>

            {/* BMSSP */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                BMSSP (Nuevo)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Complejidad:</span>
                  <span className="font-mono text-purple-600">{algorithmExplanation.comparison.bmssp.complexity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Reducción pivot:</span>
                  <span className="font-mono text-xs">{algorithmExplanation.comparison.bmssp.pivotReduction}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Niveles:</span>
                  <span className="text-xs">{algorithmExplanation.comparison.bmssp.levels}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">¿Cómo rompe la barrera?</h4>
            <p className="text-purple-900 text-sm">
              En vez de mantener un orden total de todos los n vértices (que requiere Ω(n log n)),
              el algoritmo BMSSP solo ordena los <strong>pivots</strong> - aproximadamente |U|/k
              vértices por nivel. Al reducir el número de vértices que necesitan ser ordenados
              en cada nivel por un factor de k = log<sup>1/3</sup>(n), el trabajo total se reduce
              a O(m log<sup>2/3</sup> n).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
