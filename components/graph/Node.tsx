'use client';

import React from 'react';
import { GraphNode, NodeState, NODE_COLORS } from '@/types';

interface NodeComponentProps {
  node: GraphNode;
  state: NodeState;
  distance?: number;
  isSource?: boolean;
  onClick?: (nodeId: string) => void;
}

export function Node({
  node,
  state,
  distance,
  isSource = false,
  onClick,
}: NodeComponentProps) {
  const color = NODE_COLORS[state];
  const radius = isSource ? 28 : 24;

  return (
    <g
      className="cursor-pointer transition-transform hover:scale-110"
      onClick={() => onClick?.(node.id)}
    >
      {/* Outer glow for current node */}
      {state === 'current' && (
        <circle
          cx={node.x}
          cy={node.y}
          r={radius + 8}
          fill="none"
          stroke={color}
          strokeWidth="3"
          opacity="0.3"
          className="animate-pulse"
        />
      )}

      {/* Pivot indicator ring */}
      {state === 'pivot' && (
        <circle
          cx={node.x}
          cy={node.y}
          r={radius + 6}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray="6 3"
        />
      )}

      {/* Main node circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={color}
        stroke={isSource ? '#1e293b' : 'white'}
        strokeWidth={isSource ? 3 : 2}
        className="transition-colors duration-300"
      />

      {/* Node label */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold fill-white select-none pointer-events-none"
      >
        {node.label || node.id}
      </text>

      {/* Distance label */}
      {distance !== undefined && distance !== Infinity && (
        <text
          x={node.x}
          y={node.y + radius + 14}
          textAnchor="middle"
          className="text-xs font-medium fill-slate-600 select-none pointer-events-none"
        >
          d={distance}
        </text>
      )}

      {/* Infinity symbol for unreached nodes */}
      {distance === Infinity && state !== 'unvisited' && (
        <text
          x={node.x}
          y={node.y + radius + 14}
          textAnchor="middle"
          className="text-xs font-medium fill-slate-400 select-none pointer-events-none"
        >
          d=∞
        </text>
      )}
    </g>
  );
}
