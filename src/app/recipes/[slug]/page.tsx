import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipeBySlug } from "@/lib/recipes";
import Alert from "@/components/alert";
import Container from "@/components/container";
import { RecipeHeader } from "@/components/recipe/recipe-header";
import { RecipeBody } from "@/components/recipe/recipe-body";
import { RecipeWipNotice } from "@/components/recipe/recipe-wip-notice";

export default async function RecipePage(props: Params) {
  const params = await props.params;

  let recipe;
  try {
    recipe = await getRecipeBySlug(params.slug);
  } catch (error) {
    console.error("Failed to load recipe from Paprika:", error);
    return notFound();
  }

  if (!recipe) {
    return notFound();
  }

  return (
    <main>
      <Alert />
      <Container>
        <article className="mb-32">
          <RecipeWipNotice />
          <RecipeHeader
            title={recipe.title}
            photoUrl={recipe.photoUrl}
            servings={recipe.servings}
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            totalTime={recipe.totalTime}
            categories={recipe.categories}
          />
          <RecipeBody
            ingredients={recipe.ingredients}
            directions={recipe.directions}
            sourceUrl={recipe.sourceUrl}
          />
        </article>
      </Container>
    </main>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const recipe = await getRecipeBySlug(params.slug).catch(() => undefined);
  return { title: recipe ? `${recipe.title} | Recipes` : "Recipe" };
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};
