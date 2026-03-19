export type Ingredient = {
  id: string;
  isCorrect: boolean;
  nameKey: string;
  image: string | null;
};

export const INGREDIENTS: Ingredient[] = [
  // Correct: Nauryz koje ingredients — water, dried meat, millet, wheat, rice, butter, airan, salt
  { id: 'water', isCorrect: true, nameKey: 'ingredients.water', image: null },
  { id: 'driedMeat', isCorrect: true, nameKey: 'ingredients.driedMeat', image: null },
  { id: 'millet', isCorrect: true, nameKey: 'ingredients.millet', image: null },
  { id: 'wheat', isCorrect: true, nameKey: 'ingredients.wheat', image: null },
  { id: 'rice', isCorrect: true, nameKey: 'ingredients.rice', image: null },
  { id: 'butter', isCorrect: true, nameKey: 'ingredients.butter', image: null },
  { id: 'airan', isCorrect: true, nameKey: 'ingredients.airan', image: null },
  { id: 'salt', isCorrect: true, nameKey: 'ingredients.salt', image: null },
  // Wrong: not for Nauryz koje
  { id: 'onion', isCorrect: false, nameKey: 'ingredients.onion', image: null },
  { id: 'apple', isCorrect: false, nameKey: 'ingredients.apple', image: null },
  { id: 'candy', isCorrect: false, nameKey: 'ingredients.candy', image: null },
  { id: 'soda', isCorrect: false, nameKey: 'ingredients.soda', image: null },
  { id: 'chocolate', isCorrect: false, nameKey: 'ingredients.chocolate', image: null },
  { id: 'icecream', isCorrect: false, nameKey: 'ingredients.icecream', image: null },
  { id: 'cake', isCorrect: false, nameKey: 'ingredients.cake', image: null },
];

export const CORRECT_IDS: string[] = INGREDIENTS.filter((i) => i.isCorrect).map((i) => i.id);

export function shuffleIngredients<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
