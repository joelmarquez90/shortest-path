'use client';

import { useState, useMemo } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { AlgorithmStepper } from '@/components/visualization/AlgorithmStepper';
import { StatePanel } from '@/components/visualization/StatePanel';
import { PseudocodeViewer } from '@/components/visualization/PseudocodeViewer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAlgorithmRunner } from '@/hooks/useAlgorithmRunner';
import { dijkstra, dijkstraPseudocode } from '@/lib/algorithms/dijkstra';
import { graphExamples } from '@/lib/examples/sampleGraphs';
import { Graph, NodeState, EdgeState } from '@/types';

export default function DijkstraPage() {
  const [selectedGraph, setSelectedGraph] = useState<keyof typeof graphExamples>('simple');
  const [sourceId, setSourceId] = useState(graphExamples.simple.source);

  const currentExample = graphExamples[selectedGraph];
  const graph = currentExample.graph;

  // Update source when graph changes
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
    algorithmFn: dijkstra,
  });

  // Get current visual states
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
          <h1 className="text-3xl font-bold text-slate-900">Algoritmo de Dijkstra</h1>
          <p className="text-slate-600 mt-1">
            Complejidad: <span className="font-mono text-blue-600">O(m + n log n)</span>
          </p>
        </div>

        {/* Graph selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Grafo:</span>
          <select
            value={selectedGraph}
            onChange={(e) => handleGraphChange(e.target.value as keyof typeof graphExamples)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <Card>
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
            code={dijkstraPseudocode}
            currentLine={currentStep?.currentLine || 0}
            title="Pseudocódigo Dijkstra"
          />

          {/* State panel */}
          <StatePanel step={currentStep} sourceId={sourceId} />
        </div>
      </div>

      {/* Legend */}
      <Card>
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
              <span className="text-sm text-slate-600">En cola (frontier)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-500"></span>
              <span className="text-sm text-slate-600">Procesando</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
              <span className="text-sm text-slate-600">Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-500"></span>
              <span className="text-sm text-slate-600">Arista relajando</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500"></span>
              <span className="text-sm text-slate-600">Camino más corto</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo funciona Dijkstra?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <ol className="space-y-2 text-slate-700">
              <li>
                <strong>Inicialización:</strong> Asigna distancia 0 al nodo fuente y ∞ a todos los demás.
                Agrega todos los nodos a una cola de prioridad.
              </li>
              <li>
                <strong>Extracción:</strong> En cada iteración, extrae el nodo con la menor distancia
                de la cola. Este nodo está &quot;completo&quot; - su distancia final ha sido encontrada.
              </li>
              <li>
                <strong>Relajación:</strong> Para cada vecino del nodo actual, calcula si pasar por
                el nodo actual ofrece un camino más corto. Si es así, actualiza la distancia.
              </li>
              <li>
                <strong>Repetir:</strong> Continúa hasta que la cola esté vacía o todos los nodos
                alcanzables hayan sido procesados.
              </li>
            </ol>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Bottleneck del Sorting</h4>
              <p className="text-amber-900 text-sm">
                El algoritmo mantiene un ordenamiento implícito de los vértices por distancia.
                Esto requiere Ω(n log n) operaciones de comparación, lo cual se creía era el
                límite inferior para SSSP. El nuevo algoritmo BMSSP rompe esta barrera.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
