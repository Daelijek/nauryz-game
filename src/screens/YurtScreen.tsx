import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

type YurtScreenProps = {
  onStart: () => void;
};

export function YurtScreen({ onStart }: YurtScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="screen screen-yurt" data-screen="yurt">
      <LanguageSwitcher />
      <div className="screen-yurt__content">
        <h1>{t('yurt.title')}</h1>
        <div className="screen-yurt__intro">
          <p>{t('yurt.intro1')}</p>
          <p>{t('yurt.intro2')}</p>
        </div>
        <button type="button" onClick={onStart}>
          {t('yurt.start')}
        </button>
      </div>
    </div>
  );
}
