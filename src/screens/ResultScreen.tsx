import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

type ResultScreenProps = {
  timeInSeconds: number;
  onPlayAgain: () => void;
};

const RESULT_EXIT_DURATION_MS = 560;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ResultScreen({ timeInSeconds, onPlayAgain }: ResultScreenProps) {
  const { t } = useTranslation();
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

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

  return (
    <div
      className={`screen screen-result screen-result--enter${exiting ? ' screen-result--exit' : ''}`}
      data-screen="result"
    >
      <div className="result-exit-reveal" aria-hidden />
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
