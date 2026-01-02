export enum PartType {
  PROMOTER = 'PROMOTER',
  RBS = 'RBS',
  CDS = 'CDS',
  TERMINATOR = 'TERMINATOR',
  REPORTER = 'REPORTER'
}

export interface BioPart {
  id: string;
  name: string;
  type: PartType;
  description: string;
  // Simulation parameters
  strength?: number; // For promoters (transcription rate)
  efficiency?: number; // For RBS (translation rate)
  degradationRate?: number; // For proteins
  color: string;
}

export interface CircuitPart extends BioPart {
  instanceId: string;
}

export interface SimulationDataPoint {
  time: number;
  mRNA: number;
  protein: number;
}
