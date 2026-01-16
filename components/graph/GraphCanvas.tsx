'use client';

import React, { useMemo } from 'react';
import { Graph, NodeState, EdgeState } from '@/types';
import { Node } from './Node';
import { Edge } from './Edge';

interface GraphCanvasProps {
  graph: Graph;
  nodeStates: Map<string, NodeState>;
  edgeStates: Map<string, EdgeState>;
  distances: Map<string, number>;
  sourceId?: string;
  width?: number;
  height?: number;
  onNodeClick?: (nodeId: string) => void;
}

export function GraphCanvas({
  graph,
  nodeStates,
  edgeStates,
  distances,
  sourceId,
  width = 800,
  height = 500,
  onNodeClick,
}: GraphCanvasProps) {
  // Create node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map(graph.nodes.map(n => [n.id, n]));
    return map;
  }, [graph.nodes]);

  // Calculate viewBox based on actual graph bounds with padding
  const viewBoxData = useMemo(() => {
    if (graph.nodes.length === 0) {
      return { minX: 0, minY: 0, width, height };
    }

    const padding = 60; // Extra padding for labels and node radius
    const minX = Math.min(...graph.nodes.map(n => n.x)) - padding;
    const maxX = Math.max(...graph.nodes.map(n => n.x)) + padding;
    const minY = Math.min(...graph.nodes.map(n => n.y)) - padding;
    const maxY = Math.max(...graph.nodes.map(n => n.y)) + padding;

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [graph.nodes, width, height]);

  const viewBox = `${viewBoxData.minX} ${viewBoxData.minY} ${viewBoxData.width} ${viewBoxData.height}`;

  return (
    <svg
      width={width}
      height={height}
      className="bg-slate-50 rounded-lg border border-slate-200"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid pattern */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        x={viewBoxData.minX}
        y={viewBoxData.minY}
        width={viewBoxData.width}
        height={viewBoxData.height}
        fill="url(#grid)"
      />

      {/* Render edges first (behind nodes) */}
      <g className="edges">
        {graph.edges.map(edge => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);

          if (!sourceNode || !targetNode) return null;

          return (
            <Edge
              key={edge.id}
              edge={edge}
              sourceNode={sourceNode}
              targetNode={targetNode}
              state={edgeStates.get(edge.id) || 'default'}
              directed={graph.directed}
            />
          );
        })}
      </g>

      {/* Render nodes on top */}
      <g className="nodes">
        {graph.nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            state={nodeStates.get(node.id) || 'unvisited'}
            distance={distances.get(node.id)}
            isSource={node.id === sourceId}
            onClick={onNodeClick}
          />
        ))}
      </g>
    </svg>
  );
}
