import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INGREDIENTS, CORRECT_IDS, shuffleIngredients } from '../data/ingredients';
import type { Ingredient } from '../data/ingredients';
import { IngredientCard } from '../components/IngredientCard';
import { Timer } from '../components/Timer';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const EMOJI_MAP: Record<string, string> = {
  meat: '🥩', wheat: '🌾', rice: '🍚', onion: '🧅', salt: '🧂', water: '💧',
  kurt: '🧀', milk: '🥛', apple: '🍎', candy: '🍬', soda: '🥤',
  chocolate: '🍫', icecream: '🍦', cake: '🎂',
};

type GameScreenProps = {
  onWin: (timeInSeconds: number) => void;
};

function getIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

export function GameScreen({ onWin }: GameScreenProps) {
  const { t } = useTranslation();
  const [inCauldronIds, setInCauldronIds] = useState<Set<string>>(new Set());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const winTimeRef = useRef<number | null>(null);
  const winTriggeredRef = useRef(false);
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const [cauldronDragOver, setCauldronDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cauldronRef = useRef<HTMLDivElement | null>(null);

  const shuffledIngredients = useMemo(() => shuffleIngredients(INGREDIENTS), []);
  const availableIngredients = useMemo(
    () => shuffledIngredients.filter((i) => !inCauldronIds.has(i.id)),
    [shuffledIngredients, inCauldronIds]
  );

  useEffect(() => {
    if (won) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [won]);

  // Fire parent callback only after we finished updating child state.
  useEffect(() => {
    if (!won) return;
    if (!winTriggeredRef.current) return;
    if (winTimeRef.current === null) return;
    onWin(winTimeRef.current);
  }, [won, onWin]);

  const handleAddToCauldron = (id: string) => {
    if (won) return;
    const ing = getIngredientById(id);
    if (!ing) return;
    if (ing.isCorrect) {
      setInCauldronIds((prev) => {
        const next = new Set(prev);
        next.add(id);

        const hasAllCorrect = CORRECT_IDS.every((cid) => next.has(cid));
        if (hasAllCorrect) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (!winTriggeredRef.current) {
            winTriggeredRef.current = true;
            winTimeRef.current = elapsedSeconds;
          }
          setWon(true);
        }

        return next;
      });
    } else {
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
      setWrongFeedback(true);
      wrongTimeoutRef.current = setTimeout(() => {
        setWrongFeedback(false);
        wrongTimeoutRef.current = null;
      }, 2000);
    }
  };

  const animateToCauldronThenAdd = async (id: string, fromEl: HTMLElement) => {
    if (won) return;
    const ing = getIngredientById(id);
    if (!ing) return;

    // Wrong ingredient: no fly, just feedback
    if (!ing.isCorrect) {
      handleAddToCauldron(id);
      return;
    }

    const cauldronEl = cauldronRef.current;
    if (!cauldronEl) {
      handleAddToCauldron(id);
      return;
    }

    // Prevent double-trigger
    if (inCauldronIds.has(id) || leavingIds.has(id)) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = cauldronEl.getBoundingClientRect();

    const fly = document.createElement('div');
    fly.className = 'fly-ingredient';
    fly.textContent = EMOJI_MAP[id] ?? '🥄';
    fly.style.left = `${fromRect.left + fromRect.width / 2}px`;
    fly.style.top = `${fromRect.top + fromRect.height / 2}px`;
    document.body.appendChild(fly);

    // Fade original out while flying
    setLeavingIds((prev) => new Set(prev).add(id));

    const endX = toRect.left + toRect.width / 2;
    const endY = toRect.top + toRect.height * 0.45; // into pot area

    const dx = endX - (fromRect.left + fromRect.width / 2);
    const dy = endY - (fromRect.top + fromRect.height / 2);

    const animation = fly.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.55)`, opacity: 0.9, offset: 0.85 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0 }
      ],
      { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );

    try {
      await animation.finished;
    } catch {
      // ignore
    } finally {
      fly.remove();
      handleAddToCauldron(id);
      setLeavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
    };
  }, []);

  const handleCauldronDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setCauldronDragOver(true);
  };

  const handleCauldronDragLeave = () => {
    setCauldronDragOver(false);
  };

  const handleCauldronDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCauldronDragOver(false);
    setDraggingId(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) handleAddToCauldron(id);
  };

  return (
    <div className="screen screen-game" data-screen="game">
      <LanguageSwitcher />
      <div className="game-hud">
        <Timer seconds={elapsedSeconds} />
      </div>

      <div className="game-scene" aria-hidden>
        <div
          className={`cauldron-drop-zone cauldron-drop-zone--centered ${cauldronDragOver ? 'cauldron-drop-zone--over' : ''} ${wrongFeedback ? 'cauldron-drop-zone--wrong' : ''}`}
          onDragOver={handleCauldronDragOver}
          onDragLeave={handleCauldronDragLeave}
          onDrop={handleCauldronDrop}
          ref={cauldronRef}
        >
          <div className={`cauldron-drop-zone__inner ${wrongFeedback ? 'cauldron-drop-zone__inner--shake' : ''}`}>
          <img
            src="/kazan.webp"
            alt=""
            className="cauldron-drop-zone__img"
            aria-hidden
          />
          <div className="cauldron-drop-zone__overlay">
            <span className="cauldron-drop-zone__label visually-hidden">{t('game.cauldron')}</span>
            <span className="cauldron-drop-zone__hint" aria-hidden>
              {cauldronDragOver ? t('game.dropHere') : ''}
            </span>
            {wrongFeedback && (
              <div className="cauldron-wrong-message" role="alert">
                {t('game.wrongIngredient')}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      <div
        className="ingredients-tray"
        role="list"
        aria-label="Ingredients"
      >
        <div className="ingredients-tray__scroller">
          {availableIngredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              label={t(ingredient.nameKey)}
              onDragStateChange={setDraggingId}
              dragging={draggingId === ingredient.id}
              leaving={leavingIds.has(ingredient.id)}
              onSelect={(id, el) => void animateToCauldronThenAdd(id, el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
