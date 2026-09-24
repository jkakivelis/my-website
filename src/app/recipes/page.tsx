import Alert from "@/components/alert";
import Container from "@/components/container";
import { RecipeBrowser } from "@/components/recipe/recipe-browser";
import { getAllCategories, getAllRecipes } from "@/lib/recipes";

export default async function Recipes() {
  let recipes: Awaited<ReturnType<typeof getAllRecipes>> = [];
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    [recipes, categories] = await Promise.all([
      getAllRecipes(),
      getAllCategories(),
    ]);
  } catch (error) {
    console.error("Failed to load recipes from Paprika:", error);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 via-orange-500 to-white">
      <Alert />
      <Container>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none my-12 text-center">
          Recipes
        </h1>
        <RecipeBrowser recipes={recipes} categories={categories} />
      </Container>
    </main>
  );
}
