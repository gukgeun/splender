import { useState } from 'react';
import { useGameDispatch, useGameState } from '../context/GameContext';
import { MAX_RESERVED_CARDS } from '../game/constants';
import { canAfford } from '../game/cost';
import type { Card, CardLevel } from '../game/types';
import { CardDetailModal } from './CardDetailModal';
import { CardRow } from './CardRow';
import { ChooseNobleModal } from './ChooseNobleModal';
import { DeckReserveConfirm } from './DeckReserveConfirm';
import { DiscardTokensModal } from './DiscardTokensModal';
import { NoblesRow } from './NoblesRow';
import { PlayersBar } from './PlayersBar';
import { TokenPool } from './TokenPool';
import styles from './GameBoard.module.css';

type CardSelection = { card: Card; source: 'board' | 'reserved' };

export function GameBoard() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [activeCard, setActiveCard] = useState<CardSelection | null>(null);
  const [deckConfirmLevel, setDeckConfirmLevel] = useState<CardLevel | null>(null);

  const player = state.players[state.currentPlayerIndex];
  const pendingAction = state.pendingAction;
  const blocked = pendingAction !== null;

  function handleCardClick(card: Card) {
    if (blocked) return;
    setActiveCard({ card, source: 'board' });
  }

  function handleReservedCardClick(card: Card) {
    if (blocked) return;
    setActiveCard({ card, source: 'reserved' });
  }

  function handleDeckClick(level: CardLevel) {
    if (blocked || player.reservedCards.length >= MAX_RESERVED_CARDS) return;
    setDeckConfirmLevel(level);
  }

  function handleBuy() {
    if (!activeCard) return;
    dispatch({ type: 'BUY_CARD', cardId: activeCard.card.id, source: activeCard.source });
    setActiveCard(null);
  }

  function handleReserveFromBoard() {
    if (!activeCard) return;
    dispatch({ type: 'RESERVE_CARD_FROM_BOARD', cardId: activeCard.card.id });
    setActiveCard(null);
  }

  function handleConfirmDeckReserve() {
    if (deckConfirmLevel === null) return;
    dispatch({ type: 'RESERVE_CARD_FROM_DECK', level: deckConfirmLevel });
    setDeckConfirmLevel(null);
  }

  return (
    <div className={styles.layout}>
      <div className={styles.boardArea}>
        <div className={styles.turnBanner}>{player.name}의 차례</div>

        <NoblesRow nobles={state.nobles} />

        {([3, 2, 1] as CardLevel[]).map((level) => (
          <CardRow
            key={level}
            level={level}
            slots={state.board[level]}
            deckRemaining={state.decks[level].length}
            disabled={blocked}
            onCardClick={handleCardClick}
            onDeckClick={handleDeckClick}
            isCardAffordable={(card) => canAfford(card, player)}
          />
        ))}

        <TokenPool tokenPool={state.tokenPool} disabled={blocked} turnCount={state.turnCount} />
      </div>

      <div className={styles.playersArea}>
        <PlayersBar
          players={state.players}
          currentPlayerIndex={state.currentPlayerIndex}
          onReservedCardClick={handleReservedCardClick}
        />
      </div>

      {activeCard && (
        <CardDetailModal
          card={activeCard.card}
          player={player}
          canBuy={canAfford(activeCard.card, player)}
          canReserve={activeCard.source === 'board' && player.reservedCards.length < MAX_RESERVED_CARDS}
          onBuy={handleBuy}
          onReserve={handleReserveFromBoard}
          onClose={() => setActiveCard(null)}
        />
      )}

      {deckConfirmLevel !== null && (
        <DeckReserveConfirm
          level={deckConfirmLevel}
          onConfirm={handleConfirmDeckReserve}
          onClose={() => setDeckConfirmLevel(null)}
        />
      )}

      {pendingAction?.type === 'discardTokens' && (
        <DiscardTokensModal
          player={state.players.find((p) => p.id === pendingAction.playerId)!}
          excess={pendingAction.excess}
          onDiscard={(color) => dispatch({ type: 'DISCARD_TOKEN', color })}
        />
      )}

      {pendingAction?.type === 'chooseNoble' && (
        <ChooseNobleModal
          nobles={state.nobles.filter((n) => pendingAction.eligibleNobleIds.includes(n.id))}
          onChoose={(nobleId) => dispatch({ type: 'CHOOSE_NOBLE', nobleId })}
        />
      )}
    </div>
  );
}
