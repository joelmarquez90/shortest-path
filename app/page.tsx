'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Visualización de Algoritmos de
          <span className="text-blue-600"> Camino Más Corto</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Explora de forma interactiva cómo funcionan Dijkstra y el nuevo algoritmo
          que rompe la barrera del sorting en grafos dirigidos.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dijkstra">
            <Button size="lg">
              Explorar Dijkstra
            </Button>
          </Link>
          <Link href="/new-algorithm">
            <Button variant="outline" size="lg">
              Ver Nuevo Algoritmo
            </Button>
          </Link>
        </div>
      </section>

      {/* Algorithm Cards */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Dijkstra Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Algoritmo de Dijkstra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600">
                El algoritmo clásico propuesto por Edsger Dijkstra en 1959.
                Encuentra el camino más corto desde un vértice fuente a todos
                los demás vértices en un grafo con pesos no negativos.
              </p>

              <div className="bg-slate-100 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Complejidad</h4>
                <p className="font-mono text-lg text-blue-600">O(m + n log n)</p>
                <p className="text-sm text-slate-500 mt-1">
                  Con Fibonacci Heap o Relaxed Heap
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900">Características:</h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>Usa una cola de prioridad (heap)</li>
                  <li>Procesa vértices en orden de distancia</li>
                  <li>Produce un ordenamiento implícito de vértices</li>
                  <li>Considerado óptimo por décadas</li>
                </ul>
              </div>

              <Link href="/dijkstra">
                <Button variant="outline" className="w-full mt-4">
                  Ver Visualización →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* New Algorithm Card */}
        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              Nuevo Algoritmo BMSSP
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                2025
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600">
                El primer algoritmo determinístico que rompe la barrera del sorting
                en grafos dirigidos. Presentado por Duan, Mao, Mao, Shu & Yin.
              </p>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Complejidad</h4>
                <p className="font-mono text-lg text-purple-600">O(m log<sup>2/3</sup> n)</p>
                <p className="text-sm text-slate-500 mt-1">
                  ¡Mejor que Dijkstra en grafos sparse!
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900">Ideas Clave:</h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>FindPivots</strong>: Reduce el frontier</li>
                  <li><strong>BMSSP</strong>: Divide and conquer recursivo</li>
                  <li>Combina Dijkstra + Bellman-Ford</li>
                  <li>Evita ordenar todos los vértices</li>
                </ul>
              </div>

              <Link href="/new-algorithm">
                <Button variant="outline" className="w-full mt-4 border-purple-300 text-purple-700 hover:bg-purple-50">
                  Ver Visualización →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Comparison Section */}
      <section className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          ¿Por qué es importante?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Rompe una Barrera</h3>
            <p className="text-sm text-slate-600">
              Por ~70 años se creía que O(n log n) era el límite inferior para SSSP.
              Este algoritmo demuestra lo contrario.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Mejor en Sparse</h3>
            <p className="text-sm text-slate-600">
              En grafos con m = O(n), la mejora es significativa:
              de O(n log n) a O(n log<sup>2/3</sup> n).
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Determinístico</h3>
            <p className="text-sm text-slate-600">
              A diferencia de resultados anteriores, este algoritmo es completamente
              determinístico (sin randomización).
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/compare">
            <Button size="lg">
              Comparar Algoritmos Side-by-Side →
            </Button>
          </Link>
        </div>
      </section>

      {/* Paper Reference */}
      <section className="bg-slate-100 rounded-xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">Referencia del Paper</h3>
        <p className="text-slate-700">
          Ran Duan, Jiayi Mao, Xiao Mao, Xinkai Shu, Longhui Yin. &quot;
          <em>Breaking the Sorting Barrier for Directed Single-Source Shortest Paths</em>&quot;.
          arXiv:2504.17033v2 [cs.DS], July 2025.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Instituciones: Tsinghua University, Stanford University, Max Planck Institute for Informatics.
        </p>
      </section>
    </div>
  );
}
