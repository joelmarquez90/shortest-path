import { Graph } from '@/types';

// Simple graph for tutorials (5 nodes)
export const simpleGraph: Graph = {
  directed: true,
  nodes: [
    { id: 'A', x: 100, y: 200, label: 'A' },
    { id: 'B', x: 250, y: 100, label: 'B' },
    { id: 'C', x: 250, y: 300, label: 'C' },
    { id: 'D', x: 400, y: 100, label: 'D' },
    { id: 'E', x: 400, y: 300, label: 'E' },
  ],
  edges: [
    { id: 'e1', source: 'A', target: 'B', weight: 4 },
    { id: 'e2', source: 'A', target: 'C', weight: 2 },
    { id: 'e3', source: 'B', target: 'C', weight: 1 },
    { id: 'e4', source: 'B', target: 'D', weight: 5 },
    { id: 'e5', source: 'C', target: 'D', weight: 8 },
    { id: 'e6', source: 'C', target: 'E', weight: 10 },
    { id: 'e7', source: 'D', target: 'E', weight: 2 },
  ],
};

// Medium graph for demonstrations (10 nodes)
export const mediumGraph: Graph = {
  directed: true,
  nodes: [
    { id: 'S', x: 80, y: 250, label: 'S' },
    { id: 'A', x: 200, y: 150, label: 'A' },
    { id: 'B', x: 200, y: 350, label: 'B' },
    { id: 'C', x: 350, y: 100, label: 'C' },
    { id: 'D', x: 350, y: 250, label: 'D' },
    { id: 'E', x: 350, y: 400, label: 'E' },
    { id: 'F', x: 500, y: 150, label: 'F' },
    { id: 'G', x: 500, y: 350, label: 'G' },
    { id: 'H', x: 650, y: 200, label: 'H' },
    { id: 'T', x: 650, y: 300, label: 'T' },
  ],
  edges: [
    { id: 'e1', source: 'S', target: 'A', weight: 3 },
    { id: 'e2', source: 'S', target: 'B', weight: 5 },
    { id: 'e3', source: 'A', target: 'C', weight: 2 },
    { id: 'e4', source: 'A', target: 'D', weight: 4 },
    { id: 'e5', source: 'B', target: 'D', weight: 2 },
    { id: 'e6', source: 'B', target: 'E', weight: 6 },
    { id: 'e7', source: 'C', target: 'F', weight: 3 },
    { id: 'e8', source: 'D', target: 'C', weight: 1 },
    { id: 'e9', source: 'D', target: 'F', weight: 5 },
    { id: 'e10', source: 'D', target: 'G', weight: 4 },
    { id: 'e11', source: 'E', target: 'G', weight: 2 },
    { id: 'e12', source: 'F', target: 'H', weight: 2 },
    { id: 'e13', source: 'G', target: 'T', weight: 3 },
    { id: 'e14', source: 'H', target: 'T', weight: 1 },
    { id: 'e15', source: 'F', target: 'T', weight: 6 },
  ],
};

// Larger sparse graph for complexity comparison
export const sparseGraph: Graph = {
  directed: true,
  nodes: [
    { id: '0', x: 100, y: 300, label: '0' },
    { id: '1', x: 200, y: 150, label: '1' },
    { id: '2', x: 200, y: 450, label: '2' },
    { id: '3', x: 350, y: 100, label: '3' },
    { id: '4', x: 350, y: 250, label: '4' },
    { id: '5', x: 350, y: 400, label: '5' },
    { id: '6', x: 350, y: 550, label: '6' },
    { id: '7', x: 500, y: 150, label: '7' },
    { id: '8', x: 500, y: 350, label: '8' },
    { id: '9', x: 500, y: 500, label: '9' },
    { id: '10', x: 650, y: 250, label: '10' },
    { id: '11', x: 650, y: 400, label: '11' },
    { id: '12', x: 800, y: 300, label: '12' },
  ],
  edges: [
    { id: 'e1', source: '0', target: '1', weight: 4 },
    { id: 'e2', source: '0', target: '2', weight: 3 },
    { id: 'e3', source: '1', target: '3', weight: 2 },
    { id: 'e4', source: '1', target: '4', weight: 5 },
    { id: 'e5', source: '2', target: '5', weight: 6 },
    { id: 'e6', source: '2', target: '6', weight: 4 },
    { id: 'e7', source: '3', target: '7', weight: 3 },
    { id: 'e8', source: '4', target: '7', weight: 2 },
    { id: 'e9', source: '4', target: '8', weight: 4 },
    { id: 'e10', source: '5', target: '8', weight: 2 },
    { id: 'e11', source: '5', target: '9', weight: 5 },
    { id: 'e12', source: '6', target: '9', weight: 3 },
    { id: 'e13', source: '7', target: '10', weight: 4 },
    { id: 'e14', source: '8', target: '10', weight: 3 },
    { id: 'e15', source: '8', target: '11', weight: 2 },
    { id: 'e16', source: '9', target: '11', weight: 4 },
    { id: 'e17', source: '10', target: '12', weight: 3 },
    { id: 'e18', source: '11', target: '12', weight: 2 },
  ],
};

export const graphExamples = {
  simple: { graph: simpleGraph, name: 'Grafo Simple (5 nodos)', source: 'A' },
  medium: { graph: mediumGraph, name: 'Grafo Medio (10 nodos)', source: 'S' },
  sparse: { graph: sparseGraph, name: 'Grafo Sparse (13 nodos)', source: '0' },
};
