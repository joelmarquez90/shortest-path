import {
  Graph,
  GraphEdge,
  AlgorithmStep,
  AlgorithmGenerator,
  NodeState,
  EdgeState,
} from '@/types';

// Pseudocode for Dijkstra's algorithm
export const dijkstraPseudocode = [
  'function Dijkstra(G, source):',
  '  for each vertex v in G:',
  '    dist[v] ← ∞',
  '    prev[v] ← null',
  '  dist[source] ← 0',
  '  Q ← priority queue with all vertices',
  '  ',
  '  while Q is not empty:',
  '    u ← vertex in Q with min dist[u]',
  '    remove u from Q',
  '    ',
  '    for each neighbor v of u:',
  '      alt ← dist[u] + weight(u, v)',
  '      if alt < dist[v]:',
  '        dist[v] ← alt',
  '        prev[v] ← u',
  '        decrease-key(Q, v, alt)',
  '  ',
  '  return dist, prev',
];

// Simple MinHeap for priority queue
class MinHeap {
  private heap: { nodeId: string; distance: number }[] = [];
  private positions: Map<string, number> = new Map();

  insert(nodeId: string, distance: number): void {
    this.heap.push({ nodeId, distance });
    const idx = this.heap.length - 1;
    this.positions.set(nodeId, idx);
    this.bubbleUp(idx);
  }

  extractMin(): { nodeId: string; distance: number } | null {
    if (this.heap.length === 0) return null;

    const min = this.heap[0];
    const last = this.heap.pop()!;
    this.positions.delete(min.nodeId);

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.positions.set(last.nodeId, 0);
      this.bubbleDown(0);
    }

    return min;
  }

  decreaseKey(nodeId: string, newDistance: number): void {
    const idx = this.positions.get(nodeId);
    if (idx === undefined) return;

    if (newDistance < this.heap[idx].distance) {
      this.heap[idx].distance = newDistance;
      this.bubbleUp(idx);
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  contains(nodeId: string): boolean {
    return this.positions.has(nodeId);
  }

  getQueue(): { nodeId: string; distance: number }[] {
    return [...this.heap].sort((a, b) => a.distance - b.distance);
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[parentIdx].distance <= this.heap[idx].distance) break;

      this.swap(idx, parentIdx);
      idx = parentIdx;
    }
  }

  private bubbleDown(idx: number): void {
    const length = this.heap.length;

    while (true) {
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      let smallest = idx;

      if (leftIdx < length && this.heap[leftIdx].distance < this.heap[smallest].distance) {
        smallest = leftIdx;
      }
      if (rightIdx < length && this.heap[rightIdx].distance < this.heap[smallest].distance) {
        smallest = rightIdx;
      }

      if (smallest === idx) break;

      this.swap(idx, smallest);
      idx = smallest;
    }
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    this.positions.set(this.heap[i].nodeId, i);
    this.positions.set(this.heap[j].nodeId, j);
  }
}

// Get adjacency list from graph
function getAdjacencyList(graph: Graph): Map<string, GraphEdge[]> {
  const adj = new Map<string, GraphEdge[]>();

  for (const node of graph.nodes) {
    adj.set(node.id, []);
  }

  for (const edge of graph.edges) {
    adj.get(edge.source)?.push(edge);
    if (!graph.directed) {
      // For undirected graphs, add reverse edge
      adj.get(edge.target)?.push({
        ...edge,
        id: edge.id + '_rev',
        source: edge.target,
        target: edge.source,
      });
    }
  }

  return adj;
}

// Create a step object
function createStep(
  type: string,
  description: string,
  nodeStates: Map<string, NodeState>,
  edgeStates: Map<string, EdgeState>,
  distances: Map<string, number>,
  predecessors: Map<string, string | null>,
  frontier: string[],
  currentLine: number,
  metadata?: AlgorithmStep['metadata']
): AlgorithmStep {
  return {
    type,
    description,
    nodeStates: new Map(nodeStates),
    edgeStates: new Map(edgeStates),
    distances: new Map(distances),
    predecessors: new Map(predecessors),
    frontier: [...frontier],
    currentLine,
    metadata,
  };
}

// Dijkstra's algorithm as a generator
export function* dijkstra(graph: Graph, sourceId: string): AlgorithmGenerator {
  const adj = getAdjacencyList(graph);
  const distances = new Map<string, number>();
  const predecessors = new Map<string, string | null>();
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();
  const pq = new MinHeap();

  let comparisons = 0;
  let relaxations = 0;

  // Initialize
  for (const node of graph.nodes) {
    distances.set(node.id, node.id === sourceId ? 0 : Infinity);
    predecessors.set(node.id, null);
    nodeStates.set(node.id, node.id === sourceId ? 'frontier' : 'unvisited');
    pq.insert(node.id, node.id === sourceId ? 0 : Infinity);
  }

  for (const edge of graph.edges) {
    edgeStates.set(edge.id, 'default');
  }

  // Initial step
  yield createStep(
    'init',
    `Inicialización: dist[${sourceId}] = 0, todas las demás = ∞`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    pq.getQueue().filter(e => e.distance < Infinity).map(e => e.nodeId),
    5,
    { comparisons, relaxations }
  );

  // Main loop
  while (!pq.isEmpty()) {
    const current = pq.extractMin();
    if (!current || current.distance === Infinity) break;

    const u = current.nodeId;

    // Mark as current
    nodeStates.set(u, 'current');

    yield createStep(
      'extract-min',
      `Extraer mínimo de la cola: u = ${u} con dist[${u}] = ${current.distance}`,
      nodeStates,
      edgeStates,
      distances,
      predecessors,
      pq.getQueue().filter(e => e.distance < Infinity).map(e => e.nodeId),
      8,
      { currentNode: u, comparisons, relaxations }
    );

    // Process neighbors
    const neighbors = adj.get(u) || [];

    for (const edge of neighbors) {
      const v = edge.target;

      if (!pq.contains(v)) continue; // Already processed

      const alt = distances.get(u)! + edge.weight;
      comparisons++;

      // Mark edge as being relaxed
      edgeStates.set(edge.id, 'relaxing');

      yield createStep(
        'examine-edge',
        `Examinando arista (${u}, ${v}): alt = dist[${u}] + w = ${distances.get(u)} + ${edge.weight} = ${alt}`,
        nodeStates,
        edgeStates,
        distances,
        predecessors,
        pq.getQueue().filter(e => e.distance < Infinity).map(e => e.nodeId),
        12,
        { currentNode: u, relaxingEdge: edge.id, comparisons, relaxations }
      );

      const currentDist = distances.get(v)!;

      if (alt < currentDist) {
        relaxations++;
        distances.set(v, alt);
        predecessors.set(v, u);
        pq.decreaseKey(v, alt);

        // Mark edge as relaxed
        edgeStates.set(edge.id, 'relaxed');
        nodeStates.set(v, 'frontier');

        yield createStep(
          'relax',
          `Relajación exitosa: dist[${v}] = ${alt} (antes era ${currentDist === Infinity ? '∞' : currentDist})`,
          nodeStates,
          edgeStates,
          distances,
          predecessors,
          pq.getQueue().filter(e => e.distance < Infinity).map(e => e.nodeId),
          15,
          { currentNode: u, relaxingEdge: edge.id, comparisons, relaxations }
        );
      } else {
        // Edge not relaxed
        edgeStates.set(edge.id, 'default');

        yield createStep(
          'no-relax',
          `Sin mejora: alt = ${alt} ≥ dist[${v}] = ${currentDist}`,
          nodeStates,
          edgeStates,
          distances,
          predecessors,
          pq.getQueue().filter(e => e.distance < Infinity).map(e => e.nodeId),
          13,
          { currentNode: u, comparisons, relaxations }
        );
      }
    }

    // Mark as complete
    nodeStates.set(u, 'complete');

    yield createStep(
      'complete-node',
      `Nodo ${u} completado con distancia final ${distances.get(u)}`,
      nodeStates,
      edgeStates,
      distances,
      predecessors,
      pq.getQueue().filter(e => e.distance < Infinity).map(e => e.nodeId),
      10,
      { currentNode: u, comparisons, relaxations }
    );
  }

  // Mark shortest path edges
  for (const [nodeId, pred] of predecessors) {
    if (pred !== null) {
      const edge = graph.edges.find(
        e => (e.source === pred && e.target === nodeId) ||
             (!graph.directed && e.source === nodeId && e.target === pred)
      );
      if (edge) {
        edgeStates.set(edge.id, 'shortest-path');
      }
    }
  }

  // Final step
  return createStep(
    'done',
    `Algoritmo completado. Total: ${comparisons} comparaciones, ${relaxations} relajaciones.`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    [],
    18,
    { comparisons, relaxations }
  );
}
