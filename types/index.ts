// Graph Types
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

// Visual State Types
export type NodeState =
  | 'unvisited'
  | 'frontier'
  | 'current'
  | 'complete'
  | 'pivot'
  | 'in-frontier-set';

export type EdgeState =
  | 'default'
  | 'relaxing'
  | 'relaxed'
  | 'shortest-path';

// Algorithm Step Types
export interface AlgorithmStep {
  type: string;
  description: string;
  nodeStates: Map<string, NodeState>;
  edgeStates: Map<string, EdgeState>;
  distances: Map<string, number>;
  predecessors: Map<string, string | null>;
  frontier: string[];
  currentLine: number;
  metadata?: {
    currentNode?: string;
    relaxingEdge?: string;
    pivots?: string[];
    frontierSet?: string[];
    level?: number;
    bound?: number;
    comparisons?: number;
    relaxations?: number;
  };
}

// Algorithm Generator Type
export type AlgorithmGenerator = Generator<AlgorithmStep, AlgorithmStep, undefined>;

// Priority Queue Entry
export interface PQEntry {
  nodeId: string;
  distance: number;
}

// Algorithm Result
export interface AlgorithmResult {
  distances: Map<string, number>;
  predecessors: Map<string, string | null>;
  steps: AlgorithmStep[];
  totalComparisons: number;
  totalRelaxations: number;
}

// Color Palette
export const NODE_COLORS: Record<NodeState, string> = {
  unvisited: '#94a3b8',      // slate-400
  frontier: '#fbbf24',       // amber-400
  current: '#3b82f6',        // blue-500
  complete: '#22c55e',       // green-500
  pivot: '#a855f7',          // purple-500
  'in-frontier-set': '#f97316', // orange-500
};

export const EDGE_COLORS: Record<EdgeState, string> = {
  default: '#cbd5e1',        // slate-300
  relaxing: '#f97316',       // orange-500
  relaxed: '#60a5fa',        // blue-400
  'shortest-path': '#22c55e', // green-500
};
