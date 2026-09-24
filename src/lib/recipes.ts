import { unstable_cache } from "next/cache";
import { fetchAllRecipesFromPaprika, PaprikaRecipe } from "./paprika-client";
import { Recipe, Category } from "@/interfaces/recipe";

// TODO eventually consider Next's cacheComponents/"use cache" directive
// instead of unstable_cache - skipped for now since that flag changes
// caching behavior app-wide and this is the only page that needs it.

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "") || "recipe"
  );
}

function toHttps(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\//, "https://");
}

function slugsFor(recipes: PaprikaRecipe[]): Map<string, string> {
  const seen = new Map<string, number>();
  const slugsByUid = new Map<string, string>();

  for (const recipe of recipes) {
    const base = slugify(recipe.name);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${recipe.uid.slice(0, 6).toLowerCase()}`;
    slugsByUid.set(recipe.uid, slug);
  }

  return slugsByUid;
}

const getCachedRecipeData = unstable_cache(
  async (): Promise<{ recipes: Recipe[]; categories: Category[] }> => {
    const { recipes: rawRecipes, categories: rawCategories } =
      await fetchAllRecipesFromPaprika();

    const activeRecipes = rawRecipes
      .filter((r) => !r.in_trash)
      .sort((a, b) => a.name.localeCompare(b.name));

    const categoryNames = new Map(
      rawCategories.map((c) => [c.uid, c.name.trim()])
    );
    const slugsByUid = slugsFor(activeRecipes);

    const recipes: Recipe[] = activeRecipes.map((r) => ({
      uid: r.uid,
      slug: slugsByUid.get(r.uid)!,
      title: r.name,
      ingredients: r.ingredients,
      directions: r.directions,
      servings: r.servings || null,
      prepTime: r.prep_time || null,
      cookTime: r.cook_time || null,
      totalTime: r.total_time || null,
      sourceUrl: r.source_url || null,
      photoUrl: toHttps(r.photo_url) ?? toHttps(r.image_url),
      categories: (r.categories || [])
        .map((uid) => categoryNames.get(uid))
        .filter((name): name is string => !!name),
    }));

    const categories: Category[] = rawCategories
      .map((c) => ({
        uid: c.uid,
        name: c.name.trim(),
        parentUid: c.parent_uid,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { recipes, categories };
  },
  ["paprika-recipes"],
  { revalidate: 3600 }
);

export async function getAllRecipes(): Promise<Recipe[]> {
  const { recipes } = await getCachedRecipeData();
  return recipes;
}

export async function getAllCategories(): Promise<Category[]> {
  const { categories } = await getCachedRecipeData();
  return categories;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  const recipes = await getAllRecipes();
  return recipes.find((r) => r.slug === slug);
}
