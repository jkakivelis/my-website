import { Recipe } from "@/interfaces/recipe";
import { RecipePreview } from "./recipe-preview";

type Props = {
  recipes: Recipe[];
};

export function RecipeList({ recipes }: Props) {
  if (recipes.length === 0) {
    return (
      <p className="text-center text-gray-600 mb-32">
        Recipes are temporarily unavailable. Please check back later.
      </p>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-32">
        {recipes.map((recipe) => (
          <RecipePreview
            key={recipe.uid}
            title={recipe.title}
            slug={recipe.slug}
            photoUrl={recipe.photoUrl}
          />
        ))}
      </div>
    </section>
  );
}
