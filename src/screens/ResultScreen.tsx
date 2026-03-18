import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

type ResultScreenProps = {
  timeInSeconds: number;
  onPlayAgain: () => void;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ResultScreen({ timeInSeconds, onPlayAgain }: ResultScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="screen screen-result" data-screen="result">
      <LanguageSwitcher />
      <h1>{t('result.title')}</h1>
      <p>
        {t('result.time')} {formatTime(timeInSeconds)}
      </p>
      <p style={{ whiteSpace: 'pre-line' }}>{t('result.message')}</p>
      <button type="button" onClick={onPlayAgain}>
        {t('result.playAgain')}
      </button>
    </div>
  );
}
