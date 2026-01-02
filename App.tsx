import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_PARTS_LIBRARY } from './constants';
import { BioPart, CircuitPart, PartType, SimulationDataPoint } from './types';
import { getIconForPart } from './components/IconComponents';
import SimulationChart from './components/SimulationChart';
import { 
  Play, 
  Download, 
  Upload, 
  Trash2, 
  Settings, 
  Plus, 
  Loader2,
  Menu,
  X
} from 'lucide-react';

// --- Helper Components ---

interface DraggablePartProps {
  part: BioPart;
  onAdd: (part: BioPart) => void;
}

const DraggablePart: React.FC<DraggablePartProps> = ({ part, onAdd }) => (
  <div 
    className="group flex items-center p-3 mb-2 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-95"
    onClick={() => onAdd(part)}
  >
    <div className="w-8 h-8 mr-3 flex items-center justify-center bg-slate-50 rounded-md text-slate-600 group-hover:text-blue-600 transition-colors">
      {getIconForPart(part.type, "w-6 h-6", part.color)}
    </div>
    <div>
      <h4 className="text-sm font-medium text-slate-800">{part.name}</h4>
      <p className="text-xs text-slate-500 truncate max-w-[140px]">{part.description}</p>
    </div>
    <Plus className="ml-auto w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

interface CircuitBlockProps {
  part: CircuitPart;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

const CircuitBlock: React.FC<CircuitBlockProps> = ({ 
  part, 
  isSelected, 
  onSelect, 
  onRemove 
}) => (
  <div 
    className={`
      relative flex flex-col items-center justify-center p-4 min-w-[100px] h-32 
      bg-white border-2 rounded-xl transition-all select-none cursor-pointer
      ${isSelected ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
    `}
    onClick={onSelect}
  >
    {isSelected && (
      <button 
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm z-10"
      >
        <X className="w-3 h-3" />
      </button>
    )}
    <div className="mb-2 transform scale-125">
      {getIconForPart(part.type, "w-10 h-10", part.color)}
    </div>
    <span className="text-xs font-semibold text-slate-700 text-center px-1 truncate w-full">{part.name}</span>
    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{part.type}</span>
    
    {/* Connector Line Visual */}
    <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 z-0" />
    <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-slate-300 z-0" />
  </div>
);

// --- Main App ---

export default function App() {
  const [circuit, setCircuit] = useState<CircuitPart[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationDataPoint[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple ODE Solver for Simulation
  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    // Basic deterministic simulation based on parts
    // mRNA(t+1) = mRNA(t) + transcription - mRNA_degradation
    // Protein(t+1) = Protein(t) + translation - Protein_degradation

    let promoterStrength = 0;
    let rbsEfficiency = 0;
    let proteinDegradation = 0.05; // Default

    // Aggregate parameters from the circuit
    circuit.forEach(part => {
      if (part.type === PartType.PROMOTER) promoterStrength += (part.strength || 0);
      if (part.type === PartType.RBS) rbsEfficiency += (part.efficiency || 0);
      if (part.type === PartType.CDS) proteinDegradation = (part.degradationRate || 0.05);
    });

    const newData: SimulationDataPoint[] = [];
    let m = 0;
    let p = 0;
    const mRNA_deg = 0.1;
    const totalTime = 100;

    for (let t = 0; t <= totalTime; t++) {
      // Very simplified model
      const transcription = promoterStrength > 0 ? promoterStrength * 0.5 : 0;
      // Translation depends on RBS and mRNA presence
      const translation = rbsEfficiency > 0 ? (m * rbsEfficiency * 0.5) : 0;

      // Update states
      m = m + transcription - (m * mRNA_deg);
      p = p + translation - (p * proteinDegradation);

      if (m < 0) m = 0;
      if (p < 0) p = 0;

      newData.push({
        time: t,
        mRNA: parseFloat(m.toFixed(2)),
        protein: parseFloat(p.toFixed(2))
      });
    }

    // Artificial delay to feel like a "process"
    setTimeout(() => {
      setSimulationData(newData);
      setIsSimulating(false);
    }, 600);
  }, [circuit]);

  // Handle Adding Parts
  const addPart = (part: BioPart) => {
    const newPart: CircuitPart = {
      ...part,
      instanceId: `${part.id}-${Date.now()}`
    };
    setCircuit([...circuit, newPart]);
    // Reset simulation when circuit changes
    setSimulationData([]);
  };

  // Handle Removal
  const removePart = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation();
    setCircuit(circuit.filter(p => p.instanceId !== instanceId));
    if (selectedPartId === instanceId) setSelectedPartId(null);
    setSimulationData([]);
  };

  // File I/O
  const handleSave = () => {
    const dataStr = JSON.stringify(circuit, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gene_circuit.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setCircuit(json);
          setSimulationData([]);
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectedPart = circuit.find(p => p.instanceId === selectedPartId);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row">
      
      {/* --- Sidebar (Library) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              GeneCircuits
            </h1>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Library</h3>
            {INITIAL_PARTS_LIBRARY.map(part => (
              <DraggablePart key={part.id} part={part} onAdd={addPart} />
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="text-xs text-slate-400 text-center">
              v2.0.1 (Web)
            </div>
          </div>
        </div>
      </aside>

      {/* --- Overlay for Mobile --- */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSave}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Save Circuit"
              >
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Load Circuit"
              >
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Load</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleLoad} accept=".json" className="hidden" />
              
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

              <button 
                onClick={() => setCircuit([])}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Clear Circuit"
              >
                <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={runSimulation}
              disabled={isSimulating || circuit.length === 0}
              className={`
                px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                ${isSimulating 
                  ? 'bg-green-100 text-green-400 cursor-not-allowed' 
                  : circuit.length === 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                }
              `}
            >
              {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isSimulating ? 'Simulating...' : 'Simulate'}
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          
          {/* Canvas Area */}
          <section className="bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 min-h-[200px] flex items-center justify-start overflow-x-auto p-8 relative">
            {circuit.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                <Plus className="w-12 h-12 mb-2 opacity-50" />
                <p>Drag parts from the library or click to add</p>
              </div>
            ) : (
              <div className="flex items-center space-x-0 min-w-max px-8">
                {/* 5' End */}
                <div className="text-slate-400 font-mono text-xs mr-4">5'</div>
                
                {circuit.map((part) => (
                  <CircuitBlock 
                    key={part.instanceId} 
                    part={part} 
                    isSelected={selectedPartId === part.instanceId}
                    onSelect={() => setSelectedPartId(part.instanceId)}
                    onRemove={(e) => removePart(e, part.instanceId)}
                  />
                ))}
                
                {/* 3' End */}
                <div className="text-slate-400 font-mono text-xs ml-8">3'</div>
              </div>
            )}
          </section>

          {/* Bottom Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Simulation Results */}
            <div className="lg:col-span-2">
              {simulationData.length > 0 ? (
                <SimulationChart data={simulationData} />
              ) : (
                <div className="h-64 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Run simulation to view results</p>
                  </div>
                </div>
              )}
            </div>

            {/* Properties Panel */}
            <div className="space-y-6">
              
              {/* Properties */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <Settings className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Properties</h3>
                </div>
                
                {selectedPart ? (
                  <div className="space-y-3">
                     <div>
                        <label className="text-xs text-slate-500 block mb-1">Name</label>
                        <input 
                          type="text" 
                          value={selectedPart.name} 
                          readOnly
                          className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded text-slate-600"
                        />
                     </div>
                     <div>
                        <label className="text-xs text-slate-500 block mb-1">Type</label>
                        <span className="inline-block px-2 py-1 rounded bg-slate-100 text-xs font-mono text-slate-600">
                          {selectedPart.type}
                        </span>
                     </div>
                     {selectedPart.strength !== undefined && (
                       <div>
                         <label className="text-xs text-slate-500 block mb-1">Strength</label>
                         <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.min(selectedPart.strength * 10, 100)}%` }}></div>
                         </div>
                         <div className="text-right text-xs text-slate-400 mt-1">{selectedPart.strength} a.u.</div>
                       </div>
                     )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Select a part to view details</p>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}