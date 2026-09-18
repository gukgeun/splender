import { WINNING_SCORE } from './constants';
import type { Player } from './types';

export function hasReachedWinningScore(player: Player): boolean {
  return player.score >= WINNING_SCORE;
}

/**
 * Highest score wins; ties broken by fewest purchased cards (the more
 * "efficient" win, per the rulebook). If that's still tied, it's a genuine
 * shared win — returns every player id still tied at that point.
 */
export function computeWinners(players: Player[]): string[] {
  const maxScore = Math.max(...players.map((p) => p.score));
  const topScorers = players.filter((p) => p.score === maxScore);
  if (topScorers.length === 1) return [topScorers[0].id];

  const minCards = Math.min(...topScorers.map((p) => p.purchasedCards.length));
  return topScorers.filter((p) => p.purchasedCards.length === minCards).map((p) => p.id);
}
