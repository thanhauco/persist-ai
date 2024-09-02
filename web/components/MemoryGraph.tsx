'use client';

import { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function MemoryGraph() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [mounted, setMounted] = useState(false);
  const graphRef = useRef<any>();

  useEffect(() => {
    setMounted(true);
    // Mock data for MVP visual if API not ready
    // In real implementation, fetch from /api/memories/graph
    const mockNodes = Array.from({ length: 20 }, (_, i) => ({ id: `node${i}`, name: `Memory ${i}`, val: 1 }));
    const mockLinks = Array.from({ length: 30 }, () => ({
        source: `node${Math.floor(Math.random() * 20)}`,
        target: `node${Math.floor(Math.random() * 20)}`
    }));
    
    setData({ nodes: mockNodes as any, links: mockLinks as any });
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[600px] border border-gray-700 rounded-lg overflow-hidden bg-black/50 backdrop-blur-md">
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        nodeLabel="name"
        backgroundColor="rgba(0,0,0,0)"
        nodeColor={() => '#4ade80'}
        linkColor={() => '#ffffff33'}
      />
    </div>
  );
}
