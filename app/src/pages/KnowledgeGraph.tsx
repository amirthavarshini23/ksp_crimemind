import React, { useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import { api } from '../services/api';
import { GraphViewer } from '../components/GraphViewer';
import { KnowledgeGraphResponse } from '../types.ts';

export const KnowledgeGraph: React.FC = () => {
  const [graphData, setGraphData] = useState<KnowledgeGraphResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        // Aggregate graph nodes for full network view
        const c1 = await api.getCaseDetail(1);
        const c2 = await api.getCaseDetail(2);

        // Combine nodes and edges
        const nodesMap = new Map();
        const edgesMap = new Map();

        [...c1.graph.nodes, ...c2.graph.nodes].forEach(n => {
          nodesMap.set(n.data.id, n);
        });
        [...c1.graph.edges, ...c2.graph.edges].forEach(e => {
          edgesMap.set(e.data.id, e);
        });

        setGraphData({
          nodes: Array.from(nodesMap.values()),
          edges: Array.from(edgesMap.values())
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  if (loading || !graphData) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading Relational Intelligence Map...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 p-6 flex flex-col space-y-4 h-full overflow-hidden select-none">
      {/* Title */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Dynamic Crime Knowledge Graph</h1>
          <p className="text-xs text-slate-400">
            Map relationships between accused individuals, phone registers, bank transactions, and active cases
          </p>
        </div>
        <div className="flex items-center space-x-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
          <Network className="h-4.5 w-4.5 text-blue-500" />
          <span>Active links visualizer</span>
        </div>
      </div>

      {/* Main Cytoscape canvas */}
      <div className="flex-1 min-h-0 relative">
        <GraphViewer elements={graphData} />
      </div>
    </div>
  );
};
export default KnowledgeGraph;
