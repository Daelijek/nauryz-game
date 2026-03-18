import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'kz', label: 'Қаз' },
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'Eng' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="language-switcher" role="group" aria-label="Language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`language-switcher__btn ${i18n.language === code ? 'language-switcher__btn--active' : ''}`}
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={i18n.language === code}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
