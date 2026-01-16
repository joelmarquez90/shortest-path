'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { dijkstra } from '@/lib/algorithms/dijkstra';
import { bmsspAlgorithm } from '@/lib/algorithms/newAlgorithm';
import { graphExamples } from '@/lib/examples/sampleGraphs';
import { AlgorithmStep, NodeState, EdgeState } from '@/types';

export default function ComparePage() {
  const [selectedGraph, setSelectedGraph] = useState<keyof typeof graphExamples>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Dijkstra state
  const [dijkstraSteps, setDijkstraSteps] = useState<AlgorithmStep[]>([]);
  const [dijkstraIndex, setDijkstraIndex] = useState(0);
  const dijkstraGenRef = useRef<Generator<AlgorithmStep, AlgorithmStep, undefined> | null>(null);

  // BMSSP state
  const [bmsspSteps, setBmsspSteps] = useState<AlgorithmStep[]>([]);
  const [bmsspIndex, setBmsspIndex] = useState(0);
  const bmsspGenRef = useRef<Generator<AlgorithmStep, AlgorithmStep, undefined> | null>(null);

  const currentExample = graphExamples[selectedGraph];
  const graph = currentExample.graph;
  const sourceId = currentExample.source;

  // Initialize generators
  const initializeGenerators = () => {
    dijkstraGenRef.current = dijkstra(graph, sourceId);
    bmsspGenRef.current = bmsspAlgorithm(graph, sourceId);

    const firstDijkstra = dijkstraGenRef.current.next();
    const firstBmssp = bmsspGenRef.current.next();

    if (!firstDijkstra.done) {
      setDijkstraSteps([firstDijkstra.value]);
      setDijkstraIndex(0);
    }
    if (!firstBmssp.done) {
      setBmsspSteps([firstBmssp.value]);
      setBmsspIndex(0);
    }
  };

  // Reset when graph changes
  useEffect(() => {
    setIsPlaying(false);
    initializeGenerators();
  }, [selectedGraph]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      let dijkstraDone = false;
      let bmsspDone = false;

      // Advance Dijkstra
      if (dijkstraIndex < dijkstraSteps.length - 1) {
        setDijkstraIndex(prev => prev + 1);
      } else if (dijkstraGenRef.current) {
        const result = dijkstraGenRef.current.next();
        if (!result.done && result.value) {
          setDijkstraSteps(prev => [...prev, result.value]);
          setDijkstraIndex(prev => prev + 1);
        } else if (result.value) {
          setDijkstraSteps(prev => [...prev, result.value]);
          setDijkstraIndex(prev => prev + 1);
          dijkstraDone = true;
        } else {
          dijkstraDone = true;
        }
      } else {
        dijkstraDone = true;
      }

      // Advance BMSSP
      if (bmsspIndex < bmsspSteps.length - 1) {
        setBmsspIndex(prev => prev + 1);
      } else if (bmsspGenRef.current) {
        const result = bmsspGenRef.current.next();
        if (!result.done && result.value) {
          setBmsspSteps(prev => [...prev, result.value]);
          setBmsspIndex(prev => prev + 1);
        } else if (result.value) {
          setBmsspSteps(prev => [...prev, result.value]);
          setBmsspIndex(prev => prev + 1);
          bmsspDone = true;
        } else {
          bmsspDone = true;
        }
      } else {
        bmsspDone = true;
      }

      // Stop if both done
      if (dijkstraDone && bmsspDone) {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, dijkstraIndex, dijkstraSteps.length, bmsspIndex, bmsspSteps.length]);

  const dijkstraStep = dijkstraSteps[dijkstraIndex] || null;
  const bmsspStep = bmsspSteps[bmsspIndex] || null;

  const dijkstraNodeStates = useMemo(() => dijkstraStep?.nodeStates || new Map<string, NodeState>(), [dijkstraStep]);
  const dijkstraEdgeStates = useMemo(() => dijkstraStep?.edgeStates || new Map<string, EdgeState>(), [dijkstraStep]);
  const dijkstraDistances = useMemo(() => dijkstraStep?.distances || new Map<string, number>(), [dijkstraStep]);

  const bmsspNodeStates = useMemo(() => bmsspStep?.nodeStates || new Map<string, NodeState>(), [bmsspStep]);
  const bmsspEdgeStates = useMemo(() => bmsspStep?.edgeStates || new Map<string, EdgeState>(), [bmsspStep]);
  const bmsspDistances = useMemo(() => bmsspStep?.distances || new Map<string, number>(), [bmsspStep]);

  const handleReset = () => {
    setIsPlaying(false);
    setDijkstraSteps([]);
    setBmsspSteps([]);
    setDijkstraIndex(0);
    setBmsspIndex(0);
    initializeGenerators();
  };

  const dijkstraComplete = dijkstraStep?.type === 'done';
  const bmsspComplete = bmsspStep?.type === 'done';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Comparación Side-by-Side</h1>
          <p className="text-slate-600 mt-1">
            Observa ambos algoritmos ejecutándose en paralelo sobre el mismo grafo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Grafo:</span>
          <select
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value as keyof typeof graphExamples)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(graphExamples).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reiniciar
              </Button>

              {isPlaying ? (
                <Button onClick={() => setIsPlaying(false)}>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pausar
                </Button>
              ) : (
                <Button onClick={() => setIsPlaying(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ejecutar Ambos
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <span className="text-sm text-slate-600">Velocidad:</span>
              <Slider
                min={100}
                max={2000}
                value={speed}
                onChange={setSpeed}
                showValue={false}
                className="flex-1"
              />
              <span className="text-sm text-slate-500 min-w-[60px]">{speed}ms</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side by side visualizations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Dijkstra */}
        <Card className={dijkstraComplete ? 'border-green-300' : ''}>
          <CardHeader className="py-3 bg-blue-50 rounded-t-xl">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Dijkstra
              </span>
              <span className="text-sm font-mono text-blue-600">O(m + n log n)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <GraphCanvas
              graph={graph}
              nodeStates={dijkstraNodeStates}
              edgeStates={dijkstraEdgeStates}
              distances={dijkstraDistances}
              sourceId={sourceId}
              width={500}
              height={350}
            />

            {/* Stats */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Paso:</span>
                  <span className="ml-2 font-mono">{dijkstraIndex + 1} / {dijkstraSteps.length}</span>
                </div>
                <div>
                  <span className="text-slate-600">Comparaciones:</span>
                  <span className="ml-2 font-mono">{dijkstraStep?.metadata?.comparisons || 0}</span>
                </div>
                <div>
                  <span className="text-slate-600">Relajaciones:</span>
                  <span className="ml-2 font-mono">{dijkstraStep?.metadata?.relaxations || 0}</span>
                </div>
                <div>
                  <span className="text-slate-600">Estado:</span>
                  <span className={`ml-2 font-medium ${dijkstraComplete ? 'text-green-600' : 'text-amber-600'}`}>
                    {dijkstraComplete ? 'Completado' : 'En progreso'}
                  </span>
                </div>
              </div>

              {dijkstraStep && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-sm text-slate-700">{dijkstraStep.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* BMSSP */}
        <Card className={bmsspComplete ? 'border-green-300' : 'border-purple-200'}>
          <CardHeader className="py-3 bg-purple-50 rounded-t-xl">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                BMSSP (Nuevo)
              </span>
              <span className="text-sm font-mono text-purple-600">O(m log<sup>2/3</sup> n)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <GraphCanvas
              graph={graph}
              nodeStates={bmsspNodeStates}
              edgeStates={bmsspEdgeStates}
              distances={bmsspDistances}
              sourceId={sourceId}
              width={500}
              height={350}
            />

            {/* Stats */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Paso:</span>
                  <span className="ml-2 font-mono">{bmsspIndex + 1} / {bmsspSteps.length}</span>
                </div>
                <div>
                  <span className="text-slate-600">Comparaciones:</span>
                  <span className="ml-2 font-mono">{bmsspStep?.metadata?.comparisons || 0}</span>
                </div>
                <div>
                  <span className="text-slate-600">Relajaciones:</span>
                  <span className="ml-2 font-mono">{bmsspStep?.metadata?.relaxations || 0}</span>
                </div>
                <div>
                  <span className="text-slate-600">Estado:</span>
                  <span className={`ml-2 font-medium ${bmsspComplete ? 'text-green-600' : 'text-amber-600'}`}>
                    {bmsspComplete ? 'Completado' : 'En progreso'}
                  </span>
                </div>
                {bmsspStep?.metadata?.pivots && (
                  <div className="col-span-2">
                    <span className="text-slate-600">Pivots:</span>
                    <span className="ml-2 font-mono text-purple-600">
                      {bmsspStep.metadata.pivots.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {bmsspStep && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <p className="text-sm text-slate-700">{bmsspStep.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {dijkstraComplete && bmsspComplete && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 text-center">
              ¡Ambos algoritmos completados!
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-slate-600 mb-2">Dijkstra</p>
                <p className="text-2xl font-mono font-bold text-blue-600">
                  {dijkstraStep?.metadata?.comparisons || 0} comparaciones
                </p>
                <p className="text-sm text-slate-500">
                  {dijkstraStep?.metadata?.relaxations || 0} relajaciones
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-600 mb-2">BMSSP</p>
                <p className="text-2xl font-mono font-bold text-purple-600">
                  {bmsspStep?.metadata?.comparisons || 0} comparaciones
                </p>
                <p className="text-sm text-slate-500">
                  {bmsspStep?.metadata?.relaxations || 0} relajaciones
                </p>
              </div>
            </div>
            <p className="text-center text-sm text-slate-600 mt-4">
              Nota: En grafos pequeños, la diferencia puede no ser significativa.
              La ventaja de BMSSP se nota en grafos grandes y sparse.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
