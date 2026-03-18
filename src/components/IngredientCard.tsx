import type { Ingredient } from '../data/ingredients';

type IngredientCardProps = {
  ingredient: Ingredient;
  label: string;
  dragging?: boolean;
  onDragStateChange?: (id: string | null) => void;
  onSelect?: (id: string, el: HTMLElement) => void;
  leaving?: boolean;
};

const EMOJI_MAP: Record<string, string> = {
  meat: '🥩',
  wheat: '🌾',
  rice: '🍚',
  onion: '🧅',
  salt: '🧂',
  water: '💧',
  kurt: '🧀',
  milk: '🥛',
  apple: '🍎',
  candy: '🍬',
  soda: '🥤',
  chocolate: '🍫',
  icecream: '🍦',
  cake: '🎂',
};

export function IngredientCard({ ingredient, label, dragging = false, onDragStateChange, onSelect, leaving = false }: IngredientCardProps) {
  const emoji = EMOJI_MAP[ingredient.id] ?? '🥄';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', ingredient.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    onDragStateChange?.(ingredient.id);
  };

  const handleDragEnd = () => {
    onDragStateChange?.(null);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`ingredient-card ${dragging ? 'ingredient-card--dragging' : ''} ${leaving ? 'ingredient-card--leaving' : ''}`}
      data-ingredient-id={ingredient.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      aria-label={label}
      onClick={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (!leaving) onSelect?.(ingredient.id, el);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).click();
        }
      }}
    >
      <span className="ingredient-card__emoji" aria-hidden>{emoji}</span>
      <span className="ingredient-card__label">{label}</span>
    </div>
  );
}
