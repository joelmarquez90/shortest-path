'use client';

import React from 'react';
import { GraphNode, GraphEdge, EdgeState, EDGE_COLORS } from '@/types';

interface EdgeComponentProps {
  edge: GraphEdge;
  sourceNode: GraphNode;
  targetNode: GraphNode;
  state: EdgeState;
  directed?: boolean;
}

export function Edge({
  edge,
  sourceNode,
  targetNode,
  state,
  directed = true,
}: EdgeComponentProps) {
  const color = EDGE_COLORS[state];

  // Calculate edge positions (offset from node centers)
  const dx = targetNode.x - sourceNode.x;
  const dy = targetNode.y - sourceNode.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return null;

  // Normalize direction
  const nx = dx / length;
  const ny = dy / length;

  // Offset from node centers (account for node radius)
  const sourceRadius = 24;
  const targetRadius = 24;
  const arrowSize = directed ? 10 : 0;

  const x1 = sourceNode.x + nx * sourceRadius;
  const y1 = sourceNode.y + ny * sourceRadius;
  const x2 = targetNode.x - nx * (targetRadius + arrowSize);
  const y2 = targetNode.y - ny * (targetRadius + arrowSize);

  // Midpoint for weight label
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Offset weight label perpendicular to edge
  const perpX = -ny * 15;
  const perpY = nx * 15;

  // Arrow head points
  const arrowAngle = Math.PI / 6;
  const ax1 = x2 - arrowSize * Math.cos(Math.atan2(dy, dx) - arrowAngle);
  const ay1 = y2 - arrowSize * Math.sin(Math.atan2(dy, dx) - arrowAngle);
  const ax2 = x2 - arrowSize * Math.cos(Math.atan2(dy, dx) + arrowAngle);
  const ay2 = y2 - arrowSize * Math.sin(Math.atan2(dy, dx) + arrowAngle);

  const strokeWidth = state === 'shortest-path' ? 3 : state === 'relaxing' ? 3 : 2;

  return (
    <g className="transition-colors duration-300">
      {/* Edge line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        className={state === 'relaxing' ? 'animate-pulse' : ''}
      />

      {/* Arrow head for directed graphs */}
      {directed && (
        <polygon
          points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`}
          fill={color}
        />
      )}

      {/* Weight label background */}
      <rect
        x={mx + perpX - 12}
        y={my + perpY - 10}
        width={24}
        height={20}
        fill="white"
        rx={4}
        opacity={0.9}
      />

      {/* Weight label */}
      <text
        x={mx + perpX}
        y={my + perpY}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold fill-slate-700 select-none pointer-events-none"
      >
        {edge.weight}
      </text>
    </g>
  );
}
