export type Recipe = {
  uid: string;
  slug: string;
  title: string;
  ingredients: string;
  directions: string;
  servings: string | null;
  prepTime: string | null;
  cookTime: string | null;
  totalTime: string | null;
  sourceUrl: string | null;
  photoUrl: string | null;
  categories: string[];
};

export type Category = {
  uid: string;
  name: string;
  parentUid: string | null;
};
