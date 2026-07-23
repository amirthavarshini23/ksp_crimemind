import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Network, X, User, Phone, Landmark, Car, FileText, Info } from 'lucide-react';
import { GraphNode, GraphEdge } from '../types.ts';

interface GraphViewerProps {
  elements: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  onSelectNode?: (nodeData: any) => void;
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ elements, onSelectNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert elements to Cytoscape format
    const cyNodes = elements.nodes.map(n => ({
      data: {
        id: n.data.id,
        label: n.data.label,
        type: n.data.type,
        details: n.data.details || {}
      }
    }));

    const cyEdges = elements.edges.map(e => ({
      data: {
        id: e.data.id,
        source: e.data.source,
        target: e.data.target,
        label: e.data.label
      }
    }));

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...cyNodes, ...cyEdges],
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#E5E7EB',
            'font-size': '10px',
            'font-family': 'sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'background-color': '#4B5563',
            'width': '24px',
            'height': '24px',
            'overlay-opacity': 0,
            'border-width': '2px',
            'border-color': '#1F2937'
          }
        },
        {
          selector: 'node[type="Folder"]',
          style: {
            'background-color': '#3B82F6',
            'border-color': '#60A5FA',
            'width': '32px',
            'height': '32px',
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="FIR"]',
          style: {
            'background-color': '#F59E0B',
            'border-color': '#FBBF24',
            'width': '28px',
            'height': '28px',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type="Accused"]',
          style: {
            'background-color': '#EF4444',
            'border-color': '#F87171',
            'width': '28px',
            'height': '28px',
            'shape': 'diamond'
          }
        },
        {
          selector: 'node[type="Phone"]',
          style: {
            'background-color': '#8B5CF6',
            'border-color': '#A78BFA',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type="BankAccount"]',
          style: {
            'background-color': '#10B981',
            'border-color': '#34D399',
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="Vehicle"]',
          style: {
            'background-color': '#6B7280',
            'border-color': '#9CA3AF',
            'shape': 'rectangle'
          }
        },
        {
          selector: 'node[type="Victim"]',
          style: {
            'background-color': '#EC4899',
            'border-color': '#F472B6',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'font-size': '8px',
            'font-family': 'sans-serif',
            'color': '#9CA3AF',
            'width': 1.5,
            'line-color': '#374151',
            'target-arrow-color': '#374151',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'text-background-opacity': 0.7,
            'text-background-color': '#0B132B',
            'text-background-padding': '2px',
            'text-background-shape': 'round-rectangle'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': '3px',
            'border-color': '#3B82F6',
            'background-blacken': 0.2
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        fit: true,
        padding: 40,
        nodeRepulsion: () => 8000,
      } as any
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const data = node.data();
      setSelectedNode(data);
      if (onSelectNode) onSelectNode(data);
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    cyRef.current = cy;

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [elements]);

  const fitGraph = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.layout({ name: 'cose', animate: true } as any).run();
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Accused': return <User className="h-5 w-5 text-red-400" />;
      case 'Phone': return <Phone className="h-5 w-5 text-purple-400" />;
      case 'BankAccount': return <Landmark className="h-5 w-5 text-emerald-400" />;
      case 'Vehicle': return <Car className="h-5 w-5 text-slate-400" />;
      case 'FIR': return <FileText className="h-5 w-5 text-amber-400" />;
      default: return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="relative w-full h-full border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex">
      {/* Network Container */}
      <div ref={containerRef} className="flex-1 h-full z-10" />

      {/* Control Buttons */}
      <button 
        onClick={fitGraph}
        className="absolute top-4 left-4 z-20 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white flex items-center space-x-1.5 transition"
      >
        <Network className="h-3.5 w-3.5" />
        <span>Fit Graph</span>
      </button>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="w-80 border-l border-slate-800 bg-slate-900/95 backdrop-blur z-20 flex flex-col p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              {getIconForType(selectedNode.type)}
              <h3 className="font-semibold text-sm text-white">Node Properties</h3>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Entity Label</span>
              <p className="text-white font-semibold text-sm mt-0.5">{selectedNode.label}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Classification</span>
              <p className="mt-0.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  selectedNode.type === 'Accused' ? 'bg-red-500/10 text-red-400' :
                  selectedNode.type === 'FIR' ? 'bg-amber-500/10 text-amber-400' :
                  selectedNode.type === 'BankAccount' ? 'bg-emerald-500/10 text-emerald-400' :
                  selectedNode.type === 'Phone' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {selectedNode.type}
                </span>
              </p>
            </div>

            {/* Custom attributes based on Node type */}
            {selectedNode.type === 'Accused' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Age</span>
                  <p className="text-slate-350 font-medium">{selectedNode.details.age || 'N/A'} years</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Arrest Status</span>
                  <p className="text-slate-350 font-medium">{selectedNode.details.status || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Repeat Offender</span>
                  <p className="text-slate-350 font-medium">{selectedNode.details.repeater ? 'YES (High Risk)' : 'No prior KSP records'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Primary Phone</span>
                  <p className="text-slate-300 font-mono">{selectedNode.details.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Linked Bank Account</span>
                  <p className="text-slate-300 font-mono">{selectedNode.details.bank || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Vehicle Plate</span>
                  <p className="text-slate-300 font-mono">{selectedNode.details.vehicle || 'N/A'}</p>
                </div>
              </div>
            )}

            {selectedNode.type === 'FIR' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Crime Type</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.crime_type}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Jurisdiction</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.district}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Status</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.status}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Modus Operandi</span>
                  <p className="text-slate-300 italic leading-relaxed">{selectedNode.details.modus_operandi}</p>
                </div>
              </div>
            )}

            {selectedNode.type === 'BankAccount' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Holder</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.owner}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Institution</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.bank}</p>
                </div>
              </div>
            )}

            {selectedNode.type === 'Phone' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Owner Line</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.owner}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Operator</span>
                  <p className="text-slate-300 font-medium">{selectedNode.details.carrier}</p>
                </div>
              </div>
            )}

            {selectedNode.type === 'Victim' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Victim Statement</span>
                  <p className="text-slate-300 italic leading-relaxed">"{selectedNode.details.statement}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default GraphViewer;
