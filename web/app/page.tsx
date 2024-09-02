'use client';

import dynamic from 'next/dynamic';

// Dynamic import for NoSSR to avoid canvas issues
const MemoryGraph = dynamic(() => import('../components/MemoryGraph'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white/5 p-6 rounded-2xl backdrop-blur-xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              PersistAI Dashboard
            </h1>
            <p className="text-gray-400">Cognitive Layer Visualization</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <span className="block text-2xl font-bold">1,024</span>
              <span className="text-xs text-gray-500">Memories</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold">42</span>
              <span className="text-xs text-gray-500">Links</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Graph View */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Knowledge Graph
            </h2>
            <MemoryGraph />
          </div>

          {/* Sidebar / Recent Memories */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-200">Recent Insights</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-sm text-green-400 mb-1">Factual Memory</div>
                  <p className="text-gray-300 text-sm">
                    User mentioned a preference for Python over JavaScript in backend tasks.
                  </p>
                  <div className="mt-2 text-xs text-gray-600 flex justify-between">
                    <span>Just now</span>
                    <span>100% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
