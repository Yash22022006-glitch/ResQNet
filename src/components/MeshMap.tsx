import { useEffect, useRef, useState, FormEvent } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { 
  Maximize2, 
  Minimize2, 
  Layers, 
  Navigation, 
  Radio, 
  Users, 
  ShieldCheck,
  Search,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  type: 'survivor' | 'volunteer' | 'safezone' | 'gateway';
  status: 'active' | 'sos' | 'offline';
  label: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  strength: number;
}

export default function MeshMap({ showNotification }: { showNotification: (msg: string) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filter, setFilter] = useState<'all' | 'survivor' | 'volunteer' | 'safezone'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [nodesData, setNodesData] = useState<Node[]>([]);

  const allNodes: Node[] = [
    { id: '1', type: 'gateway', status: 'active', label: 'Main Hub', x: 480, y: 480, fx: 480, fy: 480 },
    { id: '2', type: 'survivor', status: 'sos', label: 'Survivor 1', x: 240, y: 240, fx: 240, fy: 240 },
    { id: '3', type: 'survivor', status: 'active', label: 'Survivor 2', x: 720, y: 240, fx: 720, fy: 240 },
    { id: '4', type: 'volunteer', status: 'active', label: 'Volunteer A', x: 300, y: 720, fx: 300, fy: 720 },
    { id: '5', type: 'volunteer', status: 'active', label: 'Volunteer B', x: 660, y: 720, fx: 660, fy: 720 },
    { id: '6', type: 'safezone', status: 'active', label: 'Safe Zone 1', x: 120, y: 480, fx: 120, fy: 480 },
    { id: '7', type: 'safezone', status: 'active', label: 'Safe Zone 2', x: 840, y: 480, fx: 840, fy: 480 },
    { id: '8', type: 'survivor', status: 'active', label: 'Survivor 3', x: 100, y: 100, fx: 100, fy: 100 },
    { id: '9', type: 'survivor', status: 'sos', label: 'Survivor 4', x: 800, y: 100, fx: 800, fy: 100 },
    { id: '10', type: 'volunteer', status: 'active', label: 'Volunteer C', x: 100, y: 800, fx: 100, fy: 800 },
    { id: '11', type: 'volunteer', status: 'active', label: 'Volunteer D', x: 800, y: 800, fx: 800, fy: 800 },
    { id: '12', type: 'survivor', status: 'active', label: 'Survivor 5', x: 400, y: 200, fx: 400, fy: 200 },
    { id: '13', type: 'survivor', status: 'active', label: 'Survivor 6', x: 600, y: 200, fx: 600, fy: 200 },
    { id: '14', type: 'volunteer', status: 'active', label: 'Volunteer E', x: 400, y: 700, fx: 400, fy: 700 },
    { id: '15', type: 'volunteer', status: 'active', label: 'Volunteer F', x: 600, y: 700, fx: 600, fy: 700 },
    { id: '16', type: 'survivor', status: 'sos', label: 'Survivor 7', x: 200, y: 500, fx: 200, fy: 500 },
    { id: '17', type: 'survivor', status: 'active', label: 'Survivor 8', x: 700, y: 500, fx: 700, fy: 500 },
    { id: '18', type: 'safezone', status: 'active', label: 'Safe Zone 3', x: 480, y: 100, fx: 480, fy: 100 },
    { id: '19', type: 'safezone', status: 'active', label: 'Safe Zone 4', x: 480, y: 800, fx: 480, fy: 800 },
    { id: '20', type: 'survivor', status: 'active', label: 'Survivor 9', x: 300, y: 300, fx: 300, fy: 300 },
    { id: '21', type: 'survivor', status: 'active', label: 'Survivor 10', x: 600, y: 300, fx: 600, fy: 300 },
    { id: '22', type: 'volunteer', status: 'active', label: 'Volunteer G', x: 300, y: 600, fx: 300, fy: 600 },
    { id: '23', type: 'volunteer', status: 'active', label: 'Volunteer H', x: 600, y: 600, fx: 600, fy: 600 },
    { id: '24', type: 'survivor', status: 'sos', label: 'Survivor 11', x: 50, y: 300, fx: 50, fy: 300 },
    { id: '25', type: 'survivor', status: 'active', label: 'Survivor 12', x: 900, y: 300, fx: 900, fy: 300 },
  ];

  const allLinks: Link[] = [
    { source: '1', target: '2', strength: 0.8 },
    { source: '1', target: '3', strength: 0.9 },
    { source: '1', target: '4', strength: 0.7 },
    { source: '1', target: '5', strength: 0.8 },
    { source: '1', target: '6', strength: 1.0 },
    { source: '1', target: '7', strength: 1.0 },
    { source: '1', target: '8', strength: 0.7 },
    { source: '1', target: '9', strength: 0.7 },
    { source: '1', target: '10', strength: 0.7 },
    { source: '1', target: '11', strength: 0.7 },
    { source: '1', target: '12', strength: 0.8 },
    { source: '1', target: '13', strength: 0.8 },
    { source: '1', target: '14', strength: 0.8 },
    { source: '1', target: '15', strength: 0.8 },
    { source: '1', target: '16', strength: 0.8 },
    { source: '1', target: '17', strength: 0.8 },
    { source: '1', target: '18', strength: 0.9 },
    { source: '1', target: '19', strength: 0.9 },
    { source: '1', target: '20', strength: 0.6 },
    { source: '1', target: '21', strength: 0.6 },
    { source: '1', target: '22', strength: 0.6 },
    { source: '1', target: '23', strength: 0.6 },
    { source: '1', target: '24', strength: 0.5 },
    { source: '1', target: '25', strength: 0.5 },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 960;
    const height = 960;

    // We use all nodes and links for the simulation to keep it stable
    const nodes = [...allNodes];
    const links = [...allLinks];

    setNodesData(nodes);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    // Create a container for all map elements to allow zooming/panning
    const container = svg.append('g').attr('class', 'map-container');

    // Setup Zoom
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    zoomRef.current = zoomBehavior;
    svg.call(zoomBehavior);

    // Background Grid
    const grid = container.append('g').attr('class', 'grid');
    for (let i = -width; i <= width * 2; i += 50) {
      grid.append('line').attr('x1', i).attr('y1', -height).attr('x2', i).attr('y2', height * 2).attr('stroke', '#1a1b1e').attr('stroke-width', 1);
    }
    for (let i = -height; i <= height * 2; i += 50) {
      grid.append('line').attr('x1', -width).attr('y1', i).attr('x2', width * 2).attr('y2', i).attr('stroke', '#1a1b1e').attr('stroke-width', 1);
    }

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(180))
      .force('charge', d3.forceManyBody().strength(-200)) // Reduced strength for more stability
      .force('collision', d3.forceCollide().radius(70));

    const link = container.append('g')
      .attr('class', 'links-layer')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'mesh-link')
      .attr('stroke', '#2a2b2e')
      .attr('stroke-width', d => (d as any).strength * 4.8)
      .attr('stroke-dasharray', '10,5');

    const node = container.append('g')
      .attr('class', 'nodes-layer')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'mesh-node')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // User Marker
    const userMarker = container.append('g')
      .attr('class', 'user-marker')
      .attr('transform', `translate(${userPos.x},${userPos.y})`);

    userMarker.append('circle')
      .attr('r', 12)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    userMarker.append('circle')
      .attr('r', 12)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.4)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('from', '12')
      .attr('to', '30')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');

    // Node circles
    node.append('circle')
      .attr('r', 26)
      .attr('class', 'node-circle')
      .attr('fill', d => {
        if (d.status === 'sos') return '#ff4444';
        if (d.type === 'safezone') return '#3b82f6';
        if (d.type === 'volunteer') return '#eab308';
        if (d.type === 'gateway') return '#22c55e';
        return '#94a3b8';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3.6);

    // Highlight ring (initially hidden)
    node.append('circle')
      .attr('r', 34)
      .attr('fill', 'none')
      .attr('stroke', '#00ff00')
      .attr('stroke-width', 4)
      .attr('class', 'highlight-ring')
      .attr('opacity', 0);

    // SOS pulse
    node.filter(d => d.status === 'sos')
      .append('circle')
      .attr('r', 26)
      .attr('fill', 'none')
      .attr('stroke', '#ff4444')
      .attr('stroke-width', 3.6)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('from', '26')
      .attr('to', '54')
      .attr('dur', '1.5s')
      .attr('begin', '0s')
      .attr('repeatCount', 'indefinite');

    node.filter(d => d.status === 'sos')
      .select('circle:last-child')
      .append('animate')
      .attr('attributeName', 'opacity')
      .attr('from', '0.6')
      .attr('to', '0')
      .attr('dur', '1.5s')
      .attr('begin', '0s')
      .attr('repeatCount', 'indefinite');

    // Labels
    node.append('text')
      .attr('dy', 50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '17px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .text(d => d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, []); // Run only once to maintain stability

  // Handle filtering reactively without rebuilding the simulation
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    // Update node visibility
    svg.selectAll<SVGGElement, Node>('.mesh-node')
      .transition()
      .duration(300)
      .attr('opacity', d => (filter === 'all' || d.type === filter || d.type === 'gateway') ? 1 : 0)
      .attr('pointer-events', d => (filter === 'all' || d.type === filter || d.type === 'gateway') ? 'auto' : 'none');

    // Update link visibility
    svg.selectAll<SVGLineElement, Link>('.mesh-link')
      .transition()
      .duration(300)
      .attr('opacity', d => {
        const source = (d.source as any);
        const target = (d.target as any);
        const sourceVisible = filter === 'all' || source.type === filter || source.type === 'gateway';
        const targetVisible = filter === 'all' || target.type === filter || target.type === 'gateway';
        return (sourceVisible && targetVisible) ? 1 : 0;
      });
  }, [filter]);

  const [isNavigating, setIsNavigating] = useState(false);
  const [userPos, setUserPos] = useState({ x: 480, y: 480 }); // Start at Main Hub
  const [navigationTarget, setNavigationTarget] = useState<Node | null>(null);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.7);
  };

  const handleNavigate = () => {
    if (!selectedNode || !svgRef.current || !zoomRef.current) return;
    
    setIsNavigating(true);
    setNavigationTarget(selectedNode);
    
    const startX = userPos.x;
    const startY = userPos.y;
    const targetX = selectedNode.x || 480;
    const targetY = selectedNode.y || 480;
    
    const svg = d3.select(svgRef.current);
    const container = svg.select('.map-container');
    const userMarker = svg.select('.user-marker');
    
    const width = 960;
    const height = 960;

    // Initial zoom to start position
    const initialTransform = d3.zoomIdentity
      .translate(width / 2 - startX * 1.5, height / 2 - startY * 1.5)
      .scale(1.5);
    
    svg.transition()
      .duration(1000)
      .call(zoomRef.current.transform, initialTransform)
      .on('end', () => {
        // Start movement animation
        d3.transition()
          .duration(4000)
          .ease(d3.easeLinear)
          .tween('navigation', () => {
            const ix = d3.interpolate(startX, targetX);
            const iy = d3.interpolate(startY, targetY);
            
            return (t) => {
              const curX = ix(t);
              const curY = iy(t);
              
              // Update user marker position
              userMarker.attr('transform', `translate(${curX},${curY})`);
              setUserPos({ x: curX, y: curY });
              
              // Auto-pan map to follow user
              const transform = d3.zoomIdentity
                .translate(width / 2 - curX * 1.5, height / 2 - curY * 1.5)
                .scale(1.5);
              svg.call(zoomRef.current.transform, transform);
            };
          })
          .on('end', () => {
            setIsNavigating(false);
            setNavigationTarget(null);
            showNotification(`Destination Reached: ${selectedNode.label}`);
            
            // Final zoom out slightly to show context
            const finalTransform = d3.zoomIdentity
              .translate(width / 2 - targetX * 1.2, height / 2 - targetY * 1.2)
              .scale(1.2);
            svg.transition().duration(500).call(zoomRef.current.transform, finalTransform);
          });
      });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const foundNode = nodesData.find(n => 
      n.id.toLowerCase() === query || 
      n.label.toLowerCase().includes(query) || 
      n.status.toLowerCase() === query
    );

    if (foundNode && svgRef.current && zoomRef.current) {
      setHighlightedNodeId(foundNode.id);
      setSelectedNode(foundNode);

      // Zoom to node
      const svg = d3.select(svgRef.current);
      const width = 960;
      const height = 960;
      
      const transform = d3.zoomIdentity
        .translate(width / 2 - (foundNode.x || 0), height / 2 - (foundNode.y || 0))
        .scale(2);

      svg.transition()
        .duration(750)
        .call(zoomRef.current.transform, transform);

      // Update highlight in D3
      svg.selectAll('.highlight-ring')
        .transition()
        .duration(300)
        .attr('opacity', d => (d as any).id === foundNode.id ? 1 : 0);
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('.highlight-ring')
      .attr('opacity', d => (d as any).id === highlightedNodeId ? 1 : 0);
  }, [highlightedNodeId]);

  return (
    <div className="flex flex-col h-full hardware-panel">
      <div className="hardware-header">
        <div className="flex items-center gap-2 lg:gap-3">
          <Radio className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-safe" />
          <span className="lcd-text text-[10px] lg:text-xs">Mesh Topology</span>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-1 lg:gap-2 px-1.5 lg:py-1 bg-black/40 rounded border border-hardware-line">
            <Users className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white/50" />
            <span className="text-[8px] lg:text-[10px] font-mono">25</span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 px-1.5 lg:py-1 bg-black/40 rounded border border-hardware-line">
            <Radio className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-safe" />
            <span className="text-[8px] lg:text-[10px] font-mono">30</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-black/40 overflow-hidden cursor-move">
        <svg 
          ref={svgRef} 
          className="w-full h-full origin-center"
        />

        {/* Map UI Overlays */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <button 
              onClick={handleZoomIn}
              className="p-1.5 lg:p-2 bg-hardware-bg border border-hardware-line rounded hover:bg-white/5 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-1.5 lg:p-2 bg-hardware-bg border border-hardware-line rounded hover:bg-white/5 transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>
          </div>

          <form 
            onSubmit={handleSearch}
            className="flex items-center gap-2 pointer-events-auto bg-hardware-bg/80 backdrop-blur-sm border border-hardware-line rounded-lg px-3 py-1.5 lg:w-64"
          >
            <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white/40" />
            <input 
              type="text"
              placeholder="Search ID, Label, Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] lg:text-xs w-full font-mono placeholder:text-white/20"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHighlightedNodeId(null);
                }}
                className="opacity-40 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: 'All', color: 'bg-white/20' },
              { id: 'survivor', label: 'Survivors', color: 'bg-emergency' },
              { id: 'volunteer', label: 'Volunteers', color: 'bg-warning' },
              { id: 'safezone', label: 'Safe Zones', color: 'bg-blue-500' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[8px] lg:text-[10px] uppercase tracking-widest font-bold border transition-all whitespace-nowrap",
                  filter === item.id 
                    ? "bg-white text-black border-white" 
                    : "bg-black/60 text-white/60 border-white/10 hover:border-white/30"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full", item.color)} />
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Node Detail Panel - Bottom Sheet on Mobile, Top Right on Desktop */}
        {selectedNode && (
          <div className={cn(
            "absolute z-50 hardware-panel animate-in",
            "bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:top-4 lg:right-4 lg:w-64",
            "slide-in-from-bottom lg:slide-in-from-right"
          )}>
            <div className="hardware-header">
              <span className="lcd-text">Node Details</span>
              <button onClick={() => setSelectedNode(null)} className="opacity-50 hover:opacity-100">
                <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded flex items-center justify-center",
                  selectedNode.status === 'sos' ? "bg-emergency/20 text-emergency" : "bg-white/10 text-white/70"
                )}>
                  {selectedNode.type === 'survivor' ? <Users className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm lg:text-base">{selectedNode.label}</div>
                  <div className="text-[10px] opacity-50 font-mono">ID: {selectedNode.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                <div className="flex flex-col lg:flex-row lg:justify-between text-[9px] lg:text-[10px]">
                  <span className="opacity-50">Type:</span>
                  <span className="font-bold uppercase text-white/80">{selectedNode.type}</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between text-[9px] lg:text-[10px]">
                  <span className="opacity-50">Status:</span>
                  <span className={cn("font-bold uppercase", selectedNode.status === 'sos' ? "text-emergency" : "text-safe")}>
                    {selectedNode.status}
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between text-[9px] lg:text-[10px]">
                  <span className="opacity-50">Battery:</span>
                  <span className="font-mono">84%</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between text-[9px] lg:text-[10px]">
                  <span className="opacity-50">Hops:</span>
                  <span className="font-mono">2</span>
                </div>
              </div>

              <button 
                onClick={handleNavigate}
                disabled={isNavigating}
                className={cn(
                  "w-full py-2.5 text-white text-[10px] lg:text-xs font-bold rounded transition-all flex items-center justify-center gap-2",
                  isNavigating ? "bg-safe/50 cursor-not-allowed" : "bg-emergency hover:bg-emergency/90"
                )}
              >
                <Navigation className={cn("w-3.5 h-3.5 lg:w-4 lg:h-4", isNavigating && "animate-spin")} />
                {isNavigating ? "NAVIGATING..." : "NAVIGATE TO NODE"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
