import { BioPart, PartType } from './types';

export const INITIAL_PARTS_LIBRARY: BioPart[] = [
  {
    id: 'p1',
    name: 'Constitutive Promoter (Strong)',
    type: PartType.PROMOTER,
    description: 'A strong promoter that is always active.',
    strength: 10,
    color: '#ef4444' // red
  },
  {
    id: 'p2',
    name: 'Inducible Promoter (LacI)',
    type: PartType.PROMOTER,
    description: 'Promoter repressed by LacI, activated by IPTG.',
    strength: 8,
    color: '#f97316' // orange
  },
  {
    id: 'r1',
    name: 'Standard RBS',
    type: PartType.RBS,
    description: 'Standard Ribosome Binding Site.',
    efficiency: 1.0,
    color: '#22c55e' // green
  },
  {
    id: 'r2',
    name: 'Strong RBS',
    type: PartType.RBS,
    description: 'High efficiency RBS.',
    efficiency: 2.5,
    color: '#16a34a' // dark green
  },
  {
    id: 'c1',
    name: 'GFP Coding Sequence',
    type: PartType.CDS,
    description: 'Green Fluorescent Protein.',
    degradationRate: 0.1,
    color: '#3b82f6' // blue
  },
  {
    id: 'c2',
    name: 'RFP Coding Sequence',
    type: PartType.CDS,
    description: 'Red Fluorescent Protein.',
    degradationRate: 0.1,
    color: '#ef4444' // red
  },
  {
    id: 't1',
    name: 'Double Terminator',
    type: PartType.TERMINATOR,
    description: 'Stops transcription efficiently.',
    color: '#64748b' // slate
  },
  {
    id: 'rep1',
    name: 'LuxR Reporter',
    type: PartType.REPORTER,
    description: 'Reporter for quorum sensing.',
    color: '#a855f7' // purple
  }
];
