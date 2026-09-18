import type { Noble } from './types';

/** Official Splendor 10 noble tiles. Same source as ALL_CARDS. */
export const ALL_NOBLES: Noble[] = [
  { id: 'N01', points: 3, requirement: { emerald: 4, ruby: 4 } }, // Mary Stuart
  { id: 'N02', points: 3, requirement: { sapphire: 4, emerald: 4 } }, // Charles V
  { id: 'N03', points: 3, requirement: { diamond: 4, sapphire: 4 } }, // Machiavelli
  { id: 'N04', points: 3, requirement: { diamond: 4, onyx: 4 } }, // Isabella of Castile
  { id: 'N05', points: 3, requirement: { ruby: 4, onyx: 4 } }, // Suleiman the Magnificent
  { id: 'N06', points: 3, requirement: { sapphire: 3, emerald: 3, ruby: 3 } }, // Catherine de' Medici
  { id: 'N07', points: 3, requirement: { diamond: 3, emerald: 3, ruby: 3 } }, // Anne of Brittany
  { id: 'N08', points: 3, requirement: { diamond: 3, sapphire: 3, onyx: 3 } }, // Henry VIII
  { id: 'N09', points: 3, requirement: { emerald: 3, ruby: 3, onyx: 3 } }, // Elisabeth of Austria
  { id: 'N10', points: 3, requirement: { diamond: 3, sapphire: 3, emerald: 3 } }, // Francis I of France
];
