export type Ingredient = {
  id: string;
  isCorrect: boolean;
  nameKey: string;
  image: string | null;
};

export const INGREDIENTS: Ingredient[] = [
  // Correct: Nauryz koje ingredients
  { id: 'meat', isCorrect: true, nameKey: 'ingredients.meat', image: null },
  { id: 'wheat', isCorrect: true, nameKey: 'ingredients.wheat', image: null },
  { id: 'rice', isCorrect: true, nameKey: 'ingredients.rice', image: null },
  { id: 'onion', isCorrect: true, nameKey: 'ingredients.onion', image: null },
  { id: 'salt', isCorrect: true, nameKey: 'ingredients.salt', image: null },
  { id: 'water', isCorrect: true, nameKey: 'ingredients.water', image: null },
  { id: 'kurt', isCorrect: true, nameKey: 'ingredients.kurt', image: null },
  { id: 'milk', isCorrect: true, nameKey: 'ingredients.milk', image: null },
  // Wrong: not for Nauryz koje
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
