import "server-only";

// Thin TypeScript port of the login + sync endpoints documented by
// https://github.com/johnwbyrd/kappari (a reverse-engineered spec for
// Paprika Recipe Manager 3's API). Uses the password-only v1 login flow,
// which kappari's authentication.md confirms works against the v2 sync
// endpoints without needing the license/RSA signature dance.

const BASE_URL = "https://www.paprikaapp.com/api";
const USER_AGENT = "Paprika Recipe Manager 3/3.3.1 (Macintosh; OS X 14.0)";

export type PaprikaRecipeSummary = {
  uid: string;
  hash: string;
};

export type PaprikaRecipe = {
  uid: string;
  name: string;
  ingredients: string;
  directions: string;
  description: string | null;
  servings: string | null;
  prep_time: string | null;
  cook_time: string | null;
  total_time: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  photo_url: string | null;
  photo_large: string | null;
  rating: number;
  categories: string[];
  in_trash: boolean;
  created: string;
};

export type PaprikaCategory = {
  uid: string;
  name: string;
  parent_uid: string | null;
  order_flag: number;
};

// NOTE: /recipes is statically prerendered with ISR (see the "use cache"
// wrapper in recipes.ts), which means credentials must be available to
// the Amplify BUILD step, not just the runtime - a build without them
// bakes in the "recipes unavailable" fallback until the first hourly
// background revalidation succeeds.
//
// Supports two ways of supplying credentials:
//  - Plain PAPRIKA_EMAIL / PAPRIKA_PASSWORD env vars (used for local dev
//    via .env.local).
//  - Amplify Gen 1 "environment secrets" (SSM Parameter Store backed),
//    which Amplify exposes as a single JSON blob in process.env.secrets
//    rather than as individual env vars - see
//    https://docs.aws.amazon.com/amplify/latest/userguide/environment-secrets.html
function getPaprikaCredentials(): { email: string; password: string } {
  if (process.env.secrets) {
    const secrets = JSON.parse(process.env.secrets) as Record<string, string>;
    if (secrets.PAPRIKA_EMAIL && secrets.PAPRIKA_PASSWORD) {
      return { email: secrets.PAPRIKA_EMAIL, password: secrets.PAPRIKA_PASSWORD };
    }
  }

  const email = process.env.PAPRIKA_EMAIL;
  const password = process.env.PAPRIKA_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Paprika credentials not found: set PAPRIKA_EMAIL/PAPRIKA_PASSWORD " +
        "(env vars or Amplify environment secrets) to fetch recipes"
    );
  }
  return { email, password };
}

async function paprikaLogin(): Promise<string> {
  const { email, password } = getPaprikaCredentials();

  const form = new FormData();
  form.set("email", email);
  form.set("password", password);

  const response = await fetch(`${BASE_URL}/v1/account/login/`, {
    method: "POST",
    body: form,
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(
      `Paprika login failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.result.token as string;
}

// Paprika's servers reset connections when hit with too much concurrency
// at once (observed ~60% failure rate fetching all recipes in parallel,
// 0% at this concurrency) - fetch recipe details in small batches instead.
const RECIPE_FETCH_CONCURRENCY = 5;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function paprikaGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Paprika request to ${path} failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.result as T;
}

export async function fetchAllRecipesFromPaprika(): Promise<{
  recipes: PaprikaRecipe[];
  categories: PaprikaCategory[];
}> {
  const token = await paprikaLogin();

  const [summaries, categories] = await Promise.all([
    paprikaGet<PaprikaRecipeSummary[]>("/v2/sync/recipes/", token),
    paprikaGet<PaprikaCategory[]>("/v2/sync/categories/", token),
  ]);

  const recipes = await mapWithConcurrency(
    summaries,
    RECIPE_FETCH_CONCURRENCY,
    (summary) => paprikaGet<PaprikaRecipe>(`/v2/sync/recipe/${summary.uid}/`, token)
  );

  return { recipes, categories };
}
