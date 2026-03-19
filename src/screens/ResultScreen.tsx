import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import JSConfetti from 'js-confetti';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

type ResultScreenProps = {
  timeInSeconds: number;
  onPlayAgain: () => void;
};

const RESULT_EXIT_DURATION_MS = 560;
const CONFETTI_DELAY_MS = 400;

const CONFETTI_EMOJIS = ['🌾', '✨', '🎉', '🌸', '🥣', '💫', '🌟', '🌿'];

const ORNAMENT_IMAGES = [
  '/backgroun_ornament1.webp',
  '/backgroun_ornament2.webp',
  '/backgroun_ornament3.webp',
  '/backgroun_ornament4.webp',
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ResultScreen({ timeInSeconds, onPlayAgain }: ResultScreenProps) {
  const { t } = useTranslation();
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);
  const jsConfettiRef = useRef<JSConfetti | null>(null);

  const handlePlayAgain = () => {
    if (exiting) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      onPlayAgain();
      return;
    }
    setExiting(true);
    exitTimeoutRef.current = window.setTimeout(onPlayAgain, RESULT_EXIT_DURATION_MS);
  };

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) window.clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  // Запуск конфетти только когда полностью перешли на экран результата
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    let secondBurstTimer: ReturnType<typeof setTimeout> | null = null;
    const confettiTimer = window.setTimeout(() => {
      jsConfettiRef.current = new JSConfetti();
      jsConfettiRef.current.addConfetti({
        confettiNumber: 120,
        confettiColors: ['#ffd54f', '#ffb74d', '#ff8a65', '#a5d6a7', '#81c784', '#fff59d', '#ffcc80'],
        emojis: CONFETTI_EMOJIS,
        emojiSize: 50,
        confettiRadius: 5,
      });
      secondBurstTimer = setTimeout(() => {
        jsConfettiRef.current?.addConfetti({
          confettiNumber: 80,
          emojis: CONFETTI_EMOJIS,
          emojiSize: 40,
        });
      }, 300);
    }, CONFETTI_DELAY_MS);

    return () => {
      window.clearTimeout(confettiTimer);
      if (secondBurstTimer !== null) window.clearTimeout(secondBurstTimer);
      jsConfettiRef.current?.destroyCanvas();
      jsConfettiRef.current = null;
    };
  }, []);

  return (
    <div
      className={`screen screen-result screen-result--enter${exiting ? ' screen-result--exit' : ''}`}
      data-screen="result"
    >
      <div className="result-exit-reveal" aria-hidden />
      {/* Падающие орнаменты поверх экрана (свои изображения — js-confetti их не поддерживает) */}
      {!exiting && (
        <div className="result-ornaments" aria-hidden>
          {ORNAMENT_IMAGES.flatMap((src, i) =>
            [0, 1].map((j) => (
              <div
                key={`${i}-${j}`}
                className="result-ornaments__item"
                style={{
                  left: `${15 + (i * 25 + j * 12) % 70}%`,
                  animationDelay: `${(i * 0.8 + j * 0.4) % 3}s`,
                  animationDuration: `${5 + (i + j) % 3}s`,
                  backgroundImage: `url(${src})`,
                }}
              />
            ))
          )}
        </div>
      )}
      <LanguageSwitcher />
      <div className="screen-result__content">
        <h1 className="screen-result__title">{t('result.title')}</h1>
        <p className="screen-result__time">
          {t('result.time')} {formatTime(timeInSeconds)}
        </p>
        <p className="screen-result__message" style={{ whiteSpace: 'pre-line' }}>
          {t('result.message')}
        </p>
        <button
          type="button"
          className="screen-result__btn"
          onClick={handlePlayAgain}
          disabled={exiting}
        >
          {t('result.playAgain')}
        </button>
      </div>
    </div>
  );
}
