import React from 'react';
import { PartType } from '../types';

interface IconProps {
  className?: string;
  color?: string;
}

// SBOL-style icons (Synthetic Biology Open Language)

export const PromoterIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M5 20V14H12V10L16 14L12 18V14" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 20H19" strokeLinecap="round" />
  </svg>
);

export const RbsIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M5 20H19" strokeLinecap="round" />
    <path d="M9 20C9 14 15 14 15 20" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1.5" fill={color} stroke="none" />
  </svg>
);

export const CdsIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M4 16H16L20 16L16 16" strokeLinecap="round" />
    <path d="M4 14H16L20 16L16 18H4V14Z" fill={color} fillOpacity="0.2" />
    <path d="M2 20H22" strokeLinecap="round" strokeWidth="1" />
  </svg>
);

export const TerminatorIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M4 20H20" strokeLinecap="round" />
    <path d="M12 20V12" strokeLinecap="round" />
    <path d="M8 12H16" strokeLinecap="round" />
  </svg>
);

export const ReporterIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M4 20H20" strokeLinecap="round" />
    <path d="M12 20V15" strokeLinecap="round" />
    <circle cx="12" cy="11" r="4" fill={color} fillOpacity="0.3" />
    <path d="M12 7V5M8 9L6.5 7.5M16 9L17.5 7.5" strokeLinecap="round" />
  </svg>
);

export const getIconForPart = (type: PartType, className?: string, color?: string) => {
  switch (type) {
    case PartType.PROMOTER: return <PromoterIcon className={className} color={color} />;
    case PartType.RBS: return <RbsIcon className={className} color={color} />;
    case PartType.CDS: return <CdsIcon className={className} color={color} />;
    case PartType.TERMINATOR: return <TerminatorIcon className={className} color={color} />;
    case PartType.REPORTER: return <ReporterIcon className={className} color={color} />;
    default: return null;
  }
};
