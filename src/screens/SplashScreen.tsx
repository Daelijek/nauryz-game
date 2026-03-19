import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

type SplashScreenProps = {
  onDone: () => void;
};

type Ornament = {
  url: string;
  leftPct: number;
  delayMs: number;
  durationMs: number;
  sizePx: number;
  rotationDeg: number;
  opacity: number;
};

export function SplashScreen({ onDone }: SplashScreenProps) {
  const { t } = useTranslation();
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  const ornaments = useMemo<Ornament[]>(() => {
    const urls = [
      '/backgroun_ornament1.webp',
      '/backgroun_ornament2.webp',
      '/backgroun_ornament3.webp',
      '/backgroun_ornament4.webp',
    ];
    // deterministic-ish positions without randomness (avoids hydration issues)
    return Array.from({ length: 12 }).map((_, idx) => ({
      url: urls[idx % urls.length],
      leftPct: (idx * 8.2 + 6) % 92,
      delayMs: (idx % 6) * 160,
      durationMs: 5200 + (idx % 5) * 520,
      sizePx: 34 + (idx % 5) * 10,
      rotationDeg: (idx * 37) % 360,
      opacity: 0.18 + (idx % 4) * 0.08,
    }));
  }, []);

  const requestExit = () => {
    if (exiting) return;
    setExiting(true);
    // Match CSS animation duration for exit
    exitTimeoutRef.current = window.setTimeout(() => onDone(), 420);
  };

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`splash ${exiting ? 'splash--exit' : ''}`}
      role="dialog"
      aria-label={t('splash.aria')}
      onClick={requestExit}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') requestExit();
      }}
      tabIndex={0}
    >
      <div className="splash__ornaments" aria-hidden>
        {ornaments.map((o, i) => (
          <span
            key={i}
            className="splash__ornament"
            style={
              {
              left: `${o.leftPct}%`,
              animationDelay: `${o.delayMs}ms`,
              animationDuration: `${o.durationMs}ms`,
              width: `${o.sizePx}px`,
              height: `${o.sizePx}px`,
              transform: `rotate(${o.rotationDeg}deg)`,
              opacity: o.opacity,
              '--ornament-url': `url(${o.url})`,
              } as CSSProperties & Record<'--ornament-url', string>
            }
          />
        ))}
      </div>

      <div className="splash__content">
        <div className="splash__logo" aria-hidden>
          <img className="splash__logoImg" src="/logo.webp" alt="" />
        </div>
        <div className="splash__title">{t('splash.title')}</div>
        <div className="splash__subtitle">{t('splash.subtitle')}</div>
        <div className="splash__hint">{t('splash.hint')}</div>
      </div>
    </div>
  );
}

