type Props = {
  ingredients: string;
  directions: string;
  sourceUrl: string | null;
};

export function RecipeBody({ ingredients, directions, sourceUrl }: Props) {
  const ingredientLines = ingredients
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const directionParagraphs = directions
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto">
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1">
          {ingredientLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Directions</h2>
        <div className="space-y-4">
          {directionParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      {sourceUrl && (
        <p className="text-sm text-gray-600">
          Source:{" "}
          <a
            href={sourceUrl}
            className="underline hover:text-teal-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            {sourceUrl}
          </a>
        </p>
      )}
    </div>
  );
}
