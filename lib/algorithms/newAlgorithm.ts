import {
  Graph,
  GraphEdge,
  AlgorithmStep,
  AlgorithmGenerator,
  NodeState,
  EdgeState,
} from '@/types';

// Pseudocode for the simplified BMSSP algorithm
export const bmsspPseudocode = [
  'function BMSSP(level, bound B, frontier S):',
  '  if level = 0:',
  '    return BaseCase(B, S)  // Mini-Dijkstra',
  '  ',
  '  P, W ← FindPivots(B, S)  // Reduce frontier',
  '  D ← initialize with pivots P',
  '  U ← ∅',
  '  ',
  '  while D not empty and |U| < threshold:',
  '    S_i, B_i ← Pull smallest from D',
  '    B\'_i, U_i ← BMSSP(level-1, B_i, S_i)',
  '    U ← U ∪ U_i',
  '    ',
  '    for each edge (u,v), u ∈ U_i:',
  '      relax edge and update D',
  '  ',
  '  return B\', U',
  '',
  'function FindPivots(B, S):',
  '  W ← S',
  '  for i ← 1 to k:          // k relaxation steps',
  '    relax all edges from W_{i-1}',
  '    W_i ← newly reached vertices',
  '    W ← W ∪ W_i',
  '  ',
  '  // Pivots = roots of large subtrees (≥k vertices)',
  '  P ← {u ∈ S : subtree(u) ≥ k}',
  '  return P, W',
];

// Get adjacency list from graph
function getAdjacencyList(graph: Graph): Map<string, GraphEdge[]> {
  const adj = new Map<string, GraphEdge[]>();
  for (const node of graph.nodes) {
    adj.set(node.id, []);
  }
  for (const edge of graph.edges) {
    adj.get(edge.source)?.push(edge);
    if (!graph.directed) {
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

// Create step helper
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

/**
 * Simplified BMSSP Algorithm
 *
 * This is a pedagogical implementation that captures the key ideas:
 * 1. FindPivots: Run k relaxation steps to identify "pivot" vertices
 * 2. Frontier reduction: Only keep pivots that root large subtrees
 * 3. Divide-and-conquer: Recursively solve smaller subproblems
 *
 * The actual paper's algorithm is more complex with:
 * - Block-based linked list data structure
 * - Careful handling of partial vs successful executions
 * - Parameters k = log^(1/3)(n) and t = log^(2/3)(n)
 *
 * For visualization, we use simplified parameters and show the concepts.
 */
export function* bmsspAlgorithm(graph: Graph, sourceId: string): AlgorithmGenerator {
  const adj = getAdjacencyList(graph);
  const n = graph.nodes.length;

  // Simplified parameters (in the paper: k = log^(1/3)(n), t = log^(2/3)(n))
  const k = Math.max(2, Math.ceil(Math.pow(Math.log2(n + 1), 1/3)));

  const distances = new Map<string, number>();
  const predecessors = new Map<string, string | null>();
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();

  let comparisons = 0;
  let relaxations = 0;

  // Initialize
  for (const node of graph.nodes) {
    distances.set(node.id, node.id === sourceId ? 0 : Infinity);
    predecessors.set(node.id, null);
    nodeStates.set(node.id, 'unvisited');
  }
  for (const edge of graph.edges) {
    edgeStates.set(edge.id, 'default');
  }

  nodeStates.set(sourceId, 'frontier');

  yield createStep(
    'init',
    `Inicialización BMSSP: source=${sourceId}, k=${k} pasos de relajación`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    [sourceId],
    0,
    { comparisons, relaxations, level: 0 }
  );

  // ===== FIND PIVOTS PHASE =====
  // This is the key innovation: run k relaxation steps to identify pivots

  yield createStep(
    'find-pivots-start',
    `FindPivots: Ejecutar ${k} pasos de relajación desde el frontier`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    [sourceId],
    18,
    { comparisons, relaxations }
  );

  // Track which nodes we visit in k steps
  let currentWave = new Set<string>([sourceId]);
  const allVisited = new Set<string>([sourceId]);
  const subtreeSizes = new Map<string, number>();
  subtreeSizes.set(sourceId, 1);

  // k relaxation steps (Bellman-Ford style)
  for (let step = 1; step <= k; step++) {
    const nextWave = new Set<string>();

    yield createStep(
      'relax-step',
      `FindPivots paso ${step}/${k}: Relajando desde ${currentWave.size} nodos`,
      nodeStates,
      edgeStates,
      distances,
      predecessors,
      Array.from(currentWave),
      20,
      { comparisons, relaxations, frontierSet: Array.from(currentWave) }
    );

    for (const u of currentWave) {
      const neighbors = adj.get(u) || [];

      for (const edge of neighbors) {
        const v = edge.target;
        const alt = distances.get(u)! + edge.weight;
        comparisons++;

        if (alt < distances.get(v)!) {
          relaxations++;
          distances.set(v, alt);
          predecessors.set(v, u);

          edgeStates.set(edge.id, 'relaxed');
          nodeStates.set(v, 'frontier');

          if (!allVisited.has(v)) {
            nextWave.add(v);
            allVisited.add(v);

            // Update subtree sizes
            let current = v;
            while (current !== sourceId && predecessors.get(current) !== null) {
              const parent = predecessors.get(current)!;
              subtreeSizes.set(parent, (subtreeSizes.get(parent) || 0) + 1);
              current = parent;
            }
            subtreeSizes.set(v, 1);
          }
        }
      }
    }

    if (nextWave.size > 0) {
      yield createStep(
        'wave-complete',
        `Paso ${step} completado: ${nextWave.size} nuevos nodos alcanzados`,
        nodeStates,
        edgeStates,
        distances,
        predecessors,
        Array.from(nextWave),
        22,
        { comparisons, relaxations }
      );
    }

    currentWave = nextWave;
    if (currentWave.size === 0) break;
  }

  // ===== IDENTIFY PIVOTS =====
  // Pivots are roots of subtrees with >= k vertices
  const pivots: string[] = [];

  for (const nodeId of allVisited) {
    const subtreeSize = subtreeSizes.get(nodeId) || 0;
    if (subtreeSize >= k || nodeId === sourceId) {
      pivots.push(nodeId);
      nodeStates.set(nodeId, 'pivot');
    }
  }

  yield createStep(
    'pivots-identified',
    `Pivots identificados: ${pivots.length} nodos con subtree ≥ ${k} (${pivots.join(', ')})`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    pivots,
    25,
    { comparisons, relaxations, pivots }
  );

  // ===== KEY INSIGHT =====
  // The frontier is reduced from |S| to |U|/k pivots
  // This is what breaks the sorting barrier!

  yield createStep(
    'frontier-reduction',
    `¡Reducción del frontier! De ${allVisited.size} nodos a ${pivots.length} pivots (factor ~${k})`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    pivots,
    5,
    { comparisons, relaxations, pivots, frontierSet: Array.from(allVisited) }
  );

  // ===== CONTINUE WITH REMAINING VERTICES =====
  // Now we do a simplified version: just complete with Dijkstra-style from pivots
  // (The real algorithm would recurse with BMSSP on level-1)

  const completed = new Set<string>(allVisited);
  const pendingQueue: { nodeId: string; dist: number }[] = [];

  // Add non-visited neighbors of completed nodes to queue
  for (const nodeId of completed) {
    nodeStates.set(nodeId, 'complete');
    const neighbors = adj.get(nodeId) || [];

    for (const edge of neighbors) {
      const v = edge.target;
      if (!completed.has(v)) {
        const alt = distances.get(nodeId)! + edge.weight;
        if (alt < distances.get(v)!) {
          distances.set(v, alt);
          predecessors.set(v, nodeId);
          pendingQueue.push({ nodeId: v, dist: alt });
          nodeStates.set(v, 'frontier');
        }
      }
    }
  }

  // Sort queue (in real algorithm, this would be handled by the data structure)
  pendingQueue.sort((a, b) => a.dist - b.dist);

  // Process remaining vertices
  while (pendingQueue.length > 0) {
    const { nodeId: u, dist } = pendingQueue.shift()!;

    if (completed.has(u)) continue;

    nodeStates.set(u, 'current');

    yield createStep(
      'process-remaining',
      `Procesando nodo restante: ${u} con dist=${dist}`,
      nodeStates,
      edgeStates,
      distances,
      predecessors,
      pendingQueue.map(p => p.nodeId),
      10,
      { currentNode: u, comparisons, relaxations }
    );

    completed.add(u);

    const neighbors = adj.get(u) || [];
    for (const edge of neighbors) {
      const v = edge.target;
      if (completed.has(v)) continue;

      const alt = distances.get(u)! + edge.weight;
      comparisons++;

      if (alt < distances.get(v)!) {
        relaxations++;
        distances.set(v, alt);
        predecessors.set(v, u);
        edgeStates.set(edge.id, 'relaxed');
        nodeStates.set(v, 'frontier');

        // Add to queue (remove old entry if exists)
        const existingIdx = pendingQueue.findIndex(p => p.nodeId === v);
        if (existingIdx >= 0) {
          pendingQueue.splice(existingIdx, 1);
        }
        pendingQueue.push({ nodeId: v, dist: alt });
        pendingQueue.sort((a, b) => a.dist - b.dist);
      }
    }

    nodeStates.set(u, 'complete');
  }

  // Mark all remaining nodes as complete
  for (const node of graph.nodes) {
    if (!completed.has(node.id)) {
      nodeStates.set(node.id, 'complete');
    }
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

  return createStep(
    'done',
    `BMSSP completado. Comparaciones: ${comparisons}, Relajaciones: ${relaxations}. Pivots usados: ${pivots.length}`,
    nodeStates,
    edgeStates,
    distances,
    predecessors,
    [],
    16,
    { comparisons, relaxations, pivots }
  );
}

// Explanation text for the algorithm
export const algorithmExplanation = {
  title: 'Algoritmo BMSSP - Breaking the Sorting Barrier',
  complexity: 'O(m log^(2/3) n)',
  keyIdeas: [
    {
      title: 'El problema con Dijkstra',
      description: 'Dijkstra mantiene un "frontier" que puede tener Θ(n) vértices. Ordenar constantemente estos vértices lleva a Ω(n log n) operaciones.',
    },
    {
      title: 'FindPivots - Reducción del Frontier',
      description: 'Ejecutamos k pasos de relajación (estilo Bellman-Ford). Los "pivots" son raíces de subárboles con ≥k vértices. Solo hay |U|/k pivots.',
    },
    {
      title: 'Divide and Conquer',
      description: 'En vez de ordenar todo el frontier, particionamos recursivamente. Cada nivel reduce el problema en factor 2^t.',
    },
    {
      title: 'La ganancia',
      description: 'El trabajo por vértice se reduce de log(n) a log(n)/log^Ω(1)(n), rompiendo la barrera del sorting.',
    },
  ],
  comparison: {
    dijkstra: {
      complexity: 'O(m + n log n)',
      heapOperations: 'n extracciones, m decrease-keys',
      bottleneck: 'Ordenamiento implícito de n vértices',
    },
    bmssp: {
      complexity: 'O(m log^(2/3) n)',
      pivotReduction: 'Solo |U|/k pivots por nivel',
      levels: 'O(log n / t) niveles de recursión',
    },
  },
};
