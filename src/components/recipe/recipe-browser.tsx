"use client";

import { useMemo, useState } from "react";
import { Recipe, Category } from "@/interfaces/recipe";
import { RecipeList } from "./recipe-list";

type Props = {
  recipes: Recipe[];
  categories: Category[];
};

export function RecipeBrowser({ recipes, categories }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const usedCategoryNames = useMemo(() => {
    const used = new Set<string>();
    recipes.forEach((r) => r.categories.forEach((c) => used.add(c)));
    return categories.map((c) => c.name).filter((name) => used.has(name));
  }, [recipes, categories]);

  const filtered = useMemo(
    () =>
      selected ? recipes.filter((r) => r.categories.includes(selected)) : recipes,
    [recipes, selected]
  );

  if (usedCategoryNames.length === 0) {
    return <RecipeList recipes={recipes} />;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => setSelected(null)}
          className={`text-sm rounded-full px-3 py-1 border transition-colors ${
            selected === null
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
          }`}
        >
          All
        </button>
        {usedCategoryNames.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`text-sm rounded-full px-3 py-1 border transition-colors ${
              selected === name
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <RecipeList recipes={filtered} />
    </div>
  );
}
