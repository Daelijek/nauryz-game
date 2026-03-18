import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

type YurtScreenProps = {
  onStart: () => void;
};

export function YurtScreen({ onStart }: YurtScreenProps) {
  const { t } = useTranslation();
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  const requestExit = () => {
    if (exiting) return;

    // If user prefers reduced motion, skip animation delay.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      onStart();
      return;
    }

    setExiting(true);
    // Must match CSS animation duration in `App.css`.
    exitTimeoutRef.current = window.setTimeout(onStart, 560);
  };

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) window.clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  return (
    <div className={`screen screen-yurt ${exiting ? 'screen-yurt--exit' : ''}`} data-screen="yurt">
      <div className="yurt-exit-reveal" aria-hidden />
      <LanguageSwitcher />
      <div className="screen-yurt__content">
        <h1>{t('yurt.title')}</h1>
        <div className="screen-yurt__intro">
          <p>{t('yurt.intro1')}</p>
          <p>{t('yurt.intro2')}</p>
        </div>
        <button type="button" onClick={requestExit} disabled={exiting}>
          {t('yurt.start')}
        </button>
      </div>
    </div>
  );
}
