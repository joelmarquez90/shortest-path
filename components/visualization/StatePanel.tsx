'use client';

import React from 'react';
import { AlgorithmStep, NODE_COLORS } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StatePanelProps {
  step: AlgorithmStep | null;
  sourceId?: string;
}

export function StatePanel({ step, sourceId }: StatePanelProps) {
  if (!step) {
    return (
      <Card>
        <CardContent className="text-center text-slate-500 py-8">
          Ejecuta el algoritmo para ver el estado
        </CardContent>
      </Card>
    );
  }

  // Sort distances by value for display
  const sortedDistances = Array.from(step.distances.entries())
    .sort((a, b) => {
      if (a[1] === Infinity && b[1] === Infinity) return 0;
      if (a[1] === Infinity) return 1;
      if (b[1] === Infinity) return -1;
      return a[1] - b[1];
    });

  return (
    <div className="flex flex-col gap-4">
      {/* Current action */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Acción Actual</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <p className="text-sm text-slate-700">{step.description}</p>
          {step.metadata?.currentNode && (
            <p className="text-xs text-slate-500 mt-1">
              Nodo actual: <span className="font-mono font-bold">{step.metadata.currentNode}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Comparaciones:</span>
              <span className="font-mono font-bold">{step.metadata?.comparisons || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Relajaciones:</span>
              <span className="font-mono font-bold">{step.metadata?.relaxations || 0}</span>
            </div>
          </div>
          {step.metadata?.pivots && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <span className="text-slate-600 text-sm">Pivots: </span>
              <span className="font-mono text-sm text-purple-600 font-bold">
                {step.metadata.pivots.join(', ')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frontier / Queue */}
      {step.frontier.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Cola / Frontier</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-2">
              {step.frontier.map(nodeId => (
                <span
                  key={nodeId}
                  className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm font-mono"
                >
                  {nodeId}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distances table */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Distancias</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-600">
                <tr>
                  <th className="pb-2">Nodo</th>
                  <th className="pb-2">Dist</th>
                  <th className="pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sortedDistances.map(([nodeId, dist]) => {
                  const state = step.nodeStates.get(nodeId) || 'unvisited';
                  const isSource = nodeId === sourceId;

                  return (
                    <tr key={nodeId} className="border-t border-slate-100">
                      <td className="py-1.5 font-mono">
                        {isSource && '★ '}{nodeId}
                      </td>
                      <td className="py-1.5 font-mono">
                        {dist === Infinity ? '∞' : dist}
                      </td>
                      <td className="py-1.5">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: NODE_COLORS[state] }}
                          title={state}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
